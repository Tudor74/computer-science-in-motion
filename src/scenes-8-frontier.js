/* ===================== Levin Lab In Motion · Era 8 · Tools and open questions ===================== */
// Simulators of tissue voltage, ion-channel drugs, the "bioelectric code", what other labs have tested,
// the open questions, and the lab's most speculative idea.
// Every picture is a pure function of state, frame and X. Every voltage, count, fraction and accuracy on screen
// is computed here: from the Nernst and Goldman equations for the textbook concentrations below, from the toy
// bistable cell and its gap-junction network, from seeded toy datasets, or from a seeded toy of repeated
// experiments. The toy parameters (conductances, half-activation voltages) are not published values; they are
// chosen for this course and are labelled as such. Published values carry a research line.

/* ---- shared helpers ---- */
const L8_RTF=8.314462*(273.15+37)/96485.33*1000;                     // RT/F in mV at 37 °C
const L8_nernst=(out,inn,z=1)=>L8_RTF/z*Math.log(out/inn);
// Textbook concentrations (mM) for a mammalian cell, outside (o) and inside (i), as in standard physiology texts.
const L8_ION={Ko:5,Ki:140,Nao:145,Nai:15,Clo:110,Cli:10};
const L8_EK=L8_nernst(L8_ION.Ko,L8_ION.Ki),L8_ENA=L8_nernst(L8_ION.Nao,L8_ION.Nai);
// Goldman–Hodgkin–Katz voltage (mV) for relative permeabilities pK : pNa : pCl.
const L8_ghk=(pK,pNa,pCl)=>L8_RTF*Math.log((pK*L8_ION.Ko+pNa*L8_ION.Nao+pCl*L8_ION.Cli)/(pK*L8_ION.Ki+pNa*L8_ION.Nai+pCl*L8_ION.Clo));
const L8_mv=(v,d=0)=>{const r=Math.round(v*Math.pow(10,d))/Math.pow(10,d);return (r<0?'−':r>0?'+':'')+Math.abs(r).toFixed(d)+' mV'};
const L8_n=(v,d=0)=>{const r=Math.round(v*Math.pow(10,d))/Math.pow(10,d);return (r<0?'−':'')+Math.abs(r).toFixed(d)};
const L8_pct=v=>Math.round(v*100)+'%';
const L8_note=(s,y=370)=>TF(300,y,s,13,C.muted);
const L8_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function L8_tile(x,y,w,label,value,col=C.blue){return R(x,y,w,46,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+38,value,15,col)}
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function L8_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// The six evidence labels, each with its own colour pair. The badge is drawn beside the claim it applies to.
const L8_LABELS={rep:['Replicated finding',C.green,C.greenp],single:['Single-lab finding',C.blue,C.pale],frame:['Framework or hypothesis',C.purple,C.purplep],
 spec:['Speculation',C.amber,C.amberp],debate:['Criticism and debate',C.coral,C.coralp],model:['Simplified model',C.dark,'#eef2f4']};
const L8_badgeW=k=>Math.round(L8_LABELS[k][0].length*7.1+18);
function L8_badge(x,y,k,anchor='start'){const [lab,ink,fill]=L8_LABELS[k],w=L8_badgeW(k),x0=anchor==='end'?x-w:anchor==='middle'?x-w/2:x;
 return R(x0,y,w,20,fill,ink,10,k==='model'?'stroke-dasharray="4 3" stroke-width="1.4"':'stroke-width="1.4"')+TBF(x0+w/2,y+14.5,lab,12.5,ink)}
function L8_badges(x,y,keys){let out='',cx=x;for(const k of keys){out+=L8_badge(cx,y,k);cx+=L8_badgeW(k)+8}return out}
// Voltage colour: blue for more negative, coral for less negative; always paired with numbers or marks.
function L8_vcol(v,lo=-90,hi=10){const u=clamp((v-lo)/(hi-lo),0,1);const a=[23,114,183],b=[196,82,56],w=[246,246,246];
 const m=u<.5?a.map((q,i)=>Math.round(lerp(q,w[i],u*2))):w.map((q,i)=>Math.round(lerp(q,b[i],(u-.5)*2)));return `rgb(${m.join(',')})`}
function L8_vbar(x,y,w,lo,hi,label='membrane voltage'){let out='';const n=24;for(let i=0;i<n;i++)out+=R(x+i*w/n,y,w/n+.5,12,L8_vcol(lo+(hi-lo)*(i+.5)/n,lo,hi),'none',0);
 return out+R(x,y,w,12,'none',C.line,2)+TF(x,y+28,L8_mv(lo),13,C.muted,'start')+TF(x+w,y+28,L8_mv(hi),13,C.muted,'end')+TF(x+w/2,y+28,label,13,C.muted)}
// Text wrapped to a width (in characters) as a list of lines.
function L8_wrap(s,n){const words=String(s).split(' '),out=[];let line='';for(const w of words){if((line+' '+w).trim().length>n&&line){out.push(line);line=w}else line=(line+' '+w).trim()}if(line)out.push(line);return out}
function L8_lines(x,y,s,n,size=13,col=C.ink,anchor='start',gap=17){return L8_wrap(s,n).map((l,i)=>TF(x,y+i*gap,l,size,col,anchor)).join('')}
// A card that the learner taps to read (Try it); in Watch the cards open one by one.
function L8_card(X,x,y,w,h,open,title,act,arg,col=C.blue,fill='#fff'){
 const inner=R(x,y,w,h,open?fill:'#fff',open?col:C.line,9)+TBF(x+10,y+19,title,13,open?col:C.ink,'start');
 return hit(X,act,arg,title+(open?' (open)':'. Press to read.'),inner);
}

/* ---- the toy bistable cell (used in lessons bioelectric-models and open-questions) ----
 Membrane current (arbitrary conductance units) = voltage-gated K⁺ channel + K⁺ leak + Na⁺ leak.
 The gated K⁺ channel is open at negative voltages and closes when the cell depolarises (half-closed at
 −40 mV, slope 6 mV: toy values). Gap junctions add gj × (neighbour − self). Time is in model units. */
const L8_VH=-40,L8_VK=6,L8_GKL=.2;
const L8_gate=V=>1/(1+Math.exp((V-L8_VH)/L8_VK));
function L8_cur(V,o){const gk=o.vg===false?(o.gfix===undefined?.35:o.gfix):(o.gKv===undefined?1:o.gKv)*L8_gate(V);
 return -gk*(V-L8_EK)-L8_GKL*(V-L8_EK)-o.gNa*(V-L8_ENA)}
// Zero crossings of the membrane current between −100 and +40 mV, with their stability.
function L8_roots(o){const r=[];let prev=L8_cur(-100,o);for(let v=-100+.05;v<=40;v+=.05){const c=L8_cur(v,o);if(prev*c<=0&&prev!==c)r.push({v:v-.025,stable:c<prev});prev=c}return r}
// Simulate a W×H sheet (H=1 for a row). V0: initial voltages; inj(k,t): extra current. Returns snapshots at the given steps.
function L8_sim(W,H,V0,o,gj,snaps,dt=.05,inj=null){let V=V0.slice();const out=[];const last=Math.max(...snaps);let si=0;const sorted=snaps.slice().sort((a,b)=>a-b);
 for(let t=0;t<=last;t++){while(si<sorted.length&&sorted[si]===t){out.push(V.slice());si++}
  if(t===last)break;const N=new Array(V.length);
  for(let k=0;k<V.length;k++){const x=k%W,y=(k/W)|0;let d=L8_cur(V[k],o);
   if(gj){if(x>0)d+=gj*(V[k-1]-V[k]);if(x<W-1)d+=gj*(V[k+1]-V[k]);if(y>0)d+=gj*(V[k-W]-V[k]);if(y<H-1)d+=gj*(V[k+W]-V[k])}
   if(inj)d+=inj(k,t);N[k]=V[k]+dt*d}V=N}
 return out}
// Which cells are on the depolarised side of the cell's unstable point (or of the midpoint if there is none).
function L8_split(o){const r=L8_roots(o),u=r.find(q=>!q.stable);return u?u.v:-30}

/* ===================== Lesson: bioelectric-models ===================== */
const L8_SW=12,L8_SH=6,L8_SNAP=[0,150,400,800,1400,2200,3200,5000];
function L8_sheetStart(seed){const r=rng(seed),V=[];for(let y=0;y<L8_SH;y++)for(let x=0;x<L8_SW;x++)V.push(-30+40*(.5-x/(L8_SW-1))+(r()-.5)*50);return V}
const L8_ING={full:{vg:true,gj:.1,label:'Channel + gap junctions'},nogj:{vg:true,gj:0,label:'No gap junctions'},novg:{vg:false,gj:.1,label:'No voltage gating'}};
function L8_sheetFrames(s){const ing=L8_ING[s.ing],o={vg:ing.vg,gNa:.3},snaps=L8_sim(L8_SW,L8_SH,L8_sheetStart(s.seed),o,ing.gj,L8_SNAP),cut=ing.vg?L8_split(o):null;
 return snaps.map((V,i)=>{const dep=cut===null?null:V.filter(v=>v>cut).length,mean=sum(V)/V.length,t=L8_SNAP[i]*.05,last=i===snaps.length-1;
  return {V,dep,mean,t,cut,say:i===0?`Start: ${L8_SW*L8_SH} cells with scattered voltages, a little higher on the left on average. Mean ${L8_mv(mean)}. Step through to let the model run.`:
   !last?(dep===null?`Model time ${L8_n(t)}: mean ${L8_mv(mean)}; with no gated channel there is no tipping point, so no cell is on one side or the other.`:`Model time ${L8_n(t)}: ${dep} cells are on the depolarised side, mean ${L8_mv(mean)}.`):
   s.ing==='full'?`Settled: ${dep} depolarised cells form one block on the left, the rest are hyperpolarised. Each cell can rest at either voltage, and gap junctions make neighbours agree, so two clean domains form.`:
   s.ing==='nogj'?`Settled: ${dep} depolarised cells, scattered like salt and pepper. Each cell can rest at either voltage, but with no gap junctions each simply keeps whichever side it started on.`:
   `Settled: every cell sits at ${L8_mv(mean)}. Without the voltage-gated channel each cell has only one resting voltage, so the sheet becomes uniform and no pattern can be held.`}})}
SCENE({id:'bioelectric-models',name:'A tissue in a computer',tag:'Simplified model · BETSE and a toy sheet, 2016',
 definition:'BETSE, the bioelectric tissue simulation engine, was written by Alexis Pietak with Michael Levin and described in 2016. It simulates a sheet of cells: ions moving through channels and pumps, gap junctions between neighbours, and the voltages, concentrations and currents that result over time. Like every model it is a simplification of real tissue, built to ask which patterns are stable and what might shift them.',
 example:'The sheet drawn here is a toy written for this course, not BETSE. Each cell has a K⁺ leak, a Na⁺ leak and a K⁺ channel that closes when the cell depolarises, so a cell can rest at either of two voltages. Gap junctions join neighbours. Remove one ingredient at a time and see what the sheet settles into.',
 desc:'A grid of 72 model cells coloured by computed voltage, with a plus mark on depolarised cells, a list of the model’s ingredients, counts of depolarised cells and the mean voltage, and a colour scale.',
 research:['Pietak & Levin (2016). Exploring instructive physiological signaling with the bioelectric tissue simulation engine. Frontiers in Bioengineering and Biotechnology 4, 55.','Toy sheet: written for this course; its conductances and gating values are illustrative, not measured. Ion concentrations: textbook values for a mammalian cell.'],
 dur:11,hint:'Choose which ingredients the model has, then step through or run. Try new starting voltages to see that the outcome does not depend on one lucky start.',
 init:()=>({ing:'full',seed:3}),
 trace:L8_sheetFrames,
 ui:[{choose:[['full','Both'],['nogj','No gap junctions'],['novg','No gating']],label:'Ingredients',get:s=>s.ing,act:'ing'},{b:'New starting voltages',act:'seed'}],
 on:{ing(s,v){s.ing=L8_ING[v]?v:'full'},seed(s){s.seed=s.seed%97+5}},
 draw(s,f,X){
  const ing=L8_ING[s.ing],cs=26,x0=36,y0=76;
  let out=heading(f.t===0?'A toy sheet of cells, before it runs':'The toy sheet after '+L8_n(f.t)+' model time units');
  out+=L8_badge(36,44,'model')+TF(36+L8_badgeW('model')+8,58,'a toy for this course, not BETSE',13,C.muted,'start');
  f.V.forEach((v,k)=>{const x=x0+(k%L8_SW)*cs,y=y0+((k/L8_SW)|0)*cs;out+=R(x,y,cs-3,cs-3,L8_vcol(v,-70,10),'#fff',5);if(f.cut!==null&&v>f.cut)out+=TBF(x+(cs-3)/2,y+18,'+',14,C.ink)});
  out+=L8_vbar(x0,y0+L8_SH*cs+10,L8_SW*cs-3,-70,10);
  out+=TF(x0,y0+L8_SH*cs+58,'+ marks a cell on the depolarised side',13,C.muted,'start');
  // ingredients panel
  const px=372;out+=R(px,76,204,128,'#fff',C.grid,8)+TBF(px+12,96,'In this run',13,C.ink,'start');
  const items=[['K⁺ and Na⁺ leaks',true],['gated K⁺ channel',ing.vg],['gap junctions',ing.gj>0]];
  items.forEach(([lab,on],i)=>{const y=120+i*26;out+=R(px+12,y-12,16,16,on?C.green:'#fff',on?C.green:C.line,4)+(on?TBF(px+20,y+1,'✓',12,'#fff'):TBF(px+20,y+1,'–',12,C.muted))+TF(px+36,y+1,lab,13,on?C.ink:C.muted,'start')});
  out+=TF(px+12,194,'gating: closes on depolarising',13,C.muted,'start');
  out+=L8_tile(px,214,98,'depolarised',f.dep===null?'no 2 states':`${f.dep} of ${f.V.length}`,C.coral)+L8_tile(px+106,214,98,'mean',L8_mv(f.mean),C.blue);
  out+=L8_lines(px,286,'Real tissue: many ion species, pumps, changing concentrations, 3D shape, growth. All left out here.',30,13,C.muted);
  return {svg:out,phase:f.say};
 }});

