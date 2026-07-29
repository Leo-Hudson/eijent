'use client';

import React from 'react';
import { MEMBER_NAV, initials, displayName, STATUS_TONE } from '@/lib/memberDisplay';

/**
 * Shared member chrome: sidebar on desktop, tab strip on mobile.
 */
export default function MemberShell({
  active,
  member,
  children,
}) {
  const [signingOut, setSigningOut] = React.useState(false);
  const name = displayName(member, 'Account');
  const status = member?.status || null;
  const tone = STATUS_TONE[status] || 'is-warn';

  const signOut = async () => {
    setSigningOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // redirect regardless
    }
    window.location.assign('/login');
  };

  return (
    <div className="member-layout">
      <aside className="member-sidebar" aria-label="Member navigation">
        <div className="member-sidebar__brand">
          <a href="/dashboard" className="member-sidebar__logo">
            Eijent
          </a>
          <div className="member-sidebar__who">
            <span className="dash-avatar" aria-hidden="true">
              {initials(member)}
            </span>
            <div>
              <p className="member-sidebar__name">{name}</p>
              {status ? (
                <span className={`dash-badge ${tone}`}>{status}</span>
              ) : null}
            </div>
          </div>
        </div>

        <nav className="member-sidebar__nav" aria-label="Sections">
          {MEMBER_NAV.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`member-nav-link${active === item.id ? ' is-active' : ''}`}
              aria-current={active === item.id ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="member-sidebar__foot">
          <button
            type="button"
            className="member-go-app"
            title="Coming soon"
            onClick={() => {}}
          >
            Go to app
          </button>
          <button
            type="button"
            className="dash-signout"
            onClick={signOut}
            disabled={signingOut}
          >
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </aside>

      <div className="member-main">
        <nav className="member-tabs" aria-label="Sections">
          {MEMBER_NAV.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`member-tab${active === item.id ? ' is-active' : ''}`}
              aria-current={active === item.id ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="member-content">{children}</div>
      </div>
    </div>
  );
}
