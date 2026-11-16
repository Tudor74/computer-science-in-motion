/* ===================== Senses era 1 · The eye ===================== */
// Optics, rods and cones, the dark, three cone types, opponent colours and colour blindness.
// Every picture is a pure function of state; simulated data use seeded generators (S1_rng).
// Curves for cone and rod sensitivity are smooth Gaussian approximations, labelled as such.
// Safety: nothing flashes; the afterimage demo uses moderate contrast and a single switch after 15 s.
const S1_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const S1_rng=n=>rng(S1_mix(n));
const S1_g=(x,m,s)=>Math.exp(-.5*((x-m)/s)**2);
// Approximate sensitivities (peaks after Bowmaker & Dartnall 1980: S 420, M 534, L 564, rods 498 nm).
const S1_cone=l=>({S:S1_g(l,420,30),M:S1_g(l,534,42),L:S1_g(l,564,45),R:S1_g(l,498,40)});
const S1_V=l=>S1_g(l,555,42),S1_Vs=l=>S1_g(l,507,40);
function S1_wl(l,k=1){let r=0,g=0,b=0;
 if(l<440){r=(440-l)/60;b=1}else if(l<490){g=(l-440)/50;b=1}else if(l<510){g=1;b=(510-l)/20}else if(l<580){r=(l-510)/70;g=1}else if(l<645){r=1;g=(645-l)/65}else r=1;
 const f=l<420?.3+.7*(l-380)/40:l>700?.3+.7*(780-l)/80:1,c=v=>Math.round(255*Math.pow(clamp(v*f*k,0,1),.8));
 return `rgb(${c(r)},${c(g)},${c(b)})`}
const S1_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function S1_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
const S1_lines=(x,y,lines,size=13,fill=C.ink,gap=18,anchor='start')=>lines.map((t,i)=>TF(x,y+i*gap,t,size,fill,anchor)).join('');
const S1_hex=v=>'#'+v.map(c=>Math.round(clamp(c,0,255)).toString(16).padStart(2,'0')).join('');
const S1_lin=c=>{c/=255;return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4)};
const S1_gam=c=>255*(c<=.0031308?12.92*c:1.055*Math.pow(c,1/2.4)-.055);
// Dichromat simulation matrices in linear RGB (Viénot, Brettel & Mollon 1999; tritan after Machado et al. 2009). Approximate.
const S1_SIM={normal:null,
 protan:[[.11238,.88762,0],[.11238,.88762,0],[.00401,-.00401,1]],
 deutan:[[.29275,.70725,0],[.29275,.70725,0],[-.02234,.02234,1]],
 tritan:[[1.255528,-.076749,-.178779],[-.078411,.930809,.147602],[.004733,.691367,.3039]]};
function S1_sim(hex,type){const m=S1_SIM[type];if(!m)return hex;const v=[1,3,5].map(i=>S1_lin(parseInt(hex.slice(i,i+2),16)));
 return S1_hex(m.map(r=>S1_gam(clamp(r[0]*v[0]+r[1]*v[1]+r[2]*v[2],0,1))))}

/* =========================== eye-optics =========================== */
// Reduced eye: 60 D when relaxed, retina 16.7 mm behind the lens. Accommodation amplitude by age from
// Hofstetter's average formula A = 18.5 − 0.3 × age (dioptres), with a small floor.
const S1_AGES=[[10,'10'],[25,'25'],[45,'45'],[65,'65']];
const S1_amp=age=>Math.max(.75,18.5-.3*age);
const S1_dist=v=>.08*Math.pow(75,v/100); // slider 0–100 → 0.08–6 m
const S1_m=d=>d>=1?fmt(Math.round(d*10)/10)+' m':Math.round(d*100)+' cm';
function S1_eyeDraw(focusMm,retinaMm,objY,lensLabel){
 const k=12,lx=300,cy=196,rx=lx+retinaMm*k,fx=lx+Math.min(focusMm,24)*k,h=46;
 let out=P(`M${lx-20} ${cy-100} Q${lx-60} ${cy} ${lx-20} ${cy+100}`,C.line,2)+P(`M${lx-20} ${cy-100} Q${rx+30} ${cy-110} ${rx+12} ${cy} Q${rx+30} ${cy+110} ${lx-20} ${cy+100}`,C.line,2);
 out+=L(rx,cy-70,rx,cy+70,C.coral,4)+TF(rx+6,cy-78,'retina',13,C.coral,'start');
 out+=`<ellipse cx="${lx}" cy="${cy}" rx="10" ry="${h+4}" fill="${C.pale}" stroke="${C.blue}" stroke-width="2"/>`+TF(lx,cy+h+26,lensLabel,13,C.blue);
 const iy=cy-objY*.35;
 [-h,0,h].forEach(dy=>{const ox=60,oy=cy-objY;out+=L(ox,oy,lx,cy+dy,'#e0a24a',1.8);
  const sl=(iy-(cy+dy))/(fx-lx),endx=Math.min(fx,rx),endy=cy+dy+sl*(endx-lx);out+=L(lx,cy+dy,endx,endy,'#e0a24a',1.8);
  if(fx>rx)out+=L(rx,endy,fx,iy,'#e0a24a',1.4,'stroke-dasharray="4 4"');});
 out+=L(60,cy,60,cy-objY,C.ink,3)+Ci(60,cy-objY,5,C.ink)+TF(60,cy+18,'object',13,C.muted);
 return out;
}
SCENE({id:'eye-optics',name:'Focusing the eye',tag:'Kepler’s lens',
 definition:'The cornea and lens bend light to form a small, upside-down image on the retina. To focus on near things, the lens thickens (accommodation), adding focusing power measured in dioptres.',
 example:'A 25-year-old can add about 11 dioptres, so they can focus as close as 9 cm. At 45 the range has shrunk to about 5 dioptres (20 cm), and at 65 to under 1: that is presbyopia, and why reading glasses arrive in middle age.',
 desc:'A cross-section of a simplified eye with rays from an object focusing on or behind the retina, for a chosen distance and age.',
 research:'Kepler, J. (1604). Ad Vitellionem paralipomena. Helmholtz, H. von (1855) on accommodation. Hofstetter, H. W. (1950). A useful age-amplitude formula. Optometric World 38, 42–45 (average formula used here; individual eyes vary).',
 dur:10,hint:'Move the object closer and change the age. When the needed focus exceeds what the lens can add, the rays meet behind the retina and the image blurs.',
 init:()=>({v:100,age:25}),
 watch(p){return {v:Math.round(100*(1-p)),age:p<.5?25:45}},
 ui:[{range:'v',label:'Object distance',min:0,max:100,step:1,get:s=>s.v,act:'v',show:v=>S1_m(S1_dist(v))},{choose:S1_AGES,label:'Age',get:s=>s.age,act:'age'}],
 on:{v(s,v){s.v=Number(v);return 'keep'},age(s,v){s.age=Number(v);return 'keep'}},
 draw(s){
  const d=S1_dist(s.v),need=1/d,A=S1_amp(s.age),acc=Math.min(need,A),ptot=60+acc,di=1000/(ptot-need),ret=1000/60,blur=need-acc;
  let out=heading('Can this eye focus at '+S1_m(d)+'?');
  out+=S1_eyeDraw(di,ret,46,'lens +'+fmt(Math.round(acc*10)/10)+' D');
  out+=R(70,318,460,50,blur>.05?C.coralp:C.greenp,'none',8);
  out+=TF(86,338,`Needs ${fmt(Math.round(need*10)/10)} D of extra focus · this age can add ${fmt(Math.round(A*10)/10)} D`,13,C.ink,'start');
  out+=TF(86,358,blur>.05?`Short by ${fmt(Math.round(blur*10)/10)} D: the image falls behind the retina and blurs.`:'In focus: the rays meet on the retina.',13,blur>.05?C.coral:C.green,'start');
  return {svg:out,phase:blur>.05?`At ${S1_m(d)} a ${s.age}-year-old eye cannot add enough focus (needs ${fmt(Math.round(need*10)/10)} D, has ${fmt(Math.round(A*10)/10)} D). The near point is ${S1_m(1/A)}.`:`A ${s.age}-year-old eye focuses at ${S1_m(d)}. Its near point is about ${S1_m(1/A)}.`};
 }});

