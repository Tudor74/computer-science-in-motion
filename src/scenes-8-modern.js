/* ===================== Chemistry era 8 · Modern chemistry ===================== */
// Semiconductors, nanomaterials, click chemistry, green chemistry, the chemistry of the atmosphere and computing
// molecules. Pictures are pure functions of state; nothing here is random. Values marked illustrative in captions
// are teaching sketches, not data.
const C8_PHI=(1+Math.sqrt(5))/2,C8_K=8.617e-5;
function C8_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
function C8_btn(X,act,arg,label,x,y,w,h,text,o={}){
 const lines=Array.isArray(text)?text:[text];
 const inner=R(x,y,w,h,o.fill||'#fff',o.stroke||C.line,8)+lines.map((t,i)=>(o.bold&&i===0?TBF:TF)(x+w/2,y+h/2+5+(i-(lines.length-1)/2)*16,t,o.size||13,o.ink||C.ink)).join('');
 return hit(X,act,arg,label,inner);
}
const C8_lines=(x,y,lines,col=C.ink,size=13,gap=17,anchor='start')=>lines.map((l,i)=>TF(x,y+i*gap,l,size,col,anchor)).join('');
const C8_path=pts=>pts.map((q,i)=>(i?'L':'M')+fmt(q[0])+' '+fmt(q[1])).join('');
const C8_sup=n=>String(n).split('').map(c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'['0123456789'.indexOf(c)]||(c==='-'?'⁻':c)).join('');
const C8_pow=(e)=>'10'+C8_sup(e);
function C8_sci(v,d=1){if(v===0)return '0';const e=Math.floor(Math.log10(Math.abs(v))),m=v/10**e;return (Math.abs(m-1)<.05?'':m.toFixed(d)+' × ')+C8_pow(e)}
// Visible wavelength (nm) to an sRGB colour; outside 380–780 nm returns grey.
function C8_wl(w){
 if(w<380||w>780)return '#9aa7ae';let r=0,g=0,b=0;
 if(w<440){r=(440-w)/60;b=1}else if(w<490){g=(w-440)/50;b=1}else if(w<510){g=1;b=(510-w)/20}else if(w<580){r=(w-510)/70;g=1}else if(w<645){r=1;g=(645-w)/65}else r=1;
 const f=w<420?.35+.65*(w-380)/40:w>700?.35+.65*(780-w)/80:1;
 return '#'+[r,g,b].map(c=>Math.round(255*Math.pow(c*f,.8)).toString(16).padStart(2,'0')).join('');
}
const C8_band=w=>w<380?'ultraviolet (invisible)':w>780?'infrared (invisible)':w<450?'violet':w<495?'blue':w<570?'green':w<590?'yellow':w<620?'orange':'red';

/* ================================================================ semiconductors */
const C8_MAT={cu:{n:'Copper (a metal)',eg:0},ge:{n:'Germanium',eg:.66},si:{n:'Silicon',eg:1.12},gaas:{n:'Gallium arsenide',eg:1.42},gan:{n:'Gallium nitride',eg:3.4},c:{n:'Diamond',eg:5.5}};
const C8_MATS=['cu','ge','si','gaas','gan','c'];
// Electrons thermally lifted across the gap, scaled to silicon's ~1e10 per cm³ at 300 K; ignores effective-mass differences.
function C8_ni(eg,T){if(eg===0)return 8.5e22;return 1e10*Math.pow(T/300,1.5)*Math.exp(-eg/(2*C8_K*T))/Math.exp(-1.12/(2*C8_K*300))}
SCENE({id:'semiconductors',name:'Band gaps',tag:'Why silicon is in between',
 definition:'In a solid, electrons fill a valence band of energies. To carry current they must reach the empty conduction band above it. The energy step between the two is the band gap. Metals have no gap, insulators have a huge one, and semiconductors have a small one that heat can sometimes jump.',
 example:'Silicon’s gap is 1.12 electronvolts. At room temperature about ten billion electrons per cubic centimetre have jumped it, against about 10²³ free electrons in copper. Heat it and many more jump.',
 desc:'Left: the valence band (bottom) and conduction band (top) of the chosen material, with the gap to scale, and electrons that have jumped across shown as dots. Right: free electrons per cubic centimetre for all six materials on a logarithmic scale at the chosen temperature.',
 research:['Wilson, A. H. (1931). The theory of electronic semi-conductors. Proceedings of the Royal Society A 133, 458–491.','Sze, S. M. & Ng, K. K. (2007). Physics of Semiconductor Devices, 3rd edn. Wiley (band gaps at 300 K).','Kittel, C. (2005). Introduction to Solid State Physics, 8th edn. Wiley.'],
 dur:10,hint:'Pick silicon and raise the temperature. Then compare germanium and diamond at the same temperature.',
 init:()=>({m:'si',T:300}),
 watch(p){return {m:C8_MATS[Math.min(5,Math.floor(p*6))],T:300}},
 ui:[{choose:C8_MATS.map(k=>[k,C8_MAT[k].n.split(' (')[0]]),label:'Material',get:s=>s.m,act:'m'},{range:'T',label:'Temperature',min:200,max:600,step:10,get:s=>s.T,act:'T',show:v=>v+' K'}],
 on:{m(s,v){s.m=v},T(s,v){s.T=Number(v)}},
 draw(s){
  const M=C8_MAT[s.m],ni=C8_ni(M.eg,s.T);let out=heading('How big is the gap?',28);
  const x0=40,w=200,base=318,sc=36,gapPx=M.eg*sc;
  const vTop=base-60,cBot=M.eg===0?vTop-24:vTop-gapPx;
  out+=R(x0,vTop,w,60,C.pale,C.blue,6)+TF(x0+w/2,vTop+36,'valence band (full)',13,C.blue);
  out+=R(x0,cBot-60,w,60,'#fff',C.coral,6)+TF(x0+w/2,cBot-34,'conduction band',13,C.coral);
  if(M.eg>0){out+=L(x0+w+12,vTop,x0+w+12,cBot,C.ink,1.5)+L(x0+w+6,vTop,x0+w+18,vTop,C.ink,1.5)+L(x0+w+6,cBot,x0+w+18,cBot,C.ink,1.5);
   out+=TBF(x0+w+24,(vTop+cBot)/2+5,M.eg+' eV',14,C.ink,'start')}
  else out+=TF(x0+w/2,vTop-6,'bands overlap: no gap',13,C.ink);
  const dots=M.eg===0?12:clamp(Math.round(Math.log10(Math.max(1,ni))/2),0,12);
  for(let i=0;i<dots;i++)out+=Ci(x0+18+i*15,cBot-12,4.5,C.coral);
  out+=TBF(x0,52,M.n,15,C.ink,'start')+TF(x0,72,`at ${s.T} K (${s.T-273} °C)`,13,C.muted,'start');
  const A=C8_plot(330,70,240,226,[0,6],[-10,24],{yt:[[-10,C8_pow(-10)],[0,'1'],[10,C8_pow(10)],[23,C8_pow(23)]],yl:'free electrons per cm³'});out+=A.svg;
  C8_MATS.forEach((k,i)=>{const v=Math.log10(Math.max(1e-10,C8_ni(C8_MAT[k].eg,s.T))),x=A.X(i+.15),bw=A.X(.7)-A.X(0);
   out+=R(x,A.Y(v),bw,A.Y(-10)-A.Y(v),k===s.m?C.coral:C.line,'none',3);
   out+=TF(x+bw/2,A.Y(-10)+16,['Cu','Ge','Si','GaAs','GaN','C'][i],13,k===s.m?C.coral:C.muted)});
  out+=TF(330,346,'Estimate scaled from silicon; ignores',13,C.muted,'start')+TF(330,363,'differences in effective mass.',13,C.muted,'start');
  const nTxt=M.eg===0?'about 8.5 × 10²² (all the time)':ni<1?'effectively none':C8_sci(ni);
  out+=TF(x0,352,'free electrons per cm³:',13,C.muted,'start')+TBF(x0,372,nTxt,14,C.ink,'start');
  return {svg:out,phase:M.eg===0?'Copper has no gap: its bands overlap, so about one electron per atom is always free to move. That is why metals conduct whatever the temperature.':M.eg>3?`${M.n} has a gap of ${M.eg} eV. Heat alone almost never lifts an electron across it, so pure ${M.n.toLowerCase()} is an insulator at ${s.T} K.`:`${M.n} has a gap of ${M.eg} eV. At ${s.T} K roughly ${C8_sci(ni)} electrons per cm³ have jumped it: billions of times fewer than in a metal, but enough to switch on and off. That middle ground is what makes a semiconductor useful.`};
 }});

SCENE({id:'semiconductors-doping',name:'Doping',tag:'One atom in millions',
 definition:'Doping adds a tiny amount of another element to a semiconductor. Phosphorus has five outer electrons to silicon’s four, so each phosphorus atom brings a spare electron: n-type. Boron has three, leaving a missing electron, a hole, that acts like a positive carrier: p-type.',
 example:'Replacing one silicon atom in five million with phosphorus (10¹⁶ per cm³) gives a million times more free electrons than pure silicon has at room temperature.',
 desc:'A flat sketch of the silicon lattice: each atom shares four bonds with its neighbours. The centre atom is the dopant, with its spare electron or its hole. Right: dopant atoms per cm³ against silicon’s 5 × 10²² atoms per cm³, and the gain in carriers over pure silicon. The 3D view shows the real diamond-cubic arrangement with the dopant inside.',
 research:['Shockley, W. (1949). The theory of p-n junctions in semiconductors and p-n junction transistors. Bell System Technical Journal 28, 435–489.','Riordan, M. & Hoddeson, L. (1997). Crystal Fire: The Birth of the Information Age. Norton.','Sze, S. M. & Ng, K. K. (2007). Physics of Semiconductor Devices, 3rd edn. Wiley.'],
 dur:10,hint:'Switch between phosphorus and boron, then raise the doping level. Try the 3D view to see the real lattice.',
 init:()=>({d:'P',lvl:16}),
 watch(p){return {d:p<.5?'P':'B',lvl:14+Math.round(smooth((p*2)%1)*4)}},
 ui:[{choose:[['none','Pure silicon'],['P','Phosphorus (n-type)'],['B','Boron (p-type)']],label:'Dopant',get:s=>s.d,act:'d'},{range:'lvl',label:'Doping level',min:14,max:18,step:1,get:s=>s.lvl,act:'lvl',show:v=>C8_pow(v)+' per cm³'}],
 on:{d(s,v){s.d=v},lvl(s,v){s.lvl=Number(v)}},
 draw(s){
  let out=heading('Swapping one atom in millions',28);
  const gx=60,gy=70,step=56,n=5;
  for(let i=0;i<n;i++)for(let j=0;j<n;j++){const x=gx+j*step,y=gy+i*step;
   if(j<n-1){out+=L(x+14,y-3,x+step-14,y-3,C.line,2)+L(x+14,y+3,x+step-14,y+3,C.line,2)}
   if(i<n-1){out+=L(x-3,y+14,x-3,y+step-14,C.line,2)+L(x+3,y+14,x+3,y+step-14,C.line,2)}}
  for(let i=0;i<n;i++)for(let j=0;j<n;j++){const x=gx+j*step,y=gy+i*step,c=i===2&&j===2&&s.d!=='none';
   out+=Ci(x,y,14,c?(s.d==='P'?C.coral:C.purple):C.pale,c?'none':C.blue)+TBF(x,y+5,c?s.d:'Si',13,c?'#fff':C.blue)}
  const cx=gx+2*step,cy=gy+2*step;
  if(s.d==='P')out+=Ci(cx+28,cy-26,6,C.coral)+Ci(66,336,6,C.coral)+TF(80,341,'spare electron, free to move',13,C.coral,'start');
  if(s.d==='B')out+=Ci(cx+28,cy-26,6,'#fff',C.purple)+Ci(66,336,6,'#fff',C.purple)+TF(80,341,'hole: a missing electron, free to move',13,C.purple,'start');
  const dop=s.d==='none'?0:10**s.lvl,gain=s.d==='none'?1:10**(s.lvl-10);
  out+=counter(370,64,'dopant atoms per cm³',s.d==='none'?'0':C8_pow(s.lvl),C.ink,200);
  out+=counter(370,120,'silicon atoms per cm³','5.0 × 10²²',C.muted,200);
  out+=counter(370,176,'one dopant atom in',s.d==='none'?'—':Math.round(5e22/dop).toLocaleString('en-GB'),C.blue,200);
  out+=counter(370,232,'carriers vs pure silicon',s.d==='none'?'×1':'× '+C8_pow(s.lvl-10),s.d==='none'?C.muted:C.coral,200);
  out+=C8_lines(370,306,s.d==='none'?['Pure silicon: about 10¹⁰','free electrons per cm³ at 300 K.']:[s.d==='P'?'n-type: carriers are electrons.':'p-type: carriers are holes.','Room temperature, assuming','every dopant atom is ionised.'],C.ink,13,17);
  return {svg:out,phase:s.d==='none'?'Pure silicon has very few free carriers at room temperature: every atom shares its four outer electrons in four bonds.':`One ${s.d==='P'?'phosphorus':'boron'} atom for every ${Math.round(5e22/dop).toLocaleString('en-GB')} silicon atoms gives about ${C8_pow(s.lvl)} ${s.d==='P'?'free electrons':'holes'} per cm³, ${gain>=10?C8_pow(s.lvl-10)+' times':'about as many as'} pure silicon. Tiny, controlled impurities are what make transistors possible; joining n- and p-type regions makes diodes, LEDs and solar cells.`};
 },
 three(s,f,X,project){
  const fcc=[];for(const x of [0,1])for(const y of [0,1])for(const z of [0,1])fcc.push([x,y,z]);
  [[.5,.5,0],[.5,.5,1],[.5,0,.5],[.5,1,.5],[0,.5,.5],[1,.5,.5]].forEach(p=>fcc.push(p));
  const inner=[[.25,.25,.25],[.75,.75,.25],[.75,.25,.75],[.25,.75,.75]],atoms=fcc.concat(inner),P=project([-.05,1.05,-.05,1.05,-.05,1.05]);
  const items=[],dop=s.d==='none'?-1:fcc.length;
  for(const a of inner)for(const b of fcc){if(Math.abs(Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2])-Math.sqrt(3)/4)<1e-6)items.push({at:a.map((v,k)=>(v+b[k])/2),svg:P=>line3(a,b,P,C.line,4)})}
  const e=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]],ed=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  let out=ed.map(([a,b])=>line3(e[a],e[b],P,C.grid,1.2,'stroke-dasharray="4 4"')).join('');
  atoms.forEach((a,i)=>items.push({at:a,svg:P=>{const q=P(a),isD=i===dop;return Ci(q[0],q[1],isD?13:10,isD?(s.d==='P'?C.coral:C.purple):C.pale,isD?'none':C.blue)+(isD?TBF(q[0],q[1]+5,s.d,13,'#fff'):'')}}));
  out+=sortedItems(items,P);
  return {svg:out,title:'The diamond-cubic lattice',caption:'One cubic cell of silicon. Every atom bonds to four neighbours at the corners of a tetrahedron, the same arrangement as diamond. '+(s.d==='none'?'All atoms here are silicon.':`The coloured atom is ${s.d==='P'?'phosphorus':'boron'}, sitting in a silicon site.`)};
 }});

