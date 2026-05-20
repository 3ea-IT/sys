import AppLayout from "@/Layouts/AppLayout";
import { Link, usePage, router } from "@inertiajs/react";

export default function Dashboard({
  nearby = [],
  movies = [],
  expiring = [],
  activity = [],
  wallet = {},
}) {
  const { auth } = usePage().props;
  const user = auth?.user;

  // Format minutes to HH:MM format
  const formatDuration = (minutes) => {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleExperienceAction = (exp) => {
    if (!user) {
      router.visit('/login');
      return;
    }

    // NEW: Check if already booked
    if (exp.is_booked) {
      router.visit(`/bookings/${exp.booking_id}`);
      return;
    }

    // Check if already has active hold
    if (exp.is_secured) {
      router.visit(`/holds/${exp.hold_id}`);
      return;
    }

    // Check booking mode and availability
    if (exp.supports_instant && exp.instant_availability > 0) {
      // Instant booking available - go to experience detail
      router.visit(`/experience/${exp.id}`);
    } else if (exp.supports_hold) {
      // Hold booking - create hold
      router.post("/holds", { experience_id: exp.id });
    } else {
      // No booking options available
      alert('No booking slots available');
    }
  };

  const handleInstantBooking = (e, exp) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.visit('/login');
      return;
    }
    // Redirect to experience page instead of booking directly
    router.visit(`/experience/${exp.id}`);
  };

  const handleHoldBooking = (e, exp) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.visit('/login');
      return;
    }
    // Redirect to experience page instead of booking directly
    router.visit(`/experience/${exp.id}`);
  };

  const handleMovieClick = (movie) => {
    if (!user) {
      router.visit('/login');
      return;
    }
    // Go to cinema selection page for this movie via preview route
    router.post('/movies/preview/cinemas', { movie });
  };

  // Category definitions
  const categories = [
    { label: "Movies",        icon: "🎬", href: "/movies" },
    { label: "TATA IPL 2026", icon: "🏏", href: "/ipl" },
    { label: "Sports",        icon: "⚽", href: "/explore/sports" },
    { label: "Music Shows",   icon: "🎵", href: "/explore/music-shows" },
    { label: "Comedy Shows",  icon: "😂", href: "/explore/comedy-shows" },
  ];

  return (
    <AppLayout>
      {/* Header - UNCHANGED */}
      <div>
        <p className="text-sm md:text-base text-brand-secondary dark:text-gray-400">Good evening,</p>
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-brand-primary dark:text-gray-100">
          Welcome, {user?.name?.split(' ')[0] || 'User'}
        </h1>
      </div>

      {/* ── CATEGORY ICONS ROW - NEW ── */}
      <div className="mt-4 -mx-4 md:-mx-6 lg:-mx-8">
        <div className="flex overflow-x-auto no-scrollbar px-4 md:px-6 lg:px-8 pb-1 gap-1">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="flex flex-col items-center gap-0.5 flex-shrink-0 px-2 group"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-all shadow-sm">
                  {cat.icon}
                </div>
                {cat.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[7px] font-bold px-0.5 py-0 rounded leading-none">
                    {cat.badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] text-center font-medium text-gray-700 dark:text-gray-300 leading-tight max-w-[50px] group-hover:text-brand-primary transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Banner Image */}
      <div className="mt-4 md:mt-8 lg:mt-10 rounded-lg md:rounded-2xl overflow-hidden shadow-card">
        <img
          src="/banner/banner-new.png"
          alt="Banner"
          className="w-full h-auto object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* Nearby Experiences - ENHANCED WITH DUAL MODE */}
      <section className="mt-6 md:mt-8 lg:mt-10">
        <div className="flex justify-between items-center mb-4 md:mb-6 px-0">
          <h2 className="font-semibold text-lg md:text-2xl lg:text-3xl text-brand-primary dark:text-gray-100">
            Nearby Experiences
          </h2>
          <Link href="/explore" className="text-xs md:text-sm text-brand-secondary dark:text-gray-400 hover:text-brand-primary transition-colors">
            View all
          </Link>
        </div>

        {/* Mobile/Tablet: Horizontal Scroll */}
        <div className="lg:hidden flex gap-4 overflow-x-auto no-scrollbar pb-1">
          {nearby.length === 0 && (
            <p className="text-sm text-brand-secondary dark:text-gray-400">
              No experiences available
            </p>
          )}

          {nearby.map(exp => {
            const showInstant = exp.supports_instant && exp.instant_availability > 0;
            const showHold = exp.supports_hold;

            return (
              <div
                key={exp.id}
                onClick={() => !exp.is_booked && !exp.is_secured && !exp.seats_full && router.visit(`/experience/${exp.id}`)}
                className={`min-w-[240px] mr-1 bg-white dark:bg-gray-800 rounded-lg shadow-card overflow-hidden flex flex-col cursor-pointer transition-all relative ${exp.seats_full ? 'opacity-50' : 'hover:shadow-xl'}`}
              >
                {/* Seats Full Strip */}
                {exp.seats_full && (
                  <div className="absolute top-[40%] left-0 right-0 z-40 bg-gradient-to-r from-red-600 to-red-700 backdrop-blur-sm px-3 py-1.5 text-center">
                    <p className="text-white text-xs font-bold tracking-wide">🚫 SEATS FULL</p>
                  </div>
                )}

                {/* Image or Placeholder */}
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={exp.image 
                      ? (exp.image.startsWith('/') ? exp.image : `/assets/experiences/${exp.image}`) 
                      : 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=160&fit=crop'}
                    alt={exp.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=160&fit=crop';
                    }}
                  />

                  <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded">
                    {exp.category?.toUpperCase() || 'VIP'}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-white text-[10px] px-2 py-1 rounded shadow-sm">
                    📍 {exp.distance || '0.4 mi'}
                  </span>
                </div>

                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="text-sm font-semibold line-clamp-2 dark:text-gray-100">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-brand-secondary dark:text-gray-400 mt-1">
                    {exp.location}
                  </p>
                  <p className="text-xs text-brand-secondary dark:text-gray-400 mt-1">
                    {(() => {
                      let dateStr = '';
                      if (exp.start_date) {
                        let d = exp.start_date;
                        // Handle Carbon object serialization or ISO string
                        if (typeof d === 'object' && d.date) d = d.date;
                        try {
                          const dateObj = new Date(d);
                          dateStr = dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
                        } catch {
                          dateStr = d;
                        }
                      }
                      return dateStr + (exp.start_time ? ` | ${exp.start_time}` : '');
                    })()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Seats: {exp.instant_availability || '50'}
                  </p>

                  {/* TWO SEPARATE BOOKING BUTTONS */}
                  {exp.is_booked ? (
                    // Already booked - show View Booking button
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.visit(`/bookings/${exp.booking_id}`);
                      }}
                      className="mt-2 w-full text-center text-sm py-2.5 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-all"
                    >
                      ✅ View Booking
                    </button>
                  ) : exp.is_secured ? (
                    // Already has hold - show View Hold button
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.visit(`/holds/${exp.hold_id}`);
                      }}
                      className="mt-2 w-full text-center text-sm py-2.5 rounded-lg font-medium border-2 border-brand-primary text-brand-primary dark:text-blue-400 dark:border-blue-400 bg-white dark:bg-gray-800 hover:bg-brand-primary hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all"
                    >
                      ✅ View Hold
                    </button>
                  ) : (
                    // No booking yet - show options based on booking_mode
                    exp.booking_mode === 'instant' ? (
                      // Only instant booking available
                      <button
                        onClick={(e) => handleInstantBooking(e, exp)}
                        disabled={exp.seats_full}
                        className={`mt-2 w-full text-center text-sm py-2.5 rounded-lg font-semibold transition-all ${
                          exp.seats_full
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800'
                        }`}
                      >
                        {exp.seats_full ? '❌ Fully Booked' : '⚡ Book Now'}
                      </button>
                    ) : (
                      // Both booking modes available
                      <div className="mt-2 flex flex-row gap-1.5">
                        <button
                          onClick={(e) => handleInstantBooking(e, exp)}
                          disabled={exp.seats_full}
                          className={`flex-1 text-center text-xs py-2 px-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                            exp.seats_full
                              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800'
                          }`}
                        >
                          {exp.seats_full ? '❌ Sold Out' : '⚡ Book'}
                        </button>
                        <button
                          onClick={(e) => handleHoldBooking(e, exp)}
                          className="flex-1 text-center text-xs py-1.5 px-1 rounded-lg font-semibold bg-brand-primary text-white hover:bg-brand-primary/90 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all whitespace-nowrap"
                        >
                          🔒 Hold
                        </button>
                      </div>
                    )
                  )}

                  {/* Booking Mode Badge */}
                  {exp.booking_mode === 'both' && !exp.is_secured && !exp.is_booked && (
                    <div className="mt-1 text-[10px] text-brand-secondary dark:text-gray-400 text-center">
                      Both options available
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {nearby.map(exp => {
            const showInstant = exp.supports_instant && exp.instant_availability > 0;
            const showHold = exp.supports_hold;

            return (
              <div
                key={exp.id}
                onClick={() => !exp.is_booked && !exp.is_secured && !exp.seats_full && router.visit(`/experience/${exp.id}`)}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-card overflow-hidden flex flex-col cursor-pointer relative transition-all ${exp.seats_full ? 'opacity-50' : 'hover:shadow-xl'}`}
              >
                {/* Seats Full Strip */}
                {exp.seats_full && (
                  <div className="absolute top-[40%] left-0 right-0 z-40 bg-gradient-to-r from-red-600 to-red-700 backdrop-blur-sm px-3 py-1 text-center">
                    <p className="text-white text-xs font-bold tracking-wide">🚫 SEATS FULL</p>
                  </div>
                )}

                {/* Image or Placeholder */}
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={exp.image 
                      ? (exp.image.startsWith('/') ? exp.image : `/assets/experiences/${exp.image}`) 
                      : 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=160&fit=crop'}
                    alt={exp.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=160&fit=crop';
                    }}
                  />

                  <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded">
                    {exp.category?.toUpperCase() || 'VIP'}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-white text-[10px] px-2 py-1 rounded shadow-sm">
                    📍 {exp.distance || '0.4 mi'}
                  </span>
                </div>

                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="text-sm font-semibold line-clamp-2 dark:text-gray-100">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-brand-secondary dark:text-gray-400 mt-1">
                    {exp.location}
                  </p>

                  {/* TWO SEPARATE BOOKING BUTTONS */}
                  {exp.is_booked ? (
                    // Already booked - show View Booking button
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.visit(`/bookings/${exp.booking_id}`);
                      }}
                      className="mt-2 w-full text-center text-sm py-2.5 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-all"
                    >
                      ✅ View Booking
                    </button>
                  ) : exp.is_secured ? (
                    // Already has hold - show View Hold button
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.visit(`/holds/${exp.hold_id}`);
                      }}
                      className="mt-2 w-full text-center text-sm py-2.5 rounded-lg font-medium border-2 border-brand-primary text-brand-primary dark:text-blue-400 dark:border-blue-400 bg-white dark:bg-gray-800 hover:bg-brand-primary hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all"
                    >
                      ✅ View Hold
                    </button>
                  ) : (
                    // No booking yet - show options based on booking_mode
                    exp.booking_mode === 'instant' ? (
                      // Only instant booking available
                      <button
                        onClick={(e) => handleInstantBooking(e, exp)}
                        disabled={exp.seats_full}
                        className={`mt-2 w-full text-center text-sm py-2.5 rounded-lg font-semibold transition-all ${
                          exp.seats_full
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800'
                        }`}
                      >
                        {exp.seats_full ? '❌ Fully Booked' : '⚡ Book Now'}
                      </button>
                    ) : (
                      // Both booking modes available
                      <div className="mt-2 flex flex-row gap-1.5">
                        <button
                          onClick={(e) => handleInstantBooking(e, exp)}
                          disabled={exp.seats_full}
                          className={`flex-1 text-center text-xs py-2 px-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                            exp.seats_full
                              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800'
                          }`}
                        >
                          {exp.seats_full ? '❌ Sold Out' : '⚡ Book'}
                        </button>
                        <button
                          onClick={(e) => handleHoldBooking(e, exp)}
                          className="flex-1 text-center text-xs py-1.5 px-1 rounded-lg font-semibold bg-brand-primary text-white hover:bg-brand-primary/90 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all whitespace-nowrap"
                        >
                          🔒 Hold
                        </button>
                      </div>
                    )
                  )}

                  {/* Booking Mode Badge */}
                  {exp.booking_mode === 'both' && !exp.is_secured && !exp.is_booked && (
                    <div className="mt-1 text-[10px] text-brand-secondary dark:text-gray-400 text-center">
                      Both options available
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* Movie Tickets - INSTANT BOOKING ONLY */}
      <section className="mt-6 md:mt-8 lg:mt-10">
        <div className="flex justify-between items-center mb-4 md:mb-6 px-0">
          <h2 className="font-semibold text-lg md:text-2xl lg:text-3xl text-brand-primary dark:text-gray-100">
            🎬 Trending Movies
          </h2>
          <Link href="/movies" className="text-xs md:text-sm text-brand-secondary dark:text-gray-400 hover:text-brand-primary transition-colors">
            View all
          </Link>
        </div>

        {/* Mobile/Tablet: Horizontal Scroll */}
        <div className="lg:hidden flex gap-4 overflow-x-auto no-scrollbar pb-1">
          {movies.length === 0 && (
            <p className="text-sm text-brand-secondary dark:text-gray-400">
              No movies available
            </p>
          )}

          {movies.map(movie => {
            return (
              <div
                key={movie.id}
                onClick={() => handleMovieClick(movie)}
                className={`min-w-[240px] mr-1 bg-white dark:bg-gray-800 rounded-lg shadow-card overflow-hidden flex flex-col cursor-pointer transition-all relative hover:shadow-xl`}
              >
                {/* Image or Placeholder */}
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={movie.image 
                      ? (movie.image.startsWith('/') ? movie.image : `/assets/movies/${movie.image}`) 
                      : 'https://images.unsplash.com/photo-1489599849228-ed304dbb6b38?w=400&h=160&fit=crop'}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1489599849228-ed304dbb6b38?w=400&h=160&fit=crop';
                    }}
                  />

                  <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded">
                    {movie.format || 'MOVIE'}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-white text-[10px] px-2 py-1 rounded shadow-sm">
                    🎟️ {movie.available_seats}/{movie.total_seats}
                  </span>
                </div>

                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="text-sm font-semibold line-clamp-2 dark:text-gray-100">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-brand-secondary dark:text-gray-400 mt-1">
                    {movie.language} • {movie.category}
                  </p>
                  <p className="text-xs text-brand-secondary dark:text-gray-400 mt-0.5">
                    ⏱️ {formatDuration(movie.duration || 150)}
                  </p>

                  {/* Show Selection Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleMovieClick(movie);
                    }}
                    className="mt-2 w-full text-center text-sm py-2.5 rounded-lg font-semibold bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800 transition-all"
                  >
                    🎭 Select Cinema
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {movies.map(movie => {
            return (
              <div
                key={movie.id}
                onClick={() => handleMovieClick(movie)}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-card overflow-hidden flex flex-col cursor-pointer relative transition-all hover:shadow-xl`}
              >
                {/* Image or Placeholder */}
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={movie.image 
                      ? (movie.image.startsWith('/') ? movie.image : `/assets/movies/${movie.image}`) 
                      : 'https://images.unsplash.com/photo-1489599849228-ed304dbb6b38?w=400&h=160&fit=crop'}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1489599849228-ed304dbb6b38?w=400&h=160&fit=crop';
                    }}
                  />

                  <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded">
                    {movie.format || 'MOVIE'}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-orange-600 text-white text-[10px] px-2 py-1 rounded shadow-sm font-semibold">
                    {movie.rating || 'UA'}
                  </span>
                </div>

                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="text-sm font-semibold line-clamp-2 dark:text-gray-100">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-brand-secondary dark:text-gray-400 mt-1">
                    {movie.language} • {movie.category}
                  </p>
                  <p className="text-xs text-brand-secondary dark:text-gray-400 mt-0.5">
                    ⏱️ {formatDuration(movie.duration || 150)}
                  </p>

                  {/* Show Selection Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleMovieClick(movie);
                    }}
                    className="mt-2 w-full text-center text-sm py-2.5 rounded-lg font-semibold bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800 transition-all"
                  >
                    🎭 Select Cinema
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </section>
      {/* <section className="mt-6 md:mt-8 lg:mt-10">
        <div className="flex justify-between items-center mb-4 md:mb-6 px-0">
          <h2 className="font-semibold text-lg md:text-2xl lg:text-3xl text-brand-primary dark:text-gray-100">
            Expiring Soon
          </h2>
          <Link href="/holds" className="text-xs md:text-sm text-brand-secondary dark:text-gray-400 hover:text-brand-primary transition-colors">
            View all
          </Link>
        </div> */}

        {/* Mobile/Tablet: Horizontal Scroll */}
        {/* <div className="lg:hidden flex gap-6 overflow-x-auto pb-1 no-scrollbar">
          {expiring.length === 0 && (
            <p className="text-sm text-brand-secondary dark:text-gray-400">
              No expiring holds
            </p>
          )}

          {expiring.map(item => (
            <div
              key={item.id}
              onClick={() => router.visit(`/experience/${item.experience_id}`)}
              className="min-w-[200px] bg-white dark:bg-gray-800 rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="relative h-32">
                <img
                  src={item.image 
                    ? (item.image.startsWith('/') ? item.image : `/assets/experiences/${item.image}`) 
                    : 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=160&fit=crop'}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=160&fit=crop';
                  }}
                />

                <span className="absolute bottom-2 left-2 bg-white/90 text-red-600 text-[10px] px-2 py-1 rounded font-medium">
                  {item.time_left}
                </span>
                <span className="absolute bottom-2 right-2 bg-white/90 text-gray-800 text-[10px] px-2 py-1 rounded">
                  {item.seats_left} Seats
                </span>
              </div>

              <div className="p-3">
                <h3 className="text-xs font-semibold line-clamp-1 dark:text-gray-100">
                  {item.title}
                </h3>
                <p className="text-[11px] text-brand-secondary dark:text-gray-400 mt-1">
                  {item.date}
                </p>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.visit(`/holds/${item.hold_id}`);
                  }}
                  className="mt-2 w-full text-center border-2 border-brand-primary text-brand-primary text-xs py-1.5 rounded-lg font-medium hover:bg-brand-primary hover:text-white transition-all"
                >
                  ✅ Manage Hold
                </button>
              </div>
            </div>
          ))}
        </div> */}

        {/* Desktop: Grid Layout */}
        {/* <div className="hidden lg:grid lg:grid-cols-4 gap-6">
          {expiring.map(item => (
            <div
              key={item.id}
              onClick={() => router.visit(`/experience/${item.experience_id}`)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="relative h-32">
                <img
                  src={item.image 
                    ? (item.image.startsWith('/') ? item.image : `/assets/experiences/${item.image}`) 
                    : 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=160&fit=crop'}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=160&fit=crop';
                  }}
                />

                <span className="absolute bottom-2 left-2 bg-white/90 text-red-600 text-[10px] px-2 py-1 rounded font-medium">
                  {item.time_left}
                </span>
                <span className="absolute bottom-2 right-2 bg-white/90 text-gray-800 text-[10px] px-2 py-1 rounded">
                  {item.seats_left} Seats
                </span>
              </div>

              <div className="p-3">
                <h3 className="text-xs font-semibold line-clamp-1 dark:text-gray-100">
                  {item.title}
                </h3>
                <p className="text-[11px] text-brand-secondary dark:text-gray-400 mt-1">
                  {item.date}
                </p>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.visit(`/holds/${item.hold_id}`);
                  }}
                  className="mt-2 w-full text-center border-2 border-brand-primary text-brand-primary text-xs py-1.5 rounded-lg font-medium hover:bg-brand-primary hover:text-white transition-all"
                >
                  ✅ Manage Hold
                </button>
              </div>
            </div>
          ))}
        </div>

      </section> */}

      {/* Recent Activity - UNCHANGED */}
      <section className="mt-6 md:mt-8 lg:mt-10">
        <h2 className="font-semibold text-lg md:text-2xl lg:text-3xl text-brand-primary dark:text-gray-100 mb-3 md:mb-4">
          Your Recent Activity
        </h2>

        <div className="space-y-1">
          {activity.length === 0 && (
            <p className="text-sm text-brand-secondary dark:text-gray-400">
              No recent activity
            </p>
          )}

          {activity.map((log, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-start gap-3 shadow-card hover:shadow-xl transition-shadow"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                ✓
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1 dark:text-gray-100">
                  {log.title}
                </p>
                <p className="text-xs text-brand-secondary dark:text-gray-400 line-clamp-1 mt-0.5">
                  {log.subtitle}
                </p>
              </div>

              <span className="text-xs text-brand-secondary dark:text-gray-400 font-medium flex-shrink-0">
                {log.time}
              </span>
            </div>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}