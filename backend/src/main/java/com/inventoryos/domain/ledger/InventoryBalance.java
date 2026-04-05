package com.inventoryos.domain.ledger;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Derived, materialized view of current inventory balance.
 * Iron Law: This state is NEVER mutated raw. It is exclusively derived from the event log 
 * or cached as an optimization snapshot.
 */
@Value
@Builder
public class InventoryBalance {
    String locationId;
    String ingredientId;
    BigDecimal quantity;
    String unit;
    BigDecimal averageUnitCost;
    Instant lastUpdatedAt;
    String lastEventId;

    public InventoryBalance add(BigDecimal amount, BigDecimal unitCost, Instant eventTime, String eventId) {
        // Weighted average cost calculation
        BigDecimal totalValue = this.quantity.multiply(this.averageUnitCost)
                .add(amount.multiply(unitCost));
        BigDecimal newQuantity = this.quantity.add(amount);
        
        BigDecimal newAvgCost = newQuantity.compareTo(BigDecimal.ZERO) == 0 ? 
            BigDecimal.ZERO : 
            totalValue.divide(newQuantity, 4, java.math.RoundingMode.HALF_UP);

        return InventoryBalance.builder()
                .locationId(this.locationId)
                .ingredientId(this.ingredientId)
                .quantity(newQuantity)
                .unit(this.unit)
                .averageUnitCost(newAvgCost)
                .lastUpdatedAt(eventTime)
                .lastEventId(eventId)
                .build();
    }

    public InventoryBalance subtract(BigDecimal amount, Instant eventTime, String eventId) {
        // Cost per unit doesn't change on reduction
        return InventoryBalance.builder()
                .locationId(this.locationId)
                .ingredientId(this.ingredientId)
                .quantity(this.quantity.subtract(amount))
                .unit(this.unit)
                .averageUnitCost(this.averageUnitCost)  
                .lastUpdatedAt(eventTime)
                .lastEventId(eventId)
                .build();
    }
}
