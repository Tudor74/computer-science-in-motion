/* ===================== Physics era 5 · Light ===================== */
// Shared helpers for light: wavelength → colour, a simple eye, angle arcs, and Snell's law in vector form.
function P5_wlRGB(nm){
 let r=0,g=0,b=0;
 if(nm<440){r=-(nm-440)/60;b=1}else if(nm<490){g=(nm-440)/50;b=1}else if(nm<510){g=1;b=-(nm-510)/20}
 else if(nm<580){r=(nm-510)/70;g=1}else if(nm<645){r=1;g=-(nm-645)/65}else{r=1}
 const f=nm<420?.3+.7*(nm-380)/40:nm>700?.3+.7*(780-nm)/80:1;
 return [r,g,b].map(c=>Math.round(255*Math.pow(clamp(c*f,0,1),.8)));
}
const P5_hex=(c)=>'#'+c.map(v=>pad(clamp(Math.round(v),0,255).toString(16),2)).join('');
const P5_wl=nm=>P5_hex(P5_wlRGB(nm));
const P5_deg=r=>r*180/Math.PI,P5_rad=d=>d*Math.PI/180;
// An eye seen from the side, looking left (towards decreasing x) unless flipped.
function P5_eye(x,y,s=1,flip=false){const d=flip?-1:1;return P(`M${x-16*s*d} ${y}Q${x} ${y-12*s} ${x+16*s*d} ${y}Q${x} ${y+12*s} ${x-16*s*d} ${y}Z`,C.ink,1.8,'#fff')+Ci(x-4*s*d,y,5*s,C.ink)}
// Arc for an angle at (cx,cy) between two SVG directions (degrees, 0 = +x, 90 = down).
function P5_arc(cx,cy,r,a1,a2,col=C.amber){const p=a=>[cx+r*Math.cos(P5_rad(a)),cy+r*Math.sin(P5_rad(a))],[x1,y1]=p(a1),[x2,y2]=p(a2);return P(`M${fmt(x1)} ${fmt(y1)}A${r} ${r} 0 0 ${a2>a1?1:0} ${fmt(x2)} ${fmt(y2)}`,col,2)}
// Refract direction d (unit) at a surface with unit normal n facing the incoming side; eta = n1/n2. Null if total internal reflection.
function P5_refract(d,n,eta){const ci=-(n[0]*d[0]+n[1]*d[1]),k=1-eta*eta*(1-ci*ci);if(k<0)return null;const t=eta*ci-Math.sqrt(k);return [eta*d[0]+t*n[0],eta*d[1]+t*n[1]]}
function P5_reflect(d,n){const dn=d[0]*n[0]+d[1]*n[1];return [d[0]-2*dn*n[0],d[1]-2*dn*n[1]]}
// Glass dispersion (a Cauchy fit close to crown glass) and water (for rainbows).
const P5_nGlass=nm=>1.5046+4200/(nm*nm);
const P5_nWater=nm=>1.3245+3087/(nm*nm);
const P5_SEVEN=[['red',700],['orange',620],['yellow',580],['green',530],['blue',470],['indigo',445],['violet',410]];

/* ---------- Lesson: reflection and refraction ---------- */
SCENE({id:'reflection-refraction',name:'Reflection',tag:'Light bounces at equal angles',
 definition:'When light reflects from a smooth surface, the angle of incidence equals the angle of reflection, both measured from the normal (the line at right angles to the surface).',
 example:'Ibn al-Haytham argued around 1021 that we see because light travels from objects into the eye, not out of the eye. A rough surface such as paper scatters light in every direction, which is why you can read it from anywhere in the room.',
 research:'Ibn al-Haytham (c. 1011–1021). Kitāb al-Manāẓir (Book of Optics): vision by light entering the eye, and experimental tests of reflection.',
 desc:'A lamp’s ray strikes a mirror and leaves at the same angle on the other side of the dashed normal line, into an eye. On a rough surface the light scatters in many directions.',
 dur:9,hint:'Change the angle of incidence, then switch to a rough surface to see diffuse reflection.',
 init:()=>({ang:35,rough:false}),
 watch(p){return {ang:Math.round(lerp(20,70,smooth(Math.min(1,p*1.25)))),rough:p>.82}},
 ui:[{range:'ang',label:'Angle of incidence',min:5,max:85,get:s=>s.ang,act:'ang',show:v=>v+'°'},{choose:[['false','Smooth mirror'],['true','Rough surface']],label:'Surface',get:s=>String(s.rough),act:'rough'}],
 on:{ang(s,v){s.ang=v},rough(s,v){s.rough=v==='true'}},
 draw(s){
  const a=P5_rad(s.ang),H=[300,268],Lr=190,src=[H[0]-Lr*Math.sin(a),H[1]-Lr*Math.cos(a)],eye=[H[0]+Lr*Math.sin(a),H[1]-Lr*Math.cos(a)];
  let out=heading(s.rough?'A rough surface scatters light every way':'Angle of incidence = angle of reflection');
  if(s.rough){const r=rng(17);let d=`M50 ${H[1]}`;for(let x=60;x<=550;x+=10)d+=`L${x} ${fmt(H[1]+(r()-.5)*9)}`;out+=P(d,C.dark,3)}
  else out+=L(50,H[1],550,H[1],C.dark,4)+range(25).map(i=>L(60+i*20,H[1]+3,50+i*20,H[1]+16,C.line,1.5)).join('');
  out+=L(H[0],H[1],H[0],70,C.muted,1.6,'stroke-dasharray="6 5"')+T(H[0]+8,78,'normal',13,C.muted,'start');
  out+=Ci(src[0],src[1],13,'#ffd24a','#c79100')+arrow(src[0],src[1],H[0],H[1],C.coral,3,10);
  if(s.rough){const r=rng(5);for(let i=0;i<7;i++){const da=P5_rad(-70+i*23+(r()-.5)*10),L2=120+r()*40;out+=arrow(H[0],H[1],H[0]+L2*Math.sin(da),H[1]-L2*Math.cos(da),C.coral,1.8,8,'opacity=".7"')}}
  else out+=arrow(H[0],H[1],eye[0],eye[1],C.coral,3,10)+P5_eye(eye[0]+14*Math.sin(a),eye[1]-14*Math.cos(a),1,true);
  out+=P5_arc(H[0],H[1],54,-90-s.ang,-90)+TB(H[0]-70*Math.sin(a/2)-18,H[1]-70*Math.cos(a/2),'i = '+s.ang+'°',15,C.amber,'end');
  if(!s.rough)out+=P5_arc(H[0],H[1],54,-90,-90+s.ang)+TB(H[0]+70*Math.sin(a/2)+18,H[1]-70*Math.cos(a/2),'r = '+s.ang+'°',15,C.amber,'start');
  out+=T(300,330,s.rough?'Each tiny patch of the surface still obeys i = r, but the patches face different ways.':'Measured from the normal, not from the mirror.',14,C.muted);
  return {svg:out,phase:s.rough?'Diffuse reflection: every point of the paper sends light towards your eye, wherever you stand. Ibn al-Haytham used this idea to explain vision: light comes from the object to the eye.':`The ray arrives ${s.ang}° from the normal and leaves ${s.ang}° from it on the other side. Mirrors reverse the direction across the normal; they do not choose a new angle.`};
 }});

SCENE({id:'reflection-refraction-snell',name:'Snell’s law',tag:'The ratio of sines stays constant',
 definition:'When light passes into a different material it changes direction, so that n₁ sin θ₁ = n₂ sin θ₂, where n is the refractive index of each material.',
 example:'From air into water (n = 1.33), a ray 40° from the normal continues at about 29°. Measure several pairs of angles and the ratio of their sines is always 1.33: that constancy is the law.',
 research:'Ibn Sahl (984), On Burning Mirrors and Lenses; Willebrord Snell (1621, unpublished, later reported by Huygens); René Descartes (1637), La Dioptrique.',
 desc:'A ray crosses from air into a lower medium and bends towards the normal. A chart plots the sine of the angle out against the sine of the angle in; recorded points fall on a straight line.',
 dur:10,hint:'Set an angle and press Record. Repeat at several angles: the points line up, because the sines keep the same ratio.',
 init:()=>({ang:40,n2:1.33,rec:[]}),
 watch(p){const ang=Math.round(lerp(10,80,Math.min(1,p*1.1)));return {ang,n2:1.33,rec:[10,20,30,40,50,60,70,80].filter(a=>a<=ang).map(a=>[a,P5_deg(Math.asin(Math.sin(P5_rad(a))/1.33))])}},
 ui:[{range:'ang',label:'Angle in',min:0,max:89,get:s=>s.ang,act:'ang',show:v=>v+'°'},{choose:[['1.33','Water 1.33'],['1.5','Glass 1.50'],['2.42','Diamond 2.42']],label:'Lower material',get:s=>String(s.n2),act:'n2'},{b:'Record this pair',act:'rec'},{b:'Clear',act:'clear'}],
 on:{ang(s,v){s.ang=v},n2(s,v){s.n2=Number(v);s.rec=[]},rec(s){const t2=P5_deg(Math.asin(Math.sin(P5_rad(s.ang))/s.n2));s.rec=s.rec.filter(r=>r[0]!==s.ang).concat([[s.ang,t2]]).slice(-10)},clear(s){s.rec=[]}},
 draw(s){
  const a=P5_rad(s.ang),t2=Math.asin(Math.sin(a)/s.n2),H=[190,200],name={1.33:'water',1.5:'glass',2.42:'diamond'}[s.n2];
  let out=heading('Light bends towards the normal as it slows');
  out+=R(20,200,350,150,'#dcecf5','none',0)+T(30,190,'air  n = 1.00',14,C.muted,'start')+T(30,340,name+'  n = '+fmt(s.n2),14,C.blue,'start')+L(20,200,370,200,C.line,2);
  out+=L(H[0],60,H[0],345,C.muted,1.5,'stroke-dasharray="6 5"');
  const src=[H[0]-140*Math.sin(a),H[1]-140*Math.cos(a)],out2=[H[0]+140*Math.sin(t2),H[1]+140*Math.cos(t2)],refl=[H[0]+110*Math.sin(a),H[1]-110*Math.cos(a)];
  out+=arrow(src[0],src[1],H[0],H[1],C.coral,3,10)+arrow(H[0],H[1],refl[0],refl[1],C.coral,1.4,7,'opacity=".35"')+arrow(H[0],H[1],out2[0],out2[1],C.coral,3,10);
  out+=P5_arc(H[0],H[1],46,-90-s.ang,-90)+TB(H[0]-26,H[1]-60,'θ₁ = '+s.ang+'°',14,C.amber,'end');
  out+=P5_arc(H[0],H[1],46,90-P5_deg(t2),90,C.purple)+TB(H[0]+22,H[1]+68,'θ₂ = '+P5_deg(t2).toFixed(1)+'°',14,C.purple,'start');
  // Chart of sin θ2 against sin θ1.
  const cx=410,cy=310,w=170,h=210;out+=L(cx,cy,cx+w,cy,C.line,1.5)+L(cx,cy,cx,cy-h,C.line,1.5)+TF(cx+w/2,cy+30,'sin θ₁ (in)',13,C.muted)+TF(cx-6,cy-h-8,'sin θ₂ (out)',13,C.muted,'start');
  for(const v of [0,.5,1])out+=TF(cx+v*w,cy+15,fmt(v),13,C.muted)+TF(cx-6,cy-v*h+4,fmt(v),13,C.muted,'end');
  out+=L(cx,cy,cx+w,cy-h/s.n2,C.blue,2,'stroke-dasharray="5 4"');
  for(const [i1,i2] of s.rec)out+=Ci(cx+Math.sin(P5_rad(i1))*w,cy-Math.sin(P5_rad(i2))*h,5,C.coral);
  out+=Ci(cx+Math.sin(a)*w,cy-Math.sin(t2)*h,6,'none',C.ink);
  out+=TF(cx+w/2,72,`sin θ₁ ÷ sin θ₂ = ${s.ang?(Math.sin(a)/Math.sin(t2)).toFixed(2):'—'}`,14,C.ink);
  return {svg:out,phase:`${s.ang}° in becomes ${P5_deg(t2).toFixed(1)}° in ${name}. ${s.rec.length>1?`Your ${s.rec.length} recorded pairs lie on one straight line of slope 1/${fmt(s.n2)}: the ratio of sines never changes.`:'Ptolemy tabulated angles and thought they were roughly proportional; the exact rule is about sines.'}`};
 }});

