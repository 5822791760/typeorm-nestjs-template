#!/bin/bash

# Load .env variables if .env file exists
if [ -f ./.env ]; then
  export $(grep -v '^#' .env | xargs)
fi

function up() {
  docker-compose up -d
}

function down() {
  docker-compose down --remove-orphans
}

function waitpg() {
  ./scripts/wait-pg.sh
}

function dev() {
  up
  yarn start:dev
}

function repl() {
  nest start --entryFile repl --watch
}

function cli() {
  NODE_ENV=cli ts-node -r tsconfig-paths/register ./src/cli.ts $@
}

function db:up() {
  yarn kysely migrate:latest
  yarn kysely-codegen --camel-case --out-file ./src/core/db/db.d.ts
}

function db:prev() {
  yarn kysely migrate:down
  yarn kysely-codegen --camel-case --out-file ./src/core/db/db.d.ts
}

function db:drop() {
  docker-compose up -d postgres
  docker-compose exec postgres dropdb -U postgres --if-exists postgres --force
  docker-compose exec postgres createdb -U postgres postgres
}

function db:reset() {
  db:drop
  db:up
}

function db:init() {
  db:reset
  yarn seed run
}

# Only run this after cloning project
function initproject() {
  cat .env.example > .env
  up
  yarn
  waitpg
  db:init
}

command=$1
shift  # Remove the command name from the arguments

if declare -f "$command" > /dev/null; then
  "$command" "$@"
else
  echo "Command '$command' does not exist."
  exit 1
fi