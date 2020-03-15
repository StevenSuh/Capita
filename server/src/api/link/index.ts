import { Application } from 'express';

import { registerCreateLinkRoute } from './create-link';
import { registerGetLinksPublicTokenRoute } from './get-links-public-token';

export default (app: Application) => {
  registerCreateLinkRoute(app);
  registerGetLinksPublicTokenRoute(app);
};
