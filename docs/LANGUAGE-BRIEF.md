# Language In Motion: brief for era authors

Language In Motion uses the shared In Motion engine on branch `language`, sound included. The course tells the history of how people have understood language, in order.

In Try it the learner does one of two things:
- **Operates the structure:** builds a tree, applies a sound law, segments a speech stream, trains a tiny model.
- **Takes part:** in classic experiments such as Saffran's word segmentation, garden-path reading times, categorical perception, the Stroop-like colour-naming tasks, and implicature judgements. Their own results are drawn beside the published ones.

**Read before you start:**
- `docs/HCI-BRIEF.md`: the general rules (research lines, honesty about evidence, experiments with `ctx.later`/`ctx.every`/`performance.now()`, and the text and 3D rules).
- `docs/MIND-BRIEF.md`: learner-as-participant rules.
- `docs/MUSIC-BRIEF.md`: sound rules. `AUDIO` may be called only from `on` handlers.

**Reference scenes:**
- `git show mind:src/scenes-3-information.js`: timed experiments.
- `git show mind:src/scenes-8-models.js`: a small trainable model.

## The route: fixed lesson ids

Each lesson id is also the id of the lesson's first scene. `prior` and `THREAD` may use any of these ids, across eras.

| Era (stage id) | Lessons |
| --- | --- |
| 1 `writing` (3400 BCE–1500) | clay-tokens, logograms, alphabet, decipherment, printing, scripts-of-the-world |
| 2 `families` (1786–1900) | language-families, comparative-method, grimms-law, great-vowel-shift, phonetics-ipa, language-trees |
| 3 `structure` (1916–1960) | saussure-sign, phonemes, morphology, zipf-law, redundancy-entropy, linguistic-relativity |
| 4 `grammar` (1957–2000) | syntax-trees, recursion, formal-grammars, garden-paths, universals, sign-languages |
| 5 `learning` (1970–today) | infant-perception, statistical-learning, word-learning, critical-period, bilingualism, reading-brain |
| 6 `meaning` (1950–today) | reference-sense, implicature, speech-acts, metaphor, colour-terms, turn-taking |
| 7 `society` (1960–today) | variation, sound-change-s-curve, contact-creoles, endangered-languages, accents-attitudes, world-englishes |
| 8 `machines` (1949–today) | machine-translation, n-grams, word-embeddings, attention, large-language-models, understanding-debate |

### Lesson notes

