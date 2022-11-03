#!/bin/bash

#$1 -> Name of the image
#$2 -> Tag of the image
#$3 -> Port for the machine and the image

PREFIX="[ARKultur] "
REPO="bogdzn"

if [ "$( docker container inspect -f '{{.State.Running}}' $1 )" == "true" ];
then
  printf "%sDocker container is running stop the service...\n" "$PREFIX"
  docker stop "$1"
  printf "%sContainer stopped, removing container...\n" "$PREFIX"
  docker rm "$1"
  printf "%sContainer removed, removing the old image...\n" "$PREFIX"
  docker image rm "$REPO"/"$1":"$2"
else
  printf "%sNo container found\n" "$PREFIX"
fi

printf "%sStarting pulling new image...\n" "$PREFIX"
docker pull "$REPO"/"$1":"$2"
printf "%sPulling done\n" "$PREFIX"
printf "%sStart the container\n" "$PREFIX"
docker-compose up -d
#docker run --name "$1" -p "$3":"$3" -d "$REPO"/"$1":"$2"
