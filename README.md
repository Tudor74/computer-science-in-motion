# Consciousness In Motion

A single-file, offline HTML page on the science and philosophy of consciousness: the question, the threshold of awareness, neural correlates, sleep and anaesthesia, the self, the rival theories, other minds, and machines. The field has no settled theory, so each theory is shown with what it predicts and what counts against it, and none is presented as the answer. In Try it you take part where a screen allows it (masking, bistable figures, inattentional and change blindness, attention and confidence tasks) and see your results beside the published ones. Safety rules apply throughout: no fast flicker, nothing is medical advice, and no data leaves the page.

This is the `consciousness` branch of the [Computer Science In Motion](https://github.com/Tudor74/computer-science-in-motion) repository, sharing its engine with the other In Motion courses, and part of the [In Motion](https://in-motion.puter.site) family.

**Status:** all eight eras are written: 48 lessons, 156 scenes. A correctness review is still to come.

## Route

1. **The question**: mind and body, what it is like, the easy and hard problems, the knowledge argument, zombies and functionalism, trusting reports
2. **At the threshold**: masking, blindsight, rivalry and bistable figures, inattentional blindness, change blindness, attention and awareness
3. **Neural correlates**: the search for correlates, the contrastive method, global ignition, recurrent processing, front or back of the brain, zap and zip
4. **Sleep, dreams and anaesthesia**: dreaming, lucid dreaming, anaesthesia, disorders of consciousness, split brains and unity, psychedelics
5. **The self**: body ownership, agency and will, the interpreter, mirror self-recognition, interoception, the self over time
6. **Theories**: global workspace, integrated information, higher-order theories, predictive processing, attention schema, adversarial collaboration
7. **Other minds**: animal consciousness, octopus minds, bees and insects, infants, markers of sentience, other people
8. **Machines and open questions**: the Turing test, the Chinese room, indicators for machines, machine self-report, illusionism and panpsychism, open questions

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
| `docs/CONSCIOUSNESS-BRIEF.md` | The brief for era authors: fixed lesson ids, lesson notes, course rules, test commands |
| `docs/*-BRIEF.md` | Briefs of earlier courses; the HCI, Mind and Music briefs hold the general, participant and sound rules |
