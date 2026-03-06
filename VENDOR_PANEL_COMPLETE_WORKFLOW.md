# Vendor Panel - Complete Workflow Explanation

## 🎯 Overview

The Vendor Panel is a complete ecosystem that handles vendor registration, experience management, customer bookings, and revenue settlements. Here's how it all works together.

---

## ⚡ CRITICAL: Payment Timing Reference

**This is essential to understand the entire system.**

### Instant Booking Flow:
```
Customer Clicks "BUY NOW" 
        ↓
Payment Gateway (Razorpay/Stripe)
        ↓
💳 PAYMENT PROCESSED ← PAYMENT HAPPENS HERE
        ↓
✅ Booking Created (status='confirmed')
        ↓
Vendor Receives Payment ✓ (Ready to serve)
        ↓
Later at Venue: Check-in = Just Attendance Validation (NO Payment)
```

**Timeline:**
- **Booking Time (Step 0s)**: Full ₹500 payment deducted
- **Immediately (Step 0s)**: Booking confirmed status set
- **At Venue (Later)**: Check-in just marks attendance - no payment involved

---

### Reservation/Hold Booking Flow:
```
Customer Clicks "RESERVE NOW" 
        ↓
💳 TOKEN PAYMENT PROCESSED ← PAYMENT 1 HAPPENS HERE (₹100)
        ↓
⏲️ Hold Created (status='active', timer running)
        ↓
Customer Clicks "Confirm Booking" (within 1 hour)
        ↓
💳 FINAL PAYMENT PROCESSED ← PAYMENT 2 HAPPENS HERE (₹800)
        ↓
✅ Booking Created (status='confirmed')
        ↓
Vendor Receives ₹900 Payment ✓ (Ready to serve)
        ↓
Later at Venue: Check-in = Just Attendance Validation (NO Payment)
```

**Timeline:**
- **Hold Time (Step 0s)**: ₹100 token deducted
- **Hold Confirmation (Step ~30min)**: ₹800 final payment deducted (total ₹900)
- **Immediately after**: Booking confirmed status set
- **At Venue (Later)**: Check-in just marks attendance - no payment involved

---

## ✅ Key Payment Rules:
1. **Payments are taken at booking/confirmation time, NEVER at check-in**
2. **Check-in is ONLY for attendance validation**
3. **No payment gateway calls at check-in**
4. **Vendor already has the money before customer arrives**
5. **Status 'validated' just confirms experience was delivered**

---

## 📋 FLOW 1: VENDOR REGISTRATION & APPROVAL

### Step 1: Vendor Application

A restaurant owner, event organizer, or ticket seller wants to list their product on Secure Seat:

```
ACTION BY VENDOR (Outside Panel):
├── Contact Admin/Support
├── Provide:
│   ├── Business Name: "XYZ Restaurants"
│   ├── Business Type: "Dining Access"
│   ├── Business License: "LIC123456"
│   ├── Tax ID: "TAX987654"
│   ├── Bank Details: Account info (encrypted)
│   └── Contact Info
└── Application Submitted
```

### Step 2: Admin Approval

Admin reviews the vendor application:

```
ACTION BY ADMIN (In Admin Panel):
├── Review Application
├── Verify Documents
├── Check Legitimacy
└── Decision:
    ├── IF VALID → Approve
    │   └── vendor_status = 'approved'
    │   └── vendor_approved_at = NOW()
    │   └── Email sent to vendor
    │
    └── IF INVALID → Reject
        └── vendor_status = 'rejected'
        └── vendor_rejection_reason = "License invalid"
        └── Email sent to vendor
```

**Database Update:**
```sql
UPDATE users 
SET vendor_status = 'approved', 
    vendor_approved_at = NOW() 
WHERE id = 1;
```

### Step 3: Vendor Activation

Vendor can now access the panel:

```
VENDOR LOGIN PROCESS:
├── Visit: /vendor/dashboard
├── Enter Credentials
├── System Checks:
│   ├── Is user authenticated? ✓
│   ├── Is role = 'vendor'? ✓
│   ├── Is vendor_status = 'approved'? ✓
│   └── Access GRANTED → Dashboard loaded
│
└── If Not Approved:
    └── 403 Forbidden Error
    └── Message: "Your account is not approved"
```

---

## 📺 FLOW 2: VENDOR DASHBOARD OVERVIEW

When vendor logs in, they see their dashboard:

