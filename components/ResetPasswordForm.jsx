'use client';

import React from 'react';
import PasswordField from '@/components/PasswordField';
import { isPasswordComplex, PASSWORD_COMPLEXITY_ERROR } from '@/lib/passwordRules';

const ResetPasswordForm = ({ token }) => {
  const [values, setValues] = React.useState({ password: '', confirmPassword: '' });
  const [error, setError] = React.useState('');
  const [expired, setExpired] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isPasswordComplex(values.password)) {
      setError(PASSWORD_COMPLEXITY_ERROR);
      return;
    }
    if (values.password !== values.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: values.password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.code === 'invalid_token') setExpired(true);
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }
      setDone(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="signup-success" role="status">
        <div className="signup-success__mark" aria-hidden="true">
          <img src="/assets/mark-static.png" alt="" width={48} height={48} />
        </div>
        <h2 className="signup-success__title">Password updated</h2>
        <p className="signup-success__text">
          Your password has been changed. Sign in with your new password to continue.
        </p>
        <div className="signup-success__actions">
          <a href="/login?reset=1" className="signup-submit signup-submit--inline">
            Go to sign in
          </a>
        </div>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="signup-success" role="alert">
        <h2 className="signup-success__title">This link has expired</h2>
        <p className="signup-success__text">
          Reset links are valid for one hour and can only be used once. Request a new one to
          continue.
        </p>
        <div className="signup-success__actions">
          <a href="/forgot-password" className="signup-submit signup-submit--inline">
            Request a new link
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className="signup-form" onSubmit={onSubmit} noValidate>
      <PasswordField
        id="password"
        label="New password"
        placeholder="Min 8 characters"
        value={values.password}
        onChange={onChange}
        invalid={!!error}
        describedBy="reset-error"
      />

      <PasswordField
        id="confirmPassword"
        label="Confirm new password"
        placeholder="Repeat password"
        value={values.confirmPassword}
        onChange={onChange}
        invalid={!!error}
        describedBy="reset-error"
      />

      <p className="signup-field-hint">{PASSWORD_COMPLEXITY_ERROR}</p>

      {error && (
        <p className="signup-form-error" id="reset-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="signup-submit" disabled={submitting}>
        {submitting ? 'Updating\u2026' : 'Set new password'}
      </button>

      <p className="signup-alt">
        <a href="/login">Back to sign in</a>
      </p>
    </form>
  );
};

export default ResetPasswordForm;
