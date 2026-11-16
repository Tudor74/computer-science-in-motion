/* ===================== Physics era 1 · Describing motion (1600s) ===================== */
const P1_G=9.81;
// Axes in a box: returns {svg, X, Y} mapping data to drawing units.
function P1_axes(x,y,w,h,xr,yr,o={}){
 const X=v=>x+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let s=R(x,y,w,h,'#fff',C.grid,6);
 for(const v of o.xt||[]){s+=L(X(v),y,X(v),y+h,'#eef3f6',1)+TF(X(v),y+h+15,v,13,C.muted)}
 for(const v of o.yt||[]){s+=L(x,Y(v),x+w,Y(v),'#eef3f6',1)+TF(x-6,Y(v)+4,v,13,C.muted,'end')}
 if(yr[0]<0&&yr[1]>0)s+=L(x,Y(0),x+w,Y(0),C.line,1.5);
 if(o.xl)s+=TF(x+w/2,y+h+31,o.xl,13,C.muted);
 if(o.yl)s+=TF(x+8,y+15,o.yl,13,C.muted,'start');
 return {svg:s,X,Y};
}
const P1_path=pts=>'M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join('L');
const P1_m=(v,d=1)=>(+v).toFixed(d);
// Real-time runner for Try it experiments: el = seconds since start; stops itself when done() is true.
function P1_start(s,ctx){s.t0=performance.now();s.el=0;s.running=true;ctx.every(30,'tick')}
function P1_tick(s,limit){if(!s.running)return 'stop';s.el=(performance.now()-s.t0)/1000;if(s.el>=limit){s.el=limit;s.running=false;return 'stop'}}

/* ---------- Lesson: position-speed ---------- */
const P1_x1=t=>1.2*t+.35*t*t,P1_v1=t=>1.2+.7*t;
SCENE({id:'position-speed',name:'Position and speed',tag:'Where, and how fast',
 definition:'Position says where something is along a line. Speed is how quickly position changes: distance travelled divided by the time taken.',
 example:'A cart that covers 12 m in 4 s has an average speed of 3 m/s. On a position–time graph, speed is the steepness (gradient) of the line; a curving line means the speed is changing.',
 desc:'A cart rolls along a track while its position–time graph is drawn; a secant line between two times shows the average speed and a tangent shows the speed at one instant.',
 research:'Galileo (1638). Two New Sciences, Third Day: speed defined by distance and time, the basis of every motion graph.',
 dur:12,hint:'Move the time point, then shrink the interval. The average speed over a shrinking interval settles on the instantaneous speed: the slope of the tangent.',
 init:()=>({t:2,dt:2.5}),
 watch(p){return {t:2,dt:p<.55?2.5:Math.max(.05,2.5*(1-(p-.55)/.4)),tc:Math.min(6,p*11)}},
 ui:[{range:'t',label:'Time',min:0,max:5,step:.25,get:s=>s.t,act:'t',show:v=>v+' s'},{range:'dt',label:'Interval',min:.05,max:3,step:.05,get:s=>s.dt,act:'dt',show:v=>P1_m(v,2)+' s'}],
 on:{t(s,v){s.t=v;s.dt=Math.min(s.dt,6-v)},dt(s,v){s.dt=Math.min(v,6-s.t)}},
 draw(s,f,X){
  const tc=s.tc===undefined?6:s.tc;let out='';
  const tx=v=>40+520*v/20;out+=L(40,58,560,58,C.line,4);for(let m=0;m<=20;m+=5)out+=L(tx(m),52,tx(m),64,C.line,2)+TF(tx(m),80,m+' m',13,C.muted);
  const cx=tx(P1_x1(tc));out+=R(cx-16,36,32,16,C.blue,'none',4)+Ci(cx-9,54,4,C.dark)+Ci(cx+9,54,4,C.dark);
  const A=P1_axes(70,98,480,200,[0,6],[0,20],{xt:[0,1,2,3,4,5,6],yt:[0,5,10,15,20],xl:'time t (s)',yl:'position x (m)'});out+=A.svg;
  const curve=range(61).map(i=>i/10);out+=P(P1_path(curve.map(t=>[A.X(t),A.Y(P1_x1(t))])),C.line,2,'none','stroke-dasharray="5 4"');
  out+=P(P1_path(curve.filter(t=>t<=tc).map(t=>[A.X(t),A.Y(P1_x1(t))]).concat([[A.X(tc),A.Y(P1_x1(tc))]])),C.blue,3.5);
  const t1=s.t,t2=Math.min(6,s.t+s.dt),x1=P1_x1(t1),x2=P1_x1(t2),avg=(x2-x1)/(t2-t1),v=P1_v1(t1);
  const ln=(t0,x0,m,a,b,col,extra)=>{const ta=Math.max(0,a),tb=Math.min(6,b);return L(A.X(ta),A.Y(clamp(x0+m*(ta-t0),-2,22)),A.X(tb),A.Y(clamp(x0+m*(tb-t0),-2,22)),col,2.5,extra)};
  if(tc>=t2){out+=ln(t1,x1,v,t1-1.3,t1+1.3,C.coral,'stroke-dasharray="7 5"')+ln(t1,x1,avg,t1-.6,t2+.6,C.green);
   out+=Ci(A.X(t1),A.Y(x1),6,C.ink)+Ci(A.X(t2),A.Y(x2),6,C.green);
   out+=TBF(170,354,`average over ${P1_m(t2-t1,2)} s: ${P1_m(avg,2)} m/s`,15,C.green)+TBF(440,354,`at t = ${t1} s: ${P1_m(v,2)} m/s`,15,C.coral)}
  return {svg:out,phase:tc<t2?'As the cart rolls, each point of the graph records where it was and when. The graph gets steeper because the cart is speeding up.':`Green: the average speed between ${t1} s and ${P1_m(t2,2)} s (change in position ÷ change in time). Coral, dashed: the tangent, whose slope is the speed at exactly ${t1} s. As the interval shrinks, the green line turns into the tangent.`};
 }});

SCENE({id:'position-speed-velocity',name:'Speed and velocity',tag:'Direction matters',
 definition:'Velocity is speed with a direction. Moving left at 2 m/s and right at 2 m/s are the same speed but opposite velocities, written −2 m/s and +2 m/s.',
 example:'A walker goes right at +2 m/s for 4 s, then back at −1.5 m/s. The speed is always positive; the velocity changes sign when the walker turns round.',
 desc:'A walker moves along a line with an arrow for velocity; a position–time graph and a velocity–time graph are drawn side by side, with the velocity graph dipping below zero when the walker turns back.',
 research:'Vectors for motion: velocity as a directed quantity, formalised in 19th-century vector analysis (Gibbs and Heaviside); the idea of direction-dependent motion goes back to Galileo (1638).',
 dur:10,hint:'Set the velocity for each half of the walk (negative means leftwards) and slide through time. Watch the slope of the position graph match the velocity.',
 init:()=>({v1:2,v2:-1.5,t:6}),
 watch(p){return {v1:2,v2:-1.5,t:8*p}},
 ui:[{range:'v1',label:'First 4 s',min:-2.5,max:2.5,step:.5,get:s=>s.v1,act:'v1',show:v=>v+' m/s'},{range:'v2',label:'Next 4 s',min:-2.5,max:2.5,step:.5,get:s=>s.v2,act:'v2',show:v=>v+' m/s'},{range:'t',label:'Time',min:0,max:8,step:.25,get:s=>s.t,act:'t',show:v=>v+' s'}],
 on:{v1(s,v){s.v1=v},v2(s,v){s.v2=v},t(s,v){s.t=v}},
 draw(s){
  const xAt=t=>10+s.v1*Math.min(t,4)+s.v2*Math.max(0,t-4),vAt=t=>t<4?s.v1:s.v2,x=xAt(s.t),v=vAt(s.t);let out='';
  const tx=m=>60+480*m/20;out+=L(60,70,540,70,C.line,4);for(let m=0;m<=20;m+=5)out+=L(tx(m),64,tx(m),76,C.line,2)+TF(tx(m),92,m+' m',13,C.muted);
  out+=Ci(tx(x),56,11,C.blue);if(Math.abs(v)>.01)out+=arrow(tx(x),34,tx(x)+v*26,34,C.coral,3,9);
  out+=TBF(tx(x),24,v===0?'at rest':`velocity ${v>0?'+':''}${v} m/s`,14,C.coral);
  const A=P1_axes(50,112,230,180,[0,8],[0,20],{xt:[0,4,8],yt:[0,10,20],xl:'time (s)',yl:'position (m)'});out+=A.svg;
  out+=P(P1_path(range(81).map(i=>i/10).map(t=>[A.X(t),A.Y(xAt(t))])),C.line,2,'none','stroke-dasharray="5 4"')+P(P1_path(range(81).map(i=>i/10).filter(t=>t<=s.t).concat([s.t]).map(t=>[A.X(t),A.Y(xAt(t))])),C.blue,3);
  const B=P1_axes(330,112,230,180,[0,8],[-3,3],{xt:[0,4,8],yt:[-2,0,2],xl:'time (s)',yl:'velocity (m/s)'});out+=B.svg;
  out+=L(B.X(0),B.Y(s.v1),B.X(4),B.Y(s.v1),C.coral,3)+L(B.X(4),B.Y(s.v2),B.X(8),B.Y(s.v2),C.coral,3)+L(B.X(s.t),112,B.X(s.t),292,C.ink,1.5,'stroke-dasharray="4 3"')+L(A.X(s.t),112,A.X(s.t),292,C.ink,1.5,'stroke-dasharray="4 3"');
  out+=TBF(300,350,`speed ${Math.abs(v)} m/s · velocity ${v>0?'+':''}${v} m/s · position ${P1_m(x)} m`,15,C.ink);
  return {svg:out,phase:v<0?'Moving left: the velocity is negative and the position graph slopes downwards, but the speed is still a positive number.':v>0?'Moving right: positive velocity, and the position graph slopes upwards. Its steepness equals the velocity.':'Standing still: zero velocity, a flat position graph.'};
 }});

