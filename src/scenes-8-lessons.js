/* Music era 8 · Music and the mind: lessons, sources and connections. */
SOURCE('m8-schouten-1940',{title:'Schouten (1940). The residue and the mechanism of hearing. Proceedings of the Koninklijke Nederlandse Akademie van Wetenschappen 43, 991–999.'});
SOURCE('m8-houtsma-goldstein',{title:'Houtsma & Goldstein (1972). The central origin of the pitch of complex tones: evidence from musical interval recognition. JASA 51, 520–529.'});
SOURCE('m8-plack-pitch',{title:'Plack, Oxenham, Fay & Popper (eds) (2005). Pitch: Neural Coding and Perception. Springer.'});
SOURCE('m8-plomp-levelt',{title:'Plomp & Levelt (1965). Tonal consonance and critical bandwidth. JASA 38, 548–560.'});
SOURCE('m8-sethares-1993',{title:'Sethares (1993). Local consonance and the relationship between timbre and scale. JASA 94, 1218–1228.'});
SOURCE('m8-sethares-book',{title:'William A. Sethares (2005). Tuning, Timbre, Spectrum, Scale, 2nd ed. Springer.'});
SOURCE('m8-mcdermott-2016',{title:'McDermott, Schultz, Undurraga & Godoy (2016). Indifference to dissonance in native Amazonians reveals cultural variation in music perception. Nature 535, 547–550.'});
SOURCE('m8-meyer-1956',{title:'Leonard B. Meyer (1956). Emotion and Meaning in Music. University of Chicago Press.'});
SOURCE('m8-krumhansl-kessler',{title:'Krumhansl & Kessler (1982). Tracing the dynamic changes in perceived tonal organization in a spatial representation of musical keys. Psychological Review 89, 334–368.'});
SOURCE('m8-krumhansl-1990',{title:'Carol L. Krumhansl (1990). Cognitive Foundations of Musical Pitch. Oxford University Press.'});
SOURCE('m8-huron-2006',{title:'David Huron (2006). Sweet Anticipation: Music and the Psychology of Expectation. MIT Press.'});
SOURCE('m8-narmour-1990',{title:'Eugene Narmour (1990). The Analysis and Cognition of Basic Melodic Structures: The Implication–Realization Model. University of Chicago Press.'});
SOURCE('m8-juslin-laukka',{title:'Juslin & Laukka (2003). Communication of emotions in vocal expression and music performance: different channels, same code? Psychological Bulletin 129, 770–814.'});
SOURCE('m8-juslin-vastfjall',{title:'Juslin & Västfjäll (2008). Emotional responses to music: the need to consider underlying mechanisms. Behavioral and Brain Sciences 31, 559–575.'});
SOURCE('m8-fritz-2009',{title:'Fritz et al. (2009). Universal recognition of three basic emotions in music. Current Biology 19, 573–576.'});
SOURCE('m8-rauscher-1993',{title:'Rauscher, Shaw & Ky (1993). Music and spatial task performance. Nature 365, 611.'});
SOURCE('m8-chabris-1999',{title:'Chabris (1999). Prelude or requiem for the “Mozart effect”? Nature 400, 826–827.'});
SOURCE('m8-pietschnig-2010',{title:'Pietschnig, Voracek & Formann (2010). Mozart effect–Shmozart effect: a meta-analysis. Intelligence 38, 314–323.'});
SOURCE('m8-thompson-2001',{title:'Thompson, Schellenberg & Husain (2001). Arousal, mood, and the Mozart effect. Psychological Science 12, 248–251.'});
SOURCE('m8-repp-2005',{title:'Repp (2005). Sensorimotor synchronization: a review of the tapping literature. Psychonomic Bulletin & Review 12, 969–992.'});
SOURCE('m8-repp-su-2013',{title:'Repp & Su (2013). Sensorimotor synchronization: a review of recent research (2006–2012). Psychonomic Bulletin & Review 20, 403–452.'});
SOURCE('m8-vorberg-wing',{title:'Vorberg & Wing (1996). Modeling variability and dependence in timing. In Heuer & Keele (eds), Handbook of Perception and Action, vol. 2. Academic Press.'});
SOURCE('m8-london-2012',{title:'Justin London (2012). Hearing in Time: Psychological Aspects of Musical Meter, 2nd ed. Oxford University Press.'});
SOURCE('m8-shepard-1964',{title:'Shepard (1964). Circularity in judgments of relative pitch. JASA 36, 2346–2353.'});
SOURCE('m8-deutsch-1986',{title:'Deutsch (1986). A musical paradox. Music Perception 3, 275–280.'});
SOURCE('m8-deutsch-1991',{title:'Deutsch (1991). The tritone paradox: an influence of language on music perception. Music Perception 8, 335–347.'});
SOURCE('m8-deutsch-book',{title:'Diana Deutsch (ed.) (2013). The Psychology of Music, 3rd ed. Academic Press.'});

