/* ===================== Physics era 3 · Energy and momentum ===================== */
// Every simulation here is a pure function of its parameters and the time s.t: trajectories are integrated
// once with a fixed step (1/240 s) and cached, so Watch, rewind and Try it always show the same picture.
const P3_G=9.81;
function P3_n(v,d=1){if(!isFinite(v))return '—';const r=Number(Number(v).toFixed(d));return (Object.is(r,-0)?0:r).toLocaleString('en-GB',{maximumFractionDigits:d})}
const P3_CACHE=new Map();
function P3_memo(key,fn){if(!P3_CACHE.has(key)){if(P3_CACHE.size>80)P3_CACHE.clear();P3_CACHE.set(key,fn())}return P3_CACHE.get(key)}
// Try it playback: Release / Pause / Restart advance s.t in fixed 1/30 s steps on a timer.
const P3_PLAY_UI=[{b:'▶ Release',act:'go'},{b:'❚❚ Pause',act:'pause'},{b:'⟲ Restart',act:'restart'}];
function P3_play(Tf,step=1/30){const T=s=>typeof Tf==='function'?Tf(s):Tf;return {
 go(s,a,ctx){s.run=(s.run||0)+1;if(s.t>=T(s)-1e-9)s.t=0;ctx.every(33,'tick',s.run)},
 tick(s,tok){if(Number(tok)!==s.run)return 'stop';s.t=Math.min(T(s),s.t+step);if(s.t>=T(s)){s.run++;return 'stop'}},
 pause(s){s.run=(s.run||0)+1},
 restart(s){s.run=(s.run||0)+1;s.t=0}}}
// Vertical bars (signed values go below the base line).
function P3_bars(x,base,items,max,H=140,w=40,gap=14){let o='';items.forEach((it,i)=>{const bx=x+i*(w+gap),h=max>0?clamp(Math.abs(it.v)/max,0,1.1)*H:0,neg=it.v<0;
 o+=R(bx,neg?base:base-h,w,h,it.col,'none',4)+TF(bx+w/2,neg?base+h+15:base-h-6,P3_n(it.v,it.d===undefined?1:it.d),13,C.ink)+TF(bx+w/2,neg?base-8:base+17,it.l,13,C.muted)});
 return o+L(x-6,base,x+items.length*(w+gap)-gap+6,base,C.line,1.5)}
// A small line chart: o={xr,yr,series:[{pts,col,dash}],xt,yt,xl,yl,dots}
function P3_plot(x,y,w,h,o){
 const X=v=>x+(v-o.xr[0])/(o.xr[1]-o.xr[0])*w,Y=v=>y+h-(v-o.yr[0])/(o.yr[1]-o.yr[0])*h;let s=R(x,y,w,h,'#fff',C.grid,6);
 for(const t of o.yt||[])s+=L(x,Y(t),x+w,Y(t),C.grid,1)+TF(x-5,Y(t)+4,P3_n(t,2),13,C.muted,'end');
 for(const t of o.xt||[])s+=TF(X(t),y+h+15,P3_n(t,2),13,C.muted);
 if(o.yr[0]<0&&o.yr[1]>0)s+=L(x,Y(0),x+w,Y(0),C.line,1.5);
 for(const se of o.series){const pts=se.pts.filter(p=>isFinite(p[0])&&isFinite(p[1]));if(pts.length<2)continue;
  s+=`<polyline points="${pts.map(p=>fmt(X(p[0]))+','+fmt(clamp(Y(p[1]),y-1,y+h+1))).join(' ')}" fill="none" stroke="${se.col}" stroke-width="${se.w||2.5}" ${se.dash?'stroke-dasharray="'+se.dash+'"':''} stroke-linejoin="round"/>`}
 for(const d of o.dots||[])s+=Ci(X(d.x),clamp(Y(d.y),y,y+h),d.r||5,d.col);
 if(o.xl)s+=TF(x+w/2,y+h+31,o.xl,13,C.muted);if(o.yl)s+=TF(x+2,y-6,o.yl,13,C.muted,'start');return s}
function P3_spring(x1,y,x2,coils=10,amp=9){const lead=10,len=x2-x1-2*lead,n=coils*2;let d=`M${fmt(x1)} ${y} L${fmt(x1+lead)} ${y}`;
 for(let i=1;i<=n;i++)d+=` L${fmt(x1+lead+len*(i-.5)/n)} ${y+(i%2?-amp:amp)}`;return P(d+` L${fmt(x2-lead)} ${y} L${fmt(x2)} ${y}`,C.muted,2)}
// Damped pendulum, semi-implicit Euler, cached per parameter set: θ'' = −(g/L) sin θ − b θ'.
function P3_pend(deg,b,L,T){return P3_memo(`pend|${deg}|${b}|${L}|${T}`,()=>{const dt=1/480,n=Math.round(T/dt),out=new Float64Array(2*(n+1));let th=deg*Math.PI/180,w=0;out[0]=th;
 for(let i=1;i<=n;i++){w+=(-(P3_G/L)*Math.sin(th)-b*w)*dt;th+=w*dt;out[2*i]=th;out[2*i+1]=w}return {dt,n,out}})}
function P3_at(sim,t){const i=clamp(Math.round(t/sim.dt),0,sim.n);return [sim.out[2*i],sim.out[2*i+1]]}
function P3_K(k){let a=1,b=Math.sqrt(1-k*k);for(let i=0;i<30;i++){const a2=(a+b)/2;b=Math.sqrt(a*b);a=a2}return Math.PI/(2*a)} // complete elliptic integral K(k)

/* ---------- Work and energy ---------- */
SCENE({id:'work-energy',name:'Work',tag:'Force along the motion',
 definition:'Work is energy transferred by a force that moves something: the part of the force along the motion, times the distance moved. W = F d cos θ, in joules (J).',
 example:'Pushing a box 4 m with 20 N straight ahead does 80 J of work. Carry it level across a room and your upward force does no work on it, because that force is at right angles to the motion.',
 desc:'A box slides along the floor while a force pulls at an angle; dashed lines split the force into the part along the motion and the part across it, and a panel works out the work done.',
 research:'Coriolis (1829). Du calcul de l’effet des machines: named force × distance “travail” (work).',
 dur:10,hint:'Change the force, the distance and the angle. Try 90° (no work at all) and angles past 90°, where the force works against the motion.',
 init:()=>({F:20,d:4,ang:30}),
 watch(p){return {F:20,d:4,ang:Math.round(clamp(p*1.12,0,1)*150/5)*5,slide:(p*3)%1}},
 ui:[{range:'F',label:'Force (N)',min:0,max:60,get:s=>s.F,act:'F'},{range:'d',label:'Distance (m)',min:1,max:8,step:.5,get:s=>s.d,act:'d'},{range:'ang',label:'Angle (°)',min:0,max:180,step:5,get:s=>s.ang,act:'ang'}],
 on:{F(s,v){s.F=v},d(s,v){s.d=v},ang(s,v){s.ang=v}},
 draw(s){
  const th=s.ang*Math.PI/180,len=Math.min(150,s.F*2.6),y=245,x0=80,reach=Math.max(0,len*Math.cos(th)),sc=Math.min(80,(560-x0-reach-35)/s.d);
  const u=s.slide===undefined?1:smooth(s.slide),bx=x0+s.d*sc*u,cx=bx,cy=y-24,W=s.F*s.d*Math.cos(th);
  let o=heading('Work = force along the motion × distance');
  o+=L(30,y,575,y,C.line,3)+R(x0-30,y-48,60,48,'none',C.line,6,'stroke-dasharray="5 4"');
  o+=arrow(x0,y+20,x0+s.d*sc,y+20,C.green,2.5)+TF(x0+s.d*sc/2,y+40,`distance d = ${P3_n(s.d,1)} m`,14,C.green);
  o+=R(bx-30,y-48,60,48,C.pale,C.blue,6);
  if(s.F>0){const fx=cx+len*Math.cos(th),fy=cy-len*Math.sin(th);
   o+=L(cx,cy,fx,cy,C.blue,2,'stroke-dasharray="6 4"')+L(fx,cy,fx,fy,C.muted,1.6,'stroke-dasharray="4 4"');
   o+=arrow(cx,cy,fx,fy,C.coral,3.5)+TF(fx+(Math.cos(th)>=0?8:-8),Math.max(52,fy-6),`F = ${P3_n(s.F,0)} N`,14,C.coral,Math.cos(th)>=0?'start':'end');
   const ar=26;o+=P(`M${cx+ar} ${cy} A${ar} ${ar} 0 0 0 ${fmt(cx+ar*Math.cos(th))} ${fmt(cy-ar*Math.sin(th))}`,C.ink,1.4)+TF(cx+40*Math.cos(th/2),cy-40*Math.sin(th/2)+4,`${s.ang}°`,13,C.ink);}
  o+=R(40,305,520,56,W>0.05?C.greenp:W<-0.05?C.coralp:'#f1f5f7','none',10);
  o+=T(300,328,`W = F × d × cos θ = ${P3_n(s.F,0)} × ${P3_n(s.d,1)} × cos ${s.ang}° = ${P3_n(W,1)} J`,15,C.ink);
  o+=TF(300,350,s.ang===90?'Force at right angles to the motion: no energy is transferred.':W<-0.05?'Negative work: the force takes energy away from the box, as friction does.':'Positive work: the force gives the box energy.',13,C.muted);
  return {svg:o,phase:s.ang===90?'At 90° the force has no part along the motion, so it does no work. Holding a heavy bag still or carrying it level feels tiring, but your muscles are not doing work on the bag.':`Only the part of the force along the motion counts: ${P3_n(s.F,0)} N × cos ${s.ang}° = ${P3_n(s.F*Math.cos(th),1)} N, acting over ${P3_n(s.d,1)} m.`};
 }});

SCENE({id:'work-energy-kinetic',name:'Kinetic energy',tag:'Twice as fast, four times the energy',
 definition:'Kinetic energy is the energy of motion: KE = ½ m v². It grows with the square of speed, so doubling the speed quadruples the energy.',
 example:'A 2 kg ball at 3 m/s has 9 J of kinetic energy; at 6 m/s it has 36 J. Dropped into soft clay that resists with about the same force, the faster ball digs a dent about four times as deep.',
 desc:'A graph of kinetic energy against speed curves upwards; beside it, two balls fall into clay at speeds v and 2v and leave dents in the ratio one to four.',
 research:'’s Gravesande (1722) dropped brass balls into clay; Émilie du Châtelet (1740), Institutions de physique, used his results to argue for vis viva, mv².',
 dur:10,hint:'Change the mass and speed, or double the speed. Compare the two dents: depth tracks speed squared, not speed.',
 init:()=>({m:2,v:3}),
 watch(p){return {m:2,v:Math.round((1+4*smooth(p))*10)/10}},
 ui:[{range:'m',label:'Mass (kg)',min:.5,max:10,step:.5,get:s=>s.m,act:'m'},{range:'v',label:'Speed (m/s)',min:.5,max:5,step:.5,get:s=>s.v,act:'v'},{b:'Double the speed',act:'dbl'},{b:'Halve it',act:'half'}],
 on:{m(s,v){s.m=v},v(s,v){s.v=v},dbl(s){s.v=Math.min(10,s.v*2)},half(s){s.v=Math.max(.5,s.v/2)}},
 draw(s){
  const ke=v=>.5*s.m*v*v,k1=ke(s.v),k2=ke(2*s.v),vmax=10,ym=ke(vmax);let o=heading('Kinetic energy = ½ m v²');
  const pts=range(51).map(i=>[i/5,ke(i/5)]);
  o+=P3_plot(60,60,240,220,{xr:[0,vmax],yr:[0,ym],series:[{pts,col:C.blue}],xt:[0,5,10],yt:[0,ym/2,ym],xl:'speed (m/s)',yl:'KE (J)',dots:[{x:s.v,y:k1,col:C.blue,r:6},{x:Math.min(vmax,2*s.v),y:Math.min(ym,k2),col:C.coral,r:6}]});
  // Clay block: dent depth in proportion to v², so the 2v dent is always four times deeper.
  const top=210,d2=76,d1=d2/4;o+=R(345,top,230,110,'#c9a27a','none',8)+TF(460,top+128,'soft clay',13,C.muted);
  [[400,s.v,d1,C.blue,'v'],[520,2*s.v,d2,C.coral,'2v']].forEach(([x,v,d,col,l])=>{o+=`<path d="M${x-26} ${top} Q${x} ${top+2*d} ${x+26} ${top} Z" fill="#a9825b"/>`+Ci(x,top+d-13,13,col)+TF(x,top-50,`${l} = ${P3_n(v,1)} m/s`,13,col)+TF(x,top-32,`KE = ${P3_n(ke(v),1)} J`,13,col)+arrow(x,top-24,x,top-6,col,2,7)});
  o+=T(460,90,`${P3_n(k2,1)} J ÷ ${P3_n(k1,1)} J = 4`,17,C.ink,'middle','font-weight="650"')+TF(460,112,'double the speed → four times the energy',13,C.muted);
  return {svg:o,phase:`At ${P3_n(s.v,1)} m/s the ${P3_n(s.m,1)} kg ball carries ½ × ${P3_n(s.m,1)} × ${P3_n(s.v,1)}² = ${P3_n(k1,1)} J. Descartes had argued for m v as the measure of motion; the clay dents follow m v², the quantity Leibniz called vis viva.`};
 }});

