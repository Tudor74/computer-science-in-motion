/* ===================== Levin Lab In Motion · Era 5 · Cancer and the brain ===================== */
// Voltage and division, instructor cells, tumour-like growths in tadpoles, cell coupling, brain pre-patterns,
// and the lab's hypothesis that cancer is a shrinking of the cellular "self".
// Every picture is a pure function of state, frame and X. Every voltage, count and fraction drawn by a model is
// computed here (Goldman and Nernst equations, coupled-cell networks, seeded toy populations). The only literals
// shown as results are published values, each with a research line. Nothing in this era is medical advice.

/* ---- shared helpers ---- */
const L5_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const L5_rng=n=>rng(L5_mix(n));
function L5_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const L5_RTF=8.314462*310.15/96485.33*1000;                       // RT/F at 37 °C, in mV
const L5_nernst=(out,inn,z=1)=>L5_RTF/z*Math.log(out/inn);
// Textbook mammalian concentrations (mM), used as illustrative values throughout the era.
const L5_ION={Ko:5,Ki:140,Nao:145,Nai:15,Clo:110,Cli:10};
function L5_ghk(pK,pNa,pCl,o={}){const c={...L5_ION,...o};return L5_RTF*Math.log((pK*c.Ko+pNa*c.Nao+pCl*c.Cli)/(pK*c.Ki+pNa*c.Nai+pCl*c.Clo))}
const L5_n=(v,d=0)=>{const r=Math.round(v*Math.pow(10,d))/Math.pow(10,d);return (r<0?'−':'')+Math.abs(r).toFixed(d)};
const L5_mv=(v,d=0)=>{const r=Math.round(v*Math.pow(10,d))/Math.pow(10,d);return (r<0?'−':r>0?'+':'')+Math.abs(r).toFixed(d)+' mV'};
const L5_pc=v=>Math.round(v*100)+'%';
const L5_note=(s,y=368)=>TF(300,y,s,13,C.muted);
const L5_NM='Not medical advice.';
const L5_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function L5_tile(x,y,w,label,value,col=C.blue){return R(x,y,w,46,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+38,value,15,col)}
function L5_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// The six evidence labels. The badge is drawn beside the claim it applies to.
const L5_LABELS={rep:['Replicated finding',C.green,C.greenp],single:['Single-lab finding',C.blue,C.pale],frame:['Framework or hypothesis',C.purple,C.purplep],
 spec:['Speculation',C.amber,C.amberp],debate:['Criticism and debate',C.coral,C.coralp],model:['Simplified model',C.dark,'#eef2f4']};
const L5_badgeW=k=>Math.round(L5_LABELS[k][0].length*7.1+18);
function L5_badge(x,y,k,anchor='start'){const [lab,ink,fill]=L5_LABELS[k],w=L5_badgeW(k),x0=anchor==='end'?x-w:anchor==='middle'?x-w/2:x;
 return R(x0,y,w,20,fill,ink,10,k==='model'?'stroke-dasharray="4 3" stroke-width="1.4"':'stroke-width="1.4"')+TBF(x0+w/2,y+14.5,lab,12.5,ink)}
function L5_badges(x,y,keys){let out='',cx=x;for(const k of keys){out+=L5_badge(cx,y,k);cx+=L5_badgeW(k)+8}return out}
// Voltage colour (blue more negative, coral less negative), always paired with numbers or a labelled bar.
function L5_vcol(v,lo=-90,hi=0){const u=clamp((v-lo)/(hi-lo),0,1);const a=[23,114,183],b=[196,82,56],w=[246,246,246];
 const m=u<.5?a.map((q,i)=>Math.round(lerp(q,w[i],u*2))):w.map((q,i)=>Math.round(lerp(q,b[i],(u-.5)*2)));return `rgb(${m.join(',')})`}
function L5_vbar(x,y,w,lo,hi,label='membrane voltage'){let out='';const n=24;for(let i=0;i<n;i++)out+=R(x+i*w/n,y,w/n+.5,10,L5_vcol(lo+(hi-lo)*(i+.5)/n,lo,hi),'none',0);
 return out+R(x,y,w,10,'none',C.line,2)+TF(x,y+24,L5_mv(lo),13,C.muted,'start')+TF(x+w,y+24,L5_mv(hi),13,C.muted,'end')+TF(x+w/2,y+24,label,13,C.muted)}
// Steady state of a W×H sheet: each cell k has membrane conductance gm[k] to its own resting voltage E[k];
// neighbours (4-connected) share conductance gj(a,b). Gauss–Seidel to convergence.
function L5_sheet(W,H,E,gm,gj,iters=400){const n=W*H,V=E.slice();
 for(let it=0;it<iters;it++){let dmax=0;
  for(let k=0;k<n;k++){const x=k%W,y=(k/W)|0;let num=gm[k]*E[k],den=gm[k];
   const nb=[];if(x>0)nb.push(k-1);if(x<W-1)nb.push(k+1);if(y>0)nb.push(k-W);if(y<H-1)nb.push(k+W);
   for(const j of nb){const g=gj(k,j);num+=g*V[j];den+=g}
   const v=num/den;dmax=Math.max(dmax,Math.abs(v-V[k]));V[k]=v}
  if(dmax<1e-6)break}
 return V}
// A row of n cells (open ends) solved the same way; gj may be a number or a function of the left index.
function L5_row(E,gm,gj){const n=E.length;return L5_sheet(n,1,E,gm,(a,b)=>typeof gj==='function'?gj(Math.min(a,b)):gj)}
// Pearson correlation of two arrays.
function L5_corr(a,b){const n=a.length,ma=sum(a)/n,mb=sum(b)/n;let sab=0,sa=0,sb=0;for(let i=0;i<n;i++){sab+=(a[i]-ma)*(b[i]-mb);sa+=(a[i]-ma)**2;sb+=(b[i]-mb)**2}return sa&&sb?sab/Math.sqrt(sa*sb):0}

/* ===================== Lesson: depolarised-cells ===================== */
// Model cell: relative permeabilities pK : pNa : pCl, with the outside potassium level as the learner's "medium".
const L5_CELL={pK:1,pNa:.04,pCl:.1};
const L5_vOf=(Ko=5,pNa=L5_CELL.pNa)=>L5_ghk(L5_CELL.pK,pNa,L5_CELL.pCl,{Ko});
// Toy division rule (an assumption of this course, not Cone's equation): chance of division per hour rises
// steeply above a threshold voltage.
const L5_DIV={rmax:.05,vh:-72,k:3};
const L5_divRate=V=>L5_DIV.rmax/(1+Math.exp(-(V-L5_DIV.vh)/L5_DIV.k));

SCENE({id:'depolarised-cells',name:'Cone’s idea: voltage as a brake on division',tag:'Simplified model · Replicated finding: dividing cells tend to be depolarised',
 definition:'In 1971 Clarence D. Cone Jr. proposed a theory in which the voltage across a cell’s membrane, and the sodium and potassium gradients behind it, help control whether the cell divides: strongly negative cells stay put, less negative ones divide. Many later measurements found the matching trend: dividing, embryonic, stem and many cancer cells tend to be depolarised, while mature cells that no longer divide tend to be strongly negative. The trend has been confirmed by many groups. Whether voltage drives division is a separate question, taken up in the third scene.',
 example:'Raise the model cell’s sodium leak and its computed voltage climbs towards zero; the toy rule then gives it a higher chance of dividing each hour. The toy rule is this course’s illustration of Cone’s idea, not his equation, and the trend band is drawn without numbers. Not medical advice.',
 desc:'A model cell with its computed Goldman voltage, a voltage scale with the published trend drawn as a band from mature to dividing cells, and a curve showing the toy chance of division per hour.',
 research:['Cone (1971). Unified theory on the basic mechanism of normal mitotic control and oncogenesis. Journal of Theoretical Biology 30, 151–181.','Binggeli & Weinstein (1986). Membrane potentials and sodium channels: hypotheses for growth regulation and cancer formation. Journal of Theoretical Biology 123, 377–401.','Yang & Brackenbury (2013). Membrane potential and cancer progression. Frontiers in Physiology 4, 185.','Toy division rule written for this course.'],
 dur:10,hint:'Change the sodium leak and watch the computed voltage and the toy chance of division. Brain In Motion’s resting-potential-ghk scene explains the Goldman equation.',
 init:()=>({na:4}),
 watch(p){return {na:Math.round(lerp(1,40,smooth(p<.8?p/.8:1)))}},
 ui:[{range:'na',label:'Sodium leak (relative to potassium, %)',min:1,max:40,get:s=>s.na,act:'na'}],
 on:{na(s,v){s.na=clamp(Math.round(+v),1,40)}},
 draw(s){
  const pNa=s.na/100,V=L5_vOf(5,pNa),r=L5_divRate(V);
  let out=heading(`Computed voltage ${L5_mv(V)} · toy division ${fmt(Math.round(r*1000)/10)}% per hour`);
  // the cell
  const cx=100,cy=150;
  out+=Ci(cx,cy,58,L5_vcol(V),C.blue)+TBF(cx,cy+5,L5_mv(V),15,C.ink)+TF(cx,cy+80,`K⁺ 1 : Na⁺ ${fmt(pNa)} : Cl⁻ ${fmt(L5_CELL.pCl)}`,13,C.muted);
  out+=L5_badge(cx,40,'model','middle');
  // voltage scale with the trend band
  const x0=200,x1=570,Xv=v=>x0+(v+100)/100*(x1-x0),ya=118;
  out+=L5_badge(x0,40,'rep')+TF(x0+L5_badgeW('rep')+8,54,'reported trend, no numbers',13,C.muted,'start');
  for(let i=0;i<30;i++){const u=i/29;out+=R(lerp(x0,x1,u)-6,ya-18,12.8,16,u<.5?C.pale:C.coralp,'none',0,`opacity="${fmt(.35+.65*Math.abs(u-.5)*2)}"`)}
  out+=TF(x0+4,ya-26,'mature, non-dividing',13,C.blue,'start')+TF(x1-4,ya-26,'dividing, stem, many cancer cells',13,C.coral,'end');
  out+=L(x0,ya,x1,ya,C.line,3);for(const v of [-100,-50,0])out+=L(Xv(v),ya,Xv(v),ya+6,C.muted,1.4)+TF(Xv(v),ya+22,v===0?'0 mV':L5_n(v),13,C.muted);
  out+=`<polygon points="${fmt(Xv(V))},${ya-1} ${fmt(Xv(V)-7)},${ya-11} ${fmt(Xv(V)+7)},${ya-11}" fill="${C.ink}"/>`;
  // toy division curve
  const pl=L5_plot(262,172,290,126,[-100,0],[0,L5_DIV.rmax*100],{xt:[[-88,'−90'],[-45,'−45'],[-2,'0']],yt:[[L5_DIV.rmax*100,fmt(L5_DIV.rmax*100)+'%']],xl:'voltage (mV)',xlDy:32,yl:'toy chance of dividing per hour'});
  const pts=[];for(let v=-100;v<=0;v+=2)pts.push([pl.X(v),pl.Y(L5_divRate(v)*100)]);
  out+=pl.svg+L5_poly(pts,C.purple,2.4)+Ci(pl.X(V),pl.Y(r*100),6,C.ink,'#fff');
  out+=L5_badge(40,250,'model');
  out+=TF(40,288,'Toy rule: division is',13,C.muted,'start')+TF(40,304,'likelier above about',13,C.muted,'start')+TF(40,320,L5_mv(L5_DIV.vh)+' (an assumption).',13,C.muted,'start');
  out+=L5_note('Illustrative concentrations; the toy rule is not Cone’s equation. '+L5_NM);
  return {svg:out,phase:V<-65?`With little sodium leak the cell sits at ${L5_mv(V)}, near potassium’s equilibrium. In the toy rule its chance of dividing is low, as Cone proposed for mature cells.`:V>-50?`At ${L5_mv(V)} the cell is depolarised, where dividing and many cancer cells tend to sit. The toy gives it about ${fmt(Math.round(r*1000)/10)}% an hour. The trend is real; whether voltage is the cause is the open question.`:`At ${L5_mv(V)} the model cell is in between. Real cells move along this scale as they change which channels they express.`};
 }});

