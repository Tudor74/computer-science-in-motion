/* Dimensions era 3 · Seeing the fourth dimension: lessons, sources and connections. */
SOURCE('d3-abbott',{title:'Edwin A. Abbott (1884). Flatland: A Romance of Many Dimensions. Seeley & Co., London.',url:'https://en.wikipedia.org/wiki/Flatland'});
SOURCE('d3-stott',{title:'Alicia Boole Stott (1900). On certain series of sections of the regular four-dimensional hypersolids. Verhandelingen der Koninklijke Akademie van Wetenschappen te Amsterdam 7(3).',url:'https://en.wikipedia.org/wiki/Alicia_Boole_Stott'});
SOURCE('d3-polo',{title:'Irene Polo-Blanco (2007). Theory and History of Geometric Models. PhD thesis, University of Groningen.',note:'Includes Boole Stott’s models and her work with Schoute.'});
SOURCE('d3-coxeter',{title:'H. S. M. Coxeter (1948). Regular Polytopes. Methuen, London (Dover edition 1973).'});
SOURCE('d3-schlegel',{title:'Victor Schlegel (1883). Theorie der homogen zusammengesetzten Raumgebilde. Nova Acta Leopoldina 44.',url:'https://en.wikipedia.org/wiki/Schlegel_diagram'});
SOURCE('d3-stringham',{title:'W. I. Stringham (1880). Regular figures in n-dimensional space. American Journal of Mathematics 3, 1–14.'});
SOURCE('d3-banchoff',{title:'Thomas F. Banchoff (1990). Beyond the Third Dimension: Geometry, Computer Graphics, and Higher Dimensions. Scientific American Library.'});
SOURCE('d3-rot4',{title:'Rotations in 4-dimensional Euclidean space (Wikipedia): simple, double and isoclinic rotations, and quaternions.',url:'https://en.wikipedia.org/wiki/Rotations_in_4-dimensional_Euclidean_space'});
SOURCE('d3-hamilton',{title:'W. R. Hamilton (1844). On quaternions; or on a new system of imaginaries in algebra. Philosophical Magazine, 3rd series, 25.'});
SOURCE('d3-cayley',{title:'Arthur Cayley (1855). Sur quelques propriétés des déterminants gauches. Journal für die reine und angewandte Mathematik 50.'});
SOURCE('d3-clifford',{title:'W. K. Clifford (1873). Preliminary sketch of biquaternions. Proceedings of the London Mathematical Society 4.'});
SOURCE('d3-durer',{title:'Albrecht Dürer (1525). Underweysung der Messung mit dem Zirckel und Richtscheyt. Nuremberg.',url:'https://en.wikipedia.org/wiki/Net_(polyhedron)'});
SOURCE('d3-turney',{title:'Peter D. Turney (1984). Unfolding the tesseract. Journal of Recreational Mathematics 17(1), 1–16.'});
SOURCE('d3-dali',{title:'Salvador Dalí (1954). Crucifixion (Corpus Hypercubus). The Metropolitan Museum of Art, New York.',url:'https://en.wikipedia.org/wiki/Crucifixion_(Corpus_Hypercubus)'});
SOURCE('d3-kemp',{title:'Martin Kemp (1998). Dali’s dimensions. Nature 391, 27.'});
SOURCE('d3-cs-graph',{title:'Computer Science In Motion — graphs (vertices, edges and trees).',url:'https://computer-science-in-motion.puter.site/#graph',note:'Sister course: spanning trees are graphs with no cycles that reach every vertex.'});
SOURCE('d3-hinton1888',{title:'Charles Howard Hinton (1888). A New Era of Thought. Swan Sonnenschein, London.',url:'https://en.wikipedia.org/wiki/Charles_Howard_Hinton'});
SOURCE('d3-hinton1904',{title:'Charles Howard Hinton (1904). The Fourth Dimension. Swan Sonnenschein, London.'});
SOURCE('d3-henderson',{title:'Linda Dalrymple Henderson (1983). The Fourth Dimension and Non-Euclidean Geometry in Modern Art. Princeton University Press.'});
SOURCE('d3-needham',{title:'Tristan Needham (1997). Visual Complex Analysis. Oxford University Press.',note:'Stereographic projection and why it keeps circles.'});
SOURCE('d3-stereo',{title:'Stereographic projection (Wikipedia).',url:'https://en.wikipedia.org/wiki/Stereographic_projection'});
SOURCE('d3-hopf',{title:'Heinz Hopf (1931). Über die Abbildungen der dreidimensionalen Sphäre auf die Kugelfläche. Mathematische Annalen 104, 637–665.',url:'https://en.wikipedia.org/wiki/Hopf_fibration'});
SOURCE('d3-lyons',{title:'David W. Lyons (2003). An elementary introduction to the Hopf fibration. Mathematics Magazine 76, 87–98.'});
SOURCE('d3-maths',{title:'Mathematics In Motion — background on coordinates, vectors and trigonometry.',url:'https://mathematics-in-motion.puter.site/'});

