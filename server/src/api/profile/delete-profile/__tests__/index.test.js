const { Profile } = require('@src/db/models');
const { obfuscateId } = require('@src/shared/util');

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
        obfuscatedId: obfuscateId(123),
      });

      // Assert
      expect(response).toEqual({});
    });

    test('calls Profile.destroy with correct args', async () => {
      // Arrange
      const queryId = 123;

      // Act
      await handleDeleteProfile({ obfuscatedId: obfuscateId(queryId) });

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
      const args = app.post.mock.calls[0];
      const [route, middleware] = args;

      expect(route).toBe('/api/profile/delete-profile');
      expect(middleware).toBe('verifyAuth');
    });
  });
});
