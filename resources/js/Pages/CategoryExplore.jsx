import AppLayout from '@/Layouts/AppLayout';
import { Link, usePage, router } from '@inertiajs/react';
import { Clock, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function CategoryExplore({ category = '', experiences = [] }) {
  const { auth } = usePage().props;
  const user = auth?.user;

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Format category title for display
  const formatCategoryTitle = (cat) => {
    return cat.charAt(0).toUpperCase() + cat.slice(1).replace(/([A-Z])/g, ' ₹1').trim();
  };

  // FILTER LOGIC
  const filteredExperiences = experiences.filter((exp) => {
    // Search filter
    const title = (exp.title || '').toLowerCase();
    const location = (exp.location || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    
    if (searchQuery && !title.includes(query) && !location.includes(query)) {
      return false;
    }

    if (activeFilter === 'all') return true;

    if (activeFilter === 'priority') {
      return (exp.priority_score || 0) > 80 || exp.priority === true;
    }

    if (activeFilter === 'date') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expDate = new Date(exp.date || exp.created_at || Date.now());
      expDate.setHours(0, 0, 0, 0);
      return expDate >= today;
    }

    if (activeFilter === 'time') {
      try {
        const timeStr = exp.start_time || (exp.date && exp.date.split(' ')[1]) || '09:00';
        const hour = parseInt(timeStr.split(':')[0]);
        return hour >= 18;
      } catch {
        return false;
      }
    }

    if (activeFilter === 'highPrice') {
      return (exp.price || 0) > 100;
    }

    if (activeFilter === 'lowPrice') {
      return (exp.price || 0) <= 100;
    }

    return true;
  });

  return (
    <AppLayout>
      {/* Header with back button */}
      {/* <div className="flex items-center gap-3 mb-6 md:mb-8">
        <Link href="/explore" className="text-brand-secondary dark:text-gray-400 hover:text-brand-primary dark:hover:text-blue-400 transition-colors">
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
        </Link>
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-brand-primary dark:text-gray-100">
          {formatCategoryTitle(category)}
        </h1>
      </div> */}

      {/* Search Bar */}
      <div className="relative mb-6 md:mb-8">
        <input
          type="text"
          placeholder="Search experiences..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-12 py-3 md:py-4 rounded-xl bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 border-0 focus:ring-2 focus:ring-brand-primary dark:focus:ring-blue-400 text-sm md:text-base"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Experiences Section */}
      <section>
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-sm md:text-base font-semibold text-brand-secondary dark:text-gray-400 uppercase tracking-wider">
            {formatCategoryTitle(category)} Experiences
          </h2>
        </div>

        {/* Filters */}
        <div className="flex gap-0 mb-4 overflow-x-auto no-scrollbar pb-2">
          <FilterButton label="All" active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
          <FilterButton label="Priority Access" active={activeFilter === 'priority'} onClick={() => setActiveFilter('priority')} />
          <FilterButton label="Upcoming Dates" active={activeFilter === 'date'} onClick={() => setActiveFilter('date')} />
          <FilterButton label="Evening Time" active={activeFilter === 'time'} onClick={() => setActiveFilter('time')} />
          <FilterButton label="Premium (₹100+)" active={activeFilter === 'highPrice'} onClick={() => setActiveFilter('highPrice')} />
          <FilterButton label="Budget" active={activeFilter === 'lowPrice'} onClick={() => setActiveFilter('lowPrice')} />
        </div>

        {/* Experience Cards */}
        <div className="space-y-4">
          {filteredExperiences.length === 0 ? (
            <div className="text-center py-12">
          <p className="text-brand-secondary dark:text-gray-400 text-sm mb-2">No experiences match this filter.</p>
              <FilterButton 
                label="Show All" 
                onClick={() => setActiveFilter('all')} 
                className="!bg-brand-primary text-white text-xs px-4"
              />
            </div>
          ) : (
            filteredExperiences.map((exp, index) => (
              <FeaturedCard
                key={exp.id || index}
                id={exp.id}
                title={exp.title || 'Untitled'}
                location={exp.location || 'Location'}
                date={exp.date || "Oct 24, 2026"}
                attendees={exp.capacity || exp.location || '50'}
                price={exp.instant_price ? parseFloat(exp.instant_price) : parseFloat(exp.hold_token || 0)}
                instant_price={exp.instant_price}
                instant_availability={exp.instant_availability}
                hold_token={exp.hold_token}
                image={exp.image}
                badge={(exp.priority_score || 0) > 80 ? 'PRIORITY ACCESS' : null}
                is_booked={exp.is_booked || false}
                booking_id={exp.booking_id || null}
                is_secured={exp.is_secured || false}
                hold_id={exp.hold_id || null}
                booking_mode={exp.booking_mode || 'both'}
              />
            ))
          )}
        </div>
      </section>
    </AppLayout>
  );
}

