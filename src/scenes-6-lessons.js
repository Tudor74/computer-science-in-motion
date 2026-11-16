/* Techno era 6 · Styles: lessons, sources and connections. */
SOURCE('x6-butler-2006',{title:'Mark J. Butler (2006). Unlocking the Groove: Rhythm, Meter, and Musical Design in Electronic Dance Music. Indiana University Press.'});
SOURCE('x6-reynolds-1998',{title:'Simon Reynolds (1998). Energy Flash: A Journey Through Rave Music and Dance Culture. Picador.'});
SOURCE('x6-sherburne-2004',{title:'Philip Sherburne (2004). Digital discipline: minimalism in house and techno. In C. Cox & D. Warner (eds), Audio Culture: Readings in Modern Music. Continuum.'});
SOURCE('x6-veal-2007',{title:'Michael E. Veal (2007). Dub: Soundscapes and Shattered Songs in Jamaican Reggae. Wesleyan University Press.'});
SOURCE('x6-klang-2012',{title:'Felix Denk & Sven von Thülen (2012). Der Klang der Familie: Berlin, Techno und die Wende. Suhrkamp.'});
SOURCE('x6-reed-2013',{title:'S. Alexander Reed (2013). Assimilate: A Critical History of Industrial Music. Oxford University Press.'});
SOURCE('x6-808-909-manuals',{title:'Roland Corporation (1980, 1983). TR-808 and TR-909 Owner’s Manuals.',note:'Tune and decay controls of the bass drum.'});
SOURCE('x6-303-manual',{title:'Roland Corporation (1981). TB-303 Bass Line Owner’s Manual.',note:'Accent and slide.'});
SOURCE('x6-reid-2002',{title:'Gordon Reid (2002). Synth Secrets: practical bass drum synthesis. Sound on Sound, February 2002.',url:'https://www.soundonsound.com/techniques/practical-bass-drum-synthesis'});
SOURCE('x6-vine-2011',{title:'Richard Vine (2011). Tadao Kikumoto invents the Roland TB-303. The Guardian, 15 June 2011.',url:'https://www.theguardian.com/music/2011/jun/15/tadao-kikumoto-roland'});
SOURCE('x6-moog-1965',{title:'Robert A. Moog (1965). Voltage-controlled electronic music modules. Journal of the Audio Engineering Society 13(3), 200–206.'});
SOURCE('x6-smith-2007',{title:'Julius O. Smith (2007). Introduction to Digital Filters with Audio Applications. W3K Publishing.',url:'https://ccrma.stanford.edu/~jos/filters/'});
SOURCE('x6-pakarinen-2009',{title:'Jyri Pakarinen & David T. Yeh (2009). A review of digital techniques for modeling vacuum-tube guitar amplifiers. Computer Music Journal 33(2), 85–100.',note:'Clipping and the harmonics it adds.'});
SOURCE('x6-music-in-motion',{title:'Music In Motion: rhythm, swing and harmonics.',url:'https://music-in-motion.puter.site/',note:'Sister course: see it for beat, metre, swing and the harmonic series.'});

LESSON({id:'tempo-and-kick',name:'Tempo and the kick',short:'Tempo and kick',stage:'styles',year:'1990–today',level:'Introduction',
 why:'Most techno styles share one drum pattern. Tempo and the shape of the kick are the first things that tell them apart.',
 prior:['tr-909','step-sequencer'],references:['x6-butler-2006','x6-reynolds-1998','x6-808-909-manuals','x6-reid-2002','x6-sherburne-2004'],
 ids:['tempo-and-kick','tempo-and-kick-shape','tempo-and-kick-morph']});
LESSON({id:'acid',name:'Acid',short:'Acid',stage:'styles',year:'1987–today',level:'Core',
 why:'A bass machine’s filter turned a repeating line into a lead voice, and playing the filter became the performance.',
 prior:['tb-303','tempo-and-kick'],references:['x6-vine-2011','x6-303-manual','x6-reynolds-1998','x6-moog-1965','x6-smith-2007','x6-butler-2006'],
 ids:['acid','acid-filter','acid-accent-slide']});
LESSON({id:'dub-techno',name:'Dub techno',short:'Dub techno',stage:'styles',year:'1993–today',level:'Core',
 why:'One chord, an echo timed to the beat and a slowly moving filter are enough for a whole track, a method borrowed from Jamaican dub.',
 prior:['minimal','acid'],references:['x6-veal-2007','x6-sherburne-2004','x6-klang-2012','x6-butler-2006'],
 ids:['dub-techno','dub-techno-space','dub-techno-roots']});
LESSON({id:'hard-and-industrial',name:'Hard and industrial techno',short:'Hard techno',stage:'styles',year:'1990–today',level:'Core',
 why:'Distortion and speed change what a kick drum is: at 160 BPM and more, an overdriven kick becomes the bassline.',
 prior:['tempo-and-kick','after-rave'],references:['x6-reynolds-1998','x6-reed-2013','x6-pakarinen-2009','x6-klang-2012','x6-music-in-motion'],
 ids:['hard-and-industrial','hard-and-industrial-tempo','hard-and-industrial-lineage']});

THREAD({id:'x6-filter',name:'The filter as an instrument',ids:['tb-303','acid','acid-filter','dub-techno-space','arrangement']});
THREAD({id:'x6-tempo',name:'How fast?',ids:['tempo-and-kick','after-rave','hard-and-industrial-tempo','beatmatching']});
THREAD({id:'x6-echo',name:'Echo and delay',ids:['moroder-sequencer','dub-techno','dub-techno-roots','minimal']});
