import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

rgba_patterns = {
    '245,236,215': 'var(--rgb-sand)',
    '196,120,58': 'var(--rgb-clay)',
    '212,82,42': 'var(--rgb-terracotta)',
    '45,80,22': 'var(--rgb-forest)',
    '122,158,95': 'var(--rgb-sage)',
    '15,26,10': 'var(--rgb-night)',
    '30,45,20': 'var(--rgb-dusk)',
    '250,247,242': 'var(--rgb-ivory)',
    '232,184,75': 'var(--rgb-gold)',
    '255,255,255': 'var(--rgb-white)'
}

for rgb, var_name in rgba_patterns.items():
    content = content.replace(f'rgba({rgb},', f'rgba({var_name},')

# Remove typos
content = content.replace(':wq', '')

# Update Root block
root_pattern = r':root\s*\{[^}]+\}'
new_root = '''
  :root {
    --sand: #1A365D;
    --clay: #2B6CB0;
    --terracotta: #3182CE;
    --forest: #E2E8F0;
    --sage: #4A5568;
    --night: #F7FAFC;
    --dusk: #EDF2F7;
    --ivory: #FFFFFF;
    --gold: #4299E1;
    --mist: rgba(var(--rgb-sand), 0.08);
    --glass: rgba(255, 255, 255, 0.7);
    --radius: 16px;
    --radius-sm: 8px;
    --shadow: 0 20px 60px rgba(0, 0, 0, 0.1);

    --rgb-sand: 26, 54, 93;
    --rgb-clay: 43, 108, 176;
    --rgb-terracotta: 49, 130, 206;
    --rgb-forest: 226, 232, 240;
    --rgb-sage: 74, 85, 104;
    --rgb-night: 247, 250, 252;
    --rgb-dusk: 237, 242, 247;
    --rgb-ivory: 255, 255, 255;
    --rgb-gold: 66, 153, 225;
    --rgb-white: 255, 255, 255;
  }

  [data-theme="dark"] {
    --sand: #F7FAFC;
    --clay: #63B3ED;
    --terracotta: #4299E1;
    --forest: #1A202C;
    --sage: #A0AEC0;
    --night: #0F172A;
    --dusk: #1E293B;
    --ivory: #0F172A;
    --gold: #90CDF4;
    --mist: rgba(var(--rgb-sand), 0.08);
    --glass: rgba(0, 0, 0, 0.6);
    --shadow: 0 20px 60px rgba(0, 0, 0, 0.6);

    --rgb-sand: 247, 250, 252;
    --rgb-clay: 99, 179, 237;
    --rgb-terracotta: 66, 153, 225;
    --rgb-forest: 26, 32, 44;
    --rgb-sage: 160, 174, 192;
    --rgb-night: 15, 23, 42;
    --rgb-dusk: 30, 41, 59;
    --rgb-ivory: 15, 23, 42;
    --rgb-gold: 144, 205, 244;
    --rgb-white: 0, 0, 0;
  }
'''
content = re.sub(root_pattern, new_root.strip(), content)

# Theme Toggle button
toggle_html = '''
<button id="themeToggle" style="
  position: fixed; top: 20px; right: 20px; z-index: 9999;
  background: var(--terracotta); color: var(--ivory);
  border: none; border-radius: 50%;
  width: 44px; height: 44px; font-size: 1.2rem; cursor: pointer;
  box-shadow: var(--shadow); transition: all 0.3s;
" onclick="toggleTheme()" title="Toggle Theme">🌓</button>
'''
if "id=\"themeToggle\"" not in content:
    content = content.replace('<body>', '<body>' + toggle_html)

js_toggle = '''
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
}
'''
if "function toggleTheme" not in content:
    content = content.replace('</script>', js_toggle + '\\n</script>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Theme updated successfully.")
