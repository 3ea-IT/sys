# Vendor Panel Documentation

## Overview

The Vendor Panel is a comprehensive management system for event organizers, restaurants, temples, workshops, and travel agencies to manage their experiences and bookings on the Secure Seat platform.

## Features

### 1. **Dashboard**
- Real-time analytics and key metrics
- Total experiences, bookings, and revenue at a glance
- Active holds monitoring
- Recent bookings feed
- Quick action buttons for common tasks
- Vendor account status indication

### 2. **Experience Management**
- Create, read, update, and delete experiences
- Support for dual booking modes:
  - Instant Booking (Full Payment)
  - Reservation (Token Payment)
  - Both modes
- Image upload for experiences
- Category selection (Entertainment, Professional Events, Religious, Dining, Travel)
- Dynamic pricing configuration
- Capacity management
- Priority scoring
- Approval status tracking

### 3. **Booking Management**
- View all bookings for vendor's experiences
- Filter by status and search by user/experience
- Quick check-in functionality
- Booking details view
- Export bookings to CSV
- Booking lifecycle tracking

### 4. **Vendor Profile**
- Business information display
- Contact and location management
- Business registration details
- Account status and approval history
- Vendor rejection reason display (if applicable)

### 5. **Analytics & Reporting**
- Booking status distribution
- Bookings by category breakdown
- Daily revenue trends (30 days)
- Visual charts and metrics

### 6. **Settlements & Payments**
- Total earnings overview
- Settlement history
- Daily settlement tracking
- Payment status monitoring

## Installation & Setup

### Step 1: Run Migrations

```bash
php artisan migrate
```

This will:
- Add vendor fields to users table (business_name, phone, address, etc.)
- Add vendor_id to experiences table
- Create approval_status and rejection_reason columns

### Step 2: Register Routes

The vendor routes are already registered in `RouteServiceProvider.php`:
```php
Route::middleware('web')
    ->group(base_path('routes/vendor.php'));
```

### Step 3: Verify Middleware Registration

Check `app/Http/Kernel.php` to ensure the vendor middleware is registered:
```php
'vendor' => \App\Http\Middleware\VendorMiddleware::class,
```

### Step 4: Grant Vendor Role (Admin Action)

To create a vendor account:

```php
$user = User::create([
    'name' => 'Vendor Name',
    'email' => 'vendor@example.com',
    'password' => Hash::make('password'),
    'role' => 'vendor',
    'business_name' => 'Business Name',
    'business_type' => 'Entertainment',
    // ... other fields
    'vendor_status' => 'pending'
]);
```

Admin must approve the vendor by updating:
```php
$user->update([
    'vendor_status' => 'approved',
    'vendor_approved_at' => now()
]);
```

## Routes

### Dashboard Routes
- `GET /vendor/dashboard` - Dashboard overview
- `GET /vendor/profile` - View vendor profile
- `POST /vendor/profile` - Update vendor profile
- `GET /vendor/analytics` - View analytics

### Experience Management Routes
- `GET /vendor/experiences` - List experiences
- `GET /vendor/experiences/create` - Create form
- `POST /vendor/experiences` - Store experience
- `GET /vendor/experiences/{experience}` - View details
- `GET /vendor/experiences/{experience}/edit` - Edit form
- `PUT /vendor/experiences/{experience}` - Update experience
- `DELETE /vendor/experiences/{experience}` - Delete experience
- `GET /vendor/experiences/{experience}/bookings` - View bookings
- `GET /vendor/experiences/{experience}/holds` - View holds
- `POST /vendor/experiences/{experience}/validate-entry` - Validate booking entry

### Booking Management Routes
- `GET /vendor/bookings` - List bookings
- `GET /vendor/bookings/{booking}` - View booking details
- `POST /vendor/bookings/{booking}/check-in` - Check-in booking
- `POST /vendor/bookings/{booking}/cancel` - Cancel booking
- `GET /vendor/bookings/export` - Export to CSV