const P1_LOOP=[[0,0],[8,0],[8,4],[0,4],[0,0]],P1_BACK=[[0,0],[8,0],[0,0]];
function P1_along(route,d){let left=d;for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i],len=Math.hypot(b[0]-a[0],b[1]-a[1]);if(left<=len){const u=left/len;return [lerp(a[0],b[0],u),lerp(a[1],b[1],u)]}left-=len}return route[route.length-1]}
SCENE({id:'position-speed-displacement',name:'Distance and displacement',tag:'The path or the arrow',
 definition:'Distance is the length of the path you actually travelled. Displacement is the straight-line change in position, from start to finish, with a direction.',
 example:'Walk once round a 24 m loop and you have travelled 24 m, but your displacement is zero: you are back where you began.',
 desc:'A walker follows a rectangular loop or a there-and-back route; the walked path grows while a straight arrow from the start shows the displacement.',
 research:'Distance as path length and displacement as a vector: standard kinematics, building on Galileo (1638) and vector notation from the 19th century.',
 dur:9,hint:'Choose a route and slide the walker along it. Compare the distance walked with the length of the straight arrow.',
 init:()=>({route:'loop',q:.6}),
 watch(p){return {route:p<.6?'loop':'back',q:p<.6?p/.6:(p-.6)/.4}},
 ui:[{choose:[['loop','Round the pond'],['back','There and back']],label:'Route',get:s=>s.route,act:'route'},{range:'q',label:'Progress',min:0,max:100,step:2,get:s=>Math.round(s.q*100),act:'q',show:v=>v+'%'}],
 on:{route(s,v){s.route=v},q(s,v){s.q=v/100}},
 draw(s){
  const route=s.route==='loop'?P1_LOOP:P1_BACK,total=s.route==='loop'?24:16,d=total*s.q,pos=P1_along(route,d);let out='';
  const M=([x,y])=>[100+x*40,300-y*40];
  if(s.route==='loop')out+=`<ellipse cx="260" cy="220" rx="110" ry="50" fill="#d8ecf5"/>`+TF(260,225,'pond',13,C.muted);
  out+=P(P1_path(route.map(M)),C.line,8,'none','stroke-opacity=".5"');
  const walked=[route[0]];let left=d;for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i],len=Math.hypot(b[0]-a[0],b[1]-a[1]);if(left>=len){walked.push(b);left-=len}else{walked.push(P1_along([a,b],left));break}}
  out+=P(P1_path(walked.map(M)),C.blue,5);
  const disp=Math.hypot(pos[0],pos[1]);if(disp>.05)out+=arrow(...M([0,0]),...M(pos),C.coral,3.5,11);
  out+=Ci(...M([0,0]),7,C.ink)+TF(M([0,0])[0]-6,M([0,0])[1]+24,'start',13,C.muted)+Ci(...M(pos),10,C.blue,'#fff');
  out+=counter(462,90,'distance walked',P1_m(d)+' m',C.blue,124)+counter(462,150,'displacement',P1_m(disp)+' m',C.coral,124);
  if(disp>.05){const ang=Math.atan2(pos[1],pos[0])*180/Math.PI;out+=TF(524,216,`direction ${Math.round(ang)}° from east`,13,C.muted)}
  return {svg:out,phase:disp<.05&&d>1?`Back at the start: ${P1_m(d)} m walked, displacement zero. Average speed is ${P1_m(d)} m ÷ time, but average velocity is zero.`:`The blue path is the distance (${P1_m(d)} m); the coral arrow is the displacement (${P1_m(disp)} m). Displacement can never be longer than the distance.`};
 }});

/* ---------- Lesson: acceleration ---------- */
SCENE({id:'acceleration',name:'Acceleration',tag:'Changing velocity',
 definition:'Acceleration is the rate at which velocity changes: change in velocity divided by the time taken, measured in metres per second per second (m/s²).',
 example:'A car going from 2 m/s to 14 m/s in 6 s accelerates at 2 m/s². The area under its velocity–time graph is the distance covered: s = ut + ½at² = 48 m.',
 desc:'A velocity–time graph whose slope is the acceleration, with the area under it shaded to show the displacement; above, a car leaves a mark every second, the gaps growing.',
 research:'Galileo (1638). Two New Sciences: uniformly accelerated motion, speed growing equally in equal times; the area rule echoes Oresme (c. 1350s).',
 dur:11,hint:'Set the starting velocity and the acceleration, then slide time. The shaded area under the line always equals the displacement.',
 init:()=>({u:2,a:2,t:6}),
 watch(p){return {u:2,a:2,t:8*p}},
 ui:[{range:'u',label:'Start velocity u',min:0,max:10,step:1,get:s=>s.u,act:'u',show:v=>v+' m/s'},{range:'a',label:'Acceleration a',min:-2,max:3,step:.5,get:s=>s.a,act:'a',show:v=>v+' m/s²'},{range:'t',label:'Time',min:0,max:8,step:.5,get:s=>s.t,act:'t',show:v=>v+' s'}],
 on:{u(s,v){s.u=v},a(s,v){s.a=v},t(s,v){s.t=v}},
 draw(s){
  const vAt=t=>s.u+s.a*t,xAt=t=>s.u*t+.5*s.a*t*t,v=vAt(s.t),x=xAt(s.t);let out='';
  const xs=range(9).map(xAt),lo=Math.min(0,...xs),hi=Math.max(10,...xs),tx=m=>50+500*(m-lo)/(hi-lo);
  out+=L(50,66,550,66,C.line,4);range(9).filter(k=>k<=s.t+1e-9).forEach(k=>{out+=Ci(tx(xAt(k)),66,5,C.blue)+TF(tx(xAt(k)),88,k+' s',13,C.muted)});
  out+=R(tx(x)-15,44,30,14,C.blue,'none',4)+TF(50,40,'one mark per second',13,C.muted,'start');
  const A=P1_axes(70,112,480,190,[0,8],[-10,30],{xt:[0,2,4,6,8],yt:[-10,0,10,20,30],xl:'time t (s)',yl:'velocity v (m/s)'});out+=A.svg;
  const samp=range(Math.round(s.t*10)+1).map(i=>i/10);
  if(samp.length>1){out+=`<polygon points="${[[0,0]].concat(samp.map(t=>[t,Math.max(0,vAt(t))])).concat([[s.t,0]]).map(([t,vv])=>fmt(A.X(t))+','+fmt(A.Y(vv))).join(' ')}" fill="${C.pale}"/>`;
   out+=`<polygon points="${[[0,0]].concat(samp.map(t=>[t,Math.min(0,vAt(t))])).concat([[s.t,0]]).map(([t,vv])=>fmt(A.X(t))+','+fmt(A.Y(vv))).join(' ')}" fill="${C.coralp}"/>`}
  out+=L(A.X(0),A.Y(clamp(vAt(0),-10,30)),A.X(8),A.Y(clamp(vAt(8),-10,30)),C.blue,3)+Ci(A.X(s.t),A.Y(clamp(v,-10,30)),6,C.ink);
  out+=TBF(300,352,`v = u + at = ${P1_m(v)} m/s   ·   s = ut + ½at² = ${P1_m(x)} m = shaded area`,15,C.ink);
  return {svg:out,phase:s.a>0?'The line climbs: velocity grows by the same amount every second, so the gaps between the car’s marks grow steadily. The area under the line is the distance covered.':s.a<0?'Negative acceleration: the velocity falls each second. Below the axis the car is moving backwards, and that area counts as negative displacement.':'Zero acceleration: constant velocity, a flat line, and equally spaced marks.'};
 }});

