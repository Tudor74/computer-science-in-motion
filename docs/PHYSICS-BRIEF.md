# Physics In Motion: brief for era authors

Physics In Motion uses the shared In Motion engine on branch `physics` (`src/core.js`, `src/app.js`, `src/shell.html`). It is the same engine as HCI In Motion, with the research line, `ctx.later`/`ctx.every` timers and threads.

It tells physics in historical order. The learner reruns the classic experiments in Try it, and their results are drawn beside the original finding.

Read `docs/HCI-BRIEF.md` for the general rules; this brief adds physics-specific rules and the route. For the coding pattern, read reference scenes on other branches, for example `git show hci:src/scenes-2-pointing.js` (Fitts experiment) and `git show main:src/scenes-4-search.js`.

## The route: fixed lesson ids

Each lesson id is also the id of the lesson's first scene. Cross-era `prior` and `THREAD` entries may use any id below.

| Era (stage id) | Lessons |
| --- | --- |
| 1 `motion` 1600s | position-speed, acceleration, galileo-ramp, free-fall, projectiles, relative-motion |
| 2 `forces` 1600s–1700s | newton-laws, friction, circular-motion, gravitation, kepler-orbits, fluids |
| 3 `energy` | work-energy, energy-conservation, momentum, collisions, oscillations, rotation, symmetry-conservation |
| 4 `waves` | wave-basics, superposition, standing-waves, sound, doppler, resonance |
| 5 `light` | reflection-refraction, lenses, colour-spectrum, double-slit, diffraction-polarisation, speed-of-light |
| 6 `fields` | electric-charge, electric-field, circuits, magnetism, induction, electromagnetic-waves |
| 7 `heat` | temperature-heat, kinetic-theory, brownian-motion, entropy, heat-engines, phase-changes |
| 8 `modern` | special-relativity, general-relativity, atomic-nucleus, photoelectric-effect, atomic-spectra, quantum-interference, radioactivity, open-questions |

## Files and naming

- **Files you own:** `src/scenes-N-<era>.js`, `src/scenes-N-lessons.js` and `src/scenes-N-words.js`.
- **Prefixes:** top-level helper names use `PN_` (for example `P1_`).
- **Scene ids:** `<lesson-id>-<word>`.
- **Off limits:** do not edit the engine, the tests, `curriculum.js` or other eras' files.
- **Scenes per lesson:** 3, or 4 where the topic is rich.
- **`LESSON` fields:** `id`, `name`, `short` (14 characters or fewer), `stage`, `year`, `why`, `prior`, `level`, `references` and `ids`. Register lessons in route order.

## Physics rules

**Deterministic simulation.** Integrate with a fixed time step (for example 1/120 s, semi-implicit Euler or velocity Verlet). Make each scene a pure function of its state and lesson time, so Watch, rewind and Try it all agree. For long Watch scenes, precompute a trajectory in `trace` or cache it per state. Never use `Math.random`; use `rng()`, `shuffled()` or `nextSeed()`.

**Units and idealisations.**
- Every quantity shows SI units.
- Label idealisations on the diagram or in the caption: no air resistance, frictionless, point mass, small-angle.
- Constants are correct to the precision shown.
- Equations are correct. Check limiting cases yourself, for example period independent of amplitude only at small angles, and range maximal at 45° only on level ground with no drag.

**Rerun the experiment.** Where it fits, Try it lets the learner run the historical experiment and compares their data with the published result. Use `ctx.later` and `ctx.every` for timing and `performance.now()` for measuring. Examples by era:

| Era | Experiments |
| --- | --- |
| 1 | Galileo's inclined plane (distance ∝ t² with bells at equal times), dropping a hammer and a feather in air and in vacuum |
| 2 | Newton's cannon, Cavendish's torsion balance |
| 3 | Joule's paddle wheel, Huygens's pendulum clock |
| 4 | Chladni plates, Doppler with a moving source |
| 5 | Newton's two-prism experiment, Young's slits, Rømer's moons of Jupiter, Fizeau's toothed wheel |
| 6 | Ørsted's compass, Faraday's moving magnet |
| 7 | Brownian motion: Einstein's mean square displacement against time |
| 8 | Michelson–Morley's null result, Rutherford's scattering counts against angle, the photoelectric stopping voltage against frequency (Millikan 1916), single photons building an interference pattern |

**History and research.** Every scene has a `research` line naming the original work: `'Galileo (1638). Two New Sciences.'`. Cite only real work you are confident exists. Be honest about legends and corrections:
- Galileo probably did not drop balls from the Leaning Tower of Pisa as a demonstration.
- Newton's apple is an anecdote he told late in life.
- Tacoma Narrows was aeroelastic flutter, not simple resonance.
- Eddington's 1919 measurements were less precise than first claimed, and later eclipse results confirmed the prediction.

Give credit to the people often left out, for example Émilie du Châtelet (vis viva), Emmy Noether, Lise Meitner, Vera Rubin, Chien-Shiung Wu, Ibn al-Haytham (optics) and Ole Rømer.

**3D.** Use `three()` where depth helps: orbits, fields around a wire, polarisation, wavefronts, spacetime curvature. That means at most one or two scenes per era; eras 2, 6 and 8 may use more.

**Text.** Use en-GB. Keep text at 13 units or larger and inside the 600×380 drawing. Use `T`, `TB` and `TM` normally, and `TF`, `TBF` and `TMF` for tightly packed labels.

## Glossary

Add `WORD` entries for key terms, and for the people your era introduces, with key `person-<surname>`. Run `grep -h "key:'" src/scenes-*-words.js` before adding a concept key. People are owned as follows:

| Era | People |
| --- | --- |
| 1 | Galileo, Aristotle, Oresme |
| 2 | Newton, Kepler, Brahe, Cavendish, Archimedes, Pascal, Torricelli |
| 3 | Huygens, Hooke, Joule, du Châtelet, Noether, Leibniz |
| 4 | Doppler, Chladni, Mersenne |
| 5 | Ibn al-Haytham, Snell, Young, Fresnel, Rømer, Fizeau, Foucault |
| 6 | Coulomb, Volta, Ørsted, Ampère, Faraday, Ohm, Maxwell, Hertz |
| 7 | Carnot, Clausius, Boltzmann, Brown, Perrin, Kelvin |
| 8 | Einstein, Michelson, Lorentz, Eddington, Rutherford, Bohr, Planck, Millikan, Curie, Meitner, Wu, Rubin, Feynman |

## Build and test your era only

```sh
S=/tmp/claude-0/-home-user-computer-science-in-motion/7e28ded3-3dbc-5cc3-810c-b1bae2c3d852/scratchpad
cd /home/user/computer-science-in-motion
STAGES=N OUT=$S/pN.html python3 build.py
FILE=$S/pN.html SHOTS=$S/shots-pN ALLSHOTS=1 SAMPLE=<one id> timeout 900 node test/check.js
FILE=$S/pN.html timeout 900 node test/text-layout.js 375
FILE=$S/pN.html SHOTS=$S/shots-pN timeout 300 node test/three.js
```

Then:
- Look at every `try-*.png` and `three-*.png` and fix overlaps, clipping and unreadable layouts.
- Check one or two of your simulations numerically against the analytic answer, for example the pendulum period or projectile range.
- Write scripts with the Write tool, not shell heredocs containing JS.
- Never delete files, and do not commit. The branch is `physics`; stay on it.

**Final report:** for each lesson, list its scene ids with one line each: "interaction — why — research cited". Then list any 3D scenes, the numerical checks you ran, and problems left.
