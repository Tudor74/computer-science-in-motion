/* ===================== Levin Lab In Motion · Era 1 · Bioelectricity before the lab ===================== */
// Voltage in every cell, early bioelectricity, the vibrating probe, voltage dyes, gap junctions, and the
// question of whether a signal instructs or only permits.
// Every picture is a pure function of state, frame and X. Every voltage, ratio and count on screen is computed
// here (Nernst, Goldman–Hodgkin–Katz, a coupled-cell network, a toy dye or probe model). The only literals are
// published values (dates, ion concentrations from textbooks, reported current densities and gating constants),
// and each carries a research line.

/* ---- shared helpers ---- */
const L1_RTF=(c=37)=>8.314462*(273.15+c)/96485.33*1000;              // RT/F in mV
const L1_nernst=(out,inn,z=1,c=37)=>L1_RTF(c)/z*Math.log(out/inn);
// Textbook concentrations (mM) for a mammalian cell: inside and outside. Used as given in standard physiology texts.
const L1_ION={Ko:5,Ki:140,Nao:145,Nai:15,Clo:110,Cli:10};
// Goldman–Hodgkin–Katz voltage (mV) for K⁺, Na⁺ and Cl⁻ with relative permeabilities pK : pNa : pCl.
function L1_ghk(pK,pNa,pCl,o={}){const c={...L1_ION,...o};
 return L1_RTF()*Math.log((pK*c.Ko+pNa*c.Nao+pCl*c.Cli)/(pK*c.Ki+pNa*c.Nai+pCl*c.Clo))}
const L1_EK=L1_nernst(L1_ION.Ko,L1_ION.Ki),L1_ENA=L1_nernst(L1_ION.Nao,L1_ION.Nai),L1_ECL=L1_nernst(L1_ION.Clo,L1_ION.Cli,-1);
const L1_mv=(v,d=0)=>{const r=Math.round(v*Math.pow(10,d))/Math.pow(10,d);return (r<0?'−':r>0?'+':'')+Math.abs(r).toFixed(d)+' mV'};
const L1_n=(v,d=0)=>{const r=Math.round(v*Math.pow(10,d))/Math.pow(10,d);return (r<0?'−':'')+Math.abs(r).toFixed(d)};
const L1_note=(s,y=368)=>TF(300,y,s,13,C.muted);
const L1_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function L1_tile(x,y,w,label,value,col=C.blue){return R(x,y,w,46,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+38,value,15,col)}
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function L1_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// The six evidence labels, each with its own colour pair. The badge is drawn beside the claim it applies to.
const L1_LABELS={rep:['Replicated finding',C.green,C.greenp],single:['Single-lab finding',C.blue,C.pale],frame:['Framework or hypothesis',C.purple,C.purplep],
 spec:['Speculation',C.amber,C.amberp],debate:['Criticism and debate',C.coral,C.coralp],model:['Simplified model',C.dark,'#eef2f4']};
const L1_badgeW=k=>Math.round(L1_LABELS[k][0].length*7.1+18);
function L1_badge(x,y,k,anchor='start'){const [lab,ink,fill]=L1_LABELS[k],w=L1_badgeW(k),x0=anchor==='end'?x-w:anchor==='middle'?x-w/2:x;
 return R(x0,y,w,20,fill,ink,10,k==='model'?'stroke-dasharray="4 3" stroke-width="1.4"':'stroke-width="1.4"')+TBF(x0+w/2,y+14.5,lab,12.5,ink)}
// Several badges in a row from x, left to right.
function L1_badges(x,y,keys){let out='',cx=x;for(const k of keys){out+=L1_badge(cx,y,k);cx+=L1_badgeW(k)+8}return out}
// Voltage colour: blue for more negative (hyperpolarised), coral for less negative; always paired with numbers.
function L1_vcol(v,lo=-90,hi=0){const u=clamp((v-lo)/(hi-lo),0,1);const a=[23,114,183],b=[196,82,56],w=[246,246,246];
 const m=u<.5?a.map((q,i)=>Math.round(lerp(q,w[i],u*2))):w.map((q,i)=>Math.round(lerp(q,b[i],(u-.5)*2)));return `rgb(${m.join(',')})`}
const L1_vhex=(v,lo,hi)=>'#'+L1_vcol(v,lo,hi).match(/\d+/g).map(q=>(+q).toString(16).padStart(2,'0')).join('');
// A voltage colour bar with labelled ends (colour is never the only code).
function L1_vbar(x,y,w,lo,hi,label='membrane voltage'){let out='';const n=24;for(let i=0;i<n;i++)out+=R(x+i*w/n,y,w/n+.5,12,L1_vcol(lo+(hi-lo)*(i+.5)/n,lo,hi),'none',0);
 return out+R(x,y,w,12,'none',C.line,2)+TF(x,y+28,L1_mv(lo),13,C.muted,'start')+TF(x+w,y+28,L1_mv(hi),13,C.muted,'end')+TF(x+w/2,y+28,label,13,C.muted)}
// Thomas algorithm for a tridiagonal system a[i]x[i-1]+b[i]x[i]+c[i]x[i+1]=d[i].
function L1_tridiag(a,b,c,d){const n=b.length,cp=new Array(n),dp=new Array(n),x=new Array(n);cp[0]=c[0]/b[0];dp[0]=d[0]/b[0];
 for(let i=1;i<n;i++){const m=b[i]-a[i]*cp[i-1];cp[i]=c[i]/m;dp[i]=(d[i]-a[i]*dp[i-1])/m}
 x[n-1]=dp[n-1];for(let i=n-2;i>=0;i--)x[i]=dp[i]-cp[i]*x[i+1];return x}
// Steady state of a row of n coupled cells: each cell has membrane conductance gm[i] to its own resting voltage E[i],
// gap-junction conductance gj between neighbours, and injected current I[i]. Returns voltages.
function L1_row(E,gm,gj,I){const n=E.length,a=[],b=[],c=[],d=[];
 for(let i=0;i<n;i++){const gl=i>0?gj:0,gr=i<n-1?gj:0;a.push(-gl);c.push(-gr);b.push(gm[i]+gl+gr);d.push(gm[i]*E[i]+(I[i]||0))}
 return L1_tridiag(a,b,c,d)}
// Steady state of a 2D sheet (W×H) by Gauss–Seidel to convergence. gjAt(i,j) gives the conductance between two cell indices.
function L1_sheet(W,H,E,gm,gjAt,iters=600){const n=W*H,V=E.slice();
 for(let it=0;it<iters;it++){let dmax=0;
  for(let k=0;k<n;k++){const x=k%W,y=(k/W)|0;let num=gm[k]*E[k],den=gm[k];
   for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=W||yy>=H)continue;const kk=yy*W+xx,g=gjAt(k,kk);num+=g*V[kk];den+=g}
   const v=num/den;dmax=Math.max(dmax,Math.abs(v-V[k]));V[k]=v}
  if(dmax<1e-6)break}
 return V}

/* ===================== Lesson: membrane-voltage ===================== */
// Scene 1: pumps make the gradients, channels make the voltage. The learner sets channel openness (permeabilities).
const L1_pNa=r=>Math.round(Math.pow(10,r/10)*1000)/1000;
SCENE({id:'membrane-voltage',name:'A voltage across every membrane',tag:'Replicated finding · Pumps and channels set it',
 definition:'Almost every living cell keeps a voltage across its membrane, inside negative. Pumps such as the sodium–potassium pump (the Na⁺/K⁺-ATPase) keep potassium high inside and sodium high outside; channels then let some ions leak back, and the leak sets the voltage. Julius Bernstein proposed in 1902 that a membrane open mainly to potassium explains the resting voltage of nerve and muscle. The same physics holds in skin, gut, embryonic and stem cells. This is textbook physiology, confirmed in many labs.',
 example:`With the textbook concentrations shown and a membrane mostly open to potassium (sodium 0.04 times as permeant), the Goldman–Hodgkin–Katz equation gives ${L1_mv(L1_ghk(1,.04,0))}. Open more sodium channels and the voltage moves towards sodium’s equilibrium of ${L1_mv(L1_ENA)}; the gradients have not changed, only the leak.`,
 desc:'A cell with a pump and potassium, sodium and chloride channels, beside a voltage scale marked with each ion’s equilibrium voltage and a pointer at the computed membrane voltage, and the equation with its numbers.',
 research:['Bernstein (1902). Untersuchungen zur Thermodynamik der bioelektrischen Ströme. Pflügers Archiv 92, 521–562 (the membrane hypothesis).','Goldman (1943), Journal of General Physiology 27; Hodgkin & Katz (1949), Journal of Physiology 108 (the voltage equation for several ions).','Skou (1957), Biochimica et Biophysica Acta 23 (the Na⁺/K⁺-ATPase).'],
 dur:10,hint:'Open sodium and chloride channels with the sliders and watch the computed voltage move between the equilibrium voltages. The basics are taught in Brain In Motion’s resting-potential scenes.',
 init:()=>({r:-14,cl:0}),
 watch(p){return {r:Math.round(lerp(-20,0,smooth(clamp(p*1.3,0,1)))),cl:p>.8?4:0}},
 ui:[{range:'r',label:'Sodium channels open',min:-20,max:10,get:s=>s.r,act:'r',show:v=>fmt(L1_pNa(v))+' × potassium'},{range:'cl',label:'Chloride channels open',min:0,max:10,get:s=>s.cl,act:'cl',show:v=>fmt(v/10)+' × potassium'},{b:'Mostly potassium',act:'rest'}],
 on:{r(s,v){s.r=clamp(Math.round(+v),-20,10)},cl(s,v){s.cl=clamp(Math.round(+v),0,10)},rest(s){s.r=-14;s.cl=0}},
 draw(s){
  const pNa=L1_pNa(s.r),pCl=s.cl/10,V=L1_ghk(1,pNa,pCl);
  let out=heading(`Computed membrane voltage ${L1_mv(V)}`);
  // the cell
  const cx=150,cy=176,rad=92;
  out+=Ci(cx,cy,rad,C.pale,C.blue)+TF(cx,cy-36,'inside',13,C.muted)+TF(cx,cy+rad+22,'outside',13,C.muted);
  out+=TF(cx,cy-8,`K⁺ ${L1_ION.Ki}  Na⁺ ${L1_ION.Nai}  Cl⁻ ${L1_ION.Cli}`,13,C.ink)+TF(cx,cy+12,'mM inside',13,C.muted);
  out+=TF(cx,cy+rad+40,`outside: K⁺ ${L1_ION.Ko}  Na⁺ ${L1_ION.Nao}  Cl⁻ ${L1_ION.Clo} mM`,13,C.muted);
  // pump at the top, channels around the rim (counts drawn from the permeabilities)
  const pump=(a)=>{const x=cx+rad*Math.cos(a),y=cy+rad*Math.sin(a);return Ci(x,y,13,C.amberp,C.amber)+TBF(x,y+4,'P',12,C.amber)};
  out+=pump(-Math.PI/2)+TF(cx,cy-rad-20,'Na⁺/K⁺ pump: 3 Na⁺ out, 2 K⁺ in',13,C.amber);
  const chans=[['K',6,C.purple]].concat([['Na',Math.min(6,Math.round(pNa*6)),C.coral],['Cl',Math.round(pCl*6),C.green]]);
  let a0=-Math.PI/2+.45;for(const [k,n,col] of chans)for(let i=0;i<n;i++){const x=cx+rad*Math.cos(a0),y=cy+rad*Math.sin(a0);out+=R(x-5,y-5,10,10,col,'none',2);a0+=.3}
  // voltage axis
  const ax=330,y0=60,y1=250,Yv=v=>y1-(v+100)/170*(y1-y0);
  out+=L(ax,y0,ax,y1,C.line,3);for(const v of [-100,-50,0,50])out+=L(ax-6,Yv(v),ax,Yv(v),C.muted,1.4)+TF(ax-10,Yv(v)+4,v===0?'0':L1_n(v),13,C.muted,'end');
  const mark=(v,lab,col)=>L(ax,Yv(v),ax+22,Yv(v),col,3)+TF(ax+28,Yv(v)+4,lab+' '+L1_mv(v),13,col,'start');
  out+=mark(L1_ENA,'E Na⁺',C.coral)+mark(L1_EK,'E K⁺',C.purple)+mark(L1_ECL,'E Cl⁻',C.green);
  out+=`<polygon points="${ax-4},${fmt(Yv(V))} ${ax-20},${fmt(Yv(V)-8)} ${ax-20},${fmt(Yv(V)+8)}" fill="${C.ink}"/>`+TBF(ax-24,Yv(V)+5,L1_n(V),14,C.ink,'end');
  // the equation with its numbers
  out+=R(300,268,290,84,'#fff',C.grid,8)+TF(312,288,'V = 26.7 mV × ln(top ÷ bottom)',13,C.ink,'start')+TMF(312,309,`top: 5 + ${fmt(pNa)}×145 + ${fmt(pCl)}×10`,13,C.ink,'start')+TMF(312,328,`bottom: 140 + ${fmt(pNa)}×15 + ${fmt(pCl)}×110`,13,C.ink,'start')+TBF(312,346,'= '+L1_mv(V,1),13,C.blue,'start');
  out+=L1_badge(590,110,'rep','end');
  out+=L1_note('Textbook mammalian concentrations at 37 °C. Permeabilities are relative to potassium’s.',366);
  return {svg:out,phase:pNa<.1&&pCl<.2?`Mostly potassium channels are open, so the voltage sits at ${L1_mv(V)}, a little above potassium’s equilibrium of ${L1_mv(L1_EK)}. This is a resting potential, and nerve cells are not special in having one.`:
   pCl>=.3?`Chloride channels pull the voltage towards chloride’s equilibrium of ${L1_mv(L1_ECL)}. In many non-nerve cells chloride matters as much as sodium. The computed voltage is ${L1_mv(V)}.`:
   `With sodium ${fmt(pNa)} times as permeant as potassium, the voltage is ${L1_mv(V)}: the cell is less negative inside, or depolarised. Nothing about the gradients the pump made has changed; only which channels are open.`};
 }});

// Scene 2: the pump keeps the gradients. Toy chord-conductance model; time in arbitrary units.
// gK = 1, gNa chosen; pump rate p fixed so that the textbook concentrations are a steady state.
const L1_PG={gK:1,gNa:.06,k:.2};
L1_PG.V0=(L1_PG.gNa*L1_ENA+1.5*L1_EK)/(L1_PG.gNa+1.5);
L1_PG.p=(L1_PG.V0-L1_EK)/2;
// Simulate from t=0 to t (units) with the pump switched by the schedule (sorted list of [time,on]).
function L1_pumpRun(sched,t){const dt=.25,o=L1_PG;let Ki=L1_ION.Ki,Nai=L1_ION.Nai,on=1,j=0;const out=[];
 for(let s=0;s<=Math.round(t/dt);s++){const now=s*dt;while(j<sched.length&&sched[j][0]<=now+1e-9){on=sched[j][1];j++}
  const EK=L1_nernst(L1_ION.Ko,Ki),ENa=L1_nernst(L1_ION.Nao,Nai),p=on?o.p:0,V=(o.gK*EK+o.gNa*ENa-p)/(o.gK+o.gNa);
  if(s%4===0)out.push({t:now,V,Ki,Nai,on});
  Nai=clamp(Nai+o.k*dt*(-o.gNa*(V-ENa)-3*p),1,140);Ki=clamp(Ki+o.k*dt*(-o.gK*(V-EK)+2*p),6,160)}
 return out}
