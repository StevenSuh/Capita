import proto from 'shared/proto';

import { handleUpdateLink } from '@src/api/link/update-link';
import { PlaidError } from '@src/shared/error';
import { ItemWebhook } from '@src/types/webhook';

const { UpdateLinkRequest } = proto.server.link;

export async function handleItemWebhook(webhook: ItemWebhook) {
  switch (webhook.webhook_code) {
    case 'WEBHOOK_UPDATE_ACKNOWLEDGED':
      // Nothing to do here.
      break;
    case 'PENDING_EXPIRATION':
      await handlePendingExpiration(webhook);
      break;
    case 'ERROR':
      await handleError(webhook);
      break;
    default:
      throw new PlaidError(
        `Invalid Item webhook_code: ${webhook.webhook_code}`,
      );
  }
}

async function handlePendingExpiration(webhook: ItemWebhook) {
  await updateLinkNeedsUpdateStatus(webhook.item_id, /* needsUpdate= */ true);
}

async function handleError(webhook: ItemWebhook) {
  if (
    webhook.error.error_type !== 'ITEM_ERROR' ||
    webhook.error.error_code !== 'ITEM_LOGIN_REQUIRED'
  ) {
    throw new PlaidError(
      `Invalid Item webhook error: ${JSON.stringify(webhook.error)}`,
    );
  }
  await updateLinkNeedsUpdateStatus(webhook.item_id, /* needsUpdate= */ true);
}

async function updateLinkNeedsUpdateStatus(
  plaidItemId: string,
  needsUpdate: boolean,
) {
  const updateLinkRequest = UpdateLinkRequest.create({
    plaidItemId,
    needsUpdate,
  });
  await handleUpdateLink(updateLinkRequest);
}