// One cell: the current–voltage curve and where it crosses zero.
function L8_cellFrames(s){const o={gKv:s.gk/10,gNa:s.gna/100},r=L8_roots(o),snaps=[0,40,100,200,400,800,1600],tr=[];let V=s.v0;let t=0;
 const at=new Set(snaps);for(let i=0;i<=1600;i++){if(at.has(i))tr.push({V,t:i*.05});V+=.05*L8_cur(V,o)}
 const stable=r.filter(q=>q.stable),fin=tr[tr.length-1].V;
 return tr.map((q,i)=>({...q,o,r,path:tr.slice(0,i+1),say:i===0?`Start the cell at ${L8_mv(s.v0)}. The curve shows the net current at each voltage: above the line the cell is pushed positive, below it is pushed negative.`:
  i<tr.length-1?`Model time ${L8_n(q.t)}: the cell is at ${L8_mv(q.V,1)}, drifting toward the nearest stable crossing.`:
  stable.length>1?`It settles at ${L8_mv(fin)}. This cell has ${stable.length} stable resting voltages (${stable.map(z=>L8_mv(z.v)).join(' and ')}); where it ends depends on where it started, so it can hold a one-bit memory.`:
  `It settles at ${L8_mv(fin)}. With these strengths the curve crosses zero only once, so the cell has a single resting voltage and remembers nothing of its start.`}))}
SCENE({id:'bioelectric-models-bistable',name:'One cell, two resting voltages',tag:'Simplified model · bistable membrane voltage',
 definition:'A cell is bistable when it can rest at either of two voltages. This happens when a channel’s opening depends on the voltage it helps to set: here a K⁺ channel is open at negative voltages, which keeps the cell negative, and closes when the cell depolarises, which lets it stay depolarised. Modellers including Javier Cervera, Salvador Mafe and colleagues in Valencia, and the Levin lab, have studied such bistability in non-excitable cells.',
 example:'With the starting strengths the curve crosses zero three times. The outer two crossings are stable; the middle one is a tipping point. Start the cell on either side of it and it falls to a different resting voltage. Weaken the gated channel or strengthen the Na⁺ leak and one stable crossing disappears.',
 desc:'A plot of net membrane current against voltage for the toy cell, with stable crossings drawn as filled circles and the tipping point as an open circle; a marker follows the cell’s computed voltage over time, and tiles list the crossings.',
 research:['Law & Levin (2015). Bioelectric memory: modeling resting potential bistability in amphibian embryos and mammalian cells. Theoretical Biology and Medical Modelling 12, 22.','Cervera, Alcaraz & Mafe (2014). Membrane potential bistability in nonexcitable cells as described by inward and outward voltage-gated ion channels. Journal of Physical Chemistry B.','Toy cell: illustrative conductances; textbook ion concentrations.'],
 dur:10,hint:'Set the strength of the gated K⁺ channel and of the Na⁺ leak, choose a starting voltage, then step through. Count the stable crossings each time.',
 init:()=>({gk:10,gna:30,v0:-25}),
 trace:L8_cellFrames,
 ui:[{range:'gk',label:'Gated K⁺ channel',min:0,max:20,get:s=>s.gk,act:'gk',show:v=>fmt(v/10)},{range:'gna',label:'Na⁺ leak',min:10,max:45,get:s=>s.gna,act:'gna',show:v=>fmt(v/100)},
  {choose:[['-80','Start −80'],['-45','Start −45'],['-25','Start −25']],label:'Starting voltage',get:s=>String(s.v0),act:'v0'}],
 on:{gk(s,v){s.gk=clamp(Math.round(+v),0,20)},gna(s,v){s.gna=clamp(Math.round(+v),10,45)},v0(s,v){s.v0=[-80,-45,-25].includes(+v)?+v:-25}},
 draw(s,f,X){
  const o=f.o,ys=[];for(let v=-100;v<=30;v+=2)ys.push(L8_cur(v,o));const m=Math.max(10,...ys.map(Math.abs));
  const pl=L8_plot(70,84,330,206,[-100,30],[-m,m],{xt:[[-100,'−100'],[-60,'−60'],[-20,'−20'],[20,'+20']],xl:'membrane voltage (mV)',yl:'net current (toy units): + pushes up'});
  let out=heading('Where the current is zero, the cell can rest')+pl.svg+L(70,pl.Y(0),400,pl.Y(0),C.line,1.4);
  out+=L8_poly(range(66).map(i=>{const v=-100+i*2;return [pl.X(v),pl.Y(L8_cur(v,o))]}),C.blue,2.4);
  f.r.forEach(q=>{out+=Ci(pl.X(q.v),pl.Y(0),7,q.stable?C.ink:'#fff',C.ink)});
  // drift arrows on the axis
  for(let v=-90;v<=20;v+=22){const c=L8_cur(v,o);if(Math.abs(c)>m*.04)out+=arrow(pl.X(v),pl.Y(0)+16,pl.X(v)+(c>0?16:-16),pl.Y(0)+16,C.muted,1.8,7)}
  const cx=pl.X(clamp(f.V,-100,30));out+=Ci(cx,pl.Y(clamp(L8_cur(f.V,o),-m,m)),8,C.coral,'#fff');
  out+=L8_badge(400,44,'model','end');
  // tiles
  const px=420,st=f.r.filter(q=>q.stable),un=f.r.filter(q=>!q.stable);
  out+=L8_tile(px,70,160,'stable resting voltages',String(st.length),st.length>1?C.coral:C.blue);
  out+=R(px,124,160,Math.max(46,22+18*f.r.length),'#fff',C.grid,8);
  f.r.forEach((q,i)=>{out+=Ci(px+16,140+i*18,5,q.stable?C.ink:'#fff',C.ink)+TF(px+28,145+i*18,(q.stable?'stable ':'tipping ')+L8_mv(q.v),13,C.ink,'start')});
  out+=L8_tile(px,236,160,'the cell now',L8_mv(f.V,1),C.coral);
  out+=TF(px,306,'gated K⁺ '+fmt(o.gKv)+' · Na⁺ leak '+fmt(o.gNa),13,C.muted,'start')+TF(px,324,'K⁺ leak '+fmt(L8_GKL)+' (fixed)',13,C.muted,'start');
  out+=L8_note('Filled: stable. Open: tipping point. Arrows: which way the voltage drifts.',356);
  return {svg:out,phase:f.say};
 }});

// A row of cells with two domains; coupling and the Na⁺ leak decide whether they hold or one takes over.
const L8_RN=16,L8_RSNAP=[0,200,600,1200,2200,3600,6000];
function L8_rowFrames(s){const o={vg:true,gNa:s.gna/100},gj=s.gj/100,V0=range(L8_RN).map(i=>i<6?-5:-80),snaps=L8_sim(L8_RN,1,V0,o,gj,L8_RSNAP),cut=L8_split(o);
 return snaps.map((V,i)=>{const dep=V.filter(v=>v>cut).length,last=i===snaps.length-1;
  return {V,dep,cut,t:L8_RSNAP[i]*.05,o,gj,say:i===0?`Start: the left 6 cells depolarised, the other 10 hyperpolarised. Coupling ${fmt(gj)}, Na⁺ leak ${fmt(o.gNa)}.`:
   !last?`Model time ${L8_n(L8_RSNAP[i]*.05)}: ${dep} cells depolarised.`:
   dep===6?`Settled with the two domains held: 6 depolarised cells and 10 hyperpolarised. The boundary is pinned because the coupling is too weak to drag a cell over its tipping point.`:
   dep===L8_RN?`The depolarised domain took over all ${L8_RN} cells. At this Na⁺ leak the depolarised state is the stronger one, and the coupling is strong enough to push the boundary along.`:
   dep===0?`The hyperpolarised domain took over: no cell is left depolarised. Neighbours pulled the depolarised block back over its tipping point.`:
   `Settled with ${dep} depolarised cells: the boundary moved and then stuck.`}})}
SCENE({id:'bioelectric-models-flip',name:'Flip one parameter',tag:'Simplified model · domains that hold or spread',
 definition:'In a network of bistable cells joined by gap junctions, a block of depolarised cells next to hyperpolarised ones can stay put, or one state can spread until it fills the tissue. Which happens depends on the coupling and on the balance of channels. Pietak and Levin (2017) coupled bioelectric models with gene-regulatory networks to study such pattern formation, and the lab has used similar models to choose interventions in frog embryos.',
 example:'With weak coupling (0.05) and a Na⁺ leak of 0.30 the two domains hold. Raise the coupling to 0.20: the boundary still holds, but leak at 0.25 and the hyperpolarised side wins; at 0.35 with coupling 0.10 the depolarised side wins. A small change in one parameter can flip the whole pattern, which is why models are used to look for such points.',
 desc:'A row of 16 model cells with their computed voltages written in them and a plus mark on depolarised cells, a line plot of voltage along the row, and tiles for the coupling, the leak and the number of depolarised cells.',
 research:['Pietak & Levin (2017). Bioelectric gene and reaction networks: computational modelling of genetic, biochemical and bioelectrical dynamics in pattern regulation. Journal of the Royal Society Interface 14, 20170425.','Pai, Pietak, Willocq, Ye, Shi & Levin (2018), Nature Communications 9, 998: a model of this kind guided the choice of intervention (frog embryos; see brain-rescue).','Toy row: written for this course; illustrative values.'],
 dur:10,hint:'Change the gap-junction coupling and the Na⁺ leak, then run the row. Look for the settings at which the pattern holds, and those at which one side takes over.',
 init:()=>({gj:5,gna:30}),
 trace:L8_rowFrames,
 ui:[{range:'gj',label:'Coupling',min:0,max:40,get:s=>s.gj,act:'gj',show:v=>fmt(v/100)},{range:'gna',label:'Na⁺ leak',min:20,max:40,get:s=>s.gna,act:'gna',show:v=>fmt(v/100)}],
 on:{gj(s,v){s.gj=clamp(Math.round(+v),0,40)},gna(s,v){s.gna=clamp(Math.round(+v),20,40)}},
 draw(s,f,X){
  const cw=34,x0=300-L8_RN*cw/2;
  let out=heading(f.t===0?'Two domains, before the model runs':'After '+L8_n(f.t)+' model time units');
  out+=L8_badge(x0,44,'model');
  f.V.forEach((v,i)=>{const x=x0+i*cw;out+=R(x+1,74,cw-3,48,L8_vcol(v,-80,10),'#fff',6)+TMF(x+cw/2,96,L8_n(v),13,C.ink)+(v>f.cut?TBF(x+cw/2,116,'+',14,C.ink):'')});
  out+=TF(x0,140,'cell 1',13,C.muted,'start')+TF(x0+L8_RN*cw,140,'cell '+L8_RN,13,C.muted,'end')+TF(300,140,'voltage in mV, written in each cell',13,C.muted);
  const pl=L8_plot(x0+10,160,L8_RN*cw-20,110,[0,L8_RN-1],[-85,15],{yt:[[-80,'−80'],[-40,'−40'],[0,'0']]});
  out+=pl.svg+L(pl.X(0),pl.Y(f.cut),pl.X(L8_RN-1),pl.Y(f.cut),C.amber,1.4,'stroke-dasharray="5 4"')+TF(pl.X(L8_RN-1)-4,pl.Y(f.cut)-6,'tipping point '+L8_mv(f.cut),13,C.amber,'end');
  out+=L8_poly(f.V.map((v,i)=>[pl.X(i),pl.Y(v)]),C.blue,2.4);
  out+=L8_tile(x0,292,124,'coupling',fmt(f.gj))+L8_tile(x0+134,292,124,'Na⁺ leak',fmt(f.o.gNa))+L8_tile(x0+268,292,124,'depolarised',`${f.dep} of ${L8_RN}`,C.coral)+L8_tile(x0+402,292,142,'started with','6 of '+L8_RN,C.muted);
  out+=L8_note('Left out: real ion species and pumps, growth, chemical signals, noise.',362);
  return {svg:out,phase:f.say};
 }});

/* ---- a sorter: the learner places each statement in a bin, then compares with the course's reading ----
 def: {bins:[[key,label,colour]], items:[{t:short text, bin:key, why:reason}], top:svg (optional badge row)}.
 Watch places the items one by one in the course's bins. Nothing is scored: the course's reading is shown as a
 reading, with its reason, and the learner may disagree. */
