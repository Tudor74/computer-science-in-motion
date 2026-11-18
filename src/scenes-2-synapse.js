/* ===================== Brain In Motion · Era 2 · Synapses ===================== */
// The synapse, quantal release, excitation and inhibition, transmitters, receptors and drugs, neuromodulation.
// Every picture is a pure function of state, frame and X. Sound (clicks, soft tones) plays only from on() handlers.
// Simulated records use seeded generators (B2_rng) and are labelled as simulated, schematic or illustrative.

/* ---- shared helpers ---- */
const B2_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const B2_rng=n=>rng(B2_mix(n));
function B2_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
function B2_pois(r,m){const l=Math.exp(-m);let k=0,p=1;do{k++;p*=r()}while(p>l);return k-1}
const B2_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const B2_r1=v=>Math.round(v*10)/10;
const B2_r2=v=>Math.round(v*100)/100;
const B2_mv=v=>(v<0?'−':v>0?'+':'')+fmt(Math.abs(B2_r1(v)));   // signed millivolts with a true minus sign
const B2_note=(s,y=368)=>TF(300,y,s,13,C.muted);
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function B2_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-7,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// Spike clicks: very short noise bursts at the given times (seconds from now). Call only from on() handlers.
function B2_click(times,gain=.14){times.forEach(t=>AUDIO.noise({dur:.005,gain,at:t}))}
// A synaptic potential of peak size 1 that starts at t=0 (ms): fast rise, exponential decay with time constant td.
function B2_psp(t,td=5,tr=.5){if(t<=0)return 0;const tp=Math.log(td/tr)*td*tr/(td-tr),pk=Math.exp(-tp/td)-Math.exp(-tp/tr);return (Math.exp(-t/td)-Math.exp(-t/tr))/pk}
// A tile with a label and a value (fixed-size text).
function B2_tile(x,y,w,label,value,col=C.blue){return R(x,y,w,46,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+38,value,16,col)}

/* ===================== Lesson: synapse-discovery ===================== */
// Illustrative reflex path: 12 cm of fibre at 60 m/s (2 ms) plus about 0.5 ms at each synapse.
const B2_PATH_CM=12,B2_VEL=60,B2_SYN_MS=.5,B2_COND_MS=B2_PATH_CM/100/B2_VEL*1000;
function B2_chainFrames(s){
 const N=s.n+1,per=B2_COND_MS/N,fr=[];
 if(s.dir!=='back'){let t=0;
  for(let i=0;i<N;i++){t+=per;fr.push({kind:'axon',cell:i,t,say:`The impulse runs along neuron ${i+1}. Fibre conducts fast: ${fmt(B2_r2(per))} ms for this ${fmt(B2_r1(B2_PATH_CM/N))} cm stretch at ${B2_VEL} m/s.`});
   if(i<N-1){t+=B2_SYN_MS;fr.push({kind:'gap',cell:i,t,say:`At the synapse the signal waits about ${B2_SYN_MS} ms before the next cell responds. Sherrington could not see the gap; he inferred it from delays like this.`})}}
  fr.push({kind:'done',cell:N-1,t,say:`Arrival after ${fmt(B2_r2(t))} ms: ${fmt(B2_r1(B2_COND_MS))} ms of fibre plus ${s.n} × ${B2_SYN_MS} ms at ${s.n===1?'the synapse':'synapses'}. The extra ${fmt(B2_r1(s.n*B2_SYN_MS))} ms is what a nerve trunk alone cannot explain.`})}
 if(s.dir!=='fwd'){
  fr.push({kind:'back',cell:N-1,t:per,say:'Now stimulate the far end. A nerve fibre conducts both ways, so the impulse runs backwards along the last neuron to its cell body.'});
  fr.push({kind:'blocked',cell:N-1,t:per,say:'It stops there. The cell body and dendrites receive at a synapse; they have nothing to send back across it. A chain of neurons conducts one way only.'})}
 return fr;
}
SCENE({id:'synapse-discovery',name:'A junction that behaves like a valve',tag:'Sherrington names the synapse, 1897',
 definition:'A synapse is the junction where one neuron passes its signal to another cell. Charles Sherrington introduced the word in 1897, decades before anyone could see the gap. He inferred it from reflexes: they are slower than the length of nerve can explain, and they conduct in one direction only, although a nerve fibre itself conducts both ways.',
 example:`Along ${B2_PATH_CM} cm of fibre at ${B2_VEL} m/s an impulse needs ${fmt(B2_COND_MS)} ms. If the path crosses 2 synapses that each add about ${B2_SYN_MS} ms, it arrives after ${fmt(B2_COND_MS+2*B2_SYN_MS)} ms. Stimulated from the far end, the impulse never crosses at all. (Illustrative numbers.)`,
 desc:'A chain of neurons joined by synapses, an impulse moving along it, and a time bar that separates the time spent in fibre from the time spent waiting at synapses.',
 research:['Foster & Sherrington (1897). A Textbook of Physiology, 7th ed., Part III (the word “synapsis”).','Sherrington (1906). The Integrative Action of the Nervous System (how reflex-arc conduction differs from nerve-trunk conduction).'],
 dur:12,hint:'Choose how many synapses the path crosses and which end to stimulate, then step through. Compare the arrival time with the fibre time alone.',
 init:()=>({n:2,dir:'both'}),
 trace:s=>B2_chainFrames(s),
 ui:[{range:'n',label:'Synapses on the path',min:1,max:3,get:s=>s.n,act:'n'},{choose:[['both','Both ends in turn'],['fwd','Sensory end'],['back','Motor end']],label:'Stimulate',get:s=>s.dir,act:'dir'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),1,3)},dir(s,v){s.dir=['both','fwd','back'].includes(v)?v:'both'}},
 draw(s,f,X){
  const N=s.n+1,sp=500/N,y=118,u=X?X.u:1,sx=i=>50+i*sp+16,tx=i=>50+(i+1)*sp-14;
  let out=heading(f.kind==='blocked'?'Backwards, the signal cannot cross':f.kind==='back'?'Stimulating the motor end':f.kind==='done'?`Arrives after ${fmt(B2_r2(f.t))} ms`:'Fast in the fibre, a pause at each synapse');
  for(let i=0;i<N;i++){
   out+=L(sx(i)+14,y,tx(i),y,C.blue,4)+Ci(sx(i),y,15,C.pale,C.blue)+Ci(tx(i),y,6,C.blue);
   for(const a of [-2.4,-3.1,3.1,2.4])out+=L(sx(i)+13*Math.cos(a),y+13*Math.sin(a),sx(i)+24*Math.cos(a),y+24*Math.sin(a),C.blue,2.5);
   out+=TF(sx(i)+(tx(i)-sx(i))/2,y+44,i===0?'sensory neuron':i===N-1?'motor neuron':'interneuron',13,C.muted);
   if(i<N-1)out+=TF(tx(i)+12,y-26,'synapse',13,C.coral);
  }
  // the impulse
  let px=sx(0),col=C.coral;
  if(f.kind==='axon')px=lerp(sx(f.cell),tx(f.cell),u);else if(f.kind==='gap')px=tx(f.cell)+lerp(0,22,u);else if(f.kind==='done')px=tx(N-1);
  else if(f.kind==='back')px=lerp(tx(N-1),sx(N-1),u);else if(f.kind==='blocked'){px=sx(N-1);out+=TB(sx(N-1)-34,y-34,'✕',22,C.coral)+TF(sx(N-1)-34,y-58,'no crossing',13,C.coral)}
  out+=Ci(px,y,9,col,'#fff');
  // time bar
  const bx=70,bw=460,by=232,tmax=4,TX=t=>bx+t/tmax*bw,per=B2_COND_MS/N;
  out+=TF(bx,by-12,'time since the stimulus (ms)',13,C.muted,'start');
  let t=0;
  if(f.kind!=='back'&&f.kind!=='blocked'){
   for(let i=0;i<N;i++){out+=R(TX(t),by,TX(t+per)-TX(t),22,t+per<=f.t+1e-9?C.blue:C.pale,'none',3);t+=per;if(i<N-1){out+=R(TX(t),by,TX(t+B2_SYN_MS)-TX(t),22,t+B2_SYN_MS<=f.t+1e-9?C.coral:C.coralp,'none',3);t+=B2_SYN_MS}}
  }else out+=R(TX(0),by,TX(per)-TX(0),22,C.blue,'none',3)+TF(TX(per)+10,by+16,'then nothing: the impulse dies at the cell body',13,C.coral,'start');
  for(const v of [0,1,2,3,4])out+=L(TX(v),by+22,TX(v),by+28,C.line,1.4)+TF(TX(v),by+42,v,13,C.muted);
  out+=R(70,292,12,12,C.blue,'none',2)+TF(88,303,'in fibre',13,C.ink,'start')+R(170,292,12,12,C.coral,'none',2)+TF(188,303,'waiting at a synapse',13,C.ink,'start');
  out+=B2_tile(70,318,140,'Fibre alone',fmt(B2_r1(B2_COND_MS))+' ms')+B2_tile(230,318,140,'Synaptic delay',`${s.n} × ${B2_SYN_MS} = ${fmt(B2_r1(s.n*B2_SYN_MS))} ms`,C.coral)+B2_tile(390,318,140,'Whole path',fmt(B2_r1(B2_COND_MS+s.n*B2_SYN_MS))+' ms',C.ink);
  return {svg:out,phase:f.say};
 }});

