import sys
import re

file_path = '/Users/bintangsuharsono/Documents/BINTANG MADA LAPTOP M3/GITHUB SAYA/GARING-ALAMI/garingalami-fe/src/components/CommandCenter.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Add handleToggleStatus function
toggle_fn = """  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:8080/api/products/admin/${id}/toggle`, {}, {
        headers: { 'X-Admin-User': adminUser }
      });
      showToast('Product status updated');
      fetchProducts(currentPage);
      fetchStats();
    } catch (error) {
      console.error('Toggle status failed', error);
      showToast('Failed to update status', 'error');
    }
  };

"""
if 'const handleToggleStatus =' not in content:
    content = content.replace('const handleDelete = async (id) => {', toggle_fn + 'const handleDelete = async (id) => {')

# 2. Update Table Header
content = content.replace('Life Cycle</th>', 'Status & Cycle</th>')

# 3. Update Table Row (Status Badge)
# We find the Registered date block and insert status before it
old_cycle_block = '<div className="text-[7px] font-black text-[#D0D0D0] uppercase tracking-widest mb-1">Registered</div>'
new_cycle_block = """<div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter mb-2 ${product.active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                      <div className={`w-1 h-1 rounded-full ${product.active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                                      {product.active ? 'Active' : 'Inactive'}
                                    </div>
                                    """ + old_cycle_block
if 'product.active ? \'Active\' : \'Inactive\'' not in content:
    content = content.replace(old_cycle_block, new_cycle_block)

# 4. Replace Delete button with Toggle button
# We need to find the specific block. Let's find the Trash2 icon first.
old_delete_btn_pattern = r'<button\s+onClick=\{\(\)\s+=>\s+triggerConfirm\(\'Delete Archetype\',.*?\s+title="Delete product"\s+>.*?<Trash2 size=\{14\} />.*?</button>'

new_toggle_btn = """<button 
                                      onClick={() => handleToggleStatus(product.id)}
                                      className={`p-3 border transition-all shadow-sm rounded-xl ${product.active ? 'bg-white border-[#F0F0F0] text-[#A0A0A0] hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100' : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100'}`}
                                      title={product.active ? 'Deactivate Product' : 'Activate Product'}
                                    >
                                      {product.active ? <ShieldCheck size={14} /> : <CheckCircle2 size={14} />}
                                    </button>"""

# Using re.DOTALL to match across newlines
content = re.sub(old_delete_btn_pattern, new_toggle_btn, content, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(content)
print("Successfully updated UI to support Status Toggle.")
