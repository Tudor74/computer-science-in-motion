/* Brain era 2 · Synapses: lessons, sources and connections. */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/BRAIN-BRIEF.md).
// The lesson ids, their order and the stage id are fixed. Add SOURCE('b2-…',{title,url?}) and THREAD({id:'b2-…',name,ids}) entries here.
LESSON({id:'synapse-discovery',name:'The synapse',short:'Synapse',stage:'synapse',year:'1897–1921',level:'Introduction',
 why:'Sherrington named the gap between neurons and Loewi’s two frog hearts showed that a chemical carries the message across it.',
 prior:['neuron-doctrine','action-potential'],references:[],
 ids:['synapse-discovery']});
LESSON({id:'quantal-release',name:'Quantal release',short:'Quanta',stage:'synapse',year:'1952–1954',level:'Core',
 why:'Katz found that transmitter is released in fixed packets, which turned synaptic strength into something that can be counted.',
 prior:['synapse-discovery'],references:[],
 ids:['quantal-release']});
LESSON({id:'excitation-inhibition',name:'Excitation and inhibition',short:'Excite/inhibit',stage:'synapse',year:'1951–1960s',level:'Core',
 why:'A neuron adds up small pushes towards and away from threshold, and that sum decides whether it fires.',
 prior:['quantal-release','action-potential'],references:[],
 ids:['excitation-inhibition']});
LESSON({id:'neurotransmitters',name:'Neurotransmitters',short:'Transmitters',stage:'synapse',year:'1914–1958',level:'Core',
 why:'A small set of chemicals does the brain’s signalling, and showing that each one is a transmitter took decades of careful evidence.',
 prior:['synapse-discovery'],references:[],
 ids:['neurotransmitters']});
LESSON({id:'receptors-drugs',name:'Receptors and drugs',short:'Receptors',stage:'synapse',year:'1905–today',level:'Core',
 why:'What a transmitter does depends on the receptor it meets, and most drugs that act on the brain work by mimicking or blocking one.',
 prior:['neurotransmitters','excitation-inhibition'],references:[],
 ids:['receptors-drugs']});
LESSON({id:'neuromodulation',name:'Neuromodulation',short:'Modulation',stage:'synapse',year:'1960s–today',level:'Advanced',
 why:'A few small groups of neurons spread chemicals widely and change how whole circuits behave without carrying the detailed message themselves.',
 prior:['receptors-drugs'],references:[],
 ids:['neuromodulation']});
