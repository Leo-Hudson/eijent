'use client';

import React from 'react';
import { BUY_CREDITS_MAILTO, SALES_MAILTO } from '@/lib/memberDisplay';

/**
 * Soft global actions (no real checkout yet).
 * Buy Credits / Contact Sales are mailto; Billing and Credits are in-app links.
 */
export default function MemberSoftActions({
  showBilling = true,
  showCredits = false,
  showBuyCredits = true,
  showContactSales = true,
  compact = false,
}) {
  return (
    <div className={`member-soft-actions${compact ? ' member-soft-actions--compact' : ''}`}>
      {showBuyCredits ? (
        <a href={BUY_CREDITS_MAILTO} className="dash-link-btn dash-link-btn--ghost">
          Buy Credits
          <span className="dash-badge is-soon">Coming soon</span>
        </a>
      ) : null}
      {showContactSales ? (
        <a href={SALES_MAILTO} className="dash-link-btn dash-link-btn--ghost">
          Contact Sales
        </a>
      ) : null}
      {showBilling ? (
        <a href="/dashboard/billing" className="dash-link-btn dash-link-btn--ghost">
          View Billing
        </a>
      ) : null}
      {showCredits ? (
        <a href="/dashboard/credits" className="dash-link-btn dash-link-btn--ghost">
          View Credits
        </a>
      ) : null}
    </div>
  );
}
