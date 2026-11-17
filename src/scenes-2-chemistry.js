/* ===================== Abiogenesis era 2 · Life’s chemistry (1828–1970) ===================== */
const A2_STATUS={demonstrated:['Demonstrated',C.green,C.greenp],plausible:['Plausible',C.amber,C.amberp],speculative:['Speculative',C.purple,C.purplep]};
function A2_head(title,st){const S=A2_STATUS[st],w=S[0].length*8.2+24;return heading(title,48)+R(594-w,3,w,22,S[2],S[1],11)+TBF(594-w/2,18,S[0],13,S[1])}
function A2_axes(x,y,w,h,xr,yr,o={}){
 const X=v=>x+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let s=R(x,y,w,h,'#fff',C.grid,6);
 for(const t of o.xt||[]){const v=Array.isArray(t)?t[0]:t,lab=Array.isArray(t)?t[1]:t;s+=L(X(v),y,X(v),y+h,'#eef3f6',1)+TF(X(v),y+h+15,lab,13,C.muted)}
 for(const t of o.yt||[]){const v=Array.isArray(t)?t[0]:t,lab=Array.isArray(t)?t[1]:t;s+=L(x,Y(v),x+w,Y(v),'#eef3f6',1)+TF(x-6,Y(v)+4,lab,13,C.muted,'end')}
 if(o.xl)s+=TF(x+w/2,y+h+31,o.xl,13,C.muted);
 if(o.yl)s+=TF(x+8,y+16,o.yl,13,C.muted,'start');
 return {svg:s,X,Y};
}
const A2_path=pts=>'M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join('L');
function A2_wrap(t,n){const out=[];let cur='';for(const w of String(t).split(' ')){if(cur&&(cur+' '+w).length>n){out.push(cur);cur=w}else cur=cur?cur+' '+w:w}if(cur)out.push(cur);return out}
function A2_card(x,y,w,title,lines,col=C.blue){
 let out=R(x,y,w,30+lines.length*19,'#fff',C.grid,8)+TBF(x+12,y+21,title,14,col,'start');
 lines.forEach((l,i)=>{out+=TF(x+12,y+42+i*19,l,13,C.ink,'start')});return out;
}
const A2_EL={C:['#3a3a3a','#fff'],H:['#ffffff',C.ink],N:['#3e6fb5','#fff'],O:['#c94a3a','#fff'],S:['#e0b928',C.ink]};
const A2_atom=(x,y,el,r=13)=>Ci(x,y,r,A2_EL[el][0],C.ink,'stroke-width="1.5"')+TBF(x,y+5,el,r>11?14:13,A2_EL[el][1]);
const A2_bond=(x1,y1,x2,y2,n=1)=>{let o='';const dx=y2-y1,dy=x1-x2,l=Math.hypot(dx,dy)||1;for(let i=0;i<n;i++){const k=(i-(n-1)/2)*5;o+=L(x1+dx/l*k,y1+dy/l*k,x2+dx/l*k,y2+dy/l*k,C.ink,2)}return o};

/* ---------- Lesson: wohler-urea ---------- */
SCENE({id:'wohler-urea',name:'Wöhler’s urea',tag:'A substance of life from a laboratory salt, 1828',
 definition:'In 1828 Friedrich Wöhler heated a solution of ammonium cyanate, a salt that could be made without any living thing, and obtained urea, a substance until then known from urine. The atoms were the same; only their arrangement changed.',
 example:'Wöhler wrote to Berzelius that he could make urea “without needing a kidney, or even an animal, be it man or dog”. Ammonium cyanate and urea share the formula CH₄N₂O: one carbon, four hydrogens, two nitrogens and one oxygen.',
 desc:'Ammonium cyanate as two ions, warmed in water, rearranging step by step into urea. An atom count beneath shows nothing is gained or lost.',
 research:['Wöhler, F. (1828). Ueber künstliche Bildung des Harnstoffs. Annalen der Physik und Chemie 88: 253–256.','Wöhler’s letter to Berzelius, 22 February 1828.'],
 dur:10,hint:'Step through the reaction. Count the atoms on each side.',
 init:()=>({k:3}),
 watch(p){return {k:Math.min(3,Math.floor(p*4.4))}},
 ui:[{range:'k',label:'Step',min:0,max:3,step:1,get:s=>s.k,act:'k',show:v=>['salt crystals','dissolved and warmed','rearranging','urea'][v]}],
 on:{k(s,v){s.k=+v}},
 draw(s){
  const k=s.k;let out=A2_head(['Ammonium cyanate, a salt','Dissolved in water and warmed','Atoms rearranging','Urea, as found in urine'][k],'demonstrated');
  if(k<3){// ammonium ion and cyanate ion
   const sep=k===0?0:k===1?30:10,ax=200-sep,bx=380+sep;
   if(k>=1)out+=R(60,70,480,190,'#e8f3fb','none',16);
   out+=A2_bond(ax,160,ax,120)+A2_bond(ax,160,ax,200)+A2_bond(ax,160,ax-40,160)+A2_bond(ax,160,ax+40,160);
   out+=A2_atom(ax,160,'N')+A2_atom(ax,120,'H',10)+A2_atom(ax,200,'H',10)+A2_atom(ax-40,160,'H',10)+A2_atom(ax+40,160,'H',10)+TBF(ax+30,124,'+',18,C.blue);
   out+=A2_bond(bx-45,160,bx,160)+A2_bond(bx,160,bx+45,160,3);
   out+=A2_atom(bx-45,160,'O')+A2_atom(bx,160,'C')+A2_atom(bx+45,160,'N')+TBF(bx-45,136,'−',18,C.coral);
   out+=TF(ax,234,'ammonium ion NH₄⁺',13,C.ink)+TF(bx,234,'cyanate ion OCN⁻',13,C.ink);
   if(k===2)out+=P(`M${ax+50} 120Q300 70 ${bx-50} 120`,C.amber,2.5,'none','stroke-dasharray="6 4"')+TF(300,84,'a hydrogen moves; N joins C',13,C.amber);
  } else {
   const cx=300,cy=150;
   out+=A2_bond(cx,cy,cx,cy-50,2)+A2_bond(cx,cy,cx-55,cy+30)+A2_bond(cx,cy,cx+55,cy+30);
   out+=A2_bond(cx-55,cy+30,cx-90,cy+10)+A2_bond(cx-55,cy+30,cx-60,cy+70)+A2_bond(cx+55,cy+30,cx+90,cy+10)+A2_bond(cx+55,cy+30,cx+60,cy+70);
   out+=A2_atom(cx,cy,'C')+A2_atom(cx,cy-50,'O')+A2_atom(cx-55,cy+30,'N')+A2_atom(cx+55,cy+30,'N');
   out+=A2_atom(cx-90,cy+10,'H',10)+A2_atom(cx-60,cy+70,'H',10)+A2_atom(cx+90,cy+10,'H',10)+A2_atom(cx+60,cy+70,'H',10);
   out+=TF(cx,256,'urea (NH₂)₂CO',13,C.ink);
  }
  const rows=[['C',1],['H',4],['N',2],['O',1]];
  out+=TBF(300,288,'Atoms present at every step',14,C.ink);
  rows.forEach(([e,n],i)=>{const x=165+i*90;out+=A2_atom(x,320,e,12)+TBF(x+26,326,'× '+n,15,C.ink,'start')});
  out+=TF(300,360,'Formula CH₄N₂O before and after',13,C.muted);
  return {svg:out,phase:k===3?'Urea: the same atoms as ammonium cyanate, joined differently. A compound of living things, made from a laboratory salt.':k===2?'On warming, a hydrogen leaves the ammonium ion and the nitrogen bonds to the carbon of the cyanate.':'Two ions held together by opposite charges: no animal needed to make them.'};
 }});

