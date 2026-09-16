// resources/js/Pages/Experiences/Show.jsx
import React from "react";
import DetailLayout from "@/Layouts/AppLayout";
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
  supportsHold = true,
  instant_booked_count: initialInstantBookedCount = 0
}) {
  const { auth } = usePage().props;
  const user = auth?.user;
  
  // State for real-time status updates
  const [isSecured, setIsSecured] = useState(initialIsSecured);
  const [holdId, setHoldId] = useState(initialHoldId);
  const [isBooked, setIsBooked] = useState(initialIsBooked);
  const [bookingId, setBookingId] = useState(initialBookingId);
  const [instantAvailability, setInstantAvailability] = useState(experience.instant_availability);
  const [instantBookedCount, setInstantBookedCount] = useState(initialInstantBookedCount);
  const [instantRemainingCount, setInstantRemainingCount] = useState(experience.instant_availability - initialInstantBookedCount);
  
  // State for party size selection modal
  const [showPartySizeModal, setShowPartySizeModal] = useState(false);
  const [bookingMode, setBookingMode] = useState(null); // 'instant' or 'hold'
  const [instantPartySize, setInstantPartySize] = useState(1);
  const [holdPartySize, setHoldPartySize] = useState(1);
  
  // Function to refresh booking/hold status using axios
  const refreshStatus = async () => {
    try {
      const response = await axios.get(`/experience/${experience.id}`);
      const { 
        isSecured: newIsSecured, 
        holdId: newHoldId, 
        isBooked: newIsBooked, 
        bookingId: newBookingId,
        instant_availability: newInstantAvailability,
        instant_booked_count: newInstantBookedCount,
        instant_remaining_count: newInstantRemainingCount
      } = response.data;
      setIsSecured(newIsSecured);
      setHoldId(newHoldId);
      setIsBooked(newIsBooked);
      setBookingId(newBookingId);
      if (newInstantAvailability !== undefined) {
        setInstantAvailability(newInstantAvailability);
      }
      if (newInstantBookedCount !== undefined) {
        setInstantBookedCount(newInstantBookedCount);
      }
      if (newInstantRemainingCount !== undefined) {
        setInstantRemainingCount(newInstantRemainingCount);
      }
    } catch (error) {
      console.error('Failed to refresh status:', error);
    }
  };
  
  // Periodic refresh of seat availability every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      refreshStatus();
    }, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval); // Cleanup on unmount
  }, [experience.id]);
  
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

    // Show party size selection modal
    setInstantPartySize(1); // Reset to default
    setBookingMode('instant');
    setShowPartySizeModal(true);
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

    // Show party size selection modal
    setHoldPartySize(1); // Reset to default
    setBookingMode('hold');
    setShowPartySizeModal(true);
  };

  // Handle party size confirmation from modal
  const handlePartyConfirmation = async () => {
    const partySize = bookingMode === 'instant' ? instantPartySize : holdPartySize;

    // Validate party size
    if (bookingMode === 'instant') {
      if (partySize < 1 || partySize > experience.instant_availability) {
        Swal.fire({
          title: '⚠️ Invalid Party Size',
          text: `Please select between 1 and ${experience.instant_availability} person(s).`,
          icon: 'warning',
          confirmButtonColor: '#0F2A44',
        });
        return;
      }
    } else if (bookingMode === 'hold') {
      if (partySize < 1 || partySize > 2) {
        Swal.fire({
          title: '⚠️ Invalid Party Size',
          text: 'You can hold for maximum 2 people.',
          icon: 'warning',
          confirmButtonColor: '#0F2A44',
        });
        return;
      }

      // Check wallet balance for hold
      const walletBalance = parseFloat(user?.wallet?.balance || 0);
      const holdTokenRequired = holdTokenValue * partySize;
      
      if (walletBalance < holdTokenRequired) {
        Swal.fire({
          title: '💰 Insufficient Balance',
          html: `You need <strong>₹${holdTokenRequired.toFixed(2)}</strong> to place a hold for ${partySize} person(s).<br><br>Your current balance: <strong>₹${walletBalance.toFixed(2)}</strong><br><br>Please add funds to your wallet.`,
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
        setShowPartySizeModal(false);
        return;
      }
    }

    // Close modal
    setShowPartySizeModal(false);

    // Proceed with payment
    try {
      let response;
      if (bookingMode === 'instant') {
        response = await axios.post('/api/payment/instant-booking-order', { 
          experience_id: experience.id,
          party_size: partySize,
        });
      } else {
        response = await axios.post('/api/payment/hold-token-order', { 
          experience_id: experience.id,
          party_size: partySize,
        });
      }

      if (response.data.success) {
        openRazorpayCheckout(response.data, bookingMode === 'instant' ? 'booking_instant' : 'hold_token', experience.id);
      } else {
        Swal.fire({
          title: '❌ Payment Failed',
          text: response.data.message || 'Failed to initiate payment',
          icon: 'error',
          confirmButtonColor: '#0F2A44',
        });
      }
    } catch (error) {
      Swal.fire({
        title: '❌ Payment Error',
        text: error.response?.data?.message || 'Failed to create payment order',
        icon: 'error',
        confirmButtonColor: '#0F2A44',
      });
    }
  };

  // Razorpay Checkout Helper - Script is now loaded from blade template
  const openRazorpayCheckout = (paymentData, referenceType, referenceId, retries = 0) => {
    if (!window.Razorpay) {
      // Retry up to 5 times with 200ms delay
      if (retries < 5) {
        setTimeout(() => {
          openRazorpayCheckout(paymentData, referenceType, referenceId, retries + 1);
        }, 200);
        return;
      }

      // If still not loaded, show detailed error
      console.error('Razorpay failed to load after retries');
      Swal.fire({
        title: '❌ Payment Gateway Error',
        html: `Razorpay checkout failed to load. This usually means:
        <ul style="text-align: left; margin: 10px 0;">
        <li><strong>Network Issue:</strong> Check your internet connection</li>
        <li><strong>Ad Blocker:</strong> Disable uBlock Origin, Adblock Plus, etc.</li>
        <li><strong>Firewall/Corporate Network:</strong> Some networks block CDN access</li>
        </ul>
        <strong>Solution:</strong> Try refreshing the page with ad blockers disabled.`,
        icon: 'error',
        confirmButtonColor: '#0F2A44',
      });
      return;
    }

    const options = {
      key: paymentData.key,
      amount: paymentData.amount * 100, // Amount in paise
      currency: paymentData.currency,
      name: 'Secure My Seat',
      description: referenceType === 'booking_instant' ? 'Instant Booking' : 'Hold Token',
      order_id: paymentData.order_id,
      handler: async (response) => {
        // Verify payment on backend
        Swal.fire({
          title: 'Verifying Payment...',
          didOpen: async () => {
            Swal.showLoading();
            try {
              const verifyResponse = await axios.post('/api/payment/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyResponse.data.success) {
                Swal.fire({
                  title: '✅ Payment Successful!',
                  text: verifyResponse.data.message,
                  icon: 'success',
                  confirmButtonColor: '#0F2A44',
                  timer: 1500,
                }).then(() => {
                  // Redirect to booking or hold
                  router.visit(verifyResponse.data.redirect);
                });
              } else {
                Swal.fire({
                  title: '❌ Payment Failed',
                  text: verifyResponse.data.message || 'Payment verification failed',
                  icon: 'error',
                  confirmButtonColor: '#0F2A44',
                });
              }
            } catch (error) {
              Swal.fire({
                title: '❌ Verification Error',
                text: error.response?.data?.message || 'Failed to verify payment',
                icon: 'error',
                confirmButtonColor: '#0F2A44',
              });
            }
          },
        });
      },
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || '',
      },
      theme: {
        color: '#0F2A44',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Determine primary price and booking type for display
  const primaryPrice = supportsInstant && instantAvailability > 0 
    ? instantPriceValue 
    : holdTokenValue;
  const isInstantPrimary = supportsInstant && instantAvailability > 0;
  const bookingModeText = experience.booking_mode === 'both' ? 'Instant or Hold' : 
                         experience.booking_mode === 'instant' ? 'Instant Only' : 'Hold Only';


  return (
    <DetailLayout>
      {/* Hero Image with Overlay */}
      <div className="relative h-56 sm:h-72 md:h-96 lg:h-[500px] overflow-hidden rounded-2xl">
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
        <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-6 md:right-6 z-10 text-white">
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-1 md:mb-2 drop-shadow-md line-clamp-2">
            {experience.title}
          </h1>
          <div className="space-y-0.5 md:space-y-1">
            <p className="text-xs sm:text-sm md:text-base opacity-90 flex items-center gap-1 line-clamp-1">
              📍 {experience.location}
            </p>
            {experience.start_date && (
              <p className="text-xs sm:text-sm md:text-base opacity-90 flex items-center gap-1 line-clamp-1">
                📅 {new Date(experience.start_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                {experience.end_date && ` - ${new Date(experience.end_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}`}
              </p>
            )}
            {experience.start_time && (
              <p className="text-xs sm:text-sm md:text-base opacity-90 flex items-center gap-1 line-clamp-1">
                🕐 {formatTime12Hour(experience.start_time)}
                {experience.end_time && ` to ${formatTime12Hour(experience.end_time)}`}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        {/* ENHANCED Key Info Cards WITH DUAL MODE */}
        <div className="mt-4 md:mt-8 lg:mt-10 grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
          <InfoCard
            icon="💎"
            label="Hold Token"
            value={`₹${holdTokenValue.toFixed(2)}`}
          />
          {supportsInstant && instantAvailability > 0 && (
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
          {supportsInstant && instantAvailability > 0 && (
            <InfoCard
              icon="🎫"
              label="Instant Seats"
              value={`${instantBookedCount}/${instantAvailability} Booked`}
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
          <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 md:mb-5">Description</h2>
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
              <p 
                className="text-sm md:text-base text-blue-800 dark:text-blue-200 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(isInstantPrimary 
                    ? `Complete your booking instantly for just <strong>₹${instantPriceValue.toFixed(0)}</strong>. No waiting required!`
                    : `Pay just <strong>₹${holdTokenValue.toFixed(2)}</strong> to temporarily secure your spot. Confirm within ${experience.hold_duration} minutes or it auto-releases.`
                  )
                }}
              />
            </div>
          </div>
          </div>
        )}


        {/* Highlights */}
        <section className="mb-8 md:mb-10 lg:mb-12">
          <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6">Highlights</h3>
          <div className="space-y-1">
            {highlightsList.map((highlight, index) => (
              <HighlightItem key={index} title={highlight} />
            ))}
          </div>
        </section>

        {/* Price & CTA - normal in-page card, not fixed (AppLayout already has its own fixed bottom nav) */}
        <div className="mb-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 md:p-5 shadow-sm">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {isInstantPrimary ? 'Instant Booking' : 'Holding Token'} • Per Person
                </p>
                <p className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100 mt-1">
                  ₹{primaryPrice.toFixed(isInstantPrimary ? 0 : 2)}
                </p>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {isInstantPrimary ? 'Instant Confirmation' : `${experience.hold_duration || 0} min hold`}
                </p>
              </div>


              {/* CONDITIONAL BOOKING BUTTONS - Simplified to open modal */}
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
                  disabled={instantAvailability <= 0}
                  className={`w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-sm md:text-base transition-all duration-200 ${
                    instantAvailability <= 0
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
                  }`}
                >
                  {instantAvailability <= 0 ? '❌ No Seats Available' : '⚡ Book Now'}
                </button>
              ) : (
                <div className="flex flex-row gap-2 w-full sm:w-auto flex-nowrap">
                  <button
                    onClick={handleInstantBooking}
                    disabled={instantAvailability <= 0}
                    className={`flex-1 px-4 py-3 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 whitespace-nowrap ${
                      instantAvailability <= 0
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
                    }`}
                  >
                    {instantAvailability <= 0 ? '❌ Sold Out' : '⚡ Book Instantly'}
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
                    Instant: any number of people | Hold: maximum 2 people
                  </>
                )}
              </div>
            )}
          </div>
        </div> 

        {/* Party Size Modal - Mobile Optimized */}
        {showPartySizeModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-2 sm:p-4">
            <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] sm:max-h-none overflow-y-auto">
              {/* Header - Compact */}
              <div className="bg-gradient-to-r from-brand-primary to-blue-600 px-4 sm:px-6 py-3 sm:py-4 text-white">
                <h2 className="text-lg sm:text-xl font-bold leading-tight">
                  {bookingMode === 'instant' ? '⚡ Instant Booking' : '🔒 Hold Booking'}
                </h2>
                <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
                  {bookingMode === 'instant' 
                    ? 'Book for any number of people' 
                    : 'Hold for up to 2 people'}
                </p>
              </div>

              {/* Content - Compact */}
              <div className="p-3 sm:p-5 space-y-3 sm:space-y-4">
                {/* Per Person Amount */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                  <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-semibold mb-1">Per Person Price</p>
                  <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                    ₹{(bookingMode === 'instant' ? instantPriceValue : holdTokenValue).toFixed(bookingMode === 'instant' ? 0 : 2)}
                  </p>
                </div>

                {/* Party Size Selector - Compact */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    How many people?
                  </label>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => {
                        if (bookingMode === 'instant') {
                          setInstantPartySize(Math.max(1, instantPartySize - 1));
                        } else {
                          setHoldPartySize(Math.max(1, holdPartySize - 1));
                        }
                      }}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-lg font-bold transition-colors flex items-center justify-center flex-shrink-0"
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min="1"
                      max={bookingMode === 'instant' ? instantAvailability : 2}
                      value={bookingMode === 'instant' ? instantPartySize : holdPartySize}
                      onChange={(e) => {
                        let val = parseInt(e.target.value) || 1;
                        if (bookingMode === 'instant') {
                          val = Math.max(1, Math.min(instantAvailability, val));
                          setInstantPartySize(val);
                        } else {
                          val = Math.max(1, Math.min(2, val));
                          setHoldPartySize(val);
                        }
                      }}
                      className="flex-1 px-3 py-2 sm:py-3 text-center text-xl sm:text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:border-brand-primary"
                    />

                    <button
                      onClick={() => {
                        if (bookingMode === 'instant') {
                          setInstantPartySize(Math.min(instantAvailability, instantPartySize + 1));
                        } else {
                          setHoldPartySize(Math.min(2, holdPartySize + 1));
                        }
                      }}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-lg font-bold transition-colors flex items-center justify-center flex-shrink-0"
                    >
                      +
                    </button>
                  </div>
                  {bookingMode === 'instant' && (
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 text-center">
                      {instantRemainingCount} of {instantAvailability} available • {instantBookedCount} booked
                    </p>
                  )}
                  {bookingMode === 'hold' && (
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 text-center">
                      Max 2 people per hold
                    </p>
                  )}
                </div>

                {/* Total Amount - Compact */}
                <div className="bg-gradient-to-r from-green-50 dark:from-green-900/30 to-emerald-50 dark:to-emerald-900/30 rounded-lg p-3 sm:p-4 border-2 border-green-200 dark:border-green-700">
                  <p className="text-[10px] sm:text-xs text-green-700 dark:text-green-300 uppercase tracking-wide font-semibold">Total Amount</p>
                  <div className="flex items-baseline gap-1 sm:gap-2 mt-1.5">
                    <p className="text-3xl sm:text-4xl font-black text-green-700 dark:text-green-300">
                      ₹{((bookingMode === 'instant' ? instantPriceValue : holdTokenValue) * (bookingMode === 'instant' ? instantPartySize : holdPartySize)).toFixed(2)}
                    </p>
                    <p className="text-[11px] sm:text-sm text-green-600 dark:text-green-400 leading-tight">
                      {(bookingMode === 'instant' ? instantPartySize : holdPartySize)}×₹{(bookingMode === 'instant' ? instantPriceValue : holdTokenValue).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Info Box - Compact */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2.5 sm:p-3 border border-blue-200 dark:border-blue-700">
                  <p className="text-[11px] sm:text-xs text-blue-800 dark:text-blue-300 leading-snug">
                    {bookingMode === 'instant'
                      ? '✓ Booking confirmed immediately after payment'
                      : `✓ Hold valid for ${experience.hold_duration || 30} minutes`
                    }
                  </p>
                </div>
              </div>

              {/* Footer Buttons - Compact */}
              <div className="bg-gray-50 dark:bg-gray-700/50 px-3 sm:px-6 py-3 flex gap-2 sm:gap-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowPartySizeModal(false)}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePartyConfirmation}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-bold text-xs sm:text-sm text-white bg-green-600 hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DetailLayout>
  );
}


function InfoCard({ icon: Icon, label, value, subtitle }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-1.5 py-2.5 md:p-4 text-center hover:shadow-md transition-shadow w-full flex flex-col items-center justify-center gap-0.5 overflow-hidden">
      <div className="flex items-center justify-center flex-shrink-0 mb-0.5 md:mb-1.5">
        {typeof Icon === 'string' ? (
          <span className="text-base md:text-lg">{Icon}</span>
        ) : (
          <Icon className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" />
        )}
      </div>
      <p className="text-[8px] md:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase leading-tight tracking-tight md:tracking-wide line-clamp-2">{label}</p>
      <p className="text-[11px] md:text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-1">{value}</p>
      {subtitle && (
        <p className="text-[8px] md:text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">{subtitle}</p>
      )}
    </div>
  );
}


function HighlightItem({ title }) {
  return (
    <div className="p-2 md:p-4 text-sm md:text-base text-gray-700 dark:text-gray-300 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: `• ${title}` }} />
  );
}