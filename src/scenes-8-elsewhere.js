/* ===================== Abiogenesis era 8 · Life elsewhere ===================== */
// Habitable zones, icy moons, biosignatures and their false alarms, and what we would count as alive.
// Every picture is a pure function of state (and X). No randomness is needed in this era.
const A8_ST={demonstrated:[C.green,'#e3f2ec'],plausible:[C.amber,'#fbefd5'],speculative:[C.purple,'#ece6f6']};
function A8_tag(st){const [c,bg]=A8_ST[st],w=st.length*7.4+26;return R(592-w,354,w,22,bg,c,11)+TF(592-w/2,369.5,st,13,c)}
function A8_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+18,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||36),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
function A8_btn(X,act,arg,label,x,y,w,h,text,o={}){
 const lines=Array.isArray(text)?text:[text];
 const inner=R(x,y,w,h,o.fill||'#fff',o.stroke||C.line,8)+lines.map((t,i)=>(o.bold&&i===0?TBF:TF)(x+w/2,y+h/2+5+(i-(lines.length-1)/2)*17,t,o.size||13,o.ink||C.ink)).join('');
 return hit(X,act,arg,label,inner);
}
function A8_wrap(t,n){const out=[''];t.split(' ').forEach(w=>{const c=out[out.length-1];if(c&&(c+' '+w).length>n)out.push(w);else out[out.length-1]=c?c+' '+w:w});return out}
const A8_lines=(x,y,lines,col=C.ink,size=13,gap=18)=>lines.map((l,i)=>TF(x,y+i*gap,l,size,col,'start')).join('');
// Complementary error function (Numerical Recipes erfcc, fractional error below 1.2e-7).
function A8_erfc(x){const z=Math.abs(x),t=1/(1+.5*z);const r=t*Math.exp(-z*z-1.26551223+t*(1.00002368+t*(.37409196+t*(.09678418+t*(-.18628806+t*(.27886807+t*(-1.13520398+t*(1.48851587+t*(-.82215223+t*.17087277)))))))));return x>=0?r:2-r}
const A8_pOf=sig=>A8_erfc(sig/Math.SQRT2);// two-sided
function A8_sigOf(p){let lo=0,hi=10;for(let i=0;i<80;i++){const m=(lo+hi)/2;if(A8_pOf(m)>p)lo=m;else hi=m}return (lo+hi)/2}

/* ---------------------------------------------------------------- the habitable zone */
const A8_STARS={M:{n:'Red dwarf (M)',L:.02,c:'#d9534f'},K:{n:'Orange dwarf (K)',L:.3,c:'#e8913a'},G:{n:'Sun-like (G)',L:1,c:'#f2c230'},F:{n:'Hotter (F)',L:3,c:'#f4e7a6'}};
const A8_HZ_IN=.99,A8_HZ_OUT=1.70;// AU for the Sun, conservative limits (Kopparapu et al. 2013)
const A8_teq=(L,d,A=.3)=>278.6*Math.pow(L,.25)/Math.sqrt(d)*Math.pow(1-A,.25);
SCENE({id:'habitable-zone',name:'The habitable zone',tag:'Where liquid water could last',
 definition:'A star’s habitable zone is the range of orbits where a rocky planet with a suitable atmosphere could keep liquid water on its surface. Too close and water boils away in a runaway greenhouse; too far and even a thick carbon dioxide atmosphere cannot stop it freezing.',
 example:'For the Sun the conservative zone runs from about 0.99 to 1.7 times Earth’s distance; for a dim red dwarf it shrinks to a few hundredths of that.',
 desc:'Top-down view of a star, its habitable zone (green ring) and a planet. Choose the star and move the planet. The panel gives the starlight the planet receives and its equilibrium temperature with an Earth-like reflectivity (albedo 0.3), before any greenhouse warming.',
 research:'Kasting, J. F., Whitmire, D. P. & Reynolds, R. T. (1993). Habitable zones around main sequence stars. Icarus 101, 108–128. Kopparapu, R. K. et al. (2013). Habitable zones around main-sequence stars: new estimates. Astrophysical Journal 765, 131 (0.99–1.70 AU for the Sun, conservative). Here the zone is scaled by √L, a simplification: cooler stars shift it slightly outward.',
 dur:12,hint:'Pick each star and find its zone. Notice how close a planet must be to a red dwarf.',
 init:()=>({st:'G',d:0}),
 watch(p){return {st:p<.6?'G':'M',d:p<.6?Math.log10(.5)+(p/.6)*(Math.log10(2.5)-Math.log10(.5)):Math.log10(.06)+((p-.6)/.4)*(Math.log10(.4)-Math.log10(.06))}},
 ui:[{choose:Object.keys(A8_STARS).map(k=>[k,A8_STARS[k].n]),label:'Star',get:s=>s.st,act:'st'},{range:'d',label:'Planet distance (log)',min:-1.7,max:.7,step:.01,get:s=>s.d,act:'d',show:v=>Math.pow(10,v).toFixed(Math.pow(10,v)<.1?3:2)+' AU'}],
 on:{st(s,v){s.st=v;return 'keep'},d(s,v){s.d=Number(v)}},
 draw(s){
  const st=A8_STARS[s.st],d=Math.pow(10,s.d),rin=A8_HZ_IN*Math.sqrt(st.L),rout=A8_HZ_OUT*Math.sqrt(st.L),k=118/rout,cx=170,cy=200;
  const Sx=st.L/(d*d),T=A8_teq(st.L,d),zone=d<rin?'too hot':d>rout?'too cold':'in the zone';
  let out=heading('The habitable zone',26);
  out+=R(20,46,300,300,'#141f29','none',8);
  out+=`<circle cx="${cx}" cy="${cy}" r="${fmt((rin*k+rout*k)/2)}" fill="none" stroke="#2c8a5c" stroke-opacity=".55" stroke-width="${fmt(rout*k-rin*k)}"/>`;
  if(s.st==='G')[['Venus',.723],['Earth',1],['Mars',1.524]].forEach(([n,a])=>{out+=Ci(cx,cy,a*k,'none','#5d7685','stroke-dasharray="3 4"')});
  out+=Ci(cx,cy,Math.max(5,Math.min(14,9*Math.pow(st.L,.25))),st.c);
  const rp=Math.min(146,d*k);out+=Ci(cx,cy,rp,'none','#8fb3c7','stroke-width="1.2"')+Ci(cx+rp*Math.cos(-.6),cy+rp*Math.sin(-.6),6,zone==='in the zone'?'#7fd3a8':zone==='too hot'?'#f08a6a':'#9fc6e8','#fff');
  if(d*k>146)out+=TF(cx,330,'planet beyond the edge of this view',13,'#c8d6df');
  out+=TF(170,66,'green ring: habitable zone',13,'#9fe0bf');
  out+=TBF(340,74,st.n,15,C.ink,'start')+TF(340,94,'brightness '+st.L+' × the Sun',13,C.muted,'start');
  out+=TF(340,124,'Zone: '+rin.toFixed(rin<.1?3:2)+'–'+rout.toFixed(rout<.1?3:2)+' AU',13,C.ink,'start');
  out+=TF(340,148,'Planet at '+d.toFixed(d<.1?3:2)+' AU',13,C.ink,'start');
  out+=TF(340,172,'Starlight: '+(Sx>=10?Sx.toFixed(0):Sx.toFixed(2))+' × what Earth gets',13,C.ink,'start');
  out+=TF(340,196,'Equilibrium temperature:',13,C.ink,'start')+TBF(340,218,Math.round(T)+' K ('+Math.round(T-273.15)+' °C)',15,C.ink,'start');
  out+=TBF(340,250,zone,16,zone==='in the zone'?C.green:zone==='too hot'?C.coral:C.blue,'start');
  out+=A8_lines(340,280,['Earth’s equilibrium value is','255 K; greenhouse gases lift it','to about 288 K (third scene).'],C.muted,13,17);
  out+=A8_tag('demonstrated');
  return {svg:out,phase:`A ${st.n.toLowerCase()} planet at ${d.toFixed(d<.1?3:2)} AU receives ${Sx.toFixed(2)} times Earth’s starlight: ${zone}. The zone is a starting point for where to look, not a guarantee of water or of life.`};
 },
 three(s,f,X,project){
  const st=A8_STARS[s.st],d=Math.pow(10,s.d),rin=A8_HZ_IN*Math.sqrt(st.L),rout=A8_HZ_OUT*Math.sqrt(st.L),k=1/rout,R0=Math.min(1.6,d*k),P3=project([-1.15,1.15,-1.15,1.15,-.15,.25]);let out='';
  const ring=(r,n=48)=>range(n+1).map(i=>{const a=i/n*Math.PI*2;return [Math.cos(a)*r,Math.sin(a)*r,0]});
  const ri=ring(rin*k),ro=ring(1);for(let i=0;i<48;i++)out+=poly3([ri[i],ri[i+1],ro[i+1],ro[i]],P3,'#bfe6cf','none');
  const po=ring(R0);for(let i=0;i<48;i++)out+=line3(po[i],po[i+1],P3,'#7d9aab',1.4);
  out+=line3([0,0,-.15],[0,0,.25],P3,C.grid,1);
  const ps=P3([0,0,0]);out+=Ci(ps[0],ps[1],10,st.c,'#b88a00');
  const pp=P3([R0*Math.cos(-.6),R0*Math.sin(-.6),0]);out+=Ci(pp[0],pp[1],7,C.blue,'#fff');
  return {svg:out,title:'The habitable zone in its plane',caption:'The green band is the zone; the grey circle is the planet’s orbit. Turn the view: the zone is a ring in the plane of the orbits.'};
 }});

