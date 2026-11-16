/* ===================== Mind era 5 · The brain at work ===================== */
// Spikes, synapses, receptive fields, divided hemispheres, imaging and a brain that rewires itself.
// Every picture is a pure function of state, frame and X. Sound (spike clicks) plays only from on() handlers.
// Simulated data use seeded generators (D5_rng) and are labelled as simulated or illustrative.
const D5_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const D5_rng=n=>rng(D5_mix(n));
function D5_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const D5_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const D5_mean=a=>a.length?sum(a)/a.length:NaN;
function D5_corr(a,b){const n=a.length;if(n<2)return NaN;const ma=D5_mean(a),mb=D5_mean(b);let sab=0,saa=0,sbb=0;for(let i=0;i<n;i++){const x=a[i]-ma,y=b[i]-mb;sab+=x*y;saa+=x*x;sbb+=y*y}return saa&&sbb?sab/Math.sqrt(saa*sbb):NaN}
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function D5_plot(x0,y0,w,h,xr,yr,o={}){
 const lx=!!o.logx,ly=!!o.logy,f=(v,l)=>l?Math.log10(v):v;
 const X=v=>x0+(f(v,lx)-f(xr[0],lx))/(f(xr[1],lx)-f(xr[0],lx))*w,Y=v=>y0+h-(f(v,ly)-f(yr[0],ly))/(f(yr[1],ly)-f(yr[0],ly))*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-7,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// Spike clicks: short noise bursts at the given times (seconds from now). Call only from on() handlers.
function D5_clicks(times){times.forEach(t=>AUDIO.noise({dur:.005,gain:.2,at:t}))}
// A raster of spikes: ticks at times (ms) across a strip.
function D5_raster(times,x0,y0,w,h,span,col=C.ink){let out=R(x0,y0,w,h,'#fff',C.grid,4);times.forEach(t=>{if(t<=span){const x=x0+t/span*w;out+=L(x,y0+5,x,y0+h-5,col,1.8)}});return out}
// Spike times (ms) for a regular-ish train at a rate in Hz, with seeded jitter.
function D5_train(rate,span,seed){const out=[];if(rate<1)return out;const r=D5_rng(seed),T=1000/rate;let t=T*r();while(t<span){out.push(t);t+=T*(.85+.3*r())}return out}

/* =========================== action-potential =========================== */
// A stereotyped membrane voltage (mV) for a stimulus of size a (mV of depolarisation) given at u=0 ms.
// Threshold is −55 mV, so stimuli of 15 mV or more fire a full spike. Schematic, not a fitted model.
const D5_REST=-70,D5_THR=-55;
function D5_V(u,a){
 if(u<0)return D5_REST;
 const top=D5_REST+a;
 if(top<D5_THR){if(u<.5)return D5_REST+a*u/.5;return D5_REST+a*Math.exp(-(u-.5)/2)}
 if(u<.5)return D5_REST+a*u/.5;
 if(u<1.3)return lerp(top,40,smooth((u-.5)/.8));
 if(u<2.8)return lerp(40,-80,smooth((u-1.3)/1.5));
 return D5_REST-10*Math.exp(-(u-2.8)/1.5);
}
const D5_fires=a=>D5_REST+a>=D5_THR;
const D5_AP_WATCH=[6,12,16,24,30];
SCENE({id:'action-potential',name:'Action potential',tag:'All or nothing',
 definition:'An action potential is a brief electrical pulse, about a millisecond long, that travels along a nerve cell once its membrane is pushed past a threshold voltage.',
 example:'A small push of 10 mV fades away. A push of 16 mV or of 30 mV gives exactly the same spike, peaking near +40 mV. A stronger stimulus does not give a bigger spike.',
 desc:'Membrane voltage against time for several stimulus sizes: those below the threshold line fade away, and those above it give identical spikes.',
 research:'Hodgkin & Huxley (1952). A quantitative description of membrane current and its application to conduction and excitation in nerve. Journal of Physiology 117, 500–544. Adrian (1914) and Lucas (1909) on the all-or-none law.',
 dur:10,hint:'Set the stimulus size and press Stimulate. Try values just below and just above 15 mV. A click plays when the cell fires.',
 init:()=>({stim:10,trials:[]}),
 watch(p){const n=1+Math.min(4,Math.floor(p*5));const t=D5_AP_WATCH.slice(0,n);return {stim:t[t.length-1],trials:t}},
 ui:[{range:'stim',label:'Stimulus',min:0,max:30,step:1,get:s=>s.stim,act:'stim',show:v=>v+' mV'},{b:'Stimulate',act:'fire'},{b:'Clear',act:'clear'}],
 on:{stim(s,v){s.stim=Number(v);return 'keep'},fire(s){s.trials.push(s.stim);if(s.trials.length>5)s.trials.shift();if(D5_fires(s.stim))D5_clicks([0]);return 'keep'},clear(s){s.trials=[];return 'keep'}},
 draw(s){
  let out=heading('Below threshold it fades; above threshold it fires');
  const pl=D5_plot(70,56,310,250,[0,8],[-90,50],{xt:[[0,'0'],[2,'2'],[4,'4'],[6,'6'],[8,'8 ms']],yt:[[-80,'−80'],[-55,'−55'],[-30,'−30'],[0,'0'],[40,'+40']],yl:'membrane voltage (mV)'});out+=pl.svg;
  out+=L(pl.X(0),pl.Y(D5_THR),pl.X(8),pl.Y(D5_THR),C.coral,1.6,'stroke-dasharray="6 5"')+TF(pl.X(8)-4,pl.Y(D5_THR)-6,'threshold',13,C.coral,'end');
  out+=L(pl.X(1),pl.Y(-90),pl.X(1),pl.Y(-84),C.amber,3)+TF(pl.X(1),pl.Y(-90)-10,'stimulus',13,C.amber);
  s.trials.forEach((a,i)=>{const last=i===s.trials.length-1,pts=[];for(let k=0;k<=160;k++){const t=k/20;pts.push([pl.X(t),pl.Y(D5_V(t-1,a))])}out+=D5_poly(pts,last?C.blue:'#9cbad0',last?3:1.8)});
  out+=TB(410,74,'Trials',15,C.ink,'start');
  if(!s.trials.length)out+=TF(410,100,'None yet: press Stimulate.',13,C.muted,'start');
  s.trials.forEach((a,i)=>{const y=100+i*28,f=D5_fires(a);out+=R(406,y-17,176,24,i===s.trials.length-1?C.pale:'#f6f9fb','none',6)+TF(414,y,`${a} mV push`,13,C.ink,'start')+TBF(574,y,f?'spike, +40 mV':'no spike',13,f?C.green:C.muted,'end')});
  const a=s.trials.length?s.trials[s.trials.length-1]:s.stim;
  out+=T(300,360,!s.trials.length?`Set a push and press Stimulate.`:D5_fires(a)?'Every spike has the same height: the size of the push no longer matters.':`${a} mV is not enough: −70 + ${a} = ${-70+a} mV stays below −55 mV.`,15,D5_fires(a)?C.green:C.ink);
  const nf=s.trials.filter(D5_fires).length;
  return {svg:out,phase:s.trials.length<2?'The resting membrane sits at about −70 mV. A small push decays; a push to −55 mV or beyond sets off a full spike.':`${nf} of ${s.trials.length} trials fired, and every spike peaked at the same +40 mV. Neurons signal strength by how often they fire, not by how big each spike is. The curve is a schematic of the Hodgkin–Huxley shape, not a fitted squid axon.`};
 }});

const D5_gNa=u=>u>0?Math.pow(u/.9,2)*Math.exp(2*(1-u/.9)):0;
const D5_gK=u=>u>0?.7*Math.pow(u/2.2,3)*Math.exp(3*(1-u/2.2)):0;
function D5_ionPhase(t){if(t<1)return ['At rest','The inside is about 70 mV negative. Pumps keep sodium high outside and potassium high inside.'];
 if(t<1.5)return ['Pushed to threshold','The stimulus nudges the voltage up; a few sodium channels start to open.'];
 if(t<2.3)return ['Rising: sodium rushes in','Voltage-gated sodium channels open fast, Na⁺ floods in, which opens more channels: a runaway rise to about +40 mV.'];
 if(t<3.8)return ['Falling: potassium leaves','Sodium channels inactivate and the slower potassium channels open, so K⁺ flows out and the voltage falls.'];
 if(t<6)return ['Undershoot: refractory','Potassium channels close slowly, so the voltage dips below rest. For a millisecond or two another spike is hard or impossible.'];
 return ['Back to rest','The membrane returns to −70 mV, ready to fire again. Only a tiny fraction of ions moved.']}
SCENE({id:'action-potential-ions',name:'Ion channels',tag:'Sodium in, potassium out',
 definition:'The spike is made by two kinds of voltage-gated channel: fast sodium channels let Na⁺ in to drive the rise, and slower potassium channels let K⁺ out to bring the voltage back down.',
 example:'Hodgkin and Huxley measured these currents in the giant axon of a squid, about half a millimetre wide, and predicted the shape and speed of the spike from their equations.',
 desc:'Voltage over time above the sodium and potassium conductances, with a time cursor and a membrane cartoon showing which channels are open.',
 research:'Hodgkin & Huxley (1952), Journal of Physiology 117, 500–544 (Nobel Prize 1963). Neher & Sakmann (1976) recorded single channels with the patch clamp.',
 dur:12,hint:'Drag the time slider through the spike and watch which channels open, and in which order.',
 init:()=>({t:1.9}),
 watch(p){return {t:8*p}},
 ui:[{range:'t',label:'Time',min:0,max:8,step:.1,get:s=>s.t,act:'t',show:v=>Number(v).toFixed(1)+' ms'}],
 on:{t(s,v){s.t=Number(v);return 'keep'}},
 draw(s){
  const t=s.t,u=t-1;let out=heading('Inside one spike');
  const pv=D5_plot(60,56,300,110,[0,8],[-90,50],{yt:[[-70,'−70'],[40,'+40']],yl:'voltage (mV)'});out+=pv.svg;
  const pts=[];for(let k=0;k<=160;k++){const x=k/20;pts.push([pv.X(x),pv.Y(D5_V(x-1,20))])}out+=D5_poly(pts,C.ink,2.4);
  const pg=D5_plot(60,198,300,110,[0,8],[0,1.1],{xt:[[0,'0'],[2,'2'],[4,'4'],[6,'6'],[8,'8 ms']],yl:'channels open (relative)'});out+=pg.svg;
  const pn=[],pk=[];for(let k=0;k<=160;k++){const x=k/20;pn.push([pg.X(x),pg.Y(D5_gNa(x-1))]);pk.push([pg.X(x),pg.Y(D5_gK(x-1))])}
  out+=D5_poly(pn,C.coral,2.4)+D5_poly(pk,C.blue,2.4)+TBF(pg.X(1.6),pg.Y(1.02),'Na⁺',13,C.coral)+TBF(pg.X(4.6),pg.Y(.62),'K⁺',13,C.blue);
  out+=L(pv.X(t),58,pv.X(t),306,C.amber,2)+Ci(pv.X(t),pv.Y(D5_V(u,20)),5,C.amber);
  // Membrane cartoon.
  const na=D5_gNa(u),k=D5_gK(u);out+=TF(490,64,'outside',13,C.muted)+R(390,140,200,40,C.amberp,'none',4)+TF(490,214,'inside',13,C.muted);
  out+=R(420,132,30,56,na>.2?C.coral:'#fff',C.coral,6)+R(530,132,30,56,k>.2?C.blue:'#fff',C.blue,6);
  out+=TBF(412,165,'Na⁺',13,C.coral,'end')+TBF(568,165,'K⁺',13,C.blue,'start');
  if(na>.2)out+=arrow(435,82,435,204+18*na,C.coral,2+2*na);
  if(k>.2)out+=arrow(545,204,545,98-30*k,C.blue,2+2*k);
  out+=TF(435,236,na>.2?'open':'closed',13,C.coral)+TF(545,236,k>.2?'open':'closed',13,C.blue);
  const [name,say]=D5_ionPhase(t);out+=TBF(490,272,name,14,C.ink);out+=TF(490,296,`${fmt(D5_V(u,20).toFixed(0))} mV`,14,C.muted);
  out+=T(300,360,'Fast sodium up, slower potassium down: that order shapes every spike.',15,C.ink);
  return {svg:out,phase:`${name}. ${say} Conductance curves are schematic.`};
 }});

const D5_rate=I=>I<10?0:250*(1-Math.exp(-(I-10)/35));
SCENE({id:'action-potential-rate',name:'Rate coding',tag:'Stronger means more often',
 definition:'Because every spike is the same size, a neuron signals the strength of a stimulus mainly by its firing rate: how many spikes it sends each second.',
 example:'Adrian hung heavier weights on a frog muscle and found that its stretch receptor fired more often, while each impulse stayed the same size.',
 desc:'A one-second spike train above a curve of firing rate against stimulus strength that rises and levels off, with the current setting marked.',
 research:'Adrian & Zotterman (1926). The impulses produced by sensory nerve endings, Part 2. Journal of Physiology 61, 151–171. Adrian (1928). The Basis of Sensation. The refractory period caps the rate.',
 dur:10,hint:'Change the stimulus strength and press Hear one second: Adrian listened to impulses on a loudspeaker too.',
 init:()=>({I:40}),
 watch(p){return {I:Math.round(5+90*p)}},
 ui:[{range:'I',label:'Stimulus strength',min:0,max:100,step:1,get:s=>s.I,act:'I',show:v=>v+'%'},{b:'Hear one second',act:'hear'}],
 on:{I(s,v){s.I=Number(v);return 'keep'},hear(s){D5_clicks(D5_train(D5_rate(s.I),1000,s.I).map(t=>t/1000));return 'keep'}},
 draw(s){
  const f=D5_rate(s.I),tr=D5_train(f,500,s.I);let out=heading('Strength is coded as spikes per second');
  out+=TF(40,64,'Half a second of spikes',13,C.muted,'start')+D5_raster(tr,40,72,520,44,500)+TF(40,134,'0',13,C.muted,'start')+TF(560,134,'500 ms',13,C.muted,'end');
  const pl=D5_plot(70,170,280,140,[0,100],[0,260],{xt:[[0,'0'],[50,'50'],[100,'100%']],yt:[[0,'0'],[100,'100'],[200,'200']],xl:'stimulus strength',yl:'firing rate (spikes/s)'});out+=pl.svg;
  const pts=[];for(let i=0;i<=100;i++)pts.push([pl.X(i),pl.Y(D5_rate(i))]);out+=D5_poly(pts,C.blue,2.4);
  out+=Ci(pl.X(s.I),pl.Y(f),7,C.coral,'#fff');
  out+=counter(400,176,'firing rate',`${Math.round(f)} spikes/s`,C.coral,170)+counter(400,236,'spikes shown',String(tr.length),C.ink,170);
  out+=TF(485,306,'Spikes are all alike;',13,C.muted)+TF(485,324,'only their timing changes.',13,C.muted);
  return {svg:out,phase:f<1?'Too weak: below the receptor’s threshold the nerve stays silent.':f>200?`Near the ceiling: after each spike the cell is refractory for a moment, so the rate levels off around ${Math.round(D5_rate(100))} spikes a second however strong the stimulus.`:`At ${s.I}% the nerve fires about ${Math.round(f)} times a second. A stronger stimulus packs spikes closer together; the curve is illustrative, but its rise and levelling off follow Adrian’s recordings.`};
 }});

/* =========================== hebbian-synapse =========================== */
const D5_HEBB_W=[['A','A alone'],['AB','A and B together'],['B','B alone']];
function D5_hebbRun(events){let w=.2;const log=[];for(const e of events){const a=e.includes('A')?1:0,b=e.includes('B')?1:0,fired=a*w+b*1.2>=1;if(a&&fired)w=Math.min(1.2,w+.3*(1.2-w));log.push({e,fired,w})}return {w,log}}
SCENE({id:'hebbian-synapse',name:'Hebb’s rule',tag:'Fire together, wire together',
 definition:'Hebb proposed that when one cell repeatedly helps to fire another, the connection between them grows stronger. Learning is a change in the strength of synapses.',
 example:'Input A (a tone) is too weak to fire the cell; input B (food) always does. After A and B arrive together a few times, A alone fires the cell: an association has formed.',
 desc:'Two inputs onto one cell, with the strength of input A drawn as the thickness of its synapse, and a row of the trials so far showing when the cell fired.',
 research:'Hebb (1949). The Organization of Behavior. Wiley. The slogan “cells that fire together wire together” is Carla Shatz’s later paraphrase (1992).',
 dur:12,hint:'Try A alone first, then pair A with B several times, then try A alone again.',
 init:()=>({ev:[]}),
 watch(p){const seq=['A','AB','AB','AB','AB','AB','A'];return {ev:seq.slice(0,1+Math.min(6,Math.floor(p*7)))}},
 ui:D5_HEBB_W.map(([e,l])=>({b:l,act:'go',arg:e})).concat([{b:'Start again',act:'reset'}]),
 on:{go(s,e){s.ev.push(e||'A');if(s.ev.length>12)s.ev.shift();const r=D5_hebbRun(s.ev);if(r.log[r.log.length-1].fired)D5_clicks([0]);return 'keep'},reset(s){s.ev=[];return 'keep'}},
 draw(s,f,X){
  const r=D5_hebbRun(s.ev),last=r.log[r.log.length-1],w=r.log.length>1?r.log[r.log.length-2].w:.2,wNow=r.w;let out=heading('Pairing strengthens the weak input');
  const aOn=last&&last.e.includes('A'),bOn=last&&last.e.includes('B'),fired=last&&last.fired;
  out+=hit(X,'go','A','Fire input A',box(40,72,130,48,'A: tone',aOn?C.amberp:'#fff',C.ink,16,C.amber));
  out+=hit(X,'go','B','Fire input B',box(40,196,130,48,'B: food',bOn?C.greenp:'#fff',C.ink,16,C.green));
  out+=L(170,96,350,150,aOn?C.amber:C.line,2+6*wNow)+L(170,220,350,176,bOn?C.green:C.line,8);
  out+=Ci(352,150,6+8*wNow,C.amber)+Ci(352,176,14,C.green);
  out+=Ci(410,163,46,fired?C.coral:'#fff',C.coral)+TB(410,169,fired?'fires!':'cell',16,fired?'#fff':C.coral);
  out+=L(456,163,560,163,fired?C.coral:C.line,3)+TF(508,153,'output',13,C.muted);
  out+=TBF(230,78,`strength of A: ${wNow.toFixed(2)}`,13,C.amber)+TBF(240,250,'strength of B: 1.20',13,C.green);
  out+=TF(410,232,'fires when total ≥ 1',13,C.muted);
  out+=TF(40,284,'Trials (newest last):',13,C.muted,'start');
  r.log.forEach((l,i)=>{const x=40+i*44;out+=R(x,294,38,30,l.fired?C.coralp:'#f1f4f6',l.fired?C.coral:C.grid,6)+TBF(x+19,314,l.e==='AB'?'A+B':l.e,13,l.fired?C.coral:C.muted)});
  if(!r.log.length)out+=TF(190,314,'none yet',13,C.muted,'start');
  const aAlone=r.log.filter(l=>l.e==='A'),learnt=aAlone.length&&aAlone[aAlone.length-1].fired;
  out+=T(300,362,learnt?'A alone now fires the cell: the pairing was learnt.':wNow>.2?'Each pairing strengthened A a little.':'A alone is too weak to fire the cell.',15,learnt?C.green:C.ink);
  return {svg:out,phase:!last?'Input A starts weak (0.20); input B is strong enough to fire the cell on its own.':learnt?'After pairing, A alone pushes the cell past threshold. This is Hebb’s idea in miniature, and it is how classical conditioning could work at the level of a single synapse.':last.e==='A'&&!last.fired?`A alone gives ${w.toFixed(2)}, below the threshold of 1, so nothing changes: Hebb’s rule needs the cell to fire.`:last.e==='B'?'B fires the cell, but A was silent, so A’s synapse does not change.':`A and B together fire the cell while A is active, so A’s synapse grows from ${w.toFixed(2)} to ${wNow.toFixed(2)}.`};
 }});

function D5_ltpRun(ev){let L=0,ptp=0,tm=0;const pts=[],tets=[];ev.forEach((e,i)=>{if(e==='tet'){L=L<1?80:L+30*(1-L/160);ptp=60;tets.push(tm);return}const r=D5_rng(i*7+3);pts.push([tm,100+L+ptp+4*D5_gauss(r)]);tm+=2;L*=.996;ptp*=.7});return {pts,tets,tm}}
SCENE({id:'hebbian-synapse-ltp',name:'Long-term potentiation',tag:'A synapse that remembers',
 definition:'Long-term potentiation (LTP) is a lasting increase in the strength of a synapse after a brief burst of high-frequency activity: the first physical evidence for Hebb’s idea.',
 example:'In the rabbit hippocampus a one-second 100 Hz burst left the response to a single test pulse larger for hours. The hippocampus matters for memory: patient H.M. lost it and could no longer form new memories.',
 desc:'Response size to single test pulses over time, as a percentage of baseline, with each high-frequency burst marked; after a burst the responses jump and stay high.',
 research:'Bliss & Lømo (1973). Long-lasting potentiation of synaptic transmission in the dentate area of the anaesthetized rabbit following stimulation of the perforant path. Journal of Physiology 232, 331–356. Scoville & Milner (1957) on H.M.',
 dur:12,hint:'Give ten test pulses for a baseline, then a burst, then more test pulses. Simulated responses with small random noise.',
 init:()=>({ev:[]}),
 watch(p){const ev=[];const n=Math.floor(p*42);for(let i=0;i<n;i++)ev.push(i===10?'tet':'test');return {ev}},
 ui:[{b:'Test pulse',act:'test'},{b:'Ten test pulses',act:'ten'},{b:'Burst (100 Hz, 1 s)',act:'tet'},{b:'Start again',act:'reset'}],
 on:{test(s){if(s.ev.length<70)s.ev.push('test');return 'keep'},ten(s){for(let i=0;i<10&&s.ev.length<70;i++)s.ev.push('test');return 'keep'},tet(s){if(s.ev.length<70)s.ev.push('tet');return 'keep'},reset(s){s.ev=[];return 'keep'}},
 draw(s){
  const r=D5_ltpRun(s.ev);let out=heading('One burst, a lasting change');
  const pl=D5_plot(80,58,480,240,[0,120],[60,260],{xt:[[0,'0'],[30,'30'],[60,'60'],[90,'90'],[120,'120 min']],yt:[[100,'100%'],[150,'150%'],[200,'200%'],[250,'250%']],yl:'response size (% of baseline)'});out+=pl.svg;
  out+=L(pl.X(0),pl.Y(100),pl.X(120),pl.Y(100),C.line,1.5,'stroke-dasharray="5 4"');
  r.tets.forEach(t=>{if(t<=120)out+=L(pl.X(t),62,pl.X(t),294,C.coral,2)+TBF(pl.X(t)+4,78,'burst',13,C.coral,'start')});
  r.pts.forEach(([t,v])=>{if(t<=120)out+=Ci(pl.X(t),pl.Y(clamp(v,60,260)),4.5,C.blue)});
  const base=r.pts.filter(p=>!r.tets.length||p[0]<r.tets[0]).map(p=>p[1]),after=r.tets.length?r.pts.filter(p=>p[0]>r.tets[0]+10).map(p=>p[1]):[];
  if(after.length>2)out+=T(320,350,`Baseline ${Math.round(D5_mean(base)||100)}% · after the burst ${Math.round(D5_mean(after))}% and still high`,15,C.ink);
  else out+=T(320,350,r.pts.length?`${r.pts.length} test pulse${r.pts.length>1?'s':''} so far`:'Press Test pulse to measure the synapse.',15,C.muted);
  return {svg:out,phase:!r.tets.length?'Test pulses are single shocks that measure the synapse without changing it, so they sit around 100% of baseline.':'The burst produced a brief extra boost that fades in minutes, then a lasting increase: LTP. In Bliss and Lømo’s rabbits it persisted for hours. A second burst adds less, as the synapse nears a ceiling. Simulated data.'};
 }});

const D5_stdp=dt=>dt>0?80*Math.exp(-dt/17):dt<0?-40*Math.exp(dt/34):0;
SCENE({id:'hebbian-synapse-stdp',name:'Spike timing',tag:'Before strengthens, after weakens',
 definition:'In spike-timing-dependent plasticity, a synapse strengthens if the input spike arrives just before the cell fires and weakens if it arrives just after. Timing within a few tens of milliseconds decides which.',
 example:'An input that fires 10 ms before the cell helped cause it, and grows by roughly half. An input that fires 10 ms after could not have helped, and shrinks.',
 desc:'Two spike trains, input and output, with the time gap between them, above the learning window: weight change against the gap.',
 research:'Markram, Lübke, Frotscher & Sakmann (1997), Science 275, 213–215; Bi & Poo (1998). Synaptic modifications in cultured hippocampal neurons. Journal of Neuroscience 18, 10464–10472. Curve: exponential fit, time constants about 17 and 34 ms (Bi & Poo 2001).',
 dur:10,hint:'Slide the gap. Positive means the input spike came first.',
 init:()=>({dt:10}),
 watch(p){return {dt:Math.round(-60+120*p)}},
 ui:[{range:'dt',label:'Output time − input time',min:-80,max:80,step:2,get:s=>s.dt,act:'dt',show:v=>(v>0?'+':'')+v+' ms'}],
 on:{dt(s,v){s.dt=Number(v);return 'keep'}},
 draw(s){
  const dt=s.dt,dw=D5_stdp(dt);let out=heading('Cause before effect strengthens');
  const x0=300,sc=2.4;out+=TF(60,76,'input',13,C.amber,'start')+TF(60,116,'output',13,C.coral,'start');
  out+=L(110,70,560,70,C.grid,1)+L(110,110,560,110,C.grid,1);
  const xi=x0-dt*sc/2,xo=x0+dt*sc/2;out+=L(xi,56,xi,84,C.amber,4)+L(xo,96,xo,124,C.coral,4);
  if(dt!==0)out+=arrow(xi,94,xo,94,C.muted,1.5,6);
  const pl=D5_plot(90,160,420,150,[-80,80],[-50,90],{xt:[[-80,'−80'],[-40,'−40'],[0,'0'],[40,'+40'],[80,'+80 ms']],yt:[[-40,'−40%'],[0,'0'],[40,'+40%'],[80,'+80%']],yl:'change in synapse strength'});out+=pl.svg;
  out+=L(pl.X(-80),pl.Y(0),pl.X(80),pl.Y(0),C.line,1.2)+L(pl.X(0),pl.Y(-50),pl.X(0),pl.Y(90),C.line,1.2);
  const pp=[],pm=[];for(let k=1;k<=80;k++){pp.push([pl.X(k),pl.Y(D5_stdp(k))]);pm.push([pl.X(-k),pl.Y(D5_stdp(-k))])}out+=D5_poly(pp,C.green,2.4)+D5_poly(pm,C.coral,2.4);
  out+=Ci(pl.X(dt),pl.Y(dw),7,C.ink,'#fff');
  out+=TF(pl.X(46),pl.Y(62),'input first: stronger',13,C.green)+TF(pl.X(-46),pl.Y(-27),'input after: weaker',13,C.coral);
  out+=T(300,360,dt===0?'Simultaneous: no clear change in this simple model.':`${dt>0?'Input first':'Output first'} by ${Math.abs(dt)} ms → ${dw>0?'+':''}${dw.toFixed(0)}% strength`,15,dw>0?C.green:dw<0?C.coral:C.ink);
  return {svg:out,phase:Math.abs(dt)>60?'Spikes this far apart barely change the synapse: the learning window is only a few tens of milliseconds wide.':dt>0?'The input fired just before the cell, so it may have helped cause the spike, and it is strengthened. This makes Hebb’s rule causal rather than just “together”.':dt<0?'The input arrived after the cell had already fired, so it could not have caused it, and it is weakened.':'With no gap the outcome depends on details this sketch leaves out.'};
 }});

/* =========================== receptive-fields =========================== */
const D5_SC=12,D5_SS=36,D5_K=.85;
const D5_g=(d2,s)=>Math.exp(-d2/(2*s*s))/(2*Math.PI*s*s);
function D5_cover(stim,x,r){
 if(stim==='full')return {c:1,s:1};
 const r2=stim==='ring'?r+40:r,step=2;let c=0,sr=0;
 for(let px=-r2;px<=r2;px+=step)for(let py=-r2;py<=r2;py+=step){const d=Math.hypot(px,py);if(d>r2||(stim==='ring'&&d<r))continue;const q=(px+x)**2+py*py;c+=D5_g(q,D5_SC)*step*step;sr+=D5_g(q,D5_SS)*step*step}
 return {c,s:sr};
}
const D5_rfRate=cv=>clamp(8+160*(cv.c-D5_K*cv.s),0,200);
const D5_spotCurve=r=>D5_rfRate({c:1-Math.exp(-r*r/(2*D5_SC*D5_SC)),s:1-Math.exp(-r*r/(2*D5_SS*D5_SS))});
SCENE({id:'receptive-fields',name:'Receptive field',tag:'On in the centre, off around it',
 definition:'A neuron’s receptive field is the patch of the world that changes its firing. Many retinal cells have a centre–surround field: light in the centre excites them and light in the ring around it suppresses them.',
 example:'A small spot on the centre makes an on-centre cell fire fast; flooding the whole field with light barely changes its rate. The cell reports contrast, not brightness.',
 desc:'A receptive field drawn as an excitatory centre and an inhibitory surround, with a spot, ring or whole-field light on it, beside the firing rate and the response against spot size.',
 research:'Kuffler (1953). Discharge patterns and functional organization of mammalian retina. Journal of Neurophysiology 16, 37–68. Model: difference of Gaussians (Rodieck 1965).',
 dur:12,hint:'Change the light’s size and position, and try a ring and the whole field. Press Hear one second to hear the cell.',
 init:()=>({stim:'spot',x:0,r:12}),
 watch(p){return p<.6?{stim:'spot',x:0,r:Math.round(4+90*p/.6)}:p<.8?{stim:'ring',x:0,r:20}:{stim:'full',x:0,r:20}},
 ui:[{choose:[['spot','Spot'],['ring','Ring'],['full','Whole field']],label:'Light',get:s=>s.stim,act:'stim'},{range:'r',label:'Size',min:4,max:90,step:2,get:s=>s.r,act:'r',show:v=>v+' units'},{range:'x',label:'Position',min:-90,max:90,step:5,get:s=>s.x,act:'x',show:v=>v+''},{b:'Hear one second',act:'hear'}],
 on:{stim(s,v){s.stim=v;return 'keep'},r(s,v){s.r=Number(v);return 'keep'},x(s,v){s.x=Number(v);return 'keep'},hear(s){D5_clicks(D5_train(D5_rfRate(D5_cover(s.stim,s.x,s.r)),1000,7).map(t=>t/1000));return 'keep'}},
 draw(s){
  const cv=D5_cover(s.stim,s.x,s.r),rate=D5_rfRate(cv),cx=160,cy=200;let out=heading('What one retinal cell responds to');
  out+=R(40,80,240,240,C.dark,'none',6);
  if(s.stim==='full')out+=R(40,80,240,240,'#f4d27a','none',6);
  else{const lx=cx+s.x;out+=`<clipPath id="d5rf"><rect x="40" y="80" width="240" height="240" rx="6"/></clipPath>`;
   out+=G(s.stim==='ring'?Ci(lx,cy,s.r+20,'none','#f4d27a','stroke-width="40"'):Ci(lx,cy,s.r,'#f4d27a'),'clip-path="url(#d5rf)"')}
  out+=Ci(cx,cy,D5_SS*2,'none',C.coral,'stroke-dasharray="6 5" stroke-width="2"')+Ci(cx,cy,D5_SC*2,'none',C.green,'stroke-width="2.5"');
  out+=TBF(cx,cy+6,'+',18,C.green)+TBF(cx+50,cy-44,'−',18,C.coral)+TBF(cx-50,cy+56,'−',18,C.coral);
  out+=TF(160,342,'green: excitatory centre · coral: inhibitory surround',13,C.muted);
  const tr=D5_train(rate,500,7);out+=TF(310,66,'Firing, half a second',13,C.muted,'start')+D5_raster(tr,310,74,260,40,500);
  out+=counter(310,124,'firing rate',`${Math.round(rate)} spikes/s`,rate>60?C.green:rate<12?C.coral:C.ink,260);
  const pl=D5_plot(350,206,220,104,[0,90],[0,140],{xt:[[0,'0'],[45,'45'],[90,'90']],yt:[[0,'0'],[100,'100']],xl:'centred spot size',xlDy:31,yl:'rate for a centred spot'});out+=pl.svg;
  const pts=[];for(let r=0;r<=90;r+=2)pts.push([pl.X(r),pl.Y(D5_spotCurve(r))]);out+=D5_poly(pts,C.blue,2.2);
  if(s.stim==='spot'&&s.x===0)out+=Ci(pl.X(s.r),pl.Y(D5_spotCurve(s.r)),6,C.coral,'#fff');
  return {svg:out,phase:s.stim==='full'?`Light everywhere excites the centre and suppresses the surround almost equally, so the cell fires only ${Math.round(rate)} spikes a second. Uniform light carries little news.`:s.stim==='ring'?`Light on the surround alone suppresses the cell (${Math.round(rate)} spikes/s). Darkness in the centre with light around it is what an off-centre cell would like.`:Math.abs(s.x)>60?'The spot is outside the field, so the cell carries on at its slow background rate.':`A spot of size ${s.r} gives ${Math.round(rate)} spikes/s. The best response comes from a spot that just fills the centre (about 28 units); bigger spots spill onto the surround and the rate falls.`};
 },
 three(s,f,X,project){
  const N=24,span=100,u=v=>v/25,Pj=project([[-4,-4,-1],[4,4,-1],[-4,4,2.8],[4,-4,2.8]]);
  const h=(x,y)=>{const d2=x*x+y*y;return 2.6*(D5_g(d2,D5_SC)-D5_K*D5_g(d2,D5_SS))/(D5_g(0,D5_SC)-D5_K*D5_g(0,D5_SS))};
  let out='';for(let j=0;j<=N;j++){const pts=[];for(let i=0;i<=N;i++){const x=-span+i*2*span/N,y=-span+j*2*span/N;const p=Pj([u(x),u(y),h(x,y)]);pts.push([p[0],p[1]])}out+=D5_poly(pts,j%2?'#9ab5c7':C.blue,1.2)}
  for(let i=0;i<=N;i+=2){const pts=[];for(let j=0;j<=N;j++){const x=-span+i*2*span/N,y=-span+j*2*span/N;const p=Pj([u(x),u(y),h(x,y)]);pts.push([p[0],p[1]])}out+=D5_poly(pts,'#c4d4de',.8)}
  return {svg:out,title:'The receptive field as a surface',caption:'Height is how much light at each point excites the cell: a tall peak in the centre ringed by a shallow trough of inhibition, the “Mexican hat”.'};
 }});

const D5_PREF=60;
const D5_oriRate=a=>{let d=Math.abs(((a-D5_PREF)%180+180)%180);d=Math.min(d,180-d);return 4+56*Math.exp(-d*d/(2*20*20))};
SCENE({id:'receptive-fields-orientation',name:'Orientation tuning',tag:'A cell for each angle',
 definition:'Cells in the primary visual cortex respond best to an edge or bar at one particular angle. Their firing falls off as the bar is rotated away from it.',
 example:'Hubel and Wiesel found their first such cell by accident: it fired as the edge of a glass slide slid into the projector, not to the spots on the slide.',
 desc:'An elongated receptive field with a light bar at an adjustable angle, the cell’s spikes, and its tuning curve with the angles tried so far.',
 research:'Hubel & Wiesel (1959). Receptive fields of single neurones in the cat’s striate cortex. Journal of Physiology 148, 574–591 (Nobel Prize 1981). Hubel (1981), Nobel lecture, on the glass-slide discovery.',
 dur:12,hint:'Rotate the bar, then press Hear one second. Each angle you try is added to the tuning curve.',
 init:()=>({ang:0,tried:[0]}),
 watch(p){const ang=Math.min(180,Math.floor(p*13)*15);const tried=[];for(let a=0;a<=ang;a+=15)tried.push(a);return {ang,tried}},
 ui:[{range:'ang',label:'Bar angle',min:0,max:180,step:15,get:s=>s.ang,act:'ang',show:v=>v+'°'},{b:'Hear one second',act:'hear'},{b:'Clear curve',act:'clear'}],
 on:{ang(s,v){s.ang=Number(v);if(!s.tried.includes(s.ang))s.tried.push(s.ang);return 'keep'},hear(s){D5_clicks(D5_train(D5_oriRate(s.ang),1000,s.ang+1).map(t=>t/1000));return 'keep'},clear(s){s.tried=[s.ang];return 'keep'}},
 draw(s){
  const rate=D5_oriRate(s.ang),cx=150,cy=190;let out=heading('A cell that likes one angle');
  out+=R(40,80,220,220,C.dark,'none',6);
  out+=G(`<ellipse cx="${cx}" cy="${cy}" rx="22" ry="80" fill="none" stroke="${C.green}" stroke-width="2.5"/><ellipse cx="${cx-40}" cy="${cy}" rx="16" ry="70" fill="none" stroke="${C.coral}" stroke-width="2" stroke-dasharray="5 4"/><ellipse cx="${cx+40}" cy="${cy}" rx="16" ry="70" fill="none" stroke="${C.coral}" stroke-width="2" stroke-dasharray="5 4"/>`,`transform="rotate(${-(D5_PREF-90)} ${cx} ${cy})"`);
  out+=G(R(cx-90,cy-8,180,16,'#f4d27a','none',3),`transform="rotate(${-s.ang} ${cx} ${cy})"`);
  out+=TF(150,322,`bar at ${s.ang}° · cell prefers ${D5_PREF}°`,13,C.muted);
  out+=TF(300,66,'Firing, half a second',13,C.muted,'start')+D5_raster(D5_train(rate,500,s.ang+1),300,74,270,40,500);
  const pl=D5_plot(330,150,240,150,[0,180],[0,70],{xt:[[0,'0°'],[60,'60°'],[120,'120°'],[180,'180°']],yt:[[0,'0'],[30,'30'],[60,'60']],xl:'bar angle',yl:'spikes per second'});out+=pl.svg;
  const pts=[];for(let a=0;a<=180;a+=3)pts.push([pl.X(a),pl.Y(D5_oriRate(a))]);out+=D5_poly(pts,C.line,1.6,'stroke-dasharray="5 4"');
  s.tried.slice().sort((a,b)=>a-b).forEach(a=>out+=Ci(pl.X(a),pl.Y(D5_oriRate(a)),5,a===s.ang?C.coral:C.blue));
  out+=T(300,366,`${Math.round(rate)} spikes/s at ${s.ang}°`,15,rate>40?C.green:C.ink);
  return {svg:out,phase:rate>40?`Near the preferred angle the bar covers the excitatory strip and misses the inhibitory flanks, so the cell fires hard. Other cells nearby prefer other angles; together they tile every orientation.`:`Turned away from ${D5_PREF}°, the bar crosses both excitatory and inhibitory zones and the cell barely responds. The tuning curve is an illustrative bell, about 20° wide.`};
 }});

const D5_HIER=[
 ['Retina and thalamus','Centre–surround cells respond to spots of light and dark.','Kuffler (1953)'],
 ['Simple cell','A row of centre–surround inputs in a line makes a cell tuned to a bar at one angle and position.','Hubel & Wiesel (1962)'],
 ['Complex cell','Several simple cells with the same angle at different positions make a cell that likes the angle anywhere in a patch.','Hubel & Wiesel (1962)'],
 ['Higher visual areas','Further along, cells respond to hands, faces or particular people, but each concept is carried by many sparse cells, not one “grandmother cell”.','Gross et al. (1972); Quiroga et al. (2005)'],
 ['Artificial networks','The same stacked design, local filters then pooling, inspired the neocognitron and today’s convolutional networks: inspired by the brain, not a copy of it.','Fukushima (1980); LeCun et al. (1989)']];
SCENE({id:'receptive-fields-hierarchy',name:'A hierarchy of features',tag:'Spots, bars, objects',
 definition:'Visual cells are arranged in stages: each stage combines the outputs of the one before, so receptive fields grow larger and respond to more complex features.',
 example:'Three spot detectors in a line make a bar detector; bar detectors at nearby positions make a detector that does not care exactly where the bar is.',
 desc:'Five stages from centre–surround cells to object cells and artificial networks, each drawn as inputs converging on one output.',
 research:'Hubel & Wiesel (1962). Receptive fields, binocular interaction and functional architecture in the cat’s visual cortex. Journal of Physiology 160, 106–154. Quiroga, Reddy, Kreiman, Koch & Fried (2005). Invariant visual representation by single neurons in the human brain. Nature 435, 1102–1107.',
 dur:12,hint:'Step through the stages. Each one is built from the one before.',
 init:()=>({}),
 trace(){return D5_HIER.map((h,i)=>({i,say:`${h[0]}: ${h[1]} (${h[2]})`}))},
 draw(s,f){
  const i=f?f.i:0;let out=heading('Each stage builds on the one before');
  D5_HIER.forEach((h,k)=>{const x=20+k*114;out+=R(x,48,106,34,k===i?C.blue:k<i?C.pale:'#fff',C.blue,8)+TF(x+53,70,['Retina','Simple','Complex','Higher','Networks'][k],13,k===i?'#fff':C.ink)});
  const cs=(x,y,r=16)=>Ci(x,y,r*2,'#fdf3ee',C.coral,'stroke-dasharray="4 3"')+Ci(x,y,r,C.greenp,C.green);
  const cell=(x,y,label)=>Ci(x,y,26,'#fff',C.blue)+TBF(x,y+5,label,13,C.blue);
  if(i===0){[150,300,450].forEach(x=>out+=cs(x,190));out+=TF(300,268,'Each cell: a spot in the centre excites, a ring around it inhibits.',13,C.muted)}
  if(i===1){[200,260,320].forEach((y,k)=>out+=cs(150,y-60,15)+L(182,y-60,400,200,C.line,2));out+=R(135,108,30,164,'none',C.amber,4,'stroke-width="2"')+cell(430,200,'simple')+TF(150,300,'three inputs in a column',13,C.muted)+TF(430,246,'fires for a vertical bar here',13,C.muted)}
  if(i===2){[110,200,290].forEach((x,k)=>{out+=R(x-10,110,20,90,'#f4d27a','none',3)+Ci(x,230,22,'#fff',C.blue)+TF(x,235,'simple',13,C.blue)+L(x,252,450,300,C.line,2)});out+=cell(470,300,'complex')+TF(200,96,'the same bar angle at three positions',13,C.muted)}
  if(i===3){out+=R(70,110,200,170,'#fff',C.grid,8);[[110,150],[160,150],[210,150],[110,220],[160,220],[210,220]].forEach(([x,y],k)=>out+=Ci(x,y,14,k===1||k===5?C.coral:'#e8eef2',k===1||k===5?C.coral:C.grid));out+=TF(170,300,'a few of many cells fire for one face',13,C.muted);
   out+=Ci(420,190,64,'#fff',C.ink)+Ci(398,170,8,C.ink)+Ci(442,170,8,C.ink)+P('M392 220 Q420 240 448 220',C.ink,3)+TF(420,286,'sparse, not a single cell',13,C.muted)}
  if(i===4){const col=[110,250,390,520],n=[5,4,3,1];col.forEach((x,c)=>{for(let k=0;k<n[c];k++){const y=200+(k-(n[c]-1)/2)*44;out+=R(x-18,y-14,36,28,c===3?C.blue:C.pale,C.blue,6);if(c<3)for(let m=0;m<n[c+1];m++){const y2=200+(m-(n[c+1]-1)/2)*44;out+=L(x+18,y,col[c+1]-18,y2,'#c8d7e1',1)}}});
   ['filters','pool','features','label'].forEach((l,c)=>out+=TF(col[c],320,l,13,C.muted))}
  out+=T(300,362,D5_HIER[i][2],14,C.muted);
  return {svg:out,phase:`${D5_HIER[i][0]}: ${D5_HIER[i][1]}`};
 }});

function D5_hermann(wavy){
 let out=R(40,60,280,280,'#111','none',2);const w=14,sq=(280-4*w)/5,lines=[1,2,3,4].map(k=>40+k*sq+(k-.5)*w);
 lines.forEach(v=>{if(!wavy){out+=L(40,v,320,v,'#fff',w,'stroke-linecap="butt"')+L(v,60,v,340,'#fff',w,'stroke-linecap="butt"')}
  else{const ph=[],pv=[];for(let k=0;k<=56;k++){const t=k*5;ph.push([40+t,v+6*Math.sin(t/14)]);pv.push([v+6*Math.sin(t/14),60+t])}out+=D5_poly(ph,'#fff',w,'stroke-linecap="butt"')+D5_poly(pv,'#fff',w,'stroke-linecap="butt"')}});
 return out;
}
SCENE({id:'receptive-fields-hermann',name:'The Hermann grid',tag:'A textbook explanation, tested',
 definition:'In the Hermann grid, ghostly grey dots appear at the crossings of white streets between black squares. For decades textbooks explained them with centre–surround receptive fields.',
 example:'The classic account says a field centred on a crossing has more light on its inhibitory surround than one on a street, so crossings look darker. Bending the streets slightly should not matter to that account, yet the dots largely vanish.',
 desc:'A Hermann grid with straight or gently wavy white streets, beside the learner’s yes or no answers and the published result.',
 research:'Hermann (1870); Baumgartner (1960), centre–surround account; Schiller & Carvey (2005). The Hermann grid illusion revisited. Perception 34, 1375–1397; Geier, Bernáth, Hudák & Séra (2008). Straightness as the main factor of the Hermann grid illusion. Perception 37, 651–665.',
 dur:10,hint:'Look at each grid without staring at one crossing, then answer. Your answers stay on this page.',
 init:()=>({grid:'straight',ans:{}}),
 watch(p){return p<.5?{grid:'straight',ans:{straight:'yes'},sim:true}:{grid:'wavy',ans:{straight:'yes',wavy:'no'},sim:true}},
 ui:[{choose:[['straight','Straight streets'],['wavy','Wavy streets']],label:'Grid',get:s=>s.grid,act:'grid'},{b:'I see grey dots',act:'yes'},{b:'No grey dots',act:'no'}],
 on:{grid(s,v){s.grid=v;return 'keep'},yes(s){s.ans[s.grid]='yes';return 'keep'},no(s){s.ans[s.grid]='no';return 'keep'}},
 draw(s){
  let out=heading('Do you see grey dots at the crossings?');out+=D5_hermann(s.grid==='wavy');
  out+=TB(350,84,s.sim?'Simulated viewer (Watch)':'Your answers',15,C.ink,'start');
  [['straight','Straight streets'],['wavy','Wavy streets']].forEach(([k,l],i)=>{const a=s.ans[k],y=114+i*34;out+=R(346,y-20,228,28,k===s.grid?C.pale:'#f6f9fb','none',6)+TF(354,y,l,13,C.ink,'start')+TBF(566,y,a==='yes'?'dots':a==='no'?'no dots':'—',13,a==='yes'?C.coral:a==='no'?C.green:C.muted,'end')});
  out+=TB(350,204,'Published result',15,C.ink,'start');
  ['Most viewers see dots on the','straight grid and few or none when','the streets bend. A centre–surround','cell would respond about the same','either way, so it cannot be the','whole story.'].forEach((l,i)=>out+=TF(350,228+i*20,l,13,C.muted,'start'));
  const both=s.ans.straight&&s.ans.wavy,match=s.ans.straight==='yes'&&s.ans.wavy==='no';
  out+=T(300,366,both?(match?'Your answers match the published pattern.':'Your answers differ from the usual pattern; people vary.'):'Answer for both grids.',14,both?(match?C.green:C.amber):C.muted);
  return {svg:out,phase:'Receptive fields are real, but this famous illusion turned out to be a poor example of them. Geier and colleagues showed that straightness matters, which points to later stages of processing. A good reminder to test even textbook explanations.'};
 }});

/* =========================== split-brain =========================== */
const D5_SB_OUT={
 'L-say-cut':['“I didn’t see anything.”',C.coral,'The word reached only the right hemisphere, which cannot speak in most people.'],
 'L-left-cut':['Left hand picks the key',C.green,'The right hemisphere saw the word and controls the left hand, so it finds the key by touch, though the patient cannot name it.'],
 'L-right-cut':['Right hand guesses',C.coral,'The right hand is run by the left hemisphere, which never saw the word.'],
 'R-say-cut':['“Key.”',C.green,'The word reached the left hemisphere, which holds speech in most people.'],
 'R-left-cut':['Left hand guesses',C.coral,'The left hand is run by the right hemisphere, which never saw the word.'],
 'R-right-cut':['Right hand picks the key',C.green,'The left hemisphere saw the word and controls the right hand.'],
 'intact':['Says “key” and either hand finds it',C.green,'With the corpus callosum intact, the two hemispheres share what each one sees within milliseconds.']};
SCENE({id:'split-brain',name:'The split brain',tag:'Two hemispheres, cut apart',
 definition:'Each hemisphere sees the opposite half of the visual field and controls the opposite hand. When the corpus callosum that joins them is cut, information shown to one side stays on that side.',
 example:'Flash KEY to the left of a split-brain patient’s fixation point. They say they saw nothing, yet their left hand picks out a key from objects hidden behind a screen.',
 desc:'A view from above of the two hemispheres and the pathways from each half of the visual field, with the corpus callosum intact or cut, and the patient’s response.',
 research:'Gazzaniga, Bogen & Sperry (1962). Some functional effects of sectioning the cerebral commissures in man. PNAS 48, 1765–1769; Sperry (1968). Hemisphere deconnection and unity in conscious awareness. American Psychologist 23, 723–733 (Nobel Prize 1981).',
 dur:12,hint:'Choose where the word appears, whether the callosum is cut, and how the patient responds. Words are flashed for under 0.2 s so the eyes cannot move to them.',
 init:()=>({field:'L',cc:'cut',resp:'say'}),
 watch(p){return [{field:'L',cc:'cut',resp:'say'},{field:'L',cc:'cut',resp:'left'},{field:'R',cc:'cut',resp:'say'},{field:'L',cc:'intact',resp:'say'}][Math.min(3,Math.floor(p*4))]},
 ui:[{choose:[['L','Left of centre'],['R','Right of centre']],label:'Word appears',get:s=>s.field,act:'field'},{choose:[['cut','Cut'],['intact','Intact']],label:'Corpus callosum',get:s=>s.cc,act:'cc'},{choose:[['say','Say it'],['left','Left hand'],['right','Right hand']],label:'Response',get:s=>s.resp,act:'resp'}],
 on:{field(s,v){s.field=v;return 'keep'},cc(s,v){s.cc=v;return 'keep'},resp(s,v){s.resp=v;return 'keep'}},
 draw(s){
  const out0=s.cc==='intact'?D5_SB_OUT.intact:D5_SB_OUT[`${s.field}-${s.resp}-cut`];let out=heading('What one hemisphere sees, the other may not');
  out+=R(140,46,320,40,'#fff',C.grid,6)+TBF(300,72,'+',16,C.ink)+TBF(s.field==='L'?210:390,72,'KEY',16,C.blue);
  out+=TF(210,104,'left visual field',13,C.muted)+TF(390,104,'right visual field',13,C.muted);
  out+=`<ellipse cx="240" cy="220" rx="72" ry="92" fill="${C.purplep}" stroke="${C.purple}" stroke-width="2"/><ellipse cx="360" cy="220" rx="72" ry="92" fill="${C.greenp}" stroke="${C.green}" stroke-width="2"/>`;
  out+=TBF(222,178,'left',13,C.purple)+TBF(222,196,'hemisphere',13,C.purple)+TBF(378,178,'right',13,C.green)+TBF(378,196,'hemisphere',13,C.green);
  out+=R(210,226,70,26,'#fff',C.purple,6)+TF(245,244,'speech',13,C.purple);
  out+=s.cc==='intact'?R(292,150,16,140,C.blue,'none',4):R(292,150,16,60,C.blue,'none',4)+R(292,230,16,60,C.blue,'none',4)+L(286,220,314,220,C.coral,3);
  out+=TF(300,326,s.cc==='intact'?'corpus callosum intact':'corpus callosum cut',13,s.cc==='intact'?C.blue:C.coral);
  const sx=s.field==='L'?210:390,hx=s.field==='L'?380:220;out+=P(`M${sx} 112 Q300 140 ${hx} 290`,C.amber,3,'none','stroke-dasharray="7 5"');
  out+=TF(70,170,'left hand:',13,C.ink)+TF(70,188,'run by right',13,C.green)+TF(70,206,'hemisphere',13,C.green);
  out+=TF(530,170,'right hand:',13,C.ink)+TF(530,188,'run by left',13,C.purple)+TF(530,206,'hemisphere',13,C.purple);
  out+=R(60,340,480,34,'#fff',out0[1],8)+TB(300,363,out0[0],15,out0[1]);
  return {svg:out,phase:out0[2]+(s.cc==='cut'?' In everyday life such patients seem remarkably ordinary, because moving the eyes sends the world to both sides.':'')};
 }});

const D5_INTERP=[
 ['Two pictures, two hemispheres','A chicken claw is flashed to the right visual field (left hemisphere); a snowy scene to the left visual field (right hemisphere).'],
 ['Each hand chooses','From a row of cards, the right hand picks a chicken (for the claw) and the left hand picks a shovel (for the snow). Both choices are sensible.'],
 ['“Why the shovel?”','The speaking left hemisphere never saw the snow, but it sees the left hand holding a shovel.'],
 ['The interpreter','The patient answers at once: “The chicken claw goes with the chicken, and you need a shovel to clean out the chicken shed.” A confident, made-up story.']];
SCENE({id:'split-brain-interpreter',name:'The interpreter',tag:'A story for what you did',
 definition:'Gazzaniga called it the interpreter: a left-hemisphere system that explains our own actions, even inventing plausible reasons when it does not know the real cause.',
 example:'A split-brain patient explained a choice made by his silent right hemisphere with a fluent, wrong reason, and showed no sign of noticing that he was guessing.',
 desc:'The chicken-claw and snow-scene experiment in four steps: the two pictures, each hand’s choice, the question, and the invented answer.',
 research:'Gazzaniga & LeDoux (1978). The Integrated Mind. Plenum; Gazzaniga (2000). Cerebral specialization and interhemispheric communication. Brain 123, 1293–1326. Debate continues: Pinto et al. (2017), Brain 140, 1231–1237, found less division than the classic picture.',
 dur:12,hint:'Step through the experiment.',
 init:()=>({}),
 trace(){return D5_INTERP.map((h,i)=>({i,say:`${h[0]}: ${h[1]}`}))},
 draw(s,f){
  const i=f?f.i:0;let out=heading(D5_INTERP[i][0]);
  const claw=(x,y)=>L(x,y-20,x,y+16,C.amber,4)+L(x,y+16,x-16,y+30,C.amber,3)+L(x,y+16,x,y+32,C.amber,3)+L(x,y+16,x+16,y+30,C.amber,3);
  const snow=(x,y)=>P(`M${x-26} ${y} L${x} ${y-24} L${x+26} ${y} Z`,C.ink,2,'#fff')+R(x-20,y,40,28,'#fff',C.ink,2)+[[-34,-28],[30,-30],[-8,-38],[36,6],[-36,10]].map(([a,b])=>Ci(x+a,y+b,3,C.blue)).join('');
  out+=R(150,52,300,72,'#fff',C.grid,8)+TBF(300,92,'+',16,C.ink)+snow(210,90)+claw(390,82);
  out+=TF(210,140,'to the right hemisphere',13,C.green)+TF(390,140,'to the left hemisphere',13,C.purple);
  if(i>=1){const cards=[['chicken',C.amber],['shovel',C.blue],['toaster',C.muted],['apple',C.muted]];cards.forEach(([n,c],k)=>{const x=120+k*120,picked=(n==='chicken'||n==='shovel');out+=R(x-46,170,92,52,picked?(n==='chicken'?C.amberp:C.pale):'#fff',picked?c:C.grid,8)+TF(x,201,n,14,picked?C.ink:C.muted)});
   out+=TF(120,244,'right hand ↑',13,C.purple)+TF(240,244,'left hand ↑',13,C.green)}
  if(i>=2)out+=R(60,262,200,40,'#fff',C.grid,8)+TF(160,287,'Examiner: “Why the shovel?”',13,C.ink);
  if(i>=3){out+=R(150,312,440,56,C.purplep,C.purple,10);out+=TF(370,334,'“The chicken claw goes with the chicken, and you',13,C.ink)+TF(370,354,'need a shovel to clean out the chicken shed.”',13,C.ink)}
  return {svg:out,phase:`${D5_INTERP[i][1]}${i===3?' We all do a milder version: people readily give reasons for choices that were actually swayed by things they did not notice (Nisbett & Wilson 1977).':''}`};
 }});

// Chimeric faces: each face is half smiling, half neutral; the pair are mirror images.
function D5_face(cx,cy,smileLeft,v){
 const r=46+v%3*3,ey=cy-12,sx=smileLeft?-1:1,my=cy+22;let out=Ci(cx,cy,r,'#fbe9d6',C.ink);
 out+=Ci(cx-17,ey,4.5+v%2,C.ink)+Ci(cx+17,ey,4.5+v%2,C.ink)+L(cx,ey+8,cx-2,cy+10,'#c8a98e',2);
 out+=P(`M${cx} ${my} Q${cx+sx*14} ${my+10} ${cx+sx*26} ${my-6}`,C.ink,3)+P(`M${cx} ${my} L${cx-sx*24} ${my+1}`,C.ink,3);
 return out;
}
const D5_CH_N=8;
const D5_chOrder=seed=>shuffled([1,1,1,1,0,0,0,0],D5_mix(seed));
SCENE({id:'split-brain-chimeric',name:'Chimeric faces',tag:'Which face looks happier?',
 definition:'A chimeric face is half smiling and half neutral. Shown a face and its mirror image, most right-handed people judge the one smiling on their left side as happier: a sign that the right hemisphere leads in reading facial emotion.',
 example:'The two faces carry exactly the same smile, only flipped. Yet in free viewing about two-thirds of choices typically go to the face whose smile falls in the viewer’s left visual field.',
 desc:'Two mirror-image chimeric faces stacked one above the other; the learner picks the happier one over eight trials, and the tally of left-side choices is compared with the published bias.',
 research:'Levy, Heller, Banich & Burton (1983). Asymmetry of perception in free viewing of chimeric faces. Brain and Cognition 2, 404–419. The bias is weaker in many left-handers and in readers of right-to-left scripts (Vaid & Singh 1989, Neuropsychologia 27, 1277–1287).',
 dur:12,hint:'Press the face that looks happier. Eight trials; answer quickly. Your choices stay on this page.',
 init:()=>({seed:1,i:0,left:0}),
 watch(p){const n=Math.min(D5_CH_N,Math.floor(p*9));return {seed:1,i:n,left:Math.round(n*.72),sim:true}},
 ui:[{b:'Top face',act:'pick',arg:'top'},{b:'Bottom face',act:'pick',arg:'bottom'},{b:'Start again',act:'again'}],
 on:{pick(s,w){if(s.i>=D5_CH_N)return 'keep';const topLeft=D5_chOrder(s.seed)[s.i]===1;if((w==='top')===topLeft)s.left++;s.i++;return 'keep'},again(s){s.seed=nextSeed();s.i=0;s.left=0;return 'keep'}},
 draw(s,f,X){
  let out=heading('Which face looks happier?');
  if(s.i<D5_CH_N){const topLeft=D5_chOrder(s.seed)[s.i]===1;
   out+=hit(X,'pick','top','Top face',R(70,52,200,140,'#fff',C.grid,10)+D5_face(170,122,topLeft,s.i));
   out+=hit(X,'pick','bottom','Bottom face',R(70,204,200,140,'#fff',C.grid,10)+D5_face(170,274,!topLeft,s.i));
   out+=TF(170,364,`Trial ${s.i+1} of ${D5_CH_N}`,13,C.muted)}
  else out+=R(70,52,200,292,'#f6f9fb','none',10)+TB(170,190,'Done',18,C.ink)+TF(170,216,'Press Start again',13,C.muted)+TF(170,234,'for a new order.',13,C.muted);
  out+=TB(310,76,s.sim?'Simulated viewer (Watch)':'Your choices',15,C.ink,'start');
  const n=s.i,pct=n?s.left/n:0;
  out+=R(310,96,260,30,'#f1f4f6','none',6)+R(310,96,260*pct,30,C.purple,'none',6)+L(310+260*.67,90,310+260*.67,132,C.ink,2,'stroke-dasharray="4 3"');
  out+=TF(310,148,n?`${s.left} of ${n} chose the smile on your left (${Math.round(pct*100)}%)`:'No choices yet',13,C.ink,'start');
  out+=TF(310+260*.67,86,'typical ≈ 2/3',13,C.muted);
  ['A smile on your left reaches the right','hemisphere first. If you had no bias,','you would choose each side about half','the time. The faces are mirror images,','so nothing else differs between them.'].forEach((l,i)=>out+=TF(310,186+i*21,l,13,C.muted,'start'));
  return {svg:out,phase:n<D5_CH_N?'Each pair is one face and its mirror image: the same half-smile, on opposite sides. The order of top and bottom is shuffled.':pct>.6?'Like most right-handers, you favoured the smile on your left. Eight trials are few, so treat this as a demonstration, not a measurement.':pct<.4?'You favoured the smile on your right. That is less common but within normal variation, especially in left-handers and readers of right-to-left scripts.':'You showed little bias either way. With only eight trials, chance alone can hide a modest bias.'};
 }});

const D5_MYTHS=[
 ['Language is mostly left-hemisphere in right-handers','s','Supported: about 95% of right-handers have language mainly on the left; the share falls in left-handers (Knecht et al. 2000).'],
 ['People are either left-brained or right-brained','m','Myth: in over a thousand brain scans, people did not have one generally stronger hemisphere (Nielsen et al. 2013).'],
 ['Each hemisphere mainly moves the opposite hand','s','Supported: the motor pathways cross, so the left hemisphere controls the right hand and vice versa.'],
 ['Creativity lives in the right hemisphere','m','Myth: creative tasks draw on widespread networks in both hemispheres (Dietrich & Kanso 2010).'],
 ['Faces are processed more by the right hemisphere','s','Supported: face-selective areas are usually larger and stronger on the right (Kanwisher et al. 1997).'],
 ['Cutting the callosum wrecks everyday life','m','Myth: split-brain patients usually seem ordinary day to day; the split shows up in careful tests (Sperry 1968).']];
SCENE({id:'split-brain-myths',name:'Left brain, right brain',tag:'Sort the facts from the myths',
 definition:'The hemispheres do specialise for some functions, such as language and face processing, but the popular idea of left-brained logical people and right-brained creative people is not supported.',
 example:'Language is strongly lateralised in most people, yet a large scan study found no sign that individuals are “left-brained” or “right-brained” overall.',
 desc:'Six claims about the hemispheres, each to be sorted as supported or myth, with the evidence revealed after each answer.',
 research:'Nielsen, Zielinski, Ferguson, Lainhart & Anderson (2013). An evaluation of the left-brain vs. right-brain hypothesis with resting state functional connectivity MRI. PLoS ONE 8(8), e71275; Knecht et al. (2000), Brain 123, 2512–2518.',
 dur:12,hint:'For each claim, press Supported or Myth.',
 init:()=>({ans:{},last:-1}),
 watch(p){const n=Math.min(6,Math.floor(p*7)),ans={};for(let i=0;i<n;i++)ans[i]=D5_MYTHS[i][1];return {ans,last:n-1}},
 ui:[{b:'Clear answers',act:'clear'}],
 on:{ans(s,a){const [i,v]=String(a).split(':');s.ans[Number(i)]=v;s.last=Number(i);return 'keep'},clear(s){s.ans={};s.last=-1;return 'keep'}},
 draw(s,f,X){
  let out=heading('Supported, or a myth?');let right=0,done=0;
  D5_MYTHS.forEach(([c,k],i)=>{const y=52+i*44,a=s.ans[i];if(a){done++;if(a===k)right++}
   out+=R(20,y,560,38,i===s.last?C.pale:'#fff',C.grid,8)+TF(32,y+24,c,13,C.ink,'start');
   [['s','Supported',388],['m','Myth',494]].forEach(([v,l,x])=>{const chosen=a===v,ok=a&&v===k;out+=hit(X,'ans',`${i}:${v}`,`${c}: ${l}`,R(x,y+5,v==='s'?100:76,28,chosen?(a===k?C.green:C.coral):a&&ok?C.greenp:'#f1f4f6',chosen?'none':C.grid,14)+TBF(x+(v==='s'?50:38),y+24,l,13,chosen?'#fff':C.ink))})});
  out+=T(300,334,done?`${right} of ${done} right`:'Sort each claim.',15,done&&right===done?C.green:C.ink);
  out+=TF(300,360,'After you answer, the evidence’s answer is shaded green.',13,C.muted);
  return {svg:out,phase:s.last>=0?D5_MYTHS[s.last][2]:'Some lateralisation is real and well measured; the personality types built on it are not.'};
 }});

/* =========================== brain-imaging =========================== */
const D5_hrf0=t=>t<=0?0:Math.pow(t,5)*Math.exp(-t)/120-Math.pow(t,15)*Math.exp(-t)/(6*1.307674368e12);
const D5_HRFMAX=(()=>{let m=0;for(let t=0;t<30;t+=.05)m=Math.max(m,D5_hrf0(t));return m})();
const D5_hrf=t=>D5_hrf0(t)/D5_HRFMAX;
SCENE({id:'brain-imaging',name:'The slow BOLD signal',tag:'Blood follows activity, seconds later',
 definition:'Functional MRI measures the BOLD signal: changes in blood oxygen that follow neural activity. The response to a brief burst of activity peaks about five seconds later and lasts around fifteen.',
 example:'A 0.1-second flash makes neurons fire within a tenth of a second, but the BOLD signal does not peak until about 5 s later. Two flashes 2 s apart blur into one larger hump.',
 desc:'A timeline of brief neural events above the BOLD response each one predicts and their sum, showing the delay and the blurring of events close in time.',
 research:'Ogawa, Lee, Kay & Tank (1990). Brain magnetic resonance imaging with contrast dependent on blood oxygenation. PNAS 87, 9868–9872; Boynton, Engel, Glover & Heeger (1996). Linear systems analysis of fMRI in human V1. Journal of Neuroscience 16, 4207–4221. Curve: the standard double-gamma response.',
 dur:12,hint:'Press slots on the top row to add or remove brief events, then compare close and spread-out events.',
 init:()=>({ev:[4]}),
 watch(p){return {ev:p<.4?[4]:p<.7?[4,6,8,10]:[4,20]}},
 ui:[{b:'One event',act:'one'},{b:'Four close together',act:'close'},{b:'Two far apart',act:'far'},{b:'Clear',act:'clear'}],
 on:{tog(s,t){t=Number(t);const i=s.ev.indexOf(t);if(i>=0)s.ev.splice(i,1);else s.ev.push(t);return 'keep'},one(s){s.ev=[4];return 'keep'},close(s){s.ev=[4,6,8,10];return 'keep'},far(s){s.ev=[4,20];return 'keep'},clear(s){s.ev=[];return 'keep'}},
 draw(s,f,X){
  let out=heading('Neural activity is fast; the blood response is slow');
  const pl=D5_plot(70,130,490,170,[0,40],[-.4,2.4],{xt:[[0,'0'],[10,'10'],[20,'20'],[30,'30'],[40,'40 s']],yt:[[0,'0'],[1,'1'],[2,'2']],yl:'predicted BOLD signal'});
  out+=TF(70,62,'Brief neural events (press a slot):',13,C.muted,'start');
  for(let t=0;t<=38;t+=2){const x=pl.X(t),on=s.ev.includes(t);out+=hit(X,'tog',t,`Event at ${t} s: ${on?'on':'off'}`,R(x-9,72,18,34,on?C.coral:'#fff',on?C.coral:C.grid,4))}
  out+=pl.svg+L(pl.X(0),pl.Y(0),pl.X(40),pl.Y(0),C.line,1);
  const ev=s.ev.slice().sort((a,b)=>a-b);
  ev.forEach(t0=>{const pts=[];for(let k=0;k<=200;k++){const t=k/5;pts.push([pl.X(t),pl.Y(D5_hrf(t-t0))])}out+=D5_poly(pts,'#a8c6da',1.4,'stroke-dasharray="4 3"')});
  const tot=[];let mx=0,tm=0;for(let k=0;k<=200;k++){const t=k/5,v=sum(ev.map(t0=>D5_hrf(t-t0)));if(v>mx){mx=v;tm=t}tot.push([pl.X(t),pl.Y(clamp(v,-.4,2.4))])}
  if(ev.length)out+=D5_poly(tot,C.blue,2.8);
  if(ev.length===1)out+=L(pl.X(ev[0]),pl.Y(1.15),pl.X(tm),pl.Y(1.15),C.amber,2)+TBF((pl.X(ev[0])+pl.X(tm))/2,pl.Y(1.15)-8,`peak ${fmt(tm-ev[0])} s later`,13,C.amber);
  out+=T(300,360,!ev.length?'No events: a flat line.':ev.length===1?'One brief event: a slow rise, a peak near 5 s, a dip, then rest.':`Peak height ${fmt(mx.toFixed(2))}× a single response.`,15,C.ink);
  const gaps=ev.slice(1).map((t,i)=>t-ev[i]),close=gaps.length&&Math.min(...gaps)<6;
  return {svg:out,phase:!ev.length?'Add an event to see the response it predicts.':close?'Events a few seconds apart merge into one bigger, longer hump, so fMRI cannot easily tell them apart in time. That is why EEG and MEG are used for fast timing questions.':ev.length>1?'Spaced well apart, each event gives its own separate response.':'The signal is a sluggish echo of activity, measured in blood, not in spikes. Summing responses assumes the system is roughly linear, which holds only approximately.'};
 }});

// Inverse normal (Abramowitz & Stegun 26.2.23) and the upper tail of the normal (A&S 7.1.26).
function D5_zFor(p){const t=Math.sqrt(-2*Math.log(p));return t-(2.515517+.802853*t+.010328*t*t)/(1+1.432788*t+.189269*t*t+.001308*t*t*t)}
function D5_tail(z){const x=Math.abs(z)/Math.SQRT2,t=1/(1+.3275911*x),e=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-x*x);return z>=0?.5*(1-e):.5*(1+e)}
const D5_COLS=40,D5_ROWS=18;
function D5_inFish(c,r){const x=(c-17)/16,y=(r-8.5)/7.5;if(x*x+y*y<=1)return true;return c>=33&&c<=39&&Math.abs(r-8.5)<=(c-32)*1.1}
function D5_scan(seed,real){const g=D5_rng(seed),vox=[];for(let r=0;r<D5_ROWS;r++)for(let c=0;c<D5_COLS;c++){const z=D5_gauss(g);if(!D5_inFish(c,r))continue;const sig=real&&Math.hypot(c-10,r-8)<=2.6?4.5:0;vox.push({c,r,z:z+sig,sig:sig>0})}return vox}
function D5_sig(vox,p,corr){const N=vox.length;if(corr==='none'){const zc=D5_zFor(p);return vox.map(v=>v.z>zc)}
 if(corr==='bonf'){const zc=D5_zFor(p/N);return vox.map(v=>v.z>zc)}
 const ps=vox.map((v,i)=>[D5_tail(v.z),i]).sort((a,b)=>a[0]-b[0]);let k=-1;ps.forEach(([pp],j)=>{if(pp<=(j+1)/N*p)k=j});const out=vox.map(()=>false);for(let j=0;j<=k;j++)out[ps[j][1]]=true;return out}
