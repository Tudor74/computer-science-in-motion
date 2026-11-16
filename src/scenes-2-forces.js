/* ===================== Physics era 2 · Forces and gravity (1600s–1700s) ===================== */
const P2_g=9.81;
const P2_n=(v,d=2)=>{if(!isFinite(v))return '—';const s=Number(v).toFixed(d);return s.replace(/^-0(\.0+)?$/,'0$1')};
// A labelled force arrow from (x,y) by (dx,dy) px.
function P2_vec(x,y,dx,dy,col,label,lx=0,ly=0,size=14){
 if(Math.hypot(dx,dy)<3)return '';
 const ex=x+dx,ey=y+dy,ux=dx/Math.hypot(dx,dy),uy=dy/Math.hypot(dx,dy);
 return arrow(x,y,ex,ey,col,3,10)+(label?TB(ex+ux*14+lx,ey+uy*14+ly+5,label,size,col):'');
}
function P2_axes(x,y,w,h,xl,yl,xt,yt){
 let o=L(x,y+h,x+w,y+h,C.muted,1.5)+L(x,y,x,y+h,C.muted,1.5)+TF(x+w/2,y+h+30,xl,13,C.muted)+TF(x-8,y-16,yl,13,C.muted,'start');
 (xt||[]).forEach(([v,lab])=>o+=L(x+v*w,y+h,x+v*w,y+h+5,C.muted,1)+TF(x+v*w,y+h+18,lab,13,C.muted));
 (yt||[]).forEach(([v,lab])=>o+=L(x-5,y+h-v*h,x,y+h-v*h,C.muted,1)+TF(x-8,y+h-v*h+4,lab,13,C.muted,'end'));
 return o;
}
const P2_poly=pts=>pts.map(p=>p.map(v=>fmt(v)).join(',')).join(' ');
function P2_block(x,y,w,h,label,fill='#e8eef2'){return R(x-w/2,y-h/2,w,h,fill,C.ink,4)+(label?TF(x,y+5,label,13,C.ink):'')}
const P2_timeFrames=(t1,dt)=>{const fr=[];for(let t=0;t<=t1+1e-9;t+=dt)fr.push({t:Math.round(t*1000)/1000});return fr};

/* ---------------- newton-laws ---------------- */
// Puck sliding across ice. With friction it stops after v0²/(2μg); with none it keeps going.
function P2_puckX(v0,mu,t){if(mu<=0)return v0*t;const ts=v0/(mu*P2_g);return t>=ts?v0*v0/(2*mu*P2_g):v0*t-.5*mu*P2_g*t*t}
function P2_puckV(v0,mu,t){return mu<=0?v0:Math.max(0,v0-mu*P2_g*t)}
SCENE({id:'newton-laws',name:'Inertia',tag:'Newton’s first law',
 definition:'An object keeps moving at the same speed in a straight line, or stays at rest, unless a net force acts on it.',
 example:'A puck slows down on rough ice because friction pushes back on it. Make the ice perfectly slippery and nothing slows it: it would glide on for ever.',
 desc:'Two pucks slide along parallel tracks: one on ice with adjustable friction, one on frictionless ice. A speed–time graph below shows one slowing and one keeping a constant speed.',
 dur:10,research:'Newton (1687). Philosophiæ Naturalis Principia Mathematica, Law I; building on Galileo (1638) and Descartes (1644).',
 hint:'Lower the friction towards zero and run it: the stopping distance grows without limit, which is what Newton’s first law predicts.',
 init:()=>({mu:.05,v0:3}),
 ui:[{range:'mu',label:'Friction μ',min:0,max:.3,step:.01,get:s=>s.mu,act:'mu'},{range:'v0',label:'Launch speed',min:1,max:4,step:.5,get:s=>s.v0,act:'v0',show:v=>v+' m/s'}],
 on:{mu(s,v){s.mu=v},v0(s,v){s.v0=v}},
 trace:()=>P2_timeFrames(8,.25),
 draw(s,f,X){
  const t=f.t,sc=15,x0=50;let o=heading('Same push, different ice');
  [[s.mu,'Ice with friction μ = '+P2_n(s.mu,2),C.coral,95],[0,'Frictionless ice (μ = 0)',C.blue,175]].forEach(([mu,lab,col,y])=>{
   o+=R(x0-10,y-22,500,44,'#eef5f9',C.grid,8)+TF(x0-6,y-28,lab,13,col,'start');
   for(let m=0;m<=32;m+=4)o+=L(x0+m*sc,y+22,x0+m*sc,y+27,C.muted,1);
   const x=P2_puckX(s.v0,mu,t),px=Math.min(x0+x*sc,555);o+=`<ellipse cx="${fmt(px)}" cy="${y}" rx="15" ry="9" fill="${col}"/>`;
   if(x0+x*sc<=555&&P2_puckV(s.v0,mu,t)>0)o+=arrow(px+18,y,px+18+P2_puckV(s.v0,mu,t)*10,y,col,2.5,8);
   o+=TF(Math.min(px,520),y+42,P2_n(x,1)+' m',13,col);
  });
  const gx=60,gy=240,gw=300,gh=90;o+=P2_axes(gx,gy,gw,gh,'time (s)','speed (m/s)',[[0,'0'],[.5,'4'],[1,'8']],[[0,'0'],[1,'4']]);
  [[s.mu,C.coral],[0,C.blue]].forEach(([mu,col])=>{const pts=[];for(let tt=0;tt<=t+1e-9;tt+=.1)pts.push([gx+tt/8*gw,gy+gh-P2_puckV(s.v0,mu,tt)/4*gh]);if(pts.length>1)o+=`<polyline points="${P2_poly(pts)}" fill="none" stroke="${col}" stroke-width="2.5"/>`});
  const stop=s.mu>0?s.v0*s.v0/(2*s.mu*P2_g):Infinity;
  o+=TF(400,262,'t = '+P2_n(t,2)+' s',15,C.ink,'start')+TF(400,288,'Stops after: '+(isFinite(stop)?P2_n(stop,1)+' m':'never'),14,C.coral,'start')+TF(400,312,'Idealised: no air resistance.',13,C.muted,'start');
  return {svg:o,phase:s.mu>0?`Friction is the only horizontal force on the top puck, so it slows by μg = ${P2_n(s.mu*P2_g,2)} m/s² and stops after about ${P2_n(stop,1)} m. The bottom puck feels no horizontal force and keeps ${s.v0} m/s.`:`With no friction neither puck feels a horizontal force, so both keep ${s.v0} m/s: motion needs no force to continue, only to change.`};
 }});

SCENE({id:'newton-laws-fma',name:'Force, mass and acceleration',tag:'Newton’s second law',
 definition:'The net force on an object equals its mass times its acceleration: F = ma. Twice the force gives twice the acceleration; twice the mass gives half.',
 example:'Push a 2 kg trolley with 10 N on a frictionless track and it speeds up by 5 m/s every second. Load it to 10 kg and the same push gives only 1 m/s².',
 desc:'A block on a frictionless track with its free-body diagram (weight, normal force, applied force), readouts of acceleration, speed and distance, and the block sliding along a metre scale.',
 dur:9,research:'Newton (1687). Principia, Law II. The modern form F = ma was written by Euler (1750).',
 hint:'Change the force and the mass, then Run: the acceleration is always F ÷ m.',
 init:()=>({F:10,m:2}),
 ui:[{range:'F',label:'Force',min:0,max:10,step:1,get:s=>s.F,act:'F',show:v=>v+' N'},{range:'m',label:'Mass',min:1,max:10,step:1,get:s=>s.m,act:'m',show:v=>v+' kg'}],
 on:{F(s,v){s.F=v},m(s,v){s.m=v}},
 trace:()=>P2_timeFrames(4,.25),
 draw(s,f,X){
  const a=s.F/s.m,t=f.t,x=.5*a*t*t,v=a*t;let o=heading('Net force = mass × acceleration');
  o+=R(30,48,220,160,'#fff',C.grid,10)+TF(140,66,'Free-body diagram',13,C.muted);
  o+=P2_block(140,135,60,44,s.m+' kg');
  o+=P2_vec(140,157,0,40,C.ink,'',0,0)+TF(160,200,'weight '+P2_n(s.m*P2_g,0)+' N',13,C.ink,'start');
  o+=P2_vec(140,113,0,-38,C.green,'',0,0)+TF(160,94,'normal '+P2_n(s.m*P2_g,0)+' N',13,C.green,'start');
  if(s.F>0)o+=P2_vec(170,135,8+s.F*5,0,C.coral,s.F+' N',0,0);
  o+=TF(300,80,'a = F ÷ m = '+s.F+' ÷ '+s.m+' = '+P2_n(a,2)+' m/s²',17,C.blue,'start','font-weight="700"');
  o+=TF(300,112,'t = '+P2_n(t,2)+' s',15,C.ink,'start')+TF(300,138,'speed v = at = '+P2_n(v,1)+' m/s',15,C.ink,'start')+TF(300,164,'distance = ½at² = '+P2_n(x,1)+' m',15,C.ink,'start');
  o+=TF(300,190,'Weight and normal cancel; net force = push.',13,C.muted,'start');
  const tx=40,sc=6;o+=L(tx,286,tx+480,286,C.ink,2);for(let m=0;m<=80;m+=10)o+=L(tx+m*sc,286,tx+m*sc,292,C.muted,1)+TF(tx+m*sc,308,m+' m',13,C.muted);
  const bx=Math.min(tx+x*sc,tx+480);o+=P2_block(bx+16,268,32,32,'');if(s.F>0&&bx<tx+470)o+=arrow(bx-24,268,bx-2,268,C.coral,2.5,8);
  o+=TF(300,345,'Idealised: frictionless track.',13,C.muted);
  return {svg:o,phase:`The vertical forces cancel, so the net force is the ${s.F} N push. It gives ${s.m} kg an acceleration of ${P2_n(a,2)} m/s²: after ${P2_n(t,2)} s the block is moving at ${P2_n(v,1)} m/s.`};
 }});

