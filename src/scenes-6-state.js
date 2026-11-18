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
  out+=R(106,96,12,130,C.pale,'none',4)+TF(124,116,'3rd ventricle',13,C.muted,'start');
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
  const ly=y0+rows.length*rh+38;
  [['own SCN',C.coral],['none',C.muted],['normal graft',C.green],['tau graft',C.purple]].forEach(([t,c],i)=>{const lx=x0-16+i*80;out+=R(lx,ly,6,14,c,'none',2)+TF(lx+11,ly+12,t,13,C.ink,'start')});
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
  out+=R(54,150,84,16,on?C.green:C.muted,'none',4)+TF(96,140,on?'period gene: on':'period gene: off',13,on?C.green:C.muted);
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
 if(s.dim)return f.k===0?'In dim light all day there is no strong cue. The clock free-runs on its own period, about 24.2 hours in Czeisler’s volunteers.':`Day ${f.k}: the body’s night now falls ${B6_hrs(d)} later than at the start: 0.2 hours a day adds up to about 1.4 hours a week.`;
 if(s.shift===0)return 'No shift: the body’s night and the local night coincide, and morning light each day trims the clock’s slight tendency to run late.';
 if(f.k===0)return `After flying ${Math.abs(s.shift)} time zone${Math.abs(s.shift)===1?'':'s'} ${dir}, the body’s night sits ${B6_hrs(s.shift)} ${s.shift>0?'later':'earlier'} than the local night.`;
 if(Math.abs(d)<.01){const n=fr.findIndex(q=>Math.abs(q.d)<.01);return `Back in step after ${n} days. ${s.shift>0?'Going east the clock must advance, which it does more slowly':'Going west the clock must delay, which it does more readily'}: about ${B6_hrs(s.shift>0?B6_ADV:B6_DEL)} a day in this rule of thumb.`}
 return `Day ${f.k}: light at the new local times ${s.shift>0?'advances':'delays'} the clock. The body’s night is still ${B6_hrs(d)} ${d>0?'late':'early'}.`;
}
SCENE({id:'circadian-clock-light',name:'Light resets the clock',tag:'A 24.2-hour human clock, Czeisler 1999',
 definition:'The human clock does not run at exactly 24 hours. In 1999 Charles Czeisler’s group kept volunteers on a 28-hour day in dim light, so that the clock could not follow, and measured an average period of 24.18 hours. Each day, light reaching the eye nudges the clock back into step with the sun. This daily correction is called entrainment.',
 example:'The same light has opposite effects at different body-clock times. Light in the evening and early night delays the clock; light late at night and in the early morning advances it. Khalsa and colleagues mapped this phase response curve in 2003. After a long flight east the clock must advance, which is usually slower than delaying after a flight west. Light reaches the clock through a few retinal cells containing melanopsin, not the rods and cones of vision (Senses In Motion covers those).',
 desc:'Rows of days after a flight: a grey bar marks the local night and a purple bar the body clock’s night, which slides back into line day by day. An inset shows the shape of the human phase response curve to light.',
 research:['Czeisler, Duffy, Shanahan and others (1999). Stability, precision, and near-24-hour period of the human circadian pacemaker. Science 284, 2177–2181.','Khalsa, Jewett, Cajochen & Czeisler (2003). A phase response curve to single bright light pulses in human subjects. Journal of Physiology 549, 945–952.','Berson, Dunn & Takao (2002). Science 295: the retinal cells that set the clock.','Waterhouse, Reilly, Atkinson & Edwards (2007). Jet lag: trends and coping strategies. Lancet 369, 1117–1129 (rough rates of re-entrainment).'],
 dur:13,hint:'Set a time-zone shift (east is positive) and step through the days, or choose dim light to see the clock free-run. The daily rates are a rough rule of thumb, not a prediction for any person.',
 init:()=>({shift:6,dim:0}),
 trace:s=>B6_lightDays(s),
 ui:[{range:'shift',label:'Time zones crossed (east +)',min:-8,max:8,step:1,get:s=>s.shift,act:'shift',show:v=>(v>0?'+':'')+v+' h'},{choose:[[0,'Daylight at new times'],[1,'Dim light, no cue']],label:'Light',get:s=>s.dim,act:'dim'}],
 on:{shift(s,v){s.shift=clamp(Math.round(+v),-8,8)},dim(s,v){s.dim=+v?1:0}},
 draw(s,f,X){
  const fr=B6_lightDays(s),k=f?f.k:0,x0=86,w=330,y0=48,rh=18,TX=h=>x0+B6_mod(h)/24*w;
  let out=heading(s.dim?'Without a cue the clock drifts later':s.shift===0?'No shift: already in step':Math.abs(fr[k].d)<.01?'Back in step':`${Math.abs(s.shift)} hours ${s.shift>0?'east':'west'}: the clock catches up`);
  out+=R(x0-4,y0,w+8,13*rh+6,'#fff',C.grid,4);
  const bar=(a,b,y,h,col,op)=>{let o='';const A=B6_mod(a),B=A+(b-a);if(B<=24)o+=R(TX(A),y,(B-A)/24*w,h,col,'none',2,op);else{o+=R(TX(A),y,(24-A)/24*w,h,col,'none',2,op)+R(x0,y,(B-24)/24*w,h,col,'none',2,op)}return o};
  for(let r=0;r<=12;r++){const y=y0+4+r*rh,q=fr[r],show=r<=k;
   out+=TF(x0-10,y+12,r===0?'arrive':'day '+r,13,r===k?C.ink:C.muted,'end');
   out+=bar(23,31,y+1,7,C.line,'');
   if(show)out+=bar(23+q.d,31+q.d,y+9,7,C.purple,r===k?'':'opacity=".55"')}
  out+=B6_hourAxis(x0,w,y0+13*rh+18);
  out+=R(x0,y0+13*rh+40,12,10,C.line,'none',2)+TF(x0+18,y0+13*rh+50,'local night',13,C.ink,'start')+R(x0+120,y0+13*rh+40,12,10,C.purple,'none',2)+TF(x0+138,y0+13*rh+50,'body clock’s night',13,C.ink,'start');
  // PRC inset (shape only)
  const ix=440,iy=56,iw=146,ih=110;out+=R(ix,iy,iw,ih+48,'#fff',C.grid,8)+TBF(ix+iw/2,iy+18,'Phase response',13,C.ink);
  const Y0=iy+30+ih*.55,prc=x=>x>=-8&&x<0?-2.2*Math.sin(Math.PI*(x+8)/8):x>=0&&x<8?1.4*Math.sin(Math.PI*x/8):0;
  const pts=[];for(let i=0;i<=60;i++){const x=-12+i*.4;pts.push([ix+8+i/60*(iw-16),Y0-prc(x)*16])}
  out+=L(ix+8,Y0,ix+iw-8,Y0,C.grid,1)+L(ix+iw/2,iy+30,ix+iw/2,iy+ih+10,C.grid,1,'stroke-dasharray="3 3"')+B6_poly(pts,C.amber,2.2);
  out+=TF(ix+8,Y0-8,'delays',13,C.coral,'start')+TF(ix+iw-34,iy+44,'advances',13,C.green)+TF(ix+iw/2,iy+ih+44,'body-clock time →',13,C.muted);
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
  else if(st==='N2'){e=11*Math.sin(2*Math.PI*5.5*t+ph[0])+7*Math.sin(2*Math.PI*3.2*t+ph[1])+6*lp;for(const [a,d] of sp)e+=45*hann(t,a,d)*Math.sin(2*Math.PI*13*t+ph[2]);
   const u=t-kc;if(u>0&&u<.9)e+=u<.3?-115*Math.sin(Math.PI*u/.3):60*Math.sin(Math.PI*(u-.3)/.6);o=4*lp;m=4*g()}
  else if(st==='N3'){e=70*Math.sin(2*Math.PI*1.05*t+ph[0])+28*Math.sin(2*Math.PI*.7*t+ph[1])+10*Math.sin(2*Math.PI*5*t+ph[2])+8*lp;o=.25*e+3*lp;m=3*g()}
  else{e=13*Math.sin(2*Math.PI*5*t+ph[0])+7*Math.sin(2*Math.PI*8*t+ph[1])+8*lp+(t>2.2&&t<3.4?22*((2.5*t)%1-.5):0);
   for(const [j,a] of rem.entries()){const u=t-a;if(u>0)o+=(j%2?-1:1)*70*(u<.08?u/.08:Math.exp(-(u-.08)/.35))}o+=3*lp;m=1.2*g()+(t>5.5&&t<5.62?7*g():0)}
  eeg.push(e);eog.push(o);emg.push(m)}
 for(const [a,d] of sp)marks.push(['spindle',a+d/2]);if(st==='N2')marks.push(['K-complex',kc+.2]);if(st==='R')marks.push(['rapid eye movements',2]);
 return B6_TR_CACHE[key]={eeg,eog,emg,marks};
}
// Draw the three channels between x0 and x0+w. Upward is negative at the electrode by EEG convention; we simply draw the signal.
function B6_polygraph(tr,x0,w,ys,opts={}){
 let out='';const n=tr.eeg.length,sx=w/(n-1),ch=[['EEG',tr.eeg,.3,C.ink],['Eyes',tr.eog,.3,C.blue],['Chin muscle',tr.emg,.6,C.green]];
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
  out+=L(98,52,98,82,C.ink,2)+TF(92,72,'100 µV',13,C.ink,'end');
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
  let out=heading(done?`${watch?'The scorer':'You'} agreed with the key on ${right} of 10 epochs`:`${watch?'A simulated scorer: e':'E'}poch ${i+1} of 10`);
  out+=R(B6_POLY_X-4,46,B6_POLY_W+8,178,'#fff',C.grid,6)+B6_polygraph(tr,B6_POLY_X,B6_POLY_W,[86,152,200]);
  out+=TF(B6_POLY_X+B6_POLY_W,240,'8 s shown of the 30-s epoch',13,C.muted,'end');
  if(i>0&&!done){const a=s.ans[i-1],k=B6_EPOCHS[i-1];out+=TF(B6_POLY_X,240,`Epoch ${i}: ${watch?'the scorer':'you'} said ${a}, the key says ${k}`,13,a===k?C.green:C.coral,'start')}
  // mini hypnogram of scored epochs
  const hx=20,hy=258,lev={W:0,R:1,N1:2,N2:3,N3:4};out+=R(hx,hy,236,96,'#fff',C.grid,6);
  ['W','R','N1','N2','N3'].forEach((v,j)=>out+=TF(hx+24,hy+18+j*17,v,13,C.muted,'end'));
  s.ans.forEach((a,j)=>{const x=hx+32+j*20,yk=hy+14+lev[B6_EPOCHS[j]]*17,ya=hy+14+lev[a]*17;out+=R(x,yk-3,16,6,C.line,'none',1)+R(x+2,ya-4,12,8,a===B6_EPOCHS[j]?C.green:C.coral,'none',2)});
  // key
  const key=[['W','alpha, eyes, tone'],['N1','theta, slow eye roll'],['N2','spindles, K-complex'],['N3','big slow waves'],['R','eyes dart, no tone']];
  key.forEach(([k,t],j)=>{out+=TBF(272,276+j*17,k,13,B6_STAGE_COL[k],'start')+TF(300,276+j*17,t,13,C.ink,'start')});
  const pct=i?Math.round(100*right/i):0;
  out+=B6_tile(452,256,132,watch?'Scorer agrees':'Your agreement',i?pct+'%':'—',i&&pct>=83?C.green:C.coral)+B6_tile(452,308,132,'Trained scorers','about 83%',C.ink);
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
  const M=B6_pressure(s.extra),pl=B6_plot(110,60,470,180,[0,84],[0,1],{xt:[0,12,24,36,48,60,72,84].map(t=>[t,B6_hh(7+t)]),yt:[[.5,'0.5'],[1,'1']],yl:'sleep pressure, S'});
  const rec0=M.bouts.find(b=>b[0]>=40-.01);
  let out=heading(!s.extra?'Baseline: pressure meets the clock each night':`${s.extra} extra hours awake: recovery sleep ${fmt(B6_r1(rec0?rec0[1]-rec0[0]:0))} h`)+pl.svg;
  // night shading by clock (23:00–07:00)
  for(const a of [16,40,64])out+=R(pl.X(a),61,pl.X(a+8)-pl.X(a),178,'#eef2f6','none',0);
  const ps=[],ph=[],pL=[];M.pts.forEach((q,i)=>{if(i%4)return;ps.push([pl.X(q[0]),pl.Y(q[1])]);ph.push([pl.X(q[0]),pl.Y(q[2])]);pL.push([pl.X(q[0]),pl.Y(q[3])])});
  out+=B6_poly(ph,C.amber,1.8,'stroke-dasharray="6 4"')+B6_poly(pL,C.amber,1.8,'stroke-dasharray="6 4"')+B6_poly(ps,C.purple,2.6);
  out+=TF(pl.X(3),pl.Y(.8)-4,'upper threshold',13,C.amber,'start')+TF(pl.X(3),pl.Y(.26)-4,'lower threshold',13,C.amber,'start');
  M.bouts.forEach(([a,b])=>out+=R(pl.X(a),266,pl.X(b)-pl.X(a),12,C.purple,'none',3));
  if(s.extra)out+=R(pl.X(40),283,pl.X(40+s.extra)-pl.X(40),8,C.coral,'none',2);
  out+=TF(102,277,'asleep',13,C.purple,'end')+(s.extra?TF(102,292,'kept up',13,C.coral,'end'):'');
  const rec=M.bouts.find(b=>b[0]>=40-.01)||M.bouts[M.bouts.length-1],base=M.bouts[0],len=rec?rec[1]-rec[0]:0,blen=base[1]-base[0];
  const wake=rec?rec[0]-M.bouts[0][1]:0,ix=Math.round(rec[0]/.05),Sb=M.pts[Math.min(M.pts.length-1,ix)][1];
  out+=B6_tile(60,304,160,'Awake before it',fmt(B6_r1(wake))+' h',C.coral)+B6_tile(232,304,160,'Recovery sleep',fmt(B6_r1(len))+' h',C.purple)+B6_tile(404,304,176,'Baseline sleep',`${B6_hh(7+base[0])}–${B6_hh(7+base[1])}`,C.ink);
  out+=B6_note('Model sleeper. Time constants 18.2 h rising, 4.2 h falling (Daan et al. 1984).',368);
  const phase=!s.extra?`Baseline: pressure rises for 16 hours, meets the upper threshold at ${B6_hh(7+base[0])} and drains to the lower one by ${B6_hh(7+base[1])}. The pattern repeats each day.`:
   `Kept up ${s.extra} extra hours, the sleeper has been awake ${fmt(B6_r1(wake))} hours and pressure reaches ${fmt(Math.round(Sb*100)/100)}. Sleep starts at ${B6_hh(7+rec[0])} and lasts ${fmt(B6_r1(len))} hours, ${len<blen-.3?`shorter than the baseline ${fmt(B6_r1(blen))} hours: the lower threshold, rising with the clock through the morning, ends it early.${B6_mod(7+rec[0])>=3&&B6_mod(7+rec[0])<=12?' Daan, Beersma and Borbély predicted short sleep when bedtime falls in the morning.':''}`:len<=blen+1.5?`close to the baseline ${fmt(B6_r1(blen))} hours: the clock ends it at about the usual morning time, so the debt is paid off mainly by deeper sleep, not by longer sleep.`:`longer than the baseline ${fmt(B6_r1(blen))} hours: it starts while the lower threshold is still falling towards its night-time low, so pressure has hours to drain.`}`;
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
 definition:'In the 1930s Frédéric Bremer cut through the brainstem of cats. Cut through the midbrain, the forebrain persistently showed a sleeping EEG; cut lower, below the medulla, it still slept and woke. He thought sleep followed the loss of sensory input. In 1949 Giuseppe Moruzzi and Horace Magoun stimulated the reticular formation, the net-like core of the brainstem, in cats under anaesthesia: the slow, large EEG waves gave way at once to the small, fast pattern of waking.',
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
  out+=TF(330,148,coreDead?'core destroyed':'reticular core',13,coreDead?C.muted:C.purple);
  const lem=s.proc==='lemn';out+=P('M560 198L470 196L360 188C320 180 290 168 250 146',lem?C.muted:C.green,2.4,'none',lem?'stroke-dasharray="6 5"':'')+TF(244,198,lem?'sensory paths cut':'sensory paths',13,lem?C.muted:C.green,'end');
  if(s.proc==='cerveau')out+=L(318,128,300,206,C.coral,4)+TF(296,124,'cut',13,C.coral,'end');
  if(s.proc==='encephale')out+=L(548,166,540,214,C.coral,4)+TF(556,160,'cut',13,C.coral);
  if(s.proc==='stim')out+=L(390,100,392,176,C.ink,3)+Ci(392,178,5,C.amber)+TF(398,98,'stimulating electrode',13,C.ink,'start');
  out+=L(120,50,120,64,C.ink,2.5)+Ci(120,64,3,C.ink);
  // EEG
  out+=R(14,240,572,104,'#fff',C.grid,8);
  const before=s.proc==='stim'?'sleep':s.proc==='cerveau'||s.proc==='core'?'wake':'wake';
  out+=TBF(30,260,'EEG from the cortex: before',13,C.ink,'start')+B6_eegStrip(before,30,250,298,3,.62);
  out+=TBF(320,260,s.proc==='stim'?'During stimulation':'After',13,C.ink,'start');
  if(s.rec){if(res==='cycle'){out+=B6_eegStrip('sleep',320,120,298,5,.62)+B6_eegStrip('wake',446,124,298,6,.62)+TF(380,338,'sleeps',13,C.purple)+TF(508,338,'wakes',13,C.amber)}
   else out+=B6_eegStrip(res==='wake'?'wake':'sleep',320,250,298,7,.62)}
  else out+=TF(445,304,'press Record',13,C.muted);
  out+=TF(155,338,before==='sleep'?'large slow waves (asleep or anaesthetised)':'small fast waves (awake)',13,C.muted);
  out+=B6_note('Schematic traces. Cats, under anaesthesia or after the cuts described; no picture of the animals.',368);
  const ph=!s.rec?{cerveau:'Bremer, 1935: a cut through the midbrain leaves the forebrain connected to smell and sight only. What will its EEG show?',encephale:'Bremer’s second cut, below the medulla, separates the brain from the spinal cord but leaves the whole brainstem attached.',stim:'Moruzzi and Magoun place an electrode in the reticular formation of an anaesthetised cat, whose EEG shows large slow waves.',core:'Lindsley, Bowden and Magoun destroy the central core of the brainstem and leave the sensory pathways that run beside it.',lemn:'The control: cut the sensory pathways and spare the reticular core.'}[s.proc]:
   {cerveau:'The forebrain sits in a permanent sleep-like state, with large slow waves. Bremer read this as a loss of the stream of sensory input. The later experiments show a second reading: the cut also removes the brainstem’s activating core.',encephale:'With the whole brainstem attached the brain still alternates between sleeping and waking patterns. Whatever keeps the brain awake lies between the two cut levels.',stim:'Within seconds the large slow waves vanish and the small fast waves of an alert brain appear, without any sensory stimulus. The brainstem core can wake the cortex by itself.',core:'With the core destroyed the EEG stays slow and sleep-like, even though sensory signals can still reach the cortex. Input alone does not keep the brain awake.',lemn:'With the sensory pathways cut but the core intact, the EEG still shows waking and arousal. Together with the core lesions this pointed to an ascending activating system.'}[s.proc];
  return {svg:out,phase:ph};
 }});