const P3_POWER_T=24;
SCENE({id:'work-energy-power',name:'Power',tag:'How fast energy is transferred',
 definition:'Power is the rate of transferring energy: P = E ÷ t, in watts (1 W = 1 J per second).',
 example:'Climbing 3 m of stairs takes a 70 kg person about 2,060 J whether they walk or run. Walking it in 12 s is about 170 W; running it in 3 s is about 690 W, close to one horsepower (746 W).',
 desc:'Two people climb identical staircases, one walking and one running; bars show that the energy is the same and the power is not.',
 research:'Watt (c. 1782) defined the horsepower as 33,000 foot-pounds per minute, about 746 W; the watt is named after him.',
 dur:11,hint:'Set the climber’s mass and the two climbing times, then race. Same height, same energy; the faster climber delivers more power.',
 init:()=>({m:70,h:3,tw:12,tr:3,t:0}),
 watch(p){return {m:70,h:3,tw:12,tr:3,t:p*13}},
 ui:[{range:'m',label:'Mass (kg)',min:30,max:120,get:s=>s.m,act:'m'},{range:'tw',label:'Walker (s)',min:4,max:20,get:s=>s.tw,act:'tw'},{range:'tr',label:'Runner (s)',min:1,max:10,step:.5,get:s=>s.tr,act:'tr'},...P3_PLAY_UI],
 on:{m(s,v){s.m=v},tw(s,v){s.tw=v},tr(s,v){s.tr=v},...P3_play(s=>Math.max(s.tw,s.tr)+1)},
 draw(s){
  const E=s.m*P3_G*s.h,Pw=E/s.tw,Pr=E/s.tr;let o=heading('Same climb, same energy, different power');
  const stairs=(x0,col,prog,label,tm)=>{let d=`M${x0} 330`;for(let i=0;i<8;i++){d+=` V${330-(i+1)*28} H${x0+(i+1)*24}`}let r=P(d+` V330 Z`,C.line,1.5,'#eef3f6');
   const fx=x0+8+prog*184,fy=330-prog*224-14;r+=Ci(fx,fy-24,8,col)+L(fx,fy-16,fx,fy+6,col,4)+L(fx,fy+6,fx-6,fy+16,col,3)+L(fx,fy+6,fx+6,fy+16,col,3);
   return r+TF(x0+96,352,`${label}: ${P3_n(tm,1)} s`,14,col)};
  o+=stairs(30,C.blue,clamp(s.t/s.tw,0,1),'walker',s.tw)+stairs(250,C.coral,clamp(s.t/s.tr,0,1),'runner',s.tr);
  o+=TF(240,72,`height ${s.h} m`,13,C.muted);
  o+=P3_bars(478,250,[{l:'walker',v:Pw,col:C.blue,d:0},{l:'runner',v:Pr,col:C.coral,d:0}],Math.max(Pw,Pr),140,44,16);
  o+=TF(530,80,'power (W)',13,C.muted)+TF(530,290,`E = m g h = ${P3_n(E,0)} J`,13,C.ink)+TF(530,308,`each`,13,C.muted)+TF(530,328,`runner: ${P3_n(Pr/746,2)} hp`,13,C.coral);
  return {svg:o,phase:`Each climber gains m g h = ${P3_n(s.m,0)} × 9.81 × ${s.h} = ${P3_n(E,0)} J. Walking in ${P3_n(s.tw,1)} s needs ${P3_n(Pw,0)} W; running in ${P3_n(s.tr,1)} s needs ${P3_n(Pr,0)} W.`};
 }});

/* ---------- Conservation of energy ---------- */
const P3_SWING_T=12;
SCENE({id:'energy-conservation',name:'Conservation of energy',tag:'Energy changes form, the total stays',
 definition:'In a closed system energy is never created or destroyed; it only changes form. A swinging pendulum trades kinetic and potential energy, and friction turns some into heat.',
 example:'A 1 kg pendulum released at 50° from 2 m length starts with about 7 J of potential energy. At the bottom that is all kinetic energy; with air drag, a little becomes heat on every swing.',
 desc:'A pendulum swings beside bars for kinetic energy, potential energy and heat; a dashed outline marks the starting total, which the three bars always add up to.',
 research:'Helmholtz (1847). Über die Erhaltung der Kraft (On the conservation of force), building on Mayer (1842) and Joule.',
 dur:13,hint:'Set the release angle and the friction, then release. Watch kinetic and potential energy trade places while heat grows and the total stays put.',
 init:()=>({deg:50,b:.12,L:2,t:0}),
 watch(p){return {deg:50,b:.12,L:2,t:p*P3_SWING_T}},
 ui:[{range:'deg',label:'Release (°)',min:10,max:80,step:5,get:s=>s.deg,act:'deg'},{range:'b',label:'Friction',min:0,max:.5,step:.02,get:s=>s.b,act:'b',show:v=>v.toFixed(2)},...P3_PLAY_UI],
 on:{deg(s,v){s.deg=v;s.t=0},b(s,v){s.b=v;s.t=0},...P3_play(P3_SWING_T)},
 draw(s){
  const m=1,sim=P3_pend(s.deg,s.b,s.L,P3_SWING_T),[th,w]=P3_at(sim,s.t),E0=m*P3_G*s.L*(1-Math.cos(s.deg*Math.PI/180));
  // With no friction there is no heat; the integrator's tiny energy wobble (<0.3 %) is not shown as heat.
  const KE=.5*m*(s.L*w)**2,PE=m*P3_G*s.L*(1-Math.cos(th)),Q=s.b===0?0:Math.max(0,E0-KE-PE);let o=heading(`Kinetic + potential + heat = ${P3_n(E0,2)} J`);
  const px=150,py=60,lp=200,bx=px+lp*Math.sin(th),by=py+lp*Math.cos(th);
  o+=L(70,py,230,py,C.ink,3)+L(px,py,px,py+lp+20,C.grid,1,'stroke-dasharray="4 4"');
  const a0=s.deg*Math.PI/180;o+=Ci(px+lp*Math.sin(a0),py+lp*Math.cos(a0),12,'none',C.line,'stroke-dasharray="3 3"');
  o+=L(px,py,bx,by,C.ink,2)+Ci(bx,by,14,C.blue)+TF(px,py+lp+40,`t = ${P3_n(s.t,1)} s`,14,C.muted);
  o+=R(318,48,4*58-14+12,168,'none',C.ink,4,'stroke-dasharray="5 4"');
  o+=P3_bars(324,210,[{l:'kinetic',v:KE,col:C.blue,d:2},{l:'potential',v:PE,col:C.green,d:2},{l:'heat',v:Q,col:C.coral,d:2},{l:'total',v:KE+PE+Q,col:'#8aa1ae',d:2}],E0,140,44,14);
  // Energy history
  const pts=[[],[],[]];for(let t=0;t<=s.t+1e-9;t+=.05){const [a,b]=P3_at(sim,t),k=.5*m*(s.L*b)**2,pp=m*P3_G*s.L*(1-Math.cos(a));pts[0].push([t,k]);pts[1].push([t,pp]);pts[2].push([t,s.b===0?0:Math.max(0,E0-k-pp)])}
  o+=P3_plot(318,262,252,76,{xr:[0,P3_SWING_T],yr:[0,E0*1.05],series:[{pts:pts[0],col:C.blue,w:2},{pts:pts[1],col:C.green,w:2},{pts:pts[2],col:C.coral,w:2}],xl:'time (s)'});
  return {svg:o,phase:s.b===0?'With no friction, kinetic and potential energy swap back and forth and their sum never changes (idealised: no air resistance, rigid string).':`Friction turns a little of the swing into heat each time. Kinetic ${P3_n(KE,2)} J + potential ${P3_n(PE,2)} J + heat ${P3_n(Q,2)} J = ${P3_n(E0,2)} J, the starting total.`};
 }});

SCENE({id:'energy-conservation-joule',name:'Joule’s paddle wheel',tag:'Falling weights warm water',
 definition:'Joule showed that a fixed amount of mechanical work always produces the same amount of heat: about 4.18 J warms 1 g of water by 1 °C (one calorie).',
 example:'Weights of 13 kg falling 1.6 m release about 204 J. Churned into 6 kg of water by paddles, twenty drops warm it by only about 0.16 °C, which is why Joule needed very precise thermometers.',
 desc:'Two weights fall on cords that turn a paddle wheel inside an insulated tank of water; a thermometer beside it creeps up, and a panel computes joules per calorie.',
 research:'Joule (1850). On the mechanical equivalent of heat. Philosophical Transactions 140: 61–82 (772 foot-pounds per BTU, about 4.16 J per calorie).',
 dur:12,hint:'Drop the weights once or ten times. Add heat leakage to see how lost heat makes the estimate of joules per calorie come out too high. Values are illustrative.',
 init:()=>({m:13,h:1.6,M:6,n:0,leak:0,ph:1}),
 watch(p){const k=p*20;return {m:13,h:1.6,M:6,n:Math.floor(k),leak:0,ph:k%1}},
 ui:[{b:'Drop the weights',act:'drop'},{b:'Drop × 10',act:'drop10'},{range:'m',label:'Falling mass (kg)',min:2,max:30,get:s=>s.m,act:'m'},{range:'leak',label:'Heat leakage (%)',min:0,max:30,step:5,get:s=>s.leak,act:'leak'},{b:'Empty and refill',act:'clear'}],
 on:{drop(s,a,ctx){if(s.ph<1)return;s.ph=0;s.run=(s.run||0)+1;ctx.every(33,'fall',s.run)},fall(s,tok){if(Number(tok)!==s.run)return 'stop';s.ph=Math.min(1,s.ph+.05);if(s.ph>=1){s.n++;return 'stop'}},
  drop10(s){s.n+=10;s.ph=1},m(s,v){s.m=v},leak(s,v){s.leak=v},clear(s){s.n=0;s.ph=1;s.run=(s.run||0)+1}},
 draw(s){
  const c=4186,drops=s.n+(s.ph<1?s.ph:0),E=drops*s.m*P3_G*s.h,heat=E*(1-s.leak/100),dT=heat/(s.M*c),cal=s.M*1000*dT,Jcal=cal>0?E/cal:NaN;
  let o=heading('Mechanical work → heat: Joule’s paddle wheel');
  const tx=210,ty=190,tw=180,th=120,ang=drops*2.6;
  o+=R(tx-tw/2-8,ty-8,tw+16,th+16,'#d9c7a7','none',10)+R(tx-tw/2,ty,tw,th,'#cfe5f3','none',6)+TF(tx,ty+th+30,`${s.M} kg of water`,13,C.muted);
  for(let i=0;i<6;i++){const a=ang+i*Math.PI/3;o+=L(tx,ty+th/2,tx+48*Math.cos(a),ty+th/2+40*Math.sin(a),C.dark,4)}
  o+=L(tx,ty-8,tx,90,C.dark,4)+R(tx-40,74,80,22,C.dark,'none',6);
  const wy=105+(s.ph<1?s.ph:0)*150;
  [tx-120,tx+120].forEach((x,i)=>{o+=Ci(x,85,12,'#fff',C.dark)+L(x+(i?-12:12),85,tx+(i?40:-40),85,C.dark,1.5)+L(x,97,x,wy,C.dark,1.5)+R(x-18,wy,36,34,C.purple,'none',4)+TF(x,wy+22,`${P3_n(s.m/2,1)}`,13,'#fff')});
  o+=TF(tx,64,`two weights, ${s.m} kg in all, fall ${s.h} m`,13,C.muted);
  // Thermometer
  const thx=430,frac=clamp(dT/0.6,0,1);o+=R(thx-9,70,18,220,'#fff',C.line,9)+Ci(thx,300,16,C.coral)+R(thx-5,290-210*frac,10,210*frac+6,C.coral,'none',5);
  o+=TF(thx,330,`+${P3_n(dT,3)} °C`,14,C.coral);
  o+=R(460,80,128,182,'#fff',C.grid,8)+TF(524,102,'drops',13,C.muted)+TBF(524,124,P3_n(drops,0),17,C.ink)+TF(524,150,'work done',13,C.muted)+TBF(524,170,`${P3_n(E,0)} J`,15,C.ink)+TF(524,196,'J per calorie',13,C.muted)+TBF(524,220,isFinite(Jcal)?P3_n(Jcal,2):'—',17,s.leak?C.coral:C.green)+TF(524,246,'true value 4.19',13,C.muted);
  return {svg:o,phase:drops?`${P3_n(E,0)} J of falling work became ${P3_n(cal,1)} calories of heat in the water, giving ${P3_n(Jcal,2)} J per calorie.${s.leak?' Heat that leaks away before it is measured makes the answer too high, which is why Joule insulated the tank.':''}`:'Each fall of the weights turns the paddles, and the churned water warms very slightly. Count the falls, measure the temperature, and compare.'};
 }});

