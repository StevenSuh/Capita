const { Profile } = require('@src/db/models');
const { obfuscateId } = require('@src/shared/util');

const { handleCreateProfile, registerCreateProfileRoute } = require('..');

// Constants
const PROFILE = {
  id: 1,
  name: 'Steven',
  accountIds: [456],
};

// Mocks
jest.mock('../validator', () => () => {});
jest.mock('@src/db/models', () => {
  return {
    Profile: {
      create: jest.fn(),
    },
  };
});
jest.mock('@src/middleware', () => ({ verifyAuth: 'verifyAuth' }));

describe('CreateProfile', () => {
  /**
   * Setup Profile.create
   *
   * @param {object} profile - Profile object to return.
   */
  function setUpProfileCreate(profile) {
    Profile.create.mockReturnValue(Promise.resolve(profile));
  }

  describe('handleCreateProfile', () => {
    beforeEach(() => {
      setUpProfileCreate(PROFILE);
    });

    test('returns response', async () => {
      // Act
      const response = await handleCreateProfile({
        name: PROFILE.name,
        obfuscatedAccountIds: PROFILE.accountIds.map(obfuscateId),
      });

      // Assert
      const expectedResponse = {
        profile: {
          obfuscatedId: obfuscateId(PROFILE.id),
          name: PROFILE.name,
          obfuscatedAccountIds: PROFILE.accountIds.map(obfuscateId),
        },
      };
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('registerCreateProfileRoute', () => {
    test('maps to correct route', () => {
      // Arrange
      const app = { post: jest.fn() };

      // Act
      registerCreateProfileRoute(app);

      // Assert
      const args = app.post.mock.calls[0];
      const [route, middleware] = args;

      expect(route).toBe('/api/profile/create-profile');
      expect(middleware).toBe('verifyAuth');
    });
  });
});
