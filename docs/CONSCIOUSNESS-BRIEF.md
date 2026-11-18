# Consciousness In Motion: brief for era authors

Consciousness In Motion runs on the shared In Motion engine, on branch `consciousness`, with sound. It covers the science and philosophy of consciousness in eight eras: the question, the threshold of awareness, neural correlates, sleep and anaesthesia, the self, the rival theories, other minds, and machines.

This field has no settled theory. The course teaches what has been found, how it was found, what each theory predicts and what counts against it. It does not tell the learner which theory is right.

The course is built around experiences the learner can have through a screen:
- threshold demonstrations: a single masked presentation, a Necker cube whose flips the learner times, an unexpected object during a counting task, a change that goes unseen, a cueing task
- report and confidence: the learner's own yes/no answers and confidence ratings, turned into d′ and criterion
- self demonstrations: a Libet clock, choice blindness with abstract patterns, a heartbeat count
- toy models, always labelled as toys: an ignition threshold, a zap-and-zip complexity score, a phi-style calculation on a tiny network
- thought experiments made concrete: Mary's room, the Chinese room rule book, neuron-by-neuron replacement, an inverted spectrum

Where the learner takes part, draw their data next to the published result.

**Read first**
- `docs/HCI-BRIEF.md`: general rules, experiments, text and 3D.
- `docs/MIND-BRIEF.md`: rules for the learner as participant (privacy, no deception). They apply here in full.
- `docs/MUSIC-BRIEF.md`: sound rules (`AUDIO` only from `on` handlers).

**Reference scenes**
- `git show mind:src/scenes-3-information.js` (signal detection, with d′ and criterion). Link to it; do not repeat it.
- `git show mind:src/scenes-5-brain.js` (split-brain) and `git show mind:src/scenes-8-models.js` (predictive processing, and the single `consciousness` lesson this course expands).
- `git show senses:src/scenes-8-together.js` (the rubber hand). Link to it; do not repeat it.
- `git show hci:src/scenes-4-mind.js` (a change-blindness experiment) and `git show hci:src/scenes-2-pointing.js` (a timed experiment).

The placeholder files now in `src/` show the registration pattern only. They are not a model for scenes.

## The route: fixed lesson ids

Each lesson id is also the id of the lesson's first scene. `prior` and `THREAD` entries may use any of these ids, across eras.

| Era (stage id) | Lessons |
| --- | --- |
| 1 `question` | mind-body, what-it-is-like, easy-hard-problems, knowledge-argument, zombies-functionalism, trusting-reports |
| 2 `threshold` | masking, blindsight, binocular-rivalry, inattentional-blindness, change-blindness, attention-awareness |
| 3 `correlates` | ncc-search, contrastive-method, ignition, recurrent-processing, front-or-back, perturbational-complexity |
| 4 `absence` | dreaming, lucid-dreaming, anaesthesia, disorders-of-consciousness, split-brain-unity, psychedelics |
| 5 `self` | body-ownership, agency, the-interpreter, mirror-self-recognition, interoception, self-over-time |
| 6 `theories` | global-workspace, integrated-information, higher-order, predictive-processing, attention-schema, adversarial-collaboration |
| 7 `others` | animal-consciousness, octopus-minds, bees-and-insects, infants, sentience-markers, other-people |
| 8 `machines` | turing-test, chinese-room, machine-indicators, machine-self-report, illusionism-panpsychism, open-questions |

### Lesson notes

"Contested" and "weak" below are instructions: the scene must say so in its text.

