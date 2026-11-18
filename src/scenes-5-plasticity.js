/* ===================== Brain In Motion · Era 5 · Development and plasticity ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/BRAIN-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const B5_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

B5_placeholder('wiring-up','Wiring up',
 'During development each axon grows towards its targets, steered by a growth cone at its tip that reads chemical signals.');
B5_placeholder('critical-periods','Critical periods',
 'A critical period is a limited time in development when experience has a specially strong and lasting effect on a circuit.');
B5_placeholder('hebb-ltp','Hebb and LTP',
 'Long-term potentiation is a lasting increase in the strength of a synapse after it has been strongly or repeatedly active.');
B5_placeholder('map-plasticity','Changing maps',
 'Map plasticity is the change in which part of the cortex responds to which part of the body or the world, after training or injury.');
B5_placeholder('neurogenesis','Neurogenesis',
 'Neurogenesis is the birth of new neurons, which happens mostly before birth and continues in a few regions in some adult animals.');
B5_placeholder('adolescent-brain','The adolescent brain',
 'Through adolescence the brain keeps developing: unused synapses are removed and long-range connections gain myelin.');
