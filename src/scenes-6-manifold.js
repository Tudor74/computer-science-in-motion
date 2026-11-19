/* ===================== Dimensions In Motion · Era 6 · Higher manifolds ===================== */
// Three-manifolds, the Poincaré conjecture, Thurston's geometrisation, knots and the fourth dimension, exotic spheres
// and dimension four. Every count, angle, length, volume and invariant on screen is computed here from the shape drawn
// (vertex and edge lists, gluing maps, sampled curves, integer matrices) or from the formula named beside it. The only
// typed numbers are dates and published results, each with a research line. Pictures are pure functions of (s, f, X).

/* ---- shared helpers ---- */
const D6_note=(s,y=368)=>TF(300,y,s,13,C.muted);
function D6_tile(x,y,w,label,value,col=C.blue,h=46){return R(x,y,w,h,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+38,value,16,col)}
const D6_poly=(pts,col,w=2.2,extra='')=>pts.length>1?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const D6_plural=(n,w,pl)=>n===1?w:(pl||w+'s');
const D6_wrapText=(t,max)=>{const lines=[''];for(const w of String(t).split(' ')){const l=lines[lines.length-1];if(l&&(l+' '+w).length>max)lines.push(w);else lines[lines.length-1]=l?l+' '+w:w}return lines};
const D6_memo=(()=>{const m={};return (k,fn)=>k in m?m[k]:(m[k]=fn())})();
const D6_deg=r=>r*180/Math.PI,D6_rad=d=>d*Math.PI/180;
const D6_f=(v,d=2)=>{const r=Number(v).toFixed(d);return /^-0\.?0*$/.test(r)?r.slice(1):r};   // fixed decimals, no "-0"
const D6_minus=s=>String(s).replace(/-/g,'−');
const D6_subN=n=>String(n).split('').map(c=>'₀₁₂₃₄₅₆₇₈₉'[c]).join('');
const D6_supN=n=>String(n).split('').map(c=>c==='-'?'⁻':'⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('');
const D6_dot=(a,b)=>a.reduce((t,v,i)=>t+v*b[i],0);
const D6_sub=(a,b)=>a.map((v,i)=>v-b[i]),D6_add=(a,b)=>a.map((v,i)=>v+b[i]),D6_mul=(a,k)=>a.map(v=>v*k);
const D6_norm=a=>Math.sqrt(D6_dot(a,a)),D6_unit=a=>D6_mul(a,1/D6_norm(a));
const D6_cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
// Rotation of v about the unit axis n by angle t (Rodrigues).
function D6_rot(v,n,t){const c=Math.cos(t),s=Math.sin(t),d=D6_dot(n,v),x=D6_cross(n,v);return v.map((q,i)=>q*c+x[i]*s+n[i]*d*(1-c))}
// Turn a 3D point about z (yaw) then tilt about x (pitch): own projection for 2D drawings.
function D6_view(yaw,pitch,cx,cy,sc){const cy_=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
 return v=>{const a=v[0]*cy_-v[1]*sy,b=v[0]*sy+v[1]*cy_;return [cx+a*sc,cy-(v[2]*cp-b*sp)*sc,b*cp+v[2]*sp]}}
// Map points (using x, y) into a box centred at (cx, cy) of size w × h, keeping proportions.
function D6_fit(pts,cx,cy,w,h){const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),sc=Math.min(w/((x1-x0)||1),h/((y1-y0)||1));
 return q=>[cx+(q[0]-(x0+x1)/2)*sc,cy-(q[1]-(y0+y1)/2)*sc]}
// Union-find.
function D6_uf(n){const p=range(n);const f=i=>p[i]===i?i:(p[i]=f(p[i]));return {find:f,join(a,b){a=f(a);b=f(b);if(a!==b)p[b]=a},classes(){const m=new Map();for(let i=0;i<n;i++){const r=f(i);if(!m.has(r))m.set(r,[]);m.get(r).push(i)}return [...m.values()]}}}
// Integer Smith normal form: returns the non-zero invariant factors (as Numbers; entries here stay small).
function D6_snf(M){
 const A=M.map(r=>r.slice()),m=A.length,n=m?A[0].length:0,d=[];let t=0;
 while(t<m&&t<n){
  let bi=-1,bj=-1,bv=Infinity;
  for(let i=t;i<m;i++)for(let j=t;j<n;j++)if(A[i][j]&&Math.abs(A[i][j])<bv){bv=Math.abs(A[i][j]);bi=i;bj=j}
  if(bi<0)break;
  [A[t],A[bi]]=[A[bi],A[t]];for(const r of A)[r[t],r[bj]]=[r[bj],r[t]];
  let done=false;
  while(!done){done=true;
   for(let i=t+1;i<m;i++){const q=Math.floor(A[i][t]/A[t][t]);if(q)for(let j=t;j<n;j++)A[i][j]-=q*A[t][j];if(A[i][t]){done=false}}
   for(let j=t+1;j<n;j++){const q=Math.floor(A[t][j]/A[t][t]);if(q)for(let i=t;i<m;i++)A[i][j]-=q*A[i][t];if(A[t][j]){done=false}}
   if(!done){let bi2=-1,bj2=-1,bv2=Infinity;
    for(let i=t;i<m;i++)if(A[i][t]&&Math.abs(A[i][t])<bv2){bv2=Math.abs(A[i][t]);bi2=i;bj2=t}
    for(let j=t;j<n;j++)if(A[t][j]&&Math.abs(A[t][j])<bv2){bv2=Math.abs(A[t][j]);bi2=t;bj2=j}
    [A[t],A[bi2]]=[A[bi2],A[t]];for(const r of A)[r[t],r[bj2]]=[r[bj2],r[t]];continue}
   // the pivot must divide every remaining entry
   let bad=-1;for(let i=t+1;i<m&&bad<0;i++)for(let j=t+1;j<n;j++)if(A[i][j]%A[t][t]){bad=i;break}
   if(bad>=0){for(let j=t;j<n;j++)A[t][j]+=A[bad][j];done=false}
  }
  d.push(Math.abs(A[t][t]));t++;
 }
 return d;
}
// A homology group from free rank and torsion factors, as text.
function D6_groupText(free,tors){const parts=[];if(free)parts.push(free===1?'ℤ':'ℤ'+'⁰¹²³⁴⁵⁶⁷⁸⁹'[free]);
 const cnt={};for(const t of tors)cnt[t]=(cnt[t]||0)+1;for(const t of Object.keys(cnt).sort((a,b)=>a-b))parts.push(`(ℤ/${t})${cnt[t]>1?'⁰¹²³⁴⁵⁶⁷⁸⁹'[cnt[t]]:''}`);
 return parts.length?parts.join(' ⊕ '):'0'}

/* ===================== Lesson: three-manifolds ===================== */
// The 3-torus: the unit cube with opposite faces glued. U is the unwrapped position (in the universal cover, ℝ³);
// the position in the cube is U mod 1, and floor(U) counts how many times each pair of faces has been crossed.
const D6_T3_START=[.25,.35,.55];
const D6_T3_DIRS={x:[1,0,0],y:[0,1,0],z:[0,0,1],d:[.8,.5,.3]};
const D6_T3_NAMES={x:'along x',y:'along y',z:'along z',d:'slanting'};
const D6_wrap=v=>v.map(q=>q-Math.floor(q));
// Split a straight flight A→B (unwrapped) into pieces inside the unit cube, cut where a coordinate crosses a whole number.
function D6_wrapSegs(A,B){
 const ts=[0,1];for(let i=0;i<3;i++){const a=A[i],b=B[i];if(a===b)continue;const lo=Math.min(a,b),hi=Math.max(a,b);for(let k=Math.ceil(lo);k<=Math.floor(hi);k++){const t=(k-a)/(b-a);if(t>1e-9&&t<1-1e-9)ts.push(t)}}
 ts.sort((x,y)=>x-y);const out=[];
 for(let i=0;i+1<ts.length;i++){const t0=ts[i],t1=ts[i+1];if(t1-t0<1e-9)continue;const m=A.map((a,j)=>a+(B[j]-a)*(t0+t1)/2),sh=m.map(Math.floor);
  out.push([A.map((a,j)=>a+(B[j]-a)*t0-sh[j]),A.map((a,j)=>a+(B[j]-a)*t1-sh[j])])}
 return out;
}
// Shortest distance from a to b in the 3-torus: the smallest distance from a to any copy b + n.
function D6_torusDist(a,b){let best=Infinity;for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++)for(let k=-2;k<=2;k++){const d=Math.hypot(b[0]+i-a[0],b[1]+j-a[1],b[2]+k-a[2]);if(d<best)best=d}return best}
const D6_flatPath=s=>{const pts=[D6_T3_START];for(const m of s.moves)pts.push(D6_add(pts[pts.length-1],D6_mul(D6_T3_DIRS[m],.3)));return pts};
function D6_t3State(s){const pts=s.pts||D6_flatPath(s),U=pts[pts.length-1];let flown=0;for(let i=1;i<pts.length;i++)flown+=D6_norm(D6_sub(pts[i],pts[i-1]));
 return {pts,U,W:D6_wrap(U),cr:U.map(Math.floor),flown,home:D6_torusDist(D6_wrap(U),D6_T3_START)}}
// Cabinet projection of the unit cube for the 2D panel.
const D6_cab=(ox,oy,S)=>v=>[ox+S*v[0]+S*.42*v[1],oy-S*v[2]-S*.3*v[1]];
SCENE({id:'three-manifolds',name:'Fly out of one face, back in through the other',tag:'The 3-torus',
 definition:'A three-manifold is a space in which every small region looks like a piece of ordinary space. The simplest one with no edge and finite size is the 3-torus: a cube whose opposite faces are glued, so that flying out through the right-hand face brings you back in through the left-hand one, and the same for front and back and for top and bottom. Inside it nothing marks the faces; the gluing is only how we draw it.',
 example:'It is the game Asteroids of the gluing-diagrams lesson, one dimension up. A pilot who keeps flying in one direction crosses the glued faces again and again, and the counters below record how often. The distance home is measured inside the 3-torus: the shortest route may run through a face, so after a long flight you can be close to where you started.',
 desc:'A cube drawn in perspective with its three pairs of glued faces coloured coral, purple and green, a flight path broken where it passes through a face and continues from the opposite one, and tiles counting the crossings of each pair, the distance flown and the shortest distance back to the start.',
 research:['Poincaré (1895). Analysis situs. Journal de l’École polytechnique (2) 1, 1–121: spaces made by gluing the faces of polyhedra.','Weeks (1985; 2nd ed. 2002). The Shape of Space. Marcel Dekker: flying through a 3-torus and other three-manifolds.'],
 dur:12,hint:'Choose a direction and press Fly to move a step of 0.3 cube widths. Fly through a face and watch where you come back; compare the distance flown with the distance home.',
 init:()=>({dir:'d',moves:[]}),
 watch(p){const L=3.2*smooth(p),A=D6_T3_START;return {dir:'d',moves:[],pts:[A,D6_add(A,D6_mul(D6_unit(D6_T3_DIRS.d),L))]}},
 ui:[{choose:Object.keys(D6_T3_DIRS).map(k=>[k,D6_T3_NAMES[k]]),label:'Direction',get:s=>s.dir,act:'dir'},{b:'Fly ▶',act:'fly'},{b:'Undo',act:'undo'}],
 on:{dir(s,v){if(D6_T3_DIRS[v])s.dir=v},fly(s){if(s.moves.length<40)s.moves.push(s.dir)},undo(s){s.moves.pop()}},
 draw(s,f,X){
  const st=D6_t3State(s),Pc=D6_cab(48,318,190);
  let out=heading(st.cr.some(c=>c)?'Out through one face, in through the opposite one':'Inside a 3-torus');
  const V=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]];
  const face=(ids,col)=>`<polygon points="${ids.map(i=>Pc(V[i]).map(fmt).join(',')).join(' ')}" fill="${col}" fill-opacity=".35" stroke="none"/>`;
  out+=face([0,3,7,4],C.coralp)+face([1,2,6,5],C.coralp)+face([2,3,7,6],C.purplep)+face([0,1,5,4],C.purplep)+face([0,1,2,3],C.greenp)+face([4,5,6,7],C.greenp);
  for(const [a,b] of [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]]){const back=[a,b].includes(3);const p=Pc(V[a]),q=Pc(V[b]);out+=L(p[0],p[1],q[0],q[1],back?C.line:C.dark,back?1.4:1.8,back?'stroke-dasharray="5 4"':'')}
  out+=TF(Pc([0,.5,.5])[0]-8,Pc([0,.5,.5])[1],'x = 0',13,C.coral,'end')+TF(Pc([1,.5,.5])[0]+8,Pc([1,.5,.5])[1],'x = 1',13,C.coral,'start');
  out+=TF(Pc([.5,.5,1])[0],Pc([.5,.5,1])[1]-6,'top = bottom',13,C.green)+TF(Pc([.5,0,0])[0],Pc([.5,0,0])[1]+18,'front = back (purple)',13,C.purple);
  for(let i=1;i<st.pts.length;i++)for(const [a,b] of D6_wrapSegs(st.pts[i-1],st.pts[i])){const p=Pc(a),q=Pc(b);out+=L(p[0],p[1],q[0],q[1],C.blue,2.6)+Ci(p[0],p[1],2.2,C.blue)}
  const s0=Pc(D6_T3_START),w=Pc(st.W);out+=Ci(s0[0],s0[1],5,'#fff',C.blue)+TF(s0[0]-8,s0[1]+16,'start',13,C.muted,'end')+Ci(w[0],w[1],7,C.coral,'#fff')+TF(w[0]+10,w[1]-8,'you',13,C.coral,'start');
  const x0=372;out+=TF(x0+104,62,'face crossings (net)',13,C.muted);
  out+=D6_tile(x0,70,66,'x faces',D6_minus(st.cr[0]),C.coral)+D6_tile(x0+71,70,66,'y faces',D6_minus(st.cr[1]),C.purple)+D6_tile(x0+142,70,66,'z faces',D6_minus(st.cr[2]),C.green);
  out+=D6_tile(x0,132,208,'distance flown',D6_f(st.flown)+' cube widths',C.ink)+D6_tile(x0,186,208,'shortest way home',D6_f(st.home)+' cube widths',C.blue);
  out+=TF(x0+104,256,'position in the cube',13,C.muted)+TMF(x0+104,276,`(${st.W.map(v=>D6_f(v)).join(', ')})`,13,C.ink);
  out+=TF(x0+104,302,'The cube is drawn in perspective;',13,C.muted)+TF(x0+104,320,'its faces are not walls.',13,C.muted);
  out+=D6_note('Position = the flight’s coordinates minus whole numbers (the crossings).',366);
  const ph=st.cr.every(c=>!c)?`You are inside the cube at (${st.W.map(v=>D6_f(v)).join(', ')}). Fly towards a face: it is not a wall, and you will come back in through the opposite face.`:
   `You have flown ${D6_f(st.flown)} cube widths and crossed the x faces ${Math.abs(st.cr[0])}, the y faces ${Math.abs(st.cr[1])} and the z faces ${Math.abs(st.cr[2])} ${D6_plural(Math.abs(st.cr[2]),'time')} (net). Yet the shortest way back to the start is only ${D6_f(st.home)}: in a 3-torus a straight line can lead you round and back.`;
  return {svg:out,phase:ph};
 },
 three(s,f,X,project){
  const st=D6_t3State(s),Pr=project([-1,2,-1,2,-1,2]);let out='';
  for(const a of [-1,0,1,2])for(const b of [-1,0,1,2]){const inner=(a===0||a===1)&&(b===0||b===1);
   out+=line3([-1,a,b],[2,a,b],Pr,inner?C.line:C.grid,inner?1.6:1)+line3([a,-1,b],[a,2,b],Pr,inner?C.line:C.grid,inner?1.6:1)+line3([a,b,-1],[a,b,2],Pr,inner?C.line:C.grid,inner?1.6:1)}
  const items=[];
  for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)for(let k=-1;k<=1;k++){const c=[st.W[0]+i,st.W[1]+j,st.W[2]+k],me=!i&&!j&&!k;
   items.push({at:c,svg:P=>point3(c,P,me?C.coral:C.blue,me?7:4.5,'#fff')})}
  out+=sortedItems(items,Pr);
  for(let i=1;i<st.pts.length;i++)for(const [a,b] of D6_wrapSegs(st.pts[i-1],st.pts[i]))out+=line3(a,b,Pr,C.coral,2.2);
  return {svg:out,title:'The 3-torus unrolled into copies',caption:`Twenty-seven copies of the cube, side by side: this is what a pilot inside the 3-torus would see, because light also leaves one face and comes back through the opposite one. Each blue dot is the pilot again, at the same place plus whole steps in x, y and z (computed). The coral dot and path are the original cube. The scene computes the copies; the 3D view only turns the camera.`};
 }});

// Copies seen from inside: the images of the pilot are at n (whole-number vectors) times the cube width L.
function D6_shells(r){const m={},M=Math.ceil(r)+1;for(let i=-M;i<=M;i++)for(let j=-M;j<=M;j++)for(let k=-M;k<=M;k++){const q=i*i+j*j+k*k;if(q&&Math.sqrt(q)<=r+1e-9)m[q]=(m[q]||0)+1}
 return Object.keys(m).map(Number).sort((a,b)=>a-b).map(q=>({q,n:m[q]}))}
const D6_rootText=q=>{const r=Math.round(Math.sqrt(q));return r*r===q?String(r):'√'+q};
SCENE({id:'three-manifolds-copies',name:'Copies of yourself in every direction',tag:'Looking around inside a 3-torus',
 definition:'Light in a 3-torus also passes through the glued faces. So a pilot who looks straight ahead along x sees the back of their own head one cube width away, and further copies beyond it. Unrolled, the 3-torus looks like ordinary space filled with identical cubes, with a copy of you at the same place in every cube. The copies are images, not other people: each is you as you were when the light set off.',
 example:'The nearest copies are one cube width away, straight ahead, behind, left, right, above and below. Next come the copies across the diagonals of the faces, then across the cube’s long diagonals. The table counts every copy inside the sphere of sight by listing whole-number steps (i, j, k) and their lengths √(i² + j² + k²).',
 desc:'A slice through the unrolled 3-torus at the pilot’s height: a grid of squares with a copy of the pilot in each, a circle of sight of chosen radius, and a table of the copies inside the sphere of sight in three dimensions, grouped by distance.',
 research:['Ellis (1971). Topology and cosmology. General Relativity and Gravitation 2, 7–21: the images of a source seen in a universe with the topology of a torus.','Weeks (1985; 2nd ed. 2002). The Shape of Space: the view from inside a 3-torus.'],
 dur:11,hint:'Move the slider to see further. The circle shows the slice you can see on the screen; the table counts copies above and below the slice as well.',
 init:()=>({r:1.5}),
 watch(p){return {r:Math.round((.6+2.2*smooth(p))*10)/10}},
 ui:[{range:'r',label:'See as far as (cube widths)',min:.5,max:2.8,step:.1,get:s=>s.r,act:'r',show:v=>D6_f(v,1)}],
 on:{r(s,v){s.r=clamp(Math.round(+v*10)/10,.5,2.8)}},
 draw(s){
  const S=46,cx=168,cy=208,me=[.3,.4],sh=D6_shells(s.r),tot=sum(sh.map(x=>x.n));
  let out=heading(`${tot} ${D6_plural(tot,'copy','copies')} of you within ${D6_f(s.r,1)} cube widths`);
  out+=`<clipPath id="d6cp"><rect x="${cx-150}" y="${cy-150}" width="300" height="300" rx="8"/></clipPath>`;
  let g=R(cx-150,cy-150,300,300,'#fff',C.grid,8);
  for(let i=-4;i<=4;i++){g+=L(cx+(i-me[0])*S,cy-150,cx+(i-me[0])*S,cy+150,C.grid,1.2)+L(cx-150,cy-(i-me[1])*S,cx+150,cy-(i-me[1])*S,C.grid,1.2)}
  g+=R(cx-me[0]*S,cy-(1-me[1])*S,S,S,C.coralp,C.coral,2,'fill-opacity=".6"');
  let inPlane=0;
  for(let i=-4;i<=4;i++)for(let j=-4;j<=4;j++){const x=cx+i*S,y=cy-j*S,d=Math.hypot(i,j),ins=d<=s.r+1e-9;if(i||j){if(ins)inPlane++;g+=Ci(x,y,ins?6:4,ins?C.blue:C.line,'#fff')}}
  g+=Ci(cx,cy,8,C.coral,'#fff')+Ci(cx,cy,s.r*S,'none',C.blue,'stroke-dasharray="6 4"');
  out+=`<g clip-path="url(#d6cp)">${g}</g>`;
  const x0=338;out+=TF(x0+124,64,'copies inside the sphere of sight (3D)',13,C.muted);
  out+=R(x0,72,248,22,C.pale,'none',4)+TBF(x0+60,88,'distance',13)+TBF(x0+184,88,'how many',13);
  sh.slice(0,8).forEach((x,i)=>{const y=110+i*21;out+=TMF(x0+60,y,D6_rootText(x.q)+' = '+D6_f(Math.sqrt(x.q)),13)+TMF(x0+184,y,x.n,13,C.blue)});
  if(sh.length>8)out+=TF(x0+124,110+8*21,`and ${sh.length-8} more distances`,13,C.muted);
  out+=TF(x0+124,268,'grid: a slice at your height;',13,C.muted)+TF(x0+124,284,'coral: your cube',13,C.muted)+D6_tile(x0,296,120,'in this slice',inPlane,C.blue)+D6_tile(x0+128,296,120,'in all of 3D',tot,C.ink);
  out+=D6_note('Counted by listing whole-number steps (i, j, k) no longer than the radius.',372);
  return {svg:out,phase:`Within ${D6_f(s.r,1)} cube widths there are ${tot} ${D6_plural(tot,'copy','copies')} of you, ${inPlane} of them in this slice. ${sh.length?`The nearest ${sh[0].n} are ${D6_rootText(sh[0].q)} ${D6_plural(Math.sqrt(sh[0].q),'cube width')} away.`:''} A finite space can look infinite, but it repeats.`};
 }});

