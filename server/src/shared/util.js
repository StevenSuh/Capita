const { ValidationError } = require('@src/shared/error');

/**
 * Common validator for validating one of required fields in a proto.
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
  validateOneOfFields,
  validateRequiredFields,
};
