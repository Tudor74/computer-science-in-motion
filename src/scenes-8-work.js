/* ===================== Dimensions In Motion · Era 8 · Dimensions at work ===================== */
// Configuration space, phase space, data in many dimensions, fractal dimension, persistent homology, extra dimensions.
// Every picture is a pure function of state, frame and X. Every count, coordinate and measure on screen is computed
// here from the model drawn; the only typed numbers are historical values, each with a research line.
// Random data come from seeded generators (D8_rng), so every picture is the same each time.

/* ---- shared helpers ---- */
const D8_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const D8_rng=n=>rng(D8_mix(n));
function D8_gauss(r){const u=Math.max(1e-12,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const D8_poly=(pts,col,w=2.2,extra='')=>pts.length>1?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const D8_r=(v,d=2)=>{const k=Math.pow(10,d);return Math.round(v*k)/k};
// Fixed decimals with a true minus sign.
const D8_f=(v,d=2)=>{const s=Math.abs(v).toFixed(d);return (v<0&&Number(s)!==0?'−':'')+s};
// Scientific notation with superscripts: 2.4 × 10⁻⁵.
const D8_sci=(v,d=1)=>{if(!v)return '0';const e=Math.floor(Math.log10(Math.abs(v))),m=v/Math.pow(10,e);return `${m.toFixed(d)} × 10${e<0?'⁻':''}${D8_sup(Math.abs(e))}`};
const D8_note=(s,y=368)=>TF(300,y,s,13,C.muted);
const D8_tile=(x,y,w,label,value,col=C.blue)=>R(x,y,w,46,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+38,value,16,col);
const D8_SUP='⁰¹²³⁴⁵⁶⁷⁸⁹';
const D8_SUB='₀₁₂₃₄₅₆₇₈₉';
const D8_sub=n=>String(n).split('').map(c=>D8_SUB[+c]).join('');
const D8_sup=n=>String(n).split('').map(c=>D8_SUP[+c]).join('');
// Group the digits of a whole number (string or BigInt) in threes with thin spaces.
const D8_group=v=>String(v).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
const D8_rad=d=>d*Math.PI/180;
const D8_mod=(a,m)=>((a%m)+m)%m;
// Distance from point (px,py) to the segment from (ax,ay) to (bx,by).
function D8_segDist(ax,ay,bx,by,px,py){const dx=bx-ax,dy=by-ay,l2=dx*dx+dy*dy;const t=l2?clamp(((px-ax)*dx+(py-ay)*dy)/l2,0,1):0;return Math.hypot(ax+t*dx-px,ay+t*dy-py)}
// Least-squares slope and intercept of y on x.
function D8_fit(pts){const n=pts.length;if(n<2)return null;const mx=sum(pts.map(p=>p[0]))/n,my=sum(pts.map(p=>p[1]))/n;let sxy=0,sxx=0;for(const [x,y] of pts){sxy+=(x-mx)*(y-my);sxx+=(x-mx)*(x-mx)}if(!sxx)return null;const b=sxy/sxx;return {slope:b,icept:my-b*mx}}
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function D8_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-7,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// A polyline in a square of side `side` whose coordinates wrap round (a torus): break it where it jumps across an edge.
function D8_wrapLine(pts,M,col,w=2.2,extra=''){let out='',run=[];
 for(let i=0;i<pts.length;i++){if(i&&(Math.abs(pts[i][0]-pts[i-1][0])>M/2||Math.abs(pts[i][1]-pts[i-1][1])>M/2)){out+=run.length>1?D8_poly(run,col,w,extra):'';run=[]}run.push(pts[i])}
 return out+(run.length>1?D8_poly(run,col,w,extra):'');}

/* ===================== Lesson: configuration-space ===================== */
// A planar arm: link 1 of length 1 from a fixed base, link 2 of length 0.8 from the elbow. θ₂ is measured from link 1.
const D8_ARM=[1,.8];
const D8_STEP=5,D8_N=360/D8_STEP;   // the configuration grid: 5° steps, 72 × 72 cells
function D8_armPts(a,b){const t1=D8_rad(a),t2=D8_rad(a+b),J=[D8_ARM[0]*Math.cos(t1),D8_ARM[0]*Math.sin(t1)],E=[J[0]+D8_ARM[1]*Math.cos(t2),J[1]+D8_ARM[1]*Math.sin(t2)];return {J,E}}
// Draw the arm in a workspace panel centred at (cx,cy), sc pixels per unit.
function D8_armSVG(a,b,cx,cy,sc,col=C.blue,showAngles=true){
 const {J,E}=D8_armPts(a,b),S=p=>[cx+p[0]*sc,cy-p[1]*sc],j=S(J),e=S(E);let out='';
 if(showAngles){
  const arc=(x,y,r,from,to,c)=>{const n=Math.max(2,Math.ceil(Math.abs(to-from)/6)),pts=[];for(let i=0;i<=n;i++){const t=D8_rad(lerp(from,to,i/n));pts.push([x+r*Math.cos(t),y-r*Math.sin(t)])}return D8_poly(pts,c,1.8)};
  out+=L(cx,cy,cx+sc*.5,cy,C.grid,1.5,'stroke-dasharray="4 4"')+arc(cx,cy,24,0,a,C.coral);
  const ex=[j[0]+(j[0]-cx)*.45,j[1]+(j[1]-cy)*.45];out+=L(j[0],j[1],ex[0],ex[1],C.grid,1.5,'stroke-dasharray="4 4"')+arc(j[0],j[1],20,a,a+b,C.purple);
 }
 out+=L(cx,cy,j[0],j[1],col,7)+L(j[0],j[1],e[0],e[1],col,6)+Ci(cx,cy,8,C.dark,'#fff')+Ci(j[0],j[1],6,'#fff',col)+Ci(e[0],e[1],5,col);
 return out;
}
// The configuration square: θ₁ across, θ₂ up, with the gluing arrows on its edges.
const D8_SQ={x:330,y:62,w:236};
const D8_sqX=a=>D8_SQ.x+a/360*D8_SQ.w,D8_sqY=b=>D8_SQ.y+D8_SQ.w-b/360*D8_SQ.w;
function D8_square(o={}){
 const {x,y,w}=D8_SQ;let out=R(x,y,w,w,o.fill||'#fbfcfd',C.line,0);
 // single arrows on bottom and top (glued), double on left and right (glued)
 out+=arrow(x+w*.38,y+w,x+w*.62,y+w,C.blue,2.4,9)+arrow(x+w*.38,y,x+w*.62,y,C.blue,2.4,9);
 for(const xx of [x,x+w]){out+=arrow(xx,y+w*.64,xx,y+w*.42,C.coral,2.4,9)+arrow(xx,y+w*.56,xx,y+w*.34,C.coral,2.4,9)}
 if(o.ticks!==false){for(const v of [0,180,360]){out+=TF(D8_sqX(v),y+w+17,v+'°',13,C.muted);out+=TF(x-6,D8_sqY(v)+4,v+'°',13,C.muted,'end')}
  out+=TF(x+w*.25,y+w+17,'θ₁ →',13,C.coral)+TF(x+w*.75,y+w+17,'joint 1',13,C.coral)+TF(x+w+6,y-6,'θ₂, joint 2',13,C.purple,'end')}
 return out;
}
function D8_cfgWatch(p){const n=48,trail=[];for(let i=0;i<=Math.round(n*p);i++){const q=i/n;trail.push([D8_mod(Math.round(30+400*q),360),D8_mod(Math.round(60+700*q),360)])}const last=trail[trail.length-1];return {a:last[0],b:last[1],trail}}
// Move one joint to a new angle, leaving a trail of 5° steps (the slider moves without wrapping; the buttons wrap).
function D8_cfgMove(s,a,b){const da=a-s.a,db=b-s.b,n=Math.max(1,Math.ceil(Math.max(Math.abs(da),Math.abs(db))/D8_STEP));
 for(let i=1;i<=n;i++)s.trail.push([D8_mod(Math.round(s.a+da*i/n),360),D8_mod(Math.round(s.b+db*i/n),360)]);
 while(s.trail.length>400)s.trail.shift();s.a=D8_mod(a,360);s.b=D8_mod(b,360);}
SCENE({id:'configuration-space',name:'Two angles make a torus',tag:'A robot arm’s space of positions',
 definition:'The configuration space of a machine is the set of all its positions, with one coordinate for each degree of freedom. A flat arm with two rotating joints is fixed by two angles, θ₁ at the shoulder and θ₂ at the elbow. Each angle wraps round: 360° is the same position as 0°. So the square of angle pairs has its left edge glued to its right edge and its bottom edge to its top edge, which makes a torus.',
 example:'Turn the shoulder all the way round with the elbow fixed and the point on the square runs off the right edge and comes back on the left, exactly as a ship does in a gluing diagram. Every position of the arm is one point of the torus, and every point of the torus is one position of the arm.',
 desc:'On the left a two-joint arm with its angles marked; on the right a square of angle pairs whose opposite edges carry matching gluing arrows, with the arm’s current point and the trail it has left.',
 research:['Lagrange (1788). Mécanique analytique: a system described by as many independent coordinates as it has freedoms.','Lozano-Pérez (1983). Spatial planning: a configuration space approach. IEEE Transactions on Computers C-32, 108–120.'],
 dur:12,hint:'Move the two joint sliders, or turn a joint by 90° with the buttons, and watch the point on the square. Turn a joint past 360° to see the point leave one edge and come back on the opposite one. In 3D the same trail is drawn on a torus.',
 init:()=>({a:40,b:70,trail:[[40,70]]}),
 watch:D8_cfgWatch,
 ui:[{range:'a',label:'θ₁ (shoulder)',min:0,max:355,step:5,get:s=>s.a,act:'a',show:v=>v+'°'},{range:'b',label:'θ₂ (elbow)',min:0,max:355,step:5,get:s=>s.b,act:'b',show:v=>v+'°'},
  {b:'Shoulder +90°',act:'ta'},{b:'Elbow +90°',act:'tb'},{b:'Clear trail',act:'clear'}],
 on:{a(s,v){D8_cfgMove(s,clamp(Math.round(+v/5)*5,0,355),s.b)},b(s,v){D8_cfgMove(s,s.a,clamp(Math.round(+v/5)*5,0,355))},
  ta(s){D8_cfgMove(s,s.a+90,s.b)},tb(s){D8_cfgMove(s,s.a,s.b+90)},clear(s){s.trail=[[s.a,s.b]]}},
 draw(s){
  const cx=150,cy=196,sc=66,{E}=D8_armPts(s.a,s.b),joints=D8_ARM.length;
  let out=heading(`θ₁ = ${s.a}°, θ₂ = ${s.b}°: one point of the torus`);
  out+=R(18,50,272,262,'#fff',C.grid,8)+TF(30,70,'the arm (seen from above)',13,C.muted,'start');
  out+=Ci(cx,cy,sc*(D8_ARM[0]+D8_ARM[1]),'none',C.grid,'stroke-dasharray="3 5"');
  out+=D8_armSVG(s.a,s.b,cx,cy,sc);
  out+=TF(30,300,`tip at (${D8_f(E[0])}, ${D8_f(E[1])})`,13,C.ink,'start');
  out+=D8_square()+D8_wrapLine(s.trail.map(([a,b])=>[D8_sqX(a),D8_sqY(b)]),D8_SQ.w,C.green,2,'opacity=".8"');
  out+=Ci(D8_sqX(s.a),D8_sqY(s.b),7,C.ink,'#fff');
  out+=D8_tile(18,322,130,'Joints',String(joints),C.ink)+D8_tile(158,322,130,'Coordinates',`${joints} angles`,C.blue)+D8_tile(330,322,236,'Space of positions','square glued into a torus',C.green);
  return {svg:out,phase:`The arm’s position is the pair (${s.a}°, ${s.b}°). The coral arrows say that the left and right edges are the same line (θ₁ = 0° is θ₁ = 360°); the blue arrows say the same of top and bottom. Glue both pairs and the square closes up into a torus, the configuration space of this arm.`};
 },
 three(s){
  const Rr=2,rr=.8,T3=(a,b)=>{const t1=D8_rad(a),t2=D8_rad(b);return [(Rr+rr*Math.cos(t2))*Math.cos(t1),(Rr+rr*Math.cos(t2))*Math.sin(t1),rr*Math.sin(t2)]};
  const Pr=makeProject([-2.9,2.9,-2.9,2.9,-1,1]);let out='';
  for(let a=0;a<360;a+=30){const pts=[];for(let b=0;b<=360;b+=10)pts.push(Pr(T3(a,b)));out+=D8_poly(pts,'#c8d6e0',1.2)}
  for(let b=0;b<360;b+=45){const pts=[];for(let a=0;a<=360;a+=10)pts.push(Pr(T3(a,b)));out+=D8_poly(pts,b===0?C.coral:'#c8d6e0',b===0?1.8:1.2)}
  {const pts=[];for(let b=0;b<=360;b+=10)pts.push(Pr(T3(0,b)));out+=D8_poly(pts,C.purple,1.8)}
  const tr=s.trail.map(([a,b])=>Pr(T3(a,b)));out+=D8_poly(tr,C.green,2.4);
  const q=Pr(T3(s.a,s.b));out+=Ci(q[0],q[1],7,C.ink,'#fff');
  const l1=Pr(T3(90,0)),l2=Pr(T3(0,90));out+=TF(l1[0],l1[1]-10,'θ₂ = 0° circle',13,C.coral)+TF(l2[0]+8,l2[1]-8,'θ₁ = 0° circle',13,C.purple,'start');
  return {svg:out,title:'The square glued into a torus',caption:`θ₁ runs round the hole of the doughnut and θ₂ round its tube. The point (${s.a}°, ${s.b}°) and the trail are mapped from the square by this scene’s own formula; dragging only turns the camera.`};
 }});

/* Obstacles. A disc in the workspace forbids every configuration in which either link meets it. */
const D8_OBS_CACHE={};
function D8_forbidden(obs){const key=obs.map(o=>o.join(',')).join(';');if(D8_OBS_CACHE[key])return D8_OBS_CACHE[key];
 const g=new Uint8Array(D8_N*D8_N);
 for(let i=0;i<D8_N;i++)for(let j=0;j<D8_N;j++){const {J,E}=D8_armPts(i*D8_STEP,j*D8_STEP);
  for(const [ox,oy,r] of obs){if(D8_segDist(0,0,J[0],J[1],ox,oy)<r||D8_segDist(J[0],J[1],E[0],E[1],ox,oy)<r){g[j*D8_N+i]=1;break}}}
 return D8_OBS_CACHE[key]=g;}
const D8_hits=(a,b,obs)=>{const {J,E}=D8_armPts(a,b);return obs.some(([ox,oy,r])=>D8_segDist(0,0,J[0],J[1],ox,oy)<r||D8_segDist(J[0],J[1],E[0],E[1],ox,oy)<r)};
// Forbidden cells drawn as runs along each row.
function D8_forbidSVG(g,col='#f4c3b4'){let out='';const cw=D8_SQ.w/D8_N;
 for(let j=0;j<D8_N;j++){let i=0;while(i<D8_N){if(!g[j*D8_N+i]){i++;continue}let k=i;while(k<D8_N&&g[j*D8_N+k])k++;out+=`<rect x="${fmt(D8_SQ.x+i*cw)}" y="${fmt(D8_SQ.y+D8_SQ.w-(j+1)*cw)}" width="${fmt((k-i)*cw)}" height="${fmt(cw+.8)}" fill="${col}"/>`;i=k}}
 return out;}
// Coarse press targets on the square: 12 × 12 cells of 30°.
function D8_sqHits(X,act){let out='';const c=D8_SQ.w/12;for(let i=0;i<12;i++)for(let j=0;j<12;j++)out+=hit(X,act,i+','+j,`Angles θ₁ ${i*30+15}°, θ₂ ${j*30+15}°`,`<rect x="${fmt(D8_SQ.x+i*c)}" y="${fmt(D8_SQ.y+D8_SQ.w-(j+1)*c)}" width="${fmt(c)}" height="${fmt(c)}" fill="transparent"/>`);return out}
const D8_OBS_POS=[[1.05,.75],[-.2,1.3],[-1.25,.3],[.4,-1.25]];
SCENE({id:'configuration-space-obstacles',name:'Obstacles become forbidden regions',tag:'Lozano-Pérez, 1983',
 definition:'Put an obstacle near the arm and some positions become impossible, because a link would pass through it. Marking every forbidden pair of angles turns the obstacle into a forbidden region of the torus, the configuration-space obstacle. Tomás Lozano-Pérez made this the basis of robot motion planning: the arm becomes a single point, and planning a motion means finding a route for that point through the free part of the space.',
 example:'A round obstacle in the workspace does not become round in configuration space. Here it becomes a thin strip, where link 1 meets the disc at a few shoulder angles whatever the elbow does, and a larger curved patch, where link 2 meets it at many combinations of the two angles. The patch can run off one edge and continue on the opposite one.',
 desc:'On the left the arm and a round obstacle; on the right the square of angle pairs with every forbidden pair shaded, computed on a 5° grid, and the arm’s current point.',
 research:['Lozano-Pérez (1983). Spatial planning: a configuration space approach. IEEE Transactions on Computers C-32, 108–120.','Lozano-Pérez & Wesley (1979). An algorithm for planning collision-free paths among polyhedral obstacles. Communications of the ACM 22, 560–570.'],
 dur:11,hint:'Press anywhere on the square to put the arm in that position: the arm turns coral if it hits the obstacle. Move the obstacle or change its size and watch the forbidden region change shape.',
 init:()=>({a:15,b:45,pos:0,r:.3}),
 watch(p){return {a:D8_mod(Math.round(360*p/5)*5,360),b:45,pos:0,r:.3}},
 ui:[{choose:[[0,'Right'],[1,'Top'],[2,'Left'],[3,'Below']],label:'Obstacle position',get:s=>s.pos,act:'pos'},{choose:[[.2,'Small'],[.3,'Medium'],[.45,'Large']],label:'Obstacle size',get:s=>s.r,act:'r'},
  {range:'a',label:'θ₁',min:0,max:355,step:5,get:s=>s.a,act:'a',show:v=>v+'°'}],
 on:{pos(s,v){s.pos=clamp(Math.round(+v),0,3)},r(s,v){s.r=[.2,.3,.45].includes(+v)?+v:.3},a(s,v){s.a=clamp(Math.round(+v/5)*5,0,355)},
  cell(s,v){const [i,j]=String(v).split(',').map(Number);if(i>=0&&i<12&&j>=0&&j<12){s.a=i*30+15;s.b=j*30+15}}},
 draw(s,f,X){
  const o=D8_OBS_POS[s.pos],obs=[[o[0],o[1],s.r]],g=D8_forbidden(obs),bad=sum(Array.from(g)),hitNow=D8_hits(s.a,s.b,obs),cx=150,cy=196,sc=66;
  let out=heading(hitNow?'Forbidden: a link passes through the obstacle':'This position is free');
  out+=R(18,50,272,262,'#fff',C.grid,8)+TF(30,70,'the arm and the obstacle',13,C.muted,'start');
  out+=Ci(cx,cy,sc*(D8_ARM[0]+D8_ARM[1]),'none',C.grid,'stroke-dasharray="3 5"');
  out+=Ci(cx+o[0]*sc,cy-o[1]*sc,s.r*sc,C.coralp,C.coral)+D8_armSVG(s.a,s.b,cx,cy,sc,hitNow?C.coral:C.green,false);
  out+=D8_square()+D8_forbidSVG(g)+D8_square({fill:'none',ticks:false});
  out+=Ci(D8_sqX(s.a),D8_sqY(s.b),7,hitNow?C.coral:C.green,'#fff')+D8_sqHits(X,'cell');
  out+=D8_tile(18,322,130,'Grid cells',`${D8_N} × ${D8_N} = ${D8_N*D8_N}`,C.ink)+D8_tile(158,322,130,'Forbidden',`${bad} (${fmt(D8_r(100*bad/(D8_N*D8_N),1))}%)`,C.coral)+D8_tile(330,322,236,'This position',hitNow?'collides':'free',hitNow?C.coral:C.green);
  return {svg:out,phase:`Each of the ${D8_N*D8_N} cells is a pair of angles in steps of ${D8_STEP}°. The scene places the arm at every pair and shades it if either link comes within the obstacle’s radius: ${bad} cells, ${fmt(D8_r(100*bad/(D8_N*D8_N),1))}% of the torus. The arm at (${s.a}°, ${s.b}°) is ${hitNow?'inside the shaded region':'in the free region'}.`};
 }});

/* Planning: breadth-first search on the 72 × 72 grid, with or without the gluing. */
const D8_PLAN_OBS=[[1.05,.55,.32],[-.7,-1.05,.36],[-.95,.85,.25]];
function D8_bfs(g,start,goal,wrap){const N=D8_N,idx=(i,j)=>j*N+i,prev=new Int32Array(N*N).fill(-1),s0=idx(...start),t0=idx(...goal);if(g[s0]||g[t0])return null;
 const q=[s0];prev[s0]=s0;for(let h=0;h<q.length;h++){const c=q[h];if(c===t0)break;const i=c%N,j=(c-i)/N;
  for(const [di,dj] of [[1,0],[-1,0],[0,1],[0,-1]]){let ni=i+di,nj=j+dj;if(wrap){ni=D8_mod(ni,N);nj=D8_mod(nj,N)}else if(ni<0||nj<0||ni>=N||nj>=N)continue;const n=idx(ni,nj);if(g[n]||prev[n]>=0)continue;prev[n]=c;q.push(n)}}
 if(prev[t0]<0)return null;const path=[];for(let c=t0;;c=prev[c]){path.push([c%N,Math.floor(c/N)]);if(c===s0)break}return path.reverse();}
function D8_planPaths(s){const g=D8_forbidden(D8_PLAN_OBS),st=[s.st[0]/D8_STEP,s.st[1]/D8_STEP],go=[s.go[0]/D8_STEP,s.go[1]/D8_STEP];return {g,torus:D8_bfs(g,st,go,true),plain:D8_bfs(g,st,go,false)}}
SCENE({id:'configuration-space-path',name:'Planning a path on the torus',tag:'Search in the free space',
 definition:'Once the obstacles are drawn in configuration space, moving the arm safely from one position to another is a search for a route between two points of the free region. This scene searches the 5° grid breadth first, which finds a shortest route in grid steps. On the torus a route may leave one edge of the square and come back on the opposite edge, which on the real arm just means turning a joint past 360°.',
 example:'With the gluing ignored, the square is only a square and some routes have to go the long way round, or do not exist at all. With the gluing, the planner can turn a joint the other way round, and the route is often much shorter.',
 desc:'The arm among three obstacles on the left, and on the right the square of angle pairs with forbidden regions shaded, a start point, a goal point and the shortest route found between them, which may cross the glued edges.',
 research:['Lozano-Pérez (1983). Spatial planning: a configuration space approach. IEEE Transactions on Computers C-32, 108–120.','Latombe (1991). Robot Motion Planning. Kluwer: grid and roadmap methods in configuration space.'],
 dur:14,hint:'Press a free spot on the square to choose the goal, switch between the torus and a plain square without gluing, and step or run the arm along the route.',
 init:()=>({st:[90,0],go:[135,285],wrap:1}),
 trace(s){const {torus,plain}=D8_planPaths(s),path=s.wrap?torus:plain;if(D8_hits(s.go[0],s.go[1],D8_PLAN_OBS))return [{i:0,say:'That goal is inside a forbidden region: the arm would pass through an obstacle there. Choose an unshaded spot.'}];if(D8_hits(s.st[0],s.st[1],D8_PLAN_OBS))return [{i:0,say:'The start is inside a forbidden region. Swap start and goal back, or press Reset.'}];if(!path)return [{i:0,say:'There is no route on this plain square: the forbidden regions cut the start off from the goal. Switch the gluing on, or choose another goal.'}];
  const n=Math.min(24,path.length-1),fr=[];for(let k=0;k<=n;k++){const i=Math.round(k*(path.length-1)/n);fr.push({i,say:k===0?`The arm starts at (${s.st[0]}°, ${s.st[1]}°). The planner has found a route of ${path.length-1} grid steps of ${D8_STEP}°.`:k===n?`Arrived at (${s.go[0]}°, ${s.go[1]}°) without touching an obstacle: ${path.length-1} steps.`:`Step ${i} of ${path.length-1}: the arm is at (${path[i][0]*D8_STEP}°, ${path[i][1]*D8_STEP}°), still in the free region.`})}return fr},
 ui:[{choose:[[1,'Torus (edges glued)'],[0,'Plain square']],label:'Gluing',get:s=>s.wrap,act:'wrap'},{b:'Swap start and goal',act:'swap'}],
 on:{wrap(s,v){s.wrap=+v?1:0},swap(s){const t=s.st;s.st=s.go;s.go=t},
  cell(s,v){const [i,j]=String(v).split(',').map(Number);if(i>=0&&i<12&&j>=0&&j<12)s.go=[i*30+15,j*30+15]}},
 draw(s,f,X){
  const {g,torus,plain}=D8_planPaths(s),path=s.wrap?torus:plain,cx=150,cy=196,sc=66;
  const i=f&&path?f.i:0,here=path?path[i].map(v=>v*D8_STEP):s.st;
  const goalBad=D8_hits(s.go[0],s.go[1],D8_PLAN_OBS);let out=heading(goalBad?'The goal is forbidden':path?`Shortest route: ${path.length-1} steps${s.wrap?' on the torus':' on the plain square'}`:s.wrap?'No route':'No route on the plain square');
  out+=R(18,50,272,262,'#fff',C.grid,8)+TF(30,70,'the arm moving along the route',13,C.muted,'start');
  for(const [ox,oy,r] of D8_PLAN_OBS)out+=Ci(cx+ox*sc,cy-oy*sc,r*sc,C.coralp,C.coral);
  const ghost=D8_armPts(s.go[0],s.go[1]);out+=L(cx,cy,cx+ghost.J[0]*sc,cy-ghost.J[1]*sc,C.grid,5)+L(cx+ghost.J[0]*sc,cy-ghost.J[1]*sc,cx+ghost.E[0]*sc,cy-ghost.E[1]*sc,C.grid,4);
  out+=D8_armSVG(here[0],here[1],cx,cy,sc,D8_hits(here[0],here[1],D8_PLAN_OBS)?C.coral:C.green,false);
  out+=D8_square()+D8_forbidSVG(g)+D8_square({fill:'none',ticks:false});
  if(path){const pts=path.map(([a,b])=>[D8_sqX((a+.5)*D8_STEP),D8_sqY((b+.5)*D8_STEP)]);out+=D8_wrapLine(pts,D8_SQ.w,C.green,2.6)}
  out+=Ci(D8_sqX(s.st[0]),D8_sqY(s.st[1]),7,C.blue,'#fff')+Ci(D8_sqX(s.go[0]),D8_sqY(s.go[1]),7,C.purple,'#fff');
  if(path)out+=Ci(D8_sqX(here[0]+2.5),D8_sqY(here[1]+2.5),5,C.ink);
  out+=D8_sqHits(X,'cell');
  const len=p=>p?`${p.length-1} steps`:'no route';
  out+=D8_tile(18,322,130,'Start → goal',`blue → purple`,C.ink)+D8_tile(158,322,130,'On the torus',len(torus),s.wrap?C.green:C.muted)+D8_tile(330,322,236,'On a plain square (no gluing)',len(plain),s.wrap?C.muted:C.green);
  return {svg:out,phase:f?f.say:''};
 }});

/* More joints: an n-link arm has an n-torus of positions; a free base adds a position in the plane and a heading. */
const D8_MANY_SEED=17;
function D8_manyAngles(seed){const r=D8_rng(seed);return range(8).map(()=>Math.round(r()*72)*5%360)}
SCENE({id:'configuration-space-many',name:'More joints, more dimensions',tag:'Why planners sample at random',
 definition:'Each extra joint adds an angle, so an arm with n rotating joints has an n-dimensional configuration space: the n-torus, a product of n circles. A robot whose base also drives about a floor adds two lengths and one more angle, its heading. These spaces are easy to describe and impossible to draw, which is why a robot’s planner works with lists of numbers rather than pictures.',
 example:`A grid at ${D8_STEP}° steps needs ${D8_N} points for one joint, ${D8_N*D8_N} for two, and ${D8_N}ⁿ for n joints: for a seven-joint arm that is ${D8_group(BigInt(D8_N)**7n)} points. So since the 1990s planners have instead sampled random configurations and joined nearby free ones into a roadmap or a tree (Kavraki and colleagues, 1996; LaValle, 1998).`,
 desc:'An arm with a chosen number of links on the left; on the right one vertical axis per freedom, with the current value of each marked, as parallel coordinates. Tiles give the number of freedoms, the name of the space and the size of a 5° grid.',
 research:['Kavraki, Švestka, Latombe & Overmars (1996). Probabilistic roadmaps for path planning in high-dimensional configuration spaces. IEEE Transactions on Robotics and Automation 12, 566–580.','LaValle (1998). Rapidly-exploring random trees: a new tool for path planning. Technical report 98-11, Iowa State University.'],
 dur:12,hint:`Change the number of joints, let the base drive about the floor, and press any axis to set that freedom. The grid count grows by a factor of ${D8_N} for every joint.`,
 init:()=>({n:3,free:0,ang:D8_manyAngles(D8_MANY_SEED),seed:D8_MANY_SEED}),
 watch(p){const n=1+Math.min(7,Math.floor(p*8));return {n,free:0,ang:D8_manyAngles(D8_MANY_SEED+n),seed:D8_MANY_SEED}},
 ui:[{range:'n',label:'Joints',min:1,max:8,get:s=>s.n,act:'n'},{choose:[[0,'Base fixed'],[1,'Base drives on the floor']],label:'Base',get:s=>s.free,act:'free'},{b:'New pose',act:'pose'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),1,8)},free(s,v){s.free=+v?1:0},pose(s){s.seed++;s.ang=D8_manyAngles(s.seed)},
  set(s,v){const [k,m]=String(v).split(',').map(Number);if(k>=0&&k<8&&m>=0&&m<8)s.ang[k]=m*45}},
 draw(s,f,X){
  const n=s.n,free=!!s.free,frees=[];for(let k=0;k<n;k++)frees.push({name:'θ'+D8_sub(k+1),kind:'angle',v:s.ang[k]});
  if(free){frees.push({name:'x',kind:'length',v:.62},{name:'y',kind:'length',v:.38},{name:'heading',kind:'angle',v:s.ang[7]})}
  const angles=frees.filter(q=>q.kind==='angle').length,lengths=frees.length-angles,grid=BigInt(D8_N)**BigInt(n);
  let out=heading(`${frees.length} freedom${frees.length===1?'':'s'}: a ${frees.length}-dimensional space`);
  // the arm
  out+=R(18,50,252,262,'#fff',C.grid,8);const base=free?[60+.62*150,240-.38*120]:[144,186],sc=(free?96:112)/n;let p=base.slice(),th=free?s.ang[7]:0;
  if(free){out+=R(base[0]-14,base[1]-10,28,20,C.pale,C.blue,4)+TF(30,300,'the base can drive and turn',13,C.muted,'start')+TF(580,66,'x, y: 0 to 1 across the floor',13,C.amber,'end')}else out+=TF(30,300,'the base is fixed',13,C.muted,'start');
  for(let k=0;k<n;k++){th+=s.ang[k];const q=[p[0]+sc*Math.cos(D8_rad(th)),p[1]-sc*Math.sin(D8_rad(th))];out+=L(p[0],p[1],q[0],q[1],C.blue,Math.max(3,7-k*.5))+Ci(p[0],p[1],4.5,'#fff',C.blue);p=q}
  out+=Ci(p[0],p[1],4.5,C.blue)+Ci(base[0],base[1],6,C.dark,'#fff');
  // parallel coordinates: one axis per freedom
  const m=frees.length,x0=292,w=286,dx=w/m,y0=78,h=196;
  if(!free)out+=TF(x0,66,'one axis for each freedom',13,C.muted,'start');
  const pts=frees.map((q,k)=>{const x=x0+dx*(k+.5),u=q.kind==='angle'?q.v/360:q.v;return [x,y0+h-u*h]});
  frees.forEach((q,k)=>{const x=x0+dx*(k+.5);out+=L(x,y0,x,y0+h,q.kind==='angle'?C.line:C.amber,2);out+=TF(x,y0+h+17,q.name,13,q.kind==='angle'?C.ink:C.amber);
   if(q.kind==='angle'&&k<8)for(let mm=0;mm<8;mm++)out+=hit(X,'set',k+','+mm,`Set ${q.name} to ${mm*45}°`,`<rect x="${fmt(x-Math.min(14,dx/2))}" y="${fmt(y0+h-(mm+1)*h/8)}" width="${fmt(Math.min(28,dx))}" height="${fmt(h/8)}" fill="transparent"/>`)});
  out+=D8_poly(pts,C.purple,2);for(const q of pts)out+=Ci(q[0],q[1],4.5,C.purple);
  out+=TF(x0-4,y0+5,'360°',13,C.muted,'end')+TF(x0-4,y0+h+4,'0°',13,C.muted,'end');
  const space=`T${D8_sup(angles)}`+(lengths?` × ℝ${D8_sup(lengths)}`:''),gs=D8_group(grid);
  out+=D8_tile(18,322,150,'Freedoms',`${angles} angle${angles===1?'':'s'}${lengths?` + ${lengths} lengths`:''}`,C.ink)+D8_tile(176,322,140,'The space',space,C.green)+D8_tile(324,322,258,`Joint grid at ${D8_STEP}°: ${D8_N}${D8_sup(n)}`,gs.length>22?gs.slice(0,20)+'…':gs,C.coral);
  return {svg:out,phase:`${n} joint angle${n===1?'':'s'}${free?', a position x and y on the floor and a heading':''}: ${frees.length} numbers fix the robot, so its configuration space is ${frees.length}-dimensional (${space}, where T${D8_sup(angles)} is a product of ${angles} circle${angles===1?'':'s'}). The purple line through the axes is this one pose. A ${D8_STEP}° grid of the joint angles alone has ${D8_N}${D8_sup(n)} = ${gs} points.`};
 }});

