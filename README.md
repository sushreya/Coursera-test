# Unravel Design System: portfolio case study

A standalone static page (no build step) telling the story of replacing per-client style guides with one token-based, white-label design system.

- `index.html`: the case study
- `styles.css`: page styles; components use semantic tokens only
- `app.js`: brand data and the live brand switcher / token explorer

Open `index.html` in a browser, or serve the folder: `python3 -m http.server`.

## Content to verify before publishing
- Brand colours come from the Primitives collection in the Unravel Figma file; the semantic role mapping in the token explorer is simplified for the demo.
- ING numbers (~90 screens: ~41 mobile, ~40 desktop, plus a few tablet) were counted from frame sizes, so they are approximate.
- Client names are shown as-is; remove or anonymise in `app.js` (`CLIENTS`, `BRANDS`) if needed.
