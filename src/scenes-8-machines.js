/* ===================== Consciousness In Motion · Era 8 · Machines and open questions ===================== */
// PLACEHOLDER FILE. Each lesson has one placeholder scene so that the course builds and the tests run.
// The era author replaces this file wholesale (see docs/CONSCIOUSNESS-BRIEF.md). Helper prefix: K8_

const K8_stub=(id,name,definition)=>SCENE({id,name,tag:'Placeholder',definition,
 example:'The scenes for this lesson have not been written yet.',
 desc:'A placeholder panel naming the lesson; its scenes have not been written yet.',
 init:()=>({}),
 draw:()=>({svg:heading(name,150)+T(300,200,'Scenes to be written',16,C.muted),phase:'Placeholder: the scenes for this lesson have not been written yet.'})});

K8_stub('turing-test','The Turing test',
 'In the Turing test a judge converses in text with a machine and a person and tries to tell which is which.');
K8_stub('chinese-room','The Chinese room',
 'The Chinese room is Searle’s thought experiment of a person who follows rules for answering Chinese questions without understanding Chinese.');
K8_stub('machine-indicators','Indicators for machines',
 'Indicator properties are features, drawn from scientific theories of consciousness, whose presence would make an AI system a more serious candidate for consciousness.');
K8_stub('machine-self-report','Machine self-report',
 'Machine self-report is what an AI system says about its own inner states, which may reflect its training text and not those states.');
K8_stub('illusionism-panpsychism','Illusionism and panpsychism',
 'Illusionism holds that experience is not what it seems to introspection; panpsychism holds that experience is a fundamental and widespread feature of the physical world.');
K8_stub('open-questions','Open questions',
 'The open questions are what evidence could decide between the theories and how to act while it is undecided.');
