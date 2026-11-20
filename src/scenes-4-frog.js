/* ===================== Levin Lab In Motion · Era 4 · Frog faces, eyes and tails ===================== */
// The electric face, eyes outside the head, tails that regrow, a sodium pulse, "Picasso" tadpoles and a frog leg.
// Every picture is a pure function of state, frame and X. Every voltage, count, fraction and distance on screen is
// computed here from a toy model: a chord-conductance cell (Nernst potentials, conductances and a pump current),
// sheets of such cells coupled by gap junctions, a toy competence rule for regrowth over seeded tadpoles, a sodium
// balance, and toy rules for organs moving in a tadpole face. The only literals shown as facts are published values
// (dates, stages, durations and concentrations used in experiments), and each carries a research line.
// Toy parameters (conductances, thresholds, rates) are model choices, labelled as such, never presented as data.

/* ---- shared helpers ---- */
const L4_RTF=(c=20)=>8.314462*(273.15+c)/96485.33*1000;             // RT/F in mV; frog embryos are raised near 20 °C
const L4_nernst=(out,inn,z=1)=>L4_RTF()/z*Math.log(out/inn);
// Illustrative ion concentrations (mM, outside and inside) of the kind given for a generic vertebrate cell in
// physiology textbooks. They are model inputs, not measurements from frog embryos.
const L4_ION={Ko:5,Ki:140,Nao:145,Nai:15,Clo:110,Cli:10};
const L4_EK=L4_nernst(L4_ION.Ko,L4_ION.Ki),L4_ENA=L4_nernst(L4_ION.Nao,L4_ION.Nai),L4_ECL=L4_nernst(L4_ION.Clo,L4_ION.Cli,-1);
// Chord-conductance voltage (mV): each conductance pulls towards its ion's Nernst potential; an electrogenic pump
// (outward current ip, in conductance × mV units) pushes the voltage more negative.
const L4_cell=(gK,gNa,gCl,ip=0)=>(gK*L4_EK+gNa*L4_ENA+gCl*L4_ECL-ip)/(gK+gNa+gCl);
// Baseline toy conductances for an embryonic or regenerating cell (relative units, model choices).
const L4_G={K:1,Na:.4,Cl:.1};
const L4_mv=(v,d=0)=>{const r=Math.round(v*Math.pow(10,d))/Math.pow(10,d);return (r<0?'−':r>0?'+':'')+Math.abs(r).toFixed(d)+' mV'};
const L4_n=(v,d=0)=>{const r=Math.round(v*Math.pow(10,d))/Math.pow(10,d);return (r<0?'−':'')+Math.abs(r).toFixed(d)};
const L4_pct=v=>Math.round(v*100)+'%';
const L4_note=(s,y=370)=>TF(300,y,s,13,C.muted);
const L4_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function L4_tile(x,y,w,label,value,col=C.blue){return R(x,y,w,46,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+38,value,15,col)}
const L4_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const L4_rng=n=>rng(L4_mix(n));
function L4_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function L4_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// The six evidence labels, each with its own colour pair. The badge is drawn beside the claim it applies to.
const L4_LABELS={rep:['Replicated finding',C.green,C.greenp],single:['Single-lab finding',C.blue,C.pale],frame:['Framework or hypothesis',C.purple,C.purplep],
 spec:['Speculation',C.amber,C.amberp],debate:['Criticism and debate',C.coral,C.coralp],model:['Simplified model',C.dark,'#eef2f4']};
const L4_badgeW=k=>Math.round(L4_LABELS[k][0].length*7.1+18);
function L4_badge(x,y,k,anchor='start'){const [lab,ink,fill]=L4_LABELS[k],w=L4_badgeW(k),x0=anchor==='end'?x-w:anchor==='middle'?x-w/2:x;
 return R(x0,y,w,20,fill,ink,10,k==='model'?'stroke-dasharray="4 3" stroke-width="1.4"':'stroke-width="1.4"')+TBF(x0+w/2,y+14.5,lab,12.5,ink)}
function L4_badges(x,y,keys){let out='',cx=x;for(const k of keys){out+=L4_badge(cx,y,k);cx+=L4_badgeW(k)+8}return out}
// Voltage colour: blue for more negative (hyperpolarised), coral for less negative; always paired with numbers.
function L4_vcol(v,lo=-70,hi=-10){const u=clamp((v-lo)/(hi-lo),0,1);const a=[23,114,183],b=[196,82,56],w=[246,246,246];
 const m=u<.5?a.map((q,i)=>Math.round(lerp(q,w[i],u*2))):w.map((q,i)=>Math.round(lerp(q,b[i],(u-.5)*2)));return `rgb(${m.join(',')})`}
// A voltage colour bar with labelled ends (colour is never the only code).
function L4_vbar(x,y,w,lo,hi,label='membrane voltage'){let out='';const n=24;for(let i=0;i<n;i++)out+=R(x+i*w/n,y,w/n+.5,12,L4_vcol(lo+(hi-lo)*(i+.5)/n,lo,hi),'none',0);
 return out+R(x,y,w,12,'none',C.line,2)+TF(x,y+28,L4_mv(lo),13,C.muted,'start')+TF(x+w,y+28,L4_mv(hi),13,C.muted,'end')+TF(x+w/2,y+28,label,13,C.muted)}
// Steady state of a W×H sheet by Gauss–Seidel. Each cell k has membrane conductance gm[k] to its own resting
// voltage E[k]; neighbours are joined by gap-junction conductance gj. Returns the voltages.
function L4_sheet(W,H,E,gm,gj,iters=400){const n=W*H,V=E.slice();
 for(let it=0;it<iters;it++){let dmax=0;
  for(let k=0;k<n;k++){const x=k%W,y=(k/W)|0;let num=gm[k]*E[k],den=gm[k];
   for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=W||yy>=H)continue;num+=gj*V[yy*W+xx];den+=gj}
   const nv=num/den;dmax=Math.max(dmax,Math.abs(nv-V[k]));V[k]=nv}
  if(dmax<1e-6)break}
 return V}
// A tadpole outline in side view (schematic), head to the left at (x,y), length len.
function L4_tadpole(x,y,len,o={}){
 const h=len*.2,body=`M${fmt(x)} ${fmt(y)} C${fmt(x)} ${fmt(y-h)} ${fmt(x+len*.38)} ${fmt(y-h*1.05)} ${fmt(x+len*.42)} ${fmt(y-h*.35)} L${fmt(x+len*.42)} ${fmt(y+h*.35)} C${fmt(x+len*.38)} ${fmt(y+h*1.05)} ${fmt(x)} ${fmt(y+h)} ${fmt(x)} ${fmt(y)}Z`;
 const tl=o.tail===undefined?1:o.tail,tx=x+len*.42,te=tx+len*.58*tl;
 let out='';
 if(tl>0)out+=`<path d="M${fmt(tx)} ${fmt(y-h*.5)} Q${fmt(lerp(tx,te,.5))} ${fmt(y-h*.75)} ${fmt(te)} ${fmt(y)} Q${fmt(lerp(tx,te,.5))} ${fmt(y+h*.75)} ${fmt(tx)} ${fmt(y+h*.5)}Z" fill="${o.tailFill||C.greenp}" stroke="${o.tailStroke||C.green}" stroke-width="2"/>`;
 out+=`<path d="${body}" fill="${o.fill||'#eef3e9'}" stroke="${o.stroke||C.green}" stroke-width="2"/>`;
 if(o.eye!==false)out+=Ci(x+len*.1,y-h*.25,len*.025,C.dark);
 return out;
}

/* ===================== Lesson: electric-face ===================== */
// A schematic front view of the frog embryo's head region as a grid of cells. Each cell's voltage comes from
// L4_cell with a toy proton-pump current set by a map that changes through the three phases the paper describes
// (a wave, a face-like pattern, local spots), plus extra sodium conductance in the neural folds.
const L4_FW=19,L4_FH=15,L4_FCX=165,L4_FCY=200,L4_FRX=140,L4_FRY=128;
const L4_g2=(u,v,cu,cv,su,sv)=>Math.exp(-(((u-cu)/su)**2+((v-cv)/sv)**2));
// Later face structures (schematic positions in head coordinates u,v from −1 to 1; v grows downwards).
const L4_FACE=[{k:'eyeL',name:'eye',u:-.5,v:-.12,ru:.2,rv:.2},{k:'eyeR',name:'eye',u:.5,v:-.12,ru:.2,rv:.2},
 {k:'noseL',name:'nostril',u:-.2,v:.16,ru:.09,rv:.09},{k:'noseR',name:'nostril',u:.2,v:.16,ru:.09,rv:.09},{k:'mouth',name:'mouth',u:0,v:.48,ru:.32,rv:.12}];
const L4_inFace=(u,v,f)=>((u-f.u)/f.ru)**2+((v-f.v)/f.rv)**2<=1;
// Phase weights over developmental time t in [0,1]: I wave (to .3), II face pattern (.3–.7), III local spots (.7–1).
function L4_phaseW(t){const a=smooth((t-.26)/.08),b=smooth((t-.66)/.08);return [1-a,a*(1-b),b]}
function L4_pumpMap(u,v,t){
 const [w1,w2,w3]=L4_phaseW(t);
 const s=-1.3+2.6*clamp(t/.32,0,1),wave=Math.exp(-(((v-s)/.28)**2));
 let face=.35*Math.exp(-((u/.18)**2))*(v>-.4?1:0)+.3*(Math.abs(u)>.72?1:0); // midline and lateral ectoderm
 for(const f of L4_FACE)face=Math.max(face,L4_g2(u,v,f.u,f.v,f.ru*1.1,f.rv*1.1));
 const tt=clamp((t-.7)/.3,0,1),amp=Math.sin(Math.PI*tt),rad=.6+.8*tt;let spots=0;
 for(const f of L4_FACE)if(f.k!=='mouth')spots=Math.max(spots,amp*L4_g2(u,v,f.u,f.v,f.ru*rad,f.rv*rad));
 return w1*wave+w2*face+w3*spots;
}
const L4_foldMap=(u,v,t)=>L4_phaseW(t)[1]*Math.exp(-(((v+.62)/.12)**2))*(Math.abs(u)<.85?1:0); // depolarised neural folds
// The grid of cells inside the head outline: returns [{i,j,u,v,x,y,V}] for pump level `pump` (1 = normal).
function L4_faceCells(t,pump=1,shift=[0,0],scale=1){
 const cells=[],cw=2*L4_FRX/L4_FW,ch=2*L4_FRY/L4_FH;
 for(let j=0;j<L4_FH;j++)for(let i=0;i<L4_FW;i++){
  const u=(i+.5)/L4_FW*2-1,v=(j+.5)/L4_FH*2-1;if(u*u+v*v>1)continue;
  const pu=(u-shift[0])/scale,pv=(v-shift[1])/scale;
  const ip=26*pump*L4_pumpMap(pu,pv,t),gNa=L4_G.Na+.7*L4_foldMap(pu,pv,t);
  cells.push({i,j,u,v,x:L4_FCX-L4_FRX+i*cw,y:L4_FCY-L4_FRY+j*ch,w:cw,h:ch,V:L4_cell(L4_G.K,gNa,L4_G.Cl,ip)});
 }
 return cells;
}
const L4_HYP=-52; // toy cut-off: cells more negative than this count as "hyperpolarised" in the toy
function L4_drawCells(X,cells,act,lo=-64,hi=-14){let out='';
 for(const c of cells){const inner=R(c.x+.5,c.y+.5,c.w-1,c.h-1,L4_vcol(c.V,lo,hi),'none',2)+(c.V<L4_HYP?Ci(c.x+c.w/2,c.y+c.h/2,1.6,'#fff'):'');
  out+=act?hit(X,act,c.i+','+c.j,`Cell ${c.i+1},${c.j+1}: ${L4_mv(c.V)}`,inner):inner}
 return out+`<ellipse cx="${L4_FCX}" cy="${L4_FCY}" rx="${L4_FRX}" ry="${L4_FRY}" fill="none" stroke="${C.dark}" stroke-width="2"/>`}
function L4_drawFace(col=C.ink,dash=true){let out='';const d=dash?'stroke-dasharray="5 4"':'';
 for(const f of L4_FACE)out+=`<ellipse cx="${fmt(L4_FCX+f.u*L4_FRX)}" cy="${fmt(L4_FCY+f.v*L4_FRY)}" rx="${fmt(f.ru*L4_FRX)}" ry="${fmt(f.rv*L4_FRY)}" fill="none" stroke="${col}" stroke-width="2" ${d}/>`;
 return out}
const L4_PHASES=['I · a wave crosses the embryo','II · a face-like pattern','III · local spots grow and fade'];
const L4_phaseOf=t=>{const w=L4_phaseW(t);return w.indexOf(Math.max(...w))};

