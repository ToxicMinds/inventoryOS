#!/bin/bash
set -e

# Load from .env if exists
if [ -f ../.env ]; then
  export $(cat ../.env | xargs)
fi

echo "Starting PostgreSQL database container..."
cd "/home/nik/Inventory OS"
docker compose up -d postgres

echo "Waiting for postgres to be ready..."
sleep 5
docker exec -it inventoryos-db pg_isready -U inventoryos

echo "Seeding initial mock data into database..."
docker exec -i inventoryos-db psql -U inventoryos -d inventoryos < ./database/seeds/001_greenfield_restaurant.sql
docker exec -i inventoryos-db psql -U inventoryos -d inventoryos < ./database/seeds/002_brownfield_restaurant.sql

echo "Data seeding complete."
