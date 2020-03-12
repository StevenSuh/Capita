import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';

import validate from '../validator';

const { GetProfilesRequest } = proto.server.profile;

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
