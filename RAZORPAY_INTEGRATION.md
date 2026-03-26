# Razorpay Integration Guide

## Overview
This document explains the Razorpay payment integration for Secure Seat, replacing wallet-based direct deductions with proper payment gateway processing.

## Setup Status

### ✅ Completed
1. **Created RazorpayService** (`app/Services/RazorpayService.php`)
   - Order creation
   - Payment verification
   - Refund processing

2. **Created PaymentController** (`app/Http/Controllers/PaymentController.php`)
   - Instant booking payment order
   - Hold token payment order
   - Hold confirmation payment order
   - Payment verification and booking/hold completion

3. **Created Payment Model** (`app/Models/Payment.php`)
   - Tracks all payment transactions
   - Stores Razorpay order ID, payment ID, and signature

4. **Created Payment Migration** (`database/migrations/2026_03_23_000000_create_payments_table.php`)
   - Payments table with all necessary fields

5. **Updated Routes** (`routes/web.php`)
   - `/api/payment/instant-booking-order` - Create instant booking order
   - `/api/payment/hold-token-order` - Create hold token order
   - `/api/payment/hold-confirm-order` - Create hold confirmation order
   - `/api/payment/verify` - Verify payment after completion

6. **Updated Config** (`config/services.php`)
   - Razorpay key and secret from .env

7. **Installed Razorpay SDK**
   - `razorpay/razorpay` package installed via Composer

## Setup Instructions

### Step 1: Run Migrations
```bash
php artisan migrate
```

This creates the `payments` table for tracking all transactions.

### Step 2: Verify Environment Variables
Check `.env` file has Razorpay credentials:
```env
RAZORPAY_KEY=rzp_test_qtDp89ScnvMEEK
RAZORPAY_SECRET=MEY6yqvtACDSjaMYWVY2InQz
```

### Step 3: Clear Cache
```bash
php artisan cache:clear
php artisan config:clear
```

## Payment Flow

### 1. Instant Booking
**old flow** → Deduct full price from wallet
**new flow** → Request Razorpay payment order

```js
POST /api/payment/instant-booking-order
{
  "experience_id": 123
}

Response:
{
  "success": true,
  "order_id": "order_xxxxx",
  "amount": 500,
  "currency": "INR",
  "key": "rzp_test_..."
}
```

### 2. Hold Token Payment
**old flow** → Deduct hold token from wallet
**new flow** → Request Razorpay payment order

```js
POST /api/payment/hold-token-order
{
  "experience_id": 123
}

Response:
{
  "success": true,
  "order_id": "order_xxxxx",
  "amount": 100,
  "currency": "INR",
  "key": "rzp_test_..."
}
```

### 3. Hold Confirmation
**old flow** → Deduct remaining amount from wallet
**new flow** → Request Razorpay payment order

```js
POST /api/payment/hold-confirm-order
{
  "hold_id": 45
}

Response:
{
  "success": true,
  "order_id": "order_xxxxx",
  "amount": 400,
  "currency": "INR",
  "key": "rzp_test_..."
}
```

### 4. Payment Verification
After user completes Razorpay payment:

```js
POST /api/payment/verify
{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx"
}

Response Success:
{
  "success": true,
  "booking_id": 123,
  "message": "Booking confirmed! Your ticket is ready.",
  "redirect": "/bookings/123"
}

Response Error:
{
  "error": "...error message...",
  "message": "...detailed message..."
}
```

## API Integration Summary

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/payment/instant-booking-order` | POST | Create order for instant booking | ✅ Required |
| `/api/payment/hold-token-order` | POST | Create order for hold token | ✅ Required |
| `/api/payment/hold-confirm-order` | POST | Create order for hold confirmation | ✅ Required |
| `/api/payment/verify` | POST | Verify payment and complete transaction | ✅ Required |

## Frontend Integration Examples

### Instant Booking with Razorpay
```javascript
// 1. Request order
fetch('/api/payment/instant-booking-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ experience_id: experienceId })
})
.then(res => res.json())
.then(data => {
  // 2. Open Razorpay
  const options = {
    key: data.key,
    amount: data.amount * 100, // in paise
    currency: data.currency,
    name: "Secure My Seat",
    order_id: data.order_id,
    handler: async (response) => {
      // 3. Verify payment
      await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response)
      }).then(res => res.json())
        .then(data => {
          // Redirect to booking/hold page
          window.location.href = data.redirect;
        });
    }
  };
  
  const rzp = new Razorpay(options);
  rzp.open();
});
```

### Hold Confirmation with Razorpay
```javascript
// Similar flow as above but with:
fetch('/api/payment/hold-confirm-order', {
  method: 'POST',
  body: JSON.stringify({ hold_id: holdId })
})
```

## Error Handling

### Payment Failures
- If Razorpay order creation fails: Return error message to user
- If payment verification fails: Return error message, no booking created
- If refund needed: RazorpayService automatically refunds payment

### Hold Confirmation Failures
- If hold expired during payment: Return error, no payment created
- If no seats available: Payment refunded automatically
- If payment fails: User can retry

## Transaction Tracking

All payments are stored in the `payments` table with:
- Razorpay order ID and payment ID
- Payment signature for verification
- Reference to booking/hold/experience
- Status: pending, success, failed, refunded

## Testing with Test Credentials

Currently using Razorpay test mode credentials:
- **Key**: `rzp_test_qtDp89ScnvMEEK`
- **Secret**: `MEY6yqvtACDSjaMYWVY2InQz`

### Test Card Numbers
- Success: `4111 1111 1111 1111`
- Fail: `4111 1111 1111 1112`
- CVV: Any 3 digits
- Expiry: Any future date

## Production Migration

When moving to production:
1. Replace test keys with production keys in `.env`
2. Update Razorpay dashboard settings
3. Add webhook endpoint for payment confirmations
4. Enable email/SMS notifications

## Files Modified/Created

### Created
- `app/Services/RazorpayService.php`
- `app/Http/Controllers/PaymentController.php`
- `app/Models/Payment.php`
- `database/migrations/2026_03_23_000000_create_payments_table.php`

### Modified
- `routes/web.php` - Added payment routes
- `config/services.php` - Added Razorpay config
- `composer.json` - Added razorpay/razorpay package

### Next Steps (Frontend)
- Update `Active.jsx` - Replace hold token deduction with Razorpay payment
- Update booking page UI - Implement Razorpay checkout
- Add success/error handling for payment responses

## Support

For more info on Razorpay:
- Documentation: https://razorpay.com/docs/
- API Reference: https://razorpay.com/docs/api/
- Dashboard: https://dashboard.razorpay.com/