SCENE({id:'reflection-refraction-tir',name:'Total internal reflection',tag:'Light trapped in a fibre',
 definition:'Going from a denser to a less dense material, light beyond the critical angle cannot escape at all and is reflected completely. The critical angle satisfies sin θc = n₂ / n₁.',
 example:'Optical fibres carry internet traffic this way: light zigzags along a glass core whose cladding has a slightly lower refractive index, so each bounce is a total internal reflection.',
 research:'Daniel Colladon (1842), light guided in a jet of water, Comptes rendus; Charles Kao & George Hockham (1966), glass fibres for communication, Proceedings of the IEE.',
 desc:'A light ray zigzags along a glass fibre core. If it meets the wall beyond the critical angle it is reflected and stays inside; if too steep, it leaks out into the cladding.',
 dur:10,hint:'Tilt the light entering the fibre. Past the acceptance angle it starts leaking out. A higher core index traps steeper rays.',
 init:()=>({ang:12,ncore:1.5}),
 watch(p){return {ang:Math.round(lerp(4,34,smooth(p))),ncore:1.5}},
 ui:[{range:'ang',label:'Ray angle to the fibre',min:0,max:45,get:s=>s.ang,act:'ang',show:v=>v+'°'},{range:'ncore',label:'Core index',min:1.42,max:1.7,step:.01,get:s=>s.ncore,act:'ncore',show:v=>Number(v).toFixed(2)}],
 on:{ang(s,v){s.ang=v},ncore(s,v){s.ncore=v}},
 draw(s){
  const nc=s.ncore,ncl=1.40,thc=P5_deg(Math.asin(ncl/nc)),wall=90-s.ang,trapped=wall>thc,top=130,bot=230;
  let out=heading(trapped?'Every bounce is total internal reflection':'Too steep: the light leaks out');
  out+=R(30,top-40,540,40,'#eef2f4','none',0)+R(30,bot,540,40,'#eef2f4','none',0)+R(30,top,540,bot-top,'#dcecf5','none',0);
  out+=T(40,top-14,'cladding n = 1.40',13,C.muted,'start')+T(40,bot+26,'cladding n = 1.40',13,C.muted,'start')+T(560,top+20,'core n = '+nc.toFixed(2),13,C.blue,'end');
  let x=40,y=(top+bot)/2,dy=-1,k=Math.tan(P5_rad(s.ang)),path=`M${x} ${y}`,bounces=0,escaped=null;
  if(s.ang===0)path+=`L560 ${y}`;
  else while(x<560&&bounces<40){const ty=dy<0?top:bot,dx=Math.abs(ty-y)/k;if(x+dx>560){path+=`L560 ${fmt(y+dy*(560-x)*k)}`;break}x+=dx;y=ty;path+=`L${fmt(x)} ${y}`;
   if(!trapped){escaped=[x,y,dy];break}dy=-dy;bounces++}
  out+=P(path,C.coral,3);
  if(escaped){const t2=Math.asin(Math.min(1,nc*Math.sin(P5_rad(wall))/ncl)),ex=escaped[0]+70*Math.cos(t2),ey=escaped[1]+escaped[2]*70*Math.sin(t2);
   out+=arrow(escaped[0],escaped[1],Math.min(580,escaped[0]+70*Math.sin(t2)),escaped[1]+escaped[2]*70*Math.cos(t2),C.coral,2.5,9)+Ci(escaped[0],escaped[1],6,'none',C.coral);void ex;void ey}
  else out+=TB(560,y+(dy>0?-8:14),'→ out the far end',13,C.green,'end');
  out+=R(60,292,480,64,trapped?C.greenp:C.coralp,trapped?C.green:C.coral,10);
  out+=TB(300,318,`critical angle θc = sin⁻¹(1.40 / ${nc.toFixed(2)}) = ${thc.toFixed(1)}°`,15,C.ink);
  out+=T(300,342,`ray meets the wall at ${wall}° from the normal: ${trapped?'more than θc, so it is trapped':'less than θc, so most of it escapes'}`,14,trapped?C.green:C.coral);
  return {svg:out,phase:trapped?`The ray hits the core wall ${wall}° from the normal, beyond the critical angle of ${thc.toFixed(1)}°, so none of it can refract out. It bounces about ${bounces} times in this short stretch, and a real fibre carries it for kilometres.`:`At ${wall}° from the normal the ray is inside the critical angle (${thc.toFixed(1)}°), so it refracts out into the cladding. Fibres only accept light within a narrow cone around their axis.`};
 }});

/* ---------- Lesson: lenses ---------- */
// Paraxial ray tracing: a thin lens of focal length f changes a ray's slope k at height y to k − y/f.
function P5_lensMap(x,y,sx,sy){return [300+x*sx,200-y*sy]}
SCENE({id:'lenses',name:'Lenses and images',tag:'1/f = 1/u + 1/v',
 definition:'A lens bends light so that rays from one point of an object meet again at one point of an image. For a thin lens, 1/f = 1/u + 1/v, where u is the object distance, v the image distance and f the focal length.',
 example:'With f = 10 cm and the object at 30 cm, the image forms 15 cm behind the lens, inverted and half the size. Bring the object inside the focal length and the rays no longer meet: you see an upright, magnified virtual image, as with a magnifying glass.',
 research:'Johannes Kepler (1611). Dioptrice: the first account of how lenses form real and virtual images (thin-lens equation in its modern form from Gaussian optics, 1841).',
 desc:'A ray diagram: an object arrow left of a lens, three principal rays bending at the lens, and the image arrow where they meet, solid if real and dashed if virtual.',
 dur:10,hint:'Move the object and change the focal length. Negative focal lengths make a diverging lens, which always gives a smaller, upright, virtual image.',
 init:()=>({u:30,f:10}),
 watch(p){return {u:Math.round(lerp(45,4,smooth(p))),f:10}},
 ui:[{range:'u',label:'Object distance',min:2,max:48,get:s=>s.u,act:'u',show:v=>v+' cm'},{range:'f',label:'Focal length',min:-20,max:20,get:s=>s.f,act:'f',show:v=>v+' cm'}],
 on:{u(s,v){s.u=v},f(s,v){s.f=v}},
 draw(s){
  const f=Math.abs(s.f)<4?(s.f<0?-4:4):s.f,u=s.u,h=4,sx=5,sy=12,conv=f>0,M=(x,y)=>P5_lensMap(x,y,sx,sy);
  const v=Math.abs(u-f)<.01?Infinity:1/(1/f-1/u),m=-v/u,real=v>0&&isFinite(v);
  let out=heading(conv?'A converging lens':'A diverging lens');
  out+=L(20,200,580,200,C.line,1.5);
  out+=conv?P('M300 92Q318 200 300 308Q282 200 300 92Z',C.blue,2,'#dcecf5'):P('M290 92H310Q298 200 310 308H290Q302 200 290 92Z',C.blue,2,'#dcecf5');
  for(const sgn of [-1,1]){const [fx]=M(sgn*Math.abs(f),0);out+=Ci(fx,200,4,C.ink)+TF(fx,220,'F',13,C.ink)}
  const [ox,oy]=M(-u,h);out+=arrow(ox,200,ox,oy,C.green,4,11)+TF(ox,oy-8,'object',13,C.green);
  const rays=[0,-h/u];if(Math.abs(u-f)>.6)rays.push(-h/(u-f));
  const cols=[C.coral,C.purple,C.amber];
  rays.forEach((k,i)=>{const yl=h+k*u,ko=k-yl/f,[x0,y0]=M(-u,h),[xl,yl2]=M(0,yl),xe=58,[x2,y2]=M(xe,yl+ko*xe);
   out+=L(x0,y0,xl,yl2,cols[i],2)+L(xl,yl2,x2,y2,cols[i],2);
   if(!real&&isFinite(v)){const xb=Math.max(-56,v*1.2),[x3,y3]=M(xb,yl+ko*xb);out+=L(xl,yl2,x3,y3,cols[i],1.4,'stroke-dasharray="5 4" opacity=".7"')}});
  if(isFinite(v)&&Math.abs(v)<60){const [ix,iy]=M(v,m*h);out+=arrow(ix,200,ix,iy,C.coral,4,11,real?'':'stroke-dasharray="6 4"')+TF(ix,iy+(m<0?18:-8),real?'real image':'virtual image',13,C.coral)}
  const desc=!isFinite(v)?'no image: the rays leave parallel':`${real?'real':'virtual'}, ${m<0?'inverted':'upright'}, ${Math.abs(m)>1.02?'larger':Math.abs(m)<.98?'smaller':'same size'}`;
  out+=R(40,326,520,40,'#fff',C.grid,8)+TF(300,351,`1/${fmt(f)} = 1/${u} + 1/v  →  v = ${isFinite(v)?fmt(Math.round(v*10)/10)+' cm':'∞'}   ·   m = ${isFinite(v)?fmt(Math.round(m*100)/100):'∞'}   ·   ${desc}`,14,C.ink);
  return {svg:out,phase:`${desc[0].toUpperCase()+desc.slice(1)}. ${real?'Light really reaches the image point, so a screen placed there would show it.':isFinite(v)?'The rays only seem to come from the image point; your eye traces them back. No screen could catch it.':'The object sits at the focal point.'} Idealised thin lens, rays near the axis.`};
 }});

