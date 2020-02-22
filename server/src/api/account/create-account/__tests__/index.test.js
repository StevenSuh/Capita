const {
  CreateAccountRequest,
  CreateAccountResponse,
} = require('shared/proto').server.account;

const { Account } = require('@src/db/models');

const {
  convertAccountToProto,
  convertAccountTypeToEnum,
  createBalanceProtoFromAccount,
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
  balanceAvailable: 100.0,
  balanceCurrent: 110.12,
  balanceLimit: null,
  balanceIsoCurrencyCode: 'USD',
  balanceUnofficialCurrencyCode: null,
  manuallyCreated: true,
};
const REQUEST = {
  name: ACCOUNT.name,
  type: convertAccountTypeToEnum(ACCOUNT.type),
  subtype: ACCOUNT.subtype,
  balance: createBalanceProtoFromAccount(ACCOUNT),
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
      // Act
      const response = await handleCreateAccount(REQUEST, {
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
      const [route, middleware] = app.post.mock.calls[0];
      expect(route).toBe('/api/account/create-account');
      expect(middleware).toBe('verifyAuth');
    });

    test('maps to correct callback', async () => {
      // Arrange
      const app = { post: jest.fn() };
      const req = {
        raw: CreateAccountRequest.encode(REQUEST).finish(),
        session: {
          userId: ACCOUNT.userId,
        },
      };
      const res = { send: jest.fn() };

      const expectedResponse = { account: convertAccountToProto(ACCOUNT) };
      const expectedResponseBuffer = CreateAccountResponse.encode(
        expectedResponse,
      ).finish();

      // Act
      registerCreateAccountRoute(app);

      const callback = app.post.mock.calls[0][2];
      await callback(req, res);

      // Assert
      const actualResponseBuffer = res.send.mock.calls[0][0];
      expect(actualResponseBuffer).toEqual(expectedResponseBuffer);
    });
  });
});