SCENE({id:'acceleration-sign',name:'Acceleration at the top',tag:'Zero speed is not zero acceleration',
 definition:'Acceleration and velocity are separate: a ball thrown upwards keeps accelerating downwards at 9.81 m/s² all the way, including at the top where its velocity is momentarily zero.',
 example:'Throw a ball up at 12 m/s. It slows by 9.81 m/s every second, stops for an instant after 1.22 s at 7.3 m, then speeds up downwards. The acceleration never changes.',
 desc:'A ball rises and falls beside a velocity–time graph; a blue arrow shows velocity shrinking, reversing and growing, while a coral arrow for acceleration stays the same size, always downwards.',
 research:'Galileo (1638). Two New Sciences: vertical throws are uniformly decelerated going up and accelerated coming down; a common misconception studied by Clement (1982), American Journal of Physics 50(1).',
 dur:10,hint:'Change the throw speed and slide time. At the very top, the blue arrow vanishes but the coral one does not.',
 init:()=>({u:12,t:1.22}),
 watch(p){return {u:12,t:p*2*12/P1_G}},
 ui:[{range:'u',label:'Throw speed',min:5,max:20,step:1,get:s=>s.u,act:'u',show:v=>v+' m/s'},{range:'t',label:'Time',min:0,max:4,step:.05,get:s=>s.t,act:'t',show:v=>P1_m(v,2)+' s'}],
 on:{u(s,v){s.u=v;s.t=Math.min(s.t,2*v/P1_G)},t(s,v){s.t=Math.min(v,2*s.u/P1_G)}},
 draw(s){
  const T=2*s.u/P1_G,t=Math.min(s.t,T),v=s.u-P1_G*t,h=s.u*t-.5*P1_G*t*t,sc=250/21;let out='';
  out+=L(40,330,200,330,C.ink,2)+TF(120,350,'ground',13,C.muted);const by=330-h*sc;
  for(let m=0;m<=20;m+=5)out+=L(44,330-m*sc,52,330-m*sc,C.line,2)+TF(58,334-m*sc,m+' m',13,C.muted,'start');
  out+=Ci(120,by,11,C.blue);if(Math.abs(v)>.15)out+=arrow(150,by,150,by-v*6,C.blue,3,9);out+=arrow(178,by,178,by+P1_G*6,C.coral,3,9);
  out+=TF(150,by-v*6-(v>0?8:-18),'v',14,C.blue)+TF(190,by+P1_G*6+4,'a',14,C.coral,'start');
  const A=P1_axes(260,70,300,230,[0,4.2],[-21,21],{xt:[0,1,2,3,4],yt:[-20,-10,0,10,20],xl:'time (s)',yl:'velocity (m/s)'});out+=A.svg;
  out+=L(A.X(0),A.Y(s.u),A.X(T),A.Y(-s.u),C.blue,3)+Ci(A.X(t),A.Y(v),6,C.ink);
  out+=TBF(410,350,`v = ${P1_m(v)} m/s · a = −9.81 m/s² · height ${P1_m(h)} m`,14,C.ink);
  out+=TF(410,62,'slope of this line = −9.81 m/s² everywhere',13,C.coral);
  return {svg:out,phase:Math.abs(v)<.4?'At the top the ball is momentarily at rest, but it is still accelerating: a moment later it is moving downwards. Gravity never switches off.':v>0?'Going up, the velocity shrinks by 9.81 m/s every second. The acceleration arrow points down, against the motion.':'Coming down, the velocity grows downwards by 9.81 m/s every second. Same acceleration, now with the motion.'};
 }});

const P1_SURF={dry:6.5,wet:4,ice:1.5};
SCENE({id:'acceleration-braking',name:'Stopping distance',tag:'Twice the speed, four times the braking',
 definition:'Stopping distance is thinking distance (speed × reaction time) plus braking distance (speed² ÷ twice the deceleration). Braking distance grows with the square of the speed.',
 example:'At a steady deceleration of 6.5 m/s², braking from 50 km/h (13.9 m/s) takes about 15 m; from 100 km/h it takes about 59 m, four times as far.',
 desc:'A road with a car, its thinking distance and its braking distance drawn to scale, above a graph of stopping distance against speed that curves upwards.',
 research:'From v² = u² + 2as for constant deceleration (Galileo’s uniformly accelerated motion, 1638). Decelerations here are typical illustrative values; the UK Highway Code (rule 126) publishes stopping distances on the same pattern.',
 dur:10,hint:'Change the speed, the road surface and the reaction time. Doubling the speed doubles the thinking distance but quadruples the braking distance.',
 init:()=>({kmh:50,surf:'dry',rt:.7}),
 watch(p){return {kmh:20+Math.round(p*10)*10,surf:'dry',rt:.7}},
 ui:[{range:'kmh',label:'Speed',min:20,max:130,step:10,get:s=>s.kmh,act:'kmh',show:v=>v+' km/h'},{choose:[['dry','Dry'],['wet','Wet'],['ice','Icy']],label:'Surface',get:s=>s.surf,act:'surf'},{range:'rt',label:'Reaction',min:.4,max:2,step:.1,get:s=>s.rt,act:'rt',show:v=>P1_m(v)+' s'}],
 on:{kmh(s,v){s.kmh=v},surf(s,v){s.surf=v},rt(s,v){s.rt=v}},
 draw(s){
  const a=P1_SURF[s.surf],stop=k=>{const v=k/3.6;return [v*s.rt,v*v/(2*a)]},[th,br]=stop(s.kmh),tot=th+br;let out='';
  const sc=500/Math.max(60,tot*1.05),X0=50;out+=R(40,52,520,58,'#e9edf0','none',6);
  out+=R(X0,64,th*sc,14,C.amber,'none',3)+R(X0+th*sc,64,br*sc,14,C.coral,'none',3);
  out+=R(X0+tot*sc-2,48,4,66,C.ink,'none',1)+R(X0-26,84,30,16,C.blue,'none',4)+Ci(X0-18,102,4,C.dark)+Ci(X0-3,102,4,C.dark);
  out+=TF(X0+th*sc/2,128,`thinking ${P1_m(th)} m`,13,C.amber)+TF(Math.min(520,X0+th*sc+br*sc/2),128,`braking ${P1_m(br)} m`,13,C.coral)+TBF(Math.min(530,X0+tot*sc),44,`${P1_m(tot)} m`,14,C.ink);
  const ks=range(14).map(i=>i*10),mx=Math.max(...ks.map(k=>sum(stop(k)))),ymax=Math.ceil(mx/50)*50;
  const A=P1_axes(80,160,460,150,[0,130],[0,ymax],{xt:[0,30,60,90,120],yt:[0,ymax/2,ymax],xl:'speed (km/h)',yl:'stopping distance (m)'});out+=A.svg;
  out+=P(P1_path(ks.map(k=>[A.X(k),A.Y(stop(k)[0])])),C.amber,2,'none','stroke-dasharray="5 4"')+P(P1_path(ks.map(k=>[A.X(k),A.Y(sum(stop(k)))])),C.coral,3)+Ci(A.X(s.kmh),A.Y(tot),6,C.ink);
  return {svg:out,phase:`At ${s.kmh} km/h (${P1_m(s.kmh/3.6)} m/s) on a ${s.surf==='ice'?'icy':s.surf} road: ${P1_m(th)} m thinking plus ${P1_m(br)} m braking. The dashed line (thinking only) is straight; the total curves upwards because braking distance grows as speed squared.`};
 }});

/* ---------- Lesson: galileo-ramp ---------- */
const P1_aRoll=deg=>5/7*P1_G*Math.sin(deg*Math.PI/180);
function P1_ramp(deg,len=480,x0=60,y0=96){const r=deg*Math.PI/180;return {at:d=>[x0+d*len*Math.cos(r),y0+d*len*Math.sin(r)],end:[x0+len*Math.cos(r),y0+len*Math.sin(r)],r}}
SCENE({id:'galileo-ramp',name:'Galileo’s inclined plane',tag:'Odd numbers in equal times',
 definition:'Galileo slowed falling down by rolling balls down a gentle ramp. In equal intervals of time the ball covers distances in the ratio 1 : 3 : 5 : 7, so total distance grows as time squared.',
 example:'If the ball covers 1 unit in the first beat, after 2 beats it has gone 4 units, after 3 beats 9, after 4 beats 16. Any slope gives the same pattern, just faster or slower.',
 desc:'A ball rolls down a ramp; marks at equal time intervals show distances 1, 4, 9 and 16 from the top, and gaps of 1, 3, 5 and 7.',
 research:'Galileo (1638). Two New Sciences, Third Day, Theorem II and the inclined-plane experiment timed with a water clock. Reconstructed by Settle (1961), Science 133.',
 dur:12,hint:'Change the slope and slide through the beats. The distances change, but the ratios 1 : 3 : 5 : 7 never do.',
 init:()=>({deg:6,k:4}),
 watch(p){return {deg:6,k:Math.min(4,p*4.4)}},
 ui:[{range:'deg',label:'Slope',min:2,max:30,step:1,get:s=>s.deg,act:'deg',show:v=>v+'°'},{range:'k',label:'Beats',min:0,max:4,step:.1,get:s=>s.k,act:'k',show:v=>P1_m(v)}],
 on:{deg(s,v){s.deg=v},k(s,v){s.k=v}},
 draw(s){
  const Lm=2,a=P1_aRoll(s.deg),T=Math.sqrt(2*Lm/a)/4,ramp=P1_ramp(s.deg);let out='';
  out+=L(...ramp.at(0),...ramp.end,C.dark,6)+L(60,96,60,ramp.end[1]+6,C.line,2,'stroke-dasharray="3 4"');
  for(let k=1;k<=4;k++){const d=k*k/16,[x,y]=ramp.at(d),rung=k<=s.k+1e-9;out+=L(x-8*Math.sin(ramp.r),y+8*Math.cos(ramp.r),x+20*Math.sin(ramp.r),y-20*Math.cos(ramp.r),rung?C.amber:C.line,3)+TF(x+30*Math.sin(ramp.r),y-30*Math.cos(ramp.r),k*k,14,rung?C.amber:C.muted)}
  const d=Math.min(1,s.k*s.k/16),[bx,by]=ramp.at(d);out+=Ci(bx+10*Math.sin(ramp.r),by-10*Math.cos(ramp.r),10,C.blue);
  const gy=Math.min(340,ramp.end[1]+50);out+=TF(60,gy-6,'distances from the top:',13,C.muted,'start');
  [1,3,5,7].forEach((g,i)=>{const on=i+1<=s.k+1e-9;out+=R(60+i*70,gy+2,62,28,on?C.amberp:'#fff',on?C.amber:C.grid,6)+TBF(91+i*70,gy+21,`+${g}`,15,on?C.amber:C.muted)});
  out+=TF(360,gy+21,'gaps in equal times',13,C.muted,'start');
  out+=TF(560,40,`one beat = ${P1_m(T,2)} s`,14,C.ink,'end')+TF(560,58,`a = ${P1_m(a,2)} m/s² (2 m ramp)`,13,C.muted,'end');
  return {svg:out,phase:`After ${P1_m(s.k)} beats the ball has gone ${P1_m(s.k*s.k)} units: distance ∝ time². The gaps between beats go up by the odd numbers 1, 3, 5, 7. Galileo measured times by weighing water from a jet; a steeper slope only shortens the beat.`};
 }});

