/* ===================== Brain In Motion · Era 2 · Synapses ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/BRAIN-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const B2_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

B2_placeholder('synapse-discovery','The synapse',
 'A synapse is the junction where one neuron passes a signal to another cell, usually by releasing a chemical.');
B2_placeholder('quantal-release','Quantal release',
 'Transmitter is released in packets called quanta, each the contents of one vesicle, so responses come in whole-number multiples of a unit size.');
B2_placeholder('excitation-inhibition','Excitation and inhibition',
 'Excitatory synapses move a neuron towards its firing threshold and inhibitory synapses move it away; the cell sums them over space and time.');
B2_placeholder('neurotransmitters','Neurotransmitters',
 'A neurotransmitter is a chemical that a neuron releases at a synapse to act on receptors of the next cell.');
B2_placeholder('receptors-drugs','Receptors and drugs',
 'A receptor is a protein that binds a transmitter and responds, either by opening an ion channel directly or by starting a slower chemical cascade.');
B2_placeholder('neuromodulation','Neuromodulation',
 'Neuromodulation is the slower, widespread adjustment of how neurons and synapses respond, by transmitters such as dopamine, noradrenaline, serotonin and acetylcholine.');
