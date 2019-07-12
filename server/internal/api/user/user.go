package user

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/lib/pq"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"

	"../../db"
)

type User struct {
	ID                int            `db:"id" json:"id"`
	Name              sql.NullString `db:"name" json:"name"`
	Email             string         `db:"email" json:"email"`
	Password          string         `db:"password" json:"password"`
	Session           sql.NullString `db:"session" json:"session"`
	SessionExpiration pq.NullTime    `db:"session_expiration" json:"sessionExpiration"`
}

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Routes() *chi.Mux {
	router := chi.NewRouter()
	router.Get("/login", GetLoginStatus)
	router.Post("/login", LoginToAccount)

	return router
}

func GetLoginStatus(w http.ResponseWriter, r *http.Request) {
	response := make(map[string]bool)
	response["status"] = false

	session, err := r.Cookie(SESSION)
	if err != nil {
		render.JSON(w, r, response)
		return
	}

	user := User{}
	err = db.Client.Get(&user, "SELECT * FROM users WHERE session=$1;", session)

	if err != nil {
		render.JSON(w, r, response)
		return
	}

	response["status"] = true
	render.JSON(w, r, response)
}

func LoginToAccount(w http.ResponseWriter, r *http.Request) {
	var loginInput LoginInput
	response := make(map[string]bool)
	response["error"] = true

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&loginInput)
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		return
	}

	email := loginInput.Email
	password := loginInput.Password

	user := User{}
	err = db.Client.Get(&user, "SELECT * FROM users WHERE email=$1 AND password=$2;", email, password)

	if err != nil {
		render.Status(r, http.StatusUnauthorized)
		render.JSON(w, r, response)
		return
	}

	response["error"] = false
	render.JSON(w, r, response)
}
