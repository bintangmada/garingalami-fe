import sys
import re

file_path = '/Users/bintangsuharsono/Documents/BINTANG MADA LAPTOP M3/GITHUB SAYA/GARING-ALAMI/garingalami-fe/src/components/CommandCenter.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Update the filter row to have the status dropdown first
status_dropdown_filter = """                            <td className="px-6 py-2 border-b border-[#F8F8F8]">
                              <select 
                                value={columnFilters.status}
                                onChange={(e) => setColumnFilters({...columnFilters, status: e.target.value})}
                                className="w-full bg-white border border-[#F0F0F0] rounded-xl px-4 py-2.5 text-[10px] font-bold focus:outline-none focus:border-[#2D5A27]/30"
                              >
                                <option value="all">All Status</option>
                                <option value="active">Active Only</option>
                                <option value="inactive">Archived Only</option>
                              </select>
                            </td>
"""

# We search for the start of the filter <tr> and replace the first <td> (which was accidentally used for name filter)
content = content.replace('<tr className="bg-[#FAFAFA]/50">\n                            <td className="px-6 py-2 border-b border-[#F8F8F8]">', 
                          '<tr className="bg-[#FAFAFA]/50">\n' + status_dropdown_filter + '                            <td className="px-6 py-2 border-b border-[#F8F8F8]">')

# 2. Since we added a new <td>, we need to make sure the existing ones are correctly aligned.
# Before: Status Header (1), Name Header (2)...
# Filter row should have Status Filter (1), Name Filter (2)...
# My previous replace added the status_dropdown_filter BEFORE the first <td>. 
# This is correct.

# 3. Cleanup: Remove the "Tabs" filter since we now use the dropdown in the table for better UX
# Find the tabs block and remove it
tabs_block_pattern = r'<div className="flex bg-\[#F8F9FA\] p-1 rounded-2xl border border-\[#F0F0F0\] shrink-0">.*?<\/div>'
content = re.sub(tabs_block_pattern, '', content, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(content)
print("Successfully converted Status Filter to Dropdown and cleaned up UI.")
