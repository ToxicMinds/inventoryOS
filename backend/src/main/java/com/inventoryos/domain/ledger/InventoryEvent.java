package com.inventoryos.domain.ledger;

import com.inventoryos.shared.UUIDv7Generator;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.Map;

/**
 * Core immutable Event — the fundamental unit of the system.
 * Iron Law: Events are NEVER deleted or mutated. Only appended.
 * Every event has a location_id. Corporate-level events use "corporate".
 */
@Value
@Builder
public class InventoryEvent {
    /** UUIDv7 — time-sortable, used as sort key in DB */
    String eventId;
    String eventType;
    /** Business time — when it HAPPENED (user-provided) */
    Instant eventTime;
    /** System time — when it was RECORDED */
    Instant processingTime;
    String correlationId;
    String causationId;
    String actorId;
    /** Every event belongs to a location (or "corporate") */
    String locationId;
    int version;
    Map<String, Object> payload;

    public static InventoryEvent create(String eventType, String locationId,
                                        String actorId, Instant eventTime,
                                        String correlationId, String causationId,
                                        Map<String, Object> payload) {
        return InventoryEvent.builder()
                .eventId(UUIDv7Generator.generateString())
                .eventType(eventType)
                .eventTime(eventTime)
                .processingTime(Instant.now())
                .correlationId(correlationId)
                .causationId(causationId)
                .actorId(actorId)
                .locationId(locationId)
                .version(1)
                .payload(payload)
                .build();
    }
}
