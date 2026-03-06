# Payment Timing Requirements - Secure Seat Vendor Panel

## Executive Summary

**Payments must be taken AT BOOKING/CONFIRMATION TIME, NOT AT CHECK-IN**

This is a critical business rule that applies throughout the entire system.

---

## The Rule

| Booking Type | Payment Timing | Amount | Status |
|---|---|---|---|
| **Instant Booking** | When customer clicks "BUY NOW" | Full price (₹500) | Immediately 'confirmed' |
| **Hold Booking (Token)** | When customer clicks "RESERVE NOW" | Token amount (₹100) | Hold 'active' |
| **Hold Booking (Confirm)** | When customer clicks "CONFIRM BOOKING" | Remaining amount (₹800) | Booking 'confirmed' |
| **Check-in** | ❌ NO PAYMENT | ❌ NONE | Only status update to 'validated' |

---

## Why This Matters

1. **Vendor Revenue**: Vendors get paid BEFORE customer arrives, not after
2. **Customer Trust**: No surprise charges at venue
3. **Settlement Clarity**: Payment amount is locked at booking time
4. **Risk Mitigation**: Business doesn't wait for check-in to get paid

---

## Implementation Checklist

### ✅ Customer Booking Endpoints
- [ ] `POST /checkout` - Processes payment BEFORE creating booking
- [ ] `POST /holds/{id}/confirm` - Processes payment BEFORE confirming hold
- [ ] Both endpoints must charge before `Booking::create()`

### ✅ Vendor Check-In Endpoint
- [ ] `POST /vendor/bookings/{id}/check-in` - NO payment logic
- [ ] `POST /vendor/bookings/{id}/validate` - NO payment logic
- [ ] Only updates `status = 'validated'` and `validated_at`
- [ ] Never calls payment gateway
- [ ] Never touches wallet balances (for payment purposes)

### ✅ Vendor Cancel Endpoint
- [ ] `POST /vendor/bookings/{id}/cancel` - Processes refund based on policy
- [ ] Refund amount depends on cancellation window
- [ ] Updates wallet with refund amount

### ✅ Database Logic
- [ ] `booking.paid_amount` set at booking creation
- [ ] `booking.created_at` equals payment processing time
- [ ] `booking.validated_at` equals check-in time (different from creation)
- [ ] Settlement only includes bookings with `status = 'validated'`

---

## Code Examples

### ❌ WRONG - Payment at Check-in

```php
// WRONG! Don't do this
public function checkIn(Booking $booking) {
    // WRONG: Processing payment here
    $payment = PaymentGateway::charge($booking->paid_amount);
    
    $booking->update([
        'status' => 'validated',
        'validated_at' => now(),
    ]);
}
```

### ✅ CORRECT - Payment at Booking

```php
// CORRECT! Payment happens at booking creation
public function book(Request $request) {
    // Process payment FIRST
    $payment = PaymentGateway::charge($request->amount);
    if (!$payment->success) {
        return error('Payment failed');
    }
    
    // Then create booking
    $booking = Booking::create([
        'status' => 'confirmed',
        'paid_amount' => $request->amount,
    ]);
    
    return success('Booking confirmed');
}

// Later, at check-in
public function checkIn(Booking $booking) {
    // CORRECT! No payment here
    $booking->update([
        'status' => 'validated',
        'validated_at' => now(),
    ]);
}
```

---

## Instant Booking Flow

```
Customer Page
    ↓
[View Experience]
    ├─ Price: ₹500
    ├─ [Buy Now Button]
    │
    └─ Click → POST /checkout
              ↓
        💳 PAYMENT GATEWAY
        ├─ Charge: ₹500
        └─ Status: SUCCESS
              ↓
        ✅ Booking Created
        ├─ status: 'confirmed'
        ├─ paid_amount: 500
        └─ created_at: NOW (payment time)
              ↓
        Email Confirmation Sent
              ↓
        [At Venue - Later]
              ↓
        POST /vendor/bookings/{id}/check-in
        ├─ Update status: 'validated'
        ├─ Update validated_at: NOW
        └─ ❌ NO PAYMENT HERE
```

---

## Hold/Reservation Booking Flow

```
Customer Page
    ↓
[View Experience - Hold Mode]
    ├─ Price: ₹100 token + ₹800 later
    ├─ [Reserve Now Button]
    │
    └─ Click → POST /holds
              ↓
        💳 PAYMENT GATEWAY
        ├─ Charge Token: ₹100
        └─ Status: SUCCESS
              ↓
        ✅ Hold Created
        ├─ status: 'active'
        ├─ token_amount: 100
        └─ expires_at: +1 hour
              ↓
        [Within 1 hour]
              ↓
        Customer: "Confirm Booking"
              ↓
        POST /holds/{id}/confirm
        ├─ Calculate remaining: ₹800
        │
        ├─ 💳 PAYMENT GATEWAY
        │  ├─ Charge: ₹800
        │  └─ Status: SUCCESS
        │       ↓
        ├─ ✅ Booking Created
        │  ├─ status: 'confirmed'
        │  ├─ paid_amount: 900 (100+800)
        │  └─ created_at: NOW (payment time)
        │
        └─ Hold Updated
           └─ status: 'confirmed'
                ↓
        Email Confirmation Sent
                ↓
        [At Venue - Later]
                ↓
        POST /vendor/bookings/{id}/check-in
        ├─ Update status: 'validated'
        ├─ Update validated_at: NOW
        └─ ❌ NO PAYMENT HERE
```

---

## Settlement Timeline

### Weekly Settlement Process

```
Week 1 (Mon-Sun): Customers book & arrive
├─ Mon: Instant booking → Payment taken immediately
├─ Wed: Hold booking confirmed → Payment taken immediately
├─ Fri: Customer check-in → Status = 'validated' (no payment)
└─ Sun: Multiple bookings, all validated
         All payments already received

Week 2 (Mon): Settlement Processing
├─ System sums all 'validated' bookings from previous week
│  └─ Total from Week 1: ₹50,000
│
├─ Deduct platform commission (10%): ₹5,000
├─ Deduct taxes: ₹3,000
│
├─ Net payment to vendor: ₹42,000
│
└─ Transfer to bank account

⚠️ Note: 'validated' status doesn't trigger new payment
        Payment was already taken when booking created
        Check-in just confirms delivery for settlement purposes
```

---

## Important Notes

1. **Payment is never pending** - It's either done or failed
2. **Check-in is for business logic** - Confirms attendance, qualifies for settlement
3. **Status 'confirmed' = paid** - Vendor already has the money
4. **No payment retries at check-in** - Payment already succeeded
5. **Cancellation happens before check-in** - Can't cancel after validation

---

## Testing Checklist

- [ ] Book instant booking, verify payment taken immediately
- [ ] Create hold, verify token deducted immediately  
- [ ] Confirm hold, verify remaining payment taken immediately
- [ ] At check-in, verify no payment gateway calls
- [ ] At check-in, verify only status changes
- [ ] Check settlement, verify only validated bookings counted
- [ ] Verify vendor sees revenue before customer arrives
- [ ] Verify payment timestamp ≠ validation timestamp

---

## Questions?

Refer to `VENDOR_PANEL_COMPLETE_WORKFLOW.md` section: **"TECHNICAL IMPLEMENTATION GUIDE - PAYMENT TIMING"**

---

**Last Updated**: February 20, 2026
**Version**: 1.0
**Critical**: YES - Core business rule
