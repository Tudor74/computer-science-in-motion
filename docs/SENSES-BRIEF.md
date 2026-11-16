# Senses In Motion: brief for era authors

Senses In Motion runs on the shared In Motion engine, on branch `senses`, with sound. It covers how human vision, hearing, smell and touch work: two eras for each sense, then a final era on the senses together. Within each sense, follow the order of discovery, from the organ to the brain.

The course is built around experiences the learner can have through a screen:
- visual illusions and colour tests (they can be done on screen)
- hearing tests: pure-tone thresholds at safe levels, binaural localisation with headphones, the McGurk effect drawn as animated mouth shapes, masking
- touch: two-point thresholds and vibration done as simulations, plus the learner's own fingertip and phone-vibration tasks where it is honest to include them
- smell: cannot be delivered through a screen. Use simulations, the learner's own kitchen tasks, and their ratings set against published data.

Where the learner takes part, draw their data next to the published result.

**Read first**
- `docs/HCI-BRIEF.md`: general rules, experiments, text and 3D.
- `docs/MIND-BRIEF.md`: rules for the learner as participant (privacy, no deception).
- `docs/MUSIC-BRIEF.md`: sound rules (`AUDIO` only from `on` handlers).

**Reference scenes**
- `git show mind:src/scenes-5-brain.js` (receptive fields). Link to it rather than repeat it.
- `git show music:src/scenes-5-timbre.js` (the ear, loudness)
- `git show music:src/scenes-8-perception.js` (pitch experiments)
- `git show language:src/scenes-5-learning.js` (speech perception)

## The route: fixed lesson ids

Each lesson id is also the id of the lesson's first scene. `prior` and `THREAD` entries may use any of these ids, across eras.

| Era (stage id) | Lessons |
| --- | --- |
| 1 `eye` | eye-optics, photoreceptors, dark-adaptation, trichromacy, opponent-colour, colour-blindness |
| 2 `seeing` | lateral-inhibition, depth-stereo, motion-perception, visual-illusions, face-perception, blind-spot-filling |
| 3 `ear` | outer-middle-ear, cochlea, hair-cells, hearing-range, hearing-loss, cochlear-implants |
| 4 `listening` | sound-localisation, auditory-scene, speech-perception, pitch-perception, masking, hearing-in-noise |
| 5 `smell` | odorant-receptors, olfactory-bulb, smell-thresholds, odour-mixtures, smell-memory, smell-loss |
| 6 `flavour` | five-tastes, retronasal-smell, pheromones, smell-emotion, smell-training, how-many-smells |
| 7 `touch` | skin-receptors, touch-acuity, vibration, pain, temperature, proprioception |
| 8 `together` | multisensory-integration, rubber-hand, synaesthesia, sensory-substitution, sensory-ageing, affective-touch |

### Lesson notes

**Era 1: the eye**
- `eye-optics`: Kepler 1604 (the retinal image), accommodation, myopia and lenses.
- `photoreceptors`: rods and cones, rhodopsin, and Wald's work.
- `dark-adaptation`: the two-branch curve (Hecht).
- `trichromacy`: Young–Helmholtz, Maxwell's colour matching, and cone spectra (Stockman & Sharpe). The learner mixes RGB light to match a target.
- `opponent-colour`: Hering. Include an afterimage the learner can experience safely.
- `colour-blindness`: Dalton's own account, Ishihara-style plates (described accurately, with the caveat that a screen test is not a diagnosis), simulation of the protan, deutan and tritan types, and prevalence (about 8% of men of northern European descent, about 0.5% of women).

**Era 2: seeing**
- `lateral-inhibition`: Mach bands, the Hermann grid, and Hartline in *Limulus*.
- `depth-stereo`: Wheatstone's 1838 stereoscope, random-dot stereograms (Julesz), and the depth cues.
- `motion-perception`: the waterfall illusion (motion aftereffect), and phi/beta motion.
- `visual-illusions`: Müller-Lyer (with cross-cultural differences: Segall 1963, plus the later debates), Ebbinghaus, the checker shadow (Adelson), and the dress (2015).
- `face-perception`: the fusiform face area (Kanwisher 1997), the Thatcher illusion, prosopagnosia, and super-recognisers.
- `blind-spot-filling`: Mariotte; the learner finds their own blind spot.