/* ===================== Lesson: phase-space ===================== */
// A pendulum in units where g/L = 1: θ'' = −sin θ. Energy per unit m·L²: E = ω²/2 − cos θ (−1 at rest at the bottom,
// +1 balanced upside down). Leapfrog (velocity Verlet) step dt.
const D8_PEN_DT=.05,D8_PEN_T=40;
function D8_leap(th,w,dt){w-=Math.sin(th)*dt/2;th+=w*dt;w-=Math.sin(th)*dt/2;return [th,w]}
function D8_euler(th,w,dt){return [th+w*dt,w-Math.sin(th)*dt]}
const D8_penE=(th,w)=>w*w/2-Math.cos(th);
const D8_PEN_CACHE={};
// Simulate from (θ₀, ω₀): returns the samples, the energy range and the period measured from upward zero crossings of ω (swings) or of θ mod 2π (rotations).
function D8_penRun(th0,w0,method='leap',dt=D8_PEN_DT,T=D8_PEN_T){const key=[th0,w0,method,dt,T].join(',');if(D8_PEN_CACHE[key])return D8_PEN_CACHE[key];
 const step=method==='leap'?D8_leap:D8_euler,n=Math.round(T/dt),pts=[[th0,w0]],E0=D8_penE(th0,w0);let th=th0,w=w0,emin=E0,emax=E0;const cross=[];
 for(let i=1;i<=n;i++){const pw=w,pth=th;[th,w]=step(th,w,dt);pts.push([th,w]);const E=D8_penE(th,w);emin=Math.min(emin,E);emax=Math.max(emax,E);
  if(E0<1){if(pw<0&&w>=0)cross.push((i-1+(-pw)/(w-pw))*dt)}else{const k0=Math.floor((pth+Math.PI)/(2*Math.PI)),k1=Math.floor((th+Math.PI)/(2*Math.PI));if(k1!==k0)cross.push(i*dt)}}
 const period=cross.length>1?(cross[cross.length-1]-cross[0])/(cross.length-1):null;
 return D8_PEN_CACHE[key]={pts,E0,emin,emax,period,dt};}
const D8_wrapA=a=>D8_mod(a+Math.PI,2*Math.PI)-Math.PI;
// Phase plane panel: θ from −180° to 180° across, ω from −W to W up.
function D8_phasePanel(x0,y0,w,h,W){const pl=D8_plot(x0,y0,w,h,[-Math.PI,Math.PI],[-W,W],{xt:[[-Math.PI,'−180°'],[0,'0°'],[Math.PI,'180°']],yt:[[-W/2,D8_f(-W/2,1)],[0,'0'],[W/2,D8_f(W/2,1)]]});
 let svg=pl.svg+L(x0,pl.Y(0),x0+w,pl.Y(0),C.grid,1)+L(pl.X(0),y0,pl.X(0),y0+h,C.grid,1);
 // the separatrix E = 1: ω = ±√(2(1 + cos θ))
 for(const sg of [1,-1]){const pts=[];for(let i=0;i<=80;i++){const th=-Math.PI+i/80*2*Math.PI;pts.push([pl.X(th),pl.Y(sg*Math.sqrt(2*(1+Math.cos(th))))])}svg+=D8_poly(pts,C.amber,1.6,'stroke-dasharray="5 4"')}
 return {svg,X:pl.X,Y:pl.Y};}
