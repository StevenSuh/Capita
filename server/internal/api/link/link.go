package link

import (
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"

	api ".."
	"../../db"
	"../../plaid"
	"../sql"
	"../transaction"
)

func Routes() *chi.Mux {
	router := chi.NewRouter()

	router.Use(api.CheckAuth)
	router.Post("/create", CreateInstitutionLink)
	router.Post("/delete", DeleteInstitutionLink)
	router.Get("/poll", GetLinkStatusPoll)

	return router
}

func CreateInstitutionLink(w http.ResponseWriter, r *http.Request) {
	input := r.Context().Value(api.BodyCtx).(map[string]interface{})
	user := r.Context().Value(api.UserCtx).(db.User)

	publicToken := input["publicToken"].(string)
	institutionID := input["institutionID"].(string)
	linkSessionID := input["linkSessionID"].(string)

	response := make(map[string]interface{})
	response["error"] = true
	response["ready"] = false
	defer render.JSON(w, r, response)

	res, err := plaid.Client.ExchangePublicToken(publicToken)
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		return
	}

	institutionRes, err := plaid.Client.GetInstitutionByID(institutionID)
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		return
	}

	// store institution link -- bank connection
	institution := institutionRes.Institution
	institutionLink := db.InstitutionLink{}
	err = db.Client.QueryRow(
		sql.LinkSQLInsert,
		user.ID,
		res.AccessToken,
		res.ItemID,
		linkSessionID,
		institution.ID,
		institution.Name,
		institution.URL,
		institution.Logo,
	).Scan(&institutionLink)
	if err != nil {
		render.Status(r, http.StatusBadRequest)
		return
	}

	// retrieve accounts
	accountsRes, err := plaid.Client.GetAccounts(res.AccessToken)
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		return
	}

	insertArgs := &sql.LinkInsertArgs{
		User:        user,
		Link:        institutionLink,
		Institution: institution,
		Accounts:    accountsRes.Accounts,
	}
	insertQuery, insertValues := sql.LinkSQLGenerateInsert(insertArgs)

	// store accounts
	accounts := []db.Account{}
	err = db.Client.QueryRow(insertQuery, insertValues...).Scan(&accounts)
	if err != nil {
		render.Status(r, http.StatusBadRequest)
		return
	}

	response["accounts"] = accounts
	response["error"] = false
}

func GetLinkStatusPoll(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(api.UserCtx).(db.User)
	response := make(map[string]interface{})
	response["done"] = false
	defer render.JSON(w, r, response)

	var count int
	err := db.Client.Get(&count, sql.LinkSQLGetStatus, user.ID)
	if err != nil {
		render.Status(r, http.StatusBadRequest)
		return
	}

	response["done"] = count == 0
}

func DeleteInstitutionLink(w http.ResponseWriter, r *http.Request) {
	input := r.Context().Value(api.BodyCtx).(map[string]interface{})
	institutionLinkId := input["institutionLinkId"].(string)

	response := make(map[string]interface{})
	response["error"] = false
	defer render.JSON(w, r, response)

	var count int
	err := db.Client.QueryRow(sql.LinkSQLDeleteByID, institutionLinkId).Scan(&count)
	if err != nil || count != 1 {
		render.Status(r, http.StatusBadRequest)
		return
	}

	response["error"] = false
}

// InitializeLink - retrieves and stores all transactions associated to a link
// called when Plaid sends a webhook code of HISTORICAL_UPDATE
func InitializeLink(itemID string) {
	// get item
	instLink := db.InstitutionLink{}
	err := db.Client.Get(&instLink, sql.LinkSQLSelectByID, itemID)
	if err != nil {
		return
	}

	// get all associated accounts
	accounts := []db.Account{}
	err = db.Client.Select(&accounts, sql.AccountSQLSelectByLink, instLink.ID)
	if err != nil {
		return
	}

	// init params for GetAllTransactions
	end := time.Now()
	endDate := end.Format(api.DateFormatISO)
	start := end.AddDate(-2, 0, 0) // 2 years earlier
	startDate := start.Format(api.DateFormatISO)

	transactions := transaction.GetAllTransactions(instLink.AccessToken, startDate, endDate)
	if transactions == nil {
		return
	}

	// store transactions
	storedTransactions := []db.Transaction{}
	insertArgs := &sql.TransactionInsertArgs{
		Accounts:     accounts,
		Transactions: transactions,
	}
	insertQuery, insertValues := sql.TransactionSQLGenerateInsert(insertArgs)
	err = db.Client.QueryRow(insertQuery, insertValues...).Scan(&storedTransactions)
	if err != nil {
		return
	}

	// update link to ready
	var count int
	err = db.Client.QueryRow(sql.LinkSQLUpdateReady, itemID).Scan(&count)
	if err != nil || count != 1 {
		return
	}

	// TODO send notification
}
