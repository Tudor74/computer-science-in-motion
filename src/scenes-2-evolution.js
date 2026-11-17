/* ===================== Biology era 2 · Evolution (1830–1930) ===================== */
// Shared helpers for this era (prefix B2_).
const B2_m=(v,d=1)=>(+v).toFixed(d);
const B2_path=pts=>'M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join('L');
// Axes in a box. Ticks are numbers or [value,label]. Returns {svg,X,Y}.
function B2_axes(x,y,w,h,xr,yr,o={}){
 const X=v=>x+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let s=R(x,y,w,h,'#fff',C.grid,6);
 for(const t of o.xt||[]){const [v,l]=Array.isArray(t)?t:[t,t];s+=L(X(v),y,X(v),y+h,'#eef3f6',1)+TF(X(v),y+h+15,l,13,C.muted)}
 for(const t of o.yt||[]){const [v,l]=Array.isArray(t)?t:[t,t];s+=L(x,Y(v),x+w,Y(v),'#eef3f6',1)+TF(x-6,Y(v)+4,l,13,C.muted,'end')}
 if(o.xl)s+=TF(x+w/2,y+h+31,o.xl,13,C.muted);
 if(o.yl)s+=TF(x+8,y+15,o.yl,13,C.muted,'start');
 return {svg:s,X,Y};
}
// Normal distribution tools.
const B2_phi=z=>Math.exp(-z*z/2)/Math.sqrt(2*Math.PI);
function B2_erf(x){const s=x<0?-1:1;x=Math.abs(x);const t=1/(1+.3275911*x);const y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-x*x);return s*y}
const B2_Phi=z=>.5*(1+B2_erf(z/Math.SQRT2));
function B2_probit(p){let lo=-8,hi=8;for(let i=0;i<64;i++){const m=(lo+hi)/2;if(B2_Phi(m)<p)lo=m;else hi=m}return (lo+hi)/2}
// Selection intensity for truncation selection keeping the top fraction p: i = φ(z)/p.
const B2_intensity=p=>B2_phi(B2_probit(1-p))/p;
// Seeded standard normal (Box–Muller).
function B2_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
// A soft-cornered panel title.
const B2_title=(x,y,s,col=C.muted)=>TF(x,y,s,13,col,'start','font-weight="650"');

/* ---------- Lesson: deep-time ---------- */
// Ages in millions of years ago; positions on a one-year calendar are approximate and labelled so.
const B2_EVENTS=[
 {n:'Earth forms',ma:4540,why:'Lead isotopes in meteorites (Patterson 1956).'},
 {n:'Oldest mineral grains',ma:4400,why:'Zircon crystals from Jack Hills, Western Australia (Wilde et al. 2001).'},
 {n:'Clear signs of life',ma:3480,why:'Microbial mats and stromatolites in the Pilbara, Australia; older claims are disputed.'},
 {n:'Oxygen builds up in air',ma:2400,why:'The Great Oxidation Event, made by photosynthesising bacteria.'},
 {n:'Complex (eukaryotic) cells',ma:1800,why:'Fossil dates are uncertain; estimates range widely.'},
 {n:'Cambrian explosion',ma:538,why:'Most animal body plans appear in the fossil record within about 25 million years.'},
 {n:'Plants on land',ma:470,why:'Spores of the first land plants.'},
 {n:'Dinosaurs (not birds) die out',ma:66,why:'An asteroid impact at Chicxulub, Mexico.'},
 {n:'Homo sapiens',ma:.3,why:'Fossils from Jebel Irhoud, Morocco (Hublin et al. 2017).'},
 {n:'Writing',ma:.0052,why:'Clay tablets in Mesopotamia, about 5,200 years ago.'}];
const B2_MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],B2_MDAYS=[31,28,31,30,31,30,31,31,30,31,30,31];
function B2_calendar(ma){
 const left=ma/4540*365;// days before midnight on 31 December
 if(left<1){const sec=left*86400;if(sec<60)return `31 Dec, ${B2_m(sec,0)} seconds before midnight`;const mins=sec/60;if(mins<60)return `31 Dec, ${B2_m(mins,0)} minutes before midnight`;const hh=Math.floor(24-sec/3600),mm=Math.floor((24-sec/3600-hh)*60);return `31 Dec, ${pad(hh,2)}:${pad(mm,2)}`}
 let day=Math.max(0,365-left),m=0;while(m<11&&day>=B2_MDAYS[m]){day-=B2_MDAYS[m];m++}
 return `${Math.floor(day)+1} ${B2_MONTHS[m]}`;
}
SCENE({id:'deep-time',name:'Deep time',tag:'Earth’s history as one year',
 definition:'Deep time is the immense age of the Earth, about 4.54 billion years. Evolution by natural selection needs that much time, and geologists established it before biologists could explain it.',
 example:'Squeeze the Earth’s history into one calendar year. Life appears by late March, animals with shells and skeletons only in mid-November, and Homo sapiens about half an hour before midnight on 31 December.',
 desc:'A one-year calendar bar from January to December with ten events marked on it, from the Earth forming on 1 January to writing in the last minute of the year; the selected event is described below.',
 research:'Hutton, J. (1788). Theory of the Earth. Transactions of the Royal Society of Edinburgh 1; Patterson, C. (1956). Age of meteorites and the earth. Geochimica et Cosmochimica Acta 10, 230–237; Hublin, J.-J. et al. (2017). Nature 546, 289–292.',
 dur:12,hint:'Move the slider or press a marker. Notice how much of the year passes before anything you could see without a microscope.',
 init:()=>({e:5}),
 watch(p){return {e:Math.min(9,Math.floor(p*10))}},
 ui:[{range:'e',label:'Event',min:0,max:9,step:1,get:s=>s.e,act:'e',show:v=>B2_EVENTS[v].n}],
 on:{e(s,v){s.e=Number(v)},pick(s,v){s.e=Number(v)}},
 draw(s,f,X){
  let out=heading('The Earth’s 4.54 billion years as one year');
  const x0=40,x1=560,y=120,dx=d=>x0+(x1-x0)*d/365;
  let acc=0;B2_MONTHS.forEach((mn,i)=>{const a=dx(acc),b=dx(acc+B2_MDAYS[i]);out+=R(a,y,b-a,34,i%2?'#eef4f8':'#e1eef7','none',0)+TF((a+b)/2,y+22,mn,13,C.muted);acc+=B2_MDAYS[i]});
  out+=R(x0,y,x1-x0,34,'none',C.line,4);
  B2_EVENTS.forEach((e,i)=>{const d=365-e.ma/4540*365,x=dx(d),sel=i===s.e,ty=i%2?y+64:y-12;
   const mk=(i%2?L(x,y+34,x,y+44,sel?C.coral:C.ink,sel?3:1.5):L(x,y-4,x,y,sel?C.coral:C.ink,sel?3:1.5))+L(x,y,x,y+34,sel?C.coral:C.ink,sel?2.5:1,'opacity=".35"')+Ci(x,i%2?y+44:y-4,sel?7:5,sel?C.coral:C.blue);
   out+=hit(X,'pick',i,`${e.n}: ${B2_calendar(e.ma)}`,mk);
   if(i<8)out+=TF(x,i%2?y+64:y-14,String(i+1),13,sel?C.coral:C.muted)});
  out+=TF(dx(365)+2,y-14,'9, 10',13,s.e>=8?C.coral:C.muted,'end');
  const e=B2_EVENTS[s.e];
  out+=R(40,222,520,112,'#fff',C.grid,8);
  out+=TBF(58,250,`${s.e+1}. ${e.n}`,17,C.coral,'start');
  out+=TF(58,276,`${e.ma>=1?Math.round(e.ma).toLocaleString('en-GB')+' million':Math.round(e.ma*1e6).toLocaleString('en-GB')} years ago`,15,C.ink,'start');
  out+=TBF(58,300,`On the calendar: ${B2_calendar(e.ma)}`,15,C.blue,'start');
  out+=TF(58,323,e.why,13,C.muted,'start');
  out+=TF(300,360,'Dates are approximate; 1 day on this calendar ≈ 12.4 million years.',13,C.muted);
  return {svg:out,phase:`${e.n}: ${B2_calendar(e.ma)}. Most of the year is single-celled life; everything humans have written fits in the last ${B2_m(.0052/4540*365*86400,0)} seconds.`};
 }});