const P3_SANKEY={
 bulb:{name:'Filament bulb',in:'electrical energy',outs:[['light',5,1],['heat',95,0]]},
 led:{name:'LED lamp',in:'electrical energy',outs:[['light',30,1],['heat',70,0]]},
 car:{name:'Petrol car (town)',in:'fuel energy',outs:[['moving the car',21,1],['engine heat',62,0],['drivetrain',6,0],['accessories',6,0],['idling',5,0]]},
 motor:{name:'Electric motor',in:'electrical energy',outs:[['motion',90,1],['heat',10,0]]},
 cyclist:{name:'Cycling (muscle)',in:'food energy',outs:[['pedalling',24,1],['body heat',76,0]]}};
SCENE({id:'energy-conservation-sankey',name:'Where the energy goes',tag:'Every joule is accounted for',
 definition:'A Sankey diagram draws energy as a flowing band whose width is the amount. Nothing is lost from the total: the useful output and the waste always add up to the input.',
 example:'A filament bulb turns about 5 % of its electrical energy into light and 95 % into heat; an LED lamp delivers several times more light for the same input.',
 desc:'An energy band enters from the left and splits into useful and wasted outputs whose widths add up to the input, with efficiency shown.',
 research:'Sankey (1898) drew the first such diagram for a steam engine. Shares shown are approximate typical values (car after US DOE fueleconomy.gov).',
 dur:10,hint:'Choose a device. The bands always add up to 100 %: efficiency is the share that does what you wanted.',
 init:()=>({dev:'bulb'}),
 watch(p){return {dev:['bulb','led','car','motor','cyclist'][Math.min(4,Math.floor(p*5))]}},
 ui:[{choose:Object.entries(P3_SANKEY).map(([k,v])=>[k,v.name]),label:'Device',get:s=>s.dev,act:'dev'}],
 on:{dev(s,v){s.dev=v}},
 draw(s){
  const d=P3_SANKEY[s.dev],H=200,x0=60,x1=150,x2=390,top=90,gap=10,useful=d.outs.filter(o=>o[2]).reduce((a,o)=>a+o[1],0);
  let o=heading(`${d.name}: 100 J in`),yIn=top,yOut=top-gap*(d.outs.length-1)/2;
  o+=R(x0-20,top,x1-x0+20,H,'#8aa1ae','none',0)+TF(x0-12,top-10,d.in,13,C.muted,'start')+TB(x0+40,top+H/2+5,'100 J',15,'#fff');
  d.outs.forEach(([name,v,good],i)=>{const h=H*v/100,col=good?C.blue:[C.coral,'#d98b74','#e6a58f','#efc0ae'][i%4];
   const a1=yIn,a2=yIn+h,b1=yOut,b2=yOut+h,mx=(x1+x2)/2;
   o+=`<path d="M${x1} ${fmt(a1)} C${mx} ${fmt(a1)} ${mx} ${fmt(b1)} ${x2} ${fmt(b1)} L${x2+30} ${fmt(b1)} L${x2+30} ${fmt(b2)} L${x2} ${fmt(b2)} C${mx} ${fmt(b2)} ${mx} ${fmt(a2)} ${x1} ${fmt(a2)} Z" fill="${col}" opacity=".9"/>`;
   o+=TF(x2+38,yOut+h/2+5,`${name}: ${v} J`,13,good?C.blue:C.ink,'start');yIn+=h;yOut+=h+gap});
  o+=R(170,322,260,40,C.pale,'none',8)+TB(300,348,`efficiency = ${useful} J ÷ 100 J = ${useful} %`,15,C.blue);
  return {svg:o,phase:`Of every 100 J in, ${useful} J does the useful job and ${100-useful} J ends up as heat in the surroundings. The bands add up to exactly 100 J: energy is conserved even when it is wasted.`};
 }});

/* ---------- Momentum ---------- */
const P3_THINGS={truck:['Lorry at walking pace',3000,1.5],car:['Car at 30 mph',1200,13.4],player:['Sprinting footballer',80,8],ball:['Cricket ball',.16,40],bullet:['Rifle bullet',.008,400]};
SCENE({id:'momentum',name:'Momentum',tag:'Mass in motion',
 definition:'Momentum is mass times velocity, p = m v, measured in kg·m/s. It has a direction, and it is what a force must change to start or stop something.',
 example:'A 3,000 kg lorry rolling at walking pace has 4,500 kg·m/s of momentum, hundreds of times more than a fast cricket ball, but the ball can carry more kinetic energy per kilogram.',
 desc:'Two moving objects side by side with bars comparing their momentum and their kinetic energy, which rank them differently.',
 research:'Newton (1687). Principia, Definition II: “quantity of motion” is the product of mass and velocity.',
 dur:10,hint:'Pick two objects and change the first one’s speed. Momentum grows with v, kinetic energy with v²; they can rank the same pair differently.',
 init:()=>({a:'truck',b:'ball',va:1.5}),
 watch(p){const pairs=[['truck','ball'],['player','bullet'],['car','truck']],i=Math.min(2,Math.floor(p*3));return {a:pairs[i][0],b:pairs[i][1],va:P3_THINGS[pairs[i][0]][2]}},
 ui:[{choose:Object.entries(P3_THINGS).map(([k,v])=>[k,v[0]]),label:'Object A',get:s=>s.a,act:'a'},{choose:Object.entries(P3_THINGS).map(([k,v])=>[k,v[0]]),label:'Object B',get:s=>s.b,act:'b'},{range:'va',label:'Speed of A (m/s)',min:.5,max:40,step:.5,get:s=>s.va,act:'va'}],
 on:{a(s,v){s.a=v;s.va=P3_THINGS[v][2]},b(s,v){s.b=v},va(s,v){s.va=v}},
 draw(s){
  const A=P3_THINGS[s.a],B=P3_THINGS[s.b],pA=A[1]*s.va,pB=B[1]*B[2],kA=.5*A[1]*s.va**2,kB=.5*B[1]*B[2]**2;let o=heading('Momentum p = m v  ·  kinetic energy ½ m v²');
  [[A,s.va,C.blue,70],[B,B[2],C.coral,170]].forEach(([t,v,col,y])=>{o+=R(30,y,250,70,'#fff',C.grid,10)+TB(44,y+24,t[0],15,col,'start')+TF(44,y+46,`m = ${P3_n(t[1],t[1]<1?3:0)} kg`,13,C.muted,'start')+TF(44,y+62,`v = ${P3_n(v,1)} m/s`,13,C.muted,'start')+arrow(200,y+40,200+Math.min(70,10+Math.log10(1+v)*30),y+40,col,3)});
  o+=P3_bars(330,250,[{l:'p of A',v:pA,col:C.blue,d:0},{l:'p of B',v:pB,col:C.coral,d:0}],Math.max(pA,pB),150,46,14);
  o+=P3_bars(470,250,[{l:'KE of A',v:kA,col:C.blue,d:0},{l:'KE of B',v:kB,col:C.coral,d:0}],Math.max(kA,kB),150,46,14);
  o+=TF(380,300,'momentum (kg·m/s)',13,C.muted)+TF(520,300,'energy (J)',13,C.muted);
  const rp=pA/pB,rk=kA/kB;o+=TF(300,338,`A has ${rp>=1?P3_n(rp,1)+'× more':P3_n(1/rp,1)+'× less'} momentum and ${rk>=1?P3_n(rk,1)+'× more':P3_n(1/rk,1)+'× less'} kinetic energy than B.`,14,C.ink);
  return {svg:o,phase:`Momentum decides how much push over time it takes to stop something; kinetic energy decides how much damage it can do over a distance. ${A[0]} and ${B[0].toLowerCase()} rank ${(pA>pB)===(kA>kB)?'the same way':'differently'} on the two measures.`};
 }});

SCENE({id:'momentum-impulse',name:'Impulse',tag:'Stopping gently takes longer',
 definition:'Impulse is force multiplied by the time it acts, and it equals the change in momentum: F × Δt = Δp. Stopping over a longer time needs a smaller force.',
 example:'A 70 kg passenger stopping from 13 m/s in 0.01 s against a rigid dashboard feels about 91,000 N; spread over 0.15 s by a crumple zone and airbag, about 6,000 N.',
 desc:'A car meets a wall; a force–time graph compares a hard stop with a slower one, two rectangles of equal area (the same change of momentum).',
 research:'Newton (1687), Principia, Law II: change of motion is proportional to the force impressed. Béla Barényi patented the crumple zone in 1952.',
 dur:10,hint:'Change the speed and the stopping time. The shaded areas stay equal (same change of momentum); the force falls as the time grows.',
 init:()=>({v:13.4,dt:.15}),
 watch(p){return {v:13.4,dt:Math.round((.02+.23*smooth(p))*100)/100}},
 ui:[{range:'v',label:'Speed (m/s)',min:3,max:30,step:.1,get:s=>s.v,act:'v'},{range:'dt',label:'Stopping time (s)',min:.01,max:.3,step:.01,get:s=>s.dt,act:'dt',show:v=>v.toFixed(2)},{b:'Rigid wall',act:'rigid'},{b:'Crumple zone + airbag',act:'soft'}],
 on:{v(s,v){s.v=v},dt(s,v){s.dt=v},rigid(s){s.dt=.01},soft(s){s.dt=.15}},
 draw(s){
  const m=70,dp=m*s.v,F=dp/s.dt,Fr=dp/.01,g=s.v/s.dt/P3_G;let o=heading('Same change of momentum, spread over more time');
  const crush=clamp(s.v*s.dt/2*60,2,90);o+=R(500,60,24,110,'#8aa1ae','none',3);
  o+=R(380-crush/3,96,120-crush,46,C.blue,'none',8)+P(`M${500-crush} 96 l-8 10 l8 8 l-8 10 l8 8 l-8 10`,'#fff',2)+Ci(410-crush/3,148,10,C.dark)+Ci(470-crush,148,10,C.dark);
  o+=TF(440,80,`crumple ≈ ${P3_n(s.v*s.dt/2,2)} m`,13,C.muted)+TF(160,100,`passenger 70 kg at ${P3_n(s.v,1)} m/s`,14,C.ink)+TF(160,122,`Δp = ${P3_n(dp,0)} kg·m/s`,14,C.ink);
  // Force-time graph, log force axis for comparison
  const gx=60,gy=190,gw=480,gh=140,tmax=.32,fmax=Math.max(Fr,F)*1.05,X=t=>gx+t/tmax*gw,Y=f=>gy+gh-Math.log10(1+f)/Math.log10(1+fmax)*gh;
  o+=R(gx,gy,gw,gh,'#fff',C.grid,6)+R(X(0),Y(Fr),X(.01)-X(0),gy+gh-Y(Fr),C.coralp,C.coral,0)+R(X(0),Y(F),X(s.dt)-X(0),gy+gh-Y(F),C.pale,C.blue,0,'fill-opacity=".8"');
  o+=TF(gx+gw-10,gy+20,`rigid: ${P3_n(Fr/1000,0)} kN for 0.01 s`,13,C.coral,'end')+TF(gx+gw-10,gy+40,`yours: ${P3_n(F/1000,1)} kN for ${s.dt.toFixed(2)} s`,13,C.blue,'end');
  o+=TF(gx+gw/2,gy+gh+18,'time (s); force on a log scale so both fit',13,C.muted);
  return {svg:o,phase:`Stopping ${P3_n(dp,0)} kg·m/s of momentum in ${s.dt.toFixed(2)} s needs ${P3_n(F,0)} N, a deceleration of about ${P3_n(g,0)} g. The rigid stop needs ${P3_n(Fr/F,0)} times more force.`};
 }});

