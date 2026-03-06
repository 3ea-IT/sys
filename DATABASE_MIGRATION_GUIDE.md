# Database Migration Guide - Adding Vendor Panel Support

This guide helps you migrate your existing database to support the new Vendor Panel features.

## Pre-Migration Checklist

- [ ] Backup your database: `php artisan backup:run`
- [ ] Backup your code: `git commit -m "Pre-vendor-panel migration"`
- [ ] Test on development/staging server first
- [ ] Have a rollback plan ready
- [ ] Inform all stakeholders
- [ ] Schedule during low-traffic period

## Migration Process

### Step 1: Pull the Latest Code

```bash
git pull origin main
# or if you've implemented the changes manually, skip this
```

### Step 2: Run Migrations

```bash
# Make sure you're in the project directory
cd c:\xampp\htdocs\secure-seat

# Run migrations
php artisan migrate

# Expected output:
# Migrating: 2026_02_20_000001_add_vendor_fields_to_users_table
# Migrated: 2026_02_20_000001_add_vendor_fields_to_users_table (XXXms)
# Migrating: 2026_02_20_000002_add_vendor_id_to_experiences_table
# Migrated: 2026_02_20_000002_add_vendor_id_to_experiences_table (XXXms)
```

### Step 3: Verify Database Changes

```bash
# Connect to your database and verify
mysql -u root -p secure_seat

# Run these SQL commands to verify:
DESCRIBE users; -- Look for new vendor columns
DESCRIBE experiences; -- Look for vendor_id column
```

### Step 4: Create First Admin/Vendor Account

**Option A: Using Laravel Tinker**

```bash
php artisan tinker

# Inside tinker:
$user = App\Models\User::create([
    'name' => 'Admin Name',
    'email' => 'admin@example.com',
    'password' => Hash::make('secure_password_here'),
    'role' => 'admin',
]);

# For vendor (if needed):
$vendor = App\Models\User::create([
    'name' => 'Business Name',
    'email' => 'vendor@example.com',
    'password' => Hash::make('secure_password_here'),
    'role' => 'vendor',
    'business_name' => 'Business Name',
    'business_type' => 'Entertainment',
    'vendor_status' => 'pending'
]);

# Approve vendor:
$vendor->update([
    'vendor_status' => 'approved',
    'vendor_approved_at' => now()
]);

exit
```

**Option B: Using Database GUI**

1. Open phpMyAdmin or MySQL Workbench
2. Insert into users table:
```sql
INSERT INTO users (
    name, email, password, role, 
    business_name, business_type, vendor_status,
    email_verified_at, created_at, updated_at
) VALUES (
    'Business Name', 'vendor@example.com', 
    '$2y$12$...hashed_password...', 
    'vendor',
    'Business Name', 'Entertainment', 'approved',
    NOW(), NOW(), NOW()
);
```

### Step 5: Clear Application Cache

```bash
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

# Or in one command:
php artisan optimize:clear
```

### Step 6: Verify Installation

```bash
# Run the migration once more (should show "Nothing to migrate")
php artisan migrate --step

# Check routes are registered
php artisan route:list | grep vendor
```

### Step 7: Test Vendor Panel Access

1. Login with vendor account
2. Navigate to: `/vendor/dashboard`
3. You should see the vendor dashboard
4. Try creating an experience

---

## Rollback Procedure (If Needed)

### Immediate Rollback

```bash
# Rollback the last two migrations
php artisan migrate:rollback --step=2

# Or rollback all:
php artisan migrate:reset
```

### Restore from Backup

```bash
# If you have database backups
# Use your backup tool to restore a previous database state
# Example with Laravel backup package:
php artisan backup:restore

# Then revert code to previous commit:
git checkout HEAD~1
```

---

## Migration Verification Queries

Run these SQL queries to verify everything is in place:

### Check New User Columns

