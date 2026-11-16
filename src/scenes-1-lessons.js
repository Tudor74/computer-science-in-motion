/* Music era 1 · Sound and number (antiquity): lessons, sources and connections. */
SOURCE('boethius-510',{title:'Boethius (c. 510), De institutione musica (Fundamentals of Music), trans. C. M. Bower, Yale University Press, 1989'});
SOURCE('nicomachus',{title:'Nicomachus of Gerasa (2nd century), Manual of Harmonics, trans. F. R. Levin, Phanes Press, 1994'});
SOURCE('mersenne-1636',{title:'Marin Mersenne (1636), Harmonie universelle',url:'https://en.wikipedia.org/wiki/Harmonie_universelle'});
SOURCE('v-galilei-1589',{title:'Vincenzo Galilei (1589), Discorso intorno all’opere di messer Gioseffo Zarlino — tension and pitch experiments'});
SOURCE('sauveur-1701',{title:'Joseph Sauveur (1701), Système général des intervalles des sons'});
SOURCE('helmholtz-1863',{title:'Hermann von Helmholtz (1863), On the Sensations of Tone (trans. A. J. Ellis, 1875/1885)'});
SOURCE('ellis-1885',{title:'Alexander J. Ellis (1885), On the musical scales of various nations, Journal of the Society of Arts 33'});
SOURCE('barbour-1951',{title:'J. Murray Barbour (1951), Tuning and Temperament: A Historical Survey, Michigan State College Press'});
SOURCE('rossing-2002',{title:'Rossing, Moore & Wheeler (2002), The Science of Sound, 3rd edition, Addison-Wesley'});
SOURCE('iso-7029',{title:'ISO 7029:2017, Acoustics — Statistical distribution of hearing thresholds related to age and gender'});
SOURCE('jacoby-2019',{title:'Jacoby et al. (2019), Universal and non-universal features of musical pitch perception revealed by singing, Current Biology 29(19)',url:'https://doi.org/10.1016/j.cub.2019.07.053'});
SOURCE('plomp-levelt-1965',{title:'Plomp & Levelt (1965), Tonal consonance and critical bandwidth, Journal of the Acoustical Society of America 38(4)',url:'https://doi.org/10.1121/1.1909741'});
SOURCE('mcdermott-2010',{title:'McDermott, Lehr & Oxenham (2010), Individual differences reveal the basis of consonance, Current Biology 20(11)',url:'https://doi.org/10.1016/j.cub.2010.04.019'});
SOURCE('mcdermott-2016',{title:'McDermott, Schultz, Undurraga & Godoy (2016), Indifference to dissonance in native Amazonians reveals cultural variation in music perception, Nature 535',url:'https://doi.org/10.1038/nature18635'});
SOURCE('zarlino-1558',{title:'Gioseffo Zarlino (1558), Le istitutioni harmoniche'});
SOURCE('day-oconnell-2007',{title:'Jeremy Day-O’Connell (2007), Pentatonicism from the Eighteenth Century to Debussy, University of Rochester Press'});
SOURCE('kunst-1949',{title:'Jaap Kunst (1949), Music in Java: Its History, Its Theory and Its Technique, Martinus Nijhoff'});
SOURCE('kubik-1999',{title:'Gerhard Kubik (1999), Africa and the Blues, University Press of Mississippi'});

LESSON({id:'pitch-frequency',name:'Pitch and frequency',short:'Pitch',stage:'number',year:'1636',level:'Introduction',
 why:'Everything else in music rests on one fact: how high a note sounds follows how fast the air vibrates, and doubling the rate gives the same note an octave up.',
 prior:[],references:['mersenne-1636','jacoby-2019','iso-7029','rossing-2002'],ids:['pitch-frequency','pitch-frequency-octave','pitch-frequency-range']});
LESSON({id:'monochord',name:'The monochord',short:'Monochord',stage:'number',year:'c. 500 BCE (legend)',level:'Introduction',
 why:'A single string with a movable bridge turned musical intervals into numbers — the first link between music and mathematics.',
 prior:['pitch-frequency'],references:['boethius-510','nicomachus','v-galilei-1589','mersenne-1636'],ids:['monochord','monochord-ratios','monochord-hammers']});
LESSON({id:'harmonic-series',name:'The harmonic series',short:'Harmonics',stage:'number',year:'1701',level:'Introduction',
 why:'A single plucked string sounds a whole family of frequencies at once; that family shapes intervals, scales and timbre.',
 prior:['monochord'],references:['sauveur-1701','helmholtz-1863','ellis-1885','rossing-2002'],ids:['harmonic-series','harmonic-series-notes','harmonic-series-build']});
LESSON({id:'consonant-ratios',name:'Consonant ratios',short:'Consonance',stage:'number',year:'Antiquity–1965',level:'Core',
 why:'Why do some note pairs blend and others clash? Simple ratios share harmonics and repeat quickly — and listeners’ own judgements add a cultural layer.',
 prior:['monochord','harmonic-series'],references:['helmholtz-1863','plomp-levelt-1965','mcdermott-2010','mcdermott-2016'],ids:['consonant-ratios','consonant-ratios-ladder','consonant-ratios-rate']});
LESSON({id:'pythagorean-tuning',name:'Pythagorean tuning',short:'Pythagorean',stage:'number',year:'Antiquity',level:'Core',
 why:'Building every note from pure fifths almost works — and the small leftover, the comma, drove two thousand years of tuning debate.',
 prior:['monochord','consonant-ratios'],references:['boethius-510','barbour-1951','zarlino-1558'],ids:['pythagorean-tuning','pythagorean-tuning-comma','pythagorean-tuning-thirds']});
LESSON({id:'pentatonic-scales',name:'Pentatonic scales',short:'Pentatonic',stage:'number',year:'Many traditions',level:'Introduction',
 why:'Five notes from stacked fifths give a scale with no semitones, found in many traditions — though not every five-note scale is the same.',
 prior:['pythagorean-tuning'],references:['day-oconnell-2007','kunst-1949','kubik-1999'],ids:['pentatonic-scales','pentatonic-scales-black-keys','pentatonic-scales-traditions']});

THREAD({id:'m1-ratios',name:'Ratios become harmony',ids:['monochord-ratios','consonant-ratios','pythagorean-tuning-comma','temperament']});
THREAD({id:'m1-harmonics',name:'The harmonic series everywhere',ids:['harmonic-series','harmonic-series-build','fourier-timbre','missing-fundamental']});
THREAD({id:'m1-consonance',name:'Is consonance learned?',ids:['consonant-ratios-rate','consonance-roughness','music-emotion']});
