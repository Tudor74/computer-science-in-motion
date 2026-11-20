/* ===================== Levin Lab In Motion · Era 1 · Bioelectricity before the lab ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/LEVIN-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const L1_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

L1_placeholder('membrane-voltage','Voltage in every cell',
 'Almost every living cell keeps a voltage across its membrane, inside negative, set by ion pumps and channels; in neurons it changes in milliseconds, in most other cells it changes slowly.');
L1_placeholder('early-bioelectricity','Early bioelectricity',
 'Galvani reported animal electricity in 1791; in the 1930s and 1940s Harold Saxton Burr and Elmer Lund measured steady voltages around developing organisms and argued that they shaped growth.');
L1_placeholder('vibrating-probe','The vibrating probe',
 'Lionel Jaffe and Richard Nuccitelli’s vibrating probe (1974) measured tiny steady currents outside living cells; Richard Borgens and colleagues used such probes to find currents leaving the stumps of regenerating newt limbs.');
L1_placeholder('voltage-dyes','Seeing voltage',
 'Voltage-reporting dyes such as DiBAC4(3) collect more in depolarised cells, so a fluorescence image becomes a slow map of membrane voltage across a tissue.');
L1_placeholder('gap-junctions','Gap junctions',
 'Gap junctions are channels made of connexin proteins in vertebrates and innexin proteins in invertebrates that join the insides of neighbouring cells, so coupled cells share ions and voltage.');
L1_placeholder('instructive-signals','Instructive or permissive?',
 'A signal is called permissive if it only lets a process happen and instructive if changing it changes which outcome happens; the lab argues that some voltage patterns are instructive.');
