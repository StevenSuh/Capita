import { Application } from 'express';

import { registerPlaidWebhook } from './plaid';

export default (app: Application) => {
  registerPlaidWebhook(app);
};
