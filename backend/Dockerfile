# Use the official Node.js 20 image from Docker Hub
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the dependency definition files
COPY package*.json ./

# Install all npm dependencies listed in package.json
RUN npm install

# Copy the entire application code into the container
COPY . .

# Add backup and cron configuration files to the container
COPY pg_backup.sh /usr/src/app/pg_backup.sh
COPY cron-entrypoint.sh /usr/local/bin/cron-entrypoint.sh
COPY crontab.txt /etc/cron.d/yoganka-cron

# Make scripts executable and load crontab
RUN chmod +x /usr/src/app/pg_backup.sh /usr/local/bin/cron-entrypoint.sh && \
    crontab /etc/cron.d/yoganka-cron

# Open the port where the backend app will run
EXPOSE 3000

# Start cron and then run the app
ENTRYPOINT ["cron-entrypoint.sh"]
CMD ["npm", "start"]
