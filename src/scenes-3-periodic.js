/* ===================== Chemistry era 3 · The periodic table (1869–1932) ===================== */
// Shared helpers for this era (prefix C3_).
function C3_axes(x,y,w,h,xr,yr,o={}){
 const X=v=>x+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let s=R(x,y,w,h,'#fff',C.grid,6);
 for(const t of o.xt||[]){const v=Array.isArray(t)?t[0]:t,lab=Array.isArray(t)?t[1]:t;s+=L(X(v),y,X(v),y+h,'#eef3f6',1)+TF(X(v),y+h+15,String(lab),13,C.muted)}
 for(const t of o.yt||[]){const v=Array.isArray(t)?t[0]:t,lab=Array.isArray(t)?t[1]:t;s+=L(x,Y(v),x+w,Y(v),'#eef3f6',1)+TF(x-6,Y(v)+4,String(lab),13,C.muted,'end')}
 if(o.xl)s+=TF(x+w/2,y+h+31,o.xl,13,C.muted);
 if(o.yl)s+=TF(x+6,y-7,o.yl,13,C.muted,'start');
 return {svg:s,X,Y};
}
const C3_path=pts=>'M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join('L');
function C3_card(x,y,w,title,lines,col=C.blue){
 let out=R(x,y,w,30+lines.length*19,'#fff',C.grid,8)+TBF(x+12,y+21,title,14,col,'start');
 lines.forEach((l,i)=>{out+=TF(x+12,y+42+i*19,l,13,C.ink,'start')});return out;
}
// Element symbols 1–36 and first ionisation energies (eV, NIST values rounded to 0.01).
const C3_SYM=['H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca','Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn','Ga','Ge','As','Se','Br','Kr'];
const C3_NAME=['hydrogen','helium','lithium','beryllium','boron','carbon','nitrogen','oxygen','fluorine','neon','sodium','magnesium','aluminium','silicon','phosphorus','sulfur','chlorine','argon','potassium','calcium','scandium','titanium','vanadium','chromium','manganese','iron','cobalt','nickel','copper','zinc','gallium','germanium','arsenic','selenium','bromine','krypton'];
const C3_IE=[13.60,24.59,5.39,9.32,8.30,11.26,14.53,13.62,17.42,21.56,5.14,7.65,5.99,8.15,10.49,10.36,12.97,15.76,4.34,6.11,6.56,6.83,6.75,6.77,7.43,7.90,7.88,7.64,7.73,9.39,6.00,7.90,9.79,9.75,11.81,14.00];

/* ---------- Lesson: periodic-table ---------- */
// Mendeleev's 1871 short-form table: rows are series, columns groups I–VIII. null = a gap he left.
const C3_MEND=[
 [['H',1]],
 [['Li',7],['Be',9.4],['B',11],['C',12],['N',14],['O',16],['F',19]],
 [['Na',23],['Mg',24],['Al',27.3],['Si',28],['P',31],['S',32],['Cl',35.5]],
 [['K',39],['Ca',40],null,['Ti',48],['V',51],['Cr',52],['Mn',55],['Fe–Ni',56]],
 [['Cu',63],['Zn',65],null,null,['As',75],['Se',78],['Br',80]]];
const C3_GAPS={b:{row:3,col:2,name:'eka-boron',w:44,found:'Scandium (Sc), 1879',by:'Lars Fredrik Nilson, Sweden',pred:['Atomic weight about 44','Oxide Eb₂O₃','Oxide density about 3.5'],real:['Atomic weight 44.96','Oxide Sc₂O₃','Oxide density 3.86']},
 al:{row:4,col:2,name:'eka-aluminium',w:68,found:'Gallium (Ga), 1875',by:'Paul-Émile Lecoq de Boisbaudran, France',pred:['Atomic weight about 68','Density about 5.9 g/cm³','Low melting point'],real:['Atomic weight 69.72','Density 5.9 g/cm³','Melts at 29.8 °C']},
 si:{row:4,col:3,name:'eka-silicon',w:72,found:'Germanium (Ge), 1886',by:'Clemens Winkler, Germany',pred:['Atomic weight about 72','Density about 5.5 g/cm³','Grey metal-like solid'],real:['Atomic weight 72.63','Density 5.32 g/cm³','Grey-white metalloid']}};
function C3_mendTable(X,s,x0,y0,cw,ch){
 let out='';const roman=['I','II','III','IV','V','VI','VII','VIII'];
 roman.forEach((r,i)=>{out+=TBF(x0+i*cw+cw/2,y0-8,r,13,C.muted)});
 C3_MEND.forEach((row,ri)=>{for(let ci=0;ci<8;ci++){
  const x=x0+ci*cw,y=y0+ri*ch;let cell=ci<row.length?row[ci]:undefined;
  const gapKey=Object.keys(C3_GAPS).find(k=>C3_GAPS[k].row===ri&&C3_GAPS[k].col===ci);
  if(gapKey){const on=s.gap===gapKey,G3=C3_GAPS[gapKey],filled=s.shown&&s.shown.includes(gapKey);
   out+=hit(X,'gap',gapKey,'Gap: '+G3.name,R(x+2,y+2,cw-4,ch-4,on?C.amberp:'#fff',on?C.amber:C.coral,6,'stroke-dasharray="4 3"')+TBF(x+cw/2,y+ch/2-2,filled?G3.found.slice(G3.found.indexOf('(')+1,G3.found.indexOf(')')):'?',15,filled?C.green:C.coral)+TF(x+cw/2,y+ch/2+14,String(G3.w),13,C.muted));continue}
  if(!cell)continue;
  out+=R(x+2,y+2,cw-4,ch-4,ci===7?'#eef3f6':C.pale,'none',6)+TBF(x+cw/2,y+ch/2-2,cell[0],cell[0].length>3?13:15,C.ink)+TF(x+cw/2,y+ch/2+14,String(cell[1]),13,C.muted);
 }});
 return out;
}
SCENE({id:'periodic-table',name:'Mendeleev’s table',tag:'Leaving gaps on purpose',
 definition:'In 1869 Dmitri Mendeleev arranged the known elements by atomic weight and grouped those with similar chemistry in columns. Where the pattern needed an element that nobody had found, he left a gap and predicted its properties.',
 example:'Between zinc (65) and arsenic (75) there had to be two missing elements, below aluminium and silicon. He called them eka-aluminium and eka-silicon. Gallium was found in 1875 and germanium in 1886.',
 desc:'Mendeleev’s 1871 short-form table, with groups I–VIII across and series down, atomic weights under each symbol, and three gaps marked “?”. Pressing a gap shows his prediction and the element later found.',
 research:['Mendeleev, D. (1869). On the relationship of the properties of the elements to their atomic weights. Zhurnal Russkogo Khimicheskogo Obshchestva 1, 60–77.','Mendeleev, D. (1871). Die periodische Gesetzmässigkeit der chemischen Elemente. Annalen der Chemie, Supplementband 8, 133–229.','Meyer, L. (1870). Die Natur der chemischen Elemente als Function ihrer Atomgewichte. Annalen der Chemie, Supplementband 7, 354–364.','Scerri, E. (2007). The Periodic Table: Its Story and Its Significance. Oxford University Press.'],
 dur:12,hint:'Press each “?” gap to see what Mendeleev predicted and what was later found there.',
 init:()=>({gap:'al',shown:['al']}),
 watch(p){const k=['b','al','si'],i=Math.min(2,Math.floor(p*3.2));return {gap:k[i],shown:k.slice(0,i+1)}},
 ui:[{b:'Reset the gaps',act:'clear'}],
 on:{gap(s,k){s.gap=k;if(!s.shown.includes(k))s.shown=s.shown.concat(k);return 'keep'},clear(s){s.gap=null;s.shown=[];return 'keep'}},
 draw(s,f,X){
  let out=heading('Mendeleev’s 1871 table',26);
  out+=C3_mendTable(X,s,24,64,46,44);
  out+=TF(208,302,'groups I–VIII across · atomic weights as he used them',13,C.muted);
  if(s.gap){const g=C3_GAPS[s.gap],done=s.shown.includes(s.gap);
   out+=C3_card(406,52,184,g.name,['Predicted:',...g.pred.map(t=>'· '+t)],C.coral);
   if(done)out+=C3_card(406,172,184,g.found.split(',')[0],['Found '+g.found.split(', ')[1]+':',...g.real.map(t=>'· '+t)],C.green);
  }else out+=C3_card(406,52,184,'Three gaps',['Press a “?” to see','what he predicted.'],C.muted);
  return {svg:out,phase:s.gap?`Mendeleev left this place empty and gave its weight as about ${C3_GAPS[s.gap].w}. ${C3_GAPS[s.gap].found.split(',')[0]} later filled it, discovered by ${C3_GAPS[s.gap].by}.`:'The gaps are the boldest part of the table: places kept free for elements nobody had yet seen.'};
 }});

const C3_PRED={ga:{n:'Eka-aluminium → gallium',rows:[['Atomic weight','about 68','69.72',68,69.72],['Density (g/cm³)','about 5.9','5.90',5.9,5.904],['Melting point','low','29.8 °C',null,null],['Oxide formula','Ea₂O₃','Ga₂O₃',null,null]],
  story:['Lecoq de Boisbaudran first measured the','density as 4.7. Mendeleev wrote that it','should be near 5.9; purer metal gave 5.9.']},
 ge:{n:'Eka-silicon → germanium',rows:[['Atomic weight','about 72','72.63',72,72.63],['Density (g/cm³)','about 5.5','5.32',5.5,5.32],['Oxide formula','EsO₂','GeO₂',null,null],['Chloride boils','below 100 °C','about 86 °C',null,null]],
  story:['Clemens Winkler found germanium in the','mineral argyrodite in 1886. Its match to','eka-silicon convinced many sceptics.']}};
