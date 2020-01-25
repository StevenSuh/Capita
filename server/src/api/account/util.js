const {
  Account,
  AccountType,
  Balance,
  VerificationStatus,
} = require('shared/proto/shared/account').shared;

const { obfuscateId } = require('@src/shared/util');

/**
 * Converts AccountType enum proto to string.
 *
 * @param {AccountType} accountType - AccountType enum proto.
 * @returns {string} - AccountType string.
 */
function convertAccountTypeToString(accountType) {
  switch (accountType) {
    case AccountType.INVESTMENT:
      return 'investment';
    case AccountType.CREDIT:
      return 'credit';
    case AccountType.DEPOSITORY:
      return 'depository';
    case AccountType.LOAN:
      return 'loan';
    case AccountType.OTHER:
      return 'other';
    case AccountType.UNKNOWN:
    default:
      return '';
  }
}

/**
 * Converts AccountType string to enum proto.
 *
 * @param {string} accountType - AccountType string.
 * @returns {AccountType} - AccountType enum proto.
 */
function convertAccountTypeToEnum(accountType) {
  switch (accountType) {
    case 'investment':
      return AccountType.INVESTMENT;
    case 'credit':
      return AccountType.CREDIT;
    case 'depository':
      return AccountType.DEPOSITORY;
    case 'loan':
      return AccountType.LOAN;
    case 'other':
      return AccountType.OTHER;
    default:
      return AccountType.UNKNOWN;
  }
}

/**
 * Converts VerificationStatus string to enum proto.
 *
 * @param {string} verificationStatus - VerificationStatus string.
 * @returns {VerificationStatus} - VerificationStatus enum proto.
 */
function convertVerificationStatusToEnum(verificationStatus) {
  switch (verificationStatus) {
    case 'pending_automatic_verification':
      return VerificationStatus.PENDING_AUTOMATIC_VERIFICATION;
    case 'automatically_verified':
      return VerificationStatus.AUTOMATICALLY_VERIFIED;
    case 'pending_manual_verification':
      return VerificationStatus.PENDING_MANUAL_VERIFICATION;
    case 'manually_verified':
      return VerificationStatus.MANUALLY_VERIFIED;
    default:
      return VerificationStatus.UNKNOWN;
  }
}

/**
 * Creates Balance proto from Account query.
 *
 * @param {object} account - Account query result.
 * @returns {Balance} - Balance proto.
 */
function createBalanceProtoFromAccount(account) {
  return Balance.create({
    current: account.balanceCurrent,
    available: account.balanceAvailable,
    limit: account.balanceLimit,
    isoCurrencyCode: account.balanceIsoCurrencyCode,
    unofficialCurrencyCode: account.balanceUnofficialCurrencyCode,
  });
}

/**
 * Converts Account query to proto.
 *
 * @param {object} account - Account query result.
 * @returns {Account} - Account proto.
 */
function convertAccountToProto(account) {
  return Account.create({
    obfuscatedId: obfuscateId(account.id),
    obfuscatedLinkId: obfuscateId(account.linkId),
    mask: account.mask,
    name: account.name,
    officialName: account.officialName,
    subtype: account.subtype,
    type: convertAccountTypeToEnum(account.type),
    verificationStatus: convertVerificationStatusToEnum(
      account.verificationStatus,
    ),
    balance: createBalanceProtoFromAccount(account),
    manuallyCreated: account.manuallyCreated,
    hidden: account.hidden,
  });
}

module.exports = {
  convertAccountToProto,
  convertAccountTypeToEnum,
  convertAccountTypeToString,
  convertVerificationStatusToEnum,
  createBalanceProtoFromAccount,
};
