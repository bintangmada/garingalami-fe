import re
import os

file_path = '/Users/bintangsuharsono/Documents/BINTANG MADA LAPTOP M3/GITHUB SAYA/GARING-ALAMI/garingalami-fe/src/components/CommandCenter.jsx'
with open(file_path, 'r') as f:
    content = f.read()

new_footer = """                          <div className="p-12 border-t border-[#F8F8F8] bg-[#FAFAFA]/50 space-y-4 shrink-0">
                             {/* SAVE SECTION */}
                             {!isConfirmingSave ? (
                                <button 
                                   form="inspector-form"
                                   disabled={isSaving || isConfirmingDelete}
                                   type="button"
                                   onClick={() => { setIsConfirmingSave(true); setIsConfirmingDelete(false); }}
                                   className={`w-full py-6 rounded-[2rem] text-white text-[11px] font-black uppercase tracking-[0.5em] transition-all duration-300 flex items-center justify-center gap-4 ${isConfirmingDelete ? 'bg-gray-100 text-gray-300 shadow-none pointer-events-none' : 'bg-[#1A1A1A] hover:bg-[#2D5A27] shadow-black/10'}`}
                                >
                                   {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                   {isSaving ? "Synchronizing..." : "Commit To Registry"}
                                </button>
                             ) : (
                                <div className="flex gap-2 animate-in fade-in zoom-in duration-200">
                                   <button 
                                      type="button"
                                      onClick={() => setIsConfirmingSave(false)}
                                      className="flex-1 py-6 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-[2rem] hover:bg-gray-200 transition-all"
                                   >
                                      Batal
                                   </button>
                                   <button 
                                      form="inspector-form"
                                      type="submit"
                                      className="flex-[2.5] py-6 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-[2rem] hover:bg-amber-600 shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 animate-pulse"
                                   >
                                      <CheckCircle2 size={18} />
                                      Ya, Simpan Perubahan
                                   </button>
                                </div>
                             )}

                             {/* DELETE SECTION */}
                             {editingProduct && (
                                !isConfirmingDelete ? (
                                   <button 
                                      type="button"
                                      disabled={isSaving || isConfirmingSave}
                                      onClick={() => { setIsConfirmingDelete(true); setIsConfirmingSave(false); }}
                                      className={`w-full py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 border ${isConfirmingSave ? 'bg-gray-50 text-gray-200 border-gray-100 shadow-none pointer-events-none' : 'bg-red-50 text-red-500 border-red-100 hover:bg-red-500 hover:text-white'}`}
                                   >
                                      <Trash2 size={18} />
                                      Purge Permanent Record
                                   </button>
                                ) : (
                                   <div className="flex gap-2 animate-in fade-in zoom-in duration-200">
                                      <button 
                                         type="button"
                                         onClick={() => setIsConfirmingDelete(false)}
                                         className="flex-1 py-5 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-[2rem] hover:bg-gray-200 transition-all"
                                      >
                                         Batal
                                      </button>
                                      <button 
                                         type="button"
                                         onClick={(e) => handleDelete(e, editingProduct.id)}
                                         className="flex-[2.5] py-5 bg-red-700 text-white text-[10px] font-black uppercase tracking-widest rounded-[2rem] hover:bg-red-800 shadow-xl shadow-red-700/40 flex items-center justify-center gap-2 animate-pulse"
                                      >
                                         <AlertTriangle size={18} />
                                         Ya, Hapus Permanen
                                      </button>
                                   </div>
                                )
                             )}
                          </div>"""

# Robust replacement logic
# We target the start of the footer div and everything until its closing </div>
start_tag = '<div className="p-12 border-t border-[#F8F8F8] bg-[#FAFAFA]/50 space-y-4 shrink-0">'
end_tag = '</div>' # The last </div> before closing </motion.div>

# Let's find the specific block
# It's better to find it by lines if possible
lines = content.split('\n')
start_line = -1
for i, line in enumerate(lines):
    if start_tag in line:
        start_line = i
        break

if start_line != -1:
    # Find the closing div of this block (line 859 in previous view)
    end_line = -1
    for i in range(start_line + 1, len(lines)):
        if '</div>' in lines[i] and 'motion.div' not in lines[i+1 if i+1 < len(lines) else i]:
            # This is a bit heuristic, let's just find where it ends
            # We know it was around 859 and started at 825
            if i - start_line > 10 and i - start_line < 40:
                end_line = i
                break
    
    if end_line != -1:
        lines[start_line:end_line+1] = [new_footer]
        new_content = '\n'.join(lines)
        with open(file_path, 'w') as f:
            f.write(new_content)
        print("Successfully updated footer.")
    else:
        print("Could not find end line.")
else:
    print("Could not find start tag.")