SCENE({id:'lenses-eye',name:'The eye and glasses',tag:'Focusing on the retina',
 definition:'The cornea and lens of the eye form a real image on the retina. To focus at different distances the eye changes its power (accommodation). Glasses add a lens to bring the focus back onto the retina.',
 example:'A short-sighted eye focuses too strongly, so distant objects come to a focus in front of the retina; a diverging lens of −2 dioptres corrects it. Power in dioptres is 1 ÷ focal length in metres.',
 research:'Johannes Kepler (1604). Ad Vitellionem paralipomena: the retinal image; F. C. Donders (1864). On the Anomalies of Accommodation and Refraction of the Eye.',
 desc:'A side view of an eye. Rays from an object meet inside the eye, in front of, on or behind the retina; a letter E in the corner is sharp or blurred to match. A glasses lens can be added in front.',
 dur:12,hint:'Pick an eye, move the object, and add glasses until the letter is sharp. Dioptres are 1 ÷ focal length in metres.',
 init:()=>({eye:'myopic',d:600,g:0}),
 watch(p){if(p<.33)return {eye:'normal',d:Math.round(lerp(600,22,smooth(p/.33))),g:0};if(p<.66)return {eye:'myopic',d:600,g:p<.5?0:-2};return {eye:'hyperopic',d:30,g:p<.83?0:2}},
 ui:[{choose:[['normal','Typical eye'],['myopic','Short-sighted'],['hyperopic','Long-sighted']],label:'Eye',get:s=>s.eye,act:'eye'},{range:'d',label:'Object distance',min:10,max:600,step:5,get:s=>s.d,act:'d',show:v=>v>=600?'6 m (far)':v+' cm'},{range:'g',label:'Glasses',min:-4,max:4,step:.5,get:s=>s.g,act:'g',show:v=>(v>0?'+':'')+v+' D'}],
 on:{eye(s,v){s.eye=v},d(s,v){s.d=v},g(s,v){s.g=v}},
 draw(s){
  const Lm=1/60,relax=60+({normal:0,myopic:2,hyperopic:-2})[s.eye],A=4,dm=s.d/100,need=1/Lm+1/dm-s.g,P=clamp(need,relax,relax+A),vergence=P+s.g-1/dm,v=vergence>0?1/vergence:Infinity,sharp=Math.abs(need-P)<.05;
  let out=heading(sharp?'In focus on the retina':v<Lm?'Focus falls in front of the retina':'Focus falls behind the retina');
  const ex=330,ret=480,cy=190,vpx=isFinite(v)?clamp(v/Lm*(ret-ex),40,260):260,fx=ex+vpx;
  out+=P(`M${ex-30} ${cy-95}Q${ex-62} ${cy} ${ex-30} ${cy+95}`,C.blue,2.5)+Ci(ex+70,cy,112,'#fbfcfd',C.line)+P(`M${ret-4} ${cy-80}Q${ret+8} ${cy} ${ret-4} ${cy+80}`,C.coral,5)+TF(ret+18,cy-82,'retina',13,C.coral,'start');
  out+=`<ellipse cx="${ex}" cy="${cy}" rx="${10+(P-relax)*2}" ry="34" fill="#dcecf5" stroke="${C.blue}" stroke-width="2"/>`;
  out+=arrow(60,cy,60,cy-46,C.green,4,11)+TF(60,cy+20,s.d>=600?'6 m away':s.d+' cm away',13,C.green)+TF(60,cy+36,'(not to scale)',13,C.muted);
  if(s.g){const gx=245;out+=s.g>0?P(`M${gx} ${cy-60}Q${gx+14} ${cy} ${gx} ${cy+60}Q${gx-14} ${cy} ${gx} ${cy-60}Z`,C.purple,2,'#efeaf8'):P(`M${gx-8} ${cy-60}H${gx+8}Q${gx} ${cy} ${gx+8} ${cy+60}H${gx-8}Q${gx} ${cy} ${gx-8} ${cy-60}Z`,C.purple,2,'#efeaf8');out+=TF(gx,cy+80,(s.g>0?'+':'')+s.g+' D',13,C.purple)}
  for(const py of [-28,28]){out+=L(60,cy-46,ex,cy+py,C.amber,1.6);const sl=(cy+18-(cy+py))/vpx,tx=Math.min(fx,ret);out+=L(ex,cy+py,tx,cy+py+sl*(tx-ex),C.amber,1.8);if(fx<ret)out+=L(fx,cy+18,ret,cy+18+sl*(ret-fx),C.amber,1.4,'opacity=".7"')}
  const blur=clamp(Math.abs(vpx-(ret-ex))/(vpx||1)*28,0,14);
  out+=R(20,262,150,96,'#fff',C.grid,8)+TF(95,280,'what you see',13,C.muted);
  for(let i=0;i<(blur>1?6:1);i++){const a=i/6*2*Math.PI,dx=blur>1?Math.cos(a)*blur:0,dy=blur>1?Math.sin(a)*blur:0;out+=TB(95+dx,344+dy,'E',54,C.ink,'middle',`opacity="${blur>1?.25:1}"`)}
  out+=TF(420,330,`needs ${need.toFixed(1)} D · eye can give ${relax}–${relax+A} D`,14,sharp?C.green:C.coral)+TF(420,350,sharp?'sharp':'blurred: '+(need>relax+A?'object too close for this eye':'eye cannot relax enough'),14,sharp?C.green:C.coral);
  const advice=s.eye==='myopic'?'A short-sighted eye is too strong for distant objects; a diverging lens (about −2 D here) moves the focus back.':s.eye==='hyperopic'?'A long-sighted eye must strain even for distant objects and runs out of power up close; a converging lens (about +2 D here) helps.':'A typical adult eye relaxes for distance and adds up to about 4 D of power, reaching to roughly 25 cm.';
  return {svg:out,phase:`${sharp?'Sharp.':'Blurred.'} ${advice} Simplified eye: 60 D when relaxed, 4 D of accommodation.`};
 }});

SCENE({id:'lenses-telescope',name:'Telescopes',tag:'Magnifying angles',
 definition:'A refracting telescope uses an objective lens to form an image of a distant object and an eyepiece to view that image. It magnifies angles by M = f(objective) ÷ f(eyepiece).',
 example:'Galileo’s 1609 telescope used a converging objective and a diverging eyepiece, giving an upright image at about 20×. Kepler’s design (two converging lenses) gives an inverted image but a wider field, and became the astronomer’s standard.',
 research:'Galileo Galilei (1610). Sidereus Nuncius; Johannes Kepler (1611). Dioptrice: the two-convex-lens telescope.',
 desc:'Parallel rays from a distant star enter a large objective lens, come to a focus, then pass through an eyepiece and leave at a steeper angle. The tube length and magnification are shown.',
 dur:10,hint:'Change the two focal lengths and the design. Magnification is the ratio of focal lengths; the tube gets longer as you magnify more.',
 init:()=>({fo:100,fe:5,kind:'kepler'}),
 watch(p){return {fo:Math.round(lerp(40,100,smooth(p))),fe:5,kind:p<.6?'kepler':'galileo'}},
 ui:[{range:'fo',label:'Objective f',min:20,max:120,step:5,get:s=>s.fo,act:'fo',show:v=>v+' cm'},{range:'fe',label:'Eyepiece f',min:2,max:20,get:s=>s.fe,act:'fe',show:v=>v+' cm'},{choose:[['kepler','Kepler (inverted)'],['galileo','Galileo (upright)']],label:'Design',get:s=>s.kind,act:'kind'}],
 on:{fo(s,v){s.fo=v;s.fe=Math.min(s.fe,v-1)},fe(s,v){s.fe=Math.min(v,s.fo-1)},kind(s,v){s.kind=v}},
 draw(s){
  const kep=s.kind==='kepler',fe=Math.min(s.fe,s.fo-1),d=kep?s.fo+fe:s.fo-fe,sc=430/(s.fo+fe),sy=10,x0=70,cy=190,Mx=x=>x0+x*sc,My=y=>cy-y*sy,M=s.fo/fe;
  let out=heading(kep?'Kepler’s telescope: two converging lenses':'Galileo’s telescope: a diverging eyepiece');
  out+=L(20,cy,580,cy,C.line,1.5);
  out+=`<ellipse cx="${x0}" cy="${cy}" rx="9" ry="70" fill="#dcecf5" stroke="${C.blue}" stroke-width="2"/>`+TF(x0,cy+92,'objective',13,C.blue);
  const ex=Mx(d);out+=kep?`<ellipse cx="${fmt(ex)}" cy="${cy}" rx="6" ry="34" fill="#dcecf5" stroke="${C.blue}" stroke-width="2"/>`:P(`M${fmt(ex-6)} ${cy-34}H${fmt(ex+6)}Q${fmt(ex)} ${cy} ${fmt(ex+6)} ${cy+34}H${fmt(ex-6)}Q${fmt(ex)} ${cy} ${fmt(ex-6)} ${cy-34}Z`,C.blue,2,'#dcecf5');
  out+=TF(ex,cy+56,'eyepiece',13,C.blue);
  if(kep)out+=L(Mx(s.fo),cy-60,Mx(s.fo),cy+60,C.muted,1,'stroke-dasharray="4 4"')+TF(Mx(s.fo),cy-66,'focus',13,C.muted);
  const k0=-Math.tan(P5_rad(.6));let kout=0;
  for(const y0 of [-4,0,4]){const xs=-60/sc,ys=y0+k0*xs,k1=k0-y0/s.fo,ye=y0+k1*d,k2=k1-ye/(kep?fe:-fe);kout=k2;const xe=d+Math.max(14,120/sc);
   out+=L(Mx(xs),My(ys),Mx(0),My(y0),C.amber,1.8)+L(Mx(0),My(y0),Mx(d),My(ye),C.amber,1.8)+L(Mx(d),My(ye),Mx(xe),My(ye+k2*xe-k2*d),C.amber,2)}
  const ang=.52*M;
  out+=R(40,300,520,58,'#fff',C.grid,8);
  out+=TBF(300,323,`M = ${s.fo} ÷ ${fe} = ${fmt(Math.round(M*10)/10)}×   ·   tube ≈ ${d} cm`,15,C.ink);
  out+=TF(300,346,`The Moon (0.52° across) looks ${ang.toFixed(1)}° across${kep?', upside down':', upright'}. Angles drawn exaggerated.`,13,C.muted);
  return {svg:out,phase:`${kep?'Kepler':'Galileo'} design: ${fmt(Math.round(M*10)/10)}× magnification from a ${s.fo} cm objective and a ${fe} cm eyepiece. More magnification needs a longer objective or a shorter eyepiece, which is why early telescopes grew very long.`};
 }});

