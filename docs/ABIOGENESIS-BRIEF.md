# Abiogenesis In Motion: brief for era authors

Abiogenesis In Motion uses the shared In Motion engine on branch `abiogenesis`, sound included. The course tells the history of how people have tried to explain where life came from, in order. Its central honesty rule: **after era 1, almost everything is open science.** Label hypotheses as hypotheses, show rival ideas side by side, and keep what has been shown in a lab apart from what is plausible and what is speculation. Put a small status tag in the drawing or caption of each scene: "demonstrated", "plausible" or "speculative".

Try it is mostly **simulations the learner steers**:
- run Redi's jars
- spark a Miller–Urey flask
- evolve a replicator past the error threshold
- grow an autocatalytic set
- let a protocell membrane grow and divide
- tilt a chirality balance
- dial a planet into a habitable zone
- judge a biosignature claim

Read first:
- `docs/HCI-BRIEF.md`: general rules (research lines, honesty, `ctx.later`/`ctx.every`, text and 3D rules).
- `docs/PHYSICS-BRIEF.md`: deterministic simulation. Seed every random process with `rng(seed)`, never `Math.random`.
- `docs/BIOLOGY-BRIEF.md`: biology conventions.

Reference scenes:
- `git show biology:src/scenes-8-modern.js`: `origins-of-life`, `origins-of-life-rna-world` (error threshold) and `origins-of-life-vents`. Go deeper than these; do not copy them.
- `git show biology:src/scenes-1-cells.js`: `germ-theory`, Pasteur's flasks. Era 1 here should go further, into Redi, Needham and Spallanzani, and Pasteur against Pouchet.

## The route: fixed lesson ids (8 eras × 4 lessons)

Each lesson id is also the id of its first scene. `prior` and `THREAD` may use any of these ids, across eras.

| Era (stage id) | Lessons |
| --- | --- |
| 1 `spontaneous` | aristotle-generation, redi-flies, needham-spallanzani, pasteur-pouchet |
| 2 `chemistry` | wohler-urea, oparin-haldane, miller-urey, meteorite-chemistry |
| 3 `earth` | hadean-earth, oldest-evidence, bombardment-timeline, panspermia |
| 4 `rna` | ribozymes, replicators, error-threshold, nucleotide-synthesis |
| 5 `metabolism` | hydrothermal-vents, iron-sulfur-world, autocatalytic-sets, proton-gradients |
| 6 `cells` | coacervates, protocells, membrane-growth, chirality |
| 7 `luca` | luca, genetic-code-origin, rooting-the-tree, viruses-origins |
| 8 `elsewhere` | habitable-zone, icy-moons, biosignatures, defining-life |

Lesson notes:
- **`needham-spallanzani`:** include the vital-force dispute.
- **`pasteur-pouchet`:** cover the 1864 Académie contest, and Pouchet's hay infusions as heat-resistant spores, which Tyndall and Cohn later explained.
- **`miller-urey`:** cover 1953, Miller's later re-analysis of the 1958 H₂S samples (Parker et al. 2011), and how the neutral-atmosphere view changed yields.
- **`meteorite-chemistry`:** Murchison (1969) amino acids, their slight L excess, and nucleobases (Callahan 2011). Add Ryugu and Bennu sample results (2023–2025) where you are sure of them.
- **`oldest-evidence`:**
  - Jack Hills zircons (4.4 Ga) and the oxygen-isotope hint of water.
  - Isua 3.7 Ga stromatolites (Nutman 2016) and their challenge (Allwood 2018).
  - Apex chert microfossils: Schopf 1993, contested by Brasier 2002.
  - Label every one of these "contested" where it is.
- **`bombardment-timeline`:** the Late Heavy Bombardment, now doubted.
- **`panspermia`:** keep it separate. It moves the problem; it does not solve it.
- **`ribozymes`:** Cech and Altman, and the ribosome as a ribozyme (2000).
- **`replicators`:** Spiegelman's monster (1965), Lincoln & Joyce 2009 cross-replicating ribozymes, and polymerase ribozymes (Wochner 2011; Attwater 2018).
- **`error-threshold`:** Eigen 1971 and Eigen's paradox.
- **`nucleotide-synthesis`:**
  - Powner, Gerland & Sutherland 2009, which bypassed free ribose.
  - Cyanosulfidic chemistry (Patel 2015).
  - Becker 2019, a unified purine and pyrimidine route.
