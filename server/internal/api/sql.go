package api

const (
	SQLUpdateSessionById = `
		UPDATE users
		SET session=$1, session_expiration=$2
		WHERE id=$3;
	`
)