const L1_PUMP_T=240;
SCENE({id:'membrane-voltage-pump',name:'The pump keeps the battery charged',tag:'Simplified model · Replicated finding: pumps hold the gradients',
 definition:'Channels set the voltage from moment to moment, but every ion that leaks through runs the gradients down a little. The Na⁺/K⁺ pump spends ATP to push three sodium ions out and two potassium ions in, and so keeps the gradients, and the voltage, in place. Stop the pump and the cell’s battery slowly goes flat: sodium creeps in, potassium leaks out and the voltage drifts towards zero.',
 example:'In this toy model the starting gradients are a steady state: pump and leaks balance. Switch the pump off and the computed sodium inside climbs while the voltage falls towards zero over many time units; switch it back on and the gradients recover. The timescale is arbitrary.',
 desc:'A plot of the computed membrane voltage over time, with the inside sodium and potassium concentrations below it and shaded stretches where the pump is off.',
 research:['Skou (1957). The influence of some cations on an adenosine triphosphatase from peripheral nerves. Biochimica et Biophysica Acta 23, 394–401 (Nobel Prize 1997).','Toy model written for this course: chord-conductance voltage with leak currents and a fixed pump rate; cell volume, chloride and other transporters are left out.'],
 dur:12,hint:'Switch the pump off, let time pass, then switch it on again. The time units are arbitrary. Biology In Motion’s membranes-pumps-cycle scene shows the pump’s cycle step by step.',
 init:()=>({sched:[],t:20}),
 watch(p){return {sched:[[30,0],[150,1]],t:Math.max(1,Math.round(p*L1_PUMP_T))}},
 ui:[{b:'Switch the pump off',act:'off'},{b:'Switch the pump on',act:'on'},{b:'Let 20 time units pass',act:'wait'},{b:'Start again',act:'reset'}],
 on:{off(s){if(s.t>=L1_PUMP_T)return;s.sched=s.sched.concat([[s.t,0]]);s.t=Math.min(L1_PUMP_T,s.t+20)},on(s){if(s.t>=L1_PUMP_T)return;s.sched=s.sched.concat([[s.t,1]]);s.t=Math.min(L1_PUMP_T,s.t+20)},wait(s){s.t=Math.min(L1_PUMP_T,s.t+20)},reset(s){s.sched=[];s.t=20}},
 draw(s){
  const run=L1_pumpRun(s.sched,s.t),last=run[run.length-1];
  let out=heading(last.on?(last.Nai>L1_ION.Nai+3?'Pump on: the gradients are recovering':'Pump on: leaks and pump balance'):'Pump off: the battery runs down');
  const pl=L1_plot(70,62,360,150,[0,L1_PUMP_T],[-90,0],{yt:[[-90,'−90'],[-60,'−60'],[-30,'−30'],[0,'0']],xt:[[0,'0'],[120,'120'],[240,'240']],yl:'voltage (mV)'});
  out+=pl.svg;
  // shade pump-off stretches
  for(let i=0;i<run.length-1;i++)if(!run[i].on)out+=R(pl.X(run[i].t),62,pl.X(run[i+1].t)-pl.X(run[i].t)+.5,150,C.amberp,'none',0,'opacity=".8"');
  out+=L1_poly(run.map(r=>[pl.X(r.t),pl.Y(r.V)]),C.blue,2.6);
  const pc=L1_plot(70,250,360,60,[0,L1_PUMP_T],[0,160],{xt:[[0,'0'],[120,'120'],[240,'240']],yt:[[0,'0'],[140,'140']],xl:'time (arbitrary units)'});
  out+=pc.svg+L1_poly(run.map(r=>[pc.X(r.t),pc.Y(r.Ki)]),C.purple,2.2)+L1_poly(run.map(r=>[pc.X(r.t),pc.Y(r.Nai)]),C.coral,2.2);
  out+=TF(76,242,'inside K⁺ and Na⁺ (mM)',13,C.muted,'start');
  out+=L1_tile(452,62,132,'Voltage now',L1_mv(last.V))+L1_tile(452,116,132,'K⁺ inside',L1_n(last.Ki)+' mM',C.purple)+L1_tile(452,170,132,'Na⁺ inside',L1_n(last.Nai)+' mM',C.coral)+L1_tile(452,224,132,'Pump',last.on?'on':'off',last.on?C.green:C.amber);
  out+=L1_badges(452,286,['model'])+L1_badge(452,312,'rep');
  out+=L1_note('Toy model: arbitrary time units; volume, chloride and other transporters are left out.',366);
  return {svg:out,phase:last.on?(last.Nai>L1_ION.Nai+3?`With the pump running again, sodium inside is falling back (${L1_n(last.Nai)} mM now) and the voltage has returned to ${L1_mv(last.V)}. The pump does not set the voltage directly here; it restores the gradients the channels use.`:`Pump and leaks balance: sodium inside stays at ${L1_n(last.Nai)} mM and the voltage at ${L1_mv(last.V)}. Every cell pays a steady energy cost to keep this up.`):
   `With the pump off, sodium inside has risen to ${L1_n(last.Nai)} mM and potassium fallen to ${L1_n(last.Ki)} mM. The computed voltage has drifted to ${L1_mv(last.V)}. Drugs that block the pump do this to real cells, more slowly or quickly depending on the cell.`};
 }});

// Scene 3: cell types differ. Illustrative channel mixes for model cells; the published trend is drawn without numbers.
const L1_TYPES={
 mature:{label:'Mature, non-dividing (model)',pK:1.6,pNa:.03,pCl:.1,col:C.blue},
 resting:{label:'Resting, can divide (model)',pK:1,pNa:.12,pCl:.3,col:C.purple},
 dividing:{label:'Dividing or stem (model)',pK:.6,pNa:.25,pCl:.6,col:C.coral}};
SCENE({id:'membrane-voltage-types',name:'Different cells, different voltages',tag:'Replicated finding · A trend linking voltage and division',
 definition:'Resting voltage differs between cell types. Surveys of many measurements found a broad trend: cells that divide often, including embryonic, stem and many tumour cells, tend to be depolarised (less negative inside), while mature cells that no longer divide, such as nerve and muscle, tend to be strongly negative. The trend has been reported by many groups; it is a correlation, and it does not by itself show that voltage controls division.',
 example:'In the model, cutting the number of potassium channels while sodium and chloride leaks stay the same moves a cell from the strongly negative end of the scale towards the depolarised end. In culture, Sundelacruz, Levin and Kaplan reported that keeping human mesenchymal stem cells depolarised suppressed their differentiation: one group’s result, an example of the experiments that ask whether voltage is cause or consequence.',
 desc:'A voltage scale with model cells placed at their computed voltages, an arrow showing the published trend from dividing to mature cells without numbers, and a note on one culture experiment.',
 research:['Binggeli & Weinstein (1986). Membrane potentials and sodium channels: hypotheses for growth regulation and cancer formation based on changes in sodium channels and gap junctions. Journal of Theoretical Biology 123, 377–401.','Sundelacruz, Levin & Kaplan (2009). Role of membrane potential in the regulation of cell proliferation and differentiation. Stem Cell Reviews and Reports 5, 231–246.','Sundelacruz, Levin & Kaplan (2008). Membrane potential controls adipogenic and osteogenic differentiation of mesenchymal stem cells. PLoS ONE 3, e3737.'],
 dur:10,hint:'Pick a model cell, then change how many potassium channels it expresses and see where its computed voltage lands on the scale. The channel mixes are illustrative.',
 init:()=>({type:'resting',k:0}),
 watch(p){const t=['mature','resting','dividing'][Math.min(2,Math.floor(p*3))];return {type:t,k:0}},
 ui:[{choose:[['mature','Mature'],['resting','Resting'],['dividing','Dividing']],label:'Model cell',get:s=>s.type,act:'type'},{range:'k',label:'Potassium channels (change)',min:-8,max:8,get:s=>s.k,act:'k',show:v=>(v>=0?'×':'×')+fmt(Math.round(Math.pow(2,v/4)*100)/100)}],
 on:{type(s,v){s.type=L1_TYPES[v]?v:'resting';s.k=0},k(s,v){s.k=clamp(Math.round(+v),-8,8)}},
 draw(s){
  const ty=L1_TYPES[s.type],f=Math.pow(2,s.k/4),V=L1_ghk(ty.pK*f,ty.pNa,ty.pCl);
  let out=heading(`${ty.label}: ${L1_mv(V)}`);
  const x0=60,x1=540,Xv=v=>x0+(v+100)/100*(x1-x0),ya=150;
  out+=L(x0,ya,x1,ya,C.line,3);for(const v of [-100,-75,-50,-25,0])out+=L(Xv(v),ya,Xv(v),ya+7,C.muted,1.4)+TF(Xv(v),ya+24,v===0?'0 mV':L1_n(v),13,C.muted);
  // the three presets as faint marks
  let row=0;for(const k in L1_TYPES){const t=L1_TYPES[k],v=L1_ghk(t.pK,t.pNa,t.pCl);out+=Ci(Xv(v),ya,7,k===s.type?'#fff':t.col,t.col)+TF(Xv(v),ya-18-14*(row%2),k===s.type?'':t.label.replace(' (model)',''),13,t.col);row++}
  out+=`<polygon points="${fmt(Xv(V))},${ya-4} ${fmt(Xv(V)-8)},${ya-20} ${fmt(Xv(V)+8)},${ya-20}" fill="${C.ink}"/>`+TBF(Xv(V),ya-26,L1_mv(V),14,C.ink);
  out+=L1_badge(60,58,'model')+TF(60+L1_badgeW('model')+8,72,'computed with the Goldman equation',13,C.muted,'start');
  // the published trend, no numbers
  out+=R(40,196,520,70,'#fff',C.grid,8)+L1_badge(52,204,'rep');
  out+=TF(52+L1_badgeW('rep')+8,218,'reported trend, drawn without numbers',13,C.muted,'start');
  out+=L(70,244,530,244,C.coral,2.5)+arrow(470,244,532,244,C.coral,2.5)+arrow(130,244,68,244,C.blue,2.5);
  out+=TF(548,236,'depolarised: dividing, embryonic, stem, tumour cells',13,C.coral,'end')+TF(52,260,'strongly negative: mature, non-dividing cells',13,C.blue,'start');
  // one culture experiment
  out+=R(40,278,520,62,C.pale,'none',8)+L1_badge(52,286,'single');
  out+=TF(52+L1_badgeW('single')+8,300,'Depolarised stem cells in culture',13,C.ink,'start')+TF(52,328,'differentiated less into bone and fat cells (Sundelacruz et al. 2008).',13,C.ink,'start');
  out+=L1_note('Model cells use illustrative permeabilities, not measured ones.',364);
  return {svg:out,phase:V<-70?`The model cell sits at ${L1_mv(V)}. Many potassium channels hold it near potassium’s equilibrium, like the mature, non-dividing cells at the negative end of the published trend.`:V>-40?`The model cell sits at ${L1_mv(V)}, well depolarised. Dividing cells in culture and in embryos often sit in this range, but a correlation like this cannot say which comes first.`:`The model cell sits at ${L1_mv(V)}, between the extremes. Real cells move along this scale as they divide, mature or change channel expression.`};
 }});

// Scene 4: fast and slow. A neuron changes permeability in a millisecond; a non-neural cell changes its channel numbers over hours.
const L1_RM=10,L1_CM=1;   // a typical specific membrane resistance (kΩ·cm²) and capacitance (µF/cm²) from textbooks
SCENE({id:'membrane-voltage-slow',name:'Fast in nerves, slow elsewhere',tag:'Simplified model · Replicated finding: slow voltage in non-neural cells',
 definition:'The membrane itself responds within milliseconds in every cell: its time constant, resistance times capacitance, is short. What differs is what drives it. A neuron opens and closes channels within a millisecond, so its voltage spikes. Most other cells change their voltage slowly, over minutes to days, as they make more or fewer channels and pumps, or as ion concentrations shift. It is these slow, steady voltages that the rest of this course is about.',
 example:`With a typical membrane resistance of ${L1_RM} kΩ·cm² and capacitance of ${L1_CM} µF/cm², the time constant is ${fmt(L1_RM*L1_CM)} ms. A neuron’s sodium channels open for about a millisecond and its voltage follows. A model skin cell that loses most of its potassium channels over a day moves just as far, but over hours.`,
 desc:'Two plots of computed voltage: a neuron over 6 milliseconds as its sodium permeability briefly jumps, and a model non-neural cell over 48 hours as its potassium channel number falls or rises.',
 research:['Hille (2001). Ion Channels of Excitable Membranes, 3rd ed. Sinauer (membrane time constant; channel gating).','Sundelacruz, Levin & Kaplan (2009). Stem Cell Reviews and Reports 5, 231–246 (slow voltage changes in non-excitable cells).'],
 dur:10,hint:'Set how many hours the model cell takes to change its channel expression, and whether it loses or gains potassium channels. Compare both time axes.',
 init:()=>({tau:8,dir:'lose'}),
 watch(p){return {tau:Math.round(lerp(4,16,p)),dir:p<.5?'lose':'gain',prog:clamp(p*2%1+.02,0,1)}},
 ui:[{range:'tau',label:'Hours to change expression',min:1,max:24,get:s=>s.tau,act:'tau',show:v=>v+' h'},{choose:[['lose','Loses K⁺ channels'],['gain','Gains K⁺ channels']],label:'Change',get:s=>s.dir,act:'dir'}],
 on:{tau(s,v){s.tau=clamp(Math.round(+v),1,24)},dir(s,v){s.dir=v==='gain'?'gain':'lose'}},
 draw(s,f,X){
  const prog=s.prog===undefined?1:s.prog;
  const spike=t=>{const u=(t-1.5)/.35;return u<0?0:20*Math.exp(-u*u*.9)*(u<.2?u/.2:1)};
  const pkCell=t=>s.dir==='lose'?1-.85*(1-Math.exp(-t/s.tau)):.15+.85*(1-Math.exp(-t/s.tau));
  let out=heading('The same equation on two timescales');
  const a=L1_plot(66,70,220,170,[0,6],[-100,60],{xt:[[0,'0'],[3,'3'],[6,'6 ms']],yt:[[-100,'−100'],[-50,'−50'],[0,'0'],[50,'50']],yl:'Neuron (mV)'});
  const b=L1_plot(352,70,220,170,[0,48],[-100,60],{xt:[[0,'0'],[24,'24'],[48,'48 h']],yt:[[-100,'−100'],[-50,'−50'],[0,'0'],[50,'50']],yl:'Model skin cell (mV)'});
  out+=a.svg+b.svg;
  const na=[],nb=[];for(let i=0;i<=Math.round(120*prog);i++){const t=i/120*6;na.push([a.X(t),a.Y(L1_ghk(1,.04+spike(t),.45))]);const h=i/120*48;nb.push([b.X(h),b.Y(L1_ghk(pkCell(h),.05,.2))])}
  out+=L1_poly(na,C.coral,2.6)+L1_poly(nb,C.blue,2.6);
  let vpk=-200;for(let i=0;i<=240;i++)vpk=Math.max(vpk,L1_ghk(1,.04+spike(i/240*6),.45));
  const v0=L1_ghk(pkCell(0),.05,.2),v48=L1_ghk(pkCell(48),.05,.2),v12=L1_ghk(pkCell(s.tau),.05,.2);
  out+=L1_tile(66,294,220,'Neuron peak, about 1.5 ms in',L1_mv(vpk),C.coral)+L1_tile(352,294,220,`After ${s.tau} h, then 48 h`,`${L1_mv(v12)}, ${L1_mv(v48)}`,C.blue);
  out+=L1_badge(66,268,'model')+L1_badge(352,268,'rep');
  out+=L1_note(`Membrane time constant in both: ${fmt(L1_RM)} kΩ·cm² × ${fmt(L1_CM)} µF/cm² = ${fmt(L1_RM*L1_CM)} ms.`,360);
  return {svg:out,phase:`The neuron swings to ${L1_mv(vpk)} and back within a few milliseconds because its sodium channels open and close that fast. The model skin cell starts at ${L1_mv(v0)} and, as it ${s.dir==='lose'?'loses':'gains'} potassium channels with a ${s.tau}-hour time course, ends at ${L1_mv(v48)}. Same equation; the slow part is gene expression, not the membrane.`};
 }});