**Era 1, writing**
- `clay-tokens`: Schmandt-Besserat's token theory, and its critics.
- `logograms`: Chinese characters, rebus and phonetic components. Include the Maya script.
- `alphabet`: Proto-Sinaitic, then Phoenician, then Greek (adding vowels), then Latin, with letter shapes drawn evolving.
- `decipherment`: the Rosetta Stone (Champollion), and Linear B (Alice Kober's grids, then Ventris). Mention Linear A as still undeciphered.
- `scripts-of-the-world`: Hangul (designed in 1443 with featural shapes), Cherokee (Sequoyah), abjads and abugidas.

**Era 2, families**
- `language-families`: Sir William Jones 1786.
- `comparative-method`: reconstruct a proto-word from cognates.
- `grimms-law`: apply it to Latin and Greek words to get the English ones. Include Verner's law as the "exception that proves regularity".
- `great-vowel-shift`: show it on a vowel chart, with sound.
- `phonetics-ipa`: a clickable vowel trapezoid and consonant chart, with synthesised vowels via formants where feasible (see the Music branch's voice-formants for an approach).
- `language-trees`: Schleicher's tree, against wave models, and Gray & Atkinson 2003 with its dating controversy.

**Era 3, structure**
- `zipf-law`: rank against frequency on log–log axes, from a built-in text.
- `redundancy-entropy`: Shannon's 1951 guessing game. The learner guesses the next letter, and their entropy is estimated.
- `linguistic-relativity`: Sapir–Whorf, the snow-words myth (Pullum 1991), Russian blues (Winawer 2007), and spatial frames (Levinson). Mark it as weak relativity, with evidence. Strong determinism is not supported.

**Era 4, grammar**
- `syntax-trees`: build a tree by merging words.
- `recursion`: centre embedding, and why "the rat the cat the dog chased bit ate" fails. Include the Pirahã debate (Everett 2005; Nevins, Pesetsky & Rodrigues 2009), presented fairly.
- `formal-grammars`: the Chomsky hierarchy, with a toy automaton.
- `garden-paths`: "the horse raced past the barn fell", run as a self-paced reading experiment.
- `universals`: Greenberg's word-order universals, Evans & Levinson 2009 ("the myth of language universals"), and Dunn et al. 2011.
- `sign-languages`: Stokoe 1960 (ASL is a full language), and Nicaraguan Sign Language (Senghas 2004).

**Era 5, learning**
- `infant-perception`: Werker & Tees 1984 perceptual narrowing, and Kuhl.
- `statistical-learning`: Saffran, Aslin & Newport 1996 transitional probabilities. The learner hears or sees a syllable stream and picks words against part-words.
- `word-learning`: fast mapping (Carey) and cross-situational learning (Yu & Smith).
- `critical-period`: Johnson & Newport 1989, and Hartshorne et al. 2018.
- `bilingualism`: the "bilingual advantage" in executive function largely failed to replicate (Paap; de Bruin 2015 publication bias). Say so.
- `reading-brain`: Dehaene's visual word form area and neuronal recycling. Include dyslexia without myths.

**Era 6, meaning**
- `reference-sense`: Frege's morning star and evening star.
- `implicature`: Grice's maxims, and scalar implicature ("some" means "not all") as a judgement task.
- `speech-acts`: Austin and Searle.
- `metaphor`: Lakoff & Johnson.
- `colour-terms`: Berlin & Kay 1969, the World Color Survey, and critiques.
- `turn-taking`: Sacks, Schegloff & Jefferson 1974, and Stivers et al. 2009 (gaps of about 200 ms across 10 languages).

**Era 7, society**
- `variation`: Labov's 1966 department-store study, rerun as a simulation.
- `sound-change-s-curve`: the S-curve of a change spreading through speakers.
- `contact-creoles`: pidgins and creoles. Include the Bickerton debate.
- `endangered-languages`: about 7,000 languages; Ethnologue and Glottolog figures as approximate.
- `accents-attitudes`: matched-guise studies (Lambert 1960).
- `world-englishes`: Kachru's circles.

**Era 8, machines**
- `machine-translation`: the 1954 Georgetown–IBM experiment, and the ALPAC report 1966.
- `n-grams`: Shannon's approximations, and the learner generates text from a built-in corpus.
- `word-embeddings`: word2vec 2013, king − man + woman, and its bias (Bolukbasi 2016; Caliskan 2017). The 3D view is natural here.
- `attention`: Vaswani et al. 2017. Show attention weights on a sentence.
- `large-language-models`: next-token prediction, temperature and scaling laws (Kaplan 2020). Mark the scaling claims as empirical fits.
- `understanding-debate`: Bender & Koller 2020 ("octopus"), against other views. Present it as open.

## Files and naming

- **Your files:** `src/scenes-N-<stageid>.js`, `src/scenes-N-lessons.js` and `src/scenes-N-words.js`.
- **Helper prefix:** `LN_` (for example `L4_`).
- **Scene ids:** `<lesson-id>-<word>`.
- **Lesson size:** 3 scenes per lesson, or 4 where the topic is rich.
- **Do not edit:** the engine, the tests, `curriculum.js`, or other eras' files.
- **Order:** register lessons in route order.

## Language rules

### Breadth and respect

- Use examples from many languages and scripts, not just English: Chinese, Arabic, Hindi, Swahili, Japanese, Turkish, Finnish, Navajo, Pirahã, sign languages and others.
- Render non-Latin scripts with system fonts and check they display. If a glyph may not render, draw it as SVG paths or fall back to romanisation.
- Use IPA in `<text>` with a font stack that includes `"Noto Sans", "Segoe UI Symbol", sans-serif`.
- Describe Indigenous and minority languages respectfully, without exoticism.

**People to credit:**
- Alice Kober
- Mary Haas
- Ursula Bellugi
- Patricia Kuhl
- Janet Werker
- Elissa Newport
- Jenny Saffran
- Lera Boroditsky (state that some of her findings have replication issues)
- Penelope Brown
- Emily Bender
- Timnit Gebru

### Honesty

- **Myths to state plainly as myths:**
  - "Eskimo words for snow"
  - "Shakespeare invented 1,700 words" (many are earlier attestations)
  - "language X has no grammar"
  - "people only use 10%…"
  - "bilingual advantage" as settled fact
  - strong Sapir–Whorf
- **Contested topics, presented as contested:**
  - Pirahã recursion
  - Gray & Atkinson's dates
  - Bickerton's bioprogram
  - Chomsky versus usage-based accounts
- **Replication:** mark replication status where it matters.

### Sound

- Use sound for vowels (formant synthesis), sound changes, syllable streams (Saffran) and tones (for example the four Mandarin tones as pitch contours).
- Play sound only from `on` handlers.
- Keep the speech synthesis simple and say so. Do not use the Web Speech API: it needs a network on some platforms and varies by device.

### 3D

Use 3D only where depth helps: a vowel space (F1, F2, F3), a word-embedding space, a language tree in time, or an attention map. At most one or two per era.

## Glossary

- Add `WORD` entries for key terms and for people, with key `person-<surname>`.
- Check `grep -h "key:'" src/scenes-*-words.js` before adding.
- A person belongs to the era where they first appear in the lesson notes.

## Build and test your era only

```sh
S=/tmp/claude-0/-home-user-computer-science-in-motion/7e28ded3-3dbc-5cc3-810c-b1bae2c3d852/scratchpad
cd /home/user/computer-science-in-motion
STAGES=N OUT=$S/lN.html python3 build.py
FILE=$S/lN.html SHOTS=$S/shots-lN ALLSHOTS=1 SAMPLE=<one id> timeout 900 node test/check.js
FILE=$S/lN.html timeout 900 node test/text-layout.js 375
FILE=$S/lN.html timeout 900 node test/text-layout.js 320
FILE=$S/lN.html SHOTS=$S/shots-lN timeout 300 node test/three.js
```

After the tests:
- Look at every `try-*.png` and `three-*.png`, and fix overlaps, clipping, unreadable text and missing glyphs (tofu boxes).
- Check computations numerically: Zipf fit, entropy, transitional probabilities, vector arithmetic.
- Write scripts with the Write tool, not shell heredocs containing JS.
- Never delete files. Do not commit. Stay on branch `language`.

**Final report:** for each lesson, list its scene ids with one line each: "interaction — why — research cited (replication status)". Then give the 3D scenes, the numerical checks, the facts you are least sure of, and any problems left.
