# HCI In Motion

A single-file, offline HTML page about human–computer interaction. It runs in historical order, following what computers could do: blinking front-panel lights, then the light pen, the mouse, the desktop, the web, touch, VR and beyond. Each scene names the research behind it.

This is the `hci` branch of the [Computer Science In Motion](https://github.com/Tudor74/computer-science-in-motion) repository and shares its engine. `main` holds the CS page.

- Open `index.html` in any modern browser. It needs no network, no libraries and no build step.
- **Watch** is deterministic: each diagram is a pure function of the lesson clock, so play, pause, speed, rewind and replay always show the same picture for the same moment.
- **Try it** hands the diagram to you. In the experiment scenes you are the participant: you click targets (Fitts), choose among lights (Hick), search for an odd one out (Treisman) or estimate ratios (Cleveland and McGill), and your results are plotted against the published finding.
- **Research** lines under each example cite the original work: Bush, Nelson, Engelbart, Sutherland, Fitts, Hick, Miller, Treisman, Norman, Bertin, Tufte, Buzan, Rosling, Nielsen, Weiser and many others. The lessons say plainly where the evidence is modest.
- **2D / Auto / 3D** appears on the few scenes where depth helps. The time slider, the branch map and the glossary work as they do on the CS page.

## Route

1. **Lights and switches** (1940s–1960s): front panel, punched cards, command line, time-sharing, light pen, vigilance
2. **Pointing and linking** (1960s): Sketchpad, the mouse, Fitts's law, Hick's law, hypertext, augmenting intellect
3. **The desktop** (1970s–1980s): windows, icons, menus and the pointer; the Dynabook; direct manipulation; the keystroke-level model; the spreadsheet; WYSIWYG
4. **How the mind reads a screen** (research from the 1920s to the 1990s): Gestalt grouping, pre-attentive pop-out, working memory, affordances, mental models, change blindness, eye movements
5. **Seeing data** (1960s–2000s): visual variables, graphical perception, data-ink, mind maps, overview and detail, animated bubbles, colour maps
6. **The networked page** (1990s–2000s): the World Wide Web, information scent, usability testing, heuristics, scanning patterns, response time
7. **Touch, mobile and attention** (2000s–2010s): multi-touch, touch targets, gestures, interruptions, accessibility, dark patterns
8. **Immersive and beyond** (1968 onwards): head-mounted displays, presence, depth cues, augmented reality, conversational interfaces, brain–computer interfaces, AI agents, calm technology

## Source layout

`index.html` is generated. Edit the files in `src/` and rebuild:

```sh
python3 build.py              # writes index.html
node test/check.js            # every scene in Watch and Try it: console errors, overflow, screenshots
node test/three.js            # 2D/3D toggle on every 3D scene
node test/slider.js           # time slider behaviour
node test/text-layout.js 375  # phone text scale: labels stay inside the drawing and do not collide
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
| `docs/HCI-BRIEF.md` | The brief for era authors: fixed lesson ids, research and citation rules, test commands |
