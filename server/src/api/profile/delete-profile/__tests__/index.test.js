const {
  DeleteProfileRequest,
  DeleteProfileResponse,
} = require('shared/proto').server.profile;

const { Profile } = require('@src/db/models');

const { handleDeleteProfile, registerDeleteProfileRoute } = require('..');

// Mocks
jest.mock('../validator', () => () => {});
jest.mock('@src/db/models', () => {
  return {
    Profile: {
      destroy: jest.fn(),
    },
  };
});
jest.mock('@src/middleware', () => ({ verifyAuth: 'verifyAuth' }));

describe('DeleteProfile', () => {
  /**
   * Gets the first argument of most recent call to Profile.destroy.
   *
   * @returns {object} - query called to Profile.destroy.
   */
  function getProfileDestroyArg() {
    return Profile.destroy.mock.calls[0][0];
  }

  beforeAll(() => {
    Profile.destroy.mockReturnValue(Promise.resolve());
  });

  describe('handleDeleteProfile', () => {
    test('returns response', async () => {
      // Act
      const response = await handleDeleteProfile({
        id: 123,
      });

      // Assert
      expect(response).toEqual({});
    });

    test('calls Profile.destroy with correct args', async () => {
      // Arrange
      const queryId = 123;

      // Act
      await handleDeleteProfile({ id: queryId });

      // Assert
      const expectedQuery = { where: { id: queryId } };
      expect(getProfileDestroyArg()).toEqual(expectedQuery);
    });
  });

  describe('registerDeleteProfileRoute', () => {
    test('maps to correct route', () => {
      // Arrange
      const app = { post: jest.fn() };

      // Act
      registerDeleteProfileRoute(app);

      // Assert
      const [route, middleware] = app.post.mock.calls[0];
      expect(route).toBe('/api/profile/delete-profile');
      expect(middleware).toBe('verifyAuth');
    });

    test('maps to correct callback', async () => {
      // Arrange
      const app = { post: jest.fn() };
      const req = {
        raw: DeleteProfileRequest.encode({ id: 123 }).finish(),
      };
      const res = { send: jest.fn() };

      const expectedResponseBuffer = DeleteProfileResponse.encode({}).finish();

      // Act
      registerDeleteProfileRoute(app);

      const callback = app.post.mock.calls[0][2];
      await callback(req, res);

      // Assert
      const actualResponseBuffer = res.send.mock.calls[0][0];
      expect(actualResponseBuffer).toEqual(expectedResponseBuffer);
    });
  });
});
