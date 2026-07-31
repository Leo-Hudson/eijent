'use client';

import React from 'react';
import LedgerSelect from '@/components/ledger/LedgerSelect';
import {
  accountNameSchema,
  ACCOUNT_NAME_FORMAT_ERROR,
  ACCOUNT_NAME_HINT,
  ACCOUNT_NAME_IN_USE,
  normalizeAccountNameInput,
} from '@/lib/accountName';
import { isPasswordComplex, PASSWORD_COMPLEXITY_ERROR } from '@/lib/passwordRules';
import {
  DEFAULT_PHONE_COUNTRY,
  digitsOnly,
  formatPhoneForSubmit,
  PHONE_COUNTRIES,
} from '@/lib/phoneCountries';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUIRED_MSG = '*Required field';
const MANDATORY_ALERT = 'Please fill in all mandatory fields before proceeding.';
const CONFIRM_REQUIRED_MSG = 'Please confirm your password.';

const PHONE_COUNTRY_OPTIONS = PHONE_COUNTRIES.map((c) => ({
  value: c.code,
  label: `${c.code} ${c.dial}`,
}));

const INITIAL = {
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
  email: '',
  phoneNational: '',
  companyName: '',
  accountName: '',
};

const isBlank = (value) => !String(value || '').trim();

const FieldError = ({ id, message, fullWidth = false }) => (
  <p
    className={fullWidth ? 'signup-field-error signup-field-error--block' : 'signup-field-error'}
    id={id}
    role={message ? 'alert' : undefined}
    data-empty={message ? 'false' : 'true'}
  >
    {message || '\u00a0'}
  </p>
);

const EyeIcon = ({ open }) =>
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

