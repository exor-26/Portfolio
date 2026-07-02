import { apiFetch } from "./api";

export function createEventQueue({ flushEveryMs = 60000 } = {}) {
  let events = [];
  let timer = null;
  let sessionGetter = () => null;

  const flush = async () => {
    const session = sessionGetter();
    if (!session || events.length === 0) {
      return { ok: true, skipped: true };
    }

    const batch = events.slice(0, 50);
    events = events.slice(batch.length);
    return apiFetch("events", {
      body: {
        userId: session.userId,
        sessionId: session.sessionId,
        events: batch
      }
    });
  };

  return {
    setSessionGetter(getter) {
      sessionGetter = getter;
    },
    push(type, metadata = {}) {
      events.push({
        type,
        metadata,
        clientAt: new Date().toISOString()
      });
    },
    start() {
      if (!timer) {
        timer = window.setInterval(() => {
          flush().catch(() => {});
        }, flushEveryMs);
      }
    },
    stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    },
    flush
  };
}
