import sys
import re

file_path = '/Users/bintangsuharsono/Documents/BINTANG MADA LAPTOP M3/GITHUB SAYA/GARING-ALAMI/garingalami-fe/src/components/CommandCenter.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Add Filter Tabs UI before the Register button
filter_tabs_jsx = """                    <div className="flex bg-[#F8F9FA] p-1 rounded-2xl border border-[#F0F0F0] shrink-0">
                      {[
                        { id: 'all', label: 'All', icon: Layers },
                        { id: 'active', label: 'Active', icon: ShieldCheck },
                        { id: 'inactive', label: 'Archived', icon: Trash2 }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setColumnFilters({...columnFilters, status: tab.id})}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${columnFilters.status === tab.id ? 'bg-[#1A1A1A] text-white shadow-lg' : 'text-[#A0A0A0] hover:text-[#1A1A1A]'}`}
                        >
                          <tab.icon size={12} />
                          {tab.label}
                        </button>
                      ))}
                    </div>
"""
# Insert before handleStartNew button
content = content.replace('<button \n                        onClick={handleStartNew}', filter_tabs_jsx + '                      <button \n                        onClick={handleStartNew}')

# 2. Add Status Column Header
status_header = """                            <th className="px-6 py-4 border-b border-[#F8F8F8] text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FAFAFA]/20">Status</th>
"""
content = content.replace('STATUS & CYCLE', 'CYCLE TIMELINE') # Rename old column if needed
content = content.replace('<th className="px-6 py-4 border-b border-[#F8F8F8] text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FAFAFA]/20">', status_header + '                            <th className="px-6 py-4 border-b border-[#F8F8F8] text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FAFAFA]/20">', 1)

# 3. Add Status Badge in Table Body
status_cell = """                              <td className="px-6 py-4">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${p.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'}`}>
                                  {p.active ? 'Active' : 'Archived'}
                                </span>
                              </td>
"""
# Find the start of <tr> in tbody and insert after the first few cells
# This is tricky with regex, let's target the first <td>
content = content.replace('<td className="px-6 py-4">\n                                <div className="flex items-center gap-5">', status_cell + '                              <td className="px-6 py-4">\n                                <div className="flex items-center gap-5">', 1)

with open(file_path, 'w') as f:
    f.write(content)
print("Successfully restored Status Tabs and added Status Column.")
