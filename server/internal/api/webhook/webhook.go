package webhook

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"

	"../link"
	"../transaction"
)

func Routes() *chi.Mux {
	router := chi.NewRouter()

	router.Post("/plaid", Plaid)

	return router
}

func Plaid(w http.ResponseWriter, r *http.Request) {
	response := make(map[string]interface{})
	response["error"] = false
	render.JSON(w, r, response)

	var input map[string]interface{}
	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		render.Status(r, http.StatusBadRequest)
		return
	}

	switch webhookType := input[PlaidWebhookType]; webhookType {
	case PlaidAuth:
		handlePlaidAuthWebhook(input)
	case PlaidTransactions:
		handlePlaidTransactionsWebhook(input)
	case PlaidItem:
		handlePlaidItemWebhook(input)
	}
}

func handlePlaidAuthWebhook(input map[string]interface{}) {
	// switch webhookCode := input[PlaidWebhookCode]; webhookCode {

	// }
}

func handlePlaidTransactionsWebhook(input map[string]interface{}) {
	itemID := input[PlaidWebhookItemID].(string)

	switch webhookCode := input[PlaidWebhookCode]; webhookCode {
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
	// switch webhookCode := input[PlaidWebhookCode]; webhookCode {

	// }
}
