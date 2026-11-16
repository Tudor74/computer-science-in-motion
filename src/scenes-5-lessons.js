/* Music era 5 · The science of timbre: lessons, sources and connections. */
SOURCE('m5-fourier-1822',{title:'Joseph Fourier (1822). Théorie analytique de la chaleur. Paris: Firmin Didot.',url:'https://archive.org/details/thorieanalytiq00four'});
SOURCE('m5-helmholtz-1863',{title:'Hermann von Helmholtz (1863/1875). On the Sensations of Tone as a Physiological Basis for the Theory of Music, trans. A. J. Ellis.',url:'https://archive.org/details/onsensationsofto00helmrich'});
SOURCE('m5-rayleigh-1877',{title:'Lord Rayleigh (1877). The Theory of Sound. London: Macmillan.',url:'https://archive.org/details/theorysound00raylgoog'});
SOURCE('m5-rossing-fletcher',{title:'Neville H. Fletcher & Thomas D. Rossing (1998). The Physics of Musical Instruments, 2nd ed. Springer.'});
SOURCE('m5-saldanha-corso',{title:'Saldanha & Corso (1964). Timbre cues and the identification of musical instruments. Journal of the Acoustical Society of America 36, 2021–2026.'});
SOURCE('m5-risset-wessel',{title:'Risset & Wessel (1999). Exploration of timbre by analysis and synthesis. In D. Deutsch (ed.), The Psychology of Music, 2nd ed.'});
SOURCE('m5-pinch',{title:'Pinch & Trocco (2002). Analog Days: The Invention and Impact of the Moog Synthesizer. Harvard University Press.'});
SOURCE('m5-bekesy',{title:'Georg von Békésy (1960). Experiments in Hearing. McGraw-Hill.'});
SOURCE('m5-greenwood',{title:'Greenwood (1990). A cochlear frequency-position function for several species — 29 years later. JASA 87, 2592–2605.'});
SOURCE('m5-glasberg-moore',{title:'Glasberg & Moore (1990). Derivation of auditory filter shapes from notched-noise data. Hearing Research 47, 103–138.'});
SOURCE('m5-pickles',{title:'James O. Pickles (2012). An Introduction to the Physiology of Hearing, 4th ed. Brill.'});
SOURCE('m5-fletcher-munson',{title:'Fletcher & Munson (1933). Loudness, its definition, measurement and calculation. JASA 5, 82–108.'});
SOURCE('m5-iso226',{title:'ISO 226:2003. Acoustics — Normal equal-loudness-level contours.',url:'https://www.iso.org/standard/34222.html'});
SOURCE('m5-stevens',{title:'Stevens (1957). On the psychophysical law. Psychological Review 64, 153–181.'});
SOURCE('m5-wegel-lane',{title:'Wegel & Lane (1924). The auditory masking of one pure tone by another and its probable relation to the dynamics of the inner ear. Physical Review 23, 266–285.'});
SOURCE('m5-zwicker-fastl',{title:'Zwicker & Fastl (1990). Psychoacoustics: Facts and Models. Springer.'});
SOURCE('m5-fant',{title:'Gunnar Fant (1960). Acoustic Theory of Speech Production. Mouton.'});
SOURCE('m5-peterson-barney',{title:'Peterson & Barney (1952). Control methods used in a study of the vowels. JASA 24, 175–184.'});
SOURCE('m5-sundberg-1974',{title:'Sundberg (1974). Articulatory interpretation of the “singing formant”. JASA 55, 838–844.'});
SOURCE('m5-sundberg-1987',{title:'Johan Sundberg (1987). The Science of the Singing Voice. Northern Illinois University Press.'});

LESSON({id:'fourier-timbre',name:'Timbre and harmonics',short:'Timbre',stage:'timbre',year:'1822–1863',
 why:'Fourier showed any repeating shape is a sum of sines; Helmholtz used that to explain why instruments sound different on the same note.',
 prior:['harmonic-series','pitch-frequency'],level:'Core',references:['m5-fourier-1822','m5-helmholtz-1863'],
 ids:['fourier-timbre','fourier-timbre-phase','fourier-timbre-pitch']});
LESSON({id:'envelope',name:'Envelopes',short:'Envelope',stage:'timbre',year:'1960s',
 why:'How a sound starts and fades is as much a part of its identity as its harmonics.',
 prior:['fourier-timbre'],level:'Core',references:['m5-saldanha-corso','m5-risset-wessel','m5-pinch'],
 ids:['envelope','envelope-instruments','envelope-no-attack']});
LESSON({id:'instrument-resonance',name:'Resonant bodies',short:'Resonance',stage:'timbre',year:'1800s',
 why:'Strings and pipes have harmonic modes and sound clearly pitched; drums, bars and bells do not.',
 prior:['fourier-timbre','harmonic-series'],level:'Core',references:['m5-rayleigh-1877','m5-rossing-fletcher','m5-helmholtz-1863'],
 ids:['instrument-resonance','instrument-resonance-string','instrument-resonance-membrane']});
LESSON({id:'the-ear',name:'The ear',short:'The ear',stage:'timbre',year:'1928–1961',
 why:'The cochlea sorts sound by frequency along the basilar membrane, which explains critical bands, masking and much of how we hear harmony.',
 prior:['pitch-frequency'],level:'Core',references:['m5-bekesy','m5-greenwood','m5-glasberg-moore','m5-pickles'],
 ids:['the-ear','the-ear-path','the-ear-critical-bands']});
LESSON({id:'loudness',name:'Loudness',short:'Loudness',stage:'timbre',year:'1933–2003',
 why:'Perceived loudness depends on frequency and grows far more slowly than sound power; loud sounds hide quiet ones nearby.',
 prior:['the-ear'],level:'Core',references:['m5-fletcher-munson','m5-iso226','m5-stevens','m5-wegel-lane','m5-zwicker-fastl'],
 ids:['loudness','loudness-sones','loudness-masking']});
LESSON({id:'voice-formants',name:'The voice',short:'Voice',stage:'timbre',year:'1952–1974',
 why:'The voice is a buzzing source shaped by a moving filter: formants make vowels, and singers tune them to be heard.',
 prior:['fourier-timbre','instrument-resonance'],level:'Core',references:['m5-fant','m5-peterson-barney','m5-sundberg-1974','m5-sundberg-1987'],
 ids:['voice-formants','voice-formants-vowels','voice-formants-singer']});

THREAD({id:'m5-harmonics-everywhere',name:'Harmonics everywhere',ids:['harmonic-series','fourier-timbre','instrument-resonance-string','synthesis']});
THREAD({id:'m5-ear-to-brain',name:'From the ear to the brain',ids:['the-ear','the-ear-critical-bands','consonance-roughness','missing-fundamental']});
THREAD({id:'m5-shaping-sound',name:'Shaping a sound',ids:['envelope','synthesis','voice-formants']});