/* ---------- Lesson: colour and the spectrum ---------- */
SCENE({id:'colour-spectrum',name:'Newton’s prism',tag:'The experimentum crucis',
 definition:'A prism spreads white light into a spectrum because each colour bends by a slightly different amount (dispersion). A single colour sent through a second prism bends again but does not split: the colours are in the light, not made by the glass.',
 example:'Newton let one colour through a hole in a board and into a second prism. Red was bent least and violet most, but each stayed one colour. He called this his crucial experiment.',
 research:'Isaac Newton (1672). A letter containing his new theory about light and colours, Philosophical Transactions 6: the experimentum crucis.',
 desc:'White light enters a prism and fans into seven colours on a board. One colour passes through a hole to a second prism, which bends it further, but it stays a single colour.',
 dur:12,hint:'Press a colour on the board to send it through the hole. Switch the second prism on and off. Each colour bends by its own amount, and none splits again.',
 init:()=>({sel:0,second:true}),
 watch(p){return {sel:Math.min(6,Math.floor(p*7)),second:true}},
 ui:[{choose:P5_SEVEN.map((c,i)=>[i,c[0]]),label:'Colour through the hole',get:s=>s.sel,act:'sel'},{choose:[['true','Second prism in'],['false','Second prism out']],label:'Second prism',get:s=>String(s.second),act:'second'}],
 on:{sel(s,v){s.sel=Number(v)},second(s,v){s.second=v==='true'}},
 draw(s,f,X){
  let out=heading('One colour through a second prism stays one colour');
  out+=R(0,60,600,300,'#1d2730','none',0);
  out+=P('M150 160L230 160L190 90Z',C.line,2,'#9fc2d6').replace('fill="#9fc2d6"','fill="#9fc2d6" fill-opacity=".45"');
  out+=L(20,128,172,128,'#fff',5)+TF(30,118,'sunlight',13,'#cfd8dc','start');
  const by=k=>150+k*20,bx=330;
  P5_SEVEN.forEach(([n,nm],k)=>{const c=P5_wl(nm);out+=P(`M200 130L${bx} ${by(k)-4}L${bx} ${by(k)+4}Z`,'none',0,c,'opacity=".75"');
   out+=hit(X,'sel',k,`Send ${n} light through the hole`,R(bx,by(k)-9,12,18,c,k===s.sel?'#fff':'none',2))});
  out+=R(bx+12,80,8,270,'#5b6870','none',2)+R(bx+12,by(s.sel)-4,8,8,'#1d2730','none',1);
  out+=TF(bx+16,72,'board with a hole',13,'#cfd8dc');
  const [nm]=[P5_SEVEN[s.sel][1]],col=P5_wl(nm),n=P5_nGlass(nm),dev=2*P5_deg(Math.asin(n*Math.sin(P5_rad(30))))-60,y0=by(s.sel);
  if(s.second){out+=P('M430 230L500 230L465 165Z',C.line,2,'#9fc2d6').replace('fill="#9fc2d6"','fill="#9fc2d6" fill-opacity=".45"');
   out+=L(bx+20,y0,455,205,col,4);const extra=(dev-38)*24+30;out+=L(470,205,575,205+extra,col,4)+Ci(578,205+extra,6,col);
   out+=TF(520,120,`bent by ${dev.toFixed(1)}°`,14,'#fff')+TF(520,140,'(60° prism)',13,'#cfd8dc')}
  else out+=L(bx+20,y0,578,y0,col,4)+Ci(578,y0,6,col);
  out+=TF(470,330,`${P5_SEVEN[s.sel][0]}: about ${nm} nm, n = ${n.toFixed(3)}`,14,'#fff');
  return {svg:out,phase:`${P5_SEVEN[s.sel][0][0].toUpperCase()+P5_SEVEN[s.sel][0].slice(1)} light ${s.second?`is bent by ${dev.toFixed(1)}° in the second prism but stays ${P5_SEVEN[s.sel][0]}`:'travels on unchanged'}. Violet bends most and red least. Newton concluded that white light is a mixture, and that a prism separates colours rather than creating them.`};
 }});

SCENE({id:'colour-spectrum-mixing',name:'Mixing colours',tag:'Adding light, subtracting paint',
 definition:'Coloured lights add: red, green and blue light together look white. Paints and filters subtract: each absorbs part of the spectrum, so cyan, magenta and yellow together look nearly black.',
 example:'A phone screen makes yellow from red and green light with no yellow at all. A printer makes red from magenta and yellow ink, each removing some of the white light falling on the paper.',
 research:'Thomas Young (1802), three kinds of colour receptor, Philosophical Transactions; James Clerk Maxwell (1861), the first three-colour photograph, shown at the Royal Institution.',
 desc:'Three overlapping circles: either coloured lights on black, which add towards white, or coloured filters on white, which subtract towards black. A swatch shows the mixture in the middle.',
 dur:12,hint:'Switch between light and paint, and slide each primary. Light adds wavelengths; paint takes them away.',
 init:()=>({mode:'add',a:100,b:80,c:0}),
 watch(p){if(p<.5){const q=p/.5;return {mode:'add',a:100,b:Math.round(100*smooth(q)),c:Math.round(100*smooth(Math.max(0,q*2-1)))}}const q=(p-.5)/.5;return {mode:'sub',a:100,b:Math.round(100*smooth(q)),c:Math.round(100*smooth(Math.max(0,q*2-1)))}},
 ui:[{choose:[['add','Light (adds)'],['sub','Paint (subtracts)']],label:'Mixing',get:s=>s.mode,act:'mode'},{range:'a',label:'Red / cyan',min:0,max:100,get:s=>s.a,act:'a',show:v=>v+'%'},{range:'b',label:'Green / magenta',min:0,max:100,get:s=>s.b,act:'b',show:v=>v+'%'},{range:'c',label:'Blue / yellow',min:0,max:100,get:s=>s.c,act:'c',show:v=>v+'%'}],
 on:{mode(s,v){s.mode=v},a(s,v){s.a=v},b(s,v){s.b=v},c(s,v){s.c=v}},
 draw(s){
  const add=s.mode==='add',k=v=>Math.round(v*2.55),mix=add?[k(s.a),k(s.b),k(s.c)]:[255-k(s.a),255-k(s.b),255-k(s.c)];
  let out=heading(add?'Light adds: red + green + blue = white':'Paint subtracts: cyan + magenta + yellow ≈ black');
  out+=R(30,56,330,300,add?'#000':'#fff',C.grid,10);
  const cs=add?[[k(s.a),0,0],[0,k(s.b),0],[0,0,k(s.c)]]:[[255-k(s.a),255,255],[255,255-k(s.b),255],[255,255,255-k(s.c)]];
  const pos=[[160,175],[230,175],[195,240]];
  out+=`<g style="isolation:isolate">`+pos.map((p,i)=>Ci(p[0],p[1],72,P5_hex(cs[i]),'none',`style="mix-blend-mode:${add?'screen':'multiply'}"`)).join('')+`</g>`;
  const lbl=add?['red','green','blue']:['cyan','magenta','yellow'];
  out+=TF(110,110,lbl[0],14,add?'#fff':C.ink)+TF(282,110,lbl[1],14,add?'#fff':C.ink)+TF(195,338,lbl[2],14,add?'#fff':C.ink);
  out+=R(390,90,180,120,P5_hex(mix),C.grid,12)+TBF(480,234,P5_hex(mix).toUpperCase(),16,C.ink)+TF(480,254,'colour in the middle',13,C.muted);
  out+=T(480,290,add?'Each light adds its own band':'Each filter removes a band',13,C.muted)+T(480,310,add?'of the spectrum to what you see.':'from white light on the paper.',13,C.muted);
  return {svg:out,phase:add?'Your eye has three kinds of colour receptor, so three lights can imitate almost any colour. Red and green light with no yellow wavelength at all still look yellow.':'Cyan absorbs red, magenta absorbs green and yellow absorbs blue. What survives all the filters is what you see, so mixing more paint leaves less light.'};
 }});

SCENE({id:'colour-spectrum-rainbow',name:'Rainbows',tag:'Light in a raindrop',
 definition:'Sunlight enters a raindrop, reflects once inside and comes back out. Rays bunch up near one angle of deviation, about 42° from the point opposite the Sun for red and about 40.5° for violet, so each colour forms its own circle.',
 example:'Stand with the Sun behind you: the rainbow is a circle about 42° around the shadow of your head. Red is on the outside because red light comes back at the larger angle.',
 research:'Theodoric of Freiberg (c. 1304), experiments with water-filled glass spheres; René Descartes (1637), Les Météores: ray tracing through a drop; Newton explained the colours.',
 desc:'A large raindrop with a ray entering, reflecting once off the back and leaving. A chart beside it plots the returning angle against where the ray enters; the curve peaks at the rainbow angle.',
 dur:12,hint:'Move the entry point of the ray. Many entry points send light back near the peak angle, which is why the rainbow is bright there.',
 init:()=>({b:.86,col:'red'}),
 watch(p){return {b:Math.round(lerp(.1,.98,smooth(p))*100)/100,col:p<.6?'red':'violet'}},
 ui:[{range:'b',label:'Entry height',min:0,max:.99,step:.01,get:s=>s.b,act:'b',show:v=>Number(v).toFixed(2)},{choose:[['red','Red'],['violet','Violet']],label:'Colour',get:s=>s.col,act:'col'}],
 on:{b(s,v){s.b=v},col(s,v){s.col=v}},
 draw(s){
  const nm=s.col==='red'?700:410,n=P5_nWater(nm),col=P5_wl(nm),Cx=165,Cy=205,Rr=110;
  const theta=b=>{const i=Math.asin(b),r=Math.asin(b/n);return P5_deg(4*r-2*i)};
  const trace=b=>{let p=[Cx-Math.sqrt(Rr*Rr-(b*Rr)**2),Cy-b*Rr],d=[1,0];const n1=[(p[0]-Cx)/Rr,(p[1]-Cy)/Rr];d=P5_refract(d,n1,1/n);
   let t=-2*((p[0]-Cx)*d[0]+(p[1]-Cy)*d[1]);const p2=[p[0]+t*d[0],p[1]+t*d[1]];d=P5_reflect(d,[(p2[0]-Cx)/Rr,(p2[1]-Cy)/Rr]);
   t=-2*((p2[0]-Cx)*d[0]+(p2[1]-Cy)*d[1]);const p3=[p2[0]+t*d[0],p2[1]+t*d[1]],e=P5_refract(d,[-(p3[0]-Cx)/Rr,-(p3[1]-Cy)/Rr],n)||d;return [p,p2,p3,e]};
  let out=heading('Rays bunch up at the rainbow angle');
  out+=Ci(Cx,Cy,Rr,'#e6f1f8',C.blue);
  for(let b=.1;b<.99;b+=.08){const [,,p3,e]=trace(b);out+=L(p3[0],p3[1],p3[0]+e[0]*80,p3[1]+e[1]*80,col,1.2,'opacity=".35"')}
  const [p,p2,p3,e]=trace(s.b);
  out+=arrow(20,p[1],p[0],p[1],'#c79100',3,9)+L(p[0],p[1],p2[0],p2[1],col,2.6)+L(p2[0],p2[1],p3[0],p3[1],col,2.6)+arrow(p3[0],p3[1],p3[0]+e[0]*110,p3[1]+e[1]*110,col,3,9);
  out+=TF(30,p[1]-8,'sunlight',13,C.muted,'start');
  // Chart of the return angle against entry height, for red and violet.
  const gx=330,gy=320,gw=250,gh=230;out+=L(gx,gy,gx+gw,gy,C.line,1.5)+L(gx,gy,gx,gy-gh,C.line,1.5)+TF(gx+gw/2,gy+32,'entry height (0 = centre, 1 = edge)',13,C.muted);
  for(const v of [0,20,40])out+=TF(gx-6,gy-v/45*gh+4,v+'°',13,C.muted,'end');
  for(const [cn,cnm] of [['red',700],['violet',410]]){const nn=P5_nWater(cnm),c2=P5_wl(cnm);let d='',best=0;for(let i=0;i<=100;i++){const b=i/100*.999,th=P5_deg(4*Math.asin(b/nn)-2*Math.asin(b));best=Math.max(best,th);d+=(i?'L':'M')+fmt(gx+b*gw)+' '+fmt(gy-th/45*gh)}
   out+=P(d,c2,2.4)+TF(gx+gw-4,gy-best/45*gh-8,`${cn} ${best.toFixed(1)}°`,13,c2,'end')}
  const th=theta(s.b);out+=Ci(gx+s.b*gw,gy-th/45*gh,6,'none',C.ink)+TF(gx+8,gy-gh-6,'angle back from the anti-solar point',13,C.muted,'start');
  return {svg:out,phase:`This ray comes back ${th.toFixed(1)}° from the direction opposite the Sun. Near the peak, many neighbouring rays return at almost the same angle, so light piles up there and you see a bright ${s.col} circle. Idealised spherical drop, one internal reflection.`};
 }});

