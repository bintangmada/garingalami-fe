import sys
import re

file_path = '/Users/bintangsuharsono/Documents/BINTANG MADA LAPTOP M3/GITHUB SAYA/GARING-ALAMI/garingalami-fe/src/components/CommandCenter.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Update handleSave to include fetchStats
content = content.replace('await fetchProducts();\n      await fetchLogs();', 'await fetchProducts();\n      await fetchStats();\n      await fetchLogs();')

# 2. Update handleDelete (the one inside the drawer)
new_handle_delete_drawer = """  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.patch(`http://localhost:8080/api/products/admin/${id}/toggle`, {}, {
        headers: { 'X-Admin-User': adminUser }
      });
      showToast('Product archived successfully');
      
      if (onProductChange) onProductChange();
      await fetchProducts(currentPage);
      await fetchStats();
      
      setEditingProduct(null);
      setIsAddingNew(false);
      setIsConfirmingDelete(false);
    } catch (err) {
      console.error('Archive failed', err);
      showToast('Failed to archive product', 'error');
    }
  };
"""

# Find the function with (e, id)
content = re.sub(r'const handleDelete = async \(e, id\) => \{.*?  \};', new_handle_delete_drawer, content, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(content)
print("Successfully synchronized all actions with instant stats update.")