**Era 1: the question**
- `mind-body`: Descartes' *Meditations* (1641): mind as thinking and unextended, body as extended. Elisabeth of Bohemia's letters (1643) ask how an unextended mind could move a body; Descartes never gave her an answer she accepted. Give the main positions (dualism, physicalism, idealism) one fair line each. The learner sorts claims by the position that makes them.
- `what-it-is-like`: Nagel (1974), "What is it like to be a bat?". Separate the senses of the word: being awake, being aware of something, and phenomenal against access consciousness (Block 1995; note that the distinction is itself disputed). The learner classifies everyday cases.
- `easy-hard-problems`: Chalmers (1995), "Facing up to the problem of consciousness"; Levine's explanatory gap (1983). Best objection: the hard problem is an artefact of how the question is posed (Dennett; Patricia Churchland). The learner sorts research questions into easy and hard and sees where people disagree.
- `knowledge-argument`: Jackson (1982), "Epiphenomenal qualia", and "What Mary didn't know" (1986). Replies: Mary gains an ability, not a fact (Lewis, Nemirow); she learns an old fact in a new way. Jackson later rejected his own argument and became a physicalist; say so. The learner picks what Mary learns and sees which reply that commits them to.
- `zombies-functionalism`: zombies (Kirk 1974; Chalmers 1996, *The Conscious Mind*): conceivability does not obviously entail possibility, which is the best objection. Functionalism and multiple realisability (Putnam, 1960s); Block's China brain (1978) against it; Chalmers' fading-qualia argument for it. The learner replaces neurons one at a time with a slider and says when, if ever, experience would fade.
- `trusting-reports`: Nisbett & Wilson (1977), "Telling more than we can know": people misreport the causes of their behaviour (note this is about causes, not about current experience). Schwitzgebel (2008) on unreliable introspection of experience itself. Measures: yes/no report, confidence ratings, the Perceptual Awareness Scale (Ramsøy & Overgaard 2004), post-decision wagering (Persaud et al. 2007). The learner detects a faint patch with confidence ratings and gets their d′ and criterion (link to Mind In Motion's `signal-detection`).

**Era 2: at the threshold**
- `masking`: backward masking; Marcel (1983) on meaning-based priming from masked words; Holender's (1986) critique; Dehaene et al. (1998) masked number priming. Contested: unconscious semantic priming effects are small, and awareness checks are often too weak to show that the prime was unseen (Shanks 2017). The learner sees one brief target and one mask per trial at different delays and reports what they saw. Single presentations only, never a flickering stream.
- `blindsight`: Weiskrantz, Warrington, Sanders & Marshall (1974), patient DB; the term is Weiskrantz's. Criterion debate: "I see nothing" may be a conservative criterion for degraded conscious vision (Campion, Latto & Smith 1983; Azzopardi & Cowey 1997; Phillips 2021). The learner moves a simulated patient's criterion and watches yes/no answers change while forced-choice accuracy does not.
- `binocular-rivalry`: Necker (1832) cube, Wheatstone (1838) on rivalry, Rubin's vase (1915). Leopold & Logothetis (1996): in monkeys the share of neurons that follow the percept rises along the visual pathway. True binocular rivalry needs a different image in each eye, which one screen cannot give without glasses; say so and use bistable figures. The learner presses a key at each flip of a Necker cube and sees their durations against the skewed distribution reported since Levelt (1960s).
- `inattentional-blindness`: Neisser (1979); Mack & Rock (1998), *Inattentional Blindness*; Simons & Chabris (1999), where about half of observers missed the gorilla. The learner counts bounces of moving shapes while an unexpected shape crosses. Nothing is announced beforehand; the scene explains what happened straight after, and says the demo only works once.
- `change-blindness`: Rensink, O'Regan & Clark (1997) flicker paradigm; Simons & Levin (1998) door study, where about half of the people giving directions did not notice the person had been swapped. Do not copy the original timing, which alternates faster than the course allows. Use a slow alternation with a soft grey fade, a gradual change (Simons, Franconeri & Reimer 2000) or a "mudsplash" (O'Regan, Rensink & Clark 1999). The learner searches for the change and their time is plotted.
- `attention-awareness`: Koch & Tsuchiya (2007) argue the two are distinct. Attention without awareness: cueing effects in blindsight (Kentridge, Heywood & Weiskrantz 1999). Awareness without attention: gist under dual task (Li et al. 2002); contested by Cohen et al. (2012), who argue it cannot be separated. The learner runs a short Posner (1980) cueing task.