SCENE({id:'deep-time-strata',name:'Reading the rocks',tag:'Hutton’s unconformity and Lyell’s slow change',
 definition:'Uniformitarianism is the principle that the processes we see today, such as erosion and the settling of sediment, acting over long periods, explain the Earth’s past. Layers of rock can then be read as a clock.',
 example:'At Siccar Point in Scotland, Hutton saw near-vertical layers of grey rock cut flat and covered by gently sloping red sandstone. Laying down, tilting, wearing away and burying again implied, as his friend John Playfair wrote, an “abyss of time”.',
 desc:'A cross-section of rock: tilted older layers below an uneven erosion surface, with flat younger layers above. Two sliders set the total thickness and the rate at which sediment settles, and a counter gives the time the layers represent, compared with older estimates of the Earth’s age.',
 research:'Hutton, J. (1788). Theory of the Earth; Playfair, J. (1805). Biographical account of the late Dr James Hutton; Lyell, C. (1830–33). Principles of Geology. Deposition rates here are illustrative: real rates vary by many orders of magnitude.',
 dur:10,hint:'Set how thick the rock is and how fast sediment settles. Even generous rates give far more than a few thousand years.',
 init:()=>({th:3000,rate:.3}),
 watch(p){return {th:3000,rate:+(1-p*.95).toFixed(2)}},
 ui:[{range:'th',label:'Thickness',min:200,max:6000,step:100,get:s=>s.th,act:'th',show:v=>v.toLocaleString('en-GB')+' m'},{range:'rate',label:'Settling rate',min:.05,max:1,step:.05,get:s=>s.rate,act:'rate',show:v=>B2_m(v,2)+' mm a year'}],
 on:{th(s,v){s.th=v},rate(s,v){s.rate=v}},
 draw(s){
  let out=heading('How long do the layers take?');
  const yrs=s.th*1000/s.rate,x0=40,w=280,top=60,bot=330;
  out+=R(x0,top,w,bot-top,'#b9c3ca','none',0);
  const unc=y=>210+12*Math.sin((y-x0)/40);
  for(let k=0;k<14;k++){const xa=x0-60+k*28;const col=k%2?'#9aa7b0':'#b9c3ca';out+=`<polygon points="${fmt(xa)},${bot} ${fmt(xa+28)},${bot} ${fmt(xa+28+70)},${fmt(unc(xa+98))} ${fmt(xa+70)},${fmt(unc(xa+70))}" fill="${col}" clip-path="url(#b2clip)"/>`}
  out=`<defs><clipPath id="b2clip"><rect x="${x0}" y="${top}" width="${w}" height="${bot-top}"/></clipPath></defs>`+out;
  // Younger flat layers above
  const nY=Math.max(3,Math.min(9,Math.round(s.th/700)+2)),h=(210-top)/nY;
  for(let k=0;k<nY;k++){const col=k%2?'#d99f7c':'#e6b896';if(k<nY-1)out+=R(x0,top+k*h,w,h+1,col,'none',0);else{const pts=range(29).map(i=>{const x=x0+i*w/28;return fmt(x)+','+fmt(unc(x))});out+=`<polygon points="${fmt(x0)},${fmt(top+k*h)} ${fmt(x0+w)},${fmt(top+k*h)} ${pts.reverse().join(' ')}" fill="${col}"/>`}}
  out+=P(B2_path(range(29).map(i=>{const x=x0+i*w/28;return [x,unc(x)]})),C.ink,3);
  out+=R(x0,top,w,bot-top,'none',C.ink,2);
  out+=TF(x0+w/2,top+18,'younger layers, laid flat',13,C.ink)+TF(x0+w/2,bot-12,'older layers, tilted',13,'#fff');
  out+=TF(x0+w+6,216,'← erosion',13,C.coral,'start')+TF(x0+w+20,233,'surface',13,C.coral,'start');
  const fmtY=y=>y>=1e9?B2_m(y/1e9,1)+' billion':y>=1e6?B2_m(y/1e6,1)+' million':Math.round(y).toLocaleString('en-GB');
  out+=counter(430,70,'time represented',fmtY(yrs)+' yrs',C.blue,150);
  const refs=[['Ussher (1650)','about 6,000 years',6e3],['Kelvin (1897)','20–40 million years',3e7],['Patterson (1956)','4.54 billion years',4.54e9]];
  refs.forEach(([a,b,v],i)=>{const y=150+i*56,big=yrs>v;out+=R(430,y,150,48,'#fff',big?C.green:C.grid,8)+TF(505,y+18,a,13,C.muted)+TBF(505,y+38,b,14,big?C.green:C.ink)});
  out+=TF(300,362,`${s.th.toLocaleString('en-GB')} m ÷ ${B2_m(s.rate,2)} mm a year = ${fmtY(yrs)} years, ignoring the time lost in the gap.`,13,C.muted);
  return {svg:out,phase:`At ${B2_m(s.rate,2)} mm a year, ${s.th.toLocaleString('en-GB')} m of sediment takes about ${fmtY(yrs)} years, and that is only the visible layers. The erosion surface is a gap of unknown length: Hutton’s point was that such gaps add even more time.`};
 }});

const B2_ISO=[{k:'c14',n:'Carbon-14 → nitrogen-14',half:5730,unit:'years',use:'Once-living material up to about 50,000 years old (Libby 1949).'},
 {k:'k40',n:'Potassium-40 → argon-40',half:1.25e9,unit:'years',use:'Volcanic rocks, such as the ash layers that date early human fossils.'},
 {k:'u238',n:'Uranium-238 → lead-206',half:4.468e9,unit:'years',use:'The oldest rocks and meteorites; Patterson’s 4.55 billion years.'}];
SCENE({id:'deep-time-dating',name:'Radiometric dating',tag:'Clocks inside the rocks',
 definition:'Radioactive atoms decay into other atoms at a fixed rate. The half-life is the time for half of them to decay, so the fraction still left gives an age: age = half-life × log₂(1 ÷ fraction left).',
 example:'If a rock’s uranium-238 crystals have lost exactly half their uranium to lead, the rock is one half-life old: about 4.47 billion years.',
 desc:'A 10 by 10 grid of atoms, some still the parent isotope and the rest decayed, beside a decay curve with the chosen fraction marked and the age it implies.',
 research:'Rutherford, E. & Soddy, F. (1902). The cause and nature of radioactivity; Boltwood, B. B. (1907). American Journal of Science 23, 77–88; Holmes, A. (1913). The Age of the Earth; Patterson (1956); Libby, W. F. (1949) on radiocarbon.',
 dur:10,hint:'Choose a clock and set the fraction of parent atoms still left. Each halving adds one more half-life.',
 init:()=>({iso:2,f:50}),
 watch(p){return {iso:p<.33?0:p<.66?1:2,f:Math.round(90-((p*3)%1)*80)}},
 ui:[{choose:B2_ISO.map((c,i)=>[i,c.n.split(' ')[0]]),label:'Isotope',get:s=>s.iso,act:'iso'},{range:'f',label:'Parent left',min:1,max:99,step:1,get:s=>s.f,act:'f',show:v=>v+'%'}],
 on:{iso(s,v){s.iso=Number(v)},f(s,v){s.f=v}},
 draw(s){
  const c=B2_ISO[s.iso],fr=s.f/100,hl=Math.log2(1/fr),age=c.half*hl;let out=heading(c.n);
  const order=shuffled(range(100),31),left=Math.round(s.f);
  order.forEach((k,j)=>{const x=50+(k%10)*22,y=72+Math.floor(k/10)*22,parent=j<left;out+=Ci(x,y,8,parent?C.blue:'#fff',parent?'none':C.coral)});
  out+=Ci(54,312,7,C.blue)+TF(66,317,`parent ${left}`,13,C.ink,'start')+Ci(150,312,7,'#fff',C.coral)+TF(162,317,`decayed ${100-left}`,13,C.ink,'start');
  const A=B2_axes(310,64,250,200,[0,7],[0,1],{xt:[0,1,2,3,4,5,6,7],yt:[[0,'0'],[.25,'¼'],[.5,'½'],[1,'1']],xl:'half-lives',yl:'fraction left'});out+=A.svg;
  out+=P(B2_path(range(71).map(i=>[A.X(i/10),A.Y(Math.pow(.5,i/10))])),C.blue,3);
  const hx=Math.min(7,hl);out+=L(A.X(0),A.Y(fr),A.X(hx),A.Y(fr),C.coral,1.5,'stroke-dasharray="4 3"')+L(A.X(hx),A.Y(fr),A.X(hx),A.Y(0),C.coral,1.5,'stroke-dasharray="4 3"')+Ci(A.X(hx),A.Y(fr),6,C.coral);
  const fy=a=>a>=1e9?B2_m(a/1e9,2)+' billion':a>=1e6?B2_m(a/1e6,1)+' million':Math.round(a).toLocaleString('en-GB');
  out+=TBF(300,340,`${B2_m(hl,2)} half-lives × ${fy(c.half)} years = ${fy(age)} years`,15,C.coral);
  out+=TF(300,362,c.use,13,C.muted);
  return {svg:out,phase:`${s.f}% of the parent atoms remain, so ${B2_m(hl,2)} half-lives have passed: about ${fy(age)} years. Kelvin’s 1897 estimate of 20–40 million years was overturned once radioactivity was understood.`};
 }});

/* ---------- Lesson: natural-selection ---------- */
const B2_MOTHS=(()=>{const r=rng(42);return range(48).map(i=>({x:58+r()*224,y:78+r()*214,a:r()*2-1,rank:r()}))})();
const B2_rankOrder=B2_MOTHS.map((m,i)=>[m.rank,i]).sort((a,b)=>a[0]-b[0]).map(p=>p[1]);
function B2_moth(x,y,a,dark){const c=dark?'#2f3438':'#e9e4d8',st=dark?'#151a1d':'#9a9384';return `<g transform="translate(${fmt(x)} ${fmt(y)}) rotate(${fmt(a*25)})"><path d="M0 0L-13 -7Q-15 4 -4 6Z" fill="${c}" stroke="${st}" stroke-width="1"/><path d="M0 0L13 -7Q15 4 4 6Z" fill="${c}" stroke="${st}" stroke-width="1"/><ellipse cx="0" cy="0" rx="2" ry="6" fill="${st}"/></g>`}
SCENE({id:'natural-selection',name:'Natural selection',tag:'Darwin and Wallace, 1858',
 definition:'Natural selection: individuals vary, some of the variation is inherited, and variants that leave more offspring become more common in the next generation. Over many generations the population changes.',
 example:'On soot-darkened tree bark, birds find pale moths more easily than dark ones. If pale moths leave 30% fewer offspring than dark ones, dark moths go from 5% to almost all moths within a few dozen generations.',
 desc:'A patch of tree bark with 48 moths, dark and pale, beside a graph of the share of dark moths over generations; the curve rises in an S shape when the background is dark and falls when it is pale.',
 research:'Darwin, C. & Wallace, A. R. (1858). On the tendency of species to form varieties. Journal of the Proceedings of the Linnean Society, Zoology 3, 45–62; Darwin, C. (1859). On the Origin of Species.',
 dur:12,hint:'Choose the bark colour and how strongly birds pick out the easier-to-see moths, then press Run or step through the generations.',
 init:()=>({bg:'dark',s:.3}),
 trace(s){const fr=[];let p=s.bg==='dark'?.05:.95;const wd=s.bg==='dark'?1:1-s.s,wl=s.bg==='dark'?1-s.s:1;
  for(let g=0;g<=30;g++){fr.push({g,p});p=p*wd/(p*wd+(1-p)*wl)}return fr},
 ui:[{choose:[['dark','Sooty bark'],['light','Clean bark']],label:'Background',get:s=>s.bg,act:'bg'},{range:'s',label:'Selection',min:0,max:.6,step:.05,get:s=>s.s,act:'s',show:v=>Math.round(v*100)+'% fewer offspring'}],
 on:{bg(s,v){s.bg=v;return 'run'},s(s,v){s.s=v}},
 draw(s,f){
  const fr=f||{g:0,p:s.bg==='dark'?.05:.95},nd=Math.round(fr.p*48),dark=new Set(B2_rankOrder.slice(0,nd));let out=heading('Moths on tree bark');
  out+=R(40,62,260,250,s.bg==='dark'?'#4b4e4f':'#c9c2ae','none',8);
  for(let k=0;k<7;k++)out+=P(`M${50+k*38} 64Q${62+k*38} 190 ${46+k*38} 310`,s.bg==='dark'?'#3d4041':'#b7af98',4);
  B2_MOTHS.forEach((m,i)=>{out+=B2_moth(m.x,m.y,m.a,dark.has(i))});
  out+=TF(170,334,`generation ${fr.g}: ${nd} dark, ${48-nd} pale`,14,C.ink);
  const A=B2_axes(345,62,215,230,[0,30],[0,1],{xt:[0,10,20,30],yt:[[0,'0'],[.5,'50%'],[1,'100%']],xl:'generation',yl:'share dark'});out+=A.svg;
  const all=this.trace(s),upto=all.filter(q=>q.g<=fr.g);
  out+=P(B2_path(all.map(q=>[A.X(q.g),A.Y(q.p)])),C.line,2,'none','stroke-dasharray="5 4"');
  out+=P(B2_path(upto.map(q=>[A.X(q.g),A.Y(q.p)])),C.coral,3)+Ci(A.X(fr.g),A.Y(fr.p),6,C.coral);
  const sel=s.s===0?'With no difference in survival, nothing changes: selection needs unequal success.':s.bg==='dark'?'On dark bark, pale moths are eaten more often, so each generation has a slightly larger share of dark moths. The change is slow at first, fast in the middle, and slow again near the top.':'On clean bark the advantage reverses and the dark form declines, as happened after clean-air laws.';
  return {svg:out,phase:`Generation ${fr.g}: ${Math.round(fr.p*100)}% dark. ${sel}`};
 }});