const P1_BR_DEG=4,P1_BR_L=4,P1_BR_A=P1_aRoll(4),P1_BR_T=Math.sqrt(2*4/P1_aRoll(4));
SCENE({id:'galileo-ramp-bells',name:'Ring the bells in rhythm',tag:'Be Galileo’s assistant',
 definition:'A popular account of Galileo’s method: hang bells along the ramp so the rolling ball rings them in an even rhythm. To get equal times, the bells must be spaced at 1, 4, 9, 16 units from the top.',
 example:'Space the bells equally and they ring faster and faster. Put them at 1/16, 4/16, 9/16 and 16/16 of the ramp and they ring like a steady drumbeat.',
 desc:'A ramp with four bells you can move; when the ball is released, each bell flashes as it rings, and a timeline below shows whether the rings are evenly spaced in time.',
 research:'Galileo (1638). Two New Sciences: distances in equal times follow the odd numbers. The bells (or frets) are from later retellings, e.g. Drake (1975), Scientific American 232(6); the ear’s precision for rhythm makes the method plausible.',
 dur:14,hint:'Move the four bells, then press Release and listen with your eyes. Try to make the four rings evenly spaced in time, or load Galileo’s spacing.',
 init:()=>({pos:[.25,.5,.75,1],el:null,running:false}),
 watch(p){const half=p<.5,u=half?p/.5:(p-.5)/.5;return {pos:half?[.25,.5,.75,1]:[1/16,4/16,9/16,1],el:Math.min(P1_BR_T*1.05,u*P1_BR_T*1.15),running:false}},
 ui:[{range:'b1',label:'Bell 1',min:2,max:100,step:1,get:s=>Math.round(s.pos[0]*100),act:'b0',show:v=>v+'%'},{range:'b2',label:'Bell 2',min:2,max:100,step:1,get:s=>Math.round(s.pos[1]*100),act:'b1',show:v=>v+'%'},{range:'b3',label:'Bell 3',min:2,max:100,step:1,get:s=>Math.round(s.pos[2]*100),act:'b2',show:v=>v+'%'},{range:'b4',label:'Bell 4',min:2,max:100,step:1,get:s=>Math.round(s.pos[3]*100),act:'b3',show:v=>v+'%'},
  {b:'Release',act:'release'},{b:'Equal spacing',act:'equal'},{b:'Galileo’s spacing',act:'galileo'}],
 on:{b0(s,v){s.pos[0]=v/100;s.el=null},b1(s,v){s.pos[1]=v/100;s.el=null},b2(s,v){s.pos[2]=v/100;s.el=null},b3(s,v){s.pos[3]=v/100;s.el=null},
  equal(s){s.pos=[.25,.5,.75,1];s.el=null},galileo(s){s.pos=[1/16,4/16,9/16,1];s.el=null},
  release(s,a,ctx){P1_start(s,ctx)},tick(s){return P1_tick(s,P1_BR_T*1.08)}},
 draw(s){
  const ramp=P1_ramp(10,480,60,80),el=s.el,times=s.pos.map(d=>Math.sqrt(2*d*P1_BR_L/P1_BR_A)).sort((a,b)=>a-b);let out='';
  out+=L(...ramp.at(0),...ramp.end,C.dark,6)+TF(560,40,'slope drawn steeper than the real 4°',13,C.muted,'end');
  s.pos.forEach((d,i)=>{const [x,y]=ramp.at(d),t=Math.sqrt(2*d*P1_BR_L/P1_BR_A),ring=el!==null&&el>=t&&el-t<.35,done=el!==null&&el>=t;
   out+=L(x,y-6,x,y-40,C.muted,2)+`<path d="M${fmt(x-10)} ${fmt(y-40)}Q${fmt(x)} ${fmt(y-62)} ${fmt(x+10)} ${fmt(y-40)}Z" fill="${ring?C.amber:done?C.amberp:'#fff'}" stroke="${C.amber}" stroke-width="2"/>`+TF(x,y-68,i+1,13,C.muted)});
  if(el!==null){const d=Math.min(1,.5*P1_BR_A*el*el/P1_BR_L),[bx,by]=ramp.at(d);out+=Ci(bx+9*Math.sin(ramp.r),by-9*Math.cos(ramp.r),9,C.blue)}
  else out+=Ci(...ramp.at(0).map((v,i)=>v+(i?-9:0)),9,C.blue);
  const tx=t=>60+480*t/(P1_BR_T*1.08),ty=300;out+=L(60,ty,540,ty,C.line,3)+TF(60,ty+22,'0 s',13,C.muted)+TF(540,ty+22,P1_m(P1_BR_T*1.08)+' s',13,C.muted);
  for(let k=1;k<=4;k++)out+=L(tx(P1_BR_T*k/4),ty-10,tx(P1_BR_T*k/4),ty+10,C.green,2,'stroke-dasharray="3 3"');
  times.forEach((t,i)=>{const shown=el===null||el>=t;if(shown)out+=Ci(tx(t),ty,7,C.amber)});
  if(el!==null&&s.running)out+=L(tx(el),ty-16,tx(el),ty+16,C.ink,2);
  const gaps=times.map((t,i)=>t-(i?times[i-1]:0)),mean=sum(gaps)/4,spread=(Math.max(...gaps)-Math.min(...gaps))/mean;
  out+=TF(60,ty-24,'rings (amber) against even beats (green dashes)',13,C.muted,'start');
  const even=spread<.08;out+=TBF(300,358,`gaps: ${gaps.map(g=>P1_m(g,2)).join(' s, ')} s · ${even?'an even rhythm ✓':'uneven: spread '+Math.round(spread*100)+'%'}`,14,even?C.green:C.coral);
  return {svg:out,phase:even?'Even rhythm: the bells sit at 1, 4, 9 and 16 sixteenths of the ramp. Equal times need distances that grow as the square of time.':'The rings bunch together towards the bottom because the ball keeps speeding up. Move the early bells closer to the top to even out the rhythm.'};
 }});

SCENE({id:'galileo-ramp-dilution',name:'Diluting gravity',tag:'Why a gentle slope',
 definition:'On a slope only part of gravity pulls along the ramp: g sin θ. A shallow slope stretches a fall that lasts a fraction of a second into several seconds, long enough to time with a water clock.',
 example:'A ball rolling 2 m down a 3° ramp takes about 3.3 s; dropped 2 m straight down it takes 0.64 s. A rolling ball accelerates at 5/7 of g sin θ, because some energy goes into spinning.',
 desc:'A ramp at an adjustable angle beside a graph of acceleration against slope for a sliding block and a rolling ball, and a water-clock bar showing how much water flows during the descent.',
 research:'Galileo (1638). Two New Sciences: motion on inclined planes as “diluted” fall. The 5/7 factor for a rolling sphere follows from rotational energy (18th-century rigid-body mechanics, Euler).',
 dur:9,hint:'Tilt the ramp from almost flat to vertical. Watch the time to roll 2 m collapse, and the water collected shrink with it.',
 init:()=>({deg:5}),
 watch(p){return {deg:Math.round(2+p*88)}},
 ui:[{range:'deg',label:'Slope',min:1,max:90,step:1,get:s=>s.deg,act:'deg',show:v=>v+'°'}],
 on:{deg(s,v){s.deg=v}},
 draw(s){
  const r=s.deg*Math.PI/180,aS=P1_G*Math.sin(r),aR=s.deg>=90?P1_G:P1_aRoll(s.deg),t=Math.sqrt(2*2/aR);let out='';
  const len=150,x0=60,y0=200;out+=L(x0,y0,x0+len*Math.cos(r),y0-len*Math.sin(r),C.dark,6)+L(x0,y0,x0+len,y0,C.line,2)+TF(x0+46,y0-8,s.deg+'°',14,C.ink,'start');
  out+=Ci(x0+len*Math.cos(r)-10*Math.sin(r),y0-len*Math.sin(r)-10*Math.cos(r),9,C.blue);
  const A=P1_axes(270,60,290,180,[0,90],[0,10],{xt:[0,30,60,90],yt:[0,5,10],xl:'slope (degrees)',yl:'acceleration (m/s²)'});out+=A.svg;
  const ds=range(91);out+=P(P1_path(ds.map(d=>[A.X(d),A.Y(P1_G*Math.sin(d*Math.PI/180))])),C.line,2.5)+P(P1_path(ds.map(d=>[A.X(d),A.Y(d>=90?P1_G:P1_aRoll(d))])),C.blue,3);
  out+=Ci(A.X(s.deg),A.Y(aR),6,C.ink)+TF(A.X(60),A.Y(9.4),'sliding: g sin θ',13,C.muted)+TF(A.X(60),A.Y(5.2),'rolling: 5/7 g sin θ',13,C.blue);
  const flow=12,water=flow*t;out+=TF(60,262,'water clock (illustrative flow 12 g/s):',13,C.muted,'start')+R(60,272,480,24,'#eef3f6','none',6)+R(60,272,Math.min(480,water*2.4),24,'#7fb6d8','none',6)+TF(64+Math.min(470,water*2.4),314,`${P1_m(water,0)} g`,13,C.ink,'start');
  out+=TBF(300,352,`time to roll 2 m: ${P1_m(t,2)} s`,16,C.ink);
  return {svg:out,phase:t>2?`At ${s.deg}° the ball takes ${P1_m(t,1)} s: plenty of water to weigh, so the timing error is small.`:`At ${s.deg}° the descent lasts only ${P1_m(t,2)} s. A water clock (or a human hand) cannot time that well, which is why Galileo used gentle slopes.`};
 }});

