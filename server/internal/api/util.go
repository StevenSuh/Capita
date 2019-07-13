package api

import (
	"database/sql"
	"net/http"

	"github.com/go-chi/render"
	"github.com/lib/pq"

	"../db"
)

type User struct {
	ID                int            `db:"id" json:"id"`
	Name              sql.NullString `db:"name" json:"name"`
	Email             string         `db:"email" json:"email"`
	Password          string         `db:"password" json:"password"`
	Session           sql.NullString `db:"session" json:"session"`
	SessionExpiration pq.NullTime    `db:"session_expiration" json:"sessionExpiration"`
}

func CheckCookie(_ http.ResponseWriter, r *http.Request) bool {
	session, err := r.Cookie(SESSION)
	if err != nil {
		return false
	}

	user := User{}
	err = db.Client.Get(&user, "SELECT * FROM users WHERE session=$1;", session)

	if err != nil {
		return false
	}

	return true
}

func CheckAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		response := make(map[string]interface{})
		response["error"] = true
		response["msg"] = "You need to login to access the page"

		if !CheckCookie(w, r) {
			render.Status(r, http.StatusUnauthorized)
			render.JSON(w, r, response)
			return
		}
		next.ServeHTTP(w, r)
	})
}
