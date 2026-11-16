/* Techno era 1 · Roots (1970–1984): lessons, sources and connections. */
SOURCE('x1-bussy',{title:'Bussy, P. (1993). Kraftwerk: Man, Machine and Music. SAF Publishing.'});
SOURCE('x1-schutte',{title:'Schütte, U. (2020). Kraftwerk: Future Music from Germany. Penguin.'});
SOURCE('x1-sicko',{title:'Sicko, D. (1999; 2nd edn 2010). Techno Rebels: The Renegades of Electronic Funk.'});
SOURCE('x1-reynolds',{title:'Reynolds, S. (1998). Energy Flash: A Journey Through Rave Music and Dance Culture. Picador.'});
SOURCE('x1-brewster',{title:'Brewster, B. & Broughton, F. (1999). Last Night a DJ Saved My Life: The History of the Disc Jockey. Headline.'});
SOURCE('x1-lawrence',{title:'Lawrence, T. (2003). Love Saves the Day: A History of American Dance Music Culture, 1970–1979. Duke University Press.'});
SOURCE('x1-butler',{title:'Butler, M. J. (2006). Unlocking the Groove: Rhythm, Meter, and Musical Design in Electronic Dance Music. Indiana University Press.'});
SOURCE('x1-toop',{title:'Toop, D. (1984). The Rap Attack: African Jive to New York Hip Hop. Pluto Press.'});
SOURCE('x1-buskin',{title:'Buskin, R. (2009). Classic Tracks: Donna Summer “I Feel Love”. Sound on Sound.',url:'https://www.soundonsound.com/'});
SOURCE('x1-shapiro',{title:'Shapiro, P. (2005). Turn the Beat Around: The Secret History of Disco. Faber.'});
SOURCE('x1-tompkins',{title:'Tompkins, D. (2010). How to Wreck a Nice Beach: The Vocoder from World War II to Hip-Hop. Stop Smiling Books.'});
SOURCE('x1-dudley',{title:'Dudley, H. (1939). The vocoder. Bell Laboratories Record 18, 122–126.'});
SOURCE('x1-brown',{title:'Brown, D. Jr. (2022). Assembling a Black Counter Culture. Primary Information.'});
SOURCE('x1-salkind',{title:'Salkind, M. (2019). Do You Remember House? Chicago’s Queer of Color Undergrounds. Oxford University Press.'});
SOURCE('x1-danielsen',{title:'Danielsen, A. (ed.) (2010). Musical Rhythm in the Age of Digital Reproduction. Ashgate.'});
SOURCE('x1-music',{title:'Music In Motion: rhythm, synthesis and sequencing from the start.',url:'https://music-in-motion.puter.site/',note:'For what a step sequencer, an oscillator and MIDI are.'});
SOURCE('x1-emim',{title:'Electronic Music In Motion: a companion course on how electronic sound is made.',url:'https://electronic-music-in-motion.puter.site/',note:'For synthesis, filters and effects in depth.'});

LESSON({id:'kraftwerk',name:'Kraftwerk',short:'Kraftwerk',stage:'roots',year:'1970–1981',level:'Introduction',
 why:'Before techno had a name, a German group showed that machines could be the whole band and that their precision could be the feeling.',
 prior:[],references:['x1-bussy','x1-schutte','x1-sicko','x1-toop','x1-butler','x1-danielsen','x1-music'],
 ids:['kraftwerk','kraftwerk-machine-pulse','kraftwerk-influence']});
LESSON({id:'moroder-sequencer',name:'Moroder’s sequencer',short:'Moroder',stage:'roots',year:'1977',level:'Introduction',
 why:'One disco record replaced the band with a sequencer and a synthesiser, and dance music followed.',
 prior:['kraftwerk'],references:['x1-buskin','x1-brewster','x1-lawrence','x1-shapiro','x1-butler','x1-emim'],
 ids:['moroder-sequencer','moroder-sequencer-delay','moroder-sequencer-studio']});
LESSON({id:'electro',name:'Electro',short:'Electro',stage:'roots',year:'1981–1984',level:'Core',
 why:'The 808 drum machine met funk and hip-hop, and a Detroit group used the word “techno” in a title.',
 prior:['kraftwerk'],references:['x1-toop','x1-sicko','x1-brown','x1-reynolds','x1-tompkins','x1-dudley'],
 ids:['electro','electro-cybotron','electro-robot-voice']});
LESSON({id:'chicago-house',name:'Chicago house',short:'Chicago house',stage:'roots',year:'1977–1987',level:'Core',
 why:'Chicago DJs turned disco into drum-machine tracks with a kick on every beat, the skeleton techno kept.',
 prior:['moroder-sequencer','electro'],references:['x1-brewster','x1-lawrence','x1-salkind','x1-reynolds','x1-butler'],
 ids:['chicago-house','chicago-house-warehouse','chicago-house-acid']});

THREAD({id:'x1-machine',name:'Letting the machine sound like a machine',ids:['kraftwerk-machine-pulse','moroder-sequencer','tr-909','step-sequencer','minimal']});
THREAD({id:'x1-atlantic',name:'Across the Atlantic and back',ids:['kraftwerk-influence','electro-cybotron','belleville-three','tresor','acid-house-summer']});
THREAD({id:'x1-303',name:'The acid line',ids:['chicago-house-acid','tb-303','acid-house-summer','acid']});
THREAD({id:'x1-kick',name:'Where the kick falls',ids:['electro','chicago-house','tr-808','tempo-and-kick','beatmatching']});