SCENE({id:'natural-selection-ingredients',name:'Three ingredients',tag:'Variation, heredity, unequal success',
 definition:'Selection changes a population only when three things hold together: individuals differ in a trait, the differences are partly inherited, and the trait affects how many offspring they leave. Remove any one and the population does not change.',
 example:'In a herd of identical clones, nothing can be selected. If tall parents have tall offspring only by chance of good food, selection on height changes nothing in the next generation. If height does not affect survival, there is variation and heredity but no selection.',
 desc:'Three switches for variation, heredity and unequal success, a bell-shaped spread of the trait with the parents of the next generation shaded, and a graph of the average trait over ten generations that only climbs when all three switches are on.',
 research:'Lewontin, R. C. (1970). The units of selection. Annual Review of Ecology and Systematics 1, 1–18; Darwin (1859), chapters 1–4. The response follows the breeder’s equation R = h²S (Lush 1937).',
 dur:10,hint:'Turn each ingredient off in turn and watch the average stop moving.',
 init:()=>({v:true,h:true,d:true}),
 watch(p){const k=Math.floor(p*4);return {v:k!==1,h:k!==2,d:k!==3}},
 ui:[{b:'Variation',act:'v'},{b:'Heredity',act:'h'},{b:'Unequal success',act:'d'}],
 on:{v(s){s.v=!s.v},h(s){s.h=!s.h},d(s){s.d=!s.d},tog(s,k){s[k]=!s[k]}},
 draw(s,f,X){
  let out=heading('All three, or nothing');
  [['v','Variation'],['h','Heredity'],['d','Unequal success']].forEach(([k,l],i)=>{const x=40+i*178,on=s[k];
   out+=hit(X,'tog',k,`${l}: ${on?'on':'off'}. Press to switch.`,R(x,52,162,40,on?C.greenp:'#f4f4f4',on?C.green:C.line,8)+TBF(x+81,77,`${l}: ${on?'on':'off'}`,14,on?C.green:C.muted))});
  const sd=s.v?1:.12,S=s.d&&s.v?B2_intensity(.5)*sd:0,h2=s.h?.5:0,R1=h2*S;
  // Trait distribution of one generation, top half shaded as parents when selection acts
  const A=B2_axes(40,116,250,170,[-3.5,3.5],[0,1],{xt:[[-3,'small'],[0,'average'],[3,'large']],xl:'trait in one generation'});out+=A.svg;
  const ys=z=>Math.exp(-z*z/(2*sd*sd));
  const pts=range(141).map(i=>{const z=-3.5+i*.05;return [A.X(z),A.Y(ys(z)*.9)]});
  out+=`<polygon points="${fmt(A.X(-3.5))},${fmt(A.Y(0))} ${pts.map(p=>fmt(p[0])+','+fmt(p[1])).join(' ')} ${fmt(A.X(3.5))},${fmt(A.Y(0))}" fill="${C.pale}"/>`;
  if(s.d){const sh=range(71).map(i=>{const z=i*.05;return [A.X(z),A.Y(ys(z)*.9)]});out+=`<polygon points="${fmt(A.X(0))},${fmt(A.Y(0))} ${sh.map(p=>fmt(p[0])+','+fmt(p[1])).join(' ')} ${fmt(A.X(3.5))},${fmt(A.Y(0))}" fill="${C.green}" opacity=".45"/>`;out+=TF(A.X(1.6),A.Y(.98),'leave offspring',13,C.green)}
  out+=P(B2_path(pts),C.blue,2.5);
  const B=B2_axes(340,116,220,170,[0,10],[0,4.2],{xt:[0,5,10],yt:[0,2,4],xl:'generation',yl:'average trait'});out+=B.svg;
  out+=P(B2_path(range(11).map(g=>[B.X(g),B.Y(g*R1)])),s.v&&s.h&&s.d?C.green:C.coral,3);
  const missing=[['v','variation'],['h','heredity'],['d','unequal success']].filter(([k])=>!s[k]).map(x=>x[1]);
  out+=TF(300,352,`S = ${B2_m(S,2)} · h² = ${B2_m(h2,1)} · response R = h²S = ${B2_m(R1,2)} per generation`,14,C.ink);
  return {svg:out,phase:missing.length?`Without ${missing.join(' and ')}, the average stays put. ${!s.v?'If everyone is alike, no one can do better than anyone else.':!s.h?'The winners’ offspring are no different from anyone else’s.':'Everyone leaves the same number of offspring, so the mix cannot shift.'}`:'With all three, the parents of each generation are a little above average, their offspring inherit half of that advantage, and the average climbs steadily.'};
 }});

const B2_MOTHDATA={rise:{pts:[[1848,.01],[1895,.98]],start:[1848,.01],dir:1,place:'Manchester',best:.20,span:[1840,1910]},fall:{pts:[[1959,.93],[1995,.18]],start:[1959,.93],dir:-1,place:'Caldy Common, near Liverpool',best:.12,span:[1950,2005]}};
const B2_logit=p=>Math.log(p/(1-p)),B2_logistic=x=>1/(1+Math.exp(-x));
SCENE({id:'natural-selection-moths',name:'The peppered moth',tag:'Selection you can date',
 definition:'Industrial melanism is the rise of dark forms of animals in polluted places. In the peppered moth (Biston betularia) a dark form, carbonaria, rose from a rarity to almost all moths around Manchester in about 50 years, then fell after the air was cleaned.',
 example:'The first dark peppered moth near Manchester was recorded in 1848; by 1895 about 98% were dark. At Caldy Common near Liverpool the dark share fell from about 93% in 1959 to under 20% by 1995, after clean-air laws.',
 desc:'A graph of the share of dark moths against year, with published data points for the rise near Manchester or the fall at Caldy Common, and an S-shaped model curve whose selection strength the learner adjusts to pass through the points.',
 research:'Haldane, J. B. S. (1924). A mathematical theory of natural and artificial selection, part I; Kettlewell, H. B. D. (1955). Heredity 9, 323–342; Grant, B. S., Owen, D. F. & Clarke, C. A. (1996). Journal of Heredity 87, 351–357; Cook, L. M. et al. (2012). Biology Letters 8, 609–612; van’t Hof, A. E. et al. (2016). Nature 534, 102–105.',
 dur:12,hint:'Choose the rise or the fall, then change the yearly advantage until the curve passes through both points. One generation a year.',
 init:()=>({ph:'rise',r:.1}),
 watch(p){return p<.5?{ph:'rise',r:+(.08+p/.5*.14).toFixed(2)}:{ph:'fall',r:+(.05+(p-.5)/.5*.09).toFixed(2)}},
 ui:[{choose:[['rise','The rise'],['fall','The fall']],label:'Period',get:s=>s.ph,act:'ph'},{range:'r',label:'Advantage',min:.02,max:.4,step:.01,get:s=>s.r,act:'r',show:v=>Math.round(v*100)+'% a year'}],
 on:{ph(s,v){s.ph=v},r(s,v){s.r=v}},
 draw(s){
  const d=B2_MOTHDATA[s.ph],[y0,p0]=d.start,model=y=>B2_logistic(B2_logit(p0)+d.dir*Math.log(1+s.r)*(y-y0));let out=heading(`Share of dark moths, ${d.place}`);
  const A=B2_axes(70,58,470,230,d.span,[0,1],{xt:s.ph==='rise'?[1840,1860,1880,1900]:[1950,1960,1970,1980,1990,2000],yt:[[0,'0'],[.5,'50%'],[1,'100%']],xl:'year (about one generation a year)',yl:'share of moths that are dark'});out+=A.svg;
  out+=P(B2_path(range(121).map(i=>{const y=d.span[0]+(d.span[1]-d.span[0])*i/120;return [A.X(y),A.Y(y<y0?(s.ph==='rise'?0:p0):model(y))]})),C.blue,3);
  d.pts.forEach(([y,p])=>{out+=Ci(A.X(y),A.Y(p),8,C.coral,'#fff')+TF(A.X(y)+(y===d.pts[0][0]?12:-12),A.Y(p)+(p>.5?22:-12),`${y}: ${Math.round(p*100)}%`,13,C.coral,y===d.pts[0][0]?'start':'end')});
  const [ye,pe]=d.pts[1],err=Math.abs(model(ye)-pe);
  out+=TBF(300,334,`model in ${ye}: ${Math.round(model(ye)*100)}% · recorded: ${Math.round(pe*100)}% · ${err<.04?'a good fit':'adjust the advantage'}`,14,err<.04?C.green:C.ink);
  out+=TF(300,354,'Simplified: a two-type logistic model, one generation a year.',13,C.muted)+TF(300,372,'Haldane (1924), modelling a dominant allele, also found a large advantage.',13,C.muted);
  return {svg:out,phase:s.ph==='rise'?`A yearly advantage of about ${Math.round(d.best*100)}% in this simple model carries dark moths from 1% to 98% in 47 years. Kettlewell’s 1950s release experiments blamed bird predation; his methods were criticised, but a large repeat by Majerus (Cook et al. 2012) confirmed it. The dark form came from a single mutation, a jumping gene inserted into the cortex gene around 1819 (van’t Hof et al. 2016).`:`After the Clean Air Act of 1956, pale bark returned and the dark form fell at about ${Math.round(d.best*100)}% a year in this model. The same fall happened in Michigan, in parallel (Grant et al. 1996).`};
 }});

