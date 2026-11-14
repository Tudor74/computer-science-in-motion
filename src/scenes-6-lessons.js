/* Era 6 · The networked page: lessons, further reading and connections. */
SOURCE('berners-lee-1989',{title:'Tim Berners-Lee (1989). Information Management: A Proposal. CERN',url:'https://www.w3.org/History/1989/proposal.html'});
SOURCE('nelson-1981',{title:'Ted Nelson (1981). Literary Machines'});
SOURCE('zittrain-2014',{title:'Zittrain, Albert & Lessig (2014). Perma: Scoping and addressing the problem of link and reference rot in legal citation. Harvard Law Review Forum 127'});
SOURCE('wcag-1999',{title:'W3C (1999). Web Content Accessibility Guidelines 1.0',url:'https://www.w3.org/TR/WCAG10/'});
SOURCE('pirolli-card-1999',{title:'Pirolli & Card (1999). Information foraging. Psychological Review 106(4), 643–675',url:'https://doi.org/10.1037/0033-295X.106.4.643'});
SOURCE('charnov-1976',{title:'Charnov (1976). Optimal foraging, the marginal value theorem. Theoretical Population Biology 9(2)',url:'https://doi.org/10.1016/0040-5809(76)90040-X'});
SOURCE('lynch-1960',{title:'Kevin Lynch (1960). The Image of the City. MIT Press'});
SOURCE('nielsen-landauer-1993',{title:'Nielsen & Landauer (1993). A mathematical model of the finding of usability problems. INTERCHI ’93',url:'https://doi.org/10.1145/169059.169166'});
SOURCE('faulkner-2003',{title:'Faulkner (2003). Beyond the five-user assumption. Behavior Research Methods, Instruments & Computers 35(3)',url:'https://doi.org/10.3758/BF03195514'});
SOURCE('ericsson-simon-1980',{title:'Ericsson & Simon (1980). Verbal reports as data. Psychological Review 87(3)',url:'https://doi.org/10.1037/0033-295X.87.3.215'});
SOURCE('brooke-1996',{title:'Brooke (1996). SUS: a “quick and dirty” usability scale. In Usability Evaluation in Industry'});
SOURCE('nielsen-molich-1990',{title:'Nielsen & Molich (1990). Heuristic evaluation of user interfaces. CHI ’90',url:'https://doi.org/10.1145/97243.97281'});
SOURCE('nielsen-1994',{title:'Jakob Nielsen (1994). Usability Inspection Methods (with Mack); the ten usability heuristics',url:'https://www.nngroup.com/articles/ten-usability-heuristics/'});
SOURCE('nielsen-2006',{title:'Jakob Nielsen (2006). F-shaped pattern for reading web content. Nielsen Norman Group',url:'https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content-discovered/'});
SOURCE('benway-1998',{title:'Benway & Lane (1998). Banner blindness: web searchers often miss “obvious” links. Internetworking 1.3'});
SOURCE('simon-1956',{title:'Herbert Simon (1956). Rational choice and the structure of the environment. Psychological Review 63(2)',url:'https://doi.org/10.1037/h0042769'});
SOURCE('krug-2000',{title:'Steve Krug (2000). Don’t Make Me Think. New Riders'});
SOURCE('miller-1968',{title:'Robert B. Miller (1968). Response time in man–computer conversational transactions. AFIPS Fall Joint Computer Conference',url:'https://doi.org/10.1145/1476589.1476628'});
SOURCE('card-1991',{title:'Card, Robertson & Mackinlay (1991). The information visualizer, an information workspace. CHI ’91',url:'https://doi.org/10.1145/108844.108874'});
SOURCE('myers-1985',{title:'Brad Myers (1985). The importance of percent-done progress indicators for computer–human interfaces. CHI ’85',url:'https://doi.org/10.1145/317456.317459'});
SOURCE('harrison-2007',{title:'Harrison, Amento, Kuznetsov & Bell (2007). Rethinking the progress bar. UIST ’07',url:'https://doi.org/10.1145/1294211.1294231'});

LESSON({id:'world-wide-web',name:'The World Wide Web',short:'The web',stage:'web',year:'1989–1993',level:'Introduction',
 why:'The web joined hypertext to the internet with addresses and one-way links, which let it grow without permission but left links to break.',
 prior:['hypertext','command-line'],references:['berners-lee-1989','nelson-1981','zittrain-2014','wcag-1999'],
 ids:['world-wide-web','world-wide-web-one-way','world-wide-web-link-rot','world-wide-web-clients']});
LESSON({id:'information-scent',name:'Information scent and foraging',short:'Foraging',stage:'web',year:'1999',level:'Core',
 why:'People hunt for information like animals hunt for food, so labels, travel cost and landmarks decide where they go and when they give up.',
 prior:['world-wide-web','hick-law'],references:['pirolli-card-1999','charnov-1976','lynch-1960'],
 ids:['information-scent','information-scent-patch','information-scent-breadcrumbs']});
LESSON({id:'usability-testing',name:'Testing with users',short:'User testing',stage:'web',year:'1980s–1990s',level:'Core',
 why:'Watching a few real people try real tasks finds most problems cheaply, if you listen to why they struggle and test again after fixing.',
 prior:['keystroke-model','information-scent'],references:['nielsen-landauer-1993','faulkner-2003','ericsson-simon-1980','brooke-1996'],
 ids:['usability-testing','usability-testing-think-aloud','usability-testing-sus']});
LESSON({id:'heuristics',name:'Heuristic evaluation',short:'Heuristics',stage:'web',year:'1990–1994',level:'Core',
 why:'Experts inspecting against a few principles find many problems without users, provided several evaluators work independently and rate severity.',
 prior:['usability-testing','direct-manipulation','affordances'],references:['nielsen-molich-1990','nielsen-1994'],
 ids:['heuristics','heuristics-severity','heuristics-evaluators']});
LESSON({id:'scanning-patterns',name:'How people scan pages',short:'Scanning',stage:'web',year:'1998–2006',level:'Core',
 why:'Eye-tracking showed people scan, skip anything that looks like an ad, and settle for the first good-enough link.',
 prior:['eye-movements','preattentive','information-scent'],references:['nielsen-2006','benway-1998','simon-1956','krug-2000'],
 ids:['scanning-patterns','scanning-patterns-banner','scanning-patterns-satisficing']});
LESSON({id:'response-time',name:'Response time and waiting',short:'Waiting',stage:'web',year:'1968–2007',level:'Core',
 why:'Human limits of 0.1 s, 1 s and 10 s set how fast an interface must answer, and how to make the unavoidable waits feel shorter.',
 prior:['time-sharing','world-wide-web'],references:['miller-1968','card-1991','myers-1985','harrison-2007'],
 ids:['response-time','response-time-progress','response-time-optimistic']});

THREAD({id:'links-last',name:'Links that last, or break',ids:['hypertext','world-wide-web-one-way','world-wide-web-link-rot']});
THREAD({id:'waiting',name:'Waiting for the machine',ids:['time-sharing','response-time','response-time-progress']});
THREAD({id:'where-eyes-go',name:'Where the eyes go',ids:['eye-movements','scanning-patterns','scanning-patterns-banner']});
THREAD({id:'how-many-people',name:'How many people find the problems?',ids:['usability-testing','heuristics-evaluators']});
