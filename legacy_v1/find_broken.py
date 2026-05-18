import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('index.html','r',encoding='utf-8') as f:
    lines = f.readlines()
target = '\u1ed1"'
for i, l in enumerate(lines):
    if target in l:
        print(f"Line {i+1}: {l.rstrip()}")