/* ---- worlds on the starlight scale ---- */
const A8_WORLDS=[
 {n:'Venus',lab:[88,'middle',0],S:1.91,hz:false,rock:'yes',atm:'thick CO₂, 92 bar',lock:'no (very slow spin)',d:'A runaway greenhouse: surface about 464 °C. It shows what happens just inside the inner edge.'},
 {n:'Earth',lab:[88,'middle',0],S:1,hz:true,rock:'yes',atm:'N₂ and O₂, 1 bar',lock:'no',d:'The only world known to host life, with liquid water for at least 4 billion years.'},
 {n:'Mars',lab:[104,'middle',0],S:.43,hz:true,rock:'yes',atm:'thin CO₂, 0.006 bar',lock:'no',d:'Inside the conservative zone, but small: it lost most of its atmosphere and its water is now frozen or underground.'},
 {n:'Proxima b',lab:[88,'end',-6],S:.65,hz:true,rock:'probably',atm:'unknown',lock:'probably',d:'The nearest exoplanet (4.2 light years), at least about 1.1 Earth masses, orbiting a flaring red dwarf every 11.2 days.'},
 {n:'TRAPPIST-1e',lab:[104,'start',6],S:.66,hz:true,rock:'yes',atm:'unknown',lock:'probably',d:'One of seven Earth-sized planets around an ultracool dwarf; JWST found no thick atmosphere on the two innermost planets.'},
 {n:'K2-18b',lab:[104,'middle',0],S:1.3,hz:true,rock:'no',atm:'hydrogen-rich',lock:'possibly',d:'About 2.6 Earth radii: a mini-Neptune, perhaps with an ocean under hydrogen (a proposed “hycean” world). Starlight value approximate.'}];
SCENE({id:'habitable-zone-worlds',name:'Worlds on the starlight scale',tag:'In the zone is not the same as habitable',
 definition:'Comparing planets by the starlight they receive (relative to Earth) puts worlds around different stars on one scale. Being in the habitable zone is only the first test: size, atmosphere, tidal locking and stellar flares also matter.',
 example:'Mars sits inside the Sun’s conservative habitable zone, yet its surface is a frozen desert.',
 desc:'Six worlds on a logarithmic scale of starlight, with the habitable zone for a Sun-like star shaded (it shifts somewhat for cooler stars). Press a world for its checklist.',
 research:'Kopparapu et al. (2013). ApJ 765, 131. Anglada-Escudé, G. et al. (2016). A terrestrial planet candidate in a temperate orbit around Proxima Centauri. Nature 536, 437–440. Gillon, M. et al. (2017). Nature 542, 456–460 (TRAPPIST-1). Greene, T. P. et al. (2023). Nature 618, 39–42 and Zieba, S. et al. (2023). Nature 620, 746–749 (no thick atmospheres on TRAPPIST-1b and c). Madhusudhan, N. et al. (2021). ApJ 918, 1 (hycean worlds).',
 dur:12,hint:'Press Mars and Proxima b. What else, besides starlight, would a planet need?',
 init:()=>({sel:2}),
 watch(p){return {sel:Math.min(5,Math.floor(p*6))}},
 ui:[],
 on:{sel(s,v){s.sel=Number(v);return 'keep'}},
 draw(s,f,X){
  const x0=40,x1=560,lx=v=>x0+(Math.log10(v)-Math.log10(.2))/(Math.log10(3)-Math.log10(.2))*(x1-x0);let out=heading('Six worlds on one scale of starlight',26);
  out+=R(lx(.36),56,lx(1.1)-lx(.36),60,'#e3f2ec','none',4)+TF((lx(.36)+lx(1.1))/2,72,'Sun-like habitable zone',13,C.green);
  out+=L(x0,116,x1,116,C.line,2);[.2,.5,1,2,3].forEach(v=>{out+=L(lx(v),112,lx(v),120,C.line,1.5)+TF(lx(v),136,v+'×',13,C.muted)});
  out+=TF(300,154,'starlight received, relative to Earth (log scale) · more starlight to the right',13,C.muted);
  A8_WORLDS.forEach((w,i)=>{const x=lx(w.S),[dy,anc,dx]=w.lab;out+=hit(X,'sel',i,w.n,Ci(x,116,i===s.sel?8:6,i===s.sel?C.blue:'#fff',C.blue)+TF(x+dx,dy,w.n,13,i===s.sel?C.ink:C.muted,anc))});
  const w=A8_WORLDS[s.sel];
  out+=R(20,168,562,178,'#fff',C.grid,8)+TBF(36,192,w.n,15,C.ink,'start');
  [['In the Sun-like zone',w.hz?'yes':'no'],['Rocky',w.rock],['Atmosphere',w.atm],['Tidally locked',w.lock]].forEach(([k,v],i)=>{out+=TF(36,218+i*22,k,13,C.muted,'start')+TF(190,218+i*22,v,13,C.ink,'start')});
  out+=A8_lines(36,312,A8_wrap(w.d,82),C.ink,13,17);
  out+=A8_tag('plausible');
  return {svg:out,phase:`${w.n}: ${w.d}`};
 }});

