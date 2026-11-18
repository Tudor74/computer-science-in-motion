/* ===================== Brain In Motion · Era 6 · Brain states ===================== */
// The circadian clock, sleep stages, arousal systems, reward and dopamine, the stress response, hunger and homeostasis.
// Every picture is a pure function of state, frame and X. Sound (spike clicks) plays only from on() handlers.
// Simulated records use seeded generators (B6_rng) and are labelled as simulated, schematic or illustrative.

/* ---- shared helpers ---- */
const B6_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const B6_rng=n=>rng(B6_mix(n));
function B6_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const B6_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const B6_r1=v=>Math.round(v*10)/10;
const B6_note=(s,y=368)=>TF(300,y,s,13,C.muted);
const B6_mod=(v,m=24)=>((v%m)+m)%m;
// Clock time as "06:30" from hours (wraps at 24).
const B6_hh=h=>{let m=Math.round(B6_mod(h)*60)%1440;return pad(Math.floor(m/60),2)+':'+pad(m%60,2)};
const B6_hrs=v=>{const a=B6_r1(Math.abs(v));return fmt(a)+(a===1?' hour':' hours')};
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function B6_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-7,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// A tile with a label and a value (fixed-size text).
function B6_tile(x,y,w,label,value,col=C.blue){return R(x,y,w,46,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+38,value,16,col)}
// Spike clicks: very short noise bursts at the given times (seconds from now). Call only from on() handlers.
function B6_click(times,gain=.12){times.forEach(t=>AUDIO.noise({dur:.005,gain,at:t}))}
// Actogram: one row per day, clock time across in 48 half-hour bins; fn(row,bin) gives activity 0..1.
function B6_acto(x0,y0,w,rh,rows,fn,col=C.ink){
 let out='';const bw=w/48;
 for(let r=0;r<rows;r++){const yb=y0+(r+1)*rh;out+=L(x0,yb,x0+w,yb,C.grid,1);
  for(let b=0;b<48;b++){const v=fn(r,b);if(v>0)out+=R(x0+b*bw+.4,yb-v*rh*.82,bw-.8,v*rh*.82,col,'none',0)}}
 return out;
}
const B6_hourAxis=(x0,w,y)=>[0,6,12,18,24].map(h=>L(x0+h/24*w,y-4,x0+h/24*w,y,C.line,1)+TF(x0+h/24*w,y+14,B6_hh(h===24?0:h),13,C.muted)).join('');

/* ===================== Lesson: circadian-clock ===================== */
// Konopka & Benzer (1971): per mutants. Periods as published, to the nearest hour: 19 h, 28 h, arrhythmic; wild type about 24 h.
const B6_FLY={wt:[24,'Wild type','per⁺'],s:[19,'Short-day mutant','perˢ'],l:[28,'Long-day mutant','perˡ'],o:[0,'No-rhythm mutant','per⁰']};
const B6_FLY_DAYS=8,B6_FLY_ON=6;
const B6_flyOnset=(tau,row)=>B6_mod(B6_FLY_ON+row*(tau-24));
function B6_flyBins(g,row,b){
 const tau=B6_FLY[g][0],r=B6_rng(row*977+b*31+g.charCodeAt(0)*7),h=b/2+.25;
 if(!tau)return r()<.3?.35+.65*r():0;
 const ph=B6_mod(h-B6_flyOnset(tau,row),tau);
 return ph<11?(r()<.86?.45+.55*r():0):(r()<.04?.3*r():0);
}
SCENE({id:'circadian-clock',name:'Flies with fast and slow clocks',tag:'Konopka and Benzer, 1971',
 definition:'A circadian rhythm repeats about once a day and keeps going without outside cues. In 1971 Ronald Konopka and Seymour Benzer screened fruit flies treated with a mutagen for odd daily rhythms. They found three mutants of one gene on the X chromosome, which they named period: one ran a 19-hour day, one a 28-hour day and one had no rhythm at all.',
 example:'Kept in constant darkness, a fly with a 19-hour clock starts moving 5 hours earlier each day; a 28-hour fly starts 4 hours later. On an actogram, one row per day, the band of activity slants left or right. A wild-type fly’s band runs straight down.',
 desc:'An actogram of a fly in constant darkness: eight rows, one per day, with dark bars where the fly was active. A row of dots marks the learner’s guess at where each day’s activity starts.',
 research:['Konopka & Benzer (1971). Clock mutants of Drosophila melanogaster. PNAS 68, 2112–2116.','Reddy and others, with Hall and Rosbash (1984), Cell 38; Bargiello, Jackson & Young (1984), Nature 312: the period gene is cloned.'],
 dur:12,hint:'Pick a fly, then move the slider until the dots sit on the start of each day’s activity. The slider is your estimate of the fly’s period. The record is simulated.',
 init:()=>({g:'s',guess:24,shown:false}),
 watch(p){const k=Math.min(3,Math.floor(p*4)),g=['wt','s','l','o'][k],u=clamp((p*4-k)*1.6,0,1),tau=B6_FLY[g][0]||24;return {g,guess:Math.round(2*lerp(24,tau,smooth(u)))/2,shown:u>=1}},
 ui:[{choose:[['wt','per⁺'],['s','perˢ'],['l','perˡ'],['o','per⁰']],label:'Fly',get:s=>s.g,act:'g'},{range:'guess',label:'Your period estimate',min:16,max:32,step:.5,get:s=>s.guess,act:'guess',show:v=>fmt(v)+' h'},{b:'Show the published period',act:'show'}],
 on:{g(s,v){s.g=B6_FLY[v]?v:'s';s.shown=false},guess(s,v){s.guess=clamp(Math.round(2*v)/2,16,32)},show(s){s.shown=true}},
 draw(s){
  const F=B6_FLY[s.g],tau=F[0],x0=74,w=336,y0=50,rh=29;
  const match=tau&&Math.abs(s.guess-tau)<.26;
  let out=heading(!tau?'per⁰: no daily rhythm to measure':match?`A ${fmt(tau)}-hour day: the dots fit`:`${F[1]} (${F[2]}) in constant darkness`);
  out+=R(x0-4,y0,w+8,B6_FLY_DAYS*rh+6,'#fff',C.grid,4);
  out+=B6_acto(x0,y0,w,rh,B6_FLY_DAYS,(r,b)=>B6_flyBins(s.g,r,b));
  for(let r=0;r<B6_FLY_DAYS;r++)out+=TF(x0-10,y0+(r+1)*rh-8,'day '+(r+1),13,C.muted,'end');
  // guess dots
  let prev=null;
  for(let r=0;r<B6_FLY_DAYS;r++){const h=B6_flyOnset(s.guess,r),x=x0+h/24*w,y=y0+(r+.55)*rh;
   if(prev&&Math.abs(prev[0]-x)<w/2)out+=L(prev[0],prev[1],x,y,C.coral,1.6,'stroke-dasharray="4 3"');
   out+=Ci(x,y,5,C.coral,'#fff');prev=[x,y]}
  out+=B6_hourAxis(x0,w,y0+B6_FLY_DAYS*rh+10)+TF(x0+w/2,y0+B6_FLY_DAYS*rh+42,'time of day, in constant darkness',13,C.muted);
  const drift=s.guess-24;
  out+=B6_tile(430,52,156,'Your estimate',fmt(s.guess)+' h',C.coral);
  out+=B6_tile(430,106,156,'Start moves each day',drift===0?'not at all':(drift<0?'earlier ':'later ')+fmt(Math.abs(drift))+' h',C.coral);
  out+=B6_tile(430,160,156,'Published period',s.shown?(tau?'about '+tau+' h':'none'):'hidden',C.ink);
  out+=TF(508,236,'Konopka & Benzer:',13,C.muted)+TF(508,254,'perˢ 19 h · perˡ 28 h',13,C.muted)+TF(508,272,'per⁰ no rhythm',13,C.muted)+TF(508,290,'wild type about 24 h',13,C.muted);
  out+=B6_note('Simulated record: dark bars are half-hours of walking.',372);
  const ph=!tau?'The per⁰ fly is active on and off at any hour. There is no band to follow, so no period to measure: losing this one gene stops the clock.':
   match?`Your estimate fits. The activity starts ${tau===24?'at the same time every day':`${Math.abs(tau-24)} hours ${tau<24?'earlier':'later'} each day`}, so the fly’s internal day lasts about ${tau} hours. ${tau===24?'Wild-type flies keep close to 24 hours even in darkness.':'One changed letter in one gene changed the length of its day.'}`:
   `With a ${fmt(s.guess)}-hour estimate the dots move ${drift===0?'straight down':`${fmt(Math.abs(drift))} hours ${drift<0?'earlier':'later'} per row`}. Compare them with where the dark bars begin on each row and adjust.`;
  return {svg:out,phase:ph};
 }});

// Hamsters in constant darkness. SCN lesion abolishes the rhythm; a graft restores it with the donor's period (Ralph et al. 1990).
const B6_SCN={intact:[24,'own clock'],lesion:[0,'SCN destroyed'],wt:[24,'normal graft'],tau:[20,'tau-mutant graft']};
const B6_SCN_DAYS=4;
function B6_scnStep(s,act){
 const segs=s.segs.slice(),last=segs[segs.length-1];let note='';
 if(act==='lesion'){if(last==='intact'){segs.push('lesion')}else note='already'}
 else if(act==='wt'||act==='tau'){if(last==='lesion')segs.push(act);else note=last==='intact'?'intact':'grafted'}
 while(segs.length>4)segs.splice(1,1);
 return {segs,last:act,note};
}
const B6_scnInit=()=>({segs:['intact'],last:'',note:''});
function B6_scnRows(segs){const rows=[];let on=19;
 segs.forEach((k,i)=>{const tau=B6_SCN[k][0];if(i>0&&tau&&!B6_SCN[segs[i-1]][0])on=15;
  for(let d=0;d<B6_SCN_DAYS;d++){rows.push({k,tau,on:B6_mod(on)});if(tau)on+=tau-24}});
 return rows}
SCENE({id:'circadian-clock-scn',name:'The master clock',tag:'SCN lesions 1972; transplants 1990',
 definition:'In 1972 two groups destroyed a tiny pair of cell clusters in the rat hypothalamus, the suprachiasmatic nuclei (SCN), which sit just above the crossing of the optic nerves. Stephan and Zucker found that daily rhythms of drinking and running disappeared; Moore and Eichler found the same for the adrenal hormone corticosterone. The animals still ate, drank and moved, but at random hours.',
 example:'The decisive test came in 1990. Martin Ralph and colleagues destroyed the SCN of hamsters, then grafted in SCN tissue from a donor. Rhythms returned, with the donor’s period: a graft from a tau-mutant hamster, whose clock runs about 20 hours, gave the host a 20-hour day.',
 desc:'Left, a sketch of a slice through the hypothalamus with the two SCN above the optic chiasm. Right, a hamster’s wheel-running actogram that grows by four days with each procedure.',
 research:['Stephan & Zucker (1972). Circadian rhythms in drinking behavior and locomotor activity of rats are eliminated by hypothalamic lesions. PNAS 69, 1583–1586.','Moore & Eichler (1972). Brain Research 42, 201–206.','Ralph, Foster, Davis & Menaker (1990). Transplanted suprachiasmatic nucleus determines circadian period. Science 247, 975–978.'],
 dur:12,hint:'Destroy the host’s SCN, then graft tissue from a normal or a tau-mutant donor, and read the period off the actogram. Each step adds four simulated days.',
 init:B6_scnInit,
 watch(p){let s=B6_scnInit();const k=Math.min(2,Math.floor(p*3));for(const a of ['lesion','tau'].slice(0,k))s={...s,...B6_scnStep(s,a)};return s},
 ui:[{b:'Destroy the SCN',act:'lesion'},{b:'Graft: normal donor',act:'wt'},{b:'Graft: tau-mutant donor',act:'tau'}],
 on:{lesion(s){Object.assign(s,B6_scnStep(s,'lesion'))},wt(s){Object.assign(s,B6_scnStep(s,'wt'))},tau(s){Object.assign(s,B6_scnStep(s,'tau'))}},
 draw(s){
  const cur=s.segs[s.segs.length-1],tau=B6_SCN[cur][0];
  let out=heading(cur==='lesion'?'Without the SCN the rhythm is gone':cur==='tau'?'The graft brings the donor’s 20-hour day':cur==='wt'?'A normal graft restores a 24-hour rhythm':'An intact hamster in constant darkness');
  // slice sketch
  out+=R(14,50,196,232,'#fff',C.grid,8)+TBF(112,72,'Hypothalamus, in section',13,C.ink);
  out+=P('M40 120C40 90 80 84 104 96L104 236C78 248 48 238 40 206Z',C.line,2,'#f4f8fb')+P('M184 120C184 90 144 84 120 96L120 236C146 248 176 238 184 206Z',C.line,2,'#f4f8fb');
  out+=R(106,96,12,130,C.pale,'none',4)+TF(112,90,'3rd ventricle',13,C.muted);
  out+=`<ellipse cx="112" cy="246" rx="62" ry="13" fill="${C.amberp}" stroke="${C.amber}" stroke-width="2"/>`+TF(112,272,'optic chiasm',13,C.amber);
  const les=cur!=='intact';
  for(const x of [93,131])out+=les?Ci(x,222,9,'#fff',C.muted,'stroke-dasharray="3 3"'):Ci(x,222,9,C.coral,'#fff');
  out+=TF(112,200,les?'SCN destroyed':'SCN',13,les?C.muted:C.coral);
  if(cur==='wt'||cur==='tau')out+=Ci(112,160,11,cur==='tau'?C.purple:C.green,'#fff')+TF(112,140,'graft',13,cur==='tau'?C.purple:C.green);
  // actogram
  const rows=B6_scnRows(s.segs),x0=270,w=300,rh=Math.min(17,230/rows.length),y0=50;
  out+=R(x0-4,y0,w+8,rows.length*rh+6,'#fff',C.grid,4);
  out+=B6_acto(x0,y0,w,rh,rows.length,(r,b)=>{const R0=rows[r],rr=B6_rng(r*733+b*19+s.segs.length),h=b/2+.25;
   if(!R0.tau)return rr()<.22?.3+.7*rr():0;const ph=B6_mod(h-R0.on,R0.tau);return ph<8?(rr()<.9?.5+.5*rr():0):(rr()<.03?.3:0)});
  s.segs.forEach((k,i)=>{const yA=y0+i*B6_SCN_DAYS*rh+4,col=k==='lesion'?C.muted:k==='tau'?C.purple:k==='wt'?C.green:C.coral;out+=R(x0-16,yA,6,B6_SCN_DAYS*rh-4,col,'none',2)});
  out+=B6_hourAxis(x0,w,y0+rows.length*rh+12);
  const segLab=s.segs.map(k=>B6_SCN[k][1]).join(' → ');
  out+=TF(x0+w/2,y0+rows.length*rh+44,'4 days per step: '+segLab,13,C.muted);
  out+=B6_tile(20,296,190,'Period now',tau?'about '+tau+' h':'no rhythm',tau===20?C.purple:tau?C.green:C.muted);
  out+=B6_note('Simulated wheel running in constant darkness; the pattern is that of Ralph et al. 1990.',372);
  const ph=s.note==='intact'?'A graft into an intact animal would test nothing: first destroy the host’s own SCN, as Ralph did, so that any rhythm must come from the graft.':
   s.note==='grafted'?'This hamster already carries a graft. Reset to start a new animal.':s.note==='already'?'The SCN is already destroyed.':
   cur==='lesion'?'With both SCN destroyed the hamster still runs, eats and sleeps, but at any hour. The rest of the brain and body cannot keep daily time alone: the SCN is the master clock that keeps them in step.':
   cur==='tau'?'The host now runs a 20-hour day, the period of the donor and not its own. The timing is carried by the grafted cells themselves: the period travels with the tissue.':
   cur==='wt'?'Once the graft takes, rhythms return at about 24 hours. The graft does not need to be wired in like the original; it reconnects only partly, and some of its effect is thought to travel by diffusible signals.':
   'In constant darkness the hamster starts running at about the same time each day, roughly every 24 hours. No light tells it the time: the rhythm comes from inside.';
  return {svg:out,phase:ph};
 }});

