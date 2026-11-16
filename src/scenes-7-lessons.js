/* Music era 7 · Recording and electronic sound: lessons, sources and connections. */
SOURCE('m7-edison-1878',{title:'Edison, T. A. (1878). The phonograph and its future. North American Review 126.'});
SOURCE('m7-gelatt',{title:'Gelatt, R. (1977). The Fabulous Phonograph, 1877–1977. 2nd edn.'});
SOURCE('m7-katz',{title:'Katz, M. (2004). Capturing Sound: How Technology Has Changed Music. University of California Press.'});
SOURCE('m7-berliner',{title:'Berliner, E. (1887). US Patent 372,786, Gramophone.'});
SOURCE('m7-rice-kellogg',{title:'Rice, C. W. & Kellogg, E. W. (1925). Notes on the development of a new type of hornless loud speaker. Transactions of the AIEE 44.'});
SOURCE('m7-nyquist-1932',{title:'Nyquist, H. (1932). Regeneration theory. Bell System Technical Journal 11.'});
SOURCE('m7-schaeffer',{title:'Schaeffer, P. (1952). À la recherche d’une musique concrète. Éditions du Seuil.'});
SOURCE('m7-niebur',{title:'Niebur, L. (2010). Special Sound: The Creation and Legacy of the BBC Radiophonic Workshop. Oxford University Press.'});
SOURCE('m7-oram',{title:'Oram, D. (1972). An Individual Note of Music, Sound and Electronics. Galliard.'});
SOURCE('m7-moog',{title:'Moog, R. A. (1965). Voltage-controlled electronic music modules. Journal of the Audio Engineering Society 13(3).'});
SOURCE('m7-chowning',{title:'Chowning, J. M. (1973). The synthesis of complex audio spectra by means of frequency modulation. Journal of the Audio Engineering Society 21(7).'});
SOURCE('m7-pinch',{title:'Pinch, T. & Trocco, F. (2002). Analog Days: The Invention and Impact of the Moog Synthesizer. Harvard University Press.'});
SOURCE('m7-nyquist-1928',{title:'Nyquist, H. (1928). Certain topics in telegraph transmission theory. Transactions of the AIEE 47.'});
SOURCE('m7-shannon',{title:'Shannon, C. E. (1949). Communication in the presence of noise. Proceedings of the IRE 37(1).'});
SOURCE('m7-zwicker',{title:'Zwicker, E. & Fastl, H. (1990). Psychoacoustics: Facts and Models. Springer.'});
SOURCE('m7-brandenburg',{title:'Brandenburg, K. (1999). MP3 and AAC explained. AES 17th International Conference on High-Quality Audio Coding.'});
SOURCE('m7-midi',{title:'MIDI Manufacturers Association (1983). MIDI 1.0 Detailed Specification.',url:'https://midi.org/'});
SOURCE('m7-emim',{title:'Electronic Music In Motion: a companion course on electronic music, from tape to modular synths.',url:'https://electronic-music-in-motion.puter.site/'});
SOURCE('m7-mathews',{title:'Mathews, M. V. (1963). The digital computer as a musical instrument. Science 142(3592).'});

LESSON({id:'phonograph',name:'The phonograph',short:'Phonograph',stage:'electric',year:'1877',level:'Introduction',
 why:'For the first time sound could be kept: the air itself cut a groove that could later move the air again.',
 prior:['pitch-frequency','harmonic-series'],references:['m7-edison-1878','m7-berliner','m7-gelatt','m7-katz'],
 ids:['phonograph','phonograph-lateral','phonograph-three-minutes']});
LESSON({id:'microphones-speakers',name:'Microphones and loudspeakers',short:'Mics & speakers',stage:'electric',year:'1876–1930s',level:'Core',
 why:'Turning sound into electricity, and back, made amplification, broadcasting and electric instruments possible.',
 prior:['phonograph','fourier-timbre'],references:['m7-rice-kellogg','m7-nyquist-1932'],
 ids:['microphones-speakers','microphones-speakers-feedback','microphones-speakers-pickup']});
LESSON({id:'tape-music',name:'Tape music',short:'Tape music',stage:'electric',year:'1948–1960s',level:'Core',
 why:'Magnetic tape made recorded sound into a material to be cut, reversed, looped and layered, and composers made music from it.',
 prior:['microphones-speakers','envelope'],references:['m7-schaeffer','m7-niebur','m7-oram','m7-emim'],
 ids:['tape-music','tape-music-edit','tape-music-radiophonic']});
LESSON({id:'synthesis',name:'Synthesisers',short:'Synthesis',stage:'electric',year:'1964–1980s',level:'Core',
 why:'Building sounds from oscillators, filters and amplifiers gave musicians direct control over timbre.',
 prior:['fourier-timbre','envelope','harmonic-series'],references:['m7-moog','m7-chowning','m7-pinch','m7-emim'],
 ids:['synthesis','synthesis-voltage','synthesis-fm']});
LESSON({id:'digital-audio',name:'Digital audio',short:'Digital audio',stage:'electric',year:'1928–1990s',level:'Core',
 why:'Sound as a list of numbers can be copied perfectly, but only if it is sampled fast enough and measured finely enough.',
 prior:['pitch-frequency','tape-music'],references:['m7-nyquist-1928','m7-shannon','m7-zwicker','m7-brandenburg'],
 ids:['digital-audio','digital-audio-bits','digital-audio-compression']});
LESSON({id:'midi-sequencing',name:'MIDI and sequencing',short:'MIDI',stage:'electric',year:'1957–1983',level:'Core',
 why:'Sending instructions instead of sound let one keyboard play many instruments and let computers hold a whole score.',
 prior:['synthesis','note-values','beat-metre'],references:['m7-midi','m7-mathews'],
 ids:['midi-sequencing','midi-sequencing-roll','midi-sequencing-quantise']});

THREAD({id:'m7-fixed-media',name:'Music held still',ids:['neumes-staff','phonograph','tape-music','midi-sequencing']});
THREAD({id:'m7-building-timbre',name:'Building a timbre',ids:['fourier-timbre','synthesis','synthesis-fm']});
THREAD({id:'m7-time-grid',name:'Time on a grid',ids:['note-values','midi-sequencing-roll','midi-sequencing-quantise','swing-groove']});
