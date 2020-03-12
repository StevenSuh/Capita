import plaid, {
  InstitutionWithInstitutionData,
  TransactionsResponse,
  TransactionsAllResponse,
} from 'plaid';
import connect from 'shared/db';

import { plaidClientId, plaidSecret, plaidPublicKey } from '@src/config';

import {
  convertAccount,
  convertInstitution,
  convertItem,
  convertPlaidError,
  convertTransaction,
} from './util';
import {
  PlaidAccount,
  PlaidItem,
  PlaidInstitution,
  PlaidTransaction,
} from '@src/types/plaid';

const plaidEnv =
  process.env.NODE_ENV === 'production'
    ? plaid.environments.production
    : plaid.environments.development;

const plaidClient = new plaid.Client(
  plaidClientId,
  plaidSecret,
  plaidPublicKey,
  plaidEnv,
  { version: '2019-05-29' },
);

/**
 * Creates a public token (expiring in ~30 minutes) to renew Plaid Link.
 *
 * @param accessToken - Plaid access token.
 * @returns - Plaid public token.
 */
export function createPublicToken(accessToken: string): Promise<string> {
  return new Promise((resolve, reject) => {
    plaidClient.createPublicToken(accessToken, (err, res) => {
      if (err) {
        reject(convertPlaidError(err));
      }
      resolve(res.public_token);
    });
  });
}

/**
 * Get plaid link based on public token.
 *
 * @param publicToken - Validated token given after successful link by user.
 * @returns - Object of access token and the item id.
 */
export function getLink(
  publicToken: string,
): Promise<{ accessToken: string; itemId: string }> {
  return new Promise((resolve, reject) => {
    plaidClient.exchangePublicToken(publicToken, (err, res) => {
      if (err) {
        reject(convertPlaidError(err));
      }

      const accessToken = res.access_token;
      const itemId = res.item_id;

      resolve({ accessToken, itemId });
    });
  });
}

/**
 * Invalidates a plaid access token.
 *
 * @param accessToken - Plaid access token.
 * @returns - Void if successful, errors out otherwise.
 */
export async function invalidateAccessToken(
  accessToken: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    plaidClient.invalidateAccessToken(accessToken, err => {
      if (err) {
        reject(convertPlaidError(err));
      }
      resolve();
    });
  });
}

/**
 * Get plaid institution information.
 *
 * @param institutionId - Plaid institution id.
 * @returns - Converted plaid institution.
 */
export function getInstitution(
  institutionId: string,
): Promise<PlaidInstitution> {
  return new Promise((resolve, reject) => {
    plaidClient.getInstitutionById(
      institutionId,
      { include_optional_metadata: true },
      (err, res) => {
        if (err) {
          reject(convertPlaidError(err));
        }
        resolve(
          convertInstitution(res.institution as InstitutionWithInstitutionData),
        );
      },
    );
  });
}

/**
 * Get all accounts associated to item.
 *
 * @param itemId - Plaid item id.
 * @returns - Object of accounts and item.
 */
export async function getAccounts(
  itemId: string,
): Promise<{ accounts: Array<PlaidAccount>; item: PlaidItem }> {
  const { Link } = await connect();

  const { accessToken } = await Link.findOne({
    where: { plaidItemId: itemId },
  });

  return new Promise((resolve, reject) => {
    plaidClient.getAccounts(accessToken, (err, res) => {
      if (err) {
        reject(convertPlaidError(err));
      }
      resolve({
        accounts: res.accounts.map(convertAccount),
        item: convertItem(res.item),
      });
    });
  });
}

/**
 * Get account balances requested.
 *
 * @param plaidAccountIds - List of plaid account ids.
 * @returns - List of account balance results by items.
 */
export async function getAccountBalances(
  plaidAccountIds: string[],
): Promise<{ accounts: PlaidAccount[]; item: PlaidItem }[]> {
  const { Account, Link } = await connect();

  const accounts = await Account.find({
    where: { plaidAccountId: plaidAccountIds },
  });
  const uniqueLinkIds = Array.from(
    new Set(accounts.map(account => account.linkId)),
  );

  const links = await Link.find({ where: { id: uniqueLinkIds } });

  return Promise.all(
    links.map(({ accessToken }) => {
      return new Promise<{ accounts: PlaidAccount[]; item: PlaidItem }>(
        (resolve, reject) => {
          const options: { account_ids?: string[] } = {};
          if (plaidAccountIds) {
            options.account_ids = plaidAccountIds;
          }

          plaidClient.getBalance(accessToken, options, (err, res) => {
            if (err) {
              reject(convertPlaidError(err));
            }
            resolve({
              accounts: res.accounts.map(convertAccount),
              item: convertItem(res.item),
            });
          });
        },
      );
    }),
  );
}

/**
 * Get all transactions associated to item.
 *
 * @param itemId - Plaid item id.
 * @param startDate - Optional date field to note when the transactions should start. In YYYY-MM-DD format.
 * @param endDate - Optional date field to note when the transactions should end. In YYYY-MM-DD format.
 * @param plaidAccountIds - List of plaid account ids. Account id/s not associated to `itemId` will be ignored.
 * @param count - Optional number to limit the number of transactions to get.
 * @returns - List of transactions and related data.
 */
export async function getTransactions(
  itemId: string,
  startDate: string,
  endDate: string,
  plaidAccountIds?: string[],
  count?: number,
): Promise<{
  accounts: PlaidAccount[];
  item: PlaidItem;
  totalTransactions: number;
  transactions: PlaidTransaction[];
}> {
  const { Link } = await connect();

  const { accessToken } = await Link.findOne({
    where: { plaidItemId: itemId },
  });

  return new Promise((resolve, reject) => {
    const options: { account_ids?: string[]; count?: number } = {};
    if (plaidAccountIds) {
      options.account_ids = plaidAccountIds;
    }
    const callback = (
      err: Error,
      res: TransactionsResponse | TransactionsAllResponse,
    ) => {
      if (err) {
        reject(convertPlaidError(err));
      }
      resolve({
        accounts: res.accounts.map(convertAccount),
        item: convertItem(res.item),
        totalTransactions: res.total_transactions,
        transactions: res.transactions.map(convertTransaction),
      });
    };

    if (count) {
      options.count = count;
      plaidClient.getTransactions(
        accessToken,
        startDate,
        endDate,
        options,
        callback,
      );
    } else {
      plaidClient.getAllTransactions(
        accessToken,
        startDate,
        endDate,
        options,
        callback,
      );
    }
  });
}

/**
 * Get webhook verification key when webhook endpoint is hit by Plaid.
 *
 * @param keyId - Plaid obfuscated key id.
 * @returns - Key object.
 */
export async function getWebhookVerificationKey(
  keyId: string,
): Promise<object> {
  return new Promise((resolve, reject) => {
    plaidClient.getWebhookVerificationKey(keyId, (err, res) => {
      if (err) {
        reject(convertPlaidError(err));
      }
      resolve(res.key);
    });
  });
}
