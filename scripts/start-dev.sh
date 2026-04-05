#!/bin/bash
set -e

# Load environment
if [ -f ../.env ]; then
  export $(cat ../.env | xargs)
fi

echo "Starting InventoryOS Development Environment..."

# 1. Start Postgres in background
# // turbo
docker compose up -d postgres

# 2. Wait for db
echo "Waiting for postgres..."
sleep 5

# 3. Start Frontend (Background)
# // turbo
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# 4. Start Backend (Foreground)
# // turbo
cd backend
echo "Starting Spring Boot API..."
# Run via docker to ensure java 21 runtime isolated, or fallback to host java
docker run --rm -it --network host -v "$(pwd)":/usr/src/app -v m2_cache:/root/.m2 -w /usr/src/app maven:3.9.9-eclipse-temurin-21-alpine mvn spring-boot:run

# Kill frontend on exit
kill $FRONTEND_PID