/* ---------- Lesson: free-fall ---------- */
const P1_FALL_H=1.6,P1_FEATHER_VT=.5,P1_PLACES={air:{g:9.81,air:true,label:'Earth, in air'},vac:{g:9.81,air:false,label:'Earth, vacuum chamber'},moon:{g:1.62,air:false,label:'Moon (no air)'}};
const P1_featherY=(g,t,vt)=>vt*t-vt*vt/g*(1-Math.exp(-g*t/vt));
SCENE({id:'free-fall',name:'Free fall',tag:'Hammer and feather',
 definition:'Without air resistance, all objects fall with the same acceleration, whatever their mass. On Earth that is about 9.81 m/s²; air drag is what makes a feather drift.',
 example:'On the Moon in 1971, astronaut David Scott dropped a hammer and a falcon feather together: they landed at the same moment. In air on Earth, the feather lags far behind.',
 desc:'A hammer and a feather dropped from shoulder height, side by side; in air the feather drifts down slowly, in a vacuum or on the Moon both land together.',
 research:'Apollo 15 hammer–feather drop, David Scott (2 August 1971). Galileo (1638) argued that in a void all bodies would fall at the same speed.',
 dur:12,hint:'Choose where to drop them, then press Drop. Only air makes the difference.',
 init:()=>({place:'moon',el:null,running:false}),
 watch(p){const k=Math.min(2,Math.floor(p*3)),u=p*3-k;return {place:['air','vac','moon'][k],el:u*1.7,running:false}},
 ui:[{choose:[['air','Earth, air'],['vac','Vacuum'],['moon','Moon']],label:'Where',get:s=>s.place,act:'place'},{b:'Drop',act:'drop'}],
 on:{place(s,v){s.place=v;s.el=null},drop(s,a,ctx){P1_start(s,ctx)},tick(s){return P1_tick(s,3.6)}},
 draw(s){
  const pl=P1_PLACES[s.place],t=s.el||0,top=90,bot=320,sc=(bot-top)/P1_FALL_H;let out=heading(pl.label,32);
  const yH=Math.min(P1_FALL_H,.5*pl.g*t*t),yF=Math.min(P1_FALL_H,pl.air?P1_featherY(pl.g,t,P1_FEATHER_VT):.5*pl.g*t*t);
  out+=R(40,bot,520,30,s.place==='moon'?'#d9d9d4':'#d8e4c8','none',4)+L(120,top,480,top,C.line,1.5,'stroke-dasharray="4 4"')+TF(484,top+4,'1.6 m',13,C.muted,'start');
  const hy=top+yH*sc;out+=R(200,hy-18,10,30,'#8a6a45','none',2)+R(186,hy-24,38,12,C.dark,'none',3)+TF(205,bot+20,'hammer',13,C.ink);
  const fy=top+yF*sc;out+=`<path d="M380 ${fmt(fy-20)}Q394 ${fmt(fy-4)} 380 ${fmt(fy+16)}Q366 ${fmt(fy-4)} 380 ${fmt(fy-20)}Z" fill="#c9b892" stroke="#8d7a55" stroke-width="1.5"/>`+L(380,fy-20,380,fy+20,'#8d7a55',1.5)+TF(380,bot+20,'feather',13,C.ink);
  const tH=Math.sqrt(2*P1_FALL_H/pl.g),tF=pl.air?null:tH;
  out+=TF(300,70,`time ${P1_m(t,2)} s`,14,C.muted);
  return {svg:out,phase:pl.air?`In air the hammer lands after ${P1_m(tH,2)} s; the feather quickly reaches a slow terminal speed (about 0.5 m/s here, illustrative) and takes several seconds.`:`No air: both land together after ${P1_m(tH,2)} s. ${s.place==='moon'?'The Moon’s gravity is about one sixth of Earth’s, so everything falls more slowly, but still together.':'Remove the air and mass makes no difference.'}`};
 }});

SCENE({id:'free-fall-measure',name:'Measure g yourself',tag:'Time a drop',
 definition:'You can estimate g from a drop: time how long an object takes to fall a known height h, then g = 2h ÷ t². Human reaction time makes short drops very inaccurate.',
 example:'From 5 m the true fall takes 1.01 s. Press 0.2 s late and you measure 1.21 s, giving g ≈ 6.8 m/s²: an error of 30%. From 45 m the same delay costs only about 13%.',
 desc:'A ball falls from a tower of chosen height in real time; you press Stop when it lands, and a table compares your time and your value of g with the true ones.',
 research:'g = 2h/t² from Galileo’s law of fall (1638). Human simple reaction times are typically 0.2–0.25 s (Donders 1868; Hick 1952), which is why Galileo slowed falls on ramps instead.',
 dur:12,hint:'Pick a height, press Drop, then press Stop the moment the ball lands. Repeat, and try a taller drop to shrink your error.',
 init:()=>({h:5,el:null,running:false,trials:[]}),
 watch(p){const sim=[[5,.21],[5,.17],[20,.19],[45,.18]].slice(0,Math.floor(p*4.4)).map(([h,d])=>{const tt=Math.sqrt(2*h/P1_G)+d;return {h,t:tt,g:2*h/tt/tt}});return {h:5,el:Math.min(1.01,p*4.4%1*1.2),running:false,trials:sim}},
 ui:[{range:'h',label:'Height',min:2,max:45,step:1,get:s=>s.h,act:'h',show:v=>v+' m'},{b:'Drop',act:'drop'},{b:'Stop!',act:'stop',aria:'Stop the clock when the ball lands'},{b:'Clear',act:'clear'}],
 on:{h(s,v){s.h=v;s.el=null},drop(s,a,ctx){if(s.running)return 'keep';P1_start(s,ctx)},tick(s){return P1_tick(s,Math.sqrt(2*s.h/P1_G)+4)},
  stop(s){if(!s.running)return 'keep';s.running=false;const t=(performance.now()-s.t0)/1000;s.el=t;s.trials=s.trials.concat({h:s.h,t,g:2*s.h/t/t}).slice(-6)},clear(s){s.trials=[];s.el=null}},
 draw(s){
  const tT=Math.sqrt(2*s.h/P1_G),top=60,bot=320;let out='';
  out+=R(70,top,40,bot-top,'#d9cbb5',C.muted,2)+TF(90,top-8,s.h+' m',14,C.ink)+L(40,bot,250,bot,C.ink,2);
  const t=s.el===null?0:Math.min(s.el,tT),y=top+(bot-top)*Math.min(1,.5*P1_G*t*t/s.h);out+=Ci(140,Math.min(bot-9,y),9,C.blue);
  if(s.running)out+=TF(190,top+20,'falling…',14,C.coral);
  out+=TBF(270,70,'Your drops',15,C.ink,'start');['height','your time','true time','your g'].forEach((h,i)=>out+=TF(270+i*80,92,h,13,C.muted,'start'));
  s.trials.forEach((r,i)=>{const y=114+i*24,tt=Math.sqrt(2*r.h/P1_G),err=Math.abs(r.g-P1_G)/P1_G;out+=TF(270,y,r.h+' m',14,C.ink,'start')+TF(350,y,P1_m(r.t,2)+' s',14,C.ink,'start')+TF(430,y,P1_m(tt,2)+' s',14,C.muted,'start')+TF(510,y,P1_m(r.g,1),14,err<.1?C.green:C.coral,'start')});
  if(!s.trials.length)out+=TF(270,118,'No drops yet: press Drop, then Stop.',14,C.muted,'start');
  const mean=s.trials.length?sum(s.trials.map(r=>r.g))/s.trials.length:null;
  out+=TBF(410,280,mean===null?'true g = 9.81 m/s²':`your mean g = ${P1_m(mean,2)} m/s² (true 9.81)`,15,mean===null?C.muted:Math.abs(mean-P1_G)<1?C.green:C.coral);
  out+=TF(410,304,'a 0.2 s late press: 5 m → g ≈ 6.8 · 45 m → g ≈ 8.6',13,C.muted);
  return {svg:out,phase:s.running?'The ball is falling in real time. Press Stop the moment it lands.':s.trials.length?'Your presses are probably late by a reaction time, so your g comes out low. Longer falls dilute that fixed delay.':`From ${s.h} m the fall takes ${P1_m(tT,2)} s. Can you stop the clock that precisely?`};
 }});