/* ---- the dodecahedron and its gluings (Weber & Seifert 1933) ---- */
const D6_PHI=(1+Math.sqrt(5))/2;
const D6_DODEC=D6_memo('dodec',()=>{
 const g=D6_PHI,h=1/g,V=[];
 for(const a of [-1,1])for(const b of [-1,1])for(const c of [-1,1])V.push([a,b,c]);
 for(const a of [-1,1])for(const b of [-1,1]){V.push([0,a*h,b*g]);V.push([a*h,b*g,0]);V.push([b*g,0,a*h])}
 const el=2*h,E=[];for(let i=0;i<20;i++)for(let j=i+1;j<20;j++)if(Math.abs(D6_norm(D6_sub(V[i],V[j]))-el)<1e-6)E.push([i,j]);
 const N=[];for(const a of [-1,1])for(const b of [-1,1]){N.push(D6_unit([0,a*g,b]));N.push(D6_unit([a*g,b,0]));N.push(D6_unit([b,0,a*g]))}
 const F=N.map(n=>{const top=Math.max(...V.map(v=>D6_dot(v,n)));const ids=range(20).filter(i=>D6_dot(V[i],n)>top-1e-6);
  const c=ids.reduce((a,i)=>D6_add(a,V[i]),[0,0,0]).map(q=>q/5),e1=D6_unit(D6_sub(V[ids[0]],c)),e2=D6_cross(n,e1);
  ids.sort((i,j)=>Math.atan2(D6_dot(D6_sub(V[i],c),e2),D6_dot(D6_sub(V[i],c),e1))-Math.atan2(D6_dot(D6_sub(V[j],c),e2),D6_dot(D6_sub(V[j],c),e1)));
  return {n,ids,c}});    // ids anticlockwise seen from outside
 // pair each face with the opposite one; the first of each pair has the positive leading coordinate
 const pairs=[];F.forEach((fc,i)=>{const j=F.findIndex(o=>D6_norm(D6_add(o.n,fc.n))<1e-9);const lead=fc.n.find(v=>Math.abs(v)>1e-9);if(lead>0)pairs.push([i,j])});
 const dih=Math.PI-Math.acos(D6_dot(F[0].n,F.find(o=>{const sh=o.ids.filter(i=>F[0].ids.includes(i));return sh.length===2}).n));
 return {V,E,F,pairs,dih};
});
// Glue face A to the opposite face B: slide it straight across the centre, then turn it by tenths/10 of a turn
// about A's outward normal. Returns the vertex map A → B.
function D6_glueMap(fa,fb,tenths){const D=D6_DODEC,n=D.F[fa].n,map={};
 for(const i of D.F[fa].ids){const v=D.V[i],w=D6_rot(D6_sub(v,D6_mul(n,2*D6_dot(v,n))),n,tenths*Math.PI/5);
  let best=-1,bd=Infinity;for(const j of D.F[fb].ids){const d=D6_norm(D6_sub(D.V[j],w));if(d<bd){bd=d;best=j}}
  if(bd>1e-6)return null;map[i]=best}
 return map}
// Cells after gluing: vertex classes, edge classes (with orientations), and the first homology group.
function D6_dodecSpace(tenths){return D6_memo('dsp'+tenths,()=>{
 const D=D6_DODEC,maps=[];for(const [a,b] of D.pairs){const m=D6_glueMap(a,b,tenths);if(!m)return null;maps.push([a,b,m])}
 const vu=D6_uf(20);for(const [,,m] of maps)for(const i in m)vu.join(+i,m[i]);
 const vcl=vu.classes(),vid=new Array(20);vcl.forEach((c,k)=>c.forEach(i=>vid[i]=k));
 // edges: union-find with an orientation bit, so each edge knows its direction relative to its class
 const ek=(a,b)=>D.E.findIndex(e=>(e[0]===a&&e[1]===b)||(e[0]===b&&e[1]===a));
 const par=range(30),flip=new Array(30).fill(0);
 const find=i=>{if(par[i]===i)return [i,0];const [r,f]=find(par[i]);par[i]=r;flip[i]^=f;return [r,flip[i]]};
 const join=(i,j,rel)=>{const [ri,fi]=find(i),[rj,fj]=find(j);if(ri!==rj){par[rj]=ri;flip[rj]=fi^fj^rel}};
 for(const [a,b,m] of maps){const ids=D.F[a].ids;for(let t=0;t<5;t++){const u=ids[t],v=ids[(t+1)%5],e1=ek(u,v),e2=ek(m[u],m[v]);
  const s1=D.E[e1][0]===u?0:1,s2=D.E[e2][0]===m[u]?0:1;join(e1,e2,s1^s2)}}
 const roots=[...new Set(range(30).map(i=>find(i)[0]))],eid=i=>roots.indexOf(find(i)[0]);
 const esize=roots.map(r=>range(30).filter(i=>find(i)[0]===r).length);
 // boundary maps: faces → edge classes, edge classes → vertex classes
 const d2=maps.map(([a])=>{const row=new Array(roots.length).fill(0),ids=D.F[a].ids;for(let t=0;t<5;t++){const u=ids[t],v=ids[(t+1)%5],e=ek(u,v),[,fl]=find(e);row[eid(e)]+=(D.E[e][0]===u?1:-1)*(fl?-1:1)}return row});
 const d1=roots.map(r=>{const row=new Array(vcl.length).fill(0),e=D.E[r];row[vid[e[1]]]+=1;row[vid[e[0]]]-=1;return row});
 const s2=D6_snf(d2),s1=D6_snf(d1),free=roots.length-s1.length-s2.length,tors=s2.filter(x=>x>1);
 return {V:vcl.length,E:roots.length,F:maps.length,C:1,vid,esize,eid,d2,free,tors,h1:D6_groupText(free,tors),maps};
})}
const D6_TWISTS={1:{name:'Poincaré dodecahedral space',geo:'spherical'},3:{name:'Seifert–Weber space',geo:'hyperbolic'},5:{name:'real projective space ℝP³',geo:'spherical'}};
SCENE({id:'three-manifolds-dodecahedral',name:'A dodecahedron glued with a twist',tag:'Poincaré 1904; Weber & Seifert 1933',
 definition:'In 1904 Poincaré built a three-manifold that overturned his own earlier claim about spheres (next lesson). In 1933 C. Weber and Herbert Seifert described it simply: take a solid dodecahedron and glue each face to the opposite face after turning it a tenth of a turn. Turning by three tenths instead gives the Seifert–Weber space; by five tenths, every point of the boundary is glued to its opposite point, and the result is real projective space.',
 example:'Gluing puts several corners and several edges of the dodecahedron together. Round each glued edge the faces must close up to a full 360°. In Poincaré’s space three edges meet, so each needs 120°, more than a flat dodecahedron’s 116.57°: the dodecahedron must swell, as it does on the 3-sphere, so the space is spherical. In the Seifert–Weber space five edges meet and need 72°, so the faces must be pulled in, as in hyperbolic space.',
 desc:'A turning dodecahedron with one pair of opposite faces filled, its corners numbered by which ones the gluing puts together, and tiles for the numbers of corners, edges and faces after gluing, the number of edges glued together, the angle each must then have, and the alternating sum V − E + F − C.',
 research:['Poincaré (1904). Cinquième complément à l’Analysis situs. Rendiconti del Circolo Matematico di Palermo 18, 45–110.','Weber & Seifert (1933). Die beiden Dodekaederräume. Mathematische Zeitschrift 37, 237–253.','Counts computed here from the dodecahedron’s 20 vertices, 30 edges and 12 faces and the six gluing maps (union-find).'],
 dur:15,hint:'Choose the twist and which pair of faces to show. Corners with the same number become one point. Read the angle the edges need and compare it with a flat dodecahedron’s.',
 init:()=>({tw:1,pair:0,turn:20}),
 watch(p){return {tw:p<.5?1:p<.8?3:5,pair:Math.min(5,Math.floor(p*12)%6),turn:Math.round(p*120)}},
 ui:[{choose:[[1,'1/10 turn'],[3,'3/10'],[5,'5/10']],label:'Twist',get:s=>s.tw,act:'tw'},{range:'pair',label:'Face pair',min:1,max:6,get:s=>s.pair+1,act:'pair'},{range:'turn',label:'Turn the picture',min:0,max:120,step:5,get:s=>s.turn,act:'turn',show:v=>v*3+'°'}],
 on:{tw(s,v){if([1,3,5].includes(+v))s.tw=+v},pair(s,v){s.pair=clamp(Math.round(+v)-1,0,5)},turn(s,v){s.turn=clamp(Math.round(+v),0,120)}},
 draw(s){
  const D=D6_DODEC,sp=D6_dodecSpace(s.tw),Pv=D6_view(D6_rad(s.turn*3)+.3,.42,168,206,74),Q=D.V.map(Pv);
  const [fa,fb]=D.pairs[s.pair],k=sp.esize[0],need=360/k,flat=D6_deg(D.dih),chi=sp.V-sp.E+sp.F-sp.C,tw=D6_TWISTS[s.tw];
  let out=heading(tw.name);
  const poly=(fi,col)=>`<polygon points="${D.F[fi].ids.map(i=>Q[i].slice(0,2).map(fmt).join(',')).join(' ')}" fill="${col}" fill-opacity=".55" stroke="${col===C.coralp?C.coral:C.purple}" stroke-width="2"/>`;
  const dep=fi=>D.F[fi].ids.reduce((a,i)=>a+Q[i][2],0);
  const back=[fa,fb].sort((a,b)=>dep(a)-dep(b));
  for(const [a,b] of D.E){const fr=Q[a][2]+Q[b][2]>0;if(!fr)out+=L(Q[a][0],Q[a][1],Q[b][0],Q[b][1],C.line,1.3,'stroke-dasharray="4 4"')}
  out+=poly(back[0],back[0]===fa?C.coralp:C.purplep);
  for(const [a,b] of D.E){const fr=Q[a][2]+Q[b][2]>0;if(fr)out+=L(Q[a][0],Q[a][1],Q[b][0],Q[b][1],C.dark,1.8)}
  out+=poly(back[1],back[1]===fa?C.coralp:C.purplep);
  const lab=new Set([...D.F[fa].ids,...D.F[fb].ids]);
  for(let i=0;i<20;i++){const q=Q[i];if(lab.has(i))out+=Ci(q[0],q[1],10,'#fff',D.F[fa].ids.includes(i)?C.coral:C.purple)+TBF(q[0],q[1]+4.5,sp.vid[i]+1,12,C.ink);else out+=Ci(q[0],q[1],3,C.muted)}
  out+=TF(180,352,'coral face glued to purple; same number, same point',13,C.muted);
  const x0=340;
  out+=D6_tile(x0,52,78,'corners V',sp.V,C.ink)+D6_tile(x0+84,52,78,'edges E',sp.E,C.ink)+D6_tile(x0+168,52,78,'faces F',sp.F,C.ink);
  out+=D6_tile(x0,106,246,'edges glued into each; angle each needs',`${k}; 360° ÷ ${k} = ${D6_f(need,1)}°`,C.coral);
  out+=D6_tile(x0,160,246,'angle of a flat dodecahedron',D6_f(flat,2)+'°',C.ink);
  out+=D6_tile(x0,214,246,need>flat?'needs a fatter angle, so it is':'needs a thinner angle, so it is',tw.geo,need>flat?C.green:C.purple);
  out+=D6_tile(x0,268,246,'V − E + F − C, with one cell C',`${sp.V} − ${sp.E} + ${sp.F} − 1 = ${chi}`,C.blue);
  out+=TF(x0+123,336,'Every closed three-manifold gives 0.',13,C.muted);
  return {svg:out,phase:`With a ${s.tw}/10 twist the 20 corners become ${sp.V} ${D6_plural(sp.V,'point')} and the 30 edges become ${sp.E}, each made of ${k} edges. Round each glued edge ${k} angles must add to 360°, so each is ${D6_f(need,1)}°, against ${D6_f(flat,2)}° for a flat dodecahedron: this space is ${tw.geo}. V − E + F − C = ${chi}.`};
 }});

// Circles in the sky: the sphere of sight of radius R and its copy around an image of you at distance d = |n|·L meet
// when d < 2R, in a circle seen at angular radius arccos(d / 2R) from you, and seen again in the opposite direction.
function D6_circles(R){const sh=D6_shells(2*R-1e-6);return {sh,pairs:sum(sh.map(x=>x.n))/2}}
SCENE({id:'three-manifolds-circles',name:'Searching the sky for matching circles',tag:'Is our space a three-manifold that wraps round?',
 definition:'If our universe were a small 3-torus, or Poincaré’s dodecahedral space, light from the most distant thing we can see, the cosmic microwave background, would reach us from copies of the same region. The sphere we see out to would meet its own copies in circles, and each circle would appear twice in the sky with the same pattern of hot and cold spots (Cornish, Spergel and Starkman, 1998). Count the circles by moving the sphere’s radius.',
 example:'In 2003 Jean-Pierre Luminet and colleagues proposed a dodecahedral universe to explain weak large-scale patterns in the microwave background. Searches for matching circles in the WMAP data (Cornish and colleagues, 2004) and later the Planck data found none, so the proposal is not supported. A space much larger than the part we can see would leave no circles, so the shape of space remains undecided.',
 desc:'A slice through the unrolled space showing your sphere of sight as a circle, the spheres around the nearest copies of you, and the chords where they meet, which are the matching circles seen edge on; tiles count the matching pairs and give the angular size of the largest.',
 research:['Cornish, Spergel & Starkman (1998). Circles in the sky: finding topology with the microwave background radiation. Classical and Quantum Gravity 15, 2657–2670.','Luminet, Weeks, Riazuelo, Lehoucq & Uzan (2003). Dodecahedral space topology as an explanation for weak wide-angle temperature correlations in the cosmic microwave background. Nature 425, 593–595 (a proposal).','Cornish, Spergel, Starkman & Komatsu (2004). Constraining the topology of the universe. Physical Review Letters 92, 201302: no matching circles found.','Planck Collaboration (2016). Planck 2015 results XVIII: background geometry and topology of the Universe. Astronomy & Astrophysics 594, A18.'],
 dur:12,hint:'Move the slider to change how far we can see, measured in widths of the cube. Below half a width there are no circles at all.',
 init:()=>({R:.8}),
 watch(p){return {R:Math.round((.35+.8*smooth(p))*100)/100}},
 ui:[{range:'R',label:'Sight radius ÷ cube width',min:.3,max:1.2,step:.05,get:s=>s.R,act:'R',show:v=>D6_f(v)}],
 on:{R(s,v){s.R=clamp(Math.round(+v*20)/20,.3,1.2)}},
 draw(s){
  const S=78,cx=180,cy=206,c=D6_circles(s.R),r=s.R*S;
  let out=heading(c.pairs?`${c.pairs} ${D6_plural(c.pairs,'pair')} of matching circles`:'No matching circles: the space is too big to see round');
  out+=`<clipPath id="d6cc"><rect x="${cx-160}" y="${cy-150}" width="320" height="300" rx="8"/></clipPath>`;
  let g=R(cx-160,cy-150,320,300,'#fff',C.grid,8);
  for(let i=-3;i<=3;i++){g+=L(cx+(i-.5)*S,cy-150,cx+(i-.5)*S,cy+150,C.grid,1.1)+L(cx-160,cy+(i-.5)*S,cx+160,cy+(i-.5)*S,C.grid,1.1)}
  const near=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  for(const [i,j] of near){const x=cx+i*S,y=cy-j*S,d=Math.hypot(i,j)*S;g+=Ci(x,y,r,'none',C.line,'stroke-dasharray="4 4"')+Ci(x,y,4,C.blue);
}
  g+=Ci(cx,cy,r,C.pale,C.blue,'fill-opacity=".45"')+Ci(cx,cy,6,C.coral,'#fff');
  for(const [i,j] of near){const d=Math.hypot(i,j)*S;if(d<2*r){const mx=cx+i*S/2,my=cy-j*S/2,hh=Math.sqrt(r*r-d*d/4),nx=-j/Math.hypot(i,j),ny=-i/Math.hypot(i,j);g+=L(mx+nx*hh,my+ny*hh,mx-nx*hh,my-ny*hh,C.coral,3)}}
  out+=`<g clip-path="url(#d6cc)">${g}</g>`;
  const x0=364,first=c.sh[0];
  out+=D6_tile(x0,60,220,'sight radius',`${D6_f(s.R)} cube widths`,C.blue);
  out+=D6_tile(x0,114,220,'copies whose spheres meet yours',sum(c.sh.map(x=>x.n)),C.ink);
  out+=D6_tile(x0,168,220,'matching pairs of circles',c.pairs,C.coral);
  out+=D6_tile(x0,222,220,'largest circle’s angular radius',first?D6_f(D6_deg(Math.acos(Math.sqrt(first.q)/(2*s.R))),1)+'°':'none',C.coral);
  out+=TF(x0+110,292,'Copies nearer than 2R give circles',13,C.muted)+TF(x0+110,310,'of angular radius arccos(d ÷ 2R).',13,C.muted)+TF(x0+110,334,'Each pair: one circle, seen twice.',13,C.muted);
  out+=D6_note('you: coral dot · copies: blue · circles seen edge on: coral lines',374);
  return {svg:out,phase:c.pairs?`Your sphere of sight reaches ${D6_f(s.R)} cube widths, more than half a width, so it meets the spheres round ${sum(c.sh.map(x=>x.n))} copies of you, giving ${c.pairs} matching ${D6_plural(c.pairs,'pair')} of circles. Astronomers looked for such pairs in the microwave sky and found none.`:`A sphere of sight smaller than half a cube width never meets its copies, so no circles appear. If space wraps round on a scale larger than we can see, the circle test cannot detect it.`};
 }});

/* ===================== Lesson: poincare-conjecture ===================== */
// Loops on a sphere and on a torus. The torus loop is drawn on the gluing square through its lift γ(t) = b + t·(p, q) + wobble,
// and tightened by the straight-line deformation H(s, t) = (1 − s)·γ(t) + s·(b + t·(p, q)). Lengths are summed from samples.
const D6_LOOP_N=160;
function D6_torusLoop(p,q,s){const b=[.3,.35],pts=[];for(let i=0;i<=D6_LOOP_N;i++){const t=i/D6_LOOP_N,w=p||q?[.1*Math.sin(2*Math.PI*t)+.06*Math.sin(6*Math.PI*t),.13*Math.sin(4*Math.PI*t)]:[.2*(Math.cos(2*Math.PI*t)-1)+.05*Math.sin(6*Math.PI*t),.18*Math.sin(2*Math.PI*t)];
  const g=[b[0]+t*p+w[0],b[1]+t*q+w[1]],h=[b[0]+t*p,b[1]+t*q];pts.push([(1-s)*g[0]+s*h[0],(1-s)*g[1]+s*h[1]])}
 let len=0;for(let i=1;i<pts.length;i++)len+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);
 const wind=[Math.round(pts[D6_LOOP_N][0]-pts[0][0]),Math.round(pts[D6_LOOP_N][1]-pts[0][1])];return {pts,len,wind}}
function D6_sphereLoop(s){const pts=[];for(let i=0;i<=D6_LOOP_N;i++){const t=i/D6_LOOP_N,a=1.25*(1-s)*(1+.16*Math.sin(6*Math.PI*t)),ph=2*Math.PI*t;pts.push([Math.sin(a)*Math.cos(ph),Math.sin(a)*Math.sin(ph),Math.cos(a)])}
 let len=0;for(let i=1;i<pts.length;i++)len+=D6_norm(D6_sub(pts[i],pts[i-1]));return {pts,len}}
// Draw a lift on the unit square (x0, y0, side w), breaking the line where it passes through a glued side.
function D6_squareLift(pts,x0,y0,w,col,lw=2.6){let out='',seg=[];const M=q=>[x0+(q[0]-Math.floor(q[0]))*w,y0+w-(q[1]-Math.floor(q[1]))*w];
 pts.forEach((q,i)=>{const m=M(q);if(seg.length){const l=seg[seg.length-1];if(Math.abs(l[0]-m[0])>w/2||Math.abs(l[1]-m[1])>w/2){out+=D6_poly(seg,col,lw);seg=[]}}seg.push(m)});
 return out+D6_poly(seg,col,lw)}
function D6_gluedSquare(x0,y0,w){let out=R(x0,y0,w,w,'#fff',C.line,2);
 out+=arrow(x0+w*.3,y0+w,x0+w*.62,y0+w,C.purple,3)+arrow(x0+w*.3,y0,x0+w*.62,y0,C.purple,3)+arrow(x0,y0+w*.7,x0,y0+w*.38,C.coral,3)+arrow(x0+w,y0+w*.7,x0+w,y0+w*.38,C.coral,3);
 return out}
