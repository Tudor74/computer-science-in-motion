/* =====================================================================
 Consciousness era 3 · Neural correlates: the search for the brain activity that goes with experience.
 The programme (Crick & Koch), the contrastive method and its report confound, ignition and the P3b,
 recurrent processing, the front-or-back debate, and zap-and-zip (the perturbational complexity index).
 Nothing here is settled: every theory scene says what it predicts and what counts against it, and every
 model is a toy or a schematic and is labelled so in the picture. Safety: nothing flashes; timed updates
 run at 350 ms or slower (under 3 per second) and only move a marker or reveal a column. Sound: two soft
 clicks, only from on handlers.
 ===================================================================== */

const K3_poly=(pts,col,w=2.5,extra='')=>P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra);
// Axes: returns {svg,X,Y}. o: {xt:[[v,label]],yt,xl,yl}.
function K3_axes(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let out=L(x0,y0+h,x0+w,y0+h,C.line,2)+L(x0,y0,x0,y0+h,C.line,2);
 (o.xt||[]).forEach(([v,l])=>out+=L(X(v),y0+h,X(v),y0+h+5,C.line,1.5)+TF(X(v),y0+h+19,l,13,C.muted));
 (o.yt||[]).forEach(([v,l])=>out+=L(x0-5,Y(v),x0,Y(v),C.line,1.5)+TF(x0-8,Y(v)+4,l,13,C.muted,'end'));
 if(o.xl)out+=TF(x0+w/2,y0+h+37,o.xl,13,C.muted);
 if(o.yl)out+=TF(x0-4,y0-9,o.yl,13,C.muted,'start');
 return {svg:out,X,Y};
}
// Word wrap for diagram text: lines of at most max characters.
function K3_wrap(s,max){const out=[];let cur='';for(const w of String(s).split(' ')){if(cur&&(cur+' '+w).length>max){out.push(cur);cur=w}else cur=cur?cur+' '+w:w}if(cur)out.push(cur);return out}
const K3_lines=(x,y,s,max,size=14,fill=C.ink,lh=21,fn=T,anchor='middle')=>K3_wrap(s,max).map((l,i)=>fn(x,y+i*lh,l,size,fill,anchor)).join('');
// A seeded hash in [0,1) for repeatable noise.
const K3_h=(i,seed)=>{let x=(i*2654435761+seed*97+1013904223)>>>0;x^=x>>>13;x=Math.imul(x,1274126177)>>>0;x^=x>>>16;return (x>>>0)/4294967296};
const K3_gauss=(t,mu,sd)=>Math.exp(-(t-mu)*(t-mu)/(2*sd*sd));
// Standard normal cumulative distribution (Abramowitz & Stegun 26.2.17).
function K3_phi(z){const t=1/(1+.2316419*Math.abs(z)),d=.3989423*Math.exp(-z*z/2),q=d*t*(.3193815+t*(-.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return z>=0?1-q:q}
// A pill showing yes or no.
const K3_pill=(x,y,yes,w=70)=>R(x,y,w,24,yes?C.greenp:C.coralp,yes?C.green:C.coral,12)+TBF(x+w/2,y+17,yes?'yes':'no',13,yes?C.green:C.coral);
// A side view of the brain (front on the left), drawn in a 300×200 box at (ox,oy) scaled by k. inner is extra
// svg in the same local coordinates, clipped to the cortex when clip is true.
const K3_CORTEX='M40 120C30 60 90 20 160 20C230 20 285 60 285 115C285 150 262 170 232 168C222 168 214 164 208 158C196 176 170 182 150 172C140 168 134 160 132 152C96 160 46 156 40 120Z';
function K3_brain(ox,oy,k,id,clipped='',over=''){
 return `<g transform="translate(${fmt(ox)},${fmt(oy)}) scale(${k})"><clipPath id="${id}"><path d="${K3_CORTEX}"/></clipPath>`+
  `<path d="M168 168L186 204L206 204L196 160Z" fill="#e7edf1" stroke="${C.line}" stroke-width="2"/><ellipse cx="238" cy="176" rx="34" ry="19" fill="#e7edf1" stroke="${C.line}" stroke-width="2"/>`+
  `<path d="${K3_CORTEX}" fill="#f6f9fb" stroke="${C.line}" stroke-width="2.5"/><g clip-path="url(#${id})">${clipped}</g>`+
  `<path d="M150 26C146 60 150 96 138 150" fill="none" stroke="${C.grid}" stroke-width="2"/><path d="M60 140C110 128 160 132 205 150" fill="none" stroke="${C.grid}" stroke-width="2"/>${over}</g>`;
}
// A card-sorting exercise shared by two scenes. cfg: {title, items:[{t,a,why}], cats:[[key,label,colour,pale]], ask, end}.
function K3_cards(cfg){
 const n=cfg.items.length,name=k=>cfg.cats.find(c=>c[0]===k)[1];
 return {
  init:()=>({i:0,ans:{}}),
  watch(p){const k=Math.min(n-1,Math.floor(p*n)),u=p*n-k,ans={};for(let j=0;j<k;j++)ans[j]=cfg.items[j].a;if(u>.4||p>=1)ans[k]=cfg.items[k].a;return {i:k,ans,sim:true}},
  ui:cfg.cats.map(c=>({b:c[1],act:'ans',arg:c[0]})).concat([{b:'Next',act:'next'},{b:'Start again',act:'reset'}]),
  on:{ans(s,v){if(s.ans[s.i]===undefined)s.ans[s.i]=v;return 'keep'},next(s){if(s.ans[s.i]!==undefined&&s.i<n-1)s.i++;return 'keep'},reset(s){s.i=0;s.ans={};return 'keep'}},
  draw(s,f,X){
   const it=cfg.items[s.i],a=s.ans[s.i],done=Object.keys(s.ans).length,right=cfg.items.filter((q,j)=>s.ans[j]===q.a).length;
   let out=heading(cfg.title);
   for(let j=0;j<n;j++){const x=300+(j-(n-1)/2)*26,aj=s.ans[j];out+=Ci(x,50,7,aj===undefined?'#fff':aj===cfg.items[j].a?C.green:C.amber,j===s.i?C.ink:C.line)}
   out+=R(40,66,520,92,'#fff',C.grid,10)+K3_lines(300,94,it.t,50,15,C.ink,23);
   cfg.cats.forEach((c,j)=>{const x=40+j*180,isA=a!==undefined&&c[0]===it.a,picked=a===c[0];
    out+=hit(X,'ans',c[0],'Sort as: '+c[1],R(x,172,160,40,isA?c[3]:'#fff',picked&&!isA?C.coral:isA?c[2]:C.line,10)+TB(x+80,198,c[1],14,isA?c[2]:C.ink))});
   if(a!==undefined){
    out+=TB(300,242,(s.sim?'Simulated learner: ':a===it.a?'You agree: ':'You chose '+name(a).toLowerCase()+'. Usual answer: ')+name(it.a).toLowerCase(),14,a===it.a?C.green:C.amber);
    out+=K3_lines(300,266,it.why,56,14,C.ink,21);
   }else out+=T(300,254,cfg.ask,14,C.muted);
   out+=TF(300,350,`${done} of ${n} sorted · ${right} agree with the published argument`,13,C.muted);
   if(done===n)out+=TF(300,370,cfg.end,13,C.ink);
   return {svg:out,phase:a===undefined?cfg.ask+' There is room for argument on some of these, and the scene says where.':it.why+(s.i<n-1?' Press Next for another.':' '+cfg.end)};
  }};
}

/* =========================== ncc-search =========================== */
const K3_PARTS=[['stem','Brainstem arousal'],['eye','Retina'],['face','Face-area activity'],['mem','Hippocampus (memory)'],['motor','Motor cortex (report)'],['cer','Cerebellum']];
const K3_PARTWHY={
 stem:'Without the brainstem’s arousal systems there is no experience of anything. They are a background condition for every experience, so they are not counted as the correlate of this one.',
 eye:'The retina can be silent while a face is still experienced, as in a dream or in vivid imagery. So activity in the retina is not part of the minimal set.',
 face:'In this schematic, switching off the face-selective activity removes the experience of the face and leaves the rest of experience in place. That makes it the candidate content-specific correlate.',
 mem:'People who can no longer form new memories after damage to both hippocampi are still plainly conscious. Storing the memory is a consequence of the experience, not part of its correlate.',
 motor:'Pressing a button reports the experience. It comes afterwards and can be left out.',
 cer:'The cerebellum holds about 69 billion of the brain’s roughly 86 billion neurons, yet people with extensive cerebellar damage remain conscious. Neuron count alone does not make a correlate.'};
SCENE({id:'ncc-search',name:'The minimal sufficient activity',tag:'What a correlate is, and is not',
 definition:'In 1990 Francis Crick and Christof Koch proposed setting the philosophy aside and asking an experimental question: which brain activity goes with a given experience? David Chalmers later gave the standard definition: a neural correlate of consciousness (NCC) is the minimal neural activity that is jointly sufficient for a specific experience. A correlate is not yet a cause, and it is not an explanation of why the activity is felt.',
 example:'When someone sees a face, the retina, visual cortex, memory systems, motor cortex and brainstem are all active. Much of that can be removed, in principle, while the face is still experienced. What cannot be removed is the candidate correlate, together with background conditions such as arousal.',
 desc:'Six kinds of brain activity present while a person sees a face, each of which can be switched off, and a panel showing whether the experience of the face remains in this schematic.',
 research:['Crick, F. & Koch, C. (1990). Towards a neurobiological theory of consciousness. Seminars in the Neurosciences 2, 263–275.','Chalmers, D. J. (2000). What is a neural correlate of consciousness? In T. Metzinger (ed.), Neural Correlates of Consciousness. MIT Press.','Koch, C., Massimini, M., Boly, M. & Tononi, G. (2016), on content-specific correlates and background conditions.','Azevedo, F. A. C. et al. (2009), neuron counts. The switches are a thought experiment, not data.'],
 dur:12,hint:'Switch activity off one piece at a time and see whether the face is still experienced. Try to find the smallest set that is enough.',
 init:()=>({on:{stem:1,eye:1,face:1,mem:1,motor:1,cer:1},last:''}),
 watch(p){const order=['motor','mem','cer','eye','face'],k=Math.min(6,Math.floor(p*7)),on={stem:1,eye:1,face:1,mem:1,motor:1,cer:1};order.slice(0,Math.min(k,5)).forEach(q=>on[q]=0);if(k===6){on.face=1;on.stem=0}return {on,last:k===0?'':k===6?'stem':order[Math.min(k,5)-1]}},
 ui:[{b:'Switch everything on',act:'all'},{b:'Keep only the minimum',act:'min'}],
 on:{tog(s,k){s.on[k]=s.on[k]?0:1;s.last=k;return 'keep'},all(s){for(const [k] of K3_PARTS)s.on[k]=1;s.last='';return 'keep'},min(s){for(const [k] of K3_PARTS)s.on[k]=k==='stem'||k==='face'?1:0;s.last='';return 'keep'}},
 draw(s,f,X){
  const awake=!!s.on.stem,exp=awake&&!!s.on.face,n=K3_PARTS.filter(([k])=>s.on[k]).length;
  let out=heading('Seeing a face: what can be switched off?');
  K3_PARTS.forEach(([k,lab],i)=>{const y=50+i*46,on=!!s.on[k];
   out+=hit(X,'tog',k,`${lab}: ${on?'on':'off'}. Press to switch.`,R(20,y,262,38,on?C.pale:'#fff',on?C.blue:C.line,10)+Ci(46,y+19,9,on?C.blue:'#fff',on?C.blue:C.line)+T(64,y+24,lab,14,on?C.ink:C.muted,'start'))});
  out+=R(300,50,280,266,'#fff',C.grid,10)+TB(440,76,'Is the face experienced?',15,C.ink);
  const fx=440,fy=150;
  if(exp)out+=Ci(fx,fy,46,C.amberp,C.amber)+Ci(fx-16,fy-12,5,C.ink)+Ci(fx+16,fy-12,5,C.ink)+P(`M${fx-20} ${fy+14}Q${fx} ${fy+32} ${fx+20} ${fy+14}`,C.ink,3);
  else if(awake)out+=Ci(fx,fy,46,'#fff',C.line,'stroke-dasharray="6 6"')+TB(fx,fy+9,'?',28,C.muted);
  else out+=Ci(fx,fy,46,'#dfe6ea',C.line);
  out+=TB(440,228,exp?'Yes':awake?'Awake, but no face seen':'No experience at all',15,exp?C.green:C.coral);
  out+=counter(350,246,'activity still switched on',`${n} of 6`,C.blue,180);
  if(exp&&n===2)out+=TB(440,340,'This is the minimum',14,C.green);
  else if(exp)out+=T(440,340,'Can more be removed?',14,C.muted);
  out+=TF(300,370,'Schematic thought experiment, not data',13,C.muted);
  const tail=exp&&n===2?' What is left is the candidate correlate for the face, plus the background condition of being awake.':'';
  return {svg:out,phase:(s.last?K3_PARTWHY[s.last]:'Everything is switched on and the face is experienced. A correlate is whatever is left when everything that can be removed has been removed.')+tail};
 }});

SCENE({id:'ncc-search-forty',name:'The 40 Hz proposal',tag:'A bold first guess, later played down',
 definition:'Crick and Koch’s first concrete proposal was that neurons responding to one object fire in step, about 40 times a second, and that this synchrony binds the object’s features together and goes with visual awareness. It built on recordings by Charles Gray and Wolf Singer. The authors themselves later played it down: synchrony also turned out to depend on attention and stimulus properties, and by 2003 they wrote that they no longer thought it sufficient.',
 example:'At 40 Hz one cycle lasts 25 ms. Two groups of cells whose peaks fall within a millisecond or two of each other count as synchronised; shift one group by half a cycle, 12.5 ms, and they are exactly out of step.',
 desc:'Two rhythmic traces standing for two groups of neurons, with sliders for the rhythm’s frequency and the timing offset between the groups, and read-outs of cycle length, offset in milliseconds and a synchrony score.',
 research:['Gray, C. M., König, P., Engel, A. K. & Singer, W. (1989). Oscillatory responses in cat visual cortex exhibit inter-columnar synchronization which reflects global stimulus properties. Nature 338, 334–337.','Crick, F. & Koch, C. (1990), as above.','Crick, F. & Koch, C. (2003). A framework for consciousness. Nature Neuroscience 6, 119–126: synchrony no longer held to be sufficient. Status: the oscillations are real; their role as the correlate is not supported.'],
 dur:10,hint:'Slide the timing offset to bring the two groups into step, then change the frequency and watch the cycle length.',
 init:()=>({f:40,lag:.25}),
 watch(p){return {f:40,lag:Math.round(lerp(.5,0,smooth(p))*20)/20}},
 ui:[{range:'f',label:'Rhythm',min:20,max:80,step:5,get:s=>s.f,act:'f',show:v=>v+' Hz'},{range:'lag',label:'Timing offset between the groups',min:0,max:.5,step:.05,get:s=>s.lag,act:'lag',show:v=>Math.round(v*100)+'% of a cycle'}],
 on:{f(s,v){s.f=Number(v);return 'keep'},lag(s,v){s.lag=Number(v);return 'keep'}},
 draw(s){
  const per=1000/s.f,off=s.lag*per,sync=Math.cos(2*Math.PI*s.lag),x0=70,w=470,X=t=>x0+t/100*w;
  let out=heading('Two groups of neurons, one rhythm');
  const tr=(yc,ph,col)=>{const pts=[];for(let t=0;t<=100;t+=.5)pts.push([X(t),yc-24*Math.cos(2*Math.PI*(t/per-ph))]);return K3_poly(pts,col,2.5)};
  for(let k=0;k*per<=100;k++)out+=L(X(k*per),58,X(k*per),196,C.grid,1.5,'stroke-dasharray="4 4"');
  out+=tr(88,0,C.blue)+tr(166,s.lag,C.coral)+TBF(x0-10,93,'A',15,C.blue,'end')+TBF(x0-10,171,'B',15,C.coral,'end');
  for(let k=0;k*per<=100;k++)out+=Ci(X(k*per),64,4,C.blue);
  for(let k=0;(k+s.lag)*per<=100;k++)out+=Ci(X((k+s.lag)*per),142,4,C.coral);
  out+=L(x0,202,x0+w,202,C.line,2)+[0,25,50,75,100].map(t=>TF(X(t),220,t+' ms',13,C.muted)).join('');
  out+=counter(70,234,'one cycle',per.toFixed(1)+' ms',C.ink,140)+counter(230,234,'peaks apart',off.toFixed(1)+' ms',C.ink,140)+counter(390,234,'synchrony',sync.toFixed(2),sync>.8?C.green:sync<-.8?C.coral:C.amber,150);
  out+=TF(300,308,'1989  Gray & Singer: cells in cat visual cortex fire in step',13,C.muted)+TF(300,330,'1990  Crick & Koch: could this synchrony be the correlate?',13,C.ink)+TF(300,352,'2003  Crick & Koch: no longer think it is sufficient',13,C.coral);
  return {svg:out,phase:sync>.8?`At ${s.f} Hz a cycle lasts ${per.toFixed(1)} ms, and the two groups peak ${off.toFixed(1)} ms apart: in step. Crick and Koch proposed that such synchrony marks the features of one seen object. The proposal started the search; it did not survive as the answer.`:`At ${s.f} Hz a cycle lasts ${per.toFixed(1)} ms and the groups peak ${off.toFixed(1)} ms apart, a synchrony score of ${sync.toFixed(2)} (1 is perfectly in step, −1 exactly out of step). The score here is simply the cosine of the offset.`};
 }});

const K3_SORT={title:'Before, during or after the experience?',
 cats:[['pre','Prerequisite',C.blue,C.pale],['cor','Correlate',C.purple,C.purplep],['con','Consequence',C.amber,C.amberp]],
 ask:'Where does this signal belong: before, with, or after the experience?',
 end:'A plain seen-minus-unseen contrast picks up all three kinds at once.',
 items:[
  {t:'Attention is drawn to the right place just before the stimulus appears.',a:'pre',why:'It makes seeing more likely, but it comes before the experience and also happens on trials where nothing is then seen.'},
  {t:'Motor cortex prepares the finger that will press the “seen” button.',a:'con',why:'Reporting follows the experience. The same experience without a report would lack this activity.'},
  {t:'Activity in visual cortex follows which of two images is seen while the stimulus stays the same and no report is asked for.',a:'cor',why:'It changes with the experience when the stimulus and the task do not: the profile of a candidate correlate, though still only a candidate.'},
  {t:'The brain’s ongoing rhythm in the instant before the stimulus predicts whether it will be seen.',a:'pre',why:'Busch and colleagues (2009) and Mathewson and colleagues (2009) found this. It sets the stage for the experience; it is not the experience.'},
  {t:'The item that was seen is held in working memory for the next ten seconds.',a:'con',why:'Holding it in mind comes after seeing it. Whether brief memory is separable from experience is itself argued over.'},
  {t:'Arousal systems in the brainstem keep the cortex in its waking state.',a:'pre',why:'A background condition for any experience at all, not specific to this one.'}]};
SCENE({id:'ncc-search-sorting',name:'Prerequisite, correlate or consequence',tag:'You take part: sort six signals',
 definition:'Brain activity that differs between seen and unseen trials is of three kinds. Prerequisites come before the experience and make it possible or more likely. Consequences follow it: remembering, deciding, reporting. Only what is left in between is a candidate for the correlate itself. Jaan Aru, Talis Bachmann, Wolf Singer and Lucia Melloni set out this three-way split in 2012.',
 example:'On trials where a faint patch is seen, attention was often already on the right spot (a prerequisite) and a finger then presses a button (a consequence). Both show up in a seen-minus-unseen contrast, and neither is the experience.',
 desc:'Six descriptions of brain signals shown one at a time; the learner sorts each as prerequisite, correlate or consequence and reads the published reasoning.',
 research:['Aru, J., Bachmann, T., Singer, W. & Melloni, L. (2012). Distilling the neural correlates of consciousness. Neuroscience & Biobehavioral Reviews 36, 737–746.','de Graaf, T. A., Hsieh, P.-J. & Sack, A. T. (2012). The ‘correlates’ in neural correlates of consciousness. Neuroscience & Biobehavioral Reviews 36, 191–197.','Busch, N. A., Dubois, J. & VanRullen, R. (2009); Mathewson, K. E. et al. (2009), on activity before the stimulus. Status: the three-way split is widely accepted; where a given signal belongs is often argued.'],
 dur:14,hint:'Read the signal, then press one of the three boxes. Your answers stay on this page.',
 ...K3_cards(K3_SORT)});

/* =========================== contrastive-method =========================== */
const K3_CREG=['early visual','higher visual','parietal and frontal'];
const K3_CMEAN={seen:[1,1,.9],unseen:[.95,.6,.2]};
function K3_ctrials(seed,n){const r=rng(seed),out=[];for(let k=0;k<n;k++){const seen=r()<.5,m=K3_CMEAN[seen?'seen':'unseen'];out.push({seen,v:m.map(x=>x+(r()+r()+r()-1.5)*.5)})}return out}
const K3_CPAR={mask:['Masking','Same word, same mask; a slightly longer gap','lets the word be seen on some trials.'],riv:['Rivalry','Same two images, one to each eye;','the image that is seen alternates.'],thr:['Threshold','Same faint patch every trial;','it is seen on about half of them.']};
SCENE({id:'contrastive-method',name:'Contrastive analysis',tag:'Same stimulus, different experience',
 definition:'Bernard Baars proposed treating consciousness as a variable in an experiment. Hold the stimulus as constant as possible, find conditions in which it is sometimes experienced and sometimes not, and compare the brain activity. Masking, binocular rivalry and stimuli at the threshold of detection all supply such pairs.',
 example:'A faint patch at threshold is seen on about half of the trials. Averaging brain responses over the seen trials and over the unseen trials, then subtracting, removes whatever the stimulus alone produces and leaves what differs with the experience.',
 desc:'A sketch of the chosen paradigm beside bars for average activity in three brain regions on seen and on unseen trials of a simulated participant, with the seen-minus-unseen difference under each pair.',
 research:['Baars, B. J. (1988). A Cognitive Theory of Consciousness. Cambridge University Press.','Dehaene, S. et al. (2001). Cerebral mechanisms of word masking and unconscious repetition priming. Nature Neuroscience 4, 752–758: masked words gave weak, local activity; visible words gave amplified and widespread activity.','The numbers here are schematic, chosen to show that pattern. Status: the method is standard; what the difference means is contested (next scene).'],
 dur:12,hint:'Choose a paradigm, then run trials on the simulated participant. Watch the difference settle as trials add up.',
 init:()=>({mode:'thr',n:0,seed:7}),
 watch(p){return {mode:p<.34?'mask':p<.67?'riv':'thr',n:Math.floor(p*48),seed:7,sim:true}},
 ui:[{choose:[['mask','Masking'],['riv','Rivalry'],['thr','Threshold']],label:'Paradigm',get:s=>s.mode,act:'mode'},{b:'Run 8 trials',act:'run'},{b:'Clear',act:'clear'}],
 on:{mode(s,v){s.mode=v;return 'keep'},run(s){if(s.n===0)s.seed=nextSeed();s.n=Math.min(96,s.n+8);return 'keep'},clear(s){s.n=0;return 'keep'}},
 draw(s){
  const tr=K3_ctrials(s.seed,s.n),se=tr.filter(t=>t.seen),un=tr.filter(t=>!t.seen),mean=(a,i)=>a.length?sum(a.map(t=>t.v[i]))/a.length:null,par=K3_CPAR[s.mode];
  let out=heading('Contrast: '+par[0].toLowerCase()+' (simulated participant)');
  out+=R(20,50,190,150,'#fff',C.grid,10);
  if(s.mode==='mask')out+=R(40,80,60,50,'#f3f6f8',C.line,6)+TB(70,113,'salt',15,C.ink)+arrow(104,105,126,105,C.muted,2)+R(130,80,60,50,'#f3f6f8',C.line,6)+TB(160,113,'#&#&',15,C.muted)+TF(70,150,'word',13,C.muted)+TF(160,150,'mask',13,C.muted);
  if(s.mode==='riv')out+=Ci(75,108,30,C.pale,C.blue)+[-12,0,12].map(d=>L(75+d-10,88,75+d+10,128,C.blue,2)).join('')+Ci(155,108,30,C.coralp,C.coral)+[-12,0,12].map(d=>L(155+d+10,88,155+d-10,128,C.coral,2)).join('')+TF(75,158,'left eye',13,C.muted)+TF(155,158,'right eye',13,C.muted);
  if(s.mode==='thr')out+=R(55,70,120,76,'#eef1f3',C.line,6)+Ci(115,108,20,'#e3e7ea')+TF(115,164,'a faint patch',13,C.muted);
  out+=TF(115,186,'held constant',13,C.muted);
  out+=K3_lines(115,224,par[1]+' '+par[2],26,13,C.ink,18,TF);
  const base=250,sc=120;out+=L(240,base,580,base,C.line,2);
  K3_CREG.forEach((nm,i)=>{const x=260+i*108,a=mean(se,i),b=mean(un,i);
   if(a!==null)out+=R(x,base-a*sc,36,a*sc,C.blue,'none',4);
   if(b!==null)out+=R(x+40,base-b*sc,36,b*sc,'#a9bcc8','none',4);
   out+=K3_lines(x+38,base+18,nm,13,13,C.muted,16,TF);
   if(a!==null&&b!==null)out+=TBF(x+38,base+56,'difference '+(a-b>=0?'+':'−')+Math.abs(a-b).toFixed(2),13,a-b>.25?C.purple:C.muted)});
  out+=R(250,58,14,14,C.blue,'none',3)+TF(270,70,`seen: ${se.length} trials`,13,C.ink,'start')+R(410,58,14,14,'#a9bcc8','none',3)+TF(430,70,`unseen: ${un.length} trials`,13,C.ink,'start');
  out+=TF(300,346,'Schematic activity in arbitrary units; true differences +0.05, +0.40, +0.70.',13,C.muted);
  out+=TF(300,368,s.n?'More trials bring the measured differences closer to the true ones.':'Run some trials to build the two averages.',13,C.muted);
  return {svg:out,phase:s.n===0?`${par[0]}: ${par[1].toLowerCase()} ${par[2]} The stimulus is held constant, so whatever differs between seen and unseen trials is not caused by the stimulus alone.`:`After ${s.n} trials (${se.length} seen, ${un.length} unseen) early visual activity is almost the same either way, so it cancels in the subtraction. The later regions differ. That difference is the starting point of the search, not its end: it may hold prerequisites and consequences as well as the correlate.`};
 }});

const K3_RREG=[['Visual cortex (back)',.8,0,0,false],['Parietal cortex',.3,.25,.15,true],['Prefrontal cortex',.15,.5,.25,true],['Motor cortex',0,.8,0,false]];
SCENE({id:'contrastive-method-report',name:'The report confound',tag:'Seeing it, or saying so?',
 definition:'In a standard contrast the participant reports on every trial, so seen trials differ from unseen ones in two ways: the experience, and everything involved in deciding and reporting it. No-report paradigms remove the report and infer the experience some other way. Ned Block has pointed out that removing the report does not stop people thinking about what they saw.',
 example:'With a button press on every trial, the seen-minus-unseen difference includes motor cortex. Remove the button press and that part vanishes, along with much of the prefrontal difference. Whether any prefrontal difference is left is the disputed point.',
 desc:'Horizontal bars for the seen-minus-unseen difference in four brain regions, each divided into a part that goes with the experience, a part due to deciding and reporting, and a part due to further thought; two switches remove the report and the further thought.',
 research:['Aru, J. et al. (2012), as above.','Tsuchiya, N., Wilke, M., Frässle, S. & Lamme, V. A. F. (2015). No-report paradigms: extracting the true neural correlates of consciousness. Trends in Cognitive Sciences 19, 757–770.','Block, N. (2019). What is wrong with the no-report paradigm and how to fix it. Trends in Cognitive Sciences 23, 1003–1013.','The bar sizes are schematic. Status: that report adds activity is robust; how much frontal activity remains without it is contested.'],
 dur:12,hint:'Switch the report off and see which parts of the contrast drop out. Then switch off further thought as well.',
 init:()=>({report:true,think:true}),
 watch(p){return {report:p<.34,think:p<.67}},
 ui:[{choose:[[true,'Report every trial'],[false,'No report']],label:'Task',get:s=>s.report,act:'report'},{choose:[[true,'Free to think about it'],[false,'Kept from thinking about it']],label:'Afterwards',get:s=>s.think,act:'think'}],
 on:{report(s,v){s.report=v===true||v==='true';return 'keep'},think(s,v){s.think=v===true||v==='true';return 'keep'}},
 draw(s){
  let out=heading('What is in the seen-minus-unseen contrast?');const x0=200,sc=360;
  K3_RREG.forEach(([nm,e,r,t,q],i)=>{const y=62+i*52;let x=x0;
   out+=TF(x0-10,y+18,nm,13,C.ink,'end');
   if(e>0){out+=R(x,y,e*sc,26,q?'#cdbfe6':C.purple,'none',4);if(q)out+=TBF(x+e*sc/2,y+18,'?',14,C.purple);x+=e*sc}
   if(r>0){out+=s.report?R(x,y,r*sc,26,C.amber,'none',4):R(x,y,r*sc,26,'#fff',C.line,4,'stroke-dasharray="5 4"');x+=r*sc}
   if(t>0){out+=s.think?R(x,y,t*sc,26,C.green,'none',4):R(x,y,t*sc,26,'#fff',C.line,4,'stroke-dasharray="5 4"')}
   const tot=e+(s.report?r:0)+(s.think?t:0);out+=TBF(x0+Math.max(e+r+t,.12)*sc+10,y+18,tot.toFixed(2),13,C.ink,'start')});
  out+=L(x0,54,x0,262,C.line,2);
  const lg=[[C.purple,'goes with the experience'],[C.amber,'deciding and reporting'],[C.green,'further thought about it']];
  lg.forEach(([c,l],i)=>out+=R(110,276+i*22,14,14,c,'none',3)+TF(132,288+i*22,l,13,C.ink,'start'));
  out+=R(360,276,14,14,'#cdbfe6','none',3)+TF(382,288,'?  disputed share',13,C.ink,'start')+R(360,298,14,14,'#fff',C.line,3,'stroke-dasharray="4 3"')+TF(382,310,'dropped out',13,C.ink,'start');
  out+=TF(300,366,'Schematic sizes, not data',13,C.muted);
  return {svg:out,phase:s.report?'With a report on every trial the contrast is largest at the front of the brain and in motor cortex. Part of that is deciding and reporting, not experiencing.':s.think?'Without a report the motor difference is gone and the frontal difference has shrunk. Block’s point: people may still be thinking about what they saw, so some of what is left is not the experience either.':'With report and further thought both removed, the contrast is mostly at the back of the brain. Posterior accounts take the pale frontal remainder to be absent; prefrontal accounts take it to be real but hard to detect. The schematic cannot settle that, and nor yet can the data.'};
 }});

// A simulated eye trace: six 2-second windows; in each the slow drift follows the grating that is seen.
function K3_okn(seed){const r=rng(seed),d=[];for(let k=0;k<6;k++)d.push(r()<.5?1:-1);if(Math.abs(sum(d))===6){d[1]*=-1;d[4]*=-1}
 const pts=[];for(let j=0;j<=240;j++){const t=j*.05,w=Math.min(5,Math.floor(t/2)),ph=(t%.5)/.5;pts.push([t,d[w]*(ph-.5)+(K3_h(j,seed)-.5)*.16])}return {d,pts}}
SCENE({id:'contrastive-method-noreport',name:'Reading the percept from the eyes',tag:'You take part: decode without a report',
 definition:'In binocular rivalry each eye is shown a different image and the one that is seen alternates. If the two images are gratings drifting in opposite directions, the eyes follow the one being seen with a slow reflex drift, reset by quick jumps. Stefan Frässle and colleagues used this reflex, and the pupil, to read the percept without asking. With no report, most of the frontal activity that had accompanied the switches was no longer found.',
 example:'The slow drift of the eyes runs rightwards for about two seconds, then leftwards. A decoder that reads only the direction of drift says “right, then left”, which is what the participant would have reported by button.',
 desc:'A simulated eye-position trace divided into six two-second windows; the learner marks each window as leftward or rightward drift and then checks the decoding against the simulated participant’s button presses.',
 research:['Frässle, S., Sommer, J., Jansen, A., Naber, M. & Einhäuser, W. (2014). Binocular rivalry: frontal activity relates to introspection and action but not to perception. Journal of Neuroscience 34, 1738–1747.','Tsuchiya, N. et al. (2015), as above.','The trace is simulated. True rivalry needs a different image in each eye, which one screen cannot give. Status: the finding is influential; prefrontal accounts dispute what it shows (see Front or back).'],
 dur:12,hint:'Press a window to mark the slow drift as left or right (press again to change it), then press Check. Your answers stay on this page.',
 init:()=>({seed:5,g:[0,0,0,0,0,0],chk:false}),
 watch(p){const tr=K3_okn(5),k=Math.min(6,Math.floor(p*8));return {seed:5,g:tr.d.map((d,i)=>i<k?d:0),chk:p>.8,sim:true}},
 ui:[{b:'Check against the button presses',act:'chk'},{b:'New trace',act:'fresh'}],
 on:{g(s,i){i=Number(i);s.g[i]=s.g[i]===1?-1:1;s.chk=false;return 'keep'},chk(s){s.chk=true;return 'keep'},fresh(s){s.seed=nextSeed()%9973+1;s.g=[0,0,0,0,0,0];s.chk=false;return 'keep'}},
 draw(s,f,X){
  const tr=K3_okn(s.seed),x0=42,w=516,ww=w/6,xt=t=>x0+t/12*w,yc=104;
  let out=heading('Which grating was seen? Read the slow drift');
  out+=R(x0,54,w,100,'#fff',C.grid,6);for(let k=1;k<6;k++)out+=L(x0+k*ww,54,x0+k*ww,154,C.grid,1.5,'stroke-dasharray="4 4"');
  out+=K3_poly(tr.pts.map(([t,v])=>[xt(t),yc-v*56]),C.ink,2);
  out+=TF(x0+4,68,'eye turned right ↑',13,C.muted,'start')+TF(x0+4,148,'left ↓',13,C.muted,'start');
  let right=0,marked=0;
  for(let k=0;k<6;k++){const g=s.g[k],x=x0+k*ww+4;if(g)marked++;if(g===tr.d[k])right++;
   out+=hit(X,'g',k,`Window ${k+1}: ${g===1?'marked right':g===-1?'marked left':'not marked'}. Press to change.`,R(x,162,ww-8,34,g===1?C.pale:g===-1?C.coralp:'#fff',g===1?C.blue:g===-1?C.coral:C.line,8)+TB(x+(ww-8)/2,184,g===1?'right':g===-1?'left':'?',13,g===1?C.blue:g===-1?C.coral:C.muted));
   if(s.chk)out+=R(x,204,ww-8,30,'#f3f6f8',C.grid,8)+TBF(x+(ww-8)/2,224,(tr.d[k]===1?'right':'left')+(g===tr.d[k]?' ✓':' ✗'),13,g===tr.d[k]?C.green:C.coral)}
  out+=TF(300,252,s.chk?'Lower row: what the simulated participant reported by button':'Each window is 2 seconds. Slow drift up the plot means the eyes follow the rightward grating.',13,C.muted);
  if(s.chk)out+=TB(300,284,`${s.sim?'Decoder':'You'} matched ${right} of 6 windows`,16,right>=5?C.green:C.amber);
  else out+=T(300,284,`${marked} of 6 windows marked`,15,C.muted);
  out+=TF(300,318,'Published: reflex eye movements and pupil size gave the percept without any report,',13,C.muted)+TF(300,338,'and frontal activity at the switches was then largely absent (Frässle et al. 2014).',13,C.muted);
  out+=TF(300,368,'Simulated trace',13,C.muted);
  return {svg:out,phase:s.chk?(right>=5?`${right} of 6: the direction of the slow drift was enough to recover what was seen, with no button press.`:`${right} of 6. Look at the slope between the quick jumps, not at the jumps: a slow rise is rightward drift, a slow fall is leftward.`)+' This is what makes a no-report design possible: the experience is inferred from a reflex, and the brain activity can then be measured without the act of reporting.':'The sawtooth is a reflex called optokinetic nystagmus: a slow drift that follows the moving pattern, then a quick jump back. During rivalry the slow drift follows whichever grating is seen at that moment.'};
 }});

/* =========================== ignition =========================== */
// TOY MODEL of ignition. A sensory unit a follows a 50 ms stimulus of strength I; a second unit g excites itself
// (weight 9), is driven by a (weight 9), and is switched off again by slow adaptation h. Time step 1 ms.
function K3_ign(I){const a=[],g=[];let av=0,gv=0,h=0;
 for(let t=0;t<600;t++){av+=(-av+(t<50?I:0))/40;const z=9*gv+9*av-5-3.5*h;gv+=(-gv+1/(1+Math.exp(-z)))/30;h+=(gv-h)/350;a.push(av);g.push(gv)}
 return {a,g,early:Math.max(...a),late:Math.max(...g)}}
let K3_IGNC=null;
function K3_ignCurve(){if(!K3_IGNC){const pts=[];for(let k=0;k<=50;k++){const r=K3_ign(k/50);pts.push([k/50,r.early,r.late])}let lo=0,hi=1;for(let k=0;k<30;k++){const m=(lo+hi)/2;if(K3_ign(m).late>.5)hi=m;else lo=m}K3_IGNC={pts,th:hi}}return K3_IGNC}
SCENE({id:'ignition',name:'Ignition',tag:'A toy model with a threshold',
 definition:'Stanislas Dehaene and colleagues propose that a stimulus becomes conscious when its activity crosses a threshold and ignites: a late, sudden, self-sustaining and widespread response, strongest across parietal and prefrontal cortex. The early sensory response grows smoothly with stimulus strength; the late response is predicted to be nearly all-or-none. In masking experiments by Antoine Del Cul and colleagues, late activity after about 270 ms followed that step-like pattern and tracked what people reported seeing.',
 example:'In the toy model, a stimulus of strength 0.50 gives an early response of 0.36 and almost no late response. At 0.60 the early response is only a little larger, 0.43, but the late unit ignites to 0.93.',
 desc:'Left, the time course of a toy sensory unit and a toy self-exciting unit after a brief stimulus. Right, the peak of each unit against stimulus strength: a straight line for the early response and a step for the late one.',
 research:['Dehaene, S. & Naccache, L. (2001). Towards a cognitive neuroscience of consciousness: basic evidence and a workspace framework. Cognition 79, 1–37.','Sergent, C., Baillet, S. & Dehaene, S. (2005). Timing of the brain events underlying access to consciousness during the attentional blink. Nature Neuroscience 8, 1391–1400.','Del Cul, A., Baillet, S. & Dehaene, S. (2007). Brain dynamics underlying the nonlinear threshold for access to consciousness. PLoS Biology 5, e260.','The model here is a two-unit toy, not the authors’ simulation. Status: late nonlinear activity with report is well replicated; whether it marks experience or its report is contested (see The P3b).'],
 dur:12,hint:'Raise the stimulus strength slowly and find the point where the late response appears.',
 init:()=>({I:.5}),
 watch(p){return {I:Math.round(lerp(.2,.9,smooth(p))*50)/50}},
 ui:[{range:'I',label:'Stimulus strength',min:0,max:1,step:.02,get:s=>s.I,act:'I',show:v=>Number(v).toFixed(2)}],
 on:{I(s,v){s.I=Number(v);return 'keep'}},
 draw(s){
  const r=K3_ign(s.I),cv=K3_ignCurve(),ig=r.late>.5;
  let out=heading('Early response grows; late response ignites');
  const A=K3_axes(52,70,250,170,[0,600],[0,1.05],{xt:[[0,'0'],[200,'200'],[400,'400'],[600,'600 ms']],yt:[[0,'0'],[1,'1']],yl:'activity'});out+=A.svg;
  out+=R(A.X(0),A.Y(0)+2,A.X(50)-A.X(0),5,C.ink,'none',2);
  const pa=[],pg=[];for(let t=0;t<600;t+=4){pa.push([A.X(t),A.Y(r.a[t])]);pg.push([A.X(t),A.Y(r.g[t])])}
  out+=K3_poly(pa,C.blue,2.5)+K3_poly(pg,C.coral,3);
  out+=L(60,290,84,290,C.blue,2.5)+TF(90,294,'early sensory unit',13,C.blue,'start')+L(60,310,84,310,C.coral,3)+TF(90,314,'late self-exciting unit',13,C.coral,'start');
  const B=K3_axes(372,70,200,170,[0,1],[0,1.05],{xt:[[0,'0'],[.5,'0.5'],[1,'1']],yt:[[0,'0'],[1,'1']],yl:'peak response',xl:'stimulus strength'});out+=B.svg;
  out+=K3_poly(cv.pts.map(q=>[B.X(q[0]),B.Y(q[1])]),C.blue,2.5)+K3_poly(cv.pts.map(q=>[B.X(q[0]),B.Y(q[2])]),C.coral,3);
  out+=L(B.X(s.I),B.Y(0),B.X(s.I),B.Y(1.05),C.ink,1.5,'stroke-dasharray="4 4"')+Ci(B.X(s.I),B.Y(r.early),5,C.blue,'#fff')+Ci(B.X(s.I),B.Y(r.late),5,C.coral,'#fff');
  out+=R(206,46,96,22,C.amberp,C.amber,6)+TBF(254,62,'TOY MODEL',13,C.amber);
  out+=TB(300,346,ig?'Ignited':'No ignition',16,ig?C.coral:C.muted)+TF(300,368,`strength ${s.I.toFixed(2)} · early peak ${r.early.toFixed(2)} · late peak ${r.late.toFixed(2)} · threshold near ${cv.th.toFixed(2)}`,13,C.muted);
  return {svg:out,phase:ig?`At strength ${s.I.toFixed(2)} the early response is ${r.early.toFixed(2)} and the late unit ignites to ${r.late.toFixed(2)}, then shuts itself off after a few hundred milliseconds. The theory predicts a late, all-or-none, widespread response on seen trials. This toy shows only how self-excitation produces a threshold.`:`At strength ${s.I.toFixed(2)} the early response is ${r.early.toFixed(2)} but the late unit stays near ${r.late.toFixed(2)}: the input fades before self-excitation can take over. In this toy the threshold is near ${cv.th.toFixed(2)}. On the theory, such a stimulus is processed but not consciously seen.`};
 }});

const K3_NS=.1;
function K3_igTrials(I,seed){const r=rng(seed),out=[];for(let k=0;k<40;k++){let z=0;for(let j=0;j<12;j++)z+=r();out.push(K3_ign(clamp(I+(z-6)*K3_NS,0,1.2)).late)}return out}
const K3_IGW=[.35,.5,.57,.65,.8];
SCENE({id:'ignition-allornone',name:'All or none?',tag:'Run trials on the toy model',
 definition:'If conscious access is an ignition, then near threshold identical stimuli should give two kinds of trial, ignited and not, with little in between. Claire Sergent and Stanislas Dehaene found two-peaked visibility ratings of this kind in the attentional blink. Morten Overgaard and colleagues, using a four-step awareness scale, found graded reports instead. Whether experience comes in degrees is not settled.',
 example:'In the toy, the threshold is near 0.57 and each trial’s strength varies with a spread of 0.10. At a strength of 0.57 about half of 40 trials ignite; at 0.65 about four in five do. Hardly any trial ends half-ignited.',
 desc:'Left, a histogram of the late response over 40 noisy trials of the toy model at the chosen strength. Right, the share of trials that ignited at each strength tried, against the curve the toy predicts.',
 research:['Sergent, C. & Dehaene, S. (2004). Is consciousness a gradual phenomenon? Evidence for an all-or-none bifurcation during the attentional blink. Psychological Science 15, 720–728.','Del Cul, A., Baillet, S. & Dehaene, S. (2007), as above: a sigmoid relation between masking delay and reported visibility.','Overgaard, M., Rote, J., Mouridsen, K. & Ramsøy, T. Z. (2006). Is conscious perception gradual or dichotomous? Consciousness and Cognition 15, 700–708. Status: contested; results depend on the task and the scale.'],
 dur:12,hint:'Set a strength and press Run 40 trials. Try several strengths around 0.57 and watch the points follow the curve.',
 init:()=>({I:.56,amps:null,runs:[]}),
 watch(p){const k=Math.min(4,Math.floor(p*5)),runs=[];let amps=null;for(let j=0;j<=k;j++){amps=K3_igTrials(K3_IGW[j],101+j);runs.push({I:K3_IGW[j],share:amps.filter(v=>v>.5).length/40})}return {I:K3_IGW[k],amps,runs,sim:true}},
 ui:[{range:'I',label:'Stimulus strength',min:.2,max:.9,step:.01,get:s=>s.I,act:'I',show:v=>Number(v).toFixed(2)},{b:'Run 40 trials',act:'run'},{b:'Clear',act:'clear'}],
 on:{I(s,v){s.I=Number(v);return 'keep'},run(s){s.amps=K3_igTrials(s.I,nextSeed());s.runs.push({I:s.I,share:s.amps.filter(v=>v>.5).length/40});if(s.runs.length>14)s.runs.shift();return 'keep'},clear(s){s.amps=null;s.runs=[];return 'keep'}},
 draw(s){
  const th=K3_ignCurve().th;let out=heading('Forty noisy trials at one strength');
  const A=K3_axes(52,70,240,170,[0,1],[0,40],{xt:[[0,'0'],[.5,'0.5'],[1,'1']],yt:[[0,'0'],[20,'20'],[40,'40']],yl:'trials',xl:'late response on the trial'});out+=A.svg;
  let ign=0;
  if(s.amps){const bins=new Array(10).fill(0);for(const v of s.amps){bins[Math.min(9,Math.floor(v*10))]++;if(v>.5)ign++}
   bins.forEach((c,i)=>{if(c)out+=R(A.X(i/10)+2,A.Y(c),A.X(.1)-A.X(0)-4,A.Y(0)-A.Y(c),i<5?'#a9bcc8':C.coral,'none',3)})}
  else out+=TF(172,150,'no trials yet',13,C.muted);
  const B=K3_axes(372,70,200,170,[.2,.9],[0,1],{xt:[[.2,'0.2'],[.57,'0.57'],[.9,'0.9']],yt:[[0,'0'],[.5,'50%'],[1,'100%']],yl:'share ignited',xl:'stimulus strength'});out+=B.svg;
  const pts=[];for(let x=.2;x<=.9001;x+=.01)pts.push([B.X(x),B.Y(K3_phi((x-th)/K3_NS))]);out+=K3_poly(pts,C.line,2.5);
  s.runs.forEach((q,i)=>out+=Ci(B.X(q.I),B.Y(q.share),i===s.runs.length-1?6:4.5,C.coral,'#fff'));
  out+=R(196,46,96,22,C.amberp,C.amber,6)+TBF(244,62,'TOY MODEL',13,C.amber);
  out+=L(380,292,404,292,C.line,2.5)+TF(410,296,'predicted by the toy',13,C.muted,'start')+Ci(392,312,4.5,C.coral,'#fff')+TF(410,316,s.sim?'simulated runs':'your runs',13,C.muted,'start');
  out+=TB(170,300,s.amps?`${ign} of 40 ignited (${Math.round(ign/40*100)}%)`:'Press Run 40 trials',15,s.amps?C.coral:C.muted);
  out+=TF(300,346,`Strength ${s.I.toFixed(2)}; each trial varies with a spread of ${K3_NS.toFixed(2)}; threshold near ${th.toFixed(2)}.`,13,C.muted);
  out+=TF(300,368,'Real visibility reports are two-peaked in some tasks and graded in others.',13,C.muted);
  return {svg:out,phase:s.amps?`At strength ${s.I.toFixed(2)}, ${ign} of 40 trials ignited; the toy predicts about ${Math.round(K3_phi((s.I-th)/K3_NS)*100)}%. The histogram has two heaps and an empty middle, which is what an all-or-none threshold predicts. What counts against reading experience this way: with a graded awareness scale, people often report “a brief glimpse” or “an almost clear experience”, not just seen or unseen.`:'Each trial adds a little random variation to the stimulus strength, standing in for moment-to-moment changes in the brain. Near the threshold that variation decides whether the late response ignites.'};
 }});

const K3_ERP=(t,c)=>2*K3_gauss(t,100,22)-2.5*K3_gauss(t,170,25)+(c!=='un'?-1.8*K3_gauss(t,230,35):0)+(c==='rep'?6:c==='nor'?.4:0)*K3_gauss(t,450,90);
const K3_ERPC={rep:['Seen and reported',C.coral],nor:['Seen, no report',C.purple],un:['Not seen',C.muted]};
SCENE({id:'ignition-p3b',name:'The P3b',tag:'Signature of experience, or of the task?',
 definition:'The P3b is a large positive wave over the back of the head, peaking roughly 300 to 600 ms after a stimulus. In report-based studies it is much larger on seen trials, and it was taken as the electrical signature of ignition. That reading is contested. When Michael Pitts and colleagues made the stimulus irrelevant to the task, people still saw it but the P3b was absent. An earlier negative wave near 200 ms is one proposed alternative.',
 example:'Seen and reported: an early negativity near 230 ms and a P3b of about 6 μV near 450 ms. Seen with no report: the early negativity remains and the P3b all but disappears. Not seen: neither.',
 desc:'Schematic event-related potentials for three conditions (seen and reported, seen without report, not seen) on one time axis from −100 to 700 ms, with the P1, N1, early negativity and P3b marked.',
 research:['Pitts, M. A., Padwal, J., Fennelly, D., Martínez, A. & Hillyard, S. A. (2014). Gamma band activity and the P3 reflect post-perceptual processes, not visual awareness. NeuroImage 101, 337–350.','Cohen, M. A., Ortego, K., Kyroudis, A. & Pitts, M. (2020). Distinguishing the neural correlates of perceptual awareness and postperceptual processing. Journal of Neuroscience 40, 4925–4935.','Koivisto, M. & Revonsuo, A. (2010). Event-related brain potential correlates of visual awareness. Neuroscience & Biobehavioral Reviews 34, 922–934.','Sergent, C. et al. (2021), Nature Communications: a late two-way split in brain activity found without report. Waveforms here are schematic. Status: the P3b as a signature of consciousness is contested.'],
 dur:12,hint:'Switch between the three conditions and compare the waves after 300 ms.',
 init:()=>({c:'rep'}),
 watch(p){return {c:p<.34?'rep':p<.67?'nor':'un'}},
 ui:[{choose:[['rep','Seen and reported'],['nor','Seen, no report'],['un','Not seen']],label:'Condition',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=v;return 'keep'}},
 draw(s){
  let out=heading('Brain potentials: '+K3_ERPC[s.c][0].toLowerCase());
  const A=K3_axes(70,56,480,200,[-100,700],[-4,8],{xt:[[0,'0'],[200,'200'],[400,'400'],[600,'600 ms']],yt:[[-4,'−4'],[0,'0'],[4,'4'],[8,'8 μV']]});out+=A.svg;
  out+=L(A.X(-100),A.Y(0),A.X(700),A.Y(0),C.grid,1.5)+L(A.X(0),A.Y(-4),A.X(0),A.Y(8),C.grid,1.5,'stroke-dasharray="4 4"');
  for(const c of ['un','nor','rep']){const pts=[];for(let t=-100;t<=700;t+=5)pts.push([A.X(t),A.Y(K3_ERP(t,c))]);out+=K3_poly(pts,c===s.c?K3_ERPC[c][1]:'#c5d2da',c===s.c?3.5:2,c===s.c?'':'stroke-dasharray="6 5"')}
  const pts=[];for(let t=-100;t<=700;t+=5)pts.push([A.X(t),A.Y(K3_ERP(t,s.c))]);out+=K3_poly(pts,K3_ERPC[s.c][1],3.5);
  out+=TF(A.X(100),A.Y(2)-8,'P1',13,C.muted)+TF(A.X(160),A.Y(-2.6)+18,'N1',13,C.muted)+TF(A.X(262),A.Y(-2)+16,'early negativity',13,s.c==='un'?C.muted:C.ink,'start')+TBF(A.X(450),A.Y(6)-8,'P3b',14,s.c==='rep'?C.coral:C.muted);
  const p3=K3_ERP(450,s.c),en=K3_ERP(230,s.c)-K3_ERP(230,'un');
  out+=counter(90,292,'P3b at 450 ms',p3.toFixed(1)+' μV',s.c==='rep'?C.coral:C.muted,190)+counter(320,292,'early negativity, vs not seen',en.toFixed(1)+' μV',s.c==='un'?C.muted:C.purple,190);
  out+=TF(300,366,'Schematic waveforms, positive plotted upwards; not data',13,C.muted);
  return {svg:out,phase:s.c==='rep'?'With a report on every trial, seen trials show a large late positive wave, the P3b. Ignition accounts predicted this, and it is one of the most replicated findings in the field.':s.c==='nor'?'The same stimulus is seen, but nothing has to be done about it, and the P3b is all but gone while the earlier negativity remains. That counts against the P3b as a marker of experience. Defenders of ignition reply that ignition need not be the P3b, and a late split in brain activity has been reported without report (Sergent et al. 2021).':'When the stimulus is not seen, the earliest waves (P1, N1) look much the same, and both the early negativity and the P3b are missing.'};
 }});
