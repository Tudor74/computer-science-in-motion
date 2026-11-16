# Biology In Motion

A single-file, offline HTML page that tells the story of biology in historical order: cells, evolution, heredity, the molecules of life, energy and chemistry, ecosystems, bodies and disease, and reading and writing life. In Try it you steer the simulations (selection, crosses, enzymes, predators and prey, epidemics, Turing patterns) and rerun classic experiments. Popular myths are corrected and contested findings labelled.

This is the `biology` branch of the [Computer Science In Motion](https://github.com/Tudor74/computer-science-in-motion) repository. It shares its engine with CS (`main`), HCI (`hci`), Physics (`physics`), Music (`music`), Mind (`mind`) and Ted Nelson (`nelson`), and is part of the [In Motion](https://in-motion.puter.site) family.

## Route

1. **Cells** (1665–1900): microscopes, cell theory, surface and volume, diffusion and osmosis, cell division, germ theory
2. **Evolution** (1830–1930): deep time, natural selection, artificial selection, sexual selection, speciation, finches' beaks
3. **Heredity** (1866–1950): Mendel's crosses, Punnett squares, chromosomes and linkage, Hardy–Weinberg, genetic drift, quantitative traits
4. **The molecules of life** (1944–1970): the double helix, replication, transcription and translation, the genetic code, gene regulation, mutation
5. **Energy and chemistry** (1900–1980): enzymes, membranes and pumps, photosynthesis, respiration and ATP, homeostasis, scaling laws
6. **Ecosystems** (1920–1980): logistic growth, predators and prey, competition and niches, food webs, island biogeography, nutrient cycles
7. **Bodies and disease** (1880–today): the immune system, epidemics, vaccines and herd immunity, morphogenesis, the heart, the microbiome
8. **Reading and writing life** (1977–today): sequencing, phylogenetic trees, CRISPR, evolution in the lab, antibiotic resistance, the origins of life

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
