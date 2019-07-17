package user

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"

	api ".."
	"../../db"
)

type LoginInput struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Routes() *chi.Mux {
	router := chi.NewRouter()
	router.Get("/login", GetLoginStatus)
	router.Post("/login", LoginToAccount)
	router.Post("/register", RegisterAccount)
	router.Get("/{userID}/accounts", GetConnectedAccounts)
	router.Get("/{userID}/transactions", GetTransactions)

	return router
}

func GetLoginStatus(w http.ResponseWriter, r *http.Request) {
	response := make(map[string]interface{})
	response["error"] = true

	user, err := api.CheckCookie(w, r)
	if err != nil {
		render.JSON(w, r, response)
		return
	}

	// response["error"] = false
	response["user"] = user
	render.JSON(w, r, response)
}

func LoginToAccount(w http.ResponseWriter, r *http.Request) {
	response := make(map[string]interface{})
	response["error"] = true
	response["msg"] = "Invalid login information - Please try again"

	// turn body into json
	var input LoginInput
	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, response)
		return
	}

	email := input.Email
	password := input.Password

	// TODO: validation for all input
	if !ValidatePassword(password) {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, response)
		return
	}

	// retrieving user; check user password
	user := api.User{}
	err = db.Client.Get(&user, SQLSelectByEmail, email)
	if err != nil {
		render.Status(r, http.StatusUnauthorized)
		render.JSON(w, r, response)
		return
	}

	if !ConfirmPassword(user.Password, password) {
		render.Status(r, http.StatusUnauthorized)
		render.JSON(w, r, response)
		return
	}

	api.SetCookie(user.ID, w, r)
	response["error"] = false
	response["msg"] = "Login successful"
	render.JSON(w, r, response)
}

func RegisterAccount(w http.ResponseWriter, r *http.Request) {
	response := make(map[string]interface{})
	response["error"] = true
	response["msg"] = "Error occurred while registering account - Please try again"

	// turn body into json
	var input LoginInput
	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, response)
		return
	}

	name := input.Name
	email := input.Email
	password := input.Password

	// TODO: validation for all input
	if !ValidatePassword(password) {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, response)
		return
	}

	EncryptPassword(&password)

	result := db.Client.MustExec(SQLInsertByNameEmailPassword, name, email, password)
	userID, _ := result.LastInsertId()

	api.SetCookie(userID, w, r)
	response["error"] = false
	response["msg"] = "Registration success"
	render.JSON(w, r, response)
}

func GetConnectedAccounts(w http.ResponseWriter, r *http.Request) {
	// userID := chi.URLParam(r, "userId")
	response := make(map[string]interface{})
	response["error"] = false
	response["accounts"] = []string{}

	render.JSON(w, r, response)
}

func GetTransactions(w http.ResponseWriter, r *http.Request) {
	// userID := chi.URLParam(r, "userId")
	recurring := false
	response := make(map[string]interface{})
	response["error"] = false
	response["transactions"] = []string{}

	keys, ok := r.URL.Query()["recurring"]
	if ok && len(keys[0]) > 0 {
		fmt.Println(keys[0])
		if keys[0] == "true" {
			recurring = true
		} else {
			recurring = false
		}
	}

	response["recurring"] = recurring
	render.JSON(w, r, response)
}