// Arousal cell groups. Relative firing (1 = highest) in waking, non-REM and REM sleep: an illustrative summary of recordings
// in rats, cats and mice (LC: Aston-Jones & Bloom 1981; raphe: Trulson & Jacobs 1979; VLPO: Sherin et al. 1996;
// orexin: Lee, Hassani & Jones 2005; Mileykovskiy, Kiyashchenko & Siegel 2005).
const B6_NUC=[
 {id:'lc',name:'Locus coeruleus',ab:'LC',tx:'noradrenaline',at:[276,184],ly:-14,f:[1,.4,.03]},
 {id:'raphe',name:'Raphe nuclei',ab:'raphe',tx:'serotonin',at:[252,200],ly:20,f:[1,.5,.05]},
 {id:'tmn',name:'Tuberomammillary nucleus',ab:'TMN',tx:'histamine',at:[180,194],ly:24,f:[1,.2,.03]},
 {id:'ppt',name:'Pons (PPT/LDT)',ab:'PPT',tx:'acetylcholine',at:[232,176],ly:-14,f:[.9,.2,1]},
 {id:'bf',name:'Basal forebrain',ab:'BF',tx:'acetylcholine',at:[106,170],ly:-14,f:[1,.3,.9]},
 {id:'orx',name:'Lateral hypothalamus',ab:'LH',tx:'orexin',at:[160,170],ly:-14,f:[1,.1,.1]},
 {id:'vlpo',name:'VLPO (sleep-active)',ab:'VLPO',tx:'GABA, galanin',at:[130,192],ly:24,f:[.15,1,.8]}];
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
  // map (side view, schematic)
  out+=R(14,46,300,196,'#fff',C.grid,8);
  out+=P('M30 140C30 86 92 58 168 60C226 62 262 88 268 120C254 136 222 144 196 140C164 152 96 156 60 154C40 152 30 148 30 140Z',C.line,2,'#f4f8fb')+TF(120,96,'cortex',13,C.muted);
  out+=`<ellipse cx="146" cy="184" rx="58" ry="20" fill="#f4f8fb" stroke="${C.line}" stroke-width="2"/>`+P('M206 150L300 188L296 228L204 186Z',C.line,2,'#f4f8fb');
  out+=TF(72,222,'hypothalamus',13,C.muted)+TF(290,240,'brainstem',13,C.muted,'end');
  for(const n of B6_NUC){const on=n.id===nu.id,col=n.id==='vlpo'?C.green:C.coral,rr=3+6*n.f[si];
   out+=hit(X,'pick',n.id,`${n.name}, ${n.tx}`,Ci(n.at[0],n.at[1],12,'rgba(255,255,255,.01)','none')+Ci(n.at[0],n.at[1],rr,col,on?C.ink:'#fff'))+TF(n.at[0],n.at[1]+n.ly,n.ab,13,on?C.ink:C.muted,'middle',on?'font-weight="700"':'')}
  // bars
  out+=TBF(330,58,'Relative firing now',13,C.ink,'start');
  B6_NUC.forEach((n,i)=>{const y=70+i*24,on=n.id===nu.id,col=n.id==='vlpo'?C.green:C.coral;
   out+=TF(476,y+14,n.ab+' · '+n.tx.split(',')[0],13,on?C.ink:C.muted,'end',on?'font-weight="700"':'')+R(482,y+3,96,14,'#f1f4f7','none',3)+R(482,y+3,96*n.f[si],14,col,'none',3)});
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
  const strip=(d,y,lab)=>{let o=TF(x0-8,y+15,lab,13,C.ink,'end');for(const [a,b,st] of d.bouts)o+=R(TX(a),y,Math.max(2,TX(b)-TX(a)),22,st?C.amber:C.purple,'none',0);return o};
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
  out+=B6_note('Toy model, one step a minute. In narcolepsy about 90% of these cells are lost.',370);
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
  for(let m=0;m<B6_OM_SEG;m+=.05){rate+=(target-rate)*(g.on?.08:.012);if(r()<rate*.05)out.push(t+m)}t+=B6_OM_SEG});
 return out}
