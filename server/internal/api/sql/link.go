package sql

import (
	"fmt"

	"github.com/plaid/plaid-go/plaid"

	"../../db"
)

const (
	LinkSQLSelectByID = `SELECT * FROM institution_links WHERE id = $1;`
	LinkSQLInsert     = `
		INSERT INTO institution_links
		(
      user_id,
      access_token,
      plaid_item_id,
      link_session_id,
      plaid_institution_id,
      institution_name,
      institution_url,
      institution_logo
    )
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING *;
  `
	LinkSQLUpdateReady = `
    UPDATE institution_links
    SET ready = true
    WHERE id = $1;
  `
	LinkSQLGetStatus = `
    SELECT COUNT(id) FROM institution_links
    WHERE
      user_id = $1 AND
      ready = false;
  `
	LinkSQLDeleteByID = `DELETE FROM institution_links WHERE id = $1;`
)

type LinkInsertArgs struct {
	User        db.User
	Link        db.InstitutionLink
	Institution plaid.Institution
	Accounts    []plaid.Account
}

func LinkSQLGenerateInsert(args *LinkInsertArgs) (insertQuery string, insertValues []interface{}) {
	query := `
    INSERT INTO institution_links
    (
      user_id,
      institution_link_id,
      plaid_account_id,
      mask,
      name,
      official_name,
      subtype,
      type,
      verification_status,
      balance_available,
      balance_current,
      balance_limit,
      balance_iso_currency_code,
      balance_unofficial_currency_code,
      institution_name,
      institution_logo
    )
    VALUES
  `
	ending := `RETURNING *;`
	numValues := 16
	var values []interface{}

	for i, account := range args.Accounts {
		var indexes []interface{}
		for j := numValues*i + 1; j <= numValues*(i+1); j++ {
			indexes = append(indexes, j)
		}

		query += fmt.Sprintf(
			"($%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d)",
			indexes...,
		)
		values = append(
			values,
			args.User.ID,
			args.Link.ID,
			account.AccountID,
			account.Mask,
			account.Name,
			account.OfficialName,
			account.Subtype,
			account.Type,
			account.VerificationStatus,
			account.Balances.Available,
			account.Balances.Current,
			account.Balances.Limit,
			account.Balances.ISOCurrencyCode,
			account.Balances.UnofficialCurrencyCode,
			args.Institution.Name,
			args.Institution.Logo,
		)
	}
	query += ending

	return query, values
}