SCENE({id:'poincare-conjecture',name:'Loops that shrink and loops that cannot',tag:'Poincaré’s question, 1904',
 definition:'On a sphere every loop of string can be pulled in, sliding over the surface, until it shrinks to a point. On a torus a loop that goes once round the hole cannot: it can be pulled tight, but never off. A space in which every loop shrinks is called simply connected. Among closed surfaces only the sphere is. In 1904 Poincaré asked whether the same is true one dimension up: is every closed, simply connected three-manifold the 3-sphere?',
 example:'On the torus, drawn here as a square with glued sides, a loop that crosses the coral sides p times and the purple sides q times keeps those numbers however it is moved. Pulled tight it becomes the straight line from its start to the copy p squares across and q up, of length √(p² + q²), which is zero only when p = q = 0. The sphere has no such numbers to keep.',
 desc:'A sphere with a wavy loop beside the torus drawn as a square with glued sides and a loop on it; a slider pulls both loops tight, and tiles show the loops’ lengths and the torus loop’s crossing numbers.',
 research:['Poincaré (1904). Cinquième complément à l’Analysis situs. Rendiconti del Circolo Matematico di Palermo 18, 45–110: the question about simply connected three-manifolds.','Poincaré (1895). Analysis situs: the fundamental group, the group of loops of a space.'],
 dur:12,hint:'Set how many times the torus loop goes across (p) and up (q), then pull both loops tight with the slider. Which loops reach length zero?',
 init:()=>({p:1,q:0,s:0}),
 watch(p){return {p:1,q:0,s:Math.round(smooth(p*1.15)*100)}},
 ui:[{range:'s',label:'Pull tight',min:0,max:100,step:5,get:s=>s.s,act:'s',show:v=>v+'%'},{range:'p',label:'Across, p',min:-2,max:2,get:s=>s.p,act:'p'},{range:'q',label:'Up, q',min:-2,max:2,get:s=>s.q,act:'q'}],
 on:{s(s,v){s.s=clamp(Math.round(+v),0,100)},p(s,v){s.p=clamp(Math.round(+v),-2,2)},q(s,v){s.q=clamp(Math.round(+v),-2,2)}},
 draw(s){
  const u=s.s/100,sl=D6_sphereLoop(u),tl=D6_torusLoop(s.p,s.q,u),Pv=D6_view(.3,.62,150,212,112);
  let out=heading(u<1?'Pull both loops tight':tl.len<1e-6?'Both loops have shrunk to a point':'The sphere’s loop is gone; the torus loop is stuck');
  out+=Ci(150,212,112,C.pale,C.line);
  for(const lat of [.5,1,1.5,2,2.5]){const pts=range(61).map(i=>Pv([Math.sin(lat)*Math.cos(i/60*2*Math.PI),Math.sin(lat)*Math.sin(i/60*2*Math.PI),Math.cos(lat)]));let seg=[],o='';pts.forEach(q=>{if(q[2]>0)seg.push(q);else{o+=D6_poly(seg,C.grid,1.2);seg=[]}});out+=o+D6_poly(seg,C.grid,1.2)}
  const sq=sl.pts.map(Pv);out+=D6_poly(sq.filter(q=>q[2]>-.02),C.green,2.8)+Ci(...Pv([0,0,1]).slice(0,2),4,C.green);
  out+=TF(150,352,'a loop on the sphere',13,C.muted);
  const x0=338,y0=78,w=210;out+=D6_gluedSquare(x0,y0,w)+D6_squareLift(tl.pts,x0,y0,w,C.blue);
  const st=[x0+(tl.pts[0][0]%1)*w,y0+w-(tl.pts[0][1]%1)*w];out+=Ci(st[0],st[1],4,C.blue);
  out+=TF(x0+w/2,y0-12,'a loop on the torus (square with glued sides)',13,C.muted);
  out+=D6_tile(x0-24,300,84,'sphere loop',D6_f(sl.len),C.green)+D6_tile(x0+66,300,84,'torus loop',D6_f(tl.len),C.blue)+D6_tile(x0+156,300,102,'crosses (p, q)',D6_minus(`(${tl.wind[0]}, ${tl.wind[1]})`),C.ink);
  const stuck=tl.wind[0]||tl.wind[1];
  return {svg:out,phase:u<1?`Pulled ${s.s}% of the way. The sphere’s loop has length ${D6_f(sl.len)} (radius 1) and keeps shrinking. The torus loop crosses the glued sides (${D6_minus(tl.wind.join(', '))}) times${stuck?', and no sliding can change that':''}.`:
   stuck?`The sphere’s loop has shrunk to a point. The torus loop is as tight as it can be: a straight line of length ${D6_f(tl.len)} = √(${D6_minus(s.p)}² + ${D6_minus(s.q)}²). It cannot shrink further, so the torus is not simply connected.`:`With p = q = 0 the torus loop never went round the hole, and it shrinks to a point too. Loops like this are the only ones that do.`};
 }});

// Poincaré's first guess: a space with the homology of the sphere is a sphere. The group of loops of his dodecahedral
// space is the binary icosahedral group, generated here as unit quaternions and counted.
const D6_qmul=(a,b)=>[a[0]*b[0]-a[1]*b[1]-a[2]*b[2]-a[3]*b[3],a[0]*b[1]+a[1]*b[0]+a[2]*b[3]-a[3]*b[2],a[0]*b[2]-a[1]*b[3]+a[2]*b[0]+a[3]*b[1],a[0]*b[3]+a[1]*b[2]-a[2]*b[1]+a[3]*b[0]];
function D6_qgroup(gens){const key=q=>q.map(v=>Math.round(v*1e6)).join(','),seen=new Map([[key([1,0,0,0]),[1,0,0,0]]]),todo=[[1,0,0,0]];
 while(todo.length&&seen.size<1000){const a=todo.pop();for(const g of gens){const c=D6_qmul(a,g),k=key(c);if(!seen.has(k)){seen.set(k,c);todo.push(c)}}}return [...seen.values()]}
const D6_ICOSIANS=D6_memo('ico',()=>D6_qgroup([[.5,.5,.5,.5],[0,.5,D6_PHI/2,1/(2*D6_PHI)]]));
// The 3-torus from a cube: one corner, three edges, three faces, one cell; each face's boundary is a − b − a + b.
const D6_T3CELLS=D6_memo('t3c',()=>{const d2=[[1,-1,0].map(()=>0),[0,0,0],[0,0,0]],s2=D6_snf(d2),s1=D6_snf([[0],[0],[0]]);return {V:1,E:3,F:3,C:1,free:3-s1.length-s2.length,tors:[],d2}});
const D6_SPACES={s3:{name:'3-sphere',cells:()=>({V:1,E:0,F:0,C:1,free:0,tors:[],d2:[]}),loops:()=>'1 (every loop shrinks)',sph:true},
 poin:{name:'Poincaré’s space',cells:()=>D6_dodecSpace(1),loops:()=>`${D6_ICOSIANS.length} (computed)`,sph:false},
 rp3:{name:'ℝP³ (5/10 twist)',cells:()=>D6_dodecSpace(5),loops:()=>`${D6_qgroup([[-1,0,0,0]]).length} (computed)`,sph:false},
 sw:{name:'Seifert–Weber',cells:()=>D6_dodecSpace(3),loops:()=>'infinitely many',sph:false},
 t3:{name:'3-torus',cells:()=>D6_T3CELLS,loops:()=>'infinitely many',sph:false}};
SCENE({id:'poincare-conjecture-homology',name:'Poincaré’s first guess fails',tag:'Homology is not enough, 1900–1904',
 definition:'Homology counts the holes of a space by algebra on its cells: from how the faces of a glued polyhedron run along its edges, one computes a group, H₁, that is 0 for the sphere. In 1900 Poincaré stated that a three-manifold with the same homology as the sphere must be the sphere. In 1904 he found a counterexample: the dodecahedral space of the previous lesson has H₁ = 0, yet some loops in it cannot shrink. So he asked his question about loops instead.',
 example:'For each glued space the program writes down which edges run round each face (the matrix on the left), reduces it to diagonal form, and reads off H₁. Poincaré’s space gives 0, exactly like the sphere. Its loops, though, form a group with 120 elements: the binary icosahedral group, generated here as 120 unit quaternions, the same 120 points that are the corners of the 600-cell.',
 desc:'A matrix of whole numbers showing, for each face of the glued space, how many times its boundary runs along each edge, its diagonal form, and tiles for the cell counts, the homology group H₁, the number of loop classes, and whether each test says “sphere”.',
 research:['Poincaré (1900). Second complément à l’Analysis situs. Proceedings of the London Mathematical Society 32, 277–308: the homology claim.','Poincaré (1904). Cinquième complément à l’Analysis situs: the counterexample and the question about loops.','Seifert & Threlfall (1934). Lehrbuch der Topologie: homology computed from cells; the dodecahedral space’s group of order 120.'],
 dur:14,hint:'Choose a space. Compare its homology H₁ with the sphere’s, then compare the number of different loops. Only the loop test tells Poincaré’s space from the sphere.',
 init:()=>({sp:'poin'}),
 watch(p){const k=['s3','poin','rp3','sw','t3'];return {sp:k[Math.min(4,Math.floor(p*5))]}},
 ui:[{choose:Object.keys(D6_SPACES).map(k=>[k,D6_SPACES[k].name]),label:'Space',get:s=>s.sp,act:'sp'}],
 on:{sp(s,v){if(D6_SPACES[v])s.sp=v}},
 draw(s){
  const S=D6_SPACES[s.sp],c=S.cells(),h1=D6_groupText(c.free,c.tors),hs=h1==='0';
  let out=heading(`${S.name}: H₁ = ${h1}`);
  const rows=c.d2.length,cols=rows?c.d2[0].length:0,cw=cols>6?22:30,x0=40,y0=78;
  out+=TF(x0,y0-14,rows?'faces (rows) × glued edges (columns)':'no faces in this cell structure',13,C.muted,'start');
  c.d2.forEach((r,i)=>r.forEach((v,j)=>{out+=R(x0+j*cw,y0+i*26,cw-2,24,v?C.pale:'#fff',C.grid,3)+TMF(x0+j*cw+cw/2-1,y0+i*26+17,D6_minus(v),13,v?C.ink:C.muted)}));
  if(rows){const snf=D6_snf(c.d2);out+=TF(x0,y0+rows*26+24,`diagonal form: ${snf.length?snf.join(', '):'all zero'}${snf.length<Math.min(rows,cols)?', then zeros':''}`,13,C.ink,'start');
   out+=TF(x0,y0+rows*26+44,c.tors.length?`entries above 1 give the finite parts of H₁`:`no entry above 1, so no finite part`,13,C.muted,'start')}
  if(s.sp==='s3')out+=TF(x0,y0+20,'One point and one solid ball whose whole',13,C.ink,'start')+TF(x0,y0+40,'boundary is squeezed to that point.',13,C.ink,'start');
  if(s.sp==='t3')out+=TF(x0,y0+3*26+64,'each face runs along a, b, then back: total 0',13,C.muted,'start');
  const tx=360;out+=D6_tile(tx,60,220,'cells V, E, F, C',`${c.V}, ${c.E}, ${c.F}, ${c.C}`,C.ink);
  out+=D6_tile(tx,114,220,'homology H₁',h1,hs?C.green:C.coral);
  out+=D6_tile(tx,168,220,'homology says',hs?'looks like a sphere':'not a sphere',hs?C.green:C.coral);
  out+=D6_tile(tx,222,220,'different loops',S.loops(),S.sph?C.green:C.coral);
  out+=D6_tile(tx,276,220,'loops say',S.sph?'a sphere':'not a sphere',S.sph?C.green:C.coral);
  out+=D6_note(s.sp==='poin'?'Poincaré’s space passes the homology test and fails the loop test.':'H₁ from the cell counts and the face–edge matrix (Smith normal form).',366);
  const ph=s.sp==='poin'?`Poincaré’s space: ${c.V} corners, ${c.E} edges, ${c.F} faces and 1 cell, and H₁ = 0, just like the sphere. But its loops form a group of ${D6_ICOSIANS.length} elements, so most loops cannot shrink. Homology cannot see the difference; loops can.`:
   s.sp==='s3'?'The 3-sphere can be made from one point and one solid ball with its whole boundary squeezed to the point. There are no edges, so H₁ = 0, and every loop shrinks.':
   `${S.name}: H₁ = ${h1}${hs?'':', so already homology shows it is not a sphere'}. Its loops: ${S.loops()}.`;
  return {svg:out,phase:ph};
 }});

// Who proved the Poincaré conjecture in each dimension, and why "simply connected" is enough only in dimension 3.
const D6_PC_DIMS={1:['a closed curve is a circle','classical'],2:['the classification of surfaces','19th century'],3:['Grigori Perelman','2002–03'],4:['Michael Freedman (continuous)','1982'],5:['Stephen Smale','1961'],6:['Stephen Smale','1961'],7:['Smale; also Stallings','1960–61']};
// Cells of a product of spheres S^a × S^b: one cell in each of dimensions 0, a, b, a + b (all boundary maps are zero).
const D6_cellsProd=(a,b)=>{const c={};for(const d of [0,a,b,a+b])c[d]=(c[d]||0)+1;return c};
const D6_chiOf=c=>Object.entries(c).reduce((t,[d,n])=>t+((+d)%2?-n:n),0);
SCENE({id:'poincare-conjecture-dimensions',name:'Answered in higher dimensions first',tag:'Smale 1961, Freedman 1982, Perelman 2003',
 definition:'In higher dimensions the question has to be asked more carefully: an n-manifold that has every kind of hole the n-sphere has, and no others (a homotopy sphere), is it the n-sphere? Stephen Smale proved it for dimensions 5 and up in 1961; John Stallings and Christopher Zeeman found other proofs at the same time. Michael Freedman proved dimension 4 in 1982. Dimension 3, Poincaré’s own case, came last.',
 example:'Why the care? From dimension 4 on, a space can be simply connected and still not a sphere. In S² × S², every loop shrinks, but a 2-sphere inside it cannot: the cells show it, one in each of dimensions 0, 2, 2 and 4, against the sphere’s 0 and 4. In dimension 3 a simply connected closed manifold has no such hidden holes, so Poincaré’s loop question and the careful one are the same.',
 desc:'A row of dimensions from 1 to 7 with who proved the Poincaré conjecture there and when, and below it two cell diagrams for the chosen dimension: the n-sphere and the product of a 2-sphere with an (n − 2)-sphere, with their cells counted by dimension and their Euler characteristics.',
 research:['Smale (1961). Generalized Poincaré’s conjecture in dimensions greater than four. Annals of Mathematics 74, 391–406.','Stallings (1960). Polyhedral homotopy-spheres. Bulletin of the AMS 66, 485–488 (dimensions 7 and up); Zeeman (1961), dimensions 5 and 6.','Freedman (1982). The topology of four-dimensional manifolds. Journal of Differential Geometry 17, 357–453.','Perelman (2002, 2003). arXiv math/0211159, math/0303109, math/0307245.'],
 dur:13,hint:'Choose a dimension. Compare the cells of the sphere with those of S² × S^(n − 2): in which dimensions does a simply connected space that is not a sphere exist?',
 init:()=>({n:4}),
 watch(p){return {n:1+Math.min(6,Math.floor(p*7))}},
 ui:[{range:'n',label:'Dimension n',min:1,max:7,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),1,7)}},
 draw(s,f,X){
  const n=s.n;let out=heading(`Dimension ${n}: ${D6_PC_DIMS[n][0]}, ${D6_PC_DIMS[n][1]}`);
  for(let d=1;d<=7;d++){const x=26+(d-1)*79,on=d===n,inner=R(x,52,74,60,on?C.pale:'#fff',on?C.blue:C.grid,8)+TBF(x+37,74,'n = '+d,14,on?C.blue:C.ink)+TF(x+37,96,D6_PC_DIMS[d][1].replace('19th century','1800s'),13,C.muted);
   out+=hit(X,'n',d,`Dimension ${d}`,inner)}
  const sph={0:1};sph[n]=(sph[n]||0)+1;
  const bars=(x,y,cells,title,col)=>{let o=TBF(x,y,title,14,C.ink,'start');for(let d=0;d<=n;d++){const k=cells[d]||0,bx=x+d*34;o+=R(bx,y+14,28,70,'#fff',C.grid,4);for(let i=0;i<k;i++)o+=R(bx+4,y+68-i*22,20,16,col,'none',3);o+=TF(bx+14,y+102,d,13,C.muted)}
   return o+TF(x,y+122,`cells by dimension; χ = ${D6_minus(D6_chiOf(cells))}`,13,C.ink,'start')};
  out+=bars(30,140,sph,`the ${n}-sphere`,C.green);
  if(n>=3){const pr=D6_cellsProd(2,n-2),sc=n-2>=2;out+=bars(330,140,pr,`S² × S${'⁰¹²³⁴⁵⁶⁷'[n-2]}`,C.coral);
   out+=D6_note(sc?`S² × S${'⁰¹²³⁴⁵⁶⁷'[n-2]}: loops shrink, yet a 2-sphere inside cannot.`:'S² × S¹: a loop round the S¹ cannot shrink.',368)}
  else out+=(n===1?['Every closed, connected','1-manifold is a circle:','nothing to ask.']:['The sphere is the only','closed surface in which','every loop shrinks.']).map((l,i)=>TF(330,180+i*22,l,14,C.ink,'start')).join('');
  return {svg:out,phase:n>=4?`In dimension ${n}, S² × S${'⁰¹²³⁴⁵⁶⁷'[n-2]} is simply connected but has cells in dimensions ${Object.keys(D6_cellsProd(2,n-2)).join(', ')} and χ = ${D6_minus(D6_chiOf(D6_cellsProd(2,n-2)))}, against the sphere’s χ = ${D6_chiOf(sph)}. So the higher-dimensional conjecture asks for a homotopy sphere. ${D6_PC_DIMS[n][0]} proved it (${D6_PC_DIMS[n][1]}).`:
   n===3?'Dimension 3: S² × S¹ has a loop that cannot shrink. Perelman proved that a closed three-manifold in which every loop shrinks is the 3-sphere.':n===2?'Dimension 2: by the classification of surfaces (era 4), the sphere is the only closed surface in which every loop shrinks.':'Dimension 1: every closed connected curve is a circle, the 1-sphere, so there is nothing to ask.'};
 }});

// Curve-shortening flow: each point moves along its curvature vector. Computed on a polygon of 180 points, resampled
// evenly every 150 steps; the time step is 0.12 × (shortest side)².
const D6_CSF_SHAPES={star:{name:'Star',r:t=>1+.3*Math.cos(5*t)},peanut:{name:'Peanut',r:t=>1+.55*Math.cos(2*t)},blob:{name:'Wobbly',r:t=>1+.2*Math.sin(3*t)+.12*Math.cos(7*t)}};
const D6_area=pts=>{let a=0;for(let i=0;i<pts.length;i++){const p=pts[i],q=pts[(i+1)%pts.length];a+=p[0]*q[1]-q[0]*p[1]}return a/2};
const D6_perim=pts=>{let l=0;for(let i=0;i<pts.length;i++){const p=pts[i],q=pts[(i+1)%pts.length];l+=Math.hypot(q[0]-p[0],q[1]-p[1])}return l};
function D6_resample(pts,N){const n=pts.length,cum=[0];for(let i=0;i<n;i++){const p=pts[i],q=pts[(i+1)%n];cum.push(cum[i]+Math.hypot(q[0]-p[0],q[1]-p[1]))}
 const Lt=cum[n],out=[];let j=0;for(let k=0;k<N;k++){const s=k*Lt/N;while(cum[j+1]<s)j++;const u=(s-cum[j])/((cum[j+1]-cum[j])||1),p=pts[j],q=pts[(j+1)%n];out.push([p[0]+(q[0]-p[0])*u,p[1]+(q[1]-p[1])*u])}return out}