/* The gene loop as delayed negative feedback (a toy model, not real kinetics):
   dM/dt = 1/(1 + P(t − delay)⁴) − kM·M,  dP/dt = kP·(3M − P), with per mRNA half-life 2 h and PER half-life set by the slider. */
const B6_LOOP_CACHE={};
function B6_loop(delay,hl,fb){
 const key=delay+'|'+hl+'|'+fb;if(B6_LOOP_CACHE[key])return B6_LOOP_CACHE[key];
 const dt=.05,kM=Math.log(2)/2,kP=Math.log(2)/hl,lag=Math.round(delay/dt),N=Math.round(9*24/dt);const M=[.1],Pp=[.1];
 for(let i=0;i<N;i++){const m=M[i],p=Pp[i],pd=i>=lag?Pp[i-lag]:Pp[0];const drive=fb?1/(1+Math.pow(pd,4)):1;M.push(m+dt*(drive-kM*m));Pp.push(fb?p+dt*kP*(3*m-p):0)}
 // keep the last 3 days, sampled every 0.25 h
 const start=N-Math.round(72/dt),m=[],pp=[];for(let i=start;i<=N;i+=5){m.push(M[i]);pp.push(Pp[i])}
 const pk=[];for(let i=Math.round(4*24/dt);i<N;i++)if(M[i]>M[i-1]&&M[i]>=M[i+1])pk.push(i*dt);
 const per=pk.length>2?(pk[pk.length-1]-pk[0])/(pk.length-1):0;
 const amp=Math.max(...m)-Math.min(...m),mx=Math.max(...m,.01),px=Math.max(...pp,.01);
 return B6_LOOP_CACHE[key]={m,p:pp,per:amp>.05?per:0,amp,mx,px};
}
const B6_LOOP_STEP=[['Gene on','PER is scarce, so the period gene is switched on and its mRNA rises.'],['PER builds up','The mRNA is translated, and PER protein accumulates in the cytoplasm.'],['Gene shut off','PER, with its partner TIM, enters the nucleus and switches its own gene off. The mRNA falls.'],['PER removed','Enzymes such as DOUBLETIME mark PER for breakdown. As it disappears, the brake comes off and the cycle restarts.']];
SCENE({id:'circadian-clock-loop',name:'A gene that switches itself off',tag:'Hall, Rosbash and Young: Nobel Prize 2017',
 definition:'In 1984 the period gene was cloned, independently by Jeffrey Hall and Michael Rosbash and by Michael Young. In 1990 Paul Hardin, Hall and Rosbash showed that period mRNA rises and falls once a day, and that the PER protein turns down its own gene. A gene whose product shuts it off, with a delay of hours, makes a clock.',
 example:'Young’s group found a second gene, timeless (1994), whose protein pairs with PER, and doubletime (1998), whose enzyme marks PER for breakdown and so sets the pace. Mammals use related genes, such as Clock, found in mice by Joseph Takahashi’s group in 1994. The three Americans shared the 2017 Nobel Prize.',
 desc:'Left, a cell with the period gene in the nucleus, its mRNA and the PER protein, with the current step of the loop highlighted. Right, three simulated days of mRNA and protein levels, with the period read from the peaks.',
 research:['Hardin, Hall & Rosbash (1990). Feedback of the Drosophila period gene product on circadian cycling of its messenger RNA levels. Nature 343, 536–540.','Sehgal, Price, Man & Young (1994), Science 263 (timeless); Price et al. (1998), Cell 94 (doubletime); Vitaterna et al. (1994), Science 264 (Clock mutant mice).','Nobel Prize in Physiology or Medicine 2017: Hall, Rosbash and Young.'],
 dur:14,hint:'Change how long PER takes to shut the gene off and how long PER lasts, and watch the period. Switch the feedback off to see what a per⁰ fly lacks. This is a toy model, not real kinetics.',
 init:()=>({delay:6,hl:2.5,fb:1,t:36}),
 watch(p){return {delay:6,hl:2.5,fb:1,t:p*72}},
 ui:[{range:'delay',label:'Delay before PER acts',min:3,max:9,step:.5,get:s=>s.delay,act:'delay',show:v=>fmt(v)+' h'},{range:'hl',label:'PER half-life',min:1,max:6,step:.5,get:s=>s.hl,act:'hl',show:v=>fmt(v)+' h'},{choose:[[1,'Feedback on'],[0,'No PER (per⁰)']],label:'Feedback',get:s=>s.fb,act:'fb'},{range:'t',label:'Time',min:0,max:72,step:1,get:s=>s.t,act:'t',show:v=>v+' h'}],
 on:{delay(s,v){s.delay=clamp(+v,3,9)},hl(s,v){s.hl=clamp(+v,1,6)},fb(s,v){s.fb=+v?1:0},t(s,v){s.t=clamp(Math.round(+v),0,72);return 'keep'}},
 draw(s){
  const L0=B6_loop(s.delay,s.hl,s.fb),i=clamp(Math.round(s.t/.25),1,L0.m.length-2);
  const dM=L0.m[i+1]-L0.m[i-1],dP=L0.p[i+1]-L0.p[i-1],st=!s.fb?0:dM>0?(dP>0?1:0):(dP>0?2:3);
  let out=heading(!s.fb?'No PER, no brake: the gene stays on':L0.per?`One cycle every ${fmt(B6_r1(L0.per))} hours`:'The loop settles: no rhythm');
  // cell
  out+=R(14,50,250,230,C.pale,C.line,26)+Ci(96,150,64,'#fff',C.blue)+TF(96,100,'nucleus',13,C.blue);
  const on=st===0||st===1;
  out+=R(54,150,84,16,on?C.green:C.muted,'none',4)+TF(96,186,on?'period gene: on':'period gene: off',13,on?C.green:C.muted);
  // mRNA squiggles, protein dots, sized by the current level
  const mN=Math.round(5*L0.m[i]/L0.mx),pN=s.fb?Math.round(8*L0.p[i]/L0.px):0;
  for(let k=0;k<mN;k++){const x=176+(k%3)*24,y=84+Math.floor(k/3)*22;out+=P(`M${x} ${y}q5 -6 10 0t10 0`,C.blue,2.4)}
  out+=TF(212,140,'mRNA',13,C.blue);
  for(let k=0;k<pN;k++){const inside=st===2&&k<4,x=inside?72+(k%2)*48:170+(k%4)*22,y=inside?132:180+Math.floor(k/4)*22;out+=Ci(x,y,7,C.purple,'#fff')}
  out+=TF(204,248,'PER protein',13,C.purple);
  if(s.fb){out+=curveArrow(150,212,118,160,-30,st===2?C.coral:C.line,st===2?3:2)+TF(140,268,'switches its own gene off',13,st===2?C.coral:C.muted)}
  // plot
  const pl=B6_plot(300,62,280,170,[0,72],[0,1.08],{xt:[[0,'0'],[24,'24'],[48,'48'],[72,'72 h']],xl:'time (hours)',yl:'level (scaled to its peak)'});out+=pl.svg;
  const pm=[],pq=[];L0.m.forEach((v,k)=>{pm.push([pl.X(k*.25),pl.Y(v/L0.mx)]);if(s.fb)pq.push([pl.X(k*.25),pl.Y(L0.p[k]/L0.px)])});
  out+=B6_poly(pm,C.blue,2.4)+B6_poly(pq,C.purple,2.4);
  out+=L(pl.X(s.t),62,pl.X(s.t),232,C.ink,1.4,'stroke-dasharray="3 3"');
  out+=R(300,282,12,12,C.blue,'none',2)+TF(318,293,'per mRNA',13,C.ink,'start')+R(410,282,12,12,C.purple,'none',2)+TF(428,293,'PER protein',13,C.ink,'start');
  out+=B6_tile(300,304,134,'Period',L0.per?fmt(B6_r1(L0.per))+' h':'none',L0.per?C.green:C.muted)+B6_tile(446,304,134,'Step now',s.fb?B6_LOOP_STEP[st][0]:'Gene stuck on',C.ink);
  out+=TF(140,304,`delay ${fmt(s.delay)} h · PER half-life ${fmt(s.hl)} h`,13,C.muted)+TF(140,322,'Toy model of delayed',13,C.muted)+TF(140,340,'negative feedback.',13,C.muted);
  const ph=!s.fb?'With no PER protein nothing turns the gene down, so its mRNA rises to a steady level and stays there. This is the per⁰ fly: no brake, no cycle, no rhythm.':
   !L0.per?`With PER this long-lived and a delay of only ${fmt(s.delay)} hours, the feedback is too sluggish to overshoot: the levels settle and the oscillation dies away. Real clocks depend on PER being removed on time.`:
   `${B6_LOOP_STEP[st][1]} In this toy loop one cycle takes ${fmt(B6_r1(L0.per))} hours. A longer delay or a longer-lived PER lengthens the day; real mutations in period and doubletime shorten or lengthen it in the same spirit.`;
  return {svg:out,phase:ph};
 }});

/* Re-entrainment after a time-zone shift (illustrative rule of thumb, after Waterhouse et al. 2007):
   the clock advances by up to about 1 h a day and delays by up to about 1.5 h a day. In dim light it free-runs at 24.2 h. */
const B6_ADV=1,B6_DEL=1.5,B6_TAU=24.2;
function B6_lightDays(s){const fr=[];let d=s.dim?0:s.shift;const N=12;
 for(let k=0;k<=N;k++){fr.push({k,d,say:''});if(s.dim)d+=B6_TAU-24;else if(d>0)d-=Math.min(d,B6_ADV);else if(d<0)d+=Math.min(-d,B6_DEL)}
 return fr}
