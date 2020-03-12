import connect from 'shared/db';
import { Link as LinkEntity } from 'shared/db/entity/Link';
import proto from 'shared/proto';

import { invalidateAccessToken } from '@src/service/plaid';
import { DatabaseError } from '@src/shared/error';

import validate from './validator';

const { DeleteLinkResponse } = proto.server.link;

/**
 * DeleteLink endpoint.
 * Deletes link and invalidates access token.
 *
 * @param request - request proto.
 * @param session - session token proto.
 * @returns - response proto.
 */
export async function handleDeleteLink(
  request: proto.server.link.IDeleteLinkRequest,
  session: proto.server.ISessionToken,
) {
  validate(request);

  const { Link } = await connect();
  const { linkId, plaidItemId } = request;

  let queryBuilder = Link.createQueryBuilder()
    .delete()
    .where('userId = :userId', { userId: session.userId });
  if (linkId) {
    queryBuilder = queryBuilder.andWhere('id = :id', { id: linkId });
  }
  if (plaidItemId) {
    queryBuilder = queryBuilder.andWhere('plaidItemId = :plaidItemId', {
      plaidItemId: plaidItemId,
    });
  }

  const deleteResult = await queryBuilder.returning('*').execute();
  const deletedLinks = deleteResult.raw as LinkEntity[];
  if (!deletedLinks || !deletedLinks.length) {
    throw new DatabaseError(
      `Error occurred while deleting link ${JSON.stringify(request)}`,
    );
  }

  await Promise.all(
    deletedLinks.map(({ accessToken }) => invalidateAccessToken(accessToken)),
  );

  return DeleteLinkResponse.create();
}
