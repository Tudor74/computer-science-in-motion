/* ===================== Levin Lab In Motion · Era 2 · Left and right ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/LEVIN-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const L2_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

L2_placeholder('body-asymmetry','Left and right',
 'Vertebrate bodies look symmetric outside but are asymmetric inside: in most people the heart sits to the left, and reversed or mixed organ positions are called situs inversus and heterotaxy.');
L2_placeholder('left-right-cascade','A left–right gene cascade',
 'In 1995 Levin, Johnson, Stern, Kuehn and Tabin reported in Cell a chain of genes, including Sonic hedgehog and a Nodal-related gene, expressed on one side of the early chick embryo.');
L2_placeholder('ion-flux','Ion flux before genes',
 'Levin and colleagues (Cell, 2002) reported that the H+/K+-ATPase is unevenly distributed in very early frog and chick embryos and that blocking it disturbs left–right patterning.');
L2_placeholder('serotonin-flow','Serotonin moves sideways',
 'Fukumoto, Kema and Levin (2005) proposed that serotonin moves through gap junctions toward one side of the early frog embryo, driven by a voltage difference.');
L2_placeholder('gap-junction-model','The gap-junction model',
 'Levin and Mercola (1998) reported that blocking gap-junctional communication in early frog embryos disturbs left–right patterning and proposed that a gap-junction path carries a left–right signal.');
L2_placeholder('cilia-debate','Cilia or ions?',
 'In mice, cilia in the embryonic node drive a leftward fluid flow (Nonaka et al., 1998); how early ion-flux and cilia-flow mechanisms relate across species is still debated.');
