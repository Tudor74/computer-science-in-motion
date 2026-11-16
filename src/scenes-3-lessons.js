/* Physics era 3 · Energy and momentum: lessons, sources and connections. */
SOURCE('p3-coriolis',{title:'Gaspard-Gustave Coriolis (1829). Du calcul de l’effet des machines',url:'https://en.wikipedia.org/wiki/Work_(physics)'});
SOURCE('p3-chatelet',{title:'Émilie du Châtelet (1740). Institutions de physique',url:'https://en.wikipedia.org/wiki/%C3%89milie_du_Ch%C3%A2telet'});
SOURCE('p3-leibniz',{title:'G. W. Leibniz (1686). Brevis demonstratio erroris memorabilis Cartesii. Acta Eruditorum',url:'https://en.wikipedia.org/wiki/Vis_viva'});
SOURCE('p3-watt',{title:'James Watt and the horsepower (c. 1782)',url:'https://en.wikipedia.org/wiki/Horsepower'});
SOURCE('p3-helmholtz',{title:'Hermann von Helmholtz (1847). Über die Erhaltung der Kraft',url:'https://en.wikipedia.org/wiki/Conservation_of_energy'});
SOURCE('p3-joule',{title:'James Prescott Joule (1850). On the mechanical equivalent of heat. Philosophical Transactions of the Royal Society 140: 61–82',url:'https://doi.org/10.1098/rstl.1850.0004'});
SOURCE('p3-sankey',{title:'Matthew Sankey (1898) and the Sankey diagram',url:'https://en.wikipedia.org/wiki/Sankey_diagram'});
SOURCE('p3-newton',{title:'Isaac Newton (1687). Philosophiæ Naturalis Principia Mathematica',url:'https://en.wikipedia.org/wiki/Philosophi%C3%A6_Naturalis_Principia_Mathematica'});
SOURCE('p3-tsiolkovsky',{title:'Konstantin Tsiolkovsky (1903). Exploration of outer space by means of rocket devices',url:'https://en.wikipedia.org/wiki/Tsiolkovsky_rocket_equation'});
SOURCE('p3-collisions',{title:'Wallis, Wren and Huygens (1668–69): the laws of collision for the Royal Society',url:'https://en.wikipedia.org/wiki/Momentum'});
SOURCE('p3-hooke',{title:'Robert Hooke (1678). Lectures de potentia restitutiva, or of spring',url:'https://en.wikipedia.org/wiki/Hooke%27s_law'});
SOURCE('p3-huygens',{title:'Christiaan Huygens (1673). Horologium oscillatorium',url:'https://en.wikipedia.org/wiki/Horologium_Oscillatorium'});
SOURCE('p3-archimedes',{title:'Archimedes (c. 250 BCE). On the equilibrium of planes',url:'https://en.wikipedia.org/wiki/On_the_Equilibrium_of_Planes'});
SOURCE('p3-euler',{title:'Leonhard Euler (1765). Theoria motus corporum solidorum seu rigidorum',url:'https://en.wikipedia.org/wiki/Moment_of_inertia'});
SOURCE('p3-noether',{title:'Emmy Noether (1918). Invariante Variationsprobleme. Nachrichten von der Gesellschaft der Wissenschaften zu Göttingen, 235–257',url:'https://en.wikipedia.org/wiki/Noether%27s_theorem'});
SOURCE('p3-kepler',{title:'Johannes Kepler (1609). Astronomia nova',url:'https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion'});

LESSON({id:'work-energy',name:'Work, energy and power',short:'Work & energy',stage:'energy',year:'1700s–1820s',why:'Work measures how a force transfers energy; kinetic energy and power follow from it.',prior:['newton-laws','acceleration'],level:'Introduction',references:['p3-coriolis','p3-chatelet','p3-leibniz','p3-watt'],ids:['work-energy','work-energy-kinetic','work-energy-power']});
LESSON({id:'energy-conservation',name:'Conservation of energy',short:'Energy',stage:'energy',year:'1840s',why:'Energy changes form but the total never changes, and Joule measured the exchange rate between work and heat.',prior:['work-energy'],level:'Core',references:['p3-helmholtz','p3-joule','p3-sankey'],ids:['energy-conservation','energy-conservation-joule','energy-conservation-sankey']});
LESSON({id:'momentum',name:'Momentum and impulse',short:'Momentum',stage:'energy',year:'1687',why:'Momentum is what a force must change; spreading that change over time makes the force smaller.',prior:['newton-laws'],level:'Core',references:['p3-newton','p3-tsiolkovsky'],ids:['momentum','momentum-impulse','momentum-rocket']});
LESSON({id:'collisions',name:'Collisions',short:'Collisions',stage:'energy',year:'1668–1687',why:'Momentum survives every collision; kinetic energy survives only the perfectly elastic ones.',prior:['momentum','energy-conservation'],level:'Core',references:['p3-collisions','p3-newton'],ids:['collisions','collisions-2d','collisions-restitution','collisions-cradle']});
LESSON({id:'oscillations',name:'Oscillations',short:'Oscillations',stage:'energy',year:'1656–1678',why:'A restoring force proportional to displacement gives the same sine-wave motion everywhere, from springs to pendulum clocks.',prior:['newton-laws','energy-conservation'],level:'Core',references:['p3-hooke','p3-huygens'],ids:['oscillations','oscillations-circle','oscillations-pendulum','oscillations-huygens']});
LESSON({id:'rotation',name:'Rotation',short:'Rotation',stage:'energy',year:'c. 250 BCE–1765',why:'Torque, moment of inertia and angular momentum are the turning versions of force, mass and momentum.',prior:['momentum','circular-motion'],level:'Core',references:['p3-archimedes','p3-euler','p3-kepler'],ids:['rotation','rotation-rolling-race','rotation-skater']});
LESSON({id:'symmetry-conservation',name:'Symmetry and conservation',short:'Noether',stage:'energy',year:'1918',why:'Emmy Noether showed why energy and momentum are conserved: each conservation law comes from a symmetry of nature.',prior:['energy-conservation','momentum','rotation'],level:'Advanced',references:['p3-noether','p3-kepler'],ids:['symmetry-conservation','symmetry-conservation-rotation','symmetry-conservation-noether']});

THREAD({id:'p3-swing',name:'Things that swing',ids:['energy-conservation','oscillations-pendulum','oscillations-huygens','resonance']});
THREAD({id:'p3-conserved',name:'What is conserved, and why',ids:['energy-conservation','collisions','rotation-skater','symmetry-conservation']});
THREAD({id:'p3-heat',name:'Energy becomes heat',ids:['energy-conservation-joule','temperature-heat','heat-engines','entropy']});
THREAD({id:'p3-orbits',name:'Equal areas in equal times',ids:['kepler-orbits','symmetry-conservation-rotation','rotation-skater']});
THREAD({id:'p3-sine',name:'The same sine wave',ids:['oscillations-circle','oscillations','wave-basics','sound']});
