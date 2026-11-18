/* ===================== Brain In Motion · Era 3 · Mapping the brain ===================== */
// Localisation, maps of the cortex, the split brain, brain imaging, lesion cases and the connectome.
// No sound in this era. Nothing flashes: EEG traces are still lines, voxels change only when the learner asks.
// Simulated people, patients and scans are labelled as simulated on screen.

/* ---- shared helpers ---- */
const B3_wrap=(s,n)=>{const out=[];let cur='';for(const w of String(s).split(' ')){if(cur&&(cur+' '+w).length>n){out.push(cur);cur=w}else cur=cur?cur+' '+w:w}if(cur)out.push(cur);return out};
const B3_para=(x,y,s,n,size=13,fill=C.ink,anchor='start',lh=17)=>B3_wrap(s,n).map((l,i)=>TF(x,y+i*lh,l,size,fill,anchor)).join('');
const B3_note=(s,y=370)=>TF(300,y,s,12,C.muted);
const B3_gauss=r=>Math.sqrt(-2*Math.log(Math.max(r(),1e-12)))*Math.cos(2*Math.PI*r());
const B3_card=(x,y,w,h,col=C.grid)=>R(x,y,w,h,'#fff',col,10);
const B3_num=n=>Math.round(n).toLocaleString('en-GB');
const B3_sig2=n=>{if(n<=0)return 0;const e=Math.pow(10,Math.floor(Math.log10(n))-1);return Math.round(n/e)*e};
const B3_pct=(v,d=0)=>(Math.round(v*100*Math.pow(10,d))/Math.pow(10,d)).toFixed(d)+'%';
// Side view of the left hemisphere, front to the left, drawn in a 200 × 140 box and scaled by k.
const B3_HEMI='M20 80C10 50 40 14 100 12C150 10 192 36 190 74C189 92 176 104 160 104C150 104 144 98 134 100C126 116 96 122 76 114C62 108 60 96 64 90C48 92 26 94 20 80Z';
function B3_brain(x,y,k,fill='#f4ece4',inner=''){const sw=w=>fmt(w/k);
 return `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="152" cy="112" rx="26" ry="13" fill="#eadfd3" stroke="${C.line}" stroke-width="${sw(1.5)}"/><path d="M116 112Q120 128 126 138L140 138Q133 124 134 108Z" fill="#eadfd3" stroke="${C.line}" stroke-width="${sw(1.5)}"/><path d="${B3_HEMI}" fill="${fill}" stroke="${C.muted}" stroke-width="${sw(2)}"/>${inner}<path d="M64 90C90 86 120 78 142 66" fill="none" stroke="${C.muted}" stroke-width="${sw(1.6)}"/><path d="M104 13C99 34 108 54 111 73" fill="none" stroke="${C.muted}" stroke-width="${sw(1.6)}"/></g>`}

/* ===================== Lesson: localisation ===================== */
// Simulated people: forehead bulge and memory for words are drawn independently, so the true correlation is 0.
function B3_people(seed,n){const r=rng(seed),out=[];for(let i=0;i<n;i++)out.push([B3_gauss(r),B3_gauss(r)]);return out}
function B3_corr(pts){const n=pts.length;if(n<3)return 0;const mx=sum(pts.map(p=>p[0]))/n,my=sum(pts.map(p=>p[1]))/n;let a=0,b=0,c=0;for(const [x,y] of pts){a+=(x-mx)*(y-my);b+=(x-mx)*(x-mx);c+=(y-my)*(y-my)}return b&&c?a/Math.sqrt(b*c):0}
const B3_fits=p=>p[0]*p[1]>0&&Math.abs(p[0])>.6&&Math.abs(p[1])>.6;
const B3_r2=r=>(r<0?'−':'+')+Math.abs(r).toFixed(2);
SCENE({id:'localisation',name:'Gall’s false start',tag:'Skull bumps tell nothing',
 definition:'Localisation of function is the idea that particular abilities depend on particular parts of the brain. Franz Joseph Gall, lecturing in Vienna from 1796, argued that the brain is a set of 27 “organs”, one for each faculty, and that a well-developed organ pushes out the skull above it. The second claim was wrong, and his evidence was a collection of striking cases that fitted.',
 example:'As a schoolboy Gall thought that classmates with good memories for words had prominent eyes. Collect only the people who fit and the link looks strong; measure everyone and it disappears.',
 desc:'A scatter plot of simulated people, forehead bulge against memory for words, either keeping only the striking cases that fit the theory or keeping everyone, with the correlation for each.',
 research:['Gall & Spurzheim (1810–1819). Anatomie et physiologie du système nerveux en général, et du cerveau en particulier. Paris. Spurzheim later spread the system in Britain and America as “phrenology”.','Parker Jones, Alfaro-Almagro & Jbabdi (2018). An empirical, 21st century evaluation of phrenology. Cortex 106, 26–35: in several thousand MRI scans, the shape of the scalp predicted neither the traits tested nor the shape of the brain beneath.'],
 dur:11,hint:'Switch between Gall’s way of collecting cases and measuring everyone, and add more people. The people are simulated, with no real link between bulge and memory.',
 init:()=>({n:40,pick:'fit',seed:5}),
 watch(p){return {n:20*(1+Math.floor(p*9.99)),pick:p<.5?'fit':'all',seed:5}},
 ui:[{choose:[['fit','Gall’s way: keep cases that fit'],['all','Measure everyone']],label:'Method',get:s=>s.pick,act:'pick'},{b:'Add 20 people',act:'more'},{b:'New sample',act:'seed'}],
 on:{pick(s,v){s.pick=v},more(s){s.n=Math.min(200,s.n+20)},seed(s){s.seed=nextSeed()%9000+1;s.n=40}},
 draw(s){
  const all=B3_people(s.seed,s.n),kept=s.pick==='fit'?all.filter(B3_fits):all,r=B3_corr(kept),x0=50,y0=62,w=250,h=240,cx=x0+w/2,cy=y0+h/2,sc=40;
  let out=heading(s.pick==='fit'?`Cases that fit: correlation ${B3_r2(r)}`:`Everyone measured: correlation ${B3_r2(r)}`);
  out+=R(x0,y0,w,h,'#fff',C.grid,6)+L(cx,y0,cx,y0+h,C.grid,1.2)+L(x0,cy,x0+w,cy,C.grid,1.2);
  for(const pt of all){const px=clamp(cx+pt[0]*sc,x0+5,x0+w-5),py=clamp(cy-pt[1]*sc,y0+5,y0+h-5),ok=s.pick==='all'||B3_fits(pt);out+=ok?Ci(px,py,4,s.pick==='fit'?C.coral:C.blue):Ci(px,py,3.5,'#fff',C.line)}
  out+=TF(x0+w/2,y0+h+18,'forehead bulge: smaller ← → larger',12,C.muted)+TF(x0,y0-8,'memory for words: better ↑',12,C.muted,'start');
  out+=B3_card(322,62,258,240)+TBF(336,86,s.pick==='fit'?'Gall’s method':'A fair test',14,s.pick==='fit'?C.coral:C.blue,'start');
  out+=B3_para(336,108,s.pick==='fit'?'Keep the big bulge with the fine memory and the flat forehead with the poor one. Ignore the rest (hollow dots).':'Measure every person, whether or not they fit, then look for a trend.',36,13,C.ink);
  out+=counter(336,176,'people measured',s.n,C.ink,110)+counter(456,176,s.pick==='fit'?'cases kept':'cases used',kept.length,s.pick==='fit'?C.coral:C.blue,110);
  out+=B3_para(336,246,s.pick==='fit'?'The strong link is made by the choice of cases, not by the skull.':'With everyone in, the correlation stays near zero, as it does in modern scans.',36,13,C.muted);
  out+=B3_note('Simulated people. What survived of Gall: the idea that functions have places in the brain.',340);
  return {svg:out,phase:s.pick==='fit'?`Of ${s.n} people, ${kept.length} fit the theory, and among them bulge and memory rise together (r = ${B3_r2(r)}). Gall gathered evidence this way, from striking heads, busts and anecdotes. Nobody had shown that the skull follows the brain’s surface, and it does not.`:`All ${s.n} people give r = ${B3_r2(r)}: no real link. Phrenology failed this kind of test, but its guess that the cortex is not one uniform organ was taken up by Broca and others with better evidence. Mind In Motion’s localisation lesson tells the basic story.`};
 }});

// Flourens: illustrative levels only. He described what the animals did; he gave no numbers.
function B3_flour(part,amt){const a=amt/100,whole=a<.2?1:clamp(1-(a-.2)/.7,0,1);
 if(part==='medulla')return amt>0?[0,0,0,0,0]:[1,1,1,1,1];
 if(part==='cerebellum')return [1,1,1,clamp(1-a*1.05,0,1),1];
 return [whole,whole,whole,1,1]}
SCENE({id:'localisation-flourens',name:'Flourens removes parts',tag:'Big divisions, yes; small organs, no',
 definition:'Pierre Flourens tested Gall’s scheme by experiment in the 1820s. He removed parts of the brains of pigeons and rabbits and watched what the animals could still do. The large divisions had different jobs: the cerebral lobes for perceiving and acting unprompted, the cerebellum for coordinated movement, a small spot in the medulla for breathing. Within the cerebral lobes he found no separate organs: the faculties weakened together, by an amount that depended on how much was removed.',
 example:'With the cerebellum removed, a pigeon could still see and hear but could not stand or fly steadily. With part of the cerebral lobes removed, it lost a little of everything at once.',
 desc:'A schematic bird brain with three parts, one of them partly removed, and five bars showing how seeing, hearing, acting unprompted, coordination and breathing change.',
 research:['Flourens (1824). Recherches expérimentales sur les propriétés et les fonctions du système nerveux dans les animaux vertébrés. Paris.','Lashley (1929). Brain Mechanisms and Intelligence: a later version of the same view, from maze learning in rats. Both were limited by crude removals and coarse tests of behaviour.'],
 dur:10,hint:'Choose a part of the brain and how much of it is removed, then read which abilities change. The bar heights are illustrative: Flourens described behaviour and gave no numbers.',
 init:()=>({part:'cerebrum',amt:50}),
 watch(p){const k=Math.min(2,Math.floor(p*3)),u=p*3-k;return {part:['cerebrum','cerebellum','medulla'][k],amt:Math.round(clamp(u*1.3,0,1)*100)}},
 ui:[{choose:[['cerebrum','Cerebral lobes'],['cerebellum','Cerebellum'],['medulla','Medulla']],label:'Part',get:s=>s.part,act:'part'},{range:'amt',label:'Amount removed',min:0,max:100,step:5,get:s=>s.amt,act:'amt',show:v=>v+'%'}],
 on:{part(s,v){s.part=v},amt(s,v){s.amt=+v}},
 draw(s,f,X){
  const lv=B3_flour(s.part,s.amt),a=s.amt/100,names=['Seeing','Hearing','Acting unprompted','Balance and coordination','Breathing'];
  const title={cerebrum:`Cerebral lobes: ${s.amt}% removed`,cerebellum:`Cerebellum: ${s.amt}% removed`,medulla:s.amt>0?'Medulla: the “vital node” destroyed':'Medulla: untouched'}[s.part];
  let out=heading(title);
  const sel=p=>s.part===p,st=p=>sel(p)?C.blue:C.line;
  out+=`<defs><clipPath id="b3fl-a"><rect x="60" y="80" width="${fmt(170*a)}" height="140"/></clipPath><clipPath id="b3fl-b"><rect x="214" y="130" width="${fmt(84*a)}" height="90"/></clipPath></defs>`;
  out+=hit(X,'part','medulla','Medulla',`<path d="M196 212Q232 236 292 232L292 262Q226 266 186 236Z" fill="${sel('medulla')?C.pale:'#f4ece4'}" stroke="${st('medulla')}" stroke-width="2"/>`);
  out+=hit(X,'part','cerebrum','Cerebral lobes',`<ellipse cx="145" cy="150" rx="85" ry="62" fill="${sel('cerebrum')?C.pale:'#f4ece4'}" stroke="${st('cerebrum')}" stroke-width="2"/>`);
  out+=hit(X,'part','cerebellum','Cerebellum',`<ellipse cx="256" cy="174" rx="42" ry="36" fill="${sel('cerebellum')?C.pale:'#f4ece4'}" stroke="${st('cerebellum')}" stroke-width="2"/>`);
  if(s.part==='cerebrum'&&a>0)out+=`<ellipse cx="145" cy="150" rx="85" ry="62" fill="#fff" stroke="${C.coral}" stroke-width="2" stroke-dasharray="5 4" clip-path="url(#b3fl-a)"/>`;
  if(s.part==='cerebellum'&&a>0)out+=`<ellipse cx="256" cy="174" rx="42" ry="36" fill="#fff" stroke="${C.coral}" stroke-width="2" stroke-dasharray="5 4" clip-path="url(#b3fl-b)"/>`;
  if(s.part==='medulla'&&a>0)out+=Ci(240,244,7,'#fff',C.coral,'stroke-dasharray="3 3"');
  out+=TF(145,154,'cerebral lobes',13,C.ink)+TF(256,178,'cerebellum',12,C.ink)+TF(250,284,'medulla',12,C.ink)+TF(60,76,'front',12,C.muted,'start');
  out+=TF(170,312,'Schematic bird brain, seen from the side.',12,C.muted)+TF(170,328,'Dashed outline: the part removed.',12,C.coral);
  names.forEach((n,i)=>{const y=74+i*44,v=lv[i],col=v>.8?C.green:v>.3?C.amber:C.coral;out+=TF(350,y,n,13,C.ink,'start')+R(350,y+7,220,12,'#eef3f6','none',6)+R(350,y+7,Math.max(3,220*v),12,col,'none',6)+TF(570,y,v>.8?'kept':v>.3?'weakened':'lost',12,col,'end')});
  const say=s.part==='cerebrum'?(a<.2?'A small removal, wherever it was made, left the animal much as before, or it recovered.':a<.9?'Seeing, hearing and acting on its own all weakened together. Flourens concluded that the lobes work as one.':'With the lobes gone the animal sat still unless moved or fed: no perception, no acts of its own. It still balanced and breathed.'):s.part==='cerebellum'?(a<.1?'With the cerebellum whole, movement is steady.':'The animal still saw, heard and tried to move, but its movements were unsteady and badly combined.'):(a>0?'Breathing stopped at once and the animal died. Flourens placed this spot, a few millimetres across, in the medulla.':'Move the slider to destroy the small spot that Flourens called the vital node.');
  out+=B3_para(350,300,say,37,13,C.muted);
  return {svg:out,phase:s.part==='cerebrum'?'Flourens was right that the brain’s large divisions differ, and wrong about the cerebral lobes. A bird’s cortex is small, his cuts ignored its internal boundaries, and “seeing” or “willing” were judged by eye. Finer evidence came from patients (next scene) and from electrical stimulation in 1870, told in the movement era.':s.part==='cerebellum'?'This was sound localisation: the cerebellum is needed for coordinated movement, not for sensing or for starting movement. The movement era returns to how it does this.':'The medulla holds the circuits that drive breathing. Three parts, three kinds of loss: a real, coarse map of the brain, made by experiment and not by feeling skulls.'};
 }});

// Lesion overlap on a grid over the left hemisphere (simulated patients).
const B3_MASK=[[3,7],[1,8],[1,8],[1,8],[3,8],[4,6]];
const B3_PATS=[{nf:1,c:[2,4],r:[2,4]},{nf:1,c:[1,3],r:[3,4]},{nf:0,c:[3,8],r:[4,5]},{nf:1,c:[2,5],r:[3,4]},{nf:0,c:[4,5],r:[1,2]},{nf:1,c:[2,4],r:[1,4]},{nf:0,c:[1,1],r:[2,4]},{nf:0,c:[4,4],r:[3,4]}];
const B3_inLes=(p,c,r)=>c>=p.c[0]&&c<=p.c[1]&&r>=p.r[0]&&r<=p.r[1];
function B3_overlap(n,sub){const ps=B3_PATS.slice(0,n),nNF=ps.filter(p=>p.nf).length,cells=[];let cand=0;
 B3_MASK.forEach(([c0,c1],r)=>{for(let c=c0;c<=c1;c++){const k=ps.filter(p=>p.nf&&B3_inLes(p,c,r)).length,fl=ps.some(p=>!p.nf&&B3_inLes(p,c,r)),isC=nNF>0&&k===nNF&&!(sub&&fl);if(isC)cand++;cells.push({c,r,k,fl,isC})}});
 return {cells,nNF,cand}}
