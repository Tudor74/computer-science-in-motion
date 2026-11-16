/* ===================== Physics era 8 · Relativity, atoms and quanta ===================== */
const P8_C=299792458;               // speed of light, m/s (exact)
const P8_H_EV=4.135667e-15;         // Planck constant, eV·s
const P8_SUP='⁰¹²³⁴⁵⁶⁷⁸⁹';
// Per-item generator: rng() seeds that differ by 1 start almost identically, so spread them first.
function P8_mix(x){x=Math.imul(x^(x>>>16),0x85ebca6b);x=Math.imul(x^(x>>>13),0xc2b2ae35);return (x^(x>>>16))>>>0}
const P8_gen=(i,salt)=>rng(P8_mix(P8_mix(i+1)^Math.imul(salt+7,0x9e3779b1))||1);
function P8_sup(n){return String(n).split('').map(c=>c==='-'?'⁻':P8_SUP[c]||c).join('')}
// Scientific notation with a real superscript: 3.2 × 10⁻⁵.
function P8_sci(x,d=2){if(x===0)return '0';const e=Math.floor(Math.log10(Math.abs(x)));if(e>=-2&&e<=4)return Number(x.toPrecision(d+1)).toString();return (x/10**e).toFixed(d-1)+' × 10'+P8_sup(e)}
// Approximate display colour of a wavelength (visible 380–780 nm); UV and IR get muted tones.
function P8_nm(nm){
 if(nm<380)return '#8f7bb5';if(nm>780)return '#8a3a2a';
 let r=0,g=0,b=0;
 if(nm<440){r=(440-nm)/60;b=1}else if(nm<490){g=(nm-440)/50;b=1}else if(nm<510){g=1;b=(510-nm)/20}
 else if(nm<580){r=(nm-510)/70;g=1}else if(nm<645){r=1;g=(645-nm)/65}else r=1;
 const f=nm<420?.35+.65*(nm-380)/40:nm>700?.35+.65*(780-nm)/80:1,h=v=>Math.round(255*Math.pow(v*f,.8)).toString(16).padStart(2,'0');
 return '#'+h(r)+h(g)+h(b);
}
// A continuous spectrum strip from nm0 to nm1 (optionally dimmed), drawn as thin bands.
function P8_rainbow(x,y,w,h,nm0,nm1,dim=1){let o='';const n=90;for(let i=0;i<n;i++){const nm=nm0+(nm1-nm0)*(i+.5)/n;o+=`<rect x="${fmt(x+w*i/n)}" y="${fmt(y)}" width="${fmt(w/n+.6)}" height="${fmt(h)}" fill="${P8_nm(nm)}" opacity="${dim}"/>`}return o}
// A plot frame with ticks; returns svg and the two scale functions (log y optional).
function P8_plot(o){
 const {x,y,w,h}=o,ly=v=>o.log?Math.log10(Math.max(v,1e-12)):v;
 const sx=v=>x+(v-o.x0)/(o.x1-o.x0)*w,sy=v=>clamp(y+h-(ly(v)-ly(o.y0))/(ly(o.y1)-ly(o.y0))*h,y-2,y+h+2);
 let svg=R(x,y,w,h,'#fff',C.grid,6);
 (o.yt||[]).forEach(v=>{svg+=L(x,sy(v),x+w,sy(v),'#edf2f5',1)+TF(x-5,sy(v)+4,o.yf?o.yf(v):String(v),13,C.muted,'end')});
 (o.xt||[]).forEach(v=>{svg+=L(sx(v),y+h,sx(v),y+h+4,C.muted,1)+TF(sx(v),y+h+17,o.xf?o.xf(v):String(v),13,C.muted)});
 if(o.xl)svg+=TF(x+w/2,y+h+33,o.xl,13,C.muted);
 if(o.yl)svg+=TF(x,y-8,o.yl,13,C.muted,'start');
 return {svg,sx,sy};
}
// Clip a drawing to a rectangle (nested svg).
const P8_clip=(x,y,w,h,inner)=>`<svg x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" viewBox="${fmt(x)} ${fmt(y)} ${fmt(w)} ${fmt(h)}" overflow="hidden">${inner}</svg>`;

/* ---------- Special relativity ---------- */
// Michelson & Morley 1887: effective arm ≈ 11 m, light ≈ 590 nm, Earth's orbital speed 30 km/s.
const P8_MM_SWING=2*11*(3e4)**2/(5.9e-7*P8_C**2); // ≈ 0.37 fringe between 0° and 90°
const P8_mmExpected=deg=>0.5*P8_MM_SWING*Math.cos(2*deg*Math.PI/180);
SCENE({id:'special-relativity',name:'Michelson–Morley experiment',tag:'Looking for the ether wind',
 research:['Michelson & Morley (1887). On the relative motion of the Earth and the luminiferous ether. American Journal of Science.','Einstein (1905). On the electrodynamics of moving bodies.'],
 definition:'An 1887 experiment that split light into two perpendicular arms and recombined it, while the whole apparatus slowly turned. If light travelled through an “ether” that Earth moves through, the interference fringes should have shifted as it turned. They did not.',
 example:'Turning the stone slab through 90° should have shifted the fringes by about 0.4 of a fringe. Michelson and Morley reported a shift certainly less than a twentieth of that, and probably less than a fortieth. Einstein’s special relativity (1905) starts from what this suggests: light’s speed is the same for every observer moving steadily.',
 desc:'A top view of the interferometer on its turning slab, a graph of fringe shift against angle with the ether prediction and the observed result, and two fringe strips.',
 dur:12,hint:'Turn the apparatus and compare the fringe shift the ether theory predicts with what was observed.',
 init:()=>({angle:0,show:'both'}),
 watch(p){return {angle:Math.round(smooth(p)*180),show:'both'}},
 ui:[{range:'angle',label:'Turn',min:0,max:180,step:5,get:s=>s.angle,act:'angle',show:v=>v+'°'},{choose:[['both','Both'],['expected','Ether prediction'],['observed','1887 result']],label:'Show',get:s=>s.show,act:'show'}],
 on:{angle(s,v){s.angle=v},show(s,v){s.show=v}},
 draw(s){
  const a=s.angle,cx=150,cy=210;let out=heading('Does turning change the speed of light?');
  for(let i=0;i<3;i++){const y=72+i*14;out+=arrow(270,y,40,y,'#b9c9d3',1.6,6)}
  out+=TF(155,108,'expected “ether wind”, 30 km/s',13,C.muted);
  let g=Ci(cx,cy,92,'#ece7df','#cfc4b5');
  g+=L(70,cy,cx,cy,'#e0a800',3)+L(cx,cy,238,cy,'#e0a800',3)+L(cx,cy,cx,122,'#e0a800',3)+L(cx,cy,cx,290,'#e0a800',3);
  g+=R(56,cy-10,16,20,C.amber,'none',3)+L(cx-12,cy+12,cx+12,cy-12,C.blue,4)+R(238,cy-14,6,28,C.dark,'none',2)+R(cx-14,116,28,6,C.dark,'none',2)+Ci(cx,296,7,C.dark);
  out+=`<g transform="rotate(${-a} ${cx} ${cy})">${g}</g>`+TF(cx,330,'source → splitter → two arms → telescope',13,C.muted);
  const Q=P8_plot({x:340,y:76,w:236,h:128,x0:0,x1:180,y0:-0.25,y1:0.25,xt:[0,45,90,135,180],xf:v=>v+'°',yt:[-0.2,0,0.2],yf:v=>v.toFixed(1),yl:'fringe shift'});
  out+=Q.svg;
  if(s.show!=='expected')out+=R(340,Q.sy(0.012),236,Q.sy(-0.012)-Q.sy(0.012),C.greenp,'none',0);
  if(s.show!=='observed'){let d='';for(let x=0;x<=180;x+=3)d+=(x?'L':'M')+fmt(Q.sx(x))+' '+fmt(Q.sy(P8_mmExpected(x)));out+=P(d,C.coral,2.5)+Ci(Q.sx(a),Q.sy(P8_mmExpected(a)),6,C.coral)}
  if(s.show!=='expected')out+=L(340,Q.sy(0),576,Q.sy(0),C.green,2.5)+Ci(Q.sx(a),Q.sy(0),6,C.green);
  const shiftE=P8_mmExpected(a)-P8_mmExpected(0),fr=(y,shift,lab,col)=>{let st='';for(let i=-2;i<12;i++){const x=340+i*26+shift*26;st+=R(x,y,13,26,col,'none',0)}return P8_clip(340,y,236,26,st)+R(340,y,236,26,'none',C.grid,4)+TF(336,y+18,lab,13,C.muted,'end')};
  if(s.show!=='observed')out+=fr(250,shiftE,'ether',C.coral);
  if(s.show!=='expected')out+=fr(292,0,'1887',C.green);
  out+=TF(458,338,`At ${a}°: ether predicts ${shiftE>=0?'+':''}${shiftE.toFixed(2)} fringe`,13,C.coral)+TF(458,356,'observed: below about 0.02 fringe',13,C.green);
  return {svg:out,phase:`Turning by ${a}° should have moved the fringes by ${Math.abs(shiftE).toFixed(2)} of a fringe if light’s speed depended on Earth’s motion through an ether. The measured shift stayed near zero at every angle.`};
 },
 three(s,f,X,project){
  const a=s.angle*Math.PI/180,rot=([x,y,z])=>[x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a),z];
  const P=project([[-2.2,-2.2,-0.5],[2.2,2.2,1.2]]);let out='';
  const slab=range(24).map(i=>{const t=i/24*2*Math.PI;return [2*Math.cos(t),2*Math.sin(t),0]});
  out+=poly3(slab.map(v=>[v[0],v[1],-0.25]),P,'#d7cdbf','#b8ab99')+poly3(slab,P,'#ece7df','#b8ab99');
  const beam=(p,q)=>line3(rot(p),rot(q),P,'#e0a800',3.5);
  out+=beam([-1.8,0,.12],[0,0,.12])+beam([0,0,.12],[1.6,0,.12])+beam([0,0,.12],[0,1.6,.12])+beam([0,0,.12],[0,-1.6,.12]);
  out+=point3(rot([1.65,0,.12]),P,C.dark,7)+point3(rot([0,1.65,.12]),P,C.dark,7)+point3(rot([-1.85,0,.12]),P,C.amber,7)+point3(rot([0,-1.65,.12]),P,C.blue,7);
  out+=arrow3([2.2,1.2,1],[-1.2,1.2,1],P,'#9fb3c0',2)+(()=>{const q=P([.5,1.2,1.15]);return label3(q[0],q[1]-6,'ether wind?',14,C.muted)})();
  return {svg:out,title:'The interferometer on its turning stone slab',caption:'The slab floated on mercury so it could turn smoothly. Each arm sends light out and back; the two beams meet in the telescope. Turning swaps which arm faces the supposed ether wind.'};
 }});

SCENE({id:'special-relativity-light-clock',name:'Time dilation',tag:'Moving clocks run slow',
 research:['Einstein (1905). On the electrodynamics of moving bodies.','Rossi & Hall (1941). Variation of the rate of decay of mesotrons with momentum. Physical Review.','Frisch & Smith (1963). Measurement of the relativistic time dilation using μ-mesons. American Journal of Physics.'],
 definition:'A clock moving past you ticks more slowly, as you measure it, by the Lorentz factor γ = 1/√(1 − v²/c²). It follows from light having the same speed for everyone.',
 example:'In a light clock, light bounces between two mirrors. Seen from the ground, the moving clock’s light travels a longer, slanted path at the same speed c, so each tick takes longer. Muons made high in the atmosphere live 2.2 μs on average, yet many reach the ground: at 0.995c their clocks run about ten times slow as seen from Earth.',
 desc:'A light clock at rest beside the same clock moving to the right, with the slanted light path, the Lorentz factor, and the share of muons reaching the ground with and without time dilation.',
 dur:11,hint:'Slide the speed and watch the slanted path, γ, and the muon survival change.',
 init:()=>({b:0.6}),
 watch(p){return {b:Math.round(995*smooth(p))/1000}},
 ui:[{range:'b',label:'Speed v/c',min:0,max:0.995,step:0.005,get:s=>s.b,act:'b',show:v=>Number(v).toFixed(3)}],
 on:{b(s,v){s.b=v}},
 draw(s,f,X){
  const b=s.b,g=1/Math.sqrt(1-b*b),h=130,u=X.try?0.5:(X.p*3)%1;let out=heading(`v = ${b.toFixed(3)}c   γ = ${g.toFixed(3)}`);
  out+=TBF(100,64,'Clock’s own view',13,C.ink);
  out+=R(60,80,80,6,C.dark,'none',2)+R(60,80+h+6,80,6,C.dark,'none',2);
  const yv=80+6+h*(u<.5?1-2*u:2*u-1);out+=L(100,86,100,86+h,'#f1e2a8',2,'stroke-dasharray="4 4"')+Ci(100,yv,7,'#e0a800');
  out+=TF(100,250,'one tick = up and back',13,C.muted);
  const span=2*b*g*h,k=Math.min(1,330/Math.max(span,1)),hh=h*k,x0=230,yb=86+h,yt=yb-hh;
  out+=TBF(395,64,'Same clock passing the ground'+(k<1?` (scaled ×${k.toFixed(2)})`:''),13,C.ink);
  const xs=x0+span*k*u,yp=u<.5?yb-hh*2*u:yt+hh*(2*u-1);
  out+=P(`M${x0} ${yb}L${fmt(x0+span*k/2)} ${fmt(yt)}L${fmt(x0+span*k)} ${yb}`,'#e0a800',2.2,'none','stroke-dasharray="6 4"');
  out+=R(xs-40,yt-6,80,6,C.dark,'none',2)+R(xs-40,yb,80,6,C.dark,'none',2)+Ci(xs,yp,7,'#e0a800')+arrow(xs+46,yt+hh/2,xs+90,yt+hh/2,C.blue,2.5);
  out+=TF(395,250,`path ${g.toFixed(2)}× longer, so each tick takes ${g.toFixed(2)}× as long`,13,C.muted);
  const tau=2.2e-6,t=15000/Math.max(b*P8_C,1),noD=Math.exp(-t/tau),yesD=Math.exp(-t/(g*tau)),pc=v=>v>=0.001?(100*v).toFixed(1)+'%':P8_sci(100*v,2)+'%';
  out+=R(20,268,560,94,'#fff',C.grid,8)+TBF(32,290,'Muons from 15 km up, at this speed',13,C.ink,'start');
  out+=TF(32,314,'lifetime in their own frame 2.2 μs',13,C.muted,'start');
  out+=TBF(32,340,`reaching the ground without time dilation: ${b>0?pc(noD):'0%'}`,13,C.coral,'start')+TBF(330,340,`with time dilation: ${b>0?pc(yesD):'0%'}`,13,C.green,'start');
  return {svg:out,phase:b<0.1?'At everyday speeds γ is within a fraction of a percent of 1, which is why nobody noticed before 1905.':`At ${b.toFixed(3)}c a tick seen from the ground lasts ${g.toFixed(2)} times as long. For muons this is the difference between ${b>0?pc(noD):'0'} and ${pc(yesD)} reaching the ground. Measured muon counts agree with time dilation.`};
 }});

