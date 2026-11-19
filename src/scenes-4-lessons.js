/* Dimensions era 4 · Surfaces: lessons, sources and connections. */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/DIMENSIONS-BRIEF.md).
// The lesson ids, their order and the stage id are fixed. Add SOURCE('d4-…',{title,url?}) and THREAD({id:'d4-…',name,ids}) entries here.
LESSON({id:'manifold-idea',name:'The idea of a manifold',short:'Manifolds',stage:'surface',year:'1854–1936',level:'Introduction',
 why:'A manifold looks like ordinary flat space close up while possibly being curved or connected strangely overall, the idea behind everything in the rest of the course.',
 prior:['what-is-dimension'],references:[],
 ids:['manifold-idea']});
LESSON({id:'gluing-diagrams',name:'Gluing diagrams',short:'Gluing',stage:'surface',year:'1882–today',level:'Introduction',
 why:'Gluing the edges of a square, following arrows, builds cylinders, tori and stranger surfaces, and video games use the same trick.',
 prior:['manifold-idea'],references:[],
 ids:['gluing-diagrams']});
LESSON({id:'orientability',name:'The Möbius strip and orientability',short:'Möbius',stage:'surface',year:'1858–1865',level:'Core',
 why:'A strip with a half-twist has one side, and the idea of a surface that turns a traveller into their mirror image is what orientability measures.',
 prior:['gluing-diagrams'],references:[],
 ids:['orientability']});
LESSON({id:'klein-projective',name:'The Klein bottle and projective plane',short:'Klein bottle',stage:'surface',year:'1882–1901',level:'Core',
 why:'Two closed surfaces cannot be built in ordinary space without passing through themselves, but fit in four dimensions, a first sign of why the extra room matters.',
 prior:['orientability'],references:[],
 ids:['klein-projective']});
LESSON({id:'euler-genus',name:'Euler characteristic and genus',short:'Genus',stage:'surface',year:'1813–today',level:'Core',
 why:'V − E + F does not depend on how a surface is cut into faces, so it measures the surface itself: 2 for a sphere, 0 for a torus.',
 prior:['gluing-diagrams','euler-formula'],references:[],
 ids:['euler-genus']});
LESSON({id:'surface-classification',name:'Classifying surfaces',short:'Classification',stage:'surface',year:'1863–1921',level:'Core',
 why:'Every closed surface is one of two simple families, decided by two pieces of information, a rare complete classification in topology.',
 prior:['klein-projective','euler-genus'],references:[],
 ids:['surface-classification']});
