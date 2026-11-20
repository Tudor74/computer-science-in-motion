/* ===================== Levin Lab In Motion · Era 5 · Cancer and the brain ===================== */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/LEVIN-BRIEF.md).
// Each lesson has one placeholder scene, whose id is the lesson id. The sentence shown is true; the picture is only a card.
const L5_placeholder=(id,name,definition)=>SCENE({id,name,tag:'To be written',definition,
 example:'This lesson has not been written yet. Its animated scenes and its Try it activity will replace this card.',
 desc:'A placeholder card showing the name of the lesson.',dur:6,hint:'There is nothing to change yet.',
 init:()=>({}),
 draw:()=>({svg:R(60,110,480,160,C.pale,C.line,12)+TB(300,175,name,20)+T(300,210,'Lesson to be written',15,C.muted)+TM(300,244,id,13,C.muted),phase:'Placeholder: this lesson is not written yet.'})});

L5_placeholder('depolarised-cells','Voltage and cell division',
 'Clarence Cone proposed in 1971 that membrane voltage helps control cell division; many dividing and cancer cells are less negative inside than mature, non-dividing cells.');
L5_placeholder('instructor-cells','Instructor cells',
 'Blackiston and colleagues (2011) reported that depolarising a sparse set of “instructor” cells in frog embryos made pigment cells across the body multiply and invade tissues, an effect involving serotonin.');
L5_placeholder('kras-tumours','Tumours held back',
 'Chernet and Levin (2013) reported that tumour-like growths caused by mutant human KRAS in tadpoles were depolarised, and that forcing the cells to hyperpolarise, by expressing ion channels, made them form less often.');
L5_placeholder('cell-coupling','Cells that stop talking',
 'Werner Loewenstein and Yoshinobu Kanno reported in 1966 that some cancer cells are poorly coupled to each other; the role of gap junctions in cancer has been studied ever since, with mixed results.');
L5_placeholder('brain-rescue','Rescuing brain development',
 'Pai and colleagues (2018) reported that in frog embryos with brain defects caused by drugs or a mutant Notch gene, increasing the activity of the HCN2 channel restored more normal brain anatomy.');
L5_placeholder('boundary-of-self','Cancer and the boundary of self',
 'Levin has proposed, as a hypothesis, that cancer begins when cells disconnect from the electrical network that ties them into a tissue and fall back on single-cell goals.');
