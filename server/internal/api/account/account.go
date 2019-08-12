package account

import (
	"github.com/go-chi/chi"

	api ".."
)

func Routes() *chi.Mux {
	router := chi.NewRouter()

	router.Use(api.CheckAuth)

	return router
}