// Loewi's two hearts as a drum record. Rates are relative to the resting rate (illustrative: 40 beats a minute).
const B2_LW_LABEL={rest:'rest',stim:'vagus',move:'1 → 2',wash:'fresh',atr:'atropine',noatr:'no atr.'};
function B2_loewiStep(s,act){
 let r1=s.vs?.75:1,r2=s.r2,vs=s.vs,atr=s.atr,a=act;
 if(act==='stim'){r1=.45;vs=1}
 else if(act==='move'){if(vs&&!atr)r2=.5;r1=1;vs=0}
 else if(act==='wash'){r1=1;r2=1;vs=0}
 else if(act==='atr'){atr=atr?0:1;a=atr?'atr':'noatr';if(atr)r2=1}
 const segs=s.segs.concat([{a,r1,r2}]);while(segs.length>7)segs.shift();
 return {segs,vs,atr,r2,last:act,got:act==='move'?(s.vs?(s.atr?'blocked':'slowed'):'none'):''};
}
const B2_loewiInit=()=>({segs:[{a:'rest',r1:1,r2:1}],vs:0,atr:0,r2:1,last:'',got:''});
const B2_LW_WATCH=['move','stim','move','wash','atr','stim','move'];
SCENE({id:'synapse-discovery-loewi',name:'Loewi’s two frog hearts',tag:'A chemical carries the message, 1921',
 definition:'In 1921 Otto Loewi kept two frog hearts beating in salt solution. He stimulated the vagus nerve of the first, which slowed it, then moved fluid from that heart to the second, which had no nerve. The second heart slowed too. The nerve must have released a chemical. Loewi called it Vagusstoff; it was later identified as acetylcholine.',
 example:'Fluid taken before stimulation does nothing to the second heart, which is the control. Fluid taken during stimulation slows it. With atropine on the second heart, the same fluid has no effect: atropine blocks the action of the substance, not its release.',
 desc:'Two frog hearts in beakers, the first with its vagus nerve, a pipette moving fluid from the first to the second, and a drum record of both heartbeats that grows with each action.',
 research:['Loewi (1921). Über humorale Übertragbarkeit der Herznervenwirkung. Pflügers Archiv 189, 239–242.','Loewi & Navratil (1926), Pflügers Archiv 214: the substance behaves as acetylcholine. Nobel Prize 1936, Loewi and Dale. Loewi said the design came to him in a dream; that is his own later account.'],
 dur:14,hint:'First move fluid without stimulating (the control). Then stimulate the vagus and move fluid again. Try it once more with atropine on heart 2. The sound button plays heart 2 as soft beats.',
 init:B2_loewiInit,
 watch(p){let s=B2_loewiInit();const k=Math.min(B2_LW_WATCH.length,Math.floor(p*(B2_LW_WATCH.length+1)));for(let i=0;i<k;i++)s={...s,...B2_loewiStep(s,B2_LW_WATCH[i])};return s},
 ui:[{b:'Stimulate the vagus of heart 1',act:'stim'},{b:'Move fluid from 1 to 2',act:'move'},{b:'Fresh fluid for both',act:'wash'},{b:'Atropine on heart 2: on/off',act:'atr'},{b:'Hear heart 2 ▶',act:'hear'},{b:'Start again',act:'reset'}],
 on:{stim(s){Object.assign(s,B2_loewiStep(s,'stim'))},move(s){Object.assign(s,B2_loewiStep(s,'move'))},wash(s){Object.assign(s,B2_loewiStep(s,'wash'))},atr(s){Object.assign(s,B2_loewiStep(s,'atr'))},reset(s){Object.assign(s,B2_loewiInit())},
  hear(s){const gap=60/(40*s.r2);for(let i=0;i<Math.floor(4.5/gap);i++){AUDIO.tone(70,{dur:.11,gain:.14,at:i*gap,attack:.01,release:.08});AUDIO.tone(55,{dur:.09,gain:.09,at:i*gap+.16,attack:.01,release:.06})}return 'keep'}},
 draw(s){
  const cur=s.segs[s.segs.length-1];
  let out=heading(s.got==='slowed'?'Heart 2 slows: the fluid carried the message':s.got==='none'?'Control: fluid from an unstimulated heart does nothing':s.got==='blocked'?'Atropine on heart 2 blocks the effect':s.last==='stim'?'The vagus slows heart 1':'Two hearts, one nerve');
  const heart=(x,y,r,lab)=>`<path d="M${x} ${y+16}C${x-26} ${y-4} ${x-18} ${y-24} ${x} ${y-10}C${x+18} ${y-24} ${x+26} ${y-4} ${x} ${y+16}Z" fill="${C.coralp}" stroke="${C.coral}" stroke-width="2.5"/>`+TF(x,y+50,lab,13,C.muted);
  const beaker=(x,y,tint)=>R(x,y,96,74,tint?C.purplep:'#eef6fb',C.line,10);
  out+=beaker(26,60,s.vs)+heart(74,96,cur.r1,'heart 1')+beaker(26,214,s.r2<1)+heart(74,250,cur.r2,'heart 2');
  out+=P('M150 48C132 52 112 62 92 82',C.amber,3)+TF(152,44,'vagus nerve',13,C.amber,'start');
  if(s.last==='stim')out+=TB(128,78,'⚡',17,C.amber);
  out+=curveArrow(132,128,132,214,-26,s.last==='move'?C.purple:C.line,s.last==='move'?3:2)+TF(166,176,'fluid',13,s.last==='move'?C.purple:C.muted,'start');
  if(s.vs)out+=TF(74,152,'holds Vagusstoff',13,C.purple);
  if(s.atr)out+=TF(74,306,'atropine added',13,C.green);
  // drum record
  const x0=222,w=50,rows=[[92,'r1','Heart 1'],[226,'r2','Heart 2']];
  out+=R(x0-6,48,362,286,'#fff',C.grid,8);
  for(const [yb,key,lab] of rows){
   out+=TBF(x0,yb-52,lab,13,C.ink,'start')+L(x0,yb,x0+350,yb,C.grid,1.2);
   s.segs.forEach((g,i)=>{const r=g[key],nb=Math.max(1,Math.round(8*r)),amp=r<.6?24:r<1?32:40,xa=x0+i*w,pts=[];
    for(let b=0;b<nb;b++){const xb=xa+(b+.1)*w/nb,ww=w/nb;pts.push([xb,yb],[xb+Math.min(3,ww*.3),yb-amp],[xb+Math.min(9,ww*.7),yb])}
    pts.push([xa+w,yb]);out+=B2_poly(pts,r<1?C.coral:C.blue,1.8)});
   const r=cur[key];out+=TBF(x0+350,yb-52,`${Math.round(40*r)} beats a minute`,13,r<1?C.coral:C.blue,'end');
  }
  s.segs.forEach((g,i)=>{out+=L(x0+i*w,150,x0+i*w,162,C.line,1.2)+TF(x0+i*w+w/2,165,B2_LW_LABEL[g.a],13,g.a==='stim'?C.amber:g.a==='move'?C.purple:C.muted)});
  out+=TF(x0+175,262,'time →  each block is one action',13,C.muted);
  out+=TF(x0+175,296,s.atr?'Atropine is on heart 2.':'Rates are illustrative; the pattern is Loewi’s.',13,s.atr?C.green:C.muted)+TF(x0+175,318,'Slower beats are also weaker, as on his records.',13,C.muted);
  out+=B2_note('Frog hearts, removed from the animals and kept beating in salt solution.',358);
  const ph=s.got==='slowed'?'Heart 2 has no nerve, yet it slows as if its own vagus had been stimulated. Only the fluid passed between them, so the nerve acts by releasing a substance. Loewi named it Vagusstoff.':
   s.got==='none'?'Nothing happens: plain fluid from a resting heart carries no message. This control shows that the later effect comes from the stimulated nerve and not from moving fluid about.':
   s.got==='blocked'?'The fluid still carries the substance, but atropine occupies the heart’s receptors for it, so heart 2 beats on unchanged. The same drug blocks the vagus itself.':
   s.last==='stim'?'Stimulating the vagus slows and weakens heart 1. The fluid around it now holds whatever the nerve endings released. Move it to heart 2 before it is broken down.':
   s.last==='wash'?'Both hearts are in fresh fluid and beat at the resting rate again.':s.last==='atr'?(s.atr?'Atropine is now on heart 2. Stimulate heart 1 again and move the fluid across.':'The atropine has been washed off heart 2.'):'Heart 1 keeps its vagus nerve; heart 2 has none. Fluid can be moved from the first to the second.';
  return {svg:out,phase:ph};
 }});

