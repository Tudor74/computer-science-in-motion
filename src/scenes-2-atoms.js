/* ===================== Era 2 · Atoms and weights (1800–1870) ===================== */
// Shared helpers for this era (prefix C2_).
const C2_NA=6.02214076e23,C2_F=96485.33,C2_R=8.314462618,C2_RL=0.0831446;// R in L·bar/(mol·K)
const C2_SUBS={'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉'};
// 'H2O' → 'H₂O' (digits after a letter or closing bracket become subscripts).
const C2_f=s=>String(s).replace(/([A-Za-z\)])(\d+)/g,(m,a,d)=>a+d.split('').map(c=>C2_SUBS[c]).join(''));
const C2_n=(v,d=2)=>Number(v).toLocaleString('en-GB',{minimumFractionDigits:d,maximumFractionDigits:d});
// Element colours for atom pictures.
const C2_EL={H:['#ffffff','#7b8c96'],C:['#3b4248','#3b4248'],O:['#d4553f','#d4553f'],N:['#2f74b5','#2f74b5'],Cl:['#5b9e4a','#5b9e4a'],S:['#d8b02a','#b8921a'],Fe:['#a8643a','#a8643a'],Mg:['#8f9aa3','#8f9aa3'],Na:['#7d5ab5','#7d5ab5'],K:['#a35ab0','#a35ab0']};
function C2_atom(x,y,el,r=11,lab=true){const [f,st]=C2_EL[el]||['#ccc','#999'];const ink=(el==='H'||el==='S')?C.ink:'#fff';return Ci(x,y,r,f,st,'stroke-width="1.5"')+(lab&&r>=9?TBF(x,y+4.5,el,el.length>1?11:13,ink):'')}
// A small molecule: list of elements drawn as touching circles in a row.
function C2_mol(x,y,els,r=11){let s='';const w=(els.length-1)*r*1.55;els.forEach((e,i)=>s+=C2_atom(x-w/2+i*r*1.55,y,e,r));return s}
// Plot frame with arbitrary ranges. Returns {svg, px, py}.
function C2_plot(x,y,w,h,o){
 const {x0=0,x1=1,y0=0,y1=1,xticks=[],yticks=[],xlab='',ylab='',xfmt=v=>v,yfmt=v=>v}=o;
 const px=v=>x+w*(v-x0)/(x1-x0),py=v=>y+h-h*(v-y0)/(y1-y0);
 let s=R(x,y,w,h,'#fff',C.grid,6);
 for(const t of yticks)s+=L(x,py(t),x+w,py(t),'#eef3f6',1)+L(x-4,py(t),x,py(t),C.line,1.5)+TF(x-7,py(t)+4.5,yfmt(t),13,C.muted,'end');
 for(const t of xticks)s+=L(px(t),y+h,px(t),y+h+4,C.line,1.5)+TF(px(t),y+h+17,xfmt(t),13,C.muted);
 if(xlab)s+=TF(x+w/2,y+h+33,xlab,13,C.muted);
 if(ylab)s+=TF(x,y-8,ylab,13,C.muted,'start');
 return {svg:s,px,py};
}
const C2_poly=(pts,col=C.blue,w=2.5,extra='')=>pts.length<2?'':`<polyline points="${pts.map(p=>fmt(p[0])+','+fmt(p[1])).join(' ')}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
// Visible wavelength (nm) to an sRGB colour, a standard piecewise approximation.
function C2_wl(nm){
 let r=0,g=0,b=0;
 if(nm<440){r=-(nm-440)/60;b=1}else if(nm<490){g=(nm-440)/50;b=1}else if(nm<510){g=1;b=-(nm-510)/20}else if(nm<580){r=(nm-510)/70;g=1}else if(nm<645){r=1;g=-(nm-645)/65}else r=1;
 const f=nm<420?.3+.7*(nm-380)/40:nm>700?.3+.7*(780-nm)/80:1;
 const c=v=>Math.round(255*Math.pow(clamp(v*f,0,1),.8));return `rgb(${c(r)},${c(g)},${c(b)})`;
}
// A spectrum strip from 380 to 780 nm. mode: 'dark' (emission lines on black), 'bright' (continuous with dark lines).
function C2_strip(x,y,w,h,lines,mode='dark',o={}){
 const nmx=nm=>x+w*(nm-380)/400;let s='';
 if(mode==='dark')s+=R(x,y,w,h,'#0d1418','none',4);
 else for(let nm=380;nm<780;nm+=4)s+=R(nmx(nm),y,w/100+.6,h,C2_wl(nm+2),'none',0);
 for(const ln of lines){const nm=ln.nm??ln,wd=ln.w||2.2;
  if(mode==='dark')s+=R(nmx(nm)-wd/2,y,wd,h,C2_wl(nm),'none',0)+(ln.glow?R(nmx(nm)-wd*2,y,wd*4,h,C2_wl(nm),'none',0,'opacity=".35"'):'');
  else s+=R(nmx(nm)-wd/2,y,wd,h,'#0d1418','none',0);}
 if(o.ticks!==false)for(const t of [400,500,600,700])s+=L(nmx(t),y+h,nmx(t),y+h+4,C.line,1.2)+TF(nmx(t),y+h+17,t+' nm',13,C.muted);
 return s;
}
const C2_nmx=(x,w,nm)=>x+w*(nm-380)/400;

/* ======================= Lesson: Dalton's atoms ======================= */
const C2_MULT={
 carbon:{name:'Carbon and oxygen',base:'12 g of carbon',el:'C',cmps:[['CO','carbon monoxide',16,['C','O']],['CO2','carbon dioxide',32,['O','C','O']]],ratio:'1 : 2'},
 nitrogen:{name:'Nitrogen and oxygen',base:'28 g of nitrogen',el:'N',cmps:[['N2O','nitrous oxide',16,['N','N','O']],['NO','nitric oxide',32,['N','O']],['NO2','nitrogen dioxide',64,['O','N','O']]],ratio:'1 : 2 : 4'},
 sulfur:{name:'Sulfur and oxygen',base:'32 g of sulfur',el:'S',cmps:[['SO2','sulfur dioxide',32,['O','S','O']],['SO3','sulfur trioxide',48,['O','S','O','O']]],ratio:'2 : 3'},
 iron:{name:'Iron and oxygen',base:'112 g of iron',el:'Fe',cmps:[['FeO','iron(II) oxide',32,['Fe','O']],['Fe2O3','iron(III) oxide',48,['Fe','O','Fe','O','O']]],ratio:'2 : 3'}
};
const C2_MULTK=['carbon','nitrogen','sulfur','iron'];
SCENE({id:'dalton-atoms',name:'Multiple proportions',tag:'Oxygen comes in whole-number steps',
 definition:'When two elements form more than one compound, the masses of one element that combine with a fixed mass of the other are in small whole-number ratios. John Dalton took this as evidence that elements are made of indivisible atoms that combine whole.',
 example:'12 g of carbon combines with 16 g of oxygen to make carbon monoxide, or with 32 g to make carbon dioxide: exactly twice as much, never 24 g or 19 g.',
 research:['Dalton, J. (1808). A New System of Chemical Philosophy, Part I. Manchester.','Dalton, J. (1805). On the absorption of gases by water and other liquids. Memoirs of the Manchester Literary and Philosophical Society, 2nd series, 1: his first table of relative atomic weights (read 1803).'],
 desc:'Bars show the mass of oxygen that combines with a fixed mass of another element in each of its oxides, with atom pictures below. The bars stand in small whole-number ratios.',
 dur:10,hint:'Choose a pair of elements. Compare the oxygen bars: they always stand in small whole-number ratios, because oxygen arrives a whole atom at a time.',
 init:()=>({k:'carbon'}),
 watch(p){return {k:C2_MULTK[Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:C2_MULTK.map(k=>[k,C2_MULT[k].name.split(' ')[0]]),label:'Element',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v}},
 draw(s){
  const d=C2_MULT[s.k];let out=heading(d.name+': oxygen per '+d.base);
  const n=d.cmps.length,bw=90,gap=n===3?60:110,x0=300-(n*bw+(n-1)*gap)/2,base=230,scale=2.3;
  d.cmps.forEach(([f,name,m,els],i)=>{const x=x0+i*(bw+gap),h=m*scale;
   out+=R(x,base-h,bw,h,C.coral,'none',5)+TB(x+bw/2,base-h-10,m+' g O',15,C.ink)+TB(x+bw/2,base+22,C2_f(f),17,C.ink)+TF(x+bw/2,base+40,name,13,C.muted);
   out+=C2_mol(x+bw/2,base+72,els,11);});
  out+=L(x0-14,base,x0+n*bw+(n-1)*gap+14,base,C.line,2);
  out+=R(206,316,188,36,C.pale,'none',8)+TB(300,340,'ratio  '+d.ratio,17,C.ink);
  return {svg:out,phase:`For ${d.base}, the oxygen in ${d.cmps.map(c=>C2_f(c[0])).join(', ')} is ${d.cmps.map(c=>c[2]+' g').join(', ')}: a ratio of ${d.ratio}. Whole-number steps are what you would expect if oxygen joins a whole atom at a time.`};
 }});

SCENE({id:'dalton-atoms-symbols',name:'Weights depend on formulas',tag:'Dalton’s guess about water',
 definition:'Mass ratios alone cannot give relative atomic weights: you also need the formula. Dalton assumed the simplest one, so he wrote water as one hydrogen and one oxygen (HO), which made oxygen 8 times as heavy as hydrogen instead of 16.',
 example:'Water is 1 g of hydrogen to about 8 g of oxygen by mass. If water is HO, oxygen weighs 8; if it is H₂O, oxygen weighs 16. Dalton’s own measurements gave about 7.',
 research:['Dalton, J. (1808). A New System of Chemical Philosophy, Part I: the “rule of greatest simplicity” and his pictorial symbols.','Berzelius, J. J. (1813–1814). Essay on the cause of chemical proportions. Annals of Philosophy 2–3: letter symbols for the elements.'],
 desc:'Water drawn in Dalton’s circle symbols or in Berzelius’s letters, with the measured 1 : 8 mass ratio and the oxygen weight that follows from each assumed formula.',
 dur:9,hint:'Change the formula you assume for water and watch the oxygen weight change, though the measured masses do not. Switch the notation to see Dalton’s symbols beside Berzelius’s letters.',
 init:()=>({f:'HO',note:'dalton'}),
 watch(p){return {f:p<.5?'HO':'H2O',note:p<.25||(p>=.5&&p<.75)?'dalton':'berzelius'}},
 ui:[{choose:[['HO','HO (Dalton)'],['H2O','H₂O'],['HO2','HO₂']],label:'Water is',get:s=>s.f,act:'f'},{choose:[['dalton','Dalton’s symbols'],['berzelius','Berzelius’s letters']],label:'Notation',get:s=>s.note,act:'note'}],
 on:{f(s,v){s.f=v},note(s,v){s.note=v}},
 draw(s){
  const nH=s.f==='H2O'?2:1,nO=s.f==='HO2'?2:1,Ow=8*nH/nO;let out=heading('The same water, different atomic weights');
  out+=R(40,58,240,150,'#fff',C.grid,10)+TF(160,80,'Measured by mass',13,C.muted);
  out+=R(70,98,24,24,C2_EL.H[0],C2_EL.H[1],4,'stroke-width="1.5"')+TB(110,116,'1 g hydrogen',15,C.ink,'start');
  out+=R(70,138,24,24,C2_EL.O[0],'none',4)+TB(110,156,'8 g oxygen',15,C.ink,'start')+TF(160,192,'(the same whatever the formula)',13,C.muted);
  out+=R(320,58,240,150,'#fff',C.grid,10)+TF(440,80,'Assumed formula',13,C.muted);
  const atoms=[...Array(nH).fill('H'),...Array(nO).fill('O')],cx=440,w=(atoms.length-1)*34;
  atoms.forEach((e,i)=>{const x=cx-w/2+i*34,y=130;
   if(s.note==='dalton'){out+=Ci(x,y,14,'#fff',C.ink,'stroke-width="2"')+(e==='H'?Ci(x,y,3.5,C.ink):'')}
   else out+=TB(x,y+8,e,24,e==='H'?C.muted:C.coral)});
  if(s.note==='berzelius')out+=TF(440,182,'He wrote counts as superscripts: H²O',13,C.muted);
  else out+=TF(440,182,'⊙ hydrogen   ○ oxygen',13,C.muted);
  out+=R(80,236,440,76,s.f==='H2O'?C.greenp:C.amberp,'none',10);
  out+=TB(300,266,`If water is ${C2_f(s.f)}, oxygen weighs ${fmt(Ow)} (hydrogen = 1)`,17,C.ink);
  out+=TF(300,292,`${nO} oxygen ${nO>1?'atoms carry':'atom carries'} the 8 g that ${nH} hydrogen ${nH>1?'atoms':'atom'} meet${nH>1?'':'s'}: 8 × ${nH} ÷ ${nO} = ${fmt(Ow)}`,13,C.muted);
  out+=TF(300,340,s.f==='H2O'?'Correct: settled only in 1860, by Avogadro’s idea applied by Cannizzaro':'Not settled by mass alone: chemists argued for fifty years',13,s.f==='H2O'?C.green:C.coral);
  return {svg:out,phase:`Water is always 1 g of hydrogen to 8 g of oxygen. Assume ${C2_f(s.f)} and oxygen’s atomic weight comes out at ${fmt(Ow)}. Mass ratios cannot choose between these; that needed gas volumes (Avogadro) and, finally, Cannizzaro in 1860.`};
 }});

const C2_MGO=24.305/15.999;
SCENE({id:'dalton-atoms-definite',name:'Definite proportions',tag:'Extra reactant is simply left over',
 definition:'A compound always contains its elements in the same proportion by mass, however it is made (Joseph Proust, 1797). Any excess of one reactant is left over unreacted; the one that runs out first is the limiting reactant.',
 example:'Magnesium oxide is always about 3 parts magnesium to 2 parts oxygen by mass (24.3 : 16.0). Burn 6 g of magnesium and it takes about 3.95 g of oxygen, whatever extra oxygen is around.',
 research:['Proust, J.-L. (1797). Recherches sur le bleu de Prusse. Journal de Physique 45: the law of definite proportions.','Berthollet, C.-L. (1803). Essai de statique chimique: argued that compositions vary. Some solids, now called non-stoichiometric (e.g. Fe₀.₉₅O), do vary slightly.'],
 desc:'Bars for the magnesium and oxygen supplied, how much of each reacts, the magnesium oxide formed and what is left over, with the fixed 24.3 : 16.0 mass ratio.',
 dur:10,hint:'Change the grams of magnesium and oxygen supplied. The oxide always forms in the same ratio; whichever reactant runs out first limits how much forms.',
 init:()=>({mg:6,o:6}),
 watch(p){return {mg:6,o:+(.5+p*7.5).toFixed(1)}},
 ui:[{range:'mg',label:'Magnesium',min:0,max:10,step:.5,get:s=>s.mg,act:'mg',show:v=>fmt(v)+' g'},{range:'o',label:'Oxygen',min:0,max:10,step:.5,get:s=>s.o,act:'o',show:v=>fmt(v)+' g'}],
 on:{mg(s,v){s.mg=+v},o(s,v){s.o=+v}},
 draw(s){
  const usedMg=Math.min(s.mg,s.o*C2_MGO),usedO=usedMg/C2_MGO,mgo=usedMg+usedO,lim=s.mg/C2_MGO<s.o-1e-9?'magnesium':s.o*C2_MGO<s.mg-1e-9?'oxygen':'neither';
  let out=heading('2Mg + O₂ → 2MgO, always 24.3 : 16.0 by mass');
  const sc=14,base=290,bar=(x,v,col,lab,sub)=>R(x,base-v*sc,70,v*sc,col,'none',4)+TB(x+35,base-v*sc-8,fmt(v)+' g',14,C.ink)+TF(x+35,base+18,lab,13,C.ink)+(sub?TF(x+35,base+34,sub,13,C.muted):'');
  out+=bar(40,s.mg,C2_EL.Mg[0],'magnesium','supplied')+bar(120,s.o,C2_EL.O[0],'oxygen','supplied');
  out+=arrow(208,200,250,200,C.muted,2.5);
  out+=bar(270,+mgo.toFixed(2),'#cfd6dc','magnesium','oxide formed');
  out+=R(270,base-mgo*sc,70,usedMg*sc,C2_EL.Mg[0],'none',0,'opacity=".45"');
  const lo=s.mg-usedMg,lO=s.o-usedO;
  out+=bar(380,+lo.toFixed(2),C2_EL.Mg[0],'magnesium','left over')+bar(460,+lO.toFixed(2),C2_EL.O[0],'oxygen','left over');
  out+=L(30,base,540,base,C.line,2);
  out+=R(40,52,520,30,lim==='neither'?C.greenp:C.amberp,'none',8)+TF(300,72,lim==='neither'?'Exactly the right amounts: nothing is left over':`${lim==='magnesium'?'Magnesium':'Oxygen'} runs out first and limits the oxide formed`,14,C.ink);
  return {svg:out,phase:`${fmt(s.mg)} g of magnesium and ${fmt(s.o)} g of oxygen give ${C2_n(mgo,2)} g of magnesium oxide, with ${C2_n(lo,2)} g of magnesium and ${C2_n(lO,2)} g of oxygen left. The oxide is always ${C2_n(C2_MGO,2)} g of magnesium per gram of oxygen.`};
 }});

/* ======================= Lesson: Avogadro ======================= */
const C2_GL={
 water:{name:'Steam',eq:'2H2 + O2 → 2H2O',r:[['H2',2,['H','H']],['O2',1,['O','O']]],p:[['H2O',2,['H','O','H']]],note:'measured hot, as steam'},
 hcl:{name:'Hydrogen chloride',eq:'H2 + Cl2 → 2HCl',r:[['H2',1,['H','H']],['Cl2',1,['Cl','Cl']]],p:[['HCl',2,['H','Cl']]],note:'two volumes from two'},
 ammonia:{name:'Ammonia',eq:'N2 + 3H2 → 2NH3',r:[['N2',1,['N','N']],['H2',3,['H','H']]],p:[['NH3',2,['N','H','H','H']]],note:'four volumes make two'},
 co2:{name:'Carbon dioxide',eq:'2CO + O2 → 2CO2',r:[['CO',2,['C','O']],['O2',1,['O','O']]],p:[['CO2',2,['O','C','O']]],note:'three volumes make two'}
};
const C2_GLK=['water','hcl','ammonia','co2'];
function C2_vols(x,y,items,u,phase){
 // items: [[formula,volumes,els]], u: 0 full .. 1 used; draws unit-volume boxes 40×80.
 let s='',cx=x;
 items.forEach(([f,v,els],ii)=>{for(let i=0;i<v;i++){const h=80*(phase==='r'?1-u:u);s+=R(cx,y,40,80,'#fff',C.line,4)+R(cx,y+80-h,40,h,phase==='r'?'#d6e6f2':'#dcefe9','none',3);cx+=46}
  s+=TB(cx-46*v/2-3,y+104,(v>1?v+' ':'')+C2_f(f),15,C.ink);cx+=ii<items.length-1?34:0;
  if(ii<items.length-1)s+=TB(cx-20,y+46,'+',22,C.muted)});
 return {svg:s,end:cx};
}
SCENE({id:'avogadro',name:'Combining volumes',tag:'Gases react in small whole-number volumes',
 definition:'Joseph Louis Gay-Lussac found in 1808 that gases react in simple whole-number ratios by volume, and that the volume of a gaseous product is a simple multiple too. Measured at the same temperature and pressure, two volumes of hydrogen always need exactly one of oxygen.',
 example:'2 litres of hydrogen and 1 litre of oxygen make 2 litres of steam, not 3. 1 litre of nitrogen and 3 of hydrogen make 2 litres of ammonia.',
 research:['Gay-Lussac, J. L. (1809). Mémoire sur la combinaison des substances gazeuses, les unes avec les autres. Mémoires de la Société d’Arcueil 2 (read 1808).','Humboldt, A. von & Gay-Lussac, J. L. (1805): water forms from 2 volumes of hydrogen to 1 of oxygen.'],
 desc:'Unit volumes of the reacting gases empty as the reaction runs and unit volumes of the product fill. The counts of boxes are the whole-number volume ratio.',
 dur:12,hint:'Choose a reaction and slide the reaction along. Count the boxes: the volumes are small whole numbers, and the product’s volume is not simply the sum.',
 init:()=>({k:'water',u:1}),
 watch(p){const i=Math.min(3,Math.floor(p*4));return {k:C2_GLK[i],u:+smooth(clamp((p*4-i)*1.6,0,1)).toFixed(2)}},
 ui:[{choose:C2_GLK.map(k=>[k,C2_GL[k].name]),label:'Reaction',get:s=>s.k,act:'k'},{range:'u',label:'Reaction',min:0,max:1,step:.05,get:s=>s.u,act:'u',show:v=>Math.round(v*100)+'%'}],
 on:{k(s,v){s.k=v},u(s,v){s.u=+v}},
 draw(s){
  const d=C2_GL[s.k];let out=heading(C2_f(d.eq));
  const r=C2_vols(0,0,d.r,s.u,'r'),rw=r.end;const nr=d.r.reduce((a,b)=>a+b[1],0),np=d.p[0][1];
  const pw=np*46,total=rw+70+pw,x0=300-total/2;
  out+=C2_vols(x0,110,d.r,s.u,'r').svg;
  out+=arrow(x0+rw+10,150,x0+rw+56,150,C.muted,3);
  out+=C2_vols(x0+rw+70,110,d.p,s.u,'p').svg;
  out+=R(130,262,340,62,C.pale,'none',10)+TB(300,288,`${nr} volumes → ${np} volumes`,17,C.ink)+TF(300,310,d.note+' · same temperature and pressure',13,C.muted);
  out+=TF(300,80,'Each box is one volume of gas',13,C.muted);
  return {svg:out,phase:`${C2_f(d.eq)}: ${d.r.map(x=>x[1]+' volume'+(x[1]>1?'s':'')+' of '+C2_f(x[0])).join(' and ')} give ${np} volumes of ${C2_f(d.p[0][0])}. Gay-Lussac found these small whole numbers in every gas reaction he measured.`};
 }});

function C2_pairs(x,y,w,h,n,els,seed,r=7){
 // n molecules (each a list of elements) scattered in a box, deterministic.
 const rr=rng(seed);let s='';const cols=Math.ceil(Math.sqrt(n*w/h)),rows=Math.ceil(n/cols);
 for(let i=0;i<n;i++){const c=i%cols,ro=Math.floor(i/cols),cx=x+(c+.5)*w/cols+(rr()-.5)*6,cy=y+(ro+.5)*h/rows+(rr()-.5)*6,e=Array.isArray(els[0])?els[i%els.length]:els;
  const ww=(e.length-1)*r*1.5;e.forEach((el,j)=>s+=C2_atom(cx-ww/2+j*r*1.5,cy,el,r,false));}
 return s;
}
SCENE({id:'avogadro-diatomic',name:'Avogadro’s molecules',tag:'Why hydrogen must come in pairs',
 definition:'Amedeo Avogadro proposed in 1811 that equal volumes of gases at the same temperature and pressure contain equal numbers of particles, and that the particles of elements like hydrogen and chlorine are molecules of two atoms. Only then do Gay-Lussac’s volumes make sense.',
 example:'One volume of hydrogen and one of chlorine give two volumes of hydrogen chloride. With equal numbers in equal volumes, that is twice as many HCl particles as hydrogen particles: impossible unless each hydrogen particle splits in two.',
 research:['Avogadro, A. (1811). Essai d’une manière de déterminer les masses relatives des molécules élémentaires des corps. Journal de Physique 73.','Ampère, A.-M. (1814). Annales de Chimie 90: a similar hypothesis. Both were largely ignored until Cannizzaro in 1860.'],
 desc:'One volume of hydrogen plus one of chlorine making two volumes of hydrogen chloride, drawn with single atoms (Dalton) and with two-atom molecules (Avogadro). Only the molecule picture fills both product volumes without splitting atoms.',
 dur:10,hint:'Switch between Dalton’s single atoms and Avogadro’s two-atom molecules. Count the particles in each volume: equal volumes must hold equal numbers.',
 init:()=>({m:'atoms'}),
 watch(p){return {m:p<.5?'atoms':'molecules'}},
 ui:[{choose:[['atoms','Single atoms (Dalton)'],['molecules','Molecules H₂, Cl₂ (Avogadro)']],label:'Model',get:s=>s.m,act:'m'}],
 on:{m(s,v){s.m=v}},
 draw(s){
  const mol=s.m==='molecules';let out=heading('1 volume + 1 volume → 2 volumes');
  const bx=(x,lab)=>R(x,70,110,110,'#fff',C.line,6)+TB(x+55,200,lab,15,C.ink);
  out+=bx(30,mol?'H₂':'H')+TB(158,130,'+',24,C.muted)+bx(186,mol?'Cl₂':'Cl')+arrow(310,125,350,125,C.muted,3)+bx(364,'HCl')+bx(480,'HCl');
  out+=C2_pairs(36,76,98,98,4,mol?['H','H']:['H'],3)+C2_pairs(192,76,98,98,4,mol?['Cl','Cl']:['Cl'],5);
  if(mol){out+=C2_pairs(370,76,98,98,4,['H','Cl'],7)+C2_pairs(486,76,98,98,4,['H','Cl'],9)}
  else{out+=C2_pairs(370,76,98,98,4,['H','Cl'],7)+R(486,76,98,98,C.coralp,'none',4)+TB(535,120,'empty?',15,C.coral)+TF(535,142,'or half atoms',13,C.coral)}
  out+=TF(85,224,'4 particles',13,C.muted)+TF(241,224,'4 particles',13,C.muted)+TF(477,224,mol?'4 + 4 = 8 particles':'only 4 HCl possible',13,mol?C.green:C.coral);
  out+=R(70,250,460,76,mol?C.greenp:C.coralp,'none',10);
  out+=TB(300,280,mol?'Each H₂ and Cl₂ splits: 4 H₂ + 4 Cl₂ → 8 HCl  ✓':'4 H + 4 Cl can make only 4 HCl  ✗',16,C.ink);
  out+=TF(300,306,mol?'Equal volumes, equal numbers, and the volumes fit':'Equal numbers would need 8 HCl: each atom would have to split',13,C.muted);
  return {svg:out,phase:mol?'With two-atom molecules, four H₂ and four Cl₂ make eight HCl, filling two volumes with four each. Avogadro’s hypothesis fits Gay-Lussac’s volumes.':'If hydrogen and chlorine were single atoms, one volume of each could make only one volume’s worth of HCl. Dalton rejected equal numbers in equal volumes for exactly this reason.'};
 }});

const C2_GAS={H2:{n:'Hydrogen',M:2.016,c:'#e8eef2'},He:{n:'Helium',M:4.003,c:'#f3e3b8'},N2:{n:'Nitrogen',M:28.014,c:'#bcd3ea'},O2:{n:'Oxygen',M:31.998,c:'#f2c7bd'},CO2:{n:'Carbon dioxide',M:44.009,c:'#cfd6dc'}};
const C2_GASK=['H2','He','N2','O2','CO2'];
function C2_sci(v,d=2){if(v===0)return '0';const e=Math.floor(Math.log10(Math.abs(v))),m=v/10**e;const sup={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};return m.toFixed(d)+' × 10'+String(e).split('').map(c=>sup[c]).join('')}
SCENE({id:'avogadro-number',name:'The mole',tag:'Same volume, same count, different mass',
 definition:'A mole is 6.022 140 76 × 10²³ particles, the Avogadro constant (exact since 2019). At the same temperature and pressure a mole of any gas fills about the same volume: 22.4 litres at 0 °C and 1 atmosphere, about 24.8 litres at 25 °C and 100 kPa. What differs is the mass.',
 example:'A mole of hydrogen weighs 2 g and a mole of carbon dioxide 44 g, yet both fill about 24.8 litres at room conditions and hold the same number of molecules.',
 research:['Loschmidt, J. (1865). Zur Grösse der Luftmoleküle. Sitzungsberichte der Akademie der Wissenschaften Wien 52: the first estimate of how many molecules a gas holds, about an order of magnitude too low.','Perrin, J. (1909). Mouvement brownien et réalité moléculaire: named the Avogadro constant and measured it.','BIPM (2019). The International System of Units, 9th edition: the Avogadro constant fixed exactly.'],
 desc:'Five balloons of different gases, each holding the chosen number of moles at the chosen conditions. They are all the same size; bars below show their very different masses.',
 dur:10,hint:'Change the amount in moles and the conditions. Every balloon stays the same size as the others, because equal volumes hold equal numbers of molecules; only the masses differ.',
 init:()=>({n:1,cond:'room',g:'CO2'}),
 watch(p){return {n:+(.5+p*1.5).toFixed(2),cond:p<.5?'stp':'room',g:C2_GASK[Math.min(4,Math.floor(p*5))]}},
 ui:[{range:'n',label:'Amount',min:.1,max:3,step:.1,get:s=>s.n,act:'n',show:v=>fmt(v)+' mol'},{choose:[['stp','0 °C, 101.3 kPa'],['room','25 °C, 100 kPa']],label:'Conditions',get:s=>s.cond,act:'cond'},{choose:C2_GASK.map(k=>[k,C2_f(k)]),label:'Highlight',get:s=>s.g,act:'g'}],
 on:{n(s,v){s.n=+v},cond(s,v){s.cond=v},g(s,v){s.g=v}},
 draw(s){
  const TK=s.cond==='stp'?273.15:298.15,pk=s.cond==='stp'?101.325:100,Vm=C2_R*TK/pk,V=s.n*Vm;
  let out=heading(`${fmt(s.n)} mol of each gas: ${C2_n(V,1)} litres`);
  const rB=14+Math.cbrt(V)*9;
  C2_GASK.forEach((k,i)=>{const g=C2_GAS[k],x=72+i*114,y=118,hi=k===s.g;
   out+=Ci(x,y,rB,g.c,hi?C.ink:C.line,`stroke-width="${hi?3:1.5}"`)+L(x,y+rB,x,y+rB+18,C.line,1.5)+TB(x,y+5,C2_f(k),15,C.ink);
   const m=s.n*g.M,bh=Math.max(1,m*.5);out+=R(x-22,330-bh,44,bh,hi?C.coral:'#e3a698','none',4)+TF(x,322-bh,C2_n(m,m<10?1:0)+' g',13,C.ink)+TF(x,348,g.n,13,C.muted);});
  out+=L(30,330,570,330,C.line,1.5);
  out+=R(130,196,340,48,C.pale,'none',10)+TB(300,218,C2_sci(s.n*C2_NA,3)+' molecules in each',15,C.ink)+TF(300,238,`molar volume ${C2_n(Vm,2)} L/mol at ${s.cond==='stp'?'0 °C':'25 °C'}`,13,C.muted);
  const g=C2_GAS[s.g];
  return {svg:out,phase:`Each balloon holds ${C2_sci(s.n*C2_NA,3)} molecules in ${C2_n(V,1)} L. ${fmt(s.n)} mol of ${g.n.toLowerCase()} weighs ${C2_n(s.n*g.M,2)} g (molar mass ${C2_n(g.M,3)} g/mol). Same count, same volume, different mass.`};
 }});

/* ======================= Lesson: Electrolysis ======================= */
const C2_VM20=C2_R*293.15/101.325;// L/mol at 20 °C, 101.325 kPa (24.05)
SCENE({id:'electrolysis',name:'Splitting water',tag:'Electricity pulls a compound apart',
 definition:'An electric current passed through a solution can split a compound into its elements: electrolysis. Water splits into hydrogen at the negative electrode (cathode) and oxygen at the positive electrode (anode), always two volumes of hydrogen to one of oxygen.',
 example:'A current of 1 ampere for 10 minutes carries 600 coulombs, enough to release about 75 mL of hydrogen and 37 mL of oxygen at room temperature.',
 research:['Nicholson, W. & Carlisle, A. (1800). Account of the new electrical or galvanic apparatus of Sig. Alex. Volta, and experiments performed with the same. Journal of Natural Philosophy, Chemistry and the Arts 4: water split weeks after Volta announced his pile.','Volta, A. (1800). On the electricity excited by the mere contact of conducting substances of different kinds. Philosophical Transactions 90.'],
 desc:'An electrolysis apparatus with two water-filled collecting tubes over the electrodes. Gas pushes the water down: hydrogen collects over the cathode at twice the volume of oxygen over the anode, and the readouts follow the current and time.',
 dur:12,hint:'Change the current and the running time. The hydrogen tube always holds twice the gas of the oxygen tube, because each O₂ needs four electrons and each H₂ only two.',
 init:()=>({I:1,t:10}),
 watch(p){return {I:1,t:+(p*30).toFixed(1)}},
 ui:[{range:'I',label:'Current',min:.1,max:2,step:.1,get:s=>s.I,act:'I',show:v=>fmt(v)+' A'},{range:'t',label:'Time',min:0,max:30,step:.5,get:s=>s.t,act:'t',show:v=>fmt(v)+' min'}],
 on:{I(s,v){s.I=+v},t(s,v){s.t=+v}},
 draw(s){
  const Q=s.I*s.t*60,ne=Q/C2_F,vH=ne/2*C2_VM20*1000,vO=ne/4*C2_VM20*1000;
  let out=heading('2H₂O → 2H₂ + O₂ by electricity');
  out+=R(120,250,300,70,'#d6e6f2',C.line,6);// trough
  const cap=Math.max(180,vH*1.08),tube=(x,v,lab,col)=>{const h=Math.min(1,v/cap)*170;return R(x,70,46,200,'#d6e6f2',C.line,6)+R(x+2,72,42,h,col,'none',4)+(h>2?L(x+2,72+h,x+44,72+h,C.blue,1.5):'')+TB(x+23,62,lab,15,C.ink)};
  out+=tube(170,vH,'H₂','#fbfdfe')+tube(324,vO,'O₂','#fdeee8');
  out+=R(184,262,18,46,'#7b8c96','none',2)+R(338,262,18,46,'#7b8c96','none',2);
  out+=TB(193,352,'cathode (−)',13,C.ink)+TB(347,352,'anode (+)',13,C.ink);
  out+=P('M193 308V330H100V200H80M347 308V330H440V200H480',C.muted,2)+R(40,180,40,40,'#fff',C.ink,4)+TB(60,206,'−',18,C.ink)+R(480,180,40,40,'#fff',C.ink,4)+TB(500,206,'+',18,C.ink)+TF(60,240,'battery',13,C.muted)+TF(500,240,'battery',13,C.muted);
  // bubbles proportional (deterministic)
  const rr=rng(17+Math.round(s.t*2));for(let i=0;i<6;i++){if(s.t>0){out+=Ci(178+rr()*30,240-rr()*30,2.5,'#fff',C.line);out+=Ci(332+rr()*30,240-rr()*30,2,'#fff',C.line)}}
  out+=R(450,70,130,104,'#fff',C.grid,8)+TF(515,90,'charge',13,C.muted)+TBF(515,110,C2_n(Q,0)+' C',15,C.ink)+TF(515,130,'hydrogen',13,C.muted)+TBF(515,150,C2_n(vH,1)+' mL',15,C.ink)+TF(515,170,'oxygen '+C2_n(vO,1)+' mL',13,C.ink);
  return {svg:out,phase:`${fmt(s.I)} A for ${fmt(s.t)} min carries ${C2_n(Q,0)} C, about ${C2_n(ne*1000,2)} millimoles of electrons: ${C2_n(vH,1)} mL of hydrogen and ${C2_n(vO,1)} mL of oxygen at 20 °C. Pure water barely conducts, so a little acid or salt is added.`};
 }});

const C2_CELLS={
 acid:{name:'Dilute acid (water)',cat:'2H⁺ + 2e⁻ → H₂',an:'2H₂O → O₂ + 4H⁺ + 4e⁻',pc:'hydrogen gas',pa:'oxygen gas',col:'#d6e6f2',note:'The water splits; the acid only lets current flow.'},
 brine:{name:'Brine (salt water)',cat:'2H₂O + 2e⁻ → H₂ + 2OH⁻',an:'2Cl⁻ → Cl₂ + 2e⁻',pc:'hydrogen gas',pa:'chlorine gas',col:'#dde8e2',note:'No sodium: water is reduced more easily. Sodium hydroxide stays in solution.'},
 nacl:{name:'Molten salt (NaCl)',cat:'Na⁺ + e⁻ → Na',an:'2Cl⁻ → Cl₂ + 2e⁻',pc:'liquid sodium',pa:'chlorine gas',col:'#f3dcc4',note:'Above 801 °C, with no water present, sodium itself forms.'},
 koh:{name:'Molten potash (KOH)',cat:'K⁺ + e⁻ → K',an:'4OH⁻ → O₂ + 2H₂O + 4e⁻',pc:'potassium metal',pa:'oxygen gas',col:'#efd9c6',note:'Davy, 6 October 1807: globules of potassium burst into flame.'}
};
const C2_CELLK=['acid','brine','nacl','koh'];
SCENE({id:'electrolysis-davy',name:'Davy’s new metals',tag:'What forms depends on what is in the cell',
 definition:'Humphry Davy used powerful batteries in 1807–08 to electrolyse molten potash and soda, isolating potassium and sodium for the first time, then calcium, magnesium, strontium and barium. What forms at each electrode depends on what is there to gain or lose electrons.',
 example:'Electrolyse salt dissolved in water and you get hydrogen, not sodium, at the cathode: water accepts electrons more easily. Melt the salt with no water and sodium forms.',
 research:['Davy, H. (1808). On some new phenomena of chemical changes produced by electricity, particularly the decomposition of the fixed alkalies. Philosophical Transactions 98 (the Bakerian Lecture of 1807).','Davy, H. (1808). Electro-chemical researches on the decomposition of the earths. Philosophical Transactions 98: calcium, magnesium, strontium and barium.'],
 desc:'An electrolysis cell with a choice of electrolyte. Each electrode is labelled with its product and half-equation: electrons are gained at the cathode (reduction) and lost at the anode (oxidation).',
 dur:12,hint:'Choose what is in the cell. Read the half-equation at each electrode. Safety: molten salts, sodium, potassium and chlorine are all dangerous; this is a demonstration, not a home experiment.',
 init:()=>({k:'koh'}),
 watch(p){return {k:C2_CELLK[Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:C2_CELLK.map(k=>[k,C2_CELLS[k].name]),label:'Electrolyte',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v}},
 draw(s){
  const d=C2_CELLS[s.k];let out=heading(d.name);
  out+=R(150,120,300,140,d.col,C.line,8)+R(200,84,24,150,'#7b8c96','none',3)+R(376,84,24,150,'#7b8c96','none',3);
  out+=TB(212,76,'−',20,C.ink)+TB(388,76,'+',20,C.ink);
  out+=TB(212,284,'cathode',15,C.ink)+TF(212,302,'gains electrons',13,C.muted)+TB(388,284,'anode',15,C.ink)+TF(388,302,'loses electrons',13,C.muted);
  out+=R(20,140,170,62,'#fff',C.grid,8)+TB(105,164,d.pc,14,C.ink)+TF(105,188,d.cat,13,C.blue);
  out+=R(410,140,180,62,'#fff',C.grid,8)+TB(500,164,d.pa,14,C.ink)+TF(500,188,d.an,13,C.coral);
  const isMetal=/sodium|potassium/.test(d.pc);
  const rr=rng(C2_CELLK.indexOf(s.k)+3);for(let i=0;i<5;i++){out+=isMetal?Ci(228+rr()*10,200-i*18,5,'#c9c9c9',C.ink):Ci(230+rr()*8,210-i*18,3,'#fff',C.line);out+=Ci(368-rr()*8,210-i*18,3,'#fff',C.line)}
  out+=R(70,322,460,40,C.pale,'none',8)+TF(300,347,d.note,13,C.ink);
  return {svg:out,phase:`${d.name}: at the cathode ${d.cat} gives ${d.pc}; at the anode ${d.an} gives ${d.pa}. ${d.note}`};
 }});

const C2_MET=[['Ag','silver','Ag⁺',107.868,1,'#c7ccd1'],['Cu','copper','Cu²⁺',63.546,2,'#c47a3d'],['Zn','zinc','Zn²⁺',65.38,2,'#9aa8b4'],['Al','aluminium','Al³⁺',26.982,3,'#b5c0c8']];
SCENE({id:'electrolysis-faraday',name:'Faraday’s laws',tag:'Charge counts atoms',
 definition:'Michael Faraday showed in 1833–34 that the mass of an element released by electrolysis is proportional to the charge passed, and that the same charge releases amounts in proportion to the element’s atomic weight divided by its charge. Each mole of electrons is 96 485 coulombs, the Faraday constant.',
 example:'1 ampere for 1 hour (3600 C) through four cells in series deposits about 4.03 g of silver, 1.19 g of copper, 1.22 g of zinc and 0.34 g of aluminium. Copper ions need two electrons each, aluminium ions three.',
 research:['Faraday, M. (1834). Experimental researches in electricity, seventh series. Philosophical Transactions 124: the laws of electrolysis, and the words electrode, anode, cathode, ion and electrolyte, coined with William Whewell.','Mohr, P. J. et al. (2018 CODATA): Faraday constant F = Nₐ e ≈ 96 485.33 C/mol.'],
 desc:'Four electrolysis cells in series carry the same charge. Bars show the mass of each metal deposited and the moles of metal, which stand in the ratio 1 : ½ : ½ : ⅓.',
 dur:10,hint:'Change the current and time. The same charge passes through every cell; the moles deposited depend only on each ion’s charge, and the grams on its atomic weight too.',
 init:()=>({I:1,t:60}),
 watch(p){return {I:1,t:Math.round(5+p*115)}},
 ui:[{range:'I',label:'Current',min:.2,max:3,step:.1,get:s=>s.I,act:'I',show:v=>fmt(v)+' A'},{range:'t',label:'Time',min:5,max:120,step:5,get:s=>s.t,act:'t',show:v=>v+' min'}],
 on:{I(s,v){s.I=+v},t(s,v){s.t=+v}},
 draw(s){
  const Q=s.I*s.t*60,ne=Q/C2_F;let out=heading(`${C2_n(Q,0)} C through four cells in series`);
  out+=TF(300,56,`= ${C2_n(ne*1000,1)} millimoles of electrons (Q ÷ 96 485 C/mol)`,13,C.muted);
  const maxM=3*3600*2/C2_F*107.868;// top of scale: 3 A, 2 h of silver
  C2_MET.forEach(([sym,name,ion,M,z,col],i)=>{const x=60+i*130,mol=ne/z,m=mol*M,h=Math.max(1,m/maxM*170);
   out+=R(x,78,100,38,'#eef4f8',C.line,6)+TB(x+50,102,ion,15,C.ink);
   out+=R(x+20,290-h,60,h,col,'none',4)+TB(x+50,282-h,C2_n(m,m<1?3:2)+' g',14,C.ink);
   out+=TB(x+50,312,name,14,C.ink)+TF(x+50,330,C2_n(mol*1000,2)+' mmol',13,C.muted)+TF(x+50,348,'÷ '+z+(z>1?' electrons':' electron'),13,C.muted);});
  out+=L(40,290,560,290,C.line,1.5);
  return {svg:out,phase:`${C2_n(Q,0)} C is ${C2_n(ne*1000,1)} mmol of electrons. That deposits ${C2_MET.map(([s2,n,i2,M,z])=>C2_n(ne/z*M,2)+' g of '+n).join(', ')}: the same charge always gives moles in the ratio 1 : ½ : ½ : ⅓.`};
 }});

/* ======================= Lesson: The ideal gas ======================= */
SCENE({id:'ideal-gas',name:'The ideal gas law',tag:'pV = nRT ties the gas laws together',
 definition:'Boyle’s law (pressure and volume), Charles’s and Gay-Lussac’s laws (volume and temperature) and Avogadro’s hypothesis (volume and amount) combine into one equation, pV = nRT, first written by Émile Clapeyron in 1834. R is the gas constant, 8.314 J per mole per kelvin.',
 example:'One mole of gas at 0 °C (273.15 K) and 101.325 kPa occupies 22.41 L. Warm it to 25 °C at 100 kPa and it fills 24.79 L.',
 research:['Clapeyron, É. (1834). Mémoire sur la puissance motrice de la chaleur. Journal de l’École Polytechnique 14: the combined gas law.','Gay-Lussac, J. L. (1802). Recherches sur la dilatation des gaz et des vapeurs. Annales de Chimie 43 (crediting unpublished work by Jacques Charles). See Physics In Motion for the kinetic theory behind it.'],
 desc:'A gas in a cylinder under a piston. Sliders set the pressure, temperature and amount; the volume follows pV = nRT, and a note names the law that applies when only one input changes.',
 dur:12,hint:'Change one slider at a time and the note names the law you are testing. Temperature must be in kelvin: at 0 K the ideal volume would be zero.',
 init:()=>({p:100,T:298,n:1,last:'T'}),
 watch(p){return {p:100,T:Math.round(200+p*400),n:1,last:'T'}},
 ui:[{range:'p',label:'Pressure',min:50,max:300,step:5,get:s=>s.p,act:'p',show:v=>v+' kPa'},{range:'T',label:'Temperature',min:150,max:600,step:5,get:s=>s.T,act:'T',show:v=>v+' K'},{range:'n',label:'Amount',min:.2,max:3,step:.1,get:s=>s.n,act:'n',show:v=>fmt(v)+' mol'}],
 on:{p(s,v){s.p=+v;s.last='p'},T(s,v){s.T=+v;s.last='T'},n(s,v){s.n=+v;s.last='n'}},
 draw(s){
  const V=s.n*C2_R*s.T/s.p;let out=heading('pV = nRT');
  const h=clamp(V/80*240,6,240),top=300-h;
  out+=R(80,50,140,254,'#f4f9fc',C.line,6)+R(84,top,132,h,'#d6e6f2','none',2)+R(78,top-16,144,16,'#7b8c96','none',3)+L(150,top-16,150,40,'#7b8c96',6);
  const rr=rng(31);const k=Math.round(clamp(s.n*10,2,30));for(let i=0;i<k;i++)out+=Ci(92+rr()*116,top+6+rr()*(h-12),3.5,C.blue);
  out+=TB(150,328,C2_n(V,2)+' L',18,C.ink);
  const law={p:'Boyle: V ∝ 1/p (n, T fixed)',T:'Charles and Gay-Lussac: V ∝ T (n, p fixed)',n:'Avogadro: V ∝ n (p, T fixed)'}[s.last];
  out+=R(260,70,310,150,'#fff',C.grid,10);
  out+=TM(415,104,`V = nRT ÷ p`,17,C.ink)+TF(415,132,`= ${fmt(s.n)} × 8.314 × ${s.T} ÷ ${s.p}`,13,C.muted)+TB(415,160,`= ${C2_n(V,2)} L`,17,C.blue)+TF(415,196,`molar volume here: ${C2_n(C2_R*s.T/s.p,2)} L/mol`,13,C.muted);
  out+=R(260,236,310,58,C.pale,'none',10)+TF(415,270,law,13,C.ink);
  out+=TF(415,324,`T = ${s.T} K = ${s.T-273} °C`+(V>80?' · too big to draw to scale':''),13,C.muted);
  return {svg:out,phase:`${fmt(s.n)} mol at ${s.T} K (${s.T-273} °C) and ${s.p} kPa fills ${C2_n(V,2)} L. ${law}. Real gases follow this closely at ordinary conditions.`};
 }});

const C2_DUMAS={
 O2:{n:'Oxygen',M:31.998,note:'O₂: two atoms, as Avogadro said'},
 CO2:{n:'Carbon dioxide',M:44.009,note:'CO₂'},
 CH4:{n:'Methane (marsh gas)',M:16.043,note:'CH₄'},
 Hg:{n:'Mercury vapour',minT:630,M:200.59,note:'Single atoms: half what a two-atom molecule would give'},
 S:{n:'Sulfur vapour, ~500 °C',minT:718,M:190,note:'Apparent value only: a mix of S₈, S₆ and smaller molecules'}
};
const C2_DK=['O2','CO2','CH4','Hg','S'];
SCENE({id:'ideal-gas-molar-mass',name:'Weighing a gas',tag:'Dumas’s flask gives the molar mass',
 definition:'Weigh a known volume of gas or vapour at a known temperature and pressure, and pV = nRT gives the amount in moles, so the molar mass is M = mRT ÷ pV. Jean-Baptiste Dumas used this vapour-density method from 1826 to find molecular weights.',
 example:'A 1-litre flask of oxygen at 25 °C and 101.3 kPa holds 1.31 g, giving M = 32.0 g/mol: two atoms of oxygen. Mercury vapour gave 200.6, which puzzled chemists who expected two-atom molecules.',
 research:['Dumas, J.-B. (1826). Mémoire sur quelques points de la théorie atomistique. Annales de Chimie et de Physique 33: the vapour-density method.','Values for sulfur vapour vary with temperature (S₈, S₆ and S₂ in equilibrium); the figure shown is approximate.'],
 desc:'A sealed flask of gas on a balance with its volume, temperature and pressure. The mass changes with temperature but the calculated molar mass does not, and it is compared with known formulas.',
 dur:12,hint:'Choose a sample and change the temperature. The flask holds less gas when it is hot, but M = mRT ÷ pV stays the same.',
 init:()=>({g:'O2',T:298}),
 watch(p){const g=C2_DK[Math.min(4,Math.floor(p*5))];return {g,T:Math.round(lerp(C2_DUMAS[g].minT||280,(C2_DUMAS[g].minT||280)+120,(p*5)%1))}},
 ui:[{choose:C2_DK.map(k=>[k,C2_DUMAS[k].n.split(',')[0]]),label:'Sample',get:s=>s.g,act:'g'},{range:'T',label:'Temperature',min:250,max:800,step:10,get:s=>s.T,act:'T',show:v=>v+' K'}],
 on:{g(s,v){s.g=v;if(C2_DUMAS[v].minT)s.T=Math.max(s.T,C2_DUMAS[v].minT+50)},T(s,v){s.T=+v}},
 draw(s){
  const d=C2_DUMAS[s.g],Tk=Math.max(s.T,d.minT||0),p=101.325,V=1,m=p*V*d.M/(C2_R*Tk),M=m*C2_R*Tk/(p*V);
  let out=heading('Weigh the gas, work out the molar mass');
  out+=P('M130 90Q90 120 90 170Q90 230 150 236Q210 230 210 170Q210 120 170 90V58H130Z',C.ink,2.5,'#eef4f8');
  out+=Ci(150,172,48,'#d6e6f2')+TB(150,178,C2_f(s.g==='S'?'S?':s.g==='Hg'?'Hg':s.g),17,C.ink);
  out+=R(70,250,160,14,'#7b8c96','none',3)+R(80,264,140,44,'#fff',C.ink,6)+TM(150,293,C2_n(m,3)+' g',17,C.ink);
  out+=R(260,60,310,190,'#fff',C.grid,10);
  out+=TF(275,86,'V = 1.000 L    p = 101.3 kPa',13,C.muted,'start')+TF(275,108,`T = ${Tk} K (${Tk-273} °C)`,13,C.muted,'start');
  out+=TM(415,144,'M = mRT ÷ pV',17,C.ink)+TF(415,170,`= ${C2_n(m,3)} × 8.314 × ${Tk} ÷ (101.3 × 1)`,13,C.muted)+TB(415,202,`= ${C2_n(M,1)} g/mol`,18,C.blue);
  out+=TF(415,232,d.n+(s.T<Tk?' · raised to '+Tk+' K to vaporise':''),13,C.ink);
  out+=R(60,320,480,40,s.g==='S'||s.g==='Hg'?C.amberp:C.greenp,'none',8)+TF(300,345,d.note,13,C.ink);
  return {svg:out,phase:`${d.n}: ${C2_n(m,3)} g in 1 L at ${Tk} K and 101.3 kPa gives M = ${C2_n(M,1)} g/mol. ${d.note}.`};
 }});

const C2_VDW={H2:{n:'Hydrogen',a:.2476,b:.02661,c:C.muted},N2:{n:'Nitrogen',a:1.370,b:.0387,c:C.blue},CO2:{n:'Carbon dioxide',a:3.640,b:.04267,c:C.coral}};// a in L²·bar/mol², b in L/mol
function C2_Z(g,p,T){const {a,b}=C2_VDW[g],RT=C2_RL*T;if(p<=0)return 1;let V=RT/p+b;for(let i=0;i<60;i++){const f=p*V**3-(p*b+RT)*V*V+a*V-a*b,df=3*p*V*V-2*(p*b+RT)*V+a;const nV=V-f/df;if(!(nV>b)){V=(V+b)/2+1e-6;continue}if(Math.abs(nV-V)<1e-10){V=nV;break}V=nV}return p*V/RT}
SCENE({id:'ideal-gas-real',name:'Real gases',tag:'Where pV = nRT breaks down',
 definition:'Real molecules attract each other and take up space, so at high pressure a real gas departs from pV = nRT. The compression factor Z = pV ÷ nRT is exactly 1 for an ideal gas; attraction pulls it below 1 and molecular size pushes it above. Johannes van der Waals gave a corrected equation in 1873.',
 example:'At 320 K and 100 bar, carbon dioxide takes up well under half the volume the ideal gas law predicts (Z ≈ 0.4 in the van der Waals model), while hydrogen takes up a little more (Z ≈ 1.07).',
 research:['van der Waals, J. D. (1873). Over de continuïteit van den gas- en vloeistoftoestand. PhD thesis, Leiden.','Andrews, T. (1869). On the continuity of the gaseous and liquid states of matter. Philosophical Transactions 159: the critical point of carbon dioxide near 31 °C.'],
 desc:'The compression factor Z of hydrogen, nitrogen and carbon dioxide against pressure, calculated from the van der Waals equation at the chosen temperature, with the ideal line at Z = 1.',
 dur:12,hint:'Move the pressure cursor and the temperature. Carbon dioxide strays furthest, especially when cool: its molecules attract strongly. Hotter gases behave more ideally.',
 init:()=>({T:320,p:100}),
 watch(p){return {T:320,p:Math.round(p*400)}},
 ui:[{range:'T',label:'Temperature',min:320,max:600,step:10,get:s=>s.T,act:'T',show:v=>v+' K'},{range:'p',label:'Pressure',min:0,max:400,step:5,get:s=>s.p,act:'p',show:v=>v+' bar'}],
 on:{T(s,v){s.T=+v},p(s,v){s.p=+v}},
 draw(s){
  let out=heading(`Compression factor at ${s.T} K (van der Waals model)`);
  const A=C2_plot(80,60,440,230,{x0:0,x1:400,y0:.2,y1:1.6,xticks:[0,100,200,300,400],yticks:[.2,.6,1,1.4],xlab:'pressure (bar)',ylab:'Z = pV ÷ nRT',yfmt:v=>fmt(v)});out+=A.svg;
  out+=L(A.px(0),A.py(1),A.px(400),A.py(1),C.green,2,'stroke-dasharray="6 4"')+TF(A.px(395),A.py(1)-7,'ideal',13,C.green,'end');
  const vals={};
  for(const g of ['H2','N2','CO2']){const pts=[];for(let pp=0;pp<=400;pp+=5){pts.push([A.px(pp),A.py(clamp(C2_Z(g,pp,s.T),.2,1.6))])}out+=C2_poly(pts,C2_VDW[g].c,3);vals[g]=C2_Z(g,s.p,s.T)}
  out+=L(A.px(s.p),60,A.px(s.p),290,C.ink,1.5,'stroke-dasharray="3 3"');
  for(const g of ['H2','N2','CO2'])out+=Ci(A.px(s.p),A.py(clamp(vals[g],.2,1.6)),5,C2_VDW[g].c);
  ['H2','N2','CO2'].forEach((g,i)=>out+=R(80+i*150,336,14,14,C2_VDW[g].c,'none',3)+TF(100+i*150,348,`${C2_f(g)}  Z = ${C2_n(vals[g],2)}`,13,C.ink,'start'));
  return {svg:out,phase:`At ${s.p} bar and ${s.T} K: hydrogen Z = ${C2_n(vals.H2,2)}, nitrogen ${C2_n(vals.N2,2)}, carbon dioxide ${C2_n(vals.CO2,2)}. Below 1, attractions squeeze the gas; above 1, the molecules’ own size wins. These curves come from the van der Waals model, which is itself approximate.`};
 }});

/* ======================= Lesson: Flame spectra ======================= */
const C2_FL={
 Li:{n:'Lithium',col:'#d8243c',lines:[{nm:670.8,w:3},{nm:610.4,w:1.2}],band:false},
 Na:{n:'Sodium',col:'#ffb21a',lines:[{nm:589.0,w:2.4},{nm:589.6,w:2.4}],band:false},
 K:{n:'Potassium',col:'#c49be0',lines:[{nm:766.5,w:2.6},{nm:769.9,w:2.6},{nm:404.4,w:1.2}],band:false},
 Ca:{n:'Calcium',col:'#ff7a33',lines:[{nm:422.7,w:1.6},{nm:554,w:6},{nm:622,w:10}],band:true},
 Ba:{n:'Barium',col:'#b8e06a',lines:[{nm:553.5,w:1.8},{nm:513,w:7},{nm:524,w:7}],band:true},
 Cu:{n:'Copper',col:'#3fc4b0',lines:[{nm:435,w:6},{nm:488,w:8},{nm:526,w:8}],band:true}
};
const C2_FLK=['Li','Na','K','Ca','Ba','Cu'];
SCENE({id:'flame-spectra',name:'Flame tests',tag:'Each element colours a flame its own way',
 definition:'Heated in a hot, nearly colourless flame, an element’s atoms give out light at particular wavelengths, so each colours the flame its own way. Seen through a prism, the colour splits into sharp bright lines that identify the element.',
 example:'Sodium gives an intense yellow from two lines near 589 nm; lithium a crimson line at 671 nm; potassium a pale lilac, from lines at the edge of the red and violet.',
 research:['Bunsen, R. & Roscoe, H. (1857): the near-colourless gas burner developed in Bunsen’s Heidelberg laboratory.','Kirchhoff, G. & Bunsen, R. (1860). Chemische Analyse durch Spectralbeobachtungen. Annalen der Physik 110.','Line positions from the NIST Atomic Spectra Database; the calcium, barium and copper colours come mostly from molecular bands, drawn approximately.'],
 desc:'A burner flame coloured by the chosen element, above its spectrum: sharp atomic lines for lithium, sodium and potassium, and broader molecular bands (approximate) for calcium, barium and copper.',
 dur:12,hint:'Choose an element to put in the flame. Compare the flame’s colour with the lines in its spectrum. Real flame tests use a hot burner and acid: only with supervision.',
 init:()=>({e:'Na'}),
 watch(p){return {e:C2_FLK[Math.min(5,Math.floor(p*6))]}},
 ui:[{choose:C2_FLK.map(k=>[k,C2_FL[k].n]),label:'Element',get:s=>s.e,act:'e'}],
 on:{e(s,v){s.e=v;AUDIO.noise({dur:.18,gain:.05})}},
 draw(s){
  const d=C2_FL[s.e];let out=heading(d.n+' in the flame');
  out+=R(120,210,60,90,'#9aa8b4','none',4)+R(108,296,84,12,'#7b8c96','none',3);
  out+=P('M150 206C112 170 128 120 150 72C172 120 188 170 150 206Z',d.col,2,d.col,'opacity=".85"')+P('M150 200C136 180 140 160 150 140C160 160 164 180 150 200Z','#9fc5f8',1.5,'#9fc5f8','opacity=".7"');
  out+=TF(150,330,'burner',13,C.muted);
  out+=TF(400,244,'its light through a prism',13,C.muted);
  out+=C2_strip(220,110,360,70,d.lines.map(l=>({...l,glow:true})),'dark');
  const sharp=d.lines.filter(l=>l.w<4).map(l=>l.nm).sort((a,b)=>a-b),groups=[];
  for(const nm of sharp){const g=groups[groups.length-1];if(g&&nm-g[g.length-1]<8)g.push(nm);else groups.push([nm])}
  groups.forEach(g=>{const x=C2_nmx(220,360,(g[0]+g[g.length-1])/2),anc=x>520?'end':x<260?'start':'middle';out+=L(x,96,x,108,C.ink,1)+TF(x,90,g.map(v=>v.toFixed(1)).join(', ')+' nm',13,C.ink,anc)});
  out+=R(220,268,360,62,d.band?C.amberp:C.greenp,'none',8)+TF(400,292,d.band?'Broad bands: light from molecules (oxides,':'Sharp lines: light from single atoms,',13,C.ink)+TF(400,312,d.band?'hydroxides, chlorides) formed in the flame':'a fingerprint for the element',13,C.ink);
  return {svg:out,phase:`${d.n} colours the flame; its light splits into ${d.band?'broad molecular bands (positions approximate)':'sharp lines at '+d.lines.map(l=>fmt(l.nm)+' nm').join(', ')}. Each element’s pattern is its own.`};
 }});

const C2_SL={Na:{n:'Na',l:[589.0,589.6]},Li:{n:'Li',l:[670.8,610.4]},K:{n:'K',l:[766.5,769.9,404.4]},Ca:{n:'Ca',l:[422.7]},Cs:{n:'Cs',l:[455.5,459.3]},Rb:{n:'Rb',l:[420.2,421.6,780.0]}};
const C2_SLK=['Na','Li','K','Ca','Cs','Rb'];
const C2_SAMPLES=[['Na','Li','Cs'],['Na','K','Rb'],['Li','Ca'],['Na','Ca','Cs','K'],['K','Rb','Li'],['Na','Cs']];
SCENE({id:'flame-spectra-spectroscope',name:'Finding new elements',tag:'Two blue lines nobody had seen',
 definition:'With a spectroscope, Gustav Kirchhoff and Robert Bunsen could pick out every element in a mixture by its lines. In 1860 they found two blue lines in Dürkheim mineral water that matched no known element, and named the new metal caesium, from the Latin for sky blue. A year later deep red lines in the mineral lepidolite gave rubidium.',
 example:'Tens of tonnes of the spring water yielded only a few grams of caesium compounds, yet its two lines near 456 and 459 nm were plain to see.',
 research:['Kirchhoff, G. & Bunsen, R. (1861). Chemische Analyse durch Spectralbeobachtungen, zweite Abhandlung. Annalen der Physik 113: caesium (1860) and rubidium (1861).','Line wavelengths: NIST Atomic Spectra Database (strongest visible lines; rubidium’s red line at 780 nm is at the edge of vision).'],
 desc:'The spectrum of a mystery sample, with reference lines for six elements that can be laid over it. The learner adds references until every line is explained.',
 dur:12,hint:'Add reference elements until every bright line in the sample is matched, then check. A new sample gives a different mix.',
 init:()=>({smp:0,refs:[],checked:false}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {smp:0,refs:['Na','Li','Cs'].slice(0,k),checked:k>=3}},
 ui:[...C2_SLK.map(k=>({b:k,act:'ref',arg:k})),{b:'Check',act:'check'},{b:'New sample',act:'new'}],
 on:{ref(s,k){const i=s.refs.indexOf(k);if(i>=0)s.refs.splice(i,1);else s.refs.push(k);s.checked=false;return 'keep'},check(s){s.checked=true;return 'keep'},new(s){s.smp=(s.smp+1+nextSeed()%(C2_SAMPLES.length-1))%C2_SAMPLES.length;s.refs=[];s.checked=false;return 'keep'}},
 draw(s,f,X){
  const smp=C2_SAMPLES[s.smp],lines=[].concat(...smp.map(k=>C2_SL[k].l.map(nm=>({nm,w:2.2,glow:true}))));
  let out=heading('Which elements are in the sample?');
  out+=TF(80,72,'sample',13,C.muted,'start')+C2_strip(80,80,460,54,lines,'dark',{ticks:false});
  out+=TF(80,160,'references',13,C.muted,'start');
  C2_SLK.forEach((k,i)=>{const y=168+i*24,on=s.refs.includes(k);
   out+=R(80,y,460,18,on?'#0d1418':'#eef3f6','none',3);
   if(on)for(const nm of C2_SL[k].l)out+=R(C2_nmx(80,460,nm)-1.2,y,2.4,18,C2_wl(nm),'none',0);
   out+=hit(X,'ref',k,'Toggle '+k,R(30,y,40,18,on?C.ink:'#fff',C.line,4)+TBF(50,y+14,k,13,on?'#fff':C.ink));});
  for(const t of [400,500,600,700])out+=TF(C2_nmx(80,460,t),330,t+' nm',13,C.muted);
  const ok=s.refs.length===smp.length&&smp.every(k=>s.refs.includes(k));
  if(s.checked)out+=R(80,340,460,32,ok?C.greenp:C.coralp,'none',8)+TF(310,361,ok?'Every line explained: '+smp.join(', '):'Not yet: '+(smp.some(k=>!s.refs.includes(k))?'some lines are unexplained':'a reference has lines the sample lacks'),13,C.ink);
  return {svg:out,phase:s.checked?(ok?`Correct: the sample contains ${smp.join(', ')}. Bunsen and Kirchhoff found caesium and rubidium exactly this way, as lines no known element could explain.`:'Some lines are still unmatched, or a chosen reference adds lines the sample does not show.'):'Match each bright line in the sample with a reference element. Caesium’s pair of blue lines was the first new element found by spectroscopy.'};
 }});

const C2_FRAUN=[[393.4,'K'],[396.8,'H'],[430.8,'G'],[486.1,'F'],[517.3,'b'],[527.0,'E'],[589.0,'D'],[589.6,''],[656.3,'C'],[686.7,'B'],[759.4,'A']];
SCENE({id:'flame-spectra-sun',name:'The chemistry of the stars',tag:'Dark lines in sunlight match bright lines in flames',
 definition:'Joseph von Fraunhofer mapped hundreds of dark lines in sunlight. Kirchhoff showed in 1859 that a cool gas absorbs exactly the wavelengths it emits when hot, so the Sun’s dark lines reveal its elements: sodium, iron, calcium, hydrogen. In 1868 a new yellow line seen in the Sun’s edge was named helium, found on Earth only in 1895.',
 example:'Shine white light through a cool sodium flame and two dark lines appear exactly where a hot sodium flame shows two bright ones: Fraunhofer’s D lines at 589.0 and 589.6 nm.',
 research:['Fraunhofer, J. (1817). Bestimmung des Brechungs- und Farbenzerstreuungs-Vermögens verschiedener Glasarten. Denkschriften der Akademie München 5: the dark solar lines.','Kirchhoff, G. (1860). Über das Verhältnis zwischen dem Emissionsvermögen und dem Absorptionsvermögen der Körper für Wärme und Licht. Annalen der Physik 109.','Janssen, J. and Lockyer, N. (1868): a yellow line at 587.6 nm in solar prominences; Ramsay, W. (1895) found helium on Earth.'],
 desc:'Four spectra: a hot sodium flame (bright lines), white light (continuous), white light through cooler sodium vapour (dark lines in the same places) and sunlight with Fraunhofer’s lettered lines, plus helium’s line from the solar prominences.',
 dur:12,hint:'Step through the light sources. The dark lines of absorption sit exactly where the bright lines of emission are. Never look at the Sun directly or through optics.',
 init:()=>({m:'absorb',he:false}),
 watch(p){const m=['hot','white','absorb','sun'][Math.min(3,Math.floor(p*4))];return {m,he:p>.9}},
 ui:[{choose:[['hot','Hot sodium'],['white','White light'],['absorb','Through sodium'],['sun','Sunlight']],label:'Source',get:s=>s.m,act:'m'},{b:'Show helium’s line',act:'he'}],
 on:{m(s,v){s.m=v},he(s){s.he=!s.he}},
 draw(s){
  let out=heading({hot:'Emission: hot sodium glows at its own wavelengths',white:'A glowing solid gives every colour',absorb:'Absorption: cool sodium removes the same wavelengths',sun:'Sunlight with Fraunhofer’s dark lines'}[s.m]);
  const na=[{nm:589.0,w:2.4},{nm:589.6,w:2.4}];
  if(s.m==='hot')out+=C2_strip(50,90,500,90,na.map(l=>({...l,glow:true})),'dark');
  else if(s.m==='white')out+=C2_strip(50,90,500,90,[],'bright');
  else if(s.m==='absorb')out+=C2_strip(50,90,500,90,na,'bright');
  else{out+=C2_strip(50,90,500,90,C2_FRAUN.map(([nm])=>({nm,w:1.8})),'bright');
   C2_FRAUN.filter(f=>f[1]).forEach(([nm,l],i)=>{const x=C2_nmx(50,500,nm);out+=TBF(l==='K'?x-2:l==='H'?x+2:x,84,l,13,C.ink,l==='K'?'end':l==='H'?'start':'middle')});}
  if(s.he){const x=C2_nmx(50,500,587.6);out+=R(x-14,210,28,28,'#0d1418','none',3)+R(x-1.5,210,3,28,C2_wl(587.6),'none',0)+TF(x-20,229,'helium 587.6 nm, from the Sun’s edge',13,C.ink,'end')}
    out+=R(50,250,500,96,'#fff',C.grid,10);
  const txt={hot:['A hot gas gives bright lines on a dark background.','Sodium: two yellow lines at 589.0 and 589.6 nm.'],white:['A hot solid or dense gas gives a continuous rainbow.','No lines: every wavelength is present.'],absorb:['Pass white light through cooler sodium vapour:','dark lines appear exactly where sodium emits.'],sun:['The Sun’s cooler outer layers absorb: D = sodium, C and F = hydrogen,','H and K = calcium, b = magnesium. Chemistry at 150 million km.']}[s.m];
  out+=TF(300,284,txt[0],13,C.ink)+TF(300,308,txt[1],13,C.ink)+TF(300,334,'Wavelengths: NIST; Fraunhofer’s letters as he used them',13,C.muted);
  return {svg:out,phase:{hot:'A hot sodium flame shines at 589.0 and 589.6 nm only.',white:'White light contains every wavelength.',absorb:'Cool sodium vapour absorbs exactly the wavelengths it emits when hot: Kirchhoff’s law.',sun:'Sunlight’s dark lines match elements in flames: the Sun contains sodium, hydrogen, calcium, magnesium and iron.'}[s.m]+(s.he?' Helium’s line at 587.6 nm matched no known element in 1868.':'')};
 }});

/* ======================= Lesson: Atomic weights ======================= */
const C2_AW=[['H',1.008],['C',12.011],['N',14.007],['O',15.999],['Na',22.990],['Mg',24.305],['S',32.06],['Cl',35.45],['Fe',55.845],['Cu',63.546],['Zn',65.38],['Ag',107.868]];
SCENE({id:'atomic-weights',name:'Prout’s hypothesis',tag:'Are all atoms made of hydrogen?',
 definition:'William Prout suggested in 1815 that every atomic weight is a whole multiple of hydrogen’s, as if all atoms were built from hydrogen. Precise measurements, above all by Jean Servais Stas in the 1860s, found weights like chlorine’s 35.45 that are not whole numbers. The answer, isotopes, came only in 1913.',
 example:'Chlorine is about three-quarters chlorine-35 and one-quarter chlorine-37, so its average atomic weight is 35.45. Prout’s idea was wrong as stated but pointed at something real: atoms are built from smaller parts.',
 research:['Prout, W. (1815, published anonymously). On the relation between the specific gravities of bodies in their gaseous state and the weights of their atoms. Annals of Philosophy 6; and (1816) 7.','Stas, J. S. (1860). Recherches sur les rapports réciproques des poids atomiques. Brussels.','Isotopic abundances: IUPAC Commission on Isotopic Abundances and Atomic Weights (chlorine-35 75.76%, chlorine-37 24.24%).'],
 desc:'Atomic weights of twelve elements on a number line with whole numbers marked, and bars showing how far each is from the nearest whole number. Chlorine is shown split into its isotopes.',
 dur:12,hint:'Choose an element to compare its weight with the nearest whole number. Chlorine and copper are far from whole; isotopes explain why.',
 init:()=>({e:'Cl'}),
 watch(p){return {e:C2_AW[Math.min(11,Math.floor(p*12))][0]}},
 ui:[{choose:C2_AW.map(([e])=>[e,e]),label:'Element',get:s=>s.e,act:'e'}],
 on:{e(s,v){s.e=v}},
 draw(s){
  let out=heading('How far from a whole number?');
  const A=C2_plot(80,70,440,150,{x0:0,x1:12,y0:-.5,y1:.5,yticks:[-.5,0,.5],ylab:'distance from nearest whole number',yfmt:v=>(v>0?'+':'')+fmt(v)});out+=A.svg;
  C2_AW.forEach(([e,w],i)=>{const d=w-Math.round(w),x=A.px(i+.5),hi=e===s.e;out+=R(x-12,Math.min(A.py(d),A.py(0)),24,Math.abs(A.py(d)-A.py(0))||1.5,hi?C.coral:(Math.abs(d)>.2?'#e3a698':C.line),'none',3)+TBF(x,A.py(-.5)+18,e,13,hi?C.coral:C.ink)});
  const [e,w]=C2_AW.find(a=>a[0]===s.e),near=Math.round(w);
  out+=R(80,262,440,94,'#fff',C.grid,10)+TB(300,288,`${e}: ${w} (nearest whole number ${near})`,16,C.ink);
  if(e==='Cl')out+=TF(300,312,'75.76% ³⁵Cl (34.969) + 24.24% ³⁷Cl (36.966)',13,C.ink)+TF(300,334,'= 26.49 + 8.96 = 35.45: an average of two isotopes',13,C.green);
  else out+=TF(300,316,Math.abs(w-near)>.2?'Far from whole: a mixture of isotopes, found from 1913':'Close to whole: mostly a single isotope',13,C.ink)+TF(300,338,'Even single isotopes are not exactly whole (binding energy)',13,C.muted);
  return {svg:out,phase:`${e} has atomic weight ${w}, ${C2_n(Math.abs(w-near),3)} from ${near}. ${e==='Cl'?'Chlorine’s 35.45 is the average of chlorine-35 and chlorine-37, which Stas’s careful work in the 1860s could not have explained.':'Prout’s whole numbers fail for elements that are mixtures of isotopes.'}`};
 }});

const C2_CAN={
 C:{n:'Carbon',cmps:[['methane','CH4',16.04,1],['carbon monoxide','CO',28.01,1],['carbon dioxide','CO2',44.01,1],['ethane','C2H6',30.07,2],['propane','C3H8',44.10,3],['benzene','C6H6',78.11,6]],w:12.01},
 O:{n:'Oxygen',cmps:[['water','H2O',18.02,1],['carbon monoxide','CO',28.01,1],['nitric oxide','NO',30.01,1],['oxygen gas','O2',32.00,2],['carbon dioxide','CO2',44.01,2]],w:16.00},
 H:{n:'Hydrogen',cmps:[['hydrogen chloride','HCl',36.46,1],['hydrogen gas','H2',2.016,2],['water','H2O',18.02,2],['ammonia','NH3',17.03,3],['methane','CH4',16.04,4]],w:1.008}
};
SCENE({id:'atomic-weights-cannizzaro',name:'Cannizzaro’s method',tag:'The smallest amount is one atom',
 definition:'Stanislao Cannizzaro showed in 1858 how to get reliable atomic weights from Avogadro’s hypothesis. Find the molar mass of many gaseous compounds of an element from their vapour densities; the mass of the element in one mole of each is always a whole multiple of a smallest amount, and that smallest amount is its atomic weight.',
 example:'A mole of methane, carbon monoxide or carbon dioxide contains 12 g of carbon; ethane 24 g, benzene 72 g. Never less than 12: so carbon’s atomic weight is 12, not 6.',
 research:['Cannizzaro, S. (1858). Sunto di un corso di filosofia chimica. Il Nuovo Cimento 7 (distributed at the Karlsruhe Congress, 1860).','Molar masses: IUPAC standard atomic weights (2021), rounded.'],
 desc:'For each compound containing the chosen element, its molar mass and a bar for the mass of the element in one mole. The bars are whole multiples of the smallest, which is the atomic weight.',
 dur:12,hint:'Choose an element. Every bar is a whole multiple of the shortest one. For hydrogen the gas itself contains two, so hydrogen gas must be H₂.',
 init:()=>({e:'C'}),
 watch(p){return {e:['C','O','H'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['C','Carbon'],['O','Oxygen'],['H','Hydrogen']],label:'Element',get:s=>s.e,act:'e'}],
 on:{e(s,v){s.e=v}},
 draw(s){
  const d=C2_CAN[s.e],maxN=Math.max(...d.cmps.map(c=>c[3]));let out=heading(`${d.n} in one mole of each compound`);
  out+=TF(160,62,'compound (molar mass)',13,C.muted,'end')+TF(180,62,`grams of ${d.n.toLowerCase()} per mole`,13,C.muted,'start');
  d.cmps.forEach(([name,f,M,k],i)=>{const y=74+i*40,wpx=k/maxN*330;
   out+=TB(160,y+20,`${name}`,14,C.ink,'end')+TF(160,y+36,`${C2_f(f)}, ${C2_n(M,M<10?3:2)} g/mol`,13,C.muted,'end');
   for(let j=0;j<k;j++)out+=R(180+j*wpx/k,y+6,wpx/k-2,24,j===0?C.blue:'#9cc4e4','none',3);
   out+=TBF(186+wpx,y+24,C2_n(k*d.w,s.e==='H'?3:2)+' g',13,C.ink,'start');});
  out+=R(120,326,360,38,C.greenp,'none',8)+TB(300,350,`Smallest: ${C2_n(d.w,s.e==='H'?3:2)} g, so ${d.n.toLowerCase()} weighs ${C2_n(d.w,s.e==='H'?3:2)}`,15,C.ink);
  return {svg:out,phase:`Every compound of ${d.n.toLowerCase()} contains a whole multiple of ${C2_n(d.w,s.e==='H'?3:2)} g per mole, so that is one atom’s worth.${s.e==='H'?' Hydrogen gas contains twice the smallest amount: the gas is made of H₂ molecules.':''}`};
 }});

const C2_KAR={
 water:{n:'Water',old:'HO',oldW:{H:1,O:8},neu:'H2O',neuW:{H:1,O:16}},
 methane:{n:'Methane',old:'C2H4',oldW:{C:6,H:1},neu:'CH4',neuW:{C:12,H:1}},
 acetic:{n:'Acetic acid',old:'C4H4O4',oldW:{C:6,H:1,O:8},neu:'C2H4O2',neuW:{C:12,H:1,O:16}}
};
const C2_KARK=['water','methane','acetic'];
function C2_parse(f){const out=[];f.replace(/([A-Z][a-z]?)(\d*)/g,(m,e,n)=>{out.push([e,n?+n:1]);return m});return out}
SCENE({id:'atomic-weights-karlsruhe',name:'The Karlsruhe Congress',tag:'Agreeing what a formula means',
 definition:'By the 1850s chemists used rival systems: many took carbon as 6 and oxygen as 8 (“equivalents”), so the same substance had different formulas in different books. About 140 chemists met at Karlsruhe in September 1860 to settle it. Cannizzaro’s pamphlet, handed out at the end, persuaded most of them over the following years.',
 example:'Kekulé’s 1861 textbook listed many rival formulas proposed for acetic acid. Lothar Meyer said that on reading Cannizzaro’s pamphlet “the scales fell from my eyes”.',
 research:['Cannizzaro, S. (1858). Sunto di un corso di filosofia chimica. Il Nuovo Cimento 7.','Kekulé, A. (1861). Lehrbuch der organischen Chemie, vol. 1: a table of formulas proposed for acetic acid.','Meyer, L. (1891). Afterword to his German edition of Cannizzaro’s Sunto (Ostwalds Klassiker 30): “the scales fell from my eyes”.'],
 desc:'A compound written in the equivalent-weight system (carbon 6, oxygen 8) and in Cannizzaro’s atomic weights (carbon 12, oxygen 16), with the masses that each formula adds up to.',
 dur:10,hint:'Choose a compound and compare its formula in the two systems. The masses still balance; only the counts of atoms differ. Water is where the systems disagree most.',
 init:()=>({c:'acetic'}),
 watch(p){return {c:C2_KARK[Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:C2_KARK.map(k=>[k,C2_KAR[k].n]),label:'Compound',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=v}},
 draw(s){
  const d=C2_KAR[s.c];let out=heading(`${d.n} before and after Karlsruhe (1860)`);
  const col=(x,title,f,W,good)=>{let o=R(x,62,250,210,good?C.greenp:'#fff',C.grid,10)+TF(x+125,86,title,13,C.muted)+TB(x+125,128,C2_f(f),26,C.ink);
   const parts=C2_parse(f);let tot=0;o+=TF(x+125,158,Object.entries(W).map(([e,w])=>e+' = '+w).join(', '),13,C.muted);
   parts.forEach(([e,n],i)=>{const m=n*W[e];tot+=m;o+=TF(x+125,184+i*20,`${n} × ${e} (${W[e]}) = ${m}`,13,C.ink)});
   o+=TB(x+125,258,'formula mass '+tot,15,C.ink);return o};
  out+=col(36,'Equivalents (1840s–50s)',d.old,d.oldW,false)+col(314,'Atomic weights (Cannizzaro)',d.neu,d.neuW,true);
  out+=R(60,292,480,64,C.pale,'none',10);
  out+=TF(300,318,s.c==='water'?'HO weighs 9: an “equivalent”, half a molecule of steam':'Same mass of substance, different counts of atoms',13,C.ink)+TF(300,340,'Gas densities (Avogadro) decided which formula counts real molecules',13,C.muted);
  return {svg:out,phase:`${d.n} was ${C2_f(d.old)} with carbon 6 and oxygen 8, and ${C2_f(d.neu)} with carbon 12 and oxygen 16. After Karlsruhe, chemists gradually agreed on the second, the formulas used today.`};
 }});