SCENE({id:'free-fall-tied',name:'The tied stones',tag:'Galileo’s thought experiment',
 definition:'Aristotle taught that heavier bodies fall faster. Galileo showed this contradicts itself: tie a light stone to a heavy one and the pair must fall both faster (heavier) and slower (dragged back).',
 example:'If a 10 kg stone falls at speed 10 and a 1 kg stone at speed 1, the tied pair weighs 11 kg so should fall at 11, yet the slow stone should hold the fast one back to below 10. Both cannot be true.',
 desc:'Two stones, one heavy and one light, tied with a cord; bars compare the speeds each theory predicts for each stone alone and for the tied pair, exposing the contradiction.',
 research:'Galileo (1638). Two New Sciences, First Day: the tied-bodies argument. The story of dropping balls from the Tower of Pisa comes from his pupil Viviani and is probably a legend.',
 dur:10,hint:'Change the weights and switch between Aristotle’s rule and Galileo’s. Only one rule gives the tied pair a single answer.',
 init:()=>({H:10,Lw:1,view:'aristotle'}),
 watch(p){return {H:10,Lw:1,view:p<.6?'aristotle':'galileo'}},
 ui:[{range:'H',label:'Heavy stone',min:2,max:10,step:1,get:s=>s.H,act:'H',show:v=>v+' kg'},{range:'Lw',label:'Light stone',min:1,max:9,step:1,get:s=>s.Lw,act:'Lw',show:v=>v+' kg'},{choose:[['aristotle','Aristotle'],['galileo','Galileo']],label:'Rule',get:s=>s.view,act:'view'}],
 on:{H(s,v){s.H=v;s.Lw=Math.min(s.Lw,v-1)},Lw(s,v){s.Lw=Math.min(v,s.H-1)},view(s,v){s.view=v}},
 draw(s){
  const ar=s.view==='aristotle';let out=heading(ar?'Aristotle: speed in proportion to weight':'Galileo: everything falls at the same rate');
  out+=`<path d="M110 120Q105 160 110 200" fill="none" stroke="${C.muted}" stroke-width="2"/>`+Ci(110,100,10+s.Lw*1.2,'#b9b0a2',C.muted)+Ci(110,232,12+s.H*2.2,'#857a6a',C.muted);
  out+=TF(110,102+5,s.Lw+' kg',13,C.ink)+TF(110,237,s.H+' kg',13,'#fff');
  const rows=ar?[['heavy alone',s.H],['light alone',s.Lw],['tied, as one heavier body',s.H+s.Lw],['tied, heavy held back by light','between '+s.Lw+' and '+s.H]]:[['heavy alone','g'],['light alone','g'],['tied together','g'],['',null]];
  const sc=24;rows.forEach(([lab,v],i)=>{if(v===null)return;const y=90+i*58;out+=TF(220,y,lab,14,C.ink,'start');
   if(typeof v==='number'){out+=R(220,y+8,v*sc,22,i===2?C.coral:C.blue,'none',4)+TF(226+v*sc,y+24,'speed '+v,13,C.ink,'start')}
   else if(ar){out+=R(220+s.Lw*sc,y+8,(s.H-s.Lw)*sc,22,C.coralp,C.coral,4,'stroke-dasharray="4 3"')+TF(226+s.H*sc,y+24,'less than '+s.H,13,C.coral,'start')}
   else out+=R(220,y+8,180,22,C.green,'none',4)+TF(406,y+24,'9.81 m/s² for all',13,C.ink,'start')});
  if(ar)out+=R(220,320,340,34,C.coralp,C.coral,8)+TBF(390,342,`Contradiction: ${s.H+s.Lw} and less than ${s.H} at once`,14,C.coral);
  else out+=TF(390,330,'No contradiction: tying them together changes nothing',14,C.green);
  return {svg:out,phase:ar?'Aristotle’s rule gives the tied pair two incompatible speeds. Galileo concluded the rule itself must be wrong: weight cannot set the speed of fall.':'If all bodies fall alike (ignoring air), the tied pair falls just like each stone. Galileo reached this by argument, before anyone could test it in a vacuum.'};
 }});

/* ---------- Lesson: projectiles ---------- */
SCENE({id:'projectiles',name:'Projectile motion',tag:'Two motions at once',
 definition:'A thrown object moves sideways at a steady speed while falling with constant acceleration. The two motions are independent, and together they trace a parabola.',
 example:'Launched at 20 m/s and 50°, a ball keeps a horizontal speed of 12.9 m/s throughout, while its vertical speed falls from 15.3 m/s through zero and back to −15.3 m/s. It lands 40.2 m away.',
 desc:'A ball flies along a parabola; its shadow on the ground moves at a steady pace and its shadow on the wall rises and falls like a ball thrown straight up, with arrows for the two velocity components.',
 research:'Galileo (1638). Two New Sciences, Fourth Day: the trajectory of a projectile is a parabola, combining uniform horizontal and accelerated vertical motion.',
 dur:11,hint:'Change the angle and the speed, then slide through the flight. The ground shadow moves evenly; the wall shadow moves like a vertical throw.',
 init:()=>({deg:50,v:20,q:.5}),
 watch(p){return {deg:50,v:20,q:Math.min(1,p*1.1)}},
 ui:[{range:'deg',label:'Angle',min:5,max:85,step:5,get:s=>s.deg,act:'deg',show:v=>v+'°'},{range:'v',label:'Speed',min:5,max:30,step:1,get:s=>s.v,act:'v',show:v=>v+' m/s'},{range:'q',label:'Flight',min:0,max:100,step:2,get:s=>Math.round(s.q*100),act:'q',show:v=>v+'%'}],
 on:{deg(s,v){s.deg=v},v(s,v){s.v=v},q(s,v){s.q=v/100}},
 draw(s){
  const r=s.deg*Math.PI/180,vx=s.v*Math.cos(r),vy=s.v*Math.sin(r),T=2*vy/P1_G,Rg=vx*T,Hm=vy*vy/2/P1_G,maxR=s.v*s.v/P1_G,sc=460/maxR,O=[90,320];let out='';
  const W=([x,y])=>[O[0]+x*sc,O[1]-y*sc],t=s.q*T,pos=[vx*t,vy*t-.5*P1_G*t*t];
  out+=L(40,320,580,320,C.ink,2)+L(70,320,70,60,C.line,2);
  for(let m=0;m<=maxR;m+=Math.max(5,Math.round(maxR/5/5)*5))out+=L(...W([m,0]),W([m,0])[0],326,C.line,2)+TF(W([m,0])[0],342,m+' m',13,C.muted);
  out+=P(P1_path(range(41).map(i=>i/40*T).map(tt=>W([vx*tt,vy*tt-.5*P1_G*tt*tt]))),C.line,2,'none','stroke-dasharray="5 4"');
  out+=P(P1_path(range(41).map(i=>i/40*t).map(tt=>W([vx*tt,vy*tt-.5*P1_G*tt*tt]))),C.blue,3);
  const [bx,by]=W(pos);out+=Ci(bx,320,6,C.green)+Ci(70,by,6,C.purple)+L(bx,by,bx,320,C.green,1,'stroke-dasharray="3 3"')+L(70,by,bx,by,C.purple,1,'stroke-dasharray="3 3"');
  const vyy=vy-P1_G*t;out+=arrow(bx,by,bx+vx*3,by,C.green,2.5,8);if(Math.abs(vyy)>.3)out+=arrow(bx,by,bx,by-vyy*3,C.purple,2.5,8);out+=Ci(bx,by,9,C.blue);
  out+=TF(560,50,`range ${P1_m(Rg)} m · height ${P1_m(Hm)} m · flight ${P1_m(T,2)} s`,14,C.ink,'end')+TF(560,70,'no air resistance',13,C.muted,'end');
  return {svg:out,phase:`The green shadow on the ground moves at a steady ${P1_m(vx)} m/s. The purple shadow on the wall rises and falls exactly like a ball thrown straight up at ${P1_m(vy)} m/s. Combined, they make a parabola.`};
 }});

