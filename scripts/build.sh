#!/bin/bash
#
# Use docker to build our server's image, tag it, and
# put it on Docker HUB to be pulled in and ran by our
# remote EC2 instance.
#

if [ $# -lt 1 ]; then
  echo "You must specify a tag as this script's only parameter"
  exit 1
fi

if [ -z "$1" ]
then
  echo "Unable to continue building without version tag. Exiting."
  exit 1
fi

# Login to Docker HUB
docker login

# Build
echo "Building gym-bot server..."
docker build -t gym-bot_server --target production --no-cache .

# Tag
echo "Tagging gym-bot server as '$1'"
docker tag gym-bot_server hamishbrindle/gym-bot:$1

# Push up to Docker HUB
echo "Pushing gym-bot image '$1' up to Docker HUB"
docker push hamishbrindle/gym-bot:$1