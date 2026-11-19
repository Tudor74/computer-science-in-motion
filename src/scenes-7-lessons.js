/* Dimensions era 7 · High-dimensional surprises: lessons, sources and connections. */
SOURCE('d7-ball',{title:'Keith Ball (1997). An elementary introduction to modern convex geometry. In Flavors of Geometry, MSRI Publications 31, 1–58. Cambridge University Press.'});
SOURCE('d7-hayes',{title:'Brian Hayes (2011). An adventure in the Nth dimension. American Scientist 99.'});
SOURCE('d7-nball',{title:'Volume of an n-ball (Wikipedia).',url:'https://en.wikipedia.org/wiki/Volume_of_an_n-ball'});
SOURCE('d7-bhk',{title:'Avrim Blum, John Hopcroft & Ravindran Kannan (2020). Foundations of Data Science. Cambridge University Press, chapter 2, High-dimensional space.'});
SOURCE('d7-levy',{title:'Paul Lévy (1922). Leçons d’analyse fonctionnelle. Gauthier-Villars, Paris.'});
SOURCE('d7-milman',{title:'Vitali Milman (1971). A new proof of A. Dvoretzky’s theorem on cross-sections of convex bodies. Functional Analysis and Its Applications 5, 288–295.'});
SOURCE('d7-ledoux',{title:'Michel Ledoux (2001). The Concentration of Measure Phenomenon. American Mathematical Society.'});
SOURCE('d7-concentration',{title:'Concentration of measure (Wikipedia).',url:'https://en.wikipedia.org/wiki/Concentration_of_measure'});
SOURCE('d7-jl',{title:'William B. Johnson & Joram Lindenstrauss (1984). Extensions of Lipschitz mappings into a Hilbert space. Contemporary Mathematics 26, 189–206.'});
SOURCE('d7-dasgupta',{title:'Sanjoy Dasgupta & Anupam Gupta (2003). An elementary proof of a theorem of Johnson and Lindenstrauss. Random Structures & Algorithms 22, 60–65.'});
SOURCE('d7-kepler',{title:'Johannes Kepler (1611). Strena seu de nive sexangula (The six-cornered snowflake).'});
SOURCE('d7-hales',{title:'Thomas C. Hales (2005). A proof of the Kepler conjecture. Annals of Mathematics 162, 1065–1185.',url:'https://doi.org/10.4007/annals.2005.162.1065'});
SOURCE('d7-flyspeck',{title:'Thomas Hales et al. (2017). A formal proof of the Kepler conjecture. Forum of Mathematics, Pi 5, e2.',url:'https://doi.org/10.1017/fmp.2017.1'});
SOURCE('d7-schutte',{title:'Kurt Schütte & B. L. van der Waerden (1953). Das Problem der dreizehn Kugeln. Mathematische Annalen 125, 325–334.'});
SOURCE('d7-musin',{title:'Oleg R. Musin (2008). The kissing number in four dimensions. Annals of Mathematics 168, 1–32.',url:'https://doi.org/10.4007/annals.2008.168.1'});
SOURCE('d7-odlyzko',{title:'Andrew Odlyzko & Neil Sloane (1979). New bounds on the number of unit spheres that can touch a unit sphere in n dimensions. Journal of Combinatorial Theory A 26, 210–214.'});
SOURCE('d7-viazovska',{title:'Maryna Viazovska (2017). The sphere packing problem in dimension 8. Annals of Mathematics 185, 991–1015.',url:'https://doi.org/10.4007/annals.2017.185.3.7'});
SOURCE('d7-ckmrv',{title:'Henry Cohn, Abhinav Kumar, Stephen D. Miller, Danylo Radchenko & Maryna Viazovska (2017). The sphere packing problem in dimension 24. Annals of Mathematics 185, 1017–1033.',url:'https://doi.org/10.4007/annals.2017.185.3.8'});
SOURCE('d7-cohn-elkies',{title:'Henry Cohn & Noam Elkies (2003). New upper bounds on sphere packings I. Annals of Mathematics 157, 689–714.',url:'https://doi.org/10.4007/annals.2003.157.689'});
SOURCE('d7-splag',{title:'John H. Conway & Neil J. A. Sloane (1988). Sphere Packings, Lattices and Groups. Springer.'});
SOURCE('d7-kissing',{title:'Kissing number (Wikipedia).',url:'https://en.wikipedia.org/wiki/Kissing_number'});
SOURCE('d7-bellman',{title:'Richard Bellman (1957). Dynamic Programming. Princeton University Press.'});
SOURCE('d7-beyer',{title:'Kevin Beyer, Jonathan Goldstein, Raghu Ramakrishnan & Uri Shaft (1999). When is “nearest neighbor” meaningful? Database Theory — ICDT’99, Lecture Notes in Computer Science 1540, 217–235.'});
SOURCE('d7-grassberger',{title:'Peter Grassberger & Itamar Procaccia (1983). Measuring the strangeness of strange attractors. Physica D 9, 189–208.'});
SOURCE('d7-isomap',{title:'Joshua Tenenbaum, Vin de Silva & John Langford (2000). A global geometric framework for nonlinear dimensionality reduction. Science 290, 2319–2323.'});
SOURCE('d7-curse',{title:'Curse of dimensionality (Wikipedia).',url:'https://en.wikipedia.org/wiki/Curse_of_dimensionality'});
SOURCE('d7-hamming',{title:'Richard Hamming (1997). The Art of Doing Science and Engineering: Learning to Learn. Gordon and Breach.'});
SOURCE('d7-maths',{title:'Mathematics In Motion: background on powers, roots and integrals.',url:'https://mathematics-in-motion.puter.site/'});