SCENE({id:'localisation-broca',name:'Broca’s patients',tag:'Where the lesions overlap',
 definition:'In 1861 Paul Broca examined the brain of Louis Victor Leborgne, who had understood speech but for years could say little more than the syllable “tan”. The damage lay in the lower rear part of the left frontal lobe. A second patient, Lelong, had damage in the same place, and by 1865 Broca had enough cases to say that speech depends on the left hemisphere. In 1874 Carl Wernicke described the reverse pattern, fluent speech with poor understanding, after damage further back in the left temporal lobe. The method is still used: find where the lesions of patients who share a difficulty overlap.',
 example:'One patient’s lesion covers many regions, so it cannot say which one matters. Each further patient with the same difficulty narrows the shared area, and each patient who speaks fluently rules out the regions their lesion covers.',
 desc:'A grid over the left hemisphere on which simulated patients’ lesions are added one at a time; the cells damaged in every patient with halting speech are highlighted, and cells damaged in fluent patients can be ruled out.',
 research:['Broca (1861). Remarques sur le siège de la faculté du langage articulé. Bulletin de la Société Anatomique de Paris 6, 330–357. · Wernicke (1874). Der aphasische Symptomencomplex. Breslau.','Dronkers, Plaisant, Iba-Zizen & Cabanis (2007). Brain 130, 1432–1441: MRI of the preserved brains of Leborgne and Lelong showed damage running deeper than the surface area Broca described. · Bates et al. (2003). Voxel-based lesion–symptom mapping. Nature Neuroscience 6, 448–450.'],
 dur:12,hint:'Add patients one at a time and watch the shared region shrink. Then also rule out the regions damaged in patients who speak fluently. The eight patients are simulated.',
 init:()=>({n:1,sub:0}),
 watch(p){return {n:clamp(1+Math.floor(p*10),1,8),sub:p>.82?1:0}},
 ui:[{b:'Add next patient',act:'add'},{choose:[[0,'Halting speech only'],[1,'Also rule out fluent']],label:'Evidence used',get:s=>s.sub,act:'sub'}],
 on:{add(s){s.n=s.n>=8?1:s.n+1},sub(s,v){s.sub=+v}},
 draw(s){
  const o=B3_overlap(s.n,s.sub),bx=22,by=56,k=1.4,cell=20*k,last=B3_PATS[s.n-1];
  let out=heading(`${s.n} patient${s.n>1?'s':''}: ${o.cand} candidate region${o.cand===1?'':'s'} left`);
  let inner='';for(const q of o.cells){const col=q.isC?C.coral:(s.sub&&q.fl)?'#cfd6db':q.k>0?tint(C.coral,1-.55*q.k/Math.max(1,o.nNF)):'none';if(col!=='none')inner+=`<rect x="${q.c*20+.6}" y="${q.r*20+.6}" width="18.8" height="18.8" rx="2" fill="${col}"/>`}
  inner+=`<rect x="${last.c[0]*20}" y="${last.r[0]*20}" width="${(last.c[1]-last.c[0]+1)*20}" height="${(last.r[1]-last.r[0]+1)*20}" fill="none" stroke="${last.nf?C.coral:C.blue}" stroke-width="1.6" stroke-dasharray="4 3"/>`;
  out+=B3_brain(bx,by,k,'#f7f1ea',inner);
  out+=TF(bx+28,by+12*k,'front',12,C.muted,'start')+TF(bx+193*k,by+64*k,'back',12,C.muted,'start');
  out+=R(30,268,14,14,C.coral,'none',3)+TF(50,280,'damaged in every patient with halting speech',12,C.ink,'start');
  out+=R(30,288,14,14,tint(C.coral,.6),'none',3)+TF(50,300,'damaged in some of them',12,C.ink,'start');
  out+=R(30,308,14,14,'#cfd6db','none',3)+TF(50,320,'damaged in a fluent patient: ruled out',12,s.sub?C.ink:C.muted,'start');
  out+=TBF(330,70,'Patients examined (simulated)',13,C.ink,'start');
  B3_PATS.forEach((p,i)=>{const y=80+i*24,on=i<s.n,cur=i===s.n-1;out+=R(330,y,250,20,cur?(p.nf?C.coralp:C.pale):'#fff',on?(p.nf?C.coral:C.blue):C.grid,6)+TF(340,y+14,'P'+(i+1),12,on?C.ink:C.line,'start','font-weight="700"')+TF(366,y+14,on?(p.nf?'halting speech, understands':'speaks fluently'):'not yet examined',12,on?(p.nf?C.coral:C.blue):C.line,'start')});
  out+=B3_para(330,292,o.cand<=3&&s.n>=4?'The shared region lies low in the left frontal lobe, roughly where Broca placed it.':'Dashed box: the latest patient’s lesion. Strokes rarely damage one tidy region.',38,13,C.muted);
  out+=B3_note('Illustration of the overlap method, not real patient data.',352);
  return {svg:out,phase:s.n===1?'One patient: every damaged region is a candidate. Leborgne’s brain alone could not show which part of his large lesion mattered, and later scans showed that the damage ran well below the surface.':o.cand<=3?`After ${s.n} patients the overlap is small. This shows that the region is needed for fluent speech, not that speech “lives” there: later scenes show that language uses a network of areas and the fibre tracts between them.`:`With ${s.n} patients, ${o.cand} regions are still damaged in everyone who has halting speech${s.sub?' and in nobody who speaks fluently':''}. More cases, and cases without the difficulty, narrow it further.`};
 }});

const B3_LANG={ifg:{at:[70,78],n:'Inferior frontal gyrus',c:'Broca’s area: in the classic model, the centre that produces speech.',t:'Damage limited to this area gives only passing speech trouble (Mohr et al. 1978). Lasting Broca’s aphasia follows larger lesions that reach the insula and the white matter beneath.'},
 pst:{at:[140,80],n:'Posterior temporal cortex',c:'Wernicke’s area: in the classic model, the centre that understands words.',t:'Researchers do not agree where “Wernicke’s area” is: a survey found many different definitions (Tremblay & Dick 2016). Understanding draws on much of the temporal lobe.'},
 aud:{at:[112,91],n:'Auditory cortex',c:'',t:'Speech sounds are analysed first here, in the upper temporal lobe of both hemispheres.'},
 par:{at:[150,56],n:'Temporal–parietal junction',c:'',t:'Dorsal stream: maps speech sounds onto the movements that make them, as when you repeat a new word. Mostly left-sided.'},
 pm:{at:[98,56],n:'Premotor and motor cortex',c:'',t:'Plans and drives the lips, tongue, jaw and larynx. Linked to the temporal lobe by the arcuate fasciculus and its neighbours.'},
 atl:{at:[90,104],n:'Middle and front temporal lobe',c:'',t:'Ventral stream: maps speech sounds onto meaning. It runs along the temporal lobe on both sides, which may be why understanding often partly survives a left-sided stroke.'}};
SCENE({id:'localisation-networks',name:'From two centres to a network',tag:'What the classic model left out',
 definition:'For a century textbooks drew language as two centres joined by one bundle of fibres: Broca’s area for speaking, Wernicke’s area for understanding, the arcuate fasciculus between them. Modern accounts describe a network. A dorsal stream links speech sounds to articulation and a ventral stream links them to meaning, each using several areas and the white-matter tracts that join them.',
 example:'A stroke limited to Broca’s area usually leaves speech that recovers within weeks. A large stroke that also cuts the fibres beneath it leaves the lasting difficulty that carries Broca’s name.',
 desc:'The left hemisphere with either the classic two centres and one tract, or six regions joined by a dorsal and a ventral stream; pressing a region shows what it contributes.',
 research:['Hickok & Poeppel (2007). The cortical organization of speech processing. Nature Reviews Neuroscience 8, 393–402 (the dual-stream model).','Mohr et al. (1978). Broca aphasia: pathologic and clinical. Neurology 28, 311–324. · Tremblay & Dick (2016). Broca and Wernicke are dead, or moving past the classic model of language neurobiology. Brain and Language 162, 60–71.'],
 dur:12,hint:'Switch between the classic model and the network, and press a region to read what it contributes. The dual-stream model is the leading account, not a finished one.',
 init:()=>({view:'network',sel:'ifg'}),
 watch(p){const ks=['ifg','pst','aud','par','pm','atl'];return p<.3?{view:'classic',sel:p<.15?'ifg':'pst'}:{view:'network',sel:ks[Math.min(5,Math.floor((p-.3)/.7*6))]}},
 ui:[{choose:[['classic','Classic model (1874–1970s)'],['network','Network (today)']],label:'Model',get:s=>s.view,act:'view'}],
 on:{view(s,v){s.view=v;if(v==='classic'&&s.sel!=='ifg'&&s.sel!=='pst')s.sel='ifg'},sel(s,v){s.sel=v}},
 draw(s,f,X){
  const bx=16,by=58,k=1.5,pt=id=>[bx+B3_LANG[id].at[0]*k,by+B3_LANG[id].at[1]*k],net=s.view==='network',ids=net?Object.keys(B3_LANG):['ifg','pst'];
  let out=heading(net?'Language as a network of areas and tracts':'The classic model: two centres, one tract');
  out+=B3_brain(bx,by,k);
  const link=(a,b,bend,col)=>{const p=pt(a),q=pt(b);return curveArrow(p[0],p[1],q[0],q[1],bend,col,3)};
  if(net){out+=link('aud','par',-14,C.blue)+link('par','pm',-22,C.blue)+link('par','ifg',6,C.blue)+link('aud','atl',-10,C.green)+link('atl','ifg',-14,C.green)+link('aud','pst',8,C.muted)}
  else out+=link('pst','ifg',52,C.amber);
  for(const id of ids){const [x,y]=pt(id),on=s.sel===id;const num=Object.keys(B3_LANG).indexOf(id)+1;out+=hit(X,'sel',id,B3_LANG[id].n,Ci(x,y,on?13:11,on?C.coral:'#fff',on?C.coral:C.ink)+TBF(x,y+4.5,num,12,on?'#fff':C.ink))}
  if(net){out+=L(30,292,54,292,C.blue,3)+TF(60,296,'dorsal stream: sound to articulation',12,C.blue,'start')+L(30,312,54,312,C.green,3)+TF(60,316,'ventral stream: sound to meaning',12,C.green,'start')}
  else{out+=L(30,292,54,292,C.amber,3)+TF(60,296,'arcuate fasciculus',12,C.amber,'start')+TF(30,316,'Lichtheim’s diagram of 1885 made this the textbook picture.',12,C.muted,'start')}
  const d=B3_LANG[s.sel];out+=B3_card(330,58,254,274)+TBF(344,82,(Object.keys(B3_LANG).indexOf(s.sel)+1)+' · '+d.n,14,C.coral,'start');
  ids.forEach((id,i)=>{out+=TF(344,(net?244:294)+i*15,(Object.keys(B3_LANG).indexOf(id)+1)+'  '+B3_LANG[id].n,12,id===s.sel?C.coral:C.muted,'start')});
  out+=B3_para(344,104,net?d.t:d.c,35,13,C.ink);
  if(!net)out+=B3_para(344,172,'Useful at the bedside for a century, but too simple: the two “centres” are not sharply bounded, and other areas and tracts matter as much.',35,13,C.muted);
  out+=B3_note('Regions are placed approximately. Press a numbered circle to select it.',356);
  return {svg:out,phase:net?'In the network account no single area “contains” speech or understanding. Each syndrome reflects which areas and which connecting tracts a lesion takes out, which is why two people with damage in “the same area” can differ. The basic Broca–Wernicke–Lichtheim model is in Mind In Motion’s localisation lesson.':'Wernicke and Lichtheim’s model predicted real syndromes, such as trouble repeating words when the link between the centres is cut. It survives as a first sketch. Switch to the network to see what was added.'};
 }});

/* ===================== Lesson: cortex-maps ===================== */
// Layer profiles: fractions of the cortical thickness for layers I–VI. Illustrative; total thickness approximate.
const B3_AREAS={'4':{mm:4,fr:[.10,.08,.30,.02,.22,.28],n:'Area 4 · primary motor cortex',where:'In front of the central sulcus.',mark:'Thick cortex, almost no layer IV, and giant pyramidal (Betz) cells in layer V that send axons to the spinal cord.',at:[93,40]},
 '3':{mm:2,fr:[.12,.10,.26,.20,.12,.20],n:'Area 3 · primary touch cortex',where:'Just behind the central sulcus.',mark:'Thin cortex with a dense layer IV of small “granule” cells, where input from the thalamus arrives.',at:[111,44]},
 '17':{mm:2,fr:[.10,.08,.22,.32,.10,.18],n:'Area 17 · primary visual cortex',where:'At the back, mostly on the inner face of the hemisphere.',mark:'A very thick layer IV split by a pale band of fibres, the stripe of Gennari, visible without a microscope.',at:[182,72]}};
const B3_ROMAN=['I','II','III','IV','V','VI'];
const B3_LAYCOL=['#f3eee8','#e6dccf','#eadfd3','#d9cfe9','#f2d9cf','#e3d9cc'];
function B3_column(area,x,y,w,pxmm,labels){const A=B3_AREAS[area],r=rng(Number(area)*97+13);let out='',yy=y,ly=-99;
 A.fr.forEach((fr,i)=>{const h=fr*A.mm*pxmm;out+=R(x,yy,w,h,B3_LAYCOL[i],'none',0);
  const dens=[.0006,.006,.003,.011,.0022,.0035][i],n=Math.round(dens*w*h);
  for(let j=0;j<n;j++){const px=x+5+r()*(w-10),py=yy+3+r()*Math.max(1,h-6);
   if(i===3||i===1)out+=Ci(px,py,1.6,C.purple);
   else if(i===0)out+=Ci(px,py,1.4,C.muted);
   else{const z=i===4?(area==='4'&&j%4===0?7.5:4.2):i===2?3.2:2.8;out+=`<polygon points="${fmt(px)},${fmt(py-z)} ${fmt(px-z*.7)},${fmt(py+z*.6)} ${fmt(px+z*.7)},${fmt(py+z*.6)}" fill="${i===4?C.coral:C.dark}" opacity=".85"/>`}}
  if(area==='17'&&i===3)out+=R(x,yy+h*.42,w,Math.max(3,h*.14),'#fff','none',0,'opacity=".85"');
  if(labels){const lab=Math.max(yy+h/2+4,ly+15);ly=lab;out+=TF(x-8,lab,B3_ROMAN[i],12,C.muted,'end')}
  yy+=h;if(i<5)out+=L(x,yy,x+w,yy,'#fff',1)});
 out+=R(x,y,w,A.mm*pxmm,'none',C.muted,0)+R(x,yy,w,16,'#fff',C.line,0)+TF(x+w/2,yy+12,'white matter',11,C.muted);
 return out}
