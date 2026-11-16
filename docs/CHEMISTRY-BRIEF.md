# Chemistry In Motion: brief for era authors

Chemistry In Motion uses the shared In Motion engine on branch `chemistry`, sound included. It tells the history of chemistry in order. In Try it the learner **does chemistry on screen**:
- weighs reactants on Lavoisier's balance
- squeezes Boyle's J-tube
- places elements into Mendeleev's gaps
- builds Lewis structures and sees VSEPR shapes
- pushes an equilibrium with Le Chatelier
- titrates to an end point
- reads an NMR or IR spectrum
- runs a chromatography column

Where a classic experiment can be rerun, they rerun it.

**Read first:**
- `docs/HCI-BRIEF.md`: research lines, honesty, `ctx.later`/`ctx.every`, and the text and 3D rules.
- `docs/PHYSICS-BRIEF.md`: deterministic simulation. Seed every random process with `rng(seed)`, never `Math.random`.

**Reference scenes:**
- `git show physics:src/scenes-7-heat.js` (gas laws and kinetic theory). Link to Physics In Motion; don't repeat it.
- `git show biology:src/scenes-5-metabolism.js` (enzymes).

## The route: fixed lesson ids

Each lesson id is also the id of the lesson's first scene. `prior` and `THREAD` entries may use any of these ids, across eras.

| Era (stage id) | Lessons |
| --- | --- |
| 1 `alchemy` (400 BCE–1790) | four-elements, alchemy-distillation, boyle-law, phlogiston, conservation-of-mass, oxygen-discovery |
| 2 `atoms` (1800–1870) | dalton-atoms, avogadro, electrolysis, ideal-gas, flame-spectra, atomic-weights |
| 3 `periodic` (1869–1932) | periodic-table, noble-gases, radioactivity, atomic-number, isotopes, electron-shells |
| 4 `bonding` (1916–1960) | lewis-structures, ionic-covalent, vsepr-shapes, orbitals-hybrids, hydrogen-bonds, electronegativity |
| 5 `reactions` (1850–1950) | reaction-rates, equilibrium, acids-bases, redox-batteries, catalysis, free-energy |
| 6 `organic` (1828–1970) | carbon-skeletons, functional-groups, benzene-aromaticity, stereochemistry, polymers, total-synthesis |
| 7 `analysis` (1900–today) | chromatography, ir-spectroscopy, nmr, mass-spectrometry, crystallography, titration |
| 8 `modern` (1950–today) | semiconductors, nanomaterials, click-chemistry, green-chemistry, atmospheric-chemistry, computational-chemistry |

### Lesson notes

**Era 1: alchemy**
- `four-elements`: Empedocles and Aristotle, plus the Chinese wuxing (five phases) and Indian traditions for comparison.
- `alchemy-distillation`: Jābir ibn Ḥayyān (and the Latin pseudo-Geber), al-Rāzī's classification, and the alembic. Show alchemy as proto-chemistry with real lab technique, not as a joke.
- `boyle-law`: the 1662 J-tube data. The learner adds mercury and checks that PV stays constant against Boyle's own table.
- `phlogiston`: Stahl. Present it fairly, as a theory that explained a lot.
- `conservation-of-mass`: Lavoisier's sealed vessels, and Marie-Anne Paulze Lavoisier's role.
- `oxygen-discovery`: Scheele, Priestley and Lavoisier, as a priority dispute.

**Era 2: atoms**
- `dalton-atoms`: multiple proportions.
- `avogadro`: Gay-Lussac's combining volumes and Avogadro's hypothesis.
- `electrolysis`: Davy isolates sodium and potassium, and Faraday's laws.
- `ideal-gas`: link to Physics; keep the chemistry side, e.g. molar volume.
- `flame-spectra`: Bunsen and Kirchhoff, caesium and rubidium found by their lines.
- `atomic-weights`: Cannizzaro at Karlsruhe, 1860.

