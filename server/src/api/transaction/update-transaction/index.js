const {
  UpdateTransactionRequest,
  UpdateTransactionResponse,
} = require('shared/proto').server.transaction;

const { Transaction } = require('@sr/db/models');
const { verifyAuth } = require('@src/middleware');
const { BadRequestError, DatabaseError } = require('@src/shared/error');
const { unobfuscateId } = require('@src/shared/util');

const validate = require('./validator');

/**
 * Checks and retrieves values to update from request.
 *
 * @param {UpdateTransactionRequest} request - request proto.
 * @returns {object} - Transaction values to update.
 */
async function getUpdatingValues(request) {
  const transaction = await Transaction.findOne({
    where: { id: unobfuscateId(request.obfuscatedId) },
  });
  if (!transaction) {
    throw new BadRequestError('Transaction does not exist');
  }

  const updatingTransaction = {};
  if (request.name) {
    updatingTransaction.name = request.name;
  }
  if (request.category) {
    updatingTransaction.category = request.category;
  }
  if (request.type) {
    updatingTransaction.type = request.type;
  }
  if (request.note) {
    updatingTransaction.note = request.note;
  }
  if (request.recurring) {
    updatingTransaction.recurring = request.recurring;
  }
  if (request.hidden) {
    updatingTransaction.hidden = request.hidden;
  }
  // These values can only be updated if original was manually created.
  if (request.amount) {
    if (!transaction.manuallyCreated) {
      throw new BadRequestError(
        'Amount can only be modified for manually created transactions',
      );
    }
    // TODO: Need to also update account_balance_history
    updatingTransaction.amount = request.amount;
  }
  if (request.date) {
    if (!transaction.manuallyCreated) {
      throw new BadRequestError(
        'Date can only be modified for manually created transactions',
      );
    }
    // TODO: Need to also update account_balance_history
    updatingTransaction.date = request.date;
  }

  return updatingTransaction;
}

/**
 * UpdateTransaction endpoint.
 * Updates transaction and AccountBalanceHistory if relevant. The balance history becomes relevant if we modify the transaction's amount or date.
 *
 * @param {UpdateTransactionRequest} request - request proto.
 * @returns {UpdateTransactionResponse} - response proto.
 */
async function handleUpdateTransaction(request) {
  validate(request);

  const updatingTransaction = getUpdatingValues(request);

  const [affectedRows] = await Transaction.update(updatingTransaction, {
    where: { id: unobfuscateId(request.obfuscatedId) },
  });
  if (!affectedRows) {
    throw new DatabaseError(
      `An error has occurred while updating transaction ${request.toString()}`,
    );
  }

  // TODO: Need to also update account_balance_history
  return UpdateTransactionResponse.create();
}

/**
 * Registers and exposes UpdateTransaction endpoint.
 *
 * @param {object} app - given.
 */
function registerUpdateTransactionRoute(app) {
  app.post(
    '/api/transaction/update-transaction',
    verifyAuth,
    async (req, res) => {
      const request = UpdateTransactionRequest.decode(req.raw);

      const response = await handleUpdateTransaction(request);
      const responseBuffer = UpdateTransactionResponse.encode(
        response,
      ).finish();

      return res.send(responseBuffer);
    },
  );
}

module.exports = {
  handleUpdateTransaction,
  registerUpdateTransactionRoute,
};
