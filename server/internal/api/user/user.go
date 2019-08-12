package user

import (
	"net/http"
	"strings"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"

	api ".."
	"../../db"
	"../sql"
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

	// TODO uncomment below
	// response["error"] = false
	response["user"] = user
}

func LoginToAccount(w http.ResponseWriter, r *http.Request) {
	input := r.Context().Value(api.BodyCtx).(map[string]interface{})
	email := input["email"].(string)
	password := input["password"].(string)

	response := make(map[string]interface{})
	response["error"] = true
	response["msg"] = "Invalid login information - Please try again"
	defer render.JSON(w, r, response)

	// TODO: validation for all input
	if !ValidatePassword(password) {
		render.Status(r, http.StatusBadRequest)
		return
	}

	// retrieving user; check user password
	user := db.User{}
	err := db.Client.Get(&user, sql.UserSQLSelectByEmail, email)
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
	input := r.Context().Value(api.BodyCtx).(map[string]interface{})
	name := input["name"].(string)
	email := input["email"].(string)
	password := input["password"].(string)

	response := make(map[string]interface{})
	response["error"] = true
	response["msg"] = "Error occurred while registering account - Please try again"
	defer render.JSON(w, r, response)

	// TODO: validation for all input
	if !ValidatePassword(password) {
		render.Status(r, http.StatusBadRequest)
		return
	}

	EncryptPassword(&password)

	user := db.User{}
	err := db.Client.QueryRow(sql.UserSQLInsert, name, email, password).Scan(&user)
	if err != nil {
		if i := strings.Index(err.Error(), "email"); i > -1 {
			response["msg"] = "An account with this email already exists"
		}
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
