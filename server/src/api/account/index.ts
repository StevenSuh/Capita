import { Application } from 'express';

import { registerCreateAccountRoute } from './create-account';
import { registerDeleteAccountRoute } from './delete-account';
import { registerGetAccountsRoute } from './get-accounts';
import { registerSyncAccountsRoute } from './sync-accounts';
import { registerUpdateAccountRoute } from './update-account';

export default (app: Application) => {
  registerCreateAccountRoute(app);
  registerDeleteAccountRoute(app);
  registerGetAccountsRoute(app);
  registerSyncAccountsRoute(app);
  registerUpdateAccountRoute(app);
};
