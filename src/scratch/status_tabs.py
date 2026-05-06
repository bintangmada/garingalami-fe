import sys
import re

file_path = '/Users/bintangsuharsono/Documents/BINTANG MADA LAPTOP M3/GITHUB SAYA/GARING-ALAMI/garingalami-fe/src/components/CommandCenter.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Add status filter state
if "status: 'all'" not in content:
    content = content.replace("quota: ''", "quota: '',\n    status: 'all'")

# 2. Update filtering logic
old_filter_logic = 'return matchesSearch && matchesName && matchesCat && matchesPrice && matchesQuota;'
new_filter_logic = 'const matchesStatus = columnFilters.status === "all" ? true : (columnFilters.status === "active" ? product.active : !product.active);\n      return matchesSearch && matchesName && matchesCat && matchesPrice && matchesQuota && matchesStatus;'
if 'matchesStatus' not in content:
    content = content.replace(old_filter_logic, new_filter_logic)

# 3. Add Filter UI (Tabs) before the Search bar container
filter_tabs_jsx = """                    <div className="flex bg-[#FAFAFA] p-1.5 rounded-2xl border border-[#F0F0F0] shrink-0">
                      {[
                        { id: 'all', label: 'All', icon: Layers },
                        { id: 'active', label: 'Active', icon: ShieldCheck },
                        { id: 'inactive', label: 'Archived', icon: Trash2 }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setColumnFilters({...columnFilters, status: tab.id})}
                          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${columnFilters.status === tab.id ? 'bg-white text-[#2D5A27] shadow-sm' : 'text-[#A0A0A0] hover:text-[#1A1A1A]'}`}
                        >
                          <tab.icon size={12} />
                          {tab.label}
                        </button>
                      ))}
                    </div>
"""
if 'status: tab.id' not in content:
    target = '<div className="relative">'
    # We want the first one which is usually the search bar container
    content = content.replace(target, filter_tabs_jsx + '                    ' + target, 1)

with open(file_path, 'w') as f:
    f.write(content)
print("Successfully added Status Tabs for easy reactivation.")
