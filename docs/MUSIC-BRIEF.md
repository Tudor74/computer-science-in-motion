# Music In Motion: brief for era authors

Music In Motion uses the shared In Motion engine on branch `music`, which is the Physics engine plus sound. The course tells the history of music and its science in order. In Try it the learner hears what the diagram shows, and in the perception era they take part in classic listening experiments.

Read `docs/HCI-BRIEF.md` for the general rules (research lines, honesty about evidence, experiments with `ctx.later`, `ctx.every` and `performance.now()`, text and 3D rules). Read `docs/PHYSICS-BRIEF.md` for the rules on deterministic simulation. This brief adds the music-specific rules and the route. For reference scenes, see `git show physics:src/scenes-4-waves.js` (standing waves, beats, Doppler) and `git show hci:src/scenes-2-pointing.js` (a timed experiment).

## The route: fixed lesson ids

Each lesson id is also the id of the lesson's first scene. `prior` and `THREAD` entries may use any of these ids, across eras.

| Era (stage id) | Lessons |
| --- | --- |
| 1 `number` (antiquity) | pitch-frequency, monochord, harmonic-series, consonant-ratios, pythagorean-tuning, pentatonic-scales |
| 2 `notation` (500–1600) | neumes-staff, solmisation, note-values, modes, canon-round, polyphony |
| 3 `harmony` (1600–1750) | intervals, triads-chords, cadences, counterpoint, temperament, circle-of-fifths |
| 4 `form` (1750–1900) | major-minor, modulation, motif, sonata-form, theme-variation, orchestration |
| 5 `timbre` (1800s–1900s) | fourier-timbre, envelope, instrument-resonance, the-ear, loudness, voice-formants |
| 6 `rhythm` | beat-metre, syncopation, polyrhythm, euclidean-rhythms, swing-groove, rhythmic-cycles |
| 7 `electric` (1877–) | phonograph, microphones-speakers, tape-music, synthesis, digital-audio, midi-sequencing |
| 8 `perception` | missing-fundamental, consonance-roughness, expectation, music-emotion, beat-entrainment, auditory-illusions |

## Files and naming

- **Files you own:** `src/scenes-N-<era>.js`, `src/scenes-N-lessons.js` and `src/scenes-N-words.js`.
- **Helper names:** prefix top-level helpers with `MN_` (for example `M1_`).
- **Scene ids:** use `<lesson-id>-<word>`.
- **Scenes per lesson:** 3 (or 4 where the topic is rich).
- **Do not edit:** the engine, the tests, `curriculum.js` or other eras' files.
- **Lessons:** register them in route order.

## Music rules

### Sound

Use the engine's `AUDIO` (in `src/core.js`): `AUDIO.tone(hz, {dur, type, gain, at, partials})`, `AUDIO.chord`, `AUDIO.seq`, `AUDIO.noise`, `midiHz(m)` and `noteName(m)`.

- Play sound only from an `on` handler: a Try it button, or a press on a `hit()` target. That keeps a user gesture and keeps tests quiet.
- Never play sound from `draw()`, `watch()` or `trace()`.
- Pictures stay deterministic. A scene must make sense with the sound off, so the caption says what you would hear.
- Keep volumes at the default level or below.
- For timed sequences such as rhythms or melodies, schedule the notes with `AUDIO.seq` (Web Audio timing). Move the picture with `ctx.every` stepping a playhead in the state.
- Use 12-tone equal temperament unless the scene is about tuning. Frequencies must be correct (A4 = 440 Hz).

### Notation

- Draw staves, notes, clefs and rests from SVG primitives. Use no music fonts.
- Keep the notation readable: at least 13-unit text, with sufficient spacing.
- Use British terms (crotchet and quaver, with US quarter and eighth note named once), and en-GB spelling throughout.

### Breadth

Treat music as more than the Western classical canon. Where it fits, include Arabic maqam, Indian tala and raga, West African polyrhythm, Indonesian gamelan, the Cuban clave and Chinese pentatonic traditions, described respectfully and accurately. Name the women who are often left out: Hildegard of Bingen, Fanny Mendelssohn, Clara Schumann, Daphne Oram, Delia Derbyshire, Wendy Carlos and Pauline Oliveros.

### Research and honesty

Each scene has a `research` line that cites real work. Be honest about weak or popular claims:
- The "Mozart effect" did not replicate as popularly claimed.
- The major-equals-happy, minor-equals-sad link is culturally shaped, not universal.
- Fletcher–Munson curves have been revised (ISO 226).
- Any formula for a "golden" proportion in music is contested.

### Experiments where the learner is the participant

- Pitch discrimination thresholds.
- Consonance ratings plotted against Plomp and Levelt's roughness curve (1965).
- Probe-tone ratings against Krumhansl and Kessler's key profiles (1982).
- Tapping to a beat, with the learner's asynchrony against Repp's reviews.
- Hearing a missing fundamental.
- The Shepard tone "endless" staircase.

Show the learner's data next to the published finding.

### 3D

Use 3D only where depth helps: a pitch helix (chroma and height), torus or Tonnetz harmony spaces, a spectrogram surface or vibration modes. Expect at most one or two per era.

## Glossary

Add `WORD` entries for key terms, and for the people your era introduces, with key `person-<surname>`. Before adding a concept key, check `grep -h "key:'" src/scenes-*-words.js` for existing ones. People are owned by era:

| Era | People |
| --- | --- |
| 1 | Pythagoras, Boethius, Mersenne |
| 2 | Guido of Arezzo, Hildegard of Bingen, Pérotin, Franco of Cologne |
| 3 | Zarlino, Rameau, Fux, Werckmeister, J. S. Bach |
| 4 | Haydn, Mozart, Beethoven, Fanny Mendelssohn, Clara Schumann, Berlioz |
| 5 | Fourier, Helmholtz, von Békésy, Fletcher, Sundberg |
| 6 | Toussaint, Arom, Bharata (the Natyashastra) |
| 7 | Edison, Berliner, Schaeffer, Oram, Derbyshire, Moog, Wendy Carlos, Max Mathews, Nyquist |
| 8 | Meyer, Huron, Plomp, Krumhansl, Shepard, Deutsch, Repp |

## Build and test your era only

```sh
S=/tmp/claude-0/-home-user-computer-science-in-motion/7e28ded3-3dbc-5cc3-810c-b1bae2c3d852/scratchpad
cd /home/user/computer-science-in-motion
STAGES=N OUT=$S/mN.html python3 build.py
FILE=$S/mN.html SHOTS=$S/shots-mN ALLSHOTS=1 SAMPLE=<one id> timeout 900 node test/check.js
FILE=$S/mN.html timeout 900 node test/text-layout.js 375
FILE=$S/mN.html SHOTS=$S/shots-mN timeout 300 node test/three.js
```

Then:
- Look at every `try-*.png` and `three-*.png`, and fix overlaps, clipping and unreadable notation.
- Check frequencies and ratios numerically.
- Confirm that no sound plays outside `on` handlers: `grep` your file for `AUDIO.` and check every call site.
- Write scripts with the Write tool, not shell heredocs containing JS.
- Never delete files, and do not commit. Stay on branch `music`.

**Final report:** for each lesson, list its scene ids with one line each: "interaction — why — research cited". Then list any 3D scenes, the numerical checks you ran, and any problems left.
