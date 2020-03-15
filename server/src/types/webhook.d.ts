import { Request } from 'express';

export interface UnverifiedPlaidHeader {
  alg: string;
  kid: string;
  typ: string;
}

export interface VerifiedPlaidHeader {
  iat: number;
  request_body_sha256: string;
}

interface CommonWebhook {
  webhook_type: string;
  webhook_code: string;
  item_id: string;
  error?: WebhookError | null;
}

interface WebhookError {
  display_message: string;
  error_code: string;
  error_message: string;
  error_type: string;
}

export interface AuthWebhook extends CommonWebhook {
  webhook_type: 'AUTH';
  webhook_code: 'AUTOMATICALLY_VERIFIED' | 'ERROR';
  account_id?: string;
}

export interface TransactionWebhook extends CommonWebhook {
  webhook_type: 'TRANSACTIONS';
  webhook_code:
    | 'INITIAL_UPDATE'
    | 'HISTORICAL_UPDATE'
    | 'DEFAULT_UPDATE'
    | 'TRANSACTIONS_REMOVED';
  new_transactions?: number;
  removed_transactions?: string[];
}

export interface ItemWebhook extends CommonWebhook {
  webhook_type: 'ITEM';
  webhook_code: 'WEBHOOK_UPDATE_ACKNOWLEDGED' | 'PENDING_EXPIRATION' | 'ERROR';
  new_webhook_url?: string;
  consent_expiration_time?: string;
}

export interface IncomeWebhook extends CommonWebhook {
  webhook_type: 'INCOME';
  webhook_code: 'PRODUCT_READY' | 'ERROR';
}

export interface AssetWebhook extends CommonWebhook {
  webhook_type: 'ASSETS';
  webhook_code: 'PRODUCT_READY' | 'ERROR';
  asset_report_id?: string;
}

export interface InvestmentsWebhook extends CommonWebhook {
  webhook_type: 'INVESTMENT_HOLDINGS' | 'INVESTMENTS_TRANSACTIONS';
  webhook_code: 'DEFAULT_UPDATE' | 'ERROR';
  new_holdings?: number;
  updated_holdings?: number;
  new_investments_transactions?: number;
  cancelled_investments_transactions?: number;
}

export interface WebhookRequest extends Request {
  body:
    | AuthWebhook
    | TransactionWebhook
    | ItemWebhook
    | IncomeWebhook
    | AssetWebhook
    | InvestmentsWebhook;
}