const A2_VIT=[
 {y:'1828',who:'Wöhler',t:'urea from ammonium cyanate',left:3,note:'Critics noted his cyanate came from animal-derived materials; Wöhler himself claimed little.'},
 {y:'1845',who:'Kolbe',t:'acetic acid built up from carbon disulfide, made from the elements',left:2,note:'An organic acid made all the way from carbon, sulphur, chlorine and water.'},
 {y:'1860',who:'Berthelot',t:'many organic compounds from the elements (Chimie organique fondée sur la synthèse)',left:1,note:'Formic acid, methane and alcohol, later acetylene and benzene: “synthesis” becomes a programme.'},
 {y:'1897',who:'Buchner',t:'fermentation by a juice pressed from yeast, with no living cells',left:0,note:'Enzymes, not life itself, do the chemistry of fermentation.'},
 {y:'1930s on',who:'textbooks',t:'retell 1828 as the day vitalism died',left:0,note:'Historians show the story is a later simplification (Brooke 1968; Ramberg 2000).'}];
const A2_ONLY=['make urea','make organic acids','make fuels and alcohols','ferment sugar','?'];
SCENE({id:'wohler-urea-vitalism',name:'Did urea kill vitalism?',tag:'A famous story, corrected',
 definition:'Textbooks often say Wöhler’s urea synthesis of 1828 destroyed vitalism, the idea that the chemistry of living things needs a special vital force. Historians have shown the change was slow: it took decades of syntheses, and some vitalist ideas lasted into the twentieth century.',
 example:'Wöhler’s cyanate came from materials of animal origin, so critics could argue the vital force had slipped in. Kolbe in 1845 and Berthelot around 1860 made organic compounds from the elements; in 1897 Buchner fermented sugar with a cell-free yeast juice. The 1828 “death of vitalism” story was mostly written later.',
 desc:'A timeline of five moments. A list of things once thought to need living cells shrinks as the syntheses accumulate.',
 research:['Brooke, J. H. (1968). Wöhler’s urea, and its vital force? A verdict from the chemists. Ambix 15: 84–114.','Ramberg, P. J. (2000). The death of vitalism and the birth of organic chemistry: Wöhler’s urea synthesis and the disciplinary identity of organic chemistry. Ambix 47: 170–195.','Buchner, E. (1897). Alkoholische Gährung ohne Hefezellen. Berichte der deutschen chemischen Gesellschaft 30.'],
 dur:12,hint:'Step through the timeline. Notice how gradually the list of “only life can do this” shrinks.',
 init:()=>({i:4}),
 watch(p){return {i:Math.min(4,Math.floor(p*5.4))}},
 ui:[{range:'i',label:'Moment',min:0,max:4,step:1,get:s=>s.i,act:'i',show:v=>A2_VIT[v].y+' '+A2_VIT[v].who}],
 on:{i(s,v){s.i=+v},pick(s,a){s.i=+a}},
 draw(s,f,X){
  const E=A2_VIT[s.i];let out=A2_head('Vitalism faded slowly','demonstrated');
  out+=L(60,104,540,104,C.ink,2.5);
  A2_VIT.forEach((e,i)=>{const x=60+i*120,on=i===s.i;out+=hit(X,'pick',i,e.y+' '+e.who,Ci(x,104,on?10:7,i<=s.i?C.blue:'#fff',C.blue)+TF(x,i%2?136:84,e.y,13,on?C.coral:C.ink))});
  out+=A2_card(40,150,300,`${E.y} · ${E.who}`,A2_wrap(E.t,40).concat(A2_wrap(E.note,40)),C.blue);
  out+=TBF(362,166,'Still said to need life:',14,C.ink,'start');
  A2_ONLY.slice(0,4).forEach((t,j)=>{const gone=j<4-E.left;const y=192+j*30;out+=R(362,y-18,200,26,gone?'#f6f9fb':C.coralp,gone?C.grid:C.coral,6)+TF(374,y,t,13,gone?C.muted:C.ink,'start')+(gone?L(372,y-4,370+t.length*7,y-4,C.muted,1.5):'')});
  out+=TF(300,352,s.i===4?'The story of a single decisive day is a later myth':'Each step removed one more “only life can” claim',13,C.muted);
  return {svg:out,phase:E.note};
 }});

const A2_ISO={
 urea:{n:'Urea and ammonium cyanate',f:'CH₄N₂O',a:['urea','(NH₂)₂C=O','white crystals; melts at 133 °C'],b:['ammonium cyanate','NH₄⁺ OCN⁻','a salt; turns into urea when warmed in water']},
 cyan:{n:'Cyanic and fulminic acid',f:'CHNO',a:['cyanic acid','H–O–C≡N','its silver salt is stable (Wöhler)'],b:['fulminic acid','H–C≡N⁺–O⁻','its silver salt explodes (Liebig)']},
 eth:{n:'Ethanol and dimethyl ether',f:'C₂H₆O',a:['ethanol','CH₃–CH₂–OH','liquid; boils at 78 °C'],b:['dimethyl ether','CH₃–O–CH₃','gas; boils at −24 °C']}};
