# Aron Belle — Data-Driven Modelling Portfolio

This version generates the entire portfolio from `data/portfolio.json`.

You no longer need to manually add each photograph to `index.html`.

## Important

Because the site loads JSON using `fetch()`, do not open `index.html`
directly from File Explorer. Use:

- GitHub Pages
- VS Code Live Server
- `python -m http.server`

Your GitHub Pages version will work normally.

## Add a shoot

Open:

```text
data/portfolio.json
```

Add another object inside the `shoots` array:

```json
{
  "id": "new-shoot",
  "layout": "pair-staggered",
  "images": [
    {
      "src": "images/new-shoot/photo-01.webp",
      "alt": "Outdoor fashion portrait"
    },
    {
      "src": "images/new-shoot/photo-02.webp",
      "alt": "Full-length location photograph"
    }
  ]
}
```

Then create:

```text
images/new-shoot/
```

and place the photographs inside it.

## Available layouts

- `hero` — one near-full-screen opening image
- `single-wide` — one large centred image
- `single-inset-left` — one narrower image aligned left
- `single-inset-right` — one narrower image aligned right
- `pair-staggered` — two differently sized, vertically offset images
- `pair-equal` — two balanced portrait images
- `landscape` — one 4:3 landscape image
- `cinematic` — one wider cinematic image
- `triptych` — three-image closing sequence

Each layout uses only the number of images it needs.

## Contact details

Edit the `contact` section of `portfolio.json`:

```json
"contact": {
  "enabled": true,
  "email": "your@email.com",
  "instagram": "https://www.instagram.com/yourusername/"
}
```

Set `enabled` to `false` to hide it.

## Endless-scroll effect

The site currently creates the illusion of a loop with an `AB` return screen
at the bottom. Tapping it smoothly returns to the first image.

Set this to `false` to remove it:

```json
"settings": {
  "loopReturn": false
}
```

## Recommended image export

- WebP or high-quality JPEG
- 1600–2200 px on the longest edge
- lowercase filenames
- no spaces in filenames
- descriptive alt text

## GitHub workflow

1. Replace your current repository files with these.
2. Commit through GitHub Desktop.
3. Push to `main`.
4. Wait for the GitHub Pages deployment.
5. Refresh the live site on your phone.
