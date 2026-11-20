/* ===================== Curriculum: eras → lessons → scenes ===================== */
// The research of Michael Levin's lab and the work it builds on: bioelectricity before the lab, left and right,
// planaria, frog faces, eyes and tails, cancer and the brain, xenobots, basal cognition, and tools and open questions.
// Lessons, sources and connections are registered by each era’s files (LESSON, SOURCE, THREAD in src/scenes-N-lessons.js).
const CURRICULUM={version:1,
stages:[
 {id:'signal',name:'1 · Bioelectricity before the lab',years:'1791–today',why:'Every cell keeps a voltage, not only nerve and muscle: pumps and channels, Galvani to Burr and Lund, the vibrating probe, voltage dyes, gap junctions, and the question of whether a signal instructs or only permits.'},
 {id:'asymmetry',name:'2 · Left and right',years:'1995–today',why:'How an embryo first tells left from right: a sided gene cascade in the chick, ion pumps and serotonin in the earliest cells, the gap-junction model, and the debate with the cilia-flow account.'},
 {id:'planaria',name:'3 · Planaria',years:'1898–today',why:'Flatworms that rebuild a whole body from a piece: two-headed worms after a brief block of gap junctions, patterns that persist through later cuts, other species’ heads, adapting to barium, and a disputed memory.'},
 {id:'frog',name:'4 · Frog faces, eyes and tails',years:'2003–today',why:'Voltage patterns in frog embryos and tadpoles: the “electric face”, eyes induced outside the head, tails regrown in the refractory stage, scrambled faces that normalise, and an adult leg partly regrown. Animal research, not human treatment.'},
 {id:'cancer',name:'5 · Cancer and the brain',years:'1966–today',why:'Membrane voltage and cell division, instructor cells, tumour-like growths held back by hyperpolarisation in tadpoles, cells that stop communicating, brain defects repaired in frog embryos, and a hypothesis about the boundary of the self. Not medical advice.'},
 {id:'xenobot',name:'6 · Xenobots',years:'2020–today',why:'Living machines built from frog cells: designs evolved in simulation, self-assembled swimmers with cilia, kinematic self-replication, anthrobots from human airway cells, and what “organism” and “robot” mean here.'},
 {id:'cognition',name:'7 · Basal cognition',years:'1906–today',why:'Sensing, memory and choice without a brain, and the lab’s frameworks for thinking about them: TAME, the cognitive light cone, navigating morphospace, learning in gene networks, and the criticism they meet.'},
 {id:'frontier',name:'8 · Tools and open questions',years:'2016–today',why:'Simulating bioelectric tissue, ion-channel drugs, reading and writing a proposed bioelectric code, what other labs have confirmed, the open questions, and the lab’s most speculative ideas, labelled as speculation.'}
],
lessons:[]};
const THREADS=[];
// Further reading: stage files add entries to SOURCES (declared in core.js) with SOURCE(key,{title,url?,note?}).

/* Header textures: a quiet era cue, not a difficulty rating. */
const TEXTURES={
 signal:{w:44,h:36,tile:'<path d="M2 12H42M2 24H42" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M10 6V9M8.5 7.5H11.5M30 6V9M28.5 7.5H31.5M8.5 29.5H11.5M28.5 29.5H31.5" stroke="currentColor" stroke-width=".7"/><circle cx="20" cy="18" r="1.6" fill="currentColor"/>'},
 asymmetry:{w:44,h:36,tile:'<path d="M22 4V32" stroke="currentColor" stroke-width=".6" stroke-dasharray="2 2"/><path d="M18 12Q8 14 10 24Q12 30 18 28" fill="none" stroke="currentColor" stroke-width=".9"/><circle cx="30" cy="20" r="3" fill="currentColor" opacity=".5"/>'},
 planaria:{w:48,h:32,tile:'<path d="M6 16Q10 9 16 12Q24 15 32 12Q38 9 42 16Q38 23 32 20Q24 17 16 20Q10 23 6 16Z" fill="none" stroke="currentColor" stroke-width=".9"/><circle cx="10" cy="15" r=".9" fill="currentColor"/><circle cx="38" cy="15" r=".9" fill="currentColor"/>'},
 frog:{w:48,h:32,tile:'<ellipse cx="14" cy="16" rx="7" ry="5" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M21 16Q30 10 36 16Q40 20 46 15" fill="none" stroke="currentColor" stroke-width=".8"/><circle cx="11" cy="14" r="1" fill="currentColor"/>'},
 cancer:{w:40,h:40,tile:'<circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width=".8"/><circle cx="26" cy="12" r="5" fill="none" stroke="currentColor" stroke-width=".8"/><circle cx="12" cy="26" r="5" fill="none" stroke="currentColor" stroke-width=".8"/><circle cx="27" cy="27" r="6" fill="currentColor" opacity=".45"/>'},
 xenobot:{w:40,h:40,tile:'<circle cx="20" cy="20" r="9" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M20 11V7M29 20H33M20 29V33M11 20H7M26.4 13.6L29 11M26.4 26.4L29 29M13.6 26.4L11 29M13.6 13.6L11 11" stroke="currentColor" stroke-width=".6"/>'},
 cognition:{w:44,h:36,tile:'<path d="M4 32L22 18L40 32M4 4L22 18L40 4" fill="none" stroke="currentColor" stroke-width=".8"/><circle cx="22" cy="18" r="2" fill="currentColor"/>'},
 frontier:{w:40,h:40,tile:'<path d="M8 8H32V32H8Z" fill="none" stroke="currentColor" stroke-width=".6" stroke-dasharray="2 2"/><circle cx="8" cy="8" r="2" fill="currentColor"/><circle cx="32" cy="8" r="2" fill="none" stroke="currentColor" stroke-width=".8"/><circle cx="8" cy="32" r="2" fill="none" stroke="currentColor" stroke-width=".8"/><circle cx="32" cy="32" r="2" fill="currentColor" opacity=".5"/>'}
};
