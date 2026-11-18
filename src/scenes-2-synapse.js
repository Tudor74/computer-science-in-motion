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
  else if(f.kind==='back')px=lerp(tx(N-1),sx(N-1),u);else if(f.kind==='blocked'){px=sx(N-1);out+=TB(tx(N-2)+12,y-42,'✕',20,C.coral)+TF(tx(N-2)+12,y-62,'no crossing',13,C.coral)}
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
 ui:[{b:'Stimulate the vagus of heart 1',act:'stim'},{b:'Move fluid from 1 to 2',act:'move'},{b:'Fresh fluid for both',act:'wash'},{b:'Atropine on heart 2: on/off',act:'atr'},{b:'Hear heart 2 ▶',act:'hear'}],
 on:{stim(s){Object.assign(s,B2_loewiStep(s,'stim'))},move(s){Object.assign(s,B2_loewiStep(s,'move'))},wash(s){Object.assign(s,B2_loewiStep(s,'wash'))},atr(s){Object.assign(s,B2_loewiStep(s,'atr'))},reset(s){Object.assign(s,B2_loewiInit())},
  hear(s){const gap=60/(40*s.r2);for(let i=0;i<Math.floor(4.5/gap);i++){AUDIO.tone(70,{dur:.11,gain:.14,at:i*gap,attack:.01,release:.08});AUDIO.tone(55,{dur:.09,gain:.09,at:i*gap+.16,attack:.01,release:.06})}return 'keep'}},
 draw(s){
  const cur=s.segs[s.segs.length-1];
  let out=heading(s.got==='slowed'?'Heart 2 slows: the fluid carried the message':s.got==='none'?'Control: fluid from an unstimulated heart does nothing':s.got==='blocked'?'Atropine on heart 2 blocks the effect':s.last==='stim'?'The vagus slows heart 1':'Two hearts, one nerve');
  const heart=(x,y,r,lab)=>`<path d="M${x} ${y+16}C${x-26} ${y-4} ${x-18} ${y-24} ${x} ${y-10}C${x+18} ${y-24} ${x+26} ${y-4} ${x} ${y+16}Z" fill="${C.coralp}" stroke="${C.coral}" stroke-width="2.5"/>`+TF(x,y+50,lab,13,C.muted);
  const beaker=(x,y,tint)=>R(x,y,96,74,tint?C.purplep:'#eef6fb',C.line,10);
  out+=beaker(26,60,s.vs)+heart(74,96,cur.r1,'heart 1')+beaker(26,214,s.r2<1)+heart(74,250,cur.r2,'heart 2');
  out+=P('M150 62C132 64 112 70 92 84',C.amber,3)+TF(144,56,'vagus nerve',13,C.amber,'end');
  if(s.last==='stim')out+=TB(128,78,'⚡',17,C.amber);
  out+=curveArrow(132,128,132,214,-26,s.last==='move'?C.purple:C.line,s.last==='move'?3:2)+TF(166,176,'fluid',13,s.last==='move'?C.purple:C.muted,'start');
  if(s.vs)out+=TF(74,152,'holds Vagusstoff',13,C.purple);
  if(s.atr)out+=TF(74,306,'atropine added',13,C.green);
  // drum record
  const x0=222,w=50,rows=[[104,'r1','Heart 1'],[232,'r2','Heart 2']];
  out+=R(x0-6,48,362,286,'#fff',C.grid,8);
  for(const [yb,key,lab] of rows){
   out+=TBF(x0,yb-46,lab,13,C.ink,'start')+L(x0,yb,x0+350,yb,C.grid,1.2);
   s.segs.forEach((g,i)=>{const r=g[key],nb=Math.max(1,Math.round(8*r)),amp=r<.6?20:r<1?27:34,xa=x0+i*w,pts=[];
    for(let b=0;b<nb;b++){const xb=xa+(b+.1)*w/nb,ww=w/nb;pts.push([xb,yb],[xb+Math.min(3,ww*.3),yb-amp],[xb+Math.min(9,ww*.7),yb])}
    pts.push([xa+w,yb]);out+=B2_poly(pts,r<1?C.coral:C.blue,1.8)});
   const r=cur[key];out+=TBF(x0+350,yb-46,`${Math.round(40*r)} beats a minute`,13,r<1?C.coral:C.blue,'end');
  }
  s.segs.forEach((g,i)=>{out+=L(x0+i*w,150,x0+i*w,162,C.line,1.2)+TF(x0+i*w+w/2,168,B2_LW_LABEL[g.a],13,g.a==='stim'?C.amber:g.a==='move'?C.purple:C.muted)});
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
  const tr=(yb,lab,col,fn)=>{let o=TBF(302,yb-50,lab,13,col,'start')+L(300,yb,580,yb,C.grid,1.2);const pts=[];for(let i=0;i<=140;i++){const t=i/140*4;pts.push([300+i*2,yb-fn(t)])}return o+B2_poly(pts,col,2.4)};
  const spike=t=>t<1?0:t<1.25?40*(t-1)/.25:t<1.7?40*(1-(t-1.25)/.45*1.15):-7*Math.exp(-(t-1.7)/.6);
  const post=t=>!pass?0:ch?16*B2_psp(t-1.5,1.6,.25):.35*spike(t-.03);
  out+=tr(110,fa?'Cell A: stimulated, fires':'Cell A',C.blue,fa?spike:post)+tr(200,fa?'Cell B':'Cell B: stimulated, fires',C.green,fa?post:spike);
  for(const v of [0,1,2,3,4])out+=TF(300+v*70,244,v+(v===4?' ms':''),13,C.muted);
  if(pass&&ch)out+=L(370,212,405,212,C.coral,3)+TF(412,224,'delay about 0.5 ms',13,C.coral,'start');
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
 ui:[{b:'Record another 10 s',act:'more'},{choose:[['none','No drug'],['cur','A little curare'],['neo','Neostigmine']],label:'In the bath',get:s=>s.drug,act:'drug'},{b:'Hear this strip ▶',act:'hear'}],
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
  out+=B2_note('Simulated record. On this slow time base each blip, a few milliseconds long, looks like a tick.',372);
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
 definition:'José del Castillo and Bernard Katz lowered the calcium around the junction until a nerve impulse released very little. The response then jumped about from trial to trial: nothing, one unit, two units, three. The unit was the size of one spontaneous blip. A normal response is a hundred or more of these packets, or quanta, released together.',
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

/* ===================== Lesson: excitation-inhibition ===================== */
// Schematic motor neuron: rest −70 mV, threshold −55 mV. Each excitatory group adds 4 mV, each inhibitory group takes 3 mV.
const B2_REST=-70,B2_THR=-55,B2_EU=4,B2_IU=3;
// Voltage with a schematic spike added from the moment threshold is crossed.
function B2_withSpike(sub,tc,t){if(tc===null||t<tc)return sub;const d=t-tc;if(d<.5)return lerp(B2_THR,30,d/.5);if(d<1.5)return lerp(30,-78,(d-.5));return B2_REST-8*Math.exp(-(d-1.5)/3)}
SCENE({id:'excitation-inhibition',name:'Pushes towards and away from threshold',tag:'EPSPs and IPSPs',
 definition:'In the early 1950s John Eccles’s group recorded inside spinal motor neurons of anaesthetised cats. An excitatory synapse makes the inside briefly less negative: an excitatory postsynaptic potential, or EPSP. An inhibitory synapse makes it more negative or holds it down: an IPSP. Each is a few millivolts at most and fades in milliseconds. The cell fires only if the sum reaches threshold.',
 example:'Here each active group of excitatory fibres adds 4 mV and each inhibitory group takes away 3 mV. Four excitatory groups give 16 mV, enough to cross the 15 mV from −70 to −55 mV. Add one inhibitory group and the sum is 13 mV: no impulse.',
 desc:'A motor neuron with excitatory and inhibitory endings on it, and a plot of its membrane potential after the chosen inputs arrive together, with rest and threshold marked.',
 research:['Brock, Coombs & Eccles (1952). Journal of Physiology 117, 431–460.','Eccles (1957). The Physiology of Nerve Cells. Johns Hopkins Press.','Mendell & Henneman (1971). Journal of Neurophysiology 34, 171–187: one input fibre moves a motor neuron by only about a tenth of a millivolt, so each input here stands for many fibres firing together.'],
 dur:10,hint:'Set how many excitatory and inhibitory groups fire together. Find the smallest excitation that fires the cell, then cancel it with inhibition. The sound button plays a click if the cell fires.',
 init:()=>({e:3,i:0}),
 watch(p){const seq=[[1,0],[2,0],[3,0],[4,0],[4,1],[5,1],[5,2],[6,2]];const k=Math.min(seq.length-1,Math.floor(p*seq.length));return {e:seq[k][0],i:seq[k][1]}},
 ui:[{range:'e',label:'Excitatory groups active',min:0,max:6,get:s=>s.e,act:'e'},{range:'i',label:'Inhibitory groups active',min:0,max:4,get:s=>s.i,act:'i'},{b:'Hear the result ▶',act:'hear'}],
 on:{e(s,v){s.e=clamp(Math.round(+v),0,6)},i(s,v){s.i=clamp(Math.round(+v),0,4)},hear(s){AUDIO.tone(180,{dur:.05,gain:.08});if(B2_EU*s.e-B2_IU*s.i>=15)B2_click([.25],.2);return 'keep'}},
 draw(s){
  const a=B2_EU*s.e-B2_IU*s.i,fires=a>=B2_THR-B2_REST;
  let out=heading(fires?'Threshold reached: the neuron fires':`Sum ${B2_mv(a)} mV: ${a>0?'short of threshold':'no push towards threshold'}`);
  // neuron
  out+=Ci(140,170,40,C.pale,C.blue)+L(178,184,262,236,C.blue,6)+TF(140,175,'motor',13,C.blue)+TF(140,191,'neuron',13,C.blue)+TF(250,262,'axon',13,C.muted);
  if(fires)out+=Ci(232,217,7,C.coral,'#fff');
  for(let j=0;j<6;j++){const an=Math.PI*(1.02+j*.19),x=140+56*Math.cos(an),y=170+56*Math.sin(an),on=j<s.e;out+=L(140+92*Math.cos(an),170+92*Math.sin(an),x,y,on?C.green:C.line,3)+Ci(x,y,8,on?C.green:'#fff',C.green)}
  for(let j=0;j<4;j++){const an=Math.PI*(.98-j*.19),x=140+56*Math.cos(an),y=170+56*Math.sin(an),on=j<s.i;out+=L(140+92*Math.cos(an),170+92*Math.sin(an),x,y,on?C.coral:C.line,3)+Ci(x,y,8,on?C.coral:'#fff',C.coral)}
  out+=TF(24,60,'excitatory endings',13,C.green,'start')+TF(24,306,'inhibitory endings',13,C.coral,'start');
  // plot
  const pl=B2_plot(330,56,250,236,[0,20],[-85,40],{xt:[[0,'0'],[5,'5'],[10,'10'],[15,'15'],[20,'20 ms']],yt:[[-70,'−70'],[-55,'−55'],[0,'0'],[30,'+30']],yl:'membrane potential (mV)'});out+=pl.svg;
  out+=L(pl.X(0),pl.Y(B2_THR),pl.X(20),pl.Y(B2_THR),C.coral,1.5,'stroke-dasharray="6 5"')+TF(pl.X(20)-4,pl.Y(B2_THR)-6,'threshold',13,C.coral,'end');
  const sub=t=>B2_REST+a*B2_psp(t-2);let tc=null;if(fires)for(let t=2;t<8;t+=.02)if(sub(t)>=B2_THR){tc=t;break}
  const pts=[];for(let i=0;i<=400;i++){const t=i/20;pts.push([pl.X(t),pl.Y(B2_withSpike(sub(t),tc,t))])}out+=B2_poly(pts,fires?C.coral:C.blue,2.6);
  out+=L(pl.X(2),pl.Y(-85),pl.X(2),pl.Y(-80),C.amber,3)+TF(pl.X(2)+4,pl.Y(-85)-8,'inputs',13,C.amber,'start');
  out+=T(300,340,`${B2_EU} × ${s.e} − ${B2_IU} × ${s.i} = ${B2_mv(a)} mV · needed: +15 mV`,15,fires?C.coral:C.ink);
  out+=B2_note('Schematic sizes; real potentials do not add quite this simply.',364);
  return {svg:out,phase:fires?`${s.e} excitatory group${s.e===1?'':'s'}${s.i?` against ${s.i} inhibitory`:''} push the cell ${B2_mv(a)} mV, from −70 to past −55 mV, and an impulse leaves along the axon. Adding inputs that arrive together on different parts of the cell is called spatial summation.`:
   `The potential rises to about ${B2_mv(B2_REST+Math.max(0,a))} mV and fades back within a few milliseconds. The cell stays silent, and nothing downstream ever learns that these inputs arrived. Sherrington had deduced this arithmetic from reflexes; Eccles’s electrode showed it happening.`};
 }});

function B2_timing(s){
 const td=s.tau,t2=2+s.gap,V=t=>B2_REST+10*B2_psp(t-2,td)+10*B2_psp(t-t2,td)-(s.inh?6*B2_psp(t-s.ti,td):0);
 let peak=-99,tp=0,tc=null;for(let t=0;t<=40;t+=.05){const v=V(t);if(v>peak){peak=v;tp=t}if(tc===null&&v>=B2_THR)tc=t}
 return {V,peak,tp,tc,t2};
}
SCENE({id:'excitation-inhibition-timing',name:'Timing decides',tag:'Summation over time',
 definition:'A synaptic potential outlasts the input that caused it, fading over a few milliseconds as charge leaks away through the membrane. A second input that arrives before the first has faded builds on top of it. This is temporal summation. How long the cell “remembers” an input is set by its membrane time constant.',
 example:'Two inputs of 10 mV each need 15 mV between them to fire this cell. With a time constant of 10 ms they succeed if they arrive within about 7 ms of each other. An inhibitory input placed just before the second one makes them fail again.',
 desc:'Membrane potential against time for two excitatory inputs separated by an adjustable gap, with an optional inhibitory input, the threshold line, and markers showing when each input arrives.',
 research:['Eccles (1957). The Physiology of Nerve Cells. Johns Hopkins Press.','Rall (1967). Distinguishing theoretical synaptic potentials computed for different soma-dendritic distributions of synaptic input. Journal of Neurophysiology 30, 1138–1168.','König, Engel & Singer (1996). Integrator or coincidence detector? The role of the cortical neuron revisited. Trends in Neurosciences 19, 130–137.'],
 dur:12,hint:'Shorten the gap until the cell just fires, then lengthen the time constant and see how much more slack it allows. Switch the inhibition on and move it to block the spike.',
 init:()=>({gap:12,tau:10,inh:0,ti:8}),
 watch(p){return p<.6?{gap:Math.round(lerp(24,2,p/.6)),tau:10,inh:0,ti:8}:{gap:4,tau:10,inh:1,ti:Math.round(lerp(26,0,(p-.6)/.4))}},
 ui:[{range:'gap',label:'Gap between the two inputs',min:0,max:30,get:s=>s.gap,act:'gap',show:v=>v+' ms'},{range:'tau',label:'Membrane time constant',min:5,max:20,get:s=>s.tau,act:'tau',show:v=>v+' ms'},{choose:[[0,'No inhibition'],[1,'Add inhibition']],label:'Inhibitory input',get:s=>s.inh,act:'inh'},{range:'ti',label:'Inhibition arrives at',min:0,max:30,get:s=>s.ti,act:'ti',show:v=>v+' ms'},{b:'Hear it ▶',act:'hear'}],
 on:{gap(s,v){s.gap=clamp(Math.round(+v),0,30)},tau(s,v){s.tau=clamp(Math.round(+v),5,20)},inh(s,v){s.inh=+v?1:0},ti(s,v){s.ti=clamp(Math.round(+v),0,30)},
  hear(s){const r=B2_timing(s);AUDIO.tone(220,{dur:.04,gain:.08,at:0});AUDIO.tone(220,{dur:.04,gain:.08,at:s.gap*.025});if(r.tc!==null)B2_click([(r.tc-2)*.025+.02],.2);return 'keep'}},
 draw(s){
  const r=B2_timing(s),fires=r.tc!==null;
  let out=heading(fires?`Fires ${fmt(B2_r1(r.tc))} ms in: the inputs add up in time`:`Peak ${B2_mv(r.peak)} mV: ${fmt(B2_r1(B2_THR-r.peak))} mV short`);
  const pl=B2_plot(70,56,490,224,[0,40],[-80,-45],{xt:[[0,'0'],[10,'10'],[20,'20'],[30,'30'],[40,'40 ms']],yt:[[-75,'−75'],[-70,'−70'],[-65,'−65'],[-60,'−60'],[-55,'−55'],[-50,'−50']],yl:'membrane potential (mV)'});out+=pl.svg;
  out+=L(pl.X(0),pl.Y(B2_THR),pl.X(40),pl.Y(B2_THR),C.coral,1.5,'stroke-dasharray="6 5"')+TF(pl.X(40)-4,pl.Y(B2_THR)-6,'threshold',13,C.coral,'end')+L(pl.X(0),pl.Y(B2_REST),pl.X(40),pl.Y(B2_REST),C.grid,1.2);
  const pts=[];for(let i=0;i<=400;i++){const t=i/10;if(fires&&t>r.tc)break;pts.push([pl.X(t),pl.Y(Math.min(-45,r.V(t)))])}out+=B2_poly(pts,C.blue,2.6);
  if(fires)out+=L(pl.X(r.tc),pl.Y(B2_THR),pl.X(r.tc),56,C.coral,3)+TB(pl.X(r.tc)+8,72,'spike',13,C.coral,'start');
  const mark=(t,col,lab,dy)=>`<polygon points="${fmt(pl.X(t))},${280} ${fmt(pl.X(t)-6)},${292} ${fmt(pl.X(t)+6)},${292}" fill="${col}"/>`+TF(pl.X(t),306+dy,lab,13,col);
  out+=mark(2,C.green,'input 1',0)+mark(r.t2,C.green,'input 2',s.gap<5?14:0);if(s.inh)out+=mark(s.ti,C.coral,'inhibition',Math.abs(s.ti-2)<5||Math.abs(s.ti-r.t2)<5?28:0);
  out+=B2_tile(70,318,150,'Gap',s.gap+' ms',C.green)+B2_tile(232,318,150,'Time constant',s.tau+' ms')+B2_tile(394,318,166,'Highest point',fires?'threshold':B2_mv(r.peak)+' mV',fires?C.coral:C.ink);
  return {svg:out,phase:fires?`The second input arrives while ${fmt(B2_r1(10*B2_psp(r.t2-2,s.tau)))} mV of the first is still there, and together they cross −55 mV. A cell with a long time constant adds up inputs spread over many milliseconds; one with a short time constant responds only to inputs that nearly coincide.`:
   s.inh&&B2_timing({...s,inh:0}).tc!==null?'Without the inhibitory input these two would have fired the cell. Inhibition does not need to be large: it needs to arrive at the right moment.':
   `By the time the second input arrives, the first has faded to ${fmt(B2_r1(10*B2_psp(r.t2-2,s.tau)))} mV, so the sum peaks at ${B2_mv(r.peak)} mV and falls away. Bring the inputs closer together, or lengthen the time constant.`};
 }});

// Synaptic channels by what they let through. Reversal potentials: about 0 mV for glutamate's channels,
// about −80 mV for the chloride channels of Eccles's motor neurons. Size of potential = k × (reversal − membrane).
const B2_CH={glu:{E:0,k:.1,name:'Glutamate channel',ions:'Na⁺ and K⁺',col:C.green},inh:{E:-80,k:.25,name:'Chloride channel',ions:'Cl⁻',col:C.coral}};
SCENE({id:'excitation-inhibition-reversal',name:'What makes a synapse excitatory',tag:'Glutamate, GABA and the reversal potential',
 definition:'A transmitter does not carry a plus or minus sign. It opens channels, and the ions that pass pull the membrane towards a fixed voltage, the reversal potential. Glutamate’s fast channels pass sodium and potassium and pull towards about 0 mV, above threshold: excitation. The channels opened by GABA (and by glycine in the spinal cord) pass chloride and pull towards about −70 to −80 mV, below threshold: inhibition. Glutamate is the main excitatory transmitter of the brain and GABA the main inhibitory one.',
 example:'At −70 mV the chloride channel gives a small downward potential. Hold the cell at −80 mV and it gives none; at −90 mV it turns upward. Coombs, Eccles and Fatt found exactly this reversal in 1955, which showed inhibition was a flow of ions and not a mysterious “anti-excitation”.',
 desc:'A plot of the size and direction of a synaptic potential against the voltage at which the cell is held, crossing zero at the channel’s reversal potential, with the potential itself drawn beside it.',
 research:['Coombs, Eccles & Fatt (1955). The specific ionic conductances and the ionic movements across the motoneuronal membrane that produce the inhibitory post-synaptic potential. Journal of Physiology 130, 326–373.','Curtis & Watkins (1960). The excitation and depression of spinal neurones by structurally related amino acids. Journal of Neurochemistry 6, 117–141.','Krnjević & Schwartz (1967). The action of γ-aminobutyric acid on cortical neurones. Experimental Brain Research 3, 320–336.'],
 dur:12,hint:'Pick a channel and slide the holding voltage until the synaptic potential vanishes. That voltage is the reversal potential. Compare it with the threshold at −55 mV.',
 init:()=>({v:-70,ch:'inh'}),
 watch(p){return p<.5?{ch:'glu',v:Math.round(lerp(-100,20,p*2)/5)*5}:{ch:'inh',v:Math.round(lerp(-50,-100,(p-.5)*2)/5)*5}},
 ui:[{choose:[['glu','Glutamate channel'],['inh','Chloride channel (GABA)']],label:'Channel',get:s=>s.ch,act:'ch'},{range:'v',label:'Hold the cell at',min:-100,max:20,step:5,get:s=>s.v,act:'v',show:v=>B2_mv(v)+' mV'}],
 on:{ch(s,v){s.ch=B2_CH[v]?v:'glu'},v(s,v){s.v=clamp(Math.round(+v/5)*5,-100,20)}},
 draw(s){
  const c=B2_CH[s.ch],dv=c.k*(c.E-s.v),zero=Math.abs(dv)<.01;
  let out=heading(zero?`No potential at ${B2_mv(s.v)} mV: this is the reversal potential`:`At ${B2_mv(s.v)} mV the potential is ${B2_mv(dv)} mV`);
  const pl=B2_plot(70,60,270,220,[-100,20],[-12,12],{xt:[[-100,'−100'],[-70,'−70'],[-40,'−40'],[0,'0'],[20,'+20']],yt:[[-10,'−10'],[0,'0'],[10,'+10']],xl:'voltage the cell is held at (mV)',yl:'synaptic potential (mV)'});out+=pl.svg;
  out+=L(pl.X(-100),pl.Y(0),pl.X(20),pl.Y(0),C.line,1.4)+L(pl.X(B2_THR),60,pl.X(B2_THR),280,C.amber,1.2,'stroke-dasharray="4 4"')+TF(pl.X(B2_THR)+4,74,'threshold',13,C.amber,'start');
  const yA=clamp(c.k*(c.E+100),-12,12),yB=clamp(c.k*(c.E-20),-12,12),xA=c.E-yA/c.k,xB=c.E-yB/c.k;
  out+=L(pl.X(xA),pl.Y(yA),pl.X(xB),pl.Y(yB),c.col,2.6)+Ci(pl.X(c.E),pl.Y(0),6,'#fff',c.col)+TF(pl.X(c.E)+(s.ch==='glu'?-8:8),pl.Y(0)+(s.ch==='glu'?22:-10),`reverses at ${B2_mv(c.E)||'0'} mV`,13,c.col,s.ch==='glu'?'end':'start');
  out+=Ci(pl.X(s.v),pl.Y(clamp(dv,-12,12)),7,C.ink,'#fff');
  // the potential itself
  out+=R(370,60,210,130,'#fff',C.grid,8)+TF(380,78,'what the electrode sees',13,C.muted,'start')+L(382,128,568,128,C.grid,1.2);
  const pts=[];for(let i=0;i<=90;i++){const t=i/90*20;pts.push([382+i/90*186,128-clamp(dv,-12,12)*3.6*B2_psp(t-3)])}out+=B2_poly(pts,c.col,2.6);
  out+=B2_tile(370,202,210,c.name+' passes',c.ions,c.col)+B2_tile(370,254,210,'Pull: reversal − membrane',`${B2_mv(c.E)||'0'} − (${B2_mv(s.v)||'0'}) = ${B2_mv(c.E-s.v)||'0'} mV`,C.ink);
  out+=T(300,344,dv>0&&c.E>B2_THR?'Pulled upwards, towards a point above threshold: excitatory.':dv>0?'Upwards, but only towards −80 mV, which is below threshold.':zero?'Channels open, yet no net current flows.':c.E>B2_THR?'Above 0 mV the same channel pushes downwards.':'Pulled downwards, away from threshold: inhibitory.',15,c.col);
  out+=B2_note('Straight-line sketch: potential = constant × (reversal − membrane voltage).',370);
  return {svg:out,phase:s.ch==='glu'?'Glutamate’s fast channels pull the membrane towards about 0 mV. From anywhere near rest that is upwards and past threshold, so glutamate synapses excite. Curtis and Watkins showed in 1960 that glutamate excites spinal neurons, but because it is found in every cell it took until the 1970s and 80s to be accepted as a transmitter.':
   (zero?'At the reversal potential the open channels move no net charge. They still inhibit: any excitatory current now leaks out through them, which is called shunting. ':dv>0?'Held below the reversal potential, the cell is pulled up towards −80 mV. The potential has reversed, as Coombs, Eccles and Fatt saw, yet the pull is still towards a voltage below threshold. ':'Chloride enters and the inside becomes more negative. ')+'In the brain these channels are opened mostly by GABA, shown to act like cortical inhibition by Krnjević and Schwartz in 1967; in the spinal cord, where Eccles worked, often by glycine.'};
 }});

/* ===================== Lesson: neurotransmitters ===================== */
const B2_TESTS=['Is it made and stored in nerve endings?','Is it released when the nerve fires?','Does adding it copy the nerve’s effect?','Does one blocker stop both?','Is there a way to switch it off?'];
// [answer, short reason] for each test. y = yes, n = no, u = not clear.
const B2_CAND={
 ach:{name:'Acetylcholine at the muscle',res:[['y','The ending holds the enzyme that makes it and vesicles full of it.'],['y','Dale, Feldberg and Vogt (1936) collected it from muscle when the motor nerve was stimulated.'],['y','Put on the muscle near the nerve ending, it makes the fibre contract.'],['y','Curare blocks the nerve’s effect and the effect of added acetylcholine alike.'],['y','An enzyme in the cleft, acetylcholinesterase, splits it within milliseconds.']],
  verdict:['Passes all five. By 1936 it was the first accepted transmitter.','The tests themselves were worked out on this case.']},
 glu:{name:'Glutamate in the brain',res:[['u','Yes, but so is every cell in the body: it is a building block of proteins. Presence alone proved nothing.'],['y','Yes, and the release needs calcium; this was shown in the 1970s.'],['y','Curtis and Watkins (1960): it excites almost every neuron tried. That seemed too general to be a signal.'],['y','Only once selective blockers were made, around 1980, largely in Jeff Watkins’s laboratory.'],['y','Transporters on neurons and astrocytes take it up.']],
  verdict:['The brain’s main excitatory transmitter, doubted for about 20 years','because the first test could not tell a signal from an ordinary metabolite.']},
 no:{name:'Nitric oxide, a gas',res:[['n','It is not stored. An enzyme makes it on demand when calcium enters the cell.'],['n','No vesicles: it passes straight through membranes and spreads to nearby cells.'],['y','It raises a messenger molecule inside neighbouring cells, as the nerve activity does.'],['y','Blocking the enzyme that makes it stops the effect. It has no receptor on the cell surface.'],['u','Nothing removes it; it breaks down by itself within seconds.']],
  verdict:['Fails the classic tests, yet it carries signals between cells (1988).','The list describes typical transmitters; it is not a law.']}};
const B2_ANS={y:['Yes',C.green,C.greenp],n:['No',C.coral,C.coralp],u:['Not clear',C.amber,C.amberp]};
SCENE({id:'neurotransmitters',name:'What counts as a transmitter',tag:'Five tests for a candidate',
 definition:'A neurotransmitter is a chemical that a neuron releases at a synapse to act on receptors of the next cell. Finding a chemical in the brain does not make it one. By the mid-twentieth century a candidate was expected to pass a set of tests: it is made and stored in the nerve ending, released when the nerve fires, copies the nerve’s effect when applied, is stopped by the same blockers, and has a way of being removed.',
 example:'Henry Dale described the actions of acetylcholine in 1914, Loewi showed a nerve releasing something like it in 1921, and Dale’s group caught it leaving motor nerve endings in 1936. Glutamate passed most of the same tests by 1960 and was still doubted for two decades.',
 desc:'Five tests listed as rows for a chosen candidate chemical. Pressing a row runs that test and shows yes, no or not clear, and a verdict appears when all five are done.',
 research:['Dale (1914). The action of certain esters and ethers of choline, and their relation to muscarine. Journal of Pharmacology and Experimental Therapeutics 6, 147–190.','Dale, Feldberg & Vogt (1936). Journal of Physiology 86, 353–380.','Werman (1966). Criteria for identification of a central nervous system transmitter. Comparative Biochemistry and Physiology 18, 745–766.','Garthwaite, Charles & Chess-Williams (1988). Nature 336, 385–388 (nitric oxide as a messenger in the brain).'],
 dur:14,hint:'Choose a candidate and press each test to run it. Compare a textbook case, a late-accepted one and a rule-breaker.',
 init:()=>({c:'ach',done:[0,0,0,0,0],last:-1}),
 watch(p){const ks=['ach','glu','no'],i=Math.min(2,Math.floor(p*3)),u=p*3-i,n=Math.min(5,Math.floor(u*6.5));return {c:ks[i],done:range(5).map(j=>j<n?1:0),last:n-1}},
 ui:[{choose:[['ach','Acetylcholine'],['glu','Glutamate'],['no','Nitric oxide']],label:'Candidate',get:s=>s.c,act:'c'},{b:'Run all five',act:'all'}],
 on:{c(s,v){s.c=B2_CAND[v]?v:'ach';s.done=[0,0,0,0,0];s.last=-1},test(s,v){const i=clamp(+v|0,0,4);s.done[i]=1;s.last=i},all(s){s.done=[1,1,1,1,1];s.last=4},clear(s){s.done=[0,0,0,0,0];s.last=-1}},
 draw(s,f,X){
  const c=B2_CAND[s.c],n=sum(s.done);
  let out=heading(c.name+(n===5?'':` · ${n} of 5 tests run`));
  B2_TESTS.forEach((q,i)=>{const y=46+i*48,d=s.done[i],a=d?B2_ANS[c.res[i][0]]:null;
   const inner=R(20,y,560,42,i===s.last?C.pale:'#fff',i===s.last?C.blue:C.grid,8)+Ci(42,y+21,12,C.pale,C.blue)+TBF(42,y+26,i+1,14,C.blue)+T(64,y+26,q,13,C.ink,'start')+R(484,y+7,88,28,a?a[2]:'#fff',a?a[1]:C.line,14)+TBF(528,y+26,a?a[0]:'Run test',13,a?a[1]:C.muted);
   out+=hit(X,'test',i,`Test ${i+1}: ${q} ${d?'Result: '+B2_ANS[c.res[i][0]][0]:'Press to run.'}`,inner)});
  out+=R(20,292,560,70,n===5?C.amberp:'#fff',C.grid,8);
  if(n===5)out+=T(300,320,c.verdict[0],14,C.ink,'middle','font-weight="650"')+T(300,344,c.verdict[1],14,C.ink);
  else out+=T(300,332,n?'Run the remaining tests for a verdict.':'Press a test to run it.',14,C.muted);
  return {svg:out,phase:s.last<0?`${c.name}: no tests run yet. Each test was a real line of experiments, often taking years.`:`Test ${s.last+1}. ${c.res[s.last][1]}`};
 }});

// Carlsson's reserpine experiment. Levels are illustrative percentages of normal; the pattern is the published one.
const B2_CARL={normal:{da:100,na:100,ht:100,mv:100},res:{da:6,na:6,ht:6,mv:4},dopa:{da:95,na:10,ht:6,mv:90},htp:{da:6,na:6,ht:95,mv:4}};
const B2_carlMix=(a,b,u)=>({da:lerp(a.da,b.da,u),na:lerp(a.na,b.na,u),ht:lerp(a.ht,b.ht,u),mv:lerp(a.mv,b.mv,u)});
SCENE({id:'neurotransmitters-dopamine',name:'Dopamine earns its place',tag:'Montagu and Carlsson, 1957–58',
 definition:'Dopamine was long thought to be only a step in making noradrenaline. In 1957 Kathleen Montagu reported it in the brain, and Arvid Carlsson’s group in Sweden gave animals reserpine, a drug that empties nerve endings of dopamine, noradrenaline and serotonin. The animals stopped moving. A dose of L-DOPA, which the brain turns into dopamine, got them moving again; the building block of serotonin did not.',
 example:'After L-DOPA the brain’s dopamine came back but its noradrenaline did not, so the recovery tracked dopamine. Bertler and Rosengren then found most of the brain’s dopamine in the striatum, a region concerned with movement where noradrenaline is scarce. Many pharmacologists doubted the conclusion for years; Carlsson shared the Nobel Prize in 2000.',
 desc:'Bars for the brain’s dopamine, noradrenaline and serotonin and for the animal’s movement, in four conditions: untreated, after reserpine, and after reserpine followed by L-DOPA or by 5-HTP.',
 research:['Montagu (1957). Catechol compounds in rat tissues and in brains of different animals. Nature 180, 244–245.','Carlsson, Lindqvist & Magnusson (1957). 3,4-Dihydroxyphenylalanine and 5-hydroxytryptophan as reserpine antagonists. Nature 180, 1200.','Carlsson, Lindqvist, Magnusson & Waldeck (1958). On the presence of 3-hydroxytyramine in brain. Science 127, 471.','Bertler & Rosengren (1959). Occurrence and distribution of dopamine in brain and other tissues. Experientia 15, 10–11.'],
 dur:12,hint:'Give reserpine, then try each building block in turn. Watch which transmitter returns and whether movement returns with it.',
 init:()=>({st:'normal'}),
 watch(p){const seq=['normal','res','htp','res','dopa'],x=p*seq.length,i=Math.min(seq.length-1,Math.floor(x)),u=smooth(clamp((x-i)*2.2,0,1));return {st:seq[i],from:seq[Math.max(0,i-1)],u}},
 ui:[{b:'Give reserpine',act:'res'},{b:'Then give L-DOPA',act:'dopa'},{b:'Then give 5-HTP',act:'htp'}],
 on:{res(s){s.st='res';s.msg=''},dopa(s){if(s.st==='normal'){s.msg='Give reserpine first: the test is whether L-DOPA can undo it.'}else{s.st='dopa';s.msg=''}},htp(s){if(s.st==='normal'){s.msg='Give reserpine first: the test is whether 5-HTP can undo it.'}else{s.st='htp';s.msg=''}},reset(s){s.st='normal';s.msg=''}},
 draw(s){
  const v=s.from?B2_carlMix(B2_CARL[s.from],B2_CARL[s.st],s.u):B2_CARL[s.st];
  const title={normal:'Before any drug',res:'Reserpine: stores emptied, movement stops',dopa:'L-DOPA: dopamine and movement return',htp:'5-HTP: serotonin returns, movement does not'}[s.st];
  let out=heading(title);
  // what was given
  out+=R(20,52,218,150,'#fff',C.grid,8)+TBF(32,74,'Given',14,C.ink,'start');
  const steps=[['Reserpine',s.st!=='normal',C.coral],['L-DOPA (makes dopamine)',s.st==='dopa',C.blue],['5-HTP (makes serotonin)',s.st==='htp',C.purple]];
  steps.forEach((t,i)=>{const y=100+i*32;out+=Ci(40,y-5,8,t[1]?t[2]:'#fff',t[1]?t[2]:C.line)+(t[1]?TBF(40,y,'✓',12,'#fff'):'')+TF(56,y,t[0],13,t[1]?C.ink:C.muted,'start')});
  out+=R(20,214,218,96,'#fff',C.grid,8)+TBF(32,236,'Movement',14,C.ink,'start')+R(32,250,176,18,C.pale,'none',9)+R(32,250,Math.max(4,176*v.mv/100),18,v.mv>50?C.green:C.coral,'none',9)+TF(32,292,v.mv>50?'moving about normally':'almost none',13,v.mv>50?C.green:C.coral,'start');
  // bars
  const bx=250,base=300,sc=2.1;out+=R(bx,52,330,258,'#fff',C.grid,8)+TF(bx+12,72,'amount in the brain, % of normal',13,C.muted,'start');
  for(const g of [0,50,100])out+=L(bx+44,base-g*sc,bx+318,base-g*sc,C.grid,1)+TF(bx+38,base-g*sc+4,g,13,C.muted,'end');
  [['Dopamine','da',C.blue],['Noradrenaline','na',C.amber],['Serotonin','ht',C.purple]].forEach((b,i)=>{const x=bx+62+i*88;out+=R(x,base-v[b[1]]*sc,60,v[b[1]]*sc,b[2],'none',4)+TF(x+30,base+18,b[0],13,C.ink)});
  out+=TF(300,336,'Illustrative levels; the pattern follows the published reports.',13,C.muted);
  out+=T(300,362,s.msg||'Mice and rabbits were used. Reserpine left them still; L-DOPA reversed this for a time.',13,s.msg?C.coral:C.muted);
  return {svg:out,phase:{normal:'All three transmitters are at their normal level and the animal moves about. Reserpine will empty the stores of all three at once, so by itself it cannot say which one matters for movement.',
   res:'Reserpine stops nerve endings storing dopamine, noradrenaline and serotonin, and the levels of all three fall close to zero. The animals become still. Which loss is responsible? Putting one transmitter back at a time can tell.',
   dopa:'Within minutes the animals move again. The brain’s dopamine has returned; noradrenaline, which is made from dopamine, has not. Movement follows dopamine, so dopamine is doing a job of its own. This result later led to L-DOPA as a treatment in Parkinson’s disease.',
   htp:'Serotonin is restored, and the animals stay still. Whatever reserpine took away that matters for movement, it was not serotonin.'}[s.st]};
 }});

const B2_ROLE={
 ach:{chip:'ACh',name:'Acetylcholine',found:'Dale 1914 · Loewi 1921 · at muscle 1936',jobs:['Makes skeletal muscle contract (fast receptors)','Slows the heart (slow receptors)','In the forebrain: attention and wakefulness'],label:'No popular label',reply:['It was found first and is still the model case:','one chemical, opposite effects on two kinds of muscle.']},
 na:{chip:'NA',name:'Noradrenaline (norepinephrine)',found:'von Euler 1946, in sympathetic nerves',jobs:['Sympathetic nerves: speeds the heart','Sympathetic nerves: narrows blood vessels','From the locus coeruleus: alertness'],label:'Sometimes “the stress chemical”',reply:['It also works in calm, focused attention.','Its effect depends on the receptor it meets.']},
 da:{chip:'DA',name:'Dopamine',found:'Montagu 1957 · Carlsson 1957–58',jobs:['In the striatum: starting and learning movements','Midbrain cells signal better or worse than expected','In the pituitary: holds back the hormone prolactin'],label:'“The pleasure chemical”',reply:['A popular simplification. Recordings tie it to learning','and to wanting more than to pleasure itself.']},
 ht:{chip:'5-HT',name:'Serotonin',found:'In blood serum 1948 · in the brain 1953',jobs:['Most of the body’s serotonin is in the gut','From the raphe nuclei: sleep, appetite, mood','In blood platelets: narrows vessels at a wound'],label:'“The happiness chemical”',reply:['A popular simplification. No single job fits it, and the',' idea that low serotonin causes depression is disputed.']},
 glu:{chip:'Glu',name:'Glutamate',found:'Curtis & Watkins 1960 · accepted about 1980',jobs:['Main fast excitatory transmitter of the brain','Its NMDA receptor helps trigger lasting change','Also an ordinary amino acid in every cell'],label:'No popular label',reply:['The most widely used transmitter in the brain is the one','least often mentioned outside laboratories.']},
 gaba:{chip:'GABA',name:'GABA (γ-aminobutyric acid)',found:'In the brain 1950 · as a transmitter, 1960s',jobs:['Main fast inhibitory transmitter of the brain','Made from glutamate in a single step','Sedatives such as benzodiazepines boost its receptors'],label:'Sometimes “the calming chemical”',reply:['Inhibition is not calm: it shapes timing and rhythm,','and without it activity runs out of control.']}};
const B2_ROLE_KEYS=['ach','na','da','ht','glu','gaba'];
SCENE({id:'neurotransmitters-roles',name:'One chemical, many jobs',tag:'Why the nicknames mislead',
 definition:'A handful of small molecules do most of the nervous system’s signalling, and each is used in many places for different purposes. What a transmitter does depends on which neurons release it, where, and onto which receptors. Labels such as “the pleasure chemical” for dopamine or “the happiness chemical” for serotonin are popular simplifications, not findings.',
 example:'Acetylcholine makes a leg muscle contract and makes the heart beat more slowly. Dopamine helps start movements in the striatum and holds back a hormone in the pituitary. Most of the body’s serotonin is in the gut, where it helps drive the movements of the bowel.',
 desc:'Six transmitters as buttons. The chosen one shows who found it and when, three of its jobs in different places, and its popular nickname with a short reply.',
 research:['von Euler (1946). A specific sympathomimetic ergone in adrenergic nerve fibres (sympathin) and its relations to adrenaline and nor-adrenaline. Acta Physiologica Scandinavica 12, 73–97.','Twarog & Page (1953). Serotonin content of some mammalian tissues and urine. American Journal of Physiology 175, 157–161.','Roberts & Frankel (1950). γ-Aminobutyric acid in brain. Journal of Biological Chemistry 187, 55–63.','Berridge & Robinson (1998). What is the role of dopamine in reward? Brain Research Reviews 28, 309–369.'],
 dur:15,hint:'Press each transmitter to see where it works and what it does there. Check the nickname against the list of jobs.',
 init:()=>({t:'da'}),
 watch(p){return {t:B2_ROLE_KEYS[Math.min(5,Math.floor(p*6))]}},
 ui:[{choose:B2_ROLE_KEYS.map(k=>[k,B2_ROLE[k].chip]),label:'Transmitter',get:s=>s.t,act:'t'}],
 on:{t(s,v){s.t=B2_ROLE[v]?v:'da'}},
 draw(s,f,X){
  const r=B2_ROLE[s.t];let out=heading('The same chemical does different jobs in different places');
  B2_ROLE_KEYS.forEach((k,i)=>{const x=20+i*95,on=k===s.t;out+=hit(X,'t',k,B2_ROLE[k].name,R(x,44,85,32,on?C.blue:'#fff',on?C.blue:C.line,16)+TBF(x+42.5,65,B2_ROLE[k].chip,14,on?'#fff':C.ink))});
  out+=R(20,88,560,274,'#fff',C.grid,10)+TB(40,116,r.name,17,C.ink,'start')+T(40,140,'Found: '+r.found,13,C.muted,'start');
  r.jobs.forEach((j,i)=>{const y=172+i*27;out+=Ci(46,y-5,4,C.green)+T(60,y,j,14,C.ink,'start')});
  out+=L(40,246,560,246,C.grid,1.5)+TB(40,272,r.label,14,r.label[0]==='“'?C.coral:C.muted,'start');
  out+=T(40,298,r.reply[0].trim(),13,C.ink,'start')+T(40,320,r.reply[1].trim(),13,C.ink,'start');
  out+=TF(300,350,'Jobs listed are examples, not a complete account.',13,C.muted);
  return {svg:out,phase:`${r.name}. ${r.jobs.join('. ')}. ${r.reply.map(x=>x.trim()).join(' ')}`};
 }});

/* ===================== Lesson: receptors-drugs ===================== */
const B2_BERN_ROWS=[['none','no dish'],['nerve','nerve dish'],['muscle','muscle dish']];
const B2_bernTwitch=(where,stim)=>!(where==='muscle'&&stim==='nerve');
const B2_BERN_WATCH=[['none','nerve'],['none','muscle'],['nerve','nerve'],['nerve','muscle'],['muscle','nerve'],['muscle','muscle']];
SCENE({id:'receptors-drugs',name:'Where curare acts',tag:'Bernard, 1850s · Langley, 1905',
 definition:'Curare, an arrow poison from South America, paralyses without stopping the heart. In the 1850s Claude Bernard worked out where it acts, using a frog’s nerve and muscle. With curare, the nerve still conducted and the muscle still contracted when stimulated directly, but the nerve could no longer drive the muscle. The block was at the meeting point. In 1905 John Langley concluded that the muscle there carries a “receptive substance” that drugs combine with: the receptor.',
 example:'Curare around the nerve alone: stimulating the nerve still makes the muscle twitch. Curare around the muscle, where the nerve ends: stimulating the nerve does nothing, yet a shock to the muscle itself still makes it twitch.',
 desc:'A frog nerve lying in one dish and its muscle in another. Curare can be added to either dish, and the nerve or the muscle can be stimulated. A table fills in with which combinations give a twitch.',
 research:['Bernard (1857). Leçons sur les effets des substances toxiques et médicamenteuses. Baillière, Paris.','Langley (1905). On the reaction of cells and of nerve-endings to certain poisons, chiefly as regards the reaction of striated muscle to nicotine and to curari. Journal of Physiology 33, 374–413.'],
 dur:12,hint:'Put curare in neither dish, the nerve’s dish or the muscle’s dish, and stimulate the nerve and the muscle in each case. Six tests fill the table.',
 init:()=>({where:'none',res:{},last:''}),
 watch(p){const k=Math.min(6,Math.floor(p*7)),res={};for(let i=0;i<k;i++)res[B2_BERN_WATCH[i].join(':')]=1;const c=B2_BERN_WATCH[Math.max(0,k-1)];return {where:c[0],res,last:k?c[1]:''}},
 ui:[{choose:[['none','No curare'],['nerve','In the nerve’s dish'],['muscle','In the muscle’s dish']],label:'Curare',get:s=>s.where,act:'where'},{b:'Stimulate the nerve',act:'nerve'},{b:'Stimulate the muscle',act:'muscle'},{b:'Clear the table',act:'clear'}],
 on:{where(s,v){s.where=['none','nerve','muscle'].includes(v)?v:'none';s.last=''},nerve(s){s.res[s.where+':nerve']=1;s.last='nerve'},muscle(s){s.res[s.where+':muscle']=1;s.last='muscle'},clear(s){s.res={};s.last=''}},
 draw(s){
  const tw=s.last?B2_bernTwitch(s.where,s.last):false,n=Object.keys(s.res).length;
  let out=heading(!s.last?'Choose where the curare goes, then stimulate':tw?'The muscle twitches':'No twitch: the message is stopped between nerve and muscle');
  // the preparation
  out+=R(26,96,130,96,s.where==='nerve'?C.purplep:'#eef6fb',s.where==='nerve'?C.purple:C.line,12)+R(186,96,140,96,s.where==='muscle'?C.purplep:'#eef6fb',s.where==='muscle'?C.purple:C.line,12);
  out+=TF(91,214,'nerve’s dish',13,C.muted)+TF(256,214,'muscle’s dish',13,C.muted);
  if(s.where!=='none')out+=TB(s.where==='nerve'?91:256,88,'curare',13,C.purple);
  out+=P('M44 150C80 132 120 168 150 140C166 124 182 124 198 142C208 152 216 150 224 146',C.amber,4);
  const mw=tw?66:84,mh=tw?40:28;out+=`<ellipse cx="${264}" cy="146" rx="${mw/2}" ry="${mh/2}" fill="${C.coralp}" stroke="${C.coral}" stroke-width="2.5"/>`;
  out+=TF(70,128,'nerve',13,C.amber)+TF(280,128-(tw?8:0),'muscle',13,C.coral);
  if(s.last==='nerve')out+=TB(60,176,'⚡',18,C.amber)+TF(60,62,'shock to the nerve',13,C.amber,'start');
  if(s.last==='muscle')out+=TB(296,180,'⚡',18,C.amber)+TF(200,62,'shock to the muscle',13,C.amber,'start');
  if(s.last)out+=TB(264,238,tw?'twitch':'no twitch',14,tw?C.green:C.coral);
  // table
  out+=R(350,52,232,186,'#fff',C.grid,8)+TBF(362,74,'Curare in',13,C.ink,'start')+TBF(478,66,'shock',13,C.ink)+TBF(478,82,'nerve',13,C.amber)+TBF(542,66,'shock',13,C.ink)+TBF(542,82,'muscle',13,C.coral);
  B2_BERN_ROWS.forEach((r,i)=>{const y=96+i*46;if(r[0]===s.where)out+=R(354,y,224,40,C.pale,'none',6);out+=TF(362,y+25,r[1],13,C.ink,'start');
   ['nerve','muscle'].forEach((st,j)=>{const d=s.res[r[0]+':'+st],t=B2_bernTwitch(r[0],st),x=478+j*64;out+=R(x-28,y+6,56,28,d?(t?C.greenp:C.coralp):'#fff',d?(t?C.green:C.coral):C.line,6)+TBF(x,y+25,d?(t?'twitch':'none'):'?',13,d?(t?C.green:C.coral):C.muted)})});
  const all=n>=6;
  out+=R(20,262,560,82,all?C.amberp:'#fff',C.grid,8);
  out+=T(300,290,all?'The nerve conducts and the muscle can contract, even in curare.':`${n} of 6 tests done.`,14,C.ink,'middle',all?'font-weight="650"':'')+T(300,314,all?'Curare blocks only the step between them,':'Only one combination fails. Which, and what does that say',14,C.ink)+T(300,336,all?'at the place where the nerve ends on the muscle.':'about where the poison acts?',14,C.ink);
  out+=B2_note('A frog’s nerve and muscle, removed from the animal. Mechanism only: nothing here is a dose.',364);
  return {svg:out,phase:!s.last?'The nerve lies in one dish and runs across to its muscle in the other, so curare can reach the nerve’s length or the muscle with the nerve endings, but not both.':
   tw?(s.where==='muscle'?'Shocked directly, the muscle contracts even in curare. The muscle fibres themselves are not poisoned.':s.where==='nerve'?'The nerve works normally while soaking in curare. The poison does not stop nerve fibres conducting.':'Without curare, either shock gives a twitch.'):
   'The nerve conducts and the muscle is able to contract, yet the signal does not get from one to the other. Bernard placed the action of curare at the junction. Langley later showed that curare also blocks the effect of nicotine put directly on the muscle, so both must combine with something on the muscle’s side: a receptor.'};
 }});

const B2_RCP={
 nic:{name:'Skeletal muscle',kind:'Channel receptor (ionotropic)',c:.18,w:.32,col:C.green,
  steps:[['Acetylcholine binds','Two molecules of acetylcholine bind to the receptor on the muscle. This receptor is itself an ion channel.'],['The channel opens','Binding twists the receptor open in well under a millisecond. Nothing else needs to happen first.'],['Ions flow','Sodium rushes in and the muscle membrane depolarises. This is the nicotinic receptor, named because nicotine opens it too.'],['Over in milliseconds','Acetylcholine leaves, the enzyme in the cleft destroys it and the channel shuts. The whole event lasts a few milliseconds.']]},
 mus:{name:'Heart muscle',kind:'G-protein-coupled receptor (metabotropic)',c:2.7,w:.42,col:C.purple,
  steps:[['Acetylcholine binds','The same transmitter binds a different receptor on a pacemaker cell of the heart. This receptor is not a channel.'],['A G protein is switched on','The receptor activates a G protein on the inner face of the membrane, which splits into two parts.'],['A separate channel opens','One part reaches a nearby potassium channel and opens it. Potassium leaves, and the cell takes longer to reach its next beat.'],['Seconds, not milliseconds','The response starts after tens of milliseconds and lasts for seconds, until the G protein switches itself off. This is the muscarinic receptor, the one atropine blocks.']]}};
const B2_rcpCurve=(lg,c,w)=>Math.exp(-.5*Math.pow((lg-c)/w,2));
SCENE({id:'receptors-drugs-channels',name:'Two kinds of receptor',tag:'A channel, or a chain of messengers',
 definition:'Receptors come in two families. An ionotropic receptor is an ion channel: the transmitter binds and the channel opens, within a millisecond. A metabotropic receptor is not a channel. It activates a G protein inside the cell, which goes on to open channels or change the cell’s chemistry; this is tens to hundreds of times slower and lasts far longer. One transmitter can have both kinds.',
 example:'Acetylcholine on a leg muscle opens channel receptors and the fibre responds in a millisecond. Acetylcholine on the heart works through G proteins and the slowing builds over a fraction of a second. Dale had told these two actions apart in 1914, by the drugs that copy them: nicotine and muscarine.',
 desc:'A membrane with either a channel receptor or a G-protein-coupled receptor beside a separate channel, stepping through binding and opening, with both responses drawn on a time axis running from a millisecond to ten seconds. The 3D view shows the five subunits of the channel receptor around its central pore.',
 research:['Dale (1914). Journal of Pharmacology and Experimental Therapeutics 6, 147–190 (nicotine-like and muscarine-like actions).','Logothetis, Kurachi, Galper, Neer & Clapham (1987). The βγ subunits of GTP-binding proteins activate the muscarinic K⁺ channel in heart. Nature 325, 321–326.','Unwin (2005). Refined structure of the nicotinic acetylcholine receptor at 4 Å resolution. Journal of Molecular Biology 346, 967–989.','Hille (1992). G protein-coupled mechanisms and nervous signaling. Neuron 9, 187–195.'],
 dur:14,hint:'Choose the tissue, then step through what acetylcholine does there. Compare where the two responses sit on the time axis. Switch to 3D to turn the channel receptor round.',
 init:()=>({r:'nic'}),
 trace:s=>B2_RCP[s.r].steps.map((v,i)=>({i,say:v[1]})),
 ui:[{choose:[['nic','Skeletal muscle'],['mus','Heart']],label:'Acetylcholine arrives at',get:s=>s.r,act:'r'}],
 on:{r(s,v){s.r=v==='mus'?'mus':'nic'}},
 draw(s,f,X){
  const R0=B2_RCP[s.r],k=f.i,u=X?X.u:1,nic=s.r==='nic';
  let out=heading(`${R0.name}: ${k+1}. ${R0.steps[k][0]}`);
  out+=R(20,150,270,34,C.amberp,C.amber,6)+TF(30,144,'outside',13,C.muted,'start')+TF(30,202,'inside the cell',13,C.muted,'start')+TBF(155,66,R0.kind,13,R0.col);
  const ach=(x,y)=>Ci(x,y,5,C.coral,'#fff');
  if(nic){const open=k===1||k===2,g=open?9:2;
   out+=R(140-g-16,138,16,58,C.green,'none',5)+R(140+g,138,16,58,C.green,'none',5);
   if(k<3)out+=ach(118,lerp(96,132,k===0?u:1))+ach(162,lerp(96,132,k===0?u:1));else out+=ach(104,lerp(132,96,u))+ach(176,lerp(132,96,u));
   if(k===2)for(let j=0;j<3;j++)out+=Ci(140,lerp(120,214,(u+j/3)%1),3.2,C.blue);
   if(k===2)out+=TF(196,226,'Na⁺ in',13,C.blue,'start');
   out+=TF(140,250,'the receptor is the channel',13,C.green);
  }else{
   out+=R(60,138,34,58,C.purple,'none',10)+TF(77,250,'receptor',13,C.purple);
   const og=k===2;out+=R(220-(og?24:17),138,15,58,C.blue,'none',5)+R(220+(og?9:2),138,15,58,C.blue,'none',5)+TF(222,250,'K⁺ channel',13,C.blue);
   if(k<3)out+=ach(77,lerp(96,131,k===0?u:1));else out+=ach(60,lerp(131,96,u));
   const gx=k<1?98:k===1?lerp(98,120,u):k===2?lerp(120,196,u):lerp(196,98,u);
   out+=Ci(gx,200,11,k>=1&&k<3?C.amber:'#fff',C.amber)+TF(gx,226,'G protein',13,C.amber);
   if(k===2)for(let j=0;j<3;j++)out+=Ci(220,lerp(214,120,(u+j/3)%1),3.2,C.blue);
  }
  // time axis (log)
  const pl=B2_plot(330,62,250,190,[-.6,4],[0,1.15],{xt:[[0,'1 ms'],[1,'10'],[2,'100'],[3,'1 s'],[4,'10 s']],xl:'time after acetylcholine arrives'});out+=pl.svg+TF(330,56,'size of the response',13,C.muted,'start');
  for(const key of ['nic','mus']){const q=B2_RCP[key],pts=[];for(let i=0;i<=120;i++){const lg=-.6+i/120*4.6;pts.push([pl.X(lg),pl.Y(B2_rcpCurve(lg,q.c,q.w))])}out+=B2_poly(pts,q.col,key===s.r?3:1.6,key===s.r?'':'stroke-dasharray="5 4"')}
  out+=TF(pl.X(.18),pl.Y(1)-8,'muscle',13,C.green)+TF(pl.X(2.7),pl.Y(1)-8,'heart',13,C.purple);
  const lgNow=R0.c+[-2.2,-1.2,0,2.2][k]*R0.w;out+=L(pl.X(lgNow),62,pl.X(lgNow),252,C.ink,1.4,'stroke-dasharray="3 3"');
  R0.steps.forEach((v,i)=>{out+=TF(40,292+i*18,`${i+1}. ${v[0]}`,13,i===k?C.ink:C.muted,'start',i===k?'font-weight="700"':'')});
  out+=TF(455,306,'Time runs on a log scale:',13,C.muted)+TF(455,324,'each step is ten times longer.',13,C.muted)+TF(455,342,'Curves are illustrative.',13,C.muted);
  return {svg:out,phase:f.say};
 },
 three(s,f,X,project){
  const Pr=project([-1.6,1.6,-1.6,1.6,-1.2,1.9]),names=['α','γ','α','δ','β'],faces=[],open=s.r==='nic'&&f&&(f.i===1||f.i===2);
  const r0=open?.42:.22,r1=1.05,z0=-.9,z1=1.6,seg=4;
  // membrane slab (drawn first, behind) as two sheets
  const sheet=z=>poly3([[-1.6,-1.6,z],[1.6,-1.6,z],[1.6,1.6,z],[-1.6,1.6,z]],Pr,C.amberp,C.amber,'fill-opacity=".45"');
  for(let i=0;i<5;i++){const a0=i*2*Math.PI/5+.04,a1=(i+1)*2*Math.PI/5-.04,col=names[i]==='α'?C.green:'#5a9c8f';
   for(let j=0;j<seg;j++){const b0=lerp(a0,a1,j/seg),b1=lerp(a0,a1,(j+1)/seg),c=(r,b,z)=>[r*Math.cos(b),r*Math.sin(b),z];
    faces.push({pts:[c(r1,b0,z0),c(r1,b1,z0),c(r1,b1,z1),c(r1,b0,z1)],fill:col,opacity:.7},{pts:[c(r0,b0,z0),c(r0,b1,z0),c(r0,b1,z1),c(r0,b0,z1)],fill:col,opacity:.45},{pts:[c(r0,b0,z1),c(r1,b0,z1),c(r1,b1,z1),c(r0,b1,z1)],fill:col,opacity:1})}
   const c=(r,b,z)=>[r*Math.cos(b),r*Math.sin(b),z];
   faces.push({pts:[c(r0,a0,z0),c(r1,a0,z0),c(r1,a0,z1),c(r0,a0,z1)],fill:col,opacity:.6},{pts:[c(r0,a1,z0),c(r1,a1,z0),c(r1,a1,z1),c(r0,a1,z1)],fill:col,opacity:.6})}
  let out=sheet(-.6)+paintFaces(faces,Pr)+sheet(.3);
  for(let i=0;i<5;i++){const am=(i+.5)*2*Math.PI/5,q=Pr([.76*Math.cos(am),.76*Math.sin(am),z1]);out+=TBF(q[0],q[1]+4,names[i],13,'#fff')}
  // acetylcholine at the two α subunits
  for(const i of [0,2]){const am=(i+.5)*2*Math.PI/5,q=Pr([1.2*Math.cos(am),1.2*Math.sin(am),1.25]);out+=Ci(q[0],q[1],7,C.coral,'#fff')}
  const top=Pr([0,0,z1+.5]),bot=Pr([0,0,z1]);out+=arrow(top[0],top[1],bot[0],bot[1],open?C.blue:C.muted,3)+TF(top[0],top[1]-8,open?'Na⁺ passes':'pore closed',13,open?C.blue:C.muted);
  const m=[[1.6,1.6],[1.6,-1.6],[-1.6,1.6],[-1.6,-1.6]].map(c=>Pr([c[0],c[1],-.6])).sort((a,b)=>b[1]-a[1])[0];out+=TF(m[0],m[1]+18,'membrane',13,C.amber);
  return {svg:out,title:'The muscle’s acetylcholine receptor',caption:'Five protein subunits stand in a ring through the membrane, with the pore down the middle. The two α subunits (brighter) each carry part of a binding site for acetylcholine, marked by the red dots. The whole receptor is about 8 nanometres across. Sketch after Unwin’s electron-microscope structures; in adult muscle an ε subunit replaces γ.'};
 }});

// Dose–response: response = A/(A + EC50·(1 + B)) for a competitive antagonist; maximum falls to 1/(1 + B) for a non-competitive one.
// A is in multiples of the agonist's EC50; B is the antagonist concentration in multiples of its own dissociation constant.
function B2_dose(lg,b,kind){const A=Math.pow(10,lg);return kind==='non'?A/(A+1)/(1+b):A/(A+1+b)}
const B2_doseNoise=(lg,b,kind,i)=>.025*B2_gauss(B2_rng(Math.round(lg*100)+b*17+(kind==='non'?5:0)+i*131));
const B2_condCol=(b,kind)=>!b?C.blue:kind==='non'?C.purple:C.coral;
const B2_conc=lg=>{const v=Math.pow(10,lg);return String(Number(v.toPrecision(2)))};
SCENE({id:'receptors-drugs-dose',name:'The dose–response curve',tag:'Agonists and antagonists',
 definition:'An agonist binds a receptor and activates it. Plot the response against the logarithm of its concentration and you get an S-shaped curve; the concentration giving half the maximum is the EC50. A competitive antagonist binds the same site without activating it. It moves the whole curve to the right, and enough agonist still reaches the full response. A non-competitive antagonist lowers the maximum instead.',
 example:'For a competitive antagonist the curve shifts by a factor of 1 + [B]/K, where [B] is the antagonist’s concentration and K measures how tightly it binds. At [B] = 3K every point needs 4 times as much agonist; at 9K, 10 times as much. Curare against acetylcholine at the muscle behaves this way.',
 desc:'Response against agonist concentration on a logarithmic axis. The learner measures points; the control curve and the curve with a competitive or non-competitive antagonist are drawn, with the half-maximum concentration marked.',
 research:['Hill (1909). The mode of action of nicotine and curari, determined by the form of the contraction curve and the method of temperature coefficients. Journal of Physiology 39, 361–373.','Clark (1933). The Mode of Action of Drugs on Cells. Edward Arnold.','Gaddum (1937). The quantitative effects of antagonistic drugs. Journal of Physiology 89, 7P–9P.','Arunlakshana & Schild (1959). Some quantitative uses of drug antagonists. British Journal of Pharmacology 14, 48–58.'],
 dur:14,hint:'Set an agonist concentration and measure the response; repeat across the range to trace the curve. Then add an antagonist and measure again. Concentrations are relative, not doses of any real drug.',
 init:()=>({a:8,b:0,kind:'comp',pts:[]}),
 watch(p){const pts=[],ph=Math.min(2,Math.floor(p*3)),u=p*3-ph,conds=[[0,'comp'],[9,'comp'],[3,'non']];
  for(let c=0;c<=ph;c++){const n=c<ph?11:Math.min(11,Math.floor(u*13));for(let i=0;i<n;i++){const lg=-2+i*.5;pts.push({lg,b:conds[c][0],kind:conds[c][1],y:B2_dose(lg,conds[c][0],conds[c][1])+B2_doseNoise(lg,conds[c][0],conds[c][1],i)})}}
  return {a:8,b:conds[ph][0],kind:conds[ph][1],pts}},
 ui:[{range:'a',label:'Agonist concentration',min:0,max:20,get:s=>s.a,act:'a',show:v=>B2_conc(-2+v*.25)+' × EC50'},{b:'Measure the response',act:'measure'},{choose:[[0,'None'],[3,'Some'],[9,'More']],label:'Antagonist',get:s=>s.b,act:'b'},{choose:[['comp','Competitive'],['non','Non-competitive']],label:'Type',get:s=>s.kind,act:'kind'},{b:'Clear points',act:'clear'}],
 on:{a(s,v){s.a=clamp(Math.round(+v),0,20)},b(s,v){s.b=[0,3,9].includes(+v)?+v:0},kind(s,v){s.kind=v==='non'?'non':'comp'},clear(s){s.pts=[]},
  measure(s){const lg=-2+s.a*.25;s.pts.push({lg,b:s.b,kind:s.kind,y:B2_dose(lg,s.b,s.kind)+B2_doseNoise(lg,s.b,s.kind,s.pts.length)});if(s.pts.length>60)s.pts.shift()}},
 draw(s){
  const lg=-2+s.a*.25,comp=s.kind==='comp',shift=1+s.b,max=comp||!s.b?1:1/(1+s.b),ec=comp?shift:1;
  let out=heading(!s.b?'No antagonist: the control curve':comp?`Competitive: curve moves ${shift} times to the right`:`Non-competitive: maximum falls to ${Math.round(max*100)}%`);
  const pl=B2_plot(70,56,330,236,[-2,3],[0,1.08],{xt:[[-2,'0.01'],[-1,'0.1'],[0,'1'],[1,'10'],[2,'100'],[3,'1000']],yt:[[0,'0'],[.5,'50'],[1,'100']],xl:'agonist concentration (× EC50, log scale)',yl:'response, % of maximum'});out+=pl.svg;
  const curve=(b,kind,col,w,extra)=>{const pts=[];for(let i=0;i<=100;i++){const x=-2+i/20;pts.push([pl.X(x),pl.Y(B2_dose(x,b,kind))])}return B2_poly(pts,col,w,extra)};
  out+=curve(0,'comp',s.b?'#9cbad0':C.blue,s.b?1.8:2.6,s.b?'stroke-dasharray="5 4"':'');
  if(s.b)out+=curve(s.b,s.kind,B2_condCol(s.b,s.kind),2.6,'');
  const half=max/2,xe=Math.log10(ec);out+=L(pl.X(-2),pl.Y(half),pl.X(xe),pl.Y(half),C.line,1.2,'stroke-dasharray="3 3"')+L(pl.X(xe),pl.Y(half),pl.X(xe),pl.Y(0),C.line,1.2,'stroke-dasharray="3 3"');
  for(const q of s.pts)out+=Ci(pl.X(q.lg),pl.Y(clamp(q.y,0,1.06)),4.5,B2_condCol(q.b,q.kind),'#fff');
  const yNow=B2_dose(lg,s.b,s.kind);out+=L(pl.X(lg),pl.Y(0),pl.X(lg),pl.Y(0)-10,C.ink,3)+Ci(pl.X(lg),pl.Y(yNow),7,'none',C.ink);
  out+=B2_tile(416,56,168,'Agonist now',B2_conc(lg)+' × EC50',C.ink)+B2_tile(416,108,168,'Response there',Math.round(yNow*100)+'%',B2_condCol(s.b,s.kind))+B2_tile(416,160,168,'Half-maximum at',B2_conc(xe)+' × EC50',B2_condCol(s.b,s.kind))+B2_tile(416,212,168,'Highest response',Math.round(max*100)+'%',B2_condCol(s.b,s.kind));
  out+=TF(500,280,`${s.pts.length} point${s.pts.length===1?'':'s'} measured`,13,C.muted)+TF(500,298,s.b?(comp?`1 + [B]/K = 1 + ${s.b} = ${shift}`:`1 ÷ (1 + ${s.b}) = ${fmt(B2_r2(max))}`):'dots: your measurements',13,C.ink);
  out+=B2_note('Simple one-site model with a little simulated scatter. Relative units only; no doses.',364);
  return {svg:out,phase:!s.b?`With agonist at ${B2_conc(lg)} × EC50 the response is ${Math.round(yNow*100)}% of the maximum. Half of the rise happens within one tenfold step around the EC50, which is why pharmacologists plot concentration on a log scale.`:
   comp?`The antagonist and the agonist compete for the same site. With the antagonist at ${s.b} times its binding constant, every response needs ${shift} times more agonist, so the curve slides right without changing shape, and the maximum can still be reached. Gaddum and Schild used this shift to measure how tightly an antagonist binds.`:
   `This antagonist acts somewhere the agonist cannot displace it, so no amount of agonist restores the lost response: the maximum falls to ${Math.round(max*100)}% and the half-maximum concentration stays where it was. The shape of the change tells the two kinds of block apart.`};
 }});

// Caffeine and adenosine competing for one receptor. A and C are in multiples of each molecule's own binding constant.
const B2_CAF_ORDER=[5,0,9,3,11,7,1,10,4,8,2,6];
const B2_caf=(h,c)=>{const A=.25*h,d=A+1+c;return {A,fa:A/d,fc:c/d,f0:A/(A+1)}};
SCENE({id:'receptors-drugs-caffeine',name:'Caffeine: an everyday antagonist',tag:'Blocking the adenosine receptor',
 definition:'Many drugs that act on the brain copy or block a natural transmitter at its receptor. Adenosine builds up in the brain during waking hours and acts on its receptors as one signal of the pressure to sleep. Caffeine fits the same receptors without activating them: it is a competitive antagonist. The adenosine is still there; fewer receptors are reporting it.',
 example:'Other cases follow the same pattern. Curare is an antagonist at the muscle’s acetylcholine receptor, and nicotine is an agonist at it. Atropine is an antagonist at the heart’s acetylcholine receptor. Morphine is an agonist at opioid receptors and naloxone an antagonist there.',
 desc:'Twelve receptors on a membrane, each empty, holding adenosine or holding caffeine, with bars comparing the adenosine signal with and without caffeine as the hours awake increase.',
 research:['Snyder, Katims, Annau, Bruns & Daly (1981). Adenosine receptors and behavioral actions of methylxanthines. PNAS 78, 3260–3264.','Porkka-Heiskanen, Strecker, Thakkar, Bjørkum, Greene & McCarley (1997). Adenosine: a mediator of the sleep-inducing effects of prolonged wakefulness. Science 276, 1265–1268.','Fredholm, Bättig, Holmén, Nehlig & Zvartau (1999). Actions of caffeine in the brain. Pharmacological Reviews 51, 83–133.'],
 dur:12,hint:'Move through the waking day to raise adenosine, then add caffeine and see how many receptors still report it. This shows a mechanism; it is not advice about caffeine or sleep.',
 init:()=>({h:12,c:2}),
 watch(p){return p<.5?{h:Math.max(1,Math.round(lerp(1,16,p*2))),c:0}:{h:16,c:p<.75?2:6}},
 ui:[{range:'h',label:'Hours awake',min:1,max:16,get:s=>s.h,act:'h',show:v=>v+' h'},{choose:[[0,'None'],[2,'Some'],[6,'More']],label:'Caffeine',get:s=>s.c,act:'c'}],
 on:{h(s,v){s.h=clamp(Math.round(+v),1,16)},c(s,v){s.c=[0,2,6].includes(+v)?+v:0}},
 draw(s){
  const q=B2_caf(s.h,s.c),nA=Math.round(12*q.fa),nC=Math.min(12-nA,Math.round(12*q.fc));
  let out=heading(s.c?`Caffeine holds ${nC} of 12 receptors; adenosine reaches ${nA}`:`${s.h} hours awake: adenosine on ${nA} of 12 receptors`);
  out+=R(30,150,330,26,C.amberp,C.amber,6)+TF(34,196,'membrane of a neuron',13,C.muted,'start');
  for(let j=0;j<12;j++){const x=48+j*27,o=B2_CAF_ORDER[j],st=o<nA?'a':o<nA+nC?'c':'';
   out+=P(`M${x-9} 150L${x-9} 134C${x-9} 126 ${x+9} 126 ${x+9} 134L${x+9} 150`,st==='a'?C.amber:C.muted,2.5,st==='a'?'#fff3d6':'#fff');
   if(st==='a')out+=Ci(x,124,7,C.amber,'#fff')+L(x,152,x,172,C.amber,3);if(st==='c')out+=R(x-7,117,14,14,C.purple,'#fff',3)}
  // free molecules above
  const r=B2_rng(s.h*7+s.c);for(let j=0;j<Math.round(q.A*5);j++)out+=Ci(40+r()*310,60+r()*40,4,C.amber);for(let j=0;j<s.c*3;j++){const x=40+r()*310,y=60+r()*40;out+=R(x-4,y-4,8,8,C.purple,'none',2)}
  out+=Ci(44,226,7,C.amber,'#fff')+TF(58,231,'adenosine: switches the receptor on',13,C.ink,'start')+R(37,245,14,14,C.purple,'#fff',3)+TF(58,257,'caffeine: sits there, switches nothing on',13,C.ink,'start');
  // bars
  const bx=392,base=262,sc=1.65;out+=R(bx-12,50,200,244,'#fff',C.grid,8)+TF(bx,70,'adenosine signal, %',13,C.muted,'start');
  for(const g of [0,50,100])out+=L(bx+24,base-g*sc,bx+176,base-g*sc,C.grid,1)+TF(bx+20,base-g*sc+4,g,13,C.muted,'end');
  out+=R(bx+38,base-q.f0*100*sc,54,q.f0*100*sc,'#e8c98a','none',4)+TF(bx+65,base+16,'without',13,C.muted)+TBF(bx+65,base-q.f0*100*sc-6,Math.round(q.f0*100),13,C.amber);
  out+=R(bx+108,base-q.fa*100*sc,54,q.fa*100*sc,s.c?C.purple:C.amber,'none',4)+TF(bx+135,base+16,s.c?'with caffeine':'now',13,C.muted)+TBF(bx+135,base-q.fa*100*sc-6,Math.round(q.fa*100),13,s.c?C.purple:C.amber);
  out+=T(300,322,s.c?'The adenosine has not gone anywhere. When the caffeine is cleared, its signal returns.':'More hours awake, more adenosine, more receptors switched on.',14,C.ink);
  out+=B2_note('Schematic: adenosine is drawn rising steadily; amounts are relative, not doses. Not advice.',364);
  return {svg:out,phase:s.c?`Caffeine competes with adenosine for the same receptors and wins some of them, so the share reporting adenosine falls from ${Math.round(q.f0*100)}% to ${Math.round(q.fa*100)}%. Caffeine adds nothing of its own; it mutes one of the signals of time spent awake. Snyder’s group showed in 1981 that this block explains caffeine’s stimulant effect at ordinary amounts.`:
   `After ${s.h} hours awake, adenosine occupies about ${Math.round(q.fa*100)}% of these receptors in this sketch. Adenosine is one signal of sleep pressure among several; the lesson on sleep stages takes that further.`};
 }});

/* ===================== Lesson: neuromodulation ===================== */
// Side view of a brain, front to the left. Positions are schematic.
const B2_TGT={frontal:[140,130,'frontal cortex'],parietal:[290,74,'cortex'],occipital:[446,130,'visual cortex'],striatum:[236,138,'striatum'],thalamus:[300,150,'thalamus'],hippo:[352,172,'hippocampus'],cereb:[452,218,'cerebellum'],cord:[384,300,'spinal cord']};
const B2_SYS={
 na:{chip:'Noradrenaline',src:[366,232],from:'locus coeruleus, in the pons',col:C.amber,to:['frontal','parietal','occipital','thalamus','hippo','cereb','cord'],
  l1:'A few tens of thousands of neurons in a human brain.',l2:'They reach almost every region, cortex to spinal cord.',l3:'Linked with alertness and with reacting to the unexpected.'},
 ht:{chip:'Serotonin',src:[352,246],from:'raphe nuclei, along the midline of the brainstem',col:C.purple,to:['frontal','parietal','occipital','striatum','thalamus','hippo','cereb','cord'],
  l1:'Clusters of neurons along the middle of the brainstem.',l2:'Upper groups supply the forebrain, lower ones the spinal cord.',l3:'Linked with sleep and waking, mood, appetite: no single job.'},
 da:{chip:'Dopamine',src:[330,210],from:'substantia nigra and the area beside it, in the midbrain',col:C.blue,to:['striatum','frontal'],
  l1:'Two neighbouring groups of neurons in the midbrain.',l2:'They aim mainly at the striatum and the frontal cortex.',l3:'Linked with movement and with learning from reward.'},
 ach:{chip:'Acetylcholine',src:[232,188],from:'basal forebrain, under the front of the brain',col:C.green,to:['frontal','parietal','occipital','hippo'],
  l1:'Scattered groups of neurons at the base of the forebrain.',l2:'They supply the whole cortex and the hippocampus.',l3:'Linked with attention, waking and the readiness to learn.'}};
const B2_SYS_KEYS=['na','ht','da','ach'];
SCENE({id:'neuromodulation',name:'Small sources, wide reach',tag:'Four broadcasting systems',
 definition:'Most neurons speak to a few neighbours or to one distant target. A few small groups do something different: their axons branch across much of the brain, and what they release changes how large numbers of other neurons respond. This is neuromodulation. The best-known systems use noradrenaline, serotonin, dopamine and acetylcholine, each from its own small cluster of cells.',
 example:'The locus coeruleus holds a few tens of thousands of neurons in a brain of about 86 billion, yet its fibres reach the cortex, the hippocampus, the cerebellum and the spinal cord. It cannot be carrying detailed messages to all of them; it shifts their state.',
 desc:'A side view of the brain with four small source nuclei. Choosing one draws its fibres fanning out to the regions it supplies, with a short description of what it is linked with.',
 research:['Falck, Hillarp, Thieme & Torp (1962). Fluorescence of catechol amines and related compounds condensed with formaldehyde. Journal of Histochemistry and Cytochemistry 10, 348–354.','Dahlström & Fuxe (1964). Evidence for the existence of monoamine-containing neurons in the central nervous system. Acta Physiologica Scandinavica 62, Suppl. 232, 1–55.','Mesulam, Mufson, Wainer & Levey (1983). Central cholinergic pathways in the rat. Neuroscience 10, 1185–1201.','Aston-Jones & Cohen (2005). An integrative theory of locus coeruleus–norepinephrine function. Annual Review of Neuroscience 28, 403–450.'],
 dur:14,hint:'Press each source to see where its fibres go. Compare how widely the four systems spread, then switch to the point-to-point pathway for contrast.',
 init:()=>({sys:'na',cmp:0}),
 watch(p){const k=Math.min(4,Math.floor(p*5));return k<4?{sys:B2_SYS_KEYS[k],cmp:0,u:clamp((p*5-k)*1.8,0,1)}:{sys:'na',cmp:1,u:clamp((p*5-4)*1.8,0,1)}},
 ui:[{choose:B2_SYS_KEYS.map(k=>[k,B2_SYS[k].chip]),label:'System',get:s=>s.sys,act:'sys'},{choose:[[0,'Broadcast system'],[1,'Point-to-point pathway']],label:'Show',get:s=>s.cmp,act:'cmp'}],
 on:{sys(s,v){s.sys=B2_SYS[v]?v:'na';s.cmp=0},cmp(s,v){s.cmp=+v?1:0}},
 draw(s,f,X){
  const y=B2_SYS[s.sys],u=s.u===undefined?1:s.u;
  let out=heading(s.cmp?'For contrast: one place speaks to one place':`${y.chip}: from one small source to ${y.to.length>5?'most of the brain':y.to.length+' regions'}`);
  // brain outline
  out+=`<ellipse cx="290" cy="134" rx="212" ry="80" fill="#f4f8fb" stroke="${C.line}" stroke-width="2.5"/>`+`<ellipse cx="452" cy="218" rx="54" ry="30" fill="#f4f8fb" stroke="${C.line}" stroke-width="2.5"/>`+P('M312 204C330 214 350 226 362 258C370 280 376 292 380 316',C.line,26)+P('M312 204C330 214 350 226 362 258C370 280 376 292 380 316','#f4f8fb',21);
  out+=TF(46,70,'front',13,C.muted)+TF(554,70,'back',13,C.muted);
  for(const k in B2_TGT){const t=B2_TGT[k],on=!s.cmp&&y.to.includes(k)||s.cmp&&(k==='thalamus'||k==='occipital');out+=Ci(t[0],t[1],on?7:4,on?(s.cmp?C.ink:y.col):'#c9d6de')}
  if(s.cmp){const a=B2_TGT.thalamus,b=B2_TGT.occipital;out+=arrow(a[0],a[1],lerp(a[0],b[0]-8,u),lerp(a[1],b[1]+2,u),C.ink,3)+TF(a[0],a[1]+22,'thalamus',13,C.ink)+TF(b[0],b[1]-14,'visual cortex',13,C.ink)}
  else{
   for(const k of y.to){const t=B2_TGT[k],mx=(y.src[0]+t[0])/2+(t[1]-y.src[1])*.12,my=(y.src[1]+t[1])/2-(t[0]-y.src[0])*.12;
    const ex=lerp(y.src[0],t[0],u),ey=lerp(y.src[1],t[1],u),cx=lerp(y.src[0],mx,u),cy=lerp(y.src[1],my,u);out+=P(`M${y.src[0]} ${y.src[1]}Q${fmt(cx)} ${fmt(cy)} ${fmt(ex)} ${fmt(ey)}`,y.col,2.2)}
   for(const k of y.to){const t=B2_TGT[k];if(k==='cord')out+=TF(t[0]+18,t[1]-4,t[2],13,C.muted,'start');else if(k==='cereb')out+=TF(t[0]+10,t[1]+46,t[2],13,C.muted);else if(k==='parietal')out+=TF(t[0]+14,t[1]+4,t[2],13,C.muted,'start');else if(k==='hippo'||k==='thalamus'||k==='striatum')out+='';else out+=TF(t[0],t[1]-12,t[2],13,C.muted)}
  }
  B2_SYS_KEYS.forEach(k=>{const q=B2_SYS[k],on=k===s.sys&&!s.cmp;out+=hit(X,'sys',k,`${q.chip}: ${q.from}`,Ci(q.src[0],q.src[1],on?10:8,on?q.col:'#fff',q.col))});
  out+=R(20,262,356,100,'#fff',C.grid,8);
  if(s.cmp)out+=TBF(32,284,'A relay pathway',14,C.ink,'start')+TF(32,306,'The thalamus passes visual signals to one',13,C.ink,'start')+TF(32,324,'area of cortex, point for point. It carries the',13,C.ink,'start')+TF(32,342,'message; modulators change how it is received.',13,C.ink,'start');
  else out+=TBF(32,284,y.chip,14,y.col,'start')+TF(32,306,y.l1,13,C.ink,'start')+TF(32,324,y.l2,13,C.ink,'start')+TF(32,342,y.l3,13,C.ink,'start');
  out+=TF(486,340,'Schematic: sources',13,C.muted)+TF(486,358,'drawn larger than life.',13,C.muted);
  return {svg:out,phase:s.cmp?'Most long pathways are like this one: a defined source, a defined target, and a signal that says something specific. The four modulatory systems are the exception, and they were mapped only in the 1960s, when Swedish anatomists made their transmitters glow under the microscope.':
   `${y.chip} comes from the ${y.from}. ${y.l2} ${y.l3} Such links are broad tendencies seen across many experiments; none of these chemicals has a single function.`};
 }});

// A rate model with the main inhibitory connections of the crab's pyloric circuit. It is a sketch of the idea,
// not a fit to the animal's neurons. PD stands for the pacemaker group; LP and PY follow.
const B2_PYL_BASE={dPD:.62,self:.6,gPD:1.3,taPD:500,tPD:15,wLPPD:.15,dLP:1,wPDLP:1.5,wPYLP:.9,gLP:1.2,taLP:160,tLP:25,dPY:.85,wPDPY:1.5,wLPPY:.9,gPY:.2,taPY:300,tPY:60};
const B2_PYL_CACHE={};
function B2_pyl(mod,amt){
 const key=mod+':'+amt;if(B2_PYL_CACHE[key])return B2_PYL_CACHE[key];
 const m=mod==='none'?0:amt/100,o={...B2_PYL_BASE};
 if(mod==='a'){o.dPD=.62-.1*m;o.taPD=500*(1-.5*m)}
 if(mod==='b'){o.dLP=1+.25*m;o.gLP=1.2*(1-.6*m)}
 if(mod==='c'){o.dPY=.85+.3*m;o.wLPPY=.9*(1-.5*m)}
 const S=u=>1/(1+Math.exp(-(u-.5)/.08)),x=[.1,0,0],a=[0,0,0],rec=[],tau=[o.tPD,o.tLP,o.tPY],ta=[o.taPD,o.taLP,o.taPY];
 for(let t=0;t<9000;t++){
  const inp=[o.dPD+o.self*x[0]-o.gPD*a[0]-o.wLPPD*x[1],o.dLP-o.wPDLP*x[0]-o.wPYLP*x[2]-o.gLP*a[1],o.dPY-o.wPDPY*x[0]-o.wLPPY*x[1]-o.gPY*a[2]];
  for(let i=0;i<3;i++){x[i]+=(-x[i]+S(inp[i]))/tau[i];a[i]+=(x[i]-a[i])/ta[i]}
  if(t>=3000)rec.push([x[0]>.5,x[1]>.5,x[2]>.5]);
 }
 // bursts (ms from the first pacemaker onset in the record)
 let t0=1;while(t0<rec.length&&!(rec[t0][0]&&!rec[t0-1][0]))t0++;
 const bursts=[[],[],[]];for(let i=0;i<3;i++){let on=false,st=0;for(let t=t0;t<rec.length;t++){const v=rec[t][i];if(v&&!on){on=true;st=t}else if(!v&&on){on=false;bursts[i].push([st-t0,t-t0])}}}
 const pd=bursts[0],period=pd.length>2?pd[2][0]-pd[1][0]:0;
 return B2_PYL_CACHE[key]={bursts,period,active:bursts.map(b=>b.length>1)};
}
const B2_PYL_MOD={none:['No modulator',null],a:['On the pacemaker',0],b:['On LP',1],c:['On PY',2]};
SCENE({id:'neuromodulation-marder',name:'One circuit, many rhythms',tag:'Eve Marder and the crab’s stomach',
 definition:'In crabs and lobsters a ganglion of about 30 neurons drives the rhythmic movements of the stomach. Its wiring was mapped cell by cell in the 1970s. Eve Marder and others then found that the same wiring gives different rhythms depending on which modulators bathe it: faster, slower, with a neuron firing longer or dropping out. A wiring diagram says what a circuit could do; modulators choose among the possibilities.',
 example:'In this model the pacemaker (PD) fires, then LP, then PY, about twice a second. A modulator acting on the pacemaker speeds the whole rhythm up. One acting on LP lengthens its bursts until PY falls silent, and slows the cycle. No connection has been added or removed.',
 desc:'Burst patterns of three neurons, PD, LP and PY, over three seconds, with a diagram of their inhibitory connections and tiles for the cycle period and the firing order. A modulator can be applied to one of the three cells in adjustable amount.',
 research:['Hooper & Marder (1987). Modulation of the lobster pyloric rhythm by the peptide proctolin. Journal of Neuroscience 7, 2097–2112.','Harris-Warrick & Marder (1991). Modulation of neural networks for behavior. Annual Review of Neuroscience 14, 39–57.','Marder & Bucher (2007). Understanding circuit dynamics using the stomatogastric nervous system of lobsters and crabs. Annual Review of Physiology 69, 291–316.','Marder (2012). Neuromodulation of neuronal circuits: back to the future. Neuron 76, 1–11.'],
 dur:14,hint:'Apply a modulator to one cell and raise the amount. Watch the period, the length of each burst and whether all three cells still take part. The sound button plays three seconds of the rhythm as soft notes.',
 init:()=>({mod:'none',amt:100}),
 watch(p){const k=Math.min(3,Math.floor(p*4)),u=p*4-k;return {mod:['none','a','b','c'][k],amt:k?Math.round(clamp(u*1.5,0,1)*4)*25:100}},
 ui:[{choose:Object.keys(B2_PYL_MOD).map(k=>[k,B2_PYL_MOD[k][0]]),label:'Modulator',get:s=>s.mod,act:'mod'},{range:'amt',label:'Amount',min:0,max:100,step:25,get:s=>s.amt,act:'amt',show:v=>v+'%'},{b:'Hear the rhythm ▶',act:'hear'}],
 on:{mod(s,v){s.mod=B2_PYL_MOD[v]?v:'none'},amt(s,v){s.amt=clamp(Math.round(+v/25)*25,0,100)},
  hear(s){const r=B2_pyl(s.mod,s.amt);[330,440,554].forEach((hz,i)=>{for(const b of r.bursts[i])if(b[0]<3000)AUDIO.tone(hz,{dur:Math.min(.25,(b[1]-b[0])/1000),gain:.07,at:b[0]/1000,attack:.01,release:.05})});return 'keep'}},
 draw(s){
  const r=B2_pyl(s.mod,s.amt),names=['PD','LP','PY'],cols=[C.blue,C.green,C.purple],tg=B2_PYL_MOD[s.mod][1],eff=s.mod!=='none'&&s.amt>0;
  const order=names.filter((n,i)=>r.active[i]).join(' → '),silent=names.filter((n,i)=>!r.active[i]);
  let out=heading(`${eff?B2_PYL_MOD[s.mod][0]+' modulator, '+s.amt+'%':'No modulator'} · one cycle every ${Math.round(r.period)} ms`);
  const x0=96,w=484,TX=t=>x0+t/3000*w;out+=R(x0,48,w,174,'#fff',C.grid,6);
  names.forEach((n,i)=>{const yb=96+i*56;out+=TBF(24,yb-8,n,15,cols[i],'start')+TF(24,yb+8,i?'follower':'pacemaker',13,C.muted,'start')+L(x0,yb,x0+w,yb,C.grid,1.2);
   if(eff&&tg===i)out+=Ci(72,yb-12,6,C.amber,'#fff');
   for(const b of r.bursts[i]){if(b[0]>=3000)break;const e=Math.min(b[1],3000);out+=R(TX(b[0]),yb-30,TX(e)-TX(b[0]),30,tint(cols[i],.8),'none',2);for(let t=b[0]+8;t<e;t+=22)out+=L(TX(t),yb-28,TX(t),yb-2,cols[i],1.6)}});
  for(const v of [0,1,2,3])out+=TF(TX(v*1000),238,v+(v===3?' s':''),13,C.muted);
  // circuit
  const N={PD:[70,290],LP:[190,290],PY:[130,336]},inh=(a,b,bend)=>{const A=N[a],B=N[b],dx=B[0]-A[0],dy=B[1]-A[1],d=Math.hypot(dx,dy),ux=dx/d,uy=dy/d,ox=-uy*bend,oy=ux*bend;const x1=A[0]+ux*18+ox,y1=A[1]+uy*18+oy,x2=B[0]-ux*21+ox,y2=B[1]-uy*21+oy;return L(x1,y1,x2,y2,C.muted,2)+Ci(x2,y2,4,C.muted)};
  out+=inh('PD','LP',-5)+inh('LP','PD',-5)+inh('PD','PY',0)+inh('LP','PY',-5)+inh('PY','LP',-5);
  names.forEach((n,i)=>{const q=N[n];out+=Ci(q[0],q[1],15,r.active[i]?tint(cols[i],.8):'#fff',eff&&tg===i?C.amber:cols[i])+TBF(q[0],q[1]+5,n,13,cols[i])});
  out+=TF(20,262,'● ends: inhibition',13,C.muted,'start');
  out+=B2_tile(262,252,150,'Cycle period',Math.round(r.period)+' ms')+B2_tile(424,252,156,'Cycles a second',r.period?fmt(B2_r1(1000/r.period)):'none')+B2_tile(262,304,318,'Firing order',order+(silent.length?` · ${silent.join(', ')} silent`:''),silent.length?C.coral:C.ink);
  out+=B2_note('A simple rate model with this circuit’s main connections; not the crab’s own equations.',372);
  return {svg:out,phase:!eff?'With no modulator the three cells fire in a fixed order, PD then LP then PY, because each silences the others in turn and then tires. This three-phase pattern is the pyloric rhythm.':
   s.mod==='a'?`The modulator acts only on the pacemaker, which now recovers sooner between bursts, so the whole cycle shortens to ${Math.round(r.period)} ms and the followers keep step.`:
   s.mod==='b'?`The modulator makes LP more excitable and slower to tire. Its bursts lengthen${silent.includes('PY')?', PY never gets its turn,':''} and, because LP inhibits the pacemaker, the cycle stretches to ${Math.round(r.period)} ms. Same wiring, a different rhythm.`:
   `The modulator excites PY and weakens the hold LP has on it. PY starts earlier each cycle${silent.includes('LP')?' and LP drops out altogether':''}. Marder’s group found that each of the many modulators reaching this ganglion acts on its own subset of cells, giving many versions of the rhythm.`};
 }});

// A neuron with a slow potassium current that builds up with each spike (spike-frequency adaptation).
// Leaky integrate-and-fire in millivolts above rest: threshold 20, reset 10, membrane time constant 20 ms.
const B2_ADAPT_CACHE={};
function B2_adapt(I,na){
 const key=I+':'+na;if(B2_ADAPT_CACHE[key])return B2_ADAPT_CACHE[key];
 const b=na?.12:1.2,tw=1200,dt=.1,spikes=[],vs=[],ws=[];let v=0,w=0;
 for(let i=0;i<8000;i++){const t=i*dt,drive=t>=100&&t<700?I:0;v+=dt*(-v+drive-w)/20;w+=dt*(-w)/tw;if(v>=20){v=10;w+=b;spikes.push(t)}if(i%10===0){vs.push(v);ws.push(w)}}
 return B2_ADAPT_CACHE[key]={spikes,vs,ws};
}
SCENE({id:'neuromodulation-gain',name:'Turning up a neuron’s response',tag:'Noradrenaline removes a brake',
 definition:'A modulator often acts through a slow, G-protein-coupled receptor that changes one of the neuron’s own ion channels. Many cortical neurons have a potassium current that builds up with each spike and soon quietens them. Noradrenaline, and acetylcholine too, switch much of that current off. The cell is not excited directly; it now answers the same input with many more spikes.',
 example:'Madison and Nicoll (1982) passed a steady current into pyramidal cells in slices of rat hippocampus. Alone, the cell fired a few spikes and stopped. With noradrenaline in the bath, the same current made it fire throughout.',
 desc:'A neuron’s membrane potential during a steady current step, with spikes marked, and beneath it the slow potassium current that builds up. With noradrenaline the build-up is much smaller and the cell keeps firing.',
 research:['Madison & Nicoll (1982). Noradrenaline blocks accommodation of pyramidal cell discharge in the hippocampus. Nature 299, 636–638.','Madison & Nicoll (1984). Control of the repetitive discharge of rat CA1 pyramidal neurones in vitro. Journal of Physiology 354, 319–331.','Marder (2012). Neuromodulation of neuronal circuits: back to the future. Neuron 76, 1–11.'],
 dur:10,hint:'Pass the same current with and without noradrenaline and count the spikes. Then change the current. The sound button plays the spikes as clicks at half speed.',
 init:()=>({I:23,na:0}),
 watch(p){return {I:23,na:p<.5?0:1}},
 ui:[{choose:[[0,'No modulator'],[1,'Noradrenaline']],label:'In the bath',get:s=>s.na,act:'na'},{range:'I',label:'Current passed in',min:21,max:29,get:s=>s.I,act:'I',show:v=>v+' (relative)'},{b:'Hear the spikes ▶',act:'hear'}],
 on:{na(s,v){s.na=+v?1:0},I(s,v){s.I=clamp(Math.round(+v),21,29)},hear(s){B2_click(B2_adapt(s.I,s.na).spikes.map(t=>(t-100)/500),.12);return 'keep'}},
 draw(s,f,X){
  const r=B2_adapt(s.I,s.na),o=B2_adapt(s.I,s.na?0:1),n=r.spikes.length,show=X&&!X.try?clamp((X.p%.5)/.4,0,1)*800:800;
  let out=heading(`${s.na?'With noradrenaline':'No modulator'}: ${n} spike${n===1?'':'s'} from the same current`);
  const pl=B2_plot(70,56,500,150,[0,800],[-6,48],{yt:[[0,'rest'],[20,'threshold']],yl:'membrane potential'});out+=pl.svg;
  out+=L(pl.X(0),pl.Y(20),pl.X(800),pl.Y(20),C.coral,1.2,'stroke-dasharray="5 4"');
  const pts=[];r.vs.forEach((v,i)=>{if(i<=show)pts.push([pl.X(i),pl.Y(v)])});out+=B2_poly(pts,C.blue,1.8);
  for(const t of r.spikes)if(t<=show)out+=L(pl.X(t),pl.Y(20),pl.X(t),pl.Y(44),C.blue,1.8);
  out+=R(pl.X(100),212,pl.X(700)-pl.X(100),8,C.amber,'none',3)+TF(pl.X(400),236,'steady current on for 600 ms',13,C.amber);
  const p2=B2_plot(70,262,500,60,[0,800],[0,8],{xt:[[0,'0'],[200,'200'],[400,'400'],[600,'600'],[800,'800 ms']],yl:'slow potassium current (the brake)'});out+=p2.svg;
  const q=[];r.ws.forEach((w,i)=>{if(i<=show)q.push([p2.X(i),p2.Y(Math.min(8,w))])});out+=B2_poly(q,s.na?C.purple:C.coral,2.4);
  out+=TBF(562,74,`${n} spikes`,14,C.blue,'end')+TF(562,92,`${s.na?'without':'with'} noradrenaline: ${o.spikes.length}`,13,C.muted,'end');
  out+=B2_note('A simple model neuron (leaky integrate-and-fire with a spike-triggered slow current).',364);
  return {svg:out,phase:s.na?`Each spike now adds only a tenth as much of the slow potassium current, so the brake never builds up and the cell fires ${n} times instead of ${o.spikes.length}. Noradrenaline reached this through a G-protein-coupled receptor and a chemical messenger inside the cell. The input was unchanged; the neuron’s responsiveness was turned up.`:
   `The cell fires quickly at first, then each spike adds to a slow potassium current that holds the membrane away from threshold. After the first few spikes it fires rarely or not at all: ${n} spikes in 600 ms. This fading response is called adaptation, or accommodation.`};
 }});