```
VENDOR DASHBOARD SHOWS:
│
├── 📊 KEY METRICS (Real-time):
│   ├── Total Experiences: 5
│   ├── Total Bookings: 342
│   ├── Active Holds: 12
│   └── Total Revenue: ₹85,000
│
├── 📈 RECENT BOOKINGS:
│   ├── Customer 1: Concert Ticket - ₹500 - Confirmed
│   ├── Customer 2: Table Reserve - Token ₹100 - Held
│   ├── Customer 3: Workshop - ₹1,200 - Validated
│   └── ... (last 10 bookings)
│
├── ⚠️ ALERTS:
│   ├── 2 Experiences pending approval
│   ├── 5 Holds expiring in 1 hour
│   └── New booking from Customer X
│
└── 🎯 QUICK ACTIONS:
    ├── ➕ Create New Experience
    ├── 📊 View All Bookings
    ├── 📈 View Analytics
    └── 💰 View Settlements
```

---

## ➕ FLOW 3: EXPERIENCE CREATION

### Scenario: Restaurant Owner Creating a Table Reservation

```
STEP 1: START CREATION
├── Click "Create New Experience"
└── Redirected to: /vendor/experiences/create

STEP 2: FILL BASIC DETAILS
├── Title: "Premium Dining - Lunch Slot"
├── Category: "Dining Access"
├── Location: "123 Main Street, Downtown"
├── Description: "4-star fine dining, 2-3 hour experience"
├── Highlights: "Fresh ingredients, Chef selected, Wine pairing"
└── Upload Image: restaurant_photo.jpg

STEP 3: CHOOSE BOOKING MODE
│
├── Option A: INSTANT BOOKING (Full Payment)
│   ├── Price: ₹800 per table
│   ├── Available Seats: 20 tables
│   └── Customer pays ₹800 → Booking CONFIRMED immediately
│
├── Option B: RESERVATION MODE (Token-Based)
│   ├── Token Amount: ₹100 (refundable)
│   ├── Hold Duration: 1 hour (customer confirms later)
│   ├── Final Price: ₹700
│   └── Customer pays ₹100 → Seat HELD for 1 hour
│
└── Option C: BOTH MODES
    ├── Instant: ₹800 per table
    ├── Reservation: ₹100 token + ₹700 later
    └── Customer chooses which method

VENDOR CHOOSES: Option B (Reservation)
```

### Step 4: Set Capacity

```
CAPACITY SETTINGS:
├── Total Capacity: 50 (total tables available)
├── Capacity for Hold Mode: 50 (all reservation seats)
├── Capacity for Instant Mode: 0 (or split if choosing Both)
├── Priority Score: 75 (higher = appears higher in search)
└── Status: Active (customers can book)
```

### Step 5: Submit for Approval

```
SUBMISSION:
├── Form Validation:
│   ├── All required fields filled? ✓
│   ├── Pricing makes sense? ✓
│   ├── Image uploaded? ✓
│   └── Capacity > 0? ✓
│
├── Experience Created:
│   ├── approval_status = 'pending'
│   ├── status = 'active'
│   └── id = 101
│
├── Database Entry:
│   ├── vendors (users):
│   │   └── id: 1 (vendor owner)
│   │
│   └── experiences:
│       ├── id: 101
│       ├── vendor_id: 1 ✓ (linked!)
│       ├── title: "Premium Dining..."
│       ├── category: "Dining Access"
│       ├── hold_token: 100
│       ├── booking_mode: 'hold_only'
│       ├── capacity: 50
│       ├── approval_status: 'pending' ⏳
│       └── status: 'active'
│
└── Notification:
    ├── Vendor sees: "Submitted for admin approval"
    ├── Admin sees: "New experience to review"
    └── Email sent to admin
```

---

## ✅ FLOW 4: ADMIN APPROVES EXPERIENCE

```
ADMIN REVIEW:
├── Admin goes to Admin Panel
├── Reviews "Pending Experiences"
├── Clicks on "Premium Dining - Lunch Slot"
├── Checks:
│   ├── Business details valid? ✓
│   ├── Image quality acceptable? ✓
│   ├── Pricing reasonable? ✓
│   ├── Description clear? ✓
│   └── No violations? ✓
│
├── CLICKS: "APPROVE"
│
└── Database Update:
    UPDATE experiences 
    SET approval_status = 'approved' 
    WHERE id = 101;
    
    NOW: Experience is VISIBLE TO CUSTOMERS ✅
```

---

## 👥 FLOW 5: CUSTOMER BOOKS EXPERIENCE

### A. INSTANT BOOKING SCENARIO

**Setup:**
- Experience: Concert Tickets
- Vendor: Music Event LLC
- Price: ₹500 per ticket
- Booking Mode: INSTANT
- Capacity: 100 tickets
- Status: APPROVED ✓

