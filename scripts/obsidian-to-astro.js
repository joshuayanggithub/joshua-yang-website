#!/usr/bin/env node
/*
Simple converter: Obsidian vault -> Astro blog posts
- Converts [[wikilinks]] -> Markdown links to /blog/slug
- Converts Obsidian embeds/images into centered <figure> blocks and copies attachments
- Adds frontmatter with layout/title/date if missing

Usage:
  node scripts/obsidian-to-astro.js /path/to/vault

By default outputs to: src/pages/blog and copies attachments to public/media/attachments

Selection (optional):
  --only=path/to/note.md,Another Note.md         Convert only these files (relative to vault or basenames)
  --only-file=/path/to/list.txt                 Newline-separated list of files (relative to vault or basenames)
  --include=notes/*.md,blog/*.md                Glob(s) of files to include (relative to vault)
  --exclude=private/**,drafts/**                Glob(s) of files to exclude (relative to vault)
  --dry-run                                     Print selected files and exit
*/

import fs from "node:fs";
import path from "node:path";

// Default input folder inside project where you can drop Obsidian-style files
const defaultInput = path.resolve(process.cwd(), "obsidian_import");

// Simple CLI parsing: accepts either a positional vault path or flags:
//   --vault=/path/to/vault
//   --convert=wikilinks,embeds,images,frontmatter   (comma-separated list)
//   --no-assets                                    (don't copy attachment files)
//   --only=... / --only-file=... / --include=... / --exclude=... / --dry-run
// Examples:
//   node scripts/obsidian-to-astro.js --vault=/path/to/vault --convert=wikilinks,images
//   node scripts/obsidian-to-astro.js /path/to/vault --no-assets

const rawArgs = process.argv.slice(2);
let vaultDir = null;
let convertList = null;
let copyAssets = true;
let onlyList = null;
let onlyFile = null;
let includeGlobs = null;
let excludeGlobs = null;
let dryRun = false;