SCENE({id:'synapse-discovery-soup',name:'Soup against sparks',tag:'Eccles tests his own theory, 1951',
 definition:'For thirty years after Loewi, physiologists argued over synapses in the brain and spinal cord. The “soup” side (Dale and others) held that transmission was chemical there too. The “sparks” side, led by John Eccles, held that it was too fast for chemistry and must be electrical. In 1951 Eccles’s group put a fine glass electrode inside motor neurons of anaesthetised cats and tested a prediction of his own theory.',
 example:'An excitatory input pushed the inside of the cell positive, which both theories allowed. An inhibitory input pushed it more negative. Eccles’s electrical account predicted a change in the opposite direction, so he gave it up and became a leading advocate of chemical transmission.',
 desc:'Three panels: what the electrical theory predicts, what the chemical theory allows, and the potential recorded inside the motor neuron, for an excitatory or an inhibitory input. A date line below marks the main steps of the argument.',
 research:['Brock, Coombs & Eccles (1952). The recording of potentials from motoneurones with an intracellular electrode. Journal of Physiology 117, 431–460.','Dale, Feldberg & Vogt (1936). Release of acetylcholine at voluntary motor nerve endings. Journal of Physiology 86, 353–380.'],
 dur:11,hint:'Choose which nerve to stimulate, then record from inside the motor neuron and compare the trace with each theory’s prediction.',
 init:()=>({inp:'inh',rec:{exc:0,inh:0},prog:1}),
 watch(p){const inh=p>=.5,u=inh?(p-.5)*2:p*2;return {inp:inh?'inh':'exc',rec:{exc:1,inh:inh?1:0,[inh?'inh':'exc']:u>.25?1:0},prog:clamp((u-.25)/.45,0,1)}},
 ui:[{choose:[['exc','Excitatory nerve'],['inh','Inhibitory nerve']],label:'Stimulate',get:s=>s.inp,act:'inp'},{b:'Record inside the motor neuron',act:'rec'}],
 on:{inp(s,v){s.inp=v==='exc'?'exc':'inh'},rec(s){s.rec[s.inp]=1;B2_click([0],.1)}},
 draw(s){
  const inh=s.inp==='inh',done=!!s.rec[s.inp];
  let out=heading(!done?'What should the electrode show?':inh?'Inhibition makes the inside more negative':'Excitation makes the inside less negative');
  const panel=(x,title,sub,up,show,col,dash,prog=1)=>{let o=R(x,52,176,160,'#fff',C.grid,8)+TBF(x+88,72,title,14,C.ink)+TF(x+88,90,sub,13,C.muted)+L(x+14,150,x+162,150,C.grid,1.2)+TF(x+16,205,'−70 mV',13,C.muted,'start');
   if(show){const pts=[];const n=Math.round(60*prog);for(let i=0;i<=n;i++){const t=i/60*20;pts.push([x+14+i/60*148,150-up*B2_psp(t-4,5,.6)])}o+=B2_poly(pts,col,2.6,dash?'stroke-dasharray="5 4"':'')}
   else o+=TF(x+88,140,'press Record',13,C.muted);return o};
  out+=panel(18,'“Sparks” predicts','electrical theory',34,true,C.amber,true);
  out+=panel(212,'“Soup” allows','chemical theory',inh?-22:34,true,C.purple,true);
  out+=panel(406,'Recorded','inside the cell',inh?-22:34,done,inh?C.coral:C.green,false,s.prog);
  if(done&&inh)out+=TB(106,190,'✕ wrong direction',13,C.coral)+TB(300,190,'✓ fits',13,C.green);
  if(done&&!inh)out+=TF(106,190,'fits',13,C.muted)+TF(300,190,'fits',13,C.muted);
  out+=T(300,238,!done?'Stimulate, then record.':inh?'Only a chemical that opens its own channels explains a downward step.':'Both theories fit, so excitation alone could not settle it.',14,done&&inh?C.coral:C.ink);
  // date line
  const ev=[[1921,'Loewi:','two frog hearts'],[1936,'Dale’s group:','nerve to muscle'],[1951,'Eccles records','inside neurons'],[1955,'Microscopes','show the cleft']];
  out+=L(40,278,560,278,C.line,2);
  ev.forEach((e,i)=>{const x=90+i*140;out+=Ci(x,278,6,e[0]===1951?C.coral:C.blue)+TBF(x,304,e[0],14,e[0]===1951?C.coral:C.ink)+TF(x,322,e[1],13,C.muted)+TF(x,338,e[2],13,C.muted)});
  out+=B2_note('Traces are schematic. Upward means less negative inside the cell.',362);
  return {svg:out,phase:!done?(inh?'An inhibitory nerve makes the motor neuron less likely to fire. Eccles’s electrical account and the chemical account disagree about what an electrode inside the cell should see.':'An excitatory nerve brings the motor neuron towards firing. Both accounts expect the inside to become less negative.'):
   inh?'The inside went a few millivolts more negative: an inhibitory postsynaptic potential. Brock, Coombs and Eccles wrote that this was the opposite of what the electrical hypothesis predicted. Eccles had set his theory up to be tested, and he accepted the result.':'The inside became a few millivolts less negative: an excitatory postsynaptic potential. This fitted either theory. The decisive record came from the inhibitory nerve.'};
 }});