function P1_rangeDrag(v,deg,c){const r=deg*Math.PI/180;if(!c){const T=2*v*Math.sin(r)/P1_G,ux=v*Math.cos(r),uy=v*Math.sin(r);return {R:ux*T,pts:range(41).map(i=>{const t=i/40*T;return [ux*t,Math.max(0,uy*t-.5*P1_G*t*t)]})}}let x=0,y=0,ux=v*Math.cos(r),uy=v*Math.sin(r);const dt=1/240;const pts=[[0,0]];for(let i=0;i<20000;i++){const sp=Math.hypot(ux,uy);ux+=-c*sp*ux*dt;uy+=(-P1_G-c*sp*uy)*dt;const nx=x+ux*dt,ny=y+uy*dt;if(ny<0){const u=y/(y-ny);x=x+(nx-x)*u;pts.push([x,0]);return {R:x,pts}}x=nx;y=ny;if(i%8===0)pts.push([x,y])}return {R:x,pts}}
const P1_rcache=new Map();function P1_rangeCurve(v,c){const k=v+'|'+c;if(!P1_rcache.has(k))P1_rcache.set(k,range(89).map(i=>[i+1,P1_rangeDrag(v,i+1,c).R]));return P1_rcache.get(k)}
SCENE({id:'projectiles-range',name:'The best launch angle',tag:'Why 45°, and when not',
 definition:'On level ground with no air resistance, range is v² sin 2θ ÷ g, largest at 45°, and complementary angles (30° and 60°) land at the same place. Air drag lowers the best angle.',
 example:'At 20 m/s, launches at 30° and 60° both land 35.3 m away; 45° reaches 40.8 m. With strong drag the longest throw comes from an angle below 45°.',
 desc:'Two trajectories for an angle and its complement above a graph of range against launch angle; with drag switched on the curve sinks and its peak moves to a lower angle.',
 research:'Galileo (1638). Two New Sciences, Fourth Day: maximum range at half a right angle, and equal ranges for angles equally above and below it. Drag here is a simple quadratic model, integrated with a fixed time step.',
 dur:11,hint:'Change the angle, the speed and the air drag. With no drag, θ and 90° − θ always land together; with drag they do not.',
 init:()=>({v:20,c:0,deg:30}),
 watch(p){return {v:20,c:p<.55?0:.02,deg:Math.round(10+((p<.55?p/.55:(p-.55)/.45))*70)}},
 ui:[{range:'deg',label:'Angle',min:5,max:85,step:1,get:s=>s.deg,act:'deg',show:v=>v+'°'},{range:'v',label:'Speed',min:10,max:40,step:2,get:s=>s.v,act:'v',show:v=>v+' m/s'},{choose:[[0,'No air'],[.005,'Light drag'],[.02,'Strong drag']],label:'Air',get:s=>s.c,act:'c'}],
 on:{deg(s,v){s.deg=v},v(s,v){s.v=v},c(s,v){s.c=Number(v)}},
 draw(s){
  const curve=P1_rangeCurve(s.v,s.c),best=curve.reduce((a,b)=>b[1]>a[1]?b:a),maxR=s.v*s.v/P1_G;let out='';
  const a=P1_rangeDrag(s.v,s.deg,s.c),b=P1_rangeDrag(s.v,90-s.deg,s.c),sc=300/maxR,W=([x,y])=>[60+x*sc,190-y*sc];
  out+=L(50,190,560,190,C.ink,2)+P(P1_path(b.pts.map(W)),C.purple,2.5,'none','stroke-dasharray="6 4"')+P(P1_path(a.pts.map(W)),C.blue,3);
  out+=TF(W([a.R,0])[0],206,`${s.deg}°: ${P1_m(a.R)} m`,13,C.blue)+TF(Math.min(560,W([b.R,0])[0]+(Math.abs(a.R-b.R)<maxR*.12?0:0)),Math.abs(a.R-b.R)<maxR*.12?222:206,`${90-s.deg}°: ${P1_m(b.R)} m`,13,C.purple);
  const A=P1_axes(80,236,470,90,[0,90],[0,maxR*1.05],{xt:[0,15,30,45,60,75,90],xl:'launch angle (degrees)'});out+=A.svg;
  out+=P(P1_path(curve.map(([d,r])=>[A.X(d),A.Y(r)])),C.blue,2.5)+L(A.X(best[0]),236,A.X(best[0]),326,C.green,2,'stroke-dasharray="4 3"')+Ci(A.X(s.deg),A.Y(a.R),5,C.ink);
  out+=TF(A.X(best[0])+6,276,`best ${best[0]}°`,13,C.green,'start')+TF(84,250,'range',13,C.muted,'start');
  return {svg:out,phase:s.c===0?`No air: ${s.deg}° and ${90-s.deg}° land at the same point, and the best angle is 45° (${P1_m(maxR)} m). The steeper throw just spends longer in the air.`:`With drag the best angle drops to about ${best[0]}°, and the steep throw lands short of its shallow partner: high, slow flights lose more to the air. (Drag model illustrative.)`};
 }});

SCENE({id:'projectiles-monkey',name:'The monkey and the hunter',tag:'Gravity treats both alike',
 definition:'Aim straight at a target that lets go at the instant you fire: you always hit it (if the shot gets there before the ground). The shot and the target fall the same distance in the same time.',
 example:'Aim at a monkey 8 m up, 20 m away. A fast shot hits it just below the branch; a slow shot hits it much lower, but still hits, because both have fallen ½gt² in the same time t.',
 desc:'A gun aims directly at a monkey on a branch; when it fires, the monkey drops; the shot curves down along a parabola and meets the falling monkey, with the no-gravity straight line shown dashed.',
 research:'A classic lecture demonstration of the independence of horizontal and vertical motion, a consequence of Galileo’s analysis of projectiles (1638).',
 dur:11,hint:'Change the shot speed and the monkey’s height, then press Fire. Slow shots still hit, just lower down, unless the monkey reaches the ground first.',
 init:()=>({v:25,H:8,u:0}),
 watch(p){const k=p<.5?0:1,u=Math.min(1,(p-k*.5)/.42);return {v:k?14:30,H:8,u}},
 ui:[{range:'v',label:'Shot speed',min:8,max:40,step:1,get:s=>s.v,act:'v',show:v=>v+' m/s'},{range:'H',label:'Monkey height',min:3,max:12,step:1,get:s=>s.H,act:'H',show:v=>v+' m'},{b:'Fire',act:'fire'}],
 on:{v(s,v){s.v=v;s.u=0},H(s,v){s.H=v;s.u=0},fire(s,a,ctx){s.u=0;s.t0=performance.now();s.running=true;ctx.every(30,'tick')},tick(s){if(!s.running)return 'stop';s.u=Math.min(1,(performance.now()-s.t0)/1600);if(s.u>=1){s.running=false;return 'stop'}}},
 draw(s){
  const D=20,th=Math.atan2(s.H,D),vx=s.v*Math.cos(th),tHit=D/vx,tGround=Math.sqrt(2*s.H/P1_G),hits=tHit<=tGround,tEnd=Math.min(tHit,tGround),t=s.u*tEnd;let out='';
  const sc=22,W=([x,y])=>[70+x*sc,320-y*sc];out+=L(40,320,580,320,C.ink,2);
  out+=L(...W([0,0]),...W([D,s.H]),C.line,1.5,'stroke-dasharray="5 4"')+L(W([D,s.H])[0]-20,W([D,s.H])[1]-12,W([D,s.H])[0]+30,W([D,s.H])[1]-12,'#7a5a3a',5);
  out+=R(W([0,0])[0]-24,W([0,0])[1]-14,34,10,C.dark,'none',2,`transform="rotate(${fmt(-th*180/Math.PI)} ${fmt(W([0,0])[0])} ${fmt(W([0,0])[1])})"`);
  const bx=vx*t,by=s.v*Math.sin(th)*t-.5*P1_G*t*t,my=s.H-.5*P1_G*t*t;
  out+=P(P1_path(range(31).map(i=>i/30*t).map(tt=>W([vx*tt,s.v*Math.sin(th)*tt-.5*P1_G*tt*tt]))),C.blue,2.5);
  const [mx,mY]=W([D,Math.max(0,my)]);out+=Ci(mx,mY-4,11,'#8a6a45')+Ci(mx-8,mY-14,4,'#8a6a45')+Ci(mx+8,mY-14,4,'#8a6a45')+TF(mx+24,mY,'monkey',13,C.ink,'start');
  out+=Ci(...W([bx,Math.max(0,by)]),5,C.coral);
  if(s.u>=1)out+=hits?TBF(300,60,`Hit, ${P1_m(s.H-my)} m below the branch`,16,C.green):TBF(300,60,'The monkey reached the ground first',16,C.coral);
  out+=TF(560,90,`time to reach the tree: ${P1_m(tHit,2)} s`,13,C.muted,'end');
  return {svg:out,phase:'Without gravity the shot would follow the dashed line straight to the branch. With gravity, the shot and the monkey both fall ½gt² in the same time, so the shot still meets the monkey, lower down.'};
 }});

/* ---------- Lesson: relative-motion ---------- */
SCENE({id:'relative-motion',name:'Relative motion',tag:'Galileo’s ship',
 definition:'Motion is always measured relative to something: a frame of reference. A ball dropped from the mast of a steadily moving ship lands at the foot of the mast, because it shares the ship’s motion.',
 example:'On a ship sailing at 6 m/s, a ball dropped from a 12 m mast falls for 1.56 s. On board it falls straight down; from the shore it traces a parabola 9.4 m long, landing at the mast’s foot either way.',
 desc:'A ship sails past the shore while a ball falls from its mast; switch between the shore’s view (a curved path) and the ship’s view (straight down, with the shore sliding backwards).',
 research:'Galileo (1632). Dialogue Concerning the Two Chief World Systems, Second Day: the ship thought experiment and Galilean relativity, against Aristotelian predictions that the ball would fall behind.',
 dur:12,hint:'Switch between the shore and the ship, and change the ship’s speed. The ball lands in the same place relative to the mast; only the shape of its path changes.',
 init:()=>({u:6,frame:'shore',q:1}),
 watch(p){return {u:6,frame:p<.5?'shore':'ship',q:Math.min(1,(p<.5?p/.5:(p-.5)/.5)*1.15)}},
 ui:[{choose:[['shore','From the shore'],['ship','From the ship']],label:'Frame',get:s=>s.frame,act:'frame'},{range:'u',label:'Ship speed',min:0,max:10,step:1,get:s=>s.u,act:'u',show:v=>v+' m/s'},{range:'q',label:'Fall',min:0,max:100,step:2,get:s=>Math.round(s.q*100),act:'q',show:v=>v+'%'}],
 on:{frame(s,v){s.frame=v},u(s,v){s.u=v},q(s,v){s.q=v/100}},
 draw(s){
  const h=12,T=Math.sqrt(2*h/P1_G),t=s.q*T,shore=s.frame==='shore',sc=14;let out=heading(shore?'Seen from the shore':'Seen from the ship',30);
  const shipX=shore?s.u*t:0,base=[180,290],Wx=x=>base[0]+x*sc;
  out+=R(40,290,520,60,'#cfe3ef','none',4);
  const shoreShift=shore?0:-s.u*t;for(let k=-2;k<10;k++){const x=Wx(k*8+shoreShift);if(x>40&&x<560)out+=P(`M${fmt(x)} 278L${fmt(x+10)} 258L${fmt(x+20)} 278Z`,'none',0,'#9bb98c')}
  const sx=Wx(shipX);out+=`<path d="M${fmt(sx-60)} 290L${fmt(sx+70)} 290L${fmt(sx+50)} 312L${fmt(sx-45)} 312Z" fill="#8a6a45"/>`+L(sx,290,sx,290-h*sc,'#5d4630',4);
  const pts=range(31).map(i=>i/30*t).map(tt=>[Wx((shore?s.u*tt:0)),290-(h-.5*P1_G*tt*tt)*sc]);out+=P(P1_path(pts),shore?C.blue:C.green,2.5,'none','stroke-dasharray="5 3"');
  const [bx,by]=pts[pts.length-1];out+=Ci(bx,by,8,C.coral);
  if(shore&&s.u>0)out+=arrow(sx-30,140,sx+20,140,C.muted,2,8)+TF(sx-5,130,s.u+' m/s',13,C.muted);
  if(s.q>=1)out+=TF(560,60,shore?`lands at the mast’s foot, ${P1_m(s.u*T)} m from where it was dropped (shore view)`:'lands at the mast’s foot, straight below',13,C.ink,'end');
  return {svg:out,phase:shore?'From the shore the ball keeps the ship’s forward speed while it falls, so its path is a parabola that ends at the foot of the moving mast.':'On board, nothing reveals the ship’s motion: the ball falls straight down, as on dry land. Steady motion cannot be detected from inside.'};
 }});