/* ---- energy balance and the greenhouse ---- */
SCENE({id:'habitable-zone-greenhouse',name:'Albedo and the greenhouse',tag:'Why Earth is not frozen',
 definition:'A planet’s equilibrium temperature balances absorbed starlight against emitted heat. Reflectivity (albedo) lowers it; greenhouse gases warm the surface above it. Both decide whether water stays liquid.',
 example:'Earth’s equilibrium temperature is about 255 K (−18 °C); greenhouse gases raise the average surface to about 288 K (15 °C).',
 desc:'Sliders for the Sun’s brightness, the planet’s albedo and the greenhouse warming. A thermometer shows the surface temperature against the range where water is liquid at Earth’s surface pressure.',
 research:'Energy balance: T = 278.6 K × L^¼ × (1 − albedo)^¼ ÷ √d (d in AU). Sagan, C. & Mullen, G. (1972). Earth and Mars: evolution of atmospheres and surface temperatures. Science 177, 52–56 (the faint young Sun paradox). Gough, D. O. (1981). Solar Physics 74, 21–34 (the young Sun about 70% as bright). Hoffman, P. F. et al. (1998). Science 281, 1342–1346 (Snowball Earth).',
 dur:12,hint:'Dim the Sun to 0.7, as it was 4 billion years ago. How much greenhouse warming would early Earth need to keep its oceans?',
 init:()=>({L:1,A:.3,g:33}),
 watch(p){return p<.5?{L:1-p*.6,A:.3,g:33}:{L:.7,A:.3,g:33+(p-.5)*120}},
 ui:[{range:'L',label:'Sun’s brightness',min:.6,max:1.2,step:.01,get:s=>s.L,act:'L',show:v=>Math.round(v*100)+'% of today'},{range:'A',label:'Albedo',min:0,max:.8,step:.01,get:s=>s.A,act:'A',show:v=>v.toFixed(2)},{range:'g',label:'Greenhouse warming',min:0,max:100,get:s=>s.g,act:'g',show:v=>'+'+v+' K'}],
 on:{L(s,v){s.L=Number(v)},A(s,v){s.A=Number(v)},g(s,v){s.g=Number(v)}},
 draw(s){
  const Te=A8_teq(s.L,1,s.A),Ts=Te+s.g,state=Ts<273.15?'frozen':Ts>373.15?'boiling':'liquid water';let out=heading('Energy balance at Earth’s distance',26);
  const y=K=>330-(K-180)/(420-180)*270,xT=120;
  out+=R(xT-14,y(420)-6,28,y(180)-y(420)+12,'#fff',C.line,14)+R(xT-8,y(Ts),16,y(180)-y(Ts),state==='frozen'?C.blue:state==='boiling'?C.coral:C.green,8);
  out+=R(xT+24,y(373.15),40,y(273.15)-y(373.15),'#e3f2ec','none',3)+TF(xT+70,(y(373.15)+y(273.15))/2+5,'liquid',13,C.green,'start');
  [200,250,300,350,400].forEach(K=>{out+=L(xT-20,y(K),xT-14,y(K),C.line,1.5)+TF(xT-24,y(K)+5,K+' K',13,C.muted,'end')});
  out+=L(xT+14,y(Te),xT+30,y(Te),C.amber,2)+TF(xT+34,y(Te)+5,'no greenhouse',13,C.amber,'start');
  out+=TBF(300,82,'Equilibrium temperature',14,C.ink,'start')+TBF(300,104,Math.round(Te)+' K ('+Math.round(Te-273.15)+' °C)',16,C.amber,'start');
  out+=TBF(300,140,'Surface, with greenhouse',14,C.ink,'start')+TBF(300,162,Math.round(Ts)+' K ('+Math.round(Ts-273.15)+' °C)',16,C.ink,'start');
  out+=TBF(300,196,state,16,state==='frozen'?C.blue:state==='boiling'?C.coral:C.green,'start');
  out+=A8_lines(300,230,s.L<.85&&state==='frozen'?['A young Sun at '+Math.round(s.L*100)+'% brightness leaves','Earth frozen here, yet rocks show','liquid water 4 billion years ago:','the faint young Sun paradox.']:s.L<.85?['With this much greenhouse warming','(or a darker surface) the young','Earth keeps liquid water: one','proposed answer to the faint','young Sun paradox.']:['Raise the albedo past about 0.55','and even today’s greenhouse','cannot stop a global freeze, as','in the Snowball Earth episodes.'],C.muted,13,18);
  out+=A8_tag('demonstrated');
  return {svg:out,phase:`With the Sun at ${Math.round(s.L*100)}% and albedo ${s.A.toFixed(2)}, the equilibrium temperature is ${Math.round(Te)} K; adding ${s.g} K of greenhouse warming gives ${Math.round(Ts)} K: ${state}. The energy balance is basic physics; how much greenhouse warming early Earth had is still debated.`};
 }});

/* ---------------------------------------------------------------- icy moons */
const A8_MOONS={
 europa:{n:'Europa (Jupiter)',R:1561,ice:'15–25 km (estimates range from a few to 30)',ocean:'perhaps 60–150 km deep',water:'Galileo’s magnetometer found a salty, conducting layer (Kivelson et al. 2000).',energy:'Tidal flexing by Jupiter; possible sea-floor volcanism.',chem:'Salts and carbon dioxide seen on the surface, the CO₂ probably from the ocean (JWST, 2023).',next:'Europa Clipper, launched in 2024, arrives in 2030; ESA’s JUICE arrives in 2031.',iceF:.06,oceanF:.12},
 enceladus:{n:'Enceladus (Saturn)',R:252,ice:'about 20–25 km on average, a few km at the south pole',ocean:'a global ocean about 10 km deep',water:'Plumes of water from the south pole, and a wobble showing a global ocean (Thomas et al. 2016).',energy:'Tidal heating; silica grains and hydrogen gas point to hot water reacting with rock.',chem:'Salts, organic molecules, ammonia, hydrogen and phosphate in the plume and ice grains.',next:'No mission yet; ESA is studying one for the 2040s.',iceF:.1,oceanF:.06},
 titan:{n:'Titan (Saturn)',R:2575,ice:'perhaps 50–100 km',ocean:'a deep water ocean inferred under the ice',water:'Cassini measured tidal flexing too large for solid ice: an ocean below (Iess et al. 2012).',energy:'Tidal heating and sunlight driving rich atmospheric chemistry.',chem:'A thick nitrogen atmosphere, lakes of liquid methane and ethane, and many organic molecules.',next:'NASA’s Dragonfly drone is due to launch in 2028 and arrive in 2034.',iceF:.05,oceanF:.1}};
