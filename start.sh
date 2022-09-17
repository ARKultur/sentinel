#!/usr/bin/bash

PREFIX="[ARKultur] "

printf "%sStarting docker-compose...\n" "$PREFIX"
docker-compose up -d --build
printf "%sDocker compose started!\n" "$PREFIX"
nohup node ./ci/ci.js &
