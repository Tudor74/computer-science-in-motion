/* Dimensions era 1 · Counting dimensions: lessons, sources and connections. */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/DIMENSIONS-BRIEF.md).
// The lesson ids, their order and the stage id are fixed. Add SOURCE('d1-…',{title,url?}) and THREAD({id:'d1-…',name,ids}) entries here.
LESSON({id:'coordinates',name:'Coordinates',short:'Coordinates',stage:'count',year:'1637–1700',level:'Introduction',
 why:'Descartes and Fermat turned points into lists of numbers, so the number of coordinates a point needs became a way to count dimensions.',
 prior:[],references:[],
 ids:['coordinates']});
LESSON({id:'degrees-of-freedom',name:'Degrees of freedom',short:'Freedom',stage:'count',year:'1788–today',level:'Introduction',
 why:'Counting the independent ways a thing can move gives a dimension even when the thing is not a shape, which is how most high-dimensional spaces arise.',
 prior:['coordinates'],references:[],
 ids:['degrees-of-freedom']});
LESSON({id:'flatland',name:'Flatland',short:'Flatland',stage:'count',year:'1884',level:'Core',
 why:'Abbott’s story of a Square visited by a Sphere taught generations to reason about a fourth dimension by analogy with the third.',
 prior:['coordinates'],references:[],
 ids:['flatland']});
LESSON({id:'shadows-projection',name:'Shadows and projection',short:'Shadows',stage:'count',year:'1880–today',level:'Core',
 why:'A shadow drops one dimension, so learning to read a cube from its shadows is practice for reading a four-dimensional shape from its three-dimensional ones.',
 prior:['flatland'],references:[],
 ids:['shadows-projection']});
LESSON({id:'n-distance',name:'Distance in n dimensions',short:'Distance',stage:'count',year:'1843–today',level:'Core',
 why:'Pythagoras’ theorem extends one coordinate at a time, so distance and angle work the same way in any number of dimensions.',
 prior:['coordinates'],references:[],
 ids:['n-distance']});
LESSON({id:'what-is-dimension',name:'What is a dimension?',short:'Dimension',stage:'count',year:'1877–1913',level:'Core',
 why:'Cantor showed a line and a square have the same number of points, so dimension needed a careful definition, and Brouwer proved that it survives continuous change.',
 prior:['degrees-of-freedom','n-distance'],references:[],
 ids:['what-is-dimension']});