SCENE({id:'cortex-maps',name:'Brodmann’s areas',tag:'A map drawn from cell layers',
 definition:'The cerebral cortex is a folded sheet a few millimetres thick, with its neurons arranged in six layers. In 1909 Korbinian Brodmann published a map that divides it into numbered areas, wherever the pattern of layers under the microscope changes. He numbered the areas in the order he studied them and made no claim about what each one does. Later work showed that many of his borders are also borders of function.',
 example:'Area 4 has almost no layer IV and giant output cells in layer V: it drives movement. Area 17 has a thick layer IV, where input from the eyes arrives.',
 desc:'A stained column of cortex with its six layers for area 4, area 3 or area 17, drawn to the same scale, with the area’s place on the hemisphere; in 3D the layers are shown as a stacked block.',
 research:['Brodmann (1909). Vergleichende Lokalisationslehre der Grosshirnrinde. Leipzig: Barth. His human map uses numbers up to 52, with some numbers left out.','von Economo & Koskinas (1925) drew a finer map of 107 areas. · Glasser et al. (2016). A multi-modal parcellation of human cerebral cortex. Nature 536, 171–178: 180 areas in each hemisphere, from MRI of structure, function and connections.'],
 dur:12,hint:'Choose an area and compare its layers. Press Mystery slice to be shown an unlabelled column, then choose the area you think it comes from. Layer proportions are illustrative.',
 init:()=>({area:'4',mys:'',guess:''}),
 watch(p){return {area:['4','3','17'][Math.min(2,Math.floor(p*3))],mys:'',guess:''}},
 ui:[{choose:[['4','Area 4'],['3','Area 3'],['17','Area 17']],label:'Area',get:s=>s.mys?s.guess:s.area,act:'area'},{b:'Mystery slice',act:'mys'}],
 on:{area(s,v){if(s.mys&&!s.guess)s.guess=v;else{s.mys='';s.guess='';s.area=v}},mys(s){s.mys=['4','3','17'][nextSeed()%3];s.guess=''}},
 draw(s){
  const quiz=!!s.mys,area=quiz?s.mys:s.area,A=B3_AREAS[area],open=!quiz||!!s.guess,right=s.guess===s.mys;
  let out=heading(!quiz?A.n:!s.guess?'Mystery slice: which area is it from?':right?`Yes: area ${s.mys}`:`Not area ${s.guess}: this is area ${s.mys}`);
  out+=TF(52,62,'surface',12,C.muted,'start')+B3_column(area,52,68,150,66,true);
  out+=L(214,68,214,68+66,C.ink,2)+L(210,68,218,68,C.ink,2)+L(210,134,218,134,C.ink,2)+TF(222,105,'1 mm',12,C.ink,'start');
  out+=Ci(238,160,1.8,C.purple)+TF(246,164,'small granule cells',11,C.muted,'start')+`<polygon points="238,176 234,184 242,184" fill="${C.dark}"/>`+TF(246,184,'pyramidal cells',11,C.muted,'start');
  out+=B3_card(356,56,230,150)+B3_brain(366,62,1.02,'#f4ece4',open?`<circle cx="${A.at[0]}" cy="${A.at[1]}" r="9" fill="${C.coral}" opacity=".85"/>`:'');
  out+=B3_card(240,214,346,128);
  if(open){out+=TBF(254,236,A.n,13,C.coral,'start')+TF(254,255,A.where,12,C.muted,'start')+B3_para(254,276,A.mark,52,13,C.ink)}
  else out+=B3_para(254,240,'Look at the total thickness, at how much of it is layer IV (purple dots), and at the size of the cells in layer V. Then choose an area above.',50,13,C.ink);
  out+=B3_note('Nissl-style sketch: dots are cell bodies. Thickness about 4 mm (area 4) and 2 mm (areas 3 and 17).',364);
  return {svg:out,phase:quiz&&!s.guess?'Brodmann worked like this, slice after slice, marking where the pattern of layers changed. Which of the three areas has this pattern?':`${A.mark} Maps such as Brodmann’s are averages drawn from a few brains: the borders differ from person to person, and newer maps based on MRI divide the cortex more finely.`};
 },
 three(s,f,X,project){
  const area=s.mys&&!s.guess?'4':(s.mys||s.area),A=B3_AREAS[area],Pr=project([0,2,0,2,0,4.2]);let faces=[],z=A.mm;const mids=[];
  A.fr.forEach((fr,i)=>{const h=fr*A.mm;z-=h;faces=faces.concat(prism(0,0,z,2,2,h,i===3?C.purple:i===4?C.coral:i%2?'#b9a792':'#d2c3b0'));mids.push(z+h/2)});
  let out=paintFaces(faces,Pr);
  let ly=-1e9;mids.forEach((m,i)=>{const p=Pr([1,1,m]),yy=Math.max(p[1],ly+15);ly=yy;out+=L(p[0]+70,p[1],p[0]+150,yy,C.line,1.2)+TF(p[0]+156,yy+4,'layer '+B3_ROMAN[i]+(i===3?' (input)':i===4?' (output)':''),12,i===3?C.purple:i===4?C.coral:C.muted,'start')});
  const t=Pr([1,1,A.mm]);out+=TF(t[0],t[1]-78,'surface of the brain (top face)',12,C.muted);
  return {svg:out,title:`The six layers of area ${area} as a block`,caption:`A block of area ${area}, about ${A.mm} mm deep and 2 mm across. Layer IV (purple) receives input from the thalamus; layer V (coral) sends output to the brainstem and spinal cord. Their proportions are what Brodmann mapped.`};
 }});

// Penfield's strip: nine body parts with overlapping territories along 14 stimulation points (illustrative model).
const B3_PARTS=[['Toes',.04],['Leg',.13],['Trunk',.23],['Arm',.33],['Hand',.45],['Fingers',.56],['Face',.68],['Lips',.79],['Tongue',.91]];
const B3_NP=14,B3_PCOL=['#5a5f9e',C.blue,C.green,'#3a8f5f',C.amber,'#b97a1a',C.coral,'#b0337a',C.purple];
const B3_pw=x=>B3_PARTS.map(p=>Math.exp(-Math.pow((x-p[1])/.075,2)/2));
function B3_resp(pos,k,seed){const r=rng(seed*7919+pos*131+k*17+1);r();r();const w=B3_pw((pos-.5)/B3_NP);let u=r()*sum(w);for(let i=0;i<w.length;i++){u-=w[i];if(u<=0)return i}return w.length-1}
function B3_tally(log){const t=range(B3_NP).map(()=>B3_PARTS.map(()=>0));for(const [pos,part] of log)t[pos-1][part]++;return t}
const B3_arc=pos=>{const th=(80+(pos-1)/(B3_NP-1)*104)*Math.PI/180;return [178+140*Math.cos(th),252-140*Math.sin(th)]};
SCENE({id:'cortex-maps-penfield',name:'Penfield’s stimulation maps',tag:'Stimulate a point, note the response',
 definition:'In Montreal from the 1930s the neurosurgeon Wilder Penfield operated on people with epilepsy under local anaesthetic, so that they were awake. Before removing the tissue where seizures began, he touched points on the cortex with a weak electric current and noted what happened, to find and spare the areas needed for movement, touch and speech. Along the strip in front of the central sulcus a point made part of the opposite side of the body move; behind the sulcus it produced tingling or numbness.',
 example:'Near the midline, stimulation moved the leg; further down the side of the hemisphere it moved the hand, then the face, lips and tongue. The same point did not always give the same answer.',
 desc:'A strip of cortex running from the midline down the side of the hemisphere with 14 stimulation points, and a table that builds up which body part each point evoked, showing overlap between neighbouring parts.',
 research:['Penfield & Boldrey (1937). Somatic motor and sensory representation in the cerebral cortex of man as studied by electrical stimulation. Brain 60, 389–443. Their charts show each body part’s points scattered and overlapping its neighbours, and some movements evoked from behind the sulcus and sensations from in front.'],
 dur:12,hint:'Press a point on the strip, or set the electrode and press Stimulate, several times at each point. Your map builds up on the right. Responses come from an illustrative model, not from Penfield’s records.',
 init:()=>({pos:7,log:[],seed:3,kind:'move'}),
 watch(p){const n=Math.floor(p*42),log=[];for(let i=0;i<n;i++){const pos=1+(i*5)%B3_NP;log.push([pos,B3_resp(pos,i,3)])}return {pos:n?log[n-1][0]:7,log,seed:3,kind:'move'}},
 ui:[{range:'pos',label:'Electrode at point',min:1,max:B3_NP,get:s=>s.pos,act:'pos'},{b:'Stimulate',act:'stim'},{choose:[['move','In front of the sulcus'],['feel','Behind the sulcus']],label:'Strip',get:s=>s.kind,act:'kind'},{b:'New patient',act:'fresh'}],
 on:{pos(s,v){s.pos=+v},stim(s){s.log.push([s.pos,B3_resp(s.pos,s.log.length,s.seed)]);if(s.log.length>140)s.log.shift()},pick(s,v){s.pos=+v;s.log.push([s.pos,B3_resp(s.pos,s.log.length,s.seed)]);if(s.log.length>140)s.log.shift()},kind(s,v){s.kind=v;s.log=[]},fresh(s){s.seed=nextSeed()%900+1;s.log=[]}},
 draw(s,f,X){
  const t=B3_tally(s.log),last=s.log[s.log.length-1],verb=s.kind==='move'?'movement of the':'tingling in the';
  let out=heading(last?`Point ${last[0]}: ${verb} ${B3_PARTS[last[1]][0].toLowerCase()}`:'Stimulate a point on the strip');
  let d='';for(let i=0;i<=40;i++){const th=(74+i/40*116)*Math.PI/180;d+=(i?'L':'M')+fmt(178+140*Math.cos(th))+' '+fmt(252-140*Math.sin(th))}
  out+=P(d,'#eadfd3',26)+P(d,C.muted,1.2,'none','stroke-dasharray="2 4"');
  for(let pos=1;pos<=B3_NP;pos++){const [x,y]=B3_arc(pos),on=pos===s.pos,n=sum(t[pos-1]);out+=hit(X,'pick',pos,`Stimulate point ${pos}`,Ci(x,y,on?9:7.5,on?C.coral:n?C.pale:'#fff',on?C.coral:C.blue)+(pos===1||pos===B3_NP||on?TF(x+(x<178?16:0),y+(x<178?4:-14),pos,11,on?C.coral:C.muted):''))}
  out+=TF(222,98,'midline',12,C.muted,'start')+TF(30,292,'side of the head',12,C.muted,'start')+B3_para(110,196,'A slice from ear to ear through one hemisphere',20,12,C.muted);
  out+=TBF(392,64,'Your map so far',12,C.ink,'start');
  B3_PARTS.forEach((p,j)=>{const y=74+j*22;out+=TF(386,y+13,p[0],12,last&&last[1]===j?C.coral:C.ink,'end',last&&last[1]===j?'font-weight="700"':'');
   for(let i=0;i<B3_NP;i++){const c=t[i][j],tested=sum(t[i])>0;out+=R(392+i*13.5,y,12,18,c?tint(B3_PCOL[j],clamp(.55-.2*c,0,.55)):tested?'#f1f4f6':'#fff',c?'none':C.grid,3)}});
  out+=TF(392,286,'1',11,C.muted,'start')+TF(392+13*13.5+6,286,'14',11,C.muted)+TF(486,286,'point on the strip',11,C.muted);
  const multi=t.filter(row=>row.filter(c=>c>0).length>1).length,tested=t.filter(row=>sum(row)>0).length;
  out+=B3_para(318,312,tested?`${tested} of 14 points tested, ${s.log.length} stimulations. ${multi} point${multi===1?'':'s'} gave more than one body part.`:'No stimulations yet.',42,13,C.ink);
  out+=B3_note('Illustrative model of overlapping territories. Penfield’s patients were awake and reported what they felt.',366);
  return {svg:out,phase:s.log.length<8?'Each press is one touch of the electrode. Penfield’s team dropped a numbered paper ticket on each point and wrote down the response, patient after patient.':`The order runs from toes at the midline to tongue low on the side, but the rows overlap: neighbouring body parts share cortex, and a point can give different responses on different trials. Penfield’s first purpose was surgical, to find what must be spared. The map was a by-product.`};
 }});

// Where each part's response probability exceeds 8% along the strip (from the same model as the stimulation scene).
const B3_RANGES=B3_PARTS.map((p,j)=>{let a=1,b=0;for(let i=0;i<=200;i++){const x=i/200,w=B3_pw(x);if(w[j]/sum(w)>.08){a=Math.min(a,x);b=Math.max(b,x)}}return [a,b]});
const B3_ZONES=[['Foot',.02,.24,C.blue],['',.25,.31,C.dark],['Hand',.32,.60,C.amber],['',.61,.67,C.dark],['Mouth',.68,.92,C.purple],['',.93,.99,C.dark]];
SCENE({id:'cortex-maps-homunculus',name:'The homunculus and its limits',tag:'A tidy cartoon of untidy data',
 definition:'Penfield summed up hundreds of stimulation points in a cartoon, the homunculus: a little figure draped along the strip, with a huge hand and mouth because those parts take up the most cortex. The version in his 1950 book with Theodore Rasmussen, drawn by the medical illustrator Hortense Cantlie, became one of the best-known pictures in neuroscience. It is a summary for teaching. The data behind it overlap far more than the cartoon shows, and recent imaging suggests that the strip is not one continuous body map.',
 example:'In the cartoon the hand ends where the face begins. In the stimulation records, points that moved the fingers were found mixed among points that moved the wrist, the arm and the face.',
 desc:'The motor strip from midline to side drawn three ways: as the cartoon’s separate segments, as overlapping ranges from a stimulation model, and as the 2023 proposal of three body regions separated by inter-effector zones.',
 research:['Penfield & Rasmussen (1950). The Cerebral Cortex of Man. New York: Macmillan.','Gordon et al. (2023). A somato-cognitive action network alternates with effector regions in motor cortex. Nature 617, 351–359 (a recent proposal, still being tested). · Di Noto et al. (2013). The hermunculus. Cerebral Cortex 23, 1005–1013: the classic map was drawn from, and as, a male body.'],
 dur:12,hint:'Compare the three pictures of the same strip, and press a body part to highlight it. The overlap view comes from the illustrative model in the previous scene.',
 init:()=>({view:'data',sel:4}),
 watch(p){return {view:p<.3?'cartoon':p<.7?'data':'new',sel:p<.3?4:p<.5?4:6}},
 ui:[{choose:[['cartoon','1950 cartoon'],['data','Overlapping data'],['new','2023 proposal']],label:'Picture',get:s=>s.view,act:'view'}],
 on:{view(s,v){s.view=v},sel(s,v){s.sel=+v}},
 draw(s,f,X){
  const x0=40,w=520,Xp=u=>x0+u*w;let out=heading({cartoon:'The cartoon: one part after another',data:'The data: territories overlap',new:'A 2023 proposal: three regions with zones between'}[s.view]);
  out+=TF(x0,58,'midline (top of the head)',12,C.muted,'start')+TF(x0+w,58,'side (above the ear)',12,C.muted,'end');
  if(s.view==='cartoon'){
   B3_PARTS.forEach((p,j)=>{const a=j?(B3_PARTS[j-1][1]+p[1])/2:0,b=j<8?(p[1]+B3_PARTS[j+1][1])/2:1,on=s.sel===j;
    out+=hit(X,'sel',j,p[0],R(Xp(a)+1,70,Xp(b)-Xp(a)-2,56,on?B3_PCOL[j]:tint(B3_PCOL[j],.7),'none',5)+TF(Xp((a+b)/2),103,p[0],12,on?'#fff':C.ink))});
   out+=B3_para(x0,160,'Each body part has its own stretch of cortex, in body order, with sharp edges. Parts that need fine control, such as the fingers and lips, are drawn large. This is how the map is usually taught.',78,13,C.ink);
  }else if(s.view==='data'){
   out+=R(x0,66,w,10,'#eadfd3','none',5);
   B3_PARTS.forEach((p,j)=>{const [a,b]=B3_RANGES[j],y=84+j*19,on=s.sel===j;
    out+=hit(X,'sel',j,p[0],R(Xp(a),y,Xp(b)-Xp(a),14,on?B3_PCOL[j]:tint(B3_PCOL[j],.6),'none',5)+TF(Xp(a)-6>x0+44?Xp(a)-6:Xp(b)+6,y+11,p[0],12,on?C.coral:C.ink,Xp(a)-6>x0+44?'end':'start',on?'font-weight="700"':''))});
   const [a,b]=B3_RANGES[s.sel],ov=B3_PARTS.filter((p,j)=>j!==s.sel&&B3_RANGES[j][0]<b&&B3_RANGES[j][1]>a).map(p=>p[0].toLowerCase());
   out+=L(Xp(a),66,Xp(a),258,C.coral,1,'stroke-dasharray="3 3"')+L(Xp(b),66,Xp(b),258,C.coral,1,'stroke-dasharray="3 3"');
   out+=B3_para(x0,282,`${B3_PARTS[s.sel][0]}: evoked along ${Math.round((b-a)*100)}% of the strip in this model, sharing cortex with the ${ov.length>1?ov.slice(0,-1).join(', ')+' and '+ov[ov.length-1]:ov[0]}.`,78,13,C.ink);
  }else{
   B3_ZONES.forEach(z=>{out+=R(Xp(z[1]),70,Xp(z[2])-Xp(z[1]),56,z[0]?tint(z[3],.55):'#8b98a0','none',6)+(z[0]?TBF(Xp((z[1]+z[2])/2),94,z[0],13,C.ink)+TF(Xp((z[1]+z[2])/2),112,z[0]==='Foot'?'toes at the centre':z[0]==='Hand'?'fingers at the centre':'tongue at the centre',11,C.ink):'')});
   out+=R(x0,140,14,14,'#8b98a0','none',3)+TF(x0+20,152,'inter-effector zones',12,C.ink,'start');
   out+=B3_para(x0,180,'Gordon and colleagues report three regions for fine movement of the foot, hand and mouth, each arranged in rings. Between them lie zones that are linked to each other and to networks for planning and bodily control, and that are active for whole-body actions.',78,13,C.ink);
   out+=B3_para(x0,262,'Evidence: detailed fMRI of a few intensively scanned people, checked in large datasets. It has not replaced the classic map, and other groups are testing it.',78,13,C.muted);
  }
  out+=B3_note(s.view==='data'?'Ranges are where the model gives a part more than 8% of responses.':'Sketch, not to scale.',356);
  return {svg:out,phase:s.view==='cartoon'?'The homunculus is a mnemonic. It shows the order and the unequal shares correctly, and hides the overlap, the differences between people and the fact that movements, not single muscles, were evoked.':s.view==='data'?'Overlap is not sloppiness in the data. Muscles that work together are driven from intermingled patches of cortex. What the motor map is a map of (muscles, movements or actions) is taken up in the movement era.':'If this holds, the strip alternates between fine control of three body regions and zones that tie movement to planning and to the body’s internal state. Treat it as current research, not settled fact.'};
 }});

