package sql

const (
	ApiSQLUpdateSessionById = `
		UPDATE users
		SET session=$1, session_expiration=$2
		WHERE id=$3;
	`
)