SCENE({id:'momentum-rocket',name:'Rocket propulsion',tag:'Throw mass backwards, go forwards',
 definition:'A rocket gains speed by throwing exhaust backwards: the momentum given to the exhaust is matched by the rocket’s momentum forwards. The total speed gain is Δv = u ln(m₀ ÷ m₁), the rocket equation.',
 example:'With exhaust at 2,500 m/s and a rocket that is three-quarters fuel (mass ratio 4), the ideal gain is 2,500 × ln 4 ≈ 3,470 m/s, well short of orbital speed, which is why rockets have stages.',
 desc:'A rocket ejects parcels of exhaust one at a time; each throw adds a step of speed, and the steps approach the smooth rocket-equation curve.',
 research:'Tsiolkovsky (1903). Exploration of outer space by means of rocket devices (the rocket equation).',
 dur:12,hint:'Change the exhaust speed and mass ratio, and how many parcels the fuel is thrown in. More, smaller throws approach the rocket equation.',
 init:()=>({u:2500,ratio:4,N:8}),
 ui:[{range:'u',label:'Exhaust speed (m/s)',min:500,max:4500,step:100,get:s=>s.u,act:'u'},{range:'ratio',label:'Mass ratio',min:1.5,max:10,step:.5,get:s=>s.ratio,act:'ratio'},{range:'N',label:'Parcels',min:2,max:40,get:s=>s.N,act:'N'}],
 on:{u(s,v){s.u=v},ratio(s,v){s.ratio=v},N(s,v){s.N=v}},
 trace(s){const m0=s.ratio,m1=1,dm=(m0-m1)/s.N;let m=m0,v=0;const fr=[{k:0,m,v,say:'Fuelled rocket at rest: total momentum zero.'}];
  for(let k=1;k<=s.N;k++){const dv=s.u*dm/m;v+=dv;m-=dm;fr.push({k,m,v,dv,say:`Throw parcel ${k} backwards at ${s.u} m/s relative to the rocket: the rocket gains ${P3_n(dv,0)} m/s.`})}
  fr.push({k:s.N,m,v,done:true,say:`All fuel used: ${P3_n(v,0)} m/s from ${s.N} throws, against ${P3_n(s.u*Math.log(m0),0)} m/s from the smooth rocket equation.`});return fr},
 draw(s,f){
  const ideal=s.u*Math.log(s.ratio);let o=heading('Rocket equation: Δv = u ln(m₀ ÷ m₁)');
  const rx=120+f.v/Math.max(ideal,1)*300;o+=L(30,110,570,110,C.grid,1,'stroke-dasharray="4 6"');
  for(let i=1;i<=f.k;i++){const x=rx-40-(f.k-i+1)*16;if(x>20)o+=Ci(x,110,5,C.coral)}
  const fuel=(f.m-1)/(s.ratio-1);o+=P(`M${rx-40} 92 H${rx+18} L${rx+40} 110 L${rx+18} 128 H${rx-40} Z`,C.dark,2,'#fff')+R(rx-38,96,54*fuel,28,C.amberp,'none',2);
  o+=arrow(rx+44,110,rx+44+Math.min(60,f.v/60),110,C.blue,3)+TF(rx,152,`${P3_n(f.v,0)} m/s`,14,C.blue);
  const gx=70,gy=180,gw=480,gh=140,vmax=ideal*1.1;const X=m=>gx+(s.ratio-m)/(s.ratio-1)*gw,Y=v=>gy+gh-v/vmax*gh;
  o+=R(gx,gy,gw,gh,'#fff',C.grid,6);let d='';for(let i=0;i<=60;i++){const m=s.ratio-(s.ratio-1)*i/60;d+=(i?'L':'M')+fmt(X(m))+' '+fmt(Y(s.u*Math.log(s.ratio/m)))}o+=P(d,C.green,2.5);
  let st='',m=s.ratio,v=0,dm=(s.ratio-1)/s.N;st=`M${fmt(X(m))} ${fmt(Y(0))}`;for(let k=1;k<=f.k;k++){v+=s.u*dm/m;m-=dm;st+=` H${fmt(X(m))} V${fmt(Y(v))}`}o+=P(st,C.blue,2.5);
  o+=TF(gx+gw/2,gy+gh+18,'fuel used →',13,C.muted)+TF(gx+gw-4,Y(ideal)-6,'rocket equation',13,C.green,'end')+TF(gx+6,gy+16,'speed',13,C.muted,'start');
  return {svg:o,phase:f.say};
 }});

/* ---------- Collisions ---------- */
function P3_col(s){const r1=.22*Math.cbrt(s.m1),r2=.22*Math.cbrt(s.m2),P=s.m1*s.v1+s.m2*s.v2,M=s.m1+s.m2,u1=(P+s.m2*s.e*(s.v2-s.v1))/M,u2=(P+s.m1*s.e*(s.v1-s.v2))/M,gap=6-(r1+r2),tc=s.v1>s.v2?gap/(s.v1-s.v2):Infinity;
 const pos=t=>t<tc?[-3+s.v1*t,3+s.v2*t]:[-3+s.v1*tc+u1*(t-tc),3+s.v2*tc+u2*(t-tc)];return {r1,r2,u1,u2,tc,pos}}
const P3_COL_T=5;
SCENE({id:'collisions',name:'Collisions',tag:'Momentum always survives a crash',
 definition:'In any collision with no outside force, total momentum before equals total momentum after. Kinetic energy is also conserved only in a perfectly elastic collision; otherwise some becomes heat, sound and deformation.',
 example:'A 2 kg trolley at 3 m/s hits a 1 kg trolley at rest. If they stick together they move off at 2 m/s: momentum 6 kg·m/s before and after, but kinetic energy falls from 9 J to 6 J.',
 desc:'Two balls approach, collide and separate on a track; bars below compare each ball’s momentum and the kinetic energy before and after the collision.',
 research:'Wallis (1668), Wren (1668) and Huygens (1669) answered the Royal Society’s call for the laws of collision; Newton (1687) stated conservation of momentum.',
 dur:12,hint:'Set masses and velocities (negative means moving left) and choose how bouncy the collision is. Total momentum never changes; kinetic energy does unless it is elastic.',
 init:()=>({m1:2,m2:1,v1:3,v2:0,e:1,t:0}),
 watch(p){const half=p<.5;return {m1:2,m2:1,v1:3,v2:0,e:half?1:0,t:(half?p*2:p*2-1)*P3_COL_T}},
 ui:[{range:'m1',label:'Mass A (kg)',min:.5,max:5,step:.5,get:s=>s.m1,act:'m1'},{range:'m2',label:'Mass B (kg)',min:.5,max:5,step:.5,get:s=>s.m2,act:'m2'},{range:'v1',label:'v A (m/s)',min:-3,max:5,step:.5,get:s=>s.v1,act:'v1'},{range:'v2',label:'v B (m/s)',min:-5,max:3,step:.5,get:s=>s.v2,act:'v2'},
  {choose:[[1,'Elastic'],[.5,'Partly bouncy'],[0,'Stick together']],label:'Collision',get:s=>s.e,act:'e'},...P3_PLAY_UI],
 on:{m1(s,v){s.m1=v;s.t=0},m2(s,v){s.m2=v;s.t=0},v1(s,v){s.v1=v;s.t=0},v2(s,v){s.v2=v;s.t=0},e(s,v){s.e=Number(v);s.t=0},...P3_play(P3_COL_T)},
 draw(s){
  const c=P3_col(s),[x1,x2]=c.pos(s.t),sc=45,X=x=>300+x*sc,after=s.t>=c.tc;let o=heading(`${s.e===1?'Elastic':s.e===0?'Perfectly inelastic':'Partly elastic'} collision`);
  o+=`<svg x="20" y="50" width="560" height="120" overflow="hidden">`+`<g transform="translate(-20,-50)">`+L(20,150,580,150,C.line,2);
  [[x1,c.r1,C.blue,'A',after?c.u1:s.v1],[x2,c.r2,C.coral,'B',after?c.u2:s.v2]].forEach(([x,r,col,l,v])=>{o+=Ci(X(x),150-r*sc,r*sc,col)+TB(X(x),155-r*sc,l,14,'#fff');if(Math.abs(v)>.01)o+=arrow(X(x),150-2*r*sc-10,X(x)+v*14,150-2*r*sc-10,col,2.5,7)});
  o+='</g></svg>';
  const before=[s.m1*s.v1,s.m2*s.v2],aft=[s.m1*c.u1,s.m2*c.u2],pmax=Math.max(...before.map(Math.abs),...aft.map(Math.abs),Math.abs(before[0]+before[1]),.1);
  const sb=(x,vals,lab)=>{let r=TF(x+70,190,lab,13,C.muted);vals.forEach(([v,col,l],i)=>{const h=v/pmax*48,bx=x+i*48;r+=R(bx,h>=0?268-h:268,38,Math.abs(h),col,'none',3)+TF(bx+19,h>=0?262-h:282-h,P3_n(v,1),13,C.ink)+TF(bx+19,354,l,13,C.muted)});return r+L(x-4,268,x+140,268,C.line,1.5)};
  o+=sb(40,[[before[0],C.blue,'A'],[before[1],C.coral,'B'],[before[0]+before[1],'#8aa1ae','total']],'momentum before')+sb(200,[[aft[0],C.blue,'A'],[aft[1],C.coral,'B'],[aft[0]+aft[1],'#8aa1ae','total']],'momentum after');
  const kb=.5*s.m1*s.v1**2+.5*s.m2*s.v2**2,ka=.5*s.m1*c.u1**2+.5*s.m2*c.u2**2;
  o+=P3_bars(400,320,[{l:'KE before',v:kb,col:C.green},{l:'KE after',v:ka,col:ka<kb-1e-6?C.amber:C.green}],Math.max(kb,ka,.01),110,64,24);
  const noHit=!isFinite(c.tc);
  return {svg:o,phase:noHit?'These two never meet: A must be moving right faster than B for them to collide.':after?`After: A ${P3_n(c.u1,2)} m/s, B ${P3_n(c.u2,2)} m/s. Total momentum is ${P3_n(before[0]+before[1],2)} kg·m/s before and after; kinetic energy ${kb-ka>1e-6?`fell from ${P3_n(kb,2)} J to ${P3_n(ka,2)} J (the rest became heat and sound)`:'is unchanged, so this collision is elastic'}.`:`Before the collision: total momentum ${P3_n(before[0]+before[1],2)} kg·m/s, kinetic energy ${P3_n(kb,2)} J (idealised track: no friction).`};
 }});

