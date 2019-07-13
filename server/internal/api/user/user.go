package user

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/lib/pq"
	uuid "github.com/satori/go.uuid"

	api ".."
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
	response := make(map[string]bool)
	response["status"] = false

	if !api.CheckCookie(w, r) {
		render.JSON(w, r, response)
		return
	}

	response["status"] = true
	render.JSON(w, r, response)
}

func LoginToAccount(w http.ResponseWriter, r *http.Request) {
	var loginInput LoginInput

	response := make(map[string]interface{})
	response["error"] = true
	response["msg"] = "Invalid login information - Please try again"

	// turn body into json
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&loginInput)
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, response)
		return
	}

	email := loginInput.Email
	password := loginInput.Password
	if !ValidatePassword(password) {
		render.Status(r, http.StatusUnauthorized)
		render.JSON(w, r, response)
		return
	}

	// retrieving user; check user password
	user := User{}
	err = db.Client.Get(&user, "SELECT * FROM users WHERE email=$1;", email)
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

	// correct credentials; updating user
	sessionExpiration := time.Now()
	sessionID := uuid.Must(uuid.NewV4()).String()
	db.Client.MustExec(`
		UPDATE users
		SET session=$1, session_expiration=$2
		WHERE email=$3;
	`, sessionID, sessionExpiration, email)

	// success + set cookie
	sessionCookie := &http.Cookie{
		Name:     "session",
		Value:    sessionID,
		HttpOnly: true,
		Secure:   false, // TODO: change to true
		MaxAge:   int(sessionExpiration.Unix()),
	}
	http.SetCookie(w, sessionCookie)

	response["error"] = false
	response["msg"] = "Login successful"
	render.JSON(w, r, response)
}

func RegisterAccount(w http.ResponseWriter, r *http.Request) {
	var loginInput LoginInput

	response := make(map[string]interface{})
	response["error"] = true
	response["msg"] = "Error occurred while registering account - Please try again"

	// turn body into json
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&loginInput)
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, response)
		return
	}

	name := loginInput.Name
	email := loginInput.Email
	password := loginInput.Password
	if !ValidatePassword(password) {
		render.Status(r, http.StatusUnauthorized)
		render.JSON(w, r, response)
		return
	}

	EncryptPassword(&password)

	db.Client.MustExec(`
		INSERT INTO users
		(name, email, password)
		VALUES ($1, $2, $3)
	`, name, email, password)

	response["error"] = false
	response["msg"] = "Registration success"
	render.JSON(w, r, response)
}
