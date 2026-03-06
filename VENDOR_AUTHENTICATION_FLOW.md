# Vendor Authentication & Redirection Flow

## 📋 Overview

Vendors and customers use the same authentication routes but are redirected to different dashboards based on their role.

---

## 🔐 Authentication Routes (Shared)

### Registration
```
GET /register
├─ Display registration form
├─ User fills: name, email, password
└─ User selects: role (customer OR vendor)
```

**POST /register**
```
├─ Validate input
├─ Create user with selected role
├─ Auto-login the user
├─ Redirect based on role:
│  ├─ IF role = 'vendor' → /vendor/dashboard
│  └─ IF role = 'customer' → /dashboard
```

---

### Login
```
GET /login
├─ Display login form
├─ User enters: email, password
└─ Submit
```

**POST /login**
```
├─ Authenticate user
├─ Regenerate session
├─ Redirect based on role:
│  ├─ IF role = 'vendor' → /vendor/dashboard
│  └─ IF role = 'customer' → /dashboard
```

---

### Logout
```
POST /logout
├─ Destroy session
├─ Redirect to → /
```

---

## 🎯 Complete Vendor Authentication Journey

### Step 1: Vendor Registration

```
VENDOR
  ↓
Access → /register
  ↓
Form shows:
├─ Name field
├─ Email field
├─ Password field
├─ Role selector: [Customer] [Vendor ✓]
└─ Register button
  ↓
Submit
  ↓
POST /register
├─ Create user with:
│  ├─ name: "John Restaurant"
│  ├─ email: "vendor@restaurant.com"
│  ├─ password: hashed
│  ├─ role: 'vendor' ← Selected by user
│  └─ vendor_status: 'pending' ← Auto-set (requires admin approval)
│
├─ Auto-login
└─ Redirect to → /vendor/dashboard
```

---

### Step 2: Vendor Login

```
VENDOR
  ↓
Access → /login
  ↓
Form shows:
├─ Email field
├─ Password field
└─ Login button
  ↓
Submit
  ↓
POST /login
├─ Authenticate
├─ Session regenerated
└─ Redirect to → /vendor/dashboard (because role='vendor')
```

---

### Step 3: Vendor Dashboard Access

```
GET /vendor/dashboard
  ↓
Middleware checks: ['auth', 'vendor']
├─ Is user authenticated? 
│  ├─ NO → Redirect to /login
│  └─ YES ↓
├─ Does user have role='vendor'?
│  ├─ NO → 403 Forbidden
│  └─ YES ↓
├─ Is vendor_status='approved'?
│  ├─ NO → Message: "Your account is pending approval"
│  └─ YES ↓
└─ ALLOW → Dashboard displayed ✅
```

---

## 🔄 Role-Based Redirects

### After Login/Registration:

| User Role | Original Intended URL | FINAL Redirect |
|---|---|---|
| **vendor** | (none) | `/vendor/dashboard` |
| **vendor** | `/bookings` (from intended) | `/bookings` (customer booking) |
| **customer** | (none) | `/dashboard` |
| **customer** | `/myprofile` (from intended) | `/myprofile` |

---

## 📝 Updated Authentication Controllers

### AuthenticatedSessionController.php

**Current Implementation:**
```php
public function store(LoginRequest $request): RedirectResponse
{
    $request->authenticate();
    $request->session()->regenerate();

    // Check role and redirect accordingly
    $user = Auth::user();
    if ($user->role === 'vendor') {
        return redirect()->intended('/vendor/dashboard');
    }

    return redirect()->intended(RouteServiceProvider::HOME); // /dashboard for customers
}
```

**How it works:**
1. Authenticates the user
2. Regenerates session (security)
3. Checks `user->role`
4. Vendors → `/vendor/dashboard`
5. Customers → `/dashboard`

---

### RegisteredUserController.php

**Current Implementation:**
```php
public function store(Request $request): RedirectResponse
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
        'password' => ['required', 'confirmed', Rules\Password::defaults()],
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    event(new Registered($user));
    Auth::login($user);

    // Check role and redirect accordingly
    if ($user->role === 'vendor') {
        return redirect('/vendor/dashboard');
    }

    return redirect(RouteServiceProvider::HOME); // /dashboard for customers
}
```

**How it works:**
1. Validates registration input
2. Creates user with selected role
3. Fires Registered event (for email verification)
4. Auto-logins the user
5. Checks `user->role`
6. Vendors → `/vendor/dashboard`
7. Customers → `/dashboard`

---

## 🔑 Key Points

### Where Vendors Register/Login:
- **Register**: `/register` (shared route)
- **Login**: `/login` (shared route)
- **After Login**: Auto-redirects to `/vendor/dashboard`

### Where Vendors Access Their Panel:
- **Dashboard**: `/vendor/dashboard`
- **Experiences**: `/vendor/experiences`
- **Bookings**: `/vendor/bookings`
- **Settlements**: `/vendor/settlements`

### Access Control:
- All vendor routes protected by `['auth', 'vendor']` middleware
- Requires: authenticated + role='vendor' + vendor_status='approved'
- Non-vendors get 403 Forbidden

---

## 📋 Registration Form Updates Needed

