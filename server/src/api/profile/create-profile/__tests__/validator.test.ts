import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';
import { validateRequiredFields } from '@src/shared/util';

import validate from '../validator';

const { CreateProfileRequest } = proto.server.profile;

// Mocks
jest.mock('@src/shared/util', () => ({
  validateRequiredFields: jest.fn(),
  validateOneOfFields: jest.fn(),
}));

describe('CreateProfile validator', () => {
  describe('instanceof', () => {
    test('succeeds', () => {
      // Arrange
      const request = CreateProfileRequest.create({});

      // Act & Assert
      expect(() => validate(request)).not.toThrow();
    });

    test('fails', () => {
      // Arrange
      const request = {};

      // Act & Assert
      expect(() => validate(request)).toThrow(
        new ValidationError(
          'Request {} is not an instance of CreateProfileRequest',
        ),
      );
    });
  });

  test('required fields', () => {
    // Arrange
    const request = CreateProfileRequest.create({});
    const mockValidateRequiredFields = validateRequiredFields as jest.Mock;

    // Act
    validate(request);

    // Assert
    const [
      actualRequest,
      actualFields,
    ] = mockValidateRequiredFields.mock.calls[0];
    expect(actualRequest).toEqual(request);
    expect(actualFields).toEqual(['name', 'accountIds']);
  });
});