SCENE({id:'special-relativity-simultaneity',name:'Relativity of simultaneity',tag:'Whose “at the same time”?',
 research:'Einstein (1905). On the electrodynamics of moving bodies; train and embankment example in Einstein (1917). Relativity: The Special and General Theory.',
 definition:'Two events that happen at the same time for one observer can happen at different times for another observer moving relative to the first. “At the same time” depends on the frame.',
 example:'Lightning strikes both ends of a moving train just as its middle passes a person on the platform. Light from both strikes reaches the platform observer together. The passenger in the middle of the train is moving towards the front flash, so it reaches them first. Since light’s speed is the same for both, the passenger concludes the front strike happened first.',
 desc:'A train moving right along a platform, two light fronts spreading from scorch marks at its ends, the platform observer in the middle and the passenger at the train’s middle, with the arrival times for each.',
 dur:12,hint:'Set the train’s speed, then step through time to see which flash reaches each observer first.',
 init:()=>({b:0.4}),
 ui:[{range:'b',label:'Train speed v/c',min:0,max:0.6,step:0.05,get:s=>s.b,act:'b',show:v=>Number(v).toFixed(2)}],
 on:{b(s,v){s.b=v}},
 trace(s){const b=s.b,T=1/(1-b)*1.1,fr=[];for(let k=0;k<=16;k++){const t=T*k/16;fr.push({t,say:t<1/(1+b)?'Both strikes happen at t = 0 in the platform frame. Their light spreads out at the same speed c.':t<1?'The passenger, carried towards the front flash, receives it first.':t<1/(1-b)?'Both flashes reach the platform observer together at t = 1: simultaneous for them.':'The back flash finally catches the passenger. They measure light at c too, so they conclude the front strike came first.'})}return fr},
 draw(s,f){
  const b=s.b,t=f.t,X0=270,S=150,xp=x=>X0+x*S;let out=heading('Two lightning strikes, two observers');
  out+=L(30,262,570,262,C.dark,3);for(let x=40;x<570;x+=24)out+=L(x,262,x-8,272,C.line,1.5);
  out+=Ci(xp(-1),258,6,C.coral)+Ci(xp(1),258,6,C.coral)+TF(xp(-1),292,'back strike',13,C.coral)+TF(xp(1),292,'front strike',13,C.coral);
  const tr=b*t;out+=P8_clip(30,150,540,110,R(xp(-1+tr),205,300,40,C.pale,C.blue,8)+range(5).map(i=>R(xp(-1+tr)+20+i*56,214,34,16,'#fff',C.line,3)).join(''));
  const pas=xp(tr);out+=Ci(pas,192,8,C.blue)+L(pas,200,pas,222,C.blue,3)+TF(pas,178,'passenger',13,C.blue);
  out+=Ci(xp(0),300,8,C.green)+L(xp(0),308,xp(0),330,C.green,3)+TF(xp(0),350,'platform observer',13,C.green);
  const front=xp(1-t),back=xp(-1+t);
  out+=P8_clip(30,60,540,300,(t<=2?L(back,150,back,262,'#e0a800',3)+L(front,150,front,262,'#e0a800',3):'')+L(xp(-1-t),150,xp(-1-t),262,'#f1e2a8',2)+L(xp(1+t),150,xp(1+t),262,'#f1e2a8',2));
  const pF=1/(1+b),pB=1/(1-b),got=(tt)=>t>=tt-1e-9;
  out+=R(20,60,250,78,'#fff',C.grid,8)+TBF(30,80,'Arrival times (L/c units)',13,C.ink,'start');
  out+=TF(30,102,`platform: front ${got(1)?'1.00':'…'}, back ${got(1)?'1.00':'…'}`,13,C.green,'start');
  out+=TF(30,124,`passenger: front ${got(pF)?pF.toFixed(2):'…'}, back ${got(pB)?pB.toFixed(2):'…'}`,13,C.blue,'start');
  out+=TF(560,80,`t = ${t.toFixed(2)}`,15,C.ink,'end');
  return {svg:out,phase:f.say};
 },
 three(s,f,X,project){
  const b=s.b,T=Math.min(2.6,1/(1-b)*1.05),P=project([[-2.6,-1.6,0],[2.6,1.6,T]]);let out=axes3(P,['x','y','ct'],[2.6,1.6,T],[-2.6,0,0]);
  for(const cx of [-1,1]){for(let hgt=0.4;hgt<=T+1e-9;hgt+=0.4){const ring=range(40).map(i=>{const a=i/40*2*Math.PI;return [cx+hgt*Math.cos(a),hgt*Math.sin(a),hgt]});out+=poly3(ring,P,'none',cx<0?'#e8c56a':'#f0b48f')}
   for(let i=0;i<8;i++){const a=i/8*2*Math.PI;out+=line3([cx,0,0],[cx+T*Math.cos(a),T*Math.sin(a),T],P,cx<0?'#e8c56a':'#f0b48f',1)}}
  out+=line3([0,0,0],[0,0,T],P,C.green,3.5)+line3([0,0,0],[b*T,0,T],P,C.blue,3.5);
  out+=point3([0,0,1],P,C.green,7)+point3([b/(1+b),0,1/(1+b)],P,C.blue,6);if(1/(1-b)<=T)out+=point3([b/(1-b),0,1/(1-b)],P,C.blue,6);
  out+=point3([-1,0,0],P,C.coral,6)+point3([1,0,0],P,C.coral,6);
  return {svg:out,title:'Light cones of the two strikes',caption:'Time runs upwards. Each strike’s light fills a cone. The platform observer’s straight line meets both cones at the same height; the passenger’s tilted line meets the front cone first.'};
 }});

/* ---------- General relativity ---------- */
SCENE({id:'general-relativity',name:'The equivalence principle',tag:'Gravity or acceleration?',
 research:['Einstein (1907). On the relativity principle and the conclusions drawn from it (the “happiest thought”).','Einstein (1911). On the influence of gravitation on the propagation of light.'],
 definition:'Inside a closed room, being at rest in a gravitational field cannot be told apart from accelerating steadily through empty space. Einstein made this the starting point of general relativity.',
 example:'A dropped ball hits the floor the same way in a lift resting on Earth and in one accelerating at 9.8 m/s² in deep space. In the accelerating lift a light beam crossing the room bends towards the floor, so gravity must bend light too. A freely falling lift feels like no gravity at all.',
 desc:'A closed lift shown resting on Earth, accelerating in space, or falling freely; a dropped ball and a light beam crossing the lift behave the same in the first two cases and float straight in free fall.',
 dur:12,hint:'Choose where the lift is. Compare the ball and the light beam; the bend is exaggerated so you can see it.',
 init:()=>({mode:'space'}),
 watch(p){const i=Math.min(2,Math.floor(p*3));return {mode:['earth','space','float'][i],u:p*3-i}},
 ui:[{choose:[['earth','Resting on Earth'],['space','Accelerating in space'],['float','Falling freely']],label:'Lift',get:s=>s.mode,act:'mode'}],
 on:{mode(s,v){s.mode=v}},
 draw(s,f,X){
  const m=s.mode,u=s.u===undefined?1:clamp(s.u*1.25,0,1);let out=heading(m==='earth'?'Resting on Earth':m==='space'?'Accelerating at 9.8 m/s² in empty space':'Falling freely (or drifting in space)');
  if(m==='space')for(let i=0;i<14;i++){const r=P8_gen(i,7);out+=Ci(30+r()*540,50+r()*300,1.4,'#9fb3c0')}
  if(m==='earth')out+=R(120,318,360,30,'#cbbfa8','none',0)+TF(300,338,'ground',13,C.muted);
  if(m==='space')out+=P('M260 318L300 360L340 318Z',C.amber,2,'#f3c26b')+arrow(520,330,520,250,C.coral,3)+TF(520,350,'thrust',13,C.coral);
  if(m==='earth')out+=arrow(520,230,520,310,C.coral,3)+TF(520,215,'gravity',13,C.coral);
  out+=R(170,70,260,246,'#fff',C.dark,6);
  out+=Ci(206,150,10,'none',C.ink)+L(206,160,206,215,C.ink,2.5)+L(206,215,192,250,C.ink,2.5)+L(206,215,220,250,C.ink,2.5)+L(206,178,236,170,C.ink,2.5);
  const fall=m!=='float',by=fall?172+128*u*u:172-6*u;out+=Ci(244,Math.min(by,304),9,C.blue);
  if(fall)out+=L(244,172,244,Math.min(by,304),C.blue,1.4,'stroke-dasharray="3 4"');
  const xe=172+256*u;let d='M172 110';for(let x=172;x<=xe;x+=4){const q=(x-172)/256;d+=`L${x} ${fmt(110+(fall?60*q*q:0))}`}
  out+=P(d,'#e0a800',3)+TF(300,98,'light beam (bend exaggerated)',13,C.amber);
  return {svg:out,phase:m==='float'?'In free fall the ball floats beside you and light crosses straight: locally, gravity has vanished. Astronauts in orbit are in this state.':'The ball meets the floor and the beam curves down in exactly the same way in both lifts. From inside, there is no way to tell gravity from acceleration, so gravity must bend light as well.'};
 }});

SCENE({id:'general-relativity-curvature',name:'Curved spacetime',tag:'Orbits that do not quite close',
 research:['Einstein (1915). Explanation of the perihelion motion of Mercury from general relativity.','Le Verrier (1859). The unexplained advance of Mercury’s perihelion.'],
 definition:'In general relativity, mass and energy curve spacetime, and freely moving objects follow the straightest possible paths through it. For a planet, those paths are almost Newton’s ellipses, but each orbit turns a little.',
 example:'Mercury’s closest point to the Sun advances about 43 arcseconds per century more than the pull of the other planets explains, roughly 0.1″ per orbit. Newton’s gravity gives a closed ellipse; general relativity gives a slowly turning one, matching the observation.',
 desc:'A top view of an eccentric orbit around a star: a closed Newtonian ellipse, or a rosette that turns each time round, with the exaggeration factor stated, beside a note on what the rubber-sheet picture gets wrong.',
 dur:12,hint:'Switch between Newton and Einstein and change the (hugely exaggerated) turn per orbit.',
 init:()=>({model:'einstein',d:0.08}),
 watch(p){return {model:'einstein',d:0.08,orbits:5*p}},
 ui:[{choose:[['newton','Newton'],['einstein','Einstein']],label:'Gravity',get:s=>s.model,act:'model'},{range:'d',label:'Turn per orbit',min:0.02,max:0.2,step:0.01,get:s=>s.d,act:'d',show:v=>Math.round(v*360)+'°'}],
 on:{model(s,v){s.model=v},d(s,v){s.d=v}},
 draw(s){
  const del=s.model==='newton'?0:s.d,orbs=s.orbits===undefined?5:Math.max(.05,s.orbits),cx=200,cy=205,a=118,e=0.45;let out=heading(s.model==='newton'?'Newton: the same ellipse every time':'Einstein: each orbit turns a little');
  let d='';const steps=Math.ceil(orbs*120);for(let i=0;i<=steps;i++){const ph=orbs*2*Math.PI*i/steps,w=del*ph,r=a*(1-e*e)/(1+e*Math.cos(ph-w));d+=(i?'L':'M')+fmt(cx+r*Math.cos(ph))+' '+fmt(cy-r*Math.sin(ph))}
  out+=P(d,s.model==='newton'?C.blue:C.coral,1.8)+Ci(cx,cy,11,'#f3c26b','#d79a1f');
  const ph=orbs*2*Math.PI,w=del*ph,r=a*(1-e*e)/(1+e*Math.cos(ph-w));out+=Ci(cx+r*Math.cos(ph),cy-r*Math.sin(ph),6,C.dark);
  const real=0.1035,shown=del*360*3600,fac=shown/real;
  out+=R(380,70,200,170,'#fff',C.grid,8)+TBF(390,92,'Real Mercury',13,C.ink,'start')+TF(390,114,'≈ 43″ per century',13,C.muted,'start')+TF(390,134,'≈ 0.1″ per orbit',13,C.muted,'start');
  out+=TBF(390,166,'Shown here',13,C.ink,'start')+TF(390,188,del?`${Math.round(del*360)}° per orbit`:'0° per orbit',13,C.muted,'start')+TF(390,208,del?`exaggerated ${P8_sci(fac,2)} ×`:'(Newton: closed)',13,C.muted,'start');
  out+=R(380,252,200,108,'#fff8e8',C.amber,8)+TBF(390,272,'About the rubber sheet',13,C.amber,'start')+TF(390,292,'It uses gravity to explain',13,C.ink,'start')+TF(390,310,'gravity, and shows space only.',13,C.ink,'start')+TF(390,328,'For slow planets most of the',13,C.ink,'start')+TF(390,346,'effect is time running slower.',13,C.ink,'start');
  return {svg:out,phase:del?`Each orbit here turns by ${Math.round(del*360)}°, about ${P8_sci(fac,2)} times Mercury’s real amount, so the rosette is visible. The real 43″ per century was a known puzzle from 1859 until Einstein’s 1915 calculation.`:'Newton’s inverse-square law alone gives an ellipse that closes on itself. The other planets turn Mercury’s orbit too, but they account for only about 531″ of the observed 574″ per century.'};
 },
 three(s,f,X,project){
  const zf=r=>-1.3/Math.sqrt(r*r+0.35),P=project([[-3,-3,-2.3],[3,3,0]]);let out='';
  for(let i=0;i<24;i++){const t=i/24*2*Math.PI,pts=range(19).map(k=>{const r=0.3+k*0.15;return [r*Math.cos(t),r*Math.sin(t),zf(r)]});for(let k=0;k<18;k++)out+=line3(pts[k],pts[k+1],P,'#b8cad6',1)}
  for(let k=0;k<=6;k++){const r=0.3+k*0.45,ring=range(48).map(i=>{const t=i/48*2*Math.PI;return [r*Math.cos(t),r*Math.sin(t),zf(r)]});out+=poly3(ring,P,'none','#9fb6c6')}
  const ro=1.8,orbit=range(60).map(i=>{const t=i/60*2*Math.PI;return [ro*Math.cos(t),ro*Math.sin(t),zf(ro)+0.02]});out+=poly3(orbit,P,'none',C.coral,'stroke-width="2.5"');
  out+=point3([0,0,zf(0.3)+0.25],P,'#f3c26b',13,'#d79a1f')+point3(orbit[(Math.floor((X.p||0)*60))%60],P,C.dark,6);
  return {svg:out,title:'The rubber-sheet picture (with its limits)',caption:'The dip shows how space is curved around a mass. The picture misleads: the sheet needs gravity to sag, and it leaves out time, which for planets matters most.'};
 }});

