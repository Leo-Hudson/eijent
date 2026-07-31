'use client';

import React from 'react';

/** Shared error + retry for member dashboard pages. */
export default function MemberErrorState({
  message,
  onRetry,
  code = '',
  title,
}) {
  const unavailable = code === 'core_unavailable';
  const heading = title || (unavailable ? 'Temporarily unavailable' : 'Something went wrong');
  const detail =
    message ||
    (unavailable
      ? 'We could not load your account right now. Please try again in a moment.'
      : 'Unable to load your dashboard.');

  return (
    <div
      className={`dash-error-card${unavailable ? ' dash-error-card--offline' : ''}`}
      role="alert"
    >
      <p className="dash-error-card__eyebrow">{unavailable ? 'Unavailable' : 'Error'}</p>
      <h2 className="dash-error-card__title">{heading}</h2>
      <p className="dash-error-card__body">{detail}</p>
      {onRetry ? (
        <button type="button" className="dash-link-btn dash-error-card__retry" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}