const D6_CSF_K=30;
function D6_csf(key){return D6_memo('csf'+key,()=>{
 const N=180,rf=D6_CSF_SHAPES[key].r;let pts=range(N).map(i=>{const t=i/N*2*Math.PI,r=rf(t);return [r*Math.cos(t),r*Math.sin(t)]});
 const A0=D6_area(pts),snaps=[{t:0,pts:pts.slice(),A:A0,L:D6_perim(pts)}];let t=0,step=0;
 while(snaps.length<D6_CSF_K&&step<400000){
  const n=pts.length,ls=range(n).map(i=>{const p=pts[i],q=pts[(i+1)%n];return Math.hypot(q[0]-p[0],q[1]-p[1])}),dt=.12*Math.min(...ls)**2;
  pts=pts.map((p,i)=>{const a=pts[(i+n-1)%n],b=pts[(i+1)%n],l1=ls[(i+n-1)%n],l2=ls[i],k=2/(l1+l2);return [p[0]+dt*k*((b[0]-p[0])/l2-(p[0]-a[0])/l1),p[1]+dt*k*((b[1]-p[1])/l2-(p[1]-a[1])/l1)]});
  t+=dt;step++;if(step%150===0)pts=D6_resample(pts,N);
  const A=D6_area(pts);if(A<=A0*(1-snaps.length/D6_CSF_K*.94))snaps.push({t,pts:pts.slice(),A,L:D6_perim(pts)});
 }
 return snaps;
})}
const D6_curv=pts=>{const n=pts.length,k=[];for(let i=0;i<n;i++){const a=pts[(i+n-1)%n],p=pts[i],b=pts[(i+1)%n],t1=Math.atan2(p[1]-a[1],p[0]-a[0]),t2=Math.atan2(b[1]-p[1],b[0]-p[0]);let d=t2-t1;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;k.push(d/((Math.hypot(p[0]-a[0],p[1]-a[1])+Math.hypot(b[0]-p[0],b[1]-p[1]))/2))}return k};
SCENE({id:'poincare-conjecture-flow',name:'Smoothing a shape until it is round',tag:'Hamilton’s Ricci flow, 1982; Perelman, 2002–03',
 definition:'In 1982 Richard Hamilton proposed proving Poincaré’s conjecture by letting the shape of a space flow: Ricci flow changes distances so that curvature spreads out, as heat spreads through metal, and Hamilton hoped any simply connected three-manifold would become a round 3-sphere. The flow can pinch thin necks. Grigori Perelman found how to cut at the pinches and carry on, and how the pieces end, in three preprints in 2002–03.',
 example:'Analogy only: this is the curve-shortening flow of a loop in the plane, not Ricci flow. Every point moves inwards in proportion to how sharply the curve bends there. Gage and Hamilton (1986) and Grayson (1987) proved that any such loop becomes round and shrinks to a point, losing area at the steady rate 2π, which the tiles check. Perelman’s proof was checked by Kleiner and Lott, by Morgan and Tian, and by Cao and Zhu (2006); he declined the Fields Medal (2006) and the Clay Millennium Prize (2010).',
 desc:'A closed curve in the plane flowing under curve shortening, with earlier stages drawn faintly, and tiles for the time, the length, the enclosed area, a roundness score that reaches 1 for a circle, and the measured rate of area loss against 2π.',
 research:['Hamilton (1982). Three-manifolds with positive Ricci curvature. Journal of Differential Geometry 17, 255–306.','Gage & Hamilton (1986). The heat equation shrinking convex plane curves. Journal of Differential Geometry 23, 69–96; Grayson (1987). The heat equation shrinks embedded plane curves to round points. Journal of Differential Geometry 26, 285–314.','Perelman (2002, 2003). arXiv math/0211159, math/0303109, math/0307245. Checked by Kleiner & Lott (2008), Geometry & Topology 12, 2587–2855; Morgan & Tian (2007), Ricci Flow and the Poincaré Conjecture, Clay Mathematics Monographs 3; Cao & Zhu (2006), Asian Journal of Mathematics 10, 165–492.'],
 dur:14,hint:'Choose a starting shape and move the time slider. Watch the roundness rise to 1 and compare the measured rate of area loss with 2π. This is an analogy for Ricci flow, not the flow itself.',
 init:()=>({sh:'star',k:12}),
 watch(p){const sh=p<.5?'star':'peanut',u=p<.5?p*2:(p-.5)*2;return {sh,k:Math.min(D6_CSF_K-1,Math.floor(smooth(u)*D6_CSF_K))}},
 ui:[{choose:Object.keys(D6_CSF_SHAPES).map(k=>[k,D6_CSF_SHAPES[k].name]),label:'Starting shape',get:s=>s.sh,act:'sh'},{range:'k',label:'Time',min:0,max:D6_CSF_K-1,get:s=>s.k,act:'k'}],
 on:{sh(s,v){if(D6_CSF_SHAPES[v])s.sh=v},k(s,v){s.k=clamp(Math.round(+v),0,D6_CSF_K-1)}},
 draw(s){
  const sn=D6_csf(s.sh),k=Math.min(s.k,sn.length-1),c=sn[k],cx=170,cy=206,S=104,M=q=>[cx+q[0]*S,cy-q[1]*S];
  const round=4*Math.PI*c.A/(c.L*c.L),kk=D6_curv(c.pts),kmin=Math.min(...kk),kmax=Math.max(...kk);
  const rate=k>0?(sn[k-1].A-c.A)/(c.t-sn[k-1].t):(sn[0].A-sn[1].A)/(sn[1].t-sn[0].t);
  let out=heading(round>.995?'Round, and still shrinking':kmin<0?'Bent inwards in places, so those parts move outwards':'Convex now: every part bends the same way');
  out+=R(cx-150,cy-150,300,300,'#fff',C.grid,8);
  for(let j=0;j<k;j+=4)out+=P('M'+sn[j].pts.map(q=>M(q).map(fmt).join(' ')).join(' L')+'Z',C.line,1.2);
  out+=P('M'+c.pts.map(q=>M(q).map(fmt).join(' ')).join(' L')+'Z',C.blue,2.8,C.pale,'fill-opacity=".5"');
  out+=TF(cx+6,cy+170,'Analogy: curve shortening, not Ricci flow',13,C.coral);
  const x0=352;
  out+=D6_tile(x0,56,112,'time',D6_f(c.t,3),C.ink)+D6_tile(x0+120,56,112,'length',D6_f(c.L),C.ink);
  out+=D6_tile(x0,110,112,'area',D6_f(c.A,3),C.ink)+D6_tile(x0+120,110,112,'roundness',D6_f(round,3),round>.99?C.green:C.blue);
  out+=D6_tile(x0,164,232,'area lost per unit time',`${D6_f(rate)} (theory 2π = ${D6_f(2*Math.PI)})`,C.green);
  out+=D6_tile(x0,218,232,'bending, least to most',`${D6_minus(D6_f(kmin))} to ${D6_f(kmax)}`,kmin<0?C.coral:C.blue);
  out+=TF(x0+116,290,'roundness = 4π × area ÷ length²,',13,C.muted)+TF(x0+116,308,'which is 1 only for a circle',13,C.muted);
  return {svg:out,phase:`Time ${D6_f(c.t,3)}: length ${D6_f(c.L)}, area ${D6_f(c.A,3)}, roundness ${D6_f(round,3)}. ${kmin<0?'Where the curve bends inwards it moves outwards, so dents fill in.':'Every part now bends the same way, and the curve rounds out as it shrinks.'} Area falls at ${D6_f(rate)} per unit time; the theorem says exactly 2π.`};
 }});

/* ===================== Lesson: geometrisation ===================== */
// Equilateral triangles of side a in the three constant-curvature geometries (curvature +1, 0, −1). The vertices are placed
// at circumradius ρ from a centre; sides and angles are then measured from the vertices with dot products.
const D6_mink=(a,b)=>-a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
function D6_tri(kind,a){const th=[90,210,330].map(D6_rad);let V,dist,ang,side;
 if(kind==='S'){const r=Math.asin(Math.sqrt((1-Math.cos(a))/1.5));V=th.map(t=>[Math.sin(r)*Math.cos(t),Math.sin(r)*Math.sin(t),Math.cos(r)]);
  dist=(p,q)=>Math.acos(clamp(D6_dot(p,q),-1,1));ang=(p,q,o)=>{const u=D6_sub(q,D6_mul(p,D6_dot(p,q))),v=D6_sub(o,D6_mul(p,D6_dot(p,o)));return Math.acos(clamp(D6_dot(u,v)/D6_norm(u)/D6_norm(v),-1,1))};
  side=(p,q,t)=>{const d=dist(p,q);return D6_add(D6_mul(p,Math.sin((1-t)*d)/Math.sin(d)),D6_mul(q,Math.sin(t*d)/Math.sin(d)))}}
 else if(kind==='H'){const r=Math.asinh(Math.sqrt((Math.cosh(a)-1)/1.5));V=th.map(t=>[Math.cosh(r),Math.sinh(r)*Math.cos(t),Math.sinh(r)*Math.sin(t)]);
  dist=(p,q)=>Math.acosh(Math.max(1,-D6_mink(p,q)));ang=(p,q,o)=>{const u=D6_add(q,D6_mul(p,D6_mink(p,q))),v=D6_add(o,D6_mul(p,D6_mink(p,o)));return Math.acos(clamp(D6_mink(u,v)/Math.sqrt(D6_mink(u,u)*D6_mink(v,v)),-1,1))};
  side=(p,q,t)=>{const d=dist(p,q);return D6_add(D6_mul(p,Math.sinh((1-t)*d)/Math.sinh(d)),D6_mul(q,Math.sinh(t*d)/Math.sinh(d)))}}
 else{const r=a/Math.sqrt(3);V=th.map(t=>[r*Math.cos(t),r*Math.sin(t),0]);dist=(p,q)=>D6_norm(D6_sub(p,q));ang=(p,q,o)=>{const u=D6_sub(q,p),v=D6_sub(o,p);return Math.acos(clamp(D6_dot(u,v)/D6_norm(u)/D6_norm(v),-1,1))};side=(p,q,t)=>D6_add(D6_mul(p,1-t),D6_mul(q,t))}
 const angs=[0,1,2].map(i=>ang(V[i],V[(i+1)%3],V[(i+2)%3])),sides=[0,1,2].map(i=>dist(V[i],V[(i+1)%3]));
 const edges=[0,1,2].map(i=>range(25).map(j=>side(V[i],V[(i+1)%3],j/24)));
 return {V,angs,sides,sum:sum(angs),edges}}
const D6_TRI_CLOSED={S:a=>Math.acos(Math.cos(a)/(1+Math.cos(a))),E:()=>Math.PI/3,H:a=>Math.acos(Math.cosh(a)/(1+Math.cosh(a)))};
SCENE({id:'geometrisation',name:'Three geometries seen from inside',tag:'Spherical, flat and hyperbolic space',
 definition:'William Thurston’s programme (next scene) says that three-manifolds are best understood through the geometry they can carry. The three most symmetric choices are the ones met in era 5, now in three dimensions: spherical space, where triangles have angles adding to more than 180°; flat Euclidean space, exactly 180°; and hyperbolic space, less. An inhabitant can tell them apart from inside, by drawing large triangles and circles.',
 example:'The triangles here are equilateral with sides a, measured in units of the curvature radius. For small triangles all three geometries agree with Euclid. As a grows the spherical angle sum climbs above 180° and the hyperbolic one falls towards 0°. A circle of radius a has circumference 2π sin a, 2πa or 2π sinh a: smaller than flat on the sphere, larger in hyperbolic space.',
 desc:'Three panels: an equilateral triangle on a sphere seen from above, the same in the flat plane, and in the Poincaré disc model of the hyperbolic plane; under each, the angle sum measured from the drawn corners and the circumference of a circle of the same radius compared with a flat one.',
 research:['Thurston (1997). Three-Dimensional Geometry and Topology, vol. 1. Princeton University Press: the three constant-curvature geometries from inside.','Gauss–Bonnet for a triangle: angle sum − 180° = curvature × area (era 5). Angles measured here from the tangent vectors at the corners.'],
 dur:12,hint:'Move the slider to make the triangles bigger. Read the angle sums: they agree for small triangles and separate for large ones.',
 init:()=>({a:1.2}),
 watch(p){return {a:Math.round((.15+1.8*smooth(p))*20)/20}},
 ui:[{range:'a',label:'Side a (curvature radii)',min:.1,max:2,step:.05,get:s=>s.a,act:'a',show:v=>D6_f(v)}],
 on:{a(s,v){s.a=clamp(Math.round(+v*20)/20,.1,2)}},
 draw(s){
  const a=s.a,T={S:D6_tri('S',a),E:D6_tri('E',a),H:D6_tri('H',a)},cy=158,R0=86;
  let out=heading(`Equilateral triangles with side ${D6_f(a)}`);
  const panel=(cx,kind,title,col)=>{const t=T[kind];let o=TBF(cx,58,title,14,col);
   if(kind==='S')o+=Ci(cx,cy,R0,C.pale,C.line);else if(kind==='H')o+=Ci(cx,cy,R0,C.purplep,C.line);else o+=R(cx-R0,cy-R0,2*R0,2*R0,C.greenp,C.line,6);
   const M=kind==='S'?q=>[cx+q[0]*R0,cy-q[1]*R0]:kind==='H'?q=>[cx+q[1]/(1+q[0])*R0,cy-q[2]/(1+q[0])*R0]:q=>[cx+q[0]*R0/1.3,cy-q[1]*R0/1.3+10];
   o+=t.edges.map(e=>D6_poly(e.map(M),col,2.6)).join('')+t.V.map(v=>Ci(...M(v),4,col)).join('');
   const sd=D6_deg(t.sum);o+=D6_tile(cx-88,cy+R0+10,176,'angle sum',D6_f(sd,1)+'°',col);
   const circ=kind==='S'?Math.sin(a)/a:kind==='H'?Math.sinh(a)/a:1;o+=D6_tile(cx-88,cy+R0+60,176,'circle ÷ flat circle',D6_f(circ,3),col);
   return o};
  out+=panel(104,'S','spherical',C.blue)+panel(300,'E','flat',C.green)+panel(496,'H','hyperbolic',C.purple);
  const chk=['S','E','H'].every(k=>Math.abs(T[k].angs[0]-D6_TRI_CLOSED[k](a))<1e-6&&T[k].sides.every(x=>Math.abs(x-a)<1e-6));
  out+=D6_note(`Sides re-measured from the corners: all ${D6_f(a)}${chk?'; angles match the cosine law':''}.`,374);
  const sS=D6_deg(T.S.sum),sH=D6_deg(T.H.sum);
  return {svg:out,phase:`With side ${D6_f(a)}: ${D6_f(sS,1)}° on the sphere, 180° in flat space, ${D6_f(sH,1)}° in hyperbolic space. The excess ${D6_f(sS-180,1)}° and the shortfall ${D6_f(180-sH,1)}° are the triangles’ areas in degrees, by Gauss–Bonnet.`};
 }});

// Sectional curvatures of the eight geometries in three perpendicular planes. For the four that are Lie groups with a
// left-invariant metric, Milnor's formula from structure constants λ: μᵢ = ½Σλ − λᵢ, Ricci rᵢ = 2μⱼμₖ, K(eᵢ,eⱼ) = (rᵢ + rⱼ − rₖ)/2.
const D6_GEOS=[
 {name:'Spherical S³',lie:[2,2,2],ex:'Poincaré’s dodecahedral space; lens spaces'},
 {name:'Euclidean E³',lie:[0,0,0],ex:'the 3-torus and five other flat spaces'},
 {name:'Hyperbolic H³',K:-1,ex:'the Seifert–Weber space; most knot complements'},
 {name:'S² × ℝ',prod:1,ex:'S² × S¹'},
 {name:'H² × ℝ',prod:-1,ex:'a two-holed surface × a circle'},
 {name:'Nil',lie:[1,0,0],ex:'torus bundles with a shear (next scene)'},
 {name:'SL(2,ℝ)~',lie:[1,1,-1],ex:'unit tangent bundles of hyperbolic surfaces'},
 {name:'Sol',lie:[1,-1,0],ex:'torus bundles with a stretch (next scene)'}];
function D6_secK(g){if(g.K!==undefined)return [g.K,g.K,g.K];if(g.prod!==undefined)return [g.prod,0,0];
 const l=g.lie,h=sum(l)/2,m=l.map(v=>h-v),r=[2*m[1]*m[2],2*m[0]*m[2],2*m[0]*m[1]];
 return [(r[1]+r[2]-r[0])/2,(r[0]+r[2]-r[1])/2,(r[0]+r[1]-r[2])/2]}   // planes ⟂ e1, ⟂ e2, ⟂ e3
const D6_frac=v=>{for(const d of [1,2,4]){const n=Math.round(v*d);if(Math.abs(n/d-v)<1e-9)return D6_minus(d===1?String(n):`${n}/${d}`)}return D6_minus(D6_f(v))};
SCENE({id:'geometrisation-eight',name:'Eight geometries',tag:'Thurston’s geometrisation conjecture, 1982',
 definition:'In 1982 William Thurston conjectured that every closed three-manifold can be cut, along spheres and then along tori, into pieces that each carry one of exactly eight geometries. Three look the same in every direction (spherical, flat, hyperbolic); the other five have a preferred direction or none of the rotations. Thurston proved it for a large class (Haken manifolds), and Perelman’s Ricci flow proved it in full. The Poincaré conjecture is one special case.',
 example:'A geometry can be described by how curved it is in different flat directions at a point. In the round 3-sphere every plane has curvature 1; in S² × ℝ the plane along the sphere has curvature 1 and planes containing the ℝ direction have 0; in Sol the curvatures are 1, −1 and −1. These numbers are computed from Milnor’s formula for the group-like geometries, with one standard choice of scale. Most three-manifolds turn out to be hyperbolic.',
 desc:'A list of the eight Thurston geometries; for the chosen one, three perpendicular planes through a point labelled with their computed curvatures, whether the geometry looks the same in every direction, and an example of a closed manifold with that geometry.',
 research:['Thurston (1982). Three dimensional manifolds, Kleinian groups and hyperbolic geometry. Bulletin of the AMS 6, 357–381.','Scott (1983). The geometries of 3-manifolds. Bulletin of the London Mathematical Society 15, 401–487.','Milnor (1976). Curvatures of left invariant metrics on Lie groups. Advances in Mathematics 21, 293–329 (the formula used here).','Cutting along spheres: Kneser (1929), Milnor (1962); along tori: Jaco & Shalen (1979), Johannson (1979).'],
 dur:16,hint:'Choose a geometry from the list or with the slider. Read the curvatures of three perpendicular planes: equal numbers mean the same in every direction.',
 init:()=>({g:7}),
 watch(p){return {g:Math.min(7,Math.floor(p*8))}},
 ui:[{range:'g',label:'Geometry',min:1,max:8,get:s=>s.g+1,act:'g',show:v=>D6_GEOS[v-1].name}],
 on:{g(s,v){s.g=clamp(Math.round(+v)-1,0,7)}},
 draw(s,f,X){
  const g=D6_GEOS[s.g],K=D6_secK(g),iso=Math.abs(K[0]-K[1])<1e-9&&Math.abs(K[1]-K[2])<1e-9;
  let out=heading(`${g.name}: ${iso?'the same in every direction':'directions differ'}`);
  D6_GEOS.forEach((q,i)=>{const y=56+i*38,on=i===s.g,inner=R(20,y,190,32,on?C.pale:'#fff',on?C.blue:C.grid,6)+TF(32,y+21,`${i+1}. ${q.name}`,13,on?C.blue:C.ink,'start');out+=hit(X,'g',i+1,q.name,inner)});
  const col=v=>v>1e-9?C.blue:v<-1e-9?C.purple:C.green,cx=420,cy=170,sc=62;
  const Pv=D6_view(.55,.42,cx,cy,sc),pl=[[[0,-1,-1],[0,1,-1],[0,1,1],[0,-1,1]],[[-1,0,-1],[1,0,-1],[1,0,1],[-1,0,1]],[[-1,-1,0],[1,-1,0],[1,1,0],[-1,1,0]]];
  const order=[0,1,2].sort((a,b)=>sum(pl[a].map(v=>Pv(v)[2]))-sum(pl[b].map(v=>Pv(v)[2])));
  for(const i of order)out+=`<polygon points="${pl[i].map(v=>Pv(v).slice(0,2).map(fmt).join(',')).join(' ')}" fill="${col(K[i])}" fill-opacity=".18" stroke="${col(K[i])}" stroke-width="1.6"/>`;
  const labs=[[0,1.25,1.1],[1.25,0,1.1],[1.2,1.2,0]];labs.forEach((v,i)=>{const q=Pv(v);out+=R(q[0]-34,q[1]-15,68,24,'#fff',col(K[i]),6)+TBF(q[0],q[1]+3,'K = '+D6_frac(K[i]),13,col(K[i]))});
  out+=R(250,290,334,52,'#fff',C.grid,8)+TF(417,308,'an example of a closed manifold with it',13,C.muted)+TBF(417,330,g.ex,13,C.ink);
  out+=TF(417,278,g.prod!==undefined?'x = 0 panel: along the surface; others contain ℝ':g.K!==undefined?'constant curvature −1':'planes across three axes (Milnor’s formula)',13,C.muted);
  return {svg:out,phase:`${g.name}: the three perpendicular planes have curvatures ${K.map(D6_frac).join(', ')}. ${iso?'All equal, so it looks the same in every direction.':'They differ, so some directions are special.'} Example: ${g.ex}.`};
 }});

// Torus bundles: a torus × [0, 1] with its top glued to its bottom by a 2 × 2 whole-number matrix A of determinant 1.
// The geometry follows from A: finite order (|trace| < 2 or A = ±I) → Euclidean, trace ±2 otherwise → Nil, |trace| > 2 → Sol.
const D6_mm=(A,B)=>[[A[0][0]*B[0][0]+A[0][1]*B[1][0],A[0][0]*B[0][1]+A[0][1]*B[1][1]],[A[1][0]*B[0][0]+A[1][1]*B[1][0],A[1][0]*B[0][1]+A[1][1]*B[1][1]]];
const D6_isI=A=>A[0][0]===1&&A[0][1]===0&&A[1][0]===0&&A[1][1]===1;
function D6_bundle(A){const t=A[0][0]+A[1][1],det=A[0][0]*A[1][1]-A[0][1]*A[1][0];let order=0,M=A;for(let k=1;k<=12;k++){if(D6_isI(M)){order=k;break}M=D6_mm(M,A)}
 const geo=order?'Euclidean':Math.abs(t)===2?'Nil':'Sol',lam=Math.abs(t)>2?(Math.abs(t)+Math.sqrt(t*t-4))/2:1;return {t,det,order,geo,lam}}
