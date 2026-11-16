/* Tripitaka era 2 · The three baskets: lessons, sources and connections. */
SOURCE('p2-norman-1983',{title:'K. R. Norman (1983), Pāli Literature: Including the Canonical Literature in Prakrit and Sanskrit of All the Hīnayāna Schools. Wiesbaden: Otto Harrassowitz',note:'The subtitle uses a term now avoided; the survey itself remains standard.'});
SOURCE('p2-von-hinuber-1996',{title:'Oskar von Hinüber (1996), A Handbook of Pāli Literature. Berlin: Walter de Gruyter'});
SOURCE('p2-gethin-1998',{title:'Rupert Gethin (1998), The Foundations of Buddhism. Oxford University Press'});
SOURCE('p2-lamotte-1988',{title:'Étienne Lamotte (1988), History of Indian Buddhism: From the Origins to the Śaka Era (trans. Sara Webb-Boin). Louvain: Institut Orientaliste'});
SOURCE('p2-collins-1990',{title:'Steven Collins (1990), On the very idea of the Pali canon, Journal of the Pali Text Society 15: 89–126'});
SOURCE('p2-schopen-1997',{title:'Gregory Schopen (1997), Bones, Stones, and Buddhist Monks. University of Hawai‘i Press'});
SOURCE('p2-horner-bd',{title:'I. B. Horner (trans., 1938–1966), The Book of the Discipline, 6 vols. Pali Text Society'});
SOURCE('p2-pachow-1955',{title:'W. Pachow (1955), A Comparative Study of the Prātimokṣa on the Basis of Its Chinese, Tibetan, Sanskrit and Pali Versions. Santiniketan'});
SOURCE('p2-frauwallner-1956',{title:'Erich Frauwallner (1956), The Earliest Vinaya and the Beginnings of Buddhist Literature. Rome: IsMEO'});
SOURCE('p2-clarke-2015',{title:'Shayne Clarke (2015), Vinayas, in Brill’s Encyclopedia of Buddhism, vol. 1: 60–87'});
SOURCE('p2-bodhi-2000',{title:'Bhikkhu Bodhi (trans., 2000), The Connected Discourses of the Buddha: A Translation of the Saṃyutta Nikāya. Wisdom Publications'});
SOURCE('p2-hallisey-2015',{title:'Charles Hallisey (trans., 2015), Therigatha: Poems of the First Buddhist Women. Murty Classical Library of India, Harvard University Press'});
SOURCE('p2-analayo-2011',{title:'Anālayo (2011), A Comparative Study of the Majjhima-nikāya, 2 vols. Taipei: Dharma Drum Publishing'});
SOURCE('p2-suttacentral',{title:'SuttaCentral: early Buddhist texts, translations and parallels',url:'https://suttacentral.net/'});
SOURCE('p2-nyanatiloka',{title:'Nyanatiloka Mahāthera (1938; 4th edn 1983), Guide through the Abhidhamma-Piṭaka. Kandy: Buddhist Publication Society'});
SOURCE('p2-frauwallner-1995',{title:'Erich Frauwallner (1995), Studies in Abhidharma Literature and the Origins of Buddhist Philosophical Systems (trans. Sophie Francis Kidd). SUNY Press'});
SOURCE('p2-willemen-1998',{title:'Charles Willemen, Bart Dessein & Collett Cox (1998), Sarvāstivāda Buddhist Scholasticism. Leiden: Brill'});
SOURCE('p2-gethin-1992',{title:'Rupert Gethin (1992), The mātikās: memorization, mindfulness and the list, in J. Gyatso (ed.), In the Mirror of Memory, 149–172. SUNY Press'});
SOURCE('p2-nelson-im',{title:'Ted Nelson In Motion: parallel documents shown side by side',url:'https://ted-nelson-in-motion.puter.site/',note:'Sister course.'});

LESSON({id:'three-baskets',name:'The three baskets',short:'Three baskets',stage:'baskets',year:'Structure of the canon',level:'Introduction',
 why:'Every later chapter of the story refers to the three baskets, so it helps to know what each one holds.',
 prior:['oral-recitation'],references:['p2-norman-1983','p2-von-hinuber-1996','p2-gethin-1998','p2-lamotte-1988','p2-collins-1990','p2-schopen-1997'],ids:['three-baskets','three-baskets-sizes','three-baskets-word']});
LESSON({id:'vinaya-pitaka',name:'The Vinaya basket',short:'Vinaya',stage:'baskets',year:'Structure of the canon',level:'Core',
 why:'The community that carried the texts was itself defined by a text: its rules, their stories and its procedures.',
 prior:['three-baskets'],references:['p2-horner-bd','p2-von-hinuber-1996','p2-pachow-1955','p2-frauwallner-1956','p2-clarke-2015'],ids:['vinaya-pitaka','vinaya-pitaka-rule','vinaya-pitaka-schools']});
LESSON({id:'sutta-pitaka',name:'The basket of discourses',short:'Suttas',stage:'baskets',year:'Structure of the canon',level:'Core',
 why:'The discourses are the largest basket, and their Chinese counterparts are the best evidence for what is early in them.',
 prior:['three-baskets','memory-techniques'],references:['p2-bodhi-2000','p2-von-hinuber-1996','p2-hallisey-2015','p2-analayo-2011','p2-suttacentral','p2-nelson-im'],ids:['sutta-pitaka','sutta-pitaka-agamas','sutta-pitaka-find']});
LESSON({id:'abhidhamma-pitaka',name:'The Abhidhamma basket',short:'Abhidhamma',stage:'baskets',year:'Structure of the canon',level:'Extension',
 why:'The third basket shows how summary lists grew into systematic treatises, and where the schools’ canons part company.',
 prior:['three-baskets','memory-techniques'],references:['p2-nyanatiloka','p2-von-hinuber-1996','p2-frauwallner-1995','p2-willemen-1998','p2-gethin-1992'],ids:['abhidhamma-pitaka','abhidhamma-pitaka-two','abhidhamma-pitaka-matika']});

THREAD({id:'p2-parallels',name:'Comparing versions kept by different schools',ids:['vinaya-pitaka-schools','sutta-pitaka-agamas','abhidhamma-pitaka-two','comparing-canons','parallels-and-finds']});
THREAD({id:'p2-lists',name:'Lists that generate texts',ids:['memory-techniques-lists','abhidhamma-pitaka-matika','catalogues','digital-canons']});
THREAD({id:'p2-women',name:'Women in the story of the canon',ids:['three-baskets-word','sutta-pitaka','pali-text-society']});
