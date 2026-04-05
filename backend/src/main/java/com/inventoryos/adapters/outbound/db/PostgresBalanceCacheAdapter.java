package com.inventoryos.adapters.outbound.db;

import com.inventoryos.domain.ledger.InventoryBalance;
import com.inventoryos.ports.outbound.BalanceCachePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
@Slf4j
public class PostgresBalanceCacheAdapter implements BalanceCachePort {

    private final JdbcTemplate jdbcTemplate;

    private static final String UPSERT_BALANCE = 
        "INSERT INTO inventory_balances " +
        "(location_id, ingredient_id, quantity, unit, average_unit_cost, last_updated_at, last_event_id) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?) " +
        "ON CONFLICT (location_id, ingredient_id) DO UPDATE SET " +
        "quantity = EXCLUDED.quantity, " +
        "unit = EXCLUDED.unit, " +
        "average_unit_cost = EXCLUDED.average_unit_cost, " +
        "last_updated_at = EXCLUDED.last_updated_at, " +
        "last_event_id = EXCLUDED.last_event_id";

    private static final String SELECT_SINGLE = 
        "SELECT * FROM inventory_balances WHERE location_id = ? AND ingredient_id = ?";

    private static final String SELECT_ALL_FOR_LOCATION = 
        "SELECT * FROM inventory_balances WHERE location_id = ?";

    private final RowMapper<InventoryBalance> balanceRowMapper = (rs, rowNum) -> 
        InventoryBalance.builder()
                .locationId(rs.getString("location_id"))
                .ingredientId(rs.getString("ingredient_id"))
                .quantity(rs.getBigDecimal("quantity"))
                .unit(rs.getString("unit"))
                .averageUnitCost(rs.getBigDecimal("average_unit_cost"))
                .lastUpdatedAt(rs.getTimestamp("last_updated_at").toInstant())
                .lastEventId(rs.getString("last_event_id"))
                .build();

    @Override
    public Optional<InventoryBalance> getBalance(String locationId, String ingredientId) {
        List<InventoryBalance> results = jdbcTemplate.query(SELECT_SINGLE, balanceRowMapper, locationId, ingredientId);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    @Override
    public Map<String, InventoryBalance> getAllBalancesForLocation(String locationId) {
        List<InventoryBalance> results = jdbcTemplate.query(SELECT_ALL_FOR_LOCATION, balanceRowMapper, locationId);
        Map<String, InventoryBalance> map = new HashMap<>();
        for (InventoryBalance balance : results) {
            map.put(balance.getIngredientId(), balance);
        }
        return map;
    }

    @Override
    public void saveBalance(InventoryBalance balance) {
        jdbcTemplate.update(UPSERT_BALANCE,
                balance.getLocationId(),
                balance.getIngredientId(),
                balance.getQuantity(),
                balance.getUnit(),
                balance.getAverageUnitCost(),
                Timestamp.from(balance.getLastUpdatedAt()),
                UUID.fromString(balance.getLastEventId()));
    }
}
