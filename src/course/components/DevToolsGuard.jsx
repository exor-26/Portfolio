import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch } from "../lib/api";

const SHORTCUTS = new Set(["F12"]);

function looksOpen() {
  const widthGap = Math.abs(window.outerWidth - window.innerWidth);
  const heightGap = Math.abs(window.outerHeight - window.innerHeight);
  return widthGap > 220 || heightGap > 260;
}

export default function DevToolsGuard({ session, queue, onForceEnd }) {
  const [countdown, setCountdown] = useState(null);
  const [warningText, setWarningText] = useState("");
  const reportingRef = useRef(false);
  const lastReportRef = useRef(0);

  const forceEnd = useCallback((reason = "devtools_violation") => {
    onForceEnd?.(reason);
  }, [onForceEnd]);

  const report = useCallback(async (source) => {
    if (!session || reportingRef.current) {
      return;
    }
    const now = Date.now();
    if (now - lastReportRef.current < 6000) {
      return;
    }
    reportingRef.current = true;
    lastReportRef.current = now;
    queue?.push("devtools_detected", { source });

    try {
      const data = await apiFetch("report-devtools", {
        body: {
          userId: session.userId,
          sessionId: session.sessionId,
          source
        }
      });
      if (data.forceLogout || !data.active) {
        forceEnd("devtools_violation");
        return;
      }
      if (data.showCountdown) {
        setWarningText(`Developer tools detected. Close them now. Warnings remaining: ${data.warningsRemaining}`);
        setCountdown(5);
      }
    } finally {
      reportingRef.current = false;
    }
  }, [forceEnd, queue, session]);

  useEffect(() => {
    if (!session) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      if (looksOpen()) {
        report("window_dimension");
      }
    }, 2500);

    const onKeyDown = (event) => {
      const key = event.key.toUpperCase();
      const modifierPressed = event.ctrlKey || event.metaKey;
      const devCombo =
        SHORTCUTS.has(event.key) ||
        (modifierPressed && event.shiftKey && ["I", "J", "C", "K", "S"].includes(key)) ||
        (modifierPressed && key === "U");
      if (devCombo) {
        event.preventDefault();
        event.stopPropagation();
        report("blocked_shortcut");
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [report, session]);

  useEffect(() => {
    if (countdown === null) {
      return undefined;
    }
    if (countdown <= 0) {
      forceEnd("devtools_violation");
      return undefined;
    }
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown, forceEnd]);

  if (countdown === null) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 px-5 text-center backdrop-blur-md">
      <div className="max-w-lg rounded-2xl border border-red-400/40 bg-[#160c0c] p-8 text-white shadow-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-red-300">Security warning</p>
        <h2 className="mt-4 text-3xl font-bold">{countdown}</h2>
        <p className="mt-4 leading-7 text-white/75">{warningText}</p>
        <button
          type="button"
          className="mt-6 rounded-full bg-white px-5 py-3 font-semibold text-black"
          onClick={() => {
            if (!looksOpen()) {
              setCountdown(null);
              setWarningText("");
            }
          }}
        >
          I closed it
        </button>
      </div>
    </div>
  );
}
