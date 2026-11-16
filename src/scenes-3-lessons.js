/* Senses era 3 · The ear: lessons, sources and connections. */
SOURCE('s3-bekesy',{title:'Georg von Békésy (1960). Experiments in Hearing. McGraw-Hill. (Nobel Prize in Physiology or Medicine, 1961.)'});
SOURCE('s3-pickles',{title:'James O. Pickles (2012). An Introduction to the Physiology of Hearing, 4th ed. Brill.'});
SOURCE('s3-aibara',{title:'Aibara, Welsh, Puria & Goode (2001). Human middle-ear sound transfer function and cochlear input impedance. Hearing Research 152, 100–109.'});
SOURCE('s3-shaw',{title:'Shaw (1974). Transformation of sound pressure level from the free field to the eardrum in the horizontal plane. JASA 56, 1848–1861.'});
SOURCE('s3-borg',{title:'Borg & Counter (1989). The middle-ear muscles. Scientific American 261(2), 74–80.'});
SOURCE('s3-greenwood',{title:'Greenwood (1990). A cochlear frequency-position function for several species — 29 years later. JASA 87, 2592–2605.'});
SOURCE('s3-rhode',{title:'Rhode (1971). Observations of the vibration of the basilar membrane in squirrel monkeys using the Mössbauer technique. JASA 49, 1218–1231.'});
SOURCE('s3-ruggero',{title:'Ruggero, Rich, Recio, Narayan & Robles (1997). Basilar-membrane responses to tones at the base of the chinchilla cochlea. JASA 101, 2151–2163.'});
SOURCE('s3-hudspeth',{title:'Hudspeth & Corey (1977). Sensitivity, polarity, and conductance change in the response of vertebrate hair cells to controlled mechanical stimuli. PNAS 74, 2407–2411.'});
SOURCE('s3-pickles84',{title:'Pickles, Comis & Osborne (1984). Cross-links between stereocilia in the guinea pig organ of Corti, and their possible relation to sensory transduction. Hearing Research 15, 103–112.'});
SOURCE('s3-brownell',{title:'Brownell, Bader, Bertrand & de Ribaupierre (1985). Evoked mechanical responses of isolated cochlear outer hair cells. Science 227, 194–196.'});
SOURCE('s3-zheng',{title:'Zheng et al. (2000). Prestin is the motor protein of cochlear outer hair cells. Nature 405, 149–155.'});
SOURCE('s3-kemp',{title:'Kemp (1978). Stimulated acoustic emissions from within the human auditory system. JASA 64, 1386–1391.'});
SOURCE('s3-terhardt',{title:'Terhardt (1979). Calculating virtual pitch. Hearing Research 1, 155–182 (threshold approximation).'});
SOURCE('s3-iso7029',{title:'ISO 7029:2017. Acoustics — Statistical distribution of hearing thresholds related to age and gender.',url:'https://www.iso.org/standard/42916.html'});
SOURCE('s3-bsa',{title:'British Society of Audiology (2018). Recommended procedure: pure-tone air-conduction and bone-conduction threshold audiometry.',url:'https://www.thebsa.org.uk/'});
SOURCE('s3-niosh',{title:'NIOSH (1998). Criteria for a recommended standard: occupational noise exposure. Publication 98-126.',url:'https://www.cdc.gov/niosh/docs/98-126/'});
SOURCE('s3-uk-noise',{title:'The Control of Noise at Work Regulations 2005 (UK).',url:'https://www.legislation.gov.uk/uksi/2005/1643'});
SOURCE('s3-who',{title:'World Health Organization (2021). World Report on Hearing.',url:'https://www.who.int/publications/i/item/9789240020481'});
SOURCE('s3-kujawa',{title:'Kujawa & Liberman (2009). Adding insult to injury: cochlear nerve degeneration after “temporary” noise-induced hearing loss. Journal of Neuroscience 29, 14077–14085.'});
SOURCE('s3-bramhall',{title:'Bramhall et al. (2019). The search for noise-induced cochlear synaptopathy in humans: mission impossible? Hearing Research 377, 88–103.'});
SOURCE('s3-shannon',{title:'Shannon, Zeng, Kamath, Wygonski & Ekelid (1995). Speech recognition with primarily temporal cues. Science 270, 303–304.'});
SOURCE('s3-friesen',{title:'Friesen, Shannon, Başkent & Wang (2001). Speech recognition in noise as a function of the number of spectral channels. JASA 110, 1150–1163.'});
SOURCE('s3-clark',{title:'Graeme Clark (2003). Cochlear Implants: Fundamentals and Applications. Springer.'});
SOURCE('s3-nidcd',{title:'NIDCD (2021). Cochlear implants (fact sheet).',url:'https://www.nidcd.nih.gov/health/cochlear-implants'});
SOURCE('s3-sharma',{title:'Sharma, Dorman & Spahr (2002). A sensitive period for the development of the central auditory system in children with cochlear implants. Ear and Hearing 23, 532–539.'});
SOURCE('s3-humphries',{title:'Humphries et al. (2012). Language acquisition for deaf children: reducing the harms of zero tolerance to the use of alternative approaches. Harm Reduction Journal 9, 16.'});
SOURCE('s3-music',{title:'Music In Motion — the ear, loudness and critical bands from the music side.',url:'https://music-in-motion.puter.site/',note:'Sister course: the science of timbre and the ear.'});
SOURCE('s3-language',{title:'Language In Motion — sign languages as full languages.',url:'https://language-in-motion.puter.site/',note:'Sister course: grammar and sign languages.'});