SCENE({id:'newton-laws-pairs',name:'Action and reaction',tag:'Newton’s third law',
 definition:'When one object pushes on another, the second pushes back on the first with a force equal in size and opposite in direction. The two forces act on different objects.',
 example:'Two skaters push apart. Each feels the same size of force, but the lighter skater ends up moving faster, because the same force gives a smaller mass more acceleration.',
 desc:'Two skaters on ice push against each other for half a second and glide apart; equal and opposite force arrows act on each, and their momenta add to zero.',
 dur:9,research:'Newton (1687). Principia, Law III; tested with colliding pendulums by Wren, Wallis and Huygens (1668).',
 hint:'Make one skater much heavier and Run: the forces stay equal, but the speeds do not.',
 init:()=>({m1:50,m2:80,F:150}),
 ui:[{range:'m1',label:'Skater A',min:40,max:100,step:5,get:s=>s.m1,act:'m1',show:v=>v+' kg'},{range:'m2',label:'Skater B',min:40,max:100,step:5,get:s=>s.m2,act:'m2',show:v=>v+' kg'},{range:'F',label:'Push',min:50,max:200,step:10,get:s=>s.F,act:'F',show:v=>v+' N'}],
 on:{m1(s,v){s.m1=v},m2(s,v){s.m2=v},F(s,v){s.F=v}},
 trace:()=>P2_timeFrames(3,.125),
 draw(s,f,X){
  const dt=.5,t=f.t,sc=36,cx=300,y=200;const pos=(m,sign)=>{const a=s.F/m;return t<=dt?sign*(.5*a*t*t):sign*(.5*a*dt*dt+a*dt*(t-dt))};
  const v1=s.F*dt/s.m1,v2=s.F*dt/s.m2;const xa=cx-22+pos(s.m1,-1)*sc,xb=cx+22+pos(s.m2,1)*sc;
  let o=heading('Equal and opposite forces on different bodies');o+=R(20,240,560,10,'#e3f0f7','none',4);
  const skater=(x,m,col,lab)=>Ci(x,y-48,12,col)+R(x-12-m/10,y-34,24+m/5,58,col,'none',10)+TF(x,y+44,lab+' · '+m+' kg',13,col);
  o+=skater(xa,s.m1,C.blue,'A')+skater(xb,s.m2,C.purple,'B');
  if(t<=dt){o+=arrow(xa-14,y-6,xa-14-s.F/3,y-6,C.coral,3,10)+TF(xa-40,y-24,'on A by B: '+s.F+' N',13,C.coral,'end');o+=arrow(xb+14,y-6,xb+14+s.F/3,y-6,C.coral,3,10)+TF(xb+40,y-24,'on B by A: '+s.F+' N',13,C.coral,'start')}
  else{o+=arrow(xa-20,y+60,xa-20-v1*14,y+60,C.blue,2.5,8)+TF(xa,y+80,P2_n(v1,2)+' m/s',13,C.blue);o+=arrow(xb+20,y+60,xb+20+v2*14,y+60,C.purple,2.5,8)+TF(xb,y+80,P2_n(v2,2)+' m/s',13,C.purple)}
  o+=TF(300,300,'Momentum: '+s.m1+' × (−'+P2_n(v1,2)+') + '+s.m2+' × '+P2_n(v2,2)+' = 0 kg·m/s',14,C.ink);
  o+=TF(300,326,'t = '+P2_n(t,2)+' s · push lasts 0.5 s · idealised: frictionless ice',13,C.muted);
  return {svg:o,phase:t<=dt?`For half a second each skater pushes the other with ${s.F} N. The forces are equal and opposite, but they act on different people, so they do not cancel.`:`The push is over. A (${s.m1} kg) moves left at ${P2_n(v1,2)} m/s and B (${s.m2} kg) right at ${P2_n(v2,2)} m/s: the lighter skater is faster, and the total momentum is still zero.`};
 }});

/* ---------------- friction ---------------- */
function P2_ramp(theta){const th=theta*Math.PI/180,px=70,py=330,len=Math.min(430,250/Math.max(.2,Math.sin(th)));return {th,px,py,len,tx:px+len*Math.cos(th),ty:py-len*Math.sin(th)}}
SCENE({id:'friction',name:'Friction on a slope',tag:'Static and kinetic friction',
 definition:'Friction opposes sliding. Static friction holds an object still up to a limit μs × normal force; once it slides, kinetic friction μk × normal force is usually smaller.',
 example:'Tilt a book on a board: it stays put until the angle’s tangent equals μs, then suddenly slips. The tangent of that slipping angle measures the coefficient of static friction.',
 desc:'A block on a ramp whose angle can be raised, with arrows for weight along the slope, normal force and friction; the block holds or slides, and the slipping angle is marked.',
 dur:10,research:'Amontons (1699); Coulomb (1785) distinguished static from kinetic friction. The tilting-plane method follows from μs = tan θ at the point of slipping.',
 hint:'Raise the angle slowly. The block slips when tan θ passes μs; after that kinetic friction sets the acceleration.',
 init:()=>({theta:20,mus:.6,muk:.4}),
 watch:p=>({theta:10+32*p,mus:.6,muk:.4}),
 ui:[{range:'theta',label:'Angle',min:0,max:45,step:1,get:s=>Math.round(s.theta),act:'theta',show:v=>v+'°'},{range:'mus',label:'μ static',min:.2,max:.9,step:.05,get:s=>s.mus,act:'mus'},{range:'muk',label:'μ kinetic',min:.1,max:.9,step:.05,get:s=>s.muk,act:'muk'}],
 on:{theta(s,v){s.theta=v},mus(s,v){s.mus=v;if(s.muk>v)s.muk=v},muk(s,v){s.muk=Math.min(v,s.mus)}},
 draw(s){
  const r=P2_ramp(s.theta),crit=Math.atan(s.mus)*180/Math.PI,slips=s.theta>crit+1e-9,sin=Math.sin(r.th),cos=Math.cos(r.th);
  const a=slips?P2_g*(sin-s.muk*cos):0;let o=heading(slips?'It slips: kinetic friction takes over':'It holds: static friction matches the pull');
  o+=`<polygon points="${P2_poly([[r.px,r.py],[r.tx,r.py],[r.tx,r.ty]])}" fill="#eef3f6" stroke="${C.ink}" stroke-width="2"/>`;
  const frac=slips?.35:.6,bx=r.px+r.len*frac*cos,by=r.py-r.len*frac*sin,nx=-sin,ny=-cos,cx=bx+nx*18,cy=by+ny*18,ux=-cos,uy=sin;
  o+=`<g transform="translate(${fmt(cx)},${fmt(cy)}) rotate(${fmt(-s.theta)})">`+R(-26,-18,52,36,slips?C.coralp:'#e8eef2',C.ink,4)+'</g>';
  const k=90,len=v=>Math.max(54,k*v);o+=P2_vec(cx,cy,ux*len(sin),uy*len(sin),C.ink,'mg sin θ',0,0,13);
  o+=P2_vec(cx,cy,nx*len(cos),ny*len(cos),C.green,'N',0,0,13);
  const fr=slips?s.muk*cos:sin;o+=P2_vec(cx,cy,-ux*len(fr),-uy*len(fr),C.coral,'friction',0,0,13);
  o+=TF(r.px+60,r.py-10,P2_n(s.theta,0)+'°',15,C.ink);
  o+=R(360,60,225,150,'#fff',C.grid,10);
  o+=TF(372,84,'Slips when tan θ > μs',14,C.ink,'start','font-weight="700"')+TF(372,108,'tan θ = '+P2_n(Math.tan(r.th),2)+', μs = '+P2_n(s.mus,2),14,C.ink,'start');
  o+=TF(372,132,'Slipping angle: '+P2_n(crit,1)+'°',14,C.blue,'start')+TF(372,156,slips?'a = g(sin θ − μk cos θ)':'Friction = mg sin θ (≤ μs N)',13,C.muted,'start')+TF(372,180,slips?'= '+P2_n(a,2)+' m/s² down the slope':'Block at rest',14,slips?C.coral:C.green,'start','font-weight="700"');
  return {svg:o,phase:slips?`At ${P2_n(s.theta,0)}° the pull down the slope beats the most static friction can give (tan θ = ${P2_n(Math.tan(r.th),2)} > μs = ${P2_n(s.mus,2)}). Kinetic friction is weaker, so the block accelerates at ${P2_n(a,2)} m/s².`:`Static friction rises to exactly match the pull down the slope. It can do that until the angle reaches ${P2_n(crit,1)}°, where tan θ = μs.`};
 }});

