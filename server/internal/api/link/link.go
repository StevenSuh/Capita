package link

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"

	api ".."
	"../../db"
	"../../plaid"
)

type LinkInput struct {
	PublicToken   string `json:"publicToken"`
	InstitutionID string `json:"institutionId"`
	LinkSessionID string `json:"linkSessionId"`
}

func Routes() *chi.Mux {
	router := chi.NewRouter()

	router.Use(api.CheckAuth)
	router.Post("/create", CreateInstitutionLink)

	return router
}

func CreateInstitutionLink(w http.ResponseWriter, r *http.Request) {
	response := make(map[string]interface{})
	response["error"] = true
	defer render.JSON(w, r, response)

	// turn body into json
	var input LinkInput
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

	user := r.Context().Value(api.UserCtx).(api.User)

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
	defer AnalyzeAccounts(accounts)
}

func AnalyzeAccounts(accounts []api.Account) {
	fmt.Println(accounts)
}