```
CUSTOMER FLOW:
│
├── Step 1: DISCOVER
│   ├── Search: "Concerts near me"
│   ├── Filter: Price ₹100-₹1000
│   ├── Results show: Concert Event
│   └── Clicks: View Details
│
├── Step 2: VIEW DETAILS
│   ├── Title: Concert Event
│   ├── Price: ₹500
│   ├── Available: 87 tickets (100 - 13 sold)
│   ├── Booking Mode: INSTANT
│   └── Description & highlights
│
├── Step 3: BOOK NOW
│   ├── Clicks: "BUY NOW"
│   └── Proceeds to payment
│
├── Step 4: PAYMENT
│   ├── Amount: ₹500
│   ├── Method: Credit Card / UPI / Wallet
│   ├── Payment Gateway: Razorpay/Stripe
│   └── Transaction: Processing...
│
├── Step 5: ✅ CONFIRMATION (PAYMENT COMPLETE)
│   ├── Payment Status: SUCCESS ✓ ← PAYMENT DEDUCTED NOW
│   ├── Booking Record Created IMMEDIATELY:
│   │   ├── id: 5001
│   │   ├── user_id: 100 (customer)
│   │   ├── experience_id: 101 (concert)
│   │   ├── booking_type: 'instant'
│   │   ├── status: 'confirmed' ✅
│   │   ├── paid_amount: 500 ← LOCKED & PAID
│   │   └── created_at: 2026-02-20 14:30
│   │
│   ├── Customer Receives:
│   │   ├── Ticket Reference: #TIX-5001
│   │   ├── QR Code: [QR CODE IMAGE]
│   │   ├── Email Confirmation with Payment Receipt
│   │   └── ✅ Ready for immediate use
│   │
│   └── Capacity Updated:
│       └── Available: 86 tickets (100 - 14 sold)
│
└── Step 6: VENDOR RECEIVES PAYMENT (RIGHT NOW)
    ├── Vendor Dashboard updated:
    │   ├── Total Bookings: 343 (was 342)
    │   ├── Total Revenue: ₹85,500 (was ₹85,000) ← ₹500 added NOW
    │   └── Recent bookings shows new entry: ₹500 ✓
    │
    ├── Payment Status: COMPLETE ✅
    │   ├── Vendor already has the ₹500
    │   ├── No pending payments
    │   └── No further payment processing needed
    │
    └── Vendor can:
        ├── View Customer details
        ├── Prepare for check-in at venue
        └── Note: Check-in is just for attendance validation (no payment)
```

### B. RESERVATION BOOKING SCENARIO

**Setup:**
- Experience: Dining Table
- Vendor: Restaurant XYZ
- Token: ₹100 (refundable)
- Final Price: ₹800 (if confirmed)
- Hold Duration: 1 hour
- Booking Mode: RESERVATION
- Status: APPROVED ✓

