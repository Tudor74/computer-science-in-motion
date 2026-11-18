# Brain In Motion

A single-file, offline HTML page on how the brain works and how that was found out, in the order of discovery: the neuron, the synapse, maps of the brain, movement, development and plasticity, brain states, disorders, and the tools at the frontier. In Try it you run the classic preparations as simulations (ion gradients, an axon, a reflex, prism adaptation), read the classic records, and see your results beside the published ones. Contested claims are labelled as contested. Safety rules apply throughout: nothing is medical advice, no on-screen test is a diagnosis, no fast flicker, and gentle volumes.

This is the `brain` branch of the [Computer Science In Motion](https://github.com/Tudor74/computer-science-in-motion) repository, sharing its engine with the other In Motion courses, and part of the [In Motion](https://in-motion.puter.site) family.

**Status:** all eight eras are written: 48 lessons, 173 scenes. A correctness review is still to come.

## Route

1. **The neuron**: animal electricity, the neuron doctrine, the resting potential, the action potential, myelin and conduction, glia
2. **Synapses**: the synapse, quantal release, excitation and inhibition, neurotransmitters, receptors and drugs, neuromodulation
3. **Mapping the brain**: localisation, maps of the cortex, the split brain, brain imaging, lesion cases, the connectome
4. **Movement**: the motor cortex, spinal reflexes, pattern generators, the cerebellum, the basal ganglia, population coding
5. **Development and plasticity**: wiring up, critical periods, Hebb and LTP, changing maps, neurogenesis, the adolescent brain
6. **Brain states**: the circadian clock, sleep stages, arousal systems, reward and dopamine, the stress response, hunger and homeostasis
7. **When things go wrong**: stroke, epilepsy, Parkinson's disease, Alzheimer's disease, depression and its treatments, addiction
8. **Tools and frontiers**: the patch clamp, optogenetics, place and grid cells, brain–computer interfaces, recording many neurons, brains and AI

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
| `docs/BRAIN-BRIEF.md` | The brief for era authors: fixed lesson ids, lesson notes, safety and honesty rules, test commands. It refers to the HCI, Mind and Music briefs beside it |
