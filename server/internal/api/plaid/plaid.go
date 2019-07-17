package plaid

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/go-chi/render"
	"github.com/plaid/plaid-go/plaid"
)

const clientOptions = plaid.ClientOptions{
	os.Getenv("PLAID_CLIENT_ID"),
	os.Getenv("PLAID_SECRET"),
	os.Getenv("PLAID_PUBLIC_KEY"),
	plaid.Sandbox,
	&http.Client{},
}

var client, _ = plaid.NewClient(clientOptions)

var accessToken string
var itemID string

type PlaidInput struct {
	PublicToken string `json:"publicToken"`
}

func GetAccessToken(w http.ResponseWriter, r *http.Request) {
	response := make(map[string]interface{})
	response["error"] = true
	defer render.JSON(w, r, response)

	// turn body into json
	var input PlaidInput
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
