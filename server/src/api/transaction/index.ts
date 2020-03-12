import { Application } from 'express';

import { registerCreateTransactionRoute } from './create-transaction';
import { registerDeleteTransactionsRoute } from './delete-transactions';
import { registerGetTransactionsRoute } from './get-transactions';
import { registerUpdateTransactionRoute } from './update-transaction';

export default (app: Application) => {
  registerCreateTransactionRoute(app);
  registerDeleteTransactionsRoute(app);
  registerGetTransactionsRoute(app);
  registerUpdateTransactionRoute(app);
};
