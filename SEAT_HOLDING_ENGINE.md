# 🎫 Seat Holding Engine - Complete Implementation Guide

## 📋 System Overview

The Seat Holding Engine is the **core module** of your platform that manages temporary seat reservations with token-based payments and automatic expiry with waitlist support.

### Key Features:
- ✅ **Token-based Holds**: Pay token amount to temporarily reserve a seat
- ✅ **Automatic Expiry**: Configurable timer (5 min - 24 hours) with auto-refund
- ✅ **Waitlist Queue**: When seats unavailable, users auto-queue with position tracking
- ✅ **Slot Redistribution**: When hold expires, slot offered to next in queue
- ✅ **Race Condition Protection**: Atomic database transactions prevent overselling
- ✅ **State Machine**: Complete lifecycle tracking (Active → Confirmed/Released/Expired)
- ✅ **Admin Control**: Fully configurable via SystemSettings (no code changes needed)
- ✅ **Notification Ready**: Events for expiry, expiring soon, and waitlist offers

---

## 🏗️ Architecture

### Models Created:
1. **Hold** - Individual hold records with state tracking
2. **Waitlist** - Queue management with position tracking
3. **SystemSetting** - Admin-configurable parameters
4. **Events** - HoldExpired, HoldExpiringSoon
5. **Job** - ProcessHoldExpirations (scheduler)
6. **Command** - holds:process-expirations (CLI)

### Database Schema:

#### **holds** table:
```sql
id, user_id, experience_id, expires_at, status, 
source, confirmed_at, released_at, expired_at, 
release_reason, expire_reason, created_at
```

#### **waitlists** table:
```sql
id, user_id, experience_id, hold_id, position, status, 
offered_at, offer_expires_at, notes, created_at, unique(user_id, experience_id)
```

#### **system_settings** table:
```sql
id, key, value (JSON), description, type, unique(key)
```

---

## 🔄 Hold State Machine

### Hold Statuses:
- **ACTIVE** - User is holding the seat (countdown running)
- **CONFIRMED** - User paid full amount, hold → booking
- **RELEASED** - User voluntarily released hold (token refunded)
- **EXPIRED** - Timer ran out (auto-expired, token refunded)

### State Transitions:

```
ACTIVE ──────→ CONFIRMED (user calls /holds/{id}/confirm)
  │                        ↓ Deduct remaining amount
  │                        Creates Booking record
  │
  ├──→ RELEASED (user calls /holds/{id}/release)
  │         ↓ Refund token immediately
  │         Offer slot to next in waitlist
  │
  └──→ EXPIRED (scheduler: holds:process-expirations every 5 min)
           ↓ Refund token automatically
           Offer slot to next in waitlist
```

---

## ⚙️ Configuration Settings (SystemSetting Model)

### Hold Configuration:
```
default_hold_duration_minutes = 30          # Default: 30 min
min_hold_duration_minutes = 5               # Allow 5 min minimum
max_hold_duration_minutes = 1440            # Allow up to 24 hours
concurrent_holds_per_user = 5               # Max active holds per user
```

### Waitlist Configuration:
```
waitlist_enabled = true                     # Enable waitlist
waitlist_offer_duration_minutes = 10        # Offer valid for 10 min
max_waitlist_size = 1000                    # Per experience
```

### Payment Configuration:
```
hold_token_percentage = 25                  # Token = 25% of full price
min_wallet_balance_for_hold = 100          # Min ₹100 in wallet
```

### Refund Configuration:
```
refund_policy_on_expiry = 'full'           # 'full' or 'partial'
forfeit_percentage_on_expiry = 0           # % to forfeit (if partial)
```

### Notification Configuration:
```
notify_user_on_hold_expiry = true          # Send expiry alerts
notify_user_expiring_soon_minutes = 5      # Alert 5 min before
notify_user_on_waitlist_offer = true       # Notify on offer
```

---

## 📊 Data Flow

### 1️⃣ HOLD CREATION FLOW (Token Payment)

```
User clicks "SECURE ACCESS" 
    ↓
POST /holds → HoldController@store
    ↓
✓ Check booking_mode supports hold
✓ Check wallet has sufficient token amount
✓ DB::transaction() START
    - Get active holds count
    - Get confirmed bookings count
    - Calculate available seats
    - If NO availability → Add to Waitlist (position = last + 1)
    - If availability → Deduct token from wallet
    - Create WalletTransaction (debit)
    - Create Hold record (active, source=direct)
    ↓
Redirect to /holds/{id} (countdown timer)
```

### 2️⃣ HOLD CONFIRMATION FLOW (Full Payment)

