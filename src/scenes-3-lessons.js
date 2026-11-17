/* Ted Nelson era 3 · The first systems (1967–1974): lessons, sources and connections. */
SOURCE('t3-carmody-1969',{title:'Carmody, S., Gross, W., Nelson, T. H., Rice, D. & van Dam, A. (1969). A hypertext editing system for the /360. In M. Faiman & J. Nievergelt (eds), Pertinent Concepts in Computer Graphics, University of Illinois Press, 291–330.'});
SOURCE('t3-vandam-1988',{title:'van Dam, A. (1988). Hypertext ’87 keynote address. Communications of the ACM 31(7), 887–895.',url:'https://doi.org/10.1145/48511.48519'});
SOURCE('t3-barnet-2013',{title:'Barnet, B. (2013). Memory Machines: The Evolution of Hypertext. Anthem Press. Interviews with van Dam, Nelson and Engelbart.'});
SOURCE('t3-nelson-2010',{title:'Nelson, T. H. (2010). Possiplex: Movies, Intellect, Creative Control, My Computer Life and the Fight for Civilization. Mindful Press. His autobiography.'});
SOURCE('t3-engelbart-1962',{title:'Engelbart, D. C. (1962). Augmenting Human Intellect: A Conceptual Framework. SRI Summary Report AFOSR-3223.'});
SOURCE('t3-engelbart-1968',{title:'Engelbart, D. C. & English, W. K. (1968). A research center for augmenting human intellect. AFIPS Fall Joint Computer Conference 33, 395–410.',url:'https://doi.org/10.1145/1476589.1476645'});
SOURCE('t3-bardini-2000',{title:'Bardini, T. (2000). Bootstrapping: Douglas Engelbart, Coevolution, and the Origins of Personal Computing. Stanford University Press.'});
SOURCE('t3-derose-1999',{title:'DeRose, S. J. & van Dam, A. (1999). Document structure and markup in the FRESS hypertext system. Markup Languages: Theory & Practice 1(1), 7–32.'});
SOURCE('t3-catano-1979',{title:'Catano, J. V. (1979). Poetry and computers: experimenting with the communal text. Computers and the Humanities 13(4), 269–275.'});
SOURCE('t3-nelson-1974',{title:'Nelson, T. H. (1974). Computer Lib / Dream Machines. Self-published; revised edition, Microsoft Press, 1987.'});
SOURCE('t3-zellweger-1998',{title:'Zellweger, P. T., Chang, B.-W. & Mackinlay, J. D. (1998). Fluid links for informed and incremental link transitions. Proceedings of HYPERTEXT ’98, ACM, 50–57.'});
SOURCE('t3-conklin-1987',{title:'Conklin, J. (1987). Hypertext: an introduction and survey. IEEE Computer 20(9), 17–41.'});
SOURCE('t3-brysbaert-2019',{title:'Brysbaert, M. (2019). How many words do we read per minute? A review and meta-analysis of reading rate. Journal of Memory and Language 109, 104047.',url:'https://doi.org/10.1016/j.jml.2019.104047'});
SOURCE('t3-nielsen-2006',{title:'Nielsen, J. (2006). Progressive disclosure. Nielsen Norman Group.',url:'https://www.nngroup.com/articles/progressive-disclosure/'});
SOURCE('t3-hci',{title:'HCI In Motion: the mouse, Fitts’s law and the 1968 demo from the interface side.',url:'https://hci-in-motion.puter.site/'});
SOURCE('t3-thinkers',{title:'Thinkers In Motion: the people behind the ideas, including Engelbart and Nelson.',url:'https://thinkers-in-motion.puter.site/'});

LESSON({id:'hes-brown',name:'HES at Brown',short:'HES',stage:'systems',year:'1967',level:'Introduction',
 why:'One of the first hypertext systems people actually used: text in areas joined by branches, edited on a screen, and a disagreement about paper that shaped what came next.',
 prior:['coining-hypertext','zippered-lists'],references:['t3-carmody-1969','t3-vandam-1988','t3-barnet-2013','t3-nelson-2010'],
 ids:['hes-brown','hes-brown-print','hes-brown-goals']});
LESSON({id:'nls-demo',name:'Engelbart’s demo',short:'NLS demo',stage:'systems',year:'1968',level:'Core',
 why:'NLS showed structure you can view at any depth, a chord keyset beside the mouse, and links, and posed the question of whether ideas are trees or networks.',
 prior:['memex','hes-brown'],references:['t3-engelbart-1962','t3-engelbart-1968','t3-bardini-2000','t3-hci','t3-thinkers'],
 ids:['nls-demo','nls-demo-keyset','nls-demo-tree']});
LESSON({id:'fress',name:'FRESS',short:'FRESS',stage:'systems',year:'1968–1970s',level:'Core',
 why:'Brown’s second system brought annotation by many readers and an undo that made editing safe, and was tried in a real poetry class.',
 prior:['hes-brown'],references:['t3-derose-1999','t3-vandam-1988','t3-catano-1979','t3-barnet-2013'],
 ids:['fress','fress-undo','fress-poetry']});
LESSON({id:'stretchtext',name:'Stretchtext',short:'Stretchtext',stage:'systems',year:'1967–1974',level:'Core',
 why:'Text that expands in place lets one document serve many readers, and keeps them from losing their place.',
 prior:['coining-hypertext','hes-brown'],references:['t3-nelson-1974','t3-zellweger-1998','t3-conklin-1987','t3-brysbaert-2019','t3-nielsen-2006'],
 ids:['stretchtext','stretchtext-jump','stretchtext-readers']});

THREAD({id:'t3-paper',name:'Screen or paper',ids:['hes-brown-print','hes-brown-goals','embedded-markup','parallel-documents']});
THREAD({id:'t3-structure',name:'Trees and networks',ids:['nls-demo','nls-demo-tree','zippered-lists','zigzag','deep-interconnection']});
THREAD({id:'t3-readers',name:'Many readers, one text',ids:['fress','fress-poetry','backlinks','two-way-links']});
THREAD({id:'t3-place',name:'Keeping your place',ids:['stretchtext-jump','stretchtext','reading-hypertext']});