**Era 3: the ear**
- `outer-middle-ear`: the ossicles as an impedance matcher (area ratio and lever).
- `cochlea`: von Békésy's travelling wave and the cochlea's tonotopic map. A 3D view of the unrolled cochlea is natural here.
- `hair-cells`: mechanotransduction and outer hair cells as an amplifier (otoacoustic emissions, Kemp 1978).
- `hearing-range`: threshold against frequency. The learner may run a safe, relative threshold sweep: start quiet, cap the volume, give a clear warning, and state that the results are relative to their device, not calibrated.
- `hearing-loss`: noise-induced, presbycusis, the 85 dB guideline, and "hidden hearing loss" (Kujawa & Liberman 2009, in mice, so mark human evidence as debated).
- `cochlear-implants`: the number of channels, a vocoder simulation (Shannon et al. 1995), which is good with sound. Note Deaf culture perspectives respectfully.

**Era 4: listening**
- `sound-localisation`: interaural time and level differences (ITD and ILD), Rayleigh's duplex theory, and the cone of confusion. Include a headphone ITD demo, with a note that headphones are required.
- `auditory-scene`: Bregman's streaming, which can be heard with alternating tones.
- `speech-perception`: the McGurk effect, using SVG mouth animation with a synthesised /ba/ (be honest that it is approximate), and categorical perception. Link to Language In Motion.
- `pitch-perception`: link to Music; cover place against temporal codes.
- `masking`: critical bands (Fletcher) and the noise masking a tone.
- `hearing-in-noise`: the cocktail party, and the benefit of spatial release.

**Era 5: smell**
- `odorant-receptors`: Buck & Axel 1991 (Nobel 2004), about 400 functional human receptor genes, and combinatorial coding.
- `olfactory-bulb`: glomeruli, and the direct path to the amygdala and hippocampus.
- `smell-thresholds`: wide ranges and specific anosmias (androstenone, Keller 2007).
- `odour-mixtures`: limits on identifying components in a mixture (Laing: about 3–4), and olfactory white (Weiss 2012).
- `smell-memory`: the Proust phenomenon. Evidence is moderate: odour-evoked memories are older and more emotional (Herz), but mark popular claims as overstated.
- `smell-loss`: COVID anosmia and recovery data, and smell loss as an early sign in Parkinson's disease.

**Era 6: taste and flavour**
- `five-tastes`: correct the tongue-map myth (Hänig 1901 as mistranslated by Boring 1942), umami (Ikeda 1908), and the fat-taste debate.
- `retronasal-smell`: most "flavour" is smell. Use the classic hold-your-nose jelly-bean test, which the learner can do at home.
- `pheromones`: human pheromones are not established (Wyatt 2015). Mark the McClintock 1971 menstrual-synchrony claim as not supported by later work.
- `smell-emotion`: hedonic ratings and cultural variation (the Jahai, Majid 2014).
- `smell-training`: smell training for recovery (Hummel 2009); evidence is moderate.
- `how-many-smells`: the "1 trillion smells" claim (Bushdid 2014), its critiques (Meister 2015; Gerkin & Castro 2015), and its status as contested.

**Era 7: touch**
- `skin-receptors`: the four mechanoreceptor types (Meissner, Merkel, Pacinian, Ruffini) and Johansson & Vallbo.
- `touch-acuity`: two-point thresholds by body site (Weinstein 1968) and grating orientation as the better measure. The learner can test themselves with two paperclips; give the instructions.
- `vibration`: frequency tuning, and a phone-vibration self-test.
- `pain`: gate control (Melzack & Wall 1965), nociceptors, and the placebo effect (be careful with the evidence).
- `temperature`: TRP channels (Julius & Patapoutian, Nobel 2021), with capsaicin and menthol.
- `proprioception`: muscle spindles, Piezo2, and the case of Ian Waterman.

