# Aron Belle — Modelling Portfolio

A mobile-first editorial modelling portfolio hosted with GitHub Pages.

## Project structure

```text
Portfolio/
├── index.html
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── animations.css
├── js/
│   ├── gallery.js
│   ├── lightbox.js
│   ├── animations.js
│   └── main.js
├── images/
│   ├── hero/
│   ├── editorial/
│   ├── commercial/
│   ├── lifestyle/
│   └── polaroids/
└── assets/
    ├── icons/
    └── favicon/
```

## What each file does

- `variables.css`: colours, spacing and shared design values.
- `base.css`: browser reset and global element rules.
- `layout.css`: page structure, grids and responsive positioning.
- `components.css`: loader, photos, branding and fullscreen viewer.
- `animations.css`: grain, reveal motion and reduced-motion support.
- `gallery.js`: gathers portfolio images and exposes their data.
- `lightbox.js`: enlarged viewer, taps, swipes and keyboard controls.
- `animations.js`: scroll-reveal behaviour.
- `main.js`: starts the site features.

## Replace the temporary images

The current version still uses remote Unsplash placeholders.

Add your photographs to the relevant folders, then update each `src` in
`index.html`.

Example:

```html
<img
  src="images/editorial/studio-portrait-01.webp"
  alt="Black and white studio portrait"
  loading="lazy"
/>
```

Use lowercase file names without spaces. WebP is recommended.

## GitHub workflow

1. Copy these files into the local GitHub repository folder.
2. Open GitHub Desktop.
3. Commit the changes.
4. Push to `main`.
5. Wait for the GitHub Pages deployment to complete.
