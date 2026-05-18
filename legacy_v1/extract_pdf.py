import sys
sys.stdout.reconfigure(encoding='utf-8')
from pdfminer.high_level import extract_text
text = extract_text(r"C:\Users\Admin\Downloads\CIRCL_ BUSINESS PROPOSAL.pdf")
print(text)
