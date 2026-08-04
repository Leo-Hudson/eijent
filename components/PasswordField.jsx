'use client';

import React from 'react';

export const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M10.5 10.6a2.5 2.5 0 003.5 3.5M9.9 5.1A9.8 9.8 0 0112 4.8c5 0 9.3 3.3 10.7 7.7a11.4 11.4 0 01-4.1 5.3M6.1 6.1A11.4 11.4 0 001.3 12.5C2.7 16.9 7 20.2 12 20.2c1.5 0 2.9-.3 4.2-.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 12.5C3.4 8.1 7.7 4.8 12.7 4.8S22 8.1 23.4 12.5C22 16.9 17.7 20.2 12.7 20.2S3.4 16.9 2 12.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12.7" cy="12.5" r="3.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );

/** Labelled password input with a show/hide toggle. */
export default function PasswordField({
  id,
  name,
  label,
  value,
  onChange,
  autoComplete = 'new-password',
  placeholder,
  invalid = false,
  describedBy,
}) {
  const [show, setShow] = React.useState(false);

  return (
    <div className="signup-field">
      <label htmlFor={id}>{label}</label>
      <div className="signup-password">
        <input
          id={id}
          name={name || id}
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-invalid={invalid}
          aria-describedby={describedBy}
        />
        <button
          type="button"
          className="signup-password__toggle"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  );
}