function L8_sorter(def){
 const N=def.items.length,B=def.bins;
 const init=()=>({place:range(N).map(()=>-1),show:false,sel:0});
 const course=i=>B.findIndex(b=>b[0]===def.items[i].bin);
 return {...def,
  init,
  watch(p){const k=Math.min(N,Math.floor(p*(N+1.2)));const s=init();for(let i=0;i<k;i++)s.place[i]=course(i);s.show=true;s.sel=clamp(k-1,0,N-1);return s},
  ui:[{b:'Show or hide the course’s reading',act:'show'},{b:'Clear my placements',act:'clear'}],
  on:{cycle(s,a){const i=clamp(+a|0,0,N-1);s.place[i]=s.place[i]+1>=B.length?-1:s.place[i]+1;s.sel=i},show(s){s.show=!s.show},clear(s){s.place=range(N).map(()=>-1);s.show=false;s.sel=0}},
  draw(s,f,X){
   const rh=Math.min(40,240/N),y0=def.y0||66;
   let out=heading(def.title)+(def.top?def.top(s):'');
   def.items.forEach((it,i)=>{const y=y0+i*rh,pl=s.place[i],cb=course(i),sel=i===s.sel,agree=pl===cb;
    let inner=R(16,y,568,rh-5,sel?'#f4f8fb':'#fff',sel?C.blue:C.grid,8)+TF(28,y+rh/2+2,it.t,13,C.ink,'start');
    const bx=388,bw=184;
    inner+=R(bx,y+5,bw,rh-15,pl<0?'#fff':tint(B[pl][2],.82),pl<0?C.line:B[pl][2],7)+TBF(bx+bw/2,y+rh/2+2,pl<0?'tap to place':B[pl][1],13,pl<0?C.muted:B[pl][2]);
    out+=hit(X,'cycle',i,`${it.t}. Placed: ${pl<0?'nowhere':B[pl][1]}. Press to move.`,inner);
    if(s.show)out+=TBF(bx-8,y+rh/2+2,pl<0?'':agree?'✓':'≠',13,agree?C.green:C.amber,'end');
   });
   const yb=y0+N*rh+4,placed=s.place.filter(v=>v>=0).length,agree=s.place.filter((v,i)=>v>=0&&v===course(i)).length,it=def.items[s.sel],cb=course(s.sel);
   out+=R(16,yb,568,Math.max(50,368-yb),'#fff',C.grid,8);
   if(s.show){out+=TBF(28,yb+18,'Course’s reading: '+B[cb][1],13,B[cb][2],'start')+L8_lines(28,yb+36,it.why,78,13,C.ink)}
   else out+=TF(28,yb+18,`Placed ${placed} of ${N}. Tap a row to move it between bins.`,13,C.muted,'start')+TF(28,yb+36,'Then show the course’s reading to compare. There is no score.',13,C.muted,'start');
   if(s.show&&placed)out+=TF(572,yb+18,`${agree} of ${placed} placed agree`,13,C.muted,'end');
   const ph=s.show?`${it.t}: the course reads this as “${B[cb][1]}”. ${it.why}`:`You have placed ${placed} of ${N} statements. Tap a statement to move it from bin to bin, then show the course’s reading.`;
   return {svg:out,phase:ph};
  }};
}

/* ===================== Lesson: electroceuticals ===================== */
const L8_BASE={pK:1,pNa:.05,pCl:.45};
const L8_ECL=L8_nernst(L8_ION.Clo,L8_ION.Cli,-1);
const L8_DRUG={kopen:{ion:'pK',m:3,label:'K⁺-channel opener'},kblock:{ion:'pK',m:.2,label:'K⁺-channel blocker'},naopen:{ion:'pNa',m:6,label:'Na⁺-channel opener'},clopen:{ion:'pCl',m:4,label:'Cl⁻-channel opener'}};
function L8_drugState(d,dose){const g=L8_DRUG[d],p={...L8_BASE};p[g.ion]=L8_BASE[g.ion]*(1+(g.m-1)*dose/100);return {d,dose,p,v0:L8_ghk(L8_BASE.pK,L8_BASE.pNa,L8_BASE.pCl),v1:L8_ghk(p.pK,p.pNa,p.pCl)}}
const L8_DRUG_ORDER=['kopen','kblock','naopen','clopen'];
SCENE({id:'electroceuticals',name:'Shifting voltage with channel drugs',tag:'Framework or hypothesis · repurposing ion-channel drugs',
 definition:'Many approved drugs act on ion channels. The Levin lab has proposed that some of them could be repurposed to shift voltage patterns in non-neural tissue, and has called such uses “electroceuticals”. This is a proposal: it has been tested in animals and cells, not as a treatment in people. Nothing here is medical advice, and no drug named in this course is something a reader should take.',
 example:'In the toy cell, opening more K⁺ channels pulls the voltage toward the K⁺ equilibrium voltage, so the cell hyperpolarises; blocking them, or opening Na⁺ channels, depolarises it. Earlier eras met animal uses of this idea: an ionophore with raised sodium in tadpole tails (era 4), a drug that opened a channel the lab had expressed in instructor cells, and drugs acting on HCN channels in frog embryos (era 5).',
 desc:'A model cell with three kinds of channel drawn with widths that follow their permeabilities, bars of the permeabilities before and after a drug class is applied, a voltage scale marking the equilibrium voltages and the computed voltages before and after, and tiles for the shift.',
 research:['Overington, Al-Lazikani & Hopkins (2006). How many drug targets are there? Nature Reviews Drug Discovery 5, 993–996 (ion channels are one of the main classes of drug target).','Toy cell: the Goldman equation for textbook concentrations; the drug classes act by scaling one permeability (illustrative factors, not any real drug).'],
 dur:12,hint:'Choose a class of channel drug and its dose, and read the computed shift. Which classes hyperpolarise and which depolarise?',
 init:()=>L8_drugState('kopen',60),
 watch(p){const k=Math.min(3,Math.floor(p*4)),u=p*4-k;return L8_drugState(L8_DRUG_ORDER[k],Math.round(100*smooth(clamp(u*1.6,0,1))))},
 ui:[{choose:L8_DRUG_ORDER.map(k=>[k,L8_DRUG[k].label.replace('-channel','')]),label:'Drug class',get:s=>s.d,act:'d'},{range:'dose',label:'Dose (toy units)',min:0,max:100,get:s=>s.dose,act:'dose'}],
 on:{d(s,v){Object.assign(s,L8_drugState(L8_DRUG[v]?v:'kopen',s.dose))},dose(s,v){Object.assign(s,L8_drugState(s.d,clamp(Math.round(+v),0,100)))}},
 draw(s){
  const g=L8_DRUG[s.d],sh=s.v1-s.v0;
  let out=heading(g.label+': '+(Math.abs(sh)<.5?'no shift yet':sh<0?'the cell hyperpolarises':'the cell depolarises'));
  out+=L8_badges(30,44,['frame','model']);
  // cell with channels
  out+=Ci(110,170,70,'#f7fbfd',C.line);
  [['pK','K⁺',C.blue,-50],['pNa','Na⁺',C.coral,0],['pCl','Cl⁻',C.green,50]].forEach(([k,lab,col,dy])=>{const w=clamp(4+s.p[k]*7,4,26);out+=R(172-w/2,170+dy-12,w,24,col,'none',4)+TF(196,170+dy+5,lab,13,col,'start')});
  out+=TF(110,175,'model cell',13,C.muted);
  // permeability bars
  const bx=240,bw=150;out+=TBF(bx,84,'permeability',13,C.ink,'start');
  [['pK','K⁺',C.blue],['pNa','Na⁺',C.coral],['pCl','Cl⁻',C.green]].forEach(([k,lab,col],i)=>{const y=100+i*44,sc=bw/3;
   out+=TF(bx,y+13,lab,13,col,'start')+R(bx+32,y,L8_BASE[k]*sc,12,tint(col,.6),'none',3)+R(bx+32,y+15,Math.min(bw,s.p[k]*sc),12,col,'none',3)+TF(bx+36+Math.min(bw,s.p[k]*sc),y+26,fmt(Math.round(s.p[k]*100)/100),13,C.ink,'start')});
  out+=R(bx,236,10,10,tint(C.blue,.6),'none',2)+TF(bx+14,245,'before',13,C.muted,'start')+R(bx+70,236,10,10,C.blue,'none',2)+TF(bx+84,245,'with drug',13,C.muted,'start');
  // voltage scale
  const vx=v=>40+(v+100)/170*520,vy=290;
  out+=L(vx(-100),vy,vx(70),vy,C.line,2);
  for(const v of [-100,-50,0,50])out+=L(vx(v),vy-4,vx(v),vy+4,C.line,1)+TF(vx(v),vy+18,v===0?'0':L8_n(v),13,C.muted);
  out+=TF(vx(70),vy+18,'mV',13,C.muted,'end');
  [[L8_EK,'E K⁺',C.blue],[L8_ECL,'E Cl⁻',C.green],[L8_ENA,'E Na⁺',C.coral]].forEach(([v,lab,col],i)=>{out+=L(vx(v),vy-10,vx(v),vy,col,2)+TF(vx(v)+(i===1?14:0),vy-14,lab,13,col)});
  out+=Ci(vx(s.v0),vy,6,'#fff',C.ink)+Ci(vx(s.v1),vy,6,C.ink);
  out+=L8_tile(404,84,84,'before',L8_mv(s.v0,1),C.muted)+L8_tile(496,84,84,'with drug',L8_mv(s.v1,1),C.ink)+L8_tile(404,138,176,'computed shift',(sh>=0?'+':'−')+Math.abs(Math.round(sh*10)/10).toFixed(1)+' mV',sh<0?C.blue:C.coral);
  out+=L8_lines(404,206,'Open circle: before. Filled: with the drug.',26,13,C.muted);
  out+=L8_note('Not medical advice. Tested in animals and cells, not as treatments in people.',334)+L8_note('Toy cell: real drugs act on channel subtypes, with side effects and doses not modelled.',356);
  const ph=`${g.label} at dose ${s.dose}: the ${g.ion==='pK'?'K⁺':g.ion==='pNa'?'Na⁺':'Cl⁻'} permeability goes from ${fmt(L8_BASE[g.ion])} to ${fmt(Math.round(s.p[g.ion]*100)/100)}, and the Goldman voltage from ${L8_mv(s.v0,1)} to ${L8_mv(s.v1,1)}. The voltage moves toward the equilibrium voltage of whichever ion gains a larger share of the permeability.`;
  return {svg:out,phase:ph};
 }});

SCENE({id:'electroceuticals-senses',name:'Two meanings of one word',tag:'Framework or hypothesis · two uses of “electroceuticals”',
 definition:'The word “electroceuticals” is used in two senses. In a 2013 commentary in Nature, Kristoffer Famm and colleagues, from GlaxoSmithKline and academic labs, used it for small implanted devices that read and stimulate peripheral nerves to change how organs work, a field also called bioelectronic medicine. The Levin lab uses it for drugs, often existing ion-channel drugs, that change resting voltage in non-neural tissue. Both are proposals for research; say which sense is meant.',
 example:'“Stimulate a nerve with patterned pulses to change an organ’s activity” is the device sense. “Choose a channel drug to hyperpolarise cells in a frog embryo” is the lab’s sense. The first works through the nervous system’s own signals; the second acts on the resting voltage of ordinary cells.',
 desc:'Six statements, each with a bin the learner chooses: the nerve-stimulation sense or the ion-channel-drug sense, and a panel giving the course’s reading with a reason.',
 research:['Famm, Litt, Tracey, Boyden & Slaoui (2013). Drug discovery: a jump-start for electroceuticals. Nature 496, 159–161.','Churchill, Winter, Tuszynski & Levin (2019), iScience 11: EDEn, the electroceutical design environment, a database of ion channels, their tissue expression and small molecules that act on them.'],
 dur:12,hint:'Tap each statement to place it under one sense or the other, then show the course’s reading.',
 ...L8_sorter({title:'Which sense of “electroceutical” is meant?',y0:70,top:()=>L8_badge(16,42,'frame')+TF(16+L8_badgeW('frame')+8,56,'both senses are research proposals',13,C.muted,'start'),
  bins:[['nerve','Nerve stimulation',C.amber],['drug','Ion-channel drugs',C.purple]],
  items:[
   {t:'An implant sends patterned pulses down a nerve',bin:'nerve',why:'This is the device sense of Famm and colleagues (2013): read and write the signals in peripheral nerves.'},
   {t:'A K⁺-channel opener hyperpolarises embryo cells',bin:'drug',why:'This is the lab’s sense: an ion-channel drug changes the resting voltage of non-neural cells.'},
   {t:'It acts through the nervous system’s own signals',bin:'nerve',why:'Nerve-stimulation devices change organ function by changing nerve activity, not the resting voltage of the organ’s cells.'},
   {t:'Pick drugs by which channels a tissue expresses',bin:'drug',why:'This is the aim of EDEn (Churchill et al. 2019): pair ion-channel expression in tissues with known channel drugs.'},
   {t:'The target is a voltage pattern across a tissue',bin:'drug',why:'The lab’s proposal aims at the spatial pattern of resting voltages, which earlier eras linked to shape in frogs and worms.'},
   {t:'Electrodes also record what the nerve is doing',bin:'nerve',why:'Devices in the nerve-stimulation sense can be built to record nerve activity as well as stimulate it; the lab’s sense involves no electrodes.'}]})});

