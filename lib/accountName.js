import * as yup from 'yup';

/**
 * Account name becomes the member subdomain, so keep it DNS-label safe:
 * lowercase letters, numbers, hyphens only; no spaces or special characters.
 */
export const ACCOUNT_NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const ACCOUNT_NAME_MIN = 3;
export const ACCOUNT_NAME_MAX = 30;

export const ACCOUNT_NAME_HINT =
  'Use 3–30 characters: lowercase letters, numbers, and hyphens only. No spaces. This becomes your subdomain.';

export const normalizeAccountNameInput = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-');

export const accountNameSchema = yup
  .string()
  .transform((value) => normalizeAccountNameInput(value).replace(/^-+|-+$/g, ''))
  .required('Account name is required.')
  .min(ACCOUNT_NAME_MIN, `Account name must be at least ${ACCOUNT_NAME_MIN} characters.`)
  .max(ACCOUNT_NAME_MAX, `Account name must be at most ${ACCOUNT_NAME_MAX} characters.`)
  .matches(
    ACCOUNT_NAME_RE,
    'Account name can only use lowercase letters, numbers, and hyphens (no spaces).',
  );
