#!/usr/bin/env python3
"""Copy the published notes from the Obsidian vault into content/ (the vault is never written to).

  python3 scripts/sync-vault.py

POSTS are the blog posts. For each one this also pulls in, recursively:
  - notes it embeds (![[Note]]), since Quartz can only transclude notes that exist in content/
  - image/media attachments embedded by any copied note
LINKED are extra notes published as pages of their own (wikilink targets worth keeping).
Wikilinks to anything else render as plain text (see quartz/plugins/transformers/joshuaSite.ts).
"""
import datetime, os, pathlib, re, shutil

VAULT = pathlib.Path.home() / "Documents/Obsidian Vault"
CONTENT = pathlib.Path(__file__).resolve().parent.parent / "content"

# note path in the vault -> (title, publish date, created date). `updated` comes from the file's mtime.
POSTS = {
    "Deep Learning/DDPM - Denoising Diffusion Probabilistic MOdels.md": ("DDPM - Denoising Diffusion Probabilistic Models", "2026-01-01", "2025-12-31"),
    "Deep Learning/VAE - Variational Auto Encoder.md": ("VAE - Variational Auto Encoder", "2025-12-30", "2025-10-17"),
    "Deep Learning/Policy Optimization Methods in Reinforcement Learning.md": ("Policy Optimization Methods in Reinforcement Learning", "2026-02-12", "2026-02-09"),
}
LINKED = [
    "Deep Learning/GAN - Generative Adversarial Networks.md",
    "Deep Learning/U-Net.md",
    "Math/Jensen's Inequality.md",
]
# pages that are not notes: the homepage and the post list (rendered by the joshua-blog frame)
PAGES = {"index.md": "Joshua Yang", "blog.md": "Blog"}

EMBED = re.compile(r"!\[\[([^\]|#]+)")
SKIP_DIRS = {".trash", ".obsidian"}

def find(name):
    """Resolve an Obsidian link target (file name, with or without folder) to a vault path."""
    direct = VAULT / name
    if direct.is_file():
        return direct
    base = pathlib.PurePath(name).name
    for p in VAULT.rglob(base):
        if p.is_file() and not SKIP_DIRS & set(p.parts):
            return p
    return None

copied, missing = set(), []

def copy_note(src, front=None):
    rel = src.relative_to(VAULT)
    if rel in copied:
        return
    copied.add(rel)
    text = src.read_text()
    if not text.startswith("---"):
        st = src.stat()
        updated = datetime.date.fromtimestamp(st.st_mtime).isoformat()
        if front:
            title, publish, created = front
            text = f'---\ntitle: "{title}"\npublish: "{publish}"\ncreated: "{created}"\nupdated: "{updated}"\n---\n' + text
        else:
            # supporting notes aren't posts (no publish date); their dates come from the vault file itself
            created = datetime.date.fromtimestamp(getattr(st, "st_birthtime", st.st_mtime)).isoformat()
            text = f'---\ntitle: "{src.stem}"\ncreated: "{created}"\nupdated: "{updated}"\n---\n' + text
    dst = CONTENT / rel
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(text)
    for target in {m.strip() for m in EMBED.findall(text)}:
        is_note = not os.path.splitext(target)[1]
        found = find(target + ".md" if is_note else target)
        if found is None:
            missing.append(f"{target!r} (embedded in {rel})")
        elif is_note:
            copy_note(found)                       # embedded note: recurse
        else:
            out = CONTENT / found.relative_to(VAULT)
            out.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(found, out)

if CONTENT.exists():
    shutil.rmtree(CONTENT)
CONTENT.mkdir(parents=True)
(CONTENT / ".gitkeep").touch()
for rel, front in POSTS.items():
    copy_note(VAULT / rel, front)
for rel in LINKED:
    copy_note(VAULT / rel)
for name, title in PAGES.items():
    (CONTENT / name).write_text(f'---\ntitle: "{title}"\n---\n')

notes = sorted(str(p.relative_to(CONTENT)) for p in CONTENT.rglob("*.md") if p.name not in PAGES)
media = [p for p in CONTENT.rglob("*") if p.is_file() and p.suffix.lower() not in (".md", "") ]
print(f"{len(notes)} notes, {len(media)} attachments")
for n in notes: print("  ", n)
for m in missing: print("  ! missing:", m)
