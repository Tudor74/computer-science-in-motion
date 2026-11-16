/* Music era 2 · Writing music down: lessons, sources and connections. */
SOURCE('guido-prologus',{title:'Guido of Arezzo, Prologus in antiphonarium (c. 1025)',note:'the coloured F and C lines'});
SOURCE('guido-micrologus',{title:'Guido of Arezzo, Micrologus (c. 1026)'});
SOURCE('guido-epistola',{title:'Guido of Arezzo, Epistola de ignoto cantu, letter to Brother Michael (c. 1030)',note:'the hymn Ut queant laxis as a memory aid'});
SOURCE('hiley-plainchant',{title:'David Hiley, Western Plainchant: A Handbook (Oxford, 1993)'});
SOURCE('apel-notation',{title:'Willi Apel, The Notation of Polyphonic Music 900–1600 (1942)'});
SOURCE('franco',{title:'Franco of Cologne, Ars cantus mensurabilis (c. 1280)'});
SOURCE('berger-hand',{title:'Karol Berger, “The hand and the art of memory”, Musica Disciplina 35 (1981)'});
SOURCE('curwen',{title:'John Curwen, Grammar of Vocal Music (1843), the tonic sol-fa method'});
SOURCE('glarean',{title:'Heinrich Glarean, Dodecachordon (1547)'});
SOURCE('powers-mode',{title:'Harold Powers and others, “Mode”, Grove Music Online',url:'https://www.oxfordmusiconline.com/'});
SOURCE('cairo-1932',{title:'Congress of Arab Music, Cairo (1932)',note:'documented the maqam systems then in use'});
SOURCE('marcus-maqam',{title:'Scott Marcus, Arab Music Theory in the Modern Period (PhD thesis, UCLA, 1989)'});
SOURCE('harley-978',{title:'“Sumer is icumen in”, British Library MS Harley 978 (c. 1250)'});
SOURCE('mann-fugue',{title:'Alfred Mann, The Study of Fugue (1958)'});
SOURCE('enchiriadis',{title:'Musica enchiriadis and Scolica enchiriadis (anonymous, c. 900)'});
SOURCE('anon4',{title:'Anonymous IV, De mensuris et discantu (c. 1280)',note:'names Leoninus and Perotinus'});
SOURCE('hildegard-symphonia',{title:'Hildegard of Bingen, Symphonia armonie celestium revelationum (c. 1150s–1170s)'});

LESSON({id:'neumes-staff',name:'Neumes and the staff',short:'The staff',stage:'notation',year:'c. 1025',level:'Introduction',
 why:'Lines on the page turned remembered shapes into exact pitches anyone could read.',prior:['pitch-frequency','monochord'],references:['guido-prologus','guido-micrologus','hiley-plainchant','apel-notation'],
 ids:['neumes-staff','neumes-staff-clefs','neumes-staff-read']});
LESSON({id:'solmisation',name:'Solmisation',short:'Sol-fa',stage:'notation',year:'c. 1030',level:'Introduction',
 why:'Sung syllables gave every step of the scale a name you can remember and sing.',prior:['neumes-staff'],references:['guido-epistola','berger-hand','curwen'],
 ids:['solmisation','solmisation-hand','solmisation-movable']});
LESSON({id:'note-values',name:'Note values and bars',short:'Note values',stage:'notation',year:'c. 1280',level:'Introduction',
 why:'Writing down how long notes last let several voices stay together from the page.',prior:['neumes-staff'],references:['franco','apel-notation'],
 ids:['note-values','note-values-bar','note-values-mensural']});
LESSON({id:'modes',name:'Modes and maqam',short:'Modes',stage:'notation',year:'800s–1547',level:'Core',
 why:'Where the tones and semitones fall gives each scale its character, and other traditions use pitches between the piano keys.',prior:['solmisation','pentatonic-scales'],references:['glarean','powers-mode','hiley-plainchant','cairo-1932','marcus-maqam'],
 ids:['modes','modes-melody','modes-maqam']});
LESSON({id:'canon-round',name:'Canon and round',short:'Canon',stage:'notation',year:'c. 1250',level:'Core',
 why:'One melody sung against itself is the simplest way to make several voices fit together.',prior:['note-values','modes'],references:['harley-978','mann-fugue'],
 ids:['canon-round','canon-round-harmony','canon-round-fifth']});
LESSON({id:'polyphony',name:'Organum and polyphony',short:'Polyphony',stage:'notation',year:'c. 900–1200',level:'Core',
 why:'Adding a second, then an independent, voice to chant began the long story of harmony.',prior:['modes','neumes-staff'],references:['enchiriadis','anon4','hildegard-symphonia','hiley-plainchant'],
 ids:['polyphony','polyphony-parallel','polyphony-hildegard']});

THREAD({id:'m2-fixing-pitch',name:'Fixing pitch',ids:['monochord','neumes-staff','solmisation']});
THREAD({id:'m2-voices',name:'Voices together',ids:['polyphony','canon-round','counterpoint']});
THREAD({id:'m2-writing-time',name:'Writing time down',ids:['note-values','beat-metre']});
THREAD({id:'m2-scales',name:'Scales and modes',ids:['pentatonic-scales','modes','major-minor']});
