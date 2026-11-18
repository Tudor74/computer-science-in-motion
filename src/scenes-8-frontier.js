/* ===================== Brain In Motion · Era 8 · Tools and frontiers ===================== */
// The patch clamp, optogenetics, place and grid cells, brain–computer interfaces, recording many neurons, brains and AI.
// Every picture is a pure function of state, frame and X. Sound (soft clicks) plays only from on() handlers.
// Simulated records use seeded generators (B8_rng) and are labelled as simulated, schematic or illustrative.
// Light pulses are drawn as marks on a time axis; nothing on screen flashes.

/* ---- shared helpers ---- */
const B8_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const B8_rng=n=>rng(B8_mix(n));
function B8_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
function B8_pois(r,m){if(m<=0)return 0;const l=Math.exp(-m);let k=0,p=1;do{k++;p*=r()}while(p>l);return k-1}
const B8_exp=(r,mean)=>-Math.log(Math.max(1e-12,r()))*mean;
const B8_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const B8_r1=v=>Math.round(v*10)/10;
const B8_r2=v=>Math.round(v*100)/100;
const B8_sg=v=>(v<0?'−':'')+fmt(Math.abs(v));   // a true minus sign
const B8_note=(s,y=368)=>TF(300,y,s,13,C.muted);
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function B8_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-7,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// Clicks: very short, quiet noise bursts at the given times (seconds from now). Call only from on() handlers.
function B8_click(times,gain=.12){AUDIO.stopAll();times.slice(0,60).forEach(t=>AUDIO.noise({dur:.005,gain,at:t}))}
// A tile with a label and a value (fixed-size text).
function B8_tile(x,y,w,label,value,col=C.blue){return R(x,y,w,46,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+38,value,16,col)}
// Wrap a sentence into lines of at most n characters.
function B8_wrap(s,n){const out=[];let line='';for(const w of String(s).split(' ')){if(line&&(line+' '+w).length>n){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out}
const B8_lines=(x,y,s,n,size=13,col=C.ink,anchor='start',dy=17)=>B8_wrap(s,n).map((l,i)=>TF(x,y+i*dy,l,size,col,anchor)).join('');

/* ===================== Lesson: patch-clamp ===================== */
// One channel with two states. Illustrative values: conductance 30 pS, reversal 0 mV,
// mean closed time 20 ms and mean open time 4 ms (acetylcholine-receptor openings last a few milliseconds).
const B8_GAMMA=30,B8_TC=20,B8_TO=4,B8_SWEEP=200;
function B8_events(seed,T=B8_SWEEP,tc=B8_TC,to=B8_TO){const r=B8_rng(seed),ev=[];let t=B8_exp(r,tc);while(t<T){const d=B8_exp(r,to);ev.push([t,Math.min(T,t+d),d]);t+=d+B8_exp(r,tc)}return ev}
const B8_amp=v=>B8_GAMMA*v/1000;   // pS × mV = fA, so divide by 1000 for pA
// A current trace: baseline noise of sd pA, steps of amp pA while open. Returns polyline points.
function B8_trace(ev,amp,sd,seed,x0,w,y0,scale,T=B8_SWEEP,n=360,lo=-1e9,hi=1e9){const r=B8_rng(seed*7+3),pts=[];let j=0;
 for(let i=0;i<=n;i++){const t=i/n*T;while(j<ev.length&&ev[j][1]<t)j++;const open=j<ev.length&&ev[j][0]<=t&&t<=ev[j][1];const v=(open?amp:0)+sd*B8_gauss(r);pts.push([x0+i/n*w,clamp(y0-v*scale,lo,hi)])}return pts}
function B8_ivFit(pts){if(pts.length<2)return null;const n=pts.length,mx=sum(pts.map(p=>p.v))/n,my=sum(pts.map(p=>p.i))/n,sxx=sum(pts.map(p=>(p.v-mx)**2));if(sxx<1)return null;const b=sum(pts.map(p=>(p.v-mx)*(p.i-my)))/sxx,a=my-b*mx;return {g:b*1000,rev:b?-a/b:0}}
const B8_pcInit=()=>({v:-100,sweep:1,pts:[]});
SCENE({id:'patch-clamp',name:'One channel, one current',tag:'Neher and Sakmann, 1976',
 definition:'In 1976 Erwin Neher and Bert Sakmann pressed the polished tip of a glass pipette, a few micrometres across, against a frog muscle fibre whose nerve had been cut, so that acetylcholine receptors were spread over its surface. The pipette held a drug that opens these receptors. The current through the tiny patch of membrane under the tip moved in square steps: a single channel snapping open and shut.',
 example:`Each opening has the same height and a random length. A channel of ${B8_GAMMA} picosiemens held at −100 mV passes ${B8_GAMMA} pS × 100 mV = ${fmt(B8_amp(100))} pA, about ${Math.round(B8_amp(100)*1e-12/1.602e-19/1e6)} million ions a second. Halve the voltage and the step halves: one channel obeys Ohm’s law. (Illustrative values.)`,
 desc:'A 200-millisecond current record from one patch, with square downward steps where the channel opens, and a graph of the step size against the holding voltage on which the learner places measurements, with the line whose slope is the channel’s conductance.',
 research:['Neher & Sakmann (1976). Single-channel currents recorded from membrane of denervated frog muscle fibres. Nature 260, 799–802.','Katz & Miledi (1972). The statistical nature of the acetylcholine potential and its molecular components. Journal of Physiology 224, 665–699: the size of one channel’s event was first estimated from noise, before it could be seen.','Nobel Prize in Physiology or Medicine 1991, Neher and Sakmann, for their discoveries concerning the function of single ion channels in cells.'],
 dur:12,hint:'Set the holding voltage and press Measure to put the step size on the graph; repeat at several voltages to find the conductance and the voltage where the current reverses. New sweep records again; the sound button plays each opening as a soft click, five times slowed. The record is simulated.',
 init:B8_pcInit,
 watch(p){const vs=[-140,-120,-100,-80,-60,-40],k=Math.min(5,Math.floor(p*6.99)),pts=[];for(let i=0;i<=k;i++)pts.push({v:vs[i],i:B8_amp(vs[i])+.05*B8_gauss(B8_rng(i*11+2))});return {v:vs[k],sweep:1+k,pts}},
 ui:[{range:'v',label:'Holding voltage',min:-140,max:-40,step:10,get:s=>s.v,act:'v',show:v=>B8_sg(v)+' mV'},{b:'Measure the step',act:'measure'},{b:'New sweep',act:'next'},{b:'Hear this sweep ▶',act:'hear'},{b:'Clear graph',act:'clear'}],
 on:{v(s,v){s.v=clamp(Math.round(+v/10)*10,-140,-40);return 'keep'},next(s){s.sweep++},clear(s){s.pts=[]},
  measure(s){s.pts.push({v:s.v,i:B8_amp(s.v)+.05*B8_gauss(B8_rng(s.sweep*31+s.pts.length))});if(s.pts.length>24)s.pts.shift()},
  hear(s){B8_click(B8_events(s.sweep).map(e=>e[0]/1000*5));return 'keep'}},
 draw(s,f,X){
  const ev=B8_events(s.sweep),amp=B8_amp(s.v),x0=40,w=520,yb=82,sc=12,fit=B8_ivFit(s.pts);
  const show=X&&!X.try?B8_SWEEP*clamp(X.p*6.99%1*1.6,0,1):B8_SWEEP,evs=ev.filter(e=>e[0]<=show);
  let out=heading(`One channel at ${B8_sg(s.v)} mV: steps of ${fmt(B8_r1(Math.abs(amp)))} pA`);
  out+=R(30,46,540,104,'#fff',C.grid,6)+TF(38,64,'current through the patch',13,C.muted,'start')+TF(562,64,'down = inward current',13,C.muted,'end');
  const pts=B8_trace(ev,amp,.2,s.sweep,x0,w,yb,sc).filter(p=>p[0]<=x0+show/B8_SWEEP*w);out+=B8_poly(pts,C.blue,1.3);
  out+=L(x0,yb+56,x0,yb+56-2*sc,C.ink,2)+TF(x0+6,yb+52,'2 pA',13,C.ink,'start');
  for(const t of [0,50,100,150,200])out+=TF(x0+t/B8_SWEEP*w,166,t+(t===200?' ms':''),13,C.muted);
  // i–V graph
  const pl=B8_plot(80,198,220,108,[-150,0],[-5,.5],{xt:[[-140,'−140'],[-100,'−100'],[-60,'−60'],[-20,'−20']],yt:[[-4,'−4'],[-2,'−2'],[0,'0']],xl:'holding voltage (mV)',xlDy:32,yl:'step size (pA)'});out+=pl.svg+L(pl.X(-150),pl.Y(0),pl.X(0),pl.Y(0),C.grid,1);
  if(fit){const a=v=>fit.g*(v-fit.rev)/1000;out+=L(pl.X(-150),pl.Y(clamp(a(-150),-5,.5)),pl.X(0),pl.Y(clamp(a(0),-5,.5)),C.coral,2,'stroke-dasharray="5 4"')}
  for(const q of s.pts)out+=Ci(pl.X(q.v),pl.Y(q.i),4.5,C.blue,'#fff');
  out+=Ci(pl.X(s.v),pl.Y(amp),7,'none',C.amber);
  // tiles
  const openT=evs.length?sum(evs.map(e=>e[2]))/evs.length:0;
  out+=B8_tile(330,196,120,'Step size',fmt(B8_r1(Math.abs(amp)))+' pA')+B8_tile(458,196,120,'Openings',String(evs.length),C.ink);
  out+=B8_tile(330,250,120,'Mean open time',evs.length?fmt(B8_r1(openT))+' ms':'none',C.ink)+B8_tile(458,250,120,'Conductance',fit?Math.round(fit.g)+' pS':'2+ points',C.coral);
  out+=TF(454,320,fit?`line crosses zero at ${B8_sg(Math.round(fit.rev))} mV`:'measure at two or more voltages',13,fit?C.coral:C.muted);
  out+=B8_note('Simulated record of one channel: illustrative conductance 30 pS, mean open time 4 ms.',360);
  return {svg:out,phase:fit?`The steps fall on a straight line through about ${B8_sg(Math.round(fit.rev))} mV. Its slope, about ${Math.round(fit.g)} picosiemens, is the conductance of one channel. The current vanishes near 0 mV because this channel lets sodium in and potassium out about equally well. Each opening still lasts a random time, here ${evs.length?fmt(B8_r1(openT)):'0'} ms on average in this sweep.`:
   `${evs.length} openings in this sweep, all ${fmt(B8_r1(Math.abs(amp)))} pA deep, lasting anything from a fraction of a millisecond to well over ten. Before 1976 such events could only be inferred from the faint “noise” of many channels; here one is seen directly. Measure the step at a few voltages.`};
 }});

// Thermal (Johnson) noise of the seal resistance: sd = sqrt(4kTB/R), at 22 °C and a 1 kHz bandwidth.
const B8_SEALS=[1e7,5e7,1e8,5e8,1e9,5e9,1e10,5e10];
const B8_noise=R=>Math.sqrt(4*1.380649e-23*295*1000/R)*1e12;   // in pA
const B8_ohm=R=>R>=1e9?fmt(R/1e9)+' GΩ':fmt(R/1e6)+' MΩ';
SCENE({id:'patch-clamp-seal',name:'The gigaseal',tag:'Hamill, Marty, Neher, Sakmann and Sigworth, 1981',
 definition:'A resistor at room temperature produces a faint random current of its own, and the smaller its resistance, the larger that noise. The early seals between pipette and membrane were tens of megaohms, so the noise was nearly as large as a channel’s step. Around 1980 Neher’s group found that a clean, fire-polished pipette and gentle suction made the membrane bind to the glass with a seal of more than a gigaohm (a thousand megaohms), cutting this noise many times over.',
 example:`At a bandwidth of 1 kHz, the seal’s own noise is about ${fmt(B8_r2(B8_noise(5e7)))} pA for a 50 MΩ seal but only ${fmt(B8_r2(B8_noise(1e10)))} pA for a 10 GΩ seal. A 3 pA step stands about ${Math.round(3/B8_noise(5e7))} times above the first and ${Math.round(3/B8_noise(1e10))} times above the second, and much smaller channels become visible too. The seal also held the membrane so firmly that patches could be pulled off the cell.`,
 desc:'A current record from one channel with background noise set by the seal resistance, beside a graph of the noise against the seal resistance on a logarithmic axis, with the range of the early seals and of gigaseals marked.',
 research:['Hamill, Marty, Neher, Sakmann & Sigworth (1981). Improved patch-clamp techniques for high-resolution current recording from cells and cell-free membrane patches. Pflügers Archiv 391, 85–100.','Neher (1992). Ion channels for communication between and within cells. Nobel Lecture (the history of the seal).','Johnson (1928); Nyquist (1928). Physical Review 32: the thermal noise of a resistor. Here only the seal’s noise is drawn; amplifier and pipette add more.'],
 dur:12,hint:'Raise the seal resistance and watch the noise shrink around the same openings. Switch to the small channel: at what seal does it come out of the noise? Values are computed for 22 °C and a 1 kHz bandwidth.',
 init:()=>({k:1,amp:3}),
 watch(p){return {k:Math.min(7,Math.floor(p*8)),amp:p<.75?3:.5}},
 ui:[{range:'k',label:'Seal',min:0,max:7,get:s=>s.k,act:'k',show:v=>B8_ohm(B8_SEALS[v])},{choose:[[3,'3 pA channel'],[.5,'0.5 pA channel']],label:'Channel',get:s=>s.amp,act:'amp'}],
 on:{k(s,v){s.k=clamp(Math.round(+v),0,7)},amp(s,v){s.amp=+v===.5?.5:3}},
 draw(s){
  const Rs=B8_SEALS[s.k],sd=B8_noise(Rs),ratio=s.amp/sd,ev=B8_events(5,B8_SWEEP),sc=s.amp<1?40:10,giga=Rs>=1e9;
  const verdict=ratio>=8?'clear':ratio>=3?'visible':'lost in the noise';
  let out=heading(`${B8_ohm(Rs)} seal: noise ${fmt(B8_r2(sd))} pA, step ${s.amp} pA`);
  out+=R(30,46,540,128,'#fff',C.grid,6)+TF(38,64,'one channel, inward current down',13,C.muted,'start')+TF(562,64,`step ÷ noise = ${fmt(B8_r1(ratio))}: ${verdict}`,13,ratio>=8?C.green:ratio>=3?C.amber:C.coral,'end');
  out+=B8_poly(B8_trace(ev,-s.amp,sd,11,40,520,100,sc,B8_SWEEP,360,72,170),C.blue,1.2);
  out+=L(40,166,40,166-sc*(s.amp<1?.5:2),C.ink,2)+TF(46,164,s.amp<1?'0.5 pA':'2 pA',13,C.ink,'start');
  // noise against seal
  const pl=B8_plot(70,206,300,104,[7,11],[0,1.4],{xt:[[8,'100 MΩ'],[9,'1 GΩ'],[10,'10 GΩ'],[11,'100 GΩ']],yt:[[0,'0'],[.5,'0.5'],[1,'1']],xl:'seal resistance (log scale)',xlDy:32,yl:'seal noise (pA)'});
  out+=pl.svg+R(pl.X(7.3),207,pl.X(8)-pl.X(7.3),102,C.coralp,'none',0)+R(pl.X(9),207,pl.X(11)-pl.X(9)-1,102,C.greenp,'none',0);
  out+=TF(pl.X(7.65),224,'1976',13,C.coral)+TF(pl.X(10),224,'gigaseals',13,C.green);
  const cpts=[];for(let i=0;i<=80;i++){const lg=7+i/80*4;cpts.push([pl.X(lg),pl.Y(Math.min(1.4,B8_noise(Math.pow(10,lg))))])}out+=B8_poly(cpts,C.ink,2);
  out+=Ci(pl.X(Math.log10(Rs)),pl.Y(Math.min(1.4,sd)),6.5,C.amber,'#fff');
  out+=B8_tile(400,204,170,'Seal noise (1 kHz)',fmt(B8_r2(sd))+' pA',giga?C.green:C.coral)+B8_tile(400,256,170,'Step ÷ noise',fmt(B8_r1(ratio)),C.ink);
  out+=TF(485,320,'rough guide: above 8 clear,',13,C.muted)+TF(485,336,'below 3 lost',13,C.muted);
  out+=B8_note('Simulated: only the seal’s thermal noise is drawn. Real records have other noise too.',366);
  return {svg:out,phase:giga?`With a ${B8_ohm(Rs)} seal the background shrinks to ${fmt(B8_r2(sd))} pA and the ${s.amp} pA openings stand ${fmt(B8_r1(ratio))} times above it. ${s.amp<1?'Even this small channel is now visible, which is why the gigaseal opened up channels that the first method could not see.':'Every opening and closing is clean, and brief ones are no longer hidden.'}`:
   `A ${B8_ohm(Rs)} seal adds ${fmt(B8_r2(sd))} pA of noise, so a ${s.amp} pA step is only ${fmt(B8_r1(ratio))} times larger than the background. ${ratio<3?'The openings are lost in it.':'Large openings show, but brief or small ones would not.'} The 1976 recordings worked at this edge.`};
 }});

// A voltage-gated sodium channel after a step from −100 to −20 mV, as a chain C1 → C2 → C3 → O → I,
// with C3 → I possible without opening. Rates per millisecond (illustrative). Single-channel step −1.6 pA.
const B8_NA={a:1.5,k:.5,b:1.2,i:-1.6,T:10,t0:1};
function B8_naSweep(seed){const r=B8_rng(seed*131+17),q=B8_NA;let t=q.t0+B8_exp(r,1/(3*q.a))+B8_exp(r,1/(2*q.a))+B8_exp(r,1/(q.a+q.k));if(r()>q.a/(q.a+q.k))return null;const d=B8_exp(r,1/q.b);return [t,t+d]}
const B8_NA_P=(()=>{const q=B8_NA,dt=.005,out=[];let c1=1,c2=0,c3=0,o=0;for(let t=0;t<=q.T+1e-9;t+=dt){out.push(t<q.t0?0:o);if(t>=q.t0){const d1=-3*q.a*c1,d2=3*q.a*c1-2*q.a*c2,d3=2*q.a*c2-(q.a+q.k)*c3,d4=q.a*c3-q.b*o;c1+=d1*dt;c2+=d2*dt;c3+=d3*dt;o+=d4*dt}}return out})();
const B8_naP=t=>B8_NA_P[clamp(Math.round(t/.005),0,B8_NA_P.length-1)];
const B8_NA_PEAK=(()=>{let m=0,tm=0;B8_NA_P.forEach((v,i)=>{if(v>m){m=v;tm=i*.005}});return {p:m,t:tm-B8_NA.t0}})();
SCENE({id:'patch-clamp-average',name:'Many sweeps make one smooth current',tag:'Sigworth and Neher, 1980',
 definition:'Hodgkin and Huxley’s sodium current rises smoothly and dies away within a few milliseconds. In 1980 Fred Sigworth and Erwin Neher recorded single sodium channels in cultured rat muscle cells and stepped the voltage again and again. In each sweep one channel opens once, at a random moment, for about a millisecond, or not at all. Averaged over many sweeps, these all-or-none events add up to the smooth current that Hodgkin and Huxley had measured from millions of channels at once.',
 example:`In this model a channel opens on ${Math.round(100*B8_NA.a/(B8_NA.a+B8_NA.k))}% of sweeps, and the average current peaks ${fmt(B8_r1(B8_NA_PEAK.t))} ms after the step at ${fmt(B8_r2(B8_NA_PEAK.p))} of the single-channel current. The rise of the average reflects how long channels wait before opening; its decay reflects how quickly they inactivate. Later work showed that some channels inactivate without ever opening (Aldrich, Corey and Stevens, 1983).`,
 desc:'The last four single-channel sweeps after a voltage step, each with a brief rectangular opening or none, beside the average of all sweeps so far, which converges on the smooth curve expected from the channel’s rates.',
 research:['Sigworth & Neher (1980). Single Na⁺ channel currents observed in cultured rat muscle cells. Nature 287, 447–449.','Aldrich, Corey & Stevens (1983). A reinterpretation of mammalian sodium channel gating based on single channel recording. Nature 306, 436–441.','Hodgkin & Huxley (1952). Journal of Physiology 117, 500–544: the macroscopic current that the averages reproduce.'],
 dur:12,hint:'Record sweeps one at a time and look at how different each is; then record ten or a hundred and watch the average settle on the dashed curve. The channel and its rates are simulated.',
 init:()=>({n:1,seed:1}),
 watch(p){return {n:Math.max(1,Math.round(Math.pow(300,smooth(p)))),seed:1}},
 ui:[{b:'Record 1 sweep',act:'one'},{b:'Record 10',act:'ten'},{b:'Record 100',act:'hundred'},{b:'Clear',act:'clear'}],
 on:{one(s){s.n=Math.min(1000,s.n+1)},ten(s){s.n=Math.min(1000,s.n+10)},hundred(s){s.n=Math.min(1000,s.n+100)},clear(s){s.n=0;s.seed+=1000}},
 draw(s){
  const q=B8_NA,sw=range(s.n).map(i=>B8_naSweep(s.seed+i)),nb=200,avg=new Array(nb+1).fill(0);
  for(const e of sw)if(e)for(let j=Math.max(0,Math.ceil(e[0]/q.T*nb));j<=Math.min(nb,Math.floor(e[1]/q.T*nb));j++)avg[j]+=q.i;
  const blank=sw.filter(e=>!e).length;
  let out=heading(s.n?`${s.n} sweep${s.n===1?'':'s'} averaged`:'Record some sweeps');
  // sweeps
  const x0=40,w=250,TX=t=>x0+t/q.T*w;out+=R(28,46,274,236,'#fff',C.grid,6)+TF(36,64,'last four sweeps',13,C.muted,'start');
  out+=P(`M${TX(0)} 84 L${TX(q.t0)} 84 L${TX(q.t0)} 74 L${TX(q.T)} 74`,C.amber,2)+TF(294,100,'step −100 → −20 mV',13,C.amber,'end');
  const last=sw.slice(-4);last.forEach((e,i)=>{const yb=118+i*44;let d=`M${TX(0)} ${yb}`;if(e)d+=` L${fmt(TX(e[0]))} ${yb} L${fmt(TX(e[0]))} ${yb+22} L${fmt(TX(e[1]))} ${yb+22} L${fmt(TX(e[1]))} ${yb}`;d+=` L${TX(q.T)} ${yb}`;out+=P(d,e?C.blue:C.muted,1.8);if(!e)out+=TF(TX(q.T),yb-6,'no opening',13,C.muted,'end')});
  for(const t of [0,5,10])out+=TF(TX(t),274,t+(t===10?' ms':''),13,C.muted);
  // average
  const lo=s.n<10?-1.8:-.75,pl=B8_plot(370,62,200,190,[0,q.T],[lo,.1],{xt:[[0,'0'],[5,'5'],[10,'10 ms']],yt:s.n<10?[[-1.6,'−1.6'],[-.8,'−0.8'],[0,'0']]:[[-.6,'−0.6'],[-.3,'−0.3'],[0,'0']],yl:'average current (pA)'});out+=pl.svg+L(pl.X(0),pl.Y(0),pl.X(q.T),pl.Y(0),C.grid,1);
  const th=[];for(let i=0;i<=200;i++){const t=i/200*q.T;th.push([pl.X(t),pl.Y(q.i*B8_naP(t))])}out+=B8_poly(th,C.coral,2,'stroke-dasharray="5 4"');
  if(s.n)out+=B8_poly(avg.map((v,j)=>[pl.X(j/nb*q.T),pl.Y(clamp(v/s.n,lo,.1))]),C.blue,2.2);
  out+=TF(570,278,'blue: your average',13,C.blue,'end')+TF(570,295,'dashed: expected',13,C.coral,'end');
  out+=B8_tile(28,300,130,'Sweeps',String(s.n),C.ink)+B8_tile(168,300,130,'No opening',s.n?`${blank} (${Math.round(100*blank/s.n)}%)`:'none',C.muted)+B8_tile(330,310,240,'Expected peak',`${fmt(B8_r2(q.i*B8_NA_PEAK.p))} pA at ${fmt(B8_r1(B8_NA_PEAK.t))} ms`,C.coral);
  out+=B8_note('Simulated single channel, illustrative rates. Step size −1.6 pA.',368);
  return {svg:out,phase:!s.n?'Record a sweep: the voltage steps from −100 to −20 mV and the patch’s one sodium channel may open.':s.n<10?`Each sweep is all or nothing: ${s.n-blank} of ${s.n} opened, once each, at different moments. No single record looks like Hodgkin and Huxley’s current. Keep recording.`:
   `Averaged over ${s.n} sweeps the square openings blur into a smooth inward current that rises and falls within a few milliseconds, the shape of the macroscopic sodium current. The smooth current was always a sum of random, all-or-none openings.`};
 }});

const B8_CFG={
 ca:{name:'Cell-attached',faces:'Inside of the patch faces the cell; the pipette holds outside-type solution.',use:'Channels in their natural setting; the cell is left intact.',rec:'the few channels under the tip'},
 io:{name:'Inside-out patch',faces:'The inner face of the membrane now faces the bath.',use:'Change the “inside” solution at will, for example to test what a channel needs from the cell.',rec:'the few channels in the patch'},
 wc:{name:'Whole-cell',faces:'The pipette joins the cell’s interior; its solution slowly replaces the cell’s contents.',use:'Record the whole cell’s currents and voltage: now the standard way to record a neuron.',rec:'all of the cell’s channels'},
 oo:{name:'Outside-out patch',faces:'The outer face of the membrane faces the bath.',use:'Apply a transmitter or drug to the outer face and see single receptor channels respond.',rec:'the few channels in the patch'}};
const B8_cfgStep=(c,a)=>a==='pull'?(c==='ca'?'io':c==='wc'?'oo':c):a==='suck'?(c==='ca'?'wc':c):'ca';
SCENE({id:'patch-clamp-configs',name:'Four ways to hold a patch',tag:'The recording configurations, 1981',
 definition:'The gigaseal is mechanically strong, which opened four ways of recording. On the cell, the pipette records the channels under its tip. Pulled away, it tears off a patch with the membrane’s inner face towards the bath (inside-out). A pulse of suction instead breaks the patch and joins the pipette to the whole cell (whole-cell). Pulled away from that, the membrane reseals across the tip with its outer face out (outside-out).',
 example:'Whole-cell recording became the everyday method of cellular neuroscience. In 1989 Edwards, Konnerth, Sakmann and Takahashi applied it to neurons in thin slices of brain, and it has since been used to record synaptic currents in brain slices and in living animals. Hamill and colleagues set out all four configurations in one 1981 paper.',
 desc:'A pipette at a cell drawn in one of four configurations, with labels for which face of the membrane looks into the bath and what the configuration records, and the manoeuvres that lead from one configuration to another.',
 research:['Hamill, Marty, Neher, Sakmann & Sigworth (1981). Pflügers Archiv 391, 85–100 (cell-attached, inside-out, whole-cell and outside-out recording).','Edwards, Konnerth, Sakmann & Takahashi (1989). A thin slice preparation for patch clamp recordings from neurones of the mammalian central nervous system. Pflügers Archiv 414, 600–612.'],
 dur:12,hint:'From the cell-attached start, pull the pipette away, or give a suction pulse and then pull. Read which face of the membrane ends up in the bath. Start again returns to the cell.',
 init:()=>({c:'ca',path:['ca']}),
 watch(p){const seq=[['ca'],['ca','io'],['ca'],['ca','wc'],['ca','wc','oo']],k=Math.min(4,Math.floor(p*5));const path=seq[k];return {c:path[path.length-1],path}},
 ui:[{b:'Pull the pipette away',act:'pull'},{b:'Suction pulse',act:'suck'},{b:'Start again',act:'again'}],
 on:{pull(s){const n=B8_cfgStep(s.c,'pull');if(n!==s.c){s.c=n;s.path.push(n)}},suck(s){const n=B8_cfgStep(s.c,'suck');if(n!==s.c){s.c=n;s.path.push(n)}},again(s){s.c='ca';s.path=['ca']}},
 draw(s,f,X){
  const c=s.c,cf=B8_CFG[c],away=c==='io'||c==='oo',tipY=away?150:196,mem=C.amber,inside=C.amberp,bath='#eef6fb';
  let out=heading(`${cf.name}: records ${cf.rec}`);
  out+=R(20,46,300,300,bath,C.grid,8)+TF(30,140,'bath',13,C.muted,'start')+TF(30,156,'(outside)',13,C.muted,'start');
  // cell
  const cy=away?318:300;out+=P(`M30 ${cy+30} Q170 ${cy-120} 310 ${cy+30} Z`,mem,3,inside);out+=TF(170,cy+10,'cell interior',13,C.amber);
  // pipette
  const pipeFill=c==='wc'||c==='oo'?inside:'#dcecf6';
  out+=`<polygon points="110,46 230,46 182,${tipY} 158,${tipY}" fill="${pipeFill}" stroke="${C.muted}" stroke-width="2.5"/>`+TF(170,80,'pipette',13,C.ink);
  if(c==='ca')out+=P(`M156 ${tipY+2} L184 ${tipY+2}`,mem,4);
  if(c==='io')out+=P(`M158 ${tipY} Q170 ${tipY+10} 182 ${tipY}`,mem,3.5)+TF(200,tipY+26,'inner face out',13,C.coral,'start');
  if(c==='wc')out+=P(`M158 ${tipY} L150 ${tipY+8} M182 ${tipY} L190 ${tipY+8}`,mem,3.5)+TF(200,tipY-16,'patch broken',13,C.coral,'start');
  if(c==='oo')out+=P(`M158 ${tipY} Q170 ${tipY+26} 182 ${tipY}`,mem,3.5)+TF(200,tipY+26,'outer face out',13,C.coral,'start');
  // channels drawn in the patch
  if(c!=='wc')out+=R(166,tipY+(c==='oo'?10:-2),8,8,C.green,'none',2);
  // info panel
  out+=R(336,46,248,300,'#fff',C.grid,8)+TBF(350,70,cf.name,15,C.ink,'start');
  out+=TBF(350,96,'Which face is where',13,C.muted,'start')+B8_lines(350,114,cf.faces,32);
  out+=TBF(350,184,'Good for',13,C.muted,'start')+B8_lines(350,202,cf.use,32);
  out+=TBF(350,272,'Your path',13,C.muted,'start')+TF(350,292,s.path.map(k=>({ca:'cell',io:'in-out',wc:'whole',oo:'out-out'})[k]).join(' → '),13,C.blue,'start');
  out+=TF(350,326,c==='ca'?'Pull, or suck then pull.':c==='wc'?'Pull to make outside-out.':'Start again to return.',13,C.muted,'start');
  out+=B8_note('Schematic, not to scale: the pipette tip is about a micrometre across.',366);
  return {svg:out,phase:c==='ca'?'The pipette is sealed to the cell. Only the channels in the patch under its tip pass current into it, and the cell carries on undisturbed.':c==='io'?'Pulling away tore the patch off with the cell’s inner face now looking into the bath. Changing the bath now changes what the inside of the channels meets.':c==='wc'?'The suction pulse broke the patch, so the pipette is continuous with the interior of the cell. The amplifier now sees all of the cell’s channels and can hold or record its voltage.':'Pulled away from whole-cell, the torn membrane reseals across the tip, this time outer face out. Transmitter added to the bath now reaches the receptors as it would at a synapse.'};
 }});

/* ===================== Lesson: optogenetics ===================== */
// Colours for wavelengths (approximate), and illustrative action spectra: channelrhodopsin-2 peaks near 470 nm,
// halorhodopsin (NpHR) near 590 nm. Bell curves only; real spectra are not symmetric.
const B8_wlCol=nm=>nm<440?'#7046c8':nm<490?'#2f6fd6':nm<510?'#1f9aa8':nm<570?'#3a9a46':nm<590?'#b99400':nm<620?'#d4741c':'#c23a2d';
const B8_OPS={chr2:{name:'Channelrhodopsin-2',peak:470,sd:42,sign:-1,ss:.4,col:C.blue,does:'lets positive ions in'},nphr:{name:'Halorhodopsin',peak:590,sd:45,sign:1,ss:.8,col:C.amber,does:'pumps chloride in'}};
const B8_spec=(op,nm)=>Math.exp(-.5*((nm-B8_OPS[op].peak)/B8_OPS[op].sd)**2);
// Photocurrent (relative, −1 to 1) at time t (ms) for light on from 200 to 700 ms.
function B8_photo(op,nm,int,t){const o=B8_OPS[op],a=B8_spec(op,nm)*int,on=200,off=700;
 const shape=u=>(o.ss+(1-o.ss)*Math.exp(-u/40))*(1-Math.exp(-u/2));
 if(t<on)return 0;if(t<=off)return o.sign*a*shape(t-on);return o.sign*a*shape(off-on)*Math.exp(-(t-off)/12)}
SCENE({id:'optogenetics',name:'A channel opened by light',tag:'Nagel, Hegemann, Bamberg and colleagues, 2002–03',
 definition:'The single-celled green alga Chlamydomonas swims towards light using light-sensitive proteins in its eyespot. In 2002 and 2003 Georg Nagel, Peter Hegemann, Ernst Bamberg and their colleagues showed that two of these proteins, channelrhodopsin-1 and channelrhodopsin-2, are ion channels opened directly by light. Put into frog eggs or human cells grown in a dish, channelrhodopsin-2 let positive ions flow in within milliseconds of blue light, and stopped when the light went off.',
 example:'Channelrhodopsin-2 responds best to blue light, near 470 nm. Its light-catching part is retinal, a form of vitamin A, which mammalian tissue supplies. Halorhodopsin, from a salt-loving microbe, works the other way: yellow light makes it pump chloride ions into the cell, which pushes the voltage down and silences it. One protein switches a cell on, the other off.',
 desc:'The response spectra of channelrhodopsin-2 and halorhodopsin across the visible range, the chosen wavelength marked, and the current through the membrane during a half-second light pulse, drawn as a coloured bar on the time axis.',
 research:['Nagel, Ollig, Fuhrmann, Kateriya, Musti, Bamberg & Hegemann (2002). Channelrhodopsin-1: a light-gated proton channel in green algae. Science 296, 2395–2398.','Nagel, Szellas, Huhn, Kateriya, Adeishvili, Berthold, Ollig, Hegemann & Bamberg (2003). Channelrhodopsin-2, a directly light-gated cation-selective membrane channel. PNAS 100, 13940–13945.','Zhang, Wang, Brauner, Liewald, Kay, Watzke, Wood, Bamberg, Nagel, Gottschalk & Deisseroth (2007). Multimodal fast optical interrogation of neural circuitry. Nature 446, 633–639 (halorhodopsin as a silencer).'],
 dur:12,hint:'Choose the protein, then move the wavelength and the light intensity and watch the current. Which colour works best for each? The spectra and currents are illustrative, and the light is drawn as a bar on the time axis.',
 init:()=>({op:'chr2',nm:470,int:80}),
 watch(p){return p<.6?{op:'chr2',nm:Math.round(lerp(420,620,p/.6)/10)*10,int:80}:{op:'nphr',nm:Math.round(lerp(470,600,(p-.6)/.4)/10)*10,int:80}},
 ui:[{choose:[['chr2','Channelrhodopsin-2'],['nphr','Halorhodopsin']],label:'Protein',get:s=>s.op,act:'op'},{range:'nm',label:'Wavelength',min:400,max:650,step:10,get:s=>s.nm,act:'nm',show:v=>v+' nm'},{range:'int',label:'Light intensity',min:0,max:100,step:10,get:s=>s.int,act:'int',show:v=>v+'%'}],
 on:{op(s,v){s.op=v==='nphr'?'nphr':'chr2'},nm(s,v){s.nm=clamp(Math.round(+v/10)*10,400,650)},int(s,v){s.int=clamp(Math.round(+v/10)*10,0,100)}},
 draw(s){
  const o=B8_OPS[s.op],a=B8_spec(s.op,s.nm)*s.int/100,col=B8_wlCol(s.nm);
  let out=heading(`${o.name} at ${s.nm} nm: ${Math.round(100*a)}% of its largest response`);
  // spectra
  const pl=B8_plot(60,64,220,150,[400,650],[0,1.1],{xt:[[400,'400'],[500,'500'],[600,'600']],yt:[[0,'0'],[1,'1']],xl:'wavelength (nm)',xlDy:32,yl:'response'});out+=pl.svg;
  for(let nm=400;nm<650;nm+=10)out+=R(pl.X(nm),214-6,pl.X(nm+10)-pl.X(nm),6,B8_wlCol(nm+5),'none',0);
  for(const k of ['chr2','nphr']){const pts=[];for(let nm=400;nm<=650;nm+=5)pts.push([pl.X(nm),pl.Y(B8_spec(k,nm))]);out+=B8_poly(pts,B8_OPS[k].col,k===s.op?3:1.6,k===s.op?'':'stroke-dasharray="5 4"')}
  out+=TF(pl.X(470),pl.Y(1)-6,'ChR2',13,C.blue)+TF(pl.X(600),pl.Y(1)-6,'NpHR',13,C.amber);
  out+=L(pl.X(s.nm),64,pl.X(s.nm),214,col,2.5)+Ci(pl.X(s.nm),pl.Y(B8_spec(s.op,s.nm)),5.5,col,'#fff');
  // photocurrent
  const p2=B8_plot(340,64,230,150,[0,1000],[-1.1,1.1],{xt:[[0,'0'],[500,'0.5'],[1000,'1 s']],yt:[[-1,'in'],[0,'0'],[1,'out']],yl:'current'});out+=p2.svg+L(p2.X(0),p2.Y(0),p2.X(1000),p2.Y(0),C.grid,1);
  out+=R(p2.X(200),p2.Y(1.1)+2,p2.X(700)-p2.X(200),8,s.int?col:C.grid,'none',2)+TF(p2.X(450),p2.Y(1.1)+24,s.int?'light on':'light off',13,s.int?col:C.muted);
  const cp=[];for(let t=0;t<=1000;t+=4)cp.push([p2.X(t),p2.Y(B8_photo(s.op,s.nm,s.int/100,t))]);out+=B8_poly(cp,o.col,2.4);
  // what it means
  const eff=a<.1?'Too little response to matter.':o.sign<0?'Inward current: the cell is pushed towards firing.':'Outward current: the cell is held below threshold.';
  out+=R(40,262,530,80,'#fff',C.grid,8)+TBF(56,284,o.name,14,o.col,'start')+TF(56,304,`${o.does} when light of the right colour arrives`,13,C.ink,'start')+TF(56,326,eff,13,a<.1?C.muted:o.sign<0?C.coral:C.green,'start');
  out+=B8_note('Illustrative spectra and currents. The light is drawn as a bar, never as a flash.',366);
  return {svg:out,phase:a<.1?`At ${s.nm} nm ${o.name.toLowerCase()} barely responds${s.int?'':', and the light is off'}. ${s.op==='chr2'?'It absorbs blue light; try about 470 nm.':'It absorbs yellow light; try about 590 nm.'}`:
   s.op==='chr2'?`Blue-green light opens the channel within milliseconds. The current peaks, then settles to a lower level while the light stays on, and stops within tens of milliseconds of the light going off. Expressed in a neuron, this inward current pushes it towards firing.`:
   `Yellow light drives halorhodopsin to pump chloride into the cell. The current is outward, so the inside becomes more negative and a neuron carrying it is held below threshold while the light is on.`};
 }});

// A neuron with channelrhodopsin-2 driven by light pulses. Model: each pulse gives a current A × intensity; the cell
// fires if that reaches 0.55 and it is not refractory (5 ms). Each pulse desensitises: A falls by a quarter, and recovers
// with a time constant of 150 ms. Illustrative values chosen to give reliable spiking at 10–20 Hz and failures at 40 Hz.
const B8_SLOT=25,B8_NSLOT=40;
function B8_optoRun(pulses,int){let A=1,last=-1e9,tl=-1e9;const res=[];for(const t of pulses.slice().sort((a,b)=>a-b)){A=1-(1-A)*Math.exp(-(t-tl)/150);const I=A*int,fire=I>=.55&&t-last>5;res.push({t,I,fire});if(fire)last=t;A*=.75;tl=t}return res}
const B8_PRESETS={hz10:range(10).map(i=>i*100),hz20:range(20).map(i=>i*50),hz40:range(40).map(i=>i*25),pattern:[0,75,100,250,275,300,500,650,675,850]};
SCENE({id:'optogenetics-pulses',name:'A spike for each flash of light',tag:'Boyden, Zhang, Bamberg, Nagel and Deisseroth, 2005',
 definition:'In 2005 Edward Boyden, Feng Zhang, Ernst Bamberg, Georg Nagel and Karl Deisseroth used a virus to put the gene for channelrhodopsin-2 into rat neurons growing in a dish. Brief pulses of blue light, each lasting milliseconds, made a neuron fire a single spike, with little variation in timing, so a chosen pattern of pulses produced the same pattern of spikes. A gene had made a neuron’s firing controllable by light, at the speed of neural signalling.',
 example:'Trains at a few pulses a second gave one spike for every pulse. At higher rates some pulses failed, partly because the channel needs time to recover after each pulse. Later engineered variants follow faster trains (for example ChETA, Gunaydin and colleagues, 2010). In this model, a train of 10 or 20 pulses a second at full light is followed every time, and 40 a second is not.',
 desc:'A one-second time axis with light pulses drawn as blue marks, the neuron’s voltage below with spikes where pulses succeed, and counts of pulses, spikes and the fraction followed.',
 research:['Boyden, Zhang, Bamberg, Nagel & Deisseroth (2005). Millisecond-timescale, genetically targeted optical control of neural activity. Nature Neuroscience 8, 1263–1268.','Zemelman, Lee, Ng & Miesenböck (2002). Selective photostimulation of genetically chARGed neurons. Neuron 33, 15–22: an earlier, slower genetic method of light control, using a three-gene system from the fly’s eye.','Gunaydin, Yizhar, Berndt, Sohal, Deisseroth & Hegemann (2010). Ultrafast optogenetic control. Nature Neuroscience 13, 387–392.'],
 dur:12,hint:'Press the marks on the time axis to place or remove light pulses, or pick a ready-made train. Lower the light and see which pulses fail first. Hear plays the spikes as soft clicks. The neuron is a simple model.',
 init:()=>({pulses:B8_PRESETS.pattern.slice(),int:100}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {pulses:B8_PRESETS[['pattern','hz10','hz20','hz40'][k]].slice(),int:100}},
 ui:[{choose:[['hz10','10 a second'],['hz20','20'],['hz40','40'],['pattern','A pattern'],['none','None']],label:'Pulse train',get:s=>'',act:'preset'},{range:'int',label:'Light intensity',min:30,max:100,step:10,get:s=>s.int,act:'int',show:v=>v+'%'},{b:'Hear the spikes ▶',act:'hear'}],
 on:{preset(s,v){s.pulses=B8_PRESETS[v]?B8_PRESETS[v].slice():[]},int(s,v){s.int=clamp(Math.round(+v/10)*10,30,100)},
  slot(s,v){const t=clamp(Math.round(+v),0,B8_NSLOT-1)*B8_SLOT,i=s.pulses.indexOf(t);if(i>=0)s.pulses.splice(i,1);else s.pulses.push(t)},
  hear(s){B8_click(B8_optoRun(s.pulses,s.int/100).filter(r=>r.fire).map(r=>r.t/1000*2),.12);return 'keep'}},
 draw(s,f,X){
  const res=B8_optoRun(s.pulses,s.int/100),n=res.length,k=res.filter(r=>r.fire).length,x0=50,w=500,TX=t=>x0+t/1000*w;
  let out=heading(n?`${k} spike${k===1?'':'s'} from ${n} pulse${n===1?'':'s'}: ${Math.round(100*k/n)}% followed`:'Place some light pulses');
  // pulse timeline with slots
  out+=TF(x0,62,'light pulses (blue marks), press to add or remove',13,C.muted,'start');
  for(let i=0;i<B8_NSLOT;i++){const t=i*B8_SLOT,on=s.pulses.includes(t),x=TX(t);out+=hit(X,'slot',i,`Light pulse at ${t} ms: ${on?'on':'off'}`,R(x-5,72,10,34,on?C.blue:'#fff',on?C.blue:C.grid,3))}
  // membrane trace
  const yb=214,pts=[];let rest=yb;for(let t=0;t<=1000;t+=1){let v=0;for(const r of res){const d=t-r.t;if(d<0||d>40)continue;v+=r.fire?(d<1.5?70*d/1.5:d<3?70-90*(d-1.5)/1.5:-20*Math.exp(-(d-3)/10)):26*r.I*(d<3?d/3:Math.exp(-(d-3)/8))}pts.push([TX(t),rest-clamp(v,-30,70)])}
  out+=R(30,118,540,136,'#fff',C.grid,6)+TF(38,134,'membrane voltage',13,C.muted,'start')+L(TX(0),yb,TX(1000),yb,C.grid,1);
  out+=B8_poly(pts,C.ink,1.6);
  for(const r of res)if(!r.fire)out+=TF(TX(r.t),yb+26,'✕',13,C.coral);
  for(const t of [0,250,500,750,1000])out+=TF(TX(t),272,t===1000?'1000 ms':t,13,C.muted);
  out+=B8_tile(40,290,160,'Pulses',String(n),C.blue)+B8_tile(220,290,160,'Spikes',String(k),C.ink)+B8_tile(400,290,160,'Followed',n?Math.round(100*k/n)+'%':'none',k===n&&n?C.green:C.coral);
  out+=B8_note(`Simple model neuron. ✕ marks a pulse that failed. Light at ${s.int}%.`,358);
  const fails=n-k;
  return {svg:out,phase:!n?'No pulses: the neuron is quiet. Press the marks along the top to place light pulses.':fails===0?`Every pulse produced one spike, at the moment of the pulse. The pattern of light has become the pattern of firing, which is what made the 2005 result so useful: the experimenter, not the brain, decides when chosen cells fire.`:
   `${fails} of ${n} pulses failed (✕). In this model each pulse leaves the channels briefly less responsive, so pulses that come close together, or dim light, give too small a current to reach threshold. Spread the pulses out or raise the light.`};
 }});

// Twenty-four cells of three types in a patch of tissue. Type A carries the gene when targeting is on.
const B8_TCELLS=range(24).map(i=>({type:i%3===0?'A':i%3===1?'B':'C',x:70+(i%6)*44+(Math.floor(i/6)%2)*20,y:86+Math.floor(i/6)*42,rate:4+((i*7)%5)}));
function B8_tgtRate(c,s){const has=s.where==='all'||c.type==='A';if(!has||s.light==='off')return c.rate;const nm=s.light==='blue'?470:590,a=B8_spec(s.op,nm);return s.op==='chr2'?c.rate+40*a:c.rate*(1-.95*a)}
SCENE({id:'optogenetics-targeting',name:'Only the cells you choose',tag:'Genetic targeting, switching on and off',
 definition:'The light reaches every cell near the optical fibre, but only cells that carry the gene respond. Researchers choose those cells genetically: the gene is put in with a harmless virus and switched on only in cells of one type, for example the neurons that make a particular transmitter. Switching that group on or off and watching behaviour tests whether the group causes the behaviour, not just whether its activity goes with it.',
 example:'In 2007 Antoine Adamantidis, Feng Zhang, Luis de Lecea, Karl Deisseroth and colleagues put channelrhodopsin-2 into the orexin (hypocretin) neurons of mice. Light pulses to those cells made sleeping mice wake sooner: a direct test of what earlier recordings and lesions had suggested. Optogenetics is a research tool. Human use is at an early stage: in 2021 one man blinded by an inherited retinal disease, given a light-sensitive protein in cells of one retina and wearing special goggles, could locate and count some objects (Sahel and colleagues).',
 desc:'A patch of tissue with 24 neurons of three types, some carrying the gene, an optical fibre, and a short spike raster for each type before, during and after a light period marked on the time axis.',
 research:['Adamantidis, Zhang, Aravanis, Deisseroth & de Lecea (2007). Neural substrates of awakening probed with optogenetic control of hypocretin neurons. Nature 450, 420–424.','Tsai, Zhang, Adamantidis, Stuber, Bonci, de Lecea & Deisseroth (2009). Phasic firing in dopaminergic neurons is sufficient for behavioral conditioning. Science 324, 1080–1084.','Sahel, Boulanger-Scemama, Pagot, … & Roska (2021). Partial recovery of visual function in a blind patient after optogenetic therapy. Nature Medicine 27, 1223–1229 (a single participant).'],
 dur:12,hint:'Choose where the gene goes, which protein it makes and the colour of the light, then compare the three cell types’ firing during the light period. The cells and rates are illustrative.',
 init:()=>({where:'A',op:'chr2',light:'blue'}),
 watch(p){const seq=[['A','chr2','off'],['A','chr2','blue'],['all','chr2','blue'],['A','nphr','yellow'],['A','nphr','blue']],k=Math.min(4,Math.floor(p*5));return {where:seq[k][0],op:seq[k][1],light:seq[k][2]}},
 ui:[{choose:[['A','Type A only'],['all','Every cell']],label:'Gene in',get:s=>s.where,act:'where'},{choose:[['chr2','Channelrhodopsin'],['nphr','Halorhodopsin']],label:'Protein',get:s=>s.op,act:'op'},{choose:[['off','Light off'],['blue','Blue'],['yellow','Yellow']],label:'Light',get:s=>s.light,act:'light'}],
 on:{where(s,v){s.where=v==='all'?'all':'A'},op(s,v){s.op=v==='nphr'?'nphr':'chr2'},light(s,v){s.light=['off','blue','yellow'].includes(v)?v:'off'}},
 draw(s){
  const lc=s.light==='blue'?B8_wlCol(470):s.light==='yellow'?B8_wlCol(585):C.muted;
  const rA=B8_tgtRate({type:'A',rate:6},s),rB=B8_tgtRate({type:'B',rate:6},s),ch=Math.abs(rA-6)>2||Math.abs(rB-6)>2;
  let out=heading(s.light==='off'?'Light off: every cell fires at its own pace':!ch?'This colour barely moves this protein':s.where==='all'?'Every cell responds: no selectivity':s.op==='chr2'?'Only type A is switched on':'Only type A is silenced');
  // tissue
  out+=R(30,48,290,214,'#fbfcfd',C.grid,8);
  out+=`<polygon points="210,48 236,48 236,62 210,62" fill="${C.muted}"/>`+TF(244,60,'optical fibre',13,C.muted,'start');
  if(s.light!=='off')out+=`<polygon points="214,62 232,62 300,250 150,250" fill="${lc}" fill-opacity=".10"/>`;
  for(const c of B8_TCELLS){const has=s.where==='all'||c.type==='A',col=c.type==='A'?C.coral:c.type==='B'?C.blue:C.green;out+=Ci(c.x,c.y,11,has?tint(col,.55):'#fff',col)+TF(c.x,c.y+4,c.type,13,col)}
  out+=TF(40,280,'filled: carries the gene',13,C.ink,'start')+TF(40,298,'A, B, C: three cell types',13,C.muted,'start');
  // rasters by type
  const x0=372,w=198,TX=t=>x0+t/3*w;out+=R(340,48,244,214,'#fff',C.grid,8)+TF(350,66,'spikes over 3 s',13,C.muted,'start');
  out+=R(TX(1),74,TX(2)-TX(1),8,s.light==='off'?C.grid:lc,'none',2)+TF(TX(1.5),96,s.light==='off'?'(no light)':'light',13,s.light==='off'?C.muted:lc);
  [['A',C.coral],['B',C.blue],['C',C.green]].forEach(([ty,col],i)=>{const yb=128+i*44,cell=B8_TCELLS.find(c=>c.type===ty),r=B8_rng(i*17+(s.where==='all'?3:0)+(s.op==='nphr'?5:0)+(s.light==='blue'?7:s.light==='yellow'?11:0));
   out+=TBF(350,yb+4,ty,13,col,'start')+L(x0,yb+12,x0+w,yb+12,C.grid,1);
   for(let seg=0;seg<3;seg++){const rate=seg===1?B8_tgtRate(cell,s):cell.rate;let t=seg+B8_exp(r,1/rate);while(t<seg+1){out+=L(TX(t),yb-6,TX(t),yb+10,col,1.6);t+=B8_exp(r,1/rate)}}});
  for(const t of [0,1,2,3])out+=TF(TX(t),258,t+(t===3?' s':''),13,C.muted);
  out+=R(340,276,244,66,C.amberp,'none',8)+B8_lines(352,296,s.where==='all'?'With the gene everywhere, light changes every cell: the test says nothing about type A.':'Type A alone carries the gene, so any change in behaviour can be put down to type A.',33,13,C.ink);
  out+=B8_note('Illustrative cells and rates. Light is drawn as a bar on the time axis.',366);
  return {svg:out,phase:s.light==='off'?'Without light the gene does nothing: each cell fires at its usual rate. Switch the light on.':!ch?`${s.op==='chr2'?'Channelrhodopsin-2':'Halorhodopsin'} hardly absorbs ${s.light} light, so the cells carry on as before. Matching the colour to the protein is part of the design, and using two proteins with different colours lets one experiment switch two groups separately.`:
   s.where==='all'?'Every cell carries the gene, so all three types respond to the light. The experiment can no longer say which cells matter.':s.op==='chr2'?'Type A cells fire much faster during the light and return to normal after it; types B and C, lit just as brightly, are unaffected. If behaviour changes now, type A is enough to cause it.':'Type A falls nearly silent during the light while B and C carry on. If behaviour changes now, type A is needed for it.'};
 }});

/* ===================== Lesson: place-grid-cells ===================== */
// An 8 × 8 box (cells of about 12 cm). One place cell with a field centred at (5.3, 2.4) cells, width 0.9 cells,
// peak 16 spikes a second, background 0.2. Each step to a neighbouring square takes 0.5 s. Simulated.
const B8_PF={cx:5.3,cy:2.4,sd:.9,peak:16,base:.2,dt:.5};
const B8_pfRate=(x,y)=>B8_PF.base+B8_PF.peak*Math.exp(-((x-B8_PF.cx)**2+(y-B8_PF.cy)**2)/(2*B8_PF.sd**2));
const B8_pfNew=()=>({x:1,y:6,n:0,path:[[1,6]],occ:new Array(64).fill(0),spk:new Array(64).fill(0),dots:[],sound:0});
function B8_pfStep(s,nx,ny){const r=B8_rng(s.n*977+13);s.n++;s.x=nx;s.y=ny;const i=ny*8+nx;s.occ[i]+=B8_PF.dt;const k=B8_pois(r,B8_pfRate(nx+r(),ny+r())*B8_PF.dt),times=[];
 for(let j=0;j<k;j++){s.dots.push([nx+.15+.7*r(),ny+.15+.7*r()]);times.push(r()*B8_PF.dt)}s.spk[i]+=k;s.path.push([nx,ny]);if(s.path.length>240)s.path.shift();if(s.dots.length>500)s.dots.splice(0,s.dots.length-500);return times}
function B8_pfGo(s,tx,ty){const times=[];let step=0;while((s.x!==tx||s.y!==ty)&&step<20){const dx=tx-s.x,dy=ty-s.y;const nx=Math.abs(dx)>=Math.abs(dy)?s.x+Math.sign(dx):s.x,ny=Math.abs(dx)>=Math.abs(dy)?s.y:s.y+Math.sign(dy);for(const t of B8_pfStep(s,nx,ny))times.push(step*B8_PF.dt+t);step++}return times}
function B8_pfWander(s,n,seed){const r=B8_rng(seed);let times=[];for(let i=0;i<n;i++){const d=[[1,0],[-1,0],[0,1],[0,-1]][Math.floor(r()*4)],nx=clamp(s.x+d[0],0,7),ny=clamp(s.y+d[1],0,7);if(nx===s.x&&ny===s.y){i--;continue}times=times.concat(B8_pfStep(s,nx,ny).map(t=>i*B8_PF.dt+t))}return times}
const B8_PF_WATCH=(()=>{const cache={};return k=>{if(!cache[k]){const s=B8_pfNew();B8_pfWander(s,k,4242);cache[k]=s}return cache[k]}})();
SCENE({id:'place-grid-cells',name:'A cell that fires in one place',tag:'O’Keefe and Dostrovsky, 1971',
 definition:'In 1971 John O’Keefe and Jonathan Dostrovsky recorded single neurons in the hippocampus of rats moving freely on a platform. Some cells fired mainly when the rat was in one part of it. O’Keefe called them place cells, and with Lynn Nadel argued in 1978 that the hippocampus holds a map of the animal’s surroundings. A firing map is made by dividing the spikes fired in each spot by the time spent there.',
 example:'A rat that sits in the field for a long time produces many spikes there even if the cell fires no faster, so raw spike counts mislead. Dividing by time turns counts into rates. Different place cells have fields in different places, so together they cover the box, and recording a few dozen is enough to tell where the rat is (Wilson and McNaughton, 1993).',
 desc:'A box divided into 64 squares with the rat’s path and a red dot for each spike, beside the firing map made by dividing spikes by time in each square, and counts of time, spikes and the highest rate.',
 research:['O’Keefe & Dostrovsky (1971). The hippocampus as a spatial map. Preliminary evidence from unit activity in the freely-moving rat. Brain Research 34, 171–175.','O’Keefe & Nadel (1978). The Hippocampus as a Cognitive Map. Oxford University Press.','Wilson & McNaughton (1993). Dynamics of the hippocampal ensemble code for space. Science 261, 1055–1058.','Simulated cell with one field; spike counts vary at random from visit to visit.'],
 dur:12,hint:'Press a square to send the rat there, or let it wander. Fill the firing map until the field stands out. Turn clicks on to hear each spike as the rat crosses the field. Switch to 3D to see the map as a surface.',
 init:B8_pfNew,
 watch(p){return B8_PF_WATCH(Math.floor(p*120))},
 ui:[{b:'Wander 20 steps',act:'wander'},{choose:[[0,'Clicks off'],[1,'Clicks on']],label:'Sound',get:s=>s.sound,act:'sound'},{b:'Clear the map',act:'clear'}],
 on:{go(s,v,ctx){const i=clamp(Math.round(+v),0,63),t=B8_pfGo(s,i%8,Math.floor(i/8));if(s.sound)B8_click(t,.1);return 'keep'},
  wander(s){const t=B8_pfWander(s,20,s.n*31+7);if(s.sound)B8_click(t,.1);return 'keep'},sound(s,v){s.sound=+v?1:0;if(!s.sound)AUDIO.stopAll();return 'keep'},
  clear(s){const k=s.sound;Object.assign(s,B8_pfNew(),{sound:k,x:s.x,y:s.y,path:[[s.x,s.y]],n:s.n})}},
 draw(s,f,X){
  const x0=40,y0=58,c=32,tot=sum(s.occ),nsp=sum(s.spk);let peak=0,pi=-1;
  s.occ.forEach((o,i)=>{if(o>=1){const r=s.spk[i]/o;if(r>peak){peak=r;pi=i}}});
  let out=heading(tot?`${fmt(tot)} s explored, ${nsp} spike${nsp===1?'':'s'}${peak?`, peak ${fmt(B8_r1(peak))} a second`:''}`:'Send the rat around the box');
  out+=TF(x0,52,'the box: path and spikes',13,C.muted,'start');
  for(let i=0;i<64;i++){const gx=i%8,gy=Math.floor(i/8),inner=R(x0+gx*c,y0+gy*c,c,c,'#fbfcfd',C.grid,0);out+=hit(X,'go',i,`Send the rat to square ${gx+1}, ${gy+1}`,inner)}
  out+=B8_poly(s.path.map(q=>[x0+(q[0]+.5)*c,y0+(q[1]+.5)*c]),'#9fb9c9',2);
  for(const d of s.dots)out+=Ci(x0+d[0]*c,y0+d[1]*c,2.4,C.coral);
  out+=Ci(x0+(s.x+.5)*c,y0+(s.y+.5)*c,8,C.dark,'#fff');
  // firing map
  const m0=336,mc=26;out+=TF(m0,52,'firing map: spikes ÷ time',13,C.muted,'start');
  for(let i=0;i<64;i++){const gx=i%8,gy=Math.floor(i/8),o=s.occ[i],rt=o?s.spk[i]/o:0;out+=R(m0+gx*mc,y0+gy*mc,mc,mc,o?tint(C.coral,1-.95*clamp(rt/16,0,1)):'#e4eaee','#fff',0,'stroke-width="1"')}
  if(pi>=0)out+=R(m0+(pi%8)*mc,y0+Math.floor(pi/8)*mc,mc,mc,'none',C.ink,0);
  for(let i=0;i<=4;i++)out+=R(m0+i*30,y0+216,30,10,tint(C.coral,1-.95*i/4),'none',0);
  out+=TF(m0,y0+242,'0',13,C.muted,'start')+TF(m0+150,y0+242,'16 a second',13,C.muted,'end')+R(m0+160,y0+216,14,10,'#e4eaee','none',0)+TF(m0+180,y0+226,'not visited',13,C.muted,'start');
  out+=B8_tile(40,322,120,'Time in box',fmt(tot)+' s',C.ink)+B8_tile(170,322,120,'Spikes',String(nsp),C.coral)+B8_tile(336,322,120,'Highest rate',peak?fmt(B8_r1(peak))+' /s':'none',C.coral)+B8_tile(466,322,120,'Squares visited',String(s.occ.filter(o=>o>0).length),C.ink);
  return {svg:out,phase:!tot?'The rat sits in a corner. Press any square to send it there; each step takes half a second.':nsp<5?'Few spikes so far: the cell is nearly silent over most of the box. Explore further, towards the top right.':
   `Spikes cluster in one patch of the box. Dividing each square’s spikes by the time spent there gives the firing map: this cell’s field is near the top right, where it fires up to about ${Math.round(B8_PF.peak)} times a second, and it is almost silent elsewhere. More time in the box makes the map steadier.`};
 },
 three(s,f,X,project){
  const Pr=project([0,8,0,8,0,4.5]),faces=[];
  for(let i=0;i<64;i++){const gx=i%8,gy=Math.floor(i/8),o=s.occ[i],rt=o?s.spk[i]/o:0,h=Math.max(.04,clamp(rt,0,20)/16*4);
   faces.push(...prism(gx+.06,7-gy+.06,0,.88,.88,o?h:.02,o?tint(C.coral,.85-.8*clamp(rt/16,0,1)):'#dfe6eb'))}
  let out=poly3([[0,0,0],[8,0,0],[8,8,0],[0,8,0]],Pr,'#f3f6f8',C.grid)+paintFaces(faces,Pr);
  const q=Pr([8.6,8,0]);out+=TF(q[0],q[1],'top right',13,C.muted);
  return {svg:out,title:'The firing map as a surface',caption:'Each square’s height is the cell’s firing rate there (spikes ÷ time). A place field rises as a single hill; grey squares were not visited. The hill’s height is about 16 spikes a second in this simulated cell.'};
 }});

// Grid cells: three plane waves 60° apart give a triangular lattice of fields with spacing λ (cm) and orientation ω.
// Module spacings are illustrative, each about 1.4 times the last (Stensola and colleagues, 2012, report steps of about this size).
const B8_MODS=[40,57,80,113],B8_BOX=150;
function B8_grid(x,y,lam,om,ph){const k=4*Math.PI/(Math.sqrt(3)*lam);let g=0;for(let i=0;i<3;i++){const a=(om-30+i*60)*Math.PI/180;g+=Math.cos(k*((x-ph[0])*Math.cos(a)+(y-ph[1])*Math.sin(a)))}return Math.max(0,(g+1.5)/4.5)}
function B8_gridCentres(lam,om,ph){const a=om*Math.PI/180,b=(om+60)*Math.PI/180,out=[];for(let i=-8;i<=8;i++)for(let j=-8;j<=8;j++){const x=ph[0]+lam*(i*Math.cos(a)+j*Math.cos(b)),y=ph[1]+lam*(i*Math.sin(a)+j*Math.sin(b));if(x>=0&&x<=B8_BOX&&y>=0&&y<=B8_BOX)out.push([x,y])}return out}
SCENE({id:'place-grid-cells-grid',name:'A grid across the whole floor',tag:'Hafting, Fyhn, Molden, Moser and Moser, 2005',
 definition:'In 2005 Torkel Hafting, Marianne Fyhn, Sturla Molden, May-Britt Moser and Edvard Moser recorded from the medial entorhinal cortex, which feeds the hippocampus. Its grid cells fire at many places, and the places form a regular triangular lattice that covers the whole box. Neighbouring grid cells share the same spacing and orientation but are shifted, so together they tile the floor. John O’Keefe, May-Britt Moser and Edvard Moser shared the 2014 Nobel Prize for these cells that make up a positioning system in the brain.',
 example:'The spacing grows from the top (dorsal) to the bottom (ventral) of the entorhinal cortex, and in 2012 Hanne and Tor Stensola, with the Mosers and colleagues, found it grows in steps: cells fall into a few modules, each with its own spacing. A lattice of fields is what a system that adds up its own movements (path integration) might produce; whether that is how grid cells arise is still argued.',
 desc:'A firing map of one grid cell in a 1.5-metre box, with its fields at the corners of equilateral triangles, an optional second cell from the same module drawn as rings, and a strip of entorhinal cortex from dorsal to ventral with the chosen module marked.',
 research:['Hafting, Fyhn, Molden, Moser & Moser (2005). Microstructure of a spatial map in the entorhinal cortex. Nature 436, 801–806.','Stensola, Stensola, Solstad, Frøland, Moser & Moser (2012). The entorhinal grid map is discretized. Nature 492, 72–78.','McNaughton, Battaglia, Jensen, Moser & Moser (2006). Path integration and the neural basis of the “cognitive map”. Nature Reviews Neuroscience 7, 663–678.','In people: place-like cells (Ekstrom et al. 2003, Nature 425, 184–188) and grid-like cells (Jacobs et al. 2013, Nature Neuroscience 16, 1188–1190) recorded in patients being assessed for epilepsy surgery, during virtual navigation tasks.'],
 dur:12,hint:'Choose a module from dorsal to ventral, turn the lattice, and press the map to move this cell’s fields. Add a second cell from the same module and see how the two interleave. The map is simulated.',
 init:()=>({mod:1,om:10,ph:[40,40],two:0,tri:1}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {mod:k,om:10+Math.round(20*p),ph:[40,40],two:p>.5?1:0,tri:1}},
 ui:[{choose:B8_MODS.map((v,i)=>[i,i===0?'Module 1 (dorsal)':i===3?'4 (ventral)':String(i+1)]),label:'Module',get:s=>s.mod,act:'mod'},{range:'om',label:'Orientation',min:0,max:55,step:5,get:s=>s.om,act:'om',show:v=>v+'°'},{choose:[[0,'One cell'],[1,'Add a neighbour']],label:'Cells',get:s=>s.two,act:'two'},{choose:[[1,'Triangles on'],[0,'off']],label:'Triangles',get:s=>s.tri,act:'tri'}],
 on:{mod(s,v){s.mod=clamp(Math.round(+v),0,3)},om(s,v){s.om=clamp(Math.round(+v/5)*5,0,55)},two(s,v){s.two=+v?1:0},tri(s,v){s.tri=+v?1:0},
  ph(s,v){const i=clamp(Math.round(+v),0,35);s.ph=[(i%6+.5)*B8_BOX/6,(Math.floor(i/6)+.5)*B8_BOX/6]}},
 draw(s,f,X){
  const lam=B8_MODS[s.mod],x0=40,y0=56,W=240,n=30,c=W/n,sc=W/B8_BOX,ph2=[s.ph[0]+lam*Math.cos((s.om+30)*Math.PI/180)/Math.sqrt(3),s.ph[1]+lam*Math.sin((s.om+30)*Math.PI/180)/Math.sqrt(3)];
  const cen=B8_gridCentres(lam,s.om,s.ph);
  let out=heading(`Module ${s.mod+1}: fields ${lam} cm apart, ${cen.length} in the box`);
  for(let i=0;i<n;i++)for(let j=0;j<n;j++){const g=B8_grid((i+.5)*B8_BOX/n,(j+.5)*B8_BOX/n,lam,s.om,s.ph)**3;out+=R(x0+i*c,y0+j*c,c+.4,c+.4,tint(C.coral,1-.95*g),'none',0)}
  out+=R(x0,y0,W,W,'none',C.line,0);
  if(s.tri){const a=s.om*Math.PI/180,b=(s.om+60)*Math.PI/180,mx=v=>x0+v*sc,my=v=>y0+v*sc;
   for(const p of cen){for(const ang of [a,b,b+Math.PI/3]){const q=[p[0]+lam*Math.cos(ang),p[1]+lam*Math.sin(ang)];if(q[0]>=0&&q[0]<=B8_BOX&&q[1]>=0&&q[1]<=B8_BOX)out+=L(mx(p[0]),my(p[1]),mx(q[0]),my(q[1]),C.ink,1.2,'stroke-opacity=".55"')}}}
  if(s.two)for(const p of B8_gridCentres(lam,s.om,ph2))out+=Ci(x0+p[0]*sc,y0+p[1]*sc,7,'none',C.blue,'stroke-width="2.5"');
  for(let i=0;i<36;i++){const gx=i%6,gy=Math.floor(i/6);out+=hit(X,'ph',i,`Move this cell’s fields to point ${gx+1}, ${gy+1}`,R(x0+gx*W/6,y0+gy*W/6,W/6,W/6,'#fff','none',0,'fill-opacity="0"'))}
  out+=TF(x0,y0+W+18,'0',13,C.muted,'start')+TF(x0+W,y0+W+18,'1.5 m',13,C.muted,'end')+TF(x0+W/2,y0+W+18,'box seen from above',13,C.muted);
  if(s.two)out+=Ci(x0+8,y0+W+38,6,'none',C.blue)+TF(x0+20,y0+W+42,'a neighbouring cell, same module',13,C.blue,'start');
  // entorhinal strip
  const sx=330,sy=64;out+=TBF(sx,sy,'Medial entorhinal cortex',13,C.ink,'start')+TF(sx,sy+18,'dorsal (top) → ventral (bottom)',13,C.muted,'start');
  B8_MODS.forEach((v,i)=>{const y=sy+32+i*40,on=i===s.mod;out+=R(sx,y,120,34,on?C.coralp:'#fff',on?C.coral:C.grid,6)+TBF(sx+60,y+22,`module ${i+1}`,13,on?C.coral:C.muted)+TF(sx+132,y+22,v+' cm',13,on?C.ink:C.muted,'start')});
  out+=TF(sx,sy+200,'each step about 1.4 times the last',13,C.muted,'start')+TF(sx,sy+216,'(spacings here are illustrative)',13,C.muted,'start');
  out+=B8_tile(330,300,120,'Spacing',lam+' cm',C.coral)+B8_tile(460,300,120,'Orientation',s.om+'°',C.ink);
  out+=B8_note('Simulated firing map. The lattice is drawn from three waves 60° apart.',366);
  return {svg:out,phase:`This grid cell fires at ${cen.length} places in the box, ${lam} cm apart, each field at the corner of equilateral triangles${s.tri?' (drawn in)':''}. ${s.two?'Its neighbour from the same module has the same spacing and orientation but is shifted, so the two fire in different places and a few such cells cover the whole floor.':'Press the map to shift the fields: cells in one module differ in this shift, not in spacing.'} ${s.mod===3?'Ventral modules have the widest spacing.':''}`.trim()};
 }});

// Theta phase precession on a linear track: field from 80 to 120 cm, theta at 8 Hz. In each cycle the cell fires
// at a phase that falls from about 360° to 60° as the rat crosses the field. Simulated.
const B8_PP={a:80,len:40,theta:8};
function B8_ppRun(v,seed){const r=B8_rng(seed*101+v),T=B8_PP.len/v,psi=r(),sp=[];
 for(let c=0;c<Math.ceil(T*B8_PP.theta)+2;c++){const tc=(c-psi+.5)/B8_PP.theta;if(tc<0||tc>T)continue;const fr=tc/T,ph0=360-300*fr,k=B8_pois(r,2.4*Math.sin(Math.PI*fr));
  for(let j=0;j<k;j++){const ph=clamp(ph0+22*B8_gauss(r),5,355),t=(c-psi+ph/360)/B8_PP.theta;if(t>=0&&t<=T)sp.push({t,x:B8_PP.a+v*t,ph,v})}}
 return {v,T,psi,sp}}
function B8_corr(a,b){const n=a.length;if(n<3)return 0;const ma=sum(a)/n,mb=sum(b)/n;let sab=0,saa=0,sbb=0;for(let i=0;i<n;i++){sab+=(a[i]-ma)*(b[i]-mb);saa+=(a[i]-ma)**2;sbb+=(b[i]-mb)**2}return saa&&sbb?sab/Math.sqrt(saa*sbb):0}
const B8_SPEEDS={10:C.purple,20:C.blue,40:C.green};
SCENE({id:'place-grid-cells-precession',name:'Early or late in the theta wave',tag:'O’Keefe and Recce, 1993',
 definition:'While a rat runs, its hippocampus shows a steady rhythm of about 8 waves a second, the theta rhythm. In 1993 John O’Keefe and Michael Recce found that a place cell does not fire at a fixed point of the wave. As the rat enters the field the cell fires late in each wave; as it moves through, the spikes come earlier and earlier. The phase of the spikes tracks the rat’s position in the field better than the time since it entered.',
 example:'Run slowly and the crossing takes four seconds; run fast and it takes one. Against time the spikes then fall along lines of different slope. Against position they fall along one band, about 300° of phase over the 40 cm field. What precession is for is debated: one proposal is that it compresses a sequence of places into each theta wave (Skaggs and colleagues, 1996).',
 desc:'A linear track with a place field, the theta wave during the last crossing with the cell’s spikes marked on it, and two scatter plots of spike phase: against position in the field, and against time since entering it, coloured by running speed.',
 research:['O’Keefe & Recce (1993). Phase relationship between hippocampal place units and the EEG theta rhythm. Hippocampus 3, 317–330.','Skaggs, McNaughton, Wilson & Barnes (1996). Theta phase precession in hippocampal neuronal populations and the compression of temporal sequences. Hippocampus 6, 149–172.','Vanderwolf (1969). Hippocampal electrical activity and voluntary movement in the rat. Electroencephalography and Clinical Neurophysiology 26, 407–418 (theta during movement).'],
 dur:12,hint:'Run the rat through the field at different speeds and compare the two scatter plots: which one keeps a single band? Hear plays the last crossing’s spikes as clicks, in real time. The cell is simulated.',
 init:()=>({runs:[],v:20}),
 watch(p){const sp=[20,10,40,20,10,40],k=Math.min(6,Math.floor(p*7));return {runs:range(k).map(i=>[sp[i],i+1]),v:sp[Math.max(0,k-1)]}},
 ui:[{choose:[[10,'Slow (10 cm/s)'],[20,'Medium (20)'],[40,'Fast (40)']],label:'Speed',get:s=>s.v,act:'v'},{b:'Run through the field',act:'run'},{b:'Hear the last run ▶',act:'hear'},{b:'Clear',act:'clear'}],
 on:{v(s,v){s.v=[10,20,40].includes(+v)?+v:20;return 'keep'},run(s){s.runs.push([s.v,s.runs.length+1]);if(s.runs.length>12)s.runs.shift()},clear(s){s.runs=[]},
  hear(s){if(!s.runs.length)return 'keep';const q=s.runs[s.runs.length-1],r=B8_ppRun(q[0],q[1]);B8_click(r.sp.map(x=>x.t),.1);return 'keep'}},
 draw(s){
  const runs=s.runs.map(q=>B8_ppRun(q[0],q[1])),last=runs[runs.length-1],all=[].concat(...runs.map(r=>r.sp));
  const rx=B8_corr(all.map(p=>p.x),all.map(p=>p.ph)),rt=B8_corr(all.map(p=>p.t),all.map(p=>p.ph)),mixed=new Set(s.runs.map(q=>q[0])).size>1;
  let out=heading(!runs.length?'Run the rat through the place field':`${runs.length} run${runs.length===1?'':'s'}: phase follows ${mixed&&Math.abs(rx)>Math.abs(rt)+.05?'position, not time':'the crossing'}`);
  // track
  const tx=v=>40+v/200*520;out+=R(40,56,520,18,'#fbfcfd',C.grid,9)+R(tx(80),56,tx(120)-tx(80),18,C.coralp,C.coral,9)+TF(tx(100),90,'place field, 80–120 cm',13,C.coral);
  out+=TF(40,90,'0',13,C.muted,'start')+TF(560,90,'200 cm',13,C.muted,'end');
  if(last)out+=Ci(tx(120),65,7,C.dark,'#fff');
  // theta and spikes of the last run
  const wx=40,ww=520,wy=134;out+=R(30,100,540,66,'#fff',C.grid,6);
  if(last){const TX=t=>wx+t/last.T*ww,pts=[];for(let i=0;i<=400;i++){const t=i/400*last.T,ph=((t*B8_PP.theta+last.psi)%1)*2*Math.PI;pts.push([TX(t),wy+12*Math.cos(ph)])}
   out+=B8_poly(pts,C.muted,1.4);for(const p of last.sp)out+=L(TX(p.t),wy-24,TX(p.t),wy-14,B8_SPEEDS[last.v],2.2);
   out+=TF(38,116,`last run at ${last.v} cm/s: theta wave and spikes`,13,C.muted,'start')+TF(562,116,`${fmt(last.T)} s in the field`,13,C.muted,'end')}
  else out+=TF(300,138,'no run yet',13,C.muted);
  // scatter: phase against position
  const p1=B8_plot(70,192,210,120,[80,120],[0,360],{xt:[[80,'80'],[100,'100'],[120,'120 cm']],yt:[[0,'0°'],[180,'180°'],[360,'360°']],xlDy:32,xl:'position in the field',yl:'spike phase'});out+=p1.svg;
  const p2=B8_plot(360,192,210,120,[0,4],[0,360],{xt:[[0,'0'],[2,'2'],[4,'4 s']],yt:[[0,'0°'],[180,'180°'],[360,'360°']],xlDy:32,xl:'time since entering',yl:'spike phase'});out+=p2.svg;
  for(const p of all){out+=Ci(p1.X(p.x),p1.Y(p.ph),2.4,B8_SPEEDS[p.v])+Ci(p2.X(Math.min(4,p.t)),p2.Y(p.ph),2.4,B8_SPEEDS[p.v])}
  if(all.length>5)out+=TF(278,206,`r = ${B8_sg(B8_r2(rx))}`,13,C.ink,'end')+TF(568,206,`r = ${B8_sg(B8_r2(rt))}`,13,C.ink,'end');
  [[10,'slow'],[20,'medium'],[40,'fast']].forEach(([v,l],i)=>{out+=Ci(80+i*90,362,4,B8_SPEEDS[v])+TF(88+i*90,366,l,13,C.muted,'start')});
  out+=TF(560,366,'simulated cell',13,C.muted,'end');
  return {svg:out,phase:!runs.length?'Press Run. The rat crosses the field from left to right while theta waves pass through the hippocampus eight times a second.':!mixed?`At one speed both plots show a clean band: the spikes start late in the wave and move earlier as the rat crosses. Now run at a different speed and see which plot keeps one band.`:
   `With mixed speeds the phase still falls along one band against position (r = ${B8_sg(B8_r2(rx))}), but against time the slow runs stretch out and the fast runs squeeze together (r = ${B8_sg(B8_r2(rt))}). The spike phase carries where the rat is in the field, a second code on top of the firing rate.`};
 }});

/* ===================== Lesson: brain-computer-interfaces ===================== */
// Fetz-style operant conditioning of one cell, simulated minute by minute: with reward the rate moves 30% of the way
// towards 32 spikes a second each minute; without it, back towards a resting 10. Illustrative values.
function B8_fetzSeries(blocks){const r=B8_rng(77),out=[];let rate=10;blocks.forEach((b,bi)=>{for(let m=0;m<5;m++){rate+=.3*((b==='rew'?32:10)-rate);out.push({b,bi,rate:Math.max(0,rate+1.5*B8_gauss(r))})}});return out}
SCENE({id:'brain-computer-interfaces',name:'A monkey learns to drive one neuron',tag:'Fetz, 1969',
 definition:'In 1969 Eberhard Fetz recorded a single neuron in the motor cortex of monkeys and made its activity visible to the monkey on a meter. When the cell fired a burst, the monkey got a food pellet. Within minutes the monkeys raised the cell’s firing rate, and when reward stopped the rate fell back. A neuron’s activity, normally hidden, had become something the animal could learn to control once it could see it.',
 example:'This is the other half of every brain–computer interface. A decoder translates activity into commands, and the brain also learns to produce activity that the decoder reads well. Fetz’s group later showed that monkeys could use a cortical cell’s activity, routed around a temporarily paralysed nerve, to stimulate and move their own wrist muscles (Moritz, Perlmutter and Fetz, 2008).',
 desc:'A bar for each minute of a session showing one cortical cell’s firing rate, in blocks with and without reward for bursts, with a meter showing the rate in the last minute.',
 research:['Fetz (1969). Operant conditioning of cortical unit activity. Science 163, 955–958.','Fetz & Finocchio (1971). Operant conditioning of specific patterns of neural and muscular activity. Science 174, 431–435.','Moritz, Perlmutter & Fetz (2008). Direct control of paralysed muscles by cortical neurons. Nature 456, 639–642.','The session here is simulated; the learning curve’s shape, not its numbers, follows the 1969 report.'],
 dur:12,hint:'Add five-minute blocks with or without reward and watch the cell’s rate follow. Hear plays two seconds of the cell at its last rate, slowed to half speed, as clicks.',
 init:()=>({blocks:['base']}),
 watch(p){const all=['base','rew','rew','off','off','rew'],k=Math.max(1,Math.min(6,Math.ceil(p*6.2)));return {blocks:all.slice(0,k)}},
 ui:[{b:'5 min, no reward',act:'off'},{b:'5 min, reward for bursts',act:'rew'},{b:'Hear the cell ▶',act:'hear'},{b:'New session',act:'again'}],
 on:{off(s){if(s.blocks.length<8)s.blocks.push('off')},rew(s){if(s.blocks.length<8)s.blocks.push('rew')},again(s){s.blocks=['base']},
  hear(s){const ser=B8_fetzSeries(s.blocks),rt=ser[ser.length-1].rate,r=B8_rng(s.blocks.length*7+1),t=[];let x=B8_exp(r,1/rt);while(x<2){t.push(x*2);x+=B8_exp(r,1/rt)}B8_click(t.filter(v=>v<4),.1);return 'keep'}},
 draw(s){
  const ser=B8_fetzSeries(s.blocks),last=ser[ser.length-1],rew=s.blocks[s.blocks.length-1]==='rew';
  let out=heading(rew?`Reward on: the rate climbs to ${Math.round(last.rate)} a second`:s.blocks.length>1&&s.blocks.includes('rew')?`Reward off: the rate falls back to ${Math.round(last.rate)}`:'Baseline: the cell fires at its own pace');
  const pl=B8_plot(60,62,380,200,[0,40],[0,40],{xt:[[0,'0'],[10,'10'],[20,'20'],[30,'30'],[40,'40 min']],yt:[[0,'0'],[10,'10'],[20,'20'],[30,'30'],[40,'40']],xl:'minutes',xlDy:32,yl:'spikes a second'});out+=pl.svg;
  s.blocks.forEach((b,i)=>{if(b==='rew')out+=R(pl.X(i*5),63,pl.X(5)-pl.X(0),198,C.greenp,'none',0)});
  ser.forEach((q,i)=>out+=R(pl.X(i)+1,pl.Y(q.rate),pl.X(1)-pl.X(0)-2,pl.Y(0)-pl.Y(q.rate),q.b==='rew'?C.green:C.blue,'none',1));
  out+=R(60,300,14,12,C.greenp,'none',2)+TF(80,311,'reward for bursts',13,C.ink,'start')+R(220,300,12,12,C.blue,'none',2)+TF(238,311,'rate, no reward',13,C.ink,'start');
  // meter
  const mx=520,my=170,mr=58,ang=Math.PI*(1-clamp(last.rate/40,0,1));out+=TBF(mx,72,'The monkey’s meter',13,C.ink);
  out+=P(`M${mx-mr} ${my} A${mr} ${mr} 0 0 1 ${mx+mr} ${my}`,C.line,8)+arrow(mx,my,mx+mr*.9*Math.cos(ang),my-mr*.9*Math.sin(ang),C.coral,3)+Ci(mx,my,5,C.dark);
  out+=TF(mx-mr,my+20,'0',13,C.muted)+TF(mx+mr,my+20,'40',13,C.muted)+TBF(mx,my+44,Math.round(last.rate)+' a second',15,C.coral);
  out+=B8_tile(460,250,120,'Minutes',String(ser.length),C.ink);
  out+=B8_note('Simulated session. Monkeys were rewarded with food; the meter made the cell’s activity visible.',352);
  return {svg:out,phase:rew?'With every burst rewarded and the rate on the meter, the cell fires more and more within a few minutes. The monkey cannot feel one neuron, but it can find whatever it does that makes the needle rise.':s.blocks.includes('rew')?'Without reward the rate drifts back towards where it started, as Fetz reported: the change was learned behaviour, kept up by its consequences.':'Before any training the cell fires at about ten spikes a second, rising and falling with whatever the monkey happens to do. Add a block with reward.'};
 }});

// A simulated intracortical array: cosine-tuned cells with drift from day to day. A linear decoder is fitted on
// calibration trials (8 directions × 3) and then used to move a cursor to 8 targets.
function B8_bciCells(n,day){const r0=B8_rng(4040),base=range(96).map(()=>({pd:r0()*360,b:8+r0()*20,k:5+r0()*10}));
 const cells=base.slice(0,n).map(c=>({...c}));for(let d=1;d<=day;d++){const r=B8_rng(900+d);cells.forEach((c,i)=>{const g1=B8_gauss(r),g2=B8_gauss(r),u=r();c.pd+=28*g1;c.b=Math.max(1,c.b*(1+.25*g2));if(u<.07){c.b=.5;c.k=0}})}return cells}
const B8_rate=(c,th)=>Math.max(0,c.b+c.k*Math.cos((th-c.pd)*Math.PI/180));
function B8_bciFit(n,day){const cells=B8_bciCells(n,day),r=B8_rng(day*31+n);return cells.map(c=>{let m=0,ax=0,ay=0;for(let rep=0;rep<3;rep++)for(let j=0;j<8;j++){const th=j*45,v=B8_pois(r,B8_rate(c,th));m+=v/24;ax+=v*Math.cos(th*Math.PI/180)/12;ay+=v*Math.sin(th*Math.PI/180)/12}return {b:m,ax,ay}})}
function B8_bciDecode(dec,rates){let a=0,b=0,d=0,ux=0,uy=0;dec.forEach((p,i)=>{a+=p.ax*p.ax;b+=p.ax*p.ay;d+=p.ay*p.ay;const e=rates[i]-p.b;ux+=p.ax*e;uy+=p.ay*e});const det=a*d-b*b||1;return [(d*ux-b*uy)/det,(a*uy-b*ux)/det]}
function B8_bciTest(n,calDay,day,seed){const dec=B8_bciFit(n,calDay),cells=B8_bciCells(n,day),r=B8_rng(seed*7919+day*13+calDay),paths=[];let hits=0,errs=[];
 for(let j=0;j<8;j++){const th=j*45,tx=Math.cos(th*Math.PI/180),ty=Math.sin(th*Math.PI/180);let x=0,y=0;const path=[[0,0]];let hit=false;
  for(let st=0;st<16&&!hit;st++){const rates=cells.map(c=>B8_pois(r,B8_rate(c,th)*.3)/.3);const u=B8_bciDecode(dec,rates),m=Math.hypot(u[0],u[1])||1;errs.push(Math.abs(((Math.atan2(u[1],u[0])*180/Math.PI-th)%360+540)%360-180));const sp=.13*Math.min(1.6,m);x+=u[0]/m*sp;y+=u[1]/m*sp;path.push([x,y]);if(Math.hypot(x-tx,y-ty)<.2)hit=true}
  if(hit)hits++;paths.push({path,hit,th})}
 return {paths,hits,err:sum(errs)/errs.length}}
const B8_bciInit=()=>({n:96,day:0,cal:null,tests:[],seed:1});
function B8_bciDo(s,a){if(a==='cal')s.cal=s.day;else if(a==='day'){s.day=Math.min(9,s.day+1)}else if(a==='test'&&s.cal!==null){s.seed++;const t=B8_bciTest(s.n,s.cal,s.day,s.seed);s.tests.push({n:s.n,cal:s.cal,day:s.day,hits:t.hits,err:t.err,seed:s.seed});if(s.tests.length>6)s.tests.shift()}}
SCENE({id:'brain-computer-interfaces-cursor',name:'Calibrate, decode, recalibrate',tag:'BrainGate: Hochberg and colleagues, 2006',
 definition:'In 2006 Leigh Hochberg, John Donoghue and colleagues reported that a man with tetraplegia after a spinal cord injury could move a computer cursor using signals from an array of 96 electrodes in his motor cortex. First the decoder is calibrated: the person attempts or imagines movements in known directions while the cells are recorded, and a decoder is fitted to the cells’ tuning. Then it turns new activity into cursor movement.',
 example:'The recorded signals change from day to day as electrodes shift and cells are gained or lost, so a decoder fitted on one day works worse on the next. Early systems were recalibrated each session; later ones recalibrate themselves during use (Jarosiewicz and colleagues, 2015). Each study involved one or a few participants and brain surgery to implant the array.',
 desc:'A screen with a centre and eight targets showing the cursor’s path towards each, beside a record of each test: how many targets were reached, and on which day the decoder had been calibrated.',
 research:['Hochberg, Serruya, Friehs, Mukand, Saleh, Caplan, Branner, Chen, Penn & Donoghue (2006). Neuronal ensemble control of prosthetic devices by a human with tetraplegia. Nature 442, 164–171.','Jarosiewicz et al. (2015). Virtual typing by people with tetraplegia using a self-calibrating intracortical brain-computer interface. Science Translational Medicine 7, 313ra179.','Builds on population coding (Georgopoulos et al. 1986). Cells, drift and decoder are simulated: cosine tuning, Poisson counts, a linear decoder.'],
 dur:14,hint:'Calibrate, then test the eight targets. Move on a day or two and test again with the old decoder, then recalibrate. Fewer cells make everything harder. Everything is simulated.',
 init:B8_bciInit,
 watch(p){const seq=['cal','test','day','test','day','test','cal','test'],k=Math.min(8,Math.floor(p*9));const s=B8_bciInit();for(let i=0;i<k;i++)B8_bciDo(s,seq[i]);return s},
 ui:[{choose:[[16,'16 cells'],[40,'40'],[96,'96']],label:'Cells recorded',get:s=>s.n,act:'n'},{b:'Calibrate today',act:'cal'},{b:'Test 8 targets',act:'test'},{b:'A day later',act:'day'},{b:'Start again',act:'again'}],
 on:{n(s,v){s.n=[16,40,96].includes(+v)?+v:96;s.cal=null},cal(s){B8_bciDo(s,'cal')},test(s){B8_bciDo(s,'test')},day(s){B8_bciDo(s,'day')},again(s){Object.assign(s,B8_bciInit(),{n:s.n})}},
 draw(s){
  const last=s.tests[s.tests.length-1],run=last?B8_bciTest(last.n,last.cal,last.day,last.seed):null,cx=160,cy=184,R0=100;
  let out=heading(s.cal===null?`Day ${s.day}: no decoder yet, calibrate first`:last&&last.day===s.day&&last.cal===s.cal?`Day ${s.day}, decoder from day ${s.cal}: ${last.hits} of 8 reached`:`Day ${s.day}, decoder from day ${s.cal}: test it`);
  out+=R(40,58,240,248,C.dark,'none',10)+TF(160,76,'the participant’s screen',13,'#cfe0ea');
  for(let j=0;j<8;j++){const a=j*45*Math.PI/180;out+=Ci(cx+R0*Math.cos(a),cy-R0*Math.sin(a),14,'none','#cfe0ea')}
  out+=Ci(cx,cy,5,'#cfe0ea');
  if(run&&last.day===s.day)for(const q of run.paths)out+=B8_poly(q.path.map(p=>[cx+p[0]*R0,cy-p[1]*R0]),q.hit?'#7fd3b5':'#f0a48f',2);
  out+=TF(160,324,run&&last.day===s.day?'green: reached · red: missed in time':'',13,C.muted);
  // history
  out+=TBF(320,72,'Tests so far',13,C.ink,'start')+TF(580,72,'reached of 8',13,C.muted,'end');
  s.tests.forEach((t,i)=>{const y=84+i*34,w=t.hits/8*130,old=t.cal!==t.day;out+=TF(320,y+20,`day ${t.day}, cal ${t.cal}`,13,old?C.coral:C.ink,'start')+R(430,y+6,130,20,'#fff',C.grid,4)+R(430,y+6,w,20,old?C.coral:C.green,'none',4)+TF(580,y+21,t.hits,13,C.ink,'end')});
  if(!s.tests.length)out+=TF(320,110,'none yet',13,C.muted,'start');
  out+=B8_tile(320,294,80,'Cells',String(s.n),C.ink)+B8_tile(408,294,80,'Today',`day ${s.day}`,C.ink)+B8_tile(496,294,88,'Decoder',s.cal===null?'none':`day ${s.cal}`,s.cal===s.day?C.green:C.coral);
  out+=B8_note('Simulated cells, drift and decoder.',364);
  const stale=s.cal!==null&&s.cal!==s.day;
  return {svg:out,phase:s.cal===null?'Calibrate first: the participant attempts movements towards each target in turn while the cells are recorded, and a decoder is fitted to how each cell’s rate varies with direction.':
   !last||last.day!==s.day||last.cal!==s.cal?(stale?`The decoder was fitted on day ${s.cal}; it is now day ${s.day}. Test it and see whether it still works.`:'The decoder is fresh. Test it on the eight targets.'):
   stale?`With a decoder from day ${s.cal}, ${last.hits} of 8 targets were reached; the average error of each decoded step was ${Math.round(last.err)}°. Overnight, cells shifted their tuning and some went quiet, so the old decoder misreads them. Recalibrate.`:
   `${last.hits} of 8 targets reached with a decoder fitted today from ${s.n} cells; each decoded step was off by ${Math.round(last.err)}° on average. ${s.n<30?'With few cells the cursor wanders: each cell’s random variation weighs heavily.':'Many cells average out each cell’s random variation.'}`};
 }});

// Handwriting decoded letter by letter, with errors among similar-looking letters, then corrected word by word
// against a small vocabulary. Simulated; the published results are shown beside it.
const B8_LOOK={a:'o',o:'a',e:'c',c:'e',n:'h',h:'n',r:'v',v:'r',i:'l',l:'i',u:'v',m:'n',t:'f',f:'t',s:'z',g:'q',b:'h',d:'a',p:'q',w:'u',k:'h',y:'g',x:'k',z:'s',q:'g',j:'i'};
const B8_SENTS=['please bring me some water','i would like to go outside','my hands feel cold today'];
const B8_VOCAB='the to me my go do so no in is it on at a i we be some same come home water later would could wood like lake line to too outside inside please place bring ring sing feel fell feet hands hand cold could gold today toad mouse house'.split(' ');
function B8_edit(a,b){const d=range(b.length+1);for(let i=1;i<=a.length;i++){let prev=d[0];d[0]=i;for(let j=1;j<=b.length;j++){const t=d[j];d[j]=Math.min(d[j]+1,d[j-1]+1,prev+(a[i-1]===b[j-1]?0:1));prev=t}}return d[b.length]}
function B8_hand(sent,err,lm){const r=B8_rng(sent.length*97+7),raw=sent.split('').map((ch,i)=>{const u=r();return ch!==' '&&u<err?(B8_LOOK[ch]||ch):ch}).join('');
 const fixed=lm?raw.split(' ').map(w=>{let best=w,bd=9;for(const v of B8_VOCAB){const d=B8_edit(w,v);if(d<bd){bd=d;best=v}}return bd<=2?best:w}).join(' '):raw;return {raw,fixed}}
const B8_cer=(a,b)=>b.split('').filter((c,i)=>c!==a[i]).length/a.replace(/ /g,'').length;
SCENE({id:'brain-computer-interfaces-writing',name:'Handwriting and speech, decoded',tag:'Willett and colleagues, 2021; two speech studies, 2023',
 definition:'In 2021 Francis Willett, Krishna Shenoy and colleagues asked a man paralysed from the neck down to attempt to write letters by hand. Activity recorded in his motor cortex was decoded into text at 90 characters a minute, about 94% correct as he wrote, and over 99% when a language model corrected the text afterwards. In 2023 two studies in Nature decoded attempted speech to text, in a woman with ALS (motor neurone disease) from implanted electrode arrays, and in a woman paralysed by a brainstem stroke from electrodes laid on the cortex.',
 example:'Each system decodes attempted movements of the hand, lips, tongue and larynx; the person must actively try to write or speak. A language model then picks likely words, which fixes many errors and can occasionally introduce one. Each study had one participant, and the systems are research devices, not products.',
 desc:'A sentence the participant attempts to write, the letters as decoded with errors among similar-looking letters, and the text after word-level correction, with the character error rates and the published results for handwriting and speech.',
 research:['Willett, Avansino, Hochberg, Henderson & Shenoy (2021). High-performance brain-to-text communication via handwriting. Nature 593, 249–254.','Willett, Kunz, Fan, … & Henderson (2023). A high-performance speech neuroprosthesis. Nature 620, 1031–1036: 62 words a minute; 9.1% of words wrong with a 50-word vocabulary, 23.8% with a 125,000-word vocabulary.','Metzger, Littlejohn, Silva, … & Chang (2023). A high-performance neuroprosthesis for speech decoding and avatar control. Nature 620, 1037–1046: text at 78 words a minute with a median 25% of words wrong (1,024-word vocabulary).'],
 dur:12,hint:'Pick a sentence, set how noisy the decoded letters are, and switch the word correction on and off. Watch which errors it fixes and whether it ever makes one. Everything here is simulated.',
 init:()=>({k:0,err:8,lm:0}),
 watch(p){const k=Math.min(5,Math.floor(p*6));return {k:Math.floor(k/2)%3,err:[8,8,15,15,25,25][k],lm:k%2}},
 ui:[{choose:B8_SENTS.map((v,i)=>[i,'Sentence '+(i+1)]),label:'Sentence',get:s=>s.k,act:'k'},{range:'err',label:'Letter errors',min:0,max:30,step:1,get:s=>s.err,act:'err',show:v=>v+'%'},{choose:[[0,'Correction off'],[1,'Correction on']],label:'Word correction',get:s=>s.lm,act:'lm'}],
 on:{k(s,v){s.k=clamp(Math.round(+v),0,2)},err(s,v){s.err=clamp(Math.round(+v),0,30)},lm(s,v){s.lm=+v?1:0}},
 draw(s){
  const sent=B8_SENTS[s.k],d=B8_hand(sent,s.err/100,1),shown=s.lm?d.fixed:d.raw,c1=B8_cer(sent,d.raw),c2=B8_cer(sent,d.fixed);
  let out=heading(`Letter errors ${Math.round(100*c1)}%${s.lm?` → ${Math.round(100*c2)}% after correction`:''}`);
  const row=(y,label,str,ref)=>{let o=TF(40,y,label,13,C.muted,'start');str.split('').forEach((ch,i)=>{if(ch!==' ')o+=TMF(150+i*14,y,ch,16,ref&&ch!==ref[i]?C.coral:C.ink)});return o};
  out+=R(30,50,540,128,'#fff',C.grid,8);
  out+=row(80,'attempted',sent,null)+row(118,'decoded',d.raw,sent);
  out+=s.lm?row(156,'corrected',d.fixed,sent):TF(40,156,'corrected',13,C.muted,'start')+TF(150,156,'(correction off)',13,C.muted,'start');
  out+=TF(560,196,'red: wrong letter',13,C.coral,'end');
  out+=B8_tile(30,206,170,'Raw letter errors',Math.round(100*c1)+'%',C.coral)+B8_tile(30,260,170,'After correction',s.lm?Math.round(100*c2)+'%':'off',s.lm?(c2<c1?C.green:C.coral):C.muted);
  // published
  out+=R(220,196,350,156,C.amberp,'none',8)+TBF(234,214,'Published, one participant each',13,C.amber,'start');
  [['Handwriting (2021)','90 a minute; 94.1% correct, over 99% corrected'],['Speech, implanted arrays (2023)','62 words a minute; 23.8% of words wrong*'],['Speech, cortical surface (2023)','78 words a minute; 25% of words wrong*']].forEach((q,i)=>{const y=236+i*36;out+=TBF(234,y,q[0],13,C.ink,'start')+TF(234,y+16,q[1],13,C.ink,'start')});
  out+=TF(234,342,'*with a large vocabulary',13,C.muted,'start');
  out+=B8_note('Simulated decoding; the vocabulary here has only 50 words.',366);
  const made=s.lm&&d.fixed.split(' ').some((w,i)=>w!==sent.split(' ')[i]&&d.raw.split(' ')[i]===sent.split(' ')[i]);
  return {svg:out,phase:!s.lm?`The decoder mistakes letters that are written with similar strokes, such as a and o or n and h. At ${s.err}% the raw text has ${Math.round(100*c1)}% of its letters wrong. Switch on the correction.`:
   c2===0?`Word correction turned ${Math.round(100*c1)}% letter errors into none: each garbled word was closest to the right one in the vocabulary. This is why the published systems pair the neural decoder with a language model.`:
   `After correction ${Math.round(100*c2)}% of letters are still wrong.${made?' The correction even changed a word that had been right.':''} When too many letters in a word are wrong, it is pulled towards a different word, so correction helps most when the raw decoding is already good.`};
 }});

const B8_CLAIMS8=[
 {t:'A person moved a cursor with motor-cortex signals',v:'shown',why:'Hochberg et al. (2006): one man with tetraplegia, 96 electrodes, a cursor on a screen. Shown in a peer-reviewed study.'},
 {t:'A robotic arm brought a drink to a person’s mouth',v:'shown',why:'Hochberg et al. (2012): one of two participants used a robotic arm to drink coffee from a bottle. Collinger et al. (2013) reported fuller arm control in one participant.'},
 {t:'Attempted speech has been turned into text',v:'shown',why:'Two Nature papers in 2023, one participant each, with error rates of about a quarter of words over large vocabularies.'},
 {t:'A BCI can read a person’s private thoughts',v:'not',why:'Not shown. These decoders are trained on attempted movements or speech, need the person’s active effort, and decode what they were trained on. It is decoding, not “mind reading”.'},
 {t:'Once fitted, a decoder works for years unchanged',v:'not',why:'Not the general case. Recorded signals change from day to day, so systems are recalibrated or adapt themselves during use.'},
 {t:'The results come from large trials of many people',v:'not',why:'No. Most reports describe one to a few participants, each with brain surgery to implant electrodes. Safety and usefulness over many people and years are still being studied.'}];
SCENE({id:'brain-computer-interfaces-limits',name:'What a BCI is, and is not',tag:'Decoding attempted movement, not reading minds',
 definition:'An intracortical brain–computer interface records from a small patch of cortex, usually areas that plan and control movements of the arm or the mouth, and translates the activity into commands. It needs surgery, a decoder trained on the person’s own attempted movements, and regular recalibration. What it decodes is what it was trained on: attempted handwriting, attempted speech, an intended cursor movement.',
 example:'From Fetz’s monkey in 1969 to speech in 2023 the advance is real, and it has come from a small number of volunteers who took part in long research studies. Non-invasive systems that read the EEG from the scalp avoid surgery but carry far less information (see HCI In Motion). This lesson leaves out company announcements that have not been published in peer-reviewed papers.',
 desc:'Six statements about brain–computer interfaces, each opened to show whether peer-reviewed studies support it and why, above a timeline of milestones from 1969 to 2023.',
 research:['Hochberg, Bacher, Jarosiewicz, … & Donoghue (2012). Reach and grasp by people with tetraplegia using a neurally controlled robotic arm. Nature 485, 372–375.','Collinger, Wodlinger, Downey, … & Schwartz (2013). High-performance neuroprosthetic control by an individual with tetraplegia. The Lancet 381, 557–564.','Velliste, Perel, Spalding, Whitford & Schwartz (2008). Cortical control of a prosthetic arm for self-feeding. Nature 453, 1098–1101 (monkeys).'],
 dur:14,hint:'Press each statement to see what the published evidence says about it. Nothing is scored.',
 init:()=>({i:0,seen:{0:1}}),
 watch(p){const i=Math.min(5,Math.floor(p*6)),seen={};for(let k=0;k<=i;k++)seen[k]=1;return {i,seen}},
 ui:[{b:'Next statement',act:'next'}],
 on:{pick(s,v){s.i=clamp(Math.round(+v),0,5);s.seen[s.i]=1},next(s){s.i=(s.i+1)%6;s.seen[s.i]=1}},
 draw(s,f,X){
  const c=B8_CLAIMS8[s.i];
  let out=heading(c.v==='shown'?'Shown in peer-reviewed studies':'Not shown');
  B8_CLAIMS8.forEach((q,i)=>{const y=48+i*38,on=i===s.i,col=q.v==='shown'?C.green:C.coral,seen=s.seen[i];
   out+=hit(X,'pick',i,q.t,R(24,y,300,32,on?(q.v==='shown'?C.greenp:C.coralp):'#fff',on?col:C.grid,8)+TF(36,y+21,q.t.length>40?q.t.slice(0,39)+'…':q.t,13,C.ink,'start')+(seen?TBF(316,y+21,q.v==='shown'?'✓':'✕',13,col,'end'):''))});
  out+=R(340,48,240,224,'#fff',c.v==='shown'?C.green:C.coral,10)+TBF(354,72,c.v==='shown'?'Shown':'Not shown',15,c.v==='shown'?C.green:C.coral,'start')+B8_lines(354,96,c.why,31,13,C.ink,'start',18);
  // timeline
  const ev=[[1969,'Fetz: one cell'],[2006,'cursor'],[2012,'robotic arm'],[2021,'handwriting'],[2023,'speech']],TX=y=>40+(y-1965)/(2025-1965)*520;
  out+=L(40,310,560,310,C.line,2);ev.forEach(([y,l],i)=>{out+=Ci(TX(y),310,5,C.blue)+TBF(TX(y),i%2?300:332,y,13,C.ink)+TF(TX(y),i%2?284:348,l,13,C.muted)});
  return {svg:out,phase:c.why};
 }});

/* ===================== Lesson: recording-many ===================== */
// Calcium imaging, simulated. Each spike adds a fluorescence transient that rises with time constant tr and decays with
// td, scaled so that one spike's peak is A (a fraction of the resting brightness, ΔF/F). Frames at 30 a second over 4 s;
// spikes sit on 100 ms slots (every third frame). Spikes are then estimated back from the noisy trace by greedy template
// matching. Illustrative values; the GCaMP6 variants were named f, m and s for fast, medium and slow.
const B8_IND={f:{name:'Faster indicator',A:.2,tr:.02,td:.25},s:{name:'Slower, brighter',A:.35,tr:.07,td:.9}};
const B8_FPS=30,B8_CAN=120,B8_NCA=40;
function B8_caKernel(ind){const raw=u=>(1-Math.exp(-u/ind.tr))*Math.exp(-u/ind.td);let pk=0;for(let u=0;u<2;u+=.0005)pk=Math.max(pk,raw(u));const K=Math.min(B8_CAN,Math.ceil(6*ind.td*B8_FPS));return range(K).map(j=>ind.A*raw(j/B8_FPS)/pk)}
const B8_CAK={f:B8_caKernel(B8_IND.f),s:B8_caKernel(B8_IND.s)};
const B8_CANOISE={low:.03,high:.08};
function B8_caTrace(slots,ind,noise,seed){const k=B8_CAK[ind],F=new Array(B8_CAN).fill(0),r=B8_rng(seed*53+7);for(const sl of slots){const j0=sl*3;for(let u=0;u<k.length&&j0+u<B8_CAN;u++)F[j0+u]+=k[u]}return F.map(v=>v+B8_CANOISE[noise]*B8_gauss(r))}
function B8_caInfer(F,ind){const k=B8_CAK[ind],res=F.slice(),out=[],full=sum(k.map(v=>v*v));
 for(let it=0;it<40;it++){let best=0,bj=-1;
  for(let j=0;j<B8_CAN;j++){let num=0,den=0;for(let u=0;u<k.length&&j+u<B8_CAN;u++){num+=res[j+u]*k[u];den+=k[u]*k[u]}if(den<.25*full)continue;const c=num/den;if(c>best){best=c;bj=j}}
  if(bj<0||best<.55)break;const m=Math.max(1,Math.round(best));for(let u=0;u<k.length&&bj+u<B8_CAN;u++)res[bj+u]-=m*k[u];out.push({j:bj,m})}
 const merged={};for(const e of out)merged[e.j]=(merged[e.j]||0)+e.m;return Object.keys(merged).map(j=>({j:+j,m:merged[j]})).sort((a,b)=>a.j-b.j)}
// Count true spikes matched by an estimated one at most 2 frames (67 ms) away.
function B8_caMatch(slots,inf){const pool=[];for(const e of inf)for(let i=0;i<e.m;i++)pool.push(e.j);let hit=0;for(const sl of slots.slice().sort((a,b)=>a-b)){const j=sl*3,i=pool.findIndex(q=>Math.abs(q-j)<=2);if(i>=0){hit++;pool.splice(i,1)}}return hit}
const B8_CACACHE={};
function B8_caRun(s){const key=[s.slots.slice().sort((a,b)=>a-b).join('.'),s.ind,s.noise,s.seed].join('|');if(!B8_CACACHE[key]){const F=B8_caTrace(s.slots,s.ind,s.noise,s.seed),inf=B8_caInfer(F,s.ind);B8_CACACHE[key]={F,inf,found:sum(inf.map(e=>e.m)),hit:B8_caMatch(s.slots,inf)}}return B8_CACACHE[key]}
const B8_CAPRE={spaced:[2,10,18,26,34],burst:[5,6,7,20,21,31],mixed:[3,4,12,22,23,24,25,33]};
SCENE({id:'recording-many',name:'Neurons that light up',tag:'Calcium indicators, 1985–2013',
 definition:'When a neuron fires, calcium flows in through voltage-gated channels and the calcium level inside rises for a fraction of a second. In 1985 Roger Tsien’s group made fura-2, a dye whose fluorescence changes when it binds calcium. In 2001 Junichi Nakai, Masamichi Ohkura and Keiji Imoto made GCaMP: green fluorescent protein joined to calmodulin, a calcium-binding protein, so that it glows brighter when calcium rises. Because it is a protein, a gene can make chosen cells produce it for weeks.',
 example:`Here each spike adds a brief rise in brightness of ${Math.round(100*B8_IND.f.A)}% or ${Math.round(100*B8_IND.s.A)}% of the resting level, which fades over about ${B8_IND.f.td} s or ${B8_IND.s.td} s. Spikes closer together than that pile up into one larger bump, so the microscope sees a slowed, smoothed copy of the spike train. The GCaMP6 proteins (Chen and colleagues, 2013) came in fast and slow versions: the slow ones give bigger signals, the fast ones keep spikes apart. Working back from brightness to spikes is always an estimate.`,
 desc:'A four-second timeline of spikes the learner places, the simulated brightness of one cell carrying a calcium indicator, and marks for the spikes estimated back from that brightness, with counts of spikes fired, spikes found and spikes found at the right moment.',
 research:['Grynkiewicz, Poenie & Tsien (1985). A new generation of Ca²⁺ indicators with greatly improved fluorescence properties. Journal of Biological Chemistry 260, 3440–3450 (fura-2).','Nakai, Ohkura & Imoto (2001). A high signal-to-noise Ca²⁺ probe composed of a single green fluorescent protein. Nature Biotechnology 19, 137–141 (GCaMP).','Chen, Wardill, Sun, … , Svoboda & Kim (2013). Ultrasensitive fluorescent proteins for imaging neuronal activity. Nature 499, 295–300 (GCaMP6).','The cell, indicator values, noise and spike estimate here are simulated and illustrative.'],
 dur:12,hint:'Press the slots to add or remove spikes, or pick a pattern. Switch between the faster and the slower indicator and raise the noise: when are two spikes still seen as two? New noise records the same spikes again. Hear plays the spikes as clicks. Simulated.',
 init:()=>({slots:B8_CAPRE.mixed.slice(),ind:'f',noise:'low',seed:1}),
 watch(p){const seq=[['spaced','f'],['burst','f'],['burst','s'],['mixed','s']],k=Math.min(3,Math.floor(p*4));return {slots:B8_CAPRE[seq[k][0]].slice(),ind:seq[k][1],noise:'low',seed:1}},
 ui:[{choose:[['f','Faster indicator'],['s','Slower, brighter']],label:'Indicator',get:s=>s.ind,act:'ind'},{choose:[['low','Low noise'],['high','High noise']],label:'Noise',get:s=>s.noise,act:'noise'},{choose:[['spaced','Spaced'],['burst','Bursts'],['mixed','Mixed'],['none','None']],label:'Spike pattern',get:s=>'',act:'preset'},{b:'New noise',act:'seed'},{b:'Hear the spikes ▶',act:'hear'}],
 on:{ind(s,v){s.ind=v==='s'?'s':'f'},noise(s,v){s.noise=v==='high'?'high':'low'},preset(s,v){s.slots=B8_CAPRE[v]?B8_CAPRE[v].slice():[]},seed(s){s.seed++},
  slot(s,v){const i=clamp(Math.round(+v),0,B8_NCA-1),k=s.slots.indexOf(i);if(k>=0)s.slots.splice(k,1);else s.slots.push(i)},
  hear(s){B8_click(s.slots.map(i=>i*.1),.12);return 'keep'}},
 draw(s,f,X){
  const ind=B8_IND[s.ind],run=B8_caRun(s),n=s.slots.length,TX=t=>50+t/4*500;
  let out=heading(!n?'No spikes: the cell stays dim':`${n} spike${n===1?'':'s'} fired, ${run.found} estimated from the light`);
  out+=TF(50,54,'spikes fired: press a slot to add or remove one',13,C.muted,'start');
  for(let i=0;i<B8_NCA;i++){const on=s.slots.includes(i),x=TX(i*.1);out+=hit(X,'slot',i,`Spike at ${i*100} ms: ${on?'on':'off'}`,R(x-4,60,8,22,on?C.blue:'#fff',on?C.blue:C.grid,2))}
  for(const e of run.inf){const x=TX(e.j/B8_FPS);out+=`<polygon points="${fmt(x)},86 ${fmt(x-5)},96 ${fmt(x+5)},96" fill="${C.coral}"/>`;if(e.m>1)out+=TF(x+7,96,'×'+e.m,13,C.coral,'start')}
  const pl=B8_plot(50,104,500,136,[0,4],[-.25,1.6],{xt:[[0,'0'],[1,'1'],[2,'2'],[3,'3'],[4,'4 s']],yt:[[0,'0'],[.5,'50%'],[1,'100%'],[1.5,'150%']]});
  out+=pl.svg+L(pl.X(0),pl.Y(0),pl.X(4),pl.Y(0),C.grid,1)+TF(58,120,'brightness change (ΔF/F)',13,C.muted,'start');
  out+=B8_poly(run.F.map((v,j)=>[pl.X(j/B8_FPS),pl.Y(clamp(v,-.25,1.6))]),C.green,2);
  out+=B8_tile(45,268,120,'Spikes fired',String(n),C.blue)+B8_tile(175,268,120,'Estimated',String(run.found),C.coral)+B8_tile(305,268,120,'At the right time',n?`${run.hit} of ${n}`:'none',run.hit===n?C.green:C.coral)+B8_tile(435,268,120,'Fades over',ind.td+' s',C.ink);
  out+=TF(300,336,'blue: spikes fired · coral ▲: spikes estimated from the green trace',13,C.muted);
  out+=B8_note(`Simulated cell. ${ind.name}: each spike adds about ${Math.round(100*ind.A)}% brightness.`,362);
  const missed=n-run.hit;
  return {svg:out,phase:!n?'With no spikes the trace is only noise. Press the slots along the top to make the cell fire.':missed===0&&run.found===n?`All ${n} spikes were recovered at the right moments: each left a bump in the green trace that stood out from the noise and from its neighbours. Now try spikes closer together, or more noise.`:
   `${run.hit} of ${n} spikes were found at the right moment${run.found!==n?`, and ${run.found} were estimated in all`:''}. Where spikes come closer together than the ${ind.td} s fade, their bumps merge, and noise hides small steps. ${s.ind==='s'?'The slower indicator gives bigger bumps but blurs neighbours together.':'The faster indicator keeps spikes apart but its smaller bumps are harder to see in noise.'}`};
 }});

// Two-photon excitation, schematic. Beam radius w(z) = w0·√(1+(z/zR)²) with w0 = 0.5 µm and zR = 1 µm (z from the focus).
// Each depth slice passes the whole beam, so one-photon excitation per slice is the same at every depth; two-photon
// excitation goes with intensity squared, so per slice it falls as 1/(1+(z/zR)²). Cells are discs of radius 6 µm on the
// beam's axis, 12 µm thick. Tissue 400 µm deep, uniformly labelled for the "share of light" tiles.
const B8_W0=.5,B8_ZR=1,B8_TIS=400,B8_RC=6,B8_TPCELLS=[80,140,200,260,320];
const B8_wz=z=>B8_W0*Math.sqrt(1+(z/B8_ZR)**2);
const B8_tpShare=(f,half)=>{const a=z=>Math.atan(z/B8_ZR);return (a(half)-a(-half))/(a(B8_TIS-f)-a(-f))};
const B8_opShare=half=>2*half/B8_TIS;
function B8_cellExc(mode,dz){let t=0;for(let i=0;i<=12;i++){const z=dz-6+i,w=B8_wz(z);t+=mode==='one'?1-Math.exp(-2*B8_RC**2/w**2):(1-Math.exp(-4*B8_RC**2/w**2))/w**2}return t/13}
const B8_cellGlow=(mode,dz)=>B8_cellExc(mode,dz)/B8_cellExc(mode,0);
SCENE({id:'recording-many-twophoton',name:'Light only at the focus',tag:'Denk, Strickler and Webb, 1990',
 definition:'In ordinary fluorescence, one photon of blue light excites a molecule, and every depth the beam passes through glows, so cells above and below the focus blur the image. In 1990 Winfried Denk, James Strickler and Watt Webb showed a way round this. A molecule can also be excited by two photons of infrared light arriving together, an effect predicted by Maria Göppert-Mayer in 1931. That needs very intense light, so with short laser pulses it happens almost only at the focus.',
 example:`Two-photon excitation grows with the square of the intensity, and the intensity is highest at the focus. In this schematic tissue 400 µm deep, ${Math.round(100*B8_opShare(2))}% of one-photon fluorescence comes from within 2 µm of the focus, against ${Math.round(100*B8_tpShare(200,2))}% for two-photon excitation focused 200 µm down. Infrared light also scatters less than blue, so it reaches cells several hundred micrometres into the cortex of a living animal, and all the light that comes back can be credited to the focal spot.`,
 desc:'A slab of tissue with a column of five cells and a focused beam, an hourglass of light, beside a graph of how much excitation each depth receives for one-photon and two-photon light, with tiles for the share of light from the focus and the glow of the nearest other cell.',
 research:['Denk, Strickler & Webb (1990). Two-photon laser scanning fluorescence microscopy. Science 248, 73–76.','Göppert-Mayer (1931). Über Elementarakte mit zwei Quantensprüngen. Annalen der Physik 401, 273–294 (the prediction of two-photon absorption).','Helmchen & Denk (2005). Deep tissue two-photon microscopy. Nature Methods 2, 932–940.','The beam and cells are schematic: focal depth about 1 µm, cells 12 µm across.'],
 dur:12,hint:'Move the focus down through the tissue and switch between one-photon and two-photon light. Watch how brightly the cells that are not in focus glow, and how much of the light comes from the focus itself. Schematic values.',
 init:()=>({mode:'one',f:200}),
 watch(p){return p<.5?{mode:'one',f:Math.round(lerp(80,320,p/.5)/10)*10}:{mode:'two',f:Math.round(lerp(80,320,(p-.5)/.5)/10)*10}},
 ui:[{choose:[['one','One-photon (blue)'],['two','Two-photon (infrared)']],label:'Light',get:s=>s.mode,act:'mode'},{range:'f',label:'Focus depth',min:60,max:340,step:10,get:s=>s.f,act:'f',show:v=>v+' µm'}],
 on:{mode(s,v){s.mode=v==='two'?'two':'one'},f(s,v){s.f=clamp(Math.round(+v/10)*10,60,340)}},
 draw(s){
  const two=s.mode==='two',Y=d=>62+d/B8_TIS*280,cx=160,fy=Y(s.f),half=dz=>Math.min(118,.35*Math.abs(dz));
  const share=two?B8_tpShare(s.f,2):B8_opShare(2);
  const others=B8_TPCELLS.map(d=>({d,g:B8_cellGlow(s.mode,d-s.f)})),inF=others.filter(c=>Math.abs(c.d-s.f)<=6),near=others.filter(c=>Math.abs(c.d-s.f)>6).sort((a,b)=>Math.abs(a.d-s.f)-Math.abs(b.d-s.f))[0];
  let out=heading(`${two?'Two-photon':'One-photon'} light focused ${s.f} µm deep: ${Math.round(100*share)}% from the focus`);
  // tissue, objective, beam
  out+=R(30,62,260,280,'#f7f3ee',C.grid,4)+`<polygon points="105,40 215,40 200,58 120,58" fill="${C.muted}"/>`+TF(222,52,'objective',13,C.muted,'start');
  const top=half(s.f),bot=half(B8_TIS-s.f),beam=two?'#b0413e':'#2f6fd6';
  const hg=`${fmt(cx-top)},62 ${fmt(cx+top)},62 ${cx},${fmt(fy)} ${fmt(cx+bot)},342 ${fmt(cx-bot)},342 ${cx},${fmt(fy)}`;
  out+=`<polygon points="${hg}" fill="${two?beam:C.green}" fill-opacity="${two?.06:.22}" stroke="${beam}" stroke-opacity=".5" stroke-width="1.2"/>`;
  if(two)out+=`<ellipse cx="${cx}" cy="${fmt(fy)}" rx="9" ry="4" fill="${C.green}"/>`;
  for(const c of others){const y=Y(c.d);out+=Ci(cx,y,10,tint(C.green,1-.9*clamp(c.g,0,1)),C.green,'stroke-width="1.5"')}
  out+=L(40,fy,62,fy,C.ink,1.5)+TF(44,fy-5,'focus',13,C.ink,'start');
  out+=TF(40,78,'surface',13,C.muted,'start')+TF(40,336,`${B8_TIS} µm`,13,C.muted,'start');
  out+=TF(282,336,two?'infrared beam':'blue beam',13,beam,'end');
  // excitation per depth slice
  const pl=B8_plot(340,78,230,120,[0,B8_TIS],[0,1.15],{xt:[[0,'0'],[200,'200'],[400,'400 µm']],yt:[[0,'0'],[1,'1']],xl:'depth',xlDy:32,yl:'excitation per depth slice'});out+=pl.svg;
  out+=L(pl.X(0),pl.Y(1),pl.X(B8_TIS),pl.Y(1),C.blue,two?1.6:3,two?'stroke-dasharray="5 4"':'');
  const tp=[];for(let i=0;i<=400;i++){const d=i;tp.push([pl.X(d),pl.Y(1/(1+((d-s.f)/B8_ZR)**2))])}out+=B8_poly(tp,'#b0413e',two?3:1.6,two?'':'stroke-dasharray="5 4"');
  out+=TF(pl.X(8),pl.Y(1)-6,'one-photon',13,C.blue,'start')+TF(pl.X(s.f>200?s.f-8:s.f+8),pl.Y(.55),'two-photon',13,'#b0413e',s.f>200?'end':'start');
  out+=B8_tile(330,240,120,'From the focus',Math.round(100*share)+'%',two?C.green:C.coral)+B8_tile(458,240,120,`Cell ${near?Math.abs(near.d-s.f):0} µm away`,near?(near.g>=.01?Math.round(100*near.g)+'%':'<1%'):'none',near&&near.g>=.05?C.coral:C.green);
  out+=TF(454,306,'tiles: share of light from within',13,C.muted)+TF(454,322,'2 µm of the focus; nearest other',13,C.muted)+TF(454,338,'cell’s glow, focused cell = 100%',13,C.muted);
  out+=B8_note('Schematic beam, cells and tissue; not to scale.',366);
  return {svg:out,phase:two?`With two-photon light only the slice within a micrometre or two of the focus is excited, so ${Math.round(100*share)}% of the light comes from there. ${inF.length?'The cell in focus glows':'No cell is exactly in focus'}, and the nearest other cell, ${near?Math.abs(near.d-s.f):0} µm away, glows at ${near&&near.g>=.01?Math.round(100*near.g)+'%':'under 1%'} of that. Moving the focus picks out one depth at a time.`:
   `With one-photon light every depth along the beam absorbs about the same total light, so only ${Math.round(100*share)}% of the fluorescence comes from within 2 µm of the focus. ${near?`The cell ${Math.abs(near.d-s.f)} µm away still glows at ${Math.round(100*near.g)}% of the focused cell, and the labelled tissue all around adds a haze.`:''} Switch to two-photon light.`};
 }});

// Spike sorting on a probe, simulated. Sites in one column, 20 µm apart. Spike amplitude at distance d falls as
// A0/(1+(d/r0)²), with A0 = 300 µV and r0 = 30 µm (illustrative). Each spike's size varies by 8%, and each site adds
// 15 µV of noise. Two cells are told apart by the distance between their mean footprints across sites.
const B8_SITES={one:[0],four:[-30,-10,10,30],dense:range(15).map(i=>-140+i*20)};
const B8_N2={same:[15,20],above:[25,60],far:[60,0],high:[25,120]};
const B8_N1=[25,0],B8_A0=300,B8_R0=30,B8_SN=15,B8_JIT=.08;
const B8_amp2=(n,y)=>B8_A0/(1+(Math.hypot(n[0],n[1]-y)/B8_R0)**2);
const B8_Phi=z=>{const t=1/(1+.2316419*Math.abs(z)),d=.3989423*Math.exp(-z*z/2),p=d*t*(.3193815+t*(-.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return z>0?1-p:p};
function B8_sortStats(cfg,pos){const sites=B8_SITES[cfg],n2=B8_N2[pos],m1=sites.map(y=>B8_amp2(B8_N1,y)),m2=sites.map(y=>B8_amp2(n2,y));
 const dist=Math.sqrt(sum(m1.map((v,i)=>(v-m2[i])**2))),sd=Math.sqrt(B8_SN**2+(B8_JIT*(Math.max(...m1)+Math.max(...m2))/2)**2),dp=dist/sd;return {sites,n2,m1,m2,dp,err:B8_Phi(-dp/2)}}
SCENE({id:'recording-many-probes',name:'Hundreds of sites on one shank',tag:'Neuropixels: Jun and colleagues, 2017',
 definition:'A wire in the brain picks up spikes from several nearby cells at once. Silicon probes with many recording sites have been made since about 1970 (Wise, Starr and Angell). In 2017 James Jun, Timothy Harris and a large team from several institutes, with the chip maker imec, described Neuropixels: a shank 10 mm long and 70 × 20 µm in cross-section, carrying 960 sites, of which 384 can be recorded at once. One probe recorded hundreds of neurons in several brain regions of a mouse.',
 example:'Each spike reaches several neighbouring sites, smaller on the sites further away. That pattern across sites, the footprint, is what tells cells apart: two cells the same distance from one wire give spikes of the same size, but dense sites see them from different angles. Sorting spikes into cells is done by software (for example Kilosort) and still makes mistakes, so studies report how well each unit is isolated.',
 desc:'A probe shank with its recording sites and two nearby cells, bars at each site for the size of each cell’s spikes, and a scatter plot of spike sizes on the sites nearest each cell, with an estimate of how many spikes would be put in the wrong cell.',
 research:['Jun, Steinmetz, Siegle, … , Harris, Koch, O’Keefe & Harris (2017). Fully integrated silicon probes for high-density recording of neural activity. Nature 551, 232–236.','Wise, Starr & Angell (1970). An integrated-circuit approach to extracellular microelectrodes. IEEE Transactions on Biomedical Engineering 17, 238–247.','Wilson & McNaughton (1993). Science 261, 1055–1058: tetrodes, four wires together, let many place cells be told apart by their spike sizes.','Spike sizes, fall-off with distance and noise here are simulated and illustrative.'],
 dur:12,hint:'Choose one site, four sites close together, or a dense column, and move the second cell. When are the two cells’ spikes mixed up? Simulated spikes and noise.',
 init:()=>({cfg:'one',pos:'same'}),
 watch(p){const seq=[['one','same'],['four','same'],['dense','same'],['one','far'],['dense','high']],k=Math.min(4,Math.floor(p*5));return {cfg:seq[k][0],pos:seq[k][1]}},
 ui:[{choose:[['one','One site'],['four','Four close sites'],['dense','Dense column (15)']],label:'Probe',get:s=>s.cfg,act:'cfg'},{choose:[['same','Same distance'],['above','40 µm higher'],['far','Further out'],['high','120 µm higher']],label:'Second cell',get:s=>s.pos,act:'pos'}],
 on:{cfg(s,v){s.cfg=B8_SITES[v]?v:'one'},pos(s,v){s.pos=B8_N2[v]?v:'same'}},
 draw(s){
  const st=B8_sortStats(s.cfg,s.pos),yc=200,sx=150,Yp=y=>yc-y,ok=st.err<.01;
  let out=heading(`${st.sites.length} site${st.sites.length===1?'':'s'}: about ${st.err<.001?'0.1% or fewer':Math.round(100*st.err)+'%'} of spikes put in the wrong cell`);
  // shank and cells (1 px = 1 µm)
  out+=R(30,46,270,306,'#fbfcfd',C.grid,8)+`<polygon points="${sx-6},46 ${sx+6},46 ${sx+6},340 ${sx},352 ${sx-6},340" fill="#c9d3da"/>`;
  st.sites.forEach((y,i)=>{const py=Yp(y);out+=R(sx-4,py-4,8,8,C.dark,'none',1)+R(sx-10-st.m1[i]/300*90,py-5,st.m1[i]/300*90,4,C.coral,'none',1)+R(sx-10-st.m2[i]/300*90,py+1,st.m2[i]/300*90,4,C.blue,'none',1)});
  const tri=(x,y,col)=>`<polygon points="${fmt(x)},${fmt(y-9)} ${fmt(x-7)},${fmt(y+6)} ${fmt(x+7)},${fmt(y+6)}" fill="${col}"/>`;
  out+=tri(sx+B8_N1[0],Yp(B8_N1[1]),C.coral)+tri(sx+st.n2[0],Yp(st.n2[1]),C.blue);
  out+=TF(sx+B8_N1[0]+12,Yp(B8_N1[1])+5,'cell 1',13,C.coral,'start')+TF(sx+st.n2[0]+12,Yp(st.n2[1])+5,'cell 2',13,C.blue,'start');
  out+=TF(40,64,'bars: spike size',13,C.muted,'start')+TF(40,80,'at each site',13,C.muted,'start');
  out+=L(250,330,250,310,C.ink,2)+TF(256,324,'20 µm',13,C.ink,'start');
  // scatter of spike sizes
  const iA=st.m1.indexOf(Math.max(...st.m1)),iB=st.m2.indexOf(Math.max(...st.m2)),one=st.sites.length===1;
  const pl=B8_plot(370,62,200,170,[0,360],[0,360],{xt:[[0,'0'],[150,'150'],[300,'300 µV']],yt:one?[]:[[0,'0'],[150,'150'],[300,'300']],xl:one?'spike size on the one site':'size on the site nearest cell 1',xlDy:32,yl:one?'(only one number per spike)':'size nearest cell 2'});out+=pl.svg;
  const r=B8_rng(4321);for(let k=0;k<2;k++){const m=k?st.m2:st.m1,col=k?C.blue:C.coral;for(let q=0;q<40;q++){const g=1+B8_JIT*B8_gauss(r),a=m[iA]*g+B8_SN*B8_gauss(r),b=m[iB]*g+B8_SN*B8_gauss(r),jy=one?180+70*(r()-.5):b;out+=Ci(pl.X(clamp(a,0,360)),pl.Y(clamp(jy,0,360)),2.6,col)}}
  out+=B8_tile(330,282,120,'Separation (d′)',fmt(B8_r1(st.dp)),ok?C.green:C.coral)+B8_tile(458,282,120,'Mis-sorted',st.err<.001?'<0.1%':fmt(B8_r1(100*st.err))+'%',ok?C.green:C.coral);
  out+=B8_note('Simulated spike sizes and noise; illustrative fall-off with distance.',366);
  return {svg:out,phase:one&&s.pos==='same'?'Both cells sit 25 µm from the only site, so their spikes are the same size and their dots fall on top of each other. No software can sort them from this record alone. Add sites.':
   ok&&one?'Cell 2 is further from the site, so its spikes are smaller and the two clouds of dots separate. One site can tell apart cells of different sizes, but not two cells at the same distance.':
   ok?`Seen from ${st.sites.length} sites, the two cells leave different footprints: cell 1 is largest on one site, cell 2 on another. Their spikes form two separate clouds, and fewer than 1 spike in 100 would be put in the wrong cell.`:
   `The footprints overlap enough that about ${Math.round(100*st.err)}% of spikes would be put in the wrong cell. ${st.sites.length<15?'More sites, closer together, would separate them.':'Even a dense column has limits when two cells sit close together.'}`};
 }});

// A simulated population and a behaviour. Each cell's activity = a·behaviour + b·(a second shared signal) + its own
// noise (sd 1), with a and b drawn from normal distributions (sd 0.3 and 0.25). A readout is fitted on the first half of
// the session (each cell weighted by its covariance with the behaviour) and tested on the second half.
const B8_PT=240;
const B8_smoothSig=seed=>{const r=B8_rng(seed),x=[];let v=0,u=0;for(let t=0;t<B8_PT;t++){u=.9*u+.45*B8_gauss(r);v=.92*v+.25*u;x.push(v)}const m=sum(x)/B8_PT,sd=Math.sqrt(sum(x.map(q=>(q-m)**2))/B8_PT)||1;return x.map(q=>(q-m)/sd)};
const B8_BEH=B8_smoothSig(606),B8_HID=B8_smoothSig(707);
const B8_POPCACHE={};
function B8_pop(N){if(B8_POPCACHE[N])return B8_POPCACHE[N];const r=B8_rng(9001),cells=[];
 for(let i=0;i<N;i++){const a=.3*B8_gauss(r),b=.25*B8_gauss(r),x=new Array(B8_PT);for(let t=0;t<B8_PT;t++)x[t]=a*B8_BEH[t]+b*B8_HID[t]+B8_gauss(r);cells.push({a,x})}
 const H=B8_PT/2,w=cells.map(c=>{let s=0;for(let t=0;t<H;t++)s+=c.x[t]*B8_BEH[t];return s/H}),pred=range(B8_PT).map(t=>sum(cells.map((c,i)=>w[i]*c.x[t])));
 const test=range(H).map(t=>t+H),rTest=B8_corr(test.map(t=>pred[t]),test.map(t=>B8_BEH[t]));
 const single=cells.map(c=>B8_corr(c.x,B8_BEH)),med=single.map(Math.abs).sort((a,b)=>a-b)[Math.floor(N/2)];
 return (B8_POPCACHE[N]={cells,w,pred,rTest,single,med})}
SCENE({id:'recording-many-questions',name:'What thousands of cells reveal',tag:'Stringer and colleagues, 2019',
 definition:'With one electrode a neuron’s response is studied trial by trial, and what varies from trial to trial is usually treated as noise. Recording thousands of cells at once lets that variation be compared across cells. In 2019 Carsen Stringer, Marius Pachitariu, Nicholas Steinmetz, Charu Reddy, Matteo Carandini and Kenneth Harris imaged about 10,000 neurons at once in the visual cortex of mice. Much of the activity, even in darkness, tracked the mouse’s own movements, such as whisking and running.',
 example:'Each cell on its own looks mostly random, but many cells share the same slow fluctuations, and together they predict the movements well. So part of what looked like noise is a signal shared across the brain: Neuropixels recordings in the same study found movement-related activity in many regions. The number of neurons recorded at once doubled about every seven years for decades (Stevenson and Kording, 2011), and questions about single cells became questions about populations.',
 desc:'A behaviour trace, a grid of activity for up to sixty cells over a session that can be sorted by each cell’s link with the behaviour, and the behaviour predicted from all the recorded cells in the second half of the session, with correlations for one typical cell and for the whole population.',
 research:['Stringer, Pachitariu, Steinmetz, Reddy, Carandini & Harris (2019). Spontaneous behaviors drive multidimensional, brainwide activity. Science 364, eaav7893.','Steinmetz, Zatka-Haas, Carandini & Harris (2019). Distributed coding of choice, action and engagement across the mouse brain. Nature 576, 266–273 (about 30,000 neurons in 42 brain regions).','Stevenson & Kording (2011). How advances in neural recording affect data analysis. Nature Neuroscience 14, 139–142.','The population here is simulated: each cell mixes a little of the behaviour and of another shared signal with its own noise.'],
 dur:12,hint:'Record more cells and see how well the movements can be predicted from them in the half of the session the readout never saw. Sort the cells to see the shared signal hidden in each noisy row. Simulated cells.',
 init:()=>({N:10,sort:0}),
 watch(p){const k=Math.min(4,Math.floor(p*5));return {N:[1,10,100,1000,1000][k],sort:k===4?1:0}},
 ui:[{choose:[[1,'1 cell'],[10,'10'],[100,'100'],[1000,'1,000']],label:'Cells recorded',get:s=>s.N,act:'N'},{choose:[[0,'Unsorted'],[1,'Sorted by link to movement']],label:'Rows',get:s=>s.sort,act:'sort'}],
 on:{N(s,v){s.N=[1,10,100,1000].includes(+v)?+v:10},sort(s,v){s.sort=+v?1:0}},
 draw(s){
  const P=B8_pop(s.N),H=B8_PT/2,x0=110,w=450,TX=t=>x0+t/B8_PT*w;
  let rows=range(Math.min(60,s.N));if(s.sort)rows=range(s.N).sort((a,b)=>P.single[b]-P.single[a]).filter((_,i,arr)=>s.N<=60||i%Math.ceil(s.N/60)===0).slice(0,60);
  let out=heading(`${s.N===1000?'1,000':s.N} cell${s.N===1?'':'s'}: movement predicted with r = ${fmt(B8_r2(P.rTest))}`);
  // behaviour
  out+=TF(x0-8,62,'movement',13,C.amber,'end')+B8_poly(range(B8_PT).map(t=>[TX(t),62-10*B8_BEH[t]]),C.amber,1.6);
  // raster grid
  const gy=86,gh=160,rh=gh/Math.max(1,rows.length);out+=R(x0,gy,w,gh,'#fff',C.grid,0);
  rows.forEach((ci,k)=>{const c=P.cells[ci];for(let t=0;t<B8_PT;t+=2){const v=(c.x[t]+c.x[t+1])/2,g=clamp((v+.4)/2.2,0,1);if(g>.08)out+=R(TX(t),gy+k*rh,w/B8_PT*2+.3,Math.max(1,rh-.3),tint(C.dark,1-g),'none',0)}});
  out+=TF(x0-8,gy+14,s.N<=60?`${rows.length} cell${rows.length===1?'':'s'}`:'60 of',13,C.muted,'end')+TF(x0-8,gy+30,s.N<=60?'':`${s.N===1000?'1,000':s.N}`,13,C.muted,'end');
  if(s.sort)out+=TF(x0-8,gy+gh-18,'top: most',13,C.muted,'end')+TF(x0-8,gy+gh-2,'linked',13,C.muted,'end');
  // prediction on test half
  const py=290,ps=11;out+=L(TX(H),gy-6,TX(H),py+30,C.line,1.5,'stroke-dasharray="4 4"')+TF(TX(H/2),gy+gh+16,'readout fitted here',13,C.muted)+TF(TX(1.5*H),gy+gh+16,'tested here',13,C.muted);
  const m=sum(P.pred.slice(H))/H,sd=Math.sqrt(sum(P.pred.slice(H).map(v=>(v-m)**2))/H)||1;
  out+=B8_poly(range(H).map(t=>[TX(t+H),py-ps*B8_BEH[t+H]]),C.amber,1.8)+B8_poly(range(H).map(t=>[TX(t+H),py-ps*(P.pred[t+H]-m)/sd]),C.blue,1.6);
  out+=TF(TX(H)-8,py-8,'amber: movement',13,C.amber,'end')+TF(TX(H)-8,py+10,'blue: predicted',13,C.blue,'end');
  out+=B8_tile(30,322,170,'One typical cell, r',fmt(B8_r2(P.med)),C.muted)+B8_tile(215,322,170,'All cells, test half, r',fmt(B8_r2(P.rTest)),P.rTest>.8?C.green:C.coral);
  out+=TF(570,340,'simulated cells',13,C.muted,'end');
  return {svg:out,phase:s.N===1?`One cell’s activity is linked to the movement only weakly (r = ${fmt(B8_r2(P.med))}): on its own it looks like noise. Record more cells.`:
   P.rTest<.8?`With ${s.N} cells the readout predicts the movement in the unseen half of the session with r = ${fmt(B8_r2(P.rTest))}. Each row still looks noisy, but the weak shared signal adds up across cells.`:
   `With ${s.N===1000?'1,000':s.N} cells the movement is predicted with r = ${fmt(B8_r2(P.rTest))} in the half of the session the readout never saw, although a typical cell alone gives only ${fmt(B8_r2(P.med))}. ${s.sort?'Sorted, the shared slow stripes stand out in the rows.':'Sort the rows to see the shared pattern.'} What looked like private noise is partly a signal shared by many cells.`};
 }});

/* ===================== Lesson: brains-and-ai ===================== */
// A threshold unit with two inputs: it fires when w1·x1 + w2·x2 reaches θ. The perceptron rule (rate 0.5) changes the
// weights after each wrong answer: w += 0.5·(target − output)·x, θ −= 0.5·(target − output). At most 25 passes.
const B8_GATES={and:{name:'AND',t:[0,0,0,1]},or:{name:'OR',t:[0,1,1,1]},nand:{name:'NOT-AND',t:[1,1,1,0]},xor:{name:'XOR',t:[0,1,1,0]}};
const B8_PATS=[[0,0],[0,1],[1,0],[1,1]];
const B8_fire=(s,x)=>s.w1*x[0]+s.w2*x[1]>=s.th-1e-9?1:0;
function B8_learn(s){const q={w1:s.w1,w2:s.w2,th:s.th},t=B8_GATES[s.gate].t;let up=0,ep=0,ok=false;
 for(ep=1;ep<=25;ep++){let wrong=0;B8_PATS.forEach((x,i)=>{const e=t[i]-B8_fire(q,x);if(e){wrong++;up++;q.w1+=.5*e*x[0];q.w2+=.5*e*x[1];q.th-=.5*e}});if(!wrong){ok=true;break}}
 return {w1:q.w1,w2:q.w2,th:q.th,log:{ep:Math.min(ep,25),up,ok}}}
const B8_aiInit=()=>({gate:'and',w1:1,w2:1,th:2,x:[1,1],log:null});
SCENE({id:'brains-and-ai',name:'A neuron as a logic gate',tag:'McCulloch and Pitts, 1943; Rosenblatt, 1958',
 definition:'In 1943 Warren McCulloch, a neurophysiologist, and Walter Pitts, a young logician, described an idealised neuron: it adds up its inputs and fires if the total reaches a threshold. Networks of such units could compute any logical expression. Their connections were fixed. In 1958 Frank Rosenblatt’s perceptron made the weights adjustable: after each wrong answer, every active input’s weight is nudged towards the right one.',
 example:'With both weights at 1, a threshold of 2 gives AND (both inputs needed) and a threshold of 1 gives OR. The perceptron rule finds such weights by itself whenever a single straight line can separate the inputs that should fire from those that should not. For XOR no line can, so one unit never learns it, a limit stressed by Minsky and Papert in 1969. Mind In Motion trains a perceptron step by step.',
 desc:'A unit with two inputs, two weights and a threshold, the table of its answers for all four input patterns against the chosen logic gate, and the square of input patterns with the unit’s dividing line.',
 research:['McCulloch & Pitts (1943). A logical calculus of the ideas immanent in nervous activity. Bulletin of Mathematical Biophysics 5, 115–133.','Rosenblatt (1958). The perceptron: a probabilistic model for information storage and organization in the brain. Psychological Review 65, 386–408.','Minsky & Papert (1969). Perceptrons. MIT Press.'],
 dur:12,hint:'Choose a gate and set the two weights and the threshold until all four rows are right, or press Learn to let the perceptron rule find them. Press an input on the diagram to switch it. Try XOR.',
 init:B8_aiInit,
 watch(p){const k=Math.min(3,Math.floor(p*4)),seq=[{gate:'and',w1:1,w2:1,th:2},{gate:'or',w1:1,w2:1,th:1},{gate:'nand',w1:-1,w2:-1,th:-1.5},{gate:'xor',w1:0,w2:0,th:0}];const s={...seq[k],x:[1,k%2],log:null};if(k===3)Object.assign(s,B8_learn(s));return s},
 ui:[{choose:Object.keys(B8_GATES).map(k=>[k,B8_GATES[k].name]),label:'Gate',get:s=>s.gate,act:'gate'},{range:'w1',label:'Weight 1',min:-3,max:3,step:.5,get:s=>s.w1,act:'w1',show:v=>B8_sg(+v)},{range:'w2',label:'Weight 2',min:-3,max:3,step:.5,get:s=>s.w2,act:'w2',show:v=>B8_sg(+v)},{range:'th',label:'Threshold',min:-3,max:4,step:.5,get:s=>s.th,act:'th',show:v=>B8_sg(+v)},{b:'Learn (perceptron rule)',act:'learn'},{b:'Weights to zero',act:'zero'}],
 on:{gate(s,v){s.gate=B8_GATES[v]?v:'and';s.log=null},w1(s,v){s.w1=clamp(Math.round(+v*2)/2,-3,3);s.log=null},w2(s,v){s.w2=clamp(Math.round(+v*2)/2,-3,3);s.log=null},th(s,v){s.th=clamp(Math.round(+v*2)/2,-3,4);s.log=null},
  learn(s){Object.assign(s,B8_learn(s))},zero(s){s.w1=0;s.w2=0;s.th=0;s.log=null},inp(s,v){const i=+v?1:0;s.x[i]=s.x[i]?0:1;return 'keep'}},
 draw(s,f,X){
  const g=B8_GATES[s.gate],outs=B8_PATS.map(x=>B8_fire(s,x)),right=outs.filter((o,i)=>o===g.t[i]).length,y=B8_fire(s,s.x),tot=s.w1*s.x[0]+s.w2*s.x[1];
  let out=heading(`${g.name}: ${right} of 4 rows right${right===4?'':s.log&&!s.log.ok?', and learning cannot fix it':''}`);
  // the unit
  const ins=[[64,92],[64,192]],body=[200,142];
  ins.forEach((q,i)=>{const on=s.x[i],w=i?s.w2:s.w1;out+=arrow(q[0]+22,q[1],body[0]-34*Math.cos(Math.atan2(body[1]-q[1],body[0]-q[0])),body[1]-34*Math.sin(Math.atan2(body[1]-q[1],body[0]-q[0])),w<0?C.coral:C.blue,1.5+Math.abs(w));
   out+=hit(X,'inp',i,`Input ${i+1} is ${on}. Press to switch.`,Ci(q[0],q[1],20,on?C.blue:'#fff',C.blue)+TBF(q[0],q[1]+5,String(on),15,on?'#fff':C.blue));
   out+=TF(q[0],q[1]+(i?36:-28),`input ${i+1}`,13,C.muted)+R(116,(q[1]+body[1])/2-12+(i?6:-6),44,22,'#fff',C.grid,6)+TBF(138,(q[1]+body[1])/2+3+(i?6:-6),B8_sg(w),13,w<0?C.coral:C.blue)});
  out+=Ci(body[0],body[1],34,y?C.amberp:'#fff',C.amber)+TBF(body[0],body[1]-2,'Σ ≥ θ',14,C.ink)+TF(body[0],body[1]+16,'θ = '+B8_sg(s.th),13,C.ink);
  out+=arrow(234,142,262,142,C.amber,2.5)+Ci(278,142,14,y?C.amber:'#fff',C.amber)+TBF(278,147,String(y),13,y?'#fff':C.amber);
  out+=TF(170,240,`sum ${B8_sg(tot)} ${tot>=s.th-1e-9?'≥':'<'} θ ${B8_sg(s.th)}: ${y?'fires':'silent'}`,13,C.ink);
  // truth table
  const cx=[340,380,450,510,560];out+=R(318,46,264,138,'#fff',C.grid,8);
  ['in 1','in 2','sum','fires','want'].forEach((h,i)=>out+=TBF(cx[i],64,h,13,C.muted));
  B8_PATS.forEach((x,i)=>{const yy=88+i*24,ok=outs[i]===g.t[i],sm=s.w1*x[0]+s.w2*x[1];out+=TF(cx[0],yy,x[0],13,C.ink)+TF(cx[1],yy,x[1],13,C.ink)+TF(cx[2],yy,B8_sg(sm),13,C.ink)+TBF(cx[3],yy,outs[i],13,ok?C.green:C.coral)+TF(cx[4],yy,g.t[i]+(ok?' ✓':' ✕'),13,ok?C.green:C.coral)});
  // input square with the dividing line
  const pl=B8_plot(370,206,110,100,[-.4,1.4],[-.4,1.4],{xt:[[0,'0'],[1,'1']],yt:[[0,'0'],[1,'1']],xl:'input 1',xlDy:31});out+=pl.svg+TF(362,200,'input 2',13,C.muted,'end');
  const lo=-.4,hi=1.4,pts=[];
  if(Math.abs(s.w2)>1e-9){for(const xv of [lo,hi])pts.push([xv,(s.th-s.w1*xv)/s.w2])}else if(Math.abs(s.w1)>1e-9){for(const yv of [lo,hi])pts.push([s.th/s.w1,yv])}
  if(pts.length){const cl=pts.map(q=>[clamp(q[0],lo-1,hi+1),q[1]]);out+=`<clipPath id="b8clip"><rect x="370" y="206" width="110" height="100"/></clipPath>`+G(L(pl.X(cl[0][0]),pl.Y(cl[0][1]),pl.X(cl[1][0]),pl.Y(cl[1][1]),C.amber,2.5),'clip-path="url(#b8clip)"')}
  B8_PATS.forEach((x,i)=>out+=Ci(pl.X(x[0]),pl.Y(x[1]),8,g.t[i]?C.ink:'#fff',outs[i]===g.t[i]?C.green:C.coral,'stroke-width="3"'));
  out+=TF(492,226,'filled: fire',13,C.muted,'start')+TF(492,244,'ring green:',13,C.muted,'start')+TF(492,260,'right',13,C.muted,'start')+TF(492,278,'line: sum = θ',13,C.amber,'start');
  out+=B8_tile(30,276,150,'Perceptron rule',s.log?`${s.log.up} change${s.log.up===1?'':'s'}`:'not run',s.log?(s.log.ok?C.green:C.coral):C.muted)+B8_tile(190,276,150,'Passes',s.log?(s.log.ok?String(s.log.ep):'25, no fit'):'none',s.log?(s.log.ok?C.green:C.coral):C.muted);
  out+=B8_note('A McCulloch–Pitts-style unit with adjustable weights, as in Rosenblatt’s perceptron.',362);
  return {svg:out,phase:s.log&&!s.log.ok?`After 25 passes and ${s.log.up} weight changes the unit still gets XOR wrong. No single line separates (0,1) and (1,0) from (0,0) and (1,1), so one threshold unit cannot compute it; a second layer of units can.`:
   s.log?`The perceptron rule found weights ${B8_sg(s.w1)} and ${B8_sg(s.w2)} with threshold ${B8_sg(s.th)} after ${s.log.up} change${s.log.up===1?'':'s'}. All four rows are now right: the line divides the patterns that should fire from those that should not.`:
   right===4?`All four rows match ${g.name}. A unit that only adds and compares with a threshold computes a logical function, which is the step McCulloch and Pitts took in 1943.`:
   `${right} of 4 rows are right. Change a weight or the threshold to move the line in the square, or press Learn. ${s.gate==='xor'?'Can any line do XOR?':''}`.trim()};
 }});

// Convolution and pooling on a 9 × 9 image. The "simple cell" filter is 3 × 3: +1 down its middle and −0.5 on either side
// (or the same turned 90°). S units: the filter at every position (7 × 7), negative values set to zero. C units: the largest
// S response in each 3 × 3 patch of S units, with patches starting every 2 (3 × 3 C units).
const B8_FILT={v:[[-.5,1,-.5],[-.5,1,-.5],[-.5,1,-.5]],h:[[-.5,-.5,-.5],[1,1,1],[-.5,-.5,-.5]]};
function B8_img(s){const im=range(9).map(()=>new Array(9).fill(0));for(let d=-1;d<=1;d++){const x=s.o==='v'?s.bx:s.o==='h'?s.bx+d:s.bx+d,y=s.o==='v'?s.by+d:s.o==='h'?s.by:s.by-d;if(x>=0&&x<9&&y>=0&&y<9)im[y][x]=1}return im}
function B8_conv(im,f){return range(7).map(y=>range(7).map(x=>{let v=0;for(let j=0;j<3;j++)for(let i=0;i<3;i++)v+=f[j][i]*im[y+j][x+i];return Math.max(0,v)}))}
const B8_pool=S=>range(3).map(y=>range(3).map(x=>{let m=0;for(let j=0;j<3;j++)for(let i=0;i<3;i++)m=Math.max(m,S[2*y+j][2*x+i]);return m}));
SCENE({id:'brains-and-ai-features',name:'From simple cells to convolution',tag:'Hubel and Wiesel, 1962; Fukushima, 1980',
 definition:'David Hubel and Torsten Wiesel found that many cells in the cat’s primary visual cortex respond to a bar or edge at one orientation. Simple cells respond only when it falls on one spot; complex cells respond to the same orientation anywhere within a larger patch. They proposed that complex cells pool simple cells. In 1980 Kunihiko Fukushima built the neocognitron from layers of “S-cells” and “C-cells” named after them, each layer copying one detector across the whole image.',
 example:'Copying one detector to every position is a convolution; taking the strongest response in each patch is pooling. Here a filter with +1 down its middle and −0.5 on each side gives 3 for a bar lying exactly along it and 0 for a bar across it. In 1989 Yann LeCun and colleagues trained a network built this way to read handwritten postcodes, learning the filters by backpropagation. Convolutional networks descend from this line, and are loose models of vision, not copies of it.',
 desc:'A 9 × 9 image with a short bar, the map of simple-cell responses made by sliding one oriented filter over it, and the smaller map of complex cells that each take the strongest simple cell in a patch, with the central units outlined.',
 research:['Hubel & Wiesel (1959). Receptive fields of single neurones in the cat’s striate cortex. Journal of Physiology 148, 574–591.','Hubel & Wiesel (1962). Receptive fields, binocular interaction and functional architecture in the cat’s visual cortex. Journal of Physiology 160, 106–154.','Fukushima (1980). Neocognitron: a self-organizing neural network model for a mechanism of pattern recognition unaffected by shift in position. Biological Cybernetics 36, 193–202.','LeCun, Boser, Denker, Henderson, Howard, Hubbard & Jackel (1989). Backpropagation applied to handwritten zip code recognition. Neural Computation 1, 541–551.'],
 dur:12,hint:'Press the image to move the bar, and change its orientation or the filter’s. Watch the outlined simple cell and complex cell: which keeps responding as the bar moves a little? The filter is a fixed illustration.',
 init:()=>({bx:4,by:4,o:'v',f:'v'}),
 watch(p){if(p<.75){const bx=1+Math.min(6,Math.floor(p/.75*7));return {bx,by:4,o:'v',f:'v'}}return {bx:4,by:4,o:p<.88?'h':'d',f:'v'}},
 ui:[{choose:[['v','Vertical bar'],['h','Horizontal'],['d','Diagonal']],label:'Bar',get:s=>s.o,act:'o'},{choose:[['v','Vertical filter'],['h','Horizontal filter']],label:'Simple cells prefer',get:s=>s.f,act:'f'},{b:'Centre the bar',act:'centre'}],
 on:{o(s,v){s.o=['v','h','d'].includes(v)?v:'v'},f(s,v){s.f=v==='h'?'h':'v'},centre(s){s.bx=4;s.by=4},px(s,v){const i=clamp(Math.round(+v),0,80);s.bx=clamp(i%9,1,7);s.by=clamp(Math.floor(i/9),1,7)}},
 draw(s,f,X){
  const im=B8_img(s),S=B8_conv(im,B8_FILT[s.f]),Cm=B8_pool(S),sC=S[3][3],cC=Cm[1][1],nS=sum(S.map(r=>r.filter(v=>v>.01).length)),nC=sum(Cm.map(r=>r.filter(v=>v>.01).length));
  const shade=v=>tint(C.coral,1-.92*clamp(v/3,0,1));
  let out=heading(`Simple cell at the centre: ${fmt(sC)} · complex cell over it: ${fmt(cC)}`);
  // image
  const ix=30,iy=70,ic=22;out+=TF(ix,60,'image (press to move the bar)',13,C.muted,'start');
  for(let y=0;y<9;y++)for(let x=0;x<9;x++)out+=hit(X,'px',y*9+x,`Put the bar’s centre at ${x+1}, ${y+1}`,R(ix+x*ic,iy+y*ic,ic,ic,im[y][x]?C.ink:'#fff',C.grid,0,'stroke-width="1"'));
  out+=R(ix+3*ic,iy+3*ic,3*ic,3*ic,'none',C.blue,0,'stroke-dasharray="4 3"');
  // filter
  const fx=ix,fy=iy+9*ic+22,fc=14;out+=TF(fx,fy-6,'filter',13,C.muted,'start');
  B8_FILT[s.f].forEach((row,j)=>row.forEach((v,i)=>out+=R(fx+i*fc,fy+j*fc,fc,fc,v>0?C.blue:C.pale,'#fff',0,'stroke-width="1"')));
  out+=TF(fx+3*fc+8,fy+16,'+1 blue, −0.5 pale',13,C.muted,'start')+TF(fx+3*fc+8,fy+34,'dashes: centre S cell’s view',13,C.blue,'start');
  // S map
  const sx=262,sy=82,sc=17;out+=TBF(sx,62,'simple cells (S)',13,C.ink,'start')+TF(sx,76,'one filter at every position',13,C.muted,'start');
  for(let y=0;y<7;y++)for(let x=0;x<7;x++)out+=R(sx+x*sc,sy+y*sc,sc,sc,S[y][x]>.01?shade(S[y][x]):'#fff',C.grid,0,'stroke-width="1"');
  out+=R(sx+3*sc,sy+3*sc,sc,sc,'none',C.blue,0,'stroke-width="2.5"')+R(sx+2*sc,sy+2*sc,3*sc,3*sc,'none',C.purple,0,'stroke-dasharray="4 3"');
  // C map
  const cx=440,cy=96,cc=30;out+=TBF(cx,62,'complex cells (C)',13,C.ink,'start')+TF(cx,76,'strongest S in each patch',13,C.muted,'start');
  for(let y=0;y<3;y++)for(let x=0;x<3;x++)out+=R(cx+x*cc,cy+y*cc,cc,cc,Cm[y][x]>.01?shade(Cm[y][x]):'#fff',C.grid,0,'stroke-width="1"')+TF(cx+x*cc+cc/2,cy+y*cc+cc/2+5,fmt(Cm[y][x]),13,Cm[y][x]>1.5?'#fff':C.ink);
  out+=R(cx+cc,cy+cc,cc,cc,'none',C.purple,0,'stroke-width="2.5"')+curveArrow(sx+5*sc+4,sy+3.5*sc,cx-4,cy+1.5*cc,-14,C.purple,1.6);
  out+=TF(cx,cy+3*cc+18,'purple: this C cell',13,C.purple,'start')+TF(cx,cy+3*cc+34,'pools the dashed',13,C.purple,'start')+TF(cx,cy+3*cc+50,'patch of S cells',13,C.purple,'start');
  out+=B8_tile(262,246,150,'Simple cell, centre',fmt(sC),sC>.01?C.coral:C.muted)+B8_tile(422,246,150,'Complex cell, centre',fmt(cC),cC>.01?C.coral:C.muted);
  out+=B8_tile(262,300,150,'S cells responding',`${nS} of 49`,C.ink)+B8_tile(422,300,150,'C cells responding',`${nC} of 9`,C.ink);
  out+=B8_note('Illustrative filter and image; responses are computed, negative sums shown as 0.',368);
  const along=s.o===s.f;
  return {svg:out,phase:!along&&cC<.01?`The bar lies ${s.o==='d'?'diagonally':'across the filter'}, so the filter’s +1 and −0.5 parts cancel and no cell responds. Orientation selectivity comes from the filter’s shape.`:
   !along?`A diagonal bar only partly matches the ${s.f==='v'?'vertical':'horizontal'} filter: the best any cell gives is ${fmt(cC)}, against 3 for a bar lying along it. Like a simple cell, the filter is tuned to an orientation, not merely to brightness.`:
   sC>.01?`The bar sits exactly on the centre simple cell’s window, giving ${fmt(sC)}, and the complex cell above it takes that value. Now move the bar one square to the side.`:
   cC>.01?`The bar has moved off the centre simple cell’s window, so it falls silent, but a neighbouring simple cell in the same patch responds and the complex cell still reports ${fmt(cC)}. Pooling gives a response that tolerates small shifts, as Hubel and Wiesel saw in complex cells.`:
   'The bar is outside the patch the centre complex cell pools, so both outlined cells are silent; other cells respond where the bar now lies.'};
 }});

// Representational similarity, simulated. Eight images, four animate and four inanimate. Each image has its own
// low-level pattern (random) and a category pattern shared by its group. A representation at "depth" α mixes them:
// (1 − α)·low-level + α·category, plus noise (sd 0.15 for layers, 0.4 for areas). Model layers 1–5 have α = 0.05, 0.25, 0.45, 0.65, 0.85; the simulated
// brain areas V1, V4 and IT have α = 0.03, 0.45 and 0.88 with their own noise. A dissimilarity matrix holds 1 − r for each
// pair of images; matrices are compared by correlating their 28 entries.
const B8_IMGS=['face','hand','dog','bird','car','chair','hammer','house'];
const B8_LAYA=[.05,.25,.45,.65,.85],B8_AREAS={V1:.03,V4:.45,IT:.88},B8_D=40;
const B8_FEAT=(()=>{const r=B8_rng(2014),low=B8_IMGS.map(()=>range(B8_D).map(()=>B8_gauss(r))),cat=[0,1].map(()=>range(B8_D).map(()=>B8_gauss(r)));return {low,cat}})();
function B8_rep(alpha,seed,noise){const r=B8_rng(seed);return B8_IMGS.map((_,i)=>range(B8_D).map(d=>(1-alpha)*B8_FEAT.low[i][d]+alpha*B8_FEAT.cat[i<4?0:1][d]+noise*B8_gauss(r)))}
const B8_rdm=rep=>rep.map(a=>rep.map(b=>1-B8_corr(a,b)));
const B8_tri=M=>{const v=[];for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)v.push(M[i][j]);return v};
const B8_RSA=(()=>{const lay=B8_LAYA.map((a,i)=>B8_rdm(B8_rep(a,100+i,.15))),area={};Object.keys(B8_AREAS).forEach((k,i)=>area[k]=B8_rdm(B8_rep(B8_AREAS[k],500+i,.4)));
 const match={};for(const k in area)match[k]=lay.map(M=>B8_corr(B8_tri(M),B8_tri(area[k])));return {lay,area,match}})();
SCENE({id:'brains-and-ai-ventral',name:'Deep networks and the ventral stream',tag:'Yamins and colleagues, 2014',
 definition:'Visual signals pass from V1 through areas such as V4 to the inferior temporal cortex (IT), where many cells respond to whole objects. Around 2012 deep convolutional networks trained on large sets of labelled photographs began to recognise objects far better than earlier programs. In 2014 Daniel Yamins, James DiCarlo and colleagues found that a network trained only to recognise objects predicted the responses of IT neurons in monkeys better than earlier models, and its middle layers best matched V4.',
 example:'One way to compare a network with a brain is representational similarity analysis (Kriegeskorte and colleagues, 2008): for every pair of images, how differently does each respond? In the same year Khaligh-Razavi and Kriegeskorte found that the deep network’s top layers best matched human and monkey IT. The match is a resemblance in pattern, not proof that the brain works the same way, and the brain does this on about 20 watts.',
 desc:'Two eight-by-eight grids of how differently a chosen network layer and a chosen brain area respond to each pair of eight images, beside a graph of how well each of five layers matches each of three visual areas.',
 research:['Yamins, Hong, Cadieu, Solomon, Seibert & DiCarlo (2014). Performance-optimized hierarchical models predict neural responses in higher visual cortex. PNAS 111, 8619–8624.','Khaligh-Razavi & Kriegeskorte (2014). Deep supervised, but not unsupervised, models may explain IT cortical representation. PLoS Computational Biology 10, e1003915.','Kriegeskorte, Mur & Bandettini (2008). Representational similarity analysis: connecting the branches of systems neuroscience. Frontiers in Systems Neuroscience 2, 4.','Krizhevsky, Sutskever & Hinton (2012). ImageNet classification with deep convolutional neural networks. Advances in Neural Information Processing Systems 25.','The responses here are simulated to show the method; they are not the published data.'],
 dur:12,hint:'Choose a brain area and step through the network’s layers. Which layer’s grid looks most like the area’s? All responses here are simulated.',
 init:()=>({area:'IT',L:3}),
 watch(p){return p<.6?{area:'IT',L:1+Math.min(4,Math.floor(p/.6*5))}:{area:'V1',L:1+Math.min(4,Math.floor((p-.6)/.4*5))}},
 ui:[{choose:[['V1','V1'],['V4','V4'],['IT','IT']],label:'Brain area',get:s=>s.area,act:'area'},{range:'L',label:'Network layer',min:1,max:5,step:1,get:s=>s.L,act:'L',show:v=>'layer '+v}],
 on:{area(s,v){s.area=B8_AREAS[v]!==undefined?v:'IT'},L(s,v){s.L=clamp(Math.round(+v),1,5)}},
 draw(s){
  const m=B8_RSA.match[s.area],r=m[s.L-1],best=m.indexOf(Math.max(...m))+1;
  let out=heading(`Layer ${s.L} against ${s.area}: match r = ${fmt(B8_r2(r))}${best===s.L?' (best)':''}`);
  const grid=(x0,y0,M,title)=>{let o=TBF(x0,y0-30,title,13,C.ink,'start');const c=15;for(let i=0;i<8;i++)for(let j=0;j<8;j++)o+=R(x0+j*c,y0+i*c,c,c,tint(C.blue,clamp(M[i][j]/1.6,0,1)*.95),'#fff',0,'stroke-width="0.6"');
   o+=L(x0+4*c,y0,x0+4*c,y0+8*c,C.coral,1.4)+L(x0,y0+4*c,x0+8*c,y0+4*c,C.coral,1.4);return o};
  out+=grid(40,92,B8_RSA.lay[s.L-1],`network layer ${s.L}`)+grid(190,92,B8_RSA.area[s.area],`${s.area} (simulated)`);
  out+=TF(40,78,'4 animate | 4 objects',13,C.muted,'start')+TF(190,78,'4 animate | 4 objects',13,C.muted,'start');
  out+=TF(40,232,'dark: the two images give',13,C.muted,'start')+TF(40,248,'similar responses; pale: different',13,C.muted,'start');
  // match by layer
  const pl=B8_plot(372,70,190,150,[.6,5.4],[-.2,1],{xt:[[1,'1'],[2,'2'],[3,'3'],[4,'4'],[5,'5']],yt:[[0,'0'],[.5,'0.5'],[1,'1']],xl:'network layer',xlDy:32,yl:'match with the area (r)'});out+=pl.svg+L(pl.X(.6),pl.Y(0),pl.X(5.4),pl.Y(0),C.grid,1);
  const col={V1:C.green,V4:C.purple,IT:C.coral};
  for(const k in B8_RSA.match){const mm=B8_RSA.match[k],on=k===s.area;out+=B8_poly(mm.map((v,i)=>[pl.X(i+1),pl.Y(v)]),col[k],on?3:1.4,on?'':'stroke-opacity=".55"');mm.forEach((v,i)=>out+=Ci(pl.X(i+1),pl.Y(v),on?4.5:3,col[k]));out+=TF(pl.X(5.4)+4,pl.Y(mm[4])+4,k,13,col[k],'start')}
  out+=Ci(pl.X(s.L),pl.Y(r),8,'none',C.ink);
  out+=B8_tile(40,284,160,'Match, this layer',fmt(B8_r2(r)),C.ink)+B8_tile(210,284,160,`Best layer for ${s.area}`,'layer '+best,col[s.area]);
  out+=B8_lines(390,290,'Pattern built in to echo the published result: early layers resemble V1, late layers IT.',28,13,C.muted);
  out+=B8_note('Simulated responses to eight images; the method is real, the numbers are illustrative.',368);
  return {svg:out,phase:s.area==='IT'?`IT’s grid has two dark blocks: it responds alike to the four animate things and alike to the four objects. Layer ${s.L} ${best===s.L?'matches it best':r<.6?'still sorts the images mostly by their low-level look':'already resembles it'} (r = ${fmt(B8_r2(r))}); the top layers, which separate the categories most cleanly, match best.`:
   s.area==='V1'?`V1 responds to the images’ local features, not their category, so its grid has no blocks. The first layers match it best (layer ${best}); at layer ${s.L} the match is r = ${fmt(B8_r2(r))}.`:
   `V4 sits between: its best match is layer ${best}, a middle layer, as Yamins and colleagues reported for real V4 recordings. At layer ${s.L} the match is r = ${fmt(B8_r2(r))}.`};
 }});

// Weight transport, simulated. A linear network 6 → 3 → 3 learns a target mapping T (3 × 6). Error e = W2·W1 − T on the
// expected squared error over standard normal inputs. Backpropagation updates W1 with W2ᵀ·e; feedback alignment with a
// fixed random matrix B·e (Lillicrap and colleagues, 2016); "output only" leaves W1 at its random start. Rate 0.012.
// Error is shown as a fraction of the error before training.
const B8_mm=(A,B)=>A.map(r=>B[0].map((_,j)=>sum(r.map((v,k)=>v*B[k][j]))));
const B8_tr=A=>A[0].map((_,j)=>A.map(r=>r[j]));
const B8_mat=(n,m,sd,r)=>range(n).map(()=>range(m).map(()=>sd*B8_gauss(r)));
const B8_frob=A=>sum(A.map(r=>sum(r.map(v=>v*v))));
const B8_BP=(()=>{const r=B8_rng(1986),T=B8_mat(3,6,1/Math.sqrt(2),r),W1=B8_mat(3,6,.3,r),W2=B8_mat(3,3,.3,r),B=B8_mat(3,3,.6,r),out={},l0=B8_frob(B8_mm(W2,W1).map((row,i)=>row.map((v,j)=>v-T[i][j])));
 for(const rule of ['bp','fa','none']){let a=W1.map(x=>x.slice()),b=W2.map(x=>x.slice());const loss=[],ang=[];
  for(let t=0;t<=1000;t++){const M=B8_mm(b,a),E=M.map((row,i)=>row.map((v,j)=>v-T[i][j]));loss.push(B8_frob(E)/l0);
   const fv=B8_tr(b).flat(),bv=B.flat(),cs=sum(fv.map((v,i)=>v*bv[i]))/Math.sqrt(B8_frob([fv])*B8_frob([bv]));ang.push(Math.acos(clamp(cs,-1,1))*180/Math.PI);
   const g2=B8_mm(E,B8_tr(a)),back=rule==='bp'?B8_tr(b):B,g1=B8_mm(back,E);b=b.map((row,i)=>row.map((v,j)=>v-.012*g2[i][j]));if(rule!=='none')a=a.map((row,i)=>row.map((v,j)=>v-.012*g1[i][j]))}
  out[rule]={loss,ang}}return out})();
const B8_RULES={bp:{name:'Backpropagation',col:C.blue},fa:{name:'Random feedback',col:C.green},none:{name:'Output layer only',col:C.coral}};
SCENE({id:'brains-and-ai-backprop',name:'Who carries the error back?',tag:'Backpropagation and the brain: a debated question',
 definition:'Deep networks learn by backpropagation, popularised in 1986 by David Rumelhart, Geoffrey Hinton and Ronald Williams: the error at the output is sent back through the network to tell every hidden weight how to change. To do this exactly, the backward pass must use the same weights as the forward pass. Francis Crick argued in 1989 that real synapses cannot do that. Whether the brain does anything like backpropagation is still debated.',
 example:'In 2016 Timothy Lillicrap and colleagues showed that fixed random feedback weights also work: the forward weights come to line up with them. Ideas from AI have also explained the brain: temporal-difference learning (Sutton, 1988) predicted how dopamine neurons respond to reward (Schultz, Dayan and Montague, 1997). Other differences are clear: neurons send spikes and do much computing in their dendrites, and the brain runs on about 20 watts, about a fifth of the body’s resting energy.',
 desc:'A graph of the remaining error, as a percentage of the starting error, over training steps for a small network trained by backpropagation, by random feedback, or with only its output layer learning, with the angle between the forward and feedback weights.',
 research:['Rumelhart, Hinton & Williams (1986). Learning representations by back-propagating errors. Nature 323, 533–536.','Crick (1989). The recent excitement about neural networks. Nature 337, 129–132.','Lillicrap, Cownden, Tweed & Akerman (2016). Random synaptic feedback weights support error backpropagation for deep learning. Nature Communications 7, 13276.','Lillicrap, Santoro, Marris, Akerman & Hinton (2020). Backpropagation and the brain. Nature Reviews Neuroscience 21, 335–346.','Schultz, Dayan & Montague (1997). A neural substrate of prediction and reward. Science 275, 1593–1599.','Attwell & Laughlin (2001). An energy budget for signaling in the grey matter of the brain. Journal of Cerebral Blood Flow and Metabolism 21, 1133–1145.'],
 dur:12,hint:'Train the small network a hundred steps at a time and switch between the three ways of sending the error back. Which ones learn, and how fast? The network is a tiny simulated example.',
 init:()=>({rule:'fa',steps:100}),
 watch(p){return {rule:p<.33?'bp':p<.66?'fa':'none',steps:Math.max(20,Math.round(1000*smooth(Math.min(1,p*1.3))))}},
 ui:[{choose:[['bp','Backpropagation'],['fa','Random feedback'],['none','Output only']],label:'Error sent back by',get:s=>s.rule,act:'rule'},{b:'Train 100 steps',act:'train'},{b:'Start again',act:'again'}],
 on:{rule(s,v){s.rule=B8_RULES[v]?v:'fa';return 'keep'},train(s){s.steps=Math.min(1000,s.steps+100)},again(s){s.steps=0}},
 draw(s){
  const R0=B8_BP[s.rule],k=s.steps,err=R0.loss[k],ang=R0.ang[k];
  let out=heading(`${B8_RULES[s.rule].name}, ${k} steps: ${Math.round(100*err)}% of the error left`);
  // network sketch
  const lx=[60,130,200],ny=[6,3,3],pos=(l,i)=>[lx[l],130+(i-(ny[l]-1)/2)*(l?30:26)];
  for(let l=0;l<2;l++)for(let i=0;i<ny[l];i++)for(let j=0;j<ny[l+1];j++){const a=pos(l,i),b=pos(l+1,j);out+=L(a[0],a[1],b[0],b[1],C.grid,1.2)}
  for(let l=0;l<3;l++)for(let i=0;i<ny[l];i++){const q=pos(l,i);out+=Ci(q[0],q[1],8,'#fff',C.ink,'stroke-width="1.5"')}
  out+=curveArrow(206,180,128,180,-22,B8_RULES[s.rule].col,2)+TF(166,218,s.rule==='bp'?'error back, same weights':s.rule==='fa'?'error back, random weights':'no error to hidden layer',13,B8_RULES[s.rule].col);
  out+=TF(60,54,'input',13,C.muted)+TF(130,86,'hidden',13,C.muted)+TF(200,86,'output',13,C.muted);
  // loss curves
  const pl=B8_plot(300,60,260,160,[0,1000],[0,1.05],{xt:[[0,'0'],[500,'500'],[1000,'1000']],yt:[[0,'0%'],[.5,'50%'],[1,'100%']],xl:'training steps',xlDy:32,yl:'error left'});out+=pl.svg;
  for(const rk of ['bp','fa','none']){const on=rk===s.rule,lo=B8_BP[rk].loss;out+=B8_poly(range(Math.floor(k/5)+1).map(i=>[pl.X(i*5),pl.Y(clamp(lo[i*5],0,1.05))]),B8_RULES[rk].col,on?3:1.4,on?'':'stroke-opacity=".55"')}
  out+=Ci(pl.X(k),pl.Y(clamp(err,0,1.05)),5,B8_RULES[s.rule].col,'#fff');
  out+=TF(570,292,'blue: backpropagation',13,C.blue,'end')+TF(570,310,'green: random feedback',13,C.green,'end')+TF(570,328,'coral: output layer only',13,C.coral,'end');
  out+=B8_tile(30,236,150,'Error left',Math.round(100*err)+'%',err<.05?C.green:C.coral)+B8_tile(30,290,150,'Forward vs feedback',s.rule==='bp'?'0° (same)':Math.round(ang)+'°',C.ink);
  out+=B8_lines(194,272,'The angle compares the output weights with the weights that carry the error back.',24,13,C.muted);
  out+=B8_note('A tiny linear network, simulated. Whether brains learn by anything like these rules is not known.',368);
  return {svg:out,phase:k===0?'Before training the network’s output is unrelated to the target. Press Train.':s.rule==='bp'?`Backpropagation sends the error back through the forward weights themselves, and after ${k} steps ${Math.round(100*err)}% of the error is left. It works well, but needs each synapse’s strength to be known on the way back, which is the part that is hard to picture in the brain.`:
   s.rule==='fa'?`With fixed random feedback weights the network still learns: ${Math.round(100*err)}% of the error is left after ${k} steps. The output weights have turned to within ${Math.round(ang)}° of the feedback weights, so the random signal has become useful. This is one of several proposals for how a brain might learn without exact weight transport.`:
   `When only the output layer learns, the error stalls at about ${Math.round(100*err)}%: the hidden layer keeps its random start and cannot pass on everything the target needs. Getting the error to the hidden layer is what lets deep networks learn.`};
 }});

