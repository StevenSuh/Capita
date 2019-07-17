package api

import (
	"net/http"
	"time"

	"github.com/go-chi/render"
	uuid "github.com/satori/go.uuid"

	"../db"
)

func CheckCookie(_ http.ResponseWriter, r *http.Request) (*User, error) {
	user := User{}
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

		_, err := CheckCookie(w, r)
		if err != nil {
			render.Status(r, http.StatusUnauthorized)
			render.JSON(w, r, response)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func SetCookie(userID int64, w http.ResponseWriter, _ *http.Request) {
	sessionExpiration := time.Now().AddDate(0, 0, SessionExpirationDuration)
	sessionID := uuid.Must(uuid.NewV4()).String()
	db.Client.MustExec(SQLUpdateSessionById, sessionID, sessionExpiration, userID)

	sessionCookie := &http.Cookie{
		Name:     "session",
		Value:    sessionID,
		HttpOnly: true,
		Secure:   false, // TODO: change to true
		MaxAge:   int(sessionExpiration.Unix()),
	}
	http.SetCookie(w, sessionCookie)
}