// Break the path where θ wraps from 180° to −180°.
function D8_penLine(pts,pl,col,w=2.2){let out='',run=[];for(let i=0;i<pts.length;i++){const a=D8_wrapA(pts[i][0]);if(i&&Math.abs(a-D8_wrapA(pts[i-1][0]))>Math.PI){out+=D8_poly(run,col,w);run=[]}run.push([pl.X(a),pl.Y(pts[i][1])])}return out+D8_poly(run,col,w)}
function D8_penDraw(cx,cy,len,th,col=C.blue){const bx=cx+len*Math.sin(th),by=cy+len*Math.cos(th);return L(cx-30,cy,cx+30,cy,C.ink,3)+L(cx,cy,bx,by,C.ink,2.5)+Ci(bx,by,11,col,'#fff')+Ci(cx,cy,4,C.ink)}
const D8_PEN_WATCH=[[30,0],[90,0],[150,0],[0,2.2]];
SCENE({id:'phase-space',name:'A pendulum’s state is a point in a plane',tag:'Positions and momenta together',
 definition:'Where a pendulum is does not fix what it does next: it also matters how fast it is moving. Its state is the pair (angle θ, angular velocity ω), a point in a plane called its phase space; for a particle, velocity is replaced by momentum. Newton’s law then moves the point along a single curve, so the whole future of the pendulum is one path. Because θ wraps round at 360°, this plane is really a cylinder.',
 example:'Released from 30°, the pendulum swings and its point goes round a closed oval: the motion repeats. Released from near the top it still swings, round a fatter, pointed loop, and slowly. Given a hard push it goes over the top and keeps turning, a wavy line round the cylinder. The dashed curve between the two kinds of motion is the separatrix, where the energy is exactly enough to reach the top.',
 desc:'A pendulum on the left and its phase plane on the right, angle across and angular velocity up, with the dashed separatrix, the orbit traced by the simulation and tiles for the energy and the measured period.',
 research:['Hamilton (1834–35). On a general method in dynamics. Philosophical Transactions of the Royal Society: motion described by positions and momenta together.','Gibbs (1902). Elementary Principles in Statistical Mechanics. Scribner: the name “phase” for a state given by all positions and momenta.','Simulated with the leapfrog (velocity Verlet) method, step 0.05 in units where g/L = 1.'],
 dur:14,hint:'Set the starting angle and a starting push, then keep the orbit on the picture. Compare small swings, swings from near the top, and pushes hard enough to go over the top. The energy tile shows how well the simulation keeps the energy constant.',
 init:()=>({a:60,w:0,kept:[[30,0],[150,0],[0,2.2]]}),
 watch(p){const k=Math.min(3,Math.floor(p*4)),u=p*4-k;return {a:D8_PEN_WATCH[k][0],w:D8_PEN_WATCH[k][1],kept:D8_PEN_WATCH.slice(0,k),u}},
 ui:[{range:'a',label:'Start angle',min:0,max:175,step:5,get:s=>s.a,act:'a',show:v=>v+'°'},{range:'w',label:'Start push ω',min:0,max:25,step:1,get:s=>Math.round(s.w*10),act:'w',show:v=>D8_f(v/10,1)},{b:'Keep this orbit',act:'keep'},{b:'Clear kept orbits',act:'clear'}],
 on:{a(s,v){s.a=clamp(Math.round(+v/5)*5,0,175)},w(s,v){s.w=clamp(Math.round(+v),0,25)/10},keep(s){if(!s.kept.some(k=>k[0]===s.a&&k[1]===s.w))s.kept.push([s.a,s.w]);while(s.kept.length>8)s.kept.shift()},clear(s){s.kept=[]}},
 draw(s,f,X){
  const run=D8_penRun(D8_rad(s.a),s.w),u=X&&!X.try?(s.u===undefined?X.p:s.u):1,shownT=u*20,ni=Math.min(run.pts.length-1,Math.round(shownT/run.dt)),cur=run.pts[ni];
  const E0=run.E0,swing=E0<1,drift=Math.max(run.emax-E0,E0-run.emin);
  let out=heading(swing?(s.a===0&&!s.w?'At rest at the bottom: a single point':'Swinging: a closed loop in phase space'):'Over the top: the angle keeps growing');
  out+=R(18,50,200,214,'#fff',C.grid,8)+D8_penDraw(118,146,78,cur[0]);
  out+=TF(118,256,`θ = ${Math.round(D8_wrapA(cur[0])*180/Math.PI)}°, ω = ${D8_f(cur[1])}`,13,C.ink);
  const pl=D8_phasePanel(272,52,300,212,2.6);out+=pl.svg+TF(268,46,'ω (angular velocity)',13,C.muted,'start')+TF(422,300,'θ (angle)',13,C.muted);
  for(const [a,w] of s.kept){const r=D8_penRun(D8_rad(a),w);out+=D8_penLine(r.pts.slice(0,Math.round(20/r.dt)),pl,'#a9c4d6',1.6)}
  out+=D8_penLine(run.pts.slice(0,ni+1),pl,C.blue,2.6)+Ci(pl.X(D8_wrapA(cur[0])),pl.Y(cur[1]),6,C.coral,'#fff');
  out+=TF(566,pl.Y(2.15),'separatrix',13,C.amber,'end');
  out+=D8_tile(18,318,180,'Energy E = ω²/2 − cos θ',D8_f(E0,3),C.ink)+D8_tile(206,318,180,'Largest change in E',drift<5e-4?'< 0.0005':D8_f(drift,4),C.green)+D8_tile(394,318,188,'Period (2π for tiny swings)',run.period?D8_f(run.period,2):'none',C.blue);
  const sp=2*Math.PI;
  return {svg:out,phase:swing?(E0<=-1+1e-9?'With no angle and no push the pendulum hangs still: its state is the single point (0, 0).':`Energy ${D8_f(E0,3)}, below the 1 needed to reach the top, so the point circles a closed loop and the motion repeats every ${run.period?D8_f(run.period,2):'?'} time units${run.period?`, ${D8_f(run.period/sp,2)} times the small-swing period 2π`:''}. Over the run the computed energy changed by at most ${D8_f(drift,4)}: leapfrog keeps it nearly constant.`):`Energy ${D8_f(E0,3)} is more than 1, enough to pass the top, so θ keeps increasing. On the picture the path leaves the right edge at 180° and comes back on the left at −180°: the same angle, because the phase space is a cylinder.`};
 }});

/* Liouville: a patch of starting states keeps its area under the true motion and under leapfrog, but not under a simple Euler step. */
const D8_BLOB={th:1.2,w:0,r:.35,n:720,T:12};
function D8_blobRun(method,dt,T){const key='blob'+[method,dt,T].join(',');if(D8_PEN_CACHE[key])return D8_PEN_CACHE[key];
 const step=method==='leap'?D8_leap:D8_euler,n=Math.round(T/dt),every=Math.max(1,Math.round(.5/dt)),frames=[];
 let pts=range(D8_BLOB.n).map(i=>{const t=2*Math.PI*i/D8_BLOB.n;return [D8_BLOB.th+D8_BLOB.r*Math.cos(t),D8_BLOB.w+D8_BLOB.r*Math.sin(t)]});
 for(let k=0;k<=n;k++){if(k%every===0)frames.push({t:k*dt,pts:pts.slice(),area:D8_area(pts)});if(k<n)pts=pts.map(([a,b])=>step(a,b,dt))}
 return D8_PEN_CACHE[key]=frames;}
function D8_area(pts){let a=0;for(let i=0;i<pts.length;i++){const p=pts[i],q=pts[(i+1)%pts.length];a+=p[0]*q[1]-q[0]*p[1]}return Math.abs(a)/2}
SCENE({id:'phase-space-liouville',name:'A patch of states keeps its area',tag:'Liouville, 1838',
 definition:'Start many copies of the pendulum at slightly different states, filling a small disc in phase space, and let each one move. The disc is stretched and sheared, because the slower swings near the bottom lag behind, but its area never changes. This is Liouville’s theorem: the motion of a system obeying Newton’s laws without friction preserves volume in phase space, in any number of dimensions. Gibbs built statistical mechanics on it.',
 example:'A computer that steps the motion forward must keep this property to be trusted over long runs. The leapfrog step preserves area exactly, so its patch keeps its size. The simplest Euler step, which updates angle and speed using only the old values, does not: while the pendulum is below the horizontal each step enlarges the patch a little, and its energy creeps upwards.',
 desc:'A phase plane with a small disc of starting states and where they have moved after a time, for the leapfrog method or a simple Euler step, with tiles for the patch’s area relative to its start and the average energy.',
 research:['Liouville (1838). Note sur la théorie de la variation des constantes arbitraires. Journal de mathématiques pures et appliquées 3, 342–349.','Gibbs (1902). Elementary Principles in Statistical Mechanics: “conservation of extension-in-phase”.','Hairer, Lubich & Wanner (2003). Geometric numerical integration illustrated by the Störmer–Verlet method. Acta Numerica 12, 399–450.'],
 dur:12,hint:'Choose the method and the step size, then move the time slider. Watch the area tile: leapfrog stays at 1, while the simple Euler step drifts away from 1, faster for a bigger step.',
 init:()=>({m:'leap',dt:.1,t:D8_BLOB.T}),
 watch(p){return {m:p<.5?'leap':'euler',dt:.1,t:Math.round(clamp((p<.5?p:p-.5)*2,0,1)*D8_BLOB.T*2)/2}},
 ui:[{choose:[['leap','Leapfrog'],['euler','Simple Euler step']],label:'Method',get:s=>s.m,act:'m'},{choose:[[.025,'Step 0.025'],[.05,'Step 0.05'],[.1,'Step 0.1']],label:'Step',get:s=>s.dt,act:'dt'},
  {range:'t',label:'Time',min:0,max:12,step:.5,get:s=>s.t,act:'t'}],
 on:{m(s,v){s.m=v==='euler'?'euler':'leap'},dt(s,v){s.dt=[.025,.05,.1].includes(+v)?+v:.1},t(s,v){s.t=clamp(Math.round(+v*2)/2,0,D8_BLOB.T)}},
 draw(s){
  const fr=D8_blobRun(s.m,s.dt,D8_BLOB.T),k=Math.min(fr.length-1,Math.round(s.t/.5)),F=fr[k],ratio=F.area/fr[0].area;
  const Em=sum(F.pts.map(([a,b])=>D8_penE(a,b)))/F.pts.length,E0=sum(fr[0].pts.map(([a,b])=>D8_penE(a,b)))/fr[0].pts.length;
  let out=heading(`${s.m==='leap'?'Leapfrog':'Simple Euler step'}: area ${D8_f(ratio,3)} × the start at t = ${fmt(F.t)}`);
  const pl=D8_phasePanel(70,52,500,218,2.6);out+=pl.svg+TF(66,46,'ω',13,C.muted,'start')+TF(320,308,'θ (angle)',13,C.muted);
  const poly=pts=>`<polygon points="${pts.map(([a,b])=>fmt(pl.X(D8_wrapA(a)))+','+fmt(pl.Y(clamp(b,-2.6,2.6)))).join(' ')}" fill="${C.pale}" stroke="${C.blue}" stroke-width="1.5"/>`;
  out+=poly(fr[0].pts).replace(C.pale,'none').replace(`stroke="${C.blue}"`,`stroke="${C.muted}" stroke-dasharray="3 3"`);
  const wrapped=F.pts.some((p,i)=>i&&Math.abs(D8_wrapA(p[0])-D8_wrapA(F.pts[i-1][0]))>Math.PI);
  out+=wrapped?F.pts.map(([a,b])=>Ci(pl.X(D8_wrapA(a)),pl.Y(clamp(b,-2.6,2.6)),1.4,C.blue)).join(''):poly(F.pts);
  out+=TF(pl.X(D8_BLOB.th),pl.Y(-D8_BLOB.r)+17,'start',13,C.muted);
  out+=D8_tile(18,330,180,'Area now ÷ area at start',D8_f(ratio,3),Math.abs(ratio-1)<.01?C.green:C.coral)+D8_tile(206,330,180,'Average energy',`${D8_f(E0,3)} → ${D8_f(Em,3)}`,C.ink)+D8_tile(394,330,188,'Steps taken',String(Math.round(F.t/s.dt)),C.ink);
  return {svg:out,phase:s.m==='leap'?`After ${Math.round(F.t/s.dt)} leapfrog steps the patch is stretched and sheared, but its area, measured from ${D8_BLOB.n} points on its edge, is ${D8_f(ratio,3)} times the start: unchanged, as Liouville’s theorem says of the true motion.`:`After ${Math.round(F.t/s.dt)} simple Euler steps the patch is ${D8_f(ratio,3)} times its starting area and the average energy has gone from ${D8_f(E0,3)} to ${D8_f(Em,3)}. Each step multiplies small areas by 1 + dt²·cos θ, which is more than 1 while the pendulum is below the horizontal, so the patch swells. The real pendulum keeps both fixed; the error comes from the method, and a smaller step slows it without stopping it.`};
 }});

/* Many particles: N particles in a box need 2·d·N numbers (d = 2 in a plane, 3 in space). Free flight with elastic bounces. */
function D8_gas(N,seed){const r=D8_rng(seed);return range(N).map(()=>({x:r(),y:r(),z:r(),vx:(r()-.5)*.5,vy:(r()-.5)*.5,vz:(r()-.5)*.5}))}
const D8_bounce=(x0,v,t)=>{const u=D8_mod(x0+v*t,2);return u<=1?[u,v*(1)]:[2-u,-v]};
const D8_AVOGADRO=6.02214076e23;   // exact by definition since the 2019 SI
SCENE({id:'phase-space-gas',name:'Six dimensions for every particle',tag:'Boltzmann and Gibbs',
 definition:'For a gas the same idea needs enormous spaces. Each particle in space has three coordinates of position and three of momentum, so N particles need 6N numbers, and the state of the whole gas is one point in a 6N-dimensional phase space. Boltzmann (1872) described a gas by how its molecules are spread over positions and momenta; Gibbs (1902) imagined a whole cloud of copies of the system, one point each in that huge space, and did statistics on the cloud.',
 example:`A mole of gas has about ${D8_f(D8_AVOGADRO/1e23,2)} × 10²³ molecules, so its phase space has about ${D8_f(6*D8_AVOGADRO/1e24,2)} × 10²⁴ dimensions. No one draws it; one picture we can draw is a slice, such as one particle’s position along one wall against its momentum in that direction, which traces a rectangle as it bounces.`,
 desc:'A box of moving particles, the long list of numbers that is the gas’s single point in phase space, and one particle’s slice: its x position against its x momentum, a rectangle traced as it bounces between the walls.',
 research:['Boltzmann (1872). Weitere Studien über das Wärmegleichgewicht unter Gasmolekülen. Sitzungsberichte der Akademie der Wissenschaften, Wien 66, 275–370.','Gibbs (1902). Elementary Principles in Statistical Mechanics. Scribner.','Avogadro constant 6.02214076 × 10²³ per mole, exact since the 2019 redefinition of the SI.'],
 dur:12,hint:'Change the number of particles and switch between a gas in a plane and a gas in space. Watch the count of dimensions and the length of the list of numbers.',
 init:()=>({n:4,d:3,t:6}),
 watch(p){return {n:1+Math.min(7,Math.floor(p*8)),d:3,t:p*30}},
 ui:[{range:'n',label:'Particles',min:1,max:12,get:s=>s.n,act:'n'},{choose:[[2,'In a plane'],[3,'In space']],label:'Space',get:s=>s.d,act:'d'},{range:'t',label:'Time',min:0,max:30,get:s=>s.t,act:'t'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),1,12)},d(s,v){s.d=+v===2?2:3},t(s,v){s.t=clamp(+v,0,30)}},
 draw(s){
  const g=D8_gas(s.n,8),d=s.d,dims=2*d*g.length,st=g.map(q=>{const [x,vx]=D8_bounce(q.x,q.vx,s.t),[y,vy]=D8_bounce(q.y,q.vy,s.t),[z,vz]=D8_bounce(q.z,q.vz,s.t);return {x,y,z,vx,vy,vz}});
  let out=heading(`${g.length} particle${g.length===1?'':'s'} ${d===3?'in space':'in a plane'}: ${dims} dimensions`);
  const bx=24,by=58,bw=180;out+=R(bx,by,bw,bw,'#fff',C.ink,2);
  st.forEach((q,i)=>{const x=bx+8+q.x*(bw-16),y=by+8+(1-q.y)*(bw-16);out+=Ci(x,y,d===3?4+3*q.z:6,i?C.blue:C.coral,'#fff')});
  out+=TF(bx,by+bw+17,d===3?'size shows depth (z)':'a flat box',13,C.muted,'start');
  // the state as one long list
  const names=d===3?['x','y','z','px','py','pz']:['x','y','px','py'],list=[];
  st.forEach((q,i)=>{const v=d===3?[q.x,q.y,q.z,q.vx,q.vy,q.vz]:[q.x,q.y,q.vx,q.vy];v.forEach((val,j)=>list.push([names[j]+D8_sub(i+1),val]))});
  out+=TF(226,62,'the gas as one point: a list of '+list.length+' numbers',13,C.muted,'start');
  const cols=4,show=Math.min(list.length,24);
  for(let k=0;k<show;k++){const c=k%cols,rw=Math.floor(k/cols);out+=TMF(226+c*90,86+rw*20,`${list[k][0]} ${D8_f(list[k][1],2)}`,13,k<2*d?C.coral:C.ink,'start')}
  if(list.length>show)out+=TF(226,86+6*20,`… and ${list.length-show} more`,13,C.muted,'start');
  // slice: particle 1, x against p_x
  const vm=Math.abs(g[0].vx)*1.5||.1,pl=D8_plot(300,232,170,82,[0,1],[-vm,vm],{xt:[[0,'0'],[1,'1']],yt:[[0,'0']]});out+=pl.svg+TF(296,226,'particle 1: x against px (mass 1)',13,C.coral,'start');
  const q0=g[0],trail=[];for(let i=0;i<=120;i++){const t=s.t*i/120,[x,v]=D8_bounce(q0.x,q0.vx,t);trail.push([pl.X(x),pl.Y(v)])}
  out+=D8_poly(trail,C.coral,2)+Ci(trail[120][0],trail[120][1],5,C.coral,'#fff');
  out+=D8_tile(484,232,100,'Per particle',String(2*d),C.ink)+D8_tile(484,286,100,'Dimensions',String(dims),C.green);
  return {svg:out,phase:`Each particle needs ${d} position numbers and ${d} momentum numbers, so ${g.length} particle${g.length===1?'':'s'} make${g.length===1?'s':''} a point in ${dims} dimensions. Particle 1’s slice shows x moving at a steady speed while its momentum px stays fixed, then px flipping sign at each wall: a rectangle in that plane. The full motion is one path through all ${dims} dimensions at once.`};
 }});

/* The Lorenz equations: x' = σ(y − x), y' = x(ρ − z) − y, z' = xy − βz, integrated with fourth-order Runge–Kutta. */
const D8_LZ={sigma:10,beta:8/3,dt:.01,T:30};
function D8_lzF([x,y,z],rho){return [D8_LZ.sigma*(y-x),x*(rho-z)-y,x*y-D8_LZ.beta*z]}
function D8_rk4(p,rho,h){const k1=D8_lzF(p,rho),k2=D8_lzF(p.map((v,i)=>v+h/2*k1[i]),rho),k3=D8_lzF(p.map((v,i)=>v+h/2*k2[i]),rho),k4=D8_lzF(p.map((v,i)=>v+h*k3[i]),rho);return p.map((v,i)=>v+h/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i]))}
const D8_LZ_CACHE={};
function D8_lzRun(rho,k){const key=rho+':'+k;if(D8_LZ_CACHE[key])return D8_LZ_CACHE[key];
 let a=[1,1,1],b=[1+Math.pow(10,-k),1,1];const A=[a],B=[b],sep=[Math.pow(10,-k)];const n=Math.round(D8_LZ.T/D8_LZ.dt);let cross=0;const crossT=[];
 for(let i=1;i<=n;i++){const z0=a[2];a=D8_rk4(a,rho,D8_LZ.dt);b=D8_rk4(b,rho,D8_LZ.dt);A.push(a);B.push(b);sep.push(Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]));if(z0<rho-1&&a[2]>=rho-1){cross++;crossT.push(i*D8_LZ.dt)}}
 return D8_LZ_CACHE[key]={A,B,sep,cross,crossT};}