SCENE({id:'relative-motion-river',name:'Crossing a river',tag:'Adding velocities as arrows',
 definition:'Velocities add like arrows: a boat’s velocity relative to the bank is its velocity through the water plus the water’s velocity relative to the bank.',
 example:'A boat that can do 3 m/s in still water, pointed straight across a river flowing at 1.5 m/s, actually moves at 3.4 m/s at an angle and lands downstream. To go straight across it must point partly upstream.',
 desc:'A river with a current, a boat’s heading and its actual path to the far bank, beside a triangle of velocity arrows: boat through water plus current equals velocity over the ground.',
 research:'Vector addition of velocities: the parallelogram rule for combining motions, stated by Newton (1687, Principia, Corollary I) and implicit in Galileo’s analysis of compound motion (1638).',
 dur:11,hint:'Change the boat’s speed, the current and the heading, or press Aim straight across. Watch where it lands and how long it takes.',
 init:()=>({vb:3,vc:1.5,head:90}),
 watch(p){const best=Math.round(Math.acos(-1.5/3)*180/Math.PI);return {vb:3,vc:1.5,head:Math.round(90+(best-90)*smooth(p*1.2))}},
 ui:[{range:'vb',label:'Boat speed',min:1,max:5,step:.5,get:s=>s.vb,act:'vb',show:v=>v+' m/s'},{range:'vc',label:'Current',min:0,max:3,step:.5,get:s=>s.vc,act:'vc',show:v=>v+' m/s'},{range:'head',label:'Heading',min:30,max:150,step:5,get:s=>s.head,act:'head',show:v=>v+'°'},{b:'Aim straight across',act:'aim'}],
 on:{vb(s,v){s.vb=v},vc(s,v){s.vc=v},head(s,v){s.head=v},aim(s){if(s.vb>s.vc)s.head=Math.round(Math.acos(-s.vc/s.vb)*180/Math.PI)}},
 draw(s){
  const W=60,r=s.head*Math.PI/180,vx=s.vb*Math.cos(r)+s.vc,vy=s.vb*Math.sin(r),T=W/vy,drift=vx*T,sc=3.6;let out='';
  out+=R(40,80,380,W*sc,'#cfe3ef','none',4)+L(40,80,420,80,'#9bb98c',6)+L(40,80+W*sc,420,80+W*sc,'#9bb98c',6);
  for(let k=0;k<4;k++)out+=arrow(70+k*90,120+k*40,110+k*90,120+k*40,'#9cc3dc',2,7);
  const x0=200,y0=80+W*sc,xe=x0+drift*sc;out+=L(x0,y0,clamp(xe,40,420),80,C.blue,3,'stroke-dasharray="6 4"')+Ci(x0,y0,7,C.ink);
  if(xe>=40&&xe<=420)out+=Ci(xe,80,7,C.blue);else out+=TF(xe>420?410:50,72,xe>420?'lands off to the right →':'← lands off to the left',13,C.coral,xe>420?'end':'start');
  out+=L(x0,y0,x0+28*Math.cos(r),y0-28*Math.sin(r),C.dark,6);
  const O=[500,250],k=24;out+=arrow(O[0],O[1],O[0]+s.vb*Math.cos(r)*k,O[1]-s.vb*Math.sin(r)*k,C.dark,3,8);
  const tip=[O[0]+s.vb*Math.cos(r)*k,O[1]-s.vb*Math.sin(r)*k];if(s.vc>0)out+=arrow(...tip,tip[0]+s.vc*k,tip[1],'#5aa0c8',3,8);out+=arrow(...O,O[0]+vx*k,O[1]-vy*k,C.blue,3,8);
  out+=TF(500,282,'boat + current',13,C.muted)+TF(500,298,'= ground',13,C.muted);
  out+=TBF(300,358,`crossing time ${P1_m(T)} s · lands ${Math.abs(drift)<.5?'straight across':P1_m(Math.abs(drift))+' m '+(drift>0?'downstream':'upstream')} · ground speed ${P1_m(Math.hypot(vx,vy),2)} m/s`,14,C.ink);
  return {svg:out,phase:Math.abs(drift)<.5?'Pointing partly upstream cancels the current: the boat goes straight across, but more slowly, because only part of its speed carries it over.':'The current adds its own arrow to the boat’s: the boat crabs downstream. The crossing time depends only on the across-the-river part of the boat’s velocity.'};
 }});

SCENE({id:'relative-motion-addition',name:'Adding speeds',tag:'Walking on a moving walkway',
 definition:'In everyday physics speeds simply add: your speed relative to the ground is your speed relative to the walkway plus the walkway’s speed relative to the ground. This Galilean rule fails near the speed of light.',
 example:'Walk at 1.5 m/s on a walkway moving at 1 m/s and you pass the ground at 2.5 m/s. Walk backwards at 1 m/s and, to someone standing beside it, you stay in one place.',
 desc:'A moving walkway with a walker, seen either from the ground or from the walkway; arrows show the walkway’s speed, the walker’s speed on it, and their sum.',
 research:'Galilean transformation of velocities, from Galileo (1632) Dialogue; the rule is replaced by Einstein’s velocity addition in special relativity (1905).',
 dur:9,hint:'Change the walkway speed and your walking speed (negative is walking backwards), and switch who is watching.',
 init:()=>({w:1,u:1.5,frame:'ground'}),
 watch(p){return {w:1,u:p<.6?1.5:-1,frame:p<.3?'ground':p<.6?'walkway':'ground'}},
 ui:[{range:'w',label:'Walkway',min:0,max:2,step:.25,get:s=>s.w,act:'w',show:v=>v+' m/s'},{range:'u',label:'You walk',min:-2,max:2,step:.25,get:s=>s.u,act:'u',show:v=>v+' m/s'},{choose:[['ground','From the ground'],['walkway','From the walkway']],label:'Observer',get:s=>s.frame,act:'frame'}],
 on:{w(s,v){s.w=v},u(s,v){s.u=v},frame(s,v){s.frame=v}},
 draw(s,f,X){
  const g=s.w+s.u,fr=s.frame==='ground',sc=70;let out=heading(fr?'Seen by someone standing on the ground':'Seen by someone riding the walkway',30);
  out+=R(60,180,480,40,'#c9d3da','none',6);const off=(X.try?0:X.p*8)*(fr?s.w:0)*20%40;
  for(let k=0;k<13;k++){const x=60+((k*40+off)%480);out+=P(`M${fmt(x)} 192L${fmt(x+10)} 200L${fmt(x)} 208`,'#8da2b0',2)}
  out+=Ci(300,150,12,C.blue)+L(300,162,300,180,C.blue,4);
  const row=(y,v,lab,col)=>{out+=TF(70,y+4,lab,14,C.ink,'start');if(Math.abs(v)>.01)out+=arrow(330,y,330+v*sc,y,col,3,9);out+=TF(330+v*sc+(v>=0?8:-8),y+4,`${v>0?'+':''}${v} m/s`,14,col,v>=0?'start':'end')};
  if(fr){row(250,s.w,'walkway, relative to ground','#8da2b0');row(285,s.u,'you, relative to walkway',C.blue);row(320,g,'you, relative to ground',C.coral)}
  else{row(250,-s.w,'ground, relative to walkway','#8da2b0');row(285,s.u,'you, relative to walkway',C.blue);row(320,0,'walkway, relative to itself',C.muted)}
  out+=L(330,236,330,336,C.line,1.5);
  return {svg:out,phase:fr?(Math.abs(g)<.01?'Walking backwards exactly as fast as the walkway moves forwards: to the ground you stand still. Speeds add, including negative ones.':`Seen from the ground you move at ${s.w} + ${s.u} = ${g} m/s. This simple sum works for everyday speeds; near the speed of light it must be replaced by Einstein’s rule.`):`From the walkway you move at only ${s.u} m/s, and it is the ground that slides past at −${s.w} m/s. Neither view is more correct.`};
 }});
