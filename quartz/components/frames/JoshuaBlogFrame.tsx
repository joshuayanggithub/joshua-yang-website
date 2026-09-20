import { JSX } from "preact"
import { PageFrame, PageFrameProps } from "./types"
import { QuartzComponentProps } from "../types"
import { htmlToJsx } from "../../util/jsx"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../../util/resources"
import { FilePath } from "../../util/path"
import { HomePage } from "./JoshuaHome"

/**
 * joshua-yang-website's page (src/layouts/BaseLayout.astro + BlogPost.astro +
 * Sidebar.astro) with Quartz's native side rails:
 *
 *   left rail   the site sidebar (Sidebar.astro), listing published posts
 *   center      the Astro header/article/footer markup, styled by the site's own CSS
 *               (copied to quartz/static/site/), unchanged
 *   right rail  Quartz components laid out at `position: right` (Graph, Table of Contents)
 *
 * Layout for the rails lives in static/site/quartz-bridge.css.
 */

const SITE = "/static/site"
// Astro scopes component <style> blocks with these attributes; the compiled CSS
// (static/site/_astro/*.css) selects on them, so we emit them verbatim.
const POST_CID = { "data-astro-cid-bvzihdzo": "" } // src/layouts/BlogPost.astro
const INDEX_CID = { "data-astro-cid-5tznm7mj": "" } // src/pages/blog/index.astro

/** Page routing, mirroring the Astro site: content/index.md is the homepage (/), content/blog.md the post list (/blog). */
const isHome = (slug: string | undefined) => slug === "index"
const isBlogIndex = (slug: string | undefined) => slug === "blog"

// The blog index has no links of its own, so its right rail shows the whole vault
// (Quartz's own global-graph defaults) instead of a local graph.
const GLOBAL_GRAPH_CFG = {
  drag: true,
  zoom: true,
  depth: -1,
  scale: 0.9,
  repelForce: 0.5,
  centerForce: 0.2,
  linkDistance: 30,
  fontSize: 0.45,
  opacityScale: 0.75, // with the 1.3x page zoom, keeps labels hidden until hover
  showTags: false,
  removeTags: [],
  focusOnHover: true,
  enableRadial: true,
}

function fmString(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") return undefined
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value)
}

