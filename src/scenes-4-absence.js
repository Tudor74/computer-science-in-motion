/* ===================== Consciousness In Motion · Era 4 · Sleep, dreams and anaesthesia ===================== */
// PLACEHOLDER FILE. Each lesson has one placeholder scene so that the course builds and the tests run.
// The era author replaces this file wholesale (see docs/CONSCIOUSNESS-BRIEF.md). Helper prefix: K4_

const K4_stub=(id,name,definition)=>SCENE({id,name,tag:'Placeholder',definition,
 example:'The scenes for this lesson have not been written yet.',
 desc:'A placeholder panel naming the lesson; its scenes have not been written yet.',
 init:()=>({}),
 draw:()=>({svg:heading(name,150)+T(300,200,'Scenes to be written',16,C.muted),phase:'Placeholder: the scenes for this lesson have not been written yet.'})});

K4_stub('dreaming','Dreaming',
 'Dreaming is experience during sleep; it is reported after awakenings from both REM and non-REM sleep.');
K4_stub('lucid-dreaming','Lucid dreaming',
 'A lucid dream is a dream in which the dreamer knows they are dreaming.');
K4_stub('anaesthesia','Anaesthesia',
 'General anaesthesia is a drug-induced, reversible state in which a person does not respond to or remember surgery.');
K4_stub('disorders-of-consciousness','Disorders of consciousness',
 'Disorders of consciousness are states after severe brain injury, including coma, unresponsive wakefulness and the minimally conscious state.');
K4_stub('split-brain-unity','Split brains and unity',
 'A split-brain patient has had the corpus callosum cut, which raises the question of whether consciousness stays unified.');
K4_stub('psychedelics','Psychedelics',
 'Classic psychedelics are drugs that alter perception, thought and the sense of self, mainly by acting at the serotonin 2A receptor.');
