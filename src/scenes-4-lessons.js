/* Ted Nelson era 4 · Computer Lib (1974): lessons, sources and connections. */
SOURCE('t4-nelson-1974',{title:'Nelson, T. H. (1974). Computer Lib / Dream Machines. Self-published, Chicago.'});
SOURCE('t4-nelson-1987',{title:'Nelson, T. H. (1987). Computer Lib / Dream Machines, revised edition. Tempus Books of Microsoft Press.'});
SOURCE('t4-nelson-1980',{title:'Nelson, T. H. (1980). Interactive systems and the design of virtuality. Creative Computing 6(11) and 6(12).'});
SOURCE('t4-lovelace-1843',{title:'Menabrea, L. F. (1843). Sketch of the Analytical Engine invented by Charles Babbage, with notes by the translator, A. A. Lovelace. Scientific Memoirs 3, 666–731.'});
SOURCE('t4-roberts-1975',{title:'Roberts, H. E. & Yates, W. (1975). Altair 8800 minicomputer. Popular Electronics 7(1), 33–38.'});
SOURCE('t4-bernerslee-1991',{title:'Berners-Lee, T. (1991). WorldWideWeb: summary. Posted to the alt.hypertext newsgroup, 6 August 1991.'});
SOURCE('t4-leuf-2001',{title:'Leuf, B. & Cunningham, W. (2001). The Wiki Way: Quick Collaboration on the Web. Addison-Wesley.'});
SOURCE('t4-mayer-2009',{title:'Mayer, R. E. (2009). Multimedia Learning, 2nd edn. Cambridge University Press.'});
SOURCE('t4-carroll-1984',{title:'Carroll, J. M. & Carrithers, C. (1984). Training wheels in a user interface. Communications of the ACM 27(8), 800–806.',url:'https://doi.org/10.1145/358198.358218'});
SOURCE('t4-hunt-1976',{title:'Hunt, J. W. & McIlroy, M. D. (1976). An algorithm for differential file comparison. Bell Laboratories Computing Science Technical Report 41.'});
SOURCE('t4-rochkind-1975',{title:'Rochkind, M. J. (1975). The Source Code Control System. IEEE Transactions on Software Engineering SE-1(4), 364–370.'});
SOURCE('t4-grad-2007',{title:'Grad, B. (2007). The creation and the demise of VisiCalc. IEEE Annals of the History of Computing 29(3), 20–31.'});
SOURCE('t4-buzan-1974',{title:'Buzan, T. (1974). Use Your Head. BBC Books.'});
SOURCE('t4-cs',{title:'Computer Science In Motion: how symbols become numbers, from bits to programs.',url:'https://computer-science-in-motion.puter.site/'});
SOURCE('t4-thinkers',{title:'Thinkers In Motion: the people behind the ideas.',url:'https://thinkers-in-motion.puter.site/'});

LESSON({id:'computer-lib',name:'Computer Lib',short:'Computer Lib',stage:'computerlib',year:'1974',level:'Introduction',
 why:'A self-published manifesto told ordinary readers that they can and must understand computers, and named the tricks used to keep them from trying.',
 prior:['coining-hypertext','hes-brown'],references:['t4-nelson-1974','t4-nelson-1987','t4-lovelace-1843','t4-cs','t4-thinkers'],
 ids:['computer-lib','computer-lib-cybercrud','computer-lib-everything']});
LESSON({id:'dream-machines',name:'Dream Machines',short:'Dream Machines',stage:'computerlib',year:'1974',level:'Core',
 why:'The book’s other half imagined media that branch and respond, decades before most of them became ordinary.',
 prior:['computer-lib','stretchtext','hypermedia'],references:['t4-nelson-1974','t4-roberts-1975','t4-bernerslee-1991','t4-leuf-2001'],
 ids:['dream-machines','dream-machines-hypergram','dream-machines-dates']});
LESSON({id:'fantics',name:'Fantics and virtuality',short:'Fantics',stage:'computerlib',year:'1974–1980',level:'Core',
 why:'How an idea is presented, and what a system seems to be, are part of the design, not decoration added later.',
 prior:['computer-lib','dream-machines'],references:['t4-nelson-1974','t4-nelson-1980','t4-mayer-2009','t4-carroll-1984'],
 ids:['fantics','fantics-virtuality','fantics-ten-minutes']});
LESSON({id:'thinkertoys',name:'Thinkertoys',short:'Thinkertoys',stage:'computerlib',year:'1974',level:'Core',
 why:'Computers could help people think through alternatives: versions side by side, differences shown, choices kept.',
 prior:['computer-lib','version-history'],references:['t4-nelson-1974','t4-hunt-1976','t4-rochkind-1975','t4-grad-2007','t4-buzan-1974'],
 ids:['thinkertoys','thinkertoys-alternatives','thinkertoys-today']});

THREAD({id:'t4-everyone',name:'Computers for everyone',ids:['computer-lib','computer-lib-cybercrud','fantics-ten-minutes','dream-machines-dates']});
THREAD({id:'t4-branching',name:'Media that branch',ids:['dream-machines','dream-machines-hypergram','stretchtext','coining-hypertext']});
THREAD({id:'t4-versions',name:'Versions and alternatives',ids:['thinkertoys','thinkertoys-today','version-history','parallel-documents','fress-undo']});
