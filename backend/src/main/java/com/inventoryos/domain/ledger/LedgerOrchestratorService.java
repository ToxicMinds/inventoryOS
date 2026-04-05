package com.inventoryos.domain.ledger;

import com.inventoryos.ports.inbound.ProcessInventoryEventUseCase;
import com.inventoryos.ports.outbound.BalanceCachePort;
import com.inventoryos.ports.outbound.EventStorePort;
import com.inventoryos.shared.IdempotencyGuard;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;

/**
 * The core orchestrator for the ledger domain.
 * Manages the flow of: Inbound Command -> Idempotency Check -> Event Append -> Engine Calculation -> Cache Update.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LedgerOrchestratorService implements ProcessInventoryEventUseCase {

    private final EventStorePort eventStore;
    private final BalanceCachePort balanceCache;
    private final TheoreticalInventoryEngine inventoryEngine;
    private final IdempotencyGuard idempotencyGuard;

    @Override
    @Transactional
    public void processEvent(String idempotencyKey, String locationId, String actorId, String eventType, Map<String, Object> payload) {
        
        // 1. Ensure idempotency (optimistic concurrency)
        idempotencyGuard.checkAndGuard(idempotencyKey);
        
        // 2. Wrap incoming data in an immutable event
        InventoryEvent event = InventoryEvent.create(
                eventType,
                locationId,
                actorId,
                Instant.now(), // Business time (could be overridden from payload in a real impl)
                idempotencyKey, // Using idempotency key as correlation ID
                null,
                payload
        );
        
        // 3. Append to immutable ledger
        eventStore.appendEvent(event);
        log.info("Appended event {} of type {} for location {}", event.getEventId(), eventType, locationId);

        // 4. Recalculate balances
        // For efficiency in production, we do NOT load the entire historical stream.
        // We calculate delta based on this single event and update the cache.
        Map<String, InventoryBalance> balanceDeltas = inventoryEngine.calculateBalance(java.util.List.of(event));
        
        // 5. Update materialized cache
        for (Map.Entry<String, InventoryBalance> entry : balanceDeltas.entrySet()) {
            String ingredientId = entry.getKey();
            InventoryBalance delta = entry.getValue();

            // Fetch current balance from cache (or start zero)
            InventoryBalance currentPos = balanceCache.getBalance(locationId, ingredientId).orElse(null);

            InventoryBalance newBalance;
            if (currentPos == null) {
                newBalance = delta;
            } else {
                // If it's a reduction, we just subtract the delta quantity from current. 
                // Wait, theoretical engine ALREADY gave us the math to do (delta).
                // Actually, since we only passed ONE event to the engine, the engine returned the "delta" as an absolute balance as if it started from 0.
                // A better approach for incremental updates:
                // We fetch current balance from cache, then MANUALLY apply this single event to it.
                // Or we do it properly, by fetching ALL events since last snapshot.
                
                // For this MVP, we will run the incremental math here.
                if (delta.getQuantity().compareTo(java.math.BigDecimal.ZERO) < 0) {
                    newBalance = currentPos.subtract(delta.getQuantity().negate(), event.getEventTime(), event.getEventId());
                } else {
                     newBalance = currentPos.add(delta.getQuantity(), delta.getAverageUnitCost(), event.getEventTime(), event.getEventId());
                }
            }
            balanceCache.saveBalance(newBalance);
            log.debug("Updated balance cache for ingredient {} at location {}: {}", ingredientId, locationId, newBalance.getQuantity());
        }
    }
}
