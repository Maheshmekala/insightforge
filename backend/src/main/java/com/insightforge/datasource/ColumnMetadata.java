package com.insightforge.datasource;

public class ColumnMetadata {
    private final String name;
    private final String dataType;
    private final boolean nullable;
    private final boolean primaryKey;

    public ColumnMetadata(String name, String dataType, boolean nullable, boolean primaryKey) {
        this.name = name; this.dataType = dataType; this.nullable = nullable; this.primaryKey = primaryKey;
    }
    public String getName() { return name; }
    public String getDataType() { return dataType; }
    public boolean isNullable() { return nullable; }
    public boolean isPrimaryKey() { return primaryKey; }
}