LESSON({id:'ball-volume',name:'The volume of the n-ball',short:'Ball volume',stage:'surprise',year:'1800s–today',level:'Introduction',
 why:'The volume of the unit ball rises until five dimensions and then falls towards zero, the first of many surprises that only the formula can be trusted to show.',
 prior:['n-distance'],references:['d7-ball','d7-hayes','d7-nball','d7-maths'],
 ids:['ball-volume','ball-volume-why','ball-volume-radius']});
LESSON({id:'near-surface',name:'Most volume is near the surface',short:'Near the skin',stage:'surprise',year:'1900s–today',level:'Introduction',
 why:'In high dimensions almost all of a ball’s volume lies in a thin shell under its surface, which changes what “typical” means for points in a ball.',
 prior:['ball-volume'],references:['d7-ball','d7-bhk','d7-levy','d7-milman','d7-ledoux','d7-concentration'],
 ids:['near-surface','near-surface-sampling','near-surface-equator']});
LESSON({id:'nearly-perpendicular',name:'Random directions are nearly perpendicular',short:'Perpendicular',stage:'surprise',year:'1900s–today',level:'Core',
 why:'Two directions picked at random in many dimensions are almost always nearly at right angles, which matters for data, signals and search.',
 prior:['n-distance','near-surface'],references:['d7-bhk','d7-jl','d7-dasgupta','d7-ball'],
 ids:['nearly-perpendicular','nearly-perpendicular-why','nearly-perpendicular-many','nearly-perpendicular-projection']});
LESSON({id:'sphere-packing',name:'Sphere packing and kissing numbers',short:'Packing',stage:'surprise',year:'1611–2016',level:'Core',
 why:'How tightly equal balls can be packed was settled in three dimensions only in 1998, and in dimensions 8 and 24 by Viazovska’s 2016 proof.',
 prior:['ball-volume'],references:['d7-kepler','d7-hales','d7-flyspeck','d7-schutte','d7-musin','d7-odlyzko','d7-viazovska','d7-ckmrv','d7-cohn-elkies','d7-splag','d7-kissing'],
 ids:['sphere-packing','sphere-packing-kissing','sphere-packing-e8']});
LESSON({id:'curse-dimensionality',name:'The curse of dimensionality',short:'The curse',stage:'surprise',year:'1957–today',level:'Core',
 why:'Filling a space with samples costs exponentially more as dimensions are added, a limit that shapes statistics, optimisation and machine learning.',
 prior:['near-surface','nearly-perpendicular'],references:['d7-bellman','d7-beyer','d7-grassberger','d7-isomap','d7-curse','d7-bhk'],
 ids:['curse-dimensionality','curse-dimensionality-neighbours','curse-dimensionality-lowdim']});
LESSON({id:'cube-corners',name:'Corners of the cube',short:'Corners',stage:'surprise',year:'1900s–today',level:'Core',
 why:'The ball inside a cube touches every face, yet in high dimensions the cube’s corners reach far beyond it, so cubes behave nothing like balls.',
 prior:['ball-volume','curse-dimensionality'],references:['d7-ball','d7-hamming','d7-bhk'],
 ids:['cube-corners','cube-corners-puzzle','cube-corners-volume']});

// Connections across eras. Names shared with another era's THREAD merge into one connection.
THREAD({id:'d7-high-cube',name:'The cube in many dimensions',ids:['n-distance','cube-corners','cube-corners-puzzle','cube-corners-volume','curse-dimensionality']});
THREAD({id:'d7-slices',name:'Slicing through a dimension',ids:['flatland','ball-volume-why','near-surface-equator']});
THREAD({id:'d7-concentration',name:'Concentration in high dimensions',ids:['near-surface','near-surface-sampling','near-surface-equator','nearly-perpendicular','curse-dimensionality-neighbours','cube-corners-volume']});
THREAD({id:'d7-data',name:'Data in many dimensions',ids:['nearly-perpendicular-projection','curse-dimensionality-lowdim','data-dimensions','persistent-homology']});
THREAD({id:'d7-lattices',name:'Lattices and the 24-cell',ids:['special-polytopes','sphere-packing-kissing','sphere-packing-e8']});
THREAD({id:'d7-dimension',name:'What counts as a dimension',ids:['curse-dimensionality-lowdim','fractal-dimension']});
