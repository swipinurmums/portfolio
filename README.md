# Aron Belle Portfolio V2

A clean, mobile-first rebuild using bespoke layouts for each shoot.

## Included order

1. Runway
2. World Cup
3. Esmee
4. Timmy
5. Tux
6. Digis
7. Contact

## Specific art direction included

- `runway-02` is the opening hero.
- `world-cup-03` is tightly cropped to the face and upper shoulders on the
  homepage, while the fullscreen viewer shows the complete original.
- `world-cup-05` is included before the final World Cup landscape photograph.
- `esmee-03` is removed.
- `esmee-02` is a large standalone image.
- `esmee-06` is a large focal image with equal site margins.
- `timmy-02` keeps its crop size but is aligned to the top.
- Digis are at the bottom.

## Install

Replace the contents of the existing GitHub repository with everything inside
this folder, then commit and push through GitHub Desktop.

## Contact details

Before publishing, edit:

```text
data/portfolio.json
```

Replace the placeholder email and Instagram URL.

## Image order and crops

Image order and crop positions live in:

```text
data/portfolio.json
```

Most layout sizing lives in:

```text
css/layouts.css
```

The fullscreen viewer deliberately ignores homepage crops.
