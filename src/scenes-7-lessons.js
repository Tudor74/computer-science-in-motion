/* Dimensions era 7 · High-dimensional surprises: lessons, sources and connections. */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/DIMENSIONS-BRIEF.md).
// The lesson ids, their order and the stage id are fixed. Add SOURCE('d7-…',{title,url?}) and THREAD({id:'d7-…',name,ids}) entries here.
LESSON({id:'ball-volume',name:'The volume of the n-ball',short:'Ball volume',stage:'surprise',year:'1800s–today',level:'Introduction',
 why:'The volume of the unit ball rises until five dimensions and then falls towards zero, the first of many surprises that only the formula can be trusted to show.',
 prior:['n-distance'],references:[],
 ids:['ball-volume']});
LESSON({id:'near-surface',name:'Most volume is near the surface',short:'Near the skin',stage:'surprise',year:'1900s–today',level:'Introduction',
 why:'In high dimensions almost all of a ball’s volume lies in a thin shell under its surface, which changes what “typical” means for points in a ball.',
 prior:['ball-volume'],references:[],
 ids:['near-surface']});
LESSON({id:'nearly-perpendicular',name:'Random directions are nearly perpendicular',short:'Perpendicular',stage:'surprise',year:'1900s–today',level:'Core',
 why:'Two directions picked at random in many dimensions are almost always nearly at right angles, which matters for data, signals and search.',
 prior:['n-distance','near-surface'],references:[],
 ids:['nearly-perpendicular']});
LESSON({id:'sphere-packing',name:'Sphere packing and kissing numbers',short:'Packing',stage:'surprise',year:'1611–2016',level:'Core',
 why:'How tightly equal balls can be packed was settled in three dimensions only in 1998, and in dimensions 8 and 24 by Viazovska’s 2016 proof.',
 prior:['ball-volume'],references:[],
 ids:['sphere-packing']});
LESSON({id:'curse-dimensionality',name:'The curse of dimensionality',short:'The curse',stage:'surprise',year:'1957–today',level:'Core',
 why:'Filling a space with samples costs exponentially more as dimensions are added, a limit that shapes statistics, optimisation and machine learning.',
 prior:['near-surface','nearly-perpendicular'],references:[],
 ids:['curse-dimensionality']});
LESSON({id:'cube-corners',name:'Corners of the cube',short:'Corners',stage:'surprise',year:'1900s–today',level:'Core',
 why:'The ball inside a cube touches every face, yet in high dimensions the cube’s corners reach far beyond it, so cubes behave nothing like balls.',
 prior:['ball-volume','curse-dimensionality'],references:[],
 ids:['cube-corners']});
