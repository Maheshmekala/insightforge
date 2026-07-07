package com.insightforge.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private final JdbcTemplate jdbcTemplate;

    public DataSeeder(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        try {
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS suppliers (" +
                "id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), category VARCHAR(255), " +
                "annual_spend DOUBLE, risk_score INT, contact_email VARCHAR(255))");
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS contracts (" +
                "id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), supplier_name VARCHAR(255), " +
                "status VARCHAR(50), start_date DATE, end_date DATE, contract_value DOUBLE)");
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS products (" +
                "id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), category VARCHAR(255), " +
                "price DOUBLE, units_sold INT, revenue DOUBLE)");

            Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM suppliers", Long.class);
            if (count == 0) {
                jdbcTemplate.execute("INSERT INTO suppliers VALUES " +
                    "(1,'Acme Corp','Technology',1250000,30,'acme@corp.com')," +
                    "(2,'GlobalParts Inc','Manufacturing',890000,65,'gp@inc.com')," +
                    "(3,'DataSync Solutions','Technology',2100000,45,'ds@sync.com')," +
                    "(4,'FreshSupply Co','Food & Beverage',450000,20,'fresh@supply.com')," +
                    "(5,'BuildRite Materials','Construction',670000,55,'br@build.com')," +
                    "(6,'TechVendor Pro','Technology',3200000,75,'tv@pro.com')," +
                    "(7,'MedEquip Direct','Healthcare',1800000,35,'me@direct.com')," +
                    "(8,'LogiTrans Solutions','Logistics',920000,50,'lt@logi.com')");

                jdbcTemplate.execute("INSERT INTO contracts VALUES " +
                    "(1,'IT Infrastructure','Acme Corp','ACTIVE','2026-01-15','2027-01-14',1200000)," +
                    "(2,'Manufacturing Supply','GlobalParts Inc','ACTIVE','2026-03-01','2026-12-31',890000)," +
                    "(3,'Cloud Services','DataSync Solutions','ACTIVE','2026-02-01','2026-08-30',2100000)");

                jdbcTemplate.execute("INSERT INTO products VALUES " +
                    "(1,'Laptop Pro','Electronics',1499.99,500,749995)," +
                    "(2,'Server Rack','Infrastructure',8999.99,100,899999)," +
                    "(3,'Cloud License','Software',299.99,2000,599980)," +
                    "(4,'Office Chair','Furniture',499.99,800,399992)");
                System.out.println("✅ InsightForge demo data seeded!");
            }
        } catch (Exception e) {
            System.out.println("⚠️ Seed error: " + e.getMessage());
        }
    }
}