SCENE({id:'electric-face',name:'The electric face',tag:'Single-lab finding · Vandenberg, Morrie & Adams, 2011',
 definition:'In 2009 Dany Spencer Adams was filming frog (Xenopus laevis) embryos stained with a voltage-reporting dye. The time-lapse showed regions of more and less polarised cells on the embryo’s surface. Laura Vandenberg, Ryan Morrie and Adams described three phases: a wave of hyperpolarisation across the embryo, then patterns that matched the shape changes and gene-expression domains of the developing face, then local spots that formed, grew and disappeared. This was reported by one lab.',
 example:'The video was widely called the “electric face”. Nothing glows by itself: the dye’s signal is brighter or dimmer where the voltage differs. The drawing here is a schematic made for this course, not an image of the published data.',
 desc:'A schematic front view of the embryo’s head region drawn as a grid of model cells coloured by computed membrane voltage, moving through three phases, with dashed outlines of the eyes, nostrils and mouth that form later.',
 research:['Vandenberg, Morrie & Adams (2011). V-ATPase-dependent ectodermal voltage and pH regionalization are required for craniofacial morphogenesis. Developmental Dynamics 240, 1889–1904.','Tufts University news release (July 2011): the time-lapse was made by Adams in September 2009.'],
 dur:14,hint:'Slide through developmental time, show or hide the later face, and tap any cell to read its computed voltage.',
 init:()=>({t:.5,face:1,pick:'9,5'}),
 watch:p=>({t:p,face:p>.35?1:0,pick:'9,5'}),
 ui:[{range:'t',label:'Developmental time',min:0,max:100,get:s=>Math.round(s.t*100),act:'t',show:v=>v+'%'},{choose:[['1','Show later face'],['0','Hide it']],label:'Outlines',get:s=>String(s.face),act:'face'}],
 on:{t(s,v){s.t=clamp(+v/100,0,1);return 'keep'},face(s,v){s.face=v==='1'?1:0;return 'keep'},cell(s,a){s.pick=String(a);return 'keep'}},
 draw(s,f,X){
  const cells=L4_faceCells(s.t),ph=L4_phaseOf(s.t);
  let out=heading('Voltage across the embryo’s face region');
  out+=L4_drawCells(X,cells,'cell')+(s.face?L4_drawFace():'');
  const pk=cells.find(c=>c.i+','+c.j===s.pick)||cells[0];
  out+=R(pk.x-1,pk.y-1,pk.w+2,pk.h+2,'none',C.ink,2);
  const vs=cells.map(c=>c.V),hyp=cells.filter(c=>c.V<L4_HYP).length;
  const x0=330;
  out+=L4_badge(x0,52,'single')+L4_badge(x0,78,'model');
  out+=TBF(x0,124,'Phase '+L4_PHASES[ph],13,C.ink,'start');
  ['wave','face pattern','local spots'].forEach((lab,i)=>{const w=L4_phaseW(s.t)[i];out+=R(x0,138+i*22,150,14,'#fff',C.grid,3)+R(x0,138+i*22,150*w,14,i===ph?C.blue:C.line,'none',3)+TF(x0+158,150+i*22,lab,13,C.muted,'start')});
  out+=L4_tile(x0,214,120,'Selected cell',L4_mv(pk.V),C.ink)+L4_tile(x0+130,214,120,'Hyperpolarised',hyp+' of '+cells.length,C.blue);
  out+=TF(x0,280,`Range ${L4_mv(Math.min(...vs))} to ${L4_mv(Math.max(...vs))}`,13,C.muted,'start');
  out+=TF(x0,298,'White dots: cells below '+L4_mv(L4_HYP)+' (toy cut-off).',13,C.muted,'start');
  out+=L4_vbar(40,332,250,-64,-14);
  out+=TF(x0,322,'Schematic front view, not the',13,C.muted,'start')+TF(x0,340,'published images.',13,C.muted,'start');
  const say=ph===0?'Phase I: in the paper a wave of hyperpolarisation crosses the embryo. In this toy, a band of higher pump activity sweeps from top to bottom, and each cell’s voltage is computed from it.':
   ph===1?'Phase II: patterns appear that match the shape changes and gene-expression domains of the developing face. In the toy, cells under the later eyes, nostrils and mouth are hyperpolarised and the neural folds along the top are depolarised.':
   'Phase III: local regions of hyperpolarisation form, expand and disappear. The toy grows and fades spots at the eye and nostril positions.';
  return {svg:out,phase:say+` The selected cell sits at ${L4_mv(pk.V)}.`};
 }});

SCENE({id:'electric-face-align',name:'Does the pattern prefigure the face?',tag:'Simplified model · Single-lab finding: patterns overlap face domains',
 definition:'“Prefigures” is a claim about space and time: hyperpolarised regions appear where face structures later form, before those structures are visible. The paper, from one lab, reported that both hyperpolarised and depolarised regions overlapped domains of head-patterning genes, and that hyperpolarisation marked the future mouth opening. Here you slide a toy voltage map over the later face and the scene computes how well they line up.',
 example:'When the map is shifted, few hyperpolarised cells fall inside the later structures. Aligned, most do. A good match says the two patterns share positions; on its own it does not show that voltage causes the face. The next scene asks that question.',
 desc:'The toy phase II voltage map, which the learner can shift and scale, laid over dashed outlines of the later eyes, nostrils and mouth, with computed overlap scores.',
 research:['Vandenberg, Morrie & Adams (2011). Developmental Dynamics 240, 1889–1904 (hyperpolarised and depolarised regions overlapping domains of head-patterning genes).'],
 dur:12,hint:'Move the voltage map left, right, up or down and change its size until the overlap scores are highest.',
 init:()=>({dx:.3,dy:-.25,sc:1.2}),
 watch:p=>{const u=smooth(p*1.4);return {dx:lerp(.3,0,u),dy:lerp(-.25,0,u),sc:lerp(1.2,1,u)}},
 ui:[{range:'dx',label:'Left–right',min:-40,max:40,get:s=>Math.round(s.dx*100),act:'dx'},{range:'dy',label:'Up–down',min:-40,max:40,get:s=>Math.round(s.dy*100),act:'dy'},{range:'sc',label:'Size',min:70,max:140,get:s=>Math.round(s.sc*100),act:'sc',show:v=>v+'%'}],
 on:{dx(s,v){s.dx=clamp(+v/100,-.4,.4)},dy(s,v){s.dy=clamp(+v/100,-.4,.4)},sc(s,v){s.sc=clamp(+v/100,.7,1.4)}},
 draw(s){
  const cells=L4_faceCells(.5,1,[s.dx,s.dy],s.sc);
  const isStruct=c=>L4_FACE.some(f=>L4_inFace(c.u,c.v,f));
  const hyp=cells.filter(c=>c.V<L4_HYP),inS=cells.filter(isStruct),hit1=hyp.filter(isStruct).length,cov=inS.filter(c=>c.V<L4_HYP).length;
  const prec=hyp.length?hit1/hyp.length:0,rec=inS.length?cov/inS.length:0;
  let out=heading(prec*rec>.5?'Aligned: the map marks the later face':'Slide the voltage map over the later face');
  out+=L4_drawCells(null,cells)+L4_drawFace(C.ink,true);
  const x0=330;
  out+=L4_badge(x0,52,'model')+L4_badge(x0,78,'single');
  out+=L4_tile(x0,116,250,'Hyperpolarised cells inside a structure',`${hit1} of ${hyp.length} · ${L4_pct(prec)}`,C.blue);
  out+=L4_tile(x0,172,250,'Structure cells that are hyperpolarised',`${cov} of ${inS.length} · ${L4_pct(rec)}`,C.green);
  out+=R(x0,230,250,10,'#fff',C.grid,4)+R(x0,230,250*prec*rec,10,C.blue,'none',4)+TF(x0,256,'Match (product of the two): '+L4_pct(prec*rec),13,C.ink,'start');
  out+=TF(x0,284,'Dashed: later eyes, nostrils, mouth.',13,C.muted,'start')+TF(x0,302,'White dots: below '+L4_mv(L4_HYP)+'.',13,C.muted,'start');
  out+=TF(x0,330,'A match shows shared positions,',13,C.muted,'start')+TF(x0,348,'not cause.',13,C.muted,'start');
  out+=L4_vbar(40,332,250,-64,-14);
  return {svg:out,phase:`${hit1} of ${hyp.length} hyperpolarised cells fall inside a later structure, and ${cov} of ${inS.length} structure cells are hyperpolarised. ${prec*rec>.5?'The map lines up with the face, which is what “prefigure” means here.':'Shift or resize the map to improve the match.'}`};
 }});

SCENE({id:'electric-face-block',name:'Turning the pump down',tag:'Single-lab finding · Blocking H⁺ flux changes the face',
 definition:'To ask whether the pattern matters, the authors disrupted hydrogen-ion (H⁺) transport by the V-ATPase proton pump, for example with a mutant form of one of its subunits. They reported that this altered the voltage pattern on the ectoderm, changed the expression of genes used in face development (including sox9, pax8 and pax6), and gave abnormal craniofacial structures. This is evidence of necessity, reported by one lab.',
 example:'In the toy, lowering the pump flattens the pattern: the computed difference between the face domains and their surroundings shrinks, and below a toy threshold the drawn face is irregular. The threshold is a choice made for the toy; the paper reports the direction of the effect, not a threshold.',
 desc:'The toy phase II voltage map at a chosen pump level, a computed contrast between face domains and the rest, and a schematic tadpole face that is regular or irregular depending on the toy threshold.',
 research:['Vandenberg, Morrie & Adams (2011). Developmental Dynamics 240, 1889–1904 (H⁺ flux disruption altered Vmem patterns, sox9, pax8 and pax6 expression, and craniofacial morphology).','Adams, Tseng & Levin (2013). Biology Open 2, 306–313: a light-driven H⁺ pump rescued craniofacial abnormalities caused by blocking endogenous H⁺ flux.'],
 dur:12,hint:'Lower the pump activity and watch the computed contrast and the toy face.',
 init:()=>({pump:.3}),
 watch:p=>({pump:clamp(1-p*1.15,0,1)}),
 ui:[{range:'pump',label:'Pump activity',min:0,max:100,get:s=>Math.round(s.pump*100),act:'pump',show:v=>v+'%'}],
 on:{pump(s,v){s.pump=clamp(+v/100,0,1)}},
 draw(s){
  const cells=L4_faceCells(.5,s.pump);
  const isStruct=c=>L4_FACE.some(f=>L4_inFace(c.u,c.v,f));
  const a=cells.filter(isStruct),b=cells.filter(c=>!isStruct(c));
  const mean=x=>sum(x.map(c=>c.V))/Math.max(1,x.length),con=mean(b)-mean(a),THR=6,ok=con>=THR;
  let out=heading(ok?'Enough contrast: the toy face forms':'Too little contrast: the toy face is irregular');
  out+=L4_drawCells(null,cells)+L4_drawFace(C.ink,true);
  const x0=330;
  out+=L4_badge(x0,50,'single')+L4_badge(x0,76,'model');
  out+=L4_tile(x0,108,120,'Face domains',L4_mv(mean(a),1),C.blue)+L4_tile(x0+130,108,120,'Elsewhere',L4_mv(mean(b),1),C.coral);
  out+=TF(x0,176,`Contrast ${L4_n(con,1)} mV (toy threshold ${THR} mV)`,13,C.ink,'start');
  // schematic tadpole face (front view)
  const fx=455,fy=262;out+=`<ellipse cx="${fx}" cy="${fy}" rx="74" ry="60" fill="#eef3e9" stroke="${C.green}" stroke-width="2"/>`;
  const j=ok?0:clamp((THR-con)/THR,0,1);
  out+=Ci(fx-36-10*j,fy-14+8*j,12-4*j,C.dark)+Ci(fx+36+4*j,fy-14-6*j,12-6*j,C.dark);
  out+=P(`M${fx-30} ${fy+26} Q${fx} ${fy+38+12*j} ${fx+30-14*j} ${fy+24+10*j}`,C.dark,3);
  out+=TF(fx,342,ok?'schematic: regular':'schematic: irregular',13,ok?C.green:C.coral);
  out+=L4_vbar(40,332,250,-64,-14);
  return {svg:out,phase:`At ${Math.round(s.pump*100)}% pump activity the face domains sit at ${L4_mv(mean(a),1)} and the rest at ${L4_mv(mean(b),1)}: a contrast of ${L4_n(con,1)} mV. ${ok?'Above the toy threshold, the toy face is drawn regular.':'Below the toy threshold, the toy face is drawn irregular, echoing the reported effect of blocking H⁺ flux.'}`};
 }});

/* ===================== Lesson: induced-eyes ===================== */
// Toy eye-inducing window. The paper reports that eyes were induced only within a narrow range of hyperpolarisation;
// its values are not reproduced here, so the band drawn is a toy band, labelled as such.
const L4_WIN=[-58,-50];
const L4_inWin=v=>v>=L4_WIN[0]&&v<=L4_WIN[1];
const L4_eyeV=(k,na)=>L4_cell(L4_G.K+k,L4_G.Na+na,L4_G.Cl);
// 40 model embryos: the amount of channel each receives varies from embryo to embryo (seeded, log-normal).
function L4_eyeRuns(k,na,n=40){const r=L4_rng(4012),out=[];for(let i=0;i<n;i++){const kk=k*Math.exp(.45*L4_gauss(r)),nn=na*Math.exp(.45*L4_gauss(r));const v=L4_eyeV(kk,nn);out.push({v,eye:L4_inWin(v)})}return out}
function L4_vaxis(x0,y0,w,lo,hi){const X=v=>x0+(v-lo)/(hi-lo)*w;let out=L(x0,y0,x0+w,y0,C.line,2);
 for(let v=lo;v<=hi;v+=10)out+=L(X(v),y0,X(v),y0+5,C.line,1.4)+TF(X(v),y0+20,L4_mv(v),13,C.muted);return {svg:out,X}}