LESSON({id:'missing-fundamental',name:'The missing fundamental',short:'Missing pitch',stage:'perception',year:'1841–1940',
 why:'You hear a pitch that is not in the sound: the brain reads the repetition rate of the harmonics, which is why small speakers still seem to play bass.',
 prior:['harmonic-series','fourier-timbre'],level:'Core',references:['m8-schouten-1940','m8-houtsma-goldstein','m8-plack-pitch'],
 ids:['missing-fundamental','missing-fundamental-match','missing-fundamental-speaker']});
LESSON({id:'consonance-roughness',name:'Roughness and consonance',short:'Roughness',stage:'perception',year:'1863–1993',
 why:'Rate pairs of tones yourself and compare with Plomp and Levelt: roughness from close frequencies in one critical band explains much of why some intervals sound smooth.',
 prior:['consonant-ratios','the-ear'],level:'Core',references:['m8-plomp-levelt','m8-sethares-1993','m8-sethares-book','m8-mcdermott-2016'],
 ids:['consonance-roughness','consonance-roughness-beats','consonance-roughness-intervals']});
LESSON({id:'expectation',name:'Expectation and key',short:'Expectation',stage:'perception',year:'1956–2006',
 why:'Take the probe-tone test and see the shape of a key in your own ratings, then measure surprise in bits and let the computer find a melody’s key.',
 prior:['major-minor','modes'],level:'Core',references:['m8-krumhansl-kessler','m8-krumhansl-1990','m8-meyer-1956','m8-huron-2006','m8-narmour-1990'],
 ids:['expectation','expectation-melody','expectation-key-finding']});
LESSON({id:'music-emotion',name:'Music and emotion',short:'Emotion',stage:'perception',year:'1993–2010',
 why:'Which cues make music sound happy or sad, how music actually moves listeners, and what happened to the famous “Mozart effect”.',
 prior:['major-minor'],level:'Core',references:['m8-juslin-laukka','m8-juslin-vastfjall','m8-fritz-2009','m8-rauscher-1993','m8-chabris-1999','m8-pietschnig-2010','m8-thompson-2001'],
 ids:['music-emotion','music-emotion-mechanisms','music-emotion-mozart']});
LESSON({id:'beat-entrainment',name:'Keeping the beat',short:'Entrainment',stage:'perception',year:'1982–2013',
 why:'Tap along and measure your own timing: most people tap slightly early, correct errors a little at a time, and can only follow beats within a limited range of speeds.',
 prior:['beat-metre'],level:'Core',references:['m8-repp-2005','m8-repp-su-2013','m8-vorberg-wing','m8-london-2012'],
 ids:['beat-entrainment','beat-entrainment-tempo','beat-entrainment-range']});
LESSON({id:'auditory-illusions',name:'Auditory illusions',short:'Illusions',stage:'perception',year:'1964–1991',
 why:'An endlessly rising staircase, a pair of notes that goes up for one listener and down for another, and a beat that speeds up for ever reveal how pitch and time are built.',
 prior:['missing-fundamental','pitch-frequency'],level:'Core',references:['m8-shepard-1964','m8-deutsch-1986','m8-deutsch-1991','m8-deutsch-book'],
 ids:['auditory-illusions','auditory-illusions-tritone','auditory-illusions-risset']});

THREAD({id:'m8-listener',name:'You as the participant',ids:['missing-fundamental-match','consonance-roughness','expectation','beat-entrainment','auditory-illusions-tritone']});
THREAD({id:'m8-circularity',name:'Pitch as a circle',ids:['auditory-illusions','auditory-illusions-tritone','expectation-key-finding']});
