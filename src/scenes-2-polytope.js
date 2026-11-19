/* ===================== Dimensions In Motion · Era 2 · Hypercubes and polytopes ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/DIMENSIONS-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const D2_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

D2_placeholder('building-cubes','Building the n-cube',
 'The n-cube is made by sliding an (n−1)-cube one unit in a new perpendicular direction and joining each corner to its copy; the 4-cube is called the tesseract.');
D2_placeholder('counting-parts','Counting the parts',
 'An n-cube has 2^n vertices and n·2^(n−1) edges; the tesseract has 16 vertices, 32 edges, 24 square faces and 8 cubical cells.');
D2_placeholder('simplex-cross','Simplices and cross-polytopes',
 'The n-simplex has n+1 corners, each joined to all the others; the n-dimensional cross-polytope has 2n corners, a pair on each axis, and is the dual of the n-cube.');
D2_placeholder('regular-polytopes','The regular polytopes',
 'A polytope is regular when all its faces, edges and corners are alike; there are five in three dimensions, six in four, and three in every dimension above four.');
D2_placeholder('special-polytopes','The 24-cell, 120-cell and 600-cell',
 'The 24-cell is made of 24 octahedra and has no analogue in any other dimension; the 120-cell is made of dodecahedra and the 600-cell of tetrahedra.');
D2_placeholder('euler-formula','Euler’s formula',
 'For a convex polyhedron V − E + F = 2; for a convex four-dimensional polytope V − E + F − C = 0; in n dimensions the alternating sum is 1 − (−1)^n.');
