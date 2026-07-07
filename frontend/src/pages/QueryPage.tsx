import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function QueryPage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'nl' | 'sql'>('nl');
  const [rawSql, setRawSql] = useState('');

  const askAI = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Step 1: NL → SQL
      const nlRes = await fetch('/api/query/nl', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      const nlData = await nlRes.json();
      const generatedSql = nlData.sql || '';

      // Step 2: Execute SQL
      const execRes = await fetch('/api/query/execute', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: generatedSql })
      });
      const execData = await execRes.json();

      setResult({
        question,
        sql: generatedSql,
        explanation: nlData.explanation,
        data: execData.data || [],
        rowCount: execData.rowCount || 0,
        insight: execData.insight || '',
        success: execData.success,
        error: execData.error,
      });
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  const runRawSql = async () => {
    if (!rawSql.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/query/execute', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: rawSql })
      });
      const d = await res.json();
      setResult({ sql: rawSql, data: d.data || [], rowCount: d.rowCount || 0, insight: d.insight || '', success: d.success, error: d.error });
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  // Auto-detect chart type
  const renderChart = () => {
    if (!result?.data?.length) return null;
    const cols = Object.keys(result.data[0]);
    const hasNumeric = cols.find(c => typeof result.data[0][c] === 'number');
    const hasString = cols.find(c => typeof result.data[0][c] === 'string' && c !== cols.find(x => x !== c));

    if (hasNumeric && hasString && result.data.length <= 20) {
      const chartData = result.data.map((row: any) => ({ name: String(row[hasString] || '').substring(0, 12), value: row[hasNumeric] }));
      return (
        <div className="chart-enter bg-gray-800/50 rounded-xl p-4 border border-white/5 mt-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">📊 Chart</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="name" stroke="#6b7280" tick={{fontSize:10}} />
              <YAxis stroke="#6b7280" tick={{fontSize:10}} />
              <Tooltip contentStyle={{background:'#1f2937',border:'1px solid #ffffff20',borderRadius:'8px',color:'#fff'}} />
              <Bar dataKey="value" fill="#10b981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }
    return null;
  };

  const suggestions = [
    "Show me top suppliers by spend",
    "Group suppliers by category with total spend",
    "Which suppliers are high risk?",
    "Show me all contracts",
    "Show products by revenue",
    "How many suppliers in each category?"
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">🔍 AI Query Engine</h1>

      {/* Mode Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-900 rounded-xl p-1 border border-white/10 inline-flex">
        {[
          { id: 'nl' as const, label: '🗣️ Natural Language', desc: 'Ask in English' },
          { id: 'sql' as const, label: '💻 SQL Mode', desc: 'Write raw SQL' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-gray-900 rounded-xl border border-white/10 p-6 mb-6">
        {activeTab === 'nl' ? (
          <>
            <label className="block text-sm font-medium text-gray-300 mb-2">Ask a question about your data</label>
            <div className="flex gap-3">
              <input type="text" value={question} onChange={e => setQuestion(e.target.value)}
                placeholder="e.g., Show me top suppliers by spend..."
                className="flex-1 bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onKeyDown={e => e.key === 'Enter' && askAI()} />
              <button onClick={askAI} disabled={loading || !question.trim()}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 font-medium shadow-lg shadow-emerald-500/25">
                {loading ? 'Thinking...' : 'Ask AI →'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {suggestions.map(s => (
                <button key={s} onClick={() => { setQuestion(s); }}
                  className="text-xs bg-white/5 hover:bg-white/10 text-gray-400 px-3 py-1.5 rounded-full border border-white/10 hover:border-emerald-500/50 transition">
                  {s}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-300 mb-2">Write SQL</label>
            <div className="flex gap-3">
              <input type="text" value={rawSql} onChange={e => setRawSql(e.target.value)}
                placeholder="SELECT * FROM suppliers LIMIT 10"
                className="flex-1 bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white font-mono placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onKeyDown={e => e.key === 'Enter' && runRawSql()} />
              <button onClick={runRawSql} disabled={loading || !rawSql.trim()}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-500 disabled:opacity-50 font-medium">
                ▶ Run
              </button>
            </div>
          </>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 p-4 bg-gray-900 rounded-xl border border-white/10 mb-6">
          <div className="flex gap-1">
            <span className="typing-dot w-2.5 h-2.5 bg-emerald-400 rounded-full inline-block"></span>
            <span className="typing-dot w-2.5 h-2.5 bg-emerald-400 rounded-full inline-block"></span>
            <span className="typing-dot w-2.5 h-2.5 bg-emerald-400 rounded-full inline-block"></span>
          </div>
          <span className="text-sm text-gray-400">
            {activeTab === 'nl' ? 'Converting to SQL and querying database...' : 'Executing query...'}
          </span>
        </div>
      )}

      {/* Error */}
      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-red-400 text-sm">{error}</div>}
      {result?.error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-red-400 text-sm">
        SQL Error: {result.error}
      </div>}

      {/* Results */}
      {result && result.success !== false && (
        <div className="space-y-4">
          {/* SQL Generated */}
          {result.sql && (
            <div className="bg-gray-900 rounded-xl border border-white/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-emerald-400 font-medium">📝 SQL Query</span>
                <button onClick={() => { setRawSql(result.sql); setActiveTab('sql'); }}
                  className="text-xs text-gray-500 hover:text-white transition">
                  Open in SQL mode →
                </button>
              </div>
              <code className="text-sm font-mono text-gray-300 bg-white/5 px-3 py-2 rounded block overflow-x-auto">
                {result.sql}
              </code>
            </div>
          )}

          {/* Data Table */}
          {result.data?.length > 0 && (
            <div className="bg-gray-900 rounded-xl border border-white/10 overflow-hidden">
              <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-300">Results ({result.rowCount} rows)</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/5">
                      {Object.keys(result.data[0]).map(col => (
                        <th key={col} className="text-left p-3 text-gray-400 font-medium border-b border-white/10">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.data.map((row: any, i: number) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                        {Object.values(row).map((val: any, j: number) => (
                          <td key={j} className="p-3 text-gray-200 font-mono text-xs">
                            {typeof val === 'number' ? val.toLocaleString() : (val?.toString() ?? 'NULL')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Auto Chart */}
          {renderChart()}

          {/* AI Insight */}
          {result.insight && (
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20 p-5">
              <div className="flex items-start gap-3">
                <span className="text-lg">🤖</span>
                <div>
                  <p className="text-xs text-emerald-400 font-medium mb-1">AI Insight</p>
                  <p className="text-sm text-gray-200">{result.insight}</p>
                </div>
              </div>
            </div>
          )}

          {/* No results */}
          {result.data?.length === 0 && result.success !== false && (
            <div className="bg-gray-900 rounded-xl border border-white/10 p-8 text-center">
              <p className="text-gray-500">Query returned no results</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
