// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';

/**
 * Convert `remark-math` output nodes (`math-inline` / `math-display`) back into
 * TeX delimiters so client-side MathJax can typeset them (and provide the menu).
 *
 * Astro's markdown parser otherwise treats `_` inside `$...$`/`$$...$$` as emphasis,
 * producing `<em>` tags that break MathJax parsing.
 */
function rehypeMathToTexDelimiters() {
  /** @param {any} node */
  function toText(node) {
    if (!node) return '';
    if (node.type === 'text') return node.value || '';
    const children = Array.isArray(node.children) ? node.children : [];
    return children.map(toText).join('');
  }

  /** @param {any} node */
  function classList(node) {
    const c = node?.properties?.className;
    if (Array.isArray(c)) return c.map(String);
    if (typeof c === 'string') return c.split(/\s+/).filter(Boolean);
    return [];
  }

  /** @param {any} node @param {any} parent */
  function walk(node, parent) {
    if (!node) return;
    const children = Array.isArray(node.children) ? node.children : [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i];

      if (child?.type === 'element') {
        // Astro/remark-math can emit display math as:
        // <pre><code class="language-math math-display">...</code></pre>
        // MathJax ignores <pre>/<code>, so replace the whole <pre> wrapper.
        if (child.tagName === 'pre') {
          const preKids = Array.isArray(child.children) ? child.children : [];
          const only = preKids.length === 1 ? preKids[0] : null;
          if (only?.type === 'element') {
            const classes = classList(only);
            const isMath = classes.includes('math') || classes.includes('language-math');
            const isInline = classes.includes('math-inline');
            const isDisplay = classes.includes('math-display') || !isInline; // pre blocks are display
            if (isMath) {
              const tex = toText(only);
              const wrapped = isDisplay ? `\\[${tex}\\]` : `\\(${tex}\\)`;
              const replacement = {
                type: 'element',
                tagName: 'div',
                properties: { className: ['tex2jax_process'] },
                children: [{ type: 'text', value: wrapped }],
              };
              children[i] = replacement;
              continue;
            }
          }
        }

        const classes = classList(child);
        const isMath = classes.includes('math') || classes.includes('language-math');
        const isInline = classes.includes('math-inline');
        const isDisplay = classes.includes('math-display');

        if (isMath && (isInline || isDisplay)) {
          const tex = toText(child);
          const wrapped = isDisplay ? `\\[${tex}\\]` : `\\(${tex}\\)`;
          const replacement = {
            type: 'element',
            tagName: isDisplay ? 'div' : 'span',
            properties: { className: ['tex2jax_process'] },
            children: [{ type: 'text', value: wrapped }],
          };
          children[i] = replacement;
          continue;
        }
      }

      walk(child, node);
    }

    node.children = children;
  }

  /** @param {any} tree */
  return (tree) => {
    walk(tree, null);
  };
}

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  markdown: {
    // Parse `$...$` and `$$...$$` as math so underscores don't become emphasis.
    remarkPlugins: [remarkMath],
    // Convert math nodes back to delimiters for client-side MathJax rendering.
    rehypePlugins: [rehypeMathToTexDelimiters],
  },
});