```sql
-- Verify vendor fields exist in users table
DESCRIBE users;

-- Should show these new columns:
-- business_name
-- business_type
-- business_description
-- phone
-- address
-- city, state, postal_code, country
-- business_license_number
-- tax_id
-- bank_details
-- vendor_status
-- vendor_approved_at
-- vendor_rejection_reason
-- last_login
```

### Check Experiences Table

```sql
-- Verify vendor_id column in experiences table
DESCRIBE experiences;

-- Should show:
-- vendor_id (BIGINT, unsigned, nullable)
-- approval_status (ENUM: pending, approved, rejected)
-- rejection_reason (TEXT, nullable)
```

### Verify Foreign Keys

```sql
-- Check foreign key relationships
SELECT CONSTRAINT_NAME, TABLE_NAME, REFERENCED_TABLE_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME IN ('users', 'experiences')
AND REFERENCED_TABLE_NAME IS NOT NULL;
```

---

## Data Migration Steps (For Existing Experiences)

If you have existing experiences without vendor_id:

### Step 1: Assign Vendor (Single Vendor Scenario)

```sql
-- If you only have one vendor
UPDATE experiences SET vendor_id = 1;
```

### Step 2: Assign Vendors (Multiple Vendors)

```php
// In Laravel Tinker or a migration script:
$admin = User::where('role', 'admin')->first();

// Assign all experiences to admin
Experience::whereNull('vendor_id')->update([
    'vendor_id' => $admin->id
]);

// Or manually assign by experience ID:
Experience::find(1)->update(['vendor_id' => 1]);
```

### Step 3: Set Approval Status

```sql
-- Mark all existing experiences as approved
UPDATE experiences SET approval_status = 'approved';
```

---

## Testing After Migration

### Basic Tests

```bash
# Test vendor login
curl -X POST http://localhost:8000/login \
  -d "email=vendor@example.com&password=password"

# Test vendor dashboard access
curl -X GET http://localhost:8000/vendor/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Application Tests

```php
// In a test file or tinker:

// Test vendor relationship
$vendor = User::where('role', 'vendor')->first();
$experiences = $vendor->experiences; // Should work now

// Test experience vendor relationship
$experience = Experience::first();
$vendor = $experience->vendor; // Should work now

// Test booking filtering
$bookings = Booking::whereHas('experience', function($q) use ($vendor) {
    $q->where('vendor_id', $vendor->id);
})->get();
```

---

## Common Issues & Solutions

### Issue 1: Foreign Key Constraint Error

**Error**: "Cannot add or modify record; foreign key constraint fails"

**Cause**: vendor_id column references non-existent user

**Solution**:
```sql
-- Make vendor_id nullable first, then assign valid IDs
ALTER TABLE experiences MODIFY vendor_id BIGINT UNSIGNED NULL;

-- Then update to valid vendor IDs
UPDATE experiences SET vendor_id = 1 WHERE vendor_id IS NULL;
```

### Issue 2: Migration Already Exists

**Error**: "Class ... has already been migrated"

**Solution**:
```bash
# Check migration status
php artisan migrate:status

# If already migrated, you can safely run migrate again (no-op)
php artisan migrate

# If not showing, manually insert into migrations table
INSERT INTO migrations (migration, batch) VALUES 
('2026_02_20_000001_add_vendor_fields_to_users_table', 1),
('2026_02_20_000002_add_vendor_id_to_experiences_table', 1);
```

### Issue 3: Routes Not Working

**Error**: "Route not found"

**Solution**:
```bash
# Clear route cache
php artisan route:clear

# Verify routes are registered
php artisan route:list | grep vendor

# If still not showing, check routes/vendor.php exists
ls -la routes/vendor.php
```

### Issue 4: Permission Denied on File Upload

**Error**: "Permission denied while uploading image"

**Solution**:
```bash
# Fix storage permissions
chmod -R 775 storage/app
chmod -R 775 public

