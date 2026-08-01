# Aron Belle — Modelling Portfolio

This package includes the current portfolio code and all supplied photographs,
optimised as WebP files for the web.

## Before publishing

Edit `data/portfolio.json` and replace:

```json
"email": "hello@example.com",
"instagram": "https://www.instagram.com/"
```

with your real details.

## Install into the existing GitHub repository

1. Back up the current repository folder.
2. Replace its contents with everything inside this folder.
3. Open GitHub Desktop.
4. Review the changes.
5. Commit with a message such as:
   `Add real portfolio photography`
6. Push to `main`.
7. Wait for GitHub Pages to deploy.

## Images

The original images were converted to WebP and reduced to a maximum dimension
of 1900px. This keeps the site much faster on mobile while preserving good
display quality.

The photographs are organised permanently by shoot:

```text
images/
├── esmee/
├── world-cup/
├── timmy/
├── runway/
├── digis/
├── tux/
└── misc/
```

The site still uses the current `layout` JSON format, so it is compatible with
the included JavaScript.