// Cone's experiments as a seeded toy: 200 cells in culture for 48 h; the medium's potassium sets the voltage.
const L5_MEDIA={normal:{label:'normal medium',Ko:5},low:{label:'low K⁺: more negative',Ko:1},high:{label:'high K⁺: less negative',Ko:20}};
function L5_coneRun(a,b){const r=L5_rng(71+a.length*7+b.length),fr=[];let cells=200;
 for(let blk=0;blk<12;blk++){const med=blk<6?a:b,V=L5_vOf(L5_MEDIA[med].Ko),p=L5_divRate(V);let div=0;
  for(let h=0;h<4;h++){let d=0;for(let c=0;c<cells;c++)if(r()<p)d++;div+=d;cells+=d}
  fr.push({blk,med,V,div,cells,rate:div/(cells-div/2)*100})}
 return fr}
SCENE({id:'depolarised-cells-cone',name:'Cone’s cultures: blocking and releasing division',tag:'Single-lab finding · Simplified model: Cone’s experiments on voltage and mitosis',
 definition:'Cone and his colleagues tested the theory in cultured cells. Cone and Tongier (1971) changed the ions in the culture medium to set the cells’ membrane voltage and reported that strongly negative (hyperpolarised) levels blocked mitosis in cultured cells, completely but reversibly. Cone and Cone (1976) reported the reverse in another tissue: keeping mature neurons from the central nervous system depolarised for a long time led some of them to divide. These were reports from one group, important for starting the field; later work by others supports the broad link between voltage and the cell cycle.',
 example:'In the toy, 200 cells grow for 48 hours. Choose the medium for each day: lowering outside potassium makes the computed voltage more negative and the toy division rate falls; returning to normal medium lets division resume. The numbers come from this toy, not from Cone’s papers. Not medical advice.',
 desc:'A bar chart of toy mitoses per 100 cells in each 4-hour block over two days, with the medium for each day, the computed voltage and the cell count.',
 research:['Cone & Tongier (1971). Control of somatic cell mitosis by simulated changes in the transmembrane potential level. Oncology 25, 168.','Cone & Cone (1976). Induction of mitosis in mature neurons in central nervous system by sustained depolarization. Science 192, 155–158.','Toy culture written for this course (seeded, 200 cells, one division rule).'],
 dur:12,hint:'Choose a medium for day 1 and day 2, then step through the 4-hour blocks. Try a more negative day 1 followed by normal medium.',
 init:()=>({a:'low',b:'normal'}),
 trace:s=>L5_coneRun(s.a,s.b).map((f,i,all)=>({...f,all,say:`Hours ${f.blk*4}–${f.blk*4+4}, ${L5_MEDIA[f.med].label}: the computed voltage is ${L5_mv(f.V)} and the toy culture had ${f.div} divisions (${L5_n(f.rate,1)} per 100 cells).`})),
 ui:[{choose:[['normal','Normal'],['low','Low K⁺'],['high','High K⁺']],label:'Day 1 medium',get:s=>s.a,act:'a'},{choose:[['normal','Normal'],['low','Low K⁺'],['high','High K⁺']],label:'Day 2 medium',get:s=>s.b,act:'b'}],
 on:{a(s,v){s.a=L5_MEDIA[v]?v:'normal'},b(s,v){s.b=L5_MEDIA[v]?v:'normal'}},
 draw(s,f){
  const all=f.all,k=f.blk,maxR=Math.max(8,...all.map(q=>q.rate));
  let out=heading(`Day ${k<6?1:2}: ${L5_MEDIA[f.med].label}`);
  const pl=L5_plot(70,70,330,200,[0,12],[0,maxR],{xt:[[0,'0 h'],[6,'24 h'],[12,'48 h']],yt:[[0,'0'],[maxR,L5_n(maxR)]],yl:'toy mitoses per 100 cells, per 4 h'});
  out+=pl.svg+L(pl.X(6),70,pl.X(6),270,C.line,1.5,'stroke-dasharray="4 3"');
  all.forEach((q,i)=>{const col=q.med==='low'?C.blue:q.med==='high'?C.coral:C.green;out+=R(pl.X(i)+3,pl.Y(q.rate),pl.X(1)-pl.X(0)-6,pl.Y(0)-pl.Y(q.rate),i<=k?col:'#fff',col,3)});
  out+=TF(pl.X(3),292,L5_MEDIA[s.a].label,13,C.muted)+TF(pl.X(9),292,L5_MEDIA[s.b].label,13,C.muted);
  out+=L5_tile(420,70,160,'Voltage (computed)',L5_mv(f.V),C.ink)+L5_tile(420,124,160,'Divisions, this block',String(f.div),C.purple)+L5_tile(420,178,160,'Cells now',String(f.cells),C.green);
  out+=L5_badge(420,234,'model');
  out+=R(420,262,160,76,C.pale,'none',8)+L5_badge(428,268,'single')+TF(428,304,'Reported: a negative',13,C.ink,'start')+TF(428,322,'block, reversible (1971)',13,C.ink,'start');
  out+=L5_note('Toy numbers from one seeded run; Cone’s own values are not shown. '+L5_NM,356);
  return {svg:out,phase:f.say};
 }});

// Correlation versus cause: two toy worlds that give the same correlation.
function L5_worlds(world,clamp_){const r=L5_rng(world==='A'?501:502),cells=[];
 for(let i=0;i<80;i++){const g=r(),noise=L5_gauss(r)*6,Vn=-80+50*g+noise,V=clamp_==='none'?Vn:clamp_==='dep'?-30:-80;
  const p=world==='A'?1/(1+Math.exp(-(V+50)/5)):1/(1+Math.exp(-(g-.6)/.08));
  cells.push({g,Vn,V,div:r()<p?1:0})}
 return cells}
SCENE({id:'depolarised-cells-cause',name:'Correlation is not cause',tag:'Simplified model · Framework or hypothesis: does voltage drive division?',
 definition:'A correlation between voltage and division could arise in two ways: voltage could help cause division, or some third factor (a growth signal, a stage of the cell cycle) could change both. Only experiments that set the voltage directly and watch what follows can tell them apart. Such experiments exist (Cone’s, and many since with channels and drugs), and reviews of ion channels in cancer list many channels whose activity affects proliferation. How far voltage itself is a cause, rather than a by-product of other changes, is still argued case by case; the lab’s view that voltage is an instructive control signal is a hypothesis built on these experiments.',
 example:'Both toy worlds show a positive correlation between voltage and division. Clamp every cell at −30 mV: in world A, where voltage is the cause, division rises; in world B, where a hidden factor drives both, it does not change. Not medical advice.',
 desc:'A scatter of 80 toy cells by voltage, split into dividing and not dividing, for one of two worlds, with the computed correlation and the fraction dividing, before and after clamping the voltage.',
 research:['Yang & Brackenbury (2013). Membrane potential and cancer progression. Frontiers in Physiology 4, 185.','Prevarskaya, Skryma & Shuba (2018). Ion channels in cancer: are cancer hallmarks oncochannelopathies? Physiological Reviews 98, 559–621.','Two toy worlds written for this course.'],
 dur:12,hint:'Pick a world, then clamp the voltage of every cell and compare the fraction dividing. The learner is not told in advance which world is causal in real cells: that is the experimental question.',
 init:()=>({world:'A',cl:'none'}),
 watch(p){const i=Math.min(3,Math.floor(p*4));return {world:i<2?'A':'B',cl:i%2?'dep':'none'}},
 ui:[{choose:[['A','World A: voltage causes'],['B','World B: hidden factor']],label:'Toy world',get:s=>s.world,act:'world'},{choose:[['none','No clamp'],['dep','Clamp at −30 mV'],['hyp','Clamp at −80 mV']],label:'Intervention',get:s=>s.cl,act:'cl'}],
 on:{world(s,v){s.world=v==='B'?'B':'A'},cl(s,v){s.cl=['none','dep','hyp'].includes(v)?v:'none'}},
 draw(s){
  const base=L5_worlds(s.world,'none'),now=L5_worlds(s.world,s.cl),rC=L5_corr(base.map(c=>c.Vn),base.map(c=>c.div));
  const f0=sum(base.map(c=>c.div))/base.length,f1=sum(now.map(c=>c.div))/now.length;
  let out=heading(s.world==='A'?'World A: voltage helps cause division':'World B: a hidden factor drives both');
  const pl=L5_plot(70,70,320,190,[-95,-20],[0,1],{xt:[[-90,'−90'],[-60,'−60'],[-30,'−30']],xl:'voltage before any clamp (mV)',xlDy:32});
  out+=pl.svg+TF(64,pl.Y(.82)+4,'divides',13,C.coral,'end')+TF(64,pl.Y(.18)+4,'does not',13,C.blue,'end');
  const r2=L5_rng(9);
  now.forEach((c,i)=>{const jit=r2()*.22-.11,y=c.div?.82+jit:.18+jit;out+=Ci(pl.X(clamp(c.Vn,-95,-20)),pl.Y(y),4.5,c.div?C.coral:C.blue,'none','opacity=".85"')});
  if(s.cl!=='none'){const v=s.cl==='dep'?-30:-80;out+=TF(pl.X(-57),86,`all cells now clamped at ${L5_mv(v)}`,13,C.purple)}
  out+=L5_tile(410,70,170,'Correlation (no clamp)','r = '+L5_n(rC,2),C.ink)+L5_tile(410,124,170,'Dividing, no clamp',L5_pc(f0),C.coral)+L5_tile(410,178,170,s.cl==='none'?'Dividing (same)':'Dividing, clamped',L5_pc(f1),C.purple);
  out+=L5_badges(410,236,['model'])+L5_badge(410,262,'frame');
  out+=TF(410,300,'Which world real cells',13,C.ink,'start')+TF(410,318,'resemble is tested case',13,C.ink,'start')+TF(410,336,'by case, by intervention.',13,C.ink,'start');
  out+=L5_note('Toy data, 80 seeded cells. '+L5_NM,362);
  return {svg:out,phase:s.cl==='none'?`Without intervening, voltage and division are correlated (r = ${L5_n(rC,2)}) in this world. The other world shows a similar correlation, so looking alone cannot tell them apart.`:
   s.world==='A'?`Clamping changed division from ${L5_pc(f0)} to ${L5_pc(f1)}: in world A voltage is upstream of division, so setting it changes the outcome.`:`Clamping left division almost unchanged (${L5_pc(f0)} to ${L5_pc(f1)}). In world B the correlation came from a hidden factor; voltage was a by-stander.`};
 }});

/* ===================== Lesson: instructor-cells ===================== */
// A sparse set of "instructor" cells in a model tadpole flank; depolarising them is read out as a conversion of
// melanocytes elsewhere. The toy uses an antagonistic-signal rule with a steep threshold, following the lab's
// proposed explanation of the all-or-none response; it is not the paper's model.
const L5_INS_N=60;
function L5_insRun(nDep,sert,seed){const r=L5_rng(seed*31);   // one fixed draw per embryo, so the curve is monotone
 // Each instructor cell releases a unit of serotonin when depolarised; release is blocked if the transporter is blocked.
 const rel=sert?0:nDep,field=rel/6,                     // signal reaching melanocytes, in arbitrary units
  p=1/(1+Math.exp(-(field-1)/.12));                     // steep, nearly all-or-none in this toy
 const conv=r()<p;
 return {rel,field,p,conv,nDep,sert};
}
function L5_insBatch(nDep,sert,runs=24){let c=0;const out=[];
 for(let i=0;i<runs;i++){const q=L5_insRun(nDep,sert,i+1);if(q.conv)c++;out.push(q.conv)}
 return {frac:c/runs,runs,hits:c,flags:out}}
