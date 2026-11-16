/* ===================== Chemistry era 5 · Reactions ===================== */
// How fast, how far and which way: rates and activation energy, equilibrium and Le Chatelier, acids and bases,
// redox and batteries, catalysis (with Haber–Bosch and its ethics), and free energy. Pictures are pure functions
// of state; any randomness is seeded with rng(), never Math.random. Sound only in on() handlers.

const C5_R=8.314; // J mol⁻¹ K⁻¹
const C5_poly=(pts,col,w=2.4,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function C5_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
function C5_wrap(text,max){const out=[];let line='';for(const w of String(text).split(' ')){if(line&&(line+' '+w).length>max){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out}
const C5_lines=(x,y,lines,size=13,col=C.ink,anchor='start',dy=17)=>lines.map((l,i)=>TF(x,y+i*dy,l,size,col,anchor)).join('');
function C5_btn(X,act,arg,label,x,y,w,h,text,o={}){
 const inner=R(x,y,w,h,o.fill||'#fff',o.sel?C.coral:(o.stroke||C.line),9,o.sel?'stroke-width="3"':'stroke-width="1.5"')+TF(x+w/2,y+h/2+5,text,o.size||13,o.ink||C.ink,'middle',o.bold?'font-weight="700"':'');
 return hit(X,act,arg,label,inner);
}
// Scientific notation with a superscript exponent, e.g. 4.6 × 10⁻³.
const C5_SUP={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
function C5_sci(v,d=2){if(v===0)return '0';if(!isFinite(v))return '∞';const e=Math.floor(Math.log10(Math.abs(v)));if(e>=-2&&e<=3)return Number(v.toPrecision(d+1)).toString();const m=v/Math.pow(10,e);return m.toFixed(d-1)+' × 10'+String(e).split('').map(c=>C5_SUP[c]).join('')}
// Complementary error function (Abramowitz & Stegun 7.1.26).
function C5_erfc(x){const t=1/(1+.3275911*x);const y=t*(.254829592+t*(-.284496736+t*(1.421413741+t*(-1.453152027+t*1.061405429))));return y*Math.exp(-x*x)}
// Maxwell–Boltzmann energy distribution (per kJ/mol) and the fraction with energy above Ea.
const C5_mb=(E,T)=>{const kT=C5_R*T/1000;return 2*Math.sqrt(E/Math.PI)*Math.pow(1/kT,1.5)*Math.exp(-E/kT)};
const C5_above=(Ea,T)=>{const x=Ea/(C5_R*T/1000);return 2*Math.sqrt(x/Math.PI)*Math.exp(-x)+C5_erfc(Math.sqrt(x))};
function C5_bisect(f,a,b,n=80){let fa=f(a);for(let i=0;i<n;i++){const m=(a+b)/2,fm=f(m);if((fm>0)===(fa>0)){a=m;fa=fm}else b=m}return (a+b)/2}

/* ================================================================ reaction-rates */
SCENE({id:'reaction-rates',name:'Why heat speeds reactions',tag:'Collisions and activation energy',
 definition:'Molecules react only when they collide with at least a minimum energy, the activation energy Ea. Their energies are spread out (the Maxwell–Boltzmann distribution), and only the high-energy tail can react. Warming the sample stretches the tail, so the reacting fraction rises steeply.',
 example:'For a reaction with Ea = 50 kJ/mol, warming from 25 °C to 35 °C nearly doubles the fraction of molecules above Ea, which is the source of the old rule that 10 °C doubles a rate.',
 desc:'A curve shows how many molecules have each energy at your temperature, with a dashed curve at 25 °C. The shaded tail beyond the activation-energy line is the fraction that can react. A tile gives that fraction as “1 in N” and how it compares with 25 °C.',
 research:'Arrhenius, S. (1889). Über die Reaktionsgeschwindigkeit bei der Inversion von Rohrzucker durch Säuren. Zeitschrift für physikalische Chemie 4, 226–248. Maxwell, J. C. (1860) and Boltzmann, L. (1872) for the energy distribution. Trautz, M. (1916) and Lewis, W. C. McC. (1918) for collision theory. The shape is exact for an ideal gas; the 10 °C doubling rule holds only near Ea ≈ 50 kJ/mol.',
 dur:10,hint:'Raise the temperature and watch the tail beyond the line grow. Then raise the activation energy: the same warming now multiplies the rate more.',
 init:()=>({T:298,Ea:20}),
 watch(p){return {T:Math.round(lerp(273,450,smooth(p/.85))),Ea:20}},
 ui:[{range:'T',label:'Temperature',min:250,max:600,step:1,get:s=>s.T,act:'T',show:v=>v+' K ('+(v-273)+' °C)'},
  {range:'Ea',label:'Activation energy',min:5,max:60,step:1,get:s=>s.Ea,act:'Ea',show:v=>v+' kJ/mol'}],
 on:{T(s,v){s.T=Number(v)},Ea(s,v){s.Ea=Number(v)}},
 draw(s){
  let out=heading('Only the fast tail can react',26);
  const Emax=Math.max(30,Math.ceil(s.Ea*1.25/30)*30),ymax=.35,pl=C5_plot(70,56,480,200,[0,Emax],[0,ymax],{xt:range(4).map(i=>[i*Emax/3,String(Math.round(i*Emax/3))+(i===3?' kJ/mol':'')]),yt:[[0,'0']],xl:'energy of a molecule',xlDy:32,yl:'share of molecules'});out+=pl.svg;
  const ea=Math.min(s.Ea,Emax),tail=[];for(let i=0;i<=60;i++){const E=ea+(Emax-ea)*i/60;tail.push([pl.X(E),pl.Y(Math.min(ymax,C5_mb(E,s.T)))])}
  if(s.Ea<Emax)out+=P('M'+fmt(pl.X(ea))+' '+fmt(pl.Y(0))+' L'+tail.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L')+' L'+fmt(pl.X(Emax))+' '+fmt(pl.Y(0))+'Z',C.coral,0,C.coralp);
  out+=C5_poly(range(121).map(i=>{const E=.01+i*Emax/120;return [pl.X(E),pl.Y(Math.min(ymax,C5_mb(E,298)))]}),C.muted,1.6,'stroke-dasharray="5 4"');
  out+=C5_poly(range(121).map(i=>{const E=.01+i*Emax/120;return [pl.X(E),pl.Y(Math.min(ymax,C5_mb(E,s.T)))]}),C.blue,3);
  if(s.Ea<=Emax){const far=ea/Emax>.6;out+=L(pl.X(ea),pl.Y(0),pl.X(ea),pl.Y(ymax),C.coral,2.4,'stroke-dasharray="6 4"')+TF(pl.X(ea)+(far?-6:6),74,'Ea = '+s.Ea,13,C.coral,far?'end':'start')}
  else out+=TF(544,74,'Ea = '+s.Ea+' → off the scale',13,C.coral,'end');
  out+=TF(220,120,'solid: your temperature',12,C.blue,'start')+TF(220,136,'dashed: 25 °C',12,C.muted,'start');
  const f=C5_above(s.Ea,s.T),f0=C5_above(s.Ea,298),ratio=f/f0;
  out+=R(70,306,230,52,'#fff',C.grid,8)+TF(185,326,'can react (above Ea)',12,C.muted)+TBF(185,348,f>.01?(f*100).toFixed(1)+'%':'1 in '+C5_sci(1/f,2),15,C.coral);
  out+=R(320,306,230,52,'#fff',C.grid,8)+TF(435,326,'compared with 25 °C',12,C.muted)+TBF(435,348,(ratio>=100?C5_sci(ratio,2):ratio.toFixed(ratio<10?2:1))+'×',15,C.blue);
  return {svg:out,phase:`At ${s.T} K, ${f>.01?(f*100).toFixed(1)+'%':'1 molecule in '+C5_sci(1/f,2)} has at least ${s.Ea} kJ/mol. That is ${ratio>=100?C5_sci(ratio,2):ratio.toFixed(2)} times the share at 25 °C, so the reaction runs about that much faster (more collisions add only a few per cent).`};
 },
 three(s,f,X,project){
  const P=project([0,10,0,10,0,6]);let out='';const Ts=range(11).map(j=>250+j*35);
  const z=(E,T)=>Math.min(6,C5_mb(E,T)*18);
  Ts.forEach((T,j)=>{out+=C5_poly(range(31).map(i=>{const E=.01+i;return P([E/3,j,z(E,T)])}),T===Ts[Math.round((s.T-250)/35)]?C.blue:C.line,T===Ts[Math.round((s.T-250)/35)]?2.6:1.1)});
  const ea=Math.min(30,s.Ea);out+=poly3([[ea/3,0,0],[ea/3,10,0],[ea/3,10,6],[ea/3,0,6]],P,C.coralp,C.coral,'opacity=".55"');
  out+=axes3(P,['energy','temperature','share'],[11,11,6.6]);
  return {svg:out,title:'The energy spread as temperature rises',caption:'Each line is the distribution at one temperature, from 250 K at the front to 600 K at the back. The coral plane is the activation energy: the part of each curve beyond it is the fraction that can react.'};
 }});

/* Arrhenius plot: the learner "measures" a rate constant at several temperatures. */
const C5_ARR={Ea:55000,A:2e9,temps:[280,300,320,340,360]};
function C5_kmeas(T,seed){const r=rng(seed*31+T)();return C5_ARR.A*Math.exp(-C5_ARR.Ea/(C5_R*T))*(1+(r-.5)*.12)}
function C5_fit(pts){const n=pts.length;if(n<2)return null;const mx=pts.reduce((a,p)=>a+p[0],0)/n,my=pts.reduce((a,p)=>a+p[1],0)/n;let sxy=0,sxx=0;pts.forEach(p=>{sxy+=(p[0]-mx)*(p[1]-my);sxx+=(p[0]-mx)**2});const m=sxy/sxx;return {m,c:my-m*mx}}
SCENE({id:'reaction-rates-arrhenius',name:'Measuring activation energy',tag:'The Arrhenius plot',
 definition:'Arrhenius found that a rate constant follows k = A·e^(−Ea/RT). Taking logarithms, ln k = ln A − (Ea/R)·(1/T): a plot of ln k against 1/T is a straight line whose slope gives the activation energy.',
 example:'If ln k falls by 6.6 for every 0.001 increase in 1/T, the slope is −6,600 K and Ea = 6,600 × 8.314 ≈ 55 kJ/mol.',
 desc:'Buttons measure the rate constant of a hidden reaction at five temperatures, with a little measurement noise. Each measurement adds a point to a plot of ln k against 1000/T. From two points on, a best-fit line appears and its slope gives your estimate of Ea beside the true value.',
 research:'Arrhenius, S. (1889). Zeitschrift für physikalische Chemie 4, 226–248, building on van ’t Hoff, J. H. (1884). Études de dynamique chimique. Laidler, K. J. (1984). The development of the Arrhenius equation. Journal of Chemical Education 61, 494–498. The reaction here is a simulation with Ea = 55 kJ/mol and ±6% noise.',
 dur:10,hint:'Measure at two temperatures far apart, then add the middle ones. Spread-out points pin the slope better than points bunched together.',
 init:()=>({got:[],seed:7}),
 watch(p){const n=Math.min(5,Math.floor(p*6.5));return {got:C5_ARR.temps.slice(0,n),seed:7}},
 ui:[{b:'Measure all',act:'all'},{b:'New noise',act:'seed'}],
 on:{m(s,v){const T=Number(v);if(!s.got.includes(T))s.got.push(T)},all(s){s.got=C5_ARR.temps.slice()},seed(s){s.seed=nextSeed()%997+1;s.got=[]}},
 draw(s,f,X){
  let out=heading('ln k against 1000 / T gives a straight line',26);
  C5_ARR.temps.forEach((T,i)=>{out+=C5_btn(X,'m',T,`Measure the rate at ${T} K`,40+i*106,44,96,34,`${T} K`,{sel:s.got.includes(T),bold:s.got.includes(T)})});
  const pts=s.got.slice().sort((a,b)=>a-b).map(T=>[1000/T,Math.log(C5_kmeas(T,s.seed))]);
  const pl=C5_plot(110,104,330,190,[2.7,3.65],[-3.5,4],{xt:[[2.8,'2.8'],[3.0,'3.0'],[3.2,'3.2'],[3.4,'3.4'],[3.6,'3.6']],yt:[[-2,'−2'],[0,'0'],[2,'2'],[4,'4']],xl:'1000 / T (per kelvin × 1000)',yl:'ln k'});out+=pl.svg;
  const fit=C5_fit(pts);
  if(fit)out+=L(pl.X(2.7),pl.Y(fit.m*2.7+fit.c),pl.X(3.65),pl.Y(fit.m*3.65+fit.c),C.blue,2.2,'stroke-dasharray="7 4"');
  pts.forEach(p=>{out+=Ci(pl.X(p[0]),pl.Y(p[1]),6,C.coral,'#fff')});
  const est=fit?-fit.m*1000*C5_R/1000:null;
  out+=R(462,110,118,52,'#fff',C.grid,8)+TF(521,130,'your estimate',12,C.muted)+TBF(521,152,est?est.toFixed(1)+' kJ':'—',15,C.blue);
  out+=R(462,172,118,52,'#fff',C.grid,8)+TF(521,192,'true Ea',12,C.muted)+TBF(521,214,s.got.length>=5?'55 kJ':'?',15,C.ink);
  out+=R(462,234,118,52,'#fff',C.grid,8)+TF(521,254,'points',12,C.muted)+TBF(521,276,String(pts.length),15,C.ink);
  out+=TF(300,350,'ln k = ln A − (Ea / R) × (1 / T): the slope is −Ea / R.',14,C.ink);
  return {svg:out,phase:fit?`The best line has slope ${(fit.m*1000).toFixed(0)} K, so Ea ≈ ${est.toFixed(1)} kJ/mol${s.got.length>=5?' against the true 55':''}. Noise moves the estimate most when the points are close together.`:'Measure at least two temperatures to draw a line.'};
 }});

/* Rate laws: zero, first and second order. */
const C5_conc=(o,k,t,a0=1)=>o===0?Math.max(0,a0-k*t):o===1?a0*Math.exp(-k*t):a0/(1+a0*k*t);
SCENE({id:'reaction-rates-order',name:'How concentration sets the pace',tag:'Rate laws and half-lives',
 definition:'A rate law says how the rate depends on concentration. In a first-order reaction the rate is proportional to [A], so every half-life is the same length. In zero order the rate is constant; in second order it falls with [A]², so each half-life is twice as long as the one before.',
 example:'Wilhelmy measured sugar splitting in acid in 1850, the first quantitative rate study: the amount left fell by the same fraction in each equal time, a first-order reaction.',
 desc:'A plot shows the concentration of A falling over time for the chosen order, with each half-life marked by a dot and a bracket. Tiles list the first three half-lives so you can compare them.',
 research:'Wilhelmy, L. (1850). Über das Gesetz, nach welchem die Einwirkung der Säuren auf den Rohrzucker stattfindet. Annalen der Physik 81, 413–433. Harcourt, A. V. & Esson, W. (1866, 1867). On the laws of connexion between the conditions of a chemical change and its amount. Philosophical Transactions 156, 193–221; 157, 117–137. Rate constants here are illustrative.',
 dur:9,hint:'Switch between the orders and compare the three half-lives: equal for first order, growing for second, shrinking for zero.',
 init:()=>({o:1,k:.2}),
 watch(p){return {o:p<.33?0:p<.66?1:2,k:.2}},
 ui:[{choose:[[0,'Zero order'],[1,'First order'],[2,'Second order']],label:'Rate law',get:s=>s.o,act:'o'},
  {range:'k',label:'Rate constant k',min:.05,max:.5,step:.01,get:s=>s.k,act:'k',show:v=>Number(v).toFixed(2)}],
 on:{o(s,v){s.o=Number(v)},k(s,v){s.k=Number(v)}},
 draw(s){
  const names=['rate = k','rate = k[A]','rate = k[A]²'];let out=heading(['Zero','First','Second'][s.o]+' order: '+names[s.o],26);
  const tmax=s.o===2?60:30,pl=C5_plot(80,56,440,200,[0,tmax],[0,1],{xt:range(5).map(i=>[i*tmax/4,String(i*tmax/4)+(i===4?' s':'')]),yt:[[0,'0'],[.25,'¼'],[.5,'½'],[1,'1']],xl:'time (s)',yl:'[A] (fraction of start)'});out+=pl.svg;
  out+=C5_poly(range(201).map(i=>{const t=i*tmax/200;return [pl.X(t),pl.Y(C5_conc(s.o,s.k,t))]}),C.blue,3);
  const halves=[];let t=0,a=1;for(let i=0;i<3;i++){const th=s.o===0?a/(2*s.k):s.o===1?Math.LN2/s.k:1/(s.k*a);t+=th;a/=2;halves.push(th);if(t<=tmax){out+=Ci(pl.X(t),pl.Y(a),6,C.coral,'#fff')+L(pl.X(t),pl.Y(a),pl.X(t),pl.Y(0),C.coral,1.2,'stroke-dasharray="3 4"')}}
  halves.forEach((h,i)=>{out+=R(80+i*150,296,140,52,'#fff',C.grid,8)+TF(150+i*150,316,['1st','2nd','3rd'][i]+' half-life',12,C.muted)+TBF(150+i*150,338,h.toFixed(1)+' s',15,C.coral)});
  const msg=s.o===1?'Every half-life is the same: ln 2 / k.':s.o===2?'Each half-life doubles: 1 / (k[A]).':'Each half-life halves: [A] / 2k.';
  out+=TF(300,370,msg,14,C.ink);
  return {svg:out,phase:`${msg} With k = ${s.k.toFixed(2)}, the first three half-lives are ${halves.map(h=>h.toFixed(1)).join(', ')} seconds.`};
 }});

/* ================================================================ equilibrium */
// N₂O₄ ⇌ 2NO₂. Kc(298 K) ≈ 4.6 × 10⁻³ mol/L, ΔH° = +57.2 kJ/mol (van ’t Hoff for other temperatures).
const C5_Kno2=T=>4.6e-3*Math.exp(-57200/C5_R*(1/T-1/298));
function C5_eqNO2(n0,V,T){const K=C5_Kno2(T),a=K*V;const x=(-a+Math.sqrt(a*a+16*a*n0))/8;return {n2o4:(n0-x)/V,no2:2*x/V,K}}
SCENE({id:'equilibrium',name:'Pushing an equilibrium',tag:'Le Chatelier’s principle with N₂O₄ ⇌ 2NO₂',
 definition:'A reaction at equilibrium still runs both ways, at equal rates. Its equilibrium constant Kc = [NO₂]² / [N₂O₄] is fixed at a given temperature. Le Chatelier (1884) summed up what happens when you disturb it: the mixture shifts to partly undo the change.',
 example:'Squeeze the flask to half its volume and the brown NO₂ gets darker at once, then fades a little as some NO₂ pairs up into colourless N₂O₄, the side with fewer molecules.',
 desc:'A flask whose brown colour shows the amount of NO₂. Buttons add NO₂, remove NO₂ or halve or double the volume; a slider sets the temperature. Bars show the concentrations just after your change and at the new equilibrium, with the reaction quotient Q against K and an arrow for the direction of the shift.',
 research:'Guldberg, C. M. & Waage, P. (1864, 1867). Études sur les affinités chimiques. Le Chatelier, H. L. (1884). Sur un énoncé général des lois des équilibres chimiques. Comptes rendus 99, 786–789. Kc ≈ 4.6 × 10⁻³ mol/L at 298 K and ΔH° ≈ +57.2 kJ/mol from standard data tables (rounded). NO₂ is toxic: this is a demonstration done in sealed tubes.',
 dur:12,hint:'Try “Halve the volume” and watch the colour darken then partly fade. Then heat the flask: the reaction absorbs heat, so warming pushes it towards brown NO₂.',
 init:()=>({n0:.04,V:1,T:298,prev:null,last:''}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return [{n0:.04,V:1,T:298,prev:null,last:''},{n0:.04,V:.5,T:298,prev:{n0:.04,V:1,T:298},last:'Halved the volume'},{n0:.04,V:.5,T:340,prev:{n0:.04,V:.5,T:298},last:'Heated to 340 K'},{n0:.05,V:.5,T:340,prev:{n0:.04,V:.5,T:340,add:.02},last:'Added NO₂'}][k]},
 ui:[{b:'Add NO₂',act:'add'},{b:'Remove NO₂',act:'rem'},{b:'Halve the volume',act:'half'},{b:'Double the volume',act:'dbl'},
  {range:'T',label:'Temperature',min:273,max:373,step:1,get:s=>s.T,act:'T',show:v=>v+' K ('+(v-273)+' °C)'}],
 on:{add(s){s.prev={n0:s.n0,V:s.V,T:s.T,add:.02};s.n0+=.01;s.last='Added NO₂'},
  rem(s){const e=C5_eqNO2(s.n0,s.V,s.T);const take=Math.min(.02,e.no2*s.V*.6);s.prev={n0:s.n0,V:s.V,T:s.T,add:-take};s.n0-=take/2;s.last='Removed NO₂'},
  half(s){s.prev={n0:s.n0,V:s.V,T:s.T,squeeze:.5};s.V=Math.max(.25,s.V/2);s.last='Halved the volume'},
  dbl(s){s.prev={n0:s.n0,V:s.V,T:s.T,squeeze:2};s.V=Math.min(4,s.V*2);s.last='Doubled the volume'},
  T(s,v){s.prev={n0:s.n0,V:s.V,T:s.T};s.T=Number(v);s.last='Changed the temperature'}},
 draw(s,f,X){
  let out=heading('N₂O₄ (colourless) ⇌ 2 NO₂ (brown)',26);
  const now=C5_eqNO2(s.n0,s.V,s.T);let just=null;
  if(s.prev){const e=C5_eqNO2(s.prev.n0,s.prev.V,s.prev.T);let n2=e.n2o4*s.prev.V,no=e.no2*s.prev.V;if(s.prev.add)no+=s.prev.add;just={n2o4:n2/s.V,no2:no/s.V}}
  // Flask: colour from [NO2].
  const shade=c=>{const a=Math.min(1,c/.12);return `rgb(${Math.round(255-a*(255-150))},${Math.round(255-a*(255-70))},${Math.round(255-a*(255-25))})`};
  const fh=60+80*Math.sqrt(s.V/4)*2;const fy=300-fh;
  out+=P(`M70 ${fmt(fy)} L70 300 Q70 318 88 318 L172 318 Q190 318 190 300 L190 ${fmt(fy)}`,C.ink,2.5,shade(now.no2));
  out+=L(70,fy,190,fy,C.ink,3)+TF(130,fy-8,(s.V).toFixed(2)+' L',13,C.muted);
  out+=TF(130,340,'now: '+(s.T-273)+' °C',13,C.muted);
  // Bars.
  const bx=240,by=270,sc=900;
  const bar=(x,c,col,lab)=>R(x,by-Math.min(190,c*sc),34,Math.min(190,c*sc),col,'none',3)+TF(x+17,by+16,lab,12,C.muted)+TF(x+17,by-Math.min(190,c*sc)-6,(c*1000).toFixed(1),12,col);
  out+=TF(bx+50,64,'mmol/L',12,C.muted);
  if(just){out+=TF(bx+41,by+36,'just after',12,C.ink)+bar(bx,just.n2o4,C.line,'N₂O₄')+bar(bx+48,just.no2,'#c78a52','NO₂')}
  out+=TF(bx+167,by+36,'at equilibrium',12,C.ink)+bar(bx+126,now.n2o4,C.blue,'N₂O₄')+bar(bx+174,now.no2,'#9b5a1d','NO₂');
  if(just)out+=arrow(bx+90,by-60,bx+120,by-60,C.muted,2);
  // Q against K.
  const K=now.K;out+=R(450,70,130,200,'#fff',C.grid,10)+TF(515,92,'Kc at this T',12,C.muted)+TBF(515,114,C5_sci(K,2),14,C.ink);
  if(just){const Q=just.no2**2/just.n2o4;out+=TF(515,146,'Q just after',12,C.muted)+TBF(515,168,C5_sci(Q,2),14,Q>K*1.001?C.coral:Q<K*.999?C.green:C.ink);
   const dir=Q>K*1.001?'Q > K: shifts left':Q<K*.999?'Q < K: shifts right':'Q = K: no shift';out+=TF(515,202,dir.split(':')[0],13,C.ink)+TF(515,222,dir.split(':')[1].trim(),13,Q>K*1.001?C.coral:Q<K*.999?C.green:C.muted);}
  else out+=C5_lines(462,150,['Make a change:','add or remove NO₂,','squeeze, or heat.'],13,C.muted);
  out+=TF(300,366,s.last?s.last+'. The mixture shifts to partly undo it.':'Kc = [NO₂]² / [N₂O₄] stays fixed unless the temperature changes.',13,C.ink);
  const ph=!s.prev?'At 25 °C in one litre the mixture holds both gases, about '+(now.no2*1000).toFixed(1)+' mmol/L of brown NO₂.':s.last==='Changed the temperature'?`Changing the temperature changes K itself. The forward reaction absorbs heat, so warming favours NO₂: K is now ${C5_sci(K,2)}.`:`${s.last}: the mixture shifts ${just&&just.no2**2/just.n2o4>K?'towards N₂O₄':'towards NO₂'} until Q equals K again, partly undoing your change.`;
  return {svg:out,phase:ph};
 }});

/* Dynamic equilibrium: forward and reverse rates meet. kf illustrative, kr = kf / Kc. */
function C5_dyn(start,t){const K=C5_Kno2(298),kf=.08,kr=kf/K;let a=start==='n2o4'?.04:0,b=start==='n2o4'?0:.08;const dt=.002,n=Math.round(t/dt);
 for(let i=0;i<n;i++){const fw=kf*a,bw=kr*b*b;a+=(-fw+bw)*dt;b+=(2*fw-2*bw)*dt}return {a,b,fw:kf*a,bw:kr*b*b}}
SCENE({id:'equilibrium-dynamic',name:'Equilibrium is not standing still',tag:'Forward and reverse rates meet',
 definition:'At equilibrium the forward and reverse reactions keep running at equal rates, so concentrations stop changing even though molecules keep reacting. The same equilibrium mixture is reached whichever side you start from.',
 example:'Start with pure N₂O₄ or with the same atoms as pure NO₂: both flasks end with identical amounts of each gas.',
 desc:'Two plots over time: concentrations of N₂O₄ and NO₂, and the forward and reverse rates. A choice starts the flask from pure N₂O₄ or from pure NO₂ with the same atoms; a time slider moves a cursor. The rates meet and the concentrations level off at the same values in both cases.',
 research:'Guldberg, C. M. & Waage, P. (1864). Studies concerning affinity; the dynamic view was set out by Williamson, A. W. (1850). Theory of ætherification. Philosophical Magazine 37, 350–356. Rate constants here are illustrative; their ratio is the real Kc at 298 K.',
 dur:10,hint:'Run from one side, then the other, and compare the final values in the tiles.',
 init:()=>({st:'n2o4',t:4}),
 watch(p){return {st:p<.5?'n2o4':'no2',t:Number((lerp(0,6,(p%.5)*2)).toFixed(2))}},
 ui:[{choose:[['n2o4','Start with N₂O₄'],['no2','Start with NO₂']],label:'Start',get:s=>s.st,act:'st'},
  {range:'t',label:'Time',min:0,max:6,step:.1,get:s=>s.t,act:'t',show:v=>Number(v).toFixed(1)+' s'}],
 on:{st(s,v){s.st=v},t(s,v){s.t=Number(v)}},
 draw(s){
  let out=heading('The two rates meet, and stay equal',26);
  const pts=range(61).map(i=>({t:i*.1,...C5_dyn(s.st,i*.1)}));
  const p1=C5_plot(70,64,220,180,[0,6],[0,.085],{xt:[[0,'0'],[3,'3'],[6,'6 s']],yt:[[0,'0'],[.04,'40'],[.08,'80']],yl:'mmol/L'});out+=p1.svg;
  out+=C5_poly(pts.map(p=>[p1.X(p.t),p1.Y(p.a)]),C.blue,2.6)+C5_poly(pts.map(p=>[p1.X(p.t),p1.Y(p.b)]),'#9b5a1d',2.6);
  const cur=C5_dyn(s.st,s.t);out+=L(p1.X(s.t),64,p1.X(s.t),244,C.coral,1.5,'stroke-dasharray="4 4"');
  out+=TF(80,290,'blue: N₂O₄   brown: NO₂',12,C.muted,'start');
  const rmax=Math.max(.045,pts[0].fw,pts[0].bw)*1.05;
  const p2=C5_plot(340,64,220,180,[0,6],[0,rmax],{xt:[[0,'0'],[3,'3'],[6,'6 s']],yt:[[0,'0']],yl:'rate'});out+=p2.svg;
  out+=C5_poly(pts.map(p=>[p2.X(p.t),p2.Y(p.fw)]),C.green,2.6)+C5_poly(pts.map(p=>[p2.X(p.t),p2.Y(p.bw)]),C.purple,2.6);
  out+=L(p2.X(s.t),64,p2.X(s.t),244,C.coral,1.5,'stroke-dasharray="4 4"');
  out+=TF(350,290,'green: forward   purple: reverse',12,C.muted,'start');
  out+=R(70,304,220,52,'#fff',C.grid,8)+TF(180,324,'at the cursor (mmol/L)',12,C.muted)+TBF(180,346,`N₂O₄ ${(cur.a*1000).toFixed(1)} · NO₂ ${(cur.b*1000).toFixed(1)}`,14,C.ink);
  const eq=cur.bw>0&&Math.abs(cur.fw-cur.bw)/Math.max(cur.fw,cur.bw)<.02;
  out+=R(340,304,220,52,'#fff',C.grid,8)+TF(450,324,'forward ÷ reverse rate',12,C.muted)+TBF(450,346,cur.bw>1e-9?(cur.fw/cur.bw).toFixed(2):'∞',14,eq?C.green:C.coral);
  return {svg:out,phase:eq?'The forward and reverse rates are now equal: molecules still react both ways, but the amounts no longer change. Both starting points end at about 33.8 mmol/L N₂O₄ and 12.5 mmol/L NO₂.':`Not yet at equilibrium: the ${cur.fw>cur.bw?'forward':'reverse'} reaction is faster, so ${cur.fw>cur.bw?'NO₂ is still building up':'N₂O₄ is still forming'}.`};
 }});

/* H₂ + I₂ ⇌ 2HI with K = 54 near 700 K. */
const C5_KHI=54;
function C5_eqHI(a,b,c){const lo=-c/2+1e-12,hi=Math.min(a,b)-1e-12;const fn=y=>C5_KHI*(a-y)*(b-y)-(c+2*y)**2;if(hi<=lo)return {h2:a,i2:b,hi:c,y:0};const y=C5_bisect(fn,lo,hi);return {h2:a-y,i2:b-y,hi:c+2*y,y}}
SCENE({id:'equilibrium-quotient',name:'Which way will it go?',tag:'The reaction quotient Q against K',
 definition:'The reaction quotient Q has the same form as K but uses the concentrations you have right now. If Q is less than K the reaction runs forward; if Q is greater it runs back; if they are equal the mixture is already at equilibrium.',
 example:'Hydrogen and iodine with no HI: Q = 0, far below K = 54, so HI forms until [HI]² / ([H₂][I₂]) reaches 54.',
 desc:'Sliders set the starting amounts of H₂, I₂ and HI in a 1-litre vessel near 700 K. A gauge places Q against K on a log scale with an arrow for the direction. Paired bars compare the start with the equilibrium mixture.',
 research:'Bodenstein, M. (1894, 1899). Gasreaktionen in der chemischen Kinetik. Zeitschrift für physikalische Chemie 13, 56–127; 29, 295–314. Taylor, A. H. & Crist, R. H. (1941). Journal of the American Chemical Society 63, 1381–1386 (K ≈ 54 at 698 K). The equilibrium is found by solving K(a − y)(b − y) = (c + 2y)².',
 dur:10,hint:'Start with only HI and see the reaction run backwards. Then give it a large excess of H₂ and watch nearly all the iodine get used up.',
 init:()=>({a:1,b:1,c:0}),
 watch(p){return p<.33?{a:1,b:1,c:0}:p<.66?{a:0,b:0,c:2}:{a:2,b:.5,c:0}},
 ui:[{range:'a',label:'H₂ at start',min:0,max:2,step:.1,get:s=>s.a,act:'a',show:v=>Number(v).toFixed(1)+' mol'},
  {range:'b',label:'I₂ at start',min:0,max:2,step:.1,get:s=>s.b,act:'b',show:v=>Number(v).toFixed(1)+' mol'},
  {range:'c',label:'HI at start',min:0,max:3,step:.1,get:s=>s.c,act:'c',show:v=>Number(v).toFixed(1)+' mol'}],
 on:{a(s,v){s.a=Number(v)},b(s,v){s.b=Number(v)},c(s,v){s.c=Number(v)}},
 draw(s){
  let out=heading('H₂ + I₂ ⇌ 2 HI   (K = 54 near 700 K)',26);
  const Q=s.a*s.b>0?s.c**2/(s.a*s.b):(s.c>0?Infinity:NaN);
  const gx=v=>90+(Math.log10(v)+3)/6*420;
  out+=L(90,90,510,90,C.line,6)+[-3,-2,-1,0,1,2,3].map(e=>L(gx(10**e),84,gx(10**e),96,C.muted,1.5)+TF(gx(10**e),114,e===0?'1':'10'+String(e).split('').map(c=>C5_SUP[c]).join(''),12,C.muted)).join('');
  out+=Ci(gx(C5_KHI),90,8,C.ink)+TF(gx(C5_KHI),70,'K = 54',13,C.ink);
  if(isFinite(Q)&&Q>0){const qx=Math.max(90,Math.min(510,gx(Q)));out+=Ci(qx,90,8,C.coral,'#fff')+TF(qx,136,'Q = '+C5_sci(Q,2),13,C.coral)}
  else if(Q===Infinity)out+=TF(510,136,'Q = ∞ (no H₂ or I₂)',13,C.coral,'end');
  else if(Q===0)out+=TF(90,136,'Q = 0 (no HI)',13,C.coral,'start');
  const eq=C5_eqHI(s.a,s.b,s.c),dir=isNaN(Q)?'Nothing to react.':Math.abs(eq.y)<1e-4?'Q = K: already at equilibrium.':eq.y>0?'Q < K: runs forward, making HI.':'Q > K: runs backward, splitting HI.';
  const bx=110,base=310,sc=48;
  [['H₂',s.a,eq.h2,C.blue],['I₂',s.b,eq.i2,C.purple],['HI',s.c,eq.hi,C.green]].forEach(([n,v0,v1,col],i)=>{const x=bx+i*140;
   out+=R(x,base-v0*sc,40,v0*sc,tint(col,.6),'none',3)+R(x+46,base-v1*sc,40,v1*sc,col,'none',3);
   out+=TF(x+20,base-v0*sc-6,v0.toFixed(2),12,C.muted)+TF(x+66,base-v1*sc-6,v1.toFixed(2),12,col)+TF(x+43,base+18,n,14,C.ink)});
  out+=TF(300,350,'pale: start   solid: equilibrium (mol in 1 L)',12,C.muted);
  out+=TF(300,374,dir,14,eq.y>0?C.green:eq.y<0?C.coral:C.ink);
  return {svg:out,phase:dir+(isNaN(Q)?'':` At equilibrium: H₂ ${eq.h2.toFixed(2)}, I₂ ${eq.i2.toFixed(2)}, HI ${eq.hi.toFixed(2)} mol, and ${eq.h2*eq.i2>1e-9?'[HI]²/([H₂][I₂]) = '+(eq.hi**2/(eq.h2*eq.i2)).toFixed(1):'one reactant is used up almost entirely'}.`)};
 }});

/* ================================================================ acids-bases */
// pH from the charge balance h = c·Ka/(Ka + h) + Kw/h, solved on a log scale.
function C5_pH(c,Ka){const Kw=1e-14;if(c<=0)return 7;const f=lh=>{const h=10**lh;return c*Ka/(Ka+h)+Kw/h-h};return -C5_bisect(f,-14,1)}
const C5_EVERY=[['Stomach acid',1.5,0,'middle'],['Lemon juice',2.2,1,'middle'],['Cola',2.5,3,'middle'],['Coffee',5,0,'middle'],['Pure water',7,1,'end'],['Blood',7.4,3,'end'],['Sea water',8.1,0,'start'],['Baking soda',8.3,2,'start'],['Household bleach',12.5,1,'middle']];
SCENE({id:'acids-bases',name:'The pH scale',tag:'Strong and weak acids',
 definition:'pH = −log₁₀[H⁺], so each step of 1 is a tenfold change in acidity. A strong acid such as hydrochloric acid gives up all its hydrogen ions in water; a weak acid such as ethanoic (acetic) acid gives up only a few, set by its acid constant Ka = 1.8 × 10⁻⁵.',
 example:'At 0.1 mol/L, hydrochloric acid has pH 1.0 but ethanoic acid only pH 2.9: the same amount of acid, about 75 times fewer free hydrogen ions.',
 desc:'A pH scale from 0 to 14 with everyday liquids marked. A concentration slider places two markers on it: hydrochloric acid and ethanoic acid at the same concentration. Tiles give each pH and the share of the weak acid that has given up its hydrogen ion.',
 research:'Arrhenius, S. (1887). Über die Dissociation der in Wasser gelösten Stoffe. Zeitschrift für physikalische Chemie 1, 631–648. Sørensen, S. P. L. (1909). Enzymstudien II. Biochemische Zeitschrift 21, 131–304 (the pH scale, devised at the Carlsberg Laboratory). Ka of ethanoic acid 1.8 × 10⁻⁵ at 25 °C. Everyday pH values are typical, not exact.',
 dur:10,hint:'Dilute both acids a millionfold and watch them meet at pH 7: water’s own ions take over, so no acid can be diluted to an alkaline pH.',
 init:()=>({lc:-1}),
 watch(p){return {lc:Number(lerp(0,-7,smooth(p/.9)).toFixed(1))}},
 ui:[{range:'lc',label:'Acid concentration',min:-7,max:0,step:.1,get:s=>s.lc,act:'lc',show:v=>C5_sci(10**Number(v),2)+' mol/L'}],
 on:{lc(s,v){s.lc=Number(v)}},
 draw(s){
  let out=heading('pH = −log₁₀ [H⁺]: each step is ten times',26);
  const x=v=>50+v/14*500;
  for(let i=0;i<14;i++){const t=i/13;const col=i<7?`rgb(${220-i*8},${90+i*20},${70+i*6})`:`rgb(${120-(i-7)*10},${150-(i-7)*8},${200+(i-7)*5})`;out+=R(x(i),110,500/14+.5,26,col,'none',0)}
  for(let i=0;i<=14;i+=2)out+=TF(x(i),156,String(i),13,C.muted);
  out+=TF(300,262,'← more acidic · 7 is neutral · more alkaline →',12,C.muted);
  C5_EVERY.forEach(([n,v,row,anc])=>{const y=180+row*20;out+=L(x(v),138,x(v),y-12,C.line,1)+TF(x(v)+(anc==='end'?-3:anc==='start'?3:0),y,n,12,C.ink,anc)});
  const c=10**s.lc,ps=C5_pH(c,1e8),pw=C5_pH(c,1.8e-5);
  out+=arrow(x(ps),62,x(ps),106,C.coral,2.6)+TF(x(ps)-5,72,'HCl',13,C.coral,'end');
  out+=arrow(x(pw),82,x(pw),106,C.purple,2.6)+TF(x(pw)+5,92,'ethanoic',13,C.purple,'start');
  const h=10**-pw,alpha=(c*1.8e-5/(1.8e-5+h))/c;
  out+=R(60,272,150,56,'#fff',C.grid,8)+TF(135,292,'hydrochloric (strong)',12,C.muted)+TBF(135,316,'pH '+ps.toFixed(2),16,C.coral);
  out+=R(225,272,150,56,'#fff',C.grid,8)+TF(300,292,'ethanoic (weak)',12,C.muted)+TBF(300,316,'pH '+pw.toFixed(2),16,C.purple);
  out+=R(390,272,150,56,'#fff',C.grid,8)+TF(465,292,'ethanoic split up',12,C.muted)+TBF(465,316,(alpha*100).toFixed(alpha<.1?1:0)+'%',16,C.purple);
  out+=TF(300,354,'Both at '+C5_sci(c,2)+' mol/L. Strong acids split up completely; weak ones only partly.',13,C.ink);
  return {svg:out,phase:s.lc<-5.5?'At this dilution water’s own ions dominate: both acids sit just below pH 7, never above it.':`The same concentration gives pH ${ps.toFixed(1)} for the strong acid and ${pw.toFixed(1)} for the weak one: only ${(alpha*100).toFixed(1)}% of the ethanoic acid molecules have given up a hydrogen ion.`};
 }});

const C5_DEFS=[
 {r:'HCl + H₂O → H₃O⁺ + Cl⁻',arr:'yes',bl:'yes',lw:'yes',pair:'HCl / Cl⁻ and H₃O⁺ / H₂O',note:'Every definition agrees: hydrogen chloride gives a proton to water.'},
 {r:'NH₃ + H₂O ⇌ NH₄⁺ + OH⁻',arr:'awkward',bl:'yes',lw:'yes',pair:'NH₄⁺ / NH₃ and H₂O / OH⁻',note:'Ammonia makes OH⁻ but contains none. Brønsted–Lowry handles it: water is the acid, ammonia the base.'},
 {r:'HCl(g) + NH₃(g) → NH₄Cl(s)',arr:'no',bl:'yes',lw:'yes',pair:'HCl / Cl⁻ and NH₄⁺ / NH₃',note:'No water at all, so Arrhenius cannot count it, yet a proton clearly moves from HCl to NH₃.'},
 {r:'BF₃ + NH₃ → F₃B–NH₃',arr:'no',bl:'no',lw:'yes',pair:'no proton moves',note:'No proton moves. Lewis’s definition counts it: NH₃ donates an electron pair to boron.'},
 {r:'Ag⁺ + 2 NH₃ → [Ag(NH₃)₂]⁺',arr:'no',bl:'no',lw:'yes',pair:'no proton moves',note:'A metal ion accepting electron pairs is a Lewis acid: the basis of complex formation.'}];
SCENE({id:'acids-bases-definitions',name:'Three meanings of acid',tag:'Arrhenius, Brønsted–Lowry and Lewis',
 definition:'Arrhenius (1887): acids give H⁺ in water, bases give OH⁻. Brønsted and Lowry (1923, independently): an acid is a proton donor and a base a proton acceptor, with or without water. Lewis (1923): a base donates an electron pair and an acid accepts one. Each definition contains the one before.',
 example:'Boron trifluoride has no hydrogen at all, yet it grabs ammonia’s lone pair: an acid only in Lewis’s sense.',
 desc:'Five reactions you can press. For the chosen one, a table marks whether each of the three definitions counts it as acid–base, names the conjugate pairs when a proton moves, and explains why.',
 research:'Arrhenius 1887 (as above). Brønsted, J. N. (1923). Einige Bemerkungen über den Begriff der Säuren und Basen. Recueil des Travaux Chimiques des Pays-Bas 42, 718–728. Lowry, T. M. (1923). The uniqueness of hydrogen. Journal of the Society of Chemical Industry 42, 43–47. Lewis, G. N. (1923). Valence and the Structure of Atoms and Molecules. Chemical Catalog Company.',
 dur:10,hint:'Step down the list: each definition stops working one row later than the one before it.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(4,Math.floor(p*5))}},
 ui:[{b:'Next reaction',act:'next'}],
 on:{pick(s,v){s.k=Number(v)},next(s){s.k=(s.k+1)%C5_DEFS.length}},
 draw(s,f,X){
  let out=heading('Is it an acid–base reaction? It depends who you ask',26);
  C5_DEFS.forEach((d,i)=>{out+=C5_btn(X,'pick',i,`Reaction ${i+1}: ${d.r}`,40,46+i*38,280,32,d.r,{sel:s.k===i,bold:s.k===i})});
  const d=C5_DEFS[s.k],cols=[['Arrhenius 1887',d.arr],['Brønsted–Lowry 1923',d.bl],['Lewis 1923',d.lw]];
  cols.forEach(([n,v],i)=>{const y=52+i*58,col=v==='yes'?C.green:v==='no'?C.coral:C.amber;
   out+=R(340,y,230,48,'#fff',col,8,'stroke-width="2"')+TF(352,y+20,n,13,C.ink,'start')+TBF(558,y+32,v==='yes'?'✓ yes':v==='no'?'✗ no':'~ awkward',14,col,'end')});
  out+=R(40,248,530,96,'#fff',C.grid,10)+TF(56,272,'Conjugate pairs: '+d.pair,13,C.purple,'start');
  out+=C5_lines(56,298,C5_wrap(d.note,74),13,C.ink,'start',18);
  return {svg:out,phase:d.note};
 }});

/* Buffer against water: drops of 1.0 mol/L HCl, 0.05 mL each, into 100 mL. */
function C5_buf(n){const add=n*5e-5,V=.1+n*5e-8;const water=add>0?C5_pH(add/V,1e8):7;const HA=.01+add,A=.01-add;const buf=A>0?4.76+Math.log10(A/HA):C5_pH((add-.01)/V,1e8);return {water,buf}}
SCENE({id:'acids-bases-buffer',name:'Holding pH steady',tag:'Buffers',
 definition:'A buffer is a mixture of a weak acid and its conjugate base. Added acid is mopped up by the base, and added alkali by the acid, so the pH barely moves. The Henderson–Hasselbalch equation gives its pH: pH = pKa + log₁₀([A⁻] / [HA]).',
 example:'Twenty drops of strong acid take 100 mL of water from pH 7 to about pH 2, but an ethanoate buffer only from 4.76 to 4.67.',
 desc:'Two beakers of 100 mL: pure water and an ethanoic acid–ethanoate buffer (0.10 mol/L of each). Each press adds one drop (0.05 mL) of 1.0 mol/L hydrochloric acid to both. A plot tracks the pH of each against the number of drops.',
 research:'Henderson, L. J. (1908). Concerning the relationship between the strength of acids and their capacity to preserve neutrality. American Journal of Physiology 21, 173–179. Hasselbalch, K. A. (1916). Biochemische Zeitschrift 78, 112–144. pKa of ethanoic acid 4.76. Blood is buffered near pH 7.4 mainly by carbonic acid and hydrogencarbonate.',
 dur:10,hint:'Add a single drop and compare: the water’s pH collapses at once, the buffer’s hardly twitches.',
 init:()=>({n:0}),
 watch(p){return {n:Math.round(lerp(0,40,smooth(p/.9)))}},
 ui:[{b:'Add a drop',act:'drop'},{range:'n',label:'Drops added',min:0,max:40,step:1,get:s=>s.n,act:'n',show:v=>v+' drops'},{b:'Empty and refill',act:'reset'}],
 on:{drop(s){if(s.n<40){s.n++;AUDIO.tone(1400,{dur:.05,gain:.05,type:'sine'})}},n(s,v){s.n=Number(v)},reset(s){s.n=0}},
 draw(s){
  let out=heading('The same drops of acid into water and into a buffer',26);
  const r=C5_buf(s.n);
  const beaker=(x,lab,ph,col)=>P(`M${x} 70 L${x} 170 Q${x} 180 ${x+10} 180 L${x+110} 180 Q${x+120} 180 ${x+120} 170 L${x+120} 70`,C.ink,2.2,'none')+R(x+2,100,116,78,col,'none',2,'opacity=".55"')+TF(x+60,200,lab,13,C.ink)+TBF(x+60,224,'pH '+ph.toFixed(2),16,C.ink);
  const colFor=ph=>ph<4?'#e9846b':ph<6?'#e8c46b':'#9fd0a8';
  out+=beaker(50,'water',r.water,colFor(r.water))+beaker(200,'buffer',r.buf,colFor(r.buf));
  out+=TF(170,62,s.n+' drop'+(s.n===1?'':'s')+' of 1.0 M HCl',13,C.coral);
  const pl=C5_plot(380,64,190,200,[0,40],[1,8],{xt:[[0,'0'],[20,'20'],[40,'40']],yt:[[2,'2'],[4,'4'],[6,'6'],[8,'8']],xl:'drops added',yl:'pH'});out+=pl.svg;
  out+=C5_poly(range(41).map(i=>[pl.X(i),pl.Y(Math.max(1,C5_buf(i).water))]),C.coral,2.6)+C5_poly(range(41).map(i=>[pl.X(i),pl.Y(C5_buf(i).buf)]),C.green,2.6);
  out+=Ci(pl.X(s.n),pl.Y(Math.max(1,r.water)),5,C.coral)+Ci(pl.X(s.n),pl.Y(r.buf),5,C.green);
  out+=TF(475,318,'coral: water   green: buffer',12,C.muted);
  out+=TF(300,356,'pH = 4.76 + log₁₀([ethanoate] / [ethanoic acid])',14,C.ink);
  return {svg:out,phase:s.n===0?'Water starts at pH 7 and the buffer at 4.76, its pKa, because it holds equal amounts of acid and conjugate base.':`After ${s.n} drop${s.n===1?'':'s'} the water has fallen to pH ${r.water.toFixed(2)} but the buffer only to ${r.buf.toFixed(2)}: its ethanoate ions take up almost every added proton.`};
 }});

/* ================================================================ redox-batteries */
SCENE({id:'redox-batteries',name:'A cell from zinc and copper',tag:'The Daniell cell and the Nernst equation',
 definition:'In a redox reaction one substance loses electrons (oxidation) and another gains them (reduction). Separate the two halves and join them with a wire and a salt bridge, and the electrons flow through the wire as a current. The cell’s voltage depends on the concentrations, as the Nernst equation says: E = E° − (0.0592 / n) log₁₀ Q at 25 °C.',
 example:'With 1 mol/L of each ion, a Daniell cell gives 1.10 V. Make the copper solution a hundred times weaker and the voltage drops by about 0.06 V.',
 desc:'Two beakers: a zinc strip in zinc sulfate and a copper strip in copper sulfate, joined by a wire through a voltmeter and by a salt bridge. Sliders set the two ion concentrations. Arrows show electrons leaving the zinc and arriving at the copper, and the meter shows the Nernst voltage.',
 research:'Volta, A. (1800). On the electricity excited by the mere contact of conducting substances of different kinds. Philosophical Transactions 90, 403–431. Daniell, J. F. (1836). On voltaic combinations. Philosophical Transactions 126, 107–124. Nernst, W. (1889). Zeitschrift für physikalische Chemie 4, 129–181. E° = +0.34 − (−0.76) = 1.10 V.',
 dur:10,hint:'Make the zinc solution strong and the copper solution weak: the voltage falls, because the products are piling up and the reactants running out.',
 init:()=>({zn:0,cu:0}),
 watch(p){return {zn:Number(lerp(-2,2,p).toFixed(1)),cu:Number(lerp(2,-2,p).toFixed(1))}},
 ui:[{range:'zn',label:'Zn²⁺ concentration',min:-3,max:.3,step:.1,get:s=>s.zn,act:'zn',show:v=>C5_sci(10**Number(v),2)+' mol/L'},
  {range:'cu',label:'Cu²⁺ concentration',min:-3,max:.3,step:.1,get:s=>s.cu,act:'cu',show:v=>C5_sci(10**Number(v),2)+' mol/L'}],
 on:{zn(s,v){s.zn=Number(v)},cu(s,v){s.cu=Number(v)}},
 draw(s){
  const E=1.10-0.02958*(s.zn-s.cu);let out=heading('Zn → Zn²⁺ + 2e⁻   ·   Cu²⁺ + 2e⁻ → Cu',26);
  const bk=(x,lab,col,ion,c)=>P(`M${x} 150 L${x} 300 Q${x} 312 ${x+12} 312 L${x+148} 312 Q${x+160} 312 ${x+160} 300 L${x+160} 150`,C.ink,2.2)+R(x+2,190,156,120,col,'none',2,`opacity="${.25+.6*Math.min(1,10**c/2)}"`)+TF(x+80,334,lab,13,C.ink)+TF(x+80,352,ion+' '+C5_sci(10**c,2)+' M',12,C.muted);
  out+=bk(60,'zinc (anode)','#b9c3cc','Zn²⁺',s.zn)+bk(380,'copper (cathode)','#6fa8dc','Cu²⁺',s.cu);
  out+=R(120,120,16,160,'#8d99a3','none',2)+R(464,120,16,160,'#c27a3a','none',2);
  out+=P('M200 200 L200 150 Q300 120 400 150 L400 200',C.muted,10,'none','opacity=".35"')+TF(300,150,'salt bridge',12,C.muted);
  out+=L(128,120,128,80,C.ink,2)+L(128,80,262,80,C.ink,2)+L(338,80,472,80,C.ink,2)+L(472,80,472,120,C.ink,2);
  out+=R(262,56,76,48,'#fff',C.ink,8)+TBF(300,86,E.toFixed(3)+' V',15,E>1.1?C.green:C.coral);
  out+=arrow(160,70,240,70,C.blue,2.4)+arrow(360,70,440,70,C.blue,2.4)+TF(200,62,'e⁻',13,C.blue)+TF(400,62,'e⁻',13,C.blue);
  out+=TF(300,250,'E = 1.10 − 0.0296',12,C.ink)+TF(300,268,'× log₁₀([Zn²⁺]/[Cu²⁺])',12,C.ink);
  return {svg:out,phase:`The cell gives ${E.toFixed(3)} V. ${Math.abs(E-1.1)<.005?'With equal concentrations it is the standard 1.10 V.':E>1.1?'More copper ions than zinc ions push the voltage above 1.10 V.':'Zinc ions piling up and copper ions running out pull it below 1.10 V, which is how a cell runs down.'}`};
 }});

const C5_SERIES=[['Li','Li⁺ + e⁻ ⇌ Li',-3.04],['Mg','Mg²⁺ + 2e⁻ ⇌ Mg',-2.37],['Al','Al³⁺ + 3e⁻ ⇌ Al',-1.66],['Zn','Zn²⁺ + 2e⁻ ⇌ Zn',-.76],['Fe','Fe²⁺ + 2e⁻ ⇌ Fe',-.44],['Pb','Pb²⁺ + 2e⁻ ⇌ Pb',-.13],['H₂','2H⁺ + 2e⁻ ⇌ H₂',0],['Cu','Cu²⁺ + 2e⁻ ⇌ Cu',.34],['Ag','Ag⁺ + e⁻ ⇌ Ag',.80],['Au','Au³⁺ + 3e⁻ ⇌ Au',1.50]];
SCENE({id:'redox-batteries-series',name:'The electrochemical series',tag:'Standard electrode potentials',
 definition:'Each half-reaction has a standard electrode potential E°, measured against the hydrogen electrode (0 V). Pair any two and the one lower in the series is oxidised (the anode, −) while the higher one is reduced (the cathode, +). The cell voltage is the difference: E°cell = E°cathode − E°anode.',
 example:'Magnesium and silver: 0.80 − (−2.37) = 3.17 V. Volta’s first pile (1800) stacked zinc and silver or copper discs separated by brine-soaked card.',
 desc:'A vertical ladder of ten half-reactions from lithium at −3.04 V to gold at +1.50 V. Press one rung for the anode side and one for the cathode side; a bracket shows the voltage between them and an arrow shows which way electrons flow.',
 research:'Standard reduction potentials at 25 °C from the CRC Handbook of Chemistry and Physics (rounded to 0.01 V). Volta 1800 (as above). Ostwald, W. and Nernst, W. developed the potential scale in the 1880s–1890s. Lithium and sodium react violently with water; real lithium cells use non-aqueous electrolytes.',
 dur:10,hint:'Pair metals far apart for a high voltage. The more reactive metal (lower in the series) is always the one that dissolves.',
 init:()=>({a:3,b:7}),
 watch(p){const pairs=[[3,7],[1,8],[0,9]];return {a:pairs[Math.min(2,Math.floor(p*3))][0],b:pairs[Math.min(2,Math.floor(p*3))][1]}},
 ui:[],
 on:{pick(s,v){const i=Number(v);if(i===s.a||i===s.b)return;const ea=C5_SERIES[s.a][2],eb=C5_SERIES[s.b][2],ei=C5_SERIES[i][2];if(Math.abs(ei-ea)<Math.abs(ei-eb))s.a=i;else s.b=i}},
 draw(s,f,X){
  let out=heading('Pick two rungs: the lower one dissolves',26);
  const idx=v=>C5_SERIES.findIndex(r=>r[2]===v),y=v=>330-idx(v)*28;
  out+=L(120,y(1.5)-10,120,y(-3.04)+10,C.line,4);
  C5_SERIES.forEach(([n,r,v],i)=>{const sel=i===s.a||i===s.b,yy=y(v);
   out+=hit(X,'pick',i,`${r}, ${v} volts`,R(140,yy-13,300,26,sel?(v===Math.min(C5_SERIES[s.a][2],C5_SERIES[s.b][2])?C.coralp:C.greenp):'#fff',sel?C.ink:C.grid,6)+TF(152,yy+5,r,13,C.ink,'start')+TF(430,yy+5,(v>0?'+':v<0?'−':'')+Math.abs(v).toFixed(2)+' V',13,C.muted,'end'))+L(112,yy,128,yy,C.muted,1.5)});
  const lo=Math.min(C5_SERIES[s.a][2],C5_SERIES[s.b][2]),hi=Math.max(C5_SERIES[s.a][2],C5_SERIES[s.b][2]);
  out+=arrow(470,y(lo),470,y(hi)+4,C.blue,2.6)+TF(482,(y(lo)+y(hi))/2,'e⁻',13,C.blue,'start');
  const anode=C5_SERIES.find(r=>r[2]===lo)[0],cath=C5_SERIES.find(r=>r[2]===hi)[0];
  out+=R(500,140,90,96,'#fff',C.grid,8)+TF(545,162,'cell voltage',12,C.muted)+TBF(545,190,(hi-lo).toFixed(2)+' V',16,C.ink)+TF(545,212,anode+' (−) →',12,C.coral)+TF(545,228,cath+' (+)',12,C.green);
  out+=TF(100,y(0)+4,'0 V',12,C.muted,'end')+TF(300,366,'Rungs evenly spaced, not to scale.',12,C.muted);
  return {svg:out,phase:`${anode} is oxidised at the anode and ${cath} ions are reduced at the cathode: E°cell = ${hi.toFixed(2)} − (${lo.toFixed(2)}) = ${(hi-lo).toFixed(2)} V.`};
 }});

const C5_BATT=[['Lead–acid',35],['NiCd',50],['NiMH',90],['Li-ion',230]];
SCENE({id:'redox-batteries-lithium',name:'The lithium-ion cell',tag:'Ions rocking between two hosts',
 definition:'A lithium-ion cell moves lithium ions between two layered materials. Charging pushes them into the graphite; discharging lets them flow back into the metal oxide while electrons go round the outside circuit. Lithium is the lightest metal with a very negative potential, so the cells store a lot of energy per kilogram.',
 example:'A phone cell runs at about 3.7 V and stores several times more energy per kilogram than a lead–acid car battery.',
 desc:'A cell drawn as graphite layers on the left and cobalt oxide layers on the right, with lithium ions as dots. A state-of-charge slider moves the ions between them; the voltage readout follows a typical discharge curve. Bars compare rough energy per kilogram for four battery types.',
 research:'Whittingham, M. S. (1976). Electrical energy storage and intercalation chemistry. Science 192, 1126–1127. Mizushima, K., Jones, P. C., Wiseman, P. J. & Goodenough, J. B. (1980). LixCoO₂: a new cathode material. Materials Research Bulletin 15, 783–789. Yoshino, A. et al. (1985), Japanese patent on the carbon anode cell; Sony commercialised it in 1991. Nobel Prize in Chemistry 2019. Energy densities are rough typical values; the voltage curve is illustrative. Cobalt mining raises serious labour and environmental concerns.',
 dur:10,hint:'Slide from full to empty and watch the ions move from graphite to oxide while the voltage sags from about 4.2 V to 3.0 V.',
 init:()=>({q:80}),
 watch(p){return {q:Math.round(lerp(100,0,smooth(p/.9)))}},
 ui:[{range:'q',label:'State of charge',min:0,max:100,step:1,get:s=>s.q,act:'q',show:v=>v+'%'}],
 on:{q(s,v){s.q=Number(v)}},
 draw(s){
  let out=heading('Charged: lithium in graphite · discharged: lithium in the oxide',26);
  const V=3.0+1.2*Math.pow(s.q/100,.55)-(s.q<8?.25*(1-s.q/8):0);
  for(let i=0;i<5;i++){out+=R(60,64+i*40,180,10,'#555f66','none',2)+R(360,64+i*40,180,10,'#4b6e9e','none',2)}
  out+=TF(150,282,'graphite (−)',13,C.ink)+TF(450,282,'cobalt oxide (+)',13,C.ink)+R(280,56,40,210,'#eef3f6','none',4)+TF(300,282,'electrolyte',12,C.muted);
  const N=40,inG=Math.round(N*s.q/100),r=rng(5);
  for(let i=0;i<N;i++){const row=i%5,col=Math.floor(i/5);const left=i<inG;const x=(left?72:372)+col*20+r()*4,yy=64+row*40+25;out+=Ci(x,yy,5,C.coral)}
  out+=R(250,300,100,52,'#fff',C.ink,8)+TF(300,320,'voltage',12,C.muted)+TBF(300,342,V.toFixed(2)+' V',16,C.blue);
  const bx=380;out+=TF(bx,306,'energy per kg (Wh/kg, rough)',12,C.muted,'start');
  C5_BATT.forEach(([n,v],i)=>{out+=R(bx+70,312+i*16,v/230*120,11,i===3?C.coral:C.line,'none',2)+TF(bx+66,322+i*16,n,11,C.ink,'end')+TF(bx+74+v/230*120,322+i*16,String(v),11,C.muted,'start')});
  out+=TF(60,330,s.q+'% charged',14,C.coral,'start');
  return {svg:out,phase:`At ${s.q}% charge, ${inG} of ${N} lithium ions sit between the graphite layers and the cell gives about ${V.toFixed(2)} V. Discharging, they drift back into the oxide while electrons power the device.`};
 }});

/* ================================================================ catalysis */
SCENE({id:'catalysis',name:'A lower hill',tag:'What a catalyst does',
 definition:'A catalyst speeds a reaction by giving it a different path with a lower activation energy, and is not used up. It speeds the forward and reverse reactions equally, so it changes how fast equilibrium is reached, not where it lies, and it leaves the overall energy change ΔH alone.',
 example:'Lowering the barrier by 40 kJ/mol speeds a reaction at room temperature about ten million times.',
 desc:'An energy profile from reactants to products with two paths: the uncatalysed hill and a lower catalysed one. Sliders set both barriers and the temperature. Tiles give the speed-up factor e^(ΔEa/RT) and confirm that ΔH is the same on both paths.',
 research:'Berzelius, J. J. (1835) coined “catalysis”. Ostwald, W. (1894, Nobel 1909) defined a catalyst as a substance that changes the rate without affecting equilibrium. The speed-up follows from the Arrhenius equation, assuming the same pre-exponential factor A; the profile is schematic.',
 dur:10,hint:'Drop the catalysed barrier and watch the speed-up climb by a factor of ten for every 5.7 kJ/mol at room temperature.',
 init:()=>({Ea:100,Ec:60,T:298}),
 watch(p){return {Ea:100,Ec:Math.round(lerp(100,40,smooth(p/.9))),T:298}},
 ui:[{range:'Ea',label:'Uncatalysed barrier',min:40,max:150,step:1,get:s=>s.Ea,act:'Ea',show:v=>v+' kJ/mol'},
  {range:'Ec',label:'Catalysed barrier',min:10,max:150,step:1,get:s=>s.Ec,act:'Ec',show:v=>v+' kJ/mol'},
  {range:'T',label:'Temperature',min:250,max:600,step:1,get:s=>s.T,act:'T',show:v=>v+' K'}],
 on:{Ea(s,v){s.Ea=Number(v);if(s.Ec>s.Ea)s.Ec=s.Ea},Ec(s,v){s.Ec=Math.min(Number(v),s.Ea)},T(s,v){s.T=Number(v)}},
 draw(s){
  let out=heading('Same start, same finish, lower barrier',26);
  const dH=-50,pl=C5_plot(70,56,360,240,[0,1],[-80,160],{yt:[[-50,'−50'],[0,'0'],[50,'50'],[100,'100'],[150,'150']],yl:'energy (kJ/mol)',xl:'progress of reaction →'});out+=pl.svg;
  const bs=x=>dH*smooth(x),prof=(top,hump2)=>range(101).map(i=>{const x=i/100;const bump=hump2?((top-bs(.35))*Math.exp(-Math.pow((x-.35)/.1,2))+(top*.9-bs(.65))*Math.exp(-Math.pow((x-.65)/.1,2))):(top-bs(.5))*Math.exp(-Math.pow((x-.5)/.14,2));return [pl.X(x),pl.Y(bs(x)+bump)]});
  out+=C5_poly(prof(s.Ea,false),C.coral,3)+C5_poly(prof(s.Ec,true),C.green,3);
  out+=L(pl.X(0),pl.Y(0),pl.X(.15),pl.Y(0),C.ink,2)+L(pl.X(.85),pl.Y(dH),pl.X(1),pl.Y(dH),C.ink,2);
  out+=TF(pl.X(.07),pl.Y(0)+18,'reactants',12,C.ink)+TF(pl.X(.93),pl.Y(dH)+18,'products',12,C.ink);
  out+=TF(pl.X(.5),pl.Y(s.Ea)-8,'no catalyst',12,C.coral)+TF(pl.X(.2),pl.Y(s.Ec)-8,'catalysed',12,C.green,'end');
  const ratio=Math.exp((s.Ea-s.Ec)*1000/(C5_R*s.T));
  out+=R(452,70,128,56,'#fff',C.grid,8)+TF(516,90,'speed-up',12,C.muted)+TBF(516,114,(ratio>=1000?C5_sci(ratio,2):ratio.toFixed(ratio<10?2:0))+'×',15,C.green);
  out+=R(452,140,128,56,'#fff',C.grid,8)+TF(516,160,'ΔH, both paths',12,C.muted)+TBF(516,184,'−50 kJ/mol',15,C.ink);
  out+=R(452,210,128,56,'#fff',C.grid,8)+TF(516,230,'equilibrium',12,C.muted)+TBF(516,254,'unchanged',15,C.ink);
  out+=TF(300,350,'Speed-up = e^(ΔEa / RT) if the catalyst keeps the same A factor.',13,C.ink);
  return {svg:out,phase:`Lowering the barrier from ${s.Ea} to ${s.Ec} kJ/mol at ${s.T} K makes the reaction about ${ratio>=1000?C5_sci(ratio,2):ratio.toFixed(1)} times faster, in both directions, so the equilibrium mixture is the same; it just arrives sooner.`};
 }});

/* Haber–Bosch: equilibrium % NH₃ by volume (3:1 H₂:N₂), rounded from the classic tabulation. */
const C5_HT=[200,300,400,500,600],C5_HP=[10,100,200,300,1000];
const C5_HY=[[50.7,81.5,89.0,89.9,98.3],[14.7,52.5,66.7,71.1,92.6],[3.9,25.2,38.7,47.1,79.8],[1.2,10.6,18.3,25.9,57.5],[.5,4.5,8.3,13.8,31.4]];
function C5_haber(T,Pp){const ti=Math.max(0,Math.min(3.999,(T-200)/100)),i=Math.floor(ti),u=ti-i;const lp=Math.log10(Pp),lps=C5_HP.map(Math.log10);let j=0;while(j<3&&lp>lps[j+1])j++;const v=Math.max(0,Math.min(1,(lp-lps[j])/(lps[j+1]-lps[j])));
 const g=(a,b)=>C5_HY[a][b];return (1-u)*((1-v)*g(i,j)+v*g(i,j+1))+u*((1-v)*g(i+1,j)+v*g(i+1,j+1))}
SCENE({id:'catalysis-haber',name:'Bread from air',tag:'Haber–Bosch: the great compromise',
 definition:'Haber–Bosch makes ammonia from nitrogen and hydrogen: N₂ + 3H₂ ⇌ 2NH₃, giving out 92 kJ per mole of N₂. Low temperature and high pressure favour ammonia at equilibrium, but at low temperature the reaction is far too slow even with an iron catalyst, and very high pressure is costly. Plants compromise near 400–450 °C and 150–300 atmospheres and recycle unreacted gas.',
 example:'At 450 °C and 200 atm the equilibrium mixture is only about 28% ammonia, but recycling the rest lets the plant convert nearly all its gas in the end.',
 desc:'A map of equilibrium ammonia yield against temperature and pressure, with a marker you move. Tiles give the equilibrium yield, a relative reaction speed and their product. A switch shows the human story: the fertiliser that feeds billions and Haber’s chemical weapons.',
 research:'Haber, F. & Le Rossignol, R. (1908–1913) for the laboratory process; Bosch, C. and Mittasch, A. at BASF for the industrial plant at Oppau (1913). Yields from the classic tables (Larson, A. T. & Dodge, R. L. 1923; rounded). Smil, V. (2001). Enriching the Earth. MIT Press. Erisman, J. W. et al. (2008). How a century of ammonia synthesis changed the world. Nature Geoscience 1, 636–639 (about half the world’s people fed by synthetic nitrogen). Rate here is an illustrative Arrhenius factor.',
 dur:12,hint:'Push the temperature down for a big yield and watch the speed collapse. Then switch to the human story.',
 init:()=>({T:450,P:200,v:'chem'}),
 watch(p){return p<.7?{T:Math.round(lerp(250,550,smooth(p/.7))),P:200,v:'chem'}:{T:450,P:200,v:'people'}},
 ui:[{range:'T',label:'Temperature',min:200,max:600,step:5,get:s=>s.T,act:'T',show:v=>v+' °C'},
  {range:'P',label:'Pressure',min:1,max:3,step:.02,get:s=>Math.log10(s.P),act:'P',show:v=>Math.round(10**Number(v))+' atm'},
  {choose:[['chem','The chemistry'],['people','The people']],label:'View',get:s=>s.v,act:'v'}],
 on:{T(s,v){s.T=Number(v)},P(s,v){s.P=Math.round(10**Number(v))},v(s,v){s.v=v}},
 draw(s){
  if(s.v==='people'){let out=heading('Fritz Haber: fertiliser and gas',26);
   const cards=[['Feeding billions',C.green,'Synthetic ammonia fertiliser grows the food for about half the world’s people (Erisman et al. 2008; Smil 2001). Haber won the 1918 Nobel Prize; Carl Bosch shared the 1931 prize for high-pressure chemistry.'],
    ['Chemical weapons',C.coral,'Haber led Germany’s gas programme and oversaw the first large chlorine attack, at Ypres in April 1915. Clara Immerwahr, a chemist and his wife, opposed the work; she died by suicide days later.'],
    ['Exile',C.purple,'Haber, of Jewish descent, resigned his Berlin institute in 1933 under Nazi laws and died in exile in 1934. Explosives as well as fertiliser come from the same ammonia.']];
   cards.forEach(([t,col,body],i)=>{const y=52+i*104;out+=R(40,y,520,94,'#fff',col,10,'stroke-width="2"')+TBF(56,y+24,t,15,col,'start')+C5_lines(56,y+46,C5_wrap(body,80),13,C.ink,'start',17)});
   return {svg:out,phase:'The same reaction feeds most of humanity and fed the explosives and gas of the First World War. Chemistry’s benefits and harms often share a flask.'}}
  let out=heading('N₂ + 3H₂ ⇌ 2NH₃   ΔH = −92 kJ/mol',26);
  const x0=70,y0=56,w=300,h=230;
  for(let i=0;i<30;i++)for(let j=0;j<20;j++){const T=200+i*400/30+400/60,lp=1+j*2/20+.05,y=C5_haber(T,10**lp);const a=y/100;out+=R(x0+i*w/30,y0+h-(j+1)*h/20,w/30+.4,h/20+.4,`rgb(${Math.round(240-a*190)},${Math.round(244-a*120)},${Math.round(250-a*90)})`,'none',0)}
  out+=R(x0,y0,w,h,'none',C.grid,2);
  [200,300,400,500,600].forEach(T=>{const x=x0+(T-200)/400*w;out+=TF(x,y0+h+17,T+'°',12,C.muted)});
  [10,100,1000].forEach(Pp=>{const y=y0+h-(Math.log10(Pp)-1)/2*h;out+=TF(x0-6,y+4,Pp+'',12,C.muted,'end')});
  out+=TF(x0+w/2,y0+h+36,'temperature (°C)',13,C.muted)+TF(x0,y0-8,'pressure (atm, log scale) · darker = more ammonia',12,C.muted,'start');
  const mx=x0+(s.T-200)/400*w,my=y0+h-(Math.log10(s.P)-1)/2*h;out+=Ci(mx,my,8,C.coral,'#fff');
  const Y=C5_haber(s.T,s.P),rate=Math.exp(-160000/C5_R*(1/(s.T+273)-1/723)),prod=Y*Math.min(rate,1.6);
  out+=R(400,60,180,56,'#fff',C.grid,8)+TF(490,80,'equilibrium NH₃',12,C.muted)+TBF(490,104,Y.toFixed(1)+'%',16,C.blue);
  out+=R(400,126,180,56,'#fff',C.grid,8)+TF(490,146,'speed (450 °C = 1)',12,C.muted)+TBF(490,170,rate<.01?C5_sci(rate,1):rate.toFixed(2),16,C.green);
  out+=R(400,192,180,56,'#fff',C.grid,8)+TF(490,212,'yield × speed',12,C.muted)+TBF(490,236,prod.toFixed(1),16,C.coral);
  out+=C5_lines(400,276,['Real plants: 400–450 °C,','150–300 atm, iron catalyst,','unreacted gas recycled.'],12,C.muted,'start',16);
  return {svg:out,phase:s.T<350?`At ${s.T} °C the equilibrium is generous (${Y.toFixed(0)}% ammonia) but the reaction crawls, about ${rate<.01?C5_sci(rate,1):rate.toFixed(2)} of the speed at 450 °C.`:s.T>520?`At ${s.T} °C the reaction is fast but the equilibrium holds only ${Y.toFixed(0)}% ammonia.`:`Near ${s.T} °C and ${s.P} atm the plant gets ${Y.toFixed(0)}% ammonia per pass at a useful speed: the industrial compromise.`};
 }});

/* Sabatier principle: a volcano plot for ammonia synthesis (positions approximate). */
const C5_METALS=[['Mo',.88],['Re',.75],['Fe',.58],['Ru',.5],['Os',.45],['Co',.3],['Ni',.18]];
const C5_volc=b=>Math.min(b,1-b)*2;
SCENE({id:'catalysis-surfaces',name:'Not too sticky, not too slippery',tag:'The Sabatier principle and catalyst design',
 definition:'On a solid catalyst, molecules must stick to the surface to react but let go afterwards. Bind too weakly and nothing reacts; bind too strongly and the products block the surface. The best catalysts sit in between, at the top of a “volcano” of rate against binding strength.',
 example:'For ammonia synthesis, molybdenum holds nitrogen too tightly and nickel too loosely; iron and ruthenium sit near the top, which is why the industry uses iron.',
 desc:'A volcano-shaped curve of reaction rate against how strongly the surface binds nitrogen, with seven metals placed along it. A slider moves a test catalyst; a picture of the surface shows molecules failing to stick, reacting, or jamming the surface.',
 research:'Sabatier, P. (1913). La catalyse en chimie organique; Nobel Prize 1912. Balandin, A. A. (1969) for the volcano curve. Jacobsen, C. J. H. et al. (2001). Catalyst design by interpolation in the periodic table. Journal of the American Chemical Society 123, 8404–8405. Nørskov, J. K. et al. (2014). Fundamental Concepts in Heterogeneous Catalysis. Wiley. Metal positions are approximate and the curve is schematic.',
 dur:10,hint:'Slide from weak to strong binding and watch the surface go from empty, to busy, to clogged.',
 init:()=>({b:.5}),
 watch(p){return {b:Number(lerp(.05,.95,p).toFixed(2))}},
 ui:[{range:'b',label:'Binding strength',min:0,max:1,step:.01,get:s=>s.b,act:'b',show:v=>Number(v)<.35?'weak':Number(v)>.65?'strong':'medium'}],
 on:{b(s,v){s.b=Number(v)}},
 draw(s){
  let out=heading('Rate against how strongly the surface binds N₂',26);
  const pl=C5_plot(70,56,300,200,[0,1],[0,1.1],{xt:[[0,'weak'],[.5,'medium'],[1,'strong']],yl:'rate (relative)'});out+=pl.svg;
  out+=C5_poly(range(101).map(i=>[pl.X(i/100),pl.Y(C5_volc(i/100))]),C.blue,3);
  C5_METALS.forEach(([n,b],i)=>{const x=pl.X(b),y=pl.Y(C5_volc(b));out+=Ci(x,y,5,C.ink)+TF(x,y-(i%2?10:-20),n,12,C.ink)});
  out+=Ci(pl.X(s.b),pl.Y(C5_volc(s.b)),8,C.coral,'#fff');
  const sx=400,sy=240;out+=R(sx,sy,180,18,'#9aa6ae','none',2)+TF(sx+90,sy+36,'catalyst surface',12,C.muted);
  const r=rng(11),stuck=Math.round(s.b*12),busy=Math.round(C5_volc(s.b)*5);
  for(let i=0;i<12;i++){const x=sx+10+i*14.5;if(i<stuck)out+=Ci(x,sy-6,6,i<busy+Math.max(0,stuck-busy-6)?C.coral:'#7a5ea8');}
  for(let i=0;i<6;i++){const x=sx+15+r()*150,y=sy-50-r()*120;out+=Ci(x,y,5,s.b<.3?C.blue:tint(C.blue,.4))}
  for(let i=0;i<busy;i++){out+=Ci(sx+30+i*28,sy-90-(i%2)*30,6,C.green,'#fff')}
  out+=TF(sx+90,76,s.b<.3?'Gas bounces off: too slippery':s.b>.7?'Surface clogged: too sticky':'Busy surface: just right',13,s.b<.3||s.b>.7?C.coral:C.green);
  out+=TF(sx+90,96,'blue: gas · coral: bound · green: product',11,C.muted);
  out+=TF(300,316,'Rate ≈ '+(C5_volc(s.b)).toFixed(2)+' of the best possible.',14,C.ink);
  return {svg:out,phase:s.b<.3?'With weak binding, nitrogen barely sticks, so little reacts.':s.b>.7?'With strong binding, nitrogen sticks but products cannot leave: the surface clogs and the rate falls.':'Near the peak the surface holds nitrogen long enough to split it, then lets ammonia go: iron and ruthenium live here.'};
 }});

/* ================================================================ free-energy */
const C5_RX=[{n:'Ice melting',eq:'H₂O(s) → H₂O(l)',dH:6.01,dS:22.0},{n:'Limestone decomposing',eq:'CaCO₃ → CaO + CO₂',dH:178,dS:161},{n:'Ammonia forming',eq:'N₂ + 3H₂ → 2NH₃',dH:-92.2,dS:-198.7},{n:'Hydrogen burning',eq:'2H₂ + O₂ → 2H₂O(l)',dH:-571.6,dS:-326.7}];
SCENE({id:'free-energy',name:'Which way is downhill?',tag:'Gibbs free energy: ΔG = ΔH − TΔS',
 definition:'Gibbs showed that at constant temperature and pressure a reaction can go by itself only if it lowers the free energy G: ΔG = ΔH − TΔS must be negative. Heat given out (negative ΔH) helps; an increase in disorder (positive ΔS) helps more at higher temperature.',
 example:'Ice melting absorbs heat (ΔH > 0) but increases disorder (ΔS > 0), so it happens only above 273 K, where TΔS outweighs ΔH.',
 desc:'A choice of four reactions. A plot shows ΔG against temperature as a straight line, crossing zero at T = ΔH / ΔS, with the region where the reaction can proceed shaded. A slider moves a marker along the line and tiles give ΔH, TΔS and ΔG.',
 research:'Gibbs, J. W. (1876–1878). On the equilibrium of heterogeneous substances. Transactions of the Connecticut Academy of Arts and Sciences 3, 108–248 and 343–524. Standard enthalpies and entropies at 298 K from standard data tables (rounded), treated as constant with temperature, which is an approximation. A negative ΔG says a reaction can go, not how fast: hydrogen and oxygen sit unreacted until a spark lowers the barrier.',
 dur:12,hint:'Try limestone: it needs strong heating before ΔG turns negative, which is why lime kilns run near 900 °C.',
 init:()=>({k:0,T:298}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {k,T:Math.round(lerp(200,1400,(p*4)%1))}},
 ui:[{choose:C5_RX.map((r,i)=>[i,r.n]),label:'Reaction',get:s=>s.k,act:'k'},
  {range:'T',label:'Temperature',min:200,max:1400,step:1,get:s=>s.T,act:'T',show:v=>v+' K ('+(v-273)+' °C)'}],
 on:{k(s,v){s.k=Number(v)},T(s,v){s.T=Number(v)}},
 draw(s){
  const r=C5_RX[s.k],G=T=>r.dH-T*r.dS/1000;let out=heading(r.eq,26);
  const gs=[G(200),G(1400)],lo=Math.min(...gs,-20),hi=Math.max(...gs,20),pad=(hi-lo)*.08;
  const pl=C5_plot(80,56,340,220,[200,1400],[lo-pad,hi+pad],{xt:[[200,'200'],[600,'600'],[1000,'1000'],[1400,'1400 K']],yt:[[0,'0']],xl:'temperature',yl:'ΔG (kJ)'});out+=pl.svg;
  out+=R(80,pl.Y(0),340,pl.Y(lo-pad)-pl.Y(0),C.greenp,'none',0,'opacity=".7"')+TF(410,pl.Y(lo-pad)-10,'ΔG < 0: can go',12,C.green,'end');
  out+=L(80,pl.Y(0),420,pl.Y(0),C.muted,1.5);
  out+=L(pl.X(200),pl.Y(G(200)),pl.X(1400),pl.Y(G(1400)),C.blue,3);
  const Tc=r.dH/(r.dS/1000);if(Tc>200&&Tc<1400)out+=Ci(pl.X(Tc),pl.Y(0),6,C.ink)+TF(pl.X(Tc),pl.Y(0)-10,Math.round(Tc)+' K',12,C.ink);
  const g=G(s.T);out+=Ci(pl.X(s.T),pl.Y(g),8,g<0?C.green:C.coral,'#fff');
  const tile=(y,l,v,col)=>R(444,y,136,52,'#fff',C.grid,8)+TF(512,y+20,l,12,C.muted)+TBF(512,y+42,v,15,col);
  out+=tile(60,'ΔH',(r.dH>0?'+':'')+r.dH.toFixed(1)+' kJ',C.ink)+tile(122,'TΔS',(s.T*r.dS/1000>0?'+':'')+(s.T*r.dS/1000).toFixed(1)+' kJ',C.purple)+tile(184,'ΔG = ΔH − TΔS',(g>0?'+':'')+g.toFixed(1)+' kJ',g<0?C.green:C.coral);
  out+=TF(300,330,g<0?`At ${s.T} K the reaction can go by itself.`:`At ${s.T} K it will not go by itself.`,14,g<0?C.green:C.coral);
  const why=r.dH<0&&r.dS<0?'It gives out heat but loses disorder, so it is favoured only at low temperature.':r.dH>0&&r.dS>0?'It absorbs heat but gains disorder, so it needs a high enough temperature.':'Heat given out and disorder gained both help: it can go at any temperature.';
  out+=TF(300,352,why,13,C.ink);
  return {svg:out,phase:`${why} ${Tc>0?'The turning point is ΔH / ΔS ≈ '+Math.round(Tc)+' K.':''} A negative ΔG says a reaction can go, not that it will go quickly.`};
 }});

SCENE({id:'free-energy-k',name:'From ΔG° to K',tag:'ΔG° = −RT ln K',
 definition:'The standard free-energy change fixes the equilibrium constant: ΔG° = −RT ln K. A negative ΔG° means K > 1 and products dominate; a positive one means reactants dominate. At room temperature every 5.7 kJ/mol shifts K by a factor of ten.',
 example:'ΔG° = −11.4 kJ/mol gives K ≈ 100: about 99 molecules of product for every 1 of reactant in a simple A ⇌ B reaction.',
 desc:'A slider sets ΔG° for a simple reaction A ⇌ B, and another the temperature. A curve shows the share of B at equilibrium against ΔG°, with your point marked. Tiles give K and the mixture as product per hundred molecules.',
 research:'Follows from Gibbs (1876–1878) and van ’t Hoff’s equation (1884). The 5.7 kJ/mol per factor of ten is RT ln 10 at 298 K. Values here are general, for any reaction of the A ⇌ B form.',
 dur:9,hint:'Find the ΔG° that gives a 50:50 mixture. Then warm the reaction: the same ΔG° gives a less lopsided mixture.',
 init:()=>({g:-10,T:298}),
 watch(p){return {g:Number(lerp(-30,30,p).toFixed(1)),T:298}},
 ui:[{range:'g',label:'ΔG°',min:-40,max:40,step:.5,get:s=>s.g,act:'g',show:v=>Number(v).toFixed(1)+' kJ/mol'},
  {range:'T',label:'Temperature',min:250,max:600,step:1,get:s=>s.T,act:'T',show:v=>v+' K'}],
 on:{g(s,v){s.g=Number(v)},T(s,v){s.T=Number(v)}},
 draw(s){
  let out=heading('A ⇌ B   ·   K = e^(−ΔG° / RT)',26);
  const K=Math.exp(-s.g*1000/(C5_R*s.T)),share=K/(1+K);
  const pl=C5_plot(80,56,320,220,[-40,40],[0,1],{xt:[[-40,'−40'],[-20,'−20'],[0,'0'],[20,'20'],[40,'40']],yt:[[0,'0'],[.5,'½'],[1,'1']],xl:'ΔG° (kJ/mol)',yl:'share that is B'});out+=pl.svg;
  out+=C5_poly(range(161).map(i=>{const g=-40+i/2;const k=Math.exp(-g*1000/(C5_R*s.T));return [pl.X(g),pl.Y(k/(1+k))]}),C.blue,3);
  out+=Ci(pl.X(s.g),pl.Y(share),8,C.coral,'#fff');
  out+=R(424,60,156,56,'#fff',C.grid,8)+TF(502,80,'K',12,C.muted)+TBF(502,104,C5_sci(K,2),16,C.blue);
  out+=R(424,126,156,56,'#fff',C.grid,8)+TF(502,146,'B per 100 molecules',12,C.muted)+TBF(502,170,(share*100).toFixed(share>.995||share<.005?2:1),16,C.coral);
  const grid=Math.round(share*100);for(let i=0;i<100;i++){out+=R(430+(i%10)*14,196+Math.floor(i/10)*14,11,11,i<grid?C.coral:C.pale,'none',2)}
  out+=TF(300,350,'RT ln 10 = '+(C5_R*s.T*Math.LN10/1000).toFixed(2)+' kJ/mol per factor of ten in K at '+s.T+' K',13,C.ink);
  return {svg:out,phase:`ΔG° = ${s.g.toFixed(1)} kJ/mol at ${s.T} K gives K = ${C5_sci(K,2)}: about ${(share*100).toFixed(1)} molecules of B in every hundred at equilibrium.`};
 }});

/* Counting arrangements: N particles in a box of two halves. */
function C5_binom(n,k){let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return r}
SCENE({id:'free-energy-entropy',name:'Entropy as counting',tag:'S = k ln W',
 definition:'Boltzmann linked entropy to counting: S = k ln W, where W is the number of microscopic arrangements that look the same from outside. Spread-out states have vastly more arrangements than bunched-up ones, so systems drift towards them simply because they are more likely.',
 example:'With 20 molecules there is 1 way to have all of them on the left but 184,756 ways to split them 10 and 10.',
 desc:'A box divided into two halves holds 20 molecules. A slider sets how many are on the left. Bars show the number of arrangements W for every possible split, with yours highlighted, and tiles give W, ln W and the chance of finding that split if every arrangement is equally likely.',
 research:'Boltzmann, L. (1877). Über die Beziehung zwischen dem zweiten Hauptsatze der mechanischen Wärmetheorie und der Wahrscheinlichkeitsrechnung. Wiener Berichte 76, 373–435. The formula S = k log W, in Planck’s notation, is carved on Boltzmann’s grave in Vienna. W here is the binomial coefficient C(20, n). See Physics In Motion for heat and entropy.',
 dur:10,hint:'Move from all-left to an even split and watch W explode: that is why gas fills its container and does not un-mix.',
 init:()=>({n:20}),
 watch(p){return {n:Math.round(lerp(20,10,smooth(p/.85)))}},
 ui:[{range:'n',label:'Molecules on the left',min:0,max:20,step:1,get:s=>s.n,act:'n',show:v=>v+' of 20'}],
 on:{n(s,v){s.n=Number(v)}},
 draw(s){
  let out=heading('Twenty molecules, two halves of a box',26);
  out+=R(60,60,220,140,'#fff',C.ink,4)+L(170,60,170,200,C.muted,2,'stroke-dasharray="6 5"');
  const r=rng(3);for(let i=0;i<20;i++){const left=i<s.n;const x=(left?72:182)+r()*86,y=72+r()*116;out+=Ci(x,y,6,left?C.blue:C.coral)}
  out+=TF(115,220,'left: '+s.n,13,C.blue)+TF(225,220,'right: '+(20-s.n),13,C.coral);
  const W=C5_binom(20,s.n),tot=Math.pow(2,20);
  const pl=C5_plot(310,60,270,160,[-.5,20.5],[0,190000],{xt:[[0,'0'],[10,'10'],[20,'20']],yt:[[0,'0']],xl:'molecules on the left',yl:'arrangements W (peak 184,756)'});out+=pl.svg;
  for(let k=0;k<=20;k++){const w=C5_binom(20,k);out+=R(pl.X(k)-5,pl.Y(w),10,Math.max(.5,pl.Y(0)-pl.Y(w)),k===s.n?C.coral:C.line,'none',1)}
  const tile=(x,l,v,col)=>R(x,260,170,56,'#fff',C.grid,8)+TF(x+85,280,l,12,C.muted)+TBF(x+85,304,v,15,col);
  out+=tile(40,'arrangements W',Math.round(W).toLocaleString('en-GB'),C.coral)+tile(215,'ln W (entropy ÷ k)',Math.log(W).toFixed(2),C.blue)+tile(390,'chance of this split',(W/tot*100<.01?C5_sci(W/tot*100,2):(W/tot*100).toFixed(2))+'%',C.ink);
  out+=TF(300,350,'S = k ln W: more arrangements, more entropy.',14,C.ink);
  return {svg:out,phase:`${s.n} on the left can happen in ${Math.round(W).toLocaleString('en-GB')} ways out of ${tot.toLocaleString('en-GB')}. ${s.n===10?'The even split is the single most likely state.':s.n===0||s.n===20?'All on one side happens in exactly one way: about once in a million looks.':'Splits near ten and ten are far more likely, so mixtures spread out and stay spread.'}`};
 }});
