/* Brain era 1 · The neuron: lessons, sources and connections. */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/BRAIN-BRIEF.md).
// The lesson ids, their order and the stage id are fixed. Add SOURCE('b1-…',{title,url?}) and THREAD({id:'b1-…',name,ids}) entries here.
LESSON({id:'animal-electricity',name:'Animal electricity',short:'Animal elec.',stage:'neuron',year:'1780–1850',level:'Introduction',
 why:'A twitching frog’s leg began the argument that nerves carry electricity, and measuring that signal made the nervous system a subject for physics.',
 prior:[],references:[],
 ids:['animal-electricity']});
LESSON({id:'neuron-doctrine',name:'The neuron doctrine',short:'Neurons',stage:'neuron',year:'1873–1906',level:'Introduction',
 why:'Golgi’s stain let Cajal see that the brain is built from separate cells, which is the starting point for everything else in the course.',
 prior:['animal-electricity'],references:[],
 ids:['neuron-doctrine']});
LESSON({id:'resting-potential',name:'The resting potential',short:'Resting pot.',stage:'neuron',year:'1888–1902',level:'Core',
 why:'Unequal ion concentrations across a selective membrane give every neuron a standing voltage, the store of energy that signalling spends.',
 prior:['animal-electricity','neuron-doctrine'],references:[],
 ids:['resting-potential']});
LESSON({id:'action-potential',name:'The action potential',short:'Spike',stage:'neuron',year:'1939–1952',level:'Core',
 why:'Hodgkin and Huxley’s measurements on the squid giant axon explained the nerve impulse with equations that are still in use.',
 prior:['resting-potential'],references:[],
 ids:['action-potential']});
LESSON({id:'myelin-conduction',name:'Myelin and conduction',short:'Myelin',stage:'neuron',year:'1878–1949',level:'Core',
 why:'Wrapping an axon in myelin lets the impulse jump from node to node, which is why losing myelin slows or blocks signals.',
 prior:['action-potential'],references:[],
 ids:['myelin-conduction']});
LESSON({id:'glia',name:'Glia',short:'Glia',stage:'neuron',year:'1856–today',level:'Core',
 why:'About half the cells in the brain are not neurons, and they insulate, feed, clean up and help shape the signalling.',
 prior:['neuron-doctrine','myelin-conduction'],references:[],
 ids:['glia']});