SCENE({id:'periodic-table-predictions',name:'Predictions tested',tag:'Eka-aluminium and eka-silicon',
 definition:'A good theory makes risky predictions. Mendeleev predicted the atomic weights, densities and compounds of elements nobody had seen, and the discoveries of gallium (1875) and germanium (1886) matched them closely.',
 example:'For eka-silicon he predicted an atomic weight of about 72 and a density of about 5.5 g/cm³. Germanium has 72.63 and 5.32 g/cm³: within about 1% and 4%.',
 desc:'A table of Mendeleev’s predictions beside the measured values for gallium or germanium, revealed row by row, with the percentage difference for each number. Measured values are modern ones.',
 research:['Mendeleev, D. (1871). Die periodische Gesetzmässigkeit der chemischen Elemente. Annalen der Chemie, Supplementband 8, 133–229.','Lecoq de Boisbaudran, P.-É. (1875). Caractères chimiques et spectroscopiques d’un nouveau métal, le gallium. Comptes rendus 81, 493–495.','Winkler, C. (1886). Germanium, Ge, ein neues, nichtmetallisches Element. Berichte der deutschen chemischen Gesellschaft 19, 210–211.','Brush, S. G. (1996). The reception of Mendeleev’s periodic law in America and Britain. Isis 87, 595–628.'],
 dur:10,hint:'Choose gallium or germanium and press each row to reveal what was measured.',
 init:()=>({el:'ge',rev:4}),
 watch(p){return {el:p<.5?'ga':'ge',rev:Math.min(4,Math.floor(((p*2)%1)*5.5))}},
 ui:[{choose:[['ga','Gallium'],['ge','Germanium']],label:'Element',get:s=>s.el,act:'el'},{b:'Hide the answers',act:'hide'}],
 on:{el(s,v){s.el=v;s.rev=0;return 'keep'},row(s,i){s.rev=Math.max(s.rev,Number(i)+1);return 'keep'},hide(s){s.rev=0;return 'keep'}},
 draw(s,f,X){
  const d=C3_PRED[s.el];let out=heading(d.n,26);
  out+=TBF(40,72,'Property',13,C.muted,'start')+TBF(250,72,'Predicted 1871',13,C.coral)+TBF(400,72,'Measured',13,C.green)+TBF(530,72,'Difference',13,C.muted);
  d.rows.forEach((r,i)=>{const y=84+i*46,shown=i<s.rev;
   out+=hit(X,'row',i,'Reveal '+r[0],R(28,y,546,40,shown?'#f6fbf9':'#fff',C.grid,8)+TF(40,y+25,r[0],14,C.ink,'start')+TF(250,y+25,r[1],14,C.coral)+TBF(400,y+25,shown?r[2]:'press to reveal',shown?14:13,shown?C.green:C.muted));
   if(shown&&r[3]!=null){const pc=Math.abs(r[4]-r[3])/r[4]*100;out+=TF(530,y+25,pc.toFixed(1)+'%',14,pc<2?C.green:C.amber)}
   else if(shown)out+=TF(530,y+25,'matches',14,C.green);
  });
  d.story.forEach((t,i)=>{out+=TF(40,288+i*19,t,13,C.ink,'start')});
  return {svg:out,phase:s.rev>=4?'Every number landed close to the prediction. Measured values here are modern ones; the first measurements were rougher, as gallium’s density shows.':'A prediction only counts if it is made before the discovery and could have failed.'};
 }});

SCENE({id:'periodic-table-trends',name:'Periodic law',tag:'Properties rise and fall in waves',
 definition:'The periodic law says that the properties of the elements repeat at intervals as you go through them in order. Lothar Meyer showed it in 1870 with a graph of atomic volume; first ionisation energy, the energy to pull off one electron, shows the same rhythm.',
 example:'Ionisation energy peaks at each noble gas (helium, neon, argon, krypton) and drops sharply to the next alkali metal (lithium, sodium, potassium).',
 desc:'First ionisation energy for elements 1 to 36, as a line with a marker you can move. The current element is named with its energy; alkali metals and noble gases can be highlighted.',
 research:['Meyer, L. (1870). Die Natur der chemischen Elemente als Function ihrer Atomgewichte. Annalen der Chemie, Supplementband 7, 354–364.','Kramida, A., Ralchenko, Yu., Reader, J. & NIST ASD Team. NIST Atomic Spectra Database, ionisation energies (rounded).'],
 dur:12,hint:'Move along the elements and watch the energy climb across each row and crash at each alkali metal.',
 init:()=>({z:11,hl:'both'}),
 watch(p){return {z:1+Math.round(p*35),hl:'both'}},
 ui:[{range:'z',label:'Element',min:1,max:36,step:1,get:s=>s.z,act:'z',show:v=>C3_SYM[v-1]},{choose:[['both','Highlight both'],['none','No highlight']],label:'Highlight',get:s=>s.hl,act:'hl'}],
 on:{z(s,v){s.z=Number(v);return 'keep'},hl(s,v){s.hl=v;return 'keep'}},
 trace(s){return {z:s.z,ie:C3_IE[s.z-1]}},
 draw(s){
  let out=heading('First ionisation energy, elements 1–36',26);
  const A=C3_axes(70,62,500,226,[1,36],[0,26],{xt:[[2,'He'],[10,'Ne'],[18,'Ar'],[36,'Kr']],yt:[[0,'0'],[10,'10'],[20,'20']],xl:'atomic number',yl:'eV'});out+=A.svg;
  out+=P(C3_path(C3_IE.map((v,i)=>[A.X(i+1),A.Y(v)])),C.line,2);
  C3_IE.forEach((v,i)=>{const z=i+1,alk=[3,11,19].includes(z),nob=[2,10,18,36].includes(z),col=s.hl==='both'&&alk?C.coral:s.hl==='both'&&nob?C.purple:C.blue;out+=Ci(A.X(z),A.Y(v),z===s.z?7:3.5,col)});
  const v=C3_IE[s.z-1];out+=L(A.X(s.z),A.Y(0),A.X(s.z),A.Y(v),C.ink,1.2,'stroke-dasharray="3 3"');
  const bx=A.X(s.z)>420?A.X(s.z)-170:A.X(s.z)+12;
  out+=R(bx,68,158,44,'#fff',C.grid,8)+TBF(bx+10,86,C3_SYM[s.z-1]+' · '+C3_NAME[s.z-1],13,C.ink,'start')+TF(bx+10,104,v.toFixed(2)+' eV',13,C.muted,'start');
  if(s.hl==='both')out+=Ci(80,342,5,C.purple)+TF(90,346,'noble gases',13,C.ink,'start')+Ci(200,342,5,C.coral)+TF(210,346,'alkali metals',13,C.ink,'start');
  const nob=[2,10,18,36].includes(s.z),alk=[3,11,19].includes(s.z);
  return {svg:out,phase:nob?`${C3_NAME[s.z-1][0].toUpperCase()+C3_NAME[s.z-1].slice(1)} is a noble gas: a full shell holds its electrons tightly, so the energy peaks.`:alk?`${C3_NAME[s.z-1][0].toUpperCase()+C3_NAME[s.z-1].slice(1)} starts a new row: one outer electron, far out and shielded, is easy to remove.`:'Across each row the energy tends to rise, with small dips; the same shape repeats row after row.'};
 }});

/* ---------- Lesson: noble-gases ---------- */
SCENE({id:'noble-gases',name:'Rayleigh’s heavy nitrogen',tag:'A 0.5% discrepancy finds argon',
 definition:'In 1892–94 Lord Rayleigh found that nitrogen taken from air was slightly denser than nitrogen made from chemicals. With William Ramsay he traced the difference to a new, unreactive gas making up about 1% of air: argon.',
 example:'A globe filled with nitrogen from air held 2.3102 g; filled with chemical nitrogen it held 2.2990 g. Taking argon’s heavier molecules into account, about 1.1% of the “air nitrogen” must have been argon.',
 desc:'Two balance pans with Rayleigh’s two masses, and a slider for how much argon is mixed into the air sample. The predicted mass of the globe moves until it matches the measured 2.3102 g.',
 research:['Rayleigh, Lord (1892). Density of nitrogen. Nature 46, 512–513.','Rayleigh, Lord & Ramsay, W. (1895). Argon, a new constituent of the atmosphere. Philosophical Transactions of the Royal Society A 186, 187–241.'],
 dur:11,hint:'Slide the argon share until the predicted globe matches Rayleigh’s measured 2.3102 g.',
 init:()=>({x:.5}),
 watch(p){return {x:Math.round(smooth(Math.min(1,p*1.3))*1.14*100)/100}},
 ui:[{range:'x',label:'Argon in the air sample (%)',min:0,max:3,step:.01,get:s=>s.x,act:'x',show:v=>Number(v).toFixed(2)+'%'}],
 on:{x(s,v){s.x=Number(v);return 'keep'}},
 trace(s){return {x:s.x}},
 draw(s){
  const chem=2.2990,meas=2.3102,mN2=28.013,mAr=39.948,pred=chem*((1-s.x/100)*mN2+s.x/100*mAr)/mN2,diff=pred-meas;
  let out=heading('Nitrogen from air is too heavy',26);
  const pan=(x,lab,val,col,sub)=>R(x,96,180,140,'#fff',C.grid,10)+TBF(x+90,122,lab,14,col)+TF(x+90,140,sub,13,C.muted)+TBF(x+90,186,val.toFixed(4)+' g',22,col)+TF(x+90,212,'mass of gas in the globe',13,C.muted);
  out+=pan(40,'Chemical nitrogen',chem,C.blue,'made from ammonia');
  out+=pan(380,'Nitrogen from air',meas,C.coral,'oxygen removed');
  out+=R(230,128,140,72,C.pale,'none',8)+TBF(300,156,'+'+(meas-chem).toFixed(4)+' g',15,C.ink)+TF(300,178,'about 0.5% heavier',13,C.muted);
  const ok=Math.abs(diff)<.0003;
  out+=R(40,254,520,84,ok?C.greenp:'#fff',ok?C.green:C.grid,10);
  out+=TF(60,280,`If the air sample is ${s.x.toFixed(2)}% argon (molar mass 39.95 against 28.01):`,13,C.ink,'start');
  out+=TBF(60,306,'predicted globe: '+pred.toFixed(4)+' g',15,ok?C.green:C.ink,'start')+TF(60,326,ok?'matches Rayleigh’s 2.3102 g':diff<0?'still too light: add argon':'too heavy: less argon',13,ok?C.green:C.amber,'start');
  out+=TF(540,306,'measured 2.3102 g',13,C.muted,'end');
  return {svg:out,phase:ok?'About 1.1% of the nitrogen from air is something heavier. Rayleigh and Ramsay isolated it in 1894 and called it argon, “the lazy one”, because it would not react.':'Rayleigh trusted a difference in the fourth decimal place, and that care found a new element.'};
 }});