SCENE({id:'instructor-cells',name:'A few cells that instruct the rest',tag:'Single-lab finding · Simplified model: depolarised cells change melanocytes far away',
 definition:'In 2010–2011 Douglas Blackiston, Dany Spencer Adams, Joan Lemire, Maria Lobikin and Michael Levin reported that depolarising a sparse, scattered population of cells in Xenopus laevis embryos — cells they called instructor cells — made melanocytes elsewhere in the tadpole overproliferate, change shape and invade tissues including blood vessels, gut and nervous tissue. They depolarised the instructor cells by expressing a glycine-gated chloride channel and opening it with the drug ivermectin, and by changing the chloride outside. The melanocytes themselves were untouched, so the signal travelled between cells.',
 example:'The effect depended on serotonin: blocking the serotonin transporter prevented it, and the authors reported that depolarised instructor cells release serotonin through that transporter running in reverse. Expressing a hyperpolarising channel instead also prevented it. This is one group’s result in frog embryos; it is not a model of human cancer, and nothing here is medical advice.',
 desc:'A schematic flank of a model tadpole with scattered instructor cells, a few of them depolarised, the signal they release, and the melanocytes drawn as normal or converted in shape.',
 research:['Blackiston, Adams, Lemire, Lobikin & Levin (2011). Transmembrane potential of GlyCl-expressing instructor cells induces a neoplastic-like conversion of melanocytes via a serotonergic pathway. Disease Models & Mechanisms 4, 67–85.','Lobikin, Chernet, Lobo & Levin (2012). Resting potential, oncogene-induced tumorigenesis, and metastasis: the bioelectric basis of cancer in vivo. Physical Biology 9, 065002.','Toy signal rule written for this course.'],
 dur:12,hint:'Depolarise more instructor cells, and try blocking the serotonin transporter. The schematic is not a picture of a tadpole or of published data.',
 init:()=>({nDep:0,sert:false,seed:3}),
 watch(p){const k=Math.min(4,Math.floor(p*5));return {nDep:[0,2,5,9,9][k],sert:k===4,seed:3}},
 ui:[{range:'nDep',label:'Instructor cells depolarised',min:0,max:12,get:s=>s.nDep,act:'nDep'},{b:'Serotonin transporter: block / allow',act:'sert'},{b:'Another embryo',act:'seed'}],
 on:{nDep(s,v){s.nDep=clamp(Math.round(+v),0,12)},sert(s){s.sert=!s.sert},seed(s){s.seed=s.seed%7+1}},
 draw(s){
  const q=L5_insRun(s.nDep,s.sert,s.seed);
  let out=heading(q.conv?'This embryo: melanocytes converted':s.sert?'Transporter blocked: no conversion':'This embryo: melanocytes unchanged');
  // flank schematic
  out+=R(40,64,350,220,'#f4f8fb',C.line,14)+TF(215,80,'schematic flank of a model embryo',13,C.muted);
  const r3=L5_rng(400+s.seed);
  for(let i=0;i<L5_INS_N;i++){const x=56+r3()*318,y=96+r3()*172,dep=i<s.nDep;
   out+=Ci(x,y,dep?6:4,dep?C.coral:'#dde8ef',dep?C.coral:C.line);
   if(dep&&!s.sert)out+=Ci(x,y,11,'none',C.coralp,'stroke-width="3"')}
  // melanocytes
  const mel=[[90,250],[160,236],[240,252],[320,238]];
  for(const [x,y] of mel){
   if(q.conv){let arms='';for(let a=0;a<7;a++){const th=a*Math.PI*2/7;arms+=L(x,y,x+16*Math.cos(th),y+12*Math.sin(th),C.dark,2)}out+=arms+Ci(x,y,6,C.dark)}
   else out+=Ci(x,y,7,C.dark);
  }
  out+=TF(215,296,q.conv?'melanocytes: many arms, spread out (schematic)':'melanocytes: compact (schematic)',13,C.ink);
  out+=L5_badge(40,38,'single')+L5_badge(390,38,'model','end');
  // readouts
  out+=L5_tile(406,70,176,'Instructor cells depolarised',String(s.nDep)+' of '+L5_INS_N,C.coral)+L5_tile(406,124,176,'Signal released (toy units)',s.sert?'0':fmt(Math.round(q.field*100)/100),C.purple)+L5_tile(406,178,176,'Toy chance of conversion',L5_pc(q.p),C.ink);
  out+=R(406,232,176,106,C.pale,'none',8)+TF(494,252,'Reported in the paper:',13,C.muted)+TF(494,272,'blocking the serotonin',13,C.ink)+TF(494,290,'transporter prevented the',13,C.ink)+TF(494,308,'effect; so did a',13,C.ink)+TF(494,326,'hyperpolarising channel.',13,C.ink);
  out+=L5_note('Schematic only; no published image or number is drawn here. '+L5_NM);
  return {svg:out,phase:s.sert?'With the serotonin transporter blocked, the toy releases no signal and the melanocytes stay compact. In the paper, blocking the transporter prevented the conversion, which is why serotonin is thought to carry the message.':
   s.nDep===0?'No instructor cell is depolarised, so no signal leaves them. The melanocytes are compact. Note how few cells have to change in the next scene.':
   q.conv?`${s.nDep} depolarised cells released enough signal (${fmt(Math.round(q.field*100)/100)} toy units) to cross the threshold in this seeded embryo, and the melanocytes converted: more of them, with long arms, spreading through the body.`:
   `${s.nDep} depolarised cells gave ${fmt(Math.round(q.field*100)/100)} toy units of signal, below this embryo’s threshold. Try more cells, or another embryo: the toy response is nearly all-or-none, like the reported one.`};
 }});

SCENE({id:'instructor-cells-allornone',name:'All or none, across many embryos',tag:'Single-lab finding · Simplified model: a steep, stochastic response',
 definition:'Lobikin and colleagues (2012) reported that very few instructor cells needed to be depolarised for the melanocyte phenotype to appear, and that the response was close to all-or-none: an animal was either converted or not, rather than showing a graded change. They proposed a model of antagonistic serotonin receptor signalling to explain that steepness. Later work from the group (Lobikin et al. 2015, Science Signaling) reported the same all-or-none character with a signalling pathway involving cAMP and the transcription factors Sox10 and Slug.',
 example:'Here each toy embryo is scored converted or not, and the fraction across 24 seeded embryos is plotted against the number of depolarised cells. The curve is steep: between two settings the fraction jumps. The percentages are this toy’s, not the papers’. Not medical advice.',
 desc:'A step plot of the computed fraction of toy embryos converted against the number of depolarised instructor cells, with a row of 24 embryo markers for the chosen setting.',
 research:['Lobikin, Chernet, Lobo & Levin (2012). Resting potential, oncogene-induced tumorigenesis, and metastasis: the bioelectric basis of cancer in vivo. Physical Biology 9, 065002.','Lobikin, Lobo, Blackiston, Martyniuk, Tkachenko & Levin (2015). Serotonergic regulation of melanocyte conversion: a bioelectrically regulated network for stochastic all-or-none hyperpigmentation. Science Signaling 8, ra99.','Toy population written for this course (24 seeded embryos per point).'],
 dur:11,hint:'Move the number of depolarised cells and watch the fraction of toy embryos converted. Each dot is one seeded embryo.',
 init:()=>({nDep:5}),
 watch(p){return {nDep:Math.round(lerp(0,12,smooth(p)))}},
 ui:[{range:'nDep',label:'Instructor cells depolarised',min:0,max:12,get:s=>s.nDep,act:'nDep'}],
 on:{nDep(s,v){s.nDep=clamp(Math.round(+v),0,12)}},
 draw(s){
  const curve=range(13).map(n=>L5_insBatch(n,false).frac),b=L5_insBatch(s.nDep,false);
  let out=heading(`${s.nDep} cells depolarised: ${L5_pc(b.frac)} of ${b.runs} toy embryos converted`);
  const pl=L5_plot(70,64,470,150,[0,12],[0,1],{xt:[[0,'0'],[4,'4'],[8,'8'],[12,'12']],yt:[[0,'0%'],[.5,'50%'],[1,'100%']],xl:'instructor cells depolarised',yl:'toy embryos converted'});
  out+=pl.svg;
  const pts=[];curve.forEach((v,n)=>{pts.push([pl.X(n),pl.Y(v)])});
  out+=L5_poly(pts,C.coral,2.6);
  curve.forEach((v,n)=>{out+=Ci(pl.X(n),pl.Y(v),n===s.nDep?6:3.5,n===s.nDep?C.ink:C.coral,n===s.nDep?'#fff':'none')});
  // the 24 embryos
  out+=TF(70,276,'each marker is one seeded toy embryo (24 seeded runs):',13,C.muted,'start');
  b.flags.forEach((f,i)=>{const x=74+(i%12)*40,y=298+((i/12)|0)*26;out+=f?Ci(x,y,8,C.coralp,C.coral):Ci(x,y,8,'#fff',C.line);if(f)out+=TBF(x,y+4,'+',13,C.coral)});
  out+=L5_badges(36,348,['model','single']);
  return {svg:out,phase:b.frac===0?'No toy embryo converted at this setting. The toy threshold has not been reached in any seeded run.':
   b.frac===1?'Every toy embryo converted. Above the threshold the response saturates: there is no in-between animal, which is what the reported response also looked like.':
   `${b.hits} of ${b.runs} toy embryos converted (${L5_pc(b.frac)}). Near the threshold the outcome varies between seeded embryos while each single embryo is still either converted or not.`};
 }});

SCENE({id:'instructor-cells-serotonin',name:'How the message might travel',tag:'Framework or hypothesis · The proposed serotonergic route',
 definition:'The proposed route has three steps: the instructor cell is depolarised; its serotonin transporter, which normally takes serotonin up, runs the other way and releases serotonin outside; melanocytes respond to that serotonin and change their behaviour. Each step rests on experiments from the same group: the drug and channel manipulations that set voltage, the transporter blockers that prevented the effect, and direct serotonin exposure, which the authors reported produced the phenotype too.',
 example:'Sort the steps and see which experiment supports each. Transporters that run in reverse when the voltage changes are ordinary physiology: a transporter that carries charge with its cargo is driven by the membrane voltage like any other electrogenic carrier. Whether this particular route explains the whole effect is the lab’s hypothesis. Not medical advice.',
 desc:'Three linked panels for the proposed steps, each with the kind of experiment that supports it, the result the paper reported, and its evidence badge.',
 research:['Blackiston, Adams, Lemire, Lobikin & Levin (2011). Transmembrane potential of GlyCl-expressing instructor cells induces a neoplastic-like conversion of melanocytes via a serotonergic pathway. Disease Models & Mechanisms 4, 67–85.','Fukumoto, Blakely & Levin (2005). Serotonin transporter function is an early step in left–right patterning in chick and frog embryos. Developmental Neuroscience 27, 349–363 (on transporters in early embryos).'],
 dur:11,hint:'Press a step to see the experiment behind it, and the step that the lab’s own model treats as a hypothesis.',
 init:()=>({step:0}),
 watch(p){return {step:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:[[0,'Overview'],[1,'Step 1: voltage'],[2,'Step 2: transporter'],[3,'Step 3: melanocytes']],label:'Show',get:s=>s.step,act:'step'}],
 on:{step(s,v){s.step=clamp(Math.round(+v),0,3)}},
 draw(s,f,X){
  const STEPS=[
   {t:'Instructor cell depolarises',e:['a channel opened','by a drug'],r:'Several different ways of depolarising gave the same outcome.',k:'single'},
   {t:'Serotonin leaves the cell',e:['the transporter','blocked'],r:'Blocking the transporter prevented the conversion.',k:'single'},
   {t:'Melanocytes respond',e:['serotonin given','directly'],r:'Reported to produce the phenotype without any voltage change.',k:'single'}];
  let out=heading(s.step===0?'A proposed three-step route':STEPS[s.step-1].t);
  const bx=[36,210,384];
  STEPS.forEach((st,i)=>{const on=s.step===0||s.step===i+1,x=bx[i];
   out+=R(x,66,180,150,on?C.purplep:'#f6f7f9',on?C.purple:C.line,10);
   out+=TBF(x+90,92,'Step '+(i+1),13,on?C.purple:C.muted);
   out+=TF(x+90,116,st.t.split(' ').slice(0,2).join(' '),13,C.ink)+TF(x+90,134,st.t.split(' ').slice(2).join(' '),13,C.ink)
    +TF(x+90,160,'evidence:',13,C.muted)+TF(x+90,180,st.e[0],13,C.ink)+TF(x+90,198,st.e[1],13,C.ink);
   if(i<2)out+=arrow(x+182,141,x+206,141,on?C.purple:C.line,2.4);
  });
  if(s.step>0){const st=STEPS[s.step-1];
   out+=R(36,232,528,66,'#fff',C.grid,8)+L5_badge(48,240,st.k)+TF(48+L5_badgeW(st.k)+10,254,'what was reported',13,C.muted,'start')+TF(48,284,st.r,13,C.ink,'start');
   out+=R(36,306,528,44,C.purplep,'none',8)+L5_badge(48,314,'frame')+TF(48+L5_badgeW('frame')+10,328,'the route as a whole is the lab’s proposed mechanism',13,C.ink,'start');
  }else{
   out+=R(36,232,528,110,C.purplep,'none',10)+L5_badge(48,242,'frame');
   out+=TF(300,284,'Each step has its own experiment; the chain as a whole is',13,C.ink)+TF(300,306,'the lab’s proposed mechanism, not an established pathway.',13,C.ink)+TF(300,330,L5_NM,13,C.muted);
  }
  return {svg:out,phase:s.step===0?'Three steps, each supported by its own kind of experiment: change the voltage, block the transporter, give serotonin directly. Press a step to see what was reported.':
   s.step===1?'Different manipulations — a chloride channel opened by a drug, or a change in outside chloride — gave the same result. That pattern is the lab’s argument that it is the voltage, rather than one particular protein, that matters.':
   s.step===2?'Blocking the serotonin transporter prevented the conversion. The authors argue that the depolarised cell releases serotonin through the transporter working in reverse, which is a known behaviour of electrogenic carriers.':
   'Serotonin applied directly was reported to produce the phenotype, which places the melanocytes downstream of the signal rather than of the voltage change itself.'};
 }});