// Same drug, different tissues: the effect depends on how much of the target channel each tissue expresses.
const L8_TIS=[{name:'Tissue A',kx:.8,ky:0},{name:'Tissue B',kx:.35,ky:.6},{name:'Tissue C',kx:0,ky:.3}];
function L8_tisV(t,s){const tgt=s.tgt,share=t[tgt],f=s.act==='open'?1+2*s.dose/100:1-.9*s.dose/100,pK=L8_BASE.pK*((1-share)+share*f);return {v0:L8_ghk(L8_BASE.pK,L8_BASE.pNa,L8_BASE.pCl),v1:L8_ghk(pK,L8_BASE.pNa,L8_BASE.pCl),share}}
SCENE({id:'electroceuticals-tissues',name:'Same drug, different tissues',tag:'Simplified model · why expression data matter',
 definition:'A channel drug acts only where its target channel is present. Tissues express different mixes of channel subtypes, so the same drug can shift one tissue’s voltage a lot and another’s not at all. EDEn, the electroceutical design environment described by Churchill and colleagues with Levin in 2019, is a database that pairs ion-channel expression in tissues with small molecules known to act on those channels, to help choose candidates for experiments. It is a research tool, not a guide to treatment.',
 example:'Three toy tissues share the same overall K⁺ permeability, but split it differently between two subtypes, Kx and Ky. A blocker of Kx depolarises tissue A strongly, tissue B less, and leaves tissue C unchanged, because C has no Kx at all.',
 desc:'Three model tissues, each with a bar showing what share of its K⁺ permeability comes from the subtypes Kx and Ky, and the computed voltage before and after the chosen drug, with the shift written beside it.',
 research:['Churchill, Winter, Tuszynski & Levin (2019), iScience 11: EDEn, the electroceutical design environment, a database of ion channels, their tissue expression and small molecules that act on them.','Toy tissues: invented shares of two invented subtypes; Goldman equation with textbook concentrations.'],
 dur:10,hint:'Choose which subtype the drug acts on, whether it opens or blocks it, and the dose. Compare the shift in the three tissues.',
 init:()=>({tgt:'kx',act:'block',dose:80}),
 watch(p){const k=Math.min(3,Math.floor(p*4)),u=p*4-k;return {tgt:k<2?'kx':'ky',act:k%2?'open':'block',dose:Math.round(100*smooth(clamp(u*1.6,0,1)))}},
 ui:[{choose:[['kx','Acts on Kx'],['ky','Acts on Ky']],label:'Target',get:s=>s.tgt,act:'tgt'},{choose:[['block','Blocker'],['open','Opener']],label:'Action',get:s=>s.act,act:'act'},{range:'dose',label:'Dose (toy units)',min:0,max:100,get:s=>s.dose,act:'dose'}],
 on:{tgt(s,v){s.tgt=v==='ky'?'ky':'kx'},act(s,v){s.act=v==='open'?'open':'block'},dose(s,v){s.dose=clamp(Math.round(+v),0,100)}},
 draw(s){
  const res=L8_TIS.map(t=>L8_tisV(t,s));
  let out=heading(`A ${s.act==='open'?'opener':'blocker'} of ${s.tgt==='kx'?'Kx':'Ky'} at dose ${s.dose}`)+L8_badges(30,44,['model','frame']);
  L8_TIS.forEach((t,i)=>{const y=80+i*82,r=res[i],sh=r.v1-r.v0;
   out+=R(30,y,540,70,'#fff',C.grid,8)+TBF(44,y+22,t.name,14,C.ink,'start');
   const bw=170;out+=R(44,y+34,bw*t.kx,16,C.purple,'none',3)+R(44+bw*t.kx,y+34,bw*t.ky,16,C.amber,'none',3)+R(44+bw*(t.kx+t.ky),y+34,bw*(1-t.kx-t.ky),16,C.grid,'none',3);
   out+=TF(44,y+64,`Kx ${L8_pct(t.kx)} · Ky ${L8_pct(t.ky)} · other ${L8_pct(1-t.kx-t.ky)}`,13,C.muted,'start');
   out+=L8_tile(240,y+12,96,'before',L8_mv(r.v0,1),C.muted)+L8_tile(344,y+12,96,'with drug',L8_mv(r.v1,1),C.ink);
   out+=TBF(560,y+42,(Math.abs(sh)<.05?'no change':(sh>0?'+':'−')+Math.abs(sh).toFixed(1)+' mV'),15,Math.abs(sh)<.05?C.muted:sh<0?C.blue:C.coral,'end');
  });
  out+=R(44,330,12,12,C.purple,'none',2)+TF(60,341,'Kx',13,C.ink,'start')+R(96,330,12,12,C.amber,'none',2)+TF(112,341,'Ky',13,C.ink,'start')+TF(150,341,'share of each tissue’s K⁺ permeability',13,C.muted,'start');
  out+=L8_note('Not medical advice. Invented tissues and subtypes; real tissues express dozens of channels.',366);
  const big=res.map((r,i)=>[Math.abs(r.v1-r.v0),L8_TIS[i].name]).sort((a,b)=>b[0]-a[0]);
  const ph=`The largest computed shift is in ${big[0][1]} (${big[0][0].toFixed(1)} mV), the smallest in ${big[2][1]} (${big[2][0].toFixed(1)} mV). The drug is the same; only the share of its target channel differs.`;
  return {svg:out,phase:ph};
 }});

/* ===================== Lesson: bioelectric-code ===================== */
const L8_CODE_TESTS=[
 {t:'1 · A mapping that holds across contexts',lab:'single',
  ev:'Offered: cells set to a narrow voltage range formed eye-like structures on the gut and tail of frog embryos (Pai et al. 2012). Not yet shown: whether a given pattern gives the same outcome across tissues, stages and species.',
  gc:'Genetic code: the same codon gives the same amino acid in nearly every organism.'},
 {t:'2 · A known reader',lab:'frame',
  ev:'Offered: candidate links from voltage to genes, such as calcium entry, serotonin moving through gap junctions and voltage-sensitive enzymes (open-questions). Not yet shown: a full path from a tissue’s pattern to an anatomy.',
  gc:'Genetic code: read by ribosomes and transfer RNAs, a machinery worked out in detail.'},
 {t:'3 · Write it by different means, same result',lab:'single',
  ev:'Offered: the lab reports that different channels or ions setting a similar voltage gave similar outcomes (eras 1 and 4), and that light-driven pumps can write voltage in tadpoles (Adams et al. 2013). Not yet shown: writing a new, predicted anatomy from a designed pattern.',
  gc:'Genetic code: changing one codon changes the protein in a predictable way.'}];
const L8_codeInit=()=>({open:[false,false,false],sel:0});
SCENE({id:'bioelectric-code',name:'What would make it a code?',tag:'Framework or hypothesis · the bioelectric code, 2018',
 definition:'In 2018 Michael Levin and Christopher Martyniuk proposed a “bioelectric code”: that patterns of resting voltage across tissues carry information about the anatomy to be built, and that cells read those patterns much as they read other signals. This is a hypothesis, not an established code like the genetic code. A strict code would need a mapping from patterns to outcomes that holds across contexts, a known reader, and the power to write a pattern and get a predicted result.',
 example:'The genetic code is a fixed table: 64 codons for 20 amino acids and stop signals, nearly the same in all life, read by known machinery. For voltage patterns the course has met evidence for parts of each test, almost all from one lab, and no table of patterns and outcomes.',
 desc:'Three cards, one for each test a strict code would have to pass, each giving the evidence the course has met and what is missing, beside a comparison with the genetic code.',
 research:['Levin & Martyniuk (2018). The bioelectric code: an ancient computational medium for dynamic control of growth and form. BioSystems 164, 76–93.','Pai, Aw, Shomrat, Lemire & Levin (2012). Development 139, 313–323 (induced eyes).','Adams, Tseng & Levin (2013). Biology Open 2, 306–313 (light-activated pump in tadpole tails).','The genetic code (64 codons, 20 amino acids, near-universal): standard textbook biology.'],
 dur:12,hint:'Open each test to read what the course has met for it and what is still missing.',
 init:L8_codeInit,
 watch(p){const s=L8_codeInit(),k=Math.min(3,Math.floor(p*3.6));for(let i=0;i<k;i++)s.open[i]=true;s.sel=clamp(k-1,0,2);return s},
 ui:[{b:'Open all three',act:'all'},{b:'Close all',act:'none'}],
 on:{card(s,a){const i=clamp(+a|0,0,2);s.open[i]=!s.open[i];s.sel=i},all(s){s.open=[true,true,true];s.sel=2},none(s){s.open=[false,false,false];s.sel=0}},
 draw(s,f,X){
  let out=heading('Three tests a strict code would have to pass')+L8_badge(20,42,'frame')+TF(20+L8_badgeW('frame')+8,56,'Levin & Martyniuk 2018',13,C.muted,'start');
  L8_CODE_TESTS.forEach((c,i)=>{const y=70+i*100,o=s.open[i];
   out+=L8_card(X,20,y,560,94,o,c.t,'card',i,C.purple,'#fbf9fe');
   if(o){out+=L8_lines(32,y+38,c.ev,78,13,C.ink,'start',16)+L8_badge(568,y+6,c.lab,'end')}
   else out+=TF(32,y+42,'Tap to read the evidence offered and what is missing.',13,C.muted,'start')+TF(32,y+62,c.gc,13,C.green,'start');
  });
  const c=L8_CODE_TESTS[s.sel];
  return {svg:out,phase:s.open[s.sel]?`${c.t.slice(4)}. ${c.ev} ${c.gc}`:'Each card is one test. Open it to see what evidence the course has met.'};
 }});

// Reading and writing a row of coupled cells.
const L8_TN=12;
function L8_tridiag(a,b,c,d){const n=b.length,cp=new Array(n),dp=new Array(n),x=new Array(n);cp[0]=c[0]/b[0];dp[0]=d[0]/b[0];
 for(let i=1;i<n;i++){const m=b[i]-a[i]*cp[i-1];cp[i]=c[i]/m;dp[i]=(d[i]-a[i]*dp[i-1])/m}
 x[n-1]=dp[n-1];for(let i=n-2;i>=0;i--)x[i]=dp[i]-cp[i]*x[i+1];return x}
// Steady state of a row: each cell leaks (conductance 1) to its own Goldman voltage E[i]; gap junctions gj between neighbours.
function L8_rowSteady(E,gj){const n=E.length,a=[],b=[],c=[],d=[];for(let i=0;i<n;i++){const gl=i>0?gj:0,gr=i<n-1?gj:0;a.push(-gl);c.push(-gr);b.push(1+gl+gr);d.push(E[i])}return L8_tridiag(a,b,c,d)}
const L8_WRITE={none:[1,1,'none'],K:[4,1,'K⁺ channel'],Na:[1,10,'Na⁺ channel']};
function L8_toolCalc(s){const E=s.w.map(k=>{const [mk,mn]=L8_WRITE[k];return L8_ghk(L8_BASE.pK*mk,L8_BASE.pNa*mn,L8_BASE.pCl)}),V=L8_rowSteady(E,.6);
 const sig=V.map(v=>1/(1+Math.exp(-(v+40)/12))),wts=[.1,.2,.4,.2,.1];
 const dye=V.map((_,i)=>sum(wts.map((w,j)=>w*sig[clamp(i+j-2,0,L8_TN-1)])));
 const lo=Math.min(...V),hi=Math.max(...V),dlo=Math.min(...dye),dhi=Math.max(...dye);
 const read=s.tool==='dye'?dye.map(b=>dhi-dlo<1e-6?0:(b-dlo)/(dhi-dlo)):s.tool==='gevi'?V.map(v=>hi-lo<1e-6?0:(v-lo)/(hi-lo)):null;
 return {E,V,read,lo,hi,dye}}
