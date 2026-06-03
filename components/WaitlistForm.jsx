'use client';
import React from 'react';

/* ---------- Waitlist Form ---------- */
const WaitlistForm = ({ variant }) => {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState('idle');
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    try { if (localStorage.getItem('eijent_waitlist')) setStatus('success'); } catch (e) {}
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitting(true);
    // Stub: would post to /api/waitlist or Loops/Resend
    setTimeout(() => {
      try { localStorage.setItem('eijent_waitlist', JSON.stringify({ email, t: Date.now() })); } catch (e) {}
      setStatus('success');
      setSubmitting(false);
    }, 500);
  };

  if (status === 'success') {
    return (
      <div className="waitlist-success" role="status">
        <span className="waitlist-success__check" aria-hidden="true">✓</span>
        <span>You&rsquo;re on the list. We&rsquo;ll be in touch personally — usually within a week.</span>
      </div>
    );
  }

  return (
    <>
      <form className="waitlist-form" onSubmit={submit}>
        <input
          type="email" required
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder="you@company.com" aria-label="Email address"
          autoComplete="email"
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Sending…' : 'Join waitlist'}
        </button>
      </form>
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
