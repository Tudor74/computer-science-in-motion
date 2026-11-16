/* ===================== Curriculum: eras → lessons → scenes ===================== */
// Language in historical order: from clay tokens and the first scripts, through the discovery of language
// families and sound laws, structure, grammar, how children learn, meaning, language in society, to machines.
// Lessons, sources and connections are registered by each era's files (LESSON, SOURCE, THREAD in src/scenes-N-lessons.js).
const CURRICULUM={version:1,
stages:[
 {id:'writing',name:'1 · Writing',years:'3400 BCE–1500',why:'Tokens became tablets, pictures became sounds, the alphabet spread, lost scripts were cracked and print multiplied text.'},
 {id:'families',name:'2 · Families and sound laws',years:'1786–1900',why:'Languages turned out to be relatives, and their sounds change by regular laws that let us rebuild lost ancestors.'},
 {id:'structure',name:'3 · Structure',years:'1916–1960',why:'Signs, phonemes and word parts, Zipf’s law, the information in English, and whether language shapes thought.'},
 {id:'grammar',name:'4 · Grammar',years:'1957–2000',why:'Trees, recursion and formal grammars, sentences that lead you astray, universals and a sign language born in a school.'},
 {id:'learning',name:'5 · Learning language',years:'1970–today',why:'Babies tuning to sounds, finding words in a stream, learning meanings fast, critical periods, bilingualism and reading.'},
 {id:'meaning',name:'6 · Meaning and use',years:'1950–today',why:'Reference, implicature, speech acts, metaphor, colour words and how conversation takes turns.'},
 {id:'society',name:'7 · Language in society',years:'1960–today',why:'Variation and change, contact and creoles, dying languages, accents and bias, and English around the world.'},
 {id:'machines',name:'8 · Language machines',years:'1949–today',why:'Machine translation, n-grams, word vectors, attention and large language models, and what they do and do not understand.'}
],
lessons:[]};
const THREADS=[];
// Further reading: stage files add entries to SOURCES (declared in core.js) with SOURCE(key,{title,url?,note?}).

/* Header textures: a quiet era cue, not a difficulty rating. */
const TEXTURES={
 writing:{w:40,h:28,tile:'<path d="M6 8L12 8L9 12ZM20 8L26 8L23 12ZM10 18L16 18L13 22Z" fill="currentColor" opacity=".7"/>'},
 families:{w:44,h:40,tile:'<path d="M22 4V14M22 14L10 28M22 14L34 28M10 28L4 36M10 28L16 36" fill="none" stroke="currentColor" stroke-width=".9"/>'},
 structure:{w:40,h:32,tile:'<rect x="4" y="10" width="10" height="12" fill="none" stroke="currentColor" stroke-width=".9"/><rect x="16" y="10" width="8" height="12" fill="none" stroke="currentColor" stroke-width=".9"/><rect x="26" y="10" width="10" height="12" fill="currentColor" opacity=".4"/>'},
 grammar:{w:44,h:36,tile:'<path d="M22 4L10 18M22 4L34 18M10 18L4 32M10 18L16 32" fill="none" stroke="currentColor" stroke-width=".9"/>'},
 learning:{w:48,h:24,tile:'<path d="M0 12Q6 2 12 12T24 12T36 12T48 12" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M14 4V20M34 4V20" stroke="currentColor" stroke-width=".5"/>'},
 meaning:{w:44,h:32,tile:'<path d="M4 6H24V18H12L6 24V18H4Z" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M28 12H40V22H38V26L34 22H28Z" fill="currentColor" opacity=".4"/>'},
 society:{w:48,h:28,tile:'<circle cx="10" cy="14" r="6" fill="none" stroke="currentColor"/><circle cx="24" cy="14" r="6" fill="none" stroke="currentColor"/><circle cx="38" cy="14" r="6" fill="currentColor" opacity=".35"/>'},
 machines:{w:44,h:36,tile:'<circle cx="6" cy="8" r="2.5" fill="currentColor"/><circle cx="6" cy="28" r="2.5" fill="currentColor"/><circle cx="22" cy="18" r="2.5" fill="currentColor"/><circle cx="38" cy="18" r="2.5" fill="none" stroke="currentColor"/><path d="M6 8L22 18L6 28M22 18H38" stroke="currentColor" stroke-width=".7"/>'}
};
