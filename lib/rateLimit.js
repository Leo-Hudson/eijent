/**
 * Fixed-window rate limiting for route handlers.
 *
 * State lives in the Node process, so limits are per instance. On a single
 * long-lived server this is a real limit; behind several instances it only
 * slows an attacker down proportionally. Core still enforces its own login
 * lockout (5 attempts / 10 minutes), which is the hard stop for credential
 * guessing.
 */

const buckets = new Map();

const SWEEP_EVERY = 500;
let callsSinceSweep = 0;

const sweep = (now) => {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
};

/**
 * Records a hit and reports whether the caller is over the limit.
 * Returns `{ ok, remaining, retryAfter }` where `retryAfter` is in seconds.
 */
export const rateLimit = ({ key, limit, windowMs }) => {
  const now = Date.now();

  callsSinceSweep += 1;
  if (callsSinceSweep >= SWEEP_EVERY) {
    callsSinceSweep = 0;
    sweep(now);
  }

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  return { ok: true, remaining: limit - existing.count, retryAfter: 0 };
};

/** Drops a bucket, so a successful attempt does not count against the caller. */
export const resetRateLimit = (key) => {
  buckets.delete(key);
};

/**
 * Best-effort client IP from proxy headers. Falls back to a shared bucket so a
 * missing header cannot be used to opt out of limiting entirely.
 */
export const clientIp = (req) => {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
};
