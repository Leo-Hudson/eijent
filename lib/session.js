import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'eijent_session';

const DEFAULT_MAX_AGE = 60 * 60 * 24 * 14; // 14 days (matches Core token TTL)

const baseOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge,
});

/**
 * Sets the member session cookie on a NextResponse.
 * `exp` is the Core token expiry (unix seconds); cookie lifetime tracks it.
 */
export const setSessionCookie = (res, token, exp) => {
  let maxAge = DEFAULT_MAX_AGE;
  if (typeof exp === 'number') {
    const remaining = Math.floor(exp - Date.now() / 1000);
    if (remaining > 0) maxAge = remaining;
  }
  res.cookies.set(SESSION_COOKIE, token, baseOptions(maxAge));
};

/** Clears the member session cookie on a NextResponse. */
export const clearSessionCookie = (res) => {
  res.cookies.set(SESSION_COOKIE, '', baseOptions(0));
};

/** Reads the session token from the request cookie store (route handlers). */
export const getRequestToken = (req) => req.cookies.get(SESSION_COOKIE)?.value || null;

/** Reads the session token via next/headers (server components). */
export const readSessionToken = async () => {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value || null;
};
