package user

import (
	"fmt"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"

	"../../db"
)

type User struct {
	ID                int64     `db:"id" json:"id,omitempty"`
	Name              string    `db:"name" json:"name"`
	Email             string    `db:"email" json:"email"`
	Session           string    `db:"session" json:"session"`
	SessionExpiration time.Time `db:"session_expiration" json:"sessionExpiration"`
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
	db.Client.Get(&user, "SELECT * FROM users WHERE session=$1", session)

	fmt.Printf("%#v\n", user)

	response["status"] = true
	render.JSON(w, r, response)
}

func LoginToAccount(w http.ResponseWriter, r *http.Request) {
	response := make(map[string]bool)

	response["error"] = true
	render.JSON(w, r, response)
}
