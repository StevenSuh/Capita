package link

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	plaidLib "github.com/plaid/plaid-go/plaid"

	api ".."
	"../../db"
	"../../plaid"
	"../account"
	"../transaction"
)

type CreateLinkInput struct {
	PublicToken   string `json:"publicToken"`
	InstitutionID string `json:"institutionId"`
	LinkSessionID string `json:"linkSessionId"`
}

type RemoveLinkInput struct {
	linkID string `json:"institutionLinkId"`
}

func Routes() *chi.Mux {
	router := chi.NewRouter()

	router.Use(api.CheckAuth)
	router.Post("/create", CreateInstitutionLink)
	router.Post("/remove", RemoveInstitutionLink)
	router.Get("/poll", GetLinkStatusPoll)

	return router
}

func CreateInstitutionLink(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(api.UserCtx).(api.User)
	response := make(map[string]interface{})
	response["error"] = true
	response["ready"] = false
	defer render.JSON(w, r, response)

	// turn body into json
	var input CreateLinkInput
	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		render.Status(r, http.StatusBadRequest)
		return
	}

	publicToken := input.PublicToken
	res, err := plaid.Client.ExchangePublicToken(publicToken)
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		return
	}

	institutionRes, err := plaid.Client.GetInstitutionByID(input.InstitutionID)
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		return
	}

	// store institution link -- bank connection
	institution := institutionRes.Institution
	institutionLink := api.InstitutionLink{}
	err = db.Client.QueryRow(
		SQLInsert,
		user.ID,
		res.AccessToken,
		res.ItemID,
		input.LinkSessionID,
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

	insertArgs := &InsertArgs{
		User:        user,
		Link:        institutionLink,
		Institution: institution,
		Accounts:    accountsRes.Accounts,
	}
	insertQuery, insertValues := SQLGenerateInsert(insertArgs)

	// store accounts
	accounts := []api.Account{}
	err = db.Client.QueryRow(insertQuery, insertValues...).Scan(&accounts)
	if err != nil {
		render.Status(r, http.StatusBadRequest)
		return
	}

	response["accounts"] = accounts
	response["error"] = false
}

func GetLinkStatusPoll(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(api.UserCtx).(api.User)
	response := make(map[string]interface{})
	response["error"] = true
	response["ready"] = false
	defer render.JSON(w, r, response)

	var count int
	err := db.Client.Get(&count, SQLGetStatus, user.ID)
	if err == nil {
		render.Status(r, http.StatusBadRequest)
		return
	}

	response["error"] = false
	response["ready"] = true
}

func RemoveInstitutionLink(w http.ResponseWriter, r *http.Request) {
	response := make(map[string]interface{})
	response["error"] = false
	defer render.JSON(w, r, response)

	// turn body into json
	var input RemoveLinkInput
	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		render.Status(r, http.StatusBadRequest)
		return
	}

	var count int
	err = db.Client.QueryRow(SQLDeleteByID, input.linkID).Scan(&count)
	if err == nil || count != 1 {
		render.Status(r, http.StatusBadRequest)
		return
	}

	response["error"] = false
}

func InitializeLink(itemID string) {
	end := time.Now()
	endDate := end.Format(api.DateFormatISO)
	start := end.AddDate(-2, 0, 0)
	startDate := start.Format(api.DateFormatISO)

	// get item
	instLink := api.InstitutionLink{}
	err := db.Client.Get(&instLink, SQLSelectByID, itemID)
	if err != nil {
		return
	}

	// get all associated accounts
	accounts := []api.Account{}
	err = db.Client.Select(&accounts, account.SQLSelectByLink, instLink.ID)
	if err != nil {
		return
	}

	// init params for plaid API call
	var transactions []plaidLib.Transaction
	accessToken := instLink.AccessToken
	options := plaidLib.GetTransactionsOptions{
		StartDate:  startDate,
		EndDate:    endDate,
		AccountIDs: []string{},
		Count:      500,
		Offset:     0,
	}

	// get all transactions
	for {
		options.Offset = len(transactions)
		transactionsRes, err := plaid.Client.GetTransactionsWithOptions(accessToken, options)
		if err != nil || transactionsRes.Transactions == nil {
			return
		}

		transactions = append(transactions, transactionsRes.Transactions...)
		if len(transactions) >= transactionsRes.TotalTransactions {
			break
		}
	}

	insertArgs := &transaction.InsertArgs{
		Accounts:     accounts,
		Transactions: transactions,
	}
	insertQuery, insertValues := transaction.SQLGenerateInsert(insertArgs)

	// store transactions
	storedTransactions := []api.Transaction{}
	err = db.Client.QueryRow(insertQuery, insertValues...).Scan(&storedTransactions)
	if err != nil {
		return
	}

	// update link ready
	var count int
	err = db.Client.QueryRow(SQLUpdateReady, itemID).Scan(&count)
	if err != nil || count != 1 {
		return
	}

	// TODO send notification
}
