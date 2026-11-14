/* Era 2 · Pointing and linking (1960s): lessons, sources and connections. */
SOURCE('sutherland-1963',{title:'Ivan Sutherland (1963), Sketchpad: A man–machine graphical communication system (PhD thesis, MIT; University of Cambridge technical report UCAM-CL-TR-574, 2003 edition)',url:'https://www.cl.cam.ac.uk/techreports/UCAM-CL-TR-574.pdf'});
SOURCE('english-1967',{title:'English, Engelbart & Berman (1967), Display-selection techniques for text manipulation, IEEE Transactions on Human Factors in Electronics, HFE-8(1)'});
SOURCE('card-1978',{title:'Card, English & Burr (1978), Evaluation of mouse, rate-controlled isometric joystick, step keys, and text keys for text selection on a CRT, Ergonomics 21(8)'});
SOURCE('engelbart-1968',{title:'Engelbart & English (1968), A research center for augmenting human intellect, AFIPS Fall Joint Computer Conference'});
SOURCE('mother-of-all-demos',{title:'The Mother of All Demos (1968), overview',url:'https://en.wikipedia.org/wiki/The_Mother_of_All_Demos'});
SOURCE('fitts-1954',{title:'Paul Fitts (1954), The information capacity of the human motor system in controlling the amplitude of movement, Journal of Experimental Psychology 47(6)',url:'https://doi.org/10.1037/h0055392'});
SOURCE('mackenzie-1992',{title:'I. Scott MacKenzie (1992), Fitts’ law as a research and design tool in human–computer interaction, Human–Computer Interaction 7(1)',url:'https://doi.org/10.1207/s15327051hci0701_3'});
SOURCE('walker-1990',{title:'Walker & Smelcer (1990), A comparison of selection times from walking and pull-down menus, CHI ’90'});
SOURCE('callahan-1988',{title:'Callahan, Hopkins, Weiser & Shneiderman (1988), An empirical comparison of pie vs. linear menus, CHI ’88'});
SOURCE('hick-1952',{title:'W. E. Hick (1952), On the rate of gain of information, Quarterly Journal of Experimental Psychology 4(1)',url:'https://doi.org/10.1080/17470215208416600'});
SOURCE('hyman-1953',{title:'Ray Hyman (1953), Stimulus information as a determinant of reaction time, Journal of Experimental Psychology 45(3)',url:'https://doi.org/10.1037/h0056940'});
SOURCE('landauer-1985',{title:'Landauer & Nachbar (1985), Selection from alphabetic and numeric menu trees using a touch screen: breadth, depth, and width, CHI ’85'});
SOURCE('cockburn-2007',{title:'Cockburn, Gutwin & Greenberg (2007), A predictive model of menu performance, CHI ’07'});
SOURCE('bush-1945',{title:'Vannevar Bush (1945), As We May Think, The Atlantic',url:'https://www.theatlantic.com/magazine/archive/1945/07/as-we-may-think/303881/'});
SOURCE('nelson-1965',{title:'Ted Nelson (1965), Complex information processing: a file structure for the complex, the changing and the indeterminate, ACM National Conference',url:'https://doi.org/10.1145/800197.806036'});
SOURCE('nelson-1981',{title:'Ted Nelson (1981), Literary Machines (Mindful Press); Project Xanadu',url:'https://en.wikipedia.org/wiki/Project_Xanadu'});
SOURCE('conklin-1987',{title:'Jeff Conklin (1987), Hypertext: an introduction and survey, IEEE Computer 20(9)',url:'https://doi.org/10.1109/MC.1987.1663693'});
SOURCE('engelbart-1962',{title:'Douglas Engelbart (1962), Augmenting Human Intellect: A Conceptual Framework (SRI report)'});

LESSON({id:'sketchpad',name:'Sketchpad',short:'Sketchpad',stage:'pointing',year:'1963',level:'Introduction',
 why:'Sketchpad showed that a screen could be drawn on directly, and that a drawing could hold relationships and reusable parts, not just lines.',
 prior:['light-pen'],references:['sutherland-1963'],ids:['sketchpad','sketchpad-instances','sketchpad-zoom']});
LESSON({id:'mouse',name:'The mouse',short:'Mouse',stage:'pointing',year:'1964–1968',level:'Introduction',
 why:'The mouse won because it was measured: in controlled tests it was faster and more accurate than its rivals.',
 prior:['sketchpad','light-pen'],references:['english-1967','card-1978','engelbart-1968','mother-of-all-demos'],ids:['mouse','mouse-vs-joystick','mouse-demo-1968']});
LESSON({id:'fitts-law',name:'Fitts’s law',short:'Fitts’s law',stage:'pointing',year:'1954',level:'Core',
 why:'Fitts’s law turns “make important targets big and close” into a prediction you can calculate and test.',
 prior:['mouse'],references:['fitts-1954','mackenzie-1992','walker-1990','callahan-1988'],ids:['fitts-law','fitts-edges','fitts-pie-menu']});
LESSON({id:'hick-law',name:'Hick’s law',short:'Hick’s law',stage:'pointing',year:'1952–1953',level:'Core',
 why:'Choosing takes time that grows with the information in the choice, which shapes how menus should be organised.',
 prior:['fitts-law'],references:['hick-1952','hyman-1953','landauer-1985','cockburn-2007'],ids:['hick-law','hick-menus','hick-familiar']});
LESSON({id:'hypertext',name:'Hypertext',short:'Hypertext',stage:'pointing',year:'1945–1965',level:'Introduction',
 why:'Bush’s associative trails and Nelson’s hypertext reimagined documents as networks, decades before the web.',
 prior:['mouse'],references:['bush-1945','nelson-1965','nelson-1981','conklin-1987'],ids:['hypertext','hypertext-memex','hypertext-transclusion','hypertext-lost']});
LESSON({id:'augmenting-intellect',name:'Augmenting human intellect',short:'Augmenting',stage:'pointing',year:'1962',level:'Core',
 why:'Engelbart framed computing as a partner for thinking, with structured views, two-handed input and teams improving their own tools.',
 prior:['mouse','hypertext'],references:['engelbart-1962','engelbart-1968','mother-of-all-demos'],ids:['augmenting-intellect','augmenting-chord','augmenting-bootstrapping']});

THREAD({id:'h2-pointing-laws',name:'Laws of pointing',ids:['fitts-law','mouse-vs-joystick','fitts-edges','touch-targets']});
THREAD({id:'h2-links',name:'From trails to links',ids:['hypertext-memex','hypertext','hypertext-transclusion','world-wide-web']});
THREAD({id:'h2-choice',name:'Choosing takes time',ids:['hick-law','hick-menus','working-memory']});
THREAD({id:'h2-views',name:'Overview, then detail',ids:['sketchpad-zoom','augmenting-intellect','overview-detail']});
