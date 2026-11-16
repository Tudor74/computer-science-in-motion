# Abiogenesis In Motion

A single-file, offline HTML page on how life might have begun, told in historical order: the fall of spontaneous generation, life's chemistry, the early Earth, the RNA world, metabolism-first ideas, the first cells, the last common ancestor, and the search for life elsewhere. Every scene says whether its idea has been demonstrated, is plausible, or is speculative: after the first era, almost all of this is open science.

This is the `abiogenesis` branch of the [Computer Science In Motion](https://github.com/Tudor74/computer-science-in-motion) repository, sharing its engine with the other In Motion courses, and part of the [In Motion](https://in-motion.puter.site) family.

## Route

1. **Spontaneous generation** (350 BCE–1862): Aristotle, Redi's flies, Needham and Spallanzani, Pasteur and Pouchet
2. **Life's chemistry** (1828–1970): Wöhler's urea, Oparin and Haldane, Miller–Urey, meteorite chemistry
3. **The early Earth**: the Hadean, the oldest evidence of life, the bombardment timeline, panspermia
4. **An RNA world?**: ribozymes, replicators, the error threshold, nucleotide synthesis
5. **Metabolism first?**: hydrothermal vents, the iron–sulphur world, autocatalytic sets, proton gradients
6. **The first cells**: coacervates, protocells, membrane growth, chirality
7. **The last common ancestor**: LUCA, the origin of the genetic code, rooting the tree, the origins of viruses
8. **Life elsewhere**: habitable zones, icy moons, biosignatures, defining life

## Source layout

`index.html` is generated. Edit the files in `src/` and rebuild:

```sh
python3 build.py              # writes index.html
node test/check.js            # every scene in Watch and Try it: console errors, overflow, screenshots
node test/three.js            # 2D/3D toggle on every 3D scene
node test/slider.js           # time slider behaviour
node test/text-layout.js 375  # phone text scale: labels stay inside the drawing and do not collide
node test/timed.js            # timed experiments: delayed replies arrive, and stop when you leave
node test/threads.js          # map connections: merged by name, "Other connection" switches
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
| `docs/MUSIC-BRIEF.md` | The brief for era authors: fixed lesson ids, sound, notation and citation rules, test commands |
