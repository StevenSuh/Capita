const { obfuscateId } = require('@src/shared/util');

const { convertProfileToProto } = require('../util');

describe('Profile util', () => {
  test('convertProfileToProto', () => {
    // Arrange
    const profile = {
      id: 1,
      name: 'Steven',
      accountIds: [2],
    };
    const expectedProto = {
      obfuscatedId: obfuscateId(profile.id),
      name: profile.name,
      obfuscatedAccountIds: profile.accountIds.map(obfuscateId),
    };

    // Act
    const profileProto = convertProfileToProto(profile);

    // Assert
    expect(profileProto).toEqual(expectedProto);
  });
});