/* ===================== Lesson: early-bioelectricity ===================== */
// Scene 1: animal electricity and the current of injury. The deflection is computed from the scene-1 resting voltage
// with a toy shunt factor (a cut surface is only partly the inside); no number is shown because the toy has no units.
const L1_INJ_SHUNT=.5;
const L1_TIMELINE=[[1791,'Galvani','frog legs twitch'],[1792,'Volta','“it is the metals”'],[1840,'Matteucci, du Bois-','Reymond: injury current'],[1902,'Bernstein','membrane theory']];
SCENE({id:'early-bioelectricity',name:'Animal electricity and the injury current',tag:'Replicated finding · Galvani to Bernstein, 1791–1902',
 definition:'In 1791 Luigi Galvani reported that frog legs twitched when touched with metal arcs, and argued that animals make their own electricity; Alessandro Volta replied that the two metals made it. In the 1840s Carlo Matteucci and Emil du Bois-Reymond, with sensitive galvanometers, measured a steady current between the cut end of a muscle and its intact surface: the current of injury. Bernstein’s membrane theory of 1902 explained it: a cut exposes the negative inside of the fibres.',
 example:'Place both electrodes on the intact surface of the muscle and the needle stays still: every point outside is at the same voltage. Cut the muscle and touch one electrode to the cut end: the needle swings, because the cut end is negative. These measurements have been repeated ever since; the theories about them changed.',
 desc:'A schematic muscle with two electrodes and a galvanometer needle, a knife to cut the muscle, and a date line from Galvani to Bernstein.',
 research:['Galvani (1791). De viribus electricitatis in motu musculari commentarius. Bologna.','du Bois-Reymond (1848–1884). Untersuchungen über thierische Elektricität. Berlin (the current of injury, also studied by Matteucci).','Bernstein (1902). Pflügers Archiv 92, 521–562. Brain In Motion’s animal-electricity scene tells the Galvani–Volta story in full.'],
 dur:10,hint:'Cut the muscle, then move the second electrode between the intact surface and the cut end and watch the needle. The deflection is drawn from a toy model with no units.',
 init:()=>({cut:0,place:'side'}),
 watch(p){return {cut:p>.3?1:0,place:p>.62?'end':'side'}},
 ui:[{b:'Cut the muscle',act:'cut'},{b:'Fresh, uncut muscle',act:'fresh'},{choose:[['side','Intact surface'],['end','Cut end']],label:'Second electrode on',get:s=>s.place,act:'place'}],
 on:{cut(s){s.cut=1},fresh(s){s.cut=0;s.place='side'},place(s,v){s.place=v==='end'?'end':'side'}},
 draw(s){
  const onEnd=s.cut&&s.place==='end',dv=onEnd?L1_INJ_SHUNT*L1_ghk(1,.04,0):0,ang=clamp(dv/90,-1,1)*55;
  let out=heading(onEnd?'The cut end is negative: current flows':!s.cut&&s.place==='end'?'Nothing to measure until it is cut':'Both electrodes outside: no current');
  // muscle
  const mx=70,mw=s.cut?300:340;
  out+=R(mx,120,mw,70,C.coralp,C.coral,30);for(let i=0;i<5;i++)out+=L(mx+24,134+i*11,mx+mw-24,134+i*11,'#e8b8a8',1.4);
  if(s.cut)out+=R(mx+mw-6,120,12,70,C.coral,'none',3)+TF(mx+mw+12,110,'cut end',13,C.coral,'start')+TF(mx+mw+12,212,'inside exposed',13,C.coral,'start');
  else out+=TF(mx+mw/2,212,'intact muscle',13,C.muted);
  // electrodes
  const e1=[mx+70,120],e2=onEnd?[mx+mw,150]:[mx+200,120];
  out+=L(e1[0],e1[1],e1[0],78,C.ink,2.5)+L(e2[0],e2[1],e2[0]+(onEnd?30:0),78,C.ink,2.5)+Ci(e1[0],e1[1],5,C.ink)+Ci(e2[0],e2[1],5,C.ink);
  // galvanometer
  const gx=500,gy=110;out+=Ci(gx,gy,54,'#fff',C.line)+P(`M${gx-44} ${gy} A44 44 0 0 1 ${gx+44} ${gy}`,C.grid,6);
  out+=L(e1[0],78,gx-30,78,C.ink,2)+L(e2[0]+(onEnd?30:0),78,gx-30,92,C.ink,2);
  const a=(ang-90)*Math.PI/180;out+=L(gx,gy,gx+42*Math.cos(a),gy+42*Math.sin(a),C.coral,3)+Ci(gx,gy,4,C.ink)+TF(gx,gy+30,'galvanometer',13,C.muted);
  out+=L1_badge(400,180,'rep');
  // date line
  out+=L(50,286,550,286,C.line,2);
  L1_TIMELINE.forEach((e,i)=>{const x=95+i*137;out+=Ci(x,286,6,C.blue)+TBF(x,272,e[0]===1840?'1840s':String(e[0]),13,C.ink)+TF(x,306,e[1],13,C.muted)+TF(x,322,e[2],13,C.muted)});
  out+=L1_note('Schematic. The needle angle comes from a toy model of the exposed inside; it has no units.',360);
  return {svg:out,phase:onEnd?'One electrode outside, one on the cut end: the needle swings. Inside each fibre is negative, and the cut surface lets the electrode see some of that voltage. Matteucci and du Bois-Reymond measured this steady current decades before anyone knew of membranes.':
   s.cut?'The muscle is cut, but both electrodes still touch the intact outer surface, which is all at one voltage. Move the second electrode to the cut end.':
   'An intact muscle at rest, with both electrodes on its surface. Every point outside is at the same voltage, so nothing flows through the galvanometer.'};
 }});

// Scene 2: Lund's Obelia. A toy rule: polyps form first at the apical end; above a toy threshold, an applied current
// delays the polyp at whichever end faces the cathode. Times are in toy units.
function L1_lund(s){const base={apex:1,base:1.6},dens=s.i/10;const facing={apex:s.dir==='apexCath'?'cathode':'anode',base:s.dir==='apexCath'?'anode':'cathode'};
 const t={};for(const e of ['apex','base']){t[e]=base[e]*(facing[e]==='cathode'&&dens>0?1+6*Math.max(0,dens-.6):1)}
 return {t,facing,first:t.apex<=t.base?'apex':'base',dens}}
SCENE({id:'early-bioelectricity-lund',name:'Lund’s currents and polarity',tag:'Single-lab finding · Elmer Lund’s laboratory, 1920s–1947',
 definition:'Elmer Lund at the University of Texas measured steady voltages along living things for over two decades. In the marine hydroid Obelia he reported that the tip end of a stem segment is electrically positive compared with its base, and that passing a weak steady current along a cut segment could decide which end regrew a polyp: the end facing the cathode could be held back. He gathered the work in Bioelectric Fields and Growth (1947). These are historical results from one laboratory, with the instruments of the time.',
 example:'With no current, a cut segment makes its first polyp at the end that was nearer the tip, its old polarity. Turn on a current above the toy threshold with the tip facing the cathode and, in the model, the base end makes its polyp first: the polarity has been reversed from outside.',
 desc:'A cut Obelia stem segment between two electrodes, with polyps growing at one or both ends, a current-strength slider with a toy threshold, and the order in which the ends regrow.',
 research:['Lund (1925). Experimental control of organic polarity by the electric current. V. Journal of Experimental Zoology (one paper of a series begun in the early 1920s).','Lund (1947). Bioelectric Fields and Growth. University of Texas Press.','Jaffe & Nuccitelli (1977). Electrical controls of development. Annual Review of Biophysics and Bioengineering 6 (a review that treats Lund’s work as an early landmark).'],
 dur:10,hint:'Choose which end faces the cathode and raise the current. In the toy model, the end facing the cathode is held back once the current passes a threshold.',
 init:()=>({i:0,dir:'apexCath'}),
 watch(p){return {i:Math.round(lerp(0,14,clamp(p*1.4,0,1))),dir:'apexCath'}},
 ui:[{range:'i',label:'Applied current (toy units)',min:0,max:15,get:s=>s.i,act:'i',show:v=>fmt(v/10)+' × threshold'},{choose:[['apexCath','Tip end to cathode'],['apexAn','Tip end to anode']],label:'Direction',get:s=>s.dir,act:'dir'}],
 on:{i(s,v){s.i=clamp(Math.round(+v),0,15)},dir(s,v){s.dir=v==='apexAn'?'apexAn':'apexCath'}},
 draw(s){
  const r=L1_lund(s),rev=r.first==='base';
  let out=heading(rev?'The base end regrows first: polarity reversed':'The tip end regrows first, as it would anyway');
  const y=170,x0=150,x1=450;
  // electrodes
  const lab=e=>r.facing[e]==='cathode'?'cathode −':'anode +';
  out+=R(40,110,50,120,r.dens>0?'#eef2f4':'#fafafa',C.line,6)+TF(65,250,lab('apex'),13,C.ink)+R(510,110,50,120,r.dens>0?'#eef2f4':'#fafafa',C.line,6)+TF(535,250,lab('base'),13,C.ink);
  if(r.dens>0)out+=arrow(s.dir==='apexCath'?480:120,94,s.dir==='apexCath'?120:480,94,C.amber,2.5)+TF(300,86,'current through the water',13,C.amber);
  // stem
  out+=L(x0,y,x1,y,C.green,6)+TF(x0,y+34,'tip end',13,C.muted)+TF(x1,y+34,'base end',13,C.muted);
  out+=TF(x0+40,y-14,'+',16,C.green)+TF(x1-40,y-14,'−',16,C.green)+TF(300,y+34,'measured: tip positive',13,C.green);
  // polyps: size by how early they form (toy)
  const polyp=(x,dirn,t)=>{const g=clamp(1.6/t-.2,0,1.2),sz=10+22*g;if(g<=.05)return TF(x+dirn*24,y+5,'held back',13,C.coral,dirn<0?'end':'start');
   let o=L(x,y,x+dirn*sz,y,C.green,5);for(const a of [-.7,-.35,0,.35,.7])o+=L(x+dirn*sz,y,x+dirn*(sz+12*Math.cos(a)),y+12*Math.sin(a)*1.6,C.green,2);return o};
  out+=polyp(x0,-1,r.t.apex)+polyp(x1,1,r.t.base);
  out+=L1_tile(150,272,140,'First polyp at',r.first==='apex'?'tip end':'base end',rev?C.coral:C.green)+L1_tile(310,272,140,'Current',r.dens>0?`${fmt(r.dens)} × threshold`:'off',C.amber);
  out+=L1_badge(40,56,'single')+L1_badge(560,56,'model','end');
  out+=L1_note('Toy model of Lund’s report; the threshold and times are not his numbers.',360);
  return {svg:out,phase:rev?'In the toy, the current holds back the tip end, which faces the cathode, so the base end makes the first polyp. Lund reported this kind of control of polarity by an applied current. It showed that a current can steer regrowth; it did not show that the stem’s own currents do.':
   r.dens>.6&&s.dir==='apexAn'?'The base end faces the cathode now, so the current only delays the end that was going to regrow second. The old polarity is kept.':
   r.dens>0?'This current is below the toy threshold, so both ends regrow in their usual order.':'No current. The segment keeps its old polarity: the tip end, measured as electrically positive, regrows first.'};
 }});

// Scene 3: Burr's fields. The learner sorts claims; the scene shows how each is judged now.
const L1_BURR=[
 {t:['Steady voltages can be measured between','two points on eggs, seeds and animals.'],ans:'meas',who:'Burr, Lane & Nims (1936); Lund',why:'Real voltages from a sensitive voltmeter; later instruments confirmed them.'},
 {t:['Developing frog eggs show voltage','differences between regions.'],ans:'meas',who:'Burr (1941)',why:'A measurement. Better probes later found steady currents through many eggs.'},
 {t:['An applied current can set which','end of a stem regrows.'],ans:'meas',who:'Lund (1920s)',why:'An experiment: voltage imposed from outside can steer regrowth.'},
 {t:['Bioelectric fields may help control','growth and polarity.'],ans:'hyp',who:'Lund (1947)',why:'Testable, but hard to test then; later lessons follow the tests.'},
 {t:['An electrical field is the organising','blueprint that shapes the whole body.'],ans:'not',who:'Burr & Northrop (1935)',why:'No experiment showed a field acting as a blueprint; biology set it aside.'},
 {t:['The field keeps the body’s form','while its molecules are replaced.'],ans:'not',who:'Burr',why:'Far beyond what voltmeter readings can show, then or since.'}];
const L1_BCAT={meas:['Measured',C.green],hyp:['Testable hypothesis',C.purple],not:['Not supported',C.coral],'':['Tap to sort',C.muted]};
SCENE({id:'early-bioelectricity-burr',name:'Burr’s fields: measurement and theory',tag:'Criticism and debate · Burr’s “L-fields”, 1935–1940s',
 definition:'Harold Saxton Burr, an anatomist at Yale, measured steady voltages on eggs, seeds, trees and animals from the 1930s, and with the philosopher F. S. C. Northrop proposed an “electro-dynamic theory of life” (1935): that an electrical field, which he later called the L-field, organises the body. His readings were real voltages. His broader claim, a field as the blueprint of form, was not supported by the evidence of his time, and as molecular biology rose the whole subject lost attention for decades.',
 example:'Sort each claim from this period. Measurements of steady voltages and Lund’s applied-current experiments stood up; the idea that bioelectricity helps control growth was a hypothesis waiting for better tools; the field as a blueprint of the body went beyond anything the readings could show.',
 desc:'Six cards with claims from Burr and Lund, which the learner sorts into measured, testable hypothesis and not supported, with a short verdict under each.',
 research:['Burr & Northrop (1935). The electro-dynamic theory of life. Quarterly Review of Biology 10, 322–333.','Burr & Northrop (1939). Evidence for the existence of an electro-dynamic field in living organisms. PNAS 25, 284–288; Burr (1941). Field properties of the developing frog’s egg. PNAS 27, 276–281.','Lund (1947). Bioelectric Fields and Growth. University of Texas Press.'],
 dur:12,hint:'Tap a card to sort it as measured, testable hypothesis or not supported, then read how the claim is judged now. Tap again to change your choice.',
 shared:'l1-burr',
 init:()=>({pick:['','','','','',''],show:-1}),
 watch(p){const k=Math.min(6,Math.floor(p*7)),pick=L1_BURR.map((c,i)=>i<k?c.ans:'');return {pick,show:k-1}},
 ui:[{b:'Show the verdicts',act:'all'},{b:'Clear',act:'clear'}],
 on:{card(s,i){i=+i;if(!(i>=0&&i<6))return 'keep';const order=['','meas','hyp','not'];s.pick=s.pick.slice();s.pick[i]=order[(order.indexOf(s.pick[i])+1)%4];s.show=i;return 'keep'},
  all(s){s.pick=L1_BURR.map(c=>c.ans);s.show=-1},clear(s){s.pick=['','','','','',''];s.show=-1}},
 draw(s,f,X){
  const done=s.pick.filter(Boolean).length,right=s.pick.filter((p,i)=>p&&p===L1_BURR[i].ans).length;
  let out=heading('Which claims stood up?');
  L1_BURR.forEach((c,i)=>{const col=i%2,row=(i/2)|0,x=20+col*286,y=48+row*96,pk=s.pick[i],[lab,ink]=L1_BCAT[pk];
   let inner=R(x,y,274,88,pk?'#fff':'#f6f9fb',pk?ink:C.grid,8)+TF(x+12,y+21,c.t[0],13,C.ink,'start')+TF(x+12,y+38,c.t[1],13,C.ink,'start')+TF(x+12,y+56,c.who,13,C.muted,'start');
   inner+=TBF(x+12,y+77,lab,13,ink,'start');
   if(pk&&pk!==c.ans)inner+=TF(x+262,y+77,'see verdict',13,C.muted,'end');else if(pk)inner+=TF(x+262,y+77,'✓',14,C.green,'end');
   out+=hit(X,'card',i,`Claim: ${c.t.join(' ')} Now: ${lab}. Press to change.`,inner)});
  const sh=s.show>=0?L1_BURR[s.show]:null;
  out+=R(20,340,560,36,C.pale,'none',8)+(sh?TF(30,363,sh.why,13,C.ink,'start'):TF(30,363,`${done} of 6 sorted, ${right} as most historians and biologists now judge them.`,13,C.ink,'start'));
  out+=L1_badge(580,24,'debate','end');
  return {svg:out,phase:sh?`${sh.who}: ${sh.t.join(' ')} Judged now: ${L1_BCAT[sh.ans][0].toLowerCase()}. ${sh.why}`:`${done} of 6 claims sorted. Burr’s and Lund’s voltage readings were real; the trouble was the step from readings to a field that designs the body. That step is the warning this course keeps in view.`};
 }});

