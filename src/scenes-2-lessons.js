/* Mind era 2 · Learning and behaviour (1885–1950): lessons, sources and connections. */
SOURCE('d2-ebbinghaus',{title:'Ebbinghaus, H. (1885). Über das Gedächtnis. Trans. Ruger & Bussenius (1913), Memory: A Contribution to Experimental Psychology.',url:'https://psychclassics.yorku.ca/Ebbinghaus/index.htm'});
SOURCE('d2-murre-dros',{title:'Murre, J. M. J. & Dros, J. (2015). Replication and analysis of Ebbinghaus’ forgetting curve. PLoS ONE 10(7), e0120644.',url:'https://doi.org/10.1371/journal.pone.0120644'});
SOURCE('d2-wixted',{title:'Wixted, J. T. & Ebbesen, E. B. (1991). On the form of forgetting. Psychological Science 2, 409–415.'});
SOURCE('d2-calkins',{title:'Calkins, M. W. (1896). Association: an essay analytic and experimental. Psychological Review Monograph Supplements 1(2).'});
SOURCE('d2-pavlov',{title:'Pavlov, I. P. (1927). Conditioned Reflexes, trans. G. V. Anrep. Oxford University Press.',url:'https://psychclassics.yorku.ca/Pavlov/'});
SOURCE('d2-garcia',{title:'Garcia, J. & Koelling, R. A. (1966). Relation of cue to consequence in avoidance learning. Psychonomic Science 4, 123–124.'});
SOURCE('d2-guttman',{title:'Guttman, N. & Kalish, H. I. (1956). Discriminability and stimulus generalization. Journal of Experimental Psychology 51, 79–88.'});
SOURCE('d2-watson-rayner',{title:'Watson, J. B. & Rayner, R. (1920). Conditioned emotional reactions. Journal of Experimental Psychology 3, 1–14.',url:'https://psychclassics.yorku.ca/Watson/emotion.htm'});
SOURCE('d2-powell',{title:'Powell, R. A., Digdon, N., Harris, B. & Smithson, C. (2014). Correcting the record on Watson, Rayner, and Little Albert. American Psychologist 69, 600–611.'});
SOURCE('d2-thorndike-1898',{title:'Thorndike, E. L. (1898). Animal intelligence: an experimental study of the associative processes in animals. Psychological Review Monograph Supplements 2(4).'});
SOURCE('d2-thorndike-1932',{title:'Thorndike, E. L. (1932). The Fundamentals of Learning. Teachers College, Columbia University.'});
SOURCE('d2-washburn',{title:'Washburn, M. F. (1908). The Animal Mind: A Text-book of Comparative Psychology. Macmillan.'});
SOURCE('d2-skinner-1981',{title:'Skinner, B. F. (1981). Selection by consequences. Science 213, 501–504.'});
SOURCE('d2-skinner-1938',{title:'Skinner, B. F. (1938). The Behavior of Organisms. Appleton-Century.'});
SOURCE('d2-ferster-skinner',{title:'Ferster, C. B. & Skinner, B. F. (1957). Schedules of Reinforcement. Appleton-Century-Crofts.'});
SOURCE('d2-humphreys',{title:'Humphreys, L. G. (1939). The effect of random alternation of reinforcement on the acquisition and extinction of conditioned eyelid reactions. Journal of Experimental Psychology 25, 141–158.'});
SOURCE('d2-tolman-honzik',{title:'Tolman, E. C. & Honzik, C. H. (1930). Introduction and removal of reward, and maze performance in rats. University of California Publications in Psychology 4, 257–275.'});
SOURCE('d2-tolman-1948',{title:'Tolman, E. C. (1948). Cognitive maps in rats and men. Psychological Review 55, 189–208.',url:'https://psychclassics.yorku.ca/Tolman/Maps/maps.htm'});
SOURCE('d2-okeefe',{title:'O’Keefe, J. & Dostrovsky, J. (1971). The hippocampus as a spatial map. Brain Research 34, 171–175.'});
SOURCE('d2-okeefe-nadel',{title:'O’Keefe, J. & Nadel, L. (1978). The Hippocampus as a Cognitive Map. Oxford University Press.'});
SOURCE('d2-wertheimer-1923',{title:'Wertheimer, M. (1923). Untersuchungen zur Lehre von der Gestalt II. Psychologische Forschung 4, 301–350 (translated as “Laws of organization in perceptual forms”).',url:'https://psychclassics.yorku.ca/Wertheimer/Forms/forms.htm'});
SOURCE('d2-wertheimer-1912',{title:'Wertheimer, M. (1912). Experimentelle Studien über das Sehen von Bewegung. Zeitschrift für Psychologie 61, 161–265.'});
SOURCE('d2-kubovy',{title:'Kubovy, M. & Wagemans, J. (1995). Grouping by proximity and multistability in dot lattices. Psychological Science 6, 225–234.'});
SOURCE('d2-wagemans',{title:'Wagemans, J. et al. (2012). A century of Gestalt psychology in visual perception I. Psychological Bulletin 138, 1172–1217.'});
SOURCE('d2-hci',{title:'HCI In Motion: Gestalt grouping applied to screen layout, in the sister course.',url:'https://hci-in-motion.puter.site/'});