const D8_lzFixed=rho=>rho>1?Math.sqrt(D8_LZ.beta*(rho-1)):0;
const D8_lzHopf=()=>{const s=D8_LZ.sigma,b=D8_LZ.beta;return s*(s+b+3)/(s-b-1)};
SCENE({id:'phase-space-lorenz',name:'A strange attractor in three dimensions',tag:'Lorenz, 1963',
 definition:`Edward Lorenz reduced a model of convection in the atmosphere to three equations in three variables, so its state space is three-dimensional. With his values σ = ${D8_LZ.sigma}, β = 8/3 and ρ = 28, every path settles onto a thin, two-winged set, a strange attractor, and loops round one wing then the other in a pattern that never repeats. Two paths that start almost together separate until they are unrelated: long-range prediction fails, though the equations contain no chance at all.`,
 example:`Start two copies a millionth apart. For a while they move as one; then the gap grows, and in this simulation it first exceeds 1 at t = ${D8_f(D8_lzRun(28,6).sep.findIndex(v=>v>1)*D8_LZ.dt,1)}, when the two can be on different wings. With ρ = 10 instead, both paths spiral into a resting point. Poincaré had already found, in the 1890s, that the three-body problem can behave this unpredictably.`,
 desc:'The path of the Lorenz system seen from the side (x across, z up), a second path that started very slightly apart drawn in another colour, and a graph of the distance between them on a logarithmic scale against time.',
 research:['Lorenz (1963). Deterministic nonperiodic flow. Journal of the Atmospheric Sciences 20, 130–141.','Poincaré (1890). Sur le problème des trois corps et les équations de la dynamique. Acta Mathematica 13, 1–270.','Tucker (2002). A rigorous ODE solver and Smale’s 14th problem. Foundations of Computational Mathematics 2, 53–117: a computer-assisted proof that the attractor exists.','Integrated here with fourth-order Runge–Kutta, step 0.01, from (1, 1, 1).'],
 dur:14,hint:'Choose ρ and how far apart the two paths start, then move the time slider and watch when the coral path leaves the blue one. In 3D the same paths are drawn in x, y, z.',
 init:()=>({rho:28,k:6,t:30}),
 watch(p){return {rho:28,k:6,t:Math.max(.5,Math.round(p*60)/2)}},
 ui:[{choose:[[28,'ρ = 28'],[10,'ρ = 10']],label:'ρ',get:s=>s.rho,act:'rho'},{range:'k',label:'Start gap 10⁻ᵏ, k',min:2,max:10,get:s=>s.k,act:'k'},{range:'t',label:'Time',min:1,max:30,get:s=>s.t,act:'t'}],
 on:{rho(s,v){s.rho=+v===10?10:28},k(s,v){s.k=clamp(Math.round(+v),2,10)},t(s,v){s.t=clamp(Math.round(+v*2)/2,.5,30)}},
 draw(s){
  const run=D8_lzRun(s.rho,s.k),n=Math.round(s.t/D8_LZ.dt),nc=run.crossT.filter(t=>t<=s.t+1e-9).length,A=run.A.slice(0,n+1),B=run.B.slice(0,n+1),gap=run.sep[n];
  const apart=run.sep.findIndex(v=>v>1),fx=D8_lzFixed(s.rho);
  let out=heading(s.rho===28?(gap>1?`At t = ${fmt(s.t)} the two paths are ${D8_f(gap,1)} apart`:'Two paths, still together'):'ρ = 10: both paths settle to a resting point');
  const pl=D8_plot(30,50,280,250,[-22,22],[0,50],{xt:[[-20,'−20'],[0,'x = 0'],[20,'20']],yt:[[0,'0'],[25,'25'],[50,'50']]});
  out+=pl.svg+TF(30,44,'z',13,C.muted,'start');
  const step=Math.max(1,Math.floor(A.length/900)),pa=[],pb=[];for(let i=0;i<A.length;i+=step){pa.push([pl.X(A[i][0]),pl.Y(A[i][2])]);pb.push([pl.X(B[i][0]),pl.Y(B[i][2])])}
  out+=D8_poly(pa,C.blue,1.1)+D8_poly(pb,C.coral,1.1,'opacity=".8"')+Ci(pl.X(A[n][0]),pl.Y(A[n][2]),5,C.blue,'#fff')+Ci(pl.X(B[n][0]),pl.Y(B[n][2]),5,C.coral,'#fff');
  for(const sg of [1,-1])out+=TF(pl.X(sg*fx),pl.Y(s.rho-1)+5,'+',16,C.ink);
  // separation, log scale
  const lp=D8_plot(372,62,206,150,[0,30],[-10,2],{xt:[[0,'0'],[15,'15'],[30,'30']],yt:[[-10,'10⁻¹⁰'],[-5,'10⁻⁵'],[0,'1']],xl:'time',xlDy:32});
  out+=lp.svg+TF(330,54,'distance between the paths',13,C.muted,'start');
  const sp=[];for(let i=0;i<=n;i+=5)sp.push([lp.X(i*D8_LZ.dt),lp.Y(clamp(Math.log10(Math.max(1e-12,run.sep[i])),-10,2))]);out+=D8_poly(sp,C.purple,2);
  out+=D8_tile(330,262,124,'Gap now',gap<.001?D8_sci(gap,1):D8_f(gap,2),C.purple)+D8_tile(462,262,124,'Gap first passes 1',apart>0?`t = ${D8_f(apart*D8_LZ.dt,1)}`:'not yet',C.coral);
  out+=D8_note(`+ marks the resting points (±${D8_f(fx,2)}, ±${D8_f(fx,2)}, ${s.rho-1}); they are unstable once ρ > ${D8_f(D8_lzHopf(),2)}.`,334);
  out+=D8_note(`Side view (x, z). Poincaré section: ${nc} upward crossing${nc===1?'':'s'} of the plane z = ${s.rho-1} so far.`,356);
  return {svg:out,phase:s.rho===28?`ρ = 28 is above ${D8_f(D8_lzHopf(),2)}, where the two resting points lose their stability, so the path never settles. The coral path started 10⁻${D8_sup(s.k)} away; ${apart>0?`the gap first exceeds 1 at t = ${D8_f(apart*D8_LZ.dt,1)}`:'the gap is still below 1'}. A smaller starting gap buys only a little more time before the paths part. Poincaré’s trick of recording only where a path crosses a plane turns the tangle into a scatter of points: ${nc} crossings so far.`:`ρ = 10 is below ${D8_f(D8_lzHopf(),2)}, so the resting points attract. Both paths spiral into the one at (${D8_f(fx,2)}, ${D8_f(fx,2)}, ${s.rho-1}) and their distance shrinks: no chaos here.`};
 },
 three(s){
  const run=D8_lzRun(s.rho,s.k),n=Math.round(s.t/D8_LZ.dt),Pr=makeProject([-22,22,-14,14,0,48]),step=Math.max(1,Math.floor(n/1200));
  // turned 45° about the z axis, so that the two wings (near x = y) face the default camera
  const T3=([x,y,z])=>[(x+y)/Math.SQRT2,(y-x)/Math.SQRT2,z];
  let out=arrow3([0,0,0],[0,0,46],Pr,C.muted,1.6);const zq=Pr([0,0,48]);out+=TF(zq[0]+8,zq[1],'z',13,C.muted,'start');
  const pa=[],pb=[];for(let i=0;i<=n;i+=step){pa.push(Pr(T3(run.A[i])));pb.push(Pr(T3(run.B[i])))}
  out+=D8_poly(pa,C.blue,1)+D8_poly(pb,C.coral,1,'opacity=".75"');
  const fx=D8_lzFixed(s.rho);for(const sg of [1,-1]){const q=Pr(T3([sg*fx,sg*fx,s.rho-1]));out+=TF(q[0],q[1]+5,'+',16,C.ink)}
  return {svg:out,title:'The Lorenz attractor in x, y, z',caption:`The scene integrates the three equations itself and draws both paths in x, y, z (turned 45° about the z axis so the wings face you; ρ = ${s.rho}, up to t = ${fmt(s.t)}). + marks the resting points. Dragging only turns the camera on the computed curve.`};
 }});

/* ===================== Lesson: data-dimensions ===================== */
// A synthetic table: 24 objects, four measurements each in millimetres, generated from a seed (no real data).
const D8_COLS=['A','B','C','D'];
const D8_TABLE=(()=>{const r=D8_rng(2024),rows=[];for(let i=0;i<24;i++){const f=D8_gauss(r),g=D8_gauss(r);
 rows.push([50+8*f+2*D8_gauss(r),30+5*f+3*g+1.5*D8_gauss(r),12+1.5*f-2*g+1.2*D8_gauss(r),20+3*g+2*D8_gauss(r)].map(v=>D8_r(v,1)))}return rows})();
const D8_dist=(a,b,idx)=>Math.sqrt(sum(idx.map(k=>(a[k]-b[k])**2)));
SCENE({id:'data-dimensions',name:'Every row is a point',tag:'A table as a cloud in n dimensions',
 definition:'A table of measurements, one row per object and one column per measurement, is a cloud of points: with n columns each row is a point in n-dimensional space. Distances, directions and angles then work exactly as in earlier lessons, one coordinate at a time. We can only look at two or three columns at once, and every such view is a projection that drops the others.',
 example:`Each object here has ${D8_TABLE[0].length} measurements, so the table is ${D8_TABLE.length} points in ${D8_TABLE[0].length} dimensions. Two objects that look close in a view of columns A and B can be far apart once C and D are counted: a projection can shorten a distance but never lengthen it, because it only leaves out squared differences.`,
 desc:'A table of synthetic objects with four measurements each, a scatter plot of any two columns, and two chosen objects with their distance in the view and in all four dimensions.',
 research:['Pearson (1901). On lines and planes of closest fit to systems of points in space. Philosophical Magazine 2, 559–572: measurements treated as points in space.','The table is synthetic, generated from a fixed seed; no real data are used.'],
 dur:12,hint:'Choose which two columns to plot, and press two points to compare their distance in the view with their distance in all four dimensions.',
 init:()=>({cx:0,cy:1,pa:8,pb:20}),
 watch(p){const views=[[0,1],[0,2],[1,3],[2,3]],k=Math.min(3,Math.floor(p*4));return {cx:views[k][0],cy:views[k][1],pa:8,pb:20}},
 ui:[{choose:D8_COLS.map((c,i)=>[i,'Across: '+c]),label:'Across',get:s=>s.cx,act:'cx'},{choose:D8_COLS.map((c,i)=>[i,'Up: '+c]),label:'Up',get:s=>s.cy,act:'cy'}],
 on:{cx(s,v){s.cx=clamp(Math.round(+v),0,3)},cy(s,v){s.cy=clamp(Math.round(+v),0,3)},pick(s,v){const i=clamp(Math.round(+v),0,D8_TABLE.length-1);if(i!==s.pb){s.pa=s.pb;s.pb=i}}},
 draw(s,f,X){
  const T=D8_TABLE,n=T.length,m=T[0].length,cx=s.cx,cy=s.cy===s.cx?(s.cx+1)%4:s.cy;
  const ext=k=>[Math.min(...T.map(r=>r[k])),Math.max(...T.map(r=>r[k]))],ex=ext(cx),ey=ext(cy),padx=(ex[1]-ex[0])*.08,pady=(ey[1]-ey[0])*.08;
  let out=heading(`${n} rows × ${m} columns: ${n} points in ${m} dimensions`);
  // table
  out+=TF(20,60,'the table (mm)',13,C.muted,'start');out+=TBF(30,82,'#',13,C.muted,'start');D8_COLS.forEach((c,k)=>out+=TBF(74+k*46,82,c,13,k===cx||k===cy?C.blue:C.muted,'end'));
  const rowsShown=[0,1,2,s.pa,s.pb].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b).slice(0,6);
  rowsShown.forEach((ri,j)=>{const y=104+j*20,sel=ri===s.pa||ri===s.pb;if(sel)out+=R(22,y-14,198,19,ri===s.pa?C.coralp:C.purplep,'none',3);out+=TMF(30,y,String(ri+1),13,C.muted,'start');T[ri].forEach((v,k)=>out+=TMF(74+k*46+14,y,v.toFixed(1),13,C.ink,'end'))});
  out+=TF(20,104+rowsShown.length*20,`… ${n-rowsShown.length} more rows`,13,C.muted,'start');
  // scatter
  const pl=D8_plot(268,52,300,222,[ex[0]-padx,ex[1]+padx],[ey[0]-pady,ey[1]+pady],{xt:ex.map(v=>[v,v.toFixed(1)]),yt:ey.map(v=>[v,v.toFixed(1)]),xl:'column '+D8_COLS[cx],xlDy:34});out+=pl.svg+TF(268,46,'column '+D8_COLS[cy],13,C.muted,'start');
  const A=T[s.pa],B=T[s.pb];out+=L(pl.X(A[cx]),pl.Y(A[cy]),pl.X(B[cx]),pl.Y(B[cy]),C.ink,1.6,'stroke-dasharray="4 3"');
  T.forEach((r,i)=>{const sel=i===s.pa?C.coral:i===s.pb?C.purple:null;out+=hit(X,'pick',i,`Object ${i+1}`,Ci(pl.X(r[cx]),pl.Y(r[cy]),sel?7:5,sel||C.blue,'#fff'))});
  const d2=D8_dist(A,B,[cx,cy]),d4=D8_dist(A,B,[0,1,2,3]);
  out+=D8_tile(20,318,176,`Rows ${s.pa+1} and ${s.pb+1} in this view`,D8_f(d2,1)+' mm',C.blue)+D8_tile(206,318,176,'In all four dimensions',D8_f(d4,1)+' mm',C.ink)+D8_tile(392,318,190,'View ÷ full distance',D8_f(d2/d4,2),C.green);
  return {svg:out,phase:`Row ${s.pa+1} is (${A.map(v=>v.toFixed(1)).join(', ')}) and row ${s.pb+1} is (${B.map(v=>v.toFixed(1)).join(', ')}). Pythagoras over all four columns gives ${D8_f(d4,1)} mm; the view of ${D8_COLS[cx]} and ${D8_COLS[cy]} keeps only two of the four squared differences and shows ${D8_f(d2,1)} mm, ${D8_f(100*d2/d4,0)}% of it.`};
 }});

/* Principal components of a 2D cloud: the spread along a direction at angle φ is u·S·u, where S is the covariance matrix. */
const D8_CLOUD=(()=>{const r=D8_rng(77),pts=[];for(let i=0;i<60;i++){const a=D8_gauss(r)*1.6,b=D8_gauss(r)*.55,c=Math.cos(D8_rad(32)),s=Math.sin(D8_rad(32));pts.push([a*c-b*s,a*s+b*c])}
 const mx=sum(pts.map(p=>p[0]))/pts.length,my=sum(pts.map(p=>p[1]))/pts.length;return pts.map(p=>[p[0]-mx,p[1]-my])})();
function D8_cov2(pts){const n=pts.length;let a=0,b=0,c=0;for(const [x,y] of pts){a+=x*x;b+=x*y;c+=y*y}return [a/(n-1),b/(n-1),c/(n-1)]}
const D8_spread=(S,phi)=>{const u=[Math.cos(D8_rad(phi)),Math.sin(D8_rad(phi))];return S[0]*u[0]*u[0]+2*S[1]*u[0]*u[1]+S[2]*u[1]*u[1]};
function D8_pc2(S){const [a,b,c]=S,tr=a+c,dt=Math.sqrt(((a-c)/2)**2+b*b),l1=tr/2+dt,l2=tr/2-dt,phi=D8_mod(.5*Math.atan2(2*b,a-c)*180/Math.PI,180);return {l1,l2,phi}}
SCENE({id:'data-dimensions-pca',name:'Turning the cloud to find the most spread',tag:'Pearson 1901, Hotelling 1933',
 definition:'Principal component analysis looks for the direction in which a cloud of points is most spread out. Karl Pearson (1901) asked for the line that fits the points best, with the least total squared distance from the points to the line; Harold Hotelling (1933) asked for the combination of measurements with the greatest variance. Both give the same line, the first principal component, because for every point the squared distance along the line plus the squared distance from it is fixed.',
 example:'The first component points along the long axis of the cloud; the second is perpendicular to it. Here the first carries most of the variance, so a single number, each point’s position along that line, describes the cloud well. With n columns there are n components, all at right angles, ordered by the spread they carry.',
 desc:'A cloud of synthetic points with a line through its centre at an adjustable angle and each point’s projection onto it, beside a graph of the spread along the line for every angle, with the computed first principal component marked.',
 research:['Pearson (1901). On lines and planes of closest fit to systems of points in space. Philosophical Magazine 2, 559–572.','Hotelling (1933). Analysis of a complex of statistical variables into principal components. Journal of Educational Psychology 24, 417–441 and 498–520.','Jolliffe (2002). Principal Component Analysis, 2nd ed. Springer.'],
 dur:12,hint:'Turn the line with the slider until the spread along it is as large as you can make it, then show the computed first component and compare.',
 init:()=>({phi:100,show:0}),
 watch(p){return {phi:Math.round(p*175/5)*5,show:p>.8?1:0}},
 ui:[{range:'phi',label:'Line angle',min:0,max:175,step:5,get:s=>s.phi,act:'phi',show:v=>v+'°'},{b:'Show the first component',act:'show'}],
 on:{phi(s,v){s.phi=clamp(Math.round(+v/5)*5,0,175)},show(s){s.show=1}},
 draw(s){
  const S=D8_cov2(D8_CLOUD),pc=D8_pc2(S),tot=S[0]+S[2],sp=D8_spread(S,s.phi),res=tot-sp;
  let out=heading(`Spread along the line: ${D8_f(sp,2)} of ${D8_f(tot,2)} (${D8_f(100*sp/tot,0)}%)`);
  const cx=150,cy=190,sc=36,u=[Math.cos(D8_rad(s.phi)),Math.sin(D8_rad(s.phi))];
  out+=R(18,50,264,264,'#fff',C.grid,8);
  out+=L(cx-u[0]*125,cy+u[1]*125,cx+u[0]*125,cy-u[1]*125,C.purple,2.2);
  for(const [x,y] of D8_CLOUD){const t=x*u[0]+y*u[1],px=cx+t*u[0]*sc,py=cy-t*u[1]*sc;out+=L(cx+x*sc,cy-y*sc,px,py,'#d6c9ee',1)}
  for(const [x,y] of D8_CLOUD){const t=x*u[0]+y*u[1];out+=Ci(cx+x*sc,cy-y*sc,3.6,C.blue)+Ci(cx+t*u[0]*sc,cy-t*u[1]*sc,2.4,C.purple)}
  if(s.show){const v=[Math.cos(D8_rad(pc.phi)),Math.sin(D8_rad(pc.phi))];out+=arrow(cx,cy,cx+v[0]*110,cy-v[1]*110,C.coral,3)+TF(cx+v[0]*110+(v[0]>0?6:-6),cy-v[1]*110-8,'PC1',13,C.coral,v[0]>0?'start':'end')}
  // spread against angle
  const pl=D8_plot(330,62,248,180,[0,180],[0,Math.ceil(pc.l1)],{xt:[[0,'0°'],[90,'90°'],[180,'180°']],yt:[[0,'0'],[Math.ceil(pc.l1),String(Math.ceil(pc.l1))]],xl:'angle of the line',xlDy:32});
  out+=pl.svg+TF(326,56,'spread (variance) along the line',13,C.muted,'start');
  const cur=[];for(let a=0;a<=180;a+=3)cur.push([pl.X(a),pl.Y(D8_spread(S,a))]);out+=D8_poly(cur,C.blue,2);
  out+=Ci(pl.X(s.phi),pl.Y(sp),6,C.purple,'#fff');
  if(s.show)out+=L(pl.X(pc.phi),62,pl.X(pc.phi),242,C.coral,1.6,'stroke-dasharray="4 3"')+TF(pl.X(pc.phi)+(pc.phi>120?-4:4),78,`PC1 ${D8_f(pc.phi,1)}°`,13,C.coral,pc.phi>120?'end':'start');
  out+=D8_tile(18,322,170,'Your line: spread',D8_f(sp,2),C.purple)+D8_tile(196,322,170,'Squared distance to line',D8_f(res,2),C.ink)+D8_tile(374,322,208,s.show?'PC1 carries':'First component',s.show?`${D8_f(100*pc.l1/tot,1)}% of the variance`:'press Show',C.coral);
  return {svg:out,phase:`Along the line at ${s.phi}° the points’ positions have variance ${D8_f(sp,2)}, and their mean squared distance from the line is ${D8_f(res,2)}; the two always add to ${D8_f(tot,2)}, the total variance. ${s.show?`The first principal component, from the covariance matrix, is at ${D8_f(pc.phi,1)}° with variance ${D8_f(pc.l1,2)} (${D8_f(100*pc.l1/tot,1)}%); the second, at right angles, has ${D8_f(pc.l2,2)}. Your line is ${D8_f(Math.min(Math.abs(s.phi-pc.phi),180-Math.abs(s.phi-pc.phi)),1)}° away.`:'Turn the line to make the spread as large as you can.'}`};
 }});

/* Projections of high-dimensional data: clusters or a single blob in n dimensions, viewed in two dimensions. */
const D8_HI_N=90;
function D8_hiData(kind,n,seed=5){const r=D8_rng(seed*131+n),N=D8_HI_N,cent=[0,1,2].map(()=>range(n).map(()=>D8_gauss(r)*1.9)),pts=[],lab=[];
 for(let i=0;i<N;i++){const c=kind==='clusters'?i%3:0;pts.push(range(n).map(k=>(kind==='clusters'?cent[c][k]:0)+D8_gauss(r)));lab.push(c)}
 const mean=range(n).map(k=>sum(pts.map(p=>p[k]))/N);return {pts:pts.map(p=>p.map((v,k)=>v-mean[k])),lab,n}}
const D8_dot=(a,b)=>{let s=0;for(let i=0;i<a.length;i++)s+=a[i]*b[i];return s};
const D8_unit=v=>{const l=Math.sqrt(D8_dot(v,v))||1;return v.map(x=>x/l)};
// Top two principal directions by power iteration with deflation (400 iterations each), from the data directly.
function D8_top2(pts){const n=pts[0].length,dirs=[];const Sv=v=>{const out=new Array(n).fill(0);for(const p of pts){const t=D8_dot(p,v);for(let k=0;k<n;k++)out[k]+=t*p[k]}return out.map(x=>x/(pts.length-1))};
 for(let d=0;d<2;d++){let v=D8_unit(range(n).map(k=>Math.cos(k*1.7+d)+.3));for(let it=0;it<400;it++){let w=Sv(v);for(const u of dirs){const t=D8_dot(w,u);w=w.map((x,k)=>x-t*u[k])}v=D8_unit(w)}dirs.push(v)}return dirs}
