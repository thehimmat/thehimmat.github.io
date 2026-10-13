# thehimmat.github.io

Personal portfolio for Himmat Singh Khalsa, served by GitHub Pages at [thehimmat.com](https://thehimmat.com).

## Structure

Plain HTML, no build step.

- `index.html`, `ai-sessions.html`, `work-with-me.html`, `support.html`, `404.html` — the pages
- `site.css` — shared tokens, reset, nav, buttons, cards, footer. Page-only layout stays in each page's `<style>`
- `site.js` — mobile nav toggle

The nav and footer markup is repeated in each page; keep them in sync (the tests check this).

## Tests

```sh
npm test
```

Runs `node --test` (no dependencies) over `tests/`. It checks every page for the shared stylesheet and nav, meta description, Open Graph tags, and `rel="noopener noreferrer"` on new-tab links.

## Deploy

Push to `main`; GitHub Pages publishes it.