SCENE({id:'wohler-urea-isomers',name:'Isomers',tag:'Same atoms, different substances',
 definition:'Isomers are compounds with the same atoms in different arrangements. Their formulas are identical, but they are different substances with different properties.',
 example:'In the 1820s Wöhler’s silver cyanate and Justus von Liebig’s silver fulminate had the same composition, yet one was stable and the other exploded. Jöns Jacob Berzelius coined the word “isomer” in 1830. Urea and ammonium cyanate are another such pair, and Wöhler’s synthesis turned one into the other.',
 desc:'Three pairs of isomers side by side, each with its shared formula, its structure and one property that tells the two apart.',
 research:['Berzelius, J. J. (1830). Om sammansättningen af vinsyra och drufsyra (introducing “isomeric”).','Liebig, J. (1824) and Wöhler, F. (1824) on silver fulminate and silver cyanate.'],
 dur:9,hint:'Choose a pair. The formula is the same; read what makes them different.',
 init:()=>({p:'urea'}),
 watch(p){return {p:['urea','cyan','eth'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['urea','Urea pair'],['cyan','Cyanate pair'],['eth','Ethanol pair']],label:'Pair',get:s=>s.p,act:'p'}],
 on:{p(s,v){s.p=v}},
 draw(s){
  const I=A2_ISO[s.p];let out=A2_head(I.n,'demonstrated');
  out+=TBF(300,92,'Shared formula: '+I.f,18,C.purple);
  [I.a,I.b].forEach((m,i)=>{const x=40+i*270;out+=R(x,116,250,180,'#fff',i?C.coral:C.blue,10)+TBF(x+125,146,m[0],16,i?C.coral:C.blue)+TMF(x+125,200,m[1],17,C.ink)+A2_wrap(m[2],34).map((l,j)=>TF(x+125,250+j*19,l,13,C.ink)).join('')});
  out+=TF(300,336,'Same atoms, different bonds, different behaviour',14,C.muted);
  return {svg:out,phase:`${I.a[0].charAt(0).toUpperCase()+I.a[0].slice(1)} and ${I.b[0]} both have the formula ${I.f}, but their atoms are joined differently.`};
 }});

/* ---------- Lesson: oparin-haldane ---------- */
// Toy soup model: production P (falls with oxygen), removal k (hydrolysis + oxidation + being eaten).
const A2_soup=(o2,E,life)=>{const P=E*(1-.9*o2/100),k=.05+.6*o2/100+(life?1.5:0);return {P,k,C:P/k}};
SCENE({id:'oparin-haldane',name:'The primordial soup',tag:'Oparin and Haldane’s idea',
 definition:'In the 1920s Alexander Oparin and J. B. S. Haldane independently proposed that the early Earth had an atmosphere without free oxygen. Energy from sunlight and lightning would turn simple gases into organic molecules, which could build up in the sea into a “hot dilute soup” because there was no oxygen to destroy them and no life to eat them.',
 example:'Haldane wrote in 1929 that before life arose, organic compounds “must have accumulated till the primitive oceans reached the consistency of hot dilute soup”. Today oxygen and microbes break such molecules down quickly, which is why the soup cannot form now.',
 desc:'Organic molecules building up in an ocean over time, in a toy model. Production needs energy and is lower with oxygen; removal is faster with oxygen and much faster once life is present. The dashed curve is the oxygen-free, lifeless case.',
 research:['Oparin, A. I. (1924). Proiskhozhdenie zhizni (The Origin of Life). Moscow Worker.','Haldane, J. B. S. (1929). The origin of life. The Rationalist Annual 148: 3–10.','Model illustrative: rates are invented to show the logic, not measured.'],
 dur:12,hint:'Raise the oxygen or switch life on, and see what happens to the soup. Then set Oparin and Haldane’s conditions.',
 init:()=>({o2:0,E:1,life:0}),
 watch(p){return p<.4?{o2:0,E:1,life:0}:p<.7?{o2:Math.round((p-.4)/.3*100),E:1,life:0}:{o2:0,E:1,life:1}},
 ui:[{range:'o2',label:'Oxygen',min:0,max:100,step:5,get:s=>s.o2,act:'o2',show:v=>v+'% of today'},{range:'E',label:'Energy',min:0,max:2,step:.1,get:s=>s.E,act:'E',show:v=>(+v).toFixed(1)+'× (lightning, sunlight)'},{choose:[['0','No life yet'],['1','Life present']],label:'Life',get:s=>String(s.life),act:'life'}],
 on:{o2(s,v){s.o2=+v},E(s,v){s.E=+v},life(s,v){s.life=+v}},
 draw(s){
  const m=A2_soup(s.o2,s.E,s.life),ref=A2_soup(0,1,0);
  let out=A2_head('Organic molecules in the early ocean','plausible');
  const A=A2_axes(90,70,440,200,[0,100],[0,25],{xt:[0,25,50,75,100],yt:[0,10,20],xl:'time (arbitrary units)',yl:'organic molecules (arbitrary)'});out+=A.svg;
  const c=(t,mm)=>mm.C*(1-Math.exp(-mm.k*t));
  out+=P(A2_path(range(101).map(t=>[A.X(t),A.Y(Math.min(25,c(t,ref)))])),C.muted,2,'none','stroke-dasharray="6 4"');
  out+=P(A2_path(range(101).map(t=>[A.X(t),A.Y(Math.min(25,c(t,m)))])),s.life?C.coral:C.blue,3.5);
  out+=TF(A.X(98),A.Y(Math.min(25,ref.C))-8,'no oxygen, no life',13,C.muted,'end');
  out+=TBF(300,336,`Steady level: ${(m.C/ref.C*100).toFixed(0)}% of the oxygen-free, lifeless soup`,15,m.C/ref.C>.6?C.green:C.coral);
  out+=TF(300,360,'Rates illustrative',13,C.muted);
  return {svg:out,phase:s.life?'With life present, organisms eat the molecules as fast as they form: no soup builds up. This is why the soup could only exist before life.':s.o2>30?'Oxygen both slows production and destroys the molecules: the soup stays thin.':'With no oxygen and no life, molecules accumulate until making and breaking balance.'};
 }});

