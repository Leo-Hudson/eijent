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

const STEPS = [
  { key: 'plan', label: 'Plan' },
  { key: 'details', label: 'Details' },
  { key: 'pay', label: 'Payment' },
];

const priceAmount = (plan) => {
  if (plan?.priceMajor == null) return null;
  return plan.priceMajor.toLocaleString(undefined, {
    style: 'currency',
    currency: (plan.currency || 'USD').toUpperCase(),
  });
};

const freqLabel = (plan) => (plan?.paymentFrequency ? `/ ${plan.paymentFrequency}` : '');

const formatPrice = (plan) => {
  const amount = priceAmount(plan);
  if (!amount) return null;
  const freq = freqLabel(plan);
  return freq ? `${amount} ${freq}` : amount;
};

const SignupForm = () => {
  const [step, setStep] = React.useState('plan');

  const [plans, setPlans] = React.useState([]);
  const [plansLoading, setPlansLoading] = React.useState(true);
  const [plansError, setPlansError] = React.useState('');
  const [selectedPlanId, setSelectedPlanId] = React.useState('');

  const [values, setValues] = React.useState(INITIAL);
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [formError, setFormError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState(null);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || null;

  React.useEffect(() => {
    let active = true;
    const load = async () => {
      setPlansLoading(true);
      setPlansError('');
      try {
        const res = await fetch('/api/pricing-plans');
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Unable to load plans.');
        if (!active) return;
        const list = Array.isArray(data.plans) ? data.plans : [];
        setPlans(list);

        const fromUrl =
          typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('plan')
            : null;
        if (fromUrl && list.some((p) => p.id === fromUrl)) {
          setSelectedPlanId(fromUrl);
        }
      } catch (err) {
        if (active) setPlansError(err.message || 'Unable to load plans.');
      } finally {
        if (active) setPlansLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const selectPlan = (id) => {
    setSelectedPlanId(id);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('plan', id);
      window.history.replaceState({}, '', url);
    }
  };

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

  const goToDetails = () => {
    if (!selectedPlanId) return;
    setStep('details');
  };

  const submitDetails = async (e) => {
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

    setStep('pay');
  };

  const submitSignup = async () => {
    setFormError('');
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
          pricingPlanId: selectedPlanId,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }
      setResult(data);
      setStep('success');
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'success') {
    const planName = result?.plan?.name || selectedPlan?.name;
    const already = result?.alreadySubscribed;
    const authed = result?.authenticated;
    return (
      <div className="signup-success" role="status">
        <div className="signup-success__mark" aria-hidden="true">
          <img src="/assets/mark-static.png" alt="" width={48} height={48} />
        </div>
        <h2 className="signup-success__title">
          {already ? 'You already have an account' : 'You\u2019re in'}
        </h2>
        <p className="signup-success__text">
          {already ? (
            <>An account for <strong>{values.email}</strong> already has a plan.</>
          ) : (
            <>
              Your company account for <strong>{values.companyName}</strong> is set up on the{' '}
              <strong>{planName}</strong> plan.
            </>
          )}
        </p>
        <p className="signup-success__meta mono">
          {already ? 'Signed up as ' : 'Confirmation email: '}
          {values.email}
        </p>
        <div className="signup-success__actions">
          {authed ? (
            <a href="/dashboard" className="signup-submit signup-submit--inline">
              Go to dashboard
            </a>
          ) : (
            <a href="/login" className="signup-submit signup-submit--inline">
              Sign in to continue
            </a>
          )}
        </div>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="signup-wizard">
      <ol className="signup-steps" aria-label="Signup progress">
        {STEPS.map((s, i) => (
          <li
            key={s.key}
            className={
              'signup-steps__item' +
              (i === currentIndex ? ' is-active' : '') +
              (i < currentIndex ? ' is-done' : '')
            }
          >
            <span className="signup-steps__num">{i + 1}</span>
            <span className="signup-steps__label">{s.label}</span>
          </li>
        ))}
      </ol>

      {step === 'plan' && (
        <div className="signup-step-panel" key="plan">
          <p className="signup-step-lede">Pick the plan that fits your team. You can change it later.</p>

          {plansLoading && (
            <div className="signup-plans-loading" aria-hidden="true">
              <div className="signup-plan-skeleton" />
              <div className="signup-plan-skeleton" />
              <div className="signup-plan-skeleton" />
            </div>
          )}
          {plansError && <p className="signup-form-error" role="alert">{plansError}</p>}
          {!plansLoading && !plansError && plans.length === 0 && (
            <p className="signup-empty">No plans are available right now. Please check back soon.</p>
          )}

          {!plansLoading && plans.length > 0 && (
            <div className="signup-plan-list" role="radiogroup" aria-label="Pricing plans">
              {plans.map((plan) => {
                const selected = plan.id === selectedPlanId;
                const amount = priceAmount(plan);
                return (
                  <button
                    type="button"
                    key={plan.id}
                    role="radio"
                    aria-checked={selected}
                    className={
                      'signup-plan-card' +
                      (selected ? ' is-selected' : '') +
                      (plan.featured ? ' is-featured' : '')
                    }
                    onClick={() => selectPlan(plan.id)}
                  >
                    <span className="signup-plan-card__radio" aria-hidden="true" />
                    <div className="signup-plan-card__head">
                      <div>
                        <span className="signup-plan-card__name">{plan.name}</span>
                        {plan.featured && <span className="signup-plan-card__badge">Popular</span>}
                      </div>
                      {amount && (
                        <span className="signup-plan-card__price">
                          {amount} <span>{freqLabel(plan)}</span>
                        </span>
                      )}
                    </div>
                    {plan.shortDescription && (
                      <p className="signup-plan-card__desc">{plan.shortDescription}</p>
                    )}
                    {plan.freeTrialDays ? (
                      <p className="signup-plan-card__trial">{plan.freeTrialDays}-day free trial</p>
                    ) : null}
                    {plan.features?.length > 0 && (
                      <ul className="signup-plan-card__features">
                        {plan.features.slice(0, 6).map((f, idx) => (
                          <li key={idx}>{f}</li>
                        ))}
                      </ul>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <button
            type="button"
            className="signup-submit"
            onClick={goToDetails}
            disabled={!selectedPlanId}
          >
            Continue
          </button>
        </div>
      )}

      {step === 'details' && (
        <form className="signup-form signup-step-panel" key="details" onSubmit={submitDetails} noValidate>
          {selectedPlan && (
            <p className="signup-step-lede">
              Setting up <strong>{selectedPlan.name}</strong>
              {formatPrice(selectedPlan) ? ` \u2014 ${formatPrice(selectedPlan)}` : ''}
            </p>
          )}
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
              <p className="signup-field-error" id="err-companyName" role="alert">{fieldErrors.companyName}</p>
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
                <p className="signup-field-error" id="err-firstName" role="alert">{fieldErrors.firstName}</p>
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
                <p className="signup-field-error" id="err-lastName" role="alert">{fieldErrors.lastName}</p>
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
              <p className="signup-field-error" id="err-email" role="alert">{fieldErrors.email}</p>
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
                <p className="signup-field-error" id="err-password" role="alert">{fieldErrors.password}</p>
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
                <p className="signup-field-error" id="err-confirmPassword" role="alert">{fieldErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          {formError && <p className="signup-form-error" role="alert">{formError}</p>}

          <div className="signup-actions">
            <button type="button" className="signup-back" onClick={() => setStep('plan')}>
              Back
            </button>
            <button type="submit" className="signup-submit signup-submit--inline">
              Continue to payment
            </button>
          </div>
        </form>
      )}

      {step === 'pay' && (
        <div className="signup-step-panel" key="pay">
          <p className="signup-step-lede">Review your plan and confirm to create your account.</p>
          <div className="signup-pay-summary">
            <div className="signup-pay-summary__row">
              <span>Plan</span>
              <strong>{selectedPlan?.name}</strong>
            </div>
            {formatPrice(selectedPlan) && (
              <div className="signup-pay-summary__row">
                <span>Price</span>
                <strong>{formatPrice(selectedPlan)}</strong>
              </div>
            )}
            {selectedPlan?.freeTrialDays ? (
              <div className="signup-pay-summary__row">
                <span>Trial</span>
                <strong>{selectedPlan.freeTrialDays} days free</strong>
              </div>
            ) : null}
          </div>

          <div className="signup-pay-note">
            <svg className="signup-pay-note__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2.5" y="5" width="19" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M2.5 9.5h19" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            <div>
              <p className="signup-pay-note__title">Payment coming soon</p>
              <p className="signup-pay-note__text">
                Online payment isn&rsquo;t connected yet. Continue to create your account and your plan
                will be reserved. We&rsquo;ll collect payment once checkout is live.
              </p>
            </div>
          </div>

          {formError && <p className="signup-form-error" role="alert">{formError}</p>}

          <div className="signup-actions">
            <button
              type="button"
              className="signup-back"
              onClick={() => setStep('details')}
              disabled={submitting}
            >
              Back
            </button>
            <button
              type="button"
              className="signup-submit signup-submit--inline"
              onClick={submitSignup}
              disabled={submitting}
            >
              {submitting ? 'Creating account\u2026' : 'Create company account'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupForm;
