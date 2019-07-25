package plaid

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/plaid/plaid-go/plaid"
)

type PlaidLinkInput struct {
	PublicToken   string               `json:"publicToken"`
	Accounts      []PlaidLinkAccount   `json:"accounts"`
	Institution   PlaidLinkInstitution `json:"institution"`
	LinkSessionID string               `json:"linkSessionId"`
}

type PlaidLinkAccount struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Mask    string `json:"mask"`
	Type    string `json:"type"`
	Subtype string `json:"subtype"`
}

type PlaidLinkInstitution struct {
	Name          string `json:"name"`
	InstitutionID string `json:"institution_id"`
}

var clientOptions = plaid.ClientOptions{
	ClientID:    os.Getenv("PLAID_CLIENT_ID"),
	Secret:      os.Getenv("PLAID_SECRET"),
	PublicKey:   os.Getenv("PLAID_PUBLIC_KEY"),
	Environment: getPlaidEnv(),
	HTTPClient:  &http.Client{},
}

var client, _ = plaid.NewClient(clientOptions)

var accessToken string
var itemID string

func getPlaidEnv() (plaidEnv plaid.Environment) {
	fmt.Println("Plaid:", os.Getenv("PLAID_ENV"))

	switch env := os.Getenv("PLAID_ENV"); env {
	case "development":
		return plaid.Development
	case "production":
		return plaid.Production
	default:
		return plaid.Sandbox
	}
}

func Routes() *chi.Mux {
	router := chi.NewRouter()
	router.Post("/create_institution_link", CreateInstitutionLink)
	router.Get("/auth", GetAuth)
	router.Get("/accounts", GetAccounts)

	return router
}

func CreateInstitutionLink(w http.ResponseWriter, r *http.Request) {
	response := make(map[string]interface{})
	response["error"] = true
	defer render.JSON(w, r, response)

	// turn body into json
	var input PlaidLinkInput
	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, response)
		return
	}

	publicToken := input.PublicToken
	res, err := client.ExchangePublicToken(publicToken)
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		return
	}

	fmt.Println(input)
	fmt.Println(res)

	accessToken = res.AccessToken
	itemID = res.ItemID

	response["error"] = false
}

func GetAuth(w http.ResponseWriter, r *http.Request) {
	response := make(map[string]interface{})
	response["error"] = true
	defer render.JSON(w, r, response)

	res, err := client.GetAuth(accessToken)
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		return
	}

	fmt.Println(res)

	response["error"] = false
}

func GetAccounts(w http.ResponseWriter, r *http.Request) {
	response := make(map[string]interface{})
	response["error"] = true
	defer render.JSON(w, r, response)

	res, err := client.GetAccounts(accessToken)
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		return
	}

	fmt.Println(res)

	response["error"] = false
}
