/* Ted Nelson era 1 · Before hypertext: lessons, sources and connections. */
SOURCE('t1-bush-1945',{title:'Bush, V. (1945). As We May Think. The Atlantic Monthly 176(1), 101–108.',url:'https://www.theatlantic.com/magazine/archive/1945/07/as-we-may-think/303881/'});
SOURCE('t1-nyce-kahn',{title:'Nyce, J. M. & Kahn, P. (eds) (1991). From Memex to Hypertext: Vannevar Bush and the Mind’s Machine. Academic Press.'});
SOURCE('t1-barnet',{title:'Barnet, B. (2013). Memory Machines: The Evolution of Hypertext. Anthem Press.'});
SOURCE('t1-meyer-1971',{title:'Meyer, D. E. & Schvaneveldt, R. W. (1971). Facilitation in recognizing pairs of words. Journal of Experimental Psychology 90, 227–234.',url:'https://doi.org/10.1037/h0031564'});
SOURCE('t1-collins-loftus',{title:'Collins, A. M. & Loftus, E. F. (1975). A spreading-activation theory of semantic processing. Psychological Review 82, 407–428.',url:'https://doi.org/10.1037/0033-295X.82.6.407'});
SOURCE('t1-hebb',{title:'Hebb, D. O. (1949). The Organization of Behavior. Wiley.'});
SOURCE('t1-computer-lib',{title:'Nelson, T. H. (1974). Computer Lib/Dream Machines. Self-published; revised edition Microsoft Press, 1987.'});
SOURCE('t1-literary-machines',{title:'Nelson, T. H. (1981). Literary Machines. Mindful Press.'});
SOURCE('t1-bolter',{title:'Bolter, J. D. (1991). Writing Space: The Computer, Hypertext, and the History of Writing. Lawrence Erlbaum.'});
SOURCE('t1-possiplex',{title:'Nelson, T. H. (2010). Possiplex: Movies, Intellect, Creative Control, My Computer Life and the Fight for Civilization. Mindful Press.'});
SOURCE('t1-luhmann',{title:'Luhmann, N. (1981). Kommunikation mit Zettelkästen: ein Erfahrungsbericht. In Baier, Kepplinger & Reumann (eds), Öffentliche Meinung und sozialer Wandel. Westdeutscher Verlag.'});
SOURCE('t1-schmidt',{title:'Schmidt, J. F. K. (2016). Niklas Luhmann’s card index: thinking tool, communication partner, publication machine. In Cevolini (ed.), Forgetting Machines. Brill.'});
SOURCE('t1-new-media-reader',{title:'Wardrip-Fruin, N. & Montfort, N. (eds) (2003). The New Media Reader. MIT Press (includes Bush 1945 and extracts from Nelson).'});
SOURCE('t1-hci',{title:'HCI In Motion: the hypertext lesson, from the interface side (memex, transclusion, lost in hyperspace).',url:'https://hci-in-motion.puter.site/'});
SOURCE('t1-thinkers',{title:'Thinkers In Motion: the people behind the ideas.',url:'https://thinkers-in-motion.puter.site/'});

LESSON({id:'memex',name:'The memex',short:'Memex',stage:'roots',year:'1945',level:'Introduction',
 why:'Bush’s imagined desk joined any two documents with a key press, the idea Nelson would later build on.',
 prior:[],references:['t1-bush-1945','t1-nyce-kahn','t1-barnet','t1-hci'],
 ids:['memex','memex-trails','memex-indexing']});
LESSON({id:'associative-trails',name:'Associative trails',short:'Trails',stage:'roots',year:'1945–1975',level:'Core',
 why:'Bush grounded the memex in a claim about the mind, that it moves by association; later experiments measured that claim.',
 prior:['memex'],references:['t1-bush-1945','t1-hebb','t1-meyer-1971','t1-collins-loftus'],
 ids:['associative-trails','associative-trails-spreading','associative-trails-blazers']});
LESSON({id:'non-sequential-writing',name:'Non-sequential writing',short:'Non-sequential',stage:'roots',year:'1960s',level:'Introduction',
 why:'Nelson’s core insight: ideas form a web, and paper forces them into a single line.',
 prior:['associative-trails'],references:['t1-computer-lib','t1-literary-machines','t1-bolter'],
 ids:['non-sequential-writing','non-sequential-writing-orders','non-sequential-writing-precedents']});
LESSON({id:'index-cards',name:'Index cards',short:'Index cards',stage:'roots',year:'1950s–1960',level:'Introduction',
 why:'Cards could sit in only one place; ideas belonged in many. A 1960 term project set out to fix that.',
 prior:['non-sequential-writing'],references:['t1-possiplex','t1-barnet','t1-luhmann','t1-schmidt','t1-new-media-reader','t1-thinkers'],
 ids:['index-cards','index-cards-zettel','index-cards-harvard']});

THREAD({id:'t1-association',name:'Association and the mind',ids:['memex','associative-trails','associative-trails-spreading','non-sequential-writing','reading-hypertext']});
THREAD({id:'t1-addresses',name:'Permanent addresses',ids:['index-cards-zettel','tumblers','content-addressing']});
THREAD({id:'t1-one-place',name:'One note, many places',ids:['index-cards','transclusion','backlinks']});
THREAD({id:'t1-trails',name:'Trails made for others',ids:['memex-trails','associative-trails-blazers','backlinks']});
