start:
	docker-compose up
start-build:
	docker-compose up --build
start-reset: reset start

reset:
	docker system prune -f
	docker volume prune -f
update:
	docker exec -it $(shell docker ps -qf "name=client") sh -c 'rm -f yarn.lock && yarn'
clear-psql:
	docker exec -it $(shell docker ps -qf "name=postgres") psql -d capita -U stevenesuh -c "DROP DATABASE capita; CREATE DATABASE capita;"
psql:
	docker exec -it $(shell docker ps -qf "name=postgres") psql -d capita -U stevenesuh
api:
	docker exec -it $(shell docker ps -qf "name=api") bash
client:
	docker exec -it $(shell docker ps -qf "name=client") bash

migrate-create:
	goose -dir=./server/migrations postgres "user=stevenesuh dbname=capita sslmode=disable" create ${NAME} sql
migrate-up:
	goose -dir=./server/migrations postgres "user=stevenesuh dbname=capita sslmode=disable" up
migrate-status:
	goose -dir=./server/migrations postgres "user=stevenesuh dbname=capita sslmode=disable" status
