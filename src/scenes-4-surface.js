/* ===================== Dimensions In Motion · Era 4 · Surfaces ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/DIMENSIONS-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const D4_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

D4_placeholder('manifold-idea','The idea of a manifold',
 'A manifold is a space that looks flat close up: every small patch of an n-dimensional manifold can be matched smoothly to a patch of ordinary n-dimensional space.');
D4_placeholder('gluing-diagrams','Gluing diagrams',
 'Gluing opposite edges of a square with matching arrows gives a torus; other gluings of the same square give a sphere, a Klein bottle or a projective plane.');
D4_placeholder('orientability','The Möbius strip and orientability',
 'A Möbius strip has one side and one edge; a surface is non-orientable when it contains a loop that brings a traveller back mirror-reversed.');
D4_placeholder('klein-projective','The Klein bottle and projective plane',
 'The Klein bottle and the projective plane are closed non-orientable surfaces; in three-dimensional space they must pass through themselves, but in four dimensions they fit without crossing.');
D4_placeholder('euler-genus','Euler characteristic and genus',
 'For any way of cutting a closed surface into faces, V − E + F is the same number, its Euler characteristic: 2 for a sphere, 0 for a torus, and 2 − 2g for a surface with g handles.');
D4_placeholder('surface-classification','Classifying surfaces',
 'Every closed surface is a sphere with handles or a sphere with cross-caps; whether it is orientable and its Euler characteristic together decide which one.');
