import connect from 'shared/db';
import proto from 'shared/proto';

import { DatabaseError } from '@src/shared/error';

import validate from './validator';

const { UpdateLinkResponse } = proto.server.link;

/**
 * UpdateLink endpoint.
 *
 * @param request - request proto.
 * @param session - session token proto.
 */
export async function handleUpdateLink(
  request: proto.server.link.IUpdateLinkRequest,
) {
  validate(request);

  const whereQuery: { id?: number; plaidItemId?: string } = {};
  if (request.id) {
    whereQuery.id = request.id;
  }
  if (request.plaidItemId) {
    whereQuery.plaidItemId = request.plaidItemId;
  }

  const updatingLink: { needsUpdate?: boolean } = {};
  if (request.needsUpdate) {
    updatingLink.needsUpdate = request.needsUpdate;
  }

  const { Link } = await connect();
  const updateResult = await Link.update(whereQuery, updatingLink);
  if (!updateResult.affected) {
    throw new DatabaseError(
      `An error has occurred while updating link ${JSON.stringify(request)}`,
    );
  }

  return UpdateLinkResponse.create();
}