function SiteHead({ fileData, externalResources }: QuartzComponentProps): JSX.Element {
  const blogIndex = isBlogIndex(fileData.slug)
  const title = isHome(fileData.slug)
    ? "Joshua Yang"
    : `${blogIndex ? "Blog" : (fileData.frontmatter?.title ?? "Untitled")} | Joshua Yang`
  const { css, js, additionalHead } = externalResources
  // Drop Quartz's base theme stylesheet (index.css) and KaTeX: the site's own CSS
  // and MathJax replace them. Component styles (explorer, graph, toc) are kept.
  const componentCss = css.filter(
    (r) => !/(^|\/)index(-[0-9a-f]+)?\.css$/.test(r.content) && !r.content.includes("katex"),
  )
  return (
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>
      <link rel="stylesheet" href={`${SITE}/styles/new-styles.css`} />
      {/* pi.website-inspired typography pass (same order as BaseLayout.astro) */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Source+Sans+3:wght@400;600&display=swap"
      />
      <link rel="stylesheet" href={`${SITE}/styles/pi-theme.css`} />
      <link rel="icon" type="image/svg+xml" href={`${SITE}/media/images/Icons/favicon.svg`} />
      <link rel="alternate icon" href={`${SITE}/media/images/Icons/favicon.ico`} />
      {blogIndex && <link rel="stylesheet" href={`${SITE}/_astro/blog-index.css`} />}
      <link rel="stylesheet" href={`${SITE}/_astro/blog-post.css`} />
      {componentCss.map((r) => CSSResourceToStyleElement(r, true))}
      <link rel="stylesheet" href={`${SITE}/quartz-bridge.css`} />
      {js.filter((r) => r.loadTime === "beforeDOMReady").map((r) => JSResourceToScriptElement(r, true))}
      {additionalHead.map((r) => (typeof r === "function" ? r(fileData) : r))}
    </head>
  )
}

/** Published blog posts (notes with a `publish` date), newest first — like Sidebar.astro. */
function publishedPosts(allFiles: QuartzComponentProps["allFiles"]) {
  return allFiles
    .filter((f) => f.frontmatter?.title && f.frontmatter?.publish)
    .sort(
      (a, b) =>
        new Date(String(b.frontmatter!.publish)).getTime() -
        new Date(String(a.frontmatter!.publish)).getTime(),
    )
}

/** Sidebar.astro: the site's own list of published posts. */
function LeftRail({ allFiles, fileData }: QuartzComponentProps) {
  const posts = publishedPosts(allFiles).slice(0, 6)
  return (
    <aside class="site-sidebar" aria-label="Sidebar">
      <nav class="sidebar-section" aria-label="Blog links">
        <h3 class="sidebar-title">blog</h3>
        <p class="sidebar-note">
          <em>
            <a href="https://www.swyx.io/learn-in-public" target="_blank" rel="noreferrer">
              learning in public
            </a>{" "}
            is good — keeping
          </em>
          <br />
          <em> myself accountable by documenting the process every month.</em>
        </p>
        <ul class="sidebar-list">
          {posts.map((post) => (
            <li class="sidebar-item">
              <a href={`/${post.slug}`} class={post.slug === fileData.slug ? "active" : undefined}>
                <span class="sidebar-link-title">{post.frontmatter!.title}</span>
                <span class="sidebar-link-date">{fmString(post.frontmatter!.publish)}</span>
              </a>
            </li>
          ))}
          <li class="sidebar-item sidebar-item-muted">
            <a href="/blog">all posts →</a>
          </li>
        </ul>
      </nav>
      <nav class="sidebar-section" aria-label="Connect links">
        <h3 class="sidebar-title">connect with me!</h3>
        <ul class="sidebar-list connect-list">
          <li class="sidebar-item">
            <a href="https://twitter.com/realjoshuayang" target="_blank" rel="noreferrer">
              <img class="icon" src={`${SITE}/media/icons/twitter.svg`} alt="" /> @realjoshuayang
            </a>
          </li>
          <li class="sidebar-item">
            <a href="https://github.com/joshuayanggithub" target="_blank" rel="noreferrer">
              <img class="icon" src={`${SITE}/media/icons/github.svg`} alt="" /> GitHub
            </a>
          </li>
          <li class="sidebar-item">
            <a href="https://linkedin.com/in/thejoshuayang" target="_blank" rel="noreferrer">
              <img class="icon" src={`${SITE}/media/icons/linkedin.png`} alt="" /> LinkedIn
            </a>
          </li>
          <li class="sidebar-item">
            <a href="mailto:joshuayang@cmu.edu" class="email-link">
              <img class="icon" src={`${SITE}/media/icons/email.svg`} alt="" />{" "}
              <span class="email-text" data-email="joshuayang@cmu.edu"></span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

/**
 * Bigger graph nodes, for easier hovering. The graph plugin has no node-size option: a node's
 * radius is fixed at 2 + sqrt(links) world units (its `scale` option only resizes labels), so
 * the only lever is the zoom level. Once each canvas exists, send it one wheel event centred
 * on the canvas; d3-zoom maps a pixel wheel delta to k' = k * 2^(-deltaY * 0.002).
 * Containers can override the factor with data-zoom.
 */
const GRAPH_ZOOM = 1.8
const GRAPH_ZOOM_SCRIPT = `
  document.querySelectorAll(".quartz-right .graph-container").forEach(function (container) {
    var zoom = parseFloat(container.getAttribute("data-zoom") || "") || ${GRAPH_ZOOM};
    new MutationObserver(function (_, observer) {
      var canvas = container.querySelector("canvas");
      if (!canvas) return;
      observer.disconnect();
      setTimeout(function () {
        var r = canvas.getBoundingClientRect();
        canvas.dispatchEvent(new WheelEvent("wheel", {
          deltaY: -Math.log2(zoom) / 0.002, deltaMode: 0,
          clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, bubbles: true, cancelable: true
        }));
      }, 60);
    }).observe(container, { childList: true, subtree: true });
  });
`

/** Quartz components laid out at `position: right` (Graph, Table of Contents). */
function RightRail(componentData: QuartzComponentProps, right: PageFrameProps["right"]) {
  if (isBlogIndex(componentData.fileData.slug)) {
    return (
      <aside class="quartz-right" aria-label="Graph">
        <div class="graph">
          <h3>Graph View</h3>
          <div class="graph-outer">
            {/* the whole-vault layout is wider than a local graph, so zoom it less */}
            <div class="graph-container" data-cfg={JSON.stringify(GLOBAL_GRAPH_CFG)} data-zoom="1.3"></div>
          </div>
        </div>
      </aside>
    )
  }
  return (
    <aside class="quartz-right" aria-label="Graph and table of contents">
      {right.map((Component) => (
        <Component {...componentData} />
      ))}
    </aside>
  )
}

/** pi.website's header: serif wordmark on the left, underlined nav links on the right. */
function SiteNav({ current }: { current: "home" | "blog" | "post" }) {
  return (
    <nav class="site-nav" aria-label="Site">
      {/* the homepage's own <h1> is the name, so the wordmark would repeat it there */}
      {current === "home" ? <span></span> : (
        <a class="site-nav-wordmark" href="/">
          Joshua Yang
        </a>
      )}
      <span class="site-nav-links">
        <a href="/blog" class={current === "blog" ? "active" : undefined}>
          blog
        </a>
      </span>
    </nav>
  )
}

/** BlogPost.astro: header, article, footer. */
function PostPage({ fileData, tree }: QuartzComponentProps) {
  const fm = fileData.frontmatter ?? {}
  const meta = [
    fmString(fm.publish) && { cls: "post-date", text: `published ${fmString(fm.publish)}` },
    fmString(fm.created) && { cls: "post-date", text: `created ${fmString(fm.created)}` },
    fmString(fm.updated) && { cls: "post-updated", text: `updated ${fmString(fm.updated)}` },
  ].filter(Boolean) as { cls: string; text: string }[]

  return (
    <>
      <header {...POST_CID}>
        <SiteNav current="post" />
        <p class="last-updated" {...POST_CID}>
          <a href="/" {...POST_CID}>
            ← back
          </a>
        </p>
        <h1 {...POST_CID}>{fm.title}</h1>
        {meta.length > 0 && (
          <div class="post-meta" {...POST_CID}>
            {meta.map((m, i) => (
              <>
                {i > 0 && (
                  <span class="post-meta-sep" {...POST_CID}>
                    ·
                  </span>
                )}
                <span class={m.cls} {...POST_CID}>
                  {m.text}
                </span>
              </>
            ))}
          </div>
        )}
      </header>
      <main {...POST_CID}>
        <article class="blog-post" {...POST_CID}>
          {htmlToJsx(fileData.filePath! as FilePath, tree)}
        </article>
      </main>
    </>
  )
}

/** src/pages/blog/index.astro: header and dated post list. */
function BlogIndexPage({ allFiles }: QuartzComponentProps) {
  const posts = publishedPosts(allFiles)
  return (
    <>
      <header {...INDEX_CID}>
        <SiteNav current="blog" />
        <h1 {...INDEX_CID}>blog</h1>
      </header>
      <main {...INDEX_CID}>
        <section id="blog-list" {...INDEX_CID}>
          {posts.length === 0 ? (
            <p {...INDEX_CID}>No posts yet. Check back soon!</p>
          ) : (
            <ul class="post-list" {...INDEX_CID}>
              {posts.map((post) => (
                <li class="post-item" {...INDEX_CID}>
                  <span class="post-date" {...INDEX_CID}>
                    {fmString(post.frontmatter!.publish)}
                  </span>
                  <a href={`/${post.slug}`} class="post-title" {...INDEX_CID}>
                    {post.frontmatter!.title}
                  </a>
                  {(post.frontmatter!.description ?? post.description) && (
                    <p class="post-description" {...INDEX_CID}>
                      {String(post.frontmatter!.description ?? post.description)}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  )
}

const MATHJAX_CONFIG = `
      window.MathJax = {
        tex: {
          inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
          displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
          processEscapes: true,
          macros: {
            cancel: ['\\\\enclose{updiagonalstrike}{#1}', 1],
            bcancel: ['\\\\enclose{downdiagonalstrike}{#1}', 1],
            xcancel: ['\\\\enclose{updiagonalstrike,downdiagonalstrike}{#1}', 1],
            boldsymbol: ['\\\\pmb{#1}', 1],
            bm: ['\\\\pmb{#1}', 1]
          }
        },
        options: {
          enableMenu: true
        }
      };
    `

export const JoshuaBlogFrame: PageFrame = {
  name: "joshua-blog",
  bare: true,
  // home matches index.astro (no wide column, no Quartz rail); blog pages get the rail
  bodyClass: ({ fileData }) => (isHome(fileData.slug) ? "with-sidebar" : "blog-wide with-sidebar quartz-rails"),
  head: SiteHead,
  render({ componentData, right }: PageFrameProps) {
    const slug = componentData.fileData.slug
    const blogIndex = isBlogIndex(slug)
    const cid = blogIndex ? INDEX_CID : POST_CID
    return (
      <>
        <div id="mouse-trailer"></div>
        {LeftRail(componentData)}
        {isHome(slug) ? (
          <HomePage nav={<SiteNav current="home" />} />
        ) : (
          <>
            {blogIndex ? BlogIndexPage(componentData) : PostPage(componentData)}
            {RightRail(componentData, right)}
            <footer {...cid}>
              <p {...cid}>© 2026 Joshua Yang</p>
            </footer>
          </>
        )}
        <script dangerouslySetInnerHTML={{ __html: GRAPH_ZOOM_SCRIPT }} />
        <script src={`${SITE}/new-script.js`}></script>
        <script dangerouslySetInnerHTML={{ __html: MATHJAX_CONFIG }} />
        <script id="MathJax-script" src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-chtml.js"></script>
      </>
    )
  },
}
