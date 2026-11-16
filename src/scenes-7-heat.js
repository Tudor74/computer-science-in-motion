/* ===================== Era 7 · Heat and matter (1800s–1900s) ===================== */
// Shared helpers for this era (prefix P7_).
// Physical constants (SI).
const P7_K=1.380649e-23,P7_NA=6.02214076e23,P7_R=8.314462618;

// Plot frame with arbitrary ranges. Returns {svg, px, py}.
function P7_plot(x,y,w,h,o){
 const {x0=0,x1=1,y0=0,y1=1,xticks=[],yticks=[],xlab='',ylab='',xfmt=v=>v,yfmt=v=>v}=o;
 const px=v=>x+w*(v-x0)/(x1-x0),py=v=>y+h-h*(v-y0)/(y1-y0);
 let s=R(x,y,w,h,'#fff',C.grid,6);
 for(const t of yticks)s+=L(x,py(t),x+w,py(t),'#eef3f6',1)+L(x-4,py(t),x,py(t),C.line,1.5)+TF(x-7,py(t)+4.5,yfmt(t),13,C.muted,'end');
 for(const t of xticks)s+=L(px(t),y+h,px(t),y+h+4,C.line,1.5)+TF(px(t),y+h+17,xfmt(t),13,C.muted);
 if(xlab)s+=TF(x+w/2,y+h+33,xlab,13,C.muted);
 if(ylab)s+=TF(x+6,y-7,ylab,13,C.muted,'start');
 return {svg:s,px,py};
}
const P7_poly=(pts,col=C.blue,w=2.5,extra='')=>pts.length<2?'':`<polyline points="${pts.map(p=>fmt(p[0])+','+fmt(p[1])).join(' ')}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
function P7_gauss(r){const u=1-r(),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
// Number formatting with a power of ten, e.g. 6.02 × 10²³.
const P7_SUP={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
function P7_sci(v,d=2){if(!isFinite(v)||v===0)return String(v);const e=Math.floor(Math.log10(Math.abs(v))),m=v/10**e;if(e>=-2&&e<=4)return Number(v.toPrecision(d+1)).toLocaleString('en-GB');return m.toFixed(d)+' × 10'+String(e).split('').map(c=>P7_SUP[c]).join('')}
const P7_fmtJ=v=>v>=1e6?(v/1e6).toFixed(v>=1e7?0:1)+' MJ':v>=1e3?(v/1e3).toFixed(v>=1e4?0:1)+' kJ':v>=1?v.toFixed(1)+' J':v>=1e-3?(v*1e3).toFixed(1)+' mJ':P7_sci(v,1)+' J';
// Colour for a temperature in °C (blue → red), for thermometers and blocks.
function P7_tcol(T,lo=0,hi=100){const u=clamp((T-lo)/(hi-lo),0,1),a=[23,114,183],b=[196,82,56];return `rgb(${a.map((c,i)=>Math.round(c+(b[i]-c)*u)).join(',')})`}
function P7_thermo(x,y,h,T,lo,hi,label){
 const u=clamp((T-lo)/(hi-lo),0,1);let s=R(x-7,y,14,h,'#fff',C.line,7)+Ci(x,y+h+9,12,P7_tcol(T,lo,hi),C.line);
 s+=R(x-4,y+h-(h-6)*u,8,(h-6)*u+6,P7_tcol(T,lo,hi),'none',4);
 return s+TB(x,y+h+40,Math.round(T)+' °C',14,C.ink)+(label?TF(x,y-8,label,13,C.muted):'');
}

/* ---- Deterministic hard-disc gas: fixed step, seeded start, recorded once per parameter set. ---- */
const P7_CACHE=new Map();
function P7_sim(o){
 const key=JSON.stringify(o);if(P7_CACHE.has(key))return P7_CACHE.get(key);
 const {n,seed,W,H,r=4,frames=300,sub=2,v0=1.5,collide=false,region=[0,1],speeds='same',sigma=1,partitionUntil=-1,keepSpeeds=false}=o;
 const rr=rng(seed),x=new Float64Array(n),y=new Float64Array(n),vx=new Float64Array(n),vy=new Float64Array(n);
 for(let i=0;i<n;i++){
  let tries=0,ok=false,xi=0,yi=0;
  while(!ok&&tries++<80){xi=W*region[0]+r+rr()*(W*(region[1]-region[0])-2*r);yi=r+rr()*(H-2*r);ok=true;if(collide)for(let j=0;j<i;j++){if((x[j]-xi)**2+(y[j]-yi)**2<(2*r+.5)**2){ok=false;break}}}
  x[i]=xi;y[i]=yi;const sp=speeds==='rayleigh'?sigma*Math.sqrt(-2*Math.log(1-rr())):v0,a=2*Math.PI*rr();vx[i]=sp*Math.cos(a);vy[i]=sp*Math.sin(a);
 }
 const out=[];let imp=0;
 for(let f=0;f<frames;f++){
  const pos=new Float32Array(2*n);for(let i=0;i<n;i++){pos[2*i]=x[i];pos[2*i+1]=y[i]}
  const rec={pos,imp};if(keepSpeeds){const sp=new Float32Array(n);for(let i=0;i<n;i++)sp[i]=Math.hypot(vx[i],vy[i]);rec.sp=sp}
  out.push(rec);
  for(let k=0;k<sub;k++){
   for(let i=0;i<n;i++){
    x[i]+=vx[i];y[i]+=vy[i];
    if(x[i]<r){x[i]=2*r-x[i];vx[i]=-vx[i];imp+=2*Math.abs(vx[i])}
    if(x[i]>W-r){x[i]=2*(W-r)-x[i];vx[i]=-vx[i];imp+=2*Math.abs(vx[i])}
    if(y[i]<r){y[i]=2*r-y[i];vy[i]=-vy[i];imp+=2*Math.abs(vy[i])}
    if(y[i]>H-r){y[i]=2*(H-r)-y[i];vy[i]=-vy[i];imp+=2*Math.abs(vy[i])}
    if(f<partitionUntil&&x[i]>W/2-r){x[i]=2*(W/2-r)-x[i];vx[i]=-Math.abs(vx[i])}
   }
   if(collide)for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){
    const dx=x[j]-x[i],dy=y[j]-y[i],d2=dx*dx+dy*dy;
    if(d2<4*r*r&&d2>1e-9){const d=Math.sqrt(d2),nx=dx/d,ny=dy/d,rel=(vx[i]-vx[j])*nx+(vy[i]-vy[j])*ny;
     if(rel>0){vx[i]-=rel*nx;vy[i]-=rel*ny;vx[j]+=rel*nx;vy[j]+=rel*ny}
     const push=(2*r-d)/2;x[i]-=nx*push;y[i]-=ny*push;x[j]+=nx*push;y[j]+=ny*push}
   }
  }
 }
 if(P7_CACHE.size>24)P7_CACHE.delete(P7_CACHE.keys().next().value);
 P7_CACHE.set(key,out);return out;
}
function P7_dots(fr,n,bx,by,r,col){let s='';for(let i=0;i<n;i++)s+=Ci(bx+fr.pos[2*i],by+fr.pos[2*i+1],r,typeof col==='function'?col(i):col);return s}

// Play / pause / restart for continuous simulations in Try it (frame index s.f advanced by a timer).
const P7_PLAY_UI=[{b:'Play ▷',act:'play'},{b:'Pause',act:'pause'},{b:'Restart',act:'restart'}];
function P7_player(total,stepBy=2){return {
 play(s,a,ctx){if(s.f>=total(s)-1)s.f=0;if(s.tid)ctx.cancel(s.tid);s.tid=ctx.every(40,'tick');return 'keep'},
 pause(s,a,ctx){if(s.tid)ctx.cancel(s.tid);s.tid=null;return 'keep'},
 restart(s){s.f=0;return 'keep'},
 tick(s){s.f=Math.min(total(s)-1,s.f+stepBy);if(s.f>=total(s)-1){s.tid=null;return 'stop'}return 'keep'}}}
const P7_frame=(s,X,total)=>X.try?clamp(s.f||0,0,total-1):Math.min(total-1,Math.floor(X.p*(total-1)));

/* ======================= Lesson: Temperature and heat ======================= */
SCENE({id:'temperature-heat',name:'Temperature and heat',tag:'How hot is not how much',
 definition:'Temperature measures how vigorously the particles of a thing move on average; heat is energy that flows from hotter to colder things. A small hot object can hold far less thermal energy than a large warm one.',
 example:'A grinding spark at 1000 °C lands harmlessly on your hand, while a 40 °C bath can warm you for an hour: the bath holds millions of times more thermal energy.',
 research:'Black, J. (lectures from the 1760s, published 1803). Lectures on the Elements of Chemistry: the first clear separation of quantity of heat from temperature.',
 desc:'A thermometer and an energy bar for a tiny hot spark beside a large warm bath; the spark is far hotter but the bath stores vastly more thermal energy above room temperature.',
 dur:9,hint:'Change the spark’s temperature and the bath’s temperature and size. Compare the thermometers with the energy bars (on a log scale).',
 init:()=>({sparkT:1000,bathT:40,bathKg:100}),
 watch(p){return {sparkT:Math.round(lerp(300,1400,smooth(p))),bathT:40,bathKg:100}},
 ui:[{range:'sparkT',label:'Spark',min:200,max:1500,step:50,get:s=>s.sparkT,act:'sparkT',show:v=>v+' °C'},{range:'bathT',label:'Bath',min:22,max:60,get:s=>s.bathT,act:'bathT',show:v=>v+' °C'},{range:'bathKg',label:'Bath mass',min:1,max:200,get:s=>s.bathKg,act:'bathKg',show:v=>v+' kg'}],
 on:{sparkT(s,v){s.sparkT=v},bathT(s,v){s.bathT=v},bathKg(s,v){s.bathKg=v}},
 draw(s){
  const room=20,mSpark=1e-7,cIron=450,cWater=4186,Es=mSpark*cIron*(s.sparkT-room),Eb=s.bathKg*cWater*(s.bathT-room);
  let out=heading('Hotter is not the same as more heat');
  // spark
  out+=R(30,60,250,170,'#fff',C.grid,10)+TB(155,84,'Iron spark (0.1 mg)',15,C.ink);
  for(let i=0;i<9;i++){const a=i*0.7,x=110+Math.cos(a)*(10+i*3),y=150+Math.sin(a)*(10+i*2);out+=Ci(x,y,i===0?5:2.5,'#f2a43a')}
  out+=P7_thermo(225,100,90,s.sparkT,0,1500,'');
  // bath
  out+=R(320,60,250,170,'#fff',C.grid,10)+TB(445,84,`Bath (${s.bathKg} kg of water)`,15,C.ink);
  out+=R(345,120,150,80,P7_tcol(s.bathT,0,100),'none',10,'opacity=".28"')+P('M345 120V200Q345 208 353 208H487Q495 208 495 200V120',C.blue,2.5);
  out+=P7_thermo(535,100,90,s.bathT,0,100,'');
  // energy bars, log scale from 1 mJ to 100 MJ
  const lx=v=>60+480*clamp((Math.log10(Math.max(v,1e-4))+4)/12,0,1);
  out+=TF(300,268,'Thermal energy above room temperature (log scale)',13,C.muted);
  for(const e of [-3,0,3,6])out+=L(lx(10**e),276,lx(10**e),330,'#eef3f6',1)+TF(lx(10**e),346,['1 mJ','1 J','1 kJ','1 MJ'][[-3,0,3,6].indexOf(e)],13,C.muted);
  out+=R(60,280,lx(Es)-60,20,'#f2a43a','none',5)+TB(lx(Es)+8,295,'spark '+P7_fmtJ(Es),14,C.ink,'start');
  const ex=lx(Eb);out+=R(60,306,ex-60,20,C.blue,'none',5)+(ex>440?TB(ex-8,321,'bath '+P7_fmtJ(Eb),14,'#fff','end'):TB(ex+8,321,'bath '+P7_fmtJ(Eb),14,C.ink,'start'));
  const ratio=Eb/Es;
  return {svg:out,phase:`The spark is ${s.sparkT-s.bathT} °C hotter, yet the bath holds about ${P7_sci(ratio,1)} times more thermal energy (Q = mcΔT). Temperature tells you which way heat will flow, not how much is stored.`};
 }});

const P7_MAT={copper:{name:'Copper',c:385,col:'#b8733d'},aluminium:{name:'Aluminium',c:897,col:'#9aa7b0'},iron:{name:'Iron',c:450,col:'#6b6f74'},water:{name:'Water',c:4186,col:C.blue}};
SCENE({id:'temperature-heat-equilibrium',name:'Thermal equilibrium',tag:'Heat flows until temperatures match',
 definition:'When two objects touch, heat flows from the hotter to the colder until they reach the same temperature. Where they meet depends on each one’s heat capacity: mass × specific heat capacity.',
 example:'1 kg of copper at 90 °C dropped into 1 kg of water at 20 °C ends at about 26 °C: water’s specific heat capacity (4186 J/kg·K) is nearly 11 times copper’s (385 J/kg·K), so the water barely warms.',
 research:'Black, J. (1760s lectures): specific heat capacity. Newton, I. (1701, anonymously). Scala graduum caloris: cooling rate proportional to temperature difference.',
 desc:'Two blocks in contact with temperatures plotted against time; both curves approach the same final temperature, which sits closer to the block with the larger heat capacity.',
 dur:10,hint:'Pick the two materials, masses and starting temperatures. The final temperature is the heat-capacity-weighted average.',
 init:()=>({m1:'copper',k1:1,T1:90,m2:'water',k2:1,T2:20,time:100}),
 ui:[{choose:[['copper','Copper'],['aluminium','Aluminium'],['iron','Iron']],label:'Hot block',get:s=>s.m1,act:'m1'},{range:'T1',label:'Hot',min:40,max:100,get:s=>s.T1,act:'T1',show:v=>v+' °C'},{range:'k1',label:'Hot mass',min:.2,max:5,step:.2,get:s=>s.k1,act:'k1',show:v=>fmt(v)+' kg'},
  {range:'k2',label:'Water mass',min:.2,max:5,step:.2,get:s=>s.k2,act:'k2',show:v=>fmt(v)+' kg'},{range:'time',label:'Time',min:0,max:100,get:s=>s.time,act:'time',show:v=>v+'%'}],
 on:{m1(s,v){s.m1=v},T1(s,v){s.T1=v},k1(s,v){s.k1=v},k2(s,v){s.k2=v},time(s,v){s.time=v}},
 draw(s,f,X){
  const A=P7_MAT[s.m1],B=P7_MAT[s.m2],C1=s.k1*A.c,C2=s.k2*B.c,Tf=(C1*s.T1+C2*s.T2)/(C1+C2),u=X.try?s.time/100:X.p;
  const tau=.22,Tt=(T0,t)=>Tf+(T0-Tf)*Math.exp(-t/tau),Ta=Tt(s.T1,u),Tb=Tt(s.T2,u);
  let out=heading('Heat flows until the temperatures meet');
  out+=R(40,90,100,90,A.col,'none',8)+TB(90,140,A.name,15,'#fff')+R(140,90,100,90,P7_tcol(Tb,0,100),'none',8,'opacity=".5"')+R(140,90,100,90,'none',C.blue,8)+TB(190,140,B.name,15,C.ink);
  const flow=Math.abs(Ta-Tb);if(flow>.5)out+=arrow(110,205,170,205,C.coral,2+Math.min(6,flow/10),10)+TF(140,232,'heat flows',13,C.coral);
  out+=TF(90,80,Math.round(Ta*10)/10+' °C',14,C.ink)+TF(190,80,Math.round(Tb*10)/10+' °C',14,C.ink);
  out+=TF(90,198,fmt(s.k1)+' kg',13,C.muted)+TF(190,198,fmt(s.k2)+' kg',13,C.muted);
  const pl=P7_plot(300,64,270,220,{x0:0,x1:1,y0:0,y1:100,yticks:[0,25,50,75,100],xticks:[],xlab:'time →',ylab:'temperature (°C)'});out+=pl.svg;
  const ptsA=range(61).map(i=>[pl.px(i/60),pl.py(Tt(s.T1,i/60))]),ptsB=range(61).map(i=>[pl.px(i/60),pl.py(Tt(s.T2,i/60))]);
  out+=L(pl.px(0),pl.py(Tf),pl.px(1),pl.py(Tf),C.green,1.5,'stroke-dasharray="6 5"')+TF(pl.px(1)-4,pl.py(Tf)-6,'final '+Tf.toFixed(1)+' °C',13,C.green,'end');
  out+=P7_poly(ptsA,A.col,3)+P7_poly(ptsB,C.blue,3)+L(pl.px(u),64,pl.px(u),284,C.ink,1.5,'stroke-dasharray="3 4"');
  out+=TF(40,312,`Heat capacity: ${A.name.toLowerCase()} ${Math.round(C1)} J/K, water ${Math.round(C2)} J/K`,13,C.muted,'start');
  out+=TF(40,334,'Idealised: no heat lost to the surroundings',13,C.muted,'start');
  return {svg:out,phase:`Heat lost by the ${A.name.toLowerCase()} equals heat gained by the water, so T_final = (C₁T₁ + C₂T₂)/(C₁ + C₂) = ${Tf.toFixed(1)} °C. The block with the larger heat capacity changes temperature less.`};
 }});

SCENE({id:'temperature-heat-modes',name:'Conduction, convection and radiation',tag:'Three ways heat travels',
 definition:'Heat moves by conduction (particles passing on vibrations through a material), convection (a warmed fluid rising and carrying energy with it) and radiation (infrared light, which needs no material at all).',
 example:'A metal spoon in tea warms by conduction, the tea circulates by convection, and the Sun warms your face by radiation across empty space. Radiated power rises with the fourth power of absolute temperature.',
 research:'Fourier, J. (1822). Théorie analytique de la chaleur (conduction). Stefan, J. (1879) and Boltzmann, L. (1884): radiated power ∝ T⁴.',
 desc:'Three panels: a rod with a temperature gradient and vibrating atoms, a pan of water with a circulating convection loop, and a glowing plate emitting infrared arrows whose power depends on temperature.',
 dur:10,hint:'Highlight one mode, and change the plate temperature to see how radiated power grows as T⁴.',
 init:()=>({mode:'all',T:600}),
 watch(p){return {mode:p<.33?'conduction':p<.66?'convection':'radiation',T:Math.round(lerp(300,900,clamp((p-.66)*3,0,1))),ph:p}},
 ui:[{choose:[['all','All'],['conduction','Conduction'],['convection','Convection'],['radiation','Radiation']],label:'Mode',get:s=>s.mode,act:'mode'},{range:'T',label:'Plate',min:300,max:1200,step:50,get:s=>s.T,act:'T',show:v=>v+' K'}],
 on:{mode(s,v){s.mode=v},T(s,v){s.T=v}},
 draw(s,f,X){
  const ph=(s.ph!==undefined?s.ph:.4)*40,on=m=>s.mode==='all'||s.mode===m,op=m=>on(m)?1:.3;let out=heading('Three ways heat travels');
  // conduction
  let c='';c+=R(20,60,180,250,'#fff',C.grid,10)+TB(110,84,'Conduction',15,C.ink);
  for(let i=0;i<10;i++){const T=100-i*9;c+=R(30+i*16,170,16,30,P7_tcol(T,0,100),'none',0)}
  c+=Ci(30,185,14,'#f2a43a')+TF(110,224,'hot end → cool end',13,C.muted);
  for(let i=0;i<8;i++){const amp=(8-i)*.9,x=42+i*20+Math.sin(ph*3+i)*amp;c+=Ci(x,250,5,C.ink,'none',`opacity="${.4+.6*(8-i)/8}"`)}
  c+=TF(110,286,'neighbours pass on',13,C.muted)+TF(110,302,'vibrations',13,C.muted);
  out+=G(c,`opacity="${op('conduction')}"`);
  // convection
  c=R(210,60,180,250,'#fff',C.grid,10)+TB(300,84,'Convection',15,C.ink)+P('M235 120V240Q235 250 245 250H355Q365 250 365 240V120',C.ink,2.5)+R(237,130,126,118,'#e1eef7','none',4);
  c+=R(250,256,100,10,'#f2a43a','none',4)+TF(300,286,'warm water rises,',13,C.muted)+TF(300,302,'cool water sinks',13,C.muted);
  c+=P('M300 235C255 235 255 150 300 150C345 150 345 235 300 235',C.coral,2,'none','stroke-dasharray="6 5"');
  for(let i=0;i<5;i++){const a=ph*.25+i*1.256,x=300+45*Math.sin(a),y=192-42*Math.cos(a);c+=Ci(x,y,4,Math.cos(a)<0?C.coral:C.blue)}
  out+=G(c,`opacity="${op('convection')}"`);
  // radiation
  const sig=5.670374419e-8,Pw=sig*s.T**4;
  c=R(400,60,180,250,'#fff',C.grid,10)+TB(490,84,'Radiation',15,C.ink)+R(420,120,24,130,P7_tcol(s.T,300,1200),'none',4);
  for(let i=0;i<4;i++){const y=140+i*30,x0=452+((ph*6+i*7)%30);let d=`M${fmt(x0)} ${y}`;for(let k=1;k<=8;k++)d+=` L${fmt(x0+k*10)} ${y+(k%2?-5:5)}`;c+=P(d,C.coral,1.8)}
  c+=TB(490,276,s.T+' K',14,C.ink)+TF(490,296,'σT⁴ = '+P7_sci(Pw,1)+' W/m²',13,C.muted);
  out+=G(c,`opacity="${op('radiation')}"`);
  out+=TF(300,340,'Radiation needs no material: it crosses empty space at the speed of light.',13,C.muted);
  const say={all:'Conduction passes vibrations along a solid, convection carries warm fluid bodily, radiation sends infrared light through empty space.',conduction:'In conduction nothing flows except energy: each particle jostles its neighbours, so the hot end’s vibrations spread along the rod.',convection:'In convection the warm fluid itself moves: it expands, becomes less dense and rises, while cooler fluid sinks to take its place.',radiation:`A ${s.T} K surface radiates about ${P7_sci(Pw,1)} W per square metre (for a perfect emitter). Doubling the absolute temperature multiplies the power by 16.`}[s.mode];
  return {svg:out,phase:say};
 }});

SCENE({id:'temperature-heat-rumford',name:'Heat is motion: Rumford’s cannon',tag:'The end of the caloric fluid',
 definition:'In the 1700s heat was widely thought to be a weightless fluid, “caloric”. Boring cannon barrels, Count Rumford found that friction produced heat without limit, which suggested heat is a form of motion rather than a substance.',
 example:'In Rumford’s 1798 test, a blunt borer turned by horses inside a barrel immersed in water made the water boil after about two and a half hours, with no sign of the heat running out.',
 research:'Rumford, Count (Benjamin Thompson) (1798). An experimental enquiry concerning the source of the heat which is excited by friction. Philosophical Transactions 88. Joule, J. P. (1845–1850): the mechanical equivalent of heat.',
 desc:'A cannon barrel in a water box, a blunt borer turned by horses, and a graph of water temperature over time comparing what the caloric theory predicts with what Rumford observed.',
 dur:12,hint:'Step through the experiment. Switch between the caloric prediction and what was observed.',
 init:()=>({view:'observed'}),
 ui:[{choose:[['observed','What Rumford saw'],['caloric','Caloric prediction']],label:'Curve',get:s=>s.view,act:'view'}],
 on:{view(s,v){s.view=v;return 'keep'}},
 trace(){return [
  {k:0,say:'Munich arsenal, 1798: a brass cannon barrel sits in a box of cold water. A deliberately blunt steel borer is pressed against it.'},
  {k:1,say:'Horses turn the barrel. The blunt borer grinds rather than cuts, and the water slowly warms.'},
  {k:2,say:'The caloric theory says heat is a fluid squeezed out of the metal, so the supply should run out as the metal is ground.'},
  {k:3,say:'Instead the heat kept coming. After about two and a half hours the water boiled, to the astonishment of the onlookers.'},
  {k:4,say:'Rumford concluded heat cannot be a material substance: it is motion. Joule later measured how much work makes how much heat (about 4.2 J per calorie).'}]},
 draw(s,f,X){
  const k=f.k,turn=X.try?k*.7:X.p*12;let out=heading('Rumford, 1798: can friction make heat without end?');
  out+=R(30,70,250,150,'#e1eef7',C.blue,8)+TF(155,236,'water box',13,C.muted);
  out+=R(60,120,170,50,'#b8963d','none',6)+TF(145,150,'brass barrel',13,'#fff');
  out+=L(230,145,268,145,'#555',6)+Ci(268,145,8,'#555');
  for(let i=0;i<4;i++){const a=turn+i*Math.PI/2;out+=L(268,145,268+22*Math.cos(a),145+22*Math.sin(a),'#777',3)}
  if(k>=1){const n=Math.min(12,k*3);for(let i=0;i<n;i++)out+=Ci(70+((i*37)%150),85+((i*13)%28)-(k>=3?i%3*4:0),k>=3?4:3,'#fff',C.blue)}
  if(k>=1)out+=TF(155,260,'horses turn the barrel →',13,C.muted);
  const pl=P7_plot(320,64,250,180,{x0:0,x1:3,y0:0,y1:110,xticks:[0,1,2,3],yticks:[0,50,100],xlab:'',ylab:'water °C',xfmt:v=>v+' h'});out+=pl.svg;
  const obs=t=>Math.min(100,15+34*t),cal=t=>15+45*(1-Math.exp(-t/0.7));
  const tEnd=k>=3?3:k>=1?1.2:0,curve=s.view==='caloric'?cal:obs;
  if(k>=2&&s.view!=='caloric')out+=P7_poly(range(31).map(i=>[pl.px(i/10),pl.py(cal(i/10))]),C.muted,2,'stroke-dasharray="5 5"')+TF(pl.px(2.2),pl.py(cal(2.2))+18,'caloric: runs out',13,C.muted);
  if(tEnd>0)out+=P7_poly(range(31).map(i=>i/10*tEnd/3).map(t=>[pl.px(t),pl.py(curve(t))]),s.view==='caloric'?C.purple:C.coral,3);
  if(k>=3&&s.view!=='caloric')out+=L(pl.px(0),pl.py(100),pl.px(3),pl.py(100),C.coral,1.5,'stroke-dasharray="4 4"')+TF(pl.px(2.5),pl.py(100)-6,'boils ≈ 2.5 h',13,C.coral);
  if(k>=4)out+=R(30,292,540,52,C.greenp,'none',10)+TB(300,316,'Heat is a form of motion, not a fluid',15,C.green)+TF(300,336,'1 calorie of heat ≈ 4.2 J of work (Joule)',13,C.ink);
  return {svg:out,phase:f.say+(s.view==='caloric'?' (Purple: what caloric theory would expect if heat were stored in the metal.)':'')};
 }});

/* ======================= Lesson: Kinetic theory ======================= */
const P7_BOX={x:30,y:60,W:250,H:250};
SCENE({id:'kinetic-theory',name:'A gas is particles in motion',tag:'Pressure is particles hitting the walls',
 definition:'Kinetic theory pictures a gas as countless particles flying about and bouncing off the walls. Pressure is the average push of those impacts; temperature measures the particles’ average kinetic energy.',
 example:'Double the absolute temperature and each particle’s mean kinetic energy doubles, so the walls are hit harder and more often: at fixed volume the pressure doubles.',
 research:'Bernoulli, D. (1738). Hydrodynamica. Clausius, R. (1857) and Maxwell, J. C. (1860): the kinetic theory of gases.',
 desc:'A box of bouncing particles beside a running measurement of pressure from their wall impacts, compared with the ideal-gas prediction for the chosen number of particles and temperature.',
 dur:12,hint:'Change the number of particles and the temperature, then Play. Measured pressure (from impacts) settles near the prediction.',
 init:()=>({n:40,T:300,f:0}),
 ui:[{range:'n',label:'Particles',min:10,max:80,step:5,get:s=>s.n,act:'n'},{range:'T',label:'Temperature',min:100,max:600,step:50,get:s=>s.T,act:'T',show:v=>v+' K'},...P7_PLAY_UI],
 on:{n(s,v){s.n=v;s.f=0},T(s,v){s.T=v;s.f=0},...P7_player(()=>240)},
 draw(s,f,X){
  const v0=1.2*Math.sqrt(s.T/300),fr=P7_sim({n:s.n,seed:7,W:P7_BOX.W,H:P7_BOX.H,r:4,frames:240,sub:2,v0}),fi=P7_frame(s,X,240),cur=fr[fi];
  let out=heading('Pressure is the push of particles hitting the walls');
  out+=R(P7_BOX.x-2,P7_BOX.y-2,P7_BOX.W+4,P7_BOX.H+4,'#fff',C.ink,4)+P7_dots(cur,s.n,P7_BOX.x,P7_BOX.y,4,C.blue);
  // pressure in simulation units: impulse per unit wall length per step
  const win=Math.min(fi,80),meas=win>5?(cur.imp-fr[fi-win].imp)/(win*2)/(2*(P7_BOX.W+P7_BOX.H)):0,pred=s.n*v0*v0/(2*P7_BOX.W*P7_BOX.H);
  const scale=v=>Math.min(206,200*v/(80*2.16*2.16/(2*250*250)*1.05));
  out+=R(320,64,250,246,'#fff',C.grid,10)+TB(445,88,'Pressure (relative units)',15,C.ink);
  out+=R(360,290-scale(pred),60,scale(pred),C.pale,C.blue,4)+TF(390,304,'predicted',13,C.muted);
  out+=R(470,290-scale(meas),60,scale(meas),C.coral,'none',4)+TF(500,304,'measured',13,C.muted);
  out+=TF(390,284-scale(pred),pred>0?'1.00':'',13,C.ink)+TF(500,284-scale(meas),meas>0?(meas/pred).toFixed(2):'—',13,C.ink);
  out+=TF(155,334,`${s.n} particles · ${s.T} K · speed ∝ √T`,13,C.muted)+TF(445,334,'2D ideal gas: pA = NkT',13,C.muted);
  return {svg:out,phase:fi<10?'Each impact gives the wall a tiny push. Add them up over time and you get pressure.':`Measured over the last moments, the impacts give ${(meas/pred).toFixed(2)} × the ideal-gas prediction. More particles or a higher temperature means harder, more frequent hits and higher pressure.`};
 }});

SCENE({id:'kinetic-theory-distribution',name:'The Maxwell–Boltzmann distribution',tag:'Collisions share out the energy',
 definition:'Start a gas with every particle at the same speed and collisions quickly spread the speeds out into a characteristic curve: few slow, most near the middle, a long tail of fast ones. Maxwell derived its shape in 1860; Boltzmann explained why it is the most probable.',
 example:'In air at room temperature the most common nitrogen molecule speed is about 420 m/s, but a few molecules move at more than twice that.',
 research:'Maxwell, J. C. (1860). Illustrations of the dynamical theory of gases. Philosophical Magazine. Boltzmann, L. (1872, 1877).',
 desc:'A box of colliding particles that all start at one speed, beside a histogram of their speeds that spreads out into the smooth Maxwell–Boltzmann curve for a two-dimensional gas.',
 dur:14,hint:'Play from equal speeds and watch collisions spread the histogram into the theoretical curve. “New start” uses different starting positions.',
 init:()=>({seed:11,f:0}),
 ui:[...P7_PLAY_UI,{b:'New start',act:'seed'}],
 on:{seed(s){s.seed=nextSeed()%1000+1;s.f=0},...P7_player(()=>260)},
 draw(s,f,X){
  const n=70,fr=P7_sim({n,seed:s.seed,W:250,H:250,r:5,frames:260,sub:2,v0:1.4,collide:true,keepSpeeds:true}),fi=P7_frame(s,X,260);
  let out=heading('Collisions spread one speed into a curve')+R(28,58,254,254,'#fff',C.ink,4);
  const cur=fr[fi];out+=P7_dots(cur,n,30,60,5,i=>{const v=cur.sp[i]/1.4;return v<.6?C.blue:v<1.3?C.purple:C.coral});
  // histogram averaged over a few frames
  const bins=14,vmax=3.5,h=new Array(bins).fill(0);let cnt=0;for(let k=Math.max(0,fi-6);k<=fi;k++){for(const v of fr[k].sp){const b=Math.floor(v/vmax*bins);if(b<bins)h[b]++;cnt++}}
  const pl=P7_plot(330,70,240,220,{x0:0,x1:vmax,y0:0,y1:.55,xticks:[0,1.4,2.8],xfmt:v=>v===0?'0':v===1.4?'start speed':'2×',yticks:[],xlab:'speed',ylab:'share of particles'});out+=pl.svg;
  const bw=vmax/bins;h.forEach((c,i)=>{const frac=c/cnt;out+=R(pl.px(i*bw)+1,pl.py(frac),pl.px(bw)-pl.px(0)-2,pl.py(0)-pl.py(frac),C.pale,C.blue,2)});
  // 2D Maxwell–Boltzmann (Rayleigh) with mean square speed fixed by energy: <v²> = v0²
  const sig2=1.4*1.4/2,ray=v=>v/sig2*Math.exp(-v*v/(2*sig2))*bw;
  out+=P7_poly(range(71).map(i=>{const v=i/70*vmax;return [pl.px(v),pl.py(ray(v+bw/2))]}),C.coral,2.5);
  out+=TF(450,316,'curve: 2D Maxwell–Boltzmann',13,C.coral);
  return {svg:out,phase:fi<8?'Every particle starts with exactly the same speed: the histogram is a single spike.':'Each collision shares energy unevenly. Total energy stays the same, but the speeds settle into the Maxwell–Boltzmann shape: the most probable way to share energy among many particles.'};
 }});

SCENE({id:'kinetic-theory-gas-laws',name:'Gas laws and absolute zero',tag:'Boyle, Charles and the coldest temperature',
 definition:'For a fixed amount of gas, pressure × volume is constant at fixed temperature (Boyle’s law), and volume grows in proportion to absolute temperature at fixed pressure (Charles’s law). Extrapolating Charles’s line to zero volume points to absolute zero, −273.15 °C.',
 example:'Halve the volume of a sealed syringe at constant temperature and the pressure doubles. Cool a balloon from 27 °C to −73 °C and its volume falls by a third (300 K → 200 K).',
 research:'Boyle, R. (1662). A Defence of the Doctrine Touching the Spring and Weight of the Air. Gay-Lussac, J. L. (1802), crediting Charles’s unpublished work. Thomson, W. (Kelvin) (1848): the absolute temperature scale.',
 desc:'A piston holding a gas, with a graph that collects measurement points: pressure against volume for Boyle’s law, or volume against temperature for Charles’s law with its line extended to absolute zero.',
 dur:12,hint:'Choose a law, move the slider and press Record to add a measurement. Charles’s line, extended, reaches zero volume at −273 °C.',
 init:()=>({law:'charles',V:2,T:300,pts:[]}),
 watch(p){const law=p<.5?'boyle':'charles',u=law==='boyle'?p*2:(p-.5)*2;const pts=[];const k=Math.floor(u*6);for(let i=0;i<=k;i++)pts.push(law==='boyle'?1+i*.5:200+i*40);return {law,V:law==='boyle'?1+Math.min(6,k)*.5:2,T:law==='charles'?200+Math.min(6,k)*40:300,pts}},
 ui:[{choose:[['boyle','Boyle (fixed T)'],['charles','Charles (fixed p)']],label:'Law',get:s=>s.law,act:'law'},{range:'V',label:'Volume',min:1,max:4,step:.25,get:s=>s.V,act:'V',show:v=>fmt(v)+' L'},{range:'T',label:'Temperature',min:150,max:450,step:10,get:s=>s.T,act:'T',show:v=>v+' K'},{b:'Record',act:'rec'},{b:'Clear',act:'clear'}],
 on:{law(s,v){s.law=v;s.pts=[]},V(s,v){s.V=v},T(s,v){s.T=v},rec(s){const x=s.law==='boyle'?s.V:s.T;if(!s.pts.includes(x))s.pts.push(x);return 'keep'},clear(s){s.pts=[]}},
 draw(s){
  const nR=0.05*P7_R;let out=heading(s.law==='boyle'?'Boyle: squeeze a gas and its pressure rises':'Charles: cool a gas and it shrinks towards absolute zero');
  const T=s.law==='boyle'?300:s.T,p=s.law==='boyle'?nR*T/(s.V/1000)/1000:100,V=s.law==='boyle'?s.V:nR*T/(100e3)*1000;
  // cylinder
  const cy=320,top=cy-220*V/4.5;out+=R(40,90,120,230,'#fff',C.ink,4)+R(42,top,116,cy-top,'#e1eef7','none',0)+R(36,top-14,128,14,'#8a99a3','none',3)+L(100,top-14,100,70,'#8a99a3',6);
  const rr=rng(5);for(let i=0;i<24;i++)out+=Ci(50+rr()*100,top+6+rr()*(cy-top-12),3,C.blue);
  out+=TF(100,344,`${fmt(V.toFixed(2))} L · ${Math.round(p)} kPa · ${T} K`,13,C.ink);
  if(s.law==='boyle'){
   const pl=P7_plot(240,64,320,236,{x0:0,x1:4.5,y0:0,y1:260,xticks:[1,2,3,4],yticks:[0,100,200],xlab:'volume (L)',ylab:'pressure (kPa)'});out+=pl.svg;
   out+=P7_poly(range(60).map(i=>{const v=.5+i/59*4;return [pl.px(v),pl.py(nR*300/(v/1000)/1000)]}),C.line,2,'stroke-dasharray="5 5"');
   for(const v of s.pts)out+=Ci(pl.px(v),pl.py(nR*300/(v/1000)/1000),6,C.coral);
   out+=Ci(pl.px(V),pl.py(p),8,'none',C.ink);
   out+=TF(400,92,'p × V = '+Math.round(p*V)+' kPa·L',14,C.green);
   return {svg:out,phase:`At fixed temperature p × V stays at ${Math.round(p*V)} kPa·L: halve the volume and the pressure doubles, because the same particles hit a smaller wall area more often.`};
  }
  const pl=P7_plot(240,64,320,236,{x0:-300,x1:200,y0:0,y1:2.5,xticks:[-273,-100,0,100,200],yticks:[0,1,2],xlab:'temperature (°C)',ylab:'volume (L)'});out+=pl.svg;
  const Vt=Tk=>nR*Tk/100e3*1000;
  out+=P7_poly([[pl.px(-273.15),pl.py(0)],[pl.px(200),pl.py(Vt(473.15))]],C.line,2,'stroke-dasharray="5 5"');
  for(const t of s.pts)out+=Ci(pl.px(t-273.15),pl.py(Vt(t)),6,C.coral);
  out+=Ci(pl.px(T-273.15),pl.py(V),8,'none',C.ink);
  if(s.pts.length>=2)out+=Ci(pl.px(-273.15),pl.py(0),6,C.green)+TF(pl.px(-273.15)+8,pl.py(0)-10,'absolute zero −273 °C',13,C.green,'start');
  return {svg:out,phase:`At fixed pressure the volume is proportional to absolute temperature: ${T} K gives ${fmt(V.toFixed(2))} L. Extend the line of measurements and it reaches zero volume at −273.15 °C: 0 K. (Real gases liquefy first.)`};
 }});

/* ======================= Lesson: Brownian motion ======================= */
// A grain's path: Gaussian kicks, seeded. Returns positions for `steps` steps.
const P7_WALK=new Map();
function P7_walk(seed,steps,sig){const key=seed+':'+steps+':'+sig;if(P7_WALK.has(key))return P7_WALK.get(key);const r=rng(seed),pts=[[0,0]];for(let i=1;i<=steps;i++){const p=pts[i-1];pts.push([p[0]+sig*P7_gauss(r),p[1]+sig*P7_gauss(r)])}if(P7_WALK.size>200)P7_WALK.delete(P7_WALK.keys().next().value);P7_WALK.set(key,pts);return pts}
SCENE({id:'brownian-motion',name:'Brownian motion',tag:'Seeing the invisible jostling',
 definition:'Tiny particles suspended in water jiggle about at random. In 1827 Robert Brown saw it in grains from pollen; in 1905 Einstein explained it as the visible result of countless collisions with invisible, moving water molecules.',
 example:'A grain one thousandth of a millimetre across is hit by water molecules trillions of times a second. The hits almost cancel, and the small imbalance each instant drives an erratic, never-ending dance.',
 research:'Brown, R. (1828). A brief account of microscopical observations… on the particles contained in the pollen of plants. Einstein, A. (1905). Annalen der Physik 17.',
 desc:'A large grain wandering along an erratic track; switching on the molecules reveals the small fast particles whose uneven collisions push it about.',
 dur:12,hint:'Show the molecules to see what Brown could not, and start a new grain. The track never settles and never repeats.',
 init:()=>({mol:true,seed:3,f:0}),
 watch(p){return {mol:p>.35,seed:3}},
 ui:[{choose:[[true,'Show molecules'],[false,'Microscope view']],label:'View',get:s=>s.mol,act:'mol'},{b:'New grain',act:'seed'},...P7_PLAY_UI],
 on:{mol(s,v){s.mol=v==='true'||v===true;return 'keep'},seed(s){s.seed=nextSeed()%997+1;s.f=0},...P7_player(()=>300,1)},
 draw(s,f,X){
  const pts=P7_walk(s.seed,300,2.6),fi=P7_frame(s,X,300),cx=300,cy=196;let out=heading(s.mol?'What Brown could not see: molecules jostling the grain':'Through the microscope: a grain that never keeps still');
  out+=R(40,52,520,290,s.mol?'#f7fbfd':'#f2efe4',C.grid,12);
  const pos=pts[fi];
  if(s.mol){const r=rng(1000+fi);for(let i=0;i<150;i++){const x=48+r()*504,y=60+r()*274;out+=Ci(x,y,2.2,C.blue,'none','opacity=".55"')}
   const r2=rng(5000+fi);for(let i=0;i<6;i++){const a=r2()*6.283;out+=arrow(cx+pos[0]+Math.cos(a)*44,cy+pos[1]+Math.sin(a)*44,cx+pos[0]+Math.cos(a)*24,cy+pos[1]+Math.sin(a)*24,C.coral,1.8,6)}}
  out+=P7_poly(pts.slice(0,fi+1).map(p=>[cx+p[0],cy+p[1]]),C.purple,1.6,'opacity=".75"');
  out+=Ci(cx+pos[0],cy+pos[1],18,'#d4a84a','#8a6a22');
  out+=TF(52,334,s.mol?'Molecules shown far larger and fewer than they are':'Grain about 1 µm across, magnified',13,C.muted,'start');
  return {svg:out,phase:s.mol?'Each instant more molecules strike one side than the other, so the grain is nudged in a random direction. Einstein showed how the spread of these tracks reveals the size of molecules.':'Brown first suspected life in the pollen, then saw the same motion in grains of dust and glass: it is physical, not biological, and it never stops.'};
 }});

SCENE({id:'brownian-motion-walk',name:'The random walk',tag:'Distance grows with the square root of time',
 definition:'A random walk takes steps in random directions. On average it gets nowhere, but its typical distance from the start grows with the square root of time, so the mean square distance grows in proportion to time.',
 example:'To get twice as far from the start, a random walker needs four times as long. That is why stirring beats waiting for sugar to spread through tea.',
 research:'Einstein, A. (1905). Annalen der Physik 17: mean square displacement ∝ time. Pearson, K. (1905). The problem of the random walk. Nature 72.',
 desc:'Sixty walkers start together at the centre and spread into a widening cloud; a circle marks the root-mean-square distance, and a graph compares it with a square-root curve.',
 dur:12,hint:'Slide time forward and change the step size. The cloud widens like √t, not like t.',
 init:()=>({t:100,step:3}),
 watch(p){return {t:Math.round(1+p*299),step:3}},
 ui:[{range:'t',label:'Steps',min:1,max:300,get:s=>s.t,act:'t'},{range:'step',label:'Step size',min:1,max:5,step:.5,get:s=>s.step,act:'step'}],
 on:{t(s,v){s.t=v},step(s,v){s.step=v}},
 draw(s){
  const N=60,cx=150,cy=196;let out=heading('Twice as far takes four times as long');
  out+=R(20,52,260,290,'#fff',C.grid,10);let ms=0;
  for(let i=0;i<N;i++){const w=P7_walk(100+i,300,s.step),p=w[s.t];ms+=p[0]**2+p[1]**2;out+=Ci(clamp(cx+p[0],24,276),clamp(cy+p[1],56,338),3,C.blue,'none','opacity=".75"')}
  const rms=Math.sqrt(ms/N);out+=Ci(cx,cy,Math.min(rms,140),'none',C.coral,'stroke-dasharray="5 4"')+Ci(cx,cy,3,C.ink);
  const pl=P7_plot(330,64,240,226,{x0:0,x1:300,y0:0,y1:5*Math.sqrt(300)*1.15,xticks:[0,100,200,300],yticks:[],xlab:'steps (time)',ylab:'typical distance'});out+=pl.svg;
  out+=P7_poly(range(61).map(i=>{const t=i*5;return [pl.px(t),pl.py(s.step*Math.sqrt(2*t))]}),C.coral,2.5);
  const meas=[];for(let t=0;t<=s.t;t+=10){let m=0;for(let i=0;i<N;i++){const p=P7_walk(100+i,300,s.step)[t];m+=p[0]**2+p[1]**2}meas.push([pl.px(t),pl.py(Math.sqrt(m/N))])}
  for(const q of meas)out+=Ci(q[0],q[1],3.5,C.blue);
  out+=TF(450,316,'curve: step × √(2t)',13,C.coral);
  return {svg:out,phase:`After ${s.t} steps the walkers are typically ${rms.toFixed(0)} px from the start: about step × √(2t) = ${(s.step*Math.sqrt(2*s.t)).toFixed(0)} px. The mean square distance grows in proportion to time.`};
 }});

const P7_TAUS=[30,60,90,120];
function P7_perrinFit(s){const a=s.a*1e-6,D=P7_K*293/(6*Math.PI*1e-3*a);const r=rng(s.seed);const pts=P7_TAUS.map(tau=>{let m=0;for(let i=0;i<s.grains;i++){const sd=Math.sqrt(2*D*tau);const dx=sd*P7_gauss(r),dy=sd*P7_gauss(r);m+=dx*dx+dy*dy}return [tau,s.grains?m/s.grains:0]});
 const slope=s.grains?sum(pts.map(p=>p[0]*p[1]))/sum(pts.map(p=>p[0]*p[0])):0,Dest=slope/4,NA=Dest>0?P7_R*293/(6*Math.PI*1e-3*a*Dest):0;return {D,pts,slope,Dest,NA}}
SCENE({id:'brownian-motion-perrin',name:'Rerun Perrin: counting molecules',tag:'Brownian motion weighs the atom',
 definition:'Einstein predicted that a grain’s mean square displacement grows as 4Dt in a plane, with D = RT/(6πηaN_A). Measure the spread, and you can solve for Avogadro’s number N_A. Jean Perrin did this from 1908 and won the 1926 Nobel Prize: atoms were real.',
 example:'For grains 0.5 µm in radius in water at 20 °C, the typical displacement after 30 s is about 7 µm. Track enough grains and the formula gives N_A ≈ 6 × 10²³ per mole.',
 research:'Einstein, A. (1905). Annalen der Physik 17. Perrin, J. (1909). Mouvement brownien et réalité moléculaire. Annales de Chimie et de Physique 18.',
 desc:'A graph of measured mean square displacement against time for simulated grains, with a fitted straight line whose slope gives the diffusion constant and, through Einstein’s formula, an estimate of Avogadro’s number.',
 dur:12,hint:'Choose the grain radius, then Record more grains. Your estimate of Avogadro’s number tightens as the sample grows.',
 init:()=>({a:.5,grains:0,seed:21}),
 watch(p){return {a:.5,grains:Math.round(5+p*95),seed:21}},
 ui:[{range:'a',label:'Grain radius',min:.2,max:1,step:.1,get:s=>s.a,act:'a',show:v=>fmt(v)+' µm'},{b:'Record 10 grains',act:'rec'},{b:'Clear',act:'clear'}],
 on:{a(s,v){s.a=v;s.grains=0;s.seed=nextSeed()%997+1},rec(s){s.grains=Math.min(400,s.grains+10)},clear(s){s.grains=0;s.seed=nextSeed()%997+1}},
 draw(s){
  const F=P7_perrinFit(s),um2=v=>v*1e12,ymax=um2(4*F.D*130)*1.25;let out=heading('Rerun Perrin: measure the spread, count the molecules');
  const pl=P7_plot(70,64,290,236,{x0:0,x1:130,y0:0,y1:ymax,xticks:[0,30,60,90,120],yticks:[0,Math.round(ymax/2),Math.round(ymax)],xlab:'time interval (s)',ylab:'mean square displacement (µm²)'});out+=pl.svg;
  out+=P7_poly([[pl.px(0),pl.py(0)],[pl.px(130),pl.py(um2(4*F.D*130))]],C.line,2,'stroke-dasharray="5 5"');
  if(s.grains){for(const p of F.pts)out+=Ci(pl.px(p[0]),pl.py(um2(p[1])),6,C.coral);out+=P7_poly([[pl.px(0),pl.py(0)],[pl.px(130),pl.py(um2(F.slope*130))]],C.coral,2.5)}
  out+=R(390,64,190,236,'#fff',C.grid,10)+TB(485,88,'Your experiment',15,C.ink);
  out+=TF(485,116,`radius ${fmt(s.a)} µm · water, 20 °C`,13,C.muted)+TF(485,140,`grains tracked: ${s.grains}`,14,C.ink);
  out+=TF(485,172,'D from the slope:',13,C.muted)+TB(485,194,s.grains?P7_sci(F.Dest,2)+' m²/s':'—',15,C.ink);
  out+=TF(485,226,'Avogadro’s number:',13,C.muted)+TB(485,250,s.grains?P7_sci(F.NA,2):'—',17,C.green);
  out+=TF(485,276,'accepted 6.02 × 10²³',13,C.muted);
  out+=TF(215,344,'Simulated measurements with Einstein’s statistics; dashed line is the true value.',13,C.muted);
  const err=s.grains?Math.abs(F.NA/P7_NA-1)*100:0;
  return {svg:out,phase:s.grains?`From ${s.grains} grains the slope gives D = ${P7_sci(F.Dest,2)} m²/s and N_A ≈ ${P7_sci(F.NA,2)}, ${err.toFixed(0)}% from the accepted value. Perrin’s values, by several methods, clustered around 6–7 × 10²³.`:'Record some grains. Each one is tracked and its displacement after 30, 60, 90 and 120 s is squared and averaged.'};
 }});

/* ======================= Lesson: Entropy ======================= */
function P7_lnC(n,k){let s=0;for(let i=1;i<=k;i++)s+=Math.log((n-k+i)/i);return s}
SCENE({id:'entropy',name:'Entropy: counting arrangements',tag:'Why gas spreads and never unspreads',
 definition:'Entropy counts how many microscopic arrangements (microstates) look the same from outside. Boltzmann’s formula S = k ln W links it to that number, W. Systems drift towards the outcomes with overwhelmingly many arrangements, so entropy increases.',
 example:'With 40 particles, “all in the left half” is one arrangement in 2⁴⁰ (about a trillion); “half and half” covers about 1.4 × 10¹¹ arrangements. Remove a partition and the gas spreads because spread-out states vastly outnumber bunched ones.',
 research:'Clausius, R. (1865): entropy and the second law. Boltzmann, L. (1877): S = k log W (the formula is carved on his gravestone in Vienna).',
 desc:'A box of particles starting in the left half after a partition is removed, beside a graph of how many are on the left over time and the count of arrangements W and entropy for the current split.',
 dur:12,hint:'Set the number of particles and Play. With few particles the split wobbles a lot; with many it settles close to half and half.',
 init:()=>({n:30,seed:13,f:0}),
 ui:[{range:'n',label:'Particles',min:4,max:60,step:2,get:s=>s.n,act:'n'},{b:'New start',act:'seed'},...P7_PLAY_UI],
 on:{n(s,v){s.n=v;s.f=0},seed(s){s.seed=nextSeed()%997+1;s.f=0},...P7_player(()=>260)},
 draw(s,f,X){
  const n=s.n,fr=P7_sim({n,seed:s.seed,W:260,H:240,r:4,frames:260,sub:2,v0:1.6,region:[0,.5],partitionUntil:10}),fi=P7_frame(s,X,260),cur=fr[fi];
  let out=heading('Remove the partition: the gas spreads out');
  out+=R(28,58,264,244,'#fff',C.ink,4);if(fi<10)out+=L(160,60,160,300,C.ink,3);else out+=L(160,60,160,300,C.line,1.5,'stroke-dasharray="4 6"');
  let left=0;for(let i=0;i<n;i++)if(cur.pos[2*i]<130)left++;
  out+=P7_dots(cur,n,30,60,4,i=>cur.pos[2*i]<130?C.blue:C.coral);
  out+=TF(95,322,`left ${left}`,14,C.blue)+TF(225,322,`right ${n-left}`,14,C.coral);
  const pl=P7_plot(330,64,240,150,{x0:0,x1:260,y0:0,y1:n,xticks:[],yticks:[0,n/2,n],xlab:'time →',ylab:'particles on the left'});out+=pl.svg;
  const series=[];for(let k=0;k<=fi;k+=2){let l=0;const p=fr[k].pos;for(let i=0;i<n;i++)if(p[2*i]<130)l++;series.push([pl.px(k),pl.py(l)])}
  out+=L(pl.px(0),pl.py(n/2),pl.px(260),pl.py(n/2),C.green,1.5,'stroke-dasharray="5 5"')+P7_poly(series,C.blue,2);
  const lnW=P7_lnC(n,left),lnMax=P7_lnC(n,Math.floor(n/2));
  out+=R(330,250,240,92,'#fff',C.grid,8)+TF(450,272,`W = C(${n}, ${left}) = ${P7_sci(Math.exp(lnW),1)}`,13,C.ink);
  out+=TF(450,296,`S = k ln W = ${lnW.toFixed(1)} k`,14,C.purple);
  out+=TF(450,320,`maximum ${lnMax.toFixed(1)} k at half and half`,13,C.muted);
  return {svg:out,phase:fi<10?'All particles start on the left: only one way to choose which particles are there, so W = 1 and S = 0.':`Now ${left} of ${n} are on the left. Even split states have the most arrangements, so the gas wanders there and stays near them. Nothing pushes it: the spread-out states simply vastly outnumber the bunched ones.`};
 }});

SCENE({id:'entropy-mixing',name:'Mixing and the film run backwards',tag:'You can tell which way time runs',
 definition:'Each collision obeys laws that work equally well forwards and backwards, yet a film of two gases mixing looks absurd when reversed. Unmixing is not forbidden, just so improbable that it never happens for more than a handful of particles.',
 example:'For 50 particles, a random rearrangement puts every blue one back on the left only about once in 10¹⁴ tries. For the 10²² molecules in a breath of air, the odds are beyond astronomical.',
 research:'Boltzmann, L. (1877): the statistical interpretation of the second law. Loschmidt, J. (1876): the reversibility objection.',
 desc:'Blue and coral particles start separated and mix; a switch plays the same film backwards, showing particles spontaneously unmixing, with a measure of how sorted the box is.',
 dur:12,hint:'Play forwards, then switch to backwards. Every bounce still obeys the laws of motion; what looks wrong is the improbability.',
 init:()=>({rev:false,f:0}),
 watch(p){return {rev:p>.55,f:0}},
 ui:[{choose:[[false,'Forwards'],[true,'Backwards']],label:'Film',get:s=>s.rev,act:'rev'},...P7_PLAY_UI],
 on:{rev(s,v){s.rev=v==='true'||v===true;return 'keep'},...P7_player(()=>240)},
 draw(s,f,X){
  const n=50,fr=P7_sim({n,seed:29,W:500,H:230,r:5,frames:240,sub:2,v0:1.7,collide:true}),fi0=P7_frame(s,X,240),
   fi=X.try?(s.rev?239-fi0:fi0):(X.p<.55?Math.floor(X.p/.55*239):Math.floor(239-(X.p-.55)/.45*239));
  // colour by starting side
  const side=i=>fr[0].pos[2*i]<250;
  let out=heading(s.rev?'Played backwards: the gases unmix (it never happens)':'Played forwards: two gases mix');
  out+=R(48,58,504,234,'#fff',C.ink,4);const cur=fr[fi];out+=P7_dots(cur,n,50,60,5,i=>side(i)?C.blue:C.coral);
  let sorted=0,bl=0;for(let i=0;i<n;i++){const left=cur.pos[2*i]<250;if(side(i)===left)sorted++;if(side(i))bl++}
  const frac=sorted/n;out+=R(48,308,504,16,'#eef3f6','none',8)+R(48,308,504*clamp((frac-.5)*2,0,1),16,C.purple,'none',8);
  out+=TF(300,346,`sorted: ${Math.round(frac*100)}% on their own side (50% = fully mixed)`,13,C.muted);
  return {svg:out,phase:s.rev?'Every bounce in the reversed film obeys Newton’s laws. It looks wrong only because, of all the ways the particles could move, almost none lead to unmixing.':`Mixing raises entropy. The chance that ${n} particles all drift back to their own sides is about 1 in ${P7_sci(Math.exp(P7_lnC(n,n/2)),1)}.`};
 }});

SCENE({id:'entropy-arrow',name:'The arrow of time',tag:'Improbable is not impossible, just never seen',
 definition:'The second law of thermodynamics says the entropy of an isolated system does not decrease. Statistically, a decrease is possible but its probability shrinks exponentially with the number of particles, which is why time seems to run one way.',
 example:'The chance that all the air in a room gathers in one half is about 1 in 2 raised to the number of molecules: for 10²⁷ molecules, a number with about 3 × 10²⁶ digits.',
 research:'Clausius, R. (1865). Boltzmann, L. (1877). Eddington, A. (1928). The Nature of the Physical World: “time’s arrow”.',
 desc:'A slider for the number of particles in a box with a table of the probability that all of them are found in one half at a given moment, and how long you would expect to wait.',
 dur:10,hint:'Move the slider from a few particles up to a room full of air. Watch the waiting time leave the age of the universe far behind.',
 init:()=>({lg:1}),
 watch(p){return {lg:Math.round(p*27*2)/2}},
 ui:[{range:'lg',label:'Particles (log₁₀)',min:0,max:27,step:.5,get:s=>s.lg,act:'lg',show:v=>'10^'+v}],
 on:{lg(s,v){s.lg=v}},
 draw(s){
  const N=10**s.lg,log10P=-N*Math.log10(2),checks=1e10,age=4.35e17;
  let out=heading('How unlikely is it that everything gathers in one half?');
  const n=Math.min(40,Math.max(1,Math.round(N)));out+=R(30,60,230,170,'#fff',C.ink,4)+L(145,62,145,228,C.line,1.5,'stroke-dasharray="4 6"');
  const r=rng(17);for(let i=0;i<n;i++)out+=Ci(40+r()*95,70+r()*150,4,C.blue);
  out+=TF(145,252,N>40?'(showing 40 of '+P7_sci(N,0)+')':n+' particle'+(n>1?'s':''),13,C.muted);
  out+=R(290,60,280,250,'#fff',C.grid,10)+TB(430,86,'All in the left half',15,C.ink);
  const pTxt=(10**log10P).toPrecision(2);
  out+=TF(430,118,'probability at any instant:',13,C.muted)+TB(430,142,log10P>-4?pTxt:'10 to the power −'+P7_sci(-log10P,1),log10P>-4||-log10P<1e5?15:13,C.coral);
  const waitLog=-log10P-10;
  out+=TF(430,180,'checking 10¹⁰ times a second,',13,C.muted)+TF(430,198,'expected wait:',13,C.muted);
  const wait=waitLog<0?'under a second':waitLog<7.5?P7_sci(10**waitLog,1)+' s':'10 to the power '+P7_sci(waitLog,1)+' s';
  out+=TB(430,222,wait,15,C.ink);
  out+=TF(430,256,'age of the universe ≈ 4.4 × 10¹⁷ s',13,C.muted);
  out+=R(310,272,240,26,waitLog>Math.log10(age)?C.coralp:C.greenp,'none',6)+TB(430,290,waitLog>Math.log10(age)?'longer than the age of the universe':'you might see it',13,waitLog>Math.log10(age)?C.coral:C.green);
  out+=TF(300,340,'A probability of 2^−N: each particle has an even chance of being on the left.',13,C.muted);
  return {svg:out,phase:N<20?'With a handful of particles, “all on one side” happens often: entropy can briefly fall. The second law is about large numbers.':'Nothing in the laws of motion forbids the air gathering in one corner. It is simply so improbable that no one, anywhere, will ever see it: that is the arrow of time.'};
 }});

SCENE({id:'entropy-demon',name:'Maxwell’s demon',tag:'Can information beat the second law?',
 definition:'Maxwell imagined a tiny being opening a door between two halves of a gas to let fast molecules one way and slow ones the other, making one side hot and the other cold without doing work. The resolution: the demon must measure and remember, and erasing that memory costs at least k ln 2 of entropy per bit.',
 example:'Sorting 100 molecules needs around 100 yes-or-no decisions. Landauer showed that wiping each bit generates at least kT ln 2 of heat, which repays the entropy the sorting removed.',
 research:'Maxwell, J. C. (1867 letter; 1871). Theory of Heat. Szilard, L. (1929). Landauer, R. (1961). IBM Journal 5. Bennett, C. H. (1982): erasure, not measurement, carries the cost.',
 desc:'A box divided by a wall with a door operated by a demon who lets fast particles into the right and slow ones into the left; the two halves’ average energies diverge while a counter of bits recorded grows.',
 dur:12,hint:'Play and watch the right side heat up. The bit counter is the demon’s growing memory, which must eventually be erased.',
 init:()=>({f:0}),
 ui:[...P7_PLAY_UI],
 on:{...P7_player(()=>300)},
 draw(s,f,X){
  const sim=P7_demonSim(),fi=P7_frame(s,X,300),cur=sim.frames[fi];
  let out=heading('Maxwell’s demon sorts fast from slow');
  out+=R(28,58,404,234,'#fff',C.ink,4)+L(230,60,230,150,C.ink,3)+L(230,200,230,290,C.ink,3)+R(222,150,16,50,cur.open?'#fff':'#8a99a3','none',3);
  out+=Ci(230,138,9,C.purple)+TF(230,124,'demon',13,C.purple);
  for(let i=0;i<sim.n;i++){const v=cur.sp[i];out+=Ci(30+cur.pos[2*i],60+cur.pos[2*i+1],4,v>sim.cut?C.coral:C.blue)}
  out+=TF(130,314,'left: mean energy '+cur.eL.toFixed(2),13,C.blue)+TF(330,314,'right: mean energy '+cur.eR.toFixed(2),13,C.coral);
  out+=R(450,64,130,228,'#fff',C.grid,10)+TB(515,90,'Memory',15,C.ink)+TF(515,114,'bits recorded',13,C.muted)+TB(515,140,cur.bits,18,C.purple);
  out+=TF(515,176,'erasing them costs',13,C.muted)+TF(515,194,'at least',13,C.muted)+TB(515,218,cur.bits+' × k ln 2',14,C.ink)+TF(515,242,'of entropy',13,C.muted);
  out+=TF(515,276,'(Landauer 1961)',13,C.muted);
  out+=TF(230,346,'Idealised: the door costs no energy to move; only the memory has a price.',13,C.muted);
  return {svg:out,phase:`The right side’s mean energy (temperature) rises to ${cur.eR.toFixed(2)} while the left falls to ${cur.eL.toFixed(2)}: a temperature difference from nothing? No: every decision is a bit of information, and erasing ${cur.bits} bits produces at least as much entropy as the sorting removed.`};
 }});
let P7_DEMON=null;
function P7_demonSim(){
 if(P7_DEMON)return P7_DEMON;
 const n=40,W=400,H=230,r=4,rr=rng(41),x=[],y=[],vx=[],vy=[],sig=1.3;
 for(let i=0;i<n;i++){x.push(r+rr()*(W-2*r));y.push(r+rr()*(H-2*r));const sp=sig*Math.sqrt(-2*Math.log(1-rr())),a=6.283*rr();vx.push(sp*Math.cos(a));vy.push(sp*Math.sin(a))}
 const sp0=x.map((_,i)=>Math.hypot(vx[i],vy[i])),cut=[...sp0].sort((a,b)=>a-b)[n/2];
 const frames=[];let bits=0,open=false;
 for(let f=0;f<300;f++){
  let eL=0,nL=0,eR=0,nR=0;for(let i=0;i<n;i++){const e=(vx[i]**2+vy[i]**2)/2;if(x[i]<W/2){eL+=e;nL++}else{eR+=e;nR++}}
  const pos=new Float32Array(2*n),sp=new Float32Array(n);for(let i=0;i<n;i++){pos[2*i]=x[i];pos[2*i+1]=y[i];sp[i]=Math.hypot(vx[i],vy[i])}
  frames.push({pos,sp,eL:nL?eL/nL:0,eR:nR?eR/nR:0,bits,open});open=false;
  for(let k=0;k<2;k++)for(let i=0;i<n;i++){
   const ox=x[i];x[i]+=vx[i];y[i]+=vy[i];
   if(x[i]<r){x[i]=2*r-x[i];vx[i]=-vx[i]}if(x[i]>W-r){x[i]=2*(W-r)-x[i];vx[i]=-vx[i]}
   if(y[i]<r){y[i]=2*r-y[i];vy[i]=-vy[i]}if(y[i]>H-r){y[i]=2*(H-r)-y[i];vy[i]=-vy[i]}
   const crossing=(ox<W/2)!==(x[i]<W/2);
   if(crossing){const atDoor=y[i]>90&&y[i]<140,fast=Math.hypot(vx[i],vy[i])>cut,toRight=vx[i]>0;
    if(atDoor)bits++;
    const allow=atDoor&&(toRight?fast:!fast);if(allow)open=true;else{x[i]=2*(W/2)-x[i];vx[i]=-vx[i]}}
  }
 }
 P7_DEMON={n,frames,cut};return P7_DEMON;
}

/* ======================= Lesson: Heat engines ======================= */
function P7_carnot(Th,Tc){const g=5/3,V1=1,V2=2.2,V3=V2*(Th/Tc)**(1/(g-1)),V4=V1*(Th/Tc)**(1/(g-1));
 const iso=(T,Va,Vb)=>range(21).map(i=>{const V=Va+(Vb-Va)*i/20;return [V,P7_R*T/V]}),adi=(Va,Vb,pa)=>range(21).map(i=>{const V=Va+(Vb-Va)*i/20;return [V,pa*(Va/V)**g]});
 const legs=[iso(Th,V1,V2),adi(V2,V3,P7_R*Th/V2),iso(Tc,V3,V4),adi(V4,V1,P7_R*Tc/V4)];
 const Qh=P7_R*Th*Math.log(V2/V1),Qc=P7_R*Tc*Math.log(V3/V4);return {legs,Qh,Qc,W:Qh-Qc,V3,eta:1-Tc/Th}}
SCENE({id:'heat-engines',name:'The Carnot cycle',tag:'The best any heat engine can do',
 definition:'A heat engine takes heat from a hot source, turns some into work and dumps the rest into a cold sink. Sadi Carnot (1824) imagined the ideal cycle: expand at the hot temperature, expand without heat exchange, compress at the cold temperature, compress back. The work is the area enclosed on a pressure–volume graph.',
 example:'Between 600 K and 300 K, even a perfect Carnot engine converts at most half the heat it takes in into work: efficiency 1 − Tc/Th = 50%.',
 research:'Carnot, S. (1824). Réflexions sur la puissance motrice du feu. Clapeyron, É. (1834): the cycle on a pressure–volume diagram. Clausius, R. (1850).',
 desc:'A piston cylinder that touches a hot reservoir, insulation and a cold reservoir in turn, beside a pressure–volume diagram tracing the four strokes of the Carnot cycle with the enclosed work shaded.',
 dur:14,hint:'Set the hot and cold temperatures, then Step through the four strokes. The enclosed area is the work; the efficiency depends only on the temperatures.',
 init:()=>({Th:600,Tc:300}),
 ui:[{range:'Th',label:'Hot',min:400,max:900,step:25,get:s=>s.Th,act:'Th',show:v=>v+' K'},{range:'Tc',label:'Cold',min:250,max:380,step:10,get:s=>s.Tc,act:'Tc',show:v=>v+' K'}],
 on:{Th(s,v){s.Th=v},Tc(s,v){s.Tc=v}},
 trace(s){const fr=[{leg:-1,u:0,say:'One mole of an ideal gas in a cylinder, ready to touch the hot reservoir.'}];
  const says=['1 · Isothermal expansion at the hot temperature: heat flows in, the gas pushes the piston out.','2 · Adiabatic expansion: insulated, the gas keeps pushing and cools to the cold temperature.','3 · Isothermal compression at the cold temperature: work is done on the gas and waste heat flows out.','4 · Adiabatic compression: insulated again, squeezing warms the gas back to the hot temperature.'];
  for(let l=0;l<4;l++)for(let k=1;k<=4;k++)fr.push({leg:l,u:k/4,say:says[l]});fr.push({leg:4,u:1,say:'The cycle is complete. The net work is the area enclosed by the loop.'});return fr},
 draw(s,f,X){
  const c=P7_carnot(s.Th,s.Tc),allPts=c.legs.flat(),Vmax=Math.max(...allPts.map(p=>p[0]))*1.08,pmax=Math.max(...allPts.map(p=>p[1]))*1.1;
  let out=heading('The Carnot cycle: hot in, work out, waste heat out');
  const pl=P7_plot(270,64,300,232,{x0:0,x1:Vmax,y0:0,y1:pmax,xticks:[],yticks:[],xlab:'volume →',ylab:'pressure'});out+=pl.svg;
  const cols=[C.coral,C.purple,C.blue,C.green];
  if(f.leg>=4)out+=`<polygon points="${allPts.map(p=>fmt(pl.px(p[0]))+','+fmt(pl.py(p[1]))).join(' ')}" fill="${C.amberp}" stroke="none"/>`;
  c.legs.forEach((leg,l)=>{out+=P7_poly(leg.map(p=>[pl.px(p[0]),pl.py(p[1])]),l<=f.leg-1||f.leg>=4?cols[l]:'#dfe7ec',l===f.leg?4:2.5)});
  let pV=c.legs[0][0];if(f.leg>=0&&f.leg<4){const leg=c.legs[f.leg],k=Math.round(f.u*20);pV=leg[k];out+=P7_poly(leg.slice(0,k+1).map(p=>[pl.px(p[0]),pl.py(p[1])]),cols[f.leg],4)}
  out+=Ci(pl.px(pV[0]),pl.py(pV[1]),7,C.ink);
  // cylinder
  const pist=90+130*(pV[0]/Vmax);out+=R(40,90,90,230,'#fff',C.ink,3)+R(42,90,86,pist-90+2,'#e1eef7','none',0)+R(36,pist,98,12,'#8a99a3','none',2)+L(85,pist+12,85,340,'#8a99a3',5);
  const res=f.leg===0?['hot '+s.Th+' K',C.coral]:f.leg===2?['cold '+s.Tc+' K',C.blue]:['insulated','#8a99a3'];
  out+=R(30,58,110,26,res[1],'none',6,'opacity=".9"')+TB(85,76,res[0],13,'#fff');
  out+=TF(200,140,'heat in',13,C.coral)+TB(200,160,c.Qh.toFixed(0)+' J',14,C.coral)+TF(200,200,'work out',13,C.amber)+TB(200,220,c.W.toFixed(0)+' J',14,C.amber)+TF(200,260,'heat out',13,C.blue)+TB(200,280,c.Qc.toFixed(0)+' J',14,C.blue);
  out+=TBF(420,330,`efficiency = W/Q_hot = 1 − ${s.Tc}/${s.Th} = ${(c.eta*100).toFixed(0)}%`,15,C.green);
  return {svg:out,phase:f.say};
 }});

const P7_ENGINES=[['power','Coal or gas steam plant',820,300,'about 35–45%'],['geo','Geothermal plant',450,300,'about 10–20%'],['otec','Ocean thermal plant',298,278,'about 2–3%']];
SCENE({id:'heat-engines-limit',name:'The efficiency limit',tag:'Why power stations waste most of their heat',
 definition:'No engine working between a hot and a cold temperature can beat the Carnot efficiency, 1 − T_cold/T_hot, with temperatures in kelvin. Real engines fall short because of friction, finite heat flow and other losses.',
 example:'A steam turbine at 820 K exhausting at 300 K has a Carnot limit of 63%; real plants manage roughly 35–45%. An ocean plant using 25 °C surface water and 5 °C deep water is limited to under 7%.',
 research:'Carnot, S. (1824). Thomson, W. (Kelvin) (1851) and Clausius, R. (1850): the second law limits every heat engine.',
 desc:'Sliders for hot and cold temperatures drive a flow diagram: 100 units of heat in, the Carnot share turned into work and the rest rejected, with presets for real plants and their typical efficiencies.',
 dur:10,hint:'Move the temperatures or pick a real plant. Only a larger temperature difference raises the ceiling.',
 init:()=>({Th:820,Tc:300,pre:'power'}),
 watch(p){const e=P7_ENGINES[Math.min(2,Math.floor(p*3))];return {Th:e[2],Tc:e[3],pre:e[0]}},
 ui:[{choose:P7_ENGINES.map(e=>[e[0],e[1]]),label:'Example',get:s=>s.pre,act:'pre'},{range:'Th',label:'Hot',min:280,max:1500,step:10,get:s=>s.Th,act:'Th',show:v=>v+' K'},{range:'Tc',label:'Cold',min:250,max:400,step:5,get:s=>s.Tc,act:'Tc',show:v=>v+' K'}],
 on:{pre(s,v){const e=P7_ENGINES.find(e=>e[0]===v);s.pre=v;s.Th=e[2];s.Tc=e[3]},Th(s,v){s.Th=Math.max(v,s.Tc+5);s.pre=''},Tc(s,v){s.Tc=Math.min(v,s.Th-5);s.pre=''}},
 draw(s){
  const eta=1-s.Tc/s.Th,e=P7_ENGINES.find(x=>x[0]===s.pre);let out=heading('The Carnot limit: 1 − T_cold / T_hot');
  out+=R(40,70,120,60,C.coral,'none',10)+TB(100,98,'hot source',14,'#fff')+TF(100,118,s.Th+' K ('+Math.round(s.Th-273)+' °C)',13,'#fff');
  out+=R(40,270,120,60,C.blue,'none',10)+TB(100,298,'cold sink',14,'#fff')+TF(100,318,s.Tc+' K ('+Math.round(s.Tc-273)+' °C)',13,'#fff');
  out+=Ci(100,200,34,'#fff',C.ink)+TB(100,205,'engine',13,C.ink);
  const w=v=>4+40*v;out+=L(100,130,100,166,C.coral,w(1))+L(100,234,100,270,C.blue,w(1-eta))+L(134,200,300,200,C.amber,w(eta))+`<polygon points="300,${200-w(eta)/2-6} 318,200 300,${200+w(eta)/2+6}" fill="${C.amber}"/>`;
  out+=TF(124,152,'100 J in',13,C.ink,'start')+TF(124,256,(100*(1-eta)).toFixed(0)+' J wasted (at best)',13,C.ink,'start')+TB(220,186,(100*eta).toFixed(0)+' J work',14,C.amber);
  out+=R(350,70,220,262,'#fff',C.grid,10)+TB(460,96,'Efficiency ceiling',15,C.ink)+R(380,110,40,200,'#eef3f6','none',6)+R(380,110+200*(1-eta),40,200*eta,C.green,'none',6);
  out+=TB(470,170,(eta*100).toFixed(1)+'%',22,C.green,'start')+TF(470,192,'Carnot limit',13,C.muted,'start');
  if(e)out+=TF(470,236,'real plants:',13,C.muted,'start')+TB(470,256,e[4],13,C.ink,'start')+TF(470,276,'(typical, approximate)',13,C.muted,'start');
  return {svg:out,phase:`Between ${s.Th} K and ${s.Tc} K no engine can convert more than ${(eta*100).toFixed(0)}% of its heat into work, however clever. ${e?`A real ${e[1].toLowerCase()} achieves ${e[4]}.`:'Raising the hot temperature or lowering the cold one is the only way to raise the ceiling.'}`};
 }});

SCENE({id:'heat-engines-heat-pump',name:'Heat pumps and refrigerators',tag:'Running the engine backwards',
 definition:'Run a heat engine backwards and work moves heat from cold to hot: a refrigerator or heat pump. For heating, the ideal coefficient of performance is T_hot/(T_hot − T_cold): it delivers several units of heat for each unit of electrical work, because most of the heat is moved, not made.',
 example:'Heating a home to 20 °C (293 K) from 5 °C (278 K) outside, an ideal heat pump delivers 293/15 ≈ 19.5 units of heat per unit of work; real ones manage around 3 to 4 in mild weather.',
 research:'Thomson, W. (Kelvin) (1852). On the economy of the heating or cooling of buildings by means of currents of air: the first proposal of a heat pump.',
 desc:'A house with a heat pump: an arrow of electrical work goes in, heat drawn from the cold outdoors joins it, and a wider arrow of heat flows into the house; a gauge shows the ideal and a typical real coefficient of performance.',
 dur:10,hint:'Change the indoor and outdoor temperatures. The smaller the gap, the more heat each unit of electricity moves.',
 init:()=>({tin:20,tout:5}),
 watch(p){return {tin:20,tout:Math.round(lerp(15,-15,smooth(p)))}},
 ui:[{range:'tin',label:'Indoors',min:15,max:25,get:s=>s.tin,act:'tin',show:v=>v+' °C'},{range:'tout',label:'Outdoors',min:-20,max:14,get:s=>s.tout,act:'tout',show:v=>v+' °C'}],
 on:{tin(s,v){s.tin=v},tout(s,v){s.tout=v}},
 draw(s){
  const Th=s.tin+273.15,Tc=s.tout+273.15,cop=Th/(Th-Tc),real=Math.max(1.5,Math.min(5,cop*.45));
  let out=heading('A heat pump moves heat uphill');
  out+=P('M330 150L440 80L550 150V320H330Z',C.ink,2.5,'#fff7ee')+TB(440,190,'indoors '+s.tin+' °C',14,C.coral);
  out+=R(30,250,140,80,'#e1eef7','none',10)+TB(100,284,'outdoors',14,C.blue)+TF(100,304,s.tout+' °C',14,C.blue);
  out+=Ci(250,240,30,'#fff',C.ink)+TB(250,245,'pump',13,C.ink);
  const w=v=>Math.min(30,3+v*5);
  out+=L(250,120,250,208,C.amber,w(1))+TF(262,140,'1 unit of work',13,C.amber,'start');
  out+=L(170,270,220,250,C.blue,w(real-1))+TF(140,236,(real-1).toFixed(1)+' from outside',13,C.blue);
  out+=L(280,240,340,240,C.coral,w(real))+`<polygon points="340,${240-w(real)/2-6} 356,240 340,${240+w(real)/2+6}" fill="${C.coral}"/>`+TF(300,276,real.toFixed(1)+' units of heat in',13,C.coral,'start');
  out+=R(30,70,200,120,'#fff',C.grid,10)+TB(130,94,'Coefficient of performance',13,C.ink)+TF(130,122,'ideal: '+cop.toFixed(1),15,C.green)+TF(130,148,'typical real: ≈ '+real.toFixed(1),15,C.coral)+TF(130,172,'(illustrative estimate)',13,C.muted);
  out+=TF(300,350,'A resistance heater gives exactly 1 unit of heat per unit of electricity.',13,C.muted);
  return {svg:out,phase:`To heat to ${s.tin} °C from ${s.tout} °C the ideal COP is ${Th.toFixed(0)}/(${Th.toFixed(0)} − ${Tc.toFixed(0)}) = ${cop.toFixed(1)}. Real machines reach roughly half of that, still several times better than burning the electricity in a heater.`};
 }});

/* ======================= Lesson: Changes of phase ======================= */
const P7_W={cIce:2.1,Lf:334,cW:4.18,Lv:2257,cS:2.0};
function P7_heatCurve(Q){const a=P7_W.cIce*20,b=a+P7_W.Lf,c=b+P7_W.cW*100,d=c+P7_W.Lv,e=d+P7_W.cS*20;
 if(Q<=a)return {T:-20+Q/P7_W.cIce,ph:'ice'};if(Q<=b)return {T:0,ph:'melting',frac:(Q-a)/P7_W.Lf};if(Q<=c)return {T:(Q-b)/P7_W.cW,ph:'water'};if(Q<=d)return {T:100,ph:'boiling',frac:(Q-c)/P7_W.Lv};return {T:100+(Q-d)/P7_W.cS,ph:'steam',max:e}}
const P7_QMAX=P7_W.cIce*20+P7_W.Lf+P7_W.cW*100+P7_W.Lv+P7_W.cS*20;
SCENE({id:'phase-changes',name:'Melting and boiling',tag:'Heat in, temperature flat',
 definition:'While a substance melts or boils, the heat going in breaks bonds between particles rather than speeding them up, so the temperature stays flat. The energy needed per kilogram is the latent heat.',
 example:'Melting 1 kg of ice at 0 °C takes 334 kJ, enough to warm the same water from 0 °C to 80 °C. Boiling it away at 100 °C takes 2257 kJ, more than five times as much again.',
 research:'Black, J. (1761 onwards): latent heat, from experiments on melting ice and boiling water. Modern values: specific latent heats of fusion 334 kJ/kg and vaporisation 2257 kJ/kg.',
 desc:'A heating curve for 1 kg of water from −20 °C ice to 120 °C steam, with flat plateaus at 0 °C and 100 °C, beside a particle picture that changes from a lattice to a jumble to a sparse gas.',
 dur:12,hint:'Slide the energy added. Watch the temperature stall on the plateaus while the particle picture changes.',
 init:()=>({Q:500}),
 watch(p){return {Q:p*P7_QMAX}},
 ui:[{range:'Q',label:'Energy added',min:0,max:Math.round(P7_QMAX),step:10,get:s=>s.Q,act:'Q',show:v=>v+' kJ'}],
 on:{Q(s,v){s.Q=v}},
 draw(s){
  const st=P7_heatCurve(s.Q);let out=heading('Heating 1 kg of ice until it becomes steam');
  const pl=P7_plot(70,64,330,240,{x0:0,x1:P7_QMAX,y0:-30,y1:130,xticks:[0,1000,2000,3000],yticks:[-20,0,50,100],xlab:'energy added (kJ)',ylab:'temperature (°C)'});out+=pl.svg;
  out+=P7_poly(range(201).map(i=>{const q=i/200*P7_QMAX;return [pl.px(q),pl.py(P7_heatCurve(q).T)]}),C.line,2.5);
  out+=P7_poly(range(201).map(i=>i/200*s.Q).map(q=>[pl.px(q),pl.py(P7_heatCurve(q).T)]),C.coral,3.5)+Ci(pl.px(s.Q),pl.py(st.T),7,C.coral);
  out+=TF(pl.px(200),pl.py(0)-8,'melting 334 kJ',13,C.blue,'start')+TF(pl.px(1900),pl.py(100)-8,'boiling 2257 kJ',13,C.blue);
  // particles
  out+=R(420,64,160,160,'#fff',C.grid,10);const r=rng(9),bx=430,by=74;
  const solid=st.ph==='ice'?1:st.ph==='melting'?1-st.frac:0,gas=st.ph==='steam'?1:st.ph==='boiling'?st.frac:0;
  for(let i=0;i<5;i++)for(let j=0;j<5;j++){const k=i*5+j,isGas=k/25<gas,isSolid=k/25<solid;let x=bx+20+j*28,y=by+20+i*28;
   if(!isSolid){x=bx+12+r()*136;y=by+(isGas?12+r()*136:60+r()*80)}if(isGas&&!isSolid&&(k%3))continue;out+=Ci(x,y,6,isSolid?'#9cc7e6':isGas?C.coral:C.blue)}
  out+=TB(500,246,{ice:'ice',melting:'melting',water:'liquid water',boiling:'boiling',steam:'steam'}[st.ph],15,C.ink)+TB(500,272,st.T.toFixed(1)+' °C',16,C.coral);
  out+=TF(500,300,'Idealised: steady pressure,',13,C.muted)+TF(500,316,'no heat lost',13,C.muted);
  return {svg:out,phase:st.ph==='melting'||st.ph==='boiling'?`On the plateau the temperature holds at ${st.T} °C: energy is breaking bonds between molecules, not speeding them up (${Math.round(st.frac*100)}% done).`:`In the ${st.ph} phase, added energy raises the temperature: the slope depends on the specific heat capacity.`};
 }});

// Water vapour pressure (Antoine), Pa → boiling temperature in °C for a given pressure.
function P7_boilT(pPa){const mm=pPa/133.322;const A=mm<=760?[8.07131,1730.63,233.426]:[8.14019,1810.94,244.485];return A[1]/(A[0]-Math.log10(mm))-A[2]}
function P7_vapP(T){const A=T<=100?[8.07131,1730.63,233.426]:[8.14019,1810.94,244.485];return 133.322*10**(A[0]-A[1]/(A[2]+T))}
const P7_PLACES=[['sea','Sea level',0,0],['everest','Summit of Everest',8849,0],['cooker','Pressure cooker',0,1]];
SCENE({id:'phase-changes-diagram',name:'The phase diagram of water',tag:'Boiling point depends on pressure',
 definition:'A phase diagram maps which phase (solid, liquid or gas) is stable at each pressure and temperature. Along the boiling curve, liquid and vapour coexist; lower the pressure and water boils at a lower temperature. All three phases meet at the triple point.',
 example:'On the summit of Everest air pressure is about a third of sea level and water boils at roughly 70 °C, too cool to cook pasta well. A pressure cooker at about two atmospheres reaches about 120 °C.',
 research:'Clapeyron, É. (1834) and Clausius, R. (1850): the slope of the coexistence curve. Triple point of water: 0.01 °C and 611.657 Pa. Vapour pressure from the Antoine equation (empirical fit).',
 desc:'Pressure (log scale) against temperature for water, with regions for ice, liquid and vapour, the triple and critical points, and a marker showing the boiling point at sea level, on Everest or in a pressure cooker.',
 dur:12,hint:'Change the altitude, or pick a place. The marker slides along the boiling curve.',
 init:()=>({h:0,extra:0,pre:'sea'}),
 watch(p){const k=Math.min(2,Math.floor(p*3)),e=P7_PLACES[k];return {h:e[2],extra:e[3],pre:e[0]}},
 ui:[{choose:P7_PLACES.map(p=>[p[0],p[1]]),label:'Place',get:s=>s.pre,act:'pre'},{range:'h',label:'Altitude',min:0,max:8849,step:50,get:s=>s.h,act:'h',show:v=>v+' m'}],
 on:{pre(s,v){const e=P7_PLACES.find(x=>x[0]===v);s.pre=v;s.h=e[2];s.extra=e[3]},h(s,v){s.h=v;s.extra=0;s.pre=''}},
 draw(s){
  const p=101325*Math.exp(-s.h/8434)+s.extra*101325,Tb=P7_boilT(p);let out=heading('Water: which phase where?');
  const lp=v=>Math.log10(v),pl=P7_plot(80,60,330,250,{x0:-40,x1:400,y0:2,y1:8,xticks:[0,100,200,300,400],yticks:[2,3,4,5,6,7,8],xlab:'temperature (°C)',ylab:'pressure (Pa, log scale)',yfmt:v=>'10'+String(v).split('').map(c=>P7_SUP[c]).join('')});out+=pl.svg;
  const subl=range(31).map(i=>{const T=-40+i/30*40.01,Tk=T+273.15;return [T,611.657*Math.exp(-2.834e6/461.5*(1/Tk-1/273.16))]});
  const boil=range(61).map(i=>{const T=0.01+i/60*(373.946-0.01);return [T,Math.min(P7_vapP(T),22.064e6)]});
  const melt=[[0.01,611.657],[-8,1e8]];
  out+=P7_poly(subl.map(q=>[pl.px(q[0]),pl.py(lp(q[1]))]),C.ink,2.5)+P7_poly(boil.map(q=>[pl.px(q[0]),pl.py(lp(q[1]))]),C.ink,2.5)+P7_poly(melt.map(q=>[pl.px(q[0]),pl.py(lp(q[1]))]),C.ink,2.5);
  out+=TB(pl.px(-22),pl.py(6.6),'ice',15,'#5b8db5')+TB(pl.px(150),pl.py(7.2),'liquid',15,C.blue)+TB(pl.px(260),pl.py(3.4),'vapour',15,C.coral);
  out+=Ci(pl.px(.01),pl.py(lp(611.657)),5,C.purple)+TF(pl.px(8),pl.py(lp(611.657))+16,'triple point',13,C.purple,'start');
  out+=Ci(pl.px(373.946),pl.py(lp(22.064e6)),5,C.purple)+TF(pl.px(370),pl.py(lp(22.064e6))-10,'critical point',13,C.purple,'end');
  out+=L(pl.px(-40),pl.py(lp(p)),pl.px(Tb),pl.py(lp(p)),C.coral,1.5,'stroke-dasharray="4 4"')+Ci(pl.px(Tb),pl.py(lp(p)),7,C.coral);
  out+=R(430,70,150,180,'#fff',C.grid,10)+TB(505,96,'Boiling point',15,C.ink)+TF(505,124,(p/1000).toFixed(1)+' kPa',14,C.muted)+TB(505,160,Tb.toFixed(0)+' °C',24,C.coral);
  out+=TF(505,196,s.extra?'cooker: +1 atm':'altitude '+s.h+' m',13,C.muted)+TF(505,226,'(approximate)',13,C.muted);
  return {svg:out,phase:`At ${(p/1000).toFixed(0)} kPa water boils at about ${Tb.toFixed(0)} °C: the liquid’s molecules need only push back against a lower outside pressure. Above the critical point (374 °C, 22 MPa) liquid and vapour stop being different.`};
 }});

SCENE({id:'phase-changes-evaporation',name:'Evaporation cools',tag:'The fastest molecules escape first',
 definition:'At a liquid’s surface, only molecules moving fast enough can break free. Their escape lowers the average energy of those left behind, so an evaporating liquid cools: the reason sweating works.',
 example:'Evaporating 100 g of sweat removes about 240 kJ from the skin, roughly the energy needed to warm 1 kg of water by nearly 60 °C.',
 research:'Maxwell, J. C. (1860) and Boltzmann, L. (1872): the speed distribution that gives escaping molecules their high-energy tail. Latent heat of vaporisation of water at skin temperature ≈ 2.4 MJ/kg.',
 desc:'A Maxwell–Boltzmann speed distribution for a liquid’s molecules with an escape threshold; molecules above it leave, and the average energy (temperature) of the remaining molecules falls.',
 dur:10,hint:'Move the escape threshold. A lower threshold lets more molecules escape and cools the liquid more.',
 init:()=>({cut:2.2}),
 watch(p){return {cut:lerp(3,1.6,smooth(p))}},
 ui:[{range:'cut',label:'Escape speed',min:1.4,max:3.2,step:.05,get:s=>s.cut,act:'cut',show:v=>v.toFixed(2)+' × typical'}],
 on:{cut(s,v){s.cut=v}},
 draw(s){
  // 3D Maxwell–Boltzmann in units where the most probable speed is 1: f(v) ∝ v² e^{−v²}
  const fv=v=>v*v*Math.exp(-v*v),N=600,dv=4/N;let tot=0,totE=0,esc=0,escE=0;
  for(let i=0;i<N;i++){const v=(i+.5)*dv,w=fv(v)*dv;tot+=w;totE+=w*v*v;if(v>s.cut){esc+=w;escE+=w*v*v}}
  const frac=esc/tot,meanAll=totE/tot,meanLeft=(totE-escE)/(tot-esc),drop=1-meanLeft/meanAll;
  let out=heading('Only the fastest molecules escape');
  const pl=P7_plot(70,64,330,240,{x0:0,x1:3.6,y0:0,y1:.45,xticks:[0,1,2,3],xfmt:v=>v===1?'typical':v===0?'0':v+'×',yticks:[],xlab:'molecular speed',ylab:'share of molecules'});out+=pl.svg;
  const curve=range(91).map(i=>{const v=i/90*3.6;return [pl.px(v),pl.py(fv(v))]});
  out+=`<polygon points="${[[pl.px(s.cut),pl.py(0)],...curve.filter(q=>q[0]>=pl.px(s.cut)),[pl.px(3.6),pl.py(0)]].map(q=>fmt(q[0])+','+fmt(q[1])).join(' ')}" fill="${C.coralp}" stroke="none"/>`;
  out+=P7_poly(curve,C.blue,3)+L(pl.px(s.cut),64,pl.px(s.cut),304,C.coral,2,'stroke-dasharray="5 4"')+TF(pl.px(s.cut)+6,84,'escape',13,C.coral,'start');
  out+=R(420,64,160,240,'#fff',C.grid,10)+TB(500,90,'After escape',15,C.ink);
  out+=TF(500,120,'molecules leaving:',13,C.muted)+TB(500,142,(frac*100).toFixed(2)+'%',16,C.coral);
  out+=TF(500,176,'their share of energy:',13,C.muted)+TB(500,198,(escE/totE*100).toFixed(1)+'%',16,C.coral);
  out+=TF(500,232,'mean energy of the rest:',13,C.muted)+TB(500,256,'−'+(drop*100).toFixed(2)+'%',18,C.blue);
  out+=TF(500,286,'Idealised, one-off escape',13,C.muted);
  return {svg:out,phase:`Only ${(frac*100).toFixed(1)}% of the molecules are fast enough to leave, but they carry ${(escE/totE*100).toFixed(1)}% of the energy. The rest are slower on average: the liquid’s temperature drops by about ${(drop*100).toFixed(1)}% of its absolute value until heat flows back in.`};
 }});