SCENE({id:'icy-moons',name:'Oceans under ice',tag:'Europa, Enceladus and Titan',
 definition:'Several moons of the outer planets hide oceans of liquid water beneath their ice, kept warm by tides rather than sunlight. They may be the most likely places in the Solar System for life beyond Earth.',
 example:'Enceladus is only 500 km across, yet it sprays its ocean into space through cracks at its south pole.',
 desc:'A cross-section of the chosen moon (layers drawn thicker than true scale) and a checklist for life: liquid water, energy and chemistry, with the evidence for each and the next mission.',
 research:'Kivelson, M. G. et al. (2000). Science 289, 1340–1343. Thomas, P. C. et al. (2016). Icarus 264, 37–47. Iess, L. et al. (2012). Science 337, 457–459. Villanueva, G. L. et al. (2023) and Trumbo, S. K. & Brown, M. E. (2023), Science 381 (CO₂ on Europa). Hendrix, A. R. et al. (2019). The NASA roadmap to ocean worlds. Astrobiology 19, 1–27. Layer thicknesses are uncertain estimates.',
 dur:12,hint:'Compare the three moons. Which has all three ingredients best supported?',
 init:()=>({m:'enceladus'}),
 watch(p){return {m:p<.34?'europa':p<.67?'enceladus':'titan'}},
 ui:[{choose:Object.keys(A8_MOONS).map(k=>[k,A8_MOONS[k].n.split(' ')[0]]),label:'Moon',get:s=>s.m,act:'m'}],
 on:{m(s,v){s.m=v;return 'keep'}},
 draw(s){
  const m=A8_MOONS[s.m],cx=150,cy=280,R0=120;let out=heading(m.n+': an ocean under ice',26);
  const half=(r,fill,stroke='none')=>P(`M${cx-r} ${cy} A${r} ${r} 0 0 1 ${cx+r} ${cy} Z`,stroke,1.5,fill);
  out+=half(R0,'#e9f3fa',C.line)+half(R0*(1-m.iceF),'#3d7ea6')+half(R0*(1-m.iceF-m.oceanF),'#8a7a66');
  if(s.m==='titan')out+=P(`M${cx-R0-10} ${cy} A${R0+10} ${R0+10} 0 0 1 ${cx+R0+10} ${cy}`,'#e8b65a',3,'none','opacity=".7"');
  if(s.m==='enceladus')[[-.25],[0],[.25]].forEach(([dx])=>{out+=P(`M${cx+dx*60} ${cy-R0} q ${dx*30} -30 ${dx*50} -55`,'#a9d0ea',3,'none','opacity=".8"')});
  out+=L(cx-R0,cy,cx+R0,cy,C.line,1.5);
  out+=TF(cx,cy-30,'rock',13,'#fff');
  out+=R(36,cy+12,12,12,'#e9f3fa',C.line,2)+TF(52,cy+22,'ice',13,C.muted,'start')+R(90,cy+12,12,12,'#3d7ea6','none',2)+TF(106,cy+22,'ocean',13,C.muted,'start')+R(160,cy+12,12,12,'#8a7a66','none',2)+TF(176,cy+22,'rock core',13,C.muted,'start');
  out+=TF(cx,cy+46,'radius '+m.R.toLocaleString('en-GB')+' km · not to scale',13,C.muted);
  const rows=[['Liquid water',m.water],['Energy',m.energy],['Chemistry',m.chem]];let y=64;
  A8_wrap('Ice: '+m.ice,44).forEach(l=>{out+=TF(300,y,l,13,C.muted,'start');y+=16});A8_wrap('Ocean: '+m.ocean,44).forEach(l=>{out+=TF(300,y,l,13,C.muted,'start');y+=16});y+=10;
  rows.forEach(([h,b])=>{out+=TBF(300,y,'✓ '+h,13,C.green,'start');y+=17;A8_wrap(b,42).forEach(l=>{out+=TF(316,y,l,13,C.ink,'start');y+=16});y+=6});
  out+=A8_lines(300,y+4,A8_wrap('Next: '+m.next,44),C.blue,13,16);
  out+=A8_tag('plausible');
  return {svg:out,phase:`${m.n}: ${m.water} No life has been detected on any of these moons; they are habitable environments, not inhabited ones, as far as we know.`};
 }});

/* ---- what Cassini found at Enceladus ---- */
const A8_CAS=[
 {y:2005,t:'Plumes',d:'Cassini sees jets of water vapour and ice grains rising from four “tiger stripe” fractures at the south pole (Porco et al. 2006).'},
 {y:2009,t:'Organics',d:'Its mass spectrometer finds methane and more complex carbon compounds in the plume (Waite et al. 2009).'},
 {y:2011,t:'Salty grains',d:'Ice grains rich in sodium salts imply liquid water in contact with rock, not just melting ice (Postberg et al. 2011).'},
 {y:2015,t:'Silica',d:'Tiny silica particles need water hotter than about 90 °C reacting with rock: hydrothermal activity (Hsu et al. 2015).'},
 {y:2016,t:'Global ocean',d:'A wobble in the moon’s rotation is too big for an ice shell frozen to the core: the ocean is global (Thomas et al. 2016).'},
 {y:2017,t:'Hydrogen',d:'Molecular hydrogen in the plume, a chemical fuel that some Earth microbes live on by making methane (Waite et al. 2017).'},
 {y:2023,t:'Phosphate',d:'Phosphates found in ice grains, so the ocean has phosphorus, an element life needs (Postberg et al. 2023).'}];
SCENE({id:'icy-moons-plume',name:'Tasting an ocean from orbit',tag:'Cassini at Enceladus, 2005–2017',
 definition:'Because Enceladus sprays its ocean into space, the Cassini spacecraft could sample it by flying through the plume, without landing or drilling. Each finding added an ingredient a habitable ocean needs.',
 example:'In 2015 Cassini dived to within 49 km of the surface, through the plume, to sample its gases.',
 desc:'A sketch of the south pole with its plume and Cassini’s path, and a timeline of findings. Step through the discoveries to see the case for a habitable ocean build.',
 research:'Porco, C. C. et al. (2006). Science 311, 1393–1401. Waite, J. H. et al. (2009). Nature 460, 487–490. Postberg, F. et al. (2011). Nature 474, 620–622. Hsu, H.-W. et al. (2015). Nature 519, 207–210. Thomas et al. (2016). Icarus 264, 37–47. Waite, J. H. et al. (2017). Science 356, 155–159. Postberg, F. et al. (2023). Nature 618, 489–493.',
 dur:12,hint:'Step through the findings in order. Which one first showed the ocean touches rock?',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(6,Math.floor(p*7))}},
 ui:[{b:'Back',act:'step',arg:-1},{b:'Next finding',act:'step',arg:1}],
 on:{step(s,v){s.k=clamp(s.k+Number(v),0,6);return 'keep'},pick(s,v){s.k=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('What Cassini found at Enceladus',26);
  out+=R(20,46,250,200,'#141f29','none',8)+P('M40 246 A110 110 0 0 1 250 246 Z','none',0,'#e9f3fa');
  [80,120,160,200].forEach((x,i)=>{out+=P(`M${x} ${226-Math.abs(145-x)*.2} q ${(x-145)*.05} -60 ${(x-145)*.15} -150`,'#a9d0ea',3,'none',`opacity="${fmt(.5+.1*i)}"`)});
  const t=s.k/6,px=64+t*180,py=80+Math.sin(t*Math.PI)*46;out+=P('M30 80 Q145 150 260 80',C.amber,1.5,'none','stroke-dasharray="5 5"')+Ci(px,py,6,C.amber,'#fff')+TF(px,py-12,'Cassini',13,'#f7d38a');
  out+=TF(145,238,'south pole (sketch)',13,C.muted);
  A8_CAS.forEach((c,i)=>{const y=58+i*27;out+=hit(X,'pick',i,c.t,R(290,y,290,22,i===s.k?'#e3f2ec':i<s.k?'#f7fafc':'#fff',i===s.k?C.green:C.grid,5)+TF(300,y+16,c.y+'  '+c.t,13,i<=s.k?C.ink:C.muted,'start')+(i<=s.k?TF(570,y+16,'✓',13,C.green,'end'):''))});
  const c=A8_CAS[s.k];out+=R(20,258,562,88,'#fff',C.grid,8)+TBF(36,280,c.y+' · '+c.t,14,C.ink,'start')+A8_lines(36,302,A8_wrap(c.d,82),C.ink,13,18);
  out+=A8_tag('plausible');
  return {svg:out,phase:s.k<6?`${c.y}: ${c.d}`:'By 2023 Enceladus had liquid water, energy from hot rock and hydrogen, and all the main elements life uses. That makes it habitable in principle. Whether anything lives there is unknown.'};
 }});