/* ===================== Lesson: split-brain ===================== */
// Myers & Sperry's logic. Training through the left eye; testing through the right eye.
const B3_transfer=(ch,cc)=>!ch||!cc;            // does the untrained eye know the task?
SCENE({id:'split-brain',name:'What the callosum carries',tag:'Sperry’s cats, before the patients',
 definition:'The corpus callosum is a band of some 200 million nerve fibres joining the two cerebral hemispheres. Until the 1950s nobody could show what it was for: people in whom it had been cut seemed unchanged. Ronald Myers and Roger Sperry found its job in cats. Normally each eye sends fibres to both hemispheres, crossing at the optic chiasm. With the chiasm cut, each eye reaches only the hemisphere on its own side. If the callosum was also cut, a cat trained through one eye knew nothing of the task through the other.',
 example:'A cat with both the chiasm and the callosum cut learned to choose a circle over a square through its left eye. Tested through its right eye it chose at chance, and it could even be taught the opposite choice through that eye.',
 desc:'A view from above of two eyes, the optic chiasm, the two hemispheres and the corpus callosum, with the chiasm and callosum intact or cut, showing which hemisphere holds what was learned through the left eye and whether the right eye can use it.',
 research:['Myers & Sperry (1953). Interocular transfer of a visual form discrimination habit in cats after section of the optic chiasma and corpus callosum. Anatomical Record 115, 351–352. · Myers (1956). Function of corpus callosum in interocular transfer. Brain 79, 358–363.','Gazzaniga, Bogen & Sperry (1962). Some functional effects of sectioning the cerebral commissures in man. PNAS 48, 1765–1769: the first of the human studies, with a patient whose callosum had been cut by Joseph Bogen and Philip Vogel to treat severe epilepsy. Sperry shared the 1981 Nobel Prize.'],
 dur:11,hint:'Cut or keep the chiasm and the callosum, then switch between training through the left eye and testing through the right. The cats learned a shape choice for a food reward.',
 init:()=>({ch:1,cc:1,ph:'test'}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {ch:k>0?1:0,cc:k>2?1:0,ph:(p*4-k)<.45?'train':'test'}},
 ui:[{choose:[[0,'Chiasm intact'],[1,'Chiasm cut']],label:'Optic chiasm',get:s=>s.ch,act:'ch'},{choose:[[0,'Callosum intact'],[1,'Callosum cut']],label:'Corpus callosum',get:s=>s.cc,act:'cc'},{choose:[['train','Train: left eye'],['test','Test: right eye']],label:'Phase',get:s=>s.ph,act:'ph'}],
 on:{ch(s,v){s.ch=+v},cc(s,v){s.cc=+v},ph(s,v){s.ph=v}},
 draw(s){
  const ok=B3_transfer(s.ch,s.cc),learnR=ok,test=s.ph==='test',eye=test?'R':'L';
  let out=heading(test?(ok?'Right eye: the cat chooses correctly':'Right eye: the cat chooses at chance'):'Training through the left eye');
  const EL=[110,78],ER=[230,78],CH=[170,138],HL=[112,246],HR=[228,246];
  const fibre=(from,to,via,live,cut)=>{const d=`M${from[0]} ${from[1]+12}Q${via[0]} ${via[1]} ${to[0]} ${to[1]-58}`;return P(d,cut?C.line:live?C.coral:C.muted,cut?1.6:live?3:1.8,'none',cut?'stroke-dasharray="3 5"':'')};
  out+=fibre(EL,HL,[118,150],eye==='L',false)+fibre(ER,HR,[222,150],eye==='R',false)+fibre(EL,HR,[CH[0],CH[1]-8],eye==='L'&&!s.ch,!!s.ch)+fibre(ER,HL,[CH[0],CH[1]-8],eye==='R'&&!s.ch,!!s.ch);
  if(s.ch)out+=L(170,112,170,160,C.coral,3)+TF(170,106,'cut',12,C.coral);else out+=TF(170,106,'chiasm',12,C.muted);
  for(const [E,side] of [[EL,'L'],[ER,'R']]){const cov=side!==eye;out+=Ci(E[0],E[1],15,cov?'#cfd6db':'#fff',C.ink)+(cov?L(E[0]-15,E[1],E[0]+15,E[1],C.ink,3):Ci(E[0],E[1],6,C.ink))+TF(E[0],E[1]-22,(side==='L'?'left eye':'right eye')+(cov?' (covered)':''),12,C.muted)}
  out+=`<ellipse cx="${HL[0]}" cy="${HL[1]}" rx="50" ry="62" fill="${C.greenp}" stroke="${C.green}" stroke-width="2"/><ellipse cx="${HR[0]}" cy="${HR[1]}" rx="50" ry="62" fill="${learnR?C.greenp:'#f4ece4'}" stroke="${learnR?C.green:C.line}" stroke-width="2"/>`;
  out+=TF(HL[0],HL[1]-6,'left',12,C.ink)+TBF(HL[0],HL[1]+12,'has learned',12,C.green)+TF(HR[0],HR[1]-6,'right',12,C.ink)+TBF(HR[0],HR[1]+12,learnR?'has learned':'knows nothing',12,learnR?C.green:C.coral);
  for(let i=0;i<5;i++){const y=226+i*10;out+=s.cc?L(162,y,166,y,C.line,2)+L(174,y,178,y,C.line,2):L(160,y,180,y,C.amber,2.4)}
  out+=TF(170,322,s.cc?'callosum cut':'callosum',12,s.cc?C.coral:C.amber);
  out+=TBF(330,70,'Does the untrained eye know the task?',13,C.ink,'start');
  [[0,0],[0,1],[1,0],[1,1]].forEach(([ch,cc],i)=>{const y=82+i*36,cur=ch===s.ch&&cc===s.cc,t=B3_transfer(ch,cc);
   out+=R(330,y,254,30,cur?(t?C.greenp:C.coralp):'#fff',cur?(t?C.green:C.coral):C.grid,6)+TF(340,y+20,`chiasm ${ch?'cut':'intact'}, callosum ${cc?'cut':'intact'}`,12,C.ink,'start')+TBF(574,y+20,t?'yes':'no',12,t?C.green:C.coral,'end')});
  out+=B3_para(330,246,!s.ch?'With the chiasm intact, each eye feeds both hemispheres, so both learn directly and the callosum’s role stays hidden.':!s.cc?'The left eye now feeds only the left hemisphere, yet the right eye knows the task: what was learned crossed the callosum.':'Only the left hemisphere was taught, and nothing can cross. The cat behaves as if it had two separate brains for seeing.',38,13,C.muted);
  out+=B3_note('Seen from above; coral lines carry what the open eye sees. Schematic.',356);
  return {svg:out,phase:!s.ch?'This is why earlier callosum operations seemed to change nothing: the hemispheres share the eyes’ input anyway. The effect appears only when each hemisphere is given its own input.':!s.cc?'Myers showed that the callosum passes what one hemisphere learns to the other. Cutting it afterwards came too late: the second hemisphere already had its copy.':'Each half of the brain learned, remembered and chose on its own. Sperry, Michael Gazzaniga and Joseph Bogen then tested people whose callosum had been cut for epilepsy, by showing a word or picture to one visual half-field at a time. Mind In Motion’s split-brain lesson runs that experiment.'};
 }});

const B3_SBT=[{t:'Say aloud what was shown',L:['yes','Shown to the right visual field, the picture reaches the left hemisphere, and the patient names it at once.'],R:['no','Shown to the left visual field, the picture reaches the right hemisphere. The patient says that nothing was seen, because in most people speech is run from the left.']},
 {t:'Pick out the object by touch',L:['yes','The right hand, controlled by the left hemisphere, finds the matching object behind a screen.'],R:['yes','The left hand finds the right object, although the patient cannot say what it is looking for. The right hemisphere saw it and knows it.']},
 {t:'Understand a simple written noun',L:['yes','The left hemisphere reads and understands words and sentences.'],R:['partly','In some patients the right hemisphere matched simple nouns to objects, with a small vocabulary and little grammar. Patients differed widely.']},
 {t:'Copy a cube or a block pattern',L:['poorly','The right hand, although it is the writing hand, drew a muddled cube and struggled with block patterns.'],R:['better','The left hand did better at copying drawings and arranging blocks: the right hemisphere led on these spatial tasks (Bogen & Gazzaniga 1965).']},
 {t:'Report that something appeared, and where',L:['yes','In a 2017 study two patients reported whether a shape had appeared, and where, anywhere in the visual field.'],R:['yes','They did so by speech or with either hand, although they could not compare shapes across the midline. The authors argue that perception is divided while the person responds as one agent. Others dispute this reading.']}];
SCENE({id:'split-brain-tasks',name:'Testing each hemisphere',tag:'Differences of degree',
 definition:'With the callosum cut, a picture shown briefly to one side of where the patient is looking reaches only the opposite hemisphere, and each hand is mainly controlled by the opposite hemisphere. Using these routes, Sperry’s group gave the same tasks to each hemisphere in turn. The left hemisphere spoke and read; the right could not speak but recognised objects, understood some words and did better at spatial tasks. In everyday life the patients behaved as single, ordinary people.',
 example:'Shown a key in the left visual field, a patient said nothing had appeared, then picked a key out of a bag with the left hand.',
 desc:'A table of tasks against the left and right hemispheres, each cell marked yes, partly, poorly or no; pressing a cell explains the finding, and a later study adds a row that complicates the classic account.',
 research:['Gazzaniga, Bogen & Sperry (1965). Observations on visual perception after disconnexion of the cerebral hemispheres in man. Brain 88, 221–236. · Bogen & Gazzaniga (1965). Journal of Neurosurgery 23, 394–399. · Gazzaniga & Sperry (1967). Language after section of the cerebral commissures. Brain 90, 131–148.','Pinto et al. (2017). Split brain: divided perception but undivided consciousness. Brain 140, 1231–1237 (two patients; interpretation debated: see de Haan et al. 2020, Neuropsychology Review 30, 224–233).'],
 dur:12,hint:'Press a cell to read what that hemisphere did on that task. Then add the 2017 study. The findings come from a small number of patients, who differed from one another.',
 init:()=>({view:'classic',r:0,c:'R'}),
 watch(p){const n=Math.min(9,Math.floor(p*10));return {view:n>7?'new':'classic',r:n>7?4:Math.floor(n/2),c:n%2?'R':'L'}},
 ui:[{choose:[['classic','Classic tests (1962–67)'],['new','Add the 2017 study']],label:'Evidence',get:s=>s.view,act:'view'}],
 on:{view(s,v){s.view=v;if(v==='classic'&&s.r>3)s.r=3;if(v==='new')s.r=4},cell(s,v){const [r,c]=String(v).split('-');s.r=+r;s.c=c}},
 draw(s,f,X){
  const rows=s.view==='new'?5:4,d=B3_SBT[Math.min(s.r,rows-1)],col={yes:C.green,partly:C.amber,poorly:C.amber,better:C.green,no:C.coral};
  let out=heading(`${s.c==='L'?'Left':'Right'} hemisphere: ${d.t.toLowerCase()}`);
  out+=TBF(352,62,'Left hemisphere',12,C.ink)+TF(352,77,'right visual field, right hand',11,C.muted)+TBF(498,62,'Right hemisphere',12,C.ink)+TF(498,77,'left visual field, left hand',11,C.muted);
  for(let r=0;r<rows;r++){const y=86+r*36,row=B3_SBT[r];out+=TF(20,y+20,row.t,12.5,r===4?C.purple:C.ink,'start');
   for(const c of ['L','R']){const x=c==='L'?286:432,v=row[c][0],on=s.r===r&&s.c===c;out+=hit(X,'cell',r+'-'+c,`${row.t}, ${c==='L'?'left':'right'} hemisphere: ${v}`,R(x,y,132,30,on?col[v]:tint(col[v],.82),on?C.ink:'none',6)+TBF(x+66,y+20,v,13,on?'#fff':col[v]))}}
  out+=B3_card(16,272,568,82)+B3_para(28,292,d[s.c][1],88,12.5,C.ink,'start',16);
  out+=B3_note('“Left hemisphere” here means what the patient did when only that hemisphere received the stimulus.',370);
  return {svg:out,phase:s.view==='new'?'The classic picture has been questioned. Two patients tested decades after surgery could report the presence and position of shapes across the whole visual field with either hand. Whether this shows unified awareness, or cross-cueing and subcortical routes, is not settled.':'Both hemispheres perceive, remember and choose. The differences are of degree, and they were found by feeding one hemisphere at a time, which never happens in an intact brain. The next scene asks what follows for the popular idea of left-brained and right-brained people.'};
 }});

