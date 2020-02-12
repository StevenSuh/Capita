const {
  UpsertPlaidAccountsRequest,
  UpsertPlaidAccountsResponse,
} = require('shared/proto/server/account/upsert_plaid_accounts').server.account;
const {
  ErrorType,
  ErrorTypeEnum,
} = require('shared/proto/shared/error_type').shared;

const { Account } = require('@src/db/models');

const {
  convertAccountTypeToString,
  convertVerificationStatusToString,
  convertBalanceProtoToObject,
} = require('../util');
const validate = require('./validator');

/**
 * Converts PlaidAccount proto to object for query.
 *
 * @param {UpsertPlaidAccountsRequest.PlaidAccount} account - Account proto.
 * @returns {object} - Account query object.
 */
function convertPlaidAccountToObject(account) {
  return {
    userId: account.userId,
    linkId: account.linkId,
    plaidAccountId: account.plaidAccountId,
    mask: account.mask,
    name: account.name,
    officialName: account.officialName,
    subtype: account.subtype,
    type: convertAccountTypeToString(account.type),
    verificationStatus: convertVerificationStatusToString(
      account.verificationStatus,
    ),
    manuallyCreated: account.manuallyCreated,
    hidden: account.hidden,
    ...convertBalanceProtoToObject(account.balance),
  };
}

/**
 * UpsertPlaidAccounts endpoint.
 * Upserts and returns a new account.
 *
 * @param {UpsertPlaidAccountsRequest} request - request proto.
 * @returns {UpsertPlaidAccountsResponse} - response proto.
 */
async function handleUpsertPlaidAccounts(request) {
  validate(request);

  const newAccounts = request.accounts.map(convertPlaidAccountToObject);
  const successfulAccounts = await Account.bulkCreate(newAccounts, {
    returning: true,
    updateOnDuplicate: true,
  });

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

module.exports = {
  handleUpsertPlaidAccounts,
};
