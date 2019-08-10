package webhook

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"

	api ".."
	"../link"
	"../transaction"
)

func Routes() *chi.Mux {
	router := chi.NewRouter()

	router.Post("/plaid", Plaid)

	return router
}

func Plaid(w http.ResponseWriter, r *http.Request) {
	input := r.Context().Value(api.BodyCtx).(map[string]interface{})

	response := make(map[string]interface{})
	response["error"] = false
	render.JSON(w, r, response)

	webhookType := input[PlaidWebhookType].(string)

	switch webhookType {
	case PlaidAuth:
		handlePlaidAuthWebhook(input)
	case PlaidTransactions:
		handlePlaidTransactionsWebhook(input)
	case PlaidItem:
		handlePlaidItemWebhook(input)
	}
}

func handlePlaidAuthWebhook(input map[string]interface{}) {
	// itemID := input[PlaidWebhookItemID].(string)
	webhookCode := input[PlaidWebhookCode].(string)

	switch webhookCode {
	case PlaidAuthVerificationExpired:
		// TODO send notification
	}
}

func handlePlaidTransactionsWebhook(input map[string]interface{}) {
	itemID := input[PlaidWebhookItemID].(string)
	webhookCode := input[PlaidWebhookCode].(string)

	switch webhookCode {
	case PlaidTransactionsHistoricalUpdate:
		link.InitializeLink(itemID)
	case PlaidTransactionsDefaultUpdate:
		newTransactionsCt := input[PlaidWebhookNewTransactions].(int)
		transaction.Update(itemID, newTransactionsCt)
	case PlaidTransactionsRemoved:
		removedTransactions := input[PlaidWebhookRemovedTransactions].([]string)
		transaction.Remove(itemID, removedTransactions)
	}
}

func handlePlaidItemWebhook(input map[string]interface{}) {
	// itemID := input[PlaidWebhookItemID].(string)
	webhookCode := input[PlaidWebhookCode].(string)

	switch webhookCode {
	case PlaidItemError:
		// TODO send notification
	}
}