# Or use PHP in tinker
exec('chmod -R 775 ' . storage_path('app'));
```

---

## Post-Migration Checklist

- [ ] All migrations ran successfully
- [ ] Database backup taken after migration
- [ ] Vendor login tested
- [ ] Dashboard accessible
- [ ] Experience creation tested
- [ ] Bookings display working
- [ ] No console errors in browser
- [ ] No server errors in logs
- [ ] Admin can see vendor accounts
- [ ] Vendor can see own experiences only
- [ ] File uploads work
- [ ] CSV export functional
- [ ] Settlement page loads

---

## Database Statistics

Check migration impact:

```sql
-- See how many vendors exist
SELECT COUNT(*) as vendor_count FROM users WHERE role = 'vendor';

-- See vendor distribution by type
SELECT business_type, COUNT(*) as count 
FROM users 
WHERE role = 'vendor' 
GROUP BY business_type;

-- See experiences by vendor
SELECT u.business_name, COUNT(e.id) as experience_count
FROM users u
LEFT JOIN experiences e ON u.id = e.vendor_id
WHERE u.role = 'vendor'
GROUP BY u.id;

-- Check approval status
SELECT approval_status, COUNT(*) as count 
FROM experiences 
GROUP BY approval_status;
```

---

## Performance Optimization

After migration, optimize database performance:

### Add Indexes

```sql
-- Speed up vendor queries
CREATE INDEX idx_vendor_id ON experiences(vendor_id);
CREATE INDEX idx_vendor_status ON users(vendor_status);
CREATE INDEX idx_approval_status ON experiences(approval_status);
```

### Monitor Slow Queries

```bash
# Enable slow query log in MySQL
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

# Check slow query log
tail -n 100 /var/log/mysql/slow-query.log
```

---

## Monitoring Post-Migration

### Check Application Logs

```bash
# Monitor application logs
tail -f storage/logs/laravel.log

# Watch for errors
grep -i "error\|exception" storage/logs/laravel.log
```

### Database Monitoring

```bash
# Monitor database connections
SHOW PROCESSLIST;

# Check for locks
SHOW OPEN TABLES WHERE In_use > 0;
```

---

## Troubleshooting Commands

```bash
# Test database connection
php artisan tinker
# Then: DB::connection()->getPdo()

# Check migration status
php artisan migrate:status

# Run specific migration
php artisan migrate --path=database/migrations/2026_02_20_000001_add_vendor_fields_to_users_table.php

# Reset and re-run migrations (DANGER - data loss!)
php artisan migrate:refresh

# Get detailed migration info
php artisan migrate:status --database=mysql
```

---

## Communication with Stakeholders

### For Your Team
- Migrations completed successfully
- No data loss occurred
- All vendor features now available
- Monitor for issues next 24 hours

### For Users
- New vendor portal available
- Existing data preserved
- No action needed from users
- New feature announcements coming

### For Vendors
- Vendor dashboard now live
- Submit experiences for approval
- Manage bookings easier
- View earnings and settlements

---

## Backup & Recovery

### Before Migration Backup

```bash
# Database backup
mysqldump -u root -p secure_seat > backup_pre_vendor.sql

# Code backup
git tag pre-vendor-panel
git push origin pre-vendor-panel
```

### After Migration Backup

```bash
# Verify backup successful
mysql -u root -p secure_seat < backup_pre_vendor.sql
```

---

## Next Steps

1. ✅ Complete migration process
2. ✅ Verify all features working
3. ✅ Create vendor accounts
4. ✅ Onboard vendors
5. ✅ Monitor for issues
6. ✅ Gather feedback
7. ✅ Deploy enhancements

---

## Support

If you encounter issues during migration:

1. Check this guide section: "Common Issues & Solutions"
2. Review Laravel migration documentation
3. Check application logs: `storage/logs/laravel.log`
4. Verify database connection
5. Contact your database administrator

---

## Additional Resources

- [Laravel Migrations Documentation](https://laravel.com/docs/migrations)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Vendor Panel Guide](./VENDOR_PANEL_GUIDE.md)
- [Implementation Checklist](./VENDOR_PANEL_CHECKLIST.md)

---

*Migration Guide Version: 1.0*
*Last Updated: February 20, 2026*
