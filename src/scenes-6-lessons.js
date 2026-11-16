/* Music era 6 · Rhythm around the world: lessons, sources and connections. */
SOURCE('m6-bolton-1894',{title:'Thaddeus L. Bolton (1894). Rhythm. American Journal of Psychology 6(2), 145–238.',url:'https://doi.org/10.2307/1410948'});
SOURCE('m6-lerdahl-jackendoff',{title:'Fred Lerdahl & Ray Jackendoff (1983). A Generative Theory of Tonal Music. MIT Press.'});
SOURCE('m6-london-2004',{title:'Justin London (2004). Hearing in Time: Psychological Aspects of Musical Meter. Oxford University Press.'});
SOURCE('m6-lhl-1984',{title:'H. Christopher Longuet-Higgins & Christopher S. Lee (1984). The rhythmic interpretation of monophonic music. Music Perception 1(4), 424–441.',url:'https://doi.org/10.2307/40285271'});
SOURCE('m6-witek-2014',{title:'Maria A. G. Witek, Eric F. Clarke, Mikkel Wallentin, Morten L. Kringelbach & Peter Vuust (2014). Syncopation, body-movement and pleasure in groove music. PLoS ONE 9(4), e94446.',url:'https://doi.org/10.1371/journal.pone.0094446'});
SOURCE('m6-danielsen-2006',{title:'Anne Danielsen (2006). Presence and Pleasure: The Funk Grooves of James Brown and Parliament. Wesleyan University Press.'});
SOURCE('m6-arom-1991',{title:'Simha Arom (1991). African Polyphony and Polyrhythm: Musical Structure and Methodology. Cambridge University Press.'});
SOURCE('m6-agawu-2006',{title:'Kofi Agawu (2006). Structural analysis or cultural analysis? Competing perspectives on the “standard pattern” of West African rhythm. Journal of the American Musicological Society 59(1), 1–46.',url:'https://doi.org/10.1525/jams.2006.59.1.1'});
SOURCE('m6-toussaint-2005',{title:'Godfried Toussaint (2005). The Euclidean algorithm generates traditional musical rhythms. Proceedings of BRIDGES: Mathematical Connections in Art, Music and Science, 47–56.',url:'https://archive.bridgesmathart.org/2005/bridges2005-47.html'});
SOURCE('m6-toussaint-2013',{title:'Godfried T. Toussaint (2013). The Geometry of Musical Rhythm: What Makes a “Good” Rhythm Good? CRC Press.'});
SOURCE('m6-bjorklund-2003',{title:'E. Bjorklund (2003). The theory of rep-rate pattern generation in the SNS timing system. SNS ASD Technical Note SNS-NOTE-CNTRL-99, Los Alamos National Laboratory.'});
SOURCE('m6-friberg-2002',{title:'Anders Friberg & Andreas Sundström (2002). Swing ratios and ensemble timing in jazz performance: evidence for a common rhythmic pattern. Music Perception 19(3), 333–349.',url:'https://doi.org/10.1525/mp.2002.19.3.333'});
SOURCE('m6-keil-1987',{title:'Charles Keil (1987). Participatory discrepancies and the power of music. Cultural Anthropology 2(3), 275–283.',url:'https://doi.org/10.1525/can.1987.2.3.02a00010'});
SOURCE('m6-clayton-2000',{title:'Martin Clayton (2000). Time in Indian Music: Rhythm, Metre, and Form in North Indian Rāg Performance. Oxford University Press.'});
SOURCE('m6-natyashastra',{title:'Nāṭyaśāstra, traditionally attributed to Bharata Muni (compiled c. 200 BCE–200 CE); chapters 28–33 treat music and tāla. Trans. M. Ghosh, 1950–1961.'});
SOURCE('m6-penalosa-2009',{title:'David Peñalosa (2009). The Clave Matrix: Afro-Cuban Rhythm: Its Principles and African Origins. Bembe Books.'});
SOURCE('m6-becker-1979',{title:'Judith Becker (1979). Time and tune in Java. In A. L. Becker & A. A. Yengoyan (eds), The Imagination of Reality, 197–210. Ablex.'});
SOURCE('m6-lindsay-1992',{title:'Jennifer Lindsay (1992). Javanese Gamelan: Traditional Orchestra of Indonesia (2nd edn). Oxford University Press.'});

LESSON({id:'beat-metre',name:'Beat and metre',short:'Metre',stage:'rhythm',year:'1894–1983',
 why:'A steady pulse, grouped into strong and weak beats, is the frame almost all rhythm is heard against, and listeners impose it even on identical clicks.',
 prior:['note-values'],level:'Core',references:['m6-bolton-1894','m6-lerdahl-jackendoff','m6-london-2004'],
 ids:['beat-metre','beat-metre-hierarchy','beat-metre-hemiola']});
LESSON({id:'syncopation',name:'Syncopation',short:'Syncopation',stage:'rhythm',year:'1984–2014',
 why:'Accents placed where the metre is weak create tension against the beat, and a moderate amount of it is what makes people want to dance.',
 prior:['beat-metre'],level:'Core',references:['m6-lhl-1984','m6-danielsen-2006','m6-witek-2014'],
 ids:['syncopation','syncopation-backbeat','syncopation-groove']});
LESSON({id:'polyrhythm',name:'Polyrhythm',short:'Polyrhythm',stage:'rhythm',year:'Many traditions',
 why:'Two even pulses at once, such as three against two, form a composite rhythm and let the ear choose which one is the beat: a foundation of much West African music.',
 prior:['beat-metre'],level:'Core',references:['m6-arom-1991','m6-agawu-2006','m6-london-2004'],
 ids:['polyrhythm','polyrhythm-composite','polyrhythm-bell']});
LESSON({id:'euclidean-rhythms',name:'Euclidean rhythms',short:'Euclidean',stage:'rhythm',year:'2003–2005',
 why:'Spreading k hits as evenly as possible over n steps, with the same steps as Euclid’s algorithm, reproduces many traditional rhythms.',
 prior:['polyrhythm'],level:'Extension',references:['m6-toussaint-2005','m6-bjorklund-2003','m6-toussaint-2013'],
 ids:['euclidean-rhythms','euclidean-rhythms-bjorklund','euclidean-rhythms-necklace']});
LESSON({id:'swing-groove',name:'Swing and microtiming',short:'Swing',stage:'rhythm',year:'1987–2002',
 why:'Players stretch and shift notes by tens of milliseconds in ways notation does not show; the swing ratio and small offsets between players shape the feel.',
 prior:['syncopation'],level:'Core',references:['m6-friberg-2002','m6-keil-1987'],
 ids:['swing-groove','swing-groove-tempo','swing-groove-microtiming']});
LESSON({id:'rhythmic-cycles',name:'Rhythmic cycles',short:'Cycles',stage:'rhythm',year:'c. 200 BCE–today',
 why:'Many traditions organise time as a repeating cycle with a marked point of arrival: Indian tala, the Cuban clave and the Javanese gong cycle.',
 prior:['polyrhythm','euclidean-rhythms'],level:'Core',references:['m6-natyashastra','m6-clayton-2000','m6-penalosa-2009','m6-becker-1979','m6-lindsay-1992'],
 ids:['rhythmic-cycles','rhythmic-cycles-clave','rhythmic-cycles-gamelan']});

THREAD({id:'m6-time',name:'Keeping time',ids:['note-values','beat-metre','swing-groove','beat-entrainment']});
THREAD({id:'m6-even',name:'Even spacing, from scales to rhythms',ids:['pentatonic-scales','euclidean-rhythms','polyrhythm-bell','rhythmic-cycles-clave']});