SCENE({id:'general-relativity-evidence',name:'Testing general relativity',tag:'Mercury, an eclipse and your phone',
 research:['Dyson, Eddington & Davidson (1920). A determination of the deflection of light by the Sun’s gravitational field. Philosophical Transactions A.','Ashby (2003). Relativity in the Global Positioning System. Living Reviews in Relativity.'],
 definition:'General relativity made predictions that Newton’s theory did not: Mercury’s extra orbital turn, light bending twice as much near the Sun, and clocks running faster higher up. All three have been measured.',
 example:'The 1919 eclipse expedition measured starlight bending near the Sun close to Einstein’s 1.75″ rather than the 0.87″ a Newtonian argument gives. Those plates were less precise than the headlines claimed; radio measurements from the 1970s on confirmed the prediction to better than 1%. GPS satellites must correct their clocks by about 38 μs a day.',
 desc:'Three tests: Mercury’s perihelion advance split into planetary and relativistic parts, the 1919 eclipse measurements with error bars against two predictions, and GPS clock corrections with the position error if ignored.',
 dur:12,hint:'Pick a test. For GPS, slide the hours to see how fast an uncorrected clock would mislead you.',
 init:()=>({ev:'eclipse',hours:24}),
 watch(p){const i=Math.min(2,Math.floor(p*3));return {ev:['mercury','eclipse','gps'][i],hours:Math.round(24*clamp((p*3-i)*1.3,0,1))}},
 ui:[{choose:[['mercury','Mercury'],['eclipse','1919 eclipse'],['gps','GPS clocks']],label:'Test',get:s=>s.ev,act:'ev'},{range:'hours',label:'GPS hours',min:0,max:24,step:1,get:s=>s.hours,act:'hours'}],
 on:{ev(s,v){s.ev=v},hours(s,v){s.hours=v}},
 draw(s){
  let out='',say='';
  if(s.ev==='mercury'){
   out=heading('Mercury’s perihelion: 574″ per century observed');const x0=60,k=460/600;
   out+=R(x0,140,531*k,46,C.blue,'none',4)+R(x0+531*k,140,43*k,46,C.coral,'none',4)+TBF(x0+531*k/2,169,'other planets ≈ 531″',14,'#fff')+TBF(x0+531*k+43*k/2,214,'43″',15,C.coral);
   out+=L(x0+574*k,124,x0+574*k,200,C.ink,2)+TF(x0+574*k,116,'observed 574″',13,C.ink);
   out+=TF(300,262,'Newton’s gravity with all the planets leaves 43″ per century unexplained.',13,C.muted)+TF(300,284,'General relativity predicts 43″ with no adjustable numbers.',13,C.ink);
   say='Le Verrier found the leftover advance in 1859. Proposals included an unseen planet, “Vulcan”. Einstein’s 1915 calculation gave the missing 43″ directly.';
  }else if(s.ev==='eclipse'){
   out=heading('Starlight bending at the Sun’s edge (1919)');
   out+=Ci(120,200,52,'#1c2430')+Ci(120,200,54,'none','#e8c56a')+Ci(214,150,4,'#fff','#9fb3c0')+Ci(232,140,5,C.amber)+L(214,150,232,140,C.amber,1.5,'stroke-dasharray="3 3"')+TF(150,112,'true and apparent star position',13,C.muted);
   const Q=P8_plot({x:310,y:80,w:260,h:210,x0:0,x1:3,y0:0,y1:2.5,yt:[0,0.5,1,1.5,2,2.5],yf:v=>v+'″',yl:'deflection at the Sun’s edge'});
   out+=Q.svg+L(310,Q.sy(1.75),570,Q.sy(1.75),C.coral,2,'stroke-dasharray="6 4"')+TF(566,Q.sy(1.75)-5,'Einstein 1.75″',13,C.coral,'end')+L(310,Q.sy(0.87),570,Q.sy(0.87),C.muted,2,'stroke-dasharray="6 4"')+TF(566,Q.sy(0.87)-5,'Newtonian 0.87″',13,C.muted,'end');
   [[1,1.98,0.12,'Sobral'],[2,1.61,0.30,'Príncipe']].forEach(([x,v,e,n])=>{out+=L(Q.sx(x),Q.sy(v-e),Q.sx(x),Q.sy(v+e),C.ink,2)+Ci(Q.sx(x),Q.sy(v),6,C.blue)+TF(Q.sx(x),306,n,13,C.ink)});
   out+=TF(300,340,'A third Sobral set (≈ 0.93″) was set aside;',13,C.muted)+TF(300,358,'later radio measurements settled it.',13,C.muted);
   say='The 1919 values sat nearer Einstein’s prediction, but with wide uncertainties and a disputed data set. Radio interferometry of quasars in the 1970s confirmed 1.75″ to about 1%.';
  }else{
   out=heading('GPS satellite clocks, per day');const bx=120,zero=200,k=2.4;
   [['speed (special)',-7,C.blue],['height (general)',45,C.coral],['net',38,C.ink]].forEach(([n,v,c],i)=>{const y=86+i*48;out+=R(v<0?zero+v*k:zero,y,Math.abs(v)*k,30,c,'none',4)+TF(bx,y+20,n,13,C.ink,'end')+TBF(v<0?zero+v*k-8:zero+v*k+8,y+20,(v>0?'+':'')+v+' μs',13,c,v<0?'end':'start')});
   out+=L(zero,78,zero,232,C.muted,1.5);
   const km=P8_C*38e-6*s.hours/24/1000;out+=R(60,256,480,90,'#fff',C.grid,8)+TBF(300,282,`Uncorrected after ${s.hours} h: clocks off by ${(38*s.hours/24).toFixed(1)} μs`,14,C.ink)+TBF(300,312,`≈ ${km.toFixed(1)} km of ranging error at the speed of light`,15,C.coral)+TF(300,334,'(so the satellites’ clocks are set to tick slightly slow before launch)',13,C.muted);
   say='Moving fast makes the satellite clocks lose about 7 μs a day; sitting higher in Earth’s gravity makes them gain about 45 μs. Without the net 38 μs correction, positions would drift by kilometres within a day.';
  }
  return {svg:out,phase:say};
 }});

/* ---------- The nucleus ---------- */
const P8_TRACKS=[-95,-70,-45,-25,-12,-5,-1.6,2.4,7,16,32,58,86];
function P8_bez(p0,p1,p2,u){const a=(1-u)*(1-u),b=2*(1-u)*u,c=u*u;return [a*p0[0]+b*p1[0]+c*p2[0],a*p0[1]+b*p1[1]+c*p2[1]]}
SCENE({id:'atomic-nucleus',name:'The nuclear atom',tag:'Thomson’s pudding or Rutherford’s nucleus?',
 research:['Thomson (1904). On the structure of the atom.','Rutherford (1911). The scattering of α and β particles by matter and the structure of the atom. Philosophical Magazine.'],
 definition:'An atom has a tiny, dense, positively charged nucleus holding almost all its mass, with electrons spread around it. Rutherford deduced this in 1911 from alpha particles that bounced back from thin gold foil.',
 example:'In Thomson’s “plum pudding” model positive charge was spread thinly through the atom, so fast alpha particles should pass with tiny deflections. Geiger and Marsden found about 1 in 8000 bounced back by more than 90°. Rutherford said it was “as if you fired a 15-inch shell at a piece of tissue paper and it came back”.',
 desc:'Alpha particle tracks passing an atom: almost straight through Thomson’s spread-out charge, or mostly straight with a few sharply deflected by Rutherford’s small nucleus.',
 dur:11,hint:'Switch models and watch the tracks. Only the nuclear model can turn an alpha particle round.',
 init:()=>({model:'rutherford'}),
 watch(p){return {model:p<.5?'thomson':'rutherford',u:(p<.5?p*2:p*2-1)}},
 ui:[{choose:[['thomson','Plum pudding (Thomson)'],['rutherford','Nucleus (Rutherford)']],label:'Model',get:s=>s.model,act:'model'}],
 on:{model(s,v){s.model=v}},
 draw(s,f,X){
  const ru=s.model==='rutherford',u=s.u===undefined?0.85:clamp(s.u*1.15,0,1),cx=300,cy=205,d=9;let out=heading(ru?'Rutherford: a tiny, heavy nucleus':'Thomson: positive charge spread out like a pudding');
  if(ru)out+=Ci(cx,cy,118,'#f4f8fb',C.line)+Ci(cx,cy,5,C.coral);
  else{out+=Ci(cx,cy,118,'#f9e7df',C.coral);for(let i=0;i<9;i++){const r=P8_gen(i,3),a=r()*6.28,rr=25+r()*80;out+=Ci(cx+rr*Math.cos(a),cy+rr*Math.sin(a),5,C.blue)}}
  P8_TRACKS.forEach(b=>{const th=ru?2*Math.atan(d/(2*Math.abs(b))):0.012*Math.sign(b)*Math.exp(-Math.abs(b)/60),sg=b<0?-1:1,y=cy+b,p0=[20,y],p1=[cx,y],p2=[cx+300*Math.cos(th),y+sg*300*Math.sin(th)*(ru?1:1)];
   const big=ru&&th>0.5,col=big?C.coral:'#9fb3c0';out+=P8_clip(0,40,600,320,P(`M${p0[0]} ${p0[1]}Q${p1[0]} ${p1[1]} ${fmt(p2[0])} ${fmt(p2[1])}`,col,big?2.4:1.4));
   const q=P8_bez(p0,p1,p2,u);if(q[0]>0&&q[0]<600&&q[1]>40&&q[1]<360)out+=Ci(q[0],q[1],4.5,big?C.coral:C.dark)});
  out+=TF(30,62,'alpha particles →',13,C.muted,'start');
  return {svg:out,phase:ru?'Almost all of the atom is empty, so most alphas pass straight through. The few that come close to the concentrated charge swing round sharply, some straight back.':'With charge spread thinly, no alpha particle meets a strong enough push to turn far. Every track bends by less than a degree, which could not explain the back-scattered alphas.'};
 }});