// Simulated lateralisation index per person: positive = more strongly left-sided connections overall.
function B3_latIdx(model,n,seed){const r=rng(seed),out=[];for(let i=0;i<n;i++){const g=B3_gauss(r),side=r()<.5?-1:1;out.push(model==='myth'?side*.3+g*.07:g*.07)}return out}
const B3_npdf=(x,m,sd)=>Math.exp(-Math.pow((x-m)/sd,2)/2)/(sd*Math.sqrt(2*Math.PI));
SCENE({id:'split-brain-types',name:'Left-brained, right-brained?',tag:'A myth tested on a thousand scans',
 definition:'The split-brain studies were quickly stretched into a popular claim: that each of us is a “left-brained” logical type or a “right-brained” creative type. The claim does not follow, and it has been tested. Some networks are lateralised in everyone, language mostly to the left and attention to space mostly to the right, but people do not come in two kinds with one hemisphere dominant overall.',
 example:'Nielsen and colleagues measured the connections of 1,011 people aged 7 to 29 with resting-state fMRI. Lateralised connections were a local property of particular networks; no one had a brain that was left-dominant or right-dominant as a whole.',
 desc:'A histogram of a simulated overall lateralisation score for many people: two separate humps if there were left-brained and right-brained types, one hump centred on zero in data like those of the published study.',
 research:['Nielsen, Zielinski, Ferguson, Lainhart & Anderson (2013). An evaluation of the left-brain vs. right-brain hypothesis with resting state functional connectivity magnetic resonance imaging. PLoS ONE 8, e71275.'],
 dur:10,hint:'Compare what the myth predicts with what scans show, and add people in hundreds up to 1,000. The scores are simulated to follow the published conclusion; they are not the study’s data.',
 init:()=>({model:'data',n:200,seed:9}),
 watch(p){return {model:p<.4?'myth':'data',n:100*(1+Math.floor((p<.4?p/.4:(p-.4)/.6)*9.99)),seed:9}},
 ui:[{choose:[['myth','If the myth were true'],['data','What scans show (simulated)']],label:'Picture',get:s=>s.model,act:'model'},{b:'Scan 100 more people',act:'more'}],
 on:{model(s,v){s.model=v},more(s){s.n=s.n>=1000?100:s.n+100}},
 draw(s){
  const v=B3_latIdx(s.model,s.n,s.seed),bw=.05,nb=24,x0=50,w=500,yb=268,h=176,bins=range(nb).map(()=>0);
  for(const q of v){const b=Math.floor((q+.6)/bw);if(b>=0&&b<nb)bins[b]++}
  const peak=s.n*bw*B3_npdf(0,0,.07),sc=h/Math.max(peak,Math.max(...bins)),far=v.filter(q=>Math.abs(q)>.2).length;
  let out=heading(s.model==='myth'?'The myth predicts two kinds of people':'Scans show one kind, centred on balance');
  out+=L(x0,yb,x0+w,yb,C.line,1.5);
  bins.forEach((c,i)=>{if(c)out+=R(x0+i*w/nb+1,yb-c*sc,w/nb-2,c*sc,s.model==='myth'?C.amber:C.blue,'none',2)});
  let d='';for(let i=0;i<=120;i++){const q=-.6+i/100,e=s.n*bw*(s.model==='data'?(.5*B3_npdf(q,-.3,.07)+.5*B3_npdf(q,.3,.07)):B3_npdf(q,0,.07));d+=(i?'L':'M')+fmt(x0+(q+.6)/1.2*w)+' '+fmt(yb-e*sc)}
  out+=P(d,C.muted,1.6,'none','stroke-dasharray="5 4"');
  out+=TF(x0,yb-h-4,s.model==='data'?'dashed: the myth’s two types':'dashed: what scans show',12,C.muted,'start');
  for(const q of [-.4,-.2,0,.2,.4]){const x=x0+(q+.6)/1.2*w;out+=L(x,yb,x,yb+5,C.line,1.2)+TF(x,yb+19,q===0?'0':(q>0?'+':'−')+Math.abs(q),12,C.muted)}
  out+=TF(x0,yb+36,'← more right-lateralised overall',12,C.muted,'start')+TF(x0+w,yb+36,'more left-lateralised overall →',12,C.muted,'end');
  out+=counter(50,314,'people scanned',B3_num(s.n),C.ink,150)+counter(225,314,'strongly one-sided (beyond ±0.2)',far,far?C.amber:C.green,200)+counter(450,314,'share',B3_pct(far/s.n),far?C.amber:C.green,100);
  return {svg:out,phase:s.model==='myth'?`If people were left-brained or right-brained, a score that sums each person’s lateralised connections would fall into two humps: here ${far} of ${s.n} simulated people are strongly one-sided.`:`In data like Nielsen’s the overall score has one hump at zero: ${far} of ${s.n} simulated people are strongly one-sided. Each person has left-leaning networks and right-leaning networks, and they balance. Hemispheres specialise; people are not hemisphere types.`};
 }});

/* ===================== Lesson: brain-imaging ===================== */
// Schematic EEG in microvolts. Resting with eyes closed: a 10 Hz alpha rhythm that waxes and wanes. Otherwise: small, faster, mixed.
function B3_eeg(st,t){const w=2*Math.PI*t;
 if(st==='closed')return (30+12*Math.sin(w*.7))*Math.sin(w*10)+4*Math.sin(w*3.1+1);
 if(st==='open')return 6*Math.sin(w*21)+4*Math.sin(w*17.3+2)+3*Math.sin(w*2.3);
 return 5*Math.sin(w*24)+4*Math.sin(w*18.7+1)+3*Math.sin(w*1.7+2)}
function B3_peaks(st,t0){const out=[];for(let i=1;i<1000;i++){const t=t0+i/1000,a=B3_eeg(st,t-.001),b=B3_eeg(st,t),c=B3_eeg(st,t+.001);if(b>a&&b>=c)out.push(t)}return out}
const B3_BANDS=[['delta','under 4 Hz',0,4],['theta','4–8 Hz',4,8],['alpha','8–13 Hz',8,13],['beta','13–30 Hz',13,30]];
SCENE({id:'brain-imaging',name:'Berger’s EEG',tag:'Brain rhythms through the skull',
 definition:'Electroencephalography (EEG) records the brain’s electrical activity from electrodes on the scalp. Hans Berger, a psychiatrist in Jena, made the first human recording in 1924 and published it in 1929. He found a rhythm of about ten waves a second when a person rested with eyes closed, which faded when the eyes opened or the person did mental arithmetic. He called it the alpha rhythm. Few believed him until Edgar Adrian and Bryan Matthews repeated the work in Cambridge in 1934.',
 example:'The signal at the scalp is tiny, tens of millionths of a volt. It is the summed activity of very many cortical neurons acting together, so EEG tells you when to the millisecond, and only roughly where.',
 desc:'Three seconds of a schematic EEG trace for eyes closed, eyes open or mental arithmetic, with a one-second ruler that counts the peaks beneath it and names the frequency band.',
 research:['Berger (1929). Über das Elektrenkephalogramm des Menschen. Archiv für Psychiatrie und Nervenkrankheiten 87, 527–570.','Adrian & Matthews (1934). The Berger rhythm: potential changes from the occipital lobes in man. Brain 57, 355–385.'],
 dur:11,hint:'Change what the person is doing and slide the one-second ruler along the trace. Count the peaks under it: peaks per second is the frequency in hertz. The trace is a schematic, drawn as a still line.',
 init:()=>({st:'closed',t0:1}),
 watch(p){return {st:p<.4?'closed':p<.7?'open':'sums',t0:Math.round(((p*3)%1)*20)/10}},
 ui:[{choose:[['closed','Eyes closed, resting'],['open','Eyes open'],['sums','Eyes closed, mental arithmetic']],label:'The person is',get:s=>s.st,act:'st'},{range:'t0',label:'Ruler starts at',min:0,max:20,get:s=>Math.round(s.t0*10),act:'t0',show:v=>fmt(v/10)+' s'}],
 on:{st(s,v){s.st=v},t0(s,v){s.t0=v/10}},
 draw(s){
  const x0=50,w=500,yc=150,sc=1.15,Xt=t=>x0+t/3*w,pk=B3_peaks(s.st,s.t0),n=pk.length,band=B3_BANDS.find(b=>n>=b[2]&&n<b[3])||B3_BANDS[3];
  let out=heading(`${n} peaks in one second: about ${n} Hz (${band[0]})`);
  out+=R(Xt(s.t0),82,Xt(s.t0+1)-Xt(s.t0),136,C.amberp,'none',4)+L(x0,yc,x0+w,yc,C.grid,1);
  let d='';for(let i=0;i<=900;i++){const t=i/300;d+=(i?'L':'M')+fmt(Xt(t))+' '+fmt(yc-B3_eeg(s.st,t)*sc)}out+=P(d,C.ink,1.5);
  for(const t of pk)out+=Ci(Xt(t),yc-B3_eeg(s.st,t)*sc-6,2.2,C.coral);
  out+=L(Xt(s.t0),226,Xt(s.t0+1),226,C.amber,2.5)+L(Xt(s.t0),220,Xt(s.t0),232,C.amber,2.5)+L(Xt(s.t0+1),220,Xt(s.t0+1),232,C.amber,2.5)+TF(Xt(s.t0+.5),244,'1 second',12,C.amber);
  for(const t of [0,1,2,3])out+=TF(Xt(t),74,t+' s',11,C.muted);
  out+=L(566,yc-50*sc/2,566,yc+50*sc/2,C.muted,2)+TF(572,yc-34,'50',11,C.muted,'start')+TF(572,yc-22,'µV',11,C.muted,'start');
  B3_BANDS.forEach((b,i)=>{const x=50+i*128,on=b===band;out+=R(x,262,118,44,on?C.coralp:'#fff',on?C.coral:C.grid,8)+TBF(x+59,281,b[0],13,on?C.coral:C.ink)+TF(x+59,298,b[1],12,C.muted)});
  out+=B3_para(50,328,s.st==='closed'?'Large, regular waves at about 10 Hz: Berger’s alpha rhythm, strongest over the back of the head.':'The alpha rhythm is blocked: the trace is smaller and faster. Berger saw this when the eyes opened or the mind was busy.',84,13,C.muted);
  out+=B3_note('Schematic trace. The band limits are conventions, and sources differ by a hertz or so.',372);
  return {svg:out,phase:s.st==='closed'?'Count the coral dots under the ruler. Ten waves a second from millions of cells means those cells are rising and falling together. Large EEG waves show synchrony, not a harder-working brain.':'When the brain is engaged, neurons in the visual areas stop keeping time with one another and their signals partly cancel at the scalp, so the trace shrinks. The sleep and epilepsy lessons read longer EEG records.'};
 }});

// A 12 mm patch of cortex in 0.5 mm cells: fine stripes (period 1 mm) plus one blob about 4 mm across.
const B3_patch=(c,r)=>clamp(.12+.3*(c%2)+.6*Math.exp(-(Math.pow(c-15.5,2)+Math.pow(r-9.5,2))/32),0,1);
const B3_EDGES=[1,1.5,2,3,4],B3_DENS=30000;      // neurons per cubic millimetre of cortex, order of magnitude
function B3_voxelled(n){const out=[];for(let R0=0;R0<24;R0+=n)for(let C0=0;C0<24;C0+=n){let a=0;for(let r=R0;r<R0+n;r++)for(let c=C0;c<C0+n;c++)a+=B3_patch(c,r);out.push([C0,R0,a/(n*n)])}return out}
SCENE({id:'brain-imaging-voxel',name:'What a voxel measures',tag:'Blood, in cubes of a few millimetres',
 definition:'Positron emission tomography (PET), built in the 1970s, mapped blood flow and glucose use with radioactive tracers. In 1990 Seiji Ogawa showed that MRI can detect the oxygen level of blood, because blood without oxygen disturbs the magnetic field a little: the BOLD contrast. In 1991–92 several groups used such signals to map activity in the human brain, and functional MRI (fMRI) was born. Its unit is the voxel, a small block of brain a few millimetres across. One voxel holds hundreds of thousands of neurons, and what is measured is their blood supply, seconds after they were active.',
 example:'A voxel 3 mm on each side is 27 mm³. At roughly 30,000 neurons per mm³ of cortex, that is about 800,000 neurons reported as one number.',
 desc:'Left, a patch of cortex with fine stripes of activity and one larger active blob; right, the same patch as a scanner with a chosen voxel size reports it, with the voxel’s volume and an estimate of the neurons inside.',
 research:['Ogawa, Lee, Kay & Tank (1990). Brain magnetic resonance imaging with contrast dependent on blood oxygenation. PNAS 87, 9868–9872.','Belliveau et al. (1991). Science 254, 716–719. · Kwong et al. (1992). PNAS 89, 5675–5679. · Ogawa et al. (1992). PNAS 89, 5951–5955. · Logothetis (2008). What we can and cannot do with fMRI. Nature 453, 869–878.'],
 dur:10,hint:'Change the voxel size and watch which features of the activity survive the averaging. The neuron count is an order-of-magnitude estimate: 16 billion cortical neurons in roughly half a litre of grey matter.',
 init:()=>({e:3}),
 watch(p){return {e:Math.min(4,Math.floor(p*5))}},
 ui:[{range:'e',label:'Voxel edge',min:0,max:4,get:s=>s.e,act:'e',show:v=>B3_EDGES[v]+' mm'}],
 on:{e(s,v){s.e=+v}},
 draw(s){
  const edge=B3_EDGES[s.e],n=edge*2,vol=edge*edge*edge,neu=B3_sig2(vol*B3_DENS),cell=9,ax=40,bx=344,y0=64;
  let out=heading(`${edge} mm voxels: about ${B3_num(neu)} neurons in each`);
  for(let r=0;r<24;r++)for(let c=0;c<24;c++)out+=`<rect x="${ax+c*cell}" y="${y0+r*cell}" width="${cell}" height="${cell}" fill="${tint(C.coral,1-B3_patch(c,r))}"/>`;
  for(const [c,r,v] of B3_voxelled(n))out+=`<rect x="${bx+c*cell}" y="${y0+r*cell}" width="${n*cell}" height="${n*cell}" fill="${tint(C.coral,1-v)}" stroke="#fff" stroke-width="1"/>`;
  out+=R(ax,y0,216,216,'none',C.line,0)+R(bx,y0,216,216,'none',C.line,0)+arrow(268,y0+108,332,y0+108,C.muted,2.5);
  out+=TF(ax+108,y0+234,'Activity in a 12 mm patch of cortex',12,C.ink)+TF(ax+108,y0+250,'(stripes 0.5 mm wide, one 4 mm blob)',12,C.muted);
  out+=TF(bx+108,y0+234,`What ${edge} mm voxels report`,12,C.ink)+TF(bx+108,y0+250,edge>=2?'the stripes average away; the blob stays':edge===1?'each voxel spans two stripes: they cancel':'stripes show only as a false, coarser pattern',12,C.muted);
  out+=counter(140,326,'voxel volume',fmt(vol)+' mm³',C.blue,150)+counter(310,326,'neurons, roughly',B3_num(neu),C.coral,150);
  return {svg:out,phase:`A ${edge} mm voxel averages everything inside ${fmt(vol)} mm³: excitatory and inhibitory cells, input and output, and fine patterns such as the half-millimetre columns of the visual cortex. A map of “activity” is a map of blood oxygen changes, smoothed in space and delayed by several seconds. Mind In Motion’s brain-imaging lesson follows that delay.`};
 }});