function B6_lightSay(s,f,fr){
 const d=f.d,dir=s.shift>0?'east':'west';
 if(s.dim)return f.k===0?'In dim light all day there is no strong cue. The clock free-runs on its own period, about 24.2 hours in Czeisler’s volunteers.':`Day ${f.k}: the body’s night now falls ${fmt(B6_r1(d))} hours later than at the start: 0.2 hours a day adds up to about 1.4 hours a week.`;
 if(s.shift===0)return 'No shift: the body’s night and the local night coincide, and morning light each day trims the clock’s slight tendency to run late.';
 if(f.k===0)return `After flying ${Math.abs(s.shift)} time zones ${dir}, the body’s night sits ${Math.abs(s.shift)} hours ${s.shift>0?'later':'earlier'} than the local night.`;
 if(Math.abs(d)<.01){const n=fr.findIndex(q=>Math.abs(q.d)<.01);return `Back in step after ${n} days. ${s.shift>0?'Going east the clock must advance, which it does more slowly':'Going west the clock must delay, which it does more readily'}: about ${s.shift>0?B6_ADV:B6_DEL} hours a day in this rule of thumb.`}
 return `Day ${f.k}: light at the new local times ${s.shift>0?'advances':'delays'} the clock. The body’s night is still ${fmt(B6_r1(Math.abs(d)))} hours ${d>0?'late':'early'}.`;
}
SCENE({id:'circadian-clock-light',name:'Light resets the clock',tag:'A 24.2-hour human clock, Czeisler 1999',
 definition:'The human clock does not run at exactly 24 hours. In 1999 Charles Czeisler’s group kept volunteers on a 28-hour day in dim light, so that the clock could not follow, and measured an average period of 24.18 hours. Each day, light reaching the eye nudges the clock back into step with the sun. This daily correction is called entrainment.',
 example:'The same light has opposite effects at different body-clock times. Light in the evening and early night delays the clock; light late at night and in the early morning advances it. Khalsa and colleagues mapped this phase response curve in 2003. After a long flight east the clock must advance, which is usually slower than delaying after a flight west.',
 desc:'Rows of days after a flight: a grey bar marks the local night and a purple bar the body clock’s night, which slides back into line day by day. An inset shows the shape of the human phase response curve to light.',
 research:['Czeisler, Duffy, Shanahan and others (1999). Stability, precision, and near-24-hour period of the human circadian pacemaker. Science 284, 2177–2181.','Khalsa, Jewett, Cajochen & Czeisler (2003). A phase response curve to single bright light pulses in human subjects. Journal of Physiology 549, 945–952.','Berson, Dunn & Takao (2002). Science 295: the retinal cells that set the clock.','Waterhouse, Reilly, Atkinson & Edwards (2007). Jet lag: trends and coping strategies. Lancet 369, 1117–1129 (rough rates of re-entrainment).'],
 dur:13,hint:'Set a time-zone shift (east is positive) and step through the days, or choose dim light to see the clock free-run. The daily rates are a rough rule of thumb, not a prediction for any person.',
 init:()=>({shift:6,dim:0}),
 trace:s=>B6_lightDays(s),
 ui:[{range:'shift',label:'Time zones crossed (east +)',min:-8,max:8,step:1,get:s=>s.shift,act:'shift',show:v=>(v>0?'+':'')+v+' h'},{choose:[[0,'Daylight at new times'],[1,'Dim light, no cue']],label:'Light',get:s=>s.dim,act:'dim'}],
 on:{shift(s,v){s.shift=clamp(Math.round(+v),-8,8)},dim(s,v){s.dim=+v?1:0}},
 draw(s,f,X){
  const fr=B6_lightDays(s),k=f?f.k:0,x0=86,w=330,y0=48,rh=22,TX=h=>x0+B6_mod(h)/24*w;
  let out=heading(s.dim?'Without a cue the clock drifts later':s.shift===0?'No shift: already in step':Math.abs(fr[k].d)<.01?'Back in step':`${Math.abs(s.shift)} hours ${s.shift>0?'east':'west'}: the clock catches up`);
  out+=R(x0-4,y0,w+8,13*rh+6,'#fff',C.grid,4);
  const bar=(a,b,y,h,col,op)=>{let o='';const A=B6_mod(a),B=A+(b-a);if(B<=24)o+=R(TX(A),y,(B-A)/24*w,h,col,'none',2,op);else{o+=R(TX(A),y,(24-A)/24*w,h,col,'none',2,op)+R(x0,y,(B-24)/24*w,h,col,'none',2,op)}return o};
  for(let r=0;r<=12;r++){const y=y0+4+r*rh,q=fr[r],show=r<=k;
   out+=TF(x0-10,y+14,r===0?'arrive':'day '+r,13,r===k?C.ink:C.muted,'end');
   out+=bar(23,31,y+2,8,C.line,'');
   if(show)out+=bar(23+q.d,31+q.d,y+11,8,C.purple,r===k?'':'opacity=".55"')}
  out+=B6_hourAxis(x0,w,y0+13*rh+18);
  out+=R(x0,y0+13*rh+40,12,10,C.line,'none',2)+TF(x0+18,y0+13*rh+50,'local night',13,C.ink,'start')+R(x0+120,y0+13*rh+40,12,10,C.purple,'none',2)+TF(x0+138,y0+13*rh+50,'body clock’s night',13,C.ink,'start');
  // PRC inset (shape only)
  const ix=440,iy=56,iw=146,ih=110;out+=R(ix,iy,iw,ih+48,'#fff',C.grid,8)+TBF(ix+iw/2,iy+18,'Phase response',13,C.ink);
  const Y0=iy+30+ih*.55,prc=x=>x>=-8&&x<0?-2.2*Math.sin(Math.PI*(x+8)/8):x>=0&&x<8?1.4*Math.sin(Math.PI*x/8):0;
  const pts=[];for(let i=0;i<=60;i++){const x=-12+i*.4;pts.push([ix+8+i/60*(iw-16),Y0-prc(x)*16])}
  out+=L(ix+8,Y0,ix+iw-8,Y0,C.grid,1)+L(ix+iw/2,iy+30,ix+iw/2,iy+ih+10,C.grid,1,'stroke-dasharray="3 3"')+B6_poly(pts,C.amber,2.2);
  out+=TF(ix+34,iy+ih+28,'delays',13,C.coral)+TF(ix+iw-34,iy+44,'advances',13,C.green)+TF(ix+iw/2,iy+ih+44,'body-clock time →',13,C.muted);
  const dd=fr[k].d,n=fr.findIndex(q=>Math.abs(q.d)<.01);
  out+=B6_tile(440,232,146,'Clock offset now',Math.abs(dd)<.01?'in step':B6_hrs(dd)+(dd>0?' late':' early'),Math.abs(dd)<.01?C.green:C.purple);
  out+=B6_tile(440,286,146,s.dim?'Drift per day':'Days to catch up',s.dim?'+0.2 h':n<0?'more than 12':String(n),C.ink);
  out+=B6_note('Illustrative: about 1 h a day forwards, 1.5 h a day back. People vary widely.',372);
  return {svg:out,phase:B6_lightSay(s,fr[k],fr)};
 }});

/* ===================== Lesson: sleep-stages ===================== */
// Simulated polygraph: 8 s of EEG, eye (EOG) and chin muscle (EMG) at 90 samples a second, in microvolts.
// Features follow the standard scoring rules (Rechtschaffen & Kales 1968; AASM 2007): alpha 8–12 Hz in relaxed waking,
// theta and slow eye movements in N1, spindles (11–16 Hz) and K-complexes in N2, waves of 0.5–2 Hz over 75 µV in N3,
// low-voltage mixed EEG with rapid eye movements and the lowest muscle tone in R.
const B6_SR=90,B6_SEC=8,B6_STAGES=['W','N1','N2','N3','R'];
const B6_STAGE_NAME={W:'Wake (eyes closed)',N1:'N1 (drowsy)',N2:'N2',N3:'N3 (deep, slow-wave)',R:'REM (R)'};
const B6_STAGE_COL={W:C.amber,N1:C.blue,N2:C.blue,N3:C.purple,R:C.coral};
const B6_TR_CACHE={};
function B6_traces(st,seed){
 const key=st+seed;if(B6_TR_CACHE[key])return B6_TR_CACHE[key];
 const r=B6_rng(seed*7919+st.length*13+st.charCodeAt(0)+(st.charCodeAt(1)||0)*3),n=B6_SR*B6_SEC,eeg=[],eog=[],emg=[],marks=[];
 const ph=[0,1,2,3,4,5].map(()=>r()*6.283),hann=(t,a,d)=>t<a||t>a+d?0:.5-.5*Math.cos(2*Math.PI*(t-a)/d);
 const sp=st==='N2'?[[1.2+r()*.6,1],[5+r()*.8,.9]]:[],kc=st==='N2'?3.2+r()*.6:-9,rem=st==='R'?[.7,1.3,3.9,4.4,6.1].map(v=>v+r()*.3):[];
 let lp=0;
 for(let i=0;i<n;i++){const t=i/B6_SR,g=()=>B6_gauss(r);let e=0,o=0,m=0;
  lp=.7*lp+.3*g();
  if(st==='W'){e=26*(.65+.35*Math.sin(.9*t+ph[0]))*Math.sin(2*Math.PI*10*t+ph[1])+6*Math.sin(2*Math.PI*19*t+ph[2])+7*lp;o=4*lp+6*Math.sin(.4*t+ph[3]);m=10*g()}
  else if(st==='N1'){e=20*Math.sin(2*Math.PI*6*t+ph[0])+12*Math.sin(2*Math.PI*4.3*t+ph[1])+5*Math.sin(2*Math.PI*10*t+ph[2])*(t<2?1:0)+8*lp-55*Math.exp(-Math.pow((t-5.3)/.07,2));o=55*Math.sin(2*Math.PI*.22*t+ph[3])+4*lp;m=6*g()}
  else if(st==='N2'){e=16*Math.sin(2*Math.PI*5.5*t+ph[0])+10*Math.sin(2*Math.PI*3.2*t+ph[1])+8*lp;for(const [a,d] of sp)e+=28*hann(t,a,d)*Math.sin(2*Math.PI*13*t+ph[2]);
   const u=t-kc;if(u>0&&u<.9)e+=u<.3?-115*Math.sin(Math.PI*u/.3):60*Math.sin(Math.PI*(u-.3)/.6);o=4*lp;m=4*g()}
  else if(st==='N3'){e=85*Math.sin(2*Math.PI*1.05*t+ph[0])+35*Math.sin(2*Math.PI*.7*t+ph[1])+10*Math.sin(2*Math.PI*5*t+ph[2])+8*lp;o=.25*e+3*lp;m=3*g()}
  else{e=13*Math.sin(2*Math.PI*5*t+ph[0])+7*Math.sin(2*Math.PI*8*t+ph[1])+8*lp+(t>2.2&&t<3.4?22*((2.5*t)%1-.5):0);
   for(const [j,a] of rem.entries()){const u=t-a;if(u>0)o+=(j%2?-1:1)*70*(u<.08?u/.08:Math.exp(-(u-.08)/.35))}o+=3*lp;m=1.2*g()+(t>5.5&&t<5.62?7*g():0)}
  eeg.push(e);eog.push(o);emg.push(m)}
 for(const [a,d] of sp)marks.push(['spindle',a+d/2]);if(st==='N2')marks.push(['K-complex',kc+.2]);if(st==='R')marks.push(['rapid eye movements',2]);
 return B6_TR_CACHE[key]={eeg,eog,emg,marks};
}
// Draw the three channels between x0 and x0+w. Upward is negative at the electrode by EEG convention; we simply draw the signal.
function B6_polygraph(tr,x0,w,ys,opts={}){
 let out='';const n=tr.eeg.length,sx=w/(n-1),ch=[['EEG',tr.eeg,.3,C.ink],['Eyes',tr.eog,.3,C.blue],['Chin muscle',tr.emg,.9,C.green]];
 ch.forEach(([lab,a,k,col],c)=>{if(opts.only&&!opts.only.includes(c))return;const y=ys[c],pts=[];for(let i=0;i<n;i+=1)pts.push([x0+i*sx,y-clamp(a[i]*k,-48,48)]);
  out+=TF(x0-8,y+4,lab,13,C.muted,'end')+B6_poly(pts,col,1.1)});
 return out;
}
const B6_POLY_X=110,B6_POLY_W=470;
SCENE({id:'sleep-stages',name:'Rapid eye movements in sleep',tag:'Aserinsky and Kleitman, 1953',
 definition:'In 1953 Eugene Aserinsky, a graduate student in Nathaniel Kleitman’s laboratory in Chicago, recorded the eyes of sleeping people alongside their EEG. Several times a night the eyes darted about under closed lids while the EEG looked almost like waking. People woken then usually reported vivid dreams. Sleep was not one state but at least two.',
 example:'Recording the chin muscle completes the picture. In REM sleep the muscles of the body go slack, which Michel Jouvet found in cats in 1959 and called paradoxical sleep. Non-REM sleep is now scored as N1, N2 and N3, from drowsiness to deep sleep with large slow waves. What sleep is for is still not settled.',
 desc:'Eight seconds of a simulated sleep recording with three channels: EEG, eye movements and chin muscle tone. The learner chooses the stage and which channels to show; the features that define each stage are labelled.',
 research:['Aserinsky & Kleitman (1953). Regularly occurring periods of eye motility, and concomitant phenomena, during sleep. Science 118, 273–274.','Jouvet & Michel (1959). Comptes Rendus de la Société de Biologie 153 (loss of muscle tone in paradoxical sleep, cats).','Rechtschaffen & Kales (1968), the scoring manual; Iber and others (2007), the AASM manual that merged stages 3 and 4 into N3.'],
 dur:14,hint:'Choose a stage and compare the three channels. Then show the EEG alone: can you still tell REM from waking? The record is simulated, not anyone’s sleep, and nothing here is a sleep test.',
 init:()=>({st:'R',ch:'all'}),
 watch(p){const k=Math.min(4,Math.floor(p*5));return {st:B6_STAGES[k],ch:'all'}},
 ui:[{choose:B6_STAGES.map(v=>[v,v]),label:'Stage',get:s=>s.st,act:'st'},{choose:[['all','All three channels'],['eeg','EEG only']],label:'Channels',get:s=>s.ch,act:'ch'}],
 on:{st(s,v){s.st=B6_STAGES.includes(v)?v:'W'},ch(s,v){s.ch=v==='eeg'?'eeg':'all'}},
 draw(s){
  const tr=B6_traces(s.st,1),only=s.ch==='eeg'?[0]:null,ys=only?[150,0,0]:[96,186,256];
  let out=heading(only&&(s.st==='R'||s.st==='W')?'From the EEG alone, REM looks like waking':B6_STAGE_NAME[s.st]+': the signature');
  out+=R(B6_POLY_X-4,48,B6_POLY_W+8,240,'#fff',C.grid,6)+B6_polygraph(tr,B6_POLY_X,B6_POLY_W,ys,{only});
  const TX=t=>B6_POLY_X+t/B6_SEC*B6_POLY_W;
  for(const v of [0,2,4,6,8])out+=TF(TX(v),304,v+(v===8?' s':''),13,C.muted);
  if(!only||only)for(const [lab,t] of tr.marks){if(only&&lab==='rapid eye movements')continue;const y=lab==='rapid eye movements'?ys[1]-44:ys[0]-50;out+=TF(TX(t),y+4,lab,13,C.coral)}
  out+=L(B6_POLY_X+B6_POLY_W-30,66,B6_POLY_X+B6_POLY_W-30,96,C.ink,2)+TF(B6_POLY_X+B6_POLY_W-36,86,'100 µV',13,C.ink,'end');
  const feat={W:'Alpha rhythm, about 10 a second · eyes still · good muscle tone',N1:'Slower theta waves · slow rolling eyes · less tone',N2:'Spindles and K-complexes · eyes still · low tone',N3:'Large slow waves, about 1 a second · eyes still · low tone',R:'Small mixed EEG · rapid eye movements · muscles slack'}[s.st];
  out+=T(300,330,feat,14,B6_STAGE_COL[s.st]);
  out+=B6_note('Simulated record. Real scoring uses 30-second epochs and several EEG channels.',366);
  const ph=only?(s.st==='R'?'With only the EEG, REM sleep shows small, fast, mixed waves much like drowsy waking. This is why sleep researchers before 1953 missed it: the eye and muscle channels give it away.':s.st==='W'?'Relaxed waking with eyes closed shows the alpha rhythm Berger described. Switch to REM and compare: the EEG alone does not separate them cleanly.':'The EEG alone is enough for this stage: '+feat.split(' · ')[0].toLowerCase()+'.'):
   {W:'Relaxed waking with eyes closed: the alpha rhythm at about 10 waves a second, little eye movement, and steady tone in the chin muscle.',N1:'Drowsiness: alpha fades into slower theta waves, the eyes roll slowly from side to side, and muscle tone falls. A sharp wave near the top of the head is common.',N2:'Stage N2 takes up about half of a night. Its markers are sleep spindles, bursts of 11 to 16 waves a second lasting half a second or more, and K-complexes, single large waves.',N3:'Deep sleep: large slow waves of about one a second, as large numbers of cortical neurons fall silent and fire together. It is hardest to wake someone from N3.',R:'REM sleep: a small, fast, mixed EEG like drowsy waking, bursts of rapid eye movements, and the lowest muscle tone of the night. The brain is active; the body is still.'}[s.st];
  return {svg:out,phase:ph};
 }});

