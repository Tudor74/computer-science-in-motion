# Techno In Motion: brief for era authors

Techno In Motion runs on the shared In Motion engine, on branch `techno`. It tells the history of techno in order and lets the learner **make the sounds**: program a drum machine, twist an acid line, morph between styles, beatmatch two decks. Every Try it scene should be playable and sound good at a gentle volume.

**Read first:**
- `docs/MUSIC-BRIEF.md`: the sound rules. `AUDIO` is called only from `on` handlers. Scenes must be understandable with sound off. Volumes stay gentle.
- `docs/HCI-BRIEF.md`: the general rules (research lines, honesty, `ctx.later`/`ctx.every`, text and 3D).

**Reference scenes:**
- `git show music:src/scenes-6-rhythm.js`: step sequencers, Euclidean rhythms, swing. Follow its playhead pattern: schedule sound with Web Audio `at` offsets and move the picture with `ctx.every`.
- `git show music:src/scenes-7-electric.js`: synthesis and MIDI.

Link to Music In Motion and Electronic Music In Motion with `SOURCE`, and do not re-teach their basics (what an oscillator is, what MIDI is).

## Sound engine (already in `src/core.js`)

Besides `AUDIO.tone`, `chord`, `seq` and `noise`, three voices were added for this course:
- `AUDIO.kick({at, from, to, decay, gain, click})`: a sine with a falling pitch. An 808 is long and low (decay about 0.6, to about 40). A 909 is shorter and punchier (decay about 0.3, from about 180).
- `AUDIO.hit({at, dur, gain, type, cutoff, q})`: filtered noise.
  - closed hat: highpass, 7–9 kHz, dur 0.04
  - open hat: dur 0.25
  - clap or snare: bandpass, 1–2 kHz, dur 0.12
- `AUDIO.acid(hz, {at, dur, gain, type, cutoff, env, res, decay, accent, slideFrom})`: a saw or square through a resonant low-pass with an envelope, for the TB-303 gesture.

All of them register with `AUDIO.stopAll()`.

**Loops.** Schedule one bar (or two) at a time from an `on` handler with `at` offsets, and re-arm with `ctx.every(barMs, 'tick')`. Nothing plays unless the learner pressed Play, and Stop really stops. Default tempos are 120–135 BPM. Never exceed the default master gain. Avoid harsh resonance: `res` ≤ 18.

Say in a caption that these are **simplified models** of the machines, not circuit emulations.

## The route: fixed lesson ids (8 eras × 4 lessons)

Each lesson id is also the id of its first scene. `prior` and `THREAD` may use any of these ids.

| Era (stage id) | Lessons |
| --- | --- |
| 1 `roots` | kraftwerk, moroder-sequencer, electro, chicago-house |
| 2 `detroit` | belleville-three, the-electrifying-mojo, afrofuturism, underground-resistance |
| 3 `machines` | tr-808, tr-909, tb-303, step-sequencer |
| 4 `berlin` | after-the-wall, tresor, minimal, berghain-era |
| 5 `rave` | acid-house-summer, free-parties, criminal-justice-act, after-rave |
| 6 `styles` | tempo-and-kick, acid, dub-techno, hard-and-industrial |
| 7 `craft` | beatmatching, eq-mixing, phrasing, arrangement |
| 8 `today` | global-scenes, credit-and-erasure, tools-today, groove-science |

### Lesson notes

**Era 1: roots**
- `kraftwerk`: Autobahn 1974, Trans-Europe Express 1977 and Computer World 1981, and the "man-machine" idea. Afrika Bambaataa's "Planet Rock" (1982) built on them.
- `moroder-sequencer`: "I Feel Love" (1977, Donna Summer, Moroder and Bellotte). A sequenced Moog bass with a delay, which the learner builds.
- `electro`: the 808 in hip-hop and electro. Cybotron's "Clear" (1983), with Juan Atkins and Rik Davis.
- `chicago-house`: Frankie Knuckles at the Warehouse, Ron Hardy, and Jesse Saunders' "On and On" (1984). Phuture's "Acid Tracks" (1987) leads into the 303.

