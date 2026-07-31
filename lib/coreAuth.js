const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL || '';

export class CoreUnavailableError extends Error {
  constructor(message = 'Core is unavailable') {
    super(message);
    this.name = 'CoreUnavailableError';
    this.code = 'core_unavailable';
  }
}

export const isCoreUnavailable = (err) =>
  err instanceof CoreUnavailableError || err?.code === 'core_unavailable';

/** Logs a member into Core. Returns { ok, status, data }. */
export const coreLogin = async (email, password) => {
  if (!CORE_API_BASE_URL) {
    return { ok: false, status: 503, data: { error: 'Core is not configured.' } };
  }
  try {
    const res = await fetch(`${CORE_API_BASE_URL}/api/members/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch {
    return {
      ok: false,
      status: 503,
      data: {
        error: 'We could not sign you in right now. Please try again in a moment.',
        code: 'core_unavailable',
      },
    };
  }
};

/**
 * Validates a member JWT via Core /me.
 * Returns the member user object, or null if the token is invalid.
 * Throws CoreUnavailableError when Core cannot be reached (do not treat as logout).
 */
export const coreMe = async (token) => {
  if (!token) return null;
  if (!CORE_API_BASE_URL) throw new CoreUnavailableError('Core is not configured.');
  try {
    const res = await fetch(`${CORE_API_BASE_URL}/api/members/me?depth=1`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => ({}));
    return data?.user || null;
  } catch {
    throw new CoreUnavailableError();
  }
};

/** Best-effort Core logout for a member JWT. */
export const coreLogout = async (token) => {
  if (!token || !CORE_API_BASE_URL) return;
  try {
    await fetch(`${CORE_API_BASE_URL}/api/members/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
  } catch {
    // ignore; cookie is cleared regardless
  }
};

/** Slim member shape for the browser (no sensitive fields). */
export const slimMember = (user) => ({
  id: user?.id,
  firstName: user?.firstName || '',
  lastName: user?.lastName || '',
  email: user?.email || '',
  phone: user?.phone || '',
  companyName: user?.companyName || user?.metadata?.companyName || '',
  accountName: user?.accountName || '',
  status: user?.status || null,
});

export const coreUnavailablePayload = () => ({
  authenticated: true,
  code: 'core_unavailable',
  error:
    'We could not load your account right now. Please try again in a moment.',
});
