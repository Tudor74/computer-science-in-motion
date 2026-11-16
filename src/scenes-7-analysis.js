/* ===================== Chemistry era 7 · Reading molecules ===================== */
// How chemists see what they cannot see: separating mixtures (chromatography), listening to bonds vibrate
// (infrared), to nuclei precess (NMR), weighing ions (mass spectrometry), diffracting X-rays from crystals and
// counting drops to an end point. Every picture is a pure function of state; random choices use rng(), never Math.random.

const C7_poly=(pts,col,w=2.4,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function C7_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
function C7_btn(X,act,arg,label,x,y,w,h,text,o={}){
 const lines=Array.isArray(text)?text:[text];
 const inner=R(x,y,w,h,o.fill||'#fff',o.stroke||C.line,8,o.sel?'stroke-width="3"':'stroke-width="1.5"')+lines.map((t,i)=>TF(x+w/2,y+h/2+5+(i-(lines.length-1)/2)*16,t,o.size||13,o.ink||C.ink,'middle',o.bold?'font-weight="700"':'')).join('');
 return hit(X,act,arg,label,inner);
}
function C7_wrap(text,max){const out=[];let line='';for(const w of String(text).split(' ')){if(line&&(line+' '+w).length>max){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out}
const C7_lines=(x,y,lines,size=13,col=C.ink,anchor='start',dy=17)=>lines.map((l,i)=>TF(x,y+i*dy,l,size,col,anchor)).join('');
const C7_gauss=(x,c,w)=>Math.exp(-((x-c)*(x-c))/(2*w*w));
const C7_f=(v,d=2)=>Number(v).toFixed(d);

/* ================================================================ chromatography */
// Tsvet's leaf pigments on a chalk column. Each pigment's band moves at v/(1+K): K is how strongly it sticks
// to the chalk, and a more polar solvent weakens that grip for everything.
const C7_PIG=[
 {n:'β-carotene',col:'#e08a1a',k:.3},{n:'xanthophylls',col:'#d4b106',k:3.5},{n:'chlorophyll a',col:'#2c776c',k:6},{n:'chlorophyll b',col:'#8fae2e',k:9}];
const C7_K=(k,pol)=>k*Math.exp(-3.2*pol);
const C7_COL={top:70,len:250};
SCENE({id:'chromatography',name:'Tsvet’s coloured bands',tag:'A leaf extract separates on a chalk column',
 definition:'Chromatography separates a mixture by letting a moving phase (here a solvent) carry it past a stationary phase (here powdered chalk). Each substance spends a different share of its time stuck to the stationary phase, so each moves at its own speed and the mixture spreads into bands.',
 example:'In 1906 Mikhail Tsvet poured a leaf extract onto a column of chalk and washed it through with petroleum ether. Orange carotene ran ahead; yellow xanthophylls and the green chlorophylls lagged behind in separate bands.',
 desc:'A glass column packed with white chalk. Four coloured bands move down it at different speeds as solvent flows. Readouts give each band’s distance and how strongly it sticks; the ones that leave the bottom are listed in the order they come out.',
 research:'Tsvet, M. S. (1906). Physikalisch-chemische Studien über das Chlorophyll. Die Adsorptionen. Berichte der Deutschen Botanischen Gesellschaft 24, 316–323; and Adsorptionsanalyse und chromatographische Methode, same volume, 384–393. Ettre, L. S. (2003). M. S. Tswett and the invention of chromatography. LCGC North America 21, 458–467. Speeds here follow the simple retention model v = u/(1 + K); the K values are illustrative.',
 dur:11,hint:'Let the solvent run, then try a more polar solvent: every band speeds up and they crowd together. Good separation needs a solvent that is not too strong.',
 init:()=>({pol:.15,t:12}),
 watch(p){return {pol:.15,t:Math.round(lerp(0,30,smooth(p/.9))*2)/2}},
 ui:[{range:'t',label:'Time',min:0,max:30,step:.5,get:s=>s.t,act:'t',show:v=>v+' min'},
  {range:'pol',label:'Solvent polarity',min:0,max:1,step:.05,get:s=>s.pol,act:'pol',show:v=>v<.25?'weak (petroleum ether)':v<.6?'medium':'strong (with alcohol)'}],
 on:{t(s,v){s.t=Number(v)},pol(s,v){s.pol=Number(v)}},
 draw(s){
  let out=heading('Tsvet’s column: a leaf extract in chalk',26);
  const x=120,w=44,{top,len}=C7_COL,u=21;
  out+=R(x-6,top-24,w+12,24,'#eaf3f8',C.line,4)+TF(x+w/2,top-8,'solvent',13,C.blue);
  out+=R(x,top,w,len,'#f6f3ec',C.line,6,'stroke-width="2"');
  for(let i=0;i<14;i++)out+=Ci(x+8+((i*13)%30),top+10+i*17,2,'#e2dccd');
  out+=P(`M${x} ${top+len} L${x+w/2-6} ${top+len+22} L${x+w/2+6} ${top+len+22} L${x+w} ${top+len}`,C.line,2,'#f6f3ec');
  const rows=C7_PIG.map(g=>{const K=C7_K(g.k,s.pol),d=s.t*u/(1+K),wd=6+2.2*Math.sqrt(s.t*(1+.3*K));return {...g,K,d,wd,out:d>len}});
  rows.slice().reverse().forEach(r=>{if(r.out)return;const y=top+r.d;out+=R(x+2,Math.max(top,y-r.wd/2),w-4,Math.min(r.wd,top+len-Math.max(top,y-r.wd/2)),r.col,'none',3,'opacity=".82"')});
  const done=rows.filter(r=>r.out).sort((a,b)=>a.K-b.K);
  out+=TBF(230,64,'pigment',13,C.muted,'start')+TBF(410,64,'sticks (K)',13,C.muted,'end')+TBF(560,64,'travelled',13,C.muted,'end');
  rows.forEach((r,i)=>{const y=96+i*42;out+=R(230,y-14,16,16,r.col,'none',3)+TF(254,y,r.n,14,C.ink,'start')+TF(410,y,C7_f(r.K,1),14,C.ink,'end')+TF(560,y,r.out?'eluted':Math.round(r.d/len*100)+'%',14,r.out?C.green:C.ink,'end')});
  out+=TF(230,262,done.length?'washed out: '+done.map(r=>r.n).join(', '):'nothing has washed out yet',13,done.length?C.green:C.muted,'start');
  out+=C7_lines(230,290,C7_wrap('Speed down the column = solvent speed ÷ (1 + K). A pigment that sticks twice as hard spends twice as long held on the chalk.',46),13,C.muted);
  out+=T(330,362,s.t===0?'The extract sits as one green band at the top.':done.length?`${done.length} pigment${done.length>1?'s have':' has'} washed out, least sticky first.`:'The single green band has split by colour.',15);
  return {svg:out,phase:'Tsvet named the method from the Greek for colour-writing (his own surname also means colour in Russian). It was largely ignored until the 1930s, when it was rediscovered for vitamins and carotenoids; today it underlies most chemical analysis.'};
 }});

// Thin-layer plate: three reference dyes and an unknown mixture. Rf = spot distance ÷ solvent-front distance.
const C7_TLC=[{n:'A',k:.4,col:C.purple},{n:'B',k:1.5,col:C.blue},{n:'C',k:4,col:C.coral}];
const C7_rf=(k,pol)=>1/(1+k*Math.exp(-2.5*(pol-.5)));
SCENE({id:'chromatography-tlc',name:'Thin-layer chromatography and Rf',tag:'Measure a spot, identify an unknown',
 definition:'In thin-layer chromatography (TLC) a solvent climbs a plate coated with silica, carrying the spots with it. The retardation factor Rf is the distance a spot travels divided by the distance the solvent front travels. Under the same conditions a compound always has the same Rf.',
 example:'Dye B moves 3.2 cm while the solvent front moves 8.0 cm, so its Rf is 0.40. An unknown spot with Rf 0.40 on the same plate is probably B.',
 desc:'A plate with four lanes: three known dyes and an unknown mixture. The solvent front climbs as you move the slider. Press a spot to measure it: the drawing marks its distance and the front’s, and gives the Rf.',
 research:'Izmailov, N. A. & Shraiber, M. S. (1938). Spot chromatographic adsorption analysis. Farmatsiya 3, 1–7 (early thin-layer separation on a glass slide). Stahl, E. (1956). Dünnschicht-Chromatographie. Pharmazie 11, 633–637 (standardised silica plates). Rf is constant for a given plate, solvent and temperature; the values here are illustrative.',
 dur:10,hint:'Run the solvent near the top, then press the unknown’s spots and compare their Rf with the three standards. Rf stays the same however far the front has gone.',
 init:()=>({h:.8,pol:.5,sel:'U1'}),
 watch(p){return {h:Math.min(.9,lerp(.05,.9,smooth(p/.6))),pol:.5,sel:p<.7?'B':'U1'}},
 ui:[{range:'h',label:'Solvent front',min:.05,max:.9,step:.05,get:s=>s.h,act:'h',show:v=>Math.round(v*100)+'% up'},
  {range:'pol',label:'Solvent polarity',min:0,max:1,step:.05,get:s=>s.pol,act:'pol',show:v=>v<.35?'weak':v<.7?'medium':'strong'}],
 on:{h(s,v){s.h=Number(v)},pol(s,v){s.pol=Number(v)},pick(s,v){s.sel=v}},
 draw(s,f,X){
  let out=heading('A TLC plate: same Rf, same compound',26);
  const px=50,py=52,pw=240,ph=290,base=py+ph-30,run=ph-50,front=base-s.h*run;
  out+=R(px,py,pw,ph,'#fbfbf6',C.line,4,'stroke-width="2"');
  out+=R(px+1,front,pw-2,base-front+30,'#e8f1f7','none',0);
  out+=L(px,base,px+pw,base,C.muted,1.2,'stroke-dasharray="4 4"')+TF(px+pw+6,base+4,'start',13,C.muted,'start');
  out+=L(px,front,px+pw,front,C.blue,2)+(base-front>22?TF(px+pw+6,front+4,'front',13,C.blue,'start'):'');
  const lanes=[...C7_TLC.map(d=>({id:d.n,lab:d.n,spots:[d]})),{id:'U',lab:'unknown',spots:[C7_TLC[1],C7_TLC[2]]}];
  let selInfo=null;
  lanes.forEach((ln,i)=>{const lx=px+34+i*58;out+=TF(lx,py+ph+18,ln.lab,13,C.muted);
   ln.spots.forEach((d,j)=>{const rf=C7_rf(d.k,s.pol),y=base-rf*(front<base?(base-front):0),id=ln.id==='U'?'U'+(j+1):ln.id,on=s.sel===id;
    if(on)selInfo={rf,y,lx,col:d.col,id};
    out+=hit(X,'pick',id,`Spot ${id}, Rf ${C7_f(rf)}`,Ci(lx,y,on?11:9,d.col,on?C.ink:'none',on?'stroke-width="2.5" opacity=".9"':'opacity=".8"'))})});
  if(selInfo&&base-front>40){const {y,lx,rf}=selInfo,mx=px+pw+58;
   out+=L(lx,y,mx,y,C.ink,1,'stroke-dasharray="3 3"');
   out+=arrow(mx,base,mx,y,C.ink,2,7)+arrow(mx+26,base,mx+26,front,C.blue,2,7);
   out+=TF(mx-4,(base+y)/2,'spot',13,C.ink,'end')+TF(mx+30,(base+front)/2,'front',13,C.blue,'start');}
  const tx=430;
  out+=counter(tx,70,'chosen spot',selInfo?selInfo.id:'—',C.ink,150);
  out+=counter(tx,128,'Rf = spot ÷ front',selInfo?C7_f(selInfo.rf):'—',C.blue,150);
  const match=selInfo&&selInfo.id.startsWith('U')?C7_TLC.find(d=>Math.abs(C7_rf(d.k,s.pol)-selInfo.rf)<1e-9):null;
  out+=counter(tx,186,'matches standard',selInfo&&selInfo.id.startsWith('U')?(match?match.n:'none'):'—',C.green,150);
  out+=C7_lines(tx,262,['Press a spot to','measure it. The','unknown has two dyes.'],13,C.muted);
  return {svg:out,phase:'Because Rf is a ratio, it does not depend on how far the front has run, only on the plate, the solvent and the temperature. Chemists run unknowns beside standards on the same plate, because Rf values from different plates rarely agree to better than a few hundredths.'};
 }});

// Gas chromatography: retention t = t0(1 + k), k halving every 30 °C; peak width from a plate number N.
const C7_GC=[{n:'pentane',k:.5},{n:'hexane',k:1.2},{n:'heptane',k:2.8},{n:'octane',k:6.5},{n:'nonane',k:15}];
function C7_gcPeaks(T){const t0=1,N=3000;return C7_GC.map(g=>{const k=g.k*Math.pow(2,-(T-100)/30),t=t0*(1+k);return {...g,k,t,sg:t/Math.sqrt(N)}})}
SCENE({id:'chromatography-gc',name:'Gas chromatography',tag:'Hotter is faster, but peaks merge',
 definition:'In gas chromatography the moving phase is a gas and the stationary phase is a liquid film inside a long, thin column. Each compound comes out at its own retention time. Heating the column makes everything come out sooner, but early peaks crowd together.',
 example:'At 100 °C five alkanes from pentane to nonane come out between about 1.5 and 16 minutes, all cleanly separated. At 190 °C the run takes under 3 minutes, but pentane and hexane begin to overlap.',
 desc:'A chromatogram: detector signal against time. Five peaks, one per alkane, sharpen and crowd as the column temperature rises. Readouts give the run time and the resolution between the two closest peaks, where 1.5 or more means fully separated.',
 research:'James, A. T. & Martin, A. J. P. (1952). Gas–liquid partition chromatography. Biochemical Journal 50, 679–690. Martin, A. J. P. & Synge, R. L. M. (1941). A new form of chromatogram employing two liquid phases. Biochemical Journal 35, 1358–1368 (Nobel Prize in Chemistry 1952). Retention modelled as t = t₀(1 + k), with k halving every 30 °C and 3,000 theoretical plates; the values are illustrative.',
 dur:10,hint:'Find the hottest temperature that still keeps every pair of peaks resolved (1.5 or more). That is the trade-off chromatographers tune every day.',
 init:()=>({T:100}),
 watch(p){return {T:Math.round(lerp(60,200,smooth(p)))}},
 ui:[{range:'T',label:'Column temperature',min:40,max:220,step:5,get:s=>s.T,act:'T',show:v=>v+' °C'}],
 on:{T(s,v){s.T=Number(v)}},
 draw(s){
  const pk=C7_gcPeaks(s.T),tmax=Math.max(3,pk[4].t*1.12);let out=heading(`Five alkanes at ${s.T} °C`,26);
  const pl=C7_plot(60,60,500,210,[0,tmax],[0,1.35],{xt:[0,.25,.5,.75,1].map(u=>[u*tmax,(u*tmax).toFixed(tmax<10?1:0)]),xl:'time after injection (minutes)',yl:'detector signal'});out+=pl.svg;
  const sig=t=>pk.reduce((a,g)=>a+C7_gauss(t,g.t,g.sg)*(.55+.45/(1+g.k*.15)),0);
  out+=C7_poly(range(601).map(i=>{const t=i/600*tmax;return [pl.X(t),pl.Y(Math.min(1.12,sig(t)))]}),C.blue,2.2);
  pk.forEach((g,i)=>{const h=Math.min(1.1,.55+.45/(1+g.k*.15));out+=TF(pl.X(g.t),pl.Y(h)-8-(i%2)*18,g.n,13,C.ink)});
  let rmin=99,pair='';for(let i=0;i<4;i++){const a=pk[i],b=pk[i+1],r=(b.t-a.t)/(2*(a.sg+b.sg));if(r<rmin){rmin=r;pair=a.n+'/'+b.n}}
  out+=counter(60,316,'run time',pk[4].t.toFixed(1)+' min',C.ink,150);
  out+=counter(225,316,'closest pair',pair,C.ink,190);
  out+=counter(430,316,'resolution',rmin.toFixed(2),rmin>=1.5?C.green:C.coral,130);
  return {svg:out,phase:rmin>=1.5?'Every pair is fully resolved. Raising the temperature would save time; the question is how much separation you can afford to lose.':'The earliest peaks now overlap: hot columns hurry everything, and compounds that barely stick have no time to separate. Real instruments ramp the temperature during a run to get both speed and separation.'};
 }});

/* ================================================================ ir-spectroscopy */
// A bond as two masses on a spring: wavenumber = (1/2πc)·√(k/μ). Force constants are typical textbook values.
const C7_AMU=1.66054e-27,C7_CCM=2.99792e10;
const C7_BONDS=[
 {id:'CH',n:'C–H',a:'C',b:'H',ma:12,mb:1,k:500,real:'2850–3000'},
 {id:'OH',n:'O–H',a:'O',b:'H',ma:16,mb:1,k:780,real:'3200–3650'},
 {id:'NH',n:'N–H',a:'N',b:'H',ma:14,mb:1,k:640,real:'3300–3500'},
 {id:'CO',n:'C=O',a:'C',b:'O',ma:12,mb:16,k:1200,real:'1680–1750',order:2},
 {id:'CN',n:'C≡N',a:'C',b:'N',ma:12,mb:14,k:1850,real:'2210–2260',order:3},
 {id:'CCl',n:'C–Cl',a:'C',b:'Cl',ma:12,mb:35,k:350,real:'600–800'}];
const C7_wn=(k,ma,mb)=>{const mu=ma*mb/(ma+mb)*C7_AMU;return Math.sqrt(k/mu)/(2*Math.PI)/C7_CCM};
SCENE({id:'ir-spectroscopy',name:'Bonds as springs',tag:'Why each bond absorbs its own infrared colour',
 definition:'Atoms joined by a bond vibrate like two masses on a spring. A stiffer spring or lighter atoms vibrate faster. A bond absorbs infrared light whose frequency matches its vibration, so each kind of bond leaves a dip at its own wavenumber (waves per centimetre).',
 example:'C–H vibrates near 3,000 cm⁻¹. Swap the hydrogen for deuterium, which is twice as heavy, and the reduced mass almost doubles, so the frequency drops by about √2 to near 2,200 cm⁻¹.',
 desc:'Two balls joined by a spring for the chosen bond, with its force constant and reduced mass. A wavenumber axis from 4,000 to 400 cm⁻¹, divided into regions, marks the calculated absorption and the range found in real molecules.',
 research:'Herschel, W. (1800). Experiments on the refrangibility of the invisible rays of the Sun. Philosophical Transactions 90, 284–292. Coblentz, W. W. (1905). Investigations of Infra-Red Spectra. Carnegie Institution of Washington (the first systematic catalogue of organic spectra). Wavenumber = (1/2πc)√(k/μ); the force constants are typical values and the real ranges are from standard correlation tables (Silverstein, Bassler & Morrill, 1963 onwards).',
 dur:10,hint:'Compare C–H, C=O and C≡N: same carbon, stiffer bonds, higher wavenumber. Then swap H for D.',
 init:()=>({b:'CH',d:false}),
 watch(p){return {b:['CH','OH','CO','CN','CCl'][Math.min(4,Math.floor(p*5))],d:false}},
 ui:[{choose:C7_BONDS.map(b=>[b.id,b.n]),label:'Bond',get:s=>s.b,act:'b'},{b:'Swap H for D',act:'d'}],
 on:{b(s,v){s.b=v;if(!C7_BONDS.find(x=>x.id===v).b.includes('H'))s.d=false},d(s){const bd=C7_BONDS.find(x=>x.id===s.b);if(bd.b==='H')s.d=!s.d}},
 draw(s){
  const bd=C7_BONDS.find(x=>x.id===s.b),mb=bd.b==='H'&&s.d?2:bd.mb,lb=bd.b==='H'&&s.d?'D':bd.b,wn=C7_wn(bd.k,bd.ma,mb),mu=bd.ma*mb/(bd.ma+mb);
  let out=heading(`${bd.a}–${lb}${bd.order===2?' (double)':bd.order===3?' (triple)':''}: a vibrating spring`,26);
  const ra=10+bd.ma*.9,rb=6+mb*.9;let sp='M150 110';for(let i=1;i<=12;i++)sp+=` L${150+i*14} ${110+(i%2?-12:12)}`;sp+=' L330 110';
  out+=P(sp,C.muted,2.4)+Ci(150-ra,110,ra,C.dark)+TBF(150-ra,116,bd.a,16,'#fff')+Ci(330+rb,110,rb,lb==='D'?C.purple:C.coral)+TBF(330+rb,115,lb,14,'#fff');
  out+=arrow(98,150,70,150,C.muted,1.6,6)+arrow(382,150,410,150,C.muted,1.6,6)+TF(240,150,'stretches and squeezes',13,C.muted);
  out+=counter(440,58,'force constant k',bd.k+' N/m',C.ink,130);
  out+=counter(440,112,'reduced mass μ',mu.toFixed(2)+' u',C.ink,130);
  const ax0=50,ax1=550,Xw=v=>ax0+(4000-v)/3600*(ax1-ax0),y=250;
  [[4000,2500,'X–H stretches',C.pale],[2500,2000,'triple',C.amberp],[2000,1500,'double',C.greenp],[1500,400,'fingerprint region',C.purplep]].forEach(([a,b,l,c])=>{out+=R(Xw(a),y-36,Xw(b)-Xw(a),36,c,'none',0)+TF((Xw(a)+Xw(b))/2,y-14,l,13,C.muted)});
  out+=L(ax0,y,ax1,y,C.ink,1.5);[4000,3000,2000,1500,1000,500].forEach(v=>{out+=L(Xw(v),y,Xw(v),y+5,C.ink,1)+TF(Xw(v),y+21,String(v),13,C.muted)});
  out+=TF(300,y+40,'wavenumber (cm⁻¹), high to low as on a real spectrum',13,C.muted);
  const [ra1,rb1]=bd.real.split('–').map(Number),realD=lb==='D'?null:[ra1,rb1];
  if(realD)out+=R(Xw(Math.max(...realD)),y-44,Xw(Math.min(...realD))-Xw(Math.max(...realD)),6,C.green,'none',2);
  out+=L(Xw(wn),y-50,Xw(wn),y,C.coral,3)+Ci(Xw(wn),y-50,5,C.coral);
  out+=T(300,345,`Calculated: ${Math.round(wn).toLocaleString('en-GB')} cm⁻¹${realD?` · real molecules: ${bd.real} cm⁻¹ (green bar)`:' · about 1/√2 of the C–H value'}`,15,C.ink);
  return {svg:out,phase:'The spring picture is crude, since real bonds are not perfect springs and neighbouring atoms shift each band, but it explains the map every chemist uses: hydrogen stretches high, triple bonds next, then double bonds, then a crowded fingerprint region that is unique to each molecule.'};
 }});

// Three real spectra (liquid film, approximate band centres) and a mystery to identify.
const C7_IR={
 ethanol:{n:'ethanol',f:'CH₃CH₂OH',pk:[[3340,260,.9,'O–H stretch, broad because of hydrogen bonding'],[2970,60,.7,'C–H stretch'],[1380,40,.35,'C–H bend'],[1050,45,.85,'C–O stretch']]},
 propanone:{n:'propanone',f:'CH₃COCH₃',pk:[[3005,50,.35,'C–H stretch'],[1715,35,.95,'C=O stretch, strong and sharp'],[1360,35,.6,'C–H bend'],[1220,35,.55,'C–C–C stretch']]},
 ethanoic:{n:'ethanoic acid',f:'CH₃COOH',pk:[[3000,420,.75,'O–H stretch of a carboxylic acid, very broad'],[1710,35,.95,'C=O stretch'],[1290,40,.7,'C–O stretch'],[940,45,.45,'O–H bend']]}};
const C7_IRK=['ethanol','propanone','ethanoic'];
SCENE({id:'ir-spectroscopy-match',name:'Reading an infrared spectrum',tag:'Match peaks to groups, then name a mystery',
 definition:'An infrared spectrum plots how much light gets through (transmittance) against wavenumber. Each dip is a bond absorbing. A strong, sharp dip near 1,700 cm⁻¹ means C=O; a broad dip from 3,200 to 3,600 means O–H held in hydrogen bonds.',
 example:'Ethanol has a broad O–H dip but no C=O. Propanone has a sharp C=O dip but no O–H. Ethanoic acid has both, and its O–H dip is so broad it swallows the C–H stretches.',
 desc:'A transmittance spectrum from 4,000 to 500 cm⁻¹. Press a dip to see which bond causes it. In Mystery mode the name is hidden: read the dips, then press the compound you think it is.',
 research:'Spectral Database for Organic Compounds (SDBS), National Institute of Advanced Industrial Science and Technology, Japan. Silverstein, R. M., Bassler, G. C. & Morrill, T. C. (1963 and later editions). Spectrometric Identification of Organic Compounds. Wiley. Band centres here are approximate liquid-film values; depths are illustrative.',
 dur:12,hint:'In Mystery, look first at 1,700 cm⁻¹ (C=O or not?) and then at 3,000–3,600 (O–H or not?). Two questions are enough here.',
 init:()=>({c:'ethanol',pk:-1,seed:5,guess:''}),
 watch(p){return {c:C7_IRK[Math.min(2,Math.floor(p*3))],pk:Math.floor((p*3%1)*4),seed:5,guess:''}},
 ui:[{choose:[...C7_IRK.map(k=>[k,C7_IR[k].n]),['mystery','Mystery']],label:'Spectrum',get:s=>s.c,act:'c'},{b:'New mystery',act:'nm'}],
 on:{c(s,v){s.c=v;s.pk=-1;s.guess=''},pk(s,v){s.pk=Number(v)},g(s,v){s.guess=v},nm(s){s.c='mystery';s.seed=nextSeed()%997+1;s.pk=-1;s.guess=''}},
 draw(s,f,X){
  const myst=s.c==='mystery',key=myst?C7_IRK[Math.floor(rng(s.seed)()*3)]:s.c,d=C7_IR[key];
  let out=heading(myst?'Mystery spectrum: what is it?':`Infrared spectrum of ${d.n} (${d.f})`,26);
  const pl=C7_plot(60,52,500,200,[4000,500],[0,100],{xt:[[4000,'4000'],[3000,'3000'],[2000,'2000'],[1500,'1500'],[1000,'1000'],[500,'500']],xl:'wavenumber (cm⁻¹)',xlDy:32,yl:'% transmittance',yt:[[50,'50'],[100,'100']]});
  out+=pl.svg;
  const Tr=v=>100-90*Math.min(1,d.pk.reduce((a,[c,w,h])=>a+h*Math.exp(-((v-c)*(v-c))/(2*w*w/4)),0));
  const Xr=pl.X;
  out+=C7_poly(range(351).map(i=>{const v=4000-i*10;return [Xr(v),pl.Y(Tr(v))]}),C.ink,2);
  d.pk.forEach(([c,w,h,lab],i)=>{const on=s.pk===i;out+=hit(X,'pk',i,`Dip near ${c} cm⁻¹`,Ci(Xr(c),pl.Y(Tr(c))+12,on?10:8,on?C.coral:'#fff',C.coral,'stroke-width="2"'))});
  if(s.pk>=0&&d.pk[s.pk]){const [c,,,lab]=d.pk[s.pk];out+=R(60,292,500,40,'#fff',C.grid,8)+TBF(76,316,`${c} cm⁻¹`,14,C.coral,'start')+TF(170,316,lab,14,C.ink,'start')}
  else out+=TF(310,316,'Press a circle under a dip to name the bond.',13,C.muted);
  if(myst){C7_IRK.forEach((k,i)=>{const sel=s.guess===k,ok=sel&&k===key;out+=C7_btn(X,'g',k,`Guess ${C7_IR[k].n}`,70+i*165,342,150,32,C7_IR[k].n,{sel,ink:sel?(ok?C.green:C.coral):C.ink,stroke:sel?(ok?C.green:C.coral):C.line})});}
  else out+=T(300,358,`${d.n}: ${d.pk.length} labelled dips`,15);
  const right=myst&&s.guess===key;
  return {svg:out,phase:myst?(s.guess?(right?`Right: it is ${C7_IR[key].n}.`:`Not ${C7_IR[s.guess].n}. Check for a C=O dip near 1,700 cm⁻¹ and an O–H dip above 3,000.`):'Two dips decide it: C=O near 1,700 and O–H above 3,000.'):'Chemists read the left half first, where few bonds overlap, then use the fingerprint region below 1,500 cm⁻¹ to confirm against a library spectrum.'};
 }});

// Greenhouse gases: a vibration absorbs infrared only if it changes the molecule's dipole.
const C7_MOL={
 CO2:{n:'carbon dioxide',atoms:[['O',-60,0],['C',0,0],['O',60,0]],modes:[
  {n:'symmetric stretch',wn:1340,act:false,mv:[[-1,0],[0,0],[1,0]],why:'Both oxygens move out together; the molecule stays symmetric, so no dipole appears.'},
  {n:'bend',wn:667,act:true,mv:[[0,1],[0,-1],[0,1]],why:'The molecule bends; the centres of charge separate and a dipole flickers on and off.'},
  {n:'asymmetric stretch',wn:2349,act:true,mv:[[1,0],[-1,0],[1,0]],why:'Carbon moves one way, oxygens the other; charge sloshes along the axis.'}]},
 H2O:{n:'water',atoms:[['H',-52,34],['O',0,0],['H',52,34]],modes:[
  {n:'symmetric stretch',wn:3657,act:true,mv:[[-1,.6],[0,-.4],[1,.6]],why:'Water is bent and already polar; stretching changes the size of its dipole.'},
  {n:'bend',wn:1595,act:true,mv:[[.7,.7],[0,-.4],[-.7,.7]],why:'Bending changes the angle and the dipole with it.'},
  {n:'asymmetric stretch',wn:3756,act:true,mv:[[-1,.6],[0,0],[-1,-.6]],why:'One O–H lengthens as the other shortens; the dipole swings.'}]},
 CH4:{n:'methane',atoms:[['H',-50,-40],['H',50,-40],['C',0,0],['H',-50,40],['H',50,40]],modes:[
  {n:'symmetric stretch',wn:2917,act:false,mv:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],why:'All four C–H bonds stretch together; the tetrahedron stays perfectly symmetric.'},
  {n:'asymmetric stretch',wn:3019,act:true,mv:[[-1,-1],[-1,1],[1,0],[1,-1],[1,1]],why:'Some bonds lengthen while others shorten; a dipole appears.'},
  {n:'asymmetric bend',wn:1306,act:true,mv:[[0,1],[0,1],[0,-1],[0,1],[0,1]],why:'The hydrogens tilt together against the carbon; the charge centre shifts.'}]},
 N2:{n:'nitrogen',atoms:[['N',-34,0],['N',34,0]],modes:[{n:'stretch',wn:2331,act:false,mv:[[-1,0],[1,0]],why:'Two identical atoms: however the bond stretches, there is never a dipole. Nitrogen is transparent to Earth’s infrared.'}]},
 O2:{n:'oxygen',atoms:[['O',-34,0],['O',34,0]],modes:[{n:'stretch',wn:1556,act:false,mv:[[-1,0],[1,0]],why:'Two identical atoms, no dipole, no infrared absorption.'}]}};
const C7_MK=['CO2','H2O','CH4','N2','O2'],C7_MLAB={CO2:'CO₂',H2O:'H₂O',CH4:'CH₄',N2:'N₂',O2:'O₂'};
SCENE({id:'ir-spectroscopy-greenhouse',name:'Why some gases trap heat',tag:'Infrared needs a changing dipole',
 definition:'A vibration can absorb infrared only if it changes the molecule’s dipole, the separation of its positive and negative charge. Two-atom molecules of one element, such as N₂ and O₂, never have a dipole, so they let Earth’s infrared through. CO₂, water and methane have vibrations that do, so they absorb it: they are greenhouse gases.',
 example:'CO₂’s bending vibration absorbs at 667 cm⁻¹, a wavelength of 15 µm, right where the warm Earth glows most strongly. Its symmetric stretch, by contrast, is invisible to infrared.',
 desc:'The atoms of the chosen molecule, with arrows showing how they move in the chosen vibration. A verdict says whether the dipole changes and so whether infrared is absorbed. A strip from 4,000 to 400 cm⁻¹ marks the vibration’s wavenumber against the band where Earth emits most of its heat.',
 research:'Foote, E. (1856). Circumstances affecting the heat of the Sun’s rays. American Journal of Science and Arts 22, 382–383 (a tube of CO₂ warmed most in sunlight). Tyndall, J. (1861). On the absorption and radiation of heat by gases and vapours. Philosophical Transactions 151, 1–36. Band centres from Herzberg, G. (1945). Infrared and Raman Spectra of Polyatomic Molecules. Van Nostrand.',
 dur:12,hint:'Try every vibration of CO₂: one is silent to infrared, two absorb. Then compare N₂, which makes up 78% of the air and absorbs none.',
 init:()=>({m:'CO2',v:1}),
 watch(p){const seq=[['CO2',0],['CO2',1],['CO2',2],['H2O',1],['N2',0]],i=Math.min(4,Math.floor(p*5));return {m:seq[i][0],v:seq[i][1]}},
 ui:[{choose:C7_MK.map(k=>[k,C7_MLAB[k]]),label:'Molecule',get:s=>s.m,act:'m'},{b:'Next vibration',act:'v'}],
 on:{m(s,v){s.m=v;s.v=0},v(s){s.v=(s.v+1)%C7_MOL[s.m].modes.length}},
 draw(s){
  const m=C7_MOL[s.m],md=m.modes[s.v%m.modes.length];let out=heading(`${C7_MLAB[s.m]} (${m.n}): ${md.n}`,26);
  const cx=170,cy=140;
  m.atoms.forEach(([el,x,y],i)=>{const [dx,dy]=md.mv[i];if(dx||dy)out+=arrow(cx+x,cy+y,cx+x+dx*34,cy+y+dy*34,C.coral,2.2,7)});
  if(m.atoms.length>2&&s.m!=='CH4')out+=L(cx+m.atoms[0][1],cy+m.atoms[0][2],cx+m.atoms[1][1],cy+m.atoms[1][2],C.line,6)+L(cx+m.atoms[1][1],cy+m.atoms[1][2],cx+m.atoms[2][1],cy+m.atoms[2][2],C.line,6);
  if(s.m==='CH4')m.atoms.forEach(([el,x,y])=>{if(el==='H')out+=L(cx,cy,cx+x,cy+y,C.line,6)});
  if(m.atoms.length===2)out+=L(cx+m.atoms[0][1],cy,cx+m.atoms[1][1],cy,C.line,6);
  m.atoms.forEach(([el,x,y])=>{const r=el==='H'?13:20,col=el==='O'?C.coral:el==='C'?C.dark:el==='N'?C.blue:'#9aa8b1';out+=Ci(cx+x,cy+y,r,col)+TBF(cx+x,cy+y+5,el,14,'#fff')});
  out+=R(330,60,240,130,md.act?C.greenp:C.coralp,'none',10);
  out+=TBF(346,86,md.act?'Dipole changes: absorbs infrared':'No dipole change: infrared passes',14,md.act?C.green:C.coral,'start');
  out+=C7_lines(346,112,C7_wrap(md.why,32),13,C.ink,'start',18);
  const ax0=50,ax1=550,Xw=v=>ax0+(4000-v)/3600*(ax1-ax0),y=290;
  out+=R(Xw(1500),y-34,Xw(400)-Xw(1500),34,C.amberp,'none',0)+TF(Xw(400),y-44,'band where Earth glows most (7–25 µm)',13,C.amber,'end');
  out+=L(ax0,y,ax1,y,C.ink,1.5);[4000,3000,2000,1500,1000,500].forEach(v=>{out+=L(Xw(v),y,Xw(v),y+5,C.ink,1)+TF(Xw(v),y+21,String(v),13,C.muted)});
  out+=L(Xw(md.wn),y-28,Xw(md.wn),y,md.act?C.green:C.muted,3,md.act?'':'stroke-dasharray="4 3"')+Ci(Xw(md.wn),y-28,5,md.act?C.green:C.muted);
  out+=T(300,350,`${md.wn.toLocaleString('en-GB')} cm⁻¹ = ${(10000/md.wn).toFixed(1)} µm${md.act?'':' (seen only by Raman spectroscopy)'}`,15,C.ink);
  return {svg:out,phase:'This selection rule is why the 99% of the air that is nitrogen, oxygen and argon does almost nothing to Earth’s outgoing heat, while a few hundred parts per million of CO₂ matter a great deal. Eunice Foote reported CO₂’s warming in 1856; Tyndall measured the absorption of many gases in 1859–61.'};
 }});

/* ================================================================ nmr */
// Resonance frequency ν = (γ/2π)·B. The population excess ΔN/N ≈ hν/2kT shows why NMR is insensitive.
const C7_NUC={'1H':{n:'hydrogen-1',g:42.577},'13C':{n:'carbon-13',g:10.708},'19F':{n:'fluorine-19',g:40.078},'31P':{n:'phosphorus-31',g:17.235}};
SCENE({id:'nmr',name:'Nuclei in a magnet',tag:'Resonance frequency rises with the field',
 definition:'Some nuclei, such as hydrogen-1 and carbon-13, behave like tiny magnets. In a strong field they line up with it or against it, and the two states differ slightly in energy. Radio waves of exactly the right frequency flip them: that is nuclear magnetic resonance (NMR). The frequency is proportional to the field.',
 example:'Hydrogen nuclei resonate at 42.58 MHz in a field of 1 tesla, so a 9.4 T spectrometer is called a 400 MHz instrument. A 3 T hospital MRI scanner works at about 128 MHz.',
 desc:'A nucleus precessing in a field drawn as vertical lines, beside two energy levels whose gap widens with the field. Readouts give the resonance frequency and how many extra nuclei per million sit in the lower level at room temperature.',
 research:'Rabi, I. I., Zacharias, J. R., Millman, S. & Kusch, P. (1938). A new method of measuring nuclear magnetic moment. Physical Review 53, 318. Purcell, E. M., Torrey, H. C. & Pound, R. V. (1946). Physical Review 69, 37–38; Bloch, F., Hansen, W. W. & Packard, M. (1946). Physical Review 69, 127 (NMR in bulk matter; Nobel Prize in Physics 1952). Lauterbur, P. C. (1973). Nature 242, 190–191 (imaging; Nobel 2003 with Mansfield). ν = (γ/2π)B with CODATA gyromagnetic ratios; ΔN/N ≈ hν/2kT at 298 K.',
 dur:10,hint:'Raise the field: the gap and the frequency grow together, and so does the tiny excess of aligned nuclei, which is why stronger magnets give stronger signals.',
 init:()=>({B:9.4,nuc:'1H'}),
 watch(p){return {B:Math.round(lerp(1,23.5,smooth(p))*10)/10,nuc:'1H'}},
 ui:[{range:'B',label:'Magnetic field',min:1,max:23.5,step:.1,get:s=>s.B,act:'B',show:v=>Number(v).toFixed(1)+' T'},
  {choose:Object.keys(C7_NUC).map(k=>[k,k.replace(/^(\d+)/,m=>m.replace(/\d/g,c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[c]))]),label:'Nucleus',get:s=>s.nuc,act:'nuc'}],
 on:{B(s,v){s.B=Number(v)},nuc(s,v){s.nuc=v}},
 draw(s){
  const nu=C7_NUC[s.nuc],f=nu.g*s.B,ex=6.62607e-34*f*1e6/(2*1.380649e-23*298)*1e6;
  let out=heading(`${nu.n} at ${s.B.toFixed(1)} T`,26);
  for(let i=0;i<5;i++)out+=arrow(70+i*45,330,70+i*45,70,'#c9dbe7',2,8);
  out+=TF(40,62,'field B',13,C.muted,'start');
  const cx=160,cy=200;out+=P(`M${cx-48} ${cy-58} Q${cx} ${cy-80} ${cx+48} ${cy-58}`,C.purple,1.6,'none','stroke-dasharray="4 3"');
  out+=P(`M${cx-48} ${cy-58} Q${cx} ${cy-36} ${cx+48} ${cy-58}`,C.purple,1.6);
  out+=L(cx,cy,cx+30,cy-62,C.purple,4)+Ci(cx,cy,16,C.coral)+TBF(cx,cy+5,s.nuc==='1H'?'H':s.nuc.replace(/\d/g,''),13,'#fff');
  out+=TF(cx,cy+40,'precesses about the field',13,C.muted);
  const gap=Math.min(150,8+f/1000*140),mid=200;
  out+=L(300,mid+gap/2,400,mid+gap/2,C.blue,3)+L(300,mid-gap/2,400,mid-gap/2,C.coral,3);
  out+=TF(406,mid+gap/2+5,'aligned (lower)',13,C.blue,'start')+TF(406,mid-gap/2+5,'against (higher)',13,C.coral,'start');
  out+=arrow(350,mid+gap/2-4,350,mid-gap/2+6,C.purple,2.2,7)+TF(344,mid,'radio photon',13,C.purple,'end');
  out+=counter(300,56,'resonance frequency',f<1000?f.toFixed(1)+' MHz':(f/1000).toFixed(2)+' GHz',C.purple,150);
  out+=counter(460,56,'spare per million',ex.toFixed(1),C.blue,130);
  out+=T(300,360,`ν = ${nu.g.toFixed(2)} MHz/T × ${s.B.toFixed(1)} T = ${f.toFixed(0)} MHz`,15);
  return {svg:out,phase:`Only about ${ex.toFixed(0)} nuclei in every million are spare in the lower level; the signal comes from that tiny excess. That is why NMR needs strong magnets and why carbon-13, rarer and weaker, takes far longer to record than hydrogen-1.`};
 }});

// Proton environments with chemical shift δ (ppm), drawn at 60 MHz so that splitting is visible.
const C7_NMR={
 ethanol:{n:'ethanol',grp:[{l:'CH₃',d:1.22,h:3,m:3},{l:'CH₂',d:3.69,h:2,m:4},{l:'OH',d:2.61,h:1,m:1,note:'position varies with concentration'}]},
 mace:{n:'methyl ethanoate',grp:[{l:'CH₃C=O',d:2.05,h:3,m:1},{l:'OCH₃',d:3.67,h:3,m:1}]},
 toluene:{n:'methylbenzene',grp:[{l:'CH₃',d:2.35,h:3,m:1},{l:'ring H',d:7.2,h:5,m:1,note:'five ring H overlap in one cluster'}]}};
const C7_BIN=n=>{let r=[1];for(let i=0;i<n;i++)r=[...r,0].map((v,j)=>v+(j?r[j-1]:0));return r};
const C7_MULT=['singlet','doublet','triplet','quartet','quintet','sextet','septet'];
SCENE({id:'nmr-shift',name:'Chemical shift',tag:'Each kind of hydrogen sings its own note',
 definition:'Electrons around a nucleus shield it slightly from the magnet, so hydrogens in different surroundings resonate at slightly different frequencies. The chemical shift δ measures this in parts per million (ppm) from a reference, tetramethylsilane (TMS) at 0. Hydrogens near electronegative atoms such as oxygen are less shielded and appear further left.',
 example:'Ethanol shows three groups of peaks: CH₃ near 1.2 ppm, CH₂ next to oxygen near 3.7 ppm, and OH near 2.6 ppm. The areas under them are in the ratio 3 : 2 : 1, the numbers of hydrogens.',
 desc:'An NMR spectrum from 10 to 0 ppm, drawn as on a 60 MHz instrument, with a stepped integration line above the peaks. The molecule’s groups appear as buttons; press a group or a peak to link them.',
 research:'Proctor, W. G. & Yu, F. C. (1950). The dependence of a nuclear magnetic resonance frequency upon chemical compound. Physical Review 77, 717. Arnold, J. T., Dharmatti, S. S. & Packard, M. E. (1951). Chemical effects on nuclear induction signals from organic compounds. Journal of Chemical Physics 19, 507 (the first ethanol spectrum, three peaks in ratio 3 : 2 : 1). Shift values are typical ones in CDCl₃.',
 dur:12,hint:'Press each group and check the integration step: the step heights count the hydrogens.',
 init:()=>({m:'ethanol',g:0}),
 watch(p){const i=Math.min(2,Math.floor(p*3));return {m:['ethanol','mace','toluene'][i],g:Math.floor((p*3%1)*2)}},
 ui:[{choose:Object.keys(C7_NMR).map(k=>[k,C7_NMR[k].n]),label:'Molecule',get:s=>s.m,act:'m'}],
 on:{m(s,v){s.m=v;s.g=0},g(s,v){s.g=Number(v)}},
 draw(s,f,X){
  const d=C7_NMR[s.m],g=d.grp[Math.min(s.g,d.grp.length-1)];let out=heading(`¹H NMR of ${d.n}`,26);
  const pl=C7_plot(60,56,500,190,[10,0],[0,1.25],{xt:[10,8,6,4,2,0].map(v=>[v,String(v)]),xl:'chemical shift δ (ppm)',xlDy:32});
  const Xp=v=>60+(10-v)/10*500;out+=pl.svg+R(Xp(g.d+.3),pl.Y(1.0),Xp(g.d-.3)-Xp(g.d+.3),pl.Y(0)-pl.Y(1.0),C.coralp,'none',3);
  const J=7/60,hz=.03;
  const sig=v=>d.grp.reduce((a,gg)=>{const c=C7_BIN(gg.m-1),tot=c.reduce((x,y)=>x+y,0);return a+c.reduce((b,cv,j)=>b+cv/tot*gg.h/3*C7_gauss(v,gg.d+(j-(gg.m-1)/2)*J,hz),0)},0);
  out+=C7_poly(range(1001).map(i=>{const v=10-i/100;return [Xp(v),pl.Y(Math.min(1.2,sig(v)*.9))]}),C.ink,1.6);
  let acc=0;const tot=d.grp.reduce((a,b)=>a+b.h,0),order=d.grp.map((gg,i)=>({...gg,i})).sort((a,b)=>b.d-a.d);
  let ip=[[Xp(10),pl.Y(1.18)]];order.forEach(gg=>{const x1=Xp(gg.d+.35),x2=Xp(gg.d-.35);ip.push([x1,pl.Y(1.18-acc/tot*.45)]);acc+=gg.h;ip.push([x2,pl.Y(1.18-acc/tot*.45)])});ip.push([Xp(0),ip[ip.length-1][1]]);
  out+=C7_poly(ip,C.green,1.6);out+=TF(Xp(9.9),pl.Y(1.18)-6,'integration',13,C.green,'start');
  out+=L(Xp(0),pl.Y(0),Xp(0),pl.Y(.25),C.muted,1.5)+TF(Xp(0)-4,pl.Y(.3),'TMS',13,C.muted,'end');
  d.grp.forEach((gg,i)=>{const on=i===s.g;out+=C7_btn(X,'g',i,`Group ${gg.l}`,60+i*170,298,156,34,gg.l,{sel:on,ink:on?C.coral:C.ink,stroke:on?C.coral:C.line,bold:on})});
  out+=T(300,362,`${g.l}: δ ${g.d} ppm, ${g.h} H, ${C7_MULT[g.m-1]}${g.note?' · '+g.note:''}`,15,C.ink);
  return {svg:out,phase:'The position says what a hydrogen is next to, the area says how many there are, and the splitting says how many neighbours it has. Together they let chemists piece a structure together, which is why NMR became the organic chemist’s main tool from the 1960s.'};
 }});

SCENE({id:'nmr-splitting',name:'Splitting and the n + 1 rule',tag:'Neighbours split a peak into a pattern',
 definition:'Hydrogens on the next carbon along nudge a peak into several lines. With n equivalent neighbours the peak splits into n + 1 lines whose heights follow Pascal’s triangle. The spacing, the coupling constant J, is measured in hertz and does not depend on the magnet’s strength.',
 example:'In ethanol the CH₃ has two neighbours on the CH₂, so it is a triplet with heights 1 : 2 : 1. The CH₂ has three neighbours, so it is a quartet, 1 : 3 : 3 : 1. Both are split by about 7 Hz.',
 desc:'A multiplet drawn on a hertz scale with n + 1 lines and their relative heights, beside Pascal’s triangle with the current row highlighted. Readouts convert the multiplet’s width into ppm for a 60 MHz and the chosen instrument.',
 research:'Gutowsky, H. S., McCall, D. W. & Slichter, C. P. (1951). Coupling among nuclear magnetic dipoles in molecules. Physical Review 84, 589–590. Hahn, E. L. & Maxwell, D. E. (1951). Chemical shift and field independent frequency modulation of the spin echo envelope. Physical Review 84, 1246. The n + 1 rule holds for equivalent neighbours and coupling much smaller than the shift difference (first-order spectra).',
 dur:10,hint:'Count the neighbours, add one. Then raise the instrument frequency: the pattern stays the same width in hertz but shrinks in ppm, so overlapping multiplets pull apart.',
 init:()=>({n:2,J:7,mhz:400}),
 watch(p){return {n:Math.min(6,Math.floor(p*7)),J:7,mhz:p<.6?60:400}},
 ui:[{range:'n',label:'Equivalent neighbours',min:0,max:6,step:1,get:s=>s.n,act:'n',show:v=>v+' H'},
  {range:'J',label:'Coupling J',min:2,max:16,step:.5,get:s=>s.J,act:'J',show:v=>v+' Hz'},
  {choose:[[60,'60 MHz'],[400,'400 MHz'],[900,'900 MHz']],label:'Instrument',get:s=>s.mhz,act:'mhz'}],
 on:{n(s,v){s.n=Number(v)},J(s,v){s.J=Number(v)},mhz(s,v){s.mhz=Number(v)}},
 draw(s){
  const c=C7_BIN(s.n),mx=Math.max(...c);let out=heading(`${s.n} neighbours → ${s.n+1} lines: a ${C7_MULT[s.n]}`,26);
  const x0=50,w=300,y0=260,span=Math.max(8*16,s.n*s.J+30),X=hz=>x0+w/2+hz/span*w;
  out+=L(x0,y0,x0+w,y0,C.ink,1.5);[-span/2,-span/4,0,span/4,span/2].forEach(v=>{out+=L(X(v),y0,X(v),y0+5,C.ink,1)+TF(X(v),y0+20,(v>0?'+':'')+Math.round(v),13,C.muted)});
  out+=TF(x0+w/2,y0+40,'offset from the centre (Hz)',13,C.muted);
  c.forEach((v,j)=>{const hz=(j-s.n/2)*s.J,h=v/mx*170;out+=L(X(hz),y0,X(hz),y0-h,C.blue,4)+TF(X(hz),y0-h-7,String(v),13,C.blue)});
  if(s.n>0){const a=X(-s.n/2*s.J),b=X(-s.n/2*s.J+s.J);out+=L(a,y0-200,b,y0-200,C.coral,1.5)+TF((a+b)/2,y0-206,'J',13,C.coral)}
  const tx=420;out+=TBF(tx+70,60,'Pascal’s triangle',13,C.muted);
  for(let r=0;r<=6;r++){const row=C7_BIN(r);row.forEach((v,j)=>{const x=tx+70+(j-r/2)*24,y=84+r*22;out+=TF(x,y,String(v),13,r===s.n?C.coral:C.muted,'middle',r===s.n?'font-weight="700"':'')})}
  const widthHz=s.n*s.J;
  out+=counter(390,250,'width at 60 MHz',(widthHz/60).toFixed(3)+' ppm',C.ink,95);
  out+=counter(490,250,`at ${s.mhz} MHz`,(widthHz/s.mhz).toFixed(3)+' ppm',C.purple,95);
  out+=T(300,350,`Heights ${c.join(' : ')} · total width ${widthHz.toFixed(1)} Hz`,15);
  return {svg:out,phase:'Each neighbour’s spin is either with or against the field, and the combinations add up like coin tosses: that is where Pascal’s triangle comes from. Because J is fixed in hertz while shifts scale with the magnet, bigger magnets spread a spectrum out and untangle overlapping multiplets.'};
 }});

/* ================================================================ mass-spectrometry */
// Magnetic sector: an ion accelerated through V has r = √(2mV/q)/B. Neon has isotopes 20, 21, 22.
const C7_NE=[[20,90.48],[21,.27],[22,9.25]],C7_V=2000,C7_R0=.15,C7_E=1.602177e-19;
const C7_rad=(m,B)=>Math.sqrt(2*m*C7_AMU*C7_V/C7_E)/B;
const C7_mzAt=B=>C7_E*Math.pow(B*C7_R0,2)/(2*C7_V)/C7_AMU;
SCENE({id:'mass-spectrometry',name:'Weighing atoms with a magnet',tag:'Neon turns out to be two kinds of atom',
 definition:'A mass spectrometer turns molecules into ions, speeds them up with a voltage and bends them with a magnet. Heavier ions bend less, so each mass-to-charge ratio (m/z) follows its own curve. Tuning the field brings each m/z in turn onto the detector, and the signal at each m/z gives a mass spectrum.',
 example:'In 1913 J. J. Thomson saw neon split into two traces, at mass 20 and mass 22: the first proof that a stable element can have isotopes. About 90% of neon is neon-20 and about 9% is neon-22.',
 desc:'An ion source on the left, a magnetic field region, and curved paths for neon-20, -21 and -22, drawn thicker for the more common ions. A slit and detector sit where only one radius reaches. On the right, the mass spectrum built by sweeping the field, with a marker at the m/z now being detected.',
 research:'Thomson, J. J. (1913). Bakerian Lecture: Rays of positive electricity. Proceedings of the Royal Society A 89, 1–20. Aston, F. W. (1919). A positive ray spectrograph. Philosophical Magazine 38, 707–714 (Nobel Prize in Chemistry 1922). Dempster, A. J. (1918). A new method of positive ray analysis. Physical Review 11, 316–325. Natural neon abundances from IUPAC (90.48, 0.27, 9.25%). Ions accelerated through 2,000 V onto a 0.15 m radius.',
 dur:11,hint:'Sweep the field slowly. The big peak is neon-20; a little higher field brings in neon-22. Neon-21 is there too, but only about 1 atom in 400.',
 init:()=>({B:.192}),
 watch(p){return {B:Math.round(lerp(.18,.21,p)*1000)/1000}},
 ui:[{range:'B',label:'Magnetic field',min:.15,max:.25,step:.001,get:s=>s.B,act:'B',show:v=>Number(v).toFixed(3)+' T'}],
 on:{B(s,v){s.B=Number(v)}},
 draw(s){
  let out=heading('A magnetic-sector mass spectrometer',26);
  const sx=60,sy=320,scale=120/C7_R0,det=sx+2*C7_R0*scale;
  out+=R(sx-40,sy-6,40,12,C.dark,'none',3)+TF(sx-20,sy+24,'ions in',13,C.muted);
  out+=P(`M${sx} ${sy} A${120*1.4} ${120*1.4} 0 0 1 ${sx+2*120*1.4} ${sy}`,'none',0,'#eef3f8','opacity=".8"');
  out+=TF(sx+150,sy-205,'magnetic field into the page',13,C.muted);
  C7_NE.forEach(([m,ab])=>{const r=C7_rad(m,s.B)*scale,hitDet=Math.abs(r-120)<1.6;
   out+=P(`M${sx} ${sy} A${fmt(r)} ${fmt(r)} 0 0 1 ${fmt(sx+2*r)} ${sy}`,m===20?C.blue:m===22?C.coral:C.purple,Math.max(1.2,Math.sqrt(ab)*.5),'none',hitDet?'':'opacity=".55"');
   if(m!==21&&(sx+2*r<det-12||sx+2*r>det+12))out+=TF(sx+2*r,sy+(m===22?34:18),String(m),13,m===20?C.blue:C.coral)});
  out+=R(det-10,sy-4,20,30,C.green,'none',3)+TF(det,sy+44,'detector',13,C.green);
  const mz=C7_mzAt(s.B);
  const pl=C7_plot(400,70,170,190,[19,23],[0,100],{xt:[[19,'19'],[20,'20'],[21,'21'],[22,'22'],[23,'23']],xl:'m/z',xlDy:32,yl:'abundance (%)',yt:[[0,'0'],[50,'50'],[100,'100']]});out+=pl.svg;
  const sp=x=>C7_NE.reduce((a,[m,ab])=>a+ab*C7_gauss(x,m,.06),0);
  out+=C7_poly(range(401).map(i=>{const x=19+i/100;return [pl.X(x),pl.Y(Math.min(100,sp(x)))]}),C.ink,1.6);
  if(mz>=19&&mz<=23)out+=L(pl.X(mz),pl.Y(0),pl.X(mz),pl.Y(100),C.green,2,'stroke-dasharray="4 3"');
  const sig=sp(mz);
  out+=counter(400,296,'tuned to m/z',mz.toFixed(2),C.green,82);
  out+=counter(488,296,'detector signal',sig<.05?'—':sig.toFixed(1)+'%',C.ink,82);
  return {svg:out,phase:'Each radius depends on √m, so the isotopes land a few centimetres apart. Aston’s better instrument went on to find isotopes in most elements and to show that atomic masses are not exactly whole numbers, the mass defect that measures nuclear binding energy.'};
 }});

// Isotope patterns: convolve Cl (35/37) and Br (79/81) distributions.
const C7_CL=[[0,.7576],[2,.2424]],C7_BR=[[0,.5069],[2,.4931]];
function C7_pattern(nc,nb){let d={0:1};const add=iso=>{const nd={};for(const [k,v] of Object.entries(d))for(const [dm,p] of iso){const kk=Number(k)+dm;nd[kk]=(nd[kk]||0)+v*p}d=nd};for(let i=0;i<nc;i++)add(C7_CL);for(let i=0;i<nb;i++)add(C7_BR);const mx=Math.max(...Object.values(d));return Object.entries(d).map(([k,v])=>[Number(k),v/mx*100]).sort((a,b)=>a[0]-b[0])}
SCENE({id:'mass-spectrometry-isotopes',name:'Isotope patterns',tag:'Count the chlorines and bromines from the peaks',
 definition:'Chlorine is about three parts chlorine-35 to one part chlorine-37, and bromine is almost exactly half bromine-79 and half bromine-81. So molecules containing them show clusters of peaks two mass units apart, with heights set by the numbers of each atom, like coin tosses with biased coins.',
 example:'A molecule with one chlorine shows peaks at M and M + 2 in a ratio of about 3 : 1. With two chlorines the ratio is about 9 : 6 : 1. One bromine gives two peaks of nearly equal height.',
 desc:'Bars for the molecular-ion cluster M, M + 2, M + 4 and so on, scaled so the tallest is 100, for your chosen numbers of chlorine and bromine atoms. In Try it a mystery pattern is drawn in outline: match it.',
 research:'IUPAC Commission on Isotopic Abundances: Cl-35 75.76%, Cl-37 24.24%; Br-79 50.69%, Br-81 49.31%. McLafferty, F. W. & Tureček, F. (1993). Interpretation of Mass Spectra, 4th edn. University Science Books (isotope-cluster rules). The pattern is the product of independent binomial choices for each atom.',
 dur:10,hint:'Start from the number of peaks: n halogen atoms give n + 1 peaks. Then use the heights to tell chlorine from bromine.',
 init:()=>({cl:1,br:0,seed:7}),
 watch(p){const seq=[[1,0],[2,0],[0,1],[1,1],[0,2]],i=Math.min(4,Math.floor(p*5));return {cl:seq[i][0],br:seq[i][1],seed:7}},
 ui:[{range:'cl',label:'Chlorine atoms',min:0,max:3,step:1,get:s=>s.cl,act:'cl',show:v=>String(v)},
  {range:'br',label:'Bromine atoms',min:0,max:2,step:1,get:s=>s.br,act:'br',show:v=>String(v)},{b:'New mystery',act:'nm'}],
 on:{cl(s,v){s.cl=Number(v)},br(s,v){s.br=Number(v)},nm(s){s.seed=nextSeed()%997+1}},
 draw(s,f,X){
  const r=rng(s.seed),mc=Math.floor(r()*4),mb=Math.floor(r()*3),mys=X&&X.try?C7_pattern(mc,mb):null,pat=C7_pattern(s.cl,s.br);
  let out=heading(`${s.cl} Cl, ${s.br} Br: the molecular-ion cluster`,26);
  const mmax=Math.max(4,...pat.map(p=>p[0]),...(mys||[]).map(p=>p[0]));
  const pl=C7_plot(70,60,470,220,[-1,mmax+1],[0,110],{xt:range(mmax/2+1).map(i=>[i*2,i?'M+'+i*2:'M']),yt:[[0,'0'],[50,'50'],[100,'100']],yl:'relative height'});out+=pl.svg;
  if(mys)mys.forEach(([m,h])=>{out+=R(pl.X(m)-20,pl.Y(h),40,pl.Y(0)-pl.Y(h),'none',C.coral,2,'stroke-width="2" stroke-dasharray="5 4"')});
  pat.forEach(([m,h])=>{out+=R(pl.X(m)-13,pl.Y(h),26,pl.Y(0)-pl.Y(h),C.blue,'none',2)+TF(pl.X(m),pl.Y(h)-6,Math.round(h).toString(),13,C.blue)});
  const match=mys&&mc===s.cl&&mb===s.br;
  out+=T(300,330,`Ratio ${pat.map(p=>Math.round(p[1])).join(' : ')}`,16,C.ink);
  out+=TF(300,356,mys?(match?'Match: your counts give the mystery pattern.':'Dashed outline: the mystery pattern to match.'):'Two mass units apart, because each heavy isotope adds 2.',13,mys?(match?C.green:C.coral):C.muted);
  return {svg:out,phase:'Chemists use these clusters every day to spot halogens at a glance. The same arithmetic, applied to carbon-13 (1.1% of carbon), gives every organic molecule a small M + 1 peak whose height hints at how many carbons it has.'};
 }});

// Butanone, M = 72: cutting each C–C bond explains fragment peaks (approximate EI relative intensities).
const C7_BUT={bonds:[
 {id:'a',x:155,frags:[[15,'CH₃⁺'],[57,'C₂H₅CO⁺']]},
 {id:'b',x:265,frags:[[43,'CH₃CO⁺ (acylium, the base peak)'],[29,'C₂H₅⁺']]},
 {id:'c',x:375,frags:[[15,'CH₃⁺'],[57,'CH₃COCH₂⁺']]}],
 peaks:[[15,7],[27,10],[29,15],[43,100],[57,6],[72,20]]};
SCENE({id:'mass-spectrometry-fragments',name:'Breaking molecules into pieces',tag:'Fragments reveal the skeleton',
 definition:'In electron-impact mass spectrometry a fast electron knocks an electron out of the molecule, making a molecular ion M⁺•. Many of these fall apart, usually at weak bonds or next to groups that stabilise the positive charge. The fragment masses tell you which pieces the molecule was built from.',
 example:'Butanone, CH₃COCH₂CH₃, has a molecular ion at m/z 72. Its tallest peak, the base peak, is at 43: CH₃CO⁺, made when the bond between the carbonyl carbon and the ethyl group breaks.',
 desc:'The structure of butanone with its three carbon–carbon bonds labelled a, b and c. Below it, the mass spectrum with peaks at 15, 27, 29, 43, 57 and 72. Press a bond to cut it: the two fragments it can give are marked on the spectrum.',
 research:'NIST Chemistry WebBook, butanone electron-ionisation spectrum (relative intensities here are approximate). McLafferty, F. W. (1959). Mass spectrometric analysis: molecular rearrangements. Analytical Chemistry 31, 82–87. McLafferty, F. W. & Tureček, F. (1993). Interpretation of Mass Spectra. Fenn, J. B. and Tanaka, K. shared the 2002 Nobel Prize for gentle ionisation methods that keep proteins whole.',
 dur:11,hint:'Cut each bond and see which peaks you can now explain. One peak (27) needs more than a single cut: it is C₂H₃⁺, an ethyl fragment that has also lost two hydrogens.',
 init:()=>({cut:['b']}),
 watch(p){return {cut:['a','b','c'].slice(0,Math.min(3,Math.floor(p*4)))}},
 ui:[{b:'Clear cuts',act:'clr'}],
 on:{cut(s,v){s.cut=s.cut.includes(v)?s.cut.filter(x=>x!==v):[...s.cut,v]},clr(s){s.cut=[]}},
 draw(s,f,X){
  let out=heading('Butanone, CH₃COCH₂CH₃ (M = 72)',26);
  const atoms=[[100,'CH₃'],[210,'C'],[320,'CH₂'],[430,'CH₃']],y=90;
  C7_BUT.bonds.forEach(b=>{const on=s.cut.includes(b.id);out+=hit(X,'cut',b.id,`Cut bond ${b.id}`,G(R(b.x-30,y-18,60,36,'#fff0','none',0)+L(b.x-26,y,b.x+26,y,on?C.coral:C.ink,3,on?'stroke-dasharray="6 5"':'')+TF(b.x,y-14,b.id,13,on?C.coral:C.muted)))});
  atoms.forEach(([x,l])=>{out+=TBF(x,y+6,l,18,C.ink)});
  out+=L(210,y+16,210,y+40,C.ink,2)+L(216,y+16,216,y+40,C.ink,2)+TBF(213,y+58,'O',16,C.coral);
  const pl=C7_plot(60,190,500,120,[0,80],[0,125],{xt:[0,20,40,60,80].map(v=>[v,String(v)])});out+=pl.svg+TF(566,pl.Y(0)+4,'m/z',13,C.muted,'start');
  const expl=new Map();s.cut.forEach(id=>C7_BUT.bonds.find(b=>b.id===id).frags.forEach(([m,l])=>{if(!expl.has(m))expl.set(m,l)}));expl.set(72,'M⁺•, the whole molecule');
  C7_BUT.peaks.forEach(([m,h])=>{const on=expl.has(m);out+=R(pl.X(m)-5,pl.Y(h),10,pl.Y(0)-pl.Y(h),on?C.coral:C.line,'none',2)+TF(m===27?pl.X(m)-7:pl.X(m),pl.Y(h)-5,String(m),13,on?C.coral:C.muted,m===27?'end':'middle')});
  const explained=C7_BUT.peaks.filter(p=>expl.has(p[0])).length;
  const ex=[...expl].filter(([m])=>m!==72).sort((a,b)=>b[0]-a[0]);
  out+=TF(300,166,ex.length?ex.map(([m,l])=>m+' = '+l.split(' (')[0]).join(' · '):'Press a bond to cut it.',13,C.coral);
  out+=T(300,362,`${explained} of 6 peaks explained (72 is the whole molecule)`,15,C.ink);
  return {svg:out,phase:'The charge usually stays on the fragment that holds it best: CH₃CO⁺ shares the charge with its oxygen, so it is far more common than C₂H₅⁺, and 43 is the base peak. Libraries of hundreds of thousands of spectra now let software suggest a structure from a fragment pattern in seconds.'};
 }});

/* ================================================================ crystallography */
// Bragg's law nλ = 2d sinθ, with a diffraction curve from N = 12 planes.
SCENE({id:'crystallography',name:'Bragg’s law',tag:'X-rays reflect from planes of atoms',
 definition:'Atoms in a crystal lie in regular planes. X-rays scattered from neighbouring planes add up only when the extra path, 2d sinθ, is a whole number of wavelengths: nλ = 2d sinθ. Measuring the angles of strong reflections gives the spacing d between planes, and from many reflections the positions of the atoms.',
 example:'With copper X-rays (λ = 1.5406 Å) and the (200) planes of rock salt, 2.82 Å apart, the first strong reflection comes at θ = 15.9°.',
 desc:'Two rows of atoms, an incoming X-ray beam and reflected beams. The extra path taken by the lower beam is highlighted and compared with the wavelength. A graph of reflected intensity against angle shows sharp peaks where Bragg’s law holds, with a marker at your angle.',
 research:'Friedrich, W., Knipping, P. & Laue, M. (1912). Interferenz-Erscheinungen bei Röntgenstrahlen. Sitzungsberichte der Bayerischen Akademie der Wissenschaften, 303–322. Bragg, W. L. (1913). The diffraction of short electromagnetic waves by a crystal. Proceedings of the Cambridge Philosophical Society 17, 43–57. Bragg, W. H. & Bragg, W. L. (1913). The structure of some crystals as indicated by their diffraction of X-rays. Proceedings of the Royal Society A 89, 248–277 (Nobel Prize in Physics 1915). Intensity drawn for 12 planes.',
 dur:11,hint:'Sweep the angle and watch the path difference: a reflection appears only when it equals λ, 2λ or 3λ. Then change the wavelength and see the peaks move.',
 init:()=>({th:15.9,lam:1.5406,d:2.82}),
 watch(p){return {th:Math.round(lerp(8,50,p)*10)/10,lam:1.5406,d:2.82}},
 ui:[{range:'th',label:'Angle θ',min:5,max:60,step:.1,get:s=>s.th,act:'th',show:v=>Number(v).toFixed(1)+'°'},
  {range:'lam',label:'Wavelength λ',min:.7,max:2.3,step:.01,get:s=>s.lam,act:'lam',show:v=>Number(v).toFixed(2)+' Å'},
  {range:'d',label:'Plane spacing d',min:1.5,max:4,step:.01,get:s=>s.d,act:'d',show:v=>Number(v).toFixed(2)+' Å'}],
 on:{th(s,v){s.th=Number(v)},lam(s,v){s.lam=Number(v)},d(s,v){s.d=Number(v)}},
 draw(s){
  const t=s.th*Math.PI/180,pd=2*s.d*Math.sin(t),nn=pd/s.lam,n=Math.round(nn),ok=n>=1&&Math.abs(nn-n)<.03;
  let out=heading('X-rays and two planes of atoms',26);
  const y1=190,dpx=24*s.d,y2=y1+dpx,cx=160;
  for(let i=0;i<9;i++){out+=Ci(40+i*30,y1,6,C.dark)+Ci(40+i*30,y2,6,C.dark)}
  const L1=120,ux=Math.cos(t),uy=Math.sin(t),A=[cx,y1],B=[cx,y2],e=dpx*uy;
  out+=arrow(A[0]-L1*ux,A[1]-L1*uy,A[0],A[1],C.blue,2.4,8)+arrow(A[0],A[1],A[0]+L1*ux,A[1]-L1*uy,C.blue,2.4,8);
  out+=arrow(B[0]-(L1+e)*ux,B[1]-(L1+e)*uy,B[0],B[1],C.purple,2.4,8)+arrow(B[0],B[1],B[0]+(L1+e)*ux,B[1]-(L1+e)*uy,C.purple,2.4,8);
  out+=L(B[0]-e*ux,B[1]-e*uy,B[0],B[1],C.coral,5)+L(B[0],B[1],B[0]+e*ux,B[1]-e*uy,C.coral,5);
  out+=TF(300,y1+4,'d = '+s.d.toFixed(2)+' Å',13,C.muted,'start')+L(292,y1,292,y2,C.muted,1.5);
  out+=TF(40,330,'orange: the extra path 2d sinθ',13,C.coral,'start');
  const pl=C7_plot(370,70,200,180,[5,60],[0,1.05],{xt:[[5,'5°'],[30,'30°'],[60,'60°']],xl:'angle θ',xlDy:32,yl:'reflected intensity'});out+=pl.svg;
  const I=deg=>{const tt=deg*Math.PI/180,ph=2*Math.PI*2*s.d*Math.sin(tt)/s.lam,den=Math.sin(ph/2),N=12;return Math.abs(den)<1e-6?1:Math.pow(Math.sin(N*ph/2)/(N*den),2)};
  out+=C7_poly(range(551).map(i=>{const dg=5+i/10;return [pl.X(dg),pl.Y(I(dg))]}),C.blue,1.6);
  out+=L(pl.X(s.th),pl.Y(0),pl.X(s.th),pl.Y(1.05),C.coral,2,'stroke-dasharray="4 3"');
  out+=counter(370,296,'2d sinθ',pd.toFixed(3)+' Å',C.coral,95);
  out+=counter(475,296,'in wavelengths',nn.toFixed(2)+' λ',ok?C.green:C.ink,95);
  out+=T(190,362,ok?`In step: n = ${n}, a strong reflection`:'Out of step: the waves cancel',15,ok?C.green:C.coral);
  return {svg:out,phase:'Father and son, William Henry and Lawrence Bragg, used this rule in 1913 to show that rock salt has no NaCl molecules at all, only alternating ions in a cubic grid. X-ray crystallography went on to reveal penicillin, vitamin B₁₂, DNA and the first proteins.'};
 }});

// Unit cells: NaCl, CsCl and diamond, with shared atoms counted by position.
const C7_CELLS={
 NaCl:{n:'sodium chloride (rock salt)',a:5.64,M:58.44,fu:4,coord:6,
  atoms:()=>{const L=[];for(const x of [0,.5,1])for(const y of [0,.5,1])for(const z of [0,.5,1]){const k=[x,y,z].filter(v=>v===.5).length;L.push({p:[x,y,z],el:k%2===0?'Cl':'Na'})}return L},centre:[.5,.5,.5],nb:[[0,.5,.5],[1,.5,.5],[.5,0,.5],[.5,1,.5],[.5,.5,0],[.5,.5,1]]},
 CsCl:{n:'caesium chloride',a:4.12,M:168.36,fu:1,coord:8,
  atoms:()=>{const L=[];for(const x of [0,1])for(const y of [0,1])for(const z of [0,1])L.push({p:[x,y,z],el:'Cl'});L.push({p:[.5,.5,.5],el:'Cs'});return L},centre:[.5,.5,.5],nb:[[0,0,0],[1,0,0],[0,1,0],[0,0,1],[1,1,0],[1,0,1],[0,1,1],[1,1,1]]},
 diamond:{n:'diamond (carbon)',a:3.567,M:12.011,fu:8,coord:4,
  atoms:()=>{const L=[];for(const x of [0,1])for(const y of [0,1])for(const z of [0,1])L.push({p:[x,y,z],el:'C'});[[.5,.5,0],[.5,.5,1],[.5,0,.5],[.5,1,.5],[0,.5,.5],[1,.5,.5],[.25,.25,.25],[.75,.75,.25],[.75,.25,.75],[.25,.75,.75]].forEach(p=>L.push({p,el:'C'}));return L},centre:[.25,.25,.25],nb:[[0,0,0],[.5,.5,0],[.5,0,.5],[0,.5,.5]]}};
const C7_share=p=>{const k=p.filter(v=>v===0||v===1).length;return [1,1/2,1/4,1/8][k]};
const C7_ELC={Na:C.purple,Cl:C.green,Cs:C.coral,C:C.dark},C7_ELR={Na:10,Cl:14,Cs:15,C:9};
function C7_cellCount(c){const tot={};c.atoms().forEach(a=>{tot[a.el]=(tot[a.el]||0)+C7_share(a.p)});return tot}
SCENE({id:'crystallography-lattice',name:'Unit cells',tag:'Count the atoms a crystal really owns',
 definition:'A unit cell is a box that builds the whole crystal by repeating. The primitive cell is the smallest such box; crystallographers often use a larger conventional cell that shows the crystal’s symmetry, like the cubes drawn here (rock salt’s holds four formula units, its primitive cell one). Atoms on its corners, edges and faces are shared with neighbouring cells: a corner atom counts as 1/8, an edge atom 1/4, a face atom 1/2 and an atom inside counts whole. The count, the cell size and the atomic masses give the crystal’s density.',
 example:'Rock salt’s cubic cell holds 8 × 1/8 + 6 × 1/2 = 4 chloride ions and 12 × 1/4 + 1 = 4 sodium ions. With a cell 5.64 Å across, its density works out at 2.16 g/cm³, as measured.',
 desc:'A unit cell drawn in perspective for rock salt, caesium chloride or diamond, with each atom coloured by element. The count of shared atoms, the coordination number and the density calculated from the cell appear as readouts. The 3D view can be turned to see the lattice from any side.',
 research:'Bragg, W. L. (1913). The structure of some crystals as indicated by their diffraction of X-rays. Proceedings of the Royal Society A 89, 248–277 (rock salt and caesium-type halides). Bragg, W. H. & Bragg, W. L. (1913). The structure of the diamond. Nature 91, 557. Cell edges: NaCl 5.64 Å, CsCl 4.12 Å, diamond 3.567 Å; density = (atoms × molar mass)/(Avogadro’s number × a³).',
 dur:12,hint:'Show the neighbours of the central atom: six in rock salt, eight in caesium chloride, four in diamond. Then turn the 3D view.',
 init:()=>({c:'NaCl',nb:true}),
 watch(p){return {c:['NaCl','CsCl','diamond'][Math.min(2,Math.floor(p*3))],nb:(p*3%1)>.4}},
 ui:[{choose:Object.keys(C7_CELLS).map(k=>[k,k==='diamond'?'diamond':k]),label:'Crystal',get:s=>s.c,act:'c'},{b:'Neighbours on/off',act:'nb'}],
 on:{c(s,v){s.c=v},nb(s){s.nb=!s.nb}},
 draw(s){
  const c=C7_CELLS[s.c],cnt=C7_cellCount(c),dens=c.fu*c.M/(6.02214e23*Math.pow(c.a*1e-8,3));
  let out=heading(`${c.n}: one unit cell`,26);
  const pr=([x,y,z])=>[150+x*170+y*80,300-z*170-y*60];
  const E=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]],ed=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  ed.forEach(([a,b])=>{const p=pr(E[a]),q=pr(E[b]);out+=L(p[0],p[1],q[0],q[1],C.line,1.5)});
  if(s.nb)c.nb.forEach(n=>{const p=pr(c.centre),q=pr(n);out+=L(p[0],p[1],q[0],q[1],C.coral,2.4)});
  c.atoms().slice().sort((a,b)=>b.p[1]-a.p[1]).forEach(a=>{const q=pr(a.p),isC=a.p.every((v,i)=>v===c.centre[i]),isN=s.nb&&c.nb.some(n=>n.every((v,i)=>v===a.p[i]));
   out+=Ci(q[0],q[1],C7_ELR[a.el]*(isC&&s.nb?1.25:1),C7_ELC[a.el],isN||(isC&&s.nb)?C.coral:'#fff','stroke-width="2"')});
  const tx=430;let y=64;
  Object.entries(cnt).forEach(([el,n])=>{out+=Ci(tx+8,y+10,7,C7_ELC[el])+TF(tx+22,y+15,`${el}: ${Number.isInteger(n)?n:n.toFixed(2)} per cell`,14,C.ink,'start');y+=26});
  out+=counter(tx,y+8,'neighbours of centre',String(c.coord),C.coral,140);
  out+=counter(tx,y+62,'density from the cell',dens.toFixed(2)+' g/cm³',C.blue,140);
  out+=C7_lines(tx,y+132,['corner 1/8 · edge 1/4','face 1/2 · inside 1'],13,C.muted);
  return {svg:out,phase:'Counting shared atoms is how chemists check a proposed structure: the density it predicts must match the density measured on a real crystal. For diamond, each carbon bonds to four others in a tetrahedron, which is why it is so hard.'};
 },
 three(s,f,X,project){
  const c=C7_CELLS[s.c],P=project([-.15,1.15,-.15,1.15,-.15,1.15]);let out='';
  const E=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]],ed=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  ed.forEach(([a,b])=>{out+=line3(E[a],E[b],P,C.line,1.4)});
  const items=c.atoms().map(a=>({at:a.p,svg:PP=>point3(a.p,PP,C7_ELC[a.el],C7_ELR[a.el]*.9,'#fff')}));
  if(s.nb)c.nb.forEach(n=>items.push({at:[(n[0]+c.centre[0])/2,(n[1]+c.centre[1])/2,(n[2]+c.centre[2])/2],svg:PP=>line3(c.centre,n,PP,C.coral,2.6)}));
  out+=sortedItems(items,P);
  return {svg:out,title:`${s.c} unit cell in 3D`,caption:'Orange lines join the central atom to its nearest neighbours.'};
 }});

