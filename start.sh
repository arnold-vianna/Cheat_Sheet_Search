#!/bin/bash

# Script to build and run the Docker container for the cheat sheet website

# Variables
IMAGE_NAME="my-flask-app"
CONTAINER_PORT="8010"
HOST_PORT="8010"
DB_PATH="$(pwd)/cheat_sheets.db"
ENV_FILE=".env"

# Step 1: Build the Docker image
echo "Building Docker image: $IMAGE_NAME..."
docker build -t $IMAGE_NAME .

# Check if the build was successful
if [ $? -ne 0 ]; then
    echo "Error: Docker build failed. Exiting."
    exit 1
fi

# Step 2: Run the Docker container
echo "Running Docker container on port $HOST_PORT..."
docker run --env-file $ENV_FILE -p $HOST_PORT:$CONTAINER_PORT -v $DB_PATH:/app/cheat_sheets.db $IMAGE_NAME

# Check if the container started successfully
if [ $? -ne 0 ]; then
    echo "Error: Failed to start Docker container. Exiting."
    exit 1
fi

echo "Container is running. Access the app at http://localhost:$HOST_PORT"