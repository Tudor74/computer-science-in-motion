/* Ted Nelson era 7 · Later structures (1995–2014): lessons, sources and connections. */
SOURCE('t7-nelson-2004',{title:'Nelson, T. H. (2004). A cosmology for a different computer universe: data model, mechanisms, virtual machine and visualization infrastructure. Journal of Digital Information 5(1).'});
SOURCE('t7-nelson-1999',{title:'Nelson, T. H. (1999). Xanalogical structure, needed now more than ever: parallel documents, deep links to content, deep versioning, and deep re-use. ACM Computing Surveys 31(4es).'});
SOURCE('t7-nelson-1981',{title:'Nelson, T. H. (1981). Literary Machines. Mindful Press (later editions to 1993).'});
SOURCE('t7-nelson-1974',{title:'Nelson, T. H. (1974). Computer Lib/Dream Machines. Self-published; revised edition Microsoft Press, 1987.'});
SOURCE('t7-nelson-2010',{title:'Nelson, T. H. (2010). Possiplex: Movies, Intellect, Creative Control, My Computer Life and the Fight for Civilization. Mindful Press. His own account of ZigZag, Xanadu Space and OpenXanadu.'});
SOURCE('t7-xanadu-wiki',{title:'Project Xanadu: overview and history (Wikipedia).',url:'https://en.wikipedia.org/wiki/Project_Xanadu'});
SOURCE('t7-zigzag-wiki',{title:'ZigZag (software): overview (Wikipedia).',url:'https://en.wikipedia.org/wiki/ZigZag_(software)'});
SOURCE('t7-barnet',{title:'Barnet, B. (2013). Memory Machines: The Evolution of Hypertext. Anthem Press. Chapters on Xanadu’s long development.'});
SOURCE('t7-hunt-mcilroy',{title:'Hunt, J. W. & McIlroy, M. D. (1976). An algorithm for differential file comparison. Bell Laboratories Computing Science Technical Report 41.'});
SOURCE('t7-chandler-sweller',{title:'Chandler, P. & Sweller, J. (1991). Cognitive load theory and the format of instruction. Cognition and Instruction 8(4), 293–332.'});
SOURCE('t7-web-annotation',{title:'W3C (2017). Web Annotation Data Model. W3C Recommendation.',url:'https://www.w3.org/TR/annotation-model/'});
SOURCE('t7-hci',{title:'HCI In Motion: hypertext, transclusion and two-way links from the interface side.',url:'https://hci-in-motion.puter.site/'});
SOURCE('t7-thinkers',{title:'Thinkers In Motion: the people behind the ideas, including Ted Nelson.',url:'https://thinkers-in-motion.puter.site/'});

LESSON({id:'zigzag',name:'ZigZag',short:'ZigZag',stage:'later',year:'mid-1990s',level:'Core',
 why:'Nelson’s answer to files, folders and tables: cells joined along as many dimensions as the data needs, seen two at a time.',
 prior:['zippered-lists','non-sequential-writing'],references:['t7-nelson-2004','t7-zigzag-wiki','t7-nelson-2010','t7-nelson-1974'],
 ids:['zigzag','zigzag-ranks','zigzag-compare']});
LESSON({id:'xanadu-space',name:'Xanadu Space',short:'Xanadu Space',stage:'later',year:'2000s',level:'Core',
 why:'Seeing transclusion: documents float side by side and every borrowed passage is joined to its source by a beam.',
 prior:['transclusion','two-way-links'],references:['t7-nelson-1999','t7-nelson-1981','t7-nelson-2010','t7-hci'],
 ids:['xanadu-space','xanadu-space-quote','xanadu-space-follow']});
LESSON({id:'open-xanadu',name:'OpenXanadu',short:'OpenXanadu',stage:'later',year:'2014',level:'Advanced',
 why:'A working demonstration on today’s web: documents as lists of spans over permanent content, with links kept apart.',
 prior:['tumblers','transclusion'],references:['t7-nelson-1999','t7-nelson-1981','t7-xanadu-wiki','t7-web-annotation','t7-barnet'],
 ids:['open-xanadu','open-xanadu-permanent','open-xanadu-links']});
LESSON({id:'parallel-documents',name:'Parallel documents',short:'Parallel docs',stage:'later',year:'1965–2014',level:'Core',
 why:'Related texts side by side with their connections drawn: translations, versions, commentary, and the cost of searching without them.',
 prior:['version-history','xanadu-space'],references:['t7-nelson-1999','t7-hunt-mcilroy','t7-chandler-sweller','t7-nelson-1974','t7-thinkers'],
 ids:['parallel-documents','parallel-documents-versions','parallel-documents-search']});

THREAD({id:'t7-transclusion',name:'Transclusion, from design to demo',ids:['transclusion','xanadu-space','xanadu-space-quote','open-xanadu','content-addressing-transclusion']});
THREAD({id:'t7-permanence',name:'Content that never moves',ids:['tumblers','open-xanadu-permanent','content-addressing','content-addressing-merkle']});
THREAD({id:'t7-versions',name:'Every version kept',ids:['version-history','parallel-documents-versions','content-addressing-merkle']});
THREAD({id:'t7-links-apart',name:'Links outside documents',ids:['two-way-links','open-xanadu-links','backlinks']});
