/* Dimensions era 1 · Counting dimensions: lessons, sources and connections. */
SOURCE('d1-descartes',{title:'René Descartes (1637). La Géométrie, an appendix to the Discours de la méthode. Leiden.',url:'https://en.wikipedia.org/wiki/La_G%C3%A9om%C3%A9trie'});
SOURCE('d1-fermat',{title:'Pierre de Fermat. Ad locos planos et solidos isagoge (circulated in the 1630s; printed 1679 in Varia opera mathematica).'});
SOURCE('d1-clairaut',{title:'Alexis Clairaut (1731). Recherches sur les courbes à double courbure. Paris.'});
SOURCE('d1-euler-intro',{title:'Leonhard Euler (1748). Introductio in analysin infinitorum, vol. 2 (appendix on surfaces).'});
SOURCE('d1-cayley',{title:'Arthur Cayley (1843). Chapters in the analytical geometry of (n) dimensions. Cambridge Mathematical Journal 4.'});
SOURCE('d1-grassmann',{title:'Hermann Grassmann (1844). Die lineale Ausdehnungslehre, ein neuer Zweig der Mathematik. Leipzig: Wigand.'});
SOURCE('d1-inselberg',{title:'Alfred Inselberg (1985). The plane with parallel coordinates. The Visual Computer 1, 69–91.'});
SOURCE('d1-maths',{title:'Mathematics In Motion: background on coordinates, algebra and trigonometry.',url:'https://mathematics-in-motion.puter.site/',note:'Sister course.'});
SOURCE('d1-lagrange',{title:'Joseph-Louis Lagrange (1788). Mécanique analytique. Paris: Desaint.'});
SOURCE('d1-euler-rigid',{title:'Leonhard Euler (1765). Theoria motus corporum solidorum seu rigidorum.'});
SOURCE('d1-grubler',{title:'Martin Grübler (1883) and Karl Kutzbach (1929): the mobility count for mechanisms used in engineering.'});
SOURCE('d1-wilson',{title:'E. Bright Wilson, J. C. Decius & Paul C. Cross (1955). Molecular Vibrations. McGraw-Hill.'});
SOURCE('d1-abbott',{title:'Edwin A. Abbott (1884). Flatland: A Romance of Many Dimensions, by A Square. London: Seeley & Co.',url:'https://en.wikipedia.org/wiki/Flatland'});
SOURCE('d1-stewart',{title:'Ian Stewart (2002). The Annotated Flatland. Perseus.',note:'Abbott’s text with notes on its mathematics and its satire.'});
SOURCE('d1-hinton',{title:'Charles Howard Hinton (1880). What is the fourth dimension? Dublin University Magazine; reprinted in Scientific Romances (1884).'});
SOURCE('d1-zollner',{title:'Johann Zöllner (1880). Transcendental Physics, translated by C. C. Massey (from Wissenschaftliche Abhandlungen, 1878).',note:'His account of the Slade séances; the claims are discredited.'});
SOURCE('d1-cavalieri',{title:'Bonaventura Cavalieri (1635). Geometria indivisibilibus continuorum nova quadam ratione promota.'});
SOURCE('d1-durer',{title:'Albrecht Dürer (1525). Underweysung der Messung.'});
SOURCE('d1-taylor',{title:'Brook Taylor (1715). Linear Perspective. London.'});
SOURCE('d1-stringham',{title:'W. Irving Stringham (1880). Regular figures in n-dimensional space. American Journal of Mathematics 3, 1–14.'});
SOURCE('d1-coxeter',{title:'H. S. M. Coxeter (1948). Regular Polytopes. Methuen.'});
SOURCE('d1-euclid',{title:'Euclid, Elements, Book I, Proposition 47 (Pythagoras’ theorem).'});
SOURCE('d1-cauchy',{title:'Augustin-Louis Cauchy (1821). Cours d’analyse de l’École royale polytechnique, Note II.'});
SOURCE('d1-cantor',{title:'Georg Cantor (1878). Ein Beitrag zur Mannigfaltigkeitslehre. Journal für die reine und angewandte Mathematik 84, 242–258.'});
SOURCE('d1-dauben',{title:'Joseph W. Dauben (1979). Georg Cantor: His Mathematics and Philosophy of the Infinite. Harvard University Press.',note:'Includes the 1877 letters to Dedekind.'});
SOURCE('d1-peano',{title:'Giuseppe Peano (1890). Sur une courbe, qui remplit toute une aire plane. Mathematische Annalen 36, 157–160.'});
SOURCE('d1-hilbert',{title:'David Hilbert (1891). Über die stetige Abbildung einer Linie auf ein Flächenstück. Mathematische Annalen 38, 459–460.'});
SOURCE('d1-netto',{title:'Eugen Netto (1879). Beitrag zur Mannigfaltigkeitslehre. Journal für die reine und angewandte Mathematik 86, 263–268.'});
SOURCE('d1-brouwer',{title:'L. E. J. Brouwer (1911). Beweis der Invarianz der Dimensionenzahl. Mathematische Annalen 70, 161–165.'});
SOURCE('d1-lebesgue',{title:'Henri Lebesgue (1911). Sur la non applicabilité de deux domaines appartenant respectivement à des espaces à n et n + p dimensions. Mathematische Annalen 70, 166–168.'});
SOURCE('d1-brouwer1913',{title:'L. E. J. Brouwer (1913). Über den natürlichen Dimensionsbegriff. Journal für die reine und angewandte Mathematik 142, 146–152.'});
SOURCE('d1-hausdorff',{title:'Felix Hausdorff (1919). Dimension und äußeres Maß. Mathematische Annalen 79, 157–179.'});
SOURCE('d1-koch',{title:'Helge von Koch (1904). Sur une courbe continue sans tangente, obtenue par une construction géométrique élémentaire. Arkiv för Matematik, Astronomi och Fysik 1, 681–702.'});

