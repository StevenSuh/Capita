import proto from 'shared/proto';
import { Profile } from 'shared/db/entity/Profile';
import { decodeArrayIdsFromStr } from 'shared/db/util';

const { Profile: ProfileProto } = proto.shared;

/**
 * Convert profile object to client-consumable profile proto.
 *
 * @param profile - Queried profile.
 * @returns - Profile proto.
 */
export function convertProfileToProto(profile: Profile) {
  return ProfileProto.create({
    id: profile.id,
    name: profile.name,
    accountIds: decodeArrayIdsFromStr(profile.accountIdsStr),
  });
}
