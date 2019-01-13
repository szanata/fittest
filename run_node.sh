#!/usr/bin/env

echo "Creating docker container with node"

docker run -it \
  -e NPM_TOKEN=$NPM_TOKEN \
  -v `pwd`:/app/ \
  -w /app/ \
    node:11.6-alpine /bin/sh
