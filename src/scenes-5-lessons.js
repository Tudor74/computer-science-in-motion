/* Dimensions era 5 · Curvature: lessons, sources and connections. */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/DIMENSIONS-BRIEF.md).
// The lesson ids, their order and the stage id are fixed. Add SOURCE('d5-…',{title,url?}) and THREAD({id:'d5-…',name,ids}) entries here.
LESSON({id:'theorema-egregium',name:'Gauss’s remarkable theorem',short:'Egregium',stage:'curvature',year:'1827',level:'Introduction',
 why:'Gauss proved that a surface’s curvature can be measured without leaving it, which separates the geometry inside a space from the space around it.',
 prior:['manifold-idea'],references:[],
 ids:['theorema-egregium']});
LESSON({id:'non-euclidean',name:'Non-Euclidean geometry',short:'Non-Euclidean',stage:'curvature',year:'1829–1868',level:'Introduction',
 why:'Bolyai and Lobachevsky showed that Euclid’s parallel postulate can fail without contradiction, and Beltrami gave their geometry a model.',
 prior:['theorema-egregium'],references:[],
 ids:['non-euclidean']});
LESSON({id:'geodesics',name:'Geodesics',short:'Geodesics',stage:'curvature',year:'1697–today',level:'Core',
 why:'The straightest paths on a curved surface are the geodesics, and they replace straight lines in every curved geometry that follows.',
 prior:['theorema-egregium'],references:[],
 ids:['geodesics']});
LESSON({id:'riemann-lecture',name:'Riemann’s 1854 lecture',short:'Riemann',stage:'curvature',year:'1854–1868',level:'Core',
 why:'Riemann described spaces of any dimension whose curvature varies from place to place, the language that general relativity would later use.',
 prior:['non-euclidean','geodesics'],references:[],
 ids:['riemann-lecture']});
LESSON({id:'spacetime',name:'Minkowski spacetime',short:'Spacetime',stage:'curvature',year:'1905–1915',level:'Core',
 why:'Minkowski showed that special relativity is the geometry of a four-dimensional spacetime, and Einstein then made that spacetime curved.',
 prior:['riemann-lecture','n-distance'],references:[],
 ids:['spacetime']});
LESSON({id:'curvature-inside',name:'Curvature from inside',short:'From inside',stage:'curvature',year:'1827–today',level:'Core',
 why:'Angle sums and an arrow carried round a loop let inhabitants of a space detect its curvature, the method used to ask whether our universe is flat.',
 prior:['geodesics','riemann-lecture'],references:[],
 ids:['curvature-inside']});