const C8_LEDS=[['gaas','Gallium arsenide',1.42],['gaasp','GaAsP (red)',1.9],['gap','Gallium phosphide',2.26],['ingan','InGaN (blue)',2.7]];
SCENE({id:'semiconductors-led',name:'Light from a gap',tag:'Colour = band gap',
 definition:'In a light-emitting diode an electron falls from the conduction band into a hole in the valence band and gives off a photon. The photon’s energy equals the band gap, so the gap sets the colour: wavelength in nanometres ≈ 1,240 ÷ gap in electronvolts.',
 example:'Red LEDs arrived in 1962 (Nick Holonyak). Bright blue needed gallium nitride alloys with a gap near 2.7 eV, finally made to work by Isamu Akasaki, Hiroshi Amano and Shuji Nakamura in the early 1990s (Nobel Prize 2014). Blue plus a phosphor gives white LED lighting.',
 desc:'Left: an electron dropping across the gap and emitting a photon of that colour. Right: the visible spectrum from 380 to 780 nm with the emitted wavelength marked. Presets are typical gaps for real LED materials; the slider lets you try any gap.',
 research:['Holonyak, N. & Bevacqua, S. F. (1962). Coherent (visible) light emission from Ga(As1−xPx) junctions. Applied Physics Letters 1, 82–83.','Nakamura, S., Mukai, T. & Senoh, M. (1994). Candela-class high-brightness InGaN/AlGaN double-heterostructure blue-light-emitting diodes. Applied Physics Letters 64, 1687–1689.','Nobel Prize in Physics 2014: Akasaki, Amano and Nakamura, for efficient blue light-emitting diodes.'],
 dur:10,hint:'Slide the gap from 1.0 to 3.5 eV and watch the colour sweep through the rainbow. Below about 1.6 eV the light is infrared.',
 init:()=>({eg:1.9}),
 watch(p){return {eg:Math.round((1.2+smooth(p)*2.2)*100)/100}},
 ui:[{range:'eg',label:'Band gap',min:1,max:3.5,step:.02,get:s=>s.eg,act:'eg',show:v=>Number(v).toFixed(2)+' eV'},...C8_LEDS.map(([k,n,e])=>({b:n,act:'eg',arg:e}))],
 on:{eg(s,v){s.eg=Number(v)}},
 draw(s){
  const wl=1240/s.eg,col=C8_wl(wl);let out=heading('The gap decides the colour',28);
  const x0=40,base=300,sc=50,cTop=base-60-s.eg*sc;
  out+=R(x0,base-60,170,60,C.pale,C.blue,6)+TF(x0+85,base-26,'valence band',13,C.blue);
  out+=R(x0,cTop-50,170,50,'#fff',C.coral,6)+TF(x0+85,cTop-20,'conduction band',13,C.coral);
  out+=Ci(x0+60,cTop-12,6,C.coral)+arrow(x0+60,cTop-4,x0+60,base-58,C.ink,2)+Ci(x0+60,base-48,6,'#fff',C.ink);
  out+=TBF(x0+75,(cTop+base-60)/2+5,s.eg.toFixed(2)+' eV',14,C.ink,'start');
  const wy=(cTop+base-60)/2-28;let d=`M${x0+120} ${wy}`;for(let i=1;i<=40;i++)d+=`L${fmt(x0+120+i*3)} ${fmt(wy+7*Math.sin(i/2))}`;
  out+=P(d,col==='#9aa7ae'?C.muted:col,3)+arrow(x0+238,wy,x0+252,wy,col==='#9aa7ae'?C.muted:col,3);
  const A={X:v=>300+(v-350)/(850-350)*260};
  for(let w=380;w<780;w+=4)out+=R(A.X(w),110,A.X(w+4)-A.X(w)+.5,46,C8_wl(w+2),'none',0);
  out+=R(A.X(350),110,A.X(380)-A.X(350),46,'#eef1f3','none',0)+R(A.X(780),110,A.X(850)-A.X(780),46,'#eef1f3','none',0);
  [400,500,600,700,800].forEach(w=>{out+=L(A.X(w),156,A.X(w),161,C.line,1)+TF(A.X(w),176,String(w),13,C.muted)});
  out+=TF(430,196,'wavelength (nm)',13,C.muted);
  const mx=A.X(clamp(wl,350,850));out+=arrow(mx,84,mx,106,C.ink,2.5)+TBF(clamp(mx,330,540),78,Math.round(wl)+' nm',15,C.ink);
  out+=R(310,222,90,90,col,C.line,45)+TBF(470,252,C8_band(wl),15,C.ink)+TF(470,276,'λ ≈ 1240 ÷ '+s.eg.toFixed(2),13,C.muted)+TF(470,296,'= '+Math.round(wl)+' nm',13,C.muted);
  out+=TF(300,350,'Presets are typical gaps; real LEDs emit a narrow band around this value.',13,C.muted);
  return {svg:out,phase:wl>780?`A gap of ${s.eg.toFixed(2)} eV gives photons of about ${Math.round(wl)} nm: infrared, invisible to us. Gallium arsenide LEDs like this sit in TV remote controls.`:wl<380?`A gap of ${s.eg.toFixed(2)} eV gives ultraviolet light at about ${Math.round(wl)} nm.`:`A gap of ${s.eg.toFixed(2)} eV gives ${C8_band(wl)} light at about ${Math.round(wl)} nm. Bigger gaps mean more energetic photons and bluer light, which is why blue LEDs needed a wide-gap material such as gallium nitride.`};
 }});

