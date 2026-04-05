package com.inventoryos.adapters.outbound.db;

import com.inventoryos.domain.ledger.InventoryEvent;
import com.inventoryos.ports.outbound.EventStorePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSecondaryPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSecondarySortKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;

import jakarta.annotation.PostConstruct;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
@Slf4j
public class DynamoDbEventStoreAdapter implements EventStorePort {

    private final DynamoDbEnhancedClient enhancedClient;
    private DynamoDbTable<DynamoEventRecord> table;

    @PostConstruct
    public void init() {
        this.table = enhancedClient.table("InventoryEvents", TableSchema.fromBean(DynamoEventRecord.class));
        try {
            table.createTable();
        } catch (Exception e) {
            log.info("Table InventoryEvents might already exist. Exception: {}", e.getMessage());
        }
    }

    @Override
    public void appendEvent(InventoryEvent event) {
        DynamoEventRecord record = new DynamoEventRecord();
        record.setPk("LOC#" + event.getLocationId());
        record.setSk("EVT#" + event.getEventTime().toString() + "#" + event.getEventId());
        record.setEventId(event.getEventId());
        record.setLocationId(event.getLocationId());
        record.setEventType(event.getEventType());
        record.setEventTime(event.getEventTime().toString());
        record.setProcessingTime(event.getProcessingTime().toString());
        record.setCorrelationId(event.getCorrelationId());
        record.setCausationId(event.getCausationId());
        record.setActorId(event.getActorId());
        record.setVersion(event.getVersion());
        record.setPayload(event.getPayload());

        table.putItem(record);
        log.debug("DynamoDB: Appended event {}", event.getEventId());
    }

    @Override
    public List<InventoryEvent> getEventsForLocation(String locationId) {
        Key key = Key.builder().partitionValue("LOC#" + locationId).build();
        return table.query(QueryConditional.keyEqualTo(key))
                .items().stream()
                .map(this::mapRecord)
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryEvent> getEventsForLocationSince(String locationId, Instant since) {
        Key partitionKey = Key.builder().partitionValue("LOC#" + locationId).build();
        return table.query(r -> r.queryConditional(
                QueryConditional.sortGreaterThanOrEqualTo(
                        Key.builder().partitionValue("LOC#" + locationId).sortValue("EVT#" + since.toString()).build()
                )
        )).items().stream().map(this::mapRecord).collect(Collectors.toList());
    }

    @Override
    public boolean eventExistsByCorrelation(String correlationId) {
        // Warning: Requires GSI on correlationId in true Prod.
        // Doing full scan for development mock representation since its local DB without GSI.
        return table.scan().items().stream()
                .anyMatch(i -> correlationId.equals(i.getCorrelationId()));
    }

    private InventoryEvent mapRecord(DynamoEventRecord record) {
        return InventoryEvent.builder()
                .eventId(record.getEventId())
                .locationId(record.getLocationId())
                .eventType(record.getEventType())
                .eventTime(Instant.parse(record.getEventTime()))
                .processingTime(Instant.parse(record.getProcessingTime()))
                .correlationId(record.getCorrelationId())
                .causationId(record.getCausationId())
                .actorId(record.getActorId())
                .version(record.getVersion())
                .payload(record.getPayload())
                .build();
    }
}