const L8_toolInit=()=>({w:range(L8_TN).map(i=>i>=3&&i<=5?'K':i===9?'Na':'none'),tool:'dye',sel:4});
SCENE({id:'bioelectric-code-tools',name:'Reading and writing voltage',tag:'Replicated finding · tools to read and write voltage',
 definition:'To test a code you must read patterns and write them. Reading: voltage-reporting dyes such as DiBAC4(3) show relative, slowly changing voltage differences across a tissue; genetically encoded indicators can be sharper; a microelectrode gives a true value, but one cell at a time. Writing: injecting RNA for an ion channel into chosen cells, drugs and ionophores, and light-driven pumps or channels in non-neural cells. These are standard methods, used by many labs; how far they can map a code is the open part.',
 example:'Write a K⁺ channel into cells 4 to 6 and a Na⁺ channel into cell 10. Gap junctions spread each change to the neighbours. The dye picture blurs the edges and saturates, and shows only relative brightness; the electrode gives millivolts, but for one cell.',
 desc:'A row of 12 model cells, with the channel written into each, their computed voltages, and below them what the chosen reading tool shows: relative brightness for the dye, a sharper relative signal for the indicator, or one cell’s voltage for the electrode.',
 research:['Adams & Levin (2012). Measuring resting membrane potential using the fluorescent voltage reporters DiBAC4(3) and CC2-DMPE. Cold Spring Harbor Protocols 2012(4), 459–464.','Adams, Tseng & Levin (2013). Light-activation of the Archaerhodopsin H⁺-pump reverses age-dependent loss of vertebrate regeneration. Biology Open 2, 306–313.','Toy row: Goldman voltages, a steady-state gap-junction solve, and invented blur and saturation for the dye.'],
 dur:10,hint:'Tap a cell to write a channel into it (none, K⁺, Na⁺). Choose a reading tool and compare what it shows with the computed voltages.',
 init:L8_toolInit,
 watch(p){const s=L8_toolInit();s.tool=p<.4?'dye':p<.7?'gevi':'electrode';s.sel=p<.85?4:9;return s},
 ui:[{choose:[['dye','Dye'],['gevi','Indicator'],['electrode','Electrode']],label:'Reading tool',get:s=>s.tool,act:'tool'},{b:'Clear all channels',act:'clear'}],
 on:{cell(s,a){const i=clamp(+a|0,0,L8_TN-1),seq=['none','K','Na'];s.w[i]=seq[(seq.indexOf(s.w[i])+1)%3];s.sel=i},tool(s,v){s.tool=['dye','gevi','electrode'].includes(v)?v:'dye'},clear(s){s.w=range(L8_TN).map(()=>'none')}},
 draw(s,f,X){
  const c=L8_toolCalc(s),cw=44,x0=300-L8_TN*cw/2;
  let out=heading('Write channels into cells, then read the pattern')+L8_badges(x0,42,['rep','model']);
  out+=TF(x0,174,'computed voltage (mV)',13,C.muted,'start');
  s.w.forEach((k,i)=>{const x=x0+i*cw,sel=i===s.sel;
   const inner=R(x+2,90,cw-4,32,k==='none'?'#fff':k==='K'?C.pale:C.coralp,sel?C.ink:C.line,6)+TBF(x+cw/2,111,k==='none'?'·':k==='K'?'K⁺':'Na⁺',13,k==='K'?C.blue:k==='Na'?C.coral:C.muted);
   out+=hit(X,'cell',i,`Cell ${i+1}: ${L8_WRITE[k][2]}. Press to change.`,inner);
   out+=R(x+2,128,cw-4,30,L8_vcol(c.V[i],-80,10),'#fff',6)+TMF(x+cw/2,148,L8_n(c.V[i]),13,C.ink);
   out+=TF(x+cw/2,84,String(i+1),13,C.muted);
  });
  // readout
  const yb=196;out+=TBF(x0,yb,s.tool==='dye'?'Dye image: relative brightness (brighter = more depolarised)':s.tool==='gevi'?'Indicator: relative signal, less blur':'Electrode: one cell, in millivolts',13,C.ink,'start');
  if(c.read){c.read.forEach((r,i)=>{const x=x0+i*cw,h=6+r*70;out+=R(x+6,yb+86-h,cw-12,h,s.tool==='dye'?'#7aa86a':C.purple,'none',4)+TF(x+cw/2,yb+102,String(Math.round(r*100)),13,C.ink)});
   out+=TF(x0,yb+122,'0 = dimmest cell in this row, 100 = brightest: no millivolts',13,C.muted,'start')}
  else{const x=x0+s.sel*cw;out+=P(`M${x+cw/2} ${yb+20} L${x+cw/2} ${yb+60}`,C.ink,2)+Ci(x+cw/2,yb+64,4,C.ink)+TBF(x+cw/2,yb+90,L8_mv(c.V[s.sel],1),15,C.ink)+TF(300,yb+122,'Tap another cell to move the electrode',13,C.muted)}
  const span=c.hi-c.lo;
  out+=L8_tile(x0,334,170,'true range in row',L8_n(span,1)+' mV')+L8_tile(x0+180,334,170,'K⁺ cells / Na⁺ cells',`${s.w.filter(k=>k==='K').length} / ${s.w.filter(k=>k==='Na').length}`,C.ink)+L8_tile(x0+360,334,168,'tool reports',s.tool==='electrode'?'mV, one cell':'relative only',C.purple);
  const ph=s.tool==='electrode'?`The electrode reads cell ${s.sel+1} at ${L8_mv(c.V[s.sel],1)}: exact in the model, but only one cell at a time.`:
   `The row spans ${L8_n(span,1)} mV in the model. The ${s.tool==='dye'?'dye shows only relative brightness, blurred over neighbours and squeezed at the extremes':'indicator shows a sharper relative signal, but still no millivolts'}; reading a code from such pictures needs calibration and care.`;
  return {svg:out,phase:ph};
 }});

// Decoding a toy dataset: does one rule map patterns to outcomes in both contexts?
const L8_DEC=(()=>{const r=rng(2024),pts=[];for(const ctx of ['A','B'])for(let i=0;i<24;i++){const v1=-80+70*r(),v2=-80+70*r(),chem=r()<.5,jy=r();
 const out=ctx==='A'?(v1-v2< -15):(v1-v2<(chem?-15:15));pts.push({ctx,v1,v2,chem,jy,out})}return pts})();
function L8_decAcc(feat,th,ctx){const p=L8_DEC.filter(q=>q.ctx===ctx);return p.filter(q=>((feat==='v1'?q.v1:q.v1-q.v2)<th)===q.out).length/p.length}
function L8_decBest(feat,ctx){let b=0,bt=0;for(let t=-80;t<=70;t++){const a=L8_decAcc(feat,t,ctx);if(a>b){b=a;bt=t}}return [b,bt]}
SCENE({id:'bioelectric-code-decode',name:'Try to decode the outcomes',tag:'Simplified model · a code must hold across contexts',
 definition:'Suppose a dataset links voltage patterns to outcomes. A decoding rule says which pattern gives which outcome. If one rule works in every context, that is evidence for a code; if it works in one tissue or stage and fails in another, something besides the pattern is deciding. The dataset here is generated by this scene, not taken from any experiment. It is a way to see what testing a bioelectric code would involve.',
 example:'Each toy embryo has two regions with voltages V1 and V2, and either formed a structure (filled dot) or not (open dot). In context A the outcome follows the difference V1 − V2. In context B the same difference matters, but where the cut-off lies depends on a hidden chemical signal present in about half the embryos. No threshold on voltage alone can then decode context B perfectly.',
 desc:'Two strip plots, one for each context, with toy embryos placed along the chosen voltage feature, filled if the structure formed and open if not, a threshold line, coral rings on embryos the rule gets wrong, and tiles for the accuracy in each context and the best accuracy any threshold could reach.',
 research:['Levin & Martyniuk (2018). BioSystems 164, 76–93 (the code hypothesis that this toy tests).','Toy dataset: 48 embryos generated with a fixed seed; the rule that made them is stated in the example.'],
 dur:12,hint:'Choose which feature to decode from and move the threshold. Find the best threshold for each context, then see whether one rule serves both.',
 init:()=>({feat:'v1',th:-45}),
 watch(p){return p<.5?{feat:'v1',th:Math.round(-75+60*smooth(p*2))}:{feat:'diff',th:Math.round(-50+50*smooth((p-.5)*2))}},
 ui:[{choose:[['v1','Region 1 voltage'],['diff','Difference V1 − V2']],label:'Feature',get:s=>s.feat,act:'feat'},{range:'th',label:'Threshold (mV)',min:-80,max:70,get:s=>s.th,act:'th'}],
 on:{feat(s,v){s.feat=v==='diff'?'diff':'v1'},th(s,v){s.th=clamp(Math.round(+v),-80,70)}},
 draw(s){
  const xr=s.feat==='v1'?[-80,-10]:[-70,70],X=v=>60+(clamp(v,xr[0],xr[1])-xr[0])/(xr[1]-xr[0])*400;
  let out=heading('Predict “formed” when the feature is below the threshold')+L8_badges(60,42,['model','frame']);
  const ticks=s.feat==='v1'?[-80,-60,-40,-20]:[-60,-30,0,30,60];
  [['A',80],['B',190]].forEach(([ctx,y])=>{out+=R(60,y,400,86,'#fff',C.grid,6)+TBF(52,y+48,ctx,15,C.ink,'end');
   L8_DEC.filter(q=>q.ctx===ctx).forEach(q=>{const fv=s.feat==='v1'?q.v1:q.v1-q.v2,x=X(fv),yy=y+12+q.jy*62,pred=fv<s.th,ok=pred===q.out;
    out+=Ci(x,yy,5.5,q.out?C.ink:'#fff',C.ink)+(ok?'':Ci(x,yy,9.5,'none',C.coral))});
   ticks.forEach(t=>{out+=TF(X(t),y+102,L8_n(t),13,C.muted)});
  });
  const tx=X(s.th);out+=L(tx,76,tx,282,C.purple,2.2);
  out+=TF(260,316,(s.feat==='v1'?'V1 (mV)':'V1 − V2 (mV)')+' · threshold '+L8_mv(s.th),13,C.purple);
  const aA=L8_decAcc(s.feat,s.th,'A'),aB=L8_decAcc(s.feat,s.th,'B'),[bA,tA]=L8_decBest(s.feat,'A'),[bB,tB]=L8_decBest(s.feat,'B');
  out+=L8_tile(478,80,104,'accuracy A',L8_pct(aA),C.ink)+L8_tile(478,132,104,'best in A',L8_pct(bA),C.muted)+L8_tile(478,190,104,'accuracy B',L8_pct(aB),C.ink)+L8_tile(478,242,104,'best in B',L8_pct(bB),C.muted);
  out+=Ci(70,336,5.5,C.ink,C.ink)+TF(82,341,'formed',13,C.ink,'start')+Ci(150,336,5.5,'#fff',C.ink)+TF(162,341,'did not',13,C.ink,'start')+Ci(240,336,8,'none',C.coral)+TF(254,341,'rule is wrong here',13,C.ink,'start');
  out+=L8_note('Toy data generated by this scene. Real tests would need many tissues, stages and species.',368);
  const ph=`With the threshold at ${L8_n(s.th)} mV the rule is right for ${L8_pct(aA)} of context A and ${L8_pct(aB)} of context B. The best any threshold on this feature can do is ${L8_pct(bA)} in A (at ${L8_n(tA)}) and ${L8_pct(bB)} in B (at ${L8_n(tB)}).${s.feat==='diff'&&bA===1&&bB<1?' The difference decodes A perfectly, but in B a hidden signal shifts the cut-off, so voltage alone falls short.':''}`;
  return {svg:out,phase:ph};
 }});

/* ===================== Lesson: independent-tests ===================== */
SCENE({id:'independent-tests',name:'Who else has found it?',tag:'Criticism and debate · what others have tested',
 definition:'A result is stronger when labs with no stake in it find it again. In bioelectricity, steady currents at wounds and in regeneration, and the role of ion-channel genes in development, have been reported by many independent groups. Several of the Levin lab’s most striking results, from two-headed worms to xenobots, have so far been reported mainly by the lab and its collaborators. That is a statement about how far replication has got, not a claim that any of them has failed: this course does not know of a published failed replication of them, and claims none.',
 example:'Head or tail identity in planarians set by Wnt/β-catenin signalling was reported in the same issue of Science by two separate labs, Peter Reddien’s and Alejandro Sánchez Alvarado’s, in 2008. Persistent two-headed worms after a brief gap-junction block come from the Levin lab’s papers (2010, 2017).',
 desc:'Eight findings from the course, each placed by the learner under “several independent labs” or “mainly the lab and collaborators”, and a panel giving the course’s reading with the papers behind it.',
 research:['Petersen & Reddien (2008), Science 319, 327–330; Gurley, Rink & Sánchez Alvarado (2008), Science 319, 323–327.','McCaig, Rajnicek, Song & Zhao (2005). Controlling cell behavior electrically: current views and future potential. Physiological Reviews 85, 943–978.','Mind In Motion, the replication crisis: why repetition by others matters.'],
 dur:14,hint:'Tap each finding to place it, then show the course’s reading. It is based on what the course could confirm in the literature; new replications may change it.',
 ...L8_sorter({title:'Repeated by others, or mainly one lab so far?',y0:70,top:()=>L8_badge(16,42,'debate')+TF(16+L8_badgeW('debate')+8,56,'“mainly one lab” ≠ “failed to replicate”',13,C.muted,'start'),
  bins:[['many','Several labs',C.green],['lab','Mainly the lab',C.blue]],
  items:[
   {t:'Steady currents leave wounds and limb stumps',bin:'many',why:'Measured with the vibrating probe by Jaffe, Nuccitelli, Borgens and others from the 1970s, and by the McCaig and Zhao labs since (era 1).'},
   {t:'Electric fields steer cells into a wound',bin:'many',why:'Shown by several groups in cells and wound models; reviewed by McCaig, Rajnicek, Song & Zhao (2005); Zhao et al. (2006) in Nature.'},
   {t:'Wnt/β-catenin sets planarian head or tail',bin:'many',why:'Two independent labs in 2008 (Petersen & Reddien; Gurley, Rink & Sánchez Alvarado), since built on by many others.'},
   {t:'K⁺-channel genes shape faces, wings and fins',bin:'many',why:'Independent of the Levin lab: human KCNJ2 (2001), the fruit-fly wing (2012) and zebrafish fins (2014, 2021). See the next scene.'},
   {t:'Two-headed worms that stay two-headed',bin:'lab',why:'Oviedo et al. (2010) and Durant et al. (2017), both from the Levin lab (era 3).'},
   {t:'Eyes induced by setting a cell’s voltage',bin:'lab',why:'Pai et al. (2012) from the Levin lab; the course could not confirm an independent repeat (era 4).'},
   {t:'Hyperpolarising cells cuts tumour-like growths',bin:'lab',why:'Chernet & Levin (2013, 2014) in frog tadpoles; frog tumour-like structures, not human cancer (era 5).'},
   {t:'Xenobots that pile cells into new xenobots',bin:'lab',why:'Kriegman, Blackiston, Levin & Bongard (2021), the Levin and Bongard labs together (era 6).'}]})});

