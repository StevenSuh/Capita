const {
  GetProfilesRequest,
} = require('shared/proto').server.profile;

const { ValidationError } = require('@src/shared/error');

const validate = require('../validator');

describe('GetProfiles validator', () => {
  test('instaceof succeeds', () => {
    // Arrange
    const request = GetProfilesRequest.create({});

    // Act & Assert
    expect(() => validate(request)).not.toThrow();
  });

  test('instaceof fails', () => {
    // Arrange
    const request = {};

    // Act & Assert
    expect(() => validate(request)).toThrow(
      new ValidationError(
        'Request {} is not an instance of GetProfilesRequest',
      ),
    );
  });
});
