#!/bin/bash

# Start cron service in the background
cron

# Output info for debugging
echo "Cron started. Now starting the backend..."

# Run whatever command was passed to container (usually 'npm start')
exec "$@"
