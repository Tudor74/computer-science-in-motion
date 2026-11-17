/* Chemistry era 2 · Atoms and weights: lessons, sources and connections. */
SOURCE('c2-dalton-1808',{title:'Dalton, J. (1808). A New System of Chemical Philosophy, Part I. Manchester',url:'https://archive.org/details/newsystemofchemi01daltuoft'});
SOURCE('c2-proust-1797',{title:'Proust, J.-L. (1790s). Recherches sur le bleu de Prusse. Journal de Physique (the law of definite proportions)'});
SOURCE('c2-berzelius-1813',{title:'Berzelius, J. J. (1813–1814). Essay on the cause of chemical proportions, and on some circumstances relating to them. Annals of Philosophy 2–3'});
SOURCE('c2-gay-lussac-1809',{title:'Gay-Lussac, J. L. (1809). Mémoire sur la combinaison des substances gazeuses, les unes avec les autres. Mémoires de la Société d’Arcueil 2'});
SOURCE('c2-avogadro-1811',{title:'Avogadro, A. (1811). Essai d’une manière de déterminer les masses relatives des molécules élémentaires des corps. Journal de Physique 73'});
SOURCE('c2-avogadro-wiki',{title:'Avogadro constant (Wikipedia)',url:'https://en.wikipedia.org/wiki/Avogadro_constant'});
SOURCE('c2-loschmidt-1865',{title:'Loschmidt, J. (1865). Zur Grösse der Luftmoleküle. Sitzungsberichte der Akademie der Wissenschaften Wien 52'});
SOURCE('c2-nicholson-1800',{title:'Nicholson, W. & Carlisle, A. (1800). Account of the new electrical or galvanic apparatus of Sig. Alex. Volta. Journal of Natural Philosophy, Chemistry and the Arts 4'});
SOURCE('c2-davy-1808',{title:'Davy, H. (1808). On some new phenomena of chemical changes produced by electricity, particularly the decomposition of the fixed alkalies. Philosophical Transactions 98'});
SOURCE('c2-faraday-1834',{title:'Faraday, M. (1834). Experimental researches in electricity, seventh series. Philosophical Transactions 124'});
SOURCE('c2-clapeyron-1834',{title:'Clapeyron, É. (1834). Mémoire sur la puissance motrice de la chaleur. Journal de l’École Polytechnique 14'});
SOURCE('c2-dumas-1826',{title:'Dumas, J.-B. (1826). Mémoire sur quelques points de la théorie atomistique. Annales de Chimie et de Physique 33'});
SOURCE('c2-vdw-1873',{title:'van der Waals, J. D. (1873). Over de continuïteit van den gas- en vloeistoftoestand. Thesis, Leiden'});
SOURCE('c2-physics',{title:'Physics In Motion: kinetic theory and the gas laws, from the particle side',url:'https://physics-in-motion.puter.site/',note:'Sister course: why gases obey pV = nRT.'});
SOURCE('c2-kirchhoff-bunsen-1860',{title:'Kirchhoff, G. & Bunsen, R. (1860). Chemische Analyse durch Spectralbeobachtungen. Annalen der Physik 110'});
SOURCE('c2-fraunhofer-1817',{title:'Fraunhofer, J. (1817). Bestimmung des Brechungs- und Farbenzerstreuungs-Vermögens verschiedener Glasarten. Denkschriften der Akademie München 5'});
SOURCE('c2-nist-asd',{title:'NIST Atomic Spectra Database',url:'https://www.nist.gov/pml/atomic-spectra-database'});
SOURCE('c2-prout-1815',{title:'Prout, W. (1815). On the relation between the specific gravities of bodies in their gaseous state and the weights of their atoms. Annals of Philosophy 6'});
SOURCE('c2-stas-1860',{title:'Stas, J. S. (1860). Recherches sur les rapports réciproques des poids atomiques. Brussels'});
SOURCE('c2-cannizzaro-1858',{title:'Cannizzaro, S. (1858). Sunto di un corso di filosofia chimica. Il Nuovo Cimento 7',url:'https://en.wikipedia.org/wiki/Stanislao_Cannizzaro'});
SOURCE('c2-karlsruhe-wiki',{title:'Karlsruhe Congress (Wikipedia)',url:'https://en.wikipedia.org/wiki/Karlsruhe_Congress'});
SOURCE('c2-iupac-weights',{title:'IUPAC Commission on Isotopic Abundances and Atomic Weights: standard atomic weights',url:'https://www.ciaaw.org/atomic-weights.htm'});

