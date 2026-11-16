# Ted Nelson In Motion: brief for era authors

Ted Nelson In Motion uses the shared In Motion engine on branch `nelson` (the Mind engine, sound included). It follows Ted Nelson's ideas in the order he had them, and links each to the empirical research that tested or extended it. It is about **ideas you can operate**: in Try it the learner builds the structure the diagram shows, such as a trail, a zippered list, a transclusion, a two-way link, a ZigZag cell or a link that rots.

Read `docs/HCI-BRIEF.md` for the general rules (research lines, honesty about evidence, experiments with `ctx.later`, `ctx.every` and `performance.now()`, and the text and 3D rules). Read `docs/MIND-BRIEF.md` for the learner-as-participant rules. For reference scenes, see `git show hci:src/scenes-2-pointing.js`; the HCI course already has a short `hypertext` lesson. Go deeper than it, and don't copy it.

## The route: fixed lesson ids

Each lesson id is also the id of the lesson's first scene. `prior` and `THREAD` entries may use any id in this table, across eras.

| Era (stage id) | Lessons |
| --- | --- |
| 1 `roots` (1945–1960) | memex, associative-trails, non-sequential-writing, index-cards |
| 2 `hypertext` (1960–1965) | coining-hypertext, zippered-lists, hypermedia, version-history |
| 3 `systems` (1967–1974) | hes-brown, nls-demo, fress, stretchtext |
| 4 `computerlib` (1974) | computer-lib, dream-machines, fantics, thinkertoys |
| 5 `xanadu` (1981–1992) | transclusion, two-way-links, transcopyright, tumblers |
| 6 `web` (1989–2000) | web-vs-xanadu, link-rot, embedded-markup, curse-of-xanadu |
| 7 `later` (1995–2014) | zigzag, xanadu-space, open-xanadu, parallel-documents |
| 8 `legacy` (research) | reading-hypertext, backlinks, content-addressing, deep-interconnection |

Lesson notes:
- **`memex`:** Bush 1945, "As We May Think".
- **`index-cards`:** Nelson's own account of trying to organise his notes on cards as a student (Swarthmore, then Harvard 1960). The Harvard term project is the origin of Xanadu.
- **`zippered-lists`:** the ELF (Evolutionary List File) and zippered lists from the 1965 ACM paper.
- **`hes-brown`:** the Hypertext Editing System, built with Andries van Dam at Brown in 1967. It was later used for Apollo documentation; say so only with care.
- **`fress`:** FRESS (1968), plus undo, which is often credited to it.
- **`nls-demo`:** Engelbart's 1968 demo, as a contrast and an influence.
- **`stretchtext`:** text that expands in place as you ask for detail.
- **`computer-lib`:** the two-sided book, its "you can and must understand computers NOW", and its hand-drawn, self-published form.
- **`fantics`:** Nelson's word for the art of presentation and emotional design.
- **`thinkertoys`:** software for thinking with alternatives and comparisons.
- **`tumblers`:** Xanadu's permanent addresses (tumbler numbers) and enfilades, explained simply.
- **`transcopyright`:** quotation by transclusion, with automatic micropayment.
- **`embedded-markup`:** Nelson's criticism of HTML: markup mixed into content, one-way links, no versions.
- **`curse-of-xanadu`:** Gary Wolf's 1995 Wired article and Nelson's rebuttal. Present both sides fairly.
- **`zigzag`:** zzstructure, cells on many dimensions at once, two of them shown at a time.
- **`open-xanadu`:** the 2014 working demo with visible transclusion beams.
- **`parallel-documents`:** side-by-side comparison with visible connections.
- **`reading-hypertext`:** "lost in hyperspace" (Conklin 1987), and comprehension and cognitive load in hypertext against linear text (DeStefano & LeFevre 2007; Salmerón and colleagues).
- **`backlinks`:** wikis, Roam and Obsidian, Wikipedia's "What links here", and trackbacks.
- **`content-addressing`:** Git, IPFS and Merkle DAGs as cousins of permanent addresses. Wikipedia transclusion and templates also belong here.
- **`deep-interconnection`:** "everything is deeply intertwingled". Close the course with it.

## Files and naming

