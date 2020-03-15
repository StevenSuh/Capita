import { Application } from 'express';
import connect from 'shared/db';
import proto from 'shared/proto';

import { verifyAuth } from '@src/middleware';
import { BadRequestError, DatabaseError } from '@src/shared/error';
import { CustomRequest } from '@src/types/request';

import validate from './validator';

const {
  UpdateTransactionRequest,
  UpdateTransactionResponse,
} = proto.server.transaction;

/**
 * Registers and exposes UpdateTransaction endpoint.
 *
 * @param app - given.
 */
export function registerUpdateTransactionRoute(app: Application) {
  app.post(
    '/api/transaction/update-transaction',
    verifyAuth,
    async (req: CustomRequest, res) => {
      const request = UpdateTransactionRequest.decode(req.raw);

      const response = await handleUpdateTransaction(request);
      const responseBuffer = UpdateTransactionResponse.encode(
        response,
      ).finish();

      return res.send(responseBuffer);
    },
  );
}

/**
 * UpdateTransaction endpoint.
 * Updates transaction and AccountBalanceHistory if relevant. The balance history becomes relevant
 * if we modify the transaction's amount or date.
 *
 * @param request - request proto.
 * @returns - response proto.
 */
export async function handleUpdateTransaction(
  request: proto.server.transaction.IUpdateTransactionRequest,
) {
  validate(request);

  const updatingTransaction = await getUpdatingValues(request);

  const { Transaction } = await connect();
  const updateResult = await Transaction.update(
    { id: request.id },
    updatingTransaction,
  );
  if (!updateResult.affected) {
    throw new DatabaseError(
      `An error has occurred while updating transaction ${JSON.stringify(
        request,
      )}`,
    );
  }

  return UpdateTransactionResponse.create();
}

/**
 * Checks and retrieves values to update from request.
 *
 * @param request - request proto.
 * @returns - Transaction values to update.
 */
async function getUpdatingValues(
  request: proto.server.transaction.IUpdateTransactionRequest,
) {
  const { Transaction } = await connect();
  const transaction = await Transaction.findOne({
    where: { id: request.id },
  });
  if (!transaction) {
    throw new BadRequestError('Transaction does not exist');
  }

  const updatingTransaction: {
    name?: string;
    category?: string;
    type?: string;
    note?: string;
    recurring?: boolean;
    hidden?: boolean;
    amount?: number;
    date?: string;
  } = {};
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
    updatingTransaction.amount = request.amount;
  }
  if (request.date) {
    if (!transaction.manuallyCreated) {
      throw new BadRequestError(
        'Date can only be modified for manually created transactions',
      );
    }
    updatingTransaction.date = request.date;
  }

  return updatingTransaction;
}
