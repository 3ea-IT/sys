# 🚀 SEAT HOLDING ENGINE - QUICK START GUIDE

## ✅ What's Been Implemented (v1.0)

### Core Systems:
- ✅ **Hold State Machine** - Active → Confirmed/Released/Expired
- ✅ **Atomic Transactions** - Race condition protection
- ✅ **Waitlist Queue** - With position tracking
- ✅ **Auto-Expiry Job** - Runs every 5 minutes via scheduler
- ✅ **Token System** - Configurable % of full price
- ✅ **Admin Settings** - Fully configurable without code changes
- ✅ **Event Broadcasting** - Real-time notifications ready
- ✅ **Database Schema** - 3 new tables + enhanced existing

---

## 🔧 DEPLOYMENT STEPS (Do This First!)

### Step 1: Database Migrations
```bash
cd c:\xampp\htdocs\secure-seat
php artisan migrate
```

**Expected Output:**
```
Migrating: 2026_02_18_000001_create_system_settings_table
Migrated:  2026_02_18_000001_create_system_settings_table (XXms)
Migrating: 2026_02_18_000002_create_waitlists_table
Migrated:  2026_02_18_000002_create_waitlists_table (XXms)
Migrating: 2026_02_18_000003_enhance_holds_table
Migrated:  2026_02_18_000003_enhance_holds_table (XXms)
```

### Step 2: Seed Default Settings
```bash
php artisan db:seed --class=SystemSettingSeeder
```

**Expected Output:**
```
Database seeded successfully.
System settings seeded successfully.
```

### Step 3: Enable Laravel Scheduler

**On Windows (XAMPP/Local):**
```bash
# Run this in a separate terminal to test scheduler
php artisan schedule:run
```

**On Linux/Production:**
Add to crontab:
```bash
crontab -e

# Add this line:
* * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
```

### Step 4: Test the Scheduler
```bash
# Manually trigger the hold expiration job
php artisan holds:process-expirations
```

**Expected Output:**
```
Processing hold expirations...
Hold expiration job dispatched successfully.
```

---

## 📱 FRONTEND UPDATES NEEDED

### 1. Update Holds/Active.jsx
Add confirm button functionality:
```jsx
import { Button } from "@/Components/ui/Button";

const handleConfirm = async () => {
    try {
        const response = await fetch(`/holds/${hold.id}/confirm`, {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
            },
        });
        // Redirect on success
    } catch (error) {
        console.error("Confirmation failed:", error);
    }
};

return (
    <div>
        {/* Existing countdown timer */}
        <button onClick={handleConfirm} className="btn btn-primary">
            Confirm Booking
        </button>
        <button onClick={handleRelease} className="btn btn-outline">
            Release Hold
        </button>
    </div>
);
```

### 2. Update Holds/Index.jsx
Add waitlist tab:
```jsx
const tabs = ["Active", "Expiring Soon", "Past", "Waitlist"];

return (
    <div>
        {/* Tab Navigation */}
        {activeTab === "Waitlist" && (
            <div>
                <h3>You are #{waitlist[0]?.position} in the queue</h3>
                {/* Show queue position info */}
            </div>
        )}
    </div>
);
```

### 3. Update Experience/Show.jsx
Add "Secure Access" button:
```jsx
const handleSecureAccess = async () => {
    // POST /holds
    // Create hold → Deduct token → Redirect to /holds/{id}
};

return (
    <div>
        <button onClick={handleSecureAccess} className="btn btn-primary">
            🔒 Secure Access (₹{experience.hold_token})
        </button>
    </div>
);
```

---

## ⚙️ CONFIGURATION (Admin Panel)

### Access Admin Settings:
```
URL: /admin/settings
```

### Key Settings to Configure:

#### Hold Timing:
- `default_hold_duration_minutes` - Change from 30 to your preferred time
- `min_hold_duration_minutes` - Minimum allowed (avoid < 5 min)
- `max_hold_duration_minutes` - Maximum allowed (default 1440 = 24 hours)

#### Token Payment:
- `hold_token_percentage` - What % of full price is the token (default 25% = ₹25 for ₹100 ticket)
- `min_wallet_balance_for_hold` - Minimum ₹ required in wallet

#### Waitlist:
- `waitlist_enabled` - Toggle on/off
- `waitlist_offer_duration_minutes` - How long offer stays open (default 10 min)
- `max_waitlist_size` - Max queue size per experience

#### Refunds:
- `refund_policy_on_expiry` - 'full' or 'partial'
- `forfeit_percentage_on_expiry` - If partial, how much to keep

---

## 🔄 USER FLOWS

### Flow 1: Secure Access (Token Hold)
```
User clicks "Secure Access" on Experience
    ↓ (₹50 token deducted from wallet)
    ↓ Hold created with 30-min countdown
    ↓ User sees countdown timer
    ↓ Click "Confirm" → Full price charged → Booking created
       OR
       Click "Release" → ₹50 refunded → Hold released
       OR
       Wait 30 min → Auto-expired → ₹50 refunded
```

### Flow 2: No Seats Available
```
User clicks "Secure Access" but all seats taken
    ↓ NO deduction from wallet
    ↓ User added to waitlist (position #42)
    ↓ Notification: "You're in queue, we'll notify when available"
    ↓ Wait for first hold to expire or be released
    ↓ When seat frees up, user offered slot (10 min countdown)
    ↓ User clicks "Accept" → Hold created → Same as Flow 1
```