// Ten epochs chosen from one simulated night; the key is the stage the record was generated from.
const B6_EPOCHS=['W','N1','N2','N3','N3','N2','R','N2','R','W'];
const B6_WATCH_SCORER=['W','W','N2','N3','N3','N2','R','N2','R','W'];   // a simulated scorer who misses the N1 epoch
SCENE({id:'sleep-stages-score',name:'Score the record',tag:'Rechtschaffen and Kales, 1968',
 definition:'A sleep recording is divided into 30-second epochs, and a trained scorer gives each one a single stage by rules first standardised by Allan Rechtschaffen and Anthony Kales in 1968 and revised by the American Academy of Sleep Medicine in 2007. The rule is to score what fills most of the epoch.',
 example:'Scoring is a skilled judgement, not a measurement. When thousands of scorers rated the same records, they agreed with the reference on about 83% of epochs. N1, the borderline between waking and sleep, was the hardest stage to agree on.',
 desc:'One epoch of a simulated recording at a time, with five buttons to score it. Scored epochs build a small hypnogram beside the key, and a tile compares the learner’s agreement with the published figure for trained scorers.',
 research:['Rechtschaffen & Kales, eds (1968). A Manual of Standardized Terminology, Techniques and Scoring System for Sleep Stages of Human Subjects.','Rosenberg & Van Hout (2013). The American Academy of Sleep Medicine inter-scorer reliability program: sleep stage scoring. Journal of Clinical Sleep Medicine 9, 81–87 (overall agreement 82.6%).'],
 dur:14,hint:'Look at the three channels and press the stage you think fills this epoch. The key below lists what to look for. Your scores stay on this page, and the record is simulated.',
 init:()=>({ans:[]}),
 watch(p){return {ans:B6_WATCH_SCORER.slice(0,Math.min(10,Math.floor(p*11)))}},
 ui:B6_STAGES.map(v=>({b:v,act:'score',arg:v,aria:'Score this epoch as '+v})).concat([{b:'Undo',act:'undo'}]),
 on:{score(s,v){if(s.ans.length<B6_EPOCHS.length&&B6_STAGES.includes(v))s.ans.push(v)},undo(s){s.ans.pop()}},
 draw(s,f,X){
  const i=s.ans.length,done=i>=B6_EPOCHS.length,show=done?B6_EPOCHS.length-1:i,tr=B6_traces(B6_EPOCHS[show],show+3);
  const right=s.ans.filter((a,j)=>a===B6_EPOCHS[j]).length,watch=X&&!X.try;
  let out=heading(done?`You agreed with the key on ${right} of 10 epochs`:`${watch?'A simulated scorer: e':'E'}poch ${i+1} of 10`);
  out+=R(B6_POLY_X-4,46,B6_POLY_W+8,178,'#fff',C.grid,6)+B6_polygraph(tr,B6_POLY_X,B6_POLY_W,[86,152,200]);
  out+=TF(B6_POLY_X+B6_POLY_W,240,'8 s shown of the 30-s epoch',13,C.muted,'end');
  if(i>0&&!done){const a=s.ans[i-1],k=B6_EPOCHS[i-1];out+=TF(B6_POLY_X,240,`Epoch ${i}: you said ${a}, the key says ${k}`,13,a===k?C.green:C.coral,'start')}
  // mini hypnogram of scored epochs
  const hx=20,hy=258,lev={W:0,R:1,N1:2,N2:3,N3:4};out+=R(hx,hy,236,96,'#fff',C.grid,6);
  ['W','R','N1','N2','N3'].forEach((v,j)=>out+=TF(hx+24,hy+18+j*17,v,13,C.muted,'end'));
  s.ans.forEach((a,j)=>{const x=hx+32+j*20,yk=hy+14+lev[B6_EPOCHS[j]]*17,ya=hy+14+lev[a]*17;out+=R(x,yk-3,16,6,C.line,'none',1)+R(x+2,ya-4,12,8,a===B6_EPOCHS[j]?C.green:C.coral,'none',2)});
  // key
  const key=[['W','alpha, eyes, tone'],['N1','theta, slow eye roll'],['N2','spindles, K-complex'],['N3','big slow waves'],['R','eyes dart, no tone']];
  key.forEach(([k,t],j)=>{out+=TBF(272,276+j*17,k,13,B6_STAGE_COL[k],'start')+TF(300,276+j*17,t,13,C.ink,'start')});
  const pct=i?Math.round(100*right/i):0;
  out+=B6_tile(452,256,132,'Your agreement',i?pct+'%':'—',i&&pct>=83?C.green:C.coral)+B6_tile(452,308,132,'Trained scorers','about 83%',C.ink);
  const ph=done?`${right} of 10 match the key (${right*10}%). Trained scorers agree with a reference on about 83% of epochs, and least often on N1. ${right<10?'Look back at the red marks: which stage did you confuse with which?':'A perfect run on clear simulated epochs; real records are harder.'}`:
   i===0?'Score each epoch by what fills most of it. Start with the EEG: alpha, theta, spindles or big slow waves? Then check the eyes and the chin muscle.':
   `${s.ans[i-1]===B6_EPOCHS[i-1]?'Agreed.':'Not the key’s stage.'} The previous epoch was ${B6_STAGE_NAME[B6_EPOCHS[i-1]]}. Now epoch ${i+1}.`;
  return {svg:out,phase:ph};
 }});

// Illustrative hypnograms (minutes). Typical young adult; older adult (less N3, more waking: trends from Ohayon et al. 2004);
// recovery night after a night without sleep (more N3, especially early).
const B6_NIGHTS={
 young:['Young adult',[['W',10],['N1',5],['N2',15],['N3',40],['N2',10],['R',10],['N2',25],['N3',30],['N2',15],['R',18],['W',2],['N1',3],['N2',45],['N3',10],['N2',10],['R',24],['N2',55],['W',3],['N2',5],['R',30],['N1',5],['N2',65],['R',32],['W',13]]],
 older:['Older adult',[['W',20],['N1',10],['N2',25],['N3',15],['N2',15],['R',12],['W',8],['N1',5],['N2',40],['N3',5],['N2',10],['R',18],['W',15],['N1',5],['N2',45],['R',20],['W',12],['N1',5],['N2',50],['R',22],['W',20],['N1',8],['N2',45],['R',20],['W',30]]],
 recovery:['After a night awake',[['W',3],['N1',2],['N2',8],['N3',70],['N2',10],['R',12],['N2',20],['N3',45],['N2',10],['R',20],['N2',35],['N3',20],['N2',10],['R',25],['N2',50],['R',30],['N2',55],['N3',5],['R',35],['W',15]]]};
function B6_nightInfo(key){
 const segs=B6_NIGHTS[key][1];let t=0;const out=[],tot={W:0,N1:0,N2:0,N3:0,R:0},rem=[];
 for(const [st,m] of segs){out.push({st,a:t,b:t+m});tot[st]+=m;if(st==='R')rem.push(out.length-1);t+=m}
 const onset=out.find(q=>q.st!=='W').a;return {segs:out,tot,rem,total:t,onset};
}
SCENE({id:'sleep-stages-night',name:'Cycles through the night',tag:'Dement and Kleitman, 1957',
 definition:'In 1957 William Dement and Nathaniel Kleitman recorded whole nights and found that sleep runs in cycles. The sleeper descends through the non-REM stages to deep sleep, comes back up, and enters a REM period, about every 90 minutes. A chart of stage against time, drawn as steps, is called a hypnogram.',
 example:'Deep N3 sleep is concentrated in the first cycles and REM periods lengthen towards morning, so the two halves of a night differ. With age N3 usually shrinks and brief awakenings become more common. These are averages over groups; individual nights vary a great deal.',
 desc:'A hypnogram of an illustrative eight-hour night with stages from waking at the top to N3 at the bottom and REM periods drawn as thick red bars. The learner marks each REM period to count the cycles; tiles give the time in each stage.',
 research:['Dement & Kleitman (1957). Cyclic variations in EEG during sleep and their relation to eye movements, body motility, and dreaming. Electroencephalography and Clinical Neurophysiology 9, 673–690.','Ohayon, Carskadon, Guilleminault & Vitiello (2004). Meta-analysis of quantitative sleep parameters from childhood to old age in healthy individuals. Sleep 27, 1255–1273.'],
 dur:12,hint:'Press each red REM bar to mark it and count the cycles. Switch nights to compare. The nights are illustrative; nothing here says how anyone should sleep.',
 init:()=>({key:'young',marked:[]}),
 watch(p){const I=B6_nightInfo('young');return {key:'young',marked:I.rem.slice(0,Math.floor(p*(I.rem.length+1)))}},
 ui:[{choose:Object.keys(B6_NIGHTS).map(k=>[k,B6_NIGHTS[k][0]]),label:'Night',get:s=>s.key,act:'key'},{b:'Mark all REM periods',act:'all'}],
 on:{key(s,v){s.key=B6_NIGHTS[v]?v:'young';s.marked=[]},mark(s,v){const j=+v;if(!s.marked.includes(j))s.marked.push(j)},all(s){s.marked=B6_nightInfo(s.key).rem.slice()}},
 draw(s,f,X){
  const I=B6_nightInfo(s.key),x0=64,w=520,y0=60,TX=m=>x0+m/480*w,lev={W:0,R:1,N1:2,N2:3,N3:4},LY=l=>y0+16+l*36;
  const nm=I.rem.filter(j=>s.marked.includes(j)).length,all=nm===I.rem.length;
  let out=heading(all?`${I.rem.length} REM periods: ${I.rem.length} cycles`:`${B6_NIGHTS[s.key][0]}: mark the REM periods`);
  out+=R(x0-4,y0-4,w+8,180,'#fff',C.grid,6);
  ['Wake','REM','N1','N2','N3'].forEach((v,j)=>out+=TF(x0-10,LY(j)+5,v,13,j===1?C.coral:C.muted,'end')+L(x0,LY(j),x0+w,LY(j),C.grid,1));
  const pts=[];I.segs.forEach(q=>{const y=LY(lev[q.st]);pts.push([TX(q.a),y],[TX(q.b),y])});out+=B6_poly(pts,C.ink,1.8);
  I.rem.forEach((j,c)=>{const q=I.segs[j],on=s.marked.includes(j),bar=R(TX(q.a),LY(1)-7,TX(q.b)-TX(q.a),14,on?C.coral:C.coralp,C.coral,3);
   out+=hit(X,'mark',j,`REM period ${c+1}, ${q.b-q.a} minutes`,bar);if(on)out+=TBF((TX(q.a)+TX(q.b))/2,LY(1)-12,String(c+1),13,C.coral)});
  for(let h=0;h<=8;h++)out+=TF(TX(h*60),y0+194,h+(h===8?' h':''),13,C.muted);
  out+=TF(x0+w/2,y0+212,'hours after lights out',13,C.muted);
  const pc=k=>Math.round(100*I.tot[k]/I.total);
  [['W','Awake'],['N1','N1'],['N2','N2'],['N3','N3'],['R','REM']].forEach(([k,lab],j)=>out+=B6_tile(20+j*114,290,104,lab,`${I.tot[k]} min · ${pc(k)}%`,B6_STAGE_COL[k]||C.ink));
  const ends=I.rem.map(j=>I.segs[j].b),lens=ends.map((e,c)=>e-(c?ends[c-1]:I.onset)),avg=Math.round(sum(lens)/lens.length);
  const firstN3=I.segs.filter(q=>q.st==='N3'&&q.a<240).reduce((a,q)=>a+q.b-q.a,0);
  out+=B6_note('Illustrative hypnogram; real nights vary widely between people and from night to night.',372);
  const ph=all?`Cycle lengths from sleep onset to the end of each REM period: ${lens.join(', ')} minutes, an average of ${avg}. ${firstN3} of the ${I.tot.N3} minutes of N3 fall in the first four hours, and the REM periods grow from ${I.segs[I.rem[0]].b-I.segs[I.rem[0]].a} to ${Math.max(...I.rem.map(j=>I.segs[j].b-I.segs[j].a))} minutes.`:
   nm?`${nm} of ${I.rem.length} REM periods marked. Each one ends a cycle; keep going through the night.`:
   s.key==='older'?'This illustrative older sleeper has little N3 and wakes briefly several times, which matches the average trends with age. Press the REM bars to count the cycles.':s.key==='recovery'?'After a night without sleep, recovery sleep starts quickly and holds far more N3, especially early. It is deeper, not twice as long. Press the REM bars to count the cycles.':
   'Down to deep sleep, back up into REM, and again. Press each red REM bar to mark the end of a cycle.';
  return {svg:out,phase:ph};
 }});

/* Two-process model (Borbély 1982; parameters of Daan, Beersma & Borbély 1984): sleep pressure S rises while awake
   towards 1 with time constant 18.2 h and falls while asleep with time constant 4.2 h. Sleep starts when S reaches an upper
   threshold and ends at a lower one; both thresholds follow the circadian process C. Threshold shape chosen here so that
   the model sleeper sleeps 23:00–07:00 at baseline. Time runs from 07:00 on day 1. */
