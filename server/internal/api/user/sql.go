package user

const (
	SQLSelectByEmail             = "SELECT * FROM users WHERE email=$1;"
	SQLInsertByNameEmailPassword = `
		INSERT INTO users
		(name, email, password)
		VALUES ($1, $2, $3)
	`
)
