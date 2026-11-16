/* Techno era 3 · The machines (1980–1990): lessons, sources and connections. */
SOURCE('x3-808-manual',{title:'Roland Corporation (1980). TR-808 Rhythm Composer: owner’s manual and service notes.'});
SOURCE('x3-909-manual',{title:'Roland Corporation (1983). TR-909 Rhythm Composer: owner’s manual and service notes.'});
SOURCE('x3-303-manual',{title:'Roland Corporation (1981). TB-303 Bass Line: owner’s manual.'});
SOURCE('x3-werner',{title:'Werner, K. J., Abel, J. S. & Smith, J. O. (2014). A physically-informed, circuit-bendable, digital model of the Roland TR-808 bass drum circuit. Proceedings of DAFx-14.'});
SOURCE('x3-kakehashi',{title:'Kakehashi, I. & Olsen, R. (2002). I Believe in Music: Life Experiences and Thoughts on the Future of Electronic Music by the Founder of the Roland Corporation. Hal Leonard.'});
SOURCE('x3-vail',{title:'Vail, M. (2000). Vintage Synthesizers. 2nd edn. Miller Freeman.'});
SOURCE('x3-butler',{title:'Butler, M. J. (2006). Unlocking the Groove: Rhythm, Meter, and Musical Design in Electronic Dance Music. Indiana University Press.'});
SOURCE('x3-sicko',{title:'Sicko, D. (2010). Techno Rebels: The Renegades of Electronic Funk. 2nd edn. Wayne State University Press.'});
SOURCE('x3-reynolds',{title:'Reynolds, S. (2013). Energy Flash: A Journey Through Rave Music and Dance Culture. Rev. edn. Faber.'});
SOURCE('x3-brewster',{title:'Brewster, B. & Broughton, F. (2006). Last Night a DJ Saved My Life: The History of the Disc Jockey. Rev. edn. Headline.'});
SOURCE('x3-singh',{title:'Singh, C. (1982). Synthesizing: Ten Ragas to a Disco Beat. EMI India; reissued 2010.',note:'An early record made with a TB-303 and a TR-808.'});
SOURCE('x3-music',{title:'Music In Motion: rhythm, synthesis and sequencing.',url:'https://music-in-motion.puter.site/',note:'For what an oscillator, a filter and MIDI are, and for swing and Euclidean rhythms.'});
SOURCE('x3-emim',{title:'Electronic Music In Motion: a companion course on synthesis and drum machines.',url:'https://electronic-music-in-motion.puter.site/'});

LESSON({id:'tr-808',name:'The TR-808',short:'TR-808',stage:'machines',year:'1980',level:'Introduction',
 why:'An analogue drum machine that failed when new gave electro, hip-hop and techno their low end.',
 prior:['electro','kraftwerk'],references:['x3-808-manual','x3-werner','x3-kakehashi','x3-sicko','x3-emim'],
 ids:['tr-808','tr-808-voices','tr-808-story']});
LESSON({id:'tr-909',name:'The TR-909',short:'TR-909',stage:'machines',year:'1983',level:'Core',
 why:'Its kick, clap and hats, and the pattern they play, are the default drum kit of house and techno.',
 prior:['tr-808','chicago-house'],references:['x3-909-manual','x3-butler','x3-vail','x3-music'],
 ids:['tr-909','tr-909-accent','tr-909-hybrid']});
LESSON({id:'tb-303',name:'The TB-303',short:'TB-303',stage:'machines',year:'1981',level:'Core',
 why:'A failed practice aid whose filter, turned by hand, became the sound of acid.',
 prior:['tr-808','chicago-house'],references:['x3-303-manual','x3-vail','x3-reynolds','x3-brewster','x3-singh'],
 ids:['tb-303','tb-303-accent-slide','tb-303-story']});
LESSON({id:'step-sequencer',name:'The step sequencer',short:'Step sequencer',stage:'machines',year:'1980–1990',level:'Core',
 why:'Sixteen switches per bar, swing as a number and chained patterns: the way these machines are programmed shaped the music.',
 prior:['tr-909','moroder-sequencer'],references:['x3-808-manual','x3-909-manual','x3-butler','x3-music'],
 ids:['step-sequencer','step-sequencer-swing','step-sequencer-chain']});

THREAD({id:'x3-failures',name:'Failed products, new music',ids:['tr-808-story','tb-303-story','chicago-house','belleville-three','acid']});
THREAD({id:'x3-pattern',name:'From one bar to a whole track',ids:['step-sequencer','step-sequencer-chain','tr-909','minimal','phrasing','arrangement']});
THREAD({id:'x3-filter',name:'The filter as an instrument',ids:['tb-303','tb-303-accent-slide','acid','dub-techno','eq-mixing']});
