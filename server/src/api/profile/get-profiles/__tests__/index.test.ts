import express from 'express';
import connect from 'shared/db';
import { Profile } from 'shared/db/entity/Profile';
import { encodeArrayIdsToStr } from 'shared/db/util';
import proto from 'shared/proto';
import { In, Like } from 'typeorm';

import { convertProfileToProto } from '../../util';
import { handleGetProfiles, registerGetProfilesRoute } from '..';

const { GetProfilesRequest, GetProfilesResponse } = proto.server.profile;

// Constants
const USER_ID = 1;

// Mocks
jest.mock('../validator', () => () => {});
jest.mock('shared/db', () => {
  const models = { Profile: { find: jest.fn() } };
  return () => Promise.resolve(models);
});
jest.mock('@src/middleware', () => ({ verifyAuth: 'verifyAuth' }));

describe('GetProfiles', () => {
  beforeEach(async () => {
    await setUpProfileFindAll([]);
  });

  describe('handleGetProfiles', () => {
    test('returns response for default request', async () => {
      // Arrange
      const profile = new Profile();
      Object.assign(profile, {
        id: 2,
        name: 'personal',
        accountIdsStr: encodeArrayIdsToStr([3, 4]),
      });

      await setUpProfileFindAll([profile]);

      // Act
      const response = await handleGetProfiles({}, { userId: USER_ID });

      // Assert
      const expectedResponse = { profiles: [convertProfileToProto(profile)] };
      const expectedQuery = { where: [{ userId: USER_ID }] };
      const findMock = await getProfileFindMock();

      expect(response).toEqual(expectedResponse);
      expect(findMock).toHaveBeenCalledWith(expectedQuery);
    });

    test('returns response for request with profile_ids', async () => {
      // Arrange
      const profile = new Profile();
      Object.assign(profile, {
        id: 2,
        name: 'personal',
        accountIdsStr: encodeArrayIdsToStr([3, 4]),
      });
      const profileIds = [1, 2, 3];

      await setUpProfileFindAll([profile]);

      // Act
      const response = await handleGetProfiles(
        { profileIds },
        { userId: USER_ID },
      );

      // Assert
      const expectedResponse = { profiles: [convertProfileToProto(profile)] };
      const expectedQuery = {
        where: [{ userId: USER_ID, id: In(profileIds) }],
      };
      const findMock = await getProfileFindMock();

      expect(response).toEqual(expectedResponse);
      expect(findMock).toHaveBeenCalledWith(expectedQuery);
    });

    test('returns response for request with account_ids', async () => {
      // Arrange
      const profile = new Profile();
      Object.assign(profile, {
        id: 2,
        name: 'personal',
        accountIdsStr: encodeArrayIdsToStr([3, 4]),
      });
      const accountIds = [1, 2];

      await setUpProfileFindAll([profile]);

      // Act
      const response = await handleGetProfiles(
        { accountIds },
        { userId: USER_ID },
      );

      // Assert
      const expectedResponse = { profiles: [convertProfileToProto(profile)] };
      const expectedQuery = {
        where: accountIds.map(accountId => ({
          accountIdsStr: Like(`%${accountId}%`),
          userId: USER_ID,
        })),
      };
      const findMock = await getProfileFindMock();

      expect(response).toEqual(expectedResponse);
      expect(findMock).toHaveBeenCalledWith(expectedQuery);
    });
  });

  describe('registerGetProfilesRoute', () => {
    test('maps to correct route', () => {
      // Arrange
      const postMock = jest.fn();
      const app = express();
      app.post = postMock;

      // Act
      registerGetProfilesRoute(app);

      // Assert
      const args = postMock.mock.calls[0];
      const [route, middleware] = args;

      expect(route).toBe('/api/profile/get-profiles');
      expect(middleware).toBe('verifyAuth');
    });

    test('maps to correct callback', async () => {
      // Arrange
      const postMock = jest.fn();
      const app = express();
      app.post = postMock;

      const req = {
        raw: GetProfilesRequest.encode({}).finish(),
        session: { userId: USER_ID },
      };
      const res = { send: jest.fn() };

      const expectedResponseBuffer = GetProfilesResponse.encode({
        profiles: [],
      }).finish();

      // Act
      registerGetProfilesRoute(app);

      const callback = postMock.mock.calls[0][2];
      await callback(req, res);

      // Assert
      const actualResponseBuffer = res.send.mock.calls[0][0];
      expect(actualResponseBuffer).toEqual(expectedResponseBuffer);
    });
  });
});

/**
 * Setup Profile.findAll
 *
 * @param profiles - List of queried profiles.
 */
async function setUpProfileFindAll(profiles: Profile[]) {
  const { Profile } = await connect();
  (Profile.find as jest.Mock).mockResolvedValue(profiles);
}

async function getProfileFindMock() {
  const { Profile } = await connect();
  return Profile.find as jest.Mock;
}
