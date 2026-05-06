import sys
import re

file_path = '/Users/bintangsuharsono/Documents/BINTANG MADA LAPTOP M3/GITHUB SAYA/GARING-ALAMI/garingalami-fe/src/components/CommandCenter.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Update handleDelete to be an archive function
new_handle_delete = """  const handleDelete = async (id) => {
    try {
      // In the new logic, delete means deactivate
      await axios.patch(`http://localhost:8080/api/products/admin/${id}/toggle`, {}, {
        headers: { 'X-Admin-User': adminUser }
      });
      showToast('Product archived successfully');
      setConfirmConfig(null);
      fetchProducts(currentPage);
      fetchStats();
    } catch (error) {
      console.error('Archive failed', error);
      showToast('Failed to archive product', 'error');
    }
  };
"""

# Regex to find the handleDelete function block
content = re.sub(r'const handleDelete = async \(id\) => \{.*?  \};', new_handle_delete, content, flags=re.DOTALL)

# 2. Update any "Delete Archetype" text to "Archive Archetype"
content = content.replace("'Delete Archetype'", "'Archive Archetype'")
content = content.replace('"Delete Archetype"', '"Archive Archetype"')
content = content.replace("permanently remove", "archive")

with open(file_path, 'w') as f:
    f.write(content)
print("Successfully converted all Delete actions to Archive actions.")