SCENE({id:'friction-graph',name:'Stick, then slide',tag:'Friction against applied force',
 definition:'As you push harder on a resting object, static friction grows to match you, until it reaches its limit. Then the object breaks free and the friction drops to the kinetic value.',
 example:'Pushing a heavy box: it resists, resists, then lurches forward and becomes easier to keep moving. That lurch is the drop from static to kinetic friction.',
 desc:'A graph of friction force against applied force: a 45° line while static friction matches the push, then a drop to a lower flat kinetic level once the block slides.',
 dur:9,research:'Coulomb (1785). Théorie des machines simples; the static–kinetic distinction is still a simplification of real contacts.',
 hint:'Increase the push and watch the point: up the diagonal, then down to the kinetic line.',
 init:()=>({F:6,m:2,mus:.5,muk:.3}),
 watch:p=>({F:20*p,m:2,mus:.5,muk:.3}),
 ui:[{range:'F',label:'Push',min:0,max:20,step:.5,get:s=>s.F,act:'F',show:v=>v+' N'},{range:'m',label:'Mass',min:1,max:4,step:.5,get:s=>s.m,act:'m',show:v=>v+' kg'}],
 on:{F(s,v){s.F=v},m(s,v){s.m=v}},
 draw(s){
  const N=s.m*P2_g,fs=s.mus*N,fk=s.muk*N,slides=s.F>fs,fr=slides?fk:s.F,a=slides?(s.F-fk)/s.m:0;
  let o=heading('Friction rises with the push, then drops');const gx=70,gy=60,gw=300,gh=220,Fm=20;
  o+=P2_axes(gx,gy,gw,gh,'applied force (N)','friction (N)',[[0,'0'],[.5,'10'],[1,'20']],[[0,'0'],[.5,'10'],[1,'20']]);
  const X=v=>gx+v/Fm*gw,Y=v=>gy+gh-v/Fm*gh;
  o+=`<polyline points="${P2_poly([[X(0),Y(0)],[X(Math.min(fs,Fm)),Y(Math.min(fs,Fm))]])}" fill="none" stroke="${C.blue}" stroke-width="3"/>`;
  if(fs<Fm)o+=L(X(fs),Y(fs),X(fs),Y(fk),C.coral,2,'stroke-dasharray="4 4"')+L(X(fs),Y(fk),X(Fm),Y(fk),C.coral,3);
  o+=L(gx,Y(fs),gx+gw,Y(fs),C.line,1,'stroke-dasharray="3 5"')+TF(gx+gw+6,Y(fs)+4,'μs N = '+P2_n(fs,1),13,C.blue,'start')+TF(gx+gw+6,Y(fk)+18,'μk N = '+P2_n(fk,1),13,C.coral,'start');
  o+=Ci(X(s.F),Y(fr),8,slides?C.coral:C.blue,'#fff');
  o+=P2_block(500,256,60,40,s.m+' kg',slides?C.coralp:'#e8eef2')+L(450,276,570,276,C.ink,2);
  o+=TF(500,300,slides?'sliding':'at rest',14,slides?C.coral:C.green,'middle','font-weight="700"')+(slides?TF(500,320,'a = '+P2_n(a,2)+' m/s²',14,C.coral):'');
  o+=TF(220,360,'μs = '+s.mus+', μk = '+s.muk+' (illustrative, wood on wood)',13,C.muted);
  return {svg:o,phase:slides?`The push (${P2_n(s.F,1)} N) has passed the static limit of ${P2_n(fs,1)} N. Friction drops to the kinetic ${P2_n(fk,1)} N and the leftover ${P2_n(s.F-fk,1)} N accelerates the block.`:`Static friction exactly matches the ${P2_n(s.F,1)} N push, so the net force is zero and the block stays put. It can do this up to ${P2_n(fs,1)} N.`};
 }});

SCENE({id:'friction-area',name:'Friction and contact area',tag:'Amontons’ laws',
 definition:'For dry surfaces, the friction force depends on the normal force and the materials, but hardly at all on the apparent area of contact.',
 example:'A brick pulled on its broad face and on its narrow edge needs the same force to slide. The narrow face presses harder on a smaller area, and the effects cancel.',
 desc:'The same brick shown on its wide face and on its narrow side, with equal pulling forces, different contact areas and pressures, and a note on real microscopic contact.',
 dur:8,research:'Amontons (1699), rediscovering Leonardo da Vinci’s notebook observations (c. 1493). Bowden & Tabor (1950) explained it by the true contact area of microscopic bumps.',
 hint:'Turn the brick and change its mass: the friction changes only with mass.',
 init:()=>({face:'wide',m:3,mu:.4}),
 watch:p=>({face:p<.5?'wide':'narrow',m:3,mu:.4}),
 ui:[{choose:[['wide','Broad face'],['narrow','Narrow edge']],label:'Face',get:s=>s.face,act:'face'},{range:'m',label:'Mass',min:1,max:6,step:.5,get:s=>s.m,act:'m',show:v=>v+' kg'}],
 on:{face(s,v){s.face=v},m(s,v){s.m=v}},
 draw(s){
  const N=s.m*P2_g,f=s.mu*N,area=s.face==='wide'?.02:.006;let o=heading('Same brick, same friction, different area');
  o+=L(40,250,560,250,C.ink,2);
  const w=s.face==='wide'?200:60,h=s.face==='wide'?60:200,x=300-w/2,y=250-h;
  o+=R(x,y,w,h,'#d9a07c',C.ink,4);for(let i=0;i<(s.face==='wide'?6:2);i++)o+=Ci(x+w*(i+.5)/(s.face==='wide'?6:2),252,3,C.coral);
  o+=P2_vec(x+w,y+h/2,90,0,C.blue,'pull '+P2_n(f,1)+' N',0,-16)+P2_vec(x,y+h/2,-90,0,C.coral,'friction '+P2_n(f,1)+' N',0,-16);
  o+=TF(300,290,'contact area '+(area*1e4).toFixed(0)+' cm² · pressure '+P2_n(N/area/1000,2)+' kPa',14,C.ink);
  o+=TF(300,316,'friction = μ × normal force = '+s.mu+' × '+P2_n(N,1)+' N = '+P2_n(f,1)+' N',14,C.blue);
  o+=TF(300,345,'The dots mark microscopic contact points: few real contacts carry the load.',13,C.muted);
  return {svg:o,phase:`On the ${s.face==='wide'?'broad face':'narrow edge'} the pressure is ${s.face==='wide'?'low over a large area':'high over a small area'}. Real contact happens only at microscopic bumps, whose total area grows with the load, so friction depends on the normal force (${P2_n(N,1)} N), not the apparent area.`};
 }});

/* ---------------- circular-motion ---------------- */
SCENE({id:'circular-motion',name:'Centripetal force',tag:'Motion in a circle',
 definition:'Moving in a circle at steady speed still means accelerating, because the direction keeps changing. The acceleration points to the centre and equals v²/r.',
 example:'Whirl a ball on a string and let go: it does not fly outwards, but straight along the tangent, the direction it was moving at that instant.',
 desc:'A ball whirled on a string with its velocity along the tangent and its acceleration towards the centre; cutting the string sends it off in a straight line along the tangent.',
 dur:10,research:'Huygens (1673). Horologium Oscillatorium, the result a = v²/r; Newton (1687) used it to connect gravity and orbits.',
 hint:'Change the radius and speed, Run, then press “Cut the string” at any moment and watch which way the ball goes.',
 init:()=>({r:1,v:3,cut:2}),
 ui:[{range:'r',label:'Radius',min:.5,max:1.5,step:.1,get:s=>s.r,act:'r',show:v=>v+' m'},{range:'v',label:'Speed',min:1,max:5,step:.5,get:s=>s.v,act:'v',show:v=>v+' m/s'},{b:'Cut the string now',act:'cut'},{b:'Mend the string',act:'mend'}],
 on:{r(s,v){s.r=v},v(s,v){s.v=v},cut(s,a,ctx){const f=ctx.frames&&ctx.frames[ctx.k];s.cut=f?f.t:0;return 'keep'},mend(s){s.cut=99}},
 trace:()=>P2_timeFrames(4,.05),
 draw(s,f,X){
  const cx=230,cy=200,sc=90,w=s.v/s.r,t=f.t,R0=s.r*sc;const at=tt=>[cx+R0*Math.cos(w*tt),cy-R0*Math.sin(w*tt)];
  let o=heading('A turn needs a force towards the centre');o+=Ci(cx,cy,R0,'none',C.line,'stroke-dasharray="5 5"')+Ci(cx,cy,5,C.ink);
  let p,cut=t>s.cut;
  if(!cut){p=at(t);o+=L(cx,cy,p[0],p[1],C.ink,2);const ang=w*t;o+=arrow(p[0],p[1],p[0]-Math.sin(ang)*45,p[1]-Math.cos(ang)*45,C.blue,2.5,8)+arrow(p[0],p[1],p[0]+(cx-p[0])*.45,p[1]+(cy-p[1])*.45,C.coral,2.5,8)}
  else{const q=at(s.cut),ang=w*s.cut,vx=-Math.sin(ang),vy=-Math.cos(ang);const d=(t-s.cut)*s.v*sc;p=[q[0]+vx*d,q[1]+vy*d];
   o+=L(q[0],q[1],q[0]+vx*600,q[1]+vy*600,C.blue,1.5,'stroke-dasharray="3 5"');for(let k=1;k<=6;k++){const dd=d*k/6;o+=Ci(q[0]+vx*dd,q[1]+vy*dd,2.5,C.blue)}o+=Ci(q[0],q[1],4,C.coral)}
  o+=Ci(p[0],p[1],11,C.purple,'#fff');
  const a=s.v*s.v/s.r,m=.2;o+=R(410,60,175,170,'#fff',C.grid,10);
  o+=TF(420,84,'a = v²/r',15,C.coral,'start','font-weight="700"')+TF(420,108,'= '+s.v+'² / '+s.r+' = '+P2_n(a,1)+' m/s²',14,C.ink,'start');
  o+=TF(420,136,'tension (0.2 kg ball)',13,C.muted,'start')+TF(420,156,'= m v²/r = '+P2_n(m*a,2)+' N',14,C.ink,'start');
  o+=TF(420,184,'blue: velocity',13,C.blue,'start')+TF(420,204,'coral: acceleration',13,C.coral,'start');
  o+=TF(230,345,cut?'String cut at t = '+P2_n(s.cut,2)+' s: no more inward force':'t = '+P2_n(t,2)+' s · idealised: no gravity, no drag',13,C.muted);
  return {svg:o,phase:cut?'With the string cut, nothing pulls the ball inwards, so by Newton’s first law it carries on in a straight line along the tangent. There is no outward “centrifugal” push sending it away from the centre.':`The string pulls the ball towards the centre with ${P2_n(m*a,2)} N. That inward force keeps turning the velocity, giving an acceleration of v²/r = ${P2_n(a,1)} m/s² towards the centre.`};
 }});

