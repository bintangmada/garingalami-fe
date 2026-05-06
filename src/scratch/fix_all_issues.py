import sys
import re

file_path = '/Users/bintangsuharsono/Documents/BINTANG MADA LAPTOP M3/GITHUB SAYA/GARING-ALAMI/garingalami-fe/src/components/CommandCenter.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Fix the syntax error (remove hash comments)
content = content.replace('# We need to call the actual toggle logic without confirmation now', '')
content = content.replace('# Or update handleToggleStatus to have a no-confirm mode', '')

# 2. Fix the popover clipping for the action button (right side)
# We shift the popover to the left for the right-side button
old_action_popover = 'className="absolute right-0 bottom-full mb-3 w-[200px] bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-[#F0F0F0] p-4 z-[60] text-center"'
new_action_popover = 'className="absolute right-0 bottom-full mb-3 w-[220px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-[#F0F0F0] p-5 z-[100] text-center"'

content = content.replace(old_action_popover, new_action_popover)

# 3. Ensure the arrow for the right popover is also aligned correctly
old_arrow = '<div className="absolute right-4 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />'
new_arrow = '<div className="absolute right-3 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />'
content = content.replace(old_arrow, new_arrow)

with open(file_path, 'w') as f:
    f.write(content)
print("Fixed syntax error and popover clipping.")
