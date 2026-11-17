/* Chemistry era 1 · From alchemy to chemistry: lessons, sources and connections. */
SOURCE('c1-aristotle-gc',{title:'Aristotle, On Generation and Corruption, book II (4th century BCE).',url:'https://en.wikipedia.org/wiki/On_Generation_and_Corruption'});
SOURCE('c1-lloyd-1970',{title:'Lloyd, G. E. R. (1970). Early Greek Science: Thales to Aristotle. Chatto & Windus.'});
SOURCE('c1-needham-1956',{title:'Needham, J. (1956). Science and Civilisation in China, vol. 2: History of Scientific Thought. Cambridge University Press.'});
SOURCE('c1-dasgupta-1922',{title:'Dasgupta, S. (1922). A History of Indian Philosophy, vol. 1. Cambridge University Press.'});
SOURCE('c1-boyle-1661',{title:'Boyle, R. (1661). The Sceptical Chymist. London.',url:'https://en.wikipedia.org/wiki/The_Sceptical_Chymist'});
SOURCE('c1-principe-1998',{title:'Principe, L. M. (1998). The Aspiring Adept: Robert Boyle and His Alchemical Quest. Princeton University Press.'});
SOURCE('c1-forbes-1948',{title:'Forbes, R. J. (1948). A Short History of the Art of Distillation. Brill.'});
SOURCE('c1-taylor-1945',{title:'Taylor, F. S. (1945). The evolution of the still. Annals of Science 5, 185–202.'});
SOURCE('c1-kraus-1942',{title:'Kraus, P. (1942–43). Jābir ibn Ḥayyān: contribution à l’histoire des idées scientifiques dans l’Islam. Cairo.'});
SOURCE('c1-newman-1991',{title:'Newman, W. R. (1991). The Summa Perfectionis of Pseudo-Geber. Brill.'});
SOURCE('c1-stapleton-1927',{title:'Stapleton, H. E., Azo, R. F. & Hidayat Husain, M. (1927). Chemistry in Iraq and Persia in the tenth century A.D. Memoirs of the Asiatic Society of Bengal 8, 317–418.'});
SOURCE('c1-boyle-1662',{title:'Boyle, R. (1662). A Defence of the Doctrine Touching the Spring and Weight of the Air (2nd edn of New Experiments Physico-Mechanicall).',url:'https://en.wikipedia.org/wiki/Boyle%27s_law'});
SOURCE('c1-webster-1965',{title:'Webster, C. (1965). The discovery of Boyle’s law, and the concept of the elasticity of air in the seventeenth century. Archive for History of Exact Sciences 2, 441–502.'});
SOURCE('c1-shapin-1989',{title:'Shapin, S. (1989). The invisible technician. American Scientist 77, 554–563.'});
SOURCE('c1-mariotte-1676',{title:'Mariotte, E. (1676). Discours de la nature de l’air. Paris.'});
SOURCE('c1-physics',{title:'Physics In Motion: gas laws and kinetic theory (companion course).',url:'https://physics-in-motion.puter.site/',note:'The temperature side of the gas laws is covered there.'});
SOURCE('c1-stahl-1703',{title:'Stahl, G. E. (1703). Specimen Becherianum. Leipzig.'});
SOURCE('c1-partington-1937',{title:'Partington, J. R. & McKie, D. (1937–39). Historical studies on the phlogiston theory. Annals of Science 2–4.'});
SOURCE('c1-chang-2012',{title:'Chang, H. (2012). Is Water H2O? Evidence, Realism and Pluralism. Springer.'});
SOURCE('c1-black-1756',{title:'Black, J. (1756). Experiments upon magnesia alba, quicklime, and some other alcaline substances. Essays and Observations, Physical and Literary 2, 157–225.'});
SOURCE('c1-cavendish-1766',{title:'Cavendish, H. (1766). Three papers containing experiments on factitious air. Philosophical Transactions 56, 141–184.'});
SOURCE('c1-lavoisier-1774',{title:'Lavoisier, A.-L. (1774). Opuscules physiques et chimiques. Paris.'});
SOURCE('c1-lavoisier-1789',{title:'Lavoisier, A.-L. (1789). Traité élémentaire de chimie. Paris (plates by Marie-Anne Paulze Lavoisier).',url:'https://en.wikipedia.org/wiki/Trait%C3%A9_%C3%A9l%C3%A9mentaire_de_chimie'});
SOURCE('c1-eagle-1998',{title:'Eagle, C. T. & Sloan, J. (1998). Marie Anne Paulze Lavoisier: the mother of modern chemistry. The Chemical Educator 3, 1–18.'});
SOURCE('c1-menshutkin-1952',{title:'Menshutkin, B. N. (1952). Russia’s Lomonosov: Chemist, Courtier, Physicist, Poet. Princeton University Press.'});
SOURCE('c1-scheele-1777',{title:'Scheele, C. W. (1777). Chemische Abhandlung von der Luft und dem Feuer. Uppsala and Leipzig.'});
SOURCE('c1-priestley-1775',{title:'Priestley, J. (1775). Experiments and Observations on Different Kinds of Air, vol. 2. London.'});
SOURCE('c1-kuhn-1962',{title:'Kuhn, T. S. (1962). The Structure of Scientific Revolutions, ch. 6. University of Chicago Press.'});
SOURCE('c1-nomenclature-1787',{title:'Guyton de Morveau, L.-B., Lavoisier, A.-L., Berthollet, C.-L. & Fourcroy, A.-F. (1787). Méthode de nomenclature chimique. Paris.'});
SOURCE('c1-davy-1811',{title:'Davy, H. (1810). Researches on the oxymuriatic acid, its nature and combinations; and on the elements of the muriatic acid. Philosophical Transactions 100, 231–257.'});

