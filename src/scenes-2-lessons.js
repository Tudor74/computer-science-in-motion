/* Dimensions era 2 · Hypercubes and polytopes: lessons, sources and connections. */
SOURCE('d2-hinton',{title:'Charles Howard Hinton (1888). A New Era of Thought. Swan Sonnenschein, London (introduces the word “tesseract”).'});
SOURCE('d2-hinton-1904',{title:'Charles Howard Hinton (1904). The Fourth Dimension. Swan Sonnenschein, London.'});
SOURCE('d2-stringham',{title:'W. Irving Stringham (1880). Regular figures in n-dimensional space. American Journal of Mathematics 3, 1–14.'});
SOURCE('d2-coxeter',{title:'H. S. M. Coxeter (1948). Regular Polytopes. Methuen, London; 3rd edition, Dover, 1973.'});
SOURCE('d2-schlafli',{title:'Ludwig Schläfli (written 1850–52, published 1901). Theorie der vielfachen Kontinuität. Published after his death by the Swiss Society of Natural Sciences.'});
SOURCE('d2-boole-stott',{title:'Alicia Boole Stott (1900). On certain series of sections of the regular four-dimensional hypersolids. Verhandelingen der Koninklijke Akademie van Wetenschappen te Amsterdam.'});
SOURCE('d2-grunbaum',{title:'Branko Grünbaum (1967). Convex Polytopes. Wiley; 2nd edition, Springer, 2003.'});
SOURCE('d2-gray',{title:'Frank Gray (1953). Pulse code communication. US Patent 2,632,058.'});
SOURCE('d2-euclid',{title:'Euclid (about 300 BCE). Elements, Book XIII: the five regular solids, and why there are no others.',url:'https://en.wikipedia.org/wiki/Euclid%27s_Elements'});
SOURCE('d2-euler',{title:'Leonhard Euler (1758). Elementa doctrinae solidorum; Demonstratio nonnullarum insignium proprietatum, quibus solida hedris planis inclusa sunt praedita. Novi Commentarii Academiae Scientiarum Petropolitanae 4 (for 1752–53).'});
SOURCE('d2-legendre',{title:'Adrien-Marie Legendre (1794). Éléments de géométrie: a proof of Euler’s formula by areas of spherical polygons.'});
SOURCE('d2-poincare',{title:'Henri Poincaré (1893). Sur la généralisation d’un théorème d’Euler relatif aux polyèdres. Comptes rendus de l’Académie des sciences 117; and (1895) Analysis situs, Journal de l’École polytechnique.'});
SOURCE('d2-bruggesser',{title:'H. Bruggesser & P. Mani (1971). Shellable decompositions of cells and spheres. Mathematica Scandinavica 29, 197–205.'});
SOURCE('d2-lakatos',{title:'Imre Lakatos (1976). Proofs and Refutations: The Logic of Mathematical Discovery. Cambridge University Press.'});
SOURCE('d2-richeson',{title:'David S. Richeson (2008). Euler’s Gem: The Polyhedron Formula and the Birth of Topology. Princeton University Press.'});
SOURCE('d2-regular4',{title:'Regular 4-polytope (Wikipedia): the six convex regular polytopes in four dimensions, with coordinates.',url:'https://en.wikipedia.org/wiki/Regular_4-polytope'});
SOURCE('d2-cs-graph',{title:'Computer Science In Motion: graphs, vertices and edges.',url:'https://computer-science-in-motion.puter.site/#graph'});
SOURCE('d2-maths',{title:'Mathematics In Motion: the general mathematics course, for binomial coefficients and angles.',url:'https://mathematics-in-motion.puter.site/'});

LESSON({id:'building-cubes',name:'Building the n-cube',short:'n-cube',stage:'polytope',year:'1888–today',level:'Introduction',
 why:'Drag a point to make a segment, a segment to make a square, a square to make a cube, and the same move once more makes a tesseract.',
 prior:['coordinates'],references:['d2-hinton','d2-stringham','d2-coxeter','d2-gray','d2-hinton-1904'],
 ids:['building-cubes','building-cubes-strings','building-cubes-projection']});