SCENE({id:'circular-motion-banked',name:'Banked curves',tag:'Turning without friction',
 definition:'Tilting a road inward lets the normal force supply some of the centripetal force. At one design speed, v = √(r g tan θ), no friction is needed at all.',
 example:'A curve of radius 50 m banked at 20° needs no friction at about 13 m/s. Faster cars need friction pointing down the slope; slower ones need it pointing up.',
 desc:'A cross-section of a car on a banked road with arrows for weight, normal force and the friction needed, and a readout of the design speed and the friction required.',
 dur:9,research:'Newton’s second law applied to circular motion (Huygens 1673; Newton 1687); banking is standard in road and railway design (cant).',
 hint:'Change the speed past the design speed and watch the friction arrow flip direction.',
 init:()=>({theta:20,v:13,r:50}),
 watch:p=>({theta:20,v:5+30*p,r:50}),
 ui:[{range:'theta',label:'Bank',min:0,max:40,step:1,get:s=>s.theta,act:'theta',show:v=>v+'°'},{range:'v',label:'Speed',min:5,max:35,step:1,get:s=>s.v,act:'v',show:v=>v+' m/s'}],
 on:{theta(s,v){s.theta=v},v(s,v){s.v=v}},
 draw(s){
  const th=s.theta*Math.PI/180,vd=Math.sqrt(s.r*P2_g*Math.tan(th)),need=s.v*s.v/s.r*Math.cos(th)-P2_g*Math.sin(th);
  let o=heading('A tilted road helps turn the car');const px=120,py=290,len=340,tx=px+len*Math.cos(th),ty=py-len*Math.sin(th);
  o+=`<polygon points="${P2_poly([[px,py],[tx,ty],[tx,py+20],[px,py+20]])}" fill="#d7dee3" stroke="${C.ink}" stroke-width="2"/>`;
  const bx=px+len*.5*Math.cos(th),by=py-len*.5*Math.sin(th),nx=-Math.sin(th),ny=-Math.cos(th),cx=bx+nx*20,cy=by+ny*20;
  o+=`<g transform="translate(${fmt(cx)},${fmt(cy)}) rotate(${fmt(-s.theta)})">`+R(-34,-20,68,40,C.blue,C.ink,8)+'</g>';
  o+=P2_vec(cx,cy,0,70,C.ink,'weight',0,0,13)+P2_vec(cx,cy,nx*80,ny*80,C.green,'normal',0,0,13);
  const ux=-Math.cos(th),uy=Math.sin(th),fk=Math.sign(need)*Math.min(70,Math.max(54,Math.abs(need)*6));if(Math.abs(need)>.05)o+=P2_vec(cx,cy,ux*fk,uy*fk,C.coral,'friction',0,0,13);
  o+=arrow(80,200,30,200,C.purple,2.5,9)+TF(56,188,'to centre',13,C.purple);
  o+=R(400,56,185,140,'#fff',C.grid,10)+TF(410,80,'Design speed',13,C.muted,'start')+TF(410,102,'√(r g tan θ) = '+P2_n(vd,1)+' m/s',14,C.ink,'start','font-weight="700"');
  o+=TF(410,130,'friction needed (per kg)',13,C.muted,'start')+TF(410,152,Math.abs(need)<.05?'none':P2_n(Math.abs(need),2)+' N '+(need>0?'down the slope':'up the slope'),14,C.coral,'start','font-weight="700"')+TF(410,180,'radius '+s.r+' m',13,C.muted,'start');
  return {svg:o,phase:Math.abs(need)<.05?`At ${s.v} m/s the tilted normal force alone supplies the centripetal force: no friction needed.`:need>0?`At ${s.v} m/s, faster than the design speed of ${P2_n(vd,1)} m/s, the normal force is not enough, so friction must point down the slope to pull the car inward.`:`At ${s.v} m/s, slower than ${P2_n(vd,1)} m/s, the car would slide down the bank, so friction must point up the slope.`};
 }});

function P2_loop(h,r){ // frictionless loop: returns {ok, leave (angle from bottom, rad) or null, vTop2}
 const hr=h/r;if(hr>=2.5)return {ok:true,leave:null};if(hr<=1)return {ok:false,leave:null,slideBack:true};
 return {ok:false,leave:Math.acos((2-2*hr)/3)};
}
SCENE({id:'circular-motion-loop',name:'Loop-the-loop',tag:'The minimum speed at the top',
 definition:'At the top of a loop the track can only push down, so gravity alone must at least provide the centripetal force: v² ≥ g r. Without friction that needs a start at 2.5 times the loop’s radius.',
 example:'For a 5 m loop the car must reach the top at √(9.81 × 5) ≈ 7 m/s, so it must start at least 12.5 m above the bottom.',
 desc:'A frictionless ramp leading into a vertical loop; the car either completes the loop or loses contact, marked where the track force falls to zero, then follows a falling arc.',
 dur:9,research:'Energy conservation and v²/r (Huygens 1673; Newton 1687); a classic textbook result, as in Halliday & Resnick.',
 hint:'Lower the start height below 12.5 m and see where the car leaves the track.',
 init:()=>({h:10}),
 watch:p=>({h:8+8*p}),
 ui:[{range:'h',label:'Start height',min:3,max:20,step:.5,get:s=>s.h,act:'h',show:v=>v+' m'}],
 on:{h(s,v){s.h=v}},
 draw(s){
  const r=5,sc=13,floor=320,cx=420,cy=floor-r*sc,R0=r*sc,res=P2_loop(s.h,r);let o=heading(res.ok?'It goes all the way round':'It does not make it round');
  o+=L(30,floor,580,floor,C.ink,2)+Ci(cx,cy,R0,'none',C.ink,'stroke-width="3"');
  const sy=floor-s.h*sc;o+=P(`M40 ${fmt(sy)} Q ${fmt(cx-120)} ${floor} ${cx} ${floor}`,C.ink,3)+Ci(40,sy,8,C.blue)+TF(52,sy-10,'start '+s.h+' m',13,C.blue,'start');
  o+=L(cx+R0+20,floor,cx+R0+20,floor-2.5*r*sc,C.green,1.5,'stroke-dasharray="4 4"')+TF(cx+R0+24,floor-2.5*r*sc+4,'2.5 r = 12.5 m',13,C.green,'start');
  const pos=a=>[cx+R0*Math.sin(a),cy+R0*Math.cos(a)];
  if(res.ok){const v=Math.sqrt(2*P2_g*(s.h-2*r));const top=pos(Math.PI);o+=Ci(top[0],top[1],9,C.green,'#fff')+TF(cx,cy+6,'top speed '+P2_n(v,1)+' m/s',13,C.green)}
  else if(res.leave!==null){const a=res.leave,q=pos(a),v=Math.sqrt(2*P2_g*(s.h-r*(1-Math.cos(a))));let vx=v*Math.cos(a),vy=v*Math.sin(a);const pts=[];
   for(let t=0;t<3;t+=.03){const x=q[0]+vx*t*sc,y=q[1]-(vy*t-.5*P2_g*t*t)*sc;if(y>floor)break;pts.push([x,y])}
   o+=`<polyline points="${P2_poly(pts)}" fill="none" stroke="${C.coral}" stroke-width="2.5" stroke-dasharray="5 4"/>`+Ci(q[0],q[1],9,C.coral,'#fff')+TF(cx,cy+6,'leaves at '+P2_n(r*(1-Math.cos(a)),1)+' m',13,C.coral)}
  else o+=TF(cx,cy+6,'slides back down',13,C.coral);
  o+=TF(300,352,'Idealised: frictionless, car as a point mass, loop radius 5 m.',13,C.muted);
  return {svg:o,phase:res.ok?`Starting at ${s.h} m leaves enough energy to reach the top at ${P2_n(Math.sqrt(2*P2_g*(s.h-2*r)),1)} m/s, above the minimum √(gr) = ${P2_n(Math.sqrt(P2_g*r),1)} m/s, so the track keeps pressing on the car.`:res.leave!==null?`From ${s.h} m the car slows too much. Where the track’s push drops to zero it loses contact and falls on a curved path: it needed a start of at least 12.5 m.`:`From ${s.h} m the car cannot even climb above the loop’s middle height; it slides back down.`};
 }});

