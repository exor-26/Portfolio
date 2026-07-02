async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function canvasSignal() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    return "no-canvas";
  }
  canvas.width = 240;
  canvas.height = 80;
  context.textBaseline = "top";
  context.font = "16px Arial";
  context.fillStyle = "#f97316";
  context.fillRect(0, 0, 240, 80);
  context.fillStyle = "#080810";
  context.fillText("Protected Course Fingerprint 26", 12, 18);
  context.strokeStyle = "#6366f1";
  context.arc(180, 40, 18, 0, Math.PI * 2);
  context.stroke();
  return canvas.toDataURL();
}

export async function computeDeviceFingerprint() {
  const parts = [
    navigator.userAgent,
    navigator.language,
    navigator.platform,
    String(navigator.hardwareConcurrency || ""),
    String(navigator.deviceMemory || ""),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    `${window.devicePixelRatio || 1}`,
    canvasSignal()
  ];
  return sha256(parts.join("||"));
}