/* ===================== Lesson: vibrating-probe ===================== */
// Scene 1: the principle. A toy cell with a current sink (left) and source (right) in a uniform medium (resistivity 1).
// Potential of a point current I: I/(4πr). The probe tip vibrates radially with amplitude a; the reading is the
// voltage difference between the ends of its swing, converted to current density by dividing by resistivity × distance.
const L1_PR={R:1,a:.08,src:[[.92,0,1],[-.92,0,-1]]};
const L1_phi=(x,y)=>L1_PR.src.reduce((t,[sx,sy,I])=>t+I/(4*Math.PI*Math.max(.05,Math.hypot(x-sx,y-sy))),0);
// Radial current density outward at angle th (radians, 0 = right) and distance d (cell radii from the centre).
function L1_probeJ(th,d){const a=L1_PR.a,c=Math.cos(th),s=Math.sin(th),p1=L1_phi((d+a)*c,(d+a)*s),p0=L1_phi((d-a)*c,(d-a)*s);return -(p1-p0)/(2*a)}
const L1_JREF=Math.abs(L1_probeJ(0,1.25));
SCENE({id:'vibrating-probe',name:'A probe for tiny steady currents',tag:'Replicated finding · Jaffe and Nuccitelli’s probe, 1974',
 definition:'A cell that drives current in at one place and out at another leaves a tiny voltage gradient in the water around it, far too small for a still electrode, whose own slow drift is larger. In 1974 Lionel Jaffe and Richard Nuccitelli made the tip of a fine electrode vibrate between two nearby points. The steady gradient becomes an alternating signal at the vibration frequency, which an amplifier tuned to that frequency picks out of the drift. They reported at least a hundredfold better signal-to-noise than earlier methods. Many labs have since used such probes.',
 example:'Hold the probe beside the toy cell’s right side and it reads current flowing out; move it round to the left and the current flows in. Move it away and the reading falls quickly with distance. Record readings all round the cell and you have a current map, the kind of picture vibrating probes made of eggs, roots and wounds.',
 desc:'A toy cell with a current source and sink, the vibrating probe tip at a chosen angle and distance, arrows for recorded readings around the cell, and the probe’s signal trace.',
 research:['Jaffe & Nuccitelli (1974). An ultrasensitive vibrating probe for measuring steady extracellular currents. Journal of Cell Biology 63, 614–628.','Toy model: two point currents in a uniform medium; the cell membrane and the probe’s electronics are left out.'],
 dur:12,hint:'Move the probe round the cell and away from it, and press Record to add an arrow to the map. Readings are relative to the probe held just beside the outflow.',
 init:()=>({th:0,d:13,rec:[]}),
 watch(p){const k=Math.floor(p*12.99),rec=range(k).map(i=>[i*30,13]);return {th:k*30%360,d:13,rec}},
 ui:[{range:'th',label:'Angle around the cell',min:0,max:345,step:15,get:s=>s.th,act:'th',show:v=>v+'°'},{range:'d',label:'Distance from the centre',min:12,max:30,get:s=>s.d,act:'d',show:v=>fmt(v/10)+' cell radii'},{b:'Record here',act:'rec'},{b:'Map all round',act:'map'},{b:'Clear the map',act:'clear'}],
 on:{th(s,v){s.th=((Math.round(+v/15)*15)%360+360)%360},d(s,v){s.d=clamp(Math.round(+v),12,30)},rec(s){s.rec=s.rec.concat([[s.th,s.d]]).slice(-24)},map(s){s.rec=range(12).map(i=>[i*30,s.d])},clear(s){s.rec=[]}},
 draw(s,f,X){
  const cx=200,cy=200,sc=50,th=s.th*Math.PI/180,d=s.d/10,j=L1_probeJ(th,d),rel=j/L1_JREF;
  let out=heading(Math.abs(rel)<.05?'Too far or too weak: almost nothing to read':rel>0?'Current flowing out of the cell here':'Current flowing into the cell here');
  out+=Ci(cx,cy,sc,C.pale,C.blue)+TF(cx,cy+5,'toy cell',13,C.muted)+TF(cx-sc+18,cy-16,'in',13,C.blue)+TF(cx+sc-18,cy-16,'out',13,C.coral);
  out+=Ci(cx-sc*.92,cy,5,C.blue)+Ci(cx+sc*.92,cy,5,C.coral);
  for(const [a,dd] of s.rec){const t=a*Math.PI/180,jj=L1_probeJ(t,dd/10)/L1_JREF,px=cx+dd/10*sc*Math.cos(t),py=cy-dd/10*sc*Math.sin(t),len=clamp(Math.abs(jj),0,1.4)*34*Math.sign(jj);
   if(Math.abs(len)>2)out+=arrow(px,py,px+len*Math.cos(t),py-len*Math.sin(t),jj>0?C.coral:C.blue,2.2,7);else out+=Ci(px,py,2,C.muted)}
  // the probe
  const px=cx+d*sc*Math.cos(th),py=cy-d*sc*Math.sin(th),wob=X&&!X.try?Math.sin(X.p*200)*4:0,vx=Math.cos(th)*(6+wob),vy=-Math.sin(th)*(6+wob);
  out+=L(px+vx*1.5,py+vy*1.5,px+vx*6,py+vy*6,C.ink,3)+Ci(px,py,6,C.ink)+L(px-vx*1.2,py-vy*1.2,px+vx*1.2,py+vy*1.2,C.amber,2,'stroke-dasharray="3 2"');
  // signal trace
  const pl=L1_plot(390,70,190,110,[0,2],[-1.5,1.5],{yl:'probe signal',xt:[[0,'0'],[2,'2 cycles']]});out+=pl.svg;
  const pts=[];for(let i=0;i<=80;i++){const t=i/40;pts.push([pl.X(t),pl.Y(clamp(rel,-1.4,1.4)*Math.sin(2*Math.PI*t))])}out+=L1_poly(pts,rel>0?C.coral:C.blue,2.2);
  out+=L1_tile(390,200,190,'Reading (outward +)',`${L1_n(rel*100)} %`,rel>0?C.coral:C.blue)+L1_tile(390,254,190,'Readings recorded',String(s.rec.length),C.ink);
  out+=L1_badge(390,310,'rep')+L1_badge(390,336,'model');
  out+=L1_note('Reading: % of the reading just beside the outflow (1.25 radii). Toy model.',372);
  return {svg:out,phase:`At ${s.th}° and ${fmt(d)} cell radii the probe reads ${L1_n(rel*100)} % of the reference reading, ${rel>=0?'outward':'inward'}. The vibration turns this steady difference into a signal at a known frequency, which is what made such small currents measurable.`};
 }});

// Scene 2: a fucoid egg. Toy: the rhizoid forms on the shaded side; tip elongation rate is proportional to the
// steady inward current at the tip, as Nuccitelli & Jaffe (1974) reported roughly for Pelvetia.
const L1_EGG_K=.6;
SCENE({id:'vibrating-probe-egg',name:'Current through a growing egg',tag:'Replicated finding · Fucoid eggs, Nuccitelli and Jaffe, 1974',
 definition:'Eggs of the brown seaweeds Fucus and Pelvetia start as round, single cells. Light from one side fixes a growth axis: a tip, the rhizoid, grows out on the shaded side. With the vibrating probe, Nuccitelli and Jaffe found a steady current entering the egg at the growing tip and leaving over the rest of it, with pulses on top, and reported that the rate of elongation rose roughly with the size of the steady current. Lionel Jaffe spent much of his career on this kind of self-generated current in developing cells.',
 example:'Shine the light from the left and, in the model, the tip forms on the right, where current enters. Double the current and the toy tip grows twice as fast: the scene makes growth proportional to current, the rough relation reported. A correlation like this does not show which causes which.',
 desc:'A fucoid egg lit from one side, a rhizoid tip growing on the shaded side, current arrows entering at the tip and leaving elsewhere, and a plot of tip length over time.',
 research:['Nuccitelli & Jaffe (1974). Spontaneous current pulses through developing fucoid eggs. PNAS 71, 4855–4859.','Jaffe & Nuccitelli (1974). Journal of Cell Biology 63, 614–628 (the probe).'],
 dur:10,hint:'Choose where the light comes from and how strong the steady current is in the model, then watch the tip grow. Growth is proportional to current by construction.',
 init:()=>({light:'left',cur:5,t:10}),
 watch(p){return {light:p<.5?'left':'top',cur:5,t:Math.round((p<.5?p*2:(p-.5)*2)*10)}},
 ui:[{choose:[['left','From the left'],['right','From the right'],['top','From above']],label:'Light',get:s=>s.light,act:'light'},{range:'cur',label:'Steady current (toy)',min:1,max:10,get:s=>s.cur,act:'cur',show:v=>fmt(v/5)+' ×'},{range:'t',label:'Hours after the axis forms (toy)',min:0,max:10,get:s=>s.t,act:'t'}],
 on:{light(s,v){s.light=['left','right','top'].includes(v)?v:'left'},cur(s,v){s.cur=clamp(Math.round(+v),1,10)},t(s,v){s.t=clamp(Math.round(+v),0,10)}},
 draw(s){
  const dir={left:[1,0],right:[-1,0],top:[0,1]}[s.light],cx=200,cy=190,r=58,len=L1_EGG_K*s.cur/5*s.t*10;
  let out=heading(`The tip grows away from the light, ${fmt(Math.round(len))} units so far`);
  // light
  const lx=cx-dir[0]*170,ly=cy-dir[1]*130;out+=Ci(lx,ly,14,C.amberp,C.amber)+TF(lx,ly+(dir[1]?-22:32),'light',13,C.amber);
  for(const o of [-20,0,20])out+=arrow(lx+dir[0]*22+(dir[1]?o:0),ly+dir[1]*22+(dir[0]?o:0),lx+dir[0]*60+(dir[1]?o:0),ly+dir[1]*60+(dir[0]?o:0),C.amber,1.6,6);
  // egg and rhizoid
  const tx=cx+dir[0]*(r+len),ty=cy+dir[1]*(r+len);
  out+=P(`M${fmt(cx+dir[0]*r*.6-dir[1]*14)} ${fmt(cy+dir[1]*r*.6-dir[0]*14)} L${fmt(tx-dir[1]*10)} ${fmt(ty-dir[0]*10)} Q${fmt(tx+dir[0]*12)} ${fmt(ty+dir[1]*12)} ${fmt(tx+dir[1]*10)} ${fmt(ty+dir[0]*10)} L${fmt(cx+dir[0]*r*.6+dir[1]*14)} ${fmt(cy+dir[1]*r*.6+dir[0]*14)}Z`,C.green,2.5,C.greenp);
  out+=Ci(cx,cy,r,C.greenp,C.green)+TF(cx,cy+5,'egg',13,C.green);
  // current: in at the tip, out around the rest
  const w=1+s.cur/5;out+=arrow(tx+dir[0]*40,ty+dir[1]*40,tx+dir[0]*12,ty+dir[1]*12,C.blue,1.5*w,8)+TF(tx+dir[0]*48+(dir[1]?30:0),ty+dir[1]*48+(dir[0]?-14:0),'current in',13,C.blue,dir[0]<0?'end':'start');
  for(const a of [2.3,3.14,4]){const ang=Math.atan2(dir[1],dir[0])+a;out+=arrow(cx+r*Math.cos(ang),cy+r*Math.sin(ang),cx+(r+26)*Math.cos(ang),cy+(r+26)*Math.sin(ang),C.coral,1.4*w*.6,6)}
  // plot
  const pl=L1_plot(410,70,170,140,[0,10],[0,120],{xt:[[0,'0'],[10,'10 h']],yt:[[0,'0'],[120,'120']],yl:'tip length (toy units)'});out+=pl.svg;
  out+=L1_poly(range(11).map(h=>[pl.X(h),pl.Y(L1_EGG_K*s.cur/5*h*10)]),C.green,2.4)+Ci(pl.X(s.t),pl.Y(len),4,C.green);
  out+=L1_tile(410,240,170,'Growth rate (toy)',`${fmt(L1_EGG_K*s.cur/5*10)} units per h`,C.green);
  out+=L1_badge(410,300,'rep')+L1_badge(410,326,'model');
  out+=L1_note('Schematic egg; growth set proportional to current in the model.',366);
  return {svg:out,phase:`Light from the ${s.light==='top'?'top':s.light} sets the axis: the tip grows on the shaded side, and current enters there. With the toy current at ${fmt(s.cur/5)} times the reference, the tip grows ${fmt(L1_EGG_K*s.cur/5*10)} units an hour. In the real eggs the relation was rough, and the current and the growth could both follow a third cause.`};
 }});

// Scene 3: currents leave a newt limb stump. Toy circuit: a skin battery whose EMF depends on sodium uptake,
// an internal resistance, and a stump path whose resistance rises as the wound is covered. Current in toy units.
function L1_stump(s){const emf=(s.lowNa?.25:1)*(s.amil?.2:1),rIn=1,rSt=.5+.08*Math.pow(Math.max(0,s.day-1),1.5);return emf/(rIn+rSt)}
const L1_ST_REF=L1_stump({lowNa:0,amil:0,day:1});
SCENE({id:'vibrating-probe-limb',name:'Currents leave a regenerating limb',tag:'Replicated finding · Borgens, Vanable & Jaffe, 1977',
 definition:'Newts and other salamanders regrow amputated limbs. In 1977 Richard Borgens, Joseph Vanable and Lionel Jaffe used the vibrating probe on newt limb stumps and found steady currents of 10 to 100 microamperes per square centimetre or more leaving the end of the stump in the first 5 to 10 days, returning through the intact skin. The currents depended on sodium entering the skin: the skin acts as a battery. Steady currents at wounds and regenerating tissues have since been measured by many groups.',
 example:'In the model, the skin battery drives current out of the open stump; as the wound is covered over the days, the path’s resistance rises and the current falls. Amiloride, which blocks the skin’s sodium entry, or low-sodium water lowers the battery. In a 1979 follow-up Borgens and colleagues reduced the currents this way in salamanders: with amiloride, limb regeneration was blocked or badly deficient in about half of the animals.',
 desc:'A schematic limb stump with current arrows leaving its end, a simple circuit of the skin battery and stump, the computed current over the days, and the published range drawn as a separate box.',
 research:['Borgens, Vanable & Jaffe (1977). Bioelectricity and regeneration: large currents leave the stumps of regenerating newt limbs. PNAS 74, 4528–4532.','Borgens and colleagues (1979). Reduction of sodium dependent stump currents disturbs urodele limb regeneration. Journal of Experimental Zoology 209, 377–386.'],
 dur:10,hint:'Move through the days after amputation, then add amiloride or switch to low-sodium water and see the model current fall. The published range is shown separately and is not produced by the model.',
 init:()=>({day:2,amil:0,lowNa:0}),
 watch(p){return {day:Math.max(1,Math.round(p*14)),amil:0,lowNa:0}},
 ui:[{range:'day',label:'Days after amputation',min:1,max:14,get:s=>s.day,act:'day'},{b:'Amiloride on the skin: on/off',act:'amil'},{b:'Low-sodium water: on/off',act:'lowNa'}],
 on:{day(s,v){s.day=clamp(Math.round(+v),1,14)},amil(s){s.amil=s.amil?0:1},lowNa(s){s.lowNa=s.lowNa?0:1}},
 draw(s){
  const I=L1_stump(s)/L1_ST_REF;
  let out=heading(s.amil||s.lowNa?'Less sodium entry, a weaker skin battery':s.day>8?'The wound is covered and the current falls':'Current leaves the open stump');
  // limb schematic
  out+=R(40,140,200,70,C.coralp,C.coral,30)+R(200,140,40,70,s.day>6?C.greenp:'#fff',C.coral,6)+TF(120,180,'limb (schematic)',13,C.coral)+TF(220,232,s.day>6?'covered':'open end',13,C.muted);
  const w=1+2.5*clamp(I,0,1);for(const dy of [-22,0,22])out+=arrow(244,175+dy,244+34*clamp(I,.15,1.3),175+dy,C.coral,w,7);
  for(const x of [80,150])out+=arrow(x,104,x,136,C.blue,1.6,6);
  out+=TF(115,96,'current returns through intact skin',13,C.blue);
  // circuit
  out+=R(40,258,220,64,'#fff',C.grid,8)+TF(52,278,'skin battery: sodium in',13,C.ink,'start')+TF(52,298,`strength ${fmt(Math.round((s.lowNa?.25:1)*(s.amil?.2:1)*100))} % of normal`,13,s.amil||s.lowNa?C.coral:C.ink,'start')+TF(52,316,'stump resistance rises as it heals',13,C.muted,'start');
  // plot over days
  const pl=L1_plot(320,64,250,130,[1,14],[0,1.1],{xt:[[1,'1'],[7,'7'],[14,'14 days']],yt:[[0,'0'],[1,'1']],yl:'model current (day 1 = 1)'});out+=pl.svg;
  out+=L1_poly(range(14).map(i=>[pl.X(i+1),pl.Y(L1_stump({...s,day:i+1})/L1_ST_REF)]),C.coral,2.4)+Ci(pl.X(s.day),pl.Y(I),5,C.coral);
  // published values, separate
  out+=R(320,230,250,92,C.greenp,'none',8)+L1_badge(330,238,'rep')+TF(330,276,'Measured: 10–100 µA/cm² or more',13,C.ink,'start')+TF(330,294,'leaving the stump, days 1 to 5–10',13,C.ink,'start')+TF(330,312,'(Borgens et al. 1977)',13,C.muted,'start');
  out+=L1_badge(40,56,'model');
  out+=L1_note('Toy circuit; its current is relative, not in µA. Animals: newts and salamanders.',364);
  return {svg:out,phase:`Day ${s.day}: the model current is ${fmt(Math.round(I*100))} % of day 1. ${s.amil?'Amiloride blocks the channels by which sodium enters the skin, so the battery weakens; in the 1979 study about half of the amiloride-treated salamanders regenerated poorly or not at all. Amiloride may have other effects too, so this shows the current matters without proving how.':s.lowNa?'In low-sodium water the skin has less sodium to take up. In the 1979 study this delayed regeneration for some weeks, after which it recovered.':'The measured currents were large for such a small structure and were driven by the skin itself, not by the cut tissue.'}`};
 }});

