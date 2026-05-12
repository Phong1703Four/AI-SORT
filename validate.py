import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

print(f"DIV opens: {c.count('<div')}, closes: {c.count('</div>')}")
print(f"HEADER opens: {c.count('<header')}, closes: {c.count('</header')}")
print(f"MAIN opens: {c.count('<main')}, closes: {c.count('</main')}")
print(f"adventureContainer present: {'adventureContainer' in c}")
print(f"gameCanvas present: {'gameCanvas' in c}")
print(f"xpBar present: {'xpBar' in c}")
print(f"top-dashboard present: {'top-dashboard' in c}")
print(f"mobile-controls present: {'mobile-controls' in c}")
print(f"joystickZone present: {'joystickZone' in c}")

# Check for remaining broken chars
bad_patterns = ['TH"NG', 'v:i', 'ốè', 'ố"', 'h!', 'ốịnh', 'ốỏ', 'Mi l', 'Lng', 'Cu"n', 'SI`U', 'T`N', 'HìNG', 'LI U']
print("\nRemaining broken chars:")
for bad in bad_patterns:
    count = c.count(bad)
    if count > 0:
        print(f"  FOUND {count}x: {bad}")
