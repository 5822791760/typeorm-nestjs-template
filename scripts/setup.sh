#!/bin/bash

# Exit script on any error
set -e

# Load .env variables if .env file exists
if [ -f ./.env ]; then
  export $(grep -v '^#' .env | xargs)
fi

function build() {
    yarn
    yarn test:mutation
}

function merge() {
    yarn
    yarn lint
    yarn tsc --noEmit
    yarn test:mutation
}

command=$1
shift  # Remove the command name from the arguments

if declare -f "$command" > /dev/null; then
  "$command" "$@"
else
  echo "Command '$command' does not exist."
  exit 1
fi