const A2_ING=['ammonia','phosphate salts','light','heat','electricity'];
SCENE({id:'oparin-haldane-darwin',name:'Darwin’s warm little pond',tag:'A private speculation, 1871',
 definition:'Charles Darwin avoided the origin of life in print, but in a letter to Joseph Hooker in 1871 he imagined a “warm little pond” with ammonia and phosphoric salts, light, heat and electricity, in which a protein compound might form and go on to more complex changes. He added that today such matter would be instantly eaten or absorbed, which would not have happened before living creatures existed.',
 example:'Darwin called it a big “if”. Modern versions of the pond idea, with wet–dry cycles on volcanic land that concentrate and join molecules, are one of the main rivals to the deep-sea vent picture (see era 5).',
 desc:'A pond with five ingredients from Darwin’s letter that can be added. With enough of them, a complex compound forms; a second view shows the same pond today, where a microbe consumes it.',
 research:['Darwin, C. (1871). Letter to J. D. Hooker, 1 February 1871. Darwin Correspondence Project, letter 7471.','Damer, B. & Deamer, D. (2020). The hot spring hypothesis for an origin of life. Astrobiology 20: 429–452.'],
 dur:12,hint:'Add Darwin’s ingredients one at a time, then compare the pond before life with the pond today.',
 init:()=>({ing:[1,1,0,1,0],today:0}),
 watch(p){return {ing:A2_ING.map((x,i)=>p>(i+1)/7?1:0),today:p>.85?1:0}},
 ui:[{choose:[['0','Before life'],['1','Today']],label:'When',get:s=>String(s.today),act:'today'}],
 on:{pick(s,a){s.ing=s.ing.slice();s.ing[+a]=s.ing[+a]?0:1},today(s,v){s.today=+v}},
 draw(s,f,X){
  let out=A2_head('A “warm little pond”','speculative');
  const n=s.ing.reduce((a,b)=>a+b,0),forms=n>=4;
  out+=`<ellipse cx="200" cy="230" rx="150" ry="62" fill="${forms?'#d9e7d2':'#d7ebf4'}" stroke="${C.ink}" stroke-width="2"/>`;
  if(s.ing[2])for(let i=0;i<6;i++)out+=L(150+i*20,70,135+i*24,150,'#e3b23c',2,'opacity=".7"');
  if(s.ing[4])out+=P('M300 70L285 110L300 108L282 150',C.amber,3);
  if(s.ing[3])for(let i=0;i<3;i++)out+=P(`M${130+i*40} 210q5 -10 0 -20t0 -20`,C.coral,2,'none','opacity=".7"');
  if(s.ing[0])for(let i=0;i<5;i++)out+=Ci(110+i*42,245,4,C.blue);
  if(s.ing[1])for(let i=0;i<5;i++)out+=Ci(130+i*40,262,4,C.purple);
  if(forms){out+=P('M170 232l12 -8l12 8l12 -8l12 8l12 -8',C.green,4);out+=TF(200,312,'a complex compound forms',13,C.green)}
  if(forms&&s.today)out+=Ci(256,224,14,'#e9d7a4',C.ink)+Ci(252,220,3,C.ink)+TF(274,208,'eaten at once',13,C.coral,'start');
  A2_ING.forEach((t,i)=>{const y=74+i*44,on=s.ing[i];out+=hit(X,'pick',i,t+(on?': added':': not added'),R(400,y,180,36,on?C.greenp:'#fff',on?C.green:C.grid,8)+Ci(420,y+18,8,on?C.green:'#fff',C.green)+TF(436,y+23,t,13,C.ink,'start'))});
  out+=TF(300,350,'Darwin’s letter to Hooker, 1871: speculation, not a test',13,C.muted);
  return {svg:out,phase:!forms?`${n} of Darwin’s five ingredients present. In his picture, enough of them together could build a “protein compound”.`:s.today?'Today any such compound would be eaten or absorbed by microbes at once, as Darwin himself noted.':'Before life, nothing would eat the compound, so it could go on to “still more complex changes”.'};
 }});

