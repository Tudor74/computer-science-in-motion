# Mind In Motion

A single-file, offline HTML page that tells the story of the scientific study of the mind in historical order: measuring sensation, learning, the mind as information, memory, the brain at work, judgement and reasoning, minds among others, and today's models of mind. In Try it you are the participant in classic experiments, and your own results are drawn beside the published findings. Studies that failed to replicate are labelled as such.

This is the `mind` branch of the [Computer Science In Motion](https://github.com/Tudor74/computer-science-in-motion) repository. It shares its engine with CS (`main`), HCI (`hci`), Physics (`physics`) and Music (`music`), and is part of the [In Motion](https://in-motion.puter.site) family.

- Open `index.html` in any modern browser. It needs no network, and no data you produce leaves the page.

## Route

1. **Measuring the mind** (1830–1900): Weber's law, Fechner's scaling, reaction time, mental chronometry, localisation, the neuron doctrine
2. **Learning and behaviour** (1885–1950): the forgetting curve, classical conditioning, the law of effect, schedules of reinforcement, cognitive maps, Gestalt grouping
3. **The mind as information** (1948–1975): channel capacity, chunking, selective attention, signal detection, mental rotation, visual search
4. **Memory**: working memory, serial position, encoding and context, reconstructive memory, the spacing effect, the testing effect
5. **The brain at work**: the action potential, Hebbian synapses, receptive fields, the split brain, brain imaging, plasticity
6. **Judgement and reasoning**: anchoring, availability and representativeness, loss aversion, base rates, the selection task, dual-process theories
7. **Minds among others**: conservation, theory of mind, conformity, obedience, cognitive dissonance, the replication crisis
8. **Models of mind**: the perceptron, prediction error, Bayesian perception, predictive processing, embodied cognition, consciousness

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