const P3_POOL_T=4;
SCENE({id:'collisions-2d',name:'Collisions in two dimensions',tag:'Billiard balls part at right angles',
 definition:'In two dimensions momentum is conserved as a vector, in each direction separately. When an elastic ball glances off an equal ball at rest, the two always leave at right angles to each other.',
 example:'A cue ball striking an object ball off-centre sends the object ball along the line joining their centres; the cue ball leaves at 90° to it, sharing the momentum like the sides of a right-angled triangle.',
 desc:'A cue ball strikes a still ball off-centre on a table; beside it, a vector triangle shows the incoming momentum split into two perpendicular outgoing momenta.',
 research:'Huygens (1669) and Newton (1687) on collisions; the right-angle rule follows from conserving both momentum and kinetic energy for equal masses.',
 dur:10,hint:'Change how far off-centre the cue ball hits (0 = head-on). The two balls always separate at 90°, and the momentum arrows always close the triangle.',
 init:()=>({b:.5,t:0}),
 watch(p){return {b:.5,t:p*P3_POOL_T}},
 ui:[{range:'b',label:'Off-centre (0–0.95)',min:0,max:.95,step:.05,get:s=>s.b,act:'b',show:v=>v.toFixed(2)},...P3_PLAY_UI],
 on:{b(s,v){s.b=v;s.t=0},...P3_play(P3_POOL_T)},
 draw(s){
  const r=14,v=110,ox=250,oy=210,phi=Math.asin(s.b),d=2*r*s.b,cx0=40,cy=oy-d,xc=ox-Math.sqrt(4*r*r-d*d),tc=(xc-cx0)/v;let o=heading('Equal balls, elastic glancing collision');
  o+=R(20,60,360,290,'#2c776c','none',12)+R(30,70,340,270,'#35896d','none',8);
  let cue,obj;if(s.t<tc){cue=[cx0+v*s.t,cy];obj=[ox,oy]}else{const dt=s.t-tc;obj=[ox+v*Math.cos(phi)*Math.cos(phi)*dt,oy+v*Math.cos(phi)*Math.sin(phi)*dt];cue=[xc+v*Math.sin(phi)*Math.sin(phi)*dt,cy-v*Math.sin(phi)*Math.cos(phi)*dt]}
  const clip=p=>[clamp(p[0],30+r,370-r),clamp(p[1],70+r,340-r)];cue=clip(cue);obj=clip(obj);
  o+=L(cx0,cy,xc,cy,'#ffffff55',1.5,'stroke-dasharray="4 4"')+Ci(cue[0],cue[1],r,'#fff')+Ci(obj[0],obj[1],r,C.coral)+TF(obj[0],obj[1]+5,'2',13,'#fff');
  // Vector triangle
  const L0=160,ax=400,ay=200,p2=[L0*Math.cos(phi)*Math.cos(phi),L0*Math.cos(phi)*Math.sin(phi)];
  o+=TF(490,80,'momentum',13,C.muted)+arrow(ax,ay,ax+L0,ay,C.ink,3)+TF(ax+L0/2,ay+20,'before',13,C.ink);
  if(s.b>0)o+=arrow(ax,ay,ax+p2[0],ay+p2[1],C.coral,3)+arrow(ax+p2[0],ay+p2[1],ax+L0,ay,'#8aa1ae',3)+TF(ax+p2[0]/2-6,ay+p2[1]/2+16,'object ball',13,C.coral,'end')+TF(ax+(p2[0]+L0)/2+6,ay+p2[1]/2+10,'cue ball',13,C.muted,'start');
  const ang=(90-phi*180/Math.PI);o+=TF(490,300,s.b>0?`object ball at ${P3_n(phi*180/Math.PI,0)}°, cue ball at ${P3_n(ang,0)}°`:'head-on: the cue ball stops dead',13,C.ink)+TF(490,320,s.b>0?'angle between them: 90°':'',13,C.green);
  return {svg:o,phase:s.b>0?`The object ball takes ${P3_n(Math.cos(phi)**2*100,0)} % of the kinetic energy and moves along the line of centres; the cue ball keeps ${P3_n(Math.sin(phi)**2*100,0)} % and leaves at right angles (ideal: no spin, no friction).`:'Head-on, the cue ball stops and the object ball takes all of the momentum and energy.'};
 }});

function P3_bounceY(h0,e,t){const v0=Math.sqrt(2*P3_G*h0),t0=v0/P3_G;if(t<t0)return h0-.5*P3_G*t*t;let tau=t-t0,v=e*v0;while(v>.05){const fl=2*v/P3_G;if(tau<fl)return v*tau-.5*P3_G*tau*tau;tau-=fl;v*=e}return 0}
const P3_BOUNCE_T=6;
SCENE({id:'collisions-restitution',name:'Coefficient of restitution',tag:'How bouncy is a bounce?',
 definition:'The coefficient of restitution e is the speed after a bounce divided by the speed before. Each bounce reaches e² of the previous height, so e can be measured from two heights.',
 example:'A ball dropped from 2 m that rebounds to 1.13 m has e = √(1.13 ÷ 2) ≈ 0.75. Each later bounce reaches 0.56 of the one before.',
 desc:'A height-against-time graph traces a ball’s shrinking bounces; beside it the ball itself falls and rebounds, with a list of bounce heights and the measured e.',
 research:'Newton (1687), Principia, Scholium to the Laws: pendulum experiments showing balls separate with a fixed fraction of their approach speed.',
 dur:12,hint:'Change e and the drop height. Each rebound is e² of the last, so the bounces die away geometrically and stop in a finite time (idealised: no air resistance).',
 init:()=>({h0:2,e:.75,t:0}),
 watch(p){return {h0:2,e:.75,t:p*P3_BOUNCE_T}},
 ui:[{range:'e',label:'e',min:.1,max:.95,step:.05,get:s=>s.e,act:'e',show:v=>v.toFixed(2)},{range:'h0',label:'Drop height (m)',min:.5,max:3,step:.1,get:s=>s.h0,act:'h0'},...P3_PLAY_UI],
 on:{e(s,v){s.e=v;s.t=0},h0(s,v){s.h0=v;s.t=0},...P3_play(P3_BOUNCE_T)},
 draw(s){
  const pts=[];for(let t=0;t<=s.t+1e-9;t+=.01)pts.push([t,P3_bounceY(s.h0,s.e,t)]);const y=P3_bounceY(s.h0,s.e,s.t);let o=heading(`e = ${s.e.toFixed(2)}: each bounce reaches e² = ${(s.e*s.e).toFixed(2)} of the last`);
  o+=P3_plot(60,60,280,240,{xr:[0,P3_BOUNCE_T],yr:[0,3],series:[{pts,col:C.blue}],xt:[0,2,4,6],yt:[0,1,2,3],xl:'time (s)',yl:'height (m)',dots:[{x:s.t,y,col:C.coral,r:6}]});
  const fy=300,sc=80;o+=L(360,fy,420,fy,C.ink,3)+Ci(390,fy-12-y*sc,12,C.coral);
  o+=R(440,60,140,240,'#fff',C.grid,8)+TF(510,82,'bounce heights',13,C.muted);
  for(let n=0;n<=5;n++){const h=s.h0*s.e**(2*n);o+=TF(456,108+n*24,n?`h${n}`:'drop',13,C.muted,'start')+TF(566,108+n*24,`${P3_n(h,2)} m`,13,C.ink,'end')}
  o+=TF(510,262,'e = √(h₁ ÷ h₀)',13,C.muted)+TB(510,284,(Math.sqrt(s.e**2)).toFixed(2),15,C.green);
  const tot=Math.sqrt(2*s.h0/P3_G)*(1+2*s.e/(1-s.e));
  return {svg:o,phase:`The bounce speeds shrink by ${s.e.toFixed(2)} each time, so the heights shrink by ${(s.e*s.e).toFixed(2)}. Infinitely many bounces fit into about ${P3_n(tot,1)} s, a real-world Zeno sum.`};
 }});

const P3_CRADLE_T=8;
SCENE({id:'collisions-cradle',name:'Newton’s cradle',tag:'k balls in, k balls out',
 definition:'In a row of nearly elastic balls, lifting k balls sends about k balls out the other side. That conserves momentum and kinetic energy, but with three or more balls so do other outcomes: the two laws alone do not decide it. The k-out pattern comes from how the impulse passes along the row, which depends on contact and material properties.',
 example:'Lift two balls and two swing out. One ball at twice the speed would carry the right momentum but twice the kinetic energy, so it cannot happen.',
 desc:'Five hanging balls; a chosen number swing in from the left and the same number swing out on the right, beside a check of momentum and energy for the possible outcomes.',
 research:'Collision laws from Wallis, Wren and Huygens (1668–69) and Newton’s Principia (1687); the desk toy itself dates from the 1960s.',
 dur:12,hint:'Choose how many balls to lift. Compare the outcomes: only “the same number out at the same speed” passes both checks (idealised: perfectly elastic, no friction).',
 init:()=>({k:2,t:0}),
 watch(p){return {k:p<.5?1:3,t:(p<.5?p*2:p*2-1)*P3_CRADLE_T}},
 ui:[{choose:[[1,'1 ball'],[2,'2 balls'],[3,'3 balls'],[4,'4 balls']],label:'Balls lifted',get:s=>s.k,act:'k'},...P3_PLAY_UI],
 on:{k(s,v){s.k=Number(v);s.t=0},...P3_play(P3_CRADLE_T)},
 draw(s){
  const A=.6,cyc=(s.t%2)/2,q=Math.floor(cyc*4),u=cyc*4-q;let thL=0,thR=0;
  if(q===0)thL=-A*Math.cos(Math.PI/2*u);else if(q===1)thR=A*Math.sin(Math.PI/2*u);else if(q===2)thR=A*Math.cos(Math.PI/2*u);else thL=-A*Math.sin(Math.PI/2*u);
  let o=heading(`${s.k} in, ${s.k} out`);const top=60,len=150,r=17;o+=L(110,top,310,top,C.ink,4);
  for(let i=0;i<5;i++){const px=140+i*34+.5,th=i<s.k?thL:i>=5-s.k?thR:0,bx=px+len*Math.sin(th),by=top+len*Math.cos(th);o+=L(px,top,bx,by,C.muted,1.4)+Ci(bx,by,r,i<s.k?C.blue:i>=5-s.k?C.coral:'#b9c9d3')}
  const rows=[[`${s.k} balls at v`,true,true],[`1 ball at ${s.k}v`,true,s.k===1],[`${s.k} balls at v ÷ 2`,false,false]];
  o+=TF(470,80,'possible outcomes',13,C.muted)+TF(510,104,'momentum',13,C.muted)+TF(570,104,'energy',13,C.muted);
  rows.forEach(([lab,pOk,eOk],i)=>{const y=134+i*40,ok=pOk&&eOk;o+=R(340,y-20,250,32,ok?C.greenp:'#fff',ok?C.green:C.grid,6)+TF(350,y,lab,13,C.ink,'start')+TBF(510,y,pOk?'✓':'✗',15,pOk?C.green:C.coral)+TBF(570,y,eOk?'✓':'✗',15,eOk?C.green:C.coral)});
  o+=TF(465,270,`1 ball at ${s.k}v: momentum ${s.k}mv ✓,`,13,C.muted)+TF(465,290,`energy ½m(${s.k}v)² = ${s.k*s.k} × ½mv²`,13,C.muted)+TF(465,310,`but ${s.k} balls brought ${s.k} × ½mv²`,13,C.muted);
  return {svg:o,phase:s.k===1?'One ball in, one ball out: the moving ball passes all of its momentum and energy along the row.':`Lift ${s.k} and ${s.k} leave the far end. That conserves momentum (${s.k} m v) and kinetic energy (${s.k} × ½ m v²), but other outcomes would too: what picks this one is how the impulse travels through hard balls in contact. Real cradles lose a little energy each swing, and the other balls jiggle slightly.`};
 }});