SCENE({id:'synapse-discovery-electrical',name:'Electrical synapses exist too',tag:'Both sides were partly right',
 definition:'Most synapses are chemical: a cleft about 20 nanometres wide, crossed by a transmitter, with a short delay and one direction of travel. A minority are electrical: at a gap junction the two membranes lie about 3 nanometres apart and channels join the cells, so current passes straight through with almost no delay, usually in both directions.',
 example:'Furshpan and Potter found the first electrical synapse in the crayfish in 1959. That one passed current mainly one way; most gap junctions pass it both ways. In the mammalian brain they link, among others, groups of inhibitory interneurons and help them fire together.',
 desc:'Two cells joined by either a chemical synapse or a gap junction, voltage traces from both cells after one of them is stimulated, and a table comparing gap width, delay and direction.',
 research:['Furshpan & Potter (1959). Transmission at the giant motor synapses of the crayfish. Journal of Physiology 145, 289–325.','De Robertis & Bennett (1955); Palay & Palade (1955). Journal of Biophysical and Biochemical Cytology 1: electron micrographs of the cleft and synaptic vesicles.','Galarreta & Hestrin (1999); Gibson, Beierlein & Connors (1999). Nature 402: electrical synapses between cortical interneurons.'],
 dur:12,hint:'Switch between the two kinds of synapse and stimulate either cell. Watch the delay in the other cell’s trace and whether the signal passes at all.',
 init:()=>({type:'chem',from:'A'}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {type:k<2?'chem':'elec',from:k%2?'B':'A'}},
 ui:[{choose:[['chem','Chemical synapse'],['elec','Electrical synapse']],label:'Kind',get:s=>s.type,act:'type'},{choose:[['A','Stimulate cell A'],['B','Stimulate cell B']],label:'Stimulate',get:s=>s.from,act:'from'}],
 on:{type(s,v){s.type=v==='elec'?'elec':'chem'},from(s,v){s.from=v==='B'?'B':'A'}},
 draw(s){
  const ch=s.type==='chem',fa=s.from==='A',pass=ch?fa:true;
  let out=heading(ch?(fa?'Chemical: A reaches B after a delay':'Chemical: nothing passes from B to A'):'Electrical: current passes at once, either way');
  // the junction
  out+=R(18,50,264,176,'#fff',C.grid,8);
  if(ch){
   out+=P('M30 100C80 100 96 84 128 84C150 84 156 110 156 138C156 166 150 192 128 192C96 192 80 176 30 176',C.blue,3,C.pale);
   for(const [vx,vy] of [[112,112],[132,136],[112,162],[92,138],[136,106],[136,168]])out+=Ci(vx,vy,8,'#fff',C.purple);
   out+=P('M270 84C200 84 176 96 176 138C176 180 200 192 270 192',C.green,3,C.greenp);
   for(const ry of [112,138,164])out+=R(170,ry-6,10,12,C.green,'none',2);
   out+=TF(166,70,'cleft: about 20 nm',13,C.coral)+TF(84,216,'A: vesicles',13,C.blue)+TF(226,216,'B: receptors',13,C.green);
   if(fa)for(const dy of [-22,0,22])out+=Ci(163,138+dy,3,C.purple);
  }else{
   out+=P('M30 96C90 96 110 90 147 90L147 186C110 186 90 180 30 180',C.blue,3,C.pale)+P('M270 96C210 96 190 90 153 90L153 186C190 186 210 180 270 180',C.green,3,C.greenp);
   for(const gy of [112,138,164])out+=R(141,gy-7,18,14,'#fff',C.amber,3)+arrow(fa?128:172,gy,fa?172:128,gy,C.amber,2,6);
   out+=TF(150,70,'gap: about 3 nm, bridged by channels',13,C.coral)+TF(84,216,'cell A',13,C.blue)+TF(226,216,'cell B',13,C.green);
  }
  // traces
  const tr=(yb,lab,col,fn)=>{let o=TBF(302,yb-44,lab,13,col,'start')+L(300,yb,580,yb,C.grid,1.2);const pts=[];for(let i=0;i<=140;i++){const t=i/140*4;pts.push([300+i*2,yb-fn(t)])}return o+B2_poly(pts,col,2.4)};
  const spike=t=>t<1?0:t<1.25?46*(t-1)/.25:t<1.7?46*(1-(t-1.25)/.45*1.15):-7*Math.exp(-(t-1.7)/.6);
  const post=t=>!pass?0:ch?16*B2_psp(t-1.5,1.6,.25):.35*Math.max(0,spike(t-.03))+(.35*Math.min(0,spike(t-.03)));
  out+=tr(110,fa?'Cell A: stimulated, fires':'Cell A',C.blue,fa?spike:post)+tr(200,fa?'Cell B':'Cell B: stimulated, fires',C.green,fa?post:spike);
  for(const v of [0,1,2,3,4])out+=TF(300+v*70,222,v+(v===4?' ms':''),13,C.muted);
  if(pass&&ch)out+=L(370,214,405,214,C.coral,3)+TF(388,244,'delay about 0.5 ms',13,C.coral);
  if(!pass)out+=TF(440,(fa?200:110)-14,'no response',13,C.coral);
  // table
  const rows=[['Gap between cells','about 20 nm','about 3 nm'],['Delay','about 0.5 ms','almost none'],['Direction','one way','usually both ways']];
  out+=R(18,256,564,100,'#fff',C.grid,8)+R(ch?218:400,260,178,92,ch?C.purplep:C.amberp,'none',6);
  out+=TBF(307,277,'Chemical',13,C.purple)+TBF(489,277,'Electrical',13,C.amber);
  rows.forEach((r,i)=>{const y=299+i*22;out+=TF(30,y,r[0],13,C.muted,'start')+TF(307,y,r[1],13,C.ink)+TF(489,y,r[2],13,C.ink)});
  return {svg:out,phase:ch?(fa?'A’s impulse releases transmitter, which crosses the cleft and opens receptors on B. That takes about half a millisecond, and B’s response is a new, graded potential, not a copy of the spike.':'B has receptors facing the cleft but no vesicles to release, so its impulse changes nothing in A. This is Sherrington’s one-way valve.'):
   `Current flows through the joining channels from ${fa?'A to B':'B to A'} as the spike happens, so the other cell follows without a measurable pause, as a smaller copy. Electrical synapses are fast and good at keeping cells in step, but they cannot turn excitation into inhibition or amplify a signal as chemical ones can.`};
 }});

