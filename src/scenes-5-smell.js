/* ===================== Senses era 5 · Smell ===================== */
// Receptors and the olfactory bulb, how little we can smell, mixtures, memory and losing smell.
// A screen cannot deliver smells, so the scenes are simulations, honest home tasks with household
// ingredients, and the learner's own answers drawn beside published or clearly labelled illustrative data.
// Every picture is a pure function of state. Random data come from seeded generators (S5_rng). No sound.
const S5_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const S5_rng=n=>rng(S5_mix(n));
function S5_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const S5_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function S5_plot(x0,y0,w,h,xr,yr,o={}){
 const lx=!!o.logx,f=v=>lx?Math.log10(v):v;
 const X=v=>x0+(f(v)-f(xr[0]))/(f(xr[1])-f(xr[0]))*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// Wrap a string into lines of at most n characters.
function S5_wrap(s,n){const words=String(s).split(' '),out=[];let line='';for(const w of words){if((line+' '+w).trim().length>n&&line){out.push(line);line=w}else line=(line+' '+w).trim()}if(line)out.push(line);return out}
// A card: title plus wrapped body lines in fixed-size text.
function S5_card(x,y,w,h,title,body,col=C.blue,fill='#fff'){
 let out=R(x,y,w,h,fill,col,8)+TBF(x+12,y+22,title,14,col,'start');
 S5_wrap(body,Math.floor((w-24)/7.1)).forEach((l,i)=>{out+=TF(x+12,y+44+i*19,l,13,C.ink,'start')});
 return out;
}
// A horizontal share bar with label and percentage.
function S5_hbar(x,y,w,label,v,col,max=100,suffix='%',off=235){
 return TF(x,y+15,label,13,C.ink,'start')+R(x+off,y+2,w,18,'#f1f5f7','none',4)+R(x+off,y+2,w*v/max,18,col,'none',4)+TBF(x+off+w+6,y+16,fmt(v)+suffix,13,col,'start');
}

/* =========================== odorant-receptors =========================== */
const S5_ODS=[
 {id:'vanillin',name:'Vanillin',note:'vanilla',a:[0,.9,.3,0,0,.6,0,0,.2,0,0,0]},
 {id:'limonene',name:'Limonene',note:'orange peel',a:[.8,0,0,.5,0,0,.7,0,0,.3,0,0]},
 {id:'isoamyl',name:'Isoamyl acetate',note:'banana',a:[.6,.2,0,0,.9,0,.3,0,0,0,.4,0]},
 {id:'butyric',name:'Butyric acid',note:'cheese, sweat',a:[0,0,.8,0,0,0,0,.9,0,.5,0,.3]},
 {id:'hexenol',name:'cis-3-Hexenol',note:'cut grass',a:[.3,0,0,.8,.2,0,.6,0,0,0,0,.5]},
 {id:'geosmin',name:'Geosmin',note:'rain on soil',a:[0,0,0,0,0,.3,0,0,.9,0,.7,.4]}];
const S5_od=id=>S5_ODS.find(o=>o.id===id);
const S5_shared=(a,b)=>a.a.filter((v,i)=>v>.15&&b.a[i]>.15).length;
SCENE({id:'odorant-receptors',name:'Odorant receptors',tag:'A smell is a pattern',
 definition:'Smell starts with odorant receptors: proteins on the hair-like cilia of nerve cells high in the nose. Each odorant switches on several receptor types to different degrees, and each receptor type responds to many odorants, so a smell is coded by the pattern across receptors.',
 example:'Vanillin and geosmin share one weakly activated receptor in this sketch but otherwise use different ones. The brain tells them apart by the whole pattern, not by any single receptor.',
 desc:'Bars showing how strongly each of 12 receptor types responds to one or two chosen odorants, with the receptors they share counted.',
 research:'Buck, L. & Axel, R. (1991). A novel multigene family may encode odorant receptors. Cell 65, 175–187 (Nobel Prize 2004). Malnic, Hirono, Sato & Buck (1999). Combinatorial receptor codes for odors. Cell 96, 713–723. The activation patterns here are illustrative.',
 dur:12,hint:'Choose a first odorant, then a second to compare. Count the receptor types they share.',
 init:()=>({a:'vanillin',b:'none'}),
 watch(p){const i=Math.min(5,Math.floor(p*6));return {a:S5_ODS[i].id,b:p>.5?S5_ODS[(i+1)%6].id:'none'}},
 ui:[{choose:S5_ODS.map(o=>[o.id,o.note]),label:'First odorant',get:s=>s.a,act:'a'},{choose:[['none','None']].concat(S5_ODS.map(o=>[o.id,o.note])),label:'Compare with',get:s=>s.b,act:'b'}],
 on:{a(s,v){s.a=v;return 'keep'},b(s,v){s.b=v;return 'keep'}},
 draw(s){
  const A=S5_od(s.a),B=s.b==='none'?null:S5_od(s.b);let out=heading('One smell switches on a pattern of receptors');
  const x0=60,base=270,w=40,top=110;
  out+=R(x0-10,top-14,500,base-top+24,'#fff',C.grid,6);
  A.a.forEach((v,i)=>{const x=x0+i*w;const hA=v*140;out+=R(x+(B?3:9),base-hA,B?15:22,hA,C.blue,'none',3);
   if(B){const hB=B.a[i]*140;out+=R(x+20,base-hB,15,hB,C.coral,'none',3)}
   out+=TF(x+w/2-1,base+18,'R'+(i+1),13,C.muted)});
  out+=L(x0-10,base,x0+490,base,C.line,1.5);
  out+=R(70,58,14,14,C.blue,'none',3)+TF(90,70,`${A.name} (${A.note})`,13,C.ink,'start');
  if(B)out+=R(330,58,14,14,C.coral,'none',3)+TF(350,70,`${B.name} (${B.note})`,13,C.ink,'start');
  out+=TF(300,base+38,'12 of the roughly 400 human receptor types, numbered R1 to R12',13,C.muted);
  const nA=A.a.filter(v=>v>.15).length;
  const msg=B?(B.id===A.id?'The same odorant gives the same pattern.':`They share ${S5_shared(A,B)} receptor type${S5_shared(A,B)===1?'':'s'}; the full patterns differ.`):`${A.name} activates ${nA} of these 12 receptor types.`;
  out+=T(300,350,msg,16,C.ink);
  return {svg:out,phase:'No single receptor means “vanilla” or “cheese”. Each odorant switches on a set of receptor types with different strengths, and each type takes part in many smells. Linda Buck and Richard Axel found the gene family for these receptors in 1991. The patterns drawn here are illustrative; real ones were mapped receptor by receptor, mainly in mice.'};
 }});

const S5_SPECIES=[
 {id:'human',name:'Human',n:400,note:'About 400 working receptor genes, plus roughly as many broken copies (pseudogenes). Yet humans detect some odours as well as or better than dogs or mice (McGann 2017).'},
 {id:'chimp',name:'Chimpanzee',n:380,note:'A similar count to humans, with different genes lost and kept.'},
 {id:'dog',name:'Dog',n:800,note:'About twice the human number, and a much larger area of smelling tissue in the nose.'},
 {id:'mouse',name:'Mouse',n:1100,note:'Over a thousand working genes: one of the largest gene families in the mouse genome.'},
 {id:'rat',name:'Rat',n:1200,note:'Similar to the mouse.'},
 {id:'elephant',name:'African elephant',n:2000,note:'The largest repertoire found so far, about 2,000 working genes.'}];
SCENE({id:'odorant-receptors-genes',name:'How many receptor genes?',tag:'Counting a gene family',
 definition:'Each odorant receptor is made from its own gene. Mammals carry hundreds to thousands of these genes, and many species also carry broken copies that no longer work.',
 example:'Humans have about 400 working receptor genes, mice about 1,100 and African elephants about 2,000. A bigger number does not simply mean a better nose.',
 desc:'Bars of approximate working odorant-receptor gene counts for six mammals, with notes on what the counts do and do not show.',
 research:'Niimura, Matsui & Touhara (2014). Extreme expansion of the olfactory receptor gene repertoire in African elephants. Genome Research 24, 1485–1496. McGann (2017). Poor human olfaction is a 19th-century myth. Science 356, eaam7263. Counts are rounded.',
 dur:10,hint:'Choose a species to read its note. Turn on broken copies to see how many human receptor genes no longer work.',
 init:()=>({sp:'human',pseudo:false}),
 watch(p){return {sp:S5_SPECIES[Math.min(5,Math.floor(p*6))].id,pseudo:p>.15&&p<.4}},
 ui:[{choose:S5_SPECIES.map(o=>[o.id,o.name]),label:'Species',get:s=>s.sp,act:'sp'},{choose:[['off','Working genes'],['on','Add broken copies (human)']],label:'Show',get:s=>s.pseudo?'on':'off',act:'pseudo'}],
 on:{sp(s,v){s.sp=v;return 'keep'},pseudo(s,v){s.pseudo=v==='on';return 'keep'}},
 draw(s){
  let out=heading('Working odorant-receptor genes (approximate)');
  const x0=170,w=320,max=2100;
  S5_SPECIES.forEach((o,i)=>{const y=62+i*34,sel=o.id===s.sp;
   out+=TF(x0-10,y+16,o.name,13,sel?C.ink:C.muted,'end')+R(x0,y+3,w*o.n/max,20,sel?C.blue:'#b9cfdd','none',4);
   if(o.id==='human'&&s.pseudo)out+=R(x0+w*o.n/max,y+3,w*450/max,20,'#f0d9cf',C.coral,4,'stroke-dasharray="4 3"');
   out+=TBF(x0+w*(o.n+(o.id==='human'&&s.pseudo?450:0))/max+6,y+18,'≈ '+o.n.toLocaleString('en-GB'),13,sel?C.blue:C.muted,'start')});
  if(s.pseudo)out+=TF(x0,276,'Dashed: about 450 broken human copies (pseudogenes)',13,C.coral,'start');
  const o=S5_SPECIES.find(q=>q.id===s.sp);
  S5_wrap(o.note,70).forEach((l,i)=>{out+=TF(300,302+i*19,l,13,C.ink)});
  return {svg:out,phase:'Gene counts measure the size of the receptor toolkit, not the quality of a nose. Smelling also depends on how much smelling tissue there is, how the brain uses the signals, and what an animal attends to. The old idea that humans have a poor sense of smell is now seen as overstated.'};
 }});

function S5_logC(n,k){let s=0;for(let i=0;i<k;i++)s+=Math.log10((n-i)/(i+1));return s}
SCENE({id:'odorant-receptors-combinations',name:'Combinations',tag:'A huge code',
 definition:'If each smell switches on a few of several hundred receptor types, the number of possible on-off patterns is enormous. That makes a combinatorial code powerful, but it is only an upper limit on how many smells people can tell apart.',
 example:'With 400 receptor types and each odour using 5 of them, there are about 8 × 10¹⁰ possible patterns, before counting different strengths.',
 desc:'Sliders for the number of receptor types and how many each odour uses, with the number of possible patterns on a logarithmic scale beside the contested “one trillion smells” estimate.',
 research:'Malnic et al. (1999). Combinatorial receptor codes for odors. Cell 96, 713–723. Bushdid et al. (2014). Humans can discriminate more than 1 trillion olfactory stimuli. Science 343, 1370–1372, disputed by Meister (2015) and Gerkin & Castro (2015).',
 dur:10,hint:'Slide the number of receptor types and how many each odour switches on. The bar counts possible on-off patterns on a power-of-ten scale.',
 init:()=>({n:400,k:5}),
 watch(p){return {n:Math.round(lerp(20,400,smooth(p))/10)*10,k:1+Math.round(p*7)}},
 ui:[{range:'n',label:'Receptor types',min:10,max:400,step:10,get:s=>s.n,act:'n'},{range:'k',label:'Used per odour',min:1,max:10,get:s=>s.k,act:'k'}],
 on:{n(s,v){s.n=Number(v);return 'keep'},k(s,v){s.k=Number(v);return 'keep'}},
 draw(s){
  const lc=S5_logC(s.n,Math.min(s.k,s.n));let out=heading('How many patterns can the code make?');
  const pl=S5_plot(60,110,480,46,[0,20],[0,1],{xt:[[0,'1'],[4,'10⁴'],[8,'10⁸'],[12,'10¹²'],[16,'10¹⁶'],[20,'10²⁰']],xl:'possible patterns (each step is ×10,000)'});out+=pl.svg;
  out+=R(60,116,480*clamp(lc/20,0,1),34,C.blue,'none',4);
  out+=L(pl.X(12),100,pl.X(12),166,C.coral,2,'stroke-dasharray="5 4"')+TF(pl.X(12),94,'“1 trillion smells” (contested)',13,C.coral);
  const e=Math.floor(lc),m=Math.pow(10,lc-e);
  out+=TB(300,232,lc<6?`${Math.round(Math.pow(10,lc)).toLocaleString('en-GB')} patterns`:`about ${m.toFixed(1)} × 10^${e} patterns`,20,C.blue);
  out+=T(300,262,`choosing ${s.k} of ${s.n} receptor types, on or off`,15,C.ink);
  out+=TF(300,300,'Patterns are a ceiling, not a count of smells people can tell apart:',13,C.muted);
  out+=TF(300,320,'similar patterns blur together, and real responses are graded, not on-off.',13,C.muted);
  return {svg:out,phase:'Even a modest code makes a vast number of patterns. Whether people can actually distinguish anything like a trillion smells is a separate, disputed question, taken up in the “how many smells” lesson.'};
 }});

/* =========================== olfactory-bulb =========================== */
const S5_COLS=[C.blue,C.green,C.coral];
const S5_NEUR=(()=>{const r=S5_rng(51),a=[];for(let i=0;i<36;i++)a.push({x:60+r()*170,y:100+r()*190,t:i%3});return a})();
SCENE({id:'olfactory-bulb',name:'The olfactory bulb',tag:'Like with like',
 definition:'Each smell-detecting nerve cell in the nose makes just one receptor type. Cells with the same receptor are scattered across the lining of the nose, but their fibres all converge on the same few round knots, called glomeruli, in the olfactory bulb.',
 example:'In mice, the thousands of cells making one receptor type send their fibres to about two glomeruli, so the bulb holds a map in which each knot stands for one receptor type.',
 desc:'Scattered receptor cells of three types in the nasal lining, with the chosen type’s fibres converging on its glomerulus in the olfactory bulb.',
 research:'Mombaerts et al. (1996). Visualizing an olfactory sensory map. Cell 87, 675–686. Ressler, Sullivan & Buck (1994). Information coding in the olfactory system. Cell 79, 1245–1255. Maresh et al. (2008) on the larger number of glomeruli in humans.',
 dur:9,hint:'Choose a receptor type to light up its cells and follow their fibres to the bulb.',
 init:()=>({t:'0'}),
 watch(p){return {t:p<.25?'all':String(Math.min(2,Math.floor((p-.25)*4)))}},
 ui:[{choose:[['0','Type A'],['1','Type B'],['2','Type C'],['all','All types']],label:'Receptor type',get:s=>s.t,act:'t'}],
 on:{t(s,v){s.t=v;return 'keep'}},
 draw(s){
  let out=heading('Scattered in the nose, sorted in the bulb');
  out+=R(40,84,210,224,'#f6efe6',C.line,10)+TF(145,328,'lining of the nose',13,C.muted);
  out+=`<ellipse cx="470" cy="196" rx="90" ry="118" fill="#eef4f8" stroke="${C.line}" stroke-width="2"/>`+TF(470,334,'olfactory bulb',13,C.muted);
  const glom=[[470,120],[470,196],[470,272]];
  S5_NEUR.forEach(n=>{const on=s.t==='all'||String(n.t)===s.t;if(on){const g=glom[n.t];out+=P(`M${fmt(n.x)} ${fmt(n.y)} C${fmt(n.x+120)} ${fmt(n.y)} ${fmt(g[0]-120)} ${fmt(g[1])} ${fmt(g[0]-22)} ${fmt(g[1])}`,S5_COLS[n.t],1.2,'none','opacity=".55"')}});
  S5_NEUR.forEach(n=>{const on=s.t==='all'||String(n.t)===s.t;out+=Ci(n.x,n.y,6,on?S5_COLS[n.t]:'#cdd8df')});
  glom.forEach((g,i)=>{const on=s.t==='all'||String(i)===s.t;out+=Ci(g[0],g[1],22,on?tint(S5_COLS[i],.55):'#fff',on?S5_COLS[i]:C.line)+TBF(g[0],g[1]+5,'ABC'[i],14,on?C.ink:C.muted)});
  out+=TF(470,70,'glomeruli',13,C.muted);
  return {svg:out,phase:s.t==='all'?'Each receptor type’s cells are scattered through the nose, yet the bulb sorts their signals into separate glomeruli. The pattern of active glomeruli is a map of which receptors a smell switched on.':'Cells making the same receptor are spread across the nasal lining, but their fibres find the same glomerulus. A mouse has about two glomeruli per receptor type; humans have more glomeruli than receptor types, so the rule is looser in people.'};
 }});

const S5_PATHS={
 smell:{name:'Smell',boxes:['Receptor cell in the nose','Olfactory bulb','Piriform (smell) cortex'],side:['Amygdala (emotion)','Entorhinal cortex → hippocampus (memory)'],thal:false,note:'Smell reaches cortex after one relay, the bulb, without passing through the thalamus first. Some smell signals do later loop through the thalamus.'},
 vision:{name:'Vision',boxes:['Rods and cones','Bipolar cells','Retinal ganglion cells','Thalamus (LGN)','Visual cortex'],thal:true,note:'Vision passes through three retinal stages and the thalamus before reaching cortex.'},
 hearing:{name:'Hearing',boxes:['Hair cells','Spiral ganglion','Cochlear nucleus','Superior olive','Inferior colliculus','Thalamus (MGN)','Auditory cortex'],thal:true,note:'Hearing has the longest chain, with several brainstem stages that compare the two ears before the thalamus.'},
 touch:{name:'Touch',boxes:['Receptor ending in the skin','Dorsal column nucleus','Thalamus (VPL)','Touch (somatosensory) cortex'],thal:true,note:'Touch climbs the spinal cord, switches in the brainstem and passes through the thalamus.'}};
SCENE({id:'olfactory-bulb-pathway',name:'A short road to memory',tag:'Smell and the thalamus',
 definition:'Signals from the olfactory bulb reach the smell cortex, the amygdala and the gateway to the hippocampus directly. The other senses all pass through the thalamus first.',
 example:'From the nose, two steps bring smell signals to cortex and to brain areas for emotion and memory. Hearing passes through about six stations before reaching its cortex.',
 desc:'The chain of relay stations from receptor to cortex for smell, vision, hearing or touch, with the thalamus marked.',
 research:'Shepherd, G. M. (2005). Perception without a thalamus: how does olfaction do it? Neuron 46, 166–168. Kandel et al., Principles of Neural Science (6th edn, 2021). Station counts are simplified.',
 dur:10,hint:'Choose a sense to see its route from receptor to cortex. Compare where the thalamus sits.',
 init:()=>({sense:'smell'}),
 watch(p){return {sense:['smell','vision','hearing','touch'][Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:Object.keys(S5_PATHS).map(k=>[k,S5_PATHS[k].name]),label:'Sense',get:s=>s.sense,act:'sense'}],
 on:{sense(s,v){s.sense=v;return 'keep'}},
 draw(s){
  const o=S5_PATHS[s.sense],n=o.boxes.length,gap=n>5?38:46;let out=heading(`${o.name}: from receptor to cortex`);
  o.boxes.forEach((b,i)=>{const y=56+i*gap,th=/Thalamus/.test(b),last=i===n-1;
   out+=R(60,y,260,gap-10,th?C.amberp:last?C.greenp:C.pale,th?C.amber:'none',7)+TF(190,y+(gap-10)/2+5,b,13,C.ink);
   if(i<n-1)out+=arrow(190,y+gap-10,190,y+gap,C.muted,1.6,6)});
  if(o.side){const y=56+gap;o.side.forEach((t,i)=>{const yy=y+gap+18+i*52;out+=curveArrow(320,y+(gap-10)/2,360,yy+16,-20,C.coral,1.6)+R(362,yy,222,34,'#fff',C.coral,7)+TF(473,yy+22,t,13,C.ink)});
   out+=R(362,60,222,34,'#fff',C.line,7,'stroke-dasharray="5 4"')+TF(473,82,'Thalamus: not on the main path',13,C.muted)}
  else{out+=counter(380,80,'stations before cortex',String(n-1),C.blue,180)+counter(380,140,'through the thalamus?',o.thal?'yes':'no',o.thal?C.amber:C.green,180)}
  const lines=S5_wrap(o.note,o.side?72:28);lines.forEach((l,i)=>{out+=TF(o.side?300:470,o.side?318+i*18:216+i*19,l,13,C.ink)});
  return {svg:out,phase:'Smell is the only sense whose main route to cortex skips the thalamus, and its first stop beyond the bulb sits right beside the amygdala and the entrance to the hippocampus. That anatomy is one reason smells can feel so emotional, though the link to memory is often overstated.'};
 }});

const S5_resp=(t,away)=>{const end=.3+.7*Math.exp(-t/60);return away>0?1-(1-end)*Math.exp(-away/90):end};
SCENE({id:'olfactory-bulb-adaptation',name:'Getting used to a smell',tag:'Adaptation',
 definition:'With steady exposure a smell fades: receptors and the brain turn down their response. After leaving the smell, sensitivity returns over minutes.',
 example:'People rarely notice the smell of their own home, but notice it at once after a holiday. Visitors smell it straight away.',
 desc:'Perceived strength of a steady smell over time, falling during exposure and recovering after stepping away.',
 research:'Dalton, P. (2000). Psychophysical and behavioral characteristics of olfactory adaptation. Chemical Senses 25, 487–492. Time constants here are illustrative; real adaptation varies with the odour and the person.',
 dur:10,hint:'Slide how long you stay in the smelly room, then how long you step outside.',
 init:()=>({t:120,away:0}),
 watch(p){return p<.6?{t:Math.round(p/.6*300),away:0}:{t:300,away:Math.round((p-.6)/.4*300)}},
 ui:[{range:'t',label:'Time in the smell',min:0,max:300,step:10,get:s=>s.t,act:'t',show:v=>v+' s'},{range:'away',label:'Time outside',min:0,max:300,step:10,get:s=>s.away,act:'away',show:v=>v+' s'}],
 on:{t(s,v){s.t=Number(v);return 'keep'},away(s,v){s.away=Number(v);return 'keep'}},
 draw(s){
  let out=heading('A steady smell fades, then comes back');
  const pl=S5_plot(80,70,440,200,[0,600],[0,1],{xt:[[0,'0'],[120,'2'],[240,'4'],[360,'6'],[480,'8'],[600,'10 min']],yt:[[0,'0'],[.5,'50%'],[1,'100%']],yl:'how strong it seems',xl:'time'});out+=pl.svg;
  const pts=[];for(let k=0;k<=60;k++){const t=s.t*k/60;pts.push([pl.X(t),pl.Y(S5_resp(t,0))])}out+=S5_poly(pts,C.blue,3);
  if(s.away>0){const q=[];for(let k=0;k<=60;k++){const a=s.away*k/60;q.push([pl.X(s.t+a),pl.Y(S5_resp(s.t,a))])}out+=S5_poly(q,C.green,3);
   out+=R(pl.X(s.t),70,pl.X(s.t+s.away)-pl.X(s.t),200,C.greenp,'none',0,'opacity=".45"')}
  const now=S5_resp(s.t,s.away),xn=pl.X(s.t+s.away);out+=Ci(xn,pl.Y(now),7,s.away?C.green:C.blue);
  out+=T(300,346,`Right now the smell seems ${Math.round(now*100)}% as strong as at first.`,16,C.ink);
  return {svg:out,phase:s.away?'Stepping away lets sensitivity recover; coming back, the smell seems strong again. Adaptation protects the system from being swamped and keeps it alert to changes.':'Under steady exposure the smell fades but rarely to nothing. This is why people stop noticing gas leaks or their own perfume, and why fresh air helps you judge a smell again.'};
 }});

/* =========================== smell-thresholds =========================== */
const S5_THR=[
 {id:'h2s',name:'Hydrogen sulfide (rotten eggs)',ppb:.5,safe:'At high levels hydrogen sulfide paralyses smell, so people stop noticing a dangerous gas.'},
 {id:'merc',name:'Ethyl mercaptan (added to gas)',ppb:1,safe:'It is added to odourless natural gas precisely because people detect it at tiny levels.'},
 {id:'nh3',name:'Ammonia',ppb:5000,safe:'People detect ammonia at a few parts per million.'},
 {id:'acet',name:'Acetone (nail-polish remover)',ppb:15000,safe:'A high threshold: we smell acetone only at relatively high levels.'}];
const S5_POP=(()=>{const r=S5_rng(77),a=[];for(let i=0;i<100;i++)a.push(S5_gauss(r)*.6);return a})();
SCENE({id:'smell-thresholds',name:'Smell thresholds',tag:'Parts per billion',
 definition:'A detection threshold is the lowest concentration at which a person can tell an odour from clean air. Thresholds differ enormously between odorants, and between people for the same odorant.',
 example:'Hydrogen sulfide can be smelled at around half a part per billion; acetone needs tens of thousands of times more.',
 desc:'A concentration slider on a log scale, a crowd of 100 simulated people who light up when they detect the odour, and typical thresholds for four odorants.',
 research:'Typical values from compilations such as Devos et al. (1990), Standardized Human Olfactory Thresholds, and Amoore & Hautala (1983). Reported thresholds vary by 10 to 100 times between studies and people; values here are rounded and typical.',
 dur:10,hint:'Choose an odorant and slide the concentration. Each dot is a simulated person whose own threshold varies.',
 init:()=>({od:'h2s',c:0}),
 watch(p){const od=S5_THR[Math.min(3,Math.floor(p*4))];const q=(p*4)%1;return {od:od.id,c:Math.round((Math.log10(od.ppb)-1.5+3*q)*10)/10}},
 ui:[{choose:S5_THR.map(o=>[o.id,o.name.split(' (')[0]]),label:'Odorant',get:s=>s.od,act:'od'},{range:'c',label:'Concentration',min:-2,max:6,step:.1,get:s=>s.c,act:'c',show:v=>{const x=Math.pow(10,v);return x<1?x.toFixed(2)+' ppb':x<1000?Math.round(x)+' ppb':(x/1000).toFixed(x<10000?1:0)+' ppm'}}],
 on:{od(s,v){s.od=v;return 'keep'},c(s,v){s.c=Number(v);return 'keep'}},
 draw(s){
  const o=S5_THR.find(q=>q.id===s.od),lt=Math.log10(o.ppb);let n=0;
  let out=heading(o.name);
  S5_POP.forEach((z,i)=>{const det=s.c>=lt+z;if(det)n++;const x=70+(i%20)*23,y=58+Math.floor(i/20)*26;out+=Ci(x,y,8,det?C.blue:'#dfe7ec')});
  out+=TB(540,96,n+'%',24,C.blue)+TF(540,118,'detect it',13,C.muted);
  const pl=S5_plot(60,206,480,40,[-2,6],[0,1],{xt:[[-2,'0.01 ppb'],[0,'1 ppb'],[3,'1 ppm'],[6,'1,000 ppm']],xl:'concentration in air (log scale)'});out+=pl.svg;
  S5_THR.forEach(q=>{const x=pl.X(Math.log10(q.ppb)),sel=q.id===s.od;out+=L(x,208,x,244,sel?C.coral:C.line,sel?2.5:1.4)});
  out+=Ci(pl.X(s.c),226,8,C.blue)+TF(pl.X(lt),200,'typical threshold',13,C.coral);
  S5_wrap(o.safe,72).forEach((l,i)=>{out+=TF(300,306+i*19,l,13,C.ink)});
  return {svg:out,phase:'Thresholds span a huge range: the most potent odorants are detected at under a part per billion, others need parts per million. Between people, thresholds for the same odorant often differ by 10 to 100 times, which is why the crowd lights up gradually rather than all at once.'};
 }});

const S5_STEPS=[['5','Cup 5 (1 in 100,000)'],['4','Cup 4 (1 in 10,000)'],['3','Cup 3 (1 in 1,000)'],['2','Cup 2 (1 in 100)'],['1','Cup 1 (1 in 10)'],['0','None of them']];
const S5_HOMEDIST={5:12,4:26,3:30,2:19,1:9,0:4};
SCENE({id:'smell-thresholds-home',name:'Your own threshold',tag:'A kitchen dilution test',
 definition:'Clinics measure smell thresholds with a series of dilutions, from very weak to strong, presented with blanks. You can try a rough version at home with vinegar or vanilla extract and water.',
 example:'Make five cups, each ten times weaker than the last. Starting with the weakest, waft each one towards your nose and note the first cup you can tell apart from a cup of plain water.',
 desc:'Five dilution cups and the learner’s answer, drawn beside an illustrative spread of answers from a simulated group of 200 people.',
 research:'Hummel, T. et al. (1997). ‘Sniffin’ Sticks’: olfactory performance assessed by the combined testing of odor identification, odor discrimination and olfactory threshold. Chemical Senses 22, 39–52 (the clinical method). The comparison spread here is illustrative, not a published norm: household extracts vary.',
 dur:10,hint:'Use only vinegar or vanilla extract in water. Waft gently; do not sniff hard. Start with the weakest cup and choose the first you can smell. Your answer stays in this page. This is not a medical test.',
 init:()=>({ans:null}),
 watch(p){return {ans:p>.4?'3':null,sim:true}},
 ui:[{choose:S5_STEPS,label:'First cup I could smell',get:s=>s.ans,act:'ans'}],
 on:{ans(s,v){s.ans=v;s.sim=false;return 'keep'}},
 draw(s){
  let out=heading('Five cups, each ten times weaker');
  ['1 in 10','1 in 100','1 in 1,000','1 in 10,000','1 in 100,000'].forEach((l,i)=>{const x=82+i*110,on=s.ans!==null&&s.ans!=='0'&&Number(s.ans)===i+1;
   out+=P(`M${x-26} 64 L${x-20} 118 L${x+20} 118 L${x+26} 64`,on?C.blue:C.line,2.2,`rgba(214,180,120,${(.75-i*.15).toFixed(2)})`)+TBF(x,140,'Cup '+(i+1),13,on?C.blue:C.ink)+TF(x,158,l,13,C.muted)});
  const pl=S5_plot(70,196,460,110,[0,6],[0,35],{yl:'share of the simulated group (%)'});out+=pl.svg;
  const order=['1','2','3','4','5','0'];
  order.forEach((k,i)=>{const v=S5_HOMEDIST[k],x=82+i*76,mine=s.ans===k;out+=R(x,pl.Y(v),52,pl.Y(0)-pl.Y(v),mine?C.blue:'#c4d6e2','none',3)+TF(x+26,pl.Y(0)+17,k==='0'?'none':'cup '+k,13,mine?C.blue:C.muted)+TF(x+26,pl.Y(v)-5,v+'%',13,C.muted)});
  out+=T(300,354,s.ans===null?'Try the cups, then choose your answer.':`${s.sim?'Simulated participant':'You'}: ${s.ans==='0'?'none of the cups':'cup '+s.ans}. Most people land around cups 2 to 4.`,15,C.ink);
  return {svg:out,phase:'A kitchen test is rough: extract strength, cup size and a stuffy nose all shift the answer. Clinical tests use controlled pens and blanks, and repeat each step. If you notice a real change in your sense of smell, a doctor can arrange proper testing.'};
 }});

const S5_SPEC={
 andro:{name:'Androstenone',gene:'OR7D4',src:'Keller et al. (2007), Nature 449, 468–472',rows:[['Cannot smell it at all',30],['Unpleasant: sweaty or urine-like',45],['Sweet or floral',25]],note:'The same molecule smells foul to some, pleasant to others, and of nothing to many. Variants of one receptor gene, OR7D4, explain part of this. Shares are approximate.'},
 cilantro:{name:'Coriander (cilantro) tastes of soap',gene:'OR6A2',src:'Mauer & El-Sohemy (2012), Flavour 1, 8; Eriksson et al. (2012)',rows:[['East Asian ancestry',21],['European ancestry',17],['African ancestry',14],['South Asian ancestry',7],['Hispanic',4],['Middle Eastern',3]],note:'Share of each group who say coriander leaf tastes soapy. A variant near the receptor gene OR6A2 is linked to it, but culture and familiarity matter too.'},
 asparagus:{name:'Asparagus urine smell',gene:'variants near OR2M7',src:'Markt et al. (2016), BMJ 355, i6071',rows:[['Men who cannot smell it',58],['Women who cannot smell it',62]],note:'Most people in this large study of US health professionals could not smell the distinctive odour in their urine after eating asparagus.'}};
SCENE({id:'smell-thresholds-specific',name:'Specific anosmias',tag:'Smell-blind to one thing',
 definition:'A specific anosmia is an inability to smell one particular odorant while the rest of smell works normally. Many are linked to common variants in single receptor genes.',
 example:'About a third of people cannot smell androstenone at all; among those who can, some find it foul and others sweet.',
 desc:'Shares of people who perceive an odour differently for three well-studied cases, with the gene involved and the source.',
 research:'Keller, Zhuang, Chi, Vosshall & Matsunami (2007). Genetic variation in a human odorant receptor alters odour perception. Nature 449, 468–472. Mauer & El-Sohemy (2012). Flavour 1, 8. Markt et al. (2016). BMJ 355, i6071.',
 dur:10,hint:'Choose a case to compare how differently people perceive the same molecule.',
 init:()=>({c:'andro'}),
 watch(p){return {c:['andro','cilantro','asparagus'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['andro','Androstenone'],['cilantro','Coriander'],['asparagus','Asparagus']],label:'Case',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=v;return 'keep'}},
 draw(s){
  const o=S5_SPEC[s.c];let out=heading(o.name);
  out+=TF(300,56,`Gene linked: ${o.gene}`,13,C.muted);
  o.rows.forEach((r,i)=>{out+=S5_hbar(50,74+i*34,240,r[0],r[1],i===0&&s.c!=='cilantro'?C.coral:C.blue)});
  const y0=74+o.rows.length*34+16;S5_wrap(o.note,72).forEach((l,i)=>{out+=TF(300,y0+i*19,l,13,C.ink)});
  out+=TF(300,354,o.src,13,C.muted);
  return {svg:out,phase:'Specific anosmias show that “the same smell” is not the same for everyone. One small difference in a single receptor gene can change whether a molecule smells of anything, and what it smells like.'};
 }});

/* =========================== odour-mixtures =========================== */
const S5_ALL=[95,55,22,8,3,2,1,1],S5_NAMED=[.95,1.5,1.9,2.1,2.2,2.2,2.1,2.0];
SCENE({id:'odour-mixtures',name:'Smelling a mixture',tag:'No more than three or four',
 definition:'People are poor at picking out the parts of an odour mixture. Even trained noses rarely name more than three or four components, however many are present.',
 example:'With one odour, nearly everyone names it. With four mixed together, almost nobody names all four, and most name only one or two.',
 desc:'Share of people naming every component, and the average number named, as the number of components rises.',
 research:'Laing, D. G. & Francis, G. W. (1989). The capacity of humans to identify odors in mixtures. Physiology & Behavior 46, 809–814. Livermore & Laing (1996). Curves here follow the published pattern; the plotted values are illustrative.',
 dur:10,hint:'Slide the number of odours in the mixture.',
 init:()=>({n:3}),
 watch(p){return {n:1+Math.min(7,Math.floor(p*8))}},
 ui:[{range:'n',label:'Odours in the mixture',min:1,max:8,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=Number(v);return 'keep'}},
 draw(s){
  let out=heading('Adding odours, losing track of them');
  const pl=S5_plot(70,70,300,220,[1,8],[0,100],{xt:[1,2,3,4,5,6,7,8].map(v=>[v,String(v)]),yt:[[0,'0'],[50,'50%'],[100,'100%']],yl:'naming every component',xl:'odours in the mixture'});out+=pl.svg;
  out+=S5_poly(S5_ALL.map((v,i)=>[pl.X(i+1),pl.Y(v)]),C.blue,3)+Ci(pl.X(s.n),pl.Y(S5_ALL[s.n-1]),7,C.blue);
  out+=counter(400,90,'name all of them',S5_ALL[s.n-1]+'%',C.blue,170)+counter(400,150,'components named',S5_NAMED[s.n-1].toFixed(1)+' on average',C.green,170);
  out+=TF(485,232,'present: '+s.n,14,C.ink)+TF(485,254,'typical ceiling: 3 to 4',13,C.muted);
  return {svg:out,phase:'In vision we can list many objects in a scene; in smell, mixtures tend to fuse into a single impression. Chefs and perfumers train for years to pick out a few notes, and even they hit a ceiling of about three or four.'};
 }});

const S5_DIM=30;
const S5_VEC=(()=>{const r=S5_rng(303),a=[];for(let i=0;i<80;i++){const v=[];for(let d=0;d<S5_DIM;d++)v.push(Math.max(0,S5_gauss(r)));a.push(v)}return a})();
function S5_mixv(from,n){const m=new Array(S5_DIM).fill(0);for(let i=0;i<n;i++)S5_VEC[from+i].forEach((x,d)=>m[d]+=x/n);return m}
function S5_cos(a,b){let ab=0,aa=0,bb=0;for(let i=0;i<a.length;i++){ab+=a[i]*b[i];aa+=a[i]*a[i];bb+=b[i]*b[i]}return ab/Math.sqrt(aa*bb)}
const S5_SIM=(()=>{const a=[];for(let n=1;n<=40;n++)a.push(S5_cos(S5_mixv(0,n),S5_mixv(40,n)));return a})();
SCENE({id:'odour-mixtures-white',name:'Olfactory white',tag:'When every mixture smells alike',
 definition:'Mixtures of many odorants, spread across the range of smells and matched for intensity, start to smell alike even when they share no components. Researchers called this common smell “olfactory white”, by analogy with white light.',
 example:'Two mixtures of about 30 different odorants each, with no odorant in common, were judged nearly identical.',
 desc:'A model in which each odorant is a pattern across 30 receptor types: as two non-overlapping mixtures grow, their averaged patterns become more and more similar.',
 research:'Weiss, T. et al. (2012). Perceptual convergence of multi-component mixtures in olfaction implies an olfactory white. PNAS 109, 19959–19964. The receptor model is this page’s simplified illustration.',
 dur:10,hint:'Slide the number of odorants in each mixture. The two mixtures never share an odorant.',
 init:()=>({n:4}),
 watch(p){return {n:1+Math.round(smooth(p)*39)}},
 ui:[{range:'n',label:'Odorants in each mixture',min:1,max:40,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=Number(v);return 'keep'}},
 draw(s){
  let out=heading('Two mixtures with nothing in common');
  const pl=S5_plot(70,70,330,220,[1,40],[.4,1],{xt:[[1,'1'],[10,'10'],[20,'20'],[30,'30'],[40,'40']],yt:[[.4,'0.4'],[.7,'0.7'],[1,'1.0']],yl:'similarity of the two patterns',xl:'odorants in each mixture'});out+=pl.svg;
  out+=S5_poly(S5_SIM.map((v,i)=>[pl.X(i+1),pl.Y(v)]),C.blue,3);
  const v=S5_SIM[s.n-1];out+=Ci(pl.X(s.n),pl.Y(v),7,C.coral);
  out+=counter(420,90,'similarity',v.toFixed(2),C.coral,150);
  const A=S5_mixv(0,s.n),B=S5_mixv(40,s.n),mx=Math.max(...A,...B);
  out+=TF(495,170,'first 12 receptors',13,C.muted);
  for(let d=0;d<12;d++){const y=180+d*9;out+=R(430,y,60*A[d]/mx,7,C.blue,'none',2)+R(500,y,60*B[d]/mx,7,C.green,'none',2)}
  out+=TF(460,300,'mixture 1',13,C.blue)+TF(530,300,'mixture 2',13,C.green);
  return {svg:out,phase:'Averaging many patterns washes out what makes each one distinctive, so large mixtures converge on a common pattern. The receptor model here is a sketch, but it shows why Weiss and colleagues’ volunteers found 30-odorant mixtures hard to tell apart.'};
 },
 three(s,f,X,project){
  const Pj=project([[0,0,0],[2.6,2.6,2.6]]);let out=axes3(Pj,['receptor 1','receptor 2','receptor 3'],[2.6,2.6,2.6]);
  const items=[];for(let i=0;i<s.n;i++){const a=S5_VEC[i],b=S5_VEC[40+i];items.push({at:[a[0],a[1],a[2]],svg:P=>point3([a[0],a[1],a[2]],P,tint(C.blue,.45),4)});items.push({at:[b[0],b[1],b[2]],svg:P=>point3([b[0],b[1],b[2]],P,tint(C.green,.45),4)})}
  const A=S5_mixv(0,s.n),B=S5_mixv(40,s.n);items.push({at:A.slice(0,3),svg:P=>point3(A.slice(0,3),P,C.blue,9,'#fff')});items.push({at:B.slice(0,3),svg:P=>point3(B.slice(0,3),P,C.green,9,'#fff')});
  out+=sortedItems(items,Pj);
  return {svg:out,title:'Mixtures drift to the middle',caption:'Small dots are single odorants (blue for mixture 1, green for mixture 2) on three of the 30 receptor axes; large dots are the two mixtures. As each mixture gains odorants, both large dots move towards the same central point.'};
 }});

const S5_PAIRS=[['coffee','Coffee and orange peel'],['mint','Mint and vanilla'],['garlic','Garlic and lemon']];
const S5_OUT=[['both','I could name both'],['one','One smell dominated'],['blend','It smelled like something new'],['unsure','I could not tell']];
const S5_PAIRDIST={both:30,one:45,blend:15,unsure:10};
SCENE({id:'odour-mixtures-home',name:'Two smells at once',tag:'A kitchen mixture test',
 definition:'When two odours are smelled together, one often suppresses the other, or they fuse into an impression that is hard to split. You can try this at home with two everyday ingredients.',
 example:'Smell ground coffee, then orange peel, then hold both near your nose together. Many people find the coffee masks the orange.',
 desc:'A pair of household ingredients and the learner’s report, drawn beside an illustrative spread of typical reports.',
 research:'Laing & Francis (1989); Cain (1975). Odor intensity: mixtures and masking. Chemical Senses 1, 339–352. Thomas-Danguin et al. (2014) on blending. The comparison spread is illustrative.',
 dur:10,hint:'Choose a pair you have at home. Smell each one alone, then both together, and report what happened. Your answer stays in this page.',
 init:()=>({pair:'coffee',out:null}),
 watch(p){return {pair:'coffee',out:p>.45?'one':null,sim:true}},
 ui:[{choose:S5_PAIRS,label:'Pair',get:s=>s.pair,act:'pair'},{choose:S5_OUT,label:'Together',get:s=>s.out,act:'out'}],
 on:{pair(s,v){s.pair=v;return 'keep'},out(s,v){s.out=v;s.sim=false;return 'keep'}},
 draw(s){
  const pr=S5_PAIRS.find(q=>q[0]===s.pair);let out=heading(pr[1]+', alone and together');
  out+=Ci(170,110,40,C.amberp,C.amber)+Ci(250,110,40,C.greenp,C.green)+T(210,180,'smell each, then both',14,C.muted);
  out+=TF(420,72,'What people typically report',13,C.muted);
  S5_OUT.forEach((o,i)=>{const mine=s.out===o[0],y=84+i*42,v=S5_PAIRDIST[o[0]];out+=TF(330,y,o[1],13,mine?C.coral:C.ink,'start')+R(330,y+6,200,14,'#f1f5f7','none',4)+R(330,y+6,200*v/50,14,mine?C.coral:C.blue,'none',4)+TBF(330+200*v/50+6,y+18,v+'%',13,mine?C.coral:C.blue,'start')});
  out+=T(300,268,s.out===null?'Try the pair, then report what happened.':`${s.sim?'Simulated participant':'You'}: ${S5_OUT.find(q=>q[0]===s.out)[1].toLowerCase()}.`,16,s.out?C.coral:C.ink);
  out+=TF(300,300,'Shares are an illustration of typical answers, not measured data.',13,C.muted);
  return {svg:out,phase:'Mixtures often follow “the stronger one wins”, and some pairs fuse into a new impression, the way pineapple-like notes appear when certain esters are combined. That is why identifying each part of a mixture is so hard.'};
 }});

/* =========================== smell-memory =========================== */
const S5_cueCurve=(cue,a)=>{const g=(m,sd)=>Math.exp(-((a-m)**2)/(2*sd*sd));return cue==='odour'?100*g(8,4.5)+18*g(64,6):cue==='word'?100*g(18,6)+30*g(64,6):92*g(19,6.5)+28*g(64,6)};
SCENE({id:'smell-memory',name:'Smell and memory',tag:'Older memories',
 definition:'When older adults recall life memories prompted by a smell, the memories come mostly from early childhood. Words and pictures bring back memories mostly from adolescence and early adulthood.',
 example:'In studies of people in their 60s and 70s, smell-prompted memories peaked around age 6 to 10, word-prompted memories around 11 to 25.',
 desc:'The spread of the ages at which recalled memories happened, for memories prompted by smells, words or pictures.',
 research:'Willander, J. & Larsson, M. (2006). Smell your way back to childhood: autobiographical odor memory. Psychonomic Bulletin & Review 13, 240–244. Chu & Downes (2000). Curve shapes follow the published pattern; heights are illustrative.',
 dur:10,hint:'Choose the kind of cue to see when the memories it brings back come from.',
 init:()=>({cue:'odour'}),
 watch(p){return {cue:['odour','word','picture'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['odour','Smell'],['word','Word'],['picture','Picture']],label:'Memory cue',get:s=>s.cue,act:'cue'}],
 on:{cue(s,v){s.cue=v;return 'keep'}},
 draw(s){
  let out=heading('How old were you when it happened?');
  const pl=S5_plot(70,70,460,220,[0,70],[0,110],{xt:[[0,'0'],[10,'10'],[20,'20'],[30,'30'],[40,'40'],[50,'50'],[60,'60'],[70,'70 years']],yl:'memories recalled',xl:'age at the time of the memory'});out+=pl.svg;
  ['picture','word','odour'].forEach(c=>{const sel=c===s.cue,pts=[];for(let a=0;a<=70;a++)pts.push([pl.X(a),pl.Y(S5_cueCurve(c,a))]);out+=S5_poly(pts,sel?(c==='odour'?C.coral:C.blue):'#cbd8e0',sel?3.2:1.6)});
  const peak=s.cue==='odour'?8:s.cue==='word'?18:19;out+=L(pl.X(peak),pl.Y(0),pl.X(peak),pl.Y(105),C.muted,1.2,'stroke-dasharray="4 4"')+TF(pl.X(peak)+6,pl.Y(102),'peak ≈ '+peak,13,C.muted,'start');
  out+=T(300,352,s.cue==='odour'?'Smells reach back to early childhood.':'Words and pictures bring back adolescence and early adulthood.',16,s.cue==='odour'?C.coral:C.blue);
  return {svg:out,phase:'Older adults show a “reminiscence bump” of memories from youth. For smells it falls earlier, in the first decade of life. One idea is that many smells are first met, and linked to events, in childhood. This is a robust pattern across several studies.'};
 }});

const S5_EMO={emotional:{odour:78,picture:60,word:58},back:{odour:70,picture:52,word:50},vivid:{odour:58,picture:62,word:55},accurate:{odour:55,picture:57,word:56}};
SCENE({id:'smell-memory-emotion',name:'Emotional, not more accurate',tag:'The Proust effect, measured',
 definition:'Memories prompted by smells are usually rated as more emotional, and give more of a feeling of being taken back, than memories prompted by the same item seen or heard. They are not reliably more vivid or more accurate.',
 example:'In Herz’s studies, people recalled memories to the smell, the sight and the sound of the same things; the smell-prompted memories were the most emotional.',
 desc:'Ratings for memories cued by a smell, a picture or a word, on four qualities.',
 research:'Herz, R. S. (2004). A naturalistic analysis of autobiographical memories triggered by olfactory visual and auditory stimuli. Chemical Senses 29, 217–224. Herz & Schooler (2002). Bar heights follow the published pattern and are illustrative.',
 dur:10,hint:'Choose the quality to compare across cues.',
 init:()=>({q:'emotional'}),
 watch(p){return {q:['emotional','back','vivid','accurate'][Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:[['emotional','Emotional'],['back','Taken back'],['vivid','Vivid'],['accurate','Accurate']],label:'Quality',get:s=>s.q,act:'q'}],
 on:{q(s,v){s.q=v;return 'keep'}},
 draw(s){
  const d=S5_EMO[s.q];let out=heading('Memories cued by a smell, a picture or a word');
  const pl=S5_plot(140,70,320,210,[0,3],[0,100],{yt:[[0,'0'],[50,'50'],[100,'100']],yl:'rating (illustrative scale)'});out+=pl.svg;
  [['odour','smell',C.coral],['picture','picture',C.blue],['word','word',C.green]].forEach(([k,l,c],i)=>{const x=pl.X(i+.5)-34;out+=R(x,pl.Y(d[k]),68,pl.Y(0)-pl.Y(d[k]),c,'none',4)+TF(x+34,pl.Y(0)+18,l,13,C.ink)+TBF(x+34,pl.Y(d[k])-6,String(d[k]),13,c)});
  const big=s.q==='emotional'||s.q==='back';
  out+=T(300,338,big?'Smell-cued memories stand out here.':'Little difference here: smell does not make memories sharper or truer.',15,big?C.coral:C.ink);
  return {svg:out,phase:'The famous “Proust effect” holds in a limited form: smell-cued memories are more emotional and feel more like going back in time. Claims that they are clearer, more accurate or uniquely powerful go beyond the evidence.'};
 }});

const S5_CLAIMS=[
 {t:'Smell-cued memories feel more emotional than memories cued by sight or sound.',v:'supported',why:'Several studies by Herz and others find this, with moderate effects.'},
 {t:'Smell is the sense most strongly linked to memory.',v:'overstated',why:'Smells cue older, more emotional memories, but not stronger or more accurate memory overall.'},
 {t:'Newborn babies can recognise their own mother’s smell.',v:'supported',why:'Breastfed babies turn towards their mother’s breast pad within days (Macfarlane 1975; Porter and colleagues).'},
 {t:'Smell signals reach the cortex without passing through the thalamus first.',v:'supported',why:'The main route goes from the bulb to smell cortex directly, though some signals later loop through the thalamus.'},
 {t:'Once learned, a smell memory lasts forever.',v:'overstated',why:'Smell memories fade and are easily confused, like other memories; recognising a familiar smell is easier than naming it.'},
 {t:'People cannot imagine smells at all.',v:'overstated',why:'Many people report some ability to imagine smells, though it is weaker and more variable than visual imagery.'}];
SCENE({id:'smell-memory-claims',name:'Smell and memory claims',tag:'Supported or overstated?',
 definition:'Popular writing makes strong claims about smell and memory. Some are supported by research, some are true only in a weaker form.',
 example:'“Smell brings back emotional memories” is supported. “Smell is the strongest memory sense” is overstated.',
 desc:'Six claims, one at a time: the learner judges each as supported or overstated, then sees the evidence.',
 research:'Herz (2004); Willander & Larsson (2006); Macfarlane (1975). Parent–infant interaction, Ciba Foundation Symposium 33; Porter & Winberg (1999); Shepherd (2005); Arshamian & Larsson (2014) on odour imagery.',
 dur:12,hint:'Judge each claim, then press Next. Your answers stay in this page.',
 init:()=>({i:0,ans:{}}),
 watch(p){const i=Math.min(5,Math.floor(p*6)),ans={};for(let k=0;k<=i;k++)ans[k]=S5_CLAIMS[k].v;return {i,ans,sim:true}},
 ui:[{choose:[['supported','Supported'],['overstated','Overstated']],label:'Your verdict',get:s=>s.ans[s.i]||null,act:'v'},{b:'Next claim',act:'next'},{b:'Start again',act:'reset'}],
 on:{v(s,v){s.ans[s.i]=v;s.sim=false;return 'keep'},next(s){s.i=(s.i+1)%S5_CLAIMS.length;return 'keep'},reset(s){s.i=0;s.ans={};return 'keep'}},
 draw(s){
  const c=S5_CLAIMS[s.i],a=s.ans[s.i];let out=heading(`Claim ${s.i+1} of ${S5_CLAIMS.length}`);
  out+=R(50,54,500,90,C.pale,'none',10);S5_wrap(c.t,56).forEach((l,i)=>{out+=T(300,86+i*24,l,16,C.ink)});
  if(a){const ok=a===c.v;out+=TB(300,182,`${s.sim?'Simulated participant':'You'}: ${a}. Evidence: ${c.v}.`,16,ok?C.green:C.coral);S5_wrap(c.why,66).forEach((l,i)=>{out+=TF(300,212+i*20,l,13,C.ink)})}
  else out+=T(300,190,'Choose supported or overstated.',15,C.muted);
  const done=Object.keys(s.ans).length,right=Object.keys(s.ans).filter(k=>s.ans[k]===S5_CLAIMS[k].v).length;
  S5_CLAIMS.forEach((q,k)=>{const x=210+k*36,ans=s.ans[k];out+=Ci(x,316,11,ans?(ans===q.v?C.green:C.coral):'#fff',k===s.i?C.ink:C.line)});
  out+=TF(300,350,`${right} of ${done} answered so far match the evidence`,13,C.muted);
  return {svg:out,phase:'The anatomy is real and the emotional effect is real, but smell is not a magic key to memory. The safest summary: smells cue older, more emotional memories, and are surprisingly hard to name.'};
 }});

/* =========================== smell-loss =========================== */
const S5_REC=[[0,0],[30,74],[60,86],[90,90],[180,96]];
function S5_recAt(d){for(let i=1;i<S5_REC.length;i++){const [a,va]=S5_REC[i-1],[b,vb]=S5_REC[i];if(d<=b){const u=(d-a)/(b-a);return va+(vb-va)*(i===1?1-Math.pow(1-u,2):u)}}return 96}
SCENE({id:'smell-loss',name:'Losing smell',tag:'COVID-19 and recovery',
 definition:'Losing the sense of smell (anosmia) became widely known during the COVID-19 pandemic, when it was one of the commonest symptoms. The virus mainly affects support cells in the nose rather than the smell neurons themselves, which helps explain why most people recover.',
 example:'In a pooled analysis of thousands of patients, about three in four had recovered smell within a month and about 96 in 100 within six months, leaving roughly 1 in 20 with lasting loss.',
 desc:'The share of people who had lost smell with COVID-19 who had recovered it, against days since onset.',
 research:'Tan, B. K. J. et al. (2022). Prognosis and persistence of smell and taste dysfunction in patients with covid-19: meta-analysis with parametric cure modelling of recovery curves. BMJ 378, e069503. Brann et al. (2020) on support cells. Points are rounded; the curve between them is interpolated.',
 dur:10,hint:'Slide the days since smell was lost.',
 init:()=>({d:30}),
 watch(p){return {d:Math.round(p*180)}},
 ui:[{range:'d',label:'Days since onset',min:0,max:180,step:5,get:s=>s.d,act:'d',show:v=>v+' days'}],
 on:{d(s,v){s.d=Number(v);return 'keep'}},
 draw(s){
  let out=heading('How many have their sense of smell back?');
  const pl=S5_plot(70,70,320,220,[0,180],[0,100],{xt:[[0,'0'],[30,'30'],[60,'60'],[90,'90'],[180,'180 days']],yt:[[0,'0'],[50,'50%'],[100,'100%']],yl:'recovered',xl:'days since losing smell'});out+=pl.svg;
  const pts=[];for(let d=0;d<=180;d+=3)pts.push([pl.X(d),pl.Y(S5_recAt(d))]);out+=S5_poly(pts,C.blue,3);
  S5_REC.slice(1).forEach(([d,v])=>{out+=Ci(pl.X(d),pl.Y(v),5,'#fff',C.blue)});
  const v=S5_recAt(s.d);out+=Ci(pl.X(s.d),pl.Y(v),7,C.coral);
  const dots=Math.round(v/5);for(let i=0;i<20;i++){const x=430+(i%5)*28,y=96+Math.floor(i/5)*30;out+=Ci(x,y,10,i<dots?C.blue:'#e2e9ee')}
  out+=TF(486,236,`${Math.round(v)} in 100 recovered`,14,C.ink)+TF(486,256,'(each dot is 5 people)',13,C.muted);
  out+=T(300,350,s.d>=150?'About 1 in 20 still had lost or altered smell at six months.':'Most recovery happens in the first month or two.',15,C.ink);
  return {svg:out,phase:'Most smell loss with COVID-19 recovered within weeks. A minority, around 5%, still had problems months later, sometimes with distorted smells (parosmia) during recovery. Smell training is one of the few treatments with some evidence; see the next era.'};
 }});

SCENE({id:'smell-loss-parkinson',name:'An early warning',tag:'Smell and Parkinson’s disease',
 definition:'Reduced smell is one of the earliest signs of Parkinson’s disease, often appearing years before the movement symptoms that lead to diagnosis.',
 example:'Around 9 in 10 people with Parkinson’s have a reduced sense of smell when diagnosed. In a long-term study of older men, those with the poorest smell were several times more likely to be diagnosed within a few years.',
 desc:'A timeline before diagnosis showing when early signs of Parkinson’s disease typically begin, with a cursor for years before diagnosis.',
 research:'Doty, R. L. (2012). Olfactory dysfunction in Parkinson disease. Nature Reviews Neurology 8, 329–339. Ross, G. W. et al. (2008). Association of olfactory dysfunction with risk for future Parkinson’s disease. Annals of Neurology 63, 167–173. Time ranges are typical and approximate.',
 dur:10,hint:'Slide back in time before a diagnosis to see which early signs are often already present.',
 init:()=>({y:-8}),
 watch(p){return {y:Math.round(-20+p*20)}},
 ui:[{range:'y',label:'Years from diagnosis',min:-20,max:0,get:s=>s.y,act:'y',show:v=>v===0?'diagnosis':-v+' years before'}],
 on:{y(s,v){s.y=Number(v);return 'keep'}},
 draw(s){
  let out=heading('Signs that can come before diagnosis');
  const pl=S5_plot(200,62,360,210,[-20,0],[0,4],{xt:[[-20,'−20'],[-15,'−15'],[-10,'−10'],[-5,'−5'],[0,'0']],xl:'years from diagnosis'});out+=pl.svg;
  const rows=[['Constipation',-20,C.amber],['Acting out dreams in sleep',-15,C.purple],['Reduced smell',-10,C.coral],['Tremor, stiffness, slowness',-2,C.blue]];
  rows.forEach(([n,st,c],i)=>{const y=pl.Y(3.5-i);out+=TF(190,y+5,n,13,C.ink,'end')+R(pl.X(st),y-9,pl.X(0)-pl.X(st),18,tint(c,.5),'none',4);if(s.y>=st)out+=R(pl.X(st),y-9,pl.X(s.y)-pl.X(st),18,c,'none',4)});
  out+=L(pl.X(s.y),62,pl.X(s.y),272,C.ink,1.6,'stroke-dasharray="4 4"');
  out+=TF(300,318,'Most people with poor smell never develop Parkinson’s: it is a clue, not a test.',13,C.coral);
  out+=TF(300,340,'Bars show typical, approximate onset ranges; they vary widely between people.',13,C.muted);
  return {svg:out,phase:'The disease process seems to reach smell pathways early, years before it affects movement. Smell testing is being studied as part of early detection, combined with other signs, because on its own it would flag far more people than will ever develop the disease.'};
 }});

const S5_LIVE={
 congenital:{name:'Born without smell',lines:['About 1 person in 10,000 is born unable to smell.','Many do not realise until childhood.','Safety: rely on smoke and gas alarms and use-by dates.','Food is enjoyed for taste, texture and temperature.']},
 postviral:{name:'Lost after an infection',lines:['The commonest cause in adults, alongside head injury and ageing.','Many recover over months; some do not.','Smell training has modest evidence of helping.','Loss can affect appetite, mood and closeness to others.']},
 parosmia:{name:'Distorted smells (parosmia)',lines:['Familiar things smell wrong, often foul.','Coffee, onions, meat and toothpaste are common triggers.','Often appears during recovery and can slowly settle.','Eating can become hard; support groups help.']},
 phantosmia:{name:'Phantom smells (phantosmia)',lines:['Smelling something that is not there, often burning.','Can follow infection or injury.','Occasionally a sign of another condition.','Worth reporting to a doctor if it persists.']}};
SCENE({id:'smell-loss-living',name:'Living without smell',tag:'What changes',
 definition:'Losing or never having a sense of smell affects safety, eating and mood, and is often underestimated. Some people lose smell entirely (anosmia), some partly, and some experience distorted or phantom smells.',
 example:'People with anosmia describe missing the smell of loved ones and of home, as well as practical worries such as not noticing smoke or spoiled food.',
 desc:'Cards describing four kinds of smell disorder: what they are and what helps.',
 research:'Hummel, T. et al. (2017). Position paper on olfactory dysfunction. Rhinology 54 (Suppl. 26), 1–30. Croy, Nordin & Hummel (2014). Olfactory disorders and quality of life: an updated review. Chemical Senses 39, 185–194. Prevalence is approximate.',
 dur:10,hint:'Choose a condition to read about it.',
 init:()=>({c:'congenital'}),
 watch(p){return {c:Object.keys(S5_LIVE)[Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:Object.keys(S5_LIVE).map(k=>[k,S5_LIVE[k].name.split(' (')[0]]),label:'Condition',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=v;return 'keep'}},
 draw(s){
  const o=S5_LIVE[s.c];let out=heading(o.name);
  o.lines.forEach((l,i)=>{const y=62+i*66;out+=R(80,y,440,54,i%2?'#fff':C.pale,C.grid,10)+Ci(108,y+27,8,C.blue);S5_wrap(l,52).forEach((t,j)=>{out+=TF(128,y+(S5_wrap(l,52).length>1?22:32)+j*19,t,13,C.ink,'start')})});
  out+=TF(300,342,'Fifth Sense and AbScent are charities that support people with smell loss.',13,C.muted);
  return {svg:out,phase:'Smell disorders are common, especially with age, yet often go unnoticed by others. Practical steps (alarms, date labels, cooking with texture and spice) and peer support make a real difference.'};
 }});
