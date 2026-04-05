---
description: How to setup and run InventoryOS for the first time
---
# InventoryOS Local Dev Setup

This workflow sets up the database, runs migrations, seeds mock data, and starts the system.

1. Create a `.env` file from the example
```bash
# // turbo
cd "/home/nik/Inventory OS" && cp .env.example .env
```

2. Generate the backend Maven wrapper
```bash
# // turbo
cd "/home/nik/Inventory OS/backend" && docker run --rm -v "$(pwd)":/usr/src/app -w /usr/src/app maven:3.9.9-eclipse-temurin-21-alpine mvn -N wrapper:wrapper
```

3. Ensure Database is running and seed data
```bash
# // turbo
cd "/home/nik/Inventory OS" && chmod +x scripts/setup.sh && ./scripts/setup.sh
```

4. Install Frontend dependencies
```bash
# // turbo
cd "/home/nik/Inventory OS/frontend" && npm install
```

5. Start the system
```bash
# // turbo
cd "/home/nik/Inventory OS" && chmod +x scripts/start-dev.sh && ./scripts/start-dev.sh
```
