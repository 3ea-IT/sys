export default function AppLoader() {
  return (
    <>
      <style>{`
        .loader-root *, .loader-root *::before, .loader-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .loader-root { position: fixed; inset: 0; z-index: 9999; font-family: Inter, system-ui, sans-serif; }
        .loader { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; background: radial-gradient(circle at 50% 38%, #ffffff 0%, #f8fbfd 48%, #edf3f7 100%); color: #0f2a44; user-select: none; pointer-events: none; }
        .loader::before { content: ""; position: absolute; width: 42vmin; height: 42vmin; border-radius: 50%; background: rgba(78, 174, 220, .08); filter: blur(34px); }
        .loader-stage { position: relative; display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .loader-orbit { position: relative; width: 68px; height: 68px; border: 1px solid rgba(15, 42, 68, .18); border-radius: 50%; box-shadow: 0 0 0 4px rgba(50, 164, 229, .035), inset 0 0 9px rgba(50, 164, 229, .08), 0 4px 12px rgba(40, 109, 145, .14); }
        .loader-orbit::before, .loader-orbit::after { content: ""; position: absolute; inset: 7px; border: 1px dashed rgba(49, 107, 162, 0.14); border-radius: 50%; }
        .loader-orbit::after { inset: 19px; border-style: solid; border-color: rgba(39, 122, 200, 0.1); }
        .loader-ring { --loader-radius: 27px; position: absolute; inset: 7px; animation: loader-spin .8s linear infinite; will-change: transform; }
        .loader-segment { position: absolute; top: 50%; left: 50%; width: 3px; height: 8px; margin: calc(var(--loader-radius) * -1) 0 0 -1.5px; border-radius: 5px; background: #d9e4ea; transform-origin: 1.5px var(--loader-radius); }
        .loader-segment:nth-child(-n+16) { background: linear-gradient(#0f2a44, #065f82); box-shadow: 0 0 8px rgba(7, 30, 40, 0.55); }
        .loader-segment:nth-child(n+17):nth-child(-n+24) { background: #0b4d65; box-shadow: 0 0 4px rgba(27, 71, 93, 0.3); }
        .loader-core { position: absolute; inset: 21px; display: grid; place-items: center; border: 1px solid rgba(122, 146, 169, 0.18); border-radius: 50%; background: radial-gradient(circle, rgba(73, 186, 241, .16), rgba(255, 255, 255, .9) 68%); box-shadow: 0 0 8px rgba(44, 175, 235, .18); }
        .loader-seat { position: relative; width: 14px; height: 16px; border: 2px solid #102538; border-radius: 4px 4px 2px 2px; box-shadow: 0 0 5px rgba(66, 182, 232, .45); }
        .loader-seat::before { content: ""; position: absolute; left: -5px; right: -5px; bottom: -6px; height: 6px; border: 2px solid #3881c6; border-top: 0; border-radius: 0 0 4px 4px; }
        .loader-seat::after { content: ""; position: absolute; left: 3px; right: 3px; bottom: -12px; height: 6px; border-left: 2px solid #1f5384; border-right: 2px solid #0f2a44; }
        .loader-copy { text-align: center; }
        .loader-title { font-size: 11px; font-weight: 700; letter-spacing: .24em; text-transform: uppercase; color: #174673; }
        .loader-status { margin-top: 6px; color: #6b7d8b; font-size: 12px; letter-spacing: .04em; }
        .loader-line { position: absolute; left: -20vw; right: -20vw; top: 65%; height: 1px; background: linear-gradient(90deg, transparent, rgba(63, 181, 255, .3), #8ddcff, rgba(63, 181, 255, .3), transparent); box-shadow: 0 0 18px 3px rgba(46, 158, 255, .2); }
        @keyframes loader-spin { to { transform: rotate(360deg); } }
        @media (max-width: 480px) { .loader-orbit { width: 60px; height: 60px; } .loader-ring { --loader-radius: 24px; inset: 6px; } .loader-segment { height: 7px; } .loader-core { inset: 18px; } .loader-title { font-size: 10px; } .loader-status { font-size: 11px; } }
      `}</style>
      <div className="loader-root">
        <div className="loader">
          <div className="loader-line" />
          <div className="loader-stage">
            <div className="loader-orbit" role="status" aria-label="Loading">
              <div className="loader-ring">
                {Array.from({ length: 24 }, (_, index) => (
                  <span key={index} className="loader-segment" style={{ transform: `rotate(${index * 15}deg)` }} />
                ))}
              </div>
              <div className="loader-core"><span className="loader-seat" /></div>
            </div>
            <div className="loader-copy">
              <p className="loader-title">Secure My Seat</p>
              <p className="loader-status">Preparing your experience...</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}