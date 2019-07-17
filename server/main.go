package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/render"

	"./internal/api/user"
	"./internal/db"
)

var env string

// Routes deal with router logic
func Routes() *chi.Mux {
	router := chi.NewRouter()
	noCache := middleware.NoCache

	if env == "production" {
		noCache = nil
	}

	router.Use(
		render.SetContentType(render.ContentTypeJSON),
		middleware.Logger,
		middleware.RedirectSlashes,
		middleware.Recoverer,
		noCache,
	)

	router.Route("/api", func(r chi.Router) {
		r.Mount("/user", user.Routes())
	})

	return router
}

func main() {
	CheckEnv()

	db.InitDb()
	defer db.Client.Close()

	router := Routes()
	log.Fatal(http.ListenAndServe(":8080", router))
}

func CheckEnv() {
	devEnv, ok := os.LookupEnv("ENV")
	if !ok {
		devEnv = "development"
	}
	env = devEnv

	_, ok = os.LookupEnv("PASSWORD_SALT")
	if !ok {
		panic("PASSWORD_SALT missing")
	}

	_, ok = os.LookupEnv("PLAID_CLIENT_ID")
	if !ok {
		panic("PLAID_CLIENT_ID missing")
	}

	_, ok = os.LookupEnv("PLAID_SECRET")
	if !ok {
		panic("PLAID_SECRET missing")
	}

	_, ok = os.LookupEnv("PLAID_PUBLIC_KEY")
	if !ok {
		panic("PLAID_PUBLIC_KEY missing")
	}
}
