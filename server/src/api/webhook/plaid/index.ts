import { Application } from 'express';

import { PLAID_WEBHOOK } from '../defs';

/**
 * Registers and exposes UpdateProfile endpoint.
 *
 * @param app - given.
 */
export function registerPlaidWebhook(app: Application) {
  app.post(PLAID_WEBHOOK, (_req, res) => {
    // TODO: JWT verify request

    // TODO: Check "webhook_type"

    // TODO: Then check "webhook_code"

    // Plaid expects a response of 200 or it will retry the webhook few more times.
    res.status(200).end();
  });
}
