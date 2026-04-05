# InventoryOS - System Test Use Case Suite

The following outlines the operational behaviors the OS supports and handles cleanly inside a deterministic mathematical envelope. Use these to manually interact with or write automated E2E specifications against the local running systems (Frontend `localhost:3005` & Backend `localhost:8085`).

### [TST-001] Core Inventory Data Isolation (Multitenancy)
- **Pre-condition**: Logged in as `owner1` (Bella Cucina).
- **Action**: Fetch the `dashboard` UI or make GET request to `/api/locations`.
- **Expected Outcome**: Only 'Downtown' and 'Westside' locations are visible and accessible. 'Midtown' or 'Riverside' (Brass Tap) trigger a 403 Forbidden Access block due to lack of strict Actor authorization.

### [TST-002] Zero-Drift Event Replay (Deterministic Validation)
- **Pre-condition**: The system is completely populated with mock state seeds (`001_greenfield_restaurant.sql` and `002_brownfield_restaurant.sql`).
- **Action**: Execute `/scripts/verify-determinism.sh`, which mirrors the exact sequence of UUIDv7 payload actions on the backend.
- **Expected Outcome**: The output floating-point variance MUST explicitly read `0.00000000`. The final materialized view derived strictly from adding events mathematically aligns perfectly with the live cache.

### [TST-003] Consumption Deduction Through Spreadsheet Interface
- **Pre-condition**: User executes the `Sales Import` workflow via Drag & Drop.
- **Action**: Drop an Excel/CSV matching the sales schema. This fires a `ProcessPosSalesUseCase`.
- **Expected Outcome**: An immutable event of `ConsumptionDeduced` is written to the ledger. If 10 Margherita pizzas are sold, the system generates events dictating `-10.0 pizza-dough (each)` and `-5.0 tomato-sauce (gal)`. No database `UPDATE` is ever ran... balances are mathematically observed.

### [TST-004] Handling Legacy Variance Drift (Brownfield System)
- **Pre-condition**: Reviewing The Brass Tap locations ('Midtown').
- **Action**: View the `Physical Counts` section in the NextJS UI.
- **Expected Outcome**: You will see an anomaly `MigrationVarianceDetected` attached to 'keg-ipa' where Expected was 12, Actual is 10. You will also see an automatic system response (`CorrectionApplied`) resolving the mathematical block by attributing `-2` to a historical write-off bucket so operations can proceed cleanly on Day 1.

### [TST-005] Inventory Transfer Reversal / Idempotency
- **Pre-condition**: Navigating 'Transfers' on Bella Cucina 'Downtown'.
- **Action**: Submit a network request manually duplicating a `TransferSent` ID '018eb2dc-0000-7000-8000-000000001001' from the seed data.
- **Expected Outcome**: The API HTTP returns `409 Conflict`. The `IdempotencyGuard` isolates the exact hashed state and physically rejects processing duplicate POST requests, protecting the core database from dual deduction constraints.
