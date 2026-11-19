/* ===================== Dimensions In Motion · Era 7 · High-dimensional surprises ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/DIMENSIONS-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const D7_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

D7_placeholder('ball-volume','The volume of the n-ball',
 'The volume of a ball of radius 1 in n dimensions is π^(n/2) ÷ Γ(n/2 + 1); it is largest in five dimensions, about 5.26, and then falls towards zero.');
D7_placeholder('near-surface','Most volume is near the surface',
 'A ball of radius 0.9 holds 0.9^n of the volume of the unit ball, so in 100 dimensions less than 0.003% of the unit ball lies more than 0.1 in from its surface.');
D7_placeholder('nearly-perpendicular','Random directions are nearly perpendicular',
 'Two random directions in n dimensions have a cosine between them of typical size 1/√n, so in a thousand dimensions they are almost always within a few degrees of a right angle.');
D7_placeholder('sphere-packing','Sphere packing and kissing numbers',
 'The kissing number is how many equal balls can touch one ball: it is 12 in three dimensions, 240 in eight (the E8 lattice) and 196,560 in twenty-four (the Leech lattice).');
D7_placeholder('curse-dimensionality','The curse of dimensionality',
 'Bellman’s phrase for how the cost of covering a space grows exponentially with its dimension: ten samples per axis need 10^n samples in n dimensions.');
D7_placeholder('cube-corners','Corners of the cube',
 'A unit cube’s corners lie √n ÷ 2 from its centre, so in more than four dimensions they are further from the centre than the cube is wide, far outside the ball that touches every face.');