/* ================================================================ nanomaterials */
function C8_c60(){
 const base=[[0,1,3*C8_PHI],[1,2+C8_PHI,2*C8_PHI],[C8_PHI,2,2*C8_PHI+1]],out=[];
 for(const b of base)for(const sx of [1,-1])for(const sy of [1,-1])for(const sz of [1,-1]){const v=[b[0]*sx,b[1]*sy,b[2]*sz];
  for(let k=0;k<3;k++){const p=[v[k%3],v[(k+1)%3],v[(k+2)%3]];if(!out.some(q=>Math.hypot(q[0]-p[0],q[1]-p[1],q[2]-p[2])<1e-6))out.push(p)}}
 const axes=[];for(const a of [1,-1])for(const b of [1,-1]){const v=[0,a,b*C8_PHI];for(let k=0;k<3;k++)axes.push([v[k%3],v[(k+1)%3],v[(k+2)%3]])}
 const pent=out.map(p=>{let best=0,bd=-1e9;axes.forEach((a,i)=>{const d=a[0]*p[0]+a[1]*p[1]+a[2]*p[2];if(d>bd){bd=d;best=i}});return best});
 const bonds=[];for(let i=0;i<out.length;i++)for(let j=i+1;j<out.length;j++){const q=out[i],r=out[j];if(Math.abs(Math.hypot(q[0]-r[0],q[1]-r[1],q[2]-r[2])-2)<1e-6)bonds.push([i,j,pent[i]===pent[j]])}
 return {atoms:out,bonds};
}
const C8_C60=C8_c60();
const C8_CAGES={0:'C₂₀',20:'C₆₀ (buckminsterfullerene)',25:'C₇₀',30:'C₈₀'};
SCENE({id:'nanomaterials',name:'Buckyballs',tag:'Always twelve pentagons',
 definition:'Fullerenes are closed cages of carbon atoms, each bonded to three neighbours, made of hexagons and pentagons. A flat sheet of hexagons is graphene; to curl it into a closed cage you need exactly twelve pentagons, however many hexagons there are. This follows from Euler’s rule for polyhedra.',
 example:'In 1985 Harold Kroto, Robert Curl, Richard Smalley and students James Heath and Sean O’Brien found a peak at 60 carbon atoms in vaporised graphite, and proposed a football-shaped cage: 12 pentagons and 20 hexagons (Nobel Prize 1996).',
 desc:'Choose the number of hexagons. Euler’s rule (vertices − edges + faces = 2), with three bonds at every atom, fixes the pentagons at 12 and gives the number of atoms. The 3D view shows C₆₀ itself: pentagon edges thin, the bonds between hexagons thick.',
 research:['Kroto, H. W., Heath, J. R., O’Brien, S. C., Curl, R. F. & Smalley, R. E. (1985). C60: Buckminsterfullerene. Nature 318, 162–163.','Krätschmer, W., Lamb, L. D., Fostiropoulos, K. & Huffman, D. R. (1990). Solid C60: a new form of carbon. Nature 347, 354–358.','Fowler, P. W. & Manolopoulos, D. E. (1995). An Atlas of Fullerenes. Oxford University Press.'],
 dur:10,hint:'Try 0, 20, 25 and 30 hexagons. The pentagon count never changes. Switch to 3D and drag to turn the ball.',
 init:()=>({h:20}),
 watch(p){return {h:[0,20,25,30][Math.min(3,Math.floor(p*4))]}},
 ui:[{range:'h',label:'Hexagons',min:0,max:30,step:1,get:s=>s.h,act:'h',show:v=>v+' hexagons'}],
 on:{h(s,v){s.h=Number(v)===1?2:Number(v)}},
 draw(s){
  const h=s.h,F=12+h,V=20+2*h,E=30+3*h;let out=heading('Closing a cage of carbon',28);
  const pent=(cx,cy,r,col)=>P(range(5).map(i=>{const a=-Math.PI/2+i*2*Math.PI/5;return (i?'L':'M')+fmt(cx+r*Math.cos(a))+' '+fmt(cy+r*Math.sin(a))}).join('')+'Z',col,2,tint(col,.75));
  const hex=(cx,cy,r,col)=>P(range(6).map(i=>{const a=i*Math.PI/3;return (i?'L':'M')+fmt(cx+r*Math.cos(a))+' '+fmt(cy+r*Math.sin(a))}).join('')+'Z',col,2,tint(col,.8));
  out+=TBF(40,66,'12 pentagons',14,C.coral,'start');for(let i=0;i<12;i++)out+=pent(52+i*22,90,9,C.coral);
  out+=TBF(40,130,`${h} hexagons`,14,C.blue,'start');for(let i=0;i<h;i++)out+=hex(52+(i%13)*22,154+Math.floor(i/13)*22,9,C.blue);
  out+=counter(360,58,'faces F = 12 + hexagons',String(F),C.ink,200);
  out+=counter(360,114,'atoms V (3 bonds each)',String(V),C.blue,200);
  out+=counter(360,170,'bonds E = 3V ÷ 2',String(E),C.ink,200);
  out+=R(40,224,520,46,C.pale,'none',8)+TBF(300,253,`V − E + F = ${V} − ${E} + ${F} = ${V-E+F}`,16,C.ink);
  out+=TBF(300,300,C8_CAGES[h]?'This cage is '+C8_CAGES[h]:`This cage is C${C8_sup(V).replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g,c=>'₀₁₂₃₄₅₆₇₈₉'['⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c)])}`,15,C.ink);
  out+=TF(300,326,h===1?'No cage has exactly one hexagon.':'Atoms = 20 + 2 × hexagons. Euler’s rule forces the 12 pentagons.',13,C.muted);
  out+=TF(300,350,'Larger cages exist in many shapes (isomers); this counts faces only.',13,C.muted);
  return {svg:out,phase:`With ${h} hexagons the cage has ${V} carbon atoms, ${E} bonds and ${F} faces, and V − E + F = 2 as for any closed polyhedron. Combine that with three bonds per atom and the arithmetic leaves exactly 12 pentagons, whatever the size.`};
 },
 three(s,f,X,project){
  const {atoms,bonds}=C8_C60,P=project([-3.6,3.6,-3.6,3.6,-3.6,3.6]),items=[];
  bonds.forEach(([i,j,pen])=>{const a=atoms[i],b=atoms[j];items.push({at:a.map((v,k)=>(v+b[k])/2),svg:P=>line3(a,b,P,pen?C.coral:C.ink,pen?2:4.5)})});
  atoms.forEach(a=>items.push({at:a,svg:P=>{const q=P(a);return Ci(q[0],q[1],5,C.dark)}}));
  return {svg:sortedItems(items,P),title:'C₆₀ in 3D',caption:'Sixty carbon atoms, ninety bonds. Coral edges outline the 12 pentagons; thick dark edges are the 30 bonds shared by two hexagons, which are shorter and have more double-bond character. No two pentagons touch.'};
 }});

SCENE({id:'nanomaterials-surface',name:'Small means surface',tag:'Why nanoparticles behave differently',
 definition:'Shrink a particle and a larger share of its atoms sit on the surface, where they have fewer neighbours and react more readily. At a few nanometres, nearly half the atoms are on the outside, so melting point, colour and catalytic activity change with size.',
 example:'Bulk gold is yellow and unreactive. Gold particles a few tens of nanometres across scatter and absorb light differently and look ruby red; Michael Faraday made such colloids in 1857, and Roman glassmakers used similar particles in the Lycurgus Cup. Gold nanoparticles a few nanometres wide catalyse reactions that bulk gold does not (Haruta 1987).',
 desc:'Left: a cross-section of a spherical particle, schematic, with surface atoms in coral. Right: the share of atoms in the outer layer, taking one atomic layer as 0.3 nm, against diameter on a logarithmic scale.',
 research:['Faraday, M. (1857). The Bakerian lecture: experimental relations of gold (and other metals) to light. Philosophical Transactions 147, 145–181.','Haruta, M., Kobayashi, T., Sano, H. & Yamada, N. (1987). Novel gold catalysts for the oxidation of carbon monoxide at a temperature far below 0 °C. Chemistry Letters 16, 405–408.','Roduner, E. (2006). Size matters: why nanomaterials are different. Chemical Society Reviews 35, 583–592.'],
 dur:10,hint:'Slide from 100 nm down to 1 nm and watch the surface share climb.',
 init:()=>({lg:1}),
 watch(p){return {lg:Math.round((2-smooth(p)*1.8)*20)/20}},
 ui:[{range:'lg',label:'Diameter',min:0,max:2,step:.05,get:s=>s.lg,act:'lg',show:v=>(10**Number(v)).toFixed(Number(v)<1?1:0)+' nm'}],
 on:{lg(s,v){s.lg=Number(v)}},
 draw(s){
  const d=10**s.lg,a=.3,fr=d<=2*a?1:1-Math.pow((d-2*a)/d,3);let out=heading('How much of the particle is surface?',28);
  const cx=150,cy=200,Rr=110,nAc=Math.max(2,Math.min(26,Math.round(d/a))),cell=2*Rr/nAc;
  for(let i=0;i<nAc;i++)for(let j=0;j<nAc;j++){const x=cx-Rr+(i+.5)*cell,y=cy-Rr+(j+.5)*cell,r=Math.hypot(x-cx,y-cy);if(r>Rr)continue;
   out+=Ci(x,y,Math.max(1.5,cell*.4),r>Rr-cell?C.coral:C.pale,r>Rr-cell?'none':C.line)}
  out+=Ci(cx,cy,Rr,'none',C.ink);
  out+=TF(cx,cy+Rr+24,d>=26*a?'schematic: real particle has far more atoms':'about '+Math.round(d/a)+' atoms across',13,C.muted);
  const A=C8_plot(320,66,240,200,[0,2],[0,1],{xt:[[0,'1'],[1,'10'],[2,'100 nm']],yt:[[0,'0%'],[.5,'50%'],[1,'100%']],xl:'diameter (log scale)',yl:'share of atoms on the surface'});out+=A.svg;
  out+=P(C8_path(range(81).map(i=>{const g=i/40,dd=10**g;return [A.X(g),A.Y(dd<=.6?1:1-Math.pow((dd-.6)/dd,3))]})),C.blue,2.5);
  out+=Ci(A.X(s.lg),A.Y(fr),7,C.coral);
  out+=TBF(440,338,`${d.toFixed(d<10?1:0)} nm: ${(fr*100).toFixed(fr<.1?1:0)}% of atoms on the surface`,14,C.ink);
  out+=TF(440,358,'One atomic layer taken as 0.3 nm.',13,C.muted);
  return {svg:out,phase:`At ${d.toFixed(d<10?1:0)} nm about ${(fr*100).toFixed(fr<.1?1:0)}% of the atoms are in the outer layer. ${fr>.3?'With so much surface, the particle behaves differently from the bulk material: it melts lower, reacts faster and, for metals like gold, changes colour.':'At this size the particle still behaves much like the bulk material.'}`};
 }});