/* ---- tides keep oceans warm ---- */
SCENE({id:'icy-moons-tides',name:'Heated by tides',tag:'Why the oceans have not frozen',
 definition:'A moon on a slightly oval orbit is squeezed more at its closest approach than at its farthest. The flexing heats its interior. Orbital resonances with other moons keep the orbit oval, so the heating can last for billions of years.',
 example:'In 1979, days before Voyager 1 flew past, Peale, Cassen and Reynolds predicted that tidal heating would make Jupiter’s moon Io volcanic. Voyager found active volcanoes.',
 desc:'Tidal heating rises with the square of the orbit’s eccentricity (how oval it is). Without a resonance, tides themselves round off the orbit and the heating fades; with a resonance, the eccentricity is kept up. The graph runs both over time (illustrative units).',
 research:'Peale, S. J., Cassen, P. & Reynolds, R. T. (1979). Melting of Io by tidal dissipation. Science 203, 892–894. Morabito, L. A. et al. (1979). Science 204, 972 (Io’s volcanoes seen). Heating ∝ e² for a synchronously rotating moon (other factors fixed). Enceladus is held in a 2:1 resonance with Dione; Io, Europa and Ganymede in a 1:2:4 resonance. Curves illustrative.',
 dur:12,hint:'Set the eccentricity of Enceladus or Europa, then switch the resonance off.',
 init:()=>({e:.0047,res:'on'}),
 watch(p){return {e:.0047+p*.01,res:p<.5?'on':'off'}},
 ui:[{range:'e',label:'Eccentricity',min:0,max:.02,step:.0001,get:s=>s.e,act:'e',show:v=>v.toFixed(4)},{choose:[['on','Resonance on'],['off','Resonance off']],label:'Resonance',get:s=>s.res,act:'res'}],
 on:{e(s,v){s.e=Number(v)},res(s,v){s.res=v;return 'keep'}},
 draw(s){
  const e=s.e,heat=t=>{const ee=s.res==='on'?e:e*Math.exp(-t/1.2);return ee*ee/(.0047*.0047)};
  const ymax=Math.max(4,heat(0)*1.15);
  const pl=A8_plot(70,60,300,220,[0,4],[0,ymax],{xt:[[0,'0'],[1,'1'],[2,'2'],[3,'3'],[4,'4']],yt:[[0,'0'],[1,'1']],xl:'time (billions of years, illustrative)',xlDy:36,yl:'tidal heating (Enceladus today = 1)'});
  let out=heading('Tides keep the ocean liquid',26)+pl.svg;
  out+=L(pl.X(0),pl.Y(.5),pl.X(4),pl.Y(.5),C.blue,1.5,'stroke-dasharray="5 5"')+TF(pl.X(4)-4,pl.Y(.5)-6,'freezing line (illustrative)',13,C.blue,'end');
  const pts=range(81).map(i=>[pl.X(i/20),pl.Y(Math.min(ymax,heat(i/20)))]);out+=P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),s.res==='on'?C.green:C.coral,2.8);
  // orbit sketch
  const ox=476,oy=128,a=70,b=a*Math.sqrt(1-Math.min(.9,e*30)**2);
  out+=`<ellipse cx="${ox}" cy="${oy}" rx="${a}" ry="${fmt(b)}" fill="none" stroke="${C.line}" stroke-width="1.5"/>`+Ci(ox-a*Math.min(.9,e*30),oy,9,'#e8b65a')+Ci(ox+a,oy,6,C.blue);
  out+=TF(ox,oy+b+24,'orbit, ovalness ×30',13,C.muted);
  out+=TBF(392,248,'e = '+e.toFixed(4),14,C.ink,'start')+TF(392,268,'Enceladus: 0.0047',13,C.muted,'start')+TF(392,286,'Europa: 0.009',13,C.muted,'start');
  out+=TF(392,308,'heating now: '+heat(0).toFixed(2)+' ×',13,C.ink,'start')+TF(392,326,'Enceladus today',13,C.ink,'start');
  out+=A8_tag('demonstrated');
  return {svg:out,phase:s.res==='on'?`With the resonance on, the eccentricity stays at ${e.toFixed(4)} and the heating holds steady: an ocean can last. Doubling the eccentricity quadruples the heating.`:'Without a resonance the tides round off the orbit, the heating fades and, in this sketch, the ocean would freeze. The shape of the decay is illustrative; the principle is established physics.'};
 }});

/* ---------------------------------------------------------------- biosignatures */
const A8_COLD=['Signal known to come from life','Contamination ruled out','Life could make it there','Non-living sources implausible','Independent second signal','Alternatives ruled out by follow-up','Predicted signal confirmed'];
const A8_CLAIMS=[
 {n:'Viking labelled release, Mars 1976',lv:1,d:'Nutrients dropped on Martian soil released labelled gas, as microbes would. Other Viking tests found no organic molecules, and later reactive perchlorate salts in the soil explain the result chemically. One team member defended a biological reading for decades.'},
 {n:'ALH84001 meteorite, 1996',lv:1,d:'A Martian meteorite with organic molecules, magnetite grains and worm-like shapes. Each feature was later explained without life, and some organics were contamination from Antarctic ice.'},
 {n:'Phosphine on Venus, 2020',lv:0,d:'A radio signal was read as phosphine high in Venus’s clouds. Reanalyses weakened or questioned the detection itself, so it has not securely reached the first rung.'},
 {n:'DMS on K2-18b, 2023 and 2025',lv:0,d:'JWST spectra were read as hinting at dimethyl sulphide, made on Earth mostly by marine life. Other teams found the evidence weak, and DMS has since been found in a comet, so non-living sources exist.'}];
SCENE({id:'biosignatures',name:'Judging a claim of life',tag:'The confidence of life detection scale',
 definition:'A biosignature is a sign that life is or was present. Because many signs can also be made without life, NASA scientists proposed a seven-rung confidence scale (CoLD) for reporting any claim.',
 example:'Finding a gas that life makes is only the first rung; you must then rule out contamination and every non-living way of making it.',
 desc:'The seven rungs of the CoLD scale, and four famous claims. Choose a claim, press the rung you think it reached, then compare with this page’s judgement.',
 research:'Green, J. et al. (2021). Call for a framework for reporting evidence for life beyond Earth. Nature 598, 575–579. Levin, G. V. & Straat, P. A. (1976). Science 194, 1322–1329. McKay, D. S. et al. (1996). Science 273, 924–930. Greaves, J. S. et al. (2021). Nature Astronomy 5, 655–664; Villanueva, G. L. et al. (2021). Nature Astronomy 5, 631–635. Madhusudhan, N. et al. (2023). ApJL 956, L13 and (2025). ApJL 983, L40. The judgements here are this page’s own reading of the debate.',
 dur:12,hint:'Make your rating first, then press Reveal. No claim so far has climbed far up the ladder.',
 init:()=>({c:0,g:-1,rev:0}),
 watch(p){const c=Math.min(3,Math.floor(p*4));return {c,g:A8_CLAIMS[c].lv,rev:(p*4)%1>.5?1:0}},
 ui:[{choose:A8_CLAIMS.map((c,i)=>[String(i),c.n.split(',')[0]]),label:'Claim',get:s=>String(s.c),act:'c'},{b:'Reveal judgement',act:'rev'}],
 on:{c(s,v){s.c=Number(v);s.g=-1;s.rev=0;return 'keep'},g(s,v){s.g=Number(v);return 'keep'},rev(s){s.rev=1;return 'keep'}},
 draw(s,f,X){
  const cl=A8_CLAIMS[s.c];let out=heading('Climbing the confidence ladder',26);
  for(let i=6;i>=0;i--){const y=52+(6-i)*36,on=s.rev&&i<cl.lv,mine=s.g===i+1;
   out+=hit(X,'g',i+1,'Rung '+(i+1)+': '+A8_COLD[i],R(20,y,300,30,on?'#e3f2ec':mine?'#fbefd5':'#fff',mine?C.amber:on?C.green:C.line,5)+TBF(36,y+20,String(i+1),13,C.muted)+TF(54,y+20,A8_COLD[i],13,C.ink,'start'))}
  out+=hit(X,'g',0,'Not yet on the ladder',R(20,304,300,30,s.g===0?'#fbefd5':'#fff',s.g===0?C.amber:C.line,5)+TF(170,324,'Not yet: the detection itself is disputed',13,C.ink));
  out+=R(336,52,246,282,'#fff',C.grid,8)+TBF(350,76,cl.n,13,C.ink,'start');
  out+=A8_lines(350,100,A8_wrap(cl.d,36),C.ink,13,17);
  out+=TF(350,300,s.g<0?'Your rating: press a rung':'Your rating: '+(s.g?'rung '+s.g:'not yet on the ladder'),13,C.amber,'start');
  out+=TF(350,322,s.rev?'This page: '+(cl.lv?'rung '+cl.lv:'not yet on the ladder'):'Press Reveal judgement',13,s.rev?C.green:C.muted,'start');
  out+=A8_tag('speculative');
  return {svg:out,phase:s.rev?`${cl.n}: this page judges it ${cl.lv?'to have reached rung '+cl.lv:'not yet on the ladder'}. No claim of life beyond Earth has passed rung 2. Confidence comes from ruling things out, one rung at a time.`:'Read the claim, press the highest rung you think it secured, then reveal this page’s judgement.'};
 }});

