/* ===================== Brain In Motion · Era 8 · Tools and frontiers ===================== */
// The patch clamp, optogenetics, place and grid cells, brain–computer interfaces, organoids, brains and AI.
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
  const pl=B8_plot(80,206,220,120,[-150,0],[-5,.5],{xt:[[-140,'−140'],[-100,'−100'],[-60,'−60'],[-20,'−20']],yt:[[-4,'−4'],[-2,'−2'],[0,'0']],xl:'holding voltage (mV)',xlDy:32,yl:'step size (pA)'});out+=pl.svg+L(pl.X(-150),pl.Y(0),pl.X(0),pl.Y(0),C.grid,1);
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
  const pl=B8_plot(70,214,300,112,[7,11],[0,1.4],{xt:[[7,'10 MΩ'],[8,'100 MΩ'],[9,'1 GΩ'],[10,'10 GΩ'],[11,'100 GΩ']],yt:[[0,'0'],[.5,'0.5'],[1,'1']],xl:'seal resistance (log scale)',xlDy:32,yl:'seal noise (pA)'});
  out+=pl.svg+R(pl.X(7.3),215,pl.X(8)-pl.X(7.3),110,C.coralp,'none',0)+R(pl.X(9),215,pl.X(11)-pl.X(9)-1,110,C.greenp,'none',0);
  out+=TF(pl.X(7.65),232,'1976',13,C.coral)+TF(pl.X(10),232,'gigaseals',13,C.green);
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
  out+=P(`M${TX(0)} 84 L${TX(q.t0)} 84 L${TX(q.t0)} 74 L${TX(q.T)} 74`,C.amber,2)+TF(294,70,'−100 → −20 mV',13,C.amber,'end');
  const last=sw.slice(-4);last.forEach((e,i)=>{const yb=118+i*44;let d=`M${TX(0)} ${yb}`;if(e)d+=` L${fmt(TX(e[0]))} ${yb} L${fmt(TX(e[0]))} ${yb+22} L${fmt(TX(e[1]))} ${yb+22} L${fmt(TX(e[1]))} ${yb}`;d+=` L${TX(q.T)} ${yb}`;out+=P(d,e?C.blue:C.muted,1.8);if(!e)out+=TF(TX(q.T),yb-6,'no opening',13,C.muted,'end')});
  for(const t of [0,5,10])out+=TF(TX(t),274,t+(t===10?' ms':''),13,C.muted);
  // average
  const pl=B8_plot(370,62,200,190,[0,q.T],[-.75,.1],{xt:[[0,'0'],[5,'5'],[10,'10 ms']],yt:[[-.6,'−0.6'],[-.3,'−0.3'],[0,'0']],yl:'average current (pA)'});out+=pl.svg+L(pl.X(0),pl.Y(0),pl.X(q.T),pl.Y(0),C.grid,1);
  const th=[];for(let i=0;i<=200;i++){const t=i/200*q.T;th.push([pl.X(t),pl.Y(q.i*B8_naP(t))])}out+=B8_poly(th,C.coral,2,'stroke-dasharray="5 4"');
  if(s.n)out+=B8_poly(avg.map((v,j)=>[pl.X(j/nb*q.T),pl.Y(clamp(v/s.n,-.75,.1))]),C.blue,2.2);
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
  out+=R(20,46,300,300,bath,C.grid,8)+TF(30,64,'bath (outside the cell)',13,C.muted,'start');
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
