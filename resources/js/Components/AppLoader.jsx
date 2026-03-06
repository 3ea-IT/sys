// resources/js/Components/AppLoader.jsx
import { useEffect, useState } from "react";

const STEPS = [
  { label: "Finding seats…",      sub: "Scanning premium availability" },
  { label: "Securing hold…",      sub: "Bank-level encryption active" },
  { label: "Reserving your row…", sub: "Locking in your selection" },
  { label: "Almost confirmed…",   sub: "Your seat is being guaranteed" },
  { label: "You're all set!",     sub: "Secure First, Decide Later" },
];

const TOTAL = 4;

function Seat({ filled }) {
  return (
    <div className={`seat-wrap${filled ? " filled" : ""}`}>
      <svg
        viewBox="0 0 32 36"
        width="36"
        height="40"
        className="seat-svg"
        fill={filled ? "#0F2A44" : "none"}
      >
        {/* Head */}
        <circle
          cx="16"
          cy="5"
          r="3.5"
          fill={filled ? "#0F2A44" : "none"}
          stroke={filled ? "none" : "#0F2A44"}
          strokeWidth={filled ? 0 : 1.8}
        />
        {/* Backrest */}
        <rect
          x="9"
          y="10"
          width="14"
          height="12"
          rx="2"
          fill={filled ? "#0F2A44" : "none"}
          stroke={filled ? "none" : "#0F2A44"}
          strokeWidth={filled ? 0 : 1.8}
        />
        {/* Seat base */}
        <rect
          x="7"
          y="22"
          width="18"
          height="5"
          rx="2"
          fill={filled ? "#0F2A44" : "none"}
          stroke={filled ? "none" : "#0F2A44"}
          strokeWidth={filled ? 0 : 1.8}
        />
        {/* Legs */}
        <path
          d="M11 27v5M21 27v5"
          stroke="#0F2A44"
          strokeWidth={filled ? 2.2 : 1.8}
          strokeLinecap="round"
        />
      </svg>
      <div
        className="seat-dot"
        style={{ transform: filled ? "scale(1)" : "scale(0)" }}
      />
    </div>
  );
}

export default function AppLoader() {
  const [filledCount, setFilledCount] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  // Sync stepIndex with filledCount immediately
  useEffect(() => {
    setStepIndex(Math.min(filledCount, STEPS.length - 1));
  }, [filledCount]);

  useEffect(() => {
    let timeouts = [];

    const run = () => {
      // Reset if finished
      if (filledCount >= TOTAL) {
        const resetTimeout = setTimeout(() => {
          setFilledCount(0);
        }, 900);
        timeouts.push(resetTimeout);
        return;
      }

      // Fill next seat
      const seatTimeout = setTimeout(() => {
        setFilledCount((prev) => prev + 1);
      }, 0);
      timeouts.push(seatTimeout);

      // Schedule next step
      const nextTimeout = setTimeout(run, 700);
      timeouts.push(nextTimeout);
    };

    const firstTimeout = setTimeout(run, 600);
    timeouts.push(firstTimeout);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [filledCount]);

  const progressPercent = ((filledCount > TOTAL ? TOTAL : filledCount) / TOTAL) * 100;

  return (
    <>
      <style>{`
        .loader-root *,
        .loader-root *::before,
        .loader-root *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        .loader-root {
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .loader {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #F7F9FC;
          user-select: none;
          pointer-events: none;
          z-index: 9999;
        }
        .wordmark {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-bottom: 52px;
        }
        .wordmark-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: #0F2A44;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(15,42,68,0.22);
        }
        .wordmark-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          color: #0F2A44;
        }
        .seats-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 40px;
          height: 60px;
        }
        .seat-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 0.4;
          transform: scale(0.85);
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .seat-wrap.filled {
          opacity: 1;
          transform: scale(1);
        }
        .seat-svg {
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          filter: drop-shadow(0 2px 6px rgba(15, 42, 68, 0.15));
        }
        .seat-wrap.filled .seat-svg {
          filter: drop-shadow(0 4px 12px rgba(15, 42, 68, 0.25));
        }
        .status-text {
          text-align: center;
          min-height: 44px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }
        .status-label {
          font-size: 17px;
          font-weight: 800;
          color: #0F2A44;
          letter-spacing: -0.3px;
        }
        .status-sub {
          font-size: 13px;
          color: #5F6C7B;
          line-height: 1.5;
          min-height: 19px;
        }
        .bottom {
          position: absolute;
          bottom: 44px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .tagline {
          font-size: 11px;
          font-weight: 600;
          color: #9CA8B4;
          letter-spacing: 0.04em;
        }
        .progress-track {
          width: 48px;
          height: 2px;
          border-radius: 99px;
          background: #E3E8EF;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 99px;
          background: #0F2A44;
          width: 0%;
          transition: width 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <div className="loader-root">
        <div className="loader">
          {/* Wordmark */}
          {/* <div className="wordmark">
            <div className="wordmark-icon">
              <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
                <circle cx="16" cy="7" r="3" stroke="white" strokeWidth="1.8" />
                <path d="M12 13v8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M9 21h14" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M11 21v5M21 21v5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M12 16h7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <span className="wordmark-label">Secure Seat</span>
          </div> */}

          {/* Seats */}
          <div className="seats-row">
            {Array.from({ length: TOTAL }).map((_, idx) => (
              <Seat key={idx} filled={idx < filledCount} />
            ))}
          </div>

          {/* Status text */}
          <div className="status-text">
            <p className="status-label">
              {STEPS[stepIndex]?.label}
            </p>
            <p className="status-sub">
              {STEPS[stepIndex]?.sub}
            </p>
          </div>

          {/* Bottom */}
          <div className="bottom">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="tagline">Secure First, Decide Later</p>
          </div>
        </div>
      </div>
    </>
  );
}
