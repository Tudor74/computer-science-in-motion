/* Tripitaka In Motion · era 4 · Writing it down: lessons, sources and connections. */
SOURCE('p4-agrawal-1984',{title:'Agrawal, O. P. (1984). Conservation of Manuscripts and Paintings of South-east Asia. London: Butterworths.'});
SOURCE('p4-berkwitz-2009',{title:'Berkwitz, S. C., Schober, J. & Brown, C. (eds) (2009). Buddhist Manuscript Cultures: Knowledge, Ritual, and Art. London: Routledge.'});
SOURCE('p4-mahavamsa',{title:'Geiger, W. (trans.) (1912). The Mahāvaṃsa, or the Great Chronicle of Ceylon. London: Pali Text Society. Chapter 33 reports the writing down of the canon.'});
SOURCE('p4-collins-1990',{title:'Collins, S. (1990). On the very idea of the Pali canon. Journal of the Pali Text Society 15, 89–126.'});
SOURCE('p4-norman-1983',{title:'Norman, K. R. (1983). Pāli Literature. A History of Indian Literature vol. 7.2. Wiesbaden: Harrassowitz.'});
SOURCE('p4-hinuber-1991',{title:'von Hinüber, O. (1991). The Oldest Pāli Manuscript: Four Folios of the Vinaya-Piṭaka from the National Archives, Kathmandu. Mainz: Akademie der Wissenschaften und der Literatur.'});
SOURCE('p4-hinuber-1996',{title:'von Hinüber, O. (1996). A Handbook of Pāli Literature. Berlin: de Gruyter.'});
SOURCE('p4-salomon-1999',{title:'Salomon, R. (1999). Ancient Buddhist Scrolls from Gandhāra: The British Library Kharoṣṭhī Fragments. London: British Library; Seattle: University of Washington Press.'});
SOURCE('p4-salomon-2000',{title:'Salomon, R. (2000). A Gāndhārī Version of the Rhinoceros Sūtra: British Library Kharoṣṭhī Fragment 5B. Seattle: University of Washington Press.'});
SOURCE('p4-salomon-2018',{title:'Salomon, R. (2018). The Buddhist Literature of Ancient Gandhāra: An Introduction with Selected Translations. Somerville: Wisdom Publications.'});
SOURCE('p4-allon-2006',{title:'Allon, M., Salomon, R., Jacobsen, G. & Zoppi, U. (2006). Radiocarbon dating of Kharoṣṭhī fragments from the Schøyen and Senior manuscript collections. In J. Braarvig (ed.), Buddhist Manuscripts vol. 3, 279–291. Oslo: Hermes.'});
SOURCE('p4-falk-2011',{title:'Falk, H. (2011). The “Split” collection of Kharoṣṭhī texts. Annual Report of the International Research Institute for Advanced Buddhology (ARIRIAB) 14, 13–23.'});
SOURCE('p4-falk-karashima-2012',{title:'Falk, H. & Karashima, S. (2012). A first-century Prajñāpāramitā manuscript from Gandhāra: parivarta 1. ARIRIAB 15, 19–61.'});
SOURCE('p4-nanamoli-1956',{title:'Buddhaghosa, trans. Bhikkhu Ñāṇamoli (1956). The Path of Purification (Visuddhimagga). Colombo: Semage; later editions Kandy: Buddhist Publication Society.'});
SOURCE('p4-endo-2013',{title:'Endo, T. (2013). Studies in Pāli Commentarial Literature: Sources, Controversies and Insights. Hong Kong: Centre of Buddhist Studies, University of Hong Kong.'});
SOURCE('p4-hinuber-2014',{title:'von Hinüber, O. (2014). The Gilgit manuscripts: an ancient Buddhist library in modern research. In P. Harrison & J.-U. Hartmann (eds), From Birch Bark to Digital Data, 79–135. Vienna: Austrian Academy of Sciences Press.'});
SOURCE('p4-schoyen',{title:'Braarvig, J. (ed.) (2000–). Buddhist Manuscripts in the Schøyen Collection, vols 1–. Oslo: Hermes.'});
SOURCE('p4-edgerton-1953',{title:'Edgerton, F. (1953). Buddhist Hybrid Sanskrit Grammar and Dictionary, 2 vols. New Haven: Yale University Press.'});
SOURCE('p4-harrison-1987',{title:'Harrison, P. (1987). Who gets to ride in the Great Vehicle? Self-image and identity among the followers of the early Mahāyāna. Journal of the International Association of Buddhist Studies 10(1), 67–89.'});
SOURCE('p4-nattier-2003',{title:'Nattier, J. (2003). A Few Good Men: The Bodhisattva Path according to the Inquiry of Ugra. Honolulu: University of Hawai‘i Press.'});
SOURCE('p4-williams-2009',{title:'Williams, P. (2009). Mahāyāna Buddhism: The Doctrinal Foundations, 2nd edn. London: Routledge.'});
SOURCE('p4-language',{title:'Language In Motion: writing materials, scripts and how sound changes are worked out.',url:'https://language-in-motion.puter.site/',note:'For regular sound correspondences such as kharga and khagga.'});
SOURCE('p4-nelson',{title:'Ted Nelson In Motion: parallel documents shown side by side with their connections.',url:'https://ted-nelson-in-motion.puter.site/',note:'For the idea of aligning two versions of one text.'});

