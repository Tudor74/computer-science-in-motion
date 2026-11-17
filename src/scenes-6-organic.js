/* ===================== Chemistry era 6 · The chemistry of carbon ===================== */
// Carbon skeletons, functional groups, benzene, handedness, polymers and synthesis by design.
// Every picture is a pure function of state, frame and X; any scatter comes from seeded generators.
const C6_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const C6_n=(v,d=0)=>Number(v).toFixed(d);
const C6_deg=v=>(v<0?'−':'')+Math.abs(v)+' °C';
const C6_cap=t=>t[0].toUpperCase()+t.slice(1);
const C6_sub=n=>String(n).split('').map(c=>'₀₁₂₃₄₅₆₇₈₉'[+c]).join('');
function C6_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// An atom as a labelled disc.
const C6_atom=(x,y,lab,col=C.ink,r=13)=>Ci(x,y,r,'#fff',col,'stroke-width="2"')+TBF(x,y+5,lab,14,col);
// Atom counting for formula checks: {C,H,O,N,Cl,...}
function C6_count(f){const o={};String(f).replace(/([A-Z][a-z]?)(\d*)/g,(m,e,n)=>{o[e]=(o[e]||0)+(n?+n:1);return ''});return o}
function C6_pretty(f){return String(f).replace(/(\d+)/g,m=>C6_sub(m))}

/* ================================================================ carbon-skeletons */
const C6_ALK=[['methane',-162],['ethane',-89],['propane',-42],['butane',-1],['pentane',36],['hexane',69],['heptane',98],['octane',126]];
function C6_zig(n,x0,dx,yA,yB){return range(n).map(i=>[x0+i*dx,i%2?yB:yA])}
SCENE({id:'carbon-skeletons',name:'Chains of carbon',tag:'Kekulé and Couper, 1858',
 definition:'Carbon forms four bonds and bonds strongly to itself, so carbon atoms can link into chains of any length. In 1858 August Kekulé and Archibald Scott Couper independently proposed that carbon is tetravalent and that its atoms join to one another.',
 example:'Each extra CH₂ in the chain from methane to octane adds 14 to the molar mass and raises the boiling point by a shrinking step, from about 73 °C (methane to ethane) to about 27 °C (heptane to octane): butane boils at −1 °C, octane at 126 °C.',
 desc:'A zigzag carbon chain whose length the learner sets, drawn with its hydrogens, beside the molecular formula CₙH₂ₙ₊₂, the name and the measured boiling point.',
 research:'Kekulé, A. (1858). Über die Constitution und die Metamorphosen der chemischen Verbindungen und über die chemische Natur des Kohlenstoffs. Annalen der Chemie 106, 129–159. Couper, A. S. (1858). On a new chemical theory. Philosophical Magazine 16, 104–116. Boiling points: CRC Handbook of Chemistry and Physics.',
 dur:10,hint:'Change the number of carbons and switch between the full drawing and the skeletal shorthand chemists use.',
 init:()=>({n:4,view:'full'}),
 watch(p){return {n:1+Math.min(7,Math.floor(p*8)),view:p<.5?'full':'skel'}},
 ui:[{range:'n',label:'Carbon atoms',min:1,max:8,step:1,get:s=>s.n,act:'n',show:v=>v},
  {choose:[['full','Every atom'],['skel','Skeletal']],label:'Drawing',get:s=>s.view,act:'view'}],
 on:{n(s,v){s.n=Number(v);return 'keep'},view(s,v){s.view=v;return 'keep'}},
 draw(s){
  const n=s.n,[name,bp]=C6_ALK[n-1];
  let out=heading(`${name[0].toUpperCase()+name.slice(1)}: C${C6_sub(n)}H${C6_sub(2*n+2)}`,30);
  const dx=n>1?Math.min(62,420/(n-1)):0,x0=300-dx*(n-1)/2,pts=C6_zig(n,x0,dx,150,190);
  if(s.view==='skel'&&n>1){out+=C6_poly(pts,C.ink,3.2);pts.forEach(p=>out+=Ci(p[0],p[1],3.5,C.ink))}
  else{
   for(let i=0;i<n-1;i++)out+=L(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],C.ink,2.4);
   pts.forEach((p,i)=>{const h=n===1?4:(i===0||i===n-1)?3:2,up=i%2?1:-1;
    out+=TF(p[0],p[1]+up*34+(up>0?6:0),'H'+(h>1?C6_sub(h):''),14,C.muted);out+=L(p[0],p[1]+up*14,p[0],p[1]+up*22,C.line,1.5);
    out+=C6_atom(p[0],p[1],'C',C.ink)});
  }
  if(s.view==='skel'&&n===1)out+=TF(300,170,'One carbon has no skeleton to draw: CH₄',14,C.muted);
  out+=R(60,248,480,74,C.pale,'none',10);
  out+=TF(80,272,`molar mass ${12*n+(2*n+2)} g/mol`,14,C.ink,'start')+TF(80,296,`boils at ${C6_deg(bp)}`,14,C.coral,'start');
  out+=TF(520,272,n>=5?'liquid at room temperature':'gas at room temperature',14,C.blue,'end');
  out+=TF(520,296,s.view==='skel'?'each corner and end is a CH₂ or CH₃':'four bonds on every carbon',13,C.muted,'end');
  out+=TF(300,350,'Longer chains cling together more, so boiling points climb with length.',13,C.muted);
  return {svg:out,phase:`${name[0].toUpperCase()+name.slice(1)} has ${n} carbon${n>1?'s':''} and ${2*n+2} hydrogens. The pattern CₙH₂ₙ₊₂ holds for every open-chain alkane, branched or not, because each carbon keeps four bonds. Skeletal formulas leave out the C and H labels: every corner is a carbon carrying enough hydrogens to make four bonds.`};
 }});

// Structural isomers: the same formula, different skeletons.
const C6_ISO={
 4:[{n:'butane',bp:-1,c:[[0,0],[1,0],[2,0],[3,0]],e:[[0,1],[1,2],[2,3]]},{n:'2-methylpropane',bp:-12,c:[[0,0],[1,0],[2,0],[1,-1]],e:[[0,1],[1,2],[1,3]]}],
 5:[{n:'pentane',bp:36,c:[[0,0],[1,0],[2,0],[3,0],[4,0]],e:[[0,1],[1,2],[2,3],[3,4]]},{n:'2-methylbutane',bp:28,c:[[0,0],[1,0],[2,0],[3,0],[1,-1]],e:[[0,1],[1,2],[2,3],[1,4]]},{n:'2,2-dimethylpropane',bp:10,c:[[0,0],[1,0],[2,0],[1,-1],[1,1]],e:[[0,1],[1,2],[1,3],[1,4]]}],
 6:[{n:'hexane',bp:69,c:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]],e:[[0,1],[1,2],[2,3],[3,4],[4,5]]},{n:'2-methylpentane',bp:60,c:[[0,0],[1,0],[2,0],[3,0],[4,0],[1,-1]],e:[[0,1],[1,2],[2,3],[3,4],[1,5]]},{n:'3-methylpentane',bp:63,c:[[0,0],[1,0],[2,0],[3,0],[4,0],[2,-1]],e:[[0,1],[1,2],[2,3],[3,4],[2,5]]},{n:'2,2-dimethylbutane',bp:50,c:[[0,0],[1,0],[2,0],[3,0],[1,-1],[1,1]],e:[[0,1],[1,2],[2,3],[1,4],[1,5]]},{n:'2,3-dimethylbutane',bp:58,c:[[0,0],[1,0],[2,0],[3,0],[1,-1],[2,-1]],e:[[0,1],[1,2],[2,3],[1,4],[2,5]]}]};
const C6_ISOCOUNT=[[4,2],[5,3],[6,5],[7,9],[8,18],[9,35],[10,75]];
SCENE({id:'carbon-skeletons-isomers',name:'Same formula, different molecules',tag:'Structural isomers',
 definition:'Structural isomers share a molecular formula but join their atoms in a different order. Branching makes a molecule more compact, so it boils lower.',
 example:'C₅H₁₂ is three different compounds: pentane boils at 36 °C, 2-methylbutane at 28 °C and the ball-shaped 2,2-dimethylpropane at about 10 °C.',
 desc:'The skeletons of every isomer of the chosen formula, one highlighted with its name and boiling point, beside a chart of how fast the number of alkane isomers grows with chain length.',
 research:'Butlerov, A. (1861) introduced chemical structure; isomer counts for alkanes go back to Cayley, A. (1875). On the analytical forms called trees, with application to the theory of chemical combinations. Report of the British Association 45, 257–305. Boiling points: CRC Handbook.',
 dur:12,hint:'Choose a formula, then step through its isomers. Compare the boiling points: branching lowers them.',
 init:()=>({f:5,i:0}),
 watch(p){const f=p<.33?4:p<.66?5:6,list=C6_ISO[f],q=(p-(f-4)/3)*3;return {f,i:Math.min(list.length-1,Math.floor(q*list.length))}},
 ui:[{choose:[['4','C₄H₁₀'],['5','C₅H₁₂'],['6','C₆H₁₄']],label:'Formula',get:s=>String(s.f),act:'f'},{b:'Next isomer',act:'next'}],
 on:{f(s,v){s.f=Number(v);s.i=0;return 'keep'},next(s){s.i=(s.i+1)%C6_ISO[s.f].length;return 'keep'}},
 draw(s){
  const list=C6_ISO[s.f],m=list[s.i];
  let out=heading(`C${C6_sub(s.f)}H${C6_sub(2*s.f+2)}: ${list.length} isomers`,28);
  const cols=list.length,w=360/cols;
  list.forEach((iso,k)=>{const cx=30+w*k+w/2,sc=Math.min(22,(w-18)/5),xs=iso.c.map(q=>q[0]),mid=(Math.min(...xs)+Math.max(...xs))/2,pt=q=>[cx+(q[0]-mid)*sc,110+q[1]*sc];
   const on=k===s.i;out+=R(30+w*k+4,60,w-8,100,on?C.coralp:'#fff',on?C.coral:C.grid,8);
   iso.e.forEach(([a,b])=>{const A=pt(iso.c[a]),B=pt(iso.c[b]);out+=L(A[0],A[1],B[0],B[1],on?C.coral:C.ink,2.6)});
   iso.c.forEach(q=>{const A=pt(q);out+=Ci(A[0],A[1],3.2,on?C.coral:C.ink)});
   out+=TBF(cx,150,C6_deg(iso.bp),13,on?C.coral:C.muted)});
  out+=TBF(30,190,m.n,16,C.coral,'start')+TF(30,212,`boils at ${C6_deg(m.bp)}`,14,C.ink,'start');
  out+=TF(30,236,m.c.some(q=>q[1]!==0)?'Branches make it more compact: less surface':'Unbranched: the longest, most stretched-out shape',13,C.muted,'start');
  out+=TF(30,254,m.c.some(q=>q[1]!==0)?'to touch its neighbours, so it boils lower.':'touches its neighbours most, so it boils highest.',13,C.muted,'start');
  const pl=C6_plot(430,200,140,120,[3.5,10.5],[0,80],{xt:[[4,'4'],[6,'6'],[8,'8'],[10,'10']],yt:[[0,'0'],[40,'40'],[80,'80']],xl:'carbons',yl:'isomers'});
  out+=pl.svg;C6_ISOCOUNT.forEach(([c,k])=>out+=R(pl.X(c)-7,pl.Y(k),14,pl.Y(0)-pl.Y(k),c===s.f?C.coral:C.blue,'none',2));
  out+=TF(30,300,'The count grows fast: 75 isomers',13,C.ink,'start')+TF(30,318,'for C₁₀H₂₂, 366,319 for C₂₀H₄₂.',13,C.ink,'start');
  out+=TF(300,372,'Same atoms, different arrangement: a different compound.',13,C.muted);
  return {svg:out,phase:`${C6_cap(m.n)} is one of ${list.length} ways to join ${s.f} carbons and ${2*s.f+2} hydrogens. Counting them is a problem about branching trees, first worked on by Arthur Cayley in 1875; the numbers climb so steeply that C₂₀H₄₂ has 366,319 isomers.`};
 }});

