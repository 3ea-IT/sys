// resources/js/Pages/Experiences/Show.jsx
import DetailLayout from "@/Layouts/DetailLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { ArrowLeft, Clock, Shield } from "lucide-react";
import Swal from 'sweetalert2';
import axios from 'axios';
import { useState } from 'react';


// Utility function to convert 24-hour time to 12-hour AM/PM format
const formatTime12Hour = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Utility function to sanitize HTML (remove dangerous tags but keep formatting like <strong>, <em>, <u>)
const sanitizeHtml = (html) => {
  if (!html) return '';
  
  // Create a temporary div
  const div = document.createElement('div');
  div.innerHTML = html;
  
  // Define allowed tags
  const allowedTags = ['strong', 'b', 'em', 'i', 'u', 'li', 'ul', 'ol', 'p', 'br', 'span'];
  
  // Function to clean elements recursively
  const clean = (node) => {
    const nodesToRemove = [];
  
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      
      if (child.nodeType === 1) { // Element node
        if (!allowedTags.includes(child.tagName.toLowerCase())) {
          // Replace element with its content
          while (child.firstChild) {
            node.insertBefore(child.firstChild, child);
          }
          nodesToRemove.push(child);
        } else {
          clean(child); // Recursively clean children
        }
      }
    }
  
    nodesToRemove.forEach(node => node.remove());
  };
  
  clean(div);
  return div.innerHTML;
};


// Utility function to parse highlights from HTML and keep formatting
const parseHighlights = (html) => {
  if (!html) return [];
  
  const highlights = [];
  const div = document.createElement('div');
  div.innerHTML = html;
  
  // Try to find list items first
  const listItems = div.querySelectorAll('li');
  if (listItems.length > 0) {
    listItems.forEach(item => {
      const innerHTML = item.innerHTML.trim();
      if (innerHTML) highlights.push(innerHTML);
    });
    return highlights;
  }
  
  // Try to find paragraphs
  const paragraphs = div.querySelectorAll('p');
  if (paragraphs.length > 0) {
    paragraphs.forEach(item => {
      const innerHTML = item.innerHTML.trim();
      if (innerHTML) highlights.push(innerHTML);
    });
    return highlights;
  }
  
  // If no HTML structure, just get the inner HTML
  const plain = div.innerHTML.trim();
  return plain ? [plain] : [];
};


