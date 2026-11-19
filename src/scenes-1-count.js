/* ===================== Dimensions In Motion · Era 1 · Counting dimensions ===================== */
// Coordinates, degrees of freedom, Flatland, shadows and projection, distance in n dimensions, what a dimension is.
// Every picture is a pure function of state, frame and X. Every count, coordinate, length, angle and area on screen
// is computed by the code below from the shape drawn or the formula named beside it; the only typed numbers are
// historical dates (with a research line) and the chosen inputs of an example (a point, a side length).

/* ---- shared helpers (era 1 only) ---- */
const D1_tile=(x,y,w,label,value,col=C.blue)=>R(x,y,w,46,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+38,value,16,col);
const D1_note=(s,y=368)=>TF(300,y,s,13,C.muted);
// Fixed decimals with a true minus sign; D1_f trims trailing zeros.
const D1_fx=(v,dp=2)=>{const a=Math.abs(v)<.5*Math.pow(10,-dp)?0:v;return (a<0?'−':'')+Math.abs(a).toFixed(dp)};
const D1_f=(v,dp=2)=>{const s=D1_fx(v,dp);return s.indexOf('.')<0?s:s.replace(/\.?0+$/,'')};
const D1_par=v=>v<0?'('+D1_f(v)+')':D1_f(v);
const D1_SUP='⁰¹²³⁴⁵⁶⁷⁸⁹';
const D1_pow=(k,d)=>Math.abs(d-Math.round(d))<1e-9?k+String(Math.round(d)).split('').map(c=>D1_SUP[+c]).join(''):`${k}^${D1_f(d,3)}`;
const D1_list=(v,dp=2)=>'('+v.map(a=>D1_f(a,dp)).join(', ')+')';
// √m in simplest form for a whole number m: 4 → "2", 8 → "2√2", 3 → "√3".
function D1_surd(m){m=Math.round(m);if(m<0)return '?';let k=1;for(let i=2;i*i<=m;i++)while(m%(i*i)===0){m/=i*i;k*=i}return m===1?String(k):(k===1?'':k)+'√'+m}
const D1_path=(pts,col=C.blue,w=2.2,fill='none',extra='',close=false)=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L')+(close?' Z':''),col,w,fill,extra):'';
const D1_dash='stroke-dasharray="5 4"';
const D1_sub=['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'];
const D1_xi=i=>'x'+String(i).split('').map(c=>D1_sub[+c]).join('');
const D1_choose=(n,k)=>{if(k<0||k>n)return 0;let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return Math.round(r)};
const D1_dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const D1_norm=a=>Math.sqrt(D1_dot(a,a));
const D1_sub3=(a,b)=>a.map((v,i)=>v-b[i]);
const D1_cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const D1_deg=r=>r*180/Math.PI;
// Rotations of a 3D point about the coordinate axes.
const D1_rx=([x,y,z],a)=>[x,y*Math.cos(a)-z*Math.sin(a),y*Math.sin(a)+z*Math.cos(a)];
const D1_ry=([x,y,z],a)=>[x*Math.cos(a)+z*Math.sin(a),y,-x*Math.sin(a)+z*Math.cos(a)];
const D1_rz=([x,y,z],a)=>[x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a),z];
// A fixed camera for flat drawings of 3D things (same formula as the shared 3D view, z up): [x,y,z] -> [sx,sy,depth].
function D1_cam(yaw,pitch,scale,ox,oy){return ([x,y,z])=>{const a=x*Math.cos(yaw)-y*Math.sin(yaw),b=x*Math.sin(yaw)+y*Math.cos(yaw);return [ox+a*scale,oy+(-b*Math.sin(pitch)-z*Math.cos(pitch))*scale,-b*Math.cos(pitch)+z*Math.sin(pitch)]}}
// Convex hull of 2D points (monotone chain), counter-clockwise, without repeated or collinear points.
function D1_hull(pts){
 const p=pts.map(q=>[q[0],q[1]]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
 const uniq=[];for(const q of p)if(!uniq.length||Math.hypot(q[0]-uniq[uniq.length-1][0],q[1]-uniq[uniq.length-1][1])>1e-9)uniq.push(q);
 if(uniq.length<3)return uniq;
 const lo=[],up=[];
 for(const q of uniq){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],q)<=1e-9)lo.pop();lo.push(q)}
 for(let i=uniq.length-1;i>=0;i--){const q=uniq[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],q)<=1e-9)up.pop();up.push(q)}
 return lo.slice(0,-1).concat(up.slice(0,-1));
}
const D1_area=poly=>Math.abs(poly.reduce((s,p,i)=>{const q=poly[(i+1)%poly.length];return s+p[0]*q[1]-q[0]*p[1]},0))/2;
const D1_sides=poly=>poly.map((p,i)=>{const q=poly[(i+1)%poly.length];return Math.hypot(q[0]-p[0],q[1]-p[1])});
// Vertices of the n-cube as 0/1 lists, and its edges as the pairs that differ in exactly one place.
function D1_cubeVerts(n){const out=[];for(let m=0;m<(1<<n);m++)out.push(range(n).map(i=>(m>>i)&1));return out}
function D1_cubeEdges(n){const e=[];for(let a=0;a<(1<<n);a++)for(let i=0;i<n;i++){const b=a^(1<<i);if(a<b)e.push([a,b,i])}return e}

/* ===================== Lesson: coordinates ===================== */
// Oblique drawing for the first scenes: x to the right, y up the page, z towards the viewer (down and to the left).
const D1_OB={ux:26,uy:26,zx:-14,zy:10};
const D1_ob=(ox,oy)=>([x,y,z])=>[ox+D1_OB.ux*x+D1_OB.zx*z,oy-D1_OB.uy*y+D1_OB.zy*z];
const D1_AXC=[C.blue,C.coral,C.green,C.purple,C.amber,C.dark];
const D1_AXN=['x','y','z'];
function D1_coordWatch(p){
 const st=Math.min(2,Math.floor(p*3)),u=smooth(clamp((p*3-st)*1.3,0,1));
 const s={n:st+1,x:3,y:st>=1?2:0,z:st>=2?2:0};
 if(st===0)s.x=Math.round(3*u*2)/2;else if(st===1)s.y=Math.round(2*u*2)/2;else s.z=Math.round(2*u*2)/2;
 return s;
}
SCENE({id:'coordinates',name:'Points named by numbers',tag:'Descartes and Fermat, 1630s',
 definition:'In La Géométrie (1637) René Descartes, and Pierre de Fermat in a treatise passed round in manuscript in the 1630s, named a point by its distances along fixed directions. On a line one number is enough, in the plane two, in space three. The number of coordinates a point needs is a first way to count dimensions.',
 example:'The point (3, 2) is reached from the origin by going 3 along x and then 2 along y. Add a third number, (3, 2, 2), and the walk takes one more step, along a third direction at right angles to both. The rule does not change, only the length of the list.',
 desc:'A number line, a plane grid or a three-axis drawing with a point and the walk from the origin that reaches it, one coordinate at a time, beside the list of coordinates and how many numbers it needs.',
 research:['Descartes (1637). La Géométrie, an appendix to the Discours de la méthode. Leiden.','Fermat. Ad locos planos et solidos isagoge (circulated in the 1630s; printed 1679 in his Varia opera mathematica).'],
 dur:12,hint:'Choose 1, 2 or 3 dimensions, then set the coordinates with the sliders or press a grid point. Watch the walk from the origin take one step per coordinate.',
 init:()=>({n:2,x:3,y:2,z:2}),
 watch:D1_coordWatch,
 ui:[{choose:[[1,'1D: a line'],[2,'2D: a plane'],[3,'3D: space']],label:'Dimensions',get:s=>s.n,act:'n'},
  {range:'x',label:'x',min:-4,max:4,step:.5,get:s=>s.x,act:'x'},{range:'y',label:'y (2D, 3D)',min:-4,max:4,step:.5,get:s=>s.y,act:'y'},{range:'z',label:'z (3D)',min:-4,max:4,step:.5,get:s=>s.z,act:'z'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),1,3)},x(s,v){s.x=clamp(+v,-4,4)},y(s,v){s.y=clamp(+v,-4,4)},z(s,v){s.z=clamp(+v,-4,4)},
  pick(s,v){const [a,b]=String(v).split(',').map(Number);s.x=clamp(a,-4,4);if(s.n>=2&&Number.isFinite(b))s.y=clamp(b,-4,4)}},
 draw(s,f,X){
  const n=s.n,co=[s.x,s.y,s.z].slice(0,n);
  let out=heading(n===1?'A point on a line: one number':n===2?'A point in the plane: two numbers':'A point in space: three numbers');
  let O,Pt,stepPts=[];
  if(n===1){const y0=200,u=36,ox=200;O=[ox,y0];
   out+=L(40,y0,360,y0,C.ink,2);
   for(let i=-4;i<=4;i++){const tx=ox+i*u;out+=L(tx,y0-6,tx,y0+6,C.muted,1.5)+TF(tx,y0+26,D1_f(i),13,C.muted);out+=hit(X,'pick',i+',0',`Put the point at x = ${i}`,Ci(tx,y0,11,'transparent'))}
   out+=TF(372,y0+5,'x',15,C.blue,'start');stepPts=[O,[ox+s.x*u,y0]];Pt=stepPts[1];
  }else if(n===2){const ox=200,oy=205,u=28;O=[ox,oy];
   for(let i=-4;i<=4;i++){out+=L(ox+i*u,oy-4*u,ox+i*u,oy+4*u,C.grid,1)+L(ox-4*u,oy-i*u,ox+4*u,oy-i*u,C.grid,1)}
   out+=arrow(ox-4*u-8,oy,ox+4*u+14,oy,C.ink,1.8,8)+arrow(ox,oy+4*u+8,ox,oy-4*u-14,C.ink,1.8,8)+TF(ox+4*u+22,oy+5,'x',15,C.blue,'start')+TF(ox+10,oy-4*u-12,'y',15,C.coral,'start');
   for(const i of [-4,-2,2,4])out+=TF(ox+i*u,oy+18,D1_f(i),13,C.muted)+TF(ox-8,oy-i*u+5,D1_f(i),13,C.muted,'end');
   if(X&&X.try)for(let i=-4;i<=4;i++)for(let j=-4;j<=4;j++)out+=hit(X,'pick',i+','+j,`Put the point at (${i}, ${j})`,Ci(ox+i*u,oy-j*u,8,'transparent'));
   stepPts=[O,[ox+s.x*u,oy],[ox+s.x*u,oy-s.y*u]];Pt=stepPts[2];
  }else{const pr=D1_ob(205,200);O=pr([0,0,0]);
   for(let a=0;a<3;a++){const e=[0,0,0],b=[0,0,0];e[a]=4;b[a]=-4;const p=pr(e),q=pr(b);out+=L(q[0],q[1],p[0],p[1],C.line,1.6)+arrow(O[0]+(p[0]-O[0])*.9,O[1]+(p[1]-O[1])*.9,p[0],p[1],C.ink,1.8,8)+TF(p[0]+(a===2?-10:10),p[1]+(a===2?14:a===1?-4:5),D1_AXN[a],15,D1_AXC[a],a===2?'end':'start')}
   stepPts=[[0,0,0],[s.x,0,0],[s.x,s.y,0],[s.x,s.y,s.z]].map(pr);Pt=stepPts[3];
   // a faint box from the origin to the point helps the eye read depth
   const bx=[[0,0,0],[s.x,0,0],[s.x,s.y,0],[0,s.y,0]],box=bx.concat(bx.map(q=>[q[0],q[1],s.z]));
   for(const [a,b] of [[0,4],[1,5],[3,7],[4,5],[4,7],[5,6],[6,7],[2,6]]){const p=pr(box[a]),q=pr(box[b]);out+=L(p[0],p[1],q[0],q[1],C.grid,1.2,D1_dash)}
  }
  for(let i=1;i<stepPts.length;i++){const a=stepPts[i-1],b=stepPts[i];if(Math.hypot(b[0]-a[0],b[1]-a[1])>10)out+=arrow(a[0],a[1],b[0],b[1],D1_AXC[i-1],3,9);else out+=L(a[0],a[1],b[0],b[1],D1_AXC[i-1],3)}
  out+=Ci(O[0],O[1],4,C.ink)+Ci(Pt[0],Pt[1],8,C.ink,'#fff')+TBF(Pt[0]+12,Pt[1]-12,'P',15,C.ink,'start');
  // readout
  out+=D1_tile(400,62,180,'Coordinates of P',D1_list(co,1),C.ink)+D1_tile(400,116,180,'Numbers needed',String(co.length),C.blue);
  out+=TF(400,190,'The walk from the origin:',13,C.muted,'start');
  co.forEach((v,i)=>{out+=R(400,202+i*26,12,12,D1_AXC[i],'none',2)+TF(420,213+i*26,`${D1_f(v,1)} along ${D1_AXN[i]}`,14,C.ink,'start')});
  out+=TF(400,300,'one step for each coordinate,',13,C.muted,'start')+TF(400,318,'each at right angles to the rest',13,C.muted,'start');
  return {svg:out,phase:`P = ${D1_list(co,1)}. ${co.map((v,i)=>`${i?'go':'Go'} ${D1_f(v,1)} along ${D1_AXN[i]}`).join(', then ')}. ${n===1?'One number fixes a point on a line.':n===2?'Two numbers fix a point in the plane: Descartes and Fermat turned geometry into algebra this way.':'Three numbers fix a point in space. The same rule would take a fourth number, if there were a fourth direction to walk in.'}`};
 }});

// Three curves with whole-number equations, so the test F(x, y) = 0 is exact on grid points.
const D1_CURVES={
 line:{eq:'x − 2y + 2 = 0',say:'a straight line',title:'A straight line',F:(x,y)=>x-2*y+2,show:(x,y)=>`${D1_par(x)} − 2×${D1_par(y)} + 2`,pts:u=>{const x=-5+10*u;return [x,(x+2)/2]}},
 circle:{eq:'x² + y² − 25 = 0',say:'a circle of radius 5',title:'A circle of radius 5',F:(x,y)=>x*x+y*y-25,show:(x,y)=>`${D1_par(x)}² + ${D1_par(y)}² − 25`,pts:u=>[5*Math.cos(2*Math.PI*u),5*Math.sin(2*Math.PI*u)]},
 parabola:{eq:'y − x² + 3 = 0',say:'a parabola',title:'A parabola',F:(x,y)=>y-x*x+3,show:(x,y)=>`${D1_par(y)} − ${D1_par(x)}² + 3`,pts:u=>{const x=-2.83+5.66*u;return [x,x*x-3]}}};
const D1_onCurve=k=>{const out=[];for(let x=-5;x<=5;x++)for(let y=-5;y<=5;y++)if(D1_CURVES[k].F(x,y)===0)out.push([x,y]);return out};
function D1_curveWatch(p){const ks=['line','circle','parabola'],i=Math.min(2,Math.floor(p*3)),u=clamp((p*3-i)*1.15,0,1),k=ks[i],on=D1_onCurve(k);
 return {curve:k,u,tested:on.slice(0,Math.floor(u*(on.length+.99))).map(q=>q.join(',')),last:''}}
SCENE({id:'coordinates-curves',name:'A curve becomes an equation',tag:'Fermat’s loci, 1630s',
 definition:'Fermat wrote that whenever an equation links two unknown quantities, the points they name trace out a line, straight or curved. A curve is then the set of points (x, y) that make one equation true, and geometry questions become algebra questions: does this point lie on the curve? Put its numbers in and see whether the equation holds.',
 example:`For the circle x² + y² − 25 = 0, the point (3, 4) gives 9 + 16 − 25 = ${D1_f(D1_CURVES.circle.F(3,4))}, so it is on the circle; (3, 3) gives ${D1_f(D1_CURVES.circle.F(3,3))}, so it lies inside. On this grid the circle passes through exactly ${D1_onCurve('circle').length} points with whole-number coordinates, which the scene finds by testing all 121.`,
 desc:'A grid from −5 to 5 with a line, a circle or a parabola drawn on it, points the learner has tested shown green when they satisfy the equation and coral when they do not, and counts of tested points and grid points on the curve.',
 research:['Fermat. Ad locos planos et solidos isagoge (1630s; printed 1679): equations in two unknowns describe lines and curves.','Descartes (1637). La Géométrie, Book II: curves classified by their equations.'],
 dur:12,hint:'Pick a curve, then press grid points to test them. The equation is evaluated at each point you press: 0 means the point is on the curve. Can you find every grid point on it?',
 init:()=>({curve:'circle',u:.15,tested:[],last:''}),
 watch:D1_curveWatch,
 ui:[{choose:[['line','Line'],['circle','Circle'],['parabola','Parabola']],label:'Curve',get:s=>s.curve,act:'curve'},{b:'Clear the tests',act:'clear'}],
 on:{curve(s,v){s.curve=D1_CURVES[v]?v:'circle';s.tested=[];s.last=''},clear(s){s.tested=[];s.last=''},
  test(s,v){const [x,y]=String(v).split(',').map(Number);if(!Number.isFinite(x)||!Number.isFinite(y))return;const key=x+','+y;if(!s.tested.includes(key))s.tested.push(key);s.last=key;return 'keep'}},
 draw(s,f,X){
  const cv=D1_CURVES[s.curve],ox=175,oy=205,u=26,S=([x,y])=>[ox+x*u,oy-y*u],on=D1_onCurve(s.curve);
  let out=heading(`${cv.title}: ${cv.eq}`);
  for(let i=-5;i<=5;i++)out+=L(ox+i*u,oy-5*u,ox+i*u,oy+5*u,i===0?C.ink:C.grid,i===0?1.6:1)+L(ox-5*u,oy-i*u,ox+5*u,oy-i*u,i===0?C.ink:C.grid,i===0?1.6:1);
  for(const i of [-4,-2,2,4])out+=TF(ox+i*u,oy+5*u+18,D1_f(i),13,C.muted)+TF(ox-5*u-8,oy-i*u+5,D1_f(i),13,C.muted,'end');
  out+=TF(ox+5*u+8,oy+5,'x',14,C.blue,'start')+TF(ox+4,oy-5*u-8,'y',14,C.coral,'start');
  const pts=[];for(let i=0;i<=160;i++){const q=cv.pts(i/160);if(Math.abs(q[0])<=5.4&&Math.abs(q[1])<=5.4)pts.push(S(q))}
  out+=D1_path(pts,C.purple,2.6);
  if(X&&X.try)for(let x=-5;x<=5;x++)for(let y=-5;y<=5;y++)out+=hit(X,'test',x+','+y,`Test the point (${x}, ${y})`,Ci(ox+x*u,oy-y*u,9,'transparent'));
  let good=0;
  for(const key of s.tested){const [x,y]=key.split(',').map(Number),ok=cv.F(x,y)===0;if(ok)good++;const p=S([x,y]);out+=Ci(p[0],p[1],6,ok?C.green:C.coral,'#fff')}
  if(!(X&&X.try)){const q=cv.pts(s.u),p=S(q);out+=Ci(p[0],p[1],7,C.ink,'#fff')}
  // the test of the last point, or the moving point in Watch
  const x0=335;let line1,line2,col=C.ink;
  if(X&&X.try&&s.last){const [x,y]=s.last.split(',').map(Number),v=cv.F(x,y);line1=`(${x}, ${y}): ${cv.show(x,y)}`;line2=`= ${D1_f(v)}  ${v===0?'✓ on the curve':'✕ not on it'}`;col=v===0?C.green:C.coral}
  else if(X&&X.try){line1='Press a grid point to test it.';line2=''}
  else{const q=cv.pts(s.u),v=cv.F(q[0],q[1]);line1=`(${D1_f(q[0],2)}, ${D1_f(q[1],2)}) on the curve`;line2=`F(x, y) = ${D1_f(v,2)}`;col=C.purple}
  out+=TBF(x0,72,'Test: put the numbers in',14,C.ink,'start')+TF(x0,96,line1,13,C.ink,'start')+TBF(x0,118,line2,14,col,'start');
  out+=D1_tile(x0,140,120,'Points tested',String(s.tested.length),C.ink)+D1_tile(x0+130,140,120,'On the curve',String(good),C.green);
  out+=D1_tile(x0,196,250,'Grid points on this curve (all 121 tested)',String(on.length),C.purple);
  out+=TF(x0,270,'F(x, y) = 0: on the curve',13,C.green,'start')+TF(x0,290,'F(x, y) ≠ 0: off it',13,C.coral,'start');
  out+=TF(x0,322,good===on.length&&good>0?'You have found them all.':`${on.length-good} still to find.`,13,C.muted,'start');
  return {svg:out,phase:X&&X.try?(s.last?`${line1} ${line2}. ${good} of the ${on.length} grid points on ${cv.say} found so far.`:`The equation ${cv.eq} decides which points belong to ${cv.say}. Press a grid point to test it.`):
   `A point slides along ${cv.say}; at every position its coordinates make the equation true. Of the 121 grid points from −5 to 5, exactly ${on.length} satisfy ${cv.eq}.`};
 }});