/* ===================== Lesson: quantal-release ===================== */
// One quantum is drawn as 0.4 mV (sd 0.05 mV between quanta), with 0.03 mV of recording noise. Simulated.
const B2_Q=.4,B2_QSD=.05,B2_NOISE=.03;
const B2_DRUG={none:[1,'No drug'],cur:[.35,'A little curare'],neo:[1.6,'Neostigmine']};
// Spontaneous miniature potentials in a 10 s strip: random (Poisson) times at about 1 a second.
function B2_minis(seed,drug){const r=B2_rng(seed*97+5),k=B2_DRUG[drug][0],out=[];let t=-Math.log(Math.max(1e-9,r()));
 while(t<10){out.push({t,a:Math.max(.03,(B2_Q+.08*B2_gauss(r))*k)});t+=-Math.log(Math.max(1e-9,r()))}return out}
SCENE({id:'quantal-release',name:'Miniature potentials',tag:'Fatt and Katz, 1952',
 definition:'In 1952 Paul Fatt and Bernard Katz, recording at the junction between a frog’s nerve and muscle, found small blips of about half a millivolt that appeared at random even when the nerve was silent. Each looked like a tiny copy of the response to a nerve impulse, about a hundredth of its size. Curare shrank them, and a drug that protects acetylcholine from its enzyme enlarged them, so each blip was a small packet of acetylcholine reaching the muscle.',
 example:'In 10 seconds you might count about 10 blips, but the gaps between them are irregular: two close together, then a long wait. Their sizes cluster around one value, here 0.4 mV. That unit size is the clue the next scene uses.',
 desc:'A 10-second voltage record from a resting muscle fibre with small blips at random times, a histogram of blip sizes with a single hump, and counts of how many were seen and how far apart.',
 research:['Fatt & Katz (1952). Spontaneous subthreshold activity at motor nerve endings. Journal of Physiology 117, 109–128.','Katz (1969). The Release of Neural Transmitter Substances. Liverpool University Press. (Nobel Prize 1970, with von Euler and Axelrod.)'],
 dur:10,hint:'Record more strips to fill the histogram, add a drug to see the blips shrink or grow, and play a strip to hear each blip as a soft click. The data are simulated.',
 init:()=>({seed:3,drug:'none',strips:1}),
 ui:[{b:'Record another 10 s',act:'more'},{choose:[['none','No drug'],['cur','A little curare'],['neo','Neostigmine']],label:'In the bath',get:s=>s.drug,act:'drug'},{b:'Hear this strip ▶',act:'hear'},{b:'Clear',act:'clear'}],
 on:{more(s){s.strips=Math.min(30,s.strips+1)},drug(s,v){s.drug=B2_DRUG[v]?v:'none';s.strips=1},clear(s){s.strips=1;s.seed+=31},
  hear(s){B2_click(B2_minis(s.seed+s.strips-1,s.drug).map(m=>m.t/2),.12);return 'keep'}},
 draw(s,f,X){
  const show=X&&!X.try?10*X.p:10,strip=B2_minis(s.seed+s.strips-1,s.drug).filter(m=>m.t<=show);
  let all=[];for(let i=0;i<s.strips-1;i++)all=all.concat(B2_minis(s.seed+i,s.drug));all=all.concat(strip);
  let out=heading(s.drug==='cur'?'Curare shrinks every blip':s.drug==='neo'?'With the enzyme blocked, blips grow':'A resting junction is not silent');
  // strip
  const x0=50,w=510,yb=118,sc=60,TX=t=>x0+t/10*w;out+=R(x0-8,50,w+16,92,'#fff',C.grid,6);
  const r=B2_rng(s.seed*13+s.strips),pts=[];let mi=0;
  for(let i=0;i<=255;i++){const t=i/255*show;let v=.012*B2_gauss(r);pts.push([TX(t),yb-v*sc])}
  out+=B2_poly(pts,C.muted,1.2);
  for(const m of strip){const x=TX(m.t);out+=P(`M${fmt(x)} ${yb}L${fmt(x+1)} ${fmt(yb-m.a*sc)}L${fmt(x+5)} ${yb}`,C.blue,2);mi++}
  out+=L(x0-2,yb,x0-2,yb-sc,C.ink,2)+TF(x0+4,yb-sc+6,'1 mV',13,C.ink,'start');
  for(const v of [0,2,4,6,8,10])out+=TF(TX(v),158,v+(v===10?' s':''),13,C.muted);
  // histogram of sizes
  const pl=B2_plot(60,186,270,130,[0,1.2],[0,1],{xt:[[0,'0'],[.4,'0.4'],[.8,'0.8'],[1.2,'1.2']],xl:'size of each blip (mV)'});out+=pl.svg;
  const bins=new Array(12).fill(0);for(const m of all)bins[clamp(Math.floor(m.a/.1),0,11)]++;const mx=Math.max(4,...bins);
  bins.forEach((c,i)=>{if(c)out+=R(pl.X(i*.1)+1,pl.Y(c/mx),270/12-2,pl.Y(0)-pl.Y(c/mx),C.blue,'none',2)});
  out+=TF(60,180,'how many',13,C.muted,'start');
  const n=all.length,mean=n?sum(all.map(m=>m.a))/n:0,span=(s.strips-1)*10+show;
  out+=B2_tile(360,180,210,'Blips counted',String(n))+B2_tile(360,232,210,'Mean size',n?fmt(B2_r2(mean))+' mV':'none yet')+B2_tile(360,284,210,'Mean gap between blips',n?fmt(B2_r1(span/n))+' s':'none yet');
  out+=B2_note('Simulated record. On this slow time base each blip, a few milliseconds long, looks like a tick.',364);
  return {svg:out,phase:s.drug==='cur'?'Curare blocks some of the muscle’s acetylcholine receptors, so every blip is smaller and many sink into the noise. They still come at the same random times: the nerve ending is releasing as before.':
   s.drug==='neo'?'Neostigmine stops the enzyme that destroys acetylcholine, so each packet acts on more receptors for longer and every blip is larger. Fatt and Katz used this pair of tests to show the blips were made by acetylcholine.':
   `${n} blips so far, at random moments, with sizes clustered near ${n?fmt(B2_r2(mean)):'0.4'} mV. Fatt and Katz called them miniature end-plate potentials. Something at the nerve ending lets out acetylcholine in small, similar packets, even at rest.`};
 }});

