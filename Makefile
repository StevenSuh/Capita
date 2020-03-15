install: clean
	cd client; yarn;
	cd proto; yarn;
	cd shared; yarn;
	make compile-proto;
	cd server; yarn;
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
clean:
	cd client; rm -rf node_modules;
	cd proto; rm -rf node_modules;
	cd shared; rm -rf node_modules;
	cd server; rm -rf node_modules;


psql:
	psql -d capita -U stevenesuh

migrate-up:
	cd shared; yarn migrate-up
migrate-down:
	cd shared; yarn migrate-down
migrate-status:
	cd shared; yarn migrate-status


server-shared: compile-proto
	cd server; yarn add ../shared
