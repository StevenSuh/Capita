start:
	docker-compose up
start-build:
	docker-compose up --build
start-reset: reset start

reset:
	docker stop `docker ps -qa`; \
	docker rm `docker ps -qa`; \
	docker rmi -f `docker images -qa`; \
	docker volume rm `docker volume ls -q`; \
	docker network rm `docker network ls -q`
psql:
	psql -d capita -U stevenesuh
sh-api:
	docker exec -it $(shell docker ps -qf "name=api") sh
sh-client:
	docker exec -it $(shell docker ps -qf "name=client") sh
update-client:
	docker exec -it $(shell docker ps -qf "name=client") sh -c 'rm -f yarn.lock && yarn'
update-api:
	docker exec -it $(shell docker ps -qf "name=api") sh -c 'go get'

migrate-create:
	goose -dir=./server/migrations postgres "user=stevenesuh dbname=capita sslmode=disable" create ${NAME} sql
migrate-up:
	goose -dir=./server/migrations postgres "user=stevenesuh dbname=capita sslmode=disable" up
migrate-down:
	goose -dir=./server/migrations postgres "user=stevenesuh dbname=capita sslmode=disable" down
migrate-status:
	goose -dir=./server/migrations postgres "user=stevenesuh dbname=capita sslmode=disable" status
