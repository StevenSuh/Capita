import proto from 'shared/proto';
import { Account } from 'shared/db/entity/Account';

const {
  Account: AccountProto,
  AccountType,
  Balance,
  VerificationStatus,
} = proto.shared;

/**
 * Converts AccountType enum proto to string.
 *
 * @param accountType - AccountType enum proto.
 * @returns - AccountType string.
 */
export function convertAccountTypeToString(
  accountType: proto.shared.AccountType,
) {
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
 * @param accountType - AccountType string.
 * @returns - AccountType enum proto.
 */
export function convertAccountTypeToEnum(accountType: string) {
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
 * @param verificationStatus - VerificationStatus string.
 * @returns - VerificationStatus enum proto.
 */
export function convertVerificationStatusToEnum(verificationStatus: string) {
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
 * Converts VerificationStatus enum proto to string.
 *
 * @param verificationStatus - VerificationStatus enum proto.
 * @returns - VerificationStatus string.
 */
export function convertVerificationStatusToString(
  verificationStatus: proto.shared.VerificationStatus,
) {
  switch (verificationStatus) {
    case VerificationStatus.PENDING_AUTOMATIC_VERIFICATION:
      return 'pending_automatic_verification';
    case VerificationStatus.AUTOMATICALLY_VERIFIED:
      return 'automatically_verified';
    case VerificationStatus.PENDING_MANUAL_VERIFICATION:
      return 'pending_manual_verification';
    case VerificationStatus.MANUALLY_VERIFIED:
      return 'manually_verified';
    case VerificationStatus.UNKNOWN:
    default:
      return '';
  }
}

/**
 * Creates Balance proto from Account query.
 *
 * @param account - Account query result.
 * @returns - Balance proto.
 */
export function createBalanceProtoFromAccount(account: Account) {
  return Balance.create({
    current: account.balanceCurrent,
    available: account.balanceAvailable,
    limit: account.balanceLimit,
    isoCurrencyCode: account.balanceIsoCurrencyCode,
    unofficialCurrencyCode: account.balanceUnofficialCurrencyCode,
  });
}

/**
 * Converts Balance proto to query-compatible object.
 *
 * @param balance - Balance proto.
 * @returns - Balance object.
 */
export function convertBalanceProtoToObject(balance: proto.shared.IBalance) {
  return {
    balanceCurrent: balance.current,
    balanceAvailable: balance.available,
    balanceLimit: balance.limit,
    balanceIsoCurrencyCode: balance.isoCurrencyCode,
    balanceUnofficialCurrencyCode: balance.unofficialCurrencyCode,
  };
}

/**
 * Converts Account query to proto.
 *
 * @param account - Account query result.
 * @returns - Account proto.
 */
export function convertAccountToProto(account: Account) {
  return AccountProto.create({
    id: account.id,
    linkId: account.linkId,
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
    needsUpdate: account.needsUpdate,
  });
}
