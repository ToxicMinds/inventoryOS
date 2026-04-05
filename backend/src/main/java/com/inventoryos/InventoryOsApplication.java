package com.inventoryos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class InventoryOsApplication {
    public static void main(String[] args) {
        SpringApplication.run(InventoryOsApplication.class, args);
    }
}