/* ---------- Lesson: Young's double slit ---------- */
function P5_fringe(y,lam,d,Lm){const a=d/4,ph=Math.PI*d*1e-3*y*1e-3/(lam*1e-9*Lm),be=Math.PI*a*1e-3*y*1e-3/(lam*1e-9*Lm),sinc=Math.abs(be)<1e-9?1:Math.sin(be)/be;return Math.cos(ph)**2*sinc*sinc}
SCENE({id:'double-slit',name:'Young’s double slit',tag:'Light interferes with itself',
 definition:'Light passing through two narrow slits spreads out from each, and the two waves add up or cancel. The result is bright and dark fringes spaced Δy = λL ÷ d, where λ is the wavelength, L the distance to the screen and d the slit separation.',
 example:'With 550 nm green light, slits 0.30 mm apart and a screen 1 m away, the bright fringes are 1.8 mm apart. Halve the slit separation and they spread to 3.7 mm.',
 research:'Thomas Young (1804). Experimental demonstration of the general law of the interference of light, Philosophical Transactions 94 (lectures of 1802–1803).',
 desc:'Waves spread from two slits in a barrier and overlap; on the screen at the right, bright and dark fringes appear, with a brightness curve beside them.',
 dur:12,hint:'Change the wavelength, the slit separation and the screen distance, and watch the fringe spacing λL/d.',
 init:()=>({lam:550,d:.3,L:1}),
 watch(p){if(p<.5)return {lam:Math.round(lerp(420,680,smooth(p/.5))),d:.3,L:1};return {lam:633,d:Math.round(lerp(.6,.15,smooth((p-.5)/.5))*100)/100,L:1}},
 ui:[{range:'lam',label:'Wavelength',min:400,max:700,step:5,get:s=>s.lam,act:'lam',show:v=>v+' nm'},{range:'d',label:'Slit separation',min:.1,max:1,step:.05,get:s=>s.d,act:'d',show:v=>Number(v).toFixed(2)+' mm'},{range:'L',label:'Screen distance',min:.5,max:3,step:.1,get:s=>s.L,act:'L',show:v=>Number(v).toFixed(1)+' m'}],
 on:{lam(s,v){s.lam=v},d(s,v){s.d=v},L(s,v){s.L=v}},
 draw(s,f,X){
  const col=P5_wl(s.lam),lp=8+(s.lam-400)/300*10,dp=14+s.d*70,sx=150,cy=190,ph=X.try?0:(X.p*40)%1,dy=s.lam*1e-9*s.L/(s.d*1e-3)*1e3;
  let out=heading('Two slits make many bright fringes');
  out+=R(0,52,600,312,'#141c22','none',0)+'<clipPath id="p5-slit"><rect x="0" y="52" width="600" height="312"/></clipPath><g clip-path="url(#p5-slit)">';
  for(let x=sx-((ph*lp)%lp);x>20;x-=lp)out+=L(x,60,x,355,col,1.5,'opacity=".55"');
  for(const yy of [cy-dp/2,cy+dp/2])for(let k=0;k<44;k++){const r=(k+ph)*lp;if(r>330)break;out+=`<circle cx="${sx}" cy="${fmt(yy)}" r="${fmt(r)}" fill="none" stroke="${col}" stroke-width="1.3" opacity=".42"/>`}
  out+=R(0,52,sx,312,'#141c22','none',0);for(let x=sx-((ph*lp)%lp);x>20;x-=lp)out+=L(x,60,x,355,col,1.5,'opacity=".55"');
  out+=R(470,52,130,312,'#141c22','none',0)+'</g>';
  out+=R(sx-6,52,12,cy-dp/2-3-52,'#7d8c94','none',0)+R(sx-6,cy-dp/2+3,12,dp-6,'#7d8c94','none',0)+R(sx-6,cy+dp/2+3,12,364-(cy+dp/2+3),'#7d8c94','none',0);
  let curve='';for(let py=60;py<=350;py+=2){const ymm=(py-cy)/14,I=P5_fringe(ymm,s.lam,s.d,s.L);out+=R(470,py-1,18,2.6,col,'none',0,`opacity="${I.toFixed(3)}"`);curve+=(py===60?'M':'L')+fmt(500+I*80)+' '+py}
  out+=P(curve,'#fff',1.5)+TF(535,72,'brightness',13,'#cfd8dc');
  out+=L(462,cy,462,cy+dy*14,'#fff',1.5)+TF(456,cy+dy*7+4,'Δy',13,'#fff','end');
  out+=R(160,322,300,36,'#000a','none',8)+TF(310,345,`Δy = λL/d = ${s.lam} nm × ${s.L} m ÷ ${s.d} mm = ${dy.toFixed(2)} mm`,13,'#fff');
  return {svg:out,phase:`Where crests from the two slits meet crests, the light adds into a bright fringe; where a crest meets a trough, it cancels. Here the fringes are ${dy.toFixed(2)} mm apart. Waves drawn far larger than real light waves, which are under a thousandth of a millimetre long.`};
 }});

const P5_LASERS={red:650,green:532,yellow:589};
SCENE({id:'double-slit-measure',name:'Measuring a wavelength',tag:'Rerun Young’s measurement',
 definition:'Measure the fringe spacing Δy, and the wavelength follows from λ = d·Δy ÷ L. Young used this kind of reasoning to estimate the wavelengths of colours, finding them a few ten-thousandths of a millimetre.',
 example:'Slits 0.25 mm apart, a screen 1.50 m away, and fringes 3.9 mm apart give λ = 0.25 × 3.9 ÷ 1500 mm = 650 nm: red light.',
 research:'Thomas Young (1802, 1804), Bakerian Lectures, Philosophical Transactions: wavelengths of colours from interference. (His first demonstration split a sunbeam with a thin card rather than using two slits.)',
 desc:'A photograph of interference fringes over a millimetre ruler. Pressing two bright fringes measures their spacing and calculates the wavelength, which is compared with the true value.',
 dur:12,hint:'Choose a laser, then press two bright fringes far apart (more fringes between them gives a better average). Try the mystery laser last.',
 init:()=>({laser:'red',mystery:633,pick:[],result:null}),
 watch(p){return {laser:'red',mystery:633,pick:p<.35?[]:p<.6?[-4]:[-4,4],result:p<.6?null:{n:8,dy:650e-9*1.5/.25e-3*1e3,lam:650}}},
 ui:[{choose:[['red','Red'],['green','Green'],['yellow','Sodium yellow'],['mystery','Mystery']],label:'Laser',get:s=>s.laser,act:'laser'},{b:'New mystery laser',act:'newm'}],
 on:{laser(s,v){s.laser=v;s.pick=[];s.result=null},newm(s){s.mystery=[445,473,594,633,671][nextSeed()%5];s.laser='mystery';s.pick=[];s.result=null},
  pick(s,k){k=Number(k);if(s.pick.length>=2)s.pick=[];s.pick.push(k);if(s.pick.length===2&&s.pick[0]!==s.pick[1]){const lam=s.laser==='mystery'?s.mystery:P5_LASERS[s.laser],dy=lam*1e-9*1.5/.25e-3*1e3,n=Math.abs(s.pick[1]-s.pick[0]);s.result={n,dy,lam:Math.round(.25*dy/1500*1e6)}}else s.result=null}},
 draw(s,f,X){
  const st=s;
  const lam=st.laser==='mystery'?st.mystery:P5_LASERS[st.laser],col=P5_wl(lam),dy=lam*1e-9*1.5/.25e-3*1e3,x0=40,pxmm=520/60,cx=x0+30*pxmm;
  let out=heading('Press two bright fringes to measure the spacing');
  out+=R(x0,96,520,74,'#0e1418','none',4);
  for(let i=0;i<130;i++){const xmm=i*60/130+60/260,I=Math.cos(Math.PI*(xmm-30)/dy)**2;out+=R(x0+xmm*pxmm-2.1,98,4.3,70,col,'none',0,`opacity="${(I*.95).toFixed(3)}"`)}
  for(let k=-8;k<=8;k++){const x=cx+k*dy*pxmm;if(x<x0+6||x>x0+514)continue;const on=st.pick.includes(k);out+=hit(X,'pick',k,`Bright fringe ${k}`,Ci(x,84,on?9:7,on?C.coral:'#fff',C.coral))}
  out+=L(x0,182,x0+520,182,C.ink,1.5);for(let mm=0;mm<=60;mm++){const x=x0+mm*pxmm;out+=L(x,182,x,mm%10?189:197,C.ink,1);if(mm%10===0)out+=TF(x,212,mm,13,C.ink)}
  out+=TF(300,232,'millimetres on the screen   ·   slits 0.25 mm apart   ·   screen 1.50 m away',13,C.muted);
  if(st.result){const r=st.result;out+=R(70,250,460,104,C.greenp,C.green,10);
   out+=TBF(300,276,`${r.n} fringe spacings span ${(r.n*r.dy).toFixed(1)} mm  →  Δy = ${r.dy.toFixed(2)} mm`,15,C.ink);
   out+=TBF(300,302,`λ = d·Δy ÷ L = 0.25 mm × ${r.dy.toFixed(2)} mm ÷ 1500 mm = ${r.lam} nm`,15,C.green);
   out+=TF(300,328,st.laser==='mystery'?`The mystery laser was ${lam} nm: ${Math.abs(r.lam-lam)<=2?'you found it':'close'}.`:`True wavelength ${lam} nm.`,14,C.ink)}
  else out+=T(300,300,st.pick.length?'Now press a second bright fringe.':'Press a bright fringe (white dot above it).',15,C.muted);
  return {svg:out,phase:st.result?`Measuring across ${st.result.n} spacings averages out small errors in finding each fringe’s centre. The wavelength of visible light comes out at a few hundred nanometres: thousands of waves fit in a millimetre.`:'The fringes are the photograph; the dots above them are your measuring points. Choose two that are far apart for a more precise answer.'};
 }});

