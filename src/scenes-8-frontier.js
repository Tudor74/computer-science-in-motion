/* ===================== Brain In Motion · Era 8 · Tools and frontiers ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/BRAIN-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const B8_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

B8_placeholder('patch-clamp','The patch clamp',
 'The patch clamp is a method that seals a glass pipette onto a small patch of membrane to record the current through single ion channels.');
B8_placeholder('optogenetics','Optogenetics',
 'Optogenetics uses genes for light-sensitive proteins to make chosen neurons respond to light, so they can be switched on or off.');
B8_placeholder('place-grid-cells','Place and grid cells',
 'A place cell is a hippocampal neuron that fires when the animal is in one particular part of its surroundings.');
B8_placeholder('brain-computer-interfaces','Brain–computer interfaces',
 'A brain–computer interface records brain activity and translates it into commands for a device.');
B8_placeholder('organoids','Brain organoids',
 'A brain organoid is a small three-dimensional cluster of brain cells grown from stem cells, which organises itself in ways that resemble parts of an early developing brain.');
B8_placeholder('brains-and-ai','Brains and AI',
 'An artificial neural network is a computing system of simple connected units, loosely inspired by neurons.');
