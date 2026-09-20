/**
 * Site-specific transformers that make Quartz output match joshua-yang-website
 * (the Astro site) markup exactly, so the site's own CSS applies unchanged.
 *
 * - JoshuaMath: parse `$…$` / `$$…$$` with remark-math, then emit the same
 *   `<span|div class="tex2jax_process">\(…\)|\[…\]</…>` markup as the Astro
 *   site's `rehypeMathToTexDelimiters`, so client-side MathJax 3 (CHTML)
 *   typesets it identically. Replaces the @quartz-community/latex plugin.
 * - JoshuaMarkup: turn Obsidian image embeds (`![[img.png | caption | 500]]`)
 *   into the Astro site's `<figure class="obsidian-figure">` blocks, drop
 *   Quartz's heading anchor icons, and render wikilinks to unpublished notes
 *   as plain text.
 */
import { Latex } from "@quartz-community/latex"
import { QuartzTransformerPlugin } from "../types"

type HastNode = {
  type: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
}

function toText(node: HastNode | undefined): string {
  if (!node) return ""
  if (node.type === "text") return node.value ?? ""
  return (node.children ?? []).map(toText).join("")
}

function classList(node: HastNode | undefined): string[] {
  const c = node?.properties?.className
  if (Array.isArray(c)) return c.map(String)
  if (typeof c === "string") return c.split(/\s+/).filter(Boolean)
  return []
}

function texElement(tex: string, display: boolean): HastNode {
  return {
    type: "element",
    tagName: display ? "div" : "span",
    properties: { className: ["tex2jax_process"] },
    children: [{ type: "text", value: display ? `\\[${tex}\\]` : `\\(${tex}\\)` }],
  }
}

/** Port of rehypeMathToTexDelimiters from the Astro site's astro.config.mjs. */
function rehypeMathToTexDelimiters() {
  function walk(node: HastNode) {
    const children = node.children ?? []
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      if (child.type === "element") {
        // display math arrives as <pre><code class="language-math math-display">
        if (child.tagName === "pre") {
          const kids = child.children ?? []
          const only = kids.length === 1 ? kids[0] : undefined
          const classes = classList(only)
          if (only?.type === "element" && (classes.includes("math") || classes.includes("language-math"))) {
            children[i] = texElement(toText(only), !classes.includes("math-inline"))
            continue
          }
        }
        const classes = classList(child)
        const isMath = classes.includes("math") || classes.includes("language-math")
        const isInline = classes.includes("math-inline")
        const isDisplay = classes.includes("math-display")
        if (isMath && (isInline || isDisplay)) {
          children[i] = texElement(toText(child), isDisplay)
          continue
        }
      }
      walk(child)
    }
  }
  return (tree: HastNode) => walk(tree)
}

/**
 * Obsidian accepts `$$` anywhere; remark-math only treats it as display math when the
 * opening and closing `$$` each sit alone on a line. Anything else mis-parses, e.g.
 *
 *     $$\operatorname{clip}(x,a,b)=        <- text after the fence is read as a "meta" label,
 *     \begin{cases} … \end{cases}$$        <- so this never closes and the block swallows
 *                                             every paragraph up to the next bare `$$`
 *
 * So rewrite every `$$ … $$` (one-line, multi-line, mid-sentence, indented, in a callout)
 * as a well-formed block, carrying the line's container prefix (`> `, list indentation)
 * so math inside callouts and list items stays inside them. Code fences are left alone.
 */