// Yu, Qu, Guo & Peng (2003): CdSe diameter D (nm) from first absorption peak λ (nm).
const C8_yu=l=>1.6122e-9*l**4-2.6575e-6*l**3+1.6242e-3*l**2-.4277*l+41.57;
function C8_peak(D){let lo=470,hi=645;for(let i=0;i<50;i++){const m=(lo+hi)/2;if(C8_yu(m)<D)lo=m;else hi=m}return (lo+hi)/2}
// Brus (1984) particle-in-a-sphere estimate for CdSe (eV), radius in nm.
function C8_brus(D){const R=D/2,conf=.376/(R*R)*(1/.13+1/.45),coul=1.8*1.44/(10.6*R);return 1.74+conf-coul}
SCENE({id:'nanomaterials-quantum-dots',name:'Quantum dots',tag:'Size sets the colour',
 definition:'A quantum dot is a semiconductor crystal only a few nanometres across. Squeezing the electron and hole into so small a space raises their energies, like a shorter guitar string playing a higher note, so the gap grows as the dot shrinks. The same material glows a different colour at each size.',
 example:'Cadmium selenide dots about 2.5 nm across glow blue-green; dots about 6 nm across glow red. Alexei Ekimov (in glass, 1981) and Louis Brus (in solution, 1983) discovered them, and Moungi Bawendi’s group learned to make them uniform (1993). Nobel Prize 2023.',
 desc:'Choose the diameter of a cadmium selenide dot. Its first absorption peak, from a published fit to measurements, sets the colour; glowing light is a little redder. The row of vials shows several sizes side by side. The simple particle-in-a-sphere estimate is shown for comparison.',
 research:['Ekimov, A. I. & Onushchenko, A. A. (1981). Quantum size effect in three-dimensional microscopic semiconductor crystals. JETP Letters 34, 345–349.','Brus, L. E. (1984). Electron–electron and electron–hole interactions in small semiconductor crystallites: the size dependence of the lowest excited electronic state. Journal of Chemical Physics 80, 4403–4409.','Murray, C. B., Norris, D. J. & Bawendi, M. G. (1993). Synthesis and characterization of nearly monodisperse CdE (E = S, Se, Te) semiconductor nanocrystallites. JACS 115, 8706–8715.','Yu, W. W., Qu, L., Guo, W. & Peng, X. (2003). Experimental determination of the extinction coefficient of CdTe, CdSe, and CdS nanocrystals. Chemistry of Materials 15, 2854–2860.'],
 dur:10,hint:'Slide the size up and down. Compare the measured colour with the simple model: it gets the trend right but overshoots for small dots.',
 init:()=>({D:3.5}),
 watch(p){return {D:Math.round((2.4+smooth(p)*4.4)*10)/10}},
 ui:[{range:'D',label:'Dot diameter',min:2.4,max:6.8,step:.1,get:s=>s.D,act:'D',show:v=>Number(v).toFixed(1)+' nm'}],
 on:{D(s,v){s.D=Number(v)}},
 draw(s){
  const pk=C8_peak(s.D),em=pk+15,col=C8_wl(em),bE=C8_brus(s.D),bW=1240/bE;let out=heading('Same crystal, different size',28);
  const r=8+s.D*9;out+=Ci(130,150,r+18,tint(col,.6),'none')+Ci(130,150,r,col,C.ink);
  for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++){const x=130+i*r*.38,y=150+j*r*.38;if(Math.hypot(x-130,y-150)<r-6)out+=Ci(x,y,2.2,'#ffffffaa')}
  out+=TBF(130,254,s.D.toFixed(1)+' nm across',15,C.ink);
  out+=counter(270,64,'absorption peak (measured fit)',Math.round(pk)+' nm',C.ink,290);
  out+=counter(270,120,'glows near',Math.round(em)+' nm · '+C8_band(em),C.ink,290);
  out+=counter(270,176,'simple particle-in-a-sphere model',Math.round(bW)+' nm',C.muted,290);
  out+=TF(415,240,'The simple model overshoots for small dots.',13,C.muted);
  [2.5,3.2,4.0,5.0,6.5].forEach((D,i)=>{const c=C8_wl(C8_peak(D)+15),x=78+i*104;
   out+=R(x,284,44,52,c,C.ink,6)+R(x+8,274,28,12,C.grid,C.ink,3)+TF(x+22,352,D+' nm',13,C.muted)});
  out+=TF(300,372,'Colours approximate; emission taken as peak + 15 nm.',13,C.muted);
  return {svg:out,phase:`A ${s.D.toFixed(1)} nm cadmium selenide dot absorbs most strongly near ${Math.round(pk)} nm and glows ${C8_band(em)}. Smaller dots squeeze the electron harder, raise the gap and shift the light towards blue; bulk CdSe has a gap of 1.74 eV and glows deep red, near 710 nm. Dots like these now colour some TV screens.`};
 }});

/* ================================================================ click chemistry */
SCENE({id:'click-chemistry',name:'Click chemistry',tag:'Copper makes it snap',
 definition:'Click chemistry, named by K. Barry Sharpless in 2001, means simple, reliable reactions that join two molecular pieces quickly and cleanly, almost like a buckle. The best-known joins an azide to an alkyne to make a ring called a triazole. With heat alone it is slow and gives two products; with a copper(I) catalyst, found independently by Morten Meldal and by Sharpless and Valery Fokin in 2002, it is fast and gives only one.',
 example:'Without copper, the azide–alkyne reaction (studied by Rolf Huisgen in the 1960s) needs long heating and gives a near 1:1 mixture of the 1,4 and 1,5 products. Copper speeds it up by around ten million times and gives only the 1,4 product at room temperature.',
 desc:'Left: an azide and an alkyne joining into a five-membered triazole ring. Right: the time to make 90% of the product and the mix of the two possible products, with or without copper, at the chosen temperature. Times are illustrative for one fixed concentration.',
 research:['Kolb, H. C., Finn, M. G. & Sharpless, K. B. (2001). Click chemistry: diverse chemical function from a few good reactions. Angewandte Chemie International Edition 40, 2004–2021.','Tornøe, C. W., Christensen, C. & Meldal, M. (2002). Peptidotriazoles on solid phase. Journal of Organic Chemistry 67, 3057–3064.','Rostovtsev, V. V., Green, L. G., Fokin, V. V. & Sharpless, K. B. (2002). A stepwise Huisgen cycloaddition process. Angewandte Chemie International Edition 41, 2596–2599.','Himo, F. et al. (2005). Copper(I)-catalyzed synthesis of azoles. JACS 127, 210–216.'],
 dur:10,hint:'Compare no catalyst and copper at 25 °C, then heat the uncatalysed reaction. Press Run to hear the click.',
 init:()=>({cat:'cu',T:25,done:false}),
 watch(p){return {cat:p<.5?'none':'cu',T:p<.5?Math.round(25+smooth(p*2)*75):25,done:true}},
 ui:[{choose:[['none','No catalyst'],['cu','Copper(I)']],label:'Catalyst',get:s=>s.cat,act:'cat'},{range:'T',label:'Temperature',min:25,max:100,step:5,get:s=>s.T,act:'T',show:v=>v+' °C'},{b:'Run',act:'run'}],
 on:{cat(s,v){s.cat=v;s.done=false},T(s,v){s.T=Number(v);s.done=false},run(s){s.done=true;AUDIO.tone(1320,{dur:.06,type:'square',gain:.08});AUDIO.tone(990,{dur:.05,type:'square',gain:.06,at:.07})}},
 draw(s){
  const Tk=s.T+273.15,f=Math.exp(-100000/8.314*(1/Tk-1/298.15)),t90=3.15e8/(s.cat==='cu'?1e7:1)/f;
  const tTxt=t90>3.15e7?(t90/3.15e7).toFixed(1)+' years':t90>86400*2?(t90/86400).toFixed(0)+' days':t90>3600?(t90/3600).toFixed(1)+' hours':t90>120?(t90/60).toFixed(0)+' minutes':t90>=1?Math.round(t90)+' seconds':'under a second';
  let out=heading(s.cat==='cu'?'Azide + alkyne, with copper':'Azide + alkyne, heat only',28);
  out+=TBF(60,80,'R–N₃',17,C.blue,'start')+TF(60,100,'azide',13,C.muted,'start');
  out+=TBF(150,80,'+',18,C.ink)+TBF(180,80,'R′–C≡CH',17,C.coral,'start')+TF(180,100,'alkyne',13,C.muted,'start');
  out+=arrow(80,124,80,160,s.done?C.green:C.line,2.5)+TF(96,146,s.cat==='cu'?'Cu(I)':'heat',13,C.muted,'start');
  const cx=110,cy=228,rr=40,names=['N','N','N','C','C'];
  const pts=range(5).map(i=>{const a=-Math.PI/2+i*2*Math.PI/5;return [cx+rr*Math.cos(a),cy+rr*Math.sin(a)]});
  out+=P(C8_path(pts)+'Z',s.done?C.green:C.line,2.5,s.done?tint(C.green,.85):'#fff');
  pts.forEach((q,i)=>out+=Ci(q[0],q[1],12,'#fff',i<3?C.blue:C.coral)+TBF(q[0],q[1]+5,names[i],13,i<3?C.blue:C.coral));
  out+=TF(cx,cy+70,'1,2,3-triazole ring',13,C.muted);
  out+=counter(320,58,'time to 90% product',s.done?tTxt:'press Run',s.cat==='cu'?C.green:C.coral,240);
  const p14=s.cat==='cu'?100:55,A={x:320,y:150,w:240};
  out+=TF(A.x,A.y-10,'products formed',13,C.muted,'start');
  out+=R(A.x,A.y,A.w*p14/100,30,C.green,'none',4)+R(A.x+A.w*p14/100,A.y,A.w*(100-p14)/100,30,C.amber,'none',4);
  out+=TF(A.x,A.y+50,`1,4 product: ${p14}%`,13,C.green,'start')+TF(A.x+A.w,A.y+50,`1,5 product: ${100-p14}%`,13,C.amber,'end');
  out+=C8_lines(320,236,s.cat==='cu'?['Copper speeds the reaction by','about 10⁷ and steers it to one','product. It works in water, at','room temperature.']:['Heat alone: slow, and a near','1:1 mix of two products that','must then be separated.'],C.ink,13,18);
  out+=TF(300,360,'Times are illustrative for one concentration; the rate ratio follows Himo et al. 2005.',13,C.muted);
  return {svg:out,phase:s.cat==='cu'?`With copper(I) at ${s.T} °C the azide and alkyne snap together in about ${tTxt}, giving only the 1,4 triazole. Reliable, fast, selective: what Sharpless meant by click.`:`Without a catalyst at ${s.T} °C the same reaction takes about ${tTxt} and gives a mixture of two products. Heat speeds it, but never makes it selective.`};
 }});

const C8_AZ=['sugar','dye','drug'],C8_AL=['peptide','polymer','surface'];
SCENE({id:'click-chemistry-modules',name:'Snap-together molecules',tag:'Build a library',
 definition:'Because a click reaction works the same way whatever is attached to the azide and alkyne, chemists can make many products from a few building blocks. Each azide piece can be clicked to each alkyne piece, so three of each give nine products from one reliable reaction.',
 example:'Click reactions are used to tag proteins with dyes, to link drug fragments, to make polymers and to coat surfaces. Drug discovery screens use the same idea to assemble large libraries.',
 desc:'Press an azide piece, then an alkyne piece, to click them together; the product fills its square in the 3 × 3 library. Make all fills the grid. Yields are illustrative of typical click reactions.',
 research:['Kolb, H. C., Finn, M. G. & Sharpless, K. B. (2001). Click chemistry: diverse chemical function from a few good reactions. Angewandte Chemie International Edition 40, 2004–2021.','Meldal, M. & Tornøe, C. W. (2008). Cu-catalyzed azide–alkyne cycloaddition. Chemical Reviews 108, 2952–3015.','Nobel Prize in Chemistry 2022: Bertozzi, Meldal and Sharpless.'],
 dur:10,hint:'Pick an azide, then an alkyne. Can you fill all nine squares?',
 init:()=>({a:null,made:[]}),
 watch(p){const n=Math.min(9,Math.floor(p*10));return {a:null,made:range(n).map(i=>Math.floor(i/3)+','+(i%3))}},
 ui:[{b:'Make all',act:'all'},{b:'Clear',act:'clear'}],
 on:{az(s,v){s.a=Number(v)},al(s,v){if(s.a===null)return;const k=s.a+','+v;if(!s.made.includes(k))s.made=s.made.concat(k);s.a=null;AUDIO.tone(1320,{dur:.05,type:'square',gain:.07})},all(s){s.made=range(9).map(i=>Math.floor(i/3)+','+(i%3));s.a=null},clear(s){s.made=[];s.a=null}},
 draw(s,f,X){
  let out=heading('Three by three: nine products',28);
  out+=TF(70,62,'azide pieces',13,C.blue);C8_AZ.forEach((n,i)=>{out+=C8_btn(X,'az',i,'Azide on '+n,20,74+i*58,100,44,[n+'–N₃'],{stroke:s.a===i?C.blue:C.line,fill:s.a===i?C.pale:'#fff',ink:C.blue})});
  out+=TF(530,62,'alkyne pieces',13,C.coral);C8_AL.forEach((n,i)=>{out+=C8_btn(X,'al',i,'Alkyne on '+n,480,74+i*58,100,44,[n+'–C≡CH'],{ink:C.coral})});
  const gx=180,gy=74,c=78;
  for(let i=0;i<3;i++)for(let j=0;j<3;j++){const k=i+','+j,on=s.made.includes(k),x=gx+j*(c+4),y=gy+i*(c-20);
   out+=R(x,y,c,c-26,on?tint(C.green,.8):'#fff',on?C.green:C.grid,6);
   out+=on?TF(x+c/2,y+20,C8_AZ[i],13,C.blue)+TF(x+c/2,y+36,'+ '+C8_AL[j],13,C.coral):TF(x+c/2,y+30,'—',13,C.muted)}
  out+=counter(180,262,'products made',s.made.length+' / 9',C.green,240);
  out+=TF(300,336,s.a===null?'Press an azide piece to start.':`${C8_AZ[s.a]} azide chosen: now press an alkyne piece.`,13,C.ink);
  out+=TF(300,358,'Each product: one triazole link, typically over 90% yield (illustrative).',13,C.muted);
  return {svg:out,phase:s.made.length===9?'All nine products made with the same reaction and the same conditions. That modularity is the point of click chemistry.':`${s.made.length} of 9 products made. Every pairing uses the same copper-catalysed click, whatever the pieces carry.`};
 }});