### Current Form Issues:
The registration form currently doesn't ask users to select their role. We need to update it to:

```jsx
// resources/js/Pages/Auth/Register.jsx
<form onSubmit={submit}>
    
    {/* Existing fields */}
    <input name="name" placeholder="Full Name" />
    <input type="email" name="email" placeholder="Email" />
    <input type="password" name="password" placeholder="Password" />
    <input type="password" name="password_confirmation" placeholder="Confirm Password" />
    
    {/* NEW: Role Selection */}
    <fieldset>
        <legend>Account Type</legend>
        
        <label>
            <input type="radio" name="role" value="customer" defaultChecked />
            Customer - Browse & Book Experiences
        </label>
        
        <label>
            <input type="radio" name="role" value="vendor" />
            Vendor - Create & Manage Experiences
        </label>
    </fieldset>
    
    {/* Show vendor info if vendor role selected */}
    {role === 'vendor' && (
        <>
            <h3>Vendor Information</h3>
            <input name="business_name" placeholder="Business Name" />
            <input name="business_type" placeholder="Business Type" />
            {/* ...other vendor fields... */}
        </>
    )}
    
    <button type="submit">Register</button>
</form>
```

### Backend Changes Needed:

Update RegisteredUserController to accept and store role:

```php
$request->validate([
    'name' => 'required|string|max:255',
    'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
    'password' => ['required', 'confirmed', Rules\Password::defaults()],
    'role' => 'required|in:customer,vendor',
    // Add vendor fields if role = vendor
    'business_name' => 'required_if:role,vendor|string|max:255',
    'business_type' => 'required_if:role,vendor|string|max:100',
]);

$user = User::create([
    'name' => $request->name,
    'email' => $request->email,
    'password' => Hash::make($request->password),
    'role' => $request->role,
    // Add vendor fields
    'business_name' => $request->role === 'vendor' ? $request->business_name : null,
    'business_type' => $request->role === 'vendor' ? $request->business_type : null,
    'vendor_status' => $request->role === 'vendor' ? 'pending' : null,
]);
```

---

## 🚀 Testing the Flow

### Test Vendor Registration:
```
1. Go to /register
2. Fill form with role = 'vendor'
3. Click Register
4. Expected: Redirected to /vendor/dashboard
5. Verify: DashboardController shows "Account not approved" message
```

### Test Vendor Login:
```
1. Go to /login
2. Enter vendor email & password
3. Click Login
4. Expected: Redirected to /vendor/dashboard
```

### Test Vendor Logout:
```
1. Click Logout on vendor dashboard
2. Expected: Redirected to /
3. Verify: /vendor/dashboard now shows login page
```

### Test Customer Login:
```
1. Go to /login
2. Enter customer email & password
3. Click Login
4. Expected: Redirected to /dashboard (customer dashboard)
5. NOT redirected to /vendor/dashboard
```

---

## 🔗 Route Map

```
PUBLIC ROUTES (No auth):
├─ GET  /login                    → Show login form
├─ POST /login                    → Authenticate, redirect by role
├─ GET  /register                 → Show registration form
├─ POST /register                 → Create user, redirect by role
├─ POST /logout                   → Destroy session, redirect to /
└─ GET  /                         → Home page

VENDOR ROUTES (auth + vendor + approved):
├─ GET  /vendor/dashboard         → Dashboard
├─ GET  /vendor/profile           → Profile
├─ GET  /vendor/experiences       → Experience list
├─ POST /vendor/experiences       → Create experience
├─ GET  /vendor/bookings          → Booking list
├─ POST /vendor/bookings/{id}/check-in → Validate booking
└─ GET  /vendor/settlements       → Settlement history

CUSTOMER ROUTES (auth):
├─ GET  /dashboard                → Dashboard
├─ GET  /bookings                 → My bookings
├─ GET  /profile                  → My profile
├─ GET  /explore                  → Browse experiences
└─ GET  /holds                    → My holds/reservations
```

---

## ✅ Checklist

- [x] ✅ Updated AuthenticatedSessionController for role-based redirect
- [x] ✅ Updated RegisteredUserController for role-based redirect
- [ ] ⏳ Update registration form to ask for role selection
- [ ] ⏳ Update registration endpoint to store role and vendor fields
- [ ] ⏳ Add vendor info fields to registration form
- [ ] ⏳ Test vendor registration flow
- [ ] ⏳ Test vendor login flow
- [ ] ⏳ Test customer login flow (should NOT go to /vendor/dashboard)
- [ ] ⏳ Verify middleware blocks non-vendors from /vendor/* routes

---

## 💡 Summary

### Vendor Registration:
1. Visit `/register`
2. Fill form (name, email, password)
3. Select role: **Vendor**
4. Submit
5. Auto-redirected to → `/vendor/dashboard`
6. See message: "Account pending approval"

### Vendor Login:
1. Visit `/login`
2. Enter email & password
3. Submit
4. Auto-redirected to → `/vendor/dashboard`
5. If approved, see dashboard ✅

### Access Vendor Panel:
- All routes start with `/vendor/` prefix
- Protected by `['auth', 'vendor']` middleware
- Requires admin approval

---

**Last Updated**: February 20, 2026
**Version**: 1.0
