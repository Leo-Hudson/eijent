const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL || '';

/** Logs a member into Core. Returns { ok, status, data }. */
export const coreLogin = async (email, password) => {
  const res = await fetch(`${CORE_API_BASE_URL}/api/members/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
};

/** Validates a member JWT via Core /me. Returns the member user object, or null. */
export const coreMe = async (token) => {
  if (!token) return null;
  const res = await fetch(`${CORE_API_BASE_URL}/api/members/me?depth=1`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const data = await res.json().catch(() => ({}));
  return data?.user || null;
};

/** Best-effort Core logout for a member JWT. */
export const coreLogout = async (token) => {
  if (!token) return;
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
