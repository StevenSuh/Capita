import { Application } from 'express';

import accountRoutes from './account';
import linkRoutes from './link';
import profileRoutes from './profile';
import transactionRoutes from './transaction';
import userRoutes from './user';
import webhooks from './webhook';

export default (app: Application) => {
  accountRoutes(app);
  linkRoutes(app);
  profileRoutes(app);
  transactionRoutes(app);
  userRoutes(app);
  webhooks(app);
};
