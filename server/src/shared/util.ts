import { ValidationError } from '@src/shared/error';

/**
 * Common validator for validating one of required fields in a proto.
 *
 * @param proto - Proto object.
 * @param fields - Array of field names.
 * @throws {ValidationError} - Thrown if all fields are missing.
 */
export function validateOneOfFields(proto: object, fields: string[]) {
  let valid = false;
  fields.forEach(field => {
    // @ts-ignore: Any proto object.
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
 * @param proto - Proto object.
 * @param fields - Array of field names to require.
 * @throws {ValidationError} - Thrown if a field is missing.
 */
export function validateRequiredFields(proto: object, fields: string[]) {
  fields.forEach(field => {
    // @ts-ignore: Any proto object.
    if (!proto[field]) {
      throw new ValidationError(`${field} is required in ${proto.constructor}`);
    }
  });
}

export function createExcludedKeys(obj: object) {
  // 'excluded' keyword is supported by psql and sqlite.
  return Object.keys(obj)
    .map(key => `"${key}" = excluded."${key}"`)
    .join(',');
}