const D6_BUNDLES={I:[[1,0],[0,1]],quarter:[[0,-1],[1,0]],sixth:[[0,-1],[1,1]],shear:[[1,1],[0,1]],cat:[[2,1],[1,1]]};
SCENE({id:'geometrisation-bundles',name:'Twist a torus and glue',tag:'Torus bundles: Euclidean, Nil or Sol',
 definition:'Take a solid block made of a torus thickened into a layer, and glue its top torus to its bottom torus. The gluing can first twist the torus by any 2 × 2 matrix of whole numbers with determinant 1, since such a matrix maps the square grid onto itself. The result is a closed three-manifold, and the matrix alone decides which of Thurston’s geometries it has, through its trace (the sum of its diagonal entries).',
 example:'With no twist the block closes up into the 3-torus, which is flat. A quarter turn also gives a flat space, because four turns bring the torus back. A shear, (1 1; 0 1), never comes back but never stretches: that is Nil. The matrix (2 1; 1 1) stretches the torus by φ² ≈ 2.618 one way and squeezes it by the same factor the other way, the “cat map” of dynamics: that is Sol.',
 desc:'A grid with the unit square and its image under the chosen matrix, the stretching directions drawn when they exist, and tiles for the matrix, its trace and determinant, how many times it must be applied to return to the start, its stretch factor and the geometry of the glued manifold.',
 research:['Scott (1983). The geometries of 3-manifolds. Bulletin of the London Mathematical Society 15, 401–487: torus bundles over the circle are Euclidean, Nil or Sol.','Arnold & Avez (1968). Ergodic Problems of Classical Mechanics: the cat map (2 1; 1 1).','Trace, determinant, order and eigenvalues computed here from the matrix.'],
 dur:13,hint:'Start from a preset, then compose with a shear T or L and watch the trace. Which matrices come back after a few steps, and which stretch?',
 init:()=>({A:[[2,1],[1,1]]}),
 watch(p){const k=['I','quarter','sixth','shear','cat'][Math.min(4,Math.floor(p*5))];return {A:D6_BUNDLES[k]}},
 ui:[{choose:[['I','No twist'],['quarter','Quarter turn'],['sixth','Sixth turn'],['shear','Shear'],['cat','Cat map']],label:'Preset',get:s=>Object.keys(D6_BUNDLES).find(k=>JSON.stringify(D6_BUNDLES[k])===JSON.stringify(s.A))||'',act:'pre'},{b:'× T (1 1; 0 1)',act:'T'},{b:'× L (1 0; 1 1)',act:'L'},{b:'× inverse T',act:'Ti'}],
 on:{pre(s,v){if(D6_BUNDLES[v])s.A=D6_BUNDLES[v].map(r=>r.slice())},T(s){const B=D6_mm(s.A,[[1,1],[0,1]]);if(B.flat().every(v=>Math.abs(v)<=40))s.A=B},L(s){const B=D6_mm(s.A,[[1,0],[1,1]]);if(B.flat().every(v=>Math.abs(v)<=40))s.A=B},Ti(s){const B=D6_mm(s.A,[[1,-1],[0,1]]);if(B.flat().every(v=>Math.abs(v)<=40))s.A=B}},
 draw(s){
  const A=s.A,b=D6_bundle(A),cx=170,cy=200;
  const cols=[[A[0][0],A[1][0]],[A[0][1],A[1][1]]],ext=Math.max(1,...[[0,0],cols[0],cols[1],[cols[0][0]+cols[1][0],cols[0][1]+cols[1][1]]].map(v=>Math.max(Math.abs(v[0]),Math.abs(v[1])))),S=Math.min(48,130/ext);
  const M=v=>[cx+v[0]*S,cy-v[1]*S];
  let out=heading(`${b.geo}${b.order?`: the twist repeats after ${b.order} ${D6_plural(b.order,'step')}`:b.geo==='Nil'?': a shear that never repeats':': it stretches one way and squeezes the other'}`);
  out+=`<clipPath id="d6bc"><rect x="${cx-150}" y="${cy-150}" width="300" height="300" rx="8"/></clipPath>`;
  let g=R(cx-150,cy-150,300,300,'#fff',C.grid,8);
  for(let i=-8;i<=8;i++){if(Math.abs(i*S)>150)continue;g+=L(cx+i*S,cy-150,cx+i*S,cy+150,C.grid,1)+L(cx-150,cy-i*S,cx+150,cy-i*S,C.grid,1)}
  if(Math.abs(b.t)>2){const ev=[1,-1].map(sg=>{const l=(b.t+sg*Math.sqrt(b.t*b.t-4))/2;return A[0][1]?[A[0][1],l-A[0][0]]:[l-A[1][1],A[1][0]]});   // eigenvectors (A − λI)v = 0
   ev.forEach((v,i)=>{const u=D6_unit(v);g+=L(cx-u[0]*200,cy+u[1]*200,cx+u[0]*200,cy-u[1]*200,i?C.purple:C.coral,1.8,'stroke-dasharray="7 5"')})}
  g+=`<polygon points="${[[0,0],[1,0],[1,1],[0,1]].map(v=>M(v).map(fmt).join(',')).join(' ')}" fill="${C.pale}" stroke="${C.blue}" stroke-width="2"/>`;
  g+=`<polygon points="${[[0,0],cols[0],[cols[0][0]+cols[1][0],cols[0][1]+cols[1][1]],cols[1]].map(v=>M(v).map(fmt).join(',')).join(' ')}" fill="${C.coralp}" fill-opacity=".6" stroke="${C.coral}" stroke-width="2.4"/>`;
  g+=arrow(...M([0,0]),...M(cols[0]),C.coral,2.4)+arrow(...M([0,0]),...M(cols[1]),C.coral,2.4);
  out+=`<g clip-path="url(#d6bc)">${g}</g>`+TF(cx,cy+170,'blue: a square; coral: its image under A',13,C.muted);
  const x0=350;
  out+=R(x0,56,104,60,'#fff',C.grid,8)+TF(x0+52,72,'matrix A',13,C.muted)+TMF(x0+52,92,`${D6_minus(A[0][0])}  ${D6_minus(A[0][1])}`,15,C.ink)+TMF(x0+52,110,`${D6_minus(A[1][0])}  ${D6_minus(A[1][1])}`,15,C.ink);
  out+=D6_tile(x0+112,56,64,'trace',D6_minus(b.t),C.ink,60)+D6_tile(x0+182,56,64,'det',D6_minus(b.det),C.ink,60);
  out+=D6_tile(x0,124,246,'returns to the start after',b.order?`${b.order} ${D6_plural(b.order,'step')}`:'never (checked up to 12)',b.order?C.green:C.ink);
  out+=D6_tile(x0,178,246,'stretch factor',Math.abs(b.t)>2?`${D6_f(b.lam,3)} and 1/${D6_f(b.lam,3)}`:'none',Math.abs(b.t)>2?C.coral:C.ink);
  out+=D6_tile(x0,232,246,'geometry of the glued manifold',b.geo,b.geo==='Sol'?C.purple:b.geo==='Nil'?C.amber:C.green);
  out+=TF(x0+123,302,'Euclidean if A repeats',13,C.muted)+TF(x0+123,320,'Nil if trace = ±2 and A ≠ ±I',13,C.muted)+TF(x0+123,338,'Sol if |trace| > 2',13,C.muted);
  return {svg:out,phase:`A = (${D6_minus(A[0].join(' '))}; ${D6_minus(A[1].join(' '))}) has determinant ${D6_minus(b.det)} and trace ${D6_minus(b.t)}. ${b.order?`Applied ${b.order} ${D6_plural(b.order,'time')} it is the identity, so the glued space is flat.`:Math.abs(b.t)===2?'It shears without stretching and never returns: the glued space has Nil geometry.':`It stretches by ${D6_f(b.lam,3)} and squeezes by the same factor: the glued space has Sol geometry.`}`};
 }});

// Ideal hyperbolic tetrahedra. Seen from above in the upper half-space model with one corner at infinity, the tetrahedron is a
// triangle whose angles α, β, γ are its dihedral angles; its volume is Λ(α) + Λ(β) + Λ(γ), with Lobachevsky's function
// Λ(θ) = −∫₀^θ ln|2 sin t| dt (Milnor), computed by Simpson's rule after removing the logarithm's singularity.
function D6_lob(th){if(th<=0||th>=Math.PI)return 0;if(th>Math.PI/2)return -D6_lob(Math.PI-th);
 const n=200,h=th/n,g=t=>t<1e-12?0:Math.log(Math.sin(t)/t);let s=g(0)+g(th);for(let i=1;i<n;i++)s+=(i%2?4:2)*g(i*h);
 return -(th*Math.log(2)+th*Math.log(th)-th+s*h/3)}
const D6_tetVol=(a,b)=>D6_lob(D6_rad(a))+D6_lob(D6_rad(b))+D6_lob(D6_rad(180-a-b));
SCENE({id:'geometrisation-hyperbolic',name:'Most pieces are hyperbolic',tag:'Riley 1975; Thurston’s volumes',
 definition:'Thurston showed that hyperbolic geometry is the common case: for instance, the space round most knots is hyperbolic. In 1975 Robert Riley found a hyperbolic structure on the space round the figure-eight knot, and Thurston saw that it is two ideal tetrahedra glued together: tetrahedra of hyperbolic space with their corners at infinity. Their volume is finite, and by Mostow’s rigidity theorem it is fixed by the topology, so volume tells three-manifolds apart.',
 example:'Look down on an ideal tetrahedron with one corner straight above at infinity: you see a triangle whose angles are its dihedral angles, and its bottom face is the dome over the triangle’s circumcircle. Its volume is Λ(α) + Λ(β) + Λ(γ), with Lobachevsky’s function Λ. The volume is largest when all three angles are 60°, and two of those largest tetrahedra make the figure-eight knot’s complement.',
 desc:'A triangle with chosen angles inscribed in its circumcircle, seen as an ideal hyperbolic tetrahedron from above, with a bar comparing its computed volume with the largest possible, and tiles for the angles, the volume, and the volume of the figure-eight knot complement.',
 research:['Riley (1975). A quadratic parabolic group. Mathematical Proceedings of the Cambridge Philosophical Society 77, 281–288.','Thurston (1979). The Geometry and Topology of Three-Manifolds, Princeton lecture notes; volume formula in Milnor (1982), Hyperbolic geometry: the first 150 years, Bulletin of the AMS 6, 9–24.','Mostow (1968). Quasi-conformal mappings in n-space and the rigidity of hyperbolic space forms. Publications mathématiques de l’IHÉS 34, 53–104; Prasad (1973) for spaces with cusps.'],
 dur:12,hint:'Set two angles; the third makes 180°. Find the angles that give the largest volume.',
 init:()=>({a:40,b:80}),
 watch(p){const a=Math.round((20+40*smooth(Math.min(1,p*1.6)))/5)*5;return {a,b:a}},
 ui:[{range:'a',label:'Angle α',min:10,max:150,step:5,get:s=>s.a,act:'a',show:v=>v+'°'},{range:'b',label:'Angle β',min:10,max:150,step:5,get:s=>s.b,act:'b',show:v=>v+'°'}],
 on:{a(s,v){s.a=clamp(Math.round(+v/5)*5,10,150);if(s.a+s.b>170)s.b=170-s.a},b(s,v){s.b=clamp(Math.round(+v/5)*5,10,150);if(s.a+s.b>170)s.a=170-s.b}},
 draw(s){
  const al=s.a,be=s.b,ga=180-al-be,vol=D6_tetVol(al,be),vmax=3*D6_lob(Math.PI/3),cx=176,cy=206,r=118;
  const tA=D6_rad(210),tB=tA+D6_rad(2*ga),tC=tB+D6_rad(2*al),Pt=t=>[cx+r*Math.cos(t),cy-r*Math.sin(t)],A=Pt(tA),B=Pt(tB),Cc=Pt(tC);
  let out=heading(Math.abs(vol-vmax)<1e-9?'The regular ideal tetrahedron: largest volume':'An ideal tetrahedron seen from above');
  out+=Ci(cx,cy,r,C.purplep,C.purple,'fill-opacity=".5"');
  out+=`<polygon points="${[A,B,Cc].map(p=>p.map(fmt).join(',')).join(' ')}" fill="#fff" fill-opacity=".7" stroke="${C.ink}" stroke-width="2.4"/>`;
  const lab=(p,q1,q2,v)=>{const m=[(q1[0]+q2[0])/2,(q1[1]+q2[1])/2],u=D6_unit([m[0]-p[0],m[1]-p[1]]);return TBF(p[0]+u[0]*30,p[1]+u[1]*30+5,v+'°',13,C.coral)};
  out+=lab(A,B,Cc,al)+lab(B,Cc,A,be)+lab(Cc,A,B,ga)+[A,B,Cc].map(p=>Ci(p[0],p[1],5,C.ink)).join('');
  out+=TF(cx,cy+r+28,'purple: the dome over the circumcircle',13,C.muted);
  const x0=354;
  out+=D6_tile(x0,56,72,'α',al+'°',C.coral)+D6_tile(x0+78,56,72,'β',be+'°',C.coral)+D6_tile(x0+156,56,72,'γ',ga+'°',C.coral);
  out+=D6_tile(x0,112,228,'volume Λ(α) + Λ(β) + Λ(γ)',D6_f(vol,4),C.purple);
  out+=R(x0,176,228,22,'#fff',C.grid,4)+R(x0,176,228*vol/vmax,22,C.purple,'none',4)+TF(x0+114,214,`${D6_f(100*vol/vmax,1)}% of the largest, ${D6_f(vmax,4)}`,13,C.muted);
  out+=D6_tile(x0,232,228,'figure-eight knot complement',`2 × ${D6_f(vmax,4)} = ${D6_f(2*vmax,4)}`,C.ink);
  out+=TF(x0+114,302,'Λ computed by numerical integration;',13,C.muted)+TF(x0+114,320,'volumes in units of curvature −1',13,C.muted);
  return {svg:out,phase:`Angles ${al}°, ${be}° and ${ga}°: volume ${D6_f(vol,4)}, which is ${D6_f(100*vol/vmax,1)}% of the largest possible, ${D6_f(vmax,4)}, reached when all three are 60°. Two regular ones glued make the space round the figure-eight knot, of volume ${D6_f(2*vmax,4)}.`};
 }});

/* ===================== Lesson: knots-4d ===================== */
// Knot diagrams are computed from closed curves in space: project to the (x, y) plane, find where the projected segments
// cross, and keep the strand with the larger z (third coordinate) as the over-strand. From the crossings: arcs, the
// Alexander matrix (Fox calculus of the Wirtinger relations), its polynomial Δ(t), the determinant |Δ(−1)| and 3-colourings.
const D6_KNOT_N=360;
const D6_KNOTS={trefoil:{name:'Trefoil',f:t=>[Math.sin(t)+2*Math.sin(2*t),Math.cos(t)-2*Math.cos(2*t),-Math.sin(3*t)]},
 fig8:{name:'Figure-eight',f:t=>[(2+Math.cos(2*t))*Math.cos(3*t),(2+Math.cos(2*t))*Math.sin(3*t),Math.sin(4*t)]}};
const D6_knotPts=(key,N=D6_KNOT_N)=>D6_memo('kp'+key+N,()=>range(N).map(i=>D6_KNOTS[key].f(i/N*2*Math.PI)));
// Crossings of a closed polyline (points [x, y, z, …]); flips: set of crossing indices whose over/under is swapped.
function D6_crossings(P){const N=P.length,out=[];
 for(let i=0;i<N;i++){const a=P[i],b=P[(i+1)%N];for(let j=i+2;j<N;j++){if(i===0&&j===N-1)continue;const c=P[j],d=P[(j+1)%N];
  const r=[b[0]-a[0],b[1]-a[1]],q=[d[0]-c[0],d[1]-c[1]],den=r[0]*q[1]-r[1]*q[0];if(Math.abs(den)<1e-12)continue;
  const u=((c[0]-a[0])*q[1]-(c[1]-a[1])*q[0])/den,v=((c[0]-a[0])*r[1]-(c[1]-a[1])*r[0])/den;if(u<0||u>=1||v<0||v>=1)continue;
  const zi=a[2]+u*(b[2]-a[2]),zj=c[2]+v*(d[2]-c[2]),ti=i+u,tj=j+v,iOver=zi>zj;
  out.push({ti,tj,pt:[a[0]+u*r[0],a[1]+u*r[1]],over:iOver?ti:tj,under:iOver?tj:ti,dO:iOver?r:q,dU:iOver?q:r,gap:Math.abs(zi-zj)})}}
 return out.sort((x,y)=>Math.min(x.ti,x.tj)-Math.min(y.ti,y.tj))}
function D6_diagram(P,flips){const N=P.length,cr=D6_crossings(P).map((c,k)=>flips&&flips.has(k)?{...c,over:c.under,under:c.over,dO:c.dU,dU:c.dO}:c);
 const n=cr.length;if(!n)return {cr,n,arcs:0,M:[],C3:[]};
 const unders=cr.map(c=>c.under).sort((a,b)=>a-b),arcOf=t=>{t=((t%N)+N)%N;let k=-1;for(let i=0;i<n;i++)if(unders[i]<=t)k=i;return k<0?n-1:k};
 const M=[],C3=[];
 cr.forEach(c=>{const ko=arcOf(c.over),ki=arcOf(c.under-1e-6),kj=arcOf(c.under+1e-6),sg=Math.sign(c.dU[0]*c.dO[1]-c.dU[1]*c.dO[0])||1;
  c.sign=sg;c.arcs=[ko,ki,kj];
  const row=range(n).map(()=>[0,0]);   // polynomial a + b·t per arc
  const add=(k,a,b)=>{row[k][0]+=a;row[k][1]+=b};
  if(sg>0){add(ko,1,-1);add(ki,0,1);add(kj,-1,0)}else{add(ko,-1,1);add(ki,1,0);add(kj,0,-1)}
  M.push(row);const r3=new Array(n).fill(0);r3[ko]+=2;r3[ki]-=1;r3[kj]-=1;C3.push(r3)});
 return {cr,n,M,C3,arcOf}}
// Exact integer determinant (Bareiss) with BigInt.
function D6_detBig(A){const n=A.length;if(!n)return 1n;const M=A.map(r=>r.map(v=>BigInt(v)));let prev=1n,sgn=1n;
 for(let k=0;k<n-1;k++){if(M[k][k]===0n){let p=k+1;while(p<n&&M[p][k]===0n)p++;if(p===n)return 0n;[M[k],M[p]]=[M[p],M[k]];sgn=-sgn}
  for(let i=k+1;i<n;i++)for(let j=k+1;j<n;j++)M[i][j]=(M[i][j]*M[k][k]-M[i][k]*M[k][j])/prev;prev=M[k][k]}
 return sgn*M[n-1][n-1]}
// Alexander polynomial: delete one row and column of the Alexander matrix, evaluate its determinant at t = 2, 3, …
// exactly, and interpolate (Newton's divided differences in BigInt rationals). Normalised: lowest power t⁰, leading term positive.
function D6_alexander(d){const n=d.n;if(n<=1)return [1];const m=n-1,pts=[];
 for(let x=2;x<=m+2;x++)pts.push([BigInt(x),D6_detBig(range(m).map(i=>range(m).map(j=>d.M[i][j][0]+d.M[i][j][1]*x)))]);
 // Lagrange interpolation to coefficients (degree ≤ m) with rationals num/den
 const deg=pts.length-1,coef=new Array(deg+1).fill(0n);let den=1n;
 const fr=[];for(let i=0;i<=deg;i++){let num=[1n],dd=1n;for(let j=0;j<=deg;j++){if(j===i)continue;const nn=new Array(num.length+1).fill(0n);for(let k=0;k<num.length;k++){nn[k+1]+=num[k];nn[k]-=num[k]*pts[j][0]}num=nn;dd*=pts[i][0]-pts[j][0]}fr.push([num.map(c=>c*pts[i][1]),dd])}
 for(const [,dd] of fr)den=den*(dd<0n?-dd:dd)/D6_gcdB(den,dd<0n?-dd:dd);
 for(const [num,dd] of fr){const f=den/dd;num.forEach((c,k)=>coef[k]+=c*f)}
 let c=coef.map(v=>{if(v%den!==0n)throw new Error('Alexander interpolation not integral');return Number(v/den)});
 while(c.length>1&&c[c.length-1]===0)c.pop();while(c.length>1&&c[0]===0)c.shift();if(c[c.length-1]<0)c=c.map(v=>-v);
 return c}
function D6_gcdB(a,b){a=a<0n?-a:a;b=b<0n?-b:b;while(b){[a,b]=[b,a%b]}return a||1n}
const D6_polyText=c=>{if(c.length===1)return D6_minus(c[0]);const terms=[];for(let k=c.length-1;k>=0;k--){const v=c[k];if(!v)continue;const a=Math.abs(v),pw=k===0?'':k===1?'t':'t'+'⁰¹²³⁴⁵⁶⁷⁸⁹'[k],body=(a===1&&k)?pw:a+pw;terms.push((terms.length?(v<0?' − ':' + '):(v<0?'−':''))+body)}return terms.join('')};
const D6_evalPoly=(c,x)=>c.reduce((s,v,k)=>s+v*x**k,0);
function D6_rankMod(A,p){const M=A.map(r=>r.map(v=>((v%p)+p)%p));let rk=0;const m=M.length,n=m?M[0].length:0;
 for(let c=0;c<n&&rk<m;c++){let piv=-1;for(let i=rk;i<m;i++)if(M[i][c]){piv=i;break}if(piv<0)continue;[M[rk],M[piv]]=[M[piv],M[rk]];
  const inv=range(p).find(x=>(x*M[rk][c])%p===1);for(let j=0;j<n;j++)M[rk][j]=(M[rk][j]*inv)%p;
  for(let i=0;i<m;i++)if(i!==rk&&M[i][c]){const f=M[i][c];for(let j=0;j<n;j++)M[i][j]=((M[i][j]-f*M[rk][j])%p+p)%p}rk++}
 return rk}
function D6_knotInfo(P,flips){const d=D6_diagram(P,flips),alex=d.n?D6_alexander(d):[1],det=Math.abs(D6_evalPoly(alex,-1)),col3=d.n?3**(d.n-D6_rankMod(d.C3,3)):3;
 const trivial=alex.length===1;return {d,alex,det,col3,trivial,text:D6_polyText(alex)}}
// Draw a diagram: the curve with gaps where it passes under. colour(i) may colour segment i.
function D6_drawKnot(P,d,M,o={}){const N=P.length,cum=[0];for(let i=0;i<N;i++)cum.push(cum[i]+Math.hypot(P[(i+1)%N][0]-P[i][0],P[(i+1)%N][1]-P[i][1]));
 const Lt=cum[N],gap=o.gap||.22,at=t=>{const i=Math.floor(t);return cum[i]+(t-i)*(cum[i+1]-cum[i])},us=d.cr.map(c=>at(c.under)).concat((o.under||[]).map(at));
 const hidden=i=>{const s=(cum[i]+cum[i+1])/2;return us.some(u=>{const dd=Math.abs(s-u);return Math.min(dd,Lt-dd)<gap})};
 let out='',seg=[],col=null;
 for(let i=0;i<=N;i++){const k=i%N,h=i<N&&hidden(k),c=o.colour?o.colour(k):C.blue;
  if(i<N&&!h&&(col===null||c===col)){if(!seg.length)seg.push(M(P[k]));seg.push(M(P[(k+1)%N]));col=c}
  else{out+=D6_poly(seg,col||C.blue,o.w||3.2);seg=[];col=null;if(i<N&&!h){seg.push(M(P[k]),M(P[(k+1)%N]));col=c}}}
 return out+D6_poly(seg,col||C.blue,o.w||3.2)}