/* ---------- Lesson: artificial-selection ---------- */
SCENE({id:'artificial-selection',name:'Artificial selection',tag:'Breeders choose the parents',
 definition:'In artificial selection people choose which individuals breed. Keeping only the most extreme individuals each generation (truncation selection) moves the average by the breeder’s equation, R = h²S: response equals heritability times the selection differential.',
 example:'Keep the top 20% of a flock for wool each year. The parents average 1.4 standard deviations above the flock. If heritability is 0.5, the next generation averages 0.7 standard deviations higher.',
 desc:'A bell curve of a trait with the kept parents shaded beyond a threshold, a faint outline of the starting generation, and a graph of the average trait climbing generation by generation. The 3D view stacks each generation’s distribution as a ridge that slides along the trait axis.',
 research:'Darwin, C. (1859). On the Origin of Species, chapter 1; Darwin, C. (1868). The Variation of Animals and Plants under Domestication; Lush, J. L. (1937). Animal Breeding Plans; Falconer, D. S. & Mackay, T. F. C. (1996). Introduction to Quantitative Genetics, 4th edn.',
 dur:12,hint:'Choose what share of each generation you keep and how heritable the trait is, then step through ten generations.',
 init:()=>({keep:20,h2:.5}),
 trace(s){const i=B2_intensity(s.keep/100),R1=s.h2*i;return range(11).map(g=>({g,mean:g*R1,R1,i}))},
 ui:[{range:'keep',label:'Keep top',min:10,max:80,step:5,get:s=>s.keep,act:'keep',show:v=>v+'%'},{range:'h2',label:'Heritability h²',min:0,max:.9,step:.1,get:s=>s.h2,act:'h2',show:v=>B2_m(v,1)}],
 on:{keep(s,v){s.keep=v},h2(s,v){s.h2=v}},
 draw(s,f){
  const fr=f||{g:0,mean:0,R1:0,i:B2_intensity(s.keep/100)},thr=fr.mean+B2_probit(1-s.keep/100);let out=heading('Keep the best, breed, repeat');
  const A=B2_axes(40,62,320,220,[-3.5,16],[0,1],{xt:[[0,'start'],[5,'+5'],[10,'+10'],[15,'+15']],xl:'trait, in standard deviations'});out+=A.svg;
  const curve=m=>range(391).map(k=>{const z=-3.5+k*.05;return [A.X(z),A.Y(Math.exp(-(z-m)*(z-m)/2)*.92)]});
  out+=P(B2_path(curve(0)),C.line,2,'none','stroke-dasharray="5 4"');
  const kept=range(391).map(k=>-3.5+k*.05).filter(z=>z>=thr).map(z=>[A.X(z),A.Y(Math.exp(-(z-fr.mean)*(z-fr.mean)/2)*.92)]);
  if(kept.length)out+=`<polygon points="${fmt(kept[0][0])},${fmt(A.Y(0))} ${kept.map(p=>fmt(p[0])+','+fmt(p[1])).join(' ')} ${fmt(kept[kept.length-1][0])},${fmt(A.Y(0))}" fill="${C.green}" opacity=".45"/>`;
  out+=P(B2_path(curve(fr.mean)),C.blue,3);if(thr<=15.5)out+=L(A.X(thr),A.Y(0),A.X(thr),A.Y(1),C.green,2,'stroke-dasharray="4 3"')+TF(Math.min(A.X(thr)+4,320),A.Y(.96),'cut-off',13,C.green,'start');
  const B=B2_axes(410,62,150,220,[0,10],[0,16],{xt:[0,5,10],yt:[0,5,10,15],xl:'generation',yl:'average'});out+=B.svg;
  const all=this.trace(s);out+=P(B2_path(all.map(q=>[B.X(q.g),B.Y(q.mean)])),C.line,2,'none','stroke-dasharray="4 3"')+P(B2_path(all.filter(q=>q.g<=fr.g).map(q=>[B.X(q.g),B.Y(q.mean)])),C.blue,3);
  out+=TF(300,336,`Keep the top ${s.keep}% → parents are S = ${B2_m(fr.i,2)} SD above average`,14,C.ink)+TF(300,358,`R = h²S = ${B2_m(s.h2,1)} × ${B2_m(fr.i,2)} = ${B2_m(s.h2*fr.i,2)} SD per generation`,14,C.blue);
  return {svg:out,phase:`Generation ${fr.g}: the average is ${B2_m(fr.mean,1)} standard deviations above where it began. Keeping fewer parents makes S larger; a less heritable trait passes on less of it. Simplified: spread and heritability are held constant, as they roughly are over the first few generations.`};
 },
 three(s,f,X,project){
  const fr=f||{g:0,mean:0},all=this.trace(s),gmax=fr.g;
  const P=project([[-3.5,0,0],[16,10,1]]);let o='';
  for(let g=0;g<=10;g+=1){const m=all[g].mean,seen=g<=gmax;
   const pts=range(79).map(k=>{const z=-3.5+k*.25;return P([z,g,seen?Math.exp(-(z-m)*(z-m)/2):0])});
   o+=`<polyline points="${pts.map(p=>fmt(p[0])+','+fmt(p[1])).join(' ')}" fill="none" stroke="${seen?(g===gmax?C.coral:C.blue):C.line}" stroke-width="${g===gmax?3:1.6}"/>`}
  o+=line3([-3.5,0,0],[16,0,0],P,C.muted,1.5)+line3([-3.5,0,0],[-3.5,10,0],P,C.muted,1.5);
  const a=P([16,0,0]),b=P([-3.5,10,0]);o+=label3(a[0],a[1]+18,'trait',14,C.muted)+label3(b[0]+40,b[1]+18,'generation',14,C.muted);
  return {svg:o,title:'Each generation’s distribution',caption:`Ridges for generations 0 to ${gmax}: the whole population slides along the trait axis, keeping its shape.`};
 }});

// Illinois long-term selection for oil in maize (endpoints approximate; intermediate curve illustrative).
SCENE({id:'artificial-selection-illinois',name:'A century of selection',tag:'The Illinois maize oil experiment',
 definition:'Since 1896, researchers in Illinois have selected one line of maize for high oil in the kernel and another for low oil, every year. The high line has kept responding for over a century.',
 example:'Oil started at about 4.7% of the kernel. After about 100 generations the high-oil line was near 20%, and the low-oil line under 1%: far outside anything in the starting population.',
 desc:'A graph of kernel oil against year from 1896 to 2000 for the high and low lines, from the starting value to approximate published endpoints, beside a toy comparison of a trait controlled by few genes, which stalls, and by many genes, which keeps going.',
 research:'Hopkins, C. G. (1899). Improvement in the chemical composition of the corn kernel. Illinois Agricultural Experiment Station Bulletin 55; Dudley, J. W. & Lambert, R. J. (2004). Plant Breeding Reviews 24(1), 79–110; Laurie, C. C. et al. (2004). Genetics 168, 2141–2155.',
 dur:10,hint:'Slide through the years. Then switch the toy model between few genes and many genes to see why the response did not stop.',
 init:()=>({yr:1996,model:'many'}),
 watch(p){return {yr:Math.round(1896+p*100),model:p<.6?'many':'few'}},
 ui:[{range:'yr',label:'Year',min:1896,max:1996,step:1,get:s=>s.yr,act:'yr',show:v=>String(v)},{choose:[['many','Many genes'],['few','Few genes']],label:'Toy model',get:s=>s.model,act:'model'}],
 on:{yr(s,v){s.yr=v},model(s,v){s.model=v}},
 draw(s){
  let out=heading('Selecting maize for oil since 1896');
  const hi=y=>4.7+(20-4.7)*Math.pow((y-1896)/100,.95),lo=y=>.8+3.9*Math.exp(-(y-1896)/22);
  const toy=y=>s.model==='many'?hi(y):4.7+5.3*(1-Math.exp(-(y-1896)/12));
  const A=B2_axes(70,58,300,230,[1896,1996],[0,22],{xt:[1900,1925,1950,1975,1996],yt:[0,5,10,15,20],xl:'year',yl:'oil in the kernel (%)'});out+=A.svg;
  const ys=range(101).map(i=>1896+i),seen=ys.filter(y=>y<=s.yr);
  out+=P(B2_path(seen.map(y=>[A.X(y),A.Y(hi(y))])),C.coral,3)+P(B2_path(seen.map(y=>[A.X(y),A.Y(lo(y))])),C.blue,3);
  out+=P(B2_path(ys.map(y=>[A.X(y),A.Y(toy(y))])),C.purple,2,'none','stroke-dasharray="6 4"');
  out+=Ci(A.X(1896),A.Y(4.7),6,C.ink)+TF(A.X(1896)+10,A.Y(4.7)+20,'4.7% in 1896',13,C.ink,'start');
  if(s.yr>=1990)out+=Ci(A.X(1996),A.Y(20),6,C.coral)+TF(A.X(1996)-8,A.Y(20)-10,'≈ 20%',13,C.coral,'end')+Ci(A.X(1996),A.Y(lo(1996)),6,C.blue)+TF(A.X(1996)-8,A.Y(lo(1996))-10,'< 1%',13,C.blue,'end');
  out+=TBF(390,80,'high-oil line',14,C.coral,'start')+TBF(390,104,'low-oil line',14,C.blue,'start')+TF(390,128,`toy: ${s.model==='many'?'many genes':'few genes'}`,14,C.purple,'start');
  out+=counter(388,150,`high, ${s.yr}`,`${B2_m(hi(s.yr),1)}% oil`,C.coral,90)+counter(482,150,`low, ${s.yr}`,`${B2_m(lo(s.yr),1)}% oil`,C.blue,90);
  const lines=s.model==='many'?['Each of many genes adds a little.','New combinations, and new','mutations, keep supplying','variation for a century.']:['With only a few genes, the','best alleles are soon fixed','and the response stalls:','there is nothing left to choose.'];
  lines.forEach((l,i)=>{out+=TF(390,230+i*18,l,13,C.muted,'start')});
  out+=TF(300,350,'Endpoints approximate from the published reports; the curves between them are illustrative.',13,C.muted);
  return {svg:out,phase:s.model==='many'?`In ${s.yr} the high line is near ${B2_m(hi(s.yr),1)}% oil. Laurie et al. (2004) mapped about 50 regions of the genome that each contributed a small effect: the long response suits many genes of small effect.`:'A trait controlled by a handful of genes would run out of variation within a few decades. The real experiment did not, which is evidence for many genes and continuing mutation.'};
 }});

