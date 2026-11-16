/* Ted Nelson In Motion · era 6 · The web arrives: lessons, sources and connections. */
SOURCE('t6-tbl-1989',{title:'Berners-Lee, T. (1989). Information Management: A Proposal. CERN.',url:'https://www.w3.org/History/1989/proposal.html'});
SOURCE('t6-weaving',{title:'Berners-Lee, T. & Fischetti, M. (1999). Weaving the Web. Harper San Francisco.'});
SOURCE('t6-gray-1996',{title:'Gray, M. (1996). Web Growth Summary. MIT (counts from the World Wide Web Wanderer).'});
SOURCE('t6-gabriel-1991',{title:'Gabriel, R. P. (1991). Lisp: good news, bad news, how to win big. AI Expert 6(6) (the “worse is better” essay).',url:'https://en.wikipedia.org/wiki/Worse_is_better'});
SOURCE('t6-rfc2616',{title:'Fielding, R. et al. (1999). RFC 2616: Hypertext Transfer Protocol — HTTP/1.1.',url:'https://www.rfc-editor.org/rfc/rfc2616'});
SOURCE('t6-koehler-2004',{title:'Koehler, W. (2004). A longitudinal study of web pages continued: a consideration of document persistence. Information Research 9(2).'});
SOURCE('t6-zittrain-2014',{title:'Zittrain, J., Albert, K. & Lessig, L. (2014). Perma: scoping and addressing the problem of link and reference rot in legal citations. Harvard Law Review Forum 127, 176.'});
SOURCE('t6-pew-2024',{title:'Pew Research Center (2024). When Online Content Disappears.',url:'https://www.pewresearch.org/data-labs/2024/05/17/when-online-content-disappears/'});
SOURCE('t6-klein-2014',{title:'Klein, M. et al. (2014). Scholarly context not found: one in five articles suffers from reference rot. PLOS ONE 9(12), e115253.',url:'https://doi.org/10.1371/journal.pone.0115253'});
SOURCE('t6-jones-2016',{title:'Jones, S. M. et al. (2016). Scholarly context adrift: three out of four URI references lead to changed content. PLOS ONE 11(12), e0167475.',url:'https://doi.org/10.1371/journal.pone.0167475'});
SOURCE('t6-memento',{title:'Van de Sompel, H., Nelson, M. L. & Sanderson, R. (2013). RFC 7089: HTTP Framework for Time-Based Access to Resource States — Memento.',url:'https://www.rfc-editor.org/rfc/rfc7089'});
SOURCE('t6-wayback',{title:'Internet Archive: the Wayback Machine (from 1996).',url:'https://web.archive.org/'});
SOURCE('t6-embedded-1997',{title:'Nelson, T. H. (1997). Embedded markup considered harmful. World Wide Web Journal 2(4), 129–134.'});
SOURCE('t6-coombs-1987',{title:'Coombs, J. H., Renear, A. H. & DeRose, S. J. (1987). Markup systems and the future of scholarly text processing. Communications of the ACM 30(11), 933–947.'});
SOURCE('t6-renear-1996',{title:'Renear, A., Mylonas, E. & Durand, D. (1996). Refining our notion of what text really is: the problem of overlapping hierarchies. Research in Humanities Computing 4. Oxford University Press.'});
SOURCE('t6-annotation-2017',{title:'W3C (2017). Web Annotation Data Model. W3C Recommendation, 23 February 2017.',url:'https://www.w3.org/TR/annotation-model/'});
SOURCE('t6-wolf-1995',{title:'Wolf, G. (1995). The curse of Xanadu. Wired 3.06, June 1995.',url:'https://www.wired.com/1995/06/xanadu/'});
SOURCE('t6-possiplex',{title:'Nelson, T. H. (2010). Possiplex: Movies, Intellect, Creative Control, My Computer Life and the Fight for Civilization. Mindful Press.'});
SOURCE('t6-barnet-2013',{title:'Barnet, B. (2013). Memory Machines: The Evolution of Hypertext. Anthem Press.'});
SOURCE('t6-hci',{title:'HCI In Motion: the World Wide Web lesson follows the same years from the interface side.',url:'https://hci-in-motion.puter.site/'});
SOURCE('t6-thinkers',{title:'Thinkers In Motion: the people behind the ideas, including Nelson and Berners-Lee.',url:'https://thinkers-in-motion.puter.site/'});

LESSON({id:'web-vs-xanadu',name:'The web against Xanadu',short:'Web v. Xanadu',stage:'web',year:'1989–1997',level:'Introduction',
 why:'A simpler hypertext shipped, spread and won; what it gained by letting links break, and what it gave up.',
 prior:['transclusion','two-way-links'],references:['t6-tbl-1989','t6-weaving','t6-gray-1996','t6-gabriel-1991','t6-rfc2616','t6-hci'],
 ids:['web-vs-xanadu','web-vs-xanadu-growth','web-vs-xanadu-404']});
LESSON({id:'link-rot',name:'Link rot',short:'Link rot',stage:'web',year:'1996–2024',level:'Core',
 why:'Nelson predicted that copies and one-way links would decay. Measurements of cited links show how much has been lost.',
 prior:['web-vs-xanadu','tumblers'],references:['t6-koehler-2004','t6-zittrain-2014','t6-pew-2024','t6-klein-2014','t6-jones-2016','t6-memento','t6-wayback'],
 ids:['link-rot','link-rot-sim','link-rot-drift']});
LESSON({id:'embedded-markup',name:'Embedded markup',short:'Markup',stage:'web',year:'1997',level:'Advanced',
 why:'Nelson’s case against tags mixed into text: overlapping structures, and links that only owners can add.',
 prior:['web-vs-xanadu','two-way-links-spans'],references:['t6-embedded-1997','t6-coombs-1987','t6-renear-1996','t6-annotation-2017'],
 ids:['embedded-markup','embedded-markup-overlap','embedded-markup-links']});
LESSON({id:'curse-of-xanadu',name:'The curse of Xanadu',short:'Curse',stage:'web',year:'1995',level:'Core',
 why:'Two accounts of why Xanadu took so long, a timeline of what happened, and an honest scorecard of which ideas came true.',
 prior:['web-vs-xanadu'],references:['t6-wolf-1995','t6-possiplex','t6-barnet-2013','t6-thinkers'],
 ids:['curse-of-xanadu','curse-of-xanadu-accounts','curse-of-xanadu-ideas']});

THREAD({id:'t6-evidence',name:'Measuring what was lost',ids:['link-rot','link-rot-sim','link-rot-drift','reading-hypertext']});
THREAD({id:'t6-simple',name:'Simple things spread',ids:['web-vs-xanadu','web-vs-xanadu-growth','web-vs-xanadu-404','two-way-links-scale','transcopyright-micropayments']});
THREAD({id:'t6-legacy',name:'Ideas that came back',ids:['curse-of-xanadu-ideas','embedded-markup-links','backlinks','content-addressing','open-xanadu']});
