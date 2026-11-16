/* Abiogenesis era 8 · Life elsewhere: lessons, sources and connections. */
SOURCE('a8-kasting-1993',{title:'Kasting, J. F., Whitmire, D. P. & Reynolds, R. T. (1993). Habitable zones around main sequence stars. Icarus 101, 108–128.'});
SOURCE('a8-kopparapu-2013',{title:'Kopparapu, R. K. et al. (2013). Habitable zones around main-sequence stars: new estimates. Astrophysical Journal 765, 131.'});
SOURCE('a8-anglada-2016',{title:'Anglada-Escudé, G. et al. (2016). A terrestrial planet candidate in a temperate orbit around Proxima Centauri. Nature 536, 437–440.'});
SOURCE('a8-gillon-2017',{title:'Gillon, M. et al. (2017). Seven temperate terrestrial planets around the nearby ultracool dwarf star TRAPPIST-1. Nature 542, 456–460.'});
SOURCE('a8-sagan-1972',{title:'Sagan, C. & Mullen, G. (1972). Earth and Mars: evolution of atmospheres and surface temperatures. Science 177, 52–56.'});
SOURCE('a8-kivelson-2000',{title:'Kivelson, M. G. et al. (2000). Galileo magnetometer measurements: a stronger case for a subsurface ocean at Europa. Science 289, 1340–1343.'});
SOURCE('a8-iess-2012',{title:'Iess, L. et al. (2012). The tides of Titan. Science 337, 457–459.'});
SOURCE('a8-hendrix-2019',{title:'Hendrix, A. R. et al. (2019). The NASA roadmap to ocean worlds. Astrobiology 19, 1–27.'});
SOURCE('a8-porco-2006',{title:'Porco, C. C. et al. (2006). Cassini observes the active south pole of Enceladus. Science 311, 1393–1401.'});
SOURCE('a8-hsu-2015',{title:'Hsu, H.-W. et al. (2015). Ongoing hydrothermal activities within Enceladus. Nature 519, 207–210.'});
SOURCE('a8-waite-2017',{title:'Waite, J. H. et al. (2017). Cassini finds molecular hydrogen in the Enceladus plume: evidence for hydrothermal processes. Science 356, 155–159.'});
SOURCE('a8-postberg-2023',{title:'Postberg, F. et al. (2023). Detection of phosphates originating from Enceladus’s ocean. Nature 618, 489–493.'});
SOURCE('a8-peale-1979',{title:'Peale, S. J., Cassen, P. & Reynolds, R. T. (1979). Melting of Io by tidal dissipation. Science 203, 892–894.'});
SOURCE('a8-green-2021',{title:'Green, J. et al. (2021). Call for a framework for reporting evidence for life beyond Earth. Nature 598, 575–579.'});
SOURCE('a8-levin-1976',{title:'Levin, G. V. & Straat, P. A. (1976). Viking labeled release biology experiment: interim results. Science 194, 1322–1329.'});
SOURCE('a8-mckay-1996',{title:'McKay, D. S. et al. (1996). Search for past life on Mars: possible relic biogenic activity in Martian meteorite ALH84001. Science 273, 924–930.'});
SOURCE('a8-greaves-2021',{title:'Greaves, J. S. et al. (2021). Phosphine gas in the cloud decks of Venus. Nature Astronomy 5, 655–664.'});
SOURCE('a8-madhusudhan-2025',{title:'Madhusudhan, N. et al. (2025). New constraints on DMS and DMDS in the atmosphere of K2-18 b from JWST MIRI. Astrophysical Journal Letters 983, L40.'});
SOURCE('a8-lovelock-1965',{title:'Lovelock, J. E. (1965). A physical basis for life detection experiments. Nature 207, 568–570.'});
SOURCE('a8-luger-2015',{title:'Luger, R. & Barnes, R. (2015). Extreme water loss and abiotic O₂ buildup on planets throughout the habitable zones of M dwarfs. Astrobiology 15, 119–143.'});
SOURCE('a8-meadows-2018',{title:'Meadows, V. S. et al. (2018). Exoplanet biosignatures: understanding oxygen as a biosignature in the context of its environment. Astrobiology 18, 630–662.'});
SOURCE('a8-joyce-1994',{title:'Joyce, G. F. (1994). Foreword. In Deamer, D. W. & Fleischaker, G. R. (eds), Origins of Life: The Central Concepts. Jones & Bartlett.'});
SOURCE('a8-maturana-1980',{title:'Maturana, H. R. & Varela, F. J. (1980). Autopoiesis and Cognition: The Realization of the Living. Reidel.'});
SOURCE('a8-cleland-2019',{title:'Cleland, C. E. (2019). The Quest for a Universal Theory of Life: Searching for Life As We Don’t Know It. Cambridge University Press.'});
SOURCE('a8-trifonov-2011',{title:'Trifonov, E. N. (2011). Vocabulary of definitions of life suggests a definition. Journal of Biomolecular Structure and Dynamics 29, 259–266.'});
SOURCE('a8-physics',{title:'Physics In Motion: a sister course.',url:'https://physics-in-motion.puter.site/',note:'Its heat and light lessons cover the energy balance and spectra used here.'});
SOURCE('a8-future',{title:'The Future In Motion: a sister course.',url:'https://the-future-in-motion.puter.site/',note:'Looks ahead at space telescopes and missions.'});

