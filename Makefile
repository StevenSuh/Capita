start: proto-force
	cd client; yarn start &
	cd server; yarn run watch
compile-proto:
	cd proto; yarn run generate
compile-proto-force:
	cd proto; yarn run generate --force
lint:
	cd server; yarn run lint
test:
	cd server; yarn run test

psql:
	psql -d capita -U stevenesuh

migrate-create:
	cd server; npx sequelize-cli model:create --name
migrate-up:
	cd server; npx sequelize-cli db:migrate
migrate-down:
	cd server; npx sequelize-cli db:migrate:undo
migrate-status:
	cd server; npx sequelize-cli db:migrate:status
