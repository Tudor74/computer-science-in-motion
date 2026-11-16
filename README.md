# Techno In Motion

A single-file, offline HTML page that tells the history of techno in order and lets you make the sounds: the roots in Kraftwerk, Moroder, electro and Chicago house; Detroit; the drum machines and the TB-303; Berlin; UK rave; the styles; DJ craft; and techno today with the science of groove. Every Try it scene plays through the browser's own synthesiser (simplified models, not circuit emulations): program a drum pattern, twist an acid line, beatmatch two decks. No real tracks are reproduced.

This is the `techno` branch of the [Computer Science In Motion](https://github.com/Tudor74/computer-science-in-motion) repository, sharing its engine with the other In Motion courses, and part of the [In Motion](https://in-motion.puter.site) family.

- Sound plays only when you press something, there is always a Stop, and the Sound on/off switch mutes everything.

## Route

1. **Roots** (1970–1984): Kraftwerk, Moroder's sequencer, electro, Chicago house
2. **Detroit** (1981–1992): the Belleville Three, the Electrifying Mojo, Afrofuturism, Underground Resistance
3. **The machines** (1980–1990): the TR-808, the TR-909, the TB-303, the step sequencer
4. **Berlin** (1989–2004): after the Wall, Tresor, minimal, the Berghain era
5. **UK and rave** (1987–1997): the acid house summer, free parties, the Criminal Justice Act, after rave
6. **Styles**: tempo and kick, acid, dub techno, hard and industrial
7. **DJ craft and arrangement**: beatmatching, EQ mixing, phrasing, arrangement
8. **Techno today**: global scenes, credit and erasure, tools today, the science of groove

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