const B6_omInit=()=>({site:'septal',on:1,segs:[]});
SCENE({id:'reward-dopamine',name:'Rats that press for brain stimulation',tag:'Olds and Milner, 1954',
 definition:'In 1954 James Olds and Peter Milner, at McGill University, implanted fine electrodes in rats’ brains and let each rat deliver a brief current to its own brain by pressing a lever. With the electrode tip near the septal area the rats pressed again and again; at other sites they pressed no more than by chance. This is brain self-stimulation. The same year Delgado, Roberts and Miller found sites in cats whose stimulation the animals learned to escape.',
 example:'When the current was switched off, pressing died away, as with food reward in an ordinary training box. Olds spoke of “pleasure centres”, but the experiment shows only that the rats worked for the stimulation, not what they felt. Later work tied much of the effect to the brain’s dopamine pathways.',
 desc:'A cumulative record: a line that steps up each time the rat presses the lever, so that its slope is the rate of pressing. Each block of ten minutes can use a different electrode site, with the current on or off.',
 research:['Olds & Milner (1954). Positive reinforcement produced by electrical stimulation of septal area and other regions of rat brain. Journal of Comparative and Physiological Psychology 47, 419–427.','Delgado, Roberts & Miller (1954). Learning motivated by electrical stimulation of the brain. American Journal of Physiology 179, 587–593 (sites that cats learned to avoid).','Wise (1978). Catecholamine theories of reward: a critical review. Brain Research 152, 215–247.'],
 dur:12,hint:'Choose an electrode site and whether the current is on, then run the session ten minutes at a time. The slope of the record is the rate of pressing. “Hear” plays the last minute’s presses six times faster. Rates are illustrative.',
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
  out+=P('M60 72C60 60 80 56 100 62',C.amber,2)+TF(104,66,'cable',13,C.amber,'start')+TF(93,150,'training box',13,C.muted);
  out+=B6_tile(18,184,150,'Presses so far',String(pr.length),C.coral);
  const lastRate=n?pr.filter(t=>t>=(n-1)*B6_OM_SEG).length/B6_OM_SEG:0;
  out+=B6_tile(18,238,150,'Last 10 minutes',n?fmt(B6_r1(lastRate))+' a minute':'—',C.ink);
  // cumulative record
  const pl=B6_plot(232,56,350,220,[0,60],[0,Math.max(100,Math.ceil(pr.length/100)*100)],{xt:[0,10,20,30,40,50,60].map(v=>[v,String(v)]),yt:[[0,'0'],[Math.max(100,Math.ceil(pr.length/100)*100),String(Math.max(100,Math.ceil(pr.length/100)*100))]],xl:'minutes',yl:'total presses'});out+=pl.svg;
  s.segs.forEach((g,i)=>{const x=pl.X(i*B6_OM_SEG);out+=R(x,57,pl.X(B6_OM_SEG)-pl.X(0),15,g.on?(g.site==='septal'?C.coralp:C.pale):'#eceff2','none',0)+TF(x+29,69,g.on?(g.site==='septal'?'septal':'no effect'):'off',13,g.on?(g.site==='septal'?C.coral:C.blue):C.muted)});
  const pts=[[pl.X(0),pl.Y(0)]];pr.forEach((t,i)=>{pts.push([pl.X(t),pl.Y(i)],[pl.X(t),pl.Y(i+1)])});if(n)pts.push([pl.X(n*B6_OM_SEG),pl.Y(pr.length)]);out+=B6_poly(pts,C.ink,1.6);
  out+=B6_note('Illustrative rates. Rats with implanted electrodes, pressing a lever in a training box.',366);
  const ph=!n?'Choose a site and run the first ten minutes. Each press delivers a brief pulse of current through the electrode.':
   last.on&&last.site==='septal'?`About ${fmt(B6_r1(lastRate))} presses a minute: the steep slope means the rat keeps returning to the lever. Olds and Milner wrote that the control it gave over behaviour was extreme, possibly beyond any reward used before in animal experiments.`:
   last.on?'With the electrode at this site, pressing stays at the chance level of a rat exploring the box. Where the electrode sits decides everything.':
   'With the current off the rat goes on pressing for a while, then gives up: extinction, as with an ordinary reward that stops coming. Switch the current back on and pressing returns.';
  return {svg:out,phase:ph};
 }});

/* Temporal-difference learning, TD(λ), with one feature per 100-ms step after the cue (a "complete serial compound").
   A trial is 2.5 s: cue at 0.5 s, juice at 1.5 s. δ = r + γ·V(next) − V(now), γ = 0.98, α = 0.12, λ = 0.9.
   Before the cue the value is 0, because the cue comes at unpredictable times. Firing in each 100-ms bin =
   max(0, 3 + 40·(δ now + 0.6·δ in the previous bin)) spikes a second, so each response lasts about 200 ms. */
const B6_TD={dt:.1,n:25,cue:5,rew:15,g:.98,a:.12,l:.9};
function B6_tdTrial(w,type){
 const {n,cue,rew,g,a,l}=B6_TD,V=t=>type!=='free'&&t>=cue&&t<n?w[t-cue]:0,d=[],e=new Array(w.length).fill(0),w2=w.slice();
 for(let t=0;t<n-1;t++){const r=(t+1===rew&&type!=='omit')?1:0,dl=r+g*V(t+1)-V(t);d.push(dl);
  for(let k=0;k<e.length;k++)e[k]*=g*l;if(type!=='free'&&t>=cue)e[t-cue]+=1;for(let k=0;k<e.length;k++)w2[k]+=a*dl*e[k]}
 // δ at index t is the error on the step into t+1; shift so that index t means "at time t"
 return {d:[0].concat(d),w:w2,type};
}
const B6_TD_W0=()=>new Array(B6_TD.n-B6_TD.cue).fill(0);
const B6_rateAt=(tr,t)=>Math.max(0,3+40*((tr.d[t]||0)+.6*(tr.d[t-1]||0)));
const B6_num=v=>{const r=Math.round(v*100)/100;return (r<0?'−':'')+fmt(Math.abs(r))};
function B6_tdSpikes(tr,seed){const r=B6_rng(seed*911+7),out=[];tr.d.forEach((dl,t)=>{const lam=B6_rateAt(tr,t)*B6_TD.dt;let k=0,p=Math.exp(-lam),c=p,u=r();while(u>c&&k<9){k++;p*=lam/k;c+=p}for(let j=0;j<k;j++)out.push((t+r())*B6_TD.dt)});return out.sort((a,b)=>a-b)}
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
 if(n){const pts=[];last.d.forEach((dl,t)=>{const y=base-B6_rateAt(last,t)*1.1;pts.push([TX(t*B6_TD.dt),y],[TX((t+1)*B6_TD.dt),y])});out+=B6_poly(pts,C.coral,2)}
 out+=L(x0,base-3.3,x0+w,base-3.3,C.grid,1,'stroke-dasharray="2 3"')+TF(x0-8,base-2,'3/s',13,C.muted,'end')+TF(x0-8,py+16,'rate',13,C.muted,'end');
 out+=TF(TX(.5),py+ph+16,'cue',13,C.blue)+TF(TX(1.5),py+ph+16,'juice due',13,C.green)+TF(TX(0),py+ph+16,'0',13,C.muted)+TF(TX(2.5),py+ph+16,'2.5 s',13,C.muted);
 // published pattern (schematic, after Schultz, Dayan & Montague 1997, Fig. 1)
 const ix=436,iw=150;out+=R(ix,50,iw,232,'#fff',C.grid,8)+TBF(ix+iw/2,68,'Published pattern',13,C.ink);
 const mini=(y,lab,fn)=>{const pts=[];for(let i=0;i<=60;i++){const t=i/60*2.5;pts.push([ix+10+i/60*(iw-20),y-fn(t)])}return TF(ix+iw/2,y-34,lab,13,C.muted)+L(ix+10,y,ix+iw-10,y,C.grid,1)+B6_poly(pts,C.ink,1.6)};
 const bump=(t,c,h)=>h*Math.exp(-Math.pow((t-c)/.06,2));
 out+=mini(126,'no prediction',t=>bump(t,1.55,24))+mini(194,'reward predicted',t=>bump(t,.55,24))+mini(262,'predicted, withheld',t=>bump(t,.55,24)-(t>1.5&&t<1.75?7:0));
 out+=TF(ix+iw/2,300,'Schultz et al. 1997',13,C.muted);
 out+=B6_tile(436,310,150,'Trials run',String(n),C.ink);
 out+=B6_note('Simulated cell driven by a TD learner; the shape of the published records, not their numbers.',372);
 const dc=n?last.d[B6_TD.cue]:0,dr=n?last.d[B6_TD.rew]:0;
 const say=!n?'Run trials: a light (the cue) comes on, and one second later a drop of juice arrives. At first the juice is unexpected.':
  last.type==='omit'?`The cue still brings a burst, but when the juice fails to come the firing pauses at the moment it was due (error ${B6_num(dr)}). The cell signals “worse than expected”, at the right time.`:
  last.type==='free'?`Juice that no cue announced is a full surprise (error ${B6_num(dr)}), so the cell bursts at the juice, as on the very first trials.`:
  `Trial ${n} (${B6_TY_LAB[last.type]}): error at the cue ${B6_num(dc)}, at the juice ${B6_num(dr)}. ${Math.abs(dr)<.15?'The juice is now fully predicted, so it changes nothing; the surprise, and the burst, has moved to the cue.':'As the cue comes to predict the juice, the burst at the juice shrinks and a burst at the cue grows.'}`;
 return {svg:out,phase:say};
}
SCENE({id:'reward-dopamine-error',name:'The burst moves to the cue',tag:'Schultz, Dayan and Montague, 1997',
 definition:'Wolfram Schultz recorded single dopamine neurons in monkeys learning that a light or sound predicts a drop of juice. At first the cells burst when the juice arrived. After training they burst at the cue instead and ignored the juice; when the expected juice was withheld, they paused at the moment it was due. In 1997 Schultz, Peter Dayan and Read Montague showed that this is the error signal of temporal-difference learning: reward received minus reward predicted.',
 example:'The signal is about surprise, not reward as such: a fully predicted reward leaves the cell at its resting rate. Later work showed that driving dopamine neurons at the time of an expected reward makes rats learn as if the reward were better than expected (Steinberg and colleagues, 2013). Not every dopamine neuron behaves this way; some also respond to unpleasant or salient events. Mind In Motion’s prediction-error lesson builds the learning rule from the start.',
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
  const log=s.log.length?s.log:B6_TD_RUN.log,N=Math.max(2,log.length),Pr=project([0,3,0,3,0,1.5]);
  const X3=t=>t/24*3,Y3=i=>i/(N-1)*3,Z3=v=>v/45*1.5;
  let faces=[];
  for(let i=0;i<log.length-1;i++)for(let t=0;t<24;t++){const z=(ii,tt)=>B6_rateAt(log[ii],tt);
   const z00=z(i,t),z10=z(i,t+1),z01=z(i+1,t),z11=z(i+1,t+1),mz=(z00+z10+z01+z11)/4;
   faces.push({pts:[[X3(t),Y3(i),Z3(z00)],[X3(t+1),Y3(i),Z3(z10)],[X3(t+1),Y3(i+1),Z3(z11)],[X3(t),Y3(i+1),Z3(z01)]],fill:mz>8?C.coral:mz<2?C.blue:'#9fb7c9',opacity:mz>8?.9:.55,stroke:'#7f97a8'})}
  let out=paintFaces(faces,Pr);
  const lab=(p,t,col)=>{const q=Pr(p);return TF(q[0],q[1],t,13,col)};
  out+=lab([X3(B6_TD.cue),-.35,0],'cue',C.blue)+lab([X3(B6_TD.rew),-.35,0],'juice',C.green)+lab([3.4,1.5,0],'trials →',C.muted)+lab([1.5,-.8,0],'time in trial →',C.muted);
  return {svg:out,title:'Firing across trials and time',caption:`Height is the simulated firing rate, across time within a trial (left to right) and across ${log.length} trials (front to back). The ridge starts at the juice and, as training goes on, moves to the cue.${log.some(t=>t.type==='omit')?' A dip shows where juice was withheld.':''}`};
 }});