// Evoked responses in low calcium: the number of quanta per impulse is Poisson with mean m.
const B2_mOf=ca=>150*Math.pow(ca/100,4);
const B2_EPP_CACHE={};
function B2_epps(ca,seed,N){const key=ca+':'+seed;let c=B2_EPP_CACHE[key];if(!c||c.length<N){const r=B2_rng(seed*1009+ca),m=B2_mOf(ca);c=[];for(let i=0;i<Math.max(N,500);i++){const k=B2_pois(r,m);let a=B2_NOISE*B2_gauss(r);for(let j=0;j<k;j++)a+=B2_Q+B2_QSD*B2_gauss(r);c.push(a)}B2_EPP_CACHE[key]=c}return c.slice(0,N)}
const B2_fact=k=>k<2?1:k*B2_fact(k-1);
function B2_eppDensity(x,m){let d=0;for(let k=0;k<=14;k++){const sd=Math.sqrt(k*B2_QSD*B2_QSD+B2_NOISE*B2_NOISE);d+=Math.exp(-m)*Math.pow(m,k)/B2_fact(k)*Math.exp(-.5*Math.pow((x-k*B2_Q)/sd,2))/(sd*Math.sqrt(2*Math.PI))}return d}
SCENE({id:'quantal-release-calcium',name:'Responses come in whole packets',tag:'Del Castillo and Katz, 1954',
 definition:'José del Castillo and Bernard Katz lowered the calcium around the junction until a nerve impulse released very little. The response then jumped about from trial to trial: nothing, one unit, two units, three. The unit was the size of one spontaneous blip. A normal response is a few hundred of these packets, or quanta, released together.',
 example:'If the average is m quanta per impulse and release is by chance, the fraction of impulses that release nothing should be e^(−m). Boyd and Martin (1956) checked this in cat muscle: with m = 2.33 over 198 trials the prediction was 19 failures, and they saw 18.',
 desc:'A histogram of response sizes from many nerve impulses in low calcium, with separate peaks at 0, 1, 2 and 3 quanta, the Poisson prediction drawn over it, and a comparison of two ways of estimating the mean number of quanta.',
 research:['del Castillo & Katz (1954). Quantal components of the end-plate potential. Journal of Physiology 124, 560–573.','Boyd & Martin (1956). The end-plate potential in mammalian muscle. Journal of Physiology 132, 74–91.','Dodge & Rahamimoff (1967). Co-operative action of calcium ions in transmitter release at the neuromuscular junction. Journal of Physiology 193, 419–432.'],
 dur:12,hint:'Set the calcium, then stimulate the nerve in batches of 50. Look for the peaks, and compare the two estimates of m: one from the sizes, one from the failures alone.',
 init:()=>({ca:30,N:100,seed:7}),
 watch(p){return {ca:30,N:Math.round(400*smooth(p)),seed:7}},
 ui:[{range:'ca',label:'Calcium in the bath',min:20,max:45,get:s=>s.ca,act:'ca',show:v=>v+'% of normal'},{b:'Stimulate 50 times',act:'more'},{b:'Clear',act:'clear'}],
 on:{ca(s,v){s.ca=clamp(Math.round(+v),20,45)},more(s){s.N=Math.min(500,s.N+50)},clear(s){s.N=0;s.seed+=13}},
 draw(s){
  const d=B2_epps(s.ca,s.seed,s.N),N=d.length,m=B2_mOf(s.ca),bw=.05,nb=48;
  const bins=new Array(nb).fill(0);for(const a of d)bins[clamp(Math.floor(Math.max(0,a)/bw),0,nb-1)]++;
  const fails=d.filter(a=>a<.15).length,mean=N?sum(d)/N:0,m1=mean/B2_Q,m2=N&&fails?Math.log(N/fails):NaN;
  let out=heading(N?`Peaks at whole numbers of quanta · about ${fmt(B2_r1(m))} per impulse`:'Stimulate the nerve to collect responses');
  const mx=Math.max(6,...bins,N*bw*B2_eppDensity(B2_Q*Math.max(1,Math.floor(m)),m)*1.05);
  const pl=B2_plot(50,56,336,236,[0,2.4],[0,mx],{xt:range(7).map(k=>[k*B2_Q,String(k)]),xl:'size of the response, in quanta (1 quantum = 0.4 mV)'});out+=pl.svg;
  bins.forEach((c,i)=>{if(c)out+=R(pl.X(i*bw)+.5,pl.Y(c),6,pl.Y(0)-pl.Y(c),i<3?C.coral:C.blue,'none',1)});
  if(N){const pts=[];for(let i=0;i<=240;i++){const x=i/240*2.4;pts.push([pl.X(x),Math.max(56,pl.Y(N*bw*B2_eppDensity(x,m)))])}out+=B2_poly(pts,C.ink,1.6)}
  out+=TF(56,50,'trials',13,C.muted,'start')+TF(380,74,'bars: your trials',13,C.blue,'end')+TF(380,92,'line: chance (Poisson)',13,C.ink,'end')+TF(380,110,'red: failures',13,C.coral,'end');
  out+=B2_tile(404,50,180,'Impulses',String(N),C.ink)+B2_tile(404,102,180,'m from sizes',N?fmt(B2_r2(m1)):'none yet')+B2_tile(404,154,180,'m from failures',N?(fails?fmt(B2_r2(m2)):'no failures'):'none yet',C.coral)+B2_tile(404,206,180,'Failures: seen · predicted',N?`${fails} · ${fmt(B2_r1(N*Math.exp(-m1)))}`:'none yet',C.coral);
  out+=R(404,262,180,74,C.amberp,'none',8)+TBF(494,281,'Published, cat muscle',13,C.amber)+TF(494,299,'198 trials, m = 2.33',13,C.ink)+TF(494,315,'failures: 18 seen,',13,C.ink)+TF(494,331,'19 predicted',13,C.ink);
  out+=B2_note('Simulated trials. Release is set to rise as the fourth power of calcium (Dodge & Rahamimoff).',364);
  return {svg:out,phase:!N?'No responses yet. Each press sends 50 nerve impulses and measures the response to each.':
   `With calcium at ${s.ca}% an impulse releases ${fmt(B2_r1(m))} quanta on average, so many impulses release none and the rest give 1, 2 or 3 units. The mean size gives m = ${fmt(B2_r2(m1))}; counting only the failures gives m = ${fails?fmt(B2_r2(m2)):'(no failures yet)'}. Two independent estimates that agree are the evidence that release is made of whole packets let go by chance.`};
 }});

