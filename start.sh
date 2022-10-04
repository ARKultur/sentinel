#!/usr/bin/bash

PREFIX="[ARKultur] "

export CI_BRANCH=canon
printf "%sStarting docker-compose...\n" "$PREFIX"
docker-compose up -d --build
printf "%sDocker compose started!\n" "$PREFIX"
nohup node ./ci/ci.js &
