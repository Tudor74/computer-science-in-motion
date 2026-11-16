/* ===================== Abiogenesis era 5 · Metabolism first? ===================== */
// Vents, mineral catalysts, autocatalytic sets and proton gradients. Almost all of this is open science: every
// scene carries a status tag (demonstrated, plausible or speculative). Pictures are pure functions of state;
// random processes use seeded generators, never Math.random.
const A5_STATUS={demonstrated:['Demonstrated',C.green,C.greenp],plausible:['Plausible',C.amber,C.amberp],speculative:['Speculative',C.coral,C.coralp]};
const A5_tag=k=>{const [t,ink,fill]=A5_STATUS[k];const w=16+t.length*7.6;return R(8,8,w,22,fill,ink,11)+TBF(8+w/2,23,t,12,ink)};
const A5_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const A5_poly=(pts,col,w=2.4,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function A5_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,12,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,12,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
function A5_btn(X,act,arg,label,x,y,w,h,lines,o={}){
 lines=Array.isArray(lines)?lines:[lines];
 const inner=R(x,y,w,h,o.sel?C.pale:'#fff',o.sel?C.blue:C.line,8,o.sel?'stroke-width="2.5"':'stroke-width="1.5"')+lines.map((t,i)=>(i===0?TBF:TF)(x+w/2,y+h/2+5+(i-(lines.length-1)/2)*16,t,13,i===0?C.ink:C.muted)).join('');
 return hit(X,act,arg,label,inner);
}
function A5_wrap(t,n){const out=[''];t.split(' ').forEach(w=>{const c=out[out.length-1];if(c&&(c+' '+w).length>n)out.push(w);else out[out.length-1]=c?c+' '+w:w});return out}
const A5_lines=(x,y,t,n,col=C.ink,anchor='start',dy=17)=>A5_wrap(t,n).map((l,i)=>TF(x,y+i*dy,l,13,col,anchor)).join('');

/* ---------------------------------------------------------------- hydrothermal-vents */
const A5_VENTS={
 black:{name:'Black smoker',T:[370,4],pH:[2.5,6.5],chem:'H₂S, iron and other metals',rock:'iron-sulphide chimneys',col:'#3a3a3a',note:'Too hot for long chains: RNA and proteins fall apart within minutes above about 150 °C.'},
 alk:{name:'Alkaline vent (Lost City)',T:[70,4],pH:[10,6.5],chem:'H₂ and methane',rock:'carbonate and brucite towers',col:'#e8e2d4',note:'Warm, not scalding, and rich in hydrogen: the kind of vent proposed as a cradle for life.'}};
SCENE({id:'hydrothermal-vents',name:'Two kinds of vent',tag:'Black smokers and alkaline towers',
 definition:'Hydrothermal vents are places where heated water seeps out of the sea floor. Black smokers sit on volcanic ridges and pour out acidic water at 350 °C or more; alkaline vents such as Lost City sit off the ridges, where seawater reacts with mantle rock and seeps out warm, alkaline and full of hydrogen.',
 example:'The Lost City field, found in 2000 on the Mid-Atlantic Ridge, has white carbonate towers up to about 60 m tall venting fluid at roughly 40–90 °C and pH 9–11.',
 desc:'A sketch of the chosen vent beside the temperature and pH of the water as vent fluid mixes into the ocean. Move the slider from the vent mouth out into the sea.',
 research:'Corliss et al. (1979). Submarine thermal springs on the Galápagos Rift. Science 203, 1073–1083. Kelley et al. (2001). An off-axis hydrothermal vent field near the Mid-Atlantic Ridge at 30° N. Nature 412, 145–149. Martin, Baross, Kelley & Russell (2008). Hydrothermal vents and the origin of life. Nature Reviews Microbiology 6, 805–814.',
 dur:12,hint:'Switch between the two vents and slide from the vent mouth into the ocean. The mixing profile is a sketch; the end values are measured.',
 init:()=>({v:'alk',d:20}),
 watch(p){return {v:p<.5?'black':'alk',d:Math.round((p<.5?p*2:(p-.5)*2)*100)}},
 ui:[{choose:[['black','Black smoker'],['alk','Alkaline vent']],label:'Vent',get:s=>s.v,act:'v'},{range:'d',label:'Distance into the ocean',min:0,max:100,get:s=>s.d,act:'d',show:v=>v+'%'}],
 on:{v(s,v){s.v=v;return 'keep'},d(s,v){s.d=Number(v);return 'keep'}},
 draw(s){
  const V=A5_VENTS[s.v],m=u=>1/(1+Math.exp(-(u-35)/9)),Tat=u=>V.T[0]+(V.T[1]-V.T[0])*m(u),pHat=u=>V.pH[0]+(V.pH[1]-V.pH[0])*m(u);
  let out=A5_tag('demonstrated','vents exist')+heading(V.name,26);
  out+=R(20,46,230,262,'#dbe9f2','none',8);
  if(s.v==='black'){out+=P('M100 308 L118 120 L132 120 L150 308 Z',C.ink,2,V.col);[0,1,2].forEach(i=>{out+=Ci(125+i*6-6,104-i*16,12+i*6,'#4a4a4a','none','opacity="0.75"')})}
  else{out+=P('M70 308 L86 150 Q92 128 100 150 L108 230 L118 112 Q126 90 134 112 L148 250 L156 190 Q162 172 168 190 L182 308 Z',C.muted,2,V.col)}
  out+=TF(135,330,V.rock,13,C.ink)+TF(135,348,'gives out '+V.chem,13,C.muted);
  const px=20+s.d/100*230;out+=L(px,52,px,300,C.coral,2,'stroke-dasharray="5 4"')+TBF(px,48,'▼',12,C.coral);
  const pT=A5_plot(312,58,262,104,[0,100],[0,400],{yt:[[0,'0'],[200,'200'],[400,'400 °C']],yl:'temperature'});
  const pP=A5_plot(312,196,262,104,[0,100],[0,14],{yt:[[0,'0'],[7,'7'],[14,'14']],xt:[[0,'vent'],[100,'ocean']],yl:'pH (7 = neutral)'});
  out+=pT.svg+pP.svg;
  out+=A5_poly(range(101).map(u=>[pT.X(u),pT.Y(Tat(u))]),C.coral,2.6)+A5_poly(range(101).map(u=>[pP.X(u),pP.Y(pHat(u))]),C.blue,2.6);
  out+=Ci(pT.X(s.d),pT.Y(Tat(s.d)),6,C.coral,'#fff')+Ci(pP.X(s.d),pP.Y(pHat(s.d)),6,C.blue,'#fff');
  out+=L(pP.X(0),pP.Y(7),pP.X(100),pP.Y(7),C.grid,1,'stroke-dasharray="3 4"');
  out+=TBF(443,338,`Here: ${Math.round(Tat(s.d))} °C, pH ${pHat(s.d).toFixed(1)}`,14,C.ink);
  out+=TF(443,358,'ocean value: early-Earth estimate, about pH 6.5',12,C.muted);
  return {svg:out,phase:V.note+' The profile between vent and ocean is a sketch: real mixing happens in turbulent plumes and inside porous rock.'};
 }});

/* ---- concentrating molecules in warm pores (thermophoresis) ---- */
const A5_accum=(h,dT,n)=>Math.exp(0.022*h*dT*Math.sqrt(n)/10);
SCENE({id:'hydrothermal-vents-pores',name:'Pores that concentrate',tag:'Heat flow piles molecules up',
 definition:'In a narrow pore that is warm on one side and cool on the other, molecules drift towards the cold side (thermophoresis) while the water slowly circulates. Together the two movements pile molecules up at the bottom of the pore, and longer molecules pile up far more.',
 example:'Baaske and colleagues showed that DNA in a thin, heated capillary collects at its base, and that the build-up grows steeply with the length of the pore and of the molecule.',
 desc:'A tall pore with a hot wall on the left and a cold wall on the right; dots show molecules, and the bar on the right gives how strongly they are concentrated at the bottom.',
 research:'Baaske, Weinert, Duhr, Lemke, Russell & Braun (2007). Extreme accumulation of nucleotides in simulated hydrothermal pore systems. PNAS 104, 9346–9351. Mast, Schink, Gerland & Braun (2013). Escalation of polymerization in a thermal gradient. PNAS 110, 8030–8035.',
 dur:12,hint:'Make the pore taller, the temperature difference larger, or the molecules longer, and watch them crowd to the bottom. The numbers are illustrative; the steep growth is the published result.',
 init:()=>({h:20,dT:10,n:20}),
 watch(p){return {h:Math.round(5+p*45),dT:10,n:20}},
 ui:[{range:'h',label:'Pore height (mm)',min:2,max:50,get:s=>s.h,act:'h'},{range:'dT',label:'Temperature difference (°C)',min:0,max:30,get:s=>s.dT,act:'dT'},{range:'n',label:'Molecule length (bases)',min:1,max:100,get:s=>s.n,act:'n'}],
 on:{h(s,v){s.h=Number(v);return 'keep'},dT(s,v){s.dT=Number(v);return 'keep'},n(s,v){s.n=Number(v);return 'keep'}},
 draw(s){
  const a=A5_accum(s.h,s.dT,s.n),k=Math.log(a);let out=A5_tag('demonstrated','in lab pores')+heading('A warm pore as a molecule trap',26);
  const x0=150,w=120,y0=56,H=280;out+=R(x0-30,y0,30,H,tint(C.coral,.6),'none',4)+R(x0+w,y0,30,H,tint(C.blue,.6),'none',4);
  out+=TBF(x0-15,y0+H+20,'hot',13,C.coral)+TBF(x0+w+15,y0+H+20,'cold',13,C.blue)+R(x0,y0,w,H,'#f7fbfd',C.line,2);
  out+=P(`M${x0+22} ${y0+H-20} L${x0+22} ${y0+20} Q${x0+60} ${y0} ${x0+98} ${y0+20} L${x0+98} ${y0+H-20} Q${x0+60} ${y0+H} ${x0+22} ${y0+H-20}`,C.line,1.4,'none','stroke-dasharray="4 5"');
  const r=rng(41);for(let i=0;i<80;i++){const u=r(),v=r();const z=k<.01?u:Math.log(1+u*(Math.exp(Math.min(k,30))-1))/Math.min(k,30);out+=Ci(x0+8+v*(w-16),y0+H-6-(1-z)*(H-12),3,C.purple,'none','opacity="0.8"')}
  out+=TF(x0+w/2,y0+H+40,`pore ${s.h} mm tall, ${s.dT} °C across`,13,C.muted);
  const bx=372;out+=TBF(bx+90,74,'Bottom ÷ top concentration',14,C.ink);
  const bar=Math.min(1,Math.log10(Math.max(1,a))/12);out+=R(bx,90,180,22,'#fff',C.grid,4)+R(bx,90,180*bar,22,C.purple,'none',4);
  out+=TBF(bx+90,140,a<1e4?`about ${a<10?a.toFixed(1):Math.round(a).toLocaleString('en-GB')}×`:`about 10^${Math.round(Math.log10(a))}×`,17,C.purple);
  out+=TF(bx+90,160,'bar on a log scale up to 10¹²',12,C.muted);
  out+=A5_lines(bx-14,200,'Taller pores, steeper heat flow and longer molecules all multiply the effect, because molecules ride the slow circulation down and drift to the cold side at every turn.',30);
  out+=A5_lines(bx-14,312,'Why it matters: a dilute ocean is the main obstacle to joining building blocks into chains.',30,C.muted);
  return {svg:out,phase:a>1000?'The molecules are now packed thousands of times more densely at the bottom of the pore than at its top: a natural way round the dilution problem.':a>10?'The molecules are already crowding towards the bottom. Lengthen the pore, warm one side more or use longer molecules, and the build-up grows steeply.':'With a short pore or a small temperature difference the molecules stay spread out. Lengthen the pore or warm one side more.'};
 }});

/* ---- what vent-like reactors have actually made ---- */
const A5_REACT=[
 {k:'herschy',name:'Herschy et al. 2014',set:'Bench reactor, H₂-rich alkaline fluid into acidic water through Fe(Ni)S precipitates',made:'Formaldehyde, at very low (micromolar) amounts',miss:'Yields far below what a living cell would need'},
 {k:'preiner',name:'Preiner et al. 2020',set:'H₂ and CO₂ in water with natural iron and nickel minerals (greigite, magnetite, awaruite), 100 °C',made:'Formate, acetate, pyruvate and methanol: the first steps of the acetyl-CoA pathway',miss:'No feedback loops or long chains; minerals act only as catalysts'},
 {k:'hudson',name:'Hudson et al. 2020',set:'Microfluidic cell with a natural-like pH gradient across a thin mineral wall',made:'Formate from CO₂, driven by the pH difference itself',miss:'Small amounts, in a carefully built device'}];
SCENE({id:'hydrothermal-vents-reactor',name:'Vents in the lab',tag:'What vent-like reactors have made',
 definition:'Researchers build reactors that copy alkaline vents, feeding hydrogen-rich alkaline fluid against acidic, CO₂-rich water across iron–nickel–sulphide minerals, to test whether vents could start carbon chemistry.',
 example:'Preiner and colleagues turned H₂ and CO₂ into formate, acetate and pyruvate using minerals found at vents, the same small molecules at the start of the most ancient carbon-fixing pathway.',
 desc:'Three published experiments as cards: the set-up, what was made and what is still missing. Press a card for its detail.',
 research:'Herschy et al. (2014). An origin-of-life reactor to simulate alkaline hydrothermal vents. Journal of Molecular Evolution 79, 213–227. Preiner et al. (2020). A hydrogen-dependent geochemical analogue of primordial carbon and energy metabolism. Nature Ecology & Evolution 4, 534–542. Hudson et al. (2020). CO₂ reduction driven by a pH gradient. PNAS 117, 22873–22879.',
 dur:12,hint:'Press each card. All three made small molecules; none has made a self-sustaining network.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(2,Math.floor(p*3))}},
 ui:[{choose:A5_REACT.map((r,i)=>[String(i),r.name]),label:'Experiment',get:s=>String(s.k),act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=A5_tag('demonstrated','small molecules')+heading('What vent reactors made',26);
  A5_REACT.forEach((r,i)=>{out+=A5_btn(X,'k',i,'Show '+r.name,20+i*190,50,180,40,r.name,{sel:s.k===i})});
  const r=A5_REACT[s.k];
  out+=TBF(30,120,'Set-up',14,C.ink,'start')+A5_lines(30,140,r.set,84);
  out+=TBF(30,196,'What it made',14,C.green,'start')+A5_lines(30,216,r.made,84);
  out+=TBF(30,272,'Still missing',14,C.coral,'start')+A5_lines(30,292,r.miss,84);
  out+=R(30,322,540,44,C.pale,'none',8)+TF(300,340,'The gap: from formate and acetate to replicating, self-sustaining chemistry',13,C.ink)+TF(300,358,'nobody has crossed it yet, in a vent reactor or anywhere else.',13,C.ink);
  return {svg:out,phase:'Vent chemistry can make the first small carbon molecules from CO₂ and H₂, which is real progress. Whether vents can go further, to networks that copy themselves, is unknown.'};
 }});

/* ---------------------------------------------------------------- iron-sulfur-world */
const A5_FES=[
 {t:'Iron sulphide meets hydrogen sulphide',d:'Volcanic water brings iron sulphide (FeS) and hydrogen sulphide (H₂S) together on a mineral surface.'},
 {t:'Pyrite forms and releases energy',d:'FeS + H₂S → FeS₂ (pyrite) + H₂. Wächtershäuser quoted about −38 kJ per mole: a steady energy source, “pyrite-pulled”.'},
 {t:'CO₂ is reduced on the surface',d:'Electrons from pyrite formation could reduce CO₂ and CO into small carbon molecules bound to the mineral.'},
 {t:'A surface metabolism',d:'Products stay stuck by their charged groups, so they can meet and react: a flat, two-dimensional “metabolism” before any cell.'},
 {t:'The problem',d:'What is stuck cannot leave. How the chemistry let go of the surface and became enclosed is unsolved.'}];
SCENE({id:'iron-sulfur-world',name:'The iron–sulphur world',tag:'Wächtershäuser’s surface metabolism',
 definition:'Günter Wächtershäuser proposed in 1988 that life began as a metabolism on the surface of iron sulphide minerals at volcanic vents, powered by the formation of pyrite, with genes coming later.',
 example:'Forming pyrite from iron sulphide and hydrogen sulphide releases energy and electrons, which he suggested could drive the fixing of carbon on the same mineral surface.',
 desc:'A step-by-step sketch of the proposal on a mineral surface, with the reaction and its energy shown at each step.',
 research:'Wächtershäuser, G. (1988). Before enzymes and templates: theory of surface metabolism. Microbiological Reviews 52, 452–484. Wächtershäuser, G. (1990). Evolution of the first metabolic cycles. PNAS 87, 200–204. Critique: de Duve & Miller (1991). PNAS 88, 10014–10017.',
 dur:12,hint:'Step through the five stages. The last one is the open problem.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(4,Math.floor(p*5))}},
 ui:[{b:'Previous',act:'prev'},{b:'Next stage',act:'next'}],
 on:{prev(s){s.k=Math.max(0,s.k-1);return 'keep'},next(s){s.k=Math.min(4,s.k+1);return 'keep'}},
 draw(s){
  let out=A5_tag('plausible','partly tested')+heading('Life on a mineral surface?',26);
  out+=R(30,250,540,40,'#c9b98a','none',6)+TBF(300,276,'iron sulphide mineral surface',14,'#5a4a20');
  for(let i=0;i<9;i++){const x=60+i*60;out+=P(`M${x} 250 L${x+12} 238 L${x+24} 250`,'#8a7a4a',1.5,'#d9c99a')}
  if(s.k===0){[[140,170,'FeS'],[260,150,'H₂S'],[380,176,'FeS'],[470,140,'H₂S']].forEach(([x,y,t])=>{out+=R(x-22,y-14,44,22,'#fff',C.line,11)+TF(x,y+2,t,12,C.ink)+arrow(x,y+10,x,236,C.line,1.4,6)})}
  if(s.k>=1){for(let i=0;i<3;i++){const x=110+i*170;out+=R(x,226,26,24,'#d4af37','#8a6d00',3)+TF(x+13,220,'FeS₂',12,'#8a6d00')}}
  if(s.k>=2){[[180,180],[350,176],[470,186]].forEach(([x,y])=>{out+=arrow(x,y+44,x,y+8,C.blue,2,7)+TF(x,y,'CO₂ → C–C',12,C.blue)})}
  if(s.k>=3){for(let i=0;i<7;i++){const x=70+i*72;out+=Ci(x,240,6,C.green,'#fff')+L(x,240,x+20,226,C.green,2)+Ci(x+20,226,5,C.green,'#fff')}}
  if(s.k>=4)out+=arrow(300,236,300,140,C.coral,2.4,9)+TBF(300,130,'?',22,C.coral);
  out+=R(30,46,540,62,C.pale,'none',8)+TBF(300,68,`Stage ${s.k+1} of 5 · ${A5_FES[s.k].t}`,14,C.ink)+A5_lines(300,90,A5_FES[s.k].d,86,C.ink,'middle');
  out+=TF(300,318,'FeS + H₂S → FeS₂ + H₂   (about −38 kJ/mol, as quoted by Wächtershäuser)',13,C.muted);
  out+=A5_lines(300,344,'Supporters point to iron–sulphur clusters at the heart of ancient enzymes; critics doubt that a surface could ever give rise to cells.',90,C.muted,'middle');
  return {svg:out,phase:s.k<4?A5_FES[s.k].d:'The iron–sulphur world turned origin-of-life research towards energy and minerals. Its key reactions work in the lab (next scene), but no surface metabolism has been shown to grow or evolve.'};
 }});

/* ---- Huber and Wächtershäuser's experiments ---- */
const A5_CAT={fes:['FeS only',.15],nis:['NiS only',.6],feni:['(Fe,Ni)S',1]};
SCENE({id:'iron-sulfur-world-huber',name:'Activated acetic acid',tag:'Huber & Wächtershäuser, 1997',
 definition:'In 1997 Claudia Huber and Günter Wächtershäuser fed carbon monoxide and methanethiol over a mixed iron–nickel sulphide at about 100 °C and made a thioester, an “activated” form of acetic acid like the acetyl-CoA at the centre of metabolism.',
 example:'With co-precipitated iron and nickel sulphide the reaction worked best; iron sulphide alone barely worked. A year later the same chemistry joined amino acids into short peptides.',
 desc:'A reaction sketch and bars for how much activated acetic acid forms with each catalyst at room temperature or 100 °C. Bar heights are illustrative; their order follows the paper.',
 research:'Huber, C. & Wächtershäuser, G. (1997). Activated acetic acid by carbon fixation on (Fe,Ni)S under primordial conditions. Science 276, 245–247. Huber, C. & Wächtershäuser, G. (1998). Peptides by activation of amino acids with CO on (Ni,Fe)S surfaces. Science 281, 670–672.',
 dur:12,hint:'Choose the catalyst and the temperature. Bar heights are illustrative; the ranking is as published.',
 init:()=>({c:'feni',t:100}),
 watch(p){return {c:['fes','nis','feni'][Math.min(2,Math.floor(p*3))],t:100}},
 ui:[{choose:Object.entries(A5_CAT).map(([k,v])=>[k,v[0]]),label:'Catalyst',get:s=>s.c,act:'c'},{choose:[['25','25 °C'],['100','100 °C']],label:'Temperature',get:s=>String(s.t),act:'t'}],
 on:{c(s,v){s.c=v;return 'keep'},t(s,v){s.t=Number(v);return 'keep'}},
 draw(s){
  let out=A5_tag('demonstrated','the reaction')+heading('Carbon fixed on a mineral',26);
  out+=TBF(300,70,'CO + CH₃SH  →  CH₃–CO–SCH₃  →  acetic acid',16,C.ink);
  out+=TF(300,92,'carbon monoxide + methanethiol → a thioester (activated acetic acid)',13,C.muted);
  const p=A5_plot(110,128,380,162,[0,3],[0,1],{yt:[[0,'none'],[1,'most']],yl:'thioester formed (illustrative)'});out+=p.svg;
  Object.entries(A5_CAT).forEach(([k,[n,v]],i)=>{const h=v*(s.t===100?1:.25),x=p.X(i+.5),sel=k===s.c;out+=R(x-40,p.Y(h),80,p.Y(0)-p.Y(h),sel?C.purple:tint(C.purple,.6),sel?C.ink:'none',4)+TF(x,p.Y(0)+18,n,13,sel?C.ink:C.muted)});
  out+=A5_lines(300,330,s.t===100?'At 100 °C the mixed iron–nickel sulphide gave the most product; nickel matters, as it does in today’s carbon-fixing enzymes.':'At room temperature far less forms: the chemistry needs vent-like heat.',90,C.ink,'middle');
  return {svg:out,phase:'The thioester bond is the same kind of energy-rich bond found in acetyl-CoA, the hub of modern metabolism. The experiment shows such chemistry can happen on minerals; it does not show that it led to life.'};
 }});

/* ---- iron–sulphur clusters: minerals inside enzymes ---- */
const A5_cube=()=>{const pts=[];for(let i=0;i<8;i++){const x=i&1?1:-1,y=i&2?1:-1,z=i&4?1:-1;pts.push({p:[x*.9,y*.9,z*.9],fe:(x*y*z)>0})}return pts};
SCENE({id:'iron-sulfur-world-clusters',name:'Minerals inside enzymes',tag:'Iron–sulphur clusters',
 definition:'Many of the oldest enzymes hold small clusters of iron and sulphur atoms, such as the cube-shaped Fe₄S₄ cluster in ferredoxins, which pass electrons. Their shape resembles units inside iron sulphide minerals like greigite.',
 example:'Ferredoxins are small, very widespread electron-carrying proteins; their simple, repeated sequences led Eck and Dayhoff (1966) to suggest they are among the most ancient proteins.',
 desc:'An Fe₄S₄ cluster drawn as a cube with iron and sulphur at alternating corners, beside a simpler Fe₂S₂ cluster and a note on the mineral greigite. Turn the 3D view to see the cube.',
 research:'Eck, R. V. & Dayhoff, M. O. (1966). Evolution of the structure of ferredoxin based on living relics of primitive amino acid sequences. Science 152, 363–366. Russell, M. J. & Martin, W. (2004). The rocky roots of the acetyl-CoA pathway. Trends in Biochemical Sciences 29, 358–363. Beinert, H., Holm, R. H. & Münck, E. (1997). Iron–sulfur clusters: nature’s modular, multipurpose structures. Science 277, 653–659.',
 dur:12,hint:'Choose a cluster. In 3D, drag to turn the cube. The resemblance to minerals is real; whether it is inherited from the origin of life is debated.',
 init:()=>({c:'4'}),
 watch(p){return {c:p<.4?'2':'4'}},
 ui:[{choose:[['2','Fe₂S₂ cluster'],['4','Fe₄S₄ cluster']],label:'Cluster',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=v;return 'keep'}},
 draw(s){
  let out=A5_tag('demonstrated','in enzymes')+heading('Iron–sulphur clusters',26);
  const cx=170,cy=200;
  if(s.c==='2'){const pts=[[cx-70,cy,'Fe'],[cx+70,cy,'Fe'],[cx,cy-60,'S'],[cx,cy+60,'S']];[[0,2],[2,1],[1,3],[3,0]].forEach(([a,b])=>{out+=L(pts[a][0],pts[a][1],pts[b][0],pts[b][1],C.muted,3)});pts.forEach(([x,y,t])=>{out+=Ci(x,y,22,t==='Fe'?C.coral:'#e8c840','#fff')+TBF(x,y+5,t,14,t==='Fe'?'#fff':C.ink)})}
  else{const o=[[cx-70,cy+40],[cx+40,cy+40],[cx-40,cy+70]],c=A5_cube(),pr=q=>[cx+q[0]*62+q[1]*30,cy-q[2]*62+q[1]*22];
   [[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]].forEach(([a,b])=>{const A=pr(c[a].p),B=pr(c[b].p);out+=L(A[0],A[1],B[0],B[1],C.muted,2.5)});
   c.forEach(v=>{const [x,y]=pr(v.p);out+=Ci(x,y,17,v.fe?C.coral:'#e8c840','#fff')+TBF(x,y+5,v.fe?'Fe':'S',12,v.fe?'#fff':C.ink)})}
  out+=TF(cx,350,s.c==='2'?'two irons bridged by two sulphurs':'Fe and S on alternate corners',13,C.muted);
  out+=TBF(350,80,'Why it is suggestive',14,C.ink,'start');
  out+=A5_lines(350,102,'Enzymes in the oldest carbon-fixing pathway use iron–sulphur and nickel clusters. The mineral greigite (Fe₃S₄), which forms at vents, contains cube-like Fe₄S₄ units too.',32);
  out+=TBF(350,230,'Why caution',14,C.ink,'start');
  out+=A5_lines(350,252,'Similar shapes could reflect inheritance from mineral chemistry, or simply that iron and sulphur are good at moving electrons.',32);
  return {svg:out,phase:'Iron–sulphur clusters are a real, ancient feature of metabolism. Reading them as “mineral fossils” of life’s origin is an attractive but unproven idea.'};
 },
 three(s,f,X,project){
  const P3=project([-1.3,1.3,-1.3,1.3,-1.3,1.3]),c=A5_cube();let out='';
  if(s.c==='2'){const pts=[[-1,0,0,'Fe'],[1,0,0,'Fe'],[0,0,.8,'S'],[0,0,-.8,'S']];[[0,2],[2,1],[1,3],[3,0]].forEach(([a,b])=>{out+=line3(pts[a].slice(0,3),pts[b].slice(0,3),P3,C.muted,3)});
   out+=sortedItems(pts.map(q=>({at:q.slice(0,3),svg:P=>{const p=P(q.slice(0,3));return Ci(p[0],p[1],20,q[3]==='Fe'?C.coral:'#e8c840','#fff')+TBF(p[0],p[1]+5,q[3],13,q[3]==='Fe'?'#fff':C.ink)}})),P3);
   return {svg:out,title:'The Fe₂S₂ cluster',caption:'A flat diamond: two iron atoms bridged by two sulphur atoms.'}}
  [[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]].forEach(([a,b])=>{out+=line3(c[a].p,c[b].p,P3,C.muted,2.5)});
  out+=sortedItems(c.map(v=>({at:v.p,svg:P=>{const p=P(v.p);return Ci(p[0],p[1],18,v.fe?C.coral:'#e8c840','#fff')+TBF(p[0],p[1]+5,v.fe?'Fe':'S',12,v.fe?'#fff':C.ink)}})),P3);
  return {svg:out,title:'The Fe₄S₄ “cubane” cluster',caption:'Iron (red) and sulphur (yellow) on alternate corners of a slightly distorted cube.'};
 }});

/* ---------------------------------------------------------------- autocatalytic-sets */
// Binary-polymer model (Kauffman; Hordijk & Steel): molecules are 0/1 strings up to length n, food is every string
// of length 1 or 2, reactions join or cut strings, and each molecule catalyses on average f randomly chosen reactions.
const A5_rafCache={};
function A5_net(n){
 if(A5_rafCache['n'+n])return A5_rafCache['n'+n];
 const mols=[];for(let L=1;L<=n;L++)for(let v=0;v<(1<<L);v++)mols.push(v.toString(2).padStart(L,'0'));
 const id={};mols.forEach((m,i)=>id[m]=i);const rx=[];
 mols.forEach(m=>{for(let i=1;i<m.length;i++){const a=id[m.slice(0,i)],b=id[m.slice(i)],c=id[m];rx.push({r:[a,b],p:[c]});rx.push({r:[c],p:[a,b]})}});
 const food=mols.map((m,i)=>m.length<=2?i:-1).filter(i=>i>=0);
 return A5_rafCache['n'+n]={mols,rx,food};
}
function A5_poisson(r,l){const L=Math.exp(-l);let k=0,p=1;do{k++;p*=r()}while(p>L);return k-1}
function A5_raf(n,f,seed){
 const {mols,rx,food}=A5_net(n),r=rng(A5_mix(seed*7919+n*31+1)),cat=rx.map(()=>[]);
 mols.forEach((m,i)=>{const k=A5_poisson(r,f);for(let j=0;j<k;j++)cat[Math.floor(r()*rx.length)].push(i)});
 let R=rx.map((_,i)=>i);
 for(;;){const have=new Uint8Array(mols.length);food.forEach(i=>have[i]=1);
  let grew=true;while(grew){grew=false;for(const j of R){const q=rx[j];if(q.r.every(i=>have[i]))for(const p of q.p)if(!have[p]){have[p]=1;grew=true}}}
  const R2=R.filter(j=>rx[j].r.every(i=>have[i])&&cat[j].some(i=>have[i]));
  if(R2.length===R.length)return {size:R.length,total:rx.length,mols:mols.length};R=R2;}
}
function A5_curve(n){const key='c'+n;if(A5_rafCache[key])return A5_rafCache[key];const fs=range(13).map(i=>i*.25);return A5_rafCache[key]=fs.map(f=>[f,range(24).filter(sd=>A5_raf(n,f,sd+100).size>0).length/24])}
SCENE({id:'autocatalytic-sets',name:'Autocatalytic sets',tag:'Chemistry that makes its own catalysts',
 definition:'An autocatalytic set is a group of molecules in which every reaction that makes a member is sped up by some other member, and everything can be built from a simple food supply. Stuart Kauffman argued such sets appear almost inevitably once a chemistry is rich enough.',
 example:'In Hordijk and Steel’s version of Kauffman’s model, a self-sustaining set appears once each molecule catalyses only one or two reactions on average, far less catalysis than Kauffman first thought was needed.',
 desc:'A random chemistry of 0/1 strings, built from a food set of short strings. The curve shows how often a self-sustaining, catalysed set (a RAF set) appears as catalysis increases; the panel on the left gives the current network.',
 research:'Kauffman, S. A. (1986). Autocatalytic sets of proteins. Journal of Theoretical Biology 119, 1–24. Hordijk, W. & Steel, M. (2004). Detecting autocatalytic, self-sustaining sets in chemical reaction systems. Journal of Theoretical Biology 227, 451–461. Hordijk, Kauffman & Steel (2011). Required levels of catalysis for emergence of autocatalytic sets in models of chemical reaction systems. IJMS 12, 3085–3101.',
 dur:12,hint:'Raise the catalysis level and try new random networks. This is a toy version of the published model, run in your browser.',
 init:()=>({f:1,n:6,seed:1}),
 watch(p){return {f:Math.round(p*12)/4,n:6,seed:1}},
 ui:[{range:'f',label:'Reactions catalysed per molecule',min:0,max:3,step:.25,get:s=>s.f,act:'f'},{choose:[['5','Strings up to 5'],['6','up to 6'],['7','up to 7']],label:'Longest molecule',get:s=>String(s.n),act:'n'},{b:'New random network',act:'seed'}],
 on:{f(s,v){s.f=Number(v);return 'keep'},n(s,v){s.n=Number(v);return 'keep'},seed(s){s.seed++;return 'keep'}},
 draw(s){
  const res=A5_raf(s.n,s.f,s.seed),cur=A5_curve(s.n);let out=A5_tag('demonstrated','in models')+heading('When chemistry feeds itself',26);
  out+=R(20,50,230,250,'#fff',C.grid,8)+TBF(135,74,'This network',14,C.ink);
  out+=counter(35,88,'molecules',String(res.mols),C.blue,95)+counter(140,88,'reactions',res.total.toLocaleString('en-GB'),C.blue,95);
  out+=counter(35,146,'in the RAF set',res.size.toLocaleString('en-GB'),res.size?C.green:C.coral,200);
  out+=TBF(135,226,res.size?'Self-sustaining set found':'No self-sustaining set',15,res.size?C.green:C.coral);
  out+=A5_lines(135,250,res.size?'Every reaction in it is catalysed by a member, and all of it can be built from the food.':'Some needed reaction always lacks a catalyst that the food can produce.',30,C.muted,'middle');
  const p=A5_plot(320,62,250,210,[0,3],[0,1],{xt:[[0,'0'],[1,'1'],[2,'2'],[3,'3']],yt:[[0,'0%'],[.5,'50%'],[1,'100%']],xl:'reactions catalysed per molecule',yl:'networks with a RAF set'});
  out+=p.svg+A5_poly(cur.map(([x,y])=>[p.X(x),p.Y(y)]),C.green,2.6);cur.forEach(([x,y])=>{out+=Ci(p.X(x),p.Y(y),3,C.green)});
  out+=L(p.X(s.f),62,p.X(s.f),272,C.coral,1.8,'stroke-dasharray="5 4"');
  out+=TF(300,346,'Each point: 24 random networks. Food = all strings of length 1 and 2.',13,C.muted);
  out+=TF(300,366,'Molecules are 0/1 strings; reactions join two strings or cut one in two.',13,C.muted);
  const half=cur.find(q=>q[1]>=.5);return {svg:out,phase:`In this toy chemistry, with strings up to ${s.n} long, half of all random networks contain a self-sustaining set once each molecule catalyses about ${half?half[0]:3} reactions. Hordijk and Steel found the level needed stays modest and grows only slowly as molecules get longer, not explosively as Kauffman first feared. Whether early-Earth chemistry reached it is open.`};
 }});

/* ---- the formose reaction ---- */
function A5_formose(seed,base){const k=.6*base,c=.04*base,d=.05,dt=.05;let F=1,G=Math.pow(10,seed),Tr=0;const out=[];for(let i=0;i<=600;i++){if(i%6===0)out.push([i*dt,F,G,Tr]);const r=k*G*F*8;const dG=r-d*G,dF=-2*r-c*F,dT=d*G;G=Math.max(0,G+dG*dt);F=Math.max(0,F+dF*dt);Tr+=dT*dt}return out}
SCENE({id:'autocatalytic-sets-formose',name:'The formose reaction',tag:'Sugars that make more sugar',
 definition:'In the formose reaction, discovered by Aleksandr Butlerov in 1861, formaldehyde in warm alkaline water turns into a mixture of sugars. A small sugar, glycolaldehyde, catalyses its own production, so the reaction starts slowly and then suddenly takes off.',
 example:'A trace of glycolaldehyde removes the long lag. Left too long, the sugars go on reacting into a brown tar, the “asphalt problem”; borate minerals can stabilise ribose.',
 desc:'Formaldehyde (blue) being used up, glycolaldehyde and other sugars (green) rising after a lag, and tar (grey) building up from side reactions. Sliders set the starting trace of glycolaldehyde and how alkaline the water is. The model is a sketch.',
 research:'Butlerov, A. (1861). Formation synthétique d’une substance sucrée. Comptes Rendus 53, 145–147. Breslow, R. (1959). On the mechanism of the formose reaction. Tetrahedron Letters 1(21), 22–26. Ricardo, A., Carrigan, M. A., Olcott, A. N. & Benner, S. A. (2004). Borate minerals stabilize ribose. Science 303, 196. Benner, Kim & Carrigan (2012). Accounts of Chemical Research 45, 2025–2034.',
 dur:12,hint:'Add more glycolaldehyde to start the reaction sooner; raise the alkalinity to speed everything up, tar included. The curves are a qualitative model.',
 init:()=>({seed:-4,base:1}),
 watch(p){return {seed:-6+p*4,base:1}},
 ui:[{range:'seed',label:'Starting glycolaldehyde (log₁₀)',min:-7,max:-1,step:.5,get:s=>s.seed,act:'seed'},{range:'base',label:'Alkalinity',min:.5,max:2,step:.1,get:s=>s.base,act:'base',show:v=>v<.8?'mild':v<1.4?'moderate':'strong'}],
 on:{seed(s,v){s.seed=Number(v);return 'keep'},base(s,v){s.base=Number(v);return 'keep'}},
 draw(s){
  const d=A5_formose(s.seed,s.base),p=A5_plot(70,60,330,220,[0,30],[0,1],{xt:[[0,'0'],[10,'10'],[20,'20'],[30,'30']],yt:[[0,'0'],[.5,'0.5'],[1,'1']],xl:'time (arbitrary units)',yl:'amount (relative)'});
  let out=A5_tag('demonstrated','the chemistry')+heading('The formose reaction',26)+p.svg;
  out+=A5_poly(d.map(q=>[p.X(q[0]),p.Y(q[1])]),C.blue,2.6)+A5_poly(d.map(q=>[p.X(q[0]),p.Y(Math.min(1,q[2]))]),C.green,2.6)+A5_poly(d.map(q=>[p.X(q[0]),p.Y(Math.min(1,q[3]))]),C.muted,2.2,'stroke-dasharray="6 4"');
  const half=d.find(q=>q[1]<.5),lag=half?half[0]:null;
  out+=TBF(420,80,'Formaldehyde',13,C.blue,'start')+TBF(420,102,'Sugars',13,C.green,'start')+TBF(420,124,'Tar',13,C.muted,'start');
  out+=TBF(420,168,'Half the formaldehyde',13,C.ink,'start')+TBF(420,188,lag?`used by time ${lag.toFixed(1)}`:'not used in this window',14,lag?C.ink:C.coral,'start');
  out+=A5_lines(420,226,'More seed shortens the lag: the sugar catalyses its own formation.',22,C.muted);
  out+=TF(300,350,'Butlerov 1861 · mechanism: Breslow 1959 · the brown tar is Benner’s “asphalt problem”',13,C.muted);
  return {svg:out,phase:'The formose reaction is a real autocatalytic cycle made of simple sugars. It is also messy: it makes dozens of sugars, mostly not ribose, and ends in tar unless something steers or protects the products.'};
 }});

/* ---- cooperation against selfishness ---- */
function A5_hyper(mode,c,par){const n=par?4:3,x=range(n).map(i=>i<3?[.4,.33,.27][i]:.02),k=[1.15,1,.9,1.1],out=[];
 for(let t=0;t<=500;t++){if(t%5===0)out.push(x.slice());const g=x.map((v,i)=>mode==='selfish'?k[i]:(i<3?c*x[(i+2)%3]:c*x[2]*2));const phi=x.reduce((a,v,i)=>a+v*g[i],0);for(let i=0;i<n;i++)x[i]=Math.max(0,x[i]+.05*x[i]*(g[i]-phi));const sum=x.reduce((a,b)=>a+b,0);for(let i=0;i<n;i++)x[i]/=sum}
 return out}
SCENE({id:'autocatalytic-sets-ecology',name:'Selfish or cooperative?',tag:'Hypercycles and RNA networks',
 definition:'If several replicating molecules compete, the fastest normally wins and the rest die out, losing their information. Manfred Eigen and Peter Schuster proposed the hypercycle, a ring in which each replicator helps the next, so that all of them survive together.',
 example:'In 2012 Nilesh Vaidya and colleagues made fragments of a ribozyme that assemble one another in a cycle; the cooperating network grew faster than a selfish fragment that only copied itself.',
 desc:'Shares of three (or four) replicators over time, stacked. In selfish mode each grows at its own rate; in cooperative mode each grows only with help from the one before it. A “parasite” takes help without giving any.',
 research:'Eigen, M. & Schuster, P. (1977). The hypercycle. Naturwissenschaften 64, 541–565. Vaidya, N., Manapat, M. L., Chen, I. A., Xulvi-Brunet, R., Hayden, E. J. & Lehman, N. (2012). Spontaneous network formation among cooperative RNA replicators. Nature 491, 72–77. Maynard Smith, J. (1979). Hypercycles and the origin of life. Nature 280, 445–446 (the parasite problem).',
 dur:12,hint:'Compare selfish and cooperative growth, then add a parasite to the cooperative ring. The model is a standard textbook sketch.',
 init:()=>({m:'coop',c:1,par:0}),
 watch(p){return {m:p<.4?'selfish':'coop',c:1,par:p>.75?1:0}},
 ui:[{choose:[['selfish','Selfish'],['coop','Cooperative ring']],label:'Mode',get:s=>s.m,act:'m'},{choose:[['0','No parasite'],['1','Add a parasite']],label:'Parasite',get:s=>String(s.par),act:'par'}],
 on:{m(s,v){s.m=v;return 'keep'},par(s,v){s.par=Number(v);return 'keep'}},
 draw(s){
  const d=A5_hyper(s.m,s.c,s.par),p=A5_plot(70,64,360,230,[0,100],[0,1],{xt:[[0,'0'],[50,'time'],[100,'']],yt:[[0,'0%'],[.5,'50%'],[1,'100%']],yl:'share of the population'});
  const cols=[C.blue,C.green,C.amber,C.coral];let out=A5_tag('speculative','as an origin')+heading(s.m==='selfish'?'Selfish replicators compete':'A cooperative ring',26)+p.svg;
  const n=d[0].length;for(let i=n-1;i>=0;i--){const top=d.map((x,t)=>[p.X(t),p.Y(x.slice(0,i+1).reduce((a,b)=>a+b,0))]);out+=P('M'+p.X(0)+' '+p.Y(0)+' L'+top.map(q=>fmt(q[0])+' '+fmt(q[1])).join(' L')+` L${p.X(100)} ${p.Y(0)} Z`,'none',0,tint(cols[i],.25))}
  const last=d[d.length-1];
  ['A','B','C','parasite'].slice(0,n).forEach((nm,i)=>{out+=R(450,80+i*34,16,16,tint(cols[i],.25),cols[i],3)+TF(474,93+i*34,`${nm}: ${Math.round(last[i]*100)}%`,13,C.ink,'start')});
  out+=A5_lines(450,240,s.m==='selfish'?'The fastest replicator wins; the others’ information is lost.':s.par?'The parasite takes help and gives none, and the ring is undermined.':'All three persist, each held up by the one before it.',20,C.muted);
  out+=TF(300,352,s.m==='selfish'?'Selfish: each grows at its own fixed rate.':'Cooperative: A helps B, B helps C, C helps A (and the parasite).',13,C.muted);
  return {svg:out,phase:s.par&&s.m==='coop'?'Parasites are the classic weakness of hypercycles (Maynard Smith 1979). Spatial structure, such as surfaces or compartments, can protect cooperators, one reason protocells matter.':'Cooperation can keep several kinds of information alive at once. RNA networks that do this exist in the lab; whether early life used them is speculative.'};
 }});

/* ---------------------------------------------------------------- proton-gradients */
SCENE({id:'proton-gradients',name:'Chemiosmosis',tag:'How every cell charges its batteries',
 definition:'Peter Mitchell proposed in 1961 that cells make ATP by pumping protons across a membrane and letting them flow back through a rotary enzyme, ATP synthase. The stored push, the proton-motive force, combines an electrical voltage and a pH difference.',
 example:'Each pH unit of difference across a membrane is worth about 59 mV at 25 °C. A mitochondrion with 150 mV of voltage and 0.5 pH units of difference has a proton-motive force of about 180 mV.',
 desc:'A membrane with pumps pushing protons out and ATP synthase letting them back in. Sliders set the voltage and the pH difference; the gauge shows the total push and whether three protons carry enough energy to make one ATP.',
 research:'Mitchell, P. (1961). Coupling of phosphorylation to electron and hydrogen transfer by a chemi-osmotic type of mechanism. Nature 191, 144–148 (Nobel Prize 1978). Jagendorf, A. T. & Uribe, E. (1966). ATP formation caused by acid–base transition of spinach chloroplasts. PNAS 55, 170–177. Lane, N. (2015). The Vital Question. Profile Books.',
 dur:12,hint:'Raise the voltage or the pH difference until three protons can pay for an ATP. This chemistry is universal: it is in every known cell.',
 init:()=>({v:150,ph:.5}),
 watch(p){return {v:Math.round(p*200),ph:.5}},
 ui:[{range:'v',label:'Membrane voltage (mV)',min:0,max:220,step:5,get:s=>s.v,act:'v'},{range:'ph',label:'pH difference',min:0,max:4,step:.1,get:s=>s.ph,act:'ph'}],
 on:{v(s,v){s.v=Number(v);return 'keep'},ph(s,v){s.ph=Number(v);return 'keep'}},
 draw(s){
  const dp=s.v+59.2*s.ph,kJ=96.485*dp/1000,need=50,ok=3*kJ>=need;let out=A5_tag('demonstrated','in all cells')+heading('The proton-motive force',26);
  out+=R(40,166,280,28,'#e8d9b8','none',4)+TF(180,214,'membrane',12,C.muted);
  out+=TBF(180,80,'outside: more H⁺, positive',13,C.coral)+TBF(180,300,'inside: fewer H⁺, negative',13,C.blue);
  {const r=rng(5);for(let i=0;i<14;i++)out+=TBF(50+r()*260,108+r()*42,'H⁺',12,C.coral)}
  out+=R(70,154,36,52,C.blue,'none',6)+arrow(88,236,88,124,'#fff',2.4,8)+TF(88,330,'pump',12,C.blue);
  out+=Ci(250,180,28,C.green,'#fff')+arrow(250,126,250,236,C.green,2.6,8)+TF(250,330,'ATP synthase',12,C.green);
  out+=TBF(250,272,ok?'ADP → ATP':'stalls',13,ok?C.green:C.coral);
  out+=TBF(460,70,'Proton-motive force',14,C.ink);
  out+=TBF(460,96,`${Math.round(dp)} mV`,22,C.purple);
  out+=TF(460,118,`= ${s.v} mV + 59 × ${s.ph.toFixed(1)} pH units`,13,C.muted);
  out+=TF(460,158,`Energy per proton: ${kJ.toFixed(1)} kJ/mol`,13,C.ink)+TF(460,178,`Three protons: ${(3*kJ).toFixed(0)} kJ/mol`,13,C.ink);
  out+=TF(460,198,`Making ATP in a cell: about ${need} kJ/mol`,13,C.muted);
  out+=R(360,216,200,18,'#fff',C.grid,4)+R(360,216,Math.min(200,200*3*kJ/need/1.5),18,ok?C.green:C.coral,'none',4)+L(360+200/1.5,212,360+200/1.5,238,C.ink,2);
  out+=TBF(460,262,ok?'Enough to make ATP':'Not enough yet',14,ok?C.green:C.coral);
  out+=A5_lines(460,296,'Real cells use 2.7 to 4.7 protons per ATP, depending on the synthase; three is a round figure.',30,C.muted,'middle');
  return {svg:out,phase:`A proton-motive force of ${Math.round(dp)} mV gives each proton about ${kJ.toFixed(1)} kJ/mol. Bacteria, archaea, plants and animals all make ATP this way, which is why some think the first cells harnessed a ready-made gradient.`};
 }});

/* ---- a natural gradient at an alkaline vent ---- */
SCENE({id:'proton-gradients-vent',name:'A natural proton gradient',tag:'Vent fluid against ocean water',
 definition:'At an alkaline vent, fluid at pH 9–11 meets ocean water that, on the early Earth, was probably nearer pH 6–7 because of high CO₂. Across the thin mineral walls between them lies a natural proton gradient, oriented the same way as in cells.',
 example:'A difference of three pH units is worth about 180 mV at 25 °C, close to the proton-motive force that living cells maintain.',
 desc:'A thin mineral wall with vent fluid on one side and ocean water on the other; sliders set the two pH values, and the gauge compares the natural gradient with a typical cell’s.',
 research:'Russell, M. J. & Hall, A. J. (1997). The emergence of life from iron monosulphide bubbles at a submarine hydrothermal redox and pH front. Journal of the Geological Society 154, 377–402. Lane, N. & Martin, W. F. (2012). The origin of membrane bioenergetics. Cell 151, 1406–1416. Halevy, I. & Bachan, A. (2017). The geologic history of seawater pH. Science 355, 1069–1071 (early-ocean pH estimates).',
 dur:12,hint:'Set the vent and ocean pH. Early-ocean pH is an estimate, with a wide range.',
 init:()=>({vent:10,sea:6.5}),
 watch(p){return {vent:10,sea:Math.round((8-p*2.5)*10)/10}},
 ui:[{range:'vent',label:'Vent fluid pH',min:7,max:11,step:.1,get:s=>s.vent,act:'vent'},{range:'sea',label:'Early ocean pH (estimate)',min:5,max:8.5,step:.1,get:s=>s.sea,act:'sea'}],
 on:{vent(s,v){s.vent=Number(v);return 'keep'},sea(s,v){s.sea=Number(v);return 'keep'}},
 draw(s){
  const d=s.vent-s.sea,mv=59.2*d;let out=A5_tag('plausible','as life’s battery')+heading('A ready-made battery',26);
  out+=R(30,60,150,240,tint(C.blue,.75),'none',6)+R(200,60,150,240,tint(C.purple,.8),'none',6)+R(180,60,20,240,'#b9a37a','#7a6a40',2);
  out+=TBF(105,86,'ocean',14,C.blue)+TBF(105,108,`pH ${s.sea.toFixed(1)}`,14,C.ink)+TBF(275,86,'vent fluid',14,C.purple)+TBF(275,108,`pH ${s.vent.toFixed(1)}`,14,C.ink);
  out+=TF(190,54,'thin Fe(Ni)S wall',12,C.muted);
  const nH=Math.max(0,Math.min(24,Math.round(d*5)));{const r=rng(9);for(let i=0;i<nH;i++)out+=TBF(45+r()*120,140+r()*140,'H⁺',12,C.coral)}
  if(d>0)out+=arrow(150,200,232,200,C.coral,2.4,8);
  out+=TBF(465,80,'Natural gradient',14,C.ink)+TBF(465,108,d>0?`${Math.round(mv)} mV`:'none',22,d>0?C.purple:C.coral);
  out+=TF(465,130,`${d.toFixed(1)} pH units × 59 mV`,13,C.muted);
  const g=A5_plot(380,150,170,120,[0,1],[0,300],{yt:[[0,'0'],[150,'150'],[300,'300 mV']]});
  out+=g.svg+R(400,g.Y(Math.max(0,mv)),55,g.Y(0)-g.Y(Math.max(0,mv)),C.purple,'none',3)+R(475,g.Y(180),55,g.Y(0)-g.Y(180),C.green,'none',3);
  out+=TF(427,290,'vent',12,C.muted)+TF(502,290,'a cell',12,C.muted);
  out+=A5_lines(300,330,d>=2.5?'Comparable to the push a living cell keeps up: a natural gradient that early life might have tapped before it could pump.':'Too small a difference to rival a cell’s proton-motive force.',86,C.ink,'middle');
  return {svg:out,phase:'Lane and Martin argue that the first cells used this natural gradient, which would explain why chemiosmosis is universal. Critics note that tapping it needs membranes and proteins that may not have existed yet; it remains a hypothesis.'};
 }});

/* ---- leaky membranes and the antiporter (Sojo, Pomiankowski & Lane) ---- */
const A5_LEAK={
 'leaky-off':[.55,'A leaky membrane lets vent protons stream in as fast as they arrive, so the natural gradient is felt right across the cell.'],
 'leaky-on':[.85,'An antiporter swaps incoming protons for sodium going out, turning the natural proton gradient into a sodium gradient too: a first step towards making its own.'],
 'tight-off':[.05,'A tight membrane blocks the natural gradient. Without pumps of its own, the cell has no usable gradient at all.'],
 'tight-on':[.1,'Tight and with an antiporter but still no pump: there is little gradient for the antiporter to work on.']};
SCENE({id:'proton-gradients-leaky',name:'Leaky first membranes',tag:'Why tight membranes needed pumps',
 definition:'Sojo, Pomiankowski and Lane modelled early cells sitting on a vent wall. With leaky membranes, the natural proton gradient could be used; sealing the membrane only made sense once cells had their own pumps. They suggest bacteria and archaea did this separately, which might explain why their membranes are so different.',
 example:'In their model, a sodium–proton antiporter lets a leaky cell turn the vent’s proton gradient into a sodium gradient as well, a stepping stone to independence from the vent.',
 desc:'A small cell on a vent wall. Choose a leaky or tight membrane, with or without an antiporter, and see how much of a usable gradient the cell can draw on. Values are illustrative.',
 research:'Sojo, V., Pomiankowski, A. & Lane, N. (2014). A bioenergetic basis for membrane divergence in archaea and bacteria. PLoS Biology 12, e1001926. Lane, N. & Martin, W. F. (2012). Cell 151, 1406–1416. Critique: Jackson, J. B. (2016). Natural pH gradients in hydrothermal alkali vents were unlikely to have played a role in the origin of life. Journal of Molecular Evolution 83, 1–11.',
 dur:12,hint:'Try all four combinations. The bar heights are illustrative; the ordering comes from the published model.',
 init:()=>({m:'leaky',a:'off'}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {m:k<2?'leaky':'tight',a:k%2?'on':'off'}},
 ui:[{choose:[['leaky','Leaky membrane'],['tight','Tight membrane']],label:'Membrane',get:s=>s.m,act:'m'},{choose:[['off','No antiporter'],['on','Na⁺/H⁺ antiporter']],label:'Antiporter',get:s=>s.a,act:'a'}],
 on:{m(s,v){s.m=v;return 'keep'},a(s,v){s.a=v;return 'keep'}},
 draw(s){
  const [u,note]=A5_LEAK[s.m+'-'+s.a];let out=A5_tag('speculative','a model')+heading('A cell on the vent wall',26);
  out+=R(30,250,300,30,'#b9a37a','#7a6a40',2)+TF(180,300,'vent wall: alkaline fluid below, ocean above',12,C.muted);
  out+=P('M70 250 Q70 120 180 120 Q290 120 290 250',s.m==='leaky'?C.amber:C.ink,s.m==='leaky'?2:4,'#f7fbfd',s.m==='leaky'?'stroke-dasharray="8 6"':'');
  out+=TBF(180,100,s.m==='leaky'?'leaky membrane':'tight membrane',13,s.m==='leaky'?C.amber:C.ink);
  if(s.m==='leaky'){for(let i=0;i<5;i++){const x=95+i*42;out+=arrow(x,104,x,146,C.coral,1.8,6)}}
  if(s.a==='on'){out+=R(250,170,30,36,C.purple,'none',6)+arrow(240,178,212,178,'#fff',1.8,6)+TF(265,224,'Na⁺/H⁺',11,C.purple);out+=TBF(200,170,'Na⁺ out',12,C.purple)}
  out+=TBF(460,80,'Usable gradient',14,C.ink);
  out+=R(400,100,120,200,'#fff',C.grid,4)+R(400,100+200*(1-u),120,200*u,u>.5?C.green:u>.2?C.amber:C.coral,'none',4);
  out+=TF(460,318,'illustrative',12,C.muted);
  out+=A5_lines(300,342,note,88,C.ink,'middle');
  return {svg:out,phase:'This is a model, and a disputed one: critics argue the vent’s natural gradient could not have been tapped across a mineral wall without modern proteins. It is a clear, testable idea rather than an established account.'};
 }});
