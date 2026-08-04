'use client';

import React from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const safeNext = (raw) => {
  // Only allow same-origin relative paths to avoid open redirects.
  if (raw && raw.startsWith('/') && !raw.startsWith('//')) return raw;
  return '/dashboard';
};

const LoginForm = () => {
  const [values, setValues] = React.useState({ email: '', password: '' });
  const [error, setError] = React.useState('');
  const [notice, setNotice] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (new URLSearchParams(window.location.search).get('reset') === '1') {
      setNotice('Your password was updated. Sign in with your new password.');
    }
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (notice) setNotice('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!values.email.trim() || !EMAIL_RE.test(values.email.trim())) {
      setError('Please enter a valid email.');
      return;
    }
    if (!values.password) {
      setError('Please enter your password.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email.trim(), password: values.password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Incorrect email or password.');

      const next =
        typeof window !== 'undefined'
          ? safeNext(new URLSearchParams(window.location.search).get('next'))
          : '/dashboard';
      window.location.assign(next);
    } catch (err) {
      setError(err.message || 'Incorrect email or password.');
      setSubmitting(false);
    }
  };

  return (
    <form className="signup-form" onSubmit={onSubmit} noValidate>
      {notice && (
        <p className="signup-form-note" role="status">
          {notice}
        </p>
      )}

      <div className="signup-field">
        <label htmlFor="email">Work email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={values.email}
          onChange={onChange}
          aria-invalid={!!error}
        />
      </div>

      <div className="signup-field">
        <div className="signup-label-row">
          <label htmlFor="password">Password</label>
          <a className="signup-inline-link" href="/forgot-password">
            Forgot password?
          </a>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={values.password}
          onChange={onChange}
          aria-invalid={!!error}
        />
      </div>

      {error && <p className="signup-form-error" role="alert">{error}</p>}

      <button type="submit" className="signup-submit" disabled={submitting}>
        {submitting ? 'Signing in\u2026' : 'Sign in'}
      </button>

      <p className="signup-alt">
        Don&rsquo;t have an account? <a href="/signup">Create one</a>
      </p>
    </form>
  );
};

export default LoginForm;