SCENE({id:'induced-eyes',name:'Eyes outside the head',tag:'Single-lab finding · Pai, Aw, Shomrat, Lemire & Levin, 2012',
 definition:'Vaibhav Pai and colleagues in Michael Levin’s lab changed the membrane voltage of frog embryo cells by injecting RNA for ion channels. Cells far from the head, including on the gut, then formed eye-like structures, which the paper describes as resembling normal eyes in form and tissue structure. Eyes formed only within a narrow range of hyperpolarisation, and the voltage signal acted upstream of eye-field genes such as Rx1 and Pax6. These results come from one lab and have not been widely tested elsewhere.',
 example:'In the toy, adding a potassium channel makes a cell more negative and adding a sodium leak makes it less negative. Only cells whose computed voltage lands inside the toy window start an eye. Because each embryo receives a slightly different dose, only some of the 40 model embryos land in the window.',
 desc:'A voltage axis with a shaded toy window, the computed voltage of a model cell, and 40 model embryos plotted as dots, those inside the window marked as forming an eye; a tadpole schematic shows an eye-like structure on the gut when induced.',
 research:['Pai, Aw, Shomrat, Lemire & Levin (2012). Transmembrane voltage potential controls embryonic eye patterning in Xenopus laevis. Development 139, 313–323.','The window drawn is a toy band, not the paper’s values.'],
 dur:12,hint:'Change the added potassium channel and sodium leak. Watch the computed voltage, and count how many model embryos fall inside the window.',
 init:()=>({k:.5,na:0}),
 watch:p=>({k:lerp(0,1.6,p),na:0}),
 ui:[{range:'k',label:'Added K⁺ channel',min:0,max:200,get:s=>Math.round(s.k*100),act:'k',show:v=>(v/100).toFixed(2)},{range:'na',label:'Added Na⁺ leak',min:0,max:100,get:s=>Math.round(s.na*100),act:'na',show:v=>(v/100).toFixed(2)}],
 on:{k(s,v){s.k=clamp(+v/100,0,2)},na(s,v){s.na=clamp(+v/100,0,1)}},
 draw(s){
  const v=L4_eyeV(s.k,s.na),runs=L4_eyeRuns(s.k,s.na),ne=runs.filter(r=>r.eye).length,lo=-75,hi=-25;
  let out=heading(L4_inWin(v)?'Inside the window: the toy cell starts an eye':'Outside the window: no eye in the toy');
  const ax=L4_vaxis(50,190,500,lo,hi);
  out+=R(ax.X(L4_WIN[0]),96,ax.X(L4_WIN[1])-ax.X(L4_WIN[0]),94,C.greenp,'none',4)+TF((ax.X(L4_WIN[0])+ax.X(L4_WIN[1]))/2,90,'toy window',13,C.green);
  runs.forEach((r,i)=>{const x=ax.X(clamp(r.v,lo,hi));out+=Ci(x,108+(i%8)*10,4,r.eye?C.green:'#fff',r.eye?C.green:C.line)});
  out+=ax.svg+L(ax.X(clamp(v,lo,hi)),96,ax.X(clamp(v,lo,hi)),190,C.ink,3)+TBF(ax.X(clamp(v,lo,hi)),232,'cell: '+L4_mv(v,1),13,C.ink);
  out+=TF(50,232,'more negative',13,C.blue,'start')+TF(550,232,'less negative',13,C.coral,'end');
  out+=L4_badge(50,50,'single')+L4_badge(50+L4_badgeW('single')+8,50,'model');
  out+=L4_tile(50,256,150,'Embryos with eye',ne+' of '+runs.length,C.green)+L4_tile(210,256,110,'Nernst K⁺',L4_mv(L4_EK),C.blue)+L4_tile(330,256,110,'Nernst Na⁺',L4_mv(L4_ENA),C.coral);
  out+=L4_tadpole(460,280,120,{})+(ne>0?Ci(512,288,6,C.dark,'#fff')+TF(512,326,'eye on gut',13,C.dark):TF(512,326,'no ectopic eye',13,C.muted));
  out+=L4_note('Toy cell: K⁺, Na⁺ and Cl⁻ conductances at 20 °C. The window is a toy band.',356);
  return {svg:out,phase:`The model cell sits at ${L4_mv(v,1)}. ${L4_inWin(v)?'That is inside the toy window.':'That is outside the toy window.'} Across 40 model embryos with varying doses, ${ne} land inside it. In the paper, too, only some injected embryos formed ectopic eyes.`};
 }});

// A sheet of cells with a central injected patch; neighbours are joined by gap junctions.
const L4_RW=17,L4_RH=9;
function L4_recruit(rad,gj){const E=[],gm=[],lab=[];
 for(let k=0;k<L4_RW*L4_RH;k++){const x=k%L4_RW-(L4_RW-1)/2,y=((k/L4_RW)|0)-(L4_RH-1)/2,inP=Math.hypot(x,y)<=rad+.01;lab.push(inP);
  const gK=L4_G.K+(inP?2:0);E.push(L4_cell(gK,L4_G.Na,L4_G.Cl));gm.push(gK+L4_G.Na+L4_G.Cl)}
 const V=L4_sheet(L4_RW,L4_RH,E,gm,gj);return {V,lab}}
SCENE({id:'induced-eyes-recruit',name:'Recruiting the neighbours',tag:'Simplified model · Single-lab finding: ectopic eyes include uninjected cells',
 definition:'The injected cells were marked with a tracer, so the authors could see which cells in an ectopic eye had received the channel. They reported, in this single-lab study, that only some of the cells in an induced eye or lens carried the tracer: the injected cells drew uninjected neighbours into the structure. One way to picture this is with gap junctions, which share voltage between neighbours.',
 example:'In the toy, the injected patch (outlined) carries a strong potassium channel. On its own it would be too negative for the window. Coupling pulls it towards its neighbours and pulls them towards it, so a ring of cells, some injected and some not, lands inside the toy window. This is a cartoon of one possible mechanism; the paper does not claim that this toy is how recruitment works.',
 desc:'A sheet of model cells coloured by computed voltage, with the injected patch outlined, cells inside the toy window marked as eye cells, and counts of injected and uninjected eye cells.',
 research:['Pai, Aw, Shomrat, Lemire & Levin (2012). Development 139, 313–323 (lineage tracing: ectopic eyes contained cells that had not received the channel).'],
 dur:12,hint:'Change the size of the injected patch and the gap-junction coupling. Count the eye cells that were never injected.',
 init:()=>({rad:1,gj:1}),
 watch:p=>({rad:1,gj:lerp(0,3,p)}),
 ui:[{range:'rad',label:'Patch radius',min:0,max:3,get:s=>s.rad,act:'rad',show:v=>v+(v==1?' cell':' cells')},{range:'gj',label:'Coupling',min:0,max:300,get:s=>Math.round(s.gj*100),act:'gj',show:v=>(v/100).toFixed(2)}],
 on:{rad(s,v){s.rad=clamp(Math.round(+v),0,3)},gj(s,v){s.gj=clamp(+v/100,0,3)}},
 draw(s){
  const {V,lab}=L4_recruit(s.rad,s.gj),cw=24,x0=300-L4_RW*cw/2,y0=56;
  let eyeLab=0,eyeUn=0;let out=heading('An injected patch and its coupled neighbours');
  V.forEach((v,k)=>{const x=x0+(k%L4_RW)*cw,y=y0+((k/L4_RW)|0)*cw,e=L4_inWin(v);if(e){if(lab[k])eyeLab++;else eyeUn++}
   out+=R(x+1,y+1,cw-2,cw-2,L4_vcol(v,-70,-40),lab[k]?C.ink:'none',4)+(e?Ci(x+cw/2,y+cw/2,5,C.green,'#fff'):'')});
  const tot=eyeLab+eyeUn,vc=V[((L4_RH-1)/2)*L4_RW+(L4_RW-1)/2];
  out+=L4_badge(40,y0+L4_RH*cw+8,'model')+L4_badge(40+L4_badgeW('model')+8,y0+L4_RH*cw+8,'single');
  out+=L4_tile(40,y0+L4_RH*cw+36,120,'Eye cells',String(tot),C.green)+L4_tile(170,y0+L4_RH*cw+36,120,'Never injected',tot?`${eyeUn} · ${L4_pct(eyeUn/tot)}`:'0',C.purple)+L4_tile(300,y0+L4_RH*cw+36,120,'Patch centre',L4_mv(vc),C.blue);
  out+=L4_vbar(432,y0+L4_RH*cw+42,128,-70,-40,'');
  out+=TF(560,y0+L4_RH*cw+22,'green dot: in toy window',13,C.green,'end');
  return {svg:out,phase:`${tot} cells land in the toy window; ${eyeUn} of them were never injected. ${s.gj===0?'With no coupling the patch sits alone at '+L4_mv(vc)+', too negative for the window, and its neighbours are unchanged.':'Coupling shares voltage, so the patch and its neighbours meet in between.'}`};
 }});

const L4_SEE={spine:{lab:'Nerve reaches the spinal cord',res:'Some of these tadpoles learned to tell the lights apart.',ok:1},
 gut:{lab:'Nerve reaches the gut',res:'These tadpoles did not learn the task.',ok:0},
 none:{lab:'No eyes at all',res:'Eyeless controls did not learn the task.',ok:0}};
function L4_seeFrames(s){return [
 {k:0,say:'Eye primordia, marked with a fluorescent protein, were moved from donor embryos to the back of the body of host embryos.'},
 {k:1,say:'The host’s own eyes were removed, so the only eye was the grafted one, far from the brain.'},
 {k:2,say:`The grafted eye’s nerve grew wherever it could. ${L4_SEE[s.wire].lab}. None connected to the brain.`},
 {k:3,say:'Tadpoles were trained in an automated arena: one coloured light was paired with a mild shock, the other was not.'},
 {k:4,say:L4_SEE[s.wire].res+' This was reported by one lab, in surgically grafted eyes rather than voltage-induced ones.'}]}
SCENE({id:'induced-eyes-see',name:'Can an eye on the tail see?',tag:'Single-lab finding · Blackiston & Levin, 2013',
 definition:'Douglas Blackiston and Michael Levin grafted eye primordia onto the back of tadpoles whose own eyes were removed. The grafted eyes never connected to the brain; their nerves ran to the spinal cord, to the gut, or nowhere. In a light-and-shock training task, some tadpoles whose ectopic eye connected to the spinal cord learned to distinguish two colours of light; tadpoles whose eye nerve went to the gut did not, nor did eyeless controls. This is one lab’s result.',
 example:'These eyes were made by surgery, not by changing voltage. They are here because they ask the next question after “eyes outside the head”: can such an eye pass information to the brain by an unusual route?',
 desc:'A step-by-step schematic: a grafted eye on the tadpole’s tail, the route its nerve takes, the training arena, and the reported outcome for the chosen group.',
 research:['Blackiston & Levin (2013). Ectopic eyes outside the head in Xenopus tadpoles provide sensory data for light-mediated learning. Journal of Experimental Biology 216, 1031–1040.'],
 dur:12,hint:'Choose where the grafted eye’s nerve went, then step through the experiment.',
 init:()=>({wire:'spine'}),
 trace:s=>L4_seeFrames(s),
 ui:[{choose:[['spine','To spinal cord'],['gut','To gut'],['none','No eyes']],label:'Group',get:s=>s.wire,act:'wire'}],
 on:{wire(s,v){s.wire=L4_SEE[v]?v:'spine'}},
 draw(s,f,X){
  const k=f?f.k:0,w=s.wire;let out=heading(['Graft an eye to the body','Remove the head’s own eyes','Where does the nerve go?','Train with two colours','The reported result'][k]);
  out+=L4_badge(40,48,'single');
  const tx=70,ty=150;out+=L4_tadpole(tx,ty,300,{eye:k<1});
  if(k>=1)out+=TF(tx+30,ty-58,'own eyes removed',13,C.muted,'start');
  if(w!=='none'){out+=Ci(tx+190,ty-22,11,C.dark,C.green)+Ci(tx+193,ty-25,3,'#fff');out+=TF(tx+190,ty-44,'grafted eye',13,C.green)}
  // spinal cord and gut, schematic
  out+=L(tx+100,ty-14,tx+290,ty-6,C.line,3)+TF(tx+300,ty-2,'spinal cord',13,C.muted,'start');
  out+=`<ellipse cx="${tx+80}" cy="${ty+22}" rx="34" ry="14" fill="${C.amberp}" stroke="${C.amber}" stroke-width="1.5"/>`+TF(tx+80,ty+56,'gut',13,C.amber);
  if(k>=2&&w==='spine')out+=P(`M${tx+190} ${ty-12} Q${tx+186} ${ty-6} ${tx+180} ${ty-9}`,C.purple,3);
  if(k>=2&&w==='gut')out+=P(`M${tx+186} ${ty-14} Q${tx+150} ${ty+30} ${tx+112} ${ty+22}`,C.purple,3);
  if(k>=2)out+=TF(tx+150,ty+84,w==='none'?'no eye: control group':L4_SEE[w].lab,13,C.purple);
  if(k>=2)out+=TF(tx+150,ty+102,'no connection to the brain',13,C.muted);
  // arena
  const ax=440,ay=96;
  if(k>=3){out+=R(ax,ay,120,120,'#fff',C.line,6)+R(ax,ay,60,60,C.coralp,'none',4)+R(ax+60,ay+60,60,60,C.pale,'none',4)+TF(ax+30,ay+34,'red',13,C.coral)+TF(ax+90,ay+94,'blue',13,C.blue)+TF(ax+60,ay+140,'training arena',13,C.muted)}
  if(k>=4){const g=L4_SEE[w];out+=R(ax-20,ay+170,160,40,g.ok?C.greenp:'#f3f3f3',g.ok?C.green:C.line,8)+TBF(ax+60,ay+195,g.ok?'some learned':'did not learn',14,g.ok?C.green:C.muted)}
  out+=L4_note('Schematic. Reported outcomes; no numbers are drawn from the paper here.',356);
  return {svg:out,phase:f?f.say:''};
 }});

