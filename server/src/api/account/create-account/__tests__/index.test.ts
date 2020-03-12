import express, { Response } from 'express';
import connect from 'shared/db';
import { Account } from 'shared/db/entity/Account';
import proto from 'shared/proto';

import {
  convertAccountToProto,
  convertAccountTypeToEnum,
  createBalanceProtoFromAccount,
} from '../../util';
import { handleCreateAccount, registerCreateAccountRoute } from '..';

const { CreateAccountRequest, CreateAccountResponse } = proto.server.account;

// Constants
const ACCOUNT = new Account();
Object.assign(ACCOUNT, {
  id: 1,
  userId: 2,
  linkId: 3,
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
});

const REQUEST = {
  name: ACCOUNT.name,
  type: convertAccountTypeToEnum(ACCOUNT.type),
  subtype: ACCOUNT.subtype,
  balance: createBalanceProtoFromAccount(ACCOUNT),
};

// Mocks
jest.mock('../validator', () => () => {});
jest.mock('shared/db', () => {
  const models = { Account: { create: jest.fn(), save: jest.fn() } };
  return () => Promise.resolve(models);
});
jest.mock('@src/middleware', () => ({ verifyAuth: 'verifyAuth' }));

describe('CreateAccount', () => {
  /**
   * Setup Account.create
   *
   * @param {object} account - Account object to return.
   */
  async function setUpAccountCreate(account: any) {
    const { Account } = await connect();
    (Account.create as jest.Mock).mockReturnValue(account);
    (Account.save as jest.Mock).mockResolvedValue(account);
  }

  describe('handleCreateAccount', () => {
    beforeEach(async () => {
      await setUpAccountCreate(ACCOUNT);
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
      const mockFn = jest.fn();
      const app = express();
      app.post = mockFn;

      // Act
      registerCreateAccountRoute(app);

      // Assert
      const [route, middleware] = mockFn.mock.calls[0];
      expect(route).toBe('/api/account/create-account');
      expect(middleware).toBe('verifyAuth');
    });

    test('maps to correct callback', async () => {
      // Arrange
      const postMock = jest.fn();
      const sendMock = jest.fn();

      const app = express();
      app.post = postMock;
      const req = {
        raw: CreateAccountRequest.encode(REQUEST).finish(),
        session: {
          userId: ACCOUNT.userId,
        },
      };
      const res = {} as Response;
      res.send = sendMock;

      const expectedResponse = { account: convertAccountToProto(ACCOUNT) };
      const expectedResponseBuffer = CreateAccountResponse.encode(
        expectedResponse,
      ).finish();

      // Act
      registerCreateAccountRoute(app);

      const callback = postMock.mock.calls[0][2];
      await callback(req, res);

      // Assert
      const actualResponseBuffer = sendMock.mock.calls[0][0];
      expect(actualResponseBuffer).toEqual(expectedResponseBuffer);
    });
  });
});