const B2_VES_SAY=[
 ['The impulse arrives','An action potential runs down the axon into the nerve ending.'],
 ['Calcium channels open','The change of voltage opens calcium channels in the ending’s membrane, close to the vesicles that are docked there.'],
 ['Vesicles fuse','Calcium triggers docked vesicles to fuse with the membrane. Each one that fuses is one quantum: several thousand molecules of acetylcholine.'],
 ['Transmitter crosses the cleft','Acetylcholine spreads across the narrow cleft in a fraction of a millisecond.'],
 ['Receptors open','It binds receptors on the muscle, which open and let sodium in. The membrane potential rises: the end-plate potential.'],
 ['The signal is ended','An enzyme in the cleft splits acetylcholine within milliseconds. The ending takes the choline back up and recycles the vesicle membrane.']];
SCENE({id:'quantal-release-vesicles',name:'A quantum is one vesicle',tag:'Calcium, fusion, release',
 definition:'Electron microscopes in the mid-1950s showed nerve endings packed with small round vesicles about 50 nanometres across. Del Castillo and Katz proposed that one quantum is the contents of one vesicle, released when it fuses with the membrane. Calcium entering the ending is the trigger: with no calcium outside, the impulse arrives and nothing is released.',
 example:'In 1979 Heuser, Reese and colleagues froze frog nerve endings within milliseconds of an impulse and caught vesicles in the act of fusing. The number of fusions they counted matched the number of quanta released.',
 desc:'A nerve ending with vesicles above a muscle membrane with receptors, stepping through arrival of the impulse, calcium entry, vesicle fusion, crossing of the cleft, opening of receptors and removal of the transmitter, with the muscle’s potential drawn alongside.',
 research:['del Castillo & Katz (1955). Local activity at a depolarized nerve–muscle junction. Journal of Physiology 128, 396–411 (the vesicle hypothesis is set out in their 1956 review).','Katz & Miledi (1967). The timing of calcium action during neuromuscular transmission. Journal of Physiology 189, 535–544.','Heuser, Reese, Dennis, Jan, Jan & Evans (1979). Synaptic vesicle exocytosis captured by quick freezing and correlated with quantal transmitter release. Journal of Cell Biology 81, 275–300.','Kuffler & Yoshikami (1975). Journal of Physiology 251, 465–482 (fewer than 10,000 molecules in a quantum).'],
 dur:14,hint:'Step through the six stages. Then take the calcium out of the bath and step through again to see where the chain breaks.',
 init:()=>({ca:1}),
 trace:s=>B2_VES_SAY.map((v,i)=>({i,say:s.ca||i<1?v[1]:i===1?'The calcium channels open, but there is no calcium outside to come in.':'Without calcium entering, no vesicle fuses, nothing crosses the cleft and the muscle’s potential stays flat. Katz and Miledi showed the calcium must be there at the moment the impulse arrives.'})),
 ui:[{choose:[[1,'Calcium in the bath'],[0,'No calcium']],label:'Bath',get:s=>s.ca,act:'ca'}],
 on:{ca(s,v){s.ca=+v?1:0}},
 draw(s,f,X){
  const k=f.i,u=X?X.u:1,rel=s.ca&&k>=2,ok=!!s.ca;
  let out=heading(`${k+1}. ${ok||k<2?B2_VES_SAY[k][0]:'No calcium, no release'}`);
  // nerve ending
  out+=P('M270 40L270 62C190 62 150 86 150 124C150 150 180 166 300 166C420 166 450 150 450 124C450 86 410 62 330 62L330 40',C.blue,3,C.pale);
  out+=TF(458,100,'nerve ending',13,C.blue,'start');
  if(k===0)out+=Ci(300,lerp(44,90,u),9,C.coral,'#fff');
  for(const [vx,vy] of [[200,112],[250,96],[300,112],[350,96],[400,112],[275,128],[325,128]])out+=Ci(vx,vy,11,'#fff',C.purple)+Ci(vx-3,vy-2,1.6,C.purple)+Ci(vx+3,vy+1,1.6,C.purple)+Ci(vx,vy+4,1.6,C.purple);
  // docked vesicles and calcium channels
  [230,300,370].forEach((dx,i)=>{const fuse=rel&&i!==1;
   if(fuse)out+=P(`M${dx-12} 166C${dx-12} ${150-4} ${dx+12} ${150-4} ${dx+12} 166`,C.purple,2.5,'#fff');else out+=Ci(dx,153,11,'#fff',C.purple)+Ci(dx-3,151,1.6,C.purple)+Ci(dx+3,154,1.6,C.purple)+Ci(dx,157,1.6,C.purple);
   out+=R(dx+18,160,8,12,k>=1?C.amber:'#fff',C.amber,2);
   if(k===1&&ok)out+=Ci(dx+22,lerp(182,150,u),3.5,C.amber);
   if(fuse&&k>=3){const n=k===3?5:k===4?3:1;for(let j=0;j<n;j++)out+=Ci(dx-10+j*5,lerp(170,k>=4?192:186,k===3?u:1)+(j%2)*5,2.4,C.purple)}});
  out+=TF(142,186,'cleft',13,C.muted,'end');
  // muscle membrane with receptors
  out+=R(120,200,360,46,C.greenp,C.green,8)+TF(488,228,'muscle',13,C.green,'start');
  for(const rx of [200,230,260,300,340,370,400]){const open=rel&&k===4;out+=R(rx-7,194,5,14,C.green,'none',1)+R(rx+(open?4:1),194,5,14,C.green,'none',1);if(open)out+=Ci(rx+1,lerp(196,214,u),2.4,C.coral)}
  if(k===1)out+=TF(142,150,'Ca²⁺ channels',13,C.amber,'end');
  // potential
  const pl=B2_plot(400,268,170,70,[0,10],[-2,22],{xt:[[0,'0'],[5,'5'],[10,'10 ms']]});out+=pl.svg+TF(400,262,'muscle potential',13,C.muted,'start');
  const tEnd=!rel?10:k<4?1.2:k===4?lerp(1.2,3,u):lerp(3,10,u),pts=[];for(let i=0;i<=100;i++){const t=i/10;if(t>tEnd&&rel)break;pts.push([pl.X(t),pl.Y(rel&&k>=4?18*B2_psp(t-1.2,2.5,.4):0)])}
  out+=B2_poly(pts,rel?C.green:C.muted,2.4);
  // step list
  B2_VES_SAY.forEach((v,i)=>{const y=270+i*17;out+=TF(40,y,`${i+1}. ${v[0]}`,13,i===k?C.ink:C.muted,'start',i===k?'font-weight="700"':'')});
  if(!ok&&k>=2)out+=TB(300,186,'nothing released',13,C.coral);
  return {svg:out,phase:f.say};
 }});

