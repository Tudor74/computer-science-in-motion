/* ===================== Curriculum: eras → lessons → scenes ===================== */
// The origin of life in historical order: from spontaneous generation and its downfall, through prebiotic
// chemistry, the early Earth, RNA-first and metabolism-first ideas, the first cells and the last common ancestor,
// to the search for life elsewhere. Almost everything after era 1 is open science and is labelled so.
// Lessons, sources and connections are registered by each era's files (LESSON, SOURCE, THREAD in src/scenes-N-lessons.js).
const CURRICULUM={version:1,
stages:[
 {id:'spontaneous',name:'1 · Spontaneous generation',years:'350 BCE–1862',why:'Maggots from meat and microbes from broth: how careful experiments showed life comes from life, today.'},
 {id:'chemistry',name:'2 · Life’s chemistry',years:'1828–1970',why:'Urea from a flask, the primordial soup, Miller–Urey’s spark and amino acids from space.'},
 {id:'earth',name:'3 · The early Earth',years:'4.5–3.5 billion years ago',why:'A molten world cools, oceans form, and the oldest traces of life are argued over.'},
 {id:'rna',name:'4 · An RNA world?',years:'1967–today',why:'Molecules that both carry information and catalyse: ribozymes, replicators and the error threshold.'},
 {id:'metabolism',name:'5 · Metabolism first?',years:'1988–today',why:'Vents, mineral catalysts, autocatalytic sets and the proton gradients every cell still uses.'},
 {id:'cells',name:'6 · The first cells',years:'1924–today',why:'Self-assembling membranes, protocells that grow and divide, and why life is one-handed.'},
 {id:'luca',name:'7 · The last common ancestor',years:'1977–today',why:'Reconstructing LUCA from today’s genomes, where the genetic code came from, and the place of viruses.'},
 {id:'elsewhere',name:'8 · Life elsewhere',years:'1961–today',why:'Habitable zones, icy moons, biosignatures and false alarms, and what we would count as alive.'}
],
lessons:[]};
const THREADS=[];
// Further reading: stage files add entries to SOURCES (declared in core.js) with SOURCE(key,{title,url?,note?}).

/* Header textures: a quiet era cue, not a difficulty rating. */
const TEXTURES={
 spontaneous:{w:40,h:40,tile:'<path d="M14 34V18Q14 10 20 10Q26 10 26 18V34Z" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M26 16Q34 12 36 4" fill="none" stroke="currentColor" stroke-width=".8"/>'},
 chemistry:{w:40,h:40,tile:'<path d="M20 6L32 13V27L20 34L8 27V13Z" fill="none" stroke="currentColor" stroke-width=".9"/>'},
 earth:{w:44,h:44,tile:'<circle cx="22" cy="22" r="14" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M10 18Q22 24 34 16" fill="none" stroke="currentColor" stroke-width=".6"/>'},
 rna:{w:48,h:24,tile:'<path d="M0 12Q6 2 12 12T24 12T36 12T48 12" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M6 6V10M18 14V18M30 6V10M42 14V18" stroke="currentColor" stroke-width=".7"/>'},
 metabolism:{w:40,h:40,tile:'<circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" stroke-width=".9" stroke-dasharray="5 4"/><circle cx="20" cy="8" r="2.5" fill="currentColor"/>'},
 cells:{w:44,h:44,tile:'<circle cx="16" cy="22" r="10" fill="none" stroke="currentColor" stroke-width=".9"/><circle cx="32" cy="22" r="7" fill="none" stroke="currentColor" stroke-width=".7"/>'},
 luca:{w:44,h:40,tile:'<path d="M22 36V24M22 24L8 6M22 24L36 6M22 24L22 6" fill="none" stroke="currentColor" stroke-width=".9"/>'},
 elsewhere:{w:44,h:44,tile:'<circle cx="22" cy="22" r="5" fill="currentColor" opacity=".6"/><ellipse cx="22" cy="22" rx="18" ry="7" fill="none" stroke="currentColor" stroke-width=".7"/>'}
};
