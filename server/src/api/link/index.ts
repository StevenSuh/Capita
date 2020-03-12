import { Application } from 'express';

import { registerCreateLinkRoute } from './create-link';
import { registerUpdateLinkRoute } from './update-link';

export default (app: Application) => {
  registerCreateLinkRoute(app);
  registerUpdateLinkRoute(app);
};