// Wanting against liking. Illustrative values (relative to normal = 1), after Berridge, Venier & Robinson (1989; rats with
// dopamine depleted by 6-OHDA) and Peciña and others (2003; mice with raised dopamine, DAT knockdown).
const B6_WL={dep:['Dopamine depleted','rats, 1989',1,.08],norm:['Normal dopamine','control',1,1],high:['Dopamine raised','mice, 2003',1.05,1.7]};
function B6_wlMeasure(cond,what,i){const v=B6_WL[cond][what==='like'?2:3],r=B6_rng(i*53+cond.length*7+(what==='like'?1:2));return Math.max(0,v*(1+.08*B6_gauss(r)))}
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
   out+=TF(xc,300,({dep:'Depleted',norm:'Normal',high:'Raised'})[c],13,c===s.cond?C.ink:C.muted,'middle',c===s.cond?'font-weight="700"':'')+TF(xc,316,B6_WL[c][1],13,C.muted)});
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

/* ===================== Lesson: stress-response ===================== */
// The fast response, minute by minute (illustrative): sympathetic drive follows the threat within seconds; adrenaline
// is cleared with a time constant of 2 min; heart rate follows drive and adrenaline; blood glucose rises with adrenaline
// and is pulled back to its resting level with a time constant of 8 min (negative feedback, mainly insulin).
const B6_FF_CACHE={};
function B6_fast(dur,cut){
 const key=dur+'|'+cut;if(B6_FF_CACHE[key])return B6_FF_CACHE[key];
 const dt=1/60,out=[];let A=0,Gl=0,Hd=0;
 for(let i=0;i<=20*60;i++){const t=i*dt,on=dur>0&&t>=2&&t<2+dur,drive=cut?0:on?1:0;
  Hd+=(drive-Hd)*dt/.08;A+=(drive*.9-A/2)*dt;Gl+=(.05*A-Gl/8)*dt;
  out.push([t,70+(cut?6*(on?1:0):28*Hd+12*A),A,100*(1+Gl)])}
 return B6_FF_CACHE[key]=out;
}
const B6_FFDUR={0:'No threat',1:'1 minute',6:'6 minutes'};
SCENE({id:'stress-response',name:'Fight or flight, and back again',tag:'Cannon, 1915–1932',
 definition:'Walter Cannon, at Harvard, studied how animals meet an emergency. In 1911 he and de la Paz found adrenaline in the blood of cats that had been barked at by a dog, and in his 1915 book he described the whole fast response, carried by sympathetic nerves and adrenaline: a faster heart, glucose released into the blood, digestion paused. It became known as the fight-or-flight response.',
 example:'Cannon also asked how the body returns to normal. In 1926 he coined the word homeostasis for the regulation that keeps the blood’s glucose, salt, temperature and other variables near steady levels, mostly by negative feedback. The stress response is a brief departure from homeostasis that the same systems then correct.',
 desc:'Three traces over twenty minutes, heart rate, adrenaline in the blood and blood glucose, as a threat comes and goes. The learner sets how long the threat lasts and whether the sympathetic nerves are intact.',
 research:['Cannon & de la Paz (1911). Emotional stimulation of adrenal secretion. American Journal of Physiology 28, 64–70.','Cannon (1915). Bodily Changes in Pain, Hunger, Fear and Rage. Appleton.','Cannon (1929). Organization for physiological homeostasis. Physiological Reviews 9, 399–431; Cannon (1932). The Wisdom of the Body.'],
 dur:12,hint:'Choose how long the threat lasts and read the traces. Then cut the sympathetic nerves, as Cannon did in cats, and compare. Numbers are illustrative; nothing here is medical advice.',
 init:()=>({dur:1,cut:0,run:1}),
 watch(p){return {dur:p<.5?1:6,cut:0,run:1,show:p<.5?p*2:(p-.5)*2}},
 ui:[{choose:[[1,'1 minute'],[6,'6 minutes'],[0,'No threat']],label:'Threat lasts',get:s=>s.dur,act:'dur'},{choose:[[0,'Nerves intact'],[1,'Sympathetic nerves cut']],label:'Nerves',get:s=>s.cut,act:'cut'}],
 on:{dur(s,v){s.dur=[0,1,6].includes(+v)?+v:1},cut(s,v){s.cut=+v?1:0}},
 draw(s,f,X){
  const M=B6_fast(s.dur,s.cut),upto=X&&!X.try&&s.show!==undefined?20*clamp(s.show*1.15,0,1):20,vis=M.filter(q=>q[0]<=upto+1e-9);
  const pk=M.reduce((a,q)=>q[1]>a[1]?q:a),back=M.find(q=>q[0]>2+s.dur&&q[1]<75),gk=M.reduce((a,q)=>q[3]>a[3]?q:a);
  let out=heading(!s.dur?'At rest: steady levels':s.cut?'Without sympathetic nerves, little happens':`A ${s.dur}-minute threat: up in seconds, back in minutes`);
  const panel=(y,lab,col,idx,lo,hi,unit)=>{const pl=B6_plot(110,y,450,62,[0,20],[lo,hi],{yt:[[lo,String(lo)],[hi,String(hi)]]});let o=pl.svg+TF(100,y+28,lab,13,col,'end')+TF(100,y+44,unit,13,C.muted,'end');
   if(s.dur)o+=R(pl.X(2),y+1,pl.X(2+s.dur)-pl.X(2),60,C.coralp,'none',0,'opacity=".6"');
   o+=B6_poly(vis.filter((q,i)=>i%5===0).map(q=>[pl.X(q[0]),pl.Y(clamp(q[idx],lo,hi))]),col,2.4);return o};
  out+=panel(48,'heart rate',C.coral,1,60,130,'beats/min')+panel(130,'adrenaline',C.amber,2,0,2,'relative')+panel(212,'glucose',C.purple,3,90,140,'% of rest');
  for(const v of [0,5,10,15,20])out+=TF(110+v/20*450,292,v+(v===20?' min':''),13,C.muted);
  if(s.dur)out+=R(110+2/20*450,298,s.dur/20*450,4,C.coral,'none',1)+TF(110+(2+s.dur/2)/20*450,314,'threat',13,C.coral);
  out+=B6_tile(110,322,150,'Peak heart rate',Math.round(pk[1])+' /min',C.coral)+B6_tile(270,322,150,'Glucose peak',Math.round(gk[3])+'% of rest',C.purple)+B6_tile(430,322,150,'Heart back near rest',!s.dur?'—':back?fmt(B6_r1(back[0]-2-s.dur))+' min after':'later',C.ink);
  const ph=!s.dur?'Heart rate, adrenaline and glucose hold near their resting levels, each corrected whenever it drifts: homeostasis.':
   s.cut?'With the sympathetic nerves cut, the heart barely speeds up and no extra adrenaline reaches the blood, so glucose stays flat. Cannon’s cats without these nerves lived well in a sheltered laboratory but coped poorly with cold and exertion.':
   `The heart speeds up within seconds, to about ${Math.round(pk[1])} beats a minute, as sympathetic nerves fire. Adrenaline from the adrenal medulla adds to it and releases glucose, which peaks at about ${Math.round(gk[3])}% of its resting level. When the threat passes, adrenaline is cleared within minutes and feedback brings glucose back.`;
  return {svg:out,phase:ph};
 }});

