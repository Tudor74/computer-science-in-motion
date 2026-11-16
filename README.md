# Senses In Motion

A single-file, offline HTML page on how human vision, hearing, smell and touch work, two eras each, then the senses together. Within each sense the story follows the order of discovery from the organ to the brain. In Try it you take part where a screen allows it (illusions, colour matching, hearing and localisation with headphones, the McGurk effect, home smell and touch tests) and see your results beside the published ones. Safety rules apply throughout: no fast flicker, gentle volumes, and no screen test is a diagnosis.

This is the `senses` branch of the [Computer Science In Motion](https://github.com/Tudor74/computer-science-in-motion) repository, sharing its engine with the other In Motion courses, and part of the [In Motion](https://in-motion.puter.site) family.

## Route

1. **The eye**: optics, photoreceptors, dark adaptation, trichromacy, opponent colour, colour blindness
2. **Seeing**: lateral inhibition, depth and stereo, motion, illusions, faces, the blind spot
3. **The ear**: outer and middle ear, the cochlea, hair cells, the range of hearing, hearing loss, cochlear implants
4. **Listening**: localisation, auditory scenes, speech perception, pitch, masking, hearing in noise
5. **Smell**: odorant receptors, the olfactory bulb, thresholds, mixtures, smell and memory, smell loss
6. **Taste and flavour**: five tastes, retronasal smell, pheromones, smell and emotion, smell training, how many smells
7. **Touch**: skin receptors, acuity, vibration, pain, temperature, proprioception
8. **Senses together**: multisensory integration, the rubber hand, synaesthesia, sensory substitution, ageing, affective touch

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
