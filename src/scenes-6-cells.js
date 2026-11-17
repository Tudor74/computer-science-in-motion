/* ===================== Abiogenesis era 6 · The first cells ===================== */
// Droplets, self-assembling membranes, protocells that grow and divide, and why life is one-handed.
// Every scene carries a status tag. Pictures are pure functions of state; random layouts use seeded generators.
const A6_STATUS={demonstrated:['Demonstrated',C.green,C.greenp],plausible:['Plausible',C.amber,C.amberp],speculative:['Speculative',C.coral,C.coralp]};
const A6_tag=k=>{const [t,ink,fill]=A6_STATUS[k];const w=16+t.length*7.6;return R(8,8,w,22,fill,ink,11)+TBF(8+w/2,23,t,12,ink)};
const A6_poly=(pts,col,w=2.4,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function A6_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,12,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,12,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
function A6_wrap(t,n){const out=[''];t.split(' ').forEach(w=>{const c=out[out.length-1];if(c&&(c+' '+w).length>n)out.push(w);else out[out.length-1]=c?c+' '+w:w});return out}
const A6_lines=(x,y,t,n,col=C.ink,anchor='start',dy=17)=>A6_wrap(t,n).map((l,i)=>TF(x,y+i*dy,l,13,col,anchor)).join('');
// A small vesicle drawn as a double ring of lipid heads.
function A6_vesicle(cx,cy,r,col=C.blue,fill='#f4f9fc',n){n=n||Math.max(10,Math.round(r/2.2));let out=Ci(cx,cy,r,fill,'none');
 for(let i=0;i<n;i++){const a=i/n*2*Math.PI,c=Math.cos(a),s=Math.sin(a);out+=Ci(cx+c*r,cy+s*r,2.6,col)+Ci(cx+c*(r-9),cy+s*(r-9),2.6,col)+L(cx+c*(r-2),cy+s*(r-2),cx+c*(r-7),cy+s*(r-7),tint(col,.4),1)}
 return out}

/* ---------------------------------------------------------------- coacervates */
const A6_crit=c=>c<.3?0:.6*(1-Math.exp(-(c-.3)/1.5));
SCENE({id:'coacervates',name:'Coacervate droplets',tag:'Oparin’s droplets',
 definition:'When two oppositely charged polymers are mixed in water they can separate into dense droplets, like oil in vinegar, called coacervates. Aleksandr Oparin proposed in the 1920s and 1930s that such droplets were the forerunners of cells.',
 example:'Mixing a positively charged polymer such as polylysine with a negative one such as RNA gives droplets that form at low salt and dissolve when salt is added.',
 desc:'A test tube on the left and a sketch of the phase diagram on the right: droplets form inside the shaded region, where there is enough polymer and not too much salt.',
 research:'Oparin, A. I. (1924). The Origin of Life (in Russian), and (1936) The Origin of Life on Earth. Bungenberg de Jong, H. G. & Kruyt, H. R. (1929), who named coacervates. Koga, S., Williams, D. S., Perriman, A. W. & Mann, S. (2011). Peptide–nucleotide microdroplets as a step towards a membrane-free protocell model. Nature Chemistry 3, 720–724.',
 dur:12,hint:'Add polymer and remove salt to make droplets; add salt to dissolve them. The phase boundary is a sketch of the usual shape.',
 init:()=>({c:4,salt:.2}),
 watch(p){return {c:4,salt:Math.round((.05+p*.6)*100)/100}},
 ui:[{range:'c',label:'Polymer concentration',min:0,max:10,step:.25,get:s=>s.c,act:'c'},{range:'salt',label:'Salt (mol/L)',min:0,max:.8,step:.01,get:s=>s.salt,act:'salt'}],
 on:{c(s,v){s.c=Number(v);return 'keep'},salt(s,v){s.salt=Number(v);return 'keep'}},
 draw(s){
  const crit=A6_crit(s.c),on=s.salt<crit,amt=on?Math.min(1,(crit-s.salt)/.3)*Math.min(1,s.c/6):0;let out=A6_tag('demonstrated')+heading('Droplets without membranes',26);
  out+=P('M80 60 L80 300 Q80 330 140 330 Q200 330 200 300 L200 60',C.line,2.5,'#f4f8fb');
  const r=rng(77);const n=Math.round(amt*26);for(let i=0;i<n;i++){const x=95+r()*90,y=90+r()*220,rad=4+r()*9*amt+2;out+=Ci(x,y,rad,tint(C.purple,.55),C.purple,'stroke-width="1.2"')}
  out+=TBF(140,354,on?'droplets form':'clear solution',14,on?C.purple:C.muted);
  const p=A6_plot(300,70,270,220,[0,10],[0,.8],{xt:[[0,'0'],[5,'5'],[10,'10']],yt:[[0,'0'],[.4,'0.4'],[.8,'0.8']],xl:'polymer (illustrative units)',yl:'salt (mol/L)'});
  out+=p.svg+P('M'+range(41).map(i=>{const c=i/4;return fmt(p.X(c))+' '+fmt(p.Y(A6_crit(c)))}).join(' L')+` L${p.X(10)} ${p.Y(0)} L${p.X(0)} ${p.Y(0)} Z`,C.purple,2,tint(C.purple,.82));
  out+=TF(p.X(6.5),p.Y(.15),'droplets',13,C.purple)+TF(p.X(4),p.Y(.66),'one clear phase',13,C.muted);
  out+=Ci(p.X(s.c),p.Y(s.salt),7,on?C.purple:'#fff',C.ink);
  return {svg:out,phase:on?'Opposite charges pull the polymers together into dense droplets; salt screens the charges. Oparin’s idea, long eclipsed by membranes, has been revived: such droplets concentrate RNA and can speed reactions.':'Too little polymer, or so much salt that the charges are screened: everything stays dissolved in one clear phase.'};
 }});

/* ---- droplets concentrate RNA ---- */
SCENE({id:'coacervates-concentrate',name:'Concentrating RNA',tag:'Partitioning into droplets',
 definition:'Molecules spread unevenly between droplets and the water around them. The partition coefficient is how much more concentrated a molecule is inside the droplets; RNA can be hundreds of times more concentrated there.',
 example:'Ribozymes placed in coacervates gather inside the droplets, and some RNA reactions, including template-directed copying, have been shown to run in them.',
 desc:'A field of droplets taking up a small share of the volume; dots show RNA molecules. Sliders set the partition coefficient and how much of the volume the droplets fill; bars show the share of RNA inside.',
 research:'Drobot, B. et al. (2018). Compartmentalised RNA catalysis in membrane-free coacervate protocells. Nature Communications 9, 3643. Poudyal, R. R. et al. (2019). Template-directed RNA polymerization and enhanced ribozyme catalysis inside membraneless compartments formed by coacervates. Nature Communications 10, 490. Jia, T. Z. et al. (2019). Membraneless polyester microdroplets as primordial compartments at the origins of life. PNAS 116, 15830–15835.',
 dur:12,hint:'Raise the partition coefficient: even droplets filling 1% of the volume can then hold most of the RNA.',
 init:()=>({k:2,phi:2}),
 watch(p){return {k:Math.round(p*30)/10,phi:2}},
 ui:[{range:'k',label:'Partition coefficient (log₁₀)',min:0,max:3,step:.1,get:s=>s.k,act:'k',show:v=>Math.round(Math.pow(10,v)).toLocaleString('en-GB')+'×'},{range:'phi',label:'Droplet volume (%)',min:.5,max:10,step:.5,get:s=>s.phi,act:'phi'}],
 on:{k(s,v){s.k=Number(v);return 'keep'},phi(s,v){s.phi=Number(v);return 'keep'}},
 draw(s){
  const K=Math.pow(10,s.k),f=s.phi/100,inside=K*f/(K*f+1-f);let out=A6_tag('demonstrated')+heading('Droplets as concentrators',26);
  out+=R(30,50,300,280,'#f4f8fb',C.grid,8);const r=rng(5);const nd=Math.max(2,Math.round(s.phi*1.6)),drops=[];
  for(let i=0;i<nd;i++){const x=60+r()*240,y=80+r()*220,rad=14+r()*6;drops.push([x,y,rad]);out+=Ci(x,y,rad,tint(C.purple,.7),C.purple,'stroke-width="1.2"')}
  const N=60,nin=Math.round(inside*N);for(let i=0;i<N;i++){let x,y;if(i<nin){const d=drops[i%drops.length],a=r()*6.28,q=Math.sqrt(r())*(d[2]-4);x=d[0]+Math.cos(a)*q;y=d[1]+Math.sin(a)*q}else{x=40+r()*280;y=60+r()*260}out+=Ci(x,y,2.4,C.coral)}
  out+=TF(180,350,'red dots: RNA molecules',13,C.coral);
  out+=TBF(465,74,'RNA inside the droplets',14,C.ink)+TBF(465,104,`${Math.round(inside*100)}%`,24,C.purple);
  out+=R(375,120,180,18,'#fff',C.grid,4)+R(375,120,180*inside,18,C.purple,'none',4);
  out+=TF(465,166,`droplets fill ${s.phi}% of the volume`,13,C.muted)+TF(465,186,`and are ${Math.round(K).toLocaleString('en-GB')}× richer in RNA`,13,C.muted);
  out+=A6_lines(370,226,'Concentrating dilute RNA helps it meet partners and fold, one answer to the problem of a dilute ocean.',26);
  out+=TF(465,330,'share inside = Kφ ÷ (Kφ + 1 − φ)',12,C.muted);
  return {svg:out,phase:`With droplets filling ${s.phi}% of the volume and a partition coefficient of ${Math.round(K).toLocaleString('en-GB')}, about ${Math.round(inside*100)}% of the RNA sits inside them. This is well demonstrated in the lab; whether early Earth had suitable polymers to make such droplets is less clear.`};
 }});

/* ---- droplets swap contents: the identity problem ---- */
SCENE({id:'coacervates-membraneless',name:'Droplets without walls',tag:'The identity problem',
 definition:'Membraneless droplets swap their contents with neighbours quickly, so a droplet cannot easily keep its own molecules, and evolution needs compartments that keep what they make. Coating a droplet with a fatty-acid layer slows the exchange.',
 example:'Living cells use membraneless droplets too: P granules in worm embryos behave like liquid drops (Brangwynne et al. 2009), as do the nucleolus and stress granules.',
 desc:'Two droplets that start with different RNA (red and blue). The time slider shows how their contents mix, with and without a fatty-acid coat; the mixing times are illustrative.',
 research:'Brangwynne, C. P. et al. (2009). Germline P granules are liquid droplets that localize by controlled dissolution/condensation. Science 324, 1729–1732. Dora Tang, T.-Y. et al. (2014). Fatty acid membrane assembly on coacervate microdroplets as a step towards a hybrid protocell model. Nature Chemistry 6, 527–533. Jia, T. Z. et al. (2019). PNAS 116, 15830–15835.',
 dur:12,hint:'Slide time forward with and without the coat. Uncoated droplets lose their individuality within minutes in this sketch.',
 init:()=>({t:5,coat:'no'}),
 watch(p){return {t:Math.round(p*60),coat:p<.5?'no':'yes'}},
 ui:[{range:'t',label:'Time (minutes)',min:0,max:60,get:s=>s.t,act:'t'},{choose:[['no','Bare droplets'],['yes','Fatty-acid coat']],label:'Surface',get:s=>s.coat,act:'coat'}],
 on:{t(s,v){s.t=Number(v);return 'keep'},coat(s,v){s.coat=v;return 'keep'}},
 draw(s){
  const tau=s.coat==='yes'?240:3,m=1-Math.exp(-s.t/tau),mix=.5*m;let out=A6_tag('plausible')+heading('Do droplets keep their contents?',26);
  const draw=(cx,own,other,label)=>{let o=Ci(cx,170,78,'#f7f2fb',C.purple,s.coat==='yes'?'stroke-width="5" stroke-dasharray="3 3"':'stroke-width="1.5"');const r=rng(cx);for(let i=0;i<40;i++){const a=r()*6.28,q=Math.sqrt(r())*70;o+=Ci(cx+Math.cos(a)*q,170+Math.sin(a)*q,3,i<Math.round(40*mix)?other:own)}return o+TBF(cx,274,label,13,C.ink)};
  out+=draw(150,C.coral,C.blue,'droplet A')+draw(430,C.blue,C.coral,'droplet B');
  out+=arrow(240,150,340,150,C.muted,1.8,7)+arrow(340,190,240,190,C.muted,1.8,7);
  out+=TBF(290,306,`after ${s.t} min: ${Math.round(mix*100)}% of each droplet’s RNA came from the other`,14,m>.8?C.coral:C.ink);
  out+=A6_lines(300,334,s.coat==='yes'?'A fatty-acid coat slows the swap a great deal (times are illustrative), keeping the droplets distinct.':'Bare droplets trade their contents: neither keeps an identity for selection to act on.',88,C.muted,'middle');
  return {svg:out,phase:'Droplets are good at gathering molecules but poor at keeping them apart. Hybrid droplets with a membrane coat, made in the lab, are one suggested bridge between Oparin’s droplets and membrane-bound cells.'};
 }});

/* ---------------------------------------------------------------- protocells */
const A6_phase=(lc,pH)=>lc<-1.3?'monomers':pH>9?'micelles':pH>=7?'vesicles':'oil droplets';
SCENE({id:'protocells',name:'Self-assembling vesicles',tag:'Fatty acids make membranes',
 definition:'Simple fatty acids, molecules with a water-loving head and a greasy tail, assemble by themselves into hollow vesicles when there are enough of them and the pH is near the point where about half their heads carry a charge. Such vesicles are a leading model for the first cell membranes.',
 example:'David Deamer showed in 1985 that organic molecules extracted from the Murchison meteorite form membrane-like vesicles in water.',
 desc:'A phase sketch: below a threshold concentration the fatty acids stay dissolved; above it they form oil droplets at low pH, vesicles near neutral to mildly alkaline pH, and micelles at high pH. Boundaries are illustrative. The 3D view shows a vesicle’s two-layer wall.',
 research:'Gebicki, J. M. & Hicks, M. (1973). Ufasomes are stable particles surrounded by unsaturated fatty acid membranes. Nature 243, 232–234. Hargreaves, W. R. & Deamer, D. W. (1978). Liposomes from ionic, single-chain amphiphiles. Biochemistry 17, 3759–3768. Deamer, D. W. (1985). Boundary structures are formed by organic components of the Murchison carbonaceous chondrite. Nature 317, 792–794. Apel, C. L., Deamer, D. W. & Mautner, M. N. (2002). Self-assembled vesicles of monocarboxylic acids and alcohols. BBA 1559, 1–9.',
 dur:12,hint:'Raise the concentration past the threshold, then move the pH to find vesicles. Turn to 3D to see the two-layer wall.',
 init:()=>({lc:-.5,pH:8}),
 watch(p){return p<.4?{lc:-2+p*4,pH:8}:{lc:-.4,pH:Math.round((6+(p-.4)/.6*5)*10)/10}},
 ui:[{range:'lc',label:'Fatty acid concentration (log₁₀, illustrative)',min:-2.5,max:0,step:.1,get:s=>s.lc,act:'lc'},{range:'pH',label:'pH',min:5,max:11,step:.1,get:s=>s.pH,act:'pH'}],
 on:{lc(s,v){s.lc=Number(v);return 'keep'},pH(s,v){s.pH=Number(v);return 'keep'}},
 draw(s){
  const ph=A6_phase(s.lc,s.pH);let out=A6_tag('demonstrated')+heading('Membranes that build themselves',26);
  out+=R(30,50,260,260,'#f4f8fb',C.grid,8);const r=rng(12);
  if(ph==='monomers'){for(let i=0;i<22;i++){const x=50+r()*220,y=70+r()*220,a=r()*6.28;out+=Ci(x,y,3.4,C.blue)+L(x,y,x+Math.cos(a)*12,y+Math.sin(a)*12,C.amber,2)}}
  else if(ph==='micelles'){for(let i=0;i<7;i++){const cx=70+(i%3)*80+r()*10,cy=95+Math.floor(i/3)*80+r()*10;for(let j=0;j<10;j++){const a=j/10*6.28;out+=L(cx+Math.cos(a)*4,cy+Math.sin(a)*4,cx+Math.cos(a)*14,cy+Math.sin(a)*14,C.amber,2)+Ci(cx+Math.cos(a)*16,cy+Math.sin(a)*16,3.4,C.blue)}}}
  else if(ph==='vesicles'){out+=A6_vesicle(110,130,48)+A6_vesicle(215,215,60)+A6_vesicle(95,250,30)}
  else{for(let i=0;i<5;i++){const x=70+r()*180,y=90+r()*190,rad=14+r()*16;out+=Ci(x,y,rad,tint(C.amber,.55),C.amber)}}
  out+=TBF(160,334,{monomers:'single molecules, dissolved',micelles:'micelles: small solid balls',vesicles:'vesicles: hollow, water inside',['oil droplets']:'oil droplets'}[ph],14,ph==='vesicles'?C.green:C.ink);
  const p=A6_plot(350,70,220,220,[5,11],[-2.5,0],{xt:[[5,'5'],[7,'7'],[9,'9'],[11,'11']],yt:[[-2.5,'low'],[0,'high']],xl:'pH',yl:'concentration'});out+=p.svg;
  const yT=p.Y(-1.3);out+=R(p.X(5),p.Y(0),p.X(7)-p.X(5),yT-p.Y(0),tint(C.amber,.8),'none',0)+R(p.X(7),p.Y(0),p.X(9)-p.X(7),yT-p.Y(0),tint(C.green,.75),'none',0)+R(p.X(9),p.Y(0),p.X(11)-p.X(9),yT-p.Y(0),tint(C.blue,.8),'none',0);
  out+=TF(p.X(6),p.Y(-.6),'oil',12,C.ink)+TF(p.X(8),p.Y(-.6),'vesicles',12,C.ink)+TF(p.X(10),p.Y(-.6),'micelles',12,C.ink)+TF(p.X(8),p.Y(-1.9),'dissolved',12,C.muted);
  out+=Ci(p.X(s.pH),p.Y(s.lc),7,'#fff',C.ink);
  return {svg:out,phase:ph==='vesicles'?'Vesicles: a closed double layer of fatty acids with water inside, assembled with no enzymes at all. Mixtures of fatty acids with fatty alcohols, plausible on the early Earth, form them across a wider range of conditions.':ph==='monomers'?'Below a threshold concentration the fatty acids just dissolve. Concentration, for example by drying, has to come first.':'Fatty acids need roughly half their heads charged to form a bilayer: at low pH they clump into oil, at high pH they form micelles.'};
 },
 three(s,f,X,project){
  const P3=project([[1.05,0,0],[-1.05,0,0],[0,1.05,0],[0,-1.05,0],[0,0,1.05],[0,0,-1.05]]),items=[],n=140,g=Math.PI*(3-Math.sqrt(5));
  for(let i=0;i<n;i++){const y=1-2*(i+.5)/n,rr=Math.sqrt(1-y*y),a=g*i,u=[Math.cos(a)*rr,Math.sin(a)*rr,y];if(u[1]<-.25)continue;
   const o=u.map(v=>v),q=u.map(v=>v*.72);items.push({at:o,svg:P=>{const a2=P(o),b2=P(u.map(v=>v*.86));return L(a2[0],a2[1],b2[0],b2[1],C.amber,2)+Ci(a2[0],a2[1],5,C.blue)}});
   items.push({at:q,svg:P=>{const a2=P(q),b2=P(u.map(v=>v*.82));return L(a2[0],a2[1],b2[0],b2[1],C.amber,2)+Ci(a2[0],a2[1],4,C.green)}})}
  return {svg:sortedItems(items,P3),title:'A fatty-acid vesicle, cut open',caption:'Outer heads (blue) face the water outside, inner heads (green) face the water inside, and the tails (amber) meet in the middle of the wall. The front has been cut away.'};
 }});

/* ---- clay speeds vesicle formation ---- */
SCENE({id:'protocells-clay',name:'Clay helps',tag:'Montmorillonite and vesicles',
 definition:'In 2003 Martin Hanczyc, Shelly Fujikawa and Jack Szostak found that particles of montmorillonite clay speed up the formation of fatty-acid vesicles about a hundredfold, and that RNA stuck to the clay ends up inside the new vesicles.',
 example:'The same clay was already known (from James Ferris’s work) to help join activated nucleotides into RNA chains, so one mineral could help make both RNA and its container.',
 desc:'Vesicles forming over time, with and without clay. With clay, many vesicles enclose a clay particle and the RNA bound to it. Time scales are illustrative; the roughly hundredfold speed-up is the published result.',
 research:'Hanczyc, M. M., Fujikawa, S. M. & Szostak, J. W. (2003). Experimental models of primitive cellular compartments: encapsulation, growth, and division. Science 302, 618–622. Ferris, J. P., Hill, A. R., Liu, R. & Orgel, L. E. (1996). Synthesis of long prebiotic oligomers on mineral surfaces. Nature 381, 59–61.',
 dur:12,hint:'Compare the two curves, then slide time forward to see vesicles enclose clay and RNA.',
 init:()=>({clay:'yes',t:2}),
 watch(p){return {clay:p<.5?'no':'yes',t:Math.round((p<.5?p*2:(p-.5)*2)*24)}},
 ui:[{choose:[['no','No clay'],['yes','With clay']],label:'Clay',get:s=>s.clay,act:'clay'},{range:'t',label:'Time (hours, illustrative)',min:0,max:24,get:s=>s.t,act:'t'}],
 on:{clay(s,v){s.clay=v;return 'keep'},t(s,v){s.t=Number(v);return 'keep'}},
 draw(s){
  const f=(c,t)=>1-Math.exp(-t/(c?.12:12)),cur=f(s.clay==='yes',s.t);let out=A6_tag('demonstrated')+heading('Clay speeds up vesicles',26);
  out+=R(30,50,260,270,'#f4f8fb',C.grid,8);const r=rng(31),nv=Math.round(cur*7);
  for(let i=0;i<7;i++){const x=70+(i%3)*85+r()*10,y=95+Math.floor(i/3)*85+r()*10;if(i<nv){out+=A6_vesicle(x,y,30);if(s.clay==='yes'){out+=R(x-8,y-6,16,12,'#b9a37a','#7a6a40',2)+Ci(x+12,y+4,2.5,C.coral)+Ci(x-12,y-4,2.5,C.coral)}}else if(s.clay==='yes'){out+=R(x-8,y-6,16,12,'#b9a37a','#7a6a40',2)+Ci(x+11,y,2.5,C.coral)}}
  out+=TF(160,342,s.clay==='yes'?'brown: clay particles · red: RNA':'fatty acids alone',13,C.muted);
  const p=A6_plot(350,70,220,200,[0,24],[0,1],{xt:[[0,'0'],[12,'12'],[24,'24 h']],yt:[[0,'0%'],[1,'100%']],yl:'vesicles formed'});
  out+=p.svg+A6_poly(range(49).map(i=>[p.X(i/2),p.Y(f(true,i/2))]),C.green,2.6)+A6_poly(range(49).map(i=>[p.X(i/2),p.Y(f(false,i/2))]),C.muted,2.4,'stroke-dasharray="6 4"');
  out+=TF(p.X(15),p.Y(.92),'with clay',12,C.green)+TF(p.X(15),p.Y(.5),'without',12,C.muted)+L(p.X(s.t),70,p.X(s.t),270,C.coral,1.6,'stroke-dasharray="4 4"');
  out+=TF(460,310,'about 100× faster with clay',13,C.ink)+TF(460,328,'(Hanczyc et al. 2003)',12,C.muted);
  return {svg:out,phase:s.clay==='yes'?'Clay surfaces seed vesicle formation, and RNA bound to the clay is carried inside: a simple route to a compartment that holds genetic material.':'Without a surface to start on, vesicles form far more slowly, and any RNA mostly stays outside.'};
 }});

/* ---- vesicles compete for membrane ---- */
SCENE({id:'protocells-competition',name:'Vesicles compete',tag:'Growth by stealing membrane',
 definition:'Chen, Roberts and Szostak found in 2004 that vesicles holding RNA swell slightly with water, which stretches their membranes; stretched vesicles then take up fatty acids from nearby relaxed, empty vesicles and grow while those shrink.',
 example:'A vesicle with more RNA inside grows at the expense of one with less: a purely physical link between genetic material and growth, the raw material of selection.',
 desc:'Two vesicles, A and B, sharing a fixed amount of membrane. Sliders set how much RNA each holds; time moves membrane from the less stretched vesicle to the more stretched one. Rates are illustrative.',
 research:'Chen, I. A., Roberts, R. W. & Szostak, J. W. (2004). The emergence of competition between model protocells. Science 305, 1474–1476. Budin, I. & Szostak, J. W. (2011). Physical effects underlying the transition from primitive to modern cell membranes. PNAS 108, 5249–5254.',
 dur:12,hint:'Give vesicle A more RNA than B and move time forward. Equal RNA, equal share.',
 init:()=>({ra:.8,rb:.2,t:5}),
 watch(p){return {ra:.8,rb:.2,t:Math.round(p*20)}},
 ui:[{range:'ra',label:'RNA in vesicle A',min:0,max:1,step:.05,get:s=>s.ra,act:'ra'},{range:'rb',label:'RNA in vesicle B',min:0,max:1,step:.05,get:s=>s.rb,act:'rb'},{range:'t',label:'Time (illustrative)',min:0,max:20,get:s=>s.t,act:'t'}],
 on:{ra(s,v){s.ra=Number(v);return 'keep'},rb(s,v){s.rb=Number(v);return 'keep'},t(s,v){s.t=Number(v);return 'keep'}},
 draw(s){
  const share=.5+.5*Math.tanh(.18*(s.ra-s.rb)*s.t),rA=55*Math.sqrt(share/.5),rB=55*Math.sqrt((1-share)/.5);let out=A6_tag('demonstrated')+heading('Stretched vesicles grow',26);
  const dots=(cx,cy,rr,n,seed)=>{const r=rng(seed);let o='';for(let i=0;i<n;i++){const a=r()*6.28,q=Math.sqrt(r())*(rr-14);o+=Ci(cx+Math.cos(a)*q,cy+Math.sin(a)*q,2.6,C.coral)}return o};
  out+=A6_vesicle(160,180,rA,C.blue)+dots(160,180,rA,Math.round(s.ra*20),3)+A6_vesicle(430,180,Math.max(14,rB),C.blue)+dots(430,180,Math.max(14,rB),Math.round(s.rb*20),4);
  out+=TBF(160,290,'A',15,C.ink)+TBF(430,290,'B',15,C.ink);
  if(Math.abs(s.ra-s.rb)>.01&&s.t>0){const fromB=s.ra>s.rb;out+=arrow(fromB?350:240,120,fromB?240:350,120,C.amber,2,8)+TF(295,108,'fatty acids',12,C.amber)}
  out+=TBF(300,318,`Share of membrane: A ${Math.round(share*100)}%, B ${Math.round((1-share)*100)}%`,14,C.ink);
  out+=A6_lines(300,342,'Red dots are RNA. More RNA inside means more osmotic swelling, a stretched membrane and faster uptake of fatty acids.',90,C.muted,'middle');
  return {svg:out,phase:s.ra===s.rb?'With equal RNA, neither vesicle is more stretched, and they keep equal shares.':'The vesicle with more RNA takes membrane from its neighbour. If RNA that copied itself faster made its vesicle grow faster, a protocell would have a simple, physical form of selection.'};
 }});

/* ---------------------------------------------------------------- membrane-growth */
const A6_GROW=[
 {t:'A multilamellar vesicle',d:'A vesicle with several nested membranes, the commonest kind formed from fatty acids.'},
 {t:'Feed it micelles',d:'Fresh fatty acids, added as micelles, join the outer membrane faster than water can enter the vesicle.'},
 {t:'It grows a long thread',d:'With extra membrane but little extra volume, the vesicle pushes out a thin filament, within about half an hour.'},
 {t:'Gentle shaking splits it',d:'Mild shear, like water moving over rocks, breaks the fragile thread into many daughter vesicles.'},
 {t:'Daughters keep the contents',d:'Most of the encapsulated RNA stays inside the daughters, and each can grow and divide again.'}];
SCENE({id:'membrane-growth',name:'Grow and divide',tag:'Zhu and Szostak, 2009',
 definition:'Ting Zhu and Jack Szostak showed in 2009 that fatty-acid vesicles fed with fresh fatty acid grow into long threads, which gentle shaking breaks into daughter vesicles that keep their contents: growth and division with no proteins at all.',
 example:'Repeated cycles of feeding and gentle shear produced generations of vesicles, each round dividing the parent’s contents among its daughters.',
 desc:'Five steps of the growth-and-division cycle, drawn as a sketch. Step through them with the buttons.',
 research:'Zhu, T. F. & Szostak, J. W. (2009). Coupled growth and division of model protocell membranes. Journal of the American Chemical Society 131, 5705–5713. Budin, I., Debnath, A. & Szostak, J. W. (2012). Concentration-driven growth of model protocell membranes. JACS 134, 20812–20819.',
 dur:12,hint:'Step through the cycle. Division needs no enzymes, only extra membrane and a gentle push.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(4,Math.floor(p*5))}},
 ui:[{b:'Previous',act:'prev'},{b:'Next step',act:'next'}],
 on:{prev(s){s.k=Math.max(0,s.k-1);return 'keep'},next(s){s.k=Math.min(4,s.k+1);return 'keep'}},
 draw(s){
  let out=A6_tag('demonstrated')+heading('Division without proteins',26);const k=s.k;
  out+=R(30,46,540,62,C.pale,'none',8)+TBF(300,68,`Step ${k+1} of 5 · ${A6_GROW[k].t}`,14,C.ink)+A6_lines(300,90,A6_GROW[k].d,86,C.ink,'middle');
  const cy=220;
  if(k<=1){out+=Ci(300,cy,70,'#f4f9fc',C.blue,'stroke-width="3"')+Ci(300,cy,54,'none',C.blue,'stroke-width="2.5"')+Ci(300,cy,38,'none',C.blue,'stroke-width="2"');
   if(k===1){for(let i=0;i<8;i++){const a=i/8*6.28,x=300+Math.cos(a)*110,y=cy+Math.sin(a)*90;for(let j=0;j<6;j++){const b=j/6*6.28;out+=Ci(x+Math.cos(b)*8,y+Math.sin(b)*8,2.4,C.blue)}out+=arrow(x-Math.cos(a)*12,y-Math.sin(a)*12,300+Math.cos(a)*80,cy+Math.sin(a)*80,C.amber,1.4,5)}}}
  else if(k===2){out+=P(`M120 ${cy} Q120 ${cy-34} 160 ${cy-34} L440 ${cy-34} Q480 ${cy-34} 480 ${cy} Q480 ${cy+34} 440 ${cy+34} L160 ${cy+34} Q120 ${cy+34} 120 ${cy} Z`,C.blue,3,'#f4f9fc')+TF(300,cy+64,'a long, thin filament',13,C.muted)}
  else{const pos=[[120,cy-20],[200,cy+30],[280,cy-30],[360,cy+25],[440,cy-15],[510,cy+28]];pos.forEach(([x,y],i)=>{out+=Ci(x,y,26,'#f4f9fc',C.blue,'stroke-width="2.5"');if(k===4){const r=rng(i+3);for(let j=0;j<4;j++)out+=Ci(x-12+r()*24,y-12+r()*24,2.4,C.coral)}});if(k===3)out+=TF(300,cy+80,'gentle shear',13,C.amber)+arrow(160,cy+70,440,cy+70,C.amber,2,8)}
  out+=TF(300,352,'Fatty-acid membranes are fragile enough to split this way; modern phospholipid ones are not.',13,C.muted);
  return {svg:out,phase:A6_GROW[k].d+(k===4?' Together these steps make a protocell life cycle, driven only by physics and the supply of fatty acids.':'')};
 }});

/* ---- why extra membrane makes a thread: reduced volume ---- */
function A6_capsule(A,V){const rmax=Math.sqrt(A/(4*Math.PI));let lo=0,hi=rmax;for(let i=0;i<60;i++){const m=(lo+hi)/2,v=m*A/2-2/3*Math.PI*m*m*m;if(v<V)lo=m;else hi=m}const r=(lo+hi)/2;return {r,l:Math.max(0,(A-4*Math.PI*r*r)/(2*Math.PI*r))}}
SCENE({id:'membrane-growth-surface',name:'More skin than body',tag:'Why growing vesicles stretch out',
 definition:'If a vesicle’s membrane grows but water cannot get in fast enough to swell it, it has more surface than a sphere of that volume needs. The only way to hold the extra area is to change shape: it stretches into a tube.',
 example:'With just 20% more membrane around the same volume, a sphere has to become a capsule about three times as long as it is wide; with 50% more, almost seven times. This is why Zhu and Szostak’s vesicles grew threads.',
 desc:'A vesicle drawn to scale as a capsule with a given area and volume. Slide the extra membrane; choose whether the volume stays the same (water is slow) or keeps pace (water flows in).',
 research:'Zhu, T. F. & Szostak, J. W. (2009). JACS 131, 5705–5713. Seifert, U. (1997). Configurations of fluid membranes and vesicles. Advances in Physics 46, 13–137 (reduced volume).',
 dur:12,hint:'Add membrane with the volume fixed and watch the sphere stretch. Then let the volume keep pace.',
 init:()=>({g:50,mode:'fixed'}),
 watch(p){return {g:Math.round(p*150),mode:'fixed'}},
 ui:[{range:'g',label:'Extra membrane (%)',min:0,max:150,step:5,get:s=>s.g,act:'g'},{choose:[['fixed','Volume stays the same'],['grows','Volume keeps pace']],label:'Water',get:s=>s.mode,act:'mode'}],
 on:{g(s,v){s.g=Number(v);return 'keep'},mode(s,v){s.mode=v;return 'keep'}},
 draw(s){
  const A0=4*Math.PI,V0=4/3*Math.PI,A=A0*(1+s.g/100),V=s.mode==='fixed'?V0:V0*Math.pow(1+s.g/100,1.5),c=A6_capsule(A,V),rv=6*Math.sqrt(Math.PI)*V/Math.pow(A,1.5);
  let out=A6_tag('demonstrated')+heading('More membrane, same volume',26);const sc=48,cx=300,cy=170,r=c.r*sc,l=c.l*sc;
  out+=P(`M${cx-l/2} ${cy-r} L${cx+l/2} ${cy-r} A${r} ${r} 0 0 1 ${cx+l/2} ${cy+r} L${cx-l/2} ${cy+r} A${r} ${r} 0 0 1 ${cx-l/2} ${cy-r} Z`,C.blue,3,'#f4f9fc');
  out+=Ci(cx,cy,sc,'none',C.muted,'stroke-dasharray="4 4" stroke-width="1.4"');
  out+=TF(300,270,'dashed circle: the starting sphere',13,C.muted);
  out+=counter(70,290,'membrane area',`${100+s.g}%`,C.blue,140)+counter(230,290,'volume',`${Math.round(V/V0*100)}%`,C.blue,140)+counter(390,290,'length ÷ width',((l+2*r)/(2*r)).toFixed(2),C.purple,140);
  out+=TF(300,360,`reduced volume ${rv.toFixed(2)} (1 = a perfect sphere)`,13,C.muted);
  return {svg:out,phase:s.mode==='fixed'?(s.g>0?`With ${s.g}% more membrane around the same water, the only shape that fits is ${((l+2*r)/(2*r)).toFixed(1)} times as long as it is wide. Fragile threads like this break easily: growth itself sets up division.`:'A sphere: the least surface for its volume.'):'When water flows in to keep pace, the vesicle just grows into a bigger sphere and never stretches. Water entering slowly is what drives the shape change.'};
 }});

/* ---- what gets through early membranes ---- */
const A6_PERM={fa:{ion:.3,ribose:1,nuc:12,rna:Infinity},pl:{ion:300,ribose:200,nuc:Infinity,rna:Infinity}};
const A6_MOL={ion:'ions (Na⁺, Mg²⁺)',ribose:'ribose sugar',nuc:'nucleotides',rna:'RNA strands'};
SCENE({id:'membrane-growth-permeability',name:'Leaky by design',tag:'What crosses an early membrane',
 definition:'Fatty-acid membranes are much leakier than the phospholipid membranes of modern cells. Small sugars and even nucleotides can cross them slowly, while long RNA cannot: an early cell could feed on building blocks from outside without any transport proteins.',
 example:'Mansy and colleagues showed in 2008 that activated nucleotides cross fatty-acid membranes and extend a copy along a DNA template inside the vesicle.',
 desc:'A vesicle with molecules outside and inside. Choose the membrane and the molecule; the time slider shows how much has crossed. The ordering is from the published experiments; the times are illustrative.',
 research:'Mansy, S. S. et al. (2008). Template-directed synthesis of a genetic polymer in a model protocell. Nature 454, 122–125. Sacerdote, M. G. & Szostak, J. W. (2005). Semipermeable lipid bilayers exhibit diastereoselectivity favoring ribose. PNAS 102, 6004–6008. Budin & Szostak (2011). PNAS 108, 5249–5254.',
 dur:12,hint:'Try nucleotides with both membranes. Long RNA never leaves, which is exactly what a genome needs.',
 init:()=>({m:'fa',x:'nuc',t:1}),
 watch(p){return {m:p<.5?'fa':'pl',x:'nuc',t:Math.round(((p%.5)*2*3-1)*10)/10}},
 ui:[{choose:[['fa','Fatty acid'],['pl','Phospholipid']],label:'Membrane',get:s=>s.m,act:'m'},{choose:Object.entries(A6_MOL).map(([k,v])=>[k,v.split(' (')[0]]),label:'Molecule',get:s=>s.x,act:'x'},{range:'t',label:'Time (hours, log₁₀)',min:-1,max:2,step:.1,get:s=>s.t,act:'t',show:v=>(Math.pow(10,v)<10?Math.pow(10,v).toFixed(1):Math.round(Math.pow(10,v)))+' h'}],
 on:{m(s,v){s.m=v;return 'keep'},x(s,v){s.x=v;return 'keep'},t(s,v){s.t=Number(v);return 'keep'}},
 draw(s){
  const tau=A6_PERM[s.m][s.x],h=Math.pow(10,s.t),f=tau===Infinity?0:1-Math.exp(-h/tau),half=f/2;let out=A6_tag('demonstrated')+heading('What gets in?',26);
  out+=A6_vesicle(180,200,110,s.m==='fa'?C.blue:C.purple,'#f4f9fc',36);
  const r=rng(8),N=30,nin=Math.round(half*N*2);for(let i=0;i<N;i++){const a=r()*6.28;let x,y;if(i<nin/2){const q=Math.sqrt(r())*90;x=180+Math.cos(a)*q;y=200+Math.sin(a)*q}else{const q=125+r()*40;x=180+Math.cos(a)*q;y=200+Math.sin(a)*q*.85}
   out+=s.x==='rna'?P(`M${x-8} ${y} q4 -6 8 0 t8 0`,C.coral,2):Ci(x,y,s.x==='ion'?2.4:3.6,C.coral)}
  out+=TBF(450,80,A6_MOL[s.x],14,C.ink)+TF(450,100,s.m==='fa'?'through a fatty-acid membrane':'through a phospholipid membrane',13,C.muted);
  out+=TBF(450,140,tau===Infinity?'does not cross':`${Math.round(f*100)}% of the way to balance`,16,tau===Infinity?C.coral:C.green);
  out+=TF(450,162,`after ${h<10?h.toFixed(1):Math.round(h)} h (illustrative)`,13,C.muted);
  out+=A6_lines(360,200,s.m==='fa'?'Fatty acids flip and flex, opening brief gaps: building blocks can seep in, while long RNA stays trapped.':'Phospholipids pack tightly: modern cells need transport proteins to bring nutrients in.',30);
  return {svg:out,phase:s.m==='fa'&&s.x==='nuc'?'Nucleotides seeping in and being copied inside a vesicle is the closest the lab has come to a protocell that feeds itself.':s.x==='rna'?'Long RNA cannot escape through either membrane, so a protocell keeps its genome while drawing in building blocks.':'Leakiness is a feature early on: no pumps or channels needed. The cost came later, when cells began to make and keep their own gradients.'};
 }});

/* ---------------------------------------------------------------- chirality */
const A6_MOLS={ala:{name:'Alanine (an amino acid)',groups:['NH₂','COOH','CH₃','H'],life:'L'},rib:{name:'Glyceraldehyde (a simple sugar)',groups:['OH','CHO','CH₂OH','H'],life:'D'}};
SCENE({id:'chirality',name:'Life is one-handed',tag:'Homochirality',
 definition:'Many molecules of life come in two mirror-image forms, like left and right hands, that cannot be superimposed. Life’s core polymers use only one of each: L-amino acids in proteins and D-sugars in RNA and DNA. (A few D-amino acids are made for special uses, such as bacterial cell walls, but ribosomes build proteins from L forms only.) Chemistry without life makes both equally.',
 example:'The amino acids from Miller’s spark experiment were an equal (racemic) mix of left- and right-handed forms; a living cell’s proteins use left-handed ones only.',
 desc:'A molecule and its mirror image, drawn with a wedge (towards you) and a dash (away). Switch the molecule and its handedness; the panel says which form life uses.',
 research:'Pasteur, L. (1848), who separated mirror-image crystals of tartaric acid. Joyce, G. F. et al. (1984). Chiral selection in poly(C)-directed synthesis of oligo(G). Nature 310, 602–604 (enantiomeric cross-inhibition). Blackmond, D. G. (2010). The origin of biological homochirality. Cold Spring Harbor Perspectives in Biology 2, a002147.',
 dur:12,hint:'Mirror the molecule: the two forms have the same atoms but cannot be turned to match.',
 init:()=>({m:'ala',h:'L'}),
 watch(p){return {m:p<.5?'ala':'rib',h:(p%.5)<.25?'L':'D'}},
 ui:[{choose:[['ala','Alanine'],['rib','Glyceraldehyde']],label:'Molecule',get:s=>s.m,act:'m'},{choose:[['L','Left (L)'],['D','Right (D)']],label:'Form',get:s=>s.h,act:'h'}],
 on:{m(s,v){s.m=v;return 'keep'},h(s,v){s.h=v;return 'keep'}},
 draw(s){
  const M=A6_MOLS[s.m],sgn=s.h==='L'?1:-1;let out=A6_tag('demonstrated')+heading('Two mirror forms',26);
  const cx=170,cy=200,g=M.groups,pos=[[0,-80],[-sgn*78,28],[sgn*72,48],[-sgn*30,74]];
  out+=L(cx,cy,cx+pos[0][0],cy+pos[0][1]+16,C.ink,3)+P(`M${cx} ${cy} L${cx+pos[1][0]*.62} ${cy+pos[1][1]*.62-7} L${cx+pos[1][0]*.62} ${cy+pos[1][1]*.62+5} Z`,C.ink,1.5,C.ink)+L(cx,cy,cx+pos[2][0]*.62,cy+pos[2][1]*.62,C.ink,3)+L(cx,cy,cx+pos[3][0]*.7,cy+pos[3][1]*.7,C.ink,2.5,'stroke-dasharray="3 4"');
  out+=Ci(cx,cy,14,'#fff',C.ink)+TBF(cx,cy+5,'C',14,C.ink);
  g.forEach((t,i)=>{const [dx,dy]=pos[i];out+=TBF(cx+dx,cy+dy+5+(i===0?0:i===3?6:0),t,15,i===3?C.muted:C.blue)});
  out+=L(320,60,320,330,C.grid,2,'stroke-dasharray="6 6"')+TF(320,350,'mirror',12,C.muted);
  out+=TBF(460,90,M.name,14,C.ink)+TBF(460,124,`This is the ${s.h} form`,16,s.h===M.life?C.green:C.coral);
  out+=TF(460,148,`Life uses the ${M.life} form ${s.m==='ala'?'of amino acids':'of sugars'}`,13,C.ink);
  out+=A6_lines(350,190,'Lab chemistry without a chiral guide makes a 50:50 racemic mix. Mixed hands also spoil chain building: a wrong-handed nucleotide stops RNA copying (Joyce et al. 1984).',30);
  return {svg:out,phase:'That life is homochiral is certain; how one hand won is open. The next two scenes show chemistry that can amplify a tiny imbalance, and some candidate sources of the first imbalance.'};
 }});

/* ---- Soai's amplifying reaction (Frank's model) ---- */
const A6_pct=e=>{const v=e*100;return v>=99.95?'>99.9%':v>=1?v.toFixed(1)+'%':v>=.001?v.toPrecision(2)+'%':v.toExponential(0).replace('e-','×10⁻')+'%'};
function A6_round(e){let L=(1+e)/2*.002,D=(1-e)/2*.002,A=1;const k=1,mu=3,dt=.01;for(let i=0;i<4000;i++){const dL=k*A*L-mu*L*D,dD=k*A*D-mu*L*D,dA=-k*A*(L+D);L+=dL*dt;D+=dD*dt;A=Math.max(0,A+dA*dt)}return (L-D)/(L+D)}
SCENE({id:'chirality-soai',name:'Amplifying a tiny excess',tag:'The Soai reaction',
 definition:'In 1953 Charles Frank showed in theory that a reaction whose product catalyses its own formation, while the two mirror forms suppress each other, can turn a tiny excess of one hand into almost pure one-handedness. In 1995 Kenso Soai found a real reaction that does this.',
 example:'In later work Soai’s group reported starting from an excess of about 0.00005% and reaching over 99.5% in three rounds of reaction.',
 desc:'Bars show the excess of one hand after each round of a Frank-type model, starting from the excess you choose; each round seeds the next. The model is a sketch of the mechanism, not a fit to Soai’s data.',
 research:'Frank, F. C. (1953). On spontaneous asymmetric synthesis. BBA 11, 459–463. Soai, K., Shibata, T., Morioka, H. & Choji, K. (1995). Asymmetric autocatalysis and amplification of enantiomeric excess of a chiral molecule. Nature 378, 767–768. Sato, I., Urabe, H., Ishiguro, S., Shibata, T. & Soai, K. (2003). Amplification of chirality from extremely low to greater than 99.5% ee by asymmetric autocatalysis. Angewandte Chemie International Edition 42, 315–317. Blackmond (2004). PNAS 101, 5732–5736.',
 dur:12,hint:'Start from a tiny excess and step through the rounds. The Soai reaction is a special chemical system; nothing like it has been found in prebiotic chemistry.',
 init:()=>({e0:-4,k:1}),
 watch(p){return {e0:-4,k:Math.min(4,Math.floor(p*5))}},
 ui:[{range:'e0',label:'Starting excess (log₁₀ of %)',min:-6,max:1,step:.5,get:s=>s.e0,act:'e0',show:v=>{const x=Math.pow(10,v);return (x<.01?x.toExponential(0):x<1?x.toFixed(2):x.toFixed(0))+'%'}},{b:'Previous round',act:'prev'},{b:'Next round',act:'next'}],
 on:{e0(s,v){s.e0=Number(v);return 'keep'},prev(s){s.k=Math.max(0,s.k-1);return 'keep'},next(s){s.k=Math.min(4,s.k+1);return 'keep'}},
 draw(s){
  const ees=[Math.pow(10,s.e0)/100];for(let i=0;i<4;i++)ees.push(A6_round(ees[i]));let out=A6_tag('demonstrated')+heading('A tiny excess, amplified',26);
  const p=A6_plot(80,96,420,200,[0,5],[0,1],{yt:[[0,'0%'],[.5,'50%'],[1,'100%']],yl:'excess of one hand'});out+=p.svg;
  ees.forEach((e,i)=>{const x=p.X(i+.5),shown=i<=s.k;out+=R(x-30,p.Y(Math.max(e,.004)),60,p.Y(0)-p.Y(Math.max(e,.004)),shown?(e>.9?C.green:C.purple):'#eef2f5','none',4)+TF(x,p.Y(0)+18,i===0?'start':'round '+i,12,C.muted);if(shown)out+=TBF(x,Math.max(p.Y(Math.max(e,.004))-8,86),A6_pct(e),12,C.ink)});
  out+=TF(300,338,'Each round, the product catalyses its own hand and the two hands suppress each other.',13,C.muted);
  out+=TF(300,358,'Model values are illustrative (Frank-type model, not a fit to Soai’s data).',13,C.muted);
  return {svg:out,phase:ees[s.k]>.99?'Almost pure one-handedness, from an excess far too small to measure directly. Amplification like this is demonstrated, but only in Soai’s special zinc chemistry, which is not prebiotic.':'Each round multiplies the imbalance. Autocatalysis plus mutual suppression is the key: without the suppression, the excess would stay as small as it started.'};
 }});

/* ---- where could the first imbalance come from? ---- */
const A6_SRC=[
 {k:'viedma',name:'Grinding crystals',d:'Viedma (2005) ground a slurry of mirror-image sodium chlorate crystals: one hand slowly took over completely. Later work did the same with amino-acid derivatives.',st:'Demonstrated for crystals; prebiotic relevance uncertain'},
 {k:'cpl',name:'Polarised starlight',d:'Circularly polarised ultraviolet light destroys one hand slightly faster than the other, leaving excesses of a few per cent in lab tests. Star-forming regions emit such light.',st:'Demonstrated in the lab; the space link is speculative'},
 {k:'met',name:'Meteorite amino acids',d:'Some amino acids in the Murchison meteorite, such as isovaline, carry excesses of the L form, reported as high as about 18% (Glavin & Dworkin 2009).',st:'Measured; how the excess arose is debated'},
 {k:'mag',name:'Magnetic surfaces',d:'Ozturk and Sasselov (2023) crystallised an RNA precursor on magnetite surfaces, where electron spin favoured one hand, and reported a high excess.',st:'A recent, striking lab result; needs confirmation'}];
SCENE({id:'chirality-viedma',name:'Where the first tilt came from',tag:'Sources of a small imbalance',
 definition:'Amplification needs a first, small imbalance. Candidates include grinding of crystals (Viedma ripening), circularly polarised light in space, excesses delivered by meteorites, and spin-selective magnetic mineral surfaces. None is established as the origin of life’s handedness.',
 example:'Grinding a slurry of sodium chlorate crystals with glass beads turned an even mix of left- and right-handed crystals into a single hand within days (Viedma 2005).',
 desc:'A model of Viedma grinding on the left: crystals coloured by hand, with the share of the winning hand growing over time. On the right, four candidate sources of an imbalance; press one for its evidence.',
 research:'Viedma, C. (2005). Chiral symmetry breaking during crystallization: complete chiral purity induced by nonlinear autocatalysis and recycling. Physical Review Letters 94, 065504. Glavin, D. P. & Dworkin, J. P. (2009). Enrichment of the amino acid L-isovaline by aqueous alteration on CI and CM meteorite parent bodies. PNAS 106, 5487–5492. Ozturk, S. F. et al. (2023). Origin of biological homochirality by crystallization of an RNA precursor on a magnetic surface. Science Advances 9, eadg8274. Meierhenrich, U. (2008). Amino Acids and the Asymmetry of Life. Springer.',
 dur:12,hint:'Slide the grinding time, then press each source card. All four are candidates; none is settled.',
 init:()=>({t:3,k:0}),
 watch(p){return {t:Math.round(p*10),k:Math.min(3,Math.floor(p*4))}},
 ui:[{range:'t',label:'Grinding time (days, illustrative)',min:0,max:10,get:s=>s.t,act:'t'}],
 on:{t(s,v){s.t=Number(v);return 'keep'},k(s,v){s.k=Number(v);return 'keep'}},
 draw(s,f,X){
  let e=.05;for(let i=0;i<s.t*10;i++)e=Math.min(1,e+.06*e*(1-e*e));let out=A6_tag('speculative')+heading('Where did the first tilt come from?',26);
  const nL=Math.round((1+e)/2*48);const r=rng(21),idx=range(48).map(i=>[r(),i]).sort((a,b)=>a[0]-b[0]).map(q=>q[1]);
  for(let i=0;i<48;i++){const j=idx[i],x=40+(j%8)*30,y=60+Math.floor(j/8)*30,lft=i<nL;out+=P(lft?`M${x} ${y+22} L${x+11} ${y} L${x+22} ${y+22} Z`:`M${x} ${y} L${x+22} ${y} L${x+11} ${y+22} Z`,lft?C.blue:C.coral,1.5,tint(lft?C.blue:C.coral,.55))}
  out+=TBF(160,262,`left-handed crystals: ${Math.round((1+e)/2*100)}%`,14,C.blue)+TF(160,282,'grinding plus dissolving lets one hand win',12,C.muted);
  A6_SRC.forEach((c,i)=>{out+=hit(X,'k',i,'Show '+c.name,R(310,52+i*40,270,34,s.k===i?C.pale:'#fff',s.k===i?C.blue:C.line,8)+TBF(445,74+i*40,c.name,13,C.ink))});
  const c=A6_SRC[s.k];out+=A6_lines(310,226,c.d,40)+A6_wrap(c.st,44).map((l,i)=>TBF(310,322+i*16,l,12,C.amber,'start')).join('');
  return {svg:out,phase:'Several physical processes can tip the balance slightly, and amplification can finish the job, but which (if any) did so on the early Earth is unknown. Homochirality remains one of the open puzzles of the origin of life.'};
 }});