const D6_TABLE_NOTE='Knot tables: up to 4 crossings, only the unknot, trefoil, figure-eight.';
SCENE({id:'knots-4d',name:'Changing crossings to untie a knot',tag:'Kelvin 1867, Tait’s tables; Alexander 1928',
 definition:'In 1867 William Thomson (later Lord Kelvin) proposed that atoms are knotted vortices in the ether. Peter Guthrie Tait then set about listing knots by their number of crossings, which began knot tables. The atom theory failed; the tables lasted. A knot is a closed loop in space; two knots are the same if one can be moved into the other without cutting. To prove a knot is really knotted one needs an invariant, a number or polynomial that no move can change, such as James Alexander’s polynomial (1928).',
 example:'Each crossing below can be changed by pressing it, which in our space means cutting the strand and rejoining it on the other side. Changing any one crossing of the trefoil unties it: Δ(t) becomes 1. The figure-eight needs one change too. Vaughan Jones’s polynomial (1984) tells more knots apart. Whether a drawing is the unknot can be decided by computer (Haken, 1961), but no fast (polynomial-time) method is known.',
 desc:'A knot diagram drawn from a curve in space with gaps where one strand passes under another; each crossing is numbered and can be changed, and tiles give the number of crossings, the Alexander polynomial, the determinant and the number of 3-colourings, with a verdict.',
 research:['Thomson (1867). On vortex atoms. Proceedings of the Royal Society of Edinburgh 6, 94–105; Tait (1877–85). On knots, I–III. Transactions of the Royal Society of Edinburgh.','Alexander (1928). Topological invariants of knots and links. Transactions of the AMS 30, 275–306; Jones (1985). A polynomial invariant for knots via von Neumann algebras. Bulletin of the AMS 12, 103–111.','Haken (1961). Theorie der Normalflächen. Acta Mathematica 105, 245–375. 3-colourings: Crowell & Fox (1963), Introduction to Knot Theory.'],
 dur:12,hint:'Choose a knot and press a numbered crossing to change it. Is the result knotted? The invariants are computed from the drawing each time.',
 init:()=>({k:'trefoil',fl:[]}),
 watch(p){return p<.5?{k:'trefoil',fl:p<.25?[]:[0]}:{k:'fig8',fl:p<.75?[]:[1]}},
 ui:[{choose:Object.keys(D6_KNOTS).map(k=>[k,D6_KNOTS[k].name]),label:'Knot',get:s=>s.k,act:'k'},{b:'Change every crossing',act:'all'}],
 on:{k(s,v){if(D6_KNOTS[v]){s.k=v;s.fl=[]}},c(s,v){const i=Math.round(+v);const j=s.fl.indexOf(i);if(j>=0)s.fl.splice(j,1);else s.fl.push(i)},all(s){const n=D6_crossings(D6_knotPts(s.k)).length;s.fl=range(n).filter(i=>!s.fl.includes(i))}},
 draw(s,f,X){
  const P=D6_knotPts(s.k),info=D6_knotInfo(P,new Set(s.fl)),d=info.d,cx=178,cy=204,M=D6_fit(P,cx,cy,270,260);
  let out=heading(info.trivial?'Untied: Δ(t) = 1':`Knotted: Δ(t) = ${info.text}`);
  out+=R(cx-160,cy-150,320,300,'#fff',C.grid,8)+D6_drawKnot(P,d,M);
  d.cr.forEach((c,i)=>{const q=M(c.pt),fl=s.fl.includes(i),inner=Ci(q[0],q[1],12,fl?C.coralp:'#fff',fl?C.coral:C.line,'fill-opacity=".85"')+TBF(q[0],q[1]+4.5,i+1,12,fl?C.coral:C.muted);out+=hit(X,'c',i,`Crossing ${i+1}${fl?', changed':''}. Press to change it.`,inner)});
  const x0=362;
  out+=D6_tile(x0,56,108,'crossings',d.n,C.ink)+D6_tile(x0+114,56,108,'changed',s.fl.length,C.coral);
  out+=D6_tile(x0,110,222,'Alexander polynomial Δ(t)',info.text,info.trivial?C.green:C.coral);
  out+=D6_tile(x0,164,108,'determinant',info.det,info.det===1?C.green:C.coral)+D6_tile(x0+114,164,108,'3-colourings',info.col3,info.col3===3?C.green:C.coral);
  out+=D6_tile(x0,218,222,'verdict',info.trivial?'the unknot':'knotted (proved)',info.trivial?C.green:C.coral);
  out+=TF(x0+111,290,'Δ ≠ 1 proves a knot is knotted.',13,C.muted)+TF(x0+111,308,'Some 11-crossing knots have Δ = 1,',13,C.muted)+TF(x0+111,326,'so for Δ = 1 the tables decide.',13,C.muted);
  out+=D6_note(D6_TABLE_NOTE,368);
  return {svg:out,phase:info.trivial?`With ${s.fl.length} ${D6_plural(s.fl.length,'crossing')} changed, Δ(t) = 1, the determinant is 1 and there are only the 3 one-colour colourings. A diagram this small with Δ = 1 is the unknot.`:`This diagram has ${d.n} crossings, Δ(t) = ${info.text}, determinant ${info.det} and ${info.col3} 3-colourings. Δ ≠ 1, so no moves can untie it without cutting. Press a crossing to change it.`};
 }});

// Untying in four dimensions. The over-strand at crossing 1 is lifted in w (the fourth coordinate), pushed down in z past the
// under-strand, and lowered again. b(t) is a plateau bump round that strand; stage s ∈ [0, 1].
const D6_LIFT_H=1.2;
function D6_liftSetup(){return D6_memo('lift',()=>{const P=D6_knotPts('trefoil'),N=P.length,cr=D6_crossings(P),c=cr[0],io=Math.round(c.over),iu=Math.round(c.under);
 const zO=P[io][2],zU=P[iu][2],D=zO-zU+1.1,wp=8,wt=26;
 const b=range(N).map(i=>{let d=Math.abs(i-c.over);d=Math.min(d,N-d);return d<=wp?1:d>=wt?0:smooth(1-(d-wp)/(wt-wp))});
 return {P,N,c,io,iu,D,b}})}
const D6_phase=s=>({lift:smooth(clamp(s/.3,0,1)),push:smooth(clamp((s-.3)/.4,0,1)),low:smooth(clamp((s-.7)/.3,0,1))});
function D6_liftPts(s,mode){const S=D6_liftSetup(),ph=D6_phase(s),h=mode==='lift'?D6_LIFT_H*(ph.lift-ph.low):0;
 return S.P.map((p,i)=>[p[0],p[1],p[2]-S.D*S.b[i]*ph.push,h*S.b[i]])}
// Nearest approach between the moving strand (b > 0) and the rest of the knot, in 3D (x, y, z) and in 4D (x, y, z, w).
function D6_approach(Q){const S=D6_liftSetup(),N=S.N,mv=range(N).filter(i=>S.b[i]>0),far=range(N).filter(i=>{let d=Math.abs(i-S.c.over);d=Math.min(d,N-d);return d>40});
 let d3=Infinity,d4=Infinity;for(const i of mv)for(const j of far){const a=Q[i],b=Q[j],e3=Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]),e4=Math.hypot(e3,a[3]-b[3]);if(e3<d3)d3=e3;if(e4<d4)d4=e4}
 return {d3,d4}}
const D6_liftWorst=mode=>D6_memo('lw'+mode,()=>{let d3=Infinity,d4=Infinity;for(let k=0;k<=60;k++){const a=D6_approach(D6_liftPts(k/60,mode));d3=Math.min(d3,a.d3);d4=Math.min(d4,a.d4)}return {d3,d4}});
SCENE({id:'knots-4d-lift',name:'Untie it through the fourth dimension',tag:'Every knotted circle comes undone in 4D',
 definition:'In our space one strand of a knot cannot pass through another. With a fourth direction, w, it can go round instead. Lift a short piece of the top strand at a crossing a little way into w, slide it down past the lower strand, which stays at w = 0, and put it back at w = 0. Nothing touched, yet the crossing has changed. Since changing crossings unties any knot, every knotted circle comes undone in four dimensions.',
 example:'The small panel shows the crossing from the side, with z across and w up. In 3D only the across direction exists, so moving the top strand below the bottom one means passing through it: the gap in z changes sign, so at some moment the two strands are at the same point. In 4D the strand travels up, across and down, and the nearest approach between the strands stays above zero, as computed for every stage.',
 desc:'A trefoil diagram whose top strand at one crossing is lifted in a fourth direction w (drawn in coral, with its value given), moved below the other strand and lowered; a side view of the crossing in the z–w plane; and tiles for the stage, the z gap, the w gap and the nearest approach between the strands in 3D and 4D.',
 research:['A crossing change by a move through the fourth dimension: for example Rolfsen (1976), Knots and Links, Publish or Perish; or Adams (1994), The Knot Book, W. H. Freeman.','Nearest approaches computed here over 61 stages of the move between the moving strand and the rest of the knot.'],
 dur:14,hint:'Move the stage slider slowly. Switch to “3D only” and see the strands collide. In 3D view, the coral strand is the one lifted into w.',
 init:()=>({s:0,mode:'lift'}),
 watch(p){return {s:Math.round(clamp(p*1.25,0,1)*100)/100,mode:'lift'}},
 ui:[{range:'s',label:'Stage',min:0,max:100,step:2,get:s=>Math.round(s.s*100),act:'s',show:v=>v+'%'},{choose:[['lift','Use w'],['flat','3D only']],label:'Move',get:s=>s.mode,act:'mode'}],
 on:{s(s,v){s.s=clamp(Math.round(+v)/100,0,1)},mode(s,v){s.mode=v==='flat'?'flat':'lift'}},
 draw(s){
  const S=D6_liftSetup(),Q=D6_liftPts(s.s,s.mode),info=D6_knotInfo(Q),ap=D6_approach(Q),worst=D6_liftWorst(s.mode),ph=D6_phase(s.s);
  const cx=168,cy=204,M=D6_fit(S.P,cx,cy,260,260),zg=Q[S.io][2]-Q[S.iu][2],wg=Q[S.io][3]-Q[S.iu][3];
  const hit3=s.mode==='flat'&&ph.push>0&&ph.push<1&&Math.abs(zg)<.12;
  let out=heading(s.mode==='flat'&&ph.push>0&&ph.push<1?'In 3D the strands must pass through each other':info.trivial?'The crossing has changed: untied':ph.lift>0?`Lifted to w = ${D6_f(wg)}`:'A trefoil, all at w = 0');
  out+=R(cx-150,cy-150,300,300,'#fff',C.grid,8)+D6_drawKnot(Q,info.d,M,{colour:i=>Q[i][3]>.02?C.coral:C.blue});
  const cp=M(S.c.pt);out+=Ci(cp[0],cp[1],15,'none',C.amber,'stroke-dasharray="3 3"');
  if(wg>.02)out+=TBF(cp[0]+18,cp[1]-18,`w = ${D6_f(wg)}`,13,C.coral,'start');
  // side view of the crossing: z across, w up
  const bx=340,by=56,bw=244,bh=128,zx=z=>bx+bw/2+z*42,wy=w=>by+bh-18-w*72;
  out+=R(bx,by,bw,bh,'#fff',C.grid,8)+TF(bx+8,by+16,'the crossing seen from the side',13,C.muted,'start')+L(bx+12,wy(0),bx+bw-12,wy(0),C.line,1.2)+TF(bx+bw-12,wy(0)+16,'z →',13,C.muted,'end')+TF(bx+14,by+34,'w ↑',13,C.muted,'start');
  const path=range(31).map(k=>{const q=D6_liftPts(k/30*Math.max(s.s,1e-9),s.mode);return [zx(q[S.io][2]-Q[S.iu][2]),wy(q[S.io][3])]});
  out+=D6_poly(path,C.coral,1.6,'stroke-dasharray="4 3"')+Ci(zx(0),wy(0),7,C.blue,'#fff')+Ci(zx(zg),wy(Q[S.io][3]),7,hit3?C.amber:C.coral,'#fff');
  out+=TF(zx(0)-12,wy(0)+15,'lower strand',13,C.blue,'end');
  const x0=340;
  out+=D6_tile(x0,194,118,'z gap',D6_minus(D6_f(zg)),zg>0?C.ink:C.coral)+D6_tile(x0+126,194,118,'w gap',D6_f(wg),wg>0?C.coral:C.ink);
  out+=D6_tile(x0,248,244,`nearest approach now (${s.mode==='lift'?'4D':'3D'})`,D6_f(s.mode==='lift'?ap.d4:ap.d3,3),C.blue);
  out+=D6_tile(x0,302,244,'smallest over the whole move',s.mode==='lift'?`${D6_f(worst.d4,3)} in 4D: never touch`:`${D6_f(worst.d3,3)}: z gap changes sign`,s.mode==='lift'?C.green:C.coral);
  return {svg:out,phase:s.mode==='flat'?(ph.push<=0?'Without w, the top strand can only go straight down in z.':ph.push>=1?`The crossing has been forced through: the z gap went from positive to ${D6_minus(D6_f(zg))}, so at some moment the strands shared a point. That is cutting, not a move.`:`The z gap is ${D6_minus(D6_f(zg))} and shrinking towards zero: in 3D the strands are about to meet.`):
   info.trivial?`Done. Every point is back at w = 0, the crossing is changed, and Δ(t) = 1: the trefoil is untied. The strands never came closer than ${D6_f(worst.d4,3)} in 4D.`:`Stage ${Math.round(s.s*100)}%: the strand is at w = ${D6_f(wg)} and its z gap is ${D6_minus(D6_f(zg))}. In 4D the nearest approach is ${D6_f(ap.d4,3)}, so nothing touches.`};
 },
 three(s,f,X,project){
  const Q=D6_liftPts(s.s,s.mode),Pr=project(Q.map(q=>q.slice(0,3))),N=Q.length,items=[];
  for(let i=0;i<N;i+=9){const seg=range(10).map(k=>Q[(i+k)%N]),m=seg[5].slice(0,3),lift=seg[5][3]>.02;
   items.push({at:m,svg:P=>{const pts=seg.map(q=>P(q.slice(0,3)));return D6_poly(pts.slice(2,-2),'#fff',9)+D6_poly(pts,lift?C.coral:C.blue,4.2)}})}
  const wg=Math.max(...Q.map(q=>q[3]));
  return {svg:sortedItems(items,Pr),title:'The knot in x, y and z',caption:`The knot’s x, y and z, computed by this scene; the fourth coordinate w cannot be drawn, so the lifted strand is coloured coral and its height is given: now w = ${D6_f(wg)}. The 3D view only turns the camera. In this view the coral strand seems to pass through the blue one; in 4D it is at a different w.`};
 }});

// Knotted 2-spheres in 4D (Artin 1925): spin a knotted arc in the half-space u ≥ 0 about the plane u = 0.
// The point (u, y, z) of the arc sweeps (u cos θ, y, z, u sin θ). The slice w = c holds, for each arc point with u ≥ c,
// the two points v = ±√(u² − c²): each stretch of the arc with u ≥ c becomes one closed loop.
const D6_spinArc=D6_memo('spinarc',()=>{const N=300,P=range(N).map(i=>D6_KNOTS.trefoil.f(i/N*2*Math.PI));let i0=0;P.forEach((p,i)=>{if(p[0]<P[i0][0])i0=i});
 const xm=P[i0][0],arc=[];for(let k=7;k<=N-7;k++){const p=P[(i0+k)%N];arc.push([p[0]-xm+.4,p[1],p[2]])}
 const drop=(p,first)=>range(9).map(j=>[p[0]*(first?j/8:1-j/8),p[1],p[2]]);
 return [...drop(arc[0],true).slice(0,-1),...arc,...drop(arc[arc.length-1],false).slice(1)]});
function D6_spinSlice(c){const A=D6_spinArc,loops=[];let run=null;
 const cut=(p,q)=>{const t=(c-p[0])/(q[0]-p[0]);return [c,p[1]+t*(q[1]-p[1]),p[2]+t*(q[2]-p[2])]};
 for(let i=0;i<A.length;i++){const p=A[i],inside=p[0]>=c-1e-12;
  if(inside){if(!run){run=[];if(i>0)run.push(cut(A[i-1],p))}run.push(p)}
  if((!inside||i===A.length-1)&&run){if(!inside)run.push(cut(A[i-1],p));loops.push(run);run=null}}
 return loops.filter(r=>r.length>2).map(r=>{const v=q=>Math.sqrt(Math.max(0,q[0]*q[0]-c*c));const fw=r.map(q=>[v(q),q[1],q[2]]),bk=r.slice().reverse().map(q=>[-v(q),q[1],q[2]]);
  return fw.concat(bk.slice(1,-1))})}
// Crossings between two different closed curves in projection: where each passes under, and the linking number
// (half the sum of the crossing signs).
function D6_interCross(A,B){const na=A.length,nb=B.length,ua=[],ub=[];let sg=0;
 for(let i=0;i<na;i++){const a=A[i],b=A[(i+1)%na];for(let j=0;j<nb;j++){const c=B[j],d=B[(j+1)%nb],r=[b[0]-a[0],b[1]-a[1]],q=[d[0]-c[0],d[1]-c[1]],den=r[0]*q[1]-r[1]*q[0];if(Math.abs(den)<1e-12)continue;
  const u=((c[0]-a[0])*q[1]-(c[1]-a[1])*q[0])/den,v=((c[0]-a[0])*r[1]-(c[1]-a[1])*r[0])/den;if(u<0||u>=1||v<0||v>=1)continue;
  const za=a[2]+u*(b[2]-a[2]),zb=c[2]+v*(d[2]-c[2]);if(za>zb){ub.push(j+v);sg+=Math.sign(q[0]*r[1]-q[1]*r[0])}else{ua.push(i+u);sg+=Math.sign(r[0]*q[1]-r[1]*q[0])}}}
 return {ua,ub,n:ua.length+ub.length,lk:sg/2}}
SCENE({id:'knots-4d-spheres',name:'Spheres that knot in four dimensions',tag:'Emil Artin, 1925',
 definition:'Circles cannot knot in four dimensions, but surfaces can. In 1925 Emil Artin spun a knotted arc: put the arc in a half-space whose edge is a plane, and turn the half-space round that plane through the fourth dimension, as a half-plane turns round a line to sweep out space. The arc sweeps out a 2-sphere in 4D, and Artin showed that the loops round it behave as the loops round the original knot, so this sphere cannot be untied.',
 example:'Slice the spun sphere at a height w = c, as era 3 sliced the tesseract. Each stretch of the arc that reaches further than c from the plane gives one closed loop in the slice. The middle slice, c = 0, is the knot joined to its mirror image, and its computed Alexander polynomial is the trefoil’s squared: the slice is knotted. The rule of thumb is that a sphere of dimension k can knot in dimension k + 2.',
 desc:'A slice through a spun trefoil at a chosen height, drawn as a knot diagram with each closed loop of the slice in its own colour, and tiles for the height, the number of loops, and each loop’s crossings and Alexander polynomial.',
 research:['Artin (1925). Zur Isotopie zweidimensionaler Flächen im R₄. Abhandlungen aus dem Mathematischen Seminar der Universität Hamburg 4, 174–177.','Fox (1962). A quick trip through knot theory. In Topology of 3-Manifolds, Prentice-Hall: slices of knotted surfaces in 4D.','Slices computed here from the spun arc; each loop’s Alexander polynomial from its own diagram.'],
 dur:13,hint:'Move the slice height from the middle outwards. Watch the knotted middle slice break into simpler loops, and then vanish.',
 init:()=>({c:0}),
 watch(p){return {c:Math.round(clamp(p*1.1,0,1)*60)/10}},
 ui:[{range:'c',label:'Slice height w = c',min:0,max:60,get:s=>Math.round(s.c*10),act:'c',show:v=>D6_f(v/10,1)}],
 on:{c(s,v){s.c=clamp(Math.round(+v),0,60)/10}},
 draw(s){
  const loops=D6_spinSlice(s.c),cols=[C.blue,C.coral,C.green,C.purple,C.amber],cx=184,cy=204,M=D6_fit(D6_spinSlice(0)[0],cx,cy,310,270);
  const infos=loops.map(l=>D6_knotInfo(l));
  let out=heading(!loops.length?'Above the top of the sphere: an empty slice':infos.some(i=>!i.trivial)?`The slice w = ${D6_f(s.c,1)} is knotted`:`The slice w = ${D6_f(s.c,1)}: ${loops.length} unknotted ${D6_plural(loops.length,'loop')}`);
  out+=R(cx-170,cy-150,340,300,'#fff',C.grid,8)+L(cx,cy-146,cx,cy+146,C.grid,1.2,'stroke-dasharray="4 4"');
  const extra=loops.map(()=>[]),links=[];
  for(let i=0;i<loops.length;i++)for(let j=i+1;j<loops.length;j++){const x=D6_interCross(loops[i],loops[j]);extra[i].push(...x.ua);extra[j].push(...x.ub);if(x.n)links.push([i,j,x.lk])}
  loops.forEach((l,i)=>{out+=D6_drawKnot(l,infos[i].d,M,{colour:()=>cols[i%5],w:2.8,gap:.2,under:extra[i]})});
  out+=TF(cx,cy+168,'dashed: the plane the arc was spun round',13,C.muted);
  const x0=372;out+=D6_tile(x0,56,96,'height c',D6_f(s.c,1),C.ink)+D6_tile(x0+104,56,96,'loops',loops.length,C.ink);
  infos.slice(0,4).forEach((inf,i)=>{out+=R(x0,112+i*56,200,48,'#fff',cols[i%5],8)+TF(x0+100,129+i*56,`loop ${i+1}: ${inf.d.n} ${D6_plural(inf.d.n,'crossing')}`,13,C.muted)+TBF(x0+100,150+i*56,inf.trivial?'Δ = 1':'Δ = '+inf.text,13,inf.trivial?C.green:C.coral)});
  if(loops.length>4)out+=TF(x0+100,344,`and ${loops.length-4} more`,13,C.muted);
  else if(links.length)out+=TF(x0+100,112+Math.min(4,loops.length)*56+12,links.map(([i,j,lk])=>`loops ${i+1}, ${j+1}: linking number ${Math.abs(lk)}`).join('; '),13,C.ink);
  return {svg:out,phase:!loops.length?'The arc never reaches this far from the plane, so the slice is empty: the top of the spun sphere has been passed.':`At w = ${D6_f(s.c,1)} the slice has ${loops.length} closed ${D6_plural(loops.length,'loop')}. ${infos.map((inf,i)=>`Loop ${i+1}: Δ = ${inf.text}`).join('; ')}. ${s.c===0?'The middle slice is the trefoil joined to its mirror image: (t² − t + 1)².':''}`};
 }});

