/* Physics era 1 · Describing motion (1600s): lessons, sources and connections. */
SOURCE('galileo-1638',{title:'Galileo Galilei (1638), Discourses and Mathematical Demonstrations Relating to Two New Sciences (trans. Crew & de Salvio, 1914)',url:'https://en.wikipedia.org/wiki/Two_New_Sciences'});
SOURCE('galileo-1632',{title:'Galileo Galilei (1632), Dialogue Concerning the Two Chief World Systems',url:'https://en.wikipedia.org/wiki/Dialogue_Concerning_the_Two_Chief_World_Systems'});
SOURCE('settle-1961',{title:'Thomas B. Settle (1961), An experiment in the history of science, Science 133(3445): 19–23',url:'https://doi.org/10.1126/science.133.3445.19'});
SOURCE('drake-1975',{title:'Stillman Drake (1975), The role of music in Galileo’s experiments, Scientific American 232(6)'});
SOURCE('oresme',{title:'Nicole Oresme (c. 1350s), Tractatus de configurationibus qualitatum et motuum; the mean speed theorem of the Oxford Calculators (Merton College)',url:'https://en.wikipedia.org/wiki/Mean_speed_theorem'});
SOURCE('apollo-15',{title:'NASA, The Apollo 15 Hammer–Feather Drop (1971)',url:'https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_15_feather_drop.html'});
SOURCE('pisa-legend',{title:'Galileo’s Leaning Tower of Pisa experiment: the account by Vincenzo Viviani and its doubtful history',url:'https://en.wikipedia.org/wiki/Galileo%27s_Leaning_Tower_of_Pisa_experiment'});
SOURCE('clement-1982',{title:'John Clement (1982), Students’ preconceptions in introductory mechanics, American Journal of Physics 50(1): 66–71',url:'https://doi.org/10.1119/1.12989'});
SOURCE('highway-code',{title:'The Highway Code (UK), rule 126: stopping distances',url:'https://www.gov.uk/guidance/the-highway-code/general-rules-techniques-and-advice-for-all-drivers-and-riders-103-to-158'});
SOURCE('newton-1687-cor1',{title:'Isaac Newton (1687), Philosophiæ Naturalis Principia Mathematica, Laws of Motion, Corollary I (the parallelogram of motions)'});

LESSON({id:'position-speed',name:'Position and speed',short:'Speed',stage:'motion',year:'1600s',level:'Introduction',
 why:'Before asking why things move, Galileo asked how: where something is, how fast it goes, and in which direction.',
 prior:[],references:['galileo-1638'],ids:['position-speed','position-speed-velocity','position-speed-displacement']});
LESSON({id:'acceleration',name:'Acceleration',short:'Acceleration',stage:'motion',year:'1350s–1638',level:'Introduction',
 why:'Most motion speeds up or slows down. Acceleration measures that change, and its graph explains stopping distances and thrown balls.',
 prior:['position-speed'],references:['galileo-1638','oresme','clement-1982','highway-code'],ids:['acceleration','acceleration-sign','acceleration-braking']});
LESSON({id:'galileo-ramp',name:'Galileo’s ramp',short:'Galileo’s ramp',stage:'motion',year:'1604–1638',level:'Core',
 why:'Galileo could not time a fall, so he slowed it down on a ramp and found the law hidden in it: distance grows as time squared.',
 prior:['acceleration'],references:['galileo-1638','settle-1961','drake-1975'],ids:['galileo-ramp','galileo-ramp-bells','galileo-ramp-dilution']});
LESSON({id:'free-fall',name:'Free fall',short:'Free fall',stage:'motion',year:'1638–1971',level:'Introduction',
 why:'Heavy and light things fall together once air is out of the way: an idea argued by Galileo and filmed on the Moon.',
 prior:['galileo-ramp'],references:['galileo-1638','apollo-15','pisa-legend'],ids:['free-fall','free-fall-measure','free-fall-tied']});
LESSON({id:'projectiles',name:'Projectiles',short:'Projectiles',stage:'motion',year:'1638',level:'Core',
 why:'A thrown object does two simple things at once, moving steadily sideways while falling, and the result is a parabola.',
 prior:['free-fall','acceleration'],references:['galileo-1638'],ids:['projectiles','projectiles-range','projectiles-monkey']});
LESSON({id:'relative-motion',name:'Relative motion',short:'Relative motion',stage:'motion',year:'1632',level:'Core',
 why:'Motion only makes sense relative to something. Galileo’s ship showed that steady motion cannot be felt, an idea Einstein later built on.',
 prior:['projectiles'],references:['galileo-1632','newton-1687-cor1'],ids:['relative-motion','relative-motion-river','relative-motion-addition']});

THREAD({id:'p-squared',name:'Squares of time',ids:['galileo-ramp','free-fall','acceleration-braking','projectiles']});
THREAD({id:'p-frames',name:'It depends who is watching',ids:['relative-motion','relative-motion-addition','special-relativity']});
THREAD({id:'p-galileo',name:'Galileo’s experiments',ids:['galileo-ramp-bells','free-fall-tied','relative-motion','free-fall']});
THREAD({id:'p-graphs',name:'Reading motion graphs',ids:['position-speed','acceleration','acceleration-sign']});
