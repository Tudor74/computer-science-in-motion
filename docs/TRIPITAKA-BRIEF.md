# Tripitaka In Motion: brief for era authors

Tripitaka In Motion runs on the shared In Motion engine, on branch `tripitaka`. It tells the history of the Buddhist canon (Pali *Tipiṭaka*, Sanskrit *Tripiṭaka*, "three baskets") in historical order: how the teachings were remembered, organised, written, translated, printed and digitised.

The course is about the **history and structure of a body of texts**. It is not religious instruction. In Try it the learner works the mechanisms:
- recite in a group and see where errors creep in
- place a text in its basket
- follow a passage across Pali, Chinese and Tibetan
- collate variant readings
- carve and print a woodblock page
- search a digital canon

**Read first:**
- `docs/HCI-BRIEF.md` for the general rules: research lines, honesty about evidence, `ctx.later`/`ctx.every`, and text and 3D.
- `docs/NELSON-BRIEF.md` for the tone of a history-of-ideas course about texts.

**Reference scenes:**
- `git show language:src/scenes-1-writing.js` (scripts, printing)
- `git show nelson:src/scenes-7-later.js` (`parallel-documents`, side-by-side texts)

## The route: fixed lesson ids (8 eras × 4 lessons)

Each lesson id is also the id of its first scene. `prior` and `THREAD` may use any of these ids.

| Era (stage id) | Lessons |
| --- | --- |
| 1 `oral` | oral-recitation, memory-techniques, bhanakas, languages-of-teaching |
| 2 `baskets` | three-baskets, vinaya-pitaka, sutta-pitaka, abhidhamma-pitaka |
| 3 `councils` | first-council, second-council-schools, ashoka-edicts, dating-the-buddha |
| 4 `writing` | palm-leaf, gandharan-scrolls, commentaries, sanskrit-canons |
| 5 `chinese` | first-translations, kumarajiva, xuanzang, catalogues |
| 6 `tibetan` | tibetan-translation, kangyur-tengyur, comparing-canons, mongolian-manchu |
| 7 `printing` | diamond-sutra-868, song-editions, tripitaka-koreana, royal-editions |
| 8 `modern` | pali-text-society, taisho, digital-canons, parallels-and-finds |