function D8_randDirs(n,seed){const r=D8_rng(seed),a=D8_unit(range(n).map(()=>D8_gauss(r)));let b=range(n).map(()=>D8_gauss(r));const t=D8_dot(a,b);b=D8_unit(b.map((x,k)=>x-t*a[k]));return [a,b]}
function D8_corr(x,y){const n=x.length,mx=sum(x)/n,my=sum(y)/n;let a=0,b=0,c=0;for(let i=0;i<n;i++){a+=(x[i]-mx)*(y[i]-my);b+=(x[i]-mx)**2;c+=(y[i]-my)**2}return a/Math.sqrt(b*c)}
const D8_PROJ_CACHE={};
function D8_project(s){const key=[s.kind,s.n,s.how,s.seed].join(',');if(D8_PROJ_CACHE[key])return D8_PROJ_CACHE[key];
 const D=D8_hiData(s.kind,s.n),dirs=s.how==='pca'?D8_top2(D.pts):D8_randDirs(s.n,s.seed),xy=D.pts.map(p=>[D8_dot(p,dirs[0]),D8_dot(p,dirs[1])]);
 const tot=sum(D.pts.map(p=>D8_dot(p,p))),cap=sum(xy.map(q=>q[0]*q[0]+q[1]*q[1]));
 const dh=[],dl=[];for(let i=0;i<D.pts.length;i++)for(let j=i+1;j<D.pts.length;j++){let s2=0;for(let k=0;k<s.n;k++)s2+=(D.pts[i][k]-D.pts[j][k])**2;dh.push(Math.sqrt(s2));dl.push(Math.hypot(xy[i][0]-xy[j][0],xy[i][1]-xy[j][1]))}
 return D8_PROJ_CACHE[key]={xy,lab:D.lab,share:cap/tot,r:D8_corr(dh,dl)};}
SCENE({id:'data-dimensions-projection',name:'A picture of the data is not the data',tag:'Projections and embeddings',
 definition:'To look at data with many columns we must squash it into two dimensions, and every squashing loses something. A linear projection, such as onto the first two principal components or onto two random directions, keeps straight lines straight but can stack distant points on top of each other. Non-linear embeddings such as t-SNE (2008) and UMAP (2018) are built to keep near neighbours near, and in doing so can change the sizes of clusters, the gaps between them, and even suggest clusters in data that has none.',
 example:`${D8_HI_N} points in 50 dimensions, in three groups. The first two principal components separate the groups clearly; two random directions may not, although the data are the same. A single blob with no groups at all still gives a picture, and the eye looks for shapes in it. A picture of an embedding is a clue about structure, not a proof of it.`,
 desc:'A two-dimensional view of synthetic points that live in many dimensions, coloured by the group that generated them, with tiles for how much of the total variance the view keeps and how well distances in the view match the true distances.',
 research:['Johnson & Lindenstrauss (1984). Extensions of Lipschitz mappings into a Hilbert space. Contemporary Mathematics 26, 189–206: random projections roughly keep distances, if the target dimension is not too small.','van der Maaten & Hinton (2008). Visualizing data using t-SNE. Journal of Machine Learning Research 9, 2579–2605. McInnes, Healy & Melville (2018). UMAP. arXiv:1802.03426.','Wattenberg, Viégas & Johnson (2016). How to use t-SNE effectively. Distill: cluster sizes and distances in t-SNE pictures can mislead.'],
 dur:12,hint:'Switch between grouped data and a single blob, between principal components and random directions, and change the number of dimensions. Try several random directions.',
 init:()=>({kind:'clusters',n:50,how:'pca',seed:3}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return [{kind:'clusters',n:50,how:'pca',seed:3},{kind:'clusters',n:50,how:'random',seed:3},{kind:'clusters',n:50,how:'random',seed:4},{kind:'blob',n:50,how:'pca',seed:3}][k]},
 ui:[{choose:[['clusters','Three groups'],['blob','One blob']],label:'Data',get:s=>s.kind,act:'kind'},{choose:[['pca','First two components'],['random','Two random directions']],label:'View',get:s=>s.how,act:'how'},
  {choose:[[10,'10 dimensions'],[50,'50'],[200,'200']],label:'Dimensions',get:s=>s.n,act:'n'},{b:'New random directions',act:'seed'}],
 on:{kind(s,v){s.kind=v==='blob'?'blob':'clusters'},how(s,v){s.how=v==='random'?'random':'pca'},n(s,v){s.n=[10,50,200].includes(+v)?+v:50},seed(s){s.seed++;s.how='random'}},
 draw(s){
  const P=D8_project(s),mx=Math.max(...P.xy.map(q=>Math.max(Math.abs(q[0]),Math.abs(q[1]))))*1.08,cx=170,cy=190,sc=128/mx;
  let out=heading(`${s.kind==='clusters'?'Three groups':'One blob'} in ${s.n} dimensions, seen in two`);
  out+=R(30,58,280,264,'#fff',C.grid,6)+L(cx,62,cx,318,C.grid,1)+L(34,cy,306,cy,C.grid,1);
  const cols=[C.blue,C.coral,C.green],shape=(x,y,c)=>c===0?Ci(x,y,4.2,cols[0]):c===1?R(x-3.8,y-3.8,7.6,7.6,cols[1],'none',1):`<polygon points="${fmt(x)},${fmt(y-5)} ${fmt(x+4.6)},${fmt(y+3.6)} ${fmt(x-4.6)},${fmt(y+3.6)}" fill="${cols[2]}"/>`;
  P.xy.forEach((q,i)=>out+=shape(cx+q[0]*sc,cy-q[1]*sc,s.kind==='clusters'?P.lab[i]:0));
  out+=TF(38,76,s.how==='pca'?'axes: PC1 across, PC2 up':'axes: two random directions',13,C.muted,'start');
  if(s.kind==='clusters')out+=Ci(342,84,4.2,cols[0])+TF(352,89,'group 1',13,C.ink,'start')+R(418,80,7.6,7.6,cols[1],'none',1)+TF(432,89,'group 2',13,C.ink,'start')+`<polygon points="502,79 506.6,87.6 497.4,87.6" fill="${cols[2]}"/>`+TF(512,89,'group 3',13,C.ink,'start');
  out+=D8_tile(334,112,248,'Share of total variance in this view',D8_f(100*P.share,1)+'%',C.blue);
  out+=D8_tile(334,166,248,'Distances: view against true (r)',D8_f(P.r,2),C.purple);
  out+=TF(334,240,'r = 1 would mean distances in the',13,C.muted,'start')+TF(334,258,'picture rise exactly with the true',13,C.muted,'start')+TF(334,276,'ones; the shapes show which group',13,C.muted,'start')+TF(334,294,'made each point, not the view.',13,C.muted,'start');
  out+=D8_note('Synthetic data from a fixed seed. Groups are told apart by shape as well as colour.',350);
  return {svg:out,phase:`This view keeps ${D8_f(100*P.share,1)}% of the total variance of the ${s.n}-dimensional data, and the correlation between the ${D8_group(D8_HI_N*(D8_HI_N-1)/2)} pairwise distances in the picture and in full is ${D8_f(P.r,2)}. ${s.kind==='clusters'?(s.how==='pca'?'The first two components point along the directions in which the group centres differ most, so the groups separate.':'Random directions ignore where the groups differ, so they may overlap here although they are separate in the full space.'):'There are no groups to find: whatever shape the eye sees in this blob is noise, and a fancier embedding could make it look more convincing.'}`};
 }});

/* ===================== Lesson: fractal-dimension ===================== */
// A random Koch coastline: each segment is replaced by four of a third its length, the bump going left or right
// at random (seeded). Every level multiplies the length by 4/3 whatever the sides, so its dimension is log 4 / log 3.
const D8_KOCH_D=Math.log(4)/Math.log(3),D8_SIER_D=Math.log(3)/Math.log(2);
const D8_KOCH_CACHE={};
function D8_koch(level,seed=0){const key=level+':'+seed;if(D8_KOCH_CACHE[key])return D8_KOCH_CACHE[key];let pts=[[0,0],[1,0]];const r=seed?D8_rng(seed):null;
 for(let l=0;l<level;l++){const out=[pts[0]];for(let i=0;i<pts.length-1;i++){const [ax,ay]=pts[i],[bx,by]=pts[i+1],dx=(bx-ax)/3,dy=(by-ay)/3,sg=r?(r()<.5?1:-1):1;
  const p1=[ax+dx,ay+dy],p3=[ax+2*dx,ay+2*dy],p2=[p1[0]+dx/2-sg*dy*Math.sqrt(3)/2,p1[1]+dy/2+sg*dx*Math.sqrt(3)/2];out.push(p1,p2,p3,[bx,by])}pts=out}
 return D8_KOCH_CACHE[key]=pts;}
// Richardson's divider walk: from the start, step to the first later point of the curve at distance r; count the steps.
function D8_divider(pts,r){const walk=[pts[0]];let cur=pts[0],i=0;
 while(i<pts.length-1){let found=false;
  for(let j=i;j<pts.length-1;j++){const a=pts[j],b=pts[j+1];if(Math.hypot(b[0]-cur[0],b[1]-cur[1])<r)continue;
   // first point on segment a→b at distance r from cur (the far root, beyond any earlier crossing)
   const dx=b[0]-a[0],dy=b[1]-a[1],fx=a[0]-cur[0],fy=a[1]-cur[1],A=dx*dx+dy*dy,B=2*(fx*dx+fy*dy),Cc=fx*fx+fy*fy-r*r,disc=Math.max(0,B*B-4*A*Cc),t=clamp((-B+Math.sqrt(disc))/(2*A),0,1);
   cur=[a[0]+t*dx,a[1]+t*dy];walk.push(cur);i=j;found=true;break}
  if(!found)break}
 const end=pts[pts.length-1],rest=Math.hypot(end[0]-cur[0],end[1]-cur[1]);if(rest>1e-9)walk.push(end);
 return {walk,steps:walk.length-1-(rest>1e-9?1:0),len:(walk.length-1-(rest>1e-9?1:0))*r+rest};}
const D8_COAST_LEVEL=7,D8_COAST_SEED=29;
const D8_RULERS=range(7).map(j=>Math.pow(2,-(j+1)));   // 1/2 … 1/128 of the coast’s end-to-end width
const D8_coastData=(()=>{let c=null;return ()=>c||(c=D8_RULERS.map(r=>({r,...D8_divider(D8_koch(D8_COAST_LEVEL,D8_COAST_SEED),r)})))})();
SCENE({id:'fractal-dimension',name:'Shorter rulers, longer coast',tag:'Richardson’s dividers, Mandelbrot 1967',
 definition:'Measure a coastline by walking a pair of dividers along it, each step a fixed ruler length r, and multiply the number of steps by r. Lewis Fry Richardson found that for real coasts the answer keeps growing as r shrinks, because a shorter ruler follows smaller bays and headlands. On a log–log graph the measured length against ruler length is close to a straight line. Benoit Mandelbrot (1967) read its slope as 1 − D, where D is a dimension between 1 and 2.',
 example:`This coast is generated: a random Koch curve, where each piece is replaced by four pieces a third as long with the bump on a random side, ${D8_COAST_LEVEL} times over. Every level multiplies the length by 4/3, so the dividers find more and more length down to the finest level, and the slope gives D close to log 4 / log 3 = ${D8_f(D8_KOCH_D,3)}.`,
 desc:'A generated coastline with the divider walk for the chosen ruler drawn over it, and a log–log graph of measured length against ruler length with the fitted line and the dimension it gives.',
 research:['Richardson (1961). The problem of contiguity: an appendix to Statistics of Deadly Quarrels. General Systems Yearbook 6, 139–187.','Mandelbrot (1967). How long is the coast of Britain? Statistical self-similarity and fractional dimension. Science 156, 636–638.','von Koch (1904). Sur une courbe continue sans tangente, obtenue par une construction géométrique élémentaire. Arkiv för Matematik, Astronomi och Fysik 1, 681–702.'],
 dur:14,hint:'Shorten the ruler one halving at a time and watch the walk follow smaller wiggles. Each ruler adds a point to the log–log graph; the slope of the fitted line gives the dimension.',
 init:()=>({j:3}),
 watch(p){return {j:Math.min(6,Math.floor(p*7))}},
 ui:[{range:'j',label:'Ruler',min:0,max:6,get:s=>s.j,act:'j',show:v=>'1/'+Math.pow(2,v+1)}],
 on:{j(s,v){s.j=clamp(Math.round(+v),0,6)}},
 draw(s){
  const pts=D8_koch(D8_COAST_LEVEL,D8_COAST_SEED),data=D8_coastData(),cur=data[s.j],ys=pts.map(p=>p[1]),y0=Math.min(...ys),y1=Math.max(...ys);
  const sc=480,sx=v=>60+v*sc,syc=v=>150-(v-(y0+y1)/2)*sc;
  let out=heading(`Ruler 1/${Math.round(1/cur.r)}: ${cur.steps} steps, length ${D8_f(cur.len,3)}`);
  out+=R(18,50,564,200,'#fff',C.grid,6);
  const step=Math.max(1,Math.floor(pts.length/1400)),cp=[];for(let i=0;i<pts.length;i+=step)cp.push([sx(pts[i][0]),syc(pts[i][1])]);cp.push([sx(1),syc(0)]);
  out+=D8_poly(cp,'#9fb9c9',1.1)+D8_poly(cur.walk.map(p=>[sx(p[0]),syc(p[1])]),C.coral,2);
  for(const p of cur.walk.slice(0,400))out+=Ci(sx(p[0]),syc(p[1]),s.j<4?3.4:2,C.coral);
  out+=L(26,244,26+cur.r*sc,244,C.ink,3)+TF(32+cur.r*sc,249,'ruler',13,C.ink,'start');
  // log–log graph
  const shown=data.slice(0,s.j+1),lp=D8_plot(352,262,150,74,[0,2.2],[0,.65],{});
  const fitAll=D8_fit(data.map(d=>[Math.log10(1/d.r),Math.log10(d.len)])),fit=shown.length>1?D8_fit(shown.map(d=>[Math.log10(1/d.r),Math.log10(d.len)])):null;
  out+=lp.svg+TF(348,258,'log length',13,C.muted,'start')+TF(502,352,'log (1/ruler)',13,C.muted,'end');
  if(fit)out+=L(lp.X(Math.log10(2)),lp.Y(fit.icept+fit.slope*Math.log10(2)),lp.X(Math.log10(128)),lp.Y(fit.icept+fit.slope*Math.log10(128)),C.purple,1.6,'stroke-dasharray="4 3"');
  for(const d of shown)out+=Ci(lp.X(Math.log10(1/d.r)),lp.Y(Math.log10(d.len)),4,C.coral);
  out+=D8_tile(18,268,150,'Rulers used',String(shown.length),C.ink)+D8_tile(176,268,168,'Fitted D = 1 + slope',fit?D8_f(1+fit.slope,3):'need 2',C.purple)+D8_tile(510,268,72,'log4/log3',D8_f(D8_KOCH_D,3),C.green);
  return {svg:out,phase:`With a ruler of 1/${Math.round(1/cur.r)} of the coast’s width the dividers take ${cur.steps} steps and measure ${D8_f(cur.len,3)}. ${fit?`Over ${shown.length} rulers the line through log length against log (1/ruler) has slope ${D8_f(fit.slope,3)}, so D = ${D8_f(1+fit.slope,3)}; with all seven rulers it is ${D8_f(1+fitAll.slope,3)}, against log 4 / log 3 = ${D8_f(D8_KOCH_D,3)} for the ideal curve.`:'Shorten the ruler to add more points to the graph.'} Below the finest wiggles, 3⁻${D8_sup(D8_COAST_LEVEL)} of the width, the length would stop growing: a generated coast, like a real one, is fractal only over a range of scales.`};
 }});

/* Richardson's published coasts and frontiers, with Mandelbrot's dimensions (Mandelbrot 1967, from Richardson 1961). */
const D8_COASTS=[['West coast of Britain',1.25],['Land frontier of Germany (1900)',1.15],['Coast of Australia',1.13],['Coast of South Africa',1.02],['A circle (Richardson’s check)',1]];
SCENE({id:'fractal-dimension-richardson',name:'Richardson’s coasts and frontiers',tag:'Published posthumously, 1961',
 definition:'Richardson, a physicist and pacifist who studied the statistics of wars, wanted to know whether the length of a shared border affects how likely two countries are to fight. He found that published lengths of the same border disagreed, and measured coasts and frontiers on maps with dividers of different sizes. Each gave a nearly straight line on a log–log graph, with a different slope for each. His paper appeared after his death in 1953. Mandelbrot saw that the slopes were dimensions.',
 example:`Mandelbrot’s values from Richardson’s graphs: about ${D8_COASTS[0][1]} for the rugged west coast of Britain, ${D8_COASTS[3][1]} for the smooth coast of South Africa, and exactly 1 for a circle, whose measured length settles down as the ruler shrinks. With D = ${D8_COASTS[0][1]}, cutting the ruler by ten makes the measured length 10^${D8_f(D8_COASTS[0][1]-1,2)} = ${D8_f(Math.pow(10,D8_COASTS[0][1]-1),2)} times longer.`,
 desc:'A log–log graph of relative measured length against ruler length for five curves Richardson measured, with the chosen one highlighted, and tiles that compute how much longer it measures when the ruler is shortened.',
 research:['Richardson (1961). The problem of contiguity: an appendix to Statistics of Deadly Quarrels. General Systems Yearbook 6, 139–187.','Mandelbrot (1967). How long is the coast of Britain? Science 156, 636–638: D ≈ 1.25 (west coast of Britain), 1.15 (German land frontier, 1900), 1.13 (Australian coast), 1.02 (South African coast).','Mandelbrot (1982). The Fractal Geometry of Nature. W. H. Freeman.'],
 dur:12,hint:'Choose a coast and shorten the ruler. The tiles compute how much the measured length grows; the graph shows each curve’s slope, 1 − D. Real coasts follow these lines only over the range of rulers that was measured.',
 init:()=>({c:0,f:10}),
 watch(p){const k=Math.min(4,Math.floor(p*5));return {c:k,f:10}},
 ui:[{choose:D8_COASTS.map((c,i)=>[i,c[0].replace(' (Richardson’s check)','').replace('Land frontier of Germany (1900)','German frontier')]),label:'Curve',get:s=>s.c,act:'c'},{choose:[[2,'Ruler ÷ 2'],[10,'Ruler ÷ 10'],[100,'Ruler ÷ 100']],label:'Shorten the ruler',get:s=>s.f,act:'f'}],
 on:{c(s,v){s.c=clamp(Math.round(+v),0,D8_COASTS.length-1)},f(s,v){s.f=[2,10,100].includes(+v)?+v:10}},
 draw(s){
  const [name,D]=D8_COASTS[s.c],grow=Math.pow(s.f,D-1);
  let out=heading(`${name}: D = ${D8_f(D,2)}`);
  const pl=D8_plot(70,58,300,240,[0,2],[-.06,.6],{xt:[[0,'1'],[1,'1/10'],[2,'1/100']],yt:[[0,'×1'],[.3,'×'+D8_f(Math.pow(10,.3),1)],[.6,'×'+D8_f(Math.pow(10,.6),1)]],xl:'ruler, as a fraction of the starting ruler',xlDy:34});
  out+=pl.svg+TF(66,52,'measured length (relative)',13,C.muted,'start');
  D8_COASTS.forEach(([nm,d],i)=>{const sel=i===s.c;out+=L(pl.X(0),pl.Y(0),pl.X(2),pl.Y((d-1)*2),sel?C.coral:'#b8c9d5',sel?3:1.6);out+=TF(pl.X(2)+6,pl.Y((d-1)*2)+4+(i===2?8:i===1?-6:0),D8_f(d,2),13,sel?C.coral:C.muted,'start')});
  const lx=Math.log10(s.f);out+=L(pl.X(lx),pl.Y(0),pl.X(lx),pl.Y((D-1)*lx),C.purple,1.6,'stroke-dasharray="4 3"')+Ci(pl.X(lx),pl.Y((D-1)*lx),5,C.purple,'#fff');
  out+=D8_tile(410,70,172,'Slope = 1 − D',D8_f(1-D,2),C.ink)+D8_tile(410,128,172,`Ruler ÷ ${s.f}: length ×`,D8_f(grow,2),C.coral)+D8_tile(410,186,172,`Ruler ÷ ${s.f*s.f}: length ×`,D8_f(Math.pow(s.f*s.f,D-1),2),C.coral);
  out+=TF(410,262,'length ∝ ruler^(1 − D)',13,C.ink,'start')+TF(410,282,'D = 1: a smooth curve',13,C.muted,'start');
  out+=D8_note('Lines from Mandelbrot’s published D values; ruler range illustrative.',358);
  return {svg:out,phase:D===1?'For a circle the dividers cut corners less and less as the ruler shrinks, and the measured length settles on 2πr: slope 0, dimension 1. Richardson included it to check his method.':`Measured length grows as ruler^(1 − D). For the ${name.charAt(0).toLowerCase()+name.slice(1)}, with D = ${D8_f(D,2)}, dividing the ruler by ${s.f} multiplies the measured length by ${s.f}^${D8_f(D-1,2)} = ${D8_f(grow,2)}, and dividing it by ${s.f*s.f} multiplies it by ${D8_f(Math.pow(s.f*s.f,D-1),2)}. Asked “how long is it?”, the only honest answer names the ruler.`};
 }});

