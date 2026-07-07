package com.insightforge.insight;

import com.insightforge.ai.NlToSqlService;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/insights")
public class InsightController {
    private final NlToSqlService nlToSqlService;

    public InsightController(NlToSqlService nlToSqlService) {
        this.nlToSqlService = nlToSqlService;
    }

    @PostMapping("/generate")
    public Map<String, Object> generate(@RequestBody Map<String, Object> req) {
        String label = (String) req.getOrDefault("label", "data");
        List<Map<String, Object>> rows = (List<Map<String, Object>>) req.get("data");

        StringBuilder context = new StringBuilder("Dataset: " + label + "\n");
        if (rows != null && !rows.isEmpty()) {
            context.append("Columns: ").append(rows.get(0).keySet()).append("\n");
            context.append("Row count: ").append(rows.size()).append("\n");
            context.append("Sample: ").append(rows.get(0)).append("\n");
        }

        Map<String, Object> insight = nlToSqlService.generateInsight(context.toString());
        insight.put("label", label);
        insight.put("rowCount", rows != null ? rows.size() : 0);
        return insight;
    }

    @PostMapping("/nlquery")
    public Map<String, Object> nlQuery(@RequestBody Map<String, Object> req) {
        String question = (String) req.getOrDefault("question", "");
        List<Map<String, Object>> schema = new ArrayList<>();
        schema.add(Map.of("name", "suppliers", "columns", "id, name, category, annual_spend, risk_score, contact_email, created_at"));
        schema.add(Map.of("name", "contracts", "columns", "id, title, content, start_date, end_date, contract_value, status, supplier_id"));
        return nlToSqlService.processNaturalLanguage(question, schema);
    }
}
