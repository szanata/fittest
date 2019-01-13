#!/usr/bin/env

echo "Creating docker container with node"

docker run -it \
  -v `pwd`:/app/ \
  -w /app/ \
    node:11.6-alpine /bin/sh
