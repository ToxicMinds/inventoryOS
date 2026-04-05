package com.inventoryos.adapters.outbound.db;

import com.inventoryos.domain.ledger.InventoryBalance;
import com.inventoryos.ports.outbound.BalanceCachePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;

import jakarta.annotation.PostConstruct;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
@Slf4j
public class DynamoDbBalanceCacheAdapter implements BalanceCachePort {

    private final DynamoDbEnhancedClient enhancedClient;
    private DynamoDbTable<DynamoBalanceRecord> table;

    @PostConstruct
    public void init() {
        this.table = enhancedClient.table("InventoryBalances", TableSchema.fromBean(DynamoBalanceRecord.class));
        try {
            table.createTable();
        } catch (Exception e) {
            log.info("Table InventoryBalances might already exist. Exception: {}", e.getMessage());
        }
    }

    @Override
    public Optional<InventoryBalance> getBalance(String locationId, String ingredientId) {
        Key key = Key.builder()
                .partitionValue("LOC#" + locationId)
                .sortValue("ING#" + ingredientId)
                .build();
        
        DynamoBalanceRecord item = table.getItem(key);
        if (item == null) {
            return Optional.empty();
        }
        return Optional.of(mapRecord(item));
    }

    @Override
    public Map<String, InventoryBalance> getAllBalancesForLocation(String locationId) {
        Key partitionKey = Key.builder().partitionValue("LOC#" + locationId).build();
        Map<String, InventoryBalance> map = new HashMap<>();
        
        table.query(QueryConditional.keyEqualTo(partitionKey))
             .items().forEach(record -> {
                 map.put(record.getIngredientId(), mapRecord(record));
             });
        
        return map;
    }

    @Override
    public void saveBalance(InventoryBalance balance) {
        DynamoBalanceRecord record = new DynamoBalanceRecord();
        record.setPk("LOC#" + balance.getLocationId());
        record.setSk("ING#" + balance.getIngredientId());
        record.setLocationId(balance.getLocationId());
        record.setIngredientId(balance.getIngredientId());
        record.setQuantity(balance.getQuantity());
        record.setUnit(balance.getUnit());
        record.setAverageUnitCost(balance.getAverageUnitCost());
        record.setLastUpdatedAt(balance.getLastUpdatedAt().toString());
        record.setLastEventId(balance.getLastEventId());
        
        table.putItem(record);
        log.debug("DynamoDB: Saved balance for {} at {}", balance.getIngredientId(), balance.getLocationId());
    }

    private InventoryBalance mapRecord(DynamoBalanceRecord record) {
        return InventoryBalance.builder()
                .locationId(record.getLocationId())
                .ingredientId(record.getIngredientId())
                .quantity(record.getQuantity())
                .unit(record.getUnit())
                .averageUnitCost(record.getAverageUnitCost())
                .lastUpdatedAt(Instant.parse(record.getLastUpdatedAt()))
                .lastEventId(record.getLastEventId())
                .build();
    }
}
