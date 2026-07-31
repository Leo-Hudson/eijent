import * as yup from 'yup';

/**
 * Account name becomes the member subdomain (DNS label):
 * lowercase a–z, digits 0–9, hyphens; must start and end with alphanumeric; max 63.
 */
export const ACCOUNT_NAME_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export const ACCOUNT_NAME_MAX = 63;

export const ACCOUNT_NAME_FORMAT_ERROR =
  'Account name may contain only lowercase letters (a–z), numbers (0–9), and hyphens (-). Spaces and special characters are not allowed.';

export const ACCOUNT_NAME_HINT =
  'Lowercase letters, numbers, and hyphens only (max 63). This becomes your subdomain.';

export const ACCOUNT_NAME_IN_USE = 'Account name is already in use.';

export const normalizeAccountNameInput = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, ACCOUNT_NAME_MAX);

export const accountNameSchema = yup
  .string()
  .transform((value) => normalizeAccountNameInput(value).replace(/^-+|-+$/g, ''))
  .required('*Required field')
  .max(ACCOUNT_NAME_MAX, ACCOUNT_NAME_FORMAT_ERROR)
  .matches(ACCOUNT_NAME_RE, ACCOUNT_NAME_FORMAT_ERROR);