// Bright emission lines in nm (visible, rounded): helium, sodium, neon, argon.
const C3_LINES={He:{n:'Helium',lines:[[447.1,'#5a4cff'],[471.3,'#3d6dff'],[492.2,'#00b8c6'],[501.6,'#22cc66'],[587.6,'#ffd400'],[667.8,'#e8001d']],note:['A yellow line at 587.6 nm was seen in the','Sun in 1868 (Janssen, Lockyer). Ramsay','found the same line in a uranium mineral, 1895.']},
 Na:{n:'Sodium',lines:[[589.0,'#ffb000'],[589.6,'#ffb000']],note:['Sodium’s famous D lines sit at 589.0 and','589.6 nm: close to helium’s yellow line,','but not the same. That is how D3 was new.']},
 Ne:{n:'Neon',lines:[[540.1,'#7fd400'],[585.2,'#ffcc00'],[588.2,'#ffb400'],[603.0,'#ff8a00'],[614.3,'#ff6a00'],[640.2,'#ff2a00'],[650.7,'#f10000'],[703.2,'#c80000']],note:['Ramsay and Travers found neon in 1898 by','distilling liquid air. Its crowd of red','lines gives neon signs their colour.']},
 Ar:{n:'Argon',lines:[[415.9,'#6a3cff'],[420.1,'#5c33ff'],[427.2,'#4a2cff'],[434.8,'#3f37ff'],[696.5,'#c40000'],[706.7,'#b20000']],note:['Argon has lines no other element has.','Crookes’s spectrum of it in 1895 helped','convince chemists it was a new element.']}};
SCENE({id:'noble-gases-spectra',name:'Helium in the Sun',tag:'An element found in sunlight first',
 definition:'Each element glows with its own set of coloured lines when heated. In 1868 a yellow line in the Sun matched no known element; it was named helium. In 1895 William Ramsay found the same line in gas from a uranium mineral on Earth.',
 example:'Sodium’s D lines are at 589.0 and 589.6 nm. The new solar line, called D3, is at 587.6 nm: close, but not sodium.',
 desc:'A visible spectrum from 400 to 700 nm with the bright lines of the chosen gas. Sodium’s lines can be compared with helium’s yellow line.',
 research:['Lockyer, J. N. (1869). Spectroscopic observations of the Sun. Proceedings of the Royal Society 17, 131–132.','Ramsay, W. (1895). On a gas showing the spectrum of helium, the reputed cause of D3. Proceedings of the Royal Society 58, 65–67.','Ramsay, W. & Travers, M. W. (1898). On the companions of argon. Proceedings of the Royal Society 63, 437–440.','Kramida, A. et al. NIST Atomic Spectra Database (line wavelengths, rounded).'],
 dur:12,hint:'Compare helium with sodium: the yellow lines are close but not the same.',
 init:()=>({g:'He',cmp:1}),
 watch(p){const k=['He','Na','Ne','Ar'];return {g:k[Math.min(3,Math.floor(p*4))],cmp:1}},
 ui:[{choose:[['He','Helium'],['Na','Sodium'],['Ne','Neon'],['Ar','Argon']],label:'Gas',get:s=>s.g,act:'g'},{choose:[[1,'Show helium’s D3'],[0,'Hide']],label:'Marker',get:s=>s.cmp,act:'cmp'}],
 on:{g(s,v){s.g=v;return 'keep'},cmp(s,v){s.cmp=Number(v);return 'keep'}},
 draw(s){
  const d=C3_LINES[s.g],x0=50,w=500,X=nm=>x0+(nm-400)/300*w;let out=heading(d.n+': its own fingerprint',26);
  for(let i=0;i<60;i++){const nm=400+i*5,h=Math.round(((nm-400)/300)*280);out+=R(X(nm),70,w/60+.5,22,`hsl(${280-h},70%,${78}%)`,'none',0)}
  out+=R(x0,100,w,120,'#111','none',6);
  d.lines.forEach(([nm,col])=>{out+=R(X(nm)-1.5,104,3,112,col,'none',0)});
  if(s.cmp)out+=L(X(587.6),96,X(587.6),226,'#fff',1,'stroke-dasharray="3 3"')+TF(X(587.6),242,'D3 587.6',13,C.ink);
  [400,450,500,550,600,650,700].forEach(nm=>{out+=TF(X(nm),262,String(nm),13,C.muted)});
  out+=TF(300,280,'wavelength (nm)',13,C.muted);
  d.note.forEach((t,i)=>{out+=TF(x0,306+i*19,t,13,C.ink,'start')});
  return {svg:out,phase:s.g==='Na'?'Sodium’s yellow pair sits about 1.5 nm away from D3: close to the eye, distinct to a spectroscope.':s.g==='He'?'Helium is the only element named after the Sun, and the only one detected in space before it was found on Earth.':'Spectra let chemists recognise elements from tiny samples, and showed the noble gases were new.'};
 }});

const C3_NOBLE=[['He','helium',24.59,-269],['Ne','neon',21.56,-246],['Ar','argon',15.76,-186],['Kr','krypton',14.00,-153],['Xe','xenon',12.13,-108]];
SCENE({id:'noble-gases-column',name:'A new column',tag:'Inert, but not quite',
 definition:'The noble gases did not fit any of Mendeleev’s groups, so the table gained a new column. Their full electron shells make them very unreactive. In 1962 Neil Bartlett showed they are not completely inert by making the first xenon compound.',
 example:'Bartlett had made O₂⁺PtF₆⁻ and noticed that xenon’s ionisation energy (12.13 eV) is almost the same as oxygen molecule’s (12.07 eV). He mixed xenon with PtF₆ and got an orange-yellow solid.',
 desc:'Bars for the five stable noble gases: first ionisation energy and boiling point. A marker shows the ionisation energy of the oxygen molecule, which Bartlett compared with xenon’s.',
 research:['Ramsay, W. (1904). The rare gases of the atmosphere. Nobel Lecture.','Bartlett, N. (1962). Xenon hexafluoroplatinate(V) Xe⁺[PtF₆]⁻. Proceedings of the Chemical Society, 218.','Kramida, A. et al. NIST Atomic Spectra Database (ionisation energies, rounded).'],
 dur:11,hint:'Choose a gas, then switch on Bartlett’s comparison with the oxygen molecule.',
 init:()=>({g:4,bart:1}),
 watch(p){return {g:Math.min(4,Math.floor(p*5)),bart:p>.7?1:0}},
 ui:[{range:'g',label:'Gas',min:0,max:4,step:1,get:s=>s.g,act:'g',show:v=>C3_NOBLE[v][1]},{choose:[[1,'Bartlett’s idea'],[0,'Hide']],label:'Compare',get:s=>s.bart,act:'bart'}],
 on:{g(s,v){s.g=Number(v);return 'keep'},bart(s,v){s.bart=Number(v);return 'keep'}},
 draw(s){
  let out=heading('The noble gases',26);
  const A=C3_axes(70,60,250,220,[0,5],[0,26],{yt:[[0,'0'],[12,'12'],[24,'24']],yl:'ionisation energy (eV)'});out+=A.svg;
  C3_NOBLE.forEach(([sy,n,ie],i)=>{const x=A.X(i+.2),wb=A.X(i+.8)-x;out+=R(x,A.Y(ie),wb,A.Y(0)-A.Y(ie),i===s.g?C.purple:tint(C.purple,.6),'none',3)+TBF(x+wb/2,A.Y(0)+16,sy,13,C.ink)});
  if(s.bart){const y=A.Y(12.07);out+=L(A.X(0),y,A.X(5),y,C.coral,2,'stroke-dasharray="5 4"')+L(70,322,96,322,C.coral,2,'stroke-dasharray="5 4"')+TF(102,326,'oxygen molecule O₂: 12.07 eV',13,C.coral,'start')}
  const [sy,n,ie,bp]=C3_NOBLE[s.g];
  out+=C3_card(350,62,230,n[0].toUpperCase()+n.slice(1)+' ('+sy+')',['ionisation energy '+ie.toFixed(2)+' eV','boils at −'+Math.abs(bp)+' °C'],C.purple);
  out+=C3_card(350,150,230,s.bart?'Bartlett, 1962':'Why so unreactive?',s.bart?['O₂ + PtF₆ → O₂⁺ PtF₆⁻ worked.','Xenon’s energy is almost','the same, so try Xe + PtF₆.','Result: the first noble-gas','compound.']:['A full outer shell holds','its electrons tightly.','Lower down, the outer','electrons are further out','and easier to remove.'],s.bart?C.coral:C.blue);
  return {svg:out,phase:s.bart?'Bartlett reasoned from a number: if PtF₆ can strip an electron from O₂, it can from xenon. Dozens of xenon and krypton compounds followed.':'Down the group the ionisation energy falls and the boiling point rises: heavier atoms hold their outer electrons less tightly and attract each other more.'};
 }});