```
CUSTOMER FLOW:
│
├── Step 1: DISCOVER & VIEW
│   ├── Finds: "Premium Table for 2"
│   ├── Sees: "Reserve Now - ₹100 token"
│   └── Clicks: "RESERVE NOW"
│
├── Step 2: 💳 TOKEN PAYMENT (RESERVATION - IMMEDIATE)
│   ├── Amount: ₹100 (refundable token)
│   ├── Purpose: Secure the table
│   ├── Payment: Processing...
│   └── Status: SUCCESS ✓ (TOKEN PAYMENT DEDUCTED NOW)
│
├── Step 3: ✅ HOLD CREATED (Reservation Active)
│   ├── Hold Record (NEW):
│   │   ├── id: 201
│   │   ├── user_id: 101
│   │   ├── experience_id: 101
│   │   ├── status: 'active'
│   │   ├── token_amount: 100 ← PAID NOW
│   │   ├── created_at: 2026-02-20 14:00
│   │   └── expires_at: 2026-02-20 15:00 ⏰
│   │
│   ├── Table Status:
│   │   ├── Booked? YES ✓
│   │   ├── Available to others? NO
│   │   └── Locked Until: 15:00 (1 hour)
│   │
│   └── Customer Receives:
│       ├── Hold Reference: #HOLD-201
│       ├── Timer: ⏱️ 1:00:00 remaining
│       ├── Option 1: "Confirm Booking" button
│       ├── Option 2: "Release Seat" button
│       └── Alert: "Confirm by 15:00 OR token at risk"
│
├── Step 4: 🎯 CUSTOMER DECIDES (Within 1 hour)
│   │
│   ├── SCENARIO A: CONFIRMS BOOKING ✓
│   │   ├── Clicks: "Confirm Booking"
│   │   ├── Pays: ₹800 (final payment) ← FULL PAYMENT NOW
│   │   ├── ₹100 token: Adjusted/applied to final payment
│   │   ├── Total Paid: ₹100 (token) + ₹800 (final) = ₹900
│   │   │
│   │   ├── Booking Created IMMEDIATELY after payment:
│   │   │   ├── id: 5002
│   │   │   ├── user_id: 101
│   │   │   ├── experience_id: 101
│   │   │   ├── booking_type: 'hold'
│   │   │   ├── status: 'confirmed' ✅
│   │   │   ├── paid_amount: 900 ← LOCKED & PAID NOW
│   │   │   └── hold_id: 201 (linked)
│   │   │
│   │   ├── Hold Updated:
│   │   │   ├── status: 'confirmed'
│   │   │   └── confirmed_at: NOW ← PAYMENT TIME
│   │   │
│   │   └── Customer Gets:
│   │       ├── Final Confirmation #RES-5002
│   │       ├── Receipt with payment details
│   │       ├── Reservation number for check-in
│   │       └── ✅ Reservation complete (payment done)
│   │
│   ├── SCENARIO B: RELEASES SEAT
│   │   ├── Clicks: "Cancel/Release Hold"
│   │   ├── Table Released:
│   │   │   └── Status: Available to others
│   │   │
│   │   ├── Hold Cancelled:
│   │   │   ├── status: 'released'
│   │   │   └── Token Refunded: ₹100 instantly
│   │   │
│   │   └── Customer can join WAITLIST if interested
│   │
│   └── SCENARIO C: NO ACTION (Timer Expires)
│       ├── Time: 15:00:00 - hold expires automatically
│       ├── Automatic Actions:
│       │   ├── status: 'expired'
│       │   ├── Token Status: Refunded per policy
│       │   ├── Table Released
│       │   └── Added to WAITLIST automatically
│       │
│       └── Customer Notification:
│           ├── "Your hold has expired"
│           ├── "Table returned to available"
│           └── "Your token has been refunded"
│
└── Step 5: VENDOR RECEIVES PAYMENT (UPON CONFIRMATION)
    ├── Vendor Dashboard:
    │   ├── New booking created: 5002
    │   ├── Payment received: ₹900 ← LOCKED NOW (not at check-in)
    │   ├── Total Revenue increased
    │   └── Status: 'confirmed' (customer ready to come)
    │
    ├── Payment Status: COMPLETE ✅
    │   ├── No further payments pending
    │   ├── Check-in at venue is just attendance validation
    │   └── No payment processing happens at check-in
    │
    └── Vendor can:
        ├── Contact customer with details
        ├── Prepare the table
        └── Note: Payment already secure, just await check-in
```

---

## 🎫 FLOW 6: BOOKING MANAGEMENT (Vendor Side)