### Flow 3: Instant Booking (Full Payment)
```
User clicks "Book Now!" on Experience
    ↓ Full price charged immediately (₹100)
    ↓ Booking created with status=confirmed
    ↓ Ticket issued instantly
```

---

## 🧪 MANUAL TESTING

### Test 1: Create Hold
```
1. Go to any experience
2. Click "Secure Access"
3. Wallet balance decreased by hold_token
4. Redirected to /holds/{id} with countdown
```

### Test 2: Confirm Hold
```
1. On active hold page, click "Confirm Booking"
2. Wallet balance decreased by remaining amount
3. Booking created and visible in /bookings
4. Hold status → confirmed
```

### Test 3: Release Hold
```
1. On active hold page, click "Release Hold"
2. Wallet balance increased by hold_token
3. WalletTransaction created with type=credit
4. Hold status → released
```

### Test 4: Auto-Expiry
```
1. Create hold with 1 minute duration (set in admin settings)
2. Wait 1 minute
3. Run: php artisan holds:process-expirations
4. Hold status → expired
5. Wallet refunded automatically
6. Check logs in storage/logs/laravel.log
```

### Test 5: Waitlist
```
1. Create experience with capacity=1
2. User A creates hold (takes the seat)
3. User B tries to create hold
   - Should be added to waitlist (position #1)
   - No wallet deduction
4. User A releases hold
5. Run: php artisan holds:process-expirations
   - Slot offered to User B (status=offered)
6. If User B accepts within 10 min, new hold created
```

---

## 📊 DATABASE QUERIES

### Check Active Holds:
```sql
SELECT * FROM holds 
WHERE status = 'active' 
  AND expires_at > NOW()
ORDER BY expires_at ASC;
```

### Check Waitlist Status:
```sql
SELECT w.*, e.title, u.email 
FROM waitlists w
JOIN experiences e ON w.experience_id = e.id
JOIN users u ON w.user_id = u.id
WHERE w.status IN ('waiting', 'offered')
ORDER BY w.experience_id, w.position;
```

### Check System Settings:
```sql
SELECT key, value, description FROM system_settings ORDER BY key;
```

### Check Hold History:
```sql
SELECT h.*, e.title, u.email, 
       SEC_TO_TIME(TIMESTAMPDIFF(SECOND, h.created_at, h.expires_at)) as duration
FROM holds h
JOIN experiences e ON h.experience_id = e.id
JOIN users u ON h.user_id = u.id
ORDER BY h.created_at DESC LIMIT 20;
```

---

## 🚨 TROUBLESHOOTING

### Problem: "Hold not found" when confirming
**Solution:** Hold has expired. Check `expires_at` in database.
- Verify hold hasn't been auto-expired by scheduler
- Check current time vs expires_at timestamp

### Problem: "Insufficient wallet balance"
**Solution:** User doesn't have enough balance for remaining payment.
- Admin can add funds to user wallet
- Or user must release hold and top-up wallet

### Problem: Scheduler not running
**Solution:** 
- Verify crontab is set up (Linux) 
- Run manually: `php artisan schedule:run`
- Check logs: `tail -f storage/logs/laravel.log`

### Problem: Waitlist not working
**Solution:**
- Verify `waitlist_enabled` setting = true  
- Check waitlist records exist in database
- Ensure hold fully expires (scheduler runs)

### Problem: Notification not sent
**Solution:**
- Broadcasting must be configured in `.env`
- Check `BROADCAST_DRIVER` = 'pusher' or 'redis'
- Verify WebSocket connection in browser console

---

## 📈 MONITORING

### Check Scheduler Health:
```bash
tail -f storage/logs/laravel.log | grep "Hold expiration"
```

### Check Queue Status (if using database queue):
```bash
php artisan queue:work --tries=3 --timeout=90
```

### Monitor Active Holds:
```bash
php artisan tinker

> DB::table('holds')->where('status', 'active')->count();
// Returns count of all active holds
```

---

## 📞 SUPPORT

### Common Questions:

**Q: Can I change hold duration for each experience?**
A: Yes! Each experience has `hold_duration` field in database. Set it per experience.

**Q: What if user forgets to confirm within timeout?**
A: Auto-expires, token refunded, user goes to waitlist head if queue exists.

**Q: Can users extend their hold time?**
A: Not yet. Future enhancement: Add "extend by 5 min" button (costs 10% of token).

**Q: How do I offer manual slots to specific users?**
A: Future feature: Admin panel to manually offer/create holds for users.

**Q: Can I charge different token amounts to different users?**
A: Yes, set `hold_token` per experience (or create user roles with different rates).

---

## ✅ NEXT STEPS

1. ✅ Run migrations & seed settings
2. ✅ Enable scheduler
3. ⏳ Update Frontend pages (Holds, Experience show)
4. ⏳ Test complete flows manually
5. ⏳ Create Admin Settings UI
6. ⏳ Set up event listeners for notifications
7. ⏳ Monitor scheduler execution
8. ⏳ Deploy to production with monitoring

---

**Status**: Ready for Testing & Frontend Integration
**Version**: 1.0.0
**Last Updated**: February 18, 2026
