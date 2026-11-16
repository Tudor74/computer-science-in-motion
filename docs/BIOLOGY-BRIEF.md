# Biology In Motion: brief for era authors

Biology In Motion runs on the shared In Motion engine on branch `biology`, which already includes sound. The course tells the history of biology in order. Most of biology is about populations, rates and feedback, so most of Try it is **simulation the learner steers**: selection on a population, Mendelian crosses, an enzyme filling up, predator–prey cycles, an epidemic, a Turing pattern. Where a classic experiment can be rerun on screen, the learner reruns it.

## What to read first

- **General rules:** `docs/HCI-BRIEF.md` covers research lines, honesty about evidence, experiments with `ctx.later`/`ctx.every`/`performance.now()`, and the text and 3D rules.
- **Simulation:** `docs/PHYSICS-BRIEF.md` covers deterministic simulation. It matters most here: seed every random process with `rng(seed)`, never `Math.random`, and draw pictures as pure functions of state.
- **Learner as participant:** `docs/MIND-BRIEF.md`.
- **Reference scenes:**
  - `git show physics:src/scenes-1-motion.js` (a simulation driven by `watch`/`trace`)
  - `git show mind:src/scenes-6-reasoning.js` (the learner's data beside a published result)

## The route: fixed lesson ids

Each lesson id is also the id of the lesson's first scene. `prior` and `THREAD` entries may use any of these ids, across eras.

| Era (stage id) | Lessons |
| --- | --- |
| 1 `cells` (1665–1900) | microscopes, cell-theory, surface-volume, diffusion-osmosis, cell-division, germ-theory |
| 2 `evolution` (1830–1930) | deep-time, natural-selection, artificial-selection, sexual-selection, speciation, finches-beaks |
| 3 `heredity` (1866–1950) | mendel-crosses, punnett-squares, chromosomes-linkage, hardy-weinberg, genetic-drift, quantitative-traits |
| 4 `molecules` (1944–1970) | double-helix, replication, transcription-translation, genetic-code, gene-regulation, mutation |
| 5 `metabolism` (1900–1980) | enzymes, membranes-pumps, photosynthesis, respiration-atp, homeostasis, scaling-laws |
| 6 `ecology` (1920–1980) | logistic-growth, predator-prey, competition-niches, food-webs, island-biogeography, nutrient-cycles |
| 7 `bodies` (1880–today) | immune-system, epidemics-sir, vaccines-herd, morphogenesis, circulation-heart, microbiome |
| 8 `modern` (1977–today) | sequencing, phylogenetic-trees, crispr, evolution-in-the-lab, antibiotic-resistance, origins-of-life |

### Lesson notes

**Era 1 · Cells**
- `microscopes`: Hooke 1665 and Leeuwenhoek, with resolution against magnification.
- `cell-theory`: Schleiden, Schwann and Virchow's *omnis cellula e cellula*. Say plainly that Remak's priority was overlooked.
- `germ-theory`: Pasteur's swan-neck flasks, Koch's postulates and their limits, and Semmelweis's handwashing.

**Era 2 · Evolution**
- `deep-time`: Hutton, Lyell and the age of the Earth, from radiometric dating.
- `finches-beaks`: the Grants' measurements on Daphne Major. Include the 1977 drought and the rise in beak depth (Boag & Grant 1981).

**Era 3 · Heredity**
- `chromosomes-linkage`: Morgan's fly room and Sturtevant's first genetic map.
- `quantitative-traits`: Fisher 1918, many genes adding up to a bell curve, and heritability. Heritability is often misread; state that it is not "how genetic a trait is" for an individual.

**Era 4 · The molecules of life**
- `double-helix`: Chargaff's rules, Franklin and Gosling's Photo 51, and Watson and Crick 1953. Credit Rosalind Franklin accurately; use Cobb & Comfort's 2023 *Nature* account of how her data were used.
- `replication`: Meselson–Stahl 1958, rerun with density bands.
- `gene-regulation`: Jacob and Monod's lac operon.

**Era 5 · Energy and chemistry**
- `enzymes`: Michaelis–Menten, with the learner fitting Vmax and Km. Credit Maud Menten.
- `membranes-pumps`: Skou's sodium–potassium pump.
- `respiration-atp`: Mitchell's chemiosmosis, a contested idea that was later vindicated.
- `homeostasis`: Bernard and Cannon, with the blood glucose and insulin feedback loop.
- `scaling-laws`: Kleiber's ¾ law. The exponent is debated, so say so (White & Seymour 2003).

**Era 6 · Ecosystems**
- `predator-prey`: Lotka–Volterra, and the hare–lynx data with its caveats.
- `competition-niches`: Gause's *Paramecium*, competitive exclusion, and Connell's barnacles.
- `food-webs`: trophic levels, the 10% rule (a rough average), and Paine's keystone starfish.
- `island-biogeography`: MacArthur and Wilson, and the Simberloff–Wilson mangrove fumigation.
- `nutrient-cycles`: the carbon and nitrogen cycles, and Keeling's curve as data.

**Era 7 · Bodies and disease**
- `immune-system`: clonal selection (Burnet), antibodies and memory.
- `epidemics-sir`: Kermack–McKendrick 1927, R0 and flattening the curve.
- `vaccines-herd`: Jenner, the herd-immunity threshold 1 − 1/R0, and the retracted Wakefield paper, named as retracted.
- `morphogenesis`: Turing 1952 reaction–diffusion patterns and Wolpert's French flag. The learner grows spots or stripes.
- `circulation-heart`: Harvey 1628's calculation, which is lovely to rerun.
- `microbiome`: label the hype. The famous 10:1 microbe-to-human cell ratio is wrong; the revised figure is about 1:1 (Sender, Fuchs & Milo 2016). Present faecal transplant for *C. difficile* as the strong case.

**Era 8 · Reading and writing life**
- `sequencing`: Sanger 1977 against shotgun sequencing, and the falling cost per genome (NHGRI data).
- `phylogenetic-trees`: Woese's three domains, and building a tree from a toy alignment.
- `crispr`: Doudna and Charpentier 2012, guide RNA matching. Include the He Jiankui case, with the ethics.
- `evolution-in-the-lab`: Lenski's long-term experiment and the citrate (Cit+) innovation.
- `antibiotic-resistance`: Fleming's own warning, and the MEGA-plate (Baym et al. 2016).
- `origins-of-life`: Miller–Urey 1953, the RNA world and hydrothermal vents. Label it as open science.

## Files and naming

- **Files you own:** `src/scenes-N-<stageid>.js`, `src/scenes-N-lessons.js` and `src/scenes-N-words.js`.
- **Helpers:** prefix top-level helpers with `BN_` (for example `B3_`).
- **Scene ids:** `<lesson-id>-<word>`.
- **Scenes per lesson:** 3 (or 4 where the topic is rich).
- **Do not edit:** the engine, the tests, `curriculum.js` or other eras' files.
- **Order:** register lessons in route order.

## Biology rules

### Breadth and credit

Name people accurately, including those often left out:
- Rosalind Franklin
- Maud Menten
- Barbara McClintock (transposons, which go in era 4 under `mutation`)
- Lynn Margulis (endosymbiosis, in era 8 under `phylogenetic-trees`, or era 1)
- Nettie Stevens (sex chromosomes, in era 3)
- Rachel Carson (in era 6)
- Esther Lederberg
- Tu Youyou (artemisinin)
- Jennifer Doudna and Emmanuelle Charpentier

Name non-European contributors where they belong, such as Alfred Russel Wallace's co-discovery and Ibn al-Nafis on pulmonary circulation (era 7).

### Honesty about evidence

Mark replication and status where it matters. Correct popular myths plainly:
- "Survival of the fittest" means reproductive success, not strength.
- Evolution has no goal or ladder.
- The 10:1 microbe figure is wrong, as above.
- "Junk DNA" is debated: ENCODE's 80% "functional" claim was criticised (Graur et al. 2013).
- Lamarck was not simply "wrong", and epigenetic inheritance is real but limited.
- The textbook peppered moth story was challenged and then confirmed (Majerus; Cook et al. 2012).

Label values as illustrative when they are not published data.

### Sound

Use sound sparingly: for example a heartbeat, a click per division or Geiger-like counts. Follow the sound rules in `docs/MUSIC-BRIEF.md` and play sound only from `on` handlers.

### 3D

Use 3D only where depth helps. The natural cases are the double helix, a protein fold or enzyme pocket, a cell's surface-to-volume cube, a Turing pattern surface, and a phylogenetic tree. Expect at most one or two per era.

## Glossary

Add `WORD` entries for key terms and for people, with key `person-<surname>`. Before adding a key, check `grep -h "key:'" src/scenes-*-words.js` for existing ones. A person belongs to the era where they first appear in the lesson notes above. For example, Darwin and Wallace belong to era 2, and Franklin, Watson and Crick to era 4.

## Build and test your era only

```sh
S=/tmp/claude-0/-home-user-computer-science-in-motion/7e28ded3-3dbc-5cc3-810c-b1bae2c3d852/scratchpad
cd /home/user/computer-science-in-motion
STAGES=N OUT=$S/bN.html python3 build.py
FILE=$S/bN.html SHOTS=$S/shots-bN ALLSHOTS=1 SAMPLE=<one id> timeout 900 node test/check.js
FILE=$S/bN.html timeout 900 node test/text-layout.js 375
FILE=$S/bN.html timeout 900 node test/text-layout.js 320
FILE=$S/bN.html SHOTS=$S/shots-bN timeout 300 node test/three.js
```

Then:
- Look at every `try-*.png` and `three-*.png`, and fix overlaps, clipping and unreadable text.
- Check every formula numerically against hand values: Hardy–Weinberg, Michaelis–Menten, Lotka–Volterra conservation, the SIR final size and Harvey's arithmetic.
- Write scripts with the Write tool, not shell heredocs containing JS.
- Never delete files, and do not commit. Stay on branch `biology`.

**Final report:** for each lesson, list its scene ids with one line each: "interaction — why — research cited". Then give the 3D scenes, the numerical checks you ran, the facts you are least sure of, and any problems left.