const C8_BIO={stau:{n:'Staudinger ligation',k:2e-3,safe:true,yr:2000},spaac:{n:'Strain-promoted (SPAAC)',k:7.6e-2,safe:true,yr:2004},tz:{n:'Tetrazine–trans-cyclooctene',k:2e3,safe:true,yr:2008},cu:{n:'Copper-catalysed click',k:20,safe:false,yr:2002}};
const C8_BIOK=['stau','spaac','cu','tz'];
SCENE({id:'click-chemistry-bioorthogonal',name:'Chemistry inside living things',tag:'Bertozzi’s bioorthogonal reactions',
 definition:'Bioorthogonal reactions work inside living cells without disturbing their own chemistry. Carolyn Bertozzi fed cells sugars carrying azides, which ended up on the cell surface, then labelled them with a probe. Copper is toxic to cells, so her group designed strained ring molecules (cyclooctynes) that click with azides without any catalyst.',
 example:'With a strain-promoted click, Bertozzi’s group watched sugars appear on the surface of developing zebrafish embryos (2008). Tetrazine reactions, introduced the same year, are far faster still and are being tested for targeting drugs in patients.',
 desc:'Choose a reaction and the probe concentration. Left: second-order rate constants on a logarithmic scale. Right: the time for half the tagged sugars to be labelled, t½ = ln 2 ÷ (k × concentration), and whether the reaction is safe for living cells. Rate constants are typical published values.',
 research:['Saxon, E. & Bertozzi, C. R. (2000). Cell surface engineering by a modified Staudinger reaction. Science 287, 2007–2010.','Agard, N. J., Prescher, J. A. & Bertozzi, C. R. (2004). A strain-promoted [3+2] azide–alkyne cycloaddition for covalent modification of biomolecules in living systems. JACS 126, 15046–15047.','Baskin, J. M. et al. (2007). Copper-free click chemistry for dynamic in vivo imaging. PNAS 104, 16793–16797.','Blackman, M. L., Royzen, M. & Fox, J. M. (2008). Tetrazine ligation: fast bioconjugation based on inverse-electron-demand Diels–Alder reactivity. JACS 130, 13518–13519.','Laughlin, S. T. et al. (2008). In vivo imaging of membrane-associated glycans in developing zebrafish. Science 320, 664–667.'],
 dur:10,hint:'Compare the reactions at the same concentration. Which is fast enough to watch, and which is safe in a living cell?',
 init:()=>({r:'spaac',c:-4}),
 watch(p){return {r:C8_BIOK[Math.min(3,Math.floor(p*4))],c:-4}},
 ui:[{choose:C8_BIOK.map(k=>[k,C8_BIO[k].n]),label:'Reaction',get:s=>s.r,act:'r'},{range:'c',label:'Probe concentration',min:-5,max:-3,step:.5,get:s=>s.c,act:'c',show:v=>(10**(Number(v)+6)).toFixed(0)+' µM'}],
 on:{r(s,v){s.r=v},c(s,v){s.c=Number(v)}},
 draw(s){
  const B=C8_BIO[s.r],conc=10**s.c,th=Math.LN2/(B.k*conc);
  const tTxt=th>86400*2?(th/86400).toFixed(0)+' days':th>3600?(th/3600).toFixed(1)+' hours':th>90?(th/60).toFixed(0)+' minutes':th>1?th.toFixed(0)+' seconds':th.toFixed(2)+' seconds';
  let out=heading('Fast enough, and safe enough?',28);
  const A=C8_plot(130,60,240,240,[-3,4],[0,4],{xt:[[-3,C8_pow(-3)],[0,'1'],[4,C8_pow(4)]],xl:'rate constant (M⁻¹ s⁻¹, log)'});out+=A.svg;
  C8_BIOK.forEach((k,i)=>{const b=C8_BIO[k],y=A.Y(i+.85),h=A.Y(0)-A.Y(.7),on=k===s.r;
   out+=R(A.X(-3),y,A.X(Math.log10(b.k))-A.X(-3),h,on?C.blue:C.line,'none',3);
   out+=TF(122,y+h/2+5,{stau:'Staudinger',spaac:'SPAAC',tz:'Tetrazine',cu:'Copper click'}[k],13,on?C.ink:C.muted,'end')});
  out+=counter(400,62,'half labelled in',tTxt,th<3600?C.green:th<86400?C.amber:C.coral,180);
  out+=counter(400,120,'safe in living cells?',B.safe?'yes':'no: copper is toxic',B.safe?C.green:C.coral,180);
  out+=counter(400,178,'introduced',String(B.yr),C.ink,180);
  out+=C8_lines(400,252,['t½ = ln 2 ÷ (k × c)',`k = ${C8_sci(B.k)} M⁻¹ s⁻¹`,`c = ${(conc*1e6).toFixed(0)} µM`],C.ink,13,18);
  out+=TF(300,362,'Rate constants are typical values; real ones vary with the exact molecules.',13,C.muted);
  return {svg:out,phase:`${B.n}: at ${(conc*1e6).toFixed(0)} µM, half the tagged sugars are labelled in about ${tTxt}. ${B.safe?'It needs no copper, so it can be used in living cells and animals.':'Fast, but the copper catalyst harms living cells, which is why Bertozzi’s group designed copper-free alternatives.'}`};
 }});

/* ================================================================ green chemistry */
const C8_RXN=[
 {k:'h2',n:'Hydrogenation',eq:'C₂H₄ + H₂ → C₂H₆',r:[['ethene',28.05],['hydrogen',2.016]],p:['ethane',30.07],note:'An addition: every atom ends up in the product.'},
 {k:'est',n:'Esterification',eq:'CH₃COOH + C₂H₅OH → CH₃COOC₂H₅ + H₂O',r:[['ethanoic acid',60.05],['ethanol',46.07]],p:['ethyl ethanoate',88.11],note:'A condensation: water is lost.'},
 {k:'sub',n:'Substitution',eq:'C₂H₅Br + NaOH → C₂H₅OH + NaBr',r:[['bromoethane',108.97],['sodium hydroxide',40.00]],p:['ethanol',46.07],note:'Most of the mass leaves as sodium bromide waste.'},
 {k:'boots',n:'Ibuprofen (Boots, 6 steps)',eq:'1960s route, six steps',r:[['all reactants, per mole',515.7]],p:['ibuprofen',206.3],note:'The classic route: published atom economy about 40%.'},
 {k:'bhc',n:'Ibuprofen (BHC, 3 steps)',eq:'1990s catalytic route, three steps',r:[['all reactants, per mole',266.5]],p:['ibuprofen',206.3],note:'Published atom economy about 77%; about 99% if the acetic acid by-product is recovered.'}];
SCENE({id:'green-chemistry',name:'Atom economy',tag:'How much ends up in the product?',
 definition:'Atom economy, proposed by Barry Trost in 1991, asks what share of the mass of all the reactants ends up in the product you want. Atom economy = molar mass of product ÷ total molar mass of reactants × 100%. A reaction can have a high yield and still waste most of its atoms.',
 example:'The original route to the painkiller ibuprofen took six steps with an atom economy of about 40%. The BHC Company’s three-step catalytic route of the 1990s raised it to about 77%, and won a US Presidential Green Chemistry award in 1997.',
 desc:'Choose a reaction. Left: the reactants’ molar masses stacked against the product’s, with the waste shown. Right: atom economies of all five reactions for comparison. Ibuprofen values are the published totals for each route.',
 research:['Trost, B. M. (1991). The atom economy: a search for synthetic efficiency. Science 254, 1471–1477.','Anastas, P. T. & Warner, J. C. (1998). Green Chemistry: Theory and Practice. Oxford University Press.','Cann, M. C. & Connelly, M. E. (2000). Real-World Cases in Green Chemistry. American Chemical Society (the BHC ibuprofen process).'],
 dur:10,hint:'Go through the reactions in order. Which kind of reaction wastes the most atoms?',
 init:()=>({k:'est'}),
 watch(p){return {k:C8_RXN[Math.min(4,Math.floor(p*5))].k}},
 ui:[{choose:C8_RXN.map(r=>[r.k,r.n]),label:'Reaction',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v}},
 draw(s){
  const r=C8_RXN.find(q=>q.k===s.k),tot=sum(r.r.map(q=>q[1])),ae=r.p[1]/tot;let out=heading('Atom economy',28);
  out+=TF(300,56,r.eq,14,C.ink);
  const x0=40,w=110,top=80,hh=220,sc=hh/Math.max(tot,1);let y=top+hh;
  r.r.forEach((q,i)=>{const h=q[1]*sc;y-=h;out+=R(x0,y,w,h,i?tint(C.blue,.45):C.blue,'#fff',2);if(h>18)out+=TF(x0+w/2,y+h/2+5,q[1].toFixed(1),13,'#fff')});
  out+=TF(x0+w/2,top+hh+20,'reactants',13,C.muted);
  const ph=r.p[1]*sc;out+=R(x0+140,top+hh-ph,w,ph,C.green,'none',2)+TF(x0+140+w/2,top+hh-ph/2+5,r.p[1].toFixed(1),13,'#fff');
  if(tot-r.p[1]>.5){const wh=(tot-r.p[1])*sc;out+=R(x0+140,top+hh-ph-wh,w,wh,'#fff',C.coral,2,'stroke-dasharray="5 4"');if(wh>18)out+=TF(x0+140+w/2,top+hh-ph-wh/2+5,'waste',13,C.coral)}
  out+=TF(x0+140+w/2,top+hh+20,'product',13,C.muted);
  out+=C8_lines(40,346,r.r.map(q=>`${q[0]}: ${q[1]} g/mol`).concat([`${r.p[0]}: ${r.p[1]} g/mol`]).slice(0,3),C.muted,13,15);
  out+=counter(320,64,'atom economy',(ae*100).toFixed(1)+'%',ae>.75?C.green:ae>.5?C.amber:C.coral,240);
  C8_RXN.forEach((q,i)=>{const a=q.p[1]/sum(q.r.map(z=>z[1])),y=136+i*34,on=q.k===s.k;
   out+=TF(320,y+14,['Hydrogenation','Esterification','Substitution','Ibuprofen, Boots','Ibuprofen, BHC'][i],13,on?C.ink:C.muted,'start')+R(448,y,96*a,20,on?C.green:C.line,'none',3)+TF(448+96*a+4,y+15,(a*100).toFixed(0)+'%',13,on?C.ink:C.muted,'start')});
  return {svg:out,phase:`${r.n}: ${r.p[1]} g/mol of product from ${tot.toFixed(1)} g/mol of reactants, an atom economy of ${(ae*100).toFixed(1)}%. ${r.note}`};
 }});

