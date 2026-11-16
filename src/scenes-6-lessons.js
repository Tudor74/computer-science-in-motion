/* Chemistry era 6 · The chemistry of carbon: lessons, sources and connections. */
SOURCE('c6-kekule-1858',{title:'Kekulé, A. (1858). Über die Constitution und die Metamorphosen der chemischen Verbindungen und über die chemische Natur des Kohlenstoffs. Annalen der Chemie 106, 129–159.'});
SOURCE('c6-couper-1858',{title:'Couper, A. S. (1858). On a new chemical theory. Philosophical Magazine 16, 104–116.'});
SOURCE('c6-cayley-1875',{title:'Cayley, A. (1875). On the analytical forms called trees, with application to the theory of chemical combinations. Report of the British Association 45, 257–305.'});
SOURCE('c6-crc',{title:'CRC Handbook of Chemistry and Physics (boiling points and bond data).'});
SOURCE('c6-iupac-2013',{title:'IUPAC (2013). Nomenclature of Organic Chemistry: IUPAC Recommendations and Preferred Names 2013. Royal Society of Chemistry.'});
SOURCE('c6-clayden-2012',{title:'Clayden, J., Greeves, N. & Warren, S. (2012). Organic Chemistry, 2nd edn. Oxford University Press.'});
SOURCE('c6-fischer-1895',{title:'Fischer, E. & Speier, A. (1895). Darstellung der Ester. Berichte der deutschen chemischen Gesellschaft 28, 3252–3258.'});
SOURCE('c6-kekule-1865',{title:'Kekulé, A. (1865). Sur la constitution des substances aromatiques. Bulletin de la Société Chimique de Paris 3, 98–110.'});
SOURCE('c6-lonsdale-1929',{title:'Lonsdale, K. (1929). The structure of the benzene ring in C₆(CH₃)₆. Proceedings of the Royal Society A 123, 494–515.'});
SOURCE('c6-kistiakowsky-1936',{title:'Kistiakowsky, G. B. et al. (1936). Heats of organic reactions. IV. Hydrogenation of some dienes and of benzene. Journal of the American Chemical Society 58, 146–153.'});
SOURCE('c6-rocke-2010',{title:'Rocke, A. J. (2010). Image and Reality: Kekulé, Kopp, and the Scientific Imagination. University of Chicago Press.'});
SOURCE('c6-huckel-1931',{title:'Hückel, E. (1931). Quantentheoretische Beiträge zum Benzolproblem. Zeitschrift für Physik 70, 204–286.'});
SOURCE('c6-vanthoff-1874',{title:'van ’t Hoff, J. H. (1874). Voorstel tot uitbreiding der tegenwoordig in de scheikunde gebruikte structuurformules in de ruimte. Utrecht.'});
SOURCE('c6-cip-1966',{title:'Cahn, R. S., Ingold, C. & Prelog, V. (1966). Specification of molecular chirality. Angewandte Chemie International Edition 5, 385–415.'});
SOURCE('c6-pasteur-1848',{title:'Pasteur, L. (1848). Mémoire sur la relation qui peut exister entre la forme cristalline et la composition chimique, et sur la cause de la polarisation rotatoire. Comptes rendus 26, 535–538.'});
SOURCE('c6-mcbride-1961',{title:'McBride, W. G. (1961). Thalidomide and congenital abnormalities. The Lancet 278, 1358.'});
SOURCE('c6-eriksson-1995',{title:'Eriksson, T. et al. (1995). Stereospecific determination, chiral inversion in vitro and pharmacokinetics in humans of the enantiomers of thalidomide. Chirality 7, 44–52.'});
SOURCE('c6-staudinger-1920',{title:'Staudinger, H. (1920). Über Polymerisation. Berichte der deutschen chemischen Gesellschaft 53, 1073–1085.'});
SOURCE('c6-carothers-1937',{title:'Carothers, W. H. (1937). Linear condensation polymers. US Patent 2,130,948.'});
SOURCE('c6-geyer-2017',{title:'Geyer, R., Jambeck, J. R. & Law, K. L. (2017). Production, use, and fate of all plastics ever made. Science Advances 3, e1700782.',url:'https://doi.org/10.1126/sciadv.1700782'});
SOURCE('c6-corey-1967',{title:'Corey, E. J. (1967). General methods for the construction of complex molecules. Pure and Applied Chemistry 14, 19–37.'});
SOURCE('c6-corey-1989',{title:'Corey, E. J. & Cheng, X.-M. (1989). The Logic of Chemical Synthesis. Wiley.'});
SOURCE('c6-nicolaou-1996',{title:'Nicolaou, K. C. & Sorensen, E. J. (1996). Classics in Total Synthesis. VCH.'});
SOURCE('c6-woodward-1944',{title:'Woodward, R. B. & Doering, W. E. (1944). The total synthesis of quinine. Journal of the American Chemical Society 66, 849.'});
SOURCE('c6-stork-2001',{title:'Stork, G. et al. (2001). The first stereoselective total synthesis of quinine. Journal of the American Chemical Society 123, 3239–3242.'});
SOURCE('c6-smith-2008',{title:'Smith, A. C. & Williams, R. M. (2008). Rabe rest in peace: confirmation of the Rabe–Kindler conversion of d-quinotoxine into quinine. Angewandte Chemie International Edition 47, 1736–1740.'});
SOURCE('c6-abiogenesis',{title:'Abiogenesis In Motion: Wöhler’s urea and the handedness of life’s molecules.',url:'https://abiogenesis-in-motion.puter.site/'});
SOURCE('c6-biology',{title:'Biology In Motion: proteins, DNA and enzymes, the molecules organic chemistry builds.',url:'https://biology-in-motion.puter.site/'});