SCENE({id:'brain-imaging-salmon',name:'The dead salmon',tag:'Many tests, many false alarms',
 definition:'A brain scan runs a separate statistical test at every one of thousands of voxels, so some pass by chance alone unless the threshold is corrected for multiple comparisons.',
 example:'Researchers scanned a dead Atlantic salmon “shown” photos of people and, with an uncorrected threshold, found “active” voxels in its brain. With standard corrections they vanished.',
 desc:'A salmon-shaped grid of voxels filled with pure random noise, or noise plus one true effect, coloured where they pass the chosen threshold and correction.',
 research:'Bennett, Baird, Miller & Wolford (2010). Neural correlates of interspecies perspective taking in the post-mortem Atlantic salmon: an argument for multiple comparisons correction. Journal of Serendipitous and Unexpected Results 1, 1–5. Benjamini & Hochberg (1995); Eklund, Nichols & Knutsson (2016), PNAS 113, 7900–7905.',
 dur:12,hint:'Change the threshold and the correction, add a real effect, and press New scan for fresh noise.',
 init:()=>({seed:3,p:'0.01',corr:'none',real:'off'}),
 watch(p){return p<.33?{seed:3,p:'0.01',corr:'none',real:'off'}:p<.66?{seed:3,p:'0.01',corr:'bonf',real:'off'}:{seed:3,p:'0.01',corr:'bonf',real:'on'}},
 ui:[{choose:[['0.05','p < .05'],['0.01','p < .01'],['0.001','p < .001']],label:'Threshold',get:s=>s.p,act:'p'},{choose:[['none','None'],['bonf','Bonferroni'],['fdr','False discovery rate']],label:'Correction',get:s=>s.corr,act:'corr'},{choose:[['off','Pure noise'],['on','Add a real effect']],label:'Data',get:s=>s.real,act:'real'},{b:'New scan',act:'seed'}],
 on:{p(s,v){s.p=v;return 'keep'},corr(s,v){s.corr=v;return 'keep'},real(s,v){s.real=v;return 'keep'},seed(s){s.seed=nextSeed()%100000+1;return 'keep'}},
 draw(s){
  const vox=D5_scan(s.seed,s.real==='on'),p=Number(s.p),sig=D5_sig(vox,p,s.corr),cell=13,x0=40,y0=58;let out=heading('Pure noise can look like brain activity');
  let nSig=0,nTrue=0,nFalse=0;vox.forEach((v,i)=>{const on=sig[i];if(on){nSig++;if(v.sig)nTrue++;else nFalse++}
   const shade=Math.round(clamp(150+v.z*22,90,215));out+=R(x0+v.c*cell,y0+v.r*cell,cell-1,cell-1,on?C.coral:`rgb(${shade},${shade+8},${shade+14})`,'none',2)});
  out+=Ci(x0+5*cell,y0+7*cell,5,'#fff',C.ink);
  const N=vox.length;out+=TF(40,316,`${N} voxels · threshold p < ${s.p} · ${s.corr==='none'?'no correction':s.corr==='bonf'?'Bonferroni':'false discovery rate'}`,13,C.muted,'start');
  out+=T(300,344,`“Active” voxels: ${nSig}${s.real==='on'?` (${nTrue} real, ${nFalse} false alarms)`:' — all false alarms'}`,15,nFalse?C.coral:C.green);
  out+=TF(300,368,s.corr==='none'?`Expected by chance alone: about ${fmt((N*p).toFixed(1))}`:'Corrected: false alarms are now rare',13,C.muted);
  return {svg:out,phase:s.corr==='none'?`Testing ${N} voxels at p < ${s.p} makes about ${Math.round(N*p)} false alarms likely even in a dead fish. Real studies test around 100,000 voxels.`:s.real==='on'?`The correction removes chance hits but keeps most of the true effect, because real signals are strong. Bonferroni is strict; the false discovery rate keeps the share of false hits low and is less conservative.`:'With a correction the noise rarely passes. A later study (Eklund et al. 2016) found some widely used cluster corrections were themselves too lenient.'};
 }});

