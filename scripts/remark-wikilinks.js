/**
 * Remark plugin: resolve Obsidian-style [[wikilinks]] into real Astro links.
 *
 * Supports:
 *   [[Note Title]]                -> link to the post, text = post title
 *   [[Note Title|Alias]]          -> link to the post, text = "Alias"
 *   [[Note Title#Heading]]        -> link to the post + heading anchor
 *   [[Note Title#Heading|Alias]]  -> link to the post + heading anchor, text = "Alias"
 *
 * Resolution is by post title (case-insensitive, matching the frontmatter
 * `title` field) since that's what Obsidian wikilinks reference by default
 * (the note's filename === its title in this vault). Unresolvable links are
 * left as plain text (bracket-stripped) with a build-time warning, so a typo
 * never breaks the build or silently 404s.
 *
 * Also records resolved outbound links into `frontmatter.wikilinks` so a
 * separate build-time script can construct the graph-view index without
 * re-parsing markdown.
 */
import { visit } from "unist-util-visit";
import fs from "node:fs";
import path from "node:path";

const BLOG_DIR = path.resolve(process.cwd(), "src/pages/blog");
const WIKILINK_RE = /(?<!!)\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/g;

/** @type {Map<string, { slug: string, title: string }> | null} */
let titleIndexCache = null;

function slugFromFilename(filename) {
  return filename.replace(/\.mdx?$/, "");
}

/** Build (once) a lowercase-title -> {slug, title} lookup from all blog posts. */
function buildTitleIndex() {
  if (titleIndexCache) return titleIndexCache;
  const index = new Map();
  if (!fs.existsSync(BLOG_DIR)) {
    titleIndexCache = index;
    return index;
  }
  for (const filename of fs.readdirSync(BLOG_DIR)) {
    if (!/\.mdx?$/.test(filename)) continue;
    const fullPath = path.join(BLOG_DIR, filename);
    const src = fs.readFileSync(fullPath, "utf8");
    const fmMatch = src.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) continue;
    const titleMatch = fmMatch[1].match(/^title:\s*"?(.*?)"?\s*$/m);
    if (!titleMatch) continue;
    const title = titleMatch[1];
    const slug = slugFromFilename(filename);
    index.set(title.toLowerCase(), { slug, title });
  }
  titleIndexCache = index;
  return index;
}

function slugifyHeading(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[`~!@#$%^&*()+={}[\]|\\:;"'<>,.?/]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function remarkWikilinks() {
  const titleIndex = buildTitleIndex();

  return (tree, file) => {
    const outboundLinks = [];

    visit(tree, "text", (node, index, parent) => {
      if (!parent || typeof index !== "number") return;
      const value = node.value;
      if (!value.includes("[[")) return;

      const matches = [...value.matchAll(WIKILINK_RE)];
      if (matches.length === 0) return;

      const newChildren = [];
      let lastEnd = 0;

      for (const match of matches) {
        const [full, targetTitle, heading, alias] = match;
        const matchStart = match.index;
        const matchEnd = matchStart + full.length;

        if (matchStart > lastEnd) {
          newChildren.push({ type: "text", value: value.slice(lastEnd, matchStart) });
        }

        const resolved = titleIndex.get(targetTitle.trim().toLowerCase());
        if (resolved) {
          const href = `/blog/${resolved.slug}/${heading ? `#${slugifyHeading(heading)}` : ""}`;
          const linkText = alias || (heading ? `${resolved.title} (${heading})` : resolved.title);
          newChildren.push({
            type: "link",
            url: href,
            children: [{ type: "text", value: linkText }],
          });
          outboundLinks.push({ slug: resolved.slug, title: resolved.title });
        } else {
          // Unresolvable target: warn at build time, fall back to plain text
          // (never break the build or emit a dead link).
          console.warn(
            `[remark-wikilinks] Could not resolve [[${targetTitle}]] in ${file.path || file.history?.[0] || "unknown file"} — leaving as plain text.`
          );
          const fallbackText = alias || (heading ? `${targetTitle} (${heading})` : targetTitle);
          newChildren.push({ type: "text", value: fallbackText });
        }

        lastEnd = matchEnd;
      }

      if (lastEnd < value.length) {
        newChildren.push({ type: "text", value: value.slice(lastEnd) });
      }

      parent.children.splice(index, 1, ...newChildren);
      return index + newChildren.length;
    });

    if (!file.data.astro) file.data.astro = {};
    if (!file.data.astro.frontmatter) file.data.astro.frontmatter = {};
    file.data.astro.frontmatter.wikilinks = outboundLinks;
  };
}