/* ===================== Lesson: tail-regeneration ===================== */
// Toy competence to regrow a tail by Nieuwkoop–Faber stage: high, except in the refractory stages 45–47
// reported by Beck, Christen & Slack (2003). Thirty seeded tadpoles are amputated at the chosen stage.
const L4_REF=[45,47];
function L4_comp(st,tr='none'){
 const dip=smooth((st-44.4)/.7)*(1-smooth((st-47.4)/.7)),base=.92;
 if(tr==='bmp')return {full:base-.25*dip,part:0};
 if(tr==='notch')return {full:base-.85*dip,part:.7*dip};
 return {full:base-.85*dip,part:0};
}
function L4_tailRuns(st,tr,n=30){const r=L4_rng(4031+Math.round(st*10)),c=L4_comp(st,tr),out=[];
 for(let i=0;i<n;i++){const x=r();out.push(x<c.full?'full':x<c.full+c.part?'part':'none')}return out}
const L4_TR={none:'no treatment',bmp:'BMP pathway on',notch:'Notch pathway on'};
SCENE({id:'tail-regeneration',name:'Tails that regrow',tag:'Replicated finding · The refractory period, Beck, Christen & Slack, 2003',
 definition:'Xenopus tadpoles regrow an amputated tail, with spinal cord, muscle and notochord, within about a week. Caroline Beck, Bea Christen and Jonathan Slack found a gap: tails cut between developmental stages 45 and 47 heal over but do not regrow. They called it the refractory period. Activating the BMP pathway restored regrowth of all tissues in that window; activating Notch restored spinal cord and notochord but not muscle. Tadpole tail regeneration and its refractory period have since been studied by several labs.',
 example:'Choose a stage and a treatment, and thirty model tadpoles are amputated. Inside the refractory window few regrow, unless a pathway is switched on. The competence curve is a toy chosen to echo the reported window; the counts come from seeded runs of that toy, not from the paper.',
 desc:'A toy competence curve against developmental stage with the refractory window shaded, a stage marker, and thirty schematic tadpoles showing full, partial or no regrowth after amputation.',
 research:['Beck, Christen & Slack (2003). Molecular pathways needed for regeneration of spinal cord and muscle in a vertebrate. Developmental Cell 5, 429–439.','Stages are Nieuwkoop–Faber stages of Xenopus laevis development.'],
 dur:14,hint:'Slide the stage at which the tails are cut, and switch on the BMP or Notch pathway, as in Beck and colleagues’ experiments.',
 init:()=>({st:46,tr:'none'}),
 watch:p=>({st:Math.round(lerp(40,50,clamp(p*1.25,0,1))*2)/2,tr:p>.85?'bmp':'none'}),
 ui:[{range:'st',label:'Stage at amputation',min:80,max:100,get:s=>Math.round(s.st*2),act:'st',show:v=>(v/2).toFixed(1)},{choose:[['none','No treatment'],['bmp','BMP on'],['notch','Notch on']],label:'Treatment',get:s=>s.tr,act:'tr'}],
 on:{st(s,v){s.st=clamp(+v/2,40,50)},tr(s,v){s.tr=L4_TR[v]?v:'none'}},
 draw(s){
  const runs=L4_tailRuns(s.st,s.tr),nf=runs.filter(x=>x==='full').length,np=runs.filter(x=>x==='part').length,refr=s.st>=L4_REF[0]&&s.st<=L4_REF[1];
  let out=heading(refr?`Stage ${fmt(s.st)}: inside the refractory period`:`Stage ${fmt(s.st)}: outside the refractory period`);
  const pl=L4_plot(60,62,230,120,[40,50],[0,1],{xt:[[40,'40'],[45,'45'],[47,'47'],[50,'50']],yt:[[0,'0'],[1,'1']],xl:'stage at amputation',yl:'toy competence'});
  out+=R(pl.X(45),62,pl.X(47)-pl.X(45),120,C.coralp,'none',0)+pl.svg;
  const pts=[];for(let x=40;x<=50.001;x+=.1)pts.push([pl.X(x),pl.Y(L4_comp(x,s.tr).full)]);out+=L4_poly(pts,C.blue,2.5);
  out+=L(pl.X(s.st),62,pl.X(s.st),182,C.ink,2)+TF(pl.X(46),150,'refractory',13,C.coral);
  out+=L4_badge(60,238,'rep')+L4_badge(60,264,'model');
  out+=L4_tile(60,292,110,'Full regrowth',nf+' of 30',C.green)+L4_tile(180,292,110,'Partial',np+' of 30',C.amber);
  runs.forEach((o,i)=>{const x=330+(i%5)*52,y=70+((i/5)|0)*46;out+=L4_tadpole(x,y,46,{tail:o==='full'?1:o==='part'?.6:.18,tailFill:o==='part'?C.amberp:C.greenp,tailStroke:o==='part'?C.amber:C.green})});
  out+=TF(460,358,L4_TR[s.tr]+' · toy runs, seeded',13,C.muted);
  return {svg:out,phase:`Cut at stage ${fmt(s.st)} with ${L4_TR[s.tr]}: ${nf} of 30 model tadpoles regrow a full tail${np?` and ${np} regrow spinal cord and notochord without muscle`:''}. ${refr?'In the reported refractory window tails heal over without regrowing unless a pathway is switched on.':'Outside the window most tails regrow.'}`};
 }});

// Toy bud voltage after amputation. A wound sodium leak decays; the V-ATPase pump ramps up from about 6 h in
// regeneration-competent tadpoles; in the refractory toy it does not. A yeast proton pump, if expressed, adds a
// pump current that does not depend on the stage or on the V-ATPase inhibitor.
function L4_bud(t,o){const leak=1.2*Math.exp(-t/6),ramp=smooth((t-6)/14);
 const va=(o.stage==='regen'?1:0)*(o.inhib?.1:1)*26*ramp,ye=o.yeast?24*smooth((t-2)/12):0,ar=o.light&&t<o.light?24:0;
 return L4_cell(L4_G.K,L4_G.Na+leak,L4_G.Cl,va+ye+ar)}
const L4_REG_THR=-52; // toy rule: a bud more negative than this at 24 h starts regrowth
SCENE({id:'tail-regeneration-pump',name:'A proton pump in the bud',tag:'Single-lab finding · Adams, Masi & Levin, 2007',
 definition:'Dany Spencer Adams, Alessio Masi and Michael Levin followed the voltage of the regeneration bud after tail amputation. The bud first depolarised, then by about 24 hours was repolarised by the V-ATPase proton pump. Blocking the V-ATPase stopped regrowth but not wound healing. In the refractory period the bud stayed more depolarised. Expressing a yeast proton pump that the inhibitor does not block restored regrowth in refractory-stage tadpoles and in tails with the V-ATPase blocked. The paper’s title calls these changes necessary and sufficient. This was reported by one lab.',
 example:'In the toy, the bud voltage is computed hour by hour from a fading wound leak and a pump current. A bud more negative than a toy threshold at 24 hours regrows. Switch the stage to refractory and the curve stays high; add the yeast pump and it comes down again.',
 desc:'A plot of the toy bud voltage over 48 hours after amputation, with a dashed toy threshold and a marker at 24 hours, for the chosen stage, inhibitor and yeast pump, and a tadpole that regrows or does not.',
 research:['Adams, Masi & Levin (2007). H⁺ pump-dependent changes in membrane voltage are an early mechanism necessary and sufficient to induce Xenopus tail regeneration. Development 134, 1323–1335.'],
 dur:14,hint:'Choose the stage, block the V-ATPase or not, and add the yeast pump or not. Compare the computed voltage at 24 hours with the toy threshold.',
 init:()=>({stage:'refr',inhib:0,yeast:0}),
 watch:p=>p<.34?{stage:'regen',inhib:0,yeast:0}:p<.67?{stage:'refr',inhib:0,yeast:0}:{stage:'refr',inhib:0,yeast:1},
 ui:[{choose:[['regen','Before stage 45'],['refr','Refractory']],label:'Stage',get:s=>s.stage,act:'stage'},{b:'V-ATPase inhibitor: on/off',act:'inhib'},{b:'Yeast H⁺ pump: on/off',act:'yeast'}],
 on:{stage(s,v){s.stage=v==='regen'?'regen':'refr'},inhib(s){s.inhib=s.inhib?0:1},yeast(s){s.yeast=s.yeast?0:1}},
 draw(s,f,X){
  const pl=L4_plot(70,70,300,220,[0,48],[-70,10],{xt:[[0,'0'],[12,'12'],[24,'24'],[36,'36'],[48,'48 h']],yt:[[-70,'−70'],[-50,'−50'],[-30,'−30'],[-10,'−10'],[10,'+10']],xl:'hours after amputation',yl:'toy bud voltage (mV)'});
  let out=pl.svg;const pts=[];for(let t=0;t<=48.001;t+=.5)pts.push([pl.X(t),pl.Y(L4_bud(t,s))]);
  out+=L(pl.X(0),pl.Y(L4_REG_THR),pl.X(48),pl.Y(L4_REG_THR),C.green,1.6,'stroke-dasharray="5 4"')+TF(pl.X(47),pl.Y(L4_REG_THR)-6,'toy threshold',13,C.green,'end');
  const tEnd=X&&!X.try?48*clamp(X.p*3%1*1.2,0,1):48,shown=pts.filter((p,i)=>i*.5<=tEnd);
  out+=L4_poly(shown,C.blue,3)+L(pl.X(24),70,pl.X(24),290,C.ink,1.4,'stroke-dasharray="3 3"');
  const v0=L4_bud(0,s),v24=L4_bud(24,s),ok=v24<L4_REG_THR;
  out=heading(ok?'Repolarised by 24 hours: the toy tail regrows':'Still depolarised at 24 hours: no regrowth in the toy')+out;
  out+=L4_badge(392,66,'single')+L4_badge(392,92,'model');
  out+=L4_tile(392,124,90,'Just cut',L4_mv(v0),C.coral)+L4_tile(490,124,90,'At 24 h',L4_mv(v24),ok?C.blue:C.coral);
  out+=TF(392,196,(s.stage==='regen'?'Before stage 45':'Refractory stage'),13,C.ink,'start')+TF(392,214,'V-ATPase inhibitor: '+(s.inhib?'on':'off'),13,s.inhib?C.coral:C.muted,'start')+TF(392,232,'Yeast H⁺ pump: '+(s.yeast?'on':'off'),13,s.yeast?C.purple:C.muted,'start');
  out+=L4_tadpole(400,300,170,{tail:ok?1:.2});out+=TF(486,356,ok?'regrows (toy)':'heals, no regrowth (toy)',13,ok?C.green:C.muted);
  return {svg:out,phase:`Just after the cut the toy bud is at ${L4_mv(v0)}; at 24 hours it is at ${L4_mv(v24)}. ${ok?'That is below the toy threshold, so the toy tail regrows.':'That is above the toy threshold, so the toy wound heals without regrowth.'}${s.yeast?' The yeast pump supplies the outward current that the V-ATPase does not.':''}`};
 }});

