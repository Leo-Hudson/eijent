'use client';
import React from 'react';
import * as yup from 'yup';

// Same rule as the server route so client + server never disagree.
// yup's built-in .email() is too lenient (accepts "a@b" with no TLD).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailSchema = yup
  .string()
  .trim()
  .required('Please enter your email address.')
  .matches(EMAIL_RE, 'Please enter a valid email address.');

/* ---------- Waitlist Form ---------- */
const WaitlistForm = ({ variant }) => {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState('idle');
  const [error, setError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    try { if (localStorage.getItem('eijent_waitlist')) setStatus('success'); } catch (e) {}
  }, []);

  const onChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const reset = () => {
    try { localStorage.removeItem('eijent_waitlist'); } catch (e) {}
    setEmail('');
    setError('');
    setStatus('idle');
  };

  const submit = async (e) => {
    e.preventDefault();

    let cleanEmail;
    try {
      cleanEmail = await emailSchema.validate(email);
    } catch (validationError) {
      setError(validationError.message);
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }
      try { localStorage.setItem('eijent_waitlist', JSON.stringify({ email: cleanEmail, t: Date.now() })); } catch (e) {}
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="waitlist-success" role="status">
        <span className="waitlist-success__check" aria-hidden="true">✓</span>
        <span className="waitlist-success__text">
          You&rsquo;re on the list. We&rsquo;ll be in touch personally — usually within a week.
        </span>
        <button type="button" className="waitlist-success__reset" onClick={reset}>
          Join with another email
        </button>
      </div>
    );
  }

  return (
    <>
      <form className={`waitlist-form${error ? ' is-invalid' : ''}`} onSubmit={submit} noValidate>
        <input
          type="email"
          value={email} onChange={onChange}
          placeholder="you@company.com" aria-label="Email address"
          autoComplete="email"
          aria-invalid={!!error}
          aria-describedby={error ? 'waitlist-error' : undefined}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Sending…' : 'Join waitlist'}
        </button>
      </form>
      {error && (
        <p className="waitlist-error" id="waitlist-error" role="alert">
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 7.5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="16.25" r="1.1" fill="currentColor" />
          </svg>
          <span>{error}</span>
        </p>
      )}
      {variant === 'band' && (
        <div className="waitlist-foot">
          <span>No spam · We&rsquo;ll reach out personally</span>
          <span>·</span>
          <span>Onboarding ~10 partners every 2 weeks</span>
        </div>
      )}
    </>
  );
};

export default WaitlistForm;
