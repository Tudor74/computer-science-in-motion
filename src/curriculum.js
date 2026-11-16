/* ===================== Curriculum: eras → lessons → scenes ===================== */
// The Buddhist canon (Tripitaka, "three baskets") in historical order: from memorised recitation, through the
// baskets and councils, to palm leaf and birch bark, translation into Chinese and Tibetan, woodblock printing,
// and today's digital canons and scholarship. Traditional accounts are labelled as traditional and shown beside
// what scholars have established. Lessons, sources and connections are registered by each era's files.
const CURRICULUM={version:1,
stages:[
 {id:'oral',name:'1 · Spoken teaching',years:'c. 5th century BCE onward',why:'Teachings memorised and recited by groups: how a long text stays stable without writing.'},
 {id:'baskets',name:'2 · The three baskets',years:'Structure of the canon',why:'Vinaya, Sutta and Abhidhamma: what each basket holds and how it is organised.'},
 {id:'councils',name:'3 · Councils and Ashoka',years:'c. 400–250 BCE',why:'Communal recitations, the first schools, and an emperor’s inscriptions: the earliest datable evidence.'},
 {id:'writing',name:'4 · Writing it down',years:'1st century BCE–5th century CE',why:'Palm leaves in Sri Lanka, birch-bark scrolls from Gandhāra, and the commentaries.'},
 {id:'chinese',name:'5 · Into Chinese',years:'2nd–10th century',why:'Translation teams, Kumārajīva and Xuanzang, catalogues, and how translation choices shaped meaning.'},
 {id:'tibetan',name:'6 · Tibetan and other canons',years:'7th–14th century',why:'The Kangyur and Tengyur, and how the Pali, Chinese and Tibetan canons compare.'},
 {id:'printing',name:'7 · Printing',years:'868–1900',why:'The Diamond Sūtra of 868, the Tripitaka Koreana’s 81,000 blocks, and royal editions.'},
 {id:'modern',name:'8 · The canon today',years:'1881–today',why:'Critical editions, digital canons, comparing parallels across languages, and new manuscript finds.'}
],
lessons:[]};
const THREADS=[];
// Further reading: stage files add entries to SOURCES (declared in core.js) with SOURCE(key,{title,url?,note?}).

/* Header textures: a quiet era cue, not a difficulty rating. */
const TEXTURES={
 oral:{w:48,h:24,tile:'<path d="M0 12Q6 4 12 12T24 12T36 12T48 12" fill="none" stroke="currentColor" stroke-width=".9"/>'},
 baskets:{w:48,h:32,tile:'<path d="M4 10H14L12 24H6ZM19 10H29L27 24H21ZM34 10H44L42 24H36Z" fill="none" stroke="currentColor" stroke-width=".9"/>'},
 councils:{w:40,h:40,tile:'<circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" stroke-width=".8" stroke-dasharray="2 4"/><circle cx="20" cy="20" r="2.5" fill="currentColor"/>'},
 writing:{w:56,h:24,tile:'<rect x="4" y="6" width="48" height="12" rx="2" fill="none" stroke="currentColor" stroke-width=".9"/><circle cx="18" cy="12" r="1.5" fill="currentColor"/><circle cx="38" cy="12" r="1.5" fill="currentColor"/>'},
 chinese:{w:40,h:40,tile:'<path d="M10 8V32M20 8V32M30 8V32" stroke="currentColor" stroke-width=".9"/><path d="M6 14H14M16 20H24M26 26H34" stroke="currentColor" stroke-width=".6"/>'},
 tibetan:{w:56,h:24,tile:'<rect x="4" y="7" width="48" height="10" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M10 12H46" stroke="currentColor" stroke-width=".6"/>'},
 printing:{w:40,h:36,tile:'<rect x="6" y="6" width="28" height="24" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M11 12H29M11 18H29M11 24H24" stroke="currentColor" stroke-width=".7"/>'},
 modern:{w:44,h:36,tile:'<path d="M6 10H38M6 18H38M6 26H38" stroke="currentColor" stroke-width=".6"/><path d="M14 10L22 18L14 26M30 10L22 18L30 26" fill="none" stroke="currentColor" stroke-width=".8"/>'}
};
