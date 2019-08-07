package account

const (
	SQLSelectByLink = `
    SELECT * FROM accounts
    WHERE institution_link_id = $1;
  `
)
