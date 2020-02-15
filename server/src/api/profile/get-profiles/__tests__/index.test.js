const { Profile } = require('@src/db/models');

const { convertProfileToProto } = require('../../util');
const { handleGetProfiles, registerGetProfilesRoute } = require('..');

// Constants
const USER_ID = 1;

// Mocks
jest.mock('../validator', () => () => {});
jest.mock('@src/db/models', () => {
  return {
    Profile: {
      findAll: jest.fn(),
    },
  };
});
jest.mock('@src/middleware', () => ({ verifyAuth: 'verifyAuth' }));

describe('GetProfiles', () => {
  /**
   * Setup Profile.findAll
   *
   * @param {number} userId - User id provided from SessionToken.
   * @param {object[]} profiles - List of queried profiles.
   */
  function setUpProfileFindAll(userId, profiles) {
    Profile.findAll.mockImplementation(query => {
      if (query.where.userId !== userId) {
        return Promise.resolve([]);
      }
      return Promise.resolve(profiles);
    });
  }

  describe('handleGetProfiles', () => {
    beforeEach(() => {
      setUpProfileFindAll(USER_ID, []);
    });

    test('returns response', async () => {
      // Arrange
      const profile = {
        id: 2,
        name: 'personal',
        accountIds: [3, 4],
      };
      setUpProfileFindAll(USER_ID, [profile]);

      // Act
      const response = await handleGetProfiles({}, { userId: USER_ID });

      // Assert
      const expectedResponse = { profiles: [convertProfileToProto(profile)] };
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('registerGetProfilesRoute', () => {
    test('maps to correct route', () => {
      // Arrange
      const app = { post: jest.fn() };

      // Act
      registerGetProfilesRoute(app);

      // Assert
      const args = app.post.mock.calls[0];
      const [route, middleware] = args;

      expect(route).toBe('/api/profile/get-profiles');
      expect(middleware).toBe('verifyAuth');
    });
  });
});
