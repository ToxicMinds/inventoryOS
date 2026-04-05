package com.inventoryos.config;

import com.inventoryos.domain.ledger.InventoryEvent;
import com.inventoryos.domain.ledger.InventoryBalance;
import com.inventoryos.ports.outbound.EventStorePort;
import com.inventoryos.ports.outbound.BalanceCachePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

/**
 * Replaces the SQL seeds. Bootstraps the DynamoDB environment.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class MockDataSeeder {

    private final EventStorePort eventStore;
    private final BalanceCachePort balanceCache;

    @EventListener(ApplicationReadyEvent.class)
    public void seedMockData() {
        log.info("Checking if mock data exists in DynamoDB...");
        if (!eventStore.getEventsForLocation("downtown").isEmpty()) {
            log.info("Mock data already exists. Skipping insertion.");
            return;
        }

        log.info("Applying Greenfield Data (Bella Cucina)...");
        // Downtown establishing
        eventStore.appendEvent(InventoryEvent.builder()
                .eventId("018e9c20-0000-7000-8000-000000000001")
                .locationId("downtown")
                .eventType("InitialInventoryEstablished")
                .eventTime(Instant.parse("2025-01-01T00:00:00Z"))
                .processingTime(Instant.now())
                .actorId("owner1")
                .version(1)
                .payload(Map.of("ingredient_id", "ing:chicken-breast", "quantity", 50.0, "unit", "lb", "unit_cost", 3.45))
                .build());

        balanceCache.saveBalance(InventoryBalance.builder()
                .locationId("downtown")
                .ingredientId("ing:chicken-breast")
                .quantity(new BigDecimal("50.0"))
                .unit("lb")
                .averageUnitCost(new BigDecimal("3.45"))
                .lastUpdatedAt(Instant.now())
                .lastEventId("018e9c20-0000-7000-8000-000000000001")
                .build());

        log.info("Applying Brownfield Data (The Brass Tap)...");
        // Midtown establishing
        eventStore.appendEvent(InventoryEvent.builder()
                .eventId("028e9c20-0000-7000-8000-000000000001")
                .locationId("midtown")
                .eventType("MigrationVarianceDetected")
                .eventTime(Instant.parse("2025-01-01T00:00:00Z"))
                .processingTime(Instant.now())
                .actorId("system")
                .version(1)
                .payload(Map.of("ingredient_id", "ing:keg-ipa", "variance_quantity", -2.0, "reason", "Legacy migration mismatch"))
                .build());
                
        balanceCache.saveBalance(InventoryBalance.builder()
                .locationId("midtown")
                .ingredientId("ing:keg-ipa")
                .quantity(new BigDecimal("10.0"))
                .unit("keg")
                .averageUnitCost(new BigDecimal("150.00"))
                .lastUpdatedAt(Instant.now())
                .lastEventId("028e9c20-0000-7000-8000-000000000001")
                .build());

        log.info("Mock seeding absolute.");
    }
}
