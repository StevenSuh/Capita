import bodyParser from 'body-parser';
import * as crypto from 'crypto';
import { Application } from 'express';
import jwt from 'jsonwebtoken';

import { getWebhookVerificationKey } from '@src/service/plaid';
import { PlaidError } from '@src/shared/error';
import {
  WebhookRequest,
  UnverifiedPlaidHeader,
  VerifiedPlaidHeader,
} from '@src/types/webhook';

import { PLAID_HEADER, PLAID_WEBHOOK } from '../defs';
import { handleAuthWebhook } from './auth';
import { handleItemWebhook } from './item';
import { handleTransactionWebhook } from './transaction';

const FIVE_MINUTES = 60 * 5;

async function decodePlaidHeader(header: string) {
  const unverifiedHeader = jwt.decode(header) as UnverifiedPlaidHeader;
  if (unverifiedHeader.alg !== 'ES256') {
    throw new PlaidError(`Invalid alg of ${unverifiedHeader.alg}`);
  }
  if (unverifiedHeader.typ !== 'jwt') {
    throw new PlaidError(`Invalid typ of ${unverifiedHeader.typ}`);
  }

  const plaidKey = await getWebhookVerificationKey(unverifiedHeader.kid);
  const verifiedHeader = jwt.verify(header, plaidKey as jwt.Secret, {
    algorithms: ['ES256'],
  }) as VerifiedPlaidHeader;
  if (verifiedHeader.iat < Date.now() - FIVE_MINUTES) {
    throw new PlaidError('Request token has expired');
  }

  return verifiedHeader;
}

function verifyPlaidBody(body: string, plaidBody: string) {
  const bodyHash = crypto
    .createHash('sha256')
    .update(body)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(bodyHash), Buffer.from(plaidBody));
}

/**
 * Registers and exposes UpdateProfile endpoint.
 *
 * @param app - given.
 */
export function registerPlaidWebhook(app: Application) {
  app.post(
    PLAID_WEBHOOK,
    bodyParser.json(),
    async (req: WebhookRequest, res) => {
      const decodedHeader = await decodePlaidHeader(req.header(PLAID_HEADER));
      const bodyStr = JSON.stringify(req.body);
      if (!verifyPlaidBody(bodyStr, decodedHeader.request_body_sha256)) {
        throw new PlaidError('Invalid plaid webhook request');
      }

      switch (req.body.webhook_type) {
        case 'AUTH':
          await handleAuthWebhook(req.body);
          break;
        case 'ITEM':
          await handleItemWebhook(req.body);
          break;
        case 'TRANSACTIONS':
          await handleTransactionWebhook(req.body);
          break;
        default:
          throw new PlaidError(
            `Unsupported plaid webhook_type: ${req.body.webhook_type}`,
          );
      }
      res.status(200).end();
    },
  );
}