```
VENDOR BOOKING MANAGEMENT:
│
├── ACCESS: /vendor/bookings
│
├── VIEW ALL BOOKINGS
│   ├── Default View: All 343 bookings
│   ├── Columns:
│   │   ├── Booking ID
│   │   ├── Customer Name
│   │   ├── Experience Title
│   │   ├── Booking Type (Instant/Hold)
│   │   ├── Status (Confirmed/Validated/Cancelled)
│   │   ├── Amount Paid
│   │   └── Date Booked
│   │
│   └── Filters:
│       ├── By Status: Confirmed, Validated, Cancelled
│       ├── By Experience
│       ├── By Date Range
│       └── Search by Customer Name
│
├── INDIVIDUAL BOOKING ACTIONS
│   │
│   ├── ACTION 1: VIEW DETAILS
│   │   └── Click on booking → See full details
│   │       ├── Customer info
│   │       ├── Contact number
│   │       ├── Experience details
│   │       ├── Amount & payment method
│   │       ├── Booking date/time
│   │       └── Special requests (if any)
│   │
│   ├── ACTION 2: CHECK-IN / VALIDATE (Attendance Only, NOT Payment)
│   │   ├── When: Customer arrives at venue
│   │   ├── Purpose: Confirm attendance, NOT process payment
│   │   │
│   │   ├── How:
│   │   │   ├── Option A: Scan QR code from ticket
│   │   │   └── Option B: Enter reference number manually
│   │   │
│   │   ├── System Actions:
│   │   │   ├── Verifies booking exists
│   │   │   ├── Checks status = 'confirmed'
│   │   │   └── Updates to status = 'validated' ✅
│   │   │
│   │   └── Result:
│   │       ├── Customer allowed entry
│   │       ├── Booking marked as attended
│   │       ├── ⚠️ No payment processed here
│   │       ├── Payment was already taken at:
│   │       │   ├── Instant: Booking creation time
│   │       │   └── Hold: Hold confirmation time
│   │       │
│   │       └── Note: Status 'validated' just confirms:
│   │           ├── Customer showed up
│   │           ├── Experience was delivered
│   │           └── Settlement can proceed (for vendor)
│   │
│   ├── ACTION 3: CANCEL BOOKING
│   │   ├── When: Customer cancels or vendor needs to cancel
│   │   ├── Status Check:
│   │   │   ├── Can cancel if: status = 'confirmed'
│   │   │   ├── Cannot cancel if: status = 'validated'
│   │   │   └── (Already attended customer)
│   │   │
│   │   ├── Process:
│   │   │   ├── Click "Cancel"
│   │   │   ├── status → 'cancelled'
│   │   │   ├── Initiate Refund
│   │   │   └── Customer Notified
│   │   │
│   │   └── Refund Policy:
│   │       ├── 7+ days before: Full refund
│   │       ├── 1-6 days: 50% refund
│   │       └── Day-of: No refund
│   │
│   └── ACTION 4: EXPORT DATA
│       ├── Format: CSV (Excel compatible)
│       ├── Columns: Booking ID, Name, Email, Amount, Status
│       ├── Filters: Date range, status
│       └── Use: Accounting, records, reconciliation
│
└── STATS SHOWN
    ├── Total Bookings: 343
    ├── Confirmed: 280
    ├── Validated: 50
    └── Cancelled: 13
```

---

## 💰 FLOW 7: SETTLEMENTS & PAYMENTS

```
SETTLEMENT TIMELINE:
│
├── Day 1-5: Bookings happen
│   ├── Customers pay: ₹500 (instant) or tokens (hold)
│   ├── Payment goes to: Platform's merchant account
│   ├── Booking status: 'confirmed' or 'validated'
│   └── Vendor sees: Dashboard metrics
│
├── Day 6-7: Settlement Processing
│   ├── System identifies:
│   │   ├── All validated bookings for week
│   │   ├── Calculates:
│   │   │   ├── Total: ₹50,000
│   │   │   ├── Platform Fee (5%): -₹2,500
│   │   │   ├── Tax (if applicable): -₹500
│   │   │   └── Final: ₹47,000 to vendor
│   │   │
│   │   └── Generates Settlement Record
│   │
│   └── Database Update:
│       UPDATE wallet_transactions 
│       SET status = 'settled'
│       WHERE week = current_week
│       AND vendor_id = 1;
│
├── Day 8: Payment Transfer
│   ├── Batch Processing:
│   │   ├── All vendor settlements compiled
│   │   ├── Payments initiated
│   │   └── Bank transfers initiated
│   │
│   └── Vendor Bank:
│       ├── ₹47,000 credited to vendor account
│       ├── Reference: SETTLE-WK05-001
│       └── Settlement notification sent
│
└── Vendor Dashboard: SETTLEMENTS PAGE
    ├── Total Earnings (All Time): ₹85,000
    │
    ├── Settlement History Table:
    │   ├── Date: 2026-02-20
    │   ├── Bookings Count: 45
    │   ├── Amount: ₹22,500
    │   ├── Status: Settled ✓
    │   │
    │   ├── Date: 2026-02-13
    │   ├── Bookings Count: 42
    │   ├── Amount: ₹21,000
    │   ├── Status: Settled ✓
    │   │
    │   └── ... (more settlement records)
    │
    └── Notes:
        ├── Only VALIDATED bookings count
        ├── Weekly settlement cycle
        ├── Deposits to registered bank account
        └── View detailed breakdown by date
```

---

## 🔄 FLOW 8: COMPLETE CUSTOMER JOURNEY EXAMPLE

### Real Example: Concert Booking