LESSON({id:'counting-parts',name:'Counting the parts',short:'Counting',stage:'polytope',year:'1852–today',level:'Introduction',
 why:'Every part of the n-cube is counted by one formula, 2^(n−k)·C(n,k), which the learner can check against the cube as it is built.',
 prior:['building-cubes'],references:['d2-coxeter','d2-schlafli','d2-grunbaum','d2-maths'],
 ids:['counting-parts','counting-parts-table','counting-parts-recursion']});
LESSON({id:'simplex-cross',name:'Simplices and cross-polytopes',short:'Simplices',stage:'polytope',year:'1852–today',level:'Core',
 why:'The cube has two companions in every dimension, the simplex and the cross-polytope, and the three together are the only regular shapes that exist in all dimensions.',
 prior:['counting-parts'],references:['d2-coxeter','d2-schlafli','d2-cs-graph'],
 ids:['simplex-cross','simplex-cross-cross','simplex-cross-dual']});
LESSON({id:'regular-polytopes',name:'The regular polytopes',short:'Regular',stage:'polytope',year:'1852–1901',level:'Core',
 why:'Schläfli found that four dimensions have six regular polytopes and every dimension from five up has only three, a count that follows from angles fitting round an edge.',
 prior:['simplex-cross'],references:['d2-schlafli','d2-euclid','d2-boole-stott','d2-coxeter','d2-regular4'],
 ids:['regular-polytopes','regular-polytopes-schlafli','regular-polytopes-higher','regular-polytopes-sections']});
LESSON({id:'special-polytopes',name:'The 24-cell, 120-cell and 600-cell',short:'24, 120, 600',stage:'polytope',year:'1852–1900',level:'Core',
 why:'Three of the six regular four-dimensional polytopes have no counterpart in other dimensions or are giants built from hundreds of cells, and their counts can be checked exactly.',
 prior:['regular-polytopes'],references:['d2-schlafli','d2-coxeter','d2-regular4','d2-boole-stott'],
 ids:['special-polytopes','special-polytopes-600','special-polytopes-120']});
LESSON({id:'euler-formula',name:'Euler’s formula',short:'Euler',stage:'polytope',year:'1750–1893',level:'Core',
 why:'V − E + F = 2 for every convex polyhedron, and the alternating count of parts gives a fixed answer in every dimension.',
 prior:['counting-parts','regular-polytopes'],references:['d2-euler','d2-legendre','d2-poincare','d2-schlafli','d2-bruggesser','d2-lakatos','d2-richeson'],
 ids:['euler-formula','euler-formula-frame','euler-formula-4d','euler-formula-n']});

THREAD({id:'d2-tesseract',name:'The tesseract',ids:['building-cubes','building-cubes-projection','counting-parts','slicing','schlegel-diagrams','rotation-4d','unfolding-nets','hinton-cubes']});
THREAD({id:'d2-shadows',name:'Shadows and projections',ids:['shadows-projection','building-cubes-projection','schlegel-diagrams','stereographic']});
THREAD({id:'d2-high-cube',name:'The cube in many dimensions',ids:['n-distance','building-cubes-strings','counting-parts-table','cube-corners','curse-dimensionality']});
THREAD({id:'d2-duality',name:'Duality: corners for cells',ids:['simplex-cross-dual','special-polytopes','special-polytopes-120','euler-formula-4d']});
THREAD({id:'d2-sections',name:'Alicia Boole Stott’s sections',ids:['regular-polytopes-sections','slicing','flatland']});
THREAD({id:'d2-euler',name:'Euler’s count V − E + F',ids:['euler-formula','euler-formula-frame','euler-genus','surface-classification','curvature-inside','persistent-homology']});
THREAD({id:'d2-quaternions',name:'Quaternions and 4D symmetry',ids:['special-polytopes-600','rotation-4d']});
