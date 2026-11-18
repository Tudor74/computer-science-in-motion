/* ===================== Curriculum: eras → lessons → scenes ===================== */
// The brain in the order it was worked out: the neuron, the synapse, maps of the brain, movement, development and
// plasticity, brain states, disorders, and the tools at the frontier. Lessons, sources and connections are
// registered by each era’s files (LESSON, SOURCE, THREAD in src/scenes-N-lessons.js).
const CURRICULUM={version:1,
stages:[
 {id:'neuron',name:'1 · The neuron',years:'1780–today',why:'Animal electricity, separate nerve cells, the resting and action potentials, myelin and the glia around it all.'},
 {id:'synapse',name:'2 · Synapses',years:'1897–today',why:'How one neuron speaks to the next: chemical messengers, packets of transmitter, excitation and inhibition, receptors and the drugs that act on them.'},
 {id:'map',name:'3 · Mapping the brain',years:'1796–today',why:'Which part does what: phrenology’s false start, patients and lesions, maps of the cortex, divided hemispheres, imaging and wiring diagrams.'},
 {id:'movement',name:'4 · Movement',years:'1870–today',why:'From intention to muscle: motor cortex, spinal reflexes, rhythm generators, the cerebellum, the basal ganglia and reading a reach from many neurons.'},
 {id:'plasticity',name:'5 · Development and plasticity',years:'1890–today',why:'How a brain wires itself and keeps changing: growing axons, critical periods, strengthened synapses, shifting maps, new neurons and adolescence.'},
 {id:'state',name:'6 · Brain states',years:'1936–today',why:'The body clock, sleep, wakefulness, reward, stress and hunger: the systems that set what state the whole brain is in.'},
 {id:'disorder',name:'7 · When things go wrong',years:'1817–today',why:'Stroke, epilepsy, Parkinson’s, Alzheimer’s, depression and addiction: what is known, what is contested and what treatment can do. Not medical advice.'},
 {id:'frontier',name:'8 · Tools and frontiers',years:'1943–today',why:'Single channels, light-switched neurons, the brain’s map of space, brain–computer interfaces, recording many neurons and what brains and AI have taught each other.'}
],
lessons:[]};
const THREADS=[];
// Further reading: stage files add entries to SOURCES (declared in core.js) with SOURCE(key,{title,url?,note?}).

/* Header textures: a quiet era cue, not a difficulty rating. */
const TEXTURES={
 neuron:{w:48,h:36,tile:'<circle cx="14" cy="18" r="4" fill="currentColor" opacity=".5"/><path d="M18 18H42M10 15L4 8M10 21L4 28M14 14V5" fill="none" stroke="currentColor" stroke-width=".9"/>'},
 synapse:{w:44,h:32,tile:'<path d="M4 16H14Q20 8 20 16Q20 24 14 16" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M30 8V24H40" fill="none" stroke="currentColor" stroke-width=".9"/><circle cx="24" cy="13" r="1" fill="currentColor"/><circle cx="26" cy="18" r="1" fill="currentColor"/>'},
 map:{w:44,h:40,tile:'<path d="M4 20Q4 6 22 6Q40 6 40 20Q40 30 26 32Q8 34 4 20Z" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M22 6Q18 18 24 32M6 16Q14 20 22 16M24 22Q32 18 40 22" fill="none" stroke="currentColor" stroke-width=".6"/>'},
 movement:{w:48,h:32,tile:'<path d="M4 24Q10 6 16 24Q22 6 28 24Q34 6 40 24" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M40 24L44 20" stroke="currentColor" stroke-width=".9"/>'},
 plasticity:{w:40,h:40,tile:'<path d="M20 36V22M20 22L10 10M20 22L30 10M10 10L6 4M10 10L14 4M30 10L34 4" fill="none" stroke="currentColor" stroke-width=".9"/>'},
 state:{w:56,h:28,tile:'<path d="M2 14Q16 -4 28 14Q40 32 54 14" fill="none" stroke="currentColor" stroke-width=".9"/><circle cx="15" cy="20" r="3" fill="none" stroke="currentColor" stroke-width=".7"/><circle cx="41" cy="8" r="3" fill="currentColor" opacity=".5"/>'},
 disorder:{w:52,h:28,tile:'<path d="M2 14H12L15 6L19 22L22 14H30" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M36 14H50" stroke="currentColor" stroke-width=".9" stroke-dasharray="2 3"/>'},
 frontier:{w:36,h:36,tile:'<rect x="6" y="6" width="24" height="24" rx="3" fill="none" stroke="currentColor" stroke-width=".8"/><circle cx="13" cy="13" r="1.6" fill="currentColor"/><circle cx="23" cy="13" r="1.6" fill="currentColor"/><circle cx="13" cy="23" r="1.6" fill="currentColor"/><circle cx="23" cy="23" r="1.6" fill="currentColor"/>'}
};
