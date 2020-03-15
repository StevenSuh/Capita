import express from 'express';
import connect from 'shared/db';
import proto from 'shared/proto';

import { DatabaseError } from '@src/shared/error';

import { handleUpdateProfile, registerUpdateProfileRoute } from '..';

const { UpdateProfileRequest, UpdateProfileResponse } = proto.server.profile;

// Constants
const SESSION = { userId: 1 };

// Mocks
jest.mock('../validator', () => () => {});
jest.mock('shared/db', () => {
  const models = { Profile: { update: jest.fn() } };
  return () => Promise.resolve(models);
});
jest.mock('@src/middleware', () => ({ verifyAuth: 'verifyAuth' }));

describe('UpdateProfile', () => {
  describe('handleUpdateProfile', () => {
    beforeEach(async () => {
      await setUpProfileUpdate(0);
    });

    test('returns response', async () => {
      // Arrange
      await setUpProfileUpdate(1);

      // Act
      const response = await handleUpdateProfile(
        {
          id: 123,
          name: 'Steven',
          accountIds: [456],
        },
        SESSION,
      );

      // Assert
      const expectedResponse = {};
      expect(response).toEqual(expectedResponse);
    });

    test('throws if failed to update', async () => {
      // Arrange
      const request = { id: 123 };
      await setUpProfileUpdate(0);

      // Act & Assert
      await expect(handleUpdateProfile(request, SESSION)).rejects.toThrow(
        new DatabaseError(
          `An error has occurred while updating profile ${JSON.stringify(
            request,
          )}`,
        ),
      );
    });

    describe('query mask', () => {
      test('includes name', async () => {
        // Arrange
        const name = 'Steven';
        const profileId = 123;

        const whereQuery = { id: profileId, userId: SESSION.userId };
        const expectedUpdate = { name };

        setUpProfileUpdate(1);

        // Act
        await handleUpdateProfile(
          {
            id: profileId,
            name,
          },
          SESSION,
        );

        // Assert
        const updateMock = await getUpdateMockFunction();
        expect(updateMock).toHaveBeenCalledWith(whereQuery, expectedUpdate);
      });

      test('includes account ids', async () => {
        // Arrange
        const profileId = 123;
        const accountId = 456;

        const whereQuery = { id: profileId, userId: SESSION.userId };
        const expectedUpdate = { accountIdsStr: `${accountId}` };

        setUpProfileUpdate(1);

        // Act
        await handleUpdateProfile(
          {
            id: profileId,
            accountIds: [accountId],
          },
          SESSION,
        );

        // Assert
        const updateMock = await getUpdateMockFunction();
        expect(updateMock).toHaveBeenCalledWith(whereQuery, expectedUpdate);
      });
    });
  });

  describe('registerUpdateProfileRoute', () => {
    test('maps to correct route', () => {
      // Arrange
      const postMock = jest.fn();
      const app = express();
      app.post = postMock;

      // Act
      registerUpdateProfileRoute(app);

      // Assert
      const args = postMock.mock.calls[0];
      const [route, middleware] = args;

      expect(route).toBe('/api/profile/update-profile');
      expect(middleware).toBe('verifyAuth');
    });

    test('maps to correct callback', async () => {
      // Arrange
      const postMock = jest.fn();
      const app = express();
      app.post = postMock;

      const req = {
        raw: UpdateProfileRequest.encode({
          id: 123,
          name: 'Steven',
          accountIds: [456],
        }).finish(),
        session: SESSION,
      };
      const res = { send: jest.fn() };
      const expectedResponseBuffer = UpdateProfileResponse.encode({}).finish();

      // Act
      registerUpdateProfileRoute(app);

      const callback = postMock.mock.calls[0][2];
      await callback(req, res);

      // Assert
      const actualResponseBuffer = res.send.mock.calls[0][0];
      expect(actualResponseBuffer).toEqual(expectedResponseBuffer);
    });
  });
});

/**
 * Setup Profile.update
 *
 * @param rowCount - Number of rows affected.
 */
async function setUpProfileUpdate(rowCount: number) {
  const { Profile } = await connect();
  (Profile.update as jest.Mock).mockResolvedValue({ affected: rowCount });
}

async function getUpdateMockFunction() {
  const { Profile } = await connect();
  return Profile.update as jest.Mock;
}
