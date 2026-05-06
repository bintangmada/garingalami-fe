import sys
import re

file_path = '/Users/bintangsuharsono/Documents/BINTANG MADA LAPTOP M3/GITHUB SAYA/GARING-ALAMI/garingalami-fe/src/components/CommandCenter.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Add Actions Header at the end of the thead row
actions_header = """                            <th className="px-6 py-4 border-b border-[#F8F8F8] text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FAFAFA]/20 text-right">Operations</th>
"""
# Find the end of the header row (last </th> before </tr>)
content = content.replace('CYCLE TIMELINE</th>', 'CYCLE TIMELINE</th>\n' + actions_header)

# 2. Add Actions Cell at the end of the tbody row
actions_cell = """                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-3">
                                  <button 
                                    onClick={() => handleToggleStatus(p.id)}
                                    className={`p-3 border transition-all shadow-sm rounded-xl ${p.active ? 'bg-white border-[#F0F0F0] text-[#A0A0A0] hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100' : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100 hover:shadow-lg'}`}
                                    title={p.active ? 'Deactivate Product' : 'Activate Product'}
                                  >
                                    {p.active ? <ShieldCheck size={14} /> : <CheckCircle2 size={14} />}
                                  </button>
                                  <button 
                                    onClick={() => setEditingProduct(p)}
                                    className="p-3 bg-white border border-[#F0F0F0] text-[#A0A0A0] rounded-xl hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-all shadow-sm"
                                    title="Modify Archetype"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                </div>
                              </td>
"""
# This is the tricky part, we need to insert it BEFORE each </tr> in the mapping
# Using regex to find the end of the <td> block for the timeline and inserting our actions cell
content = re.sub(r'(<p className="text-\[10px\] font-bold text-\[#1A1A1A\] tabular-nums">\{new Date\(p\.expiryDate\)\.toLocaleDateString\(\)\}<\/p>\s+<\/div>\s+)?(\s+)?\)\}\s+<\/div>\s+<\/td>', 
                 r'\g<0>\n' + actions_cell, 
                 content)

with open(file_path, 'w') as f:
    f.write(content)
print("Successfully restored the Operations column.")
