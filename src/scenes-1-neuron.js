/* ===================== Brain In Motion · Era 1 · The neuron ===================== */
// Animal electricity, the neuron doctrine, the resting potential, the action potential, myelin and glia.
// Every picture is a pure function of state, frame and X. Sound (spike clicks) plays only from on() handlers.
// Simulated measurements use seeded generators and are labelled as simulated or illustrative.

/* ---- shared helpers ---- */
const B1_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join('L'),col,w,'none',extra):'';
const B1_r1=v=>Math.round(v*10)/10;
// A signed number with a true minus sign, to one decimal place by default.
const B1_sg=(v,dp=1)=>{const k=Math.pow(10,dp),q=Math.round(v*k)/k;return (q<0?'−':q>0?'+':'')+fmt(Math.abs(q))};
const B1_mV=(v,dp=1)=>B1_sg(v,dp)+' mV';
const B1_panel=(x,y,w,h,fill='#fff')=>R(x,y,w,h,fill,C.grid,10);
// Word-wrapped fixed-size text. Returns {svg,n,y}: y is the baseline after the last line.
function B1_wrap(x,y,text,max,size=13,col=C.ink,lh=17,anchor='start',fn=TF){
 const words=String(text).split(' ');let line='',out='',n=0;
 for(const w of words){if(line&&(line+' '+w).length>max){out+=fn(x,y+n*lh,line,size,col,anchor);n++;line=w}else line=line?line+' '+w:w}
 if(line){out+=fn(x,y+n*lh,line,size,col,anchor);n++}
 return {svg:out,n,y:y+n*lh};
}
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function B1_plot(x0,y0,w,h,xr,yr,o={}){
 const lx=!!o.logx,f=v=>lx?Math.log10(v):v;
 const X=v=>x0+(f(v)-f(xr[0]))/(f(xr[1])-f(xr[0]))*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0-(o.ylDx||0),y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// Spike clicks: very short, quiet noise bursts at the given times (seconds from now). Call only from on() handlers.
function B1_clicks(times){times.slice(0,12).forEach(t=>AUDIO.noise({dur:.006,gain:.12,at:t}))}
// A seeded value that is roughly normal (sum of three uniforms), standard deviation sd.
const B1_gauss=(r,sd)=>(r()+r()+r()-1.5)*2*sd;
// RT/F in millivolts at a temperature in °C.
const B1_RTF=c=>8.314462*(273.15+c)/96485.33*1000;
const B1_nernst=(out,inn,z=1,c=37)=>B1_RTF(c)/z*Math.log(out/inn);
// Typical concentrations (mM) for a mammalian neuron, as given in standard textbooks.
const B1_ION={K:{sym:'K⁺',name:'potassium',z:1,out:5,inn:140,col:C.purple},Na:{sym:'Na⁺',name:'sodium',z:1,out:145,inn:15,col:C.coral},Cl:{sym:'Cl⁻',name:'chloride',z:-1,out:110,inn:10,col:C.green}};
// Goldman–Hodgkin–Katz voltage (mV) for K⁺, Na⁺ and Cl⁻ with relative permeabilities pK : pNa : pCl.
function B1_ghk(pNa,pCl,c=37,o={}){const Ko=o.Ko===undefined?5:o.Ko,Ki=o.Ki===undefined?140:o.Ki,Nao=o.Nao===undefined?145:o.Nao,Nai=o.Nai===undefined?15:o.Nai;
 return B1_RTF(c)*Math.log((Ko+pNa*Nao+pCl*10)/(Ki+pNa*Nai+pCl*110))}

/* ===================== Lesson: animal-electricity ===================== */
const B1_ARC={
 two:{label:'Two metals',kick:1,result:'The leg kicks, every time.',g:'Galvani (1791): no machine, no storm, yet the leg kicks. The electricity is the animal’s own; the metal only lets it flow.',v:'Volta (1792): the two different metals make the electricity. The frog is only a very sensitive detector.'},
 one:{label:'One metal',kick:.35,result:'A weak kick, now and then.',g:'Galvani: it sometimes works with a single metal, so a difference between metals cannot be the whole cause.',v:'Volta: no piece of metal is perfectly uniform. Small differences along it are enough.'},
 glass:{label:'Glass rod',kick:0,result:'Nothing happens.',g:'Both agree: glass does not conduct. Whatever moves the leg has to flow through the arc, so it is electrical.',v:''},
 nerve:{label:'Nerve on muscle',kick:.8,result:'The leg kicks with no metal at all.',g:'Galvani (1794): the cut nerve laid against the muscle is enough. The tissue itself is the source.',v:'Volta: two different moist tissues in contact might behave like two metals.'}};
const B1_ARC_ORDER=['two','one','glass','nerve'];
SCENE({id:'animal-electricity',name:'Galvani’s frog and Volta’s reply',tag:'Whose electricity is it?',
 definition:'In 1791 Luigi Galvani reported that a frog’s leg kicks when an arc of two metals joins its nerve to its muscle, and concluded that animals make electricity of their own. Alessandro Volta replied that the metals made it. Each was partly right.',
 example:'Volta followed his idea to the pile of 1800, a stack of zinc and silver discs separated by brine-soaked card: the first battery, with no animal in it. Galvani’s answer, a kick with no metal at all (1794), was explained only later by the current that flows from injured tissue.',
 desc:'A prepared frog leg with its nerve, joined to the muscle by an arc of two metals, one metal or glass, or by the nerve itself; a panel gives the result and what Galvani and Volta each said.',
 research:['Galvani (1791). De viribus electricitatis in motu musculari commentarius. Bologna.','Volta (1800). On the electricity excited by the mere contact of conducting substances of different kinds. Philosophical Transactions 90, 403–431.','Piccolino (1998). Animal electricity and the birth of electrophysiology: the legacy of Luigi Galvani. Brain Research Bulletin 46, 381–407.'],
 dur:12,hint:'Choose what joins the nerve to the muscle. Ask each time: where could the electricity be coming from?',
 init:()=>({arc:'two'}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {arc:B1_ARC_ORDER[k],u:p*4-k}},
 ui:[{choose:B1_ARC_ORDER.map(k=>[k,B1_ARC[k].label]),label:'Join nerve and muscle with',get:s=>s.arc,act:'arc'}],
 on:{arc(s,v){s.arc=v}},
 draw(s){
  const a=B1_ARC[s.arc],u=s.u===undefined?1:s.u,kick=a.kick*(s.u===undefined?1:Math.sin(Math.PI*clamp((u-.25)/.6,0,1)));
  let out=heading(a.kick?(s.arc==='nerve'?'A kick without any metal':s.arc==='one'?'One metal: a weak, unreliable kick':'Two metals: the leg kicks'):'Glass: no kick');
  // table, leg and nerve (a simple outline; no detail)
  out+=L(30,318,290,318,C.line,3);
  const hip=[128,150],knee=[176,236],ang=lerp(1.45,.25,kick),foot=[knee[0]+78*Math.cos(ang),knee[1]+78*Math.sin(ang)];
  out+=L(hip[0],hip[1],knee[0],knee[1],'#b7d3bf',26)+L(knee[0],knee[1],foot[0],foot[1],'#b7d3bf',20)+L(foot[0],foot[1],foot[0]+26*Math.cos(ang-.9),foot[1]+26*Math.sin(ang-.9),'#b7d3bf',10);
  out+=TF(120,212,'muscle',13,C.green,'end');
  if(s.arc==='nerve')out+=P('M128 148 C70 100 60 200 144 190',C.amber,5)+TF(52,146,'nerve',13,C.amber,'middle');
  else out+=L(128,148,70,92,C.amber,5)+TF(56,84,'nerve',13,C.amber,'middle');
  if(s.arc==='two')out+=P('M92 112 C92 46 204 40 218 104','#b0812a',6)+P('M218 104 C228 150 208 186 166 196','#74838f',6)+TF(150,52,'brass',13,'#8a6316')+TF(252,150,'iron',13,'#5d6b76');
  if(s.arc==='one')out+=P('M92 112 C92 46 204 40 218 104 C228 150 208 186 166 196','#74838f',6)+TF(252,150,'iron',13,'#5d6b76');
  if(s.arc==='glass')out+=P('M92 112 C92 46 204 40 218 104 C228 150 208 186 166 196','#a9d3e6',6,'none','opacity=".8"')+TF(252,150,'glass',13,C.blue);
  if(kick>.05&&s.u===undefined)out+=P(`M${fmt(foot[0]+14)} ${fmt(foot[1]-26)}q14 12 8 30`,C.coral,2)+P(`M${fmt(foot[0]+28)} ${fmt(foot[1]-34)}q20 18 12 44`,C.coral,2);
  out+=TF(160,342,'frog leg and its nerve, on a glass plate',13,C.muted);
  // verdict panel
  out+=B1_panel(304,52,282,300)+TBF(318,80,a.result,14,a.kick?C.green:C.muted,'start');
  let w=B1_wrap(318,106,a.g,36,13,C.ink);out+=w.svg;
  if(a.v){w=B1_wrap(318,w.y+12,a.v,36,13,C.purple);out+=w.svg}
  w=B1_wrap(318,w.y+14,s.arc==='nerve'?'Later: an injured end is electrically negative to the rest, so a current flows (next scene).':s.arc==='glass'?'This control is why both men called it electricity.':'Both explanations fit this result. A new experiment was needed.',36,13,C.muted);out+=w.svg;
  return {svg:out,phase:s.arc==='two'?'Brass on the nerve, iron on the muscle, and the leg kicks. Galvani saw electricity stored in the animal; Volta saw electricity made where two metals meet. This one result cannot decide between them.':s.arc==='one'?'With a single metal the kick is weak and unreliable. Galvani took it as support; Volta answered that no metal is perfectly uniform.':s.arc==='glass'?'An insulator gives nothing. That the arc must conduct was common ground, and it is why the argument was about electricity at all.':'Galvani’s strongest reply used no metal: touch the cut end of the nerve to the muscle and it contracts. Volta’s pile of 1800 seemed to win the argument anyway, but both were right: metals in contact make electricity, and living tissue makes its own.'};
 }});

SCENE({id:'animal-electricity-current',name:'Measuring the nerve’s own current',tag:'du Bois-Reymond’s galvanometer',
 definition:'In the 1840s Emil du Bois-Reymond built galvanometers sensitive enough to measure the current that tissue itself produces. Between the intact surface of a nerve or muscle and a cut end a steady current flows, and when the nerve is active that current falls. He called the fall the negative variation: it is the first record of the nerve impulse.',
 example:'His needle was far too slow to follow one impulse, so he stimulated many times a second and read the average fall. In 1868 his student Julius Bernstein sampled the fall in thin slices of time: it lasted about a thousandth of a second and travelled at the speed Helmholtz had measured.',
 desc:'A nerve with one electrode on its surface and one on its surface or its cut end, wired to a galvanometer whose needle shows the steady current and its fall during stimulation.',
 research:['Matteucci (1842) measured the current between the cut and intact surfaces of muscle.','du Bois-Reymond (1848–49). Untersuchungen über thierische Elektricität. Berlin: Reimer.','Bernstein (1868). Ueber den zeitlichen Verlauf der negativen Schwankung des Nervenstroms. Pflügers Archiv 1, 173–207.'],
 dur:10,hint:'Move the second electrode to the cut end to find the steady current, then stimulate the nerve and watch the needle fall back. Needle readings are illustrative.',
 init:()=>({cut:1,rate:0}),
 watch(p){return {cut:p<.25?0:1,rate:p<.5?0:Math.round(lerp(0,100,smooth((p-.5)/.4))/5)*5}},
 ui:[{choose:[[0,'Both on the surface'],[1,'One on the cut end']],label:'Electrodes',get:s=>s.cut,act:'cut'},{range:'rate',label:'Shocks to the nerve',min:0,max:100,step:5,get:s=>s.rate,act:'rate',show:v=>v+' per second'}],
 on:{cut(s,v){s.cut=+v},rate(s,v){s.rate=+v}},
 draw(s){
  const rest=s.cut?40:0,fall=s.cut?Math.round(rest*.55*s.rate/100):0,div=rest-fall;
  let out=heading(!s.cut?'Two points on the intact surface: no current':s.rate?`Active nerve: the current falls to ${div} divisions`:`Resting nerve: a steady current, ${div} divisions`);
  // the nerve
  out+=R(50,150,250,34,C.amberp,C.amber,17)+R(284,150,16,34,C.coralp,C.coral,2)+TF(292,206,'cut end',13,C.coral)+TF(120,206,'intact surface',13,C.amber);
  const e2=s.cut?[308,167]:[230,150];
  out+=Ci(140,150,6,C.dark)+Ci(e2[0],e2[1],6,C.dark);
  out+=P(`M140 150 C140 80 300 70 392 104`,C.dark,2)+P(`M${e2[0]} ${e2[1]} C${e2[0]+30} ${s.cut?230:100} 360 250 400 196`,C.dark,2);
  if(s.cut)out+=TB(122,146,'+',16,C.ink)+TB(326,160,'−',16,C.ink);
  if(s.rate){out+=arrow(40,120,62,146,C.blue,2.5)+TF(46,110,'shocks',13,C.blue);for(let i=0;i<3;i++)out+=P(`M${80+i*60} 158l10 9l10 -9`,C.blue,1.6)}
  // galvanometer
  const gx=460,gy=150,gr=78,ang=a=>-Math.PI/2+(a/50)*1.1;
  out+=Ci(gx,gy,gr,'#fff',C.line);
  for(const d of [-40,-20,0,20,40]){const a=ang(d);out+=L(gx+Math.cos(a)*(gr-12),gy+Math.sin(a)*(gr-12),gx+Math.cos(a)*(gr-3),gy+Math.sin(a)*(gr-3),C.muted,1.6)+TF(gx+Math.cos(a)*(gr-26),gy+Math.sin(a)*(gr-26)+4,Math.abs(d),13,C.muted)}
  if(s.cut&&s.rate){const a0=ang(rest);out+=L(gx,gy,gx+Math.cos(a0)*(gr-18),gy+Math.sin(a0)*(gr-18),C.line,2,'stroke-dasharray="4 4"')}
  const an=ang(div);out+=L(gx,gy,gx+Math.cos(an)*(gr-16),gy+Math.sin(an)*(gr-16),C.coral,3.5)+Ci(gx,gy,5,C.dark);
  out+=TF(gx,gy+gr+20,'galvanometer',13,C.muted);
  out+=B1_panel(50,264,500,92);
  out+=TB(64,288,!s.cut?'No difference, no current.':s.rate?`Negative variation: ${fall} divisions less.`:'The cut end is negative to the surface.',14,C.ink,'start');
  out+=B1_wrap(64,310,!s.cut?'Every point on the intact surface is at the same potential. The inside of the fibres is not reached.':s.rate?'Each impulse briefly cancels part of the resting difference. The slow needle shows only the average, so faster stimulation gives a bigger fall.':'The cut end gives a path to the inside of the fibres, which is negative to the outside. That standing difference is what a nerve signal spends.',66,13,C.muted).svg;
  return {svg:out,phase:!s.cut?'With both electrodes on undamaged surface the needle stays at zero: the outside of a resting nerve is all at one potential.':s.rate?`At ${s.rate} shocks a second the needle falls from ${rest} to ${div} divisions. The nerve’s own current drops whenever it carries impulses: a signal made of electricity, measured without any metal arc to argue about.`:'One electrode on the cut end and the needle swings to a steady reading. This injury current also explains Galvani’s kick without metals. Now stimulate the nerve.'};
 }});

// Helmholtz’s timing. Latency (ms) = the muscle’s latent period + distance ÷ speed, plus a little timing noise.
const B1_HV=27,B1_LATENT=10;
const B1_helmT=(d,seed)=>B1_LATENT+d/B1_HV+B1_gauss(rng(seed),.06);
function B1_fit(runs){const n=runs.length;if(n<2)return null;const mx=sum(runs.map(r=>r.d))/n,my=sum(runs.map(r=>r.t))/n;let sxx=0,sxy=0;for(const r of runs){sxx+=(r.d-mx)*(r.d-mx);sxy+=(r.d-mx)*(r.t-my)}if(sxx<1)return null;const b=sxy/sxx;return {b,a:my-b*mx,v:b>0?1/b:null,span:Math.max(...runs.map(r=>r.d))-Math.min(...runs.map(r=>r.d))}}
const B1_HELM_WATCH=[[10,901],[60,417],[30,233],[50,650]];
SCENE({id:'animal-electricity-speed',name:'Timing the nerve signal',tag:'Helmholtz, 1850',
 definition:'Many physiologists thought the nerve signal too fast ever to measure. In 1850 Hermann von Helmholtz stimulated a frog’s nerve at two places, nearer to and farther from its muscle, and timed the start of the twitch. The extra delay for the extra length gave the speed: about 27 metres per second.',
 example:'Stimulating 50 mm farther from the muscle delays the twitch by about 1.9 ms: 50 mm ÷ 1.9 ms ≈ 27 m/s. A signal in a copper wire travels millions of times faster, so the nerve impulse cannot be simple conduction of electricity along a wire.',
 desc:'A frog nerve and muscle with a movable stimulating point, the twitch record with its delay, and a plot of delay against distance whose slope gives the speed, beside Helmholtz’s 27 metres per second.',
 research:['Helmholtz (1850). Vorläufiger Bericht über die Fortpflanzungsgeschwindigkeit der Nervenreizung. Archiv für Anatomie, Physiologie und wissenschaftliche Medicin, 71–73.','Helmholtz (1852). Messungen über Fortpflanzungsgeschwindigkeit der Reizung in den Nerven. Same journal, 199–216.','Schmidgen (2002). Of frogs and men: the origins of psychophysiological time experiments, 1850–1865. Endeavour 26, 142–148.'],
 dur:12,hint:'Set where the nerve is stimulated and press Stimulate. Measure at two or more distances: the slope of delay against distance is the speed. The measurements are simulated, with realistic timing error.',
 init:()=>({d:10,runs:[]}),
 watch(p){const n=Math.min(4,1+Math.floor(p*4.4)),runs=B1_HELM_WATCH.slice(0,n).map(([d,seed])=>({d,t:B1_helmT(d,seed)}));return {d:runs[runs.length-1].d,runs}},
 ui:[{range:'d',label:'Distance from muscle',min:10,max:60,step:5,get:s=>s.d,act:'d',show:v=>v+' mm'},{b:'Stimulate',act:'fire'},{b:'Clear',act:'clear'}],
 on:{d(s,v){s.d=+v},fire(s){s.runs.push({d:s.d,t:B1_helmT(s.d,nextSeed())});if(s.runs.length>8)s.runs.shift()},clear(s){s.runs=[]}},
 draw(s){
  const fit=B1_fit(s.runs),last=s.runs.length?s.runs[s.runs.length-1]:null;
  let out=heading(fit&&fit.v?`Your measurements give ${fmt(B1_r1(fit.v))} m/s`:'Stimulate at two different distances');
  // preparation
  const mx=40,nx=d=>112+d*3;
  out+=`<ellipse cx="76" cy="92" rx="38" ry="20" fill="#b7d3bf" stroke="${C.green}" stroke-width="2"/>`+TF(76,97,'muscle',13,C.green)+L(112,92,nx(62),92,C.amber,5)+TF(nx(62)-2,74,'nerve',13,C.amber,'end');
  for(const d of [10,60]){out+=L(nx(d),98,nx(d),106,C.muted,1.4)+TF(nx(d),120,d+' mm',13,C.muted)}
  out+=arrow(nx(s.d),58,nx(s.d),86,C.blue,2.5)+TF(nx(s.d),52,'shock',13,C.blue);
  // twitch record
  const tp=B1_plot(mx,150,262,120,[0,24],[0,1.15],{xt:[[0,'0'],[10,'10'],[20,'20 ms']],yl:'twitch record (time from the shock)'});out+=tp.svg;
  out+=L(tp.X(0),tp.Y(0),tp.X(0),tp.Y(.25),C.blue,3);
  s.runs.slice(-4).forEach((r,i,arr)=>{const lastOne=i===arr.length-1,pts=[];for(let k=0;k<=96;k++){const t=k/4,u=t-r.t;pts.push([tp.X(t),tp.Y(u<=0?0:Math.pow(u/9,1.6)*Math.exp(1.6*(1-u/9)))])}out+=B1_poly(pts,lastOne?C.coral:'#e4b7aa',lastOne?2.6:1.5)});
  if(last){out+=L(tp.X(last.t),tp.Y(0),tp.X(last.t),tp.Y(1.05),C.coral,1.2,'stroke-dasharray="3 4"')+TF(tp.X(last.t)-5,tp.Y(.9),'starts at '+last.t.toFixed(2)+' ms',13,C.coral,'end')}
  else out+=TF(mx+131,214,'Press Stimulate.',13,C.muted);
  // delay against distance
  const pl=B1_plot(368,66,206,180,[0,65],[10,13],{xt:[[0,'0'],[20,'20'],[40,'40'],[60,'60 mm']],yt:[[10,'10'],[11,'11'],[12,'12'],[13,'13']],yl:'delay to twitch, ms'});out+=pl.svg;
  const a0=fit?fit.a:B1_LATENT;
  out+=L(pl.X(0),pl.Y(a0),pl.X(65),pl.Y(a0+65/B1_HV),C.purple,1.6,'stroke-dasharray="6 5"');
  if(fit&&fit.v&&fit.a+65*fit.b<13.4&&fit.a>9.6)out+=L(pl.X(0),pl.Y(fit.a),pl.X(65),pl.Y(clamp(fit.a+65*fit.b,10,13)),C.blue,2.4);
  for(const r of s.runs)out+=Ci(pl.X(r.d),pl.Y(clamp(r.t,10,13)),4.5,C.coral,'#fff');
  out+=L(372,292,396,292,C.purple,1.6,'stroke-dasharray="6 5"')+TF(402,296,'Helmholtz: 27 m/s',13,C.purple,'start')+L(372,312,396,312,C.blue,2.4)+TF(402,316,fit&&fit.v?'yours: '+fmt(B1_r1(fit.v))+' m/s':'yours: not yet',13,C.blue,'start');
  out+=TF(40,316,fit?`${s.runs.length} twitches over ${fit.span} mm of nerve`:s.runs.length?'One distance cannot give a speed.':'No measurements yet.',13,C.ink,'start');
  out+=TF(40,336,'speed = extra distance ÷ extra delay',13,C.muted,'start');
  out+=TF(300,366,'Simulated frog nerve. A latent period of about 10 ms in the muscle is common to every run.',13,C.muted);
  return {svg:out,phase:!s.runs.length?'The twitch always starts about a hundredth of a second after the shock. Most of that is the muscle itself; Helmholtz’s idea was to compare two distances so that the muscle’s share cancels.':!fit||!fit.v?'Now move the stimulating point and measure again. The muscle’s delay is the same each time, so any change comes from the nerve.':`Delay grows by ${fmt(Math.round(fit.b*1000)/10)} ms for every 100 mm, so the signal travels at ${fmt(B1_r1(fit.v))} m/s (Helmholtz: about 27). ${fit.span<30?'Points close together give an uncertain slope: measure farther apart.':'That is slower than a racing bicycle, and vastly slower than electricity in a wire.'}`};
 }});

/* ===================== Lesson: neuron-doctrine ===================== */
// A field of schematic nerve cells for the Golgi stain. Built once from a fixed seed.
let B1_FIELD=null;
function B1_field(){
 if(B1_FIELD)return B1_FIELD;const r=rng(20731),cells=[],cl=(v,a,b)=>clamp(v,a,b);
 for(let gy=0;gy<6;gy++)for(let gx=0;gx<12;gx++){
  const x=42+gx*47+(r()-.5)*30,y=74+gy*46+(r()-.5)*28,paths=[];
  const nd=4+Math.floor(r()*2);
  for(let k=0;k<nd;k++){let a=-Math.PI/2+(k-(nd-1)/2)*.75+(r()-.5)*.4,px=x,py=y,d=`M${fmt(px)} ${fmt(py)}`;
   for(let j=0;j<4;j++){a+=(r()-.5)*.7;px=cl(px+Math.cos(a)*13,22,578);py=cl(py+Math.sin(a)*13,52,338);d+=`L${fmt(px)} ${fmt(py)}`;
    if(j===1){const b=a+(r()<.5?-1:1)*.8;paths.push(`M${fmt(px)} ${fmt(py)}L${fmt(cl(px+Math.cos(b)*14,22,578))} ${fmt(cl(py+Math.sin(b)*14,52,338))}`)}}
   paths.push(d)}
  let a=Math.PI/2+(r()-.5)*.5,px=x,py=y,ax=`M${fmt(px)} ${fmt(py)}`;
  for(let j=0;j<6;j++){a+=(r()-.5)*.5;px=cl(px+Math.cos(a)*15,22,578);py=cl(py+Math.sin(a)*15,52,338);ax+=`L${fmt(px)} ${fmt(py)}`}
  cells.push({x,y,d:paths.join(''),ax,rank:0})}
 shuffled(range(cells.length),4409).forEach((ci,k)=>{cells[ci].rank=k});
 return B1_FIELD=cells;
}
const B1_STAIN=[1,3,5,10,30,100];
SCENE({id:'neuron-doctrine',name:'Golgi’s black reaction',tag:'A stain that picks a few cells',
 definition:'Brain tissue is so densely packed that an ordinary stain shows only a tangle. In 1873 Camillo Golgi found that hardening tissue in potassium dichromate and then soaking it in silver nitrate blackens only a few cells in a hundred, but blackens each of those completely, to its finest branches.',
 example:'Stain everything and no single cell can be followed. Stain about one cell in fifty and each one stands out whole against a clear background. Why the method picks the cells it does is still not fully understood.',
 desc:'A slice of tissue containing 72 schematic nerve cells. A slider sets the share that take up the stain: a few cells appear whole, or all of them merge into a tangle.',
 research:['Golgi (1873). Sulla struttura della sostanza grigia del cervello. Gazzetta Medica Italiana, Lombardia 33, 244–246.','Pannese (1999). The Golgi stain: invention, diffusion and impact on neurosciences. Journal of the History of the Neurosciences 8, 132–140.'],
 dur:10,hint:'Slide the share of cells that take up the stain. Find the setting where you could follow one cell from end to end.',
 init:()=>({k:1}),
 watch(p){return {k:Math.min(5,Math.floor(p*6))}},
 ui:[{range:'k',label:'Cells stained',min:0,max:5,get:s=>s.k,act:'k',show:v=>B1_STAIN[v]+'%'}],
 on:{k(s,v){s.k=+v}},
 draw(s){
  const cells=B1_field(),pct=B1_STAIN[s.k],n=Math.max(1,Math.round(cells.length*pct/100));
  let out=heading(`${n} of ${cells.length} cells stained (${pct}%)`);
  out+=R(16,46,568,298,'#fbf6ea',C.line,8);
  let pale='',dark='';
  for(const c of cells){if(c.rank<n)dark+=P(c.d,C.ink,1.5)+P(c.ax,C.ink,.9)+Ci(c.x,c.y,5,C.ink);else pale+=Ci(c.x,c.y,4.5,'#f1e8d2','#e3d6b8')}
  out+=pale+dark;
  out+=TF(300,364,pct<=5?'Each stained cell can be followed whole: cell body, branching dendrites, one thin axon.':pct<=10?'Still readable, but neighbours begin to cross.':'Too many: branches cross everywhere and no cell can be followed.',13,pct<=10?C.ink:C.coral);
  return {svg:out,phase:pct<=5?`At ${pct}% the stain behaves as Golgi’s does: a handful of cells, each black to its tips, in tissue that otherwise looks empty. For the first time whole nerve cells could be drawn.`:pct<=10?'More cells mean more information and more confusion. Cajal improved his odds by using young animals, whose cells are smaller and less tangled.':'With every cell stained the slice is an unreadable thicket, which is what earlier stains gave. The method’s value is in what it leaves out.'};
 }});

// Six terminal branches of one stained axon, each ending close to another cell.
const B1_TERM=[
 {d:'M300 190 C330 150 360 120 396 104',end:[396,104],to:[404,98]},
 {d:'M300 190 C340 170 380 150 414 142',end:[414,142],to:[423,139]},
 {d:'M300 190 C350 185 400 170 447 150',end:[447,150],to:[455,145]},
 {d:'M300 190 C340 215 380 240 410 250',end:[410,250],to:[419,254]},
 {d:'M300 190 C335 240 370 275 398 292',end:[398,292],to:[406,298]},
 {d:'M300 190 C350 205 410 235 452 262',end:[452,262],to:[460,267]}];
SCENE({id:'neuron-doctrine-trace',name:'Do the fibres join or end?',tag:'Cajal against the net',
 definition:'Golgi believed the fine branches of axons fused into one continuous net, the reticular theory. From 1888 Santiago Ramón y Cajal, using Golgi’s own stain, followed fibre after fibre and found that each ended freely, close to another cell but not joined to it. In 1891 Wilhelm Waldeyer named the separate cell the neuron.',
 example:'Golgi and Cajal shared the Nobel Prize in 1906, and Golgi used his lecture to defend the net. Cajal’s case rested on several lines of evidence: free endings in stained tissue, fibres growing out from single cells in embryos (His, 1886), and damage that stops at the limits of the injured cell (Forel, 1887).',
 desc:'One stained cell whose axon divides into six branches that run towards two other cells. Each branch can be followed to its end, drawn either as Cajal saw it, ending freely, or as Golgi believed, fused into a net.',
 research:['Ramón y Cajal (1888). Estructura de los centros nerviosos de las aves. Revista Trimestral de Histología Normal y Patológica 1, 1–10.','Waldeyer (1891). Ueber einige neuere Forschungen im Gebiete der Anatomie des Centralnervensystems. Deutsche Medicinische Wochenschrift 17.','Golgi (1906) and Ramón y Cajal (1906). Nobel Lectures, Physiology or Medicine.','Mind In Motion, “Neuron doctrine”, covers the basic idea.'],
 dur:12,hint:'Press each branch of the axon to follow it to its end, and count how many end freely and how many fuse. Then switch to the picture Golgi believed in.',
 init:()=>({seen:[0,0,0,0,0,0],view:'cajal'}),
 watch(p){const n=Math.min(6,Math.floor(p*8));return {seen:range(6).map(i=>i<n?1:0),view:p>.86?'golgi':'cajal'}},
 ui:[{choose:[['cajal','What the stain shows'],['golgi','Golgi’s net']],label:'Picture',get:s=>s.view,act:'view'}],
 on:{view(s,v){s.view=v},follow(s,v){s.seen[+v]=1;s.view='cajal'}},
 draw(s,f,X){
  const n=sum(s.seen),golgi=s.view==='golgi';
  let out=heading(golgi?'Golgi’s reading: the branches fuse into a net':n?`${n} of 6 followed: ${n} end freely, 0 fuse`:'Follow each branch to its end');
  // cell A
  out+=P('M110 190 C80 160 60 150 40 120M110 190 C80 200 60 215 36 240M110 190 C96 150 100 120 92 96M110 190 C100 230 104 260 90 292M72 157 C60 170 50 172 34 176M96 150 C84 138 80 124 66 112',C.ink,2.6)+Ci(110,190,12,C.ink)+P('M120 190 C180 186 240 194 300 190',C.ink,1.8);
  out+=TF(136,226,'cell A',13,C.muted)+TF(210,178,'its axon',13,C.muted);
  // cells B and C
  const cellB='M470 110 C450 104 430 100 404 98M470 110 C455 125 440 135 423 139M470 110 C465 128 462 138 455 145M470 110 C490 90 510 80 540 70M470 110 C500 115 520 120 550 118',cellC='M470 290 C450 272 436 262 419 254M470 290 C450 294 430 298 406 298M470 290 C468 280 464 272 460 267M470 290 C495 300 520 310 548 318M470 290 C500 280 524 270 552 262';
  out+=P(cellB,'#51626d',2.4)+Ci(470,110,11,'#51626d')+P(cellC,'#51626d',2.4)+Ci(470,290,11,'#51626d')+TF(512,140,'cell B',13,C.muted)+TF(512,338,'cell C',13,C.muted);
  B1_TERM.forEach((t,i)=>{const on=s.seen[i]&&!golgi;
   const inner=P(t.d,'#000',16,'none','opacity="0"')+P(t.d,golgi?C.purple:on?C.coral:C.ink,on?2.6:1.8)+(golgi?L(t.end[0],t.end[1],t.to[0],t.to[1],C.purple,2):Ci(t.end[0],t.end[1],on?4.5:3,on?C.coral:C.ink))+(on?Ci(t.end[0]+4,t.end[1]-2,11,'none',C.coral):'');
   out+=hit(X,'follow',i,`Axon branch ${i+1}${s.seen[i]?': followed, ends freely':': press to follow it'}`,inner)});
  if(golgi)out+=P('M396 104 C404 120 408 130 414 142M414 142 C426 146 436 148 447 150M410 250 C404 266 400 280 398 292M410 250 C426 256 440 260 452 262M414 142 C412 180 410 215 410 250',C.purple,1.6,'none','stroke-dasharray="5 4"');
  out+=B1_panel(30,298,364,74);
  out+=B1_wrap(42,319,golgi?'Golgi drew the fine branches running into one another, so that the whole grey matter worked as a single web. The same slides could be read this way.':n===6?'Every branch ends in a small swelling next to a dendrite or cell body. Contact, Cajal argued, not continuity.':n?'Ringed endings stop short of the next cell. Keep going: is there any branch that fuses?':'Each branch is a target. In the stain, a fibre is black right to where it stops.',50,13,golgi?C.purple:C.ink).svg;
  return {svg:out,phase:golgi?'On Golgi’s reading, signals spread through a continuous net and individual cells matter little. The dashed links are what he believed was there; nobody could see them.':n===6?'Six out of six end freely. Neither man could see the space between an ending and the next cell, because it is far smaller than a light microscope can show. Cajal’s case was an inference from many preparations, and it was right.':'A stained fibre can be followed until the black stops. The question is what the stopping means: an end, or a join too fine to stain?'};
 }});

// Two membranes a fixed distance apart, viewed with a given resolution (nm): the blurred image is the sum of two Gaussians.
const B1_RES=[500,200,100,50,20,10,5,2];
const B1_blur=(x,gap,res)=>{const sg=res/2.355;return Math.exp(-Math.pow(x-gap/2,2)/(2*sg*sg))+Math.exp(-Math.pow(x+gap/2,2)/(2*sg*sg))};
function B1_resolved(gap,res){let mx=0;for(let x=0;x<=gap;x+=gap/200)mx=Math.max(mx,B1_blur(x,gap,res));return B1_blur(0,gap,res)<.8*mx}
SCENE({id:'neuron-doctrine-gap',name:'A gap too small to see',tag:'Settled by the electron microscope',
 definition:'At a chemical synapse the two cells are separated by a cleft about 20 nanometres wide. No light microscope can separate details closer than about 200 nanometres, so the question could not be settled by looking until electron microscopes showed the cleft in the 1950s.',
 example:'Golgi was not wholly wrong. At electrical synapses the membranes come within about 3.5 nm and are bridged by channels, gap junctions, that let current pass directly from cell to cell. They are real, and much rarer in the adult mammalian brain than chemical synapses.',
 desc:'Two cell membranes seen edge on, blurred by the chosen resolution, with the brightness profile across them. They separate into two lines only when the resolution is finer than the gap.',
 research:['Abbe (1873) on the resolution limit of the light microscope, about half the wavelength of light.','De Robertis & Bennett (1955). Some features of the submicroscopic morphology of synapses in frog and earthworm. Journal of Biophysical and Biochemical Cytology 1, 47–58.','Palay (1956). Synapses in the central nervous system. Same journal 2 (suppl.), 193–202.','Furshpan & Potter (1959). Transmission at the giant motor synapses of the crayfish. Journal of Physiology 145, 289–325.'],
 dur:10,hint:'Sharpen the microscope’s resolution step by step and watch for the moment one dark band becomes two. Then try the much narrower gap junction.',
 init:()=>({k:1,kind:'chem'}),
 watch(p){return {k:Math.min(7,Math.floor(p*8.5)),kind:'chem'}},
 ui:[{range:'k',label:'Resolution',min:0,max:7,get:s=>s.k,act:'k',show:v=>B1_RES[v]+' nm'},{choose:[['chem','Chemical synapse'],['gap','Gap junction']],label:'Contact',get:s=>s.kind,act:'kind'}],
 on:{k(s,v){s.k=+v},kind(s,v){s.kind=v}},
 draw(s){
  const res=B1_RES[s.k],gap=s.kind==='chem'?20:3.5,half=s.kind==='chem'?80:14,ok=B1_resolved(gap,res),light=res>=200;
  let out=heading(ok?`At ${res} nm the two membranes separate`:`At ${res} nm the two cells look joined`);
  // image strip
  const x0=60,w=480,y0=62,h=96,N=96;let mx=0;const vals=[];
  for(let i=0;i<N;i++){const x=-half+(i+.5)/N*2*half,v=B1_blur(x,gap,res);vals.push(v);mx=Math.max(mx,v)}
  out+=R(x0,y0,w,h,'#f4efe6',C.line,4);
  vals.forEach((v,i)=>{const o=v/mx;if(o>.02)out+=`<rect x="${fmt(x0+i*w/N)}" y="${y0+1}" width="${fmt(w/N+.6)}" height="${h-2}" fill="${C.ink}" opacity="${fmt(o*.92)}"/>`});
  out+=TF(x0+6,y0+h+16,'cell 1',13,C.muted,'start')+TF(x0+w-6,y0+h+16,'cell 2',13,C.muted,'end')+TF(300,y0+h+16,'the image',13,C.muted);
  // profile
  const pl=B1_plot(x0,196,w,104,[-half,half],[0,1.1],{xt:[[-half,'−'+half],[-gap/2,''],[gap/2,''],[half,half+' nm']],yl:'darkness across the contact'});out+=pl.svg;
  const pts=[];for(let i=0;i<=240;i++){const x=-half+i/240*2*half;pts.push([pl.X(x),pl.Y(B1_blur(x,gap,res)/mx)])}out+=B1_poly(pts,C.blue,2.6);
  out+=L(pl.X(-gap/2),196,pl.X(-gap/2),300,C.coral,1.2,'stroke-dasharray="3 4"')+L(pl.X(gap/2),196,pl.X(gap/2),300,C.coral,1.2,'stroke-dasharray="3 4"');
  out+=TF(300,318,`true gap: ${fmt(gap)} nm`,13,C.coral);
  out+=TB(300,344,light?'Light microscope (best possible: about 200 nm)':res>=50?'Finer than any light microscope can reach':'Electron microscope, from the 1950s',14,light?C.amber:res>=50?C.muted:C.green);
  out+=TF(300,364,s.kind==='chem'?'Chemical synapse: a 20 nm cleft, crossed by transmitter molecules.':'Gap junction: 3.5 nm, bridged by channels that join the two cells’ interiors.',13,C.muted);
  return {svg:out,phase:ok?(s.kind==='chem'?`With ${res} nm resolution there are two membranes with a clear space between them. The cells are separate, as Cajal said, and something must carry the signal across: the subject of the next era.`:'Even here the membranes are two, but channels cross the narrow gap and current flows straight through. This is the grain of truth in Golgi’s net.'):light?`At ${res} nm the contact is one dark smudge about ${res} nm wide. A join and a ${fmt(gap)} nm gap would look exactly the same, which is why the argument lasted half a century.`:`Still one band: the blur is wider than the ${fmt(gap)} nm gap. Sharpen further.`};
 }});

// Three-dimensional cell shapes as line segments {a,b,w,part}. Built once per kind from a fixed seed.
const B1_SHAPE={};
function B1_shape(kind){
 if(B1_SHAPE[kind])return B1_SHAPE[kind];const r=rng(kind==='pyr'?311:kind==='purk'?977:55),segs=[];
 const add=(a,b,w,part)=>segs.push({a,b,w,part});
 function grow(p,dir,len,depth,flat,part,w){
  const n=Math.hypot(dir[0],dir[1],dir[2])||1,q=[p[0]+dir[0]/n*len,p[1]+dir[1]/n*len*(flat?.05:1),p[2]+dir[2]/n*len];add(p,q,w,part);
  if(depth<=0)return;
  for(const sgn of [-1,1]){const j=()=>(r()-.5)*.7;grow(q,[dir[0]/n+sgn*(.55+j()*.4),flat?0:dir[1]/n+j()*1.2,dir[2]/n+j()*.5+.1*(part==='dend'&&dir[2]>0?1:0)],len*.78,depth-1,flat,part,Math.max(1,w*.72))}
 }
 if(kind==='pyr'){
  let p=[0,0,.25];for(let i=0;i<4;i++){const q=[p[0]+(r()-.5)*.1,p[1]+(r()-.5)*.1,p[2]+.7];add(p,q,3.4-i*.5,'dend');if(i>0)grow(q,[(i%2?1:-1),(r()-.5)*2,.35],.55,1,false,'dend',1.6);p=q}
  for(const sgn of [-1,1])grow(p,[sgn*.8,(r()-.5)*1.6,.8],.5,2,false,'dend',1.8);
  for(let k=0;k<5;k++){const a=k/5*2*Math.PI+.3;grow([0,0,-.1],[Math.cos(a),Math.sin(a),-.35],.6,2,false,'dend',2)}
  add([0,0,-.25],[0,0,-2.9],1.3,'axon');add([0,0,-1.2],[.9,.5,-1.5],1,'axon');add([0,0,-1.9],[-.8,-.6,-2.2],1,'axon');
 }else if(kind==='purk'){
  add([0,0,.25],[0,0,.75],3.6,'dend');for(const sgn of [-1,1])grow([0,0,.75],[sgn*.75,0,.8],.82,5,true,'dend',3);
  add([0,0,-.25],[.1,0,-2.9],1.3,'axon');add([.05,0,-1.4],[.7,.3,-1.7],1,'axon');
 }else{
  add([0,0,.2],[0,0,1.3],2.2,'dend');for(const sgn of [-1,1])grow([0,0,1.3],[sgn*.7,(r()-.5),.7],.4,2,false,'dend',1.4);
  add([0,0,-.2],[0,0,-1.6],1.4,'axon');for(const sgn of [-1,1])grow([0,0,-1.6],[sgn*.7,(r()-.5),-.7],.35,1,false,'axon',1.1);
 }
 return B1_SHAPE[kind]=segs;
}
const B1_KIND={
 pyr:{label:'Pyramidal cell',where:'cerebral cortex',note:'A tall apical dendrite, a skirt of basal dendrites and an axon leaving downwards. Thousands of synapses each.'},
 purk:{label:'Purkinje cell',where:'cerebellum',note:'A huge dendritic fan, almost flat, with in the order of 100,000 synapses. Turn the 3D view to see it edge on.'},
 bip:{label:'Bipolar cell',where:'retina',note:'One short dendrite, one short axon. It passes signals from photoreceptors towards ganglion cells.'}};
const B1_PART={
 dend:{label:'Dendrites',text:'Branches that receive signals from other cells, at thousands of contacts.'},
 soma:{label:'Cell body',text:'Holds the nucleus and adds up what the dendrites deliver.'},
 axon:{label:'Axon',text:'One thin fibre that carries the cell’s output away, sometimes for a metre.'},
 term:{label:'Endings',text:'The axon’s tips, where the signal is handed on to the next cells.'}};
const B1_PARTS=['dend','soma','axon','term'];
SCENE({id:'neuron-doctrine-shape',name:'One cell, one direction',tag:'Dendrites in, axon out',
 definition:'Cajal drew hundreds of kinds of neuron and saw one plan in all of them: branching dendrites and a cell body that receive, and a single axon that sends. In 1891 he and Arthur van Gehuchten proposed the law of dynamic polarisation: signals travel from the dendrites, through the cell body, and out along the axon.',
 example:'He read the direction of flow from anatomy alone. In the retina, light-sensitive cells point their endings at the dendrites of bipolar cells, whose axons point at the cells that form the optic nerve. Later recordings confirmed the rule, with exceptions: some dendrites also release transmitter, and spikes can spread back into them.',
 desc:'A neuron drawn from the front with its dendrites, cell body, axon and endings as press targets and arrows showing the direction of signalling; in 3D, the same cell can be turned, which shows that a Purkinje cell’s dendrites lie in one flat plane.',
 research:['Ramón y Cajal (1891). Significación fisiológica de las expansiones protoplásmicas y nerviosas de las células de la sustancia gris. Revista de Ciencias Médicas de Barcelona 22.','Ramón y Cajal (1899–1904). Textura del sistema nervioso del hombre y de los vertebrados. Madrid: Moya.','Shepherd (1991). Foundations of the Neuron Doctrine. Oxford University Press.'],
 dur:12,hint:'Choose a cell type and press a part of the cell to read what it does. Switch to 3D and turn the cell: compare the bushy pyramidal cell with the flat Purkinje cell.',
 init:()=>({kind:'pyr',part:'dend'}),
 watch(p){return {kind:p<.5?'pyr':'purk',part:B1_PARTS[Math.min(3,Math.floor(((p*2)%1)*4))]}},
 ui:[{choose:[['pyr','Pyramidal'],['purk','Purkinje'],['bip','Bipolar']],label:'Cell type',get:s=>s.kind,act:'kind'}],
 on:{kind(s,v){s.kind=v},part(s,v){s.part=v}},
 draw(s,f,X){
  const K=B1_KIND[s.kind],segs=B1_shape(s.kind);
  let out=heading(`${K.label} (${K.where}): signals run one way`);
  const cx=170,cy=206,sc=44,px=p=>[cx+p[0]*sc,cy-p[2]*sc];
  const colOf=part=>part==='dend'?(s.part==='dend'?C.blue:'#7fa6c4'):(s.part==='axon'||s.part==='term'?C.coral:'#d79a8a');
  for(const g of segs){const a=px(g.a),b=px(g.b);out+=L(a[0],a[1],b[0],b[1],colOf(g.part),g.w)}
  out+=Ci(cx,cy,s.kind==='bip'?9:12,s.part==='soma'?C.ink:'#51626d');
  const ends=segs.filter(g=>g.part==='axon').map(g=>px(g.b)).filter(p=>p[1]>cy+50);
  for(const e of ends)out+=Ci(e[0],e[1],s.part==='term'?5:3.5,C.coral);
  out+=arrow(52,84,52,150,C.blue,2.5)+TF(52,74,'in',13,C.blue)+arrow(52,250,52,316,C.coral,2.5)+TF(52,338,'out',13,C.coral);
  // parts list
  out+=TB(352,70,'Parts of the cell',14,C.ink,'start');
  B1_PARTS.forEach((k,i)=>{const on=s.part===k,y=82+i*34,col=k==='dend'?C.blue:k==='soma'?C.ink:C.coral;
   out+=hit(X,'part',k,`${B1_PART[k].label}${on?' (selected)':''}`,R(350,y,226,28,on?C.pale:'#f6f9fb',on?C.blue:C.grid,7)+Ci(366,y+14,5,col)+TF(380,y+19,B1_PART[k].label,13,C.ink,'start'))});
  out+=B1_panel(350,218,226,154)+B1_wrap(362,240,B1_PART[s.part].text,30,13,C.ink).svg;
  out+=B1_wrap(362,300,K.note,30,13,C.muted,16).svg;
  return {svg:out,phase:`${B1_PART[s.part].label}: ${B1_PART[s.part].text} Cajal’s rule let anatomists read a circuit’s direction from a stained slice, decades before anyone could record from single cells.`};
 },
 three(s,f,X,project){
  const segs=B1_shape(s.kind),Pr=project(segs.flatMap(g=>[g.a,g.b]).concat([[0,-1,0],[0,1,0]])),items=[];
  for(const g of segs){const mid=[(g.a[0]+g.b[0])/2,(g.a[1]+g.b[1])/2,(g.a[2]+g.b[2])/2],col=g.part==='dend'?C.blue:C.coral;items.push({at:mid,svg:Q=>{const a=Q(g.a),b=Q(g.b);return L(a[0],a[1],b[0],b[1],col,g.w)}})}
  items.push({at:[0,0,0],svg:Q=>{const c=Q([0,0,0]);return Ci(c[0],c[1],s.kind==='bip'?8:11,C.dark)}});
  let out=sortedItems(items,Pr);
  out+=TF(70,30,'dendrites: blue',13,C.blue,'start')+TF(70,48,'axon: orange',13,C.coral,'start');
  return {svg:out,title:`${B1_KIND[s.kind].label} in three dimensions`,caption:s.kind==='purk'?'A Purkinje cell’s dendrites spread in a single plane. Edge on, the whole fan is a thin line, and thousands of parallel fibres cross it at right angles.':s.kind==='pyr'?'A pyramidal cell fills a volume: the apical dendrite rises towards the surface of the cortex and the basal dendrites spread all round the cell body.':'A bipolar cell is a short relay: dendrite on one side, axon on the other.'};
 }});

/* ===================== Lesson: resting-potential ===================== */
const B1_DOTS=(()=>{const r=rng(8123);return range(70).map(()=>[r(),r()])})();
SCENE({id:'resting-potential',name:'Nernst’s balance',tag:'One ion, one voltage',
 definition:'If a membrane lets one kind of ion through and that ion is more concentrated on one side, a few ions cross and leave their charge behind. The voltage this builds opposes further flow. The Nernst equation (1888–89) gives the voltage at which the two exactly balance: E = (RT/zF) × ln(outside ÷ inside).',
 example:'With 5 mM potassium outside and 140 mM inside at 37 °C, E = 26.7 mV × ln(5/140) = −89 mV: the inside must be 89 mV negative to hold the potassium in. A tenfold concentration ratio is worth about 61.5 mV for an ion with one charge.',
 desc:'A cell membrane with one open channel type between an inside and an outside compartment holding ions at the chosen concentrations, opposing arrows for diffusion and voltage, and a meter showing the equilibrium potential.',
 research:['Nernst (1888). Zur Kinetik der in Lösung befindlichen Körper. Zeitschrift für physikalische Chemie 2, 613–637.','Nernst (1889). Die elektromotorische Wirksamkeit der Ionen. Zeitschrift für physikalische Chemie 4, 129–181.','Hille (2001). Ion Channels of Excitable Membranes, 3rd ed. Sinauer (concentrations for a typical mammalian cell).'],
 dur:10,hint:'Choose an ion, then change its concentration inside and outside, or the temperature, and read the equilibrium potential. Try making the two sides equal.',
 init:()=>({ion:'K',out:5,inn:140,temp:37}),
 watch(p){const k=p<.5?'K':p<.75?'Na':'Cl',I=B1_ION[k];return {ion:k,out:k==='K'?Math.round(lerp(5,50,smooth(clamp((p-.15)/.3,0,1)))):I.out,inn:I.inn,temp:37}},
 ui:[{choose:[['K','Potassium'],['Na','Sodium'],['Cl','Chloride']],label:'Ion',get:s=>s.ion,act:'ion'},
  {range:'out',label:'Outside',min:1,max:200,get:s=>s.out,act:'out',show:v=>v+' mM'},{range:'inn',label:'Inside',min:1,max:200,get:s=>s.inn,act:'inn',show:v=>v+' mM'},
  {range:'temp',label:'Temperature',min:0,max:40,get:s=>s.temp,act:'temp',show:v=>v+' °C'}],
 on:{ion(s,v){s.ion=v;s.out=B1_ION[v].out;s.inn=B1_ION[v].inn},out(s,v){s.out=+v},inn(s,v){s.inn=+v},temp(s,v){s.temp=+v}},
 draw(s){
  const I=B1_ION[s.ion],E=B1_nernst(s.out,s.inn,I.z,s.temp),rtf=B1_RTF(s.temp);
  let out=heading(`Equilibrium potential for ${I.sym}: ${B1_mV(E,0)}`);
  const bx=40,bw=190,by=62,bh=176;
  out+=R(bx,by,bw,bh,'#f3f7fa',C.line,8)+R(bx+bw+22,by,bw,bh,'#f3f7fa',C.line,8)+R(bx+bw,by,22,bh,C.amberp,C.amber,2)+R(bx+bw-1,by+74,24,28,'#fff','none',0);
  out+=TB(bx+bw/2,by-8,'inside the cell',14,C.ink)+TB(bx+bw+22+bw/2,by-8,'outside',14,C.ink)+TF(bx+bw+11,by+bh+36,'membrane',13,C.amber);
  const dots=(c,x)=>{let o='';const n=clamp(Math.round(c/200*70),1,70);for(let i=0;i<n;i++)o+=Ci(x+10+B1_DOTS[i][0]*(bw-20),by+10+B1_DOTS[i][1]*(bh-20),4,I.col);return o};
  out+=dots(s.inn,bx)+dots(s.out,bx+bw+22);
  out+=TB(bx+bw/2,by+bh+18,s.inn+' mM',14,I.col)+TB(bx+bw+22+bw/2+24,by+bh+18,s.out+' mM',14,I.col);
  // forces
  const outward=s.inn>s.out,same=s.inn===s.out,ya=286;
  if(!same){const x1=outward?150:330,x2=outward?330:150;out+=arrow(x1,ya,x2,ya,C.blue,3)+TF(240,ya-8,`diffusion pushes ${I.sym} ${outward?'out':'in'}`,13,C.blue);
   out+=arrow(x2,ya+30,x1,ya+30,C.coral,3)+TF(240,ya+50,`at ${B1_mV(E,0)} the voltage pushes it back equally`,13,C.coral)}
  else out+=TF(240,ya+10,'Equal concentrations: no net push either way.',13,C.muted);
  // meter
  const mx=540,my0=70,my1=300,Y=v=>my1-(v+150)/300*(my1-my0);
  out+=L(mx,my0,mx,my1,C.line,3);for(const v of [-150,-100,-50,0,50,100,150])out+=L(mx-6,Y(v),mx,Y(v),C.muted,1.4)+TF(mx-10,Y(v)+4,v===0?'0':B1_sg(v,0),13,C.muted,'end');
  out+=`<polygon points="${mx+4},${fmt(Y(clamp(E,-150,150)))} ${mx+20},${fmt(Y(clamp(E,-150,150))-8)} ${mx+20},${fmt(Y(clamp(E,-150,150))+8)}" fill="${C.coral}"/>`+TF(mx+8,my0-12,'mV',13,C.muted)+TF(mx+8,my1+18,'inside',13,C.muted);
  out+=TMF(300,356,`E = ${fmt(B1_r1(rtf/I.z))} mV × ln(${s.out}/${s.inn}) = ${B1_mV(E)}`,14,C.ink);
  return {svg:out,phase:same?'With the same concentration on both sides there is nothing to balance, so the equilibrium potential is zero whatever the temperature.':`${I.name[0].toUpperCase()+I.name.slice(1)} is ${outward?'more concentrated inside, so it tends to leak out':'more concentrated outside, so it tends to leak in'}${I.z<0?', carrying negative charge':', carrying positive charge'}. The flow stops when the inside reaches ${B1_mV(E,0)}. Only a tiny fraction of the ions has to move to set up this voltage, so the concentrations hardly change.`};
 }});

// Frog muscle at about 20 °C (Hodgkin & Horowicz 1959): V = 58 log10((K_o + 0.01 Na_o)/140), with Na_o = 120 mM.
const B1_KS=[0.5,1,2.5,5,10,20,50,100];
const B1_hhz=k=>58*Math.log10((k+.01*120)/140),B1_nk=k=>58*Math.log10(k/140);
const B1_BERN_WATCH=[[2.5,71],[10,402],[50,933],[100,128],[1,655],[0.5,276]];
SCENE({id:'resting-potential-bernstein',name:'Bernstein’s membrane hypothesis',tag:'A potassium battery, tested',
 definition:'In 1902 Julius Bernstein applied Nernst’s equation to living cells. He proposed that the resting membrane lets potassium through and little else, so the resting potential is a potassium equilibrium potential. The test is to change the potassium outside the cell and see whether the voltage follows Nernst’s line.',
 example:'In frog muscle the voltage follows the line closely above about 10 mM: 58 mV for each tenfold change at 20 °C. At lower, normal concentrations it is less negative than predicted, because the membrane also lets a little sodium through, about 1% as easily as potassium.',
 desc:'A plot of resting potential against the potassium concentration outside a frog muscle fibre on a logarithmic axis, with Nernst’s straight line, the published curve and the learner’s simulated measurements.',
 research:['Bernstein (1902). Untersuchungen zur Thermodynamik der bioelektrischen Ströme. Pflügers Archiv 92, 521–562.','Hodgkin & Horowicz (1959). The influence of potassium and chloride ions on the membrane potential of single muscle fibres. Journal of Physiology 148, 127–160.','Seyfarth (2006). Julius Bernstein (1839–1917): pioneer neurobiologist and biophysicist. Biological Cybernetics 94, 2–8.'],
 dur:12,hint:'Set the potassium concentration in the bathing solution and press Measure. Collect points across the range and see where they leave Nernst’s line. Measurements are simulated.',
 init:()=>({k:2,pts:[]}),
 watch(p){const n=Math.min(6,1+Math.floor(p*6.5)),pts=B1_BERN_WATCH.slice(0,n).map(([k,seed])=>({k,v:B1_hhz(k)+B1_gauss(rng(seed),1.2)}));return {k:B1_KS.indexOf(pts[pts.length-1].k),pts}},
 ui:[{range:'k',label:'Potassium outside',min:0,max:7,get:s=>s.k,act:'k',show:v=>B1_KS[v]+' mM'},{b:'Measure',act:'measure'},{b:'Clear',act:'clear'}],
 on:{k(s,v){s.k=+v},measure(s){const k=B1_KS[s.k];s.pts=s.pts.filter(q=>q.k!==k);s.pts.push({k,v:B1_hhz(k)+B1_gauss(rng(nextSeed()),1.2)})},clear(s){s.pts=[]}},
 draw(s){
  const k=B1_KS[s.k],last=s.pts.length?s.pts[s.pts.length-1]:null;
  let out=heading(last?`${fmt(last.k)} mM outside: ${B1_mV(last.v,0)} measured`:'Change the potassium outside and measure');
  const pl=B1_plot(84,56,300,262,[.3,150],[-150,10],{logx:true,xt:[[.5,'0.5'],[2.5,'2.5'],[10,'10'],[50,'50'],[100,'100']],yt:[[-150,'−150'],[-100,'−100'],[-50,'−50'],[0,'0']],xl:'potassium outside, mM (log scale)',yl:'resting potential, mV',ylDx:40});out+=pl.svg;
  out+=L(pl.X(.3),pl.Y(B1_nk(.3)),pl.X(150),pl.Y(B1_nk(150)),C.purple,1.8,'stroke-dasharray="6 5"');
  const pts=[];for(let i=0;i<=60;i++){const kk=.3*Math.pow(500,i/60);pts.push([pl.X(kk),pl.Y(B1_hhz(kk))])}out+=B1_poly(pts,C.blue,2.4);
  out+=L(pl.X(k),56,pl.X(k),318,C.amber,1.2,'stroke-dasharray="3 4"');
  for(const q of s.pts)out+=Ci(pl.X(q.k),pl.Y(q.v),5,C.coral,'#fff');
  out+=L(404,76,430,76,C.purple,1.8,'stroke-dasharray="6 5"')+B1_wrap(438,80,'Nernst for potassium alone (Bernstein)',20,13,C.purple).svg;
  out+=L(404,124,430,124,C.blue,2.4)+B1_wrap(438,128,'published fit, with a 1% sodium leak',20,13,C.blue).svg;
  out+=Ci(417,172,5,C.coral,'#fff')+TF(438,176,'your measurements',13,C.coral,'start');
  out+=B1_panel(400,196,186,122);
  out+=B1_wrap(412,218,last?`Nernst predicts ${B1_mV(B1_nk(last.k),0)} here. The difference is ${fmt(Math.round(Math.abs(last.v-B1_nk(last.k))))} mV.`:'Normal frog fluid has about 2.5 mM potassium.',24,13,C.ink).svg;
  out+=B1_wrap(412,278,last&&last.k<10?'Low potassium: the small sodium leak shows.':last?'High potassium: the line holds.':'',24,13,C.muted).svg;
  out+=TF(300,366,'Frog muscle fibre at about 20 °C; 140 mM potassium inside.',13,C.muted);
  return {svg:out,phase:s.pts.length<3?'Bernstein’s idea makes a sharp prediction: the resting potential should move 58 mV for each tenfold change in outside potassium. Measure at several concentrations.':'At high potassium the points sit on Nernst’s line, so Bernstein was right that potassium dominates. At low potassium they bend away from it: the membrane is not perfectly selective. Bernstein also guessed that during an impulse the membrane lets everything through and the voltage falls to zero. That part was wrong, as the next lesson shows.'};
 }});

const B1_EK=B1_nernst(5,140,1),B1_ENA=B1_nernst(145,15,1),B1_ECL=B1_nernst(110,10,-1);
SCENE({id:'resting-potential-ghk',name:'Several ions at once',tag:'The Goldman–Hodgkin–Katz equation',
 definition:'A real membrane lets through potassium, sodium and chloride, each pulling the voltage towards its own equilibrium potential. The Goldman–Hodgkin–Katz equation weights each ion’s concentrations by how easily the membrane lets it pass. The most permeant ion wins most of the argument.',
 example:'For the squid axon Hodgkin and Katz fitted permeabilities of 1 : 0.04 : 0.45 for potassium, sodium and chloride at rest, and 1 : 20 : 0.45 at the peak of the impulse. With the concentrations of a mammalian neuron those ratios give about −67 mV and +48 mV.',
 desc:'A voltage scale marked with the equilibrium potentials of potassium, chloride and sodium and a pointer for the membrane potential, beside bars for the three permeabilities and the equation with its numbers filled in.',
 research:['Goldman (1943). Potential, impedance, and rectification in membranes. Journal of General Physiology 27, 37–60.','Hodgkin & Katz (1949). The effect of sodium ions on the electrical activity of the giant axon of the squid. Journal of Physiology 108, 37–77.'],
 dur:10,hint:'Slide the sodium permeability from a hundredth of potassium’s to twenty times it, and watch the membrane potential travel between the potassium and sodium equilibrium potentials.',
 init:()=>({r:-14,cl:1}),
 watch(p){return {r:Math.round(lerp(-20,13,smooth(p))),cl:1}},
 ui:[{range:'r',label:'Sodium permeability',min:-20,max:15,get:s=>s.r,act:'r',show:v=>fmt(Math.round(Math.pow(10,v/10)*100)/100)+' × potassium’s'},{b:'At rest',act:'rest'},{b:'Spike peak',act:'peak'},
  {choose:[[1,'With chloride'],[0,'Without']],label:'Chloride',get:s=>s.cl,act:'cl'}],
 on:{r(s,v){s.r=+v},rest(s){s.r=-14},peak(s){s.r=13},cl(s,v){s.cl=+v}},
 draw(s){
  const pNa=Math.round(Math.pow(10,s.r/10)*100)/100,pCl=s.cl?.45:0,V=B1_ghk(pNa,pCl);
  let out=heading(`Membrane potential ${B1_mV(V,0)}`);
  const ax=150,y0=58,y1=330,Y=v=>y1-(v+100)/180*(y1-y0);
  out+=L(ax,y0,ax,y1,C.line,3);for(const v of [-100,-50,0,50])out+=L(ax-6,Y(v),ax,Y(v),C.muted,1.4)+TF(ax-10,Y(v)+4,v===0?'0 mV':B1_sg(v,0),13,C.muted,'end');
  const mark=(v,lab,col)=>L(ax,Y(v),ax+26,Y(v),col,3)+TF(ax+32,Y(v)+4,lab+' '+B1_sg(v,0),13,col,'start');
  out+=mark(B1_ENA,'E sodium',C.coral)+mark(B1_EK,'E potassium',C.purple)+(s.cl?mark(B1_ECL,'E chloride',C.green):'');
  out+=`<polygon points="${ax-4},${fmt(Y(V))} ${ax-22},${fmt(Y(V)-9)} ${ax-22},${fmt(Y(V)+9)}" fill="${C.ink}"/>`+TB(ax-28,Y(V)+(Math.abs(V)<9||Math.abs(V+50)<9||Math.abs(V-50)<9?-12:5),B1_sg(V,0),15,C.ink,'end');
  // permeability bars (log scale from 0.01 to 20)
  out+=TB(330,76,'Relative permeability',14,C.ink,'start');
  const bar=(y,lab,p,col)=>{const w=p>0?clamp((Math.log10(p)+2)/3.4,0.02,1)*130:0;return TF(330,y+14,lab,13,C.ink,'start')+R(410,y,130,18,'#f1f5f8','none',4)+(p>0?R(410,y,w,18,col,'none',4):'')+TF(580,y+14,p>0?fmt(p):'0',13,col,'end')};
  out+=bar(98,'potassium',1,C.purple)+bar(140,'sodium',pNa,C.coral)+bar(182,'chloride',pCl,C.green);
  out+=B1_panel(322,218,262,118);
  out+=TF(334,240,'V = 26.7 mV × ln( top ÷ bottom )',13,C.ink,'start');
  out+=TMF(334,264,`top: 5 + ${fmt(pNa)}×145${s.cl?' + 0.45×10':''}`,13,C.ink,'start')+TMF(334,286,`bottom: 140 + ${fmt(pNa)}×15${s.cl?' + 0.45×110':''}`,13,C.ink,'start');
  out+=TB(334,318,`= ${B1_mV(V)}`,15,C.blue,'start');
  out+=TF(300,366,'Concentrations of a typical mammalian neuron at 37 °C; squid permeability ratios. Illustrative.',13,C.muted);
  return {svg:out,phase:pNa<=.1?`With sodium ${fmt(pNa)} times as permeant as potassium the membrane sits at ${B1_mV(V,0)}, a little above the potassium equilibrium potential of ${B1_mV(B1_EK,0)}. This is the resting potential: mostly potassium, with a small sodium leak.`:pNa>=5?`Make sodium ${fmt(pNa)} times more permeant than potassium and the voltage swings to ${B1_mV(V,0)}, close to sodium’s ${B1_mV(B1_ENA,0)}. Nothing about the concentrations changed. That swing, lasting a millisecond, is the action potential.`:`At ${fmt(pNa)} the two ions pull about equally and the voltage sits between their equilibrium potentials, at ${B1_mV(V,0)}.`};
 }});

// Net sodium entry per impulse per unit membrane area, mol/cm² (Keynes 1951; Keynes & Lewis 1951: about 3 to 4 pmol/cm²).
const B1_FLUX=3.5e-12;
// Change in internal concentration (mM) from one impulse in an axon of diameter d (µm): flux × 4/d.
const B1_perSpike=d=>B1_FLUX*4/(d*1e-4)*1e6;
SCENE({id:'resting-potential-pump',name:'The pump that keeps the gradients',tag:'Three sodium out, two potassium in',
 definition:'Every impulse lets a little sodium in and a little potassium out. In 1957 Jens Christian Skou found the enzyme that puts them back: the sodium–potassium pump, which splits one ATP molecule to move three sodium ions out and two potassium ions in. The pump does not make the signals; it keeps the battery charged.',
 example:'A squid giant axon, half a millimetre across, gains about 3.5 picomoles of sodium per square centimetre with each impulse, which changes its internal sodium by about 0.0003 mM. It can fire hundreds of thousands of times with the pump blocked. An axon one thousandth of a millimetre across has 500 times more membrane for its volume and runs down within a few hundred impulses.',
 desc:'A pump in the membrane moving three sodium ions out and two potassium ions in, and bars for the sodium and potassium inside an axon after a chosen number of impulses with the pump working or blocked, with the equilibrium and resting potentials that result.',
 research:['Skou (1957). The influence of some cations on an adenosine triphosphatase from peripheral nerves. Biochimica et Biophysica Acta 23, 394–401 (Nobel Prize in Chemistry 1997).','Keynes (1951). The ionic movements during nervous activity. Journal of Physiology 114, 119–150.','Hodgkin & Keynes (1955). Active transport of cations in giant axons from Sepia and Loligo. Journal of Physiology 128, 28–60.','Attwell & Laughlin (2001). An energy budget for signaling in the grey matter of the brain. Journal of Cerebral Blood Flow & Metabolism 21, 1133–1145.'],
 dur:10,hint:'Block the pump, then raise the number of impulses fired and watch the gradients run down. Compare the giant axon with the thin one.',
 init:()=>({pump:1,d:1,x:8}),
 watch(p){return {pump:p<.2?1:0,d:p<.6?500:1,x:p<.2?8:Math.round(lerp(0,p<.6?24:12,((p-.2)/.4)%1))}},
 ui:[{choose:[[1,'Pump working'],[0,'Pump blocked']],label:'Pump',get:s=>s.pump,act:'pump'},{choose:[[500,'Giant axon, 500 µm'],[1,'Thin axon, 1 µm']],label:'Axon',get:s=>s.d,act:'d'},
  {range:'x',label:'Impulses fired',min:0,max:24,get:s=>s.x,act:'x',show:v=>Math.round(Math.pow(10,v/4)).toLocaleString('en-GB')}],
 on:{pump(s,v){s.pump=+v},d(s,v){s.d=+v},x(s,v){s.x=+v}},
 draw(s){
  const N=Math.round(Math.pow(10,s.x/4)),per=B1_perSpike(s.d),raw=N*per,dl=s.pump?0:Math.min(raw,65),flat=!s.pump&&raw>=65;
  const Nai=15+dl,Ki=140-dl,ENa=B1_nernst(145,Nai),EK=B1_nernst(5,Ki),V=B1_ghk(.04,.45,37,{Nai,Ki});
  let out=heading(s.pump?'Pump working: the gradients hold':flat?'Pump blocked: the gradients have run down':`Pump blocked: sodium inside up by ${dl<.1?fmt(Math.round(dl*10000)/10000):fmt(B1_r1(dl))} mM`);
  // pump cartoon
  out+=R(30,150,250,26,C.amberp,C.amber,4)+TF(46,142,'outside',13,C.muted,'start')+TF(46,196,'inside',13,C.muted,'start');
  out+=R(132,128,56,70,s.pump?C.greenp:'#eef1f3',s.pump?C.green:C.line,10)+TB(234,168,'pump',14,s.pump?C.green:C.muted);
  if(s.pump){out+=arrow(146,206,146,104,C.coral,3)+TB(128,96,'3 Na⁺',14,C.coral)+arrow(176,100,176,214,C.purple,3)+TB(200,234,'2 K⁺',14,C.purple)+TF(232,214,'1 ATP',13,C.amber)}
  else out+=L(124,122,196,204,C.coral,4)+L(196,122,124,204,C.coral,4)+TF(160,226,'blocked',13,C.coral);
  out+=B1_wrap(30,262,s.pump?`Each impulse adds ${per<.01?fmt(Math.round(per*100000)/100000):fmt(Math.round(per*100)/100)} mM of sodium to this axon. The pump returns it, at a cost of one ATP for every three ions.`:`Each impulse adds ${per<.01?fmt(Math.round(per*100000)/100000):fmt(Math.round(per*100)/100)} mM of sodium and removes as much potassium. Nothing puts them back.`,38,13,C.ink).svg;
  // bars
  const bx=330,by=250,sc=1.1,bar=(x,v,col,lab,base)=>R(x,by-v*sc,54,v*sc,col,'none',4)+L(x-4,by-base*sc,x+58,by-base*sc,C.muted,1.2,'stroke-dasharray="3 3"')+TB(x+27,by-v*sc-7,fmt(B1_r1(v)),14,col)+TF(x+27,by+17,lab,13,C.muted);
  out+=TB(330,66,'Inside the axon, mM',14,C.ink,'start')+L(bx-8,by,bx+150,by,C.line,1.5)+bar(bx,Nai,C.coral,'sodium',15)+bar(bx+82,Ki,C.purple,'potassium',140);
  out+=B1_panel(490,78,98,190)+TF(539,100,'E sodium',13,C.coral)+TB(539,120,B1_mV(ENa,0),14,C.coral)+TF(539,150,'E potassium',13,C.purple)+TB(539,170,B1_mV(EK,0),14,C.purple)+TF(539,200,'resting',13,C.ink)+TF(539,216,'potential',13,C.ink)+TB(539,238,B1_mV(V,0),14,C.ink);
  out+=TF(450,296,`${N.toLocaleString('en-GB')} impulse${N===1?'':'s'} fired`,13,C.ink);
  out+=TF(300,366,'Squid flux used for both axons: an upper estimate for the thin one.',13,C.muted);
  return {svg:out,phase:s.pump?`With the pump running, ${N.toLocaleString('en-GB')} impulses leave the concentrations where they were. The price is energy: pumping ions back is the largest item in estimates of the energy the grey matter spends on signalling.`:flat?'The sodium gradient is nearly gone. The equilibrium potentials have collapsed towards each other and the axon can no longer fire: the battery is flat.':s.d>100?`The giant axon is so large that ${N.toLocaleString('en-GB')} impulses have changed its internal sodium by only ${fmt(Math.round(dl*1000)/1000)} mM. Signalling runs on the stored gradients; the pump can catch up later.`:`In the thin axon ${N.toLocaleString('en-GB')} impulses have already raised internal sodium to ${fmt(B1_r1(Nai))} mM and lowered the sodium equilibrium potential to ${B1_mV(ENa,0)}. Thin axons depend on their pumps from moment to moment.`};
 }});

/* ===================== Lesson: action-potential ===================== */
// The Hodgkin–Huxley (1952) model of the squid giant axon at 6.3 °C, in the modern sign convention
// (rest −65 mV). Units: mV, ms, µA/cm², mS/cm², 1 µF/cm². Integrated with a 0.01 ms step.
const B1_HH={gNa:120,gK:36,gL:.3,ENa:50,EK:-77,EL:-54.4,rest:-65};
function B1_rates(V){const x=V+40,y=V+55;
 return {am:Math.abs(x)<1e-6?1:.1*x/(1-Math.exp(-x/10)),bm:4*Math.exp(-(V+65)/18),ah:.07*Math.exp(-(V+65)/20),bh:1/(1+Math.exp(-(V+35)/10)),an:Math.abs(y)<1e-6?.1:.01*y/(1-Math.exp(-y/10)),bn:.125*Math.exp(-(V+65)/80)}}
// o = {dur, ENa?, pulses:[{t,d,a}]} -> {v: samples every 0.05 ms, spikes: times V rose through 0 mV, peak}
function B1_hh(o){const dt=.01,dur=o.dur||20,ENa=o.ENa===undefined?B1_HH.ENa:o.ENa,pulses=o.pulses||[];
 let V=B1_HH.rest,r=B1_rates(V),m=r.am/(r.am+r.bm),h=r.ah/(r.ah+r.bh),n=r.an/(r.an+r.bn);
 const N=Math.round(dur/dt),v=[],spikes=[];let peak=-1e9,up=false;
 for(let i=0;i<=N;i++){const t=i*dt;if(i%5===0)v.push(V);
  let I=0;for(const p of pulses)if(t>=p.t&&t<p.t+p.d)I+=p.a;
  r=B1_rates(V);const tm=1/(r.am+r.bm),th=1/(r.ah+r.bh),tn=1/(r.an+r.bn);
  m+=(r.am*tm-m)*(1-Math.exp(-dt/tm));h+=(r.ah*th-h)*(1-Math.exp(-dt/th));n+=(r.an*tn-n)*(1-Math.exp(-dt/tn));
  V+=dt*(I-B1_HH.gNa*m*m*m*h*(V-ENa)-B1_HH.gK*n*n*n*n*(V-B1_HH.EK)-B1_HH.gL*(V-B1_HH.EL));if(V>peak)peak=V;
  if(!up&&V>0){up=true;spikes.push(t)}else if(up&&V<-30)up=false}
 return {v,spikes,peak}}
const B1_CACHE={};
const B1_run=(key,o)=>B1_CACHE[key]||(B1_CACHE[key]=B1_hh(o));
// Threshold for a 1 ms pulse from rest (about 6.9 µA/cm²), found by bisection once.
let B1_T1v=0;
function B1_T1(){if(B1_T1v)return B1_T1v;let lo=0,hi=20;for(let i=0;i<16;i++){const mid=(lo+hi)/2;B1_hh({dur:15,pulses:[{t:1,d:1,a:mid}]}).spikes.length?hi=mid:lo=mid}return B1_T1v=hi}
const B1_trace=(run,pl,t1)=>{const pts=[];for(let i=0;i<run.v.length&&i*.05<=t1;i++)pts.push([pl.X(i*.05),pl.Y(run.v[i])]);return pts};

const B1_naE=pc=>50+B1_RTF(6.3)*Math.log(pc/100);
const B1_naRun=pc=>B1_run('na'+pc,{dur:12,ENa:B1_naE(pc),pulses:[{t:1,d:1,a:15}]});
SCENE({id:'action-potential',name:'The overshoot',tag:'Past zero, towards sodium',
 definition:'Bernstein had predicted that during an impulse the membrane loses its selectivity and the voltage falls to zero. In 1939 Cole and Curtis showed that the membrane’s conductance does rise, about fortyfold. The same year Hodgkin and Huxley put an electrode inside a squid giant axon and found that the voltage goes well past zero: the inside becomes about 40 mV positive.',
 example:'Zero cannot be passed by a membrane that merely leaks. Hodgkin and Katz (1949) showed what drives it: lowering the sodium outside the axon lowers the peak of the impulse by about the amount Nernst’s equation predicts for sodium. The membrane becomes briefly selective for sodium.',
 desc:'The voltage inside a model squid axon during an impulse, with Bernstein’s ceiling at zero and the sodium equilibrium potential marked, and a plot of the impulse’s peak against the sodium concentration outside.',
 research:['Cole & Curtis (1939). Electric impedance of the squid giant axon during activity. Journal of General Physiology 22, 649–670.','Hodgkin & Huxley (1939). Action potentials recorded from inside a nerve fibre. Nature 144, 710–711.','Hodgkin & Katz (1949). The effect of sodium ions on the electrical activity of the giant axon of the squid. Journal of Physiology 108, 37–77.','Mind In Motion, “Action potential”, introduces the spike and its ion channels.'],
 dur:10,hint:'Lower the sodium in the sea water around the axon and watch the peak of the impulse follow the sodium equilibrium potential. The curves come from the Hodgkin–Huxley equations.',
 init:()=>({na:100,seen:[100]}),
 watch(p){const all=[100,70,50,30],n=Math.min(4,1+Math.floor(p*4.4));return {na:all[n-1],seen:all.slice(0,n)}},
 ui:[{range:'na',label:'Sodium outside',min:20,max:100,step:10,get:s=>s.na,act:'na',show:v=>v+'% of sea water'}],
 on:{na(s,v){s.na=+v;if(!s.seen.includes(s.na))s.seen.push(s.na)}},
 draw(s){
  const run=B1_naRun(s.na),ENa=B1_naE(s.na);
  let out=heading(`Peak ${B1_mV(run.peak,0)} with ${s.na}% sodium outside`);
  const pl=B1_plot(64,58,290,256,[0,10],[-90,60],{xt:[[0,'0'],[2,'2'],[4,'4'],[6,'6'],[8,'8'],[10,'10 ms']],yt:[[-65,'−65'],[0,'0'],[50,'+50']],yl:'voltage inside the axon, mV',ylDx:44});out+=pl.svg;
  out+=L(pl.X(0),pl.Y(0),pl.X(10),pl.Y(0),C.purple,1.6,'stroke-dasharray="6 5"')+TF(pl.X(10)-4,pl.Y(0)+16,'Bernstein’s ceiling',13,C.purple,'end');
  out+=L(pl.X(0),pl.Y(ENa),pl.X(10),pl.Y(ENa),C.coral,1.6,'stroke-dasharray="3 4"')+TF(pl.X(10)-4,pl.Y(ENa)-6,'E sodium '+B1_sg(ENa,0),13,C.coral,'end');
  if(s.na!==100)out+=B1_poly(B1_trace(B1_naRun(100),pl,10),'#a9bfd0',1.6);
  out+=B1_poly(B1_trace(run,pl,10),C.blue,2.8)+L(pl.X(1),pl.Y(-90),pl.X(2),pl.Y(-90),C.amber,5)+TF(pl.X(1.5),pl.Y(-90)-8,'shock',13,C.amber);
  // peak against sodium
  const pk=B1_plot(420,84,158,170,[18,110],[-10,60],{logx:true,xt:[[20,'20'],[50,'50'],[100,'100%']],yt:[[0,'0'],[25,'+25'],[50,'+50']],xl:'sodium outside',yl:'peak, mV',ylDx:34});out+=pk.svg;
  out+=L(pk.X(20),pk.Y(B1_naE(20)),pk.X(100),pk.Y(50),C.coral,1.6,'stroke-dasharray="3 4"');
  for(const pc of s.seen)out+=Ci(pk.X(pc),pk.Y(B1_naRun(pc).peak),pc===s.na?6:4.5,C.blue,'#fff');
  out+=TF(499,312,'dashed: E sodium (Nernst)',13,C.coral)+TF(499,330,'dots: your impulses',13,C.blue);
  out+=TF(300,366,'Model squid axon at 6.3 °C. Resting potential −65 mV.',13,C.muted);
  return {svg:out,phase:s.na===100?`In normal sea water the impulse climbs from −65 mV to ${B1_mV(run.peak,0)}, far past Bernstein’s zero and most of the way to the sodium equilibrium potential of +50 mV. Now lower the sodium.`:`With ${s.na}% of the usual sodium the sodium equilibrium potential drops to ${B1_mV(ENa,0)} and the peak drops with it, to ${B1_mV(run.peak,0)}. The resting potential barely moves. The rising phase of the impulse is sodium rushing in.`};
 }});

const B1_stepRun=(a,d)=>B1_run('st'+a+'_'+d,{dur:d>1?60:14,pulses:[{t:1,d,a}]});
const B1_TH_WATCH=[3,6,7,12,20];
SCENE({id:'action-potential-threshold',name:'Threshold and all-or-none',tag:'Inject current into the axon',
 definition:'A small pulse of current nudges the voltage, which then falls back. A slightly larger one tips the membrane into a full impulse. Above that threshold the impulse has the same size whatever the stimulus: all or none. A steady current gives a train of impulses, faster for stronger currents.',
 example:'In the Hodgkin–Huxley model a 1 ms pulse of 6.5 µA/cm² fails and one of 7 µA/cm² fires. Pulses of 7 and 20 µA/cm² give peaks of +35 and +41 mV: the stronger one fires sooner, not much bigger.',
 desc:'Voltage against time for the last few current pulses injected into a model axon, with a list of each trial’s outcome and the range in which the learner has trapped the threshold.',
 research:['Hodgkin & Huxley (1952). A quantitative description of membrane current and its application to conduction and excitation in nerve. Journal of Physiology 117, 500–544 (Nobel Prize 1963, with Eccles).','Lucas (1909) and Adrian (1914) on the all-or-none principle in muscle and nerve. Journal of Physiology 38 and 47.'],
 dur:12,hint:'Set the current and press Inject. Trap the threshold between a pulse that fails and one that fires, then switch to a steady current. Each impulse plays a soft click, slowed about 25 times.',
 init:()=>({amp:5,dur:1,trials:[],lo:0,hi:null}),
 watch(p){const n=Math.min(5,1+Math.floor(p*5.4)),tr=B1_TH_WATCH.slice(0,n);return {amp:tr[n-1],dur:1,trials:tr.slice(-4).map(a=>({a,d:1})),lo:n>=2?6:n>=1?3:0,hi:n>=3?7:null}},
 ui:[{range:'amp',label:'Current',min:0,max:20,step:.5,get:s=>s.amp,act:'amp',show:v=>fmt(v)+' µA/cm²'},{choose:[[1,'Brief pulse, 1 ms'],[50,'Steady, 50 ms']],label:'Duration',get:s=>s.dur,act:'dur'},{b:'Inject',act:'inject'},{b:'Clear',act:'clear'}],
 on:{amp(s,v){s.amp=+v},dur(s,v){s.dur=+v;s.trials=[]},
  inject(s){const run=B1_stepRun(s.amp,s.dur);s.trials.push({a:s.amp,d:s.dur});if(s.trials.length>4)s.trials.shift();
   if(s.dur===1){if(run.spikes.length){if(s.hi===null||s.amp<s.hi)s.hi=s.amp}else if(s.amp>s.lo)s.lo=s.amp}
   B1_clicks(run.spikes.map(t=>t*.025))},
  clear(s){s.trials=[];s.lo=0;s.hi=null}},
 draw(s){
  const long=s.dur>1,t1=long?60:12,last=s.trials.length?s.trials[s.trials.length-1]:null,lr=last?B1_stepRun(last.a,last.d):null;
  let out=heading(!last?'Inject current and look for the threshold':lr.spikes.length?(long?`${lr.spikes.length} impulse${lr.spikes.length>1?'s':''} in 50 ms`:`${fmt(last.a)} µA/cm²: an impulse, peak ${B1_mV(lr.peak,0)}`):`${fmt(last.a)} µA/cm²: no impulse`);
  const pl=B1_plot(64,58,300,240,[0,t1],[-90,60],{xt:long?[[0,'0'],[20,'20'],[40,'40'],[60,'60 ms']]:[[0,'0'],[4,'4'],[8,'8'],[12,'12 ms']],yt:[[-65,'−65'],[0,'0'],[40,'+40']],yl:'voltage, mV',ylDx:44});out+=pl.svg;
  out+=L(pl.X(1),pl.Y(-90),pl.X(1+s.dur),pl.Y(-90),C.amber,5)+TF(pl.X(long?26:2.4),pl.Y(-90)-8,'current on',13,C.amber);
  s.trials.forEach((tr,i)=>{const lastOne=i===s.trials.length-1;out+=B1_poly(B1_trace(B1_stepRun(tr.a,tr.d),pl,t1),lastOne?C.blue:'#a9bfd0',lastOne?2.8:1.6)});
  out+=TB(384,74,'Trials',14,C.ink,'start');
  if(!s.trials.length)out+=TF(384,98,'None yet: press Inject.',13,C.muted,'start');
  s.trials.forEach((tr,i)=>{const r=B1_stepRun(tr.a,tr.d),y=98+i*28,f=r.spikes.length;out+=R(380,y-17,206,24,i===s.trials.length-1?C.pale:'#f6f9fb','none',6)+TF(388,y,fmt(tr.a),13,C.ink,'start')+TBF(580,y,f?(long?f+(f>1?' impulses':' impulse'):'impulse '+B1_sg(r.peak,0)+' mV'):'none, peak '+B1_sg(r.peak,0),13,f?C.green:C.muted,'end')});
  out+=B1_panel(380,216,206,84);
  if(long)out+=B1_wrap(390,238,'A steady current is coded as a rate: count the impulses as you raise it.',27,13,C.ink).svg;
  else{out+=TF(390,238,'Threshold trapped between',13,C.muted,'start')+TB(390,262,`${fmt(s.lo)} and ${s.hi===null?'?':fmt(s.hi)} µA/cm²`,15,C.blue,'start');if(s.hi!==null&&s.hi-s.lo<=1)out+=TF(390,286,`model: ${fmt(B1_r1(B1_T1()))} µA/cm²`,13,C.green,'start')}
  out+=TF(300,342,last&&lr.spikes.length&&!long?'The impulse is the same size however hard you push.':'',13,C.green);
  out+=TF(300,366,'Hodgkin–Huxley model of the squid axon at 6.3 °C; mammalian impulses are several times briefer.',13,C.muted);
  return {svg:out,phase:!last?'The model axon rests at −65 mV. A current pulse adds charge to the membrane; what happens next depends on whether enough sodium channels open to keep the rise going by itself.':long?(lr.spikes.length>1?`A steady ${fmt(last.a)} µA/cm² gives ${lr.spikes.length} impulses in 50 ms. A stronger current gives more impulses of the same size: strength is carried by rate.`:lr.spikes.length?`A steady ${fmt(last.a)} µA/cm² gives one impulse and then the axon settles. This model needs about 6 µA/cm² or more to keep firing.`:'This steady current is too weak: the voltage shifts a few millivolts and stays there.'):lr.spikes.length?`Above threshold the sodium current feeds itself and the voltage runs to ${B1_mV(lr.peak,0)}. Just above threshold the impulse starts late; far above, it starts early. Its height hardly changes.`:`The voltage rises to ${B1_mV(lr.peak,0)} and decays. Below threshold the outward potassium and leak currents win.`};
 }});

// Two 1 ms pulses: the first at twice threshold, the second at k × threshold after an interval (ms, onset to onset).
function B1_pair(iv,k){const T=B1_T1();return B1_run('pr'+iv+'_'+k,{dur:iv+13,pulses:[{t:1,d:1,a:2*T},{t:1+iv,d:1,a:k*T}]})}
const B1_second=(iv,k)=>B1_pair(iv,k).spikes.some(t=>t>1+iv);
// Least strength (× threshold, up to 5) that gives a second impulse at each interval; null where even 5× fails.
let B1_RCURVE=null;
function B1_rcurve(){if(B1_RCURVE)return B1_RCURVE;const T=B1_T1(),out=[];
 for(let iv=3;iv<=20;iv+=.5){const f=k=>B1_hh({dur:iv+13,pulses:[{t:1,d:1,a:2*T},{t:1+iv,d:1,a:k*T}]}).spikes.some(t=>t>1+iv);
  if(!f(5)){out.push([iv,null]);continue}let lo=0,hi=5;for(let i=0;i<10;i++){const mid=(lo+hi)/2;f(mid)?hi=mid:lo=mid}out.push([iv,hi])}
 return B1_RCURVE=out}
const B1_REF_WATCH=[[6,2],[6,5],[10,2],[10,4],[13,2],[18,1]];
SCENE({id:'action-potential-refractory',name:'The refractory period',tag:'Why impulses do not merge',
 definition:'For a short time after an impulse the axon cannot fire again: sodium channels are inactivated and potassium channels are still open. Then comes a period when a second impulse is possible but needs a stronger stimulus. This sets a top firing rate and stops an impulse from turning back along the axon.',
 example:'In the Hodgkin–Huxley model at 6.3 °C, a second pulse up to five times threshold fails if it comes within about 9 ms of the first. By 12 ms it needs about twice threshold, and by 16 ms the usual amount. In warm mammalian axons the same sequence takes one or two milliseconds.',
 desc:'Voltage against time for two current pulses a chosen interval apart, above a plot of the second pulse’s strength against the interval on which each trial is marked as fired or failed, with the model’s threshold curve.',
 research:['Hodgkin & Huxley (1952). Journal of Physiology 117, 500–544 (the refractory period predicted from the equations).','Adrian & Lucas (1912). On the summation of propagated disturbances in nerve and muscle. Journal of Physiology 44, 68–124.'],
 dur:12,hint:'Set the interval and the strength of the second pulse, then press Stimulate twice. Map out where a second impulse is impossible, and where it only needs more current. Clicks play for each impulse, slowed about 25 times.',
 init:()=>({iv:6,k:2,tests:[],curve:0}),
 watch(p){const n=Math.min(6,1+Math.floor(p*6.5)),t=B1_REF_WATCH.slice(0,n);return {iv:t[n-1][0],k:t[n-1][1],tests:t.map(([iv,k])=>({iv,k,ok:B1_second(iv,k)})),curve:p>.8?1:0}},
 ui:[{range:'iv',label:'Interval',min:3,max:20,step:.5,get:s=>s.iv,act:'iv',show:v=>fmt(v)+' ms'},{range:'k',label:'Second pulse',min:1,max:5,step:.5,get:s=>s.k,act:'k',show:v=>fmt(v)+' × threshold'},{b:'Stimulate twice',act:'go'},
  {choose:[[0,'Your tests'],[1,'With model curve']],label:'Plot',get:s=>s.curve,act:'curve'}],
 on:{iv(s,v){s.iv=+v},k(s,v){s.k=+v},curve(s,v){s.curve=+v},
  go(s){const run=B1_pair(s.iv,s.k),ok=run.spikes.some(t=>t>1+s.iv);s.tests=s.tests.filter(q=>!(q.iv===s.iv&&q.k===s.k));s.tests.push({iv:s.iv,k:s.k,ok});if(s.tests.length>30)s.tests.shift();B1_clicks(run.spikes.map(t=>t*.025))}},
 draw(s){
  const run=B1_pair(s.iv,s.k),ok=run.spikes.some(t=>t>1+s.iv);
  let out=heading(ok?`${fmt(s.iv)} ms apart, ${fmt(s.k)} × threshold: a second impulse`:`${fmt(s.iv)} ms apart, ${fmt(s.k)} × threshold: no second impulse`);
  const pl=B1_plot(64,54,512,124,[0,33],[-90,60],{xt:[[0,'0'],[10,'10'],[20,'20'],[30,'30 ms']],yt:[[-65,'−65'],[0,'0'],[40,'+40']],yl:'voltage, mV',ylDx:44});out+=pl.svg;
  out+=B1_poly(B1_trace(run,pl,33),C.blue,2.6)+L(pl.X(1),pl.Y(-90),pl.X(2),pl.Y(-90),C.amber,5)+L(pl.X(1+s.iv),pl.Y(-90),pl.X(2+s.iv),pl.Y(-90),C.coral,5)+TF(pl.X(2.4+s.iv),pl.Y(-90)+3,'2nd',13,C.coral,'start');
  const pr=B1_plot(64,218,330,100,[2,21],[0,5.5],{xt:[[5,'5'],[10,'10'],[15,'15'],[20,'20 ms']],yt:[[1,'1×'],[3,'3×'],[5,'5×']],xl:'interval between the two pulses',xlDy:32,yl:'strength of the second pulse',ylDx:44});out+=pr.svg;
  out+=L(pr.X(2),pr.Y(1),pr.X(21),pr.Y(1),C.line,1.2,'stroke-dasharray="3 4"');
  if(s.curve){const cv=B1_rcurve(),firstOk=cv.find(c=>c[1]!==null);out+=R(pr.X(2),pr.Y(5.5),pr.X(firstOk[0])-pr.X(2),100,C.coralp,'none',0,'opacity=".6"')+B1_poly(cv.filter(c=>c[1]!==null).map(c=>[pr.X(c[0]),pr.Y(c[1])]),C.purple,2.2)}
  for(const q of s.tests)out+=Ci(pr.X(q.iv),pr.Y(q.k),5,q.ok?C.green:'#fff',q.ok?C.green:C.coral);
  out+=Ci(pr.X(s.iv),pr.Y(s.k),8,'none',C.blue);
  out+=Ci(418,236,5,C.green,C.green)+TF(430,240,'second impulse',13,C.green,'start')+Ci(418,258,5,'#fff',C.coral)+TF(430,262,'failed',13,C.coral,'start');
  if(s.curve)out+=L(410,280,426,280,C.purple,2.2)+TF(430,284,'least strength needed',13,C.purple,'start')+R(410,296,16,12,C.coralp,'none',2)+TF(430,306,'fails even at 5×',13,C.coral,'start');
  else out+=B1_wrap(410,284,`${s.tests.length} test${s.tests.length===1?'':'s'} so far. Find the edge.`,22,13,C.muted).svg;
  out+=TF(300,372,'Hodgkin–Huxley model at 6.3 °C. “Impulse” means the voltage passes 0 mV.',13,C.muted);
  return {svg:out,phase:ok?(s.k>1?`A second impulse, but only because the pulse was ${fmt(s.k)} times threshold. This is the relative refractory period: potassium channels are still open and some sodium channels still inactivated, so more current is needed, and the second impulse is a little smaller.`:'By now the membrane has recovered and an ordinary threshold pulse is enough.'):s.iv<9.5?'Nothing, however strong the pulse within this range. The sodium channels that made the first impulse are inactivated and need time at rest before they can open again.':'No second impulse at this strength, but a stronger pulse would fire: raise the strength and try again.'};
 }});

// Voltage clamp: currents (µA/cm²) at time t (ms) after stepping from −65 mV to vc.
function B1_clamp(vc){const g=V=>{const r=B1_rates(V);return [r.am/(r.am+r.bm),1/(r.am+r.bm),r.ah/(r.ah+r.bh),1/(r.ah+r.bh),r.an/(r.an+r.bn),1/(r.an+r.bn)]},a=g(-65),b=g(vc);
 return t=>{const m=b[0]-(b[0]-a[0])*Math.exp(-t/b[1]),h=b[2]-(b[2]-a[2])*Math.exp(-t/b[3]),n=b[4]-(b[4]-a[4])*Math.exp(-t/b[5]);return {na:120*m*m*m*h*(vc-50),k:36*n*n*n*n*(vc+77)}}}
function B1_clampPeak(vc){const f=B1_clamp(vc);let best=0;for(let t=0;t<=8;t+=.02){const v=f(t).na;if(Math.abs(v)>Math.abs(best))best=v}return {na:best,k:f(8).k}}
SCENE({id:'action-potential-clamp',name:'The voltage clamp',tag:'Holding the voltage to read the currents',
 definition:'During an impulse the voltage changes the channels and the channels change the voltage, too quickly to untangle. The voltage clamp, devised by Kenneth Cole and George Marmont and used by Hodgkin, Huxley and Katz from 1949, breaks the loop: a feedback amplifier holds the membrane at a chosen voltage and the current it has to supply is the current through the membrane.',
 example:'Step the membrane from −65 to 0 mV and current first flows inwards for about a millisecond, then outwards for as long as the step lasts. Replacing the sodium outside removes the early inward part. From such records Hodgkin and Huxley wrote equations for a fast sodium current that switches itself off and a slower potassium current, and the equations reproduced the impulse and its speed.',
 desc:'Membrane current against time after a step to the chosen voltage, drawn as a total or split into its sodium and potassium parts, beside a plot of the peak sodium current and the late potassium current against the step voltage.',
 research:['Cole (1949). Dynamic electrical characteristics of the squid axon membrane. Archives des Sciences Physiologiques 3, 253–258.','Hodgkin, Huxley & Katz (1952). Measurement of current–voltage relations in the membrane of the giant axon of Loligo. Journal of Physiology 116, 424–448.','Hodgkin & Huxley (1952). Currents carried by sodium and potassium ions through the membrane of the giant axon of Loligo. Journal of Physiology 116, 449–472.'],
 dur:12,hint:'Step the membrane to different voltages. Find the voltage at which the early current vanishes and then reverses: that voltage identifies the ion carrying it.',
 init:()=>({vc:0,view:'split'}),
 watch(p){return {vc:Math.round(lerp(-50,80,p)/5)*5,view:p<.25?'total':'split'}},
 ui:[{range:'vc',label:'Step to',min:-50,max:80,step:5,get:s=>s.vc,act:'vc',show:v=>B1_sg(v,0)+' mV'},{choose:[['total','Total current'],['split','Sodium and potassium parts']],label:'Show',get:s=>s.view,act:'view'}],
 on:{vc(s,v){s.vc=+v},view(s,v){s.view=v}},
 draw(s){
  const f=B1_clamp(s.vc),pk=B1_clampPeak(s.vc),inward=pk.na<-20,rev=Math.abs(s.vc-50)<3;
  let out=heading(`Step to ${B1_mV(s.vc,0)}: ${rev?'no early current':inward?'early current inwards':s.vc>50?'early current outwards':'very little early current'}`);
  const pl=B1_plot(64,58,290,236,[0,8],[-2.6,5.2],{xt:[[0,'0'],[2,'2'],[4,'4'],[6,'6'],[8,'8 ms']],yt:[[-2,'−2'],[0,'0'],[2,'+2'],[4,'+4']],yl:'membrane current, mA/cm²',ylDx:44});out+=pl.svg;
  out+=L(pl.X(0),pl.Y(0),pl.X(8),pl.Y(0),C.line,1.2)+TF(pl.X(8)-4,pl.Y(-2.6)-6,'inward ↓',13,C.muted,'end')+TF(pl.X(8)-4,pl.Y(5.2)+16,'outward ↑',13,C.muted,'end');
  const na=[],k=[],tot=[];for(let i=0;i<=200;i++){const t=i*.04,c=f(t);na.push([pl.X(t),pl.Y(clamp(c.na/1000,-2.6,5.2))]);k.push([pl.X(t),pl.Y(clamp(c.k/1000,-2.6,5.2))]);tot.push([pl.X(t),pl.Y(clamp((c.na+c.k)/1000,-2.6,5.2))])}
  if(s.view==='split')out+=B1_poly(na,C.coral,2.4)+B1_poly(k,C.purple,2.4)+B1_poly(tot,C.ink,1.2,'stroke-dasharray="3 4"');else out+=B1_poly(tot,C.ink,2.8);
  out+=TF(74,332,s.view==='split'?'orange: sodium · purple: potassium · dashed: total':'what the amplifier records',13,C.muted,'start');
  // current–voltage plot
  const iv=B1_plot(420,84,160,170,[-60,90],[-2.6,5.2],{xt:[[-50,'−50'],[0,'0'],[50,'+50']],yt:[[-2,'−2'],[0,'0'],[4,'+4']],xl:'step voltage, mV',yl:'current, mA/cm²',ylDx:34});out+=iv.svg;
  out+=L(iv.X(-60),iv.Y(0),iv.X(90),iv.Y(0),C.line,1.2);
  const a=[],b=[];for(let v=-55;v<=85;v+=5){const q=B1_clampPeak(v);a.push([iv.X(v),iv.Y(clamp(q.na/1000,-2.6,5.2))]);b.push([iv.X(v),iv.Y(clamp(q.k/1000,-2.6,5.2))])}
  out+=B1_poly(a,C.coral,2.2)+B1_poly(b,C.purple,2.2)+L(iv.X(s.vc),84,iv.X(s.vc),254,C.amber,1.2,'stroke-dasharray="3 4"')+Ci(iv.X(s.vc),iv.Y(clamp(pk.na/1000,-2.6,5.2)),5,C.coral,'#fff')+Ci(iv.X(s.vc),iv.Y(clamp(pk.k/1000,-2.6,5.2)),5,C.purple,'#fff');
  out+=TF(500,312,'early peak (sodium)',13,C.coral)+TF(500,330,'late (potassium)',13,C.purple);
  out+=TF(300,366,'Computed from the Hodgkin–Huxley equations (6.3 °C); leak and capacity currents left out.',13,C.muted);
  return {svg:out,phase:rev?'At +50 mV the early current disappears. That is the sodium equilibrium potential: with no net push on sodium, open sodium channels carry no current. This is how the early current was identified.':s.vc>50?'Beyond +50 mV the early current flows outwards: sodium is now pushed out through the same channels. A current that reverses exactly at one ion’s equilibrium potential is carried by that ion.':inward?`The early inward current peaks at ${fmt(Math.round(Math.abs(pk.na)/100)/10)} mA/cm² and switches itself off within a few milliseconds even though the voltage is held: sodium channels inactivate. The outward potassium current rises more slowly and stays on.`:'A small step opens few channels. Both currents grow steeply with depolarisation, which is what makes the impulse explosive.'};
 }});

/* ===================== Lesson: myelin-conduction ===================== */
// A myelinated fibre with nine nodes. The current from an active node falls by half per internode and is
// six times threshold at the next node (a safety factor of the size Tasaki measured; values illustrative).
const B1_NODES=9,B1_SF=6;
function B1_jump(blocked){const fr=[{at:0,t:0,fired:[0]}];let at=0,t=0;const fired=[0];
 while(at<B1_NODES-1){let j=at+1;while(j<B1_NODES&&blocked[j])j++;const gap=j-at;
  if(j>=B1_NODES||B1_SF*Math.pow(.5,gap-1)<1){fr.push({at,t,fired:fired.slice(),fail:true,gap});return fr}
  t+=.1*gap+(gap>1?.08:0);at=j;fired.push(j);fr.push({at,t,fired:fired.slice(),gap})}
 fr.push({at,t,fired:fired.slice(),done:true});return fr}
SCENE({id:'myelin-conduction',name:'Jumping from node to node',tag:'Saltatory conduction',
 definition:'Many axons are wrapped in myelin, a fatty sheath interrupted every millimetre or so by short bare gaps that Louis-Antoine Ranvier described in 1878. Ichiji Tasaki showed in 1939 that the impulse is renewed only at these nodes, and Huxley and Stämpfli confirmed in 1949 that inward current flows only there. Between nodes the signal spreads passively and almost instantly.',
 example:'Tasaki blocked single nodes of a frog fibre with an anaesthetic. The impulse still crossed one inactive node, because the current from an active node is several times what the next one needs. With more nodes blocked in a row it failed.',
 desc:'A myelinated fibre with nine nodes of Ranvier. The impulse steps from node to node with a time for each; nodes can be blocked, and the impulse jumps one blocked node but stops at two in a row.',
 research:['Ranvier (1878). Leçons sur l’histologie du système nerveux. Paris: Savy.','Tasaki (1939). The electro-saltatory transmission of the nerve impulse and the effect of narcosis upon the nerve fiber. American Journal of Physiology 127, 211–227.','Huxley & Stämpfli (1949). Evidence for saltatory conduction in peripheral myelinated nerve fibres. Journal of Physiology 108, 315–339.'],
 dur:12,hint:'Press a node to block it, as Tasaki did with anaesthetic, and the impulse runs again. Block one node, then two neighbours. Times and current sizes are illustrative.',
 init:()=>({blocked:range(B1_NODES).map(i=>i===4)}),
 trace(s){return B1_jump(s.blocked)},
 ui:[{b:'Unblock all',act:'clear'}],
 on:{node(s,v){const i=+v;if(i>0&&i<B1_NODES-1)s.blocked[i]=!s.blocked[i];return 'run'},clear(s){s.blocked=s.blocked.map(()=>false);return 'run'}},
 draw(s,f,X){
  const nx=i=>52+i*62,y=150;
  let out=heading(f.fail?'The impulse fails: too far to the next working node':f.done?`Arrived after ${fmt(Math.round(f.t*100)/100)} ms`:`Node ${f.at+1} fires at ${fmt(Math.round(f.t*100)/100)} ms`);
  out+=L(30,y,570,y,'#c9a15a',6);
  for(let i=0;i<B1_NODES-1;i++)out+=R(nx(i)+8,y-13,46,26,C.amberp,C.amber,12);
  out+=TF(nx(0)+31,y-22,'myelin',13,C.amber)+TF(nx(0),y+62,'start',13,C.muted);
  for(let i=0;i<B1_NODES;i++){const bl=s.blocked[i],fired=f.fired.includes(i),now=f.at===i&&!f.done;
   const inner=Ci(nx(i),y,12,'#fff','none','opacity="0"')+Ci(nx(i),y,now&&!f.fail?9:7,bl?C.coralp:fired?C.green:'#fff',bl?C.coral:fired?C.green:C.blue)+(bl?L(nx(i)-6,y-6,nx(i)+6,y+6,C.coral,2.5)+L(nx(i)+6,y-6,nx(i)-6,y+6,C.coral,2.5):'')+TF(nx(i),y+40,i+1,13,bl?C.coral:C.muted);
   out+=i>0&&i<B1_NODES-1?hit(X,'node',i,`Node ${i+1}: ${bl?'blocked. Press to unblock':'working. Press to block'}`,inner):inner;
   if(now&&!f.fail)out+=arrow(nx(i)-9,y-46,nx(i)-3,y-14,C.coral,2.2)+arrow(nx(i)+9,y-46,nx(i)+3,y-14,C.coral,2.2)+TF(nx(i),y-52,'Na⁺ in',13,C.coral)}
  if(!f.done){let j=f.at+1;while(j<B1_NODES&&s.blocked[j])j++;const reach=Math.min(j,B1_NODES-1),cur=B1_SF*Math.pow(.5,j-f.at-1);
   if(f.at<B1_NODES-1)out+=curveArrow(nx(f.at)+10,y+16,nx(reach)-10,y+16,-26-8*(reach-f.at),f.fail?C.muted:C.blue,2.2)+TF(clamp((nx(f.at)+nx(reach))/2,120,480),y+78+6*(reach-f.at),j<B1_NODES?`current there: ${fmt(Math.round(cur*10)/10)} × threshold`:'',13,f.fail?C.coral:C.blue)}
  out+=B1_panel(40,262,520,84);
  out+=B1_wrap(54,286,f.fail?'Each blocked node halves the current reaching the next. Past two blocked nodes only 0.75 of threshold is left, so nothing fires.':f.done?(s.blocked.some(b=>b)?'The impulse crossed every blocked node it met, a little late each time: the weaker current takes longer to bring the next node to threshold.':'Nine nodes in 0.8 ms. Only the nodes had to fire; the myelinated stretches cost almost no time.'):'Sodium enters only at the active node. The current runs forward inside the axon and out at the next node, which fires in turn.',70,13,C.ink).svg;
  return {svg:out,phase:f.fail?'With two neighbouring nodes out of action the current arriving at the next working node is below threshold and the impulse stops. Conduction has a safety margin, but not an unlimited one.':f.done?'Because the impulse is regenerated at each node it arrives at full size however long the fibre. Myelin lets the nodes be far apart, so there are far fewer regenerations per millimetre.':f.gap>1?`The impulse skipped a blocked node: ${fmt(B1_SF*Math.pow(.5,f.gap-1))} times threshold still arrived at node ${f.at+1}.`:'The active node’s current is about six times what the next node needs to fire. That margin is the safety factor.'};
 }});

// Rules of thumb: unmyelinated v ≈ √d m/s (d in µm; about 1 m/s at 1 µm, about 22 m/s for a 500 µm squid axon);
// myelinated v ≈ 6 × d m/s (Hursh 1939, cat fibres).
const B1_vU=d=>Math.sqrt(d),B1_vM=d=>6*d;
function B1_race(s){const vA=B1_vU(s.d),vB=B1_vM(s.d),TA=1000/vA,TB_=s.patch?800/vB+200/vA:1000/vB;
 const posB=t=>{if(!s.patch)return Math.min(1,t*vB/1000);const t1=400/vB,t2=t1+200/vA;return t<t1?t*vB/1000:t<t2?.4+(t-t1)*vA/1000:Math.min(1,.6+(t-t2)*vB/1000)};
 return {vA,vB,TA,TB:TB_,posA:t=>Math.min(1,t*vA/1000),posB}}
SCENE({id:'myelin-conduction-race',name:'A race along two axons',tag:'Bare against myelinated',
 definition:'In an unmyelinated axon the impulse has to be regenerated at every point along the membrane, and it creeps along at about a metre per second. In a myelinated axon of the same width it is regenerated only at the nodes and travels many times faster: large myelinated fibres reach about 100 metres per second.',
 example:'Stub a toe and you feel two pains: a sharp one at once, carried by thin myelinated fibres at around 15 m/s, and a dull one a second or so later, carried by unmyelinated fibres at about 1 m/s. Both set off at the same moment. Senses In Motion has more on pain.',
 desc:'Two axons one metre long, one bare and one myelinated, with an impulse racing along each and the speed and arrival time of both. A patch of myelin can be removed from the second axon.',
 research:['Erlanger & Gasser (1937). Electrical Signs of Nervous Activity. University of Pennsylvania Press (fibre groups and their speeds; Nobel Prize 1944).','Hursh (1939). Conduction velocity and diameter of nerve fibers. American Journal of Physiology 127, 131–139.','Bostock & Sears (1978). The internodal axon membrane: electrical excitability and continuous conduction in segmental demyelination. Journal of Physiology 280, 273–301.'],
 dur:10,hint:'Set the axon diameter and press Race. Then remove a patch of myelin from the second axon and race again. Speeds come from rules of thumb, and the picture runs in slow motion. Real bare axons in vertebrates are under about 2 µm wide; wider ones are shown for comparison.',
 init:()=>({d:4,patch:0,t:null,tok:0}),
 watch(p){const patch=p>.5?1:0,q=(p*2)%1,R_=B1_race({d:4,patch});return {d:4,patch,t:q*1.15*R_.TA,tok:0}},
 ui:[{range:'d',label:'Axon diameter',min:1,max:20,get:s=>s.d,act:'d',show:v=>v+' µm'},{choose:[[0,'Myelin intact'],[1,'A patch removed']],label:'Second axon',get:s=>s.patch,act:'patch'},{b:'Race ▶',act:'race'}],
 on:{d(s,v){s.d=+v;s.t=null;s.tok++},patch(s,v){s.patch=+v;s.t=null;s.tok++},
  race(s,v,ctx){s.tok++;s.t=0;ctx.every(50,'tick',s.tok)},
  tick(s,tok){if(tok!==s.tok||s.t===null)return 'stop';const T=B1_race(s).TA;s.t+=T/70;if(s.t>=T){s.t=T;return 'stop'}return 'keep'}},
 draw(s){
  const R_=B1_race(s),t=s.t===null?0:s.t,x0=70,w=460,pa=R_.posA(t),pb=R_.posB(t),ms=v=>v>=100?Math.round(v):fmt(B1_r1(v));
  let out=heading(s.t===null?`Two ${s.d} µm axons, one metre long`:`${ms(t)} ms after the start`);
  const lane=(y,lab,pos,col,my)=>{let o=TB(x0,y-26,lab,14,C.ink,'start')+L(x0,y,x0+w,y,'#c9a15a',5);
   if(my)for(let i=0;i<23;i++){const a=i/23,b=(i+.86)/23;if(s.patch&&a>=.39&&b<=.62)continue;o+=R(x0+a*w+1,y-9,(b-a)*w,18,C.amberp,C.amber,8)}
   if(my&&s.patch)o+=TF(x0+.5*w,y+30,'myelin removed here',13,C.coral);
   o+=L(x0+w,y-18,x0+w,y+18,C.dark,3)+L(x0,y-4,x0+pos*w,y-4,col,3,'opacity=".5"')+Ci(x0+pos*w,y,9,col,'#fff');return o};
  out+=lane(108,'A: no myelin',pa,C.coral,false)+lane(212,'B: myelinated',pb,C.blue,true);
  out+=TF(x0,246,'0',13,C.muted)+TF(x0+w,246,'1 m',13,C.muted);
  out+=counter(70,270,'A: speed',fmt(B1_r1(R_.vA))+' m/s',C.coral,108)+counter(186,270,'A: arrives',ms(R_.TA)+' ms',C.coral,108)+counter(314,270,'B: speed',s.patch?'mixed':fmt(B1_r1(R_.vB))+' m/s',C.blue,108)+counter(430,270,'B: arrives',ms(R_.TB)+' ms',C.blue,108);
  out+=TF(300,340,s.patch?'In the bare patch the impulse crawls at an unmyelinated axon’s speed, at best. Often it stops.':`Same width, ${fmt(B1_r1(R_.vB/R_.vA))} times the speed.`,13,s.patch?C.coral:C.ink);
  out+=TF(300,366,'Rules of thumb: bare ≈ √d m/s, myelinated ≈ 6 × d m/s (d in µm).',13,C.muted);
  return {svg:out,phase:s.patch?`With a fifth of its myelin gone, B takes ${ms(R_.TB)} ms and not ${ms(1000/R_.vB)} ms. This is the best case. The membrane under myelin has few sodium channels, so a newly bared stretch may not conduct at all; the last scene of this lesson follows that up.`:`Over one metre the myelinated axon needs ${ms(R_.TB)} ms and the bare one ${ms(R_.TA)} ms. Press Race to watch: B is across almost before A has started.`};
 }});

SCENE({id:'myelin-conduction-size',name:'What speed costs in space',tag:'Why vertebrates have myelin',
 definition:'Without myelin the only way to conduct faster is to grow a wider axon, and speed rises only with the square root of the width. The squid’s escape reflex uses axons half a millimetre across to reach about 20 metres per second. A myelinated fibre reaches the same speed at a few thousandths of a millimetre.',
 example:'For 25 m/s a bare axon needs to be about 625 µm wide and a myelinated one about 4 µm. More than twenty thousand of the myelinated fibres fit in the cross-section of the single bare one. A compact brain with fast long-distance wiring depends on that saving.',
 desc:'Two circles drawn to the same scale: the cross-section of a bare axon and of a myelinated fibre that conduct at the chosen speed, with their diameters and the number of myelinated fibres that fit inside the bare one.',
 research:['Young (1936). The giant nerve fibres and epistellar body of cephalopods. Quarterly Journal of Microscopical Science 78, 367–386.','Hodgkin (1954). A note on conduction velocity. Journal of Physiology 125, 221–224.','Rushton (1951). A theory of the effects of fibre size in medullated nerve. Journal of Physiology 115, 101–122.','Hartline & Colman (2007). Rapid conduction and the evolution of giant axons and myelinated fibers. Current Biology 17, R29–R35.'],
 dur:9,hint:'Slide the speed you want and compare the widths needed with and without myelin. The circles share one scale.',
 init:()=>({v:25}),
 watch(p){return {v:Math.round(lerp(2,25,smooth(p)))}},
 ui:[{range:'v',label:'Speed wanted',min:1,max:25,get:s=>s.v,act:'v',show:v=>v+' m/s'}],
 on:{v(s,v){s.v=+v}},
 draw(s){
  const dU=s.v*s.v,dM=s.v/6,n=Math.round(36*s.v*s.v),D=250,rm=Math.max(.8,D/2*dM/dU);
  let out=heading(`For ${s.v} m/s: ${dU} µm bare, or ${fmt(B1_r1(dM))} µm with myelin`);
  out+=Ci(170,196,D/2,C.coralp,C.coral)+TB(170,190,'bare axon',14,C.coral)+TF(170,210,dU+' µm across',13,C.coral);
  out+=Ci(400,196,rm+Math.max(1.2,rm*.35),C.amberp,C.amber)+Ci(400,196,rm,C.pale,C.blue)+TB(400,196-rm-Math.max(1.2,rm*.35)-28,'myelinated fibre',14,C.blue)+TF(400,196-rm-Math.max(1.2,rm*.35)-10,fmt(B1_r1(dM))+' µm across',13,C.blue);
  out+=counter(350,262,'fit inside the bare axon',n.toLocaleString('en-GB')+' fibres',C.green,220);
  out+=TF(460,330,s.v>=20?'The squid giant axon is this size.':s.v<=2?'Thin, slow fibres can do without.':'',13,C.muted);
  out+=TF(300,366,'Same scale for both circles. From the rules of thumb: bare ≈ √d m/s, myelinated ≈ 6 × d m/s.',13,C.muted);
  return {svg:out,phase:`To carry signals at ${s.v} m/s, a nerve of bare axons would need ${n.toLocaleString('en-GB')} times the cross-section of a myelinated one. Invertebrates such as squid take the wide-axon route for a few vital reflexes; vertebrates myelinate, and pack about a million fibres into each optic nerve.`};
 }});

// Demyelination: internodal conduction time rises from about 20 µs to about 600 µs before conduction fails
// (Rasminsky & Sears 1972). The mapping from myelin lost to time is illustrative.
const B1_msBlock=warm=>warm?70:90;
const B1_msTime=loss=>20*(1+29*Math.pow(loss/90,2));
SCENE({id:'myelin-conduction-ms',name:'When myelin is damaged',tag:'Slowed, scattered or blocked',
 definition:'In multiple sclerosis, described by Jean-Martin Charcot in 1868, the immune system damages myelin in scattered patches of the brain, optic nerves and spinal cord. Where myelin is thinned, each node takes longer to fire, so signals arrive late and out of step; where it is lost, they may fail to get through. What a person notices depends on which pathways are affected.',
 example:'In demyelinated rat fibres the time to pass one internode rose from about 20 millionths of a second to as much as 600 before conduction failed. Across a patch of fifty internodes that adds up to tens of milliseconds, the size of the delay seen in recordings from the visual pathway after inflammation of the optic nerve. Myelin can also be repaired.',
 desc:'A nerve fibre with a patch in which the chosen share of myelin has been lost, and the signal recorded beyond the patch compared with that of an intact fibre: on time, late and smaller, or absent.',
 research:['Charcot (1868). Histologie de la sclérose en plaques. Gazette des Hôpitaux 41, 554–566.','Rasminsky & Sears (1972). Internodal conduction in undissected demyelinated nerve fibres. Journal of Physiology 227, 323–350.','Halliday, McDonald & Mushin (1972). Delayed visual evoked response in optic neuritis. Lancet 299, 982–985.','Rasminsky (1973). The effects of temperature on conduction in demyelinated single nerve fibers. Archives of Neurology 28, 287–292.'],
 dur:10,hint:'Slide the share of myelin lost in the patch and watch the arriving signal. This is an illustration of the mechanism, not a picture of any person’s condition and not medical advice.',
 init:()=>({loss:40,warm:0}),
 watch(p){return {loss:Math.round(lerp(0,100,smooth(p))/5)*5,warm:0}},
 ui:[{range:'loss',label:'Myelin lost in the patch',min:0,max:100,step:5,get:s=>s.loss,act:'loss',show:v=>v+'%'},{choose:[[0,'Normal temperature'],[1,'Slightly warmer']],label:'Temperature',get:s=>s.warm,act:'warm'}],
 on:{loss(s,v){s.loss=+v},warm(s,v){s.warm=+v}},
 draw(s){
  const block=s.loss>B1_msBlock(s.warm),tau=B1_msTime(Math.min(s.loss,90)),delay=50*(tau-20)/1000;
  let out=heading(block?'The signal does not get through the patch':s.loss?`Each internode takes ${Math.round(tau)} µs: ${fmt(B1_r1(delay))} ms late`:'Intact myelin: 20 µs per internode');
  const y=104;out+=L(30,y,570,y,'#c9a15a',5);
  for(let i=0;i<18;i++){const x=34+i*30,inP=i>=6&&i<12,hgt=inP?Math.max(0,22*(1-s.loss/100)):22;if(hgt>1)out+=R(x,y-hgt/2,25,hgt,C.amberp,C.amber,Math.min(8,hgt/2))}
  out+=L(214,y+26,394,y+26,C.coral,1.5)+TF(304,y+44,'patch (stands for 50 internodes)',13,C.coral)+arrow(40,y-34,100,y-34,C.blue,2.2)+TF(70,y-42,'signal',13,C.blue);
  const pl=B1_plot(64,196,470,118,[0,40],[0,1.2],{xt:[[0,'0'],[10,'10'],[20,'20'],[30,'30'],[40,'40 ms']],yl:'signal recorded beyond the patch (time after the expected arrival)'});out+=pl.svg;
  const bump=(t0,amp,wd)=>{const pts=[];for(let i=0;i<=200;i++){const t=i/5;pts.push([pl.X(t),pl.Y(amp*Math.exp(-Math.pow((t-t0)/wd,2)))])}return pts};
  out+=B1_poly(bump(4,1,1.6),'#a9bfd0',1.8)+TF(pl.X(4)+12,pl.Y(1)+4,'intact fibre',13,C.muted,'start');
  if(block)out+=L(pl.X(0),pl.Y(0),pl.X(40),pl.Y(0),C.coral,2.6)+TF(pl.X(26),pl.Y(.5),'nothing arrives',13,C.coral);
  else if(s.loss)out+=B1_poly(bump(4+delay,1-.5*s.loss/90,1.6+3*s.loss/90),C.blue,2.6);
  out+=TF(300,348,s.warm?'Warmth shortens the current at each node, so a damaged fibre fails sooner.':'A fibre near its limit is sensitive to small changes, such as a rise in temperature.',13,C.muted);
  out+=TF(300,368,'Illustrative mapping, anchored on recordings from demyelinated rat fibres. Not medical advice.',13,C.muted);
  return {svg:out,phase:block?'With this much myelin gone the current reaching the next node is below threshold, as when two nodes were blocked in the first scene. Whether a pathway recovers depends on things this picture leaves out, including repair of the myelin and changes in the axon’s own channels.':s.loss?`The impulse still crosses, but every internode in the patch costs ${Math.round(tau)} millionths of a second where 20 is normal. Fibres are affected unequally, so a volley that set off together arrives spread out and smaller.`:'An intact fibre delivers its signal on time and at full size. Slide the loss upwards.'};
 }});

/* ===================== Lesson: glia ===================== */
const B1_GLIA={
 astro:{label:'Astrocyte',where:'brain and spinal cord',col:C.purple,text:'Star-shaped. Its end-feet cover blood vessels and its fine branches wrap synapses. It takes up potassium and transmitter released by neurons and passes fuel towards them.'},
 oligo:{label:'Oligodendrocyte',where:'brain and spinal cord',col:C.amber,text:'Makes myelin in the brain and spinal cord. One cell sends out many arms and wraps a segment of a different axon with each.'},
 micro:{label:'Microglia',where:'brain and spinal cord',col:C.green,text:'The resident immune cells. Their branches move constantly, checking the tissue; they clear debris and, in young animals, remove some synapses.'},
 schwann:{label:'Schwann cell',where:'nerves outside the brain',col:C.blue,text:'Makes myelin in the nerves of the body. Each cell wraps one segment of one axon, and helps a cut axon to regrow.'}};
const B1_GLIA_ORDER=['astro','oligo','micro','schwann'];
SCENE({id:'glia',name:'The other cells',tag:'Not just glue',
 definition:'In 1856 Rudolf Virchow named the material between nerve cells neuroglia, “nerve glue”, and took it for a kind of connective tissue. It is made of cells of several kinds. Astrocytes, oligodendrocytes and microglia fill the brain and spinal cord; Schwann cells wrap the nerves outside them. Pío del Río-Hortega distinguished microglia and oligodendrocytes around 1920.',
 example:'An oligodendrocyte can myelinate segments of dozens of axons, while a Schwann cell wraps just one segment. Microglia come from a different lineage altogether: they enter the brain early in development from blood-forming cells of the yolk sac.',
 desc:'A neuron and its axon with four kinds of glial cell around it: an astrocyte touching a blood vessel and a synapse, an oligodendrocyte wrapping two axons, a microglial cell, and Schwann cells along a peripheral nerve. Each can be pressed to read what it does.',
 research:['Virchow (1856). Gesammelte Abhandlungen zur wissenschaftlichen Medicin. Frankfurt: Meidinger.','Río-Hortega (1919–1921). Papers on microglia and oligodendroglia, Boletín de la Sociedad Española de Biología.','Ginhoux et al. (2010). Fate mapping analysis reveals that adult microglia derive from primitive macrophages. Science 330, 841–845.','Nimmerjahn, Kirchhoff & Helmchen (2005). Resting microglial cells are highly dynamic surveillants of brain parenchyma in vivo. Science 308, 1314–1318.'],
 dur:12,hint:'Press each kind of cell to read what it does.',
 init:()=>({sel:'astro'}),
 watch(p){return {sel:B1_GLIA_ORDER[Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:B1_GLIA_ORDER.map(k=>[k,B1_GLIA[k].label]),label:'Cell',get:s=>s.sel,act:'sel'}],
 on:{sel(s,v){s.sel=v}},
 draw(s,f,X){
  const g=B1_GLIA[s.sel],on=k=>s.sel===k,sw=k=>on(k)?3:1.6;
  let out=heading(`${g.label}: ${g.where}`);
  out+=TF(24,62,'brain and spinal cord',13,C.muted,'start')+L(20,268,376,268,C.line,1.2,'stroke-dasharray="5 5"')+TF(24,286,'a nerve outside them',13,C.muted,'start');
  // neuron with two axons
  out+=P('M60 110 C44 96 36 86 26 76M60 110 C46 118 38 128 26 136M60 110 C56 92 60 82 56 70',C.dark,2.2)+Ci(60,110,11,C.dark)+L(71,110,370,110,'#c9a15a',4)+L(110,168,370,168,'#c9a15a',4)+TF(60,140,'neuron',13,C.muted);
  // oligodendrocyte
  let o='';for(const [x,y] of [[190,110],[290,110],[236,168]])o+=L(236,74,x,y-9,C.amber,sw('oligo'))+R(x-30,y-9,60,18,C.amberp,C.amber,9);o+=Ci(236,74,10,on('oligo')?C.amber:C.amberp,C.amber);
  out+=hit(X,'sel','oligo','Oligodendrocyte',o);
  // astrocyte with end-foot on a vessel and a branch at a synapse
  out+=R(20,226,180,16,'#f3c9c0',C.coral,8)+TF(170,258,'blood vessel',13,C.coral,'end');
  let a='';for(const [x,y] of [[80,226],[140,226],[70,170],[150,150],[112,150],[160,200]])a+=L(112,190,x,y,C.purple,sw('astro'));a+=R(66,220,28,8,C.purple,'none',3)+R(126,220,28,8,C.purple,'none',3)+Ci(112,190,10,on('astro')?C.purple:C.purplep,C.purple);
  out+=hit(X,'sel','astro','Astrocyte',a);
  // microglia
  let m=Ci(326,220,7,on('micro')?C.green:C.greenp,C.green);for(let k=0;k<6;k++){const an=k/6*2*Math.PI+.4,x1=326+Math.cos(an)*22,y1=220+Math.sin(an)*18;m+=L(326,220,x1,y1,C.green,sw('micro'))+L(x1,y1,x1+Math.cos(an+.8)*10,y1+Math.sin(an+.8)*10,C.green,on('micro')?2:1.2)+L(x1,y1,x1+Math.cos(an-.8)*10,y1+Math.sin(an-.8)*10,C.green,on('micro')?2:1.2)}
  out+=hit(X,'sel','micro','Microglia',m);
  // Schwann cells
  let sc=L(24,318,370,318,'#c9a15a',4);for(let k=0;k<4;k++)sc+=R(40+k*84,307,70,22,on('schwann')?C.pale:'#eef5fa',C.blue,11)+Ci(75+k*84,318,4,C.blue);
  out+=hit(X,'sel','schwann','Schwann cell',sc);
  out+=B1_panel(388,52,198,300)+TB(400,80,g.label,15,g.col,'start');
  const gw=B1_wrap(400,104,g.text,26,13,C.ink);out+=gw.svg;
  out+=B1_wrap(400,gw.y+14,s.sel==='astro'?'How far they shape signalling is debated: see the last scene.':s.sel==='oligo'?'Its myelin is what multiple sclerosis damages.':s.sel==='micro'?'Named by Río-Hortega in 1919.':'Named after Theodor Schwann (1839).',26,13,C.muted).svg;
  return {svg:out,phase:`${g.label}. ${g.text} Glia do not fire impulses, which is one reason they were overlooked for a century.`};
 }});

// Azevedo et al. (2009): billions of neurons and of non-neuronal cells in the adult male human brain.
const B1_REG={whole:{label:'Whole brain',n:86.1,o:84.6},ctx:{label:'Cerebral cortex',n:16.3,o:60.8},cb:{label:'Cerebellum',n:69.0,o:16.0},rest:{label:'Rest of brain',n:.7,o:7.7}};
function B1_sample(reg,seed){const r=rng(seed),p=B1_REG[reg].n/(B1_REG[reg].n+B1_REG[reg].o);return range(100).map(()=>r()<p?1:0)}
SCENE({id:'glia-count',name:'Counting the brain’s cells',tag:'Not ten glia to every neuron',
 definition:'For decades textbooks said glia outnumber neurons ten to one, a figure with no clear source. In 2005 Suzana Herculano-Houzel and Roberto Lent found a way to count: dissolve the tissue into a soup of free cell nuclei, stain the neurons’ nuclei, and count samples under a microscope. The human brain has about 86 billion neurons and about 85 billion other cells.',
 example:'The ratio differs greatly by region. The cerebral cortex, white matter included, has almost four non-neuronal cells per neuron; the cerebellum, packed with tiny granule cells, has more than four neurons per non-neuronal cell and holds about 80% of the brain’s neurons.',
 desc:'A counting chamber holding 100 sampled nuclei coloured as neuronal or not, the learner’s running estimate of the cell numbers for the chosen brain region, and bars comparing their ratio with the published one and with the ten-to-one claim.',
 research:['Herculano-Houzel & Lent (2005). Isotropic fractionator: a simple, rapid method for the quantification of total cell and neuron numbers in the brain. Journal of Neuroscience 25, 2518–2521.','Azevedo et al. (2009). Equal numbers of neuronal and nonneuronal cells make the human brain an isometrically scaled-up primate brain. Journal of Comparative Neurology 513, 532–541.','von Bartheld, Bahney & Herculano-Houzel (2016). The search for true numbers of neurons and glial cells in the human brain: a review of 150 years of cell counting. Journal of Comparative Neurology 524, 3865–3895.'],
 dur:10,hint:'Choose a region and press Count a sample a few times. Each sample is 100 nuclei; your estimate settles as you count more. Samples are simulated from the published totals.',
 init:()=>({reg:'whole',n:0,k:0,last:null}),
 watch(p){const reg=p<.5?'whole':p<.75?'ctx':'cb',q=p<.5?p*2:((p-.5)*4)%1,m=1+Math.floor(q*4.99);let k=0,last=null;for(let i=0;i<m;i++){last=B1_sample(reg,7001+i*37+reg.length);k+=sum(last)}return {reg,n:m*100,k,last}},
 ui:[{choose:[['whole','Whole brain'],['ctx','Cerebral cortex'],['cb','Cerebellum'],['rest','Rest']],label:'Region',get:s=>s.reg,act:'reg'},{b:'Count a sample',act:'sample'}],
 on:{reg(s,v){s.reg=v;s.n=0;s.k=0;s.last=null},sample(s){s.last=B1_sample(s.reg,nextSeed());s.n+=100;s.k+=sum(s.last)}},
 draw(s){
  const G=B1_REG[s.reg],tot=G.n+G.o,pubRatio=G.o/G.n,frac=s.n?s.k/s.n:null,ratio=frac===null?null:frac>0?(1-frac)/frac:null;
  let out=heading(s.n?`${s.k} of ${s.n} nuclei are neurons`:`${G.label}: count a sample of nuclei`);
  out+=R(30,56,210,210,'#fbfbf6',C.line,6);for(let i=1;i<10;i++)out+=L(30+i*21,56,30+i*21,266,C.grid,1)+L(30,56+i*21,240,56+i*21,C.grid,1);
  if(s.last)s.last.forEach((v,i)=>{out+=Ci(40.5+(i%10)*21,66.5+Math.floor(i/10)*21,6,v?C.coral:C.blue)});else out+=TF(135,166,'empty chamber',13,C.muted);
  out+=Ci(40,286,6,C.coral)+TF(52,290,'neuron (stained nucleus)',13,C.ink,'start')+Ci(40,308,6,C.blue)+TF(52,312,'other cell',13,C.ink,'start');
  out+=TB(270,74,`${G.label}, billions of cells`,14,C.ink,'start');
  const row=(y,lab,a,b,col)=>TF(270,y,lab,13,C.muted,'start')+TB(430,y,a,14,col,'end')+TB(566,y,b,14,col,'end');
  out+=TF(430,98,'neurons',13,C.coral,'end')+TF(566,98,'other cells',13,C.blue,'end');
  out+=row(122,'your estimate',frac===null?'?':fmt(B1_r1(frac*tot)),frac===null?'?':fmt(B1_r1((1-frac)*tot)),C.ink)+row(146,'published',fmt(G.n),fmt(G.o),C.green);
  out+=TB(270,190,'Other cells for each neuron',14,C.ink,'start');
  const bar=(y,lab,v,col)=>TF(270,y+13,lab,13,C.muted,'start')+R(372,y,150,17,'#f1f5f8','none',4)+(v===null?'':R(372,y,clamp(v/12,0.01,1)*150,17,col,'none',4))+TB(530,y+14,v===null?'?':fmt(Math.round(v*100)/100),14,col,'start');
  out+=bar(204,'yours',ratio,C.blue)+bar(232,'published',pubRatio,C.green)+bar(260,'the old claim',10,C.muted);
  out+=B1_wrap(270,306,s.reg==='whole'?'About one to one. “Other cells” also includes the cells of blood vessels, so glia are, if anything, fewer than neurons.':s.reg==='ctx'?'The cortex and its white matter do have more glia than neurons, though nowhere near ten to one.':s.reg==='cb'?'The cerebellum is the other way round: neurons far outnumber the rest.':'The brainstem and deep structures have few neurons and many other cells; the ratio here is the nearest to the old claim.',44,13,C.ink).svg;
  out+=TF(300,372,'Totals for the whole brain: 86.1 ± 8.1 billion neurons, 84.6 ± 9.8 billion other cells (four brains).',12.5,C.muted);
  return {svg:out,phase:!s.n?'The method turns a brain region into a uniform suspension of nuclei, so that a few small samples stand for the whole. Count one.':s.n<300?`From ${s.n} nuclei your estimate is rough: one sample of 100 can easily be off by several. Count more.`:`After ${s.n} nuclei your estimate is ${ratio===null?'not yet defined':fmt(Math.round(ratio*100)/100)} other cells per neuron; the published figure is ${fmt(Math.round(pubRatio*100)/100)}. The ten-to-one claim does not survive counting, for the brain as a whole.`};
 }});

// A glial cell behaves as a potassium electrode: V = 59 log10(K_o/K_i) with K_i near 100 mM (amphibian, about 20 °C).
const B1_gliaV=k=>59*Math.log10(k/100);
const B1_gliaK=rate=>3+.85*rate;
SCENE({id:'glia-potassium',name:'Listening in on a glial cell',tag:'Glia feel the neurons’ potassium',
 definition:'In the 1960s Stephen Kuffler, John Nicholls and Richard Orkand recorded from glial cells for the first time. The cells fired no impulses, but their membrane behaved as an almost perfect potassium electrode, following Nernst’s line. When neighbouring axons fired, the potassium they released into the narrow spaces between cells depolarised the glia.',
 example:'With 3 mM potassium outside, the glial cell rests near −90 mV. A burst of impulses in the optic nerve of a mudpuppy, a salamander, shifted it by tens of millivolts, and it recovered over several seconds as the potassium was cleared. Taking up that potassium is one of the jobs of astrocytes.',
 desc:'A bundle of axons with a glial cell among them and an electrode in the glial cell; potassium collects between the cells as the axons fire faster. A plot shows the glial membrane potential on Nernst’s line for potassium.',
 research:['Kuffler, Nicholls & Orkand (1966). Physiological properties of glial cells in the central nervous system of amphibia. Journal of Neurophysiology 29, 768–787.','Orkand, Nicholls & Kuffler (1966). Effect of nerve impulses on the membrane potential of glial cells in the central nervous system of amphibia. Journal of Neurophysiology 29, 788–806.'],
 dur:10,hint:'Raise the rate at which the axons fire and watch the potassium between the cells, and the glial cell’s voltage, respond. The amounts are illustrative.',
 init:()=>({rate:0}),
 watch(p){return {rate:Math.round(lerp(0,20,.5-.5*Math.cos(p*2*Math.PI)))}},
 ui:[{range:'rate',label:'Axons firing',min:0,max:20,get:s=>s.rate,act:'rate',show:v=>v+' impulses a second'}],
 on:{rate(s,v){s.rate=+v}},
 draw(s){
  const K=B1_gliaK(s.rate),V=B1_gliaV(K),V0=B1_gliaV(3);
  let out=heading(`Potassium outside ${fmt(B1_r1(K))} mM: glial cell at ${B1_mV(V,0)}`);
  for(const y of [92,128,236,272])out+=L(30,y,270,y,'#c9a15a',9)+(s.rate?P(`M${40+((y*7)%60)} ${y}l8 -7l8 7`,C.blue,1.6)+P(`M${150+((y*3)%70)} ${y}l8 -7l8 7`,C.blue,1.6):'');
  out+=TF(34,74,'axons',13,C.muted,'start')+R(50,152,200,60,C.purplep,C.purple,24)+TB(150,188,'glial cell',14,C.purple);
  const nd=Math.round(K*1.6);for(let i=0;i<nd;i++){const d=B1_DOTS[i];out+=Ci(36+d[0]*228,(i%2?140:224)+d[1]*8,3.2,C.coral)}
  out+=L(214,60,196,168,C.dark,2)+TF(220,58,'electrode',13,C.dark,'start')+TF(150,304,'dots: potassium between the cells',13,C.coral);
  const pl=B1_plot(360,66,212,220,[1,40],[-120,-20],{logx:true,xt:[[1,'1'],[3,'3'],[10,'10'],[30,'30 mM']],yt:[[-100,'−100'],[-60,'−60'],[-20,'−20']],xl:'potassium outside (log scale)',yl:'glial membrane potential, mV'});out+=pl.svg;
  out+=L(pl.X(1),pl.Y(B1_gliaV(1)),pl.X(40),pl.Y(B1_gliaV(40)),C.purple,1.8,'stroke-dasharray="6 5"')+TF(pl.X(30),pl.Y(B1_gliaV(30))+26,'Nernst',13,C.purple,'end');
  out+=Ci(pl.X(3),pl.Y(V0),4,'#fff',C.muted)+Ci(pl.X(K),pl.Y(V),6.5,C.coral,'#fff');
  out+=TF(300,348,s.rate?`Shift from rest: ${B1_mV(V-V0,0)}`:'At rest: 3 mM outside, about −90 mV.',14,C.ink);
  out+=TF(300,370,'59 mV per tenfold change (about 20 °C). Sizes illustrative.',13,C.muted);
  return {svg:out,phase:s.rate?`At ${s.rate} impulses a second the axons release potassium faster than it is cleared, and it rises to ${fmt(B1_r1(K))} mM. The glial cell depolarises by ${fmt(Math.round(V-V0))} mV, exactly as Nernst’s equation predicts. Glia register the activity of the neurons around them, and they help to carry the excess potassium away.`:'With the axons silent the glial cell sits at the potassium equilibrium potential. Unlike a neuron, it has almost no permeability to anything else, so Bernstein’s hypothesis fits glia better than it fits nerve.'};
 }});

const B1_CLAIMS=[
 {t:'Glia outnumber neurons ten to one.',a:'myth',why:'Counting gives about one non-neuronal cell per neuron in the whole human brain (Azevedo et al. 2009).'},
 {t:'Astrocytes take up potassium and glutamate from around synapses.',a:'yes',why:'Shown directly since the 1960s; without glutamate uptake, transmitter lingers and can damage neurons.'},
 {t:'Astrocytes release transmitters that steer synapses in everyday brain function.',a:'debated',why:'Proposed as the “tripartite synapse” (Araque et al. 1999). Some later experiments found no effect (Agulhon et al. 2010); the argument continues.'},
 {t:'Microglia remove some synapses while the young brain wires up.',a:'yes',why:'Seen in mice (Paolicelli et al. 2011; Schafer et al. 2012). How much this matters in people is still being worked out.'},
 {t:'Glia are packing material that only holds neurons in place.',a:'myth',why:'Virchow’s “glue” undersold them: glia insulate axons, control the fluid around neurons and act as the brain’s immune cells.'},
 {t:'One oligodendrocyte myelinates many axons; one Schwann cell wraps a single segment.',a:'yes',why:'Plain anatomy, visible in the electron microscope since the 1960s (Bunge 1968).'}];
const B1_VERD={yes:['Established',C.green],debated:['Debated',C.amber],myth:['Myth',C.coral]};
SCENE({id:'glia-debate',name:'Glia: established, debated or myth?',tag:'Sort six claims',
 definition:'Some things said about glia are firmly established, one is a long-lived myth, and one is an open research question. The open one is how far astrocytes take part in signalling: they respond to transmitters with waves of calcium, and whether they answer back in ways that matter for the working brain is debated.',
 example:'An astrocyte’s branches surround tens of thousands of synapses, and its calcium rises when they are active (Cornell-Bell et al. 1990). That astrocytes listen is accepted. Whether they release their own “gliotransmitters” under normal conditions has been argued both ways by leading laboratories.',
 desc:'Six claims about glia shown one at a time, each sorted by the learner into established, debated or myth, with the evidence given after each choice and a tally at the end.',
 research:['Cornell-Bell, Finkbeiner, Cooper & Smith (1990). Glutamate induces calcium waves in cultured astrocytes. Science 247, 470–473.','Araque, Parpura, Sanzgiri & Haydon (1999). Tripartite synapses: glia, the unacknowledged partner. Trends in Neurosciences 22, 208–215.','Agulhon, Fiacco & McCarthy (2010). Hippocampal short- and long-term plasticity are not modulated by astrocyte Ca²⁺ signaling. Science 327, 1250–1254.','Fiacco & McCarthy (2018) and Savtchouk & Volterra (2018). Dual perspectives on gliotransmission. Journal of Neuroscience 38, 3–13 and 14–25.','Paolicelli et al. (2011). Science 333, 1456–1458. Schafer et al. (2012). Neuron 74, 691–705.'],
 dur:14,hint:'Read each claim and press Established, Debated or Myth. Nothing is recorded outside this page.',
 init:()=>({i:0,ans:[]}),
 watch(p){const n=Math.min(6,Math.floor(p*6.6));return {i:Math.min(5,n),ans:B1_CLAIMS.slice(0,n).map(c=>c.a),auto:1}},
 ui:[{b:'Start again',act:'again'}],
 on:{pick(s,v){if(s.ans.length===s.i)s.ans.push(v)},next(s){if(s.ans.length>s.i&&s.i<5)s.i++},again(s){s.i=0;s.ans=[]}},
 draw(s,f,X){
  const c=B1_CLAIMS[s.i],done=s.ans.length>s.i,ans=s.ans[s.i],right=s.ans.filter((a,k)=>a===B1_CLAIMS[k].a).length,all=s.ans.length===6&&s.i===5;
  let out=heading(`Claim ${s.i+1} of 6`);
  out+=B1_panel(50,50,500,84,C.pale)+B1_wrap(300,84,'“'+c.t+'”',52,15,C.ink,22,'middle',TF).svg;
  ['yes','debated','myth'].forEach((k,j)=>{const x=64+j*162,V=B1_VERD[k],isAns=done&&c.a===k,chosen=done&&ans===k;
   const inner=R(x,150,148,40,isAns?V[1]:'#fff',chosen||isAns?V[1]:C.line,10)+TB(x+74,176,V[0],15,isAns?'#fff':V[1]);
   out+=done?inner:hit(X,'pick',k,V[0],inner)});
  if(done){const ok=ans===c.a;out+=B1_panel(50,206,500,96)+TB(64,230,s.auto?B1_VERD[c.a][0]:ok?'Yes: '+B1_VERD[c.a][0].toLowerCase()+'.':'The evidence says: '+B1_VERD[c.a][0].toLowerCase()+'.',14,B1_VERD[c.a][1],'start')+B1_wrap(64,252,c.why,66,13,C.ink).svg;
   if(s.i<5)out+=hit(X,'next','','Next claim',R(230,312,140,34,C.blue,'none',10)+TB(300,334,'Next claim ▶',14,'#fff'))}
  else out+=TF(300,250,'What does the evidence support?',14,C.muted);
  for(let k=0;k<6;k++){const a=s.ans[k];out+=Ci(240+k*24,362,7,a===undefined?'#fff':a===B1_CLAIMS[k].a?C.green:C.coral,a===undefined?C.line:'none')}
  if(all&&!s.auto)out+=TF(430,366,`${right} of 6 matched`,13,C.ink,'start');
  return {svg:out,phase:!done?'Decide before you look: is this established, still argued over, or a myth?':all?'The pattern across the six: what glia do for neurons (insulate, clear, defend) is well established; how much they join in the signalling itself is the live question.':c.why};
 }});
