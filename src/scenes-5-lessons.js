/* Ted Nelson In Motion · era 5 · Xanadu’s design: lessons, sources and connections. */
SOURCE('t5-literary-machines',{title:'Nelson, T. H. (1981). Literary Machines. Mindful Press (many later editions).',url:'https://en.wikipedia.org/wiki/Literary_Machines'});
SOURCE('t5-heart-1995',{title:'Nelson, T. H. (1995). The heart of connection: hypermedia unified by transclusion. Communications of the ACM 38(8), 31–33.',url:'https://doi.org/10.1145/208344.208353'});
SOURCE('t5-xanalogical-1999',{title:'Nelson, T. H. (1999). Xanalogical structure, needed now more than ever: parallel documents, deep links to content, deep versioning, and deep re-use. ACM Computing Surveys 31(4es).'});
SOURCE('t5-transcopyright-1997',{title:'Nelson, T. H. (1997). Transcopyright: dealing with the dilemma of digital copyright. Educom Review 32(1), 32–35.'});
SOURCE('t5-halasz-1988',{title:'Halasz, F. G. (1988). Reflections on NoteCards: seven issues for the next generation of hypermedia systems. Communications of the ACM 31(7), 836–852.',url:'https://doi.org/10.1145/48511.48514'});
SOURCE('t5-davis-1998',{title:'Davis, H. C. (1998). Referential integrity of links in open hypermedia systems. Proceedings of ACM Hypertext ’98, 207–216.'});
SOURCE('t5-szabo-1999',{title:'Szabo, N. (1999). Micropayments and mental transaction costs. 2nd Berlin Internet Economics Workshop.'});
SOURCE('t5-shirky-2000',{title:'Shirky, C. (2000). The case against micropayments. O’Reilly OpenP2P, 19 December 2000.'});
SOURCE('t5-odlyzko-2003',{title:'Odlyzko, A. (2003). The case against micropayments. Financial Cryptography 2003, Lecture Notes in Computer Science 2742, 77–83.'});
SOURCE('t5-lessig-2004',{title:'Lessig, L. (2004). Free Culture. Penguin Press.',url:'https://archive.org/details/free_culture'});
SOURCE('t5-udanax',{title:'Udanax: the Xanadu Green and Gold back ends, released as open source in 1999.',url:'https://en.wikipedia.org/wiki/Project_Xanadu'});
SOURCE('t5-hci',{title:'HCI In Motion: the hypertext lesson places transclusion and two-way links in the wider history of interfaces.',url:'https://hci-in-motion.puter.site/'});
SOURCE('t5-cs',{title:'Computer Science In Motion: hashing, trees and version control, the machinery behind permanent addresses.',url:'https://computer-science-in-motion.puter.site/'});

LESSON({id:'transclusion',name:'Transclusion',short:'Transclusion',stage:'xanadu',year:'1981',level:'Core',
 why:'Nelson’s central idea: quote by reference so that every quotation stays connected to its source, its author and its versions.',
 prior:['coining-hypertext','version-history'],references:['t5-literary-machines','t5-heart-1995','t5-xanalogical-1999','t5-hci'],
 ids:['transclusion','transclusion-versions','transclusion-storage']});
LESSON({id:'two-way-links',name:'Two-way links',short:'Two-way links',stage:'xanadu',year:'1981',level:'Core',
 why:'Links that both ends can see, attached to words rather than positions, and the coordination they demand.',
 prior:['transclusion','associative-trails'],references:['t5-literary-machines','t5-xanalogical-1999','t5-davis-1998','t5-halasz-1988'],
 ids:['two-way-links','two-way-links-spans','two-way-links-scale']});
LESSON({id:'transcopyright',name:'Transcopyright',short:'Transcopyright',stage:'xanadu',year:'1981–1997',level:'Core',
 why:'A deal for quoting in a connected world: permission granted in advance, credit kept, a royalty for every reading, and why tiny payments proved hard.',
 prior:['transclusion'],references:['t5-literary-machines','t5-transcopyright-1997','t5-szabo-1999','t5-shirky-2000','t5-odlyzko-2003','t5-lessig-2004'],
 ids:['transcopyright','transcopyright-compare','transcopyright-micropayments']});
LESSON({id:'tumblers',name:'Tumblers and permanent addresses',short:'Tumblers',stage:'xanadu',year:'1981',level:'Advanced',
 why:'How Xanadu planned to give every server, document, version and character an address that never changes.',
 prior:['transclusion','two-way-links'],references:['t5-literary-machines','t5-udanax','t5-cs'],
 ids:['tumblers','tumblers-insert','tumblers-append']});

THREAD({id:'t5-permanence',name:'Designed to keep everything',ids:['version-history','transclusion-versions','tumblers','tumblers-append','link-rot','content-addressing']});
THREAD({id:'t5-links',name:'What a link should be',ids:['associative-trails','two-way-links','two-way-links-spans','embedded-markup-links','backlinks']});
THREAD({id:'t5-quoting',name:'Quoting with credit',ids:['transclusion','transcopyright','transcopyright-compare','open-xanadu']});
