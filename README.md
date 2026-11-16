# Tripitaka In Motion

A single-file, offline HTML page on the history of the Buddhist canon (the Tripitaka, "three baskets"), in historical order: spoken teaching, the three baskets, the councils and Ashoka, writing it down, translation into Chinese, the Tibetan and other canons, printing, and the canon today. It is a history of a body of texts, not religious instruction. In Try it you see how group recitation keeps a text stable, place texts in their baskets, follow a passage across languages, and print a woodblock page. Every scene says whether it shows a traditional account, an established finding, or something scholars debate, and each tradition is described in its own terms.

This is the `tripitaka` branch of the [Computer Science In Motion](https://github.com/Tudor74/computer-science-in-motion) repository, sharing its engine with the other In Motion courses, and part of the [In Motion](https://in-motion.puter.site) family.

## Route

1. **Spoken teaching**: oral recitation, memory techniques, the reciters, the languages of the teaching
2. **The three baskets**: the three baskets, the Vinaya, the Suttas, the Abhidhamma
3. **Councils and Ashoka**: the first council, the second council and the schools, Ashoka's edicts, dating the Buddha
4. **Writing it down**: palm leaf, the Gandhāran scrolls, the commentaries, the Sanskrit canons
5. **Into Chinese**: the first translations, Kumārajīva, Xuanzang, the catalogues
6. **Tibetan and other canons**: Tibetan translation, the Kangyur and Tengyur, comparing canons, Mongolian and Manchu canons
7. **Printing**: the Diamond Sūtra of 868, the Song editions, the Tripitaka Koreana, royal editions
8. **The canon today**: the Pali Text Society, the Taishō edition, digital canons, parallels and new finds

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
