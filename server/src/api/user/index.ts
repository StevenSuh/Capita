import { Application } from 'express';

import { registerGetLoginStatusRoute } from './get-login-status';
import { registerSignInRoute } from './sign-in';
import { registerSignUpRoute } from './sign-up';

export default (app: Application) => {
  registerGetLoginStatusRoute(app);
  registerSignInRoute(app);
  registerSignUpRoute(app);
};
