import { NextResponse } from 'next/server';
import { clientIp, rateLimit, resetRateLimit } from '@/lib/rateLimit';

const siteHost = () => {
  try {
    return new URL(process.env.BASE_URL || '').host || '';
  } catch {
    return '';
  }
};

/**
 * Rejects cross-site state-changing requests.
 *
 * Browsers always send `Origin` on POST/PATCH, and `Sec-Fetch-Site` on every
 * request, so a browser-driven CSRF attempt is always identifiable. Requests
 * with neither header did not come from a browser and cannot be CSRF, so they
 * pass through for server-to-server callers and local tooling.
 */
export const isSameOrigin = (req) => {
  const fetchSite = req.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'none') {
    return false;
  }

  const origin = req.headers.get('origin');
  if (!origin) return true;

  let originHost;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  const allowed = new Set(
    [
      req.headers.get('x-forwarded-host'),
      req.headers.get('host'),
      siteHost(),
    ].filter(Boolean),
  );

  return allowed.has(originHost);
};

const forbidden = () =>
  NextResponse.json({ error: 'Request blocked. Please reload the page and try again.' }, { status: 403 });

const tooMany = (retryAfter) =>
  NextResponse.json(
    {
      error: 'Too many attempts. Please wait a moment and try again.',
      code: 'rate_limited',
    },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } },
  );

/**
 * Runs the standard guards for a mutating route.
 *
 * Pass `buckets` as `[{ scope, limit, windowMs }]`; each is namespaced by
 * `name` and, unless `scope` is given, keyed on the client IP. Returns a
 * response to send back when a guard trips, or null when the request is clear.
 */
export const guardRequest = (req, { name, buckets = [], checkOrigin = true } = {}) => {
  if (checkOrigin && !isSameOrigin(req)) return forbidden();

  const ip = clientIp(req);
  for (const bucket of buckets) {
    const { ok, retryAfter } = rateLimit({
      key: `${name}:${bucket.scope || ip}`,
      limit: bucket.limit,
      windowMs: bucket.windowMs,
    });
    if (!ok) return tooMany(retryAfter);
  }

  return null;
};

/** Clears one bucket, e.g. so a successful login forgives earlier typos. */
export const clearBucket = (name, scope) => resetRateLimit(`${name}:${scope}`);

export const MINUTE = 60 * 1000;
export const HOUR = 60 * MINUTE;