// The page drawing of a 3D point: many points of space land on the same spot of the page.
function D1_twin(p){const vz=-p[2];return [p[0]-D1_OB.zx/D1_OB.ux*vz,p[1]+D1_OB.zy/D1_OB.uy*vz,0]}
SCENE({id:'coordinates-space',name:'A third number for space',tag:'Clairaut 1731, Euler 1748',
 definition:'Descartes worked mostly in the plane. In 1731 Alexis Clairaut described curves in space by pairs of equations in three coordinates, and Euler’s Introductio (1748) treated surfaces by equations in x, y and z. Space needs a third number because a point can move in a third direction at right angles to the first two.',
 example:'A drawing on paper has only two directions, so it cannot show all three coordinates without help. The point (3, 2, 2) lands on the same spot of this page as a point of the flat back wall with z = 0. The dashed box tells them apart; the numbers always do.',
 desc:'Three axes drawn on the page with a point, its walk from the origin, the box it spans, and a second point on the back wall that lands on exactly the same spot of the drawing.',
 research:['Clairaut (1731). Recherches sur les courbes à double courbure. Paris.','Euler (1748). Introductio in analysin infinitorum, vol. 2, appendix on surfaces.'],
 dur:11,hint:'Move the point with the sliders. Turn on the twin to see a different point with the same picture on the page, and compare their coordinates.',
 init:()=>({x:3,y:2,z:2,twin:1}),
 watch(p){const z=Math.round(4*smooth(clamp(p*1.6,0,1))*2)/2;return {x:3,y:2,z,twin:p>.55?1:0}},
 ui:[{range:'x',label:'x',min:0,max:4,step:.5,get:s=>s.x,act:'x'},{range:'y',label:'y',min:0,max:4,step:.5,get:s=>s.y,act:'y'},{range:'z',label:'z',min:0,max:4,step:.5,get:s=>s.z,act:'z'},
  {choose:[[0,'Twin hidden'],[1,'Show the twin']],label:'Twin',get:s=>s.twin,act:'twin'}],
 on:{x(s,v){s.x=clamp(+v,0,4)},y(s,v){s.y=clamp(+v,0,4)},z(s,v){s.z=clamp(+v,0,4)},twin(s,v){s.twin=+v?1:0}},
 draw(s){
  const pr=D1_ob(150,250),Pp=[s.x,s.y,s.z],Q=D1_twin(Pp),sp=pr(Pp),sq=pr(Q);
  let out=heading('Two numbers on the page, three in space');
  // back wall (z = 0) and floor (y = 0)
  out+=`<polygon points="${[[0,0,0],[4.5,0,0],[4.5,4.5,0],[0,4.5,0]].map(q=>pr(q).map(fmt).join(',')).join(' ')}" fill="${C.pale}" opacity=".55"/>`;
  out+=`<polygon points="${[[0,0,0],[4.5,0,0],[4.5,0,4.5],[0,0,4.5]].map(q=>pr(q).map(fmt).join(',')).join(' ')}" fill="${C.greenp}" opacity=".45"/>`;
  for(let a=0;a<3;a++){const e=[0,0,0];e[a]=4.8;const p=pr(e),o=pr([0,0,0]);out+=arrow(o[0],o[1],p[0],p[1],C.ink,1.8,8)+TF(p[0]+(a===2?-8:8),p[1]+(a===2?14:a===1?-4:5),D1_AXN[a],15,D1_AXC[a],a===2?'end':'start')}
  out+=TF(pr([0,4.5,0])[0]+6,pr([0,4.5,0])[1]+16,'back wall, z = 0',13,C.blue,'start')+TF(pr([4.6,0,4.4])[0],pr([4.6,0,4.4])[1]+18,'floor, y = 0',13,C.green,'middle');
  const bx=[[0,0,0],[s.x,0,0],[s.x,s.y,0],[0,s.y,0]],box=bx.concat(bx.map(q=>[q[0],q[1],s.z]));
  for(const [a,b] of [[0,4],[1,5],[2,6],[3,7],[4,5],[5,6],[6,7],[7,4],[0,1],[1,2],[2,3],[3,0]]){const p=pr(box[a]),q=pr(box[b]);out+=L(p[0],p[1],q[0],q[1],C.line,1.3,D1_dash)}
  const wk=[[0,0,0],[s.x,0,0],[s.x,s.y,0],Pp].map(pr);for(let i=1;i<4;i++)out+=L(wk[i-1][0],wk[i-1][1],wk[i][0],wk[i][1],D1_AXC[i-1],3);
  if(s.twin){const wq=[[0,0,0],[Q[0],0,0],[Q[0],Q[1],0]].map(pr);for(let i=1;i<3;i++)out+=L(wq[i-1][0],wq[i-1][1],wq[i][0],wq[i][1],D1_AXC[i-1],2,D1_dash);out+=Ci(sq[0],sq[1],12,'none',C.purple)}
  out+=Ci(sp[0],sp[1],7,C.ink,'#fff')+TBF(sp[0]+14,sp[1]+22,'P',15,C.ink,'start');
  if(s.twin&&s.z>0)out+=TBF(sq[0]-16,sq[1]-14,'Q',15,C.purple,'end');
  // readout
  const x0=380;out+=D1_tile(x0,58,200,'P in space',D1_list(Pp,1),C.ink);
  if(s.twin){out+=D1_tile(x0,112,200,'Q on the back wall',D1_list(Q,2),C.purple);
   out+=TF(x0,184,'On the page (drawing units):',13,C.muted,'start')+TF(x0,204,`P at (${Math.round(sp[0])}, ${Math.round(sp[1])})`,14,C.ink,'start')+TF(x0,224,`Q at (${Math.round(sq[0])}, ${Math.round(sq[1])})`,14,C.purple,'start');
   out+=TF(x0,252,s.z>0?'Same spot, different points.':'With z = 0, P is its own twin.',13,s.z>0?C.coral:C.muted,'start')}
  else out+=TF(x0,130,'The dashed box shows how far',13,C.muted,'start')+TF(x0,148,'the point is from each wall.',13,C.muted,'start');
  out+=TF(x0,290,'Distance in front of the wall:',13,C.muted,'start')+TBF(x0,312,`z = ${D1_f(s.z,1)}`,15,C.green,'start');
  return {svg:out,phase:s.twin&&s.z>0?`P = ${D1_list(Pp,1)} and Q = ${D1_list(Q,2)} are different points of space, yet the drawing puts them on the same spot. A flat picture loses one number. The third coordinate, z = ${D1_f(s.z,1)}, is the information the page cannot show by position alone.`:
   `P = ${D1_list(Pp,1)}: ${D1_f(s.x,1)} along x, ${D1_f(s.y,1)} up and ${D1_f(s.z,1)} out from the back wall. The box drawn from the origin to P helps the eye read the third number.`};
 }});

// Parallel coordinates: one vertical axis per coordinate, so a point of any dimension is a broken line.
const D1_PCX=(i,n)=>n===1?220:60+i*(320/(n-1));
const D1_PCY=v=>200-v*34;
function D1_pcAxes(n,X,act,label){
 let out='';
 for(let i=0;i<n;i++){const x=D1_PCX(i,n);out+=L(x,D1_PCY(3),x,D1_PCY(-3),C.line,2);
  for(let v=-3;v<=3;v++){out+=L(x-4,D1_PCY(v),x+4,D1_PCY(v),C.line,1.4);if(act)out+=hit(X,act,i+','+v,`${label} ${D1_xi(i+1)} = ${v}`,R(x-14,D1_PCY(v)-12,28,24,'transparent','none',4))}
  out+=TBF(x,D1_PCY(-3)+24,D1_xi(i+1),15,C.ink)}
 out+=TF(30,D1_PCY(3)+5,'3',13,C.muted,'end')+TF(30,D1_PCY(0)+5,'0',13,C.muted,'end')+TF(30,D1_PCY(-3)+5,'−3',13,C.muted,'end');
 return out;
}
const D1_PC_POINT=[2,-1,1,3,0,-2];
SCENE({id:'coordinates-n',name:'Four numbers, same rule',tag:'Cayley 1843, Grassmann 1844',
 definition:'In 1843 Arthur Cayley wrote “Chapters in the analytical geometry of (n) dimensions”, and in 1844 Hermann Grassmann published a theory of extension in any number of dimensions. Their step was to keep the rule and drop the picture: a list of n numbers is a point in n-dimensional space, whether or not anyone can draw it.',
 example:`${D1_list(D1_PC_POINT.slice(0,4))} is a point in four dimensions. It cannot be drawn with four axes at right angles on paper, but parallel coordinates draw each number on its own upright axis and join them. The number of coordinate planes, C(n, 2), and of “quadrants”, 2ⁿ, follow from the list alone: ${D1_choose(4,2)} and ${2**4} when n = 4.`,
 desc:'One upright axis for each coordinate, the point drawn as a broken line through its values, and tiles for the coordinate list, the number of coordinate planes, the number of regions cut out by the axes, and which region the point is in.',
 research:['Cayley (1843). Chapters in the analytical geometry of (n) dimensions. Cambridge Mathematical Journal 4.','Grassmann (1844). Die lineale Ausdehnungslehre, ein neuer Zweig der Mathematik. Leipzig: Wigand.','Inselberg (1985). The plane with parallel coordinates. The Visual Computer 1, 69–91 (the drawing method used here).'],
 dur:12,hint:'Choose how many coordinates, then press a mark on any axis to set that coordinate. The counts on the right are computed from n.',
 init:()=>({n:4,v:D1_PC_POINT.slice()}),
 watch(p){return {n:clamp(1+Math.floor(p*6.2),1,6),v:D1_PC_POINT.slice()}},
 ui:[{choose:[[1,'1'],[2,'2'],[3,'3'],[4,'4'],[5,'5'],[6,'6']],label:'Coordinates n',get:s=>s.n,act:'n'},{b:'A new point',act:'rand'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),1,6)},set(s,v){const [i,a]=String(v).split(',').map(Number);if(i>=0&&i<6&&Math.abs(a)<=3)s.v[i]=a},
  rand(s){const r=rng(nextSeed());s.v=range(6).map(()=>Math.floor(r()*7)-3)}},
 draw(s,f,X){
  const n=s.n,v=s.v.slice(0,n);
  let out=heading(n<=3?`${n} number${n>1?'s':''}: a point you can also draw with ${n===1?'a line':n===2?'two axes':'three axes'}`:`${n} numbers: a point in ${n} dimensions`);
  out+=D1_pcAxes(n,X,X&&X.try?'set':null,'Set');
  const pts=v.map((a,i)=>[D1_PCX(i,n),D1_PCY(a)]);
  out+=D1_path(pts,C.purple,3);pts.forEach((p,i)=>{out+=Ci(p[0],p[1],7,C.purple,'#fff')+TBF(p[0],D1_PCY(-3)+44,D1_f(v[i]),14,C.purple)});
  const signs=v.map(a=>a>0?'+':a<0?'−':'0'),zeros=v.filter(a=>a===0).length;
  const x0=412;out+=D1_tile(x0,56,170,'The point',D1_list(v),C.purple)+D1_tile(x0,110,170,'Coordinates',String(n),C.ink);
  out+=D1_tile(x0,164,170,'Coordinate planes C(n, 2)',String(D1_choose(n,2)),C.blue)+D1_tile(x0,218,170,'Regions cut by axes 2ⁿ',String(2**n),C.blue);
  out+=TF(x0,290,'Signs of the coordinates:',13,C.muted,'start')+TBF(x0,312,'('+signs.join(', ')+')',15,C.ink,'start');
  out+=TF(x0,334,zeros?'a 0 puts it on a boundary':`one region of the ${2**n}`,13,C.muted,'start');
  out+=D1_note('Parallel coordinates: each axis is one coordinate. They are not at right angles in space.',370);
  return {svg:out,phase:`The point ${D1_list(v)} has ${n} coordinate${n>1?'s':''}. ${n>=4?`No drawing with ${n} axes at right angles fits on paper, but nothing about the list changed: each number is still a distance along its own direction.`:'This one could also be drawn the usual way, with axes at right angles.'} Choosing two of the ${n} axes gives ${D1_choose(n,2)} coordinate plane${D1_choose(n,2)===1?'':'s'}, and the signs of the coordinates pick one of ${2**n} regions.`};
 }});

/* ===================== Lesson: degrees-of-freedom ===================== */
// Each system: N marked points in d-dimensional space, and rules that each remove one number.
// The count of freedoms is N·d − (number of rules); the list of free coordinates drawn must have the same length.
const D1_BODY=[[0,0,.55],[.55,-.3,-.25],[-.5,-.35,-.2]];   // three marked points of a rigid body (its own frame)
const D1_SYS={
 bead:{name:'A bead on a wire',N:1,d:2,rules:['stay on the circular wire'],free:['angle round the wire']},
 counter:{name:'A counter on a table',N:1,d:3,rules:['stay on the table top'],free:['x','y']},
 point:{name:'A point in space',N:1,d:3,rules:[],free:['x','y','z']},
 body:{name:'A rigid body in space',N:3,d:3,rules:['AB keeps its length','BC keeps its length','CA keeps its length'],free:['x','y','z','turn','tilt','roll']}};
const D1_SYS_ORDER=['bead','counter','point','body'];
function D1_sysState(k,t){
 const T=2*Math.PI*t;
 if(k==='bead'){const a=T,pt=[Math.cos(a),Math.sin(a)];return {pts:[pt],vals:[D1_f(D1_deg(a)%360,0)+'°'],check:`x² + y² = ${D1_f(pt[0]*pt[0]+pt[1]*pt[1],3)}`}}
 if(k==='counter'){const pt=[1.1*Math.sin(T),.7*Math.sin(2*T),0];return {pts:[pt],vals:[D1_f(pt[0]),D1_f(pt[1])],check:`height z = ${D1_f(pt[2],2)} always`}}
 if(k==='point'){const pt=[1.1*Math.sin(T),.8*Math.sin(2*T),.6+.55*Math.cos(T)];return {pts:[pt],vals:pt.map(v=>D1_f(v)),check:'nothing to keep fixed'}}
 const pos=[.6*Math.sin(T),.4*Math.sin(2*T),1+.3*Math.cos(T)],ang=[T,.45*Math.sin(T),.5*Math.sin(2*T)];
 const pts=D1_BODY.map(q=>{let r=D1_rx(q,ang[2]);r=D1_ry(r,ang[1]);r=D1_rz(r,ang[0]);return r.map((v,i)=>v+pos[i])});
 const dl=[[0,1],[1,2],[2,0]].map(([a,b])=>D1_norm(D1_sub3(pts[a],pts[b])));
 return {pts,vals:pos.map(v=>D1_f(v)).concat(ang.map(a=>D1_f(((D1_deg(a)%360)+360)%360,0)+'°')),check:`AB ${D1_fx(dl[0],3)}, BC ${D1_fx(dl[1],3)}, CA ${D1_fx(dl[2],3)}`};
}
SCENE({id:'degrees-of-freedom',name:'Count the numbers you need',tag:'Lagrange, Mécanique analytique, 1788',
 definition:'Joseph-Louis Lagrange’s Mécanique analytique (1788) describes any mechanical system by as many independent coordinates as it has freedoms to move. Count the numbers that would place every marked point, then subtract one for each rule the system must obey. What is left is the number of degrees of freedom: the dimension of the space of all its positions.',
 example:`A rigid body has ${D1_SYS.body.N} marked points, A, B and C, so ${D1_SYS.body.N*D1_SYS.body.d} numbers, but ${D1_SYS.body.rules.length} distances between them are fixed: ${D1_SYS.body.N*D1_SYS.body.d} − ${D1_SYS.body.rules.length} = ${D1_SYS.body.N*D1_SYS.body.d-D1_SYS.body.rules.length}. Three of the six say where it is and three say which way it faces. Euler had already used three angles for the facing.`,
 desc:'One of four systems, a bead on a circular wire, a counter on a table, a point in space and a rigid body, moving through all its freedoms, beside the count of numbers minus rules and the current value of each free coordinate.',
 research:['Lagrange (1788). Mécanique analytique. Paris: Desaint (generalised coordinates, one for each freedom).','Euler (1765). Theoria motus corporum solidorum seu rigidorum (rigid-body motion; three angles for the orientation).'],
 dur:14,hint:'Choose a system and drag the slider to move it through its freedoms. The count on the right is computed: numbers to place the points, minus the rules.',
 init:()=>({sys:'body',t:.15}),
 watch(p){const i=Math.min(3,Math.floor(p*4));return {sys:D1_SYS_ORDER[i],t:clamp(p*4-i,0,1)}},
 ui:[{choose:[['bead','Bead'],['counter','Counter'],['point','Point'],['body','Rigid body']],label:'System',get:s=>s.sys,act:'sys'},{range:'t',label:'Move it',min:0,max:100,get:s=>Math.round(s.t*100),act:'t'}],
 on:{sys(s,v){s.sys=D1_SYS[v]?v:'body'},t(s,v){s.t=clamp(+v/100,0,1)}},
 draw(s){
  const sy=D1_SYS[s.sys],st=D1_sysState(s.sys,s.t),f=sy.N*sy.d-sy.rules.length;
  let out=heading(`${sy.name}: ${f} degree${f===1?'':'s'} of freedom`);
  if(s.sys==='bead'){const cx=165,cy=205,r=105;out+=Ci(cx,cy,r,'none',C.line)+L(cx-r-20,cy,cx+r+20,cy,C.grid,1)+L(cx,cy-r-20,cx,cy+r+20,C.grid,1);
   const p=st.pts[0],bx=cx+r*p[0],by=cy-r*p[1];out+=L(cx,cy,bx,by,C.coral,1.6,D1_dash)+Ci(bx,by,11,C.blue,'#fff')+TF(cx+r+24,cy+5,'x',14,C.muted,'start')+TF(cx+4,cy-r-24,'y',14,C.muted,'start')}
  else{const pr=D1_cam(.62,.5,s.sys==='body'?95:85,165,s.sys==='counter'?215:250);
   const fl=[[-1.5,-1.2,0],[1.5,-1.2,0],[1.5,1.2,0],[-1.5,1.2,0]];
   out+=`<polygon points="${fl.map(q=>pr(q).slice(0,2).map(fmt).join(',')).join(' ')}" fill="${s.sys==='counter'?'#efe4d2':'#eef3f6'}" stroke="${C.line}" stroke-width="1.5"/>`;
   if(s.sys==='counter')out+=TF(pr([1.5,1.2,0])[0]-4,pr([1.5,1.2,0])[1]-8,'table top',13,C.muted,'end');
   if(s.sys==='counter'){const p=st.pts[0],c=pr(p);out+=`<ellipse cx="${fmt(c[0])}" cy="${fmt(c[1])}" rx="16" ry="7" fill="${C.blue}" stroke="#fff" stroke-width="2"/>`}
   else if(s.sys==='point'){const p=st.pts[0],c=pr(p),g=pr([p[0],p[1],0]);out+=L(c[0],c[1],g[0],g[1],C.muted,1.4,D1_dash)+Ci(g[0],g[1],4,C.muted)+Ci(c[0],c[1],9,C.blue,'#fff')}
   else{const q=st.pts.map(pr);out+=`<polygon points="${q.map(c=>c.slice(0,2).map(fmt).join(',')).join(' ')}" fill="${C.pale}" stroke="${C.blue}" stroke-width="2.5"/>`;
    for(const p of st.pts){const c=pr(p),g=pr([p[0],p[1],0]);out+=L(c[0],c[1],g[0],g[1],C.grid,1.2,D1_dash)}
    q.forEach((c,i)=>{out+=Ci(c[0],c[1],7,C.blue,'#fff')+TBF(c[0]+(i===2?-12:12),c[1]-8,'ABC'[i],14,C.ink,i===2?'end':'start')})}
  }
  // count
  const x0=345;out+=TBF(x0,66,'Count',14,C.ink,'start');
  out+=TF(x0,88,`${sy.N} point${sy.N>1?'s':''} × ${sy.d} numbers = ${sy.N*sy.d}`,14,C.ink,'start');
  sy.rules.forEach((r,i)=>{out+=TF(x0,110+i*20,`− 1  ${r}`,13,C.coral,'start')});
  const yb=110+Math.max(1,sy.rules.length)*20+(sy.rules.length?0:-4);
  if(!sy.rules.length)out+=TF(x0,106,'no rules to obey',13,C.muted,'start');
  out+=L(x0,yb-6,x0+230,yb-6,C.line,1.4)+TBF(x0,yb+14,`= ${f} free number${f===1?'':'s'}`,15,C.blue,'start');
  out+=TF(x0,yb+42,'Free coordinates now:',13,C.muted,'start');
  sy.free.forEach((nm,i)=>{out+=TF(x0+(i%2)*120,yb+64+Math.floor(i/2)*20,`${nm} = ${st.vals[i]}`,13,C.ink,'start')});
  const ok=sy.free.length===f;
  out+=TF(x0,yb+70+Math.ceil(sy.free.length/2)*20,`${ok?'✓':'✕'} the list has ${sy.free.length} entr${sy.free.length===1?'y':'ies'}`,13,ok?C.green:C.coral,'start');
  out+=D1_note('Check, computed from the moved points: '+st.check,368);
  return {svg:out,phase:`${sy.N*sy.d} numbers would place ${sy.N===1?'the point':'the '+sy.N+' points'}${sy.rules.length?`, and ${sy.rules.length} rule${sy.rules.length>1?'s':''} ${sy.rules.length>1?'each remove':'removes'} one`:''}, leaving ${f}. ${s.sys==='body'?'However the body moves, the three distances stay the same, so 6 numbers are enough: 3 for where it is, 3 angles for how it faces.':s.sys==='bead'?'The bead could be named by x and y, but the wire ties them together, so one number, the angle, says where it is.':s.sys==='counter'?'Its height never changes, so two numbers on the table top are enough.':'Nothing ties the three numbers together, so all three are free.'}`};
 }});

