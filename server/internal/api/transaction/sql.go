package transaction

import (
	"fmt"

	"github.com/plaid/plaid-go/plaid"

	api ".."
)

type InsertArgs struct {
	Accounts     []api.Account
	Transactions []plaid.Transaction
}

// UserID                 int64          `db:"user_id" json:"userId"`
// AccountID              int64          `db:"account_id" json:"accountId"`
// PlaidTransactionID     string         `db:"plaid_transaction_id" json:"plaidTransactionId"`
// Name                   string         `db:"name" json:"name"`
// Category               string         `db:"category" json:"category"`
// Amount                 float64        `db:"amount" json:"amount"`
// IsoCurrencyCode        sql.NullString `db:"iso_currency_code" json:"IsoCurrencyCode"`
// UnofficialCurrencyCode sql.NullString `db:"unofficial_currency_code" json:"unofficialCurrencyCode"`
// Date                   string         `db:"date" json:"date"`
// Pending                bool           `db:"pending" json:"pending"`
// Recurring              bool           `db:"recurring" json:"recurring"`
// ManuallyCreated        bool           `db:"manually_created" json:"manuallyCreated"`

func SQLGenerateInsert(args *InsertArgs) (insertQuery string, insertValues []interface{}) {
	query := `
    INSERT INTO transactions
    (
      user_id,
      account_id,
      plaid_transaction_id,
      name,
      category,
      type,
      amount,
      iso_currency_code,
      unofficial_currency_code,
      date,
      pending,
      recurring,
      manually_created
    )
    VALUES
  `
	ending := `RETURNING *;`
	numCols := 13
	var values []interface{}

	for i, transaction := range args.Transactions {
		var indexes []interface{}
		for j := numCols*i + 1; j <= numCols*(i+1); j++ {
			indexes = append(indexes, j)
		}

		query += fmt.Sprintf(
			"($%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d)",
			indexes...,
		)

		var account api.Account
		for _, currAccount := range args.Accounts {
			if currAccount.PlaidAccountID == transaction.AccountID {
				account = currAccount
				break
			}
		}

		recurring := false
		for _, category := range transaction.Category {
			if category == Subscription {
				recurring = true
				break
			}
		}

		values = append(
			values,
			account.UserID,
			account.ID,
			transaction.ID,
			transaction.Name,
			transaction.Category[0],
			transaction.Type,
			transaction.Amount,
			transaction.ISOCurrencyCode,
			transaction.UnofficialCurrencyCode,
			transaction.Date,
			transaction.Pending,
			recurring,
			false,
		)
	}
	query += ending

	return query, values
}