const B6_SP_RISE=18.2,B6_SP_FALL=4.2,B6_CA=.1,B6_H0=.674,B6_L0=.143;
const B6_C=clock=>Math.cos(2*Math.PI*(clock-15)/24);
const B6_SP_CACHE={};
function B6_pressure(extra){
 if(B6_SP_CACHE[extra])return B6_SP_CACHE[extra];
 const dt=.05,N=Math.round(84/dt),free=40+extra;let S=.0928,asleep=false;const out=[],bouts=[];let bStart=0;
 for(let i=0;i<=N;i++){const t=i*dt,c=7+t,H=B6_H0+B6_CA*B6_C(c),Lw=B6_L0+B6_CA*B6_C(c),forced=t>=24&&t<free;
  if(!asleep&&!forced&&S>=H){asleep=true;bStart=t}else if(asleep&&S<=Lw){asleep=false;bouts.push([bStart,t])}
  out.push([t,S,H,Lw,asleep]);
  S=asleep?S*Math.exp(-dt/B6_SP_FALL):1-(1-S)*Math.exp(-dt/B6_SP_RISE)}
 if(asleep)bouts.push([bStart,84]);
 return B6_SP_CACHE[extra]={pts:out,bouts};
}
SCENE({id:'sleep-stages-pressure',name:'Two processes time sleep',tag:'Borbély’s model, 1982',
 definition:'In 1982 Alexander Borbély proposed that two processes decide when we sleep. Sleep pressure (Process S) builds up while we are awake and drains away during sleep. A circadian signal from the body clock (Process C) sets the thresholds at which sleep begins and ends. Sleep comes when pressure meets the upper threshold, and ends when it falls to the lower one.',
 example:'The model explains why recovery sleep after a night awake is deeper but not much longer: the clock ends it in the morning anyway. A candidate for part of Process S is adenosine, which builds up in the basal forebrain of cats kept awake (Porkka-Heiskanen and colleagues, 1997); caffeine blocks adenosine receptors. The model is about timing, not about what sleep is for.',
 desc:'Three days of a model sleeper: the sleep-pressure curve rising and falling, two dashed thresholds that rise and fall with the body clock, and bars marking sleep. The learner keeps the sleeper awake for extra hours on the second night.',
 research:['Borbély (1982). A two process model of sleep regulation. Human Neurobiology 1, 195–204.','Daan, Beersma & Borbély (1984). Timing of human sleep: recovery process gated by a circadian pacemaker. American Journal of Physiology 246, R161–R178.','Porkka-Heiskanen and others (1997). Adenosine: a mediator of the sleep-inducing effects of prolonged wakefulness. Science 276, 1265–1268.'],
 dur:12,hint:'Keep the model sleeper awake for extra hours on night 2 and read how long the recovery sleep lasts. This is a model of timing, not advice on how much anyone should sleep.',
 init:()=>({extra:8}),
 watch(p){return {extra:[0,8,16,24][Math.min(3,Math.floor(p*4))]}},
 ui:[{range:'extra',label:'Extra hours awake on night 2',min:0,max:24,step:1,get:s=>s.extra,act:'extra',show:v=>v+' h'}],
 on:{extra(s,v){s.extra=clamp(Math.round(+v),0,24)}},
 draw(s){
  const M=B6_pressure(s.extra),pl=B6_plot(60,56,520,200,[0,84],[0,1],{xt:[0,12,24,36,48,60,72,84].map(t=>[t,B6_hh(7+t)]),yt:[[0,'0'],[.5,'0.5'],[1,'1']],yl:'sleep pressure, S',xlDy:0});
  let out=pl.svg;
  // night shading by clock (23:00–07:00)
  for(const a of [16,40,64])out+=R(pl.X(a),57,pl.X(a+8)-pl.X(a),198,'#eef2f6','none',0);
  const ps=[],ph=[],pL=[];M.pts.forEach((q,i)=>{if(i%4)return;ps.push([pl.X(q[0]),pl.Y(q[1])]);ph.push([pl.X(q[0]),pl.Y(q[2])]);pL.push([pl.X(q[0]),pl.Y(q[3])])});
  out+=B6_poly(ph,C.amber,1.8,'stroke-dasharray="6 4"')+B6_poly(pL,C.amber,1.8,'stroke-dasharray="6 4"')+B6_poly(ps,C.purple,2.6);
  out+=TF(pl.X(3),pl.Y(.8)-4,'upper threshold',13,C.amber,'start')+TF(pl.X(3),pl.Y(.26)-4,'lower threshold',13,C.amber,'start');
  M.bouts.forEach(([a,b])=>out+=R(pl.X(a),262,pl.X(b)-pl.X(a),12,C.purple,'none',3));
  if(s.extra)out+=R(pl.X(40),278,pl.X(40+s.extra)-pl.X(40),8,C.coral,'none',2);
  out+=TF(60,272,'asleep',13,C.purple,'end')+(s.extra?TF(60,288,'kept up',13,C.coral,'end'):'');
  const rec=M.bouts.find(b=>b[0]>=40-.01)||M.bouts[M.bouts.length-1],base=M.bouts[0],len=rec?rec[1]-rec[0]:0,blen=base[1]-base[0];
  const wake=rec?rec[0]-M.bouts[0][1]:0,ix=Math.round(rec[0]/.05),Sb=M.pts[Math.min(M.pts.length-1,ix)][1];
  out+=B6_tile(60,300,160,'Awake before it',fmt(B6_r1(wake))+' h',C.coral)+B6_tile(232,300,160,'Recovery sleep',fmt(B6_r1(len))+' h',C.purple)+B6_tile(404,300,176,'Baseline sleep',`${B6_hh(7+base[0])}–${B6_hh(7+base[1])}`,C.ink);
  out+=B6_note('Model sleeper. Time constants 18.2 h rising, 4.2 h falling (Daan et al. 1984).',368);
  const phase=!s.extra?`Baseline: pressure rises for 16 hours, meets the upper threshold at ${B6_hh(7+base[0])} and drains to the lower one by ${B6_hh(7+base[1])}. The pattern repeats each day.`:
   `Kept up ${s.extra} extra hours, the sleeper has been awake ${fmt(B6_r1(wake))} hours and pressure reaches ${fmt(Math.round(Sb*100)/100)}. Sleep starts at ${B6_hh(7+rec[0])} and lasts ${fmt(B6_r1(len))} hours, ${len<blen-.3?`shorter than the baseline ${fmt(B6_r1(blen))}: the lower threshold, rising with the clock through the morning, ends it early.${B6_mod(7+rec[0])>=3&&B6_mod(7+rec[0])<=12?' Daan, Beersma and Borbély predicted short sleep when bedtime falls in the morning.':''}`:len<=blen+1.5?`close to the baseline ${fmt(B6_r1(blen))}: the clock ends it at about the usual morning time, so the debt is paid off mainly by deeper sleep, not by longer sleep.`:`longer than the baseline ${fmt(B6_r1(blen))}: it starts while the lower threshold is still falling towards its night-time low, so pressure has hours to drain.`}`;
  return {svg:out,phase};
 }});

/* ===================== Lesson: arousal-systems ===================== */
// Schematic cat brainstem, side view. Procedures in historical order: Bremer's two cuts (1935), Moruzzi & Magoun's
// stimulation (1949), and Lindsley, Bowden & Magoun's lesions of the core or of the sensory pathways (1949).
const B6_PROC={
 cerveau:['High cut (Bremer)','Cut through the midbrain','sleep',1935],
 encephale:['Low cut (Bremer)','Cut below the medulla','cycle',1935],
 stim:['Stimulate the core','Electrode in the reticular formation','wake',1949],
 core:['Destroy the core','Central core destroyed, sensory paths spared','sleep',1949],
 lemn:['Cut sensory paths','Sensory paths cut, core spared','wake',1949]};
function B6_eegStrip(kind,x0,w,y,seed,amp=1){
 const r=B6_rng(seed),pts=[],n=180;let lp=0;
 for(let i=0;i<=n;i++){const t=i/n*3;lp=.6*lp+.4*B6_gauss(r);
  const v=kind==='sleep'?(26*Math.sin(2*Math.PI*1.6*t+seed)+14*Math.sin(2*Math.PI*3.1*t)+6*lp):(5*Math.sin(2*Math.PI*21*t)+6*lp+3*Math.sin(2*Math.PI*33*t));
  pts.push([x0+i/n*w,y-v*amp])}
 return B6_poly(pts,kind==='sleep'?C.purple:C.amber,1.4);
}
SCENE({id:'arousal-systems',name:'Waking the cortex from below',tag:'Moruzzi and Magoun, 1949',
 definition:'In the 1930s Frédéric Bremer cut through the brainstem of cats. Cut through the midbrain, the forebrain showed a sleeping EEG for good; cut lower, below the medulla, it still slept and woke. He thought sleep followed the loss of sensory input. In 1949 Giuseppe Moruzzi and Horace Magoun stimulated the reticular formation, the net-like core of the brainstem, in cats under anaesthesia: the slow, large EEG waves gave way at once to the small, fast pattern of waking.',
 example:'The same year Lindsley, Bowden and Magoun destroyed that core while sparing the sensory pathways that run beside it: the EEG stayed in a sleep-like pattern. Cutting the sensory pathways and sparing the core did not. Waking is kept up by an activating system, not just by the senses. That system turned out to be several distinct groups of neurons.',
 desc:'A side view of a brainstem with the reticular core shaded, showing where each procedure cuts, stimulates or destroys. Below, the EEG recorded from the cortex before and after.',
 research:['Bremer (1935). Cerveau « isolé » et physiologie du sommeil. Comptes Rendus de la Société de Biologie 118.','Moruzzi & Magoun (1949). Brain stem reticular formation and activation of the EEG. Electroencephalography and Clinical Neurophysiology 1, 455–473.','Lindsley, Bowden & Magoun (1949). Effect upon the EEG of acute injury to the brain stem activating system. Electroencephalography and Clinical Neurophysiology 1, 475–486.'],
 dur:15,hint:'Choose a procedure, then record the EEG from the cortex. Compare each result with what “loss of sensory input” would predict. The traces are schematic.',
 init:()=>({proc:'stim',rec:0}),
 watch(p){const k=Math.min(4,Math.floor(p*5)),u=p*5-k;return {proc:Object.keys(B6_PROC)[k],rec:u>.35?1:0}},
 ui:[{choose:Object.keys(B6_PROC).map(k=>[k,B6_PROC[k][0]]),label:'Procedure',get:s=>s.proc,act:'proc'},{b:'Record the EEG',act:'rec'}],
 on:{proc(s,v){s.proc=B6_PROC[v]?v:'stim';s.rec=0},rec(s){s.rec=1}},
 draw(s){
  const Pr=B6_PROC[s.proc],res=Pr[2];
  let out=heading(!s.rec?Pr[1]:res==='wake'?'The EEG shows the waking pattern':res==='sleep'?'The EEG stays in a sleeping pattern':'The isolated brain still sleeps and wakes');
  // side view: cortex, thalamus, midbrain, pons, medulla, cord
  out+=R(14,46,572,186,'#fff',C.grid,8);
  out+=P('M40 150C40 80 120 56 210 60C270 62 300 90 306 128C292 146 250 156 214 150C180 166 120 170 80 168C56 166 40 162 40 150Z',C.line,2,'#f2f6f9')+TF(150,96,'cortex',13,C.muted);
  out+=`<ellipse cx="236" cy="132" rx="30" ry="18" fill="${C.pale}" stroke="${C.line}" stroke-width="2"/>`+TF(236,137,'thalamus',13,C.muted);
  out+=P('M262 140C300 140 330 150 360 162L470 178L566 182L566 204L470 202L356 194C320 184 290 172 262 162Z',C.line,2,'#f2f6f9');
  out+=TF(318,214,'midbrain',13,C.muted)+TF(400,222,'pons',13,C.muted)+TF(480,222,'medulla',13,C.muted)+TF(552,174,'cord',13,C.muted,'end');
  // reticular core (dotted band) and sensory path (line beside it)
  const coreDead=s.proc==='core';
  out+=P('M282 154C320 160 350 172 380 180L520 190',coreDead?C.muted:C.purple,9,'none',coreDead?'stroke-dasharray="2 6" opacity=".5"':'stroke-dasharray="2 4" opacity=".75"');
  out+=TF(420,166,coreDead?'core destroyed':'reticular core',13,coreDead?C.muted:C.purple);
  const lem=s.proc==='lemn';out+=P('M560 198L470 196L360 188C320 180 290 168 250 146',lem?C.muted:C.green,2.4,'none',lem?'stroke-dasharray="6 5"':'')+TF(530,212,lem?'sensory paths cut':'sensory paths',13,lem?C.muted:C.green,'end');
  if(s.proc==='cerveau')out+=L(318,128,300,206,C.coral,4)+TF(296,124,'cut',13,C.coral,'end');
  if(s.proc==='encephale')out+=L(548,166,540,214,C.coral,4)+TF(556,160,'cut',13,C.coral);
  if(s.proc==='stim')out+=L(390,100,392,176,C.ink,3)+Ci(392,178,5,C.amber)+TF(398,98,'stimulating electrode',13,C.ink,'start');
  out+=L(120,60,120,40,C.ink,2)+TF(128,44,'EEG electrode',13,C.ink,'start');
  // EEG
  out+=R(14,240,572,104,'#fff',C.grid,8);
  const before=s.proc==='stim'?'sleep':s.proc==='cerveau'||s.proc==='core'?'wake':'wake';
  out+=TBF(30,260,'Before',13,C.ink,'start')+B6_eegStrip(before,30,250,300,3);
  out+=TBF(320,260,s.proc==='stim'?'During stimulation':'After',13,C.ink,'start');
  if(s.rec){if(res==='cycle'){out+=B6_eegStrip('sleep',320,120,300,5,.8)+B6_eegStrip('wake',446,124,300,6)+TF(380,334,'sleeps',13,C.purple)+TF(508,334,'wakes',13,C.amber)}
   else out+=B6_eegStrip(res==='wake'?'wake':'sleep',320,250,300,7)}
  else out+=TF(445,304,'press Record',13,C.muted);
  out+=TF(155,334,before==='sleep'?'large slow waves (asleep or anaesthetised)':'small fast waves (awake)',13,C.muted);
  out+=B6_note('Schematic traces. Cats, under anaesthesia or after the cuts described; no picture of the animals.',368);
  const ph=!s.rec?{cerveau:'Bremer, 1935: a cut through the midbrain leaves the forebrain connected to smell and sight only. What will its EEG show?',encephale:'Bremer’s second cut, below the medulla, separates the brain from the spinal cord but leaves the whole brainstem attached.',stim:'Moruzzi and Magoun place an electrode in the reticular formation of an anaesthetised cat, whose EEG shows large slow waves.',core:'Lindsley, Bowden and Magoun destroy the central core of the brainstem and leave the sensory pathways that run beside it.',lemn:'The control: cut the sensory pathways and spare the reticular core.'}[s.proc]:
   {cerveau:'The forebrain sits in a permanent sleep-like state, with large slow waves. Bremer read this as a loss of the stream of sensory input. The later experiments show a second reading: the cut also removes the brainstem’s activating core.',encephale:'With the whole brainstem attached the brain still alternates between sleeping and waking patterns. Whatever keeps the brain awake lies between the two cut levels.',stim:'Within seconds the large slow waves vanish and the small fast waves of an alert brain appear, without any sensory stimulus. The brainstem core can wake the cortex by itself.',core:'With the core destroyed the EEG stays slow and sleep-like, even though sensory signals can still reach the cortex. Input alone does not keep the brain awake.',lemn:'With the sensory pathways cut but the core intact, the EEG still shows waking and arousal. Together with the core lesions this pointed to an ascending activating system.'}[s.proc];
  return {svg:out,phase:ph};
 }});

