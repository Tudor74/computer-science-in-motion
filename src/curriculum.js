/* ===================== Curriculum: eras → lessons → scenes ===================== */
// Space beyond three dimensions, roughly in the order it was understood: counting dimensions, hypercubes and polytopes,
// seeing the fourth dimension, surfaces, curvature, higher manifolds, high-dimensional surprises, and dimensions at work.
// Lessons, sources and connections are registered by each era’s files (LESSON, SOURCE, THREAD in src/scenes-N-lessons.js).
const CURRICULUM={version:1,
stages:[
 {id:'count',name:'1 · Counting dimensions',years:'1637–today',why:'Coordinates, degrees of freedom, Flatland’s lesson in analogy, shadows, distance in any number of dimensions, and what the word “dimension” really means.'},
 {id:'polytope',name:'2 · Hypercubes and polytopes',years:'1750–today',why:'Building the n-cube, counting its parts, simplices and cross-polytopes, Schläfli’s regular polytopes, the three great four-dimensional ones, and Euler’s formula in every dimension.'},
 {id:'seeing',name:'3 · Seeing the fourth dimension',years:'1880–today',why:'Slices, projections and Schlegel diagrams, rotation in four dimensions, unfolded nets, Hinton’s coloured cubes and stereographic projection.'},
 {id:'surface',name:'4 · Surfaces',years:'1813–today',why:'Spaces that are flat close up: gluing diagrams, the Möbius strip and orientability, the Klein bottle and projective plane, the classification of surfaces, Euler characteristic and genus.'},
 {id:'curvature',name:'5 · Curvature',years:'1827–today',why:'Gauss’s remarkable theorem, the geometries of Bolyai and Lobachevsky, geodesics, Riemann’s lecture on curved space in any dimension, Minkowski spacetime, and curvature measured from inside.'},
 {id:'manifold',name:'6 · Higher manifolds',years:'1895–today',why:'Three-dimensional spaces you could live in, the Poincaré conjecture and its proof, Thurston’s eight geometries, knots that untie in four dimensions, exotic spheres and the strangeness of dimension four.'},
 {id:'surprise',name:'7 · High-dimensional surprises',years:'1800s–today',why:'Balls that shrink as the dimension grows, volume that crowds near the surface, random directions that are nearly perpendicular, record sphere packings, the curse of dimensionality and the corners of the cube.'},
 {id:'work',name:'8 · Dimensions at work',years:'1838–today',why:'Configuration space and phase space, data as points in many dimensions, fractal dimension, topological data analysis, and extra dimensions in physics.'}
],
lessons:[]};
const THREADS=[];
// Further reading: stage files add entries to SOURCES (declared in core.js) with SOURCE(key,{title,url?,note?}).

/* Header textures: a quiet era cue, not a difficulty rating. */
const TEXTURES={
 count:{w:40,h:36,tile:'<path d="M6 30H36M6 30V4" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M6 14H24V30" fill="none" stroke="currentColor" stroke-width=".6" stroke-dasharray="2 2"/><circle cx="24" cy="14" r="1.8" fill="currentColor"/>'},
 polytope:{w:40,h:40,tile:'<rect x="6" y="6" width="20" height="20" fill="none" stroke="currentColor" stroke-width=".9"/><rect x="14" y="14" width="20" height="20" fill="none" stroke="currentColor" stroke-width=".6"/><path d="M6 6L14 14M26 6L34 14M6 26L14 34M26 26L34 34" stroke="currentColor" stroke-width=".6"/>'},
 seeing:{w:40,h:40,tile:'<circle cx="20" cy="20" r="13" fill="none" stroke="currentColor" stroke-width=".9"/><ellipse cx="20" cy="20" rx="13" ry="4" fill="none" stroke="currentColor" stroke-width=".6"/><ellipse cx="20" cy="12" rx="10" ry="3" fill="none" stroke="currentColor" stroke-width=".5" stroke-dasharray="2 2"/>'},
 surface:{w:48,h:32,tile:'<ellipse cx="24" cy="16" rx="18" ry="9" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M15 15Q24 22 33 15M18 17Q24 12 30 17" fill="none" stroke="currentColor" stroke-width=".7"/>'},
 curvature:{w:40,h:36,tile:'<path d="M6 30Q20 24 34 30Q24 18 20 4Q16 18 6 30Z" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M4 34Q20 28 36 34" fill="none" stroke="currentColor" stroke-width=".5" stroke-dasharray="2 2"/>'},
 manifold:{w:40,h:40,tile:'<path d="M20 6C30 6 34 18 26 24C18 30 8 26 10 18C12 10 26 12 28 22C30 32 16 36 12 28" fill="none" stroke="currentColor" stroke-width=".9"/>'},
 surprise:{w:40,h:40,tile:'<rect x="6" y="6" width="28" height="28" fill="none" stroke="currentColor" stroke-width=".8"/><circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" stroke-width=".8"/><circle cx="6" cy="6" r="1.6" fill="currentColor"/><circle cx="34" cy="34" r="1.6" fill="currentColor"/>'},
 work:{w:44,h:36,tile:'<path d="M6 30L18 14L34 20" fill="none" stroke="currentColor" stroke-width=".9"/><circle cx="6" cy="30" r="2" fill="currentColor"/><circle cx="18" cy="14" r="2" fill="none" stroke="currentColor" stroke-width=".8"/><circle cx="34" cy="20" r="1.4" fill="currentColor" opacity=".6"/>'}
};
