package api

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/render"
	uuid "github.com/satori/go.uuid"

	"../db"
	"./sql"
)

func CheckCookie(_ http.ResponseWriter, r *http.Request) (*db.User, error) {
	user := db.User{}
	session, err := r.Cookie(Session)
	if err != nil {
		return nil, err
	}

	err = db.Client.Get(&user, "SELECT * FROM users WHERE session=$1;", session.Value)
	if err != nil {
		return nil, err
	}

	if time.Now().After(user.SessionExpiration.Time) {
		return nil, err
	}

	return &user, nil
}

func CheckAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		response := make(map[string]interface{})
		response["error"] = true
		response["msg"] = "You need to login to access the page"

		user, err := CheckCookie(w, r)
		if err != nil {
			render.Status(r, http.StatusUnauthorized)
			render.JSON(w, r, response)
			return
		}

		ctx := context.WithValue(r.Context(), UserCtx, user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func SetCookie(userID int64, w http.ResponseWriter, _ *http.Request) {
	sessionExpiration := time.Now().AddDate(0, 0, SessionExpirationDuration)
	sessionID := uuid.Must(uuid.NewV4()).String()
	db.Client.MustExec(sql.ApiSQLUpdateSessionById, sessionID, sessionExpiration, userID)

	sessionCookie := &http.Cookie{
		Name:     "session",
		Value:    sessionID,
		HttpOnly: true,
		Secure:   false, // TODO: change to true
		MaxAge:   int(sessionExpiration.Unix()),
	}
	http.SetCookie(w, sessionCookie)
}

func ParseBody(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Body == http.NoBody {
			next.ServeHTTP(w, r)
			return
		}

		response := make(map[string]interface{})
		response["error"] = true
		response["msg"] = "Invalid input"

		var input map[string]interface{}
		err := json.NewDecoder(r.Body).Decode(&input)
		if err != nil {
			render.Status(r, http.StatusBadRequest)
			render.JSON(w, r, response)
			return
		}

		ctx := context.WithValue(r.Context(), BodyCtx, input)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
