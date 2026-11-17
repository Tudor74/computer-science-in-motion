/* Techno era 5 · UK and rave: lessons, sources and connections. */
SOURCE('x5-collin-1997',{title:'Matthew Collin (1997). Altered State: The Story of Ecstasy Culture and Acid House. Serpent’s Tail.'});
SOURCE('x5-reynolds-1998',{title:'Simon Reynolds (1998). Energy Flash: A Journey Through Rave Music and Dance Culture. Picador.'});
SOURCE('x5-garratt-1998',{title:'Sheryl Garratt (1998). Adventures in Wonderland: A Decade of Club Culture. Headline.'});
SOURCE('x5-butler-2006',{title:'Mark J. Butler (2006). Unlocking the Groove: Rhythm, Meter, and Musical Design in Electronic Dance Music. Indiana University Press.'});
SOURCE('x5-henriques-2011',{title:'Julian Henriques (2011). Sonic Bodies: Reggae Sound Systems, Performance Techniques, and Ways of Knowing. Continuum.'});
SOURCE('x5-mckay-1996',{title:'George McKay (1996). Senseless Acts of Beauty: Cultures of Resistance since the Sixties. Verso.'});
SOURCE('x5-mckay-1998',{title:'George McKay (ed.) (1998). DiY Culture: Party and Protest in Nineties Britain. Verso.'});
SOURCE('x5-stjohn-2009',{title:'Graham St John (2009). Technomad: Global Raving Countercultures. Equinox.'});
SOURCE('x5-cjpoa-1994',{title:'Criminal Justice and Public Order Act 1994, c. 33, Part V (sections 63–66).',url:'https://www.legislation.gov.uk/ukpga/1994/33/part/V/crossheading/powers-in-relation-to-raves'});
SOURCE('x5-asba-2003',{title:'Anti-social Behaviour Act 2003, c. 38, section 58 (amendments to the 1994 Act).',url:'https://www.legislation.gov.uk/ukpga/2003/38/section/58'});
SOURCE('x5-eipa-1990',{title:'Entertainments (Increased Penalties) Act 1990, c. 20.',url:'https://www.legislation.gov.uk/ukpga/1990/20/contents'});
SOURCE('x5-noise-2005',{title:'The Control of Noise at Work Regulations 2005 (UK): exposure action values of 80 and 85 dB(A).',url:'https://www.legislation.gov.uk/uksi/2005/1643/contents/made'});
SOURCE('x5-autechre-1994',{title:'Autechre (1994). Anti EP. Warp Records (sleeve statement on the Criminal Justice Bill).'});
SOURCE('x5-bellefortune-2004',{title:'Brian Belle-Fortune (2004). All Crews: Journeys Through Jungle / Drum & Bass Culture. Vision.'});
SOURCE('x5-reynolds-continuum',{title:'Simon Reynolds (1992–2005; collected online by The Wire, 2009). The Hardcore Continuum: a series of essays written for The Wire.',note:'The thesis is Reynolds’s own and is debated.'});
SOURCE('x5-music-in-motion',{title:'Music In Motion: rhythm, metre and syncopation, with step sequencers.',url:'https://music-in-motion.puter.site/',note:'Sister course: see “Rhythm around the world” for beat, metre and swing.'});

LESSON({id:'acid-house-summer',name:'The acid house summers',short:'Acid house',stage:'rave',year:'1987–1990',level:'Introduction',
 why:'In three years house music in Britain grew from a few small club nights to parties of thousands, and set off the first laws aimed at dance events.',
 prior:['chicago-house','tb-303'],references:['x5-collin-1997','x5-reynolds-1998','x5-garratt-1998','x5-butler-2006','x5-eipa-1990'],
 ids:['acid-house-summer','acid-house-summer-pattern','acid-house-summer-spread']});
LESSON({id:'free-parties',name:'Free parties and sound systems',short:'Free parties',stage:'rave',year:'1990–1992',level:'Core',
 why:'Mobile sound systems took the music to fields and warehouses for nothing, and at Castlemorton in 1992 showed how large an unlicensed gathering could become.',
 prior:['acid-house-summer'],references:['x5-collin-1997','x5-henriques-2011','x5-mckay-1996','x5-stjohn-2009','x5-noise-2005'],
 ids:['free-parties','free-parties-castlemorton','free-parties-network']});
LESSON({id:'criminal-justice-act',name:'The Criminal Justice Act 1994',short:'The 1994 Act',stage:'rave',year:'1994',level:'Core',
 why:'A law wrote a description of a musical style into statute, and musicians and marchers answered it.',
 prior:['free-parties'],references:['x5-cjpoa-1994','x5-asba-2003','x5-autechre-1994','x5-mckay-1998','x5-collin-1997'],
 ids:['criminal-justice-act','criminal-justice-act-repetitive','criminal-justice-act-protest']});
LESSON({id:'after-rave',name:'After rave',short:'After rave',stage:'rave',year:'1991–1997',level:'Core',
 why:'One scene split into styles with different tempos and drum patterns, some keeping techno’s steady kick and others building on breakbeats.',
 prior:['criminal-justice-act','step-sequencer'],references:['x5-reynolds-1998','x5-bellefortune-2004','x5-butler-2006','x5-reynolds-continuum','x5-music-in-motion'],
 ids:['after-rave','after-rave-breakbeat','after-rave-continuum']});

THREAD({id:'x5-law',name:'Music and the law',ids:['acid-house-summer','free-parties-castlemorton','criminal-justice-act','criminal-justice-act-repetitive','criminal-justice-act-protest']});
THREAD({id:'x5-kick',name:'Where the kick falls',ids:['acid-house-summer-pattern','after-rave','after-rave-breakbeat','tempo-and-kick','tr-909']});
THREAD({id:'x5-systems',name:'Sound systems',ids:['free-parties','free-parties-castlemorton','after-rave-continuum','dub-techno-roots']});
