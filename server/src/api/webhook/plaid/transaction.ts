import proto from 'shared/proto';

import { handleGetUserId } from '@src/api/user/get-user-id';
import { handleGetAccounts } from '@src/api/account/get-accounts';
import { handleSyncAccounts } from '@src/api/account/sync-accounts';
import { handleDeletePlaidTransactions } from '@src/api/transaction/delete-plaid-transactions';
import { PlaidError } from '@src/shared/error';
import { TransactionWebhook } from '@src/types/webhook';

const { GetAccountsRequest, SyncAccountsRequest } = proto.server.account;
const { DeletePlaidTransactionsRequest } = proto.server.transaction;
const { GetUserIdRequest } = proto.server.user;
const { SessionToken } = proto.server;

export async function handleTransactionWebhook(webhook: TransactionWebhook) {
  switch (webhook.webhook_code) {
    case 'INITIAL_UPDATE':
      await handleUpdate(webhook);
      break;
    case 'HISTORICAL_UPDATE':
      await handleUpdate(webhook);
      break;
    case 'DEFAULT_UPDATE':
      await handleUpdate(webhook);
      break;
    case 'TRANSACTIONS_REMOVED':
      await handleRemove(webhook);
      break;
    default:
      throw new PlaidError(
        `Invalid Item webhook_code: ${webhook.webhook_code}`,
      );
  }
}

async function handleUpdate(webhook: TransactionWebhook) {
  await syncPlaidItem(
    webhook.item_id,
    /* onlyBalance= */ false,
    webhook.new_transactions,
  );
}

async function handleRemove(webhook: TransactionWebhook) {
  await Promise.all([
    syncPlaidItem(webhook.item_id, /* onlyBalance= */ true),
    removePlaidTransactions(webhook.removed_transactions),
  ]);
}

async function syncPlaidItem(
  plaidItemId: string,
  onlyBalance?: boolean,
  count?: number,
) {
  const getUserIdRequest = GetUserIdRequest.create({ plaidItemId });
  const { userId } = await handleGetUserId(getUserIdRequest);
  const session = SessionToken.create({ userId });

  const getAccountsRequest = GetAccountsRequest.create();
  const { accounts } = await handleGetAccounts(getAccountsRequest, session);

  const syncAccountsRequest = SyncAccountsRequest.create({
    accountIds: accounts.map(({ id }) => id),
    count,
    onlyBalance,
  });
  const { results } = await handleSyncAccounts(syncAccountsRequest, session);

  results.forEach(result => {
    if (result.errorType) {
      throw new PlaidError(
        `Failed to sync plaidItemId ${plaidItemId} with a result of ${JSON.stringify(
          result,
        )}`,
      );
    }
  });
}

async function removePlaidTransactions(plaidTransactionIds: string[]) {
  const deletePlaidTransactionsRequest = DeletePlaidTransactionsRequest.create({
    plaidTransactionIds,
  });
  const { results } = await handleDeletePlaidTransactions(
    deletePlaidTransactionsRequest,
  );
  results.forEach(result => {
    if (result.errorType) {
      throw new PlaidError(
        `Failed to remove plaid transactions ${plaidTransactionIds} with a result of ${JSON.stringify(
          result,
        )}`,
      );
    }
  });
}
