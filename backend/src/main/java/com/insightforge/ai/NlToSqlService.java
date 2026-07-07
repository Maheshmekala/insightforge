package com.insightforge.ai;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class NlToSqlService {
    private final GroqClient groqClient;

    public NlToSqlService(GroqClient groqClient) {
        this.groqClient = groqClient;
    }

    public Map<String, Object> processNaturalLanguage(String question, List<Map<String, Object>> schema) {
        StringBuilder schemaStr = new StringBuilder("Available tables:\n");
        for (Map<String, Object> table : schema) {
            schemaStr.append("- ").append(table.get("name")).append(": ")
                     .append(table.get("columns")).append("\n");
        }

        String systemPrompt = "You are an NL-to-SQL converter. Given a question and database schema, " +
            "generate a SQL query. Respond with JSON: {\"sql\": \"...\", \"explanation\": \"...\"}\n\n" +
            "SCHEMA:\n" + schemaStr.toString();

        String userPrompt = "Convert this to SQL: " + question;
        String response = groqClient.chat(systemPrompt, userPrompt);

        // Parse JSON from response
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("original", question);
        result.put("sql", extractSql(response));
        result.put("explanation", response.length() > 200 ? response.substring(0, 200) : response);
        return result;
    }

    public Map<String, Object> generateInsight(String dataContext) {
        String systemPrompt = "You are a data analyst. Given query results, provide insights, " +
            "trends, anomalies, and recommendations. Be concise and professional.";
        String response = groqClient.chat(systemPrompt,
            "Analyze this data and provide business insights:\n" + dataContext);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("insight", response);
        result.put("generatedAt", new Date().toString());
        return result;
    }

    private String extractSql(String response) {
        // Try to extract JSON
        int start = response.indexOf("\"sql\"");
        if (start >= 0) {
            int colon = response.indexOf(":", start);
            int quote1 = response.indexOf("\"", colon + 1);
            int quote2 = response.indexOf("\"", quote1 + 1);
            if (quote1 >= 0 && quote2 > quote1) {
                return response.substring(quote1 + 1, quote2);
            }
        }
        // Fallback: return first 200 chars
        return response.length() > 200 ? response.substring(0, 200) : response;
    }
}