/* ---------- Lesson: radioactivity ---------- */
// Marie Curie (1898): saturation currents in units of 10⁻¹¹ A for samples on a 8 cm plate.
const C3_CURIE=[['Uranium metal','pure, the reference',2.3,'the reference'],['Pitchblende','ore from Johanngeorgenstadt',8.3,'about 3.6 × uranium metal'],['Natural chalcolite','a uranium mineral',5.2,'more active than pure uranium'],['Lab-made chalcolite','same compound, pure chemicals',0.9,'less active, as its uranium predicts']];
SCENE({id:'radioactivity',name:'Something more active than uranium',tag:'Marie Curie measures rays',
 definition:'In 1896 Henri Becquerel found that uranium salts fog a photographic plate in the dark. Marie Curie measured this activity precisely with an electrometer designed by Pierre Curie and her own method, and found that some uranium ores were more active than pure uranium, so they had to hold a new, more active element.',
 example:'Natural chalcolite, a uranium mineral, gave 5.2 units of current. Chalcolite she made herself from pure chemicals gave only 0.9. The natural mineral had to contain something else: polonium and radium, announced in 1898.',
 desc:'An electrometer reading for each of four samples Marie Curie measured, in units of 10⁻¹¹ ampere, as she reported them, against the reading for uranium metal.',
 research:['Becquerel, H. (1896). Sur les radiations émises par phosphorescence. Comptes rendus 122, 420–421.','Curie, M. (1898). Rayons émis par les composés de l’uranium et du thorium. Comptes rendus 126, 1101–1103.','Curie, P. & Curie, M. (1898). Sur une substance nouvelle radio-active, contenue dans la pechblende. Comptes rendus 127, 175–178.','Curie, P., Curie, M. & Bémont, G. (1898). Sur une nouvelle substance fortement radio-active, contenue dans la pechblende. Comptes rendus 127, 1215–1217.'],
 dur:11,hint:'Measure each sample. Which ones are more active than their uranium can explain?',
 init:()=>({k:2,done:[0,1,2]}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {k,done:[0,1,2,3].slice(0,k+1)}},
 ui:[{b:'Clear readings',act:'clear'}],
 on:{k(s,i){i=Number(i);s.k=i;if(!s.done.includes(i))s.done=s.done.concat(i);return 'keep'},clear(s){s.done=[];s.k=-1;return 'keep'}},
 draw(s,f,X){
  let out=heading('Marie Curie’s measurements, 1898',26);
  const A=C3_axes(250,60,320,214,[0,9],[0,4],{xt:[[0,'0'],[3,'3'],[6,'6'],[9,'9']],xl:'current (× 10⁻¹¹ A)'});out+=A.svg;
  C3_CURIE.forEach(([n,sub,v,note],i)=>{const y=70+i*52,on=s.done.includes(i);
   out+=hit(X,'k',i,'Measure '+n,R(20,y,224,44,s.k===i?C.amberp:'#fff',s.k===i?C.amber:C.grid,8)+TBF(30,y+18,n,13,C.ink,'start')+TF(30,y+36,sub,13,C.muted,'start'));
   if(on)out+=R(A.X(0),y+12,A.X(v)-A.X(0),20,i===0?C.blue:v>2.3?C.coral:C.green,'none',3)+TF(A.X(v)+6,y+27,v.toFixed(1),13,C.ink,'start');
  });
  out+=L(A.X(2.3),62,A.X(2.3),274,C.blue,1.5,'stroke-dasharray="4 3"')+TF(A.X(2.3)+4,54,'uranium metal',13,C.blue,'start');
  const k=s.k>=0?C3_CURIE[s.k]:null;
  out+=TF(300,330,k?k[0]+': '+k[3]:'Press a sample to measure it.',14,C.ink);
  return {svg:out,phase:s.done.includes(2)&&s.done.includes(3)?'The natural mineral is about six times as active as the same compound made in the lab. Only a new element explains it.':'Activity depends on how much uranium a sample holds, unless something else is there too.'};
 }});

const C3_HALF={rn:['Radon-222',3.82,'days'],po:['Polonium-210',138,'days'],ra:['Radium-226',1600,'years'],c14:['Carbon-14',5730,'years']};
SCENE({id:'radioactivity-half-life',name:'Half-life',tag:'Half the atoms, every time',
 definition:'Each radioactive atom has a fixed chance of decaying in a given time, so a large sample shrinks by half every half-life, whatever its size. Ernest Rutherford and Frederick Soddy showed in 1902–03 that radioactivity is atoms changing into other elements. Harriet Brooks’s work on the radioactive gas given off by radium and thorium, and Lise Meitner and Otto Hahn’s discovery of protactinium (1918), helped fill in the chains of change.',
 example:'Radon-222 has a half-life of 3.82 days. After about 7.6 days a quarter is left; after 38 days, about one atom in a thousand.',
 desc:'A grid of 100 atoms with a seeded random decay order, and the expected curve (½)^(t/half-life). Time is in half-lives, with the chosen isotope converting it to days or years.',
 research:['Rutherford, E. & Soddy, F. (1902). The cause and nature of radioactivity. Philosophical Magazine 4, 370–396 and 569–585.','Rutherford, E. & Soddy, F. (1903). Radioactive change. Philosophical Magazine 5, 576–591.','Brooks, H. (1904). A volatile product from radium. Nature 70, 270.','Hahn, O. & Meitner, L. (1918). Die Muttersubstanz des Actiniums, ein neues radioaktives Element von langer Lebensdauer. Physikalische Zeitschrift 19, 208–218.','Half-lives: NNDC, National Nuclear Data Center (rounded).'],
 dur:12,hint:'Move time forward in half-lives. The grid is random atom by atom, but the curve is not.',
 init:()=>({t:1,iso:'rn'}),
 watch(p){return {t:Math.round(p*5*4)/4,iso:'rn'}},
 ui:[{range:'t',label:'Time (half-lives)',min:0,max:5,step:.25,get:s=>s.t,act:'t',show:v=>Number(v).toFixed(2)},{choose:[['rn','Radon-222'],['po','Polonium-210'],['ra','Radium-226'],['c14','Carbon-14']],label:'Isotope',get:s=>s.iso,act:'iso'}],
 on:{t(s,v){s.t=Number(v);return 'keep'},iso(s,v){s.iso=v;return 'keep'}},
 trace(s){return {t:s.t}},
 draw(s){
  const r=rng(77),life=range(100).map(()=>-Math.log(1-r()*.999)/Math.LN2),left=life.filter(v=>v>s.t).length,[nm,h,unit]=C3_HALF[s.iso];
  let out=heading(nm+': half-life '+h+' '+unit,26);
  for(let i=0;i<100;i++){const x=40+(i%10)*24,y=60+Math.floor(i/10)*24,alive=life[i]>s.t;out+=Ci(x+10,y+10,8,alive?C.amber:'#e3e9ee',alive?'none':C.grid)}
  out+=TBF(160,320,left+' of 100 still undecayed',14,C.ink);
  const A=C3_axes(330,62,240,212,[0,5],[0,100],{xt:[[0,'0'],[1,'1'],[2,'2'],[3,'3'],[4,'4'],[5,'5']],yt:[[0,'0'],[50,'50'],[100,'100']],xl:'half-lives',yl:'atoms left'});out+=A.svg;
  out+=P(C3_path(range(51).map(i=>[A.X(i/10),A.Y(100*Math.pow(.5,i/10))])),C.blue,2.5);
  out+=Ci(A.X(s.t),A.Y(left),6,C.amber,C.ink);
  const tt=s.t*h;out+=TF(450,330,'= '+(tt<10?tt.toFixed(2):Math.round(tt).toLocaleString('en-GB'))+' '+unit,14,C.muted);
  return {svg:out,phase:`Expected after ${s.t} half-lives: ${(100*Math.pow(.5,s.t)).toFixed(1)} atoms. Real samples hold so many atoms that they follow the curve almost exactly.`};
 }});

