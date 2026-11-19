/* Dimensions era 4 · Surfaces: lessons, sources and connections. */
SOURCE('d4-riemann',{title:'Bernhard Riemann (lecture 1854, published 1868). Über die Hypothesen, welche der Geometrie zu Grunde liegen. Abhandlungen der Königlichen Gesellschaft der Wissenschaften zu Göttingen 13.',url:'https://en.wikipedia.org/wiki/%C3%9Cber_die_Hypothesen,_welche_der_Geometrie_zu_Grunde_liegen'});
SOURCE('d4-weyl',{title:'Hermann Weyl (1913). Die Idee der Riemannschen Fläche. Teubner, Leipzig. English translation: The Concept of a Riemann Surface (1955).'});
SOURCE('d4-whitney',{title:'Hassler Whitney (1936). Differentiable manifolds. Annals of Mathematics 37, 645–680.'});
SOURCE('d4-brouwer',{title:'L. E. J. Brouwer (1911). Beweis der Invarianz der Dimensionenzahl. Mathematische Annalen 70, 161–165.'});
SOURCE('d4-poincare',{title:'Henri Poincaré (1895). Analysis situs. Journal de l’École polytechnique, 2e série, 1.'});
SOURCE('d4-asteroids',{title:'Asteroids (Atari, 1979): an arcade game whose screen wraps round at its edges, so its playing field is a torus.',url:'https://en.wikipedia.org/wiki/Asteroids_(video_game)'});
SOURCE('d4-weeks',{title:'Jeffrey R. Weeks (1985; 2nd edition 2002). The Shape of Space. Marcel Dekker: gluing diagrams, tic-tac-toe on a torus and Klein bottle, and flatlanders on surfaces.'});
SOURCE('d4-listing',{title:'Johann Benedict Listing (1861). Der Census räumlicher Complexe oder Verallgemeinerung des Euler’schen Satzes von den Polyëdern. Abhandlungen der Königlichen Gesellschaft der Wissenschaften zu Göttingen 10 (1861–62).'});
SOURCE('d4-mobius',{title:'August Ferdinand Möbius (1865). Über die Bestimmung des Inhaltes eines Polyëders. Berichte über die Verhandlungen der Königlich Sächsischen Gesellschaft der Wissenschaften, mathematisch-physische Classe 17.'});
SOURCE('d4-pickover',{title:'Clifford A. Pickover (2006). The Möbius Strip: Dr. August Möbius’s Marvelous Band in Mathematics, Games, Literature, Art, Technology, and Cosmology. Thunder’s Mouth Press.'});
SOURCE('d4-klein',{title:'Felix Klein (1882). Über Riemanns Theorie der algebraischen Functionen und ihrer Integrale. Teubner, Leipzig: the closed one-sided surface now called the Klein bottle.'});
SOURCE('d4-boy',{title:'Werner Boy (1903). Über die Curvatura integra und die Topologie geschlossener Flächen. Mathematische Annalen 57, 151–184 (from his 1901 Göttingen dissertation).'});
SOURCE('d4-apery',{title:'François Apéry (1987). Models of the Real Projective Plane. Vieweg: the Roman surface, Boy’s surface and their equations.'});
SOURCE('d4-lhuilier',{title:'Simon Lhuilier (1813). Mémoire sur la polyédrométrie. Annales de mathématiques pures et appliquées (Gergonne’s Annales) 3.'});
SOURCE('d4-richeson',{title:'David S. Richeson (2008). Euler’s Gem: The Polyhedron Formula and the Birth of Topology. Princeton University Press.'});
SOURCE('d4-dyck',{title:'Walther Dyck (1888). Beiträge zur Analysis situs. Mathematische Annalen 32, 457–512.'});
SOURCE('d4-dehn',{title:'Max Dehn & Poul Heegaard (1907). Analysis situs. Encyklopädie der mathematischen Wissenschaften, vol. III, part 1.'});
SOURCE('d4-brahana',{title:'H. R. Brahana (1921). Systems of circuits on two-dimensional manifolds. Annals of Mathematics 23, 144–168.'});
SOURCE('d4-rado',{title:'Tibor Radó (1925). Über den Begriff der Riemannschen Fläche. Acta Litterarum ac Scientiarum (Szeged) 2, 101–121.'});
SOURCE('d4-massey',{title:'William S. Massey (1967). Algebraic Topology: An Introduction. Harcourt, Brace & World; Springer, 1977. Chapter 1: the classification of surfaces by cutting and pasting.'});
SOURCE('d4-gallier',{title:'Jean Gallier & Dianna Xu (2013). A Guide to the Classification Theorem for Compact Surfaces. Springer: the history and a complete proof.'});
SOURCE('d4-zip',{title:'George K. Francis & Jeffrey R. Weeks (1999). Conway’s ZIP proof. American Mathematical Monthly 106, 393–399: a short proof of the classification by zipping.'});
SOURCE('d4-mirzakhani',{title:'Maryam Mirzakhani (2008). Growth of the number of simple closed geodesics on hyperbolic surfaces. Annals of Mathematics 168, 97–125. Fields Medal 2014.',url:'https://en.wikipedia.org/wiki/Maryam_Mirzakhani'});
SOURCE('d4-maths',{title:'Mathematics In Motion: the general mathematics course, for background on coordinates and angles.',url:'https://mathematics-in-motion.puter.site/',note:'Sister course.'});