/* ===================== Lesson: kras-tumours ===================== */
// A toy dye image of a model tadpole flank: a patch of oncogene-expressing cells sits at its own resting voltage,
// coupled weakly to the surrounding tissue; the "dye brightness" is a smoothed function of the computed voltage.
const L5_KW=20,L5_KH=12;
function L5_krasField(s){
 const n=L5_KW*L5_KH,E=new Array(n),gm=new Array(n).fill(1);
 const cxs=[6,14],cys=[4,8];                                  // two induced patches
 const inPatch=k=>{const x=k%L5_KW,y=(k/L5_KW)|0;return cxs.some((cx,i)=>Math.hypot(x-cx,y-cys[i])<2.6)};
 for(let k=0;k<n;k++){const onc=s.onc&&inPatch(k);
  // host tissue sits at the hyperpolarised resting voltage; oncogene-expressing cells are depolarised.
  let e=L5_vOf(5,.04);
  if(onc)e=L5_vOf(5,.34);
  if(s.chan==='kir')e=L5_vOf(5,.02)-18;                       // extra potassium channel everywhere
  if(s.chan==='glyr'&&onc)e+=-26;                             // chloride channel open in the patch
  E[k]=e}
 const V=L5_sheet(L5_KW,L5_KH,E,gm,()=>s.gj);
 return {V,inPatch};
}
// Toy incidence over seeded embryos: a patch counts as a growth if its mean voltage is above a threshold.
function L5_krasRuns(chan,gj,runs=20){const out=[];
 for(let i=0;i<runs;i++){const r=L5_rng(880+i*13+chan.length),jit=L5_gauss(r)*7;
  const f=L5_krasField({onc:true,chan,gj}),idx=range(L5_KW*L5_KH).filter(f.inPatch);
  const mean=sum(idx.map(k=>f.V[k]))/idx.length+jit;
  out.push(mean>-46)}
 return {hits:sum(out.map(Number)),runs,frac:sum(out.map(Number))/runs,flags:out}}
SCENE({id:'kras-tumours',name:'Tumour-like growths with an electrical signature',tag:'Single-lab finding · Simplified model: depolarised voltage marks induced growths',
 definition:'Brook Chernet and Michael Levin (2013) injected frog embryos with messenger RNA for human oncogenes — KRAS carrying the G12D mutation, and also Gli1, Xrel3 and a mutant p53 — which produced tumour-like structures in the tadpoles. Imaged with a voltage-reporting dye, those structures stood out as depolarised against the surrounding tissue, and the authors reported that the same signature appeared at sites before a growth was visible there. These are induced tumour-like structures in frog tadpoles, not human cancers, and nothing here is medical advice.',
 example:'In the toy, the patch of oncogene-expressing cells carries its own depolarised resting voltage; gap-junctional coupling to the surrounding tissue pulls it back towards the host voltage. Turn the coupling up and the patch becomes harder to see in the toy dye image. Every voltage shown is computed by the sheet model; no published image is drawn.',
 desc:'A grid of model cells as a toy voltage-dye image, with a labelled colour scale and a numeric readout of the patch and host voltages computed by the sheet model.',
 research:['Chernet & Levin (2013). Transmembrane voltage potential is an essential cellular parameter for the detection and control of tumor development in a Xenopus model. Disease Models & Mechanisms 6, 595–607.','Toy sheet model written for this course: cells with their own resting voltages coupled by a single gap-junction conductance.'],
 dur:12,hint:'Switch the oncogene on and off and change the coupling. Era 1’s voltage-dyes scenes explain what a dye image can and cannot show.',
 init:()=>({onc:true,gj:.25,chan:'none'}),
 watch(p){return {onc:p>.18,gj:p<.6?.25:lerp(.25,2.2,(p-.6)/.4),chan:'none'}},
 ui:[{b:'Oncogene mRNA: on / off',act:'onc'},{range:'gj',label:'Gap-junction coupling (×100)',min:2,max:220,get:s=>Math.round(s.gj*100),act:'gj'}],
 on:{onc(s){s.onc=!s.onc},gj(s,v){s.gj=clamp(+v,2,220)/100}},
 draw(s){
  const {V,inPatch}=L5_krasField(s),n=L5_KW*L5_KH;
  const idx=range(n).filter(inPatch),host=range(n).filter(k=>!inPatch(k));
  const vp=sum(idx.map(k=>V[k]))/idx.length,vh=sum(host.map(k=>V[k]))/host.length;
  let out=heading(s.onc?`Patch ${L5_mv(vp)} against host ${L5_mv(vh)}`:'No oncogene: one even voltage');
  const gx=56,gy=88,cw=21,ch=16;
  for(let k=0;k<n;k++){const x=gx+(k%L5_KW)*cw,y=gy+((k/L5_KW)|0)*ch;
   out+=R(x,y,cw-1,ch-1,L5_vcol(V[k],-95,-20),'none',2)}
  if(s.onc)for(let i=0;i<2;i++){const cx=gx+[6,14][i]*cw+cw/2,cy=gy+[4,8][i]*ch+ch/2;out+=Ci(cx,cy,30,'none',C.ink,'stroke-dasharray="4 3" stroke-width="1.6"')}
  out+=TF(300,80,'toy dye image of a model flank (each square is one cell)',13,C.muted);
  out+=L5_vbar(140,294,320,-95,-20,'computed voltage');
  out+=L5_tile(36,300,152,'Patch (computed)',s.onc?L5_mv(vp):'—',C.coral)+L5_tile(412,300,152,'Host (computed)',L5_mv(vh));
  out+=L5_badge(44,38,'single')+L5_badge(556,38,'model','end');
  out+=L5_note('Toy model; no published dye image is reproduced. '+L5_NM,370);
  return {svg:out,phase:!s.onc?`Without the oncogene every model cell has the same resting voltage, so the toy image is flat at ${L5_mv(vh)}. In the paper, control tadpoles showed no such depolarised region.`:
   s.gj>1.2?`With strong coupling the patch is pulled to ${L5_mv(vp)}, close to the host’s ${L5_mv(vh)}: the difference the dye would report has mostly gone. Coupling is the subject of the next lesson.`:
   `The patch sits at ${L5_mv(vp)} while the host tissue is at ${L5_mv(vh)}, a difference of ${L5_n(Math.abs(vp-vh))} mV computed by the model. It is this kind of difference that the dye made visible in the published images.`};
 }});

SCENE({id:'kras-tumours-hyperpolarise',name:'Holding the cells negative',tag:'Single-lab finding · Simplified model: forcing hyperpolarisation lowered incidence',
 definition:'Chernet and Levin went on to force the cells towards a more negative voltage, by making them express hyperpolarising ion transporters, and reported that the tumour-like structures formed less often. In a follow-up (Chernet & Levin 2014, Oncotarget) they reported that hyperpolarising cells some distance away also suppressed the growths, and argued that the effect runs through voltage-dependent transport of butyrate and a histone-deacetylase mechanism. All of this is in frog tadpoles, from one group; it is not a treatment and nothing here is medical advice.',
 example:'Switch on a potassium channel everywhere, or a chloride channel inside the patch, and the toy recomputes the patch voltage and scores 20 seeded embryos as having a growth or not. The published result is drawn beside it as a separate, labelled figure: in the 2013 paper, co-injecting the potassium channel Kir4.1 with KRAS gave a 1.3-fold decrease in the number of embryos with these structures.',
 desc:'The toy patch voltage for each intervention, the computed toy incidence over 20 seeded embryos, and a separate labelled panel for the reported fold-decrease.',
 research:['Chernet & Levin (2013). Transmembrane voltage potential is an essential cellular parameter for the detection and control of tumor development in a Xenopus model. Disease Models & Mechanisms 6, 595–607 (reported a 1.3-fold decrease in embryos with tumour-like structures when Kir4.1 was co-injected with KRAS G12D).','Chernet & Levin (2014). Transmembrane voltage potential of somatic cells controls oncogene-mediated tumorigenesis at long-range. Oncotarget 5, 3287–3306.','Toy incidence written for this course (20 seeded embryos, one threshold).'],
 dur:12,hint:'Try each intervention and compare the toy incidence with the published fold-decrease beside it. The toy numbers are not the paper’s.',
 init:()=>({chan:'none',gj:.25}),
 watch(p){return {chan:['none','kir','glyr'][Math.min(2,Math.floor(p*3))],gj:.25}},
 ui:[{choose:[['none','Oncogene only'],['kir','Potassium channel everywhere'],['glyr','Chloride channel in the patch']],label:'Intervention',get:s=>s.chan,act:'chan'}],
 on:{chan(s,v){s.chan=['none','kir','glyr'].includes(v)?v:'none'}},
 draw(s){
  const f=L5_krasField({onc:true,chan:s.chan,gj:s.gj}),idx=range(L5_KW*L5_KH).filter(f.inPatch);
  const vp=sum(idx.map(k=>f.V[k]))/idx.length,b=L5_krasRuns(s.chan,s.gj);
  const base=L5_krasRuns('none',s.gj);
  let out=heading(`Patch at ${L5_mv(vp)}: ${b.hits} of ${b.runs} toy embryos scored as growths`);
  // toy embryos
  out+=TF(300,64,'each marker is one seeded toy embryo',13,C.muted);
  b.flags.forEach((hit,i)=>{const x=74+(i%10)*52,y=96+((i/10)|0)*46;
   out+=R(x-20,y-18,40,36,hit?C.coralp:'#f4f8fb',hit?C.coral:C.line,8)+TBF(x,y+5,hit?'growth':'none',hit?12:12,hit?C.coral:C.muted)});
  out+=L5_tile(44,194,164,'Patch voltage (computed)',L5_mv(vp),C.ink)+L5_tile(218,194,164,'Toy incidence',L5_pc(b.frac),C.coral)+L5_tile(392,194,164,'Toy, oncogene only',L5_pc(base.frac),C.muted);
  out+=L5_badges(44,250,['model']);
  out+=R(44,276,512,66,C.pale,'none',8)+L5_badge(56,284,'single');
  out+=TF(56+L5_badgeW('single')+10,298,'reported separately, not from this toy',13,C.muted,'start');
  out+=TF(56,330,'With Kir4.1 co-injected, 1.3-fold fewer embryos had growths (2013).',13,C.ink,'start');
  out+=L5_note(L5_NM,360);
  return {svg:out,phase:s.chan==='none'?`Oncogene only: the patch sits at ${L5_mv(vp)} and ${b.hits} of ${b.runs} seeded toy embryos cross the toy threshold.`:
   `With this intervention the computed patch voltage is ${L5_mv(vp)} and the toy incidence falls from ${L5_pc(base.frac)} to ${L5_pc(b.frac)}. The published experiment used real channels and reported a smaller, 1.3-fold, decrease: a toy is not a replication.`};
 }});

