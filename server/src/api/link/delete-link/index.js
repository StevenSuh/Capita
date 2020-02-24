const {
  DeleteLinkRequest,
  DeleteLinkResponse,
} = require('shared/proto').server.link;
const { SessionToken } = require('shared/proto').server;

const { sequelize, Link } = require('@src/db/models');
const { invalidateAccessToken } = require('@src/service/plaid');
const { DatabaseError } = require('@src/shared/error');

const validate = require('./validator');

/**
 * DeleteLink endpoint.
 * Deletes link and invalidates access token.
 *
 * @param {DeleteLinkRequest} request - request proto.
 * @param {SessionToken} session - session token proto.
 * @returns {DeleteLinkResponse} - response proto.
 */
async function handleDeleteLink(request, session) {
  validate(request);

  let whereQuery = `WHERE "userId" = ${session.userId}`;
  const { linkId } = request;

  if (linkId) {
    whereQuery += ` AND id = ${linkId}`;
  }
  if (request.plaidItemId) {
    whereQuery += ` AND "plaidItemId" = ${request.plaidItemId}`;
  }

  const query = `DELETE FROM ${Link.getTableName()} ${whereQuery} RETURNING *`;
  const [deletedLinks] = await sequelize.query(query);
  if (!deletedLinks || !deletedLinks.length) {
    throw new DatabaseError(`Error occurred while deleting link ${whereQuery}`);
  }

  await invalidateAccessToken(deletedLinks[0].accessToken);

  return DeleteLinkResponse.create();
}

module.exports = {
  handleDeleteLink,
};