LESSON({id:'dalton-atoms',name:'Dalton’s atoms',short:'Dalton',stage:'atoms',year:'1803–1808',level:'Introduction',
 why:'Elements combine in fixed and whole-number proportions by mass, which Dalton explained with indivisible atoms of characteristic weight.',
 prior:['conservation-of-mass','four-elements'],references:['c2-dalton-1808','c2-proust-1797','c2-berzelius-1813'],
 ids:['dalton-atoms','dalton-atoms-symbols','dalton-atoms-definite']});
LESSON({id:'avogadro',name:'Gas volumes and Avogadro',short:'Avogadro',stage:'atoms',year:'1808–1811',level:'Core',
 why:'Gases react in whole-number volumes; Avogadro’s equal-numbers hypothesis and two-atom molecules explain why, and lead to the mole.',
 prior:['dalton-atoms','boyle-law'],references:['c2-gay-lussac-1809','c2-avogadro-1811','c2-loschmidt-1865','c2-avogadro-wiki'],
 ids:['avogadro','avogadro-diatomic','avogadro-number']});
LESSON({id:'electrolysis',name:'Electrolysis',short:'Electrolysis',stage:'atoms',year:'1800–1834',level:'Core',
 why:'Electricity splits compounds into elements, revealed new metals, and showed through Faraday’s laws that charge comes in fixed amounts per atom.',
 prior:['dalton-atoms','oxygen-discovery'],references:['c2-nicholson-1800','c2-davy-1808','c2-faraday-1834'],
 ids:['electrolysis','electrolysis-davy','electrolysis-faraday']});
LESSON({id:'ideal-gas',name:'The ideal gas',short:'Ideal gas',stage:'atoms',year:'1834–1873',level:'Core',
 why:'One equation, pV = nRT, gathers the gas laws, lets chemists weigh molecules, and shows where real gases depart from it.',
 prior:['boyle-law','avogadro'],references:['c2-clapeyron-1834','c2-dumas-1826','c2-vdw-1873','c2-physics'],
 ids:['ideal-gas','ideal-gas-molar-mass','ideal-gas-real']});
LESSON({id:'flame-spectra',name:'Flame spectra',short:'Spectra',stage:'atoms',year:'1814–1868',level:'Core',
 why:'Each element’s light has its own lines, which identified new elements on Earth and revealed the chemistry of the Sun.',
 prior:['dalton-atoms'],references:['c2-kirchhoff-bunsen-1860','c2-fraunhofer-1817','c2-nist-asd'],
 ids:['flame-spectra','flame-spectra-spectroscope','flame-spectra-sun']});
LESSON({id:'atomic-weights',name:'Atomic weights',short:'Atomic weights',stage:'atoms',year:'1815–1860',level:'Advanced',
 why:'From Prout’s whole numbers to Cannizzaro’s method and the Karlsruhe Congress, chemists learned to agree on atomic weights and formulas.',
 prior:['avogadro','dalton-atoms','ideal-gas'],references:['c2-prout-1815','c2-stas-1860','c2-cannizzaro-1858','c2-karlsruhe-wiki','c2-iupac-weights'],
 ids:['atomic-weights','atomic-weights-cannizzaro','atomic-weights-karlsruhe']});

THREAD({id:'c2-counting-atoms',name:'Counting atoms',ids:['dalton-atoms','avogadro-number','electrolysis-faraday','atomic-weights-cannizzaro','periodic-table']});
THREAD({id:'c2-light-elements',name:'Light reveals elements',ids:['flame-spectra','flame-spectra-spectroscope','flame-spectra-sun','noble-gases','electron-shells']});
THREAD({id:'c2-electricity',name:'Electricity and chemistry',ids:['electrolysis','electrolysis-davy','electrolysis-faraday','redox-batteries']});
THREAD({id:'c2-gases',name:'What gases tell us',ids:['boyle-law','avogadro','ideal-gas','ideal-gas-molar-mass','ideal-gas-real']});
THREAD({id:'c2-formulas',name:'Getting formulas right',ids:['dalton-atoms-symbols','avogadro-diatomic','atomic-weights-cannizzaro','atomic-weights-karlsruhe','lewis-structures']});