SCENE({id:'kras-tumours-detect',name:'A signature before the growth',tag:'Single-lab finding · Simplified model: reading a pattern early',
 definition:'The 2013 paper reported that the depolarised signature could be seen at sites where a tumour-like structure later appeared, before it was visible as a structure. That makes voltage a candidate early marker in this animal model. It also raises the problem of reading dye images: a slow, blurred, relative measure can miss a small depolarised region, or suggest one where there is none.',
 example:'Choose a time point. Early on, the toy patch is small and the blurred toy dye image barely shows it; later it is unmistakable. The detection score is computed from the toy image, with a fixed threshold, so the scene can also show a false alarm in a control. Not medical advice.',
 desc:'Two toy dye images side by side, one with an oncogene patch and one control, each blurred as a dye image would be, with the computed contrast and whether a fixed threshold calls a growth.',
 research:['Chernet & Levin (2013). Transmembrane voltage potential is an essential cellular parameter for the detection and control of tumor development in a Xenopus model. Disease Models & Mechanisms 6, 595–607.','Adams & Levin (2012). Measuring resting membrane potential using the fluorescent voltage reporters DiBAC4(3) and CC2-DMPE. Cold Spring Harbor Protocols.','Toy blur and detection rule written for this course.'],
 dur:12,hint:'Move the time point and the blur. Watch when the fixed threshold starts to call the patch, and whether the control ever triggers it.',
 init:()=>({t:3,blur:2}),
 watch(p){return {t:Math.max(0,Math.round(lerp(0,6,smooth(p)))),blur:2}},
 ui:[{range:'t',label:'Time point (toy stages)',min:0,max:6,get:s=>s.t,act:'t'},{range:'blur',label:'Dye blur (cells)',min:0,max:4,get:s=>s.blur,act:'blur'}],
 on:{t(s,v){s.t=clamp(Math.round(+v),0,6)},blur(s,v){s.blur=clamp(Math.round(+v),0,4)}},
 draw(s){
  const W=16,H=10,n=W*H,rad=.5+s.t*.42;
  const build=(onc,seed)=>{const E=new Array(n),gm=new Array(n).fill(1),r=L5_rng(seed);
   for(let k=0;k<n;k++){const x=k%W,y=(k/W)|0,d=Math.hypot(x-7,y-5);
    E[k]=(onc&&d<rad?L5_vOf(5,.34):L5_vOf(5,.04))+L5_gauss(r)*2.2}
   const V=L5_sheet(W,H,E,gm,()=>.2);
   // toy dye: blur the voltage field over a square window
   const B=V.map((_,k)=>{const x=k%W,y=(k/W)|0;let acc=0,c=0;
    for(let dy=-s.blur;dy<=s.blur;dy++)for(let dx=-s.blur;dx<=s.blur;dx++){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=W||yy>=H)continue;acc+=V[yy*W+xx];c++}
    return acc/c});
   const base=sum(B)/n,peak=Math.max(...B);
   return {V,B,contrast:peak-base,call:peak-base>6};
  };
  const A=build(true,21),Z=build(false,22);
  let out=heading(A.call?`Toy image calls a growth at stage ${s.t}`:`Stage ${s.t}: the toy image does not call a growth`);
  const panel=(f,x0,title,badge)=>{let o=TBF(x0+128,78,title,13,C.ink);
   for(let k=0;k<n;k++){const x=x0+(k%W)*16,y=92+((k/W)|0)*15;o+=R(x,y,15,14,L5_vcol(f.B[k],-95,-20),'none',2)}
   o+=TF(x0+128,268,'contrast '+L5_n(f.contrast,1)+' mV · '+(f.call?'called':'not called'),13,f.call?C.coral:C.muted);
   return o};
  out+=panel(A,36,'oncogene patch (toy)')+panel(Z,308,'control (toy)');
  out+=L5_vbar(160,286,280,-95,-20,'computed voltage');
  out+=L5_badges(36,330,['model','single']);
  out+=L5_note('Threshold fixed at 6 mV of contrast in the toy image. '+L5_NM,362);
  return {svg:out,phase:s.t<=1?`At stage ${s.t} the depolarised region is only a cell or two wide, and after blurring its contrast is ${L5_n(A.contrast,1)} mV: below the toy threshold. A real early signature is hard to see for the same reason.`:
   A.call?`The toy image now has ${L5_n(A.contrast,1)} mV of contrast and crosses the threshold, while the control has ${L5_n(Z.contrast,1)} mV. This is the kind of early call the paper reported making in tadpoles.`:
   `The patch has grown but the blur of ${s.blur} cells spreads it out: ${L5_n(A.contrast,1)} mV of contrast, still under the threshold. Lower the blur, or wait a stage.`};
 }});

/* ===================== Lesson: cell-coupling ===================== */
// A sheet of cells with a depolarised patch; coupling decides whether the patch is pulled back or escapes.
const L5_CW=16,L5_CH=10;
function L5_coupField(s){
 const n=L5_CW*L5_CH,E=new Array(n),gm=new Array(n).fill(1);
 const inPatch=k=>{const x=k%L5_CW,y=(k/L5_CW)|0;return Math.hypot(x-7.5,y-4.5)<s.rad};
 for(let k=0;k<n;k++)E[k]=inPatch(k)?L5_vOf(5,.4):L5_vOf(5,.04);
 // coupling: inside the patch the cells may be uncoupled from everything (s.iso), or coupled as elsewhere
 const gj=(a,b)=>{const pa=inPatch(a),pb=inPatch(b);if(s.iso&&(pa!==pb))return s.gj*.02;if(s.iso&&pa&&pb)return s.gj*.1;return s.gj};
 const V=L5_sheet(L5_CW,L5_CH,E,gm,gj);
 return {V,inPatch,gj};
}
SCENE({id:'cell-coupling',name:'Cells that stopped talking',tag:'Replicated finding · Simplified model: reduced coupling in many tumours',
 definition:'In 1966 Werner Loewenstein and Yoshinobu Kanno reported in Nature that cells in rat liver cancers did not pass electrical current to one another, while normal liver cells did. Their companion papers in the Journal of Cell Biology described the same for transplanted liver tumours. Reduced gap-junctional coupling has since been found in many tumour types by many groups, which makes the correlation a replicated finding. What it means is another matter, taken up in the third scene of this lesson.',
 example:'In the toy sheet, a patch of depolarised cells sits in normal tissue. With ordinary coupling the patch is pulled back towards the tissue voltage; cut the patch off from its neighbours and it keeps its own voltage. Every voltage is computed by the sheet model. Not medical advice.',
 desc:'A grid of model cells coloured by computed voltage, with the patch outlined, the junctions between patch and tissue drawn as open or closed, and numeric readouts of the patch and tissue voltages.',
 research:['Loewenstein & Kanno (1966). Intercellular communication and the control of tissue growth: lack of communication between cancer cells. Nature 209, 1248–1249.','Loewenstein & Kanno (1967). Intercellular communication and tissue growth. I. Cancerous growth. Journal of Cell Biology 33, 225–234.','Aasen, Mesnil, Naus, Lampe & Laird (2016). Gap junctions and cancer: communicating for 50 years. Nature Reviews Cancer.','Toy sheet model written for this course.'],
 dur:12,hint:'Close the junctions around the patch, and change the coupling strength, then compare the computed patch and tissue voltages.',
 init:()=>({gj:.3,iso:false,rad:2.4}),
 watch(p){return {gj:.3,iso:p>.5,rad:2.4}},
 ui:[{b:'Junctions around the patch: open / closed',act:'iso'},{range:'gj',label:'Coupling strength (×100)',min:2,max:150,get:s=>Math.round(s.gj*100),act:'gj'}],
 on:{iso(s){s.iso=!s.iso},gj(s,v){s.gj=clamp(+v,2,150)/100}},
 draw(s){
  const {V,inPatch}=L5_coupField(s),n=L5_CW*L5_CH;
  const pi=range(n).filter(inPatch),ti=range(n).filter(k=>!inPatch(k));
  const vp=sum(pi.map(k=>V[k]))/pi.length,vt=sum(ti.map(k=>V[k]))/ti.length;
  let out=heading(s.iso?`Cut off: the patch holds ${L5_mv(vp)}`:`Coupled: the patch is pulled to ${L5_mv(vp)}`);
  const gx=64,gy=86,cw=28,ch=20;
  for(let k=0;k<n;k++){const x=gx+(k%L5_CW)*cw,y=gy+((k/L5_CW)|0)*ch;out+=R(x,y,cw-2,ch-2,L5_vcol(V[k],-95,-20),'none',3)}
  // junction marks on the patch border
  for(let k=0;k<n;k++){const x=k%L5_CW,y=(k/L5_CW)|0;
   for(const j of [k+1,k+L5_CW]){if(j>=n)continue;if(j===k+1&&x===L5_CW-1)continue;
    if(inPatch(k)!==inPatch(j)){const mx=gx+(x+(j===k+1?1:.5))*cw-1,my=gy+(y+(j===k+1?.5:1))*ch-1;
     out+=s.iso?TBF(mx,my+4,'✕',12,C.dark):Ci(mx,my,3,C.green)}}}
  out+=TF(300,80,'toy sheet: each square is one cell; marks show the junctions at the patch border',13,C.muted);
  out+=L5_vbar(160,300,280,-95,-20,'computed voltage');
  out+=L5_tile(36,296,148,'Patch (computed)',L5_mv(vp),C.coral)+L5_tile(416,296,148,'Tissue (computed)',L5_mv(vt));
  out+=L5_badge(44,38,'rep')+L5_badge(556,38,'model','end');
  out+=L5_note(L5_NM,370);
  return {svg:out,phase:s.iso?`With the border junctions closed the patch keeps its own depolarised voltage, ${L5_mv(vp)}, while the tissue stays at ${L5_mv(vt)}. Loewenstein and Kanno’s observation was exactly this absence of coupling in cancer cells.`:
   `Current flows across the border, so the patch is dragged to ${L5_mv(vp)} and the nearby tissue is pulled a little the other way (${L5_mv(vt)} on average). A well-coupled tissue imposes its voltage on a dissenting cell.`};
 }});

