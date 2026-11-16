/* Tripitaka In Motion · era 6 · Tibetan and other canons: lessons, sources and connections. */
SOURCE('p6-kapstein',{title:'Kapstein, M. T. (2000). The Tibetan Assimilation of Buddhism: Conversion, Contestation, and Memory. Oxford University Press.'});
SOURCE('p6-snellgrove',{title:'Snellgrove, D. (1987). Indo-Tibetan Buddhism: Indian Buddhists and Their Tibetan Successors. Serindia.'});
SOURCE('p6-scherrer-schaub',{title:'Scherrer-Schaub, C. A. (2002). Enacting words: a diplomatic analysis of the imperial decrees (bkas bcad) and their application in the sGra sbyor bam po gñis pa tradition. Journal of the International Association of Buddhist Studies 25(1–2), 263–340.'});
SOURCE('p6-mahavyutpatti',{title:'Sakaki, R. (ed.) (1916). Mahāvyutpatti. Kyoto Imperial University. 9,565 Sanskrit–Tibetan entries.'});
SOURCE('p6-herrmann-pfandt',{title:'Herrmann-Pfandt, A. (2008). Die lHan kar ma: ein früher Katalog der ins Tibetische übersetzten buddhistischen Texte. Österreichische Akademie der Wissenschaften.',note:'A critical edition of the early ninth-century palace catalogue of translated texts.'});
SOURCE('p6-seyfort-ruegg',{title:'Seyfort Ruegg, D. (1992). Some reflections on translating Buddhist philosophical texts from Sanskrit and Tibetan. Asiatische Studien 46(1), 367–391.'});
SOURCE('p6-harrison-1996',{title:'Harrison, P. (1996). A brief history of the Tibetan bKa’ ’gyur. In Cabezón, J. I. and Jackson, R. R. (eds.), Tibetan Literature: Studies in Genre, 70–94. Snow Lion.'});
SOURCE('p6-skilling-1997',{title:'Skilling, P. (1997). From bKa’ bstan bcos to bKa’ ’gyur and bsTan ’gyur. In Eimer, H. (ed.), Transmission of the Tibetan Canon, 87–111. Österreichische Akademie der Wissenschaften.'});
SOURCE('p6-eimer-1992',{title:'Eimer, H. (1992). Ein Jahrzehnt Studien zur Überlieferung des tibetischen Kanjur. Wiener Studien zur Tibetologie und Buddhismuskunde 28.'});
SOURCE('p6-schaeffer',{title:'Schaeffer, K. R. (2009). The Culture of the Book in Tibet. Columbia University Press.'});
SOURCE('p6-tohoku',{title:'Ui, H., Suzuki, M., Kanakura, Y. and Tada, T. (1934). A Complete Catalogue of the Tibetan Buddhist Canons (Bkaḥ-ḥgyur and Bstan-ḥgyur). Tōhoku Imperial University.',note:'The numbering of the Derge edition used by scholars: nos. 1–1108 Kangyur, 1109–4569 Tengyur.'});
SOURCE('p6-84000',{title:'84000: Translating the Words of the Buddha. A project to translate the Kangyur and Tengyur into English, with an open reading room.',url:'https://84000.co/'});
SOURCE('p6-norman',{title:'Norman, K. R. (1983). Pāli Literature. A History of Indian Literature VII.2. Harrassowitz.'});
SOURCE('p6-analayo-2011',{title:'Anālayo (2011). A Comparative Study of the Majjhima-nikāya. 2 vols. Dharma Drum Publishing.'});
SOURCE('p6-lamotte',{title:'Lamotte, É. (1958; English 1988). History of Indian Buddhism: From the Origins to the Śaka Era. Peeters.'});
SOURCE('p6-bernhard',{title:'Bernhard, F. (ed.) (1965). Udānavarga. Sanskrittexte aus den Turfanfunden X. Vandenhoeck & Ruprecht.'});
SOURCE('p6-kollmar-paulenz',{title:'Kollmar-Paulenz, K. (2002). The transmission of the Mongolian Kanjur: a preliminary report. In Eimer, H. and Germano, D. (eds.), The Many Canons of Tibetan Buddhism, 151–176. Brill.'});
SOURCE('p6-heissig',{title:'Heissig, W. (1954). Die Pekinger lamaistischen Blockdrucke in mongolischer Sprache. Harrassowitz.'});
SOURCE('p6-kychanov',{title:'Kychanov, E. I. (1999). Catalogue of Tangut Buddhist Texts (Katalog tangutskikh buddiiskikh pamiatnikov). Kyoto University.'});
SOURCE('p6-wu-chia',{title:'Wu, J. and Chia, L. (eds.) (2016). Spreading Buddha’s Word in East Asia: The Formation and Transformation of the Chinese Buddhist Canon. Columbia University Press.'});
SOURCE('p6-nelson',{title:'Ted Nelson In Motion: parallel documents, the idea of showing two texts side by side with their connections visible.',url:'https://ted-nelson-in-motion.puter.site/'});
SOURCE('p6-language',{title:'Language In Motion: language families, loanwords and how words travel between languages.',url:'https://language-in-motion.puter.site/'});