/* ---------- Oscillations ---------- */
const P3_SPRING_T=8;
SCENE({id:'oscillations',name:'Spring and mass',tag:'Hooke’s law makes it oscillate',
 definition:'A spring pulls back with a force proportional to how far it is stretched, F = −k x (Hooke’s law). A mass on such a spring oscillates with period T = 2π √(m ÷ k), whatever the amplitude.',
 example:'A 1 kg mass on a 20 N/m spring bounces with a period of about 1.4 s. Make the mass four times heavier and the period doubles.',
 desc:'A mass on a horizontal spring slides back and forth with a restoring-force arrow; below, a graph traces its position against time as a cosine wave.',
 research:'Hooke (1678). Lectures de potentia restitutiva, or of spring: “ut tensio, sic vis” (as the extension, so the force).',
 dur:12,hint:'Change the stiffness, the mass and the starting stretch. The period depends on mass and stiffness, not on how far you pull it (idealised: no friction, light spring).',
 init:()=>({k:20,m:1,A:.12,t:0}),
 watch(p){return {k:20,m:1,A:.12,t:p*P3_SPRING_T}},
 ui:[{range:'k',label:'Stiffness k (N/m)',min:5,max:80,get:s=>s.k,act:'k'},{range:'m',label:'Mass (kg)',min:.2,max:4,step:.1,get:s=>s.m,act:'m'},{range:'A',label:'Stretch (m)',min:.02,max:.15,step:.01,get:s=>s.A,act:'A'},...P3_PLAY_UI],
 on:{k(s,v){s.k=v;s.t=0},m(s,v){s.m=v;s.t=0},A(s,v){s.A=v;s.t=0},...P3_play(P3_SPRING_T)},
 draw(s){
  const w=Math.sqrt(s.k/s.m),T=2*Math.PI/w,x=s.A*Math.cos(w*s.t),sc=1100,eq=300,mx=eq+x*sc,F=-s.k*x;let o=heading(`T = 2π √(m ÷ k) = ${P3_n(T,2)} s`);
  o+=R(30,70,14,90,'#8aa1ae','none',2)+L(30,165,570,165,C.line,2)+L(eq+30,170,eq+30,180,C.ink,1.5)+TF(eq+30,196,'rest position',13,C.muted);
  o+=P3_spring(44,120,mx,12,10)+R(mx,95,60,50,C.blue,'none',6)+TF(mx+30,125,`${P3_n(s.m,1)} kg`,13,'#fff');
  if(Math.abs(F)>.05)o+=arrow(mx+30,80,mx+30+clamp(F*25,-90,90),80,C.coral,3,8)+TF(mx+30,68,`F = ${P3_n(F,1)} N`,13,C.coral);
  const pts=[];for(let t=0;t<=s.t+1e-9;t+=.02)pts.push([t,s.A*Math.cos(w*t)]);
  o+=P3_plot(60,215,500,110,{xr:[0,P3_SPRING_T],yr:[-.16,.16],series:[{pts,col:C.blue}],xt:[0,2,4,6,8],xl:'time (s)',yl:'position x (m)',dots:[{x:s.t,y:x,col:C.coral}]});
  return {svg:o,phase:`Stretched ${P3_n(Math.abs(x)*100,1)} cm, the spring pulls back with ${P3_n(Math.abs(F),1)} N. Stiffer springs and lighter masses oscillate faster; the period here is ${P3_n(T,2)} s.`};
 }});

const P3_CIRCLE_T=10;
SCENE({id:'oscillations-circle',name:'Simple harmonic motion',tag:'The shadow of a circle',
 definition:'Simple harmonic motion is the motion of the shadow of a point going steadily round a circle. Its position is a sine wave in time, and its acceleration always points back to the centre.',
 example:'A point going round once every 2 s casts a shadow that bobs up and down with a period of 2 s, exactly like a mass on a spring with the same period.',
 desc:'A point travels round a circle while a horizontal guide line carries its height across to a graph, which traces a sine wave.',
 research:'Huygens (1673), Horologium oscillatorium, related oscillation to uniform circular motion; the link is standard in Newton’s Principia (1687).',
 dur:12,hint:'Change the frequency and starting phase. The shadow’s height is R sin(2π f t + φ): a sine wave in time.',
 init:()=>({f:.5,ph:0,t:0}),
 watch(p){return {f:.5,ph:0,t:p*P3_CIRCLE_T}},
 ui:[{range:'f',label:'Frequency (Hz)',min:.1,max:1.2,step:.05,get:s=>s.f,act:'f',show:v=>v.toFixed(2)},{range:'ph',label:'Start phase (°)',min:0,max:345,step:15,get:s=>s.ph,act:'ph'},...P3_PLAY_UI],
 on:{f(s,v){s.f=v;s.t=0},ph(s,v){s.ph=v;s.t=0},...P3_play(P3_CIRCLE_T)},
 draw(s){
  const R0=80,cx=120,cy=200,a=2*Math.PI*s.f*s.t+s.ph*Math.PI/180,px=cx+R0*Math.cos(a),py=cy-R0*Math.sin(a);let o=heading('Circular motion, seen edge-on, is simple harmonic motion');
  o+=Ci(cx,cy,R0,'none',C.line)+L(cx,cy,px,py,C.muted,1.5)+Ci(px,py,8,C.coral)+L(cx-R0-10,cy,cx+R0+10,cy,C.grid,1);
  const gx=240,gw=330,X=t=>gx+t/P3_CIRCLE_T*gw;o+=L(px,py,X(s.t),py,C.coral,1.2,'stroke-dasharray="4 4"');
  o+=R(gx,cy-R0-10,gw,2*R0+20,'#fff',C.grid,6)+L(gx,cy,gx+gw,cy,C.line,1);let d='';for(let t=0;t<=s.t+1e-9;t+=.02){const aa=2*Math.PI*s.f*t+s.ph*Math.PI/180;d+=(d?'L':'M')+fmt(X(t))+' '+fmt(cy-R0*Math.sin(aa))}
  if(d)o+=P(d,C.blue,2.5);o+=Ci(X(s.t),py,6,C.blue)+TF(gx+gw/2,cy+R0+34,'time →',13,C.muted)+TF(cx,cy+R0+34,'circle',13,C.muted);
  o+=TF(300,352,`period ${P3_n(1/s.f,2)} s · angular frequency ω = 2πf = ${P3_n(2*Math.PI*s.f,2)} rad/s`,14,C.ink);
  return {svg:o,phase:'Looked at from the side, steady motion round a circle becomes a back-and-forth oscillation. That is why springs, pendulums and sound waves all share the same sine shape.'};
 }});

const P3_PEND_T=12;
SCENE({id:'oscillations-pendulum',name:'The pendulum',tag:'Only small swings keep perfect time',
 definition:'For small swings a pendulum’s period is T = 2π √(L ÷ g), independent of how far it swings. For large swings the period grows: the “independent of amplitude” rule is an approximation.',
 example:'A 1 m pendulum swings with a period of about 2.0 s at 5°. Released at 90° it takes about 18 % longer per swing.',
 desc:'Two pendulums released at the same angle: one follows the small-angle formula, the other the exact motion; a graph shows how the true period grows with amplitude.',
 research:'Galileo (1638), Two New Sciences, claimed swings of any size take equal time; Huygens (1673) showed this holds only for small swings and found the cycloid that is exact.',
 dur:13,hint:'Raise the release angle and watch the true pendulum (orange) fall behind the small-angle model (blue). The graph shows the exact period ratio.',
 init:()=>({amp:60,L:1,t:0}),
 watch(p){return {amp:60,L:1,t:p*P3_PEND_T}},
 ui:[{range:'amp',label:'Release angle (°)',min:5,max:170,step:5,get:s=>s.amp,act:'amp'},{range:'L',label:'Length (m)',min:.25,max:2.5,step:.05,get:s=>s.L,act:'L'},...P3_PLAY_UI],
 on:{amp(s,v){s.amp=v;s.t=0},L(s,v){s.L=v;s.t=0},...P3_play(P3_PEND_T)},
 draw(s){
  const a0=s.amp*Math.PI/180,w0=Math.sqrt(P3_G/s.L),T0=2*Math.PI/w0,ratio=2*P3_K(Math.sin(a0/2))/Math.PI,sim=P3_pend(s.amp,0,s.L,P3_PEND_T),[th]=P3_at(sim,s.t),thS=a0*Math.cos(w0*s.t);
  let o=heading(`True period ${P3_n(T0*ratio,2)} s vs small-angle ${P3_n(T0,2)} s`);const py=150,lp=95;
  [[110,thS,C.blue,'small-angle formula'],[280,th,C.coral,'exact motion']].forEach(([px,a,col,lab])=>{o+=L(px-40,py,px+40,py,C.ink,3)+L(px,py,px+lp*Math.sin(a),py+lp*Math.cos(a),C.ink,1.6)+Ci(px+lp*Math.sin(a),py+lp*Math.cos(a),11,col)+TF(px,350,lab,13,col)});
  const pts=range(35).map(i=>{const d=5+i*5;return [d,2*P3_K(Math.sin(d*Math.PI/360))/Math.PI]});
  o+=P3_plot(415,80,160,220,{xr:[0,170],yr:[1,2.6],series:[{pts,col:C.coral}],xt:[0,90,170],yt:[1,1.5,2,2.5],xl:'release angle (°)',yl:'period ÷ T₀',dots:[{x:s.amp,y:ratio,col:C.coral,r:6}]});
  return {svg:o,phase:s.amp<=15?`At ${s.amp}° the true period is only ${P3_n((ratio-1)*100,2)} % longer than the formula: small swings keep good time.`:`At ${s.amp}° each swing takes ${P3_n((ratio-1)*100,1)} % longer than 2π √(L/g). The orange pendulum falls further behind every swing (idealised: no friction, rigid rod).`};
 }});

const P3_CLOCK_T=12;
SCENE({id:'oscillations-huygens',name:'The pendulum clock',tag:'Keeping time with a swinging weight',
 definition:'A pendulum clock counts swings: each swing lets a gear advance one tooth. A “seconds pendulum”, about 0.994 m long, takes exactly one second per swing, and its length sets the clock’s accuracy.',
 example:'Lengthen a seconds pendulum by just 1 mm and each swing takes 0.05 % longer: the clock loses about 43 seconds a day.',
 desc:'A pendulum ticks an escapement that drives a clock hand; a panel shows the swing time and how many seconds per day the clock gains or loses for the chosen length.',
 research:'Huygens (1657) built the first pendulum clock (made by Salomon Coster); Horologium oscillatorium (1673). Good clocks improved from minutes a day to seconds.',
 dur:12,hint:'Adjust the length to the millimetre. A seconds pendulum needs L = g ÷ π² ≈ 0.994 m; the error per day shows how sensitive the clock is.',
 init:()=>({L:1.000,t:0}),
 watch(p){return {L:Math.round((1.03-.036*smooth(p))*1000)/1000,t:p*P3_CLOCK_T}},
 ui:[{range:'L',label:'Length (m)',min:.95,max:1.05,step:.001,get:s=>s.L,act:'L',show:v=>v.toFixed(3)},...P3_PLAY_UI],
 on:{L(s,v){s.L=v},...P3_play(P3_CLOCK_T)},
 draw(s){
  const T=2*Math.PI*Math.sqrt(s.L/P3_G),swing=T/2,err=86400*(1/swing-1),a=.14*Math.cos(2*Math.PI*s.t/T),ticks=Math.floor(s.t/swing);
  let o=heading('A seconds pendulum: one swing, one tick');const px=140,py=60,lp=180*s.L;
  o+=L(px-50,py,px+50,py,C.ink,3)+L(px,py,px+lp*Math.sin(a),py+lp*Math.cos(a),C.ink,2)+Ci(px+lp*Math.sin(a),py+lp*Math.cos(a),16,C.amber);
  o+=P(`M${px-26} ${py+40} L${px} ${py+22} L${px+26} ${py+40}`,C.muted,3)+TF(px,py+lp+46,`L = ${s.L.toFixed(3)} m`,14,C.ink);
  const cx=420,cy=170,r=80;o+=Ci(cx,cy,r,'#fff',C.ink);for(let i=0;i<60;i++){const an=i*Math.PI/30;o+=L(cx+(r-(i%5?5:10))*Math.sin(an),cy-(r-(i%5?5:10))*Math.cos(an),cx+r*Math.sin(an),cy-r*Math.cos(an),C.ink,i%5?1:2)}
  const ha=(ticks%60)*Math.PI/30;o+=L(cx,cy,cx+70*Math.sin(ha),cy-70*Math.cos(ha),C.coral,2.5)+Ci(cx,cy,4,C.ink);
  o+=TF(cx,cy+r+24,`one swing = ${P3_n(swing,4)} s`,14,C.ink);
  const good=Math.abs(err)<5;o+=R(300,300,250,50,good?C.greenp:C.coralp,'none',8)+TB(425,323,`${err>=0?'gains':'loses'} ${P3_n(Math.abs(err),0)} s per day`,15,good?C.green:C.coral)+TF(425,342,'seconds pendulum: L ≈ 0.994 m',13,C.muted);
  return {svg:o,phase:`At ${s.L.toFixed(3)} m each swing takes ${P3_n(swing,4)} s, so a clock counting one second per swing ${err>=0?'gains':'loses'} about ${P3_n(Math.abs(err),0)} s a day (g = 9.81 m/s²; small swings).`};
 }});