/* ===================== Lesson: exotic-spheres ===================== */
// A smooth structure is a choice of which functions count as smooth. On the line, the chart y = x³ declares the function
// x³ smooth (it reads as y) and the function x not smooth (it reads as ∛y). Slopes at 0 are estimated by central differences.
const D6_cbrt=y=>Math.sign(y)*Math.abs(y)**(1/3);
const D6_CHARTS={std:{name:'Standard chart y = x',inv:y=>y},cube:{name:'Cube chart y = x³',inv:D6_cbrt}};
const D6_FUNS={x:{name:'f(x) = x',f:x=>x},x3:{name:'f(x) = x³',f:x=>x*x*x}};
const D6_slopes=(g)=>[.1,.01,.001].map(h=>(g(h)-g(-h))/(2*h));
SCENE({id:'exotic-spheres',name:'What makes a space smooth?',tag:'Smooth structures',
 definition:'To do calculus on a manifold we cover it with charts, maps to ordinary coordinates, and agree that a function is smooth when it is smooth read in every chart. The choice of charts is a smooth structure. Two charts on the same line can disagree: with the chart y = x³, the function f(x) = x reads as ∛y, which has no slope at 0. A smooth structure is extra information on top of the shape.',
 example:'Here the disagreement is harmless: the map x ↦ x³ carries the cube-chart line onto the standard line, and read in the charts it is just y ↦ y, smooth both ways, so the two lines are the same smooth manifold. An exotic sphere is a space that is a sphere to a topologist but where no such map to the standard sphere exists. Analogy only: a crumpled ball can be smoothed out; an exotic sphere cannot.',
 desc:'A graph of the chosen function read through the chosen chart near zero, tiles with its slope at zero estimated with smaller and smaller steps, and a small drawing of a smooth and a crumpled ball labelled as an analogy.',
 research:['Whitney (1936). Differentiable manifolds. Annals of Mathematics 37, 645–680: manifolds defined by smoothly compatible charts.','Milnor (1956). On manifolds homeomorphic to the 7-sphere. Annals of Mathematics 64, 399–405 (next scene).'],
 dur:12,hint:'Choose a chart and a function. If the slope estimates settle down, the function is smooth at 0 in that chart; if they keep growing, it is not.',
 init:()=>({ch:'cube',fn:'x'}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {ch:k<2?'std':'cube',fn:k%2?'x3':'x'}},
 ui:[{choose:Object.keys(D6_CHARTS).map(k=>[k,D6_CHARTS[k].name]),label:'Chart',get:s=>s.ch,act:'ch'},{choose:Object.keys(D6_FUNS).map(k=>[k,D6_FUNS[k].name]),label:'Function',get:s=>s.fn,act:'fn'}],
 on:{ch(s,v){if(D6_CHARTS[v])s.ch=v},fn(s,v){if(D6_FUNS[v])s.fn=v}},
 draw(s){
  const ch=D6_CHARTS[s.ch],fn=D6_FUNS[s.fn],g=y=>fn.f(ch.inv(y)),sl=D6_slopes(g),grow=Math.abs(sl[2])>2*Math.abs(sl[1])+1e-9,smoothOK=!grow;
  let out=heading(`${fn.name} read in the ${s.ch==='std'?'standard':'cube'} chart: ${smoothOK?'smooth':'not smooth at 0'}`);
  const x0=40,y0=60,w=290,h=250,X=y=>x0+(y+1)/2*w,Y=v=>y0+h/2-v*h/2.4;
  out+=R(x0,y0,w,h,'#fff',C.grid,6)+L(x0,Y(0),x0+w,Y(0),C.line,1.2)+L(X(0),y0,X(0),y0+h,C.line,1.2);
  out+=D6_poly(range(201).map(i=>{const y=-1+i/100;return [X(y),Y(g(y))]}),smoothOK?C.green:C.coral,3);
  out+=TF(x0+w-4,Y(0)-8,'chart coordinate y',13,C.muted,'end')+TF(X(0)+6,y0+16,'value',13,C.muted,'start');
  for(const [y,l] of [[-1,'−1'],[1,'1']])out+=TF(X(y)+(y<0?10:-10),Y(0)+16,l,13,C.muted);
  out+=TF(x0+w/2,y0+h+20,`what ${fn.name.slice(0,4)} looks like: ${s.ch==='std'?fn.name.slice(7):s.fn==='x'?'∛y':'y'}`,13,C.ink);
  const tx=356;out+=TF(tx+112,64,'slope at 0, estimated with step h',13,C.muted);
  sl.forEach((v,i)=>{out+=D6_tile(tx+i*76,72,70,['h = 0.1','0.01','0.001'][i],D6_f(v,v>99?0:2),grow?C.coral:C.green)});
  out+=D6_tile(tx,128,224,'verdict',smoothOK?'settles: smooth at 0':'keeps growing: no slope',smoothOK?C.green:C.coral);
  // analogy picture
  const ax=400,ay=246;out+=R(tx,186,224,124,'#fff',C.grid,8)+TF(tx+112,204,'Analogy only',13,C.coral);
  out+=Ci(ax,ay,30,C.pale,C.blue);
  out+=P('M'+range(41).map(i=>{const t=i/40*2*Math.PI,r=30*(1+.13*Math.sin(7*t)+.08*Math.sin(13*t));return fmt(ax+104+r*Math.cos(t))+' '+fmt(ay+r*Math.sin(t))}).join(' L')+'Z',C.purple,2,C.purplep);
  out+=TF(ax,ay+48,'smooth',13,C.muted)+TF(ax+104,ay+48,'crumpled',13,C.muted);
  out+=D6_note('The analogy’s limit: a crumpled ball smooths out; an exotic sphere never does.',370);
  return {svg:out,phase:`Read in the ${s.ch==='std'?'standard':'cube'} chart, ${fn.name} becomes ${s.ch==='std'?fn.name.slice(7):s.fn==='x'?'∛y':'y'}. Slope estimates: ${sl.map(v=>D6_f(v)).join(', ')}. ${smoothOK?'They settle, so it is smooth at 0 in this chart.':`They keep growing (by ${D6_f(sl[2]/sl[1],1)} times for each tenfold smaller step), so there is no slope: not smooth in this chart.`}`};
 }});

// Milnor's 7-manifolds M(h, j), h + j = 1: two pieces (a 4-ball × a 3-sphere each) glued with the quaternion twist
// v ↦ uʰ v uʲ. Each is a topological 7-sphere; Milnor's invariant λ = k² − 1 (mod 7), with k = h − j, shows it is
// exotic whenever λ ≠ 0.
function D6_qpow(u,n){let r=[1,0,0,0];const b=n<0?[u[0],-u[1],-u[2],-u[3]]:u;for(let i=0;i<Math.abs(n);i++)r=D6_qmul(r,b);return r}
const D6_twistCheck=D6_memo('twck',()=>{const r=rng(2027),q=()=>{const v=[0,0,0,0].map(()=>r()*2-1);return D6_unit(v)};const out={};
 for(let h=-3;h<=4;h++){let worst=0;for(let t=0;t<40;t++){const u=q(),v=q(),w=D6_qmul(D6_qmul(D6_qpow(u,h),v),D6_qpow(u,1-h));worst=Math.max(worst,Math.abs(D6_norm(w)-1))}out[h]=worst}return out});
const D6_lam=k=>(((k*k-1)%7)+7)%7;
SCENE({id:'exotic-spheres-milnor',name:'Milnor’s exotic 7-spheres',tag:'John Milnor, 1956',
 definition:'In 1956 John Milnor built seven-dimensional manifolds by gluing two pieces, each a four-dimensional ball times a 3-sphere, with a twist written in quaternions: the 3-sphere point v over u is sent to uʰ v uʲ, for whole numbers h and j with h + j = 1. A function with just two critical points showed each one is a topological 7-sphere. Milnor then defined an invariant λ, a remainder after dividing by 7, that any smooth structure equal to the standard sphere’s must make 0.',
 example:'With k = h − j, Milnor computed λ = k² − 1 (mod 7). For k = ±1 it is 0: that is the ordinary 7-sphere, built as a bundle of 3-spheres over the 4-sphere. For k = 3 it is 1, so that manifold is a sphere you cannot smooth into the round one: an exotic sphere, the first known. The test is one-sided: λ = 0 does not prove a manifold standard.',
 desc:'A clock of the seven remainders with the chosen manifold’s λ marked, a table of λ for odd k from 1 to 13, and tiles for h, j, k, λ, the verdict and a numerical check that the quaternion twist keeps points on the 3-sphere.',
 research:['Milnor (1956). On manifolds homeomorphic to the 7-sphere. Annals of Mathematics 64, 399–405.','Reeb (1946): a closed manifold with a function having only two critical points is a topological sphere, the theorem Milnor used.','Unit length kept by the twist: checked here on 40 random (seeded) pairs of unit quaternions.'],
 dur:12,hint:'Move h; then j = 1 − h and k = h − j. Find the values of k for which Milnor’s test proves the sphere exotic.',
 init:()=>({h:2}),
 watch(p){return {h:-3+Math.min(7,Math.floor(p*8))}},
 ui:[{range:'h',label:'h (then j = 1 − h)',min:-3,max:4,get:s=>s.h,act:'h'}],
 on:{h(s,v){s.h=clamp(Math.round(+v),-3,4)}},
 draw(s){
  const h=s.h,j=1-h,k=h-j,lam=D6_lam(k),ex=lam!==0,cx=150,cy=200,r=104;
  let out=heading(ex?`k = ${D6_minus(k)}: λ = ${lam}, an exotic 7-sphere`:`k = ${D6_minus(k)}: λ = 0, the test is silent`);
  out+=Ci(cx,cy,r,'#fff',C.line);
  for(let m=0;m<7;m++){const a=Math.PI/2-m*2*Math.PI/7,x=cx+r*Math.cos(a),y=cy-r*Math.sin(a),on=m===lam;out+=Ci(x,y,on?19:15,on?(ex?C.coral:C.green):C.pale,on?'#fff':C.line)+TBF(x,y+5,m,14,on?'#fff':C.ink)}
  out+=TBF(cx,cy-4,'λ = k² − 1',14,C.ink)+TF(cx,cy+16,'remainder mod 7',13,C.muted);
  const tx=290;out+=R(tx,52,140,22,C.pale,'none',4)+TBF(tx+40,68,'k',13)+TBF(tx+104,68,'λ',13);
  [1,3,5,7,9,11,13].forEach((kk,i)=>{const on=Math.abs(k)===kk,y=92+i*21;if(on)out+=R(tx,y-15,140,20,C.amberp,'none',4);out+=TMF(tx+40,y,'±'+kk,13)+TMF(tx+104,y,D6_lam(kk),13,D6_lam(kk)?C.coral:C.green)});
  out+=TF(tx+70,240,'period 7 in k',13,C.muted);
  const x0=446;out+=D6_tile(x0,52,44,'h',D6_minus(h),C.ink)+D6_tile(x0+48,52,44,'j',D6_minus(j),C.ink)+D6_tile(x0+96,52,44,'k',D6_minus(k),C.ink);
  out+=D6_tile(x0,106,140,'Milnor’s λ',lam,ex?C.coral:C.green)+D6_tile(x0,160,140,'verdict',ex?'exotic':'no verdict',ex?C.coral:C.green);
  out+=D6_tile(x0,214,140,'twist keeps |·| = 1',`error below 10${D6_supN(Math.ceil(Math.log10(D6_twistCheck[h])))}`,C.blue);
  out+=D6_note('Each M(h, j) is a topological 7-sphere; λ ≠ 0 proves it exotic.',370);
  return {svg:out,phase:`h = ${D6_minus(h)}, j = ${D6_minus(j)}, so k = ${D6_minus(k)} and λ = ${k<0?`(${D6_minus(k)})`:k}² − 1 = ${k*k-1} ≡ ${lam} (mod 7). ${ex?'Not 0, so this topological 7-sphere has no smoothing that matches the round sphere: it is exotic.':k*k===1?'This is the ordinary 7-sphere.':'λ = 0, so this test cannot tell; Kervaire and Milnor’s later count settles such cases.'}`};
 }});

// How many smooth spheres? |Θₙ|, the number of oriented smooth structures on the n-sphere (Kervaire & Milnor 1963 table;
// n = 1, 2, 3 classical with Moise and Perelman; n = 4 open). For n = 4m − 1 the part bP₄ₘ is computed:
// |bP₄ₘ| = 2^(2m−2) · (2^(2m−1) − 1) · numerator(4Bₘ / m), with Bₘ the m-th Bernoulli number in the old numbering.
const D6_THETA=[null,1,1,1,null,1,1,28,2,8,6,992,1,3,2,16256,2,16,16];
const D6_bgcd=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b){[a,b]=[b,a%b]}return a};
const D6_BERN=D6_memo('bern',()=>{const B=[[1n,1n]];const C=(n,k)=>{let r=1n;for(let i=0;i<k;i++)r=r*BigInt(n-i)/BigInt(i+1);return r};
 for(let n=1;n<=24;n++){let num=0n,den=1n;for(let k=0;k<n;k++){const [a,b]=B[k],c=C(n+1,k);num=num*b+c*a*den;den=den*b;const g=D6_bgcd(num,den);num/=g;den/=g}
  let a=-num,b=den*BigInt(n+1);const g=D6_bgcd(a,b)||1n;a/=g;b/=g;if(b<0n){a=-a;b=-b}B.push([a,b])}return B});
function D6_bP(m){const [a,b]=D6_BERN[2*m],A=a<0n?-a:a;let num=4n*A,den=b*BigInt(m);const g=D6_bgcd(num,den);num/=g;return (1n<<BigInt(2*m-2))*((1n<<BigInt(2*m-1))-1n)*num}
const D6_big=v=>String(v).replace(/\B(?=(\d{3})+(?!\d))/g,',');
SCENE({id:'exotic-spheres-count',name:'Counting the smooth spheres',tag:'Kervaire & Milnor, 1963',
 definition:'In 1963 Michel Kervaire and John Milnor counted the smooth structures on spheres. Up to smooth equivalence keeping orientation, the 7-sphere has exactly 28, the 11-sphere 992 and the 15-sphere 16,256, while the 5-, 6- and 12-spheres have only the standard one. Their count splits into a part from spheres that bound especially simple manifolds, given by a formula with Bernoulli numbers, and a part from the homotopy groups of spheres.',
 example:'For dimensions 7, 11 and 15 the program evaluates the Bernoulli-number formula exactly: 28, 992 and 8128. For 7 and 11 that is the whole count; for 15 the other part doubles it. In dimensions 1, 2 and 3 there is only one smooth sphere (the case 3 uses Moise and Perelman). In dimension 61 too (Wang and Xu, 2017). Whether the 4-sphere has an exotic smooth structure is open: this is the smooth Poincaré conjecture in dimension 4.',
 desc:'A bar chart, on a scale of powers of ten, of the number of oriented smooth structures on the n-sphere for n from 1 to 18, with the bar for n = 4 marked open; tiles for the chosen dimension give the published count and, where it applies, the part computed from Bernoulli numbers.',
 research:['Kervaire & Milnor (1963). Groups of homotopy spheres: I. Annals of Mathematics 77, 504–537 (the table up to dimension 18).','Moise (1952). Affine structures in 3-manifolds V. Annals of Mathematics 56, 96–114: one smooth structure on every 3-manifold.','Wang & Xu (2017). The triviality of the 61-stem in the stable homotopy groups of spheres. Annals of Mathematics 186, 501–580.'],
 dur:13,hint:'Choose a dimension. Where n is 3 more than a multiple of 4, compare the published count with the part computed from the Bernoulli numbers.',
 init:()=>({n:7}),
 watch(p){return {n:[1,3,4,5,7,8,9,11,15,18][Math.min(9,Math.floor(p*10))]}},
 ui:[{range:'n',label:'Sphere dimension n',min:1,max:18,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),1,18)}},
 draw(s,f,X){
  const n=s.n,v=D6_THETA[n],x0=40,y0=72,bw=28,hh=200,Y=val=>y0+hh-Math.log10(val)/Math.log10(20000)*(hh-14)-14;
  let out=heading(v===null?'The 4-sphere: unknown (open problem)':`The ${n}-sphere has ${D6_big(v)} smooth ${D6_plural(v,'structure')}`);
  out+=R(x0-8,y0-10,18*bw+16,hh+44,'#fff',C.grid,8);
  for(const [val,l] of [[1,'1'],[10,'10'],[100,'100'],[1000,'1,000'],[10000,'10,000']])out+=L(x0,Y(val),x0+18*bw,Y(val),C.grid,1)+TF(x0+18*bw+2,Y(val)+4,l,13,C.muted,'start');
  for(let d=1;d<=18;d++){const val=D6_THETA[d],bx=x0+(d-1)*bw,on=d===n;let inner;
   if(val===null)inner=R(bx+4,y0+hh-60,bw-8,60,'#fff',C.coral,3,'stroke-dasharray="4 3"')+TBF(bx+bw/2,y0+hh-66,'?',14,C.coral);
   else inner=R(bx+4,Y(val),bw-8,Math.max(3,y0+hh-14-Y(val)+14),on?C.blue:C.pale,on?C.blue:C.line,3);
   out+=hit(X,'n',d,`Dimension ${d}`,inner+TF(bx+bw/2,y0+hh+18,d,13,on?C.blue:C.muted))}
  const tx=40,ty=300,m=(n+1)/4;
  out+=D6_tile(tx,ty,170,'published count',v===null?'open':D6_big(v),v===null?C.coral:C.ink);
  if(Number.isInteger(m)&&m>=2){const bp=D6_bP(m);out+=D6_tile(tx+178,ty,190,`computed part bP${D6_subN(4*m)}`,D6_big(bp),C.green)+D6_tile(tx+376,ty,170,'other part',v!==null?D6_big(BigInt(v)/bp):'',C.purple)}
  else out+=TF(tx+380,ty+28,n===4?'Smooth Poincaré conjecture in dimension 4: open.':'No Bernoulli part in this dimension.',13,C.muted);
  return {svg:out,phase:v===null?'Nobody knows whether the 4-sphere has an exotic smooth structure. Every other entry here is a theorem.':`The ${n}-sphere has ${D6_big(v)} oriented smooth ${D6_plural(v,'structure')} (Kervaire and Milnor).${Number.isInteger(m)&&m>=2?` The Bernoulli formula gives ${D6_big(D6_bP(m))} of them; the rest, a factor of ${D6_big(BigInt(v)/D6_bP(m))}, comes from the homotopy groups of spheres.`:''}`};
 }});

/* ===================== Lesson: dimension-four ===================== */
// Intersection forms of simply connected closed 4-manifolds, built as block sums: [1] (ℂP²), [−1] (ℂP² reversed),
// H = (0 1; 1 0) (S² × S²) and ±E8 (the E8 Cartan matrix). Rank, signature (Jacobi eigenvalues), parity and the exact
// determinant (Bareiss, BigInt) are computed from the matrix; the smooth verdicts follow Rokhlin, Donaldson and Furuta.
const D6_E8=D6_memo('e8',()=>{const M=range(8).map(i=>range(8).map(j=>i===j?2:0)),link=(a,b)=>{M[a][b]=M[b][a]=-1};for(let i=0;i<6;i++)link(i,i+1);link(4,7);return M});
const D6_BLOCKS={P:{name:'ℂP²',m:()=>[[1]]},N:{name:'ℂP² reversed',m:()=>[[-1]]},H:{name:'S² × S²',m:()=>[[0,1],[1,0]]},E:{name:'E8',m:()=>D6_E8},mE:{name:'−E8',m:()=>D6_E8.map(r=>r.map(v=>-v))}};
function D6_jacobi(A){const n=A.length,M=A.map(r=>r.slice());for(let sweep=0;sweep<60;sweep++){let off=0;for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)off+=M[i][j]**2;if(off<1e-20)break;
  for(let p=0;p<n;p++)for(let q=p+1;q<n;q++){if(Math.abs(M[p][q])<1e-14)continue;const th=(M[q][q]-M[p][p])/(2*M[p][q]),t=Math.sign(th||1)/(Math.abs(th)+Math.sqrt(th*th+1)),c=1/Math.sqrt(t*t+1),s=t*c;
   for(let k=0;k<n;k++){const a=M[k][p],b=M[k][q];M[k][p]=c*a-s*b;M[k][q]=s*a+c*b}for(let k=0;k<n;k++){const a=M[p][k],b=M[q][k];M[p][k]=c*a-s*b;M[q][k]=s*a+c*b}}}
 return range(n).map(i=>M[i][i])}
