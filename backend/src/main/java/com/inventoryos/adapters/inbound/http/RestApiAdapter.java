package com.inventoryos.adapters.inbound.http;

import com.inventoryos.domain.ledger.InventoryBalance;
import com.inventoryos.domain.ledger.InventoryEvent;
import com.inventoryos.ports.inbound.ProcessInventoryEventUseCase;
import com.inventoryos.ports.outbound.BalanceCachePort;
import com.inventoryos.ports.outbound.EventStorePort;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * HTTP Adapter (Controller) exposing the core domain to the outside world.
 */
@RestController
@RequestMapping("/api/locations/{locationId}")
@RequiredArgsConstructor
public class RestApiAdapter {

    private final ProcessInventoryEventUseCase processEventUseCase;
    private final BalanceCachePort balanceCache;
    private final EventStorePort eventStore;

    @GetMapping("/inventory")
    public ResponseEntity<Map<String, InventoryBalance>> getInventory(@PathVariable String locationId) {
        return ResponseEntity.ok(balanceCache.getAllBalancesForLocation(locationId));
    }

    @GetMapping("/events")
    public ResponseEntity<List<InventoryEvent>> getLedgerEvents(@PathVariable String locationId) {
        // In production, this would be highly paginated.
        return ResponseEntity.ok(eventStore.getEventsForLocation(locationId));
    }

    @PostMapping("/events")
    public ResponseEntity<Void> processEvent(
            @PathVariable String locationId,
            @RequestHeader("X-Idempotency-Key") String idempotencyKey,
            @RequestHeader("X-Actor-Id") String actorId, // Simulated from JWT in real app
            @RequestBody EventPayloadRequest request) {
        
        processEventUseCase.processEvent(
                idempotencyKey,
                locationId,
                actorId,
                request.getEventType(),
                request.getPayload()
        );

        return ResponseEntity.accepted().build();
    }

    @Data
    public static class EventPayloadRequest {
        private String eventType;
        private Map<String, Object> payload;
    }
}
