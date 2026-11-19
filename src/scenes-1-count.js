/* ===================== Dimensions In Motion · Era 1 · Counting dimensions ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/DIMENSIONS-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const D1_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

D1_placeholder('coordinates','Coordinates',
 'A point in the plane is named by two numbers and a point in space by three; a list of n numbers names a point in n-dimensional space.');
D1_placeholder('degrees-of-freedom','Degrees of freedom',
 'The degrees of freedom of a system are the independent numbers needed to describe its state: a bead on a wire has one, a counter on a table two, a rigid body in space six.');
D1_placeholder('flatland','Flatland',
 'In Edwin Abbott’s Flatland (1884) two-dimensional beings see a sphere passing through their plane only as a circle that grows and then shrinks.');
D1_placeholder('shadows-projection','Shadows and projection',
 'A shadow is a projection: it drops one direction, so the same cube can cast a square, a rectangle or a regular hexagon depending on how it is turned.');
D1_placeholder('n-distance','Distance in n dimensions',
 'The distance between two points in n dimensions is the square root of the sum of the squares of their n coordinate differences; the long diagonal of a unit n-cube is √n.');
D1_placeholder('what-is-dimension','What is a dimension?',
 'Cantor (1877) matched the points of a square one to one with the points of a line; Brouwer (1911) proved that no such matching can be continuous both ways.');
