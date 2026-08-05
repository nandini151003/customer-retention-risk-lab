"""Fail when common sensitive patterns appear in public text files."""

from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
EXCLUDED = {"node_modules", "dist", ".git", ".rendered", ".venv"}
TEXT_EXTENSIONS = {".md", ".txt", ".csv", ".json", ".js", ".jsx", ".css", ".html", ".yml", ".yaml", ".py", ".example"}

PATTERNS = {
    "email address": re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.I),
    "phone number": re.compile(r"(?<!\d)(?:\+?\d[\s().-]*){10,}(?!\d)"),
    "secret assignment": re.compile(r"(?i)\b(api[_-]?key|secret|token|password)\s*[:=]\s*['\"][^'\"]+"),
    "private key": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "local user path": re.compile(r"(?i)(?:C:\\Users\\|/Users/|/home/)[^\s'\"]+"),
}

findings = []
for path in ROOT.rglob("*"):
    if not path.is_file() or any(part in EXCLUDED for part in path.parts):
        continue
    if path.resolve() == Path(__file__).resolve():
        continue
    if path.suffix.lower() not in TEXT_EXTENSIONS and path.name != ".env.example":
        continue
    text = path.read_text(encoding="utf-8", errors="ignore")
    for label, pattern in PATTERNS.items():
        for match in pattern.finditer(text):
            line = text.count("\n", 0, match.start()) + 1
            findings.append(f"{path.relative_to(ROOT)}:{line}: {label}")

if findings:
    print("Privacy check failed")
    print("\n".join(findings))
    sys.exit(1)

print("Privacy check passed: no common sensitive patterns found in public text files.")