/* ---------- Rotation ---------- */
SCENE({id:'rotation',name:'Torque and levers',tag:'Force times distance from the pivot',
 definition:'Torque is the turning effect of a force: force × perpendicular distance from the pivot, in newton-metres (N·m). A lever balances when the torques on both sides are equal.',
 example:'A 20 kg child 1.5 m from a seesaw’s pivot balances a 10 kg child 3 m away: 20 × 1.5 = 10 × 3.',
 desc:'A seesaw with a weight on each side tilts towards the side with the larger torque and levels when the two torques match.',
 research:'Archimedes (c. 250 BCE). On the equilibrium of planes: magnitudes balance at distances inversely proportional to their weights.',
 dur:10,hint:'Move the weights and change the masses. The beam levels when mass × distance is the same on both sides.',
 init:()=>({m1:20,d1:1.5,m2:10,d2:2}),
 watch(p){return {m1:20,d1:1.5,m2:10,d2:Math.round((1+2*smooth(p))*10)/10}},
 ui:[{range:'m1',label:'Left mass (kg)',min:5,max:40,get:s=>s.m1,act:'m1'},{range:'d1',label:'Left distance (m)',min:.2,max:3,step:.1,get:s=>s.d1,act:'d1'},{range:'m2',label:'Right mass (kg)',min:5,max:40,get:s=>s.m2,act:'m2'},{range:'d2',label:'Right distance (m)',min:.2,max:3,step:.1,get:s=>s.d2,act:'d2'}],
 on:{m1(s,v){s.m1=v},d1(s,v){s.d1=v},m2(s,v){s.m2=v},d2(s,v){s.d2=v}},
 draw(s){
  const t1=s.m1*P3_G*s.d1,t2=s.m2*P3_G*s.d2,net=t2-t1,bal=Math.abs(net)<.01*Math.max(t1,t2),ang=bal?0:clamp(net/Math.max(t1,t2),-1,1)*.22,px=300,py=230,sc=80;
  let o=heading(bal?'Balanced: the torques are equal':`Tips to the ${net>0?'right':'left'}`);
  o+=P(`M${px-24} 300 L${px} ${py+6} L${px+24} 300 Z`,C.ink,2,'#8aa1ae')+L(140,300,460,300,C.line,2);
  const ca=Math.cos(ang),sa=Math.sin(ang),pt=d=>[px+d*sc*ca,py+d*sc*sa];
  o+=L(...pt(-3.1),...pt(3.1),C.amber,8);
  for(let d=-3;d<=3;d+=1)if(d){const [x,y]=pt(d);o+=TF(x,y+22,Math.abs(d)+' m',13,C.muted)}
  [[-s.d1,s.m1,C.blue],[s.d2,s.m2,C.coral]].forEach(([d,m,col])=>{const [x,y]=pt(d),sz=38+m*.5;o+=R(x-sz/2,y-sz-4,sz,sz,col,'none',4)+TF(x,y-sz/2+1,`${m} kg`,13,'#fff')});
  o+=R(30,60,200,50,'#fff',C.grid,8)+TF(130,80,'left torque',13,C.muted)+TBF(130,100,`${P3_n(t1,0)} N·m`,15,C.blue);
  o+=R(370,60,200,50,'#fff',C.grid,8)+TF(470,80,'right torque',13,C.muted)+TBF(470,100,`${P3_n(t2,0)} N·m`,15,C.coral);
  return {svg:o,phase:`${s.m1} kg × 9.81 × ${s.d1} m = ${P3_n(t1,0)} N·m on the left; ${s.m2} kg × 9.81 × ${s.d2} m = ${P3_n(t2,0)} N·m on the right. ${bal?'Equal torques: no turning.':'The larger torque wins and the beam turns.'}`};
 }});

const P3_ROLL=[{n:'block (sliding, no friction)',k:0,col:C.purple,shape:'block'},{n:'solid sphere',k:.4,col:C.blue,shape:'sphere'},{n:'disc',k:.5,col:C.green,shape:'disc'},{n:'hoop',k:1,col:C.coral,shape:'hoop'}],P3_RAMP=3;
function P3_rollT(ang,k){return Math.sqrt(2*P3_RAMP/(P3_G*Math.sin(ang*Math.PI/180)/(1+k)))}
SCENE({id:'rotation-rolling-race',name:'Moment of inertia',tag:'Shape decides the rolling race',
 definition:'Moment of inertia measures how hard something is to spin up: mass spread further from the axis makes it larger. Rolling things share their energy between moving and spinning, so a hoop rolls down a slope more slowly than a solid ball.',
 example:'Race a solid ball, a disc and a hoop down a 3 m ramp at 20°: the ball wins, the hoop comes last, whatever their masses and sizes.',
 desc:'Four lanes race down the same ramp: a frictionless sliding block, a solid sphere, a disc and a hoop; finishing times appear beside each lane.',
 research:'Euler (1765), Theoria motus corporum solidorum, introduced the moment of inertia; for rolling, a = g sin θ ÷ (1 + I ÷ m r²).',
 dur:12,hint:'Change the ramp angle and the mass. Mass and size cancel out; only how the mass is spread decides the order.',
 init:()=>({ang:20,mass:1,t:0}),
 watch(p){return {ang:20,mass:1,t:p*P3_rollT(20,1)*1.15}},
 ui:[{range:'ang',label:'Ramp angle (°)',min:5,max:45,get:s=>s.ang,act:'ang'},{range:'mass',label:'Mass ×',min:.5,max:4,step:.5,get:s=>s.mass,act:'mass'},...P3_PLAY_UI],
 on:{ang(s,v){s.ang=v;s.t=0},mass(s,v){s.mass=v},...P3_play(s=>P3_rollT(s.ang,1)+.3)},
 draw(s){
  let o=heading(`Racing down a ${P3_RAMP} m ramp at ${s.ang}°`);const x0=50,x1=380,a=s.ang*Math.PI/180;
  P3_ROLL.forEach((b,i)=>{const y=86+i*62,acc=P3_G*Math.sin(a)/(1+b.k),d=Math.min(P3_RAMP,.5*acc*s.t*s.t),x=x0+d/P3_RAMP*(x1-x0),ft=P3_rollT(s.ang,b.k),done=s.t>=ft,r=13,rot=d/.13;
   o+=L(x0,y+r,x1+10,y+r,C.line,2)+L(x1,y-8,x1,y+r+4,C.ink,2);
   if(b.shape==='block')o+=R(x-r,y-r,2*r,2*r,b.col,'none',3);else o+=Ci(x,y,r,b.shape==='sphere'?b.col:b.shape==='disc'?C.greenp:'#fff',b.col,b.shape==='hoop'?'stroke-width="4"':'')+L(x,y,x+r*Math.cos(rot),y-r*Math.sin(rot),b.shape==='sphere'?'#fff':b.col,2);
   o+=TF(x0,y-r-6,b.n,13,C.muted,'start')+TF(560,y+4,`${P3_n(ft,2)} s`,14,done?b.col:C.muted,'end')+(done?TBF(470,y+4,'finished',13,b.col):'')});
  o+=P(`M60 350 L160 350 L160 ${fmt(350-100*Math.tan(a))} Z`,C.ink,1.5,'#eef3f6')+TF(150,343,`${s.ang}°`,13,C.ink,'end')+TF(330,345,`mass × ${s.mass}: same times`,13,C.muted);
  return {svg:o,phase:'Each body gets the same energy from the same drop. The hoop has all its mass at the rim, so half its energy goes into spinning and less into speed; the frictionless block spends none on spinning.'};
 },
 three(s,f,X,project){
  const a=s.ang*Math.PI/180,H=P3_RAMP*Math.sin(a),Lh=P3_RAMP*Math.cos(a),P=project([[0,0,0],[Lh,4,0],[0,0,H],[0,4,H],[Lh,0,0]]);
  let o=poly3([[0,0,0],[Lh,0,0],[Lh,4,0],[0,4,0]],P,'#e5edf2')+poly3([[0,0,H],[Lh,0,0],[Lh,4,0],[0,4,H]],P,'#d3e2ea',C.line)+poly3([[0,0,0],[0,0,H],[Lh,0,0]],P,'#c2d5e0',C.line);
  o+=sortedItems(P3_ROLL.map((b,i)=>{const acc=P3_G*Math.sin(a)/(1+b.k),d=Math.min(P3_RAMP,.5*acc*s.t*s.t),pt=[d*Math.cos(a),i+.5,H-d*Math.sin(a)+.12];return {at:pt,svg:P=>{const q=P(pt);return Ci(q[0],q[1],10,b.col,'#fff')}}}),P);
  return {svg:o,title:'The ramp in 3D',caption:'Four lanes on one ramp, all released together. The purple block slides without friction; the others roll.'};
 }});

const P3_SKATE_T=10;
function P3_skI(r){return 1.2+2*4*r*r} // body ≈ 1.2 kg·m² plus two 4 kg arms at radius r (illustrative)
SCENE({id:'rotation-skater',name:'Angular momentum',tag:'Pull in and spin faster',
 definition:'Angular momentum, L = I ω (moment of inertia × spin rate), stays constant when no outside torque acts. Pull mass closer to the axis and the spin speeds up to keep L the same.',
 example:'With these illustrative values, a skater turning once a second with arms out turns about four times a second with them pulled in, with no push from anywhere.',
 desc:'A top view of a spinning skater whose arms move in and out; readouts show moment of inertia falling, spin rate rising and angular momentum staying constant.',
 research:'Kepler’s second law (1609) is conservation of angular momentum for a planet; Euler (1765) treated rigid-body rotation. Body values here are illustrative.',
 dur:12,hint:'Move the arms in or out while spinning. I × ω stays fixed; kinetic energy rises as the arms come in, because the skater’s muscles do work.',
 init:()=>({r:.8,ang:0,t:0}),
 watch(p){const rr=q=>.8-.6*smooth(clamp((q-.2)/.5,0,1));let ang=0;const n=200,L=P3_skI(.8)*2*Math.PI;for(let i=0;i<n;i++)ang+=L/P3_skI(rr(p*i/n))*(p*P3_SKATE_T/n);return {r:rr(p),ang,t:p*P3_SKATE_T}},
 ui:[{range:'r',label:'Arm reach (m)',min:.2,max:.8,step:.05,get:s=>s.r,act:'r'},{b:'▶ Spin',act:'go'},{b:'❚❚ Stop',act:'pause'}],
 on:{r(s,v){s.r=v},go(s,a,ctx){s.run=(s.run||0)+1;ctx.every(33,'spin',s.run)},spin(s,tok){if(Number(tok)!==s.run)return 'stop';const L=P3_skI(.8)*2*Math.PI;s.ang+=L/P3_skI(s.r)/30;s.t+=1/30;if(s.t>600){s.run++;return 'stop'}},pause(s){s.run=(s.run||0)+1}},
 draw(s){
  const Lm=P3_skI(.8)*2*Math.PI,I=P3_skI(s.r),w=Lm/I,KE=.5*I*w*w,cx=170,cy=210,rp=s.r*170;let o=heading('Angular momentum L = I ω stays the same');
  o+=Ci(cx,cy,150,'#f6f9fb',C.grid)+Ci(cx,cy,30,C.purple);
  [0,Math.PI].forEach(d=>{const a=s.ang+d;o+=L(cx+28*Math.cos(a),cy+28*Math.sin(a),cx+(30+rp)*Math.cos(a),cy+(30+rp)*Math.sin(a),C.purple,7)+Ci(cx+(30+rp)*Math.cos(a),cy+(30+rp)*Math.sin(a),9,C.coral)});
  o+=TF(cx,cy+5,'head',13,'#fff')+TF(cx,355,'seen from above',13,C.muted);
  const row=(y,l,v,col)=>R(370,y,200,46,'#fff',C.grid,8)+TF(470,y+17,l,13,C.muted)+TBF(470,y+38,v,15,col);
  o+=row(70,'moment of inertia I',`${P3_n(I,2)} kg·m²`,C.ink)+row(126,'spin rate',`${P3_n(w/(2*Math.PI),2)} turns per second`,C.blue)+row(182,'angular momentum L',`${P3_n(Lm,2)} kg·m²/s`,C.green)+row(238,'kinetic energy',`${P3_n(KE,1)} J`,C.coral);
  return {svg:o,phase:`With arms at ${P3_n(s.r,2)} m, I = ${P3_n(I,2)} kg·m² and the skater turns ${P3_n(w/(2*Math.PI),2)} times a second. L stays ${P3_n(Lm,2)} kg·m²/s because nothing outside twists the skater (idealised: frictionless ice).`};
 }});