/* Noise voxels: every test statistic is a standard normal draw, so any voxel that passes is a false positive. */
function B3_tail(z){const t=1/(1+.2316419*Math.abs(z)),d=Math.exp(-z*z/2)/Math.sqrt(2*Math.PI),q=d*t*(.319381530+t*(-.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429))));return z>=0?q:1-q}
function B3_zcrit(p){let lo=0,hi=9;for(let i=0;i<60;i++){const m=(lo+hi)/2;if(B3_tail(m)>p)lo=m;else hi=m}return (lo+hi)/2}
const B3_NV=400;
function B3_scan(seed){const r=rng(seed),out=[];r();r();for(let i=0;i<B3_NV;i++)out.push(B3_gauss(r));return out}
const B3_seedAt=k=>7+k*7919;
SCENE({id:'brain-imaging-salmon',name:'Testing noise voxels',tag:'Many tests, some pass by chance',
 definition:'An fMRI analysis runs a statistical test at every voxel, tens of thousands of them. A threshold such as p < 0.001 lets one test in a thousand pass when nothing is there, so with enough voxels some will pass by chance. In 2009 Craig Bennett and colleagues made the point with a dead Atlantic salmon: scanned while being “shown” photographs of people and analysed without correction, it had voxels that passed. With a correction for multiple comparisons, none did.',
 example:'With 400 noise voxels and p < 0.001, a scan has about one chance in three of showing at least one “active” voxel: 1 − 0.999⁴⁰⁰ ≈ 33%. The salmon had 16 such voxels among 8,064.',
 desc:'A grid of 400 voxels of pure noise in which voxels passing the threshold are marked, with a running tally of scans that showed at least one false positive beside the rate that theory predicts.',
 research:['Bennett, Baird, Miller & Wolford (2009 poster; 2010). Neural correlates of interspecies perspective taking in the post-mortem Atlantic salmon: an argument for multiple comparisons correction. Journal of Serendipitous and Unexpected Results 1, 1–5.','Eklund, Nichols & Knutsson (2016). Cluster failure. PNAS 113, 7900–7905: some widely used cluster-based corrections also let through too many false positives.'],
 dur:12,hint:'There is no brain here, only noise. Scan again and count the false positives, change the threshold, then apply the Bonferroni correction. Changing a setting re-tests the same scans.',
 init:()=>({alpha:'0.001',corr:'none',seeds:[B3_seedAt(0)]}),
 watch(p){return {alpha:'0.001',corr:p<.7?'none':'bonf',seeds:range(1+Math.floor(Math.min(p,.7)/.7*29)).map(B3_seedAt)}},
 ui:[{b:'Scan again',act:'scan'},{b:'Run 20 scans',act:'many'},{choose:[['0.05','p < 0.05'],['0.01','p < 0.01'],['0.001','p < 0.001']],label:'Threshold',get:s=>s.alpha,act:'alpha'},{choose:[['none','No correction'],['bonf','Bonferroni']],label:'Correction',get:s=>s.corr,act:'corr'}],
 on:{scan(s){s.seeds.push(nextSeed()%900000+1);if(s.seeds.length>300)s.seeds.shift()},many(s){for(let i=0;i<20;i++)s.seeds.push(nextSeed()%900000+1);while(s.seeds.length>300)s.seeds.shift()},alpha(s,v){s.alpha=v},corr(s,v){s.corr=v}},
 draw(s){
  const a=Number(s.alpha),per=s.corr==='bonf'?a/B3_NV:a,zc=B3_zcrit(per),cur=B3_scan(s.seeds[s.seeds.length-1]),cell=13,x0=30,y0=58;
  let k=0,out='';cur.forEach((z,i)=>{const c=i%20,r=Math.floor(i/20),on=z>zc;if(on)k++;const g=Math.round(clamp(196+z*18,140,246));out+=R(x0+c*cell,y0+r*cell,cell-1,cell-1,on?C.coral:`rgb(${g},${g+4},${g+8})`,on?C.ink:'none',2)});
  const nS=s.seeds.length,hits=s.seeds.map(sd=>B3_scan(sd).filter(z=>z>zc).length),withFP=hits.filter(h=>h>0).length,fwer=1-Math.pow(1-per,B3_NV),exp=B3_NV*per;
  out=heading(k?`This scan: ${k} noise voxel${k>1?'s':''} “active”`:'This scan: no voxel passes')+out;
  out+=TF(x0+130,y0+276,'400 voxels of noise · coral: passes the test',12,C.muted);
  const lx=312;out+=B3_card(304,58,282,206);
  const row=(y,lab,val,col=C.ink)=>TF(lx,y,lab,12.5,C.muted,'start')+TBF(578,y,val,13,col,'end');
  out+=row(82,'Threshold at each voxel',s.corr==='bonf'?`${s.alpha} ÷ 400`:'p < '+s.alpha)+row(106,'False positives expected per scan',exp<.01?exp.toFixed(4):fmt(exp))+row(130,'Found in this scan',String(k),k?C.coral:C.green);
  out+=L(lx,144,578,144,C.grid,1.5)+row(168,'Scans run',String(nS))+row(192,'Scans with a false positive',`${withFP} (${B3_pct(withFP/nS)})`,withFP?C.coral:C.green)+row(216,'Theory: 1 − (1 − p)⁴⁰⁰',B3_pct(fwer,fwer<.1?1:0),C.blue);
  out+=TF(lx,246,'Your tally settles near the theory as scans add up.',12,C.muted,'start');
  out+=B3_para(304,288,s.corr==='bonf'?'Bonferroni divides the threshold by the number of tests, so the chance of any false positive in a scan stays at or below the nominal level.':'Uncorrected, the threshold controls the error rate of one voxel, not of the whole scan.',43,13,C.ink);
  out+=B3_note('One-sided z-tests on independent noise. Real voxels are correlated.',368);
  return {svg:out,phase:s.corr==='bonf'?`With Bonferroni each voxel must pass a 1 in ${B3_num(1/per)} test, and only about ${B3_pct(fwer,1)} of noise scans show anything: ${withFP} of your ${nS}. The price is lost sensitivity, so imaging studies use corrections that take account of how neighbouring voxels move together.`:`At p < ${s.alpha}, ${fmt(exp)} of 400 noise voxels pass per scan on average, and ${B3_pct(fwer)} of scans show at least one. In your ${nS} scan${nS>1?'s':''}, ${withFP} did. A real scan has far more voxels, which is why an uncorrected map can find “activity” in a dead fish. Mind In Motion has a version with a real effect added.`};
 }});

SCENE({id:'brain-imaging-inference',name:'Reverse inference',tag:'From a lit-up area to a mental state',
 definition:'Imaging studies usually show that a task activates an area. Reverse inference runs the other way: this area is active, so the person must be engaged in the mental process linked with it. Russell Poldrack pointed out in 2006 that this is only as strong as the area is selective. If the area is active in many kinds of task, seeing it light up says little. Bayes’ rule gives the size of the step.',
 example:'In a database of imaging studies, Broca’s area was active in 166 of 869 language studies and in 199 of 2,353 other studies. Starting from even odds, seeing it active raises the probability that the task involved language only to 0.69.',
 desc:'A unit square split by the prior probability that a process is engaged, with the share of each side in which the area is active shaded; the posterior probability is the shaded share that lies on the process side.',
 research:['Poldrack (2006). Can cognitive processes be inferred from neuroimaging data? Trends in Cognitive Sciences 10, 59–63.','Yarkoni, Poldrack, Nichols, Van Essen & Wager (2011). Large-scale automated synthesis of human functional neuroimaging data. Nature Methods 8, 665–670: databases that measure how selective an area is.'],
 dur:11,hint:'Set how often the area is active when the process is engaged and when it is not, and the prior. The posterior is how sure you may be, on seeing the area active, that the process was engaged.',
 init:()=>({pa:19,pb:8.5,pr:50,pre:'pold'}),
 watch(p){return p<.34?{pa:19,pb:8.5,pr:50,pre:'pold'}:p<.67?{pa:60,pb:40,pr:50,pre:'busy'}:{pa:60,pb:2,pr:50,pre:'sel'}},
 ui:[{choose:[['pold','Poldrack’s example'],['busy','A busy area'],['sel','A selective area']],label:'Example',get:s=>s.pre,act:'pre'},{range:'pa',label:'Active when process engaged',min:1,max:99,get:s=>s.pa,act:'pa',show:v=>v+'%'},{range:'pb',label:'Active otherwise',min:1,max:120,get:s=>Math.round(s.pb*2),act:'pb',show:v=>fmt(v/2)+'%'},{range:'pr',label:'Prior',min:5,max:95,step:5,get:s=>s.pr,act:'pr',show:v=>v+'%'}],
 on:{pre(s,v){s.pre=v;const q={pold:[19,8.5],busy:[60,40],sel:[60,2]}[v];s.pa=q[0];s.pb=q[1];s.pr=50},pa(s,v){s.pa=+v;s.pre=''},pb(s,v){s.pb=v/2;s.pre=''},pr(s,v){s.pr=+v;s.pre=''}},
 draw(s){
  const pa=s.pa/100,pb=s.pb/100,pr=s.pr/100,A=pa*pr,B=pb*(1-pr),post=A/(A+B),bf=pa/pb,x0=40,y0=70,w=300,h=220,xs=x0+w*pr;
  let out=heading(`Area active: ${B3_pct(post)} chance the process was engaged`);
  out+=R(x0,y0,w*pr,h,'#fff',C.line,0)+R(xs,y0,w*(1-pr),h,'#fff',C.line,0)+R(x0,y0+h*(1-pa),w*pr,h*pa,C.coral,'none',0)+R(xs,y0+h*(1-pb),w*(1-pr),h*pb,C.amber,'none',0);
  out+=TF(x0+w*pr/2,y0-8,pr>.22?'process engaged':'',12,C.coral)+TF(xs+w*(1-pr)/2,y0-8,pr<.78?'process not engaged':'',12,C.amber);
  out+=TF(x0,y0+h+18,`width: prior ${s.pr}%`,12,C.muted,'start')+TF(x0+w,y0+h+18,'height: how often the area is active',12,C.muted,'end');
  out+=B3_card(362,58,222,258)+TF(374,86,'Of all cases with the area active',12.5,C.muted,'start');
  out+=R(374,98,198,18,C.amber,'none',5)+R(374,98,198*post,18,C.coral,'none',5)+TF(374,134,'coral: process engaged',12,C.coral,'start')+TF(374,150,'amber: something else',12,C.amber,'start');
  out+=TF(374,182,'Posterior',12.5,C.muted,'start')+TBF(572,184,B3_pct(post),18,C.coral,'end')+TF(374,212,'Bayes factor (ratio of the rates)',12.5,C.muted,'start')+TBF(572,236,fmt(Math.round(bf*10)/10),16,C.blue,'end');
  out+=B3_para(374,262,bf<3?'Weak evidence: the area is active in too many other situations.':bf<10?'Moderate evidence.':'Strong evidence: the area is selective for this process.',31,13,C.ink);
  out+=B3_para(40,330,`posterior = ${fmt(s.pa)}% × ${s.pr}% ÷ (${fmt(s.pa)}% × ${s.pr}% + ${fmt(s.pb)}% × ${100-s.pr}%) = ${B3_pct(post)}`,84,13,C.ink);
  out+=B3_note('Poldrack’s exact counts give 0.69 and a Bayes factor of 2.3; the sliders round them.',366);
  return {svg:out,phase:bf<3?'This is the weak step behind headlines such as “the brain’s fear centre lit up”. Most areas take part in many processes, so activity in one of them is modest evidence for any single process. No scan shows where a complex trait “lives”.':'Reverse inference is sound when an area responds to one kind of process and rarely to others, and when that selectivity has been measured across many studies, not assumed.'};
 }});

/* ===================== Lesson: lesion-cases ===================== */
const B3_GAGE=[{c:'A tamping iron passed through the front of his head, and he lived.',v:1,why:'Well documented. John Harlow, the doctor who treated him, reported the case in 1848, and Henry Bigelow examined Gage in Boston. The skull and the iron, over a metre long and about 6 kg, are kept at Harvard.'},
 {c:'He was conscious and talking within minutes.',v:1,why:'Reported by the doctors who saw him that afternoon. He walked with little help and described the accident himself.'},
 {c:'His character changed: friends said he was “no longer Gage”.',v:1,why:'In the records, but thinly. It rests almost wholly on Harlow’s second report of 1868, written twenty years after the accident and eight after Gage died. It gives few details and does not say how long the change lasted.'},
 {c:'He could never hold a job again.',v:0,why:'Contradicted by the records. He worked at a livery stable in New Hampshire for about a year and a half, and then in Chile for some seven years.'},
 {c:'He drove stagecoaches in Chile for years.',v:1,why:'Reported by Harlow from Gage’s family. Malcolm Macmillan points out what the work demanded: long routes, six horses, passengers, a fixed timetable. It suggests that Gage recovered a good deal.'},
 {c:'He became a drunken, violent drifter.',v:0,why:'Not in any record from his lifetime. Macmillan traced how later writers added drinking, brawling and wandering to the story as it was retold.'}];
SCENE({id:'lesion-cases',name:'Phineas Gage, by the records',tag:'A famous case, often overstated',
 definition:'A lesion case is the study of one person whose brain injury is known, used to work out what the damaged part normally does. The most famous is Phineas Gage, a railway construction foreman in Vermont. On 13 September 1848 an explosion drove an iron rod through the front of his head. He survived for almost twelve years. He is cited as proof that the frontal lobes govern personality, but the evidence about how he changed is thin, and the usual account of his later life goes well beyond it.',
 example:'The famous line that he was “no longer Gage” comes from a report written twenty years after the accident. The same report says that he then drove stagecoaches in Chile for years.',
 desc:'A timeline of Gage’s life from 1848 to 1868 and six statements often made about him; the learner judges whether each is in the records and reads the source for it.',
 research:['Harlow (1848). Passage of an iron rod through the head. Boston Medical and Surgical Journal 39, 389–393. · Harlow (1868). Recovery from the passage of an iron bar through the head. Publications of the Massachusetts Medical Society 2, 327–347.','Macmillan (2000). An Odd Kind of Fame: Stories of Phineas Gage. MIT Press. · Macmillan & Lena (2010). Rehabilitating Phineas Gage. Neuropsychological Rehabilitation 20, 641–658. · Reconstructions from the skull disagree on whether the right frontal lobe was also damaged (Damasio et al. 1994; Ratiu et al. 2004; Van Horn et al. 2012).'],
 dur:14,hint:'Press a statement, then say whether you think it is in the records from the time. The panel shows the source. Nothing is scored against you: most people have met the embellished version.',
 init:()=>({sel:0,ans:{}}),
 watch(p){const k=Math.min(5,Math.floor(p*6)),ans={};for(let i=0;i<=k;i++)ans[i]=B3_GAGE[i].v;return {sel:k,ans}},
 ui:[{choose:[[1,'In the records'],[0,'Not in the records']],label:'Your judgement',get:s=>s.ans[s.sel]===undefined?'':s.ans[s.sel],act:'judge'},{b:'Next statement',act:'next'}],
 on:{sel(s,v){s.sel=+v},judge(s,v){s.ans[s.sel]=+v},next(s){s.sel=(s.sel+1)%6}},
 draw(s,f,X){
  const Xy=y=>40+(y-1848)/20*520,g=B3_GAGE[s.sel],a=s.ans[s.sel],done=a!==undefined,right=Object.keys(s.ans).filter(k=>s.ans[k]===B3_GAGE[k].v).length,n=Object.keys(s.ans).length;
  let out=heading(n?`Judged ${n} of 6 · ${right} match the records`:'Six statements about Phineas Gage');
  out+=L(40,74,560,74,C.line,2)+R(Xy(1852),69,Xy(1859)-Xy(1852),10,C.green,'none',4);
  for(const y of [1848,1860,1868])out+=Ci(Xy(y),74,5,y===1848?C.coral:C.ink);
  out+=TF(40,60,'1848 accident; first report',11.5,C.coral,'start')+TF(Xy(1855.5),94,'1852–59 coach driver in Chile',11.5,C.green)+TF(560,60,'1868 Harlow’s second report',11.5,C.ink,'end')+TF(Xy(1860)+8,94,'1860 dies',11.5,C.muted,'start');
  B3_GAGE.forEach((q,i)=>{const y=106+i*40,on=i===s.sel,an=s.ans[i],lines=B3_wrap(q.c,40);
   out+=hit(X,'sel',i,q.c,R(16,y,292,35,on?C.pale:'#fff',on?C.blue:C.grid,7)+lines.map((l,j)=>TF(26,y+(lines.length>1?14:21)+j*14,l,12,C.ink,'start')).join(''))+(an===undefined?'':TBF(298,y+22,an===q.v?'✓':'✗',14,an===q.v?C.green:C.coral,'end'))});
  out+=B3_card(320,106,266,236);
  if(done){out+=TBF(334,130,g.v?'In the records':'Not in the records',14,g.v?C.green:C.coral,'start')+TF(334,148,a===g.v?'You judged it so.':'You judged otherwise.',12,C.muted,'start')+B3_para(334,172,g.why,38,12.5,C.ink,'start',16)}
  else out+=B3_para(334,134,'Is this statement supported by records from Gage’s lifetime or by his doctor’s reports? Choose an answer below.',36,13,C.ink);
  out+=B3_note('Sources: Harlow 1848 and 1868; Macmillan 2000; Macmillan & Lena 2010.',364);
  return {svg:out,phase:done?g.why:'One case can show that something is possible: a person can survive severe frontal damage and walk, talk and work. It cannot show how often, or exactly which part does what, least of all when nobody examined the brain and the behaviour was written down from memory years later.'};
 }});