SCENE({id:'eye-optics-myopia',name:'Short and long sight',tag:'Eye length and lenses',
 definition:'In myopia (short sight) the eye is too long for its focusing power, so distant objects focus in front of the retina; a diverging (minus) lens corrects it. In hyperopia the eye is too short, and a plus lens helps.',
 example:'In this simplified eye, each extra millimetre of length needs about −3.4 D of correction; real eyes, about 24 mm long, need roughly −2.7 D per millimetre. Myopia affected about 30% of people worldwide in 2020 and is rising fast.',
 desc:'Parallel rays from a distant object focusing in front of, on or behind the retina, with a correcting lens in front of the eye.',
 research:'Holden, B. A. et al. (2016). Global prevalence of myopia and high myopia and temporal trends from 2000 through 2050. Ophthalmology 123, 1036–1042. He, M. et al. (2015). Effect of time spent outdoors at school on the development of myopia. JAMA 314, 1142–1148 (outdoor time slows onset; evidence moderate).',
 dur:10,hint:'Make the eye longer, then find the lens power that brings the focus back onto the retina.',
 init:()=>({len:2,lens:0}),
 watch(p){const need=1000/(1000/60+2)-60;return {len:2,lens:Math.round(need*p*2)/2}},
 ui:[{range:'len',label:'Eye length change',min:-2,max:4,step:.5,get:s=>s.len,act:'len',show:v=>(v>0?'+':'')+v+' mm'},{range:'lens',label:'Correcting lens',min:-12,max:6,step:.5,get:s=>s.lens,act:'lens',show:v=>(v>0?'+':'')+v+' D'}],
 on:{len(s,v){s.len=Number(v);return 'keep'},lens(s,v){s.lens=Number(v);return 'keep'}},
 draw(s){
  const ret=1000/60+s.len,f=1000/(60+s.lens),need=Math.round((1000/ret-60)*10)/10,k=12,lx=300,cy=196,rx=lx+ret*k,fx=lx+Math.min(f,26)*k,ok=Math.abs(f-ret)<.15;
  let out=heading(ok?'In focus':f<ret?'Focus falls in front of the retina':'Focus falls behind the retina');
  out+=P(`M${lx-20} ${cy-100} Q${lx-60} ${cy} ${lx-20} ${cy+100}`,C.line,2)+P(`M${lx-20} ${cy-100} Q${rx+30} ${cy-110} ${rx+12} ${cy} Q${rx+30} ${cy+110} ${lx-20} ${cy+100}`,C.line,2);
  out+=L(rx,cy-70,rx,cy+70,C.coral,4);
  out+=`<ellipse cx="${lx}" cy="${cy}" rx="10" ry="50" fill="${C.pale}" stroke="${C.blue}" stroke-width="2"/>`;
  if(s.lens!==0){const c=s.lens<0?-1:1;out+=P(`M220 ${cy-60} Q${220+c*12} ${cy} 220 ${cy+60} M232 ${cy-60} Q${232-c*12} ${cy} 232 ${cy+60}`,C.purple,2.5)+TF(226,cy+82,(s.lens>0?'+':'')+s.lens+' D',13,C.purple)}
  [-40,-14,14,40].forEach(dy=>{out+=L(40,cy+dy,lx,cy+dy,'#e0a24a',1.8);const sl=-dy/(fx-lx),ex=Math.min(fx,rx);out+=L(lx,cy+dy,ex,cy+dy+sl*(ex-lx),'#e0a24a',1.8);
   if(fx<rx)out+=L(fx,cy,rx,cy+(rx-fx)*(dy/(fx-lx)),'#e0a24a',1.4,'stroke-dasharray="4 4"');else if(fx>rx)out+=L(rx,cy+dy+sl*(rx-lx),fx,cy,'#e0a24a',1.4,'stroke-dasharray="4 4"')});
  out+=TF(40,cy-58,'light from far away',13,C.muted,'start');
  out+=R(70,318,460,50,ok?C.greenp:C.pale,'none',8)+TF(86,338,`Eye ${fmt(Math.round(ret*10)/10)} mm long · this eye needs ${need>0?'+':''}${fmt(need)} D`,13,C.ink,'start')+TF(86,358,s.len>0?'Too long: myopia, corrected by a minus lens.':s.len<0?'Too short: hyperopia, helped by a plus lens.':'Normal length: no correction needed.',13,C.muted,'start');
  return {svg:out,phase:ok?`The ${s.lens} D lens puts the focus on the retina.`:`This eye needs about ${need>0?'+':''}${fmt(need)} D; the lens gives ${s.lens} D.`};
 }});

const S1_KEP=[
 {t:'Ibn al-Haytham, c. 1021',l:['Light travels from objects into the eye,','not out of it. He studied the camera','obscura: a dark room with a pinhole.']},
 {t:'Kepler, 1604',l:['The lens throws a real, upside-down','image onto the retina. Seeing starts','with a picture on the back of the eye.']},
 {t:'Scheiner, 1619',l:['He scraped the back of an ox’s eye','and saw the upside-down image on it,','confirming Kepler directly.']},
 {t:'Helmholtz, 1851',l:['The ophthalmoscope let doctors see','the living retina for the first time.']},
 {t:'Partly like a camera',l:['A lens forms the image, as in a camera.','But only the fovea is sharp, the eye','moves 3 times a second, and the brain','builds the picture you see.']}];