SCENE({id:'radioactivity-rays',name:'Three kinds of ray',tag:'Alpha, beta and gamma',
 definition:'Rutherford named two kinds of radiation in 1899: alpha, stopped by paper, and beta, which passes through thin metal. Paul Villard found a third, gamma, in 1900. A magnetic field bends alpha and beta in opposite directions, showing opposite charges; gamma goes straight.',
 example:'Alpha particles are helium nuclei, which Rutherford and Royds confirmed in 1909 by collecting the helium. Beta particles are electrons. Gamma rays are light of very short wavelength.',
 desc:'Three beams from a source pass through a magnetic field and then a barrier of paper, aluminium or lead. The bending in the field is exaggerated for clarity; alpha bends far less than beta in reality.',
 research:['Rutherford, E. (1899). Uranium radiation and the electrical conduction produced by it. Philosophical Magazine 47, 109–163.','Villard, P. (1900). Sur la réflexion et la réfraction des rayons cathodiques et des rayons déviables du radium. Comptes rendus 130, 1010–1012.','Rutherford, E. & Royds, T. (1909). The nature of the α particle from radioactive substances. Philosophical Magazine 17, 281–286.'],
 dur:11,hint:'Switch the magnetic field on, then try each barrier and see which rays get through.',
 init:()=>({bar:'paper',mag:1}),
 watch(p){const b=['none','paper','al','lead'];return {bar:b[Math.min(3,Math.floor(p*4))],mag:1}},
 ui:[{choose:[['none','No barrier'],['paper','Paper'],['al','Aluminium'],['lead','Lead']],label:'Barrier',get:s=>s.bar,act:'bar'},{choose:[[1,'Field on'],[0,'Field off']],label:'Magnet',get:s=>s.mag,act:'mag'}],
 on:{bar(s,v){s.bar=v;return 'keep'},mag(s,v){s.mag=Number(v);return 'keep'}},
 draw(s){
  let out=heading('Alpha, beta and gamma',26);
  out+=R(30,170,50,40,'#5a6b75','none',6)+TF(55,228,'source',13,C.muted);
  if(s.mag)out+=R(110,70,180,240,'#eef1fb',C.purple,8,'stroke-dasharray="4 3"')+TF(200,90,'magnetic field',13,C.purple);
  const stop={none:[1,1,1],paper:[0,1,1],al:[0,0,1],lead:[0,0,.3]}[s.bar];
  const bx=380;if(s.bar!=='none'){const col={paper:'#f4ecd8',al:'#c9d3db',lead:'#7a828a'}[s.bar];out+=R(bx,60,s.bar==='lead'?26:14,260,col,C.ink,3)+TF(bx+10,338,{paper:'paper',al:'aluminium',lead:'lead'}[s.bar],13,C.ink)}
  const rays=[['alpha','α (+)',C.coral,s.mag?-38:0],['beta','β (−)',C.blue,s.mag?90:0],['gamma','γ',C.green,0]];
  rays.forEach(([k,lab,col,bend],i)=>{const yEnd=190+bend,gets=stop[i];
   const pts=range(21).map(j=>{const x=80+j*15,u=Math.max(0,Math.min(1,(x-110)/180));return [x,190+bend*u*u]});
   out+=P(C3_path(pts),col,3);
   if(gets){out+=P(`M${bx+28} ${fmt(yEnd)}L560 ${fmt(yEnd)}`,col,gets<1?1.5:3,'none',gets<1?'stroke-dasharray="4 4"':'');out+=TBF(566,yEnd+5,lab,14,col,'start')}
   else out+=Ci(bx-4,yEnd,5,col)+TBF(bx-12,yEnd-8,lab,13,col,'end');
  });
  out+=TF(300,360,s.bar==='lead'?'Lead weakens gamma but does not stop it all.':s.bar==='al'?'Only gamma passes a few mm of aluminium.':s.bar==='paper'?'A sheet of paper stops alpha.':'Without a barrier all three reach the far side.',14,C.ink);
  return {svg:out,phase:s.mag?'Alpha and beta bend opposite ways, so they carry opposite charges; gamma is not bent, so it is uncharged.':'With the field off, the three rays cannot be told apart by their paths, only by what stops them.'};
 }});

/* ---------- Lesson: atomic-number ---------- */
const C3_RC=3.2898e15; // Rydberg frequency in Hz
SCENE({id:'atomic-number',name:'Moseley’s X-rays',tag:'Counting the elements',
 definition:'In 1913 Henry Moseley measured the X-rays given off by different elements. The square root of the frequency of the main line rose in exact steps from one element to the next. The steps gave every element a whole number, its atomic number Z: the charge on its nucleus.',
 example:'Moseley’s rule for the main (Kα) line is frequency ≈ ¾ × 3.29 × 10¹⁵ Hz × (Z − 1)². For copper, Z = 29, that gives a wavelength of about 0.155 nm; the measured line is 0.154 nm.',
 desc:'A slider through calcium (Z = 20) to zinc (Z = 30). The plot shows the square root of the Kα frequency against Z: a straight line. The wavelength from Moseley’s rule is shown for the chosen element.',
 research:['Moseley, H. G. J. (1913). The high-frequency spectra of the elements. Philosophical Magazine 26, 1024–1034.','Moseley, H. G. J. (1914). The high-frequency spectra of the elements. Part II. Philosophical Magazine 27, 703–713.','Heilbron, J. L. (1974). H. G. J. Moseley: The Life and Letters of an English Physicist, 1887–1915. University of California Press.'],
 dur:11,hint:'Move along the elements: each step adds one to Z and one equal step to the root of the frequency.',
 init:()=>({z:29}),
 watch(p){return {z:20+Math.round(p*10)}},
 ui:[{range:'z',label:'Element',min:20,max:30,step:1,get:s=>s.z,act:'z',show:v=>C3_SYM[v-1]+' (Z = '+v+')'}],
 on:{z(s,v){s.z=Number(v);return 'keep'}},
 trace(s){return {z:s.z}},
 draw(s){
  const nu=z=>.75*C3_RC*(z-1)*(z-1),rt=z=>Math.sqrt(nu(z))/1e8;
  let out=heading('Moseley’s law: one step per element',26);
  const A=C3_axes(80,60,300,230,[19,31],[8,15.5],{xt:[[20,'20'],[25,'25'],[30,'30']],yt:[[9,'9'],[12,'12'],[15,'15']],xl:'atomic number Z',yl:'√frequency (× 10⁸ √Hz)'});out+=A.svg;
  out+=L(A.X(19.5),A.Y(rt(19.5)),A.X(30.5),A.Y(rt(30.5)),C.line,2);
  for(let z=20;z<=30;z++)out+=Ci(A.X(z),A.Y(rt(z)),z===s.z?7:4,z===s.z?C.coral:C.blue);
  const lam=2.998e8/nu(s.z)*1e9;
  out+=C3_card(400,64,180,C3_SYM[s.z-1]+' · '+C3_NAME[s.z-1],['Z = '+s.z,'Kα ≈ '+(nu(s.z)/1e18).toFixed(2)+' × 10¹⁸ Hz','wavelength ≈ '+lam.toFixed(3)+' nm'],C.coral);
  out+=TF(490,200,'Moseley died at Gallipoli',13,C.muted)+TF(490,218,'in 1915, aged 27.',13,C.muted);
  return {svg:out,phase:'The straight line means each element has exactly one more unit of nuclear charge than the one before: atomic number is a count, not a guess.'};
 }});