LESSON({id:'carbon-skeletons',name:'Carbon skeletons',short:'Carbon chains',stage:'organic',year:'1858–1875',level:'Introduction',
 why:'Carbon’s four bonds and its habit of bonding to itself make millions of compounds possible.',
 prior:['lewis-structures','vsepr-shapes'],references:['c6-kekule-1858','c6-couper-1858','c6-cayley-1875','c6-crc','c6-abiogenesis'],
 ids:['carbon-skeletons','carbon-skeletons-isomers','carbon-skeletons-bonds']});
LESSON({id:'functional-groups',name:'Functional groups',short:'Groups',stage:'organic',year:'1850s–1895',level:'Core',
 why:'A handful of reactive groups decides how organic molecules behave, whatever their carbon chain.',
 prior:['carbon-skeletons','hydrogen-bonds','redox-batteries'],references:['c6-iupac-2013','c6-clayden-2012','c6-fischer-1895','c6-crc'],
 ids:['functional-groups','functional-groups-oxidation','functional-groups-esters']});
LESSON({id:'benzene-aromaticity',name:'Benzene and aromaticity',short:'Benzene',stage:'organic',year:'1825–1931',level:'Core',
 why:'Benzene’s ring puzzled chemists for a century and led to the idea of shared, delocalised electrons.',
 prior:['carbon-skeletons-bonds','orbitals-hybrids'],references:['c6-kekule-1865','c6-lonsdale-1929','c6-kistiakowsky-1936','c6-rocke-2010','c6-huckel-1931'],
 ids:['benzene-aromaticity','benzene-aromaticity-energy','benzene-aromaticity-dream','benzene-aromaticity-huckel']});
LESSON({id:'stereochemistry',name:'Stereochemistry',short:'Handedness',stage:'organic',year:'1848–1966',level:'Core',
 why:'Molecules can be left- or right-handed, and the difference matters to light, to living things and to medicines.',
 prior:['vsepr-shapes','carbon-skeletons'],references:['c6-pasteur-1848','c6-vanthoff-1874','c6-cip-1966','c6-mcbride-1961','c6-eriksson-1995','c6-abiogenesis'],
 ids:['stereochemistry','stereochemistry-pasteur','stereochemistry-thalidomide']});
LESSON({id:'polymers',name:'Polymers',short:'Polymers',stage:'organic',year:'1920–2017',level:'Core',
 why:'Long chains of small units make plastics, fibres and the molecules of life, and their durability has a cost.',
 prior:['functional-groups','carbon-skeletons'],references:['c6-staudinger-1920','c6-carothers-1937','c6-geyer-2017','c6-biology'],
 ids:['polymers','polymers-nylon','polymers-pollution']});
LESSON({id:'total-synthesis',name:'Total synthesis',short:'Synthesis',stage:'organic',year:'1944–2007',level:'Advanced',
 why:'Building complex molecules by design proves their structures and makes medicines; planning it is its own logic.',
 prior:['functional-groups','stereochemistry','reaction-rates'],references:['c6-corey-1967','c6-corey-1989','c6-nicolaou-1996','c6-woodward-1944','c6-stork-2001','c6-smith-2008'],
 ids:['total-synthesis','total-synthesis-yield','total-synthesis-woodward']});

THREAD({id:'c6-shape',name:'Shape decides behaviour',ids:['carbon-skeletons-isomers','carbon-skeletons-bonds','stereochemistry','vsepr-shapes','benzene-aromaticity']});
THREAD({id:'c6-shared-electrons',name:'Shared electrons',ids:['lewis-structures','orbitals-hybrids','benzene-aromaticity','benzene-aromaticity-huckel','carbon-skeletons-bonds']});
THREAD({id:'c6-chemistry-and-harm',name:'Chemistry and harm',ids:['stereochemistry-thalidomide','polymers-pollution','catalysis','atmospheric-chemistry','green-chemistry']});
THREAD({id:'c6-stories',name:'Stories and evidence',ids:['benzene-aromaticity-dream','total-synthesis-woodward','oxygen-discovery','phlogiston']});
