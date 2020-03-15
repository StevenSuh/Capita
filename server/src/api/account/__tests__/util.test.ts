import { Account } from 'shared/db/entity/Account';

import {
  convertAccountToProto,
  convertAccountTypeToEnum,
  convertVerificationStatusToEnum,
  createBalanceProtoFromAccount,
} from '../util';

// Constants
const ACCOUNT = new Account();
Object.assign(ACCOUNT, {
  id: 1,
  userId: 2,
  lindId: 3,
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
  hidden: false,
  needsUpdate: false,
});

describe('Account util', () => {
  test('convertAccountToProto', () => {
    // Arrange
    const expectedProto = {
      id: ACCOUNT.id,
      linkId: ACCOUNT.linkId,
      mask: ACCOUNT.mask,
      name: ACCOUNT.name,
      officialName: ACCOUNT.officialName,
      subtype: ACCOUNT.subtype,
      type: convertAccountTypeToEnum(ACCOUNT.type),
      verificationStatus: convertVerificationStatusToEnum(
        ACCOUNT.verificationStatus,
      ),
      balance: createBalanceProtoFromAccount(ACCOUNT),
      manuallyCreated: ACCOUNT.manuallyCreated,
      hidden: ACCOUNT.hidden,
      needsUpdate: ACCOUNT.needsUpdate,
    };

    // Act
    const accountProto = convertAccountToProto(ACCOUNT);

    // Assert
    expect(accountProto).toEqual(expectedProto);
  });
});