// Selye's alarm, resistance and exhaustion (shape only, after Selye 1936), and Mason's (1971) test of non-specificity.
const B6_AGENT={cold:'Cold',injury:'Surgical injury',exercise:'Forced exercise',drug:'Toxic doses of drugs'};
const B6_resist=d=>d<2?1-.45*Math.sin(Math.PI*d/2):d<45?1+.35*(1-Math.exp(-(d-2)/6)):Math.max(.15,1.35-1.2*(d-45)/40);
SCENE({id:'stress-response-selye',name:'One response to many harms?',tag:'Selye, 1936; Mason, 1971',
 definition:'In 1936 Hans Selye, in Montreal, reported that rats exposed to quite different harmful agents, such as cold, surgical injury, forced exercise or toxic doses of drugs, all showed the same changes within 6 to 48 hours: enlarged adrenal glands, a shrunken thymus and lymph tissue, and ulcers in the stomach. He called this general response the general adaptation syndrome and later brought the word “stress” into biology.',
 example:'Selye described three stages: an alarm reaction, then resistance if the exposure goes on, then, after one to three months, exhaustion. In 1971 John Mason challenged the claim that the response is the same for every demand. Monkeys that fasted but were given look-alike pellets with no food value showed little rise in adrenal hormones. Much of the response depends on how the animal experiences the situation.',
 desc:'Left, bars for the three changes Selye reported, the same for every agent. Right, a curve of resistance against days of exposure with the three stages. Mason’s test is shown as a pair of bars for fasting monkeys with and without look-alike pellets.',
 research:['Selye (1936). A syndrome produced by diverse nocuous agents. Nature 138, 32.','Mason (1971). A re-evaluation of the concept of “non-specificity” in stress theory. Journal of Psychiatric Research 8, 323–333.'],
 dur:12,hint:'Choose an agent and compare the changes, then drag through the days to see the three stages. Switch to Mason’s test to see the claim of sameness challenged. The bars are schematic.',
 init:()=>({ag:'cold',day:10,mason:0}),
 watch(p){const k=Math.min(4,Math.floor(p*5));return {ag:Object.keys(B6_AGENT)[Math.min(3,k)],day:Math.round(1+p*89),mason:k===4?1:0}},
 ui:[{choose:Object.keys(B6_AGENT).map(k=>[k,B6_AGENT[k]]),label:'Agent',get:s=>s.ag,act:'ag'},{range:'day',label:'Days of exposure',min:1,max:90,step:1,get:s=>s.day,act:'day'},{choose:[[0,'Selye’s rats'],[1,'Mason’s monkeys']],label:'Study',get:s=>s.mason,act:'mason'}],
 on:{ag(s,v){if(B6_AGENT[v])s.ag=v},day(s,v){s.day=clamp(Math.round(+v),1,90)},mason(s,v){s.mason=+v?1:0}},
 draw(s){
  const stage=s.day<=2?'alarm':s.day<=45?'resistance':'exhaustion';
  let out=heading(s.mason?'Mason: remove the distress, and the response shrinks':`${B6_AGENT[s.ag]}: the same three changes`);
  out+=R(14,48,270,248,'#fff',C.grid,8);
  if(!s.mason){
   out+=TBF(149,68,'Rats, 48 hours after exposure',13,C.ink);
   const bars=[['adrenal glands',1.6,C.coral],['thymus',.45,C.blue],['stomach ulcers',1,C.purple]];
   out+=L(40,250,264,250,C.line,1.4);
   bars.forEach(([lab,v,col],i)=>{const x=50+i*76,h=v*90;out+=R(x,250-h,46,h,col,'none',4)+TF(x+23,268,lab.split(' ')[0],13,C.ink)+TF(x+23,284,lab.split(' ')[1]||'',13,C.ink)+TF(x+23,244-h,i===2?'appear':i===0?'enlarged':'shrunk',13,col)});
   out+=L(40,160,192,160,C.muted,1,'stroke-dasharray="4 3"')+TF(116,154,'untreated',13,C.muted);
  }else{
   out+=TBF(149,68,'Fasting monkeys (Mason, 1971)',13,C.ink);
   const bars=[['no',1,C.coral],['look-alike',.15,C.green]];
   bars.forEach(([lab,v,col],i)=>{const x=70+i*110,h=30+v*100;out+=R(x,250-h,60,h,col,'none',4)+TF(x+30,268,lab,13,C.ink)+TF(x+30,284,'pellets',13,C.ink)});
   out+=TF(149,92,'rise in adrenal hormones',13,C.muted)+TF(149,108,'(schematic)',13,C.muted);
  }
  // stage curve
  const pl=B6_plot(330,70,250,150,[0,90],[0,1.5],{xt:[[0,'0'],[30,'30'],[60,'60'],[90,'90']],xl:'days of exposure',xlDy:32,yl:'resistance (schematic)'});out+=pl.svg;
  const pts=[];for(let d=0;d<=90;d+=.5)pts.push([pl.X(d),pl.Y(B6_resist(d))]);out+=B6_poly(pts,C.ink,2.2);
  out+=L(pl.X(0),pl.Y(1),pl.X(90),pl.Y(1),C.line,1,'stroke-dasharray="3 3"')+Ci(pl.X(s.day),pl.Y(B6_resist(s.day)),6,C.coral,'#fff');
  out+=TF(pl.X(2)+4,pl.Y(.45)+4,'alarm',13,stage==='alarm'?C.coral:C.muted,'start')+TF(pl.X(24),pl.Y(1.1),'resistance',13,stage==='resistance'?C.coral:C.muted)+TF(pl.X(72),pl.Y(1.25),'exhaustion',13,stage==='exhaustion'?C.coral:C.muted);
  out+=B6_tile(330,256,250,`Day ${s.day}`,stage[0].toUpperCase()+stage.slice(1)+' stage',C.coral);
  out+=B6_note('Schematic, after Selye’s 1936 description; no pictures of the animals.',334)+B6_note('Selye’s agents were deliberately harmful; such studies would face strict limits today.',350);
  const ph=s.mason?'Fasting is a physical demand, yet when the monkeys received pellets that looked like their usual food, their adrenal hormones barely rose. Without pellets they rose sharply. Mason argued that the common factor in Selye’s agents was the distress they caused, so the response is less uniform than Selye claimed.':
   stage==='alarm'?`In the first two days of ${B6_AGENT[s.ag].toLowerCase()} the rats show the alarm reaction, and resistance to the agent briefly falls. Selye found the same enlarged adrenals, shrunken thymus and stomach ulcers whatever the agent.`:
   stage==='resistance'?`If the exposure continues, the organs partly recover and the animals withstand the agent better than untreated rats: the stage of resistance.`:
   `After one to three months of continued exposure, Selye reported that resistance was lost and the animals died: the stage of exhaustion. He read this as a limited store of “adaptation energy”, an idea that has not held up.`;
  return {svg:out,phase:ph};
 }});

/* HPA axis toy model in minutes (not real kinetics), normalised so every level is 1 at rest:
   CRH' = b(1 + 6·stress)/(1 + f·G) − CRH/5,  ACTH' = CRH/(1 + f·G) − ACTH/10,  G' = ACTH − G/90,
   with b set so that G = 1 at rest; f is the strength of cortisol's negative feedback (normal 2, weak 0.3). */
const B6_HPA_CACHE={};
function B6_hpa(dur,fb){
 const key=dur+'|'+fb;if(B6_HPA_CACHE[key])return B6_HPA_CACHE[key];
 const tC=5,tA=10,tG=90,b=(1+fb)*(1+fb)/(tG*tA*tC),dt=.25;let C0=tC*b/(1+fb),A0=tA*C0/(1+fb),Cr=C0,A=A0,G=1;const out=[];
 for(let i=0;i<=300/dt;i++){const t=i*dt,st=t>=10&&t<10+dur?1:0;if(i%4===0)out.push([t,Cr/C0,A/A0,G]);
  const dC=b*(1+6*st)/(1+fb*G)-Cr/tC,dA=Cr/(1+fb*G)-A/tA,dG=A-G/tG;Cr+=dt*dC;A+=dt*dA;G+=dt*dG}
 const pk=out.reduce((m,v)=>v[3]>m[3]?v:m),back=out.find(v=>v[0]>pk[0]&&v[3]<1+.1*(pk[3]-1));
 return B6_HPA_CACHE[key]={out,pk,back};
}
SCENE({id:'stress-response-axis',name:'The hormone chain and its brake',tag:'Harris 1948; CRH, Vale 1981',
 definition:'The slower arm of the stress response is a chain of hormones, the hypothalamic–pituitary–adrenal (HPA) axis. Neurons in the hypothalamus release corticotropin-releasing hormone (CRH) into small blood vessels that run to the pituitary, as Geoffrey Harris argued in 1948. The pituitary releases ACTH into the blood, and ACTH makes the adrenal cortex release cortisol.',
 example:'Wylie Vale’s group identified CRH in 1981. Cortisol acts back on the hypothalamus and pituitary to turn the chain down, a negative feedback that ends the response. After a brief stressor cortisol peaks some 20 to 40 minutes after the start, so it acts over tens of minutes to hours, long after the adrenaline has gone.',
 desc:'A chain from hypothalamus to pituitary to adrenal cortex, with feedback arrows from cortisol back to both. Beside it, CRH, ACTH and cortisol over five hours after a stressor, each relative to its resting level.',
 research:['Harris (1948). Neural control of the pituitary gland. Physiological Reviews 28, 139–179.','Vale, Spiess, Rivier & Rivier (1981). Characterization of a 41-residue ovine hypothalamic peptide that stimulates secretion of corticotropin and β-endorphin. Science 213, 1394–1397.','Dickerson & Kemeny (2004). Acute stressors and cortisol responses: a theoretical integration and synthesis of laboratory research. Psychological Bulletin 130, 355–391 (peak 21–40 minutes after onset).'],
 dur:12,hint:'Switch a stressor on for 15 minutes or for 2 hours, and weaken the feedback to see what the brake does. A toy model with relative units; nothing here is medical advice.',
 init:()=>({dur:15,fb:2}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {dur:k%2?120:15,fb:k<2?2:.3}},
 ui:[{choose:[[15,'Stressor 15 min'],[120,'Stressor 2 h']],label:'Stressor',get:s=>s.dur,act:'dur'},{choose:[[2,'Normal feedback'],[.3,'Weak feedback']],label:'Feedback',get:s=>s.fb,act:'fb'}],
 on:{dur(s,v){s.dur=+v===120?120:15},fb(s,v){s.fb=+v===.3?.3:2}},
 draw(s){
  const H=B6_hpa(s.dur,s.fb),pkAt=H.pk[0]-10,weak=s.fb<1;
  let out=heading(`${s.dur===15?'A 15-minute':'A 2-hour'} stressor, ${weak?'weak':'normal'} feedback`);
  // chain
  const node=(y,lab,sub,col)=>box(24,y,150,40,lab,C.pale,C.ink,14)+TF(99,y+56,sub,13,col);
  out+=node(52,'hypothalamus','releases CRH',C.blue)+node(132,'pituitary','releases ACTH',C.green)+node(212,'adrenal cortex','releases cortisol',C.coral);
  out+=arrow(99,92,99,130,C.blue,2.5)+arrow(99,172,99,210,C.green,2.5);
  const fw=weak?1.4:3;out+=curveArrow(176,232,176,72,-40,C.coral,fw)+curveArrow(176,232,176,152,-22,C.coral,fw);
  out+=TF(99,300,weak?'Weak feedback: cortisol':'Feedback: cortisol',13,C.coral)+TF(99,316,weak?'barely turns the chain down':'turns the chain down',13,C.coral);
  // traces
  const ymax=Math.max(5,Math.ceil(Math.max(...H.out.map(v=>Math.max(v[1],v[2])))));
  const pl=B6_plot(270,60,310,190,[0,300],[0,ymax],{yt:[[1,'1'],[ymax,String(ymax)]],xt:[[0,'0'],[60,'1'],[120,'2'],[180,'3'],[240,'4'],[300,'5 h']],yl:'level relative to rest'});out+=pl.svg;
  out+=R(pl.X(10),61,pl.X(10+s.dur)-pl.X(10),188,C.coralp,'none',0,'opacity=".55"');
  [[1,C.blue],[2,C.green],[3,C.coral]].forEach(([k,col])=>out+=B6_poly(H.out.map(v=>[pl.X(v[0]),pl.Y(v[k])]),col,k===3?3:2));
  out+=L(pl.X(0),pl.Y(1),pl.X(300),pl.Y(1),C.line,1,'stroke-dasharray="3 3"')+Ci(pl.X(H.pk[0]),pl.Y(H.pk[3]),5,C.coral,'#fff');
  out+=R(270,286,12,12,C.blue,'none',2)+TF(288,297,'CRH',13,C.ink,'start')+R(330,286,12,12,C.green,'none',2)+TF(348,297,'ACTH',13,C.ink,'start')+R(398,286,12,12,C.coral,'none',2)+TF(416,297,'cortisol',13,C.ink,'start');
  out+=B6_tile(270,310,150,'Cortisol peak',`${Math.round(pkAt)} min after onset`,C.coral)+B6_tile(430,310,150,'Back near rest',H.back?`${fmt(B6_r1((H.back[0]-10)/60))} h after onset`:'after 5 h',C.ink);
  const ph=s.dur===15?`ACTH rises within minutes and cortisol follows, peaking ${Math.round(pkAt)} minutes after the stressor began at ${fmt(Math.round(H.pk[3]*100)/100)} times its resting level. ${weak?'With a weak brake it lingers: about '+(H.back?fmt(B6_r1((H.back[0]-10)/60))+' hours':'more than 5 hours')+' to settle.':'Feedback then turns the chain down, and cortisol is back near rest about '+fmt(B6_r1((H.back[0]-10)/60))+' hours after the start.'}`:
   `During a 2-hour stressor, ${weak?'with a weak brake, cortisol climbs to '+fmt(Math.round(H.pk[3]*100)/100)+' times rest and stays high while the stressor lasts.':'cortisol rises and then levels off at about '+fmt(Math.round(H.pk[3]*100)/100)+' times rest even though the stressor continues: its own feedback is holding the chain back.'} Compare with the other feedback setting.`;
  return {svg:out,phase:ph};
 }});

// Long-lasting stress. Rat CA3 dendrites (schematic): shorter and less branched after 21 days of daily restraint
// (Watanabe, Gould & McEwen 1992), recovering after the stress ends (McEwen 1999). Human twins: Gilbertson et al. (2002).
const B6_DEND={0:1,7:.85,21:.68};
function B6_tree(x,y,len,depth,ang,scale,out=[]){if(depth===0)return out;const x2=x+Math.sin(ang)*len*scale,y2=y-Math.cos(ang)*len*scale;out.push([x,y,x2,y2,depth]);
 if(depth>1&&!(scale<.8&&depth===2&&ang>0))for(const da of [-.42,.42])B6_tree(x2,y2,len*.72,depth-1,ang+da,scale,out);return out}
