#!/bin/bash
set -e

# Cleanup any previous processes matching our ports or names to avoid conflicts
echo "Cleaning up previous instances..."
cd "/home/nik/Inventory OS" || exit
docker compose down -v 2>/dev/null || true

# Next.js and backend cleanup just in case
pkill -f "next dev" || true
pkill -f "spring-boot" || true
fuser -k 3005/tcp || true
fuser -k 8085/tcp || true
sleep 2

echo "Starting PostgreSQL database container on port 5433..."
docker compose up -d postgres

echo "Waiting for postgres to be ready..."
sleep 5
docker exec -it inventoryos-db pg_isready -U inventoryos

echo "Applying Database Schema..."
docker exec -i inventoryos-db psql -U inventoryos -d inventoryos < ./backend/src/main/resources/db/migration/V1__Initial_schema.sql

echo "Seeding initial mock data into database..."
docker exec -i inventoryos-db psql -U inventoryos -d inventoryos < ./database/seeds/001_greenfield_restaurant.sql
docker exec -i inventoryos-db psql -U inventoryos -d inventoryos < ./database/seeds/002_brownfield_restaurant.sql

echo "Mock data seeded successfully!"

echo "Starting Frontend cleanly on port 3005..."
cd "/home/nik/Inventory OS/frontend"
PORT=3005 npm run dev &
FRONTEND_PID=$!

cd "/home/nik/Inventory OS/backend"
echo "Starting Spring Boot API... (Connecting to DB on port 5433)"

# Pass DB_PORT and BACKEND_PORT to explicitly tell spring boot the mapped ports
docker run --rm -it --network host \
  --env DB_PORT=5433 \
  --env BACKEND_PORT=8085 \
  -v "$(pwd)":/usr/src/app \
  -v m2_cache:/root/.m2 \
  -w /usr/src/app maven:3.9.9-eclipse-temurin-21-alpine \
  mvn spring-boot:run

# Kill frontend on exit
kill $FRONTEND_PID