- **`hydrothermal-vents`:** black smokers against Lost City alkaline vents (Kelley 2001).
- **`iron-sulfur-world`:** Wächtershäuser 1988.
- **`autocatalytic-sets`:** Kauffman 1986, RAF sets (Hordijk & Steel), and the formose reaction.
- **`proton-gradients`:** Lane & Martin 2012, and Mitchell's chemiosmosis as the universal feature. Note that it is debated.
- **`coacervates`:** Oparin's coacervates, and modern membraneless droplets (liquid–liquid phase separation).
- **`protocells`:** Szostak's fatty-acid vesicles that grow and divide (Zhu & Szostak 2009). Cover how clay speeds vesicle formation and RNA uptake (Hanczyc 2003).
- **`chirality`:** homochirality, Soai's autocatalysis, the Viedma ripening, and circularly polarised light. Status: open.
- **`luca`:**
  - Weiss et al. 2016 (355 protein families, thermophilic, H₂-dependent).
  - Moody et al. 2024 (about 4.2 Ga, with an immune system).
  - Label the dates as model estimates with wide ranges.
- **`genetic-code-origin`:** the frozen accident (Crick 1968), stereochemical against coevolution theories, and error minimisation (Freeland & Hurst 1998).
- **`rooting-the-tree`:** where the root sits. Cover the two-domain against three-domain debate, linked to Biology In Motion.
- **`viruses-origins`:** virus-first, escape and reduction hypotheses, and giant viruses (Mimivirus 2003).
- **`habitable-zone`:** Kasting 1993, plus tidal locking and stellar flares.
- **`icy-moons`:**
  - Europa.
  - Enceladus's plumes and phosphates (Postberg 2023).
  - Titan's methane chemistry.
- **`biosignatures`:**
  - The Viking labelled release (1976), still debated.
  - ALH84001 (1996).
  - Venus phosphine (2020), challenged and unresolved.
  - K2-18b DMS (2023 and 2025), weak evidence.
  - The learner rates each claim against the CoLD scale (Green et al. 2021, NASA's confidence levels).
- **`defining-life`:** NASA's working definition (Joyce 1994), autopoiesis, and why definitions are hard. Let the learner sort borderline cases: virus, fire, crystal, mule, prion.

## Files and naming

- **Files you own:** `src/scenes-N-<stageid>.js`, `src/scenes-N-lessons.js`, `src/scenes-N-words.js`.
- **Helper names:** prefix top-level helpers with `AN_` (for example `A3_`).
- **Scene ids:** `<lesson-id>-<word>`.
- **Scenes per lesson:** 3, or 4 where the topic is rich.
- **Do not edit:** the engine, the tests, `curriculum.js` or other eras' files.
- **Order:** register lessons in route order.
- **Sister courses:** link them with `SOURCE`:
  - `https://biology-in-motion.puter.site/`
  - `https://physics-in-motion.puter.site/`
  - `https://the-future-in-motion.puter.site/`, where relevant.

## Rules

- **Credit people accurately**, including:
  - Lynn Margulis
  - Leslie Orgel
  - Stanley Miller
  - Joan Oró (adenine from HCN, 1960)
  - Cyril Ponnamperuma
  - Sidney Fox
  - Antonio Lazcano
  - Nick Lane
  - John Sutherland
  - Jack Szostak
  - Gerald Joyce
  - Sarah Stewart Johnson
  - Nathalie Cabrol
  - Jennifer Blank
- **Present people and ideas fairly.** Do not caricature Pouchet, Oparin or panspermia advocates. Present each in its time.
- **State dates and figures with the uncertainty they carry.** Ga ages carry ranges.
- **Show contested claims as both sides.**
- **Never imply the problem is solved.**
- **Sound:** keep it sparing (a spark crackle, the click of a replication) and only in `on` handlers.
- **3D:** only where depth helps. Good cases are a fatty-acid bilayer vesicle, a ribozyme fold, the vent chimney's chemical gradient, LUCA's tree, and a planet's habitable zone in orbit. At most one or two per era.

## Glossary

- Add `WORD` entries for key terms and people, with keys of the form `person-<surname>`.
- Check `grep -h "key:'" src/scenes-*-words.js` before adding.
- A person belongs to the era where they first appear in the lesson notes.

## Build and test your era only

```sh
S=/tmp/claude-0/-home-user-computer-science-in-motion/7e28ded3-3dbc-5cc3-810c-b1bae2c3d852/scratchpad
cd /home/user/computer-science-in-motion
STAGES=N OUT=$S/aN.html python3 build.py
FILE=$S/aN.html SHOTS=$S/shots-aN ALLSHOTS=1 SAMPLE=<one id> timeout 900 node test/check.js
FILE=$S/aN.html timeout 900 node test/text-layout.js 375
FILE=$S/aN.html timeout 900 node test/text-layout.js 320
FILE=$S/aN.html SHOTS=$S/shots-aN timeout 300 node test/three.js
```

Then:
- Look at every `try-*.png` and `three-*.png` and fix what you find.
- Check the models numerically: error threshold, autocatalysis growth, habitable-zone distances, isotope ages.
- Write scripts with the Write tool, not shell heredocs containing JS.
- Never delete files. Do not commit. Stay on branch `abiogenesis`.

**Final report.** For each lesson, list its scene ids with one line each: "interaction — status tag — research cited". Then give:
- the 3D scenes
- the numerical checks
- the facts you are least sure of
- any problems left
