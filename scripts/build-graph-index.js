/**
 * Build-time graph index: reads all blog posts' frontmatter (title, slug,
 * and `wikilinks` — populated by scripts/remark-wikilinks.js during markdown
 * processing) and produces a { nodes, edges } graph structure.
 *
 * Used by src/components/GraphView.astro for both the global graph (all posts)
 * and local graph (a single post + its direct connections) views.
 *
 * This intentionally re-reads frontmatter via Astro.glob results passed in,
 * rather than re-parsing markdown itself, so it stays in sync with whatever
 * remark-wikilinks.js actually resolved (no duplicate parsing logic).
 *
 * @param {Array<{ url: string, frontmatter: { title?: string, wikilinks?: Array<{slug: string, title: string}> } }>} posts
 */
export function buildGraphIndex(posts) {
  const nodes = [];
  const edgeSet = new Set();
  const edges = [];

  const slugFromUrl = (url) => (url || "").replace(/^\/blog\//, "").replace(/\/$/, "");

  for (const post of posts) {
    const slug = slugFromUrl(post.url);
    if (!slug) continue;
    nodes.push({ id: slug, title: post.frontmatter?.title || slug, url: post.url });
  }

  const nodeIds = new Set(nodes.map((n) => n.id));

  for (const post of posts) {
    const sourceSlug = slugFromUrl(post.url);
    if (!sourceSlug) continue;
    const links = post.frontmatter?.wikilinks || [];
    for (const link of links) {
      if (!nodeIds.has(link.slug) || link.slug === sourceSlug) continue;
      // Dedupe undirected edges (a->b and b->a treated as the same edge for the graph view)
      const key = [sourceSlug, link.slug].sort().join("::");
      if (edgeSet.has(key)) continue;
      edgeSet.add(key);
      edges.push({ source: sourceSlug, target: link.slug });
    }
  }

  return { nodes, edges };
}

/** Return the subgraph (self + direct neighbors) for a single post's local graph view. */
export function buildLocalGraph(graph, slug) {
  const neighborIds = new Set([slug]);
  const localEdges = [];
  for (const edge of graph.edges) {
    if (edge.source === slug || edge.target === slug) {
      neighborIds.add(edge.source);
      neighborIds.add(edge.target);
      localEdges.push(edge);
    }
  }
  const localNodes = graph.nodes.filter((n) => neighborIds.has(n.id));
  return { nodes: localNodes, edges: localEdges };
}
