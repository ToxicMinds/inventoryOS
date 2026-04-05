package com.inventoryos.domain.ledger;

import com.inventoryos.shared.DecimalPrecision;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * The deterministic engine that calculates theoretical inventory balances.
 * Iron Law: Balance(location, item, time) = f(events up to time).
 */
@Service
@Slf4j
public class TheoreticalInventoryEngine {

    /**
     * Calculates the deterministic inventory balance for all items at a location
     * based entirely on the immutable event log.
     */
    public Map<String, InventoryBalance> calculateBalance(List<InventoryEvent> events) {
        // Enforce deterministic processing order: time -> ID
        events.sort(Comparator
                .comparing(InventoryEvent::getEventTime)
                .thenComparing(InventoryEvent::getEventId));

        Map<String, InventoryBalance> balances = new HashMap<>();

        for (InventoryEvent event : events) {
            applyEvent(balances, event);
        }

        return balances;
    }

    private void applyEvent(Map<String, InventoryBalance> balances, InventoryEvent event) {
        String eventType = event.getEventType();
        Map<String, Object> payload = event.getPayload();
        
        switch (eventType) {
            case "InitialInventoryEstablished":
                applyInitialInventory(balances, event, payload);
                break;
            case "PurchaseReceived":
                applyPurchaseReceived(balances, event, payload);
                break;
            case "ConsumptionDeduced":
                applyConsumptionDeduced(balances, event, payload);
                break;
            case "WasteRecorded":
                applyWasteRecorded(balances, event, payload);
                break;
            case "TransferSent":
                applyTransferSent(balances, event, payload);
                break;
            case "TransferReceived":
                applyTransferReceived(balances, event, payload);
                break;
            case "PhysicalCountRecorded":
            case "VarianceDetected":
                // Standard variance just records the math. 
                // A 'CorrectionApplied' event actually mutates the ledger.
                break;
            case "CorrectionApplied":
                applyCorrection(balances, event, payload);
                break;
            default:
                log.trace("Event {} does not mutate inventory balances", eventType);
        }
    }

    private void applyInitialInventory(Map<String, InventoryBalance> balances, InventoryEvent event, Map<String, Object> payload) {
        String ingredientId = (String) payload.get("ingredient_id");
        BigDecimal qty = DecimalPrecision.of(payload.get("quantity").toString());
        BigDecimal cost = DecimalPrecision.of(payload.get("unit_cost").toString());
        String unit = (String) payload.get("unit");

        InventoryBalance starting = InventoryBalance.builder()
                .locationId(event.getLocationId())
                .ingredientId(ingredientId)
                .quantity(qty)
                .unit(unit)
                .averageUnitCost(cost)
                .lastUpdatedAt(event.getEventTime())
                .lastEventId(event.getEventId())
                .build();
        balances.put(ingredientId, starting);
    }

    private void applyPurchaseReceived(Map<String, InventoryBalance> balances, InventoryEvent event, Map<String, Object> payload) {
        String ingredientId = (String) payload.get("ingredient_id");
        BigDecimal qty = DecimalPrecision.of(payload.get("quantity").toString());
        BigDecimal cost = DecimalPrecision.of(payload.get("unit_cost").toString());
        
        balances.compute(ingredientId, (k, current) -> {
            if (current == null) {
                return InventoryBalance.builder()
                        .locationId(event.getLocationId())
                        .ingredientId(ingredientId)
                        .quantity(qty)
                        .unit((String) payload.get("unit"))
                        .averageUnitCost(cost)
                        .lastUpdatedAt(event.getEventTime())
                        .lastEventId(event.getEventId())
                        .build();
            }
            return current.add(qty, cost, event.getEventTime(), event.getEventId());
        });
    }

    @SuppressWarnings("unchecked")
    private void applyConsumptionDeduced(Map<String, InventoryBalance> balances, InventoryEvent event, Map<String, Object> payload) {
        List<Map<String, Object>> ingredientsConsumed = (List<Map<String, Object>>) payload.get("ingredients_consumed");
        if (ingredientsConsumed == null) return;

        for (Map<String, Object> consumed : ingredientsConsumed) {
            String ingredientId = (String) consumed.get("ingredient_id");
            BigDecimal qty = DecimalPrecision.of(consumed.get("quantity_deduced").toString());
            
            balances.computeIfPresent(ingredientId, (k, current) -> 
                current.subtract(qty, event.getEventTime(), event.getEventId())
            );
        }
    }

    private void applyWasteRecorded(Map<String, InventoryBalance> balances, InventoryEvent event, Map<String, Object> payload) {
        String ingredientId = (String) payload.get("ingredient_id");
        BigDecimal qty = DecimalPrecision.of(payload.get("quantity").toString());

        balances.computeIfPresent(ingredientId, (k, current) -> 
            current.subtract(qty, event.getEventTime(), event.getEventId())
        );
    }
    
    private void applyTransferSent(Map<String, InventoryBalance> balances, InventoryEvent event, Map<String, Object> payload) {
        applyItemReductionList(balances, event, payload, "items_sent");
    }

    private void applyTransferReceived(Map<String, InventoryBalance> balances, InventoryEvent event, Map<String, Object> payload) {
         // Received transfers ADD to inventory at receiving location
         applyItemAdditionList(balances, event, payload, "items_received");
    }
    
    @SuppressWarnings("unchecked")
    private void applyItemReductionList(Map<String, InventoryBalance> balances, InventoryEvent event, Map<String, Object> payload, String arrayKey) {
        List<Map<String, Object>> items = (List<Map<String, Object>>) payload.get(arrayKey);
        if (items == null) return;
        
        for (Map<String, Object> item : items) {
            String ingredientId = (String) item.get("ingredient_id");
            BigDecimal qty = DecimalPrecision.of(item.get("quantity").toString());
            balances.computeIfPresent(ingredientId, (k, current) -> 
                current.subtract(qty, event.getEventTime(), event.getEventId())
            );
        }
    }

    @SuppressWarnings("unchecked")
    private void applyItemAdditionList(Map<String, InventoryBalance> balances, InventoryEvent event, Map<String, Object> payload, String arrayKey) {
        List<Map<String, Object>> items = (List<Map<String, Object>>) payload.get(arrayKey);
        if (items == null) return;
        
        for (Map<String, Object> item : items) {
            String ingredientId = (String) item.get("ingredient_id");
            // Use quantity_actual for transfers, fallback to quantity
            Object qtyRaw = item.containsKey("quantity_actual") ? item.get("quantity_actual") : item.get("quantity");
            BigDecimal qty = DecimalPrecision.of(qtyRaw.toString());
            
            // For transfers between our own locations, assume cost is retrieved from ledger context.
            // Simplified here: unit_cost should be explicitly on the transfer event.
            BigDecimal cost = item.containsKey("unit_cost") ? DecimalPrecision.of(item.get("unit_cost").toString()) : BigDecimal.ZERO;
            
            balances.computeIfPresent(ingredientId, (k, current) -> 
                current.add(qty, cost, event.getEventTime(), event.getEventId())
            );
        }
    }

    private void applyCorrection(Map<String, InventoryBalance> balances, InventoryEvent event, Map<String, Object> payload) {
        String ingredientId = (String) payload.get("ingredient_id");
        BigDecimal qtyAdjust = DecimalPrecision.of(payload.get("quantity_adjustment").toString());
        // A correction is purely additive. Math works for negatives too.
        balances.computeIfPresent(ingredientId, (k, current) -> 
            current.subtract(qtyAdjust.negate(), event.getEventTime(), event.getEventId())
        );
    }
}
