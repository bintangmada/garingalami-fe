import sys
import re

file_path = '/Users/bintangsuharsono/Documents/BINTANG MADA LAPTOP M3/GITHUB SAYA/GARING-ALAMI/garingalami-fe/src/components/CommandCenter.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Update handleToggleStatus definition
old_def = """  const handleToggleStatus = async (id) => {
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
  };"""

new_def = """  const handleToggleStatus = async (product) => {
    setConfirmConfig({
      title: product.active ? 'Archive Archetype?' : 'Activate Archetype?',
      message: product.active 
        ? `Are you sure you want to move "${product.name}" to the archive? It will be hidden from the public catalog.` 
        : `Are you sure you want to reactivate "${product.name}"? It will be visible to all customers again.`,
      confirmLabel: product.active ? 'Yes, Archive' : 'Yes, Activate',
      confirmColor: product.active ? 'bg-rose-500' : 'bg-[#2D5A27]',
      onConfirm: async () => {
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
        setConfirmConfig(null);
      }
    });
  };"""

if 'async (product)' not in content:
    content = content.replace(old_def, new_def)

# 2. Update all calls to pass 'p' instead of 'p.id'
content = content.replace('handleToggleStatus(p.id)', 'handleToggleStatus(p)')

with open(file_path, 'w') as f:
    f.write(content)
print("Successfully added Toggle Confirmation Dialog.")
