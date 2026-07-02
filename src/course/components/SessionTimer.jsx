import { useEffect, useState } from "react";

function format(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function SessionTimer({ expiresAtMs, onExpired }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, Number(expiresAtMs || 0) - Date.now()));

  useEffect(() => {
    const tick = () => {
      const next = Math.max(0, Number(expiresAtMs || 0) - Date.now());
      setRemaining(next);
      if (next <= 0) {
        onExpired?.();
      }
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAtMs, onExpired]);

  const low = remaining <= 5 * 60 * 1000;

  return (
    <div className={`rounded-full border px-4 py-2 font-mono text-lg font-semibold ${low ? "border-red-400/50 bg-red-500/15 text-red-100" : "border-white/10 bg-white/[0.04] text-white"}`}>
      {format(remaining)}
    </div>
  );
}