LESSON({id:'manifold-idea',name:'The idea of a manifold',short:'Manifolds',stage:'surface',year:'1854–1936',level:'Introduction',
 why:'A manifold looks like ordinary flat space close up while possibly being curved or connected strangely overall, the idea behind everything in the rest of the course.',
 prior:['what-is-dimension'],references:['d4-riemann','d4-weyl','d4-whitney','d4-brouwer','d4-maths'],
 ids:['manifold-idea','manifold-idea-atlas','manifold-idea-letters']});
LESSON({id:'gluing-diagrams',name:'Gluing diagrams',short:'Gluing',stage:'surface',year:'1882–today',level:'Introduction',
 why:'Gluing the edges of a square, following arrows, builds cylinders, tori and stranger surfaces, and video games use the same trick.',
 prior:['manifold-idea'],references:['d4-poincare','d4-asteroids','d4-weeks','d4-klein'],
 ids:['gluing-diagrams','gluing-diagrams-torus','gluing-diagrams-words']});
LESSON({id:'orientability',name:'The Möbius strip and orientability',short:'Möbius',stage:'surface',year:'1858–1865',level:'Core',
 why:'A strip with a half-twist has one side, and the idea of a surface that turns a traveller into their mirror image is what orientability measures.',
 prior:['gluing-diagrams'],references:['d4-listing','d4-mobius','d4-pickover','d4-weeks'],
 ids:['orientability','orientability-cut','orientability-coherent']});
LESSON({id:'klein-projective',name:'The Klein bottle and projective plane',short:'Klein bottle',stage:'surface',year:'1882–1901',level:'Core',
 why:'Two closed surfaces cannot be built in ordinary space without passing through themselves, but fit in four dimensions, a first sign of why the extra room matters.',
 prior:['orientability'],references:['d4-klein','d4-boy','d4-apery','d4-weeks'],
 ids:['klein-projective','klein-projective-plane','klein-projective-halves']});
LESSON({id:'euler-genus',name:'Euler characteristic and genus',short:'Genus',stage:'surface',year:'1813–today',level:'Core',
 why:'V − E + F does not depend on how a surface is cut into faces, so it measures the surface itself: 2 for a sphere, 0 for a torus.',
 prior:['gluing-diagrams','euler-formula'],references:['d4-lhuilier','d4-richeson','d4-poincare','d4-rado'],
 ids:['euler-genus','euler-genus-handles','euler-genus-defect']});
LESSON({id:'surface-classification',name:'Classifying surfaces',short:'Classification',stage:'surface',year:'1863–1921',level:'Core',
 why:'Every closed surface is one of two simple families, decided by two pieces of information, a rare complete classification in topology.',
 prior:['klein-projective','euler-genus'],references:['d4-dyck','d4-dehn','d4-brahana','d4-rado','d4-massey','d4-gallier','d4-zip','d4-mirzakhani'],
 ids:['surface-classification','surface-classification-build','surface-classification-same']});

// Connections across eras. A thread with the same name as another era's merges with it.
THREAD({id:'d4-gluing',name:'Spaces made by gluing',ids:['gluing-diagrams','gluing-diagrams-torus','gluing-diagrams-words','configuration-space','three-manifolds']});
THREAD({id:'d4-euler',name:'Euler’s count V − E + F',ids:['euler-formula','euler-genus','euler-genus-handles','surface-classification-build','curvature-inside']});
THREAD({id:'d4-fourth',name:'Through the fourth direction',ids:['flatland','klein-projective','klein-projective-plane','knots-4d']});
THREAD({id:'d4-charts',name:'Maps of curved spaces',ids:['manifold-idea-atlas','stereographic','theorema-egregium','riemann-lecture']});
THREAD({id:'d4-dimension',name:'What counts as a dimension',ids:['what-is-dimension','manifold-idea','manifold-idea-letters','fractal-dimension']});
THREAD({id:'d4-loops',name:'Loops that cannot shrink',ids:['gluing-diagrams-torus','orientability','poincare-conjecture']});
