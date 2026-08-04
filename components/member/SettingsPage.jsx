'use client';

import React from 'react';
import MemberShell from '@/components/member/MemberShell';
import MemberErrorState from '@/components/member/MemberErrorState';
import LedgerSelect from '@/components/ledger/LedgerSelect';
import PasswordField from '@/components/PasswordField';
import { useMemberDashboard } from '@/hooks/useMemberDashboard';
import { isPasswordComplex, PASSWORD_COMPLEXITY_ERROR } from '@/lib/passwordRules';
import {
  DEFAULT_PHONE_COUNTRY,
  digitsOnly,
  formatPhoneForSubmit,
  PHONE_COUNTRIES,
  splitStoredPhone,
} from '@/lib/phoneCountries';

const PHONE_COUNTRY_OPTIONS = PHONE_COUNTRIES.map((c) => ({
  value: c.code,
  label: `${c.code} ${c.dial}`,
}));

function Loading() {
  return (
    <div className="dash-loading" aria-busy="true">
      <div className="dash-skeleton dash-skeleton--head" />
      <div className="dash-skeleton" />
    </div>
  );
}

function ProfileCard({ member }) {
  const initialPhone = splitStoredPhone(member?.phone);
  const [values, setValues] = React.useState({
    firstName: member?.firstName || '',
    lastName: member?.lastName || '',
    companyName: member?.companyName || '',
    phoneNational: initialPhone.national,
  });
  const [phoneCountry, setPhoneCountry] = React.useState(initialPhone.country);
  const [status, setStatus] = React.useState({ error: '', success: '' });
  const [saving, setSaving] = React.useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: name === 'phoneNational' ? digitsOnly(value) : value,
    }));
    setStatus({ error: '', success: '' });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ error: '', success: '' });

    if (!values.firstName.trim() || !values.lastName.trim() || !values.companyName.trim()) {
      setStatus({ error: 'Name and company are required.', success: '' });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          companyName: values.companyName.trim(),
          phone: formatPhoneForSubmit(phoneCountry, values.phoneNational),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        window.location.assign('/login?next=/dashboard/settings');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'We could not save your details.');
      setStatus({ error: '', success: data.message || 'Your details have been saved.' });
    } catch (err) {
      setStatus({ error: err.message || 'We could not save your details.', success: '' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="dash-card">
      <div className="dash-card__head">
        <h2 className="dash-card__title">Your details</h2>
      </div>

      <form className="settings-form" onSubmit={onSubmit} noValidate>
        <div className="signup-row">
          <div className="signup-field">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              value={values.firstName}
              onChange={onChange}
            />
          </div>
          <div className="signup-field">
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              value={values.lastName}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="signup-field">
          <label htmlFor="companyName">Company</label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            autoComplete="organization"
            value={values.companyName}
            onChange={onChange}
          />
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
                setStatus({ error: '', success: '' });
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
            />
          </div>
        </div>

        {status.error && (
          <p className="signup-form-error" role="alert">
            {status.error}
          </p>
        )}
        {status.success && (
          <p className="signup-form-note" role="status">
            {status.success}
          </p>
        )}

        <div className="settings-actions">
          <button type="submit" className="signup-submit signup-submit--inline" disabled={saving}>
            {saving ? 'Saving\u2026' : 'Save changes'}
          </button>
        </div>
      </form>
    </section>
  );
}

function PasswordCard() {
  const [values, setValues] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [status, setStatus] = React.useState({ error: '', success: '' });
  const [saving, setSaving] = React.useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setStatus({ error: '', success: '' });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ error: '', success: '' });

    if (!values.currentPassword) {
      setStatus({ error: 'Enter your current password.', success: '' });
      return;
    }
    if (!isPasswordComplex(values.newPassword)) {
      setStatus({ error: PASSWORD_COMPLEXITY_ERROR, success: '' });
      return;
    }
    if (values.newPassword !== values.confirmPassword) {
      setStatus({ error: 'New passwords do not match.', success: '' });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        window.location.assign('/login?next=/dashboard/settings');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'We could not update your password.');
      setValues({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setStatus({ error: '', success: data.message || 'Your password has been updated.' });
    } catch (err) {
      setStatus({ error: err.message || 'We could not update your password.', success: '' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="dash-card">
      <div className="dash-card__head">
        <h2 className="dash-card__title">Password</h2>
      </div>

      <form className="settings-form" onSubmit={onSubmit} noValidate>
        <PasswordField
          id="currentPassword"
          label="Current password"
          autoComplete="current-password"
          placeholder="Your current password"
          value={values.currentPassword}
          onChange={onChange}
        />

        <div className="signup-row">
          <PasswordField
            id="newPassword"
            label="New password"
            placeholder="Min 8 characters"
            value={values.newPassword}
            onChange={onChange}
          />
          <PasswordField
            id="confirmPassword"
            label="Confirm new password"
            placeholder="Repeat new password"
            value={values.confirmPassword}
            onChange={onChange}
          />
        </div>

        <p className="signup-field-hint">{PASSWORD_COMPLEXITY_ERROR}</p>

        {status.error && (
          <p className="signup-form-error" role="alert">
            {status.error}
          </p>
        )}
        {status.success && (
          <p className="signup-form-note" role="status">
            {status.success}
          </p>
        )}

        <div className="settings-actions">
          <button type="submit" className="signup-submit signup-submit--inline" disabled={saving}>
            {saving ? 'Updating\u2026' : 'Update password'}
          </button>
        </div>
      </form>
    </section>
  );
}

function AccountCard({ member }) {
  return (
    <section className="dash-card">
      <div className="dash-card__head">
        <h2 className="dash-card__title">Account</h2>
      </div>
      <dl className="settings-readonly">
        <div>
          <dt>Email</dt>
          <dd className="mono">{member?.email || '—'}</dd>
        </div>
        <div>
          <dt>Account name</dt>
          <dd className="mono">{member?.accountName || '—'}</dd>
        </div>
      </dl>
      <p className="settings-note">
        Your email is how you sign in and your account name identifies your workspace, so both are
        changed by our team. Email <a href="mailto:hello@eijent.app">hello@eijent.app</a> and we
        will take care of it.
      </p>
    </section>
  );
}

export default function SettingsPage() {
  const { loading, error, errorCode, data, reload } = useMemberDashboard();

  if (loading) {
    return (
      <MemberShell active="settings" member={null}>
        <Loading />
      </MemberShell>
    );
  }

  if (error) {
    return (
      <MemberShell
        active="settings"
        member={data?.member || null}
        offline={errorCode === 'core_unavailable'}
      >
        <MemberErrorState message={error} code={errorCode} onRetry={reload} />
      </MemberShell>
    );
  }

  const member = data?.member || null;

  return (
    <MemberShell active="settings" member={member}>
      <div className="dash">
        <header className="section-page-head">
          <h1 className="section-page-title">Settings</h1>
          <p className="section-page-sub">Update your profile details and your password.</p>
        </header>

        <ProfileCard key={member?.id || 'profile'} member={member} />
        <PasswordCard />
        <AccountCard member={member} />
      </div>
    </MemberShell>
  );
}
