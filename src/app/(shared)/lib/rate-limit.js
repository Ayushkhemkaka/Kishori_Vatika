const store = /* @__PURE__ */ new Map();
const WINDOW_MS = 60 * 1e3;
const MAX_REQUESTS = 30;
function getIdentifier(key) {
  const entry = store.get(key);
  const now = Date.now();
  if (!entry) return key;
  if (now >= entry.resetAt) {
    store.delete(key);
    return key;
  }
  return key;
}
function checkRateLimit(identifier) {
  const now = Date.now();
  const key = identifier;
  let entry = store.get(key);
  if (!entry) {
    entry = { count: 1, resetAt: now + WINDOW_MS };
    store.set(key, entry);
    return {
      success: true,
      remaining: MAX_REQUESTS - 1,
      resetAt: entry.resetAt
    };
  }
  if (now >= entry.resetAt) {
    entry = { count: 1, resetAt: now + WINDOW_MS };
    store.set(key, entry);
    return {
      success: true,
      remaining: MAX_REQUESTS - 1,
      resetAt: entry.resetAt
    };
  }
  entry.count += 1;
  const success = entry.count <= MAX_REQUESTS;
  return {
    success,
    remaining: Math.max(0, MAX_REQUESTS - entry.count),
    resetAt: entry.resetAt
  };
}
function getClientIdentifier(headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip")?.trim() || "anonymous";
}
export { checkRateLimit };
export { getClientIdentifier };
