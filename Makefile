start: compile-proto
	cd client; yarn start &
	cd server; yarn run watch
compile-proto:
	cd proto; yarn run generate
lint:
	cd server; yarn run lint;
	cd shared; yarn run lint
test:
	cd server; yarn run test;
	cd shared; yarn run test

psql:
	psql -d capita -U stevenesuh

migrate-up:
	cd shared; yarn migrate-up
migrate-down:
	cd shared; yarn migrate-down
migrate-status:
	cd shared; yarn migrate-status
