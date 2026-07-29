'use client';

import React from 'react';

/**
 * Shared dashboard payload for Overview / Plan / Team.
 */
export function useMemberDashboard() {
  const [state, setState] = React.useState({ loading: true, error: '', data: null });

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
        if (!res.ok) throw new Error(data.error || 'Unable to load your dashboard.');
        if (active) setState({ loading: false, error: '', data });
      } catch (err) {
        if (active) {
          setState({
            loading: false,
            error: err.message || 'Something went wrong.',
            data: null,
          });
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return state;
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
