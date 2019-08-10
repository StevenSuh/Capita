package account

import (
	"fmt"

	"github.com/go-chi/chi"

	api ".."
	"../../db"
)

func Routes() *chi.Mux {
	router := chi.NewRouter()

	router.Use(api.CheckAuth)

	return router
}

func AnalyzeAccounts(accounts []db.Account) {
	fmt.Println(accounts)
}