function FilterButton({ label, active, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 mx-1 mt-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${className} ${
        active 
          ? 'bg-brand-primary text-white shadow-md ring-2 ring-blue-300 dark:ring-blue-500' 
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );
}

function FeaturedCard({ id, title, location, date, attendees, price, instant_price = null, instant_availability = 0, hold_token = null, image, badge, is_booked = false, booking_id = null, is_secured = false, hold_id = null, booking_mode = 'both' }) {
  const { auth } = usePage().props;
  const user = auth?.user;
  
  // Determine if displaying instant price or hold token price
  // Match Show.jsx logic: only show instant price if it exists AND instant_availability > 0
  const isShowingInstantPrice = instant_price && parseFloat(instant_price) > 0 && parseFloat(instant_availability) > 0;
  const displayPrice = isShowingInstantPrice ? parseFloat(instant_price) : parseFloat(hold_token || price || 0);
  const priceLabel = isShowingInstantPrice ? '⚡ From ' : '🔒 Token ';
  
  const handleInstantBooking = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.visit('/login');
      return;
    }
    // Redirect to experience page instead of booking directly
    router.visit(`/experience/${id}`);
  };

  const handleHoldBooking = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.visit('/login');
      return;
    }
    // Redirect to experience page instead of booking directly
    router.visit(`/experience/${id}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <Link
        href={`/experience/${id}`}
        className="block"
      >
        <div className="relative h-40">
          <img
            src={
              image
                ? (image.startsWith('/') ? image : `/assets/experiences/${image}`)
                : 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=160&fit=crop'
            }
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=160&fit=crop';
            }}
          />
          {badge && (
            <div className="absolute top-3 left-3 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              {badge}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 flex-1 leading-tight line-clamp-2 mb-2">{title}</h3>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{date}</span>
            </div>
            <span>{attendees}</span>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{priceLabel}</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ₹{isShowingInstantPrice ? displayPrice.toFixed(0) : displayPrice.toFixed(2)}
          </span>
        </div>
        {is_booked ? (
          // Already booked - show View Booking button
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.visit(`/bookings/${booking_id}`);
            }}
            className="text-white px-2 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800"
          >
            ✅ View Booking
          </button>
        ) : is_secured ? (
          // Already has hold - show View Hold button
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.visit(`/holds/${hold_id}`);
            }}
            className="text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            ✅ View Hold
          </button>
        ) : (
          // No booking yet - show options based on booking_mode
          booking_mode === 'instant' ? (
            // Only instant booking available
            <button
              onClick={handleInstantBooking}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 transition-all whitespace-nowrap"
            >
              ⚡ Book Now
            </button>
          ) : (
            // Both booking modes available
            <div className="flex flex-row gap-1.5">
              <button
                onClick={handleInstantBooking}
                className="px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 transition-all whitespace-nowrap"
              >
                ⚡ Book
              </button>
              <button
                onClick={handleHoldBooking}
                className="px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-brand-primary dark:bg-blue-600 hover:bg-brand-primary/90 dark:hover:bg-blue-700 transition-all whitespace-nowrap"
              >
                🔒 Hold
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