const C8_EF=[['Oil refining',.01,.1],['Bulk chemicals','<1',5],['Fine chemicals',5,50],['Pharmaceuticals',25,100]];
SCENE({id:'green-chemistry-efactor',name:'The E-factor',tag:'Kilograms of waste per kilogram of product',
 definition:'Roger Sheldon’s E-factor counts the actual waste: kilograms of waste for every kilogram of product, including solvents and by-products. Unlike atom economy it uses real masses from a real plant, so it captures losses in yield and in work-up too. Lower is better; zero is ideal.',
 example:'Sheldon’s 1992 survey found oil refining produces less than 0.1 kg of waste per kg of product, while pharmaceutical manufacture produced 25 to over 100. Drugs are made in small amounts by many steps, with lots of solvent.',
 desc:'Slide the waste per kilogram of your process. It is placed on a logarithmic scale beside Sheldon’s typical ranges for four sectors.',
 research:['Sheldon, R. A. (1992). Organic synthesis: past, present and future. Chemistry & Industry, 903–906.','Sheldon, R. A. (2017). The E factor 25 years on: the rise of green chemistry and sustainability. Green Chemistry 19, 18–43.'],
 dur:10,hint:'Move the slider from 0.01 to 200 and see which industry your process resembles.',
 init:()=>({lg:1}),
 watch(p){return {lg:Math.round((-2+smooth(p)*4.3)*10)/10}},
 ui:[{range:'lg',label:'Waste per kg product',min:-2,max:2.3,step:.1,get:s=>s.lg,act:'lg',show:v=>{const x=10**Number(v);return (x<1?x.toFixed(2):x.toFixed(x<10?1:0))+' kg'}}],
 on:{lg(s,v){s.lg=Number(v)}},
 draw(s){
  const e=10**s.lg;let out=heading('How much waste per kilogram?',28);
  const A=C8_plot(190,70,370,220,[-2,2.3],[0,4],{xt:[[-2,'0.01'],[-1,'0.1'],[0,'1'],[1,'10'],[2,'100']],xl:'kg of waste per kg of product (log)'});out+=A.svg;
  C8_EF.forEach(([n,lo,hi],i)=>{const l=typeof lo==='number'?Math.log10(lo):-.3,y=A.Y(4-i)+12,h=30;
   out+=R(A.X(l),y,A.X(Math.log10(hi))-A.X(l),h,tint(C.blue,.3+i*.12),'none',4)+TF(180,y+20,n,13,C.ink,'end')});
  out+=L(A.X(s.lg),A.Y(4),A.X(s.lg),A.Y(0),C.coral,2.5);
  out+=TBF(clamp(A.X(s.lg),230,520),62,'your process: '+(e<1?e.toFixed(2):e.toFixed(e<10?1:0))+' kg',14,C.coral);
  const fit=C8_EF.filter(([n,lo,hi])=>e<=hi*1.2&&e>=(typeof lo==='number'?lo:.5)*.8).map(q=>q[0].toLowerCase());
  out+=TF(375,350,fit.length?'Typical of: '+fit.join(', '):'Above the typical ranges.',14,C.ink);
  out+=TF(375,370,'Ranges after Sheldon 1992; bars show typical spans.',13,C.muted);
  return {svg:out,phase:`An E-factor of ${e<1?e.toFixed(2):e.toFixed(e<10?1:0)} means ${e<1?e.toFixed(2):e.toFixed(e<10?1:0)} kg of waste for every kilogram of product. ${fit.length?'That is typical of '+fit.join(' and ')+'.':'That is beyond even typical drug manufacture.'} Solvents are often most of the waste, so recycling them is one of the biggest wins.`};
 }});

const C8_PR=[['Prevent waste','Better not to make waste than to clean it up.'],['Atom economy','Design so most atoms end up in the product.'],['Less hazardous syntheses','Use and make substances of low toxicity.'],['Safer products','Keep the function, lose the toxicity.'],['Safer solvents','Avoid them, or use water and benign ones.'],['Energy efficiency','Run reactions near room temperature and pressure.'],['Renewable feedstocks','Start from plants or waste, not oil, where practical.'],['Fewer derivatives','Avoid protecting groups and extra steps.'],['Catalysis','Catalysts beat reagents used in excess.'],['Design for degradation','Products should break down harmlessly.'],['Real-time analysis','Monitor reactions to prevent pollution.'],['Accident prevention','Choose substances that will not explode or leak.']];
SCENE({id:'green-chemistry-principles',name:'Twelve principles',tag:'Anastas and Warner, 1998',
 definition:'In 1998 Paul Anastas and John Warner set out twelve principles of green chemistry: design chemicals and processes that reduce or remove hazardous substances, rather than treating pollution afterwards. They are guidelines for design, not laws, and they sometimes pull against each other.',
 example:'Swapping a toxic solvent for water uses principle 5; replacing a stoichiometric oxidant with a catalyst uses principle 9. A “green” label still needs a full life-cycle assessment to check the whole process is better.',
 desc:'Press any of the twelve principles to read what it asks for. The highlighted card is explained below the grid.',
 research:['Anastas, P. T. & Warner, J. C. (1998). Green Chemistry: Theory and Practice. Oxford University Press.','Anastas, P. & Eghbali, N. (2010). Green chemistry: principles and practice. Chemical Society Reviews 39, 301–312.'],
 dur:12,hint:'Press a few principles. Which ones does the BHC ibuprofen route follow?',
 init:()=>({i:0}),
 watch(p){return {i:Math.min(11,Math.floor(p*12))}},
 ui:[],
 on:{pick(s,v){s.i=Number(v)}},
 draw(s,f,X){
  let out=heading('The twelve principles',28);
  C8_PR.forEach(([n],i)=>{const x=30+(i%4)*137,y=50+Math.floor(i/4)*72,on=i===s.i;
   out+=C8_btn(X,'pick',i,'Principle '+(i+1)+': '+n,x,y,128,62,[String(i+1),...(n.length>15?[n.slice(0,n.lastIndexOf(' ',15)),n.slice(n.lastIndexOf(' ',15)+1)]:[n])],{bold:true,fill:on?C.greenp:'#fff',stroke:on?C.green:C.line})});
  out+=R(30,276,540,70,C.greenp,'none',8)+TBF(46,302,`${s.i+1}. ${C8_PR[s.i][0]}`,15,C.green,'start')+TF(46,326,C8_PR[s.i][1],14,C.ink,'start');
  out+=TF(300,368,'Principles paraphrased from Anastas & Warner 1998.',13,C.muted);
  return {svg:out,phase:`Principle ${s.i+1}, ${C8_PR[s.i][0].toLowerCase()}: ${C8_PR[s.i][1]}`};
 }});

/* ================================================================ atmospheric chemistry */
SCENE({id:'atmospheric-chemistry',name:'Chlorine eats ozone',tag:'Molina and Rowland, 1974',
 definition:'In 1974 Mario Molina and Sherwood Rowland showed that CFCs, thought harmless, drift up to the stratosphere, where ultraviolet light breaks off chlorine atoms. Each chlorine atom then destroys ozone in a cycle that gives it back unchanged, so one atom can destroy many thousands of ozone molecules before it is locked away.',
 example:'The cycle: Cl + O₃ → ClO + O₂, then ClO + O → Cl + O₂. Net: O₃ + O → 2 O₂, with the chlorine free to go round again. Molina, Rowland and Paul Crutzen shared the 1995 Nobel Prize.',
 desc:'Left: a CFC molecule split by ultraviolet light. Centre: the two-step chlorine cycle. Right: ozone destroyed by a single chlorine atom so far. Press One cycle or Run 1,000 cycles. The chlorine-reservoir switch shows how HCl and ClONO₂ normally lock chlorine away.',
 research:['Molina, M. J. & Rowland, F. S. (1974). Stratospheric sink for chlorofluoromethanes: chlorine atom-catalysed destruction of ozone. Nature 249, 810–812.','Crutzen, P. J. (1970). The influence of nitrogen oxides on the atmospheric ozone content. Quarterly Journal of the Royal Meteorological Society 96, 320–325.','Nobel Prize in Chemistry 1995: Crutzen, Molina and Rowland.'],
 dur:10,hint:'Run a few cycles. The chlorine atom is never used up. Then switch on the reservoir to see what normally stops it.',
 init:()=>({n:0,res:false}),
 watch(p){return {n:Math.round(p*p*5000),res:false}},
 ui:[{b:'One cycle',act:'one'},{b:'Run 1,000 cycles',act:'k'},{choose:[['off','No reservoir'],['on','Reservoir on']],label:'Chlorine reservoirs',get:s=>s.res?'on':'off',act:'res'}],
 on:{one(s){if(!s.res||s.n<40)s.n+=1},k(s){s.n=s.res?Math.max(s.n,40):s.n+1000},res(s,v){s.res=v==='on';if(s.res)s.n=Math.min(s.n,40)}},
 draw(s){
  let out=heading('One chlorine atom, many ozone molecules',28);
  out+=TBF(70,70,'CCl₂F₂',15,C.ink)+TF(70,90,'a CFC',13,C.muted);
  for(let i=0;i<3;i++)out+=P(`M${20+i*14} 104 l6 8 l-6 8 l6 8`,C.purple,2);out+=TF(100,124,'UV',13,C.purple,'start');
  out+=arrow(70,140,70,170,C.ink,2)+Ci(70,190,13,C.coral)+TBF(70,195,'Cl',13,'#fff')+TF(70,224,'free chlorine',13,C.coral);
  const cx=300,cy=196,r=82;out+=Ci(cx,cy,r,'none',C.line,'stroke-dasharray="6 5"');
  out+=arrow(cx+r*.7,cy-r*.72,cx+r*.98,cy-r*.1,C.blue,2.5)+arrow(cx-r*.7,cy+r*.72,cx-r*.98,cy+r*.1,C.blue,2.5);
  out+=Ci(cx,cy-r,14,C.coral)+TBF(cx,cy-r+5,'Cl',13,'#fff');out+=Ci(cx,cy+r,16,C.amber)+TBF(cx,cy+r+5,'ClO',13,'#fff');
  out+=TF(cx+r+8,cy-34,'+ O₃',14,C.ink,'start')+TF(cx+r+8,cy-16,'→ O₂',14,C.muted,'start');
  out+=TF(cx-r-8,cy+22,'+ O',14,C.ink,'end')+TF(cx-r-8,cy+40,'→ O₂',14,C.muted,'end');
  out+=TBF(cx,cy-4,'net:',13,C.muted)+TBF(cx,cy+16,'O₃ + O → 2 O₂',14,C.ink);
  out+=counter(440,68,'ozone destroyed',s.n.toLocaleString('en-GB'),C.coral,140);
  out+=counter(440,124,'chlorine atoms used up','0',C.green,140);
  if(s.res)out+=C8_lines(440,206,['Reservoir on: Cl joins','HCl or ClONO₂ and the','chain stops, here after','40 cycles (illustrative).'],C.ink,13,17);
  else out+=C8_lines(440,206,['Often quoted: one Cl','destroys around 100,000','ozone molecules before','it is locked away.'],C.ink,13,17);
  out+=TF(300,360,'Cycle counts are illustrative; real chain lengths depend on altitude and season.',13,C.muted);
  return {svg:out,phase:s.res?`With reservoirs on, the chlorine is soon captured as HCl or chlorine nitrate and the chain stops after ${s.n} cycles. Over Antarctica, ice clouds release it again in spring, which is why the ozone hole forms there.`:`${s.n.toLocaleString('en-GB')} cycles: ${s.n.toLocaleString('en-GB')} ozone molecules destroyed and the chlorine atom is still free. A catalyst is not used up, which is why a little chlorine does so much harm.`};
 }});

