import { Application } from 'express';
import connect from 'shared/db';
import proto from 'shared/proto';

const { GetUserIdRequest, GetUserIdResponse } = proto.server.user;

/**
 * GetUserId endpoint.
 * Calls SyncAccounts for all accounts related to user.
 *
 * @param request - request proto.
 * @param session - session token proto.
 * @returns - response proto.
 */
export async function handleGetUserId(
  request: proto.server.user.IGetUserIdRequest,
) {
  let userId;
  const { Account, Link, Transaction, User } = await connect();

  if (request.linkId) {
    userId = (await Link.findOne(request.linkId)).userId;
  } else if (request.accountId) {
    userId = (await Account.findOne(request.accountId)).userId;
  } else if (request.transactionId) {
    userId = (await Transaction.findOne(request.transactionId)).userId;
  } else if (request.plaidItemId) {
    const link = await Link.findOne({
      where: { plaidItemId: request.plaidItemId },
    });
    userId = link.userId;
  } else if (request.plaidAccountId) {
    const account = await Account.findOne({
      where: { plaidAccountId: request.plaidAccountId },
    });
    userId = account.userId;
  } else if (request.plaidTransactionId) {
    const transaction = await Transaction.findOne({
      where: { plaidTransactionId: request.plaidTransactionId },
    });
    userId = transaction.userId;
  } else if (request.email) {
    const user = await User.findOne({ where: { email: request.email } });
    userId = user.id;
  }

  return GetUserIdResponse.create({ userId });
}
