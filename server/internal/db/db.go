package db

import (
	"fmt"
	"os"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq" // postgres
)

var Client *sqlx.DB

const (
	dbhost = "DBHOST"
	dbport = "DBPORT"
	dbuser = "DBUSER"
	dbpass = "DBPASS"
	dbname = "DBNAME"
)

func InitDb() {
	config := dbConfig()
	var err error

	credentials := fmt.Sprintf(
		"host=%s port=%s user=%s dbname=%s sslmode=disable password=%s",
		config[dbhost], config[dbport], config[dbuser], config[dbname], config[dbpass],
	)

	Client, err = sqlx.Connect("postgres", credentials)
	if err != nil {
		panic(err)
	}

	err = Client.Ping()
	if err != nil {
		panic(err)
	}

	fmt.Println("Db successfully connected")
}

func dbConfig() map[string]string {
	conf := make(map[string]string)

	host, ok := os.LookupEnv(dbhost)
	if !ok {
		panic("DBHOST missing")
	}

	port, ok := os.LookupEnv(dbport)
	if !ok {
		panic("DBPORT missing")
	}

	user, ok := os.LookupEnv(dbuser)
	if !ok {
		panic("DBUSER missing")
	}

	password, ok := os.LookupEnv(dbpass)
	if !ok {
		panic("DBPASS missing")
	}

	name, ok := os.LookupEnv(dbname)
	if !ok {
		panic("DBNAME missing")
	}

	conf[dbhost] = host
	conf[dbport] = port
	conf[dbuser] = user
	conf[dbpass] = password
	conf[dbname] = name

	return conf
}
