/* Era 8 · Immersive and beyond: lessons, further reading and connections. */
SOURCE('sutherland-1968',{title:'Sutherland, I. E. (1968). A head-mounted three dimensional display. AFIPS Fall Joint Computer Conference',url:'https://en.wikipedia.org/wiki/The_Sword_of_Damocles_(virtual_reality)'});
SOURCE('sutherland-1965',{title:'Sutherland, I. E. (1965). The ultimate display. Proceedings of the IFIP Congress'});
SOURCE('slater-wilbur-1997',{title:'Slater, M. & Wilbur, S. (1997). A framework for immersive virtual environments (FIVE). Presence 6(6)',url:'https://en.wikipedia.org/wiki/Immersion_(virtual_reality)'});
SOURCE('meehan-2002',{title:'Meehan, M., Insko, B., Whitton, M. & Brooks, F. P. (2002). Physiological measures of presence in stressful virtual environments. ACM SIGGRAPH'});
SOURCE('reason-brand-1975',{title:'Reason, J. T. & Brand, J. J. (1975). Motion Sickness. Academic Press',url:'https://en.wikipedia.org/wiki/Virtual_reality_sickness'});
SOURCE('cutting-vishton-1995',{title:'Cutting, J. E. & Vishton, P. M. (1995). Perceiving layout and knowing distances. In Epstein & Rogers (eds), Perception of Space and Motion',url:'https://en.wikipedia.org/wiki/Depth_perception'});
SOURCE('hoffman-2008',{title:'Hoffman, D. M., Girshick, A. R., Akeley, K. & Banks, M. S. (2008). Vergence–accommodation conflicts hinder visual performance and cause visual fatigue. Journal of Vision 8(3)',url:'https://en.wikipedia.org/wiki/Vergence-accommodation_conflict'});
SOURCE('milgram-kishino-1994',{title:'Milgram, P. & Kishino, F. (1994). A taxonomy of mixed reality visual displays. IEICE Transactions on Information and Systems',url:'https://en.wikipedia.org/wiki/Reality%E2%80%93virtuality_continuum'});
SOURCE('azuma-1997',{title:'Azuma, R. T. (1997). A survey of augmented reality. Presence 6(4)',url:'https://en.wikipedia.org/wiki/Augmented_reality'});
SOURCE('weizenbaum-1966',{title:'Weizenbaum, J. (1966). ELIZA: a computer program for the study of natural language communication between man and machine. Communications of the ACM 9(1)',url:'https://en.wikipedia.org/wiki/ELIZA'});
SOURCE('reeves-nass-1996',{title:'Reeves, B. & Nass, C. (1996). The Media Equation. Cambridge University Press',url:'https://en.wikipedia.org/wiki/The_Media_Equation'});
SOURCE('farwell-donchin-1988',{title:'Farwell, L. A. & Donchin, E. (1988). Talking off the top of your head. Electroencephalography and Clinical Neurophysiology 70(6)',url:'https://en.wikipedia.org/wiki/P300_(neuroscience)'});
SOURCE('wolpaw-2002',{title:'Wolpaw, J. R. et al. (2002). Brain–computer interfaces for communication and control. Clinical Neurophysiology 113(6)',url:'https://en.wikipedia.org/wiki/Brain%E2%80%93computer_interface'});
SOURCE('lee-see-2004',{title:'Lee, J. D. & See, K. A. (2004). Trust in automation: designing for appropriate reliance. Human Factors 46(1)'});
SOURCE('parasuraman-2000',{title:'Parasuraman, R., Sheridan, T. B. & Wickens, C. D. (2000). A model for types and levels of human interaction with automation. IEEE Trans. SMC-A 30(3)'});
SOURCE('parasuraman-manzey-2010',{title:'Parasuraman, R. & Manzey, D. H. (2010). Complacency and bias in human use of automation. Human Factors 52(3)',url:'https://en.wikipedia.org/wiki/Automation_bias'});
SOURCE('weiser-1991',{title:'Weiser, M. (1991). The computer for the 21st century. Scientific American 265(3)',url:'https://en.wikipedia.org/wiki/Ubiquitous_computing'});
SOURCE('weiser-brown-1996',{title:'Weiser, M. & Brown, J. S. (1996). Designing calm technology. PowerGrid Journal 1(1)',url:'https://en.wikipedia.org/wiki/Calm_technology'});
SOURCE('ishii-ullmer-1997',{title:'Ishii, H. & Ullmer, B. (1997). Tangible bits: towards seamless interfaces between people, bits and atoms. ACM CHI',url:'https://en.wikipedia.org/wiki/Tangible_user_interface'});