**Era 8: senses together**
- `multisensory-integration`: optimal cue combination (Ernst & Banks; link to Mind), and the ventriloquism effect.
- `rubber-hand`: Botvinick & Cohen 1998. It is robust, but mark that the questionnaire measures have been critiqued (Lush 2020: suggestibility).
- `synaesthesia`: prevalence (about 4%, Simner 2006) and consistency tests.
- `sensory-substitution`: Bach-y-Rita's tactile vision, the vOICe, and the BrainPort.
- `sensory-ageing`: presbyopia, presbycusis and smell decline with age.
- `affective-touch`: C-tactile afferents responding best to stroking at 1–10 cm/s (Löken 2009).

## Files and naming

- **Your files:** `src/scenes-N-<stageid>.js`, `src/scenes-N-lessons.js` and `src/scenes-N-words.js`.
- **Helper names:** prefix top-level helpers with `SN_` (for example `S3_`).
- **Scene ids:** `<lesson-id>-<word>`.
- **Scenes per lesson:** 3, or 4 where the topic is rich.
- **Do not edit:** the engine, the tests, `curriculum.js`, or other eras' files.
- **Order:** register lessons in route order.

## Senses rules

### Safety first
- Never flash at more than 3 per second. Avoid large high-contrast flicker (photosensitive epilepsy guidance, WCAG 2.3.1).
- Keep sounds at default volume or below. Ramp onsets.
- Hearing tests must say "not a diagnosis; see an audiologist", and the same applies to colour-vision screens.
- Afterimage demos should use short fixations and moderate contrast.

### Honesty
Mark these as myths, contested or overstated:
- the tongue map
- "1 trillion smells"
- human pheromones
- menstrual synchrony
- "we use 5 senses" (there are many more)
- carrots improving night vision (wartime propaganda)
- "the eye is like a camera" (partly true)

### Breadth and respect
- Use examples from many cultures. For example, the Jahai and Maniq smell vocabulary (Majid), and the cross-cultural Müller-Lyer results.
- Describe blindness, Deafness and anosmia respectfully. Include Deaf culture perspectives on implants.

### Credit
Credit people often left out:
- Linda Buck
- Christine Ladd-Franklin (colour theory)
- Margaret Livingstone
- Nancy Kanwisher
- Asifa Majid
- Ardem Patapoutian
- India Morrison (affective touch)
- Julia Simner

## Sound and 3D

- **Sound:** essential in eras 3–4. Use it only in `on` handlers. Make it headphone-aware where needed.
- **3D:** use it only where depth helps. Good cases: the eye's optics, the unrolled cochlea, a cone-response colour solid, a random-dot stereogram's hidden surface, and the skin's layers with receptors. At most one or two per era.

## Glossary

- Add `WORD` entries for key terms and people, keyed `person-<surname>`.
- Check `grep -h "key:'" src/scenes-*-words.js` before adding.
- A person belongs to the era where they first appear in the notes above.

## Build and test your era only

```sh
S=/tmp/claude-0/-home-user-computer-science-in-motion/7e28ded3-3dbc-5cc3-810c-b1bae2c3d852/scratchpad
cd /home/user/computer-science-in-motion
STAGES=N OUT=$S/sN.html python3 build.py
FILE=$S/sN.html SHOTS=$S/shots-sN ALLSHOTS=1 SAMPLE=<one id> timeout 900 node test/check.js
FILE=$S/sN.html timeout 900 node test/text-layout.js 375
FILE=$S/sN.html timeout 900 node test/text-layout.js 320
FILE=$S/sN.html SHOTS=$S/shots-sN timeout 300 node test/three.js
```

After the tests:
- Look at every `try-*.png` and `three-*.png` and fix what you find.
- Check the models numerically: ITD from head width, the middle-ear gain, the cone-mixing matches, Weber fractions and vocoder channels.
- Write scripts with the Write tool, not shell heredocs containing JS.
- Never delete files. Do not commit. Stay on branch `senses`.

**Final report:** for each lesson, list its scene ids with one line each: "interaction — why — research cited (status)". Then give the 3D scenes, the numerical checks, the safety measures taken, the facts you are least sure of, and any problems left.
