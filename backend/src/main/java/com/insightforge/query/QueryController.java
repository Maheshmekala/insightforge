package com.insightforge.query;

import com.insightforge.ai.NlToSqlService;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/query")
public class QueryController {
    private final NlToSqlService nlToSqlService;
    private final JdbcTemplate jdbcTemplate;

    public QueryController(NlToSqlService nlToSqlService, JdbcTemplate jdbcTemplate) {
        this.nlToSqlService = nlToSqlService;
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/nl")
    public Map<String, Object> naturalLanguage(@RequestBody Map<String, String> req) {
        String question = req.get("question");
        List<Map<String, Object>> schema = List.of(
            Map.of("name", "suppliers", "columns", "id, name, category, annual_spend, risk_score, contact_email"),
            Map.of("name", "contracts", "columns", "id, title, supplier_name, status, start_date, end_date, contract_value"),
            Map.of("name", "products", "columns", "id, name, category, price, units_sold, revenue")
        );
        return nlToSqlService.processNaturalLanguage(question, schema);
    }

    @PostMapping("/execute")
    public Map<String, Object> execute(@RequestBody Map<String, Object> req) {
        String sql = (String) req.getOrDefault("sql", "SELECT 1");
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            result.put("success", true);
            result.put("data", rows);
            result.put("rowCount", rows.size());
            result.put("sql", sql);

            // Also generate AI insight
            if (!rows.isEmpty()) {
                String context = "Query: " + sql + "\nRows: " + rows.size() + "\nSample: " + rows.get(0);
                Map<String, Object> insight = nlToSqlService.generateInsight(context);
                result.put("insight", insight.get("insight"));
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            result.put("sql", sql);
        }
        return result;
    }

    @GetMapping("/tables")
    public List<Map<String, Object>> getTables() {
        List<Map<String, Object>> tables = new ArrayList<>();
        for (String table : List.of("suppliers", "contracts", "products")) {
            try {
                List<Map<String, Object>> cols = jdbcTemplate.queryForList(
                    "SELECT COLUMN_NAME, TYPE_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ?",
                    table.toUpperCase()
                );
                List<String> columns = cols.stream()
                    .map(c -> c.get("COLUMN_NAME") + " (" + c.get("TYPE_NAME") + ")")
                    .collect(Collectors.toList());
                Map<String, Object> t = new LinkedHashMap<>();
                t.put("name", table);
                t.put("columns", columns);
                t.put("rowCount", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + table, Integer.class));
                tables.add(t);
            } catch (Exception e) {
                Map<String, Object> t = new LinkedHashMap<>();
                t.put("name", table);
                t.put("error", e.getMessage());
                tables.add(t);
            }
        }
        return tables;
    }
}