/* Box counting: cover the set with a grid of boxes of side ε and count the boxes that contain part of it. */
const D8_BOX_CACHE={};
function D8_shapePts(kind){if(D8_BOX_CACHE[kind])return D8_BOX_CACHE[kind];let pts=[];
 if(kind==='koch')pts=D8_koch(7).map(([x,y])=>[x,y+.02]);
 else if(kind==='sier'){const go=(a,b,c,l)=>{if(!l){pts.push(a,b,c,[(a[0]+b[0]+c[0])/3,(a[1]+b[1]+c[1])/3]);return}const m=(p,q)=>[(p[0]+q[0])/2,(p[1]+q[1])/2];go(a,m(a,b),m(a,c),l-1);go(m(a,b),b,m(b,c),l-1);go(m(a,c),m(b,c),c,l-1)};go([.0001,.0001],[.9999,.0001],[.5,.0001+.9998*Math.sqrt(3)/2],9)}
 else if(kind==='line'){for(let i=0;i<=4000;i++)pts.push([.0001+.9998*i/4000,.3+.4*i/4000])}
 else{for(let i=0;i<300;i++)for(let j=0;j<300;j++)pts.push([(i+.5)/300,(j+.5)/300])}
 return D8_BOX_CACHE[kind]=pts;}
function D8_boxCount(kind,j){const key=kind+'#'+j;if(D8_BOX_CACHE[key])return D8_BOX_CACHE[key];const m=Math.pow(2,j),set=new Set();
 for(const [x,y] of D8_shapePts(kind)){const i=Math.min(m-1,Math.floor(x*m)),k=Math.min(m-1,Math.floor(y*m));set.add(k*m+i)}return D8_BOX_CACHE[key]=set;}
const D8_SHAPES={koch:['Koch curve',()=>D8_KOCH_D,'log 4 / log 3'],sier:['Sierpiński triangle',()=>D8_SIER_D,'log 3 / log 2'],line:['Straight segment',()=>1,'1'],square:['Filled square',()=>2,'2']};
SCENE({id:'fractal-dimension-box',name:'Counting boxes',tag:'Box-counting dimension',
 definition:'Another way to measure dimension: cover the shape with a grid of square boxes of side ε and count N(ε), the boxes that touch it. Halve ε and a segment needs about twice as many boxes, a filled square four times as many: N grows like (1/ε)^D with D = 1 or 2. For a fractal the factor lies in between, and the slope of log N against log (1/ε) is its box-counting dimension.',
 example:`Halving the boxes on the Sierpiński triangle multiplies the count by about 2^${D8_f(D8_SIER_D,3)} = ${D8_f(Math.pow(2,D8_SIER_D),1)}, so D = log 3 / log 2 = ${D8_f(D8_SIER_D,3)}; on the Koch curve the count grows by about ${D8_f(Math.pow(2,D8_KOCH_D),2)} per halving, giving log 4 / log 3 = ${D8_f(D8_KOCH_D,3)}. The counts here are made by the scene from points on each shape, so the fitted slope is a measurement, close to but not exactly the formula.`,
 desc:'A shape drawn in a unit square with the grid boxes of the chosen size that contain part of it shaded, and a log–log graph of the box count against the number of boxes per side, with the fitted slope and the exact value.',
 research:['Hausdorff (1919). Dimension und äußeres Maß. Mathematische Annalen 79, 157–179 (dated 1918).','Sierpiński (1915). Sur une courbe dont tout point est un point de ramification. Comptes Rendus de l’Académie des Sciences 160, 302–305.','Falconer (1990). Fractal Geometry: Mathematical Foundations and Applications. Wiley: box-counting dimension.'],
 dur:14,hint:'Choose a shape and halve the boxes again and again. Each size adds a point to the graph; compare the fitted slope with the exact value, and try the segment and the square as checks.',
 init:()=>({k:'sier',j:4}),
 watch(p){const k=['sier','koch'][p<.5?0:1],u=(p<.5?p:p-.5)*2;return {k,j:1+Math.min(5,Math.floor(u*6))}},
 ui:[{choose:Object.entries(D8_SHAPES).map(([k,v])=>[k,v[0]]),label:'Shape',get:s=>s.k,act:'k'},{range:'j',label:'Boxes per side 2^j, j',min:1,max:6,get:s=>s.j,act:'j'}],
 on:{k(s,v){s.k=D8_SHAPES[v]?v:'sier'},j(s,v){s.j=clamp(Math.round(+v),1,6)}},
 draw(s){
  const [name,Df,form]=D8_SHAPES[s.k],m=Math.pow(2,s.j),box=D8_boxCount(s.k,s.j),x0=26,y0=58,W=264,cw=W/m;
  let out=heading(`${name}: ${box.size} of ${m*m} boxes touched`);
  out+=R(x0,y0,W,W,'#fff',C.line,0);
  for(const c of box){const i=c%m,k=Math.floor(c/m);out+=`<rect x="${fmt(x0+i*cw)}" y="${fmt(y0+W-(k+1)*cw)}" width="${fmt(cw)}" height="${fmt(cw)}" fill="${C.amberp}" stroke="${C.amber}" stroke-width="${m>16?.4:1}"/>`}
  const pts=D8_shapePts(s.k);
  if(s.k==='square')out+=R(x0,y0,W,W,'none',C.blue,0);
  else if(s.k==='sier'){const st=Math.max(1,Math.floor(pts.length/6000));for(let i=0;i<pts.length;i+=st)out+=`<rect x="${fmt(x0+pts[i][0]*W-.5)}" y="${fmt(y0+W-pts[i][1]*W-.5)}" width="1" height="1" fill="${C.blue}"/>`}
  else{const st=Math.max(1,Math.floor(pts.length/1500)),cp=[];for(let i=0;i<pts.length;i+=st)cp.push([x0+pts[i][0]*W,y0+W-pts[i][1]*W]);cp.push([x0+pts[pts.length-1][0]*W,y0+W-pts[pts.length-1][1]*W]);out+=D8_poly(cp,C.blue,1.3)}
  // log–log
  const all=range(6).map(i=>({j:i+1,n:D8_boxCount(s.k,i+1).size})),shown=all.slice(0,s.j),xy=d=>[d.j*Math.log10(2),Math.log10(d.n)];
  const lp=D8_plot(352,64,226,170,[0,2],[0,4],{xt:[[0,'1'],[Math.log10(8),'8'],[Math.log10(64),'64']],yt:[[0,'1'],[2,'100'],[4,'10⁴']],xl:'boxes per side (log scale)',xlDy:34});
  out+=lp.svg+TF(348,58,'boxes touched (log scale)',13,C.muted,'start');
  const fit=shown.length>1?D8_fit(shown.map(xy)):null,fitAll=D8_fit(all.slice(1).map(xy));
  out+=L(lp.X(0),lp.Y(0),lp.X(2),lp.Y(2*Df()),C.green,1.4,'stroke-dasharray="2 4"');
  if(fit)out+=L(lp.X(Math.log10(2)),lp.Y(fit.icept+fit.slope*Math.log10(2)),lp.X(Math.log10(64)),lp.Y(fit.icept+fit.slope*Math.log10(64)),C.purple,1.6);
  for(const d of shown){const [a,b]=xy(d);out+=Ci(lp.X(a),lp.Y(b),4,C.amber,C.ink)}
  out+=D8_tile(26,330,264,`Box side 1/${m}: boxes touched`,`${box.size}${s.j>1?`  (× ${D8_f(box.size/all[s.j-2].n,2)} on halving)`:''}`,C.amber);
  out+=D8_tile(300,330,138,'Fitted slope',fit?D8_f(fit.slope,3):'need 2',C.purple)+D8_tile(446,330,136,'Exact: '+form,D8_f(Df(),3),C.green);
  return {svg:out,phase:`With ${m} boxes to a side, ${box.size} boxes contain part of the ${name.replace(/^(Straight|Filled)/,w=>w.toLowerCase())}. ${fit?`The line through the counts so far has slope ${D8_f(fit.slope,3)}; over boxes from 1/4 to 1/64 it is ${D8_f(fitAll.slope,3)}, against the exact ${form} = ${D8_f(Df(),3)} (dotted green).`:'Halve the boxes to start the graph.'} The small difference comes from the coarsest boxes, where the shape’s edges and the grid’s position matter most.`};
 }});

/* Similarity dimension: a shape made of N copies of itself, each scaled by 1/s, has D = log N / log s. */
const D8_SELF={
 cantor:{name:'Cantor set',maps:[[0,0],[2/3,0]].map(([x,y])=>({x,y,f:1/3})),h:.06},
 koch:{name:'Koch curve',maps:null},
 sier:{name:'Sierpiński triangle',maps:[[0,0],[.5,0],[.25,Math.sqrt(3)/4]].map(([x,y])=>({x,y,f:.5}))},
 carpet:{name:'Sierpiński carpet',maps:range(9).filter(i=>i!==4).map(i=>({x:(i%3)/3,y:Math.floor(i/3)/3,f:1/3}))},
 square:{name:'Square',maps:range(4).map(i=>({x:(i%2)/2,y:Math.floor(i/2)/2,f:.5}))},
};
// The pieces at level k: squares [x,y,size] (or Koch segments).
function D8_pieces(kind,k){if(kind==='koch'){const p=D8_koch(k);return range(p.length-1).map(i=>[p[i],p[i+1]])}
 let ps=[[0,0,1]];for(let l=0;l<k;l++){const nx=[];for(const [x,y,z] of ps)for(const m of D8_SELF[kind].maps)nx.push([x+m.x*z,y+m.y*z,z*m.f]);ps=nx}return ps}
SCENE({id:'fractal-dimension-similarity',name:'Copies of itself: log N / log s',tag:'Hausdorff, 1918',
 definition:'A segment is two half-size copies of itself, a square four, a cube eight: N = s^D copies when each is scaled by 1/s, so D = log N / log s. The same rule gives fractional values for shapes built from scaled copies of themselves. Felix Hausdorff’s definition of 1918, published in 1919, makes sense of such dimensions for any set: the D-dimensional size of the set is finite and non-zero only for one value of D.',
 example:'At each level the Koch curve has 4 times as many pieces, each a third as long. Measured as a length (d = 1) the total grows as (4/3)^k, without limit; measured as an area (d = 2) it shrinks to nothing. Only for d = log 4 / log 3 does pieces × size^d stay the same at every level.',
 desc:'A self-similar shape drawn to the chosen level, with the number of pieces and their size counted from the drawing, the dimension log N / log s, and a table of pieces × size^d at that level for d = 1, d = D and d = 2.',
 research:['Hausdorff (1919). Dimension und äußeres Maß. Mathematische Annalen 79, 157–179.','Cantor (1883). Über unendliche, lineare Punktmannichfaltigkeiten, part 5. Mathematische Annalen 21, 545–591: the middle-thirds set.','Sierpiński (1916). Sur une courbe cantorienne qui contient une image biunivoque et continue de toute courbe donnée. Comptes Rendus 162, 629–632: the carpet.'],
 dur:14,hint:'Choose a shape and raise the level. The tiles count the pieces in the drawing; the table shows that only one exponent d keeps pieces × size^d constant from level to level.',
 init:()=>({k:'koch',l:3}),
 watch(p){const order=['cantor','koch','sier','carpet'],i=Math.min(3,Math.floor(p*4));return {k:order[i],l:1+Math.min(3,Math.floor((p*4-i)*4))}},
 ui:[{choose:Object.entries(D8_SELF).map(([k,v])=>[k,v.name]),label:'Shape',get:s=>s.k,act:'k'},{range:'l',label:'Level',min:0,max:5,get:s=>s.l,act:'l'}],
 on:{k(s,v){s.k=D8_SELF[v]?v:'koch'},l(s,v){s.l=clamp(Math.round(+v),0,5)}},
 draw(s){
  const kind=s.k,lvl=kind==='carpet'?Math.min(s.l,4):s.l,P=D8_pieces(kind,lvl),P1=D8_pieces(kind,1);
  const N=P1.length,size1=kind==='koch'?Math.hypot(P1[0][1][0]-P1[0][0][0],P1[0][1][1]-P1[0][0][1]):P1[0][2],sInv=1/size1,D=Math.log(N)/Math.log(sInv);
  const size=kind==='koch'?Math.hypot(P[0][1][0]-P[0][0][0],P[0][1][1]-P[0][0][1]):P[0][2];
  let out=heading(`${D8_SELF[kind].name}: ${N} copies at 1/${D8_f(sInv,0)}, D = ${D8_f(D,3)}`);
  const x0=30,W=300,y0=kind==='koch'?150:kind==='cantor'?170:60;out+=R(18,50,324,276,'#fff',C.grid,8);
  if(kind==='koch'){out+=D8_poly(D8_koch(lvl).map(([x,y])=>[x0+x*W,y0+60-y*W]),C.blue,1.4)}
  else if(kind==='cantor'){for(const [x] of P)out+=R(x0+x*W,y0,Math.max(.6,size*W),24,C.blue,'none',0);out+=TF(180,y0+52,'each bar is drawn 24 units tall to be visible',13,C.muted)}
  else for(const [x,y] of P){out+=kind==='sier'?`<polygon points="${fmt(x0+x*W)},${fmt(y0+W*.88-y*W)} ${fmt(x0+(x+size)*W)},${fmt(y0+W*.88-y*W)} ${fmt(x0+(x+size/2)*W)},${fmt(y0+W*.88-(y+size*Math.sqrt(3)/2)*W)}" fill="${C.blue}"/>`:`<rect x="${fmt(x0+x*W*.86)}" y="${fmt(y0+W*.86-(y+size)*W*.86)}" width="${fmt(size*W*.86)}" height="${fmt(size*W*.86)}" fill="${C.blue}"/>`}
  if(kind==='carpet'&&s.l>4)out+=TF(180,316,'drawn at level 4',13,C.muted);
  // table
  out+=D8_tile(356,54,110,'Pieces now',D8_group(P.length),C.ink)+D8_tile(472,54,110,'Each of size',size<.01?D8_sci(size,2):D8_f(size,4),C.ink);
  out+=TBF(356,134,'pieces × size^d at level '+lvl,13,C.ink,'start');
  const rows=[[1,'d = 1 (length)'],[D,`d = ${D8_f(D,3)}`],[2,'d = 2 (area)']];
  rows.forEach(([d,lab],i)=>{const v=P.length*Math.pow(size,d),y=160+i*30;out+=R(352,y-18,230,26,i===1?C.greenp:'#fff',C.grid,5)+TF(362,y,lab,13,i===1?C.green:C.ink,'start')+TBF(572,y,v>=1e4||v<1e-3&&v>0?D8_sci(v,2):D8_f(v,4),13,i===1?C.green:C.ink,'end')});
  out+=TF(356,262,`log ${N} / log ${D8_f(sInv,0)} = ${D8_f(D,4)}`,13,C.purple,'start');
  out+=TF(356,284,'N and s are counted from',13,C.muted,'start')+TF(356,302,'the level-1 drawing.',13,C.muted,'start');
  return {svg:out,phase:`Level ${lvl} has ${D8_group(P.length)} pieces, each ${size<.01?D8_sci(size,2):D8_f(size,4)} across. Adding their sizes as lengths gives ${D8_f(P.length*size,3)}${N>sInv?', growing with every level':N<sInv?', shrinking with every level':''}; as areas, ${D8_f(P.length*size*size,4)}. Raised to the power D = ${D8_f(D,3)} the total is ${D8_f(P.length*Math.pow(size,D),4)} at every level. That exponent is the dimension.`};
 }});

/* ===================== Lesson: persistent-homology ===================== */
// Homology over the two-element field: b₀ by union–find, b₁ = E − V + b₀ − rank ∂₂, b₂ = F − rank ∂₂ (no 3-cells here).
function D8_uf(n){const p=range(n);const f=x=>{while(p[x]!==x){p[x]=p[p[x]];x=p[x]}return x};return {find:f,join(a,b){a=f(a);b=f(b);if(a===b)return false;p[a]=b;return true}}}
// Symmetric difference of two sorted index arrays (adding columns mod 2).
function D8_xor(a,b){const out=[];let i=0,j=0;while(i<a.length||j<b.length){if(j>=b.length||(i<a.length&&a[i]<b[j]))out.push(a[i++]);else if(i>=a.length||b[j]<a[i])out.push(b[j++]);else{i++;j++}}return out}
// Rank of a 0/1 matrix given as columns of sorted row indices, by column reduction.
function D8_rank(cols){const owner=new Map();let r=0;for(let c of cols){c=c.slice();while(c.length&&owner.has(c[c.length-1]))c=D8_xor(c,owner.get(c[c.length-1]));if(c.length){owner.set(c[c.length-1],c);r++}}return r}
function D8_betti(V,edges,tris){const uf=D8_uf(V);let b0=V;for(const [a,b] of edges)if(uf.join(a,b))b0--;
 const eix=new Map(edges.map((e,i)=>[Math.min(...e)+'-'+Math.max(...e),i]));const r2=D8_rank(tris.map(([a,b,c])=>[eix.get(Math.min(a,b)+'-'+Math.max(a,b)),eix.get(Math.min(a,c)+'-'+Math.max(a,c)),eix.get(Math.min(b,c)+'-'+Math.max(b,c))].sort((x,y)=>x-y)));
 return {b0,b1:edges.length-V+b0-r2,b2:tris.length-r2};}
