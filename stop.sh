#!/usr/bin/bash

PREFIX="[ARKultur] "

printf "%sStopping CI...\n" "$PREFIX"
pid=$(pgrep -fa "node ./ci/ci.js" | tr -s ' ' | cut -d ' ' -f 1)
kill "$pid"
printf "%sCI stopped\n" "$PREFIX"
printf "%sStopping docker compose...\n" "$PREFIX"
docker-compose down
