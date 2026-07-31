'use client';

import React from 'react';

const MEMBER_CACHE_KEY = 'eijent_member_cache';

function readCachedMember() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(MEMBER_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function writeCachedMember(member) {
  if (typeof window === 'undefined' || !member) return;
  try {
    sessionStorage.setItem(MEMBER_CACHE_KEY, JSON.stringify(member));
  } catch {
    // ignore quota / private mode
  }
}

/**
 * Shared dashboard payload for Overview / Plan / Team / Billing / Credits.
 */
export function useMemberDashboard() {
  const [state, setState] = React.useState({
    loading: true,
    error: '',
    errorCode: '',
    data: null,
  });
  const [reloadKey, setReloadKey] = React.useState(0);

  const reload = React.useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: '', errorCode: '' }));
    setReloadKey((k) => k + 1);
  }, []);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/dashboard', { cache: 'no-store' });
        if (res.status === 401) {
          window.location.assign('/login?next=/dashboard');
          return;
        }
        const data = await res.json().catch(() => ({}));
        if (res.status === 503 || data.code === 'core_unavailable') {
          if (active) {
            const cached = readCachedMember();
            setState({
              loading: false,
              error:
                data.error ||
                'We could not load your account right now. Please try again in a moment.',
              errorCode: 'core_unavailable',
              data: cached ? { member: cached } : null,
            });
          }
          return;
        }
        if (!res.ok) throw new Error(data.error || 'Unable to load your dashboard.');
        if (data?.member) writeCachedMember(data.member);
        if (active) setState({ loading: false, error: '', errorCode: '', data });
      } catch (err) {
        if (active) {
          const cached = readCachedMember();
          const msg = err.message || 'Something went wrong.';
          const looksOffline =
            /failed to fetch|networkerror|load failed|fetch/i.test(msg) ||
            err.name === 'TypeError';
          setState({
            loading: false,
            error: looksOffline
              ? 'We could not load your account right now. Please try again in a moment.'
              : msg,
            errorCode: looksOffline ? 'core_unavailable' : 'error',
            data: cached ? { member: cached } : null,
          });
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  return { ...state, reload };
}

export function deriveWallet(data) {
  const credits = data?.credits || null;
  const entitlements = data?.entitlements || null;
  const wallet = entitlements?.credits || null;
  const balance =
    wallet?.balance != null ? wallet.balance : credits?.balance != null ? credits.balance : null;
  const allocation =
    wallet?.allocation != null
      ? wallet.allocation
      : credits?.allocation != null
        ? credits.allocation
        : null;
  return {
    wallet,
    balance,
    allocation,
    totalDeducted: credits?.totalDeducted || 0,
    isLowOnCredits: Boolean(wallet?.isLowOnCredits),
    lowCreditThreshold:
      typeof wallet?.lowCreditAlertThreshold === 'number'
        ? wallet.lowCreditAlertThreshold
        : null,
    resetCycle: wallet?.resetCycle || null,
    nextResetAt: wallet?.nextResetAt || null,
  };
}
