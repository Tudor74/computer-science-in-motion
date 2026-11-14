/* ===================== Curriculum: eras → lessons → scenes ===================== */
// The route follows what computers could do, from lamps to headsets. Each era's lessons are registered
// by its stage file (LESSON in src/scenes-N-lessons.js), with the research that shaped it (SOURCE).
const CURRICULUM={version:1,
stages:[
 {id:'lights',name:'1 · Lights and switches',years:'1940s–1960s',why:'The first interface was the machine itself: switches in, lamps out, then cards, typewriters and the first screens. Psychologists began measuring how people watch, wait and decide.'},
 {id:'pointing',name:'2 · Pointing and linking',years:'1960s',why:'Light pens, the mouse and hypertext made the screen something you could point at and follow. Fitts and Hick gave design its first laws of human performance.'},
 {id:'desktop',name:'3 · The desktop',years:'1970s–1980s',why:'Windows, icons, menus and the pointer turned computing into direct manipulation of visible objects, and cognitive models began to predict how long tasks take.'},
 {id:'mind',name:'4 · How the mind reads a screen',years:'1920s–1990s research',why:'Gestalt grouping, pop-out, memory limits, affordances and blindness to change explain why some screens read at a glance and others do not.'},
 {id:'visual',name:'5 · Seeing data',years:'1960s–2000s',why:'From Bertin’s visual variables to Rosling’s moving bubbles: which encodings the eye decodes accurately, and how to show a lot without overwhelming.'},
 {id:'web',name:'6 · The networked page',years:'1990s–2000s',why:'The web made every page a link away. Foraging, scanning and testing with a handful of users became the science of everyday design.'},
 {id:'touch',name:'7 · Touch, mobile and attention',years:'2000s–2010s',why:'Fingers replaced pointers and phones went everywhere: target sizes, gestures, interruptions, accessibility and persuasion.'},
 {id:'immersive',name:'8 · Immersive and beyond',years:'1968–tomorrow',why:'Head-mounted displays, augmented reality, voice, brain signals and AI agents: interfaces that surround us, listen to us or act for us.'}
],
lessons:[]};
const THREADS=[];
// Further reading: stage files add entries to SOURCES (declared in core.js) with SOURCE(key,{title,url?,note?}).

/* Header textures: a quiet era cue, not a difficulty rating. */
const TEXTURES={
 lights:{w:26,h:26,tile:'<circle cx="13" cy="13" r="3.2" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="13" cy="13" r="1.2" fill="currentColor"/>'},
 pointing:{w:36,h:36,tile:'<path d="M18 10V26M10 18H26" fill="none" stroke="currentColor" stroke-width="1.1"/><circle cx="18" cy="18" r="5" fill="none" stroke="currentColor" stroke-width="1"/>'},
 desktop:{w:48,h:40,tile:'<rect x="4" y="6" width="22" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.1"/><rect x="18" y="16" width="24" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.1"/><path d="M18 20H42" stroke="currentColor" stroke-width="1"/>'},
 mind:{w:40,h:40,tile:'<circle cx="8" cy="8" r="3" fill="currentColor"/><circle cx="16" cy="8" r="3" fill="currentColor"/><circle cx="32" cy="8" r="3" fill="none" stroke="currentColor"/><circle cx="8" cy="28" r="3" fill="none" stroke="currentColor"/><circle cx="28" cy="28" r="3" fill="currentColor"/><circle cx="36" cy="28" r="3" fill="currentColor"/>'},
 visual:{w:40,h:40,tile:'<path d="M4 40V30M12 40V18M20 40V26M28 40V8M36 40V22" fill="none" stroke="currentColor" stroke-width="1.6"/>'},
 web:{w:44,h:44,tile:'<path d="M6 6L22 16L38 6M22 16V34M6 38L22 34L38 38" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="22" cy="16" r="2.4" fill="currentColor"/><circle cx="22" cy="34" r="2.4" fill="currentColor"/>'},
 touch:{w:48,h:48,tile:'<circle cx="24" cy="24" r="4" fill="currentColor"/><circle cx="24" cy="24" r="11" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="24" cy="24" r="19" fill="none" stroke="currentColor" stroke-width=".8"/>'},
 immersive:{w:60,h:40,tile:'<path d="M0 40L30 8L60 40M10 40L30 8M50 40L30 8M20 40L30 8M40 40L30 8M0 30H60M0 22H60" fill="none" stroke="currentColor" stroke-width=".8"/>'}
};
