package com.inventoryos.adapters.outbound.db;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.inventoryos.domain.ledger.InventoryEvent;
import com.inventoryos.ports.outbound.EventStorePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * PostgreSQL adapter implementing the inbound EventStorePort.
 * This simulates DynamoDB's single-table approach within Postgres.
 */
@Repository
@RequiredArgsConstructor
@Slf4j
public class PostgresEventStoreAdapter implements EventStorePort {

    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    private static final String INSERT_EVENT_SQL = 
        "INSERT INTO inventory_events (event_id, location_id, event_type, event_time, " +
        "processing_time, correlation_id, causation_id, actor_id, version, payload) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?::jsonb)";

    private static final String SELECT_BY_LOCATION =
        "SELECT * FROM inventory_events WHERE location_id = ? ORDER BY event_time ASC, event_id ASC";
        
    private static final String SELECT_BY_LOCATION_SINCE =
        "SELECT * FROM inventory_events WHERE location_id = ? AND event_time >= ? ORDER BY event_time ASC, event_id ASC";
        
    private RowMapper<InventoryEvent> getEventRowMapper() {
        return (rs, rowNum) -> {
            try {
                return InventoryEvent.builder()
                        .eventId(rs.getString("event_id"))
                        .locationId(rs.getString("location_id"))
                        .eventType(rs.getString("event_type"))
                        .eventTime(rs.getTimestamp("event_time").toInstant())
                        .processingTime(rs.getTimestamp("processing_time").toInstant())
                        .correlationId(rs.getString("correlation_id"))
                        .causationId(rs.getString("causation_id"))
                        .actorId(rs.getString("actor_id"))
                        .version(rs.getInt("version"))
                        .payload(objectMapper.readValue(rs.getString("payload"), new TypeReference<Map<String, Object>>() {}))
                        .build();
            } catch (Exception e) {
                log.error("Failed to map event from DB", e);
                throw new RuntimeException("Database deserialization error", e);
            }
        };
    }

    @Override
    public void appendEvent(InventoryEvent event) {
        try {
            String payloadJson = objectMapper.writeValueAsString(event.getPayload());
            jdbcTemplate.update(INSERT_EVENT_SQL,
                    UUID.fromString(event.getEventId()),
                    event.getLocationId(),
                    event.getEventType(),
                    Timestamp.from(event.getEventTime()),
                    Timestamp.from(event.getProcessingTime()),
                    event.getCorrelationId(),
                    event.getCausationId(),
                    event.getActorId(),
                    event.getVersion(),
                    payloadJson);
            log.debug("Appended event [{}] to ledger", event.getEventId());
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize event payload", e);
            throw new RuntimeException("Serialization error", e);
        }
    }

    @Override
    public List<InventoryEvent> getEventsForLocation(String locationId) {
        return jdbcTemplate.query(SELECT_BY_LOCATION, getEventRowMapper(), locationId);
    }

    @Override
    public List<InventoryEvent> getEventsForLocationSince(String locationId, Instant since) {
        return jdbcTemplate.query(SELECT_BY_LOCATION_SINCE, getEventRowMapper(), locationId, Timestamp.from(since));
    }

    @Override
    public boolean eventExistsByCorrelation(String correlationId) {
        if (correlationId == null) return false;
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM inventory_events WHERE correlation_id = ?",
                Integer.class, correlationId);
        return count != null && count > 0;
    }
}
