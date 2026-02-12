/**
 * Remark plugin: extract headings from markdown and add tableOfContents to frontmatter.
 * Slug format matches rehype-slug (github-slugger) for correct anchor links.
 */
import { visit } from "unist-util-visit";
import GitHubSlugger from "github-slugger";

/** @param {import('mdast').Root} node */
function getNodeValue(node) {
  if (!node || !node.children) return "";
  return node.children
    .map((child) => (child.type === "text" ? (child.value || "") : getNodeValue(child)))
    .join("");
}

export default function remarkTableOfContents() {
  const slugger = new GitHubSlugger();

  return (tree, file) => {
    const toc = [];
    const counters = [0, 0, 0, 0, 0, 0]; // depth 1..6

    visit(tree, "heading", (node) => {
      if (node.depth < 1 || node.depth > 6) return;
      const title = getNodeValue(node);
      if (!title.trim()) return;

      const d = node.depth;

      // Reset deeper levels
      for (let i = d; i < 6; i++) counters[i] = 0;

      counters[d - 1]++;

      // Build number: filter out zero-level gaps (e.g. h1->h3 gives "3.1" not "3.0.1")
      const numParts = counters.slice(0, d).filter((n) => n > 0);

      slugger.reset();
      const slug = slugger.slug(title);
      toc.push({
        depth: node.depth,
        title: title.trim(),
        href: `#${slug}`,
      });
    });

    if (!file.data.astro) file.data.astro = {};
    if (!file.data.astro.frontmatter) file.data.astro.frontmatter = {};
    file.data.astro.frontmatter.tableOfContents = toc;
  };
}