function D6_form(blocks){const mats=blocks.map(b=>D6_BLOCKS[b].m()),n=sum(mats.map(m=>m.length)),A=range(n).map(()=>new Array(n).fill(0));let o=0;
 for(const m of mats){m.forEach((r,i)=>r.forEach((v,j)=>A[o+i][o+j]=v));o+=m.length}
 const ev=n?D6_jacobi(A):[],pos=ev.filter(v=>v>1e-9).length,neg=ev.filter(v=>v<-1e-9).length,sig=pos-neg,even=A.every((r,i)=>r[i]%2===0),det=n?D6_detBig(A):1n,definite=n>0&&(pos===n||neg===n);
 // norm-1 vectors of a definite block sum: only the [±1] blocks have them (an even block has only even norms)
 const unitVecs=definite?2*blocks.filter(b=>b==='P'||b==='N').length:0,diag=definite&&unitVecs===2*n;
 let verdict,who;
 if(!n){verdict='the 4-sphere';who='no 2-dimensional holes'}
 else if(even&&sig%16!==0){verdict='no smooth version';who=`Rokhlin (1952): even forms need σ divisible by 16`}
 else if(definite&&!diag){verdict='no smooth version';who='Donaldson (1983): definite forms must be diagonal'}
 else if(definite){verdict='smooth';who=n===1?(sig>0?'ℂP² itself':'ℂP² reversed'):`a connected sum of ${n} ${sig>0?'ℂP²':'reversed ℂP²'}s`}
 else if(!even){verdict='smooth';who=`connected sums of ℂP²s and reversed ℂP²s`}
 else if(sig===0){verdict='smooth';who=n===2?'S² × S² itself':`a connected sum of ${n/2} copies of S² × S²`}
 else{const m=Math.abs(sig)/16,h=(n-16*m)/2;if(h>=3*m){verdict='smooth';who=(m===1?'the K3 surface':`${m} K3 surfaces`)+(h>3*m?` joined with ${h-3*m} S² × S²`:'')}else if(n>=10*Math.abs(sig)/8+2){verdict='open';who='between Furuta’s 10/8 and the 11/8 conjecture'}else{verdict='no smooth version';who='Furuta (2001): b₂ ≥ (10/8)|σ| + 2'}}
 return {A,n,sig,even,det,definite,verdict,who,pos,neg}}
const D6_FORM_PRESETS={cp2:['P'],s2s2:['H'],e8:['E'],e8e8:['E','E'],k3:['mE','mE','H','H','H'],e8h:['E','H']};
SCENE({id:'dimension-four',name:'Four-manifolds: continuous yes, smooth no',tag:'Freedman 1982, Donaldson 1983',
 definition:'In a closed, simply connected four-manifold, 2-dimensional surfaces meet each other in points. Counting those points with signs gives a symmetric matrix of whole numbers with determinant ±1, the intersection form. Michael Freedman proved in 1982 that every such matrix comes from a four-manifold, and that the matrix (with one extra sign for odd forms) decides it up to continuous deformation. Simon Donaldson proved in 1983 that many of them have no smooth version at all.',
 example:'The E8 form is realised by Freedman’s E8 manifold, but already Rokhlin (1952) showed no smooth manifold has it: an even form on a smooth one needs a signature divisible by 16. E8 ⊕ E8 passes that test, yet Donaldson’s theorem rules it out: a smooth form that is positive definite must be diagonal. Donaldson used gauge theory from physics, building on Karen Uhlenbeck’s analysis of the Yang–Mills equations.',
 desc:'A grid showing the intersection form built from chosen blocks, and tiles for its rank, signature, parity, definiteness, determinant, the Euler characteristic of the manifold, and whether a smooth manifold with that form exists, with the theorem that decides.',
 research:['Freedman (1982). The topology of four-dimensional manifolds. Journal of Differential Geometry 17, 357–453.','Donaldson (1983). An application of gauge theory to four-dimensional topology. Journal of Differential Geometry 18, 279–315; Rokhlin (1952), Doklady Akademii Nauk SSSR 84, 221–224.','Uhlenbeck (1982). Removable singularities in Yang–Mills fields; Connections with Lᵖ bounds on curvature. Communications in Mathematical Physics 83, 11–29 and 31–42. Furuta (2001). Monopole equation and the 11/8-conjecture. Mathematical Research Letters 8, 279–291.'],
 dur:15,hint:'Build a form from blocks, or start from a preset such as the K3 surface. The signature, parity and determinant are computed from the matrix; the verdict names the theorem behind it.',
 init:()=>({bl:['E','E']}),
 watch(p){const k=['cp2','s2s2','e8','e8e8','e8h','k3'][Math.min(5,Math.floor(p*6))];return {bl:D6_FORM_PRESETS[k]}},
 ui:[{choose:[['cp2','ℂP²'],['s2s2','S² × S²'],['e8','E8'],['e8e8','E8 ⊕ E8'],['k3','K3']],label:'Preset',get:s=>Object.keys(D6_FORM_PRESETS).find(k=>D6_FORM_PRESETS[k].join()===s.bl.join())||'',act:'pre'},
  {b:'+ [1]',act:'add',arg:'P'},{b:'+ [−1]',act:'add',arg:'N'},{b:'+ H',act:'add',arg:'H'},{b:'+ E8',act:'add',arg:'E'},{b:'+ −E8',act:'add',arg:'mE'},{b:'Remove last',act:'pop'}],
 on:{pre(s,v){if(D6_FORM_PRESETS[v])s.bl=D6_FORM_PRESETS[v].slice()},add(s,v){if(!D6_BLOCKS[v])return;const n=sum(s.bl.map(b=>D6_BLOCKS[b].m().length))+D6_BLOCKS[v].m().length;if(n<=24)s.bl.push(v)},pop(s){s.bl.pop()}},
 draw(s){
  const F=D6_form(s.bl),n=F.n,cs=n?Math.min(30,264/n):30,x0=40,y0=66;
  let out=heading(n?`${s.bl.map(b=>D6_BLOCKS[b].name).join(' ⊕ ')}: ${F.verdict}`:'No blocks: the 4-sphere');
  out+=R(x0-6,y0-6,264+12,264+12,'#fff',C.grid,6);
  F.A.forEach((r,i)=>r.forEach((v,j)=>{const x=x0+j*cs,y=y0+i*cs;out+=R(x,y,cs-1,cs-1,v>0?C.pale:v<0?C.coralp:'#fff',v?(v>0?C.blue:C.coral):'none',2);if(v&&cs>=15)out+=TMF(x+cs/2,y+cs/2+4.5,D6_minus(v),cs>=24?13:12,v>0?C.blue:C.coral)}));
  if(!n)out+=TF(x0+132,y0+136,'empty matrix',13,C.muted);
  out+=TF(x0+132,y0+290,'blue +, coral −, blank 0',13,C.muted);
  const tx=334;
  out+=D6_tile(tx,56,80,'rank b₂',n,C.ink)+D6_tile(tx+86,56,80,'signature σ',D6_minus(F.sig),C.ink)+D6_tile(tx+172,56,80,'χ = 2 + b₂',2+n,C.ink);
  out+=D6_tile(tx,110,80,'type',n?(F.even?'even':'odd'):'—',C.ink)+D6_tile(tx+86,110,80,'definite?',n?(F.definite?'yes':'no'):'—',C.ink)+D6_tile(tx+172,110,80,'determinant',D6_minus(String(F.det)),C.ink);
  out+=D6_tile(tx,164,252,'continuous manifold (Freedman)',n?'exists':'the 4-sphere',C.green);
  out+=D6_tile(tx,218,252,'smooth manifold',F.verdict,F.verdict==='smooth'||!n?C.green:F.verdict==='open'?C.amber:C.coral);
  out+=R(tx,272,252,70,'#fff',C.grid,8)+TF(tx+126,290,'because',13,C.muted)+D6_wrapText(F.who,34).map((l,i)=>TF(tx+126,309+i*18,l,13,C.ink)).join('');
  return {svg:out,phase:n?`This form has rank ${n}, signature ${D6_minus(F.sig)}, is ${F.even?'even':'odd'}${F.definite?' and definite':''}, with determinant ${D6_minus(String(F.det))}. Freedman: a continuous four-manifold with this form exists. Smooth: ${F.verdict} (${F.who}).`:'With no blocks the form is empty: the 4-sphere.'};
 }});

// Why four is hard: in n dimensions, pieces of dimensions p and q in general position meet in a set of dimension p + q − n
// (none when that is negative). Whitney's trick removes a pair of crossing points using a 2-dimensional disc, which itself
// must miss the 2-dimensional sheets: 2 + 2 − n < 0 needs n ≥ 5. The cartoon is the same bookkeeping one dimension down.
const D6_segX=(A,B)=>{let n=0;for(let i=0;i+1<A.length;i++)for(let j=0;j+1<B.length;j++){const a=A[i],b=A[i+1],c=B[j],d=B[j+1],r=[b[0]-a[0],b[1]-a[1]],q=[d[0]-c[0],d[1]-c[1]],den=r[0]*q[1]-r[1]*q[0];if(Math.abs(den)<1e-12)continue;const u=((c[0]-a[0])*q[1]-(c[1]-a[1])*q[0])/den,v=((c[0]-a[0])*r[1]-(c[1]-a[1])*r[0])/den;if(u>=0&&u<1&&v>=0&&v<1)n++}return n};
function D6_whitney(push,room){const A=range(81).map(i=>[-2+i/20,0]),B=range(81).map(i=>{const x=-2+i/20;return [x,.55-1.1*Math.exp(-x*x/.5)+push*1.2*Math.exp(-x*x/.5)]});
 const [cxo,cyo,hy]=room?[1.3,1.15,.2]:[0,.45,.7],Cc=range(81).map(i=>{const t=i/80*2*Math.PI,c=Math.cos(t),sn=Math.sin(t);return [cxo+.22*Math.sign(c)*Math.abs(c)**.4,cyo+hy*Math.sign(sn)*Math.abs(sn)**.4]});
 return {A,B,C:Cc,ab:D6_segX(A,B),bc:D6_segX(B,Cc)}}
SCENE({id:'dimension-four-room',name:'Why four is the hard case',tag:'Whitney 1944; exotic ℝ⁴, Gompf 1983, Taubes 1987',
 definition:'High dimensions have room to move things apart. Pieces of dimensions p and q in n-dimensional space usually meet in a set of dimension p + q − n, and miss each other when that is negative. Hassler Whitney’s trick (1944) cancels two crossing points of surfaces by pushing one surface across a 2-dimensional disc. In dimension 5 and up the disc misses everything else, which is how Smale proved Poincaré’s conjecture there. In dimension 4 the disc itself usually hits the surfaces in points.',
 example:'Freedman rescued the trick continuously in dimension 4 with Casson’s infinite towers of discs, but not smoothly, and that gap is where strange smooth structures live. Combining Freedman’s and Donaldson’s theorems showed that exotic ℝ⁴s exist: copies of four-dimensional space that cannot be smoothly matched with the ordinary one. Gompf (1983) built several, and Taubes (1987) showed there are uncountably many. Every ℝⁿ with n ≠ 4 has exactly one. Why four is special is not fully understood, and nothing here explains why spacetime has four dimensions.',
 desc:'A table of p + q − n for pieces of dimensions 1 and 2 in the chosen dimension n, and a cartoon one dimension down: two curves crossing twice, a disc between them, a third sheet that may run through the disc, and a slider that pushes one curve across the disc, with the crossings counted.',
 research:['Whitney (1944). The self-intersections of a smooth n-manifold in 2n-space. Annals of Mathematics 45, 220–246.','Casson (1986). Three lectures on new infinite constructions in 4-dimensional manifolds (lectures of 1973–76). Progress in Mathematics 62.','Gompf (1983). Three exotic ℝ⁴’s and other anomalies. Journal of Differential Geometry 18, 317–328; Taubes (1987). Gauge theory on asymptotically periodic 4-manifolds. Journal of Differential Geometry 25, 363–430.','Stallings (1962). The piecewise-linear structure of Euclidean space. Proceedings of the Cambridge Philosophical Society 58, 481–488 (one smooth structure on ℝⁿ for n ≥ 5).'],
 dur:13,hint:'Choose the dimension and read the table. Then push sheet B across the disc, with and without sheet C in the way. The cartoon is the bookkeeping one dimension down, not a picture of four dimensions.',
 init:()=>({n:4,push:0,room:0}),
 watch(p){return {n:p<.5?4:5,push:Math.round(smooth((p%.5)*2.2)*100)/100,room:p<.5?0:1}},
 ui:[{range:'n',label:'Dimension n',min:2,max:6,get:s=>s.n,act:'n'},{range:'push',label:'Push across the disc',min:0,max:100,step:5,get:s=>Math.round(s.push*100),act:'push',show:v=>v+'%'},{choose:[[0,'C through the disc'],[1,'C moved aside']],label:'Sheet C',get:s=>s.room,act:'room'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),2,6);s.room=s.n>=5?1:s.room},push(s,v){s.push=clamp(Math.round(+v),0,100)/100},room(s,v){s.room=+v?1:0}},
 draw(s){
  const n=s.n,rows=[[1,1,'two curves'],[1,2,'curve, surface'],[2,2,'two surfaces']],W=D6_whitney(s.push,s.room);
  let out=heading(n>=5?`In ${n} dimensions the disc misses the surfaces`:n===4?'In 4 dimensions the disc meets the surfaces in points':`In ${n} dimensions there is even less room`);
  const x0=26,y0=58;out+=R(x0,y0,252,26,C.pale,'none',4)+TBF(x0+10,y0+18,'pieces',13,C.ink,'start')+TBF(x0+242,y0+18,'p + q − n',13,C.ink,'end');
  rows.forEach(([p,q,lab],i)=>{const d=p+q-n,y=y0+52+i*58,on=p===2&&q===2;out+=R(x0,y-22,252,50,on?C.amberp:'#fff',C.grid,6)+TF(x0+10,y-2,`${lab}`,13,C.ink,'start')+TF(x0+10,y+16,`p = ${p}, q = ${q}${on?' (and the disc)':''}`,13,C.muted,'start')+TBF(x0+242,y+5,d<0?`${D6_minus(d)}: miss`:d===0?'0: points':`${d}: a ${d===1?'curve':'surface'}`,14,d<0?C.green:C.coral,'end')});
  out+=TF(x0+126,y0+232,n>=5?'2 + 2 − n < 0: the trick works':'2 + 2 − n ≥ 0: the trick can fail',13,n>=5?C.green:C.coral);
  const bx=300,by=60,bw=284,bh=230,M=q=>[bx+bw/2+q[0]*66,by+bh/2-q[1]*80];
  out+=R(bx,by,bw,bh,'#fff',C.grid,8)+TF(bx+bw/2,by+18,'one dimension down (a cartoon)',13,C.coral);
  out+=s.push<.02?`<polygon points="${range(41).map(i=>{const x=-.6+i*.03;return [x,Math.min(0,.55-1.1*Math.exp(-x*x/.5))]}).map(q=>M(q).map(fmt).join(',')).join(' ')}" fill="${C.amberp}" stroke="none"/>`:'';
  out+=D6_poly(W.A.map(M),C.blue,3)+D6_poly(W.B.map(M),C.purple,3)+D6_poly(W.C.map(M),C.green,2.6);
  out+=TF(bx+12,M([0,0])[1]+18,'sheet A',13,C.blue,'start')+TF(bx+12,M(W.B[0])[1]-8,'sheet B',13,C.purple,'start')+TF(M([W.C[0][0],0])[0]+(s.room?-30:34),by+40,'sheet C',13,C.green,s.room?'end':'start');
  out+=D6_tile(bx,300,138,'A meets B',`${W.ab} ${D6_plural(W.ab,'point')}`,W.ab?C.coral:C.green)+D6_tile(bx+146,300,138,'B meets C',`${W.bc} ${D6_plural(W.bc,'point')}`,W.bc?C.coral:C.green);
  return {svg:out,phase:`In ${n} dimensions two surfaces meet in a set of dimension ${D6_minus(2+2-n)}${2+2-n<0?', so they can be pulled apart':''}. In the cartoon, sheet B crosses A at ${W.ab} ${D6_plural(W.ab,'point')} and sheet C at ${W.bc}. ${W.ab===0&&W.bc>0?'The two crossings with A are gone, but B was pushed through C on the way: two new crossings. That is what goes wrong in dimension 4.':W.ab===0?'The two crossings have been cancelled cleanly.':'Push B across the disc to cancel its two crossings with A.'}`};
 }});

// What is proved, what is false, what is open. Each statement's status is a published result, given with its source.
const D6_QUIZ=[
 ['Every closed three-manifold in which every loop shrinks is the 3-sphere.','proved','Perelman, 2002–03.'],
 ['The 4-sphere has an exotic smooth structure.','open','The smooth Poincaré conjecture in dimension 4.'],
 ['ℝ⁵ has more than one smooth structure.','false','Stallings, 1962: one for every n ≠ 4.'],
 ['ℝ⁴ has uncountably many smooth structures.','proved','Taubes, 1987.'],
 ['Our universe is a Poincaré dodecahedral space.','open','Proposed 2003; not supported by circle searches.'],
 ['Every knotted circle in four-dimensional space can be untied.','proved','Lift a strand into the fourth direction.'],
 ['Every 2-sphere in four-dimensional space can be untied.','false','Artin, 1925: spun knots.'],
 ['A smooth closed four-manifold can have the E8 form.','false','Rokhlin, 1952; Donaldson, 1983.'],
 ['Four is special because spacetime has four dimensions.','open','No such result: unsupported.'],
 ['The 7-sphere has exactly 28 oriented smooth structures.','proved','Kervaire and Milnor, 1963.']];
const D6_QLAB={proved:'Proved',false:'False',open:'Open or unsupported'};
SCENE({id:'dimension-four-open',name:'Proved, false or open?',tag:'Where the subject stands',
 definition:'The era ends where the research is. Some statements about higher manifolds are theorems, some are false, and some are open or unsupported. Sort ten of them. The smooth Poincaré conjecture in dimension 4 is the best-known open question: is every smooth 4-manifold that is a sphere to a topologist also a smooth sphere? No one knows, and no one knows whether exotic 4-spheres exist.',
 example:'Since 1994 the Seiberg–Witten equations, also from physics, have made Donaldson’s methods much easier to use, and they have found many more exotic four-manifolds. They have not settled the 4-sphere. Proposed shapes of space stay undecided, and no result ties the strangeness of dimension four to the four dimensions of spacetime.',
 desc:'A card with one statement, three answer buttons (proved, false, open or unsupported), the correct status with its source once answered, a row of ten progress marks and the score.',
 research:['Witten (1994). Monopoles and four-manifolds. Mathematical Research Letters 1, 769–796.','Freedman & Quinn (1990). Topology of 4-Manifolds. Princeton University Press.','Kirby (1978, updated 1997). Problems in low-dimensional topology: the open problems list.'],
 dur:14,hint:'Read the statement and press Proved, False or Open. The answer and its source appear; then go to the next card. Nothing you answer leaves the page.',
 init:()=>({i:0,ans:{}}),
 watch(p){const i=Math.min(9,Math.floor(p*10)),ans={};for(let k=0;k<=i;k++)if(k<i||p*10-i>.5)ans[k]=D6_QUIZ[k][1];return {i,ans}},
 ui:[{b:'Proved',act:'a',arg:'proved'},{b:'False',act:'a',arg:'false'},{b:'Open or unsupported',act:'a',arg:'open'},{b:'Next card ▶',act:'next'}],
 on:{a(s,v){if(D6_QLAB[v]&&!(s.i in s.ans))s.ans[s.i]=v},next(s){s.i=(s.i+1)%D6_QUIZ.length},go(s,v){s.i=clamp(Math.round(+v),0,9)}},
 draw(s,f,X){
  const [st,truth,src]=D6_QUIZ[s.i],a=s.ans[s.i],score=Object.keys(s.ans).filter(k=>s.ans[k]===D6_QUIZ[k][1]).length,done=Object.keys(s.ans).length;
  let out=heading(`Card ${s.i+1} of ${D6_QUIZ.length}`);
  out+=R(40,52,520,110,'#fff',C.line,10);
  const words=st.split(' '),lines=[''];for(const w of words){if((lines[lines.length-1]+' '+w).length>44)lines.push(w);else lines[lines.length-1]+=(lines[lines.length-1]?' ':'')+w}
  lines.forEach((l,i)=>out+=TB(300,92+i*28-(lines.length-1)*8,l,17,C.ink));
  ['proved','false','open'].forEach((k,i)=>{const x=40+i*176,pick=a===k,right=a&&k===truth,inner=R(x,178,168,48,right?C.greenp:pick?C.coralp:C.pale,right?C.green:pick?C.coral:C.line,8)+TBF(x+84,207,D6_QLAB[k],14,right?C.green:pick?C.coral:C.ink);out+=a?inner:hit(X,'a',k,D6_QLAB[k],inner)});
  if(a)out+=TBF(300,256,a===truth?'Right: '+D6_QLAB[truth].toLowerCase()+'.':'Not quite: '+D6_QLAB[truth].toLowerCase()+'.',15,a===truth?C.green:C.coral)+TF(300,280,src,14,C.ink);
  else out+=TF(300,262,'Choose an answer.',14,C.muted);
  D6_QUIZ.forEach((q,k)=>{const x=165+k*30,y=318,an=s.ans[k],inner=Ci(x,y,10,an?(an===q[1]?C.green:C.coral):'#fff',k===s.i?C.ink:C.line)+TF(x,y+4.5,k+1,12,an?'#fff':C.muted);out+=hit(X,'go',k,`Card ${k+1}`,inner)});
  out+=TF(300,352,`score ${score} of ${done} answered`,13,C.muted);
  return {svg:out,phase:a?`${st} ${D6_QLAB[truth]}: ${src}`:`${st} Proved, false, or open?`};
 }});