// Scene 4: fields at a wound steer cells. Toy: edge cells move with speed v0·g·tanh(E/E0), E = wound field + applied field.
const L1_GENO={normal:[1,'Normal'],pi3k:[.1,'PI3Kγ removed'],pten:[1.6,'PTEN removed']};
function L1_woundRun(s,h){const g=L1_GENO[s.geno][0],E=1+s.ea/10,v=6*g*Math.tanh(E/1.2);let gap=120;const out=[[0,gap]];for(let t=1;t<=h;t++){gap=clamp(gap-v,0,160);out.push([t,gap])}return {out,v}}
SCENE({id:'vibrating-probe-wound',name:'Wound fields steer cells',tag:'Replicated finding · Electric fields guide cell migration',
 definition:'A cut in an epithelium short-circuits the voltage the layer keeps across itself, so a steady electric field points towards the wound. Many cell types move in steady fields of about this strength, a behaviour called electrotaxis or galvanotaxis, as Colin McCaig, Min Zhao and others have reviewed. In 2006 Zhao and colleagues reported that such fields act as a leading directional cue in wound healing, and that removing the enzyme PI3Kγ abolished the directed movement while removing PTEN enhanced it.',
 example:'In the model, edge cells crawl into the wound at a speed set by the total field. Add an applied field in the same direction and they close it faster; apply one against the wound’s own field and they slow or retreat. Switch off PI3Kγ in the model and the response almost disappears, as the 2006 paper reported for the genetic knockout. These are laboratory experiments on cells and animal tissue, not a treatment.',
 desc:'A wound gap in a cell layer with the field direction, edge cells moving according to the field, a plot of gap width over time, and a choice of normal, PI3Kγ-removed or PTEN-removed cells.',
 research:['McCaig, Rajnicek, Song & Zhao (2005). Controlling cell behavior electrically: current views and future potential. Physiological Reviews 85, 943–978.','Zhao et al. (2006). Electrical signals control wound healing through phosphatidylinositol-3-OH kinase-γ and PTEN. Nature 442, 457–460.'],
 dur:12,hint:'Add an applied field with or against the wound’s own field, and choose which cells you use. Response strengths are illustrative; the direction of the effects follows the papers.',
 init:()=>({ea:0,geno:'normal',h:10}),
 watch(p){return {ea:p<.5?0:-25,geno:'normal',h:Math.round((p<.5?p*2:(p-.5)*2)*20)}},
 ui:[{range:'ea',label:'Applied field (× wound field)',min:-30,max:20,step:5,get:s=>s.ea,act:'ea',show:v=>(v>0?'+':'')+fmt(v/10)},{choose:[['normal','Normal'],['pi3k','PI3Kγ off'],['pten','PTEN off']],label:'Cells',get:s=>s.geno,act:'geno'},{range:'h',label:'Time (toy hours)',min:0,max:20,get:s=>s.h,act:'h'}],
 on:{ea(s,v){s.ea=clamp(Math.round(+v/5)*5,-30,20)},geno(s,v){s.geno=L1_GENO[v]?v:'normal'},h(s,v){s.h=clamp(Math.round(+v),0,20)}},
 draw(s){
  const r=L1_woundRun(s,s.h),gap=r.out[r.out.length-1][1],E=1+s.ea/10;
  let out=heading(r.v<-.2?'Against the wound field the cells retreat':r.v<.8?'Little directed movement':gap<=0?'The gap is closed':'Cells crawl into the wound');
  // the layer and gap (schematic)
  const cx=180,half=gap/2;
  for(let i=1;i<=3;i++){out+=R(cx-half-2-26-i*28,120,26,60,C.pale,C.blue,6);out+=R(cx+half+2+i*28,120,26,60,C.pale,C.blue,6)}
  out+=R(cx-half,118,gap,64,'#fff',C.line,4,'stroke-dasharray="4 3"');
  out+=R(cx-half-26,120,24,60,C.greenp,C.green,6)+R(cx+half+2,120,24,60,C.greenp,C.green,6);
  out+=TF(cx,104,gap>0?'wound':'closed',13,C.muted);
  // field arrows (toward wound centre from both sides)
  const fl=clamp(E,-2,3)*14;if(Math.abs(fl)>2){out+=arrow(cx-half-60,210,cx-half-60+fl,210,C.amber,2.4,7)+arrow(cx+half+60,210,cx+half+60-fl,210,C.amber,2.4,7)}
  out+=TF(cx,232,`total field ${fmt(Math.round(E*10)/10)} × the wound’s own`,13,C.amber);
  // plot
  const pl=L1_plot(410,64,170,140,[0,20],[0,160],{xt:[[0,'0'],[20,'20 h']],yt:[[0,'0'],[120,'120']],yl:'gap width (toy µm)'});out+=pl.svg;
  out+=L1_poly(r.out.map(([t,g])=>[pl.X(t),pl.Y(g)]),C.green,2.4);
  out+=L1_tile(410,232,170,'Edge speed (toy)',`${L1_n(r.v,1)} µm per h`,r.v>0?C.green:C.coral);
  out+=L1_badge(30,268,'rep')+TF(30+L1_badgeW('rep')+8,282,'cells move in steady fields',13,C.ink,'start');
  out+=L1_badge(30,296,'single')+TF(30+L1_badgeW('single')+8,310,'PI3Kγ and PTEN (Zhao et al. 2006)',13,C.ink,'start');
  out+=L1_badge(580,296,'model','end');
  out+=L1_note('Toy model; speeds and gap sizes are illustrative. Not a treatment.',360);
  return {svg:out,phase:`${L1_GENO[s.geno][1]} cells in a total field of ${fmt(Math.round(E*10)/10)} times the wound’s own move at ${L1_n(r.v,1)} toy µm per hour; after ${s.h} hours the gap is ${fmt(Math.round(gap))} toy µm. ${s.geno==='pi3k'?'Without PI3Kγ the cells can still move, but the field no longer steers them well.':s.geno==='pten'?'Without PTEN the signalling that reads the field is stronger, so the response grows.':r.v<0?'Reversing the field turns the cells away from the wound: direction comes from the field.':'The wound’s own field already points inwards.'}`};
 }});

/* ===================== Lesson: voltage-dyes ===================== */
// Toy dye model: a negatively charged dye (z = −1) distributes across the membrane by Nernst:
// inside/outside = exp(V / (RT/F)). Brightness is taken as proportional to dye inside (bound dye fluoresces).
const L1_dye=V=>Math.exp(V/L1_RTF());
// Three channel mixes the learner can paint, from many potassium channels to few. Voltages come from the Goldman equation.
const L1_MIX=[{label:'many K⁺ channels',pK:1.6,pNa:.03,pCl:.1},{label:'some',pK:1,pNa:.12,pCl:.3},{label:'few K⁺ channels',pK:.4,pNa:.3,pCl:.6}];
const L1_MIXV=L1_MIX.map(m=>L1_ghk(m.pK,m.pNa,m.pCl));
const L1_DYE_TAU=10;   // toy minutes for the dye to re-equilibrate
SCENE({id:'voltage-dyes',name:'A dye that collects in depolarised cells',tag:'Replicated finding · Slow voltage dyes such as DiBAC4(3)',
 definition:'Electrodes measure one cell at a time. Voltage-reporting dyes give a picture. DiBAC4(3) is a negatively charged oxonol dye that crosses membranes; because the inside of a cell is negative, the dye is partly kept out, and the less negative the cell, the more dye enters and binds inside, so depolarised cells look brighter. Dany Spencer Adams and Michael Levin published protocols for using it, with a second dye, CC2-DMPE, on living frog embryos and cultured cells (2012).',
 example:`In the model, a cell ${L1_mv(L1_MIXV[0])} inside and a neighbour at ${L1_mv(L1_MIXV[2])} differ by ${fmt(Math.round(L1_MIXV[2]-L1_MIXV[0]))} mV, so the second takes up ${fmt(Math.round(L1_dye(L1_MIXV[2])/L1_dye(L1_MIXV[0])*10)/10)} times as much dye. The dye reports relative voltage, not millivolts; it is slow, taking minutes to re-settle after a change; and uptake, bleaching and cell shape also affect brightness.`,
 desc:'Two model cells with different channel mixes, their computed voltages, the dye entering each and their computed brightness, with a timeline showing how slowly the dye follows a change.',
 research:['Adams & Levin (2012). Measuring resting membrane potential using the fluorescent voltage reporters DiBAC4(3) and CC2-DMPE. Cold Spring Harbor Protocols 2012(4), 459–464.','Adams & Levin (2012). General principles for measuring resting membrane potential and ion concentration using fluorescent bioelectricity reporters. Cold Spring Harbor Protocols 2012(4), 385–397.'],
 dur:10,hint:'Change the second cell’s channel mix and see its computed voltage and brightness. Then move the minutes slider to see how slowly the dye catches up after the change. Dye timing is illustrative.',
 init:()=>({mix:2,min:30}),
 watch(p){return {mix:p<.35?1:2,min:p<.35?30:Math.round((p-.35)/.65*40)}},
 ui:[{choose:[[0,'Many K⁺ channels'],[1,'Some'],[2,'Few K⁺ channels']],label:'Second cell',get:s=>s.mix,act:'mix'},{range:'min',label:'Minutes since the change',min:0,max:40,get:s=>s.min,act:'min',show:v=>v+' min'}],
 on:{mix(s,v){s.mix=clamp(Math.round(+v),0,2);s.min=0},min(s,v){s.min=clamp(Math.round(+v),0,40)}},
 draw(s){
  const V1=L1_MIXV[0],V2=L1_MIXV[s.mix],eq1=L1_dye(V1),eq2=L1_dye(V2),u=1-Math.exp(-s.min/L1_DYE_TAU),b2=eq1+(eq2-eq1)*u,ratio=b2/eq1;
  let out=heading(s.mix===0?'Same voltage, same brightness':`Second cell ${fmt(Math.round(ratio*100)/100)} × as bright`);
  const cell=(x,lab,V,b)=>{const g=clamp(b/L1_dye(L1_MIXV[2])*.95,0,1),shade=Math.round(lerp(40,250,g));
   return Ci(x,160,64,`rgb(${shade},${shade},${Math.round(shade*.85)})`,C.ink)+TBF(x,154,L1_mv(V),15,g>.55?C.ink:'#fff')+TF(x,174,'computed',13,g>.55?C.ink:'#fff')+TF(x,246,lab,13,C.muted)};
  out+=cell(130,'cell 1: many K⁺ channels',V1,eq1)+cell(330,'cell 2: '+L1_MIX[s.mix].label,V2,b2);
  // dye molecules around (fixed positions; inside counts drawn from brightness)
  const r=rng(7);for(let i=0;i<26;i++){const a=r()*6.28,d=78+r()*20;out+=Ci(130+d*Math.cos(a),160+d*Math.sin(a)*.8,2.5,C.amber)+Ci(330+d*Math.cos(a+1),160+d*Math.sin(a+1)*.8,2.5,C.amber)}
  out+=TF(230,72,'dye outside (−)',13,C.amber);
  // time course
  const pl=L1_plot(450,70,130,120,[0,40],[0,1.1*Math.max(L1_dye(L1_MIXV[2])/eq1,1.2)],{xt:[[0,'0'],[40,'40']],yl:'brightness ÷ cell 1',xl:'minutes'});out+=pl.svg;
  out+=L1_poly(range(41).map(m=>[pl.X(m),pl.Y((eq1+(eq2-eq1)*(1-Math.exp(-m/L1_DYE_TAU)))/eq1)]),C.amber,2.4)+Ci(pl.X(s.min),pl.Y(ratio),4,C.amber);
  out+=L1_tile(450,236,130,'Brightness ratio',`${fmt(Math.round(ratio*100)/100)} ×`,C.amber)+L1_tile(450,288,130,'At equilibrium',`${fmt(Math.round(eq2/eq1*100)/100)} ×`,C.ink);
  out+=L1_badge(30,280,'rep')+TF(30+L1_badgeW('rep')+8,294,'brighter means less negative inside',13,C.ink,'start');
  out+=L1_badge(30,310,'model')+TF(30+L1_badgeW('model')+8,324,'dye kept out by Nernst, z = −1',13,C.ink,'start');
  out+=L1_note('Grey shows dye brightness; numbers show computed voltage. Timing illustrative.',366);
  return {svg:out,phase:s.mix===0?'Both cells have the same channel mix, so the same voltage and the same brightness.':`Cell 2 sits at ${L1_mv(V2)}, ${fmt(Math.round(V2-V1))} mV less negative than cell 1, so at equilibrium it holds ${fmt(Math.round(eq2/eq1*100)/100)} times as much dye. ${s.min<20?`After only ${s.min} minutes the dye has not caught up: the image lags the voltage.`:'After this long the image has nearly caught up with the voltage.'}`};
 }});

