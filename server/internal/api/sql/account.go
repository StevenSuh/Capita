package sql

const (
	AccountSQLSelectByLink = `
    SELECT * FROM accounts
    WHERE institution_link_id = $1;
  `
)
