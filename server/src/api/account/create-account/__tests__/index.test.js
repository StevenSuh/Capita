const { Account } = require('@src/db/models');
const {
  convertAccountToProto,
  convertAccountTypeToEnum,
} = require('../../util');
const { handleCreateAccount, registerCreateAccountRoute } = require('..');

// Constants
const ACCOUNT = {
  id: 1,
  userId: 2,
  lindId: 3,
  name: 'Bank of America Checking',
  officialName: 'Bank of America Checking 10x',
  subtype: 'checking',
  type: 'depository',
  balanceAvailable: 100,
  balanceCurrent: 110,
  balanceLimit: null,
  balanceIsoCurrencyCode: 'USD',
  balanceUnofficialCurrencyCode: null,
  manuallyCreated: true,
};

// Mocks
jest.mock('../validator', () => () => {});
jest.mock('@src/db/models', () => {
  return {
    Account: {
      create: jest.fn(),
    },
  };
});
jest.mock('@src/middleware', () => ({ verifyAuth: 'verifyAuth' }));

describe('CreateAccount', () => {
  /**
   * Setup Account.create
   *
   * @param {object} account - Account object to return.
   */
  function setUpAccountCreate(account) {
    Account.create.mockReturnValue(Promise.resolve(account));
  }

  describe('handleCreateAccount', () => {
    beforeEach(() => {
      setUpAccountCreate(ACCOUNT);
    });

    test('returns response', async () => {
      // Arrange
      const request = {
        name: ACCOUNT.name,
        type: convertAccountTypeToEnum(ACCOUNT.type),
        subtype: ACCOUNT.subtype,
        balance: {
          available: ACCOUNT.balanceAvailable,
          current: ACCOUNT.balanceCurrent,
          limit: ACCOUNT.balanceLimit,
          isoCurrencyCode: ACCOUNT.balanceIsoCurrencyCode,
        },
      };

      // Act
      const response = await handleCreateAccount(request, {
        userId: ACCOUNT.userId,
      });

      // Assert
      const expectedResponse = { account: convertAccountToProto(ACCOUNT) };
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('registerCreateAccountRoute', () => {
    test('maps to correct route', () => {
      // Arrange
      const app = { post: jest.fn() };

      // Act
      registerCreateAccountRoute(app);

      // Assert
      const args = app.post.mock.calls[0];
      const [route, middleware] = args;

      expect(route).toBe('/api/account/create-account');
      expect(middleware).toBe('verifyAuth');
    });
  });
});
