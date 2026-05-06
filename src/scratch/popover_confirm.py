import sys
import re

file_path = '/Users/bintangsuharsono/Documents/BINTANG MADA LAPTOP M3/GITHUB SAYA/GARING-ALAMI/garingalami-fe/src/components/CommandCenter.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Add state for Popover
if 'activePopover' not in content:
    content = content.replace('const [confirmConfig, setConfirmConfig] = useState(null);', 'const [confirmConfig, setConfirmConfig] = useState(null);\n  const [activePopover, setActivePopover] = useState(null);')

# 2. Define the Popover JSX
popover_jsx = """                                <div className="relative inline-block">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setActivePopover(p.id); }}
                                    title={p.active ? "Deactivate Product" : "Activate Product"}
                                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer hover:scale-105 active:scale-95 ${p.active ? "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white" : "bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-500 hover:text-white"}`}
                                  >
                                    {p.active ? "Active" : "Archived"}
                                  </button>

                                  <AnimatePresence>
                                    {activePopover === p.id && (
                                      <>
                                        <div className="fixed inset-0 z-[50]" onClick={(e) => { e.stopPropagation(); setActivePopover(null); }} />
                                        <motion.div 
                                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                          animate={{ opacity: 1, y: 0, scale: 1 }}
                                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-[200px] bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-[#F0F0F0] p-4 z-[60] text-center"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <p className="text-[9px] font-black uppercase tracking-wider text-[#1A1A1A] mb-3">{p.active ? 'Archive this?' : 'Activate this?'}</p>
                                          <div className="flex gap-2">
                                            <button 
                                              onClick={() => setActivePopover(null)}
                                              className="flex-1 py-2 rounded-lg bg-[#FAFAFA] text-[#A0A0A0] text-[8px] font-black uppercase tracking-widest hover:bg-[#F2F2F2]"
                                            >
                                              No
                                            </button>
                                            <button 
                                              onClick={() => {
                                                handleToggleStatus(p);
                                                setActivePopover(null);
                                              }}
                                              className={`flex-1 py-2 rounded-lg text-white text-[8px] font-black uppercase tracking-widest ${p.active ? 'bg-rose-500' : 'bg-[#2D5A27]'}`}
                                            >
                                              Yes
                                            </button>
                                          </div>
                                          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
                                        </motion.div>
                                      </>
                                    )}
                                  </AnimatePresence>
                                </div>"""

# 3. Target the previous interactive badge cell
# Note: we need to find the <td> and replace its content
# Looking for the button we added in interactive_badge.py but with stopPropagation from click_protection
pattern = r'<button\s+onClick=\{\(e\) => \{ e\.stopPropagation\(\); handleToggleStatus\(p\.id\); \}\}.*?<\/button>'
# Wait, I changed call to pass 'p' in toggle_confirmation.py
pattern = r'<button\s+onClick=\{\(e\) => \{ e\.stopPropagation\(\); handleToggleStatus\(p\); \}\}.*?<\/button>'

content = re.sub(pattern, popover_jsx, content, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(content)
print("Successfully implemented Local Popover Confirmation.")