// Geiger–Marsden rerun: impact parameter b uniform over a disc (radius 1); tan(θ/2) = D/(2b).
// D is chosen so that about 1 in 8000 particles scatter beyond 90°, as Geiger and Marsden reported (1909).
const P8_D=2/Math.sqrt(8000),P8_BINS=[10,20,30,45,60,90,120,180];
const P8_SCAT={r:null,angles:[]};
function P8_scatter(n){if(!P8_SCAT.r)P8_SCAT.r=rng(1909);while(P8_SCAT.angles.length<n){const b=Math.sqrt(P8_SCAT.r());P8_SCAT.angles.push(2*Math.atan(P8_D/(2*Math.max(b,1e-9)))*180/Math.PI)}return P8_SCAT.angles.slice(0,n)}
SCENE({id:'atomic-nucleus-scattering',name:'Rerun Geiger and Marsden',tag:'Counting flashes on a screen',
 research:['Geiger & Marsden (1909). On a diffuse reflection of the α-particles. Proceedings of the Royal Society A.','Geiger & Marsden (1913). The laws of deflexion of α particles through large angles. Philosophical Magazine.','Rutherford (1911). Philosophical Magazine.'],
 definition:'Rutherford’s nuclear model predicts how many alpha particles scatter at each angle: the count per unit solid angle falls as 1/sin⁴(θ/2). Geiger and Marsden counted scintillations by eye to test it.',
 example:'Fire alpha particles at the foil. Small deflections are common; beyond 90° only about 1 in 8000 particles arrive. Plotted per unit of solid angle on a log scale, the counts follow Rutherford’s curve across more than four powers of ten.',
 desc:'A count of alpha particles per scattering angle bin, plotted per steradian on a logarithmic scale with counting error bars, against Rutherford’s 1/sin⁴(θ/2) curve, with the number deflected beyond 90°.',
 dur:13,hint:'Fire alpha particles in batches. Watch the points settle onto Rutherford’s curve as the count grows.',
 init:()=>({n:0}),
 watch(p){return {n:Math.round(10**(1+3.6*p))}},
 ui:[{b:'Fire 100',act:'fire',arg:100},{b:'Fire 1000',act:'fire',arg:1000},{b:'Fire 10 000',act:'fire',arg:10000},{b:'Clear',act:'clear'}],
 on:{fire(s,k){s.n=Math.min(200000,s.n+Number(k))},clear(s){s.n=0}},
 draw(s){
  const n=s.n,ang=P8_scatter(n),cnt=P8_BINS.slice(0,-1).map(()=>0);let back=0;
  for(const a of ang){if(a>90)back++;for(let i=0;i<cnt.length;i++)if(a>=P8_BINS[i]&&a<P8_BINS[i+1]){cnt[i]++;break}}
  let out=heading('Alpha particles counted at each angle');
  out+=R(24,120,40,30,C.amber,'none',4)+arrow(64,135,118,135,C.coral,2.2)+R(120,100,6,70,'#d9b44a','none',1)+TF(123,92,'gold foil',13,C.muted)+P('M150 200A60 60 0 0 0 150 70',C.line,2)+Ci(178,108,5,'#7fd3a8')+TF(70,220,'source',13,C.muted);
  out+=TF(110,250,'A zinc sulphide screen',13,C.muted)+TF(110,268,'flashed when hit; they',13,C.muted)+TF(110,286,'counted flashes in the dark.',13,C.muted);
  const Q=P8_plot({x:276,y:62,w:296,h:236,x0:0,x1:180,y0:0.1,y1:1e5,log:true,xt:[0,30,60,90,120,150,180],xf:v=>v+'°',yt:[0.1,1,10,100,1e3,1e4,1e5],yf:v=>v>=1000?'10'+P8_sup(Math.round(Math.log10(v))):String(v),yl:'count per steradian (log)',xl:'scattering angle'});
  out+=Q.svg;
  if(n){let d='';for(let a=8;a<=178;a+=2){const v=n*P8_D*P8_D/(16*Math.PI*Math.sin(a*Math.PI/360)**4);d+=(d?'L':'M')+fmt(Q.sx(a))+' '+fmt(Q.sy(v))}out+=P(d,C.coral,2.2)}
  cnt.forEach((c,i)=>{const a0=P8_BINS[i],a1=P8_BINS[i+1],om=2*Math.PI*(Math.cos(a0*Math.PI/180)-Math.cos(a1*Math.PI/180)),mid=(a0+a1)/2,x=Q.sx(mid);
   if(c>0){const v=c/om,e=Math.sqrt(c)/om;out+=L(x,Q.sy(Math.max(v-e,0.1)),x,Q.sy(v+e),C.blue,2)+Ci(x,Q.sy(v),5,C.blue)}else if(n)out+=Ci(x,Q.sy(0.1),4,'#fff',C.blue)});
  out+=counter(30,300,'alphas fired',String(n),C.ink,110)+counter(150,300,'beyond 90°',String(back),C.coral,110);
  return {svg:out,phase:n?`${n} fired; ${back} bounced back beyond 90° (expected about ${(n/8000).toFixed(n<8000?2:0)}). The blue points are your counts per steradian with ±√N counting errors; the red line is Rutherford’s 1/sin⁴(θ/2) prediction.`:'Fire some alpha particles. Hollow circles mark angle bins with no counts yet.'};
 }});

SCENE({id:'atomic-nucleus-scale',name:'How small is the nucleus?',tag:'A pea in a stadium',
 research:'Rutherford (1911); nuclear radius R ≈ 1.2 fm × A^(1/3) from later electron-scattering measurements (Hofstadter 1956).',
 definition:'A gold atom is about 3 × 10⁻¹⁰ m across; its nucleus is about 1.4 × 10⁻¹⁴ m, some twenty thousand times smaller. Yet the nucleus holds more than 99.9% of the atom’s mass.',
 example:'If a gold atom were blown up to the size of a big stadium, about 200 m across, its nucleus would be a pea of about 1 cm in the middle. Everything else is the electrons’ cloud.',
 desc:'A zoom from a whole gold atom with its electron cloud down to its nucleus, with a scale bar that changes from picometres to femtometres.',
 dur:10,hint:'Zoom in. The nucleus only becomes more than a dot after you have zoomed by about ten thousand times.',
 init:()=>({z:0.5}),
 watch(p){return {z:smooth(p)}},
 ui:[{range:'z',label:'Zoom',min:0,max:1,step:0.01,get:s=>s.z,act:'z',show:v=>'×'+P8_sci(10**(4*v),1)}],
 on:{z(s,v){s.z=v}},
 draw(s){
  const W=10**lerp(Math.log10(4e-10),Math.log10(4e-14),s.z),px=520/W,cx=300,cy=200,ra=1.44e-10*px,rn=7.0e-15*px;let out=heading('Zooming into a gold atom');
  let inner='';for(let i=6;i>=1;i--)inner+=Ci(cx,cy,ra*i/6,'#cfe2f1','none',`opacity="${0.12+0.08*(6-i)}"`);
  if(rn<26)inner+=Ci(cx,cy,Math.max(1.6,rn),C.coral);
  else{const r=rng(790001),k=Math.round(clamp(rn/3,30,140));for(let i=0;i<k;i++){const a=r()*6.283,rr=Math.sqrt(r())*(rn-6);inner+=Ci(cx+rr*Math.cos(a),cy+rr*Math.sin(a),Math.max(4,rn/9),i%5<2?C.coral:'#9fb3c0','#fff','stroke-width="1"')}}
  out+=P8_clip(40,60,520,280,inner)+R(40,60,520,280,'none',C.grid,8);
  const nice=10**Math.floor(Math.log10(W/3)),len=nice*px,lab=nice>=1e-12?(nice/1e-12)+' pm':(nice/1e-15)+' fm';
  out+=L(60,326,60+len,326,C.ink,3)+TBF(60+len/2,318,lab,13,C.ink);
  out+=TF(300,360,`field of view ${P8_sci(W,2)} m · nucleus ${rn<26?'still tiny':'filling the view'}`,13,C.muted);
  return {svg:out,phase:rn<2?'At atom scale the nucleus is far too small to see: the picture is all electron cloud.':rn<26?`Zoomed ${P8_sci(4e-10/W,2)} times, the nucleus is still only a dot.`:'Now the nucleus fills the view: 79 protons and 118 neutrons packed into about 14 femtometres.'};
 }});

/* ---------- The photoelectric effect ---------- */
const P8_METALS={Na:{name:'Sodium',phi:2.3},Cs:{name:'Caesium',phi:2.1},Zn:{name:'Zinc',phi:4.3}};
SCENE({id:'photoelectric-effect',name:'The photoelectric effect',tag:'Colour matters, brightness does not',
 research:['Hertz (1887); Lenard (1902). Observations of the photoelectric effect.','Einstein (1905). On a heuristic point of view concerning the production and transformation of light. Annalen der Physik.'],
 definition:'Light shining on a metal can knock out electrons, but only if its frequency is above a threshold. Brighter light releases more electrons, not faster ones. Einstein explained this in 1905: light arrives in packets (photons) of energy E = hf.',
 example:'Sodium needs about 2.3 eV per electron. Red light (about 1.8 eV per photon) releases nothing however bright it is; violet light (about 3.1 eV) releases electrons even when dim, each with up to 0.8 eV to spare.',
 desc:'A lamp shining photons on a metal plate, electrons leaving with arrows sized by their energy when the photon energy exceeds the work function, and an energy comparison panel.',
 dur:12,hint:'Change the frequency (colour) and the brightness. Try making red light very bright.',
 init:()=>({f:7,I:60,m:'Na'}),
 watch(p){return {f:+(4+8*p).toFixed(1),I:60,m:'Na'}},
 ui:[{range:'f',label:'Frequency',min:3,max:15,step:0.1,get:s=>s.f,act:'f',show:v=>Number(v).toFixed(1)+' × 10¹⁴ Hz'},{range:'I',label:'Brightness',min:0,max:100,step:5,get:s=>s.I,act:'I',show:v=>v+'%'},{choose:[['Na','Sodium'],['Cs','Caesium'],['Zn','Zinc']],label:'Metal',get:s=>s.m,act:'m'}],
 on:{f(s,v){s.f=v},I(s,v){s.I=v},m(s,v){s.m=v}},
 draw(s,f,X){
  const E=P8_H_EV*s.f*1e14,phi=P8_METALS[s.m].phi,ke=E-phi,nm=P8_C/(s.f*1e14)*1e9,col=P8_nm(nm),t=X.try?0.4:(X.p*6)%1,nPh=Math.round(s.I/10);
  let out=heading(`${nm<380?'Ultraviolet':nm>780?'Infrared':'Visible'} light, ${nm.toFixed(0)} nm, on ${P8_METALS[s.m].name.toLowerCase()}`);
  out+=R(24,150,60,60,'#3a4a55','none',8)+Ci(84,180,12,col);
  for(let i=0;i<nPh;i++){const r=P8_gen(i,11),y=150+r()*60,x=96+((r()+t)%1)*220;out+=P(`M${fmt(x)} ${fmt(y)}q4 -6 8 0t8 0t8 0`,col,2.2)}
  out+=R(326,96,18,186,'#a9b4bb',C.dark,3)+TF(335,304,P8_METALS[s.m].name,13,C.muted);
  if(ke>0)for(let i=0;i<nPh;i++){const r=P8_gen(i,71),y=110+r()*160,len=24+44*Math.sqrt(ke/3),x=350+((r()+t)%1)*90;out+=Ci(x,y,4.5,C.blue)+arrow(x+6,y,x+6+len*0.45,y-6+12*r(),C.blue,1.6,6)}
  const Q=P8_plot({x:470,y:96,w:100,h:180,x0:0,x1:1,y0:0,y1:7,yt:[0,2,4,6],yf:v=>v+' eV'});out+=Q.svg;
  out+=R(482,Q.sy(E),34,Q.sy(0)-Q.sy(E),col,'none',2)+L(470,Q.sy(phi),570,Q.sy(phi),C.ink,2,'stroke-dasharray="5 4"')+TF(552,Q.sy(phi)-5,'φ',14,C.ink)+TF(499,Q.sy(E)-5,'hf',13,C.ink);
  if(ke>0)out+=L(530,Q.sy(phi),530,Q.sy(E),C.blue,4)+TF(546,(Q.sy(phi)+Q.sy(E))/2,'KE',13,C.blue,'start');
  out+=TBF(300,340,ke>0?`Each photon: ${E.toFixed(2)} eV − ${phi} eV needed = ${ke.toFixed(2)} eV left for the electron`:`Each photon brings ${E.toFixed(2)} eV; ${phi} eV is needed. No electrons, at any brightness.`,14,ke>0?C.blue:C.coral);
  return {svg:out,phase:ke>0?`Above the threshold: brightness ${s.I}% means more photons per second, so more electrons, but each electron still gets at most ${ke.toFixed(2)} eV. Only the frequency changes that.`:`Below the threshold frequency (${(phi/P8_H_EV/1e14).toFixed(1)} × 10¹⁴ Hz for ${P8_METALS[s.m].name.toLowerCase()}), no single photon has enough energy. Making the light brighter only sends more photons that each fail.`};
 }});

