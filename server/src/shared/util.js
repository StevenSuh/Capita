const { ValidationError } = require('@src/shared/error');

/**
 * Obufscate a given string.
 *
 * @param {string} arg - string argument.
 * @returns {string} - Base64 encoded string.
 */
function obfuscate(arg) {
  return Buffer.from(arg).toString('base64');
}

/**
 * Obfuscate a given id.
 *
 * @param {number} id - number argument.
 * @returns {string} - Base64 encoded id string.
 */
function obfuscateId(id) {
  return obfuscate(String(id));
}

/**
 * Unobfuscate a given string.
 *
 * @param {string} arg - Base64 encoded string.
 * @returns {string} - Decoded string.
 */
function unobfuscate(arg) {
  return Buffer.from(arg, 'base64').toString();
}

/**
 * Unobfuscate a given id.
 *
 * @param {string} obfuscatedId - Base64 encoded id string.
 * @returns {string} - Decoded id.
 */
function unobfuscateId(obfuscatedId) {
  return parseInt(unobfuscate(obfuscatedId), 10);
}

/**
 * Common validator for validating one of the given fields is present in a proto.
 *
 * @param {object} proto - Proto object.
 * @param {string[]} fields - Array of field names.
 * @throws {ValidationError} - Thrown if all fields are missing.
 */
function validateOneOfFields(proto, fields) {
  let valid = false;
  fields.forEach(field => {
    if (proto[field]) {
      valid = true;
    }
  });

  if (!valid) {
    throw new ValidationError(
      `One of ${fields} is required in ${proto.constructor}`,
    );
  }
}

/**
 * Common validator for validating required fields in a proto.
 *
 * @param {object} proto - Proto object.
 * @param {string[]} fields - Array of field names to require.
 * @throws {ValidationError} - Thrown if a field is missing.
 */
function validateRequiredFields(proto, fields) {
  fields.forEach(field => {
    if (!proto[field]) {
      throw new ValidationError(`${field} is required in ${proto.constructor}`);
    }
  });
}

module.exports = {
  obfuscateId,
  unobfuscateId,
  validateOneOfFields,
  validateRequiredFields,
};
