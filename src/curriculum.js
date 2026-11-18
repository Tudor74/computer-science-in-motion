/* ===================== Curriculum: eras → lessons → scenes ===================== */
// The science and philosophy of consciousness in eight eras: the question, the threshold of awareness, neural
// correlates, sleep and anaesthesia, the self, the rival theories, other animals, and machines. No theory is
// settled; the course says so throughout. Lessons, sources and connections are registered by each era's files
// (LESSON, SOURCE, THREAD in src/scenes-N-lessons.js).
const CURRICULUM={version:1,
stages:[
 {id:'question',name:'1 · The question',years:'1641–today',why:'Mind and body, what it is like, the easy and hard problems, Mary, zombies, and how far reports of experience can be trusted.'},
 {id:'threshold',name:'2 · At the threshold',years:'1832–today',why:'Masking, blindsight, rivalry, and the things in plain view that go unseen: where awareness starts and stops.'},
 {id:'correlates',name:'3 · Neural correlates',years:'1990–today',why:'The search for the brain activity that goes with experience: contrasts, ignition, feedback, front against back, and zap-and-zip.'},
 {id:'absence',name:'4 · Sleep, dreams and anaesthesia',years:'1846–today',why:'What changes when experience fades or alters: dreams, anaesthesia, brain injury, split brains and psychedelics.'},
 {id:'self',name:'5 · The self',years:'1884–today',why:'Owning a body, willing an action, explaining yourself, recognising yourself, feeling your heartbeat and lasting through time.'},
 {id:'theories',name:'6 · Theories',years:'1988–today',why:'Five rival theories, what each predicts, what counts against each, and the first experiments designed to test two of them head to head.'},
 {id:'others',name:'7 · Other minds',years:'1976–today',why:'Animals, octopuses, bees, infants and other people: what counts as evidence of experience when nobody can report it to you.'},
 {id:'machines',name:'8 · Machines and open questions',years:'1950–today',why:'The Turing test, the Chinese room, indicators for machines, why self-report is weak evidence, two radical views, and what remains open.'}
],
lessons:[]};
const THREADS=[];
// Further reading: stage files add entries to SOURCES (declared in core.js) with SOURCE(key,{title,url?,note?}).

/* Header textures: a quiet era cue, not a difficulty rating. */
const TEXTURES={
 question:{w:40,h:44,tile:'<path d="M13 14Q13 6 20 6Q27 6 27 13Q27 18 20 22V28" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="20" cy="35" r="1.6" fill="currentColor"/>'},
 threshold:{w:48,h:32,tile:'<path d="M2 16H46" stroke="currentColor" stroke-width=".7" stroke-dasharray="3 3"/><circle cx="12" cy="24" r="2.2" fill="none" stroke="currentColor" stroke-width=".8"/><circle cx="34" cy="8" r="2.2" fill="currentColor"/>'},
 correlates:{w:44,h:40,tile:'<path d="M10 28L22 10L34 28Z" fill="none" stroke="currentColor" stroke-width=".7"/><circle cx="10" cy="28" r="2.4" fill="currentColor"/><circle cx="22" cy="10" r="2.4" fill="currentColor"/><circle cx="34" cy="28" r="2.4" fill="none" stroke="currentColor"/>'},
 absence:{w:44,h:40,tile:'<path d="M26 8A12 12 0 1 0 34 28A10 10 0 0 1 26 8Z" fill="none" stroke="currentColor" stroke-width=".9"/><circle cx="8" cy="10" r="1" fill="currentColor"/>'},
 self:{w:40,h:40,tile:'<circle cx="20" cy="20" r="13" fill="none" stroke="currentColor" stroke-width=".6"/><circle cx="20" cy="20" r="7" fill="none" stroke="currentColor" stroke-width=".9"/><circle cx="20" cy="20" r="1.8" fill="currentColor"/>'},
 theories:{w:48,h:36,tile:'<circle cx="18" cy="15" r="9" fill="none" stroke="currentColor" stroke-width=".8"/><circle cx="30" cy="15" r="9" fill="none" stroke="currentColor" stroke-width=".8"/><circle cx="24" cy="24" r="9" fill="none" stroke="currentColor" stroke-width=".8"/>'},
 others:{w:48,h:32,tile:'<circle cx="12" cy="16" r="6" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M30 10H42V22H30Z" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M20 16H28" stroke="currentColor" stroke-width=".6" stroke-dasharray="2 2"/>'},
 machines:{w:40,h:40,tile:'<path d="M10 10H30V30H10Z" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M15 6V10M25 6V10M15 30V34M25 30V34M6 15H10M6 25H10M30 15H34M30 25H34" stroke="currentColor" stroke-width=".8"/><circle cx="20" cy="20" r="2" fill="currentColor"/>'}
};