LESSON({id:'forgetting-curve',name:'The forgetting curve',short:'Forgetting',stage:'learning',year:'1885',level:'Introduction',
 why:'Ebbinghaus showed that memory could be measured: learn a list yourself, see how fast forgetting runs, and why a power law fits it.',
 prior:['fechner-scaling','reaction-time'],references:['d2-ebbinghaus','d2-murre-dros','d2-wixted','d2-calkins'],
 ids:['forgetting-curve','forgetting-curve-savings','forgetting-curve-pairs']});
LESSON({id:'classical-conditioning',name:'Classical conditioning',short:'Conditioning',stage:'learning',year:'1897–1927',level:'Introduction',
 why:'A signal that predicts something important comes to trigger a response of its own: acquisition, extinction, timing and generalisation.',
 prior:['forgetting-curve'],references:['d2-pavlov','d2-garcia','d2-guttman','d2-watson-rayner','d2-powell'],
 ids:['classical-conditioning','classical-conditioning-timing','classical-conditioning-generalisation']});
LESSON({id:'law-of-effect',name:'The law of effect',short:'Law of effect',stage:'learning',year:'1898',level:'Core',
 why:'Escape Thorndike’s puzzle box yourself, see consequences select actions, and learn why he later dropped half of his own law.',
 prior:['classical-conditioning'],references:['d2-thorndike-1898','d2-thorndike-1932','d2-washburn','d2-skinner-1981'],
 ids:['law-of-effect','law-of-effect-selection','law-of-effect-punishment']});
LESSON({id:'operant-schedules',name:'Schedules of reinforcement',short:'Schedules',stage:'learning',year:'1938–1957',level:'Core',
 why:'The rule that links responses to rewards shapes behaviour over time; press a lever yourself and read your own cumulative record.',
 prior:['law-of-effect'],references:['d2-skinner-1938','d2-ferster-skinner','d2-humphreys'],
 ids:['operant-schedules','operant-schedules-press','operant-schedules-extinction']});
LESSON({id:'cognitive-maps',name:'Cognitive maps',short:'Cognitive maps',stage:'learning',year:'1930–1971',level:'Core',
 why:'Rats learn a maze without reward and may take new shortcuts: Tolman’s map in the head, later found in the hippocampus as place cells.',
 prior:['operant-schedules'],references:['d2-tolman-honzik','d2-tolman-1948','d2-okeefe','d2-okeefe-nadel'],
 ids:['cognitive-maps','cognitive-maps-shortcut','cognitive-maps-place-cells']});
LESSON({id:'gestalt-grouping',name:'Gestalt grouping',short:'Gestalt',stage:'learning',year:'1912–1923',level:'Introduction',
 why:'While behaviourists studied responses, Gestalt psychologists showed that perception organises wholes: report what you see in dot lattices and flashing lights.',
 prior:['weber-law'],references:['d2-wertheimer-1912','d2-wertheimer-1923','d2-kubovy','d2-wagemans','d2-hci'],
 ids:['gestalt-grouping','gestalt-grouping-principles','gestalt-grouping-phi']});

THREAD({id:'d2-participant',name:'You as the participant',ids:['forgetting-curve','forgetting-curve-pairs','law-of-effect','operant-schedules-press','cognitive-maps-shortcut','gestalt-grouping']});
THREAD({id:'d2-prediction',name:'Learning from prediction',ids:['classical-conditioning','classical-conditioning-timing','prediction-error']});
THREAD({id:'d2-retention',name:'Forgetting and remembering',ids:['forgetting-curve-savings','spacing-effect','testing-effect']});
THREAD({id:'d2-maps',name:'Maps in the brain',ids:['cognitive-maps','cognitive-maps-place-cells','receptive-fields','plasticity']});
THREAD({id:'d2-honesty',name:'Famous studies, weaker evidence',ids:['classical-conditioning-generalisation','cognitive-maps-shortcut','replication-crisis']});
