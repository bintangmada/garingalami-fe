import sys
import re

file_path = '/Users/bintangsuharsono/Documents/BINTANG MADA LAPTOP M3/GITHUB SAYA/GARING-ALAMI/garingalami-fe/src/components/CommandCenter.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Define the actual API execution function (executeToggleStatus)
# And make handleToggleStatus use it (this is for the modal if we still want it, 
# but we'll move towards popovers)
api_toggle_func = """  const executeToggleStatus = async (product) => {
    try {
      await axios.patch(`http://localhost:8080/api/products/admin/${product.id}/toggle`, {}, {
        headers: { 'X-Admin-User': adminUser }
      });
      showToast('Registry status updated', 'success');
      await fetchProducts(currentPage);
      await fetchStats();
      if (onProductChange) onProductChange();
    } catch (err) {
      showToast('Synchronization failed', 'error');
    }
  };"""

if 'executeToggleStatus' not in content:
    content = content.replace('const handleToggleStatus = async (product) => {', api_toggle_func + '\n\n  const handleToggleStatus = async (product) => {')

# 2. Update the first popover (Badge Status) to use executeToggleStatus
content = content.replace('handleToggleStatus(p);', 'executeToggleStatus(p);')

# 3. Implement the popover for the action button at the end of the row
popover_action_jsx = """                                <div className="relative inline-block">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setActivePopover(`action-${p.id}`); }}
                                    className={`p-3 border transition-all shadow-sm rounded-xl ${p.active ? 'bg-white border-[#F0F0F0] text-[#A0A0A0] hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100' : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100 hover:shadow-lg'}`}
                                    title={p.active ? 'Deactivate Product' : 'Activate Product'}
                                  >
                                    {p.active ? <ShieldCheck size={14} /> : <CheckCircle2 size={14} />}
                                  </button>

                                  <AnimatePresence>
                                    {activePopover === `action-${p.id}` && (
                                      <>
                                        <div className="fixed inset-0 z-[50]" onClick={(e) => { e.stopPropagation(); setActivePopover(null); }} />
                                        <motion.div 
                                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                          animate={{ opacity: 1, y: 0, scale: 1 }}
                                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                          className="absolute right-0 bottom-full mb-3 w-[200px] bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-[#F0F0F0] p-4 z-[60] text-center"
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
                                                executeToggleStatus(p);
                                                setActivePopover(null);
                                              }}
                                              className={`flex-1 py-2 rounded-lg text-white text-[8px] font-black uppercase tracking-widest ${p.active ? 'bg-rose-500' : 'bg-[#2D5A27]'}`}
                                            >
                                              Yes
                                            </button>
                                          </div>
                                          <div className="absolute right-4 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
                                        </motion.div>
                                      </>
                                    )}
                                  </AnimatePresence>
                                </div>"""

# Replace the action button in the Operations column
action_btn_pattern = r'<button\s+onClick=\{\(\) => handleToggleStatus\(p\)\}.*?<ShieldCheck size=\{14\} \/> : <CheckCircle2 size=\{14\} \/>\}.*?<\/button>'
content = re.sub(action_btn_pattern, popover_action_jsx, content, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(content)
print("Successfully replaced all modals with local popovers.")
