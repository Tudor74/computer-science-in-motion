/* ===================== Levin Lab In Motion · Era 4 · Frog faces, eyes and tails ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/LEVIN-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const L4_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

L4_placeholder('electric-face','The electric face',
 'Vandenberg, Morrie and Adams (2011) imaged frog embryos with a voltage dye and saw patterns of more and less polarised cells that prefigured where face structures would form.');
L4_placeholder('induced-eyes','Eyes outside the head',
 'Pai and colleagues (2012) reported that setting a particular membrane voltage in frog embryo cells, by expressing ion channels, could induce eye-like structures in the gut and tail.');
L4_placeholder('tail-regeneration','Tails that regrow',
 'Xenopus tadpoles regrow amputated tails except during a refractory stage; Adams, Masi and Levin (2007) reported that a proton pump (V-ATPase) is needed for regrowth, and that expressing a yeast proton pump restored it in the refractory stage.');
L4_placeholder('tail-sodium','A sodium pulse',
 'Tseng and colleagues (2010) reported that sodium entry is needed for tadpole tail regrowth, and that a one-hour treatment raising sodium entry could trigger regrowth in the refractory stage.');
L4_placeholder('picasso-tadpoles','“Picasso” tadpoles',
 'Vandenberg, Adams and Levin (2012) reported that tadpoles with face organs moved to abnormal positions often rearranged them into a near-normal face as they became frogs.');
L4_placeholder('leg-regrowth','A frog leg regrows',
 'Murugan and colleagues (2022) reported that a 24-hour treatment with a five-drug cocktail in a wearable silicone cap led to partial regrowth of amputated hind legs in adult frogs over many months.');