const D5_METHODS=[
 {id:'unit',n:'Single neurons',t:[1e-3,1e3],x:[.01,.1],col:C.green,inv:'Invasive: electrodes in the brain (animals, some patients).',what:'Spikes from one or a few cells.'},
 {id:'patch',n:'Patch clamp',t:[1e-3,1e2],x:[.001,.01],col:C.purple,inv:'Invasive: a glass pipette on one cell.',what:'Currents through single channels.'},
 {id:'eeg',n:'EEG',t:[1e-3,1e4],x:[10,100],col:C.amber,inv:'Non-invasive: electrodes on the scalp.',what:'Summed electrical activity of many cells; millisecond timing, blurry location.'},
 {id:'meg',n:'MEG',t:[1e-3,1e4],x:[4,60],col:'#b0337a',inv:'Non-invasive: magnetic sensors around the head.',what:'Magnetic fields of brain currents; fast, a little sharper than EEG.'},
 {id:'fmri',n:'fMRI',t:[1,1e4],x:[1,100],col:C.blue,inv:'Non-invasive: a scanner, no radiation.',what:'Blood oxygen (BOLD); millimetres, but seconds behind activity.'},
 {id:'pet',n:'PET',t:[60,1e4],x:[4,100],col:'#5a5f9e',inv:'Mildly invasive: a radioactive tracer.',what:'Glucose use, blood flow or a chemical; slow.'},
 {id:'tms',n:'TMS',t:[1e-2,1e3],x:[10,30],col:C.coral,inv:'Non-invasive: a magnetic pulse disrupts an area briefly.',what:'Causal: does briefly blocking this area change behaviour?'},
 {id:'lesion',n:'Lesion studies',t:[1e4,1e5],x:[5,100],col:C.muted,inv:'Natural damage from stroke or injury, studied in patients.',what:'Causal: what is lost when an area is damaged.'}];
