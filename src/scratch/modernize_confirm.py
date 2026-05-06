import sys
import re

file_path = '/Users/bintangsuharsono/Documents/BINTANG MADA LAPTOP M3/GITHUB SAYA/GARING-ALAMI/garingalami-fe/src/components/CommandCenter.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# Replace the confirm button block
# We need to be careful with the exact whitespace and structure
pattern = r'<button\s+onClick=\{\(\) => \{\s+confirmConfig\.onConfirm\(\);\s+setConfirmConfig\(null\);\s+\}\}\s+className=\{`flex-1 py-4 rounded-xl text-white text-\[10px\] font-black uppercase tracking-widest transition-all shadow-lg\s+\$\{confirmConfig\.type === \'danger\' \? \'bg-red-500 hover:bg-red-600 shadow-red-500\/20\' : \'bg-\[#2D5A27\] hover:bg-\[#1A5A27\] shadow-\[#2D5A27\]\/20\'\}`\}\s+>\s+Confirm\s+<\/button>'

replacement = """<button 
                  onClick={() => {
                    confirmConfig.onConfirm();
                    setConfirmConfig(null);
                  }}
                  className={`flex-1 py-4 rounded-xl text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg
                    ${confirmConfig.confirmColor || (confirmConfig.type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-[#2D5A27] hover:bg-[#1A5A27] shadow-[#2D5A27]/20')}`}
                >
                  {confirmConfig.confirmLabel || 'Confirm'}
                </button>"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(content)
print("Successfully modernized the Confirm Dialog UI.")
