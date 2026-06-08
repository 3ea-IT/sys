# Temple Module - File Structure Guide

This folder contains all temple-related pages for your booking system.

## 📁 Current Files

### Index.jsx

Main temple exploration page featuring:

- Search functionality for temples
- Quick services grid (Book Darshan, VIP Access, Prasad, etc.)
- Popular Temples section
- Upcoming Festivals section
- VIP Darshan Available section
- Browse by Crowd filter
- AI Spiritual Guide section

**Props Expected:**

```javascript
{
  temples: Array,      // List of all temples
  festivals: Array,    // Upcoming festivals
  vipDarshans: Array,  // VIP darshan offerings
  categories: Array,   // Temple categories
  userLocation: String // User's location
}
```

### Show.jsx

Individual temple detail page featuring:

- Hero image with temple info
- Rating, Crowd level, VIP availability badges
- Tabs: Overview, Timings, Facilities, Reviews
- Darshan timings with special events
- Amenities list
- Facilities showcase
- User reviews section
- Regular and VIP booking options

**Props Expected:**

```javascript
{
    temple: {
        (id,
            name,
            location,
            image,
            rating,
            crowd_level,
            has_vip_darshan,
            description,
            amenities,
            timings,
            regular_price,
            vip_price,
            daily_slots,
            avg_wait);
    }
}
```

## 📋 Recommended Files to Add

### 1. **Book.jsx** - Booking/Reservation Page

- Date & time slot selection
- Number of people selection
- Darshan type (Regular/VIP)
- Special requirements form
- Payment integration

### 2. **Festivals.jsx** - Festivals Listing

- List all upcoming festivals
- Filter by crowd, date, location
- Festival details modal
- Crowd alerts

### 3. **VIP.jsx** - VIP Darshan Details

- VIP package details
- Benefits list
- Pricing tiers
- Booking flow

### 4. **SpiritualGuide.jsx** - AI Chatbot

- Chat interface for temple queries
- AI suggestions
- Ritual information
- Best visiting times

### 5. **MyBookings.jsx** - User's Bookings

- List all temple bookings
- Booking details
- Cancellation option
- Past bookings history

### 6. **ReviewForm.jsx** - Add Reviews

- Star rating system
- Review text area
- Photo upload
- Submit flow

## 🎨 Design Pattern Notes

- **Colors**: Orange/Amber primary colors match the theme
- **Responsive**: Mobile-first design with md/lg breakpoints
- **Components**: Uses reusable cards (TempleCard, FestivalCard, VIPCard)
- **Dark Mode**: Full support with dark: utilities
- **Icons**: Emoji-based icons for quick visual recognition

## 🔗 Route Structure

Add these routes to your `web.php`:

```php
Route::middleware('auth')->group(function () {
    Route::get('/temple', [TempleController::class, 'index'])->name('temple.index');
    Route::get('/temple/{temple}', [TempleController::class, 'show'])->name('temple.show');
    Route::get('/temple/{temple}/book', [TempleController::class, 'book'])->name('temple.book');
    Route::post('/temple/{temple}/bookings', [TempleBookingController::class, 'store'])->name('temple.bookings.store');
    Route::get('/temple/bookings', [TempleBookingController::class, 'index'])->name('temple.bookings.index');
    Route::get('/temple/festivals', [TempleController::class, 'festivals'])->name('temple.festivals');
    Route::get('/temple/vip', [TempleController::class, 'vip'])->name('temple.vip');
    Route::get('/temple/spiritual-guide', [SpiritualGuideController::class, 'index'])->name('temple.guide');
});
```

## 📊 Database Models Needed

1. **Temple** - Main temple records
2. **TempleBooking** - User bookings
3. **Festival** - Upcoming festivals
4. **TempleReview** - User reviews
5. **DarshanTiming** - Operating hours
6. **TempleAmenity** - Available facilities

## 🚀 Quick Start

1. Create your controllers for each route
2. Create corresponding models and migrations
3. Create additional page components as needed
4. Link the pages using the route names

All pages follow the same design system as Dashboard.jsx and Explore.jsx for consistency!