LESSON({id:'habitable-zone',name:'Habitable zones',short:'Habitable zone',stage:'elsewhere',year:'1959–today',level:'Core',
 why:'Where liquid water can last sets where astronomers look first, but a planet in the zone still needs the right size, atmosphere and star.',
 prior:['hadean-earth'],references:['a8-kasting-1993','a8-kopparapu-2013','a8-anglada-2016','a8-gillon-2017','a8-sagan-1972','a8-physics'],
 ids:['habitable-zone','habitable-zone-worlds','habitable-zone-greenhouse']});
LESSON({id:'icy-moons',name:'Icy moons',short:'Icy moons',stage:'elsewhere',year:'1979–today',level:'Core',
 why:'Tides keep oceans liquid under the ice of moons far from the Sun; Enceladus even sprays its ocean into space for us to sample.',
 prior:['hydrothermal-vents','habitable-zone'],references:['a8-kivelson-2000','a8-iess-2012','a8-hendrix-2019','a8-porco-2006','a8-hsu-2015','a8-waite-2017','a8-postberg-2023','a8-peale-1979'],
 ids:['icy-moons','icy-moons-plume','icy-moons-tides']});
LESSON({id:'biosignatures',name:'Biosignatures',short:'Biosignatures',stage:'elsewhere',year:'1965–today',level:'Advanced',
 why:'Every claim of life beyond Earth so far has faltered; judging the next one needs a ladder of tests and a clear sense of how surprising a signal really is.',
 prior:['habitable-zone','icy-moons'],references:['a8-green-2021','a8-levin-1976','a8-mckay-1996','a8-greaves-2021','a8-madhusudhan-2025','a8-lovelock-1965','a8-luger-2015','a8-meadows-2018','a8-future'],
 ids:['biosignatures','biosignatures-disequilibrium','biosignatures-significance']});
LESSON({id:'defining-life',name:'Defining life',short:'Defining life',stage:'elsewhere',year:'1944–today',level:'Advanced',
 why:'To recognise life elsewhere, or to know when chemistry has become biology, we need to say what life is; with one example to go on, that is still open.',
 prior:['luca','viruses-origins'],references:['a8-joyce-1994','a8-maturana-1980','a8-cleland-2019','a8-trifonov-2011'],
 ids:['defining-life','defining-life-checklist','defining-life-why']});

THREAD({id:'a8-water',name:'Water and energy',ids:['hadean-earth','habitable-zone','icy-moons','icy-moons-tides']});
THREAD({id:'a8-vents-elsewhere',name:'Vents beyond Earth',ids:['hydrothermal-vents','icy-moons-plume']});
THREAD({id:'a8-claims',name:'Extraordinary claims',ids:['oldest-evidence','biosignatures','biosignatures-significance']});
THREAD({id:'a8-what-is-alive',name:'What counts as alive?',ids:['viruses-origins','defining-life','defining-life-checklist','defining-life-why']});
