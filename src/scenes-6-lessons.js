/* Physics era 6 · Electricity and magnetism: lessons, sources and cross-era connections. */
SOURCE('p6-gilbert',{title:'William Gilbert (1600). De Magnete.',url:'https://en.wikipedia.org/wiki/De_Magnete'});
SOURCE('p6-franklin',{title:'Benjamin Franklin (1751). Experiments and Observations on Electricity.'});
SOURCE('p6-coulomb',{title:'C.-A. de Coulomb (1785). Premier mémoire sur l’électricité et le magnétisme. Histoire de l’Académie Royale des Sciences.',url:'https://en.wikipedia.org/wiki/Coulomb%27s_law'});
SOURCE('p6-faraday-er',{title:'Michael Faraday (1839–1855). Experimental Researches in Electricity, 3 vols.',url:'https://www.gutenberg.org/ebooks/14986'});
SOURCE('p6-faraday-1832',{title:'Michael Faraday (1832). Experimental researches in electricity. Philosophical Transactions of the Royal Society 122, 125–162.'});
SOURCE('p6-volta',{title:'Alessandro Volta (1800). On the electricity excited by the mere contact of conducting substances of different kinds. Philosophical Transactions of the Royal Society 90.',url:'https://en.wikipedia.org/wiki/Voltaic_pile'});
SOURCE('p6-ohm',{title:'Georg Simon Ohm (1827). Die galvanische Kette, mathematisch bearbeitet.',url:'https://en.wikipedia.org/wiki/Ohm%27s_law'});
SOURCE('p6-kirchhoff',{title:'Gustav Kirchhoff (1845). Ueber den Durchgang eines elektrischen Stromes durch eine Ebene. Annalen der Physik.'});
SOURCE('p6-oersted',{title:'H. C. Ørsted (1820). Experimenta circa effectum conflictus electrici in acum magneticam.',url:'https://en.wikipedia.org/wiki/Hans_Christian_%C3%98rsted'});
SOURCE('p6-ampere',{title:'André-Marie Ampère (1826). Théorie des phénomènes électro-dynamiques, uniquement déduite de l’expérience.'});
SOURCE('p6-bipm',{title:'BIPM (2019). The International System of Units (SI Brochure), 9th edition.',url:'https://www.bipm.org/en/publications/si-brochure'});
SOURCE('p6-lenz',{title:'Emil Lenz (1834). On the direction of induced currents. Annalen der Physik.',url:'https://en.wikipedia.org/wiki/Lenz%27s_law'});
SOURCE('p6-maxwell',{title:'J. C. Maxwell (1865). A dynamical theory of the electromagnetic field. Philosophical Transactions of the Royal Society 155, 459–512.',url:'https://en.wikipedia.org/wiki/A_Dynamical_Theory_of_the_Electromagnetic_Field'});
SOURCE('p6-hertz',{title:'Heinrich Hertz (1893). Electric Waves, translated by D. E. Jones.',url:'https://archive.org/details/electricwavesbei00hert'});
SOURCE('p6-feynman',{title:'Feynman, Leighton & Sands (1964). The Feynman Lectures on Physics, Volume II.',url:'https://www.feynmanlectures.caltech.edu/II_toc.html'});
SOURCE('p6-purcell',{title:'Purcell & Morin (2013). Electricity and Magnetism, 3rd edition. Cambridge University Press.'});

LESSON({id:'electric-charge',name:'Electric charge',short:'Charge',stage:'fields',year:'1600–1785',level:'Introduction',
 why:'Everything electrical starts with two kinds of charge that are moved, never made, and a force that falls off as the square of distance.',
 prior:['newton-laws'],references:['p6-gilbert','p6-franklin','p6-coulomb','p6-purcell'],
 ids:['electric-charge','electric-charge-induction','electric-charge-coulomb']});
LESSON({id:'electric-field',name:'Fields and potential',short:'Fields',stage:'fields',year:'1830s–1850s',level:'Core',
 why:'Faraday’s idea that charges fill space with a field, and that each point has an energy per charge, turns action at a distance into something you can draw.',
 prior:['electric-charge','gravitation'],references:['p6-faraday-er','p6-feynman','p6-purcell'],
 ids:['electric-field','electric-field-potential','electric-field-cage']});
LESSON({id:'circuits',name:'Circuits and Ohm’s law',short:'Circuits',stage:'fields',year:'1800–1845',level:'Introduction',
 why:'Volta’s pile gave the first steady current; Ohm and Kirchhoff turned circuits into something you can calculate.',
 prior:['electric-field','work-energy'],references:['p6-volta','p6-ohm','p6-kirchhoff'],
 ids:['circuits','circuits-ohm','circuits-series-parallel']});
LESSON({id:'magnetism',name:'Magnetism and currents',short:'Magnetism',stage:'fields',year:'1600–1826',level:'Core',
 why:'Ørsted’s twitching compass showed that currents make magnetic fields, joining two subjects that had been studied apart for centuries.',
 prior:['circuits'],references:['p6-gilbert','p6-oersted','p6-ampere','p6-bipm'],
 ids:['magnetism','magnetism-oersted','magnetism-wire-coil','magnetism-ampere']});
LESSON({id:'induction',name:'Electromagnetic induction',short:'Induction',stage:'fields',year:'1831',level:'Core',
 why:'Faraday found the reverse: a changing magnetic field makes a current. Every generator and transformer depends on it.',
 prior:['magnetism','energy-conservation'],references:['p6-faraday-1832','p6-lenz','p6-feynman'],
 ids:['induction','induction-generator','induction-transformer']});
LESSON({id:'electromagnetic-waves',name:'Electromagnetic waves',short:'EM waves',stage:'fields',year:'1865–1888',level:'Advanced',
 why:'Maxwell’s equations predicted self-sustaining waves at the speed of light; Hertz made and detected them, and light joined electricity and magnetism.',
 prior:['induction','wave-basics','speed-of-light'],references:['p6-maxwell','p6-hertz','p6-feynman'],
 ids:['electromagnetic-waves','electromagnetic-waves-maxwell','electromagnetic-waves-hertz','electromagnetic-waves-spectrum']});

THREAD({id:'inverse-square',name:'Inverse-square laws',ids:['gravitation','electric-charge-coulomb','electric-field']});
THREAD({id:'speed-of-light-thread',name:'Measuring the speed of light',ids:['speed-of-light','electromagnetic-waves-maxwell','electromagnetic-waves-hertz','special-relativity']});
THREAD({id:'fields-to-quanta',name:'From waves to photons',ids:['electromagnetic-waves-spectrum','photoelectric-effect','atomic-spectra']});
THREAD({id:'conservation-in-circuits',name:'Energy changes form',ids:['energy-conservation','circuits','induction-generator','heat-engines']});
