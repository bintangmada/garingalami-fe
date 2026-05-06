import sys
import re

file_path = '/Users/bintangsuharsono/Documents/BINTANG MADA LAPTOP M3/GITHUB SAYA/GARING-ALAMI/garingalami-fe/src/components/CommandCenter.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# Define the handleToggleStatus function
handle_toggle_status_def = """  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:8080/api/products/admin/${id}/toggle`, {}, {
        headers: { 'X-Admin-User': adminUser }
      });
      showToast('Status updated successfully', 'success');
      
      // Instant synchronization
      await fetchProducts(currentPage);
      await fetchStats();
      if (onProductChange) onProductChange();
    } catch (error) {
      console.error('Toggle status failed', error);
      showToast('Failed to update status', 'error');
    }
  };
"""

# Insert it before handleDelete or handleSave
if 'const handleToggleStatus' not in content:
    content = content.replace('const handleDelete = async', handle_toggle_status_def + '\n\n      const handleDelete = async')

with open(file_path, 'w') as f:
    f.write(content)
print("Successfully defined handleToggleStatus for instant updates.")
