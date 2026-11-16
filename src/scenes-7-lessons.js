/* Era 7 · Heat and matter: lessons, sources and connections. */
SOURCE('black-1803',{title:'Black, J. (1803). Lectures on the Elements of Chemistry (ed. J. Robison). Edinburgh'});
SOURCE('rumford-1798',{title:'Rumford, Count (1798). An experimental enquiry concerning the source of the heat which is excited by friction. Philosophical Transactions 88',url:'https://doi.org/10.1098/rstl.1798.0006'});
SOURCE('joule-1850',{title:'Joule, J. P. (1850). On the mechanical equivalent of heat. Philosophical Transactions 140',url:'https://doi.org/10.1098/rstl.1850.0004'});
SOURCE('fourier-1822',{title:'Fourier, J. (1822). Théorie analytique de la chaleur. Paris'});
SOURCE('stefan-boltzmann',{title:'Stefan–Boltzmann law (Wikipedia)',url:'https://en.wikipedia.org/wiki/Stefan%E2%80%93Boltzmann_law'});
SOURCE('maxwell-1860',{title:'Maxwell, J. C. (1860). Illustrations of the dynamical theory of gases. Philosophical Magazine 19 and 20'});
SOURCE('kinetic-theory-wiki',{title:'Kinetic theory of gases (Wikipedia)',url:'https://en.wikipedia.org/wiki/Kinetic_theory_of_gases'});
SOURCE('boyle-1662',{title:'Boyle, R. (1662). A Defence of the Doctrine Touching the Spring and Weight of the Air. Oxford'});
SOURCE('gay-lussac-1802',{title:'Gay-Lussac, J. L. (1802). Recherches sur la dilatation des gaz et des vapeurs. Annales de Chimie 43'});
SOURCE('kelvin-1848',{title:'Thomson, W. (1848). On an absolute thermometric scale. Philosophical Magazine 33'});
SOURCE('brown-1828',{title:'Brown, R. (1828). A brief account of microscopical observations made in the months of June, July and August 1827, on the particles contained in the pollen of plants. Philosophical Magazine 4'});
SOURCE('einstein-1905-bm',{title:'Einstein, A. (1905). Über die von der molekularkinetischen Theorie der Wärme geforderte Bewegung von in ruhenden Flüssigkeiten suspendierten Teilchen. Annalen der Physik 17',url:'https://doi.org/10.1002/andp.19053220806'});
SOURCE('perrin-1909',{title:'Perrin, J. (1909). Mouvement brownien et réalité moléculaire. Annales de Chimie et de Physique 18'});
SOURCE('brownian-wiki',{title:'Brownian motion (Wikipedia)',url:'https://en.wikipedia.org/wiki/Brownian_motion'});
SOURCE('clausius-1865',{title:'Clausius, R. (1865). Über verschiedene für die Anwendung bequeme Formen der Hauptgleichungen der mechanischen Wärmetheorie. Annalen der Physik 201',url:'https://doi.org/10.1002/andp.18652010702'});
SOURCE('boltzmann-1877',{title:'Boltzmann, L. (1877). Über die Beziehung zwischen dem zweiten Hauptsatze der mechanischen Wärmetheorie und der Wahrscheinlichkeitsrechnung. Wiener Berichte 76'});
SOURCE('landauer-1961',{title:'Landauer, R. (1961). Irreversibility and heat generation in the computing process. IBM Journal of Research and Development 5(3)',url:'https://doi.org/10.1147/rd.53.0183'});
SOURCE('bennett-1982',{title:'Bennett, C. H. (1982). The thermodynamics of computation — a review. International Journal of Theoretical Physics 21',url:'https://doi.org/10.1007/BF02084158'});
SOURCE('entropy-wiki',{title:'Entropy (statistical thermodynamics) (Wikipedia)',url:'https://en.wikipedia.org/wiki/Entropy_(statistical_thermodynamics)'});
SOURCE('carnot-1824',{title:'Carnot, S. (1824). Réflexions sur la puissance motrice du feu. Paris'});
SOURCE('carnot-wiki',{title:'Carnot cycle (Wikipedia)',url:'https://en.wikipedia.org/wiki/Carnot_cycle'});
SOURCE('kelvin-1852',{title:'Thomson, W. (1852). On the economy of the heating or cooling of buildings by means of currents of air. Proceedings of the Philosophical Society of Glasgow 3'});
SOURCE('phase-diagram-wiki',{title:'Phase diagram (Wikipedia)',url:'https://en.wikipedia.org/wiki/Phase_diagram'});
SOURCE('latent-heat-wiki',{title:'Latent heat (Wikipedia)',url:'https://en.wikipedia.org/wiki/Latent_heat'});