// Independent genetic and physiological evidence, as a table the learner filters.
const L8_EVID=[
 {sp:'Human',who:'Plaster et al. 2001',lab:'ptacek',kind:'gene',what:'Mutations in KCNJ2, the gene for the K⁺ channel Kir2.1, in Andersen–Tawil syndrome',found:'Periodic paralysis and heart-rhythm changes, with small differences in face and fingers.'},
 {sp:'Fruit fly',who:'Dahal et al. 2012',lab:'bates',kind:'gene',what:'Blocked an inwardly rectifying K⁺ channel in the developing wing',found:'Wing patterning defects, linked to the BMP (Dpp) signalling pathway.'},
 {sp:'Zebrafish',who:'Perathoner et al. 2014',lab:'harris',kind:'gene',what:'Mapped the long-finned mutant another longfin to the K⁺ channel gene kcnk5b',found:'Changes in this channel scaled fin size: fins grew longer.'},
 {sp:'Zebrafish',who:'Stewart et al. 2021',lab:'stankunas',kind:'gene',what:'Mapped the classic longfin mutant',found:'Extra expression of another K⁺ channel gene, kcnh2a, in the fin prolonged its outgrowth.'},
 {sp:'Newt',who:'Borgens et al. 1977',lab:'jaffe',kind:'current',what:'Measured currents at regenerating limb stumps with the vibrating probe',found:'Steady currents leaving the stump during regeneration.'},
 {sp:'Cells, wounds',who:'Zhao et al. 2006',lab:'zhao',kind:'current',what:'Applied electric fields to cells and wound models',found:'Fields directed cell migration in wound healing; PI3Kγ and PTEN were involved.'},
 {sp:'Frog tadpole',who:'Beck et al. 2003',lab:'slack',kind:'regen',what:'Amputated tails at different stages',found:'A refractory stage when tails do not regrow, rescued by activating BMP or Notch signalling.'},
 {sp:'Planarian',who:'Petersen & Reddien 2008',lab:'reddien',kind:'regen',what:'Silenced β-catenin by RNA interference',found:'Heads regrew where tails should have; Gurley, Rink & Sánchez Alvarado reported the same in 2008.'}];
const L8_KINDS={all:'All',gene:'Channel genes',current:'Measured currents',regen:'Regeneration'};
SCENE({id:'independent-tests-channels',name:'Channels in other labs’ hands',tag:'Replicated finding · independent evidence for ion channels in development',
 definition:'Some of the strongest support for bioelectric signals in development comes from labs that were not looking for it. Human geneticists traced Andersen–Tawil syndrome to the K⁺ channel gene KCNJ2; Emily Bates’s lab found a K⁺ channel needed for patterning the fly wing; zebrafish geneticists traced two long-fin mutants to K⁺ channel genes. Physiologists measured currents at wounds and regenerating limbs. These findings show that channels and voltage matter in development; they do not by themselves test the bioelectric code.',
 example:'The zebrafish mutant another longfin carries changes in the K⁺ channel gene kcnk5b, and its fins grow longer (Perathoner et al. 2014). The classic longfin mutant was later traced to extra expression of a different K⁺ channel gene, kcnh2a (Stewart et al. 2021). Neither lab was part of the Levin lab.',
 desc:'A table of eight findings by independent labs, with the animal, what was done and what was found, filtered by kind of evidence, and a count of the separate research groups shown.',
 research:['Plaster et al. (2001). Mutations in Kir2.1 cause the developmental and episodic electrical phenotypes of Andersen’s syndrome. Cell 105, 511–519.','Dahal et al. (2012). An inwardly rectifying K⁺ channel is required for patterning. Development 139.','Perathoner et al. (2014). Bioelectric signaling regulates size in zebrafish fins. PLoS Genetics 10, e1004080.','Stewart et al. (2021). longfin causes cis-ectopic expression of the kcnh2a ether-a-go-go K⁺ channel to autonomously prolong fin outgrowth. Development 148.','Beck, Christen & Slack (2003), Developmental Cell 5, 429–439; Borgens, Vanable & Jaffe (1977), PNAS.'],
 dur:12,hint:'Filter the table by kind of evidence and tap a row to read what was done and found. Not medical advice: the human row describes a genetic syndrome, not a treatment.',
 init:()=>({kind:'all',sel:0}),
 watch(p){const ks=['all','gene','current','regen'],k=Math.min(3,Math.floor(p*4)),rows=L8_EVID.filter(r=>ks[k]==='all'||r.kind===ks[k]),sel=L8_EVID.indexOf(rows[Math.min(rows.length-1,Math.floor((p*4-k)*rows.length))]);return {kind:ks[k],sel}},
 ui:[{choose:Object.entries(L8_KINDS),label:'Kind of evidence',get:s=>s.kind,act:'kind'}],
 on:{kind(s,v){s.kind=L8_KINDS[v]?v:'all';const rows=L8_EVID.filter(r=>s.kind==='all'||r.kind===s.kind);if(!rows.includes(L8_EVID[s.sel]))s.sel=L8_EVID.indexOf(rows[0])},row(s,a){s.sel=clamp(+a|0,0,L8_EVID.length-1)}},
 draw(s,f,X){
  const rows=L8_EVID.map((r,i)=>[r,i]).filter(([r])=>s.kind==='all'||r.kind===s.kind),groups=new Set(rows.map(([r])=>r.lab)).size;
  let out=heading('Evidence from labs outside the Levin lab')+L8_badge(20,42,'rep')+TF(20+L8_badgeW('rep')+8,56,'each row: an independent group',13,C.muted,'start');
  out+=TBF(30,82,'animal',13,C.muted,'start')+TBF(124,82,'study',13,C.muted,'start');
  rows.forEach(([r,i],j)=>{const y=90+j*28,sel=i===s.sel;
   const inner=R(20,y,284,24,sel?C.greenp:'#fff',sel?C.green:C.grid,6)+TF(30,y+17,r.sp,13,C.ink,'start')+TF(124,y+17,r.who,13,C.ink,'start');
   out+=hit(X,'row',i,`${r.sp}, ${r.who}. Press to read.`,inner)});
  const r=L8_EVID[s.sel],did=L8_wrap('Did: '+r.what+'.',38),fd=L8_wrap('Found: '+r.found,38);
  out+=R(314,70,266,234,'#fff',C.grid,8)+TBF(326,90,r.sp,13,C.green,'start')+TF(326,108,r.who+' · '+L8_KINDS[r.kind],13,C.muted,'start');
  did.forEach((l,k)=>{out+=TF(326,132+k*16,l,13,C.ink,'start')});
  fd.forEach((l,k)=>{out+=TF(326,140+(did.length+k)*16,l,13,C.ink,'start')});
  out+=L8_tile(314,312,266,'separate groups shown',String(groups),C.green)+TF(20,330,'Shown: '+rows.length+' of '+L8_EVID.length+' findings',13,C.muted,'start');
  out+=L8_note('Not medical advice. Channels matter in development; that alone does not test a code.',372);
  return {svg:out,phase:`${r.who} (${r.sp}): ${r.what}. ${r.found}`};
 }});