SCENE({id:'double-slit-debate',name:'Particles or waves?',tag:'Newton against Huygens',
 definition:'Newton described light as a stream of particles (corpuscles); Huygens described it as a wave. The two models predict different things for two slits and for light entering water, so experiment can decide.',
 example:'Particles through two slits should make two bright bands. Young saw many fringes, as waves predict. Later, light was found to travel more slowly in water (Foucault, 1850), as waves predict and particles do not.',
 research:'Christiaan Huygens (1690). Traité de la lumière; Isaac Newton (1704). Opticks; Young (1804); Foucault (1850). Quantum physics later revived particles as photons (see the quantum lesson).',
 desc:'Two slits and a screen. In particle mode, straight-line particles pile into two bands; in wave mode, wavelets from each slit build a pattern of many fringes. A panel compares the predictions with what was observed.',
 dur:12,hint:'Switch between the particle and wave models, and add more particles. Then reveal what the experiments found.',
 init:()=>({model:'particle',n:400,reveal:false}),
 watch(p){return {model:p<.5?'particle':'wave',n:Math.round(lerp(40,600,Math.min(1,(p%.5)*2.2))),reveal:p>.8}},
 ui:[{choose:[['particle','Particles (Newton)'],['wave','Waves (Huygens, Young)']],label:'Model',get:s=>s.model,act:'model'},{range:'n',label:'Particles',min:20,max:1200,step:20,get:s=>s.n,act:'n'},{b:'Reveal the experiments',act:'reveal'}],
 on:{model(s,v){s.model=v},n(s,v){s.n=v},reveal(s){s.reveal=!s.reveal}},
 draw(s){
  const cy=170,sx=170,scx=470,d=46;let out=heading(s.model==='particle'?'Particles predict two bright bands':'Waves predict many fringes');
  out+=R(20,52,560,240,'#141c22','none',8);
  out+=R(sx-5,56,10,cy-d/2-4-56,'#7d8c94','none',0)+R(sx-5,cy-d/2+4,10,d-8,'#7d8c94','none',0)+R(sx-5,cy+d/2+4,10,288-(cy+d/2+4),'#7d8c94','none',0);
  out+=Ci(60,cy,9,'#ffd24a')+R(scx,58,8,228,'#b9c4ca','none',1);
  if(s.model==='particle'){const r=rng(31);for(let i=0;i<Math.min(s.n,1200);i++){const slit=i%2?1:-1,sy=cy+slit*d/2+(r()-.5)*6,ty=cy+slit*d/2*((scx-60)/(sx-60))+((r()+r()+r())/3-.5)*22;
    if(i<40)out+=L(60,cy,sx,sy,'#ffd24a',.6,'opacity=".25"')+L(sx,sy,scx,ty,'#ffd24a',.6,'opacity=".25"');out+=Ci(scx-4-r()*14,ty,1.6,'#ffd24a')}}
  else{out+='<clipPath id="p5-debate"><rect x="20" y="52" width="560" height="240"/></clipPath><g clip-path="url(#p5-debate)">';for(const yy of [cy-d/2,cy+d/2])for(let k=1;k<20;k++)out+=P(`M${sx} ${fmt(yy-k*16)}A${k*16} ${k*16} 0 0 1 ${sx} ${fmt(yy+k*16)}`,'#8fd0ff',1,'none','opacity=".35"');
   out+=R(scx+8,52,120,240,'#141c22','none',0)+'</g>';let c='';for(let y=60;y<=284;y+=2){const I=Math.cos((y-cy)/9)**2*Math.exp(-((y-cy)/80)**2);out+=R(scx-14,y-1,14,2.4,'#8fd0ff','none',0,`opacity="${I.toFixed(3)}"`);c+=(y===60?'M':'L')+fmt(scx+12+I*60)+' '+y}out+=P(c,'#fff',1.4)}
  out+=R(20,300,560,62,s.reveal?C.greenp:'#f6f9fb',s.reveal?C.green:C.grid,8);
  out+=TF(30,322,'Particles (Newton): two bands · faster in water',13,C.ink,'start')+TF(30,342,'Waves (Huygens, Young): many fringes · slower in water',13,C.ink,'start');
  out+=TF(570,332,s.reveal?'Observed: fringes (Young, 1803) and slower in water (Foucault, 1850)':'',13,C.green,'end');
  return {svg:out,phase:s.model==='particle'?'If light were tiny particles moving in straight lines, two slits would simply cast two bright bands. Adding particles only makes the bands brighter.':'Waves from the two slits overlap and interfere, so the screen shows many bright and dark fringes. In the 20th century, light turned out to arrive in particles (photons) that still build up this wave pattern.'};
 }});

/* ---------- Lesson: diffraction and polarisation ---------- */
SCENE({id:'diffraction-polarisation',name:'Diffraction',tag:'Narrower slit, wider spread',
 definition:'A wave passing through a gap spreads out (diffracts). For a slit of width a, the central bright band reaches its first dark edge at an angle where sin θ = λ ÷ a: the narrower the slit, the wider the spread.',
 example:'Red laser light (633 nm) through a 0.1 mm slit spreads to a central band about 13 mm wide on a wall 1 m away, far wider than the slit’s straight-line shadow.',
 research:'Francesco Grimaldi (1665) named diffraction; Augustin Fresnel (1818) prize memoir on diffraction. Poisson objected that Fresnel’s theory predicted a bright spot behind a disc; Arago looked and found it.',
 desc:'A single slit lets light through to a screen. The real brightness pattern, a broad central band with weaker side bands, is drawn against the narrow straight-line shadow a particle picture would give.',
 dur:10,hint:'Narrow the slit and watch the pattern get wider, not narrower. Longer wavelengths spread more.',
 init:()=>({a:.1,lam:633}),
 watch(p){return {a:Math.round(lerp(.4,.04,smooth(p))*100)/100,lam:633}},
 ui:[{range:'a',label:'Slit width',min:.02,max:.5,step:.01,get:s=>s.a,act:'a',show:v=>Number(v).toFixed(2)+' mm'},{range:'lam',label:'Wavelength',min:400,max:700,step:5,get:s=>s.lam,act:'lam',show:v=>v+' nm'}],
 on:{a(s,v){s.a=v},lam(s,v){s.lam=v}},
 draw(s){
  const col=P5_wl(s.lam),cy=190,ppm=6,half=s.lam*1e-9*1/(s.a*1e-3)*1e3,gap=6+s.a*60;
  let out=heading('The narrower the slit, the wider the spread');
  out+=R(20,52,560,276,'#141c22','none',8);
  out+=R(120,56,10,cy-gap/2-56,'#7d8c94','none',0)+R(120,cy+gap/2,10,324-(cy+gap/2),'#7d8c94','none',0);
  out+=L(30,cy,120,cy,col,Math.max(2,gap*.8),'opacity=".7"');
  out+=P(`M130 ${cy-gap/2}L420 ${cy-half*ppm}L420 ${cy+half*ppm}L130 ${cy+gap/2}Z`,'none',0,col,'opacity=".18"');
  out+=R(420,56,8,268,'#b9c4ca','none',1);
  let c='';for(let py=58;py<=322;py+=2){const ymm=(py-cy)/ppm,be=Math.PI*s.a*1e-3*ymm*1e-3/(s.lam*1e-9),I=Math.abs(be)<1e-9?1:(Math.sin(be)/be)**2;out+=R(432,py-1,16,2.6,col,'none',0,`opacity="${Math.min(1,I*1.2).toFixed(3)}"`);c+=(py===58?'M':'L')+fmt(456+I*110)+' '+py}
  out+=P(c,'#fff',1.5);
  out+=L(458,cy-s.a/2*ppm,458,cy+s.a/2*ppm,C.amber,4)+TF(472,cy-s.a/2*ppm-6,'straight-line shadow',13,C.amber,'start');
  out+=R(40,338,520,32,'#fff',C.grid,8)+TF(300,359,`first dark band at y = λL/a = ${s.lam} nm × 1 m ÷ ${s.a} mm = ${half.toFixed(1)} mm from the centre`,13,C.ink);
  return {svg:out,phase:`The central band is ${(2*half).toFixed(1)} mm wide while the slit is only ${s.a} mm. Diffraction is why no lens or eye can resolve detail finer than about a wavelength, and why a narrow beam always spreads.`};
 }});

SCENE({id:'diffraction-polarisation-grating',name:'Diffraction gratings',tag:'Thousands of slits sort colours',
 definition:'A grating has many equally spaced lines. Bright beams appear only at angles where d sin θ = mλ (m = 0, 1, 2…), so each colour leaves at its own angle and the beams are very sharp.',
 example:'A CD’s track spacing is about 1.6 μm, roughly 625 lines per millimetre: first-order red light leaves at about 26° and violet at about 15°, which is why a CD shows rainbows.',
 research:'David Rittenhouse (1785), an early grating of hairs; Joseph von Fraunhofer (1821), wire and ruled gratings used to measure wavelengths of solar spectral lines.',
 desc:'White light hits a grating at the bottom. Straight through goes white light (order 0); on each side, spectra fan out at angles that depend on wavelength, with second and third orders further out.',
 dur:10,hint:'Change the line density. More lines per millimetre spread the spectrum wider, until higher orders bend past 90° and vanish.',
 init:()=>({lines:625}),
 watch(p){return {lines:Math.round(lerp(150,1200,smooth(p))/25)*25}},
 ui:[{range:'lines',label:'Lines per mm',min:100,max:1200,step:25,get:s=>s.lines,act:'lines'}],
 on:{lines(s,v){s.lines=v}},
 draw(s){
  const cx=300,cy=330,Rr=250,dmm=1/s.lines;
  let out=heading('Each colour leaves at its own angle');
  out+=R(20,52,560,300,'#141c22','none',8)+P(`M${cx-Rr} ${cy}A${Rr} ${Rr} 0 0 1 ${cx+Rr} ${cy}`,'#56646c',1.5);
  out+=R(cx-40,cy-3,80,6,'#b9c4ca','none',2)+L(cx,352,cx,cy,'#fff',4)+TF(cx+8,346,'white light',13,'#cfd8dc','start');
  out+=L(cx,cy,cx,cy-Rr,'#fff',2.5)+TF(cx,cy-Rr-8,'m = 0',13,'#fff');
  let shown=0;
  for(const m of [1,2,3])for(const sg of [-1,1])for(let nm=400;nm<=700;nm+=12){const sn=m*nm*1e-6/dmm;if(sn>=1)continue;shown=Math.max(shown,m);const th=Math.asin(sn),x=cx+sg*Rr*Math.sin(th),y=cy-Rr*Math.cos(th);out+=L(cx,cy,x,y,P5_wl(nm),m===1?1.8:1.2,`opacity="${m===1?.75:.5}"`)}
  for(const m of [1,2,3]){const sn=m*550e-6/dmm;if(sn<1){const th=Math.asin(sn);out+=TF(cx+(Rr+18)*Math.sin(th),cy-(Rr+18)*Math.cos(th)+4,'m = '+m,13,'#fff')}}
  const red=Math.asin(Math.min(1,700e-6/dmm)),vio=Math.asin(Math.min(1,400e-6/dmm));
  return {svg:out,phase:`${s.lines} lines per mm: line spacing ${(dmm*1000).toFixed(2)} μm. First-order violet leaves at ${P5_deg(vio).toFixed(0)}° and red at ${700e-6/dmm<1?P5_deg(red).toFixed(0)+'°':'beyond 90° (not at all)'}; ${shown<3?`only ${shown} order${shown>1?'s':''} fit${shown>1?'':'s'} on each side.`:'second and third orders overlap.'} Gratings, not prisms, measure wavelengths in modern spectrometers.`};
 }});

