const { Profile } = require('@src/db/models');
const { DatabaseError } = require('@src/shared/error');

const { handleUpdateProfile, registerUpdateProfileRoute } = require('..');

// Mocks
jest.mock('../validator', () => () => {});
jest.mock('@src/db/models', () => {
  return {
    Profile: {
      update: jest.fn(),
    },
  };
});
jest.mock('@src/middleware', () => ({ verifyAuth: 'verifyAuth' }));

describe('UpdateProfile', () => {
  /**
   * Setup Profile.update
   *
   * @param {number} rowCount - Number of rows affected.
   */
  function setUpProfileUpdate(rowCount) {
    Profile.update.mockReturnValue(Promise.resolve([rowCount]));
  }

  describe('handleUpdateProfile', () => {
    beforeEach(() => {
      setUpProfileUpdate(0);
    });

    test('returns response', async () => {
      // Arrange
      setUpProfileUpdate(1);

      // Act
      const response = await handleUpdateProfile({
        id: 123,
        name: 'Steven',
        accountIds: [456],
      });

      // Assert
      const expectedResponse = {};
      expect(response).toEqual(expectedResponse);
    });

    test('throws if failed to update', async () => {
      // Arrange
      const request = { id: 123 };
      setUpProfileUpdate(0);

      // Act & Assert
      await expect(handleUpdateProfile(request)).rejects.toThrow(
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

        const expectedUpdate = { name };
        const whereQuery = { where: { id: profileId } };

        setUpProfileUpdate(1);

        // Act
        await handleUpdateProfile({
          id: profileId,
          name,
        });

        // Assert
        expect(Profile.update).toHaveBeenCalledWith(expectedUpdate, whereQuery);
      });

      test('includes account ids', async () => {
        // Arrange
        const profileId = 123;
        const accountId = 456;

        const expectedUpdate = { accountIds: [accountId] };
        const whereQuery = { where: { id: profileId } };

        setUpProfileUpdate(1);

        // Act
        await handleUpdateProfile({
          id: profileId,
          accountIds: [accountId],
        });

        // Assert
        expect(Profile.update).toHaveBeenCalledWith(expectedUpdate, whereQuery);
      });
    });
  });

  describe('registerUpdateProfileRoute', () => {
    test('maps to correct route', () => {
      // Arrange
      const app = { post: jest.fn() };

      // Act
      registerUpdateProfileRoute(app);

      // Assert
      const args = app.post.mock.calls[0];
      const [route, middleware] = args;

      expect(route).toBe('/api/profile/update-profile');
      expect(middleware).toBe('verifyAuth');
    });
  });
});
