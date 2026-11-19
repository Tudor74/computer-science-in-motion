/* ===================== Dimensions In Motion · Era 5 · Curvature ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/DIMENSIONS-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const D5_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

D5_placeholder('theorema-egregium','Gauss’s remarkable theorem',
 'Gauss proved in 1827 that the curvature of a surface can be found from measurements made within it, which is why no flat map of a sphere can keep all distances true.');
D5_placeholder('non-euclidean','Non-Euclidean geometry',
 'In the hyperbolic geometry of Bolyai and Lobachevsky, through a point off a line there are many lines that never meet it, and every triangle’s angles add to less than 180°.');
D5_placeholder('geodesics','Geodesics',
 'A geodesic is the straightest possible path on a surface; on a sphere the geodesics are great circles, which is why long flights look curved on a flat map.');
D5_placeholder('riemann-lecture','Riemann’s 1854 lecture',
 'In his 1854 lecture, published in 1868, Riemann described spaces of any number of dimensions whose geometry is set by distances measured within them and whose curvature can vary from place to place.');
D5_placeholder('spacetime','Minkowski spacetime',
 'Minkowski (1908) joined space and time into one four-dimensional geometry in which the interval between two events, not their distance, is the same for every observer.');
D5_placeholder('curvature-inside','Curvature from inside',
 'An arrow carried round a loop while kept parallel comes back turned by an angle equal to the total curvature enclosed; on a flat surface it comes back unturned.');