export function normalizeDisplayMath(src: string): string {
  const out: string[] = []
  let codeFence = ""
  let inMath = false
  let prefix = ""
  let math: string[] = []

  const blank = () => (prefix.includes(">") ? prefix.trimEnd() : "")
  const openBlock = (line: string) => {
    // container prefix of the line the math starts on: quote markers, indentation, and the
    // width of a list marker (so the block lines up with the list item's text)
    const m = /^((?:\s*>)*\s*)((?:[-*+]|\d+[.)])\s+)?/.exec(line)!
    prefix = m[1] + " ".repeat(m[2]?.length ?? 0)
    math = []
    inMath = true
  }
  const closeBlock = () => {
    const body = math.join("\n").replace(/^\s*\n|\n\s*$/g, "")
    out.push(blank(), `${prefix}$$`, ...body.split("\n").map((l) => prefix + l.trim()), `${prefix}$$`, blank())
    inMath = false
  }
  const stripPrefix = (line: string) => line.replace(/^(?:\s*>)*\s*/, "")

  for (const line of src.split(/\r?\n/)) {
    if (!inMath) {
      const fence = /^\s*(```+|~~~+)/.exec(line)
      if (fence && (!codeFence || fence[1].startsWith(codeFence))) {
        codeFence = codeFence ? "" : fence[1]
        out.push(line)
        continue
      }
      if (codeFence || !line.includes("$$")) {
        out.push(line)
        continue
      }
    } else if (!line.includes("$$")) {
      math.push(stripPrefix(line))
      continue
    }

    // the line holds one or more `$$`: alternate between text and math at each one
    const parts = line.split("$$")
    parts.forEach((part, i) => {
      if (i > 0) {
        if (inMath) closeBlock()
        else openBlock(line)
      }
      if (inMath) {
        math.push(i === 0 ? stripPrefix(part) : part)
      } else if (part.trim() && !(i === 0 && !stripPrefix(part).trim())) {
        // text before/after the math keeps the line's prefix (first part already has it)
        out.push(i === 0 ? part.trimEnd() : prefix + part.trim())
      }
    })
  }
  if (inMath) out.push(`${prefix}$$`, ...math) // unbalanced `$$`: leave the tail as it was
  return out.join("\n")
}

export const JoshuaMath: QuartzTransformerPlugin = () => ({
  name: "JoshuaMath",
  textTransform: (_ctx, src) => normalizeDisplayMath(src),
  // remark-math, as bundled inside @quartz-community/latex
  markdownPlugins: (ctx) => Latex().markdownPlugins!(ctx),
  htmlPlugins: () => [rehypeMathToTexDelimiters],
})

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif|bmp)$/i

/**
 * Obsidian embeds `![[file.png | caption | 500]]` arrive from the OFM plugin as
 * <img src alt width>. The Astro site rendered them as
 *   <figure class="obsidian-figure"><img … style="max-width: 500px;"><figcaption>…</figcaption></figure>
 * and a figure is block-level, so the image is lifted out of its paragraph.
 */
function rehypeObsidianFigures() {
  function makeFigure(img: HastNode): HastNode {
    const props = img.properties ?? {}
    const src = String(props.src ?? "")
    const fileName = decodeURIComponent(src.split("/").pop() ?? "")
    const rawAlt = String(props.alt ?? "").trim()
    const width = /^\d+(px)?$/.test(String(props.width ?? "")) ? String(props.width).replace(/px$/, "") : ""
    // Obsidian alias text that isn't a width or the file name itself is a caption
    const caption = rawAlt && rawAlt !== fileName && !/^\d+(x\d+)?$/.test(rawAlt) ? rawAlt : ""
    const imgProps: Record<string, unknown> = {
      src,
      alt: caption || fileName,
      loading: "lazy",
    }
    if (width) imgProps.style = `max-width: ${width}px;`
    const figureChildren: HastNode[] = [{ type: "element", tagName: "img", properties: imgProps, children: [] }]
    if (caption) {
      figureChildren.push({
        type: "element",
        tagName: "figcaption",
        properties: {},
        children: [{ type: "text", value: caption }],
      })
    }
    return { type: "element", tagName: "figure", properties: { className: ["obsidian-figure"] }, children: figureChildren }
  }

  const isEmbedImage = (n: HastNode) =>
    n.type === "element" && n.tagName === "img" && IMAGE_EXT.test(decodeURIComponent(String(n.properties?.src ?? "")))
  const isBlank = (n: HastNode) => n.type === "text" && !(n.value ?? "").trim()

  function walk(node: HastNode) {
    const children = node.children ?? []
    const out: HastNode[] = []
    for (const child of children) {
      if (child.type === "element" && child.tagName === "p" && (child.children ?? []).some(isEmbedImage)) {
        // split the paragraph around each image so figures become siblings of the text
        let buffer: HastNode[] = []
        const flush = () => {
          while (buffer.length && isBlank(buffer[0])) buffer.shift()
          while (buffer.length && (isBlank(buffer[buffer.length - 1]) || buffer[buffer.length - 1].tagName === "br")) buffer.pop()
          if (buffer.length) out.push({ ...child, children: buffer })
          buffer = []
        }
        for (const inner of child.children ?? []) {
          if (isEmbedImage(inner)) {
            flush()
            out.push(makeFigure(inner))
          } else if (!(inner.tagName === "br" && buffer.length === 0)) {
            buffer.push(inner)
          }
        }
        flush()
        continue
      }
      walk(child)
      out.push(child)
    }
    node.children = out
  }
  return (tree: HastNode) => walk(tree)
}

/**
 * Heading ids come from the GFM plugin (rehype-slug, same github-slugger ids as
 * the Astro site), but it also appends an `<a role="anchor">` link icon to every
 * heading. The Astro site has no such icon, so drop it and keep the id.
 */
function rehypeStripHeadingAnchors() {
  function walk(node: HastNode) {
    for (const child of node.children ?? []) {
      if (child.type === "element" && /^h[1-6]$/.test(child.tagName ?? "")) {
        child.children = (child.children ?? []).filter(
          (c) => !(c.type === "element" && c.tagName === "a" && c.properties?.role === "anchor"),
        )
      } else {
        walk(child)
      }
    }
  }
  return (tree: HastNode) => walk(tree)
}

/**
 * Wikilinks to notes that aren't in the published content (the rest of the vault)
 * would 404. Render them as plain text instead, like Obsidian Publish and the
 * Astro site's converter did for unresolved links.
 */
function rehypeUnpublishedLinks(publishedSlugs: Set<string>) {
  return () => {
    function walk(node: HastNode) {
      const children = node.children ?? []
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        // hast property name depends on how the link was built (camelCase or raw attribute)
        const slug = child.properties?.dataSlug ?? child.properties?.["data-slug"]
        if (
          child.type === "element" &&
          child.tagName === "a" &&
          classList(child).includes("internal") &&
          typeof slug === "string" &&
          !publishedSlugs.has(slug)
        ) {
          children[i] = {
            type: "element",
            tagName: "span",
            properties: { className: ["internal-unpublished"] },
            children: child.children ?? [],
          }
          continue
        }
        walk(child)
      }
    }
    return (tree: HastNode) => walk(tree)
  }
}

/**
 * The Description plugin summarises a note from the top of its text, which on
 * these notes starts with the first heading ("Motivation Given a dataset…").
 * Rebuild it from the first real paragraph instead. A `description` in the
 * note's frontmatter still wins, so any post can be given a hand-written blurb.
 */
/** Plain text of a node, leaving out math (its delimiters would show as `\(x\)`). */
function summaryText(node: HastNode): string {
  if (node.type === "text") return node.value ?? ""
  if (classList(node).includes("tex2jax_process")) return ""
  return (node.children ?? []).map(summaryText).join("")
}

function rehypeFirstParagraphDescription(maxLength = 150) {
  return () => (tree: HastNode, file: { data: Record<string, any> }) => {
    if (file.data.frontmatter?.description) return

    let found = ""
    const visit = (node: HastNode) => {
      if (found) return
      for (const child of node.children ?? []) {
        if (found) return
        if (child.type === "element" && child.tagName === "p") {
          const text = summaryText(child).replace(/\s+/g, " ").trim()
          if (text) {
            found = text
            return
          }
        } else if (child.type === "element" && !/^(figure|blockquote)$/.test(child.tagName ?? "")) {
          visit(child)
        }
      }
    }
    visit(tree)
    if (!found) return
    file.data.description =
      found.length > maxLength ? found.slice(0, maxLength).trimEnd() + "..." : found
  }
}

export const JoshuaMarkup: QuartzTransformerPlugin = () => ({
  name: "JoshuaMarkup",
  htmlPlugins: (ctx) => [
    rehypeObsidianFigures,
    rehypeStripHeadingAnchors,
    rehypeUnpublishedLinks(new Set(ctx.allSlugs)),
    rehypeFirstParagraphDescription(),
  ],
})
