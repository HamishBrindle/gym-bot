#!/bin/bash
#
# Deployment script for gym-bot server
#

if [ $# -lt 1 ]; then
  echo "You must specify a tag as this script's only parameter"
  exit 1
fi

if [ -z "$1" ]
then
  echo "Unable to continue with deploying without version tag. Exiting."
  exit 1
fi

# Use build script to get our server image to Docker HUB
sh ./build.sh $1

# Deploy newly built docker image on EC2 instance via run script
echo "Executing deployment helper script on remote server via SSH..."
ssh -i ~/gym-bot-keys.pem ec2-user@ec2-18-204-229-191.compute-1.amazonaws.com <<ENDSSH
  sh ./run.sh $1
ENDSSH

echo "All done 🥂"