**Era 3: periodic**
- `periodic-table`: Mendeleev 1869 and his eka-aluminium (gallium) prediction against measured values. Credit Lothar Meyer as well.
- `noble-gases`: Ramsay and Rayleigh.
- `radioactivity`: Becquerel, Marie and Pierre Curie, and half-lives.
- `atomic-number`: Moseley's X-ray frequency law (1913). Mention that he died at Gallipoli.
- `isotopes`: Soddy, and Aston's mass spectrograph.
- `electron-shells`: Bohr, Lewis and Langmuir, and how shells explain the table's periods.

**Era 4: bonding**
- `lewis-structures`: Lewis 1916. The learner places electron pairs and checks octets.
- `ionic-covalent`: the continuum, and the Born–Haber cycle.
- `vsepr-shapes`: Gillespie and Nyholm 1957. A 3D view is natural here, e.g. CH₄, NH₃, H₂O, SF₆.
- `orbitals-hybrids`: Pauling. Mark hybridisation as a model and say that MO theory is more general.
- `hydrogen-bonds`: water's anomalies and DNA base pairs.
- `electronegativity`: Pauling's scale, set against Mulliken's.

**Era 5: reactions**
- `reaction-rates`: the Arrhenius equation and collision theory.
- `equilibrium`: Le Chatelier and Kc. The learner pushes the system.
- `acids-bases`: Arrhenius, Brønsted–Lowry and Lewis, and Sørensen's 1909 pH scale.
- `redox-batteries`: Volta, Daniell cell potentials, and the lithium-ion cell (Goodenough, Whittingham, Yoshino; Nobel 2019).
- `catalysis`: Haber–Bosch. Cover the ethics: fertiliser feeding billions, and Haber's gas warfare. Clara Immerwahr is part of that history.
- `free-energy`: Gibbs, and ΔG = ΔH − TΔS.

**Era 6: organic**
- `carbon-skeletons`: Wöhler is only a mention (Abiogenesis covers him). Cover Kekulé's tetravalence and isomer counts.
- `benzene-aromaticity`: Kekulé's ring. Say the dream story is traditional and disputed. Cover Kathleen Lonsdale's 1929 X-ray proof of the flat ring.
- `stereochemistry`: van 't Hoff and Le Bel, and thalidomide, with care and accuracy. The R and S forms interconvert in the body, so a single-isomer drug would not have prevented the harm.
- `polymers`: Staudinger's macromolecules, nylon (Carothers), Kevlar (Stephanie Kwolek), and plastic pollution.
- `total-synthesis`: Woodward, and Corey's retrosynthesis.

**Era 7: analysis**
- `chromatography`: Tsvet 1906, Martin and Synge. The learner runs a column or a TLC plate and computes Rf.
- `ir-spectroscopy`: bond vibrations. The learner matches peaks to groups.
- `nmr`: chemical shift and splitting (n + 1).
- `mass-spectrometry`: m/z, isotopes and fragments.
- `crystallography`: Bragg's law, Dorothy Crowfoot Hodgkin (penicillin, B₁₂, insulin), and Rosalind Franklin linked to Biology In Motion.
- `titration`: an acid–base curve, indicators, and the end point. The learner titrates drop by drop.

**Era 8: modern**
- `semiconductors`: doping and band gaps. Link to CS In Motion.
- `nanomaterials`: buckminsterfullerene 1985, graphene 2004 and quantum dots (Nobel 2023).
- `click-chemistry`: Sharpless and Meldal, and Bertozzi's bioorthogonal chemistry (Nobel 2022).
- `green-chemistry`: Anastas and Warner's 12 principles, and atom economy, which the learner computes.
- `atmospheric-chemistry`: Molina, Rowland and Crutzen on ozone and CFCs, the Montreal Protocol success with recovery data, and Keeling linked to Biology.
- `computational-chemistry`: quantum chemistry, density functional theory (Kohn, Pople), and AlphaFold (Nobel 2024). Frame it as tools with limits.