LESSON({id:'outer-middle-ear',name:'Outer and middle ear',short:'Outer & middle ear',stage:'ear',year:'1543–1974',level:'Introduction',
 why:'Air and fluid are badly matched; the canal and the three smallest bones in the body make hearing possible on land.',
 prior:[],references:['s3-bekesy','s3-aibara','s3-shaw','s3-borg','s3-music'],
 ids:['outer-middle-ear','outer-middle-ear-canal','outer-middle-ear-reflex']});
LESSON({id:'cochlea',name:'The cochlea',short:'Cochlea',stage:'ear',year:'1928–1997',level:'Core',
 why:'The cochlea sorts sound by frequency along a membrane, giving each pitch its own place.',
 prior:['outer-middle-ear'],references:['s3-bekesy','s3-greenwood','s3-rhode','s3-ruggero'],
 ids:['cochlea','cochlea-map','cochlea-bekesy']});
LESSON({id:'hair-cells',name:'Hair cells',short:'Hair cells',stage:'ear',year:'1977–2000',level:'Core',
 why:'Hair cells turn nanometre movements into nerve signals, and outer hair cells amplify the cochlea’s own motion.',
 prior:['cochlea'],references:['s3-hudspeth','s3-pickles84','s3-brownell','s3-zheng','s3-kemp','s3-pickles'],
 ids:['hair-cells','hair-cells-outer','hair-cells-oae']});
LESSON({id:'hearing-range',name:'The range of hearing',short:'Hearing range',stage:'ear',year:'1933–today',level:'Core',
 why:'How quiet a sound you can hear depends on frequency and age; decibels make the huge range manageable.',
 prior:['cochlea','outer-middle-ear'],references:['s3-terhardt','s3-iso7029','s3-bsa'],
 ids:['hearing-range','hearing-range-sweep','hearing-range-decibels']});
LESSON({id:'hearing-loss',name:'Hearing loss',short:'Hearing loss',stage:'ear',year:'1970s–today',level:'Core',
 why:'Noise and age damage the cochlea in recognisable patterns, and some damage may not show on a standard test.',
 prior:['hearing-range','hair-cells'],references:['s3-niosh','s3-uk-noise','s3-who','s3-kujawa','s3-bramhall'],
 ids:['hearing-loss','hearing-loss-audiogram','hearing-loss-hidden']});
LESSON({id:'cochlear-implants',name:'Cochlear implants',short:'Implants',stage:'ear',year:'1957–today',level:'Core',
 why:'Implants bypass damaged hair cells and stimulate the nerve directly, using the cochlea’s place map; they also raise questions about language and identity.',
 prior:['cochlea','hearing-loss'],references:['s3-shannon','s3-friesen','s3-clark','s3-nidcd','s3-sharma','s3-humphries','s3-language'],
 ids:['cochlear-implants','cochlear-implants-history','cochlear-implants-perspectives']});

THREAD({id:'s3-place',name:'Place codes frequency',ids:['cochlea','cochlea-map','hair-cells-outer','cochlear-implants','masking','pitch-perception']});
THREAD({id:'s3-amplifier',name:'The cochlear amplifier',ids:['cochlea-bekesy','hair-cells-outer','hair-cells-oae','hearing-loss-hidden']});
THREAD({id:'s3-measuring',name:'Measuring hearing',ids:['hearing-range','hearing-range-sweep','hearing-loss-audiogram','hair-cells-oae']});
THREAD({id:'s3-safety',name:'Protecting your hearing',ids:['outer-middle-ear-reflex','hearing-loss','hearing-loss-hidden','hearing-range-decibels']});