const P8_MILL_PRESET=[6,7,8,9,10,11,12];
const P8_noise=i=>(P8_gen(i,13)()-0.5)*0.06;
function P8_fit(pts){const q=pts.filter(p=>p.V>0);if(q.length<2)return null;const n=q.length,mx=sum(q.map(p=>p.f))/n,my=sum(q.map(p=>p.V))/n,sxx=sum(q.map(p=>(p.f-mx)**2));if(sxx<1e-9)return null;const m=sum(q.map(p=>(p.f-mx)*(p.V-my)))/sxx;return {m,c:my-m*mx}}
function P8_measure(m,f,i){const V=P8_H_EV*f*1e14-P8_METALS[m].phi;return {f,V:V>0?Math.max(0.01,V+P8_noise(i)):0}}
SCENE({id:'photoelectric-millikan',name:'Rerun Millikan’s measurement',tag:'Measuring Planck’s constant',
 research:'Millikan (1916). A direct photoelectric determination of Planck’s “h”. Physical Review.',
 definition:'The stopping voltage that just halts the fastest photoelectrons rises in a straight line with the light’s frequency. Einstein predicted the slope would be h/e, the same for every metal.',
 example:'Millikan set out to disprove Einstein’s equation and instead confirmed it, measuring h to within about half a percent of today’s value. Measure the stopping voltage at several frequencies; the fitted slope gives Planck’s constant, and where the line meets zero gives the metal’s threshold.',
 desc:'A graph of stopping voltage against frequency where each measurement adds a point, with a best-fit line, its slope converted to Planck’s constant, and the threshold frequency where it crosses zero.',
 dur:12,hint:'Choose a metal and frequency, press Measure, and repeat at several frequencies. Then compare your h with 6.626 × 10⁻³⁴ J s.',
 init:()=>({m:'Na',f:9,pts:[]}),
 watch(p){const k=Math.min(7,Math.floor(p*8));return {m:'Na',f:12,pts:P8_MILL_PRESET.slice(0,k).map((f,i)=>P8_measure('Na',f,i))}},
 ui:[{choose:[['Na','Sodium'],['Cs','Caesium'],['Zn','Zinc']],label:'Metal',get:s=>s.m,act:'m'},{range:'f',label:'Frequency',min:4,max:15,step:0.5,get:s=>s.f,act:'f',show:v=>Number(v).toFixed(1)+' × 10¹⁴ Hz'},{b:'Measure',act:'measure'},{b:'Clear points',act:'clear'}],
 on:{m(s,v){s.m=v;s.pts=[]},f(s,v){s.f=v;return 'keep'},measure(s){s.pts=s.pts.concat(P8_measure(s.m,s.f,s.pts.length+1)).slice(-16)},clear(s){s.pts=[]}},
 draw(s){
  let out=heading(`Stopping voltage against frequency: ${P8_METALS[s.m].name.toLowerCase()}`);
  const Q=P8_plot({x:70,y:66,w:330,h:250,x0:0,x1:15,y0:-5,y1:3,xt:[0,3,6,9,12,15],yt:[-4,-2,0,2],yf:v=>v+' V',xl:'frequency (× 10¹⁴ Hz)',yl:'stopping voltage'});
  out+=Q.svg+L(70,Q.sy(0),400,Q.sy(0),C.muted,1.4);
  const fit=P8_fit(s.pts);
  if(fit){out+=L(Q.sx(0),Q.sy(fit.c),Q.sx(15),Q.sy(fit.c+15*fit.m),C.coral,2,'stroke-dasharray="6 4"')}
  s.pts.forEach(p=>out+=p.V>0?Ci(Q.sx(p.f),Q.sy(p.V),6,C.blue):Ci(Q.sx(p.f),Q.sy(0),6,'#fff',C.blue));
  out+=R(418,66,160,250,'#fff',C.grid,8)+TBF(498,90,'Your result',13,C.ink);
  if(fit){const he=fit.m*1e-14,h=he*1.602177e-19,th=-fit.c/fit.m;
   out+=TF(430,118,'slope h/e',13,C.muted,'start')+TBF(430,138,`${P8_sci(he,3)} V s`,13,C.blue,'start')+TF(430,166,'so h =',13,C.muted,'start')+TBF(430,186,`${P8_sci(h,3)} J s`,13,C.coral,'start')+TF(430,206,'accepted 6.626 × 10⁻³⁴',13,C.muted,'start')+TF(430,234,'threshold frequency',13,C.muted,'start')+TBF(430,254,`${th.toFixed(2)} × 10¹⁴ Hz`,13,C.ink,'start')+TF(430,282,`error ${((h/6.62607e-34-1)*100).toFixed(1)}%`,13,C.muted,'start')}
  else out+=TF(430,130,'Measure at least two',13,C.muted,'start')+TF(430,148,'frequencies above the',13,C.muted,'start')+TF(430,166,'threshold to fit a line.',13,C.muted,'start');
  return {svg:out,phase:fit?'Each point is one measurement with a little scatter. Hollow points below the threshold show no current at all. The straight line’s slope is the same for every metal; only the threshold changes.':'Below the threshold the photocurrent is zero, so there is no stopping voltage to measure. Above it the voltage rises in a straight line.'};
 }});

const P8_COLOURS={red:{nm:700,name:'Red'},green:{nm:550,name:'Green'},blue:{nm:450,name:'Blue'},uv:{nm:250,name:'Ultraviolet'}};
SCENE({id:'photoelectric-photons',name:'Photons',tag:'Light comes in packets',
 research:['Planck (1900). On the law of distribution of energy in the normal spectrum (energy quanta).','Einstein (1905). Light quanta.','Compton (1923). A quantum theory of the scattering of X-rays by light elements.'],
 definition:'A photon is the smallest packet of light of a given frequency, with energy E = hf (h = 6.626 × 10⁻³⁴ J s). Brighter light of the same colour means more photons, not bigger ones.',
 example:'A red photon at 700 nm carries about 1.8 eV and a blue one at 450 nm about 2.8 eV. Sodium needs 2.3 eV, so a single blue photon can free an electron and no number of red photons can, because each electron absorbs one photon at a time.',
 desc:'Rows of photons of the chosen colour, their number set by brightness and their size by energy, next to an energy ladder comparing red, green, blue and ultraviolet photons with sodium’s work function.',
 dur:10,hint:'Choose a colour and brightness. Compare what the wave picture predicted with what happens.',
 init:()=>({col:'blue',br:2}),
 watch(p){const k=['red','green','blue','uv'][Math.min(3,Math.floor(p*4))];return {col:k,br:2}},
 ui:[{choose:[['red','Red'],['green','Green'],['blue','Blue'],['uv','Ultraviolet']],label:'Colour',get:s=>s.col,act:'col'},{range:'br',label:'Brightness',min:1,max:4,step:1,get:s=>s.br,act:'br',show:v=>'×'+v}],
 on:{col(s,v){s.col=v},br(s,v){s.br=v}},
 draw(s){
  const c=P8_COLOURS[s.col],E=1239.84/c.nm,ok=E>2.3;let out=heading(`${c.name}: each photon ${E.toFixed(2)} eV`);
  const n=s.br*5,size=6+E*3;for(let i=0;i<n;i++){const x=50+(i%10)*28,y=96+Math.floor(i/10)*46;out+=Ci(x,y,size,P8_nm(c.nm),'#fff')}
  out+=TF(180,74,`brightness ×${s.br} → ${n} photons per moment`,13,C.muted);
  const Q=P8_plot({x:380,y:70,w:190,h:200,x0:0,x1:4,y0:0,y1:5.5,yt:[0,1,2,3,4,5],yf:v=>v+' eV'});out+=Q.svg;
  Object.entries(P8_COLOURS).forEach(([k,v],i)=>{const e=1239.84/v.nm,x=Q.sx(i+0.5);out+=R(x-16,Q.sy(e),32,Q.sy(0)-Q.sy(e),P8_nm(v.nm),k===s.col?C.ink:'none',3)+TF(x,288,k==='uv'?'UV':v.name,13,C.muted)});
  out+=L(380,Q.sy(2.3),570,Q.sy(2.3),C.ink,2,'stroke-dasharray="5 4"')+TF(384,Q.sy(2.3)-6,'sodium 2.3 eV',13,C.ink,'start');
  out+=R(20,230,316,120,'#fff',C.grid,8)+TBF(32,252,'Wave picture predicted',13,C.coral,'start')+TF(32,272,'any colour works if bright enough;',13,C.ink,'start')+TF(32,290,'brighter means faster electrons.',13,C.ink,'start')+TBF(32,316,'Observed',13,C.green,'start')+TF(32,336,ok?`${c.name.toLowerCase()} frees electrons even when dim.`:`${c.name.toLowerCase()} frees none, at any brightness.`,13,C.ink,'start');
  return {svg:out,phase:`Each ${c.name.toLowerCase()} photon carries hf = ${E.toFixed(2)} eV whatever the brightness. Turning up the brightness to ×${s.br} gives ${n} photons, but an electron absorbs them one at a time.`};
 }});

/* ---------- Atomic spectra ---------- */
const P8_balmer=n=>364.56*n*n/(n*n-4); // nm (Balmer 1885; air wavelengths)
SCENE({id:'atomic-spectra',name:'Hydrogen’s line spectrum',tag:'Balmer’s formula',
 research:['Ångström (1868). Measurements of the hydrogen lines.','Balmer (1885). Note on the spectral lines of hydrogen.'],
 definition:'Glowing hydrogen gives off light at only a few sharp wavelengths, not a continuous rainbow. In 1885 Johann Balmer found a simple formula that fits them all: λ = 364.56 nm × n²/(n² − 4) for n = 3, 4, 5, ….',
 example:'n = 3 gives 656.3 nm (red), n = 4 gives 486.1 nm (blue-green), n = 5 gives 434.0 nm and n = 6 gives 410.2 nm (violet). Higher n crowd towards 364.6 nm, in the ultraviolet. Balmer had no explanation; Bohr provided one in 1913.',
 desc:'A dark spectrum strip from 360 to 700 nm with hydrogen’s bright lines appearing one by one, the chosen line highlighted with its Balmer calculation.',
 dur:10,hint:'Change n to see which line the formula picks out, including ones in the ultraviolet.',
 init:()=>({n:3}),
 watch(p){return {n:3+Math.min(6,Math.floor(p*7)),upto:3+Math.min(6,Math.floor(p*7))}},
 ui:[{range:'n',label:'n',min:3,max:9,step:1,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=v}},
 draw(s){
  const x0=40,w=520,nm0=360,nm1=700,sx=nm=>x0+(nm-nm0)/(nm1-nm0)*w,top=s.upto||9;let out=heading('Glowing hydrogen through a prism');
  out+=R(x0,90,w,90,'#10151c','none',6)+R(x0,90,sx(380)-x0,90,'#2a2140','none',6)+TF(sx(370),196,'UV',13,C.muted);
  for(let n=3;n<=top;n++){const l=P8_balmer(n),on=n===s.n;out+=L(sx(l),94,sx(l),176,P8_nm(l),on?5:3)+(n<=6?TF(sx(l),82,l.toFixed(1),13,on?C.ink:C.muted):'')}
  out+=P8_rainbow(x0,210,w,14,380,700,0.35)+[400,450,500,550,600,650,700].map(v=>TF(sx(v),244,v,13,C.muted)).join('')+TF(300,264,'wavelength (nm)',13,C.muted);
  const l=P8_balmer(s.n);out+=R(110,286,380,64,'#fff',C.grid,8)+TM(300,312,`λ = 364.56 × ${s.n}² / (${s.n}² − 4)`,15,C.ink)+TBF(300,338,`= ${l.toFixed(1)} nm ${l<380?'(ultraviolet)':''}`,16,l<380?C.purple:C.blue);
  return {svg:out,phase:`n = ${s.n} gives ${l.toFixed(1)} nm. Every hydrogen line in the visible fits this one formula, a strong hint of hidden structure inside the atom.`};
 }});

const P8_RH=1.09678e7; // Rydberg constant for hydrogen, 1/m
SCENE({id:'atomic-spectra-bohr',name:'Bohr’s energy levels',tag:'Jumps make lines',
 research:'Bohr (1913). On the constitution of atoms and molecules. Philosophical Magazine.',
 definition:'In Bohr’s 1913 model the electron in hydrogen can only have energies Eₙ = −13.6 eV / n². Jumping down from level n₂ to n₁ releases one photon with exactly the energy difference, so 1/λ = R(1/n₁² − 1/n₂²).',
 example:'A jump from n = 3 to n = 2 releases 1.89 eV: the 656 nm red line. Jumps down to n = 1 (the Lyman series) are ultraviolet; jumps to n = 3 (Paschen) are infrared. Bohr’s circular orbits were later replaced by quantum mechanics, but his energy levels for hydrogen are correct.',
 desc:'An energy-level ladder for hydrogen with an arrow for the chosen jump, a small Bohr-orbit sketch with a caveat, and a wavelength ruler from ultraviolet to infrared marking the photon.',
 dur:12,hint:'Choose the lower level (the series) and the upper level, or press a level on the ladder.',
 init:()=>({hi:3,lo:2}),
 watch(p){const seq=[[3,2],[4,2],[5,2],[2,1],[3,1],[4,3],[5,3]],i=Math.min(seq.length-1,Math.floor(p*seq.length));return {hi:seq[i][0],lo:seq[i][1]}},
 ui:[{choose:[[1,'Lyman (to 1)'],[2,'Balmer (to 2)'],[3,'Paschen (to 3)']],label:'Lower level',get:s=>s.lo,act:'lo'},{range:'hi',label:'Upper level',min:2,max:7,step:1,get:s=>s.hi,act:'hi'}],
 on:{lo(s,v){s.lo=Number(v);if(s.hi<=s.lo)s.hi=s.lo+1},hi(s,v){s.hi=Math.max(Number(v),s.lo+1)},lvl(s,n){n=Number(n);if(n>s.lo)s.hi=n;else{s.lo=Math.min(3,n);if(s.hi<=s.lo)s.hi=s.lo+1}}},
 draw(s,f,X){
  const E=n=>-13.6/(n*n),sy=e=>80+(e+14)/14*0,yOf=e=>300-((e+13.6)/13.6)*210;let out=heading(`Jump from n = ${s.hi} to n = ${s.lo}`);
  for(let n=1;n<=7;n++){const y=yOf(E(n)),on=n===s.hi||n===s.lo;out+=hit(X,'lvl',n,`Level ${n}, ${E(n).toFixed(2)} eV`,R(40,y-7,220,14,'transparent','none',0)+L(70,y,250,y,on?C.ink:C.line,on?3:2))+TF(62,y+5,'n='+n,13,on?C.ink:C.muted,'end')+(n<=3?TF(256,y+5,E(n).toFixed(2)+' eV',13,C.muted,'start'):'')}
  out+=L(70,yOf(0),250,yOf(0),C.line,1,'stroke-dasharray="4 4"')+TF(256,yOf(0)+5,'0 (free)',13,C.muted,'start');
  const dE=E(s.hi)*-1-(E(s.lo)*-1),eph=13.6*(1/(s.lo*s.lo)-1/(s.hi*s.hi)),lam=1e9/(P8_RH*(1/(s.lo*s.lo)-1/(s.hi*s.hi))),col=P8_nm(lam);
  out+=arrow(160,yOf(E(s.hi)),160,yOf(E(s.lo))-2,col==='#8f7bb5'||col==='#8a3a2a'?C.coral:col,4,10);
  const cx=470,cy=170;out+=Ci(cx,cy,5,C.coral);for(let n=1;n<=4;n++)out+=Ci(cx,cy,10+n*n*5,'none',n===s.hi||n===s.lo?C.blue:C.line,'stroke-dasharray="3 3"');
  out+=TF(470,268,'Bohr’s orbits: right energies,',13,C.muted)+TF(470,284,'wrong picture of motion',13,C.muted);
  const lx=v=>40+(Math.log10(v)-Math.log10(90))/(Math.log10(2000)-Math.log10(90))*520;
  out+=R(40,310,520,16,'#e9eef1','none',4)+R(lx(380),310,lx(700)-lx(380),16,'none','none',0)+P8_rainbow(lx(380),310,lx(700)-lx(380),16,380,700,.9)+TF(lx(150),344,'ultraviolet',13,C.muted)+TF(lx(1300),344,'infrared',13,C.muted);
  out+=L(lx(lam),302,lx(lam),334,C.ink,3)+TBF(clamp(lx(lam),80,520),360,`${lam.toFixed(1)} nm · ${eph.toFixed(2)} eV`,14,C.ink);
  return {svg:out,phase:`Falling from n = ${s.hi} (${E(s.hi).toFixed(2)} eV) to n = ${s.lo} (${E(s.lo).toFixed(2)} eV) releases one photon of ${eph.toFixed(2)} eV, wavelength ${lam.toFixed(1)} nm${lam<380?', in the ultraviolet':lam>780?', in the infrared':''}. ${s.lo===2?'This is a Balmer line.':s.lo===1?'This is a Lyman line.':'This is a Paschen line.'}`};
 }});

