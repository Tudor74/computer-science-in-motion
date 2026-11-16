/* Techno era 8 · Techno today: lessons, sources and connections. */
SOURCE('x8-brown-2022',{title:'DeForrest Brown Jr. (2022). Assembling a Black Counter Culture. Primary Information.'});
SOURCE('x8-sicko-2010',{title:'Dan Sicko (2010). Techno Rebels: The Renegades of Electronic Funk. 2nd edn, Wayne State University Press.'});
SOURCE('x8-denk-2014',{title:'Felix Denk & Sven von Thülen (2014). Der Klang der Familie: Berlin, Techno and the Fall of the Wall. Books on Demand.'});
SOURCE('x8-farrugia-2012',{title:'Rebekah Farrugia (2012). Beyond the Dance Floor: Female DJs, Technology and Electronic Dance Music Culture. Intellect.'});
SOURCE('x8-facts',{title:'female:pressure. FACTS surveys of festival line-ups (2013–2022 editions).',url:'https://femalepressure.net/',note:'Percentages are quoted as reported by the survey for the festivals it counted.'});
SOURCE('x8-garcia-2016',{title:'Luis-Manuel Garcia (2016). Techno-tourism and post-industrial neo-romanticism in Berlin’s electronic dance music scenes. Tourist Studies 16(3), 276–295.',url:'https://doi.org/10.1177/1468797615618037'});
SOURCE('x8-steingo-2016',{title:'Gavin Steingo (2016). Kwaito’s Promise: Music and the Aesthetics of Freedom in South Africa. University of Chicago Press.',note:'Background on South African electronic music before gqom and amapiano.'});
SOURCE('x8-butler-2014',{title:'Mark J. Butler (2014). Playing with Something That Runs: Technology, Improvisation, and Composition in DJ and Laptop Performance. Oxford University Press.'});
SOURCE('x8-vail-2014',{title:'Mark Vail (2014). The Synthesizer: A Comprehensive Guide. Oxford University Press.'});
SOURCE('x8-snoman-2009',{title:'Rick Snoman (2009). Dance Music Manual: Tools, Toys and Techniques. 2nd edn, Focal Press.'});
SOURCE('x8-witek-2014',{title:'Maria A. G. Witek, Eric F. Clarke, Mikkel Wallentin, Morten L. Kringelbach & Peter Vuust (2014). Syncopation, body-movement and pleasure in groove music. PLoS ONE 9(4), e94446.',url:'https://doi.org/10.1371/journal.pone.0094446'});
SOURCE('x8-hove-2014',{title:'Michael J. Hove, Céline Marie, Ian C. Bruce & Laurel J. Trainor (2014). Superior time perception for lower musical pitch explains why bass-ranged instruments lay down musical rhythms. PNAS 111(28), 10383–10388.',url:'https://doi.org/10.1073/pnas.1402039111'});
SOURCE('x8-cameron-2022',{title:'Daniel J. Cameron et al. (2022). Undetectable very-low frequency sound increases dancing at a live concert. Current Biology 32(21), R1222–R1223.',url:'https://doi.org/10.1016/j.cub.2022.09.035'});
SOURCE('x8-moelants-2002',{title:'Dirk Moelants (2002). Preferred tempo reconsidered. Proceedings of the 7th International Conference on Music Perception and Cognition, 580–583.'});
SOURCE('x8-noorden-1999',{title:'Leon van Noorden & Dirk Moelants (1999). Resonance in the perception of musical pulse. Journal of New Music Research 28(1), 43–66.'});
SOURCE('x8-music',{title:'Music In Motion: beat, metre and syncopation.',url:'https://music-in-motion.puter.site/',note:'Sister course: start there for what syncopation is.'});
SOURCE('x8-mind',{title:'Mind In Motion: perception, timing and prediction.',url:'https://mind-in-motion.puter.site/',note:'Sister course: for how experiments on perception are designed and read.'});
SOURCE('x8-emim',{title:'Electronic Music In Motion: synthesis, filters and effects.',url:'https://electronic-music-in-motion.puter.site/',note:'Sister course: for compressors, envelopes and modular synthesis.'});

LESSON({id:'global-scenes',name:'Global scenes',short:'Global scenes',stage:'today',year:'2000s onward',
 why:'Techno is now made on every continent, and each city bends it to its own buildings, laws, politics and neighbouring music.',
 prior:['berghain-era','free-parties'],level:'Core',references:['x8-garcia-2016','x8-steingo-2016','x8-sicko-2010'],
 ids:['global-scenes','global-scenes-tbilisi','global-scenes-neighbours']});
LESSON({id:'credit-and-erasure',name:'Credit and erasure',short:'Credit',stage:'today',year:'1981 onward',
 why:'Who is named in a history decides who is booked, paid and remembered; techno’s Black origins and its women and queer and trans artists have often been left out.',
 prior:['belleville-three','underground-resistance','tresor'],level:'Core',references:['x8-brown-2022','x8-sicko-2010','x8-farrugia-2012','x8-facts','x8-denk-2014'],
 ids:['credit-and-erasure','credit-and-erasure-lineups','credit-and-erasure-story']});
LESSON({id:'tools-today',name:'Tools today',short:'Tools today',stage:'today',year:'1995 onward',
 why:'The machines that defined techno are now software, clones and modules; the tools changed how tracks are made and performed, and the sixteen steps stayed.',
 prior:['tr-909','tb-303','step-sequencer','arrangement'],level:'Core',references:['x8-butler-2014','x8-vail-2014','x8-snoman-2009','x8-emim'],
 ids:['tools-today','tools-today-clips','tools-today-sidechain']});
LESSON({id:'groove-science',name:'Groove science',short:'Groove science',stage:'today',year:'1999 onward',
 why:'Experiments have begun to explain why a steady kick, a little syncopation and a lot of bass make people move, and how strong that evidence is.',
 prior:['tempo-and-kick','step-sequencer'],level:'Core',references:['x8-witek-2014','x8-hove-2014','x8-cameron-2022','x8-moelants-2002','x8-noorden-1999','x8-music','x8-mind'],
 ids:['groove-science','groove-science-bass','groove-science-tempo']});

THREAD({id:'x8-detroit',name:'Detroit’s credit, from the first records to today',ids:['belleville-three','underground-resistance','tresor','credit-and-erasure-story','credit-and-erasure','global-scenes']});
THREAD({id:'x8-politics',name:'Dance floors and the law',ids:['after-the-wall','criminal-justice-act','free-parties','global-scenes-tbilisi']});
THREAD({id:'x8-body',name:'Why the body moves',ids:['tr-808','tempo-and-kick','arrangement-tension','tools-today-sidechain','groove-science','groove-science-bass','groove-science-tempo']});
