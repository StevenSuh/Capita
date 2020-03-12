import proto from 'shared/proto';

const { ValidationError } = require('@src/shared/error');
const { validateRequiredFields } = require('@src/shared/util');

const { DeleteTransactionsRequest } = proto.server.transaction;

/**
 * Validates DeleteTransactionsRequest.
 *
 * @param request - DeleteTransactionsRequest proto.
 */
export default function validate(
  request: proto.server.transaction.IDeleteTransactionsRequest,
) {
  if (!(request instanceof DeleteTransactionsRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of DeleteTransactionsRequest`,
    );
  }
  validateRequiredFields(request, ['ids']);
}
