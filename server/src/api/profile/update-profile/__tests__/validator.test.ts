import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';
import { validateOneOfFields, validateRequiredFields } from '@src/shared/util';

import validate from '../validator';

const { UpdateProfileRequest } = proto.server.profile;

// Mocks
jest.mock('@src/shared/util', () => ({
  validateRequiredFields: jest.fn(),
  validateOneOfFields: jest.fn(),
}));

describe('UpdateProfile validator', () => {
  describe('instanceof', () => {
    test('succeeds', () => {
      // Arrange
      const request = UpdateProfileRequest.create({});

      // Act & Assert
      expect(() => validate(request)).not.toThrow();
    });

    test('fails', () => {
      // Arrange
      const request = {};

      // Act & Assert
      expect(() => validate(request)).toThrow(
        new ValidationError(
          'Request {} is not an instance of UpdateProfileRequest',
        ),
      );
    });
  });

  test('required fields', () => {
    // Arrange
    const request = UpdateProfileRequest.create({});
    const mockValidateRequiredFields = validateRequiredFields as jest.Mock;

    // Act
    validate(request);

    // Assert
    const [
      actualRequest,
      actualFields,
    ] = mockValidateRequiredFields.mock.calls[0];
    expect(actualRequest).toEqual(request);
    expect(actualFields).toEqual(['id']);
  });

  test('one of required fields', () => {
    // Arrange
    const request = UpdateProfileRequest.create({});
    const mockValidateOneOfFields = validateOneOfFields as jest.Mock;

    // Act
    validate(request);

    // Assert
    const [actualRequest, actualFields] = mockValidateOneOfFields.mock.calls[0];
    expect(actualRequest).toEqual(request);
    expect(actualFields).toEqual(['name', 'accountIds']);
  });
});
