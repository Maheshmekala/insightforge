import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import QueryPage from './pages/QueryPage'
import DataSourcesPage from './pages/DataSourcesPage'

function NavLink({ to, children, icon }: { to: string; children: React.ReactNode; icon: string }) {
  const loc = useLocation();
  const active = loc.pathname === to;
  return (
    <Link to={to} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
      active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'text-gray-300 hover:bg-white/10 hover:text-white'
    }`}>
      <span>{icon}</span> {children}
    </Link>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950">
        <nav className="border-b border-white/10 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-emerald-500/30">
                  IF
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  InsightForge
                </span>
              </div>
              <div className="flex items-center gap-2">
                <NavLink to="/" icon="📊">Dashboard</NavLink>
                <NavLink to="/query" icon="🔍">AI Query</NavLink>
                <NavLink to="/datasources" icon="🔌">Sources</NavLink>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/query" element={<QueryPage />} />
            <Route path="/datasources" element={<DataSourcesPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
export default App
