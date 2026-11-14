# Computer Science In Motion

A single-file, offline HTML page that walks through computer science from bits to P versus NP: 7 stages, 59 lessons (one per term) and 209 scenes. Every scene has a plain-English definition, an example and an animated SVG diagram. A **Try it** mode hands the same diagram to the learner, who can change the input and step through it. Nine scenes add a projected **3D** view with the same 2D / Auto / 3D toggle as Mathematics In Motion.

It is a companion to [Mathematics In Motion](https://github.com/Tudor74/mathematics-in-motion) and keeps its visual language and playback model.

- Open `index.html` in any modern browser. It needs no network, no libraries and no build step.
- **Watch** is deterministic: each diagram is a pure function of the lesson clock, so play, pause, speed, rewind and replay always show the same picture for the same moment.
- **Try it** is driven only by your input and your step position (Step, Back, Run, Reset).
- The branch map moves left/right along the route and up/down along connections (for example *Last in, first out*: call stack → stack → depth-first search).
- Underlined words open the glossary. **Word meanings** searches every entry.

## Route

Each term below is a lesson of 3–4 scenes: the term itself, then the ideas that make it work.

1. **Represent**: bit, binary, byte, hexadecimal, ASCII, Unicode/UTF-8, bitmap, Boolean logic, logic gate, half adder
2. **Instruct**: algorithm, variable, conditional, loop, function, call stack, recursion
3. **Organise data**: array, linked list, stack, queue, hash function, hash table, tree, binary search tree, graph
4. **Search and sort**: linear and binary search, BFS, DFS, Dijkstra; bubble, insertion, merge and quick sort; Big-O, divide and conquer, dynamic programming
5. **Machines**: fetch–decode–execute, machine code, memory hierarchy, cache, compiler, interpreter, process, scheduling
6. **Networks**: packet, IP routing, TCP, DNS, HTTP, encryption, public key, digital signature
7. **Theory**: finite automaton, regular expression, Turing machine, halting problem, P versus NP

## Source layout

`index.html` is generated. Edit the files in `src/` and rebuild:

```sh
python3 build.py            # writes index.html
node test/check.js          # Playwright: console errors, every scene in Watch and Try it, overflow, screenshots
node test/three.js          # 2D/3D toggle on every 3D scene
node test/slider.js         # time slider: hold to rewind, release to pause, forward latches, keys
node test/text-layout.js 375  # phone text scale: labels stay inside the drawing and do not collide
```

On narrow screens diagram labels are enlarged (up to 1.28×, as in Mathematics In Motion) so they stay near 12px on screen. Tightly packed labels use the fixed-size helpers `TF`, `TBF` and `TMF`.

The speed control is the Mathematics In Motion time slider: hold left of 0 to rewind at up to 8× (releasing pauses), drag right to latch a forward speed up to 12×, and use Play/Pause separately.

| File | Contents |
| --- | --- |
| `src/shell.html` | Markup and CSS (tokens on `:root`, 44px targets, focus-visible styles) |
| `src/core.js` | Scene API notes, interaction design note, palette `C`, SVG helpers |
| `src/scenes-N-*.js` | Scenes for stage N; `scenes-N-lessons.js` registers its lessons (`LESSON`) and connections (`THREAD`); `scenes-N-words.js` holds its glossary entries |
| `src/curriculum.js` | `CURRICULUM` (stages, lessons, prior lessons, references), connection threads, sources, header textures |
| `src/app.js` | Runtime: clock, Watch/Try it modes, controls, local map, glossary dialog |
