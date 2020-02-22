const { Profile } = require('shared/proto').shared;

/**
 * Convert profile object to client-consumable profile proto.
 *
 * @param {object} profile - Queried profile.
 * @returns {Profile} - Profile proto.
 */
function convertProfileToProto(profile) {
  return Profile.create({
    id: profile.id,
    name: profile.name,
    accountIds: profile.accountIds,
  });
}

module.exports = {
  convertProfileToProto,
};
