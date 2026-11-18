/* ===================== Brain In Motion · Era 1 · The neuron ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/BRAIN-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const B1_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

B1_placeholder('animal-electricity','Animal electricity',
 'Nerves and muscles produce and carry electrical signals of their own, as Galvani argued in 1791 and du Bois-Reymond measured in the 1840s.');
B1_placeholder('neuron-doctrine','The neuron doctrine',
 'The neuron doctrine says the nervous system is made of separate cells, neurons, that touch but do not fuse into one continuous net.');
B1_placeholder('resting-potential','The resting potential',
 'A resting neuron is about 70 millivolts negative inside, because ions are unequally distributed across a membrane that lets potassium through most easily.');
B1_placeholder('action-potential','The action potential',
 'An action potential is a brief, all-or-none reversal of the membrane voltage that travels along the axon without fading.');
B1_placeholder('myelin-conduction','Myelin and conduction',
 'Myelin is a fatty wrapping around many axons; the impulse is renewed only at the gaps between its segments, so it travels much faster.');
B1_placeholder('glia','Glia',
 'Glia are the brain’s non-neuronal cells: astrocytes, oligodendrocytes, Schwann cells and microglia.');
