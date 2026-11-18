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
const B3_PATS=[{nf:1,c:[2,4],r:[2,4]},{nf:1,c:[1,3],r:[3,4]},{nf:0,c:[6,8],r:[3,4]},{nf:1,c:[2,5],r:[3,3]},{nf:0,c:[4,5],r:[1,2]},{nf:1,c:[2,3],r:[1,3]},{nf:0,c:[1,1],r:[2,4]},{nf:0,c:[4,4],r:[3,4]}];
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
  out+=TF(bx+28,by+12*k,'front',12,C.muted,'start')+TF(bx+190*k,by+60*k,'back',12,C.muted,'end');
  out+=R(30,268,14,14,C.coral,'none',3)+TF(50,280,'damaged in every patient with halting speech',12,C.ink,'start');
  out+=R(30,288,14,14,tint(C.coral,.6),'none',3)+TF(50,300,'damaged in some of them',12,C.ink,'start');
  out+=R(30,308,14,14,'#cfd6db','none',3)+TF(50,320,'damaged in a fluent patient: ruled out',12,s.sub?C.ink:C.muted,'start');
  out+=TBF(330,70,'Patients examined (simulated)',13,C.ink,'start');
  B3_PATS.forEach((p,i)=>{const y=80+i*24,on=i<s.n,cur=i===s.n-1;out+=R(330,y,250,20,cur?(p.nf?C.coralp:C.pale):'#fff',on?(p.nf?C.coral:C.blue):C.grid,6)+TF(340,y+14,'P'+(i+1),12,on?C.ink:C.line,'start','font-weight="700"')+TF(366,y+14,on?(p.nf?'halting speech, understands':'speaks fluently'):'not yet examined',12,on?(p.nf?C.coral:C.blue):C.line,'start')});
  out+=B3_para(330,292,o.cand<=2&&s.n>=4?'The shared region lies low in the left frontal lobe, roughly where Broca placed it.':'Dashed box: the latest patient’s lesion. Strokes rarely damage one tidy region.',38,13,C.muted);
  out+=B3_note('Illustration of the overlap method, not real patient data.',352);
  return {svg:out,phase:s.n===1?'One patient: every damaged region is a candidate. Leborgne’s brain alone could not show which part of his large lesion mattered, and later scans showed that the damage ran well below the surface.':o.cand<=2?`After ${s.n} patients the overlap is small. This shows that the region is needed for fluent speech, not that speech “lives” there: later scenes show that language uses a network of areas and the fibre tracts between them.`:`With ${s.n} patients, ${o.cand} regions are still damaged in everyone who has halting speech${s.sub?' and in nobody who speaks fluently':''}. More cases, and cases without the difficulty, narrow it further.`};
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
  for(const id of ids){const [x,y]=pt(id),on=s.sel===id;out+=hit(X,'sel',id,B3_LANG[id].n,Ci(x,y,on?12:9,on?C.coral:'#fff',on?C.coral:C.ink))}
  if(net){out+=L(30,292,54,292,C.blue,3)+TF(60,296,'dorsal stream: sound to articulation',12,C.blue,'start')+L(30,312,54,312,C.green,3)+TF(60,316,'ventral stream: sound to meaning',12,C.green,'start')}
  else{out+=L(30,292,54,292,C.amber,3)+TF(60,296,'arcuate fasciculus',12,C.amber,'start')+TF(30,316,'Lichtheim’s diagram of 1885 made this the textbook picture.',12,C.muted,'start')}
  const d=B3_LANG[s.sel];out+=B3_card(330,62,254,232)+TBF(344,86,d.n,14,C.coral,'start');
  out+=B3_para(344,110,net?d.t:d.c,35,13,C.ink);
  if(!net)out+=B3_para(344,180,'Useful at the bedside for a century, but too simple: the two “centres” are not sharply bounded, and other areas and tracts matter as much.',35,13,C.muted);
  out+=B3_note('Regions are placed approximately. Press a circle to select it.',350);
  return {svg:out,phase:net?'In the network account no single area “contains” speech or understanding. Each syndrome reflects which areas and which connecting tracts a lesion takes out, which is why two people with damage in “the same area” can differ. The basic Broca–Wernicke–Lichtheim model is in Mind In Motion’s localisation lesson.':'Wernicke and Lichtheim’s model predicted real syndromes, such as trouble repeating words when the link between the centres is cut. It survives as a first sketch. Switch to the network to see what was added.'};
 }});
