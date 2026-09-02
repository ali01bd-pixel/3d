# ALI STUDIO — Vibrant Poster & 3D Design Generator

A pure HTML/CSS/JavaScript SVG generator, upgraded from the supplied version.

## Included
- 1–12 designs per collection
- Vibrant gradient themes with automatic per-design color variation
- 7 design families: Vibrant Mix, Liquid Flow, Glass Orbs, Geometric Prism, Organic Forms, Editorial Waves, Minimal Geometry
- Flat mode or optional **3D Depth** mode
- SVG lighting, blur, gradient and shadow effects; artwork remains vector-based
- Portrait / square / landscape formats
- Standard / Large / XL SVG output
- Per-design SVG download and copy SVG markup
- Combined collection SVG download
- Save current settings as JSON
- Seeded repeatable generation
- Responsive dark editor UI
- No backend required; everything runs in-browser

## Run locally
Open `index.html` directly in a modern browser, or use a static server:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Files
- `index.html` — application structure and controls
- `styles.css` — redesigned vibrant editor UI
- `app.js` — dynamic SVG generation engine and 3D/flat rendering

## Blue Editorial Reference Mode

A new `Blue Editorial Reference` design family is included. It rotates through five distinct blue/black editorial compositions:
1. Overlapping translucent circles
2. Soft vertical light beam
3. Stepped V-shaped wave
4. Fine contour/vortex lines
5. Nested ribbon arcs

The layouts are seeded so each generated poster remains repeatable while still varying position, scale and spacing. The existing Flat / 3D Depth control continues to work with this family.


## Pastel Editorial Reference Mode

A new `Pastel Editorial Reference` family is included, rotating through:
- rounded warm droplet bars
- concentric coral/orange/pink rings
- soft vertical gradient bars
- nested semicircular rainbow arcs
- diagonal multi-color stripes

It is designed to produce warm cream, coral, orange, pink and yellow editorial posters with varied compositions. The existing Flat / 3D Depth switch remains available.


## Red & Black Editorial Reference Mode

A new `Red & Black Editorial Reference` family is included:
- soft diagonal red gradient with nested curved bands
- layered folded red/black fan waves
- radial red/black ray composition
- abstract angular red/black shards
- dramatic cream/red starburst

This family is designed to produce high-contrast editorial poster variations inspired by the supplied reference image and remains compatible with Flat / 3D Depth rendering.


## Cyan Geometric Editorial Reference Mode

A new `Cyan Geometric Editorial Reference` family is included:
- modular translucent blocks
- tall vertical prism columns
- faceted radial geometry
- layered gradient ribbons
- nested semicircular orange/yellow arches

The palette combines cyan, sky blue, violet, pale cream and warm orange/yellow accents to match the supplied reference style while generating seeded variations.