const P8_LINES={H:{name:'Hydrogen',lines:[656.3,486.1,434.0,410.2]},Na:{name:'Sodium',lines:[589.0,589.6]},He:{name:'Helium',lines:[447.1,501.6,587.6,667.8]},Ca:{name:'Calcium',lines:[393.4,396.8,422.7]}};
const P8_FRAUN=[['K',393.4],['H',396.8],['h',410.2],['g',422.7],['G',430.8],['F',486.1],['E',527.0],['b',517.3],['D',589.3],['C',656.3]];
SCENE({id:'atomic-spectra-fraunhofer',name:'Reading starlight',tag:'Dark lines name the elements',
 research:['Fraunhofer (1814). Dark lines in the solar spectrum.','Kirchhoff & Bunsen (1860). Chemical analysis by spectral observations.','Janssen & Lockyer (1868). A new yellow line in light from the Sun’s edge, later named helium.'],
 definition:'Each element absorbs and emits light at the same characteristic wavelengths. Hot gas glows at those lines; cooler gas in front of a hot source removes them, leaving dark lines. Matching the lines tells us what distant stars are made of.',
 example:'The Sun’s spectrum is crossed by dark lines that Fraunhofer labelled in 1814. Kirchhoff and Bunsen showed in 1859–60 that the D lines are sodium and the C and F lines are hydrogen. Helium was first identified from a yellow line at 587.6 nm in light from the Sun’s edge during the 1868 eclipse, before it was found on Earth.',
 desc:'Three strips: an element’s bright emission lines, the same element absorbing from a rainbow, and the Sun’s spectrum with Fraunhofer’s lettered dark lines, with the element’s lines marked for comparison.',
 dur:12,hint:'Pick an element and see whether its fingerprint matches dark lines in the Sun.',
 init:()=>({el:'Na'}),
 watch(p){return {el:['H','Na','Ca','He'][Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:[['H','Hydrogen'],['Na','Sodium'],['Ca','Calcium'],['He','Helium']],label:'Element',get:s=>s.el,act:'el'}],
 on:{el(s,v){s.el=v}},
 draw(s){
  const x0=40,w=520,nm0=380,nm1=700,sx=nm=>x0+(nm-nm0)/(nm1-nm0)*w,E=P8_LINES[s.el];let out=heading(`${E.name}’s fingerprint`);
  out+=TF(x0,72,'hot gas glows (emission)',13,C.muted,'start')+R(x0,78,w,40,'#10151c','none',4)+E.lines.filter(l=>l>=nm0&&l<=nm1).map(l=>L(sx(l),80,sx(l),116,P8_nm(l),3)).join('');
  out+=TF(x0,142,'white light through cool gas (absorption)',13,C.muted,'start')+P8_rainbow(x0,148,w,40,nm0,nm1)+E.lines.filter(l=>l>=nm0&&l<=nm1).map(l=>L(sx(l),148,sx(l),188,'#10151c',3)).join('');
  out+=TF(x0,212,'the Sun, with Fraunhofer’s letters',13,C.muted,'start')+P8_rainbow(x0,218,w,40,nm0,nm1)+P8_FRAUN.map(([k,l])=>L(sx(l),218,sx(l),258,'#10151c',2)+TF(sx(l),274,k,13,C.ink)).join('');
  const match=E.lines.filter(l=>P8_FRAUN.some(([k,v])=>Math.abs(v-l)<0.8));
  E.lines.filter(l=>l>=nm0&&l<=nm1).forEach(l=>{const m=match.includes(l);out+=L(sx(l),284,sx(l),300,m?C.green:C.coral,3)});
  out+=[400,450,500,550,600,650,700].map(v=>TF(sx(v),318,v,13,C.muted)).join('')+TF(300,336,'wavelength (nm)',13,C.muted);
  const say=s.el==='He'?'Helium’s lines are not among the ordinary dark lines. Its yellow 587.6 nm line was seen glowing at the Sun’s edge during the 1868 eclipse, before helium was found on Earth in 1895.':`${E.name}’s lines line up with Fraunhofer’s ${s.el==='Na'?'D lines':s.el==='H'?'C, F and h lines':'H, K and g lines'}: that element is in the Sun’s outer layers.`;
  out+=TBF(300,360,match.length?`${match.length} of ${E.lines.length} lines match the Sun’s dark lines`:'no match among the dark lines',13,match.length?C.green:C.coral);
  return {svg:out,phase:say};
 }});

/* ---------- Quantum interference ---------- */
const P8_sinc=z=>Math.abs(z)<1e-9?1:Math.sin(z)/z;
const P8_I={both:x=>Math.cos(4*Math.PI*x)**2*P8_sinc(2.2*Math.PI*x)**2,which:x=>P8_sinc(2.2*Math.PI*x)**2};
const P8_QS={};
function P8_quanta(mode,n){const c=P8_QS[mode]||(P8_QS[mode]={r:rng(mode==='both'?1989:1990),pts:[]});while(c.pts.length<n){const x=2*c.r()-1;if(c.r()<P8_I[mode](x))c.pts.push([x,c.r()])}return c.pts.slice(0,n)}
function P8_screen(mode,n,x,y,w,h,showCurve){
 const pts=P8_quanta(mode,Math.min(n,4000));let out=R(x,y,w,h,'#141b25','none',6);
 out+=pts.map(([px,py])=>`<circle cx="${fmt(x+w/2+px*w/2)}" cy="${fmt(y+6+py*(h-12))}" r="1.6" fill="#ffe08a"/>`).join('');
 const nb=40,hist=Array(nb).fill(0);pts.forEach(([px])=>{hist[Math.min(nb-1,Math.floor((px+1)/2*nb))]++});const mx=Math.max(1,...hist),hy=y+h+8,hh=70;
 out+=R(x,hy,w,hh,'#fff',C.grid,4)+hist.map((c,i)=>R(x+i*w/nb+1,hy+hh-c/mx*(hh-6),w/nb-2,c/mx*(hh-6),C.blue,'none',1)).join('');
 if(showCurve&&n>0){let d='';for(let i=0;i<=200;i++){const px=-1+2*i/200;d+=(i?'L':'M')+fmt(x+w/2+px*w/2)+' '+fmt(hy+hh-P8_I[mode](px)*(hh-6))}out+=P(d,C.coral,2)}
 return out;
}
SCENE({id:'quantum-interference',name:'One particle at a time',tag:'The double slit, slowly',
 research:['Taylor (1909). Interference fringes with feeble light.','Tonomura, Endo, Matsuda, Kawasaki & Ezawa (1989). Demonstration of single-electron buildup of an interference pattern. American Journal of Physics.'],
 definition:'Send electrons (or photons) through two slits so rarely that only one is in the apparatus at a time. Each arrives at a single point, yet over thousands of arrivals the points build up an interference pattern, as if each had passed through both slits as a wave.',
 example:'In Tonomura’s 1989 experiment the first few hundred electrons look scattered at random; after tens of thousands, clear bright and dark fringes appear. Quantum mechanics predicts the probability of arriving at each point, not where any single electron will land.',
 desc:'A dark detector screen collecting single arrivals as dots, with a histogram beneath it that grows into the two-slit interference pattern and the predicted probability curve.',
 dur:14,hint:'Send particles one batch at a time. Watch the fringes emerge only once many have arrived.',
 init:()=>({n:0}),
 watch(p){return {n:Math.floor(3000*p*p)+1}},
 ui:[{b:'Send 10',act:'send',arg:10},{b:'Send 100',act:'send',arg:100},{b:'Send 1000',act:'send',arg:1000},{b:'Clear',act:'clear'}],
 on:{send(s,k){s.n=Math.min(4000,s.n+Number(k))},clear(s){s.n=0}},
 draw(s){
  let out=heading(`${s.n} particle${s.n===1?'':'s'} so far`);
  out+=R(30,120,40,40,C.amber,'none',6)+arrow(72,140,118,140,'#e0a800',2)+R(126,70,8,52,C.dark,'none',1)+R(126,128,8,24,C.dark,'none',1)+R(126,158,8,52,C.dark,'none',1)+TF(130,226,'two slits',13,C.muted)+TF(50,184,'source',13,C.muted);
  out+=P8_screen('both',s.n,170,60,400,200,s.n>=300);
  return {svg:out,phase:s.n<100?'Each particle lands at one spot. So far the spots look random.':s.n<800?'A pattern is starting to show: some places collect many arrivals, others very few.':'Bright and dark fringes are clear. They match the red curve: the predicted probability for a wave passing through both slits.'};
 }});

SCENE({id:'quantum-interference-which-path',name:'Which slit?',tag:'Looking changes the pattern',
 research:['Feynman, Leighton & Sands (1965). The Feynman Lectures on Physics, vol. III, ch. 1.','Scully, Englert & Walther (1991). Quantum optical tests of complementarity. Nature.'],
 definition:'If the apparatus records which slit each particle went through, in a way that could in principle be read, the interference fringes disappear and the arrivals form two overlapping humps. Knowing the path and seeing interference are complementary.',
 example:'Feynman called the two-slit experiment the one that “has in it the heart of quantum mechanics”. Marking the path does not need a conscious observer: any physical record that distinguishes the two paths is enough to remove the fringes.',
 desc:'The same detector screen and histogram with which-path markers off or on: with markers on, the fringes vanish and only the broad envelope remains.',
 dur:12,hint:'Switch the which-path markers on and off and send particles each time.',
 init:()=>({mark:'on',n:600}),
 watch(p){return {mark:p<.5?'off':'on',n:Math.floor(2400*((p<.5?p*2:p*2-1)))+1}},
 ui:[{choose:[['off','Path unknown'],['on','Path recorded']],label:'Which-path marker',get:s=>s.mark,act:'mark'},{b:'Send 500',act:'send',arg:500},{b:'Clear',act:'clear'}],
 on:{mark(s,v){s.mark=v;s.n=0},send(s,k){s.n=Math.min(4000,s.n+Number(k))},clear(s){s.n=0}},
 draw(s){
  const on=s.mark==='on';let out=heading(on?'Path recorded: no fringes':'Path unknown: fringes');
  out+=R(30,120,40,40,C.amber,'none',6)+arrow(72,140,118,140,'#e0a800',2)+R(126,70,8,52,C.dark,'none',1)+R(126,128,8,24,C.dark,'none',1)+R(126,158,8,52,C.dark,'none',1);
  if(on)out+=Ci(146,125,6,C.coral)+Ci(146,155,6,C.coral)+TF(110,240,'markers record the slit',13,C.coral);
  out+=P8_screen(on?'which':'both',s.n,170,60,400,200,s.n>=300);
  return {svg:out,phase:on?'With a record of each particle’s slit, the arrivals simply add up the two single-slit patterns: a broad smooth hump with no dark fringes.':'With no record of the path, the two possibilities interfere, giving bright and dark fringes.'};
 }});

SCENE({id:'quantum-interference-uncertainty',name:'The uncertainty principle',tag:'Squeeze one, spread the other',
 research:['Heisenberg (1927). On the perceptible content of quantum theoretical kinematics and mechanics.','Kennard (1927). The form Δx·Δp ≥ ħ/2.'],
 definition:'The more precisely a particle’s position is pinned down, the more spread there must be in its momentum: Δx · Δp ≥ ħ/2. It is a property of waves, not a fault of our instruments.',
 example:'Narrow a single slit and the pattern on the screen spreads out. For light of 500 nm through a 2 μm slit, the central bright band reaches its first dark edge 25 cm from the centre on a screen 1 m away. Halve the slit and the band doubles.',
 desc:'A single slit whose width you set, and the diffraction pattern on a screen 1 m away, with the positions of the first dark fringes and the product of the position and momentum spreads.',
 dur:10,hint:'Narrow the slit and watch the spread on the screen grow.',
 init:()=>({a:2}),
 watch(p){return {a:+(10-9*smooth(p)).toFixed(1)}},
 ui:[{range:'a',label:'Slit width',min:1,max:10,step:0.5,get:s=>s.a,act:'a',show:v=>v+' μm'}],
 on:{a(s,v){s.a=v}},
 draw(s){
  const lam=0.5,Lm=1,y1=lam*Lm/s.a*100,sy=v=>200+v*2.2;let out=heading(`Slit ${s.a} μm wide, light 500 nm`);
  const half=s.a*6;out+=R(110,70,10,130-half,C.dark,'none',1)+R(110,200+half,10,130-half,C.dark,'none',1)+arrow(40,200,104,200,'#e0a800',2.5)+TF(115,352,'slit',13,C.muted);
  let d='';for(let i=0;i<=240;i++){const yc=-60+i*0.5,v=P8_sinc(Math.PI*s.a*1e-6*yc*1e-2/(lam*1e-6*Lm))**2;d+=(i?'L':'M')+fmt(420+v*140)+' '+fmt(sy(yc))}
  out+=L(420,sy(-60),420,sy(60),C.dark,3)+P(d,C.blue,2.5,'none')+P(d+`L420 ${fmt(sy(60))}L420 ${fmt(sy(-60))}Z`,'none',0,'#1772b722');
  if(y1<=60)out+=L(410,sy(y1),570,sy(y1),C.coral,1.5,'stroke-dasharray="4 4"')+L(410,sy(-y1),570,sy(-y1),C.coral,1.5,'stroke-dasharray="4 4"')+TF(575,sy(y1)+4,`${y1.toFixed(1)} cm`,13,C.coral,'end');
  for(let i=0;i<6;i++)out+=L(124,200,410,200+(i-2.5)*Math.min(60,y1)*0.85,'#f1e2a8',1.4);
  out+=R(150,300,240,56,'#fff',C.grid,8)+TF(270,322,'Δx ≈ slit width; Δp ≈ h/slit width',13,C.ink)+TF(270,342,'narrower slit → wider pattern',13,C.muted);
  return {svg:out,phase:`The first dark fringes are ${y1.toFixed(1)} cm either side of centre, set by λL/a. Pinning the position down to ${s.a} μm forces a spread of momentum sideways, so the light spreads.`};
 }});

/* ---------- Radioactivity ---------- */
// Each nucleus gets a fixed decay time (in half-lives): t = −log₂(u), so P(still there after t) = 2^−t.
const P8_DECAY={};
function P8_decayTimes(N,seed){const k=N+':'+seed;if(!P8_DECAY[k]){const r=rng(seed*7+N);P8_DECAY[k]=range(N).map(()=>-Math.log2(Math.max(1e-12,r())))}return P8_DECAY[k]}
SCENE({id:'radioactivity',name:'Half-life',tag:'Random for one, predictable for many',
 research:['Becquerel (1896). Radiation from uranium salts.','M. Curie & P. Curie (1898). Polonium and radium.','Rutherford & Soddy (1902–03). Radioactive change: the exponential law of decay.'],
 definition:'Each unstable nucleus has the same fixed chance of decaying in any given time, regardless of its age. Nobody can predict when one nucleus will decay, but in a large sample half of them decay in each half-life.',
 example:'Start with 400 nuclei. After one half-life about 200 remain, after two about 100, after three about 50. With fewer nuclei the count wobbles more around the smooth curve, because each decay is a matter of chance.',
 desc:'A grid of nuclei that switch to decayed as time passes, beside a graph of the number remaining against time in half-lives, comparing the simulated count with the smooth curve N₀ × 2^(−t).',
 dur:12,hint:'Slide time, change the sample size, and draw a new random sample to see the wobble around the curve.',
 init:()=>({N:400,seed:1,t:1}),
 watch(p){return {N:400,seed:1,t:5*p}},
 ui:[{range:'t',label:'Time',min:0,max:5,step:0.1,get:s=>s.t,act:'t',show:v=>Number(v).toFixed(1)+' half-lives'},{choose:[[100,'100'],[400,'400'],[1600,'1600']],label:'Nuclei',get:s=>s.N,act:'N'},{b:'New random sample',act:'seed'}],
 on:{t(s,v){s.t=v},N(s,v){s.N=Number(v)},seed(s){s.seed++}},
 draw(s){
  const tt=P8_decayTimes(s.N,s.seed),left=tt.filter(v=>v>s.t).length,side=Math.round(Math.sqrt(s.N)),cell=230/side;let out=heading(`${left} of ${s.N} nuclei remain after ${s.t.toFixed(1)} half-lives`);
  let g='';tt.forEach((v,i)=>{const alive=v>s.t,x=30+(i%side)*cell,y=70+Math.floor(i/side)*cell;g+=`<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(cell-(side>30?0.6:1.5))}" height="${fmt(cell-(side>30?0.6:1.5))}" fill="${alive?C.coral:'#dfe7ec'}"/>`});out+=g;
  const Q=P8_plot({x:310,y:70,w:260,h:220,x0:0,x1:5,y0:0,y1:s.N,xt:[0,1,2,3,4,5],yt:[0,s.N/4,s.N/2,s.N*3/4,s.N].map(Math.round),xl:'time (half-lives)',yl:'nuclei remaining'});out+=Q.svg;
  let dt='',ds='';for(let i=0;i<=100;i++){const x=5*i/100;dt+=(i?'L':'M')+fmt(Q.sx(x))+' '+fmt(Q.sy(s.N*2**-x));ds+=(i?'L':'M')+fmt(Q.sx(x))+' '+fmt(Q.sy(tt.filter(v=>v>x).length))}
  out+=P(dt,C.muted,2,'none','stroke-dasharray="5 4"')+P(ds,C.coral,2.2)+L(Q.sx(s.t),70,Q.sx(s.t),290,C.ink,1.5)+Ci(Q.sx(s.t),Q.sy(left),6,C.coral);
  return {svg:out,phase:`Expected ${(s.N*2**-s.t).toFixed(0)}, counted ${left}. The red line is this sample; the dashed line is N₀ × 2^(−t). Bigger samples hug the curve more closely, because random fluctuations are about √N.`};
 }});

SCENE({id:'radioactivity-carbon-dating',name:'Radiocarbon dating',tag:'A clock in every living thing',
 research:['Libby, Anderson & Arnold (1949). Age determination by radiocarbon content. Science.','Reimer et al. (2020). The IntCal20 radiocarbon age calibration curve.'],
 definition:'Living things keep taking in carbon, including a tiny fixed share of radioactive carbon-14. When they die the intake stops and carbon-14 decays with a half-life of about 5730 years, so the share left tells how long ago they died.',
 example:'A bone with a quarter of the living carbon-14 share died about two half-lives ago: roughly 11 500 years. Because carbon-14 in the air has varied, raw ages are corrected with calibration curves built from tree rings and other records. Beyond about 50 000 years too little is left to measure.',
 desc:'A decay curve of the carbon-14 share against years since death, with the chosen share marked and the age read off, and a sample of atoms showing how few carbon-14 nuclei remain.',
 dur:10,hint:'Set how much carbon-14 is left, compared with a living sample, and read the age.',
 init:()=>({frac:25}),
 watch(p){return {frac:Math.round(100*2**(-6*p))||1}},
 ui:[{range:'frac',label:'Carbon-14 left',min:1,max:100,step:1,get:s=>s.frac,act:'frac',show:v=>v+'%'}],
 on:{frac(s,v){s.frac=v}},
 draw(s){
  const age=5730*Math.log2(100/s.frac);let out=heading(`${s.frac}% left → about ${Math.round(age/10)*10} years`);
  const Q=P8_plot({x:70,y:70,w:330,h:230,x0:0,x1:50000,y0:0,y1:100,xt:[0,10000,20000,30000,40000,50000],xf:v=>v/1000+'k',yt:[0,25,50,75,100],yf:v=>v+'%',xl:'years since death',yl:'carbon-14 left'});
  out+=Q.svg;let d='';for(let i=0;i<=120;i++){const y=50000*i/120;d+=(i?'L':'M')+fmt(Q.sx(y))+' '+fmt(Q.sy(100*2**(-y/5730)))}out+=P(d,C.blue,2.5);
  for(let k=1;k<=3;k++)out+=L(Q.sx(5730*k),Q.sy(0),Q.sx(5730*k),Q.sy(100/2**k),'#c7d8e3',1,'stroke-dasharray="3 3"');
  const ax=Math.min(age,50000);out+=L(70,Q.sy(s.frac),Q.sx(ax),Q.sy(s.frac),C.coral,1.6,'stroke-dasharray="5 4"')+L(Q.sx(ax),Q.sy(s.frac),Q.sx(ax),Q.sy(0),C.coral,1.6,'stroke-dasharray="5 4"')+Ci(Q.sx(ax),Q.sy(s.frac),7,C.coral);
  const r=rng(14);for(let i=0;i<60;i++){const x=440+(i%10)*13,y=96+Math.floor(i/10)*13,c14=i<Math.round(6*s.frac/100);out+=Ci(x,y,4.5,c14?C.coral:'#cfd9df')}
  out+=TF(500,190,'6 in 60 shown as carbon-14',13,C.muted)+TF(500,206,'when alive (hugely magnified;',13,C.muted)+TF(500,222,'really about 1 in 10¹²)',13,C.muted);
  out+=R(420,250,160,66,'#fff8e8',C.amber,8)+TF(500,274,'Raw ages need',13,C.ink)+TF(500,292,'calibration curves',13,C.ink)+TF(500,308,'(tree rings, corals)',13,C.muted);
  return {svg:out,phase:age>45000?'With under 0.5% left the remaining carbon-14 is too faint to count reliably; radiocarbon dating stops near 50 000 years.':`${s.frac}% left means ${(age/5730).toFixed(2)} half-lives have passed: about ${Math.round(age/10)*10} radiocarbon years, before calibration.`};
 }});

const P8_U={u235:235.04393,n:1.008665,ba:140.91441,kr:91.92617};
SCENE({id:'radioactivity-fission',name:'Nuclear fission',tag:'Splitting uranium',
 research:['Hahn & Strassmann (1939). On the detection of barium after neutron bombardment of uranium.','Meitner & Frisch (1939). Disintegration of uranium by neutrons: a new type of nuclear reaction. Nature.'],
 definition:'A heavy nucleus such as uranium-235 can absorb a neutron, wobble and split into two lighter nuclei plus a few neutrons. The pieces weigh slightly less than the start; the missing mass appears as energy, E = mc².',
 example:'Hahn and Strassmann found barium after bombarding uranium with neutrons. Lise Meitner and Otto Frisch explained it in early 1939 as the nucleus splitting, and estimated about 200 MeV released, matching the mass lost. If each fission sets off more than one more, the reaction grows as a chain.',
 desc:'A uranium nucleus absorbing a neutron and splitting into barium, krypton and three neutrons, a mass ledger showing the 0.186 u lost and the energy released, and a chain-reaction table for an adjustable number of follow-on fissions.',
 dur:13,hint:'Step through the split, then set how many fissions each one triggers on average.',
 init:()=>({k:2}),
 ui:[{range:'k',label:'Fissions triggered by each',min:0.5,max:3,step:0.1,get:s=>s.k,act:'k',show:v=>Number(v).toFixed(1)}],
 on:{k(s,v){s.k=v;return 'keep'}},
 trace(s){return [{st:0,say:'A slow neutron approaches a uranium-235 nucleus.'},{st:1,say:'Absorbing it makes uranium-236, which wobbles like a drop of liquid.'},{st:2,say:'The drop stretches until electric repulsion between its two ends wins.'},{st:3,say:'It splits: here into barium-141, krypton-92 and three neutrons.'},{st:4,say:'Weigh before and after: 0.186 atomic mass units are missing. E = mc² turns that into about 173 MeV.'}]},
 draw(s,f){
  const st=f.st;let out=heading('U-235 + n → Ba-141 + Kr-92 + 3n');
  if(st===0)out+=Ci(80,150,7,C.blue)+arrow(92,150,170,150,C.blue,2)+Ci(240,150,52,'#c9a227','#9a7a14');
  if(st===1)out+=`<ellipse cx="240" cy="150" rx="60" ry="47" fill="#c9a227" stroke="#9a7a14" stroke-width="2"/>`+TF(240,226,'U-236 wobbles',13,C.muted);
  if(st===2)out+=P('M160 150C160 105 215 112 240 140C265 112 320 105 320 150C320 195 265 188 240 160C215 188 160 195 160 150Z','#9a7a14',2,'#c9a227');
  if(st>=3)out+=Ci(150,150,42,C.coral,'#8f3a26')+TBF(150,155,'Ba-141',13,'#fff')+Ci(340,150,33,C.purple,'#4e3a78')+TBF(340,155,'Kr-92',13,'#fff')+[[240,95],[245,205],[285,120]].map(([x,y])=>Ci(x,y,7,C.blue)+arrow(x+8,y,x+38,y+(y<150?-14:14),C.blue,1.6,6)).join('');
  const lhs=P8_U.u235+P8_U.n,rhs=P8_U.ba+P8_U.kr+3*P8_U.n,dm=lhs-rhs;
  out+=R(400,70,180,150,'#fff',C.grid,8)+TBF(490,92,'Mass ledger (u)',13,C.ink)+TF(410,116,`before ${lhs.toFixed(3)}`,13,C.ink,'start')+TF(410,138,`after ${rhs.toFixed(3)}`,13,C.ink,'start');
  if(st>=4)out+=TBF(410,166,`lost ${dm.toFixed(3)} u`,13,C.coral,'start')+TBF(410,190,`≈ ${(dm*931.494).toFixed(0)} MeV`,14,C.coral,'start')+TF(410,210,'(≈ 200 MeV in all)',13,C.muted,'start');
  const gens=[0,1,2,3,4,5,6].map(g=>s.k**g);out+=TBF(300,254,`Chain reaction, ${s.k.toFixed(1)} follow-on fissions each`,13,s.k>1?C.coral:s.k<1?C.blue:C.ink);
  gens.forEach((n,g)=>{const x=60+g*76,hgt=Math.min(70,10*Math.log10(1+n)*8);out+=R(x,340-hgt,46,hgt,s.k>1?C.coral:C.blue,'none',3)+TF(x+23,356,'gen '+g,13,C.muted)+TF(x+23,336-hgt,n<10?n.toFixed(1):P8_sci(n,2),13,C.ink)});
  return {svg:out,phase:f.say+(st>=4?` With ${s.k.toFixed(1)} follow-on fissions each, generation 6 has ${P8_sci(gens[6],2)} fissions: ${s.k>1?'growing (supercritical)':s.k<1?'dying out (subcritical)':'steady (critical, as in a reactor)'}.`:'')};
 }});

/* ---------- Open questions ---------- */
function P8_vis(r){const x=r/3;return 1-(1+x)*Math.exp(-x)} // enclosed visible mass (exponential profile, spherical approximation)
const P8_VIS_K=(()=>{let m=0;for(let r=0.2;r<30;r+=0.2)m=Math.max(m,P8_vis(r)/r);return 175*175/m})();
const P8_vVis=r=>Math.sqrt(P8_VIS_K*P8_vis(r)/Math.max(r,0.05)),P8_vHalo=(r,h)=>Math.sqrt(h*200*200*(1-4/r*Math.atan(r/4)));
const P8_ROT=range(14).map(i=>{const r=2+i*2,n=P8_gen(i,70)();return [r,Math.sqrt(P8_vVis(r)**2+P8_vHalo(r,1)**2)+(n-0.5)*14]});
SCENE({id:'open-questions',name:'Dark matter',tag:'Galaxies spin too fast',
 research:['Zwicky (1933). The redshift of extragalactic nebulae (missing mass in the Coma cluster).','Rubin & Ford (1970). Rotation of the Andromeda nebula from a spectroscopic survey of emission regions. Astrophysical Journal.'],
 definition:'Stars and gas in the outer parts of spiral galaxies orbit as fast as those further in, instead of slowing down like outer planets. Either there is much more unseen mass (dark matter), or gravity behaves differently on galactic scales. It is still open.',
 example:'Vera Rubin and Kent Ford measured Andromeda’s rotation and found the speeds stayed roughly flat far beyond the bright disc. Fritz Zwicky had seen a similar mismatch in galaxy clusters in 1933. Adding an invisible “halo” of matter makes the predicted curve match.',
 desc:'A galaxy rotation curve: illustrative measured speeds staying flat with distance, the speed expected from visible matter alone falling off, and an adjustable dark-matter halo added to the prediction.',
 dur:12,hint:'Add an unseen halo until the prediction matches the measured points.',
 init:()=>({halo:0}),
 watch(p){return {halo:+(1.2*smooth(clamp((p-0.25)/0.6,0,1))).toFixed(2)}},
 ui:[{range:'halo',label:'Dark-matter halo',min:0,max:1.6,step:0.05,get:s=>s.halo,act:'halo',show:v=>'×'+Number(v).toFixed(2)}],
 on:{halo(s,v){s.halo=v}},
 draw(s){
  let out=heading('How fast do stars orbit, far from the centre?');
  const Q=P8_plot({x:70,y:66,w:350,h:236,x0:0,x1:30,y0:0,y1:300,xt:[0,5,10,15,20,25,30],yt:[0,100,200,300],yf:v=>v,xl:'distance from centre (kiloparsecs)',yl:'orbital speed (km/s)'});
  out+=Q.svg;const curve=fn=>{let d='';for(let r=0.3;r<=30;r+=0.3)d+=(d?'L':'M')+fmt(Q.sx(r))+' '+fmt(Q.sy(fn(r)));return d};
  out+=P(curve(P8_vVis),C.blue,2.2,'none','stroke-dasharray="6 4"');
  if(s.halo>0)out+=P(curve(r=>Math.sqrt(P8_vVis(r)**2+P8_vHalo(r,s.halo)**2)),C.coral,2.6);
  P8_ROT.forEach(([r,v])=>out+=Ci(Q.sx(r),Q.sy(v),5,C.dark));
  const fitErr=Math.sqrt(sum(P8_ROT.map(([r,v])=>(v-Math.sqrt(P8_vVis(r)**2+P8_vHalo(r,s.halo)**2))**2))/P8_ROT.length);
  out+=R(436,66,144,236,'#fff',C.grid,8)+Ci(450,92,5,C.dark)+TF(462,97,'measured',13,C.ink,'start')+L(444,120,458,120,C.blue,2.5)+TF(462,125,'visible mass',13,C.ink,'start')+L(444,148,458,148,C.coral,2.5)+TF(462,153,'with halo',13,C.ink,'start');
  out+=TF(508,190,'average mismatch',13,C.muted)+TBF(508,212,`${fitErr.toFixed(0)} km/s`,16,fitErr<15?C.green:C.coral)+TF(508,250,'Illustrative data',13,C.muted)+TF(508,268,'shaped like Rubin',13,C.muted)+TF(508,286,'and Ford’s results',13,C.muted);
  return {svg:out,phase:s.halo<0.3?'Visible stars and gas predict speeds that fall off beyond the bright disc, like the outer planets. The measured speeds stay high.':fitErr<15?'With enough unseen mass spread in a halo, the prediction matches. What that mass is remains unknown: no dark-matter particle has yet been detected directly.':'More unseen mass raises the outer speeds. Keep adjusting until the curve meets the points.'};
 }});

SCENE({id:'open-questions-parity',name:'A broken mirror symmetry',tag:'Chien-Shiung Wu, 1957',
 research:['Lee & Yang (1956). Question of parity conservation in weak interactions. Physical Review.','Wu, Ambler, Hayward, Hoppes & Hudson (1957). Experimental test of parity conservation in beta decay. Physical Review.'],
 definition:'Parity symmetry says the mirror image of any physical process is also a possible process. In 1957 Chien-Shiung Wu’s experiment showed the weak force breaks it: nature can tell left from right.',
 example:'Wu cooled cobalt-60 to about 0.01 K and lined up its nuclear spins with a magnetic field. More beta-decay electrons came out opposite to the spin than along it. In the mirror image the spin reverses but the electrons do not, so the mirror world would have more electrons along the spin, and that is not what happens.',
 desc:'The real cobalt-60 experiment with its spin arrow and electrons emitted mostly downwards, beside either its mirror image or what parity conservation would have predicted.',
 dur:11,hint:'Compare the real experiment with its mirror image, and with what parity conservation predicted.',
 init:()=>({view:'mirror'}),
 watch(p){return {view:p<.5?'mirror':'parity'}},
 ui:[{choose:[['mirror','Mirror image'],['parity','If parity held']],label:'Compare with',get:s=>s.view,act:'view'}],
 on:{view(s,v){s.view=v}},
 draw(s){
  let out=heading('Cobalt-60 nuclei lined up, then decaying');
  const nucleus=(cx,spinUp,up,down,label)=>{let o=Ci(cx,200,26,C.purple,'#4e3a78')+`<ellipse cx="${cx}" cy="200" rx="46" ry="14" fill="none" stroke="${C.ink}" stroke-width="2"/>`;
   o+=spinUp?arrow(cx,174,cx,98,C.ink,3)+P(`M${cx+40} 192l8 -6l-1 10z`,C.ink,1.5,C.ink):arrow(cx,226,cx,302,C.ink,3)+P(`M${cx-40} 192l-8 -6l1 10z`,C.ink,1.5,C.ink);
   o+=TF(cx+(spinUp?14:14),spinUp?110:296,'spin',13,C.ink,'start');
   for(let i=0;i<up;i++){const a=-Math.PI/2+(i-(up-1)/2)*0.28;o+=arrow(cx+30*Math.cos(a),200+30*Math.sin(a),cx+105*Math.cos(a),200+105*Math.sin(a),C.blue,2,7)}
   for(let i=0;i<down;i++){const a=Math.PI/2+(i-(down-1)/2)*0.22;o+=arrow(cx+30*Math.cos(a),200+30*Math.sin(a),cx+105*Math.cos(a),200+105*Math.sin(a),C.blue,2,7)}
   return o+TBF(cx,352,label,14,C.ink)};
  out+=nucleus(160,true,3,7,'Real experiment');
  out+=L(300,70,300,340,C.line,3,'stroke-dasharray="8 6"')+TF(300,62,s.view==='mirror'?'mirror':'',13,C.muted);
  out+=s.view==='mirror'?nucleus(440,false,3,7,'Mirror image'):nucleus(440,true,5,5,'If parity held');
  return {svg:out,phase:s.view==='mirror'?'A mirror reverses the sense of rotation, so the spin arrow flips, but the electrons’ directions along the axis do not. In the mirror world electrons would favour the spin direction. The real world does the opposite, so the mirror world is not equally real.':'If the weak force respected mirror symmetry, electrons would leave equally along and against the spin. Wu measured a clear imbalance, so parity is violated.'};
 }});

const P8_Q=[
 {k:'dm',t:'Dark matter',pct:26.4,col:C.purple,lines:['About 27% of the universe’s energy','content. It pulls gravitationally but','emits no light. No particle has yet','been found in direct searches.'],r:'Planck Collaboration (2020); Rubin & Ford (1970).'},
 {k:'de',t:'Dark energy',pct:68.5,col:'#8a9aa6',lines:['About 68%. The expansion of the','universe is speeding up (found 1998).','Its cause is unknown: perhaps a','property of empty space itself.'],r:'Riess et al. (1998); Perlmutter et al. (1999).'},
 {k:'ord',t:'Ordinary matter',pct:4.9,col:C.blue,lines:['Everything made of atoms: stars,','planets, people. About 5% of the','total, and what all the other','lessons on this page describe.'],r:'Planck Collaboration (2020).'},
 {k:'qg',t:'Quantum gravity',lines:['General relativity and quantum','theory both pass every test, yet','they do not fit together inside','black holes or at the Big Bang.'],r:'Open question: no tested theory yet.'},
 {k:'anti',t:'Matter over antimatter',lines:['The Big Bang should have made equal','amounts of matter and antimatter.','Almost no antimatter is left, and','why is not yet explained.'],r:'Sakharov (1967) set out the conditions.'}
];
SCENE({id:'open-questions-unknowns',name:'What we do not know yet',tag:'The edge of physics',
 research:['Planck Collaboration (2020). Planck 2018 results VI: cosmological parameters. Astronomy & Astrophysics.','Riess et al. (1998); Perlmutter et al. (1999). The accelerating expansion of the universe.'],
 definition:'Measurements show that ordinary matter makes up only about 5% of the universe’s energy content. The rest, dark matter and dark energy, is known only by its effects. Other open questions include how gravity works at quantum scales and why matter outnumbers antimatter.',
 example:'The cosmic microwave background, measured precisely by the Planck satellite, gives about 4.9% ordinary matter, 26.4% dark matter and 68.5% dark energy. These shares are well measured; what dark matter and dark energy actually are is not known.',
 desc:'A pie of the universe’s energy content (ordinary matter, dark matter, dark energy) beside a list of open questions; choosing one shows what is known and what is not.',
 dur:12,hint:'Press a slice of the pie or a question to read what is known and what is still open.',
 init:()=>({q:'dm'}),
 watch(p){return {q:P8_Q[Math.min(4,Math.floor(p*5))].k}},
 on:{q(s,v){s.q=v}},
 draw(s,f,X){
  const cur=P8_Q.find(q=>q.k===s.q)||P8_Q[0],cx=150,cy=200,r=110;let out=heading('The universe’s energy content');let a0=-Math.PI/2;
  P8_Q.filter(q=>q.pct).forEach(q=>{const a1=a0+q.pct/100*2*Math.PI,big=a1-a0>Math.PI?1:0,on=q.k===s.q,dd=on?8:0,mx=Math.cos((a0+a1)/2)*dd,my=Math.sin((a0+a1)/2)*dd;
   const path=`M${fmt(cx+mx)} ${fmt(cy+my)}L${fmt(cx+mx+r*Math.cos(a0))} ${fmt(cy+my+r*Math.sin(a0))}A${r} ${r} 0 ${big} 1 ${fmt(cx+mx+r*Math.cos(a1))} ${fmt(cy+my+r*Math.sin(a1))}Z`;
   out+=hit(X,'q',q.k,`${q.t}, ${q.pct}%`,P(path,'#fff',2,q.col));const am=(a0+a1)/2,lr=q.pct<10?r+22:r*0.62;out+=TBF(cx+mx+lr*Math.cos(am),cy+my+lr*Math.sin(am)+5,q.pct+'%',14,q.pct<10?C.ink:'#fff');a0=a1});
  P8_Q.forEach((q,i)=>{const y=70+i*34,on=q.k===s.q;out+=hit(X,'q',q.k,q.t,R(300,y,280,28,on?C.amberp:'#fff',on?C.amber:C.grid,6)+TF(312,y+19,q.t,13,C.ink,'start')+TF(568,y+19,'open',13,C.coral,'end'))});
  out+=R(300,246,280,112,'#fff',C.grid,8)+TBF(312,266,cur.t,14,C.ink,'start')+cur.lines.map((l,i)=>TF(312,288+i*17,l,13,C.ink,'start')).join('');
  return {svg:out,phase:`${cur.t}: ${cur.lines.join(' ')} (${cur.r})`};
 }});
