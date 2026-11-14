/* Era 5 · Seeing data: lessons, sources and connections. */
SOURCE('bertin-1967',{title:'Jacques Bertin, Sémiologie graphique (1967); English translation Semiology of Graphics (1983)'});
SOURCE('mackinlay-1986',{title:'Jock Mackinlay, “Automating the design of graphical presentations of relational information”, ACM Transactions on Graphics (1986)'});
SOURCE('cleveland-mcgill-1984',{title:'William S. Cleveland and Robert McGill, “Graphical perception”, Journal of the American Statistical Association (1984)',url:'https://doi.org/10.1080/01621459.1984.10478080'});
SOURCE('heer-bostock-2010',{title:'Jeffrey Heer and Michael Bostock, “Crowdsourcing graphical perception”, CHI (2010)'});
SOURCE('stevens-1957',{title:'S. S. Stevens, “On the psychophysical law”, Psychological Review (1957)',url:'https://doi.org/10.1037/h0046162'});
SOURCE('tufte-1983',{title:'Edward R. Tufte, The Visual Display of Quantitative Information (1983)'});
SOURCE('bateman-2010',{title:'Scott Bateman et al., “Useful junk? The effects of visual embellishment on comprehension and memorability of charts”, CHI (2010)'});
SOURCE('buzan-1974',{title:'Tony Buzan, Use Your Head (1974)'});
SOURCE('novak-gowin-1984',{title:'Joseph D. Novak and D. Bob Gowin, Learning How to Learn (1984)'});
SOURCE('nesbit-adesope-2006',{title:'John C. Nesbit and Olusola O. Adesope, “Learning with concept and knowledge maps: a meta-analysis”, Review of Educational Research (2006)',url:'https://doi.org/10.3102/00346543076003413'});
SOURCE('farrand-2002',{title:'Paul Farrand, Fearzana Hussain and Enid Hennessy, “The efficacy of the ‘mind map’ study technique”, Medical Education (2002)'});
SOURCE('shneiderman-1996',{title:'Ben Shneiderman, “The eyes have it: a task by data type taxonomy for information visualizations”, IEEE Symposium on Visual Languages (1996)'});
SOURCE('furnas-1986',{title:'George W. Furnas, “Generalized fisheye views”, CHI (1986)'});
SOURCE('cockburn-2009',{title:'Andy Cockburn, Amy Karlson and Benjamin B. Bederson, “A review of overview+detail, zooming, and focus+context interfaces”, ACM Computing Surveys (2009)',url:'https://doi.org/10.1145/1456650.1456652'});
SOURCE('rosling-2006',{title:'Hans Rosling, “The best stats you’ve ever seen”, TED (2006)',url:'https://www.ted.com/talks/hans_rosling_the_best_stats_you_ve_ever_seen'});
SOURCE('gapminder',{title:'Gapminder Foundation',url:'https://www.gapminder.org/'});
SOURCE('robertson-2008',{title:'George Robertson et al., “Effectiveness of animation in trend visualization”, IEEE TVCG (2008)'});
SOURCE('factfulness-2018',{title:'Hans Rosling, Ola Rosling and Anna Rosling Rönnlund, Factfulness (2018)'});
SOURCE('borland-taylor-2007',{title:'David Borland and Russell M. Taylor II, “Rainbow color map (still) considered harmful”, IEEE Computer Graphics and Applications (2007)',url:'https://doi.org/10.1109/MCG.2007.323435'});
SOURCE('harrower-brewer-2003',{title:'Mark Harrower and Cynthia A. Brewer, “ColorBrewer.org: an online tool for selecting colour schemes for maps”, The Cartographic Journal (2003)'});
SOURCE('colorbrewer',{title:'ColorBrewer: colour advice for maps',url:'https://colorbrewer2.org/'});
SOURCE('machado-2009',{title:'Gustavo M. Machado, Manuel M. Oliveira and Leandro A. F. Fernandes, “A physiologically-based model for simulation of color vision deficiency”, IEEE TVCG (2009)'});

LESSON({id:'visual-variables',name:'Visual variables',short:'Variables',stage:'visual',year:'1967',level:'Introduction',
 why:'Bertin named the handful of ways a mark can vary, and showed that each suits some kinds of data and not others.',
 prior:['gestalt','preattentive'],references:['bertin-1967','mackinlay-1986'],
 ids:['visual-variables','visual-variables-ranking','visual-variables-mapping']});
LESSON({id:'graphical-perception',name:'Graphical perception',short:'Perception',stage:'visual',year:'1984',level:'Core',
 why:'Cleveland and McGill measured how accurately people read each encoding, turning chart design from taste into evidence.',
 prior:['visual-variables'],references:['cleveland-mcgill-1984','heer-bostock-2010','stevens-1957'],
 ids:['graphical-perception','graphical-perception-pie-bar','graphical-perception-area']});
LESSON({id:'data-ink',name:'Data-ink and chartjunk',short:'Data-ink',stage:'visual',year:'1983',level:'Core',
 why:'Tufte argued that every drop of ink should show data; later experiments showed when decoration helps memory.',
 prior:['graphical-perception'],references:['tufte-1983','bateman-2010'],
 ids:['data-ink','data-ink-small-multiples','data-ink-useful-junk']});
LESSON({id:'mind-maps',name:'Mind maps and concept maps',short:'Mind maps',stage:'visual',year:'1974',level:'Introduction',
 why:'Radial and linked diagrams turned notes into pictures of knowledge; the evidence for them is real but modest.',
 prior:['working-memory','hypertext'],references:['buzan-1974','novak-gowin-1984','farrand-2002','nesbit-adesope-2006'],
 ids:['mind-maps','mind-maps-formats','mind-maps-evidence']});
LESSON({id:'overview-detail',name:'Overview and detail',short:'Overview',stage:'visual',year:'1986–1996',level:'Core',
 why:'Screens are small and data is large: overviews, zooming, filtering and fisheye views keep context while showing detail.',
 prior:['data-ink','direct-manipulation'],references:['shneiderman-1996','furnas-1986','cockburn-2009'],
 ids:['overview-detail','overview-detail-fisheye','overview-detail-minimap']});
LESSON({id:'animated-bubbles',name:'Moving statistics',short:'Bubbles',stage:'visual',year:'2006',level:'Core',
 why:'Hans Rosling made data move on stage to correct people’s picture of the world; studies show where animation helps and where it does not.',
 prior:['overview-detail','graphical-perception'],references:['rosling-2006','gapminder','robertson-2008','factfulness-2018'],
 ids:['animated-bubbles','animated-bubbles-analysis','animated-bubbles-factfulness']});
LESSON({id:'colour-maps',name:'Colour maps',short:'Colour',stage:'visual',year:'1990s–2007',level:'Core',
 why:'Colour is the most abused visual variable: rainbow maps invent edges, wrong schemes invent order, and red–green excludes many readers.',
 prior:['visual-variables'],references:['borland-taylor-2007','harrower-brewer-2003','colorbrewer','machado-2009'],
 ids:['colour-maps','colour-maps-schemes','colour-maps-cvd']});

THREAD({id:'h5-encode-perceive',name:'From perception research to chart rules',ids:['preattentive','visual-variables','graphical-perception','colour-maps']});
THREAD({id:'h5-maps-of-ideas',name:'Pictures of connected ideas',ids:['hypertext','mind-maps','mind-maps-formats','world-wide-web']});
THREAD({id:'h5-context',name:'Keeping context while zooming',ids:['sketchpad','overview-detail-fisheye','overview-detail-minimap','multi-touch']});