// Arousal cell groups. Relative firing (1 = highest) in waking, non-REM and REM sleep: an illustrative summary of recordings
// in rats, cats and mice (LC: Aston-Jones & Bloom 1981; raphe: Trulson & Jacobs 1979; VLPO: Sherin et al. 1996;
// orexin: Lee, Hassani & Jones 2005; Mileykovskiy, Kiyashchenko & Siegel 2005).
const B6_NUC=[
 {id:'lc',name:'Locus coeruleus',tx:'noradrenaline',at:[430,150],f:[1,.4,.03]},
 {id:'raphe',name:'Raphe nuclei',tx:'serotonin',at:[392,170],f:[1,.5,.05]},
 {id:'tmn',name:'Tuberomammillary nucleus',tx:'histamine',at:[262,184],f:[1,.2,.03]},
 {id:'ppt',name:'Pons (PPT/LDT)',tx:'acetylcholine',at:[356,160],f:[.9,.2,1]},
 {id:'bf',name:'Basal forebrain',tx:'acetylcholine',at:[214,172],f:[1,.3,.9]},
 {id:'orx',name:'Lateral hypothalamus',tx:'orexin',at:[246,162],f:[1,.1,.1]},
 {id:'vlpo',name:'VLPO (sleep-active)',tx:'GABA, galanin',at:[226,190],f:[.15,1,.8]}];
const B6_STATE3=[['W','Waking'],['N','Non-REM'],['R','REM']],B6_NUC_HZ=3;
function B6_nucSpikes(nu,si,seed=1){const r=B6_rng(seed*31+si*7+nu.id.length*101+nu.id.charCodeAt(0)),rate=nu.f[si]*B6_NUC_HZ,out=[];let t=0;
 if(rate<=0)return out;while(true){t+=-Math.log(Math.max(1e-9,r()))/rate;if(t>=4)break;out.push(t)}return out}
SCENE({id:'arousal-systems-nuclei',name:'Cell groups that keep us awake',tag:'Several transmitters, one switch',
 definition:'The activating system is a set of small cell groups, each using its own transmitter and projecting widely: noradrenaline from the locus coeruleus, serotonin from the raphe nuclei, histamine from the tuberomammillary nucleus, acetylcholine from the pons and the basal forebrain, and orexin from the lateral hypothalamus. Many fire fastest in waking, slow down in non-REM sleep and fall almost silent in REM sleep.',
 example:'The acetylcholine cells are the exception: many are active again in REM sleep, which helps explain its waking-like EEG. Opposing them is a sleep-active group in the ventrolateral preoptic area (VLPO), found by Sherin, Saper and colleagues in 1996, which inhibits the arousal groups. Older antihistamines that enter the brain cause drowsiness by blocking histamine.',
 desc:'A side view of the brainstem and hypothalamus with seven cell groups marked. Bars show each group’s relative firing in the chosen state, and a spike raster shows the selected group in waking, non-REM and REM sleep.',
 research:['Aston-Jones & Bloom (1981). Activity of norepinephrine-containing locus coeruleus neurons in behaving rats anticipates fluctuations in the sleep-waking cycle. Journal of Neuroscience 1, 876–886.','Trulson & Jacobs (1979). Raphe unit activity in freely moving cats. Brain Research 163, 135–150.','Sherin, Shiromani, McCarley & Saper (1996). Activation of ventrolateral preoptic neurons during sleep. Science 271, 216–219.'],
 dur:12,hint:'Choose a state, then press a cell group on the map to see its spikes in all three states. “Hear” plays four seconds of the chosen state as soft clicks. Rates are illustrative.',
 init:()=>({st:0,sel:'lc'}),
 watch(p){const k=Math.min(8,Math.floor(p*9));return {st:k%3,sel:['lc','ppt','vlpo'][Math.floor(k/3)]}},
 ui:[{choose:B6_STATE3.map((v,i)=>[i,v[1]]),label:'State',get:s=>s.st,act:'st'},{b:'Hear this group ▶',act:'hear'}],
 on:{st(s,v){s.st=clamp(+v|0,0,2)},pick(s,v){if(B6_NUC.some(n=>n.id===v))s.sel=v},hear(s){const nu=B6_NUC.find(n=>n.id===s.sel);B6_click(B6_nucSpikes(nu,s.st),.12);return 'keep'}},
 draw(s,f,X){
  const nu=B6_NUC.find(n=>n.id===s.sel)||B6_NUC[0],si=s.st;
  let out=heading(`${B6_STATE3[si][1]}: ${nu.name.replace(' (sleep-active)','')} ${nu.f[si]>.6?'fires fast':nu.f[si]>.25?'slows down':'falls nearly silent'}`);
  // map
  out+=R(14,46,300,196,'#fff',C.grid,8);
  out+=P('M40 150C40 90 110 64 190 66C240 68 270 92 276 120C262 136 230 146 204 142C170 154 110 160 76 158C52 156 40 154 40 150Z',C.line,2,'#f4f8fb')+TF(130,100,'cortex',13,C.muted);
  out+=P('M234 150C270 150 300 152 330 156L440 170L304 186L304 202L240 194Z',C.line,2,'#f4f8fb');
  out+=P('M300 158L440 170L452 196L310 196Z',C.line,2,'#f4f8fb')+TF(380,226,'brainstem',13,C.muted)+TF(220,226,'hypothalamus',13,C.muted);
  out+=P('M300 158L440 170L452 196L310 196Z','none',0,'none');
  for(const n of B6_NUC){const on=n.id===nu.id,col=n.id==='vlpo'?C.green:C.coral,rr=4+7*n.f[si];
   out+=hit(X,'pick',n.id,`${n.name}, ${n.tx}`,Ci(n.at[0],n.at[1],12,'rgba(255,255,255,.01)','none')+Ci(n.at[0],n.at[1],rr,col,on?C.ink:'#fff'))}
  out+=TF(nu.at[0],nu.at[1]-18,nu.tx,13,C.ink);
  // bars
  out+=TBF(330,58,'Relative firing now',13,C.ink,'start');
  B6_NUC.forEach((n,i)=>{const y=70+i*24,on=n.id===nu.id,col=n.id==='vlpo'?C.green:C.coral;
   out+=TF(470,y+14,n.name,13,on?C.ink:C.muted,'end',on?'font-weight="700"':'')+R(478,y+3,100,14,'#f1f4f7','none',3)+R(478,y+3,100*n.f[si],14,col,'none',3)});
  // raster for the selected group in all three states
  out+=R(14,250,572,94,'#fff',C.grid,8)+TBF(26,268,`${nu.name}: 4 seconds in each state`,13,C.ink,'start');
  B6_STATE3.forEach(([k,lab],j)=>{const y=290+j*18,x0=140,w=430;out+=TF(130,y+5,lab,13,j===si?C.ink:C.muted,'end',j===si?'font-weight="700"':'')+L(x0,y,x0+w,y,C.grid,1);
   for(const t of B6_nucSpikes(nu,j))out+=L(x0+t/4*w,y-7,x0+t/4*w,y+7,j===si?C.ink:C.muted,1.8)});
  out+=B6_note('Illustrative rates; the pattern follows recordings in rats, cats and mice.',368);
  const ph=nu.id==='vlpo'?`The VLPO is the other side of the switch: its GABA neurons fire most in sleep and inhibit the arousal groups, which in turn inhibit them. ${si?'In sleep it is at its most active.':'In waking it is held quiet.'}`:
   nu.id==='ppt'||nu.id==='bf'?`These acetylcholine cells fire in waking and again in REM sleep, but little in non-REM sleep. Their return in REM helps give REM its active, waking-like cortex while the noradrenaline and serotonin cells are silent.`:
   `${nu.name} (${nu.tx}) fires most in waking, less in non-REM sleep and almost not at all in REM sleep${nu.id==='orx'?', apart from brief bursts':''}. Its axons reach most of the forebrain, so a change in this one small group changes the state of the whole cortex.`;
  return {svg:out,phase:ph};
 }});

/* Flip-flop toy model, minute by minute: a state ends when its "depth" falls below zero, or by chance, more often when
   it is shallow (probability 0.3·exp(−depth/0.06) a minute). Depth = drive in that state’s favour + 0.03 + 0.15 × (fraction of orexin cells left). Drive follows the
   day: h = 0.4 − 0.8·cos(2π(t − 3)/24) (positive favours waking). Starts awake at 07:00. A toy, not a fitted model. */
function B6_ffDay(frac,seed){
 const r=B6_rng(seed*4441+17),seq=[];let st=1,tr=0,wake=0;
 for(let i=0;i<1440;i++){const t=7+i/60,h=.4-.8*Math.cos(2*Math.PI*(t-3)/24),depth=(st?h:-h)+.03+.15*frac;
  if(depth<0||r()<.3*Math.exp(-depth/.06)){st=1-st;tr++}wake+=st;seq.push(st)}
 const bouts=[];let a=0;for(let i=1;i<=1440;i++)if(i===1440||seq[i]!==seq[a]){bouts.push([a,i,seq[a]]);a=i}
 const dayBouts=bouts.filter(b=>b[2]===0&&b[0]<16*60&&b[0]>0).length,nightWakes=bouts.filter(b=>b[2]===1&&b[0]>=16*60).length;
 return {seq,bouts,tr,wake:wake/60,dayBouts,nightWakes};
}
SCENE({id:'arousal-systems-orexin',name:'Orexin and narcolepsy',tag:'Discovered 1998; narcolepsy explained 1999–2000',
 definition:'In 1998 two groups found the same new peptide made only by a small cluster of neurons in the lateral hypothalamus. Luis de Lecea, Thomas Kilduff and colleagues called it hypocretin; Takeshi Sakurai, Masashi Yanagisawa and colleagues called it orexin and linked it to feeding. In 1999 Emmanuel Mignot’s group found that narcolepsy in dogs is caused by a mutation in an orexin receptor gene, and Yanagisawa’s group found that mice lacking orexin have narcolepsy too.',
 example:'In 2000 Thannickal, Siegel and colleagues, and Peyron, Mignot and colleagues, found that people with narcolepsy with cataplexy have lost most of their orexin neurons, around nine in ten. Narcolepsy is a neurological condition, not laziness: total sleep over a day is about normal, but waking and sleep both break up. The loss is thought to be autoimmune, which is likely but not proven.',
 desc:'A strip for one simulated day with waking and sleep blocks, for the chosen fraction of orexin cells, and a strip for an intact switch on the same day for comparison. A small diagram shows the two sides of the switch inhibiting each other, with orexin supporting the waking side.',
 research:['de Lecea and others (1998), PNAS 95; Sakurai and others (1998), Cell 92.','Lin and others (1999), Cell 98, 365–376 (dogs); Chemelli and others (1999), Cell 98, 437–451 (mice).','Thannickal and others (2000), Neuron 27, 469–474; Peyron and others (2000), Nature Medicine 6, 991–997.','Saper, Chou & Scammell (2001). The sleep switch: hypothalamic control of sleep and wakefulness. Trends in Neurosciences 24, 726–731.'],
 dur:12,hint:'Lower the fraction of orexin cells left and compare the day with the intact one. “Another day” draws new random fluctuations. A toy model; it describes no person.',
 init:()=>({frac:10,seed:1}),
 watch(p){return {frac:[100,60,30,10][Math.min(3,Math.floor(p*4))],seed:1}},
 ui:[{range:'frac',label:'Orexin cells left',min:0,max:100,step:10,get:s=>s.frac,act:'frac',show:v=>v+'%'},{b:'Another day',act:'day'}],
 on:{frac(s,v){s.frac=clamp(Math.round(+v/10)*10,0,100)},day(s){s.seed=s.seed%50+1}},
 draw(s){
  const D=B6_ffDay(s.frac/100,s.seed),D0=B6_ffDay(1,s.seed),x0=110,w=470,TX=m=>x0+m/1440*w;
  let out=heading(s.frac>=80?'An intact switch: one long wake, one long sleep':`${s.frac}% of orexin cells: the switch flips ${D.tr} times`);
  const strip=(d,y,lab)=>{let o=TF(x0-8,y+15,lab,13,C.ink,'end');for(const [a,b,st] of d.bouts)o+=R(TX(a),y,Math.max(.8,TX(b)-TX(a)),22,st?C.amber:C.purple,'none',0);return o};
  out+=strip(D0,56,'intact')+strip(D,92,s.frac+'% left');
  for(let h=0;h<=24;h+=4)out+=L(TX(h*60),116,TX(h*60),121,C.line,1)+TF(TX(h*60),136,B6_hh(7+h),13,C.muted);
  out+=R(x0,146,12,12,C.amber,'none',2)+TF(x0+18,157,'awake',13,C.ink,'start')+R(x0+90,146,12,12,C.purple,'none',2)+TF(x0+108,157,'asleep',13,C.ink,'start');
  // switch diagram
  out+=R(14,176,290,166,'#fff',C.grid,8)+TBF(159,196,'The flip-flop switch',13,C.ink);
  out+=box(34,230,104,44,'wake side',C.amberp,C.amber,14)+box(180,230,104,44,'sleep side',C.purplep,C.purple,14);
  out+=curveArrow(138,240,180,240,-16,C.ink,2)+curveArrow(180,266,138,266,-16,C.ink,2)+TF(159,222,'each inhibits the other',13,C.muted);
  out+=arrow(86,326,86,278,C.coral,1.5+2.5*s.frac/100)+TF(96,322,`orexin: ${s.frac}%`,13,C.coral,'start');
  out+=TF(232,300,'arousal groups',13,C.muted)+TF(232,316,'vs VLPO',13,C.muted);
  // tiles
  out+=B6_tile(320,176,130,'Switches today',String(D.tr),D.tr>4?C.coral:C.green)+B6_tile(456,176,130,'Intact switch',String(D0.tr),C.ink);
  out+=B6_tile(320,230,130,'Naps by day',String(D.dayBouts),C.purple)+B6_tile(456,230,130,'Wakings at night',String(D.nightWakes),C.amber);
  out+=B6_tile(320,284,266,'Total time awake',`${fmt(B6_r1(D.wake))} h (intact ${fmt(B6_r1(D0.wake))} h)`,C.ink);
  out+=B6_note('Toy model of the switch, one minute per step. People with narcolepsy lose about 90% of these cells.',370);
  const ph=s.frac>=80?`With orexin the waking side is held firmly: ${D0.tr} switch${D0.tr===1?'':'es'} in this day, waking for ${fmt(B6_r1(D0.wake))} hours. Orexin does not decide when sleep comes; it makes each state stable once reached.`:
   `With ${s.frac}% of the orexin cells, the total time awake hardly changes (${fmt(B6_r1(D.wake))} against ${fmt(B6_r1(D0.wake))} hours), but the day breaks up: ${D.dayBouts} sleep episode${D.dayBouts===1?'':'s'} by day and ${D.nightWakes} waking${D.nightWakes===1?'':'s'} at night. This is the pattern of narcolepsy: unstable states, not simply more sleep. The model leaves out cataplexy, in which the muscle slackness of REM sleep breaks into waking.`;
  return {svg:out,phase:ph};
 }});

