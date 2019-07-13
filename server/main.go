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

// Routes deal with router logic
func Routes() *chi.Mux {
	router := chi.NewRouter()
	router.Use(
		render.SetContentType(render.ContentTypeJSON),
		middleware.Logger,
		middleware.RedirectSlashes,
		middleware.Recoverer,
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
	_, ok := os.LookupEnv("PASSWORD_SALT")
	if !ok {
		panic("PASSWORD_SALT missing")
	}
}
