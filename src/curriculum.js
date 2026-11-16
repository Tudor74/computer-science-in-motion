/* ===================== Curriculum: eras → lessons → scenes ===================== */
// Biology in historical order: from the first microscopes and cells, through evolution and heredity, the
// molecules of life and its chemistry, ecosystems and bodies, to sequencing, gene editing and the origin of life.
// Lessons, sources and connections are registered by each era's files (LESSON, SOURCE, THREAD in src/scenes-N-lessons.js).
const CURRICULUM={version:1,
stages:[
 {id:'cells',name:'1 · Cells',years:'1665–1900',why:'Lenses revealed that living things are made of cells, that cells come from cells, and that germs cause disease.'},
 {id:'evolution',name:'2 · Evolution',years:'1830–1930',why:'Deep time, variation and selection: how populations change and new species form.'},
 {id:'heredity',name:'3 · Heredity',years:'1866–1950',why:'Mendel’s ratios, chromosomes, and the mathematics of genes in populations.'},
 {id:'molecules',name:'4 · The molecules of life',years:'1944–1970',why:'DNA’s double helix, how it copies itself, and how genes become proteins and are switched on and off.'},
 {id:'metabolism',name:'5 · Energy and chemistry',years:'1900–1980',why:'Enzymes, photosynthesis, respiration, membranes and the balance a body keeps.'},
 {id:'ecology',name:'6 · Ecosystems',years:'1920–1980',why:'Predators and prey, growth and limits, food webs, islands and the cycling of matter.'},
 {id:'bodies',name:'7 · Bodies and disease',years:'1880–today',why:'Immunity, epidemics and vaccines, how an embryo makes patterns, the heart and the microbiome.'},
 {id:'modern',name:'8 · Reading and writing life',years:'1977–today',why:'Sequencing, the tree of life, CRISPR, evolution in a flask, antibiotic resistance and how life began.'}
],
lessons:[]};
const THREADS=[];
// Further reading: stage files add entries to SOURCES (declared in core.js) with SOURCE(key,{title,url?,note?}).

/* Header textures: a quiet era cue, not a difficulty rating. */
const TEXTURES={
 cells:{w:44,h:44,tile:'<circle cx="22" cy="22" r="14" fill="none" stroke="currentColor" stroke-width=".9"/><circle cx="24" cy="20" r="4" fill="currentColor" opacity=".5"/>'},
 evolution:{w:44,h:40,tile:'<path d="M22 38V24M22 24L10 8M22 24L34 8M16 16L20 6" fill="none" stroke="currentColor" stroke-width=".9"/>'},
 heredity:{w:40,h:40,tile:'<path d="M4 20H36M20 4V36" stroke="currentColor" stroke-width=".8"/><circle cx="12" cy="12" r="3" fill="currentColor"/><circle cx="28" cy="28" r="3" fill="none" stroke="currentColor"/>'},
 molecules:{w:24,h:48,tile:'<path d="M4 0Q20 12 4 24T4 48M20 0Q4 12 20 24T20 48" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M8 6H16M8 18H16M8 30H16M8 42H16" stroke="currentColor" stroke-width=".6"/>'},
 metabolism:{w:40,h:40,tile:'<circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" stroke-width=".9" stroke-dasharray="6 4"/><path d="M30 12L33 17L27 17Z" fill="currentColor"/>'},
 ecology:{w:48,h:32,tile:'<path d="M0 16Q12 2 24 16T48 16" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M0 20Q12 30 24 20T48 20" fill="none" stroke="currentColor" stroke-width=".6"/>'},
 bodies:{w:40,h:36,tile:'<path d="M20 32C6 22 6 10 13 8C17 7 20 11 20 11C20 11 23 7 27 8C34 10 34 22 20 32Z" fill="none" stroke="currentColor" stroke-width=".9"/>'},
 modern:{w:48,h:24,tile:'<rect x="2" y="8" width="8" height="8" fill="currentColor" opacity=".7"/><rect x="14" y="8" width="8" height="8" fill="none" stroke="currentColor"/><rect x="26" y="8" width="8" height="8" fill="currentColor" opacity=".4"/><rect x="38" y="8" width="8" height="8" fill="none" stroke="currentColor"/>'}
};
