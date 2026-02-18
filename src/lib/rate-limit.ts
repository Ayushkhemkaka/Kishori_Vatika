/**
 * Simple in-memory rate limiter for serverless.
 * For production at scale, use Upstash Redis with @upstash/ratelimit.
 * This limits per-identifier (e.g. IP) per deployment instance.
 */

const store = new Map<
  string,
  { count: number; resetAt: number }
>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 30; // per window

function getIdentifier(key: string): string {
  const entry = store.get(key);
  const now = Date.now();
  if (!entry) return key;
  if (now >= entry.resetAt) {
    store.delete(key);
    return key;
  }
  return key;
}

export function checkRateLimit(identifier: string): {
  success: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const key = identifier;
  let entry = store.get(key);

  if (!entry) {
    entry = { count: 1, resetAt: now + WINDOW_MS };
    store.set(key, entry);
    return {
      success: true,
      remaining: MAX_REQUESTS - 1,
      resetAt: entry.resetAt,
    };
  }

  if (now >= entry.resetAt) {
    entry = { count: 1, resetAt: now + WINDOW_MS };
    store.set(key, entry);
    return {
      success: true,
      remaining: MAX_REQUESTS - 1,
      resetAt: entry.resetAt,
    };
  }

  entry.count += 1;
  const success = entry.count <= MAX_REQUESTS;
  return {
    success,
    remaining: Math.max(0, MAX_REQUESTS - entry.count),
    resetAt: entry.resetAt,
  };
}

export function getClientIdentifier(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    "anonymous"
  );
}
