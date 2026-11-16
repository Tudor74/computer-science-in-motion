# Language In Motion

A single-file, offline HTML page that tells the story of how people have understood language, in historical order: writing, families and sound laws, structure, grammar, how children learn, meaning and use, language in society, and language machines. In Try it you build trees, apply sound laws, train tiny models, and take part in classic experiments with your results drawn beside the published ones. Myths are labelled and debates presented as open.

This is the `language` branch of the [Computer Science In Motion](https://github.com/Tudor74/computer-science-in-motion) repository, sharing its engine with the other In Motion courses, and part of the [In Motion](https://in-motion.puter.site) family.

## Route

1. **Writing** (3400 BCE–1500): clay tokens, logograms, the alphabet, decipherment, printing, scripts of the world
2. **Families and sound laws** (1786–1900): language families, the comparative method, Grimm's law, the Great Vowel Shift, phonetics and the IPA, language trees
3. **Structure** (1916–1960): Saussure's sign, phonemes, morphology, Zipf's law, redundancy and entropy, linguistic relativity
4. **Grammar** (1957–2000): syntax trees, recursion, formal grammars, garden paths, universals, sign languages
5. **Learning language**: infant perception, statistical learning, word learning, critical periods, bilingualism, the reading brain
6. **Meaning and use**: reference and sense, implicature, speech acts, metaphor, colour terms, turn-taking
7. **Language in society**: variation, the S-curve of change, contact and creoles, endangered languages, accents and attitudes, world Englishes
8. **Language machines**: machine translation, n-grams, word embeddings, attention, large language models, the understanding debate

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
