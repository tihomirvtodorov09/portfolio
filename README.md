# Commercial Systems Portfolio — Tihomir Todorov

Plain HTML/CSS/JS — no build step, no framework, nothing to install.

## What's in here
- `index.html` — homepage (hero, career timeline, sales track record, case study grid, how I work, tech, currently building, "what's next")
- `work/*.html` — one page per case study, each with an outcome summary card, before/after comparison, system flow diagram, full stage breakdown, technology chips, engineering-decision rationale, and screenshot placeholders
- `styles/tokens.css` — colour, type, and spacing variables (the design system)
- `styles/global.css` — all component styles
- `assets/app.js` — a ~20-line vanilla JS file that powers the restrained scroll-reveal effect (no dependencies)
- `assets/portrait.jpg` — **not included** — see below

## Publishing on GitHub Pages
1. Create a new repository on GitHub (e.g. `portfolio`).
2. Upload all the files in this folder to the repository root, keeping the `work/`, `styles/`, and `assets/` folders as-is.
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set Source to **Deploy from a branch**, branch **main**, folder **/ (root)**.
5. Save. GitHub will give you a URL like `https://yourusername.github.io/portfolio/` within a minute or two.

## Before you publish

**1. Contact details** — search `index.html` for:
- `YOUR_EMAIL_HERE` — replace with your real email
- `YOUR_PROFILE` — replace with your LinkedIn profile slug

**2. Portrait photo** — the hero is already wired to show a photo at `assets/portrait.jpg`.
Add a black-and-white (or desaturated) photo at that exact path and it will appear automatically.
If the file is missing, the hero gracefully shows an empty panel instead of a broken image icon —
so the site works fine without a photo too, this just adds it in.

**3. Screenshots** — each case study page has dashed placeholder boxes under "In the Field"
marking where a real screenshot should go. To add one:
- Save the screenshot as e.g. `assets/quoting-tool-1.png`
- In the relevant `work/*.html` file, find the matching `<div class="screenshot-slot">` and
  replace its contents with `<img src="../assets/quoting-tool-1.png" alt="...">`
- Blur or crop out any real customer data first.

## Editing content later
All copy lives directly in the HTML files — open the relevant `.html` file and edit the text.
Each case study page is self-contained; there's no separate data file to touch in this version.