/* ---------------- gravitation ---------------- */
SCENE({id:'gravitation',name:'The inverse-square law',tag:'One gravity for apple and Moon',
 definition:'Every mass attracts every other with a force proportional to both masses and inversely proportional to the square of their distance: F = G m₁ m₂ / r².',
 example:'The Moon is about 60 Earth radii away, so gravity there should be 60² = 3600 times weaker than at the ground. The Moon’s orbit needs exactly that: about 0.0027 m/s².',
 desc:'Earth with a test mass moved outwards on a logarithmic distance scale, a curve of gravitational acceleration against distance, and Newton’s Moon test comparing 9.81/3600 with the Moon’s orbital acceleration.',
 dur:10,research:'Newton (1687). Principia, Book III, the “Moon test”; the apple story comes from William Stukeley’s memoir (1752), recalled late in Newton’s life.',
 hint:'Slide the distance from the ground to the Moon and compare the two numbers at 60 Earth radii.',
 init:()=>({d:1}),
 watch:p=>({d:Math.pow(60,p)}),
 ui:[{range:'d',label:'Distance',min:1,max:60,step:1,get:s=>Math.round(s.d),act:'d',show:v=>v+' Earth radii'}],
 on:{d(s,v){s.d=v}},
 draw(s){
  const g=P2_g/(s.d*s.d),X=d=>60+Math.log(d)/Math.log(60)*470;let o=heading('Gravity weakens with the square of distance');
  o+=Ci(60,110,30,C.blue)+TF(60,115,'Earth',13,'#fff')+Ci(530,110,10,'#b8c2c9',C.ink)+TF(530,140,'Moon',13,C.muted);
  for(const d of [1,2,5,10,20,60])o+=L(X(d),148,X(d),154,C.muted,1)+TF(X(d),170,d+' R',13,C.muted);
  o+=L(60,151,530,151,C.line,1.5)+Ci(X(s.d),110,8,C.coral)+P2_vec(X(s.d),110,-Math.max(6,40*Math.sqrt(g/P2_g)),0,C.coral,'',0,0);
  const gx=70,gy=200,gw=300,gh=110;o+=P2_axes(gx,gy,gw,gh,'distance (Earth radii, log scale)','g (m/s²)',[],[[0,'0'],[1,'9.81']]);
  const pts=[];for(let i=0;i<=60;i++){const d=Math.pow(60,i/60);pts.push([gx+i/60*gw,gy+gh-(P2_g/(d*d))/P2_g*gh])}o+=`<polyline points="${P2_poly(pts)}" fill="none" stroke="${C.blue}" stroke-width="2.5"/>`;
  o+=Ci(gx+Math.log(s.d)/Math.log(60)*gw,gy+gh-g/P2_g*gh,6,C.coral);
  const rM=3.844e8,T=27.32*86400,aM=4*Math.PI*Math.PI*rM/(T*T);
  o+=R(395,196,190,120,'#fff',C.grid,10)+TF(405,218,'g here = 9.81 / '+Math.round(s.d)+'²',13,C.ink,'start')+TF(405,240,'= '+(g<.1?g.toExponential(2):P2_n(g,3))+' m/s²',14,C.coral,'start','font-weight="700"');
  o+=TF(405,268,'Moon’s orbit needs 4π²r/T²',13,C.muted,'start')+TF(405,290,'= '+P2_n(aM,5)+' m/s²',14,C.blue,'start','font-weight="700"');
  return {svg:o,phase:Math.round(s.d)>=60?`At 60 Earth radii the inverse-square law predicts 9.81 / 3600 = ${P2_n(P2_g/3600,5)} m/s². The Moon’s orbit (radius 384 400 km, period 27.3 days) needs ${P2_n(aM,5)} m/s²: the same force holds the Moon and drops the apple.`:`At ${Math.round(s.d)} Earth radii gravity is 1/${Math.round(s.d*s.d)} as strong as at the surface. Keep going out to the Moon’s distance to test Newton’s idea.`};
 }});

const P2_G=6.674e-11;
SCENE({id:'gravitation-cavendish',name:'Weighing the Earth',tag:'Cavendish’s torsion balance',
 definition:'Cavendish measured the tiny attraction between lead balls in his laboratory. That fixed the gravitational constant G, and with it the mass and density of the Earth.',
 example:'With 158 kg balls 23 cm from 0.73 kg balls, the rod turns by about a thousandth of a radian. From that twist and the balance’s swing period you can calculate G, then the Earth’s mass from g = GM/R².',
 desc:'A top view of a torsion balance: a rod with small balls hangs on a fibre between two large balls; it swings and settles at a small deflection, from which G, the Earth’s mass and its density are computed.',
 dur:12,research:'Cavendish (1798). Experiments to determine the density of the Earth; he reported 5.48 times water (later corrected to 5.45). The modern value is about 5.51.',
 hint:'Change the big masses and their distance, or add a reading error, and see how the derived Earth density moves.',
 init:()=>({M:158,r:.23,err:0}),
 ui:[{range:'M',label:'Big balls',min:50,max:200,step:2,get:s=>s.M,act:'M',show:v=>v+' kg'},{range:'r',label:'Separation',min:.15,max:.3,step:.01,get:s=>s.r,act:'r',show:v=>(v*100).toFixed(0)+' cm'},{range:'err',label:'Reading error',min:-20,max:20,step:1,get:s=>s.err,act:'err',show:v=>(v>0?'+':'')+v+'%'}],
 on:{M(s,v){s.M=v},r(s,v){s.r=v},err(s,v){s.err=v}},
 trace:()=>P2_timeFrames(3,.05).map(f=>({t:f.t})),
 draw(s,f,X){
  const L0=1.86,Tp=420,th=P2_G*s.M*Tp*Tp/(2*Math.PI*Math.PI*L0*s.r*s.r),meas=th*(1+s.err/100),Gm=2*Math.PI*Math.PI*L0*s.r*s.r*meas/(s.M*Tp*Tp);
  const ME=P2_g*Math.pow(6.371e6,2)/Gm,rho=ME/(4/3*Math.PI*Math.pow(6.371e6,3));
  const t=f.t,ang=th*(1-Math.cos(2*Math.PI*t)*Math.exp(-t*.6)),vis=ang*170;let o=heading('A twist of a thousandth of a radian');
  const cx=180,cy=200;o+=Ci(cx,cy,135,'#f4f7f9',C.grid);
  const rot=a=>{const c=Math.cos(a),sn=Math.sin(a);return (x,y)=>[cx+x*c-y*sn,cy+x*sn+y*c]};const rr=rot(vis);
  const e1=rr(-110,0),e2=rr(110,0);o+=L(e1[0],e1[1],e2[0],e2[1],C.ink,3)+Ci(e1[0],e1[1],8,C.blue)+Ci(e2[0],e2[1],8,C.blue)+Ci(cx,cy,4,C.ink);
  o+=Ci(cx-110,cy-34,20,'#6b7680')+Ci(cx+110,cy+34,20,'#6b7680')+TF(cx-110,cy-62,s.M+' kg',13,C.muted)+TF(cx+110,cy+74,s.M+' kg',13,C.muted);
  o+=TF(cx,355,'deflection exaggerated about 170× · fibre at the centre',13,C.muted);
  o+=R(340,50,245,250,'#fff',C.grid,10);let y=74;const line=(a,col=C.ink,b=false)=>{o+=TF(352,y,a,13.5,col,'start',b?'font-weight="700"':'');y+=24};
  line('rod 1.86 m · small balls 0.73 kg',C.muted);line('swing period 420 s (7 min)',C.muted);
  line('deflection θ = '+P2_n(meas*1000,3)+' mrad',C.coral,true);line('G = 2π² L r² θ / (M T²)');line('= '+Gm.toExponential(3)+' N·m²/kg²',C.blue,true);
  line('Earth’s mass = g R² / G');line('= '+ME.toExponential(2)+' kg',C.blue,true);line('mean density = '+P2_n(rho/1000,2)+' g/cm³',C.purple,true);
  line(s.err?'(true value 5.51 g/cm³)':'Cavendish found 5.48',C.muted);
  return {svg:o,phase:s.err?`A ${Math.abs(s.err)}% ${s.err>0?'over':'under'}-reading of a deflection this small shifts G, and so the Earth’s density, by the same ${Math.abs(s.err)}%: Cavendish had to shield the room and watch through a telescope.`:`The attraction between the balls twists the fibre by ${P2_n(th*1000,3)} milliradians. Timing the swing gives the fibre’s stiffness, and the twist then gives G = ${Gm.toExponential(3)}. With g and the Earth’s radius that weighs the Earth: ${ME.toExponential(2)} kg.`};
 }});

