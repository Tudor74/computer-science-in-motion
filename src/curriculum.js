/* ===================== Curriculum: eras → lessons → scenes ===================== */
// The study of the mind in historical order: from measuring sensation with a stopwatch, through learning,
// information, memory, the brain, reasoning and social life, to today's models of a predicting brain.
// Lessons, sources and connections are registered by each era's files (LESSON, SOURCE, THREAD in src/scenes-N-lessons.js).
const CURRICULUM={version:1,
stages:[
 {id:'measure',name:'1 · Measuring the mind',years:'1830–1900',why:'Sensation, reaction time and the first maps of the brain turned questions about the mind into measurements.'},
 {id:'learning',name:'2 · Learning and behaviour',years:'1885–1950',why:'Forgetting curves, conditioning and rewards: what animals and people learn, measured from the outside.'},
 {id:'information',name:'3 · The mind as information',years:'1948–1975',why:'Bits, limited channels, attention and detection: the cognitive revolution treated thinking as processing.'},
 {id:'memory',name:'4 · Memory',years:'1932–today',why:'Working memory, the serial-position curve, context, reconstruction, spacing and retrieval practice.'},
 {id:'brain',name:'5 · The brain at work',years:'1890–today',why:'Spikes, synapses, receptive fields, divided hemispheres, imaging and a brain that rewires itself.'},
 {id:'reasoning',name:'6 · Judgement and reasoning',years:'1966–today',why:'Heuristics and biases, losses and gains, base rates, logic puzzles, two kinds of thinking and insight.'},
 {id:'social',name:'7 · Minds among others',years:'1951–today',why:'Development, theory of mind, conformity, obedience, dissonance and the crisis that taught psychology to replicate.'},
 {id:'models',name:'8 · Models of mind',years:'1958–today',why:'Artificial neurons, prediction errors, Bayesian perception, bodies in the loop and theories of consciousness.'}
],
lessons:[]};
const THREADS=[];
// Further reading: stage files add entries to SOURCES (declared in core.js) with SOURCE(key,{title,url?,note?}).

/* Header textures: a quiet era cue, not a difficulty rating. */
const TEXTURES={
 measure:{w:40,h:24,tile:'<path d="M0 18H40M4 18V12M12 18V14M20 18V8M28 18V14M36 18V12" stroke="currentColor" stroke-width="1"/>'},
 learning:{w:48,h:32,tile:'<path d="M2 6Q10 26 24 26T46 28" fill="none" stroke="currentColor" stroke-width="1"/>'},
 information:{w:40,h:24,tile:'<path d="M0 12H8V4H16V20H24V12H40" fill="none" stroke="currentColor" stroke-width="1"/>'},
 memory:{w:44,h:28,tile:'<rect x="4" y="6" width="10" height="16" fill="none" stroke="currentColor" stroke-width=".9"/><rect x="18" y="6" width="10" height="16" fill="none" stroke="currentColor" stroke-width=".9"/><rect x="32" y="6" width="10" height="16" fill="currentColor" opacity=".35"/>'},
 brain:{w:48,h:32,tile:'<path d="M0 22H14L18 6L22 28L26 22H48" fill="none" stroke="currentColor" stroke-width="1"/>'},
 reasoning:{w:40,h:40,tile:'<path d="M20 4L36 20L20 36L4 20Z" fill="none" stroke="currentColor" stroke-width=".9"/>'},
 social:{w:48,h:32,tile:'<circle cx="10" cy="16" r="4" fill="currentColor"/><circle cx="24" cy="16" r="4" fill="none" stroke="currentColor"/><circle cx="38" cy="16" r="4" fill="currentColor"/>'},
 models:{w:44,h:36,tile:'<circle cx="6" cy="8" r="2.5" fill="currentColor"/><circle cx="6" cy="28" r="2.5" fill="currentColor"/><circle cx="38" cy="18" r="2.5" fill="currentColor"/><path d="M6 8L38 18M6 28L38 18" stroke="currentColor" stroke-width=".8"/>'}
};
