package com.inventoryos.adapters.outbound.db;

import lombok.Data;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey;

import java.math.BigDecimal;

@Data
@DynamoDbBean
public class DynamoBalanceRecord {
    private String pk; // LOC#123
    private String sk; // ING#chicken-breast

    private String locationId;
    private String ingredientId;
    private BigDecimal quantity;
    private String unit;
    private BigDecimal averageUnitCost;
    private String lastUpdatedAt;
    private String lastEventId;

    @DynamoDbPartitionKey
    public String getPk() { return pk; }
    public void setPk(String pk) { this.pk = pk; }

    @DynamoDbSortKey
    public String getSk() { return sk; }
    public void setSk(String sk) { this.sk = sk; }
}
