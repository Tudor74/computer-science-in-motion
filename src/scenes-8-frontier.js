/* ===================== Levin Lab In Motion · Era 8 · Tools and open questions ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/LEVIN-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const L8_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

L8_placeholder('bioelectric-models','Simulating bioelectricity',
 'BETSE, the bioelectric tissue simulation engine of Alexis Pietak and Michael Levin (2016), simulates ion flows, channels and gap junctions in a sheet of cells; like all such models it simplifies real tissue.');
L8_placeholder('electroceuticals','Ion-channel drugs',
 'Many approved drugs act on ion channels; the lab has proposed using some of them as “electroceuticals” to change voltage patterns in development and regeneration, tested so far in animals and cells, not as human treatments.');
L8_placeholder('bioelectric-code','Reading and writing the code',
 'Levin and Martyniuk (2018) proposed a “bioelectric code”: that voltage patterns across tissues encode anatomical outcomes that cells read; whether such a general code exists is an open hypothesis.');
L8_placeholder('independent-tests','Who else has found it?',
 'Bioelectric signals in development and regeneration have been studied by many labs since the vibrating-probe era, while some of the lab’s most striking results have so far been reported mainly by the lab and its collaborators.');
L8_placeholder('open-questions','Open questions',
 'Open questions include how cells read voltage patterns into gene expression, how stable patterns are stored, and how far findings in frogs and planarians carry to mammals.');
L8_placeholder('platonic-space','A space of forms?',
 'In recent essays and talks Levin has speculated that the forms living systems reach may be drawn from a pre-existing space of patterns, a “Platonic space”; this is a philosophical proposal, not a tested result.');