SCENE({id:'diffraction-polarisation-polarisers',name:'Polarisation',tag:'Malus’s law and the third filter',
 definition:'Light is a transverse wave whose electric field can vibrate in one direction (polarised). A polarising filter passes only the part along its axis: I = I₀ cos² θ (Malus’s law), where θ is the angle between the light’s direction of vibration and the filter.',
 example:'Two filters crossed at 90° let no light through. Slip a third filter between them at 45° and light reappears: an eighth of the original. Each filter does not just block; it re-aligns what it lets through.',
 research:'Étienne-Louis Malus (1809), polarisation by reflection and the cos² law; Fresnel and Arago (1819) showed light must be a transverse wave.',
 desc:'Unpolarised light passes through a first vertical filter, an optional middle filter and a final filter at an adjustable angle. Beam brightness and the intensity after each filter are shown, with a cos² curve.',
 dur:12,hint:'Turn the last filter. Then cross it at 90° and switch on the middle filter: light comes back.',
 init:()=>({th:90,middle:false,mid:45}),
 watch(p){if(p<.55)return {th:Math.round(lerp(0,90,smooth(p/.55))),middle:false,mid:45};return {th:90,middle:p>.7,mid:45}},
 ui:[{range:'th',label:'Last filter',min:0,max:90,get:s=>s.th,act:'th',show:v=>v+'°'},{choose:[['false','No middle filter'],['true','Middle filter in']],label:'Middle filter',get:s=>String(s.middle),act:'middle'},{range:'mid',label:'Middle filter',min:0,max:90,get:s=>s.mid,act:'mid',show:v=>v+'°'}],
 on:{th(s,v){s.th=v},middle(s,v){s.middle=v==='true'},mid(s,v){s.mid=v}},
 draw(s){
  const c2=a=>Math.cos(P5_rad(a))**2,I1=.5,I2=s.middle?I1*c2(s.mid):I1,I3=s.middle?I2*c2(s.th-s.mid):I1*c2(s.th);
  let out=heading('Each filter passes only the part along its axis');
  const filt=(x,ang,label,val)=>{const r=P5_rad(ang),dx=Math.sin(r),dy=-Math.cos(r),px=Math.cos(r),py=Math.sin(r);let o=`<ellipse cx="${x}" cy="170" rx="34" ry="62" fill="#eef4f7" stroke="${C.blue}" stroke-width="2"/>`;
   for(let k=-2;k<=2;k++){const cx0=k*11*px,cy0=k*11*py,len=Math.sqrt(Math.max(0,2800-(k*11)**2*2.2));o+=L(x+(cx0-dx*len)*.55,170+cy0-dy*len,x+(cx0+dx*len)*.55,170+cy0+dy*len,C.blue,k?1.2:2.6)}
   return o+TF(x,250,label,13,C.blue)+TBF(x,270,(val*100).toFixed(1)+'%',14,C.ink)};
  const beam=(x1,x2,I)=>R(x1,162,x2-x1,16,'#ffd24a','none',3,`opacity="${(.15+.85*Math.min(1,I*2)).toFixed(3)}"`);
  out+=beam(30,140,1)+TF(70,150,'unpolarised',13,C.muted);
  out+=beam(140,s.middle?290:440,I1)+filt(140,0,'0° (vertical)',I1);
  if(s.middle)out+=beam(290,440,I2)+filt(290,s.mid,s.mid+'°',I2);
  out+=beam(440,560,I3)+filt(440,s.th,s.th+'°',I3);
  const gx=70,gy=350,gw=200,gh=56;let d='';for(let a=0;a<=90;a+=3)d+=(a?'L':'M')+fmt(gx+a/90*gw)+' '+fmt(gy-c2(a)*gh);out+=P(d,C.blue,2)+L(gx,gy,gx+gw,gy,C.line,1)+Ci(gx+s.th/90*gw,gy-c2(s.th)*gh,5,s.middle?'none':C.coral,C.coral)+TF(gx+gw/2,gy+16,'cos² θ: two filters only',13,C.muted);
  out+=TF(450,320,s.middle?`½ × cos²${s.mid}° × cos²${s.th-s.mid}° = ${(I3*100).toFixed(1)}%`:`½ × cos²${s.th}° = ${(I3*100).toFixed(1)}%`,14,C.ink);
  return {svg:out,phase:s.middle&&s.th===90?`With the 45° filter between crossed filters, ${(I3*100).toFixed(1)}% gets through, though the two outer filters alone pass nothing. The middle filter turns the vibration direction part-way, so the last filter has something to pass.`:`The first filter halves unpolarised light and leaves it vibrating vertically. The last filter at ${s.th}° passes cos²${s.th}° of that. Ideal filters assumed.`};
 },
 three(s,f,X,project){
  const P=project([[0,-1.4,-1.4],[10,1.4,1.4]]),c=a=>Math.cos(P5_rad(a)),angs=[0].concat(s.middle?[s.mid]:[],[s.th]),xs=s.middle?[2.5,5,7.5]:[3,7];
  let out='';const filt3=(x,a)=>{const sq=[[x,-1.3,-1.3],[x,1.3,-1.3],[x,1.3,1.3],[x,-1.3,1.3]];let o=poly3(sq,P,'#dcecf5',C.blue,'fill-opacity=".55"');const r=P5_rad(a);o+=line3([x,-1.2*Math.sin(r),-1.2*Math.cos(r)],[x,1.2*Math.sin(r),1.2*Math.cos(r)],P,C.blue,3);return o};
  const segs=[[0,xs[0],null,1]];let amp=1;xs.forEach((x,i)=>{const a=angs[i],prev=i?angs[i-1]:null;amp=i===0?Math.SQRT1_2:amp*Math.abs(c(a-prev));segs.push([x,xs[i+1]||10,a,amp])});
  out+=line3([0,0,0],[10,0,0],P,C.line,1);
  for(const [x1,x2,a,A] of segs){if(a===null){for(const pa of [0,60,120]){let pts=[];for(let x=x1;x<=x2+1e-6;x+=.08){const v=.9*Math.sin(x*6);pts.push([x,v*Math.sin(P5_rad(pa)),v*Math.cos(P5_rad(pa))])}out+=pts.slice(1).map((q,i)=>line3(pts[i],q,P,'#c79100',1.2,'opacity=".5"')).join('')}continue}
   let pts=[];for(let x=x1;x<=x2+1e-6;x+=.06){const v=1.2*A*Math.sin(x*6);pts.push([x,v*Math.sin(P5_rad(a)),v*Math.cos(P5_rad(a))])}out+=pts.slice(1).map((q,i)=>line3(pts[i],q,P,C.coral,2.2)).join('')}
  out+=xs.map((x,i)=>filt3(x,angs[i])).join('');
  return {svg:out,title:'The electric field through the filters',caption:'Before the first filter the field vibrates in every direction (gold). After each filter it vibrates only along that filter’s axis (coral), with a smaller amplitude.'};
 }});

/* ---------- Lesson: the speed of light ---------- */
const P5_AU_S=499.0; // light-seconds per astronomical unit
SCENE({id:'speed-of-light',name:'Rømer and Io',tag:'Light takes time',
 definition:'Light travels at a finite speed. Ole Rømer noticed in 1676 that eclipses of Jupiter’s moon Io came later when Earth was farther from Jupiter: the extra delay is the time light needs to cross the extra distance.',
 example:'Across the diameter of Earth’s orbit (about 300 million km) the delay is about 16.6 minutes, giving c ≈ 300,000 km/s. Rømer’s data suggested about 22 minutes, and Huygens turned that into roughly 220,000 km/s: the right size, a little low.',
 research:'Ole Rømer (1676). Démonstration touchant le mouvement de la lumière, Journal des Sçavans; Christiaan Huygens (1690) computed a speed from it.',
 desc:'Earth circles the Sun inside Jupiter’s orbit. A light path runs from Jupiter to Earth; a chart plots how late each eclipse of Io is seen against the Earth–Jupiter distance, and fits a line whose slope gives the speed of light.',
 dur:12,hint:'Move Earth around its orbit and time an eclipse at several positions. The slope of your line is 1 ÷ c. (Near conjunction Jupiter is hidden behind the Sun.)',
 init:()=>({month:3,rec:[]}),
 watch(p){const month=lerp(0,5.5,smooth(Math.min(1,p*1.1)));const r=rng(41);return {month,rec:[.5,1.5,2.5,3.5,4.5,5].filter(m=>m<=month).map(m=>{const d=P5_dist(m);return [d,(d-4.2)*P5_AU_S+(r()-.5)*70]})}},
 ui:[{range:'month',label:'Months after opposition',min:0,max:12,step:.5,get:s=>s.month,act:'month'},{b:'Time an eclipse of Io',act:'rec'},{b:'Clear',act:'clear'}],
 on:{month(s,v){s.month=v},rec(s){if(Math.abs(s.month-6)<1)return 'keep';const d=P5_dist(s.month),r=rng(nextSeed());s.rec=s.rec.concat([[d,(d-4.2)*P5_AU_S+(r()-.5)*70]]).slice(-12)},clear(s){s.rec=[]}},
 draw(s){
  const sun=[150,200],sc=36,a=s.month/12*2*Math.PI,E=[sun[0]+sc*Math.cos(a),sun[1]-sc*Math.sin(a)],J=[sun[0]+200,sun[1]],d=P5_dist(s.month),hidden=Math.abs(s.month-6)<1;
  let out=heading('Eclipses of Io run late when Earth is far away');
  out+=Ci(sun[0],sun[1],sc,'none',C.line,'stroke-dasharray="4 4"')+Ci(sun[0],sun[1],14,'#ffd24a','#c79100');
  out+=L(E[0],E[1],J[0],J[1],hidden?C.line:C.amber,2,hidden?'stroke-dasharray="4 4"':'')+Ci(E[0],E[1],7,C.blue)+Ci(J[0],J[1],12,'#d9a46b')+Ci(J[0]+20,J[1]-6,3.5,'#888')+TF(J[0],J[1]+28,'Jupiter + Io',13,C.ink)+TF(E[0],E[1]+(E[1]>sun[1]?20:-12),'Earth',13,C.blue);
  out+=TF(150,318,`Earth–Jupiter: ${d.toFixed(2)} AU`,14,C.ink)+TF(150,338,hidden?'Jupiter is behind the Sun':`expected delay ${((d-4.2)*P5_AU_S/60).toFixed(1)} min`,13,hidden?C.coral:C.muted)+TF(150,356,'not to scale · Jupiter held still',13,C.muted);
  const gx=380,gy=300,gw=200,gh=220;out+=L(gx,gy,gx+gw,gy,C.line,1.5)+L(gx,gy,gx,gy-gh,C.line,1.5)+TF(gx+gw/2,gy+30,'Earth–Jupiter distance (AU)',13,C.muted)+TF(gx-4,gy-gh-8,'delay (minutes)',13,C.muted,'start');
  const X=v=>gx+(v-4)/2.4*gw,Y=m=>gy-m/18*gh;for(const v of [4,5,6])out+=TF(X(v),gy+15,v,13,C.muted);for(const m of [0,9,18])out+=TF(gx-6,Y(m)+4,m,13,C.muted,'end');
  for(const [dd,t] of s.rec)out+=Ci(X(dd),Y(t/60),4.5,C.coral);
  let fit='';if(s.rec.length>=2){const n=s.rec.length,mx=sum(s.rec.map(r=>r[0]))/n,my=sum(s.rec.map(r=>r[1]))/n,sxx=sum(s.rec.map(r=>(r[0]-mx)**2)),sxy=sum(s.rec.map(r=>(r[0]-mx)*(r[1]-my)));if(sxx>1e-6){const sl=sxy/sxx,c=1.496e8/sl;
   out+=L(X(4.2),Y((my+sl*(4.2-mx))/60),X(6.2),Y((my+sl*(6.2-mx))/60),C.blue,2);fit=`${n} timings → light takes ${(sl/60).toFixed(1)} min per AU → c ≈ ${Math.round(c/1000)*1000} km/s (true 299,792 km/s)`}}
  if(fit)out+=TF(300,372,fit,13,C.green);
  return {svg:out,phase:fit?`The slope of your line is the time light needs per astronomical unit. Timings carry about a minute of error, as Rømer’s did, so the answer wanders a little around the true value.`:'Io orbits Jupiter every 42.5 hours like a clock. Yet the eclipses seemed to slip later for months and catch up again; Rømer realised the light was taking longer to reach a more distant Earth.'};
 }});
