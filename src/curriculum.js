/* ===================== Curriculum: eras → lessons → scenes ===================== */
// Ted Nelson's ideas in the order he had them: from Bush's memex and a student's index cards, through
// hypertext, Computer Lib and Xanadu, to the web he criticised and the tools that took up his ideas.
// Lessons, sources and connections are registered by each era's files (LESSON, SOURCE, THREAD in src/scenes-N-lessons.js).
const CURRICULUM={version:1,
stages:[
 {id:'roots',name:'1 · Before hypertext',years:'1945–1960',why:'Bush’s memex, associative trails and a student who found that ideas do not come in a line.'},
 {id:'hypertext',name:'2 · Naming hypertext',years:'1960–1965',why:'Project Xanadu begins, and a 1965 paper names hypertext, hypermedia and a file structure built for change.'},
 {id:'systems',name:'3 · The first systems',years:'1967–1974',why:'HES and FRESS at Brown, Engelbart’s demo, and ideas like stretchtext that are still unusual today.'},
 {id:'computerlib',name:'4 · Computer Lib',years:'1974',why:'“You can and must understand computers now”: a self-published manifesto for personal, playful computing.'},
 {id:'xanadu',name:'5 · Xanadu’s design',years:'1981–1992',why:'Transclusion, two-way links, permanent addresses and a royalty for every quotation.'},
 {id:'web',name:'6 · The web arrives',years:'1989–2000',why:'A simpler hypertext won. What one-way links, broken links and lost versions cost, measured.'},
 {id:'later',name:'7 · Later structures',years:'1995–2014',why:'ZigZag’s many dimensions, Xanadu Space and OpenXanadu’s side-by-side documents.'},
 {id:'legacy',name:'8 · Reading and legacy',years:'Research',why:'What studies say about reading hypertext, and where his ideas live on: backlinks, versions, annotation, content addresses.'}
],
lessons:[]};
const THREADS=[];
// Further reading: stage files add entries to SOURCES (declared in core.js) with SOURCE(key,{title,url?,note?}).

/* Header textures: a quiet era cue, not a difficulty rating. */
const TEXTURES={
 roots:{w:44,h:32,tile:'<rect x="4" y="6" width="14" height="20" fill="none" stroke="currentColor" stroke-width=".9"/><rect x="24" y="6" width="14" height="20" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M18 16H24" stroke="currentColor"/>'},
 hypertext:{w:48,h:32,tile:'<path d="M4 8H20M4 14H16M4 20H20M28 12H44M28 18H40" stroke="currentColor" stroke-width=".9"/><path d="M20 8Q26 4 28 12" fill="none" stroke="currentColor" stroke-width=".8"/>'},
 systems:{w:40,h:32,tile:'<rect x="6" y="4" width="28" height="20" rx="2" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M14 28H26" stroke="currentColor"/>'},
 computerlib:{w:40,h:40,tile:'<circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M20 8V32M8 20H32" stroke="currentColor" stroke-width=".6"/>'},
 xanadu:{w:48,h:36,tile:'<rect x="2" y="6" width="16" height="24" fill="none" stroke="currentColor" stroke-width=".9"/><rect x="30" y="6" width="16" height="24" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M18 14L30 12M18 22L30 24" stroke="currentColor" stroke-width=".8"/>'},
 web:{w:40,h:40,tile:'<path d="M20 4L36 20L20 36L4 20Z" fill="none" stroke="currentColor" stroke-width=".8"/><path d="M4 20H36M20 4V36" stroke="currentColor" stroke-width=".5"/>'},
 later:{w:40,h:40,tile:'<path d="M6 6H34M6 20H34M6 34H34M6 6V34M20 6V34M34 6V34" stroke="currentColor" stroke-width=".6"/>'},
 legacy:{w:48,h:28,tile:'<circle cx="8" cy="14" r="3" fill="currentColor"/><circle cx="24" cy="14" r="3" fill="none" stroke="currentColor"/><circle cx="40" cy="14" r="3" fill="currentColor"/><path d="M11 14H21M27 14H37" stroke="currentColor" stroke-width=".8"/>'}
};
