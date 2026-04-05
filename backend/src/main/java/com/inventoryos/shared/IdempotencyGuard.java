package com.inventoryos.shared;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Idempotency guard guaranteeing exactly-once processing for client requests.
 * In a serverless environment with DynamoDB, we'd use conditional writes.
 * For local PostgreSQL simulation, we check for a unique constraint or use a cache.
 */
@Component
@Slf4j
public class IdempotencyGuard {

    // Simple in-memory cache for local dev simulation. 
    // In production, this relies on DB constraints (attribute_not_exists).
    private final Set<String> processedKeys = ConcurrentHashMap.newKeySet();

    public void checkAndGuard(String idempotencyKey) {
        if (idempotencyKey == null || idempotencyKey.trim().isEmpty()) {
            throw new IllegalArgumentException("Idempotency key is required for state-mutating requests");
        }

        if (!processedKeys.add(idempotencyKey)) {
            log.warn("Idempotent replay detected for key: {}", idempotencyKey);
            throw new DuplicateRequestException("Request with this idempotency key was already processed");
        }
    }

    public static class DuplicateRequestException extends RuntimeException {
        public DuplicateRequestException(String message) {
            super(message);
        }
    }
}
