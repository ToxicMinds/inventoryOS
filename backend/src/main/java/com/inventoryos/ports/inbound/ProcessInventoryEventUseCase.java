package com.inventoryos.ports.inbound;

import java.util.Map;

public interface ProcessInventoryEventUseCase {
    
    /**
     * Central ingestion point for any generic inventory event from external sources
     * like manual count entry, transfer requests, etc.
     */
    void processEvent(
            String idempotencyKey,
            String locationId,
            String actorId,
            String eventType,
            Map<String, Object> payload
    );
}
