import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function DashboardPage() {
  const [data, setData] = useState<any>({ suppliers: [], contracts: [], products: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/query/execute', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({sql:'SELECT * FROM suppliers ORDER BY annual_spend DESC'}) }).then(r => r.json()),
      fetch('/api/query/execute', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({sql:'SELECT * FROM contracts'}) }).then(r => r.json()),
    ]).then(([s, c]) => {
      setData({ suppliers: s.data || [], contracts: c.data || [] });
      setLoading(false);
    });
  }, []);

  const spendByCategory = (data.suppliers || []).reduce((acc: any, s: any) => {
    acc[s.CATEGORY] = (acc[s.CATEGORY] || 0) + s.ANNUAL_SPEND;
    return acc;
  }, {});

  const pieData = Object.entries(spendByCategory).map(([name, value]) => ({ name, value }));

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Query and visualize your data in real-time</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Suppliers', value: data.suppliers.length, icon: '🏢', color: 'from-emerald-500 to-teal-600' },
          { title: 'Total Spend', value: `$${(data.suppliers as any[])?.reduce((s: number, x: any) => s + (x.ANNUAL_SPEND || 0), 0).toLocaleString()}`, icon: '💰', color: 'from-blue-500 to-indigo-600' },
          { title: 'Contracts', value: data.contracts.length, icon: '📄', color: 'from-amber-500 to-orange-600' },
          { title: 'Active', value: (data.contracts as any[])?.filter((c: any) => c.STATUS === 'ACTIVE').length || 0, icon: '✅', color: 'from-emerald-500 to-green-600' },
        ].map(card => (
          <div key={card.title} className="bg-gray-900 rounded-xl border border-white/10 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{card.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-xl shadow-lg`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Suppliers Bar Chart */}
        <div className="bg-gray-900 rounded-xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Top Suppliers by Spend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={(data.suppliers || []).slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="NAME" stroke="#6b7280" tick={{fontSize:11}} />
              <YAxis stroke="#6b7280" tick={{fontSize:11}} tickFormatter={(v: number) => `$${(v/1000000).toFixed(0)}M`} />
              <Tooltip contentStyle={{background:'#1f2937',border:'1px solid #ffffff20',borderRadius:'8px',color:'#fff'}} />
              <Bar dataKey="ANNUAL_SPEND" fill="#10b981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Spend by Category Pie Chart */}
        <div className="bg-gray-900 rounded-xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Spend by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({name, value}) => `${name}: $${(value/1000000).toFixed(1)}M`}>
                {pieData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{background:'#1f2937',border:'1px solid #ffffff20',borderRadius:'8px',color:'#fff'}} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* AI Query Box */}
        <div className="bg-gray-900 rounded-xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">🗣️ Ask Your Data</h2>
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-5 border border-emerald-500/20">
            <p className="text-gray-300 text-sm mb-4">Ask questions in plain English and get instant answers with charts.</p>
            <div className="space-y-2 mb-4">
              {["💬 'Show top suppliers by spend'", "📊 'Group suppliers by category'", "🔍 'Find high risk suppliers'", "📄 'Show me all contracts'"].map(s => (
                <p key={s} className="text-sm text-gray-400">{s}</p>
              ))}
            </div>
            <Link to="/query" className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/25 font-medium text-sm">
              Open AI Query →
            </Link>
          </div>
        </div>

        {/* Contracts Table */}
        <div className="bg-gray-900 rounded-xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Active Contracts</h2>
          <div className="space-y-2">
            {(data.contracts as any[])?.filter((c: any) => c.STATUS === 'ACTIVE').slice(0, 5).map((c: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-white">{c.TITLE}</p>
                  <p className="text-xs text-gray-400">{c.SUPPLIER_NAME} · Ends {c.END_DATE}</p>
                </div>
                <span className="text-sm font-mono text-emerald-400">${(c.CONTRACT_VALUE || 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