SCENE({id:'stress-response-chronic',name:'When the response stays on',tag:'Sapolsky and McEwen; human twins, 2002',
 definition:'A response built for minutes can do harm when it lasts for weeks. In rats, Robert Sapolsky, Bruce McEwen and colleagues found that long exposure to glucocorticoids damaged neurons in the hippocampus, a region rich in receptors for them. Watanabe, Gould and McEwen (1992) showed that 21 days of daily restraint left the dendrites of CA3 neurons shorter and less branched; the change reversed after the stress ended.',
 example:'People with long-lasting stress-related conditions, such as post-traumatic stress disorder (PTSD), have on average a somewhat smaller hippocampus. That is a correlation. Gilbertson and colleagues (2002) scanned identical twins: Vietnam veterans with and without PTSD, and their brothers who had not been in combat. The unexposed brothers of men with PTSD also had smaller hippocampi.',
 desc:'Left, a sketch of a rat CA3 neuron’s dendrites after days of restraint stress and after recovery. Right, the learner picks an explanation for the smaller hippocampus in PTSD, and the twin data show which one fits.',
 research:['Sapolsky, Krey & McEwen (1985). Prolonged glucocorticoid exposure reduces hippocampal neuron number: implications for aging. Journal of Neuroscience 5, 1222–1227.','Watanabe, Gould & McEwen (1992). Stress induces atrophy of apical dendrites of hippocampal CA3 pyramidal neurons. Brain Research 588, 341–345; McEwen (1999), Annual Review of Neuroscience 22, 105–122.','Gilbertson, Shenton, Ciszewski and others (2002). Smaller hippocampal volume predicts pathologic vulnerability to psychological trauma. Nature Neuroscience 5, 1242–1247.'],
 dur:12,hint:'Set the days of stress for the rat and let it recover. Then choose an explanation for the human finding and reveal the twins. Nothing here is medical advice; if stress is affecting your health, a doctor can help.',
 init:()=>({days:21,rec:0,hyp:''}),
 watch(p){const k=Math.min(4,Math.floor(p*5));return [{days:0,rec:0,hyp:''},{days:7,rec:0,hyp:''},{days:21,rec:0,hyp:''},{days:21,rec:1,hyp:''},{days:21,rec:1,hyp:'first'}][k]},
 ui:[{choose:[[0,'No stress'],[7,'7 days'],[21,'21 days']],label:'Restraint',get:s=>s.days,act:'days'},{choose:[[0,'Just after'],[1,'After recovery']],label:'When',get:s=>s.rec,act:'rec'},{b:'Stress shrank it',act:'hyp',arg:'shrank'},{b:'It was smaller first',act:'hyp',arg:'first'}],
 on:{days(s,v){s.days=[0,7,21].includes(+v)?+v:21},rec(s,v){s.rec=+v?1:0},hyp(s,v){s.hyp=v==='first'?'first':'shrank'}},
 draw(s){
  const sc=s.rec?1:B6_DEND[s.days];
  let out=heading(s.hyp?'The twins point to a risk factor present beforehand':s.rec&&s.days?'After the stress ends, the dendrites regrow':`Rat hippocampus after ${s.days} days of restraint`);
  out+=R(14,48,250,250,'#fff',C.grid,8)+TBF(139,68,'Rat CA3 neuron (sketch)',13,C.ink);
  for(const [x1,y1,x2,y2,d] of B6_tree(139,250,62,5,0,sc))out+=L(x1,y1,x2,y2,C.green,1+d*.7);
  out+=`<polygon points="129,252 149,252 139,270" fill="${C.green}"/>`+L(139,270,139,290,C.green,2);
  out+=B6_tile(40,300,200,'Dendrite length',Math.round(sc*100)+'% of control',sc<1?C.coral:C.green);
  // twins
  out+=R(280,48,306,250,'#fff',C.grid,8)+TBF(433,68,'Hippocampal volume (schematic)',13,C.ink);
  const grp=[['veteran','with PTSD',.88,C.coral],['his twin','not in war',.89,C.purple],['veteran','no PTSD',1,C.blue],['his twin','not in war',1,C.blue]];
  grp.forEach(([a,b,v,col],i)=>{const x=300+i*70,h=150*v,show=i===0||i===2||s.hyp;
   out+=show?R(x,250-h,44,h,col,'none',4):R(x,250-150,44,150,'none',C.line,4,'stroke-dasharray="4 3"')+TF(x+22,180,'?',16,C.muted);
   out+=TF(x+22,268,a,13,C.ink)+TF(x+22,284,b,13,C.muted)});
  out+=B6_tile(300,300,270,'Your explanation',s.hyp==='first'?'It was smaller first':s.hyp==='shrank'?'Stress shrank it':'not chosen yet',s.hyp==='first'?C.green:s.hyp?C.coral:C.muted);
  out+=B6_note('Schematic. Rat data are causal tests; the human data are correlations.',368);
  const ph=s.hyp?`${s.hyp==='first'?'Your explanation fits best.':'The twins argue against that explanation alone.'} The brothers who never went to war, but whose twins developed PTSD, also had smaller hippocampi. So a smaller hippocampus seems partly to come first, as a risk factor, rather than only as damage done by stress. It does not rule out some effect of stress as well.`:
   s.days===0?'An unstressed rat: the apical dendrites of a CA3 neuron branch freely. Choose a number of days of daily restraint.':
   s.rec?'After the stress ended these dendrites regrew within weeks. In rats, at least, this change is a reversible remodelling, not a permanent loss.':
   `After ${s.days} days of daily restraint the dendrites are shorter and less branched, at ${Math.round(sc*100)}% of control in this sketch. In later rat studies, blocking the rise in corticosterone prevented much of it. Now look at the human finding on the right and choose an explanation.`;
  return {svg:out,phase:ph};
 }});

/* ===================== Lesson: hunger-homeostasis ===================== */
// Hypothalamic lesions in rats, illustrative curves over 10 weeks (70 days). VMH: weight rises towards a new plateau
// (time constant 18 days, plateau 170% of start); LH: no eating for a week, then partial recovery, weight settling lower.
const B6_LES={none:'No lesion',vmh:'Ventromedial (VMH)',lh:'Lateral (LH)'};
function B6_lesion(k,d){
 if(k==='vmh'){const u=Math.exp(-d/18);return {w:100+70*(1-u),food:1+.9*u+.3*(1-u)}}
 if(k==='lh'){const f=d<7?0:.85*(1-Math.exp(-(d-7)/10));return {w:80+20*Math.exp(-d/10),food:f}}
 return {w:100+.07*d,food:1};
}
SCENE({id:'hunger-homeostasis',name:'Lesions that change eating',tag:'Hetherington and Ranson, 1940',
 definition:'In 1940 Albert Hetherington and Stephen Ranson made small lesions in the ventromedial hypothalamus (VMH) of rats with a precisely guided electrode, and the rats became very fat. Brobeck and colleagues showed in 1943 that they ate far more, for weeks, and then settled at a new, higher weight. In 1951 Bal Anand and John Brobeck found the opposite after lesions of the lateral hypothalamus (LH): the rats stopped eating.',
 example:'Eliot Stellar (1954) drew the results together as a “satiety centre” and a “feeding centre”. The two-centre picture proved too simple: the lesions also cut fibre pathways passing through, and LH rats kept alive by tube feeding slowly began to eat again (Teitelbaum and Stellar, 1954). The modern picture is of circuits, centred on the arcuate nucleus, that read signals from the body.',
 desc:'Body weight and daily food intake over ten weeks for a rat with no lesion, a VMH lesion or an LH lesion, with a marker the learner moves through the weeks.',
 research:['Hetherington & Ranson (1940). Hypothalamic lesions and adiposity in the rat. Anatomical Record 78, 149–172.','Brobeck, Tepperman & Long (1943). Experimental hypothalamic hyperphagia in the albino rat. Yale Journal of Biology and Medicine 15, 831–853.','Anand & Brobeck (1951), Yale Journal of Biology and Medicine 24, 123–140; Teitelbaum & Stellar (1954), Science 120, 894–895.'],
 dur:12,hint:'Choose a lesion and move through the weeks to read weight and food intake. The curves are illustrative; they describe rats, not people.',
 init:()=>({les:'vmh',wk:4}),
 watch(p){const k=Math.min(2,Math.floor(p*3));return {les:['none','vmh','lh'][k],wk:Math.round(10*clamp((p*3-k)*1.3,0,1))}},
 ui:[{choose:Object.keys(B6_LES).map(k=>[k,B6_LES[k]]),label:'Lesion',get:s=>s.les,act:'les'},{range:'wk',label:'Week',min:0,max:10,step:1,get:s=>s.wk,act:'wk'}],
 on:{les(s,v){if(B6_LES[v])s.les=v},wk(s,v){s.wk=clamp(Math.round(+v),0,10)}},
 draw(s){
  const now=B6_lesion(s.les,s.wk*7);
  let out=heading(s.les==='vmh'?'VMH lesion: overeating, then a higher plateau':s.les==='lh'?'LH lesion: eating stops, then partly returns':'An intact rat holds its weight');
  // sketch: hypothalamus in section with the two lesion sites
  out+=R(14,48,200,170,'#fff',C.grid,8)+TBF(114,68,'Rat hypothalamus',13,C.ink);
  out+=P('M40 90C60 80 168 80 188 90L176 184C150 196 78 196 52 184Z',C.line,2,'#f4f8fb')+R(108,88,12,90,C.pale,'none',3);
  for(const [x,y,k,lab] of [[84,150,'vmh','VMH'],[144,150,'vmh',''],[56,124,'lh','LH'],[172,124,'lh','']]){const on=s.les===k;out+=Ci(x,y,on?9:7,on?C.coral:'#fff',on?C.coral:C.line);if(lab)out+=TF(x,y+(k==='vmh'?26:-14),lab,13,on?C.coral:C.muted)}
  out+=TF(114,208,'both sides lesioned',13,C.muted);
  out+=B6_tile(14,232,200,'Body weight, week '+s.wk,Math.round(now.w)+'% of start',C.purple)+B6_tile(14,286,200,'Food eaten per day',Math.round(now.food*100)+'% of normal',C.amber);
  // plots
  const pw=B6_plot(270,56,310,120,[0,70],[60,180],{yt:[[60,'60'],[100,'100'],[180,'180']],yl:'body weight, % of start'}),pf=B6_plot(270,206,310,100,[0,70],[0,2],{xt:[0,14,28,42,56,70].map(d=>[d,String(d/7)]),yt:[[0,'0'],[1,'1×'],[2,'2×']],yl:'food per day, × normal',xl:'weeks after the lesion'});
  out+=pw.svg+pf.svg;
  for(const k of ['none','vmh','lh']){const on=k===s.les,col=on?C.purple:'#c3d0da',col2=on?C.amber:'#e0d3b8',a=[],b=[];for(let d=0;d<=70;d++){const q=B6_lesion(k,d);a.push([pw.X(d),pw.Y(q.w)]);b.push([pf.X(d),pf.Y(q.food)])}out+=B6_poly(a,col,on?2.6:1.4)+B6_poly(b,col2,on?2.6:1.4)}
  out+=L(pw.X(s.wk*7),56,pw.X(s.wk*7),306,C.ink,1.2,'stroke-dasharray="3 3"');
  const ph=s.les==='vmh'?`Week ${s.wk}: weight ${Math.round(now.w)}% of the start, food ${Math.round(now.food*100)}% of normal. ${s.wk<4?'In the first weeks the rat eats far more than normal and gains fast.':'Later its eating falls back towards normal and its weight levels off at a new, higher plateau, as if the level it defends had been raised.'}`:
   s.les==='lh'?`Week ${s.wk}: ${s.wk<1?'the rat has stopped eating and drinking; it is kept alive by tube feeding.':`it eats ${Math.round(now.food*100)}% of normal and its weight settles near ${Math.round(now.w)}%, lower than before but held steady.`} Recovery showed that the lateral area was not a simple feeding switch.`:
   'Without a lesion the rat eats about the same amount each day and its weight stays nearly constant, rising slowly as adult rats do.';
  return {svg:out,phase:ph};
 }});

