-- Greenfield seed data for "Bella Cucina" (Italian)
-- Scenario: Brand new system deployment

-- Insert the master ingredients
INSERT INTO unified_data (pk, sk, entity_data) VALUES
('MASTER#ING', 'ING#ing:chicken-breast', '{"name": "Chicken Breast", "category": "protein", "default_unit": "lb"}'),
('MASTER#ING', 'ING#ing:pizza-dough', '{"name": "Pizza Dough Ball", "category": "dry_goods", "default_unit": "each"}'),
('MASTER#ING', 'ING#ing:mozzarella', '{"name": "Mozzarella Cheese", "category": "dairy", "default_unit": "lb"}'),
('MASTER#ING', 'ING#ing:tomato-sauce', '{"name": "Tomato Sauce", "category": "dry_goods", "default_unit": "gal"}'),
('MASTER#ING', 'ING#ing:flour', '{"name": "00 Flour", "category": "dry_goods", "default_unit": "lb"}'),
('MASTER#ING', 'ING#ing:olive-oil', '{"name": "Extra Virgin Olive Oil", "category": "dry_goods", "default_unit": "gal"}');

-- Insert Location Details
INSERT INTO unified_data (pk, sk, entity_data) VALUES
('LOC#downtown', 'METADATA', '{"name": "Bella Cucina Downtown", "owner_id": "owner1", "address": "123 Main St"}'),
('LOC#westside', 'METADATA', '{"name": "Bella Cucina Westside", "owner_id": "owner1", "address": "800 West Ave"}');

-- Seed the initial ledger events directly into the event store (bypassing logic for pure seed speed)
-- 'InitialInventoryEstablished'
INSERT INTO inventory_events (event_id, location_id, event_type, event_time, processing_time, actor_id, version, payload)
VALUES 
('018e9c20-0000-7000-8000-000000000001', 'downtown', 'InitialInventoryEstablished', '2025-01-01 00:00:00Z', '2025-01-01 00:00:10Z', 'owner1', 1, 
'{"ingredient_id": "ing:chicken-breast", "quantity": 50.0, "unit": "lb", "unit_cost": 3.45}'),
('018e9c20-0000-7000-8000-000000000002', 'downtown', 'InitialInventoryEstablished', '2025-01-01 00:00:00Z', '2025-01-01 00:00:10Z', 'owner1', 1, 
'{"ingredient_id": "ing:pizza-dough", "quantity": 100.0, "unit": "each", "unit_cost": 0.50}'),
('018e9c20-0000-7000-8000-000000000003', 'downtown', 'InitialInventoryEstablished', '2025-01-01 00:00:00Z', '2025-01-01 00:00:10Z', 'owner1', 1, 
'{"ingredient_id": "ing:mozzarella", "quantity": 40.0, "unit": "lb", "unit_cost": 4.10}');

-- Seed some consumption
INSERT INTO inventory_events (event_id, location_id, event_type, event_time, processing_time, actor_id, causation_id, version, payload)
VALUES 
('018e9c20-5000-7000-8000-000000000001', 'downtown', 'ConsumptionDeduced', '2025-01-02 23:00:00Z', '2025-01-02 23:05:00Z', 'system', 'pos-upload-0102', 1, 
'{"ingredients_consumed": [{"ingredient_id": "ing:pizza-dough", "quantity_deduced": 35.0}, {"ingredient_id": "ing:mozzarella", "quantity_deduced": 8.5}]}');

-- Seed a transfer from Downtown to Westside
INSERT INTO inventory_events (event_id, location_id, event_type, event_time, processing_time, actor_id, version, payload)
VALUES 
('018eb2dc-0000-7000-8000-000000001001', 'downtown', 'TransferSent', '2025-01-04 10:00:00Z', '2025-01-04 10:00:00Z', 'manager1', 1, 
'{"transfer_id": "t1", "items_sent": [{"ingredient_id": "ing:chicken-breast", "quantity": 10.0, "unit": "lb"}]}'),

('018eb2dc-4000-7000-8000-000000001002', 'westside', 'TransferReceived', '2025-01-04 14:00:00Z', '2025-01-04 14:00:00Z', 'manager2', 1, 
'{"transfer_id": "t1", "items_received": [{"ingredient_id": "ing:chicken-breast", "quantity_actual": 10.0, "unit_cost": 3.45}]}');
