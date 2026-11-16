/* Techno era 7 · DJ craft and arrangement: lessons, sources and connections. */
SOURCE('x7-butler-2006',{title:'Mark J. Butler (2006). Unlocking the Groove: Rhythm, Meter, and Musical Design in Electronic Dance Music. Indiana University Press.'});
SOURCE('x7-brewster-1999',{title:'Bill Brewster & Frank Broughton (1999). Last Night a DJ Saved My Life: The History of the Disc Jockey. Headline.'});
SOURCE('x7-brewster-2002',{title:'Frank Broughton & Bill Brewster (2002). How to DJ (Properly): The Art and Science of Playing Records. Bantam.'});
SOURCE('x7-snoman-2009',{title:'Rick Snoman (2009). Dance Music Manual: Tools, Toys and Techniques. 2nd edn, Focal Press.'});
SOURCE('x7-roads-1996',{title:'Curtis Roads (1996). The Computer Music Tutorial. MIT Press.',note:'Mixing, panning and equal-power laws.'});
SOURCE('x7-katz-2002',{title:'Bob Katz (2002). Mastering Audio: The Art and the Science. Focal Press.'});
SOURCE('x7-solberg-2017',{title:'Ragnhild Torvanger Solberg & Alexander Refsum Jensenius (2017). Group behaviour and interpersonal synchronization to electronic dance music. Musicae Scientiae 23(1), 111–134.',url:'https://doi.org/10.1177/1029864917712345'});
SOURCE('x7-music',{title:'Music In Motion: rhythm, metre and swing as step sequencers.',url:'https://music-in-motion.puter.site/',note:'Sister course: start there for beat, metre and syncopation.'});
SOURCE('x7-emim',{title:'Electronic Music In Motion: synthesis, filters and effects.',url:'https://electronic-music-in-motion.puter.site/',note:'Sister course: start there for what a filter and an envelope are.'});

LESSON({id:'beatmatching',name:'Beatmatching',short:'Beatmatching',stage:'craft',year:'c. 1970 onward',
 why:'Matching the speed and position of two records is what lets a DJ turn separate tracks into one continuous piece of music.',
 prior:['tr-909','step-sequencer'],level:'Core',references:['x7-brewster-1999','x7-butler-2006','x7-music'],
 ids:['beatmatching','beatmatching-drift','beatmatching-pitch']});
LESSON({id:'eq-mixing',name:'EQ mixing',short:'EQ mixing',stage:'craft',year:'1970s onward',
 why:'Three filters per channel let a DJ take records apart by frequency, so two tracks can overlap without their basslines fighting.',
 prior:['beatmatching','tr-808'],level:'Core',references:['x7-brewster-2002','x7-butler-2006','x7-roads-1996','x7-katz-2002','x7-emim'],
 ids:['eq-mixing','eq-mixing-bands','eq-mixing-crossfade']});
LESSON({id:'phrasing',name:'Phrasing',short:'Phrasing',stage:'craft',year:'Technique',
 why:'Tracks change in blocks of 8, 16 and 32 bars; mixing on those boundaries makes two records sound like one arrangement.',
 prior:['beatmatching','step-sequencer'],level:'Core',references:['x7-butler-2006','x7-snoman-2009','x7-brewster-2002'],
 ids:['phrasing','phrasing-mix','phrasing-count']});
LESSON({id:'arrangement',name:'Arrangement',short:'Arrangement',stage:'craft',year:'Technique',
 why:'Techno makes its drama from texture: which layers play, what is taken away, and when the kick comes back.',
 prior:['phrasing','tb-303','minimal'],level:'Core',references:['x7-butler-2006','x7-snoman-2009','x7-solberg-2017'],
 ids:['arrangement','arrangement-tension','arrangement-build']});

THREAD({id:'x7-kick',name:'The kick drum, from machine to dance floor',ids:['tr-808','tr-909','tempo-and-kick','beatmatching','eq-mixing','arrangement-tension','groove-science']});
THREAD({id:'x7-less',name:'Taking things away',ids:['minimal','eq-mixing','arrangement','arrangement-tension','arrangement-build']});
THREAD({id:'x7-you',name:'You play it',ids:['tr-909','tb-303','beatmatching','phrasing-count','arrangement-build','groove-science']});
