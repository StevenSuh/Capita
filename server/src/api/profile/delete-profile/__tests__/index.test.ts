import express from 'express';
import connect from 'shared/db';
import proto from 'shared/proto';

import { handleDeleteProfile, registerDeleteProfileRoute } from '..';

const { DeleteProfileRequest, DeleteProfileResponse } = proto.server.profile;

// Constants
const SESSION = { userId: 456 };

// Mocks
jest.mock('../validator', () => () => {});
jest.mock('shared/db', () => {
  const models = { Profile: { delete: jest.fn() } };
  return () => Promise.resolve(models);
});
jest.mock('@src/middleware', () => ({ verifyAuth: 'verifyAuth' }));

describe('DeleteProfile', () => {
  /**
   * Gets the first argument of most recent call to Profile.destroy.
   *
   * @returns - query called to Profile.destroy.
   */
  async function getProfileDestroyArg() {
    const { Profile } = await connect();
    return (Profile.delete as jest.Mock).mock.calls[0][0];
  }

  beforeAll(async () => {
    const { Profile } = await connect();
    (Profile.delete as jest.Mock).mockReturnValue(Promise.resolve());
  });

  describe('handleDeleteProfile', () => {
    test('returns response', async () => {
      // Act
      const response = await handleDeleteProfile(
        {
          id: 123,
        },
        SESSION,
      );

      // Assert
      expect(response).toEqual({});
    });

    test('calls Profile.destroy with correct args', async () => {
      // Arrange
      const queryId = 123;

      // Act
      await handleDeleteProfile({ id: queryId }, SESSION);

      // Assert
      const expectedQuery = { id: queryId, userId: SESSION.userId };
      const actualQuery = await getProfileDestroyArg();
      expect(actualQuery).toEqual(expectedQuery);
    });
  });

  describe('registerDeleteProfileRoute', () => {
    test('maps to correct route', () => {
      // Arrange
      const postMock = jest.fn();
      const app = express();
      app.post = postMock;

      // Act
      registerDeleteProfileRoute(app);

      // Assert
      const [route, middleware] = postMock.mock.calls[0];
      expect(route).toBe('/api/profile/delete-profile');
      expect(middleware).toBe('verifyAuth');
    });

    test('maps to correct callback', async () => {
      // Arrange
      const postMock = jest.fn();
      const app = express();
      app.post = postMock;

      const req = {
        raw: DeleteProfileRequest.encode({ id: 123 }).finish(),
        session: SESSION,
      };
      const res = { send: jest.fn() };

      const expectedResponseBuffer = DeleteProfileResponse.encode({}).finish();

      // Act
      registerDeleteProfileRoute(app);

      const callback = postMock.mock.calls[0][2];
      await callback(req, res);

      // Assert
      const actualResponseBuffer = res.send.mock.calls[0][0];
      expect(actualResponseBuffer).toEqual(expectedResponseBuffer);
    });
  });
});
