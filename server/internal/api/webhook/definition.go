package webhook

const (
	PlaidWebhookType                = "webhook_type"
	PlaidWebhookCode                = "webhook_code"
	PlaidWebhookItemID              = "item_id"
	PlaidWebhookNewTransactions     = "new_transactions"
	PlaidWebhookRemovedTransactions = "removed_transactions"

	PlaidAuth                      = "AUTH"
	PlaidAuthAutomaticallyVerified = "AUTOMATICALLY_VERIFIED"
	PlaidAuthVerificationExpired   = "VERIFICATION_EXPIRED"

	PlaidTransactions                 = "TRANSACTIONS"
	PlaidTransactionsInitialUpdate    = "INITIAL_UPDATE"
	PlaidTransactionsHistoricalUpdate = "HISTORICAL_UPDATE"
	PlaidTransactionsDefaultUpdate    = "DEFAULT_UPDATE"
	PlaidTransactionsRemoved          = "TRANSACTIONS_REMOVED"

	PlaidItem                          = "ITEM"
	PlaidItemWebhookUpdateAcknowledged = "WEBHOOK_UPDATE_ACKNOWLEDGED"
	PlaidItemError                     = "ERROR"
)