/* ---------- Symmetry and conservation (Noether) ---------- */
const P3_WORLDS={flat:'Flat, unchanging floor',hill:'Fixed hill',grow:'Hill that grows over time'};
function P3_world(kind){return P3_memo('world|'+kind,()=>{const dt=1/240,T=8,n=T/dt,H=t=>kind==='flat'?0:kind==='hill'?1.2:Math.min(1.9,.3+.55*t),V=(x,t)=>H(t)*Math.exp(-x*x/.8),dV=(x,t)=>V(x,t)*(-2*x/.8);
 let x=-5,v=2;const out=[];for(let i=0;i<=n;i++){const t=i*dt;if(i%6===0)out.push([t,x,v,.5*v*v+V(x,t)]);const a=-dV(x,t);v+=a*dt;x+=v*dt}return {out,V,H}})}
const P3_WORLD_T=8;
SCENE({id:'symmetry-conservation',name:'Symmetry and conservation',tag:'Noether’s theorem',
 definition:'Emmy Noether proved that every continuous symmetry of the laws of motion gives a conserved quantity. If the laws are the same everywhere, momentum is conserved; if they are the same at all times, energy is conserved.',
 example:'On a flat, unchanging floor a rolling ball keeps both its momentum and its energy. Put a fixed hill in the way and momentum changes but energy does not. Let the hill grow while the ball is on it and even energy changes.',
 desc:'A ball rolls across a landscape; below, two graphs track its momentum and its total energy, which stay flat only when the matching symmetry holds.',
 research:'Noether (1918). Invariante Variationsprobleme. Nachrichten von der Gesellschaft der Wissenschaften zu Göttingen, 235–257.',
 dur:12,hint:'Choose a world. Break symmetry in space (a hill) and momentum changes; break symmetry in time (a growing hill) and energy changes too.',
 init:()=>({w:'hill',t:0}),
 watch(p){const k=['flat','hill','grow'][Math.min(2,Math.floor(p*3))];return {w:k,t:(p*3%1)*P3_WORLD_T}},
 ui:[{choose:Object.entries(P3_WORLDS),label:'World',get:s=>s.w,act:'w'},...P3_PLAY_UI],
 on:{w(s,v){s.w=v;s.t=0},...P3_play(P3_WORLD_T)},
 draw(s){
  const sim=P3_world(s.w),i=clamp(Math.round(s.t/(6/240)),0,sim.out.length-1),[t,x,v,E]=sim.out[i];let o=heading(P3_WORLDS[s.w]);
  const X=x=>300+x*45,Y=h=>170-h*55;let d='';for(let xx=-6.4;xx<=6.4;xx+=.1)d+=(d?'L':'M')+fmt(X(xx))+' '+fmt(Y(sim.V(xx,t)));
  o+=P(d+` L${X(6.4)} 190 L${X(-6.4)} 190 Z`,C.line,2,'#eef3f6')+Ci(X(x),Y(sim.V(x,t))-11,11,C.blue);
  const sl=sim.out.slice(0,i+1),pm=sl.map(r=>[r[0],r[2]]),em=sl.map(r=>[r[0],r[3]]);
  o+=P3_plot(60,220,220,100,{xr:[0,8],yr:[0,3],series:[{pts:pm,col:C.blue}],xt:[0,4,8],yt:[0,1.5,3],xl:'time (s)',yl:'momentum (kg·m/s)'});
  o+=P3_plot(345,220,220,100,{xr:[0,8],yr:[0,4],series:[{pts:em,col:C.coral}],xt:[0,4,8],yt:[0,2,4],xl:'time (s)',yl:'energy (J)'});
  const msg={flat:'Same everywhere and at all times: momentum and energy both stay constant.',hill:'The hill makes some places different from others, so momentum changes; the laws do not change with time, so energy stays constant.',grow:'The hill changes with time, so time symmetry is broken and the ball’s energy is no longer conserved.'}[s.w];
  return {svg:o,phase:msg+' (1 kg ball, no friction.)'};
 }});

function P3_orbit(kind){return P3_memo('orbit|'+kind,()=>{const dt=1/240,T=12,n=T/dt;let x=2,y=0,vx=0,vy=1;const F=(x,y)=>[-x+(kind==='off'?.35:0),-y],out=[];let [ax,ay]=F(x,y);
 for(let i=0;i<=n;i++){if(i%4===0)out.push([i*dt,x,y,x*vy-y*vx]);vx+=ax*dt/2;vy+=ay*dt/2;x+=vx*dt;y+=vy*dt;[ax,ay]=F(x,y);vx+=ax*dt/2;vy+=ay*dt/2}return out})}
const P3_ORBIT_T=12;
SCENE({id:'symmetry-conservation-rotation',name:'Rotation symmetry',tag:'Equal areas in equal times',
 definition:'If a force always points to a fixed centre, the situation looks the same however you rotate it about that centre, and angular momentum is conserved. That is why a planet sweeps out equal areas in equal times.',
 example:'A ball on a spring pulled towards a fixed point traces an ellipse and sweeps equal areas every second. Add a steady sideways push and the symmetry is broken: the areas and the angular momentum drift.',
 desc:'A body orbits a centre, leaving shaded wedges for each second of travel; a graph tracks its angular momentum, flat for a central force and drifting when an off-centre push is added.',
 research:'Kepler (1609), Astronomia nova: the second law (equal areas); Noether (1918) links it to rotational symmetry.',
 dur:12,hint:'Compare a purely central pull with one that has an extra sideways push. Equal wedges and a flat line mean angular momentum is conserved.',
 init:()=>({k:'central',t:0}),
 watch(p){return {k:p<.5?'central':'off',t:(p<.5?p*2:p*2-1)*P3_ORBIT_T}},
 ui:[{choose:[['central','Central pull only'],['off','Plus a sideways push']],label:'Force',get:s=>s.k,act:'k'},...P3_PLAY_UI],
 on:{k(s,v){s.k=v;s.t=0},...P3_play(P3_ORBIT_T)},
 draw(s){
  const out=P3_orbit(s.k),i=clamp(Math.round(s.t/(4/240)),0,out.length-1),cx=190,cy=205,sc=62,X=x=>cx+x*sc,Y=y=>cy-y*sc;let o=heading(s.k==='central'?'Central force: angular momentum conserved':'Off-centre push: angular momentum drifts');
  for(let sec=0;sec<Math.floor(out[i][0]);sec++){const a=out.filter(r=>r[0]>=sec&&r[0]<=sec+1+1e-9);if(a.length<2)continue;let d=`M${cx} ${cy}`;a.forEach((r,j)=>{if(j%3===0||j===a.length-1)d+=` L${fmt(X(r[1]))} ${fmt(Y(r[2]))}`});o+=P(d+'Z','none',0,sec%2?'#cfe1ee':'#e7d9f2')}
  let d='';out.slice(0,i+1).forEach((r,j)=>{if(j%2===0)d+=(d?'L':'M')+fmt(X(r[1]))+' '+fmt(Y(r[2]))});o+=P(d,C.blue,2)+Ci(cx,cy,5,C.ink)+Ci(X(out[i][1]),Y(out[i][2]),8,C.coral);
  if(s.k==='off')o+=arrow(60,70,110,70,C.purple,3)+TF(85,60,'push',13,C.purple);
  o+=P3_plot(395,80,180,200,{xr:[0,12],yr:[0,3],series:[{pts:out.slice(0,i+1).map(r=>[r[0],r[3]]),col:C.green}],xt:[0,6,12],yt:[0,1,2,3],xl:'time (s)',yl:'angular momentum'});
  return {svg:o,phase:s.k==='central'?'Every shaded wedge covers the same area: the pull always points at the centre, so turning the picture changes nothing and angular momentum stays fixed.':'The sideways push looks different from different directions, so rotation symmetry is broken and angular momentum is no longer constant (illustrative units).'};
 }});

const P3_NOE_L=[{k:'space',l:['Move the whole experiment','somewhere else']},{k:'time',l:['Run the experiment','tomorrow instead']},{k:'turn',l:['Turn the whole experiment','to face another way']},{k:'phase',l:['Shift the phase of every','charged particle’s wave']}];
const P3_NOE_R=[{k:'turn',l:'angular momentum'},{k:'phase',l:'electric charge'},{k:'space',l:'momentum'},{k:'time',l:'energy'}];
SCENE({id:'symmetry-conservation-noether',name:'Noether’s theorem',tag:'Pair each symmetry with what it conserves',
 definition:'Noether’s theorem pairs each continuous symmetry with a conserved quantity: space with momentum, time with energy, rotation with angular momentum, and the phase symmetry of quantum fields with electric charge.',
 example:'Because an experiment works the same today as tomorrow, energy is conserved; because it works the same here as across the room, momentum is conserved.',
 desc:'Four symmetries on the left and four conserved quantities on the right; lines join the pairs the learner chooses, coloured green when correct.',
 research:'Noether (1918), invited to Göttingen by Hilbert and Klein; she was not allowed to habilitate as a lecturer until 1919. Einstein’s 1935 tribute in the New York Times called her a creative mathematical genius.',
 dur:10,hint:'Press a symmetry, then the quantity you think it conserves. Check when all four are joined.',
 init:()=>({sel:null,pairs:{},checked:false}),
 watch(p){const n=Math.min(4,Math.floor(p*5)),pairs={};P3_NOE_L.slice(0,n).forEach(x=>pairs[x.k]=x.k);return {sel:null,pairs,checked:n===4}},
 ui:[{b:'Check',act:'check'},{b:'Clear',act:'clear'}],
 on:{l(s,k){s.sel=k;s.checked=false},r(s,k){if(!s.sel)return;for(const a in s.pairs)if(s.pairs[a]===k)delete s.pairs[a];s.pairs[s.sel]=k;s.sel=null;s.checked=false},check(s){s.checked=true},clear(s){s.pairs={};s.sel=null;s.checked=false}},
 draw(s,f,X){
  let o=heading('Symmetry ↔ conserved quantity');const ly=i=>78+i*62;
  o+=TF(140,64,'if the laws don’t change when you…',13,C.muted)+TF(460,64,'…then this is conserved',13,C.muted);
  for(const a in s.pairs){const i=P3_NOE_L.findIndex(x=>x.k===a),j=P3_NOE_R.findIndex(x=>x.k===s.pairs[a]),ok=a===s.pairs[a];o+=L(250,ly(i)+24,350,ly(j)+24,s.checked?(ok?C.green:C.coral):C.blue,3)}
  P3_NOE_L.forEach((x,i)=>{const on=s.sel===x.k;o+=hit(X,'l',x.k,`${x.l.join(' ')}`,R(30,ly(i),220,48,on?C.pale:'#fff',on?C.blue:C.line,8)+TF(140,ly(i)+20,x.l[0],13,C.ink)+TF(140,ly(i)+38,x.l[1],13,C.ink))});
  P3_NOE_R.forEach((x,j)=>{o+=hit(X,'r',x.k,x.l,R(350,ly(j),220,48,'#fff',C.line,8)+TF(460,ly(j)+29,x.l,14,C.ink))});
  const done=Object.keys(s.pairs).length,right=Object.entries(s.pairs).filter(([a,b])=>a===b).length;
  o+=TF(300,350,s.checked?`${right} of 4 correct`:'Noether (1918): every continuous symmetry gives a conserved quantity.',14,s.checked?(right===4?C.green:C.coral):C.ink);
  return {svg:o,phase:s.checked?(right===4?'All four right. These pairings hold in every branch of physics, from orbits to particle colliders.':'Some pairs are crossed: think about which kind of change each quantity cannot survive.'):done?`${done} of 4 joined.`:'Symmetry here means “the laws of physics come out the same after the change”.'};
 }});