Lesson notes:
- **`oral-recitation`:** communal chanting (*saṅgīti*) as error-checking.
- **`memory-techniques`:** repetition, formulas, numbered lists, verse, and the *mātikā* summary lists. Research on oral transmission: Wynne 2004, Anālayo 2007 and 2022, Allon 1997. The Vedic recitation comparison is useful.
- **`bhanakas`:** reciters who specialised in one collection.
- **`languages-of-teaching`:** Middle Indo-Aryan dialects. Pali is a literary language, not simply "what the Buddha spoke". Gāndhārī and Buddhist Hybrid Sanskrit.
- **`vinaya-pitaka`:** monastic rules and their origin stories. The six surviving Vinayas of different schools.
- **`sutta-pitaka`:** the five Nikāyas, and the four Chinese Āgamas as their parallels.
- **`abhidhamma-pitaka`:** the seven Theravāda books. The Sarvāstivāda Abhidharma differs, which shows this basket developed later and separately.
- **`first-council`:** the Rājagaha account is traditional. Scholars doubt its details. Present both.
- **`second-council-schools`:** Vesālī, and the Sthavira/Mahāsāṃghika split. The accounts differ.
- **`ashoka-edicts`:** the Bairāṭ (Bhabra) edict names texts, the earliest inscriptional reference. The schism edicts.
- **`dating-the-buddha`:** the long chronology (c. 563–483 BCE), the short one, and the revised dating to around 480–400 BCE (Bechert; Gombrich). Mark it as debated.
- **`palm-leaf`:** written down at the Āluvihāra in Sri Lanka in the 1st century BCE according to the chronicles (Dīpavaṃsa, Mahāvaṃsa). Treat this as a traditional account that is plausible. Cover how palm-leaf manuscripts are made, and that they perish, so the oldest surviving Pali manuscripts are late.
- **`gandharan-scrolls`:** birch bark in Kharoṣṭhī script, 1st century BCE to 3rd century CE. The British Library scrolls (Salomon 1999) are the oldest surviving Buddhist manuscripts. Radiocarbon dates.
- **`commentaries`:** Buddhaghosa, 5th century, and the Visuddhimagga.
- **`sanskrit-canons`:** the Sarvāstivāda and others. The Gilgit and Turfan finds. Mahāyāna sūtras and how they relate to the early collections. Describe this respectfully, in each tradition's own terms as well as in the scholarly view.
- **`first-translations`:** An Shigao and Lokakṣema, 2nd century CE.
- **`kumarajiva`:** 344–413, the Chang'an translation bureau and readable Chinese. The Lotus and Diamond sūtras.
- **`xuanzang`:** 602–664, his journey, literal accuracy, the "five kinds of untranslatable terms", and the Heart Sūtra.
- **`catalogues`:** Dao'an, Sengyou, and the Kaiyuan catalogue of 730, which fixed the Chinese canon's structure. Apocrypha and how the cataloguers judged authenticity.
- **`tibetan-translation`:** the early and later diffusion. The Mahāvyutpatti, a standardised Sanskrit–Tibetan glossary, c. 800. Teams of an Indian *paṇḍita* and a Tibetan *lotsāwa*.
- **`kangyur-tengyur`:** Butön, 14th century. Translated words against translated treatises. The Narthang and Derge editions.
- **`comparing-canons`:** what is shared and what is unique. The learner compares sizes and contents.
- **`mongolian-manchu`:** the later canons.
- **`diamond-sutra-868`:** the oldest dated printed book, from Dunhuang, now in the British Library. Earlier printing: the Hyakumantō Darani c. 770 and the Korean Pure Light Dhāraṇī c. 704–751, whose dating is debated.
- **`song-editions`:** the Kaibao canon, 971–983, about 130,000 blocks.
- **`tripitaka-koreana`:** Goryeo, 1236–1251. 81,258 blocks at Haeinsa, a UNESCO site. The Janggyeong Panjeon storage halls' ventilation design.
- **`royal-editions`:** the Kuthodaw Pagoda's 729 marble slabs (1868, "the world's largest book"). The Thai King Chulalongkorn edition of 1893, the first printed Pali canon. The Sixth Council in Burma, 1954–56.
- **`pali-text-society`:** Rhys Davids, 1881. Roman-script editions. Caroline Rhys Davids and I. B. Horner.
- **`taisho`:** the Taishō Tripiṭaka, 1924–34, the standard scholarly Chinese edition, and its numbering.
- **`digital-canons`:** CBETA, SuttaCentral, the Vipassana Research Institute, 84000 (translating the Kangyur), and BDRC. Full-text search changes scholarship.
- **`parallels-and-finds`:** comparing Pali, Chinese and Gāndhārī parallels to study early Buddhism (Anālayo; Bhikkhu Sujato and Brahmali, "The Authenticity of the Early Buddhist Texts", presented as one scholarly position, with sceptics such as Schopen). Recent finds: the Schøyen and Bajaur collections, and the "Split" collection.

## Files and naming

- **Files you own:** `src/scenes-N-<stageid>.js`, `src/scenes-N-lessons.js` and `src/scenes-N-words.js`.
- **Helper names:** prefix top-level helpers with `PN_` (for example `P3_`).
- **Scene ids:** `<lesson-id>-<word>`.
- **Scenes per lesson:** 3, or 4 where the topic is rich.
- **Do not edit:** the engine, the tests, `curriculum.js`, or other eras' files.
- **Order:** register lessons in route order.
- **Sister courses:** link them with `SOURCE`: `https://language-in-motion.puter.site/` (scripts, translation, printing) and `https://ted-nelson-in-motion.puter.site/` (parallel texts).

