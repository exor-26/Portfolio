const { logEvent } = require("./lib/events-log");
const { db } = require("./lib/firebase");
const { handler, json, parseJsonBody, requireMethod } = require("./lib/http");
const { pickCurrentModule } = require("./lib/session");
const { validateFromRequest } = require("./lib/request-session");

exports.handler = handler(async (event) => {
  const method = requireMethod(event, "POST");
  if (method) return method;

  const body = parseJsonBody(event);
  const result = await validateFromRequest(event, body);
  if (!result.ok) {
    return json(401, { ok: false, reason: result.reason });
  }

  const fallback = await pickCurrentModule(result.user.unlockedSlot || 1);
  const requestedModuleId = body.moduleId || result.session.currentModuleId;
  let moduleId = requestedModuleId || fallback?.moduleId;
  if (!moduleId) {
    return json(404, { ok: false, reason: "module_not_found" });
  }

  let moduleRef = db().collection("modules").doc(moduleId);
  let moduleSnap = await moduleRef.get();
  if ((!moduleSnap.exists || moduleSnap.data().active === false) && fallback?.moduleId && fallback.moduleId !== moduleId) {
    moduleId = fallback.moduleId;
    moduleRef = db().collection("modules").doc(moduleId);
    moduleSnap = await moduleRef.get();
  }
  if (!moduleSnap.exists || moduleSnap.data().active === false) {
    return json(404, { ok: false, reason: "module_not_found" });
  }

  const module = moduleSnap.data();
  if (Number(module.slot || 1) > Number(result.user.unlockedSlot || 1)) {
    await logEvent({
      userId: result.session.userId,
      sessionId: result.sessionRef.id,
      type: "locked_module_attempt",
      metadata: { moduleId, slot: module.slot, unlockedSlot: result.user.unlockedSlot || 1 }
    });
    return json(403, { ok: false, reason: "module_locked" });
  }

  const chunkSnapshot = await moduleRef.collection("chunks").orderBy("index", "asc").get();
  const rawJsx = chunkSnapshot.docs.map((doc) => doc.data().jsx || "").join("");
  if (!rawJsx.trim()) {
    return json(404, { ok: false, reason: "module_content_missing" });
  }

  return json(200, {
    ok: true,
    module: {
      moduleId,
      title: module.title,
      slot: module.slot,
      order: module.order
    },
    jsx: rawJsx
  });
});