const L4_ARCH_NEED=24; // toy rule: hours hyperpolarised (below the threshold) within 48 h needed to start regrowth
function L4_archHours(light){let h=0;for(let t=0;t<48;t+=.5)if(L4_bud(t+.25,{stage:'refr',inhib:0,yeast:0,light})<L4_REG_THR)h+=.5;return h}
SCENE({id:'tail-regeneration-light',name:'A pump switched on by light',tag:'Single-lab finding · Adams, Tseng & Levin, 2013',
 definition:'Archaerhodopsin is a light-driven proton pump from a microbe. Adams, Ai-Sun Tseng and Levin expressed it in Xenopus tadpoles, where light made it move H⁺ out of cells and hyperpolarise them. In tadpoles at ages that would not normally regenerate, light for only 48 hours after amputation, followed by darkness, was enough to start a full regeneration programme. The same tool rescued face and patterning defects caused by blocking the embryo’s own H⁺ flux. This was reported by one lab.',
 example:'Here the light is the switch. The toy computes the bud voltage with the light-driven pump on for the hours you choose, counts how many of the first 48 hours the bud spends below the toy threshold, and starts regrowth when that reaches a toy requirement.',
 desc:'A plot of the toy bud voltage in a refractory-stage tadpole with a light period shaded, the hours spent below the toy threshold, and the toy outcome.',
 research:['Adams, Tseng & Levin (2013). Light-activation of the Archaerhodopsin H⁺-pump reverses age-dependent loss of vertebrate regeneration: sparking system-level controls in vivo. Biology Open 2, 306–313.'],
 dur:12,hint:'Choose how many hours the light stays on after amputation.',
 init:()=>({light:12}),
 watch:p=>({light:Math.round(p*8)*6}),
 ui:[{range:'light',label:'Light on for',min:0,max:12,get:s=>s.light/6,act:'light',show:v=>v*6+' h'}],
 on:{light(s,v){s.light=clamp(Math.round(+v),0,12)*6}},
 draw(s){
  const pl=L4_plot(70,70,300,220,[0,72],[-70,10],{xt:[[0,'0'],[24,'24'],[48,'48'],[72,'72 h']],yt:[[-70,'−70'],[-50,'−50'],[-30,'−30'],[-10,'−10'],[10,'+10']],xl:'hours after amputation',yl:'toy bud voltage (mV)'});
  let out=pl.svg;
  if(s.light>0)out+=R(pl.X(0),70,pl.X(Math.min(72,s.light))-pl.X(0),220,C.amberp,'none',0);const pts=[];for(let t=0;t<=72.001;t+=.5)pts.push([pl.X(t),pl.Y(L4_bud(t,{stage:'refr',inhib:0,yeast:0,light:s.light}))]);
  out+=L(pl.X(0),pl.Y(L4_REG_THR),pl.X(72),pl.Y(L4_REG_THR),C.green,1.6,'stroke-dasharray="5 4"')+L4_poly(pts,C.blue,3);
  if(s.light>0)out+=TF(pl.X(Math.min(72,s.light)/2),282,'light on',13,C.amber);
  const h=L4_archHours(s.light),ok=h>=L4_ARCH_NEED;
  out=heading(ok?'Enough hours hyperpolarised: the toy tail regrows':'Too few hours hyperpolarised: no regrowth in the toy')+out;
  out+=L4_badge(392,66,'single')+L4_badge(392,92,'model');
  out+=L4_tile(392,124,188,'Hours below, first 48 h',fmt(h)+' h',ok?C.blue:C.coral);
  out+=TF(392,196,'Toy requirement: '+L4_ARCH_NEED+' h',13,C.ink,'start')+TF(392,214,'Published protocol: 48 h of light,',13,C.muted,'start')+TF(392,232,'then darkness.',13,C.muted,'start');
  out+=L4_tadpole(400,300,170,{tail:ok?1:.2});out+=TF(486,356,ok?'regrows (toy)':'no regrowth (toy)',13,ok?C.green:C.muted);
  return {svg:out,phase:`With ${s.light} hours of light the toy bud spends ${fmt(h)} of the first 48 hours below the threshold. ${ok?'That meets the toy requirement, so the toy tail regrows.':'That falls short of the toy requirement.'} The paper used 48 hours of light; the toy requirement is a choice, not its result.`};
 }});

/* ===================== Lesson: tail-sodium ===================== */
// Toy intracellular sodium in the regeneration bud (mM), integrated hour by hour. Influx through bud sodium channels
// peaks a few hours after the cut; the Na⁺/K⁺ pump returns sodium towards its resting value.
const L4_NA0=L4_ION.Nai;
function L4_naCurve(o,T=24,dt=.05){let n=L4_NA0;const out=[[0,n]];
 for(let t=dt;t<=T+1e-9;t+=dt){const act=(o.chan||0)*Math.exp(-(((t-6)/3.5)**2));
  const mon=o.mon&&t>=o.start&&t<o.start+o.dur/60?1:0,nao=o.high?90:10;
  const inflow=act*1.6*(L4_ION.Nao-n)/L4_ION.Nao*4+mon*.15*Math.max(0,nao-n),pump=.6*(n-L4_NA0);
  n+=dt*(inflow-pump);if(Math.abs(t/.5-Math.round(t/.5))<1e-6)out.push([t,n])}
 return out}
const L4_NA_THR=8;  // toy rule: the sodium rise above rest, summed over time (mM·h), needed to start regrowth
const L4_naDose=c=>{let d=0;for(let i=1;i<c.length;i++)d+=(c[i][0]-c[i-1][0])*Math.max(0,c[i][1]-L4_NA0);return d};
const L4_NAB={none:{lab:'no blocker',chan:1},drug:{lab:'Na⁺ channel blocked by a drug',chan:.08},kd:{lab:'Na⁺ entry blocked molecularly',chan:.1}};
SCENE({id:'tail-sodium',name:'Sodium enters the bud',tag:'Single-lab finding · Tseng, Beane, Lemire, Masi & Levin, 2010',
 definition:'Ai-Sun Tseng and colleagues found an early, local rise of sodium inside the cells of the regeneration bud after tail amputation, and the sodium channel NaV1.2 in the bud. Blocking sodium transport, with drugs or by molecular methods, made regeneration fail. The rise was seen with a sodium-sensitive dye. This was reported by one lab.',
 example:'In the toy, bud sodium channels open for a few hours after the cut and the sodium pump clears the sodium again. The scene sums the sodium rise over time; regrowth starts above a toy threshold. Block the channel and the rise is too small.',
 desc:'A plot of toy intracellular sodium in the bud over 24 hours after amputation, with the sodium rise shaded, its computed sum and the toy threshold, for no blocker, a drug block or a molecular block.',
 research:['Tseng, Beane, Lemire, Masi & Levin (2010). Induction of vertebrate regeneration by a transient sodium current. Journal of Neuroscience 30, 13192–13200.'],
 dur:12,hint:'Block sodium entry with a drug or by a molecular method, and compare the computed sodium rise with the toy threshold.',
 init:()=>({blk:'drug'}),
 watch:p=>({blk:p<.4?'none':p<.7?'drug':'kd'}),
 ui:[{choose:[['none','No blocker'],['drug','Drug block'],['kd','Molecular block']],label:'Sodium channel',get:s=>s.blk,act:'blk'}],
 on:{blk(s,v){s.blk=L4_NAB[v]?v:'none'}},
 draw(s){
  const c=L4_naCurve({chan:L4_NAB[s.blk].chan}),d=L4_naDose(c),ok=d>=L4_NA_THR,peak=Math.max(...c.map(p=>p[1]));
  let out=heading(ok?'Sodium rises: the toy tail regrows':'Too little sodium: no regrowth in the toy');
  const pl=L4_plot(70,70,300,220,[0,24],[10,30],{xt:[[0,'0'],[6,'6'],[12,'12'],[18,'18'],[24,'24 h']],yt:[[10,'10'],[15,'15'],[20,'20'],[25,'25'],[30,'30']],xl:'hours after amputation',yl:'toy bud Na⁺ inside (mM)'});
  out+=pl.svg+`<path d="M${c.map(p=>fmt(pl.X(p[0]))+' '+fmt(pl.Y(p[1]))).join(' L')} L${fmt(pl.X(24))} ${fmt(pl.Y(L4_NA0))} L${fmt(pl.X(0))} ${fmt(pl.Y(L4_NA0))}Z" fill="${C.purplep}" stroke="none"/>`;
  out+=L4_poly(c.map(p=>[pl.X(p[0]),pl.Y(p[1])]),C.purple,3)+L(pl.X(0),pl.Y(L4_NA0),pl.X(24),pl.Y(L4_NA0),C.line,1.4,'stroke-dasharray="4 3"')+TF(pl.X(23.5),pl.Y(L4_NA0)-6,'rest',13,C.muted,'end');
  out+=L4_badge(392,66,'single')+L4_badge(392,92,'model');
  out+=L4_tile(392,124,90,'Peak',fmt(Math.round(peak*10)/10)+' mM',C.purple)+L4_tile(490,124,90,'Sum of rise',fmt(Math.round(d*10)/10)+' mM·h',ok?C.green:C.coral);
  out+=TF(392,196,'Toy threshold: '+L4_NA_THR+' mM·h',13,C.ink,'start')+TF(392,214,L4_NAB[s.blk].lab,13,C.muted,'start');
  out+=L4_tadpole(400,300,170,{tail:ok?1:.2});out+=TF(486,356,ok?'regrows (toy)':'no regrowth (toy)',13,ok?C.green:C.muted);
  return {svg:out,phase:`With ${L4_NAB[s.blk].lab}, toy bud sodium peaks at ${fmt(Math.round(peak*10)/10)} mM and the rise sums to ${fmt(Math.round(d*10)/10)} mM·h. ${ok?'Above the toy threshold: regrowth starts.':'Below the toy threshold: regrowth fails, as the paper reports when sodium entry is blocked.'}`};
 }});

SCENE({id:'tail-sodium-pulse',name:'A one-hour sodium pulse',tag:'Single-lab finding · Monensin plus high sodium, 2010',
 definition:'The same paper then asked whether forcing sodium in could restart regrowth where it normally fails. Refractory-stage tadpoles were treated for one hour, starting 18 to 19 hours after amputation, with monensin (an ionophore that carries sodium across membranes) in a medium with 90 mM sodium. This restored regrowth, even after the wound had healed over. Monensin alone or high sodium alone had no effect. This was reported by one lab.',
 example:'In the toy, the refractory bud has no sodium rise of its own. Monensin opens a path whose flow depends on the sodium difference across the membrane. In ordinary low-sodium rearing water there is little to carry in, so monensin alone does almost nothing; high sodium without monensin cannot get in. A threshold in a toy is not the paper’s mechanism.',
 desc:'A plot of toy bud sodium in a refractory-stage tadpole from 12 to 24 hours after amputation, with the treatment window shaded, the computed sodium rise, the toy threshold, and the published protocol in a box.',
 research:['Tseng, Beane, Lemire, Masi & Levin (2010). Journal of Neuroscience 30, 13192–13200: 20 µM monensin with 90 mM Na⁺ for 1 h at 18–19 h after amputation; either alone had no effect.','The sodium of ordinary rearing water is taken here as 10 mM, a toy value for a dilute medium.'],
 dur:14,hint:'Switch monensin and high sodium on or off, and change the length of the pulse. Find what the toy needs to pass its threshold.',
 init:()=>({mon:1,high:0,dur:60}),
 watch:p=>p<.25?{mon:1,high:0,dur:60}:p<.5?{mon:0,high:1,dur:60}:p<.75?{mon:1,high:1,dur:60}:{mon:1,high:1,dur:15},
 ui:[{b:'Monensin: on/off',act:'mon'},{b:'High sodium: on/off',act:'high'},{range:'dur',label:'Pulse length',min:0,max:8,get:s=>s.dur/15,act:'dur',show:v=>v*15+' min'}],
 on:{mon(s){s.mon=s.mon?0:1},high(s){s.high=s.high?0:1},dur(s,v){s.dur=clamp(Math.round(+v),0,8)*15}},
 draw(s){
  const o={chan:0,mon:s.mon,high:s.high,start:18,dur:s.dur},c=L4_naCurve(o,30),d=L4_naDose(c),ok=d>=L4_NA_THR;
  let out=heading(ok?'The pulse is enough: the toy tail regrows':'Not enough sodium gets in: no regrowth in the toy');
  const pl=L4_plot(70,70,300,220,[12,30],[10,30],{xt:[[12,'12'],[18,'18'],[24,'24'],[30,'30 h']],yt:[[10,'10'],[15,'15'],[20,'20'],[25,'25'],[30,'30']],xl:'hours after amputation',yl:'toy bud Na⁺ inside (mM)'});
  out+=pl.svg;if(s.dur>0)out+=R(pl.X(18),70,Math.max(2,pl.X(18+s.dur/60)-pl.X(18)),220,C.amberp,'none',0);
  out+=L4_poly(c.filter(p=>p[0]>=12).map(p=>[pl.X(p[0]),pl.Y(p[1])]),C.purple,3)+L(pl.X(12),pl.Y(L4_NA0),pl.X(30),pl.Y(L4_NA0),C.line,1.4,'stroke-dasharray="4 3"');
  out+=L4_badge(392,66,'single')+L4_badge(392,92,'model');
  out+=L4_tile(392,124,188,'Sum of sodium rise',fmt(Math.round(d*10)/10)+' mM·h (toy needs '+L4_NA_THR+')',ok?C.green:C.coral);
  out+=TF(392,196,'Monensin '+(s.mon?'on':'off')+' · sodium '+(s.high?'90 mM':'low'),13,C.ink,'start');
  out+=R(392,214,188,72,C.pale,C.blue,8)+TBF(486,234,'Published protocol',13,C.blue)+TF(486,254,'monensin + 90 mM Na⁺',13,C.ink)+TF(486,274,'1 h, at 18–19 h',13,C.ink);
  out+=L4_tadpole(400,318,140,{tail:ok?1:.2});out+=TF(560,330,ok?'regrows':'no regrowth',13,ok?C.green:C.muted,'end')+TF(560,348,'(toy)',13,C.muted,'end');
  return {svg:out,phase:`${s.dur} minutes, monensin ${s.mon?'on':'off'}, sodium ${s.high?'90 mM':'low'}: the toy sodium rise sums to ${fmt(Math.round(d*10)/10)} mM·h. ${ok?'That passes the toy threshold.':'That is below the toy threshold.'} ${s.mon&&!s.high?'With little sodium outside, the ionophore has little to carry in.':!s.mon&&s.high?'Without the ionophore, the extra sodium outside cannot get in.':''}`};
 }});

