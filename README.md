# Economics In Motion

A single-file, offline HTML page that tells the history of economic ideas in order: classical economics, margins and markets, the whole economy, strategy and games, money and finance, behaviour and experiments, growth and inequality, and economies as systems. In Try it you steer the mechanisms (supply and demand, the multiplier, a bank run, a Solow economy) and take part in classic experiments, with your choices drawn beside the published results. Schools of thought are presented fairly and replication status is marked.

This is the `economics` branch of the [Computer Science In Motion](https://github.com/Tudor74/computer-science-in-motion) repository, sharing its engine with the other In Motion courses, and part of the [In Motion](https://in-motion.puter.site) family.

## Route

1. **Classical economics** (1776–1870): the division of labour, the invisible hand, comparative advantage, Malthus, diminishing returns, the labour theory of value
2. **Margins and markets** (1870–1930): marginal utility, supply and demand, elasticity, consumer surplus, general equilibrium, externalities
3. **The whole economy** (1929–1975): the Great Depression, national accounts, the multiplier, unemployment and the Phillips curve, Keynes and Hayek, Bretton Woods
4. **Strategy and games** (1944–1990): the prisoner's dilemma, Nash equilibrium, Axelrod's tournament, the beauty contest, auctions, governing the commons
5. **Money and finance**: inflation and money, central banks, compound interest, bank runs, exchange rates, financial crises
6. **Behaviour and experiments**: the ultimatum game, present bias, the public-goods game, nudges, market experiments, prospect theory in markets
7. **Growth and inequality**: Solow growth, Lorenz curves, poverty traps, randomised trials, institutions, trade and globalisation
8. **Economies as systems**: agent-based markets, network contagion, climate economics, automation and labour, platform economies, measuring wellbeing

## Source layout

`index.html` is generated. Edit the files in `src/` and rebuild:

```sh
python3 build.py              # writes index.html
node test/check.js            # every scene in Watch and Try it: console errors, overflow, screenshots
node test/three.js            # 2D/3D toggle on every 3D scene
node test/slider.js           # time slider behaviour
node test/text-layout.js 375  # phone text scale: labels stay inside the drawing and do not collide
node test/timed.js            # timed experiments: delayed replies arrive, and stop when you leave
node test/threads.js          # map connections: merged by name, "Other connection" switches
```

| File | Contents |
| --- | --- |
| `src/shell.html` | Markup and CSS |
| `src/core.js` | Scene API notes, interaction design note, palette, SVG and 3D helpers, `LESSON`/`THREAD`/`WORD`/`SOURCE` |
| `src/scenes-N-<era>.js` | Scenes for era N |
| `src/scenes-N-lessons.js` | Era N's lessons, sources and cross-links |
| `src/scenes-N-words.js` | Era N's glossary entries, including the people |
| `src/curriculum.js` | The eight eras and their header textures |
| `src/app.js` | Runtime: clock, Watch/Try it, 2D/3D, controls, local map, glossary |
| `docs/MUSIC-BRIEF.md` | The brief for era authors: fixed lesson ids, sound, notation and citation rules, test commands |
