package com.insightforge.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class HealthController {
    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("status", "UP", "app", "InsightForge", "version", "1.0.0", "features",
            List.of("NL-to-SQL", "AI Insights", "Data Source Manager", "Tableau Integration"));
    }
}