LESSON({id:'tibetan-translation',name:'Translation into Tibetan',short:'Tibetan translation',stage:'tibetan',year:'7th–11th century',level:'Introduction',
 why:'In two waves, pairs of Indian scholars and Tibetan translators turned a vast Sanskrit library into Tibetan, under rules strict enough to make the result remarkably uniform.',
 prior:['sanskrit-canons','first-translations','xuanzang'],references:['p6-kapstein','p6-snellgrove','p6-scherrer-schaub','p6-mahavyutpatti','p6-herrmann-pfandt','p6-seyfort-ruegg'],
 ids:['tibetan-translation','tibetan-translation-team','tibetan-translation-mahavyutpatti']});
LESSON({id:'kangyur-tengyur',name:'Kangyur and Tengyur',short:'Kangyur & Tengyur',stage:'tibetan',year:'14th century',level:'Core',
 why:'The Tibetan canon is two collections, the translated words of the Buddha and the translated treatises, sorted in the fourteenth century and copied in a family of editions.',
 prior:['tibetan-translation','catalogues','three-baskets'],references:['p6-harrison-1996','p6-skilling-1997','p6-eimer-1992','p6-schaeffer','p6-tohoku','p6-84000'],
 ids:['kangyur-tengyur','kangyur-tengyur-buton','kangyur-tengyur-editions']});
LESSON({id:'comparing-canons',name:'Comparing the canons',short:'Comparing canons',stage:'tibetan',year:'Overview',level:'Core',
 why:'Set side by side, the Pali, Chinese and Tibetan canons show what all Buddhist traditions share and what each alone preserved.',
 prior:['three-baskets','sutta-pitaka','vinaya-pitaka','abhidhamma-pitaka','catalogues','kangyur-tengyur'],references:['p6-norman','p6-tohoku','p6-analayo-2011','p6-lamotte','p6-bernhard','p6-nelson'],
 ids:['comparing-canons','comparing-canons-overlap','comparing-canons-parallel']});
LESSON({id:'mongolian-manchu',name:'Mongolian, Manchu and Tangut canons',short:'Later canons',stage:'tibetan',year:'11th–18th century',level:'Advanced',
 why:'Rulers from the Tangut emperors to the Qianlong emperor had the canon translated again, this time from Chinese and Tibetan, into the languages of their own states.',
 prior:['kangyur-tengyur','comparing-canons'],references:['p6-kollmar-paulenz','p6-heissig','p6-kychanov','p6-wu-chia','p6-language'],
 ids:['mongolian-manchu','mongolian-manchu-relay','mongolian-manchu-quadrilingual']});

THREAD({id:'p6-editions',name:'Editions and their family trees',ids:['kangyur-tengyur-editions','song-editions','tripitaka-koreana','taisho','digital-canons']});
THREAD({id:'p6-parallels',name:'Reading the canons side by side',ids:['sutta-pitaka','comparing-canons-overlap','comparing-canons-parallel','parallels-and-finds']});
THREAD({id:'p6-patrons',name:'Rulers who sponsored a canon',ids:['ashoka-edicts','tibetan-translation','mongolian-manchu','royal-editions']});
