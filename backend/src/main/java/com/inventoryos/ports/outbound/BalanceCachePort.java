package com.inventoryos.ports.outbound;

import com.inventoryos.domain.ledger.InventoryBalance;

import java.util.Optional;
import java.util.Map;

/**
 * Outbound port for the materialized balance cache.
 * Speeds up read operations without rewriting the event log.
 */
public interface BalanceCachePort {
    Optional<InventoryBalance> getBalance(String locationId, String ingredientId);
    Map<String, InventoryBalance> getAllBalancesForLocation(String locationId);
    void saveBalance(InventoryBalance balance);
}
