package com.insightforge.tableau;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/tableau")
public class TableauController {

    @GetMapping("/workbooks")
    public List<Map<String, String>> listWorkbooks() {
        return List.of(
                Map.of("id", "1", "name", "Procurement Overview"),
                Map.of("id", "2", "name", "Supplier Performance"),
                Map.of("id", "3", "name", "Spend Analysis")
        );
    }

    @GetMapping("/embed/{id}")
    public Map<String, String> getEmbed(@PathVariable String id) {
        return Map.of(
                "workbookId", id,
                "embedUrl", "https://public.tableau.com/views/" + id,
                "message", "Tableau REST API ready — connect to your server"
        );
    }
}