/* ===================== Lesson: reward-dopamine ===================== */
// Self-stimulation as a cumulative record. Rates are illustrative: about 8 presses a minute at a septal site with the
// current on, about 0.4 a minute (chance pressing) at a site with no effect or with the current off.
const B6_SITE={septal:['Septal area',8],neutral:['A site with no effect',.4]};
const B6_OM_SEG=10;
function B6_omPresses(segs){const out=[];let t=0,rate=.4;
 segs.forEach((g,i)=>{const r=B6_rng(i*613+(g.on?7:3)+g.site.length*11),target=g.on?B6_SITE[g.site][1]:.4;
  for(let m=0;m<B6_OM_SEG;m+=.05){rate+=(target-rate)*(g.on?.08:.025);if(r()<rate*.05)out.push(t+m)}t+=B6_OM_SEG});
 return out}
const B6_omInit=()=>({site:'septal',on:1,segs:[]});
SCENE({id:'reward-dopamine',name:'Rats that press for brain stimulation',tag:'Olds and Milner, 1954',
 definition:'In 1954 James Olds and Peter Milner, at McGill University, implanted fine electrodes in rats’ brains and let each rat deliver a brief current to its own brain by pressing a lever. With the electrode tip near the septal area the rats pressed again and again; at other sites they pressed no more than by chance, and at some they avoided the lever. This is brain self-stimulation.',
 example:'When the current was switched off, pressing died away, as with food reward in an ordinary training box. Olds spoke of “pleasure centres”, but the experiment shows only that the rats worked for the stimulation, not what they felt. Later work tied much of the effect to the brain’s dopamine pathways.',
 desc:'A cumulative record: a line that steps up each time the rat presses the lever, so that its slope is the rate of pressing. Each block of ten minutes can use a different electrode site, with the current on or off.',
 research:['Olds & Milner (1954). Positive reinforcement produced by electrical stimulation of septal area and other regions of rat brain. Journal of Comparative and Physiological Psychology 47, 419–427.','Delgado, Roberts & Miller (1954). Learning motivated by electrical stimulation of the brain. American Journal of Physiology 179, 587–593 (sites that cats learned to avoid).','Wise (1978). Catecholamine theories of reward: a critical review. Brain Research 152, 215–247.'],
 dur:12,hint:'Choose an electrode site and whether the current is on, then run the session ten minutes at a time. The slope of the record is the rate of pressing. Rates are illustrative.',
 init:B6_omInit,
 watch(p){const k=Math.min(6,Math.floor(p*7)),plan=[['septal',1],['septal',1],['septal',1],['septal',0],['septal',0],['septal',1]];return {site:'septal',on:1,segs:plan.slice(0,k).map(([site,on])=>({site,on}))}},
 ui:[{choose:Object.keys(B6_SITE).map(k=>[k,B6_SITE[k][0]]),label:'Electrode site',get:s=>s.site,act:'site'},{choose:[[1,'Current on'],[0,'Current off']],label:'Current',get:s=>s.on,act:'on'},{b:'Run 10 minutes',act:'run'},{b:'Hear the last minute ▶',act:'hear'}],
 on:{site(s,v){if(B6_SITE[v])s.site=v},on(s,v){s.on=+v?1:0},run(s){if(s.segs.length>=6)s.segs.shift();s.segs.push({site:s.site,on:s.on})},
  hear(s){const pr=B6_omPresses(s.segs),end=s.segs.length*B6_OM_SEG;B6_click(pr.filter(t=>t>=end-1).map(t=>(t-(end-1))*60/6),.1);return 'keep'}},
 draw(s){
  const pr=B6_omPresses(s.segs),n=s.segs.length,last=s.segs[n-1];
  let out=heading(!n?'Ready: one rat, one lever':last.on&&last.site==='septal'?'The rat presses for the current':last.on?'At this site the rat ignores the lever':'Current off: pressing dies away');
  // box sketch
  out+=R(18,52,150,120,'#fff',C.grid,8)+R(30,72,126,88,C.pale,C.line,6)+R(140,108,16,8,C.ink,'none',2)+TF(126,102,'lever',13,C.ink,'end');
  out+=P('M60 52C60 40 80 34 100 40',C.amber,2)+TF(100,36,'cable',13,C.amber,'start')+TF(93,150,'training box',13,C.muted);
  out+=B6_tile(18,184,150,'Presses so far',String(pr.length),C.coral);
  const lastRate=n?pr.filter(t=>t>=(n-1)*B6_OM_SEG).length/B6_OM_SEG:0;
  out+=B6_tile(18,238,150,'Last 10 minutes',n?fmt(B6_r1(lastRate))+' a minute':'—',C.ink);
  // cumulative record
  const pl=B6_plot(232,56,350,220,[0,60],[0,Math.max(100,Math.ceil(pr.length/100)*100)],{xt:[0,10,20,30,40,50,60].map(v=>[v,String(v)]),xl:'minutes',yl:'total presses'});out+=pl.svg;
  s.segs.forEach((g,i)=>{const x=pl.X(i*B6_OM_SEG);out+=R(x,57,pl.X(B6_OM_SEG)-pl.X(0),10,g.on?(g.site==='septal'?C.coralp:C.pale):'#eceff2','none',0)+TF(x+29,300,g.on?(g.site==='septal'?'septal':'no effect'):'off',13,g.on?(g.site==='septal'?C.coral:C.blue):C.muted)});
  const pts=[[pl.X(0),pl.Y(0)]];pr.forEach((t,i)=>{pts.push([pl.X(t),pl.Y(i)],[pl.X(t),pl.Y(i+1)])});if(n)pts.push([pl.X(n*B6_OM_SEG),pl.Y(pr.length)]);out+=B6_poly(pts,C.ink,1.6);
  out+=TF(407,320,'block labels: electrode site, or current off',13,C.muted);
  out+=B6_note('Illustrative rates. Rats with implanted electrodes; the brief current is not painful at these sites.',366);
  const ph=!n?'Choose a site and run the first ten minutes. Each press delivers a brief pulse of current through the electrode.':
   last.on&&last.site==='septal'?`About ${fmt(B6_r1(lastRate))} presses a minute: the steep slope means the rat keeps returning to the lever. Olds and Milner wrote that the effect was stronger than any other reward they had used.`:
   last.on?'With the electrode at this site, pressing stays at the chance level of a rat exploring the box. Where the electrode sits decides everything.':
   'With the current off the rat goes on pressing for a while, then gives up: extinction, as with an ordinary reward that stops coming. Switch the current back on and pressing returns.';
  return {svg:out,phase:ph};
 }});

/* Temporal-difference learning, TD(λ), with one feature per 100-ms step after the cue (a "complete serial compound").
   A trial is 2.5 s: cue at 0.5 s, juice at 1.5 s. δ = r + γ·V(next) − V(now), γ = 0.98, α = 0.12, λ = 0.9.
   Before the cue the value is 0, because the cue comes at unpredictable times. Firing = max(0, 4 + 26·δ) spikes a second. */