// A planar chain of k equal rods joined by hinges. Rules: each rod fixes one distance; a pinned base fixes 2 numbers;
// a tip on a rail fixes 1; a tip fixed to a point fixes 2. The motion is generated from exactly as many free numbers
// as the scene can find, and that list is compared with the formula.
const D1_RAILY=-.5;
const D1_tipTarget=k=>[k===1?1.4:k-.6,-.3];
function D1_chain(k,pin,tip,t){
 const T=2*Math.PI*t,tipc=tip==='rail'?1:tip==='fixed'?2:0,f=2*(k+1)-k-(pin?2:0)-tipc,params=[];
 let base=[0,0];if(!pin){base=[.25*Math.sin(T),.18*Math.sin(2*T)];params.push('base x','base y')}
 const TT=D1_tipTarget(k),pts=[base];let bad=false;
 const add=a=>{const q=pts[pts.length-1];pts.push([q[0]+Math.cos(a),q[1]+Math.sin(a)])};
 if(k===1&&tip==='fixed'){
  if(pin){const a=Math.atan2(TT[1],TT[0]);add(a);bad=true}
  else{params.length=0;const a=.5*Math.sin(T);params.push('rod angle');pts[0]=[TT[0]-Math.cos(a),TT[1]-Math.sin(a)];add(a)}
  return {pts,params,f,bad,TT};
 }
 const nf=k-tipc,amp=tip==='free'?.55:tip==='rail'?Math.asin(Math.min(.9,.38/Math.max(1,k-1))):.3/Math.max(1,k-2);
 for(let i=0;i<nf;i++){add(amp*Math.sin((i+1)*T+i*1.3));params.push('angle '+(i+1))}
 if(tip==='rail'){const q=pts[pts.length-1],sn=(D1_RAILY-q[1]);if(Math.abs(sn)>1)bad=true;add(Math.asin(clamp(sn,-1,1)))}
 if(tip==='fixed'){const q=pts[pts.length-1],dx=TT[0]-q[0],dy=TT[1]-q[1],r=Math.hypot(dx,dy);if(r>2)bad=true;const b=Math.atan2(dy,dx),g=Math.acos(clamp(r/2,0,1));add(b+g);add(b-g)}
 return {pts,params,f,bad,TT};
}
const D1_CHAIN_WATCH=[[2,1,'free'],[2,1,'rail'],[3,1,'fixed'],[2,1,'fixed'],[1,1,'fixed'],[3,0,'free']];
SCENE({id:'degrees-of-freedom-constraints',name:'Add a rule, lose a freedom',tag:'Constraints, from Lagrange to linkages',
 definition:'Every independent constraint removes one degree of freedom. A chain of k rods in the plane has k + 1 joints, so 2(k + 1) numbers, and each rod fixes one distance. Pinning the base removes 2 more; making the tip run along a rail removes 1; fixing the tip to a point removes 2. When the count reaches 0 the chain is rigid; below 0 there are more rules than numbers.',
 example:`Two rods with the base pinned: 6 − 2 − 2 = ${D1_chain(2,1,'free',0).f} freedoms, the two hinge angles, as in a two-joint robot arm. Put the tip on a rail: ${D1_chain(2,1,'rail',0).f} left. Fix the tip to a point: ${D1_chain(2,1,'fixed',0).f}, so the chain can only sit in one of two mirror-image positions. One rod with both ends fixed gives ${D1_f(D1_chain(1,1,'fixed',0).f)}: generally impossible.`,
 desc:'A chain of rods joined by hinges, pinned or free at its base, with its tip free, on a rail or fixed to a point. The chain moves using only its free numbers, and the count beside it is computed from joints, rods and constraints.',
 research:['Lagrange (1788). Mécanique analytique: constraints written as equations, each removing one coordinate.','Grübler (1883) and Kutzbach (1929) gave the counting rule for mechanisms that engineers still use; it assumes the constraints are independent.'],
 dur:18,hint:'Change the number of rods, pin or free the base, and choose what holds the tip. Drag the slider to move the chain through its freedoms; it uses exactly as many free numbers as the count says.',
 init:()=>({k:2,pin:1,tip:'free',t:.2}),
 watch(p){const i=Math.min(D1_CHAIN_WATCH.length-1,Math.floor(p*D1_CHAIN_WATCH.length)),c=D1_CHAIN_WATCH[i];return {k:c[0],pin:c[1],tip:c[2],t:clamp(p*D1_CHAIN_WATCH.length-i,0,1)}},
 ui:[{choose:[[1,'1 rod'],[2,'2 rods'],[3,'3 rods'],[4,'4 rods']],label:'Rods',get:s=>s.k,act:'k'},{choose:[[1,'Base pinned'],[0,'Base free']],label:'Base',get:s=>s.pin,act:'pin'},
  {choose:[['free','Tip free'],['rail','Tip on a rail'],['fixed','Tip fixed']],label:'Tip',get:s=>s.tip,act:'tip'},{range:'t',label:'Move it',min:0,max:100,get:s=>Math.round(s.t*100),act:'t'}],
 on:{k(s,v){s.k=clamp(Math.round(+v),1,4)},pin(s,v){s.pin=+v?1:0},tip(s,v){s.tip=['free','rail','fixed'].includes(v)?v:'free'},t(s,v){s.t=clamp(+v/100,0,1)}},
 draw(s){
  const c=D1_chain(s.k,s.pin,s.tip,s.t),U=s.k<=3?72:60,S=p=>[70+U*p[0],185-U*p[1]],tipc=s.tip==='rail'?1:s.tip==='fixed'?2:0;
  let out=heading(c.f>0?`${c.f} degree${c.f===1?'':'s'} of freedom`:c.f===0?'0 freedoms: the chain is rigid':`${c.f}: more rules than numbers`);
  if(s.tip==='rail'){const a=S([-.4,D1_RAILY]),b=S([4.2,D1_RAILY]);out+=L(a[0],a[1],b[0],b[1],C.amber,3);for(let x=a[0]+6;x<b[0];x+=14)out+=L(x,a[1]+2,x-7,a[1]+10,C.amber,1.2);out+=TF(b[0],a[1]-8,'rail',13,C.amber,'end')}
  if(s.tip==='fixed'){const q=S(c.TT);out+=`<polygon points="${fmt(q[0])},${fmt(q[1])} ${fmt(q[0]-9)},${fmt(q[1]+15)} ${fmt(q[0]+9)},${fmt(q[1]+15)}" fill="${C.amberp}" stroke="${C.amber}" stroke-width="2"/>`+TF(q[0],q[1]+32,'fixed point',13,C.amber)}
  const sp=c.pts.map(S);
  for(let i=1;i<sp.length;i++)out+=L(sp[i-1][0],sp[i-1][1],sp[i][0],sp[i][1],C.blue,6);
  if(c.bad){const a=sp[sp.length-1],b=S(c.TT);out+=L(a[0],a[1],b[0],b[1],C.coral,2.5,D1_dash)+TBF((a[0]+b[0])/2,(a[1]+b[1])/2-12,'cannot reach',13,C.coral)}
  const b0=sp[0];
  if(s.pin)out+=`<polygon points="${fmt(b0[0])},${fmt(b0[1])} ${fmt(b0[0]-12)},${fmt(b0[1]+20)} ${fmt(b0[0]+12)},${fmt(b0[1]+20)}" fill="${C.pale}" stroke="${C.ink}" stroke-width="2"/>`+L(b0[0]-18,b0[1]+21,b0[0]+18,b0[1]+21,C.ink,2)+TF(b0[0],b0[1]+40,'pinned',13,C.muted);
  else out+=TF(b0[0],b0[1]+30,'free base',13,C.muted);
  sp.forEach((p,i)=>{out+=Ci(p[0],p[1],i===0||i===sp.length-1?7:6,'#fff',C.ink)});
  // count
  const x0=372,n=2*(s.k+1);let y=62;
  out+=TBF(x0,y,'Count',14,C.ink,'start');y+=22;
  out+=TF(x0,y,`${s.k+1} joints × 2 = ${n}`,14,C.ink,'start');y+=20;
  out+=TF(x0,y,`− ${s.k}  rod${s.k>1?'s':''} (one length each)`,13,C.coral,'start');y+=20;
  if(s.pin){out+=TF(x0,y,'− 2  base pinned',13,C.coral,'start');y+=20}
  if(tipc){out+=TF(x0,y,`− ${tipc}  tip ${s.tip==='rail'?'on a rail':'fixed'}`,13,C.coral,'start');y+=20}
  out+=L(x0,y-6,x0+200,y-6,C.line,1.4)+TBF(x0,y+14,`= ${c.f}`,16,c.f>0?C.blue:C.coral,'start');y+=44;
  out+=TF(x0,y,'Numbers that move it here:',13,C.muted,'start');y+=20;
  out+=TF(x0,y,c.params.length?c.params.join(', '):'none',13,C.ink,'start');y+=22;
  const ok=c.f>=0&&c.params.length===c.f;
  out+=TF(x0,y,c.f<0?'✕ no position obeys every rule':`${ok?'✓':'✕'} ${c.params.length} = ${c.f}`,13,ok?C.green:C.coral,'start');
  out+=D1_note('Counting assumes the rules are independent; special lengths can break that.',368);
  return {svg:out,phase:c.f>0?`${n} numbers place the ${s.k+1} joints; the rods and holds remove ${n-c.f}, leaving ${c.f}. The animation changes only ${c.params.join(', ')}; everything else follows from the rules.`:
   c.f===0?'The rules use up every number. The chain cannot move; it can only sit in isolated positions (here, the mirror-image position is the other one).':
   `One rod has 4 numbers for its two ends; the rod length, the pinned base and the fixed tip demand 5. Unless the fixed point is exactly one rod length away, no position obeys them all.`};
 }});

