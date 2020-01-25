const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { secretKey } = require('@src/config');
const { ValidationError } = require('@src/shared/error');

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
 * @param {string} hashedUserPw - The stored hash of the user's password.
 * @param {string} requestPw - Plain-text request password.
 * @returns {boolean} isEqual - True if equal.
 */
async function confirmPassword(hashedUserPw, requestPw) {
  const isEqual = await bcrypt.compare(requestPw, hashedUserPw);
  return isEqual;
}

/**
 * Create session token that expires in 30 days.
 *
 * @param {string} sessionToken - Token proto that contains user_id.
 * @returns {string} - Token that is to be sent along with every HTTP request from logged-in user.
 */
function createSessionToken(sessionToken) {
  return jwt.sign({ userId: sessionToken.userId }, secretKey, {
    expiresIn: THIRTY_DAYS,
  });
}

/**
 * Encrypts a given password into a hash.
 *
 * @param {string} password - Plain-text password.
 * @returns {string} - Hashed password.
 */
async function encryptPassword(password) {
  const hashedPw = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPw;
}

/**
 * Validate an email address string.
 *
 * @param {string} email - Email address.
 * @throws {ValidationError} - Thrown if invalid email.
 */
function validateEmail(email) {
  if (!EMAIL_REGEX.test(email)) {
    throw new ValidationError('Invalid email format');
  }
}

/**
 * Validate a plain-text password string.
 *
 * @param {string} password - Plain-text password.
 * @throws {ValidationError} - Thrown if invalid password.
 */
function validatePassword(password) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new ValidationError('Invalid password format');
  }
}

module.exports = {
  confirmPassword,
  createSessionToken,
  encryptPassword,
  validateEmail,
  validatePassword,
};
