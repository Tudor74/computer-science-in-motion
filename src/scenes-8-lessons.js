/* Ted Nelson era 8 · Reading and legacy: lessons, sources and connections. */
SOURCE('t8-conklin',{title:'Conklin, J. (1987). Hypertext: an introduction and survey. IEEE Computer 20(9), 17–41.'});
SOURCE('t8-destefano',{title:'DeStefano, D. & LeFevre, J.-A. (2007). Cognitive load in hypertext reading: a review. Computers in Human Behavior 23(3), 1616–1641.'});
SOURCE('t8-nilsson-mayer',{title:'Nilsson, R. M. & Mayer, R. E. (2002). The effects of graphic organizers giving cues to the structure of a hypertext document on users’ navigation strategies and performance. International Journal of Human-Computer Studies 57(1), 1–26.'});
SOURCE('t8-salmeron',{title:'Salmerón, L., Cañas, J. J., Kintsch, W. & Fajardo, I. (2005). Reading strategies and hypertext comprehension. Discourse Processes 40(3), 171–191.'});
SOURCE('t8-leuf',{title:'Leuf, B. & Cunningham, W. (2001). The Wiki Way: Quick Collaboration on the Web. Addison-Wesley.'});
SOURCE('t8-brin-page',{title:'Brin, S. & Page, L. (1998). The anatomy of a large-scale hypertextual web search engine. Computer Networks and ISDN Systems 30, 107–117.'});
SOURCE('t8-kleinberg',{title:'Kleinberg, J. M. (1999). Authoritative sources in a hyperlinked environment. Journal of the ACM 46(5), 604–632.'});
SOURCE('t8-luhmann',{title:'Luhmann, N. (1981). Kommunikation mit Zettelkästen: ein Erfahrungsbericht. In Baier, H., Kepplinger, H. M. & Reumann, K. (eds), Öffentliche Meinung und sozialer Wandel. Westdeutscher Verlag.'});
SOURCE('t8-schmidt',{title:'Schmidt, J. F. K. (2016). Niklas Luhmann’s card index: thinking tool, communication partner, publication machine. In Cevolini, A. (ed.), Forgetting Machines: Knowledge Management Evolution in Early Modern Europe. Brill.'});
SOURCE('t8-merkle',{title:'Merkle, R. C. (1987). A digital signature based on a conventional encryption function. Advances in Cryptology, CRYPTO ’87, LNCS 293, 369–378.'});
SOURCE('t8-benet',{title:'Benet, J. (2014). IPFS: content addressed, versioned, P2P file system. arXiv:1407.3561.',url:'https://arxiv.org/abs/1407.3561'});
SOURCE('t8-progit',{title:'Chacon, S. & Straub, B. (2014). Pro Git, 2nd ed. Apress. Chapter 10, Git internals.',url:'https://git-scm.com/book/en/v2'});
SOURCE('t8-mediawiki',{title:'MediaWiki: Help:Transclusion.',url:'https://www.mediawiki.org/wiki/Help:Transclusion'});
SOURCE('t8-zittrain',{title:'Zittrain, J., Albert, K. & Lessig, L. (2014). Perma: scoping and addressing the problem of link and reference rot in legal citations. Harvard Law Review Forum 127, 176–196.'});
SOURCE('t8-alexander',{title:'Alexander, C. (1965). A city is not a tree. Architectural Forum 122(1), 58–62 and 122(2), 58–61.'});
SOURCE('t8-nelson-1974',{title:'Nelson, T. H. (1974). Computer Lib/Dream Machines. Self-published; revised edition Microsoft Press, 1987.'});
SOURCE('t8-nelson-1981',{title:'Nelson, T. H. (1981). Literary Machines. Mindful Press.'});
SOURCE('t8-nelson-2010',{title:'Nelson, T. H. (2010). Possiplex: Movies, Intellect, Creative Control, My Computer Life and the Fight for Civilization. Mindful Press.'});
SOURCE('t8-barnet',{title:'Barnet, B. (2013). Memory Machines: The Evolution of Hypertext. Anthem Press.'});
SOURCE('t8-hci',{title:'HCI In Motion: hypertext, mind maps and how people read a screen.',url:'https://hci-in-motion.puter.site/'});
SOURCE('t8-cs',{title:'Computer Science In Motion: hashing, trees and graphs, the structures behind content addresses and link ranking.',url:'https://computer-science-in-motion.puter.site/'});
SOURCE('t8-thinkers',{title:'Thinkers In Motion: the people behind the ideas.',url:'https://thinkers-in-motion.puter.site/'});

LESSON({id:'reading-hypertext',name:'Reading hypertext',short:'Reading',stage:'legacy',year:'1987–2007',level:'Core',
 why:'Freedom to choose the path has a cost: research on disorientation, cognitive load and reading order shows who pays it, and what helps.',
 prior:['coining-hypertext','associative-trails','stretchtext'],references:['t8-conklin','t8-destefano','t8-nilsson-mayer','t8-salmeron','t8-hci'],
 ids:['reading-hypertext','reading-hypertext-load','reading-hypertext-order']});
LESSON({id:'backlinks',name:'Backlinks',short:'Backlinks',stage:'legacy',year:'1995–today',level:'Core',
 why:'The web’s links go one way, so the other end had to be rebuilt: by wikis, by search engines that rank pages by their backlinks, and by note tools.',
 prior:['two-way-links','web-vs-xanadu'],references:['t8-leuf','t8-brin-page','t8-kleinberg','t8-luhmann','t8-schmidt','t8-nelson-1981'],
 ids:['backlinks','backlinks-rank','backlinks-notes']});
LESSON({id:'content-addressing',name:'Content addressing',short:'Content addresses',stage:'legacy',year:'1987–today',level:'Advanced',
 why:'Naming content by a hash of itself gives addresses that never point at the wrong thing, versions that share their parts, and a cousin of Xanadu’s permanent addresses.',
 prior:['tumblers','link-rot','version-history'],references:['t8-merkle','t8-benet','t8-progit','t8-mediawiki','t8-cs'],
 ids:['content-addressing','content-addressing-merkle','content-addressing-transclusion']});
LESSON({id:'deep-interconnection',name:'Deep interconnection',short:'Intertwingled',stage:'legacy',year:'1974–today',level:'Introduction',
 why:'Nelson’s closing idea: knowledge is a tangle, not a tree. This course’s own lessons show it, and a scorecard shows which of his ideas came true.',
 prior:['computer-lib','non-sequential-writing'],references:['t8-nelson-1974','t8-alexander','t8-nelson-2010','t8-zittrain','t8-barnet','t8-thinkers'],
 ids:['deep-interconnection','deep-interconnection-tree','deep-interconnection-scorecard']});

THREAD({id:'t8-participant',name:'You as the reader',ids:['reading-hypertext','reading-hypertext-order','parallel-documents-search']});
THREAD({id:'t8-two-ends',name:'Both ends of a link',ids:['two-way-links','backlinks','backlinks-rank','backlinks-notes']});
THREAD({id:'t8-rot',name:'Links that break, addresses that last',ids:['link-rot','content-addressing','deep-interconnection-scorecard']});
THREAD({id:'t8-tangle',name:'Not a tree',ids:['non-sequential-writing','zigzag-compare','deep-interconnection','deep-interconnection-tree']});