export default function Show({ 
  experience, 
  isSecured: initialIsSecured = false, 
  holdId: initialHoldId = null,
  isBooked: initialIsBooked = false,
  bookingId: initialBookingId = null,
  supportsInstant = false,
  supportsHold = true 
}) {
  const { auth } = usePage().props;
  const user = auth?.user;
  
  // State for real-time status updates
  const [isSecured, setIsSecured] = useState(initialIsSecured);
  const [holdId, setHoldId] = useState(initialHoldId);
  const [isBooked, setIsBooked] = useState(initialIsBooked);
  const [bookingId, setBookingId] = useState(initialBookingId);
  
  // Function to refresh booking/hold status using axios
  const refreshStatus = async () => {
    try {
      const response = await axios.get(`/experience/${experience.id}`);
      const { isSecured: newIsSecured, holdId: newHoldId, isBooked: newIsBooked, bookingId: newBookingId } = response.data;
      setIsSecured(newIsSecured);
      setHoldId(newHoldId);
      setIsBooked(newIsBooked);
      setBookingId(newBookingId);
    } catch (error) {
      console.error('Failed to refresh status:', error);
    }
  };
  
  // Convert prices to numbers
  const holdTokenValue = parseFloat(experience.hold_token) || 0;
  const instantPriceValue = parseFloat(experience.instant_price) || 0;
  
  // Parse description and highlights
  const description = sanitizeHtml(experience.description) || 
    `Immerse yourself in a curated ${experience.category?.toLowerCase()} experience designed for those who seek exclusivity and refinement.`;
  
  const highlightsList = parseHighlights(experience.highlights) || [
    '<strong>VIP Priority Entry</strong>',
    '<strong>Limited Capacity</strong>',
    '<strong>Secure Timed Access</strong>',
    '<strong>Premium Amenities</strong>'
  ];


  // DUAL MODE ACTION HANDLER
  const handleBookingAction = () => {
    if (!user) {
      router.visit('/login');
      return;
    }


    if (isBooked) {
      router.visit(`/bookings/${bookingId}`);
    } else if (isSecured) {
      router.visit(`/holds/${holdId}`);
    } else if (supportsInstant && experience.instant_availability > 0) {
      axios.post('/bookings/instant', { experience_id: experience.id })
        .then((response) => {
          if (response.data.success) {
            setIsBooked(response.data.isBooked);
            setBookingId(response.data.bookingId);
            
            Swal.fire({
              title: '✅ Booking Confirmed!',
              text: 'Your instant booking has been confirmed.',
              icon: 'success',
              confirmButtonColor: '#0F2A44',
              timer: 1500,
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            title: '❌ Booking Failed',
            text: error.response?.data?.message || 'Failed to create booking',
            icon: 'error',
            confirmButtonColor: '#0F2A44',
          });
        });
    } else if (supportsHold) {
      const walletBalance = parseFloat(user?.wallet?.balance || 0);
      const holdTokenRequired = holdTokenValue;
      
      if (walletBalance < holdTokenRequired) {
        Swal.fire({
          title: '💰 Insufficient Balance',
          html: `You need <strong>₹${holdTokenRequired.toFixed(2)}</strong> to place a hold.<br><br>Your balance: <strong>₹${walletBalance.toFixed(2)}</strong>`,
          icon: 'warning',
          confirmButtonColor: '#0F2A44',
          confirmButtonText: 'Add Funds',
          showCancelButton: true,
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            router.visit('/wallet');
          }
        });
        return;
      }
      
      axios.post("/holds", { experience_id: experience.id })
        .then((response) => {
          if (response.data.success) {
            setIsSecured(response.data.isSecured);
            setHoldId(response.data.holdId);
            
            Swal.fire({
              title: '✅ Hold Created!',
              text: `You have ${experience.hold_duration || 30} minutes to confirm.`,
              icon: 'success',
              confirmButtonColor: '#0F2A44',
              timer: 1500,
            }).then(() => {
              // Redirect to active hold page so user sees the timer immediately
              // and Dashboard/Explore show fresh data on next visit
              router.visit(`/holds/${response.data.holdId}`);
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            title: '❌ Hold Failed',
            text: error.response?.data?.message || 'Failed to create hold',
            icon: 'error',
            confirmButtonColor: '#0F2A44',
          });
        });
    } else {
      alert('No booking slots available');
    }
  };


  const handleInstantBooking = () => {
    if (!user) {
      router.visit('/login');
      return;
    }
    
    if (isBooked) {
      Swal.fire({
        title: '✅ Already Booked',
        text: 'You have already booked this experience. View your booking details.',
        icon: 'info',
        confirmButtonColor: '#0F2A44',
        confirmButtonText: 'View Booking',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          router.visit(`/bookings/${bookingId}`);
        }
      });
      return;
    }
    
    if (isSecured) {
      Swal.fire({
        title: '⏱️ Already On Hold',
        text: 'You already have a hold on this experience. Manage your hold or release it to book another.',
        icon: 'warning',
        confirmButtonColor: '#0F2A44',
        confirmButtonText: 'Manage Hold',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          router.visit(`/holds/${holdId}`);
        }
      });
      return;
    }
    
    axios.post('/bookings/instant', { experience_id: experience.id })
      .then((response) => {
        if (response.data.success) {
          setIsBooked(response.data.isBooked);
          setBookingId(response.data.bookingId);
          
          Swal.fire({
            title: '✅ Booking Confirmed!',
            text: 'Your instant booking has been confirmed.',
            icon: 'success',
            confirmButtonColor: '#0F2A44',
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          title: '❌ Booking Failed',
          text: error.response?.data?.message || 'Failed to create booking',
          icon: 'error',
          confirmButtonColor: '#0F2A44',
        });
      });
  };


  const handleHoldBooking = () => {
    if (!user) {
      router.visit('/login');
      return;
    }
    
    if (isBooked) {
      Swal.fire({
        title: '✅ Already Booked',
        text: 'You have already booked this experience. View your booking details.',
        icon: 'info',
        confirmButtonColor: '#0F2A44',
        confirmButtonText: 'View Booking',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          router.visit(`/bookings/${bookingId}`);
        }
      });
      return;
    }
    
    if (isSecured) {
      Swal.fire({
        title: '⏱️ Already On Hold',
        text: 'You already have a hold on this experience. Manage your hold or release it to book another.',
        icon: 'warning',
        confirmButtonColor: '#0F2A44',
        confirmButtonText: 'Manage Hold',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          router.visit(`/holds/${holdId}`);
        }
      });
      return;
    }
    
    const walletBalance = parseFloat(user?.wallet?.balance || 0);
    const holdTokenRequired = holdTokenValue;
    
    if (walletBalance < holdTokenRequired) {
      Swal.fire({
        title: '💰 Insufficient Balance',
        html: `You need <strong>₹${holdTokenRequired.toFixed(2)}</strong> to place a hold on this experience.<br><br>Your current balance: <strong>₹${walletBalance.toFixed(2)}</strong><br><br>Please add funds to your wallet.`,
        icon: 'warning',
        confirmButtonColor: '#0F2A44',
        confirmButtonText: 'Add Funds',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          router.visit('/wallet');
        }
      });
      return;
    }
    
    axios.post('/holds', { experience_id: experience.id })
      .then((response) => {
        if (response.data.success) {
          setIsSecured(response.data.isSecured);
          setHoldId(response.data.holdId);
          
          Swal.fire({
            title: '✅ Hold Created!',
            text: `You have ${experience.hold_duration || 30} minutes to confirm your booking.`,
            icon: 'success',
            confirmButtonColor: '#0F2A44',
            timer: 1500,
          }).then(() => {
            // Redirect to active hold page so user sees the timer immediately
            // and Dashboard/Explore show fresh data on next visit
            router.visit(`/holds/${response.data.holdId}`);
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          title: '❌ Hold Failed',
          text: error.response?.data?.message || 'Failed to create hold',
          icon: 'error',
          confirmButtonColor: '#0F2A44',
        });
      });
  };


  // Determine primary price and booking type for display
  const primaryPrice = supportsInstant && experience.instant_availability > 0 
    ? instantPriceValue 
    : holdTokenValue;
  const isInstantPrimary = supportsInstant && experience.instant_availability > 0;
  const bookingModeText = experience.booking_mode === 'both' ? 'Instant or Hold' : 
                         experience.booking_mode === 'instant' ? 'Instant Only' : 'Hold Only';


  return (
    <DetailLayout>
      {/* Hero Image with Overlay */}
      <div className="relative h-80 md:h-96 lg:h-[500px] overflow-hidden md:rounded-2xl">
        {/* Experience Image — fixed path handling */}
        {experience.image ? (
          <img
            src={experience.image.startsWith('/') ? experience.image : `/assets/experiences/${experience.image}`}
            alt={experience.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
            <span className="text-white text-sm md:text-base font-medium">No Image</span>
          </div>
        )}
        {/* Fallback div shown by onError */}
        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 items-center justify-center hidden">
          <span className="text-white text-sm md:text-base font-medium">No Image</span>
        </div>
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />


        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 md:top-6 left-4 md:left-6 z-10 bg-white/95 backdrop-blur-sm w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
        </button>


        {/* Priority Badge */}
        {(experience.priority_score || 0) > 80 && (
          <div className="absolute top-4 md:top-6 right-4 md:right-6 z-10 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs md:text-sm font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg">
            PRIORITY ACCESS
          </div>
        )}


        {/* Title & Location */}
        <div className="absolute bottom-6 left-4 right-4 md:bottom-8 md:left-6 md:right-6 z-10 text-white">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-1 md:mb-2 drop-shadow-md">
            {experience.title}
          </h1>
          <div className="space-y-1">
            <p className="text-sm md:text-base opacity-90 flex items-center gap-1">
              📍 {experience.location}
            </p>
            {experience.start_date && (
              <p className="text-sm md:text-base opacity-90 flex items-center gap-1">
                📅 {new Date(experience.start_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            )}
            {experience.start_time && (
              <p className="text-sm md:text-base opacity-90 flex items-center gap-1">
                🕐 {formatTime12Hour(experience.start_time)}
              </p>
            )}
          </div>
        </div>
      </div>


      <div className="mx-3 md:mx-6 lg:mx-8">
        {/* ENHANCED Key Info Cards WITH DUAL MODE */}
        <div className="mt-6 md:mt-8 lg:mt-10 grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
          <InfoCard
            icon="💎"
            label="Hold Token"
            value={`₹${holdTokenValue.toFixed(2)}`}
          />
          {supportsInstant && experience.instant_availability > 0 && (
            <InfoCard
              icon="⚡"
              label="Instant Price"
              value={`₹${instantPriceValue.toFixed(0)}`}
            />
          )}
          <InfoCard
            icon={Clock}
            label="Hold Duration"
            value={`${experience.hold_duration || 0} min`}
          />
          <InfoCard
            icon={Shield}
            label="Capacity"
            value={`${experience.capacity || 0} seats`}
          />
          {experience.instant_availability > 0 && (
            <InfoCard
              icon="🎫"
              label="Instant Seats"
              value={experience.instant_availability}
            />
          )}
          <InfoCard
            icon="🏷️"
            label="Mode"
            value={bookingModeText}
          />
        </div>


        {/* About Section */}
        <section className="mb-8 md:mb-10 lg:mb-12">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6">Description</h2>
          <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
        </section>


        {/* Already Booked Notice */}
        {isBooked && (
          <div className="mb-8 md:mb-10 lg:mb-12 bg-gradient-to-r from-green-50 dark:from-green-900/20 to-emerald-50 dark:to-emerald-900/20 border-l-2 border-green-800 dark:border-green-600 p-5 md:p-6 lg:p-8 shadow-sm rounded-r-lg">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xl md:text-2xl">✅</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 dark:text-green-300 text-base md:text-lg mb-1">
                  Your Booking is Confirmed!
                </h3>
                <p className="text-sm md:text-base text-green-800 dark:text-green-200 leading-relaxed">
                  You have already confirmed your booking for this experience. Click "View Booking" to check your booking details, or <Link href="/bookings" className="font-bold underline hover:no-underline">view all your bookings</Link>.
                </p>
              </div>
            </div>
          </div>
        )}


        {/* Temporary Hold Notice WITH DUAL MODE INFO */}
        {!isBooked && (
          <div className="mb-8 md:mb-10 lg:mb-12 bg-gradient-to-r from-blue-50 dark:from-blue-900/20 to-indigo-50 dark:to-indigo-900/20 border-l-2 border-blue-800 dark:border-blue-600 p-5 md:p-6 lg:p-8 shadow-sm rounded-r-lg">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xl md:text-2xl">⏱</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 text-base md:text-lg mb-1">
                  {isInstantPrimary ? 'Lightning Fast Booking' : 'Temporary Access Hold'}
                </h3>
              <p className="text-sm md:text-base text-blue-800 dark:text-blue-200 leading-relaxed">
                {isInstantPrimary 
                  ? `Complete your booking instantly for just <strong>₹${instantPriceValue.toFixed(0)}</strong>. No waiting required!`
                  : `Pay just <strong>₹${holdTokenValue.toFixed(2)}</strong> to temporarily secure your spot. Confirm within ${experience.hold_duration} minutes or it auto-releases.`
                }
              </p>
            </div>
          </div>
          </div>
        )}


        {/* Highlights */}
        <section className="mb-8 md:mb-10 lg:mb-12 pb-32">
          <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6">Highlights</h3>
          <div className="space-y-1">
            {highlightsList.map((highlight, index) => (
              <HighlightItem key={index} title={highlight} />
            ))}
          </div>
        </section>


        {/* ENHANCED Price & CTA Footer WITH DUAL MODE */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 md:p-5 shadow-2xl">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {isInstantPrimary ? 'Instant Booking' : 'Holding Token'}
                </p>
                <p className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100 mt-1">
                  ₹{primaryPrice.toFixed(isInstantPrimary ? 0 : 2)}
                </p>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {isInstantPrimary ? 'Instant Confirmation' : `${experience.hold_duration || 0} min hold`}
                </p>
              </div>


              {/* CONDITIONAL BOOKING BUTTONS - Based on status and booking_mode */}
              {isBooked ? (
                <button
                  onClick={() => router.visit(`/bookings/${bookingId}`)}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-sm md:text-base transition-all duration-200 bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
                >
                  ✅ View Booking
                </button>
              ) : isSecured ? (
                <button
                  onClick={() => router.visit(`/holds/${holdId}`)}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-sm md:text-base transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                >
                  ✅ View Hold
                </button>
              ) : experience.booking_mode === 'instant' ? (
                <button
                  onClick={handleInstantBooking}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-sm md:text-base transition-all duration-200 bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
                >
                  ⚡ Book Now
                </button>
              ) : (
                <div className="flex flex-row gap-2 w-full sm:w-auto flex-nowrap">
                  <button
                    onClick={handleInstantBooking}
                    className="flex-1 px-4 py-3 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 bg-green-600 text-white hover:bg-green-700 hover:shadow-lg whitespace-nowrap"
                  >
                    ⚡ Book Instantly
                  </button>
                  <button
                    onClick={handleHoldBooking}
                    className="flex-1 px-4 py-3 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 bg-brand-primary text-white hover:bg-brand-primary/90 hover:shadow-lg whitespace-nowrap"
                  >
                    🔒 Hold {experience.hold_duration || 0}m
                  </button>
                </div>
              )}
            </div>


            {/* Booking Mode Info */}
            {!isSecured && !isBooked && (
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center">
                {experience.booking_mode === 'both' && (
                  <>
                    Instant available ({experience.instant_availability} seats) | 
                    Hold option also available
                  </>
                )}
              </div>
            )}
          </div>
        </div> 
      </div>
    </DetailLayout>
  );
}


function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 md:p-4 text-center hover:shadow-md transition-shadow w-full aspect-square flex flex-col items-center justify-center overflow-hidden">
      <div className="w-10 h-10 mx-auto mb-1 md:mb-2 flex items-center justify-center flex-shrink-0">
        {typeof Icon === 'string' ? (
          <span className="text-lg">{Icon}</span>
        ) : (
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        )}
      </div>
      <p className="text-[9px] md:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tight md:tracking-wide mb-0.5 md:mb-1 line-clamp-1">{label}</p>
      <p className="text-[10px] md:text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{value}</p>
    </div>
  );
}


function HighlightItem({ title }) {
  return (
    <div className="p-2 md:p-4 text-sm md:text-base text-gray-700 dark:text-gray-300 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: `• ${title}` }} />
  );
}