// Milestones of crystallography, with structure size on a log scale.
const C7_XTAL=[
 {y:1913,t:'Rock salt',who:'W. H. and W. L. Bragg',atoms:2,d:'The first structure solved: no NaCl molecules, only alternating ions.'},
 {y:1929,t:'A flat benzene ring',s:'Benzene ring',who:'Kathleen Lonsdale',atoms:12,d:'Hexamethylbenzene crystals showed the six-carbon ring is flat and regular, ending a long argument.'},
 {y:1945,t:'Penicillin',who:'Dorothy Crowfoot Hodgkin',atoms:23,d:'Confirmed the strained four-membered β-lactam ring that many chemists had doubted; published 1949.'},
 {y:1952,t:'Photo 51 (DNA fibre)',s:'Photo 51',who:'Rosalind Franklin and Raymond Gosling',atoms:null,d:'The X-shaped pattern of a DNA fibre that pointed to a helix; used, without her knowledge, by Watson and Crick.'},
 {y:1955,t:'Vitamin B₁₂',who:'Dorothy Crowfoot Hodgkin',atoms:93,d:'The largest structure then solved by X-rays, using early computers; Nobel Prize in Chemistry 1964.'},
 {y:1958,t:'Myoglobin',who:'John Kendrew',atoms:1200,d:'The first protein structure: a tangle of helices that no one had predicted.'},
 {y:1969,t:'Insulin',who:'Dorothy Crowfoot Hodgkin',atoms:405,d:'35 years after her first insulin photograph in 1934.'}];
