# joshuayang.org

My personal site and blog. Posts are written in [Obsidian](https://obsidian.md) and published with
[Quartz 5](https://quartz.jzhao.xyz), themed after [pi.website](https://www.pi.website/).

## How it fits together

| Path | What it is |
|---|---|
| `content/` | The published notes, copied from my Obsidian vault by `scripts/sync-vault.py`. Don't edit here; edit in the vault and re-sync. |
| `quartz/components/frames/JoshuaBlogFrame.tsx` | The page layout: sidebar, header, article, and Quartz's graph + table of contents on the right. |
| `quartz/components/frames/JoshuaHome.tsx` | The homepage. Projects are a data list (`PROJECTS`) at the top of the file. |
| `quartz/plugins/transformers/joshuaSite.ts` | Markdown handling: display-math normalisation, MathJax output, Obsidian image embeds as captioned figures, unpublished wikilinks as plain text, post summaries. |
| `quartz/static/site/` | Stylesheets (`new-styles.css`, `pi-theme.css`, `quartz-bridge.css`), `new-script.js`, icons and demo media. |
| `quartz.config.yaml` | Quartz configuration: which plugins are on, the graph options, the domain. |
| `netlify.toml` | Build settings, plus redirects from the old `/blog/<slug>/` URLs. |
| `scripts/video/` | Renders the cloth-folding simulation montage from USD trajectories. |

## Publishing a post

1. Write the note in the vault.
2. Add it to `POSTS` in `scripts/sync-vault.py` with its title and dates. Notes it embeds (`![[Note]]`)
   and their images are pulled in automatically.
3. `python3 scripts/sync-vault.py`
4. Preview: `node ./quartz/bootstrap-cli.mjs build --serve`
5. Commit and push to `main`; Netlify builds and deploys.

Wikilinks to notes that aren't published render as plain text rather than broken links.

## Local setup

Needs Node 22+.

```sh
npm ci
node ./quartz/bootstrap-cli.mjs build --serve   # http://localhost:8080
```

The previous Astro version of the site is preserved on the `astro-archive` branch.
