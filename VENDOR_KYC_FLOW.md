# Vendor Registration & KYC Flow

## Overview
This document describes the complete vendor registration and KYC (Know Your Customer) process.

## User Journey

### Step 1: Access Vendor Registration
- User sees "Want to list your experiences?" section on login page
- Clicks "Register as Vendor" button
- Redirected to `/register/vendor`

### Step 2: Register as Vendor (VendorRegister.jsx)
**Route**: `GET /register/vendor`
**Controller**: `RegisteredUserController::createVendor()`

**Form Fields Required**:
- Full Name
- Email Address
- Business Name
- Business Type (dropdown)
- Password (with visibility toggle)
- Confirm Password (with visibility toggle)

**On Submit**:
- POST to `/register/vendor`
- Calls `RegisteredUserController::storeVendor()`
- Validates all required fields
- Creates user with:
  - `role` = 'vendor'
  - `vendor_status` = 'pending' (requires admin approval)
  - `business_name` and `business_type` from form
- Auto-logs in user
- Redirects to `/vendor/kyc`

---

### Step 3: Complete KYC (KYC.jsx)
**Route**: `GET/POST /vendor/kyc`
**Controller**: `KYCController`

**Page Features**:
- Shows back button to previous page
- Pre-fills fields from registration:
  - Name (from user.name)
  - Email (from user.email)
  - Business Name (from user.business_name)
  - Business Type (from user.business_type)

**Additional Optional Fields**:
- Business Description (textarea, max 1000 chars)
- Phone Number
- Business Address
- City, State, Postal Code, Country
- Business License Number
- Tax ID / GST Number
- Bank Details (encrypted, used for payouts)

**Form Validation**:
- Business Name & Type: Required
- All others: Optional but validated if provided

**On Submit**:
- POST to `/vendor/kyc`
- Calls `KYCController::update()`
- Updates user with all KYC information
- Redirects to `/vendor/dashboard`

---

## Database Schema

### Users Table - Vendor Fields
```
┌─ Vendor Registration Fields
├─ role (enum: user|vendor|admin)
├─ vendor_status (enum: pending|approved|rejected|suspended) [DEFAULT: pending]
│
┌─ Business Information
├─ business_name (varchar-255)
├─ business_type (varchar-255)
├─ business_description (text)
│
┌─ Contact Information
├─ phone (varchar-255)
├─ address (varchar-255)
├─ city (varchar-255)
├─ state (varchar-255)
├─ postal_code (varchar-255)
├─ country (varchar-255)
│
┌─ Legal & Financial
├─ business_license_number (varchar-255)
├─ tax_id (varchar-255)
├─ bank_details (longtext, encrypted)
│
┌─ Approval Tracking
├─ vendor_approved_at (timestamp, nullable)
├─ vendor_rejection_reason (text, nullable)
```

---

## Routes

### Authentication Routes (routes/auth.php)
```
GET  /register/vendor       → RegisteredUserController::createVendor()
POST /register/vendor       → RegisteredUserController::storeVendor()
```

### Vendor Routes (routes/vendor.php)
```
GET  /vendor/kyc            → KYCController::show()
POST /vendor/kyc            → KYCController::update()
```

Note: KYC routes only require `auth` middleware (allows pending vendors)

### Protected Vendor Routes (routes/vendor.php)
```
GET  /vendor/dashboard      → DashboardController::index()
```

Note: Dashboard and other vendor routes require `auth` and `vendor` middleware (allows vendors in any status except 'suspended')

---

## Controllers

### KYCController (app/Http/Controllers/Vendor/KYCController.php)

**show()** - Display KYC form
- Requires authentication
- Requires user to have role='vendor'
- Returns Vendor/KYC.jsx with vendor data

**update()** - Process KYC form submission
- Validates business_name, business_type (required)
- Validates optional fields (phone, address, etc.)
- Updates user record with all KYC data
- Redirects to /vendor/dashboard

---

## Middleware

### VendorMiddleware (app/Http/Middleware/VendorMiddleware.php)
- Checks user is authenticated
- Checks user has role='vendor'
- Allows access if vendor_status is pending, approved, or rejected
- Blocks access only if vendor_status='suspended'

**Modified behavior**: 
- Previously: Only approved vendors could access
- Now: Allows pending vendors to access (to complete KYC flow)

---

## Status Flow

### Vendor Statuses
1. **pending** - Newly registered, waiting for admin approval
   - Can access KYC page
   - Can access dashboard
   - Cannot list experiences until approved

2. **approved** - Admin has verified business details
   - Can access all vendor features
   - Can list and manage experiences
   - Can accept bookings

3. **rejected** - Admin rejected the vendor
   - Read-only access to dashboard
   - Cannot list new experiences

4. **suspended** - Vendor or admin suspended the account
   - Blocked from all vendor features
   - Cannot access dashboard

---

## Key Features

✅ **Pre-filled Form**: Business details from registration appear on KYC page
✅ **Editable Fields**: User can modify any field on KYC page
✅ **Optional Fields**: Most details are optional, allowing quick registration
✅ **Secure Bank Details**: Bank information encrypted in database
✅ **Admin Approval Flow**: Vendors wait for admin review before full access
✅ **Status Tracking**: Clear indication on dashboard that account is pending
✅ **Easy Navigation**: Back button and clear call-to-actions

---

## Error Handling

### Validation Errors
- Required fields (business_name, business_type) show error messages
- Form processing shows "Saving..." state during submission
- Validation errors displayed inline below relevant fields

### Access Control
- Non-vendors cannot access KYC page (403 error)
- Suspended vendors cannot access dashboard (403 error)
- Unauthenticated users redirected to login

---

## Next Steps (After Implementation)

1. Test vendor registration flow end-to-end
2. Verify pre-filled fields on KYC page
3. Test form submission and database updates
4. Create admin panel for vendor approval
5. Add email notifications for vendor status changes
6. Create waiting page for pending vendor status
7. Add experience listing restrictions for pending vendors