const B2_FOX=[[0,0],[10,18],[20,35],[33,75]];
SCENE({id:'artificial-selection-foxes',name:'Tame foxes',tag:'Belyaev’s experiment, from 1959',
 definition:'In Novosibirsk, Dmitry Belyaev and Lyudmila Trut bred silver foxes for one thing only: how calmly they approached people. Within a few dozen generations most foxes were eager for human contact.',
 example:'Trut reported that 18% of pups were in the tamest (“elite”) class by the 10th generation, 35% by the 20th, and 70–80% after 40 years, about 30–35 generations.',
 desc:'A graph of the share of elite tame foxes against generation, with the reported points, beside two panels: traits said to have changed along with tameness, and later caveats about the experiment.',
 research:'Belyaev, D. K. (1979). Destabilizing selection as a factor in domestication. Journal of Heredity 70, 301–308; Trut, L. N. (1999). Early canid domestication: the farm-fox experiment. American Scientist 87, 160–169; Lord, K. A. et al. (2020). The history of farm foxes undermines the animal domestication syndrome. Trends in Ecology & Evolution 35, 125–136.',
 dur:10,hint:'Slide through the generations, then switch between what was reported and what later work questioned.',
 init:()=>({g:20,v:'report'}),
 watch(p){return {g:Math.round(p*45),v:p<.6?'report':'caveat'}},
 ui:[{range:'g',label:'Generation',min:0,max:45,step:1,get:s=>s.g,act:'g',show:v=>String(v)},{choose:[['report','What changed'],['caveat','Caveats']],label:'View',get:s=>s.v,act:'v'}],
 on:{g(s,v){s.g=v},v(s,v){s.v=v}},
 draw(s){
  let out=heading('Selecting foxes only for tameness');
  const fit=g=>{const pts=B2_FOX.concat([[45,80]]);for(let i=1;i<pts.length;i++)if(g<=pts[i][0]){const [a,va]=pts[i-1],[b,vb]=pts[i];return va+(vb-va)*(g-a)/(b-a)}return 80};
  const A=B2_axes(70,58,270,230,[0,45],[0,100],{xt:[0,10,20,30,40],yt:[[0,'0'],[50,'50%'],[100,'100%']],xl:'generation',yl:'pups in the tamest class'});out+=A.svg;
  out+=P(B2_path(range(46).filter(g=>g<=s.g).map(g=>[A.X(g),A.Y(Math.max(0,fit(g)))])),C.blue,3);
  B2_FOX.forEach(([g,v])=>{const on=g<=s.g;out+=Ci(A.X(g),A.Y(v),7,on?C.coral:'#fff',C.coral);if(on&&g)out+=TF(A.X(g)-9,A.Y(v)-8,v+'%',13,C.coral,'end')});
  out+=R(370,58,200,230,'#fff',C.grid,8);
  if(s.v==='report'){out+=B2_title(384,82,'Reported alongside tameness',C.ink);['floppy ears','piebald (patchy) coats','curly tails','tail wagging, whining','lower stress hormones'].forEach((t,i)=>{out+=Ci(392,108+i*30,4,C.green)+TF(404,113+i*30,t,13,C.ink,'start')});out+=TF(384,268,'Trut 1999',13,C.muted,'start')}
  else{out+=B2_title(384,82,'Later questions',C.ink);['Founders came from fur farms,','already partly used to people.','Some coat and ear traits were','seen in farm foxes before 1959.','A single “domestication','syndrome” is disputed.'].forEach((t,i)=>{out+=TF(384,110+i*22,t,13,C.ink,'start')});out+=TF(384,268,'Lord et al. 2020',13,C.muted,'start')}
  out+=TF(300,352,'Points as reported by Trut (1999); the lines joining them are illustrative.',13,C.muted);
  return {svg:out,phase:s.v==='report'?`By generation ${s.g}, about ${Math.max(0,Math.round(fit(s.g)))}% of pups are in the tamest class on this curve. Selection on behaviour alone changed behaviour fast, because tameness had heritable variation.`:'The fast response to selection on tameness is not in doubt. Whether the other changes came from that selection, or were already present in farm foxes, is debated (Lord et al. 2020).'};
 }});

/* ---------- Lesson: sexual-selection ---------- */
const B2_WIDOW=[{k:'short',n:'Tail shortened',len:14,nests:.5},{k:'ctrl1',n:'Cut and glued back',len:50,nests:1.1},{k:'ctrl2',n:'Untouched',len:50,nests:1.2},{k:'long',n:'Tail lengthened',len:75,nests:1.9}];
SCENE({id:'sexual-selection',name:'Sexual selection',tag:'Andersson’s widowbirds',
 definition:'Sexual selection is selection through mating success: traits that win mates or rivals spread even if they make survival harder. Darwin proposed it to explain peacocks’ tails and stags’ antlers.',
 example:'In Kenya, Malte Andersson cut the half-metre tails of male long-tailed widowbirds and glued the pieces onto other males. Males with lengthened tails attracted the most new nests from females; males with shortened tails the fewest.',
 desc:'Four groups of male widowbirds drawn with different tail lengths, each with a bar for the average number of new nests in its territory after the treatment. The groups with natural tails sit between shortened and lengthened.',
 research:'Darwin, C. (1871). The Descent of Man, and Selection in Relation to Sex; Andersson, M. (1982). Female choice selects for extreme tail length in a widowbird. Nature 299, 818–820. Bar heights are approximate, read from the published figure.',
 dur:10,hint:'Press a group to see its result. Compare the two controls with each other first: cutting and regluing did no harm.',
 init:()=>({g:3}),
 watch(p){return {g:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:[[0,'Shortened'],[1,'Cut and reglued'],[2,'Untouched'],[3,'Lengthened']],label:'Group',get:s=>s.g,act:'g'}],
 on:{g(s,v){s.g=Number(v)},pick(s,v){s.g=Number(v)}},
 draw(s,f,X){
  let out=heading('New nests per male after the treatment');
  B2_WIDOW.forEach((w,i)=>{const x=60+i*132,sel=i===s.g,base=290;
   let bird=Ci(x+30,120,13,'#1b1f22')+Ci(x+40,114,6,'#1b1f22')+`<path d="M${x+44} 114L${x+52} 116L${x+44} 118Z" fill="#c9a227"/>`+R(x+16,110,10,6,'#d65a2b','none',2);
   bird+=P(`M${x+18} 126Q${x-4} ${150+w.len*.4} ${x+8} ${150+w.len*1.3}`,'#1b1f22',5);
   const bar=R(x+60,base-w.nests*70,28,w.nests*70,sel?C.coral:C.pale,sel?'none':C.line,4)+TF(x+74,base-w.nests*70-8,B2_m(w.nests,1),13,sel?C.coral:C.muted);
   out+=hit(X,'pick',i,`${w.n}: about ${B2_m(w.nests,1)} new nests`,R(x-8,56,126,262,sel?'#fff4ee':'#fff',sel?C.coral:C.grid,8)+bird+bar);
   out+=TF(x+55,base+20,w.n.split(' ')[0]+' '+(w.n.split(' ')[1]||''),13,sel?C.coral:C.ink)+TF(x+55,base+38,w.n.split(' ').slice(2).join(' '),13,sel?C.coral:C.ink)});
  out+=L(40,290,570,290,C.line,1.5);
  const w=B2_WIDOW[s.g];
  return {svg:out,phase:`${w.n}: about ${B2_m(w.nests,1)} new nests. ${s.g===3?'Females preferred tails even longer than any natural tail, so female choice pushes tails beyond what survival alone would favour.':s.g===0?'Short-tailed males lost out, though they defended their territories just as well: the difference was female choice, not fighting.':'The two control groups did about equally well, showing the handling itself made no difference.'}`};
 }});

SCENE({id:'sexual-selection-runaway',name:'Runaway selection',tag:'Fisher’s feedback loop',
 definition:'Fisher’s runaway process: if females prefer a trait, and the genes for the preference and for the trait end up together in the same offspring, then the trait and the preference can amplify each other until the cost to survival stops them.',
 example:'Daughters of choosy mothers inherit the preference; sons inherit their father’s long tail. Because they travel together, every generation that favours long tails also increases the preference for them.',
 desc:'A toy model of a male trait and a female preference over 40 generations. Two sliders set how strongly the two are linked in offspring and how costly the trait is. A time graph shows both values, and a second graph plots preference against trait: the point moves along a straight line, climbing off the scale when the loop runs away and stopping when the cost wins.',
 research:'Fisher, R. A. (1930). The Genetical Theory of Natural Selection; Lande, R. (1981). Models of speciation by sexual selection on polygenic traits. PNAS 78, 3721–3725; Zahavi, A. (1975). Mate selection: a selection for a handicap. Journal of Theoretical Biology 53, 205–214. This is a toy model, not a fitted one.',
 dur:10,hint:'Raise the link between trait and preference above the cost and the loop runs away. Clear runaway is hard to demonstrate in the wild; costly signals of good genes (Zahavi’s handicap) are a rival explanation.',
 init:()=>({c:.8,cost:.16}),
 trace(s){let t=.1,p=.2;const fr=[];for(let g=0;g<=40;g++){fr.push({g,t,p});const dt=.3*p-s.cost*t;t=Math.max(0,t+dt);p=Math.max(0,p+s.c*dt)}return fr},
 ui:[{range:'c',label:'Link (genetic correlation)',min:0,max:1,step:.05,get:s=>s.c,act:'c',show:v=>B2_m(v,2)},{range:'cost',label:'Survival cost',min:0,max:.4,step:.02,get:s=>s.cost,act:'cost',show:v=>B2_m(v,2)}],
 on:{c(s,v){s.c=v;return 'run'},cost(s,v){s.cost=v;return 'run'}},
 draw(s,f){
  const all=this.trace(s),fr=f||all[0],seen=all.filter(q=>q.g<=fr.g),cap=v=>Math.min(3,v);let out=heading('Trait and preference feeding each other');
  const A=B2_axes(50,62,250,210,[0,40],[0,3],{xt:[0,20,40],yt:[0,1,2,3],xl:'generation',yl:'size (arbitrary units)'});out+=A.svg;
  out+=P(B2_path(seen.map(q=>[A.X(q.g),A.Y(cap(q.t))])),C.coral,3)+P(B2_path(seen.map(q=>[A.X(q.g),A.Y(cap(q.p))])),C.purple,3,'none','stroke-dasharray="7 4"');
  out+=TBF(50,328,'— male tail',13,C.coral,'start')+TBF(150,328,'- - female preference',13,C.purple,'start');
  const B=B2_axes(350,62,210,210,[0,3],[0,3],{xt:[0,1,2,3],yt:[0,1,2,3],xl:'tail',yl:'preference'});out+=B.svg;
  out+=P(B2_path(seen.map(q=>[B.X(cap(q.t)),B.Y(cap(q.p))])),C.blue,2.5)+Ci(B.X(cap(fr.t)),B.Y(cap(fr.p)),6,C.blue);
  const gap=s.c*.3-s.cost,run=gap>.005,flat=Math.abs(gap)<=.005;
  out+=TBF(300,356,run?'link × 0.3 > cost: runaway':flat?'link × 0.3 = cost: steady drift':'cost > link × 0.3: the trait settles',15,run?C.coral:flat?C.ink:C.green);
  return {svg:out,phase:flat?`Generation ${fr.g}: the boost and the cost exactly balance, so tail and preference keep changing at a steady rate, neither running away nor settling.`:run?`Generation ${fr.g}: every gain in tail length drags the preference up too, which favours even longer tails. In this toy model the loop runs away while 0.3 × link (${B2_m(.3*s.c,2)}) exceeds the cost (${B2_m(s.cost,2)}).`:`Generation ${fr.g}: the survival cost outweighs the boost from preference, so tail and preference settle at a balance.`};
 }});