// Molecules: N atoms need 3N numbers. Moving or turning the whole molecule as a block takes 3 + 3 of them
// (3 + 2 if the atoms lie on one line, since turning about that line moves nothing; 3 + 0 for a single atom).
// The rest are vibrations. Geometry from typical bond lengths (Å) and angles; drawn as a schematic.
function D1_molecules(){
 const s3=Math.sqrt(3),hw=52.25*Math.PI/180,M={};
 M.Ar={name:'Argon atom',atoms:[['Ar',[0,0,0]]],bonds:[]};
 M.H2={name:'Hydrogen, H₂',atoms:[['H',[-.37,0,0]],['H',[.37,0,0]]],bonds:[[0,1]]};
 M.CO2={name:'Carbon dioxide, CO₂',atoms:[['O',[-1.16,0,0]],['C',[0,0,0]],['O',[1.16,0,0]]],bonds:[[0,1],[1,2]]};
 M.H2O={name:'Water, H₂O',atoms:[['O',[0,0,0]],['H',[.96*Math.sin(hw),0,-.96*Math.cos(hw)]],['H',[-.96*Math.sin(hw),0,-.96*Math.cos(hw)]]],bonds:[[0,1],[0,2]]};
 const hh=2*1.01*Math.sin(106.7/2*Math.PI/180),rho=hh/s3,h=Math.sqrt(1.01*1.01-rho*rho);
 M.NH3={name:'Ammonia, NH₃',atoms:[['N',[0,0,h]]].concat(range(3).map(i=>['H',[rho*Math.cos(2*Math.PI*i/3),rho*Math.sin(2*Math.PI*i/3),0]])),bonds:[[0,1],[0,2],[0,3]]};
 M.CH4={name:'Methane, CH₄',atoms:[['C',[0,0,0]]].concat([[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(v=>['H',v.map(a=>a*1.09/s3)])),bonds:[[0,1],[0,2],[0,3],[0,4]]};
 M.C2H2={name:'Acetylene, C₂H₂',atoms:[['H',[-1.66,0,0]],['C',[-.6,0,0]],['C',[.6,0,0]],['H',[1.66,0,0]]],bonds:[[0,1],[1,2],[2,3]]};
 M.C6H6={name:'Benzene, C₆H₆',atoms:range(6).map(i=>['C',[1.39*Math.cos(i*Math.PI/3),1.39*Math.sin(i*Math.PI/3),0]]).concat(range(6).map(i=>['H',[2.48*Math.cos(i*Math.PI/3),2.48*Math.sin(i*Math.PI/3),0]])),bonds:range(6).map(i=>[i,(i+1)%6]).concat(range(6).map(i=>[i,i+6]))};
 return M;
}
const D1_MOL=D1_molecules(),D1_MOL_ORDER=['Ar','H2','CO2','H2O','NH3','CH4','C2H2','C6H6'];
function D1_molCount(m){const r=m.atoms.map(a=>a[1]),N=r.length;let linear=N<=2;
 if(N>2){linear=true;const d=D1_sub3(r[1],r[0]);for(let i=2;i<N;i++)if(D1_norm(D1_cross(D1_sub3(r[i],r[0]),d))>1e-6)linear=false}
 const rot=N===1?0:linear?2:3;return {N,all:3*N,tr:3,rot,vib:3*N-3-rot,linear}}
const D1_ATOMC={H:'#ffffff',C:'#56656e',O:C.coral,N:C.blue,Ar:C.purple};
SCENE({id:'degrees-of-freedom-molecules',name:'A molecule’s many freedoms',tag:'3N − 6, from Lagrange’s counting',
 definition:'A molecule of N atoms needs 3N numbers to say where every atom is. Three of them move the whole molecule without changing its shape and three turn it, so 3N − 6 are left for vibrations, the ways its shape can change. If all the atoms lie on one line, turning about that line moves nothing, and 3N − 5 are left.',
 example:`Water has ${D1_molCount(D1_MOL.H2O).N} atoms, so ${D1_molCount(D1_MOL.H2O).all} numbers: 3 to move it, ${D1_molCount(D1_MOL.H2O).rot} to turn it, and ${D1_molCount(D1_MOL.H2O).vib} vibrations. Carbon dioxide also has ${D1_molCount(D1_MOL.CO2).N} atoms but is straight, so it has ${D1_molCount(D1_MOL.CO2).vib} vibrations. Benzene, with ${D1_molCount(D1_MOL.C6H6).N} atoms, has ${D1_molCount(D1_MOL.C6H6).all} numbers and ${D1_molCount(D1_MOL.C6H6).vib} vibrations. A system’s positions form a space with one dimension per freedom, the configuration space of era 8.`,
 desc:'A schematic molecule that moves, turns or vibrates, beside bars that split its 3N numbers into moving, turning and vibrating, computed from the atom count and from whether the atoms lie on one line.',
 research:['Lagrange (1788). Mécanique analytique.','Wilson, Decius & Cross (1955). Molecular Vibrations. McGraw-Hill (the 3N − 6 and 3N − 5 count of vibrational modes).'],
 dur:14,hint:'Pick a molecule and choose whether to move it, turn it or show one vibration. The split of its 3N numbers is computed; whether it is straight is tested from the atom positions.',
 init:()=>({mol:'H2O',mode:'vib',t:.25}),
 watch(p){const ks=['H2O','CO2','CH4','C6H6'],i=Math.min(3,Math.floor(p*4)),u=clamp(p*4-i,0,1);return {mol:ks[i],mode:u<.33?'move':u<.66?'turn':'vib',t:u}},
 ui:[{choose:D1_MOL_ORDER.map(k=>[k,k==='Ar'?'Ar':D1_MOL[k].name.split(', ')[1]]),label:'Molecule',get:s=>s.mol,act:'mol'},{choose:[['move','Move'],['turn','Turn'],['vib','Vibrate']],label:'Show',get:s=>s.mode,act:'mode'},{range:'t',label:'Time',min:0,max:100,get:s=>Math.round(s.t*100),act:'t'}],
 on:{mol(s,v){s.mol=D1_MOL[v]?v:'H2O'},mode(s,v){s.mode=['move','turn','vib'].includes(v)?v:'vib'},t(s,v){s.t=clamp(+v/100,0,1)}},
 draw(s){
  const m=D1_MOL[s.mol],c=D1_molCount(m),T=2*Math.PI*s.t;
  let pts=m.atoms.map(a=>a[1].slice());const cen=[0,1,2].map(i=>sum(pts.map(p=>p[i]))/pts.length);pts=pts.map(p=>D1_sub3(p,cen));
  if(s.mode==='vib'&&c.vib>0)pts=pts.map(p=>p.map(v=>v*(1+.1*Math.sin(2*T))));
  if(s.mode==='turn'&&c.rot>0)pts=pts.map(p=>D1_rx(D1_rz(p,.9*Math.sin(T)),.5*Math.sin(T)));
  if(s.mode==='move')pts=pts.map(p=>[p[0]+.5*Math.sin(T),p[1]+.4*Math.sin(2*T),p[2]+.3*Math.cos(T)]);
  const ext=Math.max(.8,...m.atoms.map(a=>D1_norm(D1_sub3(a[1],cen)))),pr=D1_cam(.5,.35,Math.min(95,125/ext),170,205);
  let out=heading(`${m.name}: ${c.N} atom${c.N>1?'s':''}, ${c.all} numbers`);
  const items=[];
  for(const [a,b] of m.bonds)items.push({at:pts[a].map((v,i)=>(v+pts[b][i])/2),svg:P=>{const p=P(pts[a]),q=P(pts[b]);return L(p[0],p[1],q[0],q[1],'#8aa0ad',5)}});
  m.atoms.forEach((a,i)=>items.push({at:pts[i],svg:P=>{const p=P(pts[i]),r=a[0]==='H'?10:a[0]==='Ar'?20:15;return Ci(p[0],p[1],r,D1_ATOMC[a[0]],C.ink)+TF(p[0],p[1]+5,a[0],13,a[0]==='H'?C.ink:'#fff')}}));
  out+=sortedItems(items,pr);
  // the split of 3N
  const x0=350,w=230,unit=Math.min(18,w/c.all);let yy=74;
  out+=TBF(x0,62,`3 × ${c.N} = ${c.all} numbers`,14,C.ink,'start');
  const bar=(lab,val,col,y)=>R(x0,y,Math.max(2,val*unit),20,col,'none',3)+TF(x0,y+38,`${lab}: ${val}`,13,C.ink,'start');
  out+=bar('move the whole',c.tr,C.blue,yy)+bar(c.rot===2?'turn (2: it is straight)':c.rot===0?'turn (0: a single point)':'turn the whole',c.rot,C.green,yy+56)+bar('vibrate (change shape)',c.vib,C.coral,yy+112);
  out+=TF(x0,yy+184,c.N===1?'One atom: nothing to turn or bend.':c.linear?'All atoms on one line: 3N − 5.':'Not all on one line: 3N − 6.',13,C.muted,'start');
  out+=TF(x0,yy+206,`${c.tr} + ${c.rot} + ${c.vib} = ${c.tr+c.rot+c.vib}`,14,C.ink,'start');
  out+=D1_note(`Schematic: typical bond lengths and angles. ${s.mode==='vib'?'The vibration shown is a breathing stretch, one of '+c.vib+'.':''}`,368);
  return {svg:out,phase:`${c.N} atom${c.N>1?'s':''} need ${c.all} numbers. ${c.tr} move the molecule as a block and ${c.rot} turn it${c.rot===2?' (a straight molecule has only 2 ways to turn that move anything)':''}, so ${c.vib} vibration${c.vib===1?'':'s'} remain${c.vib===1?'s':''}. ${s.mode==='move'?'Moving it changes 3 numbers and no distances.':s.mode==='turn'?(c.rot?'Turning it also keeps every distance between atoms.':'Turning a single atom changes nothing.'):(c.vib?'A vibration changes the distances between atoms.':'A single atom has no shape to change.')}`};
 }});

/* ===================== Lesson: flatland ===================== */
// A sphere of radius 1 whose centre is at height h above the plane meets it in a circle of radius √(1 − h²).
const D1_slice=h=>Math.abs(h)<1?Math.sqrt(1-h*h):0;
SCENE({id:'flatland',name:'A Sphere visits Flatland',tag:'Edwin A. Abbott, 1884',
 definition:'In Flatland: A Romance of Many Dimensions (1884) Edwin A. Abbott’s narrator, A. Square, lives in a plane. A Sphere passes through it, and all A. Square can see is where the Sphere meets his plane: a point, then a circle that grows, then shrinks, then a point again. A sphere of radius r whose centre is a height h from the plane meets it in a circle of radius √(r² − h²).',
 example:`With r = 1: at h = 0.6 the circle has radius √(1 − 0.36) = ${D1_f(D1_slice(.6))}; at h = 0 it is the full radius ${D1_f(D1_slice(0))}; at h = 1 it shrinks to a point; beyond that the Sphere is gone. Flatlanders see a circle edge-on, as a line, and judge its size by the shading along it.`,
 desc:'Left, a side view of a sphere passing down through a plane, with the slice marked. Right, the plane seen from above with the circle it makes, A. Square looking at it, and what he sees: a line. A guess circle can be drawn next to the computed one.',
 research:['Abbott (1884). Flatland: A Romance of Many Dimensions, by A Square. London: Seeley & Co.','Hinton (1880). What is the fourth dimension? Dublin University Magazine; reprinted in Scientific Romances (1884): the same analogy, four years before Flatland.'],
 dur:12,hint:'Set the Sphere’s height, guess the radius of the circle Flatland will see, then reveal the computed circle. Your guess is drawn dashed beside it.',
 init:()=>({h:.6,g:.5,rev:0}),
 watch(p){return {h:1.25-2.5*p,g:-1,rev:1}},
 ui:[{range:'h',label:'Height of the centre',min:-125,max:125,step:5,get:s=>Math.round(s.h*100),act:'h',show:v=>D1_f(v/100)},{range:'g',label:'Your guess for the radius',min:0,max:100,step:5,get:s=>Math.round(Math.max(0,s.g)*100),act:'g',show:v=>D1_f(v/100)},{b:'Reveal the circle',act:'rev'}],
 on:{h(s,v){s.h=clamp(+v/100,-1.25,1.25);s.rev=0},g(s,v){s.g=clamp(+v/100,0,1);s.rev=0},rev(s){s.rev=1}},
 draw(s){
  const rho=D1_slice(s.h),sc=55,cx=160,py=210,cy=py-sc*s.h;
  let out=heading(s.rev?(rho>0?`Flatland sees a circle of radius ${D1_fx(rho)}`:'The Sphere is not in the plane: nothing to see'):'Guess the circle, then reveal it');
  // side view
  out+=TF(30,58,'Side view (from Spaceland)',13,C.muted,'start');
  out+=Ci(cx,cy,sc,C.pale,C.blue)+L(cx,cy,cx,py,C.blue,1.4,D1_dash)+Ci(cx,cy,3,C.blue);
  out+=L(30,py,290,py,C.ink,2.5)+TF(290,py+20,'Flatland',13,C.ink,'end');
  if(rho>0&&s.rev){out+=L(cx-sc*rho,py,cx+sc*rho,py,C.coral,6)+L(cx,cy,cx+sc*rho,py,C.muted,1.2)+TF(cx-sc*rho-6,py-8,'slice',13,C.coral,'end')}
  // top view of Flatland
  const fx=320,fy=50,fw=262,fh=200,ccx=fx+150,ccy=fy+100,R0=60;
  out+=R(fx,fy,fw,fh,'#f4f8fb',C.line,6)+TF(fx+8,fy+18,'Flatland from above',13,C.muted,'start');
  out+=R(fx+36,ccy-8,16,16,'#fff',C.ink,1)+Ci(fx+52,ccy,2.4,C.ink)+TF(fx+44,ccy+28,'A. Square',13,C.ink);
  if(s.g>=0)out+=Ci(ccx,ccy,Math.max(1,R0*s.g),'none',C.purple,D1_dash);
  if(s.rev&&rho>0)out+=Ci(ccx,ccy,R0*rho,C.coralp,C.coral);
  if(!s.rev)out+=TF(ccx,ccy+5,'?',20,C.muted);
  // what A. Square sees: a line, brighter where the circle faces him
  const vy=fy+fh+26;out+=TF(fx,vy-6,'What A. Square sees: a line',13,C.muted,'start')+L(fx,vy+6,fx+fw,vy+6,C.grid,1);
  if(s.rev&&rho>0)for(let i=0;i<20;i++){const a=-Math.PI/2+Math.PI*(i+.5)/20,x1=ccx+R0*rho*Math.sin(a-Math.PI/40),x2=ccx+R0*rho*Math.sin(a+Math.PI/40);out+=L(x1,vy+6,x2,vy+6,tint(C.coral,.75*(1-Math.cos(a))),7,'stroke-linecap="butt"')}
  // tiles
  out+=D1_tile(30,300,82,'height h',D1_fx(s.h),C.blue)+D1_tile(120,300,90,'√(1 − h²)',s.rev?(rho>0?D1_fx(rho):'none'):'?',C.coral)+D1_tile(218,300,82,'your guess',s.g>=0?D1_fx(s.g):'–',C.purple);
  const gap=s.rev&&s.g>=0?Math.abs(s.g-rho):null;
  if(gap!==null)out+=TF(440,348,gap<.051?'Your guess is within 0.05.':`Your guess is off by ${D1_fx(gap)}.`,13,gap<.051?C.green:C.coral);
  return {svg:out,phase:!s.rev?`The Sphere’s centre is ${D1_fx(Math.abs(s.h))} ${s.h>=0?'above':'below'} the plane. How big a circle will Flatland see? Set your guess and reveal.`:rho>0?`Pythagoras in the side view: the slice radius ρ, the height h and the radius 1 make a right triangle, so ρ = √(1 − ${D1_fx(Math.abs(s.h))}²) = ${D1_fx(rho)}. A. Square sees only a line ${D1_fx(2*rho)} long and cannot tell a passing Sphere from a circle that grows and shrinks.`:'The centre is more than one radius from the plane, so the Sphere does not touch Flatland at all.'};
 }});

// The same rule one step up: an n-ball of radius 1 meets a hyperplane at height w in an (n−1)-ball of radius √(1 − w²).
// Adding up the slices gives the n-ball's volume; the scene integrates numerically and compares with π^(n/2)/Γ(n/2 + 1).
function D1_gamma(x){let g=Math.abs(x-Math.round(x))<1e-9?1:Math.sqrt(Math.PI),a=Math.abs(x-Math.round(x))<1e-9?1:.5;while(a<x-1e-9){g*=a;a+=1}return g}
const D1_ballV=n=>Math.pow(Math.PI,n/2)/D1_gamma(n/2+1);
const D1_sliceM=(n,w)=>D1_ballV(n-1)*Math.pow(Math.max(0,1-w*w),(n-1)/2);
function D1_simpson(fn,a,b,N){if(b<=a)return 0;N+=N%2;const h=(b-a)/N;let s=fn(a)+fn(b);for(let i=1;i<N;i++)s+=fn(a+i*h)*(i%2?4:2);return s*h/3}
const D1_VCACHE={};const D1_ballInt=n=>D1_VCACHE[n]!==undefined?D1_VCACHE[n]:(D1_VCACHE[n]=D1_simpson(w=>D1_sliceM(n,w),-1,1,20000));
const D1_WORLD=['','','Lineland','Flatland','our space'];
const D1_SLW=['','','a segment','a disc','a ball'];
const D1_MEAS=['','','length','area','volume'];
SCENE({id:'flatland-4ball',name:'A 4-ball passes through our space',tag:'The analogy one step up',
 definition:'Flatland’s lesson works in any dimension. A disc passing through Lineland shows a segment; a ball passing through Flatland shows a disc; a four-dimensional ball passing through our space would show a solid ball that appears, grows to full size and shrinks away. In each case the slice at distance w from the centre has radius √(1 − w²).',
 example:`Stacking the slices rebuilds the whole: the slices of a disc are segments of length 2√(1 − w²), and they add up to its area π. The slices of a 4-ball are balls of volume (4/3)π(1 − w²)^(3/2), and they add up to π²/2 ≈ ${D1_fx(D1_ballV(4),2)}, the 4-ball’s volume. Era 7 follows that formula into high dimensions.`,
 desc:'A graph of the slice radius and slice size against the distance w, shaded up to the current slice, beside a picture of the slice itself and tiles comparing the slices added up with the volume formula.',
 research:['Abbott (1884). Flatland, Part II: A. Square visits Lineland in a dream and is visited by the Sphere.','Cavalieri (1635). Geometria indivisibilibus continuorum: a solid’s volume from its slices (the principle used here).'],
 dur:12,hint:'Choose which ball passes through which world and move the slice. The running total adds up the slices so far; the full total is compared with the formula.',
 init:()=>({n:4,w:.5}),
 watch(p){const i=Math.min(2,Math.floor(p*3));return {n:i+2,w:-1+2*clamp((p*3-i)*1.1,0,1)}},
 ui:[{choose:[[2,'Disc · Lineland'],[3,'Ball · Flatland'],[4,'4-ball · our space']],label:'Which',get:s=>s.n,act:'n'},{range:'w',label:'Distance from the centre w',min:-100,max:100,step:5,get:s=>Math.round(s.w*100),act:'w',show:v=>D1_f(v/100)}],
 on:{n(s,v){s.n=clamp(Math.round(+v),2,4)},w(s,v){s.w=clamp(+v/100,-1,1)}},
 draw(s){
  const n=s.n,w=s.w,rho=D1_slice(w),m=D1_sliceM(n,w),mmax=D1_sliceM(n,0),run=D1_simpson(q=>D1_sliceM(n,q),-1,w,400),tot=D1_ballInt(n),form=D1_ballV(n);
  let out=heading(`A ${n}-ball through ${D1_WORLD[n]}: the slice is ${D1_SLW[n]}`);
  const x0=50,y0=62,pw=260,ph=188,ymax=Math.max(1,mmax)*1.1,XX=v=>x0+(v+1)/2*pw,YY=v=>y0+ph-v/ymax*ph;
  out+=R(x0,y0,pw,ph,'#fff',C.grid,4);
  const area=[[XX(-1),YY(0)]];for(let i=0;i<=80;i++){const q=-1+(w+1)*i/80;area.push([XX(q),YY(D1_sliceM(n,q))])}area.push([XX(w),YY(0)]);
  out+=D1_path(area,'none',0,C.coralp,'',true);
  const cr=[],cm=[];for(let i=0;i<=120;i++){const q=-1+2*i/120;cr.push([XX(q),YY(D1_slice(q))]);cm.push([XX(q),YY(D1_sliceM(n,q))])}
  out+=D1_path(cr,C.purple,2.4)+D1_path(cm,C.coral,2.4)+L(XX(w),y0,XX(w),y0+ph,C.ink,1.6,D1_dash);
  for(const v of [-1,0,1])out+=TF(XX(v),y0+ph+17,D1_f(v),13,C.muted);
  out+=TF(x0+pw/2,y0+ph+34,'distance from the centre, w',13,C.muted);
  out+=TF(x0+6,y0+16,`slice ${D1_MEAS[n]}`,13,C.coral,'start')+TF(x0+6,y0+34,'slice radius',13,C.purple,'start');
  // the slice itself
  const sx=445,sy=150,S0=70;
  out+=TF(sx,58,`What ${D1_WORLD[n]} sees`,13,C.muted);
  if(rho>0){if(n===2)out+=L(sx-S0*rho,sy,sx+S0*rho,sy,C.coral,7);
   else if(n===3)out+=Ci(sx,sy,S0*rho,C.coralp,C.coral);
   else{for(let i=5;i>=1;i--)out+=Ci(sx-S0*rho*.25*(1-i/5),sy-S0*rho*.25*(1-i/5),S0*rho*i/5,tint(C.coral,.2+.7*(1-i/5)),'none');out+=Ci(sx,sy,S0*rho,'none',C.coral)}}
  else out+=TF(sx,sy+5,'nothing',14,C.muted);
  out+=TF(sx,sy+S0+22,n===4?'a solid ball, here only drawn':`radius ${D1_fx(rho)}`,13,C.muted);
  const x1=340;
  out+=D1_tile(x1,262,118,'slice radius',D1_fx(rho),C.purple)+D1_tile(x1+124,262,118,`slice ${D1_MEAS[n]}`,D1_fx(m,3),C.coral);
  out+=D1_tile(x0,300,128,'slices so far',D1_fx(run,4),C.coral)+D1_tile(x0+134,300,128,'all slices',D1_fx(tot,4),C.ink)+D1_tile(x1,316,242,`formula π^(${n}/2) / Γ(${n}/2 + 1)`,D1_fx(form,4),C.blue);
  return {svg:out,phase:`At w = ${D1_fx(w)} the slice is ${D1_SLW[n]} of radius √(1 − w²) = ${D1_fx(rho)} and ${D1_MEAS[n]} ${D1_fx(m,3)}. Added up from w = −1 to 1, the slices give ${D1_fx(tot,4)}; the volume formula gives ${D1_fx(form,4)}.${n===4?' A visitor from four dimensions would look to us like a ball that appears from nowhere, swells and vanishes.':''}`};
 }});

// Escaping a closed room through the next direction. Path: lift the extra coordinate e, cross the wall, set it down.
const D1_esc=(u,extra)=>{const e=extra?.6*smooth(clamp(u/.3,0,1))*(1-smooth(clamp((u-.7)/.3,0,1))):0,x=1.6*smooth(clamp((u-.3)/.4,0,1));return {x:extra?x:Math.min(x,.88),e}};
// The moment the point crosses x = 1 (the wall), found by bisection on the path.
function D1_escCross(){let a=.3,b=.7;for(let i=0;i<40;i++){const m=(a+b)/2;if(D1_esc(m,1).x<1)a=m;else b=m}return (a+b)/2}
const D1_EN=['','x','x, y','x, y, z'],D1_EX=['','y','z','w'];
SCENE({id:'flatland-analogy',name:'Out of a locked room',tag:'Analogy, satire and séances',
 definition:'A Lineland point between two walls is trapped, unless it can step sideways into a second direction. A Flatlander inside a square is trapped, unless lifted into a third. By the same reasoning, a being free to move in a fourth direction could leave a locked box without opening it, and to us it would seem to pass through the wall. Abbott’s book is also a satire of Victorian society: Flatland ranks its men by their number of sides and confines its women, who are straight lines, by strict rules.',
 example:'In 1877–78 the astronomer Johann Zöllner held séances in Leipzig with the medium Henry Slade, who claimed to tie knots in a cord whose ends were sealed, a feat possible only through a fourth dimension. Zöllner took this as evidence of four-dimensional spirits. It was not: Slade had been exposed as a cheat in London in 1876, and the episode is now seen as conjuring, not physics.',
 desc:'A point trapped in a segment, a square or a cube. Lifting it into the next direction, it crosses the line where the wall is and is set down outside. A readout lists its coordinates, including the extra one, and shows its value at the moment the point crosses the wall.',
 research:['Abbott (1884). Flatland: A Romance of Many Dimensions.','Zöllner (1878). Wissenschaftliche Abhandlungen, vol. 2; English translation Transcendental Physics (1880, tr. C. C. Massey): his account of the Slade séances.','Discredited: Slade had been prosecuted in London in 1876 after Ray Lankester and Horatio Donkin caught him in fraud.'],
 dur:13,hint:'Choose the world and slide the point along its escape. Then switch off the extra direction and try again: without it the wall stops the point.',
 init:()=>({n:2,u:.5,extra:1}),
 watch(p){const i=Math.min(2,Math.floor(p*3));return {n:i+1,u:clamp((p*3-i)*1.1,0,1),extra:1}},
 ui:[{choose:[[1,'Lineland'],[2,'Flatland'],[3,'Our space']],label:'World',get:s=>s.n,act:'n'},{range:'u',label:'Escape',min:0,max:100,get:s=>Math.round(s.u*100),act:'u'},{choose:[[1,'Extra direction on'],[0,'Extra direction off']],label:'Extra',get:s=>s.extra,act:'extra'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),1,3)},u(s,v){s.u=clamp(+v/100,0,1)},extra(s,v){s.extra=+v?1:0}},
 draw(s){
  const n=s.n,q=D1_esc(s.u,s.extra),tc=D1_escCross(),ec=D1_esc(tc,1).e,out0=q.x>1;
  let out=heading(!s.extra&&q.x>=.88?'Without the extra direction, the wall stops it':out0?'Outside, and the wall was never touched':'Trapped inside, unless…');
  const co=n===1?[q.x,q.e]:n===2?[q.x,0,q.e]:[q.x,0,0,q.e];
  if(n===1){const ox=180,oy=250,u=90,S=(x,y)=>[ox+x*u,oy-y*u];
   out+=L(40,oy,340,oy,C.ink,2.5)+TF(340,oy+20,'Lineland',13,C.ink,'end');
   for(const x of [-1,1]){const a=S(x,0);out+=L(a[0],a[1]-14,a[0],a[1]+14,C.coral,6)}
   out+=TF(S(1,0)[0],oy+34,'wall',13,C.coral)+arrow(ox-150,oy+60,ox-150,oy-80,C.muted,1.6,8)+TF(ox-140,oy-74,'y: the extra direction',13,C.muted,'start');
   const path=[];for(let i=0;i<=60;i++){const r=D1_esc(i/60*s.u,s.extra);path.push(S(r.x,r.e))}out+=D1_path(path,C.purple,2,'none',D1_dash);
   const p=S(q.x,q.e);out+=Ci(p[0],p[1],8,C.purple,'#fff');
  }else{const pr=D1_cam(.62,.5,n===2?64:74,190,n===2?215:245);
   const sq=[[-1,-1],[1,-1],[1,1],[-1,1]];
   if(n===2){out+=`<polygon points="${[[-1.8,-1.6],[2,-1.6],[2,1.6],[-1.8,1.6]].map(v=>pr([v[0],v[1],0]).slice(0,2).map(fmt).join(',')).join(' ')}" fill="#f4f8fb" stroke="${C.line}" stroke-width="1"/>`;
    for(let i=0;i<4;i++){const a=pr([...sq[i],0]),b=pr([...sq[(i+1)%4],0]);out+=L(a[0],a[1],b[0],b[1],i===1?C.coral:C.ink,i===1?5:3.5)}
    const w=pr([1,-1,0]);out+=TF(w[0]+8,w[1]+18,'wall x = 1',13,C.coral,'start');
    const path=[];for(let i=0;i<=60;i++){const r=D1_esc(i/60*s.u,s.extra);path.push(pr([r.x,0,r.e]))}out+=D1_path(path,C.purple,2,'none',D1_dash);
    const p=pr([q.x,0,q.e]),g=pr([q.x,0,0]);out+=L(p[0],p[1],g[0],g[1],C.muted,1.2,D1_dash)+Ci(p[0],p[1],8,C.purple,'#fff');
    const z0=pr([-1.8,1.6,0]),z1=pr([-1.8,1.6,1]);out+=arrow(z0[0],z0[1],z1[0],z1[1],C.muted,1.6,8)+TF(z1[0],z1[1]-8,'z: extra',13,C.muted);
   }else{const cube=[];for(const z of [-1,1])for(const [x,y] of sq)cube.push([x,y,z*.8+.8]);
    const E=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    for(const [a,b] of E){const A=pr(cube[a]),B=pr(cube[b]),wall=cube[a][0]===1&&cube[b][0]===1;out+=L(A[0],A[1],B[0],B[1],wall?C.coral:C.ink,wall?4:2.2)}
    const w=pr([1,1,1.6]);out+=TF(w[0]+10,w[1]-6,'wall x = 1',13,C.coral,'start');
    const p=pr([q.x,0,.8]);out+=Ci(p[0],p[1],8,q.e>.001?'#fff':C.purple,C.purple,q.e>.001?'stroke-dasharray="3 2"':'');
    // the fourth coordinate cannot be drawn by position: a gauge and a number show it
    const gx=30,gy=90,gh=150;out+=R(gx,gy,18,gh,'#fff',C.line,4)+R(gx,gy+gh-gh*q.e/.6,18,gh*q.e/.6,C.purple,'none',4)+TF(gx+26,gy+10,'w',14,C.purple,'start')+TF(gx+26,gy+gh,'0',13,C.muted,'start')+TF(gx+26,gy+28,'0.6',13,C.muted,'start');
   }
  }
  const x0=372;out+=D1_tile(x0,58,210,`Coordinates (${D1_EN[n]}, ${D1_EX[n]})`,D1_list(co),C.purple);
  out+=TF(x0,132,`The wall is where x = 1 and ${D1_EX[n]} = 0.`,13,C.ink,'start');
  out+=TF(x0,154,s.extra?`Crossing x = 1, ${D1_EX[n]} = ${D1_fx(ec)}:`:`${D1_EX[n]} stays 0, so the point`,13,C.ink,'start')+TF(x0,174,s.extra?'it passes over the wall.':'meets the wall and stops.',13,s.extra?C.green:C.coral,'start');
  out+=TF(x0,206,`${D1_EX[n]} now: ${D1_fx(q.e)}`,14,C.purple,'start');
  if(n===3)out+=TF(x0,232,q.e>.001?'Drawn hollow: it is not in our space.':'Drawn solid: it is in our space.',13,C.muted,'start');
  out+=TF(x0,n===3?258:232,out0?'Outside the room.':'Inside the room.',14,out0?C.green:C.ink,'start');
  if(n===3)out+=D1_note('Our space is drawn; the fourth coordinate w is shown only by the gauge and the number.',366);
  return {svg:out,phase:!s.extra&&q.x>=.88?`With ${D1_EX[n]} held at 0 the point can only slide along x, and at x = 1 it meets the wall.`:n===3?`To us the point would seem to pass straight through the wall at x = 1. In fact it was ${D1_fx(ec)} away in the fourth direction as it crossed, so it never touched it. This is the trick Zöllner believed Slade performed; it is good mathematics and was bad evidence.`:`Lifted ${D1_fx(ec)} into the ${D1_EX[n]} direction, the point crosses x = 1 without meeting the wall, then comes back down outside. ${n===1?'A Linelander would see it vanish and reappear.':'A Flatlander would see it vanish from the room and reappear outside, as A. Square does when the Sphere lifts him.'}`};
 }});

