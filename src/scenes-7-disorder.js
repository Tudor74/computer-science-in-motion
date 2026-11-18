/* ===================== Brain In Motion · Era 7 · When things go wrong ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/BRAIN-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const B7_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

B7_placeholder('stroke','Stroke',
 'A stroke is a sudden loss of brain function caused by a blocked blood vessel (ischaemic) or by bleeding (haemorrhagic).');
B7_placeholder('epilepsy','Epilepsy',
 'Epilepsy is a tendency to have repeated seizures, which are episodes of excessive, synchronised activity in groups of neurons.');
B7_placeholder('parkinsons','Parkinson’s disease',
 'Parkinson’s disease is a progressive condition in which dopamine-producing neurons of the substantia nigra are lost, causing slowness, stiffness and often tremor.');
B7_placeholder('alzheimers','Alzheimer’s disease',
 'Alzheimer’s disease is the most common cause of dementia, marked by amyloid plaques and tau tangles in the brain.');
B7_placeholder('depression-treatments','Depression and its treatments',
 'Depression is a common condition of lasting low mood and loss of interest, treated with talking therapies, medicines and, when severe, other medical treatments.');
B7_placeholder('addiction','Addiction',
 'Addiction is continued, compulsive use of a drug or behaviour despite the harm it causes.');
