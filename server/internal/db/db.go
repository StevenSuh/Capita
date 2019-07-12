package db

import (
	"fmt"
	"log"
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
		log.Fatalln(err)
	}

	err = Client.Ping()
	if err != nil {
		log.Fatalln(err)
	}

	fmt.Println("Db successfully connected")
}

func dbConfig() map[string]string {
	conf := make(map[string]string)

	host, ok := os.LookupEnv(dbhost)
	if !ok {
		log.Fatalln("DBHOST missing")
	}

	port, ok := os.LookupEnv(dbport)
	if !ok {
		log.Fatalln("DBPORT missing")
	}

	user, ok := os.LookupEnv(dbuser)
	if !ok {
		log.Fatalln("DBUSER missing")
	}

	password, ok := os.LookupEnv(dbpass)
	if !ok {
		log.Fatalln("DBPASS missing")
	}

	name, ok := os.LookupEnv(dbname)
	if !ok {
		log.Fatalln("DBNAME missing")
	}

	conf[dbhost] = host
	conf[dbport] = port
	conf[dbuser] = user
	conf[dbpass] = password
	conf[dbname] = name

	return conf
}
