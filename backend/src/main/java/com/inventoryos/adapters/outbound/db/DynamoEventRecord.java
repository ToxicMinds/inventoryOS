package com.inventoryos.adapters.outbound.db;

import lombok.Data;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey;

import java.util.Map;

@Data
@DynamoDbBean
public class DynamoEventRecord {
    private String pk; // LOC#123
    private String sk; // EVT#2025-01-01...

    private String eventId;
    private String locationId;
    private String eventType;
    private String eventTime;
    private String processingTime;
    private String correlationId;
    private String causationId;
    private String actorId;
    private int version;
    private Map<String, Object> payload;

    @DynamoDbPartitionKey
    public String getPk() { return pk; }
    public void setPk(String pk) { this.pk = pk; }

    @DynamoDbSortKey
    public String getSk() { return sk; }
    public void setSk(String sk) { this.sk = sk; }
}
