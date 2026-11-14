# HCI In Motion: brief for era authors

HCI In Motion uses the Computer Science In Motion engine (`src/core.js`, `src/app.js`, `src/shell.html`) to tell the history of human–computer interaction in eight eras. The eras follow what computers could do, from blinking lights to VR and beyond. Each lesson also names the empirical research behind today's understanding of how the mind reads a screen.

Reference scenes from the CS page are on `main`, for example `git show main:src/scenes-1-represent.js` and `git show main:src/scenes-4-search.js`. Read one or two before writing. They show the Watch/Try it pattern, `trace`, `hit()`, `three()`, `LESSON()` and `WORD()`.

## The route: fixed lesson ids

Each lesson id is also the id of the lesson's first scene. Cross-era `prior` and `THREAD` entries may use any of these ids.

| Era (stage id) | Lessons |
| --- | --- |
| 1 `lights` 1940s–60s | front-panel, punched-cards, command-line, time-sharing, light-pen, vigilance |
| 2 `pointing` 1960s | sketchpad, mouse, fitts-law, hick-law, hypertext, augmenting-intellect |
| 3 `desktop` 1970s–80s | wimp, dynabook, direct-manipulation, keystroke-model, spreadsheet, wysiwyg |
| 4 `mind` research | gestalt, preattentive, working-memory, affordances, mental-models, change-blindness, eye-movements |
| 5 `visual` 1960s–2000s | visual-variables, graphical-perception, data-ink, mind-maps, overview-detail, animated-bubbles, colour-maps |
| 6 `web` 1990s–2000s | world-wide-web, information-scent, usability-testing, heuristics, scanning-patterns, response-time |
| 7 `touch` 2000s–10s | multi-touch, touch-targets, gestures, interruptions, accessibility, dark-patterns |
| 8 `immersive` 1968– | head-mounted-display, presence, depth-cues, augmented-reality, conversational-ui, brain-computer, ai-agents, calm-technology |

## What each era author writes

- Files you own:
  - `src/scenes-N-<era>.js` for the scenes. Top-level helper names are prefixed `HN_` (for example `H1_`).
  - `src/scenes-N-lessons.js` for `LESSON`, `SOURCE` and `THREAD` calls.
  - `src/scenes-N-words.js` for `WORD` entries.
- Do not edit the engine, the tests, `curriculum.js` or other eras' files. If the engine needs a change, say so in your report.
- **Lessons.** Write 3 scenes per lesson, or 4 where the topic is rich: the lesson's first scene, then scenes with ids `<lesson-id>-<word>`.
- **`LESSON({...})` fields:**
  - `id`: the lesson id from the table above.
  - `name`: the lesson name.
  - `short`: at most 14 characters.
  - `stage`: the era's stage id.
  - `year`: for example `'1954'` or `'1960s'`.
  - `why`: one sentence.
  - `prior`: earlier lesson ids.
  - `level`: `'Introduction'`, `'Core'` or `'Advanced'`.
  - `references`: SOURCE keys.
  - `ids`: the lesson's scene ids, in order.
- **Register lessons in route order.**
- **Research.** Every scene has `research: 'Author (year). Title or finding.'`. This is shown under the example. Cite only real work you are confident exists, and prefer the original source. Name the people who contributed: Ted Nelson, Vannevar Bush, Douglas Engelbart, Ivan Sutherland, Alan Kay, Hans Rosling, Tony Buzan, Paul Fitts, William Hick, George A. Miller, Anne Treisman, Don Norman, Ben Shneiderman, Edward Tufte, Jacques Bertin, Cleveland and McGill, Stuart Card and others.
  - Be honest about the strength of the evidence. For example, Buzan's mind maps have modest empirical support, and Rosling-style animation helps presentation more than analysis (Robertson et al., 2008).
  - Do not repeat debunked claims such as learning styles, "we only use 10% of our brain", or treating Miller's 7 ± 2 as a design rule. Present Miller's figure alongside Cowan's roughly 4 chunks.
- **`SOURCE(key, {title, url?})`** adds further reading. Use stable URLs only (DOI, publisher, Wikipedia, archive.org), or no URL.
- **Experiments.** Where it fits, Try it makes the learner the participant: time clicks for Fitts, choices for Hick, visual search for Treisman, the flicker paradigm for change blindness, estimating ratios for Cleveland & McGill.
  - Handlers may read `performance.now()` and store results in the state; `draw()` stays pure.
  - Trial order comes from `rng()`, `shuffled()` or `nextSeed()`, never `Math.random`.
  - Show the learner's own data against the published curve or finding.
- **History.** Where it fits, recreate the period interface faithfully and generically: front-panel lamps, card punches, a teletype, Sketchpad constraints, the Alto desktop. Use no trademarks or logos, and do not recreate specific commercial products' look.
- **Watch** stays deterministic: a pure function of state, frame and `X`.
  - Text is en-GB, at least 13 units, and never outside the 600×380 drawing.
  - Use `T`/`TB`/`TM` (these scale up to 1.28× on phones), and `TF`/`TBF`/`TMF` for tightly packed labels.
- **3D** (`three()`, see `SCENES.bit.three` on `main`) only where depth genuinely helps. Expect at most one or two scenes per era; era 8 may use more.
- **Glossary.** Add `WORD` entries for key terms and for the people your era introduces, with key `person-<surname>`. To avoid duplicates, the owners are:
  - Era 1: Licklider, R. B. Miller, Mackworth, Hopper.
  - Era 2: Bush, Nelson, Engelbart, Sutherland, Fitts, Hick.
  - Era 3: Kay, Papert, Shneiderman, Card.
  - Era 4: Wertheimer, Treisman, G. A. Miller, Cowan, Norman, Gibson, Simons, Yarbus.
  - Era 5: Bertin, Cleveland, Tufte, Buzan, Rosling, Furnas.
  - Era 6: Berners-Lee, Nielsen, Pirolli.
  - Era 7: Han, Fogg, Brignull.
  - Era 8: Weiser, Milgram, Weizenbaum, Reeves & Nass.

  For concept keys, run `grep -h "key:'" src/scenes-*-words.js` before adding one.

## Build and test your era only

```sh
S=/tmp/claude-0/-home-user-computer-science-in-motion/7e28ded3-3dbc-5cc3-810c-b1bae2c3d852/scratchpad
cd /home/user/computer-science-in-motion
STAGES=N OUT=$S/hN.html python3 build.py
FILE=$S/hN.html SHOTS=$S/shots-hN ALLSHOTS=1 SAMPLE=<one id> timeout 900 node test/check.js
FILE=$S/hN.html timeout 900 node test/text-layout.js 375
FILE=$S/hN.html SHOTS=$S/shots-hN timeout 300 node test/three.js
```

Then look at every `try-*.png` (and any `three-*.png`) and fix overlaps, clipping and unreadable layouts. Write scripts with the Write tool, not shell heredocs containing JS. Never delete files. Do not commit.

**Final report:** for each lesson, its scene ids with one line "interaction — why — research cited", any 3D scenes, and problems left.
