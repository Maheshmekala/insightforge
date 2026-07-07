package com.insightforge.datasource;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

public class PostgresConnector implements DataSourceConnector {
    private final HikariDataSource dataSource;

    public PostgresConnector(DataSourceConfig config) {
        HikariConfig h = new HikariConfig();
        h.setJdbcUrl(String.format("jdbc:postgresql://%s:%d/%s", config.getHost(), config.getPort(), config.getDatabaseName()));
        h.setUsername(config.getUsername());
        h.setPassword(config.getPassword());
        h.setMaximumPoolSize(5);
        dataSource = new HikariDataSource(h);
    }

    @Override
    public boolean testConnection() {
        try (Connection c = dataSource.getConnection()) { return c.isValid(2); }
        catch (SQLException e) { return false; }
    }

    @Override
    public List<String> getTableNames() {
        List<String> tables = new ArrayList<>();
        try (Connection c = dataSource.getConnection();
             ResultSet rs = c.getMetaData().getTables(null, "public", "%", new String[]{"TABLE"})) {
            while (rs.next()) tables.add(rs.getString("TABLE_NAME"));
        } catch (SQLException e) { throw new RuntimeException(e); }
        return tables;
    }

    @Override
    public List<ColumnMetadata> getColumns(String tableName) {
        List<ColumnMetadata> cols = new ArrayList<>();
        try (Connection c = dataSource.getConnection();
             ResultSet rs = c.getMetaData().getColumns(null, "public", tableName, "%")) {
            while (rs.next()) cols.add(new ColumnMetadata(
                    rs.getString("COLUMN_NAME"), rs.getString("TYPE_NAME"),
                    rs.getString("IS_NULLABLE").equals("YES"), false));
        } catch (SQLException e) { throw new RuntimeException(e); }
        return cols;
    }

    @Override
    public List<Map<String, Object>> executeQuery(String sql, int limit) {
        List<Map<String, Object>> results = new ArrayList<>();
        String query = limit > 0 ? sql + " LIMIT " + limit : sql;
        try (Connection c = dataSource.getConnection();
             Statement stmt = c.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            ResultSetMetaData meta = rs.getMetaData();
            int colCount = meta.getColumnCount();
            while (rs.next()) {
                Map<String, Object> row = new LinkedHashMap<>();
                for (int i = 1; i <= colCount; i++) {
                    row.put(meta.getColumnName(i), rs.getObject(i));
                }
                results.add(row);
            }
        } catch (SQLException e) { throw new RuntimeException(e); }
        return results;
    }

    @Override
    public DataSource getDataSource() { return dataSource; }
}
