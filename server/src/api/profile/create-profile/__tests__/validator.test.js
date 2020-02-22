const {
  CreateProfileRequest,
} = require('shared/proto').server.profile;

const { ValidationError } = require('@src/shared/error');
const { validateRequiredFields } = require('@src/shared/util');

const validate = require('../validator');

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

    // Act
    validate(request);

    // Assert
    const [actualRequest, actualFields] = validateRequiredFields.mock.calls[0];
    expect(actualRequest).toEqual(request);
    expect(actualFields).toEqual(['name', 'obfuscatedAccountIds']);
  });
});
