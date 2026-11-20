# Levin Lab In Motion

A single-file, offline HTML page on the research of Michael Levin's lab at the Allen Discovery Center at Tufts University, and the work it builds on: bioelectricity in every cell, left and right in the embryo, regenerating planaria, frog faces, eyes and tails, cancer and the brain, xenobots, basal cognition, and the tools and open questions at the frontier. In Try it you run simplified models of the experiments (a cell's voltage set by pumps and channels, voltages spreading through gap junctions, a worm fragment regrowing after a brief block, a xenobot body evolved in a toy simulator), every number on screen is computed by the model, and the published result is shown beside it. Every claim carries a visible label: replicated finding, single-lab finding, framework or hypothesis, speculation, or criticism and debate. Animal work is described plainly, and nothing here is medical advice or a human treatment.

This is the `levin` branch of the [Computer Science In Motion](https://github.com/Tudor74/computer-science-in-motion) repository, sharing its engine with the other In Motion courses, and part of the [In Motion](https://in-motion.puter.site) family.

**Status: scaffold.** The route, the era files and the brief are in place; each lesson currently shows one placeholder card until its era is written (see `docs/LEVIN-BRIEF.md`).

## Route

1. **Bioelectricity before the lab**: voltage in every cell, early bioelectricity (Galvani, Burr, Lund), the vibrating probe, voltage dyes, gap junctions, instructive and permissive signals
2. **Left and right**: body asymmetry, the chick left–right gene cascade, ion flux before genes, serotonin, the gap-junction model, the cilia-flow debate
3. **Planaria**: worms that regrow, two-headed worms, patterns that persist through later cuts, heads of other species, adapting to barium, memory after decapitation
4. **Frog faces, eyes and tails**: the electric face, eyes outside the head, tail regeneration, a sodium pulse, "Picasso" tadpoles, an adult frog leg regrown
5. **Cancer and the brain**: voltage and cell division, instructor cells, tumours held back by hyperpolarisation, cells that stop communicating, rescuing brain development, cancer and the boundary of self
6. **Xenobots**: designed in a computer, evolution in simulation, self-assembled xenobots, kinematic replication, anthrobots, organism or robot
7. **Basal cognition**: basal cognition, the TAME framework, the cognitive light cone, navigating morphospace, learning in gene networks, the debate over cognition
8. **Tools and open questions**: simulating bioelectricity, ion-channel drugs, reading and writing the bioelectric code, what other labs have confirmed, open questions, a space of forms

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
| `docs/LEVIN-BRIEF.md` | The brief for era authors: fixed lesson ids, lesson notes, the evidence labels, the verification and computed-numbers rules, safety and honesty rules, test commands. It refers to the HCI, Mind, Music and Biology briefs beside it |
