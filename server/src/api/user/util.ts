import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import proto from 'shared/proto';

import { secretKey } from '@src/config';
import { ValidationError } from '@src/shared/error';

const SALT_ROUNDS = 10;
const THIRTY_DAYS = 60 * 60 * 24 * 30;

/* eslint-disable */
const EMAIL_REGEX = new RegExp(
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
);
/* eslint-enable */
const MIN_PASSWORD_LENGTH = 5;

/**
 * Compare the stored hash and requested plain-text password.
 *
 * @param hashedUserPw - The stored hash of the user's password.
 * @param requestPw - Plain-text request password.
 * @returns isEqual - True if equal.
 */
export async function confirmPassword(hashedUserPw: string, requestPw: string) {
  const isEqual = await bcrypt.compare(requestPw, hashedUserPw);
  return isEqual;
}

/**
 * Create session token that expires in 30 days.
 *
 * @param sessionToken - Token proto that contains user_id.
 * @returns - Token that is to be sent along with every HTTP request from logged-in user.
 */
export function createSessionToken(sessionToken: proto.server.ISessionToken) {
  return jwt.sign({ userId: sessionToken.userId }, secretKey, {
    expiresIn: THIRTY_DAYS,
  });
}

/**
 * Encrypts a given password into a hash.
 *
 * @param password - Plain-text password.
 * @returns - Hashed password.
 */
export async function encryptPassword(password: string) {
  const hashedPw = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPw;
}

/**
 * Validate an email address string.
 *
 * @param email - Email address.
 */
export function validateEmail(email: string) {
  if (!EMAIL_REGEX.test(email)) {
    throw new ValidationError('Invalid email format');
  }
}

/**
 * Validate a plain-text password string.
 *
 * @param password - Plain-text password.
 */
export function validatePassword(password: string) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new ValidationError('Invalid password format');
  }
  // TODO: add more validation.
}