// Approximate Antarctic ozone-hole area (million km², September–October mean) with and without the Montreal Protocol.
function C8_hole(y,proto){if(y<1978)return 0;if(!proto)return Math.min(60,0.9*(y-1978)+.012*(y-1978)**2);
 if(y<=2000)return 26*smooth((y-1978)/22);if(y<=2015)return 26-.1*(y-2000);return Math.max(0,24.5*(1-(y-2015)/51))}
SCENE({id:'atmospheric-chemistry-hole',name:'The ozone hole and its repair',tag:'The Montreal Protocol works',
 definition:'In 1985 Joe Farman, Brian Gardiner and Jonathan Shanklin of the British Antarctic Survey reported that spring ozone over Antarctica had fallen by about a third. Susan Solomon and colleagues showed how polar ice clouds free chlorine. The 1987 Montreal Protocol phased out CFCs, and the ozone layer is now slowly recovering.',
 example:'The World Meteorological Organization’s 2022 assessment projects Antarctic ozone returning to 1980 values around 2066. Studies of “the world avoided” estimate that without the Protocol two-thirds of the ozone layer would have been gone by 2065.',
 desc:'The approximate size of the Antarctic ozone hole each spring from 1960 to 2070, with the Montreal Protocol (blue) and in a world without it (coral, dashed). Slide the year; key dates are marked.',
 research:['Farman, J. C., Gardiner, B. G. & Shanklin, J. D. (1985). Large losses of total ozone in Antarctica reveal seasonal ClOx/NOx interaction. Nature 315, 207–210.','Solomon, S., Garcia, R. R., Rowland, F. S. & Wuebbles, D. J. (1986). On the depletion of Antarctic ozone. Nature 321, 755–758.','Newman, P. A. et al. (2009). What would have happened to the ozone layer if chlorofluorocarbons (CFCs) had not been regulated? Atmospheric Chemistry and Physics 9, 2113–2128.','WMO (2022). Scientific Assessment of Ozone Depletion: 2022. GAW Report 278.'],
 dur:12,hint:'Slide through the years with and without the Protocol. Notice the long delay: CFCs last decades in the air.',
 init:()=>({y:2025,proto:true}),
 watch(p){return {y:Math.round(1960+p*110),proto:true}},
 ui:[{range:'y',label:'Year',min:1960,max:2070,step:1,get:s=>s.y,act:'y'},{choose:[['on','With the Protocol'],['off','Without it']],label:'World',get:s=>s.proto?'on':'off',act:'proto'}],
 on:{y(s,v){s.y=Number(v)},proto(s,v){s.proto=v==='on'}},
 draw(s){
  let out=heading('Antarctic ozone hole, each spring',28);
  const A=C8_plot(70,60,490,230,[1960,2070],[0,60],{xt:[[1960,'1960'],[1987,'1987'],[2000,'2000'],[2030,'2030'],[2066,'2066']],yt:[[20,'20'],[40,'40'],[60,'60']],yl:'million km² (approximate)'});out+=A.svg;
  out+=P(C8_path(range(111).map(i=>[A.X(1960+i),A.Y(C8_hole(1960+i,false))])),C.coral,2,'none','stroke-dasharray="6 5"');
  out+=P(C8_path(range(111).map(i=>[A.X(1960+i),A.Y(C8_hole(1960+i,true))])),C.blue,3);
  [[1985,'hole reported'],[1987,'Montreal Protocol']].forEach(([y,t],i)=>{out+=L(A.X(y),A.Y(60),A.X(y),A.Y(0),C.grid,1.5)+TF(A.X(y)+(i?6:-6),A.Y(56)+i*16,t,13,C.muted,i?'start':'end')});
  const v=C8_hole(s.y,s.proto);out+=L(A.X(s.y),A.Y(60),A.X(s.y),A.Y(0),C.ink,1.5)+Ci(A.X(s.y),A.Y(v),7,s.proto?C.blue:C.coral);
  out+=TF(70,328,'Antarctica ≈ 14 million km²; dashed line capped at 60.',13,C.muted,'start');
  out+=TBF(560,354,`${s.y}: about ${v.toFixed(0)} million km²${s.proto?'':' (world avoided)'}`,14,C.ink,'end');
  out+=TF(70,374,'Smoothed and approximate, after WMO 2022 and Newman et al. 2009.',13,C.muted,'start');
  return {svg:out,phase:s.proto?(v<.5?`${s.y}: no ozone hole yet; CFCs are building up in the atmosphere.`:s.y<1995?`${s.y}: the hole is growing fast, to about ${v.toFixed(0)} million km², as CFCs build up in the stratosphere.`:s.y<2015?`${s.y}: the hole is near its largest, about ${v.toFixed(0)} million km², even though CFC production was cut from 1987. CFCs take decades to leave the air.`:`${s.y}: the hole is slowly shrinking, to about ${v.toFixed(0)} million km². Recovery to 1980 levels is projected around 2066.`):`In the world without the Protocol, the hole would have kept growing: about ${v.toFixed(0)} million km² by ${s.y}. The Montreal Protocol is the most successful environmental treaty so far.`};
 }});

SCENE({id:'atmospheric-chemistry-ocean',name:'An acidifying ocean',tag:'CO₂ dissolves too',
 definition:'About a quarter of the carbon dioxide we emit dissolves in the ocean. There it forms carbonic acid, which releases hydrogen ions: CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻. More hydrogen ions mean lower pH, and they also mop up carbonate ions that corals and shellfish need to build their skeletons.',
 example:'Surface ocean pH has fallen from about 8.2 before industry to about 8.1 today. Because pH is logarithmic, that 0.1 drop is roughly 25–30% more hydrogen ions. The ocean is still alkaline; “acidification” means moving towards acid.',
 desc:'Slide atmospheric carbon dioxide. A simplified relation gives surface ocean pH and the change in hydrogen ions from pre-industrial; the bars show the balance of dissolved carbon forms. Pre-industrial (280 ppm) and recent (about 420 ppm) levels are marked.',
 research:['Keeling, C. D. (1960). The concentration and isotopic abundances of carbon dioxide in the atmosphere. Tellus 12, 200–203.','Caldeira, K. & Wickett, M. E. (2003). Anthropogenic carbon and ocean pH. Nature 425, 365.','Doney, S. C., Fabry, V. J., Feely, R. A. & Kleypas, J. A. (2009). Ocean acidification: the other CO₂ problem. Annual Review of Marine Science 1, 169–192.'],
 dur:10,hint:'Move from 280 to 420 ppm, then on to 800. How much do hydrogen ions rise?',
 init:()=>({co2:420}),
 watch(p){return {co2:Math.round(280+smooth(p)*620)}},
 ui:[{range:'co2',label:'Atmospheric CO₂',min:280,max:900,step:10,get:s=>s.co2,act:'co2',show:v=>v+' ppm'}],
 on:{co2(s,v){s.co2=Number(v)}},
 draw(s){
  const pH=8.2-.568*Math.log10(s.co2/280),hp=10**(8.2-pH)-1,co3=1/(1+hp*1.6);let out=heading('More CO₂, lower pH',28);
  out+=TF(300,60,'CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻',15,C.ink);
  const A=C8_plot(70,92,260,200,[280,900],[7.7,8.25],{xt:[[280,'280'],[420,'420'],[600,'600'],[900,'900']],yt:[[7.7,'7.7'],[7.9,'7.9'],[8.1,'8.1'],[8.25,'8.25']],xl:'atmospheric CO₂ (ppm)',yl:'surface ocean pH'});out+=A.svg;
  out+=P(C8_path(range(63).map(i=>{const c=280+i*10;return [A.X(c),A.Y(8.2-.568*Math.log10(c/280))]})),C.blue,2.5);
  [280,420].forEach(c=>out+=L(A.X(c),A.Y(8.25),A.X(c),A.Y(7.7),C.grid,1.5,'stroke-dasharray="4 4"'));
  out+=Ci(A.X(s.co2),A.Y(pH),7,C.coral);
  out+=counter(370,92,'surface pH (simplified)',pH.toFixed(2),C.ink,190);
  out+=counter(370,148,'hydrogen ions vs 1850','+'+Math.round(hp*100)+'%',hp>.4?C.coral:C.amber,190);
  out+=TF(370,222,'carbonate ions available',13,C.muted,'start');
  out+=R(370,232,190,22,'#fff',C.line,4)+R(370,232,190*co3,22,C.green,'none',4);
  out+=TF(370,272,'for shells and coral (sketch)',13,C.muted,'start');
  out+=TF(300,356,'pH relation fitted through 8.2 at 280 ppm and 8.1 at 420 ppm; ignores temperature and mixing.',13,C.muted);
  return {svg:out,phase:`At ${s.co2} ppm the surface ocean pH is about ${pH.toFixed(2)}, with ${Math.round(hp*100)}% more hydrogen ions than before industry. The extra hydrogen ions also combine with carbonate, leaving less for corals, oysters and plankton to build shells.`};
 }});

