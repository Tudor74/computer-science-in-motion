/* ===================== Dimensions In Motion · Era 6 · Higher manifolds ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/DIMENSIONS-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const D6_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

D6_placeholder('three-manifolds','Three-manifolds you could live in',
 'In a 3-torus, leaving through one face of a cube brings you back through the opposite face; the Poincaré dodecahedral space glues opposite faces of a dodecahedron with a twist.');
D6_placeholder('poincare-conjecture','The Poincaré conjecture',
 'Poincaré asked in 1904 whether every closed three-manifold in which every loop can be shrunk to a point is the 3-sphere; Perelman proved that it is in 2002–03.');
D6_placeholder('geometrisation','Thurston’s geometrisation',
 'Thurston conjectured in 1982 that every closed three-manifold can be cut into pieces each carrying one of eight geometries; Perelman’s work proved this as well.');
D6_placeholder('knots-4d','Knots and the fourth dimension',
 'A knot is a closed loop in three-dimensional space; in four dimensions every such loop can be untied, because one strand can pass another by moving in the extra direction.');
D6_placeholder('exotic-spheres','Exotic spheres',
 'Milnor found in 1956 a seven-dimensional manifold that can be continuously but not smoothly deformed into the ordinary 7-sphere; the 7-sphere has 28 smooth structures in all.');
D6_placeholder('dimension-four','Dimension four is strange',
 'Freedman (1982) classified simply connected four-manifolds up to continuous deformation and Donaldson (1983) showed that many have no smooth structure; together they show that four-dimensional space has exotic smooth structures, unlike every other dimension.');
