package sql

const (
	UserSQLSelectByID    = "SELECT * FROM users WHERE id=$1;"
	UserSQLSelectByEmail = "SELECT * FROM users WHERE email=$1;"
	UserSQLInsert        = `
		INSERT INTO users
		(name, email, password)
		VALUES ($1, $2, $3)
		RETURNING *;
	`
)