SCENE({id:'crystallography-hodgkin',name:'From salt to insulin',tag:'What crystallography revealed, and who did it',
 definition:'From 1913 X-ray crystallography moved from simple salts to the molecules of life. Each step needed better crystals, more reflections and more calculation; women such as Kathleen Lonsdale, Dorothy Crowfoot Hodgkin and Rosalind Franklin did much of the defining work.',
 example:'Dorothy Crowfoot Hodgkin solved penicillin in 1945, vitamin B₁₂ in 1955 and insulin in 1969, and won the Nobel Prize in Chemistry in 1964, the third woman to do so.',
 desc:'A timeline of seven milestones from 1913 to 1969. Press one to read what was found and by whom. A bar chart on a log scale compares how many non-hydrogen atoms each structure placed.',
 research:'Lonsdale, K. (1929). The structure of the benzene ring in C₆(CH₃)₆. Proceedings of the Royal Society A 123, 494–515. Crowfoot, D. et al. (1949). The X-ray crystallographic investigation of the structure of penicillin. In Chemistry of Penicillin, Princeton University Press. Hodgkin, D. C. et al. (1956). Structure of vitamin B₁₂. Nature 178, 64–66. Kendrew, J. C. et al. (1958). Nature 181, 662–666. Adams, M. J. et al. (1969). Structure of rhombohedral 2 zinc insulin crystals. Nature 224, 491–495. Franklin, R. E. & Gosling, R. G. (1953). Nature 171, 740–741. Atom counts exclude hydrogen and are approximate for the proteins.',
 dur:12,hint:'Press the milestones in order and watch the bars: in fifty years the structures grew from 2 atoms to over a thousand.',
 init:()=>({k:2}),
 watch(p){return {k:Math.min(6,Math.floor(p*7))}},
 ui:[{b:'Previous',act:'step',arg:-1},{b:'Next',act:'step',arg:1}],
 on:{step(s,v){s.k=clamp(s.k+Number(v),0,6)},k(s,v){s.k=Number(v)}},
 draw(s,f,X){
  let out=heading('Crystallography milestones, 1913–1969',26);
  const y=74;out+=L(48,y,552,y,C.line,3);
  C7_XTAL.forEach((e,i)=>{const x=48+i*84,on=i===s.k;out+=hit(X,'k',i,`${e.y}: ${e.t}`,Ci(x,y,on?11:8,on?C.coral:'#fff',on?C.coral:C.blue,'stroke-width="2.5"')+TF(x,y+(i%2?-18:28),String(e.y),13,on?C.coral:C.muted))});
  const e=C7_XTAL[s.k];out+=R(36,114,528,92,'#fff',C.grid,10);
  out+=TBF(52,140,`${e.y} · ${e.t}`,16,C.ink,'start')+TF(548,140,e.who,13,C.purple,'end');
  out+=C7_lines(52,166,C7_wrap(e.d,78),14,C.ink,'start',19);
  const bx=150,bw=400,Xl=v=>bx+Math.log10(v)/Math.log10(2000)*bw;
  C7_XTAL.forEach((m,i)=>{const yy=222+i*20,on=i===s.k;out+=TF(bx-8,yy+12,m.s||m.t,13,on?C.coral:C.muted,'end');
   if(m.atoms)out+=R(bx,yy,Xl(m.atoms)-bx,14,on?C.coral:C.blue,'none',3,'opacity=".85"')+TF(Xl(m.atoms)+6,yy+12,String(m.atoms),13,C.ink,'start');else out+=TF(bx+4,yy+12,'fibre pattern, not a crystal structure',13,C.muted,'start')});
  return {svg:out,phase:'Each step up in size needed new methods: heavy atoms to fix phases, then electronic computers to sum thousands of reflections. Today over 200,000 protein structures are in the Protein Data Bank, and AlphaFold’s predictions were trained on them.'};
 }});

