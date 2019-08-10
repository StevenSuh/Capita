package transaction

import (
	"sync"
	"time"

	plaidLib "github.com/plaid/plaid-go/plaid"

	api ".."
	"../../db"
	"../../plaid"
	"../sql"
)

func Update(itemID string, newTransactionsCt int) {
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

	end := time.Now()
	endDate := end.Format(api.DateFormatISO)
	start := end.AddDate(0, 0, -1) // 2 years earlier
	startDate := start.Format(api.DateFormatISO)

	options := plaidLib.GetTransactionsOptions{
		StartDate:  startDate,
		EndDate:    endDate,
		AccountIDs: []string{}, // empty [] means all accounts
		Count:      newTransactionsCt,
		Offset:     0,
	}

	transactionsRes, err := plaid.Client.GetTransactionsWithOptions(instLink.AccessToken, options)
	if err != nil || transactionsRes.Transactions == nil {
		return
	}

	var wg sync.WaitGroup
	for _, transaction := range transactionsRes.Transactions {
		wg.Add(1)
		go determineAndSetRecurring(&transaction, &wg)
	}
	wg.Wait()

	// store transactions
	storedTransactions := []db.Transaction{}
	insertArgs := &sql.TransactionInsertArgs{
		Accounts:     accounts,
		Transactions: transactionsRes.Transactions,
	}
	insertQuery, insertValues := sql.TransactionSQLGenerateInsert(insertArgs)
	err = db.Client.QueryRow(insertQuery, insertValues...).Scan(&storedTransactions)
	if err != nil {
		return
	}

	// TODO send notification
}

func Remove(itemID string, removedTransactions []string) {

}

func GetAllTransactions(accessToken string, startDate string, endDate string) []plaidLib.Transaction {
	var transactions []plaidLib.Transaction
	options := plaidLib.GetTransactionsOptions{
		StartDate:  startDate,
		EndDate:    endDate,
		AccountIDs: []string{}, // empty [] means all accounts
		Count:      500,
		Offset:     0,
	}

	// get all transactions
	for {
		options.Offset = len(transactions)
		transactionsRes, err := plaid.Client.GetTransactionsWithOptions(accessToken, options)
		if err != nil || transactionsRes.Transactions == nil {
			return nil
		}

		transactions = append(transactions, transactionsRes.Transactions...)
		if len(transactions) >= transactionsRes.TotalTransactions {
			break
		}
	}

	return transactions
}

func determineAndSetRecurring(transaction *plaidLib.Transaction, wg *sync.WaitGroup) {
	defer wg.Done()

	for _, category := range transaction.Category {
		if category == "Subscription" {
			return
		}
	}

	// see if equally named transaction exists as recurring
	var count int
	err := db.Client.Get(&count, sql.TransactionSQLGetCountOfRecurringByName, transaction.Name)
	if err != nil || count == 0 {
		return
	}

	transaction.Category = append(transaction.Category, Subscription)
}