- **Files you write:** `src/scenes-N-<stageid>.js`, `src/scenes-N-lessons.js` and `src/scenes-N-words.js`, for each era you are given.
- **Helper prefixes:** start top-level helpers with `TN_`, where N is the era number (for example `T1_`).
- **Scene ids:** use `<lesson-id>-<word>`.
- **Scenes per lesson:** 3, or 4 where the topic is rich.
- **Files you must not touch:** the engine, the tests, `curriculum.js`, and other eras' files.
- **Order:** register lessons in route order.

## Nelson-specific rules

### Respect and accuracy

Ted Nelson is a living person (born 1937). Write about him with respect and stick to the documented record: his own books (*Computer Lib/Dream Machines* 1974, *Literary Machines* 1981, *Possiplex* 2010), his 1965 ACM paper, interviews, and work by historians such as Belinda Barnet's *Memory Machines* (2013).

- Do not invent quotations. Use short, well-known phrases only, such as "intertwingled", "You can and must understand computers NOW" and "the purpose of computers is human freedom". Otherwise paraphrase.
- Where accounts differ, as in the Wired article or the Apollo claim, give both and attribute them.
- Do not use his photograph or any logos. Use no Xanadu branding beyond naming it.

### Interaction

Each scene lets the learner manipulate the structure:
- Follow and save a memex trail.
- Shuffle index cards into many orders.
- Zip two lists together.
- Expand stretchtext.
- Transclude a passage and watch it update at its source.
- Create a two-way link and see it from both ends.
- Break a server and watch one-way links rot.
- Navigate a ZigZag grid along a chosen pair of dimensions.

### Evidence

Back the empirical claims with real studies, for example:
- **Link rot:** Koehler 1999 and 2004; Zittrain, Albert & Lessig 2014 (about half the links in US Supreme Court opinions no longer pointed to the original material); Lepore 2015.
- **Reading and disorientation:** Conklin 1987; DeStefano & LeFevre 2007; Salmerón et al.
- **Wiki and backlink structure:** for example Wikipedia link-graph studies.

Mark contested or anecdotal claims, and label illustrative numbers as illustrative.

Link sister courses with `SOURCE`, a URL and a one-line note:
- HCI In Motion: `https://hci-in-motion.puter.site/`
- Thinkers In Motion: `https://thinkers-in-motion.puter.site/`
- Computer Science In Motion: `https://computer-science-in-motion.puter.site/`

### 3D

Use 3D only where depth helps. The natural cases are ZigZag (a third dimension shown by rotating), Xanadu Space's floating documents with transclusion beams, and a link graph. Expect at most one per era.

## Glossary

Add `WORD` entries for key terms, and for each person your era introduces, keyed `person-<surname>`.

- Before adding a concept key, check the existing ones with `grep -h "key:'" src/scenes-*-words.js`.
- Ted Nelson himself is `person-nelson` and belongs to era 1.
- Other people belong to the era where they first appear. Use the `person-<surname>` key, adding a first name if two people share a surname.

| Era | People |
| --- | --- |
| 1 | Bush, Nelson |
| 3 | van Dam, Engelbart |
| 5 | Miller (Mark S.), Gregory (Roger), Walker (John, Autodesk) |
| 6 | Berners-Lee, Wolf (Gary) |
| 8 | Conklin |

## Build and test your era only

```sh
S=/tmp/claude-0/-home-user-computer-science-in-motion/7e28ded3-3dbc-5cc3-810c-b1bae2c3d852/scratchpad
cd /home/user/computer-science-in-motion
STAGES=N OUT=$S/tN.html python3 build.py
FILE=$S/tN.html SHOTS=$S/shots-tN ALLSHOTS=1 SAMPLE=<one id> timeout 900 node test/check.js
FILE=$S/tN.html timeout 900 node test/text-layout.js 375
FILE=$S/tN.html timeout 900 node test/text-layout.js 320
FILE=$S/tN.html SHOTS=$S/shots-tN timeout 300 node test/three.js
```

After the tests:
- Look at every `try-*.png` and `three-*.png`, and fix any overlaps, clipping or unreadable text.
- Write scripts with the Write tool, not with shell heredocs containing JS.
- Never delete files. Do not commit. Stay on branch `nelson`.

**Final report.** For each lesson, list its scene ids with one line each: "interaction — why — sources cited". Then list:
- any 3D scenes;
- the facts you are least sure of, so the integrator can check them;
- any problems left.
