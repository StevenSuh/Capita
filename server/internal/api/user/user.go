package user

import (
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
)

type User struct {
	ID                int64     `json:"id,omitempty"`
	Name              string    `json:"name"`
	Email             string    `json:"email"`
	Session           string    `json:"session"`
	SessionExpiration time.Time `json:"sessionExpiration"`
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

	cookie, err := r.Cookie(SESSION)
	if err != nil {

	}

	render.JSON(w, r, response)
}

func LoginToAccount(w http.ResponseWriter, r *http.Request) {
	response := make(map[string]bool)

	response["error"] = true
	render.JSON(w, r, response)
}
