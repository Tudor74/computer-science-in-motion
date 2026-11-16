/* ===================== Curriculum: eras → lessons → scenes ===================== */
// Music in historical order: from ratios on a string, through notation, harmony, form and the science of
// timbre, to rhythm traditions, recording, electronic sound and what the mind does with it all. Lessons,
// sources and connections are registered by each era's files (LESSON, SOURCE, THREAD in src/scenes-N-lessons.js).
const CURRICULUM={version:1,
stages:[
 {id:'number',name:'1 · Sound and number',years:'Antiquity',why:'A plucked string and a few whole-number ratios: pitch, octaves, fifths and the harmonic series, and the scales built from them.'},
 {id:'notation',name:'2 · Writing music down',years:'500–1600',why:'Neumes, the staff, solmisation and note values let music travel without a teacher, and made polyphony possible.'},
 {id:'harmony',name:'3 · Harmony',years:'1600–1750',why:'Intervals stack into chords, chords move in cadences, voices weave in counterpoint, and tuning compromises let every key be played.'},
 {id:'form',name:'4 · Keys, form and the orchestra',years:'1750–1900',why:'Major and minor keys, modulation, motifs, sonata form and variation, and the colours of the orchestra.'},
 {id:'timbre',name:'5 · The science of timbre',years:'1800s–1900s',why:'Why a violin and a flute sound different on the same note: harmonics, envelopes, resonant bodies, the ear and loudness.'},
 {id:'rhythm',name:'6 · Rhythm around the world',years:'Many traditions',why:'Beat and metre, syncopation, polyrhythm, cycles like tala and clave, and the feel of swing.'},
 {id:'electric',name:'7 · Recording and electronic sound',years:'1877–today',why:'Sound captured on cylinders, tape and numbers, then built from oscillators and filters and sequenced by computers.'},
 {id:'perception',name:'8 · Music and the mind',years:'Research',why:'What the brain adds: missing fundamentals, roughness and consonance, expectation, emotion, keeping the beat and auditory illusions.'}
],
lessons:[]};
const THREADS=[];
// Further reading: stage files add entries to SOURCES (declared in core.js) with SOURCE(key,{title,url?,note?}).

/* Header textures: a quiet era cue, not a difficulty rating. */
const TEXTURES={
 number:{w:40,h:40,tile:'<path d="M4 20H36" stroke="currentColor" stroke-width="1"/><path d="M4 20Q20 8 36 20Q20 32 4 20" fill="none" stroke="currentColor" stroke-width=".8"/>'},
 notation:{w:48,h:40,tile:'<path d="M0 8H48M0 14H48M0 20H48M0 26H48M0 32H48" stroke="currentColor" stroke-width=".7"/><ellipse cx="18" cy="23" rx="4" ry="3" fill="currentColor" transform="rotate(-20 18 23)"/><path d="M22 22V6" stroke="currentColor" stroke-width="1"/>'},
 harmony:{w:36,h:44,tile:'<circle cx="18" cy="10" r="3.5" fill="currentColor"/><circle cx="18" cy="22" r="3.5" fill="currentColor"/><circle cx="18" cy="34" r="3.5" fill="currentColor"/>'},
 form:{w:56,h:28,tile:'<path d="M4 20L14 8L24 20L34 8L44 20" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="52" cy="14" r="2" fill="currentColor"/>'},
 timbre:{w:48,h:32,tile:'<path d="M0 16Q6 4 12 16T24 16T36 16T48 16" fill="none" stroke="currentColor" stroke-width="1"/><path d="M0 16Q3 10 6 16T12 16T18 16T24 16T30 16T36 16T42 16T48 16" fill="none" stroke="currentColor" stroke-width=".6"/>'},
 rhythm:{w:48,h:24,tile:'<circle cx="6" cy="12" r="3" fill="currentColor"/><circle cx="18" cy="12" r="1.5" fill="currentColor"/><circle cx="24" cy="12" r="3" fill="currentColor"/><circle cx="36" cy="12" r="1.5" fill="currentColor"/><circle cx="42" cy="12" r="3" fill="currentColor"/>'},
 electric:{w:48,h:32,tile:'<path d="M0 22H8V10H16V22H24V10H32V22H40V10H48" fill="none" stroke="currentColor" stroke-width="1"/>'},
 perception:{w:48,h:48,tile:'<circle cx="24" cy="24" r="6" fill="none" stroke="currentColor"/><circle cx="24" cy="24" r="13" fill="none" stroke="currentColor" stroke-width=".8"/><circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width=".6"/>'}
};
