#!/bin/sh
set -e

# Process environment variables
if [ -n "$VITE_API_URL" ]; then
    echo "Setting API URL to $VITE_API_URL"
    # Create or update .env file with environment variables
    echo "VITE_API_URL=$VITE_API_URL" > .env
fi

# Install any new dependencies if package.json has changed
if [ -f "/app/package.json" ]; then
    echo "Checking for new dependencies..."
    npm install
fi

# Execute the command passed to docker run
echo "Starting frontend with command: $@"
exec "$@"