// Mirror drawing over three days: illustrative error counts with the shape Milner reported for H.M.
const B3_merr=k=>{const d=Math.floor(k/10),j=k%10,base=[30,9,4][d],fl=[8,4,2][d];return Math.round(fl+(base-fl)*Math.exp(-j/2.5))};
const B3_starPt=(i,R1,R2)=>{const a=-Math.PI/2+i*Math.PI/5,r=i%2?R2:R1;return [r*Math.cos(a),r*Math.sin(a)]};
SCENE({id:'lesion-cases-hm',name:'Henry Molaison',tag:'Learning without remembering',
 definition:'In 1953 the surgeon William Scoville removed the inner part of both temporal lobes, including most of the hippocampus, from Henry Molaison, aged 27, to treat severe epilepsy. The seizures eased, but he could no longer form lasting memories of new events or facts. The psychologist Brenda Milner tested him and found his intelligence, his memory over a few seconds and his older memories largely spared. In 1962 she showed that he could still learn a skill, tracing a star seen only in a mirror, while having no memory of ever having practised it. Memory is more than one system.',
 example:'On each of three days his tracing improved, and each day he began about as well as he had finished the day before. Each day the task seemed new to him.',
 desc:'Left, a five-pointed star with a traced line whose wobble shrinks with practice; right, a chart of errors over thirty trials on three days, and what the patient says when asked whether he has done the task before.',
 research:['Scoville & Milner (1957). Loss of recent memory after bilateral hippocampal lesions. Journal of Neurology, Neurosurgery and Psychiatry 20, 11–21. · Milner (1962), in Physiologie de l’hippocampe (Paris: CNRS): the mirror-drawing result.','Corkin (1968). Acquisition of motor skill after bilateral medial temporal-lobe excision. Neuropsychologia 6, 255–265. · Corkin (2002). What’s new with the amnesic patient H.M.? Nature Reviews Neuroscience 3, 153–160. Suzanne Corkin worked with him for more than forty years. He was known as H.M. until his death in 2008.'],
 dur:12,hint:'Run the trials, day by day, then ask him whether he has done the task before. The error counts are illustrative and follow the shape of Milner’s published curve.',
 init:()=>({k:0,asked:0}),
 watch(p){return {k:Math.min(29,Math.floor(p*34)),asked:p>.88?1:0}},
 ui:[{b:'Next trial',act:'next'},{b:'Finish the day',act:'day'},{b:'Ask: have you done this before?',act:'ask'}],
 on:{next(s){s.k=(s.k+1)%30;s.asked=0},day(s){s.k=Math.min(29,Math.floor(s.k/10)*10+9);s.asked=0},ask(s){s.asked=1}},
 draw(s){
  const day=Math.floor(s.k/10),e=B3_merr(s.k),cx=140,cy=168;
  let out=heading(`Day ${day+1}, trial ${s.k%10+1}: ${e} errors`);
  const star=(R1,R2)=>range(10).map(i=>{const [x,y]=B3_starPt(i,R1,R2);return fmt(cx+x)+','+fmt(cy+y)}).join(' ');
  out+=`<polygon points="${star(96,40)}" fill="#fff" stroke="${C.ink}" stroke-width="1.6"/><polygon points="${star(74,28)}" fill="#fff" stroke="${C.ink}" stroke-width="1.6"/>`;
  const r=rng(s.k*31+5);let d='';for(let i=0;i<=100;i++){const u=i/100*10,a=Math.floor(u)%10,b=(a+1)%10,q=u-Math.floor(u),A=B3_starPt(a,85,34),B=B3_starPt(b,85,34),w=(r()-.5)*e*.9;d+=(i?'L':'M')+fmt(cx+lerp(A[0],B[0],q)+w)+' '+fmt(cy+lerp(A[1],B[1],q)+(r()-.5)*e*.9)}
  out+=P(d,C.coral,1.8)+TF(cx,286,'Trace between the two lines, seeing',12,C.muted)+TF(cx,302,'hand and star only in a mirror.',12,C.muted);
  const x0=320,w=250,yb=250,h=170,Xk=k=>x0+(k+.5)/30*w,Ye=v=>yb-v/32*h;
  out+=L(x0,yb,x0+w,yb,C.line,1.5)+L(x0,yb,x0,yb-h,C.line,1.5)+TF(x0,yb-h-8,'errors per trial',12,C.muted,'start');
  for(const v of [0,10,20,30])out+=TF(x0-6,Ye(v)+4,v,11,C.muted,'end')+L(x0,Ye(v),x0+w,Ye(v),C.grid,1);
  for(let dd=0;dd<3;dd++){out+=TF(x0+(dd+.5)*w/3,yb+18,'Day '+(dd+1),12,dd===day?C.ink:C.muted)+(dd?L(x0+dd*w/3,yb,x0+dd*w/3,yb-h,C.line,1,'stroke-dasharray="3 4"'):'');
   let dl='';for(let j=0;j<10;j++){const k=dd*10+j;dl+=(j?'L':'M')+fmt(Xk(k))+' '+fmt(Ye(B3_merr(k)))}out+=P(dl,C.line,1.4,'none','stroke-dasharray="2 3"')}
  for(let k=0;k<=s.k;k++)out+=Ci(Xk(k),Ye(B3_merr(k)),k===s.k?4.5:3,k===s.k?C.coral:C.blue);
  out+=B3_card(312,282,274,62,s.asked?C.coral:C.grid)+B3_para(324,302,s.asked?'He says no. He does not remember the task, the apparatus or the earlier sessions, yet his hand has kept what it learned.':'Dotted line: the full three-day curve. Dots: trials run so far.',41,12.5,s.asked?C.ink:C.muted,'start',16);
  out+=B3_note('Illustrative values. Skill learning was spared; memory for events and facts was not.',366);
  return {svg:out,phase:s.asked?'Milner’s finding separated two kinds of memory: remembering that something happened, which needs the hippocampus and its neighbours, and knowing how to do something, which does not. Mind In Motion’s memory era takes this further.':day===0?'On the first day he improves within the session, as anyone would. The telling result comes when he returns.':`Day ${day+1} starts near where day ${day} ended: the skill was kept overnight. One carefully studied person, tested for decades by Brenda Milner and then Suzanne Corkin, changed the theory of memory. Later MRI showed that the removal was smaller than the surgeon’s estimate, a reminder that a case is only as good as the knowledge of the lesion.`};
 }});

// Two tasks, two patients. One shared system (task B simply harder) against two separate systems.
const B3_sg=v=>100/(1+Math.exp(-v/7));
function B3_diss(model,dX,dY){
 const sc=model==='one'?{X:[B3_sg(100-dX-35),B3_sg(100-dX-60)],Y:[B3_sg(100-dY-35),B3_sg(100-dY-60)]}:{X:[B3_sg(100-dX-48),B3_sg(52)],Y:[B3_sg(52),B3_sg(100-dY-48)]};
 const imp=v=>v<75,x=sc.X.map(imp),y=sc.Y.map(imp),one=a=>a[0]!==a[1];
 const kind=one(x)&&one(y)&&x[0]!==y[0]?'double':one(x)||one(y)?'single':(x[0]||y[0])?'both':'none';return {sc,kind}}
SCENE({id:'lesion-cases-dissociation',name:'Double dissociation',tag:'What a pair of cases can show',
 definition:'If a patient does badly on task B and well on task A, it is tempting to say that the damaged area handles B. This single dissociation has a weakness: perhaps both tasks rely on one system and B is simply harder, so any damage hurts it first. A double dissociation answers this. A second patient, with damage elsewhere, shows the reverse pattern: poor on A and good on B. One system with one harder task cannot produce both patterns. Hans-Lukas Teuber gave the argument its name in 1955.',
 example:'Henry Molaison could hold a phone number for seconds and could not lay down lasting memories. The patient K.F. had the reverse: a short-term span of about two digits and normal long-term learning.',
 desc:'A chart of two patients’ scores on two tasks under a model with one shared system or with two separate systems; sliders set each patient’s damage, and the pattern is named as none, single or double dissociation.',
 research:['Teuber (1955). Physiological psychology. Annual Review of Psychology 6, 267–296. · Shallice & Warrington (1970). Independent functioning of verbal memory stores: a neuropsychological study. Quarterly Journal of Experimental Psychology 22, 261–273.','Dunn & Kirsner (2003). What can we infer from double dissociations? Cortex 39, 1–7: even a double dissociation does not prove two fully separate modules.'],
 dur:12,hint:'Set each patient’s damage under each model. Try to produce a crossover (X poor on one task, Y poor on the other) with one shared system: you cannot.',
 init:()=>({model:'one',dX:45,dY:0}),
 watch(p){return p<.5?{model:'one',dX:Math.round(p*2*70),dY:Math.round(p*2*30)}:{model:'two',dX:Math.round((p-.5)*2*70),dY:Math.round((p-.5)*2*70)}},
 ui:[{choose:[['one','One shared system'],['two','Two separate systems']],label:'Model',get:s=>s.model,act:'model'},{range:'dX',label:'Patient X: damage',min:0,max:80,get:s=>s.dX,act:'dX',show:v=>v+'%'},{range:'dY',label:'Patient Y: damage',min:0,max:80,get:s=>s.dY,act:'dY',show:v=>v+'%'}],
 on:{model(s,v){s.model=v},dX(s,v){s.dX=+v},dY(s,v){s.dY=+v}},
 draw(s){
  const o=B3_diss(s.model,s.dX,s.dY),x0=60,w=220,yb=280,h=190,xa=x0+55,xb=x0+w-55,Y=v=>yb-v/100*h;
  const name={none:'No dissociation',single:'Single dissociation',double:'Double dissociation',both:'Both tasks impaired'}[o.kind];
  let out=heading(`${name} · ${s.model==='one'?'one shared system':'two systems'}`);
  out+=L(x0,yb,x0+w,yb,C.line,1.5)+L(x0,yb,x0,yb-h,C.line,1.5)+L(x0,Y(75),x0+w,Y(75),C.amber,1.2,'stroke-dasharray="4 4"')+TF(x0+w+4,Y(75)+4,'impaired below',11,C.amber,'start');
  for(const v of [0,50,100])out+=TF(x0-6,Y(v)+4,v,11,C.muted,'end');
  out+=TF(x0,yb-h-24,'score, % of healthy level',12,C.muted,'start')+TF(xa,yb+18,'Task A',12.5,C.ink)+TF(xb,yb+18,s.model==='one'?'Task B (harder)':'Task B',12.5,C.ink);
  for(const [k,col,dy] of [['X',C.blue,-9],['Y',C.coral,17]]){const v=o.sc[k];out+=L(xa,Y(v[0]),xb,Y(v[1]),col,2.6)+Ci(xa,Y(v[0]),5,col)+Ci(xb,Y(v[1]),5,col)+TBF(xa-(k==='X'?12:28),Y(v[0])+5,k,13,col,'end')+TF(xb+(k==='Y'&&Math.abs(o.sc.X[1]-o.sc.Y[1])<9?46:10),Y(v[1])+4,Math.round(v[1])+'%',11.5,col,'start')}
  const bx=392;out+=B3_card(bx-12,58,206,126)+TBF(bx,80,'The model',13,C.ink,'start');
  if(s.model==='one'){out+=box(bx+40,92,100,30,'one system',C.pale,C.ink,13)+arrow(bx+70,122,bx+40,152,C.muted,2)+arrow(bx+110,122,bx+140,152,C.muted,2)+TF(bx+36,170,'Task A',12,C.ink)+TF(bx+144,170,'Task B',12,C.ink)}
  else{out+=box(bx,92,82,30,'system 1',C.pale,C.ink,13)+box(bx+100,92,82,30,'system 2',C.coralp,C.ink,13)+arrow(bx+41,122,bx+41,152,C.muted,2)+arrow(bx+141,122,bx+141,152,C.muted,2)+TF(bx+41,170,'Task A',12,C.ink)+TF(bx+141,170,'Task B',12,C.ink)}
  out+=B3_para(bx-12,208,s.model==='one'?'Damage in either patient lowers the one resource. Task B needs more of it, so it fails first.':'Patient X’s lesion is in system 1 and patient Y’s in system 2.',31,13,C.ink);
  out+=B3_para(bx-12,286,{none:'Both patients are in the healthy range on both tasks.',single:s.model==='one'?'One system and a harder task are enough to give this.':'One patient alone cannot rule out the one-system reading.',double:'The crossover: this cannot come from one system with one harder task.',both:'Poor on both tasks: no clue to how they are organised.'}[o.kind],31,13,o.kind==='double'?C.green:C.muted);
  out+=B3_note('Toy model. Scores are a smooth function of the resource left after damage.',364);
  return {svg:out,phase:o.kind==='double'?'Each patient fails where the other succeeds, so neither task is simply the harder one. This is how short-term and long-term memory, and many other pairs of abilities, were argued to rest on different machinery. It is strong evidence, not proof: the two systems may still overlap and interact.':s.model==='one'?'However you set the sliders, task B suffers at least as much as task A in both patients. A single dissociation always fits this model, which is why one striking patient is not enough.':'Raise the damage in both patients to see the lines cross. Finding the second patient can take years: such cases are rare, and their lesions are never as tidy as the diagram.'};
 }});

/* ===================== Lesson: connectome ===================== */
// The touch-withdrawal circuit of C. elegans, simplified from Chalfie et al. (1985): the excitatory routes only.
const B3_WN={ALM:{at:[70,120],k:'s',d:'ALM: a pair of touch receptor neurons along the front half of the body.'},AVM:{at:[70,180],k:'s',d:'AVM: a single touch receptor neuron serving the front of the body.'},PLM:{at:[70,280],k:'s',d:'PLM: a pair of touch receptor neurons in the tail.'},
 AVD:{at:[200,150],k:'i',d:'AVD: an interneuron that receives from the front touch cells.'},AVA:{at:[330,150],k:'i',d:'AVA: a command interneuron for backward movement.'},PVC:{at:[200,280],k:'i',d:'PVC: an interneuron that receives from the tail touch cells.'},AVB:{at:[330,280],k:'i',d:'AVB: a command interneuron for forward movement.'},
 A:{at:[448,150],k:'m',d:'A-type motor neurons (VA and DA) along the nerve cord: they drive backward movement.'},B:{at:[448,280],k:'m',d:'B-type motor neurons (VB and DB) along the nerve cord: they drive forward movement.'},
 back:{at:[548,150],k:'o',d:'Body-wall muscles contract in a wave that moves the worm backward.'},fwd:{at:[548,280],k:'o',d:'Body-wall muscles contract in a wave that moves the worm forward.'}};
const B3_WE=[['ALM','AVD'],['AVM','AVD'],['AVD','AVA'],['AVA','A'],['A','back'],['PLM','PVC'],['PVC','AVB'],['AVB','B'],['B','fwd']];
const B3_WX=[['ALM','PVC'],['AVM','AVB'],['PLM','AVD'],['PLM','AVA']];   // also present; thought to quieten the opposite direction
const B3_hasEdge=(a,b)=>B3_WE.some(e=>e[0]===a&&e[1]===b);
const B3_WLAB={A:'A-type',B:'B-type',back:'backward',fwd:'forward'};
SCENE({id:'connectome',name:'The mind of a worm',tag:'Follow a path through 302 neurons',
 definition:'A connectome is a complete map of the neurons in a nervous system and the synapses between them. The first was for the roundworm Caenorhabditis elegans, one millimetre long. John White, Eileen Southgate, Nichol Thomson and Sydney Brenner cut a worm into thousands of slices, photographed each in the electron microscope and traced every neuron by hand. The work took more than a decade and was published in 1986: 302 neurons in the adult hermaphrodite, and several thousand synapses. With the map, a behaviour can be followed from sensory neuron to muscle.',
 example:'Touch the worm gently near the head and it backs away. The route is short: touch neuron ALM, interneurons AVD and AVA, A-type motor neurons, muscle.',
 desc:'A wiring diagram of eleven neurons and outputs in the worm’s touch-withdrawal circuit; the learner starts at a touch neuron and presses each next cell to follow the route to a movement.',
 research:['White, Southgate, Thomson & Brenner (1986). The structure of the nervous system of the nematode Caenorhabditis elegans. Philosophical Transactions of the Royal Society B 314, 1–340.','Chalfie, Sulston, White, Southgate, Thomson & Brenner (1985). The neural circuit for touch sensitivity in Caenorhabditis elegans. Journal of Neuroscience 5, 956–964: the circuit was worked out by removing single neurons with a laser and reading the wiring diagram. · Cook et al. (2019). Whole-animal connectomes of both Caenorhabditis elegans sexes. Nature 571, 63–71.'],
 dur:12,hint:'Choose where the worm is touched, then press the next neuron along the route until you reach a movement. A press with no synapse behind it is refused. The diagram is simplified.',
 init:()=>({path:['ALM'],msg:''}),
 watch(p){const a=['ALM','AVD','AVA','A','back'],b=['PLM','PVC','AVB','B','fwd'],u=p<.5?p*2:(p-.5)*2;return {path:(p<.5?a:b).slice(0,1+Math.min(4,Math.floor(u*5.5))),msg:''}},
 ui:[{choose:[['ALM','Touch near the head'],['PLM','Touch near the tail']],label:'Stimulus',get:s=>s.path[0]==='PLM'?'PLM':s.path[0]==='ALM'?'ALM':'',act:'start'},{b:'Step back',act:'undo'}],
 on:{start(s,v){s.path=[v];s.msg=''},undo(s){if(s.path.length>1)s.path.pop();s.msg=''},
  node(s,v){const last=s.path[s.path.length-1];if(B3_WN[v].k==='s'){s.path=[v];s.msg='';return}
   if(B3_hasEdge(last,v)){s.path.push(v);s.msg=''}else s.msg=B3_WN[last].k==='o'?'The route is complete. Choose a stimulus to start again.':`The diagram has no excitatory synapse from ${B3_WLAB[last]||last} to ${B3_WLAB[v]||v}.`}},
 draw(s,f,X){
  const last=s.path[s.path.length-1],done=B3_WN[last].k==='o',onPath=id=>s.path.includes(id),hops=s.path.length-1;
  let out=heading(done?`${hops} steps from touch to moving ${B3_WLAB[last]}`:`At ${B3_WLAB[last]||last}: press the next cell`);
  const cols=[['touch neurons',70],['interneurons',265],['motor neurons',448],['movement',548]];for(const [t,x] of cols)out+=TF(x,62,t,12,C.muted);
  for(const [a,b] of B3_WX)out+=L(B3_WN[a].at[0]+22,B3_WN[a].at[1],B3_WN[b].at[0]-22,B3_WN[b].at[1],C.grid,1.4,'stroke-dasharray="3 5"');
  for(const [a,b] of B3_WE){const live=onPath(a)&&onPath(b)&&s.path.indexOf(b)===s.path.indexOf(a)+1;out+=arrowR(B3_WN[a].at,B3_WN[b].at,24,26,live?C.coral:C.line,live?3.4:2)}
  for(const id in B3_WN){const n=B3_WN[id],[x,y]=n.at,on=onPath(id),next=!done&&B3_hasEdge(last,id),col=n.k==='s'?C.green:n.k==='i'?C.blue:n.k==='m'?C.purple:C.amber,lab=B3_WLAB[id]||id;
   const inner=n.k==='o'?R(x-36,y-17,72,34,on?C.amber:C.amberp,C.amber,8)+TBF(x,y+5,lab,12.5,on?'#fff':C.ink):Ci(x,y,22,on?col:'#fff',next?C.coral:col)+TBF(x,y+5,lab,lab.length>4?11:12.5,on?'#fff':C.ink);
   out+=hit(X,'node',id,n.d,inner)}
  out+=TF(30,232,'head',12,C.muted,'start')+L(30,238,110,238,C.grid,1.5)+TF(30,254,'tail',12,C.muted,'start');
  out+=B3_card(16,312,568,46,s.msg?C.coral:C.grid)+B3_para(28,332,s.msg||B3_WN[last].d,88,12.5,s.msg?C.coral:C.ink,'start',15);
  out+=B3_note('Solid arrows: the route that excites. Dotted: links thought to quieten the other movement.',372);
  return {svg:out,phase:done?`Touch to movement in ${hops} steps, through ${hops-1} cells. Chalfie and colleagues tested this route by removing each cell with a laser: without AVD and AVA, for example, a touch on the head no longer made the worm back away. The map said what could be connected; the experiments said what mattered.`:'Every worm has the same named neurons in nearly the same places, so one animal’s map serves for all. The dotted connections matter too: a touch on the head has to start backing and also stop forward movement.'};
 }});

