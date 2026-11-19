/* ===================== Dimensions In Motion · Era 8 · Dimensions at work ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/DIMENSIONS-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const D8_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

D8_placeholder('configuration-space','Configuration space',
 'A robot arm with two rotating joints is described by two angles, and because each angle wraps round, the space of all its positions is a torus.');
D8_placeholder('phase-space','Phase space',
 'The phase space of a system has one direction for each position and one for each momentum, so a pendulum’s state is a point in two dimensions and N atoms in space need 6N.');
D8_placeholder('data-dimensions','Data in many dimensions',
 'A table with n measurements per row makes each row a point in n dimensions; principal component analysis (Pearson 1901, Hotelling 1933) finds the directions in which the points spread most.');
D8_placeholder('fractal-dimension','Fractal dimension',
 'Richardson found that a coastline’s measured length grows as the ruler shrinks; Mandelbrot (1967) read the rate of growth as a dimension between 1 and 2, as Hausdorff’s 1918 definition allows.');
D8_placeholder('persistent-homology','Topological data analysis',
 'Persistent homology grows a ball round each data point and records when loops and holes appear and fill in; the features that last over a wide range of sizes describe the shape of the data.');
D8_placeholder('extra-dimensions','Extra dimensions in physics',
 'Kaluza (1921) and Klein (1926) showed that gravity in five dimensions, with the fifth curled into a tiny circle, includes electromagnetism; no experiment has found extra dimensions.');