LESSON({id:'head-mounted-display',name:'Head-mounted displays',short:'Headsets',stage:'immersive',year:'1968',
 why:'Sutherland’s headset showed that a picture redrawn for every head movement can make a virtual room feel fixed in space.',
 prior:['sketchpad','light-pen'],level:'Core',references:['sutherland-1968','sutherland-1965'],
 ids:['head-mounted-display','head-mounted-display-fov','head-mounted-display-dof']});
LESSON({id:'presence',name:'Presence and its enemies',short:'Presence',stage:'immersive',year:'1997–2003',
 why:'Feeling “there” depends on what the system delivers; lag and sensory conflict break the illusion and make people ill.',
 prior:['head-mounted-display','response-time'],level:'Core',references:['slater-wilbur-1997','meehan-2002','reason-brand-1975'],
 ids:['presence','presence-latency','presence-sickness']});
LESSON({id:'depth-cues',name:'Seeing depth',short:'Depth cues',stage:'immersive',year:'1838–2008',
 why:'Flat screens borrow the cues the eye uses for distance; headsets add stereo but create a new conflict between pointing and focusing the eyes.',
 prior:['head-mounted-display','preattentive'],level:'Core',references:['cutting-vishton-1995','hoffman-2008'],
 ids:['depth-cues','depth-cues-stereo','depth-cues-vac']});
LESSON({id:'augmented-reality',name:'Augmented reality',short:'AR',stage:'immersive',year:'1992–1997',
 why:'Mixing virtual objects into the real world only works if they stay pinned in place and hidden where they should be.',
 prior:['depth-cues','head-mounted-display'],level:'Core',references:['milgram-kishino-1994','azuma-1997'],
 ids:['augmented-reality','augmented-reality-registration','augmented-reality-occlusion']});
LESSON({id:'conversational-ui',name:'Talking to computers',short:'Conversation',stage:'immersive',year:'1966–1999',
 why:'Language interfaces hide their options and invite social responses; ELIZA showed how little it takes to seem to understand.',
 prior:['command-line','mental-models'],level:'Core',references:['weizenbaum-1966','reeves-nass-1996'],
 ids:['conversational-ui','conversational-ui-repair','conversational-ui-social']});
LESSON({id:'brain-computer',name:'Brain–computer interfaces',short:'Brain signals',stage:'immersive',year:'1973–2002',
 why:'Reading intentions from brain activity is possible but slow and noisy; averaging and clever layouts trade speed for accuracy.',
 prior:['hick-law','vigilance'],level:'Advanced',references:['farwell-donchin-1988','wolpaw-2002'],
 ids:['brain-computer','brain-computer-averaging','brain-computer-itr']});
LESSON({id:'ai-agents',name:'Working with AI agents',short:'AI agents',stage:'immersive',year:'1978–today',
 why:'When software suggests or acts for us, the design question becomes how much to trust it and who stays in control.',
 prior:['conversational-ui','mental-models'],level:'Advanced',references:['lee-see-2004','parasuraman-2000','parasuraman-manzey-2010'],
 ids:['ai-agents','ai-agents-levels','ai-agents-confidence']});
LESSON({id:'calm-technology',name:'Calm and ubiquitous computing',short:'Calm tech',stage:'immersive',year:'1991–tomorrow',
 why:'Beyond screens and headsets: computers that fade into everyday things and inform without demanding attention.',
 prior:['interruptions','multi-touch'],level:'Advanced',references:['weiser-1991','weiser-brown-1996','ishii-ullmer-1997'],
 ids:['calm-technology','calm-technology-ubiquitous','calm-technology-tangible']});

THREAD({id:'h8-latency',name:'Waiting for the machine',ids:['time-sharing','response-time','presence-latency']});
THREAD({id:'h8-depth',name:'How the eye builds a scene',ids:['gestalt','depth-cues','depth-cues-stereo']});
THREAD({id:'h8-attention',name:'Centre and periphery of attention',ids:['vigilance','interruptions','calm-technology']});
THREAD({id:'h8-conversation',name:'Talking to machines',ids:['command-line','conversational-ui','ai-agents']});