### Settlement Routes
- `GET /vendor/settlements` - View settlement history

## Database Schema

### Users Table (New Columns)
```
- business_name: string (nullable)
- business_type: string (nullable)
  Options: Entertainment, Professional Events, Religious & Wellness, Dining Access, Travel & Attractions
- business_description: text (nullable)
- phone: string (nullable)
- address: string (nullable)
- city: string (nullable)
- state: string (nullable)
- postal_code: string (nullable)
- country: string (nullable)
- business_license_number: string (nullable)
- tax_id: string (nullable)
- bank_details: json (nullable)
- vendor_status: enum (pending, approved, rejected, suspended)
- vendor_approved_at: timestamp (nullable)
- vendor_rejection_reason: text (nullable)
- last_login: timestamp (nullable)
```

### Experiences Table (New Columns)
```
- vendor_id: unsigned bigInteger (foreign key to users)
- approval_status: enum (pending, approved, rejected)
- rejection_reason: text (nullable)
```

## Models & Relationships

### User Model
```php
// Vendor relationships
$user->experiences() // Get all experiences created by vendor
$user->vendorBookings() // Get all bookings for vendor's experiences
$user->isVendor() // Check if user is a vendor
$user->isApprovedVendor() // Check if vendor is approved
```

### Experience Model
```php
$experience->vendor() // Get the vendor who created the experience
$experience->bookings() // Get all bookings
$experience->holds() // Get all holds
```

## Controllers

### DashboardController
- **index()** - Dashboard overview with key metrics
- **profile()** - Display vendor profile
- **updateProfile()** - Update vendor contact info
- **analytics()** - Analytics and reporting

### ExperienceController
- **index()** - List all vendor's experiences
- **create()** - Show create form
- **store()** - Save new experience
- **show()** - Display experience details
- **edit()** - Show edit form
- **update()** - Update experience
- **destroy()** - Delete experience
- **bookings()** - Get bookings for experience
- **holds()** - Get holds for experience
- **validateEntry()** - Validate booking entry

### BookingController
- **index()** - List all vendor's bookings
- **show()** - Display booking details
- **checkIn()** - Mark booking as validated
- **cancel()** - Cancel a booking
- **settlements()** - View settlement history
- **export()** - Export bookings to CSV

## Authorization

The `ExperiencePolicy` class controls access:
- Vendors can only view/edit their own experiences
- Admins have full access
- Only approved vendors can create experiences

## Middleware

### VendorMiddleware
- Checks if user is authenticated
- Verifies user role is 'vendor'
- Ensures vendor status is 'approved'
- Rejects with 403 error if not approved

## Usage Examples

### For a Vendor User

1. **Login** → User authenticates with their credentials
2. **Access Dashboard** → `/vendor/dashboard` shows overview
3. **Create Experience** → `/vendor/experiences/create` form
4. **Manage Experiences** → `/vendor/experiences` list with actions
5. **Track Bookings** → `/vendor/bookings` for management
6. **Check Revenue** → `/vendor/settlements` for payment tracking

### For the Admin (Approving Vendors)

```php
// Approve a vendor
$vendor = User::where('email', 'vendor@example.com')->first();
$vendor->update([
    'vendor_status' => 'approved',
    'vendor_approved_at' => now()
]);

// Reject a vendor
$vendor->update([
    'vendor_status' => 'rejected',
    'vendor_rejection_reason' => 'Documents not verified'
]);

// Suspend a vendor
$vendor->update([
    'vendor_status' => 'suspended',
    'vendor_rejection_reason' => 'Violation of terms'
]);
```

## File Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Vendor/
│   │       ├── DashboardController.php
│   │       ├── ExperienceController.php
│   │       └── BookingController.php
│   ├── Middleware/
│   │   └── VendorMiddleware.php
│   └── Kernel.php
├── Models/
│   ├── User.php (updated)
│   └── Experience.php (updated)
├── Policies/
│   └── ExperiencePolicy.php
└── Providers/
    └── RouteServiceProvider.php (updated)