const A2_H={ocean:{n:'Open ocean',h:3700,d:'mean depth about 3,700 m'},pond:{n:'Pond',h:1,d:'about 1 m deep'},pool:{n:'Drying pool',h:.01,d:'about 1 cm deep'}};
const A2_lg=v=>Math.log10(Math.max(v,1e-30));
const A2_sup=n=>String(n).split('').map(c=>c==='-'?'⁻':'⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('');
// 10^v written as plain scientific notation, e.g. 3.2 × 10⁻⁶.
const A2_sci=v=>{const e=Math.floor(v+1e-9),m=10**(v-e);return (Math.abs(m-1)<1e-6?'':Number(m.toPrecision(2))+' × ')+'10'+A2_sup(e)};
// A concentration given in mmol/L (= mol/m³), in the unit that keeps the number between 1 and 1000.
const A2_conc=mm=>{for(const [u,f] of [['M',1e3],['mM',1],['µM',1e-3],['nM',1e-6],['pM',1e-9],['fM',1e-12]])if(mm>=f)return Number((mm/f).toPrecision(2))+' '+u;return 'under 1 fM'};
SCENE({id:'oparin-haldane-dilution',name:'How thick was the soup?',tag:'The concentration problem',
 definition:'Molecules made from the air rain into water, where they slowly break down. Their steady concentration is the rate they arrive per square metre, multiplied by how long they last, divided by the depth of the water. Spread through a deep ocean, even generous production gives a very thin soup.',
 example:'If 10⁻⁶ moles of a building block arrive on each square metre every year and each molecule lasts 10,000 years, the open ocean holds about 3 nanomolar, but a pond 1 metre deep holds about 10 micromolar and a drying pool 1 centimetre deep about 1 millimolar. Joining building blocks into chains generally needs high concentrations, which is one reason shallow pools, mineral surfaces and porous vent rocks are favoured (Baaske et al. 2007).',
 desc:'A logarithmic scale of concentration with a marker for the chosen production rate, lifetime and water depth. A band marks the rough millimolar range where joining-up reactions become practical.',
 research:['Steady state: concentration = flux × lifetime ÷ depth (mass balance).','Lazcano, A. & Miller, S. L. (1996). The origin and early evolution of life: prebiotic chemistry, the pre-RNA world, and time. Cell 85: 793–798.','Baaske, P. et al. (2007). Extreme accumulation of nucleotides in simulated hydrothermal pore systems. PNAS 104: 9346–9351.','Production rates and lifetimes are illustrative ranges, not measurements.'],
 dur:12,hint:'Choose where the molecules collect, then change how fast they arrive and how long they last. How far is the open ocean from the band?',
 init:()=>({F:-6,tau:4,w:'ocean'}),
 watch(p){return {F:-6,tau:4,w:p<.34?'ocean':p<.67?'pond':'pool'}},
 ui:[{range:'F',label:'Arrival',min:-9,max:-3,step:.5,get:s=>s.F,act:'F',show:v=>A2_sci(+v)+' mol/m²/yr'},{range:'tau',label:'Lifetime',min:0,max:6,step:.5,get:s=>s.tau,act:'tau',show:v=>A2_sci(+v)+' years'},{choose:[['ocean','Ocean'],['pond','Pond'],['pool','Drying pool']],label:'Water',get:s=>s.w,act:'w'}],
 on:{F(s,v){s.F=+v},tau(s,v){s.tau=+v},w(s,v){s.w=v}},
 draw(s){
  const W=A2_H[s.w],Cm=10**s.F*10**s.tau/W.h;// mol/m³ = mM
  let out=A2_head('Steady concentration in the '+W.n.toLowerCase(),'plausible');
  const x0=70,x1=530,lo=-12,hi=3,X=v=>x0+(v-lo)/(hi-lo)*(x1-x0);
  out+=R(X(0),110,X(hi)-X(0),60,C.greenp,'none',6)+TF((X(0)+X(hi))/2,104,'joining practical (rough)',13,C.green);
  out+=L(x0,170,x1,170,C.ink,2.5);
  [-12,-9,-6,-3,0,3].forEach(v=>{out+=L(X(v),164,X(v),176,C.ink,2)});
  [[-12,'1 fM'],[-9,'1 pM'],[-6,'1 nM'],[-3,'1 µM'],[0,'1 mM'],[3,'1 M']].forEach(([v,t])=>{out+=TF(X(v),194,t,13,C.muted)});
  const v=clamp(A2_lg(Cm),lo,hi);out+=P(`M${fmt(X(v))} 168l-9 -18h18z`,C.coral,2,C.coral)+TBF(X(v),136,'here',13,C.coral);
  const lab=A2_conc(Cm);
  out+=A2_card(70,222,460,`${W.n} (${W.d}): about ${lab}`,['concentration = arrival rate × lifetime ÷ depth',`= ${A2_sci(s.F)} mol/m²/yr × ${A2_sci(s.tau)} yr ÷ ${W.h} m`],Cm>=1?C.green:C.coral);
  out+=TF(300,350,'Rates and lifetimes illustrative; real ones vary by molecule',13,C.muted);
  return {svg:out,phase:Cm>=1?'At millimolar levels, building blocks meet often enough to join. Shallow drying pools get there far more easily than oceans.':`About ${lab}: far too dilute for building blocks to join up easily. The same production in shallower water gives a thicker soup.`};
 }});

/* ---------- Lesson: miller-urey ---------- */
const A2_AA=[['glycine',1],['alanine',.75],['aspartic acid',.25],['α-aminobutyric acid',.3]];
SCENE({id:'miller-urey',name:'The Miller–Urey experiment',tag:'Amino acids from a spark, 1953',
 definition:'In 1953 Stanley Miller, a graduate student working with Harold Urey, sealed methane, ammonia, hydrogen and water into glass, boiled the water to circulate the gases and passed sparks through them to imitate lightning. Within a week the water turned pink and then brown, and it contained amino acids, the building blocks of proteins.',
 example:'Miller identified glycine and alanine with certainty, and others less certainly, after one week of sparking. The experiment showed that some of life’s building blocks form easily from simple gases and energy, which is why it is still the most famous experiment in the field.',
 desc:'Miller’s apparatus: a boiling flask, a spark chamber, a condenser and a trap where products collect. Days of sparking colour the water; bars show which amino acids have built up (heights illustrative).',
 research:['Miller, S. L. (1953). A production of amino acids under possible primitive Earth conditions. Science 117: 528–529.','Miller, S. L. (1955). Production of some organic compounds under possible primitive Earth conditions. Journal of the American Chemical Society 77: 2351–2361.','Bar heights illustrative, ordered as Miller reported (glycine most abundant).'],
 dur:12,hint:'Switch the spark on and run the days forward. Watch the colour of the water and the bars.',
 init:()=>({d:4,spark:1}),
 watch(p){return {d:+(p*7).toFixed(1),spark:1}},
 ui:[{range:'d',label:'Days',min:0,max:7,step:.5,get:s=>s.d,act:'d',show:v=>v+' days'},{b:'Spark on / off',act:'spark'}],
 on:{d(s,v){s.d=+v},spark(s){s.spark=s.spark?0:1;if(s.spark)AUDIO.noise({dur:.35,gain:.07});return 'keep'}},
 draw(s,f){
  const run=s.spark?s.d/7:0,col=`rgb(${Math.round(225-60*run)},${Math.round(236-120*run)},${Math.round(244-170*run)})`;
  let out=A2_head(s.spark?'Sparking, day '+s.d:'Spark off: nothing forms','demonstrated');
  // Boiling flask, riser, spark chamber, condenser, trap.
  out+=P('M96 252V120H148',C.ink,3)+P('M252 120H310V160',C.ink,3)+P('M310 240V322Q310 338 294 338H112Q96 338 96 326',C.ink,3);
  out+=Ci(96,290,38,col,C.ink)+TF(142,300,'boiling water',13,C.muted,'start');
  out+=Ci(200,120,52,'#f5f9fc',C.ink)+L(160,120,188,120,C.ink,3)+L(212,120,240,120,C.ink,3);
  if(s.spark&&s.d>0)out+=P('M189 120l4 -6l4 9l4 -7l4 6l4 -4',C.amber,2.5);
  out+=TF(200,190,'spark chamber',13,C.muted)+TF(200,208,'CH₄ · NH₃ · H₂ · H₂O',13,C.ink);
  out+=R(298,160,24,80,'#e7f3fa',C.blue,6)+TF(330,204,'condenser',13,C.muted,'start');
  out+=Ci(310,300,10,col,C.ink)+L(310,240,310,290,C.ink,3)+TF(328,304,'trap',13,C.muted,'start');
  // Product bars.
  out+=TBF(400,80,'In the trap',14,C.ink,'start');
  A2_AA.forEach(([n,h],i)=>{const y=106+i*42,w=170*h*run;out+=TF(400,y,n,13,C.ink,'start')+R(400,y+6,Math.max(2,w),12,C.green,'none',3)});
  out+=TF(400,292,'bar lengths illustrative',13,C.muted,'start');
  return {svg:out,phase:!s.spark?'Without an energy source the gases do not react: the water stays clear.':s.d<1?'The first day: the water begins to turn pink.':s.d<4?'The water darkens as organic compounds accumulate and wash down into the trap.':'After a week the trap holds a brown mixture containing amino acids, glycine most of all.'};
 }});

const A2_ARCH={
 classic:{n:'Classic apparatus, 1953',orig:'5 amino acids identified (3 with certainty)',now:null,note:'The experiment as published in Science.'},
 volcanic:{n:'“Volcanic” apparatus, 1953',orig:'run by Miller; vials stored, little analysed',now:'22 amino acids and 5 amines found in 2008',note:'A steam jet aspirator imitating a steamy volcanic eruption gave more variety.'},
 h2s:{n:'Hydrogen sulphide run, 1958',orig:'never analysed at the time',now:'23 amino acids and 4 amines found in 2011',note:'Adding H₂S, a volcanic gas, produced sulphur-containing amino acids too.'}};
SCENE({id:'miller-urey-archive',name:'Miller’s forgotten vials',tag:'Old samples, new instruments',
 definition:'Stanley Miller kept dried residues from his experiments. After his death in 2007, colleagues analysed vials from the 1950s with instruments a million times more sensitive than his paper chromatography, and found far more variety than he had been able to detect.',
 example:'Samples from a 1953 run with a steam jet, imitating a volcanic eruption, contained 22 amino acids (Johnson et al., 2008). Samples from a 1958 run that included hydrogen sulphide, never analysed by Miller, contained 23, including sulphur-bearing ones (Parker et al., 2011).',
 desc:'Three of Miller’s experiments with what was found at the time and in modern re-analyses of the archived vials.',
 research:['Johnson, A. P., Cleaves, H. J., Dworkin, J. P., Glavin, D. P., Lazcano, A. & Bada, J. L. (2008). The Miller volcanic spark discharge experiment. Science 322: 404.','Parker, E. T. et al. (2011). Primordial synthesis of amines and amino acids in a 1958 Miller H₂S-rich spark discharge experiment. PNAS 108: 5526–5531.'],
 dur:10,hint:'Choose an experiment and compare what Miller could detect with what modern instruments found in his own vials.',
 init:()=>({e:'h2s'}),
 watch(p){return {e:['classic','volcanic','h2s'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['classic','Classic 1953'],['volcanic','Volcanic 1953'],['h2s','H₂S 1958']],label:'Experiment',get:s=>s.e,act:'e'}],
 on:{e(s,v){s.e=v}},
 draw(s){
  const A=A2_ARCH[s.e];let out=A2_head(A.n,'demonstrated');
  for(let i=0;i<5;i++){const x=90+i*40;out+=R(x,80,26,80,'#fbfdfe',C.ink,4)+R(x+3,128,20,28,'#d9c49a','none',3)+R(x-2,72,30,12,'#7a7a7a','none',3)}
  out+=TF(170,184,'archived dried residues',13,C.muted);
  out+=A2_card(320,74,250,'At the time',A2_wrap(A.orig,32),C.amber);
  out+=A2_card(320,170,250,'Re-analysed',A.now?A2_wrap(A.now,32):['not needed for this run:','see the other two'],C.green);
  out+=A2_card(40,262,530,'Why it differs',A2_wrap(A.note,70),C.blue);
  return {svg:out,phase:A.now?`${A.note} ${A.now}.`:'The classic experiment, as Miller could analyse it in 1953.'};
 }});

// Illustrative yields (% of carbon into amino acids) against reducing power 0–1.
const A2_yield=(r,fix)=>{const base=-4+3.6*r;return 10**(fix?Math.max(base,-2.2+1.8*r):base)};
SCENE({id:'miller-urey-atmosphere',name:'Which atmosphere?',tag:'Reducing, neutral and the yield problem',
 definition:'Miller assumed a strongly reducing atmosphere of methane, ammonia and hydrogen. Many geochemists later argued the early atmosphere was closer to neutral, mostly carbon dioxide and nitrogen. Spark experiments in neutral gas mixtures gave far smaller yields, and for years that seemed to undercut the experiment.',
 example:'Schlesinger and Miller (1983) found amino-acid yields fell steeply as hydrogen was replaced by carbon dioxide. Cleaves and colleagues (2008) then showed that much of the loss came from nitrite and acid formed in the water destroying the products; adding buffers and iron restored substantial yields in neutral mixtures. Impacts and volcanoes may also have supplied local reducing gases.',
 desc:'Amino-acid yield on a logarithmic scale against how reducing the gas mixture is, from neutral carbon dioxide and nitrogen to Miller’s methane and ammonia. A switch adds the buffered chemistry of later experiments. Curves illustrative.',
 research:['Schlesinger, G. & Miller, S. L. (1983). Prebiotic synthesis in atmospheres containing CH₄, CO, and CO₂. I. Amino acids. Journal of Molecular Evolution 19: 376–382.','Cleaves, H. J., Chalmers, J. H., Lazcano, A., Miller, S. L. & Bada, J. L. (2008). A reassessment of prebiotic organic synthesis in neutral planetary atmospheres. Origins of Life and Evolution of Biospheres 38: 105–115.','Curve shapes illustrative.'],
 dur:12,hint:'Slide from a neutral to a reducing mixture, then switch on the buffered chemistry and repeat.',
 init:()=>({r:.2,fix:0}),
 watch(p){return {r:+(p<.5?p*2:(p-.5)*2).toFixed(2),fix:p<.5?0:1}},
 ui:[{range:'r',label:'Mixture',min:0,max:1,step:.05,get:s=>s.r,act:'r',show:v=>v<.25?'neutral (CO₂, N₂)':v<.6?'weakly reducing':'strongly reducing (CH₄, NH₃)'},{choose:[['0','Water as in 1983'],['1','Buffered (2008)']],label:'Water',get:s=>String(s.fix),act:'fix'}],
 on:{r(s,v){s.r=+v},fix(s,v){s.fix=+v}},
 draw(s){
  let out=A2_head('Amino-acid yield against the gas mixture','plausible');
  const A=A2_axes(100,70,420,210,[0,1],[-4,0],{xt:[[0,'neutral'],[.5,'weakly reducing'],[1,'reducing']],yt:[[0,'1%'],[-1,'0.1%'],[-2,'0.01%'],[-3,'0.001%']],yl:'carbon turned into amino acids'});out+=A.svg;
  out+=P(A2_path(range(51).map(i=>i/50).map(r=>[A.X(r),A.Y(Math.log10(A2_yield(r,0)))])),C.coral,3);
  out+=P(A2_path(range(51).map(i=>i/50).map(r=>[A.X(r),A.Y(Math.log10(A2_yield(r,1)))])),C.green,3,'none',s.fix?'':'stroke-dasharray="6 5" opacity=".45"');
  const y=A2_yield(s.r,s.fix);out+=Ci(A.X(s.r),A.Y(Math.log10(y)),8,s.fix?C.green:C.coral,'#fff');
  out+=TF(A.X(.08),A.Y(-3.4)-6,'unbuffered',13,C.coral,'start')+TF(A.X(.08),A.Y(-1.9)-10,'buffered',13,C.green,'start');
  out+=TBF(300,334,`Yield about ${y>=.01?y.toFixed(2):y.toPrecision(1)}% of carbon`,15,s.fix?C.green:C.coral);
  out+=TF(300,358,'Curves illustrative; the trend follows the studies cited',13,C.muted);
  return {svg:out,phase:s.r<.3&&!s.fix?'A neutral mixture with unbuffered water gives almost nothing: the long-standing objection.':s.r<.3?'With buffered water the neutral mixture still makes amino acids: the products were being destroyed, not never formed.':'Reducing mixtures give the highest yields, as Miller found.'};
 }});

/* ---------- Lesson: meteorite-chemistry ---------- */
const A2_MAA=[
 {n:'glycine',m:1,spark:1,prot:1},{n:'alanine',m:1,spark:1,prot:1},{n:'aspartic acid',m:1,spark:1,prot:1},{n:'glutamic acid',m:1,spark:0,prot:1},
 {n:'valine',m:1,spark:0,prot:1},{n:'β-alanine',m:1,spark:1,prot:0},{n:'α-aminobutyric acid',m:1,spark:1,prot:0},{n:'isovaline',m:1,spark:0,prot:0},{n:'α-aminoisobutyric acid',m:1,spark:0,prot:0}];
SCENE({id:'meteorite-chemistry',name:'Amino acids from space',tag:'The Murchison meteorite, 1969',
 definition:'On 28 September 1969 a meteorite fell near Murchison in Victoria, Australia. It is a carbonaceous chondrite, rock rich in carbon compounds. Analyses found amino acids that could not be Earth contamination: many are not used by life at all, and the ones that life uses came in both mirror-image forms.',
 example:'Kvenvolden and colleagues reported glycine, alanine, glutamic acid, valine and proline in 1970, together with unusual ones such as α-aminoisobutyric acid. Many more have been identified since. The mixture looks remarkably like the products of spark experiments, which suggests that the same kind of chemistry happens in space.',
 desc:'A list of amino acids, each marked by where it has been found: in the Murchison meteorite, in Miller’s 1953 spark products, and in the proteins of life. Pressing one shows a note.',
 research:['Kvenvolden, K. et al. (1970). Evidence for extraterrestrial amino-acids and hydrocarbons in the Murchison meteorite. Nature 228: 923–926.','Miller, S. L. (1953). Science 117: 528–529 (spark products).','Pizzarello, S., Cooper, G. W. & Flynn, G. J. (2006). The nature and distribution of the organic material in carbonaceous chondrites and interplanetary dust particles. In Meteorites and the Early Solar System II.'],
 dur:12,hint:'Press an amino acid to read about it. Which ones prove the meteorite’s amino acids are not contamination?',
 init:()=>({sel:7}),
 watch(p){return {sel:Math.min(8,Math.floor(p*9))}},
 ui:[{range:'sel',label:'Amino acid',min:0,max:8,step:1,get:s=>s.sel,act:'sel',show:v=>A2_MAA[v].n}],
 on:{sel(s,v){s.sel=+v},pick(s,a){s.sel=+a}},
 draw(s,f,X){
  let out=A2_head('Where each amino acid has been found','demonstrated');
  const cols=['Murchison','Spark 1953','Proteins'];
  cols.forEach((c,j)=>{out+=TBF(330+j*90,74,c,13,C.ink)});
  A2_MAA.forEach((a,i)=>{const y=86+i*26,on=i===s.sel;
   out+=hit(X,'pick',i,a.n,R(30,y,540,23,on?C.pale:'#fff',on?C.blue:'none',6)+TF(42,y+16,a.n,13,on?C.blue:C.ink,'start')+[a.m,a.spark,a.prot].map((v,j)=>TBF(330+j*90,y+17,v?'✓':'–',15,v?C.green:C.muted)).join(''))});
  const A=A2_MAA[s.sel],Nm=A.n.charAt(0).toUpperCase()+A.n.slice(1);
  const note=A.n==='glycine'?'Glycine is the simplest amino acid, and among the most common in meteorites and spark experiments. It has no mirror-image form.':!A.prot?`${Nm} is not used in the proteins of life, so finding it cannot be contamination from living things.`:`${Nm} is used by life. In Murchison its two mirror forms appear in close to equal amounts, unlike in living things, which use one.`;
  A2_wrap(note,76).forEach((l,j)=>{out+=TF(300,336+j*18,l,13,C.ink)});
  return {svg:out,phase:note};
 }});

SCENE({id:'meteorite-chemistry-chirality',name:'A slight left-handed excess',tag:'Mirror-image molecules in a meteorite',
 definition:'Most amino acids come in two mirror-image forms, left (L) and right (D). Ordinary chemistry makes equal amounts; life uses almost only L. Some amino acids in carbonaceous meteorites show a small excess of the L form, which raises the possibility that space chemistry tipped the balance before life began.',
 example:'Cronin and Pizzarello (1997) found L-excesses of a few per cent in α-methyl amino acids such as isovaline in Murchison; later work reported excesses up to about 18% in some meteorites (Glavin and Dworkin, 2009). Because isovaline is very rare in living things, this excess is very unlikely to be Earth contamination. Whether it mattered for life’s handedness is unknown (see era 6).',
 desc:'One hundred molecules of a chosen amino acid, left-handed in blue and right-handed in coral, with a slider for the excess. A switch compares isovaline, which is very rare in life, with alanine, where contamination is a risk.',
 research:['Cronin, J. R. & Pizzarello, S. (1997). Enantiomeric excesses in meteoritic amino acids. Science 275: 951–955.','Glavin, D. P. & Dworkin, J. P. (2009). Enrichment of the amino acid L-isovaline by aqueous alteration on CI and CM meteorite parent bodies. PNAS 106: 5487–5492.'],
 dur:12,hint:'Raise the excess and count the colours. Then switch to alanine: why is an excess there harder to trust?',
 init:()=>({ee:8,aa:'iso'}),
 watch(p){return {ee:2*Math.round(p*9),aa:p<.75?'iso':'ala'}},
 ui:[{range:'ee',label:'L excess',min:0,max:20,step:2,get:s=>s.ee,act:'ee',show:v=>v+'%'},{choose:[['iso','Isovaline'],['ala','Alanine']],label:'Molecule',get:s=>s.aa,act:'aa'}],
 on:{ee(s,v){s.ee=+v},aa(s,v){s.aa=v}},
 draw(s){
  const nL=Math.round(50+s.ee/2),nD=100-nL;let out=A2_head(s.aa==='iso'?'Isovaline: very rare in life':'Alanine: made by every cell','demonstrated');
  const order=shuffled(range(100),23);
  order.forEach((k,i)=>{const x=60+(i%20)*22,y=82+Math.floor(i/20)*30,isL=k<nL;out+=isL?P(`M${x-6} ${y+6}L${x} ${y-7}L${x+6} ${y+6}`,C.blue,2.5):P(`M${x-6} ${y-6}L${x} ${y+7}L${x+6} ${y-6}`,C.coral,2.5)});
  out+=TBF(160,256,`L: ${nL}`,16,C.blue)+TBF(300,256,`D: ${nD}`,16,C.coral)+TBF(450,256,`excess ${s.ee}%`,16,C.ink);
  const lines=s.aa==='iso'?['Isovaline is very rare in life, so an L excess','is unlikely to come from Earth microbes or fingers.']:['Every cell makes L-alanine. A little Earth','contamination would look exactly like an L excess.'];
  out+=A2_card(60,276,480,s.aa==='iso'?'Trustworthy signal':'Hard to trust',lines,s.aa==='iso'?C.green:C.coral);
  return {svg:out,phase:`${nL} left-handed and ${nD} right-handed: an excess of ${s.ee}% means ${s.ee} more left-handed than right-handed molecules in every 100.`};
 }});

const A2_SAMP={
 murch:{n:'Murchison (fell 1969)',how:'picked up from fields and handled on Earth',rows:[['Amino acids',1,'Kvenvolden et al. 1970'],['Nucleobases',1,'Martins et al. 2008; Callahan et al. 2011'],['Ribose (a sugar)',1,'Furukawa et al. 2019'],['Free of Earth contamination',0,'exposed to air, soil and handling']]},
 ryugu:{n:'Ryugu (Hayabusa2, 2020)',how:'sealed in a capsule from asteroid to laboratory',rows:[['Amino acids',1,'Naraoka et al. 2023'],['Nucleobases',1,'uracil: Oba et al. 2023'],['Ribose (a sugar)',-1,'not reported here'],['Free of Earth contamination',1,'returned sealed']]},
 bennu:{n:'Bennu (OSIRIS-REx, 2023)',how:'sealed in a capsule from asteroid to laboratory',rows:[['Amino acids',1,'14 of life’s 20 (Glavin et al. 2025)'],['Nucleobases',1,'all five (Glavin et al. 2025)'],['Salty brine minerals',1,'McCoy et al. 2025'],['Free of Earth contamination',1,'returned sealed']]}};
SCENE({id:'meteorite-chemistry-samples',name:'Samples brought home',tag:'Murchison, Ryugu and Bennu',
 definition:'Meteorites arrive dirty: they fall through the air and lie on the ground. To be sure that organic molecules come from space, two missions collected rock directly from carbon-rich asteroids and brought it back sealed: Japan’s Hayabusa2 from Ryugu and NASA’s OSIRIS-REx from Bennu.',
 example:'Ryugu samples contained amino acids and the nucleobase uracil. Bennu samples, delivered in 2023, contained 14 of the 20 amino acids used in life’s proteins, all five nucleobases of DNA and RNA, and minerals left by evaporating salty water. These show the building blocks were widespread in the early Solar System; whether deliveries mattered for life on Earth is still open.',
 desc:'Three sources of space rock, with a checklist of life’s building blocks found in each and whether the sample was protected from Earth contamination.',
 research:['Callahan, M. P. et al. (2011). Carbonaceous meteorites contain a wide range of extraterrestrial nucleobases. PNAS 108: 13995–13998.','Furukawa, Y. et al. (2019). Extraterrestrial ribose and other sugars in primitive meteorites. PNAS 116: 24440–24445.','Oba, Y. et al. (2023). Uracil in the carbonaceous asteroid (162173) Ryugu. Nature Communications 14: 1292.','Glavin, D. P. et al. (2025). Abundant ammonia and nitrogen-rich soluble organic matter in samples from asteroid (101955) Bennu. Nature Astronomy.','McCoy, T. J. et al. (2025). An evaporite sequence from ancient brine recorded in Bennu samples. Nature.'],
 dur:12,hint:'Compare the three sources. Why do scientists go to so much trouble to bring rock home sealed?',
 init:()=>({src:'bennu'}),
 watch(p){return {src:['murch','ryugu','bennu'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['murch','Murchison'],['ryugu','Ryugu'],['bennu','Bennu']],label:'Source',get:s=>s.src,act:'src'}],
 on:{src(s,v){s.src=v}},
 draw(s){
  const S=A2_SAMP[s.src];let out=A2_head(S.n,'demonstrated');
  out+=TF(300,76,S.how,13,C.muted);
  S.rows.forEach(([n,v,src],i)=>{const y=96+i*58;out+=R(40,y,520,48,'#fff',C.grid,8)+Ci(70,y+24,15,v===1?C.greenp:v===0?C.coralp:'#f1f5f7')+TBF(70,y+30,v===1?'✓':v===0?'✗':'?',16,v===1?C.green:v===0?C.coral:C.muted)+TBF(96,y+21,n,14,C.ink,'start')+TF(96,y+39,src,13,C.muted,'start')});
  out+=TF(300,350,'Found in space rock ≠ shown to have started life on Earth',13,C.muted);
  return {svg:out,phase:s.src==='murch'?'Murchison is rich in building blocks, but every result must rule out Earth contamination.':'Returned sealed, these samples show the building blocks are truly from space, and common in carbon-rich asteroids.'};
 }});
