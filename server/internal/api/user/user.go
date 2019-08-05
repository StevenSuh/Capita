package user

import (
	"encoding/json"
	"net/http"
	"strconv"

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
	defer render.JSON(w, r, response)

	user, err := api.CheckCookie(w, r)
	if err != nil {
		return
	}

	// response["error"] = false
	response["user"] = user
}

func LoginToAccount(w http.ResponseWriter, r *http.Request) {
	response := make(map[string]interface{})
	response["error"] = true
	response["msg"] = "Invalid login information - Please try again"
	defer render.JSON(w, r, response)

	// turn body into json
	var input LoginInput
	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		render.Status(r, http.StatusBadRequest)
		return
	}

	email := input.Email
	password := input.Password

	// TODO: validation for all input
	if !ValidatePassword(password) {
		render.Status(r, http.StatusBadRequest)
		return
	}

	// retrieving user; check user password
	user := api.User{}
	err = db.Client.Get(&user, SQLSelectByEmail, email)
	if err != nil {
		render.Status(r, http.StatusUnauthorized)
		return
	}

	if !ConfirmPassword(user.Password, password) {
		render.Status(r, http.StatusUnauthorized)
		return
	}

	api.SetCookie(user.ID, w, r)
	response["error"] = false
	response["msg"] = "Login successful"
	response["user"] = user
}

func RegisterAccount(w http.ResponseWriter, r *http.Request) {
	response := make(map[string]interface{})
	response["error"] = true
	response["msg"] = "Error occurred while registering account - Please try again"
	defer render.JSON(w, r, response)

	// turn body into json
	var input LoginInput
	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		render.Status(r, http.StatusBadRequest)
		return
	}

	name := input.Name
	email := input.Email
	password := input.Password

	// TODO: validation for all input
	if !ValidatePassword(password) {
		render.Status(r, http.StatusBadRequest)
		return
	}

	EncryptPassword(&password)

	user := api.User{}
	err = db.Client.Get(&user, SQLSelectByEmail, email)
	if err == nil {
		response["msg"] = "An account with this email already exists"
		render.Status(r, http.StatusBadRequest)
		return
	}

	err = db.Client.QueryRow(SQLInsert, name, email, password).Scan(&user)
	if err != nil {
		render.Status(r, http.StatusBadRequest)
		return
	}

	api.SetCookie(user.ID, w, r)
	response["error"] = false
	response["msg"] = "Registration success"
	response["user"] = user
}

func GetConnectedAccounts(w http.ResponseWriter, r *http.Request) {
	// userID := chi.URLParam(r, "userId")
	response := make(map[string]interface{})
	response["error"] = false
	response["accounts"] = []string{}
	defer render.JSON(w, r, response)
}

func GetTransactions(w http.ResponseWriter, r *http.Request) {
	// userID := chi.URLParam(r, "userId")
	response := make(map[string]interface{})
	response["error"] = false
	response["transactions"] = []api.Transaction{}
	defer render.JSON(w, r, response)

	query := r.URL.Query()

	recurring := query.Get("recurring") == "true"
	limit := api.DefaultLimit
	if query.Get("limit") != "" {
		parsed, err := strconv.Atoi(query.Get("limit"))
		if err == nil {
			limit = parsed
		}
	}
	offset := api.DefaultOffset
	if query.Get("offset") != "" {
		parsed, err := strconv.Atoi(query.Get("offset"))
		if err == nil {
			offset = parsed
		}
	}

	response["recurring"] = recurring
	response["limit"] = limit
	response["offset"] = offset
}
