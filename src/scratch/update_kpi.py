import sys
import re

file_path = '/Users/bintangsuharsono/Documents/BINTANG MADA LAPTOP M3/GITHUB SAYA/GARING-ALAMI/garingalami-fe/src/components/CommandCenter.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Add stats state
if 'const [stats, setStats] = useState(null);' not in content:
    content = content.replace(
        'const [analytics, setAnalytics] = useState({ dailyVisits: [], totalToday: 0 });',
        'const [analytics, setAnalytics] = useState({ dailyVisits: [], totalToday: 0 });\n  const [stats, setStats] = useState(null);'
    )

# 2. Add fetchStats function
fetch_stats_fn = """  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

"""
if 'const fetchStats =' not in content:
    # Find fetchProducts and insert before it
    if '  const fetchProducts = async (page = 0) => {' in content:
        content = content.replace('  const fetchProducts = async (page = 0) => {', fetch_stats_fn + '  const fetchProducts = async (page = 0) => {')
    elif 'const fetchProducts = async (page = 0) => {' in content:
        content = content.replace('const fetchProducts = async (page = 0) => {', fetch_stats_fn + 'const fetchProducts = async (page = 0) => {')

# 3. Add fetchStats calls in useEffects
# Initial fetch
content = content.replace('fetchAnalytics();\n    fetchLogs();', 'fetchAnalytics();\n    fetchStats();\n    fetchLogs();')
# Polling fetch
content = content.replace('fetchAnalytics();\n      } else if (activeTab === \'logs\') {', 'fetchAnalytics();\n        fetchStats();\n      } else if (activeTab === \'logs\') {')

# 4. Insert the KPI cards into the JSX
kpi_cards_jsx = """                {/* STATS OVERVIEW */}
                {stats && (
                  <div className="grid grid-cols-4 gap-6 mb-8 shrink-0">
                    {[
                      { label: 'Total Archetypes', value: stats.totalActive, icon: Database, color: 'text-blue-500', bg: 'bg-blue-50' },
                      { label: 'Stock Volume', value: stats.totalStock?.toLocaleString(), icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                      { label: 'Category Spread', value: stats.categoryCount, icon: Layers, color: 'text-amber-500', bg: 'bg-amber-50' },
                      { label: 'Archived Assets', value: stats.archivedCount, icon: Trash2, color: 'text-rose-500', bg: 'bg-rose-50' }
                    ].map((stat, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white border border-[#F2F2F2] p-6 rounded-[2rem] flex items-center gap-5 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}>
                          <stat.icon size={20} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#A0A0A0]">{stat.label}</p>
                          <h4 className="text-[18px] font-black text-[#1A1A1A] mt-1">{stat.value}</h4>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
"""

if '{/* STATS OVERVIEW */}' not in content:
    # Find action bar and insert before it
    target = '<div className="mb-6 flex items-center justify-between gap-6 shrink-0">'
    content = content.replace(target, kpi_cards_jsx + '                ' + target)

with open(file_path, 'w') as f:
    f.write(content)
print("Successfully updated CommandCenter.jsx with KPI cards.")
