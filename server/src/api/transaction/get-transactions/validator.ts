import proto from 'shared/proto';

const { ValidationError } = require('@src/shared/error');

const { GetTransactionsRequest } = proto.server.transaction;

/**
 * Validates GetTransactionsRequest.
 *
 * @param request - GetTransactionsRequest proto.
 */
export default function validate(
  request: proto.server.transaction.IGetTransactionsRequest,
) {
  if (!(request instanceof GetTransactionsRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of GetTransactionsRequest`,
    );
  }
}
