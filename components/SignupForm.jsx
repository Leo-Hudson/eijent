'use client';

import React from 'react';
import * as yup from 'yup';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const detailsSchema = yup.object({
  companyName: yup
    .string()
    .trim()
    .required('Company name is required.')
    .min(2, 'Company name must be at least 2 characters.'),
  firstName: yup
    .string()
    .trim()
    .required('First name is required.')
    .min(1, 'First name is required.'),
  lastName: yup
    .string()
    .trim()
    .required('Last name is required.')
    .min(1, 'Last name is required.'),
  email: yup
    .string()
    .trim()
    .required('Work email is required.')
    .matches(EMAIL_RE, 'Please enter a valid work email.'),
  password: yup
    .string()
    .required('Password is required.')
    .min(8, 'Password must be at least 8 characters.'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password.')
    .oneOf([yup.ref('password')], 'Passwords do not match.'),
});

const INITIAL = {
  companyName: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignupForm = () => {
  const [values, setValues] = React.useState(INITIAL);
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [formError, setFormError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (formError) setFormError('');
  };

  const submitSignup = async (e) => {
    e.preventDefault();
    setFormError('');
    setFieldErrors({});

    try {
      await detailsSchema.validate(values, { abortEarly: false });
    } catch (err) {
      const next = {};
      if (err.inner?.length) {
        err.inner.forEach((item) => {
          if (item.path && !next[item.path]) next[item.path] = item.message;
        });
      } else if (err.path) {
        next[err.path] = err.message;
      }
      setFieldErrors(next);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: values.companyName,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }
      setResult(data);
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (result?.success) {
    return (
      <div className="signup-success" role="status">
        <div className="signup-success__mark" aria-hidden="true">
          <img src="/assets/mark-static.png" alt="" width={48} height={48} />
        </div>
        <p className="signup-brand__name">Eijent</p>
        <h2 className="signup-success__title">Account pending review</h2>
        <p className="signup-success__text">
          Thanks for signing up. Your company account for <strong>{values.companyName}</strong> was
          created and is waiting for admin approval. You will not be able to sign in until an admin
          assigns a plan and activates your account. We will email you when it is ready.
        </p>
        <p className="signup-success__meta mono">{values.email}</p>
        <div className="signup-success__actions">
          <a href="/login" className="signup-submit signup-submit--inline">
            Back to sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-wizard">
      <header className="signup-brand">
        <img
          src="/assets/mark-static.png"
          alt="Eijent"
          className="signup-brand__mark"
          width={56}
          height={56}
        />
        <p className="signup-brand__name">Eijent</p>
        <h1 className="signup-brand__title">Create your company account</h1>
        <p className="signup-brand__sub">
          Submit your details for review. An admin will assign a plan and activate your account
          before you can sign in.
        </p>
      </header>

      <form className="signup-form signup-step-panel" onSubmit={submitSignup} noValidate>
        <div className="signup-field">
          <label htmlFor="companyName">Company name</label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            autoComplete="organization"
            placeholder="Acme Revenue Co."
            value={values.companyName}
            onChange={onChange}
            aria-invalid={!!fieldErrors.companyName}
            aria-describedby={fieldErrors.companyName ? 'err-companyName' : undefined}
          />
          {fieldErrors.companyName && (
            <p className="signup-field-error" id="err-companyName" role="alert">
              {fieldErrors.companyName}
            </p>
          )}
        </div>

        <div className="signup-row">
          <div className="signup-field">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Jordan"
              value={values.firstName}
              onChange={onChange}
              aria-invalid={!!fieldErrors.firstName}
              aria-describedby={fieldErrors.firstName ? 'err-firstName' : undefined}
            />
            {fieldErrors.firstName && (
              <p className="signup-field-error" id="err-firstName" role="alert">
                {fieldErrors.firstName}
              </p>
            )}
          </div>
          <div className="signup-field">
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Lee"
              value={values.lastName}
              onChange={onChange}
              aria-invalid={!!fieldErrors.lastName}
              aria-describedby={fieldErrors.lastName ? 'err-lastName' : undefined}
            />
            {fieldErrors.lastName && (
              <p className="signup-field-error" id="err-lastName" role="alert">
                {fieldErrors.lastName}
              </p>
            )}
          </div>
        </div>

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
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'err-email' : undefined}
          />
          {fieldErrors.email && (
            <p className="signup-field-error" id="err-email" role="alert">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className="signup-row">
          <div className="signup-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={values.password}
              onChange={onChange}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? 'err-password' : undefined}
            />
            {fieldErrors.password && (
              <p className="signup-field-error" id="err-password" role="alert">
                {fieldErrors.password}
              </p>
            )}
          </div>
          <div className="signup-field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat password"
              value={values.confirmPassword}
              onChange={onChange}
              aria-invalid={!!fieldErrors.confirmPassword}
              aria-describedby={fieldErrors.confirmPassword ? 'err-confirmPassword' : undefined}
            />
            {fieldErrors.confirmPassword && (
              <p className="signup-field-error" id="err-confirmPassword" role="alert">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {formError && (
          <p className="signup-form-error" role="alert">
            {formError}
          </p>
        )}

        <button type="submit" className="signup-submit" disabled={submitting}>
          {submitting ? 'Submitting\u2026' : 'Submit for review'}
        </button>
      </form>

      <p className="signup-alt">
        Already have an account? <a href="/login">Sign in</a>
      </p>
    </div>
  );
};

export default SignupForm;
