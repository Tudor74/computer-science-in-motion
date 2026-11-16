/* Techno era 2 · Detroit (1985–1994): lessons, sources and connections. */
SOURCE('x2-sicko',{title:'Sicko, D. (1999; 2nd edn 2010). Techno Rebels: The Renegades of Electronic Funk. Wayne State University Press.'});
SOURCE('x2-brown',{title:'Brown, D. Jr. (2022). Assembling a Black Counter Culture. Primary Information.'});
SOURCE('x2-reynolds',{title:'Reynolds, S. (1998). Energy Flash: A Journey Through Rave Music and Dance Culture. Picador.'});
SOURCE('x2-brewster',{title:'Brewster, B. & Broughton, F. (1999). Last Night a DJ Saved My Life: The History of the Disc Jockey. Headline.'});
SOURCE('x2-butler',{title:'Butler, M. J. (2006). Unlocking the Groove: Rhythm, Meter, and Musical Design in Electronic Dance Music. Indiana University Press.'});
SOURCE('x2-toffler',{title:'Toffler, A. (1980). The Third Wave. William Morrow.'});
SOURCE('x2-cosgrove',{title:'Cosgrove, S. (1988). Seventh City Techno. The Face, no. 97, and sleeve notes to Techno! The New Dance Sound of Detroit (10 Records).'});
SOURCE('x2-sugrue',{title:'Sugrue, T. J. (1996). The Origins of the Urban Crisis: Race and Inequality in Postwar Detroit. Princeton University Press.'});
SOURCE('x2-census',{title:'US Census Bureau. Decennial census population counts for the city of Detroit, 1950–1990.',url:'https://www.census.gov/',note:'Figures in the scene are rounded to the nearest ten thousand.'});
SOURCE('x2-danielsen',{title:'Danielsen, A. (2006). Presence and Pleasure: The Funk Grooves of James Brown and Parliament. Wesleyan University Press.'});
SOURCE('x2-dery',{title:'Dery, M. (1993). Black to the future: interviews with Samuel R. Delany, Greg Tate, and Tricia Rose. South Atlantic Quarterly 92(4), 735–778.'});
SOURCE('x2-eshun',{title:'Eshun, K. (1998). More Brilliant Than the Sun: Adventures in Sonic Fiction. Quartet Books.'});
SOURCE('x2-gilroy',{title:'Gilroy, P. (1993). The Black Atlantic: Modernity and Double Consciousness. Verso.'});
SOURCE('x2-drexciya',{title:'Drexciya (1997). The Quest (Submerge), sleeve notes.',note:'The source of the underwater myth as the duo told it.'});
SOURCE('x2-pinch',{title:'Pinch, T. & Trocco, F. (2002). Analog Days: The Invention and Impact of the Moog Synthesizer. Harvard University Press.'});
SOURCE('x2-vecchiola',{title:'Vecchiola, C. (2011). Submerge in Detroit: techno’s creative response to urban crisis. Journal of American Studies 45(1), 95–111.'});
SOURCE('x2-hesmondhalgh',{title:'Hesmondhalgh, D. (1998). The British dance music industry: a case study of independent cultural production. British Journal of Sociology 49(2), 234–251.'});
SOURCE('x2-emim',{title:'Electronic Music In Motion: a companion course on how electronic sound is made.',url:'https://electronic-music-in-motion.puter.site/',note:'For oscillators, envelopes and how a swept sine becomes a drum.'});
SOURCE('x2-music',{title:'Music In Motion: rhythm, chords and synthesis from the start.',url:'https://music-in-motion.puter.site/',note:'For what major and minor chords and swing are.'});

LESSON({id:'belleville-three',name:'The Belleville Three',short:'Belleville Three',stage:'detroit',year:'1985–1988',level:'Introduction',
 why:'Three school friends, their own labels and a handful of records gave a new music its sound, and a British compilation gave it its name.',
 prior:['electro','chicago-house'],references:['x2-sicko','x2-brown','x2-reynolds','x2-brewster','x2-butler','x2-toffler','x2-cosgrove','x2-music'],
 ids:['belleville-three','belleville-three-stabs','belleville-three-name']});
LESSON({id:'the-electrifying-mojo',name:'The Electrifying Mojo',short:'Mojo',stage:'detroit',year:'1977–1988',level:'Introduction',
 why:'A late-night radio DJ and a shrinking industrial city are the shared background of everyone who made Detroit techno.',
 prior:['kraftwerk','belleville-three'],references:['x2-sicko','x2-brown','x2-brewster','x2-sugrue','x2-census','x2-butler','x2-danielsen'],
 ids:['the-electrifying-mojo','the-electrifying-mojo-city','the-electrifying-mojo-blend']});
LESSON({id:'afrofuturism',name:'Afrofuturism',short:'Afrofuturism',stage:'detroit',year:'1950s–1998',level:'Core',
 why:'Detroit techno belongs to a longer tradition of Black artists using technology and science fiction to imagine other futures.',
 prior:['belleville-three'],references:['x2-dery','x2-eshun','x2-brown','x2-gilroy','x2-drexciya','x2-pinch','x2-emim'],
 ids:['afrofuturism','afrofuturism-drexciya','afrofuturism-future-sound']});
LESSON({id:'underground-resistance',name:'Underground Resistance',short:'UR',stage:'detroit',year:'1989–1994',level:'Core',
 why:'A Detroit collective made independence and anonymity into principles, and its members carried a faster, barer techno to Europe.',
 prior:['belleville-three','afrofuturism'],references:['x2-sicko','x2-brown','x2-reynolds','x2-vecchiola','x2-hesmondhalgh','x2-butler'],
 ids:['underground-resistance','underground-resistance-independent','underground-resistance-stripped']});

THREAD({id:'x2-future',name:'Music that imagines the future',ids:['kraftwerk','electro-cybotron','afrofuturism','afrofuturism-drexciya','credit-and-erasure']});
THREAD({id:'x2-less',name:'Taking parts away',ids:['belleville-three-stabs','underground-resistance-stripped','minimal','arrangement']});
THREAD({id:'x2-own',name:'Who owns the music',ids:['chicago-house-warehouse','underground-resistance-independent','free-parties','credit-and-erasure']});
THREAD({id:'x2-swing',name:'Straight and swung time',ids:['kraftwerk-machine-pulse','the-electrifying-mojo-blend','step-sequencer','groove-science']});
