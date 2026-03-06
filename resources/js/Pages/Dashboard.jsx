import AppLayout from "@/Layouts/AppLayout";
import { Link, usePage, router } from "@inertiajs/react";

export default function Dashboard({
  nearby = [],
  expiring = [],
  activity = [],
  wallet = {},
}) {
  const { auth } = usePage().props;
  const user = auth?.user;

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

  return (
    <AppLayout>
      {/* Header - UNCHANGED */}
      <div>
        <p className="text-sm md:text-base text-brand-secondary dark:text-gray-400">Good evening,</p>
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-brand-primary dark:text-gray-100">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}
        </h1>
      </div>

      {/* Wallet Card - UNCHANGED */}
      <div className="mt-6 md:mt-8 lg:mt-10 bg-brand-primary text-white rounded-lg md:rounded-2xl p-5 md:p-8 lg:p-10 shadow-card">
        <div className="flex justify-between items-start gap-4">
          <div>
            <p className="text-xs md:text-sm uppercase opacity-80 tracking-wider">Wallet Balance</p>
            <p className="text-2xl md:text-4xl lg:text-5xl font-bold mt-1 md:mt-2">
              ₹{typeof wallet?.balance === 'number' ? wallet.balance.toFixed(2) : parseFloat(wallet?.balance || 0).toFixed(2)}
            </p>

            <div className="flex items-center gap-2 mt-2 md:mt-3 text-xs md:text-sm opacity-80">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              Secured & Encrypted
            </div>
          </div>

          <Link
            href={user ? "/wallet" : "#"}
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                router.visit('/login');
              }
            }}
            className="text-xs underline opacity-80 cursor-pointer"
          >
            Transaction History
          </Link>
        </div>
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
                onClick={() => !exp.is_booked && !exp.is_secured && router.visit(`/experience/${exp.id}`)}
                className="min-w-[240px] bg-white dark:bg-gray-800 rounded-lg shadow-card overflow-hidden hover:shadow-xl transition-shadow flex flex-col cursor-pointer"
              >
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
                        className="mt-2 w-full text-center text-sm py-2.5 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-all"
                      >
                        ⚡ Book Now
                      </button>
                    ) : (
                      // Both booking modes available
                      <div className="mt-2 flex flex-row gap-1.5">
                        <button
                          onClick={(e) => handleInstantBooking(e, exp)}
                          className="flex-1 text-center text-xs py-2 px-1 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-all whitespace-nowrap"
                        >
                          ⚡ Book
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
                onClick={() => !exp.is_booked && !exp.is_secured && router.visit(`/experience/${exp.id}`)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-card overflow-hidden hover:shadow-xl transition-shadow flex flex-col cursor-pointer"
              >
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
                        className="mt-2 w-full text-center text-sm py-2.5 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-all"
                      >
                        ⚡ Book Now
                      </button>
                    ) : (
                      // Both booking modes available
                      <div className="mt-2 flex flex-row gap-1.5">
                        <button
                          onClick={(e) => handleInstantBooking(e, exp)}
                          className="flex-1 text-center text-xs py-2 px-1 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-all whitespace-nowrap"
                        >
                          ⚡ Book
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

      {/* Expiring Soon */}
      <section className="mt-6 md:mt-8 lg:mt-10">
        <div className="flex justify-between items-center mb-4 md:mb-6 px-0">
          <h2 className="font-semibold text-lg md:text-2xl lg:text-3xl text-brand-primary dark:text-gray-100">
            Expiring Soon
          </h2>
          <Link href="/holds" className="text-xs md:text-sm text-brand-secondary dark:text-gray-400 hover:text-brand-primary transition-colors">
            View all
          </Link>
        </div>

        {/* Mobile/Tablet: Horizontal Scroll */}
        <div className="lg:hidden flex gap-6 overflow-x-auto pb-1 no-scrollbar">
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
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6">
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

      </section>

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
