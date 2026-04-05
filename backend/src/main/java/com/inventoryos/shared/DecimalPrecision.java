package com.inventoryos.shared;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

/**
 * Centralized decimal precision for all financial and inventory calculations.
 * Iron Law: NO float/double in financial math. BigDecimal with fixed rounding only.
 * Version v1 — HALF_UP to 4 decimal places. Embed this version in every report.
 */
public final class DecimalPrecision {
    private DecimalPrecision() {}

    public static final String VERSION = "rounding:v1";
    public static final int INVENTORY_SCALE = 4;   // e.g. 38.5000 lb
    public static final int CURRENCY_SCALE = 2;    // e.g. $18.99
    public static final RoundingMode ROUNDING = RoundingMode.HALF_UP;
    public static final MathContext MATH_CONTEXT = new MathContext(15, ROUNDING);

    public static BigDecimal of(String value) {
        return new BigDecimal(value).setScale(INVENTORY_SCALE, ROUNDING);
    }

    public static BigDecimal of(double value) {
        // Always go via String to avoid IEEE 754 contamination
        return new BigDecimal(String.valueOf(value)).setScale(INVENTORY_SCALE, ROUNDING);
    }

    public static BigDecimal currency(String value) {
        return new BigDecimal(value).setScale(CURRENCY_SCALE, ROUNDING);
    }

    public static BigDecimal add(BigDecimal a, BigDecimal b) {
        return a.add(b, MATH_CONTEXT).setScale(INVENTORY_SCALE, ROUNDING);
    }

    public static BigDecimal subtract(BigDecimal a, BigDecimal b) {
        return a.subtract(b, MATH_CONTEXT).setScale(INVENTORY_SCALE, ROUNDING);
    }

    public static BigDecimal multiply(BigDecimal a, BigDecimal b) {
        return a.multiply(b, MATH_CONTEXT).setScale(INVENTORY_SCALE, ROUNDING);
    }

    public static BigDecimal divide(BigDecimal a, BigDecimal b) {
        return a.divide(b, INVENTORY_SCALE, ROUNDING);
    }

    public static BigDecimal variancePct(BigDecimal theoretical, BigDecimal variance) {
        if (theoretical.compareTo(BigDecimal.ZERO) == 0) return BigDecimal.ZERO;
        return divide(multiply(variance, new BigDecimal("100")), theoretical);
    }

    public static BigDecimal ZERO = BigDecimal.ZERO.setScale(INVENTORY_SCALE, ROUNDING);
}