/* ================================================================ titration */
// Strong acid (25.00 mL of 0.100 M HCl) titrated with 0.100 M NaOH; exact pH from the charge balance.
const C7_KW=1e-14;
function C7_pHstrong(v,ca=.1,va=25,cb=.1){const V=va+v,d=(ca*va-cb*v)/V,h=d/2+Math.sqrt(d*d/4+C7_KW);return -Math.log10(h)}
function C7_pHweak(v,ka=1.75e-5,ca=.1,va=25,cb=.1){const V=va+v,A=ca*va/V,Na=cb*v/V;let lo=-14,hi=0;for(let i=0;i<70;i++){const m=(lo+hi)/2,h=Math.pow(10,m),f=h+Na-A*ka/(ka+h)-C7_KW/h;if(f>0)hi=m;else lo=m}return -(lo+hi)/2}
function C7_phth(pH){const u=clamp((pH-8.2)/1.8,0,1);return u<=0?'#f4f8fb':`rgb(${Math.round(244-(244-211)*u)},${Math.round(248-(248-53)*u)},${Math.round(251-(251-155)*u)})`}
SCENE({id:'titration',name:'Titrating to the end point',tag:'One drop turns the flask pink',
 definition:'In a titration you add a solution of known concentration from a burette, a drop at a time, until it has exactly reacted with a measured volume of the unknown. An indicator changes colour at the end point. For a strong acid and a strong base the pH leaps from about 4 to about 10 within a single drop at the equivalence point.',
 example:'25.00 mL of 0.100 mol/dm³ hydrochloric acid needs 25.00 mL of 0.100 mol/dm³ sodium hydroxide. At 24.95 mL the pH is 4.0; one more drop, at 25.05 mL, takes it to 10.0, and phenolphthalein turns pink.',
 desc:'A burette over a conical flask. The flask stays colourless until the pH passes about 8.2, then turns pink. A graph of pH against volume added fills in as you add base, with the equivalence point at 25.00 mL marked.',
 research:'Gay-Lussac, J. L. (1824, 1832) standardised volumetric analysis with the burette. Mohr, K. F. (1855). Lehrbuch der chemisch-analytischen Titrirmethode (the clamped burette). Sørensen, S. P. L. (1909). Biochemische Zeitschrift 21, 131–304 (the pH scale). pH calculated exactly from the charge balance with Kw = 1.0 × 10⁻¹⁴ at 25 °C. In a real lab, wear eye protection: sodium hydroxide and hydrochloric acid are irritants even at 0.1 mol/dm³.',
 dur:12,hint:'Add 5 mL at a time until 20 mL, then slow to drops near 25 mL. The colour should change on a single drop.',
 init:()=>({v:0}),
 watch(p){return {v:Math.round(lerp(0,32,smooth(p/.95))*20)/20}},
 ui:[{b:'+5 mL',act:'add',arg:5},{b:'+1 mL',act:'add',arg:1},{b:'+0.1 mL',act:'add',arg:.1},{b:'+1 drop',act:'add',arg:.05}],
 on:{add(s,v){const before=C7_pHstrong(s.v);s.v=Math.min(50,Math.round((s.v+Number(v))*100)/100);const after=C7_pHstrong(s.v);AUDIO.tone(1400,{dur:.03,gain:.04,type:'triangle'});if(before<8.2&&after>=8.2)AUDIO.tone(880,{dur:.4,gain:.07,at:.05})}},
 draw(s){
  const pH=C7_pHstrong(s.v);let out=heading('HCl in the flask, NaOH from the burette',26);
  const bx=110,btop=46,bh=200,lvl=btop+12+s.v/50*(bh-24);
  out+=R(bx-9,btop,18,bh,'#f6fafc',C.line,4,'stroke-width="1.5"')+R(bx-7,lvl,14,btop+bh-lvl-2,'#dbe9f3','none',2);
  for(let i=0;i<=5;i++){const yy=btop+12+i/5*(bh-24);out+=L(bx-9,yy,bx-2,yy,C.muted,1)+TF(bx-13,yy+4,String(i*10),13,C.muted,'end')}
  out+=R(bx-3,btop+bh,6,22,C.line,'none',2);
  const fy=300;out+=P(`M${bx-14} ${fy-48} L${bx-14} ${fy-30} L${bx-56} ${fy+30} L${bx+56} ${fy+30} L${bx+14} ${fy-30} L${bx+14} ${fy-48}`,C.line,2,C7_phth(pH));
  out+=TF(bx,fy+50,`${s.v.toFixed(2)} mL added`,14,C.ink);
  const pl=C7_plot(250,60,310,230,[0,50],[0,14],{xt:[[0,'0'],[25,'25'],[50,'50 mL']],yt:[[0,'0'],[7,'7'],[14,'14']],yl:'pH',xl:'volume of NaOH added',xlDy:32});out+=pl.svg;
  out+=L(pl.X(25),pl.Y(0),pl.X(25),pl.Y(14),C.muted,1,'stroke-dasharray="4 4"')+TF(pl.X(25)+4,pl.Y(13.2),'equivalence',13,C.muted,'start');
  out+=R(pl.X(0),pl.Y(10),pl.X(50)-pl.X(0),pl.Y(8.2)-pl.Y(10),'#f3d6e8','none',0,'opacity=".6"')+TF(pl.X(50)-6,pl.Y(9.1)+5,'pink above 8.2',13,'#a8357a','end');
  const pts=[];for(let v=0;v<=s.v+1e-9;v=Math.round((v+.05)*100)/100)pts.push([pl.X(v),pl.Y(C7_pHstrong(v))]);
  out+=C7_poly(pts,C.coral,2.2)+Ci(pl.X(s.v),pl.Y(pH),5,C.coral);
  out+=T(405,350,`pH ${pH.toFixed(2)}${pH>=8.2?' · pink: end point reached':''}`,16,pH>=8.2?C.coral:C.ink);
  return {svg:out,phase:pH>=8.2&&s.v<26?'The flask turned pink within a drop of 25.00 mL: so few hydrogen ions are left near equivalence that one drop of base swings the pH by six units.':'Far from equivalence the pH barely moves, because there is still plenty of acid (or, past 25 mL, plenty of base) to swamp each drop.'};
 }});

