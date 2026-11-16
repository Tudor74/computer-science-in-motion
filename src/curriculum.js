/* ===================== Curriculum: eras → lessons → scenes ===================== */
// Economics in historical order: from pins and comparative advantage, through margins and markets, the
// Depression and macroeconomics, games, money and crises, behaviour, development and inequality, to economies as
// complex systems. Lessons, sources and connections are registered by each era's files (src/scenes-N-lessons.js).
const CURRICULUM={version:1,
stages:[
 {id:'classical',name:'1 · Classical economics',years:'1776–1870',why:'The pin factory, comparative advantage, Malthus’s race between people and food, and diminishing returns.'},
 {id:'marginal',name:'2 · Margins and markets',years:'1870–1930',why:'Value at the margin, supply and demand, elasticity, surplus, equilibrium and the costs markets ignore.'},
 {id:'macro',name:'3 · The whole economy',years:'1929–1975',why:'The Depression, GDP, the multiplier, unemployment and inflation, and a world monetary system.'},
 {id:'games',name:'4 · Strategy and games',years:'1944–1990',why:'Dilemmas, equilibria, tournaments of cooperation, auctions and governing the commons.'},
 {id:'money',name:'5 · Money and finance',years:'1950–today',why:'Inflation, central banks, compounding, bank runs, exchange rates and financial crises.'},
 {id:'behaviour',name:'6 · Behaviour and experiments',years:'1979–today',why:'Fairness, present bias, public goods, nudges and markets run in the lab, with the learner taking part.'},
 {id:'development',name:'7 · Growth and inequality',years:'1956–today',why:'Growth models, inequality curves, poverty traps, randomised trials, institutions and trade.'},
 {id:'systems',name:'8 · Economies as systems',years:'1990–today',why:'Agent-based markets, networks and contagion, climate, automation, platforms and measuring wellbeing.'}
],
lessons:[]};
const THREADS=[];
// Further reading: stage files add entries to SOURCES (declared in core.js) with SOURCE(key,{title,url?,note?}).

/* Header textures: a quiet era cue, not a difficulty rating. */
const TEXTURES={
 classical:{w:40,h:32,tile:'<path d="M6 26V10M14 26V14M22 26V8M30 26V16" stroke="currentColor" stroke-width="1.2"/>'},
 marginal:{w:44,h:40,tile:'<path d="M6 6Q20 30 38 34M6 34Q20 10 38 6" fill="none" stroke="currentColor" stroke-width=".9"/>'},
 macro:{w:48,h:28,tile:'<path d="M0 18Q8 6 16 14T32 12T48 18" fill="none" stroke="currentColor" stroke-width=".9"/>'},
 games:{w:40,h:40,tile:'<rect x="6" y="6" width="12" height="12" fill="none" stroke="currentColor" stroke-width=".9"/><rect x="22" y="6" width="12" height="12" fill="currentColor" opacity=".35"/><rect x="6" y="22" width="12" height="12" fill="currentColor" opacity=".35"/><rect x="22" y="22" width="12" height="12" fill="none" stroke="currentColor" stroke-width=".9"/>'},
 money:{w:40,h:40,tile:'<circle cx="20" cy="20" r="11" fill="none" stroke="currentColor" stroke-width=".9"/><circle cx="20" cy="20" r="7" fill="none" stroke="currentColor" stroke-width=".5"/>'},
 behaviour:{w:44,h:32,tile:'<circle cx="14" cy="16" r="6" fill="none" stroke="currentColor" stroke-width=".9"/><circle cx="30" cy="16" r="6" fill="currentColor" opacity=".35"/>'},
 development:{w:44,h:36,tile:'<path d="M4 32L40 32M4 32Q30 30 40 4" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M4 32L40 4" stroke="currentColor" stroke-width=".5" stroke-dasharray="3 3"/>'},
 systems:{w:44,h:40,tile:'<circle cx="8" cy="8" r="2.5" fill="currentColor"/><circle cx="34" cy="12" r="2.5" fill="currentColor"/><circle cx="20" cy="30" r="2.5" fill="currentColor"/><path d="M8 8L34 12L20 30Z" fill="none" stroke="currentColor" stroke-width=".7"/>'}
};
