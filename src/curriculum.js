/* ===================== Curriculum: eras → lessons → scenes ===================== */
// The human senses, two eras each for vision, hearing, smell and touch, then the senses together. Within each
// sense the story runs from the organ to the brain, in the order it was discovered. Lessons, sources and
// connections are registered by each era's files (LESSON, SOURCE, THREAD in src/scenes-N-lessons.js).
const CURRICULUM={version:1,
stages:[
 {id:'eye',name:'1 · The eye',years:'1604–1960',why:'Optics, rods and cones, the dark, three cone types, opponent colours and colour blindness.'},
 {id:'seeing',name:'2 · Seeing',years:'1865–today',why:'Edges, depth, motion, illusions and faces: what the brain makes of the light.'},
 {id:'ear',name:'3 · The ear',years:'1543–today',why:'Eardrum and ossicles, the cochlea’s map of pitch, hair cells, the limits of hearing, hearing loss and implants.'},
 {id:'listening',name:'4 · Listening',years:'1876–today',why:'Where a sound is, pulling one voice from a crowd, seeing speech, pitch and masking.'},
 {id:'smell',name:'5 · Smell',years:'1920–today',why:'Receptors and the olfactory bulb, how little we can smell, mixtures, memory and losing smell.'},
 {id:'flavour',name:'6 · Taste and flavour',years:'1901–today',why:'Five tastes and the tongue-map myth, smell from the inside, pheromones, emotion and training.'},
 {id:'touch',name:'7 · Touch',years:'1834–today',why:'Skin receptors, acuity, vibration, pain, temperature, the body’s own position and gentle touch.'},
 {id:'together',name:'8 · Senses together',years:'1976–today',why:'Combining senses, owning a rubber hand, synaesthesia, substituting one sense for another, ageing and technology.'}
],
lessons:[]};
const THREADS=[];
// Further reading: stage files add entries to SOURCES (declared in core.js) with SOURCE(key,{title,url?,note?}).

/* Header textures: a quiet era cue, not a difficulty rating. */
const TEXTURES={
 eye:{w:48,h:32,tile:'<path d="M4 16Q24 2 44 16Q24 30 4 16Z" fill="none" stroke="currentColor" stroke-width=".9"/><circle cx="24" cy="16" r="5" fill="currentColor" opacity=".5"/>'},
 seeing:{w:40,h:40,tile:'<path d="M6 20H34M20 6V34" stroke="currentColor" stroke-width=".6"/><path d="M10 10L30 30" stroke="currentColor" stroke-width=".9"/>'},
 ear:{w:40,h:40,tile:'<path d="M20 34Q8 30 10 18Q12 6 22 6Q32 8 30 18Q28 24 22 24Q18 26 20 34Z" fill="none" stroke="currentColor" stroke-width=".9"/>'},
 listening:{w:48,h:28,tile:'<path d="M6 14H10M14 8V20M20 4V24M26 8V20M32 11V17M38 13V15" stroke="currentColor" stroke-width="1.1"/>'},
 smell:{w:40,h:40,tile:'<path d="M10 34Q6 24 14 18Q22 12 16 4M22 34Q18 24 26 18Q34 12 28 4" fill="none" stroke="currentColor" stroke-width=".9"/>'},
 flavour:{w:40,h:36,tile:'<path d="M8 10H32L28 30H12Z" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M12 16H28" stroke="currentColor" stroke-width=".6"/>'},
 touch:{w:40,h:40,tile:'<circle cx="12" cy="12" r="2.5" fill="currentColor"/><circle cx="28" cy="12" r="2.5" fill="currentColor"/><circle cx="20" cy="28" r="2.5" fill="none" stroke="currentColor"/>'},
 together:{w:44,h:32,tile:'<circle cx="16" cy="16" r="9" fill="none" stroke="currentColor" stroke-width=".9"/><circle cx="28" cy="16" r="9" fill="none" stroke="currentColor" stroke-width=".9"/>'}
};
