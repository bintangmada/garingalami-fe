import sys
import re

file_path = '/Users/bintangsuharsono/Documents/BINTANG MADA LAPTOP M3/GITHUB SAYA/GARING-ALAMI/garingalami-fe/src/components/CommandCenter.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Identify the duplicated block to remove
# Note: it has className={} which is what we want to find
block_pattern = r'<div className="flex bg-\[#FAFAFA\] p-1\.5 rounded-2xl border border-\[#F0F0F0\] shrink-0">.*?\[\s+.*?id: \'all\'.*?id: \'active\'.*?id: \'inactive\'.*?\].map\(tab => \(.*?<button.*?className=\{\}.*?>.*?<\/button>.*?\)\).*?<\/div>'

# Remove ONLY the first occurrence
content = re.sub(block_pattern, '', content, count=1, flags=re.DOTALL)

# 2. Fix the className={} in the remaining occurrence
correct_className = 'className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${columnFilters.status === tab.id ? "bg-white text-[#2D5A27] shadow-sm" : "text-[#A0A0A0] hover:text-[#1A1A1A]"}`}'

content = content.replace('className={}', correct_className)

with open(file_path, 'w') as f:
    f.write(content)
print("Successfully cleaned up duplication and fixed className.")
