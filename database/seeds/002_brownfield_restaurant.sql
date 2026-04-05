-- Brownfield seed data for "The Brass Tap" (Gastropub)
-- Scenario: Importing historical data via Migration Variance Pattern

-- Insert the master ingredients
INSERT INTO unified_data (pk, sk, entity_data) VALUES
('MASTER#ING', 'ING#ing:keg-ipa', '{"name": "Local IPA Keg", "category": "alcohol", "default_unit": "keg"}'),
('MASTER#ING', 'ING#ing:ground-beef', '{"name": "Ground Beef (80/20)", "category": "protein", "default_unit": "lb"}'),
('MASTER#ING', 'ING#ing:burger-buns', '{"name": "Brioche Buns", "category": "dry_goods", "default_unit": "each"}'),
('MASTER#ING', 'ING#ing:potatoes', '{"name": "Russet Potatoes", "category": "produce", "default_unit": "lb"}');

-- Insert Location Details
INSERT INTO unified_data (pk, sk, entity_data) VALUES
('LOC#midtown', 'METADATA', '{"name": "The Brass Tap Midtown", "owner_id": "owner2", "address": "456 Center St"}'),
('LOC#riverside', 'METADATA', '{"name": "The Brass Tap Riverside", "owner_id": "owner2", "address": "900 River Rd"}');

-- Seed the initial ledger events directly into the event store (bypassing logic for pure seed speed)
-- 'InitialInventoryEstablished'
INSERT INTO inventory_events (event_id, location_id, event_type, event_time, processing_time, actor_id, version, payload)
VALUES 
('018eee11-0000-7000-8000-000000000001', 'midtown', 'InitialInventoryEstablished', '2024-10-01 00:00:00Z', '2025-01-01 00:00:10Z', 'system', 1, 
'{"ingredient_id": "ing:keg-ipa", "quantity": 12.0, "unit": "keg", "unit_cost": 145.00}'),
('018eee11-0000-7000-8000-000000000002', 'midtown', 'InitialInventoryEstablished', '2024-10-01 00:00:00Z', '2025-01-01 00:00:10Z', 'system', 1, 
'{"ingredient_id": "ing:ground-beef", "quantity": 250.0, "unit": "lb", "unit_cost": 4.50}');


-- The Migration Variance Event
-- This simulates fixing bad legacy data
INSERT INTO inventory_events (event_id, location_id, event_type, event_time, processing_time, actor_id, correlation_id, version, payload)
VALUES 
('018eee11-2000-7000-8000-000000001001', 'midtown', 'MigrationVarianceDetected', '2024-10-02 00:00:00Z', '2025-01-01 00:00:10Z', 'auditor', 'mig-1', 1, 
'{"ingredient_id": "ing:keg-ipa", "expected_quantity": 12.0, "actual_quantity": 10.0, "variance": -2.0, "reason": "Legacy DB drift before go-live"}');

-- Automatically apply the correction for the migration variance
INSERT INTO inventory_events (event_id, location_id, event_type, event_time, processing_time, actor_id, correlation_id, causation_id, version, payload)
VALUES 
('018eee11-4000-7000-8000-000000001002', 'midtown', 'CorrectionApplied', '2024-10-02 00:05:00Z', '2025-01-01 00:00:10Z', 'owner2', 'mig-1', '018eee11-2000-7000-8000-000000001001', 1, 
'{"ingredient_id": "ing:keg-ipa", "quantity_adjustment": -2.0, "reason": "Approved migration write-off"}');
