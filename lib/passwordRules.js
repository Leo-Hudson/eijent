/** Allowed special characters for signup passwords. */
export const PASSWORD_SPECIAL = '!@#$%^&*-_';

export const PASSWORD_COMPLEXITY_ERROR =
  'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (allowed: ! @ # $ % ^ & * - _). Minimum 8 characters.';

/** Min 8; at least one upper, lower, digit, and allowed special. */
export const PASSWORD_COMPLEXITY_RE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*\-_]).{8,}$/;

export const isPasswordComplex = (value) => PASSWORD_COMPLEXITY_RE.test(String(value || ''));
