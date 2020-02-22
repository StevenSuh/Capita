const {
  CreateProfileRequest,
  CreateProfileResponse,
} = require('shared/proto').server.profile;

const { Profile } = require('@src/db/models');

const { handleCreateProfile, registerCreateProfileRoute } = require('..');

// Constants
const PROFILE = {
  id: 1,
  name: 'Steven',
  accountIds: [456],
};
const REQUEST = {
  name: PROFILE.name,
  accountIds: PROFILE.accountIds,
};
const RESPONSE = {
  profile: {
    id: PROFILE.id,
    name: PROFILE.name,
    accountIds: PROFILE.accountIds,
  },
};
const SESSION = { userId: 123 };

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
      const response = await handleCreateProfile(REQUEST, SESSION);

      // Assert
      expect(response).toEqual(RESPONSE);
    });
  });

  describe('registerCreateProfileRoute', () => {
    test('maps to correct route', () => {
      // Arrange
      const app = { post: jest.fn() };

      // Act
      registerCreateProfileRoute(app);

      // Assert
      const [route, middleware] = app.post.mock.calls[0];
      expect(route).toBe('/api/profile/create-profile');
      expect(middleware).toBe('verifyAuth');
    });

    test('maps to correct callback', async () => {
      // Arrange
      const app = { post: jest.fn() };
      const req = {
        raw: CreateProfileRequest.encode(REQUEST).finish(),
        session: SESSION,
      };
      const res = { send: jest.fn() };
      const expectedResponseBuffer = CreateProfileResponse.encode(
        RESPONSE,
      ).finish();

      // Act
      registerCreateProfileRoute(app);

      const callback = app.post.mock.calls[0][2];
      await callback(req, res);

      // Assert
      const actualResponseBuffer = res.send.mock.calls[0][0];
      expect(actualResponseBuffer).toEqual(expectedResponseBuffer);
    });
  });
});
