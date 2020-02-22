const { obfuscateId } = require('@src/shared/util');

const {
  convertAccountToProto,
  convertAccountTypeToEnum,
  convertAccountTypeToString,
  convertVerificationStatusToEnum,
  convertVerificationStatusToString,
  convertBalanceProtoToObject,
  createBalanceProtoFromAccount,
} = require('../util');

// Constants
const ACCOUNT = {
  id: 1,
  userId: 2,
  lindId: 3,
  name: 'Bank of America Checking',
  officialName: 'Bank of America Checking 10x',
  subtype: 'checking',
  type: 'depository',
  balanceAvailable: 100.00,
  balanceCurrent: 110.12,
  balanceLimit: null,
  balanceIsoCurrencyCode: 'USD',
  balanceUnofficialCurrencyCode: null,
  manuallyCreated: true,
};

describe('Account util', () => {
  test('convertAccountToProto', () => {
    // Arrange
    const expectedProto = {
      obfuscatedId: obfuscateId(ACCOUNT.id),
      obfuscatedLinkId: obfuscateId(ACCOUNT.linkId),
      mask: ACCOUNT.mask,
      name: ACCOUNT.name,
      officialName: ACCOUNT.officialName,
      subtype: ACCOUNT.subtype,
      type: convertAccountTypeToEnum(ACCOUNT.type),
      verificationStatus: convertVerificationStatusToEnum(ACCOUNT.verificationStatus),
      balance: createBalanceProtoFromAccount(ACCOUNT),
      manuallyCreated: ACCOUNT.manuallyCreated,
      hidden: ACCOUNT.hidden,
    };

    // Act
    const accountProto = convertAccountToProto(ACCOUNT);

    // Assert
    expect(accountProto).toEqual(expectedProto);
  });
});
