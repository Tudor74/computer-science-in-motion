/* ===================== Brain In Motion · Era 4 · Movement ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/BRAIN-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const B4_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

B4_placeholder('motor-cortex','The motor cortex',
 'The motor cortex is the strip of cortex in front of the central sulcus whose activity leads to movement of the opposite side of the body.');
B4_placeholder('spinal-reflexes','Spinal reflexes',
 'A reflex is a fast, automatic response produced by a short circuit from a sensory neuron through the spinal cord to a muscle.');
B4_placeholder('pattern-generators','Pattern generators',
 'A central pattern generator is a circuit that produces a rhythmic pattern of activity without needing rhythmic input.');
B4_placeholder('cerebellum','The cerebellum',
 'The cerebellum is the structure at the back of the brain that makes movements accurate and smooth by learning from errors.');
B4_placeholder('basal-ganglia','The basal ganglia',
 'The basal ganglia are a group of connected nuclei deep in the forebrain that help select and start actions.');
B4_placeholder('population-coding','Population coding',
 'In a population code, information such as the direction of a reach is carried by the combined activity of many neurons, each broadly tuned.');
