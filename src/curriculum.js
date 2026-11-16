/* ===================== Curriculum: eras → lessons → scenes ===================== */
// Physics in historical order: each era is the moment an idea about motion, force, energy, waves, light,
// fields, heat or the very small and very fast became measurable. Lessons, sources and connections are
// registered by each era's files (LESSON, SOURCE, THREAD in src/scenes-N-lessons.js).
const CURRICULUM={version:1,
stages:[
 {id:'motion',name:'1 · Describing motion',years:'1600s',why:'Galileo replaced arguments about why things move with measurements of how they move: position, speed and acceleration, timed on ramps and in free fall.'},
 {id:'forces',name:'2 · Forces and gravity',years:'1600s–1700s',why:'Newton tied motion to force, and the same law of gravity to an apple and the Moon. Kepler’s orbits became a consequence, not a mystery.'},
 {id:'energy',name:'3 · Energy and momentum',years:'1600s–1900s',why:'Some quantities never change in a closed system. Energy and momentum make hard problems easy, and Noether showed why they are conserved.'},
 {id:'waves',name:'4 · Waves and sound',years:'1600s–1800s',why:'A wave carries energy without carrying the medium. Superposition, standing waves, resonance and the Doppler effect follow from that one idea.'},
 {id:'light',name:'5 · Light',years:'1600s–1800s',why:'Light bends, splits into colours, interferes with itself and travels at a finite speed: each discovery came from a careful experiment.'},
 {id:'fields',name:'6 · Electricity and magnetism',years:'1780s–1880s',why:'Charges, currents and magnets turned out to be one subject. Faraday’s fields and Maxwell’s equations predicted waves that travel at the speed of light.'},
 {id:'heat',name:'7 · Heat and matter',years:'1800s–1900s',why:'Heat is the motion of atoms. Counting their arrangements explains pressure, engines, entropy and why time seems to run one way.'},
 {id:'modern',name:'8 · Relativity, atoms and quanta',years:'1880s–today',why:'At high speed and small scale the old rules bend: light sets a speed limit, atoms have nuclei, and energy comes in packets. Some questions are still open.'}
],
lessons:[]};
const THREADS=[];
// Further reading: stage files add entries to SOURCES (declared in core.js) with SOURCE(key,{title,url?,note?}).

/* Header textures: a quiet era cue, not a difficulty rating. */
const TEXTURES={
 motion:{w:40,h:40,tile:'<path d="M4 36Q20 4 36 36" fill="none" stroke="currentColor" stroke-width="1.1"/><circle cx="20" cy="20" r="1.8" fill="currentColor"/>'},
 forces:{w:36,h:36,tile:'<path d="M8 28L28 8M28 8H20M28 8V16" fill="none" stroke="currentColor" stroke-width="1.1"/>'},
 energy:{w:44,h:44,tile:'<path d="M22 4V22" stroke="currentColor" stroke-width="1"/><circle cx="22" cy="30" r="5" fill="none" stroke="currentColor" stroke-width="1.1"/>'},
 waves:{w:48,h:24,tile:'<path d="M0 12Q12 0 24 12T48 12" fill="none" stroke="currentColor" stroke-width="1.1"/>'},
 light:{w:44,h:44,tile:'<path d="M4 22H40M22 4V40M9 9L35 35M35 9L9 35" fill="none" stroke="currentColor" stroke-width=".7"/><circle cx="22" cy="22" r="3" fill="currentColor"/>'},
 fields:{w:48,h:40,tile:'<path d="M6 20C14 4 34 4 42 20C34 36 14 36 6 20Z" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="6" cy="20" r="2" fill="currentColor"/><circle cx="42" cy="20" r="2" fill="currentColor"/>'},
 heat:{w:40,h:40,tile:'<circle cx="8" cy="10" r="2" fill="currentColor"/><circle cx="28" cy="6" r="2" fill="currentColor"/><circle cx="18" cy="26" r="2" fill="currentColor"/><circle cx="34" cy="32" r="2" fill="currentColor"/><path d="M8 10L13 15M28 6L24 11M18 26L23 22" stroke="currentColor" stroke-width=".9"/>'},
 modern:{w:48,h:48,tile:'<ellipse cx="24" cy="24" rx="18" ry="7" fill="none" stroke="currentColor" stroke-width=".9"/><ellipse cx="24" cy="24" rx="18" ry="7" fill="none" stroke="currentColor" stroke-width=".9" transform="rotate(60 24 24)"/><ellipse cx="24" cy="24" rx="18" ry="7" fill="none" stroke="currentColor" stroke-width=".9" transform="rotate(-60 24 24)"/><circle cx="24" cy="24" r="2.5" fill="currentColor"/>'}
};
