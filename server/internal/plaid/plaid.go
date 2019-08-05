package plaid

import (
	"fmt"
	"net/http"
	"os"

	"github.com/plaid/plaid-go/plaid"
)

type PlaidLinkAccount struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Mask    string `json:"mask"`
	Type    string `json:"type"`
	Subtype string `json:"subtype"`
}

var clientOptions = plaid.ClientOptions{
	ClientID:    os.Getenv("PLAID_CLIENT_ID"),
	Secret:      os.Getenv("PLAID_SECRET"),
	PublicKey:   os.Getenv("PLAID_PUBLIC_KEY"),
	Environment: getPlaidEnv(),
	HTTPClient:  &http.Client{},
}

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

var Client, _ = plaid.NewClient(clientOptions)