/* ---- gases out of balance ---- */
const A8_ATM={
 earth:{n:'Earth',g:[['N₂',780000],['O₂',209000],['Ar',9300],['CO₂',420],['CH₄',1.9]],v:'Oxygen and methane together, far out of chemical balance: they react, so something must keep making both. On Earth that is life.',st:'demonstrated'},
 mars:{n:'Mars',g:[['CO₂',950000],['N₂',28000],['Ar',20000],['O₂',1700],['CH₄',.0004]],v:'Mostly carbon dioxide, close to chemical balance. Tiny bursts of methane reported by Curiosity are contested and could be geological.',st:'speculative'},
 venus:{n:'Venus',g:[['CO₂',965000],['N₂',35000],['SO₂',150],['H₂O',20],['CO',17]],v:'Carbon dioxide and sulphur gases in rough balance with a hot surface. No clear sign of life.',st:'demonstrated'},
 dry:{n:'Dry planet, red dwarf (model)',g:[['O₂',500000],['CO₂',300000],['N₂',200000],['CH₄',.00001]],v:'A false positive: starlight splits water, hydrogen escapes to space and oxygen builds up with no life at all. Oxygen alone is not enough.',st:'plausible'}};
SCENE({id:'biosignatures-disequilibrium',name:'Gases out of balance',tag:'Lovelock’s test and its false positives',
 definition:'James Lovelock argued in 1965 that a living planet’s atmosphere is out of chemical balance: gases that react with each other persist because life keeps making them. A single gas, such as oxygen, can be faked by non-living chemistry.',
 example:'Earth’s air holds oxygen and methane together. Methane is oxidised away in about a decade, while the vast oxygen supply barely changes, so the methane must be constantly replaced: on Earth, mostly by life.',
 desc:'Gas amounts on a logarithmic scale (parts per million) for three planets and one modelled lifeless world. Choose an atmosphere and read whether its mix is a convincing sign of life.',
 research:'Lovelock, J. E. (1965). A physical basis for life detection experiments. Nature 207, 568–570. Krissansen-Totton, J. et al. (2018). Science Advances 4, eaao5747 (disequilibrium biosignatures). Luger, R. & Barnes, R. (2015). Astrobiology 15, 119–143 (oxygen without life around red dwarfs). Meadows, V. S. et al. (2018). Astrobiology 18, 630–662. Webster, C. R. et al. (2018). Science 360, 1093–1096 (methane on Mars). Values rounded.',
 dur:12,hint:'Compare Earth with the dry planet: both have plenty of oxygen. What is the difference?',
 init:()=>({a:'earth'}),
 watch(p){const k=Object.keys(A8_ATM);return {a:k[Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:Object.keys(A8_ATM).map(k=>[k,A8_ATM[k].n.split(',')[0]]),label:'Atmosphere',get:s=>s.a,act:'a'}],
 on:{a(s,v){s.a=v;return 'keep'}},
 draw(s){
  const at=A8_ATM[s.a];let out=heading('Atmospheres: '+at.n,26);
  const pl=A8_plot(110,52,440,180,[-6,6],[0,1],{xt:[[-6,'10⁻⁶'],[-3,'0.001'],[0,'1 ppm'],[3,'1,000'],[6,'10⁶']],xl:'amount, parts per million (log scale)',xlDy:34});
  out+=pl.svg;at.g.forEach((g,i)=>{const y=60+i*34,w=pl.X(Math.log10(g[1]))-110,key=(g[0]==='O₂'||g[0]==='CH₄');out+=R(110,y,Math.max(2,w),24,key?C.amber:'#9fb8c7','none',3)+TF(102,y+17,g[0],13,C.ink,'end')});
  out+=R(20,270,562,76,'#fff',C.grid,8)+A8_lines(36,292,A8_wrap(at.v,82),C.ink,13,18);
  out+=A8_tag(at.st);
  return {svg:out,phase:`${at.n}: ${at.v}`};
 }});

/* ---- how surprising is a signal? ---- */
SCENE({id:'biosignatures-significance',name:'How sure is “3 sigma”?',tag:'Significance, and searching many places',
 definition:'A detection’s significance in sigma (σ) says how unlikely a bump this large would be from noise alone. Searching for many molecules raises the chance that one shows a bump by luck: the look-elsewhere effect. Even a real detection says nothing on its own about life.',
 example:'A 3σ bump arises from noise about once in 370 tries; physicists usually wait for 5σ, about once in 1.7 million.',
 desc:'A bell curve of noise with the tails beyond your significance shaded. Set the sigma and how many molecules were searched; the panel gives the chance of a false alarm and the significance that remains after the search.',
 research:'Two-sided normal tail probabilities. Gross, E. & Vitells, O. (2010). Trial factors for the look elsewhere effect in high energy physics. Eur. Phys. J. C 70, 525–530. Madhusudhan, N. et al. (2025). ApJL 983, L40 (about 3σ claimed for DMS or DMDS on K2-18b); later reanalyses found weaker or no preference (e.g. Welbanks, L. et al. 2025; Luque, R. et al. 2025, preprints).',
 dur:12,hint:'Start at 3σ with one molecule, then say 20 molecules were searched. What is left?',
 init:()=>({sig:3,n:1}),
 watch(p){return p<.5?{sig:2+p*6,n:1}:{sig:3,n:1+Math.round((p-.5)*38)}},
 ui:[{range:'sig',label:'Significance',min:1,max:6,step:.1,get:s=>s.sig,act:'sig',show:v=>v.toFixed(1)+'σ'},{range:'n',label:'Molecules searched',min:1,max:20,get:s=>s.n,act:'n'}],
 on:{sig(s,v){s.sig=Number(v)},n(s,v){s.n=Number(v)}},
 draw(s){
  const p=A8_pOf(s.sig),pn=1-Math.pow(1-p,s.n),se=A8_sigOf(pn);
  const pl=A8_plot(40,60,320,200,[-6,6],[0,.42],{xt:[[-6,'−6σ'],[-3,'−3σ'],[0,'0'],[3,'3σ'],[6,'6σ']]});
  let out=heading('How surprising is the signal?',26)+pl.svg;
  const g=x=>Math.exp(-x*x/2)/Math.sqrt(2*Math.PI);
  const tail=(a,b)=>{const pts=range(41).map(i=>{const x=a+(b-a)*i/40;return [pl.X(x),pl.Y(g(x))]});return P('M'+fmt(pl.X(a))+' '+fmt(pl.Y(0))+' L'+pts.map(q=>fmt(q[0])+' '+fmt(q[1])).join(' L')+' L'+fmt(pl.X(b))+' '+fmt(pl.Y(0))+' Z','none',0,'#f9e2d9')};
  out+=tail(s.sig,6)+tail(-6,-s.sig);
  out+=P('M'+range(121).map(i=>{const x=-6+i/10;return fmt(pl.X(x))+' '+fmt(pl.Y(g(x)))}).join(' L'),C.blue,2.4);
  out+=L(pl.X(s.sig),60,pl.X(s.sig),260,C.coral,2)+L(pl.X(-s.sig),60,pl.X(-s.sig),260,C.coral,2);
  const one=v=>v<1e-4?'1 in '+Math.round(1/v).toLocaleString('en-GB'):(v*100).toFixed(v<.01?3:2)+'%';
  out+=TBF(380,80,'One molecule',14,C.ink,'start')+TF(380,102,'false-alarm chance '+one(p),13,C.ink,'start');
  out+=TBF(380,142,s.n+' molecule'+(s.n>1?'s':'')+' searched',14,C.ink,'start')+TF(380,164,'chance of at least one',13,C.ink,'start')+TF(380,182,'false alarm: '+one(pn),13,C.ink,'start');
  out+=TBF(380,214,'Left after the search',14,C.ink,'start')+TBF(380,238,se.toFixed(2)+'σ',18,se>=5?C.green:se>=3?C.amber:C.coral,'start');
  out+=A8_lines(40,312,['Significance only measures surprise against noise. A real gas can still','come from geology or chemistry: that is the next rung of the ladder.'],C.muted,13,17);
  out+=A8_tag('demonstrated');
  return {svg:out,phase:`A ${s.sig.toFixed(1)}σ bump has a ${one(p)} chance of being noise. Searching ${s.n} molecule${s.n>1?'s':''} makes a chance bump somewhere ${one(pn)} likely, worth only ${se.toFixed(2)}σ.`};
 }});

/* ---------------------------------------------------------------- what counts as alive? */
const A8_CASES=['Bacterium','Virus','Fire','Crystal','Mule','Prion','Dried tardigrade'];
const A8_DEFS={
 nasa:{n:'NASA working definition',q:'“A self-sustaining chemical system capable of Darwinian evolution” (Joyce 1994).',v:['yes','no','no','no','?','no','yes'],why:['It sustains itself and its lineage evolves.','It evolves, but cannot sustain itself outside a cell.','No heredity, so no Darwinian evolution.','No heredity worth the name.','Sterile itself, but part of an evolving system: depends whether you judge individuals or lineages.','A misfolded protein that copies its shape; strains can change, but it is not self-sustaining.','Not doing anything now, but part of an evolving, self-sustaining system.']},
 auto:{n:'Self-making (autopoiesis)',q:'A system that continuously produces its own components and the boundary that holds them (Maturana & Varela).',v:['yes','no','no','no','yes','no','?'],why:['It builds its own parts and membrane.','It does not produce itself; the host cell builds it.','It keeps a shape, but makes no boundary of its own.','It grows by adding, not by self-production.','It maintains itself, though it cannot breed.','It does not build anything.','Its self-production is paused, perhaps for decades.']},
 gene:{n:'Heredity and reproduction',q:'Something that reproduces and passes on information that can vary and be selected.',v:['yes','yes','no','?','no','?','yes'],why:['It copies its genes and reproduces.','It copies its genes, with variation, using a host.','Fire spreads, but passes on no information.','Some clays copy their defects as they grow (Cairns-Smith), a borderline case.','It cannot reproduce.','Prion strains pass on their shape and can change: a borderline case.','It reproduces once rehydrated.']}};
SCENE({id:'defining-life',name:'What counts as alive?',tag:'Borderline cases under three definitions',
 definition:'There is no agreed definition of life. Each definition draws the line in a different place, and borderline cases (viruses, mules, prions, dormant animals) show where they disagree.',
 example:'By the NASA definition a virus is not alive; by a heredity-based definition it is.',
 desc:'Seven cases, each marked alive, not alive or unclear under the chosen definition. Choose a definition, then press a case for the reasoning.',
 research:'Joyce, G. F. (1994). Foreword. In Deamer, D. W. & Fleischaker, G. R. (eds), Origins of Life: The Central Concepts. Jones & Bartlett. Maturana, H. R. & Varela, F. J. (1980). Autopoiesis and Cognition. Reidel. Cairns-Smith, A. G. (1982). Genetic Takeover and the Mineral Origins of Life. Cambridge University Press. Li, J. et al. (2010). Darwinian evolution of prions in cell culture. Science 327, 869–872. Cleland, C. E. (2019). The Quest for a Universal Theory of Life. Cambridge University Press.',
 dur:12,hint:'Switch definitions and watch the virus and the mule change sides.',
 init:()=>({d:'nasa',sel:1}),
 watch(p){const k=Object.keys(A8_DEFS);return {d:k[Math.min(2,Math.floor(p*3))],sel:1+Math.floor((p*3)%1*3)}},
 ui:[{choose:Object.keys(A8_DEFS).map(k=>[k,A8_DEFS[k].n]),label:'Definition',get:s=>s.d,act:'d'}],
 on:{d(s,v){s.d=v;return 'keep'},sel(s,v){s.sel=Number(v);return 'keep'}},
 draw(s,f,X){
  const D=A8_DEFS[s.d];let out=heading('Alive or not? It depends on the definition',26);
  out+=R(20,44,562,40,'#f7fafc',C.grid,6)+A8_lines(32,60,A8_wrap(D.q,86),C.ink,13,16);
  A8_CASES.forEach((c,i)=>{const v=D.v[i],x=20+(i%4)*142,y=96+Math.floor(i/4)*70,col=v==='yes'?C.green:v==='no'?C.coral:C.amber;
   out+=A8_btn(X,'sel',i,c,x,y,134,60,[c,v==='yes'?'alive':v==='no'?'not alive':'unclear'],{fill:i===s.sel?tint(col,.82):'#fff',stroke:i===s.sel?col:C.line,bold:true})});
  const v=D.v[s.sel];out+=R(20,240,562,100,'#fff',C.grid,8)+TBF(36,264,A8_CASES[s.sel]+': '+(v==='yes'?'alive':v==='no'?'not alive':'unclear'),14,C.ink,'start')+A8_lines(36,288,A8_wrap(D.why[s.sel],82),C.ink,13,18);
  out+=A8_tag('speculative');
  return {svg:out,phase:`${D.n}: ${A8_CASES[s.sel].toLowerCase()} counts as ${v==='yes'?'alive':v==='no'?'not alive':'unclear'}. ${D.why[s.sel]}`};
 }});

/* ---- build your own definition ---- */
const A8_CRIT=[['metab','Uses energy'],['grow','Grows'],['repro','Reproduces'],['hered','Passes on information'],['evol','Can evolve'],['bound','Has its own boundary']];
const A8_HAS={Bacterium:{metab:1,grow:1,repro:1,hered:1,evol:1,bound:1},Virus:{metab:0,grow:0,repro:1,hered:1,evol:1,bound:1},Fire:{metab:1,grow:1,repro:1,hered:0,evol:0,bound:0},Crystal:{metab:0,grow:1,repro:1,hered:0,evol:0,bound:1},Mule:{metab:1,grow:1,repro:0,hered:1,evol:0,bound:1},Prion:{metab:0,grow:1,repro:1,hered:1,evol:1,bound:0},'Dried tardigrade':{metab:0,grow:0,repro:0,hered:1,evol:1,bound:1}};
SCENE({id:'defining-life-checklist',name:'Build your own definition',tag:'Lists of properties and their loopholes',
 definition:'Many textbook definitions are lists: life metabolises, grows, reproduces, inherits, evolves, has a boundary. Each item lets in something odd or shuts out something living.',
 example:'Require only metabolism, growth and reproduction, and fire is alive.',
 desc:'Tick the properties you require. The grid shows which of seven cases has each property, and which pass all your requirements. The properties are simplified yes-or-no judgements.',
 research:'Koshland, D. E. (2002). The seven pillars of life. Science 295, 2215–2216. Trifonov, E. N. (2011). Vocabulary of definitions of life suggests a definition. Journal of Biomolecular Structure and Dynamics 29, 259–266 (123 definitions compared). Cleland (2019). The judgements in the grid are this page’s simplifications.',
 dur:12,hint:'Find the smallest set of ticks that admits the bacterium and nothing else.',
 init:()=>({req:{metab:1,grow:1,repro:1,hered:0,evol:0,bound:0}}),
 watch(p){const sets=[['metab','grow','repro'],['repro','hered','evol'],['metab','repro','hered','evol','bound']],k=sets[Math.min(2,Math.floor(p*3))],req={};A8_CRIT.forEach(([c])=>{req[c]=k.includes(c)?1:0});return {req}},
 ui:[{b:'Clear all',act:'clear'}],
 on:{tog(s,v){s.req[v]=s.req[v]?0:1;return 'keep'},clear(s){A8_CRIT.forEach(([c])=>{s.req[c]=0});return 'keep'}},
 draw(s,f,X){
  let out=heading('Tick what life must have',26);const cases=Object.keys(A8_HAS),x0=200,cw=54,y0=88,rh=34;
  cases.forEach((c,j)=>{out+=TF(x0+j*cw+cw/2,y0-10,c==='Dried tardigrade'?'Tardigr.':c==='Bacterium'?'Bacter.':c,13,C.muted)});
  A8_CRIT.forEach(([k,lab],i)=>{const y=y0+i*rh,on=s.req[k];
   out+=hit(X,'tog',k,(on?'Required: ':'Not required: ')+lab,R(20,y,172,rh-6,on?'#e3f2ec':'#fff',on?C.green:C.line,5)+R(28,y+7,14,14,'#fff',on?C.green:C.muted,3)+(on?P(`M31 ${y+14} L34 ${y+18} L40 ${y+9}`,C.green,2.2):'')+TF(50,y+19,lab,13,C.ink,'start'));
   cases.forEach((c,j)=>{const h=A8_HAS[c][k];out+=TF(x0+j*cw+cw/2,y+19,h?'●':'·',13,h?C.ink:C.line)})});
  const yp=y0+6*rh+8,any=A8_CRIT.some(([k])=>s.req[k]);let passN=[];
  out+=TBF(30,yp+19,'Counts as alive',13,C.ink,'start');
  cases.forEach((c,j)=>{const pass=any&&A8_CRIT.every(([k])=>!s.req[k]||A8_HAS[c][k]);if(pass)passN.push(c);out+=R(x0+j*cw+6,yp,cw-12,28,pass?C.green:'#fff',pass?C.green:C.line,5)+TF(x0+j*cw+cw/2,yp+19,pass?'yes':'no',13,pass?'#fff':C.muted)});
  out+=TF(20,yp+52,any?'Passing: '+(passN.join(', ')||'nothing'):'Tick at least one property.',13,passN.length===1&&passN[0]==='Bacterium'?C.green:C.ink,'start');
  out+=A8_tag('speculative');
  const odd=passN.filter(c=>c!=='Bacterium');
  return {svg:out,phase:!any?'Tick properties to build a definition.':!passN.includes('Bacterium')?'Your definition shuts out the bacterium, which everyone agrees is alive.':odd.length?`Your list admits ${odd.join(', ').toLowerCase()} as well as the bacterium. Every short list has loopholes like this.`:'Only the bacterium passes. Now ask whether a mule, a dormant tardigrade or a virus should, and the argument starts again.'};
 }});

/* ---- why definitions are hard ---- */
const A8_WSTEP=[
 {t:'Water, before chemistry',l:['Wet and clear','Quenches thirst','Freezes, boils','Dissolves salt'],d:'Before about 1800, water could only be described by its properties, and some liquids shared many of them.'},
 {t:'Water, after a theory',l:['H₂O: two','hydrogens, one','oxygen; the rest','follows from it'],d:'Molecular chemistry explained why water has its properties. A definition followed from the theory, not before it.'},
 {t:'Life, today',l:['One example:','Earth life,','all from LUCA','No agreed theory'],d:'Carol Cleland argues life is where water was before chemistry: we list properties of the one example we have.'},
 {t:'What would help',l:['A second example:','Mars? Enceladus?','Shadow biosphere?','Life made in a lab?'],d:'Finding or making a second, independent kind of life would show which features are essential and which are accidents of our history.'}];
SCENE({id:'defining-life-why',name:'Why life is hard to define',tag:'A sample of one',
 definition:'Some philosophers argue that we cannot yet define life, only describe it, because we know of a single example: all life on Earth shares one ancestry. A real definition may need a theory of life, as defining water needed molecular chemistry.',
 example:'Every organism we know uses DNA, proteins and a nearly universal genetic code (a few lineages reassign some codons); we cannot tell which of these life anywhere would need.',
 desc:'Four steps comparing how water was understood before and after chemistry with how life is understood now, and what could change that.',
 research:'Cleland, C. E. & Chyba, C. F. (2002). Defining ‘life’. Origins of Life and Evolution of the Biosphere 32, 387–393. Cleland (2019). The Quest for a Universal Theory of Life. Davies, P. C. W. et al. (2009). Signatures of a shadow biosphere. Astrobiology 9, 241–249. Trifonov (2011), 123 definitions compared. This is a philosophical argument, and others reply that a working definition is still useful.',
 dur:12,hint:'Step through the four panels. What kind of discovery would turn a list into a theory?',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(3,Math.floor(p*4))}},
 ui:[{b:'Back',act:'step',arg:-1},{b:'Next',act:'step',arg:1}],
 on:{step(s,v){s.k=clamp(s.k+Number(v),0,3);return 'keep'}},
 draw(s){
  let out=heading('Life is like water before chemistry',26);
  A8_WSTEP.forEach((w,i)=>{const x=20+i*142,on=i===s.k,past=i<s.k;out+=R(x,52,134,170,on?'#e3f2ec':past?'#f7fafc':'#fff',on?C.green:C.grid,8)+TBF(x+67,74,(i+1)+'',14,on?C.green:C.muted);
   A8_wrap(w.t,18).forEach((l,j)=>{out+=TBF(x+67,96+j*17,l,13,i<=s.k?C.ink:C.muted)});
   w.l.forEach((l,j)=>{out+=TF(x+67,140+j*18,l,13,i<=s.k?C.ink:C.muted)})});
  const w=A8_WSTEP[s.k];out+=R(20,236,562,104,'#fff',C.grid,8)+TBF(36,260,w.t,14,C.ink,'start')+A8_lines(36,284,A8_wrap(w.d,82),C.ink,13,18);
  out+=A8_tag('speculative');
  return {svg:out,phase:w.d};
 }});
