from pathlib import Path
text = Path("src/app/admin/login/page.jsx").read_text()
print(list(text[:5]))
print(repr(text[:5]))
