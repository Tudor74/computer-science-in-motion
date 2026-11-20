/* ===================== Levin Lab In Motion · Era 3 · Planaria ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/LEVIN-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const L3_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

L3_placeholder('worm-regeneration','Worms that regrow',
 'Thomas Hunt Morgan reported in 1898 that small fragments of a planarian can regrow whole worms; adult stem cells called neoblasts make the new tissue, and Wagner, Wang and Reddien (2011) showed that a single neoblast can restore a worm.');
L3_placeholder('two-headed-worms','Two-headed worms',
 'Briefly blocking gap junctions with octanol in cut planarian fragments made some of them regenerate a head at both ends (Nogi & Levin 2005; Oviedo et al. 2010).');
L3_placeholder('rewritten-pattern','A pattern that persists',
 'Oviedo and colleagues (2010) reported that two-headed worms, cut again in plain water, again regrew two heads; Durant and colleagues (2017) reported that some treated worms that looked normal also regrew two heads when cut.');
L3_placeholder('species-heads','Heads of other species',
 'Emmons-Bell and colleagues (2015) reported that blocking gap junctions in fragments of Girardia dorotocephala led some to regrow heads shaped like those of other planarian species, without any change to their genome.');
L3_placeholder('barium-heads','Adapting to barium',
 'Barium blocks many potassium channels and makes planarian heads degenerate; Emmons-Bell and colleagues (2019) reported that worms kept in barium regrew heads that tolerated it, with altered gene expression.');
L3_placeholder('headless-memory','Memory without a head?',
 'Shomrat and Levin (2013) reported that planarians familiarised with a rough-floored arena kept a trace of it after their heads were cut off and regrew; it follows James McConnell’s disputed experiments of the 1950s and 60s.');