resources/js/Pages/Vendor/
├── Dashboard.jsx
├── Profile.jsx
├── Analytics.jsx
├── Bookings/
│   └── Index.jsx
├── Experiences/
│   ├── Index.jsx
│   ├── Create.jsx
│   ├── Edit.jsx
│   └── Show.jsx
└── Settlements.jsx

routes/
└── vendor.php

database/migrations/
├── 2026_02_20_000001_add_vendor_fields_to_users_table.php
└── 2026_02_20_000002_add_vendor_id_to_experiences_table.php
```

## Booking Modes Explanation

### 1. Instant Booking Mode
- User pays full amount immediately
- Seat is instantly confirmed
- No hold period
- Pricing: `instant_price`

### 2. Reservation Mode (Hold Only)
- User pays token amount to reserve
- Seat is held for specified duration
- User must confirm within hold duration
- If not confirmed, booking auto-cancels and enters waitlist
- Pricing: `hold_token`

### 3. Both Modes
- Users have choice between instant or reservation
- Two price points available
- Provides flexibility

## Key Features & Validations

1. **Vendor Approval Required**
   - Only approved vendors can create, edit, or manage experiences
   - Status must be 'approved' to access vendor routes

2. **Experience Approval Workflow**
   - New experiences start with approval_status = 'pending'
   - Admin must review and approve
   - Vendors notified of approval/rejection

3. **Booking Validation**
   - Vendor can validate/check-in bookings
   - Prevents double-validation with status checks
   - Entry validation for ticketing scenarios

4. **Revenue Tracking**
   - Individual booking amounts tracked
   - Settlement calculations aggregated daily
   - Export capability for accounting

5. **Capacity Management**
   - Real-time capacity monitoring
   - Occupancy rate calculation
   - Prevents overbooking

## Testing & QA

### Test Vendor Creation
```php
$vendor = User::factory()->create([
    'role' => 'vendor',
    'vendor_status' => 'approved'
]);
```

### Test Experience Creation
```php
$experience = Experience::factory()->create([
    'vendor_id' => $vendor->id,
    'approval_status' => 'approved'
]);
```

### Test Booking Creation
```php
$booking = Booking::factory()->create([
    'experience_id' => $experience->id,
    'user_id' => $user->id
]);
```

## Security Considerations

1. **Middleware Protection** - All vendor routes require authentication and vendor status
2. **Policy Authorization** - Vendors can only access their own resources
3. **Rate Limiting** - Implement on critical actions like bookings
4. **Audit Logging** - Track vendor activities for compliance
5. **Bank Details** - Securely encrypted in JSON column

## Next Steps (Optional Enhancements)

1. **Email Notifications** - Notify vendors of new bookings, holds expiring, etc.
2. **Commission Calculation** - Automated calculation of platform commission
3. **Dispute Resolution** - Handle booking disputes between customers and vendors
4. **Performance Metrics** - Advanced analytics and KPIs
5. **QR Code Generation** - Generate QR codes for check-in
6. **Tax Compliance** - Generate tax reports for vendors
7. **Bulk Operations** - Bulk import/export of bookings
8. **Historical Analytics** - Compare metrics across periods

## Support & Troubleshooting

### Common Issues

**Issue: "Your vendor account is not approved"**
- Solution: Contact admin to approve vendor account
- Check vendor_status in users table

**Issue: Cannot create experiences**
- Solution: Ensure vendor status is 'approved'
- Verify role is 'vendor'

**Issue: Routes not working**
- Solution: Run `php artisan route:cache` after changes
- Check RouteServiceProvider.php includes vendor.php

## Contact & Support

For vendor-related issues:
- Email: vendors@secureseat.com
- Phone: Support number
- Help Center: Link to help docs
