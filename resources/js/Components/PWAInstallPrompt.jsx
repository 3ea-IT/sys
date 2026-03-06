import { useState } from "react";
import { Download, X, Smartphone, Star, ChevronLeft, ChevronRight } from "lucide-react";

const screenshots = [
  { src: "/assets/screenshots/Registration.jpg", label: "Sign Up" },
  { src: "/assets/screenshots/Home.jpg", label: "Home" },
  { src: "/assets/screenshots/Explore.jpg", label: "Explore" },
  { src: "/assets/screenshots/Your-Seats.jpg", label: "Your Seats" },
  { src: "/assets/screenshots/Hold.jpg", label: "Hold" },
  { src: "/assets/screenshots/Wallet.jpg", label: "Wallet" },
];

export default function PWAInstallPrompt({ deferredPrompt, onInstall, onDismiss }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showFloatingBanner, setShowFloatingBanner] = useState(!!deferredPrompt);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState(null);

  const handleInstallFlow = async () => {
    if (!deferredPrompt) {
      onDismiss();
      return;
    }

    setIsInstalling(true);

    try {
      // Trigger native browser prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setShowSuccess(true);
        localStorage.setItem("pwaInstalled", "true");
        setIsInstalling(false);

        // Let parent know install completed after success animation
        setTimeout(() => {
          onInstall();
        }, 2500);
      } else {
        setIsInstalling(false);
        onDismiss();
      }
    } catch (error) {
      console.error("Installation failed:", error);
      setIsInstalling(false);
      onDismiss();
    }
  };

  const handleBannerClick = () => {
    setShowFloatingBanner(false);
    setShowBottomSheet(true);
  };

  const handleDismissAll = () => {
    setShowFloatingBanner(false);
    setShowBottomSheet(false);
    onDismiss();
  };

  const handleScreenshotClick = (index) => {
    setSelectedScreenshotIndex(index);
  };

  const handleCloseFullscreen = () => {
    setSelectedScreenshotIndex(null);
  };

  const handlePreviousScreenshot = () => {
    setSelectedScreenshotIndex((prev) =>
      prev === 0 ? screenshots.length - 1 : prev - 1
    );
  };

  const handleNextScreenshot = () => {
    setSelectedScreenshotIndex((prev) =>
      prev === screenshots.length - 1 ? 0 : prev + 1
    );
  };

  // Success overlay (kept from your original component)
  if (showSuccess) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm shadow-2xl">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full">
              <Download size={32} className="text-green-600 dark:text-green-400" strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Successfully Installed!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Secure Seat is now installed on your device. You can access it from your home screen.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If no prompt available, render nothing
  if (!deferredPrompt) return null;
  return (
    <>
      {/* 1. SMALL FLOATING BANNER (like other project) */}
      {showFloatingBanner && (
        <div className="fixed bottom-4 left-4 right-4 z-[9990] md:left-auto md:bottom-6 md:right-6 md:w-80 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-3 border border-gray-100 flex items-center gap-3 relative overflow-hidden">
            
            {/* App Icon */}
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden">
              <img
                src="/icons/icon-128x128.jpg"
                alt="Secure Seat"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 pr-6">
              <h4 className="text-sm font-bold text-gray-900 leading-tight">
                Secure Seat
              </h4>
              <p className="text-[11px] text-gray-500 leading-tight mt-0.5 truncate">
                Install for instant seat access
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-md font-medium">
                  FREE
                </span>
                <span className="text-[10px] text-gray-400">
                  • Lightweight
                </span>
              </div>
            </div>

            {/* Install Button */}
            <button
              onClick={handleBannerClick}
              className="px-4 py-1.5 bg-brand-primary hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-md shadow-blue-500/20 active:scale-95 transition-all self-center"
            >
              Install
            </button>

            {/* Close */}
            <button
              onClick={handleDismissAll}
              className="absolute top-1 right-1 text-gray-300 hover:text-gray-500 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close install prompt"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. DETAILED BOTTOM SHEET (with screenshots, like other project) */}
      {showBottomSheet && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-[9998] backdrop-blur-sm animate-in fade-in duration-300"
            onClick={handleDismissAll}
          />

          {/* Sheet */}
          <div className="fixed bottom-0 left-0 w-full bg-white z-[9999] rounded-t-3xl shadow-2xl p-5 animate-in slide-in-from-bottom duration-500 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-primary flex items-center justify-center shadow-lg">
                  <img
                    src="/icons/icon-128x128.jpg"
                    alt="Secure Seat Icon"
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Secure Seat</h3>
                  <p className="text-xs text-gray-500 font-medium">Official App</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                    <span className="text-[10px] text-gray-400 ml-1">(5.0)</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleDismissAll}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              Install Secure Seat for the best experience. Hold seats instantly, manage your bookings, 
              and get notified about expiring holds and premium events in real-time.
            </p>

            {/* Screenshots */}
            <div className="flex gap-3 overflow-x-auto pb-4 mb-4 snap-x no-scrollbar">
              {screenshots.map((s, i) => (
                <div key={i} className="flex-none w-28 sm:w-32 snap-center cursor-pointer" onClick={() => handleScreenshotClick(i)}>
                  <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-[9/16] bg-gray-50 hover:shadow-md transition-shadow">
                    <img src={s.src} alt={s.label} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[10px] text-center mt-2 font-medium text-gray-500">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <button
              onClick={handleInstallFlow}
              disabled={isInstalling}
              className="w-full py-3.5 bg-brand-primary hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isInstalling ? (
                <>
                  <span className="animate-spin text-xs">⏳</span>
                  Installing...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Install App Now
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-gray-400 mt-3 flex items-center justify-center gap-1">
              <Smartphone className="w-3 h-3" />
              Lightweight • Secure • PWA
            </p>
          </div>
        </>
      )}

      {/* FULLSCREEN SCREENSHOT VIEWER */}
      {selectedScreenshotIndex !== null && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/95 z-[10000] animate-in fade-in duration-300"
            onClick={handleCloseFullscreen}
          />

          {/* Fullscreen Image Container */}
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
            <div className="relative w-full h-full max-w-2xl max-h-[90vh] flex flex-col">
              
              {/* Image */}
              <img
                src={screenshots[selectedScreenshotIndex].src}
                alt={screenshots[selectedScreenshotIndex].label}
                className="w-full h-full object-contain rounded-lg"
              />

              {/* Close Button */}
              <button
                onClick={handleCloseFullscreen}
                className="absolute -top-10 right-0 text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Label */}
              <p className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium mt-4">
                {screenshots[selectedScreenshotIndex].label}
              </p>

              {/* Previous Button */}
              <button
                onClick={handlePreviousScreenshot}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 p-3 rounded-full transition-colors -translate-x-16"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextScreenshot}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 p-3 rounded-full transition-colors translate-x-16"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Screenshot Counter */}
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                {selectedScreenshotIndex + 1} / {screenshots.length}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
