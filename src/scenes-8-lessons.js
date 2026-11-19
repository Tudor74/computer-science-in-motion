/* Dimensions era 8 · Dimensions at work: lessons, sources and connections. */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/DIMENSIONS-BRIEF.md).
// The lesson ids, their order and the stage id are fixed. Add SOURCE('d8-…',{title,url?}) and THREAD({id:'d8-…',name,ids}) entries here.
LESSON({id:'configuration-space',name:'Configuration space',short:'Configurations',stage:'work',year:'1788–today',level:'Introduction',
 why:'Listing every position of a machine at once makes a space, and its shape decides which motions are possible, which is how robots plan.',
 prior:['degrees-of-freedom','gluing-diagrams'],references:[],
 ids:['configuration-space']});
LESSON({id:'phase-space',name:'Phase space',short:'Phase space',stage:'work',year:'1838–1902',level:'Introduction',
 why:'Putting every position and momentum of a system into one point turns its whole future into a single path through a many-dimensional space.',
 prior:['configuration-space'],references:[],
 ids:['phase-space']});
LESSON({id:'data-dimensions',name:'Data in many dimensions',short:'Data',stage:'work',year:'1901–today',level:'Core',
 why:'Every row of a table of measurements is a point in a space with one dimension per column, and finding the few directions that matter is principal component analysis.',
 prior:['n-distance','nearly-perpendicular'],references:[],
 ids:['data-dimensions']});
LESSON({id:'fractal-dimension',name:'Fractal dimension',short:'Fractals',stage:'work',year:'1918–1982',level:'Core',
 why:'A coastline’s measured length grows as the ruler shrinks, and the rate of growth is a dimension that need not be a whole number.',
 prior:['what-is-dimension'],references:[],
 ids:['fractal-dimension']});
LESSON({id:'persistent-homology',name:'Topological data analysis',short:'Shape of data',stage:'work',year:'2002–today',level:'Core',
 why:'Persistent homology counts the loops and holes in a cloud of points across every scale, and keeps the features that last.',
 prior:['data-dimensions','euler-genus'],references:[],
 ids:['persistent-homology']});
LESSON({id:'extra-dimensions',name:'Extra dimensions in physics',short:'Extra dims',stage:'work',year:'1919–today',level:'Core',
 why:'Kaluza and Klein found electromagnetism hidden in a fifth dimension, an idea string theory revived and experiments have not confirmed.',
 prior:['spacetime','dimension-four'],references:[],
 ids:['extra-dimensions']});
