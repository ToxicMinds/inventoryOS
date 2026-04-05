# InventoryOS - The Deterministic Restaurant OS

InventoryOS is an enterprise-grade, event-sourced, multi-location restaurant inventory control system.
Designed around a strict Hexagonal Architecture in Spring Boot and a premium Next.js frontend, it treats physical goods as an immutable ledger with theoretically deduced balances using `BigDecimal` precision.

## 🚀 Step-by-Step Setup & Execution

Everything has been completely dockerized and automated to avoid host machine port conflicts, allowing you to instantly launch the system on any Linux environment.

**Step 1: Execute the Unified Boot Script**
Navigate to the root directory and run the fully cohesive automation script:
```bash
cd "/home/nik/Inventory OS"
chmod +x scripts/run-all.sh
./scripts/run-all.sh
```

**What the script does automatically:**
1. Evaluates background port blockers (`fuser`) and resets sockets.
2. Boots up a `PostgreSQL 16` Local DynamoDB-Analog container mapped cleanly to `Port 5433`.
3. Validates the Flyway database schema creation.
4. Injects cleanly formatted `UUIDv7` deterministic Hex mock data for:
   - Greenfield (New System): **Bella Cucina (Downtown & Westside)**
   - Brownfield (Legacy Port): **The Brass Tap (Midtown & Riverside)**
5. Launches the **Next.js PWA** in the background on **Port 3005**.
6. Drops into a detached container running **Spring Boot Java 21 API** exposed on **Port 8085**.

**Step 2: Accessing the Components**
- **Frontend / Dashboard**: [http://localhost:3005](http://localhost:3005)
- **Backend API Server**: [http://localhost:8085/actuator/health](http://localhost:8085/actuator/health)
- **Interactive Pitch Deck**: Open `/home/nik/Inventory OS/presentation/index.html` in your browser.

## 🧪 Comprehensive Test Use Cases

Full testing protocols to guide reviewers through the system are documented in [docs/test_cases.md](./docs/test_cases.md).
Highlights include:
- `TST-001` Single Table Schema Integrity.
- `TST-002` Consumption Ledger Deduction Logic from POS strings.
- `TST-003` Cryptographic Variance Isolation (Locating Drift between Expected Math vs Physical Counts).
- `TST-004` Location Transfer Event Generation.

## 🏗 System Architecture Reminders
- **Deterministic Math**: Relies unconditionally on strictly governed `java.math.BigDecimal` (RoundingMode: HALF_UP) over generic `Float` attributes.
- **Port Structure**: Spring Boot backend runs an agnostic hexagonal web layer interface that shields the generic HTTP framework from the actual business domain.
- **Mock Persistence**: Uses PostgreSQL KV JSON schemas to act as a 1:1 local-analog for zero-cost `AWS DynamoDB` deployment strategies.
