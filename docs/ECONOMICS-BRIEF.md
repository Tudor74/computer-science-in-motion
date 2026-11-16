# Economics In Motion: brief for era authors

Economics In Motion runs on the shared In Motion engine on branch `economics`, with sound available. The course tells the history of economic ideas in order. Each idea is shown as a mechanism the learner can steer: they drag supply and demand, run a pin factory, play the prisoner's dilemma against Axelrod's strategies, set an interest rate, start a bank run, or grow a Solow economy. Where a classic experiment can be run, the learner takes part and their result appears next to the published one. Examples: the ultimatum game, the public-goods game, the beauty contest, present-bias choices, and a double-auction market.

## Read first

- `docs/HCI-BRIEF.md` for the general rules: research lines, honesty, `ctx.later`/`ctx.every`, and the text and 3D rules.
- `docs/PHYSICS-BRIEF.md` for deterministic simulation. Seed with `rng(seed)`, never `Math.random`.
- `docs/MIND-BRIEF.md` for the rules on the learner as participant.

## Reference scenes

- `git show mind:src/scenes-6-reasoning.js`: anchoring, loss aversion and base rates. Link to it rather than repeat it.
- `git show biology:src/scenes-6-ecology.js`: the harvesting and logistic models.

## The route: fixed lesson ids

Each lesson id is also the id of the lesson's first scene. `prior` and `THREAD` may use any of these ids, across eras.

| Era (stage id) | Lessons |
| --- | --- |
| 1 `classical` (1776–1870) | division-of-labour, invisible-hand, comparative-advantage, malthus-population, diminishing-returns, labour-theory-value |
| 2 `marginal` (1870–1930) | marginal-utility, supply-demand, elasticity, consumer-surplus, general-equilibrium, externalities |
| 3 `macro` (1929–1975) | great-depression, national-accounts, multiplier, unemployment-phillips, keynes-hayek, bretton-woods |
| 4 `games` (1944–1990) | prisoners-dilemma, nash-equilibrium, axelrod-tournament, beauty-contest, auctions, governing-commons |
| 5 `money` (1950–today) | inflation-money, central-banks, compound-interest, bank-runs, exchange-rates, financial-crises |
| 6 `behaviour` (1979–today) | ultimatum-game, present-bias, public-goods-game, nudges, market-experiments, prospect-theory-markets |
| 7 `development` (1956–today) | solow-growth, inequality-lorenz, poverty-traps, randomised-trials, institutions, trade-globalisation |
| 8 `systems` (1990–today) | agent-based-markets, network-contagion, climate-economics, automation-labour, platform-economies, measuring-wellbeing |

## Lesson notes

### Era 1: classical

- **division-of-labour:** Smith's pin factory, with his figure of 4,800 pins a head against at most 20.
- **invisible-hand:** what Smith actually wrote (the phrase appears once in *Wealth of Nations*), and its later inflation.
- **comparative-advantage:** Ricardo's cloth and wine in England and Portugal. The learner finds the gains.
- **malthus-population:** geometric against arithmetic growth, and why the prediction failed (the demographic transition).
- **labour-theory-value:** Smith, Ricardo and Marx, presented as history of thought. Keep it neutral.

### Era 2: marginal

- **marginal-utility:** Jevons, Menger and Walras, and the water–diamond paradox.
- **supply-demand:** Marshall's scissors. The learner drags the curves and shifts them.
- **general-equilibrium:** Walras's tâtonnement, shown as a toy auctioneer.
- **externalities:** a Pigouvian tax, plus Coase as the counterpoint.

### Era 3: macro

- **great-depression:** use rounded US data, labelled approximate.
- **national-accounts:** Kuznets. Include his own warning that GDP is not welfare.
- **multiplier:** Kahn and Keynes. The learner sets the MPC and watches the rounds of spending.
- **unemployment-phillips:** Phillips 1958, its breakdown in the 1970s stagflation, and Friedman–Phelps expectations.
- **keynes-hayek:** present both views fairly, as a debate.
- **bretton-woods:** fixed rates, the gold window, and the end of the system in 1971.

### Era 4: games

- **prisoners-dilemma:** Flood and Dresher 1950, named by Tucker. The learner plays.
- **nash-equilibrium:** Nash 1950, with best-response arrows in 2×2 games.
- **axelrod-tournament:** Axelrod 1980/84. Run the strategies, including Tit-for-Tat, with noise as an option.
- **beauty-contest:** Keynes 1936, and Nagel 1995's "guess 2/3 of the average". The learner guesses, and their guess appears beside Nagel's distribution and its rounds.
- **auctions:** English, Dutch, first-price and second-price (Vickrey), and revenue equivalence.
- **governing-commons:** Hardin 1968's tragedy against Ostrom 1990's design principles. Credit Elinor Ostrom, the 2009 Nobel.

### Era 5: money

- **inflation-money:** the quantity equation MV = PY, with its limits.
- **central-banks:** the Taylor rule, presented as a description, not a law.
- **compound-interest:** include the rule of 72.
- **bank-runs:** Diamond–Dybvig 1983. The learner chooses to withdraw, as a coordination game. Include Northern Rock 2007 and SVB 2023.
- **exchange-rates:** purchasing power parity, with the Big Mac index as a toy.
- **financial-crises:** Minsky, 2008, and leverage.

### Era 6: behaviour

