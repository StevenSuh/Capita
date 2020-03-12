import express, { Response } from 'express';
import connect from 'shared/db';
import { Profile } from 'shared/db/entity/Profile';
import { encodeArrayIdsToStr, decodeArrayIdsFromStr } from 'shared/db/util';
import proto from 'shared/proto';

import { handleCreateProfile, registerCreateProfileRoute } from '..';

const { CreateProfileRequest, CreateProfileResponse } = proto.server.profile;

// Constants
const PROFILE = new Profile();
Object.assign(PROFILE, {
  id: 1,
  name: 'Steven',
  accountIdsStr: encodeArrayIdsToStr([456]),
});
const REQUEST = {
  name: PROFILE.name,
  accountIds: decodeArrayIdsFromStr(PROFILE.accountIdsStr),
};
const RESPONSE = {
  profile: {
    id: PROFILE.id,
    name: PROFILE.name,
    accountIds: decodeArrayIdsFromStr(PROFILE.accountIdsStr),
  },
};
const SESSION = { userId: 123 };

// Mocks
jest.mock('../validator', () => () => {});
jest.mock('shared/db', () => {
  const models = { Profile: { create: jest.fn(), save: jest.fn() } };
  return () => Promise.resolve(models);
});
jest.mock('@src/middleware', () => ({ verifyAuth: 'verifyAuth' }));

describe('CreateProfile', () => {
  /**
   * Setup Profile.create
   *
   * @param profile - Profile object to return.
   */
  async function setUpProfileCreate(profile: Profile) {
    const { Profile } = await connect();
    (Profile.create as jest.Mock).mockReturnValue(profile);
    (Profile.save as jest.Mock).mockResolvedValue(profile);
  }

  describe('handleCreateProfile', () => {
    beforeEach(async () => {
      await setUpProfileCreate(PROFILE);
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
      const postMock = jest.fn();
      const app = express();
      app.post = postMock;

      // Act
      registerCreateProfileRoute(app);

      // Assert
      const [route, middleware] = postMock.mock.calls[0];
      expect(route).toBe('/api/profile/create-profile');
      expect(middleware).toBe('verifyAuth');
    });

    test('maps to correct callback', async () => {
      // Arrange
      const postMock = jest.fn();
      const app = express();
      app.post = postMock;

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

      const callback = postMock.mock.calls[0][2];
      await callback(req, res);

      // Assert
      const actualResponseBuffer = res.send.mock.calls[0][0];
      expect(actualResponseBuffer).toEqual(expectedResponseBuffer);
    });
  });
});
