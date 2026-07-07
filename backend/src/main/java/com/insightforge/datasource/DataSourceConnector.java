package com.insightforge.datasource;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;

public interface DataSourceConnector {
    boolean testConnection();
    List<String> getTableNames();
    List<ColumnMetadata> getColumns(String tableName);
    List<Map<String, Object>> executeQuery(String sql, int limit);
    DataSource getDataSource();
}