// How far the tissue's influence reaches: a row of cells with one depolarised end, fitted length constant.
function L5_rowRun(gj,gm){const nC=14,E=range(nC).map(i=>i===0?L5_vOf(5,.5):L5_vOf(5,.04)),g=new Array(nC).fill(gm);
 const V=L5_row(E,g,gj),rest=V[nC-1];
 // Fit a length constant to the decay of (V - rest) by least squares on its logarithm, over cells 2 to 9.
 const d=V.map(v=>v-rest),xs=[],ys=[];
 for(let i=1;i<=8;i++)if(d[i]>1e-4){xs.push(i);ys.push(Math.log(d[i]))}
 let lam=NaN;
 if(xs.length>2){const n=xs.length,mx=sum(xs)/n,my=sum(ys)/n;
  let sxy=0,sxx=0;for(let i=0;i<n;i++){sxy+=(xs[i]-mx)*(ys[i]-my);sxx+=(xs[i]-mx)**2}
  const slope=sxy/sxx;if(slope<0)lam=-1/slope}
 // The same quantity for a long chain of identical cells: 1 / arccosh(1 + gm / (2 gj)).
 const a=1+gm/(2*gj),theory=1/Math.log(a+Math.sqrt(a*a-1));
 return {V,d,lam,rest,theory};
}
SCENE({id:'cell-coupling-reach',name:'How far a tissue’s voice carries',tag:'Simplified model · Replicated finding: coupling spreads voltage over a distance',
 definition:'In a coupled row of cells, a voltage difference at one end spreads and decays with distance. The distance over which it falls to about 37% of its starting size is the length constant: it grows with the gap-junction conductance and shrinks with the cells’ own leak. That is ordinary cable behaviour, measured in many tissues, and it sets how far a tissue can impose its voltage on a deviant cell, and how far a depolarised patch can influence its neighbours.',
 example:'Change the coupling and the leak, and the model computes the voltage of each of 14 cells and fits the length constant from the decay. With weak coupling the influence dies out within a cell or two; with strong coupling it reaches across the row. Not medical advice.',
 desc:'A row of 14 model cells with their computed voltages drawn as a decaying curve, the fitted length constant marked, and the cells coloured by voltage.',
 research:['Loewenstein (1981). Junctional intercellular communication: the cell-to-cell membrane channel. Physiological Reviews.','Toy cable model written for this course (steady state of a coupled row, solved numerically).'],
 dur:11,hint:'Change the coupling and the membrane leak, then read the fitted length constant. Era 1’s gap-junctions-row scene builds the same row from scratch.',
 init:()=>({gj:40,gm:100}),
 watch(p){return {gj:Math.round(lerp(5,160,smooth(p))),gm:100}},
 ui:[{range:'gj',label:'Gap-junction conductance (×100)',min:5,max:300,get:s=>s.gj,act:'gj'},{range:'gm',label:'Membrane leak (×100)',min:30,max:300,get:s=>s.gm,act:'gm'}],
 on:{gj(s,v){s.gj=clamp(Math.round(+v),5,300)},gm(s,v){s.gm=clamp(Math.round(+v),30,300)}},
 draw(s){
  const q=L5_rowRun(s.gj/100,s.gm/100),nC=q.V.length;
  let out=heading(isFinite(q.lam)?`Fitted length constant ${L5_n(q.lam,1)} cells`:'The influence decays within one cell');
  const pl=L5_plot(70,72,470,140,[0,nC-1],[-95,-20],{xt:[[0,'cell 1'],[6,'7'],[13,'14']],yt:[[-90,'−90'],[-60,'−60'],[-30,'−30']],yl:'computed voltage (mV)'});
  out+=pl.svg+L5_poly(q.V.map((v,i)=>[pl.X(i),pl.Y(v)]),C.blue,2.6);
  q.V.forEach((v,i)=>{out+=Ci(pl.X(i),pl.Y(v),5,L5_vcol(v,-95,-20),C.blue)});
  if(isFinite(q.lam)){out+=L(pl.X(q.lam),72,pl.X(q.lam),212,C.purple,1.8,'stroke-dasharray="5 4"')+TF(540,66,'dashed line: length constant',13,C.purple,'end')}
  out+=TF(70,250,'cell 1 is held depolarised by its own channels; the rest share one resting voltage',13,C.muted,'start');
  // the row drawn as cells
  for(let i=0;i<nC;i++){const x=70+i*33;out+=R(x,262,30,26,L5_vcol(q.V[i],-95,-20),C.line,4)}
  out+=TF(300,306,'each box is one model cell, coloured by its computed voltage',13,C.muted);
  out+=L5_tile(36,316,160,'Cell 1',L5_mv(q.V[0]),C.coral)+L5_tile(404,316,160,'Cable value',L5_n(q.theory,1)+' cells',C.purple);
  out+=L5_badges(240,326,['model']);
  return {svg:out,phase:isFinite(q.lam)?`Cell 1 sits at ${L5_mv(q.V[0])} and the far end at ${L5_mv(q.V[nC-1])}; the difference falls to 37% of its size after about ${L5_n(q.lam,1)} cells. Raise the coupling and the influence reaches further.`:
   `With this little coupling, cell 1’s voltage hardly reaches its neighbour: the row behaves as a set of independent cells, which is what losing junctions does to a tissue.`};
 }});

const L5_CLAIMS=[
 {short:'Rat liver cancer cells passed no current',side:'sup',full:'Loewenstein and Kanno reported in 1966 that cells in rat liver cancers did not pass current to one another, while normal liver cells did.'},
 {short:'A tumour promoter blocked communication',side:'sup',full:'Yotti, Chang and Trosko reported in 1979 that a phorbol-ester tumour promoter eliminated metabolic cooperation between cultured Chinese hamster cells, a measure of junctional communication; another group reported the same that year.'},
 {short:'Many studies support connexins as suppressors',side:'sup',full:'The 2016 review states that many studies support a tumour-suppressor role for connexins.'},
 {short:'Some tumours seem to use connexins',side:'help',full:'The same review states that more recent evidence suggests that in some tumour types connexins facilitate particular stages of progression, through junctional and non-junctional signalling.'}];
SCENE({id:'cell-coupling-debate',name:'Suppressor, or helper?',tag:'Criticism and debate · What reduced coupling means',
 definition:'The 1966 observation led to a long-running proposal that gap junctions restrain growth, and so that losing them helps cancer start. Supporting work included James Trosko’s group, who reported in 1979 with Yotti and Chang that a tumour-promoting phorbol ester blocked junctional communication between cultured cells; a separate group reported the same that year. But the picture has not stayed simple. A 2016 Nature Reviews Cancer review by Aasen, Mesnil, Naus, Lampe and Laird summarised fifty years of work: many studies support connexins as tumour suppressors, while more recent evidence suggests that in some tumour types connexins help particular stages of progression, through junctional and non-junctional signalling.',
 example:'Sort the claims into the two positions and see which evidence each side rests on. Nothing in this scene settles the question, and nothing here is medical advice.',
 desc:'Two columns, suppressor and helper, with claims the learner can place in either, and a note on what the cited review says about where the balance of evidence lies.',
 research:['Loewenstein & Kanno (1966). Intercellular communication and the control of tissue growth: lack of communication between cancer cells. Nature 209, 1248–1249.','Yotti, Chang & Trosko (1979). Elimination of metabolic cooperation in Chinese hamster cells by a tumor promoter. Science 206, 1089–1091.','Aasen, Mesnil, Naus, Lampe & Laird (2016). Gap junctions and cancer: communicating for 50 years. Nature Reviews Cancer.'],
 dur:12,hint:'Press a claim to move it between the two columns; the scene then says which side the cited review places it on.',
 init:()=>({place:{},pick:null}),
 watch(p){const k=Math.min(4,Math.floor(p*5)),place={};for(let i=0;i<k;i++)place[i]=L5_CLAIMS[i].side;return {place,pick:k?k-1:null}},
 ui:[{choose:[[0,'Claim 1'],[1,'Claim 2'],[2,'Claim 3'],[3,'Claim 4']],label:'Claim',get:s=>s.pick===null?0:s.pick,act:'pick'},{b:'Place it: suppressor',act:'sup'},{b:'Place it: helper',act:'help'},{b:'Clear',act:'clear'}],
 on:{pick(s,v){s.pick=clamp(Math.round(+v),0,3)},sup(s){if(s.pick!==null)s.place={...s.place,[s.pick]:'sup'}},help(s){if(s.pick!==null)s.place={...s.place,[s.pick]:'help'}},clear(s){s.place={};s.pick=null}},
 draw(s){
  let out=heading('Does losing gap junctions help cancer, or does keeping them?');
  out+=R(36,62,258,78,C.greenp,'none',10)+TBF(165,86,'Junctions restrain growth',13,C.green)+TF(165,108,'losing them helps cancer start',13,C.ink)+TF(165,128,'(the 1966 proposal)',13,C.muted);
  out+=R(306,62,258,78,C.coralp,'none',10)+TBF(435,86,'Junctions can help tumours',13,C.coral)+TF(435,108,'in some types, at some stages',13,C.ink)+TF(435,128,'(more recent evidence)',13,C.muted);
  L5_CLAIMS.forEach((c,i)=>{const y=156+i*44,at=s.place[i],x=at==='sup'?36:at==='help'?306:171;
   const w=at?258:258,sel=s.pick===i;
   out+=R(x,y,w,38,at==='sup'?C.greenp:at==='help'?C.coralp:'#f6f7f9',sel?C.ink:C.line,8)+TF(x+w/2,y+24,c.short,13,C.ink);
  });
  const done=Object.keys(s.place).length;
  out+=L5_badge(36,330,'debate');
  out+=TF(300,366,done?`${done} of 4 placed · the review’s own reading is in the caption below`:'Place each claim on the side it supports.',13,C.muted);
  const cur=s.pick===null?null:L5_CLAIMS[s.pick];
  return {svg:out,phase:cur?`${cur.full} The cited review places this on the “${cur.side==='sup'?'junctions restrain growth':'junctions can help tumours'}” side.`:
   'Both sides have published evidence. The review that covers fifty years of this work concludes that many studies support connexins as tumour suppressors, while some tumour types appear to use them during progression.'};
 }});