SCENE({id:'sexual-selection-bateman',name:'Who competes, who chooses',tag:'Bateman gradients',
 definition:'A Bateman gradient is the slope of offspring number against number of mates. The sex with the steeper slope gains more from extra mates and usually competes harder; the other sex is usually choosier.',
 example:'In many animals males gain far more offspring from each extra mate than females. In the pipefish Syngnathus typhle males carry the eggs in a brood pouch, and it is females whose success climbs with each extra mate.',
 desc:'A graph of offspring against number of mates for a focal sex, with simulated individuals as dots and a fitted line for each sex. A switch changes from a typical species to a sex-role-reversed pipefish, where the steep slope belongs to females.',
 research:'Bateman, A. J. (1948). Intra-sexual selection in Drosophila. Heredity 2, 349–368; Jones, A. G. et al. (2000). Proceedings of the Royal Society B 267, 677–680; Gowaty, P. A., Kim, Y.-K. & Anderson, W. W. (2012). PNAS 109, 11740–11745; Janicke, T. et al. (2016). Science Advances 2, e1500983. Points are simulated.',
 dur:10,hint:'Switch species, then move the focal number of mates to read off expected offspring for each sex.',
 init:()=>({sp:'typical',m:3}),
 watch(p){return {sp:p<.5?'typical':'pipefish',m:1+Math.floor((p*2%1)*5)}},
 ui:[{choose:[['typical','Typical species'],['pipefish','Pipefish']],label:'Species',get:s=>s.sp,act:'sp'},{range:'m',label:'Mates',min:0,max:5,step:1,get:s=>s.m,act:'m',show:v=>String(v)}],
 on:{sp(s,v){s.sp=v},m(s,v){s.m=v}},
 draw(s){
  const steep=8,shallow=1.5,mS=s.sp==='typical'?steep:shallow,fS=s.sp==='typical'?shallow:steep;let out=heading(s.sp==='typical'?'A typical animal: males gain more from extra mates':'Pipefish: females gain more from extra mates');
  const A=B2_axes(70,62,330,220,[0,5],[0,45],{xt:[0,1,2,3,4,5],yt:[0,10,20,30,40],xl:'number of mates',yl:'offspring'});out+=A.svg;
  const r=rng(s.sp==='typical'?5:9);
  for(const [sl,col,base] of [[mS,C.blue,4],[fS,C.coral,8]])for(let i=0;i<22;i++){const m=Math.floor(r()*6),y=clamp((m?base:0)+sl*m+B2_gauss(r)*3,0,44);out+=Ci(A.X(m)+(r()-.5)*14,A.Y(y),4,col,'none','opacity=".55"')}
  out+=L(A.X(1),A.Y(4+mS),A.X(5),A.Y(4+mS*5),C.blue,3)+L(A.X(1),A.Y(8+fS),A.X(5),A.Y(8+fS*5),C.coral,3);
  out+=L(A.X(s.m),A.Y(0),A.X(s.m),A.Y(45),C.ink,1.5,'stroke-dasharray="4 3"');
  const mo=s.m?4+mS*s.m:0,fo=s.m?8+fS*s.m:0;
  out+=counter(430,70,'males, expected',B2_m(mo,0)+' offspring',C.blue,140)+counter(430,130,'females, expected',B2_m(fo,0)+' offspring',C.coral,140);
  out+=TF(430,206,'Offspring per mate',13,C.muted,'start')+TBF(430,228,`males ${mS} · females ${fS}`,14,C.ink,'start');
  out+=TF(300,336,'Bateman’s 1948 fly data were biased (Gowaty et al. 2012), but across animals',13,C.muted)+TF(300,354,'males still have steeper gradients on average (Janicke et al. 2016).',13,C.muted);
  return {svg:out,phase:s.sp==='typical'?'Eggs are costly and sperm is cheap, so in most animals a male’s success depends more on how many mates he gets. That predicts stronger competition among males and choosier females.':'When males invest more, as pipefish fathers do by brooding eggs, the gradient flips: females compete and males choose. The steepness of the gradient, not the sex as such, predicts who competes.'};
 }});

/* ---------- Lesson: speciation ---------- */
SCENE({id:'speciation',name:'How new species form',tag:'Split, diverge, stay apart',
 definition:'In the biological species concept, a species is a group of populations that can interbreed and are reproductively isolated from others. A common route to a new species is allopatric speciation: a barrier splits a population, the halves change independently, and they can no longer interbreed if they meet again.',
 example:'As the Isthmus of Panama rose, finally closing about 3 million years ago, it split the sea. Pairs of snapping shrimp on the two sides, once one population, diverged at different times as the seaway narrowed, and now mostly refuse to mate with each other in the laboratory.',
 desc:'A landscape with two groups of animals, coloured by the value of a trait, on either side of an optional barrier. A graph shows the average trait of each group over 80 generations; with the barrier and little migration the lines drift apart until their difference passes a threshold; without it they stay together.',
 research:'Dobzhansky, T. (1937). Genetics and the Origin of Species; Mayr, E. (1942). Systematics and the Origin of Species; Knowlton, N. et al. (1993). Science 260, 1629–1632; Coyne, J. A. & Orr, H. A. (2004). Speciation. The model and its isolation threshold are illustrative.',
 dur:12,hint:'Remove the barrier, or let migrants cross, and watch the two halves stay alike. Different environments speed the split.',
 init:()=>({bar:true,mig:0,env:'diff',seed:3}),
 trace(s){const r=rng(s.seed*97+11);let a=0,b=0;const m=s.bar?s.mig/100:.5,oa=s.env==='diff'?1.4:0,ob=s.env==='diff'?-1.4:0,fr=[];
  for(let g=0;g<=80;g++){if(g%2===0)fr.push({g,a,b});const na=a+.04*(oa-a)+B2_gauss(r)*.07,nb=b+.04*(ob-b)+B2_gauss(r)*.07;a=na+m*(nb-na);b=nb+m*(na-nb)}return fr},
 ui:[{choose:[['on','Barrier'],['off','No barrier']],label:'Barrier',get:s=>s.bar?'on':'off',act:'bar'},{range:'mig',label:'Migrants',min:0,max:20,step:1,get:s=>s.mig,act:'mig',show:v=>v+'% a generation'},{choose:[['diff','Different habitats'],['same','Same habitat']],label:'Environment',get:s=>s.env,act:'env'},{b:'New run',act:'seed'}],
 on:{bar(s,v){s.bar=v==='on';return 'run'},mig(s,v){s.mig=v},env(s,v){s.env=v;return 'run'},seed(s){s.seed=s.seed%9+1;return 'run'}},
 draw(s,f){
  const all=this.trace(s),fr=f||all[0],gap=Math.abs(fr.a-fr.b);let out=heading('One population, split in two');
  out+=R(30,58,270,232,'#e7f1df','none',8);
  if(s.bar)out+=P('M160 58Q150 120 170 170T158 290','#7fb2d8',18)+TF(165,306,'river',13,C.blue);
  const col=v=>{const u=clamp((v+2)/4,0,1);return `rgb(${Math.round(lerp(60,230,u))},${Math.round(lerp(120,120,u))},${Math.round(lerp(210,70,u))})`};
  const r=rng(77);for(let i=0;i<26;i++){out+=Ci(48+r()*92,78+r()*196,6,col(fr.a+(r()-.5)*.5));out+=Ci(182+r()*100,78+r()*196,6,col(fr.b+(r()-.5)*.5))}
  out+=TF(95,74,'west',13,C.ink)+TF(232,74,'east',13,C.ink);
  const A=B2_axes(340,58,220,232,[0,80],[-2.5,2.5],{xt:[0,40,80],yt:[-2,0,2],xl:'generation',yl:'average trait'});out+=A.svg;
  const seen=all.filter(q=>q.g<=fr.g);out+=P(B2_path(seen.map(q=>[A.X(q.g),A.Y(q.a)])),C.blue,3)+P(B2_path(seen.map(q=>[A.X(q.g),A.Y(q.b)])),C.coral,3);
  const iso=gap>1.5;
  out+=TBF(300,340,`difference ${B2_m(gap,2)} · ${iso?'past the threshold: they would no longer interbreed':'still able to interbreed'}`,15,iso?C.coral:C.green);
  out+=TF(300,362,'Illustrative: the isolation threshold (a difference of 1.5) is a stand-in for real reproductive barriers.',13,C.muted);
  return {svg:out,phase:!s.bar?'With no barrier, animals mix every generation, so any difference between east and west is erased as fast as it appears.':s.mig>5?`With ${s.mig}% migrants each generation, gene flow keeps pulling the two halves back together.`:`Generation ${fr.g}: the separated halves change independently, by chance and by adapting to their own side. ${iso?'They have diverged enough that, if the river vanished, they would no longer form one population.':'Give them time.'}`};
 }});