const P2_BODIES=[['Moon',1.62],['Mercury',3.70],['Mars',3.71],['Venus',8.87],['Earth',9.81],['Saturn',10.44],['Jupiter',24.79]];
SCENE({id:'gravitation-weight',name:'Mass and weight',tag:'Weight changes; mass does not',
 definition:'Mass measures how much matter, and how hard it is to accelerate, in kilograms. Weight is the gravitational force on that mass, in newtons: W = m g.',
 example:'A 60 kg person weighs about 589 N on Earth and only 97 N on the Moon, yet is just as hard to push sideways on both.',
 desc:'A bar for each body in the Solar System showing the weight of the chosen mass there, with the chosen body highlighted and a spring scale reading.',
 dur:8,research:'Newton (1687) separated quantity of matter (mass) from weight. Surface gravities from the NASA planetary fact sheets (rounded; Jupiter and Saturn at the cloud tops).',
 hint:'Pick a world and change the mass: the bar is the weight, the label stays the mass.',
 init:()=>({m:60,body:'Moon'}),
 watch:p=>({m:60,body:P2_BODIES[Math.min(6,Math.floor(p*7))][0]}),
 ui:[{range:'m',label:'Mass',min:1,max:120,step:1,get:s=>s.m,act:'m',show:v=>v+' kg'},{choose:P2_BODIES.map(b=>[b[0],b[0]]),label:'Body',get:s=>s.body,act:'body'}],
 on:{m(s,v){s.m=v},body(s,v){s.body=v}},
 draw(s,f,X){
  let o=heading('The same '+s.m+' kg everywhere');const max=120*24.79,x0=130,w=330;
  P2_BODIES.forEach(([n,g],i)=>{const y=60+i*38,W=s.m*g,on=n===s.body;o+=hit(X,'body',n,`${n}: ${P2_n(W,0)} N`,R(20,y-6,560,34,on?C.amberp:'transparent','none',6)+TF(x0-10,y+16,n,14,on?C.ink:C.muted,'end',on?'font-weight="700"':'')+R(x0,y,Math.max(2,W/max*w),22,on?C.coral:C.blue,'none',4)+TF(x0+W/max*w+8,y+16,P2_n(W,0)+' N',13,on?C.coral:C.ink,'start'))});
  const g=P2_BODIES.find(b=>b[0]===s.body)[1];o+=TF(300,340,s.m+' kg on '+s.body+': W = m g = '+s.m+' × '+g+' = '+P2_n(s.m*g,0)+' N',15,C.ink,'middle','font-weight="650"');
  return {svg:o,phase:`On ${s.body} gravity at the surface is ${g} m/s², so ${s.m} kg weighs ${P2_n(s.m*g,0)} N. The mass, ${s.m} kg, is the same on every world; only the pull on it changes.`};
 }});

/* ---------------- kepler-orbits ---------------- */
const P2_MU=3.986e14,P2_RE=6.371e6,P2_orbitCache=new Map();
function P2_cannon(v){ // velocity Verlet, dt = 10 s, from 200 km altitude, horizontal launch (km/s)
 const key=v.toFixed(2);if(P2_orbitCache.has(key))return P2_orbitCache.get(key);
 let x=P2_RE+2e5,y=0,vx=0,vy=v*1000,dt=10;const pts=[[x,y]];let ax=-P2_MU*x/Math.pow(Math.hypot(x,y),3),ay=-P2_MU*y/Math.pow(Math.hypot(x,y),3),outcome='orbit',ang=0,last=Math.atan2(y,x);
 for(let i=0;i<6000;i++){x+=vx*dt+.5*ax*dt*dt;y+=vy*dt+.5*ay*dt*dt;const r=Math.hypot(x,y),nax=-P2_MU*x/(r*r*r),nay=-P2_MU*y/(r*r*r);vx+=.5*(ax+nax)*dt;vy+=.5*(ay+nay)*dt;ax=nax;ay=nay;
  const a=Math.atan2(y,x);let d=a-last;if(d<-Math.PI)d+=2*Math.PI;if(d>Math.PI)d-=2*Math.PI;ang+=d;last=a;
  if(i%3===0)pts.push([x,y]);if(r<P2_RE){outcome='falls';pts.push([x,y]);break}if(r>12*P2_RE){outcome='escapes';break}if(ang>=2*Math.PI){outcome='orbit';pts.push([x,y]);break}}
 const res={pts,outcome};P2_orbitCache.set(key,res);return res;
}
const P2_vesc=Math.sqrt(2*P2_MU/(P2_RE+2e5))/1000,P2_vcirc=Math.sqrt(P2_MU/(P2_RE+2e5))/1000;
SCENE({id:'kepler-orbits',name:'Newton’s cannon',tag:'Falling all the way round',
 definition:'An orbit is free fall in which the ground curves away as fast as you fall towards it. Fire fast enough sideways and you never land.',
 example:'From 200 km up, about 7.8 km/s sideways gives a circular orbit; about 11 km/s escapes the Earth altogether. Slower shots fall back.',
 desc:'A cannon on a very tall mountain fires horizontally at a chosen speed; the path is computed step by step and either hits the Earth, closes into an orbit, or escapes.',
 dur:12,research:'Newton (1728, written c. 1685). A Treatise of the System of the World, the cannon thought experiment; orbit integrated here with Newton’s law of gravitation.',
 hint:'Slide the launch speed through 7.8 km/s and 11 km/s and watch the path change from crash to orbit to escape.',
 init:()=>({v:7.2}),
 watch:p=>{const vs=[6,7.8,9.6,11.4],i=Math.min(3,Math.floor(p*4));return {v:vs[i],u:p*4-i}},
 ui:[{range:'v',label:'Launch speed',min:4,max:12,step:.1,get:s=>s.v,act:'v',show:v=>v.toFixed(1)+' km/s'}],
 on:{v(s,v){s.v=v}},
 draw(s,f,X){
  const res=P2_cannon(s.v),sc=38/P2_RE,cx=300,cy=196;let o=heading(res.outcome==='falls'?'It falls back to Earth':res.outcome==='escapes'?'It escapes':'It falls all the way round');
  o+=Ci(cx,cy,38,'#8fb8d8',C.blue)+L(cx+38,cy,cx+43,cy,C.ink,4);
  const n=X.try?res.pts.length:Math.max(2,Math.round(res.pts.length*clamp(s.u===undefined?1:s.u,0,1)));const pts=res.pts.slice(0,n).map(([x,y])=>[cx+x*sc,cy-y*sc]);
  o+=`<polyline points="${P2_poly(pts)}" fill="none" stroke="${C.coral}" stroke-width="2.5"/>`;const e=pts[pts.length-1];if(e)o+=Ci(e[0],e[1],5,C.coral);
  o+=TF(20,60,'circular ≈ '+P2_n(P2_vcirc,1)+' km/s',13,C.green,'start')+TF(20,80,'escape ≈ '+P2_n(P2_vesc,1)+' km/s',13,C.purple,'start');
  o+=TF(580,60,s.v.toFixed(1)+' km/s',16,C.coral,'end','font-weight="700"')+TF(580,80,res.outcome==='falls'?'crashes':res.outcome==='escapes'?'escapes':'closed orbit',13,C.ink,'end');
  o+=TF(300,360,'Launch 200 km up · no air drag · Earth to scale',13,C.muted);
  return {svg:o,phase:res.outcome==='falls'?`At ${s.v.toFixed(1)} km/s the ball falls faster than the Earth curves away beneath it, so it lands.`:res.outcome==='escapes'?`Above about ${P2_n(P2_vesc,1)} km/s the ball has more kinetic energy than gravity can ever take back: it leaves for good.`:`Between about ${P2_n(P2_vcirc,1)} and ${P2_n(P2_vesc,1)} km/s the ball is still falling, but the Earth curves away as fast as it falls: it goes round on an ellipse${Math.abs(s.v-P2_vcirc)<.15?' (here almost a circle)':''}.`};
 },
 three(s,f,X,project){
  const res=P2_cannon(s.v),P=project([[-3.2,-3.2,-1.2],[3.2,3.2,1.2]]);let o='';
  for(let k=0;k<6;k++){const lat=(k-2.5)/6*Math.PI,pts=range(41).map(i=>{const a=i/40*2*Math.PI;return P([Math.cos(lat)*Math.cos(a),Math.cos(lat)*Math.sin(a),Math.sin(lat)])});o+=`<polyline points="${P2_poly(pts.map(p=>p.slice(0,2)))}" fill="none" stroke="#9cc2dd" stroke-width="1.2"/>`}
  for(let k=0;k<8;k++){const lo=k/8*Math.PI,pts=range(41).map(i=>{const a=i/40*2*Math.PI;return P([Math.cos(a)*Math.cos(lo),Math.cos(a)*Math.sin(lo),Math.sin(a)])});o+=`<polyline points="${P2_poly(pts.map(p=>p.slice(0,2)))}" fill="none" stroke="#9cc2dd" stroke-width="1.2"/>`}
  const tilt=.45,path=res.pts.map(([x,y])=>{const X3=x/P2_RE,Y3=y/P2_RE;return P([X3,Y3*Math.cos(tilt),Y3*Math.sin(tilt)])}).filter(p=>Math.abs(p[0]-300)<400);
  o+=`<polyline points="${P2_poly(path.map(p=>p.slice(0,2)))}" fill="none" stroke="${C.coral}" stroke-width="2.5"/>`;
  return {svg:o,title:'Newton’s cannon over a globe',caption:`The ${s.v.toFixed(1)} km/s path in its own plane, tilted against the Earth’s grid: an orbit is a falling path that misses the ground.`};
 }});