/* ===================== Lesson: brain-rescue ===================== */
// A toy anterior neural plate: a row of cells whose resting voltages are meant to form a pre-pattern
// (a hyperpolarised middle between depolarised flanks). A disruption flattens it; added channels restore it.
const L5_BN=18;
// Target pre-pattern used by this toy: a hyperpolarised band in the middle of the row.
const L5_target=i=>{const u=(i-(L5_BN-1)/2)/((L5_BN-1)/2);return lerp(-32,-78,Math.exp(-4.5*u*u))};
function L5_brainRun(s){
 const E=range(L5_BN).map(i=>{
  const u=(i-(L5_BN-1)/2)/((L5_BN-1)/2),w=Math.exp(-4.5*u*u),tgt=L5_target(i);
  // The disruption flattens the hyperpolarised middle band towards −44 mV and leaves the flanks alone.
  let e=tgt+(s.dis/100)*(-44-tgt)*w;
  // The toy channel adds one conductance towards −86 mV, strongest in the middle, weaker on the flanks,
  // so a little of it restores the band and a lot of it drags the whole row negative.
  if(s.hcn>0){const g=(s.hcn/100)*(1.8*w+0.12);e=(e+g*(-86))/(1+g)}
  return e});
 const gm=new Array(L5_BN).fill(1),V=L5_row(E,gm,s.gj/100);
 const tgt=range(L5_BN).map(L5_target);
 const rms=Math.sqrt(sum(V.map((v,i)=>(v-tgt[i])**2))/L5_BN);
 const match=clamp(1-rms/26,0,1);
 return {V,tgt,rms,match};
}
SCENE({id:'brain-rescue',name:'A voltage pre-pattern in the embryo’s head',tag:'Single-lab finding · Simplified model: a voltage pattern that prefigures the brain',
 definition:'Vaibhav Pai and colleagues (2015) reported that the resting voltages of cells in the frog embryo’s anterior neural region are not uniform, and that this pattern does not merely accompany brain development but instructs it: changing the voltages by misexpressing ion channels changed the expression of brain patterning genes and the anatomy that followed, with effects running through Notch signalling and the control of proliferation. This is reported from one lab, in frog embryos. It says nothing about human brains, and nothing here is medical advice.',
 example:'In the toy, 18 model cells should form a pattern with a hyperpolarised middle. Flatten it with a disruption and the computed match to the target falls. The target and the match are this toy’s, not the paper’s measurements.',
 desc:'A row of model cells with the target pre-pattern drawn as a dashed line and the computed voltages as a solid line, coupled by gap junctions, with a numeric match score.',
 research:['Pai, Lemire, Paré, Lin, Chen & Levin (2015). Endogenous gradients of resting potential instructively pattern embryonic neural tissue via Notch signaling and regulation of proliferation. Journal of Neuroscience 35, 4366–4385.','Toy pre-pattern written for this course: a row of coupled cells with a chosen target shape.'],
 dur:11,hint:'Raise the disruption and watch the pattern flatten, then change the coupling. The next scene adds the channel that was reported to restore it.',
 init:()=>({dis:0,hcn:0,gj:25}),
 watch(p){return {dis:Math.round(smooth(clamp((p-.25)/.6,0,1))*100),hcn:0,gj:25}},
 ui:[{range:'dis',label:'Disruption of the pattern (%)',min:0,max:100,get:s=>s.dis,act:'dis'},{range:'gj',label:'Gap-junction coupling (×100)',min:2,max:120,get:s=>s.gj,act:'gj'}],
 on:{dis(s,v){s.dis=clamp(Math.round(+v),0,100)},gj(s,v){s.gj=clamp(Math.round(+v),2,120)}},
 draw(s){
  const q=L5_brainRun(s);
  let out=heading(`Pattern match ${L5_pc(q.match)} · computed middle ${L5_mv(q.V[(L5_BN/2)|0])}`);
  const pl=L5_plot(70,76,470,160,[0,L5_BN-1],[-90,-20],{xt:[[0,'left'],[(L5_BN-1)/2,'middle'],[L5_BN-1,'right']],yt:[[-80,'−80'],[-50,'−50'],[-30,'−30']],yl:'computed voltage (mV)'});
  out+=pl.svg+L5_poly(q.tgt.map((v,i)=>[pl.X(i),pl.Y(v)]),C.purple,2,'stroke-dasharray="5 4"')+L5_poly(q.V.map((v,i)=>[pl.X(i),pl.Y(v)]),C.blue,2.8);
  q.V.forEach((v,i)=>{out+=Ci(pl.X(i),pl.Y(v),4,L5_vcol(v,-90,-20),C.blue)});
  out+=L(150,56,174,56,C.purple,2,'stroke-dasharray="5 4"')+TF(180,60,'target',13,C.purple,'start')
   +L(270,56,294,56,C.blue,2.8)+TF(300,60,'this embryo (computed)',13,C.blue,'start');
  for(let i=0;i<L5_BN;i++){const x=70+i*26;out+=R(x,254,24,24,L5_vcol(q.V[i],-90,-20),C.line,4)}
  out+=TF(300,296,'model cells across the anterior neural region (schematic)',13,C.muted);
  out+=L5_tile(44,306,160,'Match to target',L5_pc(q.match),C.purple)+L5_tile(218,306,160,'Error (computed)',L5_n(q.rms,1)+' mV',C.ink)+L5_tile(392,306,160,'Disruption',s.dis+'%',C.coral);
  out+=L5_badge(44,38,'single')+L5_badge(556,38,'model','end');
  out+=L5_note(L5_NM,364);
  return {svg:out,phase:s.dis===0?`Undisturbed, the toy row forms the target pattern: a hyperpolarised middle at ${L5_mv(q.V[(L5_BN/2)|0])} between less negative flanks, and a match of ${L5_pc(q.match)}.`:
   s.dis>70?`The pattern has almost gone: every cell sits near ${L5_mv(sum(q.V)/L5_BN)} and the match is ${L5_pc(q.match)}. In the published work, disrupted voltage patterns went with altered brain gene expression and anatomy.`:
   `The pattern is partly flattened (match ${L5_pc(q.match)}). Coupling matters here: cells pull each other’s voltages together, which can either spread a pattern or smear it.`};
 }});

SCENE({id:'brain-rescue-hcn2',name:'Putting the pattern back',tag:'Single-lab finding · Simplified model: HCN2 restored brain anatomy in frog embryos',
 definition:'Pai, Pietak, Willocq, Ye, Shi and Levin (2018) reported that nicotine, a known neuroteratogen, disrupted the voltage pre-pattern in frog embryos and produced serious brain defects. A computational model, built with Alexis Pietak, suggested that adding the HCN2 ion channel would restore the pattern, because of how that channel behaves at the voltages involved. Misexpressing HCN2 in nicotine-exposed embryos restored the voltage pattern, the expression of brain patterning genes, much of the brain’s anatomy, and performance in a tadpole learning assay. Expression in tissue away from the brain worked too.',
 example:'Add the toy channel to the disrupted row and the computed match to the target rises. The toy channel is a single extra conductance towards a fixed voltage; HCN2 is a real channel whose behaviour depends on voltage and on cyclic nucleotides, and the toy does not model that. Frog embryos; no human claim; not medical advice.',
 desc:'The disrupted pattern and the rescued pattern against the target, with the computed match for each and a separate labelled panel for what the paper reported.',
 research:['Pai, Pietak, Willocq, Ye, Shi & Levin (2018). HCN2 rescues brain defects by enforcing endogenous voltage pre-patterns. Nature Communications 9, 998.','Pai, Cervera, Mafe, Willocq, Lederer & Levin (2020). HCN2 channel-induced rescue of brain teratogenesis via local and long-range bioelectric repair. Frontiers in Cellular Neuroscience 14, 136.','Toy channel written for this course: one extra conductance towards a fixed voltage.'],
 dur:12,hint:'Set the disruption, then add the toy channel and watch the match recover. The published numbers are in the panel, drawn separately from the toy.',
 init:()=>({dis:100,hcn:0,gj:25}),
 watch(p){return {dis:100,hcn:Math.round(smooth(clamp((p-.2)/.7,0,1))*110),gj:25}},
 ui:[{range:'hcn',label:'Toy channel added (%)',min:0,max:160,get:s=>s.hcn,act:'hcn'},{range:'dis',label:'Disruption (%)',min:0,max:100,get:s=>s.dis,act:'dis'}],
 on:{hcn(s,v){s.hcn=clamp(Math.round(+v),0,160)},dis(s,v){s.dis=clamp(Math.round(+v),0,100)}},
 draw(s){
  const bad=L5_brainRun({...s,hcn:0}),now=L5_brainRun(s);
  let out=heading(s.hcn>0?`Toy channel at ${s.hcn}%: match ${L5_pc(now.match)} (was ${L5_pc(bad.match)})`:`Disrupted: match ${L5_pc(bad.match)}`);
  const pl=L5_plot(70,80,470,124,[0,L5_BN-1],[-90,-20],{xt:[[0,'left'],[(L5_BN-1)/2,'middle'],[L5_BN-1,'right']],yt:[[-80,'−80'],[-50,'−50'],[-30,'−30']],yl:'computed voltage (mV)'});
  out+=pl.svg+L5_poly(now.tgt.map((v,i)=>[pl.X(i),pl.Y(v)]),C.purple,2,'stroke-dasharray="5 4"')
   +L5_poly(bad.V.map((v,i)=>[pl.X(i),pl.Y(v)]),C.coral,2.2)+L5_poly(now.V.map((v,i)=>[pl.X(i),pl.Y(v)]),C.blue,2.8);
  out+=L(70,52,94,52,C.purple,2,'stroke-dasharray="5 4"')+TF(100,56,'target',13,C.purple,'start')
   +L(168,52,192,52,C.coral,2.2)+TF(198,56,'disrupted',13,C.coral,'start')
   +L(290,52,314,52,C.blue,2.8)+TF(320,56,'with the toy channel',13,C.blue,'start');
  out+=L5_tile(36,236,168,'Match now',L5_pc(now.match),C.blue)+L5_tile(216,236,168,'Match disrupted',L5_pc(bad.match),C.coral)+L5_tile(396,236,168,'Error (computed)',L5_n(now.rms,1)+' mV',C.ink);
  out+=L5_badge(36,292,'model');
  out+=R(190,288,374,58,C.pale,'none',8)+L5_badge(202,294,'single');
  out+=TF(202,330,'Reported: HCN2 restored brain anatomy and learning (2018).',13,C.ink,'start');
  out+=L5_note(L5_NM,368);
  return {svg:out,phase:s.hcn===0?`The disrupted row has a match of ${L5_pc(bad.match)}. Add the toy channel and see whether the pattern can be put back without touching the disruption itself.`:
   now.match>bad.match+.1?`With the toy channel the match rises from ${L5_pc(bad.match)} to ${L5_pc(now.match)}: the extra conductance pulls cells back towards the pattern’s voltages. That is the logic of the published rescue, not its mechanism.`:
   `The toy channel is not helping much here (${L5_pc(bad.match)} to ${L5_pc(now.match)}). Too much of it drags every cell to the same voltage, which destroys a pattern as surely as flattening it.`};
 }});

// Published percentages from Pai et al. (2020), drawn as reported values and never recomputed.
const L5_RESCUE=[{label:'Controls',short:'controls',pc:5,col:C.green},{label:'Nicotine',short:'nicotine',pc:67,col:C.coral},
 {label:'Nicotine + lamotrigine from stage 10',short:'from st. 10',pc:15,col:C.blue},{label:'Nicotine + lamotrigine from stage 25',short:'from st. 25',pc:10,col:C.purple}];
SCENE({id:'brain-rescue-drug',name:'Repair from a distance, and with a drug',tag:'Single-lab finding · Published values drawn separately',
 definition:'A follow-up (Pai, Cervera, Mafe, Willocq, Lederer & Levin, 2020) reported two further results in the same frog model: expressing HCN2 in tissue far from the brain, or grafting HCN2-expressing tissue there, also reversed the defects; and small molecules that open HCN2 channels produced a rescue, even when given after the damage had begun. The compounds used were lamotrigine and gabapentin, applied to the water the embryos developed in. These are frog-embryo experiments from one lab. No drug named here is a treatment for anything in people, and nothing in this course is medical advice.',
 example:'The published percentages of tadpoles with brain defects are drawn here as a bar chart of reported values, each labelled with the paper; they are not computed by any model in this course. In the lamotrigine experiments the paper reported 5% of controls, 67% after nicotine, 15% with treatment from stage 10 to 35 and 10% with treatment from stage 25 to 35.',
 desc:'A bar chart of the reported percentages of tadpoles with brain defects for the control, nicotine and two treatment groups, labelled as published values, with the safety note beside it.',
 research:['Pai, Cervera, Mafe, Willocq, Lederer & Levin (2020). HCN2 channel-induced rescue of brain teratogenesis via local and long-range bioelectric repair. Frontiers in Cellular Neuroscience 14, 136 (the percentages drawn here are from this paper).'],
 dur:10,hint:'Step through the groups to read each reported value. These bars are published numbers, not model output.',
 init:()=>({k:3}),
 trace:()=>L5_RESCUE.map((g,i)=>({i,say:`${g.label}: ${g.pc}% of tadpoles with brain defects, as reported.`})),
 ui:[{choose:[[0,'Controls'],[1,'Nicotine'],[2,'From stage 10'],[3,'From stage 25']],label:'Group',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=clamp(Math.round(+v),0,3)}},
 draw(s,f,X){
  const k=X&&X.try?s.k:(f?f.i:0);
  let out=heading('Reported percentages of tadpoles with brain defects');
  const pl=L5_plot(80,80,440,180,[0,4],[0,80],{yt:[[0,'0%'],[40,'40%'],[80,'80%']],yl:'tadpoles with brain defects (reported)'});
  out+=pl.svg;
  L5_RESCUE.forEach((g,i)=>{const x=pl.X(i)+14,w=pl.X(1)-pl.X(0)-28;
   out+=R(x,pl.Y(g.pc),w,pl.Y(0)-pl.Y(g.pc),i===k?g.col:'#fff',g.col,4)+TBF(x+w/2,pl.Y(g.pc)-8,g.pc+'%',13,g.col);
   out+=TF(x+w/2,pl.Y(0)+20,g.short,13,i===k?C.ink:C.muted)});
  out+=L5_badge(80,290,'single');
  out+=TF(80+L5_badgeW('single')+10,304,'published values, drawn as reported (2020)',13,C.muted,'start');
  out+=TF(80,332,'Frog embryos. The compounds were lamotrigine and gabapentin, in the water.',13,C.ink,'start');
  out+=L5_note('No drug named here is a treatment for any human condition. '+L5_NM,360);
  return {svg:out,phase:(f?f.say:'')||`${L5_RESCUE[k].label}: ${L5_RESCUE[k].pc}% with brain defects, as reported.`};
 }});