// Strong against weak acid, and which indicator changes inside the steep jump.
const C7_IND={mo:{n:'methyl orange',lo:3.1,hi:4.4,c1:'#d9483b',c2:'#e9b623'},bb:{n:'bromothymol blue',lo:6.0,hi:7.6,c1:'#d9c23b',c2:'#2f6db5'},pp:{n:'phenolphthalein',lo:8.2,hi:10.0,c1:'#f4f8fb',c2:'#d3359b'}};
function C7_volAt(f,pH){let lo=0,hi=50;for(let i=0;i<60;i++){const m=(lo+hi)/2;if(f(m)<pH)lo=m;else hi=m}return (lo+hi)/2}
SCENE({id:'titration-curves',name:'Choosing an indicator',tag:'Strong and weak acids jump in different places',
 definition:'A weak acid such as ethanoic acid only partly ionises, so its titration curve starts higher, rises gently through a buffer region and jumps at a higher pH, about 8.7, because the salt formed is slightly alkaline. An indicator works only if its colour change falls inside the steep jump.',
 example:'Halfway to equivalence (12.5 mL) the pH of ethanoic acid equals its pKa, 4.76. Phenolphthalein, changing at 8.2–10, suits it; methyl orange, changing at 3.1–4.4, would change many millilitres too early.',
 desc:'Titration curves for 25 mL of 0.100 mol/dm³ hydrochloric acid or ethanoic acid with 0.100 mol/dm³ sodium hydroxide. A coloured band marks the chosen indicator’s range. A readout gives the volume at which the indicator changes and how far that is from the true equivalence point.',
 research:'Henderson, L. J. (1908). American Journal of Physiology 21, 173–179; Hasselbalch, K. A. (1916). Biochemische Zeitschrift 78, 112–144 (pH = pKa + log [A⁻]/[HA]). Kolthoff, I. M. (1937). Acid–Base Indicators. Macmillan. Ka of ethanoic acid 1.75 × 10⁻⁵ at 25 °C; curves calculated exactly from the charge balance.',
 dur:12,hint:'Try every indicator on each acid. For the strong acid all three land within about two drops of equivalence; for the weak acid only one does.',
 init:()=>({a:'weak',ind:'pp'}),
 watch(p){const seq=[['strong','mo'],['strong','pp'],['weak','mo'],['weak','bb'],['weak','pp']],i=Math.min(4,Math.floor(p*5));return {a:seq[i][0],ind:seq[i][1]}},
 ui:[{choose:[['strong','HCl (strong)'],['weak','ethanoic (weak)']],label:'Acid',get:s=>s.a,act:'a'},{choose:Object.keys(C7_IND).map(k=>[k,C7_IND[k].n]),label:'Indicator',get:s=>s.ind,act:'ind'}],
 on:{a(s,v){s.a=v},ind(s,v){s.ind=v}},
 draw(s){
  const f=s.a==='weak'?v=>C7_pHweak(v):v=>C7_pHstrong(v),ind=C7_IND[s.ind];
  let out=heading(`${s.a==='weak'?'Ethanoic acid':'Hydrochloric acid'} with ${ind.n}`,26);
  const pl=C7_plot(70,56,360,250,[0,40],[0,14],{xt:[[0,'0'],[12.5,'12.5'],[25,'25'],[40,'40 mL']],yt:[[0,'0'],[4,'4'],[7,'7'],[10,'10'],[14,'14']],yl:'pH',xl:'volume of NaOH added',xlDy:32});out+=pl.svg;
  out+=R(pl.X(0),pl.Y(ind.hi),pl.X(40)-pl.X(0),pl.Y(ind.lo)-pl.Y(ind.hi),ind.c2,'none',0,'opacity=".22"');
  out+=TF(pl.X(0)+6,pl.Y(ind.hi)-5,`${ind.n} changes at pH ${ind.lo}–${ind.hi}`,13,C.muted,'start');
  const other=s.a==='weak'?v=>C7_pHstrong(v):v=>C7_pHweak(v);
  out+=C7_poly(range(401).map(i=>{const v=i/10;return [pl.X(v),pl.Y(other(v))]}),C.line,1.5,'stroke-dasharray="5 4"');
  out+=C7_poly(range(401).map(i=>{const v=i/10;return [pl.X(v),pl.Y(f(v))]}),C.coral,2.6);
  out+=L(pl.X(25),pl.Y(0),pl.X(25),pl.Y(14),C.muted,1,'stroke-dasharray="3 3"');
  if(s.a==='weak')out+=Ci(pl.X(12.5),pl.Y(f(12.5)),5,C.purple)+TF(pl.X(12.5)+8,pl.Y(f(12.5))+18,`pH = pKa = ${f(12.5).toFixed(2)}`,13,C.purple,'start');
  const vm=C7_volAt(f,(ind.lo+ind.hi)/2),err=vm-25;
  out+=counter(450,70,'pH at equivalence',f(25).toFixed(2),C.ink,120);
  out+=counter(450,128,'colour changes at',vm.toFixed(2)+' mL',C.ink,120);
  out+=counter(450,186,'error',(err>0?'+':err<0?'−':'')+Math.abs(err).toFixed(2)+' mL',Math.abs(err)<.1?C.green:C.coral,120);
  out+=C7_lines(450,262,['Dashed curve: the','other acid, for','comparison.'],13,C.muted);
  out+=T(300,366,Math.abs(err)<.1?'A good choice: the colour changes inside the jump.':`Poor choice: it changes ${Math.abs(err).toFixed(1)} mL ${err<0?'too early':'too late'}.`,15,Math.abs(err)<.1?C.green:C.coral);
  return {svg:out,phase:'The rule is simple: pick an indicator whose range sits inside the vertical part of the curve. Weak acids need indicators that change in alkaline solution; weak bases need ones that change in acid. Where no indicator fits, chemists follow the pH with an electrode instead.'};
 }});

