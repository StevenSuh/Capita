package account

import (
	"fmt"

	"github.com/go-chi/chi"

	api ".."
)

func Routes() *chi.Mux {
	router := chi.NewRouter()

	router.Use(api.CheckAuth)

	return router
}

func AnalyzeAccounts(accounts []api.Account) {
	fmt.Println(accounts)
}