LESSON({id:'temperature-heat',name:'Temperature and heat',short:'Temperature',stage:'heat',year:'1760s–1840s',why:'Separate how hot something is from how much heat it holds, then follow heat as it flows, spreads and travels, and see why it turned out to be motion rather than a fluid.',prior:['energy-conservation','work-energy'],level:'Introduction',references:['black-1803','rumford-1798','joule-1850','fourier-1822','stefan-boltzmann'],ids:['temperature-heat','temperature-heat-equilibrium','temperature-heat-modes','temperature-heat-rumford']});
LESSON({id:'kinetic-theory',name:'Kinetic theory of gases',short:'Kinetic theory',stage:'heat',year:'1738–1860',why:'Picture a gas as particles in motion, and pressure, temperature and the gas laws follow from counting their collisions.',prior:['temperature-heat','momentum','newton-laws'],level:'Core',references:['maxwell-1860','kinetic-theory-wiki','boyle-1662','gay-lussac-1802','kelvin-1848'],ids:['kinetic-theory','kinetic-theory-distribution','kinetic-theory-gas-laws']});
LESSON({id:'brownian-motion',name:'Brownian motion',short:'Brownian',stage:'heat',year:'1827–1909',why:'A jiggling pollen grain turned out to be the first direct evidence that atoms are real, and a way to count them.',prior:['kinetic-theory'],level:'Core',references:['brown-1828','einstein-1905-bm','perrin-1909','brownian-wiki'],ids:['brownian-motion','brownian-motion-walk','brownian-motion-perrin']});
LESSON({id:'entropy',name:'Entropy and the arrow of time',short:'Entropy',stage:'heat',year:'1865–1877',why:'Count the ways particles can be arranged and the second law of thermodynamics, and the one-way direction of time, follow.',prior:['kinetic-theory','brownian-motion'],level:'Advanced',references:['clausius-1865','boltzmann-1877','entropy-wiki','landauer-1961','bennett-1982'],ids:['entropy','entropy-mixing','entropy-arrow','entropy-demon']});
LESSON({id:'heat-engines',name:'Heat engines',short:'Heat engines',stage:'heat',year:'1824–1852',why:'Turning heat into work has a hard ceiling set only by temperatures, which explains power stations, car engines and heat pumps.',prior:['entropy','work-energy'],level:'Core',references:['carnot-1824','carnot-wiki','kelvin-1852'],ids:['heat-engines','heat-engines-limit','heat-engines-heat-pump']});
LESSON({id:'phase-changes',name:'Changes of phase',short:'Phase changes',stage:'heat',year:'1761–1850',why:'Melting, boiling and evaporating absorb heat without changing temperature, and the boiling point shifts with pressure.',prior:['temperature-heat','kinetic-theory'],level:'Core',references:['black-1803','latent-heat-wiki','phase-diagram-wiki'],ids:['phase-changes','phase-changes-diagram','phase-changes-evaporation']});

THREAD({id:'p7-atoms-real',name:'Are atoms real?',ids:['kinetic-theory','brownian-motion','brownian-motion-perrin','atomic-nucleus']});
THREAD({id:'p7-energy-flows',name:'Energy is conserved, but it spreads',ids:['energy-conservation','temperature-heat-rumford','entropy','heat-engines']});
THREAD({id:'p7-randomness',name:'Order from randomness',ids:['kinetic-theory-distribution','brownian-motion-walk','entropy-arrow','radioactivity']});