// Three accurate runs plus a rough one; concordant titres within 0.10 mL are averaged.
SCENE({id:'titration-concordant',name:'Concordant results',tag:'Repeat until two titres agree',
 definition:'One titration is not enough. Chemists do a quick rough run to find the end point roughly, then careful runs adding drops near the end, until at least two titres are concordant, within 0.10 mL of each other. The mean of the concordant titres gives the concentration.',
 example:'Titres of 25.80 (rough), 24.15, 24.25 and 24.20 mL: the last three are concordant, their mean is 24.20 mL, and an acid neutralised by 24.20 mL of 0.100 mol/dm³ base in a 25.00 mL sample has concentration 0.100 × 24.20 ÷ 25.00 = 0.0968 mol/dm³.',
 desc:'A results table of titres for an acid of unknown concentration, with the rough run marked and concordant pairs ticked. Readouts give the mean titre, the calculated concentration and, once two concordant titres exist, the true value for comparison.',
 research:'Standard volumetric practice: a 25.00 mL pipette and a class A 50 mL burette read to ±0.05 mL at each end (BS EN ISO 385). Harris, D. C. (2015). Quantitative Chemical Analysis, 9th edn. W. H. Freeman. Run-to-run scatter here is simulated with a seeded random reading error.',
 dur:11,hint:'Do one rough run, then accurate runs until two agree within 0.10 mL. Compare your answer with the true concentration revealed at the end.',
 init:()=>({seed:11,runs:[]}),
 watch(p){return {seed:11,runs:['r','a','a','a'].slice(0,Math.min(4,Math.floor(p*5)))}},
 ui:[{b:'Rough run',act:'run',arg:'r'},{b:'Accurate run',act:'run',arg:'a'},{b:'New sample',act:'ns'}],
 on:{run(s,v){if(s.runs.length<6)s.runs=[...s.runs,v]},ns(s){s.seed=nextSeed()%997+1;s.runs=[]}},
 draw(s){
  const r=rng(s.seed),ca=.08+r()*.04,eq=ca*25/.1;const tit=s.runs.map((k,i)=>{const rr=rng(s.seed*31+i*7+1);return k==='r'?Math.round((eq+.4+rr()*.8)*20)/20:Math.round((eq+(rr()-.5)*.24)*20)/20});
  let out=heading('Titrating an acid of unknown concentration',26);
  out+=TF(60,62,'25.00 mL of acid, titrated with 0.100 mol/dm³ NaOH',13,C.muted,'start');
  out+=TBF(80,92,'run',13,C.muted,'start')+TBF(200,92,'titre (mL)',13,C.muted,'end')+TBF(240,92,'type',13,C.muted,'start')+TBF(320,92,'concordant',13,C.muted,'start');
  const acc=tit.map((t,i)=>({t,i,rough:s.runs[i]==='r'})).filter(x=>!x.rough);
  const conc=new Set();acc.forEach(a=>acc.forEach(b=>{if(a.i!==b.i&&Math.abs(a.t-b.t)<=.10+1e-9){conc.add(a.i);conc.add(b.i)}}));
  tit.forEach((t,i)=>{const y=118+i*28,rough=s.runs[i]==='r';out+=TF(80,y,String(i+1),14,C.ink,'start')+TF(200,y,t.toFixed(2),14,rough?C.muted:C.ink,'end')+TF(240,y,rough?'rough':'accurate',14,rough?C.muted:C.ink,'start')+(conc.has(i)?TF(345,y,'✓',16,C.green,'start'):'')});
  if(!tit.length)out+=TF(80,124,'No runs yet: start with a rough run.',14,C.muted,'start');
  const used=[...conc].map(i=>tit[i]),mean=used.length?used.reduce((a,b)=>a+b,0)/used.length:null,cc=mean?.1*mean/25:null;
  out+=counter(432,90,'mean concordant titre',mean?mean.toFixed(2)+' mL':'—',C.blue,140);
  out+=counter(432,148,'acid concentration',cc?cc.toFixed(4)+' M':'—',C.ink,140);
  out+=counter(432,206,'true concentration',used.length>=2?ca.toFixed(4)+' M':'hidden',used.length>=2?C.green:C.muted,140);
  if(cc)out+=TF(495,280,`error ${((cc-ca)/ca*100).toFixed(2)}%`,13,Math.abs(cc-ca)/ca<.005?C.green:C.coral);
  out+=T(300,350,mean?`c = 0.100 × ${mean.toFixed(2)} ÷ 25.00 = ${cc.toFixed(4)} mol/dm³`:'Two titres within 0.10 mL are needed.',15);
  return {svg:out,phase:'Each burette reading carries about ±0.05 mL, so a titre carries about ±0.1 mL: under half a per cent on 24 mL. That is why titration, two centuries old, is still used to check the concentrations that newer instruments are calibrated against.'};
 }});
