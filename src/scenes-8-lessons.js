/* Tripitaka era 8 · The canon today (1881–today): lessons, sources and connections. */
SOURCE('p8-norman',{title:'Norman, K. R. (1983). Pāli Literature. A History of Indian Literature 7.2. Harrassowitz.'});
SOURCE('p8-hinuber',{title:'Hinüber, O. von (1996). A Handbook of Pāli Literature. De Gruyter.'});
SOURCE('p8-pts',{title:'Pali Text Society: history and list of publications.',url:'https://palitextsociety.org/'});
SOURCE('p8-geiger',{title:'Geiger, W. (1916; English edn 1994). A Pāli Grammar. Pali Text Society.'});
SOURCE('p8-taisho',{title:'Takakusu, J. & Watanabe, K. (eds) (1924–1934). Taishō Shinshū Daizōkyō. 100 vols. Tokyo.'});
SOURCE('p8-wu-chia',{title:'Wu, J. & Chia, L. (eds) (2016). Spreading Buddha’s Word in East Asia: The Formation and Transformation of the Chinese Buddhist Canon. Columbia University Press.'});
SOURCE('p8-cbeta',{title:'CBETA: Chinese Buddhist Electronic Text Association.',url:'https://www.cbeta.org/'});
SOURCE('p8-sat',{title:'SAT Daizōkyō Text Database, University of Tokyo.',url:'https://21dzk.l.u-tokyo.ac.jp/SAT/'});
SOURCE('p8-suttacentral',{title:'SuttaCentral: early Buddhist texts, translations and parallels.',url:'https://suttacentral.net/'});
SOURCE('p8-84000',{title:'84000: Translating the Words of the Buddha.',url:'https://84000.co/'});
SOURCE('p8-bdrc',{title:'Buddhist Digital Resource Center.',url:'https://www.bdrc.io/'});
SOURCE('p8-analayo-2013',{title:'Anālayo (2013). Perspectives on Satipaṭṭhāna. Windhorse.'});
SOURCE('p8-analayo-2011',{title:'Anālayo (2011). A Comparative Study of the Majjhima-nikāya. Dharma Drum.'});
SOURCE('p8-sujato-brahmali',{title:'Sujato, Bhikkhu & Brahmali, Bhikkhu (2014). The Authenticity of the Early Buddhist Texts.',note:'One scholarly position; see Schopen for a sceptical view.'});
SOURCE('p8-schopen',{title:'Schopen, G. (1997). Bones, Stones, and Buddhist Monks. University of Hawai‘i Press.'});
SOURCE('p8-gombrich',{title:'Gombrich, R. (2009). What the Buddha Thought. Equinox.'});
SOURCE('p8-salomon-1999',{title:'Salomon, R. (1999). Ancient Buddhist Scrolls from Gandhāra: The British Library Kharoṣṭhī Fragments. British Library / University of Washington Press.'});
SOURCE('p8-salomon-2018',{title:'Salomon, R. (2018). The Buddhist Literature of Ancient Gandhāra. Wisdom.'});
SOURCE('p8-falk',{title:'Falk, H. (2011). The “Split” collection of Kharoṣṭhī texts. Annual Report of the International Research Institute for Advanced Buddhology 14, 13–23.'});
SOURCE('p8-nelson',{title:'Ted Nelson In Motion: parallel documents with visible connections.',url:'https://ted-nelson-in-motion.puter.site/',note:'The same idea, applied to any text.'});
SOURCE('p8-language',{title:'Language In Motion: scripts, translation and the comparative method.',url:'https://language-in-motion.puter.site/'});

LESSON({id:'pali-text-society',name:'The Pali Text Society',short:'Pali Text Society',stage:'modern',year:'1881',level:'Introduction',
 why:'Roman-script editions and translations made the Pali canon available to anyone who could reach a library.',
 prior:['palm-leaf','royal-editions','languages-of-teaching'],references:['p8-pts','p8-norman','p8-hinuber','p8-geiger'],
 ids:['pali-text-society','pali-text-society-scripts','pali-text-society-editing']});
LESSON({id:'taisho',name:'The Taishō edition',short:'Taishō',stage:'modern',year:'1924–1934',level:'Core',
 why:'The numbered, footnoted edition of the Chinese canon that every scholar and every digital canon now cites.',
 prior:['tripitaka-koreana','catalogues','song-editions'],references:['p8-taisho','p8-wu-chia','p8-sat'],
 ids:['taisho','taisho-reference','taisho-punctuation']});
LESSON({id:'digital-canons',name:'Digital canons',short:'Digital canons',stage:'modern',year:'1990s–today',level:'Core',
 why:'Typed, searchable and free, the canons can now be read side by side by anyone, and searched in seconds.',
 prior:['taisho','pali-text-society','kangyur-tengyur'],references:['p8-cbeta','p8-sat','p8-suttacentral','p8-84000','p8-bdrc'],
 ids:['digital-canons','digital-canons-search','digital-canons-encoding']});
LESSON({id:'parallels-and-finds',name:'Parallels and new finds',short:'Parallels & finds',stage:'modern',year:'1900–today',level:'Core',
 why:'Comparing versions across languages, and reading manuscripts two thousand years old, is how the early history of the canon is studied now.',
 prior:['sutta-pitaka','gandharan-scrolls','comparing-canons','dating-the-buddha'],references:['p8-analayo-2013','p8-analayo-2011','p8-sujato-brahmali','p8-schopen','p8-gombrich','p8-salomon-1999','p8-salomon-2018','p8-falk','p8-nelson','p8-language'],
 ids:['parallels-and-finds','parallels-and-finds-positions','parallels-and-finds-manuscripts']});

THREAD({id:'p8-parallels',name:'The same text in several languages',ids:['sutta-pitaka','gandharan-scrolls','kumarajiva','comparing-canons','parallels-and-finds','digital-canons']});
THREAD({id:'p8-evidence',name:'How we know how old it is',ids:['ashoka-edicts','dating-the-buddha','gandharan-scrolls','diamond-sutra-868-earlier','parallels-and-finds-manuscripts','parallels-and-finds-positions']});
THREAD({id:'p8-editing',name:'Editors and their choices',ids:['catalogues','tripitaka-koreana','royal-editions-sixth-council','pali-text-society-editing','taisho-punctuation']});
