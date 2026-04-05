-- Flyway Migration V1: Single-Table Architecture & Materialized Balance Cache
-- This schema mirrors a NoSQL database (like DynamoDB) for maximum flexibility 
-- while running locally in Postgres.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core Event Ledger Table
-- Iron Law: No UPDATE, no DELETE triggers allowed on this table.
CREATE TABLE inventory_events (
    event_id UUID PRIMARY KEY,
    location_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_time TIMESTAMP WITH TIME ZONE NOT NULL,
    processing_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    correlation_id VARCHAR(100),
    causation_id VARCHAR(100),
    actor_id VARCHAR(100) NOT NULL,
    version INT NOT NULL DEFAULT 1,
    payload JSONB NOT NULL
);

-- Indexes mimicking DynamoDB patterns
-- Primary query pattern: Give me all events for this location, chronologically
CREATE INDEX idx_events_location_time ON inventory_events(location_id, event_time, event_id);
-- Secondary query pattern: Give me all specific event types
CREATE INDEX idx_events_type ON inventory_events(event_type);

-- NoSQL "Single Table" for Entities, Preferences, and Master Data
-- PK/SK pattern ensures we can dump anything into this table 
CREATE TABLE unified_data (
    pk VARCHAR(255) NOT NULL,
    sk VARCHAR(255) NOT NULL,
    entity_data JSONB NOT NULL,
    PRIMARY KEY (pk, sk)
);

-- Materialized Balance Cache
-- This enables fast dashboard loading without replaying the entire 20-year ledger every time.
-- The Event Engine updates this cache asynchronously or inline during processing.
CREATE TABLE inventory_balances (
    location_id VARCHAR(100) NOT NULL,
    ingredient_id VARCHAR(100) NOT NULL,
    quantity NUMERIC(15, 4) NOT NULL DEFAULT 0.0000,
    unit VARCHAR(20) NOT NULL,
    average_unit_cost NUMERIC(15, 4) NOT NULL DEFAULT 0.0000,
    last_updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_event_id UUID NOT NULL,
    PRIMARY KEY (location_id, ingredient_id)
);