// Scene 2: paint a voltage pattern on a sheet of model cells and see the dye image beside it.
const L1_PW=8,L1_PH=5;
const L1_PAINT_DEMO=[0,0,1,2,2,1,0,0, 0,1,2,2,2,2,1,0, 0,1,2,1,1,2,1,0, 0,1,2,2,2,2,1,0, 0,0,1,2,2,1,0,0];
SCENE({id:'voltage-dyes-paint',name:'Paint a voltage map',tag:'Simplified model · From channel mixes to a dye image',
 definition:'A dye image is a map of brightness, and brightness stands for relative voltage. Here each model cell gets one of three channel mixes; the Goldman equation gives its voltage, and the dye model gives its brightness. Painting a pattern of channel mixes shows how a voltage pattern becomes a picture, the step behind every dye image in later lessons, such as the frog embryo’s face pattern.',
 example:`The three mixes give ${L1_mv(L1_MIXV[0])}, ${L1_mv(L1_MIXV[1])} and ${L1_mv(L1_MIXV[2])}. In the dye image the least negative cells are ${fmt(Math.round(L1_dye(L1_MIXV[2])/L1_dye(L1_MIXV[0])*10)/10)} times as bright as the most negative ones. The image shows the pattern clearly, but it gives no millivolts: those come from the model, or in a real embryo from calibration with electrodes.`,
 desc:'Two grids of model cells side by side: the voltage map, with each cell’s computed voltage written in it, and the dye image computed from it, with a scale bar for each.',
 research:['Adams & Levin (2012). Cold Spring Harbor Protocols 2012(4), 459–464 (dye imaging of Xenopus embryos).','Toy model written for this course: each cell’s voltage is computed on its own, with no coupling; the dye model is Nernst distribution of a negative dye.'],
 dur:10,hint:'Press cells in the left grid to cycle their channel mix and watch the dye image on the right. Clear the sheet or load the ring pattern.',
 shared:'l1-paint',
 init:()=>({g:L1_PAINT_DEMO.slice()}),
 watch(p){const k=Math.round(p*L1_PW*L1_PH);return {g:L1_PAINT_DEMO.map((v,i)=>i<k?v:0)}},
 ui:[{b:'Clear the sheet',act:'clear'},{b:'Ring pattern',act:'demo'},{b:'Left half depolarised',act:'half'}],
 on:{cell(s,i){i=+i;if(!(i>=0&&i<L1_PW*L1_PH))return 'keep';s.g=s.g.slice();s.g[i]=(s.g[i]+1)%3;return 'keep'},clear(s){s.g=new Array(L1_PW*L1_PH).fill(0)},demo(s){s.g=L1_PAINT_DEMO.slice()},half(s){s.g=range(L1_PW*L1_PH).map(i=>i%L1_PW<4?2:0)}},
 draw(s,f,X){
  const cw=30,x0=24,x1=336,y0=78,bmax=L1_dye(L1_MIXV[2]),bmin=L1_dye(L1_MIXV[0]);
  let out=heading('Voltage map and the dye image it would give');
  out+=TBF(x0,68,'computed voltage (mV)',13,C.ink,'start')+TBF(x1,68,'dye image (brightness)',13,C.ink,'start');
  s.g.forEach((m,i)=>{const cx=i%L1_PW,cy=(i/L1_PW)|0,V=L1_MIXV[m],b=L1_dye(V),gl=clamp((b-bmin*.6)/(bmax-bmin*.6),0,1),sh=Math.round(lerp(30,245,gl));
   out+=hit(X,'cell',i,`Cell ${i+1}: ${L1_mv(V)}. Press to change its channel mix.`,R(x0+cx*cw,y0+cy*cw,cw-2,cw-2,L1_vcol(V,-90,-10),'#fff',4)+TF(x0+cx*cw+cw/2-1,y0+cy*cw+cw/2+4,L1_n(V),13,Math.abs(V+50)<15?C.ink:'#fff'));
   out+=R(x1+cx*cw,y0+cy*cw,cw-2,cw-2,`rgb(${sh},${sh},${Math.round(sh*.85)})`,'none',4)});
  out+=L1_vbar(x0,244,L1_PW*cw-2,-90,-10,'voltage');
  // brightness scale
  for(let i=0;i<24;i++){const gl=i/23,sh=Math.round(lerp(30,245,gl));out+=R(x1+i*(L1_PW*cw-2)/24,244,(L1_PW*cw-2)/24+.5,12,`rgb(${sh},${sh},${Math.round(sh*.85)})`,'none',0)}
  out+=TF(x1,272,'dim',13,C.muted,'start')+TF(x1+L1_PW*cw-2,272,'bright',13,C.muted,'end')+TF(x1+(L1_PW*cw)/2,272,'relative only',13,C.muted);
  const vs=s.g.map(m=>L1_MIXV[m]),bs=vs.map(L1_dye),bright=Math.max(...bs)/Math.min(...bs);
  out+=L1_tile(24,292,180,'Voltage range',`${L1_n(Math.min(...vs))} to ${L1_n(Math.max(...vs))} mV`)+L1_tile(214,292,180,'Brightest ÷ dimmest',`${fmt(Math.round(bright*100)/100)} ×`,C.amber);
  out+=L1_badge(576,300,'model','end');
  out+=L1_note('Each cell computed alone, with no coupling.',360);
  return {svg:out,phase:bright<1.01?'Every cell has the same channel mix, so the dye image is uniform. Press cells on the left to change them.':`The voltages span ${L1_n(Math.min(...vs))} to ${L1_n(Math.max(...vs))} mV and the image spans a ${fmt(Math.round(bright*100)/100)}-fold range of brightness. The image carries the pattern; the numbers come only from the model.`};
 }});

// Scene 3: two different maps can give similar images once blurred. 1D row of 40 cells, Gaussian blur, camera noise.
const L1_BN=40;
function L1_maps(pair){const lo=L1_MIXV[0],hi=L1_MIXV[2];
 if(pair==='stripes'){const A=range(L1_BN).map(i=>i%2?hi:lo),m=(L1_dye(lo)+L1_dye(hi))/2,B=range(L1_BN).map(()=>L1_RTF()*Math.log(m));return [A,B]}
 const A=range(L1_BN).map(i=>i<20?lo:hi),B=range(L1_BN).map(i=>{const u=clamp((i-12)/16,0,1);return L1_RTF()*Math.log(lerp(L1_dye(lo),L1_dye(hi),u))});return [A,B]}
function L1_blur(a,sig,wrap){if(sig<=0)return a.slice();const n=a.length,w=[];const r=Math.ceil(sig*3);for(let k=-r;k<=r;k++)w.push(Math.exp(-k*k/(2*sig*sig)));
 return a.map((_,i)=>{let s=0,t=0;w.forEach((q,j)=>{const k=wrap?((i+j-r)%n+n)%n:clamp(i+j-r,0,n-1);s+=q*a[k];t+=q});return s/t})}
SCENE({id:'voltage-dyes-blur',name:'Reading dye pictures with care',tag:'Replicated finding · Dye images are blurred and relative',
 definition:'A dye image is smoothed by optics, by light scattered in thick tissue and by the camera, and it has noise. Two quite different voltage maps can then give images that cannot be told apart. That is one reason labs combine dyes with other tools: a second, reference dye for a ratio (as in the CC2-DMPE and DiBAC4(3) pair), electrodes to calibrate millivolts, and genetically encoded voltage indicators, proteins made by the cells themselves, first reported in 1997.',
 example:'Fine stripes of strongly negative and depolarised cells and a uniform sheet at an in-between voltage look different under a sharp lens. Blur by a couple of cell widths and the stripes merge: the computed images differ by less than the camera noise, so the picture cannot tell you which map was there.',
 desc:'Two voltage profiles along a row of 40 model cells, their computed dye images after blurring, the difference between the images and the camera noise, and a verdict on whether the images can be told apart.',
 research:['Adams & Levin (2012). Cold Spring Harbor Protocols 2012(4), 385–397 (principles and pitfalls of bioelectricity reporters).','Siegel & Isacoff (1997). A genetically encoded optical probe of membrane voltage. Neuron 19 (the first genetically encoded voltage indicator).','Toy model: Gaussian blur and a fixed noise level; real imaging has many more sources of error.'],
 dur:10,hint:'Pick a pair of voltage maps, then increase the blur and the camera noise until the two images can no longer be told apart.',
 init:()=>({pair:'stripes',blur:0,noise:3}),
 watch(p){return {pair:p<.5?'stripes':'edge',blur:Math.round((p<.5?p*2:(p-.5)*2)*12)/2,noise:3}},
 ui:[{choose:[['stripes','Stripes or uniform'],['edge','Sharp edge or ramp']],label:'Two maps',get:s=>s.pair,act:'pair'},{range:'blur',label:'Blur (cell widths)',min:0,max:6,step:.5,get:s=>s.blur,act:'blur'},{range:'noise',label:'Camera noise (% of range)',min:1,max:10,get:s=>s.noise,act:'noise',show:v=>v+' %'}],
 on:{pair(s,v){s.pair=v==='edge'?'edge':'stripes'},blur(s,v){s.blur=clamp(Math.round(+v*2)/2,0,6)},noise(s,v){s.noise=clamp(Math.round(+v),1,10)}},
 draw(s){
  const [A,B]=L1_maps(s.pair),bA=L1_blur(A.map(L1_dye),s.blur,s.pair==='stripes'),bB=L1_blur(B.map(L1_dye),s.blur,s.pair==='stripes'),lo=L1_dye(L1_MIXV[0]),hi=L1_dye(L1_MIXV[2]);
  const diff=Math.max(...bA.map((v,i)=>Math.abs(v-bB[i])))/(hi-lo)*100,same=diff<2*s.noise;
  let out=heading(same?'The two images cannot be told apart':'The two images still differ');
  const p1=L1_plot(64,62,500,100,[0,L1_BN-1],[-90,-10],{yt:[[-90,'−90'],[-50,'−50'],[-10,'−10']],yl:'voltage maps (mV), computed'});out+=p1.svg;
  const stp=a=>a.flatMap((v,i)=>[[p1.X(Math.max(0,i-.5)),p1.Y(v)],[p1.X(Math.min(L1_BN-1,i+.5)),p1.Y(v)]]);
  out+=L1_poly(stp(A),C.blue,2)+L1_poly(stp(B),C.coral,2.2,'stroke-dasharray="6 4"');
  const p2=L1_plot(64,196,500,100,[0,L1_BN-1],[lo*.8,hi*1.1],{yl:'dye images after blur (brightness)',xt:[[0,'cell 1'],[L1_BN-1,'cell 40']]});out+=p2.svg;
  // noise band around image B
  out+=P('M'+bB.map((v,i)=>fmt(p2.X(i))+' '+fmt(p2.Y(v+(hi-lo)*s.noise/100))).join(' L')+' L'+bB.slice().reverse().map((v,j)=>fmt(p2.X(L1_BN-1-j))+' '+fmt(p2.Y(v-(hi-lo)*s.noise/100))).join(' L')+'Z','none',0,C.coralp);
  out+=L1_poly(bA.map((v,i)=>[p2.X(i),p2.Y(v)]),C.blue,2.4)+L1_poly(bB.map((v,i)=>[p2.X(i),p2.Y(v)]),C.coral,2.4,'stroke-dasharray="6 4"');
  out+=TF(70,330,'map A',13,C.blue,'start')+L(116,326,140,326,C.blue,2.4)+TF(156,330,'map B',13,C.coral,'start')+L(202,326,226,326,C.coral,2.4,'stroke-dasharray="6 4"');
  out+=TF(300,356,`largest image difference ${fmt(Math.round(diff*10)/10)} % of range; noise ±${s.noise} %`,13,same?C.coral:C.ink);
  out+=L1_badge(580-L1_badgeW('model')-8,318,'rep','end')+L1_badge(580,318,'model','end');
  return {svg:out,phase:same?`With ${fmt(s.blur)} cell widths of blur the images differ by at most ${fmt(Math.round(diff*10)/10)} % of the brightness range, inside the camera noise. A single dye picture cannot decide between these two maps; another method has to.`:`The images differ by up to ${fmt(Math.round(diff*10)/10)} % of the range, more than twice the ±${s.noise} % noise, so they can still be told apart. Blur them more, or add noise, and the difference disappears.`};
 }});

/* ===================== Lesson: gap-junctions ===================== */
// Scene 1: two coupled cells. Each has membrane conductance gm (=1) to the same resting voltage; current I is injected into A.
// Steady state: ΔVA = I(gm+gj)/(gm(gm+2gj)), ΔVB = I·gj/(gm(gm+2gj)); coupling coefficient ΔVB/ΔVA = gj/(gm+gj).
const L1_GJ_HIST=[[1959,'Furshpan','crayfish'],[1964,'Loewenstein','gland cells'],[1967,'Revel','structure'],[1986,'Paul; Kumar','connexin'],[1998,'Phelan','innexins']];
const L1_gjOf=r=>Math.round(Math.pow(10,r/10)*1000)/1000;
SCENE({id:'gap-junctions',name:'Cells joined by channels',tag:'Replicated finding · Electrical coupling, 1959–1998',
 definition:'At a gap junction, channels bridge the narrow gap between two cells and join their insides, so ions, current and small molecules pass directly from one to the other. Edwin Furshpan and David Potter found electrical coupling between crayfish neurons in 1959; Werner Loewenstein and Kanno showed in 1964 that ordinary gland cells are coupled too and pass fluorescent tracer. The channels are made of connexin proteins in vertebrates, first cloned in 1986, and of innexins in invertebrates, named in 1998.',
 example:'Inject current into cell A. With no junction, cell B does not change at all. With a junction as conductive as each cell’s own membrane, B changes by half as much as A: the coupling coefficient is gj ÷ (gj + gm). Strong coupling pushes it towards 1, so the two cells behave almost as one.',
 desc:'Two cells joined by a gap junction, current injected into one, the computed voltage change in each, a tracer spreading from one to the other, and a date line of discoveries.',
 research:['Furshpan & Potter (1959). Journal of Physiology 145, 289–325. Brain In Motion’s synapse-discovery-electrical scene covers electrical synapses.','Loewenstein & Kanno (1964). Studies on an epithelial (gland) cell junction. I. Journal of Cell Biology 22, 565–586.','Goodenough & Paul (2009). Gap junctions. Cold Spring Harbor Perspectives in Biology 1, a002576 (connexins and innexins).'],
 dur:10,hint:'Change the junction’s conductance and inject current into cell A; add tracer to see small molecules pass. Conductances are relative to each cell’s membrane.',
 init:()=>({r:0,tracer:0}),
 watch(p){return {r:Math.round(lerp(-20,15,smooth(p))),tracer:p>.5?Math.round((p-.5)*20):0}},
 ui:[{range:'r',label:'Junction conductance',min:-20,max:15,get:s=>s.r,act:'r',show:v=>fmt(L1_gjOf(v))+' × membrane'},{b:'Block the junction',act:'block'},{b:'Add tracer to cell A',act:'tr'},{b:'Wait 2 minutes (toy)',act:'wait'}],
 on:{r(s,v){s.r=clamp(Math.round(+v),-21,15)},block(s){s.r=-21},tr(s){s.tracer=0.0001},wait(s){if(s.tracer)s.tracer=Math.min(10,Math.round(s.tracer)+2)}},
 draw(s){
  const gj=s.r<=-21?0:L1_gjOf(s.r),gm=1,I=1,den=gm*(gm+2*gj),dA=I*(gm+gj)/den,dB=I*gj/den,k=dB/dA;
  const E=L1_ghk(1,.04,.2),VA=E+20*dA,VB=E+20*dB;   // 20 mV per unit current (illustrative scale)
  const trB=s.tracer?.5*(1-Math.exp(-2*.15*gj*Math.round(s.tracer))):0;
  let out=heading(gj===0?'Blocked: cell B does not respond':`Coupling coefficient ${fmt(Math.round(k*100)/100)}`);
  // cells
  out+=R(60,80,190,120,C.pale,C.blue,40)+R(330,80,190,120,C.pale,C.blue,40);
  if(s.tracer)out+=R(60,80,190,120,C.green,'none',40,`opacity="${fmt(.5-trB*.5)}"`)+R(330,80,190,120,C.green,'none',40,`opacity="${fmt(trB*.5)}"`);
  // junction: a few channels drawn by conductance
  const nch=gj===0?0:clamp(Math.round(2+Math.log10(gj)*2+2),1,7);
  out+=R(250,110,80,60,'#fff',C.line,6);for(let i=0;i<nch;i++)out+=R(254,114+i*8,72,5,C.amber,'none',2);
  out+=TF(290,98,gj===0?'junction closed':'gap junction',13,C.amber);
  out+=arrow(155,42,155,78,C.coral,2.5)+TF(165,52,'inject current',13,C.coral,'start');
  out+=TBF(155,140,'A  '+L1_mv(VA),14,C.ink)+TBF(425,140,'B  '+L1_mv(VB),14,C.ink);
  out+=TF(155,162,`change +${fmt(Math.round(20*dA*10)/10)} mV`,13,C.muted)+TF(425,162,`change +${fmt(Math.round(20*dB*10)/10)} mV`,13,C.muted);
  if(s.tracer)out+=TF(425,186,`tracer in B: ${fmt(Math.round(trB*200))} % of A’s start`,13,C.green);
  out+=L1_tile(60,214,190,'gj ÷ (gj + gm)',`${fmt(Math.round(gj*1000)/1000)} ÷ ${fmt(Math.round((gj+gm)*1000)/1000)} = ${fmt(Math.round(k*100)/100)}`,C.blue)+L1_tile(330,214,190,'Resting voltage, both cells',L1_mv(E),C.ink);
  out+=L1_badge(580,40,'rep','end');
  // timeline
  out+=L(40,300,560,300,C.line,2);
  L1_GJ_HIST.forEach((e,i)=>{const x=72+i*114;out+=Ci(x,300,5,C.blue)+TBF(x,288,String(e[0]),13,C.ink)+TF(x,318,e[1],13,C.muted)+TF(x,334,e[2],13,C.muted)});
  out+=L1_note('Model cells; current scale 20 mV per unit and tracer timing are illustrative.',364);
  return {svg:out,phase:gj===0?'With the junction closed, current injected into A stays in A. B sits at its own resting voltage, as two separate cells do.':`The junction conducts ${fmt(gj)} times as well as each cell’s membrane, so B follows ${fmt(Math.round(k*100))} % of A’s change. ${s.tracer?`Tracer has also crossed: B now holds ${fmt(Math.round(trB*200))} % of A’s starting amount.`:'Small molecules, not only current, can pass the same way.'}`};
 }});

