#!/bin/bash

# Get the current date and time in format: YYYY-MM-DD_HH-MM-SS
DATE=$(date +%Y-%m-%d_%H-%M-%S)

# Set the backup directory inside the container
BACKUP_DIR="/backups"

# Set the backup file name using current timestamp
FILENAME="pg_backup_$DATE.sql"

# Display info about what file is being created
echo "Creating backup: $FILENAME"

# Use pg_dump to export the database into the backup file
pg_dump -U postgres -d yoganka > "$BACKUP_DIR/$FILENAME"

# Show confirmation message
echo "Backup completed: $FILENAME"
