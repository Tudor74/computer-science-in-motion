/* Tripitaka era 1 · Spoken teaching: lessons, sources and connections. */
SOURCE('analayo-2022',{title:'Anālayo (2022), Early Buddhist Oral Tradition: Textual Formation and Transmission. Wisdom Publications'});
SOURCE('analayo-2007',{title:'Anālayo (2007), Oral dimensions of Pāli discourses: pericopes, other mnemonic techniques and the oral performance context, Canadian Journal of Buddhist Studies 3: 5–33'});
SOURCE('wynne-2004',{title:'Alexander Wynne (2004), The oral transmission of early Buddhist literature, Journal of the International Association of Buddhist Studies 27(1): 97–127'});
SOURCE('allon-1997',{title:'Mark Allon (1997), Style and Function: A Study of the Dominant Stylistic Features of the Prose Portions of Pāli Canonical Sutta Texts and Their Mnemonic Function. Tokyo: International Institute for Buddhist Studies'});
SOURCE('cousins-1983',{title:'L. S. Cousins (1983), Pali oral literature, in P. Denwood & A. Piatigorsky (eds), Buddhist Studies Ancient and Modern, 1–11. London: Curzon'});
SOURCE('staal-1986',{title:'Frits Staal (1986), The Fidelity of Oral Tradition and the Origins of Science. Amsterdam: North-Holland'});
SOURCE('horner-bd5',{title:'I. B. Horner (trans., 1952), The Book of the Discipline, vol. 5 (Cullavagga). Pali Text Society'});
SOURCE('gethin-1992',{title:'Rupert Gethin (1992), The mātikās: memorization, mindfulness and the list, in J. Gyatso (ed.), In the Mirror of Memory, 149–172. SUNY Press'});
SOURCE('bodhi-2012',{title:'Bhikkhu Bodhi (trans., 2012), The Numerical Discourses of the Buddha: A Translation of the Aṅguttara Nikāya. Wisdom Publications'});
SOURCE('von-hinuber-1994',{title:'Oskar von Hinüber (1994), Untersuchungen zur Mündlichkeit früher mittelindischer Texte der Buddhisten. Stuttgart: Franz Steiner'});
SOURCE('adikaram-1946',{title:'E. W. Adikaram (1946), Early History of Buddhism in Ceylon. Migoda: D. S. Puswella'});
SOURCE('norman-1983',{title:'K. R. Norman (1983), Pāli Literature. Wiesbaden: Otto Harrassowitz'});
SOURCE('von-hinuber-1996',{title:'Oskar von Hinüber (1996), A Handbook of Pāli Literature. Berlin: Walter de Gruyter'});
SOURCE('salomon-2018',{title:'Richard Salomon (2018), The Buddhist Literature of Ancient Gandhāra: An Introduction with Selected Translations. Wisdom Publications'});
SOURCE('bechert-1980',{title:'Heinz Bechert (ed., 1980), The Language of the Earliest Buddhist Tradition. Göttingen: Vandenhoeck & Ruprecht (papers by Brough and Norman on sakāya niruttiyā)'});
SOURCE('edgerton-1953',{title:'Franklin Edgerton (1953), Buddhist Hybrid Sanskrit Grammar and Dictionary. Yale University Press'});
SOURCE('language-im',{title:'Language In Motion: language families, sound change and writing systems',url:'https://language-in-motion.puter.site/',note:'Sister course.'});

LESSON({id:'oral-recitation',name:'Reciting together',short:'Recitation',stage:'oral',year:'c. 5th century BCE onward',level:'Introduction',
 why:'For centuries the teachings existed only in memory and voice; group recitation is what kept them stable.',
 prior:[],references:['analayo-2022','wynne-2004','cousins-1983','staal-1986','horner-bd5'],ids:['oral-recitation','oral-recitation-sangiti','oral-recitation-vedic']});
LESSON({id:'memory-techniques',name:'Memory techniques',short:'Memory aids',stage:'oral',year:'Oral period',level:'Introduction',
 why:'Stock phrases, numbered lists and rhythmic word order are why the texts look as they do: they were built to be remembered.',
 prior:['oral-recitation'],references:['allon-1997','analayo-2007','gethin-1992','bodhi-2012','von-hinuber-1994'],ids:['memory-techniques','memory-techniques-lists','memory-techniques-waxing']});
LESSON({id:'bhanakas',name:'The reciters',short:'Reciters',stage:'oral',year:'From the 3rd century BCE',level:'Core',
 why:'Collections were kept alive by named groups of specialists, whose existence is confirmed by inscriptions.',
 prior:['oral-recitation','memory-techniques'],references:['adikaram-1946','norman-1983','von-hinuber-1996','analayo-2022'],ids:['bhanakas','bhanakas-load','bhanakas-differences']});
LESSON({id:'languages-of-teaching',name:'The languages of the teaching',short:'Languages',stage:'oral',year:'5th century BCE–5th century CE',level:'Core',
 why:'The teaching travelled in several related languages; knowing what Pali is, and is not, prevents a common misunderstanding.',
 prior:['oral-recitation'],references:['norman-1983','salomon-2018','bechert-1980','edgerton-1953','language-im'],ids:['languages-of-teaching','languages-of-teaching-words','languages-of-teaching-own-dialect']});

THREAD({id:'p1-stability',name:'Keeping a text stable',ids:['oral-recitation','memory-techniques','bhanakas-load','palm-leaf','tripitaka-koreana','digital-canons']});
THREAD({id:'p1-languages',name:'From language to language',ids:['languages-of-teaching','languages-of-teaching-words','gandharan-scrolls','kumarajiva','tibetan-translation']});
THREAD({id:'p1-edges',name:'Where the canon’s edges were argued',ids:['bhanakas-differences','three-baskets-word','second-council-schools','catalogues','comparing-canons']});
