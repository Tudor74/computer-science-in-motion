/* ===================== Levin Lab In Motion · Era 6 · Xenobots ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/LEVIN-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const L6_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

L6_placeholder('computer-designed','Designed in a computer',
 'Kriegman, Blackiston, Levin and Bongard (2020) used an evolutionary algorithm to design shapes in simulation and then built some of them from frog skin and heart-muscle cells, which moved as the heart cells contracted.');
L6_placeholder('evolved-designs','Evolution in simulation',
 'In the 2020 study, candidate bodies made of passive and contracting cubes were scored for movement in a physics simulator, the best were varied and kept, and designs were filtered for ones likely to work when built.');
L6_placeholder('ciliated-xenobots','Self-assembled xenobots',
 'Blackiston and colleagues (2021) let frog skin cells assemble into spheres that grew cilia and swam, and gave some a simple molecular record by expressing a fluorescent protein that light switches from green to red.');
L6_placeholder('self-replication','Kinematic replication',
 'Kriegman and colleagues (2021) reported that xenobots moving among loose frog cells pushed them into piles that matured into new xenobots, and that a shape found in simulation kept this going for more generations.');
L6_placeholder('anthrobots','Anthrobots',
 'Gumuskaya and colleagues reported that clusters of adult human airway cells grown with their cilia outward could move, and that in a dish they encouraged neurons to grow across a scratch in a sheet of neurons.');
L6_placeholder('organism-or-robot','Organism or robot?',
 'The first xenobots were made of genetically unmodified frog cells, had no nervous system, could not feed and lived only days to weeks on stored yolk; whether to call them organisms, robots or neither is debated.');