const B2_RING=[{n:'West Siberia',p:[180,96],l:[168,101,'end']},{n:'Central Asia',p:[92,185],l:[92,212,'middle']},{n:'West Himalaya',p:[130,290],l:[130,317,'middle']},{n:'East Himalaya',p:[270,300],l:[270,327,'middle']},{n:'Central China',p:[335,205],l:[335,232,'middle']},{n:'East Siberia',p:[250,96],l:[262,101,'start']}];
SCENE({id:'speciation-ring',name:'A ring species',tag:'Greenish warblers around Tibet',
 definition:'A ring species is a chain of populations around a barrier in which each neighbour can interbreed, but the two ends, where they meet, behave as separate species. It shows in space the gradual change that speciation produces over time.',
 example:'Greenish warblers live in a ring around the Tibetan Plateau. Neighbouring populations recognise each other’s song. Where the two ends overlap in central Siberia, their songs differ so much that they rarely if ever interbreed. Genetic studies show gene flow round the ring was broken in the past, so it is an approximate ring.',
 desc:'A ring of six warbler populations around the plateau. The learner presses two populations; a line joins them, coloured green if they interbreed and coral if not, with a bar showing how similar their songs are.',
 research:'Irwin, D. E., Bensch, S. & Price, T. D. (2001). Speciation in a ring. Nature 409, 333–337; Irwin, D. E. et al. (2005). Science 307, 414–416; Alcaide, M. et al. (2014). Nature 511, 83–85, which found that gene flow around the ring was interrupted in the past, so it is not a perfect ring.',
 dur:10,hint:'Press one population, then another. Neighbours interbreed; the two Siberian ends rarely if ever do, even though they live side by side.',
 init:()=>({a:0,b:5,sel:null}),
 watch(p){const pairs=[[0,1],[1,2],[2,3],[3,4],[4,5],[0,5]];const k=Math.min(5,Math.floor(p*6));return {a:pairs[k][0],b:pairs[k][1],sel:null}},
 on:{pick(s,v){v=Number(v);if(s.sel===null){s.sel=v;s.a=v}else{s.b=v;s.sel=null}},pair(s,v){const [a,b]=String(v).split('-').map(Number);s.a=a;s.b=b;s.sel=null}},
 ui:[{choose:[['0-1','Neighbours'],['1-4','Far apart'],['0-5','The two ends']],label:'Example',get:s=>`${s.a}-${s.b}`,act:'pair'}],
 draw(s,f,X){
  let out=heading('Greenish warblers around the Tibetan Plateau');
  const cx=215,cy=205;out+=`<ellipse cx="${cx}" cy="${cy}" rx="78" ry="52" fill="#efe6d5" stroke="${C.line}"/>`+TF(cx,cy+5,'Tibetan Plateau',13,C.muted)+TF(215,70,'the ends meet in Siberia',13,C.purple);
  const pos=B2_RING.map(r=>r.p);
  for(let i=0;i<5;i++)out+=L(...pos[i],...pos[i+1],C.line,3,'stroke-dasharray="2 5"');
  const d=Math.abs(s.a-s.b),ok=d<=2,sim=1-d/5;
  if(s.a!==s.b)out+=L(...pos[s.a],...pos[s.b],ok?C.green:C.coral,4);
  pos.forEach(([x,y],i)=>{const on=i===s.a||i===s.b||i===s.sel;const [tx,ty,anc]=B2_RING[i].l;
   out+=hit(X,'pick',i,`${B2_RING[i].n}${on?', chosen':''}`,Ci(x,y,on?13:10,on?C.blue:'#fff',C.blue));
   out+=TF(tx,ty,B2_RING[i].n,13,on?C.blue:C.ink,anc)});
  out+=R(400,70,170,200,'#fff',C.grid,8);
  out+=B2_title(414,94,'Song similarity',C.ink)+R(414,104,140,16,'#eef3f6','none',4)+R(414,104,140*sim,16,ok?C.green:C.coral,'none',4)+TF(414,138,`${Math.round(sim*100)}% (illustrative)`,13,C.muted,'start');
  out+=TBF(414,172,s.a===s.b?'Pick two':ok?'Interbreed':'Barely interbreed',15,s.a===s.b?C.muted:ok?C.green:C.coral,'start');
  out+=TF(414,196,`${d} step${d===1?'':'s'} round the ring`,13,C.ink,'start');
  if(d===5)out+=TF(414,220,'yet they live side',13,C.ink,'start')+TF(414,238,'by side in Siberia',13,C.ink,'start');
  return {svg:out,phase:s.a===s.b?'Choose two different populations.':d===5?'The two ends overlap in central Siberia but rarely if ever interbreed: their songs and genes have diverged along the two routes around the plateau.':ok?`${B2_RING[s.a].n} and ${B2_RING[s.b].n} are close enough along the ring to recognise each other’s song.`:'Far apart around the ring, the differences have built up step by step. Speciation by distance, not by a single event.'};
 }});

const B2_BARRIERS=['Same place','Same time','Courtship accepted','Mating works','Eggs fertilised','Hybrid survives','Hybrid fertile'];
const B2_CASES=[{k:'mule',n:'Horse × donkey',stop:6,why:'Mules are healthy but almost always sterile: a horse has 64 chromosomes and a donkey 62, so a mule has 63, which cannot pair up properly to make eggs or sperm.',kind:'postzygotic'},
 {k:'liger',n:'Lion × tiger',stop:0,why:'In the wild, lions live in open grassland in Africa and India and tigers in Asian forests, so they almost never meet. In zoos they can produce ligers.',kind:'prezygotic'},
 {k:'fly',n:'Apple × hawthorn flies',stop:1,why:'Apple maggot flies that switched from hawthorn to apples in the 1800s now mate on their own fruit, and apples ripen weeks earlier, so the two races mostly breed at different times.',kind:'prezygotic'}];
SCENE({id:'speciation-barriers',name:'Barriers between species',tag:'Before and after fertilisation',
 definition:'Reproductive isolation is whatever stops two populations from exchanging genes. Prezygotic barriers act before an egg is fertilised: place, timing, courtship, mechanics. Postzygotic barriers act after: hybrids that die or cannot breed.',
 example:'Horses and donkeys mate readily and produce mules, but mules are almost always sterile, so the two species stay separate. Lions and tigers rarely meet at all.',
 desc:'A chain of seven checkpoints from meeting to fertile hybrids. For the chosen pair of species the chain is green up to the checkpoint where gene flow stops, which is marked in coral, with an explanation.',
 research:'Dobzhansky (1937); Mayr (1942); Bush, G. L. (1969). Evolution 23, 237–251; Feder, J. L. et al. (1988). Nature 336, 61–64; Coyne & Orr (2004).',
 dur:9,hint:'Choose a pair and find the first checkpoint that fails.',
 init:()=>({c:0}),
 watch(p){return {c:Math.min(2,Math.floor(p*3))}},
 ui:[{choose:B2_CASES.map((c,i)=>[i,c.n]),label:'Pair',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=Number(v)}},
 draw(s){
  const c=B2_CASES[s.c];let out=heading(c.n);
  B2_BARRIERS.forEach((b,i)=>{const x=34+i*78,y=90,pass=i<c.stop,stop=i===c.stop;
   out+=R(x,y,70,70,pass?C.greenp:stop?C.coralp:'#f4f4f4',pass?C.green:stop?C.coral:C.line,8);
   const words=b.split(' ');words.forEach((w,j)=>{out+=TF(x+35,y+32+j*17-(words.length-1)*8,w,13,pass?C.green:stop?C.coral:C.muted)});
   out+=TBF(x+35,y+92,pass?'✓':stop?'✗':'–',18,pass?C.green:stop?C.coral:C.muted);
   if(i<6)out+=arrow(x+70,y+35,x+78,y+35,C.line,1.5,5)});
  out+=L(34+4*78+74,74,34+4*78+74,190,C.purple,2,'stroke-dasharray="5 4"');
  out+=TF(34+2*78+35,70,'prezygotic',13,C.purple,'middle')+TF(34+5*78+74,70,'postzygotic',13,C.purple,'middle');
  const lines=[];let cur='';for(const w of c.why.split(' ')){if((cur+' '+w).length>62){lines.push(cur);cur=w}else cur=cur?cur+' '+w:w}lines.push(cur);
  out+=R(40,214,520,58+lines.length*20,'#fff',C.grid,8);lines.forEach((l,i)=>{out+=TF(56,240+i*20,l,14,C.ink,'start')});
  out+=TBF(56,248+lines.length*20,`A ${c.kind} barrier`,15,C.coral,'start');
  return {svg:out,phase:`${c.n}: gene flow stops at “${B2_BARRIERS[c.stop].toLowerCase()}”. ${c.kind==='prezygotic'?'Prezygotic barriers waste nothing: no hybrid is ever made.':'Postzygotic barriers let mating happen but block the hybrids’ genes from going further.'}`};
 }});

/* ---------- Lesson: finches-beaks ---------- */
// Medium ground finch beak depth: illustrative population close to published values (mean ≈ 9.4 mm).
const B2_BIN=range(51).map(i=>7+i*.1);
function B2_drought(sev){const mu=9.4,sd=.7,b=.918*sev,ms=lerp(.85,.15,sev);
 const n=B2_BIN.map(d=>1200*.1*Math.exp(-(d-mu)*(d-mu)/(2*sd*sd))/(sd*Math.sqrt(2*Math.PI)));
 const raw=B2_BIN.map(d=>Math.exp(b*(d-mu)));const tot=sum(n),m0=sum(n.map((k,i)=>k*raw[i]))/tot;let c=ms/m0;
 for(let it=0;it<20;it++){const surv=sum(n.map((k,i)=>k*Math.min(1,c*raw[i])))/tot;c*=ms/surv}
 const sv=n.map((k,i)=>k*Math.min(1,c*raw[i]));const before=sum(n.map((k,i)=>k*B2_BIN[i]))/sum(n),after=sum(sv.map((k,i)=>k*B2_BIN[i]))/sum(sv);
 return {n,sv,before,after,alive:sum(sv),tot}}