/* ===================== Lesson: shadows-projection ===================== */
// A unit cube centred at the origin, turned by a about the vertical axis and then tilted by b about the x axis.
// Light falls straight down (along z), so the shadow of a point is its (x, y). The outline is the convex hull of the
// 8 shadow corners. Its area is checked against |ℓx| + |ℓy| + |ℓz|, where ℓ is the light direction in the cube's frame.
const D1_CUBE=D1_cubeVerts(3).map(v=>v.map(c=>c-.5)),D1_CUBE_E=D1_cubeEdges(3);
const D1_rad=d=>d*Math.PI/180;
const D1_turn=(p,a,b)=>D1_rx(D1_rz(p,D1_rad(a)),D1_rad(b));
const D1_HEXB=D1_deg(Math.atan(Math.SQRT2));
const D1_SHADOW_T={square:{a:0,b:0,say:'a square'},rect:{a:45,b:90,say:'a 1 × √2 rectangle'},hex:{a:45,b:D1_HEXB,say:'a regular hexagon'}};
function D1_shadow(a,b){
 const pts=D1_CUBE.map(p=>D1_turn(p,a,b)),hull=D1_hull(pts.map(p=>[p[0],p[1]])),sides=D1_sides(hull);
 const l=D1_rz(D1_rx([0,0,1],-D1_rad(b)),-D1_rad(a));
 return {pts,hull,sides,area:D1_area(hull),formula:Math.abs(l[0])+Math.abs(l[1])+Math.abs(l[2]),ratio:sides.length?Math.max(...sides)/Math.min(...sides):1};
}
const D1_SHT={};for(const k in D1_SHADOW_T)D1_SHT[k]=D1_shadow(D1_SHADOW_T[k].a,D1_SHADOW_T[k].b);
const D1_match=(sh,t)=>sh.hull.length===t.hull.length&&Math.abs(sh.area-t.area)<.02&&Math.abs(sh.ratio-t.ratio)<.05;
// Faces of the turned cube, for painting (corners indexed by bits x=1, y=2, z=4).
function D1_cubeFaces(pts,shift=[0,0,0],col=C.blue){const F=[];for(let i=0;i<3;i++)for(const v of [0,1]){const j=(i+1)%3,k=(i+2)%3,idx=[[0,0],[1,0],[1,1],[0,1]].map(([p,q])=>(v<<i)|(p<<j)|(q<<k));F.push({pts:idx.map(m=>pts[m].map((c,t)=>c+shift[t])),fill:col,opacity:.55})}return F}
function D1_shadowWatch(p){const k=Math.min(2,Math.floor(p*3)),u=smooth(clamp((p*3-k)*1.4,0,1)),from=[[20,10],[0,0],[45,90]][k],to=[[0,0],[45,90],[45,D1_HEXB]][k];return {a:lerp(from[0],to[0],u),b:lerp(from[1],to[1],u),target:['square','rect','hex'][k]}}
SCENE({id:'shadows-projection',name:'A cube’s shadows',tag:'Projection drops one direction',
 definition:'A shadow is a projection: light travelling in one direction flattens every point onto the floor, throwing away how high it was. The same cube casts a square face-on, a rectangle when the light runs along a face diagonal, and a regular hexagon when the light runs along its long diagonal. The outline is the convex hull of the eight shadow corners.',
 example:`For a unit cube the shadow’s area is |ℓx| + |ℓy| + |ℓz|, where ℓ is the light’s direction measured in the cube’s own axes: ${D1_f(D1_SHT.square.area,3)} face-on, √2 ≈ ${D1_fx(D1_SHT.rect.area,3)} along a face diagonal, and √3 ≈ ${D1_fx(D1_SHT.hex.area,3)} for the hexagon, its largest. Two of the eight corners then fall inside the outline, one above the other.`,
 desc:'Left, a turned cube above a floor with light falling straight down and its shadow. Right, the shadow seen from above: the eight shadow corners, their convex hull and a dashed target outline, with the number of sides, the area by two methods and the side lengths.',
 research:['Projection as the geometry of shadows goes back to perspective drawing: Dürer (1525), Underweysung der Messung.','Coxeter (1948). Regular Polytopes: orthogonal projections of polytopes, including the cube seen along a long diagonal.'],
 dur:14,hint:'Turn and tilt the cube to make its shadow match the dashed target. The buttons jump to the exact angles. Switch to 3D to turn the whole scene.',
 init:()=>({a:20,b:10,target:'hex'}),
 watch:D1_shadowWatch,
 ui:[{range:'a',label:'Turn',min:0,max:90,get:s=>Math.round(s.a),act:'a',show:v=>v+'°'},{range:'b',label:'Tilt',min:0,max:90,get:s=>Math.round(s.b),act:'b',show:v=>v+'°'},
  {choose:[['square','Target: square'],['rect','Rectangle'],['hex','Hexagon']],label:'Target',get:s=>s.target,act:'target'},{b:'Jump to the target',act:'jump'}],
 on:{a(s,v){s.a=clamp(+v,0,90)},b(s,v){s.b=clamp(+v,0,90)},target(s,v){s.target=D1_SHADOW_T[v]?v:'hex'},jump(s){const t=D1_SHADOW_T[s.target];s.a=t.a;s.b=t.b}},
 draw(s){
  const sh=D1_shadow(s.a,s.b),tg=D1_SHT[s.target],ok=D1_match(sh,tg),fz=-1.05;
  let out=heading(ok?`Match: ${D1_SHADOW_T[s.target].say}`:`A ${sh.hull.length}-sided shadow`);
  const pr=D1_cam(.62,.45,88,170,150);
  // floor and shadow
  out+=`<polygon points="${[[-1.2,-1.2],[1.2,-1.2],[1.2,1.2],[-1.2,1.2]].map(v=>pr([v[0],v[1],fz]).slice(0,2).map(fmt).join(',')).join(' ')}" fill="#eef2f4" stroke="${C.line}" stroke-width="1"/>`;
  out+=`<polygon points="${sh.hull.map(v=>pr([v[0],v[1],fz]).slice(0,2).map(fmt).join(',')).join(' ')}" fill="#8a9aa4" opacity=".6"/>`;
  for(const p of sh.pts){const a=pr(p),b=pr([p[0],p[1],fz]);out+=L(a[0],a[1],b[0],b[1],C.amber,1,'stroke-dasharray="2 4"')}
  out+=paintFaces(D1_cubeFaces(sh.pts),pr);
  for(const x of [28,48,68])out+=arrow(x,52,x,92,C.amber,2,7);
  out+=TF(80,78,'light',13,C.amber,'start');
  // top view of the shadow
  const cx=460,cy=150,u=78,S=v=>[cx+u*v[0],cy-u*v[1]];
  out+=TF(cx,56,'The shadow from above',13,C.muted);
  out+=`<polygon points="${sh.hull.map(v=>S(v).map(fmt).join(',')).join(' ')}" fill="#c9d3d9" stroke="${C.ink}" stroke-width="2"/>`;
  out+=`<polygon points="${tg.hull.map(v=>S(v).map(fmt).join(',')).join(' ')}" fill="none" stroke="${C.purple}" stroke-width="2" stroke-dasharray="6 4"/>`;
  const inside=sh.pts.filter(p=>!sh.hull.some(h=>Math.hypot(h[0]-p[0],h[1]-p[1])<1e-6)).length;
  for(const p of sh.pts){const q=S(p);out+=Ci(q[0],q[1],4,C.blue)}
  out+=D1_tile(340,268,118,'Sides of hull',String(sh.hull.length),C.ink)+D1_tile(464,268,118,'Corners inside',String(inside),C.blue);
  out+=D1_tile(30,268,148,'Area of the hull',D1_fx(sh.area,3),C.ink)+D1_tile(184,268,148,'|ℓx| + |ℓy| + |ℓz|',D1_fx(sh.formula,3),C.blue);
  out+=TF(30,340,`Side lengths from ${D1_fx(Math.min(...sh.sides),3)} to ${D1_fx(Math.max(...sh.sides),3)}`,13,C.ink,'start');
  out+=TF(582,340,ok?'✓ matches the dashed target':'dashed: the target',13,ok?C.green:C.purple,'end');
  return {svg:out,phase:`Turned ${D1_f(s.a,1)}° and tilted ${D1_f(s.b,1)}°, the cube’s 8 corners cast a shadow whose outline has ${sh.hull.length} sides and area ${D1_fx(sh.area,3)} (the formula gives ${D1_fx(sh.formula,3)}). ${ok?`That is ${D1_SHADOW_T[s.target].say}${s.target==='hex'?': all six sides '+D1_fx(sh.sides[0],3)+' long, with the two remaining corners hidden in the middle':''}.`:`The target is ${D1_SHADOW_T[s.target].say}.`} Height is lost: corners at different heights can land on the same spot.`};
 },
 three(s,f,X,project){
  const sh=D1_shadow(s.a,s.b),fz=-1.05,Pr=project([-1.25,1.25,-1.25,1.25,fz,1]);
  let out=poly3([[-1.25,-1.25,fz],[1.25,-1.25,fz],[1.25,1.25,fz],[-1.25,1.25,fz]],Pr,'#eef2f4',C.grid);
  out+=poly3(sh.hull.map(v=>[v[0],v[1],fz]),Pr,'#9aa8b0',C.ink);
  for(const p of sh.pts)out+=line3(p,[p[0],p[1],fz],Pr,C.amber,1.2,'stroke-dasharray="2 4"');
  out+=paintFaces(D1_cubeFaces(sh.pts),Pr);
  return {svg:out,title:'The cube and its shadow in 3D',caption:`The cube is turned ${D1_f(s.a,1)}° and tilted ${D1_f(s.b,1)}°; light falls straight down. Dotted lines join each corner to its shadow. The outline has ${sh.hull.length} sides.`};
 }});

// A point light at height H above the middle of a unit cube that stands on the floor, offset sideways by c.
// A point p casts its shadow where the ray from the light through p meets the floor: L + (p − L)·H/(H − z).
const D1_cast=(p,Lt)=>{const k=Lt[2]/(Lt[2]-p[2]);return [Lt[0]+(p[0]-Lt[0])*k,Lt[1]+(p[1]-Lt[1])*k]};
const D1_BOX=D1_cubeVerts(3).map(v=>[v[0]-.5,v[1]-.5,v[2]]);
SCENE({id:'shadows-projection-perspective',name:'A square inside a square',tag:'Light from a point',
 definition:'Light from a nearby point spreads out, so nearer parts of an object cast bigger shadows. A wire cube standing on the floor under a lamp casts its bottom face as itself and its top face as a larger square around it, joined by the shadows of the upright edges: a square inside a square. Every part of the shadow is still flat; the sizes carry the lost depth.',
 example:`With the lamp at height H above the floor, the top face (height 1) is enlarged H/(H − 1) times: ${D1_f(3/2)} when H = 3 and ${D1_f(5/4)} when H = 5. As the lamp moves far away the factor falls towards 1 and the rays become parallel. A four-dimensional cube drawn this way looks like a cube inside a cube, as the next scene shows.`,
 desc:'Left, a side view of a lamp above a wire cube with rays through its top corners to the floor. Right, the floor with the cube’s shadow: the bottom face, the larger shadow of the top face and the four joining edges, with the enlargement measured from the drawing and from the formula.',
 research:['Brook Taylor (1715). Linear Perspective: perspective as projection through a point.','Schlegel (1886) used the same projection through a point for four-dimensional polytopes (era 3, Schlegel diagrams).'],
 dur:11,hint:'Raise or lower the lamp and move it sideways. The enlargement is measured from the shadow’s corners and compared with H/(H − 1).',
 init:()=>({H:3,c:0}),
 watch(p){return {H:lerp(2,8,smooth(clamp(p*1.6,0,1))),c:p>.65?.45*smooth((p-.65)/.35):0}},
 ui:[{range:'H',label:'Lamp height H',min:18,max:100,step:1,get:s=>Math.round(s.H*10),act:'H',show:v=>D1_f(v/10,1)},{range:'c',label:'Lamp sideways',min:-50,max:50,step:5,get:s=>Math.round(s.c*100),act:'c',show:v=>D1_f(v/100)}],
 on:{H(s,v){s.H=clamp(+v/10,1.8,10)},c(s,v){s.c=clamp(+v/100,-.5,.5)}},
 draw(s){
  const Lt=[s.c,0,s.H],sh=D1_BOX.map(p=>D1_cast(p,Lt)),k=Math.abs(sh[4][0]-sh[5][0]),kf=s.H/(s.H-1);
  let out=heading(`The top face’s shadow is ${D1_fx(k,3)} times as wide`);
  // side view (x, z) through y = 0
  const sc=Math.min(70,212/s.H),ox=160,oy=284,S=([x,z])=>[ox+sc*x,oy-sc*z];
  out+=TF(30,58,'Side view',13,C.muted,'start')+L(20,oy,300,oy,C.ink,2)+TF(300,oy+18,'floor',13,C.muted,'end');
  const lp=S([s.c,s.H]);out+=Ci(lp[0],lp[1],8,C.amber,'#fff')+TF(lp[0]+12,lp[1]+5,'lamp',13,C.amber,'start');
  for(const x of [-.5,.5]){const top=S([x,1]),g=D1_cast([x,0,1],Lt),gp=S([g[0],0]);out+=L(lp[0],lp[1],gp[0],gp[1],C.amber,1.3,D1_dash)+Ci(gp[0],gp[1],3.5,C.ink)}
  out+=`<polygon points="${[[-.5,0],[.5,0],[.5,1],[-.5,1]].map(q=>S(q).map(fmt).join(',')).join(' ')}" fill="${C.pale}" stroke="${C.blue}" stroke-width="2.5"/>`;
  const hb=S([-1.2,s.H]);out+=L(hb[0],oy,hb[0],hb[1],C.muted,1)+TF(hb[0]-6,(oy+hb[1])/2,`H = ${D1_f(s.H,1)}`,13,C.muted,'end');
  // floor plan
  const cx=455,cy=165,u=55,F=q=>[cx+u*q[0],cy-u*q[1]];
  out+=TF(cx,58,'The shadow on the floor',13,C.muted);
  for(const [a,b,i] of D1_CUBE_E){const p=F(sh[a]),q=F(sh[b]),col=i===2?C.muted:(D1_BOX[a][2]===1?C.coral:C.blue);out+=L(p[0],p[1],q[0],q[1],col,i===2?1.8:2.8)}
  const lf=F([s.c,0]);out+=Ci(lf[0],lf[1],4,C.amber);
  out+=TF(cx,268,'blue: bottom face · red: top face',13,C.muted)+TF(cx,286,'dot: the point below the lamp',13,C.amber);
  out+=D1_tile(30,312,170,'Lamp height H',D1_f(s.H,1),C.amber)+D1_tile(210,312,180,'Width measured',D1_fx(k,3),C.coral)+D1_tile(400,312,182,'Formula H/(H − 1)',D1_fx(kf,3),C.blue);
  return {svg:out,phase:`The lamp is ${D1_f(s.H,1)} above the floor and the top face 1 above it, so similar triangles enlarge the top face’s shadow by ${D1_f(s.H,1)} ÷ ${D1_f(s.H-1,1)} = ${D1_fx(kf,3)}; measured from the drawing it is ${D1_fx(k,3)} times the bottom face. ${Math.abs(s.c)>.01?'Moved sideways, the lamp pushes the big square off centre: the picture distorts, but it is the same cube.':'The bottom face sits in the middle of the top face’s shadow.'}`};
 }});

