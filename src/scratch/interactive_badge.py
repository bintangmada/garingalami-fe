import sys
import re

file_path = '/Users/bintangsuharsono/Documents/BINTANG MADA LAPTOP M3/GITHUB SAYA/GARING-ALAMI/garingalami-fe/src/components/CommandCenter.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Identify the static badge pattern
# Note: we need to match the exact string from the previous script
old_badge_pattern = r'<span className={`px-4 py-1\.5 rounded-full text-\[9px\] font-black uppercase tracking-widest \$\{p\.active \? \'bg-emerald-50 text-emerald-600 border border-emerald-100\' : \'bg-rose-50 text-rose-500 border border-rose-100\'\}`}>.*?\{p\.active \? \'Active\' : \'Archived\'\}.*?<\/span>'

# 2. Define the new interactive badge
new_badge = """<button 
                                  onClick={() => handleToggleStatus(p.id)}
                                  title={p.active ? "Deactivate Product" : "Activate Product"}
                                  className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer hover:scale-105 active:scale-95 ${p.active ? "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white" : "bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-500 hover:text-white"}`}
                                >
                                  {p.active ? "Active" : "Archived"}
                                </button>"""

# Replace
content = re.sub(old_badge_pattern, new_badge, content, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(content)
print("Successfully made the Status Badge interactive.")