SCENE({id:'finches-beaks',name:'Darwin’s finches',tag:'The 1977 drought on Daphne Major',
 definition:'On the small Galápagos island of Daphne Major, Peter and Rosemary Grant have measured almost every medium ground finch since 1973. In the 1977 drought the small soft seeds ran out; birds with deeper beaks could crack the large, hard seeds that remained, and survived better.',
 example:'Roughly 1,200 medium ground finches lived on the island before the drought and under 200 after it. The survivors’ beaks were on average about 4–5% deeper, around half a millimetre.',
 desc:'Two overlaid histograms of beak depth: the outline of the population before the drought and the filled survivors after it, with each group’s average marked. A slider sets how severe the drought is.',
 research:'Boag, P. T. & Grant, P. R. (1981). Intense natural selection in a population of Darwin’s finches (Geospizinae) in the Galápagos. Science 214, 82–85; Grant, P. R. & Grant, B. R. (2002). Science 296, 707–711; Sulloway, F. J. (1982). Darwin and his finches: the evolution of a legend. Journal of the History of Biology 15, 1–53.',
 dur:10,hint:'Raise the drought’s severity. Fewer birds survive, and the survivors are a biased sample: deeper beaks.',
 init:()=>({sev:1}),
 watch(p){return {sev:+Math.min(1,p*1.25).toFixed(2)}},
 ui:[{range:'sev',label:'Drought',min:0,max:1,step:.05,get:s=>s.sev,act:'sev',show:v=>v<.15?'wet year':v>.9?'like 1977':Math.round(v*100)+'%'}],
 on:{sev(s,v){s.sev=v}},
 draw(s){
  const d=B2_drought(s.sev);let out=heading('Beak depth of medium ground finches');
  const mx=Math.max(...d.n),A=B2_axes(60,60,340,215,[7,12],[0,mx*1.1],{xt:[7,8,9,10,11,12],xl:'beak depth (mm)'});out+=A.svg;
  d.n.forEach((k,i)=>{out+=R(A.X(B2_BIN[i]),A.Y(k),A.X(7.1)-A.X(7)-.5,A.Y(0)-A.Y(k),'none',C.line,0)});
  d.sv.forEach((k,i)=>{out+=R(A.X(B2_BIN[i]),A.Y(k),A.X(7.1)-A.X(7)-.5,A.Y(0)-A.Y(k),C.coral,'none',0)});
  out+=L(A.X(d.before),60,A.X(d.before),275,C.ink,2,'stroke-dasharray="5 4"')+L(A.X(d.after),60,A.X(d.after),275,C.coral,2.5);
  out+=counter(420,62,'birds before',Math.round(d.tot).toLocaleString('en-GB'),C.ink,155)+counter(420,118,'survivors',Math.round(d.alive).toLocaleString('en-GB'),C.coral,155);
  out+=counter(420,174,'average depth',`${B2_m(d.before,2)} → ${B2_m(d.after,2)} mm`,C.ink,155);
  out+=counter(420,230,'shift',`+${B2_m(d.after-d.before,2)} mm (${B2_m((d.after/d.before-1)*100,1)}%)`,C.coral,155);
  out+=TF(300,342,'Outline: before. Coral: survivors. Values illustrative, near the published ones.',13,C.muted);
  out+=TF(300,362,'Darwin did not build his theory on the finches; that story grew later (Sulloway 1982).',13,C.muted);
  return {svg:out,phase:s.sev<.15?'In a wet year small seeds are plentiful; most birds survive whatever their beak.':`About ${Math.round(d.alive)} of ${Math.round(d.tot)} birds survive. Survival favoured deeper beaks, so the survivors average ${B2_m(d.after-d.before,2)} mm deeper. Selection acted within a single season.`};
 }});

SCENE({id:'finches-beaks-response',name:'Did the next generation change?',tag:'Predicting evolution',
 definition:'Selection changes the next generation only as far as the trait is heritable. The breeder’s equation predicts the response R = h²S, where S is how far the parents differ from the average and h² is the heritability, measured as the slope of offspring against their parents.',
 example:'Beak depth in medium ground finches is highly heritable, with h² around 0.8 (Boag 1983). Survivors of the drought differed from the average by about half a millimetre, so their offspring were predicted to have beaks about 0.4 mm deeper, and roughly that was observed.',
 desc:'A scatter of offspring beak depth against mid-parent beak depth with a fitted line whose slope is the heritability; markers show the average of all birds, the selected parents and the predicted offspring average. Sliders set the heritability and the selection differential.',
 research:'Boag, P. T. (1983). The heritability of external morphology in Darwin’s ground finches. Evolution 37, 877–894; Grant, P. R. & Grant, B. R. (1995). Predicting microevolutionary responses to directional selection on heritable variation. Evolution 49, 241–251. Scatter points are simulated.',
 dur:10,hint:'Set heritability to zero and the offspring do not change at all, however strong the selection. Set it to one and they match their parents exactly.',
 init:()=>({h2:.8,S:.5}),
 watch(p){return {h2:+(p<.5?.8:1-p).toFixed(2),S:.5}},
 ui:[{range:'h2',label:'Heritability h²',min:0,max:1,step:.05,get:s=>s.h2,act:'h2',show:v=>B2_m(v,2)},{range:'S',label:'Selection S',min:0,max:1,step:.05,get:s=>s.S,act:'S',show:v=>B2_m(v,2)+' mm'}],
 on:{h2(s,v){s.h2=v},S(s,v){s.S=v}},
 draw(s){
  const mu=9.4,R1=s.h2*s.S;let out=heading('Parents and offspring');
  const A=B2_axes(70,58,300,240,[8,11],[8,11],{xt:[8,9,10,11],yt:[8,9,10,11],xl:'mid-parent beak depth (mm)',yl:'offspring (mm)'});out+=A.svg;
  const r=rng(23);for(let i=0;i<60;i++){const xp=mu+B2_gauss(r)*.45,y=mu+s.h2*(xp-mu)+B2_gauss(r)*.45*Math.sqrt(Math.max(.05,1-s.h2*s.h2));out+=Ci(A.X(clamp(xp,8,11)),A.Y(clamp(y,8,11)),4,C.blue,'none','opacity=".45"')}
  out+=L(A.X(8),A.Y(mu+s.h2*(8-mu)),A.X(11),A.Y(mu+s.h2*(11-mu)),C.blue,3);
  out+=L(A.X(mu),A.Y(8),A.X(mu),A.Y(mu),C.ink,1.5,'stroke-dasharray="4 3"')+L(A.X(mu+s.S),A.Y(8),A.X(mu+s.S),A.Y(mu+R1),C.coral,2,'stroke-dasharray="4 3"');
  out+=L(A.X(8),A.Y(mu+R1),A.X(mu+s.S),A.Y(mu+R1),C.coral,2,'stroke-dasharray="4 3"')+Ci(A.X(mu+s.S),A.Y(mu+R1),7,C.coral)+Ci(A.X(mu),A.Y(mu),6,C.ink);
  out+=counter(400,62,'all birds',`${B2_m(mu,2)} mm`,C.ink,160)+counter(400,118,'selected parents',`${B2_m(mu+s.S,2)} mm`,C.coral,160)+counter(400,174,'predicted offspring',`${B2_m(mu+R1,2)} mm`,C.coral,160);
  out+=TBF(480,252,`R = h²S = ${B2_m(s.h2,2)} × ${B2_m(s.S,2)}`,14,C.ink)+TBF(480,274,`= ${B2_m(R1,2)} mm`,15,C.coral);
  return {svg:out,phase:`The line’s slope is the heritability (${B2_m(s.h2,2)}). Parents ${B2_m(s.S,2)} mm above average have offspring ${B2_m(R1,2)} mm above average. The Grants measured the next generation and found a response close to this kind of prediction.`};
 }});

SCENE({id:'finches-beaks-competition',name:'When a competitor arrives',tag:'Character displacement, 2004–05',
 definition:'Character displacement is evolution that makes competing species more different. When two species compete for the same food, individuals of one that use the other’s food least do best.',
 example:'In 1977, deep beaks helped medium ground finches crack large seeds. But large ground finches settled on Daphne Major in 1982. In the 2004–05 drought they ate most of the large seeds, and medium ground finches with smaller beaks survived better: average beak size fell.',
 desc:'A graph of survival against beak depth, rising to the right without the competitor and falling to the right with it, with an arrow showing the direction the average beak moves. Seed panels show which seeds are left for the medium ground finch.',
 research:'Lack, D. (1947). Darwin’s Finches; Grant, P. R. & Grant, B. R. (2006). Evolution of character displacement in Darwin’s finches. Science 313, 224–226; Lamichhaney, S. et al. (2016). Science 352, 470–474 (a gene region, HMGA2, linked to beak size). Curves are illustrative.',
 dur:10,hint:'Switch the large ground finch on and off. The same island, the same drought, opposite selection.',
 init:()=>({comp:'yes'}),
 watch(p){return {comp:p<.5?'no':'yes'}},
 ui:[{choose:[['no','1977: no competitor'],['yes','2005: competitor present']],label:'Drought',get:s=>s.comp,act:'comp'}],
 on:{comp(s,v){s.comp=v}},
 draw(s){
  const yes=s.comp==='yes';let out=heading(yes?'2004–05 drought: large ground finches present':'1977 drought: no large ground finches');
  const A=B2_axes(70,60,300,220,[8,11],[0,1],{xt:[8,9,10,11],yt:[[0,'0'],[.5,'50%'],[1,'100%']],xl:'beak depth (mm)',yl:'chance of surviving'});out+=A.svg;
  const surv=d=>yes?B2_logistic(-(d-9.4)*2.2-.6):B2_logistic((d-9.4)*2.2-.9);
  out+=P(B2_path(range(61).map(i=>{const d=8+i*.05;return [A.X(d),A.Y(surv(d))]})),yes?C.purple:C.coral,3.5);
  out+=yes?arrow(A.X(10.8),A.Y(.72),A.X(10.2),A.Y(.72),C.purple,3,10)+TF(A.X(10.95),A.Y(.72)-14,'average beak gets smaller',13,C.purple,'end'):arrow(A.X(9.0),A.Y(.6),A.X(9.5),A.Y(.6),C.coral,3,10)+TF(A.X(9.25),A.Y(.6)-14,'average beak gets deeper',13,C.coral);
  out+=R(400,60,170,220,'#fff',C.grid,8)+B2_title(414,84,'Seeds left to eat',C.ink);
  const seeds=[['small, soft',6,'#b38b4a',yes,yes?'the main food left':'soon ran out'],['large, hard (caltrop)',12,'#6b4f2a',!yes,yes?'eaten by large finches':'left for deep beaks']];
  seeds.forEach(([n,r,c,ok,st],i)=>{const y=126+i*70;out+=Ci(430,y,r,c)+TF(452,y+5,n,13,C.ink,'start')+TF(452,y+23,st,13,ok?C.green:C.coral,'start')});
  out+=TF(414,262,yes?'Large finches since 1982':'Large finches absent',13,C.muted,'start');
  return {svg:out,phase:yes?'With large ground finches taking the large seeds, medium ground finches with smaller beaks, better at small seeds, survived best. The average beak shrank, making the two species more different.':'Without a competitor, the large hard seeds were left for medium ground finches with deep enough beaks, and deeper beaks were favoured.'};
 }});