function P5_dist(month){const a=month/12*2*Math.PI,ex=Math.cos(a),ey=Math.sin(a);return Math.hypot(5.2-ex,ey)}

SCENE({id:'speed-of-light-fizeau',name:'Fizeau’s toothed wheel',tag:'Timing light on Earth',
 definition:'Fizeau sent light through a gap in a spinning toothed wheel to a mirror 8.6 km away and back. At just the right speed, the returning light met a tooth instead of a gap and was blocked. That speed gives the travel time, so c = 4NLf for N teeth, distance L and f turns per second.',
 example:'With 720 teeth and 8,633 m, the light first disappears at about 12 turns per second: c = 4 × 720 × 8633 × 12.1 ≈ 300,000 km/s. Fizeau, judging the dimming by eye, reported about 313,000 km/s in 1849.',
 research:'Hippolyte Fizeau (1849). Sur une expérience relative à la vitesse de propagation de la lumière, Comptes rendus 29.',
 desc:'A toothed wheel spins in front of a lamp; the beam crosses to a distant mirror and returns through the wheel to an eye. A chart shows the returning brightness falling to darkness and rising again as the wheel speeds up.',
 dur:12,hint:'Speed the wheel up until the returning light is darkest, then press Record. The calculation turns your speed into c.',
 init:()=>({f:6,rec:null}),
 watch(p){const f=lerp(0,14,smooth(p));return {f,rec:p>.9?{f:12.05}:null}},
 ui:[{range:'f',label:'Wheel speed',min:0,max:30,step:.05,get:s=>s.f,act:'f',show:v=>Number(v).toFixed(2)+' turns/s'},{b:'Record darkest speed',act:'rec'}],
 on:{f(s,v){s.f=v;s.rec=null},rec(s){s.rec={f:s.f}}},
 draw(s,f,X){
  const N=720,Lm=8633,c=299792458,tau=2*Lm/c,frac=(N*s.f*tau)%1,T=1-2*Math.min(frac,1-frac);
  let out=heading('Speed the wheel up until the light disappears');
  const wx=150,wy=150,rot=X.try?s.f*.7:X.p*s.f*6;
  out+=Ci(wx,wy,62,'#eef2f4',C.line);for(let k=0;k<36;k++){const a=(k/36)*2*Math.PI+rot;out+=`<rect x="${wx-5}" y="${wy-70}" width="10" height="14" fill="${C.dark}" transform="rotate(${fmt(P5_deg(a))} ${wx} ${wy})"/>`}
  out+=TF(wx,wy+5,'720 teeth',13,C.muted)+TF(wx,wy+20,'(36 drawn)',13,C.muted);
  out+=Ci(40,82,10,'#ffd24a','#c79100')+L(40,82,560,82,'#ffd24a',4,'opacity=".9"')+R(556,62,10,40,C.dark,'none',2)+TF(520,52,'mirror 8.63 km away',13,C.muted,'end');
  out+=L(560,90,wx+8,90,'#ffd24a',4,`opacity="${(.08+.92*T).toFixed(3)}"`)+P5_eye(70,108,1)+L(wx-4,90,82,104,'#ffd24a',3,`opacity="${(.08+.92*T).toFixed(3)}"`);
  out+=TF(70,134,'brightness '+Math.round(T*100)+'%',13,C.ink);
  const gx=270,gy=300,gw=300,gh=110;out+=L(gx,gy,gx+gw,gy,C.line,1.5)+L(gx,gy,gx,gy-gh,C.line,1.5)+TF(gx+gw/2,gy+30,'wheel speed (turns per second)',13,C.muted)+TF(gx-4,gy-gh-8,'returning light',13,C.muted,'start');
  let d='';for(let i=0;i<=150;i++){const ff=i/150*30,fr=(N*ff*tau)%1,tt=1-2*Math.min(fr,1-fr);d+=(i?'L':'M')+fmt(gx+ff/30*gw)+' '+fmt(gy-tt*gh)}out+=P(d,C.amber,2);
  for(const v of [0,10,20,30])out+=TF(gx+v/30*gw,gy+15,v,13,C.muted);out+=Ci(gx+s.f/30*gw,gy-T*gh,6,C.coral);
  out+=R(20,200,230,150,'#fff',C.grid,8);
  if(s.rec){const cc=4*N*Lm*s.rec.f;out+=TF(30,224,`recorded ${s.rec.f.toFixed(2)} turns/s`,13,C.ink,'start')+TF(30,248,'c = 4 × N × L × f',13,C.ink,'start')+TF(30,270,`= 4 × 720 × 8633 m × ${s.rec.f.toFixed(2)}`,13,C.ink,'start')+TBF(30,296,`= ${Math.round(cc/1000).toLocaleString('en-GB')} km/s`,15,Math.abs(cc-c)/c<.03?C.green:C.coral,'start')+TF(30,320,Math.abs(cc-c)/c<.03?'close to 299,792 km/s':'not at the darkest point yet',13,C.muted,'start')}
  else out+=TF(30,224,'Find the first dark point,',13,C.muted,'start')+TF(30,244,'then press Record.',13,C.muted,'start')+TF(30,280,`round trip: ${(tau*1e6).toFixed(1)} μs`,13,C.ink,'start');
  return {svg:out,phase:`Light takes ${(tau*1e6).toFixed(1)} microseconds for the 17 km round trip. At ${s.f.toFixed(2)} turns per second the wheel turns ${(frac).toFixed(2)} of a tooth-and-gap in that time, so ${Math.round(T*100)}% of the light gets back through. Darkness at half a tooth means the light met a tooth.`};
 }});

SCENE({id:'speed-of-light-water',name:'Slower in water',tag:'The deciding race',
 definition:'Newton’s particle theory said light speeds up entering water (to explain refraction towards the normal); the wave theory said it slows down, to c ÷ n. Measuring light in water decides between them.',
 example:'In 1850 Foucault, with a rotating mirror, showed light is slower in water, as the wave theory predicts. By 1862 he measured 298,000 km/s in air, within 1% of today’s value.',
 research:'Léon Foucault (1850). Méthode générale pour mesurer la vitesse de la lumière dans l’air et les milieux transparents, Comptes rendus 30; Foucault (1862), 298,000 km/s.',
 desc:'Two pulses of light race along 3-metre tubes, one of air and one of water. You first choose which theory to back; the race shows the water pulse arriving later, and the times are compared.',
 dur:10,hint:'Back a theory, then run the race. The pulses travel 3 m; light in air takes 10 nanoseconds.',
 init:()=>({pred:null}),
 trace(s){const fr=[];for(let k=0;k<=24;k++)fr.push({t:k*.6});return fr},
 ui:[{choose:[['particle','Newton: faster in water'],['wave','Huygens: slower in water']],label:'Your prediction',get:s=>s.pred,act:'pred'}],
 on:{pred(s,v){s.pred=v;return 'run'}},
 draw(s,f,X){
  const t=f.t,c=.299792458,len=3,n=1.333,ta=len/c,tw=len*n/c,x0=80,w=440;
  let out=heading('Which pulse arrives first?');
  const tube=(y,label,v,tEnd,fill)=>{const fr=Math.min(1,t*v/len),done=t>=tEnd;let o=R(x0,y,w,46,fill,C.line,23)+TF(x0-10,y+28,label,14,C.ink,'end');
   o+=Ci(x0+fr*w,y+23,10,'#ffd24a','#c79100')+L(x0,y+23,x0+fr*w,y+23,'#ffd24a',3,'opacity=".5"');
   if(done)o+=TBF(x0+w+10,y+28,tEnd.toFixed(1)+' ns',14,C.green,'start');return o};
  out+=tube(90,'air',c,ta,'#f6f9fb')+tube(170,'water',c/n,tw,'#dcecf5');
  out+=TF(300,240,`time ${t.toFixed(1)} ns   ·   tubes 3 m long`,14,C.muted);
  const finished=t>=tw;
  out+=R(60,262,480,92,finished?(s.pred==='particle'?C.coralp:C.greenp):'#fff',finished?(s.pred==='particle'?C.coral:C.green):C.grid,10);
  if(finished)out+=TBF(300,290,`Water is slower: ${tw.toFixed(1)} ns against ${ta.toFixed(1)} ns (c ÷ 1.33)`,15,C.ink)+TF(300,316,s.pred==='wave'?'Your prediction matches the wave theory and the experiment.':s.pred==='particle'?'The particle theory’s prediction fails: light does not speed up in water.':'This is what Foucault found in 1850.',14,C.ink)+TF(300,338,'Speeds drawn to scale; real pulses are far too fast to watch.',13,C.muted);
  else out+=TF(300,300,s.pred?'Running…':'Choose a prediction to start the race.',15,C.muted);
  return {svg:out,phase:finished?'Refraction towards the normal happens because light slows in water. Foucault’s result in 1850 was a decisive blow against Newton’s particles; a century later photons brought particles back in a new form.':'Both theories explain why light bends towards the normal in water, but for opposite reasons. One says the light speeds up, the other that it slows down.'};
 }});
