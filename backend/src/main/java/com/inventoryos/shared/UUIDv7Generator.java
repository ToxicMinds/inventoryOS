package com.inventoryos.shared;

import com.github.f4b6a3.uuid.UuidCreator;
import java.util.UUID;

/**
 * UUIDv7 generator — time-sortable, deterministic from timestamp + sequence counter.
 * Critical for DynamoDB-style sort key ordering and ledger chronological integrity.
 */
public final class UUIDv7Generator {
    private UUIDv7Generator() {}

    public static UUID generate() {
        return UuidCreator.getTimeOrderedEpoch();
    }

    public static String generateString() {
        return generate().toString();
    }
}
