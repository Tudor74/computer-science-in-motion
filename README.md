# Music In Motion

A single-file, offline HTML page that tells the story of music and its science in historical order: ratios on a string, notation, harmony, keys and form, the science of timbre, rhythm around the world, recording and electronic sound, and what the mind does with it all. Try it plays real sound through the browser's own synthesiser, and in the last era you take part in classic listening experiments.

This is the `music` branch of the [Computer Science In Motion](https://github.com/Tudor74/computer-science-in-motion) repository. It shares its engine with CS (`main`), HCI (`hci`) and Physics (`physics`), and is part of the [In Motion](https://in-motion.puter.site) family.

- Open `index.html` in any modern browser. It needs no network, no samples and no libraries.
- Sound plays only when you press something, and the **Sound on/off** switch mutes everything. Every scene also reads well with the sound off.

## Route

1. **Sound and number** (antiquity): pitch and frequency, the monochord, the harmonic series, consonant ratios, Pythagorean tuning, pentatonic scales
2. **Writing music down** (500–1600): neumes and the staff, solmisation, note values, modes, canon and round, polyphony
3. **Harmony** (1600–1750): intervals, triads and chords, cadences, counterpoint, temperament, the circle of fifths
4. **Keys, form and the orchestra** (1750–1900): major and minor, modulation, motif, sonata form, theme and variation, orchestration
5. **The science of timbre**: Fourier and timbre, envelopes, resonant instruments, the ear, loudness, voice and formants
6. **Rhythm around the world**: beat and metre, syncopation, polyrhythm, Euclidean rhythms, swing and groove, rhythmic cycles
7. **Recording and electronic sound** (1877–): the phonograph, microphones and speakers, tape music, synthesis, digital audio, MIDI and sequencing
8. **Music and the mind**: the missing fundamental, consonance and roughness, expectation, music and emotion, keeping the beat, auditory illusions

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