// Scene 2: a row of coupled cells. Steady state by direct tridiagonal solve; the decay per cell compared with the
// exact discrete length constant: q + 1/q = 2 + gm/gj, λ = −1/ln q (in cells); for strong coupling λ ≈ √(gj/gm).
const L1_RN=15;
const L1_lam=(gj,gm)=>{if(gj<=0)return 0;const b=1+gm/(2*gj),q=b-Math.sqrt(b*b-1);return -1/Math.log(q)};
SCENE({id:'gap-junctions-row',name:'Voltage spreads and fades',tag:'Simplified model · Replicated finding: coupled cells share voltage',
 definition:'Join a row of cells by gap junctions and inject current into the first. Each cell passes some current on to its neighbour and loses some through its own membrane, so the voltage change falls off with distance, roughly by the same fraction at every step. The distance over which it falls to about a third (1/e) is the length constant. Strong junctions or tight membranes make it long; weak junctions or leaky membranes make it short. This is the first toy bioelectric network of the course.',
 example:`With junctions 10 times as conductive as each membrane, the exact length constant is ${fmt(Math.round(L1_lam(10,1)*100)/100)} cells, close to the shortcut √(gj ÷ gm) = ${fmt(Math.round(Math.sqrt(10)*100)/100)}. Block the junctions and only the injected cell changes.`,
 desc:'A row of 15 model cells with current injected into the first, bars for each cell’s computed voltage change, an exponential curve from the length constant, and tiles comparing the computed and predicted decay.',
 research:['Toy model written for this course: identical cells, each with a membrane conductance to the same resting voltage, joined to their neighbours by equal junction conductances; solved exactly.','The same mathematics as cable theory for nerve fibres (Hodgkin & Rushton 1946, Proceedings of the Royal Society B 133).'],
 dur:10,hint:'Change how strongly the junctions couple the cells and how leaky each membrane is, and compare the computed fall-off with the predicted length constant.',
 init:()=>({gj:10,gm:10}),
 watch(p){return {gj:Math.round(lerp(0,40,smooth(p))),gm:10}},
 ui:[{range:'gj',label:'Junction conductance',min:0,max:50,get:s=>s.gj,act:'gj',show:v=>fmt(v/10)+' (relative)'},{range:'gm',label:'Membrane conductance',min:2,max:30,get:s=>s.gm,act:'gm',show:v=>fmt(v/10)+' (relative)'},{b:'Block all junctions',act:'block'}],
 on:{gj(s,v){s.gj=clamp(Math.round(+v),0,50)},gm(s,v){s.gm=clamp(Math.round(+v),2,30)},block(s){s.gj=0}},
 draw(s){
  const gj=s.gj,gm=s.gm/10*10,E=L1_ghk(1,.04,.2),Vs=L1_row(new Array(L1_RN).fill(E),new Array(L1_RN).fill(gm),gj,[20*10].concat(new Array(L1_RN-1).fill(0)));
  const dV=Vs.map(v=>v-E),lam=L1_lam(gj,gm),fit=dV[1]>1e-9?-1/Math.log(dV[2]/dV[1]):0;
  let out=heading(gj===0?'Blocked: only the injected cell changes':`Length constant ${fmt(Math.round(lam*100)/100)} cells`);
  const x0=40,cw=35;
  for(let i=0;i<L1_RN;i++){const v=Vs[i];out+=R(x0+i*cw,64,cw-4,34,L1_vcol(v,-90,0),C.line,8);if(i===0)out+=arrow(x0+cw/2-2,40,x0+cw/2-2,62,C.coral,2.4,7)}
  out+=TF(x0+cw/2+10,46,'inject',13,C.coral,'start');
  const pl=L1_plot(x0,130,L1_RN*cw-4,150,[0,L1_RN-1],[0,Math.max(1,dV[0])*1.1],{xt:[[0,'1'],[7,'8'],[14,'15']],yl:'computed change in voltage (mV)',xl:'cell along the row'});out+=pl.svg;
  dV.forEach((d,i)=>{const y=pl.Y(d);out+=R(pl.X(i)-10,y,20,pl.Y(0)-y,C.blue,'none',3)});
  if(lam>0)out+=L1_poly(range(141).map(j=>{const x=j/10;return [pl.X(x),pl.Y(dV[0]*Math.exp(-x/lam))]}),C.coral,2,'stroke-dasharray="5 4"');
  out+=TBF(pl.X(0)+14,pl.Y(dV[0])+4,`+${fmt(Math.round(dV[0]*10)/10)} mV`,13,C.ink,'start');
  out+=L1_tile(40,318,165,'Predicted λ (exact)',`${fmt(Math.round(lam*100)/100)} cells`,C.coral)+L1_tile(215,318,165,'From the bars',`${fmt(Math.round(fit*100)/100)} cells`,C.blue)+L1_tile(390,318,170,'Shortcut √(gj ÷ gm)',`${fmt(Math.round(Math.sqrt(gj/gm)*100)/100)} cells`,C.muted);
  out+=L1_badge(576,40,'model','end');
  return {svg:out,phase:gj===0?`With no junctions the injected cell rises by ${fmt(Math.round(dV[0]*10)/10)} mV and its neighbours not at all: fifteen separate cells.`:`Each step along the row keeps ${fmt(Math.round(Math.exp(-1/lam)*100))} % of the change in the cell before. The bars fall off with a length constant of ${fmt(Math.round(fit*100)/100)} cells, matching the exact prediction. The dashed curve is drawn from the prediction, not fitted.`};
 }});

// Scene 3: gating. Published constants: junctional conductance half-maximal near a transjunctional voltage of 15 mV
// (amphibian blastomeres) and a Hill relation with intracellular pH, pK 7.3 and n of 4 to 5 (Spray, Harris & Bennett 1981).
const L1_SP={V0:15,pK:7.3,n:4.5,slope:.25,gmin:.05};   // V0, pK and n from the papers (n taken as 4.5); slope and gmin illustrative
const L1_gV=v=>L1_SP.gmin+(1-L1_SP.gmin)/(1+Math.exp(L1_SP.slope*(Math.abs(v)-L1_SP.V0)));
const L1_gPH=pH=>1/(1+Math.pow(10,(L1_SP.pK-pH)*L1_SP.n));
SCENE({id:'gap-junctions-gating',name:'Junctions open and close',tag:'Replicated finding · Gating by voltage and pH, 1981',
 definition:'Gap junctions are not fixed pipes. In 1981 David Spray, Andrew Harris and Michael Bennett showed, in early amphibian embryo cells, that junctional conductance falls steeply when the voltage difference between the two cells grows, half-maximal near 15 mV, and that it falls when the inside of the cells becomes acid, following a steep curve with a midpoint at pH 7.3. Many connexins also respond to calcium and to phosphorylation. So the network of coupled cells can rewire itself.',
 example:`At pH 7.3 the pH curve is at half its maximum; one pH unit more acid, at 6.3, almost every channel is shut (computed: ${fmt(Math.round(L1_gPH(6.3)*1000)/10)} %). With 30 mV between two cells, the voltage curve gives ${fmt(Math.round(L1_gV(30)*100))} % of the open conductance.`,
 desc:'Two curves, junctional conductance against transjunctional voltage and against intracellular pH, with markers at the chosen values, and the resulting coupling of a cell pair.',
 research:['Spray, Harris & Bennett (1981). Equilibrium properties of a voltage-dependent junctional conductance. Journal of General Physiology 77, 77–93.','Spray, Harris & Bennett (1981). Gap junctional conductance is a simple and sensitive function of intracellular pH. Science 211.','Curve midpoints and the pH steepness are from these papers; the voltage curve’s slope and floor are illustrative.'],
 dur:10,hint:'Change the voltage difference across the junction and the pH inside the cells, and see how much of the open conductance remains and how strongly the pair is coupled.',
 init:()=>({vj:0,ph:74}),
 watch(p){return p<.5?{vj:Math.round(p*2*40),ph:74}:{vj:0,ph:Math.round(lerp(76,64,(p-.5)*2))}},
 ui:[{range:'vj',label:'Voltage across the junction',min:0,max:40,get:s=>s.vj,act:'vj',show:v=>v+' mV'},{range:'ph',label:'pH inside',min:62,max:78,get:s=>s.ph,act:'ph',show:v=>fmt(v/10)}],
 on:{vj(s,v){s.vj=clamp(Math.round(+v),0,40)},ph(s,v){s.ph=clamp(Math.round(+v),62,78)}},
 draw(s){
  const pH=s.ph/10,gv=L1_gV(s.vj),gp=L1_gPH(pH),g=gv*gp,gj=10*g,k=gj/(gj+1);
  let out=heading(`${fmt(Math.round(g*100))} % of the open conductance remains`);
  const a=L1_plot(60,70,220,170,[0,40],[0,1.05],{xt:[[0,'0'],[15,'15'],[40,'40 mV']],yt:[[0,'0'],[.5,'0.5'],[1,'1']],yl:'conductance vs voltage',xl:'voltage across the junction'});
  const b=L1_plot(350,70,220,170,[6.2,7.8],[0,1.05],{xt:[[6.2,'6.2'],[7.3,'7.3'],[7.8,'7.8']],yt:[[0,'0'],[.5,'0.5'],[1,'1']],yl:'conductance vs pH',xl:'pH inside the cells'});
  out+=a.svg+b.svg;
  out+=L1_poly(range(81).map(i=>[a.X(i/2),a.Y(L1_gV(i/2))]),C.purple,2.4)+Ci(a.X(s.vj),a.Y(gv),5,C.purple);
  out+=L1_poly(range(81).map(i=>{const x=6.2+i*.02;return [b.X(x),b.Y(L1_gPH(x))]}),C.green,2.4)+Ci(b.X(pH),b.Y(gp),5,C.green);
  out+=L(a.X(15),a.Y(0),a.X(15),a.Y(1),C.grid,1.2,'stroke-dasharray="3 3"')+L(b.X(7.3),b.Y(0),b.X(7.3),b.Y(1),C.grid,1.2,'stroke-dasharray="3 3"');
  out+=L1_tile(60,280,160,'Voltage factor',`${fmt(Math.round(gv*100))} %`,C.purple)+L1_tile(230,280,160,'pH factor',`${fmt(Math.round(gp*100))} %`,C.green)+L1_tile(400,280,170,'Pair coupling (toy)',fmt(Math.round(k*100)/100),C.blue);
  out+=L1_badge(60,334,'rep');
  out+=TF(580,348,'Open junction 10 × membrane; factors multiplied.',13,C.muted,'end');
  return {svg:out,phase:`With ${s.vj} mV across the junction and pH ${fmt(pH)} inside, ${fmt(Math.round(gv*100))} % of the voltage-sensitive conductance and ${fmt(Math.round(gp*100))} % of the pH-sensitive conductance remain. A pair of cells that would be coupled at ${fmt(Math.round(10/11*100)/100)} is now coupled at ${fmt(Math.round(k*100)/100)}.`};
 }});

// Scene 4: voltage domains in a sheet. Left cells have many potassium channels, right cells few; coupling blends them.
const L1_DW=10,L1_DH=6;
function L1_domains(s){const n=L1_DW*L1_DH,E=[],gm=[];for(let k=0;k<n;k++){const x=k%L1_DW,m=x<L1_DW/2?0:2;E.push(L1_MIXV[m]);gm.push(1)}
 const gj=s.gj/10,cut=s.cut;const gjAt=(a,b)=>{const xa=a%L1_DW,xb=b%L1_DW;return cut&&Math.min(xa,xb)===L1_DW/2-1&&Math.max(xa,xb)===L1_DW/2?gj*.02:gj};
 const V=L1_sheet(L1_DW,L1_DH,E,gm,gjAt);
 const row=range(L1_DW).map(x=>V[2*L1_DW+x]),lo=row[0],hi=row[L1_DW-1],sp=hi-lo;
 let w=0;if(sp>1)for(let x=0;x<L1_DW;x++){const u=(row[x]-lo)/sp;if(u>.1&&u<.9)w++}
 return {V,E,row,spread:sp,width:w}}
SCENE({id:'gap-junctions-domains',name:'Separate domains or one voltage',tag:'Simplified model · How coupling shapes voltage domains',
 definition:'A tissue made of two kinds of cells, one with many potassium channels and one with few, would on its own show two voltages. Gap junctions pull neighbours towards each other. Weak coupling leaves two sharp voltage domains; strong coupling smears them into a gradient and, very strong, into nearly one voltage. Closing the junctions along a boundary keeps the domains sharp even in a well-coupled tissue. Later lessons use real versions of this: domains that prefigure organs, and cells that disconnect.',
 example:`On their own the two cell types sit at ${L1_mv(L1_MIXV[0])} and ${L1_mv(L1_MIXV[2])}. Couple every cell to its neighbours as strongly as its own membrane and the two halves come closer, with a boundary a few cells wide. Close the junctions along the boundary and the halves separate again.`,
 desc:'A sheet of 60 model cells, left half with many potassium channels and right half with few, coloured and numbered by computed voltage, with the coupling strength, an option to close junctions along the boundary, and tiles for the spread and the width of the boundary. A 3D view shows voltage as height.',
 research:['Toy model written for this course: a linear network solved to its steady state. It has no voltage-gated channels, so it cannot keep a domain by itself; models that can are in era 8.','Goodenough & Paul (2009). Cold Spring Harbor Perspectives in Biology 1, a002576 (gap junctions in tissues).'],
 dur:12,hint:'Change the coupling strength and close or open the junctions along the boundary. Watch the spread between the two halves and the width of the boundary.',
 init:()=>({gj:10,cut:0}),
 watch(p){return {gj:p<.7?Math.round(lerp(0,60,smooth(p/.7))):60,cut:p>=.7?1:0}},
 ui:[{range:'gj',label:'Coupling (junction ÷ membrane)',min:0,max:80,step:2,get:s=>s.gj,act:'gj',show:v=>fmt(v/10)},{b:'Close junctions at the boundary: on/off',act:'cut'}],
 on:{gj(s,v){s.gj=clamp(Math.round(+v/2)*2,0,80)},cut(s){s.cut=s.cut?0:1}},
 draw(s){
  const d=L1_domains(s),cw=44,ch=34,x0=150,y0=58;
  let out=heading(d.spread<8?'Nearly one voltage across the sheet':d.width<=1?'Two sharp voltage domains':'Two domains joined by a gradient');
  d.V.forEach((v,k)=>{const x=k%L1_DW,y=(k/L1_DW)|0;out+=R(x0+x*cw,y0+y*ch,cw-3,ch-3,L1_vcol(v,-90,-10),'#fff',5)+TF(x0+x*cw+cw/2-1,y0+y*ch+ch/2+4,L1_n(v),13,Math.abs(v+50)<14?C.ink:'#fff')});
  if(s.cut)out+=L(x0+5*cw-1.5,y0-6,x0+5*cw-1.5,y0+L1_DH*ch+3,C.amber,4,'stroke-dasharray="6 4"')+TF(x0+5*cw,y0+L1_DH*ch+18,'junctions closed here',13,C.amber);
  out+=TF(x0,y0+L1_DH*ch+18,'many K⁺ channels',13,C.blue,'start')+TF(x0+L1_DW*cw-3,y0+L1_DH*ch+18,'few K⁺ channels',13,C.coral,'end');
  out+=L1_vbar(x0,272,L1_DW*cw-3,-90,-10,'computed voltage');
  out+=L1_tile(150,316,130,'Coupling',fmt(s.gj/10)+' ×',C.ink)+L1_tile(290,316,160,'Spread, edge to edge',`${fmt(Math.round(d.spread))} mV`,C.blue)+L1_tile(460,316,130,'Boundary width',`${d.width} cells`,C.coral);
  out+=L1_badge(10,58,'model','start');
  return {svg:out,phase:`The halves would sit ${fmt(Math.round(L1_MIXV[2]-L1_MIXV[0]))} mV apart on their own; with coupling ${fmt(s.gj/10)} times the membrane${s.cut?' and the boundary junctions closed':''}, they are ${fmt(Math.round(d.spread))} mV apart across a boundary ${d.width} cells wide. Every number is the network’s steady state.`};
 },
 three(s,f,X,project){
  const d=L1_domains(s),hs=v=>(v+100)/30,items=[];const P=project([0,L1_DW,0,L1_DH,0,hs(-10)]);
  const faces=[];d.V.forEach((v,k)=>{const x=k%L1_DW,y=(k/L1_DW)|0;faces.push(...prism(x+.1,y+.1,0,.8,.8,hs(v),L1_vhex(v,-90,-10)))});
  let svg=paintFaces(faces,P);
  return {svg:svg+TF(300,30,'Height and colour: computed voltage (higher = less negative)',13,C.muted),caption:'Schematic 3D view of the same sheet: each column’s height is its computed voltage above −100 mV.',title:'Voltage domains as a surface'};
 }});