// Single, double, triple bonds.
const C6_BONDS=[{k:'single',m:'ethane',f:'C₂H₆',len:154,E:348,ang:'109.5°',shape:'tetrahedral'},{k:'double',m:'ethene',f:'C₂H₄',len:134,E:614,ang:'120°',shape:'flat'},{k:'triple',m:'ethyne',f:'C₂H₂',len:120,E:839,ang:'180°',shape:'straight'}];
SCENE({id:'carbon-skeletons-bonds',name:'Single, double and triple bonds',tag:'Shorter and stronger',
 definition:'Two carbon atoms can share one, two or three pairs of electrons. Each extra shared pair pulls the atoms closer and makes the bond harder to break, and changes the shape around each carbon.',
 example:'The C–C bond in ethane is 154 pm long; the C=C bond in ethene is 134 pm, and the C≡C bond in ethyne just 120 pm.',
 desc:'Ethane, ethene or ethyne drawn with their hydrogens, beside bars for bond length and average bond energy and the angle the bonds make.',
 research:'Bond lengths from gas-phase structures; average bond energies as tabulated in standard texts (e.g. Atkins’ Physical Chemistry). Average bond energies vary with the molecule, so treat them as typical values.',
 dur:9,hint:'Choose single, double or triple and compare length, strength and shape.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(2,Math.floor(p*3))}},
 ui:[{choose:[['0','Single'],['1','Double'],['2','Triple']],label:'Bond',get:s=>String(s.k),act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s){
  const b=C6_BONDS[s.k],half=b.len*.45;
  let out=heading(`${b.m[0].toUpperCase()+b.m.slice(1)}, ${b.f}: a ${b.k} bond`,30);
  const cx=180,cy=170,a=cx-half/1,bx=cx+half;
  for(let i=0;i<=s.k;i++){const o=(i-s.k/2)*9;out+=L(a,cy+o,bx,cy+o,C.ink,2.6)}
  const Hs=s.k===0?[[-1,-1],[-1,1],[-1.25,0]]:s.k===1?[[-1,-1],[-1,1]]:[[-1.3,0]];
  Hs.forEach(([dx,dy])=>{const hx=a+dx*44,hy=cy+dy*40;out+=L(a,cy,hx,hy,C.line,2)+C6_atom(hx,hy,'H',C.muted,11);const mx=bx-dx*44;out+=L(bx,cy,mx,hy,C.line,2)+C6_atom(mx,hy,'H',C.muted,11)});
  out+=C6_atom(a,cy,'C')+C6_atom(bx,cy,'C');
  out+=TF(cx,252,`${b.shape} around each carbon, ${b.ang}`,14,C.blue);
  const pl=C6_plot(370,70,200,80,[0,3],[0,200],{});out+=TBF(370,58,'Length (pm)',13,C.ink,'start');
  C6_BONDS.forEach((q,i)=>{out+=R(pl.X(i+.15),pl.Y(q.len),40,pl.Y(0)-pl.Y(q.len),i===s.k?C.coral:C.line,'none',3)+TF(pl.X(i+.5),pl.Y(q.len)-5,q.len,13,i===s.k?C.coral:C.muted)});
  const p2=C6_plot(370,200,200,80,[0,3],[0,1100],{});out+=TBF(370,188,'Energy to break (kJ/mol)',13,C.ink,'start');
  C6_BONDS.forEach((q,i)=>{out+=R(p2.X(i+.15),p2.Y(q.E),40,p2.Y(0)-p2.Y(q.E),i===s.k?C.coral:C.line,'none',3)+TF(p2.X(i+.5),p2.Y(q.E)-5,q.E,13,i===s.k?C.coral:C.muted)});
  ['single','double','triple'].forEach((t,i)=>out+=TF(pl.X(i+.5),300,t,13,C.muted));
  out+=TF(300,350,'A double bond is strong but not twice as strong: its second pair is easier to break,',13,C.muted);
  out+=TF(300,368,'which is why ethene reacts readily where ethane does not.',13,C.muted);
  return {svg:out,phase:`Each extra shared pair shortens the bond and strengthens it: ${b.len} pm and about ${b.E} kJ/mol for the ${b.k} bond. The shapes follow the electron pairs, which spread as far apart as they can.`};
 }});

/* ================================================================ functional-groups */
const C6_FG=[
 {g:'H',n:'ethane',cls:'alkane',bp:-89,note:['no group: oily,','unreactive, insoluble']},
 {g:'OH',n:'ethanol',cls:'alcohol',bp:78,note:['hydrogen-bonds:','mixes with water']},
 {g:'CHO',n:'propanal',cls:'aldehyde',bp:49,note:['easily oxidised;','sharp smell']},
 {g:'COOH',n:'propanoic acid',cls:'carboxylic acid',bp:141,note:['a weak acid; pairs','by hydrogen bonds']},
 {g:'NH₂',n:'ethylamine',cls:'amine',bp:17,note:['a weak base;','fishy smell']},
 {g:'Cl',n:'chloroethane',cls:'haloalkane',bp:12,note:['polar C–Cl bond;','once an anaesthetic']}];
SCENE({id:'functional-groups',name:'Functional groups',tag:'The reactive part',
 definition:'A functional group is a small cluster of atoms that gives an organic molecule its chemistry. Molecules with the same group react in similar ways whatever the length of their carbon chain.',
 example:'Swap one hydrogen of ethane for –OH and a gas boiling at −89 °C becomes ethanol, a liquid boiling at 78 °C that mixes with water.',
 desc:'An ethyl group, CH₃CH₂–, with a choice of group attached, the compound’s name and class, its boiling point on a scale with the others, and what the group does.',
 research:'Gerhardt, C. (1853) and later IUPAC nomenclature organised compounds into types by their reactive groups; IUPAC (2013). Nomenclature of Organic Chemistry. Boiling points: CRC Handbook.',
 dur:12,hint:'Attach different groups to the same ethyl chain and watch the boiling point and the class change.',
 init:()=>({k:1}),
 watch(p){return {k:Math.min(5,Math.floor(p*6))}},
 ui:[{choose:C6_FG.map((f,i)=>[String(i),f.g==='H'?'–H':'–'+f.g]),label:'Group',get:s=>String(s.k),act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s){
  const f=C6_FG[s.k];
  let out=heading(`${f.n[0].toUpperCase()+f.n.slice(1)}: ${f.cls==='alkane'?'an alkane':'the '+f.cls+' group'}`,30);
  out+=R(70,80,170,60,'#fff',C.line,10)+TBF(155,117,'CH₃–CH₂–',20,C.ink);
  out+=R(250,80,120,60,s.k?C.coralp:'#fff',s.k?C.coral:C.line,10)+TBF(310,117,f.g,22,s.k?C.coral:C.muted);
  out+=TF(310,160,f.cls,14,C.coral);
  out+=TF(390,104,f.note[0],13,C.ink,'start')+TF(390,124,f.note[1],13,C.ink,'start');
  const pl=C6_plot(70,206,460,40,[-100,150],[0,1],{xt:[[-100,'−100'],[-50,'−50'],[0,'0'],[50,'50'],[100,'100'],[150,'150 °C']]});
  out+=pl.svg+L(pl.X(25),206,pl.X(25),246,C.green,1.5,'stroke-dasharray="4 4"')+TF(pl.X(25),200,'room',13,C.green);
  C6_FG.forEach((q,i)=>{const x=pl.X(q.bp);out+=Ci(x,226,i===s.k?8:5,i===s.k?C.coral:C.line)});
  out+=TF(pl.X(f.bp),286,C6_deg(f.bp),14,C.coral);
  out+=TF(300,316,'Boiling point of each compound (dots)',13,C.muted);
  out+=TF(300,348,'Groups that can hydrogen-bond (–OH, –COOH, –NH₂) stick molecules together;',13,C.muted);
  out+=TF(300,366,'that, more than size, sets the boiling point here.',13,C.muted);
  return {svg:out,phase:`${C6_cap(f.n)} boils at ${C6_deg(f.bp)}. The carbon chain is almost the same in every case; the group decides how molecules hold on to each other and how they react, which is why chemists classify organic compounds by their groups.`};
 }});

// Oxidation ladder of ethanol, with the dichromate colour change.
const C6_OX=[{n:'ethanol',f:'C2H6O',draw:'CH₃–CH₂–OH',c:'#d8892b'},{n:'ethanal',f:'C2H4O',draw:'CH₃–CHO',c:'#8a8f3a'},{n:'ethanoic acid',f:'C2H4O2',draw:'CH₃–COOH',c:'#3f8a4e'}];
SCENE({id:'functional-groups-oxidation',name:'An oxidation ladder',tag:'Alcohol to aldehyde to acid',
 definition:'A primary alcohol can be oxidised in two steps: first to an aldehyde, losing two hydrogens, then to a carboxylic acid, gaining an oxygen. Acidified orange dichromate does it and turns green as chromium(VI) becomes chromium(III).',
 example:'Wine left open turns to vinegar the same way: bacteria oxidise ethanol to ethanoic acid. Early roadside breath tests used the dichromate colour change.',
 desc:'Three flasks along the ladder ethanol → ethanal → ethanoic acid, with the step the learner has reached, the formula change at each step, and the oxidising solution changing from orange to green.',
 research:'Borkenstein, R. F. (1954) introduced the dichromate Breathalyzer. The oxidation chemistry is standard (e.g. Clayden, Greeves & Warren, Organic Chemistry, 2nd edn, 2012). Safety: dichromate is toxic and carcinogenic; school labs now use alternatives.',
 dur:10,hint:'Step up the ladder and watch the formula and the colour of the oxidising agent.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(2,Math.floor(p*3))}},
 ui:[{range:'k',label:'Oxidation steps',min:0,max:2,step:1,get:s=>s.k,act:'k',show:v=>v}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s){
  let out=heading(`Step ${s.k}: ${C6_OX[s.k].n}`,30);
  C6_OX.forEach((m,i)=>{const x=110+i*190,on=i===s.k,done=i<=s.k;
   out+=P(`M${x-34} 70 L${x-34} 100 L${x-60} 170 Q${x-62} 182 ${x-48} 182 L${x+48} 182 Q${x+62} 182 ${x+60} 170 L${x+34} 100 L${x+34} 70`,on?C.coral:C.line,2.4,done?tint('#e8dcc2',.3):'#fff');
   out+=TBF(x,212,m.draw,15,on?C.coral:C.ink)+TF(x,232,C6_pretty(m.f),13,C.muted)+TF(x,250,m.n,13,on?C.coral:C.muted);
   if(i<2)out+=arrow(x+66,130,x+124,130,i<s.k?C.coral:C.line,2.5)+TF(x+95,118,i===0?'−2H':'+O',13,i<s.k?C.coral:C.muted)});
  const col=s.k===0?'#e07b1c':s.k===1?'#8a9a2a':'#2f8a4a';
  out+=R(120,280,360,34,col,'none',8)+TBF(300,302,s.k===0?'oxidising agent: orange (Cr₂O₇²⁻)':s.k===1?'turning: chromium(VI) being used up':'green: chromium(III) formed',14,'#fff');
  out+=TF(300,346,'Count the atoms: C₂H₆O → C₂H₄O (two hydrogens removed) → C₂H₄O₂ (one oxygen added).',13,C.muted);
  out+=TF(300,366,'Safety: dichromate is toxic; this is a picture, not a recipe.',13,C.coral);
  return {svg:out,phase:'Oxidation in organic chemistry means losing hydrogen or gaining oxygen. Ethanol loses two hydrogens to become ethanal, which gains an oxygen to become ethanoic acid. The orange-to-green change of dichromate shows that the reagent has been reduced as the alcohol was oxidised.'};
 }});

// Esters: the learner makes one from an acid and an alcohol.
const C6_ACIDS=[{n:'ethanoic acid',f:'C2H4O2',r:'ethanoate',k:'eth'},{n:'butanoic acid',f:'C4H8O2',r:'butanoate',k:'but'},{n:'salicylic acid',f:'C7H6O3',r:'salicylate',k:'sal'}];
const C6_ALCS=[{n:'methanol',f:'CH4O',r:'methyl',k:'me'},{n:'ethanol',f:'C2H6O',r:'ethyl',k:'et'},{n:'3-methylbutanol',f:'C5H12O',r:'3-methylbutyl',k:'am'},{n:'octanol',f:'C8H18O',r:'octyl',k:'oc'}];
const C6_SMELL={'eth-me':'sweet, glue-like','eth-et':'pear drops, nail-varnish remover','eth-am':'banana','eth-oc':'orange','but-me':'apple','but-et':'pineapple','but-am':'fruity, pear-like','but-oc':'faint and fruity','sal-me':'wintergreen (oil of wintergreen)','sal-et':'minty, wintergreen-like','sal-am':'floral, used in perfume','sal-oc':'faint; little smell'};
function C6_esterF(a,b){const A=C6_count(a.f),B=C6_count(b.f),o={};['C','H','O'].forEach(e=>o[e]=(A[e]||0)+(B[e]||0)-(e==='H'?2:e==='O'?1:0));return 'C'+o.C+'H'+o.H+'O'+o.O}
SCENE({id:'functional-groups-esters',name:'Make an ester',tag:'Acid + alcohol ⇌ ester + water',
 definition:'An ester forms when a carboxylic acid and an alcohol join and give off a molecule of water; an acid catalyst speeds it up. Esters are behind many fruit smells, and the reaction runs to an equilibrium rather than to completion.',
 example:'Ethanoic acid and 3-methylbutanol give 3-methylbutyl ethanoate, the smell of bananas; salicylic acid and methanol give oil of wintergreen.',
 desc:'The learner picks an acid and an alcohol; the scene names the ester, writes the balanced equation with an atom count, and gives the smell it is known for.',
 research:'Fischer, E. & Speier, A. (1895). Darstellung der Ester. Berichte der deutschen chemischen Gesellschaft 28, 3252–3258. Odour descriptions from standard flavour chemistry references; perception varies between people.',
 dur:12,hint:'Choose an acid and an alcohol. Check that the atoms balance, and read the smell the ester is known for.',
 init:()=>({a:0,b:2}),
 watch(p){const k=Math.min(5,Math.floor(p*6));return {a:[0,0,0,1,1,2][k],b:[1,2,3,0,1,0][k]}},
 ui:[{choose:C6_ACIDS.map((a,i)=>[String(i),a.n.replace(' acid','')]),label:'Acid',get:s=>String(s.a),act:'a'},
  {choose:C6_ALCS.map((a,i)=>[String(i),a.n]),label:'Alcohol',get:s=>String(s.b),act:'b'}],
 on:{a(s,v){s.a=Number(v);return 'keep'},b(s,v){s.b=Number(v);return 'keep'}},
 draw(s){
  const a=C6_ACIDS[s.a],b=C6_ALCS[s.b],ef=C6_esterF(a,b),name=`${b.r} ${a.r}`,sm=C6_SMELL[a.k+'-'+b.k];
  let out=heading(`You made ${name}`,30);
  const items=[[a.n,a.f,C.blue],['+',null],[b.n,b.f,C.purple],['⇌',null],[name,ef,C.coral],['+',null],['water','H2O',C.muted]];
  let x=20;const ws=[118,22,120,26,150,22,90];
  items.forEach(([n,f,col],i)=>{const w=ws[i];if(f){out+=R(x,70,w-6,70,'#fff',col,10)+TBF(x+(w-6)/2,100,C6_pretty(f),15,col)+TF(x+(w-6)/2,124,n.length>16?n.slice(0,16)+'…':n,13,C.muted)}else out+=TBF(x+w/2-3,112,n,20,C.ink);x+=w});
  const L1=C6_count(a.f),L2=C6_count(b.f),R1=C6_count(ef);let rows='';
  ['C','H','O'].forEach((e,i)=>{const l=(L1[e]||0)+(L2[e]||0),r=(R1[e]||0)+(e==='H'?2:e==='O'?1:0);out+=TF(80,190+i*24,`${e}: ${l} on the left, ${r} on the right`,14,l===r?C.green:C.coral,'start')});
  out+=TF(80,172,'Atom check',14,C.ink,'start');
  out+=R(330,160,250,96,C.coralp,'none',10)+TBF(345,186,'Known smell',14,C.coral,'start');
  const words=sm.split(', ');out+=TF(345,210,words[0],14,C.ink,'start');if(words[1])out+=TF(345,230,words[1],14,C.ink,'start');
  out+=TF(300,296,'The acid loses its –OH, the alcohol loses its H: together they leave as water.',13,C.muted);
  out+=TF(300,320,'It stops at an equilibrium; removing water pushes it towards more ester.',13,C.muted);
  out+=TF(300,360,'Smells are as usually described; people perceive them differently.',13,C.muted);
  return {svg:out,phase:`${a.n[0].toUpperCase()+a.n.slice(1)} + ${b.n} ⇌ ${name} + water. Every atom on the left appears on the right: the ester is the two molecules joined, minus H₂O. Fischer and Speier showed in 1895 that a little strong acid catalyses the reaction, and it still bears Fischer’s name.`};
 }});

/* ================================================================ benzene-aromaticity */
function C6_hex(cx,cy,r,rot=-90){return range(6).map(i=>{const a=(rot+60*i)*Math.PI/180;return [cx+r*Math.cos(a),cy+r*Math.sin(a)]})}
function C6_ring(cx,cy,r,mode,col=C.ink){
 const v=C6_hex(cx,cy,r);let out='';
 for(let i=0;i<6;i++){const a=v[i],b=v[(i+1)%6];out+=L(a[0],a[1],b[0],b[1],col,2.6);
  if((mode==='A'&&i%2===0)||(mode==='B'&&i%2===1)){const k=.18,ax=lerp(a[0],cx,k),ay=lerp(a[1],cy,k),bx=lerp(b[0],cx,k),by=lerp(b[1],cy,k);out+=L(lerp(ax,bx,.12),lerp(ay,by,.12),lerp(ax,bx,.88),lerp(ay,by,.88),col,2.6)}}
 if(mode==='D')out+=Ci(cx,cy,r*.58,'none',col,'stroke-width="2.6"');
 return out;
}
SCENE({id:'benzene-aromaticity',name:'Benzene’s ring',tag:'Kekulé, 1865; Lonsdale, 1929',
 definition:'Benzene, C₆H₆, is a flat ring of six carbons. Kekulé drew it with alternating single and double bonds; X-ray work showed instead that all six bonds are the same length, because six electrons are shared around the whole ring.',
 example:'If benzene had alternating bonds they would be 154 and 134 pm long. Every bond in benzene measures about 139 pm.',
 desc:'Benzene drawn as either of Kekulé’s two structures or as the delocalised ring, with bars comparing the bond lengths each picture predicts with the measured length.',
 research:'Kekulé, A. (1865). Sur la constitution des substances aromatiques. Bulletin de la Société Chimique de Paris 3, 98–110. Lonsdale, K. (1929). The structure of the benzene ring in C₆(CH₃)₆. Proceedings of the Royal Society A 123, 494–515. Faraday, M. (1825) isolated benzene.',
 dur:10,hint:'Switch between the two Kekulé structures and the delocalised ring, and compare the bond lengths with the measurement.',
 init:()=>({m:'A'}),
 watch(p){return {m:p<.33?'A':p<.66?'B':'D'}},
 ui:[{choose:[['A','Kekulé (1)'],['B','Kekulé (2)'],['D','Delocalised']],label:'Picture',get:s=>s.m,act:'m'}],
 on:{m(s,v){s.m=v;return 'keep'}},
 draw(s){
  let out=heading(s.m==='D'?'One ring of shared electrons: all bonds equal':'Kekulé’s picture: alternating single and double bonds',30);
  out+=C6_ring(170,180,80,s.m,s.m==='D'?C.coral:C.ink);
  C6_hex(170,180,80).forEach(p=>{const dx=p[0]-170,dy=p[1]-180,q=[170+dx*1.4,180+dy*1.4];out+=L(p[0]+dx*.12,p[1]+dy*.12,q[0]-dx*.08,q[1]-dy*.08,C.line,1.8)+TF(q[0]+dx*.12,q[1]+dy*.12+5,'H',14,C.muted)});
  const pl=C6_plot(360,70,210,190,[0,6],[100,160],{yt:[[100,'100'],[130,'130'],[160,'160 pm']]});out+=pl.svg;
  const lens=s.m==='D'?[139,139,139,139,139,139]:range(6).map(i=>((s.m==='A')===(i%2===0))?134:154);
  lens.forEach((v,i)=>out+=R(pl.X(i+.18),pl.Y(v),22,pl.Y(100)-pl.Y(v),s.m==='D'?C.coral:v<140?C.blue:C.line,'none',3));
  out+=L(360,pl.Y(139),570,pl.Y(139),C.green,2,'stroke-dasharray="6 4"')
  out+=TF(465,282,'bars: predicted · dashed: measured 139 pm',13,C.muted);
  out+=TF(300,330,s.m==='D'?'Matches the measurement: the six π electrons are spread around the ring.':'This predicts two bond lengths; the real molecule has only one.',14,s.m==='D'?C.green:C.coral);
  out+=TF(300,354,'Kekulé proposed (1872) that the double bonds flip back and forth; resonance and orbital',13,C.muted);
  out+=TF(300,372,'theory later described one structure in between, which is what Lonsdale’s X-rays showed.',13,C.muted);
  return {svg:out,phase:'Neither Kekulé structure exists on its own. Kathleen Lonsdale’s 1929 X-ray study of hexamethylbenzene showed a flat ring with equal bonds, and the two drawings are now read as two halves of one picture: six electrons shared evenly around the ring, the circle drawn inside the hexagon.'};
 }});

// Hydrogenation energies: aromatic stabilisation.
SCENE({id:'benzene-aromaticity-energy',name:'The ring is extra stable',tag:'Kistiakowsky, 1936',
 definition:'Adding hydrogen across a C=C double bond releases about 120 kJ/mol. If benzene had three ordinary double bonds it would release about 360 kJ/mol on full hydrogenation; it releases only about 208, so the ring is about 150 kJ/mol more stable than a ring of separate double bonds.',
 example:'Cyclohexene + H₂ → cyclohexane gives out 120 kJ/mol; benzene + 3H₂ → cyclohexane gives out 208 kJ/mol, not 360.',
 desc:'An energy ladder from benzene or an imagined "cyclohexatriene" down to cyclohexane, with each hydrogen molecule the learner adds and the energy released, and the gap that is the stabilisation energy.',
 research:'Kistiakowsky, G. B., Ruhoff, J. R., Smith, H. A. & Vaughan, W. E. (1936). Heats of organic reactions. IV. Hydrogenation of some dienes and of benzene. Journal of the American Chemical Society 58, 146–153. Values rounded.',
 dur:10,hint:'Add hydrogen one molecule at a time to the imagined ring of three double bonds, then compare with real benzene.',
 init:()=>({h:3}),
 watch(p){return {h:Math.min(3,Math.floor(p*4))}},
 ui:[{range:'h',label:'H₂ molecules added',min:0,max:3,step:1,get:s=>s.h,act:'h',show:v=>v}],
 on:{h(s,v){s.h=Number(v);return 'keep'}},
 draw(s){
  let out=heading('Energy released on adding hydrogen',30);
  const pl=C6_plot(90,60,300,250,[0,4],[-380,20],{yt:[[0,'0'],[-120,'−120'],[-240,'−240'],[-360,'−360']],yl:'energy (kJ/mol)'});out+=pl.svg;
  out+=L(90,pl.Y(0),390,pl.Y(0),C.line,1.5);
  for(let k=0;k<=s.h;k++){const y=pl.Y(-120*k);out+=L(pl.X(.2),y,pl.X(1.6),y,C.blue,3);if(k)out+=arrow(pl.X(.9),pl.Y(-120*(k-1))+3,pl.X(.9),y-3,C.blue,2)}
  out+=TF(pl.X(1.7),pl.Y(0)+5,'imagined: three C=C',13,C.blue,'start');
  if(s.h===3){out+=L(pl.X(2.4),pl.Y(-152),pl.X(3.8),pl.Y(-152),C.coral,3)+arrow(pl.X(3.1),pl.Y(-152)+3,pl.X(3.1),pl.Y(-360)-3,C.coral,2);
   out+=TF(pl.X(3.1),pl.Y(-152)-8,'real benzene',13,C.coral);
   out+=L(pl.X(1.6),pl.Y(0),pl.X(2.4),pl.Y(-152),C.muted,1.2,'stroke-dasharray="4 4"');
   out+=TF(pl.X(2),pl.Y(-60),'152',13,C.muted)}
  out+=L(pl.X(.2),pl.Y(-360),pl.X(3.8),pl.Y(-360),C.ink,3)+TF(pl.X(2),pl.Y(-360)+18,'cyclohexane',13,C.ink);
  out+=R(410,70,170,200,C.pale,'none',10);
  out+=TBF(424,94,'Released',14,C.ink,'start');
  out+=TF(424,118,`imagined: ${120*s.h} kJ/mol`,14,C.blue,'start');
  out+=TF(424,142,s.h===3?'benzene: 208 kJ/mol':'benzene: add all 3',14,C.coral,'start');
  out+=TF(424,180,s.h===3?'Difference: 152 kJ/mol':'',14,C.green,'start');
  out+=TF(424,204,s.h===3?'the aromatic':'',13,C.muted,'start')+TF(424,222,s.h===3?'stabilisation energy':'',13,C.muted,'start');
  out+=TF(300,350,'Benzene starts lower than a ring of three separate double bonds would, so it falls less far.',13,C.muted);
  out+=TF(300,370,'That extra stability is why benzene resists addition and prefers substitution.',13,C.muted);
  return {svg:out,phase:'Each C=C hydrogenated gives out about 120 kJ/mol, so three should give 360. Benzene gives 208. The missing 152 kJ/mol is energy benzene never had: the shared ring of electrons already put it lower. Kistiakowsky’s 1936 calorimetry turned "aromatic stability" into a number.'};
 }});

// The Kekulé dream: traditional story, with the evidence around it.
const C6_BZT=[
 {y:'1825',t:'Faraday isolates benzene',d:'from the oily residue of illuminating gas; formula later found to be C₆H₆.'},
 {y:'1861',t:'Loschmidt draws rings',d:'Josef Loschmidt’s pamphlet shows benzene-like compounds as circles, years earlier.'},
 {y:'1865',t:'Kekulé’s hexagon',d:'Kekulé proposes a six-carbon ring of alternating single and double bonds.'},
 {y:'1872',t:'Oscillation idea',d:'Kekulé suggests the double bonds flip back and forth to make the bonds equal.'},
 {y:'1890',t:'The dream story',d:'At a jubilee, Kekulé says the ring came to him as a snake seizing its tail. Traditional, told 25 years later, and disputed.'},
 {y:'1929',t:'Lonsdale’s X-rays',d:'Kathleen Lonsdale shows the ring is flat with equal bonds.'},
 {y:'1931',t:'Hückel’s rule',d:'Erich Hückel explains why rings with 4n+2 π electrons are especially stable.'}];
SCENE({id:'benzene-aromaticity-dream',name:'The dream and the evidence',tag:'A traditional story',
 definition:'Kekulé said in 1890 that the benzene ring came to him in a reverie of a snake biting its own tail. Historians treat the story as traditional: it was told decades later, and others, including Loschmidt, had drawn rings first.',
 example:'Loschmidt’s 1861 pamphlet already showed aromatic compounds as circles, four years before Kekulé’s ring.',
 desc:'A timeline of the benzene problem from Faraday’s isolation in 1825 to Hückel’s rule in 1931, with the dream story marked as a later, disputed account.',
 research:'Rocke, A. J. (2010). Image and Reality: Kekulé, Kopp, and the Scientific Imagination. University of Chicago Press. Wotiz, J. H. & Rudofsky, S. (1984) argued the dream was invented, a claim others disputed. Loschmidt, J. (1861). Chemische Studien I.',
 dur:12,hint:'Step through the timeline. The dream is a famous story, but read what came before it.',
 init:()=>({k:4}),
 watch(p){return {k:Math.min(6,Math.floor(p*7))}},
 ui:[{range:'k',label:'Event',min:0,max:6,step:1,get:s=>s.k,act:'k',show:v=>C6_BZT[v].y}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s){
  const e=C6_BZT[s.k];
  let out=heading('The benzene problem, 1825–1931',30);
  out+=L(50,110,550,110,C.line,3);
  C6_BZT.forEach((q,i)=>{const x=50+i*500/6,on=i===s.k,dream=i===4;out+=Ci(x,110,on?10:6,on?(dream?C.amber:C.coral):(dream?C.amberp:'#fff'),dream?C.amber:C.coral,'stroke-width="2"');out+=TF(x,i%2?142:90,q.y,13,on?C.coral:C.muted)});
  out+=R(60,170,480,110,s.k===4?C.amberp:C.coralp,'none',10);
  out+=TBF(80,198,`${e.y}: ${e.t}`,16,s.k===4?C.amber:C.coral,'start');
  const words=e.d.split(' ');let line='',ly=226;words.forEach(w=>{if((line+' '+w).length>62){out+=TF(80,ly,line.trim(),14,C.ink,'start');ly+=20;line=''}line+=' '+w});out+=TF(80,ly,line.trim(),14,C.ink,'start');
  if(s.k===4)out+=TF(300,312,'Status: traditional and disputed. The chemistry did not depend on it.',14,C.amber);
  else out+=TF(300,312,'Status: documented in the printed record.',14,C.green);
  out+=TF(300,350,'Discoveries usually have several authors and a long run-up;',13,C.muted);
  out+=TF(300,368,'single flashes of insight make good stories but rarely the whole history.',13,C.muted);
  return {svg:out,phase:'The snake story is famous because it is vivid, but it came from a speech 25 years after the fact. The printed record shows a run of steps by several chemists, from Faraday to Lonsdale and Hückel.'};
 }});

// Hückel's rule, with a 3D view of the π cloud.
const C6_HUC=[{k:'4',n:4,pi:4,ch:'',name:'cyclobutadiene',v:'antiaromatic: very unstable',c:C.coral},{k:'5',n:5,pi:6,ch:'−',name:'cyclopentadienyl anion',v:'aromatic',c:C.green},{k:'6',n:6,pi:6,ch:'',name:'benzene',v:'aromatic',c:C.green},{k:'7',n:7,pi:6,ch:'+',name:'tropylium cation',v:'aromatic',c:C.green},{k:'8',n:8,pi:8,ch:'',name:'cyclooctatetraene',v:'not aromatic: it folds into a tub',c:C.amber}];
SCENE({id:'benzene-aromaticity-huckel',name:'Hückel’s 4n + 2 rule',tag:'Which rings are aromatic',
 definition:'A flat ring with a continuous loop of p orbitals is especially stable, aromatic, when it holds 4n + 2 π electrons (2, 6, 10 …). With 4n electrons (4, 8 …) a flat ring would be destabilised, so such rings are reactive or bend out of plane.',
 example:'Benzene has 6 π electrons and is aromatic; flat cyclobutadiene, with 4, is so unstable it has only been studied at very low temperature; cyclooctatetraene, with 8, folds into a tub.',
 desc:'A ring of the chosen size with its π electrons counted, a verdict from Hückel’s rule, and a 3D view of the doughnut-shaped π cloud above and below the ring.',
 research:'Hückel, E. (1931). Quantentheoretische Beiträge zum Benzolproblem. Zeitschrift für Physik 70, 204–286. Doering, W. von E. & Knox, L. H. (1954). The cycloheptatrienylium (tropylium) ion. JACS 76, 3203–3206. Breslow, R. (1965) on antiaromaticity.',
 dur:12,hint:'Choose a ring and count its π electrons. Is it 4n + 2? Open the 3D view to see the cloud.',
 init:()=>({k:2}),
 watch(p){return {k:Math.min(4,Math.floor(p*5))}},
 ui:[{choose:C6_HUC.map((h,i)=>[String(i),h.n+' ring'+(h.ch==='+'?' (+)':h.ch?' (−)':'')]),label:'Ring',get:s=>String(s.k),act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s){
  const h=C6_HUC[s.k],cx=170,cy=190,r=78;
  let out=heading(`${h.name[0].toUpperCase()+h.name.slice(1)}: ${h.pi} π electrons`,30);
  const v=range(h.n).map(i=>{const a=(-90+360/h.n*i)*Math.PI/180;return [cx+r*Math.cos(a),cy+r*Math.sin(a)]});
  for(let i=0;i<h.n;i++){const a=v[i],b=v[(i+1)%h.n];out+=L(a[0],a[1],b[0],b[1],C.ink,2.6)}
  range(h.pi).forEach(i=>{const a=(-90+360/h.pi*i+18)*Math.PI/180;out+=Ci(cx+r*.55*Math.cos(a),cy+r*.55*Math.sin(a),5,h.c)});
  if(h.ch)out+=TBF(cx+r+16,cy-r+10,h.ch==='+'?'+':'−',22,C.ink);
  out+=R(330,70,250,190,C.pale,'none',10);
  out+=TBF(344,96,'Count and test',15,C.ink,'start');
  out+=TF(344,124,`ring atoms: ${h.n}`,14,C.ink,'start')+TF(344,148,`π electrons: ${h.pi}`,14,C.ink,'start');
  const isH=(h.pi-2)%4===0;
  out+=TF(344,176,isH?`${h.pi} = 4×${(h.pi-2)/4} + 2  ✓`:`${h.pi} = 4×${h.pi/4}: a 4n number`,14,isH?C.green:C.coral,'start');
  out+=TBF(344,210,h.v.split(':')[0],15,h.c,'start');if(h.v.includes(':'))out+=TF(344,232,h.v.split(':')[1].trim(),13,C.muted,'start');
  out+=TF(300,320,'Charges count: the five-ring anion and the seven-ring cation both have 6 π electrons.',13,C.muted);
  out+=TF(300,346,'The rule assumes a flat ring; large or strained rings can escape it by bending.',13,C.muted);
  return {svg:out,phase:`${h.name[0].toUpperCase()+h.name.slice(1)} has ${h.pi} π electrons, ${isH?'a 4n + 2 number, so it is aromatic':'a 4n number, so a flat ring would be destabilised'}. Hückel’s 1931 orbital calculation explained what chemists had seen: six is special, and so are 2 and 10.`};
 },
 three(s,f,X,project){
  const h=C6_HUC[s.k],n=h.n,Pj=project([-2.4,2.4,-2.4,2.4,-1.2,1.2]),faces=[];
  const ringPt=(rr,i,z)=>{const a=2*Math.PI*i/24;return [rr*Math.cos(a),rr*Math.sin(a),z]};
  const isH=(h.pi-2)%4===0,col=isH?'#7cc4a4':'#e8a28c';
  [.62,-.62].forEach(z=>{for(let i=0;i<24;i++)faces.push({pts:[ringPt(.85,i,z),ringPt(.85,i+1,z),ringPt(1.75,i+1,z),ringPt(1.75,i,z)],fill:col,opacity:.55})});
  const atoms=range(n).map(i=>{const a=2*Math.PI*i/n;return [1.3*Math.cos(a),1.3*Math.sin(a),0]});
  let svg=paintFaces(faces.filter(f=>f.pts[0][2]<0),Pj);
  for(let i=0;i<n;i++)svg+=line3(atoms[i],atoms[(i+1)%n],Pj,C.ink,3);
  svg+=sortedItems(atoms.map(a=>({at:a,svg:P=>point3(a,P,'#333',7)})),Pj);
  svg+=paintFaces(faces.filter(f=>f.pts[0][2]>0),Pj);
  return {svg,title:'The π cloud',caption:`Above and below the ring, the p orbitals merge into two doughnut-shaped clouds holding the ${h.pi} π electrons. ${isH?'With 4n + 2 electrons the cloud is a stable, closed shell.':'With 4n electrons a flat cloud would be destabilised.'}`};
 }});

/* ================================================================ stereochemistry */
// Tetrahedral carbon with four groups; 3D vectors of the four drawn positions (viewer looks along −z).
const C6_TET=[[-.817,.577,0],[.817,.577,0],[0,-.577,.817],[0,-.577,-.817]];
const C6_POS2=[[-62,-40],[62,-40],[-34,58],[34,58]];
const C6_MOLS={
 bcf:{n:'bromochlorofluoromethane',g:['Br','Cl','F','H'],p:[1,2,3,4],col:['#8a3b2a','#2f8a4a','#2a6ab8','#777']},
 ala:{n:'alanine',g:['NH₂','COOH','CH₃','H'],p:[1,2,3,4],col:['#2a6ab8','#c45238','#555','#777']},
 cbr:{n:'bromochloromethane',g:['Br','Cl','H','H'],p:[1,2,3,3],col:['#8a3b2a','#2f8a4a','#777','#777']}};
function C6_cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
function C6_dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]}
function C6_RS(m,order,mirror){
 if(new Set(m.p).size<4)return null;
 const vec=pos=>{const v=C6_TET[pos].slice();if(mirror)v[0]=-v[0];return v};
 const at=pr=>vec(order.findIndex(gi=>m.p[gi]===pr));
 const a=at(1),b=at(2),c=at(3),d=at(4),n=C6_cross([b[0]-a[0],b[1]-a[1],b[2]-a[2]],[c[0]-a[0],c[1]-a[1],c[2]-a[2]]);
 return C6_dot(n,d)>0?'R':'S';
}
function C6_tetDraw(cx,cy,m,order,mirror){
 let out='';
 order.forEach((gi,pos)=>{const [dx,dy]=C6_POS2[pos],x=cx+(mirror?-dx:dx),y=cy+dy;
  if(pos===2)out+=P(`M${cx} ${cy} L${x-6} ${y} L${x+6} ${y} Z`,C.ink,1,C.ink);
  else if(pos===3)range(6).forEach(k=>{const u=(k+1)/7;out+=L(lerp(cx,x,u)-u*6,lerp(cy,y,u),lerp(cx,x,u)+u*6,lerp(cy,y,u),C.ink,1.6)});
  else out+=L(cx,cy,x,y,C.ink,2.4);
  out+=Ci(x,y,17,'#fff',m.col[gi],'stroke-width="2.5"')+TBF(x,y+5,m.g[gi],m.g[gi].length>2?11:14,m.col[gi])});
 return out+Ci(cx,cy,9,C.ink)+TBF(cx,cy+4,'C',10,'#fff');
}
SCENE({id:'stereochemistry',name:'Left- and right-handed molecules',tag:'van ’t Hoff and Le Bel, 1874',
 definition:'A carbon atom with four different groups can be arranged in two ways that are mirror images and cannot be superimposed, like a left and a right hand. Such molecules are chiral, and the two forms are labelled R and S by ranking the groups.',
 example:'Natural alanine in proteins is the S form; choosing alanine starts on it. Bromochloromethane, with two identical hydrogens, is not chiral: its mirror image is the same molecule.',
 desc:'A tetrahedral carbon drawn with wedges and dashes beside its mirror image, with each labelled R or S; the learner swaps two groups or rotates three and sees which changes the handedness.',
 research:'van ’t Hoff, J. H. (1874). Voorstel tot uitbreiding der … structuurformules in de ruimte. Le Bel, J. A. (1874). Bulletin de la Société Chimique de Paris 22, 337–347. Cahn, R. S., Ingold, C. & Prelog, V. (1966). Specification of molecular chirality. Angewandte Chemie International Edition 5, 385–415.',
 dur:12,hint:'Swap two groups and the label flips; rotate three and it does not. Try the molecule with two hydrogens, then turn the model in 3D.',
 init:()=>({m:'bcf',order:[0,1,2,3]}),
 watch(p){const k=Math.floor(p*4);return {m:k<3?'bcf':'cbr',order:k===1?[0,1,3,2]:k===2?[1,2,0,3]:[0,1,2,3]}},
 ui:[{choose:[['bcf','CHBrClF'],['ala','Alanine'],['cbr','CH₂BrCl']],label:'Molecule',get:s=>s.m,act:'m'},{b:'Swap two groups',act:'swap'},{b:'Rotate three',act:'rot'}],
 on:{m(s,v){s.m=v;s.order=v==='ala'?[0,1,3,2]:[0,1,2,3];return 'keep'},swap(s){const o=s.order.slice();[o[2],o[3]]=[o[3],o[2]];s.order=o;return 'keep'},rot(s){const o=s.order;s.order=[o[1],o[2],o[0],o[3]];return 'keep'}},
 draw(s){
  const m=C6_MOLS[s.m],L1=C6_RS(m,s.order,false),L2=C6_RS(m,s.order,true);
  let out=heading(m.n[0].toUpperCase()+m.n.slice(1),30);
  out+=C6_tetDraw(160,150,m,s.order,false)+C6_tetDraw(440,150,m,s.order,true);
  out+=L(300,70,300,250,C.line,2,'stroke-dasharray="6 5"')+TF(300,268,'mirror',13,C.muted);
  out+=TBF(160,250,L1?`(${L1})`:'achiral',18,L1?C.coral:C.green)+TBF(440,250,L2?`(${L2})`:'achiral',18,L2?C.coral:C.green);
  out+=TF(300,300,L1?'Mirror images, not superimposable: two different molecules (enantiomers).':'Two identical groups: the mirror image is the same molecule.',14,L1?C.coral:C.green);
  out+=TF(300,326,'Rank groups by atomic number; with the lowest pointing away, 1→2→3 clockwise is R.',13,C.muted);
  out+=TF(300,350,'Wedge: towards you. Dashes: away from you. Plain lines: in the page.',13,C.muted);
  return {svg:out,phase:L1?`The left molecule is ${L1} and its mirror image is ${L2}. Swapping any two groups converts one into the other; rotating three leaves it unchanged, because that is just turning the molecule. van ’t Hoff and Le Bel saw in 1874 that a tetrahedral carbon explains this.`:'With two identical groups there is a mirror plane through the molecule, so it and its reflection are the same.'};
 },
 three(s,f,X,project){
  const m=C6_MOLS[s.m],Pj=project([-3.2,3.2,-1.4,1.4,-1.4,1.4]);
  const items=[];[[-1.6,false],[1.6,true]].forEach(([ox,mir])=>{const c=[ox,0,0];items.push({at:c,svg:P=>point3(c,P,'#222',10)});
   s.order.forEach((gi,pos)=>{const v=C6_TET[pos],p=[ox+(mir?-v[0]:v[0])*1.25,v[2]*1.25,v[1]*1.25];items.push({at:p,svg:P=>line3(c,p,P,'#555',3)+point3(p,P,m.col[gi],14)+(()=>{const q=P(p);return TBF(q[0],q[1]+4,m.g[gi],m.g[gi].length>2?9:11,'#fff')})()})})});
  return {svg:sortedItems(items,Pj),title:'The two hands in 3D',caption:'Turn the pair. However you rotate one, you cannot make it sit exactly on the other unless two of its groups are the same.'};
 }});

// Pasteur's crystals and the polarimeter.
SCENE({id:'stereochemistry-pasteur',name:'Pasteur’s crystals',tag:'Pasteur, 1848',
 definition:'In 1848 Louis Pasteur sorted crystals of a tartrate salt by hand into two mirror-image shapes. Solutions of each rotated polarised light by equal amounts in opposite directions; the 50:50 mixture, a racemate, did not rotate it at all.',
 example:'Natural (+)-tartaric acid rotates plane-polarised light about +12° (specific rotation); its mirror image rotates it −12°; a racemic mixture gives 0°.',
 desc:'A tray of left- and right-handed crystals with the share of left-handed ones set by the learner, and a polarimeter dial showing the rotation of the solution.',
 research:'Pasteur, L. (1848). Mémoire sur la relation qui peut exister entre la forme cristalline et la composition chimique, et sur la cause de la polarisation rotatoire. Comptes rendus 26, 535–538. Biot, J.-B. (1815) discovered optical rotation in solutions. Specific rotation of tartaric acid from standard tables.',
 dur:10,hint:'Change the share of left-handed crystals in the sample and read the polarimeter.',
 init:()=>({f:50}),
 watch(p){return {f:Math.round(p<.5?50+p*100:100-(p-.5)*200)}},
 ui:[{range:'f',label:'Left-handed crystals',min:0,max:100,step:5,get:s=>s.f,act:'f',show:v=>v+'%'}],
 on:{f(s,v){s.f=Number(v);return 'keep'}},
 draw(s){
  const nL=Math.round(s.f/5),rot=12*(1-2*s.f/100);
  let out=heading('Sorting crystals, reading the light',30);
  out+=R(30,60,300,170,'#fff',C.grid,10);
  range(20).forEach(i=>{const x=60+(i%5)*58,y=88+Math.floor(i/5)*38,left=i<nL,sg=left?-1:1;
   out+=P(`M${x-14} ${y+12} L${x-14} ${y-6} L${x} ${y-14} L${x+14} ${y-6} L${x+14} ${y+12} Z M${x+sg*14} ${y-6} L${x+sg*6} ${y+2}`,left?C.purple:C.blue,2,left?C.purplep:C.pale)});
  out+=TF(180,250,`${nL} left-handed, ${20-nL} right-handed`,14,C.ink);
  const cx=460,cy=150;out+=Ci(cx,cy,78,'#fff',C.line,'stroke-width="2"');
  [-12,-6,0,6,12].forEach(d=>{const a=(-90+d*5)*Math.PI/180;out+=L(cx+70*Math.cos(a),cy+70*Math.sin(a),cx+78*Math.cos(a),cy+78*Math.sin(a),C.muted,1.5)+TF(cx+94*Math.cos(a),cy+94*Math.sin(a)+5,(d>0?'+':'')+d+'°',13,C.muted)});
  const a=(-90+rot*5)*Math.PI/180;out+=arrow(cx,cy,cx+66*Math.cos(a),cy+66*Math.sin(a),C.coral,3);
  out+=TBF(cx,cy+40,`${rot>0?'+':''}${C6_n(rot,1)}°`,18,C.coral);
  out+=TF(cx,258,'polarimeter',13,C.muted);
  out+=TF(300,300,Math.abs(rot)<.05?'Racemic: the two forms cancel and the light is not rotated.':rot>0?'More right-handed: rotation to the right (+).':'More left-handed: rotation to the left (−).',14,Math.abs(rot)<.05?C.green:C.coral);
  out+=TF(300,330,'The shapes differ only as mirror images; the rotation reveals the molecules inside.',13,C.muted);
  out+=TF(300,352,'Pasteur was lucky too: this salt only forms separate crystals below about 27 °C.',13,C.muted);
  return {svg:out,phase:`With ${s.f}% left-handed crystals the rotation is ${C6_n(rot,1)}°. Pasteur reasoned that the crystal’s handedness reflected handed molecules; van ’t Hoff and Le Bel explained how 26 years later with the tetrahedral carbon.`};
 }});

// Thalidomide: handedness and harm, told accurately.
SCENE({id:'stereochemistry-thalidomide',name:'Thalidomide',tag:'Handedness, harm and regulation',
 definition:'Thalidomide, sold from 1957 as a sedative and taken for morning sickness, caused severe birth defects in more than 10,000 children before it was withdrawn in 1961. Its two mirror forms interconvert in the body within hours, so selling only one form would not have prevented the harm.',
 example:'A dose of the pure R form becomes a near 50:50 mixture of R and S in the bloodstream, because the hydrogen at the chiral centre is easily lost and replaced.',
 desc:'A curve of the S form appearing over hours after a dose of pure R (an illustrative rate), beside a short timeline of the disaster and the regulatory response.',
 research:'McBride, W. G. (1961). Thalidomide and congenital abnormalities. The Lancet 278, 1358. Lenz, W. (1962). Thalidomide and congenital abnormalities. The Lancet 279, 45. Eriksson, T. et al. (1995). Stereospecific determination, chiral inversion in vitro and pharmacokinetics in humans of the enantiomers of thalidomide. Chirality 7, 44–52. Frances Kelsey at the US FDA withheld approval.',
 dur:12,hint:'Move through the hours after a dose of pure R and see the mixture form; switch to the timeline for the history.',
 init:()=>({t:6,view:'mix'}),
 watch(p){return {t:p<.6?Math.round(p/.6*24):24,view:p<.6?'mix':'hist'}},
 ui:[{range:'t',label:'Hours after a dose of pure R',min:0,max:24,step:1,get:s=>s.t,act:'t',show:v=>v+' h'},{choose:[['mix','In the body'],['hist','History']],label:'View',get:s=>s.view,act:'view'}],
 on:{t(s,v){s.t=Number(v);return 'keep'},view(s,v){s.view=v;return 'keep'}},
 draw(s){
  let out=heading(s.view==='mix'?'Pure R does not stay pure':'Thalidomide, 1957–1962',30);
  if(s.view==='mix'){
   const k=Math.log(2)/(2*5),fS=t=>.5*(1-Math.exp(-2*k*t));
   const pl=C6_plot(80,60,320,220,[0,24],[0,60],{xt:[[0,'0'],[6,'6'],[12,'12'],[18,'18'],[24,'24 h']],yt:[[0,'0'],[25,'25'],[50,'50 %']],yl:'share present as S'});out+=pl.svg;
   out+=L(80,pl.Y(50),400,pl.Y(50),C.green,1.5,'stroke-dasharray="5 4"')+TF(396,pl.Y(50)-6,'50:50',13,C.green,'end');
   out+=C6_poly(range(49).map(i=>{const t=i/2;return [pl.X(t),pl.Y(100*fS(t))]}),C.coral,2.8);
   out+=Ci(pl.X(s.t),pl.Y(100*fS(s.t)),6,C.coral);
   out+=R(420,70,160,150,C.pale,'none',10)+TBF(434,96,`after ${s.t} h`,14,C.ink,'start')+TF(434,122,`R: ${C6_n(100-100*fS(s.t))}%`,14,C.blue,'start')+TF(434,146,`S: ${C6_n(100*fS(s.t))}%`,14,C.coral,'start');
   out+=TF(434,180,'rate illustrative;',13,C.muted,'start')+TF(434,198,'measured in hours',13,C.muted,'start');
   out+=TF(300,322,'The two forms interconvert in the body, so a single-form drug would have become a mixture.',13,C.ink);
   out+=TF(300,346,'Which form causes the harm is still debated.',13,C.muted);
  }else{
   [['1957','Sold in West Germany as a sedative, later used for morning sickness.'],['1960','In the US, Frances Kelsey at the FDA refuses approval and asks for safety data.'],['1961','McBride and Lenz link it to severe limb defects; withdrawn in November.'],['1962','US law (Kefauver–Harris) requires proof of safety and efficacy.'],['Today','Used under strict controls for leprosy complications and myeloma.']].forEach(([y,t],i)=>{const yy=78+i*48;out+=R(40,yy-20,520,40,i===1?C.greenp:C.pale,'none',8)+TBF(56,yy+5,y,14,C.coral,'start')+TF(120,yy+5,t,13,C.ink,'start')});
   out+=TF(300,330,'More than 10,000 children were affected worldwide; many survivors are alive today.',13,C.ink);
  }
  out+=TF(300,370,'Told with care: the lesson is about testing and regulation, not only about mirror images.',13,C.muted);
  return {svg:out,phase:s.view==='mix'?'Thalidomide’s chiral centre carries a hydrogen that is easily removed and replaced, so R and S convert into each other in the blood within hours. Making one pure form would not have prevented the birth defects; what failed was testing.':'The disaster led to modern drug regulation: proof of safety and efficacy before sale, and testing in pregnancy. Frances Kelsey’s refusal kept the drug off the US market.'};
 }});

/* ================================================================ polymers */
const C6_POLY_CAT=[[1,'ethene, a gas'],[2,'still a gas'],[3,'a runny liquid, like petrol'],[10,'a wax'],[1000,'a soft plastic'],[10000,'polythene bags'],[100000,'ultra-tough fibre']];
SCENE({id:'polymers',name:'Giant molecules',tag:'Staudinger, 1920',
 definition:'A polymer is a long chain of small repeating units joined by ordinary chemical bonds. In 1920 Hermann Staudinger argued that rubber and plastics are such giant molecules; many chemists then thought they were loose clusters of small molecules.',
 example:'Polythene is ethene units, –CH₂–CH₂–, repeated thousands of times: 10,000 units make a chain with a molar mass of about 280,000 g/mol.',
 desc:'A chain of ethene units whose length the learner sets on a log scale, with the molar mass, the length of the stretched chain and the kind of material that length gives.',
 research:'Staudinger, H. (1920). Über Polymerisation. Berichte der deutschen chemischen Gesellschaft 53, 1073–1085 (Nobel Prize 1953). Polythene was made by accident at ICI by Fawcett and Gibson in 1933. Property ranges are typical, not sharp boundaries.',
 dur:10,hint:'Make the chain longer and watch it turn from a gas into a wax, a plastic and a tough fibre.',
 init:()=>({e:3}),
 watch(p){return {e:p*5}},
 ui:[{range:'e',label:'Repeat units (log)',min:0,max:5,step:.25,get:s=>s.e,act:'e',show:v=>Math.round(Math.pow(10,v)).toLocaleString('en-GB')}],
 on:{e(s,v){s.e=Number(v);return 'keep'}},
 draw(s){
  const n=Math.round(Math.pow(10,s.e)),cat=C6_POLY_CAT.filter(c=>n>=c[0]).pop();
  let out=heading(`${n.toLocaleString('en-GB')} ethene unit${n>1?'s':''}`,30);
  const shown=Math.min(n,12);let x=60;
  for(let i=0;i<shown;i++){out+=R(x,90,30,28,i%2?C.pale:'#d8e8f3',C.blue,5)+TF(x+15,109,'CH₂',11,C.blue);x+=33}
  if(n>shown)out+=TF(x+8,110,`… ${(n-shown).toLocaleString('en-GB')} more`,13,C.muted,'start');
  out+=TF(300,150,'–[CH₂–CH₂]ₙ–',18,C.ink);
  const lenNm=n*.25;
  out+=R(60,175,480,110,C.pale,'none',10);
  out+=TF(80,202,`molar mass: ${(28*n).toLocaleString('en-GB')} g/mol`,15,C.ink,'start');
  out+=TF(80,228,`stretched length: about ${lenNm<1000?C6_n(lenNm,lenNm<10?1:0)+' nm':C6_n(lenNm/1000,1)+' µm'}`,15,C.ink,'start');
  out+=TBF(80,258,`behaves as: ${cat[1]}`,15,C.coral,'start');
  out+=L(80,305,520,305,C.line,3);
  C6_POLY_CAT.forEach(([v,l])=>{const xx=80+Math.log10(v)/5*440;out+=Ci(xx,305,4,C.muted)});
  out+=Ci(80+s.e/5*440,305,8,C.coral);
  out+=TF(300,340,'Longer chains tangle and attract along their length, so they are stronger and melt higher.',13,C.muted);
  out+=TF(300,362,'Staudinger’s claim was resisted for a decade before measurements proved him right.',13,C.muted);
  return {svg:out,phase:`${n.toLocaleString('en-GB')} units give a molar mass of ${(28*n).toLocaleString('en-GB')} g/mol. Nothing new happens chemically as the chain grows; the change in properties comes from length alone, which is the heart of Staudinger’s macromolecule idea.`};
 }});

// Condensation polymers: nylon and Kevlar.
SCENE({id:'polymers-nylon',name:'Nylon and Kevlar',tag:'Carothers 1935, Kwolek 1965',
 definition:'Condensation polymers form when two kinds of monomer join and give off a small molecule, usually water, at each link. Nylon-6,6 alternates a diamine and a diacid joined by amide links; Kevlar has the same links between flat benzene rings, which stack into very strong fibres.',
 example:'Joining 3 diamines and 3 diacids into one chain makes 5 amide links and releases 5 molecules of water.',
 desc:'A growing chain of alternating diamine and diacid units joined by amide links, with a counter of water molecules released, and a choice of nylon or Kevlar.',
 research:'Carothers, W. H. (1938). Synthetic fiber. US Patent 2,130,948 (nylon, first made 1935 at DuPont). Kwolek, S. L. (1965) discovered the liquid-crystal solutions that led to Kevlar; DuPont describes Kevlar as about five times stronger than steel on an equal-weight basis.',
 dur:10,hint:'Add pairs of monomers and count the water released. Switch to Kevlar to see the ring version.',
 init:()=>({n:3,m:'nylon'}),
 watch(p){return {n:1+Math.min(5,Math.floor(p*6)),m:p<.6?'nylon':'kevlar'}},
 ui:[{range:'n',label:'Pairs of monomers',min:1,max:6,step:1,get:s=>s.n,act:'n',show:v=>v},{choose:[['nylon','Nylon-6,6'],['kevlar','Kevlar']],label:'Polymer',get:s=>s.m,act:'m'}],
 on:{n(s,v){s.n=Number(v);return 'keep'},m(s,v){s.m=v;return 'keep'}},
 draw(s){
  const units=2*s.n,w=Math.min(78,480/units),links=units-1;
  let out=heading(s.m==='nylon'?'Nylon-6,6: diamine + diacid':'Kevlar: aromatic rings, the same links',30);
  for(let i=0;i<units;i++){const x=60+i*w,am=i%2===0;
   out+=R(x,90,w-14,40,am?C.pale:C.coralp,am?C.blue:C.coral,6)+TF(x+(w-14)/2,115,s.m==='kevlar'?'⬡':(am?'N(CH₂)₆N':'C(CH₂)₄C'),s.m==='kevlar'?18:10,am?C.blue:C.coral);
   if(i<units-1)out+=TBF(x+w-7,114,'–',16,C.green)}
  out+=TF(60,198,'blue: diamine · coral: diacid · green: amide link –CO–NH–',13,C.muted,'start');
  range(links).forEach(i=>{const x=60+(i+1)*w-7;out+=TF(x,170,'H₂O',12,C.blue)+L(x,132,x,156,C.line,1,'stroke-dasharray="3 3"')});
  out+=R(60,212,480,70,C.pale,'none',10);
  out+=TF(80,238,`${units} monomers → ${links} amide link${links>1?'s':''} → ${links} water molecule${links>1?'s':''} released`,15,C.ink,'start');
  out+=TF(80,262,s.m==='kevlar'?'Flat rings line up and hydrogen-bond into rigid, very strong fibres.':'Flexible chains hydrogen-bond side by side: strong, stretchy fibres.',13,C.muted,'start');
  out+=TF(300,320,s.m==='kevlar'?'Stephanie Kwolek found the stiff-chain solutions in 1965; Kevlar went into body armour and ropes.':'Wallace Carothers’ team made nylon in 1935; stockings went on sale in 1939.',13,C.ink);
  out+=TF(300,348,'Every link loses one water: n monomers in a chain give n − 1 waters.',13,C.muted);
  return {svg:out,phase:`${units} monomers make ${links} amide links and release ${links} water molecules. The same reaction, between different building blocks, gives a stretchy stocking fibre or a bullet-resistant one: structure, not chemistry type, decides the properties.`};
 }});

// Plastic production and its fate.
const C6_PLAST=[[1950,2],[1960,8],[1970,35],[1980,70],[1990,120],[2000,213],[2010,313],[2015,380]];
function C6_plastAt(y){for(let i=0;i<C6_PLAST.length-1;i++){const [a,va]=C6_PLAST[i],[b,vb]=C6_PLAST[i+1];if(y<=b)return lerp(va,vb,(y-a)/(b-a))}return 380}
SCENE({id:'polymers-pollution',name:'Where plastic goes',tag:'Geyer, Jambeck & Law, 2017',
 definition:'Global plastic production rose from about 2 million tonnes in 1950 to about 380 million tonnes in 2015. Of all the plastic waste made by 2015, an estimated 9% had been recycled, 12% burned and 79% sent to landfill or left in the environment.',
 example:'About 8,300 million tonnes of new plastic had been made by 2015, roughly a tonne for every person alive.',
 desc:'A curve of yearly plastic production from 1950 to 2015 with a year slider, beside bars for what had happened to all plastic waste by 2015.',
 research:'Geyer, R., Jambeck, J. R. & Law, K. L. (2017). Production, use, and fate of all plastics ever made. Science Advances 3, e1700782. Intermediate yearly values are rounded readings of their figure.',
 dur:10,hint:'Move through the years and compare how fast production grew with how little has been recycled.',
 init:()=>({y:2015}),
 watch(p){return {y:Math.round(1950+p*65)}},
 ui:[{range:'y',label:'Year',min:1950,max:2015,step:5,get:s=>s.y,act:'y',show:v=>v}],
 on:{y(s,v){s.y=Number(v);return 'keep'}},
 draw(s){
  const v=C6_plastAt(s.y);
  let out=heading(`${s.y}: about ${C6_n(v)} million tonnes a year`,30);
  const pl=C6_plot(70,60,300,220,[1950,2015],[0,400],{xt:[[1950,'1950'],[1970,'1970'],[1990,'1990'],[2015,'2015']],yt:[[200,'200'],[400,'400']],yl:'million tonnes per year'});out+=pl.svg;
  out+=C6_poly(range(66).map(i=>{const y=1950+i;return [pl.X(y),pl.Y(C6_plastAt(y))]}),C.line,2);
  out+=C6_poly(range(s.y-1949).map(i=>{const y=1950+i;return [pl.X(y),pl.Y(C6_plastAt(y))]}),C.coral,3);
  out+=Ci(pl.X(s.y),pl.Y(v),6,C.coral);
  out+=TBF(400,74,'All plastic waste',14,C.ink,'start')+TF(400,92,'made by 2015',13,C.muted,'start');
  [['recycled',9,C.green],['burned',12,C.amber],['landfill or',79,C.coral]].forEach(([l,p],i)=>{const [lab,pc,col]=[l,p,[C.green,C.amber,C.coral][i]];const y=112+i*56;out+=R(400,y,pc*1.9,26,col,'none',4)+TBF(400+pc*1.9+6,y+18,pc+'%',14,col,'start')+TF(400,y+44,lab+(i===2?' environment':''),13,C.muted,'start')});
  out+=TF(300,330,'Most plastic made is still in use, in landfill or in the environment; very little cycles back.',13,C.ink);
  out+=TF(300,354,'Polymers last because their carbon–carbon chains are hard for microbes to break.',13,C.muted);
  return {svg:out,phase:`Production in ${s.y} was about ${C6_n(v)} million tonnes. Geyer, Jambeck and Law estimated that of 6,300 million tonnes of plastic waste by 2015, only 9% had been recycled. The durability that makes polymers useful makes them persist.`};
 }});

/* ================================================================ total-synthesis */
// Retrosynthesis of aspirin.
const C6_RETRO=[
 {t:'Target: aspirin',f:'C9H8O4',d:'acetylsalicylic acid'},
 {t:'Disconnect the ester',f:'C7H6O3 + C4H6O3',d:'salicylic acid + ethanoic anhydride'},
 {t:'Disconnect the C–COOH',f:'C6H5ONa + CO2',d:'sodium phenoxide + CO₂ (Kolbe–Schmitt)'},
 {t:'Back to a feedstock',f:'C6H6',d:'phenol made from benzene (now via cumene)'}];
SCENE({id:'total-synthesis',name:'Working backwards',tag:'Corey’s retrosynthesis',
 definition:'Retrosynthesis plans a synthesis backwards: starting from the target, a chemist imagines breaking bonds that a known reaction could make, until reaching simple, available starting materials. E. J. Corey formalised the method in the 1960s.',
 example:'Aspirin is an ester, so disconnect the ester: salicylic acid + ethanoic anhydride. Salicylic acid comes from phenol and carbon dioxide.',
 desc:'A retrosynthesis tree for aspirin that the learner steps back through, with the formula at each stage and the forward reaction that would rebuild it, atom-checked.',
 research:'Corey, E. J. (1967). General methods for the construction of complex molecules. Pure and Applied Chemistry 14, 19–37; Corey, E. J. & Cheng, X.-M. (1989). The Logic of Chemical Synthesis (Nobel Prize 1990). Kolbe, H. (1860) and Schmitt, R. (1885) for salicylic acid from phenol. Hoffmann at Bayer (1897) made aspirin; Eichengrün’s claim to have directed the work is debated.',
 dur:10,hint:'Step back one disconnection at a time, then read the forward reactions that would build aspirin.',
 init:()=>({k:1}),
 watch(p){return {k:Math.min(3,Math.floor(p*4))}},
 ui:[{range:'k',label:'Steps back',min:0,max:3,step:1,get:s=>s.k,act:'k',show:v=>v}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s){
  let out=heading('Plan backwards, build forwards',30);
  C6_RETRO.forEach((r,i)=>{const y=60+i*62,on=i<=s.k,cur=i===s.k;
   out+=R(70,y,330,48,cur?C.coralp:on?C.pale:'#fff',cur?C.coral:on?C.blue:C.grid,8);
   out+=TBF(86,y+20,on?r.t:'…',14,on?(cur?C.coral:C.ink):C.muted,'start');
   if(on)out+=TF(86,y+39,r.d,13,C.muted,'start');
   if(on)out+=TBF(390,y+20,C6_pretty(r.f),14,C.blue,'end');
   if(i>0&&on)out+=TBF(50,y-4,'⇐',18,C.coral)});
  out+=R(420,60,160,234,C.pale,'none',10)+TBF(434,84,'Forward check',14,C.ink,'start');
  const A=C6_count('C7H6O3'),B=C6_count('C4H6O3'),Cc=C6_count('C9H8O4'),D=C6_count('C2H4O2');
  ['C','H','O'].forEach((e,i)=>{const l=A[e]+B[e],r=Cc[e]+D[e];out+=TF(434,112+i*22,`${e}: ${l} → ${r}`,14,l===r?C.green:C.coral,'start')});
  out+=TF(434,190,'salicylic acid',13,C.muted,'start')+TF(434,208,'+ ethanoic anhydride',13,C.muted,'start')+TF(434,226,'→ aspirin',13,C.muted,'start')+TF(434,244,'+ ethanoic acid',13,C.muted,'start');
  out+=TF(300,330,'The symbol ⇐ means "could be made from". Each disconnection must match a real reaction.',13,C.ink);
  out+=TF(300,354,'Safety: phenol is corrosive and toxic; this is a plan on paper.',13,C.coral);
  return {svg:out,phase:'Corey taught chemists to read a target backwards, choosing disconnections that a reliable reaction could reverse. For aspirin the plan is short; for a complex natural product it can branch into many routes, and choosing among them is the art.'};
 }});

// Yield multiplies.
SCENE({id:'total-synthesis-yield',name:'Yields multiply',tag:'Why long routes are hard',
 definition:'In a linear synthesis the overall yield is the product of every step’s yield. Even good steps add up to big losses over a long route, which is why chemists prize short routes and converge branches.',
 example:'Twenty steps at 90% each leave 0.9²⁰ ≈ 12% of the material; at 80% each, only about 1%.',
 desc:'A bar of material remaining after each step of a linear route, with sliders for the number of steps and the yield per step, and the overall yield.',
 research:'Overall yield as the product of step yields is standard arithmetic of synthesis planning (e.g. Nicolaou, K. C. & Sorensen, E. J., Classics in Total Synthesis, 1996). Woodward and Eschenmoser’s vitamin B₁₂ synthesis (1972) took about 100 steps and roughly 100 chemists.',
 dur:10,hint:'Change the number of steps and the yield of each, and watch how much survives.',
 init:()=>({n:20,y:90}),
 watch(p){return {n:20,y:Math.round(95-p*20)}},
 ui:[{range:'n',label:'Steps',min:1,max:40,step:1,get:s=>s.n,act:'n',show:v=>v},{range:'y',label:'Yield per step',min:50,max:99,step:1,get:s=>s.y,act:'y',show:v=>v+'%'}],
 on:{n(s,v){s.n=Number(v);return 'keep'},y(s,v){s.y=Number(v);return 'keep'}},
 draw(s){
  const r=s.y/100,overall=Math.pow(r,s.n);
  let out=heading(`${s.n} steps at ${s.y}%: ${overall>=.01?C6_n(100*overall,1)+'%':(100*overall).toPrecision(2)+'%'} left`,30);
  const pl=C6_plot(70,60,460,220,[0,s.n],[0,100],{xt:[[0,'start'],[s.n,'step '+s.n]],yt:[[0,'0'],[50,'50'],[100,'100']],yl:'material remaining (%)'});out+=pl.svg;
  const bw=Math.max(2,440/(s.n+1)-2);
  for(let i=0;i<=s.n;i++){const v=100*Math.pow(r,i);out+=R(pl.X(i)-bw/2,pl.Y(v),bw,pl.Y(0)-pl.Y(v),i===s.n?C.coral:C.blue,'none',2)}
  out+=TF(300,322,`Overall yield = (${C6_n(r,2)})${String(s.n).split('').map(c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('')} = ${(100*overall).toPrecision(3)}%`,15,C.ink);
  out+=TF(300,350,'Losing 10% a step sounds small; over twenty steps nine-tenths of the material is gone.',13,C.muted);
  out+=TF(300,370,'Convergent routes build pieces in parallel and join them late, cutting the longest chain.',13,C.muted);
  return {svg:out,phase:`${s.n} steps at ${s.y}% each give ${(100*overall).toPrecision(3)}% overall. That arithmetic shaped the field: Woodward’s great syntheses were feats partly because they kept enough material alive through dozens of steps.`};
 }});

// Landmarks of synthesis, with the controversies.
const C6_SYN=[
 {y:'1944',t:'Quinine (Woodward & Doering)',d:'A formal synthesis that relied on Rabe’s 1918 last step; disputed for decades until Williams repeated Rabe’s step in 2007.'},
 {y:'1944',t:'Asima Chatterjee, alkaloids',d:'First woman to earn a DSc from an Indian university; she studied vinca and other alkaloids and developed anti-epilepsy and anti-malarial drugs from plants.'},
 {y:'1954',t:'Strychnine (Woodward)',d:'Seven rings and six stereocentres, built in about 28 steps.'},
 {y:'1967',t:'Corey’s retrosynthesis',d:'A systematic logic for planning syntheses backwards; Nobel Prize 1990.'},
 {y:'1972',t:'Vitamin B₁₂ (Woodward, Eschenmoser)',d:'About 100 steps and roughly 100 chemists over a decade.'},
 {y:'2001',t:'Quinine again (Stork)',d:'The first fully stereocontrolled route, published nearly sixty years after 1944.'}];
SCENE({id:'total-synthesis-woodward',name:'Landmarks of synthesis',tag:'Woodward, Chatterjee, Corey, Stork',
 definition:'Total synthesis is building a natural molecule from simple starting materials. Its landmarks were feats of planning and stereochemical control, and some carry long-running disputes about what counted as a synthesis.',
 example:'Woodward and Doering’s 1944 quinine route stopped at a compound that Paul Rabe had converted to quinine in 1918; Gilbert Stork argued in 2001 that this last step had not been shown, and Robert Williams’s team repeated it successfully in 2007.',
 desc:'A timeline of six landmarks in organic synthesis that the learner steps through, each with what was made, how, and any dispute.',
 research:'Woodward, R. B. & Doering, W. E. (1944). The total synthesis of quinine. JACS 66, 849. Stork, G. et al. (2001). The first stereoselective total synthesis of quinine. JACS 123, 3239–3242. Smith, A. C. & Williams, R. M. (2008). Rabe rest in peace. Angewandte Chemie 47, 1736–1740. Nicolaou & Sorensen (1996), Classics in Total Synthesis.',
 dur:12,hint:'Step through the landmarks and read the disputes as well as the achievements.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(5,Math.floor(p*6))}},
 ui:[{range:'k',label:'Landmark',min:0,max:5,step:1,get:s=>s.k,act:'k',show:v=>C6_SYN[v].y}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s){
  const e=C6_SYN[s.k];
  let out=heading('Building nature’s molecules',30);
  out+=L(50,104,550,104,C.line,3);
  C6_SYN.forEach((q,i)=>{const x=50+i*100,on=i===s.k;out+=Ci(x,104,on?10:6,on?C.coral:'#fff',C.coral,'stroke-width="2"')+TF(x,i%2?136:84,q.y,13,on?C.coral:C.muted)});
  out+=R(60,160,480,120,C.coralp,'none',10)+TBF(80,190,e.t,16,C.coral,'start');
  const words=e.d.split(' ');let line='',ly=220;words.forEach(w=>{if((line+' '+w).length>60){out+=TF(80,ly,line.trim(),14,C.ink,'start');ly+=21;line=''}line+=' '+w});out+=TF(80,ly,line.trim(),14,C.ink,'start');
  out+=TF(300,322,'Making a molecule proves its structure and opens the way to variants and medicines.',13,C.ink);
  out+=TF(300,348,'What counts as a complete synthesis has itself been argued over, as quinine shows.',13,C.muted);
  return {svg:out,phase:`${e.y}: ${e.t}. ${e.d}`};
 }});
