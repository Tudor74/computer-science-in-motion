/* Music era 3 · Harmony (1600–1750): lessons, sources and connections. */
SOURCE('m3-zarlino-1558',{title:'Gioseffo Zarlino (1558), Le istitutioni harmoniche, Venice',url:'https://en.wikipedia.org/wiki/Gioseffo_Zarlino'});
SOURCE('m3-rameau-1722',{title:'Jean-Philippe Rameau (1722), Traité de l’harmonie réduite à ses principes naturels, Paris',url:'https://en.wikipedia.org/wiki/Trait%C3%A9_de_l%27harmonie'});
SOURCE('m3-fux-1725',{title:'Johann Joseph Fux (1725), Gradus ad Parnassum, Vienna; trans. Alfred Mann as The Study of Counterpoint (Norton, 1965)'});
SOURCE('m3-werckmeister-1691',{title:'Andreas Werckmeister (1691), Musicalische Temperatur, Quedlinburg'});
SOURCE('m3-barbour-1951',{title:'J. Murray Barbour (1951), Tuning and Temperament: A Historical Survey, Michigan State College Press'});
SOURCE('m3-lehman-2005',{title:'Bradley Lehman (2005), Bach’s extraordinary temperament: our Rosetta Stone, Early Music 33(1), 3–23 (and the replies that followed in Early Music)',url:'https://doi.org/10.1093/em/cah037'});
SOURCE('m3-ellis-1885',{title:'Alexander J. Ellis (1885), On the musical scales of various nations, Journal of the Society of Arts 33'});
SOURCE('m3-helmholtz-1863',{title:'Hermann von Helmholtz (1863), On the Sensations of Tone (trans. A. J. Ellis)'});
SOURCE('m3-plomp-levelt-1965',{title:'Plomp & Levelt (1965), Tonal consonance and critical bandwidth, JASA 38, 548–560',url:'https://doi.org/10.1121/1.1909741'});
SOURCE('m3-weber-1817',{title:'Gottfried Weber (1817–21), Versuch einer geordneten Theorie der Tonsetzkunst'});
SOURCE('m3-huron-2001',{title:'David Huron (2001), Tone and voice: a derivation of the rules of voice-leading from perceptual principles, Music Perception 19(1), 1–64',url:'https://doi.org/10.1525/mp.2001.19.1.1'});
SOURCE('m3-caplin-1998',{title:'William E. Caplin (1998), Classical Form, Oxford University Press'});
SOURCE('m3-heinichen-1711',{title:'Johann David Heinichen (1711), Neu erfundene und gründliche Anweisung (revised 1728 as Der General-Bass in der Composition)'});
SOURCE('m3-diletsky',{title:'Nikolay Diletsky (c. 1679), Grammatika musikiyskago peniya: an early circle of keys'});
SOURCE('m3-riemann-1893',{title:'Hugo Riemann (1893), Vereinfachte Harmonielehre'});
SOURCE('m3-krumhansl-1990',{title:'Carol L. Krumhansl (1990), Cognitive Foundations of Musical Pitch, Oxford University Press'});
SOURCE('m3-bach-wtc',{title:'J. S. Bach (1722, 1742), Das wohltemperirte Clavier, Books I and II'});

LESSON({id:'intervals',name:'Intervals',short:'Intervals',stage:'harmony',year:'1558',
 why:'Every chord and melody is built from intervals; naming them by letters and semitones, and knowing which blend, is the basis of harmony.',
 prior:['consonant-ratios','pythagorean-tuning'],level:'Introduction',references:['m3-zarlino-1558','m3-helmholtz-1863','m3-plomp-levelt-1965','m3-rameau-1722'],
 ids:['intervals','intervals-consonance','intervals-inversion']});
LESSON({id:'triads-chords',name:'Triads and chords',short:'Triads',stage:'harmony',year:'1558–1722',
 why:'Stacking thirds gives triads and seventh chords; inversions and Roman numerals let you name any chord by its job in a key.',
 prior:['intervals'],level:'Introduction',references:['m3-zarlino-1558','m3-rameau-1722','m3-weber-1817'],
 ids:['triads-chords','triads-chords-inversions','triads-chords-roman']});
LESSON({id:'cadences',name:'Cadences',short:'Cadences',stage:'harmony',year:'1600–1750',
 why:'Cadences are musical punctuation: they tell the listener whether a phrase has ended, paused or been surprised.',
 prior:['triads-chords'],level:'Core',references:['m3-rameau-1722','m3-huron-2001','m3-caplin-1998'],
 ids:['cadences','cadences-voice-leading','cadences-phrase']});
LESSON({id:'counterpoint',name:'Counterpoint',short:'Counterpoint',stage:'harmony',year:'1725',
 why:'Fux’s species counterpoint teaches how to keep several melodies independent yet consonant, a discipline taught for three centuries.',
 prior:['intervals','polyphony','canon-round'],level:'Core',references:['m3-fux-1725','m3-huron-2001'],
 ids:['counterpoint','counterpoint-motion','counterpoint-species']});
LESSON({id:'temperament',name:'Temperament',short:'Temperament',stage:'harmony',year:'1691–1722',
 why:'Pure intervals cannot all fit into twelve notes; each tuning chooses which keys to favour, and the choice changes how music sounds.',
 prior:['pythagorean-tuning','consonant-ratios','intervals'],level:'Core',references:['m3-werckmeister-1691','m3-barbour-1951','m3-ellis-1885','m3-bach-wtc','m3-lehman-2005'],
 ids:['temperament','temperament-cents','temperament-keys']});
LESSON({id:'circle-of-fifths',name:'The circle of fifths',short:'Circle of 5ths',stage:'harmony',year:'1679–1722',
 why:'Arranging keys by fifths shows their key signatures, which keys are close, and the tonic–subdominant–dominant pull that drives tonal harmony.',
 prior:['intervals','triads-chords','cadences'],level:'Core',references:['m3-diletsky','m3-heinichen-1711','m3-rameau-1722','m3-riemann-1893','m3-krumhansl-1990'],
 ids:['circle-of-fifths','circle-of-fifths-distance','circle-of-fifths-function']});

THREAD({id:'m3-pure-or-tempered',name:'Pure or tempered?',ids:['pythagorean-tuning','intervals-consonance','temperament','temperament-keys']});
THREAD({id:'m3-voices-independent',name:'Keeping voices independent',ids:['polyphony','counterpoint','counterpoint-motion','cadences-voice-leading']});
THREAD({id:'m3-home-and-away',name:'Home and away',ids:['cadences','circle-of-fifths-function','circle-of-fifths-distance']});