// Binomial release: n sites, each releasing with probability p; each quantum gives q mV.
const B2_NPQ_CACHE={};
function B2_npqTrials(n,p,seed,N){const key=[n,p,seed].join(':');let c=B2_NPQ_CACHE[key];if(!c||c.length<N){const r=B2_rng(seed*57+n*7+p);c=[];for(let i=0;i<Math.max(N,400);i++){let m=0;for(let j=0;j<n;j++)if(r()<p/100)m|=1<<j;c.push(m)}B2_NPQ_CACHE[key]=c}return c.slice(0,N)}
const B2_bits=m=>{let c=0;while(m){c+=m&1;m>>=1}return c};
const B2_choose=(n,k)=>B2_fact(n)/(B2_fact(k)*B2_fact(n-k));
SCENE({id:'quantal-release-npq',name:'Counting synaptic strength',tag:'Sites × probability × size',
 definition:'Quanta turn the strength of a synapse into arithmetic. If there are n places where a vesicle can be released, each with probability p when an impulse arrives, and each quantum moves the membrane by q, the average response is n × p × q. The nerve ending sets n and p; the receiving cell’s receptors set q.',
 example:'With n = 5 sites, p = 0.3 and q = 0.4 mV, the average is 5 × 0.3 × 0.4 = 0.6 mV, and the impulse fails completely on 0.7⁵ ≈ 17% of trials. At many synapses in the brain n and p are small, so failures are common.',
 desc:'A row of release sites that light when they release on the latest trial, a histogram of how many sites released across all trials with the binomial prediction marked, and tiles for the average number of quanta, the average response and the failure rate.',
 research:['del Castillo & Katz (1954). Quantal components of the end-plate potential. Journal of Physiology 124, 560–573.','Redman (1990). Quantal analysis of synaptic potentials in neurons of the central nervous system. Physiological Reviews 70, 165–198.'],
 dur:10,hint:'Change the number of sites, the release probability or the size of a quantum, then stimulate. Three different changes can give the same average, but the pattern of failures tells them apart.',
 init:()=>({n:5,p:30,q:4,N:1,seed:2}),
 watch(p){return {n:5,p:30,q:4,N:1+Math.floor(p*120),seed:2}},
 ui:[{range:'n',label:'Release sites n',min:1,max:10,get:s=>s.n,act:'n'},{range:'p',label:'Probability p',min:5,max:95,step:5,get:s=>s.p,act:'p',show:v=>fmt(v/100)},{range:'q',label:'Quantum size q',min:2,max:8,get:s=>s.q,act:'q',show:v=>fmt(v/10)+' mV'},{b:'Stimulate once',act:'one'},{b:'Stimulate 100 times',act:'many'},{b:'Clear',act:'clear'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),1,10)},p(s,v){s.p=clamp(Math.round(+v/5)*5,5,95)},q(s,v){s.q=clamp(Math.round(+v),2,8)},
  one(s){s.N=Math.min(400,s.N+1);const d=B2_npqTrials(s.n,s.p,s.seed,s.N);if(B2_bits(d[d.length-1]))B2_click([0],.1)},many(s){s.N=Math.min(400,s.N+100)},clear(s){s.N=0;s.seed+=5}},
 draw(s){
  const d=B2_npqTrials(s.n,s.p,s.seed,s.N),N=d.length,p=s.p/100,q=s.q/10,last=N?d[N-1]:0,kl=B2_bits(last);
  let out=heading(N?`This impulse: ${kl} of ${s.n} sites released · ${fmt(B2_r1(kl*q))} mV`:'Stimulate to see which sites release');
  const sp=Math.min(52,480/s.n),xs=300-sp*(s.n-1)/2;
  for(let j=0;j<s.n;j++){const x=xs+j*sp,on=N&&(last>>j)&1;out+=P(`M${x-15} 62L${x-15} 92C${x-15} 108 ${x+15} 108 ${x+15} 92L${x+15} 62`,C.blue,2.5,on?C.greenp:C.pale)+Ci(x,on?101:86,8,on?C.green:'#fff',on?C.green:C.purple);if(on)out+=L(x,112,x,124,C.green,3)}
  out+=L(40,128,560,128,C.green,3)+TF(560,146,'receiving cell',13,C.green,'end')+TF(40,146,'release sites',13,C.blue,'start');
  // histogram of counts
  const cnt=new Array(s.n+1).fill(0);for(const m of d)cnt[B2_bits(m)]++;
  const pred=range(s.n+1).map(k=>B2_choose(s.n,k)*Math.pow(p,k)*Math.pow(1-p,s.n-k)),mx=Math.max(.3,...pred,...cnt.map(c=>N?c/N:0))*1.1;
  const pl=B2_plot(60,176,320,130,[0,s.n+1],[0,mx],{xl:'sites that released on one impulse'});out+=pl.svg+TF(60,170,'share of impulses',13,C.muted,'start');
  for(let k=0;k<=s.n;k++){const xa=pl.X(k),bw=320/(s.n+1);out+=TF(xa+bw/2,323,k,13,C.muted);if(N&&cnt[k])out+=R(xa+3,pl.Y(cnt[k]/N),bw-6,pl.Y(0)-pl.Y(cnt[k]/N),k?C.blue:C.coral,'none',2);out+=Ci(xa+bw/2,pl.Y(pred[k]),4,'#fff',C.ink)}
  out+=TF(376,190,'○ binomial prediction',13,C.ink,'end');
  const mo=N?sum(d.map(B2_bits))/N:0,f0=N?cnt[0]/N:0;
  out+=B2_tile(400,170,184,'Mean quanta n × p',`${fmt(B2_r2(s.n*p))}${N?' · seen '+fmt(B2_r2(mo)):''}`)+B2_tile(400,222,184,'Mean response n × p × q',fmt(B2_r2(s.n*p*q))+' mV',C.green)+B2_tile(400,274,184,'Failures (1 − p)ⁿ',`${Math.round(100*Math.pow(1-p,s.n))}%${N?' · seen '+Math.round(100*f0)+'%':''}`,C.coral);
  out+=B2_note(`${N} impulse${N===1?'':'s'} so far. Simulated: each site releases by chance, independently.`,364);
  return {svg:out,phase:`n = ${s.n}, p = ${fmt(p)}, q = ${fmt(q)} mV gives an average of ${fmt(B2_r2(s.n*p))} quanta and ${fmt(B2_r2(s.n*p*q))} mV. A synapse can be strengthened by releasing more often (p), from more sites (n), or by making each quantum count for more (q). Which of these changes when a synapse learns was argued over for years; the lesson on long-term potentiation takes it up.`};
 }});

/*B2_END*/