for (const a of rawArgs) {
  if (a.startsWith("--vault=")) {
    vaultDir = a.split("=")[1];
  } else if (a.startsWith("--convert=")) {
    convertList = a
      .split("=")[1]
      .split(",")
      .map((s) => s.trim().toLowerCase());
  } else if (a === "--no-assets") {
    copyAssets = false;
  } else if (a.startsWith("--only=")) {
    onlyList = a
      .split("=")[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  } else if (a.startsWith("--only-file=")) {
    onlyFile = a.split("=")[1];
  } else if (a.startsWith("--include=")) {
    includeGlobs = a
      .split("=")[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  } else if (a.startsWith("--exclude=")) {
    excludeGlobs = a
      .split("=")[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  } else if (a === "--dry-run") {
    dryRun = true;
  } else if (!a.startsWith("-") && !vaultDir) {
    // positional path
    vaultDir = a;
  }
}

if (!vaultDir) {
  console.log(`No vault path provided — using local import folder: ${defaultInput}`);
  vaultDir = defaultInput;
}

if (!fs.existsSync(vaultDir)) {
  console.error("Input folder does not exist:", vaultDir);
  console.error("Create the folder and add your Obsidian markdown files, then run the script again.");
  process.exit(1);
}

// Which conversions to perform (default = all)
const doWikilinks = !convertList || convertList.includes("wikilinks");
const doEmbeds = !convertList || convertList.includes("embeds");
const doImages = !convertList || convertList.includes("images");
const doFrontmatter = !convertList || convertList.includes("frontmatter");

const outDir = path.resolve(process.cwd(), "src/pages/blog");
const assetsOut = path.resolve(process.cwd(), "public/media/attachments");

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(assetsOut)) fs.mkdirSync(assetsOut, { recursive: true });

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9 -]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function slugifyHeading(name) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/[`~!@#$%^&*()+={}\[\]|\\:;"'<>,.?/]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isImageFile(p) {
  const ext = path.extname(String(p || "")).toLowerCase();
  return [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif"].includes(ext);
}

/**
 * Resolve an Obsidian image reference:
 * - If it includes a path (e.g. assets/img.png), resolve relative to the note.
 * - Otherwise, try ./assets/<name> first, then ./<name>, then <vault>/<name>.
 */
function resolveAssetPath({ vaultDir, noteFile, targetPath }) {
  const noteDir = path.dirname(noteFile);
  const assetsDir = path.join(noteDir, "assets");
  const candidates = [];

  if (targetPath.includes("/") || targetPath.includes("\\")) {
    candidates.push(path.resolve(noteDir, targetPath));
  } else {
    candidates.push(path.join(assetsDir, targetPath));
    candidates.push(path.join(noteDir, targetPath));
  }
  candidates.push(path.resolve(vaultDir, targetPath));

  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function copyAsset({ from, noteSlug }) {
  const assetName = path.basename(from);
  const destDir = path.join(assetsOut, noteSlug);
  ensureDir(destDir);
  const dest = path.join(destDir, assetName);
  try {
    fs.copyFileSync(from, dest);
  } catch (e) {
    console.error("copy failed", from, e);
  }
  return `/media/attachments/${noteSlug}/${assetName}`;
}

function normalizeWidth(width) {
  const w = String(width || "").trim();
  if (!w) return "";
  if (/^\d+$/.test(w)) return `${w}px`;
  if (/^\d+px$/.test(w)) return w;
  if (/^\d+%$/.test(w)) return w;
  return w; // best-effort
}

function makeFigure({ src, alt, caption, width }) {
  const safeAlt = escapeHtml(alt || "");
  const safeCaption = escapeHtml(caption || "");
  const figcaption = caption ? `\n  <figcaption>${safeCaption}</figcaption>` : "";
  const w = normalizeWidth(width);
  const styleAttr = w ? ` style="max-width: ${escapeHtml(w)};"` : "";
  return `<figure class="obsidian-figure">\n  <img src="${src}" alt="${safeAlt}" loading="lazy"${styleAttr} />${figcaption}\n</figure>`;
}

function findLast(arr, predicate) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) return arr[i];
  }
  return undefined;
}

function normalizeRel(p) {
  return String(p || "")
    .split(path.sep)
    .join("/")
    .replace(/^\.\/+/, "");
}

function globToRegExp(glob) {
  // Minimal glob: **, *, ? with forward slashes.
  const g = normalizeRel(glob);
  let re = "^";
  for (let i = 0; i < g.length; i++) {
    const ch = g[i];
    const next = g[i + 1];
    if (ch === "*" && next === "*") {
      // ** => match any path segment(s)
      re += ".*";
      i++;
      continue;
    }
    if (ch === "*") {
      // * => match within a segment
      re += "[^/]*";
      continue;
    }
    if (ch === "?") {
      re += "[^/]";
      continue;
    }
    // escape regex special chars
    if (/[$()*+.?[\\\]^{|}]/.test(ch)) re += "\\" + ch;
    else re += ch;
  }
  re += "$";
  return new RegExp(re);
}

function matchesAnyGlob(relPath, globs) {
  if (!globs || globs.length === 0) return false;
  const p = normalizeRel(relPath);
  return globs.some((g) => globToRegExp(g).test(p));
}

function readFilesRecursive(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files = files.concat(readFilesRecursive(full));
    else if (/\.mdx?$/.test(e.name)) files.push(full);
  }
  return files;
}

function formatDate(d) {
  try {
    return new Date(d).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

function upsertFrontmatter(src, fields) {
  const fmRe = /^---\n([\s\S]*?)\n---\n?/;
  const m = src.match(fmRe);
  let body = "";
  let rest = src;

  if (m) {
    body = m[1];
    rest = src.slice(m[0].length);
  }

  const lines = body ? body.split("\n") : [];
  const map = new Map();
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) map.set(key, value);
  }

  for (const [k, v] of Object.entries(fields)) {
    map.set(k, v);
  }

  const orderedKeys = [
    "layout",
    "title",
    "date", // creation date for sorting
    "created",
    "updated",
    "description",
  ];

  const out = [];
  for (const k of orderedKeys) {
    if (map.has(k)) out.push(`${k}: ${map.get(k)}`);
    map.delete(k);
  }
  for (const [k, v] of map.entries()) out.push(`${k}: ${v}`);

  return `---\n${out.join("\n")}\n---\n\n${rest.replace(/^\n+/, "")}`;
}

function normalizeMarkdownForAstro(src) {
  const lines = src.split(/\r?\n/);
  let inFence = false;
  let fence = "";

  // Pass 1: normalize indentation (tabs) outside code fences
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fenceMatch = line.match(/^(\s*)(```+|~~~+)/);
    if (fenceMatch) {
      const token = fenceMatch[2];
      if (!inFence) {
        inFence = true;
        fence = token;
      } else if (token.startsWith(fence)) {
        inFence = false;
        fence = "";
      }
      continue;
    }
    if (inFence) continue;
    // replace leading tabs with spaces (3 spaces per tab for list compatibility)
    lines[i] = line.replace(/^\t+/g, (m) => "   ".repeat(m.length));
  }

  // Pass 2: fix numbered list continuations
  // Obsidian allows continuation lines with minimal indent; remark needs 3+ spaces
  inFence = false;
  fence = "";
  let inNumberedList = false;
  let listIndent = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fenceMatch = line.match(/^(\s*)(```+|~~~+)/);
    if (fenceMatch) {
      const token = fenceMatch[2];
      if (!inFence) {
        inFence = true;
        fence = token;
      } else if (token.startsWith(fence)) {
        inFence = false;
        fence = "";
      }
      inNumberedList = false;
      continue;
    }
    if (inFence) continue;

    // Detect numbered list item: "1. text" or "  1. text"
    const numMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
    if (numMatch) {
      inNumberedList = true;
      listIndent = numMatch[1].length;
      continue;
    }

    // Detect blank line or heading => end list
    if (line.trim() === "" || /^#{1,6}\s/.test(line.trim())) {
      inNumberedList = false;
      continue;
    }

    // If in numbered list, check if this is a continuation line (non-empty, starts with 1-2 spaces)
    if (inNumberedList) {
      const leadingSpaces = line.match(/^(\s*)/)[1].length;
      const trimmed = line.trim();
      // If line has some indent but not enough for proper list continuation (need 3+)
      if (leadingSpaces > 0 && leadingSpaces < 3 && trimmed) {
        // Re-indent to 3 spaces so remark treats it as list continuation
        lines[i] = "   " + trimmed;
      }
    }
  }

  // Pass 3: ensure display math blocks written as $$...$$ single-line become proper blocks
  inFence = false;
  fence = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fenceMatch = line.match(/^(\s*)(```+|~~~+)/);
    if (fenceMatch) {
      const token = fenceMatch[2];
      if (!inFence) {
        inFence = true;
        fence = token;
      } else if (token.startsWith(fence)) {
        inFence = false;
        fence = "";
      }
      continue;
    }
    if (inFence) continue;

    // Case 1: Line is purely $$...$$ (no text before/after)
    const pureMatch = line.match(/^\s*\$\$(.+)\$\$\s*$/);
    if (pureMatch && pureMatch[1].trim()) {
      const expr = pureMatch[1].trim();
      lines.splice(i, 1, "", "$$", expr, "$$", "");
      i += 4;
      continue;
    }

    // Case 2: $$...$$ embedded in text (text before and/or after)
    // Match: "text $$math$$ more" but NOT already-processed lines
    if (line.includes("$$") && !line.match(/^\s*\$\$/)) {
      const embeddedMatch = line.match(/^(.+?)\$\$(.+?)\$\$(.*)$/);
      if (embeddedMatch) {
        const before = embeddedMatch[1].trimEnd();
        const expr = embeddedMatch[2].trim();
        const after = embeddedMatch[3].trimStart();
        const newLines = [];
        if (before) newLines.push(before);
        newLines.push("", "$$", expr, "$$", "");
        if (after) newLines.push(after);
        lines.splice(i, 1, ...newLines);
        i += newLines.length - 1;
      }
    }
  }

  // Pass 4: fix bold/italics edge cases like ***word* more** → **_word_ more**
  // Also normalize ***word*** to proper bold+italic
  inFence = false;
  fence = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fenceMatch = line.match(/^(\s*)(```+|~~~+)/);
    if (fenceMatch) {
      const token = fenceMatch[2];
      if (!inFence) {
        inFence = true;
        fence = token;
      } else if (token.startsWith(fence)) {
        inFence = false;
        fence = "";
      }
      continue;
    }
    if (inFence) continue;

    // Skip lines that are purely math (don't mess with LaTeX)
    if (/^\s*\$\$/.test(line) || /\$\$\s*$/.test(line)) continue;

    // Fix ***word*** patterns (bold+italic) - these are actually fine in standard MD
    // But fix malformed patterns like ***word* rest** → **_word_ rest**
    // Pattern: ***X* Y** where X doesn't contain * and Y doesn't contain *
    let fixed = line.replace(/\*\*\*([^*]+)\*([^*]+)\*\*/g, "**_$1_$2**");
    // Also handle ***X*** (proper bold+italic, no change needed, but normalize for safety)
    lines[i] = fixed;
  }

  // Pass 5: make "Sources" URLs one-per-line list items
  let inSources = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^#{1,6}\s+Sources\b/.test(line.trim())) {
      inSources = true;
      continue;
    }
    if (inSources && /^#{1,6}\s+/.test(line.trim())) {
      inSources = false;
    }
    if (!inSources) continue;
    const t = line.trim();
    if (/^https?:\/\//.test(t)) lines[i] = `- ${t}`;
  }

  // Pass 6: ensure blank line before markdown headers (after HTML like </figure>)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const prevLine = lines[i - 1];
    // If current line is a markdown header and prev line is not blank
    if (/^#{1,6}\s+/.test(line) && prevLine.trim() !== "") {
      lines.splice(i, 0, "");
      i++;
    }
  }

  return lines.join("\n");
}

let mdFiles = readFilesRecursive(vaultDir);

// Apply selection filters (optional)
if (onlyFile) {
  if (!fs.existsSync(onlyFile)) {
    console.error("only-file does not exist:", onlyFile);
    process.exit(1);
  }
  const lines = fs
    .readFileSync(onlyFile, "utf8")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => !s.startsWith("#"));
  onlyList = (onlyList || []).concat(lines);
}

if (onlyList && onlyList.length > 0) {
  const wanted = onlyList.map((s) => normalizeRel(s));
  mdFiles = mdFiles.filter((f) => {
    const rel = normalizeRel(path.relative(vaultDir, f));
    const base = path.basename(f);
    return wanted.includes(rel) || wanted.includes(base) || wanted.some((w) => w.endsWith("/" + base));
  });
} else {
  if (includeGlobs && includeGlobs.length > 0) {
    mdFiles = mdFiles.filter((f) => matchesAnyGlob(path.relative(vaultDir, f), includeGlobs));
  }
  if (excludeGlobs && excludeGlobs.length > 0) {
    mdFiles = mdFiles.filter((f) => !matchesAnyGlob(path.relative(vaultDir, f), excludeGlobs));
  }
}

console.log(`Found ${mdFiles.length} markdown files in vault.`);
if (dryRun) {
  for (const f of mdFiles) console.log("-", path.relative(vaultDir, f));
  console.log("Dry run complete (no files written).");
  process.exit(0);
}

for (const file of mdFiles) {
  let src = fs.readFileSync(file, "utf8");
  const noteSlug = slugify(path.basename(file));

  // Note title should match the Obsidian note title (filename) exactly
  const title = path.basename(file).replace(/\.mdx?$/, "");

  // ensure frontmatter (optional)
  if (doFrontmatter) {
    const st = fs.statSync(file);
    const created = formatDate(st.birthtime || st.ctime);
    const updated = formatDate(st.mtime);
    src = upsertFrontmatter(src, {
      layout: "../../layouts/BlogPost.astro",
      title: `"${title.replace(/\"/g, '\\"')}"`,
      date: `"${created || updated}"`,
      created: `"${created || updated}"`,
      updated: `"${updated}"`,
    });
  }

  // Convert Obsidian embeds for images (optional)
  // Format: ![[filepath | caption | image width]]
  if (doEmbeds) {
    src = src.replace(/!\[\[([^\]]+)\]\]/g, (m, inner) => {
      const parts = String(inner).split("|");
      const targetPath = (parts[0] || "").trim();
      const raw1 = (parts[1] || "").trim();
      const raw2 = (parts[2] || "").trim();

      // Support common variants:
      // - filepath | caption | width   (your preferred format)
      // - filepath | width             (common Obsidian practice)
      // - filepath                     (no caption/width)
      const raw1LooksLikeWidth = /^\d+(\s*px)?$/.test(raw1) || /^\d+%$/.test(raw1);
      const caption = raw2 ? raw1 : raw1LooksLikeWidth ? "" : raw1;
      const width = raw2 ? raw2 : raw1LooksLikeWidth ? raw1 : "";

      if (!isImageFile(targetPath)) return m; // leave non-images alone

      const found = resolveAssetPath({ vaultDir, noteFile: file, targetPath });
      const outSrc = found && copyAssets ? copyAsset({ from: found, noteSlug }) : targetPath;

      const hasCaption = Boolean(caption);

      return makeFigure({
        src: outSrc,
        alt: hasCaption ? caption : path.basename(targetPath),
        caption: hasCaption ? caption : "",
        width: width || "",
      });
    });
  }

  // Convert markdown images: ![alt](assets/img.png "caption") -> <figure>... (optional)
  if (doImages) {
    src = src.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g, (m, alt, href, title) => {
      const caption = title || alt || "";
      if (/^https?:\/\//.test(href)) {
        return makeFigure({ src: href, alt: alt || caption, caption, width: "" });
      }

      const found = resolveAssetPath({ vaultDir, noteFile: file, targetPath: href });
      if (!found || !isImageFile(found)) return m;

      const outSrc = copyAssets ? copyAsset({ from: found, noteSlug }) : href;
      return makeFigure({ src: outSrc, alt: alt || caption || path.basename(href), caption, width: "" });
    });
  }

  // Convert wikilinks [[Note]] or [[path/to/Note|alias]] (optional)
  // Important: ignore Obsidian embeds ![[...]] so embeds don't get converted into blog links.
  if (doWikilinks) {
    src = src.replace(/(?<!!)\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (m, targetRaw, alias) => {
      // support heading refs: [[Note#Some Heading|Alias]]
      const [target, heading] = String(targetRaw).split("#");
      const targetBasename = path.basename(target);
      const text = alias || targetBasename;
      // We don't use Obsidian wikilinks in Astro output; keep as plain text.
      // If the link included a heading, include it as human-readable suffix.
      return heading ? `${text} (${heading})` : text;
    });
  }

  // Normalize formatting for Astro markdown rendering (tabs, display math, sources URLs)
  src = normalizeMarkdownForAstro(src);

  // write output
  const outName = noteSlug;
  const outPath = path.join(outDir, outName + ".md");
  fs.writeFileSync(outPath, src, "utf8");
  console.log("Wrote", outPath);
}

console.log("Done. Review files in src/pages/blog and assets in public/media/attachments");
