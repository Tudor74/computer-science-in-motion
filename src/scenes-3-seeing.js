/* ===================== Dimensions In Motion · Era 3 · Seeing the fourth dimension ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/DIMENSIONS-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const D3_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

D3_placeholder('slicing','Slicing a tesseract',
 'As a tesseract passes cube-first through three-dimensional space, the slice is a cube that appears, stays the same while the tesseract moves through, and then vanishes.');
D3_placeholder('schlegel-diagrams','Projections and Schlegel diagrams',
 'A Schlegel diagram projects a polytope from a point just outside one of its cells, so that cell becomes the outer frame and all the others fit inside it without overlapping.');
D3_placeholder('rotation-4d','Rotation in four dimensions',
 'A rotation in four dimensions turns one plane and leaves the perpendicular plane fixed; a double rotation turns both planes at once and leaves only the centre fixed.');
D3_placeholder('unfolding-nets','Unfolding nets',
 'A cube unfolds into six squares in the plane; a tesseract unfolds into eight cubes in three-dimensional space, as in Dalí’s Crucifixion (Corpus Hypercubus), 1954.');
D3_placeholder('hinton-cubes','Hinton’s cubes',
 'Charles Howard Hinton taught the fourth dimension with sets of coloured cubes; the learner memorised the colours of every slice so that the whole could be pictured.');
D3_placeholder('stereographic','Stereographic projection',
 'Stereographic projection maps a sphere with one point removed onto flat space and sends circles to circles or straight lines; it works for spheres of any dimension.');
