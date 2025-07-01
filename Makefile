export

default: run

down:
	docker-compose down

migrate:
	docker-compose exec web knex migrate:latest

seed:
	docker-compose exec web knex seed:run

purge:
	docker-compose down -v --remove-orphans

all-logs:
	docker-compose logs -tf

app-logs:
	docker-compose logs -tf web

nginx-logs:
	docker-compose logs -tf nginx

app-cli:
	docker-compose exec web /bin/sh

db-cli:
	docker-compose exec db psql -d plaid -U postgres

nginx-cli:
	docker-compose exec nginx /bin/sh

build:
	docker-compose up --build -d

run: down build migrate seed