// The tesseract: 16 vertices (all 0/1 lists of length 4, centred) and 32 edges (pairs differing in one place).
// It is turned in the xw plane by the scene and then projected to 3D, through a point at distance D along w or straight
// along w. The 3D view only turns the camera on that 3D result.
const D1_TV=D1_cubeVerts(4).map(v=>v.map(c=>c-.5)),D1_TE=D1_cubeEdges(4),D1_TD=2;
const D1_ECOL=[C.blue,C.coral,C.green,C.purple],D1_EDN=['x','y','z','w'];
function D1_tess(th,persp){
 const v4=D1_TV.map(([x,y,z,w])=>[x*Math.cos(th)-w*Math.sin(th),y,z,x*Math.sin(th)+w*Math.cos(th)]);
 const v3=v4.map(([x,y,z,w])=>{const k=persp?D1_TD/(D1_TD-w):1;return [x*k,y*k,z*k]});
 const l4=D1_TE.map(([a,b])=>D1_norm(D1_sub3(v4[a],v4[b]))),l3=D1_TE.map(([a,b])=>D1_norm(D1_sub3(v3[a],v3[b])));
 return {v4,v3,l4,l3};
}
function D1_cornerAngles(T,i){
 const nb=D1_TE.filter(e=>e[0]===i||e[1]===i).map(e=>e[0]===i?e[1]:e[0]),d4=[],d3=[];
 for(let a=0;a<nb.length;a++)for(let b=a+1;b<nb.length;b++){const u4=D1_sub3(T.v4[nb[a]],T.v4[i]),w4=D1_sub3(T.v4[nb[b]],T.v4[i]),u3=D1_sub3(T.v3[nb[a]],T.v3[i]),w3=D1_sub3(T.v3[nb[b]],T.v3[i]);
  d4.push(D1_deg(Math.acos(clamp(D1_dot(u4,w4)/D1_norm(u4)/D1_norm(w4),-1,1))));const n3=D1_norm(u3)*D1_norm(w3);d3.push(n3>1e-9?D1_deg(Math.acos(clamp(D1_dot(u3,w3)/n3,-1,1))):0)}
 return {nb,d4,d3};
}
const D1_vname=i=>D1_TV[i].map(c=>c>0?'1':'0').join('');
SCENE({id:'shadows-projection-tesseract',name:'The shadow of what?',tag:'Stringham, 1880',
 definition:`In 1880 Irving Stringham published the first drawings of four-dimensional polytopes, made by projection. The picture here is a three-dimensional shadow of the tesseract, the four-dimensional cube: ${D1_TV.length} corners and ${D1_TE.length} edges, with a smaller cube inside a larger one when the light comes from a point along the fourth direction. Every such picture is a projection, not the object itself.`,
 example:`A 3D model of two nested cubes joined at their corners would cast the same picture, so a shadow alone cannot decide what made it. What decides is the measurements: in four dimensions all ${D1_TE.length} edges have length 1 and the ${D1_TV[0].length} edges at every corner are at right angles to each other, which no 3D object can manage, because space has room for only 3 mutually perpendicular directions.`,
 desc:'A projected tesseract with its edges coloured and patterned by the coordinate that changes along them, a slider that turns it in the xw plane, and tiles with its computed corner and edge counts, its edge lengths in the shadow and in 4D, and the angles at a chosen corner.',
 research:['Stringham (1880). Regular figures in n-dimensional space. American Journal of Mathematics 3, 1–14.','Hinton (1888). A New Era of Thought: the word “tesseract”.'],
 dur:14,hint:'Turn the tesseract in the xw plane and switch between light from a point and parallel light. Press a corner to see its four edges, then answer: what could cast this shadow? Switch to 3D to turn the shadow itself.',
 init:()=>({th:0,persp:1,sel:0,ans:''}),
 watch(p){return {th:Math.PI/2*smooth(clamp((p-.15)/.7,0,1)),persp:1,sel:-1,ans:''}},
 ui:[{range:'th',label:'Turn in the xw plane',min:0,max:90,get:s=>Math.round(D1_deg(s.th)),act:'th',show:v=>v+'°'},{choose:[[1,'Light from a point'],[0,'Parallel light']],label:'Projection',get:s=>s.persp,act:'persp'},
  {choose:[['cubes','Two 3D cubes, joined'],['tess','One 4D cube']],label:'What casts it?',get:s=>s.ans,act:'ans'}],
 on:{th(s,v){s.th=D1_rad(clamp(+v,0,90))},persp(s,v){s.persp=+v?1:0},ans(s,v){s.ans=v==='cubes'?'cubes':'tess'},pick(s,v){s.sel=clamp(Math.round(+v),0,15);return 'keep'}},
 draw(s,f,X){
  const T=D1_tess(s.th,s.persp),pr=D1_cam(.62,.42,s.persp?118:150,190,200),sp=T.v3.map(pr);
  const sel=s.sel>=0?s.sel:-1,ca=sel>=0?D1_cornerAngles(T,sel):null;
  let out=heading(s.ans==='tess'?'Yes, if its edges are equal and square':s.ans==='cubes'?'Possible, but it cannot match the measurements':'A 3D shadow of a 4D cube');
  const order=D1_TE.map((e,i)=>i).sort((a,b)=>(sp[D1_TE[a][0]][2]+sp[D1_TE[a][1]][2])-(sp[D1_TE[b][0]][2]+sp[D1_TE[b][1]][2]));
  for(const j of order){const [a,b,i]=D1_TE[j],on=ca&&(a===sel||b===sel);out+=L(sp[a][0],sp[a][1],sp[b][0],sp[b][1],D1_ECOL[i],on?4.5:2,i===3?'stroke-dasharray="6 4"':'')}
  sp.forEach((p,i)=>{const inner=Ci(p[0],p[1],i===sel?8:5,i===sel?C.ink:'#fff',C.ink);out+=X&&X.try?hit(X,'pick',i,`Corner ${D1_vname(i)}`,Ci(p[0],p[1],12,'transparent')+inner):inner});
  if(sel>=0)out+=TBF(sp[sel][0]+10,sp[sel][1]-10,D1_vname(sel),13,C.ink,'start');
  // legend: colour and pattern
  D1_EDN.forEach((n,i)=>{const y=318+(i>1?20:0),x=30+(i%2)*90;out+=L(x,y,x+26,y,D1_ECOL[i],3,i===3?'stroke-dasharray="6 4"':'')+TF(x+32,y+5,n+' edges',13,C.ink,'start')});
  const x0=390,V=T.v4.length,E=D1_TE.length,Ef=2**3*4;
  out+=D1_tile(x0,56,92,'Corners',String(V),C.ink)+D1_tile(x0+98,56,94,'Edges',String(E),C.ink);
  out+=TF(x0,122,`${E===Ef?'✓':'✕'} 2³ × 4 = ${Ef} edges by formula`,13,E===Ef?C.green:C.coral,'start');
  out+=TF(x0,148,'Edge lengths',13,C.muted,'start')+TF(x0,168,`in 4D: ${D1_fx(Math.min(...T.l4),3)} to ${D1_fx(Math.max(...T.l4),3)}`,13,C.ink,'start')+TF(x0,188,`in the shadow: ${D1_fx(Math.min(...T.l3),2)} to ${D1_fx(Math.max(...T.l3),2)}`,13,C.ink,'start');
  if(ca){out+=TF(x0,216,`At corner ${D1_vname(sel)}, ${ca.nb.length} edges meet;`,13,C.muted,'start')+TF(x0,236,Math.max(...ca.d4)-Math.min(...ca.d4)<1e-6?`angles in 4D: all ${D1_f(ca.d4[0],1)}°`:`angles in 4D: ${D1_f(Math.min(...ca.d4),1)}° to ${D1_f(Math.max(...ca.d4),1)}°`,13,C.ink,'start')+TF(x0,256,`in the shadow: ${D1_f(Math.min(...ca.d3),0)}° to ${D1_f(Math.max(...ca.d3),0)}°`,13,C.ink,'start')}
  out+=D1_note(s.persp?'Projected through a point on the w axis at distance 2. A projection, not the tesseract.':'Projected straight along w: a projection, not the tesseract.',366);
  const ph=s.ans==='tess'?`One 4D cube fits every measurement: its ${E} edges all have length ${D1_fx(T.l4[0],0)} and at each corner the ${ca?ca.nb.length:4} edges meet at ${ca?D1_f(ca.d4[0],0):'90'}°. The shadow stretches some edges (${D1_fx(Math.min(...T.l3),2)} to ${D1_fx(Math.max(...T.l3),2)}) and bends the right angles, as a cube’s shadow does.`:
   s.ans==='cubes'?`A 3D wire model of nested cubes could cast this very picture: a shadow cannot prove what made it. But in 3D the four edges at a corner cannot all be at right angles and equal; at most three directions can be mutually perpendicular. The measurements need a fourth direction.`:
   `${V} corners and ${E} edges, generated as all 0/1 lists of length 4 and the pairs that differ in one place. ${s.th>.05?`Turning in the xw plane by ${D1_f(D1_deg(s.th),0)}° moves the inner cube outwards and the outer one in: in 4D nothing changes size, only the shadow does.`:s.persp?'The small cube is the end farther from the point of projection along w, the large one the nearer end; all eight cubes are the same size in 4D.':(s.th<.05?'Straight along w, the two ends land exactly on top of each other: 16 corners, but only 8 places in the shadow.':'')}`;
  return {svg:out,phase:ph};
 },
 three(s,f,X,project){
  const T=D1_tess(s.th,s.persp),Pr=project(T.v3);let out='';
  for(const [a,b,i] of D1_TE)out+=line3(T.v3[a],T.v3[b],Pr,D1_ECOL[i],2.4,i===3?'stroke-dasharray="6 4"':'');
  for(const p of T.v3)out+=point3(p,Pr,'#fff',4.5,C.ink);
  return {svg:out,title:'The tesseract’s 3D shadow',caption:`The scene turns the tesseract ${D1_f(D1_deg(s.th),0)}° in the xw plane and projects it to 3D ${s.persp?'through a point on the w axis':'along w'}; this view only turns the camera on that 3D shadow. Dashed edges run in the w direction.`};
 }});

/* ===================== Lesson: n-distance ===================== */
// Pythagoras one coordinate at a time: each new side a_k is at right angles to the diagonal so far, so the new
// diagonal is the hypotenuse of a right triangle with legs d_(k−1) and a_k. The staircase is built from the drawn
// points and its lengths are compared with √(a₁² + … + aₙ²).
function D1_stair(n,grow){
 const a=range(n).map(i=>grow?i+1:1),P=[[0,0],[a[0],0]];
 for(let k=1;k<n;k++){const q=P[P.length-1],r=Math.hypot(q[0],q[1]);P.push([q[0]-q[1]/r*a[k],q[1]+q[0]/r*a[k]])}
 const d=P.slice(1).map(q=>Math.hypot(q[0],q[1])),sq=[];let acc=0;for(const v of a){acc+=v*v;sq.push(acc)}
 return {a,P,d,sq};
}
SCENE({id:'n-distance',name:'Pythagoras, one coordinate at a time',tag:'The diagonal of an n-dimensional box',
 definition:'A box’s diagonal is found by Pythagoras applied once for each new direction. The diagonal of the base is the hypotenuse of a right triangle whose legs are two sides; the third side stands at right angles to that diagonal, so the long diagonal is the hypotenuse of a second right triangle. Each new dimension adds one more triangle and one more square under the root: d = √(a₁² + a₂² + … + aₙ²).',
 example:`For a unit cube in n dimensions every side is 1, so the long diagonal is √n: √2 ≈ ${D1_fx(D1_stair(2,0).d[1],3)} for the square, √3 ≈ ${D1_fx(D1_stair(3,0).d[2],3)} for the cube, and exactly ${D1_surd(4)} for the four-dimensional cube, twice its edge. In nine dimensions it is ${D1_surd(9)}.`,
 desc:'A staircase of right triangles, each new leg one more side of the box at right angles to the diagonal so far, beside a table of the running sum of squares and the diagonal, measured from the drawing and given in exact form.',
 research:['Euclid, Elements I.47 (Pythagoras’ theorem), applied once per coordinate.','Cayley (1843). Chapters in the analytical geometry of (n) dimensions: distance in n coordinates by the same sum of squares.'],
 dur:12,hint:'Add or remove a dimension and watch one more right triangle join the staircase. Switch to sides 1, 2, 3, … to see the same rule with unequal sides.',
 init:()=>({n:4,grow:0}),
 watch(p){return {n:clamp(1+Math.floor(p*9.2),1,9),grow:0}},
 ui:[{b:'Add a dimension',act:'add'},{b:'Remove one',act:'rem'},{choose:[[0,'All sides 1'],[1,'Sides 1, 2, 3, …']],label:'Sides',get:s=>s.grow,act:'grow'}],
 on:{add(s){s.n=Math.min(10,s.n+1)},rem(s){s.n=Math.max(1,s.n-1)},grow(s,v){s.grow=+v?1:0}},
 draw(s){
  const st=D1_stair(s.n,s.grow),dn=st.d[s.n-1],sc=140/dn,cx=175,cy=205,S=q=>[cx+sc*q[0],cy-sc*q[1]];
  let out=heading(`${s.n} dimension${s.n>1?'s':''}: the long diagonal is ${D1_surd(st.sq[s.n-1])}${D1_surd(st.sq[s.n-1]).includes('√')?' ≈ '+D1_fx(dn,3):''}`);
  for(let k=1;k<st.P.length;k++){const O=S([0,0]),A=S(st.P[k-1]),B=S(st.P[k]);
   out+=`<polygon points="${[O,A,B].map(q=>q.map(fmt).join(',')).join(' ')}" fill="${k===st.P.length-1?C.coralp:(k%2?C.pale:'#f2f6f9')}" stroke="${C.line}" stroke-width="1"/>`;
   out+=L(A[0],A[1],B[0],B[1],k===st.P.length-1?C.coral:C.blue,3)}
  const O=S([0,0]),E=S(st.P[st.P.length-1]);out+=L(O[0],O[1],E[0],E[1],C.ink,3.5)+Ci(O[0],O[1],4,C.ink);
  st.P.slice(1).forEach((q,i)=>{const p=S(q),r=Math.hypot(p[0]-cx,p[1]-cy)||1,lx=p[0]+(p[0]-cx)/r*16,ly=p[1]+(p[1]-cy)/r*16+5;out+=TF(lx,ly,D1_surd(st.sq[i]),13,i===s.n-1?C.ink:C.muted)});
  // table
  const x0=352;let y=62;
  out+=TF(x0,y,'n',13,C.muted,'start')+TF(x0+34,y,'new side²',13,C.muted,'start')+TF(x0+118,y,'sum',13,C.muted,'start')+TF(x0+165,y,'diagonal',13,C.muted,'start');
  for(let k=0;k<s.n;k++){y+=20;const cur=k===s.n-1,col=cur?C.ink:C.muted;
   out+=TF(x0,y,String(k+1),13,col,'start')+TF(x0+34,y,`+ ${st.a[k]}² = ${st.a[k]*st.a[k]}`,13,col,'start')+TF(x0+118,y,String(st.sq[k]),13,col,'start')+TF(x0+165,y,D1_surd(st.sq[k]).includes('√')?`${D1_surd(st.sq[k])} ≈ ${D1_fx(st.d[k],3)}`:D1_surd(st.sq[k]),13,col,'start')}
  const err=Math.abs(dn-Math.sqrt(st.sq[s.n-1]));
  out+=D1_tile(30,318,170,'Measured in the drawing',D1_fx(dn,4),C.ink)+D1_tile(206,318,150,`√(sum of squares)`,D1_fx(Math.sqrt(st.sq[s.n-1]),4),C.blue);
  out+=TF(372,348,err<1e-9?'✓ they agree':'✕ they differ',13,err<1e-9?C.green:C.coral,'start');
  return {svg:out,phase:`${s.n===1?'One side alone: the diagonal is just the side.':`Each new side is at right angles to the diagonal so far, so one more right triangle adds ${st.a[s.n-1]}² to the sum.`} The sum of squares is ${st.sq[s.n-1]} and the long diagonal ${D1_surd(st.sq[s.n-1])}${D1_surd(st.sq[s.n-1]).includes('√')?' ≈ '+D1_fx(dn,3):''}. ${!s.grow&&s.n===4?'In four dimensions the unit cube’s long diagonal is exactly 2, twice its edge.':''}`};
 }});

// Distance between two points: subtract coordinate by coordinate, square, add, take the root.
const D1_DA=[1,-2,0,2,-1,3],D1_DB=[-1,1,2,2,1,0];
SCENE({id:'n-distance-points',name:'The distance between two points',tag:'One rule for every dimension',
 definition:'The distance between two points is the square root of the sum of the squares of their coordinate differences: d = √((x₁ − y₁)² + … + (xₙ − yₙ)²). It is the same formula in the plane, in space and in any number of dimensions; only the number of terms changes. Coordinates that agree add nothing.',
 example:`A = ${D1_list(D1_DA.slice(0,4))} and B = ${D1_list(D1_DB.slice(0,4))} differ by ${D1_DA.slice(0,4).map((a,i)=>Math.abs(a-D1_DB[i])).join(', ')} along the four axes, so d² = ${D1_DA.slice(0,4).map((a,i)=>(a-D1_DB[i])**2).join(' + ')} = ${sum(D1_DA.slice(0,4).map((a,i)=>(a-D1_DB[i])**2))} and d = √${sum(D1_DA.slice(0,4).map((a,i)=>(a-D1_DB[i])**2))} ≈ ${D1_fx(Math.sqrt(sum(D1_DA.slice(0,4).map((a,i)=>(a-D1_DB[i])**2))),3)}. Add a fifth coordinate where A has ${D1_f(D1_DA[4])} and B has ${D1_f(D1_DB[4])}, and d² grows by ${(D1_DA[4]-D1_DB[4])**2} to ${sum(D1_DA.slice(0,5).map((a,i)=>(a-D1_DB[i])**2))}.`,
 desc:'Two points drawn in parallel coordinates, one axis per coordinate, with their difference on each axis marked, beside a bar for each squared difference, their sum and the distance.',
 research:['Cayley (1843). Chapters in the analytical geometry of (n) dimensions.','Grassmann (1844). Die lineale Ausdehnungslehre: lengths and directions in any number of dimensions.'],
 dur:12,hint:'Choose how many coordinates, pick point A or B, and press a mark on an axis to move that point’s coordinate. Watch which squared differences change.',
 init:()=>({n:4,A:D1_DA.slice(),B:D1_DB.slice(),who:'A'}),
 watch(p){return {n:clamp(2+Math.floor(p*5.2),2,6),A:D1_DA.slice(),B:D1_DB.slice(),who:'A'}},
 ui:[{choose:[[2,'2'],[3,'3'],[4,'4'],[5,'5'],[6,'6']],label:'Coordinates n',get:s=>s.n,act:'n'},{choose:[['A','Move A'],['B','Move B']],label:'Point',get:s=>s.who,act:'who'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),2,6)},who(s,v){s.who=v==='B'?'B':'A'},set(s,v){const [i,a]=String(v).split(',').map(Number);if(i>=0&&i<6&&Math.abs(a)<=3)s[s.who][i]=a}},
 draw(s,f,X){
  const n=s.n,A=s.A.slice(0,n),B=s.B.slice(0,n),df=A.map((a,i)=>a-B[i]),sq=df.map(v=>v*v),tot=sum(sq);
  let out=heading(`In ${n} dimensions: d = ${D1_surd(tot)}${D1_surd(tot).includes('√')?' ≈ '+D1_fx(Math.sqrt(tot),3):''}`);
  out+=D1_pcAxes(n,X,X&&X.try?'set':null,`Set ${s.who}’s`);
  for(let i=0;i<n;i++){const x=D1_PCX(i,n);if(df[i])out+=L(x+9,D1_PCY(A[i]),x+9,D1_PCY(B[i]),C.amber,5)}
  const pa=A.map((a,i)=>[D1_PCX(i,n),D1_PCY(a)]),pb=B.map((b,i)=>[D1_PCX(i,n),D1_PCY(b)]);
  out+=D1_path(pa,C.purple,2.6)+D1_path(pb,C.green,2.6,'none',D1_dash);
  pa.forEach(p=>{out+=Ci(p[0],p[1],6,C.purple,'#fff')});pb.forEach(p=>{out+=R(p[0]-5,p[1]-5,10,10,C.green,'#fff',2)});
  out+=Ci(40,348,6,C.purple)+TF(52,353,'A '+D1_list(A),13,C.purple,'start')+R(220,342,10,10,C.green,'none',2)+TF(236,353,'B '+D1_list(B),13,C.green,'start');
  const x0=405,bw=170,mx=Math.max(9,...sq);let y=64;
  out+=TF(x0,y,'squared differences',13,C.muted,'start');
  for(let i=0;i<n;i++){y+=28;out+=TF(x0,y,`${D1_xi(i+1)}: (${D1_f(A[i])} − ${D1_par(B[i])})² = ${sq[i]}`,13,C.ink,'start')+R(x0,y+4,Math.max(1,bw*sq[i]/mx),8,C.amber,'none',2)}
  y+=30;out+=L(x0,y-12,x0+bw,y-12,C.line,1.4)+TBF(x0,y+4,`sum d² = ${tot}`,14,C.ink,'start');
  out+=D1_tile(x0,y+16,bw,'distance d',`${D1_surd(tot)}${D1_surd(tot).includes('√')?' ≈ '+D1_fx(Math.sqrt(tot),3):''}`,C.blue);
  return {svg:out,phase:`A and B differ by ${df.map(v=>D1_f(Math.abs(v))).join(', ')} along the ${n} axes. Squaring and adding gives ${sq.join(' + ')} = ${tot}, so the distance is ${D1_surd(tot)}${D1_surd(tot).includes('√')?' ≈ '+D1_fx(Math.sqrt(tot),3):''}. ${df.some(v=>v===0)?'Where the coordinates agree the axis adds nothing.':''}`};
 }});

