import { Application } from 'express';

import { registerGetProfilesRoute } from './get-profiles';
import { registerCreateProfileRoute } from './create-profile';
import { registerDeleteProfileRoute } from './delete-profile';
import { registerUpdateProfileRoute } from './update-profile';

export default (app: Application) => {
  registerGetProfilesRoute(app);
  registerCreateProfileRoute(app);
  registerDeleteProfileRoute(app);
  registerUpdateProfileRoute(app);
};
