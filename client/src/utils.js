import { EMAIL_REGEX, PASSWORD_REGEX } from 'defs';

export const validateEmail = email =>
  email.match(EMAIL_REGEX);

export const validatePassword = password =>
  password.match(PASSWORD_REGEX);
