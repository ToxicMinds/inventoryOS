package com.inventoryos.ports.outbound;

import com.inventoryos.domain.ledger.InventoryEvent;

import java.time.Instant;
import java.util.List;

/**
 * Outbound port for the immutable event ledger.
 */
public interface EventStorePort {
    void appendEvent(InventoryEvent event);
    List<InventoryEvent> getEventsForLocation(String locationId);
    List<InventoryEvent> getEventsForLocationSince(String locationId, Instant since);
    boolean eventExistsByCorrelation(String correlationId);
}
