# Brain In Motion: brief for era authors

Brain In Motion runs on the shared In Motion engine, on branch `brain`, with sound. It tells how the brain was worked out, from the first measurements of electricity in nerves to today's tools: the neuron, the synapse, maps of the brain, movement, development and plasticity, brain states, disorders, and the frontier. Follow the order of discovery, within each era and across the course.

The course is built around preparations and records the learner can work with on a screen:
- classic experiments run as simulations: ion gradients and the Nernst potential, current injected into an axon, quanta at the neuromuscular junction, a tendon tap, a half-centre oscillator, prism adaptation, pairing inputs for LTP
- classic records read and scored: an EEG, a hypnogram, a single-channel trace, a dopamine neuron's raster, a rat's path with place-cell spikes
- statistics the learner can get wrong and then correct: uncorrected tests on noise voxels, decoding a reach from few or many neurons
- spikes heard as clicks, at gentle volume, only when the learner asks

Where the learner produces data, draw it next to the published result. The disorder era explains; it never tests the learner.

**Read first**
- `docs/HCI-BRIEF.md`: general rules, `LESSON` fields, research lines, experiments, text and 3D.
- `docs/MIND-BRIEF.md`: rules for the learner as participant (privacy, no deception), and how to present studies that must not be re-run.
- `docs/MUSIC-BRIEF.md`: sound rules (`AUDIO` only from `on` handlers).
- `docs/SENSES-BRIEF.md` on branch `senses` (`git show senses:docs/SENSES-BRIEF.md`): the safety rules this course inherits.