SCENE({id:'brain-imaging-methods',name:'Choosing a method',tag:'Where and when, but not both',
 definition:'Every method for studying the living brain trades spatial detail against timing, and few can show cause rather than correlation. Researchers combine methods to cover the gaps.',
 example:'EEG catches a response within milliseconds but cannot say exactly where it came from; fMRI localises to millimetres but lags by seconds. TMS and lesions test whether an area is needed.',
 desc:'Methods placed on a chart of temporal resolution against spatial scale, both on logarithmic axes, with details of the chosen method.',
 research:'Churchland & Sejnowski (1988). Perspectives on cognitive neuroscience. Science 242, 741–745. Poldrack (2006). Can cognitive processes be inferred from neuroimaging data? Trends in Cognitive Sciences 10, 59–63 (the reverse-inference problem). Ranges approximate.',
 dur:12,hint:'Press a method in the list to highlight it on the chart.',
 init:()=>({m:'fmri'}),
 watch(p){return {m:D5_METHODS[Math.min(7,Math.floor(p*8))].id}},
 ui:[{choose:D5_METHODS.map(m=>[m.id,m.n]),label:'Method',get:s=>s.m,act:'m'}],
 on:{m(s,v){s.m=v;return 'keep'}},
 draw(s,f,X){
  const pl=D5_plot(90,54,290,200,[1e-3,1e5],[1e-3,100],{logx:true,logy:true,xt:[[1e-3,'1 ms'],[1,'1 s'],[3600,'1 h']],yt:[[1e-3,'1 µm'],[.1,'0.1 mm'],[10,'1 cm'],[100,'10 cm']],xl:'time scale',xlDy:31});
  let out=heading('Each method sees a different window');out+=pl.svg+TF(20,160,'space',13,C.muted,'start');
  const sel=D5_METHODS.find(m=>m.id===s.m)||D5_METHODS[0];
  D5_METHODS.forEach(m=>{const on=m.id===sel.id;out+=R(pl.X(m.t[0]),pl.Y(m.x[1]),pl.X(m.t[1])-pl.X(m.t[0]),pl.Y(m.x[0])-pl.Y(m.x[1]),m.col,on?C.ink:'none',4,`fill-opacity="${on?.55:.14}" stroke-width="2"`)});
  D5_METHODS.forEach((m,i)=>{const y=58+i*28,on=m.id===sel.id;out+=hit(X,'m',m.id,m.n,R(410,y,170,24,on?m.col:'#fff',m.col,12)+TBF(495,y+17,m.n,13,on?'#fff':C.ink))});
  out+=R(20,300,560,72,'#f6f9fb','none',8)+TBF(32,322,sel.n,14,C.ink,'start')+TF(32,343,sel.what,13,C.ink,'start')+TF(32,363,sel.inv,13,C.muted,'start');
  return {svg:out,phase:`${sel.n}: ${sel.what} A caution for all imaging: seeing an area light up during a task does not prove the task needs it, and inferring a mental process from activity alone (“reverse inference”) is weak evidence.`};
 }});