**Era 3: neural correlates**
- `ncc-search`: Crick & Koch (1990), "Towards a neurobiological theory of consciousness"; their 40 Hz proposal was later played down. A correlate is the minimal activity jointly sufficient for a specific experience (Chalmers 2000). It is not a cause or an explanation, and it must be separated from what precedes and follows the experience (Aru et al. 2012). The learner sorts candidate signals into prerequisite, correlate and consequence.
- `contrastive-method`: Baars' contrastive analysis (1988): same stimulus, different experience, using masking, rivalry and threshold stimuli. Confound: the contrast also includes deciding and reporting. No-report paradigms (Frässle et al. 2014, reading the percept in rivalry from reflex eye movements and pupil; Tsuchiya et al. 2015). The learner turns the report requirement on and off and sees which activity drops out of a schematic contrast.
- `ignition`: Dehaene & Naccache (2001); Sergent, Baillet & Dehaene (2005); Del Cul, Baillet & Dehaene (2007): a late, nonlinear, widespread response on seen trials, and the P3b wave. Contested: in no-report designs the P3b can vanish while the stimulus is still seen (Pitts et al. 2014; Cohen et al. 2020). The learner raises stimulus strength in a toy model with a threshold, labelled a toy.
- `recurrent-processing`: Lamme & Roelfsema (2000); Lamme (2006). A feedforward sweep reaches high visual areas within roughly 100 ms; on this view experience needs feedback to early areas. Supporting evidence includes TMS over V1 at later delays (Pascual-Leone & Walsh 2001). What counts against it: its claim of experience without access is hard to test, since it cannot be reported. The learner cuts feedback at different times in a schematic.
- `front-or-back`: posterior "hot zone" (Koch, Massimini, Boly & Tononi 2016) against prefrontal accounts; the paired reviews by Boly et al. (2017) and Odegaard, Knight & Lau (2017). Unresolved. Give each side's best evidence and what each says about the other's. The learner assigns findings to the side they support, including findings both sides claim.
- `perturbational-complexity`: Massimini et al. (2005): in deep sleep the response to a TMS pulse stays local. Casali et al. (2013): the perturbational complexity index (PCI), compressing the EEG response. It separated conscious from unconscious conditions in the groups tested; it is a measure, not a theory, and not a bedside certainty. The learner zaps a toy network, changes its coupling and reads a Lempel–Ziv score; label the toy.