**Era 2: detroit**
- `belleville-three`: Juan Atkins, Derrick May and Kevin Saunderson. Model 500's "No UFO's" (1985), "Strings of Life" (1987) and "Big Fun" (1988). The 1988 Virgin compilation "Techno! The New Dance Sound of Detroit" fixed the name. Cover Atkins's debt to Toffler's "The Third Wave" ("techno rebels").
- `the-electrifying-mojo`: the radio DJ Charles Johnson and his eclectic late-night shows, as the shared influence. Also the city: deindustrialisation, the car plants, and the Black middle-class suburb of Belleville.
- `afrofuturism`: techno as Black futurist music. Drexciya's myth. The term is Mark Dery's (1993); Kodwo Eshun wrote "More Brilliant Than the Sun". Present the artists' own framing respectfully.
- `underground-resistance`: Mike Banks, Jeff Mills and Robert Hood. Independence, anonymity, Submerge. Robert Hood's "Minimal Nation" (1994) leads to minimal.

**Era 3: machines**
- `tr-808`: 1980, analogue. It was a commercial failure, then cheap second-hand, which is how it reached these producers. The long kick.
- `tr-909`: 1983, analogue drums with sampled hats, shuffle, accent. The learner programs a four-on-the-floor pattern with off-beat open hats.
- `tb-303`: 1981, sold as a bass accompanist, a failure repurposed. Cutoff, resonance, envelope, accent and slide all playable.
- `step-sequencer`: 16 steps, pattern chaining, and swing as a delay of every second 16th.

**Era 4: berlin**
- `after-the-wall`: 1989, empty buildings in the East, legal grey zones. Ufo and Planet. The Love Parade (1989; 150 people the first year).
- `tresor`: 1991, the vault of the former Wertheim department store. Dimitri Hegemann. The Detroit–Berlin axis (X-101, Jeff Mills, Blake Baxter).
- `minimal`: Robert Hood, Basic Channel (Moritz von Oswald and Mark Ernestus), Richie Hawtin's Plastikman, Ricardo Villalobos. Less is the point: the learner removes elements and hears what remains.
- `berghain-era`: Ostgut then Berghain (2004). Long sets, sound-system design, the no-photo policy. In 2024 Germany added Berlin techno culture to its national intangible cultural heritage list, via the German UNESCO commission.

