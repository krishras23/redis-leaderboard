#!/bin/sh

# Wait for Redis to be ready
while ! nc -z $REDIS_HOST 6379; do
  echo "Waiting for Redis..."
  sleep 1
done

# Start the application
exec "$@"