/* ================================================================ computational chemistry */
const C8_H2={hl:{n:'Heitler–London, 1927',De:3.14,re:.87,a:1.7,col:C.amber},ex:{n:'Accurate (Kołos & Wolniewicz)',De:4.75,re:.741,a:1.94,col:C.blue}};
const C8_morse=(m,r)=>m.De*(1-Math.exp(-m.a*(r-m.re)))**2-m.De;
SCENE({id:'computational-chemistry',name:'Calculating a bond',tag:'Hydrogen, from Heitler–London to exact',
 definition:'Quantum chemistry calculates molecules from the Schrödinger equation. In 1927 Walter Heitler and Fritz London gave the first quantum explanation of the bond in hydrogen: sharing two electrons lowers the energy. Their simple calculation got the bond length roughly right but only about two-thirds of the bond energy. Better methods later matched experiment almost exactly.',
 example:'Heitler and London found a binding energy of about 3.1 eV at 0.87 Å. Kołos and Wolniewicz’s calculations in the 1960s gave about 4.75 eV at 0.741 Å, matching spectroscopy so closely that they prompted a re-measurement.',
 desc:'Energy of two hydrogen atoms against the distance between them, for the 1927 approximation and an accurate calculation. Drag the distance to read both energies; zero is two separate atoms. Curves are Morse fits to each method’s published bond length and energy.',
 research:['Heitler, W. & London, F. (1927). Wechselwirkung neutraler Atome und homöopolare Bindung nach der Quantenmechanik. Zeitschrift für Physik 44, 455–472.','Kołos, W. & Wolniewicz, L. (1968). Improved theoretical ground-state energy of the hydrogen molecule. Journal of Chemical Physics 49, 404–410.','Morse, P. M. (1929). Diatomic molecules according to the wave mechanics. Physical Review 34, 57–64.'],
 dur:10,hint:'Find the bottom of each curve. How much of the true bond energy did the 1927 calculation capture?',
 init:()=>({r:.74}),
 watch(p){return {r:Math.round((.45+smooth(p)*2.3)*100)/100}},
 ui:[{range:'r',label:'H–H distance',min:.4,max:3,step:.01,get:s=>s.r,act:'r',show:v=>Number(v).toFixed(2)+' Å'}],
 on:{r(s,v){s.r=Number(v)}},
 draw(s){
  let out=heading('Energy of the H₂ bond',28);
  const A=C8_plot(80,60,300,250,[.4,3],[-5.2,3],{xt:[[.5,'0.5'],[1,'1.0'],[2,'2.0'],[3,'3.0 Å']],yt:[[-5,'−5'],[-3,'−3'],[0,'0'],[2,'2 eV']],xl:'distance between the nuclei',yl:'energy (eV)'});out+=A.svg;
  out+=L(A.X(.4),A.Y(0),A.X(3),A.Y(0),C.grid,1.5,'stroke-dasharray="4 4"');
  for(const k of ['hl','ex']){const m=C8_H2[k];out+=P(C8_path(range(131).map(i=>{const r=.4+i*.02;return [A.X(r),A.Y(clamp(C8_morse(m,r),-5.2,3))]})),m.col,2.5);
   out+=Ci(A.X(s.r),A.Y(clamp(C8_morse(m,s.r),-5.2,3)),6,m.col)}
  out+=L(A.X(s.r),A.Y(3),A.X(s.r),A.Y(-5.2),C.ink,1.2);
  const eh=C8_morse(C8_H2.hl,s.r),ee=C8_morse(C8_H2.ex,s.r);
  out+=Ci(410,76,10,'#fff',C.ink)+Ci(410+Math.min(150,s.r*48),76,10,'#fff',C.ink)+TF(410,81,'H',13,C.ink)+TF(410+Math.min(150,s.r*48),81,'H',13,C.ink);
  out+=counter(400,104,'1927 approximation',eh.toFixed(2).replace('-','−')+' eV',C.amber,170);
  out+=counter(400,160,'accurate calculation',ee.toFixed(2).replace('-','−')+' eV',C.blue,170);
  out+=C8_lines(400,236,['Bond energy captured','in 1927: 3.14 ÷ 4.75','= '+Math.round(3.14/4.75*100)+'%'],C.ink,13,18);
  out+=TF(300,362,'Morse curves fitted to each method’s bond length and energy.',13,C.muted);
  return {svg:out,phase:`At ${s.r.toFixed(2)} Å the accurate energy is ${ee.toFixed(2).replace('-','−')} eV and the 1927 estimate ${eh.toFixed(2).replace('-','−')} eV. Both curves dip into a well: sharing electrons makes the pair more stable than two separate atoms. The 1927 well is too shallow and its minimum too far out, but it explained, for the first time, why a covalent bond exists.`};
 }});

const C8_SC=[['DFT (typical)',3,C.green],['Hartree–Fock',4,C.blue],['MP2',5,C.purple],['CCSD(T)',7,C.coral]];
SCENE({id:'computational-chemistry-scaling',name:'Why accuracy is expensive',tag:'Cost grows as a power of size',
 definition:'Every quantum chemistry method trades accuracy against cost. The cost grows roughly as a power of the size of the molecule, N. Hartree–Fock grows like N⁴, the very accurate “gold standard” CCSD(T) like N⁷. Density functional theory (DFT), developed from Walter Kohn’s work, is usually near N³ in practice and gives good accuracy for its cost, which is why it is the workhorse of chemistry today.',
 example:'Double the size of a molecule and a CCSD(T) calculation takes 2⁷ = 128 times longer; a DFT calculation about 8 times longer. Walter Kohn and John Pople shared the 1998 Nobel Prize for density functional theory and computational methods.',
 desc:'Choose the size of the calculation (number of basis functions, which grows with the number of atoms). Bars give the time on a logarithmic scale if each method took one second at 50 basis functions. Real times depend greatly on the software and computer.',
 research:['Hohenberg, P. & Kohn, W. (1964). Inhomogeneous electron gas. Physical Review 136, B864–B871.','Kohn, W. & Sham, L. J. (1965). Self-consistent equations including exchange and correlation effects. Physical Review 140, A1133–A1138.','Raghavachari, K., Trucks, G. W., Pople, J. A. & Head-Gordon, M. (1989). A fifth-order perturbation comparison of electron correlation theories. Chemical Physics Letters 157, 479–483.','Nobel Prize in Chemistry 1998: Kohn and Pople.'],
 dur:10,hint:'Slide the size up. When does CCSD(T) stop being practical?',
 init:()=>({lg:2.3}),
 watch(p){return {lg:Math.round((1.7+smooth(p)*1.3)*20)/20}},
 ui:[{range:'lg',label:'Basis functions',min:1.7,max:3,step:.05,get:s=>s.lg,act:'lg',show:v=>Math.round(10**Number(v))+''}],
 on:{lg(s,v){s.lg=Number(v)}},
 draw(s){
  const N=10**s.lg;let out=heading('Bigger molecules, much longer waits',28);
  const fmtT=t=>t<60?t.toFixed(t<10?1:0)+' s':t<3600?(t/60).toFixed(0)+' min':t<86400*2?(t/3600).toFixed(1)+' h':t<3.15e7*2?(t/86400).toFixed(0)+' days':(t/3.15e7).toFixed(0)+' years';
  const A=C8_plot(170,58,390,186,[-1,10],[0,4],{xt:[[0,'1 s'],[1.778,'1 min'],[3.556,'1 h'],[4.937,'1 day'],[7.5,'1 yr']],xl:'time (log scale)'});out+=A.svg;
  C8_SC.forEach(([n,pw,col],i)=>{const t=(N/50)**pw,y=A.Y(4-i)+10,lt=Math.log10(t);
   out+=R(A.X(-1),y,Math.max(2,A.X(clamp(lt,-1,10))-A.X(-1)),30,col,'none',4);
   out+=TF(160,y+20,n,13,C.ink,'end')+TF(clamp(A.X(lt)+6,180,520),y+20,fmtT(t),13,C.ink,'start')});
  out+=TBF(300,304,`${Math.round(N)} basis functions`,15,C.ink);
  out+=TF(300,330,`Double the size: DFT ×8, Hartree–Fock ×16, MP2 ×32, CCSD(T) ×128.`,13,C.ink);
  out+=TF(300,354,'Illustrative scaling; each method set to 1 s at 50 basis functions.',13,C.muted);
  return {svg:out,phase:`With ${Math.round(N)} basis functions, a CCSD(T) calculation that took a second at 50 would take about ${fmtT((N/50)**7)}, while DFT would take about ${fmtT((N/50)**3)}. That steep cost is why DFT is used for most real molecules, and why its approximations matter.`};
 }});

const C8_CASP=[[2008,'CASP8',45],[2010,'CASP9',44],[2012,'CASP10',45],[2014,'CASP11',48],[2016,'CASP12',52],[2018,'CASP13',68],[2020,'CASP14',92.4]];
const C8_LIM=[['Static pictures','It predicts a structure, not the folding process or motion.'],['Disordered regions','Floppy parts of proteins come out as low-confidence spaghetti.'],['Partners and drugs','Early versions ignored other molecules; AlphaFold 3 (2024) adds some, with less certainty.'],['Not the end of experiment','Predictions still need checking against measured structures.']];
SCENE({id:'computational-chemistry-alphafold',name:'Predicting protein shapes',tag:'AlphaFold and its limits',
 definition:'Most proteins’ chains of amino acids fold into a precise 3D shape that decides what they do; some proteins or regions are intrinsically disordered and shift between many shapes. Predicting the shape from the sequence was a fifty-year challenge, tested every two years in the blind CASP competition. In 2020 DeepMind’s AlphaFold 2, a machine-learning system trained on known structures, predicted many shapes about as accurately as experiments measure them.',
 example:'At CASP14 (2020) AlphaFold 2 reached a median score of about 92 on the 0–100 GDT scale, where around 90 is considered competitive with experiment. Demis Hassabis and John Jumper shared the 2024 Nobel Prize with David Baker, who designs new proteins.',
 desc:'Left: approximate median accuracy (GDT) of the best group in each CASP round on the hardest targets; the CASP14 bar is the published median across all targets (87.0 on the hardest). Press a limitation card on the right to read what AlphaFold does not do.',
 research:['Jumper, J. et al. (2021). Highly accurate protein structure prediction with AlphaFold. Nature 596, 583–589.','Moult, J. et al. (1995). A large-scale experiment to assess protein structure prediction methods. Proteins 23, ii–v (the start of CASP).','Abramson, J. et al. (2024). Accurate structure prediction of biomolecular interactions with AlphaFold 3. Nature 630, 493–500.','Nobel Prize in Chemistry 2024: Baker, Hassabis and Jumper.'],
 dur:10,hint:'Look at the jump after 2016. Then read the limits: a prediction is a hypothesis to test.',
 init:()=>({lim:0}),
 watch(p){return {lim:Math.min(3,Math.floor(p*4))}},
 ui:[],
 on:{lim(s,v){s.lim=Number(v)}},
 draw(s,f,X){
  let out=heading('A fifty-year problem, largely solved',28);
  const A=C8_plot(60,64,280,226,[0,7],[0,100],{yt:[[0,'0'],[50,'50'],[90,'90'],[100,'100']],yl:'best median accuracy (GDT)'});out+=A.svg;
  out+=L(A.X(0),A.Y(90),A.X(7),A.Y(90),C.green,1.5,'stroke-dasharray="5 4"')+TF(A.X(0)+6,A.Y(90)-6,'≈ as good as experiment',13,C.green,'start');
  C8_CASP.forEach(([y,n,v],i)=>{const x=A.X(i+.15),w=A.X(.7)-A.X(0),af=y>=2018;
   out+=R(x,A.Y(v),w,A.Y(0)-A.Y(v),af?C.blue:C.line,'none',3)+TF(x+w/2,A.Y(0)+17,"'"+String(y).slice(2),13,C.muted)});
  out+=TF(60,334,'Pre-2020 bars approximate;',13,C.muted,'start')+TF(60,352,'CASP14 median as published.',13,C.muted,'start');
  out+=TF(60,370,'Blue: DeepMind’s AlphaFold.',13,C.blue,'start');
  C8_LIM.forEach(([t],i)=>{out+=C8_btn(X,'lim',i,'Limitation: '+t,370,62+i*48,200,40,[t],{fill:i===s.lim?C.amberp:'#fff',stroke:i===s.lim?C.amber:C.line})});
  out+=R(370,262,200,92,C.amberp,'none',8);
  const words=C8_LIM[s.lim][1].split(' '),ln=[''];words.forEach(w=>{if((ln[ln.length-1]+' '+w).length>27)ln.push(w);else ln[ln.length-1]=(ln[ln.length-1]+' '+w).trim()});
  out+=C8_lines(380,284,ln.slice(0,4),C.ink,13,17);
  return {svg:out,phase:`Accuracy crept up for a decade, then jumped with AlphaFold in 2018 and again in 2020, to a median near 92. Limit: ${C8_LIM[s.lim][0].toLowerCase()}. ${C8_LIM[s.lim][1]}`};
 }});
