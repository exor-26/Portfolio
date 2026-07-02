import { apiFetch } from "./api";

export function startHeartbeat({ session, onSync, onBlurChange, onSessionEnd, queue, intervalMs = 120000 }) {
  let stopped = false;
  let timer = null;

  const ping = async () => {
    if (stopped || !session?.sessionId) {
      return;
    }
    try {
      const data = await apiFetch("heartbeat", {
        body: {
          userId: session.userId,
          sessionId: session.sessionId
        }
      });
      if (!data.active) {
        onSessionEnd?.(data.reason || "session_ended");
        return;
      }
      onBlurChange?.(false);
      onSync?.(data);
    } catch {
      onBlurChange?.(true);
      queue?.push("heartbeat_failed");
    }
  };

  const offline = () => {
    onBlurChange?.(true);
    queue?.push("offline");
  };

  const online = () => {
    ping();
  };

  window.addEventListener("offline", offline);
  window.addEventListener("online", online);
  timer = window.setInterval(ping, intervalMs);
  ping();

  return () => {
    stopped = true;
    window.removeEventListener("offline", offline);
    window.removeEventListener("online", online);
    if (timer) {
      window.clearInterval(timer);
    }
  };
}