function P2_kepler(M,e){let E=M;for(let i=0;i<40;i++)E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));return E}
SCENE({id:'kepler-orbits-areas',name:'Equal areas in equal times',tag:'Kepler’s second law',
 definition:'A line from the Sun to a planet sweeps out equal areas in equal times. So a planet moves fastest when it is closest to the Sun.',
 example:'Earth is nearest the Sun in early January and moves about 3% faster then than in July, when it is farthest away.',
 desc:'An elliptical orbit with the Sun at one focus, divided into sectors swept in equal time; sectors near the Sun are short and wide, far ones long and thin, all of equal area.',
 dur:10,research:'Kepler (1609). Astronomia Nova, from Tycho Brahe’s observations of Mars; Newton (1687) showed it follows from any central force.',
 hint:'Make the orbit more eccentric: the sectors change shape but keep equal areas, and the planet races near the Sun.',
 init:()=>({e:.5,n:8}),
 watch:p=>({e:.5,n:8,M:2*Math.PI*p}),
 ui:[{range:'e',label:'Eccentricity',min:0,max:.85,step:.05,get:s=>s.e,act:'e'},{choose:[[6,'6'],[8,'8'],[12,'12']],label:'Sectors',get:s=>s.n,act:'n'}],
 on:{e(s,v){s.e=v},n(s,v){s.n=Number(v)}},
 draw(s,f,X){
  const a=150,b=a*Math.sqrt(1-s.e*s.e),cx=300+a*s.e*.0,cy=200,fx=cx+a*s.e,pos=M=>{const E=P2_kepler(M,s.e);return [cx+a*Math.cos(E),cy-b*Math.sin(E)]};
  let o=heading('Equal times sweep equal areas');
  for(let k=0;k<s.n;k++){const pts=[[fx,cy]];for(let j=0;j<=20;j++)pts.push(pos(2*Math.PI*(k+j/20)/s.n));o+=`<polygon points="${P2_poly(pts)}" fill="${k%2?C.pale:C.amberp}" stroke="${C.line}" stroke-width="1"/>`}
  o+=`<ellipse cx="${cx}" cy="${cy}" rx="${a}" ry="${fmt(b)}" fill="none" stroke="${C.ink}" stroke-width="2"/>`+Ci(fx,cy,12,'#f2b632','#c18a00');
  const M=s.M!==undefined?s.M:0,p=pos(M),E=P2_kepler(M,s.e),sp=Math.sqrt((1+s.e*Math.cos(E))/(1-s.e*Math.cos(E)));o+=Ci(p[0],p[1],8,C.blue,'#fff');
  o+=TF(20,360,'each sector: 1/'+s.n+' of the orbital period',13,C.muted,'start')+TF(580,360,'speed now: '+P2_n(sp,2)+' × circular speed at distance a',13,C.blue,'end');
  return {svg:o,phase:s.e<.05?'A circular orbit: every sector is identical and the speed never changes.':`With eccentricity ${s.e}, the sectors near the Sun are short and fat, the far ones long and thin, but each has the same area. The planet is ${P2_n((1+s.e)/(1-s.e),2)} times faster at its closest point than at its farthest.`};
 }});

const P2_PLANETS=[['Mercury',.387,.241],['Venus',.723,.615],['Earth',1,1],['Mars',1.524,1.881],['Jupiter',5.203,11.86],['Saturn',9.537,29.46],['Uranus',19.19,84.01],['Neptune',30.07,164.8]];
SCENE({id:'kepler-orbits-third',name:'The harmonic law',tag:'Kepler’s third law',
 definition:'The square of a planet’s orbital period is proportional to the cube of its average distance from the Sun: T² ∝ a³. In years and astronomical units, T² = a³.',
 example:'Jupiter is 5.2 times farther from the Sun than Earth, so its year is √(5.2³) ≈ 11.9 Earth years.',
 desc:'A log–log plot of orbital period against distance for the eight planets, all lying on one straight line of slope 3/2, with a movable hypothetical planet.',
 dur:9,research:'Kepler (1619). Harmonices Mundi. Planet data from the NASA planetary fact sheets (semi-major axis in AU, sidereal period in years).',
 hint:'Press a planet to check T²/a³, or slide the hypothetical planet to any distance.',
 init:()=>({pick:'Jupiter',a:3}),
 watch:p=>({pick:P2_PLANETS[Math.min(7,Math.floor(p*8))][0],a:3}),
 ui:[{range:'a',label:'Your planet',min:.2,max:40,step:.1,get:s=>s.a,act:'a',show:v=>v.toFixed(1)+' AU'}],
 on:{pick(s,v){s.pick=v},a(s,v){s.a=v}},
 draw(s,f,X){
  const gx=70,gy=55,gw=270,gh=250,lx=v=>gx+(Math.log10(v)+1)/2.7*gw,ly=v=>gy+gh-(Math.log10(v)+1)/3.5*gh;let o=heading('Every planet on one line: T² = a³');
  o+=L(gx,gy+gh,gx+gw,gy+gh,C.muted,1.5)+L(gx,gy,gx,gy+gh,C.muted,1.5);
  for(const v of [.1,1,10])o+=TF(lx(v),gy+gh+18,v+'',13,C.muted)+TF(gx-8,ly(v)+4,v+'',13,C.muted,'end');o+=TF(lx(100),gy+gh+18,'',13,C.muted);
  o+=TF(gx+gw/2,gy+gh+38,'distance a (AU, log)',13,C.muted)+TF(gx-6,gy-10,'period T (years, log)',13,C.muted,'start');
  o+=L(lx(.15),ly(Math.pow(.15,1.5)),lx(45),ly(Math.pow(45,1.5)),C.line,2,'stroke-dasharray="5 4"');
  P2_PLANETS.forEach(([n,a,T])=>{const on=n===s.pick;o+=hit(X,'pick',n,`${n}: a = ${a} AU, T = ${T} years`,Ci(lx(a),ly(T),on?9:6,on?C.coral:C.blue,'#fff'))+TF(lx(a)+10,ly(T)+4,n,13,on?C.coral:C.muted,'start')});
  const Ty=Math.pow(s.a,1.5);o+=Ci(lx(s.a),ly(Ty),7,C.purple,'#fff');
  const pk=P2_PLANETS.find(p=>p[0]===s.pick);o+=R(420,70,165,170,'#fff',C.grid,10);
  o+=TF(430,94,pk[0],15,C.coral,'start','font-weight="700"')+TF(430,118,'a = '+pk[1]+' AU',14,C.ink,'start')+TF(430,140,'T = '+pk[2]+' yr',14,C.ink,'start')+TF(430,164,'T² / a³ = '+P2_n(pk[2]*pk[2]/Math.pow(pk[1],3),3),14,C.blue,'start','font-weight="700"');
  o+=TF(430,198,'Your planet',13,C.purple,'start')+TF(430,220,s.a.toFixed(1)+' AU → '+P2_n(Ty,2)+' yr',14,C.purple,'start');
  return {svg:o,phase:`${pk[0]}: T² / a³ = ${P2_n(pk[2]*pk[2]/Math.pow(pk[1],3),3)}, essentially 1. On log–log axes T² = a³ is a straight line of slope 3/2. Newton later showed the constant depends on the Sun’s mass.`};
 }});

