/* Tripitaka era 7 · Printing (868–1900): lessons, sources and connections. */
SOURCE('p7-bl-diamond',{title:'British Library, Or.8210/P.2: the Diamond Sūtra of 868 (International Dunhuang Programme).',url:'https://idp.bl.uk/'});
SOURCE('p7-wood-barnard',{title:'Wood, F. & Barnard, M. (2010). The Diamond Sutra: The Story of the World’s Earliest Dated Printed Book. British Library.'});
SOURCE('p7-tsien',{title:'Tsien, T.-H. (1985). Paper and Printing. Science and Civilisation in China, vol. 5 part 1. Cambridge University Press.'});
SOURCE('p7-barrett',{title:'Barrett, T. H. (2008). The Woman Who Discovered Printing. Yale University Press.',note:'On Empress Wu and the early spread of printing.'});
SOURCE('p7-wu-chia',{title:'Wu, J. & Chia, L. (eds) (2016). Spreading Buddha’s Word in East Asia: The Formation and Transformation of the Chinese Buddhist Canon. Columbia University Press.'});
SOURCE('p7-lancaster',{title:'Lancaster, L. R. & Park, S.-B. (1979). The Korean Buddhist Canon: A Descriptive Catalogue. University of California Press.'});
SOURCE('p7-unesco-haeinsa',{title:'UNESCO World Heritage List no. 737: Haeinsa Temple Janggyeong Panjeon, the Depositories for the Tripitaka Koreana Woodblocks (1995).',url:'https://whc.unesco.org/en/list/737'});
SOURCE('p7-unesco-kuthodaw',{title:'UNESCO Memory of the World Register (2013): Maha Lawkamarazein or Kuthodaw Inscription Shrines.'});
SOURCE('p7-chalmers',{title:'Chalmers, R. (1898). The King of Siam’s edition of the Pāli Tipiṭaka. Journal of the Royal Asiatic Society 30, 1–10.'});
SOURCE('p7-hinuber',{title:'Hinüber, O. von (1996). A Handbook of Pāli Literature. De Gruyter.'});
SOURCE('p7-clark',{title:'Clark, C. (2015). The Sixth Buddhist Council: its purpose, presentation, and product. Journal of Burma Studies 19(1), 79–112.'});
SOURCE('p7-language',{title:'Language In Motion: scripts, printing and translation in general.',url:'https://language-in-motion.puter.site/',note:'See its lessons on printing and scripts of the world.'});

LESSON({id:'diamond-sutra-868',name:'The Diamond Sūtra of 868',short:'Diamond Sūtra',stage:'printing',year:'868',level:'Introduction',
 why:'The oldest printed book that carries its own date is a Buddhist scroll, and it shows the craft was already mature.',
 prior:['kumarajiva','palm-leaf'],references:['p7-bl-diamond','p7-wood-barnard','p7-tsien','p7-barrett','p7-language'],
 ids:['diamond-sutra-868','diamond-sutra-868-earlier','diamond-sutra-868-print']});
LESSON({id:'song-editions',name:'The Song editions',short:'Song editions',stage:'printing',year:'971–1322',level:'Core',
 why:'Printing a whole canon took an empire’s resources; once it was done, every later edition could copy and correct it.',
 prior:['diamond-sutra-868','catalogues'],references:['p7-wu-chia','p7-tsien'],
 ids:['song-editions','song-editions-copies','song-editions-family']});
LESSON({id:'tripitaka-koreana',name:'The Tripitaka Koreana',short:'Tripitaka Koreana',stage:'printing',year:'1236–1251',level:'Core',
 why:'The only early printed canon whose blocks survive complete, and the base of the standard modern Chinese edition.',
 prior:['song-editions'],references:['p7-lancaster','p7-unesco-haeinsa','p7-wu-chia'],
 ids:['tripitaka-koreana','tripitaka-koreana-block','tripitaka-koreana-halls']});
LESSON({id:'royal-editions',name:'Royal editions',short:'Royal editions',stage:'printing',year:'1868–1956',level:'Core',
 why:'Kings in Burma and Siam fixed the Pali canon in stone and in print, and a modern council collated the results.',
 prior:['palm-leaf','three-baskets','first-council'],references:['p7-unesco-kuthodaw','p7-chalmers','p7-hinuber','p7-clark'],
 ids:['royal-editions','royal-editions-chulalongkorn','royal-editions-sixth-council']});

THREAD({id:'p7-media',name:'What the canon was written on',ids:['palm-leaf','gandharan-scrolls','diamond-sutra-868','tripitaka-koreana-block','royal-editions','royal-editions-chulalongkorn','digital-canons']});
THREAD({id:'p7-collation',name:'Comparing copies to fix a text',ids:['oral-recitation','catalogues','song-editions-family','royal-editions-sixth-council','pali-text-society-editing','parallels-and-finds']});
THREAD({id:'p7-lineage',name:'From Kaibao to the Taishō',ids:['catalogues','song-editions','song-editions-family','tripitaka-koreana','taisho']});
