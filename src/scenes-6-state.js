/* ===================== Brain In Motion · Era 6 · Brain states ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/BRAIN-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const B6_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

B6_placeholder('circadian-clock','The circadian clock',
 'A circadian clock is an internal timer with a period of about a day that keeps running without outside cues.');
B6_placeholder('sleep-stages','Sleep stages',
 'Sleep has distinct stages, three of non-REM sleep and REM sleep, that follow one another in cycles of roughly 90 minutes.');
B6_placeholder('arousal-systems','Arousal systems',
 'Arousal systems are groups of neurons in the brainstem and hypothalamus whose activity keeps the forebrain awake.');
B6_placeholder('reward-dopamine','Reward and dopamine',
 'A reward prediction error is the difference between the reward received and the reward expected, and many dopamine neurons report it.');
B6_placeholder('stress-response','The stress response',
 'The stress response is the body’s reaction to a challenge, in which the hypothalamus, pituitary and adrenal glands act in sequence to release cortisol.');
B6_placeholder('hunger-homeostasis','Hunger and homeostasis',
 'Homeostasis is the regulation that keeps a body variable, such as energy stores, close to a steady level.');
