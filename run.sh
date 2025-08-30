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

container_name="weather-server"
image_name="weather:server"

if [[ "${clean}" == "true" ]]; then
    if [[ $(docker ps --all --filter "name=^${container_name}$" --format "{{.Names}}") != "" ]]; then
        if [[ $(docker ps --filter "name=^${container_name}$" --format "{{.Names}}") != "" ]]; then
            echo "> Stopping server"
            docker stop "${container_name}"
        fi

        echo "> Removing server"
        docker rm "${container_name}"
    fi

    echo "> Stopping and removing all services"
    docker compose down --rmi all
    exit 0
fi

commit_hash="COMMIT_HASH=$(git rev-parse --short HEAD)"
if [[ $(git diff --name-only HEAD) != "" ]]; then
    echo "> Uncommitted changes detected"
    commit_hash="${commit_hash}_MODIFIED"
fi

if [[ "${all}" == "true" ]]; then
    echo "> Building all services with ${commit_hash}"
    docker compose build --build-arg "${commit_hash}"
    echo "> Starting all services"
    docker compose up --detach
    exit 0
fi

echo "> Building server with ${commit_hash}"
docker build --tag "${image_name}" --file "./server.dockerfile" --build-arg "${commit_hash}" .
echo "> Starting server"
docker run --detach --name "${container_name}" --publish "4444:4000" "${image_name}"