// Six reported experiments on tadpole tails, sorted by what they show.
const L4_TOOLS=[
 {k:'bmp',t:'BMP or Notch switched on, refractory stage',a:'enough',who:'Beck, Christen & Slack 2003',lab:'single',why:'Regrowth returned in the window when it normally fails.'},
 {k:'vat',t:'V-ATPase blocked after amputation',a:'needed',who:'Adams, Masi & Levin 2007',lab:'single',why:'The wound healed but the tail did not regrow.'},
 {k:'yeast',t:'Yeast H⁺ pump expressed, refractory stage',a:'enough',who:'Adams, Masi & Levin 2007',lab:'single',why:'A foreign pump restored regrowth.'},
 {k:'arch',t:'Light-driven H⁺ pump, 48 h of light',a:'enough',who:'Adams, Tseng & Levin 2013',lab:'single',why:'Light alone, through the pump, restarted regrowth.'},
 {k:'nav',t:'Sodium entry blocked in the bud',a:'needed',who:'Tseng et al. 2010',lab:'single',why:'Regeneration failed.'},
 {k:'mon',t:'Monensin with high sodium for 1 h',a:'enough',who:'Tseng et al. 2010',lab:'single',why:'A brief pulse restored regrowth in the refractory stage.'}];
SCENE({id:'tail-sodium-tools',name:'Needed, or enough?',tag:'Framework or hypothesis · Several switches, one programme',
 definition:'Two kinds of experiment recur in this lesson. Blocking something and seeing regrowth fail shows that it is needed (necessity). Adding something where regrowth normally fails and seeing it return shows that it is enough to start the programme (sufficiency). The Levin lab reads its results as a bioelectric switch upstream of a whole regeneration programme; that reading is a hypothesis. The BMP and Notch results come from another lab and point to chemical pathways that are also involved.',
 example:'Several unrelated tools, a yeast pump, a microbial light-driven pump and a sodium ionophore, all restarted regrowth. The lab argues that what they share is a change in ion flow and voltage, not any one protein. How the voltage and sodium signals connect to BMP, Notch and other pathways is an open question.',
 desc:'Six cards describing reported tail experiments, which the learner sorts into “needed” and “enough”, with a computed tally and the source and label of each.',
 research:['Beck, Christen & Slack (2003). Developmental Cell 5, 429–439.','Adams, Masi & Levin (2007). Development 134, 1323–1335.','Adams, Tseng & Levin (2013). Biology Open 2, 306–313.','Tseng et al. (2010). Journal of Neuroscience 30, 13192–13200.'],
 dur:14,hint:'Tap a card to sort it as “needed” or “enough”; tap again to change it.',
 init:()=>({put:{},last:''}),
 watch:p=>{const put={},n=Math.floor(p*7);L4_TOOLS.slice(0,n).forEach(c=>put[c.k]=c.a);return {put,last:n?L4_TOOLS[Math.min(5,n-1)].k:''}},
 ui:[{b:'Sort all',act:'all'}],
 on:{card(s,k){const c=L4_TOOLS.find(x=>x.k===k);if(!c)return 'keep';s.put[k]=s.put[k]==='needed'?'enough':s.put[k]==='enough'?undefined:'needed';s.last=k;return 'keep'},all(s){L4_TOOLS.forEach(c=>s.put[c.k]=c.a);s.last=''}},
 draw(s,f,X){
  let out=heading('Which experiments show need, which show enough?');
  const placed=L4_TOOLS.filter(c=>s.put[c.k]),right=placed.filter(c=>s.put[c.k]===c.a).length;
  out+=R(310,48,130,24,C.coralp,'none',6)+TBF(375,65,'needed',13,C.coral)+R(450,48,130,24,C.greenp,'none',6)+TBF(515,65,'enough',13,C.green);
  L4_TOOLS.forEach((c,i)=>{const y=80+i*43,p=s.put[c.k];
   const inner=R(20,y,280,38,p?'#fff':C.pale,p?(p==='needed'?C.coral:C.green):C.line,8)+TF(30,y+17,c.t,13,C.ink,'start')+TF(30,y+33,c.who,13,C.muted,'start');
   out+=hit(X,'card',c.k,c.t+(p?', sorted as '+p:''),inner);
   if(p){const x=p==='needed'?375:515;out+=Ci(x,y+19,9,p===c.a?(p==='needed'?C.coral:C.green):'#fff',p==='needed'?C.coral:C.green)+TF(x,y+24,p===c.a?'✓':'?',13,p===c.a?'#fff':C.ink)}});
  out+=L4_badge(20,342,'frame');
  out+=TF(580,352,`${placed.length} sorted · ${right} as the papers report`,13,C.ink,'end');
  const c=L4_TOOLS.find(x=>x.k===s.last);
  return {svg:out,phase:c?`${c.t}: ${c.why} The paper reads this as showing the step is ${c.a==='needed'?'needed (necessity)':'enough to start regrowth (sufficiency)'}. Label: ${L4_LABELS[c.lab][0]}.`:'Tap a card to sort it. Each one describes a reported experiment on tadpole tails.'};
 }});

/* ===================== Lesson: picasso-tadpoles ===================== */
// A schematic tadpole head (seen from above) with four structures. Two toy rules move them over toy time steps:
// "seek" moves each structure part of the way towards its normal place (error-reducing); "fixed" moves each along
// the displacement it would make in normal development, whatever its starting place (hardwired).
const L4_ORG=[{k:'eyeL',name:'left eye',tx:150,ty:170,r:16},{k:'eyeR',name:'right eye',tx:250,ty:170,r:16},{k:'nose',name:'nostrils',tx:200,ty:212,r:9},{k:'jaw',name:'jaw',tx:200,ty:262,r:22}];
const L4_EARLY={eyeL:[-14,10],eyeR:[14,10],nose:[0,12],jaw:[0,-14]}; // toy: where each sits early in normal development, relative to its final place
const L4_PSTEPS=10;
function L4_scramble(seed){const r=L4_rng(seed),pos={};for(const o of L4_ORG){pos[o.k]=[o.tx+(r()-.5)*90,o.ty+(r()-.5)*70]}return pos}
const L4_err=pos=>sum(L4_ORG.map(o=>Math.hypot(pos[o.k][0]-o.tx,pos[o.k][1]-o.ty)))/L4_ORG.length;
function L4_picFrames(s){const fr=[],r=L4_rng(4051);let pos=JSON.parse(JSON.stringify(s.pos));
 for(let k=0;k<=L4_PSTEPS;k++){fr.push({k,pos:JSON.parse(JSON.stringify(pos)),e:L4_err(pos)});
  const nx={};for(const o of L4_ORG){const [x,y]=pos[o.k];
   if(s.rule==='seek')nx[o.k]=[x+.3*(o.tx-x)+1.5*L4_gauss(r),y+.3*(o.ty-y)+1.5*L4_gauss(r)];
   else{const d=L4_EARLY[o.k];nx[o.k]=[x-d[0]/L4_PSTEPS,y-d[1]/L4_PSTEPS]}}
  pos=nx}
 return fr.map((f,i)=>({...f,say:i===0?`Start: the structures sit an average of ${fmt(Math.round(f.e))} units from their normal places.`:`Toy step ${i}: average distance from normal ${fmt(Math.round(f.e))} units${i===L4_PSTEPS?(s.rule==='seek'?'. The error-reducing rule has brought the face close to normal.':'. The hardwired rule made the normal moves, so the face is as scrambled as it began.'):'.'}`}))}
function L4_head(x=200,y=215){return `<path d="M${x-95} ${y-60} Q${x-100} ${y-120} ${x} ${y-125} Q${x+100} ${y-120} ${x+95} ${y-60} L${x+80} ${y+80} Q${x} ${y+110} ${x-80} ${y+80}Z" fill="#eef3e9" stroke="${C.green}" stroke-width="2"/>`}
function L4_organ(o,at,ghost){
 if(ghost)return o.k==='jaw'?P(`M${o.tx-o.r} ${o.ty-4} Q${o.tx} ${o.ty+14} ${o.tx+o.r} ${o.ty-4}`,C.line,2,'none','stroke-dasharray="4 3"'):Ci(o.tx,o.ty,o.r,'none',C.line,'stroke-dasharray="4 3"');
 const [x,y]=at;
 if(o.k==='jaw')return P(`M${fmt(x-o.r)} ${fmt(y-4)} Q${fmt(x)} ${fmt(y+14)} ${fmt(x+o.r)} ${fmt(y-4)}`,C.coral,4);
 if(o.k==='nose')return Ci(x-7,y,4,C.dark)+Ci(x+7,y,4,C.dark);
 return Ci(x,y,o.r,C.dark,'#fff')+Ci(x+4,y-4,4,'#fff');
}
const L4_picInit=()=>({pos:L4_scramble(7),rule:'seek',sel:'eyeL',seed:7});
SCENE({id:'picasso-tadpoles',name:'“Picasso” tadpoles',tag:'Single-lab finding · Vandenberg, Adams & Levin, 2012',
 definition:'Laura Vandenberg, Dany Spencer Adams and Michael Levin disrupted the H⁺ pump in early frog embryos, which gave tadpoles with jaws, eyes and other head structures misshapen or out of place. Following the same tadpoles as they grew, they measured the structures’ shapes and positions. The jaws and branchial arches (gill supports) were corrected towards normal over the first few months of tadpole life, before metamorphosis; eyes and nostrils improved too, but less reliably. Levin calls such scrambled faces “Picasso tadpoles”. This is one lab’s finding.',
 example:'A hardwired rule, in which each structure makes the moves it would make in a normal tadpole, cannot fix a scrambled start: it ends as displaced as it began. An error-reducing rule, in which each structure moves part of the way towards its normal place, ends near normal from any start. The data favoured something like the second; the toy shows why.',
 desc:'A schematic tadpole head seen from above with eyes, nostrils and jaw in scrambled positions, dashed outlines of the normal positions, and the structures moving under the chosen toy rule, with the computed average distance from normal.',
 research:['Vandenberg, Adams & Levin (2012). Normalized shape and location of perturbed craniofacial structures in the Xenopus tadpole reveal an innate ability to achieve correct morphology. Developmental Dynamics 241, 863–878.'],
 dur:14,hint:'Pick a structure and nudge it out of place, or scramble the face. Choose a rule, then step or run through the toy time steps.',
 init:L4_picInit,
 trace:L4_picFrames,
 ui:[{choose:[['seek','Error-reducing'],['fixed','Hardwired']],label:'Rule',get:s=>s.rule,act:'rule'},{choose:L4_ORG.map(o=>[o.k,o.name]),label:'Structure',get:s=>s.sel,act:'sel'},{b:'◀',act:'mv',arg:'l',aria:'Move left'},{b:'▶',act:'mv',arg:'r',aria:'Move right'},{b:'▲',act:'mv',arg:'u',aria:'Move up'},{b:'▼',act:'mv',arg:'d',aria:'Move down'},{b:'Scramble',act:'scr'}],
 on:{rule(s,v){s.rule=v==='fixed'?'fixed':'seek'},sel(s,v){if(L4_ORG.some(o=>o.k===v))s.sel=v;return 'keep'},
  mv(s,d){const p=s.pos[s.sel],st=14;if(d==='l')p[0]-=st;if(d==='r')p[0]+=st;if(d==='u')p[1]-=st;if(d==='d')p[1]+=st;p[0]=clamp(p[0],120,280);p[1]=clamp(p[1],120,300)},
  scr(s){s.seed=(s.seed*7+3)%97+1;s.pos=L4_scramble(s.seed)}},
 draw(s,f,X){
  const fr=f||{k:0,pos:s.pos,e:L4_err(s.pos)};
  let out=heading(s.rule==='seek'?'Error-reducing rule: move towards the normal place':'Hardwired rule: make the normal moves');
  out+=L4_head();for(const o of L4_ORG)out+=L4_organ(o,null,true);
  for(const o of L4_ORG){out+=L4_organ(o,fr.pos[o.k]);if(X&&X.try&&o.k===s.sel&&fr.k===0)out+=Ci(fr.pos[o.k][0],fr.pos[o.k][1],o.r+7,'none',C.blue,'stroke-dasharray="3 3"')}
  out+=TF(200,352,'dashed: normal positions (schematic)',13,C.muted);
  const x0=340;out+=L4_badge(x0,52,'single')+L4_badge(x0,78,'frame')+L4_badge(x0,104,'model');
  out+=L4_tile(x0,140,240,'Average distance from normal',fmt(Math.round(fr.e))+' units',fr.e<12?C.green:C.coral);
  out+=TF(x0,212,'Toy step '+fr.k+' of '+L4_PSTEPS,13,C.ink,'start');
  const pl=L4_plot(x0,236,240,90,[0,L4_PSTEPS],[0,60],{yt:[[0,'0'],[60,'60']]});out+=pl.svg;
  const frs=L4_picFrames(s);out+=L4_poly(frs.slice(0,fr.k+1).map(q=>[pl.X(q.k),pl.Y(Math.min(60,q.e))]),C.blue,2.5);
  out+=TF(x0+120,350,'toy time steps',13,C.muted);
  return {svg:out,phase:fr.say||''};
 }});