**Era 5: rave**
- `acid-house-summer`: 1987–89. Shoom (Danny Rampling), the Haçienda, the "Second Summer of Love", the smiley. The link to Ibiza. Treat drug history factually and briefly; MDMA was part of the scene, with no glamour and no instruction.
- `free-parties`: sound systems (Spiral Tribe, DiY) and Castlemorton, 1992.
- `criminal-justice-act`: the Criminal Justice and Public Order Act 1994, section 63: "sounds wholly or predominantly characterised by the emission of a succession of repetitive beats". Autechre's "Flutter" as a response. The learner can make a pattern that never repeats exactly.
- `after-rave`: superclubs, jungle and drum and bass splitting off, and the hardcore continuum (Simon Reynolds's idea, labelled as his).

**Era 6: styles**

Each style is a setting of parameters the learner morphs. Give typical ranges and label them approximate.
- `tempo-and-kick`: BPM ranges by style, and kick length and pitch.
- `acid`: the 303 line as the lead.
- `dub-techno`: chords through delay and filter. Basic Channel and Chain Reaction. The learner sets delay time and feedback.
- `hard-and-industrial`: distortion, faster tempos, gabber's link. Today's hard-techno revival.

**Era 7: craft**
- `beatmatching`: two decks at slightly different BPM. The learner nudges pitch until the kicks align, by ear and by a phase meter.
- `eq-mixing`: swap the bass between two tracks.
- `phrasing`: 16- and 32-bar phrases and mixing on the phrase.
- `arrangement`: intro, build, break, drop, outro as layers on a timeline. Tension as filter and density.

**Era 8: today**
- `global-scenes`: Tbilisi (Bassiani and the 2018 protests), Kyiv, Johannesburg and Durban (gqom as a neighbour), Bogotá, Tokyo, Detroit's Movement festival.
- `credit-and-erasure`: techno's Black origins, often written out of European accounts. Women and queer and trans pioneers and artists: Kelli Hand (K-Hand, "first lady of Detroit techno"), DJ Minx, Ellen Allien, Miss Djax, Paula Temple, Honey Dijon, The Blessed Madonna, female:pressure's FACTS surveys on festival line-ups (use their published percentages and label the year). Name living people only for their documented public work.
- `tools-today`: laptops, Ableton Live (2001), modular revival, and hardware clones.
- `groove-science`: why bodies move. Witek et al. 2014 found an inverted U between syncopation and the wish to move. Entrainment (link to Mind and Music In Motion). Bass and movement: Hove et al. 2014, and the Cameron et al. 2022 very-low-frequency study. Give the evidence strength honestly.

## Files and naming

- **Files you own:** `src/scenes-N-<stageid>.js`, `src/scenes-N-lessons.js` and `src/scenes-N-words.js`.
- **Helper prefix:** top-level helpers start `XN_` (for example `X3_`).
- **Scene ids:** `<lesson-id>-<word>`.
- **Scenes per lesson:** 3, or 4 where the topic is rich.
- **Do not edit:** the engine, the tests, `curriculum.js`, or other eras' files.
- **Order:** register lessons in route order.

## Rules

- **No copyrighted material.**
  - Never reproduce a real track's melody, bassline or lyrics. Make original patterns in the style, and describe real tracks in words.
  - No logos, no label artwork, and no artist photographs or likenesses.
  - Machine drawings are generic panels, not copies of Roland's panel art.
- **Accuracy about people.**
  - Many of these people are alive. State only well-documented facts about their public work.
  - Do not invent quotes.
  - Where origin stories are contested (who was "first", who coined a term), give the versions and attribute them.
- **Research lines** cite real sources:
  - Dan Sicko, *Techno Rebels*
  - Simon Reynolds, *Energy Flash*
  - Tim Lawrence, *Love Saves the Day*
  - Brewster & Broughton, *Last Night a DJ Saved My Life*
  - Kodwo Eshun
  - Mark Butler, *Unlocking the Groove* (2006), for rhythm analysis
  - Felix Denk & Sven von Thülen, *Der Klang der Familie*
  - DeForrest Brown Jr., *Assembling a Black Counter Culture* (2022)
  - published papers for the science
- **Safety.**
  - Sound: gentle default volume and a visible Stop.
  - Light: no strobe or flashing above 3 per second. Club-light visuals must be slow fades.
- **3D:** only where depth helps: a club sound-system layout, a spectrogram surface, or the filter's cutoff × resonance response. At most one per era.

## Glossary

- Add `WORD` entries for key terms and people, with keys of the form `person-<surname>`.
- Check `grep -h "key:'" src/scenes-*-words.js` before adding.

## Build and test your era only

```sh
S=/tmp/claude-0/-home-user-computer-science-in-motion/7e28ded3-3dbc-5cc3-810c-b1bae2c3d852/scratchpad
cd /home/user/computer-science-in-motion
STAGES=N OUT=$S/xN.html python3 build.py
FILE=$S/xN.html SHOTS=$S/shots-xN ALLSHOTS=1 SAMPLE=<one id> timeout 900 node test/check.js
FILE=$S/xN.html timeout 900 node test/text-layout.js 375
FILE=$S/xN.html timeout 900 node test/text-layout.js 320
FILE=$S/xN.html SHOTS=$S/shots-xN timeout 300 node test/three.js
```

Then:
- Look at every `try-*.png` and `three-*.png`, and fix overlaps and clipping.
- Check the timing arithmetic: step length = 60 / BPM / 4, swing offsets, the beat frequency between two decks, and delay times in beats.
- Confirm every `AUDIO.` call sits in an `on` handler, and that Stop cancels the loop.
- Write scripts with the Write tool, not shell heredocs containing JS.
- Never delete files. Do not commit. Stay on branch `techno`.

**Final report:** for each lesson, list its scene ids with one line each: "interaction — what you hear — sources cited". Then give:
- the 3D scenes
- the timing checks
- the facts you are least sure of
- any problems left
