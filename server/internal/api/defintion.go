package api

import (
	"database/sql"

	"github.com/lib/pq"
)

type User struct {
	ID                int64          `db:"id" json:"id"`
	Name              sql.NullString `db:"name" json:"name"`
	Email             string         `db:"email" json:"email"`
	Password          string         `db:"password" json:"-"`
	Session           sql.NullString `db:"session" json:"-"`
	SessionExpiration pq.NullTime    `db:"session_expiration" json:"-"`
}

type Account struct {
	ID int64 `db:"id" json:"id"`
}

const (
	Session                   = "session"
	SessionExpirationDuration = 30
)