/* =========================== plasticity =========================== */
const D5_MAPS={
 normal:{n:'Normal hand',w:[1,1,1,1,1],lost:-1,say:'Each finger has its own territory in the somatosensory cortex, in order from thumb to little finger.'},
 amp:{n:'Finger 3 removed',w:[1,1.5,0,1.5,1],lost:2,say:'After a middle finger was amputated in owl monkeys, its silent territory was taken over by fingers 2 and 4 within weeks (Merzenich et al. 1984).'},
 train:{n:'Finger 2 trained',w:[.85,1.8,.8,.8,.75],lost:-1,say:'Monkeys trained to touch a spinning disc with their fingertips developed larger maps for the trained skin (Jenkins et al. 1990). Violinists show a similar enlargement for the left-hand fingers (Elbert et al. 1995).'},
 fuse:{n:'Fingers 3 and 4 joined',w:[1,1,1.5,0,1],lost:-1,fuse:true,say:'When two fingers were sewn together, their separate maps merged into one, because they were always touched together (Allard et al. 1991). Maps follow the patterns of use.'}};
const D5_DIG=['thumb','2','3','4','5'];
SCENE({id:'plasticity',name:'Maps that move',tag:'The cortex follows use',
 definition:'Brain maps are not fixed at birth. In the adult cortex, the area given to a body part can grow with use and be taken over by neighbours when input stops.',
 example:'After a monkey lost a finger, the brain area that had served it began to respond to the neighbouring fingers instead. In people who lose an arm, touching the face can be felt on the missing hand.',
 desc:'A strip of somatosensory cortex divided among five fingers, connected to a hand below, with the territories redrawn after amputation, training or joining two fingers.',
 research:'Merzenich, Nelson, Stryker, Cynader, Schoppmann & Zook (1984). Somatosensory cortical map changes following digit amputation in adult monkeys. Journal of Comparative Neurology 224, 591–605; Ramachandran, Rogers-Ramachandran & Stewart (1992), Science 258, 1159–1160.',
 dur:12,hint:'Choose what happens to the hand and watch the map redraw.',
 init:()=>({c:'amp'}),
 watch(p){return {c:['normal','amp','train','fuse'][Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:Object.keys(D5_MAPS).map(k=>[k,D5_MAPS[k].n]),label:'Change',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=v;return 'keep'}},
 draw(s){
  const m=D5_MAPS[s.c]||D5_MAPS.normal,tot=sum(m.w),cols=[C.purple,C.blue,C.green,C.amber,C.coral];let out=heading('The hand area of the cortex: '+m.n.toLowerCase());
  out+=TF(300,62,'somatosensory cortex (hand area)',13,C.muted);let x=60;const mids=[];
  m.w.forEach((w,i)=>{const ww=w/tot*480;mids.push(x+ww/2);if(ww>0){out+=R(x,70,ww,60,tint(cols[i],.55),'#fff',0);if(ww>34)out+=TBF(x+ww/2,106,D5_DIG[i],14,C.ink)}x+=ww});
  if(m.fuse){const a=60+(m.w[0]+m.w[1])/tot*480,ww=m.w[2]/tot*480;out+=`<defs><linearGradient id="d5fuse"><stop offset="0" stop-color="${tint(C.green,.55)}"/><stop offset="1" stop-color="${tint(C.amber,.55)}"/></linearGradient></defs>`+R(a,70,ww,60,'url(#d5fuse)','#fff',0)+TBF(a+ww/2,106,'3 + 4',14,C.ink)}
  out+=R(60,70,480,60,'none',C.ink,2);
  const fx=[200,250,300,350,400],ftop=[250,210,200,210,230];
  out+=R(185,280,235,74,'#fbe9d6',C.ink,18);
  fx.forEach((fxx,i)=>{const gone=i===m.lost,top=i===0?292:ftop[i],xx=i===0?170:fxx,w=34;
   out+=R(xx-w/2,top,w,i===0?40:290-top,gone?'none':'#fbe9d6',gone?C.coral:C.ink,14,gone?'stroke-dasharray="5 4"':'');
   const target=m.fuse&&i===3?mids[2]:mids[i];if(!gone&&m.w[i]+(m.fuse&&i===3?1:0)>0)out+=L(xx,top,target,130,tint(cols[i],.2),1.5,'stroke-dasharray="3 4"');
   out+=TF(xx,top-8,i===0?'1':String(i+1),13,gone?C.coral:C.muted)});
  if(m.fuse)out+=R(335,212,30,10,C.ink,'none',3);
  return {svg:out,phase:m.say+' Proportions are illustrative.'};
 }});

const D5_OD_N=[12,14,16,20,16,12,10],D5_OD_D=[80,10,4,2,2,1,1];
const D5_odE=a=>a<2?.15:a<=4?lerp(.15,1,(a-2)/2):a<=6?1:a<=14?lerp(1,.05,(a-6)/8):.05;
SCENE({id:'plasticity-critical-period',name:'Critical periods',tag:'A window that closes',
 definition:'A critical (or sensitive) period is a window in development when experience shapes the brain most strongly. Closing one eye during that window rewires the visual cortex; the same closure in adulthood has little effect.',
 example:'In kittens, a few weeks with one eyelid closed around the second month left most cortical cells driven only by the open eye. The same closure in an adult cat changed almost nothing.',
 desc:'An ocular-dominance histogram, from cells driven only by the open eye to cells driven only by the closed eye, for closure at a chosen age, compared with normal.',
 research:'Wiesel & Hubel (1963). Single-cell responses in striate cortex of kittens deprived of vision in one eye. Journal of Neurophysiology 26, 1003–1017; Hubel & Wiesel (1970). The period of susceptibility to the physiological effects of unilateral eye closure in kittens. Journal of Physiology 206, 419–436. Animal studies, now under strict ethical rules.',
 dur:12,hint:'Change the age at which one eye is closed for a few weeks.',
 init:()=>({age:5}),
 watch(p){return {age:Math.round(1+19*p)}},
 ui:[{range:'age',label:'Age at closure',min:1,max:20,step:1,get:s=>s.age,act:'age',show:v=>v+' weeks'}],
 on:{age(s,v){s.age=Number(v);return 'keep'}},
 draw(s){
  const e=D5_odE(s.age),h=D5_OD_N.map((n,i)=>lerp(n,D5_OD_D[i],e));let out=heading('Close one eye: when it happens matters');
  const pl=D5_plot(70,60,320,230,[.5,7.5],[0,90],{xt:[[1,'1'],[2,'2'],[3,'3'],[4,'4'],[5,'5'],[6,'6'],[7,'7']],yt:[[0,'0'],[40,'40%'],[80,'80%']],xl:'1 = open eye only · 4 = both · 7 = closed eye only',yl:'share of cells'});out+=pl.svg;
  h.forEach((v,i)=>{const x=pl.X(i+1);out+=R(x-16,pl.Y(v),32,pl.Y(0)-pl.Y(v),C.blue,'none',3)+R(x-16,pl.Y(D5_OD_N[i]),32,2.5,C.ink,'none',0)});
  out+=TF(240,76,'black ticks: normal kitten',13,C.ink);
  const ax=410,aw=170,ay=120,ax2=a=>ax+(a-1)/19*aw;
  out+=TB(410,84,'Sensitivity by age',14,C.ink,'start');const pts=[];for(let a=1;a<=20;a+=.25)pts.push([ax2(a),ay+90-D5_odE(a)*80]);
  out+=R(ax,ay,aw,100,'#fff',C.grid,4)+D5_poly(pts,C.coral,2.4)+Ci(ax2(s.age),ay+90-e*80,6,C.coral,'#fff');
  out+=TF(ax,ay+118,'1',13,C.muted)+TF(ax+aw,ay+118,'20 weeks',13,C.muted,'end');
  out+=TF(300,354,e>.8?`At ${s.age} weeks: the window is wide open, and the closed eye loses the cortex.`:e<.2?`At ${s.age} weeks: little effect; the window is ${s.age<3?'not yet open':'closed'}.`:`At ${s.age} weeks: a partial shift towards the open eye.`,15,e>.8?C.coral:C.ink);
  return {svg:out,phase:`Hubel and Wiesel found the kitten’s sensitive period starts around the fourth week, peaks at about four to six weeks and fades by about three months. In children, an untreated lazy eye or cataract during early years can permanently weaken vision in that eye (amblyopia), which is why it is treated early. Histogram and curve are illustrative.`};
 }});

const D5_TAXI=(()=>{const r=D5_rng(2000),pts=[];for(let i=0;i<16;i++){const yrs=1.5+r()*40;pts.push([yrs,100+.55*yrs+6*D5_gauss(r)])}return pts})();
SCENE({id:'plasticity-taxi',name:'Taxi drivers and brain training',tag:'What practice changes, and what it does not',
 definition:'Long, intense practice of a real skill can change brain structure, but evidence that short commercial brain-training games improve general abilities is weak: gains mostly stay with the trained task.',
 example:'London taxi drivers, who learn thousands of streets, have a larger rear hippocampus the longer they have driven. By contrast, in an online study of 11,430 people, six weeks of brain-training games improved the games but not untrained tests.',
 desc:'Three views: years of taxi driving against rear hippocampus size with a correlation, before-and-after change in trainee drivers, and brain-training gains on trained and untrained tasks.',
 research:'Maguire et al. (2000). Navigation-related structural change in the hippocampi of taxi drivers. PNAS 97, 4398–4403; Woollett & Maguire (2011), Current Biology 21, 2109–2114; Owen et al. (2010). Putting brain training to the test. Nature 465, 775–778; Simons et al. (2016), Psychological Science in the Public Interest 17, 103–186.',
 dur:12,hint:'Switch between the three studies. In the first, add drivers one by one and watch the correlation settle.',
 init:()=>({v:'cross',n:16}),
 watch(p){return p<.5?{v:'cross',n:Math.max(3,Math.round(32*p))}:p<.75?{v:'long',n:16}:{v:'games',n:16}},
 ui:[{choose:[['cross','Drivers (2000)'],['long','Trainees (2011)'],['games','Brain games (2010)']],label:'Study',get:s=>s.v,act:'v'},{range:'n',label:'Drivers shown',min:3,max:16,step:1,get:s=>s.n,act:'n',show:v=>String(v)}],
 on:{v(s,v){s.v=v;return 'keep'},n(s,v){s.n=Number(v);return 'keep'}},
 draw(s){
  let out='',phase='';
  if(s.v==='cross'){out=heading('More years of driving, larger rear hippocampus');
   const pts=D5_TAXI.slice(0,s.n),r=D5_corr(pts.map(p=>p[0]),pts.map(p=>p[1]));
   const pl=D5_plot(80,60,330,230,[0,44],[90,140],{xt:[[0,'0'],[10,'10'],[20,'20'],[30,'30'],[40,'40 years']],yt:[[100,'100'],[120,'120'],[140,'140']],xl:'years as a taxi driver',yl:'rear hippocampus (relative size)'});out+=pl.svg;
   pts.forEach(([x,y])=>out+=Ci(pl.X(x),pl.Y(clamp(y,90,140)),5.5,C.blue,'#fff'));
   if(pts.length>2){const mx=D5_mean(pts.map(p=>p[0])),my=D5_mean(pts.map(p=>p[1]));let sxy=0,sxx=0;pts.forEach(([x,y])=>{sxy+=(x-mx)*(y-my);sxx+=(x-mx)**2});const b=sxy/sxx;out+=L(pl.X(0),pl.Y(my-b*mx),pl.X(44),pl.Y(my+b*(44-mx)),C.coral,2,'stroke-dasharray="6 5"')}
   out+=counter(436,70,'drivers',String(pts.length),C.ink,140)+counter(436,130,'correlation r',isNaN(r)?'—':r.toFixed(2),C.coral,140);
   ['Simulated points','matching the','reported positive','link. Correlation','cannot say which','came first.'].forEach((l,i)=>out+=TF(436,206+i*20,l,13,C.muted,'start'));
   phase=`With ${pts.length} drivers the correlation is ${isNaN(r)?'undefined':r.toFixed(2)}. Small samples swing a lot; Maguire’s study had 16 drivers. Perhaps people with a large hippocampus become taxi drivers, which is why a follow-up study was needed.`}
  else if(s.v==='long'){out=heading('Following trainees through “the Knowledge”');
   const bars=[['Qualified',1,C.green],['Did not qualify',.1,C.muted],['Non-drivers',.05,C.muted]];
   bars.forEach(([l,v,c],i)=>{const x=120+i*140;out+=R(x,270-v*170,90,v*170+2,c,'none',4)+TF(x+45,296,l,13,C.ink)});
   out+=L(100,272,520,272,C.ink,1.5)+TF(100,64,'change in rear hippocampus grey matter over about four years (illustrative heights)',13,C.muted,'start');
   out+=T(300,340,'Only those who learnt the map grew: practice came first.',15,C.ink);
   phase='Woollett and Maguire scanned 79 trainees and 31 controls before and after the three-to-four-year training. Grey matter in the rear hippocampus increased only in the 39 who qualified, which supports a causal effect of the training itself.'}
  else{out=heading('Brain-training games: practice does not spread');
   const bars=[['Trained games',1,C.blue],['Untrained reasoning',.06,C.coral],['Untrained memory',.05,C.coral]];
   bars.forEach(([l,v,c],i)=>{const x=110+i*150;out+=R(x,270-v*170,100,v*170+2,c,'none',4)+TF(x+50,296,l,13,C.ink)});
   out+=L(90,272,530,272,C.ink,1.5)+TF(90,64,'improvement after six weeks (illustrative heights)',13,C.muted,'start');
   out+=T(300,340,'Big gains on the games themselves; almost none elsewhere.',15,C.ink);
   phase='Owen and colleagues found improvements on every trained task but no transfer to untrained tests, even closely related ones. A large review (Simons et al. 2016) reached a similar verdict on commercial brain training: near transfer is common, far transfer is rare.'}
  return {svg:out,phase};
 }});