LESSON({id:'four-elements',name:'Four elements and their rivals',short:'Elements',stage:'alchemy',year:'c. 450 BCE–1661',level:'Introduction',
 why:'For two thousand years matter was explained by a few elements defined by qualities; Boyle’s critique in 1661 opened the way to elements defined by experiment.',
 prior:[],references:['c1-aristotle-gc','c1-lloyd-1970','c1-needham-1956','c1-dasgupta-1922','c1-boyle-1661','c1-principe-1998'],
 ids:['four-elements','four-elements-traditions','four-elements-test']});
LESSON({id:'alchemy-distillation',name:'Alchemy and distillation',short:'Alchemy',stage:'alchemy',year:'c. 200–1000',level:'Introduction',
 why:'Alchemists writing in Greek and Arabic built the laboratory: the still, careful classification and a theory of metals that drove centuries of experiment.',
 prior:['four-elements'],references:['c1-forbes-1948','c1-taylor-1945','c1-kraus-1942','c1-newman-1991','c1-stapleton-1927'],
 ids:['alchemy-distillation','alchemy-distillation-sulphur-mercury','alchemy-distillation-classify']});
LESSON({id:'boyle-law',name:'Boyle’s law',short:'Boyle',stage:'alchemy',year:'1662',level:'Core',
 why:'Boyle’s J-tube gave one of the first quantitative laws of matter: squeeze a gas to half its volume and its pressure doubles.',
 prior:['four-elements'],references:['c1-boyle-1662','c1-webster-1965','c1-shapin-1989','c1-mariotte-1676','c1-physics'],
 ids:['boyle-law','boyle-law-curve','boyle-law-credit']});
LESSON({id:'phlogiston',name:'Phlogiston',short:'Phlogiston',stage:'alchemy',year:'1703–1780s',level:'Core',
 why:'Phlogiston explained burning, rusting and smelting in one scheme and organised a century of research, until the balance showed that burning metals gain weight.',
 prior:['four-elements'],references:['c1-stahl-1703','c1-partington-1937','c1-chang-2012','c1-black-1756','c1-cavendish-1766','c1-priestley-1775'],
 ids:['phlogiston','phlogiston-weight','phlogiston-air']});
LESSON({id:'conservation-of-mass',name:'Conservation of mass',short:'Mass',stage:'alchemy',year:'1774–1789',level:'Core',
 why:'Weighing everything in a sealed vessel showed that reactions rearrange matter without creating or destroying it, the rule behind every balanced equation.',
 prior:['phlogiston'],references:['c1-lavoisier-1774','c1-lavoisier-1789','c1-eagle-1998','c1-menshutkin-1952'],
 ids:['conservation-of-mass','conservation-of-mass-balance','conservation-of-mass-people']});
LESSON({id:'oxygen-discovery',name:'The discovery of oxygen',short:'Oxygen',stage:'alchemy',year:'1771–1787',level:'Core',
 why:'Three chemists can claim oxygen, depending on what discovery means; Lavoisier’s interpretation and new names turned alchemy’s language into chemistry’s.',
 prior:['phlogiston','conservation-of-mass'],references:['c1-scheele-1777','c1-priestley-1775','c1-kuhn-1962','c1-nomenclature-1787','c1-davy-1811'],
 ids:['oxygen-discovery','oxygen-discovery-hgo','oxygen-discovery-names']});

THREAD({id:'c1-what-is-an-element',name:'What is an element?',ids:['four-elements','four-elements-test','alchemy-distillation-sulphur-mercury','oxygen-discovery-names','dalton-atoms','periodic-table','atomic-number']});
THREAD({id:'c1-measuring-matter',name:'Measuring matter',ids:['boyle-law','phlogiston-weight','conservation-of-mass','conservation-of-mass-balance','dalton-atoms','avogadro']});
THREAD({id:'c1-burning',name:'What happens when things burn',ids:['four-elements-test','phlogiston','phlogiston-air','oxygen-discovery','redox-batteries','free-energy']});
THREAD({id:'c1-gases',name:'Airs and gases',ids:['boyle-law','boyle-law-curve','phlogiston-air','oxygen-discovery-hgo','ideal-gas','atmospheric-chemistry']});
