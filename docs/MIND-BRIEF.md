# Mind In Motion: brief for era authors

Mind In Motion uses the shared In Motion engine on branch `mind`, which is the Music engine, sound included. The course tells the history of the scientific study of the mind (psychology, cognitive science and neuroscience) in order. Its centre is the experiment: in Try it the learner *is the participant* in classic studies wherever that is possible and ethical, and their own data is drawn next to the published result.

Read `docs/HCI-BRIEF.md` for the general rules (research lines, honesty about evidence, experiments with `ctx.later`, `ctx.every` and `performance.now()`, text and 3D rules). Read `docs/PHYSICS-BRIEF.md` for deterministic simulation, and `docs/MUSIC-BRIEF.md` for the sound rules (`AUDIO` only from `on` handlers). This brief adds the mind-specific rules and the route. For reference scenes, see `git show hci:src/scenes-2-pointing.js` (a timed experiment) and `git show music:src/scenes-8-perception.js` (the learner's data against a published curve, a simulated participant in Watch mode).

## The route: fixed lesson ids

Each lesson id is also the id of the lesson's first scene. `prior` and `THREAD` entries may use any of these ids, across eras.

| Era (stage id) | Lessons |
| --- | --- |
| 1 `measure` (1830–1900) | weber-law, fechner-scaling, reaction-time, mental-chronometry, localisation, neuron-doctrine |
| 2 `learning` (1885–1950) | forgetting-curve, classical-conditioning, law-of-effect, operant-schedules, cognitive-maps, gestalt-grouping |
| 3 `information` (1948–1975) | channel-capacity, chunking, selective-attention, signal-detection, mental-rotation, visual-search |
| 4 `memory` | working-memory, serial-position, encoding-context, reconstructive-memory, spacing-effect, testing-effect |
| 5 `brain` | action-potential, hebbian-synapse, receptive-fields, split-brain, brain-imaging, plasticity |
| 6 `reasoning` | anchoring, availability-representativeness, loss-aversion, base-rates, selection-task, dual-process |
| 7 `social` | conservation, theory-of-mind, conformity, obedience, cognitive-dissonance, replication-crisis |
| 8 `models` | perceptron, prediction-error, bayesian-perception, predictive-processing, embodied-cognition, consciousness |

Lesson notes:
- `mental-chronometry`: Donders' subtraction method (simple, choice and go/no-go times).
- `localisation`: phrenology (shown as wrong) against Broca's and Wernicke's patients.
- `channel-capacity`: Hick–Hyman law and Miller's 7 ± 2, with Cowan's revision to about 4 chunks.
- `selective-attention`: Cherry's cocktail party, Broadbent's filter and Treisman's attenuation; also Stroop.
- `visual-search`: Treisman and Gelade's feature against conjunction search.
- `prediction-error`: Rescorla–Wagner, temporal-difference learning and Schultz's dopamine neurons.
- `consciousness`: global workspace, masking and blindsight, with the theories labelled as theories.

## Files and naming

- **Files you own:** `src/scenes-N-<era>.js`, `src/scenes-N-lessons.js` and `src/scenes-N-words.js`.
- **Helper names:** prefix top-level helpers with `DN_` where N is your era (for example `D1_`).
- **Scene ids:** use `<lesson-id>-<word>`.
- **Scenes per lesson:** 3 (or 4 where the topic is rich).
- **Do not edit:** the engine, the tests, `curriculum.js` or other eras' files.
- **Lessons:** register them in route order.

## Mind rules

### The learner as participant

Run the experiment on the learner whenever it is short, safe and honest. Good candidates:

- Weber fractions with two lines or two grey patches.
- Simple against choice reaction time, giving a Hick–Hyman slope and Donders' subtraction.
- Ebbinghaus-style recall of nonsense syllables.
- Digit span.
- Stroop.
- Mental rotation, plotting response time against angle.
- Feature against conjunction search, plotting time against set size.
- Serial-position recall.
- Anchoring estimates.
- The Wason selection task.
- Signal detection yes/no, computing d′ and criterion.
- Change blindness, the Müller-Lyer illusion and Gestalt grouping judgements.

Experiment rules:
- **Timing:** time with `performance.now()`, and order trials with `shuffled()` and `nextSeed()`, never `Math.random`.
- **Results:** plot the learner's data beside the published curve or value, with a plain sentence on how to read it. Keep trial counts short (under about a minute).
- **Watch mode:** show a labelled *simulated participant* whose data follows the published finding.
- **Privacy:** no data leaves the page; say so once per experiment, in the hint.

### Studies that must not be re-run

The learner must never be deceived, frightened or shamed. Show Milgram, Asch, Zimbardo, Little Albert and the like as reconstructions or simulations of the published data. Each one comes with its ethical problems and with later critiques:
- Milgram's variations and Perry's archive work.
- Haslam and Reicher's reanalyses, and the Stanford Prison Experiment's demand characteristics (Le Texier 2019).
- Little Albert's unknown fate.

### Honesty about evidence

This is the heart of the course. Say plainly what failed or shrank.

**Did not replicate, or shrank:**
- Ego depletion (Hagger et al. 2016 multi-lab).
- Power posing.
- Most social priming, such as Bargh's elderly walking study.
- The "10% of the brain" claim.
- Learning styles (Pashler et al. 2008).
- Left-brain and right-brain personality types.
- Phrenology.
- Miller's "7" as a fixed limit.
- Facial-feedback (the 2016 RRR, then a 2022 multi-lab partial revival; say it is mixed).
- The bystander effect as usually told (Kitty Genovese reporting errors; Philpot et al. 2020 CCTV data).

**Robust:**
- The testing and spacing effects.
- Stroop.
- Serial position.
- Weber's law in the middle range.
- Mental rotation.
- Anchoring (large but varying effects in Many Labs).
- Loss aversion, with the debated size noted (Gal & Rucker 2018).

`research` lines cite real work with year. Where unsure of a detail, say less rather than invent. Mark replication status where it matters, for example "(replicated in Many Labs 1)" or "(failed to replicate: Hagger et al. 2016)".

### Breadth

Name the people who are often left out:
- Mary Whiton Calkins (paired associates; refused a Harvard PhD).
- Margaret Floy Washburn.
- Kenneth and Mamie Clark (doll studies).
- Brenda Milner (patient H.M.).
- Anne Treisman.
- Elizabeth Loftus.
- Eleanor Gibson (visual cliff).
- Mary Ainsworth.
- Leda Cosmides.
- Lisa Feldman Barrett.

Note WEIRD samples (Henrich, Heine & Norenzayan 2010) where cross-cultural results differ, for example Müller-Lyer susceptibility and conformity rates.

### Links to sister courses

HCI In Motion already covers Fitts, Hick and Miller from the interface side. Where you touch these, add a `SOURCE` to `https://hci-in-motion.puter.site/` with a one-line note, and keep your scene about the mind rather than the interface. Do the same for Music In Motion for auditory perception (`https://music-in-motion.puter.site/`).

### 3D

Use 3D only where depth helps:
- Mental rotation objects (Shepard–Metzler cubes): the obvious case.
- A neuron or receptive-field surface.
- An error surface for the perceptron.
- A Bayesian prior × likelihood surface.

Expect at most one or two per era.

## Glossary

Add `WORD` entries for key terms, and for the people your era introduces, with key `person-<surname>`. Before adding a concept key, check `grep -h "key:'" src/scenes-*-words.js` for existing ones. People are owned by era:

| Era | People |
| --- | --- |
| 1 | Weber, Fechner, Helmholtz, Donders, Wundt, Broca, Wernicke, Cajal, Golgi |
| 2 | Ebbinghaus, Calkins, Pavlov, Thorndike, Skinner, Tolman, Wertheimer, Washburn |
| 3 | Shannon, Hick, Miller, Cowan, Cherry, Broadbent, Treisman, Green & Swets (`person-green`), Roger Shepard, Lynn Cooper |
| 4 | Bartlett, Baddeley, Hitch, Tulving, Godden, Loftus, Bjork, Roediger, Karpicke |
| 5 | Hodgkin, Huxley, Hebb, Hubel, Wiesel, Sperry, Gazzaniga, Milner, Merzenich |
| 6 | Tversky, Kahneman, Wason, Gigerenzer, Evans, Stanovich |
| 7 | Piaget, Baron-Cohen, Wimmer & Perner (`person-wimmer`), Asch, Milgram, Festinger, the Clarks (`person-clark`), Ainsworth, Nosek |
| 8 | Rosenblatt, Rescorla, Schultz, Sutton, Knill, Friston, Clark (Andy, `person-clark-andy`), Varela, Baars, Dehaene |

## Build and test your era only

```sh
S=/tmp/claude-0/-home-user-computer-science-in-motion/7e28ded3-3dbc-5cc3-810c-b1bae2c3d852/scratchpad
cd /home/user/computer-science-in-motion
STAGES=N OUT=$S/dN.html python3 build.py
FILE=$S/dN.html SHOTS=$S/shots-dN ALLSHOTS=1 SAMPLE=<one id> timeout 900 node test/check.js
FILE=$S/dN.html timeout 900 node test/text-layout.js 375
FILE=$S/dN.html timeout 900 node test/text-layout.js 320
FILE=$S/dN.html SHOTS=$S/shots-dN timeout 300 node test/three.js
```

Then:
- Look at every `try-*.png` and `three-*.png`, and fix overlaps, clipping and unreadable text.
- Check every computed statistic numerically (d′, regression slopes, Bayes posteriors) against hand values.
- Write scripts with the Write tool, not shell heredocs containing JS.
- Never delete files, and do not commit. Stay on branch `mind`.

**Final report:** for each lesson, list its scene ids with one line each: "interaction — why — research cited (replication status)". Then list any 3D scenes, the numerical checks you ran, and any problems left.
