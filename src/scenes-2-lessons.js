/* Physics era 2 · Forces and gravity: lessons, sources, connections. */
SOURCE('p2-principia',{title:'Isaac Newton (1687). Philosophiæ Naturalis Principia Mathematica',url:'https://en.wikipedia.org/wiki/Philosophi%C3%A6_Naturalis_Principia_Mathematica'});
SOURCE('p2-system-world',{title:'Isaac Newton (1728). A Treatise of the System of the World (the cannon thought experiment)',url:'https://en.wikipedia.org/wiki/Newton%27s_cannonball'});
SOURCE('p2-stukeley',{title:'William Stukeley (1752). Memoirs of Sir Isaac Newton’s Life (the apple anecdote)',url:'https://en.wikipedia.org/wiki/Isaac_Newton%27s_apple_tree'});
SOURCE('p2-amontons',{title:'Guillaume Amontons (1699). De la résistance causée dans les machines',url:'https://en.wikipedia.org/wiki/Friction#History'});
SOURCE('p2-coulomb-friction',{title:'Charles-Augustin de Coulomb (1785). Théorie des machines simples'});
SOURCE('p2-bowden-tabor',{title:'F. P. Bowden & D. Tabor (1950). The Friction and Lubrication of Solids. Oxford University Press'});
SOURCE('p2-huygens',{title:'Christiaan Huygens (1673). Horologium Oscillatorium (centripetal acceleration)',url:'https://en.wikipedia.org/wiki/Horologium_Oscillatorium'});
SOURCE('p2-cavendish',{title:'Henry Cavendish (1798). Experiments to determine the density of the Earth. Philosophical Transactions 88, 469–526',url:'https://doi.org/10.1098/rstl.1798.0022'});
SOURCE('p2-kepler-nova',{title:'Johannes Kepler (1609). Astronomia Nova',url:'https://en.wikipedia.org/wiki/Astronomia_nova'});
SOURCE('p2-kepler-harmonices',{title:'Johannes Kepler (1619). Harmonices Mundi',url:'https://en.wikipedia.org/wiki/Harmonices_Mundi'});
SOURCE('p2-nasa-facts',{title:'NASA Goddard: Planetary Fact Sheets',url:'https://nssdc.gsfc.nasa.gov/planetary/factsheet/'});
SOURCE('p2-archimedes',{title:'Archimedes (c. 250 BCE). On Floating Bodies',url:'https://en.wikipedia.org/wiki/On_Floating_Bodies'});
SOURCE('p2-vitruvius',{title:'Vitruvius (c. 15 BCE). De architectura, Book IX (the crown story)',url:'https://en.wikipedia.org/wiki/Eureka_(word)'});
SOURCE('p2-torricelli',{title:'Evangelista Torricelli (1644). Letter to Michelangelo Ricci on the barometer',url:'https://en.wikipedia.org/wiki/Barometer#History'});
SOURCE('p2-pascal',{title:'Blaise Pascal (1663). Traités de l’équilibre des liqueurs et de la pesanteur de la masse de l’air',url:'https://en.wikipedia.org/wiki/Pascal%27s_law'});

LESSON({id:'newton-laws',name:'Newton’s laws of motion',short:'Newton’s laws',stage:'forces',year:'1687',level:'Introduction',
 why:'Three laws turn every question about motion into one about forces.',
 prior:['position-speed','acceleration','galileo-ramp'],references:['p2-principia'],ids:['newton-laws','newton-laws-fma','newton-laws-pairs']});
LESSON({id:'friction',name:'Friction',short:'Friction',stage:'forces',year:'1699–1785',level:'Introduction',
 why:'The force that makes the first law hard to see in everyday life, and that lets us walk, brake and grip.',
 prior:['newton-laws'],references:['p2-amontons','p2-coulomb-friction','p2-bowden-tabor'],ids:['friction','friction-graph','friction-area']});
LESSON({id:'circular-motion',name:'Moving in circles',short:'Circles',stage:'forces',year:'1673',level:'Core',
 why:'Turning needs an inward force; understanding it is the step from falling apples to orbiting moons.',
 prior:['newton-laws','acceleration'],references:['p2-huygens','p2-principia'],ids:['circular-motion','circular-motion-banked','circular-motion-loop']});
LESSON({id:'gravitation',name:'Universal gravitation',short:'Gravitation',stage:'forces',year:'1687–1798',level:'Core',
 why:'One law for the apple and the Moon, and a laboratory experiment that weighed the Earth.',
 prior:['circular-motion','free-fall'],references:['p2-principia','p2-stukeley','p2-cavendish','p2-nasa-facts'],ids:['gravitation','gravitation-cavendish','gravitation-weight']});
LESSON({id:'kepler-orbits',name:'Orbits and Kepler’s laws',short:'Orbits',stage:'forces',year:'1609–1687',level:'Core',
 why:'Kepler found the rules in Brahe’s data; Newton showed they follow from gravity.',
 prior:['gravitation','projectiles'],references:['p2-kepler-nova','p2-kepler-harmonices','p2-system-world','p2-nasa-facts'],ids:['kepler-orbits','kepler-orbits-areas','kepler-orbits-third']});
LESSON({id:'fluids',name:'Pressure and buoyancy',short:'Fluids',stage:'forces',year:'c. 250 BCE–1663',level:'Introduction',
 why:'Forces spread through liquids and air: why ships float, divers feel pressure and a small push can lift a car.',
 prior:['newton-laws','gravitation'],references:['p2-archimedes','p2-vitruvius','p2-torricelli','p2-pascal'],ids:['fluids','fluids-pressure','fluids-hydraulic']});

THREAD({id:'p2-inverse-square',name:'Inverse-square laws',ids:['gravitation','electric-charge']});
THREAD({id:'p2-third-law-momentum',name:'From action–reaction to momentum',ids:['newton-laws-pairs','momentum','collisions']});
THREAD({id:'p2-orbits',name:'Orbits from Newton to Einstein',ids:['kepler-orbits','kepler-orbits-areas','general-relativity']});
THREAD({id:'p2-free-fall-orbit',name:'Falling, from ramps to orbits',ids:['free-fall','projectiles','kepler-orbits']});