// A small complex: a hexagon with a centre (0–6) and a separate pair (7, 8).
const D8_HX=[...range(6).map(i=>[Math.cos(i*Math.PI/3),Math.sin(i*Math.PI/3)]),[0,0],[2.05,.75],[2.05,-.55]];
const D8_HE=[...range(6).map(i=>[i,(i+1)%6]),...range(6).map(i=>[i,6]),[7,8]];
const D8_HT=range(6).map(i=>[i,(i+1)%6,6]);
const D8_HPRESET={ring:[[0,1,2,3,4,5],[]],fan:[[6,7,8,9,10,11],[]],part:[[0,1,2,3,4,5,6,7,8,12],[0,1]],full:[[...range(13)],[...range(6)]],none:[[],[]]};
const D8_hexState=k=>({e:D8_HPRESET[k][0].slice(),t:D8_HPRESET[k][1].slice(),preset:k});
SCENE({id:'persistent-homology',name:'Betti numbers count holes',tag:'Betti 1871, Poincaré 1895, Noether 1925',
 definition:'Build a shape from points, edges and filled triangles. Its Betti numbers count its features of each dimension: b₀ the separate pieces, b₁ the independent loops that are not filled in, b₂ the enclosed hollows. Enrico Betti (1871) and Henri Poincaré (1895) introduced these counts; Emmy Noether, around 1925, saw that they are the sizes of groups, the homology groups, which turned counting into algebra. They also explain Euler’s count: V − E + F = b₀ − b₁ + b₂.',
 example:'A closed ring of edges has one loop, so b₁ = 1, while the lone centre point and the separate pair still count as pieces of their own. Fill every triangle round the centre and the loop disappears. An edge from the ring to the centre makes no new loop by itself; a loop appears only when a second path closes round an unfilled region.',
 desc:'Nine points joined by chosen edges and filled triangles, with the Betti numbers b₀, b₁ and b₂ computed from the complex and Euler’s count V − E + F checked against b₀ − b₁ + b₂.',
 research:['Betti (1871). Sopra gli spazi di un numero qualunque di dimensioni. Annali di Matematica Pura ed Applicata 4, 140–158.','Poincaré (1895). Analysis situs. Journal de l’École Polytechnique 1, 1–121.','Noether (1925). Ableitung der Elementarteilertheorie aus der Gruppentheorie. Jahresbericht der DMV 34, 104 (abstract of a talk); Hopf (1928), Eine Verallgemeinerung der Euler-Poincaréschen Formel, Göttinger Nachrichten, credits her with the group view.'],
 dur:12,hint:'Press an edge to add or remove it, and press inside a triangle to fill or empty it. Watch b₀ and b₁ change, and check that V − E + F always equals b₀ − b₁ + b₂.',
 init:()=>D8_hexState('ring'),
 watch(p){const order=['none','ring','fan','part','full'];return D8_hexState(order[Math.min(4,Math.floor(p*5))])},
 ui:[{choose:[['none','Points only'],['ring','Ring'],['fan','Spokes'],['part','Two triangles'],['full','All filled']],label:'Start from',get:s=>s.preset,act:'preset'}],
 on:{preset(s,v){Object.assign(s,D8_hexState(D8_HPRESET[v]?v:'ring'))},
  edge(s,v){const i=clamp(Math.round(+v),0,D8_HE.length-1);s.preset='';if(s.e.includes(i)){s.e=s.e.filter(x=>x!==i);s.t=s.t.filter(t=>!D8_HT[t].some((a,k,arr)=>{const b=arr[(k+1)%3],e=D8_HE[i];return (e[0]===a&&e[1]===b)||(e[0]===b&&e[1]===a)}))}else s.e.push(i)},
  tri(s,v){const t=clamp(Math.round(+v),0,5);s.preset='';if(s.t.includes(t))s.t=s.t.filter(x=>x!==t);else{s.t.push(t);const [a,b,c]=D8_HT[t];for(const [p,q] of [[a,b],[b,c],[a,c]]){const i=D8_HE.findIndex(e=>(e[0]===p&&e[1]===q)||(e[0]===q&&e[1]===p));if(!s.e.includes(i))s.e.push(i)}}}},
 draw(s,f,X){
  const V=D8_HX.length,E=s.e.map(i=>D8_HE[i]),F=s.t.map(i=>D8_HT[i]),B=D8_betti(V,E,F),cx=170,cy=190,sc=92,S=p=>[cx+p[0]*sc,cy-p[1]*sc];
  let out=heading(`b₀ = ${B.b0} piece${B.b0===1?'':'s'}, b₁ = ${B.b1} loop${B.b1===1?'':'s'}`);
  out+=R(18,50,344,270,'#fff',C.grid,8);
  D8_HT.forEach((t,i)=>{const on=s.t.includes(i),pts=t.map(k=>S(D8_HX[k])),c=[(pts[0][0]+pts[1][0]+pts[2][0])/3,(pts[0][1]+pts[1][1]+pts[2][1])/3];
   out+=hit(X,'tri',i,`Triangle ${i+1}: ${on?'filled':'empty'}`,`<polygon points="${pts.map(q=>fmt(q[0])+','+fmt(q[1])).join(' ')}" fill="${on?C.greenp:'#fbfcfd'}" stroke="none"/>`+(on?'':Ci(c[0],c[1],3,C.grid)))});
  D8_HE.forEach((e,i)=>{const on=s.e.includes(i),a=S(D8_HX[e[0]]),b=S(D8_HX[e[1]]);out+=hit(X,'edge',i,`Edge ${i+1}: ${on?'present':'absent'}`,L(a[0],a[1],b[0],b[1],'transparent',14)+L(a[0],a[1],b[0],b[1],on?C.blue:'#dfe6eb',on?3.4:2,on?'':'stroke-dasharray="3 4"'))});
  D8_HX.forEach(p=>{const q=S(p);out+=Ci(q[0],q[1],6,C.ink,'#fff')});
  const chi=V-E.length+F.length;
  out+=D8_tile(376,58,100,'Pieces b₀',String(B.b0),C.blue)+D8_tile(482,58,100,'Loops b₁',String(B.b1),C.coral);
  out+=D8_tile(376,112,206,'Hollows b₂ (none in a plane)',String(B.b2),C.ink);
  out+=TBF(380,192,'Euler check',13,C.ink,'start')+TF(380,214,`V − E + F = ${V} − ${E.length} + ${F.length} = ${chi}`,13,C.ink,'start')+TF(380,236,`b₀ − b₁ + b₂ = ${B.b0} − ${B.b1} + ${B.b2} = ${B.b0-B.b1+B.b2}`,13,C.ink,'start')+TB(380,262,chi===B.b0-B.b1+B.b2?'✓ equal':'✕ differ',14,chi===B.b0-B.b1+B.b2?C.green:C.coral,'start');
  out+=D8_note('Dashed: edges to add. Grey dots: triangles to fill.',350);
  return {svg:out,phase:`${V} points, ${E.length} edge${E.length===1?'':'s'} and ${F.length} filled triangle${F.length===1?'':'s'}. Union–find joins the pieces: b₀ = ${B.b0}. Each edge either joins two pieces or closes a loop, and each filled triangle either fills a loop or encloses a hollow, so b₁ = E − V + b₀ − (triangles that fill loops) = ${B.b1}. Hence V − E + F = b₀ − b₁ + b₂ = ${chi}.`};
 }});

/* Persistent homology of a Vietoris–Rips complex: an edge at its length, a triangle at its longest edge.
   Columns are reduced in filtration order over the two-element field; each pairing gives a bar [birth, death). */
function D8_persist(pts){const n=pts.length,d=(i,j)=>Math.hypot(pts[i][0]-pts[j][0],pts[i][1]-pts[j][1]);const simp=[];
 for(let i=0;i<n;i++)simp.push({dim:0,v:[i],t:0});
 for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)simp.push({dim:1,v:[i,j],t:d(i,j)});
 for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)for(let k=j+1;k<n;k++)simp.push({dim:2,v:[i,j,k],t:Math.max(d(i,j),d(i,k),d(j,k))});
 simp.sort((a,b)=>a.t-b.t||a.dim-b.dim);const idx=new Map(simp.map((s,i)=>[s.v.join(','),i]));
 const owner=new Map(),bars=[];const paired=new Uint8Array(simp.length);
 simp.forEach((s,j)=>{if(!s.dim)return;let col=s.dim===1?[idx.get(''+s.v[0]),idx.get(''+s.v[1])]:[idx.get(s.v[0]+','+s.v[1]),idx.get(s.v[0]+','+s.v[2]),idx.get(s.v[1]+','+s.v[2])];col.sort((a,b)=>a-b);
  while(col.length&&owner.has(col[col.length-1]))col=D8_xor(col,owner.get(col[col.length-1]));
  if(col.length){const lo=col[col.length-1];owner.set(lo,col);paired[lo]=1;paired[j]=1;if(s.t-simp[lo].t>1e-9)bars.push({dim:simp[lo].dim,b:simp[lo].t,d:s.t})}});
 simp.forEach((s,j)=>{if(!paired[j]&&s.dim<2)bars.push({dim:s.dim,b:s.t,d:Infinity})});
 return bars.sort((a,b)=>(b.d-b.b)-(a.d-a.b));}
// Rips complex at scale ε (edges no longer than ε) for drawing and counting.
function D8_rips(pts,eps){const n=pts.length,ok=(i,j)=>Math.hypot(pts[i][0]-pts[j][0],pts[i][1]-pts[j][1])<=eps+1e-12,E=[],F=[];
 for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(ok(i,j)){E.push([i,j]);for(let k=j+1;k<n;k++)if(ok(i,k)&&ok(j,k))F.push([i,j,k])}return {E,F}}
const D8_PH_CACHE={};
function D8_cloud(kind,noise,seed=9){const key=[kind,noise,seed].join(',');if(D8_PH_CACHE[key])return D8_PH_CACHE[key];const r=D8_rng(seed+Math.round(noise*1000)),pts=[];
 if(kind==='circle'){for(let i=0;i<18;i++){const a=2*Math.PI*(i+.3*r())/18;pts.push([Math.cos(a)+noise*D8_gauss(r),Math.sin(a)+noise*D8_gauss(r)])}}
 else if(kind==='two'){for(const [cx,rad] of [[-1.05,.8],[1.1,.62]])for(let i=0;i<13;i++){const a=2*Math.PI*(i+.3*r())/13;pts.push([cx+rad*Math.cos(a)+noise*D8_gauss(r),rad*Math.sin(a)+noise*D8_gauss(r)])}}
 else{for(let i=0;i<22;i++)pts.push([(r()*2-1)*1.15,(r()*2-1)*1.15])}
 const bars=D8_persist(pts);return D8_PH_CACHE[key]={pts,bars};}
// Draw a barcode: H₀ bars thin and blue, H₁ bars thick and coral, cut at the current scale if given.
function D8_barcode(bars,x0,y0,w,h,tmax,eps){const X=t=>x0+Math.min(t,tmax)/tmax*w;let out=R(x0,y0,w,h,'#fff',C.grid,4);
 const h0=bars.filter(b=>b.dim===0),h1=bars.filter(b=>b.dim===1),rows0=Math.min(h0.length,22),gap0=Math.min(5,(h*.5)/rows0);
 h0.slice(0,rows0).forEach((b,i)=>{const y=y0+6+i*gap0,end=eps===undefined?b.d:Math.min(b.d,eps);if(end>b.b)out+=L(X(b.b),y,X(end),y,C.blue,2.2,'stroke-linecap="butt"');if(b.d===Infinity&&(eps===undefined||eps>=tmax))out+=TF(X(tmax)+2,y+4,'→',13,C.blue,'start')});
 const y1=y0+12+rows0*gap0;h1.slice(0,8).forEach((b,i)=>{const y=y1+8+i*9;const end=eps===undefined?b.d:Math.min(b.d,eps);if(end>b.b)out+=L(X(b.b),y,X(end),y,C.coral,5,'stroke-linecap="butt"')});
 for(const t of [0,.5,1,1.5,2].filter(t=>t<=tmax))out+=L(X(t),y0+h,X(t),y0+h+4,C.line,1)+TF(X(t),y0+h+17,t===0?'0':D8_f(t,1),13,C.muted);
 if(eps!==undefined)out+=L(X(eps),y0,X(eps),y0+h,C.purple,1.6,'stroke-dasharray="4 3"');
 return out;}
SCENE({id:'persistent-homology-radius',name:'Growing balls round the points',tag:'Edelsbrunner, Letscher & Zomorodian 2002',
 definition:'A cloud of points has no holes by itself: it is just points. Persistent homology joins any two points closer than a scale ε, fills any triangle whose three sides are joined (the Vietoris–Rips complex), and computes the Betti numbers at every scale at once. As ε grows, pieces merge and loops are born and later filled. Each feature is recorded as a bar from the scale where it is born to the scale where it dies; the set of bars is the barcode.',
 example:`${D8_cloud('circle',.12).pts.length} points scattered round a circle with a little noise. At small scales they are separate pieces and the blue bars end one by one as pieces merge. Soon after the ring closes, a loop is born; it survives until ε is large enough for triangles to reach across the middle. That long coral bar is the circle. Short coral bars, when there are any, are small loops that close and fill almost at once.`,
 desc:'A noisy ring of points with balls of radius ε/2 round them, the edges and filled triangles of the complex at scale ε, and the barcode computed for all scales with a dashed line at the current one.',
 research:['Edelsbrunner, Letscher & Zomorodian (2002). Topological persistence and simplification. Discrete & Computational Geometry 28, 511–533 (conference version 2000).','Zomorodian & Carlsson (2005). Computing persistent homology. Discrete & Computational Geometry 33, 249–274.','Ghrist (2008). Barcodes: the persistent topology of data. Bulletin of the American Mathematical Society 45, 61–75.'],
 dur:14,hint:'Move ε and watch the balls overlap. Count the pieces and loops at each scale and match them with the bars that cross the dashed line.',
 init:()=>({eps:.6}),
 watch(p){return {eps:Math.round(p*1.8*20)/20}},
 ui:[{range:'eps',label:'Scale ε',min:0,max:180,step:5,get:s=>Math.round(s.eps*100),act:'eps',show:v=>D8_f(v/100,2)}],
 on:{eps(s,v){s.eps=clamp(Math.round(+v/5)*5,0,180)/100}},
 draw(s){
  const {pts,bars}=D8_cloud('circle',.12),{E,F}=D8_rips(pts,s.eps),B=D8_betti(pts.length,E,F),cx=150,cy=190,sc=100,S=p=>[cx+p[0]*sc,cy-p[1]*sc];
  const alive=d=>bars.filter(b=>b.dim===d&&b.b<=s.eps+1e-12&&b.d>s.eps+1e-12).length;
  let out=heading(`ε = ${D8_f(s.eps,2)}: ${B.b0} piece${B.b0===1?'':'s'}, ${B.b1} loop${B.b1===1?'':'s'}`);
  out+=R(18,50,264,280,'#fff',C.grid,8);
  let balls='';for(const p of pts){const q=S(p);balls+=Ci(q[0],q[1],s.eps/2*sc,'#e6f0f8','none','opacity=".7"')}
  out+='<clipPath id="d8-ph-clip"><rect x="20" y="52" width="260" height="276" rx="7"/></clipPath>'+G(balls,'clip-path="url(#d8-ph-clip)"');
  for(const t of F){const q=t.map(k=>S(pts[k]));out+=`<polygon points="${q.map(v=>fmt(v[0])+','+fmt(v[1])).join(' ')}" fill="${C.greenp}" stroke="none"/>`}
  for(const [a,b] of E){const p=S(pts[a]),q=S(pts[b]);out+=L(p[0],p[1],q[0],q[1],C.blue,1.6)}
  for(const p of pts){const q=S(p);out+=Ci(q[0],q[1],3.6,C.ink)}
  const tmax=1.8;out+=TF(300,56,'barcode: blue pieces, coral loops',13,C.muted,'start')+D8_barcode(bars,300,64,280,200,tmax,s.eps)+TF(440,300,'scale ε',13,C.muted);
  out+=D8_tile(300,312,136,'Bars crossing ε',`${alive(0)} blue, ${alive(1)} coral`,C.purple)+D8_tile(444,312,138,'Betti at ε',`b₀ ${B.b0}, b₁ ${B.b1}`,C.ink);
  const long=bars.filter(b=>b.dim===1)[0];
  return {svg:out,phase:`At ε = ${D8_f(s.eps,2)} the complex has ${E.length} edges and ${F.length} filled triangles; computed directly it has b₀ = ${B.b0} and b₁ = ${B.b1}, the same as the number of bars of each colour that cross the dashed line. ${long?`The longest loop bar runs from ${D8_f(long.b,2)} to ${D8_f(long.d,2)}: that is the ring.`:''}`};
 }});

SCENE({id:'persistent-homology-noise',name:'Long bars, short bars',tag:'Evidence, not proof',
 definition:'The barcode does not say which features are real; it says how long each one lasts as the scale changes. Features that persist over a wide range of scales are robust: if no point moves by more than a small distance δ, the barcode changes by at most 2δ, in a precise matching sense (the stability theorem). Short bars can come from noise. Gunnar Carlsson’s survey “Topology and data” (2009) set out this programme for data analysis.',
 example:'A noisy circle gives one long loop bar; two circles give two; points thrown at random into a square give only short ones. Turn up the noise and the long bars shrink until nothing stands out. The answer also depends on choices made before any computation: which distance to use, and which range of scales to trust.',
 desc:'A point cloud of the chosen kind and noise level beside its full barcode, with tiles for the two longest loop bars and how many times longer the longest is than the next.',
 research:['Carlsson (2009). Topology and data. Bulletin of the American Mathematical Society 46, 255–308.','Cohen-Steiner, Edelsbrunner & Harer (2007). Stability of persistence diagrams. Discrete & Computational Geometry 37, 103–120.','Vietoris (1927). Über den höheren Zusammenhang kompakter Räume und eine Klasse von zusammenhangstreuen Abbildungen. Mathematische Annalen 97, 454–472.'],
 dur:12,hint:'Choose a cloud and raise the noise. Watch the longest coral bars: when does the loop stop standing out from the short bars?',
 init:()=>({kind:'two',noise:.1}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return [{kind:'circle',noise:.05},{kind:'circle',noise:.3},{kind:'two',noise:.08},{kind:'random',noise:0}][k]},
 ui:[{choose:[['circle','One circle'],['two','Two circles'],['random','Random points']],label:'Cloud',get:s=>s.kind,act:'kind'},{range:'noise',label:'Noise',min:0,max:40,step:5,get:s=>Math.round(s.noise*100),act:'noise',show:v=>D8_f(v/100,2)}],
 on:{kind(s,v){s.kind=['circle','two','random'].includes(v)?v:'circle'},noise(s,v){s.noise=clamp(Math.round(+v/5)*5,0,40)/100}},
 draw(s){
  const noise=s.kind==='random'?0:s.noise,{pts,bars}=D8_cloud(s.kind,noise),h1=bars.filter(b=>b.dim===1),L1=h1[0]?h1[0].d-h1[0].b:0,L2=h1[1]?h1[1].d-h1[1].b:0,L3=h1[2]?h1[2].d-h1[2].b:0;
  const big=s.kind==='two'?L2:L1,next=s.kind==='two'?L3:L2;
  let out=heading(s.kind==='random'?'Random points: only short loop bars':`${s.kind==='two'?'Two circles':'One circle'}, noise ${D8_f(noise,2)}`);
  const ext=Math.max(...pts.map(p=>Math.max(Math.abs(p[0]),Math.abs(p[1])))),sc=118/Math.max(1.2,ext),cx=150,cy=186;
  out+=R(18,50,264,272,'#fff',C.grid,8);for(const p of pts)out+=Ci(cx+p[0]*sc,cy-p[1]*sc,4,C.ink);
  out+=L(30,306,30+.5*sc,306,C.ink,2)+TF(36+.5*sc,311,'0.5',13,C.ink,'start');
  out+=TF(300,56,'barcode: blue pieces, coral loops',13,C.muted,'start')+D8_barcode(bars,300,64,280,200,2)+TF(440,300,'scale ε',13,C.muted);
  out+=D8_tile(300,312,136,'Longest loop bars',h1.length?`${D8_f(L1,2)}, ${D8_f(L2,2)}`:'none',C.coral)+D8_tile(444,312,138,s.kind==='two'?'2nd ÷ 3rd longest':'1st ÷ 2nd longest',next>1e-9?D8_f(big/next,1)+' ×':'—',C.purple);
  return {svg:out,phase:`${pts.length} points give ${h1.length} loop bar${h1.length===1?'':'s'}. ${s.kind==='random'?`The longest lasts only ${D8_f(L1,2)}: loops among random points close and fill almost at once, so nothing stands out.`:`The ${s.kind==='two'?'two longest last':'longest lasts'} ${s.kind==='two'?`${D8_f(L1,2)} and ${D8_f(L2,2)}`:D8_f(L1,2)}, ${next>1e-9?`${D8_f(big/next,1)} times the next one`:'with no other loops at all'}. A long bar is evidence of a loop in whatever the points were sampled from, not proof: it depends on the distance and the scales chosen, and enough noise erases it.`}`};
 }});

