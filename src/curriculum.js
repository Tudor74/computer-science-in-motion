/* ===================== Curriculum: eras → lessons → scenes ===================== */
// Techno in historical order: the machines and scenes that led to it, Detroit, the instruments, Berlin, the UK
// and rave, the sub-genres, DJ craft, and techno today with the science of groove. Every Try it scene makes
// sound in the browser. Lessons, sources and connections are registered by each era's files.
const CURRICULUM={version:1,
stages:[
 {id:'roots',name:'1 · Roots',years:'1970–1984',why:'Kraftwerk’s machines, Moroder’s sequenced disco, electro and Chicago house: the ingredients before the name.'},
 {id:'detroit',name:'2 · Detroit',years:'1981–1992',why:'The Belleville Three, a city and its radio, Afrofuturism, and Underground Resistance.'},
 {id:'machines',name:'3 · The machines',years:'1980–1990',why:'The TR-808 and TR-909 drum machines, the TB-303 bassline and the step sequencer: built here in sound.'},
 {id:'berlin',name:'4 · Berlin',years:'1989–2004',why:'A wall comes down, empty buildings become clubs, Tresor links Detroit and Berlin, and minimal follows.'},
 {id:'rave',name:'5 · UK and rave',years:'1987–1997',why:'Acid house summers, free parties and sound systems, a law against repetitive beats, and what came after.'},
 {id:'styles',name:'6 · Styles',years:'1990–today',why:'Acid, minimal, dub techno and hard techno as settings of tempo, kick, swing and filter you can morph between.'},
 {id:'craft',name:'7 · DJ craft and arrangement',years:'Technique',why:'Beatmatching, EQ mixing, phrasing, and how a track builds and releases tension.'},
 {id:'today',name:'8 · Techno today',years:'2000–today',why:'Global scenes, who gets credit, the tools, and what research says about groove and why bodies move.'}
],
lessons:[]};
const THREADS=[];
// Further reading: stage files add entries to SOURCES (declared in core.js) with SOURCE(key,{title,url?,note?}).

/* Header textures: a quiet era cue, not a difficulty rating. */
const TEXTURES={
 roots:{w:48,h:24,tile:'<path d="M0 16H8V8H16V16H24V8H32V16H40V8H48" fill="none" stroke="currentColor" stroke-width="1"/>'},
 detroit:{w:44,h:32,tile:'<path d="M4 28V14H12V28M16 28V8H24V28M28 28V18H36V28" fill="none" stroke="currentColor" stroke-width=".9"/>'},
 machines:{w:48,h:24,tile:'<rect x="3" y="7" width="9" height="10" fill="currentColor" opacity=".6"/><rect x="15" y="7" width="9" height="10" fill="none" stroke="currentColor"/><rect x="27" y="7" width="9" height="10" fill="none" stroke="currentColor"/><rect x="39" y="7" width="9" height="10" fill="none" stroke="currentColor"/>'},
 berlin:{w:44,h:32,tile:'<path d="M2 26H42M8 26V10M16 26V10M24 26V10M32 26V10" stroke="currentColor" stroke-width=".9"/><path d="M18 10H22" stroke="currentColor" stroke-width="2.4" opacity=".0"/>'},
 rave:{w:40,h:40,tile:'<circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" stroke-width=".9"/><circle cx="15" cy="16" r="1.6" fill="currentColor"/><circle cx="25" cy="16" r="1.6" fill="currentColor"/><path d="M13 23Q20 30 27 23" fill="none" stroke="currentColor" stroke-width=".9"/>'},
 styles:{w:48,h:28,tile:'<path d="M4 22V10M14 22V6M24 22V14M34 22V8M44 22V16" stroke="currentColor" stroke-width="1.4"/>'},
 craft:{w:48,h:32,tile:'<circle cx="14" cy="16" r="9" fill="none" stroke="currentColor" stroke-width=".9"/><circle cx="14" cy="16" r="2" fill="currentColor"/><circle cx="34" cy="16" r="9" fill="none" stroke="currentColor" stroke-width=".9"/><circle cx="34" cy="16" r="2" fill="currentColor"/>'},
 today:{w:44,h:44,tile:'<circle cx="22" cy="22" r="14" fill="none" stroke="currentColor" stroke-width=".8"/><path d="M8 22H36M22 8Q30 22 22 36M22 8Q14 22 22 36" fill="none" stroke="currentColor" stroke-width=".6"/>'}
};
