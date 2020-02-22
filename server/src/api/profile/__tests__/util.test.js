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
      id: profile.id,
      name: profile.name,
      accountIds: profile.accountIds,
    };

    // Act
    const profileProto = convertProfileToProto(profile);

    // Assert
    expect(profileProto).toEqual(expectedProto);
  });
});