**Reference scenes**
- `git show mind:src/scenes-5-brain.js` (action potential, Hebb's synapse, receptive fields, split brain, imaging, plasticity). Link to it rather than repeat it.
- `git show mind:src/scenes-1-measure.js` (Mind's `localisation` and `neuron-doctrine`) and `git show mind:src/scenes-8-models.js` (`perceptron`, `prediction-error`).
- `git show senses:src/scenes-3-ear.js` (a published curve with the learner's data beside it; sound from `on` handlers) and `git show senses:src/scenes-7-touch.js` (receptors, pain, proprioception).
- `git show hci:src/scenes-2-pointing.js` (a timed experiment).

## The route: fixed lesson ids

Each lesson id is also the id of the lesson's first scene. `prior` and `THREAD` entries may use any of these ids, across eras.

| Era (stage id) | Lessons |
| --- | --- |
| 1 `neuron` | animal-electricity, neuron-doctrine, resting-potential, action-potential, myelin-conduction, glia |
| 2 `synapse` | synapse-discovery, quantal-release, excitation-inhibition, neurotransmitters, receptors-drugs, neuromodulation |
| 3 `map` | localisation, cortex-maps, split-brain, brain-imaging, lesion-cases, connectome |
| 4 `movement` | motor-cortex, spinal-reflexes, pattern-generators, cerebellum, basal-ganglia, population-coding |
| 5 `plasticity` | wiring-up, critical-periods, hebb-ltp, map-plasticity, neurogenesis, adolescent-brain |
| 6 `state` | circadian-clock, sleep-stages, arousal-systems, reward-dopamine, stress-response, hunger-homeostasis |
| 7 `disorder` | stroke, epilepsy, parkinsons, alzheimers, depression-treatments, addiction |
| 8 `frontier` | patch-clamp, optogenetics, place-grid-cells, brain-computer-interfaces, recording-many, brains-and-ai |

Five ids also exist in Mind In Motion (`neuron-doctrine`, `localisation`, `action-potential`, `split-brain`, `brain-imaging`). The courses are separate pages, so the ids do not clash, but the Mind lessons already cover the basics: go further here, and point to Mind for what it has done.

### Lesson notes

"Contested", "debated" and "overstated" below are instructions: say so on screen, in the scene's `definition`, `example` or `research` line.

**Era 1: the neuron**
- `animal-electricity`: Galvani's frog legs (published 1791) and his dispute with Volta, whose pile (1800) came out of it; du Bois-Reymond measures the nerve's electrical signal in the 1840s; Helmholtz times it in 1850 at tens of metres per second, far slower than electricity in a wire. The learner times a signal along a nerve and works out its speed.
- `neuron-doctrine`: Golgi's silver stain (1873) blackens a few cells completely; Cajal uses it from 1888 to argue for separate cells against Golgi's continuous net; Waldeyer coins "neuron" (1891); they share the 1906 Nobel Prize and still disagree in their lectures. Electron microscopy settled it in the 1950s. The learner traces stained fibres to see whether they join or end. Mind has a lesson with this id: link to it.
- `resting-potential`: Nernst's equation (1888–89); Bernstein's membrane hypothesis (1902); later the Goldman–Hodgkin–Katz equation and the sodium–potassium pump (Skou 1957). The learner changes ion concentrations inside and outside and reads the potential. Check the numbers: with 5 mM potassium outside and 140 mM inside at body temperature, the Nernst potential is about −89 mV.
- `action-potential`: Cole & Curtis (1939) show the membrane's conductance rises; Hodgkin & Huxley record inside the squid giant axon (1939), then use the voltage clamp to write the 1952 equations (Nobel Prize 1963, with Eccles). The learner injects current and finds threshold, all-or-none firing and the refractory period, with spikes as clicks. Link to Mind's `action-potential` rather than repeat it.
- `myelin-conduction`: Ranvier describes the nodes (1878); Tasaki (1939) and Huxley & Stämpfli (1949) show the impulse jumps between them. Unmyelinated axons conduct at roughly 1 m/s, large myelinated ones at up to about 100 m/s. Multiple sclerosis (described by Charcot, 1868) damages myelin, so signals slow or fail; describe it respectfully and give no prognosis. The learner races two axons and removes myelin from one.
- `glia`: Virchow names "neuroglia" (1856); astrocytes, oligodendrocytes, Schwann cells and microglia. Correct the "ten glia for every neuron" claim: cell counts (Azevedo et al. 2009) give roughly 86 billion neurons and a similar number of non-neuronal cells. Mark how far astrocytes take part in signalling as debated.

**Era 2: synapses**
- `synapse-discovery`: Sherrington introduces the word (1897); Loewi's two frog hearts (1921) show a chemical slows the second heart, later identified as acetylcholine (Nobel Prize 1936, with Dale). The "soup against sparks" argument ran until Eccles's own recordings (1951) converted him. Electrical synapses also exist. The learner repeats Loewi's transfer of fluid from one heart to the other.
- `quantal-release`: Fatt & Katz (1952) find miniature end-plate potentials at the frog neuromuscular junction; del Castillo & Katz (1954) show responses are made of whole numbers of these units (Katz, Nobel Prize 1970). The learner lowers calcium, collects responses and sees the histogram's peaks.
- `excitation-inhibition`: Eccles records excitatory and inhibitory potentials inside spinal motor neurons (early 1950s); summation over space and time; glutamate as the main excitatory transmitter in the brain and GABA as the main inhibitory one. The learner times inputs to reach, or just miss, threshold.
- `neurotransmitters`: Dale on acetylcholine (1914); von Euler on noradrenaline (1946); Carlsson shows dopamine is a transmitter in its own right (1957–58; Nobel Prize 2000). Give the criteria for calling a chemical a transmitter. Do not label transmitters by one function ("the pleasure chemical", "the happiness chemical"): mark those as popular simplifications.
- `receptors-drugs`: Claude Bernard locates curare's action at the junction of nerve and muscle (1850s); Langley's "receptive substance" (1905); ionotropic receptors (a channel, fast) against metabotropic receptors (G-protein-coupled, slower). Agonists and antagonists: curare blocks acetylcholine receptors on muscle, caffeine blocks adenosine receptors. The learner draws a dose–response curve and adds a competitive antagonist. Describe mechanisms only; give no doses.
- `neuromodulation`: small groups of neurons that project widely (noradrenaline from the locus coeruleus, serotonin from the raphe nuclei, dopamine from the midbrain, acetylcholine from the basal forebrain); Eve Marder's work on the crab stomatogastric ganglion shows one circuit producing different rhythms under different modulators. The learner applies a modulator to a small rhythmic circuit.

**Era 3: mapping the brain**
- `localisation`: Gall's organology and Spurzheim's phrenology as a false start (skull bumps tell nothing; the idea that functions have places survived); Flourens's objections; Broca's patient Leborgne (1861); Wernicke (1874). Say that modern accounts of language involve networks, not two centres. Link to Mind's `localisation`.
- `cortex-maps`: Brodmann's areas from cell layers (1909); Penfield & Boldrey (1937) and the homunculus of Penfield & Rasmussen (1950), drawn from stimulation of awake patients during epilepsy surgery. Say the real maps overlap more than the cartoon shows. The learner stimulates points along the strip.
- `split-brain`: Sperry, Gazzaniga and Bogen from 1962, in patients whose corpus callosum was cut to treat epilepsy (Sperry, Nobel Prize 1981). Debunk "left-brained and right-brained people": a study of more than a thousand brain scans found no such types (Nielsen et al. 2013). Link to Mind's `split-brain` for the basic experiment.
- `brain-imaging`: Berger's first human EEG (recorded 1924, published 1929); PET in the 1970s; Ogawa's BOLD contrast (1990) and the first human fMRI studies (1991–92). Explain a voxel: a few cubic millimetres holding a very large number of neurons, measured through blood oxygen, seconds after the activity. The dead-salmon poster (Bennett et al. 2009) is the lesson on multiple comparisons: the learner tests noise voxels without correction, counts the false positives, then applies a correction. Also mention reverse inference (Poldrack 2006) as a common error.
- `lesion-cases`: Phineas Gage (1848; Harlow's reports of 1848 and 1868). Flag that the well-known account of his later life is overstated: the records are thin, and Macmillan's research shows he later worked for years as a coach driver, which suggests considerable recovery. Henry Molaison, "H.M." (Scoville & Milner 1957; studied for decades by Brenda Milner and Suzanne Corkin); link to Mind's memory era. Explain what one case can and cannot show, and the double dissociation.
- `connectome`: the full wiring of *C. elegans* (White, Southgate, Thomson & Brenner 1986; 302 neurons); the adult fruit fly brain (FlyWire consortium, Nature 2024; about 140,000 neurons). There is no human connectome at this level. Say what a wiring diagram leaves out: synaptic strengths, neuromodulators, activity. The learner follows a path from a sensory neuron to a motor neuron in the worm.

**Era 4: movement**
- `motor-cortex`: Fritsch & Hitzig (1870) stimulate a dog's cortex electrically and the opposite limbs move; Ferrier's maps in monkeys; Penfield in humans. Mark as debated whether the map is of muscles, movements or actions (Graziano's long-stimulation results, 2002).
- `spinal-reflexes`: Sherrington's *The Integrative Action of the Nervous System* (1906): the reflex arc, reciprocal inhibition and the final common path (Nobel Prize 1932, with Adrian). The learner taps the tendon, measures the delay and switches reciprocal inhibition off to see both muscles contract.
- `pattern-generators`: Graham Brown (1911) shows a cat's spinal cord can produce stepping rhythms without sensory feedback, and proposes two half-centres that inhibit each other; later work on locust flight (Wilson 1961) and the lamprey (Grillner). The learner tunes a half-centre oscillator and hears the alternation as clicks.
- `cerebellum`: Marr (1969) and Albus (1971) propose that climbing fibres carry an error signal that changes parallel-fibre synapses on Purkinje cells; Ito finds long-term depression there (1982). The cerebellum holds most of the brain's neurons. The learner throws at a target through simulated prisms: the error shrinks throw by throw, and an after-effect appears when the prisms come off; people with cerebellar damage adapt poorly (Martin et al. 1996). Mark the theory as influential and still debated in its details.
- `basal-ganglia`: the direct and indirect pathways (Albin, Young & Penney 1989; DeLong 1990), with dopamine acting oppositely on the two. Hornykiewicz finds dopamine depleted in the striatum in Parkinson's disease (1960); L-DOPA follows (1961; Cotzias 1967). Mark the "go and stop" picture as a simplification: both pathways are active during movement (Cui et al. 2013). Leave the disease itself to `parkinsons`.
- `population-coding`: Georgopoulos and colleagues find motor cortex cells broadly tuned to reach direction (1982) and add them into a population vector (1986). The learner decodes a reach from the firing of a few cells, then many, and sees the error fall. Mark what motor cortex "encodes" as an open argument. This leads to `brain-computer-interfaces`.

**Era 5: development and plasticity**
- `wiring-up`: Cajal names the growth cone (1890); Sperry's rotated-eye experiments in amphibians and his chemoaffinity hypothesis (1963); Rita Levi-Montalcini and Viktor Hamburger find nerve growth factor in the early 1950s (Levi-Montalcini and Stanley Cohen, Nobel Prize 1986). Neurons that fail to get enough trophic support die, which is a normal part of development. The learner steers a growth cone up a chemical gradient.
- `critical-periods`: Wiesel & Hubel (1963) close one eye of a kitten for its first months and find the cortex given over to the open eye; the same closure in an adult cat has little effect (Nobel Prize 1981). Link to amblyopia treatment in children and to Senses In Motion for vision. Describe the experiment plainly and without gore. Say that adult plasticity is reduced, not absent.
- `hebb-ltp`: Hebb's *The Organization of Behavior* (1949); Bliss & Lømo (1973) find long-term potentiation in the rabbit hippocampus; the NMDA receptor as a coincidence detector (its magnesium block, 1984); Morris (1986) shows that blocking it impairs spatial learning in rats. The learner pairs a weak input with a strong one and watches the weak synapse grow. Say that LTP is the leading candidate mechanism for memory, not a proven account of all of it. Link to Mind's `hebbian-synapse`.
- `map-plasticity`: Merzenich and colleagues (1983–84) show a monkey's finger map shifts after injury or training. Ramachandran (1992) reports touch on the face felt in a phantom hand, and later introduces the mirror box (1996); mark the evidence for mirror therapy as mixed, and the remapping explanation of phantom pain as challenged (Makin et al. 2013). Maguire (2000): London taxi drivers have a larger posterior hippocampus, tracking years of driving; caveats are small samples, a smaller anterior hippocampus, and a structural difference that does not by itself say how it arose (a later longitudinal study, Woollett & Maguire 2011, supports training as the cause).
- `neurogenesis`: Altman (1962; Altman & Das 1965) reports new neurons in adult rats and is largely ignored; Nottebohm's canaries in the 1980s add new neurons to song nuclei; Eriksson et al. (1998) report it in the adult human hippocampus. Mark adult human neurogenesis as debated: Sorrells et al. (2018) found almost none in adults, Boldrini et al. (2018) found it persisting. Make no claims about ways to "grow new brain cells".
- `adolescent-brain`: Huttenlocher (1979) counts synapses rising in childhood and falling afterwards; longitudinal MRI (Giedd et al. 1999) shows grey matter thinning and white matter increasing into the twenties. Avoid overclaiming: "the brain is finished at 25" has no sharp basis, the findings are group averages with wide individual variation, and no scan explains one teenager's behaviour.

**Era 6: brain states**
- `circadian-clock`: Konopka & Benzer's *period* mutants in fruit flies (1971); lesions of the suprachiasmatic nucleus abolish rhythms in rats (1972); the gene's feedback loop worked out by Hall, Rosbash and Young (Nobel Prize 2017). The human clock runs slightly longer than 24 hours on average (Czeisler et al. 1999) and is reset by light. The learner shifts the light schedule and watches the clock catch up.
- `sleep-stages`: Aserinsky & Kleitman find rapid-eye-movement sleep (1953); Dement & Kleitman describe the cycle through the night (1957); Borbély's two-process model (1982), a rising sleep pressure and a circadian signal. The learner scores a short record into stages and builds a hypnogram. Mark the function of sleep as not settled, and give no advice on how much anyone should sleep.
- `arousal-systems`: Moruzzi & Magoun (1949) stimulate the brainstem reticular formation in cats and the EEG switches to the waking pattern. Orexin (hypocretin) is discovered by two groups in 1998; in 1999 a receptor mutation is found in narcoleptic dogs and the same condition in mice lacking the peptide; in 2000 people with narcolepsy and cataplexy are shown to have lost most orexin neurons. Describe narcolepsy respectfully.
- `reward-dopamine`: Olds & Milner (1954): rats press a lever for stimulation of their own brain. Schultz, Dayan & Montague (1997): dopamine neurons fire for unexpected reward, move their response to the cue that predicts it, and dip when it is withheld. The learner runs conditioning trials and watches (and may hear) the burst move. Say that dopamine signals "wanting" and learning more than pleasure (Berridge). Link to Mind's `prediction-error`.
- `stress-response`: Cannon's "fight or flight" and homeostasis; Selye's general adaptation syndrome (1936); the hypothalamic–pituitary–adrenal axis and cortisol's negative feedback; Sapolsky's work on long-lasting glucocorticoid exposure and the hippocampus, mostly in rodents and other primates. Mark the human evidence as largely correlational. The learner switches a stressor on briefly, then for a long time, and follows cortisol.
- `hunger-homeostasis`: hypothalamic lesions change eating and body weight (Hetherington & Ranson 1940); Coleman's joined-circulation experiments in mice point to a blood-borne signal; Friedman's group clones leptin (1994). Most human obesity is not leptin deficiency; mark "set point" against "settling point" as debated. Write without blame or stigma, and give no dietary advice.

**Era 7: when things go wrong**
- `stroke`: ischaemic (a blocked vessel, the large majority) against haemorrhagic (bleeding); the FAST signs (face, arm, speech, time); "time is brain" (Saver 2006 estimates about 1.9 million neurons lost each minute in a typical large-vessel stroke); thrombolysis within a few hours (the NINDS trial, 1995) and, since 2015, mechanical removal of the clot. The learner sees the core and the surrounding tissue at risk change with time to treatment. Tell the reader to call their local emergency number at once if they suspect a stroke; the screen is not a check.
- `epilepsy`: Hughlings Jackson (from 1870) reasons from the spread of seizures to an excessive discharge and to the layout of motor cortex; EEG shows spike-and-wave in absence seizures (Gibbs, Davis & Lennox 1935); Penfield and Jasper develop surgery in Montreal. About a third of people have seizures that medicines do not control (Kwan & Brodie 2000), and surgery helps some (Wiebe et al. 2001). Photosensitive epilepsy affects a small minority: explain it with a still diagram and never show the stimulus. No flicker anywhere in this lesson; draw EEG traces as still or slowly scrolling lines.
- `parkinsons`: James Parkinson's *Essay on the Shaking Palsy* (1817); loss of dopamine neurons in the substantia nigra; Lewy bodies and alpha-synuclein (1997); L-DOPA; deep brain stimulation (Benabid, from 1987). Treatments ease symptoms and do not stop the loss. Mention non-movement symptoms, including loss of smell (link to Senses In Motion's `smell-loss`). The learner compares the basal-ganglia loop with and without dopamine, with medicine and with stimulation.
- `alzheimers`: Alois Alzheimer describes Auguste Deter's brain in 1906: plaques and tangles, later identified as amyloid-β and tau. The amyloid hypothesis (Hardy & Higgins 1992) has strong genetic support and a long record of failed trials. Anti-amyloid antibodies clear plaques and slow decline modestly: lecanemab by about a quarter over 18 months, roughly half a point on an 18-point scale (van Dyck et al. 2023), with risks of brain swelling and bleeding. Mark both the hypothesis and whether that benefit matters to patients as debated.
- `depression-treatments`: the monoamine account grew from 1950s drug observations (Schildkraut 1965). Mark it as disputed: an umbrella review found no consistent evidence that depression is caused by low serotonin (Moncrieff et al. 2022), which does not by itself show the medicines do not work. SSRIs and other antidepressants beat placebo by a modest average margin in a meta-analysis of 522 trials (Cipriani et al. 2018). ECT (Cerletti & Bini 1938), now given under anaesthesia, is effective for severe depression and can affect memory. Ketamine acts within hours and briefly (Berman et al. 2000). Say that talking therapies have comparable evidence. Careful and non-advisory: no interactive mood test, nothing that could be read as advice to start, stop or change a treatment, and a line pointing to a doctor or local crisis service.
- `addiction`: addictive drugs raise dopamine in the nucleus accumbens (Di Chiara & Imperato 1988); tolerance and withdrawal; incentive sensitisation, in which "wanting" grows while "liking" does not (Robinson & Berridge 1993). Mark the "brain disease" framing as debated, and note that most people who use drugs do not become addicted and that many recover. Use person-first language ("a person with addiction") and no moralising.

**Era 8: tools and frontiers**
- `patch-clamp`: Neher & Sakmann (1976) record the current through single acetylcholine-receptor channels; the tight "gigaseal" follows in 1981 (Nobel Prize 1991). The learner watches one channel flick open and shut, hears it as clicks, and averages many sweeps into the smooth current Hodgkin and Huxley measured.
- `optogenetics`: channelrhodopsin, a light-gated channel from a green alga (Nagel, Hegemann, Bamberg and colleagues, 2002–03); Boyden, Zhang, Bamberg, Nagel & Deisseroth (2005) use it to drive spikes in neurons with millisecond flashes. The learner places light pulses and sees a spike for each. Draw the light as markers on a timeline, not as flashes of the screen. Say that it is a research tool, with human use at an early stage.
- `place-grid-cells`: O'Keefe & Dostrovsky (1971) find hippocampal cells that fire in one place; Hafting, Fyhn, Molden, Moser & Moser (2005) find grid cells in the entorhinal cortex (Nobel Prize 2014: John O'Keefe, May-Britt Moser and Edvard Moser). The learner moves a rat around a box; spikes click as it crosses the field, and the firing map builds up. Link to Mind's `cognitive-maps`.
- `brain-computer-interfaces`: Fetz (1969) trains monkeys to control a single neuron's firing; BrainGate lets a person with paralysis move a cursor (Hochberg et al. 2006) and a robotic arm (2012); intracortical decoding of attempted handwriting (Willett et al. 2021) and of attempted speech (two studies in Nature, 2023). The learner decodes a cursor movement, building on `population-coding`. Be cautious: the studies involve very few participants, surgery, and systems that need recalibration; leave out company announcements and anything not in a peer-reviewed paper. It is decoding of attempted movement, not "mind reading". Link to HCI In Motion's `brain-computer`.
- `recording-many`: calcium indicators, from Tsien's fura-2 (1985) to the protein GCaMP (Nakai, Ohkura & Imoto 2001; GCaMP6, Chen et al. 2013), which cells make from a gene; two-photon microscopy (Denk, Strickler & Webb 1990), which excites only the focus; dense silicon probes (Neuropixels, Jun et al. 2017: 960 sites, 384 recorded at once). Then why thousands of cells change the questions: much of mouse visual cortex activity tracks the animal's own movements (Stringer et al. 2019). Say that spikes are estimated from calcium signals and that spike sorting makes mistakes. The learner places spikes and recovers them from a calcium trace, moves a two-photon focus, separates two cells by their footprints on a probe, and predicts movement from more and more cells.
- `brains-and-ai`: McCulloch & Pitts's logical neuron (1943); Rosenblatt's perceptron (link to Mind's `perceptron`); the visual cortex as the model for convolutional networks (Fukushima 1980); temporal-difference learning (Sutton & Barto) meeting dopamine in 1997. Then the limits of the analogy: backpropagation has no agreed counterpart in the brain, real neurons are far richer than units, and the brain runs on about 20 watts. The learner trains a TD learner and compares its error signal with the dopamine recordings from `reward-dopamine`. Make no claims about machine understanding or consciousness.

## Files and naming

- **Your files:** `src/scenes-N-<stageid>.js`, `src/scenes-N-lessons.js` and `src/scenes-N-words.js` (for example `src/scenes-3-map.js`). They exist already as placeholders: one card per lesson, so that the build and tests run. Replace all three wholesale, including the `BN_placeholder` helper.
- **Helper names:** every top-level name in your files is prefixed `BN_` (for example `B3_`). All era files share one scope.
- **Source and thread keys:** `bN-<word>` (for example `SOURCE('b3-ogawa',…)`, `THREAD({id:'b3-maps',…})`).
- **Scene ids:** the lesson's first scene has the lesson id; the others are `<lesson-id>-<word>`.
- **Scenes per lesson:** 3, or 4 where the topic is rich.
- **Do not edit:** the engine (`core.js`, `app.js`, `shell.html`), the tests, `curriculum.js`, or other eras' files. If the engine needs a change, say so in your report.
- **Order:** register lessons in route order, with the `id`, `stage` and `prior` ids as in the placeholders.

## Brain rules

### Order of discovery
Tell each topic in the order it was found out, with the people, the dates and the experiment that changed minds, including the false starts (phrenology, the continuous nerve net, "sparks" at the synapse).

### Link, do not repeat
- Mind In Motion era 5 (`git show mind:src/scenes-5-brain.js`) already teaches the action potential, Hebb's synapse, receptive fields, the split brain, imaging and plasticity. Read it, go further, and send the learner there for the basics with a sentence and a `SOURCE` entry (`https://mind-in-motion.puter.site/#<scene-id>`).
- Senses In Motion covers the eye, ear, smell, taste and touch, pain, and proprioception (`https://senses-in-motion.puter.site/#<scene-id>`). This course has no sensory era: link to it.

### Safety first
- Nothing here is medical advice, and no on-screen test is a diagnosis. Say so wherever a scene touches symptoms or treatment (all of era 7; `sleep-stages`, `stress-response` and `hunger-homeostasis` in era 6). Do not build self-assessments for stroke, mood, memory, sleep or addiction.
- Never flash at more than 3 per second, and avoid large high-contrast flicker (WCAG 2.3.1). Spikes, light pulses and EEG rhythms are drawn as marks on a time axis, not as flashes of the screen. In `epilepsy`, describe photosensitivity without showing a stimulus.
- Sound only from `on` handlers, at the default volume or below. Spikes as clicks are a natural use (`AUDIO.noise` or a very short tone); keep click trains sparse enough to be comfortable, and make every scene work with the sound off.
- Mention suicide only where the topic requires it, briefly and without detail.

### Respect
- Describe patients and disorders respectfully. Patients are people with names where they are public (Henry Molaison, Louis Victor Leborgne, Auguste Deter) and anonymous otherwise. Use "a person with epilepsy", "a person with addiction". No pity, no blame, and no drama about symptoms.
- Describe animal experiments plainly and without gore: say which animal, what was done and what was found. Do not draw injury or distress. Do not hide that the animals were used.

### Honesty
Mark these as contested, weak or overstated:
- adult human neurogenesis (debated)
- the monoamine or "chemical imbalance" account of depression (disputed)
- the amyloid hypothesis, and the modest effect of anti-amyloid antibodies
- Phineas Gage's later life (often overstated)
- mirror neurons as the basis of empathy, language or autism (the cells are real, found in macaques by Rizzolatti's group in the 1990s; the large claims are not established). The course has no mirror-neuron lesson: if you mention them, say this.
- "left-brained" and "right-brained" personalities
- "we use only 10% of our brain", "ten glia for every neuron", "the brain is finished at 25"
- dopamine as "the pleasure chemical", serotonin as "the happiness chemical"
- brain–computer interfaces as "mind reading"
- any fMRI result presented as showing where a complex trait "lives"

Claims from 2025–2026: include them only if you are certain of the source; otherwise leave them out. Cite only real, checkable work in `research` lines and `SOURCE` entries, and prefer the original paper.

### Credit
Credit people often left out:
- Rita Levi-Montalcini
- Brenda Milner and Suzanne Corkin
- May-Britt Moser
- Eve Marder
- Carla Shatz (activity-dependent development; "cells that fire together wire together" is her phrase, not Hebb's)
- Marian Diamond (enriched environments)
- Kathleen Montagu (dopamine in the brain, 1957)
- Terje Lømo
- Ichiji Tasaki
- Oleh Hornykiewicz

## Sound and 3D

- **Sound:** useful in eras 1, 2, 4, 6 and 8 for spikes and rhythms. Use it only in `on` handlers.
- **3D:** use it only where depth helps. Good cases: a neuron's shape, the cortex's folds and areas, the layout of the basal ganglia, a place cell's firing field as a surface, the layers of a patch of cortex. At most one or two per era.

## Glossary

- Add `WORD` entries for key terms and people, keyed `person-<surname>`.
- Check `grep -h "key:'" src/scenes-*-words.js` before adding. The placeholders define `neuron`, `synapse`, `cortex`, `reflex`, `plasticity`, `circadian-rhythm`, `seizure` and `ion-channel`, one in each era's words file; keep or rewrite your era's entry.
- A person belongs to the era where they first appear in the notes above.

## Build and test your era only

```sh
S=<a scratch directory outside the repository>
cd /home/user/brain-in-motion
STAGES=N OUT=$S/bN.html python3 build.py
FILE=$S/bN.html SHOTS=$S/shots-bN ALLSHOTS=1 SAMPLE=<one id> timeout 900 node test/check.js
FILE=$S/bN.html timeout 900 node test/text-layout.js 375
FILE=$S/bN.html timeout 900 node test/text-layout.js 320
FILE=$S/bN.html SHOTS=$S/shots-bN timeout 300 node test/three.js
```

A one-era build keeps only that era's lessons, so `prior` ids and `THREAD` scenes from other eras are dropped for the test and return in the full build.

After the tests:
- Look at every `try-*.png` and `three-*.png` and fix what you find.
- Check the models numerically: Nernst and Goldman potentials, conduction speeds, the Hodgkin–Huxley threshold and refractory period, Poisson quantal counts, the false-positive rate on noise voxels, the population-vector error, the two-process model's timing.
- Write scripts with the Write tool, not shell heredocs containing JS.
- Never delete files other than replacing your era's three. Do not commit. Stay on branch `brain`.

**Final report:** for each lesson, list its scene ids with one line each: "interaction — why — research cited (status)". Then give the 3D scenes, the numerical checks, the safety measures taken, the facts you are least sure of, and any problems left.
