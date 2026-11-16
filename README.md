# Physics In Motion

A single-file, offline HTML page that tells physics in historical order: Galileo's ramps, Newton's laws and gravity, energy and momentum, waves, light, electricity and magnetism, heat and entropy, relativity, atoms and quanta. In Try it you rerun the classic experiments, and your results appear beside the originals.

This is the `physics` branch of the [Computer Science In Motion](https://github.com/Tudor74/computer-science-in-motion) repository and shares its engine with the CS page (`main`) and HCI In Motion (`hci`). It is part of the [In Motion](https://in-motion.puter.site) family.

- Open `index.html` in any modern browser. It needs no network and no libraries.
- **Watch** is deterministic: simulations use a fixed time step, so the same moment always shows the same picture, including when rewinding.
- **Research** lines name the original work, and say plainly where the popular story is a legend.

## Route

1. **Describing motion** (1600s): position and speed, acceleration, Galileo's ramp, free fall, projectiles, relative motion
2. **Forces and gravity** (1600s–1700s): Newton's laws, friction, circular motion, gravitation, Kepler's orbits, fluids
3. **Energy and momentum**: work and energy, conservation of energy, momentum, collisions, oscillations, rotation, symmetry and conservation (Noether)
4. **Waves and sound**: wave basics, superposition, standing waves, sound, the Doppler effect, resonance
5. **Light**: reflection and refraction, lenses, colour and the spectrum, the double slit, diffraction and polarisation, the speed of light
6. **Electricity and magnetism**: charge, the electric field, circuits, magnetism, induction, electromagnetic waves
7. **Heat and matter**: temperature and heat, kinetic theory, Brownian motion, entropy, heat engines, changes of phase
8. **Relativity, atoms and quanta**: special and general relativity, the nucleus, the photoelectric effect, atomic spectra, quantum interference, radioactivity, open questions

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
| `docs/PHYSICS-BRIEF.md` | The brief for era authors: fixed lesson ids, simulation and citation rules, test commands |
