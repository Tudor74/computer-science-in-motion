/* Dimensions era 2 · Hypercubes and polytopes: lessons, sources and connections. */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/DIMENSIONS-BRIEF.md).
// The lesson ids, their order and the stage id are fixed. Add SOURCE('d2-…',{title,url?}) and THREAD({id:'d2-…',name,ids}) entries here.
LESSON({id:'building-cubes',name:'Building the n-cube',short:'n-cube',stage:'polytope',year:'1888–today',level:'Introduction',
 why:'Drag a point to make a segment, a segment to make a square, a square to make a cube, and the same move once more makes a tesseract.',
 prior:['coordinates'],references:[],
 ids:['building-cubes']});
LESSON({id:'counting-parts',name:'Counting the parts',short:'Counting',stage:'polytope',year:'1852–today',level:'Introduction',
 why:'Every part of the n-cube is counted by one formula, 2^(n−k)·C(n,k), which the learner can check against the cube as it is built.',
 prior:['building-cubes'],references:[],
 ids:['counting-parts']});
LESSON({id:'simplex-cross',name:'Simplices and cross-polytopes',short:'Simplices',stage:'polytope',year:'1852–today',level:'Core',
 why:'The cube has two companions in every dimension, the simplex and the cross-polytope, and the three together are the only regular shapes that exist in all dimensions.',
 prior:['counting-parts'],references:[],
 ids:['simplex-cross']});
LESSON({id:'regular-polytopes',name:'The regular polytopes',short:'Regular',stage:'polytope',year:'1852–1901',level:'Core',
 why:'Schläfli found that four dimensions have six regular polytopes and every dimension from five up has only three, a count that follows from angles fitting round an edge.',
 prior:['simplex-cross'],references:[],
 ids:['regular-polytopes']});
LESSON({id:'special-polytopes',name:'The 24-cell, 120-cell and 600-cell',short:'24, 120, 600',stage:'polytope',year:'1852–1900',level:'Core',
 why:'Three of the six regular four-dimensional polytopes have no counterpart in other dimensions or are giants built from hundreds of cells, and their counts can be checked exactly.',
 prior:['regular-polytopes'],references:[],
 ids:['special-polytopes']});
LESSON({id:'euler-formula',name:'Euler’s formula',short:'Euler',stage:'polytope',year:'1750–1893',level:'Core',
 why:'V − E + F = 2 for every convex polyhedron, and the alternating count of parts gives a fixed answer in every dimension.',
 prior:['counting-parts','regular-polytopes'],references:[],
 ids:['euler-formula']});