// Angles from the dot product: cos θ = u·v / (|u| |v|), in any number of dimensions.
const D1_PAIRS={
 edge:{say:'long diagonal and an edge',u:n=>range(n).map(()=>1),v:n=>range(n).map(i=>i===0?1:0)},
 face:{say:'long diagonal and a face diagonal',u:n=>range(n).map(()=>1),v:n=>range(n).map(i=>i<2?1:0)},
 diag:{say:'two long diagonals',u:n=>range(n).map(()=>1),v:n=>range(n).map(i=>i<Math.ceil(n/2)?1:-1)}};
const D1_angle=(u,v)=>D1_deg(Math.acos(clamp(D1_dot(u,v)/D1_norm(u)/D1_norm(v),-1,1)));
SCENE({id:'n-distance-angle',name:'Angles from the dot product',tag:'Cauchy’s inequality keeps cosines honest',
 definition:'The dot product of two lists, u·v = u₁v₁ + … + uₙvₙ, measures how much two directions agree. Dividing by both lengths gives the cosine of the angle between them, cos θ = u·v / (|u| |v|), in any number of dimensions. Cauchy proved in 1821 that (u·v)² ≤ (u·u)(v·v), so this cosine always lies between −1 and 1 and the angle always exists.',
 example:`The long diagonal (1, 1, …, 1) and the edge (1, 0, …, 0) have dot product 1 and lengths √n and 1, so cos θ = 1/√n: ${D1_f(D1_angle([1,1],[1,0]),2)}° in the square, about ${D1_f(D1_angle([1,1,1],[1,0,0]),2)}° in the cube, exactly ${D1_f(D1_angle([1,1,1,1],[1,0,0,0]),2)}° in four dimensions, and closer to 90° the higher you go. Two long diagonals of the tesseract, (1, 1, 1, 1) and (1, 1, −1, −1), are at ${D1_f(D1_angle([1,1,1,1],[1,1,-1,-1]),2)}°.`,
 desc:'Two direction lists with their dot product worked term by term, a small drawing of the two directions in a square or cube when n is 2 or 3, and a graph of the computed angle against the number of dimensions.',
 research:['Cauchy (1821). Cours d’analyse, Note II: (Σaᵢbᵢ)² ≤ Σaᵢ² · Σbᵢ².','Grassmann (1844). Die lineale Ausdehnungslehre: products of directions in any number of dimensions.'],
 dur:13,hint:'Choose a pair of directions in the n-dimensional cube and change n. The graph shows the angle computed for every n from 2 to 12; the dot marks your n.',
 init:()=>({n:4,pair:'edge'}),
 watch(p){const ks=['edge','diag'],i=p<.5?0:1;return {n:clamp(2+Math.floor((p*2-i)*11),2,12),pair:ks[i]}},
 ui:[{choose:[['edge','Diagonal · edge'],['face','Diagonal · face diagonal'],['diag','Two diagonals']],label:'Pair',get:s=>s.pair,act:'pair'},{range:'n',label:'Dimensions n',min:2,max:12,get:s=>s.n,act:'n'}],
 on:{pair(s,v){s.pair=D1_PAIRS[v]?v:'edge'},n(s,v){s.n=clamp(Math.round(+v),2,12)}},
 draw(s){
  const pr=D1_PAIRS[s.pair],n=s.n,u=pr.u(n),v=pr.v(n),dt=D1_dot(u,v),nu=D1_norm(u),nv=D1_norm(v),th=D1_angle(u,v);
  let out=heading(`${pr.say[0].toUpperCase()+pr.say.slice(1)}: ${D1_f(th,2)}° in ${n} dimensions`);
  const sh=a=>a.length>7?'('+a.slice(0,6).map(x=>D1_f(x)).join(', ')+', …)':D1_list(a);
  out+=TF(30,64,'u = '+sh(u),14,C.purple,'start')+TF(30,86,'v = '+sh(v),14,C.green,'start');
  const terms=u.map((a,i)=>`${D1_par(a)}×${D1_par(v[i])}`);
  out+=TF(30,112,`u·v = ${terms.length>4?terms.slice(0,4).join(' + ')+' + …':terms.join(' + ')} = ${dt}`,13,C.ink,'start');
  out+=TF(30,134,`|u| = ${D1_surd(D1_dot(u,u))},  |v| = ${D1_surd(D1_dot(v,v))},  cos θ = ${D1_fx(dt/nu/nv,4)}`,13,C.ink,'start');
  if(n<=3){const P=D1_cam(.62,.42,n===2?90:70,170,n===2?250:255),u3=u.concat([0,0]).slice(0,3),v3=v.concat([0,0]).slice(0,3);
   const vs=D1_cubeVerts(n).map(q=>q.concat([0,0]).slice(0,3).map((c,i)=>i<n?c-.5:0)),es=D1_cubeEdges(n);
   const PP=n===2?(q=>[170+90*q[0],250-90*q[1]]):P;
   for(const [a,b] of es){const p=PP(vs[a]),q=PP(vs[b]);out+=L(p[0],p[1],q[0],q[1],C.line,1.6)}
   const o=PP([0,0,0]),hu=PP(u3.map(c=>c/2)),hv=PP(v3.map(c=>c/2));out+=arrow(o[0],o[1],hu[0],hu[1],C.purple,3,9)+arrow(o[0],o[1],hv[0],hv[1],C.green,3,9);
   out+=TF(170,354,'from the centre: halves of u and v',13,C.muted)}
  else out+=TF(170,230,`No drawing of ${n} axes at right angles,`,13,C.muted)+TF(170,250,'but the numbers give the angle exactly.',13,C.muted);
  // graph of the angle for n = 2..12
  const gx=370,gy=70,gw=200,gh=190,XX=k=>gx+(k-2)/10*gw,YY=a=>gy+gh-a/90*gh;
  out+=R(gx,gy,gw,gh,'#fff',C.grid,4);
  for(const a of [0,45,90])out+=L(gx,YY(a),gx+gw,YY(a),C.grid,1)+TF(gx-6,YY(a)+5,a+'°',13,C.muted,'end');
  const pts=range(11).map(i=>{const k=i+2;return [XX(k),YY(D1_angle(pr.u(k),pr.v(k)))]});out+=D1_path(pts,C.blue,2);
  pts.forEach((p,i)=>{out+=Ci(p[0],p[1],i+2===n?7:3,i+2===n?C.coral:C.blue,i+2===n?'#fff':'none')});
  for(const k of [2,4,8,12])out+=TF(XX(k),gy+gh+18,String(k),13,C.muted);
  out+=TF(gx+gw/2,gy+gh+36,'dimensions n',13,C.muted);
  out+=D1_tile(gx,300,gw,'Angle, computed',`${D1_f(th,2)}°`,C.coral);
  return {svg:out,phase:`u·v = ${dt}, |u| = ${D1_surd(D1_dot(u,u))} and |v| = ${D1_surd(D1_dot(v,v))}, so cos θ = ${D1_fx(dt/nu/nv,4)} and θ = ${D1_f(th,2)}°. ${s.pair==='diag'?(n%2?'In odd dimensions two long diagonals can never be exactly perpendicular: their dot product is a sum of an odd number of ±1 terms, so it cannot be 0.':'In every even dimension some pair of long diagonals is exactly perpendicular.'):`As n grows the cosine shrinks like ${s.pair==='edge'?'1/√n':'√(2/n)'}, so the diagonal becomes almost perpendicular to every edge: era 7 returns to this.`}`};
 }});

/* ===================== Lesson: what-is-dimension ===================== */
// Cantor's matching: interleave the decimal digits of x and y to make one number t, and split t's digits to undo it.
const D1_dig=v=>pad(String(v),4).split('').map(Number);
const D1_weave=(xd,yd)=>xd.flatMap((d,i)=>[d,yd[i]]);
const D1_unweave=td=>[td.filter((d,i)=>i%2===0),td.filter((d,i)=>i%2===1)];
// The snag: two digit strings for t whose x-halves are 0.1999… and 0.2000…, the same number.
const D1_SNAG=[D1_weave([1,9,9,9,9],[0,0,0,0,0]),D1_weave([2,0,0,0,0],[0,0,0,0,0])];
SCENE({id:'what-is-dimension',name:'As many points in a line as in a square',tag:'Cantor to Dedekind, 1877',
 definition:'In 1877 Georg Cantor showed that the points of a square can be matched one to one with the points of a line: take the decimal digits of x and y and interleave them into one number t; split t’s digits apart to go back. “Je le vois, mais je ne le crois pas”, he wrote to Richard Dedekind: I see it, but I do not believe it. If a line and a square have the same number of points, counting points cannot tell their dimensions apart.',
 example:`x = 0.2718 and y = 0.1414 give t = 0.${D1_weave(D1_dig(2718),D1_dig(1414)).join('')}; splitting t’s digits in turn gives back x and y. There was a snag, which Dedekind pointed out: 0.1999… and 0.2000… are the same number, so the bare digit trick is not exactly one to one. Cantor repaired the proof, and published it in 1878.`,
 desc:'A square with a point (x, y) and a line with the point t, beside the digits of x, y and t, with each digit of t labelled by where it came from. A second panel shows the snag: two different digit strings for t that give the same point.',
 research:['Cantor to Dedekind, letter of 29 June 1877 (“Je le vois, mais je ne le crois pas”); Cantor (1878). Ein Beitrag zur Mannigfaltigkeitslehre. Journal für die reine und angewandte Mathematik 84, 242–258.','Dedekind’s reply of 2 July 1877 pointed out the gap that numbers such as 0.1999… = 0.2000… open in the digit argument.'],
 dur:12,hint:'Move x and y and watch their digits weave into t; then press the snag to see why the bare trick needed repair. Only four digits are shown; the real matching uses every digit.',
 init:()=>({x:2718,y:1414,snag:0}),
 watch(p){return {x:Math.round(5000+4000*Math.sin(2*Math.PI*p)),y:Math.round(5000+4000*Math.sin(4*Math.PI*p+1)),snag:p>.72?1:0}},
 ui:[{range:'x',label:'x (four digits)',min:0,max:9999,get:s=>s.x,act:'x',show:v=>'0.'+pad(v,4)},{range:'y',label:'y (four digits)',min:0,max:9999,get:s=>s.y,act:'y',show:v=>'0.'+pad(v,4)},{choose:[[0,'The matching'],[1,'The snag']],label:'Show',get:s=>s.snag,act:'snag'}],
 on:{x(s,v){s.x=clamp(Math.round(+v),0,9999)},y(s,v){s.y=clamp(Math.round(+v),0,9999)},snag(s,v){s.snag=+v?1:0}},
 draw(s){
  const xd=D1_dig(s.x),yd=D1_dig(s.y),td=D1_weave(xd,yd),[bx,by]=D1_unweave(td),xv=s.x/1e4,yv=s.y/1e4,tv=+('0.'+td.join(''));
  let out=heading(s.snag?'The snag: two decimals for one number':`(${'0.'+xd.join('')}, ${'0.'+yd.join('')}) ↔ ${'0.'+td.join('')}`);
  const sx=40,sy=58,sw=200;
  out+=R(sx,sy,sw,sw,'#fff',C.ink,2)+TF(sx,sy+sw+18,'0',13,C.muted,'start')+TF(sx+sw,sy+sw+18,'1',13,C.muted,'end');
  out+=L(sx+sw*xv,sy+sw,sx+sw*xv,sy+sw*(1-yv),C.blue,1.4,D1_dash)+L(sx,sy+sw*(1-yv),sx+sw*xv,sy+sw*(1-yv),C.coral,1.4,D1_dash)+Ci(sx+sw*xv,sy+sw*(1-yv),7,C.ink,'#fff');
  out+=TF(sx+sw/2,sy+sw+36,'the square',13,C.muted);
  const lx=290,lw=290,ly=96;
  out+=L(lx,ly,lx+lw,ly,C.ink,3)+TF(lx,ly+22,'0',13,C.muted)+TF(lx+lw,ly+22,'1',13,C.muted)+TF(lx+lw/2,ly-22,'the line',13,C.muted);
  if(!s.snag){out+=Ci(lx+lw*tv,ly,7,C.purple,'#fff');
   const dx=28,x0=lx+8;
   out+=TF(x0,150,'x = 0.',15,C.blue,'start');xd.forEach((d,i)=>{out+=TMF(x0+60+i*2*dx,150,d,17,C.blue)});
   out+=TF(x0,180,'y = 0.',15,C.coral,'start');yd.forEach((d,i)=>{out+=TMF(x0+60+i*dx*2+dx,180,d,17,C.coral)});
   out+=TF(x0,222,'t = 0.',15,C.purple,'start');td.forEach((d,i)=>{const X=x0+60+i*dx;out+=TMF(X,222,d,17,i%2?C.coral:C.blue,'middle','font-weight="700"')+TF(X,240,i%2?'y':'x',13,C.muted)});
   const ok=bx.join('')===xd.join('')&&by.join('')===yd.join('');
   out+=TF(lx,276,`Split t again: x = 0.${bx.join('')}, y = 0.${by.join('')}`,13,C.ink,'start')+TF(lx,296,ok?'✓ back where we started':'✕ mismatch',13,ok?C.green:C.coral,'start');
  }else{const [t1,t2]=D1_SNAG,[a1,b1]=D1_unweave(t1),[a2,b2]=D1_unweave(t2);
   out+=Ci(lx+lw*.10909,ly,6,C.purple,'#fff')+Ci(lx+lw*.2,ly,6,C.purple,'#fff')+TF(lx+lw*.10909,ly-10,'t₁',13,C.purple)+TF(lx+lw*.2,ly-10,'t₂',13,C.purple);
   out+=TF(lx,148,`t₁ = 0.${t1.join('')}…`,14,C.purple,'start')+TF(lx,168,`→ x = 0.${a1.join('')}…, y = 0.${b1.join('')}…`,13,C.ink,'start');
   out+=TF(lx,200,`t₂ = 0.${t2.join('')}…`,14,C.purple,'start')+TF(lx,220,`→ x = 0.${a2.join('')}…, y = 0.${b2.join('')}…`,13,C.ink,'start');
   out+=TF(lx,252,'But 0.1999… = 0.2000…, so t₁ and t₂',13,C.coral,'start')+TF(lx,270,'lead to the same point of the square.',13,C.coral,'start');
   out+=Ci(sx+sw*.2,sy+sw,8,C.coral,'#fff');
  }
  out+=D1_note('Cantor’s matching is not continuous: nearby points of the square can land far apart on the line.',350);
  return {svg:out,phase:s.snag?'Two different strings of digits for t, 0.10909… and 0.20000…, give x = 0.1999… and x = 0.2000…, which are the same number, with y = 0 both times. So two points of the line go to one point of the square. Cantor’s published proof avoided the double decimals; the conclusion survived.':
   `The digits of x (${xd.join(' ')}) and y (${yd.join(' ')}) alternate to make t = 0.${td.join('')}. Every point of the square gets its own point of the line and back again. Yet the matching tears the square apart: moving x a little can change t a lot, which is where dimension hides.`};
 }});