```
User clicks "CONFIRM BOOKING" on Active Hold
    ↓
POST /holds/{id}/confirm → HoldController@confirm
    ↓
✓ Verify hold still active
✓ Verify hold NOT expired
✓ Calculate: remaining_amount = full_price - token_paid
✓ DB::transaction() START
    - If remaining_amount > 0, deduct from wallet
    - Create WalletTransaction (if deducted)
    - Create Booking record (hold_confirmed, confirmed status)
    - Update Hold → CONFIRMED
    ↓
Redirect to /bookings/{id}
```

### 3️⃣ HOLD RELEASE FLOW (User Cancellation)

```
User clicks "RELEASE HOLD" on Active Hold
    ↓
POST /holds/{id}/release → HoldController@release
    ↓
✓ Verify hold still active
✓ DB::transaction() START
    - Refund token to wallet immediately
    - Create WalletTransaction (credit)
    - Update Hold → RELEASED (reason=user_requested)
    - Get next in waitlist for this experience
    - If exists → Make offer (status=offered, timer starts)
    ↓
Redirect to /holds → show success message
```

### 4️⃣ AUTO-EXPIRY FLOW (Scheduler)

```
✓ Every 5 minutes: php artisan holds:process-expirations
    ↓
ProcessHoldExpirations::handle()
    │
    ├─→ processExpiredHolds()
    │   - Find all ACTIVE holds with expires_at <= NOW
    │   - For each hold:
    │       - Update to EXPIRED
    │       - Event: HoldExpired (for notifications)
    │       - Refund token to wallet
    │       - Get next in waitlist
    │       - Make offer (10 min countdown)
    │
    └─→ processExpiringHolds()
        - Find ACTIVE holds expiring within 5 min
        - For each hold:
            - Event: HoldExpiringSoon (push notification)
            - Mark as notified
```

### 5️⃣ WAITLIST OFFER ACCEPTANCE

```
System offers slot to waitlist user (offer expires in 10 min)
    ↓
User receives notification: "Slot available! Confirm within 10 min"
    ↓
If User clicks "ACCEPT OFFER":
    - Create new Hold (source=waitlist)
    - Deduct token from wallet
    - Update Waitlist → ACCEPTED
    - Redirect to /holds/{new_id} (countdown timer)
    ↓
If User clicks "REJECT" OR offer expires:
    - Update Waitlist → REJECTED or EXPIRED
    - Get next in queue
    - Make offer to them
    - Repeat
```

---

## 🚀 Setup & Migration Steps

### Step 1: Run Migrations
```bash
php artisan migrate
```

This will create:
- `system_settings` table
- `waitlists` table
- Update `holds` table with new columns

### Step 2: Seed Default Settings
```bash
php artisan db:seed --class=SystemSettingSeeder
```

This populates default values for all configuration parameters.

### Step 3: Enable Laravel Scheduler
Add to crontab:
```bash
* * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
```

This runs the expiry job every 5 minutes automatically.

### Step 4: Configure Queue (Optional but Recommended)
Update `.env`:
```env
QUEUE_CONNECTION=database
```

Then add migration for queue jobs:
```bash
php artisan queue:table
php artisan migrate
```

Start queue worker:
```bash
php artisan queue:work
```

---

## 📱 Frontend Components Needed

### Create/Update Pages:

#### **Holds/Active.jsx** (Show countdown timer)
```jsx
- Display hold details, experience info
- Countdown timer showing seconds remaining
- Progress bar (full → empty as time expires)
- "Confirm Booking" button (deduct remaining amount)
- "Release Hold" button (refund token)
- Warning alert when < 5 min remaining
```

#### **Holds/Index.jsx** (List all holds)
```jsx
- Tabs: Active | Expiring Soon | Past
- Waitlist tab: Show queue position, offer status
- For each hold:
  - Experience image, name, price
  - Time remaining (if active)
  - Buttons: View details, Release, Confirm
- For waitlist:
  - Queue position (#3 of 50)
  - Accept/reject offer (if offered)
```

#### **Admin/Settings/Index.jsx** (Settings panel)
```jsx
- Grouped categories: Hold System, Waitlist, Payments, etc.
- Form fields for each setting (input, toggle, select)
- Save button (single or batch update)
- Reset to defaults button
- Read-only descriptions for each setting
```

---

## 🔒 Race Condition Protection

### The Problem:
User A and User B both see last seat available. Both try to hold it → Overselling!

### The Solution:
**Atomic Database Transactions**

```php
DB::transaction(function () {
    // Check availability
    $available = Experience::capacity - (active_holds + confirmed_bookings);
    
    // If available, deduct token AND create hold in single transaction
    // If transaction fails halfway, database rolls back to initial state
    // No partial operations = no seat overselling
});
```

All critical operations in HoldController use `DB::transaction()`:
- ✅ store() - Create hold
- ✅ confirm() - Payment & booking
- ✅ release() - Refund & waitlist offer

---

## 📞 Event-Driven Notifications

### Events Fired:
1. **HoldExpired** - When hold auto-expires
2. **HoldExpiringSoon** - When < 5 minutes remaining

