import AppLayout from '@/Layouts/AppLayout';
import { Link, usePage, router } from '@inertiajs/react';
import { Clock, X, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function Explore({ categories = [], experiences = [], category = '' }) {
  const { auth } = usePage().props;
  const user = auth?.user;

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // SEARCH LOGIC - Filter experiences based on search query
  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : experiences.filter((exp) => {
        const title = (exp.title || '').toLowerCase();
        const location = (exp.location || '').toLowerCase();
        const query = searchQuery.toLowerCase();
        return title.includes(query) || location.includes(query);
      });

  // FILTER LOGIC - Fixed with null checks
  const filteredExperiences = experiences.filter((exp) => {
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (experienceId) => {
    setSearchQuery('');
    setShowSuggestions(false);
    router.visit(`/experience/${experienceId}`);
  };

  return (
    <AppLayout>
      {/* Header - With Back Button */}
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100">
          Explore
        </h1>

      </div>

      {/* Search Bar */}
      <div className="relative mb-6 md:mb-8">
        <input
          type="text"
          placeholder="Search experiences..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setShowSuggestions(true)}
          className="w-full pl-10 pr-12 py-3 md:py-4 rounded-xl bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 border-0 focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {/* {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setShowSuggestions(false);
            }}
            className="absolute right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        )} */}

        {/* Search Suggestions Dropdown */}
        {showSuggestions && searchQuery.trim() !== '' && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                No experiences found matching "{searchQuery}"
              </div>
            ) : (
              searchResults.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => handleSuggestionClick(exp.id)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {exp.title || 'Untitled'}
                  </p>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Categories */}
      <section className="mb-8 md:mb-12">
        <h2 className="text-sm md:text-base font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 md:mb-6">Event Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          <CategoryCard title="Movies" icon="🎬" image="/assets/categories/movies.jpg" href="/movies" />
          <CategoryCard title="TATA IPL 2026" icon="🏏" image="/assets/categories/ipl.jpg" href="/ipl" />
          <CategoryCard title="Sports" icon="⚽" image="/assets/categories/sports.jpg" href="/explore/sports" />
          <CategoryCard title="Music Shows" icon="🎵" image="/assets/categories/music-shows.jpg" href="/explore/music-shows" />
        </div>
        <div className="mt-3 md:mt-4">
          <CategoryCard title="Comedy Shows" icon="😂" image="/assets/categories/comedy-shows.jpg" href="/explore/comedy-shows" className="w-32 md:w-40" />
        </div>
      </section>

      {/* Featured Access */}
      <section>
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-sm md:text-base font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Featured Events</h2>
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

        {/* Featured Cards */}
        <div className="space-y-4">
          {filteredExperiences.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">No experiences match this filter.</p>
              <FilterButton 
                label="Show All" 
                onClick={() => setActiveFilter('all')} 
                className="!bg-gray-900 text-white text-xs px-4"
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
                is_booked={exp.is_booked}
                booking_id={exp.booking_id}
                is_secured={exp.is_secured}
                hold_id={exp.hold_id}
                booking_mode={exp.booking_mode}              seats_full={exp.seats_full}              />
            ))
          )}
        </div>
      </section>
    </AppLayout>
  );
}

// Components unchanged
function CategoryCard({ title, icon, image, href, className = '' }) {
  return (
    <Link href={href} className={className}>
      <div 
        className="rounded-lg p-4 h-28 flex flex-col justify-between text-white relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.3) 100%), url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-lg">{icon}</div>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
    </Link>
  );
}

function FilterButton({ label, active, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 mx-1 mt-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${className} ${
        active 
          ? 'bg-emerald-500 text-white shadow-md ring-2 ring-emerald-300' 
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );
}

function FeaturedCard({ id, title, location, date, attendees, price, instant_price = null, instant_availability = 0, hold_token = null, image, badge, is_booked = false, booking_id = null, is_secured = false, hold_id = null, booking_mode = 'both', seats_full = false }) {
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
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 transition-all relative ${seats_full ? 'opacity-50' : 'hover:shadow-md'}`}>
      {/* Booking Status Badge */}
      {is_booked && (
        <div className="absolute top-2 right-2 z-10 bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
          <span>✅</span>
          <span>Booked</span>
        </div>
      )}
      
      {is_secured && !is_booked && (
        <div className="absolute top-2 right-2 z-20 bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
          <span>🔒</span>
          <span>On Hold</span>
        </div>
      )}

      {/* Seats Full Strip */}
      {seats_full && (
        <div className="absolute top-[40%] left-0 right-0 z-40 bg-gradient-to-r from-red-600 to-red-700 backdrop-blur-sm px-4 py-1.5 text-center">
          <p className="text-white text-xs font-bold tracking-wide">🚫 SEATS FULL</p>
        </div>
      )}

      <Link
        href={seats_full ? '#' : `/experience/${id}`}
        className={`block ${seats_full ? 'pointer-events-none cursor-not-allowed' : ''}`}
        onClick={(e) => seats_full && (e.preventDefault(), e.stopPropagation())}
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
            <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
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
      <div className="px-4 pb-4 flex items-center justify-between gap-1">
        <div className="flex flex-col">
          {/* <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{priceLabel}</span> */}
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
