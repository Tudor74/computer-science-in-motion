/* Abiogenesis era 1 · Spontaneous generation (350 BCE–1862): lessons, sources and connections. */
SOURCE('aristotle-ha',{title:'Aristotle (c. 350 BCE), History of Animals, Books V–VI (trans. D’Arcy Wentworth Thompson)',url:'https://en.wikipedia.org/wiki/History_of_Animals'});
SOURCE('van-helmont-1648',{title:'Jan Baptist van Helmont (1648), Ortus medicinae (published posthumously)',url:'https://en.wikipedia.org/wiki/Jan_Baptist_van_Helmont'});
SOURCE('schmidt-1923',{title:'Johannes Schmidt (1923), The breeding places of the eel, Philosophical Transactions of the Royal Society B 211: 179–208',url:'https://en.wikipedia.org/wiki/Johannes_Schmidt_(biologist)'});
SOURCE('lennox-1982',{title:'James G. Lennox (1982), Teleology, chance, and Aristotle’s theory of spontaneous generation, Journal of the History of Philosophy 20: 219–238'});
SOURCE('farley-1977',{title:'John Farley (1977), The Spontaneous Generation Controversy from Descartes to Oparin. Johns Hopkins University Press'});
SOURCE('redi-1668',{title:'Francesco Redi (1668), Esperienze intorno alla generazione degl’insetti (Experiments on the Generation of Insects)',url:'https://en.wikipedia.org/wiki/Francesco_Redi'});
SOURCE('vallisneri-1700',{title:'Antonio Vallisneri (1700), Esperienze ed osservazioni intorno all’origine, sviluppi e costumi di varj insetti',url:'https://en.wikipedia.org/wiki/Antonio_Vallisneri'});
SOURCE('needham-1748',{title:'John Turberville Needham (1748), A summary of some late observations upon the generation, composition, and decomposition of animal and vegetable substances, Philosophical Transactions 45: 615–666',url:'https://en.wikipedia.org/wiki/John_Needham'});
SOURCE('spallanzani-1765',{title:'Lazzaro Spallanzani (1765), Saggio di osservazioni microscopiche concernenti il sistema della generazione de’ signori di Needham e Buffon',url:'https://en.wikipedia.org/wiki/Lazzaro_Spallanzani'});
SOURCE('esty-meyer-1922',{title:'J. R. Esty & K. F. Meyer (1922), The heat resistance of the spores of B. botulinus and allied anaerobes, Journal of Infectious Diseases 31: 650–663'});
SOURCE('pasteur-1862',{title:'Louis Pasteur (1862), Mémoire sur les corpuscules organisés qui existent dans l’atmosphère, Annales des sciences naturelles (Zoologie) 16: 5–98',url:'https://en.wikipedia.org/wiki/Spontaneous_generation'});
SOURCE('pouchet-1859',{title:'Félix-Archimède Pouchet (1859), Hétérogénie, ou traité de la génération spontanée',url:'https://en.wikipedia.org/wiki/F%C3%A9lix_Archim%C3%A8de_Pouchet'});
SOURCE('cohn-1876',{title:'Ferdinand Cohn (1876), Untersuchungen über Bacterien IV, Beiträge zur Biologie der Pflanzen 2 (heat-resistant spores)',url:'https://en.wikipedia.org/wiki/Ferdinand_Cohn'});
SOURCE('tyndall-1877',{title:'John Tyndall (1877), Further researches on the deportment and vital resistance of putrefactive and infective organisms, Philosophical Transactions 167: 149–206',url:'https://en.wikipedia.org/wiki/Tyndallization'});
SOURCE('farley-geison-1974',{title:'John Farley & Gerald L. Geison (1974), Science, politics and spontaneous generation in nineteenth-century France: the Pasteur–Pouchet debate, Bulletin of the History of Medicine 48: 161–198'});
SOURCE('geison-1995',{title:'Gerald L. Geison (1995), The Private Science of Louis Pasteur. Princeton University Press'});
SOURCE('biology-im-germs',{title:'Biology In Motion: germ theory and Pasteur’s swan-neck flasks',url:'https://biology-in-motion.puter.site/',note:'Sister course.'});

LESSON({id:'aristotle-generation',name:'Spontaneous generation',short:'Old recipes',stage:'spontaneous',year:'c. 350 BCE–1648',level:'Introduction',
 why:'For two thousand years it seemed obvious that some creatures arise from mud, meat or dust; seeing why it seemed obvious is the start of the story.',
 prior:[],references:['aristotle-ha','van-helmont-1648','schmidt-1923','lennox-1982','farley-1977'],ids:['aristotle-generation','aristotle-generation-sort','aristotle-generation-shrinks']});
LESSON({id:'redi-flies',name:'Redi’s flies',short:'Redi’s flies',stage:'spontaneous',year:'1668',level:'Introduction',
 why:'A simple, well-controlled experiment removed insects from the list of things that arise by themselves.',
 prior:['aristotle-generation'],references:['redi-1668','vallisneri-1700'],ids:['redi-flies','redi-flies-fair','redi-flies-cycle']});
LESSON({id:'needham-spallanzani',name:'Needham and Spallanzani',short:'Boiled broth',stage:'spontaneous',year:'1748–1776',level:'Core',
 why:'Once microbes were known, the argument moved to flasks of broth: how long to boil, how to seal, and which experiments can tell ideas apart.',
 prior:['redi-flies'],references:['needham-1748','spallanzani-1765','esty-meyer-1922','farley-1977'],ids:['needham-spallanzani','needham-spallanzani-vital','needham-spallanzani-heat']});
LESSON({id:'pasteur-pouchet',name:'Pasteur and Pouchet',short:'Pasteur–Pouchet',stage:'spontaneous',year:'1859–1877',level:'Core',
 why:'Pasteur showed that life does not arise in sterile broth today, while Pouchet’s genuine results waited for spores to explain them.',
 prior:['needham-spallanzani'],references:['pasteur-1862','pouchet-1859','cohn-1876','tyndall-1877','farley-geison-1974','geison-1995','biology-im-germs'],ids:['pasteur-pouchet','pasteur-pouchet-hay','pasteur-pouchet-contest']});

THREAD({id:'a1-controls',name:'Designing a decisive experiment',ids:['redi-flies-fair','needham-spallanzani-vital','pasteur-pouchet','miller-urey']});
THREAD({id:'a1-hidden',name:'Hidden sources of life',ids:['aristotle-generation','redi-flies','pasteur-pouchet-hay','meteorite-chemistry']});
THREAD({id:'a1-two-questions',name:'Spontaneous generation against abiogenesis',ids:['pasteur-pouchet-contest','oparin-haldane','hadean-earth','defining-life']});