### Implementation:
```php
event(new HoldExpired($hold));           // Broadcast on private channel
event(new HoldExpiringSoon($hold));      // Send push notification
```

### Listen in Frontend:
```javascript
// Subscribe to private hold updates
Echo.private(`user.${userId}`)
    .listen('HoldExpired', (e) => {
        // Show toast: "Hold expired, token refunded"
    })
    .listen('HoldExpiringSoon', (e) => {
        // Show warning: "30 seconds left to confirm!"
    });
```

---

## 📊 Admin Dashboard Metrics

Should display on admin panel:
```
- Total active holds: 1,234
- Holds expiring this hour: 56
- Waitlist users: 789
- Token amount in wallets: ₹45,000
- Refunded today: ₹12,000
- Avg hold duration: 18 min
- Conversion rate (hold → booking): 72%
```

---

## 🧪 Testing Checklist

### Unit Tests:
- [ ] Hold creation with wallet deduction
- [ ] Hold confirmation with remaining payment
- [ ] Hold release with refund
- [ ] Hold auto-expiry
- [ ] Waitlist operations (add, offer, accept, reject)
- [ ] State transitions

### Integration Tests:
- [ ] Complete flow: Hold → Confirm → Booking
- [ ] Race condition: Simultaneous hold attempts
- [ ] Concurrent holds per user limit
- [ ] Scheduler job execution
- [ ] Event broadcasting

### Manual Testing:
- [ ] Create hold, watch countdown timer
- [ ] Confirm booking before expiry
- [ ] Release and see refund in wallet
- [ ] Test as 2nd user with no availability (should queue)
- [ ] Wait for first hold to expire (should offer to 2nd)

---

## 🔧 API Endpoints

### User Endpoints:
```
POST   /holds                    # Create hold
GET    /holds                    # List user's holds
GET    /holds/{id}               # View specific hold
POST   /holds/{id}/confirm       # Confirm booking
POST   /holds/{id}/release       # Release hold

GET    /waitlist                 # View user's waitlist position
POST   /waitlist/{id}/accept     # Accept waitlist offer
POST   /waitlist/{id}/reject     # Reject offer
```

### Admin Endpoints:
```
GET    /admin/settings           # View all settings
PATCH  /admin/settings/{id}      # Update setting
POST   /admin/settings/batch     # Batch update
POST   /admin/settings/reset     # Reset to defaults

GET    /admin/analytics/holds    # Hold statistics
GET    /admin/holds              # All holds (admin view)
```

---

## 🎯 Future Enhancements

1. **Priority Access** - VIP users get longer hold times
2. **Dynamic Token Pricing** - Adjust token % based on demand
3. **Hold Extensions** - Allow user to extend expiry time
4. **Cancellation Policies** - Different refund % at different times
5. **Analytics Dashboard** - Real-time metrics for admins & partners
6. **Email/SMS Notifications** - In addition to push
7. **Mobile App Integration** - Native iOS/Android apps
8. **Rate Limiting** - Prevent spam holds

---

## ✅ Implementation Checklist

- [ ] Run migrations
- [ ] Seed system settings
- [ ] Enable Laravel scheduler in crontab
- [ ] Create admin settings UI page
- [ ] Update Holds pages with confirm/release buttons
- [ ] Add event listeners for notifications
- [ ] Test complete flow end-to-end
- [ ] Monitor scheduler execution (logs)
- [ ] Deploy to production

---

## 📚 Files Created/Modified

### New Files:
- `app/Models/SystemSetting.php`
- `app/Models/Waitlist.php`
- `app/Jobs/ProcessHoldExpirations.php`
- `app/Events/HoldExpired.php`
- `app/Events/HoldExpiringSoon.php`
- `app/Console/Commands/ProcessHoldExpirationsCommand.php`
- `app/Http/Controllers/Admin/SystemSettingController.php`
- `database/migrations/2026_02_18_000001_create_system_settings_table.php`
- `database/migrations/2026_02_18_000002_create_waitlists_table.php`
- `database/migrations/2026_02_18_000003_enhance_holds_table.php`
- `database/seeders/SystemSettingSeeder.php`

### Modified Files:
- `app/Models/Hold.php` (enhanced state machine)
- `app/Http/Controllers/HoldController.php` (complete rewrite)
- `app/Console/Kernel.php` (added scheduler)

---

## 🚨 Production Deployment Checklist

- [ ] Database backups configured
- [ ] Queue worker running (if using queue)
- [ ] Laravel scheduler enabled in crontab
- [ ] Error logging monitored
- [ ] Rate limiting enabled
- [ ] Load testing done
- [ ] Concurrent user testing done
- [ ] Admin settings accessible only to admins
- [ ] Events broadcasting configured
- [ ] API endpoints secured

---

**Last Updated**: February 18, 2026
**Version**: 1.0.0
