/* Era 3 · The desktop: lessons, sources and connections. */
SOURCE('star-1982',{title:'Smith, Irby, Kimball & Verplank (1982). Designing the Star user interface. Byte 7(4)',url:'https://en.wikipedia.org/wiki/Xerox_Star'});
SOURCE('alto',{title:'Thacker, McCreight, Lampson, Sproull & Boggs (1979). Alto: a personal computer. Xerox PARC',url:'https://en.wikipedia.org/wiki/Xerox_Alto'});
SOURCE('callahan-1988',{title:'Callahan, Hopkins, Weiser & Shneiderman (1988). An empirical comparison of pie vs. linear menus. Proc. CHI ’88',url:'https://doi.org/10.1145/57167.57182'});
SOURCE('neale-carroll-1997',{title:'Neale & Carroll (1997). The role of metaphors in user interface design. In Handbook of Human–Computer Interaction (2nd edn)'});
SOURCE('kay-1972',{title:'Kay (1972). A personal computer for children of all ages. Proc. ACM National Conference',url:'https://en.wikipedia.org/wiki/Dynabook'});
SOURCE('kay-goldberg-1977',{title:'Kay & Goldberg (1977). Personal dynamic media. IEEE Computer 10(3)',url:'https://doi.org/10.1109/C-M.1977.217672'});
SOURCE('papert-1980',{title:'Papert (1980). Mindstorms: Children, Computers, and Powerful Ideas. Basic Books',url:'https://en.wikipedia.org/wiki/Mindstorms_(book)'});
SOURCE('bruner-1966',{title:'Bruner (1966). Toward a Theory of Instruction. Harvard University Press'});
SOURCE('kay-1990',{title:'Kay (1990). User interface: a personal view. In Laurel (ed.), The Art of Human–Computer Interface Design. Addison-Wesley'});
SOURCE('shneiderman-1983',{title:'Shneiderman (1983). Direct manipulation: a step beyond programming languages. IEEE Computer 16(8)',url:'https://doi.org/10.1109/MC.1983.1654471'});
SOURCE('hutchins-1985',{title:'Hutchins, Hollan & Norman (1985). Direct manipulation interfaces. Human–Computer Interaction 1(4)',url:'https://doi.org/10.1207/s15327051hci0104_2'});
SOURCE('norman-1986',{title:'Norman (1986). Cognitive engineering. In Norman & Draper (eds.), User Centered System Design. Lawrence Erlbaum'});
SOURCE('abowd-dix-1992',{title:'Abowd & Dix (1992). Giving undo attention. Interacting with Computers 4(3)',url:'https://doi.org/10.1016/0953-5438(92)90021-7'});
SOURCE('card-1980',{title:'Card, Moran & Newell (1980). The keystroke-level model for user performance time with interactive systems. Communications of the ACM 23(7)',url:'https://doi.org/10.1145/358886.358895'});
SOURCE('card-1983',{title:'Card, Moran & Newell (1983). The Psychology of Human–Computer Interaction. Lawrence Erlbaum',url:'https://en.wikipedia.org/wiki/GOMS'});
SOURCE('john-kieras-1996',{title:'John & Kieras (1996). The GOMS family of user interface analysis techniques: comparison and contrast. ACM TOCHI 3(4)',url:'https://doi.org/10.1145/235833.236054'});
SOURCE('visicalc',{title:'VisiCalc (Bricklin & Frankston, 1979)',url:'https://en.wikipedia.org/wiki/VisiCalc'});
SOURCE('nardi-1993',{title:'Nardi (1993). A Small Matter of Programming: Perspectives on End User Computing. MIT Press'});
SOURCE('panko-1998',{title:'Panko (1998). What we know about spreadsheet errors. Journal of End User Computing 10(2)'});
SOURCE('herndon-2013',{title:'Herndon, Ash & Pollin (2013). Does high public debt consistently stifle economic growth? Cambridge Journal of Economics',url:'https://doi.org/10.1093/cje/bet075'});
SOURCE('bravo',{title:'Bravo, the first WYSIWYG editor (Lampson & Simonyi, Xerox PARC, 1974)',url:'https://en.wikipedia.org/wiki/Bravo_(editor)'});
SOURCE('reid-1980',{title:'Reid (1980). Scribe: a document specification language and its compiler. PhD thesis, Carnegie Mellon University',url:'https://en.wikipedia.org/wiki/Scribe_(markup_language)'});
SOURCE('crow-1977',{title:'Crow (1977). The aliasing problem in computer-generated shaded images. Communications of the ACM 20(11)',url:'https://doi.org/10.1145/359863.359869'});
SOURCE('apple-hig-1987',{title:'Apple Computer (1987). Human Interface Guidelines: The Apple Desktop Interface. Addison-Wesley'});
SOURCE('nielsen-1989',{title:'Nielsen (ed.) (1989). Coordinating User Interfaces for Consistency. Academic Press'});

