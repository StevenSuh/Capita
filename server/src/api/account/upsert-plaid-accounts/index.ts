import connect from 'shared/db';
import { Account as AccountEntity } from 'shared/db/entity/Account';
import proto from 'shared/proto';

import { createExcludedKeys } from '@src/shared/util';

import validate from './validator';

const { UpsertPlaidAccountsResponse } = proto.server.account;
const { ErrorType, ErrorTypeEnum } = proto.shared;

/**
 * UpsertPlaidAccounts endpoint.
 * Upserts and returns a new account.
 *
 * @param request - request proto.
 * @returns - response proto.
 */
export async function handleUpsertPlaidAccounts(
  request: proto.server.account.IUpsertPlaidAccountsRequest,
) {
  validate(request);

  const { Account } = await connect();
  const newAccounts = request.accounts;

  const excludedKeys = createExcludedKeys(newAccounts[0]);
  const upsertResult = await Account.createQueryBuilder()
    .insert()
    .values(newAccounts)
    .onConflict(`("plaidAccountId") DO UPDATE SET ${excludedKeys}`)
    .returning('*')
    .execute();
  const successfulAccounts = upsertResult.generatedMaps as AccountEntity[];

  const results = newAccounts.map(({ plaidAccountId }) => {
    const successfulAccount = successfulAccounts.find(
      account => plaidAccountId === account.plaidAccountId,
    );
    return UpsertPlaidAccountsResponse.Result.create({
      plaidAccountId,
      errorType: successfulAccount
        ? undefined
        : ErrorType.create({
            type: ErrorTypeEnum.DATABASE,
          }),
    });
  });

  return UpsertPlaidAccountsResponse.create({ results });
}