LESSON({id:'coordinates',name:'Coordinates',short:'Coordinates',stage:'count',year:'1637–1844',level:'Introduction',
 why:'Descartes and Fermat turned points into lists of numbers, so the number of coordinates a point needs became a way to count dimensions.',
 prior:[],references:['d1-descartes','d1-fermat','d1-clairaut','d1-euler-intro','d1-cayley','d1-grassmann','d1-inselberg','d1-maths'],
 ids:['coordinates','coordinates-curves','coordinates-space','coordinates-n']});
LESSON({id:'degrees-of-freedom',name:'Degrees of freedom',short:'Freedom',stage:'count',year:'1788–today',level:'Introduction',
 why:'Counting the independent ways a thing can move gives a dimension even when the thing is not a shape, which is how most high-dimensional spaces arise.',
 prior:['coordinates'],references:['d1-lagrange','d1-euler-rigid','d1-grubler','d1-wilson'],
 ids:['degrees-of-freedom','degrees-of-freedom-constraints','degrees-of-freedom-molecules']});
LESSON({id:'flatland',name:'Flatland',short:'Flatland',stage:'count',year:'1880–1884',level:'Core',
 why:'Abbott’s story of a Square visited by a Sphere taught generations to reason about a fourth dimension by analogy with the third.',
 prior:['coordinates'],references:['d1-abbott','d1-stewart','d1-hinton','d1-cavalieri','d1-zollner'],
 ids:['flatland','flatland-4ball','flatland-analogy']});
LESSON({id:'shadows-projection',name:'Shadows and projection',short:'Shadows',stage:'count',year:'1880–today',level:'Core',
 why:'A shadow drops one dimension, so learning to read a cube from its shadows is practice for reading a four-dimensional shape from its three-dimensional ones.',
 prior:['flatland'],references:['d1-durer','d1-taylor','d1-coxeter','d1-stringham'],
 ids:['shadows-projection','shadows-projection-perspective','shadows-projection-tesseract']});
LESSON({id:'n-distance',name:'Distance in n dimensions',short:'Distance',stage:'count',year:'1821–1844',level:'Core',
 why:'Pythagoras’ theorem extends one coordinate at a time, so distance and angle work the same way in any number of dimensions.',
 prior:['coordinates'],references:['d1-euclid','d1-cayley','d1-grassmann','d1-cauchy','d1-maths'],
 ids:['n-distance','n-distance-points','n-distance-angle']});
LESSON({id:'what-is-dimension',name:'What is a dimension?',short:'Dimension',stage:'count',year:'1877–1925',level:'Core',
 why:'Cantor showed a line and a square have the same number of points, so dimension needed a careful definition, and Brouwer proved that it survives continuous change.',
 prior:['degrees-of-freedom','n-distance'],references:['d1-cantor','d1-dauben','d1-netto','d1-peano','d1-hilbert','d1-brouwer','d1-lebesgue','d1-brouwer1913','d1-hausdorff','d1-koch'],
 ids:['what-is-dimension','what-is-dimension-peano','what-is-dimension-brouwer','what-is-dimension-meanings']});

// Connections across eras. Names shared with another era's THREAD merge into one connection.
THREAD({id:'d1-shadows',name:'Shadows and projections',ids:['shadows-projection','shadows-projection-perspective','shadows-projection-tesseract','schlegel-diagrams']});
THREAD({id:'d1-high-cube',name:'The cube in many dimensions',ids:['n-distance','n-distance-angle','nearly-perpendicular','cube-corners']});
THREAD({id:'d1-slices',name:'Slicing through a dimension',ids:['flatland','flatland-4ball','slicing','ball-volume']});
THREAD({id:'d1-freedom',name:'Freedoms become spaces',ids:['degrees-of-freedom','degrees-of-freedom-constraints','degrees-of-freedom-molecules','configuration-space','phase-space']});
THREAD({id:'d1-lists',name:'Points as lists of numbers',ids:['coordinates-n','n-distance-points','data-dimensions']});
THREAD({id:'d1-escape',name:'Through the fourth direction',ids:['flatland-analogy','knots-4d']});
THREAD({id:'d1-meanings',name:'What counts as a dimension',ids:['what-is-dimension-brouwer','what-is-dimension-meanings','manifold-idea','fractal-dimension']});
