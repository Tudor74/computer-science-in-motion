/* ===================== Brain In Motion · Era 3 · Mapping the brain ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/BRAIN-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const B3_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

B3_placeholder('localisation','Localisation',
 'Localisation of function is the idea that particular abilities depend on particular parts of the brain.');
B3_placeholder('cortex-maps','Maps of the cortex',
 'The cerebral cortex can be divided into areas that differ in their cell layers, their connections and what they do.');
B3_placeholder('split-brain','The split brain',
 'In a split-brain patient the corpus callosum, the main bundle of fibres joining the two hemispheres, has been cut, so each hemisphere can be tested separately.');
B3_placeholder('brain-imaging','Brain imaging',
 'Brain imaging records signals from a living brain: electrical activity at the scalp with EEG, or changes in blood flow and oxygen with PET and fMRI.');
B3_placeholder('lesion-cases','Lesion cases',
 'A lesion case is a study of one person whose brain injury is known, used to infer what the damaged part normally contributes.');
B3_placeholder('connectome','The connectome',
 'A connectome is a complete map of the neurons in a nervous system and the synapses between them.');
