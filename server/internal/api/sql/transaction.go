package sql

import (
	"fmt"

	sq "github.com/Masterminds/squirrel"
	"github.com/plaid/plaid-go/plaid"

	"../../db"
)

const (
	TransactionSQLGetCountOfRecurringByName = `
    SELECT COUNT(id) FROM transactions
    WHERE
      name = $1 AND
      recurring = true;
  `
	TransactionSQLDeleteByPlaidIDs = `
    DELETE FROM transactions
    WHERE plaid_transaction_id IN ($1);
  `
)

func TransactionSQLGet(values map[string]interface{}) (string, []interface{}, error) {
	transactions := sq.Select("*").From("transactions")

	argsBuilder := sq.Eq{}

	for key, value := range values {
		argsBuilder[key] = value
	}

	sql, args, err := transactions.Where(argsBuilder).ToSql()
	return sql, args, err
}

type TransactionInsertArgs struct {
	Accounts     []db.Account
	Transactions []plaid.Transaction
}

func TransactionSQLGenerateInsert(args *TransactionInsertArgs) (insertQuery string, insertValues []interface{}) {
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

		var account db.Account
		for _, currAccount := range args.Accounts {
			if currAccount.PlaidAccountID == transaction.AccountID {
				account = currAccount
				break
			}
		}

		recurring := false
		for _, category := range transaction.Category {
			if category == "Subscription" {
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
