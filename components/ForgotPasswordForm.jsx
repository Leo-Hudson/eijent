'use client';

import React from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPasswordForm = () => {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const [sent, setSent] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!EMAIL_RE.test(email.trim())) {
      setError('Please enter a valid email.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setSent(data.message || 'Check your inbox for the reset link.');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="signup-success" role="status">
        <div className="signup-success__mark" aria-hidden="true">
          <img src="/assets/mark-static.png" alt="" width={48} height={48} />
        </div>
        <h2 className="signup-success__title">Check your email</h2>
        <p className="signup-success__text">{sent}</p>
        <p className="signup-success__meta mono">{email.trim()}</p>
        <div className="signup-success__actions">
          <a href="/login" className="signup-submit signup-submit--inline">
            Back to sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className="signup-form" onSubmit={onSubmit} noValidate>
      <div className="signup-field">
        <label htmlFor="email">Work email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          aria-invalid={!!error}
        />
      </div>

      {error && (
        <p className="signup-form-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="signup-submit" disabled={submitting}>
        {submitting ? 'Sending\u2026' : 'Send reset link'}
      </button>

      <p className="signup-alt">
        Remembered it? <a href="/login">Back to sign in</a>
      </p>
    </form>
  );
};

export default ForgotPasswordForm;