/* ===================== Lesson: extra-dimensions ===================== */
// A walker on a tube: position along the tube x and angle round it; on the unrolled strip its path is a straight line
// whose top and bottom edges are glued. Viewed at a zoom of z drawing units per unit length.
SCENE({id:'extra-dimensions',name:'A thin tube looks like a line',tag:'Hiding a dimension by making it small',
 definition:'The surface of a garden hose is two-dimensional: a point on it needs a distance along the hose and an angle round it. From across the garden the hose looks like a line, because its circumference is too small to see. This is the picture behind every proposal of extra dimensions in physics: space could have more directions than three if the extra ones are curled up so small that nothing we can measure has resolved them.',
 example:'A walker heading slightly round the tube winds round it again and again. On the unrolled strip its path is a straight line that leaves the top edge and comes back at the bottom, the same gluing as in the torus lessons. Zoom out until the tube is thinner than the finest detail you can see, and the walker seems to move along a line, with its motion round the tube invisible.',
 desc:'Above, a tube seen from the side at the chosen zoom with a walker on it; below, the tube cut open into a strip with glued top and bottom edges and the walker’s straight path; tiles give the tube’s width on screen and how many dimensions it shows.',
 research:['Klein (1926). Quantentheorie und fünfdimensionale Relativitätstheorie. Zeitschrift für Physik 37, 895–906: the extra dimension as a tiny circle.','Abbott (1884). Flatland: the same analogy, one dimension down.'],
 dur:12,hint:'Zoom out and watch the tube shrink to a line, then change the circumference and the walker’s heading. The strip below always shows both dimensions.',
 init:()=>({zoom:60,c:1,head:20}),
 watch(p){return {zoom:Math.round(lerp(80,2,smooth(p))),c:1,head:20,t:p}},
 ui:[{range:'zoom',label:'Zoom (pixels per unit)',min:1,max:100,get:s=>s.zoom,act:'zoom'},{range:'c',label:'Circumference',min:1,max:20,get:s=>Math.round(s.c*10),act:'c',show:v=>D8_f(v/10,1)},{range:'head',label:'Heading round the tube',min:0,max:60,step:5,get:s=>s.head,act:'head',show:v=>v+'°'}],
 on:{zoom(s,v){s.zoom=clamp(Math.round(+v),1,100)},c(s,v){s.c=clamp(Math.round(+v),1,20)/10},head(s,v){s.head=clamp(Math.round(+v/5)*5,0,60)}},
 draw(s,f,X){
  const z=s.zoom,rad=s.c/(2*Math.PI),wpx=2*rad*z,t=s.t===undefined?1:s.t,len=8,dist=len*t,hx=dist*Math.cos(D8_rad(s.head)),hy=dist*Math.sin(D8_rad(s.head));
  const seen=wpx>=2?2:1,cy=110,x0=40,xw=520;
  let out=heading(seen===2?`Tube ${D8_f(wpx,1)} px wide: two dimensions visible`:`Tube ${D8_f(wpx,2)} px wide: it looks like a line`);
  out+=R(18,50,564,120,'#fff',C.grid,8);
  // the tube from the side: visible length xw/z units, centred on the walker’s start
  const vis=xw/z,X0=-vis*.1,sx=v=>x0+(v-X0)*z;
  if(wpx>=2){out+=R(x0,cy-wpx/2,xw,wpx,C.pale,'none',0)+L(x0,cy-wpx/2,x0+xw,cy-wpx/2,C.blue,1.6)+L(x0,cy+wpx/2,x0+xw,cy+wpx/2,C.blue,1.6);
   for(let u=Math.ceil(X0/.5)*.5;u<X0+vis&&wpx>6;u+=Math.max(.5,8/z))out+=`<ellipse cx="${fmt(sx(u))}" cy="${cy}" rx="${fmt(Math.min(8,wpx*.18))}" ry="${fmt(wpx/2)}" fill="none" stroke="#b9cfdf" stroke-width="1"/>`}
  else out+=L(x0,cy,x0+xw,cy,C.blue,2);
  // the walker's path on the visible side
  if(wpx>=6){const pts=[];for(let i=0;i<=200;i++){const d=dist*i/200,x=d*Math.cos(D8_rad(s.head)),a=2*Math.PI*D8_mod(d*Math.sin(D8_rad(s.head)),s.c)/s.c;pts.push({x:sx(x),y:cy-Math.sin(a)*wpx/2,front:Math.cos(a)>0})}
   let run=[];for(let i=0;i<pts.length;i++){if(i&&pts[i].front!==pts[i-1].front){out+=D8_poly(run,pts[i-1].front?C.coral:'#e8b4a6',pts[i-1].front?2:1.2,pts[i-1].front?'':'stroke-dasharray="3 3"');run=[]}run.push([pts[i].x,pts[i].y])}out+=D8_poly(run,pts[pts.length-1].front?C.coral:'#e8b4a6',2)}
  const wa=2*Math.PI*D8_mod(hy,s.c)/s.c,wxp=sx(hx),wyp=cy-(wpx>=2?Math.sin(wa)*wpx/2:0);if(wxp<=x0+xw)out+=Ci(wxp,wyp,5,C.coral,'#fff');
  out+=TF(30,68,`side view, ${D8_f(vis,1)} units across`,13,C.muted,'start');
  // the unrolled strip
  const su=55,sx0=86,sw=len*su,sh=s.c*su,sy0=294-sh,SX=v=>sx0+v*su,SY=v=>sy0+sh-v*su;
  out+=R(sx0,sy0,sw,sh,'#fbfcfd',C.line,0)+arrow(sx0+sw*.45,sy0,sx0+sw*.55,sy0,C.blue,2.4,9)+arrow(sx0+sw*.45,sy0+sh,sx0+sw*.55,sy0+sh,C.blue,2.4,9);
  out+=TF(sx0,sy0-8,'cut open, to scale: top and bottom edges glued',13,C.muted,'start')+TF(sx0+sw,sy0+sh+17,`along (0 to ${len})`,13,C.muted,'end')+TF(sx0-6,sy0+sh/2+4,'round',13,C.muted,'end');
  const sp=[];for(let i=0;i<=300;i++){const d=dist*i/300;sp.push([SX(d*Math.cos(D8_rad(s.head))),SY(D8_mod(d*Math.sin(D8_rad(s.head)),s.c))])}
  out+=D8_wrapLine(sp,sh,C.coral,2)+Ci(SX(hx),SY(D8_mod(hy,s.c)),5,C.coral,'#fff');
  const turns=hy/s.c;
  out+=D8_tile(18,318,180,'Width on screen',`${D8_f(wpx,wpx<1?2:1)} px`,C.blue)+D8_tile(206,318,180,'Dimensions you can see',String(seen),seen===2?C.green:C.coral)+D8_tile(394,318,188,'Times round the tube',D8_f(turns,1),C.coral);
  return {svg:out,phase:`The tube has circumference ${D8_f(s.c,1)}, so at ${z} pixels per unit it is ${D8_f(wpx,2)} pixels wide. ${seen===2?'You can see its width, so it is visibly a surface.':'That is thinner than a pixel can show, so it looks like a line, a one-dimensional space.'} The walker has gone ${D8_f(dist*Math.cos(D8_rad(s.head)),2)} along it and ${D8_f(turns,1)} times round; ${seen===2?'both motions are visible.':'only the motion along it is visible, though the walker still needs two numbers to say where it is.'}`};
 }});

/* Counting the components of the metric: a symmetric n × n array has n(n + 1)/2 independent entries. */
const D8_metricN=n=>n*(n+1)/2;
SCENE({id:'extra-dimensions-kaluza',name:'Five dimensions hold gravity and light',tag:'Nordström 1914, Kaluza 1921, Klein 1926',
 definition:`In general relativity gravity is the metric of spacetime: at each point a symmetric array of numbers gᵢⱼ giving distances, ${D8_metricN(4)} independent numbers in four dimensions. Theodor Kaluza (who sent the idea to Einstein in 1919; published 1921) wrote Einstein’s equations in five dimensions. The extra row of the metric behaves exactly like the electromagnetic potential, and Maxwell’s equations come out alongside gravity, with one extra field left over. Gunnar Nordström had tried a five-dimensional unification in 1914 with his own theory of gravity. Oskar Klein (1926) proposed that the fifth dimension is a tiny circle, which is why it is not seen.`,
 example:`A symmetric 5 × 5 array has ${D8_metricN(5)} independent entries: the ${D8_metricN(4)} of the four-dimensional metric, ${D8_metricN(5)-D8_metricN(4)-1} in the fifth row, which act as the electromagnetic potential, and 1 in the corner, a new scalar field. String theory needs 10 dimensions and M-theory 11, so their metrics have many more components, which become further fields if the extra dimensions are curled up.`,
 desc:'An n × n array of metric components, coloured by block for five dimensions, with each entry’s mirror image across the diagonal linked, and tiles counting the independent entries as n(n + 1)/2.',
 research:['Nordström (1914). Über die Möglichkeit, das elektromagnetische Feld und das Gravitationsfeld zu vereinigen. Physikalische Zeitschrift 15, 504–506.','Kaluza (1921). Zum Unitätsproblem der Physik. Sitzungsberichte der Preußischen Akademie der Wissenschaften, 966–972.','Klein (1926). Quantentheorie und fünfdimensionale Relativitätstheorie. Zeitschrift für Physik 37, 895–906.','Physics In Motion covers general relativity itself: physics-in-motion.puter.site, general-relativity.'],
 dur:12,hint:'Change the number of dimensions and press any entry of the array to see its mirror image across the diagonal. For five dimensions the colours show which entries become gravity, electromagnetism and the extra field.',
 init:()=>({n:5,pick:'4,1'}),
 watch(p){const n=[3,4,5,5,10][Math.min(4,Math.floor(p*5))];return {n,pick:n===5?'4,1':'1,0'}},
 ui:[{range:'n',label:'Dimensions n',min:2,max:11,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),2,11)},cell(s,v){s.pick=String(v)}},
 draw(s,f,X){
  const n=s.n,N=D8_metricN(n),c=Math.min(30,236/n),x0=40,y0=70,[pi,pj]=String(s.pick).split(',').map(Number),kk=n===5;
  let out=heading(`${n} dimensions: ${n} × ${n} = ${n*n} entries, ${N} independent`);
  const col=(i,j)=>!kk?(i===j?C.purplep:'#fff'):(i<4&&j<4?C.pale:i===4&&j===4?C.amberp:C.coralp);
  for(let i=0;i<n;i++)for(let j=0;j<n;j++){const sel=(i===pi&&j===pj)||(i===pj&&j===pi),inner=R(x0+j*c,y0+i*c,c-2,c-2,col(i,j),sel?C.ink:C.grid,3)+(c>=26?TF(x0+j*c+c/2-1,y0+i*c+c/2+4,`${i+1}${j+1}`,13,i===j?C.purple:C.muted):'');out+=hit(X,'cell',i+','+j,`Entry g${i+1}${j+1}`,inner)}
  out+=TF(x0,y0-10,'gᵢⱼ: row i, column j',13,C.muted,'start');
  if(pi<n&&pj<n)out+=TF(24,y0+n*c+22,pi===pj?`g${D8_sub(pi+1)}${D8_sub(pj+1)}: on the diagonal`:`g${D8_sub(pi+1)}${D8_sub(pj+1)} = g${D8_sub(pj+1)}${D8_sub(pi+1)}: one number, two places`,13,C.ink,'start');
  const diag=n,off=n*(n-1)/2,X0=330;
  out+=D8_tile(X0,62,252,'Diagonal entries',String(diag),C.purple)+D8_tile(X0,114,252,'Pairs above the diagonal: n(n − 1)/2',String(off),C.ink)+D8_tile(X0,166,252,'Independent: n(n + 1)/2',String(N),C.green);
  if(kk){const g4=D8_metricN(4);out+=R(X0,226,14,14,C.pale,C.grid,3)+TF(X0+20,238,`${g4}: four-dimensional gravity`,13,C.ink,'start')+R(X0,250,14,14,C.coralp,C.grid,3)+TF(X0+20,262,`${n-1}: electromagnetic potential`,13,C.ink,'start')+R(X0,274,14,14,C.amberp,C.grid,3)+TF(X0+20,286,`1: an extra scalar field`,13,C.ink,'start')+TBF(X0,312,`${g4} + ${n-1} + 1 = ${N}`,14,C.green,'start')}
  else out+=TF(X0,240,`Beyond four dimensions: ${N-D8_metricN(4)} extra`,13,C.ink,'start')+TF(X0,260,'components, which would show up',13,C.ink,'start')+TF(X0,280,'as further fields in four dimensions.',13,C.ink,'start');
  return {svg:out,phase:kk?`Five dimensions: ${N} independent entries. The top-left ${4} × ${4} block is the ordinary metric of spacetime (${D8_metricN(4)}); the four mixed entries g₅₁ … g₅₄ obey Maxwell’s equations; g₅₅ is a new field. Kaluza had to assume nothing depends on the fifth coordinate; Klein’s tiny circle explains why it would look that way.`:`An n × n symmetric array has n entries on its diagonal and n(n − 1)/2 pairs off it, so ${n} dimensions give ${N} independent components${n>4?`, ${N-D8_metricN(4)} more than spacetime’s ${D8_metricN(4)}`:''}.${n===10?' Ten is the number string theory requires (Green and Schwarz, 1984); this is mathematics of the proposal, not evidence for it.':n===11?' Eleven is the dimension of M-theory (Witten, 1995), also unconfirmed.':''}`};
 }});

/* Klein's circle: momentum round a circle of radius R comes in steps ħ/R, so the lightest “Kaluza–Klein” excitation
   needs energy about ħc/R. ħc = 197.3269804 MeV·fm (CODATA 2018). A rough ADD force law, piecewise. */
const D8_HBARC=197.3269804e6*1e-15;   // eV·m
const D8_LHC_EV=13e12;               // LHC collision energy 2015–18, 13 TeV
const D8_eV=v=>{const u=[[1e24,'YeV'],[1e21,'ZeV'],[1e18,'EeV'],[1e15,'PeV'],[1e12,'TeV'],[1e9,'GeV'],[1e6,'MeV'],[1e3,'keV'],[1,'eV']];for(const [k,n] of u)if(v>=k)return `${Number((v/k).toPrecision(3))} ${n}`;return D8_sci(v,2)+' eV'};
const D8_m=v=>{const u=[[1e-3,'mm'],[1e-6,'μm'],[1e-9,'nm'],[1e-12,'pm'],[1e-15,'fm']];for(const [k,n] of u)if(v>=k)return `${D8_f(v/k,v/k<10?2:v/k<100?1:0)} ${n}`;return D8_sci(v,1)+' m'};
SCENE({id:'extra-dimensions-tests',name:'Looking for extra dimensions',tag:'Unconfirmed by experiment',
 definition:'If a dimension is curled into a circle of radius R, a wave must fit round it a whole number of times, so motion round it comes in steps, and the lightest such motion carries an energy of about ħc/R. Klein’s circle would be so small that no experiment could supply that energy. In 1998 Arkani-Hamed, Dimopoulos and Dvali proposed that extra dimensions might be as large as a millimetre if only gravity spreads into them; then gravity would grow stronger than 1/r² at short range. Experiments have looked for both effects. No extra dimension has been found.',
 example:`A circle of radius 10⁻¹⁸ m, a thousandth of a proton’s size, would need about ${D8_eV(D8_HBARC/1e-18)} per step, within reach of the Large Hadron Collider’s ${D8_eV(D8_LHC_EV)} collisions, and searches there have found no such steps. Torsion-balance measurements of gravity between masses less than a tenth of a millimetre apart find the ordinary 1/r² law. String theory’s six or seven curled dimensions remain unconfirmed.`,
 desc:'Two panels: a circle of chosen radius with whole waves fitted round it and the energy of the first step computed from ħc/R against a collider energy; and a sketch of gravity’s strength against distance, bending from 1/r² to a steeper law below the size of the extra dimensions.',
 research:['Arkani-Hamed, Dimopoulos & Dvali (1998). The hierarchy problem and new dimensions at a millimeter. Physics Letters B 429, 263–272.','Kapner, Cook, Adelberger, Gundlach, Heckel, Hoyle & Swanson (2007). Tests of the gravitational inverse-square law below the dark-energy length scale. Physical Review Letters 98, 021101.','Green & Schwarz (1984). Physics Letters B 149, 117–122; Witten (1995). Nuclear Physics B 443, 85–126: ten- and eleven-dimensional theories, untested by experiment.','ħc = 197.3269804 MeV·fm (CODATA 2018). LHC collisions at 13 TeV, 2015–18.'],
 dur:12,hint:'Change the radius of the hidden circle and the number of the wave round it, and compare the energy with the collider’s. Then choose how many large extra dimensions the force sketch assumes.',
 init:()=>({lr:-18,k:2,nx:2}),
 watch(p){return {lr:Math.round(lerp(-12,-34,p)),k:1+Math.floor(p*3.99),nx:2}},
 ui:[{range:'lr',label:'Radius 10ˣ m, x',min:-35,max:-3,get:s=>s.lr,act:'lr'},{range:'k',label:'Waves round the circle',min:1,max:4,get:s=>s.k,act:'k'},{choose:[[1,'1 large extra dimension'],[2,'2'],[6,'6']],label:'Extra dimensions in the sketch',get:s=>s.nx,act:'nx'}],
 on:{lr(s,v){s.lr=clamp(Math.round(+v),-35,-3)},k(s,v){s.k=clamp(Math.round(+v),1,4)},nx(s,v){s.nx=[1,2,6].includes(+v)?+v:2}},
 draw(s){
  const R0=Math.pow(10,s.lr),E1=D8_HBARC/R0,Ek=s.k*E1,reach=Ek<=D8_LHC_EV;
  let out=heading(`Radius 10${s.lr<0?'⁻':''}${D8_sup(Math.abs(s.lr))} m: ${D8_eV(Ek)} for ${s.k} wave${s.k===1?'':'s'}`);
  // circle with k whole waves
  out+=R(18,50,250,250,'#fff',C.grid,8);const cx=143,cy=170,rr=74;out+=Ci(cx,cy,rr,'none',C.line);
  const wp=[];for(let i=0;i<=240;i++){const a=2*Math.PI*i/240,r2=rr+14*Math.sin(s.k*a);wp.push([cx+r2*Math.cos(a),cy-r2*Math.sin(a)])}out+=D8_poly(wp,C.purple,2.2);
  out+=TF(143,282,`${s.k} whole wave${s.k===1?'':'s'} round the circle`,13,C.purple);out+=TF(143,72,`circumference 2πR = ${D8_m(2*Math.PI*R0)}`,13,C.muted);
  out+=D8_tile(18,310,250,'Energy ≈ k ħc / R',D8_eV(Ek),reach?C.green:C.coral);
  // force sketch: F·r² relative to Newton, against r/R on log axes
  const n=s.nx,pl=D8_plot(330,70,248,170,[-2,2],[0,2*n+.3],{xt:[[-2,'R/100'],[0,'R'],[2,'100R']],yt:[[2*n,'×10'+D8_sup(2*n)]],xl:'distance r (log scale)',xlDy:32});
  out+=pl.svg+TF(326,64,'gravity ÷ Newton’s 1/r² (sketch)',13,C.muted,'start');
  const up=[];for(let i=0;i<=80;i++){const lx=-2+4*i/80;up.push([pl.X(lx),pl.Y(lx<0?-n*lx:0)])}
  out+=L(pl.X(-2),pl.Y(0),pl.X(2),pl.Y(0),C.blue,1.4,'stroke-dasharray="5 4"')+D8_poly(up,C.coral,2.4);
  out+=TF(pl.X(-.9),pl.Y(n)-6,`(R/r)${D8_sup(n)} below R`,13,C.coral,'start')+TF(pl.X(.2),pl.Y(0)-8,'1/r² (Newton)',13,C.blue,'start');
  out+=D8_tile(330,300,252,'Collider reach: R above',D8_m(D8_HBARC/D8_LHC_EV),C.ink);
  return {svg:out,phase:`A circle of radius ${D8_sci(R0,0)} m allows waves of 1, 2, 3 … wavelengths round it; ${s.k} wave${s.k===1?'':'s'} carr${s.k===1?'ies':'y'} about ${s.k} × ħc/R = ${D8_eV(Ek)}. ${reach?`That is below the ${D8_eV(D8_LHC_EV)} of LHC collisions, so such a dimension would show up there; none has.`:`That is ${D8_f(Math.log10(Ek/D8_LHC_EV),0)} powers of ten beyond the ${D8_eV(D8_LHC_EV)} of LHC collisions: a circle this small cannot be ruled out, or tested, by colliders.`} The right panel sketches the 1998 proposal: below the size R of ${n} large extra dimension${n===1?'':'s'}, gravity would weaken as 1/r${D8_sup(2+n)} instead of 1/r², so it would be stronger at short range than Newton’s law; experiments have not found this.`};
 }});

