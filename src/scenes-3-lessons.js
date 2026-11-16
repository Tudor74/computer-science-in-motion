/* Tripitaka In Motion · era 3 · Councils and Ashoka: lessons, sources and connections. */
SOURCE('p3-cullavagga',{title:'Horner, I. B. (trans.) (1952). The Book of the Discipline, vol. 5 (Cullavagga). London: Pali Text Society. Chapters XI and XII are the Pali accounts of the first two councils.'});
SOURCE('p3-prebish-1974',{title:'Prebish, C. S. (1974). A review of scholarship on the Buddhist councils. Journal of Asian Studies 33(2), 239–254.'});
SOURCE('p3-bareau-1955',{title:'Bareau, A. (1955). Les premiers conciles bouddhiques. Paris: Presses Universitaires de France.'});
SOURCE('p3-frauwallner-1956',{title:'Frauwallner, E. (1956). The Earliest Vinaya and the Beginnings of Buddhist Literature. Rome: IsMEO.'});
SOURCE('p3-lamotte',{title:'Lamotte, É. (1958; English trans. 1988). History of Indian Buddhism: From the Origins to the Śaka Era. Louvain: Institut Orientaliste.'});
SOURCE('p3-oldenberg-1879',{title:'Oldenberg, H. (1879). The Vinaya Piṭakaṃ, vol. 1, introduction. London: Williams and Norgate.'});
SOURCE('p3-nattier-prebish-1977',{title:'Nattier, J. & Prebish, C. S. (1977). Mahāsāṃghika origins: the beginnings of Buddhist sectarianism. History of Religions 16(3), 237–272.'});
SOURCE('p3-bareau-sectes',{title:'Bareau, A. (1955). Les sectes bouddhiques du Petit Véhicule. Saigon: École française d’Extrême-Orient.',note:'The title uses a term for the early schools that this course avoids.'});
SOURCE('p3-cousins-1991',{title:'Cousins, L. S. (1991). The “five points” and the origins of the Buddhist schools. In T. Skorupski (ed.), The Buddhist Forum vol. 2, 27–60. London: SOAS.'});
SOURCE('p3-hultzsch-1925',{title:'Hultzsch, E. (1925). Inscriptions of Asoka. Corpus Inscriptionum Indicarum vol. 1. Oxford: Clarendon Press.'});
SOURCE('p3-thapar-1961',{title:'Thapar, R. (1961). Aśoka and the Decline of the Mauryas. Oxford University Press.'});
SOURCE('p3-norman-1983',{title:'Norman, K. R. (1983). Pāli Literature. A History of Indian Literature vol. 7.2. Wiesbaden: Harrassowitz.'});
SOURCE('p3-falk-2006',{title:'Falk, H. (2006). Aśokan Sites and Artefacts: A Source-Book with Bibliography. Mainz: von Zabern.'});
SOURCE('p3-salomon-1998',{title:'Salomon, R. (1998). Indian Epigraphy: A Guide to the Study of Inscriptions in Sanskrit, Prakrit, and the Other Indo-Aryan Languages. Oxford University Press.'});
SOURCE('p3-bechert-schism',{title:'Bechert, H. (1982). The importance of Aśoka’s so-called schism edict. In L. A. Hercus et al. (eds), Indological and Buddhist Studies, 61–68. Canberra: ANU.'});
SOURCE('p3-bechert-dating',{title:'Bechert, H. (ed.) (1991–97). The Dating of the Historical Buddha, 3 vols. Göttingen: Vandenhoeck & Ruprecht.'});
SOURCE('p3-gombrich-1992',{title:'Gombrich, R. (1992). Dating the Buddha: a red herring revealed. In H. Bechert (ed.), The Dating of the Historical Buddha, vol. 2, 237–259.'});
SOURCE('p3-cousins-1996',{title:'Cousins, L. S. (1996). The dating of the historical Buddha: a review article. Journal of the Royal Asiatic Society 6(1), 57–63.'});
SOURCE('p3-coningham-2013',{title:'Coningham, R. A. E. et al. (2013). The earliest Buddhist shrine: excavating the birthplace of the Buddha, Lumbini (Nepal). Antiquity 87(338), 1104–1123.'});
SOURCE('p3-language',{title:'Language In Motion: scripts, decipherment and the first writing systems.',url:'https://language-in-motion.puter.site/',note:'For Brāhmī, Kharoṣṭhī and how lost scripts are read.'});

LESSON({id:'first-council',name:'The first council',short:'First council',stage:'councils',year:'c. 400 BCE (traditional)',level:'Introduction',
 why:'The tradition’s own account of how the teaching was first gathered, and how historians test it against six surviving versions.',
 prior:['oral-recitation','three-baskets'],references:['p3-cullavagga','p3-prebish-1974','p3-bareau-1955','p3-frauwallner-1956','p3-oldenberg-1879','p3-lamotte'],
 ids:['first-council','first-council-sources','first-council-history']});
LESSON({id:'second-council-schools',name:'The second council and the schools',short:'Schools',stage:'councils',year:'c. 300 BCE',level:'Core',
 why:'A dispute over discipline, a first division, and the schools whose separate canons let scholars compare versions today.',
 prior:['first-council','vinaya-pitaka'],references:['p3-cullavagga','p3-nattier-prebish-1977','p3-bareau-sectes','p3-cousins-1991','p3-lamotte'],
 ids:['second-council-schools','second-council-schools-split','second-council-schools-tree']});
LESSON({id:'ashoka-edicts',name:'Ashoka’s edicts',short:'Ashoka',stage:'councils',year:'c. 268–232 BCE',level:'Core',
 why:'Words cut in stone in the 3rd century BCE: the earliest evidence for Buddhist texts that can be dated.',
 prior:['second-council-schools','languages-of-teaching'],references:['p3-hultzsch-1925','p3-thapar-1961','p3-norman-1983','p3-falk-2006','p3-salomon-1998','p3-bechert-schism','p3-language'],
 ids:['ashoka-edicts','ashoka-edicts-schism','ashoka-edicts-map']});
LESSON({id:'dating-the-buddha',name:'Dating the Buddha',short:'Dating',stage:'councils',year:'Debated',level:'Core',
 why:'Every date for the Buddha is counted back from Ashoka. How Ashoka is fixed, and why the Buddha’s date has moved.',
 prior:['ashoka-edicts'],references:['p3-bechert-dating','p3-gombrich-1992','p3-cousins-1996','p3-coningham-2013','p3-thapar-1961'],
 ids:['dating-the-buddha','dating-the-buddha-anchor','dating-the-buddha-evidence']});

THREAD({id:'p3-evidence',name:'Tradition and evidence',ids:['first-council','first-council-history','ashoka-edicts','dating-the-buddha-anchor','gandharan-scrolls','parallels-and-finds']});
THREAD({id:'p3-schools',name:'Many schools, many canons',ids:['second-council-schools-tree','vinaya-pitaka','sanskrit-canons','comparing-canons']});
THREAD({id:'p3-scripts',name:'Scripts and stone',ids:['ashoka-edicts-map','languages-of-teaching','gandharan-scrolls','diamond-sutra-868']});
