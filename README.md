# Chemistry In Motion

A single-file, offline HTML page that tells the story of chemistry in historical order: from alchemy to chemistry, atoms and weights, the periodic table, bonds and shapes, reactions, the chemistry of carbon, reading molecules, and modern chemistry. In Try it you do the chemistry on screen: weigh reactants on Lavoisier's balance, squeeze Boyle's tube, fill Mendeleev's gaps, build Lewis structures, push an equilibrium, titrate to an end point and read a spectrum. Myths are corrected and the ethics of chemistry stated plainly.

This is the `chemistry` branch of the [Computer Science In Motion](https://github.com/Tudor74/computer-science-in-motion) repository, sharing its engine with the other In Motion courses, and part of the [In Motion](https://in-motion.puter.site) family.

## Route

1. **From alchemy to chemistry** (400 BCE–1790): four elements, alchemy and distillation, Boyle's law, phlogiston, conservation of mass, the discovery of oxygen
2. **Atoms and weights** (1800–1870): Dalton's atoms, Avogadro, electrolysis, the ideal gas, flame spectra, atomic weights
3. **The periodic table** (1869–1932): the periodic table, noble gases, radioactivity, atomic number, isotopes, electron shells
4. **Bonds and shapes** (1916–1960): Lewis structures, ionic and covalent bonds, VSEPR shapes, orbitals and hybrids, hydrogen bonds, electronegativity
5. **Reactions** (1850–1950): reaction rates, equilibrium, acids and bases, redox and batteries, catalysis, free energy
6. **The chemistry of carbon** (1828–1970): carbon skeletons, functional groups, benzene and aromaticity, stereochemistry, polymers, total synthesis
7. **Reading molecules** (1900–today): chromatography, infrared spectroscopy, NMR, mass spectrometry, crystallography, titration
8. **Modern chemistry** (1950–today): semiconductors, nanomaterials, click chemistry, green chemistry, atmospheric chemistry, computational chemistry

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