// Hilbert's version of a space-filling curve: stage k visits the 4^k cells of a grid in order (standard index-to-cell map).
function D1_hilbert(k){const N=1<<k,pts=[];for(let d=0;d<N*N;d++){let t=d,x=0,y=0;for(let s=1;s<N;s*=2){const rx=1&Math.floor(t/2),ry=1&(t^rx);if(ry===0){if(rx===1){x=s-1-x;y=s-1-y}const tmp=x;x=y;y=tmp}x+=s*rx;y+=s*ry;t=Math.floor(t/4)}pts.push([(x+.5)/N,(y+.5)/N])}return pts}
const D1_HC={};const D1_hil=k=>D1_HC[k]||(D1_HC[k]=D1_hilbert(k));
const D1_plen=pts=>{let s=0;for(let i=1;i<pts.length;i++)s+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);return s};
SCENE({id:'what-is-dimension-peano',name:'A curve that fills a square',tag:'Peano 1890, Hilbert 1891',
 definition:'In 1890 Giuseppe Peano described a curve, traced continuously in time, that passes through every point of a square. David Hilbert drew a simpler one in 1891: divide the square into 4 cells and visit them in order, then divide each cell into 4 and visit those, and so on; the limit of these stages fills the square. Such a curve is continuous, but it cannot visit each point only once: Eugen Netto had proved in 1879 that a one-to-one matching of a line with a square cannot be continuous.',
 example:`Stage k visits 4ᵏ cells of side 1/2ᵏ, and every point of the square is within half a cell’s diagonal of the curve, √2/2ᵏ⁺¹. At stage 6 that is ${D1_hil(6).length} cells and ${D1_fx(Math.SQRT2/128,4)}. The length of the stage-k path is (4ᵏ − 1)/2ᵏ, which grows without limit.`,
 desc:'A square with a stage of Hilbert’s curve drawn through the centres of its cells, a point moving along it, the four cells around the centre outlined with the times at which the curve visits them, and tiles with the number of cells, the path’s length and how close it comes to every point.',
 research:['Peano (1890). Sur une courbe, qui remplit toute une aire plane. Mathematische Annalen 36, 157–160.','Hilbert (1891). Über die stetige Abbildung einer Linie auf ein Flächenstück. Mathematische Annalen 38, 459–460.','Netto (1879). Beitrag zur Mannigfaltigkeitslehre. Journal für die reine und angewandte Mathematik 86, 263–268.'],
 dur:15,hint:'Press Refine to draw the next stage, and drag Draw to trace it yourself. Move the point along the curve: notice that the four cells around the centre are visited at very different times.',
 init:()=>({k:2,dr:1,t:.3}),
 watch(p){const k=clamp(1+Math.floor(p*6),1,6);return {k,dr:clamp((p*6-(k-1))*1.25,0,1),t:clamp((p*6-(k-1))*1.25,0,1)}},
 ui:[{b:'Refine: next stage',act:'more'},{b:'Back a stage',act:'less'},{range:'dr',label:'Draw',min:0,max:100,get:s=>Math.round(s.dr*100),act:'dr',show:v=>v+'%'},{range:'t',label:'Point at time t',min:0,max:100,get:s=>Math.round(s.t*100),act:'t',show:v=>D1_f(v/100)}],
 on:{more(s){s.k=Math.min(6,s.k+1);s.dr=1},less(s){s.k=Math.max(1,s.k-1);s.dr=1},dr(s,v){s.dr=clamp(+v/100,0,1)},t(s,v){s.t=clamp(+v/100,0,1)}},
 draw(s){
  const k=s.k,N=1<<k,pts=D1_hil(k),M=pts.length,x0=40,y0=60,w=270,S=q=>[x0+w*q[0],y0+w*(1-q[1])];
  let out=heading(`Stage ${k}: ${M} cells, visited in order`);
  out+=R(x0,y0,w,w,'#fff',C.ink,0);
  if(k<=4)for(let i=1;i<N;i++)out+=L(x0+w*i/N,y0,x0+w*i/N,y0+w,C.grid,1)+L(x0,y0+w*i/N,x0+w,y0+w*i/N,C.grid,1);
  // the four cells touching the centre and when the curve is in them
  const cen=[];pts.forEach((q,i)=>{const cx=Math.floor(q[0]*N),cy=Math.floor(q[1]*N);if((cx===N/2-1||cx===N/2)&&(cy===N/2-1||cy===N/2))cen.push(i)});
  for(const i of cen){const q=pts[i],a=S([q[0]-.5/N,q[1]+.5/N]);out+=R(a[0],a[1],w/N,w/N,C.amberp,C.amber,0)}
  const nd=Math.max(1,Math.round(s.dr*(M-1)));out+=D1_path(pts.slice(0,nd+1).map(S),C.blue,k>=5?1.3:2.2);
  const pos=s.t*(M-1),i0=Math.min(M-2,Math.floor(pos)),fr=pos-i0,pt=[lerp(pts[i0][0],pts[i0+1][0],fr),lerp(pts[i0][1],pts[i0+1][1],fr)],pp=S(pt);
  out+=Ci(pp[0],pp[1],7,C.coral,'#fff');
  const len=D1_plen(pts),lf=(M-1)/N,gap=Math.SQRT2/(2*N);
  const x1=345;out+=D1_tile(x1,58,115,'Cells 4ᵏ',String(M),C.ink)+D1_tile(x1+122,58,115,'Cell side',`1/${N}`,C.ink);
  out+=D1_tile(x1,112,237,'Path length (formula (4ᵏ − 1)/2ᵏ)',`${D1_fx(len,3)}  (${D1_fx(lf,3)})`,C.blue);
  out+=D1_tile(x1,166,237,'Every point within √2/2ᵏ⁺¹ of it',D1_fx(gap,4),C.blue);
  out+=TF(x1,236,'Times t when it is in the',13,C.muted,'start')+TF(x1,254,'4 cells around the centre:',13,C.amber,'start');
  out+=TF(x1,276,cen.map(i=>D1_fx(i/(M-1),2)).join(', '),14,C.ink,'start');
  out+=TF(x1,304,`point at t = ${D1_fx(s.t,2)}: (${D1_fx(pt[0],2)}, ${D1_fx(pt[1],2)})`,13,C.coral,'start');
  out+=D1_note('Stages of Hilbert’s curve; the curve itself is their limit.',366);
  return {svg:out,phase:`Stage ${k} threads all ${M} cells without lifting the pen. Close times give close points, so the limit is continuous. But the four cells around the centre are visited at times ${cen.map(i=>D1_fx(i/(M-1),2)).join(', ')}: in the limit the centre is reached from more than one of them, at different times. Filling the square continuously forces some points to be visited twice.`};
 }});

// Lebesgue's covering idea: cover a region with small closed bricks; count the most bricks that share one point.
// The count is found by testing every point whose coordinates are brick edges (where the maximum must occur).
function D1_maxDepth(boxes,dim,region){
 const cand=[];for(let a=0;a<dim;a++){const st=new Set([region[a][0],region[a][1]]);for(const b of boxes)for(const v of b[a])if(v>=region[a][0]-1e-9&&v<=region[a][1]+1e-9)st.add(+v.toFixed(9));cand.push([...st].sort((x,y)=>x-y))}
 let best=0,at=[];const pt=new Array(dim);
 const rec=a=>{if(a===dim){let c=0;for(const b of boxes){let ok=true;for(let i=0;i<dim;i++)if(pt[i]<b[i][0]-1e-9||pt[i]>b[i][1]+1e-9){ok=false;break}if(ok)c++}if(c>best){best=c;at=[pt.slice()]}else if(c===best&&at.length<40)at.push(pt.slice());return}for(const v of cand[a]){pt[a]=v;rec(a+1)}};
 rec(0);return {best,at};
}
const D1_fr=v=>((v%1)+1)%1;
function D1_bricks(world,sh){
 const B=[];
 if(world===1){for(let i=-1;i<7;i++)B.push([[i,i+1]]);return {B,region:[[0,6]]}}
 if(world===2){for(let r=0;r<4;r++)for(let i=-1;i<7;i++){const o=D1_fr(r*sh);B.push([[i+o,i+1+o],[r,r+1]])}return {B,region:[[0,6],[0,4]]}}
 const s2=sh?.21:0,s3=sh?.37:0;
 for(let l=0;l<3;l++)for(let r=-2;r<4;r++)for(let i=-3;i<4;i++){const ox=i+D1_fr(r*sh+l*s2),oy=r+D1_fr(l*s3);B.push([[ox,ox+1],[oy,oy+1],[l,l+1]])}
 return {B,region:[[0,3],[0,3],[0,3]]};
}
const D1_CV={};const D1_cover=(w,sh)=>{const key=w+':'+sh;if(!D1_CV[key]){const {B,region}=D1_bricks(w,sh);D1_CV[key]={B,region,...D1_maxDepth(B,w,region)}}return D1_CV[key]};
SCENE({id:'what-is-dimension-brouwer',name:'Dimension survives stretching',tag:'Brouwer and Lebesgue, 1911–13',
 definition:'In 1911 L. E. J. Brouwer proved the invariance of dimension: no one-to-one matching between spaces of different dimensions can be continuous both ways. So Cantor’s matching had to tear, and Peano’s curve had to overlap. Henri Lebesgue suggested a test that sees dimension directly: cover a space with small closed bricks; in n dimensions some point must lie in at least n + 1 of them, and with a good arrangement no point lies in more.',
 example:`Lay bricks in a wall with the joints lined up and ${D1_cover(2,0).best} meet at a corner; stagger alternate rows and never more than ${D1_cover(2,.5).best} meet: 3 = 2 + 1, so the wall is two-dimensional. Segments end to end along a line meet in pairs: ${D1_cover(1,0).best} = 1 + 1. Staggered bricks in space can be arranged so that never more than ${D1_cover(3,.5).best} meet. Brouwer completed Lebesgue’s argument (1913), and Menger and Urysohn built the theory of dimension on such ideas in the early 1920s.`,
 desc:'Closed bricks covering a segment, a rectangle or a block, with a slider that staggers the rows. The points where the most bricks meet are marked, and the scene reports that count, computed by testing every corner point, and the dimension it gives.',
 research:['Brouwer (1911). Beweis der Invarianz der Dimensionenzahl. Mathematische Annalen 70, 161–165.','Lebesgue (1911). Sur la non applicabilité de deux domaines appartenant respectivement à des espaces à n et n + p dimensions. Mathematische Annalen 70, 166–168.','Brouwer (1913). Über den natürlichen Dimensionsbegriff. Journal für die reine und angewandte Mathematik 142, 146–152. Menger (1923) and Urysohn (1922–25) developed the general theory.'],
 dur:14,hint:'Choose a line, a plane or a block of space and stagger the bricks. Try to make fewer bricks meet at any point; the count never falls below the dimension plus one.',
 init:()=>({w:2,sh:0}),
 watch(p){const i=Math.min(2,Math.floor(p*3)),u=clamp(p*3-i,0,1);return {w:[2,1,3][i],sh:u<.4?0:.5}},
 ui:[{choose:[[1,'A line'],[2,'A plane'],[3,'Space']],label:'Cover',get:s=>s.w,act:'w'},{range:'sh',label:'Stagger the rows',min:0,max:50,step:5,get:s=>Math.round(s.sh*100),act:'sh',show:v=>D1_f(v/100)}],
 on:{w(s,v){s.w=clamp(Math.round(+v),1,3)},sh(s,v){s.sh=clamp(Math.round(+v/5)*5/100,0,.5)}},
 draw(s){
  const cv=D1_cover(s.w,s.sh),d=cv.best-1,best=cv.best===s.w+1;
  let out=heading(best?`At most ${cv.best} bricks meet at a point: dimension ${d}`:`${cv.best} bricks meet at a corner: stagger them`);
  const fills=[C.pale,C.greenp,C.purplep,C.amberp];
  if(s.w===1){const x0=40,u=46,y=170;cv.B.forEach((b,i)=>{const a=Math.max(0,b[0][0]),c=Math.min(6,b[0][1]);if(c>a)out+=R(x0+u*a+1,y-(i%2?22:0),u*(c-a)-2,18,fills[i%2],C.blue,3)});
   for(const p of cv.at){const X=x0+u*p[0];out+=L(X,y-30,X,y+24,C.coral,2)+TBF(X,y+44,String(cv.best),13,C.coral)}
   out+=TF(x0,y+80,'Closed segments touching end to end share their end points.',13,C.muted,'start');}
  else if(s.w===2){const x0=40,y0=70,u=46,S=(x,y)=>[x0+u*x,y0+u*(4-y)];
   cv.B.forEach((b,i)=>{const a=Math.max(0,b[0][0]),c=Math.min(6,b[0][1]);if(c>a){const p=S(a,b[1][1]);out+=R(p[0],p[1],u*(c-a),u,fills[(i+Math.floor(i/8))%4],C.ink,0)}});
   for(const p of cv.at){const q=S(p[0],p[1]);out+=Ci(q[0],q[1],6,C.coral,'#fff')}
  }else{const x0=40,y0=70,u=60,S=(x,y)=>[x0+u*x,y0+u*(3-y)];
   out+=TF(x0,y0-8,'Plan: bottom layer solid, next layer dashed',13,C.muted,'start');
   cv.B.forEach((b,i)=>{if(b[2][0]>1)return;const a=Math.max(0,b[0][0]),c=Math.min(3,b[0][1]),e=Math.max(0,b[1][0]),g=Math.min(3,b[1][1]);if(c>a&&g>e){const p=S(a,g);out+=b[2][0]===0?R(p[0],p[1],u*(c-a),u*(g-e),C.pale,C.ink,0):R(p[0],p[1],u*(c-a),u*(g-e),'none',C.purple,0,'stroke-dasharray="5 4"')}});
   for(const p of cv.at)if(Math.abs(p[2]-1)<1e-9){const q=S(p[0],p[1]);out+=Ci(q[0],q[1],5,C.coral,'#fff')}
  }
  const x1=372;out+=D1_tile(x1,58,210,'Bricks (closed) in the cover',String(cv.B.length),C.ink)+D1_tile(x1,112,210,'Most meeting at one point',String(cv.best),C.coral);
  out+=D1_tile(x1,166,210,'This cover: most − 1',String(d),best?C.blue:C.muted);
  out+=TF(x1,240,`Lebesgue: in ${s.w===1?'a line':s.w===2?'the plane':'space'} no cover by`,13,C.ink,'start')+TF(x1,258,`small bricks does better than ${s.w+1}.`,13,C.ink,'start');
  out+=TF(x1,290,'Dots: points where the most meet',13,C.coral,'start');
  return {svg:out,phase:s.sh===0&&s.w>1?`With the joints lined up, ${cv.best} bricks share each corner. Stagger the rows and the count drops.`:`The most bricks sharing a point is ${cv.best}, found by testing every point whose coordinates are brick edges. No arrangement of small bricks does better than ${s.w+1} in ${s.w} dimension${s.w>1?'s':''}, so this count measures dimension without coordinates, and it cannot change under any continuous stretching.`};
 }});

// Self-similarity: cut a shape into copies scaled by 1/k and count them; the dimension d solves copies = k^d.
function D1_kochPts(level){let P=[[0,0],[1,0]];for(let l=0;l<level;l++){const Q=[P[0]];for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],dx=(b[0]-a[0])/3,dy=(b[1]-a[1])/3,p1=[a[0]+dx,a[1]+dy],p2=[a[0]+2*dx,a[1]+2*dy],pk=[p1[0]+dx/2-dy*Math.sqrt(3)/2,p1[1]+dy/2+dx*Math.sqrt(3)/2];Q.push(p1,pk,p2,b)}P=Q}return P}
function D1_copies(shape,k){
 if(shape==='koch'){const g=D1_kochPts(1);return range(4).map(i=>[g[i],g[i+1]])}
 const dim=shape==='segment'?1:shape==='square'?2:3,out=[];for(let m=0;m<k**dim;m++){const c=[];let r=m;for(let a=0;a<dim;a++){c.push(r%k);r=Math.floor(r/k)}out.push(c)}return out;
}
SCENE({id:'what-is-dimension-meanings',name:'Several meanings, one word',tag:'Coordinates, coverings and copies',
 definition:'“Dimension” now has several precise meanings. The number of coordinates needed near each point (the dimension of a manifold); Lebesgue’s covering dimension; and, for shapes made of smaller copies of themselves, the similarity dimension: if scaling by 1/k gives N copies, then N = kᵈ and d = log N / log k. On segments, squares and cubes all three agree. On fractals they part company.',
 example:`Halve a square and you get ${D1_copies('square',2).length} copies: 4 = 2², so d = 2. Thirds of a cube give ${D1_copies('cube',3).length} = 3³ copies: d = 3. Koch’s curve (1904) is made of ${D1_copies('koch',3).length} copies at a third of the size, so d = log 4 / log 3 ≈ ${D1_fx(Math.log(D1_copies('koch',3).length)/Math.log(3),3)}, though it is still a curve: its covering dimension is 1. Hausdorff’s definition (1918) allows such non-whole dimensions; era 8 measures them.`,
 desc:'A segment, square, cube or Koch curve cut into copies scaled by 1/k, with the copies counted and the similarity dimension computed, beside a table of three meanings of dimension for the chosen shape.',
 research:['Hausdorff (1919). Dimension und äußeres Maß. Mathematische Annalen 79, 157–179 (written 1918).','von Koch (1904). Sur une courbe continue sans tangente, obtenue par une construction géométrique élémentaire. Arkiv för Matematik, Astronomi och Fysik 1, 681–702.','Mandelbrot (1967). How long is the coast of Britain? Science 156, 636–638.'],
 dur:13,hint:'Choose a shape and a scale factor k. The copies are generated and counted, and d is the power of k that gives that count.',
 init:()=>({shape:'square',k:3}),
 watch(p){const sh=['segment','square','cube','koch'],i=Math.min(3,Math.floor(p*4));return {shape:sh[i],k:i<3&&(p*4-i)<.5?2:3}},
 ui:[{choose:[['segment','Segment'],['square','Square'],['cube','Cube'],['koch','Koch curve']],label:'Shape',get:s=>s.shape,act:'shape'},{choose:[[2,'k = 2'],[3,'k = 3']],label:'Scale by 1/k',get:s=>s.k,act:'k'}],
 on:{shape(s,v){s.shape=['segment','square','cube','koch'].includes(v)?v:'square';if(s.shape==='koch')s.k=3},k(s,v){s.k=s.shape==='koch'?3:(+v===2?2:3)}},
 draw(s){
  const k=s.shape==='koch'?3:s.k,cp=D1_copies(s.shape,k),N=cp.length,d=Math.log(N)/Math.log(k);
  let out=heading(`${N} copies at 1/${k} the size: d = log ${N} / log ${k} = ${D1_f(d,3)}`);
  const fills=[C.pale,C.greenp,C.purplep,C.amberp];
  if(s.shape==='segment'){const x0=40,w=280,y=190;cp.forEach((c,i)=>{out+=R(x0+w*c[0]/k+2,y-10,w/k-4,20,fills[i%4],C.blue,3)})}
  else if(s.shape==='square'){const x0=60,y0=70,w=240;cp.forEach((c,i)=>{out+=R(x0+w*c[0]/k,y0+w*c[1]/k,w/k,w/k,fills[(c[0]+c[1])%2?1:0],C.ink,0)})}
  else if(s.shape==='cube'){const pr=D1_cam(.62,.5,150,180,250),q=v=>pr(v.map(c=>c-.5));
   const sq=(a,b,c,col)=>`<polygon points="${[a,b,c,[a[0]+c[0]-b[0],a[1]+c[1]-b[1],a[2]+c[2]-b[2]]].map(v=>q(v).slice(0,2).map(fmt).join(',')).join(' ')}" fill="${col}" stroke="${C.ink}" stroke-width="1"/>`;
   for(let i=0;i<k;i++)for(let j=0;j<k;j++){out+=sq([i/k,j/k,1],[(i+1)/k,j/k,1],[(i+1)/k,(j+1)/k,1],(i+j)%2?C.greenp:C.pale)+sq([i/k,0,j/k],[(i+1)/k,0,j/k],[(i+1)/k,0,(j+1)/k],(i+j)%2?'#d5e6e0':'#cfe0ec')+sq([1,i/k,j/k],[1,(i+1)/k,j/k],[1,(i+1)/k,(j+1)/k],(i+j)%2?'#c4dad2':'#bed3e3')}
   out+=TF(180,350,`${k}³ small cubes; the hidden ones are counted too`,13,C.muted)}
  else{const pts=D1_kochPts(4),x0=40,w=290,y=250,S=p=>[x0+w*p[0],y-w*p[1]];
   for(let c=0;c<4;c++){const a=c*pts.length/4|0,b=(c+1)*(pts.length-1)/4;out+=D1_path(pts.slice(a,b+1).map(S),D1_ECOL[c],2.2)}
   out+=TF(185,290,'4 copies, each 1/3 of the whole (shown in four colours)',13,C.muted)}
  const isK=s.shape==='koch',cov={segment:1,square:2,cube:3,koch:1}[s.shape],coverD=D1_cover(cov,cov===1?0:.5).best-1;
  const coords=isK?'1, but not smooth':String({segment:1,square:2,cube:3}[s.shape]);
  const x1=360;out+=TBF(x1,66,'Three meanings',14,C.ink,'start');
  const rows=[['Coordinates near a point',coords],['Covering (bricks − 1)',String(coverD)],[`Similarity log ${N}/log ${k}`,D1_f(d,3)]];
  rows.forEach((r,i)=>{const y=96+i*50;out+=R(x1,y-20,222,42,i===2&&isK?C.coralp:'#fff',C.grid,6)+TF(x1+8,y-3,r[0],13,C.muted,'start')+TBF(x1+8,y+15,r[1],14,C.ink,'start')});
  const agree=!isK;out+=TF(x1,262,agree?'✓ all three agree':'They disagree: a fractal.',14,agree?C.green:C.coral,'start');
  out+=TF(x1,286,`Copies counted: ${N} = ${D1_pow(k,d)}`,13,C.ink,'start');
  return {svg:out,phase:isK?`The Koch curve is made of ${N} copies of itself at a third of the size, so its similarity dimension is log ${N}/log 3 ≈ ${D1_f(d,3)}. It is still a curve, with covering dimension ${coverD}: the meanings that agree on ordinary shapes part company here.`:`Scaling by 1/${k} cuts the ${s.shape} into ${N} = ${D1_pow(k,d)} copies, so its similarity dimension is ${D1_f(d,0)}, the same as its number of coordinates and its covering dimension (computed in the previous scene’s brick test).`};
 }});