## Rules

**Respect and neutrality.** These are living religious traditions.
- Describe Theravāda, Mahāyāna and Vajrayāna each in its own terms and with equal respect. Do not rank them.
- Never present one tradition's view of another's scriptures as fact. For example, "Mahāyāna sūtras are later compositions" is the mainstream scholarly dating. Many Mahāyāna traditions hold them to be the Buddha's word, revealed or preserved differently. State both, attributed.
- Avoid "Hīnayāna". Use "early schools", "Śrāvakayāna", or the school names.
- Do not depict the Buddha as a figure. Use the wheel, the footprints, an empty seat (the early aniconic convention), or manuscripts and people at work.
- Do not give instruction in doctrine or practice beyond what is needed to describe a text.
- No jokes at the traditions' expense.

**Evidence labels.** Each scene carries a small tag in the drawing or the caption:
- "traditional account": what the chronicles and commentaries say
- "established": inscriptions, dated manuscripts, radiocarbon, colophons
- "debated": scholars disagree

Give dates with their uncertainty. Label counts of texts, blocks and pages as approximate where sources differ.

**Languages and scripts.**
- Use correct diacritics for Pali and Sanskrit in Roman script (ā ī ū ṃ ṅ ñ ṭ ḍ ṇ ḷ ś ṣ).
- Chinese characters, Tibetan, Devanāgarī, Sinhala, Burmese, Thai and Kharoṣṭhī glyphs may not render on every device, so check for tofu boxes in screenshots. Where a glyph is at risk, draw a stylised SVG impression labelled "impression, not real text", or use romanisation. Never invent pseudo-text presented as real.
- Quote scripture only in very short, well-known phrases with attribution. Otherwise paraphrase.

**People.** Credit women and others often left out:
- the bhikkhunī (nuns') lineages and the Therīgāthā (verses of the elder nuns, among the oldest women's literature)
- Saṅghamittā
- Caroline Rhys Davids
- I. B. Horner
- modern scholars such as Anālayo, Jan Nattier (her Heart Sūtra hypothesis, presented as debated), Richard Salomon, Collett Cox and Ingo Strauch

## 3D and sound

- **3D:** only where depth helps. Good cases are a stack of palm leaves with its cord, a rolled birch-bark scroll, the Haeinsa storage hall's airflow, and a woodblock. At most one per era.
- **Sound:** sparing. A soft tone marking recitation rhythm is acceptable. No chanting imitation and no speech synthesis. Only in `on` handlers.

## Glossary

- Add `WORD` entries for key terms and people, with key `person-<name>`.
- Check `grep -h "key:'" src/scenes-*-words.js` before adding.

## Build and test your era only

```sh
S=/tmp/claude-0/-home-user-computer-science-in-motion/7e28ded3-3dbc-5cc3-810c-b1bae2c3d852/scratchpad
cd /home/user/computer-science-in-motion
STAGES=N OUT=$S/pN.html python3 build.py
FILE=$S/pN.html SHOTS=$S/shots-pN ALLSHOTS=1 SAMPLE=<one id> timeout 900 node test/check.js
FILE=$S/pN.html timeout 900 node test/text-layout.js 375
FILE=$S/pN.html timeout 900 node test/text-layout.js 320
FILE=$S/pN.html SHOTS=$S/shots-pN timeout 300 node test/three.js
```

Then:
- Look at every `try-*.png` and `three-*.png`. Fix overlaps, clipping and missing glyphs.
- Write scripts with the Write tool, not shell heredocs containing JS.
- Never delete files. Do not commit. Stay on branch `tripitaka`.

**Final report:** for each lesson, list its scene ids with one line each: "interaction — evidence label — sources cited". Then list any 3D scenes, the facts you are least sure of, and any problems left.