/* ---------------- fluids ---------------- */
const P2_MATS=[['cork',240],['wood',600],['ice',917],['aluminium',2700],['iron',7870]],P2_FLUIDS=[['fresh water',1000],['sea water',1025],['mercury',13534]];
SCENE({id:'fluids',name:'Archimedes’ principle',tag:'Why things float',
 definition:'An object in a fluid is pushed up by a force equal to the weight of the fluid it displaces. It floats if it is less dense than the fluid.',
 example:'Ice (917 kg/m³) floats in water with about 92% below the surface. Iron sinks in water but floats in mercury, which is denser still.',
 desc:'A one-litre block lowered into a tank of liquid; it floats with a fraction submerged equal to its density divided by the liquid’s, or sinks to the bottom, with buoyancy and weight arrows.',
 dur:10,research:'Archimedes (c. 250 BCE). On Floating Bodies, Book I. The “Eureka” bath story was told by Vitruvius about two centuries later.',
 hint:'Try each material in each liquid. A floating block sinks until the water it pushes aside weighs as much as the block.',
 init:()=>({mat:'ice',fl:'fresh water'}),
 watch:p=>({mat:P2_MATS[Math.min(4,Math.floor(p*5))][0],fl:'fresh water'}),
 ui:[{choose:P2_MATS.map(m=>[m[0],m[0]]),label:'Material',get:s=>s.mat,act:'mat'},{choose:P2_FLUIDS.map(m=>[m[0],m[0]]),label:'Liquid',get:s=>s.fl,act:'fl'}],
 on:{mat(s,v){s.mat=v},fl(s,v){s.fl=v}},
 draw(s){
  const rho=P2_MATS.find(m=>m[0]===s.mat)[1],rf=P2_FLUIDS.find(m=>m[0]===s.fl)[1],V=.001,W=rho*V*P2_g,floats=rho<rf,frac=floats?rho/rf:1,B=rf*V*P2_g*frac;
  let o=heading(floats?'It floats: '+P2_n(frac*100,0)+'% under':'It sinks');const tx=80,ty=90,tw=280,th=240,surf=150,side=90;
  o+=R(tx,ty,tw,th,'none',C.ink,4)+R(tx+2,surf,tw-4,ty+th-surf-2,s.fl==='mercury'?'#c9cdd2':'#cfe5f3','none',2);
  const bx=tx+tw/2-side/2,by=floats?surf-side*(1-frac):ty+th-side-2;o+=R(bx,by,side,side,s.mat==='iron'?'#7d8a94':s.mat==='aluminium'?'#c3cbd1':s.mat==='ice'?'#eaf6fb':s.mat==='cork'?'#c8a27a':'#b98a58',C.ink,3)+TF(bx+side/2,by+side/2+5,s.mat,13,C.ink);
  const aw=Math.min(80,22+W*.8),ab=Math.min(80,22+B*.8);o+=arrow(bx+side+16,by+side/2,bx+side+16,by+side/2+aw,C.ink,3,10)+TF(bx+side+24,by+side/2+aw-4,'weight',13,C.ink,'start')+TF(bx+side+24,by+side/2+aw+12,P2_n(W,1)+' N',13,C.ink,'start');
  o+=arrow(bx-16,by+side/2,bx-16,by+side/2-ab,C.blue,3,10)+TF(bx-24,by+side/2-ab+10,'buoyancy',13,C.blue,'end')+TF(bx-24,by+side/2-ab+26,P2_n(B,1)+' N',13,C.blue,'end');
  o+=R(390,90,195,170,'#fff',C.grid,10);let y=114;const line=(a,col=C.ink,b)=>{o+=TF(402,y,a,13.5,col,'start',b?'font-weight="700"':'');y+=24};
  line('block: 1 litre of '+s.mat);line('density '+rho+' kg/m³');line(s.fl+': '+rf+' kg/m³');line(floats?'fraction under = '+rho+'/'+rf:'denser than the liquid',floats?C.blue:C.coral,true);line(floats?'= '+P2_n(frac,3):'buoyancy '+P2_n(B,1)+' N < weight',floats?C.blue:C.coral,true);line('buoyancy = ρ g V(displaced)',C.muted);
  return {svg:o,phase:floats?`${s.mat} is less dense than ${s.fl}, so it settles until the displaced liquid weighs as much as the block: ${P2_n(frac*100,0)}% of its volume, giving ${P2_n(B,1)} N of buoyancy.`:`Even fully submerged, ${s.mat} displaces only ${P2_n(rf*V*P2_g,1)} N of ${s.fl}, less than its ${P2_n(W,1)} N weight, so it sinks and the bottom supports the rest.`};
 }});

SCENE({id:'fluids-pressure',name:'Pressure with depth',tag:'Pascal and Torricelli',
 definition:'Pressure in a still liquid grows with depth: p = p₀ + ρ g h. The air above presses too: about 101 kPa at sea level, enough to hold up 760 mm of mercury.',
 example:'Every 10 m of sea water adds about one atmosphere of pressure. Torricelli’s tube of mercury stood 760 mm tall; a water barometer would need about 10.3 m.',
 desc:'A diver at an adjustable depth with a pressure gauge, beside Torricelli’s mercury barometer and the much taller water column the same air pressure would support.',
 dur:9,research:'Torricelli (1643), the mercury barometer; Pascal (1648), the Puy de Dôme experiment showing air pressure falls with altitude.',
 hint:'Take the diver deeper and compare liquids; the barometer columns show what one atmosphere can hold up.',
 init:()=>({depth:10,fl:'sea water'}),
 watch:p=>({depth:40*p,fl:'sea water'}),
 ui:[{range:'depth',label:'Depth',min:0,max:40,step:1,get:s=>Math.round(s.depth),act:'depth',show:v=>v+' m'},{choose:[['fresh water','Fresh'],['sea water','Sea']],label:'Liquid',get:s=>s.fl,act:'fl'}],
 on:{depth(s,v){s.depth=v},fl(s,v){s.fl=v}},
 draw(s){
  const rf=P2_FLUIDS.find(m=>m[0]===s.fl)[1],p0=101325,p=p0+rf*P2_g*s.depth;let o=heading('Deeper means more weight of liquid above');
  o+=R(40,70,200,280,'#cfe5f3','none',4)+L(40,70,240,70,C.blue,2);const dy=70+s.depth/40*270;
  for(let d=0;d<=40;d+=10)o+=L(40,70+d/40*270,48,70+d/40*270,C.ink,1)+TF(52,70+d/40*270+4,d+' m',13,C.ink,'start');
  o+=Ci(150,dy,10,C.coral)+L(150,dy+10,150,dy+30,C.coral,3);o+=TF(150,Math.max(dy-18,92),P2_n(p/1000,0)+' kPa',14,C.coral,'middle','font-weight="700"');
  o+=TF(140,368,P2_n(p/p0,2)+' atmospheres',13,C.muted);
  const bx=330,base=330,sc=.28;o+=R(bx,base-260,24,260,'none',C.ink,3)+R(bx+2,base-760*sc,20,760*sc,'#9ea7ad','none',2)+TF(bx+12,base+18,'mercury',13,C.ink)+TF(bx+30,base-760*sc+4,'760 mm',13,C.ink,'start');
  const wx=470;o+=R(wx,58,24,272,'none',C.ink,3)+R(wx+2,60,20,270,'#cfe5f3','none',2)+TF(wx+12,base+18,'water',13,C.ink)+TF(wx+30,72,'10.3 m (needs a',13,C.ink,'start')+TF(wx+30,90,'tube 13.6× taller;',13,C.ink,'start')+TF(wx+30,108,'not to scale)',13,C.muted,'start');
  return {svg:o,phase:`At ${Math.round(s.depth)} m in ${s.fl} the pressure is ${P2_n(p/1000,0)} kPa: the ${P2_n(p0/1000,0)} kPa of air plus ρgh = ${P2_n(rf*P2_g*s.depth/1000,0)} kPa from the liquid. The same air pressure holds up 760 mm of mercury, or about 10.3 m of water.`};
 }});

SCENE({id:'fluids-hydraulic',name:'The hydraulic press',tag:'Pascal’s principle',
 definition:'Pressure applied to an enclosed liquid is passed on equally everywhere. A small force on a small piston becomes a large force on a large piston.',
 example:'Press 100 N on a 1 cm² piston and a 20 cm² piston lifts 2000 N. The price: the big piston rises only a twentieth as far, so no energy is created.',
 desc:'Two connected cylinders of different area; the small piston is pushed down and the large one rises, with the forces, distances and equal work shown.',
 dur:9,research:'Pascal (1663, published posthumously). Traité de l’équilibre des liqueurs; Bramah patented the hydraulic press (1795).',
 hint:'Change the areas and the force; compare the work done on each side.',
 init:()=>({A1:1,A2:20,F1:100}),
 ui:[{range:'A1',label:'Small piston',min:1,max:5,step:1,get:s=>s.A1,act:'A1',show:v=>v+' cm²'},{range:'A2',label:'Large piston',min:5,max:40,step:1,get:s=>s.A2,act:'A2',show:v=>v+' cm²'},{range:'F1',label:'Push',min:10,max:200,step:10,get:s=>s.F1,act:'F1',show:v=>v+' N'}],
 on:{A1(s,v){s.A1=v},A2(s,v){s.A2=v},F1(s,v){s.F1=v}},
 trace:()=>P2_timeFrames(2,.1),
 draw(s,f,X){
  const d1=.10*f.t/2,d2=d1*s.A1/s.A2,F2=s.F1*s.A2/s.A1,p=s.F1/(s.A1*1e-4);let o=heading('A small push on a small piston lifts a lot');
  const w1=14+s.A1*6,w2=30+s.A2*4.5,x1=140,x2=400,top=150,base=300;
  o+=R(x1-w1/2,top,w1,base-top,'#cfe5f3',C.ink,2)+R(x2-w2/2,top,w2,base-top,'#cfe5f3',C.ink,2)+R(x1,base-30,x2-x1,30,'#cfe5f3','none',0)+L(x1+w1/2,base-30,x2-w2/2,base-30,C.ink,2)+L(x1-w1/2,base,x2+w2/2,base,C.ink,2);
  const y1=top+20+d1*600,y2=top+20-d2*600;o+=R(x1-w1/2,y1-8,w1,10,C.ink,'none',2)+R(x2-w2/2,y2-8,w2,10,C.ink,'none',2);
  o+=P2_vec(x1,y1-60,0,48,C.coral,'',0,0)+TF(x1-w1/2-10,y1-40,s.F1+' N',14,C.coral,'end','font-weight="700"');
  o+=P2_vec(x2,y2-10,0,-48,C.green,'',0,0)+TF(x2,y2-76,P2_n(F2,0)+' N',14,C.green,'middle','font-weight="700"');
  o+=TF(300,330,'pressure everywhere = '+P2_n(p/1000,0)+' kPa · small piston down '+P2_n(d1*100,1)+' cm, large up '+P2_n(d2*100,2)+' cm',13,C.ink);
  o+=TF(300,354,'work in = '+s.F1+' × '+P2_n(d1,3)+' = '+P2_n(s.F1*d1,2)+' J · work out = '+P2_n(F2,0)+' × '+P2_n(d2,4)+' = '+P2_n(F2*d2,2)+' J',13,C.blue);
  return {svg:o,phase:`The same pressure, ${P2_n(p/1000,0)} kPa, acts on both pistons, so the force scales with area: ${s.F1} N becomes ${P2_n(F2,0)} N. The large piston moves ${P2_n(s.A2/s.A1,1)} times less, so the work in equals the work out (ignoring losses).`};
 }});