/* ===================== Lesson: instructive-signals ===================== */
// Scene 1: two toy worlds. A region's voltage comes from its channel mix (Goldman). In the permissive world a structure
// forms whenever the region is negative enough, and a separate chemical prepattern decides which one (always A).
// In the instructive world the voltage range itself decides: below −60 mV A, −60 to −35 mV B, above −35 mV none.
const L1_PERM_T=-45,L1_INS_T=[-60,-35];
const L1_perm=V=>V<L1_PERM_T?'A':'none';
const L1_ins=V=>V<L1_INS_T[0]?'A':V<L1_INS_T[1]?'B':'none';
function L1_shape(x,y,k,col){if(k==='A')return `<polygon points="${x},${y-24} ${x+24},${y+18} ${x-24},${y+18}" fill="${col}" stroke="${C.ink}" stroke-width="1.5"/>`;
 if(k==='B')return Ci(x,y,22,col,C.ink);return TF(x,y+5,'nothing forms',13,C.muted)}
SCENE({id:'instructive-signals',name:'Permissive or instructive?',tag:'Framework or hypothesis · Testing what a signal does',
 definition:'A signal is permissive if it only allows a process to go ahead, and instructive if changing it changes which outcome happens. Blocking a signal and seeing a process fail shows only that it is needed; both kinds pass that test. The telling experiment changes the signal to a different value and asks whether the outcome changes in a specific way. Michael Levin’s lab argues that some voltage patterns are instructive, and points to experiments where changing voltage with different channels, carrying different ions, gave the same outcome: then the voltage itself, not one ion or protein, would carry the information. That argument is the lab’s; this course labels it a hypothesis and follows the tests.',
 example:'In both toy worlds below, a strongly negative region forms structure A, and a strongly depolarised region forms nothing: the voltage is needed in both. Only the middle setting tells them apart: the permissive world still makes A, because a chemical prepattern decides which structure; the instructive world makes B.',
 desc:'A region of model tissue whose voltage the learner sets by its channel mix, and side by side the outcome predicted by a permissive world and by an instructive world, with the experiment that distinguishes them.',
 research:['Levin (2014). Molecular bioelectricity: how endogenous voltage potentials control cell behavior and instruct pattern regulation in vivo. Molecular Biology of the Cell 25, 3835–3850.','Levin (2021). Bioelectric signaling: reprogrammable circuits underlying embryogenesis, regeneration, and cancer. Cell 184, 1971–1989.','Toy worlds written for this course; their thresholds are illustrative.'],
 dur:10,hint:'Set the region’s channel mix and compare what each toy world predicts. Find the setting that tells the two worlds apart.',
 init:()=>({mix:0}),
 watch(p){return {mix:Math.min(2,Math.floor(p*3))}},
 ui:[{choose:[[0,'Many K⁺ channels'],[1,'Some'],[2,'Few K⁺ channels']],label:'Region’s channels',get:s=>s.mix,act:'mix'}],
 on:{mix(s,v){s.mix=clamp(Math.round(+v),0,2)}},
 draw(s){
  const V=L1_MIXV[s.mix],a=L1_perm(V),b=L1_ins(V),differ=a!==b;
  let out=heading(differ?'This setting tells the two worlds apart':s.mix===0?'Both worlds make A: no test yet':'Both fail: the voltage is needed in both');
  out+=R(40,52,520,58,'#fff',C.grid,8)+TF(56,76,'region’s computed voltage',13,C.muted,'start')+TBF(56,98,L1_mv(V),16,C.ink,'start');
  out+=L1_vbar(250,64,290,-90,-10,'');
  const Xv=v=>250+(v+90)/80*290;out+=`<polygon points="${fmt(Xv(V))},62 ${fmt(Xv(V)-6)},52 ${fmt(Xv(V)+6)},52" fill="${C.ink}"/>`;
  const panel=(x,title,sub,res,rule)=>R(x,126,250,170,differ?'#fff':'#f7fafc',differ?C.purple:C.grid,10)+TBF(x+125,148,title,14,C.ink)+TF(x+125,166,sub,13,C.muted)+L1_shape(x+125,214,res,res==='A'?C.amberp:C.greenp)+TBF(x+125,262,res==='none'?'no structure':'structure '+res,14,res==='none'?C.coral:C.ink)+TF(x+125,284,rule,13,C.muted);
  out+=panel(40,'Permissive world','voltage only allows growth',a,`grows below ${L1_mv(L1_PERM_T)}; chemicals pick`);
  out+=panel(310,'Instructive world','voltage chooses the outcome',b,`A below ${L1_n(L1_INS_T[0])}, B to ${L1_mv(L1_INS_T[1])}`);
  out+=L1_badge(40,308,'frame')+L1_badge(40+L1_badgeW('frame')+8,308,'model');
  out+=TF(300,348,differ?'A specific change of outcome is the mark of an instructive signal.':'Necessity alone cannot separate permissive from instructive.',13,differ?C.purple:C.ink);
  return {svg:out,phase:differ?`At ${L1_mv(V)} the permissive world still makes A, while the instructive world makes B. Only an experiment that sets the voltage to a new value, and sees a new, specific outcome, can tell them apart.`:s.mix===2?`At ${L1_mv(V)} neither world forms anything. Blocking a signal this way shows it is necessary, which both kinds of signal are.`:`At ${L1_mv(V)} both worlds make structure A. Nothing distinguishes them until the voltage is changed.`};
 }});

// Scene 2: a voltage French flag. A row of coupled cells; the first is held depolarised by many sodium-like channels
// (a strong source). Each cell reads its own voltage against two thresholds set between the resting and source voltages.
const L1_FN=30;
function L1_flag(s){const Erest=L1_MIXV[0],Esrc=L1_MIXV[2],gm=new Array(L1_FN).fill(1);gm[0]=s.src;const E=new Array(L1_FN).fill(Erest);E[0]=Esrc;
 const V=L1_row(E,gm,s.gj/10,[]),T1=Erest+.5*(Esrc-Erest),T2=Erest+.15*(Esrc-Erest);
 const band=V.map(v=>v>T1?0:v>T2?1:2),cnt=[0,1,2].map(b=>band.filter(x=>x===b).length);return {V,T1,T2,band,cnt,Erest,Esrc}}
SCENE({id:'instructive-signals-flag',name:'A French flag made of voltage',tag:'Framework or hypothesis · Positional information, chemical and electrical',
 definition:'How does a cell know where it is? Lewis Wolpert’s positional information (1969) offered one answer: a substance made at one end fades with distance, and cells read its level against thresholds, like the three stripes of a French flag. Alan Turing (1952) showed another: two reacting, diffusing chemicals can make stripes and spots with no source at all. Both are chemical accounts. The lab’s hypothesis is that voltage, spreading through gap junctions, can carry positional information too. This toy shows the logic, not evidence that embryos work this way.',
 example:'Hold the first cell of a coupled row depolarised. Its neighbours are pulled up by less and less, so the voltage fades along the row. Cells above the upper threshold take the first fate, cells between the thresholds the second, the rest the third. Strengthen the coupling and the flag’s stripes widen, because the length constant grows.',
 desc:'A row of 30 coupled model cells with a depolarised source at the left, the computed voltage profile with two thresholds, the three fates as coloured stripes, and counts of cells in each stripe.',
 research:['Wolpert (1969). Positional information and the spatial pattern of cellular differentiation. Journal of Theoretical Biology 25, 1–47.','Turing (1952). The chemical basis of morphogenesis. Philosophical Transactions of the Royal Society B 237, 37–72. Biology In Motion’s morphogenesis-flag and morphogenesis scenes show both chemical accounts.','Toy model written for this course: the row model of the gap-junctions lesson with one clamped source cell.'],
 dur:10,hint:'Change the coupling and the strength of the source cell, and see where the thresholds cut the voltage profile. The thresholds are fixed fractions of the way from rest to the source voltage.',
 init:()=>({gj:40,src:20}),
 watch(p){return {gj:Math.round(lerp(5,120,smooth(p))),src:20}},
 ui:[{range:'gj',label:'Coupling (junction ÷ membrane)',min:0,max:150,step:5,get:s=>s.gj,act:'gj',show:v=>fmt(v/10)},{range:'src',label:'Source cell strength',min:2,max:40,get:s=>s.src,act:'src',show:v=>v+' × membrane'}],
 on:{gj(s,v){s.gj=clamp(Math.round(+v/5)*5,0,150)},src(s,v){s.src=clamp(Math.round(+v),2,40)}},
 draw(s){
  const r=L1_flag(s),cw=18,x0=30,cols=[C.blue,'#ffffff',C.coral],names=['first fate','second fate','third fate'];
  let out=heading(`Stripes of ${r.cnt[0]}, ${r.cnt[1]} and ${r.cnt[2]} cells`);
  const pl=L1_plot(x0,64,L1_FN*cw,170,[0,L1_FN-1],[-85,-20],{yt:[[-80,'−80'],[-50,'−50'],[-20,'−20']],yl:'computed voltage (mV)'});out+=pl.svg;
  for(const [T,lab] of [[r.T1,'upper threshold'],[r.T2,'lower threshold']])out+=L(x0,pl.Y(T),x0+L1_FN*cw,pl.Y(T),C.purple,1.4,'stroke-dasharray="5 4"')+TF(x0+L1_FN*cw-4,pl.Y(T)-5,`${lab} ${L1_mv(T)}`,13,C.purple,'end');
  out+=L1_poly(r.V.map((v,i)=>[pl.X(i),pl.Y(v)]),C.ink,2.4);r.V.forEach((v,i)=>{out+=Ci(pl.X(i),pl.Y(v),3,C.ink)});
  r.band.forEach((b,i)=>{out+=R(x0+i*cw,252,cw-1,34,cols[b],C.line,2)});
  out+=TF(x0,304,'source cell',13,C.coral,'start')+TF(x0+L1_FN*cw,304,'cell 30',13,C.muted,'end');
  [0,1,2].forEach(b=>{const x=x0+b*180;out+=R(x,318,14,14,cols[b],C.line,2)+TF(x+20,330,`${names[b]}: ${r.cnt[b]} cells`,13,C.ink,'start')});
  out+=L1_badge(x0,350,'frame')+L1_badge(x0+L1_badgeW('frame')+8,350,'model');
  out+=TF(580,364,`λ = ${fmt(Math.round(L1_lam(s.gj/10,1)*100)/100)} cells`,13,C.muted,'end');
  return {svg:out,phase:`The source cell sits at ${L1_mv(r.V[0])}; the row relaxes towards ${L1_mv(r.Erest)} with a length constant of ${fmt(Math.round(L1_lam(s.gj/10,1)*100)/100)} cells. Reading two thresholds gives stripes of ${r.cnt.join(', ')} cells. Wolpert’s flag works the same way with a chemical; whether voltage plays this role in embryos is what later eras test.`};
 }});

// Scene 3: sort real experiments by the strongest claim each supports.
const L1_EXP=[
 {t:['Amiloride cut limb-stump currents;','regrowth failed in about half.'],who:'Borgens and others (1979), salamanders',lab:'single',ans:'nec',why:'Removing the current stopped regrowth in some: necessity.'},
 {t:['Blocking a proton pump stopped tail','regrowth, but not wound healing.'],who:'Adams, Masi & Levin (2007), Xenopus',lab:'single',ans:'nec',why:'The pump’s activity was needed for regeneration: necessity.'},
 {t:['A yeast proton pump restored tail','regrowth at a stage that fails.'],who:'Adams, Masi & Levin (2007), Xenopus',lab:'single',ans:'suf',why:'Adding the voltage change triggered regrowth: sufficiency.'},
 {t:['Reversing a current changed which','end of a hydroid stem regrew first.'],who:'Lund (1920s), Obelia',lab:'single',ans:'ins',why:'Changing the signal changed the outcome: instructive.'},
 {t:['Changing the voltage of cells far','from the head gave eye-like organs.'],who:'Pai et al. (2012), Xenopus',lab:'single',ans:'ins',why:'A specific new structure: the lab reads it as instructive.'},
 {t:['Reversing an applied field reverses','the way epithelial cells crawl.'],who:'many labs; McCaig et al. (2005)',lab:'rep',ans:'ins',why:'The field sets the direction itself: instructive.'}];
const L1_ECAT={nec:['Necessary',C.blue],suf:['Sufficient',C.green],ins:['Instructive',C.purple],'':['Tap to sort',C.muted]};
SCENE({id:'instructive-signals-sort',name:'Necessary, sufficient or instructive?',tag:'Framework or hypothesis · Sorting the evidence',
 definition:'Three kinds of experiment build the case that a signal matters. Necessity: remove or block it and the outcome fails. Sufficiency: add it where it is absent and the outcome happens. Instructiveness: change it to a different value and a different, specific outcome follows. Each step is stronger than the one before, and each can be undermined by side effects of the drug or gene used. Sort these experiments by the strongest claim they support; each card also carries the evidence label for the finding itself.',
 example:'The tail experiments of Dany Spencer Adams and colleagues show both kinds in one paper: blocking a proton pump stopped regeneration (necessity), and expressing a yeast pump in tadpoles at a stage that normally fails to regrow restored it (sufficiency). Lund’s reversed currents and the ectopic eyes go further: they change which outcome happens.',
 desc:'Six cards with real experiments from this era and later ones, each with its own evidence badge, which the learner sorts into necessary, sufficient and instructive, with the reasoning shown.',
 research:['Adams, Masi & Levin (2007). H+ pump-dependent changes in membrane voltage are an early mechanism necessary and sufficient to induce Xenopus tail regeneration. Development 134, 1323–1335.','Pai, Aw, Shomrat, Lemire & Levin (2012). Transmembrane voltage potential controls embryonic eye patterning in Xenopus laevis. Development 139, 313–323.','Borgens and colleagues (1979), Journal of Experimental Zoology 209; Lund (1947); McCaig et al. (2005), Physiological Reviews 85.'],
 dur:12,hint:'Tap a card to sort it as necessary, sufficient or instructive; tap again to change. The verdict line explains the usual reading. Eras 3 to 5 return to these experiments.',
 shared:'l1-sort',
 init:()=>({pick:['','','','','',''],show:-1}),
 watch(p){const k=Math.min(6,Math.floor(p*7));return {pick:L1_EXP.map((c,i)=>i<k?c.ans:''),show:k-1}},
 ui:[{b:'Show the usual readings',act:'all'},{b:'Clear',act:'clear'}],
 on:{card(s,i){i=+i;if(!(i>=0&&i<6))return 'keep';const order=['','nec','suf','ins'];s.pick=s.pick.slice();s.pick[i]=order[(order.indexOf(s.pick[i])+1)%4];s.show=i;return 'keep'},
  all(s){s.pick=L1_EXP.map(c=>c.ans);s.show=-1},clear(s){s.pick=['','','','','',''];s.show=-1}},
 draw(s,f,X){
  const done=s.pick.filter(Boolean).length,match=s.pick.filter((p,i)=>p&&p===L1_EXP[i].ans).length;
  let out=T(20,30,'Which kind of evidence?',18,C.ink,'start','font-weight="650"');
  L1_EXP.forEach((c,i)=>{const col=i%2,row=(i/2)|0,x=20+col*286,y=46+row*98,pk=s.pick[i],[lab,ink]=L1_ECAT[pk];
   let inner=R(x,y,274,92,pk?'#fff':'#f6f9fb',pk?ink:C.grid,8)+TF(x+10,y+19,c.t[0],13,C.ink,'start')+TF(x+10,y+36,c.t[1],13,C.ink,'start')+TF(x+10,y+54,c.who,13,C.muted,'start');
   inner+=TBF(x+10,y+80,lab,13,ink,'start')+L1_badge(x+264,y+66,c.lab,'end');
   out+=hit(X,'card',i,`Experiment: ${c.t.join(' ')} Now: ${lab}. Press to change.`,inner)});
  const sh=s.show>=0?L1_EXP[s.show]:null;
  out+=R(20,342,560,34,C.purplep,'none',8)+TF(30,364,sh?sh.why:`${done} of 6 sorted; ${match} match the usual reading.`,13,C.ink,'start');
  out+=L1_badge(580,24,'frame','end');
  return {svg:out,phase:sh?`${sh.who}. Usual reading: ${L1_ECAT[sh.ans][0].toLowerCase()}. ${sh.why}${s.pick[s.show]&&s.pick[s.show]!==sh.ans?' Your choice differs; the categories overlap, and this is the strongest claim the experiment is usually taken to support.':''}`:`${done} of 6 sorted. Necessity is the commonest kind of evidence and the weakest; instructive experiments are rarer and carry the lab’s strongest claims, which is why later eras look closely at how often they have been repeated.`};
 }});
