import proto from 'shared/proto';

import { handleGetUserId } from '@src/api/user/get-user-id';
import { handleGetAccounts } from '@src/api/account/get-accounts';
import { handleUpdateAccount } from '@src/api/account/update-account';
import { PlaidError } from '@src/shared/error';
import { AuthWebhook } from '@src/types/webhook';

const { GetAccountsRequest, UpdateAccountRequest } = proto.server.account;
const { GetUserIdRequest } = proto.server.user;
const { SessionToken } = proto.server;

export async function handleAuthWebhook(webhook: AuthWebhook) {
  switch (webhook.webhook_code) {
    case 'AUTOMATICALLY_VERIFIED':
      await handleAutomaticallyVerified(webhook);
      break;
    case 'ERROR':
      await handleError(webhook);
      break;
    default:
      throw new PlaidError(
        `Invalid Auth webhook_code: ${webhook.webhook_code}`,
      );
  }
}

async function handleAutomaticallyVerified(webhook: AuthWebhook) {
  await updateAccountNeedsUpdateStatus(
    webhook.account_id,
    /* needsUpdate= */ false,
  );
}

async function handleError(webhook: AuthWebhook) {
  if (webhook.error.error_type !== 'VERIFICATION_EXPIRED') {
    throw new PlaidError(
      `Invalid Auth webhook error: ${JSON.stringify(webhook.error)}`,
    );
  }
  await updateAccountNeedsUpdateStatus(
    webhook.account_id,
    /* needsUpdate= */ true,
  );
}

async function updateAccountNeedsUpdateStatus(
  plaidAccountId: string,
  needsUpdate: boolean,
) {
  const getUserIdRequest = GetUserIdRequest.create({
    plaidAccountId,
  });
  const { userId } = await handleGetUserId(getUserIdRequest);
  const session = SessionToken.create({ userId });

  const getAccountsRequest = GetAccountsRequest.create({
    plaidAccountIds: [plaidAccountId],
  });
  const { accounts } = await handleGetAccounts(getAccountsRequest, session);
  const account = accounts[0];

  const updateAccountRequest = UpdateAccountRequest.create({
    id: account.id,
    needsUpdate,
  });
  await handleUpdateAccount(updateAccountRequest, session);
}