const B6_TD={dt:.1,n:25,cue:5,rew:15,g:.98,a:.12,l:.9};
function B6_tdTrial(w,type){
 const {n,cue,rew,g,a,l}=B6_TD,V=t=>type!=='free'&&t>=cue&&t<n?w[t-cue]:0,d=[],e=new Array(w.length).fill(0),w2=w.slice();
 for(let t=0;t<n-1;t++){const r=(t+1===rew&&type!=='omit')?1:0,dl=r+g*V(t+1)-V(t);d.push(dl);
  for(let k=0;k<e.length;k++)e[k]*=g*l;if(type!=='free'&&t>=cue)e[t-cue]+=1;for(let k=0;k<e.length;k++)w2[k]+=a*dl*e[k]}
 // δ at index t is the error on the step into t+1; shift so that index t means "at time t"
 return {d:[0].concat(d),w:w2,type};
}
const B6_TD_W0=()=>new Array(B6_TD.n-B6_TD.cue).fill(0);
const B6_rate=dl=>Math.max(0,4+26*dl);
function B6_tdSpikes(tr,seed){const r=B6_rng(seed*911+7),out=[];tr.d.forEach((dl,t)=>{const lam=B6_rate(dl)*B6_TD.dt;let k=0,p=Math.exp(-lam),c=p,u=r();while(u>c&&k<9){k++;p*=lam/k;c+=p}for(let j=0;j<k;j++)out.push((t+r())*B6_TD.dt)});return out.sort((a,b)=>a-b)}
// The Watch run: 24 paired trials, one omission, two more paired trials, then juice without a cue.
const B6_TD_PLAN=[...new Array(24).fill('pair'),'omit','pair','pair','free'];
const B6_TD_RUN=(()=>{let w=B6_TD_W0();const log=[],ws=[w];for(const ty of B6_TD_PLAN){const tr=B6_tdTrial(w,ty);log.push(tr);w=tr.w;ws.push(w)}return {log,ws}})();
const B6_TY_LAB={pair:'cue then juice',omit:'cue, no juice',free:'juice, no cue'};
function B6_tdDraw(s,X){
 const log=s.log,n=log.length,last=log[n-1];
 let out=heading(!n?'A dopamine neuron before training':last.type==='omit'?'Juice withheld: a dip when it was due':last.type==='free'?'Juice without warning: a burst':Math.abs(last.d[B6_TD.rew])<.15?'Trained: the burst has moved to the cue':`Trial ${n}: the burst is moving to the cue`);
 const x0=86,w=330,TX=t=>x0+t/2.5*w;
 // raster of the last 14 trials, newest at the bottom
 const rows=log.slice(-14),y0=50,rh=11;out+=R(x0-4,y0,w+8,14*rh+8,'#fff',C.grid,4);
 out+=L(TX(.5),y0,TX(.5),y0+14*rh+8,C.blue,1.2,'stroke-dasharray="3 3"')+L(TX(1.5),y0,TX(1.5),y0+14*rh+8,C.green,1.2,'stroke-dasharray="3 3"');
 rows.forEach((tr,i)=>{const y=y0+6+i*rh+rh/2,idx=n-rows.length+i;for(const t of B6_tdSpikes(tr,idx+1))out+=L(TX(t),y-4,TX(t),y+4,tr.type==='omit'?C.coral:tr.type==='free'?C.purple:C.ink,1.4)});
 out+=TF(x0-8,y0+14,`trial ${Math.max(1,n-rows.length+1)}`,13,C.muted,'end')+TF(x0-8,y0+14*rh+4,n?`trial ${n}`:'',13,C.muted,'end');
 // rate of the last trial
 const py=y0+14*rh+20,ph=64,base=py+ph-14;out+=R(x0-4,py,w+8,ph,'#fff',C.grid,4);
 if(n){const pts=[];last.d.forEach((dl,t)=>{const y=base-B6_rate(dl)*1.5;pts.push([TX(t*B6_TD.dt),y],[TX((t+1)*B6_TD.dt),y])});out+=B6_poly(pts,C.coral,2)}
 out+=L(x0,base-6,x0+w,base-6,C.grid,1,'stroke-dasharray="2 3"')+TF(x0-8,base-2,'4/s',13,C.muted,'end')+TF(x0-8,py+16,'rate',13,C.muted,'end');
 out+=TF(TX(.5),py+ph+16,'cue',13,C.blue)+TF(TX(1.5),py+ph+16,'juice due',13,C.green)+TF(TX(0),py+ph+16,'0',13,C.muted)+TF(TX(2.5),py+ph+16,'2.5 s',13,C.muted);
 // published pattern (schematic, after Schultz, Dayan & Montague 1997, Fig. 1)
 const ix=436,iw=150;out+=R(ix,50,iw,232,'#fff',C.grid,8)+TBF(ix+iw/2,68,'Published pattern',13,C.ink);
 const mini=(y,lab,fn)=>{const pts=[];for(let i=0;i<=60;i++){const t=i/60*2.5;pts.push([ix+10+i/60*(iw-20),y-fn(t)])}return TF(ix+iw/2,y-34,lab,13,C.muted)+L(ix+10,y,ix+iw-10,y,C.grid,1)+B6_poly(pts,C.ink,1.6)};
 const bump=(t,c,h)=>h*Math.exp(-Math.pow((t-c)/.06,2));
 out+=mini(126,'no prediction',t=>bump(t,1.55,24))+mini(194,'reward predicted',t=>bump(t,.55,24))+mini(262,'predicted, withheld',t=>bump(t,.55,24)-(t>1.5&&t<1.75?7:0));
 out+=TF(ix+iw/2,300,'after Schultz et al. 1997',13,C.muted);
 out+=B6_tile(436,310,150,'Trials run',n?`${n} · last: ${B6_TY_LAB[last.type]}`:'0',C.ink);
 out+=B6_note('Simulated cell driven by a TD learner; the shape of the published records, not their numbers.',372);
 const dc=n?last.d[B6_TD.cue]:0,dr=n?last.d[B6_TD.rew]:0;
 const say=!n?'Run trials: a light (the cue) comes on, and one second later a drop of juice arrives. At first the juice is unexpected.':
  last.type==='omit'?`The cue still brings a burst, but when the juice fails to come the firing pauses just after the moment it was due (error ${fmt(Math.round(dr*100)/100)}). The cell signals “worse than expected”, at the right time.`:
  last.type==='free'?`Juice that no cue announced is a full surprise (error ${fmt(Math.round(dr*100)/100)}), so the cell bursts at the juice, as on the very first trials.`:
  `Trial ${n}: error at the cue ${fmt(Math.round(dc*100)/100)}, at the juice ${fmt(Math.round(dr*100)/100)}. ${Math.abs(dr)<.15?'The juice is now fully predicted, so it changes nothing; the surprise, and the burst, has moved to the cue.':'As the cue comes to predict the juice, the burst at the juice shrinks and a burst at the cue grows.'}`;
 return {svg:out,phase:say};
}
SCENE({id:'reward-dopamine-error',name:'The burst moves to the cue',tag:'Schultz, Dayan and Montague, 1997',
 definition:'Wolfram Schultz recorded single dopamine neurons in monkeys learning that a light or sound predicts a drop of juice. At first the cells burst when the juice arrived. After training they burst at the cue instead and ignored the juice; when the expected juice was withheld, they paused at the moment it was due. In 1997 Schultz, Peter Dayan and Read Montague showed that this is the error signal of temporal-difference learning: reward received minus reward predicted.',
 example:'The signal is about surprise, not reward as such: a fully predicted reward leaves the cell at its resting rate. Later work showed that driving dopamine neurons at the time of an expected reward makes rats learn as if the reward were better than expected (Steinberg and colleagues, 2013). Not every dopamine neuron behaves this way; some also respond to unpleasant or salient events.',
 desc:'A spike raster for the last fourteen trials of a simulated dopamine neuron, with the cue and juice times marked, the firing rate on the latest trial, and a schematic of the published pattern for comparison.',
 research:['Schultz, Dayan & Montague (1997). A neural substrate of prediction and reward. Science 275, 1593–1599.','Schultz, Apicella & Ljungberg (1993). Journal of Neuroscience 13, 900–913 (responses during successive steps of learning).','Steinberg and others (2013), Nature Neuroscience 16, 966–973; Matsumoto & Hikosaka (2009), Nature 459, 837–841 (two kinds of dopamine neuron).'],
 dur:16,hint:'Run paired trials until the burst sits on the cue, then withhold the juice once or give it without a cue. “Hear” plays the last trial’s spikes as soft clicks. The model and its numbers are illustrative.',
 init:()=>({log:[],w:B6_TD_W0()}),
 watch(p){const k=Math.min(B6_TD_PLAN.length,Math.floor(p*(B6_TD_PLAN.length+1)));return {log:B6_TD_RUN.log.slice(0,k),w:B6_TD_RUN.ws[k]}},
 ui:[{b:'1 paired trial',act:'trial',arg:'pair'},{b:'5 paired trials',act:'five'},{b:'Withhold the juice',act:'trial',arg:'omit'},{b:'Juice without a cue',act:'trial',arg:'free'},{b:'Hear the last trial ▶',act:'hear'}],
 on:{trial(s,v){const ty=B6_TY_LAB[v]?v:'pair',tr=B6_tdTrial(s.w,ty);s.w=tr.w;s.log.push(tr);if(s.log.length>60)s.log.shift()},
  five(s){for(let i=0;i<5;i++)SCENES['reward-dopamine-error'].on.trial(s,'pair')},
  hear(s){const n=s.log.length;if(!n)return 'keep';B6_click(B6_tdSpikes(s.log[n-1],n),.11);return 'keep'}},
 draw(s,f,X){return B6_tdDraw(s,X)},
 three(s,f,X,project){
  const log=s.log.length?s.log:B6_TD_RUN.log,N=log.length,Pr=project([0,25,0,N,0,32]);
  let faces=[];
  for(let i=0;i<N-1;i++)for(let t=0;t<24;t++){const z=(ii,tt)=>B6_rate(log[ii].d[tt]);
   const z00=z(i,t),z10=z(i,t+1),z01=z(i+1,t),z11=z(i+1,t+1),mz=(z00+z10+z01+z11)/4;
   faces.push({pts:[[t,i,z00],[t+1,i,z10],[t+1,i+1,z11],[t,i+1,z01]],fill:mz>8?C.coral:mz<2?C.blue:'#9fb7c9',opacity:mz>8?.9:.55,stroke:'#7f97a8'})}
  let out=paintFaces(faces,Pr);
  const lab=(p,t,col)=>{const q=Pr(p);return TF(q[0],q[1],t,13,col)};
  out+=lab([B6_TD.cue,-2,0],'cue',C.blue)+lab([B6_TD.rew,-2,0],'juice',C.green)+lab([26,N/2,0],'trials →',C.muted)+lab([0,-2,0],'time →',C.muted);
  return {svg:out,title:'Firing across trials and time',caption:`Height is the simulated firing rate, across time within a trial (left to right) and across ${N} trials (front to back). The ridge starts at the juice and, as training goes on, moves to the cue. A dip shows where juice was withheld.`};
 }});

// Wanting against liking. Illustrative values (relative to normal = 1), after Berridge, Venier & Robinson (1989; rats with
// dopamine depleted by 6-OHDA) and Peciña and others (2003; mice with raised dopamine, DAT knockdown).
const B6_WL={dep:['Dopamine depleted','rats, 1989',1,.08],norm:['Normal dopamine','control',1,1],high:['Dopamine raised','mice, 2003',1.05,1.7]};
function B6_wlMeasure(cond,what,i){const v=B6_WL[cond][what==='like'?2:3],r=B6_rng(i*53+cond.length*7+(what==='like'?1:2));return Math.max(0,v*(1+.12*B6_gauss(r)))}
SCENE({id:'reward-dopamine-wanting',name:'Wanting is not liking',tag:'Berridge and Robinson, 1989–2003',
 definition:'Dopamine is often called “the pleasure chemical”, a popular simplification. Kent Berridge and Terry Robinson measured pleasure in rats directly from their facial reactions to sweet taste: tongue protrusions and lip licking for sugar, gapes for bitter quinine. In 1989 rats with most of their brain dopamine destroyed would not eat by themselves, yet still showed normal liking reactions when sugar was placed in their mouths.',
 example:'In 2003 Susana Peciña, Berridge and colleagues tested mice with extra dopamine: they ran faster for sweet food but did not like it more. Berridge and Robinson concluded that dopamine gives a reward and its cues their pull, “wanting” or incentive salience, while “liking” depends on other systems, such as opioid hotspots in the nucleus accumbens. Their account of addiction builds on this.',
 desc:'Two measures for three groups of animals: liking, as the number of positive facial reactions to sugar, and wanting, as the effort spent to get it. The learner runs each test and the results are drawn beside the published pattern.',
 research:['Berridge, Venier & Robinson (1989). Taste reactivity analysis of 6-hydroxydopamine-induced aphagia: implications for arousal and anhedonia hypotheses of dopamine function. Behavioral Neuroscience 103, 36–45.','Peciña, Cagniard, Berridge, Aldridge & Zhuang (2003). Hyperdopaminergic mutant mice have higher “wanting” but not “liking” for sweet rewards. Journal of Neuroscience 23, 9395–9402.','Berridge & Robinson (1998). Brain Research Reviews 28, 309–369.'],
 dur:12,hint:'Pick a group and run both tests, liking and wanting. Each press adds one animal. Compare your bars with the published pattern. Values are illustrative.',
 init:()=>({cond:'dep',data:{dep:{like:[],want:[]},norm:{like:[],want:[]},high:{like:[],want:[]}}}),
 watch(p){const d={dep:{like:[],want:[]},norm:{like:[],want:[]},high:{like:[],want:[]}},order=['norm','dep','high'],k=Math.floor(p*13);
  for(let i=0;i<k;i++){const c=order[Math.floor(i/4)%3],w=i%2?'want':'like';d[c][w].push(B6_wlMeasure(c,w,i))}return {cond:order[Math.min(2,Math.floor(Math.max(0,k-1)/4))],data:d}},
 ui:[{choose:Object.keys(B6_WL).map(k=>[k,B6_WL[k][0]]),label:'Group',get:s=>s.cond,act:'cond'},{b:'Test liking (sugar in the mouth)',act:'test',arg:'like'},{b:'Test wanting (work for sugar)',act:'test',arg:'want'}],
 on:{cond(s,v){if(B6_WL[v])s.cond=v},test(s,v){const w=v==='want'?'want':'like',a=s.data[s.cond][w];if(a.length<8)a.push(B6_wlMeasure(s.cond,w,a.length+(w==='want'?20:0)))}},
 draw(s){
  const d=s.data,mean=a=>a.length?sum(a)/a.length:null;
  const ml=mean(d[s.cond].like),mw=mean(d[s.cond].want);
  let out=heading(ml!==null&&mw!==null&&s.cond!=='norm'?(s.cond==='dep'?'No wanting, but liking intact':'More wanting, no more liking'):`${B6_WL[s.cond][0]}: run both tests`);
  const pl=B6_plot(70,60,340,220,[0,3],[0,2],{yt:[[0,'0'],[1,'normal'],[2,'×2']],yl:'relative to normal animals'});out+=pl.svg;
  Object.keys(B6_WL).forEach((c,ci)=>{const xc=pl.X(ci+.5);
   [['like',C.amber,-34],['want',C.purple,4]].forEach(([wk,col,dx])=>{const m=mean(d[c][wk]),pub=B6_WL[c][wk==='like'?2:3];
    out+=R(xc+dx,pl.Y(pub),30,pl.Y(0)-pl.Y(pub),'none',C.line,2,'stroke-dasharray="4 3"');
    if(m!==null)out+=R(xc+dx+3,pl.Y(Math.min(2,m)),24,pl.Y(0)-pl.Y(Math.min(2,m)),col,'none',2);
    d[c][wk].forEach((v,j)=>out+=Ci(xc+dx+15+(j%2?4:-4),pl.Y(Math.min(2,v)),2.6,'#fff',C.ink))});
   out+=TF(xc,300,B6_WL[c][0],13,c===s.cond?C.ink:C.muted,'middle',c===s.cond?'font-weight="700"':'')+TF(xc,316,B6_WL[c][1],13,C.muted)});
  out+=R(430,70,12,12,C.amber,'none',2)+TF(448,81,'liking: reactions',13,C.ink,'start')+TF(448,97,'to sugar',13,C.ink,'start');
  out+=R(430,112,12,12,C.purple,'none',2)+TF(448,123,'wanting: effort',13,C.ink,'start')+TF(448,139,'to get sugar',13,C.ink,'start');
  out+=R(430,154,12,12,'none',C.line,2,'stroke-dasharray="3 2"')+TF(448,165,'published pattern',13,C.ink,'start');
  out+=B6_tile(430,190,156,'Animals tested',`${d[s.cond].like.length} liking · ${d[s.cond].want.length} wanting`,C.ink);
  out+=TF(508,262,'Liking: tongue and',13,C.muted)+TF(508,278,'lip reactions to taste.',13,C.muted);
  out+=B6_note('Illustrative values. Depletion was studied in rats, raised dopamine in mice.',350)+B6_note('Dots: single animals (simulated). Bars: their mean.',368);
  const ph=s.cond==='dep'?(ml!==null&&mw!==null?`With dopamine depleted, these rats would not work for sugar (${fmt(Math.round(mw*100)/100)} of normal), yet their faces still showed liking (${fmt(Math.round(ml*100)/100)} of normal). Pleasure survived the loss of dopamine; the drive to seek it did not.`:'Rats whose dopamine pathways were destroyed with a toxin, 6-OHDA. They stop eating on their own. Do they stop liking sweet taste?'):
   s.cond==='high'?(ml!==null&&mw!==null?`Mice with extra dopamine worked harder for sweet food (${fmt(Math.round(mw*100)/100)} of normal) but their liking reactions stayed about normal (${fmt(Math.round(ml*100)/100)}). More dopamine, more wanting, not more liking.`:'Mutant mice whose dopamine stays longer at the synapse. Will they like sugar more, want it more, or both?'):
   'Normal animals set the scale: both measures are drawn as 1. Test them, then compare the other two groups.';
  return {svg:out,phase:ph};
 }});

/* ---- end of file ---- */