LESSON({id:'wimp',name:'Windows, icons, menus, pointer',short:'WIMP',stage:'desktop',year:'1973–1981',why:'The Alto and Star made the screen a desk of overlapping documents, borrowed office objects as icons, and put commands in menus.',prior:['mouse','sketchpad'],level:'Introduction',references:['alto','star-1982','callahan-1988','neale-carroll-1997'],ids:['wimp','wimp-desktop-metaphor','wimp-menus']});
LESSON({id:'dynabook',name:'The Dynabook and Logo',short:'Dynabook',stage:'desktop',year:'1972',why:'Kay and Papert saw the computer as a medium children could think and build with, and designed for doing, seeing and symbolising.',prior:['augmenting-intellect','wimp'],level:'Introduction',references:['kay-1972','kay-goldberg-1977','papert-1980','bruner-1966','kay-1990'],ids:['dynabook','dynabook-turtle','dynabook-bruner']});
LESSON({id:'direct-manipulation',name:'Direct manipulation',short:'Direct manip.',stage:'desktop',year:'1983',why:'Showing objects, acting on them physically and making every action reversible narrows the gaps between intention and result.',prior:['wimp','command-line'],level:'Core',references:['shneiderman-1983','hutchins-1985','norman-1986','abowd-dix-1992'],ids:['direct-manipulation','direct-manipulation-gulfs','direct-manipulation-undo']});
LESSON({id:'keystroke-model',name:'Predicting performance: KLM and GOMS',short:'KLM & GOMS',stage:'desktop',year:'1980–1983',why:'Card, Moran and Newell turned psychology into engineering: add up standard step times to predict how long an expert will take.',prior:['fitts-law','hick-law','direct-manipulation'],level:'Core',references:['card-1980','card-1983','john-kieras-1996'],ids:['keystroke-model','keystroke-model-compare','keystroke-model-processor']});
LESSON({id:'spreadsheet',name:'The spreadsheet',short:'Spreadsheet',stage:'desktop',year:'1979',why:'A grid of live formulas let millions of non-programmers build models, and showed how easily hidden errors spread.',prior:['direct-manipulation'],level:'Introduction',references:['visicalc','nardi-1993','panko-1998','herndon-2013'],ids:['spreadsheet','spreadsheet-references','spreadsheet-errors']});
LESSON({id:'wysiwyg',name:'WYSIWYG, fonts and consistency',short:'WYSIWYG',stage:'desktop',year:'1974–1987',why:'Bitmap screens could show a page as it would print, and shared guidelines made every program behave alike.',prior:['wimp','direct-manipulation'],level:'Core',references:['bravo','reid-1980','crow-1977','apple-hig-1987','nielsen-1989'],ids:['wysiwyg','wysiwyg-bitmap-fonts','wysiwyg-consistency']});

THREAD({id:'h3-predict',name:'Predicting human performance',ids:['fitts-law','wimp-menus','keystroke-model','keystroke-model-processor']});
THREAD({id:'h3-gulfs',name:'Seeing what to do and what happened',ids:['command-line','direct-manipulation','direct-manipulation-gulfs','mental-models']});
THREAD({id:'h3-pixels',name:'From lamps to pixels',ids:['front-panel','light-pen','wysiwyg-bitmap-fonts']});
