/* Ted Nelson era 2 · Naming hypertext: lessons, sources and connections. */
SOURCE('t2-nelson-1965',{title:'Nelson, T. H. (1965). Complex information processing: a file structure for the complex, the changing and the indeterminate. Proceedings of the ACM 20th National Conference, 84–100.',url:'https://doi.org/10.1145/800197.806036'});
SOURCE('t2-literary-machines',{title:'Nelson, T. H. (1981). Literary Machines. Mindful Press.'});
SOURCE('t2-xanalogical',{title:'Nelson, T. H. (1999). Xanalogical structure, needed now more than ever: parallel documents, deep links to content, deep versioning, and deep re-use. ACM Computing Surveys 31(4es).'});
SOURCE('t2-computer-lib',{title:'Nelson, T. H. (1974). Computer Lib/Dream Machines. Self-published.'});
SOURCE('t2-bernstein',{title:'Bernstein, M. (1998). Patterns of hypertext. Proceedings of the ACM Conference on Hypertext ’98, 21–29.'});
SOURCE('t2-lippman',{title:'Lippman, A. (1980). Movie-maps: an application of the optical videodisc to computer graphics. Proceedings of SIGGRAPH ’80, 32–42.'});
SOURCE('t2-engelbart-1968',{title:'Engelbart, D. C. & English, W. K. (1968). A research center for augmenting human intellect. AFIPS Fall Joint Computer Conference, 395–410.'});
SOURCE('t2-berners-lee-1989',{title:'Berners-Lee, T. (1989). Information management: a proposal. CERN.',url:'https://www.w3.org/History/1989/proposal.html'});
SOURCE('t2-hunt-mcilroy',{title:'Hunt, J. W. & McIlroy, M. D. (1976). An algorithm for differential file comparison. Bell Laboratories Computing Science Technical Report 41.'});
SOURCE('t2-rochkind',{title:'Rochkind, M. J. (1975). The Source Code Control System. IEEE Transactions on Software Engineering SE-1(4), 364–370.'});
SOURCE('t2-vitter',{title:'Vitter, J. S. (1984). US&R: a new framework for redoing. IEEE Software 1(4), 39–52.'});
SOURCE('t2-barnet',{title:'Barnet, B. (2013). Memory Machines: The Evolution of Hypertext. Anthem Press.'});
SOURCE('t2-cs',{title:'Computer Science In Motion: data structures, diffs and version control from the computing side.',url:'https://computer-science-in-motion.puter.site/'});

LESSON({id:'coining-hypertext',name:'Coining “hypertext”',short:'Hypertext',stage:'hypertext',year:'1965',level:'Introduction',
 why:'A 1965 conference paper gave the idea a name and a test: material too interconnected for paper.',
 prior:['non-sequential-writing'],references:['t2-nelson-1965','t2-literary-machines','t2-barnet'],
 ids:['coining-hypertext','coining-hypertext-file','coining-hypertext-words']});
LESSON({id:'zippered-lists',name:'Zippered lists',short:'Zippered lists',stage:'hypertext',year:'1965',level:'Core',
 why:'Nelson’s first file structure: entries, lists and links, with two lists joined part by part like a zip.',
 prior:['coining-hypertext','index-cards'],references:['t2-nelson-1965','t2-xanalogical'],
 ids:['zippered-lists','zippered-lists-elf','zippered-lists-uses']});
LESSON({id:'hypermedia',name:'Hypermedia',short:'Hypermedia',stage:'hypertext',year:'1965–2000s',level:'Core',
 why:'The same idea for film, pictures and sound, which took decades of hardware to arrive.',
 prior:['coining-hypertext'],references:['t2-nelson-1965','t2-computer-lib','t2-bernstein','t2-lippman','t2-engelbart-1968','t2-berners-lee-1989'],
 ids:['hypermedia','hypermedia-branching','hypermedia-later']});
LESSON({id:'version-history',name:'Version history',short:'Versions',stage:'hypertext',year:'1965',level:'Core',
 why:'Nelson wanted every draft kept and any two compared, long before version control was ordinary.',
 prior:['zippered-lists','index-cards-harvard'],references:['t2-nelson-1965','t2-hunt-mcilroy','t2-rochkind','t2-vitter','t2-cs'],
 ids:['version-history','version-history-storage','version-history-undo']});

THREAD({id:'t2-parallel',name:'Parallel texts',ids:['zippered-lists','zippered-lists-uses','parallel-documents','open-xanadu']});
THREAD({id:'t2-versions',name:'Keeping every version',ids:['index-cards-harvard','version-history','version-history-storage','version-history-undo','content-addressing']});
THREAD({id:'t2-one-entry',name:'One note, many places',ids:['zippered-lists-elf','transclusion']});
THREAD({id:'t2-branching',name:'Branching media',ids:['hypermedia','hypermedia-branching','hypermedia-later','stretchtext']});
