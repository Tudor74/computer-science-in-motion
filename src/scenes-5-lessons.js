/* Tripitaka In Motion · era 5 · Into Chinese: lessons, sources and connections. */
SOURCE('p5-sengyou',{title:'Sengyou (c. 515). Chu sanzang ji ji (Collected Records on the Tripiṭaka), Taishō no. 2145. The oldest surviving Chinese Buddhist catalogue.'});
SOURCE('p5-huijiao',{title:'Huijiao (c. 530). Gaoseng zhuan (Biographies of Eminent Monks), Taishō no. 2059.'});
SOURCE('p5-zurcher',{title:'Zürcher, E. (1959; 3rd edn 2007). The Buddhist Conquest of China. Brill.'});
SOURCE('p5-nattier-2008',{title:'Nattier, J. (2008). A Guide to the Earliest Chinese Buddhist Translations: Texts from the Eastern Han and Three Kingdoms Periods. International Research Institute for Advanced Buddhology, Soka University.'});
SOURCE('p5-mair-2012',{title:'Mair, V. H. (2012). What is geyi, after all? China Report 48(1–2), 29–59.',note:'Argues that “matching meanings” was a brief and limited practice, not the method of early translation.'});
SOURCE('p5-funayama',{title:'Funayama, T. (2013). Butten wa dō kan’yaku sareta no ka (How were Buddhist scriptures translated into Chinese?). Iwanami Shoten.'});
SOURCE('p5-cheung',{title:'Cheung, M. P. Y. (ed.) (2006). An Anthology of Chinese Discourse on Translation, vol. 1: From Earliest Times to the Buddhist Project. St Jerome.'});
SOURCE('p5-lu-2004',{title:'Lu, Yang (2004). Narrative and historicity in the Buddhist biographies of early medieval China: the case of Kumārajīva. Asia Major, 3rd series, 17(2), 1–43.'});
SOURCE('p5-robinson',{title:'Robinson, R. H. (1967). Early Mādhyamika in India and China. University of Wisconsin Press.'});
SOURCE('p5-xiyuji',{title:'Xuanzang and Bianji (646). Da Tang Xiyu ji, Taishō no. 2087. English: Li Rongxi (1996), The Great Tang Dynasty Record of the Western Regions. Numata Center.'});
SOURCE('p5-huili',{title:'Huili and Yancong (688). Biography of the Tripiṭaka Master of the Great Ci’en Monastery, Taishō no. 2053. English: Li Rongxi (1995). Numata Center.'});
SOURCE('p5-fayun',{title:'Fayun (1143). Fanyi mingyi ji (Collection of Translated Terms and Their Meanings), Taishō no. 2131.',note:'Its preface is the earliest record of the “five kinds of untranslatable terms” credited to Xuanzang.'});
SOURCE('p5-nattier-1992',{title:'Nattier, J. (1992). The Heart Sūtra: a Chinese apocryphal text? Journal of the International Association of Buddhist Studies 15(2), 153–223.'});
SOURCE('p5-tanahashi',{title:'Tanahashi, K. (2014). The Heart Sutra: A Comprehensive Guide to the Classic of Mahayana Buddhism. Shambhala.',note:'Surveys the debate over the text’s origin, including replies to Nattier.'});
SOURCE('p5-zhisheng',{title:'Zhisheng (730). Kaiyuan shijiao lu (Record of Śākyamuni’s Teachings Compiled in the Kaiyuan Era), Taishō no. 2154.'});
SOURCE('p5-storch',{title:'Storch, T. (2014). The History of Chinese Buddhist Bibliography: Censorship and Transformation of the Tripitaka. Cambria Press.'});
SOURCE('p5-buswell',{title:'Buswell, R. E. (ed.) (1990). Chinese Buddhist Apocrypha. University of Hawai‘i Press.',note:'Includes Tokuno, K., The evaluation of indigenous scriptures in Chinese Buddhist bibliographical catalogues.'});
SOURCE('p5-wu-chia',{title:'Wu, J. and Chia, L. (eds.) (2016). Spreading Buddha’s Word in East Asia: The Formation and Transformation of the Chinese Buddhist Canon. Columbia University Press.'});
SOURCE('p5-harrison-2010',{title:'Harrison, P. (2010). Experimental core samples of Chinese translations of two Buddhist sūtras analysed in the light of recent Sanskrit manuscript discoveries. Journal of the International Association of Buddhist Studies 31(1–2), 205–249.'});
SOURCE('p5-language',{title:'Language In Motion: writing systems, sound change and what translation can and cannot carry across.',url:'https://language-in-motion.puter.site/'});

LESSON({id:'first-translations',name:'The first translations',short:'First translations',stage:'chinese',year:'2nd–3rd century',level:'Introduction',
 why:'From about 148 CE, monks from Central Asia and their Chinese helpers began to put Buddhist texts into a language with no words for most of their ideas.',
 prior:['sanskrit-canons','gandharan-scrolls','languages-of-teaching'],references:['p5-sengyou','p5-zurcher','p5-nattier-2008','p5-mair-2012','p5-funayama','p5-language'],
 ids:['first-translations','first-translations-team','first-translations-geyi']});
LESSON({id:'kumarajiva',name:'Kumārajīva',short:'Kumārajīva',stage:'chinese',year:'344–413',level:'Core',
 why:'A monk from Kucha whose translation bureau at Chang’an produced the Chinese versions of the Lotus, Diamond and Vimalakīrti sūtras that are still recited.',
 prior:['first-translations'],references:['p5-huijiao','p5-sengyou','p5-lu-2004','p5-robinson','p5-harrison-2010'],
 ids:['kumarajiva','kumarajiva-bureau','kumarajiva-survival']});
LESSON({id:'xuanzang',name:'Xuanzang',short:'Xuanzang',stage:'chinese',year:'602–664',level:'Core',
 why:'A pilgrim who spent sixteen years on the road to India and back, then nineteen translating what he had brought, with a new standard of exactness.',
 prior:['kumarajiva','sanskrit-canons'],references:['p5-xiyuji','p5-huili','p5-fayun','p5-nattier-1992','p5-tanahashi','p5-cheung'],
 ids:['xuanzang','xuanzang-untranslatable','xuanzang-heart']});
LESSON({id:'catalogues',name:'The catalogues',short:'Catalogues',stage:'chinese',year:'374–730',level:'Core',
 why:'Lists of texts, with judgements on which were genuine, turned a growing pile of translations into a canon with a fixed order.',
 prior:['first-translations','kumarajiva','three-baskets'],references:['p5-sengyou','p5-zhisheng','p5-storch','p5-buswell','p5-wu-chia'],
 ids:['catalogues','catalogues-judge','catalogues-kaiyuan']});

THREAD({id:'p5-translation',name:'How translation shapes a text',ids:['languages-of-teaching','first-translations-geyi','kumarajiva-bureau','xuanzang-untranslatable','tibetan-translation-team','tibetan-translation-mahavyutpatti','mongolian-manchu-relay']});
THREAD({id:'p5-what-counts',name:'Deciding what belongs in a canon',ids:['three-baskets','catalogues-judge','catalogues-kaiyuan','kangyur-tengyur-buton','comparing-canons','taisho']});
THREAD({id:'p5-diamond',name:'One sūtra through the centuries',ids:['kumarajiva-survival','diamond-sutra-868','digital-canons']});
