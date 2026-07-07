package com.insightforge.query;

import java.util.List;
import java.util.stream.Collectors;

public class SqlQueryBuilder {
    private String table;
    private List<String> columns;
    private List<Filter> filters;
    private List<String> groupBy;
    private String orderBy;
    private boolean asc = true;
    private Integer limit;

    public static class Filter {
        public String column;
        public String operator; // =, >, <, LIKE
        public Object value;
    }

    public String build() {
        StringBuilder sql = new StringBuilder("SELECT ");
        if (columns == null || columns.isEmpty()) sql.append("*");
        else sql.append(String.join(", ", columns));
        sql.append(" FROM ").append(table);

        if (filters != null && !filters.isEmpty()) {
            sql.append(" WHERE ").append(filters.stream().map(f -> {
                if (f.operator.equals("LIKE"))
                    return f.column + " LIKE '%" + f.value + "%'";
                return f.column + " " + f.operator + " " +
                        (f.value instanceof Number ? f.value : "'" + f.value.toString().replace("'", "''") + "'");
            }).collect(Collectors.joining(" AND ")));
        }
        if (groupBy != null && !groupBy.isEmpty())
            sql.append(" GROUP BY ").append(String.join(", ", groupBy));
        if (orderBy != null)
            sql.append(" ORDER BY ").append(orderBy).append(asc ? " ASC" : " DESC");
        if (limit != null) sql.append(" LIMIT ").append(limit);
        return sql.toString();
    }

    public SqlQueryBuilder table(String t) { this.table = t; return this; }
    public SqlQueryBuilder select(List<String> c) { this.columns = c; return this; }
    public SqlQueryBuilder where(List<Filter> f) { this.filters = f; return this; }
    public SqlQueryBuilder groupBy(List<String> g) { this.groupBy = g; return this; }
    public SqlQueryBuilder orderBy(String o, boolean a) { this.orderBy = o; this.asc = a; return this; }
    public SqlQueryBuilder limit(int l) { this.limit = l; return this; }
}
