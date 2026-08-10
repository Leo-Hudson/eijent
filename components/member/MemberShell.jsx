'use client';

import React from 'react';
import { MEMBER_NAV, initials, displayName } from '@/lib/memberDisplay';

const NAV_ICONS = {
  overview: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3.5 8.2 10 3l6.5 5.2V16a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 16V8.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8 17.5V11h4v6.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  plan: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3.5" y="4" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 8h13M8 4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  credits: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 6.5v7M7.8 8.2c.5-.7 1.3-1.1 2.2-1.1 1.3 0 2.3.8 2.3 1.9S11.3 10.8 10 10.8 7.7 11.6 7.7 12.7c0 1.1 1 1.9 2.3 1.9.9 0 1.7-.4 2.2-1.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  billing: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 8.5h14M6.5 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  team: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="7" cy="7.5" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13.25" cy="8" r="1.75" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2.75 15.5c.6-2.1 2.2-3.25 4.25-3.25s3.65 1.15 4.25 3.25M11.1 12.4c.7-.4 1.5-.65 2.4-.65 1.55 0 2.85.75 3.4 2.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 3.5v1.4M10 15.1v1.4M3.5 10h1.4M15.1 10h1.4M5.4 5.4l1 1M13.6 13.6l1 1M14.6 5.4l-1 1M6.4 13.6l-1 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
};

/**
 * Shared member chrome: sidebar on desktop, tab strip on mobile.
 * Visual language aligned to the Eijent web app dashboard.
 */
export default function MemberShell({
  active,
  member,
  offline = false,
  children,
}) {
  const [signingOut, setSigningOut] = React.useState(false);
  const name = displayName(member, 'Account');
  const email = member?.email || null;

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
            <div className="member-sidebar__who-text">
              <p className="member-sidebar__name">{name}</p>
              {offline ? (
                <span className="dash-badge is-warn">Unavailable</span>
              ) : email ? (
                <p className="member-sidebar__email">{email}</p>
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
              <span className="member-nav-link__icon">{NAV_ICONS[item.id]}</span>
              <span>{item.label}</span>
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
            className="member-logout"
            onClick={signOut}
            disabled={signingOut}
          >
            {signingOut ? 'Signing out…' : 'Log out'}
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