```
TIMELINE:
│
├─ Mon 18-Feb, 10:00 AM: VENDOR CREATES
│  └─ Restaurant owner: "Adds Valentine's Day Dinner"
│     ├── Price: ₹1000 per couple
│     ├── Capacity: 30 tables
│     ├── Booking Mode: INSTANT
│     └── Status: SUBMITTED for approval
│
├─ Mon 18-Feb, 2:00 PM: ADMIN APPROVES
│  └─ Admin reviews and clicks: APPROVE
│     └── Status: Now visible to customers
│
├─ Tue 19-Feb, 3:00 PM: CUSTOMER BOOKS
│  └─ Young couple searches "romantic dinner"
│     ├── Finds: Restaurant XYZ - Valentine's Dinner
│     ├── Clicks: "BOOK NOW"
│     ├── Pays: ₹1000 via UPI
│     └── Status: CONFIRMED ✓
│
├─ Tue 19-Feb, 3:10 PM: VENDOR SEES BOOKING
│  └─ Vendor dashboard:
│     ├── Total Bookings: 251 → 252
│     ├── Revenue: ₹250,000 → ₹251,000
│     └── "You have a new booking!"
│
├─ Wed 20-Feb, 7:00 PM: CUSTOMER ARRIVES
│  └─ Couple arrives at restaurant
│     ├── Scans QR code from email
│     └── Vendor confirms entry
│
├─ Wed 20-Feb, 7:01 PM: VENDOR CHECK-IN
│  └─ Vendor clicks: "CHECK-IN"
│     ├── Scans QR code
│     ├── Status: CONFIRMED → VALIDATED ✅
│     └── Entry allowed
│
├─ Wed 20-Feb, 9:30 PM: CUSTOMER EXITS
│  └─ Couple leaves after dinner
│     └── Vendor can send: Thank you message
│
├─ Fri 22-Feb, 5:45 AM: WEEKEND SETTLEMENT
│  └─ System processes all week's validated bookings
│     ├── Week's total revenues: ₹50,000
│     ├── Platform fee (5%): -₹2,500
│     ├── Vendor receives: ₹47,500
│     └── Settlement Status: PROCESSED
│
└─ Sat 23-Feb, 9:00 AM: PAYMENT TRANSFERRED
   └─ Vendor's bank account:
      └─ Credited: ₹47,500 ✓
```

---

## 🎯 KEY POINTS TO REMEMBER

### For Vendors:
1. **Must be APPROVED** to access the panel
2. **Create experiences** with desired booking mode
3. **Experiences need admin approval** before customers see them
4. **Check-in customers** to validate bookings
5. **Revenue settled** weekly after validation
6. **Can manage** all aspects: bookings, cancellations, exports

### For Customers:
1. **Can see approved experiences** only
2. **Instant booking**: Pay full amount, immediate confirmation
3. **Reservation**: Pay token, lock seat, confirm later
4. **Must show up** to validate booking and enjoy experience
5. **Can cancel** before vendor denies

### For Admin:
1. **Approve/reject vendors** based on documents
2. **Approve/reject experiences** for quality control
3. **Monitor all activities** for compliance
4. **Handle disputes** if needed
5. **Manage commissions** and settlements

---

## 🔐 SECURITY FLOW

Every vendor action is protected:

```
VENDOR ACTION
    ↓
IS USER AUTHENTICATED? 
    ├─ NO → Redirect to login
    └─ YES ↓
IS ROLE = 'VENDOR'?
    ├─ NO → 403 Forbidden
    └─ YES ↓
IS VENDOR_STATUS = 'APPROVED'?
    ├─ NO → "Account not approved"
    └─ YES ↓
DOES VENDOR OWN RESOURCE?
    ├─ NO → 403 Forbidden
    └─ YES ↓
ALLOW ACTION ✓
```

---

## 📊 DATA FLOW DIAGRAM

```
┌─────────────┐
│   VENDOR    │
│   Logins    │
└──────┬──────┘
       │
       ├─→ Dashboard (READ: metrics, bookings)
       │
       ├─→ Create Experience (CREATE: experiences)
       │   └─→ Admin Approval (approval_status)
       │       └─→ IF APPROVED → Visible
       │
       ├─→ View Bookings (READ: bookings for own experiences)
       │   └─→ Check-in (UPDATE: status = validated)
       │       └─→ Revenue Confirmed
       │
       ├─→ View Holds (READ: holds for own experiences)
       │   └─→ Auto-expire or Confirm
       │
       ├─→ View Settlements (READ: settled payments)
       │   └─→ Weekly automated transfers
       │
       └─→ Profile (READ/UPDATE: business info)

┌──────────────┐
│  CUSTOMER    │
│  (Mobile)    │
└──────┬───────┘
       │
       ├─→ Browse Experiences (READ: approved only)
       │   └─→ Filter by category, price, distance
       │
       ├─→ Book Experience
       │   ├─→ Instant: Pay ₹500 → Confirmed
       │   └─→ Hold: Pay ₹100 → Held (1 hour timer)
       │
       ├─→ Receive Booking Confirmation
       │   ├─→ QR Code
       │   ├─→ Reference #
       │   └─→ Details
       │
       └─→ At Venue: Scan QR → Check-in
           └─→ Status = Validated

┌──────────────┐
│    ADMIN     │
│  (Web Panel) │
└──────┬───────┘
       │
       ├─→ Vendor Approvals
       │   └─→ Set vendor_status = approved
       │
       ├─→ Experience Approvals
       │   └─→ Set approval_status = approved
       │
       ├─→ Monitor Activities
       │   ├─→ Bookings
       │   ├─→ Revenue
       │   └─→ Disputes
       │
       └─→ Handle Refunds/Disputes
           └─→ Adjust wallet balances
```