const B3_ORGS=[{id:'worm',n:'Roundworm',sub:'C. elegans',neu:302,col:C.green,st:'Complete: 1986',d:'302 neurons and several thousand synapses, traced by hand from electron micrographs. Both sexes were mapped again in 2019.'},
 {id:'larva',n:'Fly larva',sub:'Drosophila',neu:3016,col:C.blue,st:'Brain complete: 2023',d:'3,016 neurons and about 548,000 synapses in the brain of a young larva (Winding et al. 2023).'},
 {id:'fly',n:'Adult fly',sub:'Drosophila',neu:139255,col:C.purple,st:'Brain complete: 2024',d:'About 140,000 neurons and more than 50 million synapses in the brain of one adult female. Segmented by machine learning, then checked by hundreds of scientists and volunteers (FlyWire).'},
 {id:'mouse',n:'Mouse',sub:'',neu:7e7,col:C.amber,st:'Fragments only',d:'About 70 million neurons. Only pieces of about a cubic millimetre have been reconstructed in detail so far.'},
 {id:'human',n:'Human',sub:'',neu:8.6e10,col:C.coral,st:'No connectome',d:'About 86 billion neurons. The largest piece mapped at synapse level is about one cubic millimetre of temporal cortex: 57,000 cells, about 150 million synapses, 1.4 petabytes of images (Shapson-Coe et al. 2024).'}];
SCENE({id:'connectome-scale',name:'From the worm to the fly',tag:'Each step is hundreds of times larger',
 definition:'For decades the worm was the only animal with a complete wiring diagram. Automated electron microscopes and machine learning changed that. In 2023 the brain of a fruit fly larva was completed, and in 2024 the FlyWire consortium published the brain of an adult fruit fly, about 140,000 neurons. There is no connectome of a mouse brain or a human brain at the level of synapses. MRI-based “connectomes” of the human brain show bundles of thousands of fibres, not single neurons.',
 example:'One cubic millimetre of human cortex, about a millionth of the brain, took 1.4 petabytes of electron-microscope images. A whole brain at that detail would need on the order of a zettabyte.',
 desc:'Bars on a logarithmic scale for the number of neurons in the roundworm, the fly larva, the adult fly, the mouse and the human, marked by how much of each has been mapped, with a slider that scales up the data needed for a piece of human brain.',
 research:['Dorkenwald et al. (2024). Neuronal wiring diagram of an adult brain. Nature 634, 124–138. · Schlegel et al. (2024). Whole-brain annotation and multi-connectome cell typing of Drosophila. Nature 634, 139–152. · Winding et al. (2023). The connectome of an insect brain. Science 379, eadd9330.','Shapson-Coe et al. (2024). A petavoxel fragment of human cerebral cortex reconstructed at nanoscale resolution. Science 384, eadk4858. · Neuron counts: Azevedo et al. (2009) for the human brain; Herculano-Houzel et al. (2006) for the mouse.'],
 dur:11,hint:'Press an animal to see how much of it has been mapped. Then slide the size of a piece of human brain to see how the image data grow at 1.4 petabytes per cubic millimetre.',
 init:()=>({org:'fly',v:0}),
 watch(p){return {org:B3_ORGS[Math.min(4,Math.floor(p*5))].id,v:Math.round(p*6)}},
 ui:[{choose:B3_ORGS.map(o=>[o.id,o.n]),label:'Animal',get:s=>s.org,act:'org'},{range:'v',label:'Piece of human brain',min:0,max:6,get:s=>s.v,act:'v',show:v=>v<3?Math.pow(10,v)+' mm³':v<6?Math.pow(10,v-3)+' cm³':'1 litre'}],
 on:{org(s,v){s.org=v},v(s,v){s.v=+v}},
 draw(s,f,X){
  const o=B3_ORGS.find(q=>q.id===s.org),x0=150,w=400,Xn=n=>x0+Math.log10(n)/13*w,fly=B3_ORGS[2].neu;
  let out=heading(`${o.n}: ${o.neu<1e6?B3_num(o.neu):o.neu<1e9?'about '+Math.round(o.neu/1e6)+' million':'about '+Math.round(o.neu/1e9)+' billion'} neurons`);
  for(const e of [0,3,6,9])out+=L(Xn(Math.pow(10,e)),64,Xn(Math.pow(10,e)),216,C.grid,1)+TF(Xn(Math.pow(10,e)),60,['1','1,000','1 million','1 billion'][e/3],11,C.muted);
  B3_ORGS.forEach((q,i)=>{const y=70+i*30,on=q.id===s.org;out+=hit(X,'org',q.id,`${q.n}: ${q.st}`,TF(x0-8,y+15,q.n,12.5,on?C.ink:C.muted,'end',on?'font-weight="700"':'')+R(x0,y,Xn(q.neu)-x0,20,on?q.col:tint(q.col,.55),'none',4))+TF(Xn(q.neu)+6,y+15,q.st,11.5,on?q.col:C.muted,'start')});
  out+=TF(x0,232,'neurons (each mark is 1,000 times the last)',11.5,C.muted,'start');
  out+=B3_card(16,242,344,112)+TBF(28,262,o.n+(o.sub?' ('+o.sub+')':''),13,o.col,'start')+B3_para(28,282,o.d,54,12.5,C.ink,'start',16);
  const mm=Math.pow(10,s.v),pb=1.4*mm,size=pb<1000?fmt(pb)+' petabytes':pb<1e6?fmt(pb/1000)+' exabytes':fmt(pb/1e6)+' zettabytes';
  out+=B3_card(372,242,212,112)+TF(384,262,'Human brain tissue imaged',12,C.muted,'start')+TBF(384,282,s.v<3?B3_num(mm)+' mm³':s.v<6?B3_num(mm/1000)+' cm³':'1 litre',14,C.ink,'start')+TF(384,306,'Images at 1.4 PB per mm³',12,C.muted,'start')+TBF(384,328,size,14,C.coral,'start')+TF(384,346,'whole brain: about 1.2 litres',11.5,C.muted,'start');
  out+=B3_note(`The human brain has about ${B3_num(B3_sig2(8.6e10/fly))} times as many neurons as the adult fly’s.`,372);
  return {svg:out,phase:o.id==='human'?'A synapse-level map of a human brain is far beyond present methods: the tissue would have to be cut into slices tens of nanometres thick and imaged in full. The one cubic millimetre mapped so far came from tissue removed during an operation for epilepsy.':o.id==='fly'?'The fly brain needed about 7,000 slices and years of proofreading. It is the largest complete brain connectome so far, and it comes from a single animal, so it cannot show how wiring differs between individuals.':o.id==='mouse'?'Cubic-millimetre pieces of mouse cortex have been reconstructed; a whole mouse brain is about 500 times larger. Projects to attempt it are being planned.':`${o.d} Each completed map has been followed by years of experiments to find out what its circuits do.`};
 }});

// A toy circuit with fixed wiring: touch sensor S drives B (back) and F (forward), which inhibit each other.
function B3_toy(wB,wF,mod){const dB=wB*(mod==='b'?2:1),dF=wF*(mod==='f'?2:1);return {dB,dF,out:dB===0&&dF===0?'none':dB>dF?'back':dF>dB?'fwd':'tie'}}
SCENE({id:'connectome-limits',name:'What a wiring diagram leaves out',tag:'Same map, different behaviour',
 definition:'A connectome records which neurons are connected. It does not record how strong each synapse is, whether it excites or inhibits, which neuromodulators are bathing the circuit, or what the neurons are doing at a given moment. These can change within seconds while the wiring stays the same. A wiring diagram is necessary for understanding a circuit, and not enough.',
 example:'In the crab’s stomatogastric ganglion, one fixed circuit of about 30 neurons produces different rhythms under different neuromodulators. In the worm, signals measured between neurons often differ from what the wiring diagram alone predicts.',
 desc:'Top, a fixed wiring diagram of a sensor, two mutually inhibiting neurons and two movements, which never changes; bottom, the same circuit with adjustable synaptic strengths and a neuromodulator, showing which movement wins.',
 research:['Bargmann & Marder (2013). From the connectome to brain function. Nature Methods 10, 483–490.','Bentley et al. (2016). The multilayer connectome of Caenorhabditis elegans. PLoS Computational Biology 12, e1005283 (signalling by monoamines and neuropeptides outside the synapses). · Randi, Sharma, Dvali & Leifer (2023). Neural signal propagation atlas of Caenorhabditis elegans. Nature 623, 406–414.'],
 dur:11,hint:'Change the two synaptic strengths and add a neuromodulator. The wiring diagram at the top never changes; the behaviour does. This is a toy model, not a real circuit.',
 init:()=>({wB:6,wF:4,mod:'none'}),
 watch(p){return p<.33?{wB:6,wF:4,mod:'none'}:p<.66?{wB:3,wF:7,mod:'none'}:{wB:6,wF:4,mod:'f'}},
 ui:[{range:'wB',label:'Strength: sensor → B',min:0,max:10,get:s=>s.wB,act:'wB'},{range:'wF',label:'Strength: sensor → F',min:0,max:10,get:s=>s.wF,act:'wF'},{choose:[['none','No modulator'],['f','Modulator boosts F'],['b','Modulator boosts B']],label:'Neuromodulator',get:s=>s.mod,act:'mod'}],
 on:{wB(s,v){s.wB=+v},wF(s,v){s.wF=+v},mod(s,v){s.mod=v}},
 draw(s){
  const o=B3_toy(s.wB,s.wF,s.mod),say={back:'the animal backs away',fwd:'the animal moves forward',tie:'evenly balanced: no clear movement',none:'no drive: nothing happens'}[o.out];
  let out=heading(`Same wiring · ${say}`);
  const circ=(y,live)=>{const S=[90,y],B=[250,y-34],F=[250,y+34],OB=[420,y-34],OF=[420,y+34],a=live?clamp(o.dB/10,0,1):0,b=live?clamp(o.dF/10,0,1):0,wb=o.out==='back',wf=o.out==='fwd';
   let g=arrowR(S,B,18,20,live?C.blue:C.muted,live?1+o.dB*.45:2)+arrowR(S,F,18,20,live?C.blue:C.muted,live?1+o.dF*.45:2)+arrowR(B,OB,18,44,live&&wb?C.coral:C.muted,live&&wb?4:2)+arrowR(F,OF,18,44,live&&wf?C.coral:C.muted,live&&wf?4:2);
   g+=L(B[0]-5,B[1]+18,F[0]-5,F[1]-22,C.purple,2)+Ci(F[0]-5,F[1]-22,3.5,C.purple)+L(F[0]+5,F[1]-18,B[0]+5,B[1]+22,C.purple,2)+Ci(B[0]+5,B[1]+22,3.5,C.purple);
   g+=Ci(S[0],S[1],18,'#fff',C.green)+TBF(S[0],S[1]+5,'S',13,C.ink)+Ci(B[0],B[1],18,live&&wb?C.coral:live?tint(C.coral,1-a*.5):'#fff',C.blue)+TBF(B[0],B[1]+5,'B',13,live&&wb?'#fff':C.ink)+Ci(F[0],F[1],18,live&&wf?C.coral:live?tint(C.coral,1-b*.5):'#fff',C.blue)+TBF(F[0],F[1]+5,'F',13,live&&wf?'#fff':C.ink);
   g+=R(OB[0]-40,OB[1]-14,80,28,live&&wb?C.amber:C.amberp,C.amber,7)+TF(OB[0],OB[1]+5,'backward',12,live&&wb?'#fff':C.ink)+R(OF[0]-40,OF[1]-14,80,28,live&&wf?C.amber:C.amberp,C.amber,7)+TF(OF[0],OF[1]+5,'forward',12,live&&wf?'#fff':C.ink);
   if(live&&s.mod!=='none'){const M=s.mod==='f'?F:B;g+=Ci(M[0],M[1],27,'none',C.green,'stroke-dasharray="4 4"')+TF(M[0]+34,M[1]+(s.mod==='f'?22:-16),'modulator: ×2',11.5,C.green,'start')}
   return g};
  out+=R(16,52,568,116,'#f7fafc',C.grid,10)+TBF(28,72,'What the connectome records',12.5,C.ink,'start')+TF(28,88,'(never changes)',11.5,C.muted,'start')+circ(112,false);
  out+=R(16,176,568,146,'#fff',C.grid,10)+TBF(28,196,'What the circuit is doing now',12.5,C.ink,'start')+circ(252,true);
  out+=TF(500,214,`drive to B: ${fmt(o.dB)}`,12,C.ink)+TF(500,300,`drive to F: ${fmt(o.dF)}`,12,C.ink);
  out+=TF(28,344,'S: touch sensor · B, F: neurons that inhibit each other (purple) · line width: synaptic strength',11.5,C.muted,'start');
  out+=B3_note('Toy model: the neuron with the larger drive silences the other.',366);
  return {svg:out,phase:s.mod!=='none'?`The modulator doubles the effect of the input on ${s.mod==='f'?'F':'B'} without adding or removing a single connection. Eve Marder’s work on the crab stomatogastric ganglion showed real circuits doing this (see the neuromodulation lesson). A connectome has no place to write it down.`:`With strengths ${s.wB} and ${s.wF}, ${say}. Swap the strengths and the behaviour reverses, on the same diagram. Electron micrographs show that a synapse exists and roughly how large it is, not how strongly it acts today.`};
 }});
