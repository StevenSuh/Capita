const {
  UpdateProfileRequest,
} = require('shared/proto/server/profile/update_profile').server.profile;

const { ValidationError } = require('@src/shared/error');
const {
  validateOneOfFields,
  validateRequiredFields,
} = require('@src/shared/util');

const validate = require('../validator');

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

    // Act
    validate(request);

    // Assert
    const [actualRequest, actualFields] = validateRequiredFields.mock.calls[0];
    expect(actualRequest).toEqual(request);
    expect(actualFields).toEqual(['obfuscatedId']);
  });

  test('one of required fields', () => {
    // Arrange
    const request = UpdateProfileRequest.create({});

    // Act
    validate(request);

    // Assert
    const [actualRequest, actualFields] = validateOneOfFields.mock.calls[0];
    expect(actualRequest).toEqual(request);
    expect(actualFields).toEqual(['name', 'accountIds']);
  });
});
