const { Profile } = require('shared/proto/shared/profile').shared;

const { obfuscateId } = require('@src/shared/util');

/**
 * Convert profile object to client-consumable profile proto.
 *
 * @param {object} profile - Queried profile.
 * @returns {Profile} - Profile proto.
 */
function convertProfileToProto(profile) {
  return Profile.create({
    obfuscatedId: obfuscateId(profile.id),
    name: profile.name,
    obfuscatedAccountIds: profile.accountIds.map(obfuscateId),
  });
}

module.exports = {
  convertProfileToProto,
};
