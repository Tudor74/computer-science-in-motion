/* Abiogenesis era 2 · Life’s chemistry (1828–1970): lessons, sources and connections. */
SOURCE('wohler-1828',{title:'Friedrich Wöhler (1828), Ueber künstliche Bildung des Harnstoffs, Annalen der Physik und Chemie 88: 253–256',url:'https://en.wikipedia.org/wiki/W%C3%B6hler_synthesis'});
SOURCE('brooke-1968',{title:'John Hedley Brooke (1968), Wöhler’s urea, and its vital force? A verdict from the chemists, Ambix 15: 84–114'});
SOURCE('ramberg-2000',{title:'Peter J. Ramberg (2000), The death of vitalism and the birth of organic chemistry: Wöhler’s urea synthesis and the disciplinary identity of organic chemistry, Ambix 47: 170–195'});
SOURCE('buchner-1897',{title:'Eduard Buchner (1897), Alkoholische Gährung ohne Hefezellen, Berichte der deutschen chemischen Gesellschaft 30: 117–124',url:'https://en.wikipedia.org/wiki/Eduard_Buchner'});
SOURCE('berzelius-isomer',{title:'Jöns Jacob Berzelius (1830) and the naming of isomers',url:'https://en.wikipedia.org/wiki/Isomer'});
SOURCE('oparin-1924',{title:'Alexander Oparin (1924), Proiskhozhdenie zhizni (The Origin of Life); expanded English edition 1938',url:'https://en.wikipedia.org/wiki/Alexander_Oparin'});
SOURCE('haldane-1929',{title:'J. B. S. Haldane (1929), The origin of life, The Rationalist Annual 148: 3–10',url:'https://en.wikipedia.org/wiki/Primordial_soup'});
SOURCE('darwin-1871',{title:'Charles Darwin (1871), letter to J. D. Hooker, 1 February, Darwin Correspondence Project letter 7471',url:'https://www.darwinproject.ac.uk/letter/DCP-LETT-7471.xml'});
SOURCE('damer-deamer-2020',{title:'Bruce Damer & David Deamer (2020), The hot spring hypothesis for an origin of life, Astrobiology 20: 429–452'});
SOURCE('lazcano-miller-1996',{title:'Antonio Lazcano & Stanley L. Miller (1996), The origin and early evolution of life: prebiotic chemistry, the pre-RNA world, and time, Cell 85: 793–798'});
SOURCE('baaske-2007',{title:'Philipp Baaske et al. (2007), Extreme accumulation of nucleotides in simulated hydrothermal pore systems, PNAS 104: 9346–9351'});
SOURCE('miller-1953',{title:'Stanley L. Miller (1953), A production of amino acids under possible primitive Earth conditions, Science 117: 528–529',url:'https://doi.org/10.1126/science.117.3046.528'});
SOURCE('johnson-2008',{title:'Adam P. Johnson et al. (2008), The Miller volcanic spark discharge experiment, Science 322: 404',url:'https://doi.org/10.1126/science.1161527'});
SOURCE('parker-2011',{title:'Eric T. Parker et al. (2011), Primordial synthesis of amines and amino acids in a 1958 Miller H₂S-rich spark discharge experiment, PNAS 108: 5526–5531',url:'https://doi.org/10.1073/pnas.1019191108'});
SOURCE('schlesinger-miller-1983',{title:'Gordon Schlesinger & Stanley L. Miller (1983), Prebiotic synthesis in atmospheres containing CH₄, CO, and CO₂. I. Amino acids, Journal of Molecular Evolution 19: 376–382'});
SOURCE('cleaves-2008',{title:'H. James Cleaves et al. (2008), A reassessment of prebiotic organic synthesis in neutral planetary atmospheres, Origins of Life and Evolution of Biospheres 38: 105–115'});
SOURCE('kvenvolden-1970',{title:'Keith Kvenvolden et al. (1970), Evidence for extraterrestrial amino-acids and hydrocarbons in the Murchison meteorite, Nature 228: 923–926',url:'https://doi.org/10.1038/228923a0'});
SOURCE('cronin-pizzarello-1997',{title:'John R. Cronin & Sandra Pizzarello (1997), Enantiomeric excesses in meteoritic amino acids, Science 275: 951–955',url:'https://doi.org/10.1126/science.275.5302.951'});
SOURCE('glavin-dworkin-2009',{title:'Daniel P. Glavin & Jason P. Dworkin (2009), Enrichment of the amino acid L-isovaline by aqueous alteration on CI and CM meteorite parent bodies, PNAS 106: 5487–5492'});
SOURCE('callahan-2011',{title:'Michael P. Callahan et al. (2011), Carbonaceous meteorites contain a wide range of extraterrestrial nucleobases, PNAS 108: 13995–13998',url:'https://doi.org/10.1073/pnas.1106493108'});
SOURCE('furukawa-2019',{title:'Yoshihiro Furukawa et al. (2019), Extraterrestrial ribose and other sugars in primitive meteorites, PNAS 116: 24440–24445',url:'https://doi.org/10.1073/pnas.1907169116'});
SOURCE('oba-2023',{title:'Yasuhiro Oba et al. (2023), Uracil in the carbonaceous asteroid (162173) Ryugu, Nature Communications 14: 1292'});
SOURCE('glavin-2025',{title:'Daniel P. Glavin et al. (2025), soluble organic matter, amino acids and nucleobases in samples from asteroid Bennu, Nature Astronomy',url:'https://en.wikipedia.org/wiki/OSIRIS-REx'});
SOURCE('biology-im-origins',{title:'Biology In Motion: the origins-of-life lesson (Miller–Urey, the RNA world, vents)',url:'https://biology-in-motion.puter.site/',note:'Sister course.'});