const C3_PAIRS=[['Ar','K',39.95,39.10,18,19,'Argon is heavier than potassium, yet must come first: argon is a noble gas, potassium an alkali metal.'],['Co','Ni',58.93,58.69,27,28,'Cobalt is slightly heavier than nickel; Moseley’s X-rays confirmed cobalt comes first.'],['Te','I',127.60,126.90,52,53,'Tellurium is heavier than iodine, but iodine clearly belongs with chlorine and bromine.']];
const C3_MISSING=[[43,'Tc','technetium','1937, made in a cyclotron'],[61,'Pm','promethium','1945, from fission products'],[72,'Hf','hafnium','1923, Coster and von Hevesy'],[75,'Re','rhenium','1925, Noddack, Tacke and Berg']];
SCENE({id:'atomic-number-gaps',name:'Order fixed, gaps counted',tag:'What atomic number settled',
 definition:'Ordering by atomic weight had three awkward swaps, which chemists made on chemical grounds. Atomic number confirmed every one of them, and showed exactly how many elements were still missing between hydrogen and uranium.',
 example:'Moseley’s method left gaps at Z = 43, 61, 72 and 75. Hafnium (72) was found in 1923 by Dirk Coster and George de Hevesy, who looked for its X-ray lines because the gap told them where to look.',
 desc:'Choose a pair ordered wrongly by weight, or show the missing atomic numbers of 1914 and when each was filled.',
 research:['Moseley, H. G. J. (1914). The high-frequency spectra of the elements. Part II. Philosophical Magazine 27, 703–713.','Coster, D. & Hevesy, G. (1923). On the missing element of atomic number 72. Nature 111, 79.','Noddack, W., Tacke, I. & Berg, O. (1925). Die Ekamangane. Naturwissenschaften 13, 567–574.','Perrier, C. & Segrè, E. (1937). Some chemical properties of element 43. Journal of Chemical Physics 5, 712–716.'],
 dur:12,hint:'Look at each swapped pair, then switch to the gaps of 1914.',
 init:()=>({v:'0'}),
 watch(p){const k=['0','1','2','gaps'];return {v:k[Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:[['0','Ar · K'],['1','Co · Ni'],['2','Te · I'],['gaps','Gaps in 1914']],label:'Show',get:s=>s.v,act:'v'}],
 on:{v(s,v){s.v=v;return 'keep'}},
 draw(s){
  let out=heading(s.v==='gaps'?'The gaps of 1914':'Weight says one thing, Z another',26);
  if(s.v!=='gaps'){const [a,b,wa,wb,za,zb,why]=C3_PAIRS[Number(s.v)];
   const cell=(x,sym,w,z,col)=>R(x,70,118,130,'#fff',col,10)+TBF(x+59,124,sym,34,col)+TF(x+59,156,'weight '+w.toFixed(2),13,C.ink)+TBF(x+59,180,'Z = '+z,15,col);
   out+=TBF(146,60,'by atomic weight',13,C.muted)+TBF(454,60,'by atomic number',13,C.muted);
   out+=cell(24,b,wb,zb,C.amber)+cell(150,a,wa,za,C.amber);
   out+=cell(332,a,wa,za,C.green)+cell(458,b,wb,zb,C.green);
   out+=arrow(280,135,322,135,C.muted,2.5);
   const words=why.split(' ');let line='',ly=240;const lines=[];for(const w of words){if((line+' '+w).length>62){lines.push(line);line=w}else line=line?line+' '+w:w}lines.push(line);
   lines.forEach((t,i)=>{out+=TF(300,ly+i*20,t,14,C.ink)});
  }else{
   for(let z=40;z<=79;z++){const i=z-40,x=30+(i%20)*27,y=70+Math.floor(i/20)*60,miss=C3_MISSING.find(m=>m[0]===z);
    out+=R(x,y,24,40,miss?C.coralp:C.pale,miss?C.coral:'none',4)+TF(x+12,y+25,String(z),13,miss?C.coral:C.ink)}
   C3_MISSING.forEach(([z,sym,n,when],i)=>{out+=TBF(40,226+i*24,z+' '+sym,14,C.coral,'start')+TF(110,226+i*24,n+': '+when,13,C.ink,'start')});
  }
  return {svg:out,phase:s.v==='gaps'?'Atomic number turned “how many elements are there?” into a question with a definite answer: 92 up to uranium, with only a few places then empty: the four shown here, and 85 and 87 further on.':'Chemistry put these pairs in the right order before physics could say why; atomic number explained it.'};
 }});

SCENE({id:'atomic-number-nucleus',name:'Z is the nuclear charge',tag:'Protons, and later neutrons',
 definition:'Antonius van den Broek proposed in 1913 that an element’s place in the table equals the charge on its nucleus. Moseley’s X-rays confirmed it. James Chadwick’s discovery of the neutron in 1932 explained why atoms weigh roughly twice their atomic number: the nucleus also holds uncharged neutrons.',
 example:'Carbon has Z = 6: six protons and, in carbon-12, six neutrons, mass number 12. Hydrogen-1 is the exception, with no neutron at all.',
 desc:'A nucleus for elements 1–20 of their most common isotope, with protons (coral) and neutrons (grey), and bars comparing Z with the mass number.',
 research:['van den Broek, A. (1913). Die Radioelemente, das periodische System und die Konstitution der Atome. Physikalische Zeitschrift 14, 32–41.','Chadwick, J. (1932). Possible existence of a neutron. Nature 129, 312.','Mass numbers of the most abundant isotopes: IUPAC (CIAAW).'],
 dur:10,hint:'Step through the elements and compare the number of protons with the mass number.',
 init:()=>({z:6}),
 watch(p){return {z:1+Math.round(p*19)}},
 ui:[{range:'z',label:'Element',min:1,max:20,step:1,get:s=>s.z,act:'z',show:v=>C3_SYM[v-1]}],
 on:{z(s,v){s.z=Number(v);return 'keep'}},
 draw(s){
  const A=[1,4,7,9,11,12,14,16,19,20,23,24,27,28,31,32,35,40,39,40][s.z-1],n=A-s.z,r=rng(s.z*13);
  let out=heading(C3_NAME[s.z-1][0].toUpperCase()+C3_NAME[s.z-1].slice(1)+'-'+A,26);
  const tot=A,rad=Math.sqrt(tot)*9+6,cx=170,cy=190,items=[];
  for(let i=0;i<tot;i++){const a=i*2.39996,d=Math.sqrt((i+.5)/tot)*rad*.88;items.push([cx+Math.cos(a)*d,cy+Math.sin(a)*d])}
  const order=shuffled(range(tot),s.z+5);
  items.forEach((p,i)=>{const isP=order[i]<s.z;out+=Ci(p[0],p[1],8,isP?C.coral:'#9aa7b0','#fff','stroke-width="1"')});
  out+=TF(cx,330,s.z+' protons · '+n+' neutron'+(n===1?'':'s'),14,C.ink);
  const bx=350;out+=TBF(bx,80,'Atomic number Z',13,C.coral,'start')+R(bx,88,Math.max(2,s.z*5.5),20,C.coral,'none',3)+TF(bx+s.z*5.5+6,103,String(s.z),13,C.ink,'start');
  out+=TBF(bx,140,'Mass number A',13,C.muted,'start')+R(bx,148,A*5.5,20,'#9aa7b0','none',3)+TF(bx+A*5.5+6,163,String(A),13,C.ink,'start');
  out+=C3_card(bx,200,230,'Ratio A / Z',[(A/s.z).toFixed(2),s.z===1?'hydrogen-1 has no neutron':'close to 2 for light elements'],C.blue);
  return {svg:out,phase:'Z, the number of protons, fixes the chemistry. Neutrons add mass without changing the element, which is why atomic weights were never exactly whole multiples.'};
 }});

/* ---------- Lesson: isotopes ---------- */
const C3_CHAIN=[['U',238,92,'α'],['Th',234,90,'β'],['Pa',234,91,'β'],['U',234,92,'α'],['Th',230,90,'α'],['Ra',226,88,'α'],['Rn',222,86,'α'],['Po',218,84,'α'],['Pb',214,82,'β'],['Bi',214,83,'β'],['Po',214,84,'α'],['Pb',210,82,'β'],['Bi',210,83,'β'],['Po',210,84,'α'],['Pb',206,82,'']];
SCENE({id:'isotopes',name:'Same place, different weights',tag:'Soddy’s displacement law',
 definition:'By 1913 dozens of radioactive “elements” were known but there was no room for them all in the table. Frederick Soddy realised that many were chemically identical forms of the same element with different weights. He called them isotopes, from Greek for “same place”. Alpha decay moves an atom two places down the table; beta decay moves it one place up.',
 example:'Uranium-238 decays through 8 alpha and 6 beta steps to lead-206. Along the way it passes through uranium-234 and three different isotopes of lead: 214, 210 and 206.',
 desc:'The uranium-238 decay chain drawn on a chart of mass number against atomic number. Each step lights in turn; alpha steps go down and left by 4 and 2, beta steps go right by 1.',
 research:['Soddy, F. (1913). Intra-atomic charge. Nature 92, 399–400.','Soddy, F. (1913). The radio-elements and the periodic law. Chemical News 107, 97–99.','Fajans, K. (1913). Die radioaktiven Umwandlungen und das periodische System der Elemente. Berichte der deutschen chemischen Gesellschaft 46, 422–439.'],
 dur:14,hint:'Step through the chain. Count the alpha and beta steps, and look for elements visited twice.',
 init:()=>({k:4}),
 watch(p){return {k:Math.min(14,Math.floor(p*15))}},
 ui:[{range:'k',label:'Step',min:0,max:14,step:1,get:s=>s.k,act:'k',show:v=>C3_CHAIN[v][0]+'-'+C3_CHAIN[v][1]}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 trace(s){return {k:s.k}},
 draw(s){
  let out=heading('Uranium-238 to lead-206',26);
  const A=C3_axes(70,58,330,250,[81,93],[204,240],{xt:[[82,'82 Pb'],[86,'86 Rn'],[90,'90 Th'],[92,'92 U']],yt:[[206,'206'],[222,'222'],[238,'238']],xl:'atomic number Z',yl:'mass number A'});out+=A.svg;
  for(let i=0;i<s.k;i++){const a=C3_CHAIN[i],b=C3_CHAIN[i+1];out+=arrow(A.X(a[2]),A.Y(a[1]),A.X(b[2]),A.Y(b[1]),a[3]==='α'?C.coral:C.blue,2,7)}
  C3_CHAIN.forEach((c,i)=>{if(i<=s.k)out+=Ci(A.X(c[2]),A.Y(c[1]),i===s.k?7:4.5,i===s.k?C.amber:C.ink)});
  const al=C3_CHAIN.slice(0,s.k).filter(c=>c[3]==='α').length,be=C3_CHAIN.slice(0,s.k).filter(c=>c[3]==='β').length,c=C3_CHAIN[s.k];
  out+=C3_card(420,62,164,c[0]+'-'+c[1],['Z = '+c[2]+', A = '+c[1],'alpha steps so far: '+al,'beta steps so far: '+be],C.amber);
  out+=Ci(430,212,5,C.coral)+TF(440,216,'α: A − 4, Z − 2',13,C.ink,'start')+Ci(430,236,5,C.blue)+TF(440,240,'β: Z + 1',13,C.ink,'start');
  return {svg:out,phase:s.k===14?'8 alpha and 6 beta steps: 238 − 8 × 4 = 206, and 92 − 16 + 6 = 82. Lead-206 is stable, so the chain stops.':'Uranium, thorium, polonium, bismuth and lead each appear more than once, with different masses: isotopes.'};
 }});

SCENE({id:'isotopes-aston',name:'Aston’s mass spectrograph',tag:'Why chlorine weighs 35.45',
 definition:'In 1913 J. J. Thomson found that neon has two kinds of atom, of mass 20 and 22. In 1919 Francis Aston built a mass spectrograph that sorted ions by mass, and found that most elements are mixtures of isotopes whose masses are close to whole numbers.',
 example:'Chlorine’s atomic weight, 35.45, is not a whole number because natural chlorine is about 75.8% chlorine-35 and 24.2% chlorine-37.',
 desc:'Two peaks for chlorine-35 and chlorine-37, with a slider for the share of chlorine-37. The weighted average is compared with chlorine’s measured atomic weight.',
 research:['Thomson, J. J. (1913). Rays of positive electricity. Proceedings of the Royal Society A 89, 1–20.','Aston, F. W. (1919). A positive ray spectrograph. Philosophical Magazine 38, 707–714.','Aston, F. W. (1919). The constitution of the elements. Nature 104, 393.','IUPAC CIAAW, isotopic compositions of the elements (chlorine).'],
 dur:10,hint:'Slide the share of chlorine-37 until the average matches 35.45.',
 init:()=>({p37:10}),
 watch(p){return {p37:Math.round(smooth(Math.min(1,p*1.3))*24.2*10)/10}},
 ui:[{range:'p37',label:'Chlorine-37 share (%)',min:0,max:50,step:.1,get:s=>s.p37,act:'p37',show:v=>Number(v).toFixed(1)+'%'}],
 on:{p37(s,v){s.p37=Number(v);return 'keep'}},
 trace(s){return {p37:s.p37}},
 draw(s){
  const m35=34.969,m37=36.966,avg=(1-s.p37/100)*m35+s.p37/100*m37,ok=Math.abs(avg-35.45)<.006;
  let out=heading('Chlorine in a mass spectrograph',26);
  const A=C3_axes(80,60,300,220,[33,39],[0,100],{xt:[[34,'34'],[35,'35'],[36,'36'],[37,'37'],[38,'38']],yt:[[0,'0'],[50,'50'],[100,'100']],xl:'mass',yl:'share (%)'});out+=A.svg;
  out+=R(A.X(35)-10,A.Y(100-s.p37),20,A.Y(0)-A.Y(100-s.p37),C.blue,'none',3)+R(A.X(37)-10,A.Y(s.p37),20,A.Y(0)-A.Y(s.p37),C.coral,'none',3);
  out+=L(A.X(avg),A.Y(0),A.X(avg),A.Y(100),C.ink,2,'stroke-dasharray="4 3"')+TF(A.X(avg),A.Y(100)-6,'average',13,C.ink);
  out+=C3_card(400,64,184,'Weighted average',['35-Cl: 34.969 × '+(1-s.p37/100).toFixed(3),'37-Cl: 36.966 × '+(s.p37/100).toFixed(3),'average = '+avg.toFixed(3)],ok?C.green:C.blue);
  out+=TF(492,200,'measured atomic weight',13,C.muted)+TBF(492,222,'35.45',18,C.green);
  out+=TF(492,250,ok?'match: about 24.2% is 37-Cl':'not yet a match',13,ok?C.green:C.amber);
  return {svg:out,phase:ok?'Natural chlorine is about three atoms of chlorine-35 to one of chlorine-37. The non-whole atomic weight is an average, not a strange atom.':'Each isotope’s mass is close to a whole number; only the mixture gives 35.45.'};
 }});

const C3_USES={tracer:['Isotopes as tracers, 1923','George de Hevesy put a little','radioactive lead into bean plants','and followed it from root to leaf.','His tracer idea won the 1943','Nobel Prize in Chemistry.'],
 deut:['Heavy hydrogen, 1931','Harold Urey found deuterium,','hydrogen with a neutron, by','evaporating liquid hydrogen and','spotting faint extra spectral lines.','Nobel Prize in Chemistry, 1934.'],
 date:['Carbon dating, 1949','Willard Libby used carbon-14','(half-life 5,730 years) to date','once-living things up to about','50,000 years old. Nobel Prize','in Chemistry, 1960.']};
SCENE({id:'isotopes-uses',name:'Isotopes as tools',tag:'Tracers, heavy water and dating',
 definition:'Because isotopes of an element behave almost identically in chemistry but can be told apart by mass or radioactivity, they became tools: tracers to follow atoms through living things, and clocks for dating.',
 example:'De Hevesy’s idea of a tracer is now used in hospital scans, where a small amount of a radioactive isotope shows where it collects in the body.',
 desc:'Three cards on how isotopes were turned into tools, with a picture for each: a plant taking up a tracer, the two hydrogen isotopes, and a carbon-14 decay curve.',
 research:['Hevesy, G. (1923). The absorption and translocation of lead by plants. Biochemical Journal 17, 439–445.','Urey, H. C., Brickwedde, F. G. & Murphy, G. M. (1932). A hydrogen isotope of mass 2. Physical Review 39, 164–165.','Arnold, J. R. & Libby, W. F. (1949). Age determination by radiocarbon content: checks with samples of known age. Science 110, 678–680.'],
 dur:9,hint:'Press each use to see how isotopes became tools.',
 init:()=>({u:'tracer'}),
 watch(p){return {u:['tracer','deut','date'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['tracer','Tracer'],['deut','Deuterium'],['date','Dating']],label:'Use',get:s=>s.u,act:'u'}],
 on:{u(s,v){s.u=v;return 'keep'}},
 draw(s){
  const d=C3_USES[s.u];let out=heading(d[0],26);
  d.slice(1).forEach((t,i)=>{out+=TF(330,90+i*22,t,13,C.ink,'start')});
  if(s.u==='tracer'){out+=P('M160 300V150',C.green,4)+P('M160 220Q120 200 100 170M160 190Q200 170 220 140M160 160Q140 130 150 110',C.green,3);for(let i=0;i<9;i++){const t=i/8;out+=Ci(160+Math.sin(i)*6,300-t*150,4,C.coral)}out+=R(110,300,100,30,'#c9b48a','none',4)+TF(160,350,'roots in water with lead-212',13,C.muted)}
  else if(s.u==='deut'){const atom=(x,lab,neu)=>Ci(x,180,9,C.coral)+(neu?Ci(x+12,180,9,'#9aa7b0'):'')+`<circle cx="${x+(neu?6:0)}" cy="180" r="48" fill="none" stroke="${C.line}" stroke-dasharray="4 4"/>`+Ci(x+(neu?6:0)+48,180,5,C.blue)+TF(x+(neu?6:0),262,lab,13,C.ink);out+=atom(110,'hydrogen-1',0)+atom(240,'deuterium',1)}
  else{const A=C3_axes(60,90,240,180,[0,30000],[0,100],{xt:[[0,'0'],[11460,'11,460'],[28650,'28,650']],yt:[[0,'0'],[50,'50'],[100,'100']],xl:'years',yl:'% left'});out+=A.svg+P(C3_path(range(31).map(i=>[A.X(i*1000),A.Y(100*Math.pow(.5,i*1000/5730))])),C.coral,2.5)+Ci(A.X(5730),A.Y(50),5,C.ink)+TF(A.X(5730)+6,A.Y(50)-6,'5,730 years',13,C.ink,'start')}
  return {svg:out,phase:'Soddy’s idea that one element can come in several weights opened the way to tracers, heavy water and radiocarbon dating.'};
 }});

/* ---------- Lesson: electron-shells ---------- */
function C3_shells(z){const caps=[2,8,8,2];const out=[];let left=z;for(const c of caps){if(left<=0)break;out.push(Math.min(c,left));left-=c}return out}
SCENE({id:'electron-shells',name:'Electron shells',tag:'Rows of 2, 8 and 8',
 definition:'Niels Bohr’s 1913 model put electrons in shells around the nucleus. Gilbert Lewis and Irving Langmuir used shells to explain chemistry: atoms with a full outer shell are inert, and atoms gain, lose or share electrons to reach one. The first rows of the table hold 2, then 8, then 8 elements. The first two shells hold 2 and 8, but the third shell can hold 18: the third row ends at 8 because the 4s subshell fills before 3d (next scene).',
 example:'Sodium (Z = 11) has shells 2, 8, 1: one outer electron, easily lost, like lithium (2, 1) and potassium (2, 8, 8, 1). Chlorine (2, 8, 7) is one short of a full shell and easily takes one.',
 desc:'A shell diagram for elements 1–20, with outer electrons in coral, the shell counts, and the group the element belongs to. The 3D view shows the shells as nested spheres. This simple picture works up to calcium; heavier elements need subshells.',
 research:['Bohr, N. (1913). On the constitution of atoms and molecules. Philosophical Magazine 26, 1–25.','Lewis, G. N. (1916). The atom and the molecule. Journal of the American Chemical Society 38, 762–785.','Langmuir, I. (1919). The arrangement of electrons in atoms and molecules. Journal of the American Chemical Society 41, 868–934.'],
 dur:12,hint:'Step through the elements. Watch the outer shell refill at lithium, sodium and potassium.',
 init:()=>({z:11}),
 watch(p){return {z:1+Math.round(p*19)}},
 ui:[{range:'z',label:'Element',min:1,max:20,step:1,get:s=>s.z,act:'z',show:v=>C3_SYM[v-1]+' (Z = '+v+')'}],
 on:{z(s,v){s.z=Number(v);return 'keep'}},
 trace(s){return {z:s.z}},
 draw(s){
  const sh=C3_shells(s.z),cx=170,cy=196;let out=heading(C3_NAME[s.z-1][0].toUpperCase()+C3_NAME[s.z-1].slice(1)+': '+sh.join(', '),26);
  out+=Ci(cx,cy,16,C.coral)+TBF(cx,cy+5,s.z+'+',13,'#fff');
  sh.forEach((n,i)=>{const r=40+i*34,outer=i===sh.length-1;out+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.line}" stroke-width="1.5"/>`;
   for(let j=0;j<n;j++){const a=-Math.PI/2+j/n*Math.PI*2;out+=Ci(cx+Math.cos(a)*r,cy+Math.sin(a)*r,6,outer?C.coral:C.blue)}});
  const val=sh[sh.length-1],full=[2,10,18].includes(s.z),grp=full?'noble gas (full shell)':val+' outer electron'+(val>1?'s':'');
  out+=C3_card(360,64,220,'Shells '+sh.join(' · '),[grp,full?'very unreactive':val<=3?'tends to lose '+val:val===4?'tends to share 4':'tends to gain '+(8-val),'period '+sh.length],C.coral);
  const same=[[1,3,11,19],[2,10,18],[4,12,20],[9,17],[8,16],[6,14]].find(g=>g.includes(s.z));
  if(same&&same.length>1)out+=TF(470,200,'Same outer pattern:',13,C.muted)+TBF(470,220,same.map(z=>C3_SYM[z-1]).join(' · '),15,C.ink);
  return {svg:out,phase:full?'A full outer shell: the noble gases sit at the end of each row for this reason.':'Elements in the same column share the same number of outer electrons, which is why they behave alike.'};
 },
 three(s,f,X,project){
  const sh=C3_shells(s.z),items=[],P3=project([[1.6,0,0],[-1.6,0,0],[0,1.6,0],[0,-1.6,0],[0,0,1.6],[0,0,-1.6]]);
  items.push({at:[0,0,0],svg:P=>{const p=P([0,0,0]);return Ci(p[0],p[1],12,C.coral)}});
  sh.forEach((n,i)=>{const r=.45+i*.4,outer=i===sh.length-1;
   for(const ax of [0,1,2])for(let k=0;k<36;k++){const a=k/36*Math.PI*2,b=(k+1)/36*Math.PI*2,c=t=>{const u=Math.cos(t)*r,v=Math.sin(t)*r;return ax===0?[u,v,0]:ax===1?[u,0,v]:[0,u,v]};const p=c(a),q=c(b);items.push({at:p,svg:P=>line3(p,q,P,'#d3e0e8',1)})}
   for(let j=0;j<n;j++){const g=Math.PI*(3-Math.sqrt(5)),y=n===1?0:1-2*(j+.5)/n,rr=Math.sqrt(1-y*y),a=g*j+i,u=[Math.cos(a)*rr*r,Math.sin(a)*rr*r,y*r];items.push({at:u,svg:P=>{const p=P(u);return Ci(p[0],p[1],6,outer?C.coral:C.blue)}})}
  });
  return {svg:sortedItems(items,P3),title:C3_NAME[s.z-1]+' in three dimensions',caption:'Bohr’s shells drawn as spheres, with electrons spread over each. Real electrons are not tiny balls on fixed paths: quantum mechanics replaced this picture with clouds of probability, but the shell counts still hold.'};
 }});

SCENE({id:'electron-shells-spectra',name:'Bohr and hydrogen’s colours',tag:'Jumps between levels',
 definition:'Bohr’s model explained why hydrogen glows only at certain colours. An electron that falls from a higher level n to level 2 gives out light whose wavelength λ follows 1/λ = R(1/2² − 1/n²), with R ≈ 1.097 × 10⁷ per metre. These are the Balmer lines, measured before anyone could explain them.',
 example:'A fall from level 3 to level 2 gives red light at about 656 nm; from 4 to 2, blue-green at 486 nm.',
 desc:'Energy levels of hydrogen with a jump from the chosen upper level to level 2, and the emitted line on a visible spectrum. The wavelength is calculated from Bohr’s formula.',
 research:['Balmer, J. J. (1885). Notiz über die Spectrallinien des Wasserstoffs. Annalen der Physik 261, 80–87.','Bohr, N. (1913). On the constitution of atoms and molecules. Philosophical Magazine 26, 1–25.'],
 dur:10,hint:'Choose the level the electron falls from and read the colour of the light.',
 init:()=>({n:3}),
 watch(p){return {n:3+Math.min(3,Math.floor(p*4))}},
 ui:[{range:'n',label:'Falls from level',min:3,max:6,step:1,get:s=>s.n,act:'n',show:v=>'n = '+v}],
 on:{n(s,v){s.n=Number(v);return 'keep'}},
 draw(s){
  const Rh=1.0968e7,lam=n=>1e9/(Rh*(1/4-1/(n*n))),E=n=>-13.6/(n*n);let out=heading('Hydrogen: fall from '+s.n+' to 2',26);
  const Y=e=>300-(e+3.4)*70;
  for(let n=2;n<=6;n++){const y=Y(E(n));out+=L(60,y,250,y,n===2||n===s.n?C.ink:C.line,n===2||n===s.n?2.5:1.5)+(n===6?TF(54,y+4,'n = 6',13,C.muted,'end'):TF(256,y+4,'n = '+n,13,C.muted,'start'))}
  out+=TF(155,350,'n = 1 lies far below, at −13.6 eV',13,C.muted);
  out+=arrow(150,Y(E(s.n)),150,Y(E(2)),C.coral,3);
  const cols={3:'#e8001d',4:'#00b8c6',5:'#3d4dff',6:'#6a3cff'};
  const x0=330,w=250,X=nm=>x0+(nm-400)/300*w;
  for(let i=0;i<50;i++){const nm=400+i*6,h=Math.round(((nm-400)/300)*280);out+=R(X(nm),110,w/50+.5,18,`hsl(${280-h},70%,78%)`,'none',0)}
  out+=R(x0,134,w,70,'#111','none',6);
  for(let n=3;n<=6;n++){const l=lam(n);out+=R(X(l)-1.5,138,3,62,n===s.n?cols[n]:'#555','none',0)}
  [400,500,600,700].forEach(nm=>{out+=TF(X(nm),222,String(nm),13,C.muted)});
  out+=TF(x0+w/2,240,'wavelength (nm)',13,C.muted);
  out+=C3_card(x0,256,w,'λ = '+lam(s.n).toFixed(1)+' nm',['1/λ = R (1/4 − 1/'+s.n*s.n+')'],cols[s.n]);
  return {svg:out,phase:`The energy of the jump, ${(E(s.n)-E(2)).toFixed(2)} eV, fixes the colour. Bohr’s formula reproduced Balmer’s measured lines to about 1 part in 10,000.`};
 }});

// Subshell filling order up to krypton.
const C3_SUB=[['1s',2],['2s',2],['2p',6],['3s',2],['3p',6],['4s',2],['3d',10],['4p',6]];
function C3_fill(z){const out=[];let left=z;for(const [n,c] of C3_SUB){const k=Math.max(0,Math.min(c,left));out.push(k);left-=k}
 if(z===24){out[5]=1;out[6]=5}if(z===29){out[5]=1;out[6]=10}return out}
SCENE({id:'electron-shells-subshells',name:'Subshells and row lengths',tag:'2, 8, 8, 18',
 definition:'Shells are made of subshells, labelled s, p, d and f, holding 2, 6, 10 and 14 electrons. Edmund Stoner (1924) and Wolfgang Pauli (1925) showed how they fill. The 4s subshell fills before 3d, which is why the fourth row has 18 elements, including the ten transition metals.',
 example:'Potassium (19) puts its outer electron in 4s, not 3d. From scandium (21) to zinc (30) the 3d subshell fills. Chromium and copper are exceptions: each moves one electron from 4s into 3d.',
 desc:'Boxes for subshells 1s to 4p, filling as the element number rises from 1 to 36, with the row lengths 2, 8, 8 and 18 marked.',
 research:['Stoner, E. C. (1924). The distribution of electrons among atomic levels. Philosophical Magazine 48, 719–736.','Pauli, W. (1925). Über den Zusammenhang des Abschlusses der Elektronengruppen im Atom mit der Komplexstruktur der Spektren. Zeitschrift für Physik 31, 765–783.','Scerri, E. (2007). The Periodic Table: Its Story and Its Significance. Oxford University Press.'],
 dur:12,hint:'Move through the elements and watch 4s fill before 3d. Look at chromium (24) and copper (29).',
 init:()=>({z:26}),
 watch(p){return {z:1+Math.round(p*35)}},
 ui:[{range:'z',label:'Element',min:1,max:36,step:1,get:s=>s.z,act:'z',show:v=>C3_SYM[v-1]+' (Z = '+v+')'}],
 on:{z(s,v){s.z=Number(v);return 'keep'}},
 draw(s){
  const fl=C3_fill(s.z);let out=heading(C3_NAME[s.z-1][0].toUpperCase()+C3_NAME[s.z-1].slice(1)+' (Z = '+s.z+')',26);
  C3_SUB.forEach(([n,c],i)=>{const y=62+i*33;out+=TBF(66,y+20,n,14,C.ink,'end');
   for(let b=0;b<c/2;b++){const x=76+b*30;out+=R(x,y+2,26,26,'#fff',C.grid,4);const e=fl[i]-b,e2=fl[i]-c/2-b;
    if(e>0)out+=TBF(x+8,y+21,'↑',14,C.blue);if(e2>0)out+=TBF(x+18,y+21,'↓',14,C.coral)}
   out+=TF(76+c/2*30+8,y+20,fl[i]+'/'+c,13,C.muted,'start');
  });
  const sup=n=>String(n).split('').map(d=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join('');
  const cfg2=C3_SUB.map(([n],i)=>fl[i]?n+sup(fl[i]):'').filter(Boolean).join(' ');
  out+=TF(300,338,cfg2,13,C.ink);
  const rows=[[1,2,2],[3,10,8],[11,18,8],[19,36,18]];
  rows.forEach(([a,b,len],i)=>{const y=70+i*44,on=s.z>=a&&s.z<=b;out+=R(420,y,160,36,on?C.amberp:'#fff',on?C.amber:C.grid,8)+TF(430,y+23,'row '+(i+1)+': Z '+a+'–'+b,13,C.ink,'start')+TBF(570,y+23,String(len),14,on?C.amber:C.muted,'end')});
  const ex=s.z===24||s.z===29;out+=TF(500,270,ex?'Exception: one 4s electron':'Row length = sum of',13,ex?C.coral:C.muted)+TF(500,288,ex?'moves into 3d.':'the subshells it fills.',13,ex?C.coral:C.muted);
  return {svg:out,phase:s.z>=21&&s.z<=30?'Scandium to zinc fill the 3d subshell: ten transition metals that stretch row 4 to 18 elements.':'The order of filling, not just shell number, sets how long each row of the table is.'};
 }});