LESSON({id:'slicing',name:'Slicing a tesseract',short:'Slicing',stage:'seeing',year:'1884–1900',level:'Introduction',
 why:'A four-dimensional object passing through our space shows itself as a sequence of three-dimensional slices, just as the Sphere showed itself to the Square.',
 prior:['flatland','building-cubes'],references:['d3-abbott','d3-stott','d3-polo','d3-coxeter'],
 ids:['slicing','slicing-cube','slicing-vertex','slicing-stott']});
LESSON({id:'schlegel-diagrams',name:'Projections and Schlegel diagrams',short:'Schlegel',stage:'seeing',year:'1880–1886',level:'Introduction',
 why:'Projecting from just outside one cell puts a whole four-dimensional polytope inside that cell without overlaps, the standard picture of the tesseract.',
 prior:['shadows-projection','slicing'],references:['d3-schlegel','d3-stringham','d3-coxeter','d3-banchoff'],
 ids:['schlegel-diagrams','schlegel-diagrams-cube','schlegel-diagrams-cells']});
LESSON({id:'rotation-4d',name:'Rotation in four dimensions',short:'4D rotation',stage:'seeing',year:'1843–1873',level:'Core',
 why:'In four dimensions a rotation turns a plane rather than spinning about an axis, and two planes can turn at once.',
 prior:['schlegel-diagrams'],references:['d3-rot4','d3-hamilton','d3-cayley','d3-clifford','d3-banchoff','d3-maths'],
 ids:['rotation-4d','rotation-4d-xw','rotation-4d-double']});
LESSON({id:'unfolding-nets',name:'Unfolding nets',short:'Nets',stage:'seeing',year:'1525–1984',level:'Core',
 why:'A cube unfolds into squares in the plane, and a tesseract unfolds into cubes in space, the cross Dalí painted in 1954.',
 prior:['building-cubes','slicing'],references:['d3-durer','d3-turney','d3-dali','d3-kemp','d3-cs-graph'],
 ids:['unfolding-nets','unfolding-nets-count','unfolding-nets-tesseract']});
LESSON({id:'hinton-cubes',name:'Hinton’s cubes',short:'Hinton',stage:'seeing',year:'1888–1904',level:'Core',
 why:'Hinton taught the fourth dimension with coloured cubes, an early and practical method for holding a four-dimensional shape in mind.',
 prior:['slicing','unfolding-nets'],references:['d3-hinton1888','d3-hinton1904','d3-henderson'],
 ids:['hinton-cubes','hinton-cubes-slices','hinton-cubes-walk']});
LESSON({id:'stereographic',name:'Stereographic projection',short:'Stereographic',stage:'seeing',year:'2nd century–1931',level:'Core',
 why:'Projecting from a sphere onto flat space keeps circles as circles, which lets us draw the 3-sphere and the Hopf fibration in ordinary space.',
 prior:['schlegel-diagrams','rotation-4d'],references:['d3-stereo','d3-needham','d3-clifford','d3-hopf','d3-lyons','d3-banchoff'],
 ids:['stereographic','stereographic-s3','stereographic-hopf']});

THREAD({id:'d3-slices',name:'Slices: one dimension down',ids:['flatland','slicing-cube','slicing','slicing-vertex','slicing-stott','special-polytopes']});
THREAD({id:'d3-projections',name:'Pictures of four dimensions',ids:['shadows-projection','schlegel-diagrams','rotation-4d-xw','unfolding-nets-tesseract','stereographic-s3']});
THREAD({id:'d3-euler',name:'Euler’s count on a picture',ids:['euler-formula','schlegel-diagrams-cube','slicing','euler-genus']});
THREAD({id:'d3-parts',name:'Naming the parts of a cube',ids:['counting-parts','hinton-cubes','hinton-cubes-slices']});
THREAD({id:'d3-glue',name:'Cut open, glue shut',ids:['unfolding-nets','unfolding-nets-count','gluing-diagrams']});
THREAD({id:'d3-three-sphere',name:'The 3-sphere',ids:['stereographic-s3','stereographic-hopf','three-manifolds','poincare-conjecture']});