LESSON({id:'wohler-urea',name:'Wöhler’s urea',short:'Wöhler’s urea',stage:'chemistry',year:'1828–1897',level:'Introduction',
 why:'The chemistry of living things turned out to be ordinary chemistry, though more slowly and less dramatically than the textbook story says.',
 prior:['pasteur-pouchet'],references:['wohler-1828','brooke-1968','ramberg-2000','buchner-1897','berzelius-isomer'],ids:['wohler-urea','wohler-urea-vitalism','wohler-urea-isomers']});
LESSON({id:'oparin-haldane',name:'Oparin, Haldane and the soup',short:'Primordial soup',stage:'chemistry',year:'1871–1929',level:'Introduction',
 why:'Without oxygen or life to destroy them, organic molecules made by sunlight and lightning could accumulate: the first testable picture of how chemistry became biology.',
 prior:['wohler-urea'],references:['oparin-1924','haldane-1929','darwin-1871','damer-deamer-2020','lazcano-miller-1996','baaske-2007'],ids:['oparin-haldane','oparin-haldane-darwin','oparin-haldane-dilution']});
LESSON({id:'miller-urey',name:'Miller–Urey',short:'Miller–Urey',stage:'chemistry',year:'1953–2011',level:'Core',
 why:'Sparks through simple gases gave amino acids within days, turning the soup from an idea into an experiment, and its archived vials still hold surprises.',
 prior:['oparin-haldane'],references:['miller-1953','johnson-2008','parker-2011','schlesinger-miller-1983','cleaves-2008','biology-im-origins'],ids:['miller-urey','miller-urey-archive','miller-urey-atmosphere']});
LESSON({id:'meteorite-chemistry',name:'Meteorite chemistry',short:'Meteorites',stage:'chemistry',year:'1969–2025',level:'Core',
 why:'Rocks from space carry amino acids, nucleobases and sugars made without life, and a slight left-handed excess that may bear on life’s handedness.',
 prior:['miller-urey'],references:['kvenvolden-1970','cronin-pizzarello-1997','glavin-dworkin-2009','callahan-2011','furukawa-2019','oba-2023','glavin-2025'],ids:['meteorite-chemistry','meteorite-chemistry-chirality','meteorite-chemistry-samples']});

THREAD({id:'a2-building-blocks',name:'Where the building blocks come from',ids:['miller-urey','miller-urey-atmosphere','meteorite-chemistry','nucleotide-synthesis','hydrothermal-vents']});
THREAD({id:'a2-concentration',name:'Getting molecules together',ids:['oparin-haldane-dilution','hydrothermal-vents','protocells','membrane-growth']});
THREAD({id:'a2-handedness',name:'One-handed life',ids:['meteorite-chemistry-chirality','chirality']});
THREAD({id:'a2-ponds-vents',name:'Ponds or vents?',ids:['oparin-haldane-darwin','hydrothermal-vents','proton-gradients']});
