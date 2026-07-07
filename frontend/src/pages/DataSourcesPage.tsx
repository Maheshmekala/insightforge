import { useState, useEffect } from 'react';

export default function DataSourcesPage() {
  const [tables, setTables] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/query/tables').then(r => r.json()).then(setTables).catch(() => {});
  }, []);

  const sources = [
    { id: 1, name: 'H2 In-Memory Database', type: 'H2', host: 'embedded', port: '-', db: 'insightforge', active: true, tables: tables.length, desc: 'Current active database with sample procurement data' },
    { id: 2, name: 'PostgreSQL - Production', type: 'POSTGRESQL', host: 'localhost', port: 5432, db: 'procureai', active: false, tables: 0, desc: 'Configure in application.yml' },
    { id: 3, name: 'Snowflake - Data Warehouse', type: 'SNOWFLAKE', host: '****.snowflake.com', port: 443, db: 'SALES_DB', active: false, tables: 0, desc: 'Configure credentials to connect' },
    { id: 4, name: 'Tableau Server', type: 'TABLEAU', host: '10x.online.tableau.com', port: 443, db: '-', active: false, tables: 3, desc: '3 workbooks available for embedding' },
  ];

  return <div>
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Data Source Manager</h1>
        <p className="text-gray-400 text-sm mt-1">Manage database connections and schemas</p>
      </div>
      <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-500 text-sm font-medium shadow-lg shadow-emerald-500/25">
        + Add Source
      </button>
    </div>

    <div className="grid gap-4">
      {sources.map(s => (
        <div key={s.id} className="bg-gray-900 rounded-xl border border-white/10 p-5 hover:bg-gray-800/50 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${s.active ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-gray-600'}`}></div>
              <div>
                <h3 className="font-semibold text-white">{s.name}</h3>
                <p className="text-sm text-gray-400">{s.type} — {s.host}:{s.port}/{s.db}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {s.tables > 0 && <span className="text-xs text-gray-400">{s.tables} tables</span>}
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                s.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-500'
              }`}>{s.active ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Schema Info */}
    {tables.length > 0 && (
      <div className="mt-6 bg-gray-900 rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">📋 Database Schema</h2>
        <div className="grid gap-3">
          {tables.map((t: any) => (
            <div key={t.name} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white text-sm">{t.name}</span>
                <span className="text-xs text-gray-500">{t.rowCount} rows</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {(t.columns || []).map((c: string) => (
                  <span key={c} className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded">{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>;
}