LESSON({id:'palm-leaf',name:'Palm leaf',short:'Palm leaf',stage:'writing',year:'1st century BCE onward',level:'Introduction',
 why:'How a palm-leaf book is made, what the chronicles say about the first writing down, and why very old copies are so rare.',
 prior:['oral-recitation','ashoka-edicts'],references:['p4-agrawal-1984','p4-berkwitz-2009','p4-mahavamsa','p4-collins-1990','p4-norman-1983','p4-hinuber-1991'],
 ids:['palm-leaf','palm-leaf-aluvihara','palm-leaf-survival']});
LESSON({id:'gandharan-scrolls',name:'The Gandhāran scrolls',short:'Gandhāra',stage:'writing',year:'1st century BCE–3rd century CE',level:'Core',
 why:'Birch-bark scrolls from the north-west are the oldest Buddhist manuscripts that survive, and can be dated and compared with the Pali.',
 prior:['palm-leaf','languages-of-teaching'],references:['p4-salomon-1999','p4-salomon-2000','p4-salomon-2018','p4-allon-2006','p4-falk-2011','p4-falk-karashima-2012','p4-language','p4-nelson'],
 ids:['gandharan-scrolls','gandharan-scrolls-dating','gandharan-scrolls-compare']});
LESSON({id:'commentaries',name:'The commentaries',short:'Commentaries',stage:'writing',year:'5th century CE',level:'Core',
 why:'The layers of explanation around the Pali canon, the book that summarises them, and how scholars decide who wrote what.',
 prior:['palm-leaf','sutta-pitaka'],references:['p4-hinuber-1996','p4-norman-1983','p4-nanamoli-1956','p4-endo-2013'],
 ids:['commentaries','commentaries-visuddhimagga','commentaries-attribution']});
LESSON({id:'sanskrit-canons',name:'The Sanskrit canons',short:'Sanskrit canons',stage:'writing',year:'1st–8th century CE',level:'Core',
 why:'Canons kept in Sanskrit were lost in India and recovered from fragments; alongside them appear the Mahāyāna sūtras.',
 prior:['second-council-schools','gandharan-scrolls'],references:['p4-hinuber-2014','p4-schoyen','p4-edgerton-1953','p4-falk-karashima-2012','p4-harrison-1987','p4-nattier-2003','p4-williams-2009'],
 ids:['sanskrit-canons','sanskrit-canons-language','sanskrit-canons-mahayana']});

THREAD({id:'p4-materials',name:'What the words were written on',ids:['palm-leaf','gandharan-scrolls','diamond-sutra-868','tripitaka-koreana','digital-canons']});
THREAD({id:'p4-compare',name:'Comparing versions',ids:['gandharan-scrolls-compare','sanskrit-canons-language','first-council-sources','comparing-canons','parallels-and-finds']});
THREAD({id:'p4-evidence',name:'Tradition and evidence',ids:['palm-leaf-aluvihara','gandharan-scrolls-dating','commentaries-attribution','sanskrit-canons-mahayana','dating-the-buddha']});
