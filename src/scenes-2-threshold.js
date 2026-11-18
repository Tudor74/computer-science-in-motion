/* =====================================================================
 Consciousness era 2 · At the threshold: where awareness starts and stops.
 Masking (a single brief letter and one mask per trial), blindsight (a simulated patient, the two routes
 and the criterion debate), rivalry and bistable figures (a Necker cube whose flips the learner times),
 inattentional blindness (an unannounced object, explained straight after), change blindness (slow grey
 fade, gradual change, mudsplashes) and attention against awareness (a Posner cueing task).
 Safety: nothing alternates faster than 3 per second; masking trials are single presentations started by
 the learner; no sound is used in this era. No data leaves the page.
 ===================================================================== */

const K2_poly=(pts,col,w=2.2,extra='')=>pts.length>1?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
// Axes: returns {svg,X(),Y()}. Tick labels are fixed-size so they stay inside the drawing on phones.
function K2_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let out=L(x0,y0+h,x0+w,y0+h,C.line,2)+L(x0,y0,x0,y0+h,C.line,2);
 (o.xt||[]).forEach(([v,l])=>out+=L(X(v),y0+h,X(v),y0+h+5,C.line,1.5)+TF(X(v),y0+h+19,l,13,C.muted));
 (o.yt||[]).forEach(([v,l])=>out+=L(x0-5,Y(v),x0,Y(v),C.line,1.5)+TF(x0-8,Y(v)+4,l,13,C.muted,'end'));
 if(o.xl)out+=TF(x0+w/2,y0+h+37,o.xl,13,C.muted);
 if(o.yl)out+=TF(x0-4,y0-9,o.yl,13,C.muted,'start');
 return {svg:out,X,Y};
}
// Standard normal cumulative distribution (Abramowitz & Stegun 26.2.17; error below 1e-7).
const K2_Phi=z=>{const t=1/(1+.2316419*Math.abs(z)),d=.3989422804*Math.exp(-z*z/2),p=d*t*(.31938153+t*(-.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429))));return z>=0?1-p:p};
// One standard normal draw from a seeded generator (Box–Muller).
const K2_gauss=r=>{const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
const K2_mean=a=>a.length?sum(a)/a.length:0;
const K2_wrap=(s,n)=>{const out=[];let line='';for(const w of String(s).split(' ')){if(line&&(line+' '+w).length>n){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out};
const K2_lines=(x,y,s,n,col=C.ink,anchor='start',lh=17,max=4)=>K2_wrap(s,n).slice(0,max).map((l,i)=>TF(x,y+i*lh,l,13,col,anchor)).join('');
// A pressable button drawn in the diagram (inert in Watch).
const K2_btn=(X,act,arg,aria,x,y,w,h,txt,col=C.blue,fill='#fff')=>hit(X,act,arg,aria,R(x,y,w,h,fill,col,8)+TBF(x+w/2,y+h/2+5,txt,14,col));
// A pattern mask: seeded crossing strokes, drawn as lines (no text).
function K2_mask(cx,cy,w=84,h=50,n=30){const r=rng(271);let o='';for(let i=0;i<n;i++){const x=cx-w/2+r()*w,y=cy-h/2+r()*h,a=r()*Math.PI,l=10+r()*10;o+=L(x-Math.cos(a)*l,y-Math.sin(a)*l,x+Math.cos(a)*l,y+Math.sin(a)*l,C.ink,3)}return o}
const K2_pct=v=>Math.round(v*100)+'%';
// A row of small person markers: the first k are filled.
function K2_people(x0,y0,n,k,per,col,gap=22){let o='';for(let i=0;i<n;i++){const x=x0+(i%per)*gap,y=y0+Math.floor(i/per)*30,on=i<k;o+=Ci(x,y,5,on?col:'#fff',on?col:C.line)+R(x-5,y+7,10,13,on?col:'#fff',on?col:C.line,4)}return o}

/* =========================== masking =========================== */
const K2_MSOA=[17,33,67,133],K2_MN=12,K2_MLET=['H','K','N','X'];
function K2_mTrial(seed,i){const order=shuffled(range(K2_MN).map(k=>K2_MSOA[k%4]),seed*7+3),r=rng(seed*131+i*17+5);r();return {soa:order[i],ch:K2_MLET[Math.floor(r()*4)]}}
// Schematic pattern only: identification rises from chance (1 in 4) with the delay; "saw it" reports rise a little later.
const K2_mAcc=soa=>.25+.72/(1+Math.exp(-(soa-45)/12)),K2_mSeen=soa=>1/(1+Math.exp(-(soa-60)/11));
function K2_mSim(n){const r=rng(151),res=[];for(let i=0;i<n;i++){const t=K2_mTrial(4,i);res.push({soa:t.soa,ok:r()<K2_mAcc(t.soa),seen:r()<K2_mSeen(t.soa)})}return res}
SCENE({id:'masking',name:'Backward masking',tag:'You take part: one letter, one mask',
 definition:'In backward masking a briefly shown target is followed by a pattern, the mask. If the mask comes soon enough, people say they did not see the target, although it reached the eye for just as long. Changing the delay moves the same letter across the threshold of awareness, which is why masking became a standard tool for comparing seen with unseen.',
 example:'A letter shown for about 17 ms and masked straight away is usually reported as not seen; the same letter masked 133 ms later is easy to read. The delay from target onset to mask onset is called the stimulus onset asynchrony, or SOA.',
 desc:'A small display that shows one letter and then one pattern mask, answer buttons, and a chart of the proportion of letters named correctly and the proportion reported as seen at each delay.',
 research:['Kahneman, D. (1968). Method, findings, and theory in studies of visual masking. Psychological Bulletin 70, 404–425.','Breitmeyer, B. G. & Öğmen, H. (2006). Visual Masking: Time Slices Through Conscious and Unconscious Vision. Oxford University Press. Masking itself is robust; a browser cannot time a display exactly, so the delays here are approximate.'],
 dur:12,hint:'Press Flash, name the letter (guess if you must), then say whether you saw it. Each press gives one letter and one mask, never a stream. Twelve trials; your answers stay on this page.',
 init:()=>({seed:4,i:0,ph:'idle',pick:null,res:[]}),
 watch(p){const n=Math.min(K2_MN,Math.floor(p*(K2_MN+1)));return {seed:4,i:n,ph:'film',k:Math.floor(p*8)%4,res:K2_mSim(n),sim:true}},
 ui:[{b:'Flash',act:'go'},{b:'Start again',act:'again'}],
 on:{go(s,a,ctx){if(s.i>=K2_MN||s.ph!=='idle')return 'keep';const t=K2_mTrial(s.seed,s.i);s.ph='target';if(t.soa>17)ctx.later(17,'ph','gap');ctx.later(t.soa,'ph','mask');ctx.later(t.soa+250,'ph','ask');return 'keep'},
  ph(s,v){if(s.ph==='idle'||s.ph==='rate')return 'keep';s.ph=v;return 'keep'},
  pick(s,v){if(s.ph!=='ask')return 'keep';s.pick=v;s.ph='rate';return 'keep'},
  rate(s,v){if(s.ph!=='rate'||s.i>=K2_MN)return 'keep';const t=K2_mTrial(s.seed,s.i);s.res.push({soa:t.soa,ok:s.pick===t.ch,seen:v==='1'});s.i++;s.pick=null;s.ph='idle';return 'keep'},
  again(s){s.seed=nextSeed()%997+1;s.i=0;s.res=[];s.pick=null;s.ph='idle'}},
 draw(s,f,X){
  let out=heading(s.sim?'Simulated observer: one letter, one mask':'One letter, then one mask');const cx=160,cy=116;
  out+=R(40,56,240,120,'#f4f7f9',C.line,6);
  const done=s.i>=K2_MN,t=done?null:K2_mTrial(s.seed,s.i);
  if(s.ph==='film'){[['letter','17 ms'],['gap','to the delay'],['mask','250 ms'],['answer','no time limit']].forEach(([l,d],k)=>{const x=48+k*57;out+=R(x,70,53,60,k===s.k?C.pale:'#fff',k===s.k?C.blue:C.line,4);
    if(k===0)out+=TB(x+26,108,'K',22,'#7d8d96');if(k===2)out+=K2_mask(x+26,100,40,40,12);if(k===3)out+=TB(x+26,108,'?',22,C.blue);out+=T(x+26,148,l,13,k===s.k?C.blue:C.muted)});
   out+=T(cx,168,'one trial, in order',13,C.muted)}
  else if(s.ph==='target'&&t)out+=TB(cx,cy+9,t.ch,26,'#7d8d96');
  else if(s.ph==='mask')out+=K2_mask(cx,cy);
  else if(s.ph==='gap')out+='';
  else if(s.ph==='ask')out+=TB(cx,cy+5,'Which letter was it?',15,C.ink);
  else if(s.ph==='rate')out+=TB(cx,cy+5,'Did you see the letter?',15,C.ink);
  else out+=Ci(cx,cy,3,C.muted)+T(cx,cy+34,done?'all twelve trials done':'look at the dot, then press Flash',13,C.muted);
  if(s.ph==='ask')K2_MLET.forEach((c,k)=>out+=K2_btn(X,'pick',c,'Letter '+c,40+k*62,192,54,42,c));
  else if(s.ph==='rate')out+=K2_btn(X,'rate','1','I saw the letter',40,192,115,42,'I saw it')+K2_btn(X,'rate','0','I did not see the letter',165,192,115,42,'Not seen',C.coral);
  else if(!s.sim)out+=TF(cx,218,done?'Press Start again for a new run.':'The answer buttons appear after the mask.',13,C.muted);
  out+=T(cx,256,done?'12 of 12 trials':`trial ${s.i+1} of ${K2_MN}`,13,C.muted);
  const un=s.res.filter(r=>!r.seen),unOk=un.filter(r=>r.ok).length;
  if(un.length)out+=TB(cx,290,`“Not seen” trials: ${unOk} of ${un.length} letters right`,13,C.ink)+T(cx,308,'guessing alone gives about 1 in 4',13,C.muted);
  const pl=K2_plot(360,62,210,170,[0,150],[0,1],{xt:[[17,'17'],[67,'67'],[133,'133']],yt:[[0,'0'],[.25,'chance'],[1,'1']],xl:'delay from letter to mask (ms)',yl:'proportion of trials'});out+=pl.svg;
  out+=L(360,pl.Y(.25),570,pl.Y(.25),C.grid,1.5,'stroke-dasharray="3 4"');
  const ca=[],cs=[];for(let v=0;v<=150;v+=3){ca.push([pl.X(v),pl.Y(K2_mAcc(v))]);cs.push([pl.X(v),pl.Y(K2_mSeen(v))])}
  out+=K2_poly(ca,C.coral,1.8,'stroke-dasharray="6 4"')+K2_poly(cs,C.blue,1.8,'stroke-dasharray="2 4"');
  K2_MSOA.forEach(soa=>{const v=s.res.filter(r=>r.soa===soa);if(v.length){const a=v.filter(r=>r.ok).length/v.length,b=v.filter(r=>r.seen).length/v.length;out+=R(pl.X(soa)-11,pl.Y(b)-5,10,10,C.blue,'#fff',1)+Ci(pl.X(soa)+6,pl.Y(a),5.5,C.coral,'#fff')}});
  out+=Ci(366,290,5.5,C.coral)+T(378,294,`letter right (${s.sim?'simulated':'yours'})`,13,C.ink,'start')+R(361,304,10,10,C.blue,'none',1)+T(378,314,'reported “saw it”',13,C.ink,'start');
  out+=TF(360,336,'dashed: the usual pattern, schematic',13,C.muted,'start');
  const phase=s.sim?'A simulated observer, following the usual pattern: at the shortest delays the letter is reported as not seen and naming is near chance; by 133 ms it is seen and named.':done?(un.length?`You said “not seen” on ${un.length} trials and named ${unOk} of those letters correctly. Twelve trials are far too few to show seeing without awareness; the next two scenes explain why that question is hard.`:'You reported seeing the letter on every trial. On a fast, bright screen the letter can survive the mask; a browser cannot hold the timing that a laboratory display can.'):s.ph==='idle'?'Each press shows one letter for about 17 ms, then a single mask after one of four delays.':s.ph==='ask'||s.ph==='rate'?'Answer even if you think you are guessing: the comparison between naming the letter and reporting that you saw it is the point.':'One letter, one mask.';
  return {svg:out,phase};
 }});

const K2_PD=[1,4,6,9];
function K2_pTrials(seed){const all=[];for(const a of K2_PD)for(const b of K2_PD)all.push({prime:a,target:b,con:(a<5)===(b<5)});return shuffled(all,seed*13+7)}
function K2_pStats(res){const ok=res.filter(r=>r.ok&&r.rt>150&&r.rt<2000),c=ok.filter(r=>r.con).map(r=>r.rt),n=ok.filter(r=>!r.con).map(r=>r.rt);return {c,n,mc:K2_mean(c),mn:K2_mean(n),err:res.filter(r=>!r.ok).length}}
function K2_pSim(n){const r=rng(29),tr=K2_pTrials(3),res=[];for(let i=0;i<n;i++)res.push({con:tr[i].con,rt:(tr[i].con?520:544)+K2_gauss(r)*45,ok:true});return res}
SCENE({id:'masking-priming',name:'Masked priming',tag:'You take part: does a hidden number help?',
 definition:'In masked priming a word or number, the prime, is shown briefly and masked, and a clearly visible target follows. If the prime changes how fast people respond to the target, it was processed to some depth. Anthony Marcel (1983) reported that masked words speeded decisions about related words. Stanislas Dehaene and colleagues (1998) reported that a masked number speeds a larger-or-smaller-than-5 judgement when it falls on the same side of 5 as the target.',
 example:'Target 9, to be judged larger than 5. After a masked 6 (same side: congruent) answers came about 24 ms sooner than after a masked 4 (opposite side: incongruent) in Dehaene’s study, which also found activity in the motor cortex matching the prime. These effects are small, and whether the primes were truly unseen is contested (next scene).',
 desc:'A display that shows a brief grey number, one mask and then a clear number to classify, with two answer buttons and a bar chart of mean response time after congruent and incongruent primes.',
 research:['Marcel, A. J. (1983). Conscious and unconscious perception: experiments on visual masking and word recognition. Cognitive Psychology 15, 197–237.','Dehaene, S. et al. (1998). Imaging unconscious semantic priming. Nature 395, 597–600.','Van den Bussche, E., Van den Noortgate, W. & Reynvoet, B. (2009). Mechanisms of masked priming: a meta-analysis. Psychological Bulletin 135, 452–477. Status: contested; effects are small and depend on how awareness is checked.'],
 dur:12,hint:'Press Start, then judge each clear number as smaller or larger than 5, as fast as you can without mistakes. Each trial has one brief grey number and one mask. Sixteen trials; your times stay on this page.',
 init:()=>({seed:3,i:0,ph:'idle',t0:0,res:[]}),
 watch(p){const n=Math.min(16,Math.floor(p*17));return {seed:3,i:n,ph:'film',k:Math.floor(p*8)%4,res:K2_pSim(n),sim:true}},
 ui:[{b:'Start',act:'start'}],
 on:{start(s,a,ctx){if(s.ph!=='idle'&&s.ph!=='done')return 'keep';if(s.ph==='done'){s.seed=nextSeed()%997+1;s.i=0;s.res=[]}s.ph='fix';ctx.later(600,'prime');return 'keep'},
  prime(s,a,ctx){if(s.ph!=='fix')return 'keep';s.ph='prime';ctx.later(33,'mask');return 'keep'},
  mask(s,a,ctx){if(s.ph!=='prime')return 'keep';s.ph='mask';ctx.later(100,'target');return 'keep'},
  target(s){if(s.ph!=='mask')return 'keep';s.ph='target';s.t0=performance.now();return 'keep'},
  ans(s,v,ctx){if(s.ph!=='target')return 'keep';const t=K2_pTrials(s.seed)[s.i];s.res.push({con:t.con,rt:performance.now()-s.t0,ok:(v==='big')===(t.target>5)});s.i++;if(s.i>=16)s.ph='done';else{s.ph='fix';ctx.later(900,'prime')}return 'keep'}},
 draw(s,f,X){
  let out=heading(s.sim?'Simulated observer: smaller or larger than 5?':'Is the clear number smaller or larger than 5?');const cx=160,cy=116;
  out+=R(40,56,240,120,'#f4f7f9',C.line,6);
  const t=s.i<16?K2_pTrials(s.seed)[s.i]:null;
  if(s.ph==='film'){[['prime','33 ms'],['mask','100 ms'],['target','until you answer'],['answer','']].forEach(([l],k)=>{const x=48+k*57;out+=R(x,70,53,60,k===s.k?C.pale:'#fff',k===s.k?C.blue:C.line,4);
    if(k===0)out+=TB(x+26,108,'6',20,'#8b9aa3');if(k===1)out+=K2_mask(x+26,100,40,40,12);if(k===2)out+=TB(x+26,110,'9',28,C.ink);if(k===3)out+=TB(x+26,106,'> 5',15,C.blue);out+=T(x+26,148,l,13,k===s.k?C.blue:C.muted)});
   out+=T(cx,168,'prime, one mask, then the target',13,C.muted)}
  else if(s.ph==='prime'&&t)out+=TB(cx,cy+8,String(t.prime),22,'#8b9aa3');
  else if(s.ph==='mask')out+=K2_mask(cx,cy);
  else if(s.ph==='target'&&t)out+=TB(cx,cy+15,String(t.target),44,C.ink);
  else if(s.ph==='fix')out+=TB(cx,cy+7,'+',22,C.muted);
  else out+=Ci(cx,cy,3,C.muted)+T(cx,cy+34,s.ph==='done'?'all sixteen trials done':'press Start, then watch the centre',13,C.muted);
  if(!s.sim)out+=K2_btn(X,'ans','small','The number is smaller than 5',40,192,115,46,'Smaller')+K2_btn(X,'ans','big','The number is larger than 5',165,192,115,46,'Larger');
  out+=T(cx,262,s.i>=16?'16 of 16 trials':`trial ${s.i+1} of 16`,13,C.muted);
  const st=K2_pStats(s.res),base=250,sc=h=>clamp((h-200)/600,0,1)*170;
  out+=L(350,base,580,base,C.line,2)+T(465,70,'mean response time (ms)',13,C.muted);
  [['congruent',st.c,st.mc,C.green,380],['incongruent',st.n,st.mn,C.coral,490]].forEach(([l,a,m,col,x])=>{if(a.length)out+=R(x,base-sc(m),70,sc(m),col,'none',4)+TB(x+35,base-sc(m)-7,String(Math.round(m)),14,C.ink);out+=TF(x+35,base+18,l,13,C.muted)+TF(x+35,base+35,a.length+(a.length===1?' trial':' trials'),13,C.muted)});
  const d=st.mn-st.mc,have=st.c.length>0&&st.n.length>0;
  if(have)out+=TB(465,316,`${s.sim?'Simulated':'Your'} difference: ${d>=0?'+':'−'}${Math.abs(Math.round(d))} ms`,14,C.ink);
  out+=TF(465,338,'Dehaene et al. (1998): about +24 ms',13,C.muted)+TF(465,356,'(incongruent slower than congruent)',13,C.muted);
  if(st.err&&!s.sim)out+=T(cx,290,`${st.err} wrong answer${st.err>1?'s':''} left out of the means`,13,C.muted);
  const phase=s.sim?'A simulated observer with the published effect built in. With only eight trials of each kind the difference between the bars is mostly noise, which is the difficulty with small effects.':s.ph==='done'&&have?`Your incongruent trials were ${Math.abs(Math.round(d))} ms ${d>=0?'slower':'faster'} than your congruent ones. Either result is normal: with eight trials of each kind, chance differences are larger than the published effect, which came from many trials and many people. Could you read the grey numbers? If so, any priming here was not unconscious.`:s.ph==='idle'?'A grey number appears very briefly, a mask covers it, then a clear number stays until you answer. Half the grey numbers fall on the same side of 5 as the clear one.':'Answer as soon as you can tell which side of 5 the clear number is on.';
  return {svg:out,phase};
 }});

// Toy world for the awareness-check problem: priming depends only on how visible the prime truly was.
const K2_AWN=200,K2_AWT=[10,20,40,80,160,320],K2_awCache={};
function K2_aw(n){if(K2_awCache[n])return K2_awCache[n];const r=rng(977),out=[];
 for(let i=0;i<K2_AWN;i++){const a=r()*.2,eff=150*a+K2_gauss(r)*5,u=rng(i*7919+13);let k=0;for(let j=0;j<n;j++)if(u()<.5+a)k++;out.push({a,eff,score:k/n})}
 const sel=out.filter(p=>p.score<=.5);
 return K2_awCache[n]={out,sel,selA:K2_mean(sel.map(p=>p.a)),selEff:K2_mean(sel.map(p=>p.eff)),allEff:K2_mean(out.map(p=>p.eff))}}
SCENE({id:'masking-awareness',name:'Was it really unseen?',tag:'The awareness check, and why it is contested',
 definition:'A claim of unconscious priming needs two things: an effect of the prime, and proof that the prime was not seen. The proof is usually a separate awareness test, often short. Daniel Holender (1986) argued that such tests were too weak to rule out glimpses. David Shanks (2017) showed a further trap: if you keep only the people who scored at chance on a noisy awareness test, many of them saw more than their score says, and a priming effect in that group proves little.',
 example:'The best-known claim of subliminal influence, James Vicary’s 1957 report that messages flashed in a cinema raised sales of popcorn and cola, was never published as a study; in 1962 Vicary said he had too little data for it to mean anything. Laboratory masked priming is a real but small effect, and how much of it is unconscious is disputed.',
 desc:'A toy simulation of 200 people. Each dot plots a person’s score on an awareness test against how well they could truly see the prime; people scoring at or below chance are marked as counted unaware, with their true accuracy and priming effect.',
 research:['Holender, D. (1986). Semantic activation without conscious identification in dichotic listening, parafoveal vision, and visual masking: a survey and appraisal. Behavioral and Brain Sciences 9, 1–23.','Shanks, D. R. (2017). Regressive research: the pitfalls of post hoc data selection in the study of unconscious mental processes. Psychonomic Bulletin & Review 24, 752–775.','Vadillo, M. A., Konstantinidis, E. & Shanks, D. R. (2016). Underpowered samples, false negatives, and unconscious learning. Psychonomic Bulletin & Review 23, 87–102. Status: unconscious semantic priming is contested.'],
 dur:11,hint:'Change the length of the awareness test. In this toy world priming comes only from seeing the prime, so any priming among the “unaware” is an artefact of the test.',
 init:()=>({ti:1}),
 watch(p){return {ti:Math.min(5,Math.floor(p*6))}},
 ui:[{range:'ti',label:'Awareness test length',min:0,max:5,step:1,get:s=>s.ti,act:'ti',show:v=>K2_AWT[v]+' trials'}],
 on:{ti(s,v){s.ti=clamp(Math.round(Number(v)),0,5);return 'keep'}},
 draw(s){
  const n=K2_AWT[s.ti],d=K2_aw(n);let out=heading('Toy model: who gets counted as “unaware”?');
  const pl=K2_plot(70,70,270,210,[.2,.9],[.5,.7],{xt:[[.3,'30%'],[.5,'50%'],[.7,'70%'],[.9,'90%']],yt:[[.5,'50%'],[.6,'60%'],[.7,'70%']],xl:'score on the awareness test',yl:'true accuracy on the prime'});
  out+=R(70,70,pl.X(.5)-70,210,C.coralp,'none',0)+pl.svg+L(pl.X(.5),70,pl.X(.5),280,C.coral,1.5,'stroke-dasharray="4 4"')+T(76,86,'counted unaware',13,C.coral,'start');
  d.out.forEach(q=>out+=Ci(pl.X(clamp(q.score,.2,.9)),pl.Y(.5+q.a),3,q.score<=.5?C.coral:C.blue,'none','opacity=".65"'));
  out+=TB(372,84,'Toy simulation',14,C.amber,'start')+TF(372,102,'200 simulated people;',13,C.muted,'start')+TF(372,119,'no unconscious priming built in',13,C.muted,'start');
  out+=counter(372,134,'counted “unaware”',`${d.sel.length} of ${K2_AWN}`,C.coral,200);
  out+=counter(372,188,'their true accuracy on the prime',d.sel.length?K2_pct(.5+d.selA):'none',C.ink,200);
  out+=counter(372,242,'their priming effect',d.sel.length?`${d.selEff>=0?'+':'−'}${Math.abs(d.selEff).toFixed(1)} ms`:'none',C.coral,200);
  out+=T(472,308,`everyone together: +${d.allEff.toFixed(1)} ms`,13,C.muted);
  out+=T(300,352,'Every dot above 50% on the vertical axis could see the prime a little.',13,C.muted);
  return {svg:out,phase:`With a ${n}-trial awareness test, ${d.sel.length} people score at or below chance, yet their true accuracy on the prime averages ${d.sel.length?K2_pct(.5+d.selA):'no value'} and their priming effect averages ${d.sel.length?(d.selEff<0?'−':'')+Math.abs(d.selEff).toFixed(1):'0'} ms. ${d.selEff>2?'It looks unconscious and is not.':'Little is left to explain.'} ${s.ti<3?'Lengthen the test and the artefact shrinks.':'A longer test lets fewer aware people through, and the apparent effect shrinks.'}`};
 }});

/* =========================== blindsight =========================== */
const K2_BE=[10,20,30,40,50,60];
function K2_corr(a){if(a.length<3)return null;const mx=K2_mean(a.map(t=>t.e)),my=K2_mean(a.map(t=>t.p));let sxy=0,sxx=0,syy=0;for(const t of a){sxy+=(t.e-mx)*(t.p-my);sxx+=(t.e-mx)**2;syy+=(t.p-my)**2}return sxx>0&&syy>0?sxy/Math.sqrt(sxx*syy):null}
function K2_bTrial(seed,n,k,blind){const r=rng(seed*31+n*101+7);r();return {e:K2_BE[k],blind,p:clamp(K2_BE[k]+K2_gauss(r)*(blind?9:3),0,70)}}
SCENE({id:'blindsight',name:'Blindsight',tag:'Responding to what you say you cannot see',
 definition:'Blindsight is the ability of some people with damage to the primary visual cortex (V1) to respond to things in the blind part of their visual field while saying that they see nothing there. Lawrence Weiskrantz, Elizabeth Warrington, Michael Sanders and John Marshall described it in 1974 in a patient known as DB; the name is Weiskrantz’s.',
 example:'DB had part of his right visual cortex removed in 1973, which left him blind in the left half of his visual field. Asked to point to a light flashed in that half, he said he was only guessing, yet his pointing followed the position of the light. He could also tell an X from an O and horizontal from vertical lines well above chance.',
 desc:'A simulated patient facing a screen with a blind left field and a sighted right field. The learner flashes a light at one of six positions; the patient reports whether he saw it and points, and a scatter plot compares where the light was with where he pointed.',
 research:['Weiskrantz, L., Warrington, E. K., Sanders, M. D. & Marshall, J. (1974). Visual capacity in the hemianopic field following a restricted occipital ablation. Brain 97, 709–728.','Pöppel, E., Held, R. & Frost, D. (1973). Residual visual function after brain wounds involving the central visual pathways in man. Nature 243, 295–296. The phenomenon is robust; what the patients experience is contested (third scene).'],
 dur:11,hint:'Choose the blind or the sighted field, then press a position to flash a light there. The patient is simulated: his answers follow the pattern reported for DB, not DB’s own numbers.',
 init:()=>({field:'blind',seed:5,tr:[]}),
 watch(p){const n=Math.floor(p*13),tr=[],order=[2,5,0,3,1,4,5,2,0,4,1,3];for(let i=0;i<Math.min(12,n);i++)tr.push(K2_bTrial(5,i,order[i],true));return {field:'blind',seed:5,tr,sim:true}},
 ui:[{choose:[['blind','Blind field (left)'],['sighted','Sighted field (right)']],label:'Where to flash the light',get:s=>s.field,act:'field'},{b:'Clear trials',act:'clear'}],
 on:{field(s,v){s.field=v;return 'keep'},clear(s){s.tr=[]},
  show(s,v){s.tr.push(K2_bTrial(s.seed,s.tr.length,Number(v),s.field==='blind'));if(s.tr.length>30)s.tr.shift();return 'keep'}},
 draw(s,f,X){
  let out=heading('A simulated patient points to a light');
  out+=R(20,46,560,104,'#fff',C.grid,8)+R(22,48,278,100,C.coralp,'none',0)+L(300,48,300,148,C.line,1.5,'stroke-dasharray="4 4"');
  out+=T(160,64,'blind field',13,C.coral)+T(440,64,'sighted field',13,C.green)+TB(300,104,'+',18,C.ink);
  const last=s.tr[s.tr.length-1],px=(e,blind)=>blind?300-e*4.2:300+e*4.2,blindNow=s.field==='blind';
  K2_BE.forEach((e,k)=>{const x=px(e,blindNow),lit=last&&last.e===e&&last.blind===blindNow;
   out+=hit(X,'show',k,`Flash a light ${e} degrees into the ${blindNow?'blind':'sighted'} field`,Ci(x,100,10,lit?'#f4be3c':'#fff',C.blue))+T(x,134,e+'°',13,C.muted)});
  if(last&&last.blind===blindNow){const x=px(last.p,last.blind);out+=`<polygon points="${fmt(x)},86 ${fmt(x-7)},72 ${fmt(x+7)},72" fill="${C.coral}"/>`}
  const say=!last?'Press a circle to flash a light at that position.':last.blind?'“I didn’t see anything. I’m only guessing.”':'“Yes, I saw the light.”';
  out+=R(120,158,360,30,last?C.pale:'#fff',C.line,15)+T(300,178,say,13,C.ink);
  const pl=K2_plot(70,222,150,110,[0,70],[0,70],{xt:[[10,'10'],[40,'40'],[70,'70']],yt:[[10,'10'],[40,'40'],[70,'70']],xl:'light was at (°)',yl:'pointed to (°)'});out+=pl.svg+L(pl.X(0),pl.Y(0),pl.X(70),pl.Y(70),C.grid,1.5,'stroke-dasharray="4 4"');
  s.tr.forEach(t=>out+=Ci(pl.X(t.e),pl.Y(t.p),4,t.blind?C.coral:C.green,'#fff'));
  const B=s.tr.filter(t=>t.blind),S=s.tr.filter(t=>!t.blind),rb=K2_corr(B),rs=K2_corr(S);
  out+=TB(270,232,'Simulated patient',14,C.amber,'start')+T(270,250,'in the pattern reported for DB (1974)',13,C.muted,'start');
  out+=Ci(276,276,5,C.coral)+T(288,280,`blind field: ${B.length} trial${B.length===1?'':'s'}${rb===null?'':', r = '+rb.toFixed(2)}`,13,C.ink,'start');
  out+=Ci(276,300,5,C.green)+T(288,304,`sighted field: ${S.length} trial${S.length===1?'':'s'}${rs===null?'':', r = '+rs.toFixed(2)}`,13,C.ink,'start');
  out+=T(270,332,'r near 1: pointing follows the light.',13,C.muted,'start')+T(270,350,'The arrow marks where he pointed.',13,C.muted,'start');
  const phase=!s.tr.length?'The left half of this patient’s visual field is blind. Flash a light there and see what he says and where he points.':rb!==null?`In the blind field he reports seeing nothing, yet his pointing tracks the light (r = ${rb.toFixed(2)} over ${B.length} trials). It is less exact than in the sighted field, and he calls every answer a guess.`:'A few more trials in the blind field will show whether his “guesses” follow the light.';
  return {svg:out,phase};
 }});

const K2_PATH_TXT={
 '000':'All routes intact: normal sight. Most visual signals reach the cortex through the LGN and V1.',
 '100':'V1 lost: the condition of blindsight. No reported seeing in the matching part of the field, but forced-choice responses stay above chance (Weiskrantz et al. 1974; in monkeys, Cowey & Stoerig 1995).',
 '110':'V1 lost and the LGN silenced: in monkeys, detection in the blind field fell to chance and responses in higher visual areas disappeared (Schmid et al. 2010).',
 '101':'V1 and the superior colliculus lost: monkeys could no longer move their eyes to targets in that part of the field (Mohler & Wurtz 1977).',
 '010':'LGN silenced: this cuts the supply to V1 as well as the direct route, so sight is lost in the matching part of the field.',
 '001':'Superior colliculus lost, V1 intact: in monkeys, eye movements to targets were only mildly affected (Mohler & Wurtz 1977).',
 '011':'LGN and superior colliculus both out: neither route in this diagram reaches the cortex. The studies cited here did not test this combination.',
 '111':'All three out: neither route in this diagram reaches the cortex. The studies cited here did not test this combination.'};
SCENE({id:'blindsight-pathways',name:'Routes around V1',tag:'Which pathway carries blindsight?',
 definition:'Most signals from the eye reach the cortex through the lateral geniculate nucleus (LGN) of the thalamus and then V1. Two smaller routes bypass V1: one from the LGN straight to higher visual areas, and one through the superior colliculus in the midbrain and the pulvinar. Blindsight is thought to depend on these, but experiments disagree about which matters most.',
 example:'In monkeys with V1 damage, silencing the LGN abolished the remaining detection (Schmid and colleagues, 2010), which points to the direct LGN route. Earlier, removing the superior colliculus as well as V1 abolished eye movements to targets (Mohler and Wurtz, 1977), which points to the other route. The tasks and methods differed, and the question is not settled.',
 desc:'A diagram of the eye, LGN, V1, superior colliculus, pulvinar and higher visual areas joined by three routes. The learner switches V1, the LGN or the superior colliculus off and reads what the cited experiments found for that combination.',
 research:['Mohler, C. W. & Wurtz, R. H. (1977). Role of striate cortex and superior colliculus in visual guidance of saccadic eye movements in monkeys. Journal of Neurophysiology 40, 74–94.','Cowey, A. & Stoerig, P. (1995). Blindsight in monkeys. Nature 373, 247–249.','Schmid, M. C. et al. (2010). Blindsight depends on the lateral geniculate nucleus. Nature 466, 373–377.','Cowey, A. (2010). The blindsight saga. Experimental Brain Research 200, 3–24. Which route is essential remains unresolved.'],
 dur:11,hint:'Press V1, LGN or SC to switch that station off or on, and read what the cited studies found. The diagram is a simplification; real connections are many more.',
 init:()=>({v1:1,lgn:0,sc:0}),
 watch(p){const seq=[[0,0,0],[1,0,0],[1,1,0],[1,0,1]],q=seq[Math.min(3,Math.floor(p*4))];return {v1:q[0],lgn:q[1],sc:q[2],p}},
 ui:[{b:'Restore all',act:'all'}],
 on:{tog(s,k){s[k]=s[k]?0:1;return 'keep'},all(s){s.v1=0;s.lgn=0;s.sc=0}},
 draw(s,f,X){
  let out=heading('Three routes from eye to higher visual areas');
  const N={eye:[60,170],lgn:[205,105],v1:[365,105],hi:[525,170],sc:[205,240],pul:[365,240]};
  const lgnOn=!s.lgn,v1On=lgnOn&&!s.v1,scOn=!s.sc;
  const seg=(a,b,on,col)=>arrowR(N[a],N[b],a==='eye'?30:34,b==='hi'?40:36,on?col:C.grid,on?3.2:2);
  out+=seg('eye','lgn',true,C.blue)+seg('lgn','v1',lgnOn,C.blue)+seg('v1','hi',v1On,C.blue);
  out+=seg('eye','sc',true,C.green)+seg('sc','pul',scOn,C.green)+seg('pul','hi',scOn,C.green);
  out+=curveArrow(232,130,485,172,36,lgnOn?C.purple:C.grid,lgnOn?2.6:2);
  out+=T(285,90,'main route',13,v1On?C.blue:C.muted)+T(300,196,'direct route',13,lgnOn?C.purple:C.muted)+T(285,281,'collicular route',13,scOn?C.green:C.muted);
  const node=(k,lab,sub,off,tog)=>{const [x,y]=N[k];const inner=R(x-34,y-24,68,48,off?C.coralp:'#fff',off?C.coral:C.blue,10,off?'stroke-dasharray="5 4"':'')+TBF(x,y+(sub?-1:5),lab,15,off?C.coral:C.ink)+(sub?TF(x,y+16,off?'off':sub,13,off?C.coral:C.muted):'');
   return tog?hit(X,'tog',k,`${lab}: ${off?'off':'on'}. Press to switch.`,inner):inner};
  out+=Ci(60,170,28,'#fff',C.blue)+TBF(60,175,'eye',15,C.ink);
  out+=node('lgn','LGN','thalamus',s.lgn,true)+node('v1','V1','cortex',s.v1,true)+node('sc','SC','midbrain',s.sc,true)+node('pul','pulvinar','',false,false);
  out+=R(485,146,80,48,'#fff',C.blue,10)+TBF(525,166,'higher',14,C.ink)+TBF(525,183,'areas',14,C.ink);
  if(s.p!==undefined){const u=.25+.5*((s.p*4)%1),dot=(a,b,col)=>Ci(lerp(N[a][0],N[b][0],u),lerp(N[a][1],N[b][1],u),5,col);
   out+=dot('eye','lgn',C.blue)+dot('eye','sc',C.green)+(v1On?dot('v1','hi',C.blue):'')+(scOn?dot('sc','pul',C.green):'')}
  out+=R(20,292,560,82,C.pale,'none',8)+K2_lines(34,312,K2_PATH_TXT[`${s.v1}${s.lgn}${s.sc}`],84,C.ink,'start',18,4);
  return {svg:out,phase:s.v1&&!s.lgn&&!s.sc?'With V1 out, two routes still reach higher visual areas. Switch off a second station to see which experiments implicate which route.':'Different experiments, with different tasks, have made each of the two bypass routes look necessary. Which carries blindsight is still argued over.'};
 }});

// Fixed standard-normal samples so that only the criterion (and d′) changes what the simulated patient says.
const K2_CZ=(()=>{const r=rng(4242),g=()=>range(12).map(()=>K2_gauss(r));return {s:g(),n:g(),s2:g(),n2:g()}})();
SCENE({id:'blindsight-criterion',name:'Blind, or cautious?',tag:'The criterion debate',
 definition:'Asking “did you see it?” measures two things at once: how well the signal is picked up (sensitivity, d′) and how much evidence the person needs before saying yes (the criterion). A forced choice between two alternatives depends very little on the criterion. So “I see nothing” together with good forced-choice performance could mean vision without awareness, or weak conscious vision reported with great caution.',
 example:'With sensitivity d′ = 1.5 and a strict criterion of 2.2, a simulated patient says “yes, I saw it” on only about 24% of the trials that had a light, yet picks the right one of two alternatives about 86% of the time. Nothing about the signal differs between the two tasks.',
 desc:'Two overlapping bell curves for trials with and without a light, a movable criterion line, the resulting yes rates, the forced-choice accuracy, and two rows of twelve simulated trials.',
 research:['Campion, J., Latto, R. & Smith, Y. M. (1983). Is blindsight an effect of scattered light, spared cortex, and near-threshold vision? Behavioral and Brain Sciences 6, 423–486.','Azzopardi, P. & Cowey, A. (1997). Is blindsight like normal, near-threshold vision? PNAS 94, 14190–14194.','Phillips, I. (2021). Blindsight is qualitatively degraded conscious vision. Psychological Review 128, 558–584. Status: contested.'],
 dur:11,hint:'Slide the criterion to make the simulated patient more or less cautious. Watch the yes answers change while the forced-choice score stays put. Then change the sensitivity.',
 init:()=>({k:2.2,d:1.5}),
 watch(p){return {k:+lerp(.4,3,smooth(p)).toFixed(2),d:1.5}},
 ui:[{range:'k',label:'Criterion (caution)',min:-.5,max:3.5,step:.1,get:s=>s.k,act:'k',show:v=>Number(v).toFixed(1)},{range:'d',label:'Sensitivity d′',min:0,max:3,step:.1,get:s=>s.d,act:'d',show:v=>Number(v).toFixed(1)}],
 on:{k(s,v){s.k=Number(v);return 'keep'},d(s,v){s.d=Number(v);return 'keep'}},
 draw(s){
  const H=K2_Phi(s.d-s.k),F=K2_Phi(-s.k),fc=K2_Phi(s.d/Math.SQRT2),pdf=(x,m)=>.3989*Math.exp(-(x-m)*(x-m)/2);
  let out=heading('Same signal, two questions');
  const pl=K2_plot(40,64,290,120,[-3,5.5],[0,.42],{xl:'strength of the internal response'});
  const area=[[pl.X(s.k),pl.Y(0)]],cn=[],cs=[];for(let x=-3;x<=5.5;x+=.1){cn.push([pl.X(x),pl.Y(pdf(x,0))]);cs.push([pl.X(x),pl.Y(pdf(x,s.d))]);if(x>=s.k)area.push([pl.X(x),pl.Y(pdf(x,s.d))])}
  area.push([pl.X(5.5),pl.Y(0)]);
  out+=`<polygon points="${area.map(q=>fmt(q[0])+','+fmt(q[1])).join(' ')}" fill="${C.pale}"/>`+pl.svg+K2_poly(cn,C.muted,2,'stroke-dasharray="5 4"')+K2_poly(cs,C.blue,2.5);
  out+=L(pl.X(s.k),58,pl.X(s.k),184,C.coral,2.5)+TB(clamp(pl.X(s.k),70,300),52,'criterion',13,C.coral);
  out+=T(pl.X(0)-30,82,'no light',13,C.muted,'end')+T(pl.X(Math.max(s.d,1.2))+34,82,'light',13,C.blue,'start');
  out+=TBF(356,76,'Yes or no: “did you see it?”',14,C.ink,'start')+T(356,98,`light shown, says yes: ${K2_pct(H)}`,13,C.blue,'start')+T(356,117,`no light, says yes: ${K2_pct(F)}`,13,C.muted,'start');
  out+=TBF(356,150,'Forced choice: “which one?”',14,C.ink,'start')+T(356,172,`picks correctly: ${K2_pct(fc)}`,13,C.green,'start')+T(356,191,'the criterion plays no part',13,C.muted,'start');
  const yes=K2_CZ.s.map(z=>s.d+z>s.k),right=K2_CZ.s2.map((z,i)=>s.d+z>K2_CZ.n2[i]);
  out+=T(40,250,'12 simulated trials with a light: does the patient say yes?',13,C.ink,'start');
  yes.forEach((y,i)=>out+=R(40+i*31,258,27,27,y?C.blue:'#fff',y?C.blue:C.line,5)+TB(53.5+i*31,276,y?'yes':'no',13,y?'#fff':C.muted));
  out+=TB(424,277,`yes on ${yes.filter(Boolean).length} of 12`,14,C.blue,'start');
  out+=T(40,312,'12 simulated forced-choice trials: is the pick right?',13,C.ink,'start');
  right.forEach((y,i)=>out+=R(40+i*31,320,27,27,y?C.green:'#fff',y?C.green:C.line,5)+TB(53.5+i*31,338,y?'✓':'×',14,y?'#fff':C.muted));
  out+=TB(424,339,`right on ${right.filter(Boolean).length} of 12`,14,C.green,'start');
  const phase=s.d<.15?'With no sensitivity at all, forced choice sits at 50% wherever the criterion is: caution cannot create blindsight on its own.':`Moving the criterion changes the yes rate (${K2_pct(H)} now) and leaves forced choice at ${K2_pct(fc)}. Critics say blindsight may be this. Azzopardi and Cowey (1997) tested patient GY both ways and found a difference that a shifted criterion alone does not predict; Phillips (2021) argues the case is still open.`;
  return {svg:out,phase};
 }});

/* =========================== binocular-rivalry =========================== */
// Gamma distribution with shape 3: cumulative probability, and seeded samples (sum of three exponentials).
const K2_gCdf3=(x,th)=>{const u=x/th;return 1-Math.exp(-u)*(1+u+u*u/2)};
const K2_g3=r=>{let g=0;for(let j=0;j<3;j++)g+=-Math.log(Math.max(1e-9,r()));return g};
const K2_NSIM=(()=>{const r=rng(83);return range(40).map(()=>Math.max(1,K2_g3(r)*1.2))})();
const K2_median=a=>{if(!a.length)return 0;const b=a.slice().sort((x,y)=>x-y),m=b.length>>1;return b.length%2?b[m]:(b[m-1]+b[m])/2};
function K2_cube(cx,cy,front){const s=96,o=44,ax=cx-70,ay=cy-26,bx=ax+o,by=ay-o;let out='';
 if(front===0)out+=R(ax,ay,s,s,C.pale,'none',0);if(front===1)out+=R(bx,by,s,s,C.amberp,'none',0);
 out+=R(ax,ay,s,s,'none',C.ink,0)+R(bx,by,s,s,'none',C.ink,0);
 [[0,0],[s,0],[0,s],[s,s]].forEach(([dx,dy])=>out+=L(ax+dx,ay+dy,bx+dx,by+dy,C.ink,2));return out}
function K2_vase(cx,cy){const pr=[[0,-48],[20,-40],[45,-30],[60,-34],[85,-14],[95,-24],[105,-18],[112,-23],[120,-17],[130,-26],[145,-20],[160,-36],[180,-50]],top=cy-90;
 const left=pr.map(([y,x])=>[cx+x,top+y]),right=pr.slice().reverse().map(([y,x])=>[cx-x,top+y]);
 return R(cx-90,top,180,180,C.dark,'none',0)+`<polygon points="${left.concat(right).map(q=>fmt(q[0])+','+fmt(q[1])).join(' ')}" fill="#fff"/>`}
SCENE({id:'binocular-rivalry',name:'One picture, two experiences',tag:'You take part: time the flips',
 definition:'A bistable figure is one unchanging picture that can be seen in two ways, and after a few seconds of looking it switches between them on its own. Louis Albert Necker described the reversing cube in 1832, after noticing it in drawings of crystals; Edgar Rubin published the vase that becomes two faces in 1915. Because the picture stays the same while the experience changes, the change must arise in the brain.',
 example:'Stare at the cube. Sometimes the lower-left square is the front face and you look down on the cube; sometimes the upper-right square is the front and you look up at it. Most spells last a few seconds, a few last much longer, so a histogram of their lengths has a long tail to the right.',
 desc:'A Necker cube or Rubin’s vase beside a histogram of how long each way of seeing lasted, with a skewed curve of the kind reported in the literature.',
 research:['Necker, L. A. (1832). Observations on some remarkable optical phaenomena seen in Switzerland; and on an optical phaenomenon which occurs on viewing a figure of a crystal or geometrical solid. London and Edinburgh Philosophical Magazine 1, 329–337.','Rubin, E. (1915). Synsoplevede Figurer. Gyldendal.','Levelt, W. J. M. (1967). Note on the distribution of dominance times in binocular rivalry. British Journal of Psychology 58, 143–145; Borsellino, A. et al. (1972). Reversal time distribution in the perception of visual ambiguous stimuli. Kybernetik 10, 139–144. The right-skewed shape is robust; rates differ a great deal between people.'],
 dur:14,hint:'Press Start watching, keep your eyes on the figure, and press It flipped (or the space bar while that button has focus) each time it switches. Ten or more flips give a fair histogram. Your times stay on this page.',
 init:()=>({fig:'cube',run:false,last:0,durs:[]}),
 watch(p){const t=p*28;let acc=0,i=0;while(i<39&&acc+K2_NSIM[i]<t){acc+=K2_NSIM[i];i++}return {fig:'cube',run:true,durs:K2_NSIM,sim:true,view:i%2}},
 ui:[{choose:[['cube','Necker cube'],['vase','Rubin’s vase']],label:'Figure',get:s=>s.fig,act:'fig'},{b:'Start watching',act:'start'},{b:'It flipped',act:'flip'},{b:'Clear',act:'clear'}],
 on:{fig(s,v){s.fig=v;s.run=false;s.durs=[]},start(s){s.run=true;s.last=performance.now();return 'keep'},clear(s){s.run=false;s.durs=[]},
  flip(s){if(!s.run)return 'keep';const now=performance.now(),d=(now-s.last)/1000;if(d<.3)return 'keep';s.durs.push(d);s.last=now;return 'keep'}},
 draw(s,f,X){
  let out=heading(s.sim?'Simulated observer: how long each view lasts':s.fig==='cube'?'Which square is the front face?':'A vase, or two faces?');
  out+=s.fig==='cube'?K2_cube(150,150,s.sim?s.view:-1):K2_vase(150,152);
  if(s.sim)out+=TF(150,268,s.view?'now seen from below (upper square in front)':'now seen from above (lower square in front)',13,s.view?C.amber:C.blue);
  else out+=s.run?K2_btn(X,'flip','','It flipped: record the time',60,262,180,44,'It flipped',C.coral):K2_btn(X,'start','','Start watching the figure',60,262,180,44,'Start watching');
  const n=s.durs.length,mean=K2_mean(s.durs),bins=range(11).map(()=>0);s.durs.forEach(d=>bins[Math.min(10,Math.floor(d))]++);
  const top=Math.max(4,...bins),pl=K2_plot(340,70,230,150,[0,11],[0,top],{xt:[[0,'0'],[5,'5'],[10,'10+']],yt:[[0,'0'],[top,String(top)]],xl:'length of each spell (s)',yl:'number of spells'});out+=pl.svg;
  bins.forEach((c,i)=>{if(c)out+=R(pl.X(i)+2,pl.Y(c),pl.X(1)-pl.X(0)-4,pl.Y(0)-pl.Y(c),s.sim?'#9cc3dd':C.blue,'none',2)});
  if(n>=5){const th=mean/3,pts=range(11).map(i=>[pl.X(i+.5),pl.Y(Math.min(top,n*((i===10?1:K2_gCdf3(i+1,th))-K2_gCdf3(i,th))))]);out+=K2_poly(pts,C.green,2.2,'stroke-dasharray="6 4"')}
  out+=T(455,284,n?`${n} spell${n===1?'':'s'} · mean ${mean.toFixed(1)} s · median ${K2_median(s.durs).toFixed(1)} s`:'no flips recorded yet',13,C.ink);
  out+=TF(455,306,'dashed: a skewed (gamma) curve with',13,C.muted)+TF(455,323,`${n>=5?'the same mean as these data':'your mean, after five flips'}`,13,C.muted);
  out+=T(300,352,s.sim?'The cube is tinted here only to show what the simulated observer sees.':'The drawing never changes. Only your reading of it does.',13,C.muted);
  const phase=s.sim?'A simulated observer’s 40 spells: most last two to five seconds and a few last much longer, the right-skewed shape found for both bistable figures and binocular rivalry.':n>=5?`Your ${n} spells average ${mean.toFixed(1)} s with a median of ${K2_median(s.durs).toFixed(1)} s. ${mean>K2_median(s.durs)?'A mean above the median is the long right tail reported since the 1960s.':'With more flips the long right tail usually appears.'} People differ widely in rate; no value is better.`:s.run?'Keep looking at the figure and press It flipped each time your view of it switches. If it does not flip for a while, that is normal too.':'Nothing on the screen will change. Press Start watching and report each switch as it happens.';
  return {svg:out,phase};
 },
 three(s,f,X,project){
  const P=project([[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,1,1],[1,1,1]]);
  let out=paintFaces(prism(0,0,0,1,1,1,C.blue),P);
  [[[0,0,0],[1,0,0]],[[1,0,0],[1,1,0]],[[1,1,0],[0,1,0]],[[0,1,0],[0,0,0]],[[0,0,1],[1,0,1]],[[1,0,1],[1,1,1]],[[1,1,1],[0,1,1]],[[0,1,1],[0,0,1]],[[0,0,0],[0,0,1]],[[1,0,0],[1,0,1]],[[1,1,0],[1,1,1]],[[0,1,0],[0,1,1]]].forEach(([a,b])=>out+=line3(a,b,P,C.ink,1.6,'opacity=".55"'));
  return {svg:out,title:'The cube as a solid',caption:'Give the cube shaded faces and the depth is settled: it stops flipping. The ambiguity belongs to the flat line drawing, which fits two solid cubes equally well.'};
 }});

// Toy rivalry timeline: unit-mean gamma(3) spells scaled by each eye's mean dominance time; spells are kept
// to at least half a second so that the animated percept never switches more than twice a second.
const K2_RU=(()=>{const r=rng(515);return range(70).map(()=>K2_g3(r)/3)})();
function K2_rTime(cl,cr){const TL=2*(cl/cr)/(cl+cr),TR=2*(cr/cl)/(cl+cr),seg=[];let t=0,eye=0,i=0;
 while(t<30&&i<70){const d=Math.max(.5,K2_RU[i]*(eye?TR:TL));seg.push({eye,t0:t,t1:Math.min(30,t+d)});t+=d;eye=1-eye;i++}
 const left=sum(seg.filter(q=>!q.eye).map(q=>q.t1-q.t0));return {seg,TL,TR,left:left/30,sw:seg.length-1}}
function K2_grating(x,y,eye,op,size=90){let o=R(x,y,size,size,'#fff',C.line,6);const col=eye?C.coral:C.blue;
 for(let i=0;i<5;i++){const q=8+i*(size-16)/4.6;o+=eye?L(x+q,y+8,x+q,y+size-8,col,7,`opacity="${fmt(op)}"`):L(x+8,y+q,x+size-8,y+q,col,7,`opacity="${fmt(op)}"`)}return o}
SCENE({id:'binocular-rivalry-eyes',name:'Binocular rivalry',tag:'A different picture in each eye (simulated)',
 definition:'When each eye is shown a different picture in the same place, the two do not blend. You see one, then the other, in alternation, although nothing in front of the eyes changes. Charles Wheatstone described this in 1838 with his stereoscope. Willem Levelt’s 1965 study found that strengthening one eye’s picture makes it dominate for more of the time, and that strengthening both makes the switches come faster.',
 example:'True binocular rivalry needs a separate image for each eye. One screen cannot do that without a stereoscope or coloured glasses, so this scene simulates an observer. The bistable figures in the previous scene behave in a similar way and need no equipment.',
 desc:'A horizontal grating for the left eye and a vertical grating for the right, a simulated percept between them, and a 30-second timeline of which picture dominates, with contrast sliders for each eye.',
 research:['Wheatstone, C. (1838). Contributions to the physiology of vision, Part the first. Philosophical Transactions of the Royal Society 128, 371–394.','Levelt, W. J. M. (1965). On Binocular Rivalry. Institute for Perception RVO-TNO, Soesterberg.','Blake, R. & Logothetis, N. K. (2002). Visual competition. Nature Reviews Neuroscience 3, 13–21. The two effects of contrast shown here are robust; the timing model is a toy.'],
 dur:12,hint:'Change the contrast of either eye’s picture and read the timeline. Press Play 30 s to watch the simulated percept switch. This is a toy model that follows the direction of Levelt’s findings.',
 init:()=>({cl:.6,cr:.6,t:0,play:false}),
 watch(p){return {cl:p<.5?.6:1,cr:.6,t:p*12,play:true,sim:true}},
 ui:[{range:'cl',label:'Left eye contrast',min:.2,max:1,step:.05,get:s=>s.cl,act:'cl',show:v=>K2_pct(v)},{range:'cr',label:'Right eye contrast',min:.2,max:1,step:.05,get:s=>s.cr,act:'cr',show:v=>K2_pct(v)},{b:'Play 30 s',act:'play'}],
 on:{cl(s,v){s.cl=Number(v);return 'keep'},cr(s,v){s.cr=Number(v);return 'keep'},
  play(s,a,ctx){if(s.play)return 'keep';s.play=true;s.t=0;ctx.every(100,'tick');return 'keep'},
  tick(s){if(!s.play)return 'stop';s.t=+(s.t+.1).toFixed(1);if(s.t>=30){s.play=false;s.t=0;return 'stop'}return 'keep'}},
 draw(s){
  const m=K2_rTime(s.cl,s.cr),now=m.seg.find(q=>s.t>=q.t0&&s.t<q.t1)||m.seg[0];
  let out=heading('Each eye gets its own picture');
  out+=K2_grating(60,52,0,s.cl)+K2_grating(450,52,1,s.cr)+K2_grating(255,52,now.eye,now.eye?s.cr:s.cl);
  out+=T(105,160,'left eye’s picture',13,C.blue)+T(495,160,'right eye’s picture',13,C.coral)+TB(300,160,s.play?'what is seen now':'what is seen first',13,C.ink);
  out+=arrow(156,97,247,97,C.blue,2)+arrow(444,97,353,97,C.coral,2);
  out+=TBF(40,196,'Toy model',13,C.amber,'start')+TF(112,196,'which picture dominates over 30 seconds (direction from Levelt)',13,C.muted,'start');
  const x=t=>40+t/30*520;m.seg.forEach(q=>out+=R(x(q.t0),208,Math.max(1,x(q.t1)-x(q.t0)-1),28,q.eye?C.coral:C.blue,'none',2));
  [0,10,20,30].forEach(t=>out+=L(x(t),238,x(t),244,C.line,1.5)+T(x(t),258,t+' s',13,C.muted));
  if(s.play)out+=L(x(s.t),202,x(s.t),242,C.ink,2.5);
  out+=counter(40,276,'left picture seen',K2_pct(m.left),C.blue,160)+counter(220,276,'switches in 30 s',String(m.sw),C.ink,160)+counter(400,276,'mean spell: left / right',`${m.TL.toFixed(1)} s / ${m.TR.toFixed(1)} s`,C.ink,160);
  out+=T(300,350,'The pictures never change; only the simulated experience alternates.',13,C.muted);
  const phase=Math.abs(s.cl-s.cr)<.03?`With equal contrast the two pictures share the time about evenly, switching ${m.sw} times in 30 seconds. Raise both contrasts and the switches come faster.`:`The ${s.cl>s.cr?'left':'right'} eye’s picture is stronger, so it is seen for more of the time (left: ${K2_pct(m.left)}). The weaker picture still breaks through: stronger input shifts the balance without ending the rivalry.`;
  return {svg:out,phase};
 }});

const K2_AREAS=[['V1 and V2','early visual cortex',4],['V4 and MT','middle stages',8],['IT and STS','temporal lobe',18]];
SCENE({id:'binocular-rivalry-neurons',name:'Neurons that follow the percept',tag:'Stimulus or experience?',
 definition:'Nikos Logothetis and colleagues trained monkeys to report with levers which of two rival pictures they were seeing, and recorded single neurons meanwhile. The pictures stayed fixed, so a cell whose firing changed with the report was following the percept, not the stimulus. The share of such cells rose along the visual pathway.',
 example:'In rounded figures from these studies, about 20% of the cells tested in V1 and V2 changed with the reported percept, about 40% in V4 and MT, and about 90% in the temporal-lobe areas IT and STS. Most early cells kept firing to their preferred picture whether or not the monkey reported seeing it.',
 desc:'Twenty schematic cells from a chosen visual area. Pressing the switch flips the reported percept; cells that follow the percept change their firing and the rest do not. A bar chart shows the rounded share of percept-following cells in three groups of areas.',
 research:['Leopold, D. A. & Logothetis, N. K. (1996). Activity changes in early visual cortex reflect monkeys’ percepts during binocular rivalry. Nature 379, 549–553.','Sheinberg, D. L. & Logothetis, N. K. (1997). The role of temporal cortical areas in perceptual organization. PNAS 94, 3408–3413.','Polonsky, A., Blake, R., Braun, J. & Heeger, D. J. (2000). Neuronal activity in human primary visual cortex correlates with perception during binocular rivalry. Nature Neuroscience 3, 1153–1159. Single-cell and brain-imaging results disagree about V1.'],
 dur:12,hint:'Choose a group of areas, then press Switch the percept and count the cells that change. The cells are schematic; the shares are rounded from the monkey recordings.',
 init:()=>({area:0,per:0}),
 watch(p){return {area:Math.min(2,Math.floor(p*3)),per:Math.floor(p*9)%2}},
 ui:[{choose:K2_AREAS.map((a,i)=>[i,a[0]]),label:'Visual areas',get:s=>s.area,act:'area'},{b:'Switch the percept',act:'per'}],
 on:{area(s,v){s.area=Number(v);return 'keep'},per(s){s.per=1-s.per;return 'keep'}},
 draw(s,f,X){
  const A=K2_AREAS[s.area],k=A[2],order=shuffled(range(20),97+s.area);let out=heading('The pictures stay put; the report changes');
  out+=K2_grating(40,48,0,.8,56)+K2_grating(104,48,1,.8,56)+TF(100,122,'in the eyes: both, unchanged',13,C.muted);
  out+=arrow(172,76,216,76,C.line,2)+K2_grating(226,48,s.per,.8,56)+TB(254,122,'reported',13,C.ink);
  out+=K2_btn(X,'per','','Switch the reported percept',40,134,250,34,'Switch the percept',C.coral);
  out+=TB(40,190,`20 cells in ${A[0]}`,14,C.ink,'start');
  for(let i=0;i<20;i++){const x=58+(i%5)*52,y=216+Math.floor(i/5)*38,rank=order.indexOf(i),fol=rank<k,pref=rank%2,on=fol?pref===s.per:true;
   out+=Ci(x,y,14,fol?(on?'#f4be3c':'#fff'):'#cfe0ec',fol?C.amber:C.line)+(fol?TB(x,y+5,on?'↑':'↓',14,on?C.ink:C.muted):'')}
  out+=Ci(52,366,7,'#f4be3c',C.amber)+TF(64,370,'follows the percept',13,C.ink,'start')+Ci(196,366,7,'#cfe0ec',C.line)+TF(208,370,'follows the picture',13,C.ink,'start');
  const base=290,bw=58;out+=L(340,base,580,base,C.line,2)+T(460,62,'cells that follow the percept',13,C.muted);
  K2_AREAS.forEach((a,i)=>{const x=356+i*74,h=a[2]/20*190,sel=i===s.area;
   out+=hit(X,'area',i,`${a[0]}: about ${a[2]*5}% of cells follow the percept`,R(x,base-h,bw,h,sel?C.amber:'#e8d9b5','none',4))+TB(x+bw/2,base-h-7,`about ${a[2]*5}%`,13,C.ink)+TF(x+bw/2,base+18,a[0],13,sel?C.ink:C.muted)});
  out+=T(460,base+40,'earlier  →  later in the visual pathway',13,C.muted)+TBF(460,base+64,`here: ${k} of 20 change with the report`,13,C.amber);
  return {svg:out,phase:`In ${A[0]} (${A[1]}), about ${k*5}% of recorded cells changed with what the monkey reported. Two cautions: brain imaging in humans finds a clear rivalry signal in V1 as well, and a cell that follows the report may reflect deciding and reporting as much as seeing.`};
 }});

/* =========================== inattentional-blindness =========================== */
// Six shapes bounce in a box for 8 seconds (160 ticks of 50 ms). Positions and bounce counts are exact
// functions of time, so the count the learner is scored against is never an estimate.
const K2_IB={x0:42,x1:558,y0:64,y1:250,T:160,t0:2.2,v:115};
function K2_ibObjs(seed,trial){const r=rng(seed*977+trial*131+17);r();return range(6).map(i=>{const sp=80+r()*45,a=(.25+r()*.5)*Math.PI/2+Math.floor(r()*4)*Math.PI/2;return {att:i<3,x:90+r()*420,y:90+r()*130,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp}})}
function K2_refl(p0,v,t,lo,hi){const W=hi-lo,q=p0-lo+v*t;let u=q%(2*W);if(u<0)u+=2*W;return {pos:lo+(u<=W?u:2*W-u),b:Math.abs(Math.floor(q/W))}}
function K2_ibAt(objs,t){let b=0;const pts=objs.map(o=>{const x=K2_refl(o.x,o.vx,t,K2_IB.x0,K2_IB.x1),y=K2_refl(o.y,o.vy,t,K2_IB.y0,K2_IB.y1);if(o.att)b+=x.b+y.b;return {att:o.att,x:x.pos,y:y.pos}});return {pts,b}}
const K2_cross=(x,y,col=C.coral,sz=11)=>L(x-sz,y,x+sz,y,col,7)+L(x,y-sz,x,y+sz,col,7);
function K2_ibBox(objs,t,showCross){const a=K2_ibAt(objs,t);let out=R(30,52,540,210,'#f7fafc',C.line,6);
 a.pts.forEach(q=>out+=q.att?Ci(q.x,q.y,12,C.blue):R(q.x-11,q.y-11,22,22,'#8a979f','none',3));
 const cx=30+(t-K2_IB.t0)*K2_IB.v;if(showCross&&cx>=30&&cx<=570)out+=G(K2_cross(clamp(cx,42,558),157));
 return {svg:out,b:a.b}}
const K2_ibCrit=seed=>1+seed%2;
SCENE({id:'inattentional-blindness',name:'Counting bounces',tag:'You take part: an attention task',
 definition:'Inattentional blindness is the failure to notice something fully visible and unexpected while attention is busy with something else. Ulric Neisser’s selective-looking films of the 1970s first showed it; Arien Mack and Irvin Rock named it and studied it in thousands of observers (1998); Daniel Simons and Christopher Chabris made it famous in 1999.',
 example:'In Simons and Chabris’s study, observers counted basketball passes while a person in a gorilla suit or a woman with an umbrella walked through the game. About half did not notice. In Mack and Rock’s experiments about a quarter of observers missed an unexpected shape near the cross they were judging, and more missed it when it appeared exactly where they were looking.',
 desc:'A box in which three blue discs and three grey squares bounce for eight seconds while the learner counts the bounces of the blue discs, followed by questions and an explanation of what happened.',
 research:['Mack, A. & Rock, I. (1998). Inattentional Blindness. MIT Press.','Simons, D. J. & Chabris, C. F. (1999). Gorillas in our midst: sustained inattentional blindness for dynamic events. Perception 28, 1059–1074.','Most, S. B. et al. (2001). How not to be seen: the contribution of similarity and selective ignoring to sustained inattentional blindness. Psychological Science 12, 9–17 (the moving-shapes version used here). Status: robust and often replicated.'],
 dur:14,hint:'Press Start trial and count every time a blue disc touches an edge of the box. Ignore the grey squares. There are up to three trials of eight seconds; your answers stay on this page.',
 init:()=>({seed:7,trial:0,ph:'idle',tick:0,guess:0,log:[],seen:null}),
 watch(p){return p<.72?{seed:7,trial:2,ph:'run',tick:Math.floor(p/.72*160),sim:true,log:[]}:{seed:7,trial:2,ph:'reveal',tick:160,sim:true,seen:false,log:[]}},
 ui:[{b:'Start trial',act:'start'},{b:'Start again',act:'again'}],
 on:{start(s,a,ctx){if(s.ph!=='idle'&&s.ph!=='fb')return 'keep';if(s.ph==='fb')s.trial++;s.ph='run';s.tick=0;ctx.every(50,'tick');return 'keep'},
  tick(s){if(s.ph!=='run')return 'stop';s.tick++;if(s.tick>=K2_IB.T){s.ph='count';s.guess=0;return 'stop'}return 'keep'},
  adj(s,v){if(s.ph!=='count')return 'keep';s.guess=clamp(s.guess+Number(v),0,40);return 'keep'},
  ok(s){if(s.ph!=='count')return 'keep';const crit=s.trial===K2_ibCrit(s.seed);s.log.push({n:K2_ibAt(K2_ibObjs(s.seed,s.trial),8).b,g:s.guess});s.ph=crit?'ask':'fb';return 'keep'},
  seen(s,v){if(s.ph!=='ask')return 'keep';s.seen=v==='1';s.ph='reveal';return 'keep'},
  again(s){s.seed=nextSeed()%997+1;s.trial=0;s.ph='idle';s.tick=0;s.guess=0;s.log=[];s.seen=null}},
 draw(s,f,X){
  const objs=K2_ibObjs(s.seed,s.trial),crit=s.trial===K2_ibCrit(s.seed)||s.sim,t=s.ph==='run'?s.tick*.05:s.ph==='idle'?0:8;
  let out=heading(s.ph==='reveal'?'What crossed the box':'Count the bounces of the blue discs');
  const box=K2_ibBox(objs,t,crit&&s.ph==='run');out+=box.svg;
  const lastLog=s.log[s.log.length-1];
  if(s.ph==='idle')out+=R(150,128,300,58,'#fff',C.line,8)+T(300,152,'Count each time a blue disc',13,C.ink)+T(300,170,'touches an edge of the box.',13,C.ink)+K2_btn(X,'start','','Start trial 1',210,282,180,44,'Start trial 1');
  if(s.ph==='run')out+=s.sim?TB(300,292,`Simulated observer’s count so far: ${box.b}`,14,C.ink)+T(300,314,'(a learner sees no running count)',13,C.muted):T(300,296,`trial ${s.trial+1}: keep counting`,13,C.muted);
  if(s.ph==='count')out+=TB(300,288,'How many bounces did you count?',14,C.ink)+K2_btn(X,'adj','-1','One fewer',180,302,50,44,'−')+R(240,302,120,44,'#fff',C.line,8)+TB(300,332,String(s.guess),22,C.ink)+K2_btn(X,'adj','1','One more',370,302,50,44,'+')+K2_btn(X,'ok','','Confirm my count',440,302,90,44,'OK',C.green);
  if(s.ph==='fb'&&lastLog)out+=TB(300,290,`You counted ${lastLog.g}; the blue discs bounced ${lastLog.n} times.`,14,C.ink)+K2_btn(X,'start','','Start the next trial',210,306,180,44,`Start trial ${s.trial+2}`);
  if(s.ph==='ask')out+=TB(300,288,'Did you see anything other than discs and squares?',14,C.ink)+K2_btn(X,'seen','1','Yes, I saw something else',150,304,130,44,'Yes')+K2_btn(X,'seen','0','No, nothing else',320,304,130,44,'No',C.coral);
  if(s.ph==='reveal'){out+=L(42,157,558,157,C.coral,2,'stroke-dasharray="7 6"')+K2_cross(300,157)+R(176,176,248,28,'#fff',C.coral,14)+T(300,195,'a cross passed along this line for 4.7 s',13,C.coral);
   out+=TB(300,288,s.sim?'The simulated observer counted correctly and reported nothing else.':s.seen?'You noticed it. About half of observers do.':'You did not notice it. That is the usual result.',14,C.ink);
   out+=T(300,310,'In Simons & Chabris (1999), 46% of observers missed the unexpected event.',13,C.muted);
   if(!s.sim&&lastLog)out+=T(300,330,`Your count on that trial: ${lastLog.g}; true count: ${lastLog.n}.`,13,C.muted);
   out+=T(300,352,s.sim?'In Try it nothing is announced. The demonstration works only once.':'Nothing was announced, on purpose. Now that you know, it will not work again.',13,C.muted)}
  const phase=s.ph==='reveal'?(s.sim?'A coral cross crossed the middle of the box in plain view for almost five seconds while the simulated observer counted. Many real observers miss it too.':`${s.seen?'You saw the cross.':'A coral cross crossed the middle of the box for almost five seconds and you did not report it.'} Either outcome is normal and says nothing about eyesight or intelligence: attention set for blue discs tends to pass over what it is not set for. The cross was left unannounced because expecting it removes the effect; that is the only thing this scene kept from you.`):s.ph==='idle'?'Three blue discs and three grey squares will move for eight seconds. Your job is the blue discs only.':s.ph==='count'?'Set your count with − and +, then press OK.':s.ph==='ask'?'One more question about that trial.':s.ph==='fb'?'Counts within one or two of the true number are typical. Ready for the next trial?':'Count the blue discs’ bounces.';
  return {svg:out,phase};
 }});

const K2_STUD=[
 {k:'Neisser (1979)',what:'Viewers followed one of two ball games filmed on top of each other. A woman with an open umbrella walked through the picture.',n:28,hit:6,show:28,fill:6,per:14,note:'6 of 28 viewers (21%)'},
 {k:'Simons & Chabris (1999)',what:'Observers counted passes in a filmed basketball game. A woman with an umbrella, or a person in a gorilla suit, walked through.',n:192,hit:null,show:50,fill:27,per:17,note:'54% of 192 observers; each marker is about 4 people'},
 {k:'Drew, Võ & Wolfe (2013)',what:'Radiologists searched lung scans for nodules. A picture of a gorilla, 48 times the size of an average nodule, had been added to one scan.',n:24,hit:4,show:24,fill:4,per:12,note:'4 of 24 radiologists (17%)'}];
SCENE({id:'inattentional-blindness-gorilla',name:'How many noticed?',tag:'Guess first, then see the result',
 definition:'People are confident that they would notice something as odd as a gorilla. The published numbers say otherwise, and the gap between the two is part of the finding. The effect holds for experts looking at the material they are trained to read, which is why it matters for driving, flying and reading medical images.',
 example:'Across all conditions of Simons and Chabris’s study, 54% of 192 observers noticed the unexpected person and 46% did not. In Drew, Võ and Wolfe’s study, 20 of 24 radiologists did not report a gorilla inserted into a lung scan, although eye tracking showed that most of those who missed it had looked straight at it.',
 desc:'A description of one of three studies, a slider for the learner’s guess of the percentage who noticed, and, once revealed, the published percentage shown as a row of person markers.',
 research:['Neisser, U. (1979). The control of information pickup in selective looking. In A. D. Pick (ed.), Perception and its Development, 201–219. Erlbaum.','Simons, D. J. & Chabris, C. F. (1999). Gorillas in our midst. Perception 28, 1059–1074.','Drew, T., Võ, M. L.-H. & Wolfe, J. M. (2013). The invisible gorilla strikes again: sustained inattentional blindness in expert observers. Psychological Science 24, 1848–1853. Status: robust.'],
 dur:12,hint:'Pick a study, set your guess for the share of people who noticed, then press Reveal.',
 init:()=>({st:1,guess:80,shown:false}),
 watch(p){const st=Math.min(2,Math.floor(p*3)),u=p*3-st;return {st,guess:80,shown:u>.45,sim:true}},
 ui:[{choose:K2_STUD.map((q,i)=>[i,q.k]),label:'Study',get:s=>s.st,act:'st'},{range:'guess',label:'My guess: share who noticed',min:0,max:100,step:1,get:s=>s.guess,act:'guess',show:v=>v+'%'},{b:'Reveal',act:'reveal'}],
 on:{st(s,v){s.st=Number(v);s.shown=false;return 'keep'},guess(s,v){s.guess=Number(v);return 'keep'},reveal(s){s.shown=true;return 'keep'}},
 draw(s,f,X){
  const q=K2_STUD[s.st],truth=Math.round(q.fill/q.show*100);let out=heading(q.k);
  out+=K2_lines(300,58,q.what,80,C.ink,'middle',18,3);
  const x=v=>70+v/100*460;out+=T(300,128,'share of people who noticed the unexpected thing',13,C.muted);
  out+=R(70,138,460,18,C.pale,'none',9)+[0,25,50,75,100].map(v=>L(x(v),158,x(v),164,C.line,1.5)+T(x(v),178,v+'%',13,C.muted)).join('');
  out+=Ci(x(s.guess),147,9,C.blue,'#fff')+TB(clamp(x(s.guess),110,490),200,`${s.sim?'a typical guess':'your guess'}: ${s.guess}%`,13,C.blue);
  if(s.shown){out+=L(x(truth),132,x(truth),162,C.coral,3)+TB(clamp(x(truth),110,490),222,`published: ${truth}%`,13,C.coral);
   const w=(q.per-1)*22,x0=300-w/2;out+=K2_people(x0,252,q.show,q.fill,q.per,C.coral);
   out+=T(300,252+Math.ceil(q.show/q.per)*30+8,`filled = noticed: ${q.note}`,13,C.ink)}
  else out+=s.sim?T(300,270,'…',20,C.muted):K2_btn(X,'reveal','','Reveal the published result',210,250,180,44,'Reveal');
  const d=s.guess-truth;
  return {svg:out,phase:!s.shown?'Before you look: what share of people do you think noticed?':`${truth}% noticed. ${s.sim?'Most people guess far higher.':Math.abs(d)<=10?'Your guess was close.':d>0?`Your guess was ${d} points too high, which is the common direction: people expect to notice far more than they do.`:`Your guess was ${-d} points too low.`} ${s.st===2?'Expertise did not protect the radiologists; they were searching for nodules, not gorillas.':s.st===0?'Neisser’s films, made in the 1970s, were the model for the later gorilla study.':'The share who noticed fell when the counting task was made harder.'}`};
 }});

SCENE({id:'inattentional-blindness-set',name:'What gets through',tag:'Attentional set, and what the blindness means',
 definition:'Whether an unexpected object is noticed depends on what attention is set for. Steven Most and colleagues (2001) found that an unexpected shape was noticed by nearly everyone when it shared the colour of the shapes being tracked and by very few when it shared the colour of the shapes being ignored. A harder task also lowers noticing. What the misses mean is debated: Mack and Rock concluded that there is no conscious perception without attention; Jeremy Wolfe (1999) suggested the object may be seen and at once forgotten, “inattentional amnesia”.',
 example:'Track the white shapes and a white cross is hard to miss, while a black cross slips by; track the black shapes and it is the other way round. The same object, at the same place, for the same time.',
 desc:'A box of light and dark shapes with an unexpected cross whose shade the learner sets, the set of shapes being tracked, and a bar giving an illustrative share of observers who would notice the cross.',
 research:['Most, S. B. et al. (2001). How not to be seen. Psychological Science 12, 9–17.','Most, S. B., Scholl, B. J., Clifford, E. R. & Simons, D. J. (2005). What you see is what you set: sustained inattentional blindness and the capture of awareness. Psychological Review 112, 217–242.','Cartwright-Finch, U. & Lavie, N. (2007). The role of perceptual load in inattentional blindness. Cognition 102, 321–340.','Wolfe, J. M. (1999). Inattentional amnesia. In V. Coltheart (ed.), Fleeting Memories, 71–94. MIT Press. The direction of these effects is robust; their interpretation is contested.'],
 dur:11,hint:'Choose which shapes the observer tracks, slide the shade of the unexpected cross, and switch the task between easy and hard. The percentages are illustrative; only their direction comes from the studies.',
 init:()=>({att:'light',shade:.2,hard:0}),
 watch(p){return {att:p<.5?'light':'dark',shade:+(p<.5?p*2:(p-.5)*2).toFixed(2),hard:0}},
 ui:[{choose:[['light','Track the light shapes'],['dark','Track the dark shapes']],label:'Attended set',get:s=>s.att,act:'att'},{range:'shade',label:'Shade of the unexpected cross',min:0,max:1,step:.05,get:s=>s.shade,act:'shade',show:v=>v<.25?'dark':v>.75?'light':'mid grey'},{choose:[[0,'Easy task'],[1,'Hard task']],label:'Task difficulty',get:s=>s.hard,act:'hard'}],
 on:{att(s,v){s.att=v;return 'keep'},shade(s,v){s.shade=Number(v);return 'keep'},hard(s,v){s.hard=Number(v);return 'keep'}},
 draw(s){
  const g=v=>{const n=Math.round(40+v*200).toString(16).padStart(2,'0');return '#'+n+n+n},sim=1-Math.abs(s.shade-(s.att==='light'?1:0)),rate=Math.round((8+86*sim)*(s.hard?.75:1));
  let out=heading('The same cross, noticed or not');
  out+=R(30,50,330,200,'#9aa7ae','none',6);
  [[80,95,1],[250,110,1],[150,205,1],[310,200,0],[110,150,0],[215,70,0]].forEach(([x,y,light])=>{const tracked=(light===1)===(s.att==='light');
   out+=(light?Ci(x,y,13,g(1)):R(x-12,y-12,24,24,g(0),'none',3))+(tracked?Ci(x,y,21,'none',C.amber,'stroke-dasharray="4 4"'):'')});
  out+=K2_cross(205,150,g(s.shade),13)+T(195,268,'dashed rings: the shapes being tracked',13,C.muted);
  out+=TB(390,70,'Illustrative numbers',14,C.amber,'start')+TF(390,88,'only the direction comes',13,C.muted,'start')+TF(390,105,'from the studies',13,C.muted,'start');
  out+=R(390,126,180,26,C.pale,'none',6)+R(390,126,180*rate/100,26,C.coral,'none',6)+TB(390,176,`${rate}% would notice`,15,C.coral,'start');
  out+=TF(390,200,`cross is ${sim>.75?'like the tracked shapes':sim<.25?'like the ignored shapes':'between the two sets'}`,13,C.ink,'start')+T(390,220,`task: ${s.hard?'hard':'easy'}`,13,C.ink,'start');
  out+=R(30,288,540,78,C.pale,'none',8)+TB(44,308,'Two readings of a miss',13,C.ink,'start')+TF(44,328,'Blindness: without attention the cross was never consciously seen (Mack & Rock).',13,C.ink,'start')+TF(44,348,'Amnesia: it was seen for a moment and forgotten before the question (Wolfe).',13,C.ink,'start');
  return {svg:out,phase:`${sim>.75?'A cross that matches what the observer is tracking is picked up by the same setting of attention.':sim<.25?'A cross that matches the ignored shapes is filtered out along with them.':'A cross between the two sets is noticed by some observers and missed by others.'} A report after the event cannot tell blindness from rapid forgetting, which is one reason the meaning of these results is still argued over.`};
 }});

/* =========================== change-blindness =========================== */
// A seeded picture of twelve shapes, and one change to it: a new colour, a disappearance or a small move.
const K2_CBC=['#1772b7','#c45238','#2c776c','#7156a6','#d49a1c','#546873'];
function K2_cbPic(seed,onlyColour){const r=rng(seed*613+29);r();
 const objs=range(12).map(i=>({x:62+(i%4)*92+(r()-.5)*30,y:92+Math.floor(i/4)*72+(r()-.5)*22,sh:Math.floor(r()*3),c:Math.floor(r()*6),sz:14+Math.floor(r()*3)*3}));
 const k=Math.floor(r()*12),kind=onlyColour?0:Math.floor(r()*3),c2=(objs[k].c+2+Math.floor(r()*3))%6;return {objs,k,kind,c2}}
function K2_cbShape(o,col){const z=o.sz;return o.sh===0?Ci(o.x,o.y,z,col):o.sh===1?R(o.x-z,o.y-z,2*z,2*z,col,'none',3):`<polygon points="${fmt(o.x)},${fmt(o.y-z)} ${fmt(o.x+z)},${fmt(o.y+z*.85)} ${fmt(o.x-z)},${fmt(o.y+z*.85)}" fill="${col}"/>`}
// The object as it appears in version img (0 or 1) of the picture; '' when it has disappeared.
function K2_cbObj(pic,i,img,colOverride){const o=pic.objs[i],ch=i===pic.k&&img===1;
 if(ch&&pic.kind===1)return '';
 const oo=ch&&pic.kind===2?{...o,x:o.x+(i%4===3?-28:28)}:o;
 return K2_cbShape(oo,colOverride&&i===pic.k?colOverride:K2_CBC[ch&&pic.kind===0?pic.c2:o.c])}
function K2_cbDraw(X,pic,img,o={}){let out=R(20,50,380,232,'#eef3f6',C.line,6);
 pic.objs.forEach((ob,i)=>{const inner=R(ob.x-26,ob.y-26,52,52,'transparent','none',6)+K2_cbObj(pic,i,img,o.col);out+=o.pick?hit(X,'pick',i,'Object '+(i+1),inner):inner});
 if(o.ring){const ob=pic.objs[pic.k];out+=Ci(ob.x,ob.y,34,'none',C.coral,'stroke-dasharray="6 5"')}
 if(o.ov>0)out+=R(20,50,380,232,'#c3ced5','none',6,`opacity="${fmt(o.ov)}" pointer-events="none"`);
 return out}
const K2_cbKind=['changes colour','disappears and returns','moves sideways'];
SCENE({id:'change-blindness',name:'Find the change',tag:'You take part: two pictures, one difference',
 definition:'Change blindness is the failure to notice a change, even a large one, when it happens during a brief interruption such as a blank, a blink or an eye movement. Ronald Rensink, Kevin O’Regan and James Clark (1997) alternated a photograph with an altered copy, with a blank between them, until the observer found the difference. Without the blank the change is seen at once, because it produces a local flicker that draws attention.',
 example:'In their study, changes to things of central interest in a picture took 7.3 alternations to find on average, and changes of marginal interest took 17.1, about 11 seconds of looking straight at the picture. This scene uses a slow grey fade in place of their fast flicker, so compare the number of alternations, not the seconds.',
 desc:'A picture of twelve coloured shapes that alternates slowly with an altered copy, separated by a soft grey fade. The learner presses the shape that changes, and the number of alternations needed is shown beside the published averages.',
 research:['Rensink, R. A., O’Regan, J. K. & Clark, J. J. (1997). To see or not to see: the need for attention to perceive changes in scenes. Psychological Science 8, 368–373.','Simons, D. J. & Rensink, R. A. (2005). Change blindness: past, present, and future. Trends in Cognitive Sciences 9, 16–20. Status: robust. The grey fade here is slower and softer than the original flicker, for safety.'],
 dur:14,hint:'Press Start, then press the shape that changes between the two versions. Try it again with No gap to see why the interruption matters. Your times stay on this page.',
 init:()=>({seed:2,mode:'gap',ph:'idle',img:0,ov:0,t0:0,swaps:0,miss:0,found:null,run:0}),
 watch(p){const t=p*14,c=t%2.4,half=Math.floor(t/2.4),img=(half+(c>=1.95?1:0))%2,ov=c<1.5?0:c<1.8?(c-1.5)/.3:c<2.1?1:(2.4-c)/.3,done=t>12.2;return {seed:2,mode:'gap',ph:done?'found':'run',img:done?1:img,ov:done?0:ov,swaps:Math.min(5,half+(c>=1.95?1:0)),miss:0,found:done?{t:12.2,swaps:5}:null,sim:true}},
 ui:[{choose:[['gap','Grey fade between'],['none','No gap']],label:'Between the two versions',get:s=>s.mode,act:'mode'},{b:'Start',act:'start'},{b:'Show me',act:'reveal'},{b:'New picture',act:'fresh'}],
 on:{mode(s,v){s.mode=v;s.ph='idle';s.ov=0;s.img=0;s.found=null;s.run++},
  start(s,a,ctx){s.run++;s.ph='run';s.img=0;s.ov=0;s.swaps=0;s.miss=0;s.found=null;s.t0=performance.now();ctx.later(s.mode==='gap'?1500:2400,'step',s.run+':0');return 'keep'},
  step(s,v,ctx){const [run,j]=String(v).split(':').map(Number);if(run!==s.run||s.ph!=='run')return 'keep';
   if(s.mode!=='gap'){s.img=1-s.img;s.swaps++;ctx.later(2400,'step',run+':0');return 'keep'}
   const ov=[.35,.7,1,1,.7,.35,0][j],dt=[100,100,100,300,100,100,1500][j];s.ov=ov;if(j===3){s.img=1-s.img;s.swaps++}
   ctx.later(dt,'step',run+':'+((j+1)%7));return 'keep'},
  pick(s,v){if(s.ph!=='run')return 'keep';if(Number(v)===K2_cbPic(s.seed).k){s.found={t:(performance.now()-s.t0)/1000,swaps:s.swaps};s.ph='found';s.ov=0}else s.miss++;return 'keep'},
  reveal(s){if(s.ph==='found')return 'keep';s.ph='shown';s.ov=0;s.run++;return 'keep'},
  fresh(s){s.seed=nextSeed()%997+1;s.ph='idle';s.ov=0;s.img=0;s.found=null;s.miss=0;s.swaps=0;s.run++}},
 draw(s,f,X){
  const pic=K2_cbPic(s.seed),ended=s.ph==='found'||s.ph==='shown';
  let out=heading(s.sim?'Simulated observer: searching for the change':s.ph==='found'?'Found it':'Which shape changes?');
  out+=K2_cbDraw(X,pic,s.img,{pick:s.ph==='run'&&!s.sim,ring:ended,ov:s.ov});
  out+=TF(210,302,s.ph==='idle'?'Press Start. The picture will alternate with an altered copy.':ended?`The ringed shape ${K2_cbKind[pic.kind]}.`:`version ${s.img?'B':'A'} · ${s.swaps} alternation${s.swaps===1?'':'s'} so far`,13,C.muted);
  out+=TB(414,66,'Alternations needed',14,C.ink,'start');
  const bar=(y,lab,v,col)=>TF(414,y,lab,13,C.muted,'start')+R(414,y+6,Math.max(2,Math.min(20,v)/20*150),14,col,'none',3)+TBF(420+Math.min(20,v)/20*150,y+18,String(v),13,C.ink,'start');
  out+=bar(90,s.sim?'simulated observer':'you',s.found?s.found.swaps:s.swaps,C.blue)+bar(140,'published: central interest',7.3,'#9cc3dd')+bar(190,'published: marginal interest',17.1,'#9cc3dd');
  out+=K2_lines(414,246,s.found?`${s.sim?'Search time':'Your time'}: ${s.found.t.toFixed(1)} s, with ${s.miss} wrong press${s.miss===1?'':'es'}.`:s.ph==='shown'?'Shown without being found. That happens to most people on some pictures.':'Published averages: Rensink et al. (1997).',27,C.ink,'start',17,3);
  out+=K2_lines(414,304,'Their pictures switched much faster: compare counts, not seconds.',27,C.muted,'start',17,3);
  out+=T(300,366,s.mode==='gap'?'Each version shows for 1.5 s; a soft grey fade hides the moment of change.':'With no gap, the change itself is visible as a sudden jump.',13,C.muted);
  const phase=s.sim?'A simulated observer needs five alternations here. Until attention lands on the right shape, the change is not seen, although nothing hides the shape itself.':s.ph==='found'?`You needed ${s.found.swaps} alternation${s.found.swaps===1?'':'s'}${s.mode==='gap'?'. Taking several is normal: only the shapes you attend to are compared from one version to the next.':' with no gap: the jump draws attention straight to the place.'}`:s.ph==='run'?'Look for the one shape that differs between version A and version B, and press it.':'A picture of twelve shapes will alternate with a copy in which one shape is different.';
  return {svg:out,phase};
 }});

const K2_mix=(a,b,u)=>'#'+[1,3,5].map(i=>Math.round(lerp(parseInt(a.slice(i,i+2),16),parseInt(b.slice(i,i+2),16),clamp(u,0,1))).toString(16).padStart(2,'0')).join('');
// Six "mudsplash" patches at seeded places away from the changing shape.
function K2_splashes(pic){const r=rng(pic.k*17+91),o=pic.objs[pic.k];let out='',n=0,guard=0;while(n<6&&guard++<80){const x=40+r()*330,y=66+r()*196;if(Math.hypot(x-o.x,y-o.y)<70)continue;out+=R(x-14,y-9,28,18,C.dark,'none',7,'pointer-events="none"');n++}return out}
SCENE({id:'change-blindness-mudsplash',name:'Slow changes and mudsplashes',tag:'You take part: no blank needed',
 definition:'The whole picture does not have to be interrupted. Kevin O’Regan, Ronald Rensink and James Clark (1999) showed that a few small patches appearing elsewhere at the moment of the change, like mud splashing on a windscreen, are enough to hide it. Daniel Simons, Steven Franconeri and Rebecca Reimer (2000) showed that a change made gradually, with no interruption at all, is often missed as well.',
 example:'A shape that turns from blue to green over twelve seconds never produces a sudden signal for attention to catch. A shape that changes in one jump is hidden if six dark patches appear somewhere else at the same instant, even though none of them covers it.',
 desc:'A picture of twelve shapes in which one shape either changes colour gradually over twelve seconds or changes at the same moment that small dark patches appear elsewhere. The learner presses the shape that changed.',
 research:['O’Regan, J. K., Rensink, R. A. & Clark, J. J. (1999). Change-blindness as a result of “mudsplashes”. Nature 398, 34.','Simons, D. J., Franconeri, S. L. & Reimer, R. L. (2000). Change blindness in the absence of a visual disruption. Perception 29, 1143–1154. Status: robust.'],
 dur:14,hint:'Choose Gradual or Mudsplash, press Start and press the shape that changes. The patches appear once every 2.4 seconds. Press Show me if you cannot find it; many people cannot. Your times stay on this page.',
 init:()=>({seed:3,mode:'gradual',ph:'idle',img:0,sp:0,t0:0,el:0,miss:0,found:null,run:0}),
 watch(p){const t=p*14;return {seed:3,mode:'gradual',ph:t>12.5?'shown':'run',u:Math.min(1,t/12),miss:0,found:null,sim:true}},
 ui:[{choose:[['gradual','Gradual'],['splash','Mudsplash']],label:'Kind of change',get:s=>s.mode,act:'mode'},{b:'Start',act:'start'},{b:'Show me',act:'reveal'},{b:'New picture',act:'fresh'}],
 on:{mode(s,v){s.mode=v;s.ph='idle';s.img=0;s.sp=0;s.found=null;s.run++},
  start(s,a,ctx){s.run++;s.ph='run';s.img=0;s.sp=0;s.miss=0;s.found=null;s.el=0;s.t0=performance.now();if(s.mode==='splash')ctx.later(2200,'step',s.run+':0');return 'keep'},
  step(s,v,ctx){const [run,j]=String(v).split(':').map(Number);if(run!==s.run||s.ph!=='run')return 'keep';
   if(j===0){s.sp=1;s.img=1-s.img;ctx.later(200,'step',run+':1')}else{s.sp=0;ctx.later(2200,'step',run+':0')}return 'keep'},
  pick(s,v){if(s.ph!=='run')return 'keep';s.el=(performance.now()-s.t0)/1000;if(Number(v)===K2_cbPic(s.seed,s.mode==='gradual').k){s.found={t:s.el};s.ph='found';s.sp=0}else s.miss++;return 'keep'},
  reveal(s){if(s.ph==='found')return 'keep';s.el=(performance.now()-s.t0)/1000;s.ph='shown';s.sp=0;s.run++;return 'keep'},
  fresh(s){s.seed=nextSeed()%997+1;s.ph='idle';s.img=0;s.sp=0;s.found=null;s.miss=0;s.run++}},
 draw(s,f,X){
  const grad=s.mode==='gradual',pic=K2_cbPic(s.seed,grad),ended=s.ph==='found'||s.ph==='shown',o=pic.objs[pic.k],c1=K2_CBC[o.c],c2=K2_CBC[pic.c2];
  let out=heading(s.sim?'Simulated observer: a change with no interruption':grad?'One shape is slowly changing colour':'One shape changes when the patches appear');
  let col=null,extra='';
  if(grad){if(s.sim)col=K2_mix(c1,c2,s.u);else if(s.ph==='idle')col=c1;else if(ended&&s.el>=12)col=c2;
   else{col=c1;extra=`<style>@keyframes k2grad{from{fill:${c1}}to{fill:${c2}}}#k2chg>:last-child{animation:k2grad 12s linear both;animation-delay:-${fmt(Math.min(12,s.el))}s${ended?';animation-play-state:paused':''}}</style>`}}
  let picSvg=K2_cbDraw(X,pic,grad?0:s.img,{pick:s.ph==='run'&&!s.sim,ring:ended,col});
  out+=extra+(extra?picSvg.replace(`data-arg="${pic.k}"`,`data-arg="${pic.k}" id="k2chg"`):picSvg);
  if(extra&&ended)out+=G(K2_cbShape(o,col),'id="k2chg"');
  if(!grad&&s.sp)out+=K2_splashes(pic);
  out+=TF(210,302,s.ph==='idle'?'Press Start, then press the shape that changes.':ended?`The ringed shape ${grad?'changed colour over 12 seconds':K2_cbKind[pic.kind]}.`:grad?'The change takes 12 seconds and happens only once.':'Patches appear every 2.4 s; the change happens with them.',13,C.muted);
  out+=TB(414,66,grad?'Gradual change':'Mudsplash',14,C.ink,'start');
  out+=K2_lines(414,90,grad?'No blank, no blink, no cut: the colour drifts too slowly to make a signal that pulls attention.':'The patches never cover the changing shape. They make signals of their own elsewhere, and attention goes to them.',27,C.ink,'start',17,5);
  out+=K2_lines(414,196,s.found?`${s.sim?'Found':'You found it'} after ${s.found.t.toFixed(1)} s, with ${s.miss} wrong press${s.miss===1?'':'es'}.`:s.ph==='shown'?(s.sim?'The simulated observer did not find it in time.':'Shown without being found: a common result, not a failing.'):s.ph==='run'?`wrong presses so far: ${s.miss}`:'Your time will appear here.',27,C.blue,'start',17,3);
  out+=K2_lines(414,262,'Published: both kinds of change are often missed (1999, 2000).',27,C.muted,'start',17,3);
  out+=T(300,366,'Seeing a change seems to need attention at the right place at the right moment.',13,C.muted);
  const phase=s.sim?'One shape drifts to a new colour over twelve seconds in full view. With nothing sudden to catch attention, a simulated observer, like many real ones, does not find it until it is pointed out.':ended?(s.found?'You caught it. People who do usually happened to be attending to that shape; those who miss it are no less observant.':'Missing it is the ordinary outcome. The shape was visible throughout; what was absent was a signal telling attention where to go.'):s.ph==='run'?'Press the shape you think is changing.':'In both versions the changing shape stays in plain view the whole time.';
  return {svg:out,phase};
 }});

function K2_figure(x,y,col,label,hat){return Ci(x,y-74,13,'#f1d9c0',C.dark)+(hat?R(x-15,y-92,30,9,hat,'none',3):'')+R(x-16,y-58,32,46,col,'none',8)+L(x-8,y-12,x-8,y,C.dark,5)+L(x+8,y-12,x+8,y,C.dark,5)+(label?T(x,y+18,label,13,C.muted):'')}
const K2_DOOR=[
 {n:15,k:7,title:'Experiment 1',note:'15 pedestrians on a university campus',extra:'The seven who noticed were all about the experimenters’ own age.'},
 {n:12,k:4,title:'Experiment 2',note:'12 young pedestrians; experimenters dressed as builders',extra:'Seen as members of another group, the experimenters were swapped unnoticed more often.'}];
SCENE({id:'change-blindness-door',name:'The door study',tag:'A person swapped in mid-conversation',
 definition:'Daniel Simons and Daniel Levin (1998) tested change blindness outside the laboratory. An experimenter with a map asked a pedestrian for directions. Two people carrying a door walked between them, and behind the door a second experimenter, with different clothes, height and voice, took the first one’s place. The conversation then carried on.',
 example:'In the first experiment 7 of 15 pedestrians noticed that they were now talking to a different person; 8 did not. In the second, with the experimenters dressed as construction workers, 4 of 12 noticed. Most people who are asked predict that they would notice.',
 desc:'A storyboard in six steps: an experimenter asks a pedestrian for directions, a door is carried between them, a second experimenter takes the first one’s place, and the results of the chosen experiment are shown as markers.',
 research:['Simons, D. J. & Levin, D. T. (1998). Failure to detect changes to people during a real-world interaction. Psychonomic Bulletin & Review 5, 644–649.','Levin, D. T., Momen, N., Drivdahl, S. B. & Simons, D. J. (2000). Change blindness blindness: the metacognitive error of overestimating change-detection ability. Visual Cognition 7, 397–412. Status: robust; the samples in the door study were small.'],
 dur:14,hint:'Step through the storyboard, then switch between the two experiments to compare the results. This is a reconstruction; nobody is deceived here.',
 init:()=>({ex:0}),
 ui:[{choose:[[0,'Experiment 1'],[1,'Experiment 2']],label:'Experiment',get:s=>s.ex,act:'ex'}],
 on:{ex(s,v){s.ex=Number(v);return 'keep'}},
 trace(s){const d=K2_DOOR[s.ex];return [
  {k:0,say:'An experimenter holding a map stops a pedestrian and asks for directions.'},
  {k:1,say:'After a few seconds, two people carrying a door approach along the pavement.'},
  {k:2,say:'The door passes between them. Behind it, the first experimenter takes hold of the door and a second experimenter lets go and stays.'},
  {k:3,say:'The door moves on, taking the first experimenter with it. A different person now stands there with the map.'},
  {k:4,say:'The pedestrian carries on giving directions. Afterwards they are asked whether they noticed anything unusual.'},
  {k:5,say:`${d.title}: ${d.k} of ${d.n} pedestrians noticed the swap and ${d.n-d.k} did not. ${d.extra}`}]},
 draw(s,f){
  const k=f?f.k:0,d=K2_DOOR[s.ex],g=250,hat=s.ex?'#d49a1c':null;let out=heading(k<5?'A reconstruction of the door study':`${d.title}: who noticed?`);
  if(k<5){out+=L(30,g,570,g,C.line,2);
   out+=K2_figure(400,g,C.green,'pedestrian');
   const first=k<=1,second=k>=3;
   if(first)out+=K2_figure(290,g,C.blue,'experimenter A',hat)+R(308,g-52,26,20,'#fff',C.dark,2);
   if(second)out+=K2_figure(290,g,C.purple,'experimenter B',hat)+R(308,g-52,26,20,'#fff',C.dark,2);
   const dx=[null,60,190,400,null][k];
   if(dx!==null&&k>=1&&k<=3){out+=K2_figure(dx-14,g,'#8a979f','')+K2_figure(dx+164,g,k===3?C.blue:'#8a979f',k===3?'A leaves':'',k===3?hat:null)+R(dx,g-150,150,150,'#b98d5a',C.dark,3)+Ci(dx+132,g-74,4,C.dark)}
   if(k===2)out+=T(265,g+38,'hidden by the door: A and B change places',13,C.coral);
   out+=T(300,60,['“Excuse me, how do I get to…?”','two people carrying a door approach','the door passes between them','the door moves on','“…then turn left at the corner.”'][k],13,C.ink);
   out+=T(300,316,'A and B differed in clothes, height and voice.',13,C.muted)+T(300,338,`step ${k+1} of 6`,13,C.muted)}
  else{const w=(d.n-1)*30,x0=300-w/2;out+=T(300,70,d.note,13,C.ink)+K2_people(x0,120,d.n,d.k,d.n,C.coral,30);
   out+=TB(300,180,`${d.k} of ${d.n} noticed the swap (${Math.round(d.k/d.n*100)}%)`,15,C.coral)+T(300,204,`${d.n-d.k} carried on as if nothing had happened`,13,C.ink);
   out+=K2_lines(300,240,d.extra,70,C.ink,'middle',18,2);
   out+=R(60,286,480,66,C.pale,'none',8)+T(300,310,'Small samples: 15 and 12 people. The effect has been repeated,',13,C.muted)+T(300,330,'but the exact percentages should not be leaned on.',13,C.muted)}
  return {svg:out,phase:f?f.say:''};
 }});

/* =========================== attention-awareness =========================== */
// Posner cueing: 20 trials, 16 with a valid arrow cue and 4 invalid. This state is shared with the next scene,
// which draws the learner's own cueing effect beside a simulated patient's.
function K2_poTrials(seed){const r=rng(seed*71+9);r();return shuffled(range(20).map(i=>i<16),seed*5+1).map(valid=>{const side=r()<.5?0:1;return {valid,side,cue:valid?side:1-side,soa:500+Math.floor(r()*3)*200}})}
const K2_poInit=()=>({seed:6,i:0,ph:'idle',t0:0,res:[],run:0,gy:[],gcue:'sighted',gn:0});
function K2_poStats(res){const ok=res.filter(r=>r.ok&&r.rt>150&&r.rt<1500),v=ok.filter(r=>r.valid).map(r=>r.rt),n=ok.filter(r=>!r.valid).map(r=>r.rt);return {v,n,mv:K2_mean(v),mn:K2_mean(n),have:v.length>0&&n.length>0}}
function K2_poSim(n){const r=rng(47),tr=K2_poTrials(6),res=[];for(let i=0;i<n;i++)res.push({valid:tr[i].valid,rt:(tr[i].valid?330:372)+K2_gauss(r)*38,ok:true});return res}
const K2_hbar=(y,lab,m,n,col,x0=190,w=300,max=700)=>T(x0-10,y+11,lab,13,C.ink,'end')+R(x0,y,Math.max(0,Math.min(max,m)/max*w),15,col,'none',3)+(n?TB(x0+6+Math.min(max,m)/max*w,y+12,`${Math.round(m)} ms`,13,C.ink,'start'):T(x0+6,y+12,'no trials yet',13,C.muted,'start'));
SCENE({id:'attention-awareness',name:'Cueing attention',tag:'You take part: the Posner task',shared:'k2-posner',
 definition:'Attention is the selection of some information for fuller processing at the expense of the rest. Michael Posner (1980) measured it with a cue: an arrow says where a target will probably appear, and people respond faster there than at the other place, without moving their eyes. Attention and awareness usually go together. Christof Koch and Naotsugu Tsuchiya (2007) argued that they are nonetheless two processes, each of which can occur without the other; this lesson looks at the evidence and the objections.',
 example:'With an arrow that is right on four trials out of five, responses to targets at the cued side are typically some tens of milliseconds faster than responses at the uncued side. The eyes stay on the centre, so the advantage comes from where attention is, not from where the eyes point.',
 desc:'Two boxes either side of a central fixation mark. An arrow cue points to one side and a dot then appears in one box; the learner presses Left or Right, and bars show mean response time after valid and invalid cues.',
 research:['Posner, M. I. (1980). Orienting of attention. Quarterly Journal of Experimental Psychology 32, 3–25.','Posner, M. I., Snyder, C. R. R. & Davidson, B. J. (1980). Attention and the detection of signals. Journal of Experimental Psychology: General 109, 160–174.','Koch, C. & Tsuchiya, N. (2007). Attention and consciousness: two distinct brain processes. Trends in Cognitive Sciences 11, 16–22. The cueing effect is robust; the claim that attention and awareness are separate is contested.'],
 dur:12,hint:'Press Start and keep your eyes on the centre. When the dot appears, press Left or Right for its side as fast as you can. The arrow is right on 16 of 20 trials. Your times stay on this page.',
 init:K2_poInit,
 watch(p){const n=Math.min(20,Math.floor(p*21));return {...K2_poInit(),i:Math.min(19,n),ph:'film',k:Math.floor(p*9)%3,res:K2_poSim(n),sim:true}},
 ui:[{b:'Start',act:'start'}],
 on:{start(s,a,ctx){if(s.ph!=='idle'&&s.ph!=='done')return 'keep';if(s.ph==='done'){s.seed=nextSeed()%997+1;s.i=0;s.res=[]}s.run++;s.ph='fix';ctx.later(700,'cue',s.run);return 'keep'},
  cue(s,v,ctx){if(Number(v)!==s.run||s.ph!=='fix')return 'keep';s.ph='cue';ctx.later(K2_poTrials(s.seed)[s.i].soa,'tgt',s.run);return 'keep'},
  tgt(s,v){if(Number(v)!==s.run||s.ph!=='cue')return 'keep';s.ph='target';s.t0=performance.now();return 'keep'},
  ans(s,v,ctx){if(s.ph!=='target')return 'keep';const t=K2_poTrials(s.seed)[s.i];s.res.push({valid:t.valid,rt:performance.now()-s.t0,ok:Number(v)===t.side});s.i++;if(s.i>=20)s.ph='done';else{s.ph='fix';ctx.later(900,'cue',s.run)}return 'keep'}},
 draw(s,f,X){
  let out=heading(s.sim?'Simulated observer: arrow, then dot':'Which side is the dot on?');
  const t=s.i<20?K2_poTrials(s.seed)[s.i]:null,ph=s.ph==='film'?['fix','cue','target'][s.k]:s.ph,showCue=(ph==='cue'||ph==='target')&&t,showT=ph==='target'&&t;
  out+=R(70,52,110,84,'#f4f7f9',C.line,6)+R(420,52,110,84,'#f4f7f9',C.line,6);
  if(showCue)out+=t.cue?arrow(278,94,322,94,C.ink,4,12):arrow(322,94,278,94,C.ink,4,12);else out+=TB(300,101,'+',20,ph==='idle'||ph==='done'?C.muted:C.ink);
  if(showT)out+=Ci(t.side?475:125,94,13,C.ink);
  if(s.sim)out+=T(300,150,['eyes on the centre','the arrow says where the dot will probably be','dot: at the cued side on 16 of 20 trials'][s.k],13,C.muted);
  else out+=K2_btn(X,'ans',0,'The dot is on the left',70,150,200,46,'Left')+K2_btn(X,'ans',1,'The dot is on the right',330,150,200,46,'Right');
  out+=T(300,222,ph==='done'?'20 of 20 trials. Press Start for a new run.':ph==='idle'?'Press Start, and keep your eyes on the +':`trial ${s.i+1} of 20`,13,C.muted);
  const st=K2_poStats(s.res),d=st.mn-st.mv;
  out+=K2_hbar(244,'after a valid cue',st.mv,st.v.length,C.green)+K2_hbar(272,'after an invalid cue',st.mn,st.n.length,C.coral);
  out+=st.have?TB(300,322,`${s.sim?'Simulated':'Your'} cueing effect: ${d>=0?'+':'−'}${Math.abs(Math.round(d))} ms (invalid minus valid)`,14,C.ink):T(300,322,'Your cueing effect appears when both kinds of trial are in.',13,C.muted);
  out+=T(300,344,'Published (Posner 1980): valid cues give faster responses, by tens of milliseconds.',13,C.muted);
  out+=T(300,364,`${st.v.length} valid and ${st.n.length} invalid correct trials counted`,13,C.muted);
  const phase=s.sim?'A simulated observer with a typical cueing effect. The eyes never leave the centre; only attention moves to the cued side.':ph==='done'&&st.have?`Your responses after invalid cues were ${Math.abs(Math.round(d))} ms ${d>=0?'slower':'faster'} than after valid ones. With only four invalid trials one slow press can swing this either way; the published effect is an average over many trials. The next scene asks whether such cueing needs awareness of the target.`:ph==='idle'?'An arrow will point left or right, then a dot will appear in one of the boxes. The arrow is usually, but not always, right.':'Press Left or Right as soon as you see the dot.';
  return {svg:out,phase};
 }});

// A simulated patient, in the direction reported by Kentridge et al. (1999); the numbers are not GY's own.
function K2_gySim(cue,n0){const r=rng(n0*37+(cue==='blind'?501:211)),a=[];for(let i=0;i<40;i++){const valid=i%2===0;a.push({valid,ok:true,rt:(valid?(cue==='blind'?492:480):(cue==='blind'?528:532))+K2_gauss(r)*55})}return a}
SCENE({id:'attention-awareness-blindsight',name:'Attention without awareness?',tag:'Cueing in a blind field',shared:'k2-posner',
 definition:'Robert Kentridge, Charles Heywood and Lawrence Weiskrantz (1999) ran a cueing task on GY, a man with blindsight in the right half of his visual field. Targets appeared in the blind field, where GY reported no awareness of them. He was nevertheless faster and more accurate at detecting them when a cue had pointed to the right place, and this held even when the cue itself was shown in the blind field. This is the best-known case offered for attention without awareness.',
 example:'The same pattern as the cueing task you just ran, a faster response at the cued place, but for targets the observer says he does not see. The objection: GY sometimes reported a feeling that something had happened, so his awareness may have been degraded, not absent (the criterion problem from the blindsight lesson).',
 desc:'A schematic display with a blind right field, a cue and two possible target places, beside bars of mean response time after valid and invalid cues for a simulated patient and, when available, for the learner’s own run from the previous scene.',
 research:['Kentridge, R. W., Heywood, C. A. & Weiskrantz, L. (1999). Attention without awareness in blindsight. Proceedings of the Royal Society B 266, 1805–1811.','Kentridge, R. W., Heywood, C. A. & Weiskrantz, L. (2004). Spatial attention speeds discrimination without awareness in blindsight. Neuropsychologia 42, 831–835.','Phillips, I. (2021). Blindsight is qualitatively degraded conscious vision. Psychological Review 128, 558–584. Status: the cueing result stands; whether the targets were truly unseen is contested.'],
 dur:11,hint:'Choose where the cue is shown, then press Run 40 simulated trials. The patient is simulated: the direction follows the published result, the numbers do not. Your own bars come from the previous scene.',
 init:K2_poInit,
 watch(p){return {...K2_poInit(),gcue:p<.5?'sighted':'blind',gy:K2_gySim(p<.5?'sighted':'blind',1).slice(0,Math.floor(((p*2)%1)*44)),res:K2_poSim(20),sim:true}},
 ui:[{choose:[['sighted','Arrow at the centre (seen)'],['blind','Cue in the blind field']],label:'Where the cue is shown',get:s=>s.gcue,act:'gcue'},{b:'Run 40 simulated trials',act:'grun'}],
 on:{gcue(s,v){s.gcue=v;s.gy=[];return 'keep'},grun(s){s.gn=(s.gn||0)+1;s.gy=K2_gySim(s.gcue,s.gn);return 'keep'}},
 draw(s,f,X){
  let out=heading('Cueing a target that is not reported');
  out+=R(30,50,250,150,'#fff',C.grid,8)+R(155,52,123,146,C.coralp,'none',0)+L(155,52,155,198,C.line,1.5,'stroke-dasharray="4 4"')+T(92,68,'sighted field',13,C.green)+T(217,68,'blind field',13,C.coral);
  out+=Ci(225,100,9,'#fff',C.line)+Ci(225,160,9,C.ink)+T(225,186,'target',13,C.muted);
  if(s.gcue==='sighted')out+=TB(142,134,'+',16,C.ink)+arrow(118,150,140,168,C.ink,3,8)+T(92,186,'arrow cue',13,C.muted);
  else out+=TB(142,134,'+',16,C.ink)+R(190,148,12,24,C.muted,'none',3)+T(92,186,'cue beside target',13,C.muted);
  out+=R(30,208,250,28,C.pale,'none',14)+T(155,227,'“I’m not aware of anything there.”',13,C.ink);
  const g=K2_poStats(s.gy),me=K2_poStats(s.res||[]);
  out+=TB(300,66,'Simulated patient',14,C.amber,'start')+TF(300,84,'direction as published; numbers illustrative',13,C.muted,'start');
  out+=K2_hbar(96,'valid',g.mv,g.v.length,C.green,350,150,700)+K2_hbar(120,'invalid',g.mn,g.n.length,C.coral,350,150,700);
  out+=TBF(300,166,s.sim?'Simulated observer (seen targets)':'You (seen targets, previous scene)',14,C.blue,'start');
  out+=K2_hbar(178,'valid',me.mv,me.v.length,C.green,350,150,700)+K2_hbar(202,'invalid',me.mn,me.n.length,C.coral,350,150,700);
  if(!s.sim)out+=K2_btn(X,'grun','','Run 40 simulated trials',60,250,190,40,'Run 40 trials');
  const dg=g.mn-g.mv;
  out+=TB(440,262,g.have?`patient’s cueing effect: ${dg>=0?'+':'−'}${Math.abs(Math.round(dg))} ms`:'no simulated trials yet',13,C.ink)+(me.have?T(440,282,`${s.sim?'observer’s':'yours'}: ${me.mn-me.mv>=0?'+':'−'}${Math.abs(Math.round(me.mn-me.mv))} ms`,13,C.blue):TF(440,282,'run the task in the previous scene to add yours',13,C.muted));
  out+=R(30,304,540,64,C.pale,'none',8)+T(300,324,'For: a cue speeds responses to targets the patient says he does not see.',13,C.ink)+T(300,344,'Against: “not aware” may mean dimly aware and cautious, so awareness is not ruled out.',13,C.ink);
  return {svg:out,phase:g.have?`The simulated patient responds ${Math.abs(Math.round(dg))} ms ${dg>=0?'faster':'slower'} after a valid cue${s.gcue==='blind'?', even though the cue was in the blind field too':''}. If the targets really were unseen, attention was working without awareness. Whether they were is the point in dispute.`:'Press Run 40 simulated trials to see the pattern Kentridge and colleagues reported for GY.'};
 }});

const K2_GIST=[
 {k:'Scene task alone',scene:77,letter:77,note:'Each task alone, with display times set so that both are done equally well.'},
 {k:'With Li’s letter task',scene:75,letter:53,note:'Li et al. (2002): with attention held at the centre, the animal judgement barely suffered, while telling a rotated T from an L fell to near chance.'},
 {k:'With a harder task',scene:57,letter:null,note:'Cohen et al. (2011): with a more demanding central task, scene judgements fell towards chance, and some observers did not notice the scene at all.'}];
SCENE({id:'attention-awareness-gist',name:'Awareness without attention?',tag:'The gist of a scene, and a dispute',
 definition:'The other half of Koch and Tsuchiya’s claim is that we can be aware of something with almost no attention to it. Their main evidence was a dual-task study by Fei-Fei Li, Rufin VanRullen, Christof Koch and Pietro Perona (2002): while doing an attention-demanding letter task at the centre of the screen, people could still say whether a photograph flashed in the periphery contained an animal. Michael Cohen and colleagues (2011, 2012) replied that the letter task left some attention spare, and that with none left the gist is lost too.',
 example:'Central task: are five rotated letters all the same? Peripheral task: animal or no animal? Done together, the animal judgement stayed close to its single-task level, while a peripheral task that looks simpler, telling a rotated T from an L, collapsed.',
 desc:'A schematic display with letters at the centre and a small scene at the edge, and bars of illustrative accuracy for the scene task and a letter task in the periphery under three conditions.',
 research:['Li, F.-F., VanRullen, R., Koch, C. & Perona, P. (2002). Rapid natural scene categorization in the near absence of attention. PNAS 99, 9596–9601.','Cohen, M. A., Alvarez, G. A. & Nakayama, K. (2011). Natural-scene perception requires attention. Psychological Science 22, 1165–1172.','Cohen, M. A., Cavanagh, P., Chun, M. M. & Nakayama, K. (2012). The attentional requirements of consciousness. Trends in Cognitive Sciences 16, 411–417. Status: contested.'],
 dur:11,hint:'Switch between the three conditions and compare the bars. The percentages are illustrative; the direction of each change is what the two papers reported.',
 init:()=>({c:1}),
 watch(p){return {c:Math.min(2,Math.floor(p*3))}},
 ui:[{choose:K2_GIST.map((q,i)=>[i,q.k]),label:'Condition',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=Number(v);return 'keep'}},
 draw(s){
  const q=K2_GIST[s.c];let out=heading(q.k);
  out+=R(30,50,250,170,'#f4f7f9',C.line,6);
  if(s.c>0){['T','L','T','T','L'].forEach((ch,i)=>{const a=i*2*Math.PI/5,x=140+Math.cos(a)*26,y=132+Math.sin(a)*26;out+=`<g transform="rotate(${i*70} ${fmt(x)} ${fmt(y)})">`+TB(x,y+5,ch,15,C.ink)+'</g>'});out+=Ci(140,132,48,'none',s.c===2?C.coral:C.amber,'stroke-dasharray="5 4"'+(s.c===2?' stroke-width="4"':''))}
  else out+=TB(140,138,'+',18,C.muted);
  out+=R(222,60,48,38,'#cfe3d2',C.green,4)+`<polygon points="226,94 240,74 250,86 258,78 266,94" fill="${C.green}"/>`+Ci(236,70,4,'#d49a1c');
  out+=T(140,206,s.c===0?'attention free for the scene':s.c===1?'attention on the letters':'attention fully taken up',13,C.muted);out+=T(214,84,'scene',13,C.green,'end');
  out+=TB(310,66,'Illustrative accuracy',14,C.amber,'start')+TF(310,84,'directions from the papers, not their data',13,C.muted,'start');
  const base=220,sc=v=>(v-50)/50*110;out+=L(320,base,580,base,C.line,2)+T(316,base+4,'50%',13,C.muted,'end')+T(316,base-106,'100%',13,C.muted,'end')+T(450,base+56,'50% is chance',13,C.muted);
  out+=R(350,base-sc(q.scene),80,sc(q.scene),C.green,'none',4)+TB(390,base-sc(q.scene)-7,q.scene+'%',14,C.ink)+TF(390,base+18,'animal or not?',13,C.muted)+TF(390,base+35,'(scene)',13,C.muted);
  if(q.letter!==null)out+=R(470,base-sc(q.letter),80,Math.max(2,sc(q.letter)),C.purple,'none',4)+TB(510,base-sc(q.letter)-7,q.letter+'%',14,C.ink);else out+=T(510,base-10,'not tested',13,C.muted);
  out+=TF(510,base+18,'T or L?',13,C.muted)+TF(510,base+35,'(rotated letter)',13,C.muted);
  out+=R(30,296,540,72,C.pale,'none',8)+K2_lines(44,318,q.note,84,C.ink,'start',18,3);
  return {svg:out,phase:s.c===1?'Li and colleagues read this as awareness of gist with almost no attention. The contrast with the letter task shows that the central task was demanding.':s.c===2?'Cohen and colleagues read this as showing that the gist needed attention all along, and that Li’s task simply left some to spare. The two sides agree on the data and disagree on what “no attention” would take.':'Start from the single-task level, then add a central task that competes for attention.'};
 }});

const K2_CELLS=['Attention and awareness','Attention, no awareness','Awareness, little attention','Neither'];
const K2_FIND=[
 {t:'You read a sentence carefully and can say what it means.',a:0,n:'The ordinary case: attended and experienced. Nobody disputes this cell.'},
 {t:'Patient GY responds faster to targets at a cued place in his blind field, which he says he does not see (Kentridge et al. 1999).',a:1,n:'Offered as attention without awareness. Contested if GY had some dim awareness of the targets.'},
 {t:'Observers counting basketball passes do not notice a person in a gorilla suit (Simons & Chabris 1999).',a:3,n:'Not attended and not reported. Whether it was never seen, or seen and forgotten, is argued over.'},
 {t:'With attention held by letters at the centre, people still judge whether a scene flashed at the edge contains an animal (Li et al. 2002).',a:2,n:'Offered as awareness with almost no attention. Contested: Cohen et al. (2011) found it fails when the central task is harder.'},
 {t:'A masked cue that observers say they did not see still draws attention to its place (McCormick 1997).',a:1,n:'Attention drawn by something unreported. It rests on an awareness check, with the problems from the masking lesson.'},
 {t:'A large change to a picture goes unseen until attention happens to land on the changing object (Rensink et al. 1997).',a:3,n:'Rensink and colleagues concluded that seeing a change needs attention to the object.'}];
SCENE({id:'attention-awareness-grid',name:'Four possibilities',tag:'You sort the evidence',
 definition:'Attention and awareness can be crossed to give four cases: both, attention without awareness, awareness with little or no attention, and neither. Koch and Tsuchiya (2007) held that all four occur, so the two are distinct processes. Others, including Cohen and colleagues (2012), hold that attention is necessary for awareness though not sufficient, so the third case is empty. Anne Treisman’s work on visual search (1980) had already shown that single features are picked up with little attention while combining them into objects needs it.',
 example:'Blindsight cueing is the standard example of attention without awareness. Scene gist under a dual task is the standard example of awareness with little attention, and the one most disputed. Inattentional and change blindness are read as showing that without attention there is no awareness.',
 desc:'One finding at a time above a grid of four cells. The learner presses the cell the finding is usually placed in, sees the usual placement, and reads a note on whether that placement is contested.',
 research:['Koch, C. & Tsuchiya, N. (2007). Attention and consciousness: two distinct brain processes. Trends in Cognitive Sciences 11, 16–22.','Cohen, M. A., Cavanagh, P., Chun, M. M. & Nakayama, K. (2012). The attentional requirements of consciousness. Trends in Cognitive Sciences 16, 411–417.','McCormick, P. A. (1997). Orienting attention without awareness. Journal of Experimental Psychology: Human Perception and Performance 23, 168–180.','Treisman, A. M. & Gelade, G. (1980). A feature-integration theory of attention. Cognitive Psychology 12, 97–136. Status: the dissociation is contested.'],
 dur:14,hint:'Press the cell where you think each finding belongs, then Next finding. The marked cell is where the finding is usually placed, not a settled truth; the note says who disagrees.',
 init:()=>({i:0,pick:null,score:0,done:0}),
 watch(p){const u=p*6,i=Math.min(5,Math.floor(u));return {i,pick:u-i>.45?K2_FIND[i].a:null,score:0,done:0,sim:true}},
 ui:[{b:'Next finding',act:'next'},{b:'Start again',act:'again'}],
 on:{pick(s,v){if(s.pick!==null)return 'keep';s.pick=Number(v);s.done++;if(s.pick===K2_FIND[s.i].a)s.score++;return 'keep'},
  next(s){if(s.pick===null)return 'keep';if(s.i<5){s.i++;s.pick=null}return 'keep'},
  again(s){s.i=0;s.pick=null;s.score=0;s.done=0}},
 draw(s,f,X){
  const q=K2_FIND[s.i],ans=s.pick!==null;let out=K2_lines(300,34,q.t,78,C.ink,'middle',18,3);
  K2_CELLS.forEach((c,k)=>{const x=40+(k%2)*265,y=98+Math.floor(k/2)*84,right=ans&&k===q.a,wrong=ans&&k===s.pick&&k!==q.a;
   const inner=R(x,y,255,74,right?C.greenp:wrong?C.coralp:'#fff',right?C.green:wrong?C.coral:C.blue,8)+TB(x+127,y+34,c,14,right?C.green:wrong?C.coral:C.ink)+T(x+127,y+56,right?'usual placement':wrong?'your choice':['attended and seen','attended, not reported','reported, barely attended','not attended, not reported'][k],13,C.muted);
   out+=ans?inner:hit(X,'pick',k,c,inner)});
  if(ans)out+=R(30,276,540,58,C.pale,'none',8)+K2_lines(44,298,q.n,84,C.ink,'start',18,2);
  else out+=T(300,304,s.sim?'A finding from this era, about to be placed.':'Press the cell where this finding is usually placed.',13,C.muted);
  out+=T(44,362,`finding ${s.i+1} of 6${s.sim?'':` · matched the usual placement on ${s.score} of ${s.done}`}`,13,C.muted,'start');
  if(ans&&s.i<5&&!s.sim)out+=K2_btn(X,'next','','Next finding',452,340,118,32,'Next finding');
  return {svg:out,phase:!ans?'Four possibilities: attention and awareness together, either one without the other, or neither.':s.i===5?'Two of the four cells hold findings that are disputed. Whether attention is necessary for awareness, sufficient for it, or neither is still open; the theories in era 6 take different sides.':s.sim?'The green cell is where this finding is usually placed; the note gives the objection, where there is one.':s.pick===q.a?'That is where it is usually placed. Read the note for the objection, where there is one.':'It is usually placed in the green cell. Your reading may match one of the critics’; the note says where the argument lies.'};
 }});