// Coleman's joined pairs (illustrative weights over 4 weeks, % of start). Coleman (1973): ob and db mice joined to normal
// mice or to each other. Question asked of: the ob mouse (ob+normal), the normal mouse (db+normal), the ob mouse (ob+db).
const B6_PAIR={
 obwt:['ob + normal','ob',[['ob',105,'eats less, gains less than alone'],['normal',102,'unchanged']]],
 dbwt:['db + normal','normal',[['db',112,'unchanged, still obese'],['normal',70,'stops eating, starves']]],
 obdb:['ob + db','ob',[['ob',70,'stops eating, loses weight'],['db',112,'unchanged, still obese']]]};
const B6_PRED={less:'Eats less',same:'No change',more:'Eats more'};
const B6_PAIR_ANS={obwt:'less',dbwt:'less',obdb:'less'};
SCENE({id:'hunger-homeostasis-parabiosis',name:'A signal in the blood',tag:'Coleman’s joined mice, 1973',
 definition:'Two strains of mice, ob and db, become severely obese. In the late 1960s and early 1970s Douglas Coleman, at the Jackson Laboratory, joined pairs of mice surgically so that they shared a little of their blood circulation, a technique called parabiosis, and watched what each partner ate. If a hormone controls eating, it should cross from one partner to the other.',
 example:'An ob mouse joined to a normal mouse ate less: it received something it lacked. A normal mouse joined to a db mouse stopped eating and starved, and so did an ob mouse joined to a db mouse. Coleman concluded that ob mice lack a satiety hormone, and db mice make plenty of it but cannot respond to it. The hormone was found twenty years later.',
 desc:'Two mice joined side by side and their body weights over four weeks, for each of Coleman’s three pairings. The learner predicts what the key partner will do before joining them, and the conclusion appears once all three pairs are run.',
 research:['Coleman (1973). Effects of parabiosis of obese with diabetes and normal mice. Diabetologia 9, 294–298.','Coleman & Hummel (1969). Effects of parabiosis of normal with genetically diabetic mice. American Journal of Physiology 217, 1298–1304.'],
 dur:12,hint:'Pick a pair, predict what the named partner will do, then join them. Run all three pairs to reach Coleman’s conclusion. Weights are illustrative.',
 init:()=>({pair:'obwt',pred:'less',ran:{}}),
 watch(p){const k=Math.min(3,Math.floor(p*4)),keys=Object.keys(B6_PAIR),ran={};keys.slice(0,k).forEach(q=>ran[q]='less');return {pair:keys[Math.min(2,Math.max(0,k-1))],pred:'less',ran}},
 ui:[{choose:Object.keys(B6_PAIR).map(k=>[k,B6_PAIR[k][0]]),label:'Pair',get:s=>s.pair,act:'pair'},{choose:Object.keys(B6_PRED).map(k=>[k,B6_PRED[k]]),label:'Prediction',get:s=>s.pred,act:'pred'},{b:'Join them for 4 weeks',act:'join'}],
 on:{pair(s,v){if(B6_PAIR[v])s.pair=v},pred(s,v){if(B6_PRED[v])s.pred=v},join(s){s.ran[s.pair]=s.pred}},
 draw(s){
  const Pp=B6_PAIR[s.pair],done=s.ran[s.pair]!==undefined,all=Object.keys(B6_PAIR).every(k=>s.ran[k]!==undefined);
  let out=heading(all?'ob lacks the signal; db cannot read it':done?`${Pp[0]}: the ${Pp[1]} mouse ${B6_PAIR_ANS[s.pair]==='less'?'eats less':''}`:`${Pp[0]}: what will the ${Pp[1]} mouse do?`);
  // the pair
  const mouse=(x,lab,fat)=>`<ellipse cx="${x}" cy="130" rx="${fat?44:32}" ry="${fat?34:26}" fill="${fat?C.amberp:C.pale}" stroke="${fat?C.amber:C.blue}" stroke-width="2"/>`+TBF(x,136,lab,14,C.ink);
  const [A,B]=Pp[2],fatA=A[0]!=='normal',fatB=B[0]!=='normal';
  out+=R(14,48,250,170,'#fff',C.grid,8)+mouse(90,A[0],fatA)+mouse(196,B[0],fatB)+R(126,124,34,12,C.coralp,C.coral,4)+TF(143,184,'shared blood',13,C.coral);
  out+=TF(139,206,'Your prediction for '+Pp[1]+': '+B6_PRED[s.pred].toLowerCase(),13,C.ink);
  // weights
  const pl=B6_plot(300,60,280,136,[0,4],[60,120],{xt:[[0,'0'],[1,'1'],[2,'2'],[3,'3'],[4,'4']],xl:'weeks joined',xlDy:31,yt:[[60,'60'],[100,'100'],[120,'120']],yl:'body weight, % of start'});out+=pl.svg;
  out+=L(pl.X(0),pl.Y(100),pl.X(4),pl.Y(100),C.line,1,'stroke-dasharray="3 3"');
  if(done)[A,B].forEach(([lab,end,txt],i)=>{const col=i?C.purple:C.coral,pts=[];for(let k=0;k<=20;k++){const u=k/20;pts.push([pl.X(4*u),pl.Y(100+(end-100)*(1-Math.exp(-3*u))/(1-Math.exp(-3)))])}const other=(i?A:B)[1];out+=B6_poly(pts,col,2.6)+TF(pl.X(4)-4,pl.Y(end)+(end>=other?-8:16),lab,13,col,'end')});
  else out+=TF(440,140,'press Join',13,C.muted);
  // results table
  out+=R(14,240,572,90,'#fff',C.grid,8);
  Object.keys(B6_PAIR).forEach((k,i)=>{const q=B6_PAIR[k],r=s.ran[k],y=264+i*24;out+=TBF(30,y,q[0],13,k===s.pair?C.ink:C.muted,'start');
   out+=r===undefined?TF(150,y,'not run yet',13,C.muted,'start'):TF(150,y,`${q[2][0][0]}: ${q[2][0][2]}; ${q[2][1][0]}: ${q[2][1][2]}`,13,C.ink,'start')+TF(574,y,r===B6_PAIR_ANS[k]?'✓ predicted':'✕',13,r===B6_PAIR_ANS[k]?C.green:C.coral,'end')});
  out+=B6_note('Illustrative weights; the outcomes are those Coleman reported. No pictures of the animals.',350);
  const ph=all?'Put together: the ob mouse lacks a blood-borne signal that tells the brain to stop eating, because a normal partner’s blood makes it eat less. The db mouse makes that signal in excess, which is why its partners starve, but cannot respond to it. Coleman predicted a hormone and its receptor; leptin and the leptin receptor were identified in 1994 and 1995.':
   !done?`Before joining them, predict what the ${Pp[1]} mouse will do once it shares blood with its partner.`:
   s.pair==='obwt'?'The ob mouse eats less and gains less weight than it would alone, while its normal partner is unaffected. Something in normal blood, missing in ob mice, restrains eating.':
   s.pair==='dbwt'?'The normal partner stops eating, loses weight and, in Coleman’s experiments, died of starvation, while the db mouse stays obese. The db mouse’s blood carries a strong signal to stop eating, which it ignores itself.':
   'The ob mouse, joined to a db mouse, stops eating as the normal mouse did. The db mouse supplies the signal the ob mouse lacks, in large amounts.';
  return {svg:out,phase:ph};
 }});

