export async function apiFetch(path, options = {}) {
  const headers = {
    ...(options.body ? { "content-type": "application/json" } : {}),
    ...(options.adminSecret ? { "x-admin-secret": options.adminSecret } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`/api/${path.replace(/^\/+/, "")}`, {
    method: options.method || (options.body ? "POST" : "GET"),
    credentials: "include",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    const error = new Error(data.reason || "request_failed");
    error.data = data;
    error.status = response.status;
    throw error;
  }
  return data;
}
