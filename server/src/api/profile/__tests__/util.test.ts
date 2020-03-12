import { convertProfileToProto } from '../util';
import { Profile } from 'shared/db/entity/Profile';
import { decodeArrayIdsFromStr } from 'shared/db/util';

describe('Profile util', () => {
  test('convertProfileToProto', () => {
    // Arrange
    const profile = new Profile();
    Object.assign(profile, {
      id: 1,
      name: 'Steven',
      accountIdsStr: '2',
    });
    const expectedProto = {
      id: profile.id,
      name: profile.name,
      accountIds: decodeArrayIdsFromStr(profile.accountIdsStr),
    };

    // Act
    const profileProto = convertProfileToProto(profile);

    // Assert
    expect(profileProto).toEqual(expectedProto);
  });
});
