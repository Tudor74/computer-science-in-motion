# Dimensions In Motion

A single-file, offline HTML page on space beyond three dimensions and how it was understood: counting dimensions, hypercubes and polytopes, seeing the fourth dimension, surfaces, curvature, higher manifolds, high-dimensional surprises, and dimensions at work in science and data. In Try it you build, turn, slice and unfold the shapes yourself (a cube slid into a tesseract, a tesseract passing through 3-space, a square glued into a torus, an arrow carried round a curved surface), and every count and measurement on screen is computed from the shape, not typed in. Conjectures, open problems and unconfirmed physics (string theory, extra dimensions) are labelled as such.

This is the `dimensions` branch of the [Computer Science In Motion](https://github.com/Tudor74/computer-science-in-motion) repository, sharing its engine with the other In Motion courses, and part of the [In Motion](https://in-motion.puter.site) family.

**Status:** all eight eras are written: 48 lessons, 157 scenes. A correctness review is still to come.

## Route

1. **Counting dimensions**: coordinates, degrees of freedom, Flatland, shadows and projection, distance in n dimensions, what a dimension is
2. **Hypercubes and polytopes**: building the n-cube, counting its parts, simplices and cross-polytopes, the regular polytopes, the 24-cell, 120-cell and 600-cell, Euler's formula
3. **Seeing the fourth dimension**: slicing a tesseract, projections and Schlegel diagrams, rotation in four dimensions, unfolding nets, Hinton's cubes, stereographic projection
4. **Surfaces**: the idea of a manifold, gluing diagrams, the Möbius strip and orientability, the Klein bottle and projective plane, Euler characteristic and genus, classifying surfaces
5. **Curvature**: Gauss's remarkable theorem, non-Euclidean geometry, geodesics, Riemann's 1854 lecture, Minkowski spacetime, curvature from inside
6. **Higher manifolds**: three-manifolds you could live in, the Poincaré conjecture, Thurston's geometrisation, knots and the fourth dimension, exotic spheres, dimension four
7. **High-dimensional surprises**: the volume of the n-ball, most volume near the surface, nearly perpendicular random directions, sphere packing and kissing numbers, the curse of dimensionality, corners of the cube
8. **Dimensions at work**: configuration space, phase space, data in many dimensions, fractal dimension, topological data analysis, extra dimensions in physics

## Source layout

`index.html` is generated. Edit the files in `src/` and rebuild:

```sh
python3 build.py              # writes index.html
node test/check.js            # every scene in Watch and Try it: console errors, overflow, screenshots
node test/three.js            # 2D/3D toggle on every 3D scene
node test/slider.js           # time slider behaviour
node test/text-layout.js 375  # phone text scale: labels stay inside the drawing and do not collide
node test/threads.js          # map connections: merged by name, "Other connection" switches
node test/family.js           # In Motion family links in the header and footer
```

| File | Contents |
| --- | --- |
| `src/shell.html` | Markup and CSS |
| `src/core.js` | Scene API notes, interaction design note, palette, SVG and 3D helpers, `LESSON`/`THREAD`/`WORD`/`SOURCE` |
| `src/scenes-N-<era>.js` | Scenes for era N |
| `src/scenes-N-lessons.js` | Era N's lessons, sources and cross-links |
| `src/scenes-N-words.js` | Era N's glossary entries, including the people |
| `src/curriculum.js` | The eight eras and their header textures |
| `src/app.js` | Runtime: clock, Watch/Try it, 2D/3D, controls, local map, glossary |
| `docs/DIMENSIONS-BRIEF.md` | The brief for era authors: fixed lesson ids, lesson notes, the computed-numbers rule, safety and honesty rules, test commands. It refers to the HCI, Mind, Music and Physics briefs beside it |
