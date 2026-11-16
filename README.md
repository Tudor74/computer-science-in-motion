# Ted Nelson In Motion

A single-file, offline HTML page that follows Ted Nelson's ideas in the order he had them: Bush's memex and a student's index cards, the naming of hypertext, the first systems at Brown, Computer Lib, Xanadu's design, the web that won instead, ZigZag and OpenXanadu, and what research says about reading hypertext today. In Try it you build each structure yourself: a trail, a zippered list, a transclusion, a two-way link, a link that rots.

This is the `nelson` branch of the [Computer Science In Motion](https://github.com/Tudor74/computer-science-in-motion) repository. It shares its engine with CS (`main`), HCI (`hci`), Physics (`physics`), Music (`music`) and Mind (`mind`), and is part of the [In Motion](https://in-motion.puter.site) family.

## Route

1. **Before hypertext** (1945–1960): the memex, associative trails, non-sequential writing, index cards
2. **Naming hypertext** (1960–1965): coining hypertext, zippered lists, hypermedia, version history
3. **The first systems** (1967–1974): HES at Brown, Engelbart's demo, FRESS, stretchtext
4. **Computer Lib** (1974): Computer Lib, Dream Machines, fantics, thinkertoys
5. **Xanadu's design** (1981–1992): transclusion, two-way links, transcopyright, tumblers
6. **The web arrives** (1989–2000): web against Xanadu, link rot, embedded markup, the curse of Xanadu
7. **Later structures** (1995–2014): ZigZag, Xanadu Space, OpenXanadu, parallel documents
8. **Reading and legacy**: reading hypertext, backlinks, content addressing, deep interconnection

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