## Files and naming

- **Your files:** `src/scenes-N-<stageid>.js`, `src/scenes-N-lessons.js`, `src/scenes-N-words.js`.
- **Helper prefix:** `CN_`, for example `C5_`.
- **Scene ids:** `<lesson-id>-<word>`.
- **Lesson size:** 3 scenes per lesson, or 4 where the topic is rich.
- **Don't edit:** the engine, the tests, `curriculum.js` or other eras' files.
- **Order:** register lessons in route order.

## Chemistry rules

### Breadth and credit

- Credit women often left out:
  - Marie-Anne Paulze Lavoisier
  - Marie Curie
  - Lise Meitner (nuclear fission)
  - Harriet Brooks
  - Kathleen Lonsdale
  - Dorothy Crowfoot Hodgkin
  - Rosalind Franklin
  - Stephanie Kwolek
  - Alice Ball (a leprosy treatment, 1916)
  - Tu Youyou
  - Carolyn Bertozzi
  - Jennifer Doudna
  - Emmanuelle Charpentier
- Credit non-European contributors:
  - Jābir
  - al-Rāzī
  - Chinese alchemy and gunpowder
  - Indian rasashastra
  - Asima Chatterjee (alkaloid chemistry)
  - Ahmed Zewail (femtochemistry)

### Honesty

- **Myths to correct:**
  - "Lavoisier discovered oxygen alone"
  - the Kekulé dream told as fact
  - "alchemists were frauds"
- **Show how science changed:** phlogiston and the caloric theory were reasonable for their time.
- **Ethics, stated plainly:** Haber's gas warfare, thalidomide, leaded petrol (Midgley), and plastic pollution.

### Accuracy

- Use correct formulas, charges, oxidation states and stoichiometry.
- Check every balanced equation numerically, atom by atom.
- Chemical notation: use subscripts with Unicode (₂, ³⁺), or SVG `<tspan baseline-shift>`. Check they render.
- Lab safety: wherever the learner "does" an experiment that is dangerous in real life, say so, e.g. mercury, chlorine, sodium in water.

### Sound and 3D

- **Sound:** sparing. A bubbling, a click at an end point, a crackle for a flame test. Only in `on` handlers.
- **3D:** only where depth helps:
  - VSEPR shapes
  - orbitals
  - crystal lattices (NaCl, diamond)
  - benzene's π cloud
  - a buckyball
  - a protein fold

  At most one or two per era.

## Glossary

- Add `WORD` entries for key terms and people, with key `person-<surname>`.
- Check `grep -h "key:'" src/scenes-*-words.js` before adding.
- A person belongs to the era where they first appear in the notes above.

## Build and test your era only

```sh
S=/tmp/claude-0/-home-user-computer-science-in-motion/7e28ded3-3dbc-5cc3-810c-b1bae2c3d852/scratchpad
cd /home/user/computer-science-in-motion
STAGES=N OUT=$S/cN.html python3 build.py
FILE=$S/cN.html SHOTS=$S/shots-cN ALLSHOTS=1 SAMPLE=<one id> timeout 900 node test/check.js
FILE=$S/cN.html timeout 900 node test/text-layout.js 375
FILE=$S/cN.html timeout 900 node test/text-layout.js 320
FILE=$S/cN.html SHOTS=$S/shots-cN timeout 300 node test/three.js
```

After the tests:
- Look at every `try-*.png` and `three-*.png` and fix what they show.
- Check every equation and model numerically: balanced equations, Boyle's PV, Kc, pH, the Nernst equation, Arrhenius, Bragg, Rf, and atom economy.
- Write scripts with the Write tool, not with shell heredocs containing JS.
- Never delete files. Do not commit. Stay on branch `chemistry`.

**Final report:** for each lesson, list its scene ids with one line each: "interaction — why — research cited". Then give the 3D scenes, the numerical checks, the facts you are least sure of, and any problems left.
