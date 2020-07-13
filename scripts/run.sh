#!/bin/bash
#
# Server-side helper for cleaning existing constainers/images
# and running up newly built server
#

if [ $# -lt 1 ]; then
  echo "You must specify a tag as this script's only parameter"
  exit 1
fi

if [ -z "$1" ]
then
  echo "Unable to continue running without version tag. Exiting."
  exit 1
fi

# Remove running docker container
docker kill gym-bot_server
docker rm gym-bot_server

# Get the existing image ID for removal
EXISTING=$(docker image ls -q hamishbrindle/gym-bot)

if [ -z "$EXISTING_IMAGE" ]
then
  echo "No existing image found. Continuing..."
else
  # Remove existing docker image for `gym-bot_server`
  echo "Removing Docker image: $EXISTING_IMAGE ..."
  docker image rm $EXISTING_IMAGE
fi

# Pull and start the specified version of the server
docker run -p 80:4224 --name gym-bot_server --detach --env-file ~/.env hamishbrindle/gym-bot:$1 npm run start:prod