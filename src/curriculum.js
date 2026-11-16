/* ===================== Curriculum: eras → lessons → scenes ===================== */
// Chemistry in historical order: from four elements and the alchemist's still, through atoms and the periodic
// table, bonds and reactions, carbon's chemistry and the instruments that read molecules, to modern materials,
// the atmosphere and computation. Lessons, sources and connections are registered by each era's files.
const CURRICULUM={version:1,
stages:[
 {id:'alchemy',name:'1 · From alchemy to chemistry',years:'400 BCE–1790',why:'Four elements, the still, Boyle’s air, phlogiston, and Lavoisier’s balance that kept mass constant.'},
 {id:'atoms',name:'2 · Atoms and weights',years:'1800–1870',why:'Dalton’s atoms, Avogadro’s volumes, electricity splitting compounds, gas laws and the light of elements.'},
 {id:'periodic',name:'3 · The periodic table',years:'1869–1932',why:'Mendeleev’s predictions, noble gases, radioactivity, atomic number, isotopes and electron shells.'},
 {id:'bonding',name:'4 · Bonds and shapes',years:'1916–1960',why:'Shared and transferred electrons, molecular shapes, orbitals, hydrogen bonds and electronegativity.'},
 {id:'reactions',name:'5 · Reactions',years:'1850–1950',why:'Rates, equilibrium, acids and bases, redox and batteries, catalysts, and the energy that decides direction.'},
 {id:'organic',name:'6 · The chemistry of carbon',years:'1828–1970',why:'Carbon skeletons, functional groups, benzene’s ring, handedness, polymers and building molecules by design.'},
 {id:'analysis',name:'7 · Reading molecules',years:'1900–today',why:'Chromatography, infrared, NMR, mass spectrometry, crystallography and titration: how chemists see.'},
 {id:'modern',name:'8 · Modern chemistry',years:'1950–today',why:'Semiconductors, nanomaterials, click chemistry, green chemistry, the atmosphere and computing molecules.'}
],
lessons:[]};
const THREADS=[];
// Further reading: stage files add entries to SOURCES (declared in core.js) with SOURCE(key,{title,url?,note?}).

/* Header textures: a quiet era cue, not a difficulty rating. */
const TEXTURES={
 alchemy:{w:40,h:40,tile:'<path d="M20 6L34 32H6Z" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M12 22H28" stroke="currentColor" stroke-width=".7"/>'},
 atoms:{w:40,h:40,tile:'<circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" stroke-width=".9"/><circle cx="20" cy="20" r="2.5" fill="currentColor"/>'},
 periodic:{w:44,h:32,tile:'<rect x="4" y="6" width="10" height="10" fill="none" stroke="currentColor" stroke-width=".8"/><rect x="16" y="6" width="10" height="10" fill="currentColor" opacity=".3"/><rect x="28" y="6" width="10" height="10" fill="none" stroke="currentColor" stroke-width=".8"/><rect x="4" y="18" width="10" height="10" fill="currentColor" opacity=".3"/><rect x="16" y="18" width="10" height="10" fill="none" stroke="currentColor" stroke-width=".8"/>'},
 bonding:{w:44,h:28,tile:'<circle cx="10" cy="14" r="5" fill="none" stroke="currentColor" stroke-width=".9"/><circle cx="34" cy="14" r="5" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M15 12H29M15 16H29" stroke="currentColor" stroke-width=".8"/>'},
 reactions:{w:48,h:24,tile:'<path d="M4 9H40M36 5L40 9L36 13M44 15H8M12 11L8 15L12 19" fill="none" stroke="currentColor" stroke-width=".8"/>'},
 organic:{w:40,h:40,tile:'<path d="M20 6L32 13V27L20 34L8 27V13Z" fill="none" stroke="currentColor" stroke-width=".9"/><circle cx="20" cy="20" r="6" fill="none" stroke="currentColor" stroke-width=".6"/>'},
 analysis:{w:48,h:28,tile:'<path d="M2 24H46M6 24V20M14 24V8M20 24V18M30 24V4M38 24V16" stroke="currentColor" stroke-width=".9"/>'},
 modern:{w:44,h:40,tile:'<path d="M8 10L20 4L32 10L32 24L20 30L8 24Z" fill="none" stroke="currentColor" stroke-width=".7"/><path d="M20 4V30M8 10L32 24M32 10L8 24" stroke="currentColor" stroke-width=".4"/>'}
};