const SignupForm = () => {
  const [values, setValues] = React.useState(INITIAL);
  const [phoneCountry, setPhoneCountry] = React.useState(DEFAULT_PHONE_COUNTRY);
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [formError, setFormError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const clearFieldError = (name) => {
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;
    if (name === 'accountName') nextValue = normalizeAccountNameInput(value);
    if (name === 'phoneNational') nextValue = digitsOnly(value);
    setValues((prev) => ({ ...prev, [name]: nextValue }));
    clearFieldError(name);
    if (formError) setFormError('');
  };

  const validate = () => {
    const next = {};

    if (isBlank(values.firstName)) next.firstName = REQUIRED_MSG;
    if (isBlank(values.lastName)) next.lastName = REQUIRED_MSG;
    if (isBlank(values.password)) next.password = REQUIRED_MSG;
    if (isBlank(values.confirmPassword)) next.confirmPassword = CONFIRM_REQUIRED_MSG;
    if (isBlank(values.email)) next.email = REQUIRED_MSG;
    if (isBlank(values.companyName)) next.companyName = REQUIRED_MSG;
    if (isBlank(values.accountName)) next.accountName = REQUIRED_MSG;

    const hasMandatoryGaps = Object.keys(next).length > 0;
    if (hasMandatoryGaps) {
      return { fieldErrors: next, formError: MANDATORY_ALERT };
    }

    if (!isPasswordComplex(values.password)) {
      next.password = PASSWORD_COMPLEXITY_ERROR;
    }

    if (values.confirmPassword !== values.password) {
      next.confirmPassword = 'Passwords do not match.';
    }

    if (!EMAIL_RE.test(values.email.trim())) {
      next.email = 'Please enter a valid email address.';
    }

    try {
      accountNameSchema.validateSync(values.accountName);
    } catch (err) {
      next.accountName = err.message || ACCOUNT_NAME_FORMAT_ERROR;
    }

    return { fieldErrors: next, formError: '' };
  };

  const submitSignup = async (e) => {
    e.preventDefault();
    setFormError('');
    setFieldErrors({});

    const { fieldErrors: nextErrors, formError: nextFormError } = validate();
    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      if (nextFormError) setFormError(nextFormError);
      return;
    }

    setSubmitting(true);
    try {
      const phone = formatPhoneForSubmit(phoneCountry, values.phoneNational);
      const accountName = normalizeAccountNameInput(values.accountName).replace(/^-+|-+$/g, '');
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: values.companyName.trim(),
          accountName,
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          phone,
          password: values.password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.field === 'accountName' || data.error === ACCOUNT_NAME_IN_USE) {
          setFieldErrors({ accountName: ACCOUNT_NAME_IN_USE });
          setFormError(ACCOUNT_NAME_IN_USE);
          return;
        }
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
        <div className="signup-row">
          <div className="signup-field">
            <label htmlFor="firstName">
              First name <span className="signup-req" aria-hidden="true">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Jordan"
              value={values.firstName}
              onChange={onChange}
              aria-invalid={!!fieldErrors.firstName}
              aria-describedby="err-firstName"
            />
            <FieldError id="err-firstName" message={fieldErrors.firstName} />
          </div>
          <div className="signup-field">
            <label htmlFor="lastName">
              Last name <span className="signup-req" aria-hidden="true">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Lee"
              value={values.lastName}
              onChange={onChange}
              aria-invalid={!!fieldErrors.lastName}
              aria-describedby="err-lastName"
            />
            <FieldError id="err-lastName" message={fieldErrors.lastName} />
          </div>
        </div>

        <div className="signup-field-group">
          <div className="signup-row">
            <div className="signup-field signup-field--flush">
              <label htmlFor="password">
                Password <span className="signup-req" aria-hidden="true">*</span>
              </label>
              <div className="signup-password">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min 8 characters"
                  value={values.password}
                  onChange={onChange}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby="err-password-row"
                />
                <button
                  type="button"
                  className="signup-password__toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>
            <div className="signup-field signup-field--flush">
              <label htmlFor="confirmPassword">
                Confirm password <span className="signup-req" aria-hidden="true">*</span>
              </label>
              <div className="signup-password">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  value={values.confirmPassword}
                  onChange={onChange}
                  aria-invalid={!!fieldErrors.confirmPassword}
                  aria-describedby="err-password-row"
                />
                <button
                  type="button"
                  className="signup-password__toggle"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
            </div>
          </div>
          <FieldError
            id="err-password-row"
            fullWidth
            message={
              [fieldErrors.password, fieldErrors.confirmPassword].filter(Boolean).join(' · ') || ''
            }
          />
        </div>

        <div className="signup-field">
          <label htmlFor="email">
            E-mail <span className="signup-req" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={values.email}
            onChange={onChange}
            aria-invalid={!!fieldErrors.email}
            aria-describedby="err-email"
          />
          <FieldError id="err-email" message={fieldErrors.email} />
        </div>

        <div className="signup-field">
          <label htmlFor="phoneNational">Phone number</label>
          <div className="signup-phone">
            <LedgerSelect
              id="phoneCountry"
              aria-label="Country code"
              value={phoneCountry}
              onValueChange={(next) => {
                setPhoneCountry(next || DEFAULT_PHONE_COUNTRY);
                if (formError) setFormError('');
              }}
              options={PHONE_COUNTRY_OPTIONS}
              placeholder="US +1"
            />
            <input
              id="phoneNational"
              name="phoneNational"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="5550100"
              value={values.phoneNational}
              onChange={onChange}
              aria-invalid={!!fieldErrors.phoneNational}
              aria-describedby="err-phone"
            />
          </div>
          <FieldError id="err-phone" message={fieldErrors.phoneNational} />
        </div>

        <div className="signup-field">
          <label htmlFor="companyName">
            Company <span className="signup-req" aria-hidden="true">*</span>
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            autoComplete="organization"
            placeholder="Acme Revenue Co."
            value={values.companyName}
            onChange={onChange}
            aria-invalid={!!fieldErrors.companyName}
            aria-describedby="err-companyName"
          />
          <FieldError id="err-companyName" message={fieldErrors.companyName} />
        </div>

        <div className="signup-field">
          <label htmlFor="accountName">
            Account name <span className="signup-req" aria-hidden="true">*</span>
          </label>
          <input
            id="accountName"
            name="accountName"
            type="text"
            autoComplete="off"
            spellCheck={false}
            inputMode="text"
            placeholder="acme-workspace"
            value={values.accountName}
            onChange={onChange}
            aria-invalid={!!fieldErrors.accountName}
            aria-describedby={
              fieldErrors.accountName ? 'err-accountName accountName-hint' : 'accountName-hint'
            }
          />
          <p className="signup-field-hint" id="accountName-hint">
            {ACCOUNT_NAME_HINT}
          </p>
          <FieldError id="err-accountName" message={fieldErrors.accountName} />
        </div>

        {formError && (
          <p className="signup-form-error" role="alert">
            {formError}
          </p>
        )}

        <button type="submit" className="signup-submit" disabled={submitting}>
          {submitting ? 'Creating account\u2026' : 'CREATE YOUR ACCOUNT'}
        </button>
      </form>

      <p className="signup-alt">
        Already have an account? <a href="/login">Sign in</a>
      </p>
    </div>
  );
};

export default SignupForm;