---

## 🔧 TECHNICAL IMPLEMENTATION GUIDE - PAYMENT TIMING

**This section is for developers implementing the payment system.**

### ⚠️ CRITICAL RULE
```
✅ DO: Process payment at booking/confirmation
❌ DON'T: Process payment at check-in
❌ DON'T: Hold payments pending check-in
```

---

### Instant Booking Controller Implementation:

```php
// Customer Controller: bookExperience() or checkout()
public function bookExperience(Request $request) {
    
    // STEP 1: Validate booking
    
    // STEP 2: 💳 PROCESS PAYMENT HERE
    $payment = PaymentGateway::charge($request->amount);
    if (!$payment->successful()) {
        return redirect()->back()->with('error', 'Payment failed');
    }
    
    // STEP 3: ✅ CREATE BOOKING (only after successful payment)
    $booking = Booking::create([
        'user_id' => Auth::id(),
        'experience_id' => $request->experience_id,
        'booking_type' => 'instant',
        'status' => 'confirmed',  // ← Confirmed immediately
        'paid_amount' => $payment->amount,
    ]);
    
    // STEP 4: Update wallet
    $wallet = Auth::user()->wallet;
    $wallet->update(['balance' => $wallet->balance - $payment->amount]);
    
    return redirect('/bookings/' . $booking->id)
        ->with('success', 'Booking confirmed! Payment processed.');
}

// CheckIn Controller: checkIn()
public function checkIn(Booking $booking) {
    
    // STEP 1: Validate
    $this->authorize('view', $booking);
    
    // STEP 2: Check status
    if ($booking->status !== 'confirmed') {
        return back()->with('error', 'Booking must be confirmed');
    }
    
    // STEP 3: ✅ ONLY UPDATE STATUS
    $booking->update([
        'status' => 'validated',     // Just mark as attended
        'validated_at' => now(),
    ]);
    
    // ❌ NO PAYMENT PROCESSING HERE
    // ❌ NO WALLET UPDATES HERE
    // ❌ NO PAYMENT GATEWAY CALLS HERE
    
    return back()->with('success', 'Booking validated');
}
```

---

### Hold/Reservation Booking Controller Implementation:

```php
// Customer Controller: createHold()
public function createHold(Request $request) {
    
    // STEP 1: Validate
    
    // STEP 2: 💳 PROCESS TOKEN PAYMENT
    $token_amount = $this->calculateToken($request->experience);
    $payment = PaymentGateway::charge($token_amount);
    if (!$payment->successful()) {
        return back()->with('error', 'Token payment failed');
    }
    
    // STEP 3: ✅ CREATE HOLD (only after successful token payment)
    $hold = Hold::create([
        'user_id' => Auth::id(),
        'experience_id' => $request->experience_id,
        'status' => 'active',
        'token_amount' => $token_amount,
        'expires_at' => now()->addHour(),
    ]);
    
    return redirect('/holds/' . $hold->id)
        ->with('success', 'Hold created! Table reserved for 1 hour.');
}

// Customer Controller: confirmHold()
public function confirmHold(Hold $hold) {
    
    // STEP 1: Validate
    if ($hold->status !== 'active') {
        return back()->with('error', 'Hold not active');
    }
    if ($hold->expires_at < now()) {
        return back()->with('error', 'Hold expired');
    }
    
    // STEP 2: Calculate remaining payment
    $final_price = $hold->experience->price;
    $remaining = $final_price - $hold->token_amount;
    
    // STEP 3: 💳 PROCESS FINAL PAYMENT
    $payment = PaymentGateway::charge($remaining);
    if (!$payment->successful()) {
        return back()->with('error', 'Final payment failed');
    }
    
    // STEP 4: ✅ CREATE BOOKING (only after successful payment)
    $booking = Booking::create([
        'user_id' => $hold->user_id,
        'experience_id' => $hold->experience_id,
        'booking_type' => 'hold',
        'status' => 'confirmed',  // ← Confirmed immediately
        'paid_amount' => $final_price,
        'hold_id' => $hold->id,
    ]);
    
    // STEP 5: Update hold status
    $hold->update([
        'status' => 'confirmed',
        'confirmed_at' => now(),
    ]);
    
    return redirect('/bookings/' . $booking->id)
        ->with('success', 'Reservation confirmed! Payment processed.');
}

// CheckIn Controller: checkIn() - SAME AS INSTANT
public function checkIn(Booking $booking) {
    
    if ($booking->status !== 'confirmed') {
        return back()->with('error', 'Booking must be confirmed');
    }
    
    $booking->update([
        'status' => 'validated',     // Just mark as attended
        'validated_at' => now(),
    ]);
    
    // ❌ NO PAYMENT PROCESSING AT CHECK-IN
    // Payment was already done during booking/hold confirmation
    
    return back()->with('success', 'Booking validated');
}
```

