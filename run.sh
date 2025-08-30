#!/bin/bash
set -euo pipefail

all="false"
clean="false"
while getopts "ac" opt; do
    case "${opt}" in
        a) all="true" ;;
        c) clean="true" ;;
    esac
done

if [[ "${clean}" == "true" ]]; then
    echo "> Stopping server"
    docker stop "weather-server"
    echo "> Removing server"
    docker rm "weather-server"
    echo "> Stopping and removing all services"
    docker compose down --rmi all
    exit 0
fi

ch="COMMIT_HASH=$(git rev-parse --short HEAD)"

if [[ "${all}" == "true" ]]; then
    echo "> Building all services with ${ch}"
    docker compose build --build-arg "${ch}"
    echo "> Starting all services"
    docker compose up --detach
    exit 0
fi

echo "> Building server with ${ch}"
docker build --tag "weather:server" --file "./server.dockerfile" --build-arg "${ch}" .
echo "> Starting server"
docker run --detach --name "weather-server" --publish "4444:4000" weather:server
