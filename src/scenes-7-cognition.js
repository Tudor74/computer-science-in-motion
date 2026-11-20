/* ===================== Levin Lab In Motion · Era 7 · Basal cognition ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/LEVIN-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const L7_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

L7_placeholder('basal-cognition','Basal cognition',
 'Basal cognition is the study of sensing, memory, learning and decision-making in organisms without brains, such as bacteria, slime moulds, plants and single cells; Pamela Lyon and others helped define the field.');
L7_placeholder('tame-framework','The TAME framework',
 'In TAME (Technological Approach to Mind Everywhere, 2022) Levin proposes treating cognition as a continuum and judging how much a system has by which kinds of intervention work best on it.');
L7_placeholder('cognitive-light-cone','The cognitive light cone',
 'Levin’s “cognitive light cone” (2019) is a picture, not a measurement: the spatial and temporal size of the largest goal a system can work towards.');
L7_placeholder('morphospace-navigation','Navigating morphospace',
 'Fields and Levin (2022) proposed treating development and regeneration as navigation through a space of possible anatomies, with competence judged by how a system reaches a target from new starting points.');
L7_placeholder('gene-network-learning','Learning in gene networks',
 'In computer models of published gene regulatory networks, Biswas and colleagues (2021) reported memory-like responses, including some resembling associative conditioning; tests in living cells are at an early stage.');
L7_placeholder('cognition-debate','Is it really cognition?',
 'Critics argue that applying words such as “goal”, “memory” and “mind” to cells and tissues risks anthropomorphism or stretches the words too far, and there is no agreed definition of cognition.');