// Leptin. Trial (illustrative % weight change over 4 weeks of daily injections): ob mice lose a large amount
// (Halaas et al. 1995; Pelleymounter et al. 1995; Campfield et al. 1995), db mice none, diet-obese mice little.
const B6_LEP={ob:['ob mouse',-30],db:['db mouse',0],dio:['Diet-obese mouse',-5]};
function B6_lepPeople(){const r=B6_rng(4242),out=[];for(let i=0;i<60;i++){const fat=12+r()*38,lep=Math.max(1,(fat-8)*.95*(1+.28*B6_gauss(r)));out.push([fat,lep])}return out}
const B6_LEP_PTS=B6_lepPeople();
const B6_corr=pts=>{const n=pts.length,mx=sum(pts.map(p=>p[0]))/n,my=sum(pts.map(p=>p[1]))/n;let a=0,b=0,c=0;for(const [x,y] of pts){a+=(x-mx)*(y-my);b+=(x-mx)**2;c+=(y-my)**2}return a/Math.sqrt(b*c)};
SCENE({id:'hunger-homeostasis-leptin',name:'Leptin, the signal from fat',tag:'Friedman’s group, 1994',
 definition:'In 1994 Yiying Zhang, Jeffrey Friedman and colleagues cloned the gene that is broken in ob mice. It makes a hormone, released by fat cells in proportion to the amount of fat, which the group soon named leptin. In the arcuate nucleus of the hypothalamus leptin quietens AgRP neurons, which drive eating, and excites POMC neurons, which restrain it. Coleman’s missing signal had been found.',
 example:'Injected leptin made ob mice eat less and lose much of their excess weight; db mice, whose leptin receptor is faulty, did not respond. A few children are born unable to make leptin, and leptin treatment works for them. But most people with obesity have high leptin, in line with their fat mass (Considine and colleagues, 1996), and extra leptin does little: most human obesity is not leptin deficiency.',
 desc:'Left, the feedback loop from fat cells through leptin to the arcuate nucleus and back to eating. Right, either the weight change of mice given daily leptin or salt-water injections, or a scatter of blood leptin against body fat in simulated people.',
 research:['Zhang, Proenca, Maffei, Barone, Leopold & Friedman (1994). Positional cloning of the mouse obese gene and its human homologue. Nature 372, 425–432.','Halaas and others (1995); Pelleymounter and others (1995); Campfield and others (1995), all Science 269 (leptin injections in mice).','Considine and others (1996), New England Journal of Medicine 334, 292–295; Montague and others (1997), Nature 387, 903–908 (congenital leptin deficiency).'],
 dur:12,hint:'Choose a mouse and give it leptin or salt water, then switch to the human view to see why leptin rarely helps. All values are illustrative.',
 init:()=>({view:'trial',sub:'ob',drug:1}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return [{view:'trial',sub:'ob',drug:1},{view:'trial',sub:'db',drug:1},{view:'trial',sub:'dio',drug:1},{view:'people',sub:'ob',drug:1}][k]},
 ui:[{choose:[['trial','Mouse trial'],['people','Leptin in people']],label:'View',get:s=>s.view,act:'view'},{choose:Object.keys(B6_LEP).map(k=>[k,B6_LEP[k][0]]),label:'Mouse',get:s=>s.sub,act:'sub'},{choose:[[1,'Leptin'],[0,'Salt water']],label:'Injection',get:s=>s.drug,act:'drug'}],
 on:{view(s,v){s.view=v==='people'?'people':'trial'},sub(s,v){if(B6_LEP[v]){s.sub=v;s.view='trial'}},drug(s,v){s.drug=+v?1:0;s.view='trial'}},
 draw(s){
  const people=s.view==='people',L0=B6_LEP[s.sub],eff=s.drug?L0[1]:0;
  let out=heading(people?'In most obesity, leptin is high, not low':s.drug?`${L0[0]} on leptin: ${eff?eff+'% in 4 weeks':'no change'}`:`${L0[0]} on salt water`);
  // loop
  out+=R(14,48,256,276,'#fff',C.grid,8)+TBF(142,68,'The leptin loop',13,C.ink);
  out+=box(34,84,98,38,'fat cells',C.amberp,C.amber,14)+box(152,84,98,38,'leptin',C.purplep,C.purple,14)+arrow(132,103,150,103,C.purple,2);
  out+=box(34,176,98,40,'AgRP ↓',C.coralp,C.coral,14)+box(152,176,98,40,'POMC ↑',C.greenp,C.green,14);
  out+=arrow(200,124,200,174,C.purple,2)+arrow(200,124,84,174,C.purple,2);
  out+=box(84,262,116,38,'eating ↓',C.pale,C.ink,14)+arrow(84,218,120,260,C.ink,2)+arrow(200,218,164,260,C.ink,2);
  out+=curveArrow(84,290,40,124,-36,C.muted,1.8)+TF(22,304,'less fat,',13,C.muted,'start')+TF(22,320,'less leptin',13,C.muted,'start')+TF(250,304,'AgRP and POMC cells:',13,C.muted,'end')+TF(250,320,'arcuate nucleus',13,C.muted,'end');
  if(!people&&s.sub==='ob')out+=L(140,84,244,122,C.coral,3)+TF(201,80,'none made',13,C.coral);
  if(!people&&s.sub==='db')out+=L(150,170,250,220,C.coral,3)+TF(200,166,'receptor broken',13,C.coral);
  if(people){
   const pl=B6_plot(316,60,262,200,[0,55],[0,60],{xt:[[0,'0'],[20,'20'],[40,'40'],[55,'55']],yt:[[0,'0'],[30,'30'],[60,'60']],xl:'body fat, % of weight',yl:'blood leptin (relative units)'});out+=pl.svg;
   for(const [x,y] of B6_LEP_PTS)out+=Ci(pl.X(x),pl.Y(Math.min(60,y)),3.4,C.purple,'#fff');
   out+=Ci(pl.X(46),pl.Y(.8),6,C.coral,'#fff')+TF(pl.X(46)-6,pl.Y(.8)-10,'no leptin made',13,C.coral,'end');
   out+=B6_tile(316,306,262,'Correlation in these points','r = '+fmt(Math.round(B6_corr(B6_LEP_PTS)*100)/100),C.purple);
  }else{
   const pl=B6_plot(316,60,262,200,[0,28],[-40,10],{xt:[[0,'0'],[7,'1'],[14,'2'],[21,'3'],[28,'4']],xl:'weeks of injections',xlDy:32,yt:[[-40,'−40'],[-20,'−20'],[0,'0'],[10,'+10']],yl:'weight change, %'});out+=pl.svg;
   out+=L(pl.X(0),pl.Y(0),pl.X(28),pl.Y(0),C.line,1,'stroke-dasharray="3 3"');
   const curve=(e,col,w,dash)=>{const pts=[];for(let d=0;d<=28;d++)pts.push([pl.X(d),pl.Y(e*(1-Math.exp(-d/7))/(1-Math.exp(-4)))]);return B6_poly(pts,col,w,dash)};
   out+=curve(0,C.muted,1.6,'stroke-dasharray="5 4"')+(s.drug?curve(L0[1],C.purple,2.8,''):'');
   out+=TF(pl.X(27),pl.Y(0)-8,'salt water',13,C.muted,'end');
   out+=B6_tile(316,300,262,'After 4 weeks',s.drug?(eff?eff+'% body weight':'no change'):'no change (control)',s.drug&&eff?C.purple:C.ink);
  }
  out+=B6_note('Illustrative values and simulated points. No dietary advice is given or implied.',368);
  const ph=people?'In people, blood leptin rises with body fat: most people with obesity have plenty of it, and their brains respond to it less, which is often called leptin resistance. The red point stands for the rare person who cannot make leptin, for whom leptin treatment works. For everyone else, appetite is set by many signals and circuits, not by one missing hormone.':
   s.sub==='ob'?(s.drug?'The ob mouse makes no leptin, so its brain reads its stores as empty and it eats as if starving. Given leptin, it eats less, burns more and loses much of its excess fat.':'Without leptin the ob mouse goes on eating and gaining. The salt-water injection is the control.'):
   s.sub==='db'?(s.drug?'The db mouse already has high leptin, because its fat is large, but its leptin receptor is faulty. Extra leptin changes nothing: the brain cannot hear it. This is Coleman’s db result explained.':'The db mouse makes plenty of leptin and stays obese.'):
   (s.drug?'A normal mouse made fat by a rich diet already has high leptin. Extra leptin has only a small effect: the system responds less at high levels. This is closer to most human obesity.':'A normal mouse made fat on a rich diet, given salt water, keeps its weight.');
  return {svg:out,phase:ph};
 }});

/* Set point, settling point or dual intervention point: three toy models of weight regulation (Speakman et al. 2011).
   Weight W (% of start) changes weekly: dW/dt = (I − W)/26, where I is intake in the same units.
   Settling point: I = 100·env. Set point: I = 100·env + 4·(100 − W). Dual intervention: I = 100·env, plus 4·(90 − W) below 90
   and 4·(120 − W) above 120. A 20-week restricted period (weeks 52–72) holds intake at 75% of what the model would choose. */
const B6_MODEL={settle:'Settling point',set:'Set point',dual:'Dual intervention'};
function B6_weight(model,env,diet){
 const out=[];let W=100;
 for(let w=0;w<=156;w++){out.push(W);let I=100*env;if(model==='set')I+=4*(100-W);if(model==='dual'){if(W<90)I+=4*(90-W);if(W>120)I+=4*(120-W)}
  if(diet&&w>=52&&w<72)I*=.75;W+=(I-W)/26}
 return out;
}
SCENE({id:'hunger-homeostasis-setpoint',name:'Set point or settling point?',tag:'An open debate',
 definition:'Does the brain defend a particular body weight? On the set-point view it does: weight lost is regained because hunger rises and energy use falls until the target is restored. Leibel, Rosenbaum and Hirsch (1995) found that after weight loss people’s energy expenditure fell by more than the loss of tissue alone would predict. On the settling-point view there is no target: weight drifts to wherever intake and expenditure happen to balance in a given environment.',
 example:'Each view explains some facts and struggles with others. A defended set point fits regain after dieting; a settling point fits the rise in average weights over recent decades, with unchanged genes and a changed food environment. Speakman and colleagues (2011) set out alternatives, such as defence only at an upper and a lower limit. The question is still debated.',
 desc:'Body weight over three years in a toy model, with the food environment set by the learner and an optional period of restricted eating. Three models of regulation can be compared on the same inputs.',
 research:['Leibel, Rosenbaum & Hirsch (1995). Changes in energy expenditure resulting from altered body weight. New England Journal of Medicine 332, 621–628.','Speakman, Levitsky, Allison and others (2011). Set points, settling points and some alternative models: theoretical options to understand how genes and environments combine to regulate body adiposity. Disease Models & Mechanisms 4, 733–745.'],
 dur:14,hint:'Change the food environment and add a period of restricted eating, then compare the three models. These are toy models for comparing ideas; they give no advice and describe no one.',
 init:()=>({model:'set',env:115,diet:1}),
 watch(p){const k=Math.min(5,Math.floor(p*6));return {model:['settle','set','dual'][k%3],env:k<3?115:100,diet:1}},
 ui:[{choose:Object.keys(B6_MODEL).map(k=>[k,B6_MODEL[k]]),label:'Model',get:s=>s.model,act:'model'},{range:'env',label:'Food environment',min:90,max:130,step:5,get:s=>s.env,act:'env',show:v=>v+'%'},{choose:[[1,'With a restricted period'],[0,'No restricted period']],label:'Restriction',get:s=>s.diet,act:'diet'}],
 on:{model(s,v){if(B6_MODEL[v])s.model=v},env(s,v){s.env=clamp(Math.round(+v/5)*5,90,130)},diet(s,v){s.diet=+v?1:0}},
 draw(s){
  const env=s.env/100,W=B6_weight(s.model,env,s.diet),W0=B6_weight(s.model,env,0);
  let out=heading(`${B6_MODEL[s.model]}: ${s.model==='set'?'weight is defended':s.model==='settle'?'weight follows the environment':'defended only at the limits'}`);
  const pl=B6_plot(70,56,510,200,[0,156],[70,130],{xt:[[0,'0'],[52,'1'],[104,'2'],[156,'3']],xl:'years',xlDy:30,yt:[[70,'70'],[100,'100'],[130,'130']],yl:'body weight, % of start'});out+=pl.svg;
  if(s.diet)out+=R(pl.X(52),57,pl.X(72)-pl.X(52),198,C.coralp,'none',0,'opacity=".6"')+TF(pl.X(62),72,'restricted',13,C.coral);
  if(s.model==='dual')out+=L(pl.X(0),pl.Y(90),pl.X(156),pl.Y(90),C.green,1.2,'stroke-dasharray="5 4"')+L(pl.X(0),pl.Y(120),pl.X(156),pl.Y(120),C.green,1.2,'stroke-dasharray="5 4"')+TF(pl.X(154),pl.Y(120)-6,'upper limit',13,C.green,'end')+TF(pl.X(154),pl.Y(90)+16,'lower limit',13,C.green,'end');
  if(s.model==='set')out+=L(pl.X(0),pl.Y(100),pl.X(156),pl.Y(100),C.green,1.2,'stroke-dasharray="5 4"')+TF(pl.X(154),pl.Y(100)+16,'set point',13,C.green,'end');
  if(s.diet)out+=B6_poly(W0.map((v,w)=>[pl.X(w),pl.Y(v)]),C.muted,1.4,'stroke-dasharray="4 4"');
  out+=B6_poly(W.map((v,w)=>[pl.X(w),pl.Y(clamp(v,70,130))]),C.purple,2.8);
  const low=Math.min(...W.slice(52,80)),end=W[156];
  out+=B6_tile(70,300,160,'After 1 year',Math.round(W[52])+'%',C.ink)+B6_tile(244,300,160,'Lowest, restricted',s.diet?Math.round(low)+'%':'—',C.coral)+B6_tile(418,300,162,'After 3 years',Math.round(end)+'%',C.purple);
  out+=B6_note('Toy models for comparing ideas. They give no advice and describe no one.',366);
  const ph=`${s.model==='set'?`With a defended set point, a food environment at ${s.env}% moves weight only to ${Math.round(W[52])}%: appetite pushes back. ${s.diet?`After the restricted period weight returns quickly towards ${Math.round(end)}%.`:''}`:
   s.model==='settle'?`With no target, weight settles wherever intake and expenditure balance: ${Math.round(W[52])}% in a ${s.env}% environment. ${s.diet?`After the restricted period it drifts back to the same level, ${Math.round(end)}%, more slowly. Regain alone does not prove a set point.`:''}`:
   `Between the limits nothing pushes back, so weight follows the environment; only beyond 90% or 120% does appetite resist. ${W[52]>118?`Here the upper limit holds weight near ${Math.round(W[52])}%.`:W[52]<92?`Here the lower limit holds weight near ${Math.round(W[52])}%.`:`After a year it is at ${Math.round(W[52])}%.`} ${s.diet?(low<92?`During the restricted period the loss is resisted near the lower limit; afterwards weight drifts back to ${Math.round(end)}%.`:`The restricted period never takes weight near the lower limit, so the loss meets no resistance; afterwards weight drifts back to ${Math.round(end)}%.`):''}`} Which pattern real bodies follow is still argued over.`;
  return {svg:out,phase:ph};
 }});