- **ultimatum-game:** Güth et al. 1982 and the Henrich et al. 2001 cross-cultural study across 15 small-scale societies. The learner proposes and responds against simulated players.
- **present-bias:** hyperbolic discounting (Laibson), shown as choice reversals. The learner answers a choice set.
- **public-goods-game:** Fehr & Gächter 2000. Contributions decay, and punishment restores them.
- **nudges:** Thaler & Sunstein, with replication honesty. Pension auto-enrolment is robust (Madrian & Shea 2001). Many nudge effects shrank: Mertens et al. 2022 found the effect fell to near zero after correcting for publication bias (Maier et al. 2022 reanalysis), and DellaVigna & Linos 2022 found an average of 1.4 percentage points in nudge units against 8.7 in academic papers.
- **market-experiments:** Vernon Smith's double auction, which converges to equilibrium. The learner trades as a buyer.
- **prospect-theory-markets:** the endowment effect (Kahneman, Knetsch & Thaler 1990). Note the Plott & Zeiler 2005 critique.

### Era 7: development

- **solow-growth:** sliders for savings, depreciation and population, and the steady state.
- **inequality-lorenz:** the Lorenz curve and Gini, with real country Gini values (rounded, World Bank). Include Piketty's r > g, presented as debated.
- **poverty-traps:** an S-shaped capital curve.
- **randomised-trials:** Banerjee, Duflo and Kremer (Nobel 2019). Include deworming and the "worm wars" debate.
- **institutions:** Acemoglu, Johnson & Robinson (Nobel 2024), presented with critiques.
- **trade-globalisation:** the elephant curve (Lakner & Milanović). Include the China shock (Autor, Dorn & Hanson 2013).

### Era 8: systems

- **agent-based-markets:** the Santa Fe artificial stock market, and fat tails.
- **network-contagion:** interbank networks and default cascades.
- **climate-economics:** the social cost of carbon and the discount-rate debate (Stern against Nordhaus). Link to `https://the-future-in-motion.puter.site/` with SOURCE.
- **automation-labour:** task-based models (Autor), and Frey & Osborne 2013's 47% figure alongside its critiques (Arntz et al. 2016: 9%).
- **platform-economies:** two-sided markets and network effects.
- **measuring-wellbeing:** the Easterlin paradox (and Stevenson & Wolfers), GDP alternatives, and Doughnut economics (Raworth), presented as proposals.

## Files and naming

- **Files you own:** `src/scenes-N-<stageid>.js`, `src/scenes-N-lessons.js` and `src/scenes-N-words.js`.
- **Helper names:** prefix top-level helpers with `EN_`, for example `E4_`.
- **Scene ids:** use `<lesson-id>-<word>`.
- **Scenes per lesson:** 3, or 4 where the topic is rich.
- **Off limits:** do not edit the engine, the tests, `curriculum.js`, or other eras' files.
- **Order:** register lessons in route order.

## Economics rules

### Neutrality and breadth

- Economics is contested. Present the schools (classical, Keynesian, monetarist, Austrian, behavioural, institutional, Marxian as history) fairly and without advocacy.
- Mark normative claims as normative.
- Credit people who are often left out: Elinor Ostrom, Joan Robinson, Anna Schwartz (*A Monetary History*), Esther Duflo, Claudia Goldin (Nobel 2023, the gender pay gap's history), Mary Paley Marshall, Harriet Martineau, Kate Raworth and Mariana Mazzucato.
- Use non-Western examples where they fit: Ibn Khaldun's tax curve (often cited as a forerunner of the Laffer curve), microfinance, and the Asian tigers.

### Honesty

- Label stylised data as stylised.
- Give real figures rounded, with their source and year.
- Mark replication status in behavioural economics.
- Correct popular myths:
  - "the invisible hand" as Smith's central doctrine
  - "trickle-down" as a formal theory
  - "money printing always causes hyperinflation" (state the conditions)
  - "GDP measures wellbeing"

### Sound and 3D

- Sound: use it sparingly, for example a cash-register tick or an auction gavel, and only in `on` handlers.
- 3D: use it only where depth helps, for example a utility surface with indifference curves, the Solow production surface, or a payoff landscape. At most one or two per era.

## Glossary

- Add `WORD` entries for key terms and for people, keyed `person-<surname>`.
- Check `grep -h "key:'" src/scenes-*-words.js` before adding a key.
- A person belongs to the era where they first appear in the notes above.

## Build and test your era only

```sh
S=/tmp/claude-0/-home-user-computer-science-in-motion/7e28ded3-3dbc-5cc3-810c-b1bae2c3d852/scratchpad
cd /home/user/computer-science-in-motion
STAGES=N OUT=$S/eN.html python3 build.py
FILE=$S/eN.html SHOTS=$S/shots-eN ALLSHOTS=1 SAMPLE=<one id> timeout 900 node test/check.js
FILE=$S/eN.html timeout 900 node test/text-layout.js 375
FILE=$S/eN.html timeout 900 node test/text-layout.js 320
FILE=$S/eN.html SHOTS=$S/shots-eN timeout 300 node test/three.js
```

Then:

- Look at every `try-*.png` and `three-*.png`, and fix what you find.
- Check the models numerically against hand values: comparative-advantage gains, the multiplier 1/(1−MPC), the Nash equilibria, the Solow steady state, Gini, compound interest and the Taylor rule.
- Write scripts with the Write tool, not with shell heredocs containing JS.
- Never delete files. Do not commit. Stay on branch `economics`.

## Final report

For each lesson, list its scene ids with one line each: "interaction — why — research cited (status)". Then list the 3D scenes, the numerical checks you ran, the facts you are least sure of, and any problems left.