// A toy population of 24 tadpoles: each structure starts displaced and is corrected at a hand-set rate. The rates
// were chosen to echo the paper's qualitative ordering (jaws and arches most reliably, eyes and nostrils less).
const L4_STRUCT=[{k:'jaw',name:'jaw',rate:.9,sd:.15},{k:'arch',name:'branchial arches',rate:.8,sd:.15},{k:'eye',name:'eyes',rate:.45,sd:.45},{k:'nose',name:'nostrils',rate:.35,sd:.5}];
function L4_popDist(st,m){const r=L4_rng(4061+st.k.length*13),out=[];for(let i=0;i<24;i++){const d0=20+12*r(),rt=Math.max(0,st.rate*(1+st.sd*L4_gauss(r)));out.push(d0*Math.exp(-rt*m))}return out}
SCENE({id:'picasso-tadpoles-measure',name:'Measuring a face as it changes',tag:'Simplified model · Single-lab finding: jaws corrected most reliably',
 definition:'The 2012 study, from one lab, used geometric morphometrics: marking the same anatomical landmarks on each tadpole’s head and comparing the landmark shapes and positions with those of normal tadpoles at the same age. Over the first few months of tadpole life, the shapes and positions of the jaws and branchial arches moved towards normal. Eye and nostril tissue also improved but varied in how close to normal it came. A related study from the McLaughlin laboratory, also at Tufts, later reported that tadpoles correct several kinds of induced face defect before metamorphosis by remodelling cartilage.',
 example:'The toy follows 24 model tadpoles. Each structure starts some distance from normal and shrinks that distance at its own rate, with tadpole-to-tadpole variation. The rates were set by hand to echo the paper’s ordering, so the curves illustrate the report; they are not its data.',
 desc:'Curves of the toy average landmark distance from normal over months for jaw, branchial arches, eyes and nostrils, with a time marker and a count of toy tadpoles close to normal for the chosen structure.',
 research:['Vandenberg, Adams & Levin (2012). Developmental Dynamics 241, 863–878 (geometric morphometrics; jaws and branchial arches normalised over the first months, before metamorphosis).','Pinet, Deolankar, Leung & McLaughlin (2019). Adaptive correction of craniofacial defects in pre-metamorphic Xenopus laevis tadpoles involves thyroid hormone-independent tissue remodeling. Development 146, dev175893.'],
 dur:12,hint:'Choose a structure and slide the months. Count the toy tadpoles that come within the toy tolerance of normal.',
 init:()=>({st:'eye',m:2}),
 watch:p=>({st:L4_STRUCT[Math.min(3,Math.floor(p*4))].k,m:Math.round(lerp(0,3,p)*4)/4}),
 ui:[{choose:L4_STRUCT.map(x=>[x.k,x.name]),label:'Structure',get:s=>s.st,act:'st'},{range:'m',label:'Months of growth',min:0,max:12,get:s=>Math.round(s.m*4),act:'m',show:v=>(v/4).toFixed(2)}],
 on:{st(s,v){if(L4_STRUCT.some(x=>x.k===v))s.st=v},m(s,v){s.m=clamp(+v/4,0,3)}},
 draw(s){
  const TOL=5,st=L4_STRUCT.find(x=>x.k===s.st),ds=L4_popDist(st,s.m),near=ds.filter(d=>d<TOL).length,mean=sum(ds)/ds.length;
  let out=heading('Distance from a normal face, month by month');
  const pl=L4_plot(70,64,300,230,[0,3],[0,32],{xt:[[0,'0'],[1,'1'],[2,'2'],[3,'3 months']],yt:[[0,'0'],[10,'10'],[20,'20'],[30,'30']],xl:'months of tadpole growth (before metamorphosis)',xlDy:32,yl:'toy average landmark distance'});
  out+=pl.svg+L(pl.X(0),pl.Y(TOL),pl.X(3),pl.Y(TOL),C.green,1.4,'stroke-dasharray="4 3"');
  const cols={jaw:C.coral,arch:C.amber,eye:C.blue,nose:C.purple};
  for(const x of L4_STRUCT){const pts=[];for(let m=0;m<=3.001;m+=.1){const d=L4_popDist(x,m);pts.push([pl.X(m),pl.Y(sum(d)/d.length)])}
   out+=L4_poly(pts,cols[x.k],x.k===s.st?3.5:1.6,x.k===s.st?'':'opacity="0.55"');
   }
  L4_STRUCT.forEach((x,i)=>{out+=R(70+i*78,346,14,4,cols[x.k],'none',1)+TF(88+i*78,352,x.k==='arch'?'arches':x.name,13,cols[x.k],'start')});
  out+=L(pl.X(s.m),64,pl.X(s.m),294,C.ink,1.6);
  ds.forEach((d,i)=>{out+=Ci(pl.X(s.m)+((i%6)-2.5)*4,pl.Y(Math.min(32,d)),2.4,cols[st.k])});
  const x0=440;out+=L4_badge(x0-10,62,'model')+L4_badge(x0-10,88,'single');
  out+=L4_tile(x0-10,124,150,'Mean ('+st.name.split(' ')[0]+')',fmt(Math.round(mean*10)/10),cols[st.k])+L4_tile(x0-10,180,150,'Within tolerance',near+' of 24',C.green);
  out+=TF(x0-10,248,'Toy tolerance: '+TOL+' units',13,C.muted,'start')+TF(x0-10,266,'Rates set by hand',13,C.muted,'start')+TF(x0-10,284,'to echo the report.',13,C.muted,'start');
  return {svg:out,phase:`After ${fmt(s.m)} months the toy ${st.name} are on average ${fmt(Math.round(mean*10)/10)} units from normal, and ${near} of 24 toy tadpoles are within the tolerance. In the paper the jaws and branchial arches were corrected most reliably; eyes and nostrils varied more.`};
 }});

// Two toy readings of "correcting": each structure moves to a fixed place in the head, or to the right place
// relative to its neighbours.
const L4_PERT={one:'one eye moved',all:'whole face shifted'};
function L4_readPos(pert){const pos={};for(const o of L4_ORG)pos[o.k]=[o.tx,o.ty];if(pert==='one'){pos.eyeL=[128,214]}else{for(const o of L4_ORG)pos[o.k]=[o.tx+34,o.ty+26]}return pos}
function L4_readRun(pert,rule,steps){let pos=L4_readPos(pert);
 for(let k=0;k<steps;k++){const nx={};for(const o of L4_ORG){const [x,y]=pos[o.k];let tx=o.tx,ty=o.ty;
   if(rule==='rel'){const oth=L4_ORG.filter(q=>q.k!==o.k),cx=sum(oth.map(q=>pos[q.k][0]-q.tx))/oth.length,cy=sum(oth.map(q=>pos[q.k][1]-q.ty))/oth.length;tx=o.tx+cx;ty=o.ty+cy}
   nx[o.k]=[x+.3*(tx-x),y+.3*(ty-y)]}pos=nx}
 return pos}
const L4_relErr=pos=>{const cx=sum(L4_ORG.map(o=>pos[o.k][0]-o.tx))/4,cy=sum(L4_ORG.map(o=>pos[o.k][1]-o.ty))/4;return sum(L4_ORG.map(o=>Math.hypot(pos[o.k][0]-o.tx-cx,pos[o.k][1]-o.ty-cy)))/4};
SCENE({id:'picasso-tadpoles-readings',name:'What does the face aim for?',tag:'Framework or hypothesis · A target shape, and other readings',
 definition:'The authors proposed that face structures can measure where they are relative to neighbouring organs and adjust. The lab connects this to its wider idea of a “target morphology”: a large-scale shape that tissues work towards and can return to when disturbed. That is a framework, not a demonstrated mechanism. Other explanations at the tissue level are possible and not exclusive, for example local rules of cartilage growth and remodelling, which the McLaughlin laboratory linked to raised mmp1 and mmp13 expression and found to be independent of thyroid hormone.',
 example:'Two toy readings: each structure heads for a fixed place in the head, or for the right place relative to its neighbours. Moving one eye barely tells them apart: both restore a normal arrangement. Shifting the whole face can: the relative rule keeps a well-arranged face in the wrong place. This is a thought experiment drawn with toy rules, not a reported experiment.',
 desc:'A schematic tadpole head under a chosen perturbation (one eye moved, or the whole face shifted) and a chosen toy rule (fixed place or relative to neighbours), with computed errors from the normal place and from the normal arrangement, and a list of readings with their labels.',
 research:['Vandenberg, Adams & Levin (2012). Developmental Dynamics 241, 863–878 (proposal that structures assess and adjust their position relative to neighbouring organs).','Pinet, Deolankar, Leung & McLaughlin (2019). Development 146, dev175893 (cartilage remodelling, mmp1 and mmp13, thyroid-hormone independent).'],
 dur:12,hint:'Choose the perturbation and the toy rule, then slide the toy time steps. Which combination separates the two rules?',
 init:()=>({pert:'all',rule:'rel',k:10}),
 watch:p=>({pert:p<.5?'one':'all',rule:(p*4|0)%2?'abs':'rel',k:Math.round((p*4%1)*10)}),
 ui:[{choose:[['one','Move one eye'],['all','Shift whole face']],label:'Perturbation',get:s=>s.pert,act:'pert'},{choose:[['abs','Fixed place'],['rel','Relative']],label:'Rule',get:s=>s.rule,act:'rule'},{range:'k',label:'Toy steps',min:0,max:10,get:s=>s.k,act:'k'}],
 on:{pert(s,v){s.pert=v==='one'?'one':'all'},rule(s,v){s.rule=v==='abs'?'abs':'rel'},k(s,v){s.k=clamp(Math.round(+v),0,10)}},
 draw(s){
  const pos=L4_readRun(s.pert,s.rule,s.k),eAbs=L4_err(pos),eRel=L4_relErr(pos);
  let out=heading((s.rule==='rel'?'Relative rule':'Fixed-place rule')+' · '+L4_PERT[s.pert]);
  out+=L4_head();for(const o of L4_ORG)out+=L4_organ(o,null,true);for(const o of L4_ORG)out+=L4_organ(o,pos[o.k]);
  out+=TF(200,352,'dashed: normal positions (schematic)',13,C.muted);
  const x0=330;out+=L4_badge(x0,44,'frame')+L4_badge(x0,68,'model');
  out+=L4_tile(x0,96,120,'From normal place',fmt(Math.round(eAbs)),eAbs<6?C.green:C.coral)+L4_tile(x0+130,96,120,'From normal layout',fmt(Math.round(eRel)),eRel<6?C.green:C.coral);
  const rows=[['frame','Structures sense neighbours (authors)'],['frame','Target morphology (lab framework)'],['single','Cartilage remodelling (McLaughlin lab)']];
  rows.forEach(([k,t],i)=>{const y=164+i*54;out+=L4_badge(x0,y,k)+TF(x0,y+38,t,13,C.ink,'start')});
  return {svg:out,phase:`After ${s.k} toy steps, the structures are on average ${fmt(Math.round(eAbs))} units from their normal places and ${fmt(Math.round(eRel))} units from a normal arrangement. ${s.pert==='all'&&s.rule==='rel'?'The relative rule is satisfied by a well-arranged face in the wrong place, so a whole-face shift would separate the two readings.':s.pert==='one'?(s.rule==='rel'?'Both rules restore a normal arrangement after one eye is moved; under the relative rule the whole face also drifts a little towards the eye.':'Both rules restore a normal arrangement after one eye is moved, so this test barely tells them apart.'):'The fixed-place rule brings the whole face back.'}`};
 }});

/* ===================== Lesson: leg-regrowth ===================== */
// Schematic limb outlines only; no length or count from the papers is drawn. The shapes are drawn for this course.
function L4_limb(x,y,kind,u){u=clamp(u,0,1);let out=R(x-14,y-40,28,40,'#eef3e9',C.green,6)+TF(x+30,y-18,'stump',13,C.muted,'start');
 if(kind==='spike'){const l=70*u;out+=`<path d="M${x-8} ${y} L${x} ${fmt(y+l)} L${x+8} ${y}Z" fill="${C.pale}" stroke="${C.blue}" stroke-width="2"/>`}
 else if(kind==='paddle'){const l=80*u,w=14+16*u;out+=`<path d="M${x-10} ${y} Q${fmt(x-w)} ${fmt(y+l*.7)} ${x} ${fmt(y+l)} Q${fmt(x+w)} ${fmt(y+l*.7)} ${x+10} ${y}Z" fill="${C.pale}" stroke="${C.blue}" stroke-width="2"/>`}
 else if(kind==='long'){const l=104*u,w=10+14*u;out+=`<path d="M${x-10} ${y} L${x-8} ${fmt(y+l*.55)} Q${fmt(x-w)} ${fmt(y+l*.85)} ${fmt(x-w*.6)} ${fmt(y+l)} L${fmt(x+w*.6)} ${fmt(y+l)} Q${fmt(x+w)} ${fmt(y+l*.85)} ${x+8} ${fmt(y+l*.55)} L${x+10} ${y}Z" fill="${C.pale}" stroke="${C.blue}" stroke-width="2"/>`}
 else if(kind==='full'){const l=110*u;out+=`<path d="M${x-10} ${y} L${x-9} ${fmt(y+l*.6)} L${x-22} ${fmt(y+l)} L${x+22} ${fmt(y+l)} L${x+9} ${fmt(y+l*.6)} L${x+10} ${y}Z" fill="${C.greenp}" stroke="${C.green}" stroke-width="2"/>`}
 return out}