/* ===================== Lesson: boundary-of-self ===================== */
SCENE({id:'boundary-of-self',name:'Cancer as a shrinking of the self',tag:'Framework or hypothesis · Simplified model: the lab’s proposal about scale',
 definition:'Levin has proposed that a tissue works as a collective because its cells are joined into one electrically coupled network, and that cancer begins when cells drop out of that network: cut off, a cell falls back on the goals of a single cell — grow, migrate, survive — rather than those of the body. On this view the depolarisation and the lost coupling in the lessons above are not side effects but the disconnection itself, and cancer is a problem about the scale of the self rather than only about mutated proteins. This is a framework: a way of organising the findings and of generating predictions, not an established account.',
 example:'The toy draws what the framework points at: a single cell’s goal reaches only itself, a coupled tissue’s reaches across many cells. Drag the boundary and the scene reports the framework’s reading of that picture. Nothing here changes how any cancer is understood clinically, and nothing in this course is medical advice.',
 desc:'A sheet of model cells with a boundary the learner can widen or shrink, the computed coupled extent of one cell’s influence, and the framework’s description of what each extent is meant to represent.',
 research:['Levin (2021). Bioelectrical approaches to cancer as a problem of the scaling of the cellular self. Progress in Biophysics and Molecular Biology 165, 102–113.','Levin (2019). The computational boundary of a self: developmental bioelectricity drives multicellularity and scale-free cognition. Frontiers in Psychology 10, 2688.','Toy sheet written for this course.'],
 dur:12,hint:'Change the coupling and watch how far one cell’s influence reaches in the model. The framework reads that reach as the size of the “self”.',
 init:()=>({gj:40}),
 watch(p){return {gj:Math.round(lerp(2,160,smooth(p)))}},
 ui:[{range:'gj',label:'Coupling between cells (×100)',min:2,max:200,get:s=>s.gj,act:'gj'}],
 on:{gj(s,v){s.gj=clamp(Math.round(+v),2,200)}},
 draw(s){
  const W=15,H=9,n=W*H,gm=new Array(n).fill(1),E=new Array(n).fill(L5_vOf(5,.04));
  const k0=4*W+7;E[k0]=L5_vOf(5,.5);
  const V=L5_sheet(W,H,E,gm,()=>s.gj/100);
  const base=V[n-1],d=V.map(v=>v-base),peak=d[k0];
  // reach: how many cells are moved by at least 20% of the peak difference
  const reach=sum(d.map(v=>v>peak*.2?1:0));
  let out=heading(`One cell’s influence reaches ${reach} ${reach===1?'cell':'cells'} in the model`);
  const gx=70,gy=70,cw=30,chh=20;
  for(let k=0;k<n;k++){const x=gx+(k%W)*cw,y=gy+((k/W)|0)*chh;
   out+=R(x,y,cw-2,chh-2,L5_vcol(V[k],-95,-20),k===k0?C.ink:'none',3)}
  out+=TF(300,64,'each square is a model cell; the outlined one has its own voltage',13,C.muted);
  out+=L5_vbar(160,266,280,-95,-20,'computed voltage');
  out+=L5_tile(36,294,168,'Cells influenced',String(reach),C.purple)+L5_tile(216,294,168,'Coupling',fmt(s.gj/100),C.ink)+L5_tile(396,294,168,'Its own voltage',L5_mv(V[k0]),C.coral);
  out+=L5_badges(36,350,['frame','model']);
  return {svg:out,phase:reach<=2?`With almost no coupling, the cell’s state stays its own: its influence covers ${reach} ${reach===1?'cell':'cells'}. The framework reads this as a cell whose “self” is the single cell — the state it proposes cancer cells fall back to.`:
   reach>30?`Strong coupling spreads the cell’s state over ${reach} cells, and the tissue’s voltage also presses back on it. The framework reads this as a self at the scale of the tissue, where cells work on the body’s pattern instead of their own growth.`:
   `At this coupling, ${reach} cells are affected. The framework’s claim is that where this boundary falls decides which goals cells pursue; what would count as measuring it is the subject of the next scene.`};
 }});

SCENE({id:'boundary-of-self-views',name:'Three accounts of cancer, side by side',tag:'Criticism and debate · The standard account and two others',
 definition:'The standard account is the somatic mutation theory: cancer arises from mutations in the genes of a single cell lineage that affect proliferation and survival, selected clonally. It underpins most cancer biology. The tissue organisation field theory, set out by Carlos Sonnenschein and Ana Soto, treats cancer instead as a tissue-level disorder of organisation, with proliferation as cells’ default state; it was published as an explicit challenge to the standard theory, and was answered in the same 2011 issue of BioEssays by David Vaux defending the mutation theory. The bioelectric framework in this era is a third proposal, about the electrical coupling that holds a tissue together.',
 example:'Compare what each account takes as the unit of the disease, what it says would change the outcome, and which evidence in this course belongs to it. The course does not adjudicate between them: it marks which are frameworks under test. Not medical advice.',
 desc:'Three columns, one per account, with the unit of disease, the kind of intervention each implies, and the evidence cited for it, and badges showing what kind of claim each is.',
 research:['Soto & Sonnenschein (2011). The tissue organization field theory of cancer: a testable replacement for the somatic mutation theory. BioEssays 33, 332–340.','Vaux (2011). In defense of the somatic mutation theory of cancer. BioEssays 33, 341–343.','Levin (2021). Bioelectrical approaches to cancer as a problem of the scaling of the cellular self. Progress in Biophysics and Molecular Biology 165, 102–113.'],
 dur:12,hint:'Step through the three accounts; each panel gives its unit, its implied intervention and the published source.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(2,Math.floor(p*3))}},
 ui:[{choose:[[0,'Somatic mutation'],[1,'Tissue organisation'],[2,'Bioelectric coupling']],label:'Account',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=clamp(Math.round(+v),0,2)}},
 draw(s){
  const A=[{t:'Somatic mutation theory',u:'the cell lineage and its genes',i:'target the mutated pathways',e:'the standard, best-supported account in cancer biology',k:'frame',col:C.green},
   {t:'Tissue organisation field theory',u:'the tissue and its organisation',i:'change the tissue’s context',e:'Soto & Sonnenschein (2011); answered by Vaux (2011)',k:'debate',col:C.coral},
   {t:'Bioelectric scaling of the self',u:'the electrical network joining cells',i:'restore coupling and voltage',e:'Levin (2021); the animal findings in this era',k:'frame',col:C.purple}];
  let out=heading('Three accounts, three units of disease');
  A.forEach((a,i)=>{const x=36+i*178,on=i===s.k;
   out+=R(x,62,168,116,on?'#fff':'#f6f7f9',on?a.col:C.line,10)+TBF(x+84,88,'Account '+(i+1),13,on?a.col:C.muted);
   out+=TF(x+84,116,a.t.split(' ')[0],13,C.ink)+TF(x+84,136,a.t.split(' ').slice(1,3).join(' '),13,C.ink)+TF(x+84,156,a.t.split(' ').slice(3).join(' '),13,C.ink);
   out+=L5_badge(x+84,186,a.k,'middle')});
  const a=A[s.k];
  out+=R(36,218,528,120,C.pale,'none',10);
  out+=TF(52,244,'Unit of the disease:',13,C.muted,'start')+TF(214,244,a.u,13,C.ink,'start');
  out+=TF(52,274,'Implied intervention:',13,C.muted,'start')+TF(214,274,a.i,13,C.ink,'start');
  out+=TF(52,304,'Evidence cited:',13,C.muted,'start')+TF(214,304,a.e,13,C.ink,'start');
  out+=TF(52,328,'The course marks which are frameworks under test; it does not pick one.',13,C.muted,'start');
  out+=L5_note(L5_NM,362);
  return {svg:out,phase:s.k===0?'The somatic mutation theory is the standard account: mutations in one cell lineage, selected as the tumour grows. Most cancer biology and most treatment is built on it.':
   s.k===1?'Soto and Sonnenschein proposed the tissue organisation field theory as a testable replacement, with proliferation as cells’ default state and cancer as a tissue-level disorder. Vaux replied in the same issue in defence of the mutation theory. The disagreement is live and published.':
   'The bioelectric proposal is narrower than either: it is about the coupling and voltage that hold a tissue together, and it is offered as a framework with experiments (the frog work in this era) rather than as a replacement theory of cancer.'};
 }});

SCENE({id:'boundary-of-self-tests',name:'What would test it',tag:'Framework or hypothesis · Predictions and what would count against them',
 definition:'A framework earns its place by what it predicts. The proposals in this era imply, among other things, that voltage and coupling changes should come before visible growths, that forcing coupling or hyperpolarisation should reduce them without editing genes, that this should work at a distance, and that it should hold in animals other than frogs. The first three have reported support in this lab’s frog work. The last is open: the course found no independent replication in mammals to cite, and saying so plainly is part of the framework’s honest statement.',
 example:'Match each prediction with the evidence that exists and with what would count against it. Where the course could find no published test, the panel says so rather than guessing. Not medical advice.',
 desc:'A list of predictions, each with a status (reported in frogs, or no test the course could cite), the result that would weigh against it, and an evidence badge.',
 research:['Chernet & Levin (2013). Transmembrane voltage potential is an essential cellular parameter for the detection and control of tumor development in a Xenopus model. Disease Models & Mechanisms 6, 595–607.','Chernet & Levin (2014). Transmembrane voltage potential of somatic cells controls oncogene-mediated tumorigenesis at long-range. Oncotarget 5, 3287–3306.','Levin (2021). Bioelectrical approaches to cancer as a problem of the scaling of the cellular self. Progress in Biophysics and Molecular Biology 165, 102–113.'],
 dur:12,hint:'Step through the predictions and read what each would take to fail. No independent mammalian test is claimed here either way.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:[[0,'Prediction 1'],[1,'Prediction 2'],[2,'Prediction 3'],[3,'Prediction 4']],label:'Show',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=clamp(Math.round(+v),0,3)}},
 draw(s){
  const P5=[{p:'A depolarised signature appears before a growth is visible',st:'reported in frog tadpoles (2013)',ag:'growths that start with no voltage change',k:'single'},
   {p:'Forcing hyperpolarisation reduces growths without gene editing',st:'reported in frog tadpoles (2013)',ag:'no change after a confirmed voltage shift',k:'single'},
   {p:'Cells away from the site can suppress a growth',st:'reported in frog tadpoles (2014)',ag:'only local manipulations ever working',k:'single'},
   {p:'The same holds in mammals',st:'no independent test this course could cite',ag:'careful mammalian work finding no effect',k:'frame'}];
  let out=heading('Four predictions, and what would weigh against them');
  P5.forEach((q,i)=>{const y=62+i*48,on=i===s.k;
   out+=R(36,y,528,42,on?C.purplep:'#f6f7f9',on?C.purple:C.line,8)+TF(300,y+26,q.p,13,C.ink)});
  const q=P5[s.k];
  out+=R(36,262,528,78,'#fff',C.grid,8)+L5_badge(48,270,q.k);
  out+=TF(48,310,'Status: '+q.st,13,C.ink,'start')+TF(48,332,'Would weigh against it: '+q.ag,13,C.muted,'start');
  out+=L5_note(L5_NM,362);
  return {svg:out,phase:s.k===3?'Whether any of this carries to mammals is the open question. The course found no independent mammalian test to cite; that is not the same as a failed test, and it is not a reason to assume either answer.':
   `${q.p}. Status: ${q.st}. It would be weakened by ${q.ag}.`};
 }});