---

### Database Booking Table Structure:

```sql
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY,
    user_id BIGINT,
    experience_id BIGINT,
    booking_type ENUM('instant', 'hold'),
    status ENUM('confirmed', 'validated', 'cancelled'),
    paid_amount DECIMAL(10, 2),  -- ← Amount paid at booking/confirmation
    created_at TIMESTAMP,         -- ← When payment was taken
    validated_at TIMESTAMP,       -- ← When customer arrived (no payment)
    cancelled_at TIMESTAMP
);
```

---

### Vendor Settlement Logic:

```php
// Vendor Controller: settlements()
public function settlements() {
    
    // Only count validated bookings for settlement
    // Validated status = experience was delivered
    $settlements = Booking::whereHas('experience', fn ($q) => $q->where('vendor_id', Auth::id()))
        ->where('status', 'validated')  // Only attended bookings
        ->selectRaw('DATE(validated_at) as settlement_date, SUM(paid_amount) as amount')
        ->groupBy('settlement_date')
        ->get();
    
    // paid_amount was already locked when booking was created
    // No new payment processing happens here
}
```

---

### Payment State Diagram:

```
INSTANT BOOKING:
├─ Customer → Book (Status: pending payment)
├─ Payment Gateway → Charge ₹500
├─ Success?
│  ├─ NO → Booking deleted, error shown
│  └─ YES ↓
├─ Create Booking (Status: 'confirmed') ✅
├─ Vendor sees revenue immediately
└─ At Venue: Check-in updates status to 'validated' (no payment)

HOLD BOOKING:
├─ Customer → Create Hold (Status: pending token payment)
├─ Payment Gateway → Charge ₹100 (token)
├─ Success?
│  ├─ NO → Hold not created
│  └─ YES ↓
├─ Create Hold (Status: 'active') ✅
├─ Timer starts ⏰
│
├─ Within 1 hour:
│  ├─ Customer → Confirm Hold
│  ├─ Payment Gateway → Charge ₹800 (remaining)
│  ├─ Success?
│  │  ├─ NO → Hold stays active, error shown
│  │  └─ YES ↓
│  ├─ Create Booking (Status: 'confirmed') ✅
│  ├─ Update Hold (Status: 'confirmed')
│  └─ Vendor sees revenue immediately
│
└─ At Venue: Check-in updates status to 'validated' (no payment)
```

---

### Validation Checklist:

- [ ] ✅ Payment processed BEFORE booking creation
- [ ] ✅ Payment processed BEFORE hold confirmation  
- [ ] ❌ NO payment calls in `checkIn()` method
- [ ] ✅ booking.paid_amount set at booking time
- [ ] ✅ booking.created_at = payment time (not check-in time)
- [ ] ✅ booking.status = 'confirmed' immediately after payment
- [ ] ✅ Vendor sees revenue BEFORE customer arrives
- [ ] ✅ Check-in only updates status, no wallet/payment logic
- [ ] ✅ Settlement only sums 'validated' bookings (no new payments)

---

## ✨ SUMMARY

The Vendor Panel is a complete end-to-end system:

1. **Vendor Registration** → Admin Approval → Access Granted
2. **Experience Creation** → Admin Review → Approval → Visible
3. **Customer Booking** → Instant or Reservation → Confirmed (Payment taken)
4. **Vendor Management** → View, Check-in, Cancel → Full Control
5. **Revenue Settlement** → Weekly Processing → Bank Transfer

All data flows through the database with proper relationships, all actions are secured with middleware and policies, and vendors have complete visibility and control of their business.

---

*Complete Vendor Panel Workflow Explanation*
*Version 1.0 - February 20, 2026*
*Updated: February 20, 2026 - Payment Timing Clarification*