const L4_LEG={tad:{lab:'tadpole, early limb',shape:'full',res:'Young tadpoles can regrow an amputated limb bud; this ability declines as they develop.',badge:'rep'},
 adult:{lab:'adult frog, untreated',shape:'spike',res:'Adult Xenopus usually regrow only an unbranched cartilage spike.',badge:'rep'},
 prog:{lab:'adult, progesterone 24 h',shape:'paddle',res:'A 24-hour progesterone BioDome gave a longer-lasting, paddle-like regrowth in adult frogs (2018).',badge:'single'}};
SCENE({id:'leg-regrowth',name:'A frog leg regrows',tag:'Replicated finding · Adult frogs regrow only a spike',
 definition:'Xenopus tadpoles can regrow an amputated limb bud, but the ability fades as they develop, and an adult frog that loses a hind leg usually grows only an unbranched spike of cartilage. In 2018 Celia Herrera-Rincon and colleagues in Levin’s lab, with David Kaplan’s lab at Tufts, placed a wearable silicone cap (a “BioDome”) over the wound of adult frogs, holding a silk hydrogel with progesterone, for 24 hours. Over the following months the treated frogs grew a longer, paddle-like structure instead of a spike. That result is from one lab. Not medical advice: these are animal studies in frogs.',
 example:'The spike in untreated adults is a long-established observation. The progesterone result is one lab’s finding; the authors proposed that progesterone acts partly by changing ion flow and voltage, which was a hypothesis in that paper. The drawings are schematic outlines, not traced from the papers’ images.',
 desc:'Schematic outlines of regrowth from an amputated limb in a young tadpole, an untreated adult frog and an adult treated for 24 hours with a progesterone BioDome, growing over a chosen number of months.',
 research:['Herrera-Rincon et al., with Kaplan and Levin (2018). Brief local application of progesterone via a wearable bioreactor induces long-term regenerative response in adult Xenopus hindlimb. Cell Reports 25, 1593–1609.','The decline of limb regeneration with development in Xenopus, and the adult spike, are described in the introductions of Herrera-Rincon et al. (2018) and Murugan et al. (2022).'],
 dur:12,hint:'Choose the animal and treatment, and slide the months since amputation.',
 init:()=>({who:'adult',m:6}),
 watch:p=>({who:p<.33?'tad':p<.66?'adult':'prog',m:Math.round((p*3%1)*12)}),
 ui:[{choose:[['tad','Tadpole'],['adult','Adult, untreated'],['prog','Adult, progesterone']],label:'Animal',get:s=>s.who,act:'who'},{range:'m',label:'Months since amputation',min:0,max:12,get:s=>s.m,act:'m'}],
 on:{who(s,v){s.who=L4_LEG[v]?v:'adult'},m(s,v){s.m=clamp(Math.round(+v),0,12)}},
 draw(s){
  const g=L4_LEG[s.who],u=s.who==='tad'?clamp(s.m/2,0,1):1-Math.exp(-s.m/3);
  let out=heading(g.lab);
  out+=L4_limb(150,120,g.shape,u)+TF(150,300,s.m+' months after amputation (schematic)',13,C.ink);
  out+=L4_badge(300,70,g.badge);
  const lines={tad:['Limb buds of young tadpoles regrow.','The ability fades as they develop.'],adult:['Usually an unbranched','cartilage spike, no digits.'],prog:['BioDome with progesterone,','worn for 24 hours (2018).','Longer, paddle-like regrowth.']}[s.who];
  lines.forEach((t,i)=>out+=TF(300,118+i*20,t,13,C.ink,'start'));
  out+=R(300,200,270,92,C.coralp,C.coral,8)+TBF(435,222,'Not medical advice',13,C.coral)+TF(435,244,'Animal studies in frogs. No claim',13,C.ink)+TF(435,262,'is made here about people or',13,C.ink)+TF(435,280,'any treatment.',13,C.ink);
  out+=L4_note('Outlines are schematic, drawn for this course.',350);
  return {svg:out,phase:g.res+` Shown ${s.m} months after amputation, as a schematic.`};
 }});

const L4_DAY_H=24,L4_MONTH_D=365.25/12;
const L4_GROUP={cock:{lab:'BioDome with five compounds',shape:'long',res:'The longest regrowth, with more bone, nerve and blood-vessel tissue than the other groups, and some use of the limb in swimming; the new limbs lacked the full webbing and toes of a normal leg.'},
 dome:{lab:'BioDome alone',shape:'paddle',res:'Some benefit over no treatment in some frogs, less than with the compounds.'},
 none:{lab:'No BioDome',shape:'spike',res:'The usual spike-like regrowth.'}};
SCENE({id:'leg-regrowth-cocktail',name:'One day of treatment, 18 months of growth',tag:'Single-lab finding · Murugan et al., 2022',
 definition:'In 2022 Nirosha Murugan and colleagues, with the Kaplan and Levin labs, gave adult frogs a BioDome holding a silk hydrogel loaded with five compounds, chosen to act on inflammation, nerve growth, tissue growth and scarring, for 24 hours after hind-leg amputation. They then followed the frogs for about 18 months. Treated frogs grew longer, more patterned limbs than frogs with a BioDome alone or no BioDome, with some return of function, but not normal legs. This is one lab’s result. Not medical advice: an animal study in frogs, not a human treatment.',
 example:'The striking part is the timescale: a single day of treatment was followed by regrowth over many months. The scene computes how many times longer the growth period was than the treatment, from the two published durations.',
 desc:'A logarithmic time axis from one hour to 18 months after amputation, with the 24-hour treatment and the 18-month follow-up marked, a time slider, a computed ratio of the durations, and a schematic outline for the chosen group.',
 research:['Murugan, Vigran, Miller, Golding, Pham, Sperry, Rasmussen-Ivey, Kane, Kaplan & Levin (2022). Acute multidrug delivery via a wearable bioreactor facilitates long-term limb regeneration and functional recovery in adult Xenopus laevis. Science Advances 8, eabj2164.'],
 dur:14,hint:'Slide along the time axis and choose a group to see the reported outcome.',
 init:()=>({g:'cock',lt:3.5}),
 watch:p=>({g:p<.6?'cock':p<.8?'dome':'none',lt:lerp(0,Math.log10(18*L4_MONTH_D*24),clamp(p/.6,0,1))}),
 ui:[{choose:[['cock','Five compounds'],['dome','BioDome alone'],['none','No BioDome']],label:'Group',get:s=>s.g,act:'g'},{range:'lt',label:'Time since amputation',min:0,max:41,get:s=>Math.round(s.lt*10),act:'lt',show:v=>{const h=Math.pow(10,v/10);return h<48?Math.round(h)+' h':h<24*60?Math.round(h/24)+' days':(h/24/L4_MONTH_D).toFixed(1)+' months'}}],
 on:{g(s,v){s.g=L4_GROUP[v]?v:'cock'},lt(s,v){s.lt=clamp(+v/10,0,Math.log10(18*L4_MONTH_D*24))}},
 draw(s){
  const hEnd=18*L4_MONTH_D*24,lmax=Math.log10(hEnd),X=v=>50+v/lmax*500,h=Math.pow(10,s.lt),ratio=hEnd/L4_DAY_H,gp=L4_GROUP[s.g];
  let out=heading('A 24-hour treatment, then about 18 months');
  out+=L(50,110,550,110,C.line,3);
  for(const [hh,l] of [[1,'1 h'],[24,'1 day'],[24*7,'1 week'],[24*L4_MONTH_D,'1 month'],[hEnd,'18 months']])out+=L(X(Math.log10(hh)),104,X(Math.log10(hh)),116,C.line,2)+TF(X(Math.log10(hh)),134,l,13,C.muted);
  out+=R(X(0),96,X(Math.log10(24))-X(0),10,C.amber,'none',3)+TF((X(0)+X(Math.log10(24)))/2,88,'BioDome on',13,C.amber);
  out+=R(X(Math.log10(24)),96,X(lmax)-X(Math.log10(24)),10,C.greenp,'none',3)+TF(X(2.6),88,'growth followed',13,C.green);
  out+=Ci(X(s.lt),110,8,C.ink,'#fff');
  const lab=h<48?Math.round(h)+' hours':h<24*60?Math.round(h/24)+' days':fmt(Math.round(h/24/L4_MONTH_D*10)/10)+' months';
  out+=L4_badge(50,160,'single')+L4_badge(50+L4_badgeW('single')+8,160,'model');
  out+=L4_tile(50,194,150,'Since amputation',lab,C.ink)+L4_tile(210,194,150,'Growth ÷ treatment',Math.round(ratio)+' times',C.blue);
  out+=TF(50,266,gp.lab,13,C.ink,'start')+TF(50,284,'Reported outcome after ~18 months',13,C.muted,'start');
  out+=L4_limb(470,196,gp.shape,s.lt>=Math.log10(24)?clamp((s.lt-Math.log10(24))/(lmax-Math.log10(24)),0,1):0);
  out+=TF(50,318,'Not medical advice: an animal study in frogs.',13,C.coral,'start');
  out+=L4_note('The limb outline is schematic. Only the durations are from the paper.',350);
  return {svg:out,phase:`${gp.lab}: ${gp.res} At ${lab} after amputation. The growth period was about ${Math.round(ratio)} times as long as the 24-hour treatment.`};
 }});

const L4_CLAIMS=[
 {k:'long',t:'Treated frogs regrew longer limbs',a:'rep'},
 {k:'swim',t:'Some frogs swam using the new limb',a:'rep'},
 {k:'day',t:'The treatment lasted 24 hours',a:'rep'},
 {k:'normal',t:'The new limb was a normal frog leg',a:'not'},
 {k:'human',t:'The treatment works in people',a:'not'},
 {k:'which',t:'Which compound caused which change',a:'not'},
 {k:'press',t:'Company spin-offs and press headlines',a:'out'}];
const L4_BIN={rep:['Reported in frogs',C.green,C.greenp,'Reported'],not:['Not shown',C.coral,C.coralp,'Not shown'],out:['Out of scope',C.muted,'#f1f3f4','Outside']};
SCENE({id:'leg-regrowth-limits',name:'What the frog study shows',tag:'Single-lab finding · Reading a result at its true size',
 definition:'A careful reading separates what was reported from what was not. The 2022 study reported, in adult frogs, longer and more patterned regrowth after one day of treatment, with some return of function. It did not report a normal leg, did not test which of the five compounds did what, and made no claim about people. Not medical advice. Company spin-offs and press coverage are outside this course.',
 example:'Sort each statement into “reported in frogs”, “not shown” or “out of scope”. The tally is computed from your choices; the scene shows the reading this course takes from the paper.',
 desc:'Seven statements about the frog limb study, which the learner sorts into three groups by tapping, with a computed tally.',
 research:['Murugan et al. (2022). Science Advances 8, eabj2164.','Herrera-Rincon et al. (2018). Cell Reports 25, 1593–1609.'],
 dur:14,hint:'Tap a statement to move it through the three groups.',
 init:()=>({put:{},last:''}),
 watch:p=>{const put={},n=Math.floor(p*8);L4_CLAIMS.slice(0,n).forEach(c=>put[c.k]=c.a);return {put,last:n?L4_CLAIMS[Math.min(6,n-1)].k:''}},
 ui:[{b:'Sort all',act:'all'}],
 on:{card(s,k){const c=L4_CLAIMS.find(x=>x.k===k);if(!c)return 'keep';const order=[undefined,'rep','not','out'];s.put[k]=order[(order.indexOf(s.put[k])+1)%4];s.last=k;return 'keep'},all(s){L4_CLAIMS.forEach(c=>s.put[c.k]=c.a);s.last=''}},
 draw(s,f,X){
  let out=heading('Reported, not shown, or out of scope?');
  const keys=['rep','not','out'];keys.forEach((b,i)=>{const [l,ink,bg,sh]=L4_BIN[b];out+=R(330+i*86,46,82,24,bg,'none',6)+TBF(371+i*86,63,sh,12.5,ink)});
  L4_CLAIMS.forEach((c,i)=>{const y=76+i*38,p=s.put[c.k];
   const inner=R(20,y,300,32,p?'#fff':C.pale,p?L4_BIN[p][1]:C.line,8)+TF(30,y+21,c.t,13,C.ink,'start');
   out+=hit(X,'card',c.k,c.t+(p?', sorted as '+L4_BIN[p][0]:''),inner);
   if(p){const x=371+keys.indexOf(p)*86;out+=Ci(x,y+16,9,p===c.a?L4_BIN[p][1]:'#fff',L4_BIN[p][1])+TF(x,y+21,p===c.a?'✓':'?',13,p===c.a?'#fff':C.ink)}});
  const placed=L4_CLAIMS.filter(c=>s.put[c.k]),agree=placed.filter(c=>s.put[c.k]===c.a).length;
  out+=L4_badge(20,344,'single')+TF(580,358,`${placed.length} sorted · ${agree} as this course reads it`,13,C.ink,'end');
  const c=L4_CLAIMS.find(x=>x.k===s.last);
  return {svg:out,phase:(c?`“${c.t}”: this course reads it as ${L4_BIN[c.a][0].toLowerCase()}. `:'')+'Groups: Reported in frogs · Not shown · Out of scope. Not medical advice.'};
 }});