// Why repetition matters: seeded toy experiments with a chosen true effect and sample size.
function L8_erf(x){const t=1/(1+.3275911*Math.abs(x)),y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-x*x);return x>=0?y:-y}
const L8_Phi=x=>.5*(1+L8_erf(x/Math.SQRT2));
const L8_Z95=1.959964;   // two-sided 5% point of the normal distribution
const L8_power=(d,n)=>{const se=Math.sqrt(2/n);return L8_Phi(d/se-L8_Z95)+L8_Phi(-d/se-L8_Z95)};
function L8_gauss(r){const u=Math.max(1e-12,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const L8_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
function L8_labs(d,n,seed){const out=[];for(let l=0;l<20;l++){const r=rng(L8_mix(seed*7919+l*104729+n*31+Math.round(d*100)));let a=0,b=0;for(let i=0;i<n;i++){a+=L8_gauss(r);b+=d+L8_gauss(r)}
 const est=(b-a)/n,se=Math.sqrt(2/n);out.push({est,se,sig:Math.abs(est/se)>L8_Z95})}return out}
SCENE({id:'independent-tests-replication',name:'Why one study is not enough',tag:'Simplified model · small studies and repeated tests',
 definition:'Any single experiment can mislead by chance. When the true effect is modest and samples are small, many honest studies miss it, and the ones that do reach significance tend to overstate it. Independent repetition, larger samples and blinded scoring guard against this. This is a general point about research, discussed at length in psychology and neuroscience; it is not a claim about any particular result in this course.',
 example:`Twenty toy labs each compare a treated and an untreated group. With a true effect of 0.3 standard deviations and 10 animals per group, the computed power is ${L8_pct(L8_power(.3,10))}: most labs miss it, and those that succeed report a much larger effect. With 80 per group the power is ${L8_pct(L8_power(.3,80))}; for an effect of 0.8, 30 per group gives ${L8_pct(L8_power(.8,30))}.`,
 desc:'Twenty toy experiments drawn as estimates with 95% intervals around a line marking the true effect, filled when significant, with tiles for the share significant, the computed power, and the average estimate among the significant ones.',
 research:['Button, Ioannidis, Mokrysz, Nosek, Flint, Robinson & Munafò (2013). Power failure: why small sample size undermines the reliability of neuroscience. Nature Reviews Neuroscience 14, 365–376.','Open Science Collaboration (2015). Estimating the reproducibility of psychological science. Science 349, aac4716.','Toy: normal data with standard deviation 1; a two-sided z-test at 5%.'],
 dur:12,hint:'Choose the true effect and the number per group, then draw new sets of labs. Watch the share that finds the effect and how big the significant ones say it is.',
 init:()=>({d:30,n:10,seed:1}),
 watch(p){const k=Math.min(2,Math.floor(p*3));return {d:30,n:[10,30,80][k],seed:1}},
 ui:[{choose:[['0','No effect'],['30','Effect 0.3'],['80','Effect 0.8']],label:'True effect',get:s=>String(s.d),act:'d'},{range:'n',label:'Animals per group',min:5,max:80,get:s=>s.n,act:'n'},{b:'New set of labs',act:'seed'}],
 on:{d(s,v){s.d=[0,30,80].includes(+v)?+v:30},n(s,v){s.n=clamp(Math.round(+v),5,80)},seed(s){s.seed=s.seed%50+1}},
 draw(s){
  const d=s.d/100,labs=L8_labs(d,s.n,s.seed),se=Math.sqrt(2/s.n),sig=labs.filter(q=>q.sig),pow=L8_Phi(d/se-L8_Z95)+L8_Phi(-d/se-L8_Z95),
   meanSig=sig.length?sum(sig.map(q=>q.est))/sig.length:null;
  const pl=L8_plot(60,76,330,262,[-1.6,2.2],[0,21],{xt:[[-1,'−1'],[0,'0'],[1,'1'],[2,'2']],xl:'estimated effect (standard deviations)'});
  let out=heading(`20 toy labs, ${s.n} per group, true effect ${fmt(d)}`)+L8_badges(60,44,['model','debate'])+pl.svg;
  out+=L(pl.X(0),76,pl.X(0),338,C.line,1.4)+L(pl.X(d),76,pl.X(d),338,C.green,2,'stroke-dasharray="6 4"');
  labs.forEach((q,i)=>{const y=pl.Y(20-i),lo=pl.X(clamp(q.est-L8_Z95*q.se,-1.6,2.2)),hi=pl.X(clamp(q.est+L8_Z95*q.se,-1.6,2.2));out+=L(lo,y,hi,y,q.sig?C.ink:C.line,2)+Ci(pl.X(clamp(q.est,-1.6,2.2)),y,4.5,q.sig?C.ink:'#fff',C.ink)});
  out+=L8_tile(410,76,170,'labs significant',`${sig.length} of 20`,C.ink)+L8_tile(410,130,170,'expected share (power)',L8_pct(pow),C.muted)+L8_tile(410,184,170,'mean of significant',meanSig===null?'none':fmt(Math.round(meanSig*100)/100),C.coral);
  out+=Ci(418,252,4.5,C.ink,C.ink)+TF(430,257,'significant (p < 0.05)',13,C.ink,'start')+Ci(418,274,4.5,'#fff',C.ink)+TF(430,279,'not significant',13,C.ink,'start');
  out+=L(412,296,426,296,C.green,2,'stroke-dasharray="5 3"')+TF(430,301,'true effect',13,C.green,'start');
  out+=L8_lines(410,326,'Lines: 95% intervals. Toy data, not any real study.',26,13,C.muted);
  const ph=d===0?`There is no true effect, yet ${sig.length} of 20 labs reach significance by chance (about 1 in 20 is expected). A single positive study proves little.`:
   `${sig.length} of 20 labs reach significance; the computed power is ${L8_pct(pow)}. ${meanSig===null?'None is significant here.':`The significant ones report on average ${fmt(Math.round(meanSig*100)/100)}, against a true ${fmt(d)}.`} ${s.n<25?'Small studies that succeed tend to exaggerate.':'With larger samples the estimates gather near the truth.'}`;
  return {svg:out,phase:ph};
 }});

/* ===================== Lesson: open-questions ===================== */
SCENE({id:'open-questions',name:'Open questions',tag:'Framework or hypothesis · what is not yet known',
 definition:'Much about bioelectric patterning is unknown. How does a change in voltage reach the genes? How is a pattern stored after a brief treatment? How far do findings in frogs and planarians carry to mammals? What, physically, is a “target morphology”? Each question points to a kind of experiment that could answer it. The lab treats these as research questions; so does this course.',
 example:'“How does a brief treatment leave a lasting pattern?” calls for following the same animals over time, recording voltage, gene expression and shape through later cuts. “Do the results carry to mammals?” can only be answered in mammals.',
 desc:'Six open questions, each placed by the learner under one of four kinds of experiment, and the course’s reading of which kind would answer it, with the reason.',
 research:['Levin (2021). Bioelectric signaling: reprogrammable circuits underlying embryogenesis, regeneration, and cancer. Cell 184, 1971–1989 (a review by the lab that sets out open problems).'],
 dur:13,hint:'Tap each question to move it between the four kinds of experiment, then show the course’s reading. More than one kind could help; the reading names the most direct.',
 ...L8_sorter({title:'Which experiment could answer it?',y0:70,top:()=>L8_badge(16,42,'frame')+TF(16+L8_badgeW('frame')+8,56,'questions, not findings',13,C.muted,'start'),
  bins:[['mol','Find the molecules',C.purple],['time','Track over time',C.blue],['other','Other animals',C.green],['model','Model, then predict',C.amber]],
  items:[
   {t:'How does a voltage change reach the genes?',bin:'mol',why:'Block each candidate link (calcium, serotonin, voltage-sensing enzymes) and see whether the voltage effect on genes disappears.'},
   {t:'How does a brief treatment leave a lasting pattern?',bin:'time',why:'Follow voltage, gene expression and anatomy in the same animals across later cuts and weeks to see where the change is held.'},
   {t:'Why do only some treated worms change?',bin:'time',why:'Track individuals before the outcome is visible and look for early differences that predict which worms change.'},
   {t:'Do frog and worm results carry to mammals?',bin:'other',why:'Only experiments in mammals (mice, organoids) can say; channel genes in human and mouse development suggest some links.'},
   {t:'One pattern-to-shape mapping, or many?',bin:'other',why:'Test the same voltage pattern in different tissues, stages and species and see whether it gives the same outcome.'},
   {t:'What, physically, is a target morphology?',bin:'model',why:'A framework idea. A model that makes risky predictions about what a tissue will build after a new perturbation would make it testable.'}]})});

// Candidate links from voltage to the cell's interior, as toy curves.
const L8_ECA=L8_nernst(2,.0001,2);   // textbook: about 2 mM Ca²⁺ outside, about 100 nM inside
const L8_TRANS=[
 {key:'ca',name:'Ca²⁺ entry',lab:'rep',who:'voltage-gated Ca²⁺ channels',f:v=>{const o=1/(1+Math.exp(-(v+25)/7));return o*(L8_ECA-v)},why:'Voltage-gated Ca²⁺ channels let calcium in when the cell depolarises, and calcium controls many genes; this is textbook physiology.'},
 {key:'vsp',name:'Voltage-sensing phosphatase',lab:'rep',who:'Murata et al. 2005',f:v=>1/(1+Math.exp(-(v-0)/12)),why:'An enzyme with its own voltage sensor, found in the sea squirt Ciona: depolarisation switches on its lipid phosphatase activity.'},
 {key:'kras',name:'K-Ras nanoclusters',lab:'single',who:'Zhou et al. 2015',f:v=>1/(1+Math.exp(-(v+40)/15)),why:'Zhou and colleagues reported that depolarisation changes the arrangement of membrane lipids and increases K-Ras clustering and signalling.'}];
function L8_transNorm(t){let m=0;for(let v=-90;v<=20;v+=1)m=Math.max(m,Math.abs(t.f(v)));return m||1}
SCENE({id:'open-questions-transduction',name:'From voltage to genes',tag:'Framework or hypothesis · how cells might read voltage',
 definition:'A voltage pattern can only matter for anatomy if cells turn it into chemistry. Several links are known in other contexts: voltage-gated Ca²⁺ channels, a phosphatase with its own voltage sensor, the clustering of the signalling protein K-Ras, and (proposed by the lab) small molecules such as serotonin moving through gap junctions. Which of these carry patterning signals in a given tissue is an open question.',
 example:'Move the cell from −70 to −20 mV. In these toy curves calcium entry rises steeply, the phosphatase starts to switch on, and K-Ras clustering climbs. Each transducer has its own sensitive range, so the same voltage change could be read differently by different cells.',
 desc:'Three small plots, one for each candidate transducer, each with a toy curve of its activity against membrane voltage, a marker at the chosen voltage, the computed relative activity, and a badge for the strength of the evidence for the mechanism itself.',
 research:['Murata, Iwasaki, Sasaki, Inaba & Okamura (2005). Phosphoinositide phosphatase activity coupled to an intrinsic voltage sensor. Nature 435, 1239–1243.','Zhou et al. (2015). Membrane potential modulates plasma membrane phospholipid dynamics and K-Ras signaling. Science 349, 873–876.','Toy curves: shapes chosen for this course; the calcium curve uses the Nernst voltage for textbook Ca²⁺ concentrations.'],
 dur:10,hint:'Move the membrane voltage and read each transducer’s relative activity. Which one changes most between −70 and −50 mV?',
 init:()=>({v:-50}),
 watch(p){return {v:Math.round(-85+100*(.5-.5*Math.cos(p*2*Math.PI)))}},
 ui:[{range:'v',label:'Membrane voltage (mV)',min:-90,max:20,get:s=>s.v,act:'v'}],
 on:{v(s,v){s.v=clamp(Math.round(+v),-90,20)}},
 draw(s){
  let out=heading(`At ${L8_mv(s.v)}: how strongly is each link driven?`)+L8_badge(20,40,'model')+TF(20+L8_badgeW('model')+8,54,'toy curves; badges rate the mechanism',13,C.muted,'start');
  const acts=L8_TRANS.map(t=>t.f(s.v)/L8_transNorm(t));
  L8_TRANS.forEach((t,i)=>{const x0=24+i*192,w=172,nm=L8_transNorm(t),pl=L8_plot(x0+8,110,w-16,126,[-90,20],[0,1],{xt:[[-60,'−60'],[0,'0']]});
   out+=TBF(x0+w/2,80,t.name,13,C.ink)+L8_badge(x0+w/2,86,t.lab,'middle')+pl.svg;
   out+=L8_poly(range(111).map(k=>{const v=-90+k;return [pl.X(v),pl.Y(clamp(t.f(v)/nm,0,1))]}),C.purple,2.2);
   out+=L(pl.X(s.v),110,pl.X(s.v),236,C.coral,1.6)+Ci(pl.X(s.v),pl.Y(clamp(acts[i],0,1)),6,C.coral,'#fff');
   out+=L8_tile(x0+16,284,w-32,'relative activity',L8_pct(clamp(acts[i],0,1)),C.purple)+TF(x0+w/2,344,t.who,13,C.muted);
  });
  out+=TF(300,274,'membrane voltage (mV) · activity scaled to its maximum on −90 to +20 mV',13,C.muted);
  out+=L8_note('Whether any of these carries patterning signals in a tissue is open.',370);
  const top=acts.map((a,i)=>[a,L8_TRANS[i].name]).sort((a,b)=>b[0]-a[0])[0];
  return {svg:out,phase:`At ${L8_mv(s.v)} the toy curves give ${L8_TRANS.map((t,i)=>t.name+' '+L8_pct(clamp(acts[i],0,1))).join(', ')}. The most active here is ${top[1]}. ${L8_TRANS.map(t=>t.why).join(' ')}`};
 }});

// Storing a pattern: a brief pulse into a bistable row. Does the change outlast the pulse?
const L8_PN=16,L8_P0=5,L8_P1=10;
function L8_pulseFrames(s){const o={vg:true,gNa:.3},gj=s.gj/100,cut=L8_split(o),rest=L8_roots(o).filter(q=>q.stable)[0].v,D=s.dur*20,V0=range(L8_PN).map(()=>rest),amp=s.amp;
 const inj=(k,t)=>t<D&&k>=L8_P0&&k<=L8_P1?amp:0,snaps=[0,Math.max(1,Math.round(D/2)),D,D+200,D+800,D+2000,D+5000];
 const V=L8_sim(L8_PN,1,V0,o,gj,snaps,.05,inj);
 return V.map((v,i)=>{const dep=v.filter(x=>x>cut).length,t=snaps[i]*.05,on=snaps[i]<D,last=i===V.length-1;
  return {V:v,dep,cut,t,on,o,gj,D,say:i===0?`All ${L8_PN} cells rest at ${L8_mv(rest)}. A depolarising pulse of strength ${amp} will be applied to cells ${L8_P0+1}–${L8_P1+1} for ${L8_n(D*.05)} time units.`:
   on||snaps[i]===D?`Model time ${L8_n(t)}: the pulse is on; ${dep} cells are past the tipping point.`:
   !last?`Model time ${L8_n(t)}: the pulse is off; ${dep} cells are still depolarised.`:
   dep>0?`Long after the pulse: ${dep} cells stay depolarised. A brief input has left a lasting pattern, held by the cells’ bistability and their coupling. This is one candidate for how a stored pattern could work.`:
   `Long after the pulse: every cell has fallen back to ${L8_mv(rest)}. The pulse was too short or too weak to push the cells past their tipping point.`}})}
SCENE({id:'open-questions-storage',name:'Can a pulse leave a memory?',tag:'Simplified model · one candidate for a stored pattern',
 definition:'Some planarians briefly treated with a gap-junction blocker keep regrowing two heads in later cuts, with no further drug (era 3). How a pattern can outlast the treatment is open. One candidate, explored in models by the lab and others, is bistability: if cells can rest at two voltages and are coupled, a brief push can tip a region into the other state, where it stays. Gene-expression feedback and other mechanisms are alternatives, and the candidates are not exclusive.',
 example:'With coupling 0.05, a medium pulse for 10 time units leaves cells 6 to 11 depolarised long after it ends. Halve the pulse and they fall back to rest; a strong pulse needs only a short burst.',
 desc:'A row of 16 model cells with computed voltages written in them, a bracket over the six pulsed cells that lights up while the pulse is on, a voltage profile along the row, and tiles for the pulse, the coupling and the number of cells still depolarised.',
 research:['Law & Levin (2015). Bioelectric memory: modeling resting potential bistability in amphibian embryos and mammalian cells. Theoretical Biology and Medical Modelling 12, 22.','Durant, Morokuma, Fields, Williams, Adams & Levin (2017). Biophysical Journal 112, 2231–2243 (the planarian persistence this toy is offered to illustrate; single-lab).','Toy row: the bistable cell of bioelectric-models; illustrative values.'],
 dur:11,hint:'Set the pulse length and strength and the coupling, then run. Find the shortest pulse that leaves a lasting pattern.',
 init:()=>({dur:10,amp:10,gj:5}),
 trace:L8_pulseFrames,
 ui:[{range:'dur',label:'Pulse length',min:1,max:20,get:s=>s.dur,act:'dur'},{choose:[['5','Weak'],['10','Medium'],['20','Strong']],label:'Pulse strength',get:s=>String(s.amp),act:'amp'},{range:'gj',label:'Coupling',min:0,max:40,get:s=>s.gj,act:'gj',show:v=>fmt(v/100)}],
 on:{dur(s,v){s.dur=clamp(Math.round(+v),1,20)},amp(s,v){s.amp=[5,10,20].includes(+v)?+v:10},gj(s,v){s.gj=clamp(Math.round(+v),0,40)}},
 draw(s,f,X){
  const cw=34,x0=300-L8_PN*cw/2;
  let out=heading(f.on?'The pulse is on':f.t===0?'Before the pulse':'After the pulse: does the change hold?')+L8_badges(x0,42,['model','frame']);
  out+=R(x0+L8_P0*cw-2,76,(L8_P1-L8_P0+1)*cw+1,8,f.on?C.amber:C.grid,'none',3)+TF(x0+(L8_P0+L8_P1+1)*cw/2,72,f.on?'pulse on':'pulsed cells',13,f.on?C.amber:C.muted);
  f.V.forEach((v,i)=>{const x=x0+i*cw;out+=R(x+1,90,cw-3,48,L8_vcol(v,-80,10),'#fff',6)+TMF(x+cw/2,112,L8_n(v),13,C.ink)+(v>f.cut?TBF(x+cw/2,132,'+',14,C.ink):'')});
  const pl=L8_plot(x0+10,162,L8_PN*cw-20,108,[0,L8_PN-1],[-85,25],{yt:[[-80,'−80'],[-40,'−40'],[0,'0']]});
  out+=pl.svg+L(pl.X(0),pl.Y(f.cut),pl.X(L8_PN-1),pl.Y(f.cut),C.amber,1.4,'stroke-dasharray="5 4"')+TF(pl.X(L8_PN-1)-4,pl.Y(f.cut)-6,'tipping point',13,C.amber,'end');
  out+=L8_poly(f.V.map((v,i)=>[pl.X(i),pl.Y(clamp(v,-85,25))]),C.blue,2.4);
  out+=L8_tile(x0,290,130,'pulse',`${s.amp} for ${L8_n(f.D*.05)}`,C.amber)+L8_tile(x0+140,290,120,'coupling',fmt(f.gj))+L8_tile(x0+270,290,130,'model time',L8_n(f.t))+L8_tile(x0+410,290,134,'depolarised',`${f.dep} of ${L8_PN}`,C.coral);
  out+=L8_note('A cartoon of one hypothesis, not a known mechanism in planarians.',362);
  return {svg:out,phase:f.say};
 }});

/* ===================== Lesson: platonic-space ===================== */
// The same limit from different starting numbers: a regularity no starting value sets.
const L8_RULES={fib:{m:1,label:'next = previous + the one before'},pell:{m:2,label:'next = 2 × previous + the one before'}};
function L8_seq(a,b,rule){const m=L8_RULES[rule].m,x=[a,b];for(let i=2;i<14;i++)x.push(m*x[i-1]+x[i-2]);return x}
const L8_lim=rule=>{const m=L8_RULES[rule].m;return (m+Math.sqrt(m*m+4))/2};   // positive root of r² = m r + 1
const L8_PLAT={
 worm:{name:'A planarian regrows',lab:'rep',fact:'A small piece of a planarian regrows a whole worm of normal shape (era 3).',
  std:'stem cells, signalling gradients and gene networks rebuild the body; evolution shaped that machinery.',
  prop:'the body plan is a pattern the tissue is drawn toward, and that pattern is not fully written in the genome.'},
 xeno:{name:'Frog cells make xenobots',lab:'single',fact:'Frog skin cells freed from the embryo form swimming spheroids no frog ever had (era 6).',
  std:'the cells use abilities selected in frogs (cilia, adhesion, healing) in a new setting.',
  prop:'new forms with no history of selection suggest that some patterns come from somewhere other than history.'},
 math:{name:'A ratio no gene sets',lab:'none',fact:'In any sequence where each term is the sum of the two before, the ratio of terms tends to '+L8_lim('fib').toFixed(3)+'… (a theorem).',
  std:'mathematics describes regularities that any system of that structure will show.',
  prop:'such regularities exist independently, and living and artificial systems draw on them.'}};
const L8_PLAT_ORDER=['worm','xeno','math'];
SCENE({id:'platonic-space',name:'A space of forms?',tag:'Speculation · Levin’s “Platonic space” proposal, 2020s',
 definition:'In recent talks and essays Michael Levin has speculated that the forms and behaviours living systems reach, and some that artificial systems reach, are not fully explained by genes, environment and history, but draw on a pre-existing space of patterns, as mathematical Platonists hold that numbers and theorems exist independently of minds. This is a philosophical proposal, not a tested result. The course neither endorses nor dismisses it, and paraphrases rather than quotes.',
 example:'Mathematical Platonism is one position in the philosophy of mathematics: mathematical objects exist independently of us and are discovered, not invented. Its rivals include nominalism, which denies that abstract objects exist, and formalism. The proposal borrows this picture for biological form.',
 desc:'A chain of the usual explanations of form (genes, environment, physics and chemistry, history of selection) with a dashed extra box for the proposed space of patterns, and for a chosen example the observed fact, the usual account and what the proposal adds, each with its label.',
 research:['No peer-reviewed paper is cited here: the idea has been set out mainly in Levin’s talks, essays and preprints of the 2020s, and this course could not check a specific text.','Linnebo. Platonism in the Philosophy of Mathematics. Stanford Encyclopedia of Philosophy.'],
 dur:12,hint:'Choose an example and read the observed fact, the usual account, and what the proposal would add.',
 init:()=>({ex:'worm'}),
 watch(p){return {ex:L8_PLAT_ORDER[Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:L8_PLAT_ORDER.map(k=>[k,L8_PLAT[k].name]),label:'Example',get:s=>s.ex,act:'ex'}],
 on:{ex(s,v){s.ex=L8_PLAT[v]?v:'worm'}},
 draw(s){
  const e=L8_PLAT[s.ex];
  let out=heading('Where does a form come from?');
  const bx=[['genes',22],['environment',140],['physics, chemistry',258],['selection history',394]];
  bx.forEach(([lab,x],i)=>{const w=i>1?128:110;out+=box(x,52,w,34,lab,C.pale,C.ink,13)});
  out+=R(150,108,300,34,C.amberp,C.amber,8,'stroke-dasharray="6 4"')+TF(300,130,'a space of patterns (proposed)',13,C.amber);
  out+=L8_badge(458,115,'spec');
  out+=arrow(300,88,300,104,C.line,2)+TF(300,166,'↓ form and behaviour',13,C.muted);
  const card=(y,title,txt,col,lab)=>{let o=R(22,y,556,58,'#fff',C.grid,8)+TBF(34,y+18,title,13,col,'start')+L8_lines(34,y+36,txt,84,13,C.ink,'start',16);if(lab)o+=L8_badge(566,y+5,lab,'end');return o};
  out+=card(178,'Observed',e.fact,C.green,e.lab==='none'?null:e.lab);
  out+=card(242,'Usual account',e.std[0].toUpperCase()+e.std.slice(1),C.blue,null);
  out+=card(306,'What the proposal adds',e.prop[0].toUpperCase()+e.prop.slice(1),C.amber,'spec');
  if(e.lab==='none')out+=TF(566,196,'mathematics',13,C.muted,'end');
  return {svg:out,phase:`${e.fact} Usual account: ${e.std} The proposal adds: ${e.prop} The last part is speculation.`};
 }});

SCENE({id:'platonic-space-math',name:'One limit, many starts',tag:'Speculation · the kind of example the proposal leans on',
 definition:'Pick any two positive starting numbers and make each new term the sum of the previous two. The ratio of successive terms always approaches the same number, (1 + √5)/2, the golden ratio. Change the rule and a different limit appears, again whatever the start. Nobody chose these limits; they follow from the rule. That much is mathematics. The speculation is the further step: that living bodies make use of such regularities, which exist in a space of patterns of their own.',
 example:`Start with 3 and 17, or with 1 and 1: after a dozen terms the ratios are ${(L8_seq(3,17,'fib')[13]/L8_seq(3,17,'fib')[12]).toFixed(4)} and ${(L8_seq(1,1,'fib')[13]/L8_seq(1,1,'fib')[12]).toFixed(4)}, against a limit of ${L8_lim('fib').toFixed(4)}. With the rule “twice the previous plus the one before” every start tends to 1 + √2, about ${L8_lim('pell').toFixed(3)}.`,
 desc:'The first 14 terms of a sequence from the chosen starting numbers and rule, a plot of the ratio of successive terms converging to a dashed line at the computed limit, and tiles for the last ratio and the limit.',
 research:['A standard result on linear recurrences: the ratio of successive terms tends to the largest root of r² = m·r + 1.','Linnebo. Platonism in the Philosophy of Mathematics. Stanford Encyclopedia of Philosophy (the philosophical background to the proposal).'],
 dur:10,hint:'Choose two starting numbers and a rule, and watch the ratio settle. Does the start change where it ends up?',
 init:()=>({a:3,b:17,rule:'fib'}),
 watch(p){const k=Math.min(3,Math.floor(p*4)),starts=[[3,17],[1,1],[20,2],[5,9]];return {a:starts[k][0],b:starts[k][1],rule:k<3?'fib':'pell'}},
 ui:[{range:'a',label:'First number',min:1,max:20,get:s=>s.a,act:'a'},{range:'b',label:'Second number',min:1,max:20,get:s=>s.b,act:'b'},{choose:[['fib','Sum of two'],['pell','Twice plus one']],label:'Rule',get:s=>s.rule,act:'rule'}],
 on:{a(s,v){s.a=clamp(Math.round(+v),1,20)},b(s,v){s.b=clamp(Math.round(+v),1,20)},rule(s,v){s.rule=L8_RULES[v]?v:'fib'}},
 draw(s){
  const x=L8_seq(s.a,s.b,s.rule),rat=x.slice(1).map((v,i)=>v/x[i]),lim=L8_lim(s.rule),yr=[0,Math.max(lim*1.5,Math.min(8,Math.max(...rat))+.3)];
  let out=heading('Rule: '+L8_RULES[s.rule].label);
  out+=TF(30,62,'terms: '+x.slice(0,9).join(', ')+', …',13,C.ink,'start');
  const pl=L8_plot(60,90,340,180,[1,13],yr,{xt:[[1,'1'],[4,'4'],[7,'7'],[10,'10'],[13,'13']],yt:[[0,'0'],[Math.round(lim*1000)/1000,fmt(Math.round(lim*1000)/1000)]],xl:'term number',yl:'ratio of each term to the one before'});
  out+=pl.svg+L(pl.X(1),pl.Y(lim),pl.X(13),pl.Y(lim),C.amber,1.6,'stroke-dasharray="6 4"');
  out+=L8_poly(rat.map((r,i)=>[pl.X(i+1),pl.Y(clamp(r,yr[0],yr[1]))]),C.blue,2.2);
  rat.forEach((r,i)=>{out+=Ci(pl.X(i+1),pl.Y(clamp(r,yr[0],yr[1])),4,C.blue)});
  out+=L8_tile(420,90,160,'last ratio',rat[rat.length-1].toFixed(4),C.blue)+L8_tile(420,144,160,'computed limit',lim.toFixed(4),C.amber)+L8_tile(420,198,160,'difference',Math.abs(rat[rat.length-1]-lim).toExponential(1),C.muted);
  out+=TF(420,268,'Mathematics: a theorem.',13,C.ink,'start');
  out+=R(30,320,540,40,C.amberp,C.amber,8)+L8_badge(40,330,'spec')+TF(40+L8_badgeW('spec')+10,344,'that bodies draw on such patterns from a space of forms',13,C.ink,'start');
  return {svg:out,phase:`Starting from ${s.a} and ${s.b}, the 13th ratio is ${rat[rat.length-1].toFixed(4)}; the limit computed from the rule is ${lim.toFixed(4)}. Any positive start gives the same limit. The mathematics is settled; reading it as evidence about biology is the speculation.`};
 }});

SCENE({id:'platonic-space-views',name:'Claims, tests and other readings',tag:'Speculation · sorting the argument',
 definition:'A speculative proposal can still be examined. Which statements are the proposal itself, which describe what might test it, and which are other ways to read the same examples? Other readings exist in philosophy and in biology: nominalism treats mathematics as description rather than a realm of its own, and work on self-organisation, such as Stuart Kauffman’s, explains recurring order through physics, chemistry and network dynamics together with selection.',
 example:'“Bodies act as interfaces to a space of forms” is the proposal. “Predict a new form for a new kind of body before building it, and see whether the prediction beats ordinary models” describes a possible test. “Order arises from self-organisation, with no separate space” is another reading.',
 desc:'Six statements about the proposal, each placed by the learner as the proposal, a possible test, or another reading, and a panel giving the course’s reading with the reason.',
 research:['Kauffman (1993). The Origins of Order: Self-Organization and Selection in Evolution. Oxford University Press.','Linnebo. Platonism in the Philosophy of Mathematics. Stanford Encyclopedia of Philosophy (nominalism and other rivals).','The course cites no published scientific response to the proposal; it could not check one.'],
 dur:13,hint:'Tap each statement to place it, then show the course’s reading. These are readings of an argument, not answers.',
 ...L8_sorter({title:'The proposal, a test, or another reading?',y0:70,top:()=>L8_badges(16,42,['spec','frame']),
  bins:[['says','The proposal',C.amber],['test','A possible test',C.blue],['alt','Another reading',C.purple]],
  items:[
   {t:'Some patterns are not set by genes or history',bin:'says',why:'This is the core claim: genes, environment and selection do not fully explain the forms reached.'},
   {t:'Bodies act as interfaces to a space of forms',bin:'says',why:'This is the proposal’s picture of what living (and some artificial) systems do.'},
   {t:'Predict a new body’s form before building it',bin:'test',why:'If the proposal helps predict forms of new bodies, such as xenobots, better than ordinary models, that would count in its favour.'},
   {t:'Compare with physics-and-selection models',bin:'test',why:'A test needs a rival: the proposal should predict something the usual models do not.'},
   {t:'Order comes from self-organisation alone',bin:'alt',why:'Work on self-organisation (Kauffman 1993) explains recurring order through dynamics plus selection, with no separate space.'},
   {t:'Mathematics describes; it is not a realm',bin:'alt',why:'Nominalists deny that abstract objects exist, so the regularities need no realm of their own.'}]})});