SCENE({id:'eye-optics-kepler',name:'An image on the retina',tag:'From the camera obscura to Kepler',
 definition:'Kepler showed in 1604 that the eye works by forming an image on the retina, like a camera obscura forming an image on a wall. The image is upside down; the brain does not need to “turn it over”.',
 example:'Scheiner proved it in 1619 by looking through the scraped-thin back of an ox’s eye and seeing a small inverted scene. The camera comparison is only partly true: the eye is sharp only at its centre and is always moving.',
 desc:'A camera obscura and an eye side by side, each forming an inverted image, with cards from Ibn al-Haytham to Helmholtz.',
 research:'Ibn al-Haytham (c. 1021). Kitāb al-Manāẓir (Book of Optics). Kepler, J. (1604). Ad Vitellionem paralipomena. Scheiner, C. (1619). Oculus. Lindberg, D. C. (1976). Theories of Vision from al-Kindi to Kepler. University of Chicago Press.',
 dur:10,hint:'Step through the five cards. The “partly like a camera” card says where the comparison breaks down.',
 init:()=>({k:1}),
 watch(p){return {k:Math.min(4,Math.floor(p*5))}},
 ui:[{choose:S1_KEP.map((c,i)=>[i,String(i+1)]),label:'Card',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s){
  const c=S1_KEP[s.k];let out=heading('An image on the back of the eye');
  const tree=(x,y,sc,col)=>L(x,y,x,y-30*sc,'#8a6d4f',3)+Ci(x,y-38*sc,14*Math.abs(sc),col);
  out+=R(40,70,200,130,'#2b3d47','none',6)+Ci(40,135,3,'#fff')+tree(20,175,1,'#3e8a4a');
  out+=L(20,137,40,135,'#e0a24a',1.4)+L(40,135,230,175,'#e0a24a',1.4,'stroke-opacity=".6"')+tree(225,95,-1,'#3e8a4a');
  out+=TF(140,220,'camera obscura',13,C.muted);
  out+=`<ellipse cx="420" cy="135" rx="90" ry="70" fill="#fff" stroke="${C.line}" stroke-width="2"/>`+`<ellipse cx="335" cy="135" rx="8" ry="30" fill="${C.pale}" stroke="${C.blue}" stroke-width="2"/>`;
  out+=L(300,105,335,135,'#e0a24a',1.4)+L(335,135,505,165,'#e0a24a',1.4)+tree(495,115,-.6,'#3e8a4a')+TF(420,220,'eye: the image is upside down',13,C.muted);
  out+=R(40,240,520,120,C.pale,'none',8)+TB(60,266,c.t,15,C.ink,'start')+S1_lines(60,292,c.l,13,C.ink,19);
  return {svg:out,phase:c.t+': '+c.l.join(' ')};
 }});

/* =========================== photoreceptors =========================== */
// Densities are illustrative curves shaped after Curcio et al. (1990): cones peak near 200,000/mm² at the
// fovea, rods are absent there and peak near 20°, and nothing sits on the optic disc (about 13–18° nasal).
const S1_coneD=e=>4000+195000*Math.exp(-e/.6)+12000*Math.exp(-e/6);
const S1_rodD=e=>160000*(1-Math.exp(-e/3))*Math.exp(-(((e-18)/26)**2));
const S1_disc=e=>e>=13&&e<=18;
SCENE({id:'photoreceptors',name:'Rods and cones',tag:'Two kinds of receptor',
 definition:'The retina has two kinds of light receptor. About 92 million rods work in dim light but see no colour; about 4.6 million cones work in daylight and see colour and fine detail. Cones crowd into the fovea, where rods are absent.',
 example:'At the fovea there are about 200,000 cones per square millimetre and no rods, which is why you look straight at things to read them, but a faint star is easier to see just off to the side.',
 desc:'Cone and rod density across the retina, from the fovea outward, with the blind spot where the optic nerve leaves, and a patch of mosaic at the chosen point.',
 research:'Curcio, C. A., Sloan, K. R., Kalina, R. E. & Hendrickson, A. E. (1990). Human photoreceptor topography. Journal of Comparative Neurology 292, 497–523. Østerberg, G. (1935). Topography of the layer of rods and cones in the human retina. (Curves here are illustrative shapes after these data.)',
 dur:10,hint:'Move from the fovea outward. Watch cones fall, rods rise, and both vanish at the blind spot.',
 init:()=>({e:0}),
 watch(p){return {e:Math.round(p*60)}},
 ui:[{range:'e',label:'Distance from fovea',min:0,max:60,step:1,get:s=>s.e,act:'e',show:v=>v+'°'}],
 on:{e(s,v){s.e=Number(v);return 'keep'}},
 draw(s){
  const pl=S1_plot(70,60,320,230,[0,60],[0,200],{xt:[[0,'0'],[15,'15'],[30,'30'],[45,'45'],[60,'60°']],yt:[[0,'0'],[50,'50'],[100,'100'],[150,'150'],[200,'200']],yl:'thousand per mm²',xl:'distance from the fovea (nasal retina)'});
  let out=heading('Cones crowd the centre; rods fill the rest')+pl.svg;
  out+=R(pl.X(13),60,pl.X(18)-pl.X(13),230,'#eef1f4','none',0)+TF((pl.X(13)+pl.X(18))/2,84,'blind',13,C.muted)+TF((pl.X(13)+pl.X(18))/2,100,'spot',13,C.muted);
  const cp=[],rp=[];for(let e=0;e<=60;e+=.25){if(S1_disc(e)){cp.push(null);continue}cp.push([pl.X(e),pl.Y(Math.min(200,S1_coneD(e)/1000))]);rp.push([pl.X(e),pl.Y(S1_rodD(e)/1000)])}
  const seg=a=>{let o='',cur=[];a.forEach(p=>{if(p)cur.push(p);else{o+=S1_poly(cur,C.coral,2.6);cur=[]}});return o+S1_poly(cur,C.coral,2.6)};
  out+=seg(cp);const rp2=[];for(let e=0;e<=60;e+=.25)rp2.push(S1_disc(e)?null:[pl.X(e),pl.Y(S1_rodD(e)/1000)]);let cur=[];rp2.forEach(p=>{if(p)cur.push(p);else{out+=S1_poly(cur,C.blue,2.6);cur=[]}});out+=S1_poly(cur,C.blue,2.6);
  out+=L(pl.X(s.e),60,pl.X(s.e),290,C.ink,1.5,'stroke-dasharray="4 4"');
  const cd=S1_disc(s.e)?0:S1_coneD(s.e),rd=S1_disc(s.e)?0:S1_rodD(s.e);
  out+=TB(420,80,'At '+s.e+'°',15,C.ink,'start')+TF(420,104,'cones: '+Math.round(cd/1000)+'k per mm²',13,C.coral,'start')+TF(420,124,'rods: '+Math.round(rd/1000)+'k per mm²',13,C.blue,'start');
  out+=R(420,140,150,150,'#fff',C.grid,6);const r=S1_rng(s.e+7),n=Math.round((cd+rd)/2500),fc=cd/(cd+rd||1);
  for(let i=0;i<Math.min(n,140);i++){const x=428+r()*134,y=148+r()*134,isC=r()<fc;out+=Ci(x,y,isC?4.2:2.4,isC?C.coral:C.blue)}
  if(!n)out+=TF(495,220,'no receptors',13,C.muted);
  out+=TF(420,312,'red: cones · blue: rods',13,C.muted,'start');
  return {svg:out,phase:S1_disc(s.e)?`At ${s.e}° you are on the optic disc: no rods or cones, so this spot is blind.`:`At ${s.e}° there are about ${Math.round(cd/1000)} thousand cones and ${Math.round(rd/1000)} thousand rods per square millimetre.`};
 }});

const S1_TYPES=[['S','S cones',C.blue],['M','M cones',C.green],['L','L cones',C.coral],['R','rods',C.ink]];
SCENE({id:'photoreceptors-spectra',name:'What each receptor absorbs',tag:'Four pigments',
 definition:'Each receptor type contains a pigment that absorbs some wavelengths better than others. Short (S), medium (M) and long (L) wavelength cones peak near 420, 534 and 564 nm; rods peak near 498 nm.',
 example:'Light of 450 nm excites S cones strongly and M cones a little; 600 nm light excites L cones much more than M. No single receptor can tell wavelength from brightness on its own.',
 desc:'Sensitivity curves of the three cone types and rods, with bars showing how strongly each responds to the chosen wavelength.',
 research:'Bowmaker, J. K. & Dartnall, H. J. A. (1980). Visual pigments of rods and cones in a human retina. Journal of Physiology 298, 501–511. Stockman, A. & Sharpe, L. T. (2000). The spectral sensitivities of the middle- and long-wavelength-sensitive cones. Vision Research 40, 1711–1737. (Curves here are Gaussian approximations.)',
 dur:10,hint:'Sweep the wavelength. Notice that two different wavelengths can give the same response in one cone type.',
 init:()=>({l:500}),
 watch(p){return {l:Math.round(400+300*p)}},
 ui:[{range:'l',label:'Wavelength',min:400,max:700,step:5,get:s=>s.l,act:'l',show:v=>v+' nm'}],
 on:{l(s,v){s.l=Number(v);return 'keep'}},
 draw(s){
  const pl=S1_plot(70,60,330,220,[400,700],[0,1.05],{xt:[[400,'400'],[500,'500'],[600,'600'],[700,'700 nm']],yt:[[0,'0'],[.5,'0.5'],[1,'1']],yl:'relative sensitivity'});
  let out=heading('Four receptor types, four sensitivity curves')+pl.svg;
  for(let x=400;x<700;x+=5)out+=R(pl.X(x),283,pl.X(x+5)-pl.X(x)+.5,10,S1_wl(x+2.5),'none',0);
  S1_TYPES.forEach(([k,,col])=>{const pts=[];for(let x=400;x<=700;x+=3)pts.push([pl.X(x),pl.Y(S1_cone(x)[k])]);out+=S1_poly(pts,col,2.4,k==='R'?'stroke-dasharray="6 4"':'')});
  out+=L(pl.X(s.l),60,pl.X(s.l),280,C.ink,1.5);
  const v=S1_cone(s.l);out+=R(430,64,140,70,S1_wl(s.l),'none',8)+TF(500,152,s.l+' nm',13,C.muted);
  S1_TYPES.forEach(([k,name,col],i)=>{const y=180+i*30;out+=TF(430,y+12,name,13,col,'start')+R(490,y,80,14,'#eef1f4','none',3)+R(490,y,80*v[k],14,col,'none',3)});
  out+=TF(70,320,'dashed: rods (night vision) · solid: S, M and L cones',13,C.muted,'start');
  return {svg:out,phase:`At ${s.l} nm the responses are S ${v.S.toFixed(2)}, M ${v.M.toFixed(2)}, L ${v.L.toFixed(2)}, rods ${v.R.toFixed(2)}.`};
 }});

const S1_WALD=[
 {t:'In the dark',l:['Rhodopsin waits: the protein opsin holds','retinal in its bent 11-cis shape.'],bent:true,free:false},
 {t:'A photon is absorbed',l:['The light straightens retinal to all-trans','in about 200 femtoseconds.'],bent:false,free:false},
 {t:'The signal is amplified',l:['One changed rhodopsin activates hundreds of','transducin molecules: a rod can respond','to a single photon (Baylor 1979).'],bent:false,free:false},
 {t:'Bleached',l:['All-trans retinal leaves the opsin.','Until it is replaced, that pigment','cannot catch light.'],bent:false,free:true},
 {t:'Regenerated',l:['Cells behind the retina turn it back to','11-cis using vitamin A. Lack of vitamin A','causes night blindness.'],bent:true,free:false},
 {t:'The carrot myth',l:['Extra carrots do not sharpen normal','night vision. The idea was spread by','British wartime propaganda to hide radar.'],bent:true,free:false}];
SCENE({id:'photoreceptors-wald',name:'How light is caught',tag:'Wald’s rhodopsin cycle',
 definition:'In rods, light is caught by rhodopsin: a protein holding a small molecule, retinal, made from vitamin A. A photon straightens retinal, which sets off an amplifying cascade; the pigment then has to be rebuilt before it can work again.',
 example:'George Wald worked out this cycle in the 1930s–50s and shared the 1967 Nobel Prize. Vitamin A deficiency causes night blindness, but eating extra carrots does not improve normal vision.',
 desc:'A cartoon of rhodopsin with retinal in its bent or straight form through the six steps of the visual cycle.',
 research:'Wald, G. (1968). The molecular basis of visual excitation (Nobel lecture). Nature 219, 800–807. Baylor, D. A., Lamb, T. D. & Yau, K.-W. (1979). Responses of retinal rods to single photons. Journal of Physiology 288, 613–634. Hecht, S., Shlaer, S. & Pirenne, M. H. (1942). Energy, quanta, and vision.',
 dur:12,hint:'Step through the cycle. The last card is a myth check.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(5,Math.floor(p*6))}},
 ui:[{choose:S1_WALD.map((c,i)=>[i,String(i+1)]),label:'Step',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s){
  const c=S1_WALD[s.k];let out=heading('Rhodopsin: catch, signal, rebuild');
  out+=`<ellipse cx="200" cy="150" rx="120" ry="70" fill="${C.purplep}" stroke="${C.purple}" stroke-width="2"/>`+TF(200,236,'opsin protein',13,C.purple);
  const ox=c.free?380:160,oy=c.free?150:150;
  const pts=c.bent?[[0,0],[16,-10],[32,0],[48,-10],[60,6],[72,22],[88,14]]:[[0,0],[16,-10],[32,0],[48,-10],[64,0],[80,-10],[96,0]];
  out+=S1_poly(pts.map(p=>[ox+p[0]-40,oy+p[1]]),C.amber,4);
  out+=TF(c.free?400:200,c.free?186:186,c.bent?'retinal (11-cis, bent)':'retinal (all-trans, straight)',13,C.amber);
  if(s.k===1||s.k===2)out+=P('M470 70 L430 100 L450 100 L410 130',C.amber,3)+TF(470,62,'photon',13,C.amber);
  if(s.k===2)for(let i=0;i<9;i++)out+=Ci(360+(i%3)*30,100+Math.floor(i/3)*28,8,C.blue)+'';
  if(s.k===2)out+=TF(390,196,'transducin',13,C.blue);
  out+=R(40,250,520,110,s.k===5?C.coralp:C.pale,'none',8)+TB(60,276,(s.k+1)+'. '+c.t,15,C.ink,'start')+S1_lines(60,300,c.l,13,C.ink,19);
  return {svg:out,phase:c.t+': '+c.l.join(' ')};
 }});

/* =========================== dark-adaptation =========================== */
// Log threshold (relative units) after a bright light, shaped after Hecht et al. (1937): a cone branch that
// levels off within about 7 minutes and a rod branch that takes over at the rod–cone break and keeps falling.
const S1_coneT=t=>2+1.4*Math.exp(-t/1.5),S1_rodT=t=>-.4+6.5*Math.exp(-t/7);
const S1_thr=(t,where)=>where==='fovea'?S1_coneT(t):Math.min(S1_coneT(t),S1_rodT(t));
SCENE({id:'dark-adaptation',name:'Getting used to the dark',tag:'The two-branch curve',
 definition:'After bright light, the eye becomes more sensitive in the dark over about 30–40 minutes. Cones recover quickly but level off; rods recover slowly and become far more sensitive, taking over at the rod–cone break.',
 example:'In a dark cinema you see little at first, much more after 7–10 minutes when rods take over, and by half an hour your sensitivity has risen roughly ten-thousandfold. A light aimed at the fovea follows only the cone branch.',
 desc:'Threshold intensity (log scale) against minutes in the dark, with cone and rod branches, the rod–cone break and a marker for the chosen time.',
 research:'Hecht, S., Haig, C. & Chase, A. M. (1937). The influence of light adaptation on subsequent dark adaptation of the eye. Journal of General Physiology 20, 831–850. (Curve shapes here are illustrative.)',
 dur:10,hint:'Move through the minutes. Switch the test light to the fovea and the rod branch disappears.',
 init:()=>({t:3,where:'side'}),
 watch(p){return {t:Math.round(p*40),where:'side'}},
 ui:[{range:'t',label:'Minutes in the dark',min:0,max:40,step:1,get:s=>s.t,act:'t',show:v=>v+' min'},{choose:[['side','Test light 20° to the side'],['fovea','Test light on the fovea']],label:'Test light',get:s=>s.where,act:'where'}],
 on:{t(s,v){s.t=Number(v);return 'keep'},where(s,v){s.where=v;return 'keep'}},
 draw(s){
  const pl=S1_plot(80,60,420,230,[0,40],[-1,4],{xt:[[0,'0'],[10,'10'],[20,'20'],[30,'30'],[40,'40 min']],yt:[[-1,'−1'],[0,'0'],[1,'1'],[2,'2'],[3,'3'],[4,'4']],yl:'log threshold (dimmest light seen)'});
  let out=heading('Sensitivity in the dark rises in two steps')+pl.svg;
  const cp=[],rp=[],tp=[];for(let t=0;t<=40;t+=.25){cp.push([pl.X(t),pl.Y(S1_coneT(t))]);rp.push([pl.X(t),pl.Y(clamp(S1_rodT(t),-1,4))]);tp.push([pl.X(t),pl.Y(clamp(S1_thr(t,s.where),-1,4))])}
  out+=S1_poly(cp,C.coral,1.6,'stroke-dasharray="5 4"')+(s.where==='side'?S1_poly(rp,C.blue,1.6,'stroke-dasharray="5 4"'):'')+S1_poly(tp,C.ink,3);
  if(s.where==='side'){out+=Ci(pl.X(7),pl.Y(S1_coneT(7)),5,C.purple)+TF(pl.X(7)+8,pl.Y(S1_coneT(7))-10,'rod–cone break',13,C.purple,'start')}
  out+=TF(pl.X(37),pl.Y(2.2),'cones',13,C.coral,'end')+(s.where==='side'?TF(pl.X(37),pl.Y(-.1)-8,'rods',13,C.blue,'end'):'');
  const th=S1_thr(s.t,s.where);out+=Ci(pl.X(s.t),pl.Y(clamp(th,-1,4)),6,C.ink);
  const gain=Math.pow(10,S1_thr(0,s.where)-th);
  out+=TF(80,330,`After ${s.t} min: about ${gain<10?gain.toFixed(1):Math.round(gain).toLocaleString('en-GB')}× more sensitive than at the start`,13,C.ink,'start');
  return {svg:out,phase:s.where==='fovea'?'On the fovea only cones respond, so sensitivity levels off within a few minutes.':`After ${s.t} minutes the threshold is ${th.toFixed(1)} log units; ${s.t<7?'cones are still doing the seeing.':'rods have taken over.'}`};
 }});

const S1_LIGHTS=[['white','White light'],['blue','Blue light (470 nm)'],['red','Red light (650 nm)']];
const S1_bleach=k=>k==='white'?1:S1_Vs(k==='blue'?470:650)/S1_Vs(507);
SCENE({id:'dark-adaptation-red',name:'Why red light saves night vision',tag:'Rods ignore deep red',
 definition:'Rods are almost blind to deep red light, while cones still see it. So a dim red light lets you read a map without undoing the rods’ slow dark adaptation.',
 example:'Astronomers, submarine crews and pilots use red lamps at night. After a minute of white light, rods need many minutes to recover; after a minute of red light, almost none.',
 desc:'After 30 minutes in the dark, a one-minute light is switched on; the curve shows how the rod threshold recovers afterwards for white, blue or red light.',
 research:'Hecht, S. & Hsia, Y. (1945). Dark adaptation following light adaptation to red and white lights. Journal of the Optical Society of America 35, 261–267. (Recovery curves here are illustrative.)',
 dur:9,hint:'Choose the colour of the one-minute light and compare how long the rods take to recover.',
 init:()=>({c:'white'}),
 watch(p){return {c:S1_LIGHTS[Math.min(2,Math.floor(p*3))][0]}},
 ui:[{choose:S1_LIGHTS,label:'One-minute light',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=v;return 'keep'}},
 draw(s){
  const b=S1_bleach(s.c),start=30*(1-b);
  const pl=S1_plot(80,60,420,220,[0,20],[-1,4],{xt:[[0,'0'],[5,'5'],[10,'10'],[15,'15'],[20,'20 min']],yt:[[-1,'−1'],[0,'0'],[1,'1'],[2,'2'],[3,'3'],[4,'4']],yl:'log threshold after the light goes off',xl:'minutes after the light'});
  let out=heading('After a minute of light, how fast do rods recover?')+pl.svg;
  S1_LIGHTS.forEach(([k])=>{const bb=S1_bleach(k),st=30*(1-bb),pts=[];for(let t=0;t<=20;t+=.25)pts.push([pl.X(t),pl.Y(clamp(Math.min(S1_coneT(Math.max(t,bb<.05?30:t)),S1_rodT(st+t)),-1,4))]);
   out+=S1_poly(pts,k===s.c?(k==='red'?C.coral:k==='blue'?C.blue:C.ink):'#c3d1da',k===s.c?3:1.6)});
  out+=L(pl.X(0),pl.Y(S1_rodT(30)),pl.X(20),pl.Y(S1_rodT(30)),C.green,1.4,'stroke-dasharray="5 4"')+TF(pl.X(20),pl.Y(S1_rodT(30))-8,'fully dark-adapted',13,C.green,'end');
  let back=0;for(let t=0;t<=40;t+=.25){if(S1_rodT(start+t)<=S1_rodT(30)+.3){back=t;break}back=t}
  out+=TF(80,326,`${S1_LIGHTS.find(x=>x[0]===s.c)[1]} bleaches about ${b<.01?'under 1':Math.round(b*100)}% of rod pigment; back within 0.3 log units in about ${back<1?'under a minute':Math.round(back)+' min'}`,13,C.ink,'start');
  return {svg:out,phase:`${S1_LIGHTS.find(x=>x[0]===s.c)[1]}: rods back near full sensitivity in about ${back<1?'under a minute':Math.round(back)+' minutes'}.`};
 }});

SCENE({id:'dark-adaptation-purkinje',name:'Colours at dusk',tag:'The Purkinje shift',
 definition:'In daylight, cones make yellow-green look brightest (peak near 555 nm). In dim light, rods take over and their peak is near 507 nm, so blues and greens look relatively brighter and reds darker. Colour also fades, because rods cannot see it.',
 example:'Jan Purkinje noticed in the 1820s that red geraniums looked brighter than their leaves by day but darker at dusk. At night a red rose looks almost black.',
 desc:'A red flower and blue-green leaves shown at a chosen light level, with their brightness worked out from daytime and night-time sensitivity curves.',
 research:'Purkinje, J. E. (1825). Neue Beiträge zur Kenntniss des Sehens. CIE photopic V(λ) (1924) and scotopic V′(λ) (1951) luminous efficiency functions (approximated here by Gaussians; the mesopic blend is illustrative).',
 dur:10,hint:'Lower the light from daylight to starlight and watch the red flower fall behind the leaves.',
 init:()=>({lv:2}),
 watch(p){return {lv:Math.round((2-5*p)*2)/2}},
 ui:[{range:'lv',label:'Light level',min:-3,max:2,step:.5,get:s=>s.lv,act:'lv',show:v=>v>=1?'daylight':v>=-.5?'dusk':v>=-2?'moonlight':'starlight'}],
 on:{lv(s,v){s.lv=Number(v);return 'keep'}},
 draw(s){
  const w=clamp((s.lv+2)/2.5,0,1),eff=l=>w*S1_V(l)+(1-w)*S1_Vs(l)*.9,br=eff(620),bb=eff(500),bright=Math.pow(10,(s.lv-2)/5);
  let out=heading(w>.8?'Daylight: cones see colour':w>.2?'Dusk: rods are taking over':'Night: rods only, no colour');
  const tone=(l,e)=>{const k=clamp(e*bright*1.2,0,1),g=Math.round(255*k);const cRGB=S1_wl(l,k);return w>.05?cRGB.replace('rgb(','').replace(')','').split(',').map(Number).map((v,i)=>Math.round(v*w+g*(1-w))).join(','):`${g},${g},${g}`};
  out+=R(40,60,520,230,`rgb(${Math.round(30*bright)},${Math.round(40*bright)},${Math.round(50*bright)})`,'none',8);
  for(let i=0;i<5;i++){const x=110+i*90;out+=`<ellipse cx="${x}" cy="230" rx="36" ry="18" fill="rgb(${tone(500,bb)})"/>`;out+=Ci(x,150+(i%2)*20,26,`rgb(${tone(620,br)})`)}
  out+=TF(300,320,`Relative brightness · red flower ${br.toFixed(2)} · blue-green leaves ${bb.toFixed(2)}`,13,C.ink);
  out+=TF(300,342,br>bb?'The flower looks brighter than the leaves.':'The leaves now look brighter than the flower.',13,br>bb?C.coral:C.green);
  return {svg:out,phase:`${br>bb?'The red flower is brighter':'The leaves are brighter'}: daytime weight ${Math.round(w*100)}%, rods ${Math.round((1-w)*100)}%.`};
 }});

/* =========================== trichromacy =========================== */
const S1_TARGETS=[[230,150,40],[90,170,210],[200,90,160],[120,200,90],[240,210,120],[110,110,200]];
const S1_err=(a,b)=>Math.round(Math.sqrt(a.reduce((t,v,i)=>t+((v-b[i])/255)**2,0)/3)*100);
SCENE({id:'trichromacy',name:'Matching any colour with three lights',tag:'You do Maxwell’s experiment',
 definition:'Trichromacy means that any colour can be matched by mixing three suitable primary lights. It follows from having three cone types: the eye reduces each light to just three numbers.',
 example:'Your screen proves it: every colour on it is a mix of red, green and blue dots. Remove one primary and many colours become impossible to match, as Maxwell showed with his colour top and colour box in the 1850s.',
 desc:'A split circle with a target colour on the left and your mix of red, green and blue lights on the right, with your match errors for three and for two lights.',
 research:'Young, T. (1802). On the theory of light and colours. Helmholtz, H. von (1852). Maxwell, J. C. (1860). On the theory of compound colours. Philosophical Transactions 150, 57–84. Stockman, A. & Sharpe, L. T. (2000). Your matches stay on this page.',
 dur:12,hint:'Adjust the three lights until both halves look the same, then press Check. Try “two lights only” to see some colours become impossible. Your data stay on this page.',
 init:()=>({r:128,g:128,b:128,i:0,mode:3,res:{3:[],2:[]}}),
 watch(p){const t=S1_TARGETS[0],k=Math.min(1,p*1.4);return {r:Math.round(lerp(128,t[0],k)),g:Math.round(lerp(128,t[1],k)),b:Math.round(lerp(128,t[2],k)),i:0,mode:3,res:{3:p>.8?[3]:[],2:[]},sim:true}},
 ui:[{range:'r',label:'Red light',min:0,max:255,step:5,get:s=>s.r,act:'r'},{range:'g',label:'Green light',min:0,max:255,step:5,get:s=>s.g,act:'g'},{range:'b',label:'Blue light',min:0,max:255,step:5,get:s=>s.b,act:'b'},
  {choose:[[3,'Three lights'],[2,'Two lights only']],label:'Lights',get:s=>s.mode,act:'mode'},{b:'Check match',act:'check'},{b:'Next colour',act:'next'}],
 on:{r(s,v){s.r=Number(v);return 'keep'},g(s,v){s.g=Number(v);return 'keep'},b(s,v){s.b=s.mode===2?0:Number(v);return 'keep'},
  mode(s,v){s.mode=Number(v);if(s.mode===2)s.b=0;return 'keep'},
  check(s){const t=S1_TARGETS[s.i%6];s.res[s.mode].push(S1_err(t,[s.r,s.g,s.mode===2?0:s.b]));s.checked=true;return 'keep'},
  next(s){s.i=(s.i+1)%6;s.checked=false;return 'keep'}},
 draw(s){
  const t=S1_TARGETS[s.i%6],mix=[s.r,s.g,s.mode===2?0:s.b],e=S1_err(t,mix);
  let out=heading(s.sim?'A simulated participant matching a colour':'Match the left half with your three lights');
  out+=P(`M200 70 A110 110 0 0 0 200 290 Z`,'none',0,S1_hex(t))+P(`M200 70 A110 110 0 0 1 200 290 Z`,'none',0,S1_hex(mix))+Ci(200,180,110,'none',C.line);
  out+=TF(140,312,'target',13,C.muted)+TF(260,312,'your mix',13,C.muted);
  out+=TB(360,84,'Match error now: '+e+'%',15,e<=5?C.green:C.ink,'start')+TF(360,106,e<=5?'Close enough to look identical.':'Keep adjusting.',13,C.muted,'start');
  const avg=a=>a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length):null;
  out+=TB(360,150,'Your checked matches',14,C.ink,'start');
  [[3,'three lights'],[2,'two lights']].forEach(([m,l],i)=>{const a=s.res[m],y=176+i*40;out+=TF(360,y,l+': '+a.length+' match'+(a.length===1?'':'es'),13,C.ink,'start')+TF(360,y+18,a.length?'average error '+avg(a)+'%':'none yet',13,C.muted,'start')});
  out+=S1_lines(360,272,['Maxwell: normal observers need','exactly three primaries; two cannot','match every colour.'],13,C.muted,18);
  return {svg:out,phase:`Target ${s.i%6+1} of 6, error ${e}% with ${s.mode} lights.`};
 }});

SCENE({id:'trichromacy-cones',name:'Three numbers for every colour',tag:'The cone space',
 definition:'Each wavelength gives a particular trio of S, M and L cone responses. Plotted in three dimensions, the pure spectral colours trace a curved line; every visible colour is a point inside the shape it bounds.',
 example:'580 nm gives L high, M a bit lower, S almost zero: we call it yellow. A mix of red and green light can give the same trio, so it looks the same yellow.',
 desc:'Cone sensitivity curves and bars for the chosen wavelength; in 3D, the path of spectral colours through S, M and L response space.',
 research:'Stockman, A. & Sharpe, L. T. (2000). Vision Research 40, 1711–1737. MacLeod, D. I. A. & Boynton, R. M. (1979). Chromaticity diagram showing cone excitation by stimuli of equal luminance. JOSA 69, 1183–1186. (Gaussian approximations here.)',
 dur:10,hint:'Sweep the wavelength and switch to 3D to see the spectral path through cone space.',
 init:()=>({l:580}),
 watch(p){return {l:Math.round(420+260*p)}},
 ui:[{range:'l',label:'Wavelength',min:400,max:700,step:5,get:s=>s.l,act:'l',show:v=>v+' nm'}],
 on:{l(s,v){s.l=Number(v);return 'keep'}},
 draw(s){
  const v=S1_cone(s.l),tot=v.S+v.M+v.L;let out=heading('Every wavelength is three cone responses');
  out+=R(60,70,160,120,S1_wl(s.l),'none',10)+TF(140,210,s.l+' nm',14,C.ink);
  [['S',C.blue],['M',C.green],['L',C.coral]].forEach(([k,col],i)=>{const x=290+i*90,h=200*v[k];out+=R(x,270-h,50,h,col,'none',4)+TF(x+25,292,k,14,col)+TF(x+25,262-h,v[k].toFixed(2),13,C.ink)});
  out+=L(270,270,540,270,C.line,1.5);
  out+=TF(300,330,`Proportions: S ${Math.round(v.S/tot*100)}% · M ${Math.round(v.M/tot*100)}% · L ${Math.round(v.L/tot*100)}%`,13,C.muted);
  return {svg:out,phase:`${s.l} nm gives S ${v.S.toFixed(2)}, M ${v.M.toFixed(2)}, L ${v.L.toFixed(2)}.`};
 },
 three(s,f,X,project){
  const P=project([0,1,0,1,0,1]);let out=axes3(P,['S','M','L'],[1.05,1.05,1.05]);
  const pts=[];for(let l=400;l<=700;l+=5){const v=S1_cone(l);pts.push([v.S,v.M,v.L,l])}
  for(let i=0;i<pts.length-1;i++)out+=line3(pts[i],pts[i+1],P,S1_wl(pts[i][3]),4);
  const v=S1_cone(s.l);out+=line3([0,0,0],[v.S,v.M,v.L],P,C.muted,1.4,'stroke-dasharray="4 4"')+point3([v.S,v.M,v.L],P,S1_wl(s.l),9,C.ink);
  const q=P([v.S,v.M,v.L]);out+=label3(q[0]+14,q[1]-12,s.l+' nm',14,C.ink,'text-anchor="start"');
  return {svg:out,title:'The spectral path in cone space',caption:'Each pure wavelength is a point (S, M, L). As wavelength rises, the point swings from the S axis towards L. Mixtures of lights fill in the space inside this curve.'};
 }});

// Rayleigh match: red 670 nm + green 545 nm against yellow 589 nm, as in Nagel's anomaloscope.
const S1_ray=(r,y)=>{const R1=S1_cone(670),G=S1_cone(545),Y=S1_cone(589);return {mL:r*R1.L+(1-r)*G.L,mM:r*R1.M+(1-r)*G.M,yL:y*Y.L,yM:y*Y.M}};
const S1_rayBest=()=>{const R1=S1_cone(670),G=S1_cone(545),Y=S1_cone(589),t=Y.L/Y.M;// solve (rRL+(1-r)GL)/(rRM+(1-r)GM)=t
 const r=(t*G.M-G.L)/((R1.L-G.L)-t*(R1.M-G.M));const y=(r*R1.L+(1-r)*G.L)/Y.L;return {r,y}};
SCENE({id:'trichromacy-metamers',name:'Different light, same colour',tag:'The Rayleigh match',
 definition:'Metamers are lights with different spectra that look identical, because they produce the same cone responses. Rayleigh’s match pairs a pure yellow with a mix of red and green; how much red a person needs reveals their cone types.',
 example:'Most people match 589 nm yellow with a particular red–green mix. Someone missing L cones accepts almost any mix once the brightness is adjusted, which is how Nagel’s anomaloscope diagnoses colour vision.',
 desc:'Two spectra, a pure yellow line and a red-plus-green pair, with the L and M cone responses each produces and whether they match for the chosen observer.',
 research:'Rayleigh, Lord (1881). Experiments on colour. Nature 25, 64–66. Nagel, W. A. (1907) anomaloscope. Wyszecki, G. & Stiles, W. S. (1982). Color Science. Wiley.',
 dur:10,hint:'Adjust the red share and the yellow brightness until the cone bars match. Then switch the observer.',
 init:()=>({r:30,y:100,obs:'normal'}),
 watch(p){const b=S1_rayBest();return {r:Math.round(lerp(30,b.r*100,Math.min(1,p*1.3))),y:Math.round(lerp(100,b.y*100,Math.min(1,p*1.3))),obs:'normal'}},
 ui:[{range:'r',label:'Red in the mix',min:0,max:100,step:1,get:s=>s.r,act:'r',show:v=>v+'%'},{range:'y',label:'Yellow brightness',min:20,max:200,step:1,get:s=>s.y,act:'y',show:v=>v+'%'},{choose:[['normal','Typical observer'],['protan','No L cones'],['deutan','No M cones']],label:'Observer',get:s=>s.obs,act:'obs'}],
 on:{r(s,v){s.r=Number(v);return 'keep'},y(s,v){s.y=Number(v);return 'keep'},obs(s,v){s.obs=v;return 'keep'}},
 draw(s){
  const v=S1_ray(s.r/100,s.y/100),useL=s.obs!=='protan',useM=s.obs!=='deutan';
  const dL=useL?Math.abs(v.mL-v.yL)/Math.max(v.yL,.01):0,dM=useM?Math.abs(v.mM-v.yM)/Math.max(v.yM,.01):0,ok=dL<.04&&dM<.04;
  let out=heading(ok?'A match: these lights look identical':'No match yet');
  const pl=S1_plot(60,70,240,150,[500,700],[0,2.1],{xt:[[500,'500'],[600,'600'],[700,'700 nm']],yl:'light power'});out+=pl.svg;
  out+=R(pl.X(545)-4,pl.Y((1-s.r/100)*2),8,pl.Y(0)-pl.Y((1-s.r/100)*2),S1_wl(545),'none',2)+R(pl.X(670)-4,pl.Y(s.r/100*2),8,pl.Y(0)-pl.Y(s.r/100*2),S1_wl(670),'none',2);
  out+=R(pl.X(589)-4,pl.Y(Math.min(2.1,s.y/100)),8,pl.Y(0)-pl.Y(Math.min(2.1,s.y/100)),S1_wl(589),C.ink,2);
  out+=TF(60,262,'thin bars: red + green mix · outlined bar: yellow',13,C.muted,'start');
  const bar=(x,lab,a,b,col,on)=>{const k=60;return TF(x+40,90,lab,14,on?col:C.muted)+R(x,230-k*a,30,k*a,col,'none',3)+R(x+40,230-k*b,30,k*b,tint(col,.4),'none',3)+TF(x+15,248,'mix',13,C.muted)+TF(x+55,248,'yellow',13,C.muted)+(on?'':TF(x+40,140,'absent',13,C.muted))};
  out+=bar(340,'L cones',useL?v.mL:0,useL?v.yL:0,C.coral,useL)+bar(450,'M cones',useM?v.mM:0,useM?v.yM:0,C.green,useM);
  const b=S1_rayBest();out+=TF(60,300,`Typical match: about ${Math.round(b.r*100)}% red with yellow at ${Math.round(b.y*100)}%.`,13,C.ink,'start');
  out+=TF(60,322,s.obs==='normal'?'Two cone types must agree, so only one mix works.':'With one cone type, many mixes work once brightness is set.',13,C.muted,'start');
  return {svg:out,phase:ok?'The mix and the yellow produce the same cone responses: a metamer.':'The cone responses still differ.'};
 }});

/* =========================== opponent-colour =========================== */
// Opponent channels from the cone curves, with illustrative weights chosen so unique yellow falls near 577 nm.
const S1_opp=l=>{const v=S1_cone(l);return {lum:v.L+v.M,rg:v.L-1.62*v.M+.35*v.S,by:1.6*v.S-.5*(v.L+v.M)}};
SCENE({id:'opponent-colour',name:'Red against green, blue against yellow',tag:'Hering’s opponent colours',
 definition:'Ewald Hering noticed that no colour looks reddish-green or yellowish-blue. He proposed opponent channels: red against green, blue against yellow, and light against dark. Each channel signals one side or the other, never both.',
 example:'At about 577 nm the red–green channel is balanced, so we see a yellow with no red or green in it: “unique yellow”. Orange is red plus yellow; teal is green plus blue; but there is no reddish green.',
 desc:'The red–green and blue–yellow channel signals for the chosen wavelength, computed from the cone responses, with the hue they signal.',
 research:'Hering, E. (1878/1920). Grundzüge der Lehre vom Lichtsinn. Hurvich, L. M. & Jameson, D. (1957). An opponent-process theory of color vision. Psychological Review 64, 384–404. (Channel weights here are illustrative.)',
 dur:10,hint:'Sweep the wavelength. Find where the red–green channel crosses zero: that is unique yellow.',
 init:()=>({l:577}),
 watch(p){return {l:Math.round(440+250*p)}},
 ui:[{range:'l',label:'Wavelength',min:420,max:690,step:1,get:s=>s.l,act:'l',show:v=>v+' nm'}],
 on:{l(s,v){s.l=Number(v);return 'keep'}},
 draw(s){
  const o=S1_opp(s.l),rg=o.rg,by=o.by;let out=heading('Two opponent channels name the hue');
  out+=R(60,70,140,100,S1_wl(s.l),'none',10)+TF(130,190,s.l+' nm',14,C.ink);
  const ch=(y,lab,v,neg,pos,cn,cp)=>{let o2=TF(250,y-12,lab,13,C.ink,'start')+R(250,y,300,22,'#eef1f4','none',4)+L(400,y-4,400,y+26,C.ink,1.5);const w=clamp(v,-1,1)*150;
   o2+=R(w<0?400+w:400,y,Math.abs(w),22,w<0?cn:cp,'none',3)+TF(255,y+40,neg,13,cn,'start')+TF(545,y+40,pos,13,cp,'end');return o2};
  out+=ch(96,'red–green channel',rg,'green','red',C.green,C.coral)+ch(186,'blue–yellow channel',by,'yellow','blue','#c99a1a',C.blue);
  const hue=(Math.abs(rg)<.04?'':rg>0?'red':'green')+(Math.abs(by)<.04?'':(Math.abs(rg)<.04?'':'-')+(by>0?'blue':'yellow'));
  out+=TB(300,290,'Signalled hue: '+(hue||'neutral'),16,C.ink)+TF(300,316,Math.abs(rg)<.04?'Red–green is balanced: a unique hue.':'Never red and green at once.',13,C.muted);
  return {svg:out,phase:`At ${s.l} nm: red–green ${rg.toFixed(2)}, blue–yellow ${by.toFixed(2)}.`};
 }});

const S1_AFTER=[['pink','Pink or red'],['green','Green'],['yellow','Yellow'],['blue','Blue'],['none','Nothing']];
SCENE({id:'opponent-colour-afterimage',name:'An afterimage you make',tag:'You take part',
 definition:'Staring at a colour tires the cells that signal it, so a neutral grey then looks tinted with the opponent colour. The afterimage is evidence for opponent channels.',
 example:'After 15 seconds staring at a cyan disc, most people see a pink or reddish disc on grey. The effect is safe and fades in seconds.',
 desc:'A cyan disc to stare at for 15 seconds, then a grey field; you report the colour you see and your answer is shown beside the expected one.',
 research:'Hering, E. (1878). Brindley, G. S. (1962). Two new properties of foveal after-images. Journal of Physiology 164, 168–179. Safety: moderate contrast, no flashing, one switch after 15 s. Your answer stays on this page.',
 dur:10,hint:'Press Start, keep your eyes on the black dot for 15 seconds without blinking much, then report the colour you see on the grey. Stop if it is uncomfortable.',
 init:()=>({ph:'idle',left:15,ans:null,tally:{}}),
 watch(p){return p<.6?{ph:'stare',left:Math.max(1,15-Math.floor(p*25)),ans:null,tally:{}}:{ph:'done',left:0,ans:'pink',tally:{pink:1},sim:true}},
 ui:[{b:'Start (15 s)',act:'start'},{choose:S1_AFTER,label:'I see',get:s=>s.ans,act:'ans'}],
 on:{start(s,a,ctx){s.ph='stare';s.left=15;s.ans=null;s.tok=(s.tok||0)+1;ctx.every(1000,'tick',s.tok);return 'keep'},
  tick(s,tok){if(Number(tok)!==s.tok||s.ph!=='stare')return 'stop';s.left--;if(s.left<=0){s.ph='test';return 'stop'}return 'keep'},
  ans(s,v){if(s.ph==='idle')return 'keep';s.ans=v;s.ph='done';s.tally[v]=(s.tally[v]||0)+1;return 'keep'}},
 draw(s){
  let out='';
  if(s.ph==='stare'){out+=heading('Look at the dot: '+s.left+' s');out+=R(150,60,300,240,'#cfd8dc','none',10)+Ci(300,180,80,'#5fc9c9')+Ci(300,180,4,'#111')}
  else{out+=heading(s.ph==='idle'?'Press Start, then look at the dot':s.sim?'A simulated participant reports pink':'What colour do you see on the grey?');out+=R(150,60,300,240,'#cfd8dc','none',10)+Ci(300,180,4,'#111')}
  if(s.ph==='done'){out+=TF(300,326,'You reported: '+S1_AFTER.find(a=>a[0]===s.ans)[1]+' · expected: pink or red (the opponent of cyan)',13,s.ans==='pink'?C.green:C.ink)}
  return {svg:out,phase:s.ph==='stare'?'Keep looking at the dot.':s.ph==='done'?'Most people see pink: the cyan-signalling cells were tired, so grey looks tinted with the opponent colour.':'Press Start.'};
 }});

const S1_ZONE=[
 {t:'Young–Helmholtz: three receptors',l:['Three kinds of receptor explain colour','matching (1802, 1852). Confirmed when','cone pigments were measured (1964).']},
 {t:'Hering: opponent processes',l:['Red–green and blue–yellow opposites','explain hue naming and afterimages','(1878).']},
 {t:'Zone theory: both are right',l:['Cones come first; cells further on','compare them. Svaetichin (1956) and','De Valois (1966) recorded opponent cells.']},
 {t:'Ladd-Franklin: an evolutionary story',l:['Christine Ladd-Franklin (1892) argued','colour vision evolved in stages: light,','then blue–yellow, then red–green.']}];
SCENE({id:'opponent-colour-zone',name:'Both theories were right',tag:'From receptors to opponent cells',
 definition:'Two rival theories of colour turned out to describe two stages. Three cone types catch light (Young–Helmholtz), and later cells subtract their signals to form opponent channels (Hering).',
 example:'Recordings in the 1950s and 60s found cells excited by red and inhibited by green, and others for blue against yellow. Christine Ladd-Franklin had already argued for staged evolution of colour vision in 1892.',
 desc:'A wiring sketch from S, M and L cones to opponent channels, with cards for each theory.',
 research:'Svaetichin, G. (1956). Spectral response curves from single cones. De Valois, R. L., Abramov, I. & Jacobs, G. H. (1966). Analysis of response patterns of LGN cells. JOSA 56, 966–977. Ladd-Franklin, C. (1892). A new theory of light sensation. Marks, W. B., Dobelle, W. H. & MacNichol, E. F. (1964). Visual pigments of single primate cones. Science 143, 1181–1183.',
 dur:12,hint:'Step through the four cards and follow the wiring.',
 init:()=>({k:2}),
 watch(p){return {k:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:S1_ZONE.map((c,i)=>[i,String(i+1)]),label:'Card',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s){
  const c=S1_ZONE[s.k];let out=heading('Stage 1: cones · Stage 2: opponent channels');
  const cones=[['S',120,C.blue],['M',200,C.green],['L',280,C.coral]],ops=[['light–dark',380],['red–green',460],['blue–yellow',540]];
  const show1=s.k!==1,show2=s.k!==0;
  cones.forEach(([n,x,col])=>{out+=Ci(x,90,22,show1?col:'#d6dde2')+TF(x,95,n,14,'#fff')});
  const wires=[[1,0,'+'],[2,0,'+'],[2,1,'+'],[1,1,'−'],[0,2,'+'],[1,2,'−'],[2,2,'−']];
  if(show1&&show2)wires.forEach(([a,b,sgn])=>{out+=L(cones[a][1],112,ops[b][1]-40,170,sgn==='+'?C.ink:C.muted,1.4,sgn==='−'?'stroke-dasharray="4 3"':'')});
  ops.forEach(([n,x])=>{out+=R(x-75,170,70,34,show2?C.purplep:'#eef1f4','none',6)+TF(x-40,192,n,13,show2?C.purple:C.muted)});
  out+=TF(80,226,'solid: excites · dashed: inhibits',13,C.muted,'start');
  out+=R(40,246,520,110,s.k===3?C.amberp:C.pale,'none',8)+TB(60,272,c.t,15,C.ink,'start')+S1_lines(60,296,c.l,13,C.ink,19);
  return {svg:out,phase:c.t+'. '+c.l.join(' ')};
 }});

/* =========================== colour-blindness =========================== */
const S1_CB=[['normal','Typical'],['protan','Protan (no L)'],['deutan','Deutan (no M)'],['tritan','Tritan (no S)']];
const S1_SCENES=[['fruit','Fruit'],['lights','Traffic lights'],['chart','A chart']];
SCENE({id:'colour-blindness',name:'Seeing with two cone types',tag:'A simulation',
 definition:'Colour blindness usually means one cone type is missing or shifted. Protans lack or have altered L cones, deutans M cones, and tritans S cones. Reds and greens are most often confused.',
 example:'For a deutan, a ripe red apple and a green one can look nearly the same, and red–green charts become unreadable. Traffic lights still work because their positions and brightness differ.',
 desc:'Fruit, traffic lights or a chart drawn as they look to typical vision, or simulated for protan, deutan or tritan vision.',
 research:'Viénot, F., Brettel, H. & Mollon, J. D. (1999). Digital video colourmaps for checking the legibility of displays by dichromats. Color Research & Application 24, 243–252. Machado, G. M., Oliveira, M. M. & Fernandes, L. A. F. (2009). IEEE TVCG 15, 1291–1298. Simulations are approximate.',
 dur:12,hint:'Switch the view type and the picture. The chart shows why designers should not rely on red against green alone.',
 init:()=>({t:'deutan',sc:'fruit'}),
 watch(p){const k=Math.floor(p*6);return {t:S1_CB[k%4][0],sc:S1_SCENES[Math.min(2,Math.floor(p*3))][0]}},
 ui:[{choose:S1_CB,label:'Vision',get:s=>s.t,act:'t'},{choose:S1_SCENES,label:'Picture',get:s=>s.sc,act:'sc'}],
 on:{t(s,v){s.t=v;return 'keep'},sc(s,v){s.sc=v;return 'keep'}},
 draw(s){
  const c=h=>S1_sim(h,s.t);let out=heading((S1_CB.find(x=>x[0]===s.t)||S1_CB[0])[1]+' vision (simulated)');
  if(s.sc==='fruit'){[['#d32f2f','red apple'],['#7cb342','green apple'],['#ff9800','orange'],['#8e24aa','plum'],['#fdd835','banana']].forEach(([h,n],i)=>{const x=90+i*105;out+=Ci(x,170,40,c(h))+L(x,130,x+6,116,c('#6d4c41'),4)+TF(x,240,n,13,C.muted)})}
  if(s.sc==='lights'){out+=R(255,70,90,230,'#263238','none',14);[['#e53935',110],['#fbc02d',185],['#43a047',260]].forEach(([h,y])=>{out+=Ci(300,y,30,c(h))})}
  if(s.sc==='chart'){const pl=S1_plot(100,70,400,200,[0,5],[0,10],{yl:'sales'});out+=pl.svg;[[3,8,5,7,9],[5,4,7,6,4]].forEach((a,j)=>{const col=c(j?'#43a047':'#e53935');out+=S1_poly(a.map((v,i)=>[pl.X(i+.5),pl.Y(v)]),col,4);a.forEach((v,i)=>{out+=Ci(pl.X(i+.5),pl.Y(v),5,col)})});
   out+=TF(500,300,'red line: this year · green line: last year',13,C.muted,'end')}
  out+=TF(300,330,'Simulation only: not a test of your own vision.',13,C.muted);
  return {svg:out,phase:s.t==='normal'?'Typical trichromatic view.':`Simulated ${s.t} view: colours along the confusion lines collapse together.`};
 }});

// Ishihara-style plates: seeded dots; digit dots and background differ mainly along a red–green confusion line.
const S1_DIG={2:['01110','10001','00001','00010','00100','01000','11111'],3:['11110','00001','00001','01110','00001','00001','11110'],5:['11111','10000','11110','00001','00001','10001','01110'],6:['01110','10000','10000','11110','10001','10001','01110'],7:['11111','00001','00010','00100','01000','01000','01000'],8:['01110','10001','10001','01110','10001','10001','01110']};
const S1_PLATES=[7,3,5,8];
const S1_IN=['#d9744a','#e08a50','#c9663e','#e39a62','#d8805a'],S1_OUT=['#9bb04a','#8aa848','#a9b860','#7f9c43','#b5b36a'];
function S1_plate(digit,seed,type){const r=S1_rng(seed),cx=190,cy=192,R0=130,bm=S1_DIG[digit],cell=26;let out=Ci(cx,cy,R0+6,'#f4efe6');
 for(let gx=-R0;gx<=R0;gx+=13)for(let gy=-R0;gy<=R0;gy+=13){const x=cx+gx+(r()-.5)*7,y=cy+gy+(r()-.5)*7;if(Math.hypot(x-cx,y-cy)>R0-4)continue;
  const col=Math.floor((x-(cx-65))/cell),row=Math.floor((y-(cy-91))/cell),inD=row>=0&&row<7&&col>=0&&col<5&&bm[row][col]==='1';
  const pal=inD?S1_IN:S1_OUT;out+=Ci(x,y,3.6+r()*2.6,S1_sim(pal[Math.floor(r()*pal.length)],type))}
 return out}
SCENE({id:'colour-blindness-plates',name:'Reading a dot plate',tag:'You take part',
 definition:'Dot plates hide a number in dots that differ from the background mainly in red–green hue, not brightness. People with red–green colour blindness may not see the number. Shinobu Ishihara published the best-known set in 1917.',
 example:'Typical observers read these plates easily. In the simulated deutan view the number fades into the background. A screen test is not a diagnosis: screens, lighting and printing all change the colours.',
 desc:'Four seeded dot plates hiding a number; you choose what you see, and can switch to a simulated deutan view.',
 research:'Ishihara, S. (1917). Tests for Colour-Blindness. Birch, J. (1997). Efficiency of the Ishihara test for identifying red-green colour deficiency. Ophthalmic and Physiological Optics 17, 403–408. Not a diagnosis: see an optometrist. Your answers stay on this page.',
 dur:12,hint:'Pick the number you see on each plate, or “None”. Then switch to the simulated deutan view to see how the plate changes.',
 init:()=>({i:0,view:'normal',ans:{}}),
 watch(p){const i=Math.min(3,Math.floor(p*4)),ans={};for(let k=0;k<i;k++)ans[k]=String(S1_PLATES[k]);return {i,view:p>.7?'deutan':'normal',ans,sim:true}},
 ui:[{choose:[['2','2'],['3','3'],['5','5'],['6','6'],['7','7'],['8','8'],['none','None']],label:'I see',get:s=>s.ans[s.i]||null,act:'ans'},{b:'Next plate',act:'next'},{choose:[['normal','Your own view'],['deutan','Simulated deutan']],label:'View',get:s=>s.view,act:'view'}],
 on:{ans(s,v){s.ans[s.i]=v;return 'keep'},next(s){s.i=(s.i+1)%4;return 'keep'},view(s,v){s.view=v;return 'keep'}},
 draw(s){
  let out=heading('Plate '+(s.i+1)+' of 4'+(s.view==='deutan'?' · simulated deutan view':''))+S1_plate(S1_PLATES[s.i],100+s.i,s.view);
  out+=TB(360,84,s.sim?'Simulated typical observer':'Your answers',14,C.ink,'start');
  S1_PLATES.forEach((d,k)=>{const a=s.ans[k],y=112+k*26;out+=TF(360,y,'Plate '+(k+1)+': '+(a===undefined?'—':a==='none'?'none':a)+(a===undefined?'':a===String(d)?'  ✓':'  (plate shows '+d+')'),13,a===undefined?C.muted:a===String(d)?C.green:C.coral,'start')});
  const n=Object.keys(s.ans).length,ok=S1_PLATES.filter((d,k)=>s.ans[k]===String(d)).length;
  out+=TF(360,232,n?ok+' of '+n+' read as printed':'',13,C.ink,'start');
  out+=S1_lines(360,272,['Not a diagnosis. Screens and lighting','change colours; see an optometrist','if you have concerns.'],13,C.muted,18);
  return {svg:out,phase:n?`${ok} of ${n} plates read as printed.`:'Choose the number you see.'};
 }});

SCENE({id:'colour-blindness-genetics',name:'Why mostly men',tag:'Dalton and the X chromosome',
 definition:'The genes for the L and M cone pigments sit on the X chromosome. Men have one X, so one altered copy shows; women need two. That is why red–green colour blindness affects about 8% of men of northern European descent but about 0.5% of women.',
 example:'John Dalton described his own colour blindness in 1794. In 1995, DNA from his preserved eye showed he was a deuteranope, missing M cones.',
 desc:'How common red–green colour blindness is in men and women for a chosen gene frequency, with a family diagram for a carrier mother.',
 research:'Dalton, J. (1798). Extraordinary facts relating to the vision of colours. Memoirs of the Literary and Philosophical Society of Manchester 5, 28–45. Hunt, D. M. et al. (1995). The chemistry of John Dalton’s color blindness. Science 267, 984–988. Nathans, J. et al. (1986). Science 232, 193–202. Birch, J. (2012). Worldwide prevalence of red-green color deficiency. JOSA A 29, 313–320.',
 dur:10,hint:'Change the share of X chromosomes carrying the variant. Women are affected only when both copies carry it.',
 init:()=>({q:8}),
 watch(p){return {q:Math.round(2+8*p)}},
 ui:[{range:'q',label:'Men affected',min:1,max:12,step:.5,get:s=>s.q,act:'q',show:v=>v+'%'}],
 on:{q(s,v){s.q=Number(v);return 'keep'}},
 draw(s){
  const q=s.q/100,w=q*q,car=2*q*(1-q);let out=heading('An X-linked trait: common in men, rare in women');
  const bars=[['men affected',q,C.coral],['women affected',w,C.purple],['women carriers',car,'#c9a2d8']];
  bars.forEach(([n,v,col],i)=>{const y=80+i*44;out+=TF(60,y+15,n,13,C.ink,'start')+R(200,y,300,22,'#eef1f4','none',4)+R(200,y,300*v/.25,22,col,'none',4)+TF(510,y+16,(v*100).toFixed(v<.01?2:1)+'%',13,C.ink,'start')});
  out+=TF(200,222,'bar scale: 0–25%',13,C.muted,'start');
  const fam=[[120,280,'carrier mother','#c9a2d8'],[220,280,'typical father',C.blue]];fam.forEach(([x,y,l,col])=>{out+=Ci(x,y,16,col)+TF(x,y+32,l,13,C.muted)});
  out+=L(136,280,204,280,C.line,2)+TF(390,264,'Each son: 1 in 2 chance',13,C.coral,'start')+TF(390,286,'Each daughter: 1 in 2 a carrier,',13,C.purple,'start')+TF(390,306,'almost never affected',13,C.purple,'start');
  return {svg:out,phase:`If ${s.q}% of men are affected, about ${(w*100).toFixed(2)}% of women are affected and ${(car*100).toFixed(1)}% are carriers.`};
 }});
