/* Techno era 4 · Berlin (1989–2004): lessons, sources and connections. */
SOURCE('x4-klang',{title:'Denk, F. & von Thülen, S. (2014). Der Klang der Familie: Berlin, Techno and the Fall of the Wall. Trans. J. Sabin. Books on Demand.',note:'An oral history told by the people who ran the clubs and played in them.'});
SOURCE('x4-rapp',{title:'Rapp, T. (2010). Lost and Sound: Berlin, Techno and the Easyjet Set. Innervisions.'});
SOURCE('x4-sicko',{title:'Sicko, D. (2010). Techno Rebels: The Renegades of Electronic Funk. 2nd edn. Wayne State University Press.'});
SOURCE('x4-brown',{title:'Brown Jr., D. (2022). Assembling a Black Counter Culture. Primary Information.'});
SOURCE('x4-reynolds',{title:'Reynolds, S. (2013). Energy Flash: A Journey Through Rave Music and Dance Culture. Rev. edn. Faber.'});
SOURCE('x4-butler',{title:'Butler, M. J. (2006). Unlocking the Groove: Rhythm, Meter, and Musical Design in Electronic Dance Music. Indiana University Press.'});
SOURCE('x4-butler-2014',{title:'Butler, M. J. (2014). Playing with Something That Runs: Technology, Improvisation, and Composition in DJ and Laptop Performance. Oxford University Press.'});
SOURCE('x4-sherburne',{title:'Sherburne, P. (2004). Digital discipline: minimalism in house and techno. In Cox, C. & Warner, D. (eds), Audio Culture: Readings in Modern Music. Continuum.'});
SOURCE('x4-colomb',{title:'Colomb, C. (2012). Pushing the urban frontier: temporary uses of space, city marketing, and the creative city discourse in 2000s Berlin. Journal of Urban Affairs 34(2), 131–152.'});
SOURCE('x4-borneman',{title:'Borneman, J. & Senders, S. (2000). Politics without a head: is the “Love Parade” a new form of political identification? Cultural Anthropology 15(2), 294–317.'});
SOURCE('x4-helbing',{title:'Helbing, D. & Mukerji, P. (2012). Crowd disasters as systemic failures: analysis of the Love Parade disaster. EPJ Data Science 1, 7.'});
SOURCE('x4-garcia',{title:'Garcia, L.-M. (2016). Techno-tourism and post-industrial neo-romanticism in Berlin’s electronic dance music scenes. Tourist Studies 16(3), 276–295.'});
SOURCE('x4-unesco',{title:'German Commission for UNESCO (2024). Nationwide Inventory of Intangible Cultural Heritage: Techno culture in Berlin.',url:'https://www.unesco.de/en/culture-and-nature/intangible-cultural-heritage'});
SOURCE('x4-fink',{title:'Fink, R. (2018). Below 100 Hz: toward a musicology of bass culture. In Fink, R., Latour, M. & Wallmark, Z. (eds), The Relentless Pursuit of Tone. Oxford University Press.'});
SOURCE('x4-hove',{title:'Hove, M. J., Marie, C., Bruce, I. C. & Trainor, L. J. (2014). Superior time perception for lower musical pitch explains why bass-ranged instruments lay down musical rhythms. PNAS 111(28), 10383–10388.'});
SOURCE('x4-cameron',{title:'Cameron, D. J. et al. (2022). Undetectable very-low frequency sound increases dancing at a live concert. Current Biology 32(21), R1222–R1223.'});

LESSON({id:'after-the-wall',name:'After the Wall',short:'After the Wall',stage:'berlin',year:'1989',level:'Introduction',
 why:'A border opens, half a city stands empty, and a small scene suddenly has room and an audience.',
 prior:['belleville-three','chicago-house'],references:['x4-klang','x4-rapp','x4-colomb','x4-borneman','x4-helbing'],
 ids:['after-the-wall','after-the-wall-loveparade','after-the-wall-spaces']});
LESSON({id:'tresor',name:'Tresor',short:'Tresor',stage:'berlin',year:'1991',level:'Core',
 why:'A club in a bank vault ties Berlin to Detroit, and the music gets faster and harder.',
 prior:['after-the-wall','underground-resistance'],references:['x4-klang','x4-sicko','x4-brown','x4-reynolds','x4-butler'],
 ids:['tresor','tresor-axis','tresor-harder']});
LESSON({id:'minimal',name:'Minimal',short:'Minimal',stage:'berlin',year:'1993–2004',level:'Core',
 why:'Taking sounds away changes what a listener attends to; here you remove them yourself and hear it.',
 prior:['underground-resistance','step-sequencer'],references:['x4-sherburne','x4-butler','x4-sicko','x4-rapp'],
 ids:['minimal','minimal-variation','minimal-people']});
LESSON({id:'berghain-era',name:'The Berghain era',short:'Berghain era',stage:'berlin',year:'1998–2024',level:'Core',
 why:'Clubs become institutions: sound systems built for bass, sets that last all day, and official recognition as culture.',
 prior:['tresor','minimal'],references:['x4-rapp','x4-garcia','x4-unesco','x4-fink','x4-hove','x4-cameron','x4-butler-2014'],
 ids:['berghain-era','berghain-era-soundsystem','berghain-era-long-sets']});

THREAD({id:'x4-axis',name:'Detroit to Berlin and back',ids:['belleville-three','underground-resistance','tresor-axis','minimal-people','credit-and-erasure']});
THREAD({id:'x4-less',name:'Less is the point',ids:['minimal','minimal-variation','dub-techno','arrangement']});
THREAD({id:'x4-bass',name:'Bass and the body',ids:['tr-808','berghain-era-soundsystem','tempo-and-kick','groove-science']});
THREAD({id:'x4-law',name:'Parties and the state',ids:['after-the-wall-spaces','after-the-wall-loveparade','criminal-justice-act','berghain-era','global-scenes']});
