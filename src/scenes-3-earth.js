/* ===================== Abiogenesis era 3 · The early Earth ===================== */
// A molten world cools, oceans form, the oldest traces of life are argued over, impacts rain down, and
// rocks fly between planets. Every picture is a pure function of state (and X); random processes are seeded.
// Each scene carries a status tag: demonstrated, plausible or speculative.

/* ---- shared helpers ---- */
const A3_STATUS={demonstrated:C.green,plausible:C.amber,speculative:C.coral};
function A3_tag(st){const col=A3_STATUS[st],w=16+st.length*7.6;return R(10,8,w,24,'#fff',col,12,'stroke-width="1.6"')+TBF(10+w/2,25,st,13,col)}
function A3_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+18,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||36),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
const A3_poly=(pts,col,w=2.4,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function A3_wrap(t,n){const out=[''];t.split(' ').forEach(w=>{const c=out[out.length-1];if(c&&(c+' '+w).length>n)out.push(w);else out[out.length-1]=c?c+' '+w:w});return out}
function A3_btn(X,act,arg,label,x,y,w,h,lines,o={}){
 lines=Array.isArray(lines)?lines:[lines];
 const inner=R(x,y,w,h,o.sel?C.pale:'#fff',o.sel?C.blue:C.line,8,o.sel?'stroke-width="2.5"':'stroke-width="1.4"')+lines.map((t,i)=>(i===0&&o.bold!==false?TBF:TF)(x+w/2,y+h/2+5+(i-(lines.length-1)/2)*17,t,13,o.ink||C.ink)).join('');
 return hit(X,act,arg,label,inner);
}
const A3_dur=y=>y<1/365?Math.max(1,Math.round(y*8766))+' hours':y<1?Math.round(y*365)+' days':y<10?y.toFixed(1)+' years':y<1e6?Math.round(y).toLocaleString('en-GB')+' years':(y/1e6).toPrecision(2)+' million years';
const A3_count=n=>n>=1e6?(n/1e6).toPrecision(2)+' million':Math.max(1,Math.round(n)).toLocaleString('en-GB');
const A3_ga=v=>v.toFixed(2).replace(/0$/,'')+' Ga';

/* ================================================================ hadean-earth */
const A3_EVENTS=[
 [4.567,'Solar System’s first solids','The oldest grains in meteorites date the start of the Solar System: 4.567 billion years ago.'],
 [4.50,'Moon-forming impact','A Mars-sized body strikes the young Earth; the debris forms the Moon (date debated, about 4.5).'],
 [4.40,'Oldest zircon crystal','A zircon grain from Jack Hills, Australia, formed 4.40 billion years ago: there was already crust.'],
 [4.30,'Liquid water likely','Oxygen isotopes in zircons hint at crust that had met liquid water near the surface.'],
 [4.03,'Oldest dated rock','The Acasta gneiss in Canada is the oldest whole rock yet dated: about 4.03 billion years.'],
 [3.70,'Contested signs of life','Isua, Greenland: claimed stromatolites and light carbon. Both are disputed.'],
 [3.48,'Widely accepted signs of life','Pilbara, Australia: stromatolites and hot-spring deposits most geologists accept.']];
SCENE({id:'hadean-earth',name:'The Hadean Earth',tag:'The first billion years',
 definition:'The Hadean is Earth’s first eon, from its formation 4.57 billion years ago to about 4.0 billion years ago. It was named for Hades because it was imagined as a hellish molten world, but tiny zircon crystals show that crust, and probably oceans, formed within a few hundred million years.',
 example:'A zircon grain from the Jack Hills of Western Australia is 4.40 billion years old, only about 160 million years younger than the Earth itself.',
 desc:'A timeline of the first 1.1 billion years with a picture of the planet at the chosen time: molten, then crusted, then with oceans. Key dated events are marked below.',
 research:'Connelly et al. (2012). The absolute chronology and thermal processing of solids in the solar protoplanetary disk. Science 338, 651–655 (4,567 million years). Wilde, Valley, Peck & Graham (2001). Nature 409, 175–178 (4.404 Ga zircon). Bowring & Williams (1999). Contributions to Mineralogy and Petrology 134, 3–16 (Acasta gneiss). Valley et al. (2014). Nature Geoscience 7, 219–223.',
 dur:12,hint:'Slide the time from the Solar System’s first solids to the first widely accepted signs of life.',
 init:()=>({t:4.40}),
 watch(p){return {t:4.567-p*1.087}},
 ui:[{range:'t',label:'Billion years ago',min:3.48,max:4.567,step:.01,get:s=>s.t,act:'t',show:v=>Number(v).toFixed(2)}],
 on:{t(s,v){s.t=Number(v)}},
 draw(s){
  const t=s.t,X=a=>60+(4.567-a)/1.087*480;let out=A3_tag('demonstrated')+heading('The first billion years',30);
  // the planet
  const cx=150,cy=160,r=82,molten=t>4.45,crust=t>4.32;
  out+=Ci(cx,cy,r,molten?'#e8662f':crust?'#5b4a43':'#2f6fa3',molten?'#b5401a':'#2b3d47','stroke-width="2.5"');
  if(molten){out+=P(`M${cx-50} ${cy-30} Q${cx} ${cy-60} ${cx+40} ${cy-20} M${cx-60} ${cy+20} Q${cx-10} ${cy} ${cx+55} ${cy+35}`,'#ffd27a',3)}
  else if(crust){out+=P(`M${cx-55} ${cy-20} L${cx-10} ${cy-40} L${cx+30} ${cy-10} M${cx-40} ${cy+30} L${cx+10} ${cy+15} L${cx+60} ${cy+30}`,'#f08a4b',2.4)}
  else{out+=P(`M${cx-50} ${cy-35} Q${cx-30} ${cy-55} ${cx-5} ${cy-38} Q${cx+5} ${cy-15} ${cx-25} ${cy-10} Z`,'#7b6b55',1.5,'#9a8a6e')+P(`M${cx+15} ${cy+20} Q${cx+45} ${cy+5} ${cx+60} ${cy+30} Q${cx+40} ${cy+50} ${cx+20} ${cy+40} Z`,'#7b6b55',1.5,'#9a8a6e')}
  out+=TF(cx,cy+r+24,molten?'molten surface':crust?'thin crust, steam atmosphere':'oceans and small islands',13,C.ink);
  // what has happened so far
  const done=A3_EVENTS.filter(e=>e[0]>=t-1e-9),last=done[done.length-1];
  out+=TBF(272,74,A3_ga(t)+' (billion years ago)',15,C.ink,'start');
  out+=TBF(272,104,last?last[1]:'',14,C.blue,'start');
  (last?A3_wrap(last[2],42):[]).forEach((l,i)=>{out+=TF(272,128+i*19,l,13,C.ink,'start')});
  out+=TF(272,206,`${done.length} of ${A3_EVENTS.length} key events have happened`,13,C.muted,'start');
  // timeline
  out+=L(60,300,540,300,C.line,3);
  A3_EVENTS.forEach(([a],i)=>{const x=X(a),on=a>=t-1e-9;out+=Ci(x,300,7,on?C.blue:'#fff',C.blue)+TF(x,i%2?286:326,String(i+1),13,on?C.blue:C.muted)});
  [4.5,4.3,4.1,3.9,3.7,3.5].forEach(a=>{out+=TF(X(a),352,a.toFixed(1),13,C.muted)});
  out+=TF(300,372,'billion years ago (numbers mark the events in order)',13,C.muted);
  out+=L(X(t),262,X(t),316,C.coral,2.4)+P(`M${X(t)-6} 256 L${X(t)+6} 256 L${X(t)} 266 Z`,C.coral,1,C.coral);
  return {svg:out,phase:'Status: demonstrated. The ages come from radioactive clocks in meteorites, zircons and rocks, each with an uncertainty of a few million years; the Moon-forming impact’s date is still argued over. What these early rocks say about life is far less certain.'};
 }});

/* ---- the faint young Sun ---- */
const A3_lum=age=>1/(1+.4*(1-(4.57-age)/4.57));   // Gough (1981), relative to today
SCENE({id:'hadean-earth-cooling',name:'The faint young Sun',tag:'Why was early Earth not frozen?',
 definition:'Stars like the Sun brighten as they age. Four billion years ago the Sun gave out only about three-quarters of today’s light, so with today’s air the oceans should have frozen. Yet rocks show liquid water. This is the faint young Sun paradox; a stronger greenhouse effect is the usual answer.',
 example:'With today’s greenhouse warming of about 33 °C, Earth 4 billion years ago would average about −4 °C: below freezing. Doubling the greenhouse effect keeps the oceans liquid.',
 desc:'The Sun’s brightness at the chosen time (Gough’s formula), the temperature Earth would have without a greenhouse effect, and the surface temperature after adding the chosen greenhouse warming, against the freezing line.',
 research:'Sagan & Mullen (1972). Earth and Mars: evolution of atmospheres and surface temperatures. Science 177, 52–56. Gough (1981). Solar interior structure and luminosity variations. Solar Physics 74, 21–34. Feulner (2012). The faint young Sun problem. Reviews of Geophysics 50, RG2006. Temperatures use today’s reflectivity (albedo 0.3), a simplification.',
 dur:12,hint:'Go back in time and the Sun dims. How much greenhouse warming keeps the ocean liquid 4 billion years ago?',
 init:()=>({age:4.0,gh:33}),
 watch(p){return p<.5?{age:p*2*4.0,gh:33}:{age:4.0,gh:33+(p-.5)*2*45}},
 ui:[{range:'age',label:'Billion years ago',min:0,max:4.4,step:.1,get:s=>s.age,act:'age',show:v=>Number(v).toFixed(1)},{range:'gh',label:'Greenhouse warming (°C)',min:0,max:80,get:s=>s.gh,act:'gh'}],
 on:{age(s,v){s.age=Number(v)},gh(s,v){s.gh=Number(v)}},
 draw(s){
  const Lr=A3_lum(s.age),Te=255*Math.pow(Lr,.25),Ts=Te+s.gh,frozen=Ts<273.15;let out=A3_tag('plausible')+heading('The faint young Sun',30);
  // sun
  const sr=26+Lr*30;out+=Ci(110,120,sr,'#ffd27a','#e0a23a','stroke-width="2.5"')+TBF(110,126,Math.round(Lr*100)+'%',16,C.ink)+TF(110,196,'of today’s sunlight',13,C.ink);
  // thermometer: 200 K to 330 K
  const Y=k=>320-(k-200)/130*240;
  out+=R(270,74,34,252,'#fff',C.line,17)+R(276,Y(Math.min(330,Math.max(200,Ts))),22,326-Y(Math.min(330,Math.max(200,Ts))),frozen?C.blue:C.coral,'none',11);
  [[223.15,'−50'],[273.15,'0'],[298.15,'25'],[323.15,'50']].forEach(([k,l])=>{out+=L(306,Y(k),314,Y(k),C.muted,1.5)+TF(318,Y(k)+4,l+' °C',13,C.muted,'start')});
  out+=L(262,Y(273.15),306,Y(273.15),C.blue,1.6,'stroke-dasharray="5 4"');
  out+=L(256,Y(Te),270,Y(Te),C.ink,2.2)+TF(250,Y(Te)+4,'no greenhouse',13,C.ink,'end');
  // read-outs
  const c=v=>(v-273.15).toFixed(0).replace('-','−')+' °C';
  out+=TBF(400,92,'Without greenhouse',13,C.muted,'start')+TBF(400,114,c(Te),16,C.ink,'start');
  out+=TBF(400,148,'+ greenhouse warming',13,C.muted,'start')+TBF(400,170,'+'+s.gh+' °C',16,C.ink,'start');
  out+=TBF(400,206,'Average surface',13,C.muted,'start')+TBF(400,230,c(Ts),20,frozen?C.blue:C.coral,'start');
  out+=TBF(400,262,frozen?'Oceans freeze':'Oceans stay liquid',15,frozen?C.blue:C.green,'start');
  out+=TF(300,352,`${s.age.toFixed(1)} billion years ago · today’s greenhouse adds about 33 °C`,13,C.muted);
  return {svg:out,phase:`Status: plausible. ${frozen?'With this little greenhouse warming the young Earth would freeze over, yet zircons and sediments show liquid water.':'A stronger greenhouse than today’s keeps the water liquid.'} Which gases did it (carbon dioxide, methane, hydrogen) and how much darker or brighter the early Earth was are still debated (Feulner 2012).`};
 }});

/* ---- zircon clocks and oxygen ---- */
const A3_LAMBDA=1.55125e-10;   // decay constant of uranium-238, per year (Jaffey et al. 1971)
const A3_age=r=>Math.log(1+r)/A3_LAMBDA/1e9;
const A3_ratio=a=>Math.exp(A3_LAMBDA*a*1e9)-1;
const A3_GRAINS=[[4.40,6.4],[4.35,7.1],[4.25,5.5],[4.18,6.8],[4.10,5.2],[3.95,5.6],[3.90,6.0]];
SCENE({id:'hadean-earth-zircons',name:'Zircon clocks',tag:'Dating a grain of sand',
 definition:'Zircon crystals take in uranium but almost no lead when they form. Uranium-238 then decays to lead-206 at a known rate, so the ratio of lead to uranium inside a grain is a clock. The grain’s oxygen isotopes are a second clue: heavier oxygen than the mantle’s means the rock it grew from had met liquid water.',
 example:'A lead-206 to uranium-238 ratio of 0.98 gives an age of 4.40 billion years. Zircons from the mantle have δ¹⁸O near 5.3‰; several Jack Hills grains reach 6–7.4‰.',
 desc:'Left: the uranium–lead clock for the chosen ratio. Right: oxygen isotope value against age for a set of Hadean zircon grains (values illustrative, in the range reported), with the mantle band shaded. Press a grain to date it.',
 research:'Jaffey et al. (1971). Physical Review C 4, 1889–1906 (uranium decay constants). Wilde, Valley, Peck & Graham (2001). Nature 409, 175–178. Mojzsis, Harrison & Pidgeon (2001). Oxygen-isotope evidence from ancient zircons for liquid water at the Earth’s surface 4,300 Myr ago. Nature 409, 178–181. Valley et al. (2014). Nature Geoscience 7, 219–223. Grain values here are illustrative.',
 dur:12,hint:'Move the lead-to-uranium ratio, or press a grain on the plot. Grains above the shaded mantle band grew from rock that had met liquid water.',
 init:()=>({r:A3_ratio(4.40),g:0}),
 watch(p){const g=Math.min(6,Math.floor(p*7));return {g,r:A3_ratio(A3_GRAINS[g][0])}},
 ui:[{range:'r',label:'Lead-206 ÷ uranium-238',min:0,max:1,step:.005,get:s=>s.r,act:'r',show:v=>Number(v).toFixed(3)}],
 on:{r(s,v){s.r=Number(v);s.g=-1},grain(s,v){s.g=Number(v);s.r=A3_ratio(A3_GRAINS[s.g][0]);return 'keep'}},
 draw(s,f,X){
  const age=A3_age(s.r),frac=1/(1+s.r);let out=A3_tag('plausible')+heading('Zircon clocks',30);
  // decay bars
  out+=TBF(130,70,'Inside the grain',14,C.ink);
  out+=R(40,90,180,28,'#f1f5f7','none',4)+R(40,90,180*frac,28,C.green,'none',4)+TF(46,109,'uranium-238',13,'#fff','start');
  out+=R(40,128,180,28,'#f1f5f7','none',4)+R(40,128,180*(1-frac),28,C.amber,'none',4)+TF(46,147,'lead-206',13,(1-frac)>.35?'#fff':C.ink,'start');
  out+=TF(130,184,'age = ln(1 + Pb ÷ U) ÷ λ',13,C.muted);
  out+=TBF(130,214,age.toFixed(2)+' billion years',17,C.blue);
  out+=TF(130,236,'λ = 1.55125 × 10⁻¹⁰ per year',13,C.muted);
  // isotope plot
  const pl=A3_plot(310,70,250,220,[4.5,3.8],[4,8],{xt:[[4.5,'4.5'],[4.3,'4.3'],[4.1,'4.1'],[3.9,'3.9']],yt:[[4,'4'],[5,'5'],[6,'6'],[7,'7'],[8,'8']],xl:'age (billion years)',xlDy:34,yl:'δ¹⁸O (‰)'});
  out+=pl.svg+R(310,pl.Y(5.9),250,pl.Y(4.7)-pl.Y(5.9),tint(C.blue,.8),'none',0)+TF(555,pl.Y(4.7)-6,'mantle 5.3 ± 0.6',13,C.blue,'end');
  A3_GRAINS.forEach(([a,o],i)=>{const sel=s.g===i;out+=hit(X,'grain',i,`Grain ${i+1}: ${a} billion years, δ¹⁸O ${o}‰`,Ci(pl.X(a),pl.Y(o),sel?9:7,o>5.9?C.coral:C.blue,sel?C.ink:'#fff','stroke-width="2.5"'))});
  if(age<=4.5&&age>=3.8)out+=L(pl.X(age),70,pl.X(age),290,C.green,1.8,'stroke-dasharray="5 4"');
  const g=s.g>=0?A3_GRAINS[s.g]:null;
  out+=TF(300,340,g?`Grain ${s.g+1}: ${g[0].toFixed(2)} billion years, δ¹⁸O ${g[1]}‰`:'Your ratio dates a grain to '+age.toFixed(2)+' billion years',13,C.ink);
  out+=TF(300,360,g?(g[1]>5.9?'Heavier than the mantle: grew from rock altered by water':'Within the mantle range'):'Red grains sit above the mantle band',13,g&&g[1]>5.9?C.coral:C.muted);
  out+=TF(300,378,'grain values illustrative',13,C.muted);
  return {svg:out,phase:'Status: plausible. The ages are demonstrated (zircon dating is among the most precise in geology, and atom-probe work confirmed the oldest grain is not an artefact). That oceans existed by about 4.3 billion years ago is an inference from oxygen isotopes, widely accepted but still argued over.'};
 }});

/* ================================================================ oldest-evidence */
const A3_CLAIMS=[
 {a:'4.10',n:'Carbon inside a zircon',w:'Jack Hills',v:'speculative',d:'Graphite sealed inside a 4.1-billion-year-old zircon has light carbon, as life makes; non-living chemistry can make it too.',r:'Bell et al. 2015'},
 {a:'3.77+',n:'Iron tubes and filaments',w:'Nuvvuagittuq',v:'contested',d:'Haematite tubes like those vent bacteria make. Both the rock’s age (3.77 to 4.28) and the tubes’ origin are disputed.',r:'Dodd et al. 2017'},
 {a:'3.70',n:'Cone-shaped “stromatolites”',w:'Isua',v:'contested',d:'Reported as microbial mounds; a later study argued they are folds made by deformation of the rock.',r:'Nutman 2016; Allwood 2018'},
 {a:'3.70',n:'Light graphite in sediments',w:'Isua',v:'debated',d:'Graphite with light carbon in sea-floor sediments: a biological source is plausible but not proven.',r:'Rosing 1999'},
 {a:'3.48',n:'Stromatolites, hot springs',w:'Pilbara',v:'accepted',d:'Layered mounds and hot-spring deposits in the Dresser Formation: most geologists accept a biological origin.',r:'Djokic et al. 2017'},
 {a:'3.47',n:'Apex chert filaments',w:'Pilbara',v:'debated',d:'Hailed as microfossils (Schopf 1993), argued to be mineral artefacts (Brasier 2002), backed again by isotopes (Schopf 2018).',r:'Schopf; Brasier'},
 {a:'3.43',n:'Strelley Pool stromatolites',w:'Pilbara',v:'accepted',d:'A reef of varied stromatolites over kilometres: widely accepted as biological.',r:'Allwood et al. 2006'}];
const A3_VCOL={accepted:C.green,debated:C.amber,contested:C.coral,speculative:C.purple};
SCENE({id:'oldest-evidence',name:'The oldest evidence of life',tag:'Claims and challenges',
 definition:'Claims of the earliest life rest on three kinds of trace: shapes (microfossils, layered stromatolites), chemistry (carbon enriched in the lighter isotope) and settings. The older the rock, the more it has been heated, squeezed and altered, so every claim older than about 3.5 billion years has been challenged.',
 example:'The 3.43-billion-year-old Strelley Pool stromatolites are widely accepted; the 3.7-billion-year-old Isua “stromatolites” are contested.',
 desc:'Seven published claims of early life, oldest first, each with the current view of the research community. Press a claim to read what was found and how it was challenged.',
 research:'Bell, Boehnke, Harrison & Mao (2015). PNAS 112, 14518–14521. Dodd et al. (2017). Nature 543, 60–64. Nutman et al. (2016). Nature 537, 535–538. Allwood et al. (2018). Nature 563, 241–244. Rosing (1999). Science 283, 674–676. Djokic et al. (2017). Nature Communications 8, 15263. Schopf (1993). Science 260, 640–646. Brasier et al. (2002). Nature 416, 76–81. Allwood et al. (2006). Nature 441, 714–718.',
 dur:14,hint:'Press each claim. Notice how the community view changes with age: the oldest are all disputed.',
 init:()=>({c:2}),
 watch(p){return {c:Math.min(6,Math.floor(p*7))}},
 ui:[],
 on:{c(s,v){s.c=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=A3_tag('plausible')+heading('The oldest evidence of life',30);
  out+=TF(30,58,'Ga',13,C.muted,'start')+TF(90,58,'claim · place',13,C.muted,'start')+TF(536,58,'view',13,C.muted);
  A3_CLAIMS.forEach((c,i)=>{const y=64+i*36,sel=s.c===i,col=A3_VCOL[c.v];
   out+=hit(X,'c',i,`${c.n}, ${c.w}, ${c.a} billion years: ${c.v}`,R(20,y,560,32,sel?C.pale:'#fff',sel?C.blue:C.grid,6,sel?'stroke-width="2.2"':'')+TBF(30,y+21,c.a,13,C.ink,'start')+TF(90,y+21,`${c.n} · ${c.w}`,13,C.ink,'start')+R(490,y+6,86,20,tint(col,.82),'none',10)+TBF(533,y+21,c.v,13,col))});
  const c=A3_CLAIMS[s.c];A3_wrap(c.d,82).slice(0,2).forEach((l,i)=>{out+=TF(300,334+i*18,l,13,C.ink)});
  out+=TF(300,372,'Source: '+c.r,13,C.muted);
  return {svg:out,phase:'Status: plausible. Life by about 3.5 billion years ago is widely accepted; older claims are open. Each challenge asks the same question: could heat, pressure or non-living chemistry have made this shape or this carbon?'};
 }});

/* ---- light carbon ---- */
const A3_SAMPLES=[['isua','Isua graphite, 3.7 Ga',-19],['jack','Jack Hills inclusion, 4.1 Ga',-24],['plant','Living plants today',-27],['mantle','Carbon from the mantle',-6],['carb','Limestone (carbonate)',0]];
SCENE({id:'oldest-evidence-carbon',name:'Light carbon',tag:'An isotope fingerprint',
 definition:'Carbon comes as light carbon-12 and heavy carbon-13. The enzyme life uses to fix carbon dioxide, RuBisCO, prefers the lighter one, so living matter is short of carbon-13 by about 20 to 30 parts per thousand (δ¹³C of −20 to −30‰). Old graphite that light is a hint of life, but some non-living reactions sort isotopes too.',
 example:'Isua graphite measures about −19‰; carbon in the Jack Hills zircon about −24‰; plants today about −27‰; limestone about 0‰.',
 desc:'A δ¹³C scale from +5‰ to −50‰ with the range typical of life shaded and the chosen sample marked. A toggle adds the range that non-living reactions can also reach (illustrative).',
 research:'Schidlowski (1988). A 3,800-million-year isotopic record of life from carbon in sedimentary rocks. Nature 333, 313–318. Rosing (1999). Science 283, 674–676. Bell et al. (2015). PNAS 112, 14518–14521. McCollom & Seewald (2006). Earth and Planetary Science Letters 243, 74–84 (carbon isotopes in non-living Fischer–Tropsch-type synthesis).',
 dur:12,hint:'Pick a sample, then switch on the non-living sources. Where do the ranges overlap?',
 init:()=>({smp:'isua',abio:'off'}),
 watch(p){return {smp:A3_SAMPLES[Math.min(4,Math.floor(p*5))][0],abio:p>.6?'on':'off'}},
 ui:[{choose:A3_SAMPLES.map(x=>[x[0],x[1].split(',')[0]]),label:'Sample',get:s=>s.smp,act:'smp'},{choose:[['off','Life only'],['on','Add non-living sources']],label:'Ranges',get:s=>s.abio,act:'abio'}],
 on:{smp(s,v){s.smp=v},abio(s,v){s.abio=v}},
 draw(s){
  const smp=A3_SAMPLES.find(x=>x[0]===s.smp),Xs=d=>60+(5-d)/55*480;let out=A3_tag('plausible')+heading('Light carbon',30);
  out+=TF(300,66,'δ¹³C = (¹³C/¹²C in sample ÷ ¹³C/¹²C in standard − 1) × 1,000',13,C.muted);
  out+=R(Xs(-18),110,Xs(-36)-Xs(-18),48,tint(C.green,.75),'none',4)+TF((Xs(-18)+Xs(-36))/2,102,'typical of life (roughly −18 to −36‰)',13,C.green);
  if(s.abio==='on')out+=R(Xs(-10),166,Xs(-40)-Xs(-10),24,tint(C.coral,.72),'none',4)+TF((Xs(-10)+Xs(-40))/2,184,'some non-living reactions (illustrative)',13,C.coral);
  out+=L(60,240,540,240,C.ink,2);
  [5,0,-10,-20,-30,-40,-50].forEach(d=>{out+=L(Xs(d),236,Xs(d),246,C.ink,1.5)+TF(Xs(d),264,(d>0?'+':'')+String(d).replace('-','−'),13,C.muted)});
  out+=TF(300,284,'δ¹³C (‰): further right = lighter carbon',13,C.muted);
  A3_SAMPLES.forEach(([k,,d])=>{if(k!==s.smp)out+=Ci(Xs(d),240,5,'#fff',C.muted)});
  out+=Ci(Xs(smp[2]),240,9,C.blue,'#fff','stroke-width="2.5"')+arrow(Xs(smp[2]),204,Xs(smp[2]),226,C.blue,2.2,8);
  const life=smp[2]<=-18&&smp[2]>=-36;
  out+=TBF(300,334,`${smp[1]}: ${String(smp[2]).replace('-','−')}‰`,14,C.ink);
  out+=TF(300,356,life?(s.abio==='on'?'In the life range, but non-living chemistry can reach it too':'In the range typical of life'):'Outside the range typical of life',13,life?(s.abio==='on'?C.coral:C.green):C.muted);
  return {svg:out,phase:'Status: plausible. Light carbon in old rocks fits life, but on its own it cannot prove it: hot-fluid reactions can also make light carbon, and heating can shift values. Isotopes are strongest when they agree with shapes and setting.'};
 }});

/* ---- cones or folds ---- */
SCENE({id:'oldest-evidence-cones',name:'Cones or folds?',tag:'The Isua debate in three dimensions',
 definition:'A stromatolite is a mound built by layers of microbes trapping sediment; its inner layers follow its outer shape, and a cone looks like a cone from every side. A fold made by squeezing rock can look like a cone in one cut, but seen along its length it is a long ridge, and its inner layers do not follow the shape.',
 example:'In 2016 Nutman and colleagues reported 3.7-billion-year-old cone-shaped stromatolites at Isua, Greenland. In 2018 Allwood and colleagues looked at the same outcrop in three dimensions and argued the “cones” are elongated ridges made by deformation.',
 desc:'Two structures cut by a vertical plane at a chosen angle to their long axis: a true stromatolite cone (left) and a deformation ridge (right). Inner layers are drawn: they follow the cone’s shape but cut straight across the ridge.',
 research:'Nutman, Bennett, Friend, Van Kranendonk & Chivas (2016). Rapid emergence of life shown by discovery of 3,700-million-year-old microbial structures. Nature 537, 535–538. Allwood, Rosing, Flannery, Hurowitz & Heirwegh (2018). Reassessing evidence of life in 3,700-million-year-old rocks of Greenland. Nature 563, 241–244. Nutman and colleagues have replied defending their reading; the debate continues.',
 dur:12,hint:'Turn the cut. A real cone keeps its shape; a ridge flattens out when you cut along it.',
 init:()=>({ang:90}),
 watch(p){return {ang:Math.round(90-p*80)}},
 ui:[{range:'ang',label:'Angle of the cut to the long axis (°)',min:10,max:90,step:5,get:s=>s.ang,act:'ang',show:v=>v+'°'}],
 on:{ang(s,v){s.ang=Number(v)}},
 draw(s){
  const sn=Math.sin(s.ang*Math.PI/180);let out=A3_tag('speculative')+heading('Cones or folds?',30);
  const base=270,hgt=120;
  // stromatolite cone: same in every cut, layers follow shape
  out+=TBF(150,70,'Stromatolite cone',14,C.ink);
  for(let k=0;k<5;k++){const sc=1-k*.18;out+=P(`M${150-80*sc} ${base} L150 ${base-hgt*sc} L${150+80*sc} ${base}`,k?C.green:C.ink,k?1.8:2.6)}
  out+=L(40,base,260,base,C.ink,2);
  out+=TF(150,296,'width 160 at every angle',13,C.muted)+TF(150,316,'inner layers follow the cone',13,C.green);
  // deformation ridge: cross-section widens as 1/sin
  const w=Math.min(250,80/sn);
  out+=TBF(450,70,'Deformation ridge',14,C.ink);
  out+=`<clipPath id="a3clip"><rect x="320" y="80" width="260" height="${base-79}"/></clipPath>`;
  out+=`<g clip-path="url(#a3clip)">`+P(`M${450-w} ${base} L450 ${base-hgt} L${450+w} ${base} Z`,C.ink,2.6,'#f1ece2');
  for(let k=1;k<6;k++){const y=base-k*20;out+=L(320,y+8,580,y-8,C.coral,1.6)}
  out+=`</g>`+L(320,base,580,base,C.ink,2);
  out+=TF(450,296,`width ${Math.round(2*w)} at ${s.ang}°`+(2*w>=500?' (wider than the view)':''),13,C.muted)+TF(450,316,'inner layers cut straight across',13,C.coral);
  out+=TF(300,350,s.ang>=75?'Cut across the ridge, both look like cones: what a single outcrop face shows.':'Cut along the ridge, the “cone” flattens out: a fold, not a mound.',13,C.ink);
  return {svg:out,phase:'Status: speculative. The Isua structures are contested: their discoverers see microbial mounds, critics see folds altered by later fluids. Shape alone is weak evidence in rocks this deformed; the layers inside and the chemistry matter as much.'};
 }});

/* ================================================================ bombardment-timeline */
const A3_flux=(m,a)=>{
 if(m==='spike')return Math.pow(10,1.2-3.2*(4.5-a))+30*Math.exp(-Math.pow((a-3.9)/.05,2))+.03;
 if(m==='saw')return a>4.15?Math.pow(10,2-(4.5-a)/.35*2.2):Math.pow(10,.5-(4.15-a)*2.3);
 return Math.pow(10,2-3*(4.5-a))};
const A3_MODELS=[['spike','Late spike (cataclysm)'],['saw','Sawtooth'],['decline','Steady decline']];
SCENE({id:'bombardment-timeline',name:'The bombardment',tag:'A spike or a slow decline?',
 definition:'The Moon’s craters record the rain of asteroids and comets on the early Earth–Moon system. In the 1970s, many Apollo rock ages clustered near 3.9 billion years, suggesting a “late heavy bombardment”: a sudden spike of impacts. Many researchers now favour a mostly declining rate, perhaps with a smaller late uptick.',
 example:'If the spike was real, the young Earth was battered just as the first signs of life appear in the rocks; if the rate simply declined, the worst impacts came earlier.',
 desc:'Relative impact rate (log scale) against time for three models: a late spike at 3.9 billion years, a sawtooth with a smaller uptick, and a steady decline. Curves are illustrative shapes, not fits.',
 research:'Tera, Papanastassiou & Wasserburg (1974). Isotopic evidence for a terminal lunar cataclysm. Earth and Planetary Science Letters 22, 1–21. Gomes, Levison, Tsiganis & Morbidelli (2005). Nature 435, 466–469. Morbidelli et al. (2012). Earth and Planetary Science Letters 355–356, 144–151 (sawtooth). Boehnke & Harrison (2016). PNAS 113, 10802–10806. Bottke & Norman (2017). Annual Review of Earth and Planetary Sciences 45, 619–647.',
 dur:12,hint:'Compare the three models and move the time cursor. Which one puts the most impacts after the oldest zircons?',
 init:()=>({m:'spike',a:3.9}),
 watch(p){return {m:A3_MODELS[Math.min(2,Math.floor(p*3))][0],a:4.4-((p*3)%1)*.9}},
 ui:[{choose:A3_MODELS,label:'Model',get:s=>s.m,act:'m'},{range:'a',label:'Billion years ago',min:3.5,max:4.5,step:.01,get:s=>s.a,act:'a',show:v=>Number(v).toFixed(2)}],
 on:{m(s,v){s.m=v},a(s,v){s.a=Number(v)}},
 draw(s){
  const pl=A3_plot(80,60,440,230,[4.5,3.5],[-1.5,2.2],{xt:[[4.5,'4.5'],[4.3,'4.3'],[4.1,'4.1'],[3.9,'3.9'],[3.7,'3.7'],[3.5,'3.5']],yt:[[-1,'0.1'],[0,'1'],[1,'10'],[2,'100']],xl:'billion years ago',xlDy:34,yl:'impact rate (relative, log scale)'});
  let out=A3_tag('plausible')+heading('The bombardment',30)+pl.svg;
  A3_MODELS.forEach(([k])=>{if(k===s.m)return;out+=A3_poly(range(101).map(i=>{const a=4.5-i/100;return [pl.X(a),pl.Y(Math.max(-1.5,Math.min(2.2,Math.log10(A3_flux(k,a)))))]}),C.grid,1.8)});
  out+=A3_poly(range(201).map(i=>{const a=4.5-i/200;return [pl.X(a),pl.Y(Math.max(-1.5,Math.min(2.2,Math.log10(A3_flux(s.m,a)))))]}),C.coral,3);
  const v=Math.log10(A3_flux(s.m,s.a));out+=L(pl.X(s.a),60,pl.X(s.a),290,C.blue,1.6,'stroke-dasharray="5 4"')+Ci(pl.X(s.a),pl.Y(Math.max(-1.5,Math.min(2.2,v))),7,C.blue,'#fff');
  out+=L(pl.X(4.4),60,pl.X(4.4),290,C.green,1.4,'stroke-dasharray="2 4"')+TF(pl.X(4.4)+4,78,'oldest zircon',13,C.green,'start');
  const note={spike:'A sudden spike near 3.9: first read from Apollo rock ages (1974).',saw:'Declining rate with a smaller uptick near 4.1 (Morbidelli et al. 2012).',decline:'Mostly smooth decline: favoured by many studies since 2016.'}[s.m];
  out+=TF(300,350,note,13,C.ink)+TF(300,370,`rate at ${s.a.toFixed(2)} billion years: ${Math.pow(10,v)>=10?Math.round(Math.pow(10,v)):Math.pow(10,v).toFixed(2)} (relative, illustrative)`,13,C.muted);
  return {svg:out,phase:'Status: plausible. That the early Earth was struck far more often than today is demonstrated by craters. Whether there was a late spike is now doubted: the evidence may come from biased sampling around one lunar basin, as the next scene shows.'};
 }});

/* ---- Apollo sampling bias ---- */
const A3_BINS=range(14).map(i=>4.35-i*.05);
const A3_BG=[2,3,3,4,4,5,5,6,5,5,4,3,2,2],A3_IMB=[0,0,0,0,0,0,1,5,11,6,1,0,0,0];
SCENE({id:'bombardment-timeline-apollo',name:'One basin, many ages',tag:'How sampling can make a spike',
 definition:'All six Apollo landing sites lie on the Moon’s near side, many near the huge Imbrium basin. Molten rock splashed out by one giant impact can travel across the Moon, so many “impact-melt” samples may record the same event. Heating can also partly reset argon clocks, pulling ages together.',
 example:'If a large share of the dated melts are Imbrium ejecta, a cluster near 3.9 billion years tells us about one impact, not about the rate of all impacts.',
 desc:'A histogram of impact-melt ages (counts illustrative). Samples that may be Imbrium ejecta are shown in coral; remove them and the spike flattens into a broad, low hump.',
 research:'Haskin, Korotev, Rockow & Jolliff (1998). The case for an Imbrium origin of the Apollo thorium-rich impact-melt breccias. Meteoritics & Planetary Science 33, 959–975. Boehnke & Harrison (2016). Illusory Late Heavy Bombardments. PNAS 113, 10802–10806. Zellner (2017). Origins of Life and Evolution of Biospheres 47, 261–280. Counts here are illustrative.',
 dur:12,hint:'Remove the samples that may come from the Imbrium impact and see what happens to the spike.',
 init:()=>({imb:'in'}),
 watch(p){return {imb:p<.55?'in':'out'}},
 ui:[{choose:[['in','Include possible Imbrium ejecta'],['out','Remove them']],label:'Samples',get:s=>s.imb,act:'imb'}],
 on:{imb(s,v){s.imb=v}},
 draw(s){
  const inc=s.imb==='in',pl=A3_plot(80,60,440,230,[4.4,3.65],[0,18],{xt:[[4.35,'4.35'],[4.15,'4.15'],[3.95,'3.95'],[3.75,'3.75']],yt:[[0,'0'],[5,'5'],[10,'10'],[15,'15']],xl:'age of impact melt (billion years)',xlDy:34,yl:'number of samples (illustrative)'});
  let out=A3_tag('plausible')+heading('One basin, many ages',30)+pl.svg;
  const bw=pl.X(4.35)-pl.X(4.4);
  A3_BINS.forEach((a,i)=>{const x=pl.X(a)-bw/2+2,b=A3_BG[i],m=inc?A3_IMB[i]:0;out+=R(x,pl.Y(b),bw-4,pl.Y(0)-pl.Y(b),C.blue,'none',2);if(m)out+=R(x,pl.Y(b+m),bw-4,pl.Y(b)-pl.Y(b+m),C.coral,'none',2)});
  const tot=sum(A3_BG)+(inc?sum(A3_IMB):0);
  out+=R(92,70,14,14,C.blue,'none',3)+TF(112,82,'other impacts',13,C.ink,'start')+R(92,92,14,14,C.coral,'none',3)+TF(112,104,'possible Imbrium ejecta',13,C.ink,'start');
  out+=TF(300,350,inc?`${tot} samples: a sharp spike near 3.9 billion years`:`${tot} samples: the spike flattens into a broad, low hump`,13,C.ink);
  out+=TF(300,370,'Imbrium’s age is itself debated (about 3.9 billion years or a little older)',13,C.muted);
  return {svg:out,phase:'Status: plausible. Sampling bias and partial resetting of argon ages can both create an apparent spike from a declining rate. Meteorites, which come from random places, show a broader spread of impact ages, one reason the cataclysm is now doubted.'};
 }});

/* ---- could impacts sterilise the Earth? ---- */
const A3_E=(dkm,v)=>.5*3000*Math.PI/6*Math.pow(dkm*1e3,3)*Math.pow(v*1e3,2);
const A3_EOCEAN=1.4e21*2.6e6;   // J: heat and vaporise all ocean water from about 15 °C (lower bound)
SCENE({id:'bombardment-timeline-sterilise',name:'Could an impact sterilise Earth?',tag:'Energy against the oceans',
 definition:'A big enough impact could boil the oceans and kill everything near the surface. The energy is ½mv²: an impactor’s mass grows with the cube of its diameter, so size matters hugely. Life deep in the crust might still survive.',
 example:'The 10 km Chicxulub impactor that ended the dinosaurs released about 3 × 10²³ joules; boiling off all the oceans needs at least about 4 × 10²⁷ joules, over ten thousand times more.',
 desc:'Kinetic energy of a rocky impactor (density 3,000 kg/m³) of chosen diameter and speed, on a log scale, against the energy needed to heat and vaporise all of Earth’s ocean water (a lower bound).',
 research:'Sleep, Zahnle, Kasting & Morowitz (1989). Annihilation of ecosystems by large asteroid impacts on the early Earth. Nature 342, 139–142. Abramov & Mojzsis (2009). Microbial habitability of the Hadean Earth during the late heavy bombardment. Nature 459, 419–422. Marchi et al. (2014). Widespread mixing and burial of Earth’s Hadean crust by asteroid impacts. Nature 511, 578–582.',
 dur:12,hint:'Grow the impactor. How big must it be before its energy matches what it takes to boil the oceans?',
 init:()=>({d:100,v:17}),
 watch(p){return {d:Math.round(Math.pow(10,1+p*1.8)),v:17}},
 ui:[{range:'d',label:'Diameter (km)',min:1,max:600,get:s=>s.d,act:'d',show:v=>v+' km'},{range:'v',label:'Speed (km/s)',min:12,max:30,get:s=>s.v,act:'v',show:v=>v+' km/s'}],
 on:{d(s,v){s.d=Number(v)},v(s,v){s.v=Number(v)}},
 draw(s){
  const E=A3_E(s.d,s.v),Xe=e=>60+(Math.log10(e)-20)/10*480;let out=A3_tag('plausible')+heading('Impact energy',30);
  // impactor and Earth to scale (Earth radius 6,371 km)
  const er=60,ir=Math.max(1.5,er*s.d/2/6371);out+=Ci(100,140,er,'#2f6fa3','#2b3d47')+Ci(100+er+30+ir,140-er+10,ir,'#8a7a66','#2b3d47')+TF(100,224,'Earth and impactor to scale',13,C.muted);
  const m=3000*Math.PI/6*Math.pow(s.d*1e3,3),sci=e=>{const k=Math.floor(Math.log10(e));return (e/Math.pow(10,k)).toFixed(1)+' × 10'+String(k).split('').map(c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('')};
  out+=TBF(260,86,'Energy = ½ m v²',14,C.ink,'start')+TF(260,110,`mass ${sci(m)} kg`,13,C.ink,'start')+TBF(260,136,`${sci(E)} joules`,16,C.coral,'start');
  const ratio=E/A3_EOCEAN;out+=TF(260,162,ratio>=1?`${ratio.toFixed(ratio<10?1:0)} × the energy to boil the oceans`:`${(ratio*100).toPrecision(2)}% of the energy to boil the oceans`,13,ratio>=1?C.coral:C.ink,'start');
  // log energy axis
  out+=L(60,262,540,262,C.ink,2);for(let k=20;k<=30;k+=2)out+=L(Xe(Math.pow(10,k)),258,Xe(Math.pow(10,k)),266,C.ink,1.5)+TF(Xe(Math.pow(10,k)),284,'10'+String(k).split('').map(c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join(''),13,C.muted);
  out+=TF(300,304,'joules (log scale)',13,C.muted);
  out+=L(Xe(3e23),236,Xe(3e23),262,C.muted,1.6)+TF(Xe(3e23),230,'Chicxulub',13,C.muted);
  out+=L(Xe(A3_EOCEAN),226,Xe(A3_EOCEAN),262,C.blue,2.2)+TF(Xe(A3_EOCEAN),220,'boil all oceans',13,C.blue);
  const xe=Math.max(60,Math.min(540,Xe(E)));out+=Ci(xe,262,8,C.coral,'#fff');
  out+=TF(300,340,'The ocean line is a lower bound: much impact energy goes into rock and space,',13,C.ink);
  out+=TF(300,358,'so models put full ocean loss at impactors of a few hundred kilometres.',13,C.ink);
  return {svg:out,phase:`Status: plausible. A ${s.d} km impactor at ${s.v} km/s carries ${sci(E)} J. Models suggest impacts large enough to boil the oceans were rare even in the Hadean, and that microbes deep in the crust would likely have survived (Abramov & Mojzsis 2009), so life may have started more than once, or survived underground.`};
 }});

/* ================================================================ panspermia */
const A3_STAGES=[
 {k:'eject',n:'Ejection',d:'A large impact on Mars throws rocks off at escape speed. Spalled surface rocks can leave with only mild shock (Melosh 1988).',st:'demonstrated'},
 {k:'travel',n:'Journey',d:'Most Martian rocks orbit the Sun for millions of years; a small share reach Earth, a few within decades (Gladman et al. 1996).',st:'demonstrated'},
 {k:'entry',n:'Entry and landing',d:'Only a thin outer crust melts. The inside of the Martian meteorite ALH84001 never got hotter than about 40 °C (Weiss et al. 2000).',st:'demonstrated'},
 {k:'life',n:'Living cargo',d:'Whether any microbe could survive all three steps, and then thrive on arrival, has not been shown.',st:'speculative'}];
SCENE({id:'panspermia',name:'Panspermia',tag:'Rocks between planets',
 definition:'Panspermia is the idea that life travelled to Earth from elsewhere. Its testable form, lithopanspermia, says microbes could ride inside rocks blasted off one planet and landing on another. Rocks certainly travel: hundreds of meteorites found on Earth came from Mars. Whether life travelled with them is unknown.',
 example:'ALH84001, a Martian meteorite found in Antarctica in 1984, crossed from Mars to Earth without its interior ever being heated enough to sterilise it.',
 desc:'Mars, Earth and the path of a meteorite between them, with four stages. Press a stage: three are demonstrated for rocks, the fourth, life, is not.',
 research:'Melosh (1988). The rocky road to panspermia. Nature 332, 687–688. Gladman, Burns, Duncan, Lee & Levison (1996). The exchange of impact ejecta between terrestrial planets. Science 271, 1387–1392. Weiss et al. (2000). A low temperature transfer of ALH84001 from Mars to Earth. Science 290, 791–795.',
 dur:12,hint:'Press each stage of the journey. Which steps are shown for rocks, and which for living things?',
 init:()=>({st:0}),
 watch(p){return {st:Math.min(3,Math.floor(p*4))}},
 ui:[],
 on:{st(s,v){s.st=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=A3_tag(A3_STAGES[s.st].st==='speculative'?'speculative':'plausible')+heading('Panspermia: rocks between planets',30);
  out+=Ci(90,150,42,'#c86b3c','#8a3b1a')+TF(90,212,'Mars',13,C.ink)+Ci(510,150,56,'#2f6fa3','#2b3d47')+TF(510,228,'Earth',13,C.ink);
  out+=P('M132 140 Q300 40 454 140',C.muted,2,'none','stroke-dasharray="6 5"');
  const pos=[[150,120],[300,72],[440,124],[470,180]][s.st];out+=Ci(pos[0],pos[1],8,'#8a7a66',C.ink);
  A3_STAGES.forEach((g,i)=>{const x=24+i*140,sel=s.st===i;out+=A3_btn(X,'st',i,`${g.n}: ${g.st}`,x,250,128,46,[g.n,g.st],{sel,ink:g.st==='speculative'?C.coral:C.ink})});
  A3_wrap(A3_STAGES[s.st].d,80).slice(0,2).forEach((l,i)=>{out+=TF(300,326+i*18,l,13,C.ink)});
  return {svg:out,phase:'Status: rocks moving between planets is demonstrated; life moving with them is speculative. Panspermia also does not explain how life began: it only moves the question to another planet.'};
 }});

/* ---- survival in space ---- */
const A3_SHIELD=[['none','No shield',-3.5],['mm','A few mm of rock',.6],['m','A metre of rock',5.5]];   // log10 of the time (years) for a 10-fold fall, illustrative
SCENE({id:'panspermia-survival',name:'Surviving the journey',tag:'Spores in space',
 definition:'Bacterial spores are among the toughest living things. Unshielded, the Sun’s ultraviolet light kills them within minutes to hours in space. A few millimetres of rock block the ultraviolet; then the slower damage comes from cosmic rays and drying out, so survival depends on how long the journey lasts.',
 example:'Spores of Bacillus subtilis kept in the dark on the outside of the International Space Station survived about a year and a half, while those exposed to full sunlight mostly died.',
 desc:'Surviving spores out of a billion, on a log scale, against journey time, for three amounts of shielding. The curves are an illustrative exponential model, not fitted data.',
 research:'Horneck, Klaus & Mancinelli (2010). Space microbiology. Microbiology and Molecular Biology Reviews 74, 121–156. Wassmann et al. (2012). Survival of spores of the UV-resistant Bacillus subtilis strain MW01 after exposure to low-Earth orbit and simulated Martian conditions. Astrobiology 12, 498–507. Curves here are illustrative.',
 dur:12,hint:'Lengthen the journey and change the shielding. When does the last spore die?',
 init:()=>({lt:3,sh:'mm'}),
 watch(p){return {lt:-4+p*11,sh:A3_SHIELD[Math.min(2,Math.floor(p*3))][0]}},
 ui:[{choose:A3_SHIELD.map(x=>[x[0],x[1]]),label:'Shielding',get:s=>s.sh,act:'sh'},{range:'lt',label:'Journey time',min:-4,max:7,step:.1,get:s=>s.lt,act:'lt',show:v=>A3_dur(Math.pow(10,v))}],
 on:{sh(s,v){s.sh=v},lt(s,v){s.lt=Number(v)}},
 draw(s){
  const pl=A3_plot(90,60,420,220,[-4,7],[0,9],{xt:[[-3.94,'1 hr'],[-2.56,'1 day'],[0,'1 yr'],[2,'100'],[4,'10⁴'],[6,'10⁶']],yt:[[0,'1'],[3,'10³'],[6,'10⁶'],[9,'10⁹']],xl:'journey time (years, log scale)',xlDy:34,yl:'spores alive, out of a billion'});
  let out=A3_tag('speculative')+heading('Spores in space',30)+pl.svg;
  const live=(k,lt)=>Math.max(0,9-Math.pow(10,lt-k));
  A3_SHIELD.forEach(([key,name,k])=>{const sel=key===s.sh;out+=A3_poly(range(221).map(i=>{const lt=-4+i/20;return [pl.X(lt),pl.Y(live(k,lt))]}).filter(p=>p[1]<=pl.Y(0)+.01),sel?C.blue:C.grid,sel?3:1.8)});
  const k=A3_SHIELD.find(x=>x[0]===s.sh)[2],v=live(k,s.lt);out+=Ci(pl.X(s.lt),pl.Y(v),7,v>0?C.blue:C.coral,'#fff');
  out+=TF(300,346,v>0?`After ${A3_dur(Math.pow(10,s.lt))}: about ${A3_count(Math.pow(10,v))} of a billion spores alive`:`After ${A3_dur(Math.pow(10,s.lt))}: every spore is dead`,13,v>0?C.ink:C.coral);
  out+=TF(300,366,'Model: survivors fall ten-fold per fixed time; times are illustrative',13,C.muted);
  return {svg:out,phase:'Status: speculative. Spores survive short trips when shielded, but Martian rocks usually take millions of years to reach Earth. Whether enough life could survive the slow cosmic-ray dose is unknown, and no living microbe has been found in a meteorite.'};
 }});

/* ---- where would that leave us? ---- */
const A3_ORIG=[
 {n:'Life began on Earth',y:'Simplest: no journey needed. Fits life appearing soon after Earth cooled.',q:'Does not by itself say how.',st:'plausible'},
 {n:'Began on Mars, came here',y:'Early Mars may have had dry land, wet–dry cycles and useful minerals.',q:'Moves the question to Mars; no Martian life found yet.',st:'speculative'},
 {n:'Came from deep space',y:'Space holds many organic molecules, made without life.',q:'Journeys between stars take far too long for survival.',st:'speculative'},
 {n:'Sent on purpose',y:'Crick and Orgel’s 1973 “directed panspermia”, a thought experiment.',q:'Untestable as stated; moves the question again.',st:'speculative'}];
SCENE({id:'panspermia-question',name:'Moving the question',tag:'What panspermia does and does not explain',
 definition:'Every version of panspermia leaves the origin of life itself unexplained: it only moves it somewhere else. It would matter, though: if life could travel, then early Mars or another world could have been where it started, perhaps under better conditions.',
 example:'In 1973 Francis Crick and Leslie Orgel suggested, half in earnest, that life might have been sent on purpose: “directed panspermia”. Even they noted it explained nothing about how life first began.',
 desc:'Four answers to “where did Earth’s life start?”. Press one to see what it explains, what it leaves open, and its status.',
 research:'Crick & Orgel (1973). Directed panspermia. Icarus 19, 341–346. Benner & Kim (2015). The case for a Martian origin for Earth life. Proceedings of SPIE 9606 (argued, speculative). Melosh (1988). Nature 332, 687–688.',
 dur:12,hint:'Press each answer. Notice that every option except the first moves the question somewhere else.',
 init:()=>({o:0}),
 watch(p){return {o:Math.min(3,Math.floor(p*4))}},
 ui:[],
 on:{o(s,v){s.o=Number(v);return 'keep'}},
 draw(s,f,X){
  const o=A3_ORIG[s.o];let out=A3_tag(o.st)+heading('Moving the question',30);
  A3_ORIG.forEach((g,i)=>{const x=24+(i%2)*284,y=56+Math.floor(i/2)*62;out+=A3_btn(X,'o',i,`${g.n}: ${g.st}`,x,y,268,52,[g.n,g.st],{sel:s.o===i,ink:g.st==='plausible'?C.ink:C.coral})});
  out+=TBF(40,212,'Explains',14,C.green,'start');A3_wrap(o.y,66).slice(0,2).forEach((l,i)=>{out+=TF(40,234+i*18,l,13,C.ink,'start')});
  out+=TBF(40,288,'Leaves open',14,C.coral,'start');A3_wrap(o.q,66).slice(0,2).forEach((l,i)=>{out+=TF(40,310+i*18,l,13,C.ink,'start')});
  out+=TF(300,366,'However life reached Earth, it had to begin somewhere by chemistry.',13,C.muted);
  return {svg:out,phase:'Status: life beginning on Earth is the working assumption of most research; the panspermia options are speculative. The chemistry in the rest of this course has to happen on some planet, whichever one it was.'};
 }});