**Era 4: sleep, dreams and anaesthesia**
- `dreaming`: Aserinsky & Kleitman (1953), REM sleep; Dement & Kleitman (1957), dream reports on most REM awakenings; Foulkes (1962), reports from NREM too; Solms on dreaming and REM being separable. Siclari et al. (2017): serial awakenings with high-density EEG; less slow-wave activity over posterior cortex predicted a dream report in both REM and NREM. The learner predicts "dream or no dream" from a schematic EEG map and is scored.
- `lucid-dreaming`: Hearne (1975; thesis 1978) and LaBerge et al. (1981): agreed left-right eye signals from within REM sleep. Konkoly et al. (2021): two-way communication, with dreamers answering questions such as simple sums on a minority of trials, across four labs. The learner finds the signal in an eye-movement trace.
- `anaesthesia`: Morton's ether demonstration (1846). Many agents (propofol, the volatile gases) enhance GABA-A receptors; ketamine blocks NMDA receptors and can leave vivid experience behind an unresponsive body. Separate three things: responsiveness, experience, and later recall. Isolated forearm technique (Tunstall 1977): Sanders et al. (2017) found about 1 in 20 patients responded to command after intubation, almost none with later recall. Reported awareness with recall is rare: about 1 in 19,000 by spontaneous report (NAP5, Pandit et al. 2014), about 1 to 2 in 1,000 when patients are interviewed (Sebel et al. 2004). Nothing here is medical advice. The learner sets a dose in a schematic and sees the three measures separate.
- `disorders-of-consciousness`: coma; the vegetative state (Jennett & Plum 1972), now also called unresponsive wakefulness syndrome (Laureys et al. 2010); the minimally conscious state (Giacino et al. 2002). Owen et al. (2006): a patient imagining tennis and walking through her home showed the same brain responses as healthy volunteers. Monti et al. (2010): 5 of 54 patients modulated brain activity on command, and one answered yes/no questions. Later EEG and fMRI studies find covert command-following in a substantial minority (Claassen et al. 2019; Bodien et al. 2024). Limits: a negative result does not show absence of awareness. Respectful language; no prognosis and no medical advice. The learner reads schematic imagery responses as yes or no.
- `split-brain-unity`: Sperry, Bogen and Gazzaniga from the 1960s (Sperry's Nobel Prize, 1981): each hemisphere responds to what it alone was shown. Pinto et al. (2017): two patients could report a stimulus anywhere in the visual field with either hand or by speech, "split perception but undivided consciousness". Contested (Volz & Gazzaniga 2017, on cross-cueing; few patients). Link to Mind In Motion's `split-brain`. The learner runs both classic and Pinto-style trials on a simulated patient.
- `psychedelics`: Hofmann (1943). Classic psychedelics act mainly at the serotonin 2A receptor (Vollenweider et al. 1998: ketanserin blocks psilocybin's effects). Carhart-Harris et al. (2012) on psilocybin and brain activity; the entropic-brain hypothesis (Carhart-Harris et al. 2014) presented as a hypothesis; higher signal diversity (Schartner et al. 2017). Evidence limits: small samples, selected volunteers, and blinding that fails because people can tell what they took. Neutral tone, no encouragement, no dosing detail. The learner compares signal-diversity scores across states in published-style data.

**Era 5: the self**
- `body-ownership`: Botvinick & Cohen (1998), the rubber hand: link to Senses In Motion (`rubber-hand`), do not rebuild it. Full-body illusion (Lenggenhager, Tadi, Metzinger & Blanke 2007); Ehrsson (2007). Mark the suggestibility critique of questionnaire measures (Lush et al. 2020). The learner changes stroking synchrony in a simulation and sees drift and ownership ratings from the published pattern.
- `agency`: Kornhuber & Deecke (1965), the readiness potential; Libet et al. (1983): it begins about half a second before movement, and the reported urge about 200 ms before. Critiques of the clock report. Schurger, Sitt & Dehaene (2012): the readiness potential may be averaged noise crossing a threshold, not a decision. Wegner (2002), *The Illusion of Conscious Will*; intentional binding (Haggard, Clark & Kalogeras 2002). The learner does the Libet clock task; their reported time is real, the brain trace is simulated and labelled.
- `the-interpreter`: Gazzaniga & LeDoux (1978): the left hemisphere explains actions that the right hemisphere chose. Johansson, Hall, Sikström & Olsson (2005), choice blindness: about a quarter of swapped choices were detected, and people gave reasons for choices they had not made. The learner chooses between abstract patterns (no faces of real people) and on a few trials is handed the other one; this is the one planned concealment in the era and is explained immediately afterwards.
- `mirror-self-recognition`: Gallup (1970), chimpanzees and the mark test; human children from about 18 to 24 months (Amsterdam 1972). Reported passes: great apes, bottlenose dolphins (Reiss & Marino 2001), an Asian elephant (Plotnik, de Waal & Reiss 2006), magpies (Prior et al. 2008; a later replication failed), cleaner wrasse (Kohda et al. 2019; contested). Limits: the test favours visual, grooming animals, and passing shows self-recognition, not experience. The learner applies scoring rules to described behaviours.
- `interoception`: James (1884) and Lange on emotion as felt bodily change; Craig (2002); Critchley et al. (2004) on the insula and heartbeat detection. Seth's "beast machine" view (Seth 2013; *Being You*, 2021) presented as a view. Weak measure: heartbeat counting (Schandry 1981) is inflated by guessing from one's known heart rate (Zamariola et al. 2018). The learner counts heartbeats silently for a timed interval and compares with a count taken at the wrist; the scene states the measure's weakness.
- `self-over-time`: Locke's memory criterion and the circularity objection (Butler, Reid). Patients: H.M. (Scoville & Milner 1957), Clive Wearing, and Tulving's patient K.C., who kept knowledge of his own traits without episodic memories. Parfit (1984), *Reasons and Persons*, in one scene; link to Philosophy In Motion. The learner answers a teletransporter-style case and sees which criterion their answers fit.

**Era 6: theories**

Every theory lesson has the same three parts: the claim, what it predicts, and what counts against it.

- `global-workspace`: Baars (1988), *A Cognitive Theory of Consciousness*; the neuronal version (Dehaene, Kerszberg & Changeux 1998; Dehaene & Changeux 2011). Predicts late ignition and prefrontal–parietal involvement. Against: no-report results, and the 2023 adversarial test. The learner lets contents compete for a workspace and sees one broadcast.
- `integrated-information`: Tononi (2004); IIT 3.0 (Oizumi, Albantakis & Tononi 2014). Predicts a posterior substrate, little contribution from the cerebellum despite its neuron count, and no consciousness in purely feedforward systems. Against: Φ cannot be computed for real brains; simple grid-like systems come out highly conscious (Aaronson 2014); the unfolding argument (Doerig et al. 2019). In 2023 an open letter signed by over 100 researchers called IIT pseudoscience; others replied that the label was unjustified. Report both. The learner changes connections in a network of three or four nodes and sees a phi-style score: label it "a toy in the spirit of Φ, not IIT's measure".
- `higher-order`: Rosenthal (1986; 2005); Lau & Rosenthal (2011); Lau's perceptual reality monitoring. Predicts that prefrontal changes alter awareness while leaving task performance (Lau & Passingham 2006). Against: it seems to demand too much of infants and animals, and the "empty higher-order state" objection (Block 2011). The learner matches performance across two conditions while confidence differs.
- `predictive-processing`: Helmholtz's unconscious inference; Rao & Ballard (1999); Friston's free-energy principle; Clark (2013); Seth's "controlled hallucination". It is a framework for the brain; it becomes a theory of consciousness only with additions, and that is the best objection. Link to Mind In Motion (`bayesian-perception`, `predictive-processing`). The learner sets a prior and sensory noise and watches the percept shift.
- `attention-schema`: Graziano & Kastner (2011); Graziano (2013). Predicts that attention is controlled worse without awareness (Webb, Kean & Graziano 2016). Against: it explains why we say we are aware, not experience itself; Graziano accepts this and takes it as the point. The learner controls a spotlight with and without a model of it.
- `adversarial-collaboration`: the Cogitate consortium tested global neuronal workspace theory against IIT with predictions agreed in advance; first results were presented in 2023. Neither theory was fully confirmed: IIT's predicted sustained synchrony within posterior cortex was not found, and GNWT's predicted ignition at stimulus offset was not found. Also in 2023, Koch conceded his 1998 bet with Chalmers that the correlates would be found within 25 years. The learner marks each theory's predictions before the results are shown.

**Era 7: other minds**
- `animal-consciousness`: Griffin (1976), *The Question of Animal Awareness*; Morgan's canon (1894) as the opposing caution. Cambridge Declaration on Consciousness (2012); New York Declaration on Animal Consciousness (2024): strong support for mammals and birds, a realistic possibility for all vertebrates and many invertebrates. Declarations are statements of scientific opinion, not experiments. The learner places animals on a scale and compares with the declarations' wording.
- `octopus-minds`: Godfrey-Smith (2016), *Other Minds*; about 500 million neurons, roughly two-thirds of them in the arms; a lineage separate from vertebrates for over 500 million years. Crook (2021): octopuses avoided a place paired with a painful injection and preferred one paired with pain relief. The learner steers an arm whose local control does part of the work.
- `bees-and-insects`: Bateson et al. (2011): shaken honeybees judge ambiguous odours pessimistically. Solvi, Baciadonna & Chittka (2016): an optimism-like state in bumblebees after sugar. Dona et al. (2022): bumblebees roll balls for no reward, play-like. Barron & Klein (2016) argue the insect brain supports experience. Contested: each finding has an explanation without feeling. The learner runs a judgement-bias test on a simulated bee.
- `infants`: until the 1980s newborns often had surgery with little or no anaesthesia; Anand & Hickey (1987) reviewed the evidence that they feel pain. Kouider et al. (2013): a late, slow brain response to faces in infants of 5 to 15 months. Bayne et al. (2023), "Consciousness in the cradle". Limits: every marker was validated on adults who can report. Careful tone; nothing here is medical or ethical advice. The learner compares infant and adult response timings.
- `sentience-markers`: Birch et al. (2021), the LSE review of evidence in cephalopods and decapods, with eight criteria and graded confidence; the UK Animal Welfare (Sentience) Act 2022. Fish: Sneddon (2003) on nociceptors and behaviour in trout, against Key (2016). Crustaceans: Elwood & Appel (2009), hermit crabs trading shell quality against shocks. The learner grades evidence for several groups against the criteria.
- `other-people`: the problem of other minds; Mill's argument from analogy and its weakness (one case); Wittgenstein's beetle in the box. The inverted spectrum (Locke, 1690). Link to Mind In Motion's `theory-of-mind` and to Philosophy In Motion. The learner swaps a colour mapping and checks that every behavioural test still gives the same answer.

**Era 8: machines and open questions**
- `turing-test`: Turing (1950), "Computing machinery and intelligence": the imitation game, and his reply to the "argument from consciousness". ELIZA (Weizenbaum 1966) and how readily people attribute understanding. The test measures behaviour in conversation; say what it does and does not show. The learner judges short transcripts and sees how they did.
- `chinese-room`: Searle (1980), "Minds, brains, and programs". The systems reply (the room as a whole understands), Searle's answer (memorise the rule book), and the robot reply. The argument is about understanding; say where it does and does not carry over to experience. The learner follows the rule book to answer a question in symbols they cannot read.
- `machine-indicators`: Butlin, Long et al. (2023), "Consciousness in artificial intelligence": indicator properties drawn from recurrent processing, global workspace, higher-order, attention schema and predictive processing theories, assuming computational functionalism. Their conclusion: no system assessed was a strong candidate, and no obvious technical barrier stands in the way. Best objection: the assumption may be false (Searle; IIT; views that tie experience to living bodies). The learner ticks indicators for described architectures.
- `machine-self-report`: a language model learns from human writing about experience, and its statements can be shifted by instructions and training, so "I am conscious" and "I am not conscious" are both weak evidence. The 2022 LaMDA episode as an example of the problem. Human self-report is imperfect too (link to `trusting-reports`). Present the question as open. The learner changes an instruction and watches a schematic model's self-description change while nothing else does.
- `illusionism-panpsychism`: illusionism (Dennett 1991, *Consciousness Explained*; Frankish 2016); best objection: the seeming is itself an experience. Panpsychism (Strawson 2006; Goff 2017, 2019); best objection: the combination problem (stated by William James in 1890), and that it makes no testable prediction. Give each its strongest form. The learner matches objections to replies.
- `open-questions`: what could settle it: more adversarial collaborations, better no-report methods, tests that do not assume one theory. Moral stakes: the costs of wrongly denying and of wrongly attributing experience (Birch 2024, *The Edge of Sentience*). The learner sets their own credences and a threshold for caution and sees what follows; there is no right answer and the scene says so.

## Files and naming

- **Your files:** `src/scenes-N-<stageid>.js`, `src/scenes-N-lessons.js` and `src/scenes-N-words.js`. Placeholder versions exist; replace them wholesale.
- **Helper names:** prefix top-level helpers with `KN_` (for example `K3_`).
- **Scene ids:** `<lesson-id>-<word>`.
- **Scenes per lesson:** 3, or 4 where the topic is rich.
- **Do not edit:** the engine, the tests, `curriculum.js`, or other eras' files.
- **Order:** register lessons in route order.

## Consciousness rules

### No settled theory
- Every scene about a theory states what the theory predicts and what counts against it.
- No theory is presented as the answer, in text, in layout or by getting the last word.
- Philosophical positions are presented fairly, in a form their defenders would accept, each with its best objection.
- Toy models are labelled as toys in the picture, not only in the hint.

### The learner as participant
- Take part where a screen allows: masking, bistable figures, inattentional and change blindness, attention tasks, report and confidence.
- The MIND-BRIEF participant rules apply: no data leaves the page (say so once per experiment, in the hint), short runs, `performance.now()` for timing, `shuffled()` and `nextSeed()` for order, the learner's data beside the published result, a labelled simulated participant in Watch.
- No deception beyond what a demonstration needs (not announcing the unexpected object; the swap in choice blindness), and it is always explained straight after, on the same scene.
- Never frighten or shame. A learner who "fails" a demonstration has produced the normal result; say so.

### Safety
- Never flash at more than 3 per second, and avoid large high-contrast flicker (WCAG 2.3.1).
- Masking demonstrations use brief single presentations, one target and one mask per trial, started by the learner. No flickering streams, no rapid serial presentation.
- Change blindness is done with slow alternation, gradual change or mudsplashes, not the original fast flicker.
- Sound only from `on` handlers, at default volume or below.

### Honesty
Mark these as contested, weak or overstated:
- unconscious semantic priming, and "subliminal advertising" (Vicary's 1957 claim was a hoax)
- the P3b as a signature of consciousness
- Libet's experiment as a disproof of free will
- two separate minds in a split brain
- the mirror test as a test of consciousness
- heartbeat counting as a measure of interoception
- "left-brain interpreter" stretched into left-brain and right-brain personalities
- the entropic brain, and any claim that psychedelics give a "higher" state
- insect emotion
- any statement that a theory "has been proved" or "has been refuted" by the 2023 tests

Include 2025–2026 results only if you are certain of them; otherwise leave them out. `research` lines cite real work with a year. Where unsure of a detail, say less.

### Patients, drugs and machines
- Describe people with disorders of consciousness, and people who were aware under anaesthesia, respectfully and as people. Use current terms. Nothing in the course is medical advice, and the relevant scenes say so.
- Describe psychedelics neutrally, with the limits of the evidence, no encouragement and no practical detail.
- Present claims that AI systems are or are not conscious as open. Give the reasons self-report is unreliable evidence in either direction. Do not have the course speak for any AI system.

### Sister courses
Link; do not repeat. Add a `SOURCE` with a one-line note:
- Mind In Motion, `https://mind-in-motion.puter.site/`: signal detection, split-brain, theory of mind, predictive processing, the replication crisis.
- Senses In Motion, `https://senses-in-motion.puter.site/`: the rubber hand, multisensory integration, the blind spot.
- Philosophy In Motion, `https://philosophy-in-motion.puter.site/`: Descartes, personal identity and Parfit, other minds.

### Credit
Credit people often left out:
- Elisabeth of Bohemia
- Patricia Churchland
- Anne Treisman
- Melanie Boly
- Francesca Siclari
- Karen Konkoly
- Lucia Melloni (the adversarial collaboration)
- Sarah Garfinkel
- Robyn Crook
- Lynne Sneddon
- Kristin Andrews

## Sound and 3D

- **Sound:** rarely needed here. Use it only in `on` handlers, and never make a scene depend on it.
- **3D:** use it only where depth helps. Good cases: a Necker cube, feedforward and feedback paths through a layered cortex, the spread of a TMS response over a cortical sheet. At most one or two per era.

## Glossary

- Add `WORD` entries for key terms and people, keyed `person-<surname>`.
- Check `grep -h "key:'" src/scenes-*-words.js` before adding. The placeholder files define two starter keys per era; your replacement may keep or rewrite your own era's.
- A person belongs to the era where they first appear in the notes above:

| Era | People |
| --- | --- |
| 1 | Descartes, Elisabeth of Bohemia, Nagel, Chalmers, Jackson, Block, Putnam, Nisbett, Schwitzgebel |
| 2 | Marcel, Weiskrantz, Necker, Logothetis, Mack, Simons, Rensink, Koch, Tsuchiya |
| 3 | Crick, Dehaene, Lamme, Boly, Massimini, Casali, Pitts |
| 4 | Aserinsky, Kleitman, Siclari, Hearne, LaBerge, Konkoly, Owen, Laureys, Sperry, Gazzaniga, Pinto, Carhart-Harris |
| 5 | Botvinick, Lenggenhager, Blanke, Libet, Schurger, Wegner, Johansson, Gallup, Seth, Garfinkel, Parfit |
| 6 | Baars, Tononi, Rosenthal, Lau, Friston, Graziano, Melloni |
| 7 | Griffin, Godfrey-Smith, Crook, Chittka, Birch, Sneddon, Andrews, Wittgenstein |
| 8 | Turing, Searle, Butlin, Long, Dennett, Frankish, Goff, Strawson |

## Build and test your era only

```sh
S=<a scratch directory outside the repository>
cd /home/user/consciousness-in-motion
STAGES=N OUT=$S/kN.html python3 build.py
FILE=$S/kN.html SHOTS=$S/shots-kN ALLSHOTS=1 SAMPLE=<one id> timeout 900 node test/check.js
FILE=$S/kN.html timeout 900 node test/text-layout.js 375
FILE=$S/kN.html timeout 900 node test/text-layout.js 320
FILE=$S/kN.html SHOTS=$S/shots-kN timeout 300 node test/three.js
```

A `STAGES=N` build contains only your era, so `prior` and `THREAD` ids from other eras are dropped in it; that is expected.

After the tests:
- Look at every `try-*.png` and `three-*.png` and fix what you find.
- Check the models numerically: d′ and criterion, the complexity score, the phi-style toy, Bayes posteriors, any timing you display.
- Check presentation rates: list every `ctx.every` and `ctx.later` interval and confirm nothing alternates faster than 3 per second.
- Confirm that no sound plays outside `on` handlers: `grep` your file for `AUDIO.`.
- Write scripts with the Write tool, not shell heredocs containing JS.
- Never delete files other than replacing your era's three. Do not commit. Stay on branch `consciousness`.

**Final report:** for each lesson, list its scene ids with one line each: "interaction — why — research cited (status: robust, contested or weak)". Then give the 3D scenes, the numerical checks, the safety measures taken (presentation rates, any concealment and where it is explained), the facts you are least sure of, and any problems left.
