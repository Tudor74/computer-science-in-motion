/* ===================== Dimensions In Motion · Era 2 · Hypercubes and polytopes ===================== */
// Building the n-cube, counting its parts, simplices and cross-polytopes, the regular polytopes, the 24-, 120- and
// 600-cells, and Euler's formula. Every count, coordinate and angle on screen is computed here from generated vertex
// lists: corners as 0/1 strings, edges as nearest pairs, facets as supporting hyperplanes, lower faces as
// intersections of facets. Pictures are pure functions of state, frame and X. 4D objects are rotated and projected
// by this file's own code; the 3D view only turns a camera on the projected result.

/* ---- numbers and small helpers ---- */
const D2_PHI=(1+Math.sqrt(5))/2;
function D2_binom(n,k){if(k<0||k>n)return 0;let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return Math.round(r)}
const D2_pow2=n=>2**n;
const D2_pop=m=>{let c=0;while(m){c+=m&1;m>>>=1}return c};
const D2_num=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',');
const D2_deg=r=>r*180/Math.PI;
const D2_d1=v=>(Math.round(v*10)/10).toFixed(1);   // one decimal place, as stated beside each use
const D2_d2=v=>(Math.round(v*100)/100).toFixed(2);
const D2_minus=v=>String(v).replace('-','−');
const D2_SUB=['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'];
const D2_xi=i=>'x'+D2_SUB[i+1];
const D2_memo=(()=>{const m={};return (k,fn)=>(k in m)?m[k]:(m[k]=fn())})();
const D2_note=(s,y=368)=>TF(300,y,s,13,C.muted);
function D2_tile(x,y,w,label,value,col=C.blue,h=46){return R(x,y,w,h,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+38,value,16,col)}
function D2_combos(arr,k){const out=[],acc=[];const rec=st=>{if(acc.length===k){out.push(acc.slice());return}for(let i=st;i<arr.length;i++){acc.push(arr[i]);rec(i+1);acc.pop()}};rec(0);return out}
function D2_perms(n){if(n===0)return [[]];const out=[];for(const p of D2_perms(n-1))for(let i=0;i<=p.length;i++)out.push([...p.slice(0,i),n-1,...p.slice(i)]);return out}
function D2_parity(p){let s=0;for(let i=0;i<p.length;i++)for(let j=i+1;j<p.length;j++)if(p[i]>p[j])s^=1;return s}

/* ---- vectors ---- */
const D2_dot=(a,b)=>{let s=0;for(let i=0;i<a.length;i++)s+=a[i]*b[i];return s};
const D2_sub=(a,b)=>a.map((x,i)=>x-b[i]);
const D2_add=(a,b)=>a.map((x,i)=>x+b[i]);
const D2_scale=(a,k)=>a.map(x=>x*k);
const D2_len=a=>Math.sqrt(D2_dot(a,a));
const D2_dist2=(a,b)=>{let s=0;for(let i=0;i<a.length;i++){const d=a[i]-b[i];s+=d*d}return s};
const D2_mean=ps=>ps[0].map((_,j)=>ps.reduce((s,p)=>s+p[j],0)/ps.length);
const D2_angle=(a,b)=>Math.acos(clamp(D2_dot(a,b)/(D2_len(a)*D2_len(b)),-1,1));
function D2_det(M){const m=M.map(r=>r.slice()),n=m.length;let d=1;
 for(let c=0;c<n;c++){let p=c;for(let i=c+1;i<n;i++)if(Math.abs(m[i][c])>Math.abs(m[p][c]))p=i;
  if(Math.abs(m[p][c])<1e-12)return 0;if(p!==c){[m[p],m[c]]=[m[c],m[p]];d=-d}d*=m[c][c];
  for(let i=c+1;i<n;i++){const f=m[i][c]/m[c][c];for(let j=c;j<n;j++)m[i][j]-=f*m[c][j]}}
 return d}
// The normal to the hyperplane spanned by d−1 vectors in d dimensions (the generalised cross product).
function D2_normal(vs){const d=vs[0].length;return range(d).map(j=>(j%2?-1:1)*D2_det(vs.map(v=>v.filter((_,i)=>i!==j))))}
function D2_rank(vs){const m=vs.map(v=>v.slice());if(!m.length)return 0;const d=m[0].length;let r=0;
 for(let c=0;c<d&&r<m.length;c++){let p=r;for(let i=r+1;i<m.length;i++)if(Math.abs(m[i][c])>Math.abs(m[p][c]))p=i;
  if(Math.abs(m[p][c])<1e-8)continue;[m[r],m[p]]=[m[p],m[r]];
  for(let i=0;i<m.length;i++)if(i!==r){const f=m[i][c]/m[r][c];for(let j=c;j<d;j++)m[i][j]-=f*m[r][j]}r++}
 return r}
// The dimension of the flat spanned by some of the points (0 for one point, 1 for a segment, …).
const D2_affRank=(pts,ids)=>ids.length<2?0:D2_rank(ids.slice(1).map(i=>D2_sub(pts[i],pts[ids[0]])));
function D2_rot(v,i,j,a){const w=v.slice(),c=Math.cos(a),s=Math.sin(a);w[i]=c*v[i]-s*v[j];w[j]=s*v[i]+c*v[j];return w}
function D2_orthonormal(vs){const out=[];for(const v of vs){let w=v.slice();for(const u of out)w=D2_sub(w,D2_scale(u,D2_dot(w,u)));const l=D2_len(w);if(l>1e-9)out.push(D2_scale(w,1/l))}return out}

/* ---- the n-cube: corners as 0/1 strings ---- */
const D2_cubeVerts=n=>D2_memo('cv'+n,()=>range(2**n).map(m=>range(n).map(i=>(m>>i)&1)));
// Edges found from the vertex list: pairs of strings that differ in exactly one place.
const D2_cubeEdges=n=>D2_memo('ce'+n,()=>{const V=D2_cubeVerts(n),e=[];for(let a=0;a<V.length;a++)for(let b=a+1;b<V.length;b++){let d=0;for(let i=0;i<n;i++)if(V[a][i]!==V[b][i])d++;if(d===1)e.push([a,b])}return e});
const D2_str=v=>v.join('');
// k-faces counted from the vertex list: choose k coordinates to vary and group the corners by the others.
const D2_cubeFaceCount=(n,k)=>D2_memo('cf'+n+','+k,()=>{const V=D2_cubeVerts(n);let c=0;
 for(let S=0;S<2**n;S++){if(D2_pop(S)!==k)continue;const keys=new Set(V.map(v=>v.map((b,i)=>(S>>i)&1?'*':b).join('')));c+=keys.size}return c});
const D2_cubeFormula=(n,k)=>2**(n-k)*D2_binom(n,k);
// All face patterns over {0,1,*} with k stars (n ≤ 6).
function D2_patterns(n,k){const out=[];for(let m=0;m<3**n;m++){let x=m;const p=[];for(let i=0;i<n;i++){p.push('01*'[x%3]);x=Math.floor(x/3)}if(k===undefined||p.filter(c=>c==='*').length===k)out.push(p)}return out}
const D2_matches=(v,pat)=>pat.every((c,i)=>c==='*'||+c===v[i]);
// Directions on the page for the axes x₁…x₆ (the drawing of the n-cube keeps old axes fixed as n grows).
const D2_AX=[[1,0],[0,-1],[.55,-.34],[.36,.5],[-.46,-.2],[.2,-.6]];
function D2_cubeRaw(n,t=1){return D2_cubeVerts(n).map(v=>{let x=0,y=0;v.forEach((b,i)=>{const k=b*(i===n-1?t:1);x+=k*D2_AX[i][0];y+=k*D2_AX[i][1]});return [x,y]})}
function D2_fit(pts,x0,y0,w,h,maxScale=200,ref=pts){
 const xs=ref.map(p=>p[0]),ys=ref.map(p=>p[1]),xa=Math.min(...xs),xb=Math.max(...xs),ya=Math.min(...ys),yb=Math.max(...ys);
 const sc=Math.min(maxScale,w/((xb-xa)||1e-9),h/((yb-ya)||1e-9)),cx=(xa+xb)/2,cy=(ya+yb)/2;
 return p=>[x0+w/2+(p[0]-cx)*sc,y0+h/2+(p[1]-cy)*sc];
}
const D2_axisOf=(V,a,b)=>V[a].findIndex((x,i)=>x!==V[b][i]);

/* ---- simplex and cross-polytope ---- */
// n+1 corners of a regular n-simplex, centred at the origin, with every edge √2 long (the corners of the
// standard simplex e₀…eₙ written in an orthonormal basis of the hyperplane they span).
const D2_simplexCoords=n=>D2_memo('sx'+n,()=>range(n+1).map(i=>range(n).map(j=>{const J=j+1,q=Math.sqrt(J*(J+1));return i<J?1/q:i===J?-J/q:0})));
// 2n corners ±eᵢ of the cross-polytope: index 2i is +eᵢ, 2i+1 is −eᵢ.
const D2_crossCoords=n=>D2_memo('cx'+n,()=>{const out=[];for(let i=0;i<n;i++)for(const s of [1,-1])out.push(range(n).map(j=>j===i?s:0));return out});
// Faces of the simplex: every set of k+1 corners (checked to span a k-flat). Faces of the cross-polytope: sets of
// k+1 corners with no opposite pair (checked to span a k-flat). Both counted by listing subsets.
const D2_simplexFaceCount=(n,k)=>D2_memo('sf'+n+','+k,()=>{const P=D2_simplexCoords(n);let c=0;for(let m=1;m<2**(n+1);m++){if(D2_pop(m)!==k+1)continue;const ids=range(n+1).filter(i=>(m>>i)&1);if(D2_affRank(P,ids)===k)c++}return c});
const D2_crossFaceCount=(n,k)=>D2_memo('xf'+n+','+k,()=>{const P=D2_crossCoords(n);let c=0;for(let m=1;m<2**(2*n);m++){if(D2_pop(m)!==k+1)continue;let ok=true;for(let i=0;i<n;i++)if(((m>>(2*i))&3)===3){ok=false;break}if(!ok)continue;const ids=range(2*n).filter(i=>(m>>i)&1);if(D2_affRank(P,ids)===k)c++}return c});
const D2_simplexFormula=(n,k)=>D2_binom(n+1,k+1);
const D2_crossFormula=(n,k)=>2**(k+1)*D2_binom(n,k+1);

/* ---- convex hulls: the face lattice of a polytope from its corner coordinates ---- */
// Edges: pairs at the smallest distance (all edges of the regular polytopes and prisms used here are equal).
function D2_minEdges(pts){let m=Infinity;const n=pts.length;
 for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){const d=D2_dist2(pts[i],pts[j]);if(d>1e-12&&d<m)m=d}
 const e=[];for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(Math.abs(D2_dist2(pts[i],pts[j])-m)<1e-6*m)e.push([i,j]);return e}
// Facets: hyperplanes through a corner and d−1 of its neighbours that have every corner on one side.
function D2_facets(pts,nb){const d=pts[0].length,seen=new Set(),out=[];
 for(let v=0;v<pts.length;v++)for(const c of D2_combos(nb[v],d-1)){
  const raw=D2_normal(c.map(u=>D2_sub(pts[u],pts[v]))),l=D2_len(raw);if(l<1e-9)continue;
  const n=D2_scale(raw,1/l),h=D2_dot(n,pts[v]);let pos=0,neg=0;const on=[];
  for(let u=0;u<pts.length;u++){const s=D2_dot(n,pts[u])-h;if(s>1e-7)pos++;else if(s<-1e-7)neg++;else on.push(u)}
  if((pos&&neg)||(!pos&&!neg))continue;const key=on.join(',');if(seen.has(key))continue;seen.add(key);
  out.push({v:on,n:pos?D2_scale(n,-1):n});
 }
 return out}
// Faces one dimension down: intersections of two k-faces that span a (k−1)-flat.
function D2_down(pts,faces,k){const inc=pts.map(()=>[]);faces.forEach((f,i)=>f.forEach(v=>inc[v].push(i)));const seen=new Set(),out=[];
 faces.forEach((f,i)=>{const cnt=new Map();for(const v of f)for(const j of inc[v])if(j>i)cnt.set(j,(cnt.get(j)||0)+1);
  for(const [j,c] of cnt){if(c<k)continue;const S=new Set(faces[j]),inter=f.filter(v=>S.has(v)),key=inter.join(',');if(seen.has(key))continue;
   if(D2_affRank(pts,inter)===k-1){seen.add(key);out.push(inter)}}});
 return out}
function D2_lattice(pts,allPairs=false){const d=pts[0].length,ed=D2_minEdges(pts),nb=pts.map(()=>[]);
 if(allPairs)pts.forEach((_,i)=>{nb[i]=range(pts.length).filter(j=>j!==i)});else ed.forEach(([a,b])=>{nb[a].push(b);nb[b].push(a)});
 const fac=D2_facets(pts,nb),faces={};faces[d-1]=fac.map(f=>f.v);
 for(let k=d-1;k>1;k--)faces[k-1]=D2_down(pts,faces[k],k);
 const f=[pts.length];for(let k=1;k<d;k++)f.push(faces[k].length);
 const fnb=pts.map(()=>[]);faces[1].forEach(([a,b])=>{fnb[a].push(b);fnb[b].push(a)});
 return {d,pts,minEdges:ed,nb:fnb,facets:fac,faces,f}}
// The dihedral angle between two facets that share a ridge (radians).
function D2_dihedral(L){const fa=L.facets,R=L.faces[L.d-2][0];const both=fa.filter(f=>R.every(v=>f.v.includes(v)));return Math.PI-D2_angle(both[0].n,both[1].n)}
// The Schläfli symbol read back from the lattice: corners of a 2-face, then faces round a corner of a cell, …
function D2_symbolOf(L){const d=L.d,out=[];
 if(d>=2)out.push((d===2?L.pts:L.faces[2][0]).length);
 if(d>=3){const c=d===3?null:L.faces[3][0],v0=d===3?0:c[0];const fs=L.faces[2].filter(f=>f.includes(v0)&&(!c||f.every(v=>c.includes(v))));out.push(fs.length)}
 if(d>=4){const e=L.faces[1][0];out.push(L.faces[3].filter(c=>c.includes(e[0])&&c.includes(e[1])).length)}
 return out}

/* ---- the regular polyhedra and 4-polytopes, from coordinates ---- */
function D2_cyc3(list){const out=[];for(const p of list)for(let r=0;r<3;r++)out.push([p[r%3],p[(r+1)%3],p[(r+2)%3]]);return out}
function D2_signs(p){let out=[[]];for(const x of p)out=out.flatMap(q=>x===0?[[...q,0]]:[[...q,x],[...q,-x]]);return out}
const D2_SOLIDS=[
 {key:'3,3',name:'tetrahedron',pts:()=>[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]]},
 {key:'4,3',name:'cube',pts:()=>D2_signs([1,1,1])},
 {key:'3,4',name:'octahedron',pts:()=>D2_signs([1,0,0]).concat(D2_signs([0,1,0]),D2_signs([0,0,1]))},
 {key:'5,3',name:'dodecahedron',pts:()=>D2_signs([1,1,1]).concat(D2_cyc3([[0,1/D2_PHI,D2_PHI]]).flatMap(D2_signs))},
 {key:'3,5',name:'icosahedron',pts:()=>D2_cyc3([[0,1,D2_PHI]]).flatMap(D2_signs)}];
function D2_600pts(){const out=[];for(let i=0;i<4;i++)for(const s of [1,-1])out.push(range(4).map(j=>j===i?s:0));
 for(const p of D2_signs([.5,.5,.5,.5]))out.push(p);
 const base=[D2_PHI/2,.5,1/(2*D2_PHI),0];
 for(const pm of D2_perms(4).filter(p=>!D2_parity(p)))for(const sg of D2_signs(base)){const q=[0,0,0,0];pm.forEach((to,from)=>{q[to]=sg[from]});out.push(q)}
 return out}
const D2_FOUR=[
 {key:'3,3,3',name:'5-cell',cell:'tetrahedra',pts:()=>D2_simplexCoords(4)},
 {key:'4,3,3',name:'tesseract',cell:'cubes',pts:()=>D2_signs([1,1,1,1])},
 {key:'3,3,4',name:'16-cell',cell:'tetrahedra',pts:()=>D2_crossCoords(4)},
 {key:'3,4,3',name:'24-cell',cell:'octahedra',pts:()=>{const out=[];for(const [i,j] of D2_combos([0,1,2,3],2))for(const a of [1,-1])for(const b of [1,-1])out.push(range(4).map(k=>k===i?a:k===j?b:0));return out}},
 {key:'3,3,5',name:'600-cell',cell:'tetrahedra',pts:()=>D2_600pts()},
 // The 120-cell's corners are computed as the centres of the 600-cell's 600 tetrahedra (duality).
 {key:'5,3,3',name:'120-cell',cell:'dodecahedra',pts:()=>{const L=D2_lat('3,3,5');return L.faces[3].map(c=>D2_mean(c.map(i=>L.pts[i])))}}];
const D2_ALL=D2_SOLIDS.concat(D2_FOUR);
const D2_byKey=k=>D2_ALL.find(s=>s.key===k);
const D2_lat=key=>D2_memo('lat'+key,()=>D2_lattice(D2_byKey(key).pts()));
const D2_symStr=k=>'{'+k+'}';

/* ---- drawing helpers ---- */
// A fixed oblique view of 3D points onto the page (the 2D drawing never depends on the 3D camera).
function D2_view(yaw=.62,pitch=.42){const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
 return ([x,y,z])=>{const a=x*cy-y*sy,b=x*sy+y*cy;return [a,-b*sp-z*cp,-b*cp+z*sp]}}
// A 4D → 2D orthographic projection onto two fixed orthonormal directions.
const D2_P4=D2_orthonormal([[1,.18,.32,.55],[.12,1,-.46,.3]]);
const D2_proj4=v=>[D2_dot(v,D2_P4[0]),D2_dot(v,D2_P4[1])];
const D2_AXCOL=[C.blue,C.coral,C.green,C.purple,C.amber,C.dark];
function D2_legend(x,y,items){let o='';items.forEach(([col,lab,dash],i)=>{const yy=y+i*20;o+=L(x,yy-4,x+24,yy-4,col,3,dash?'stroke-dasharray="5 4"':'')+TF(x+32,yy,lab,13,C.ink,'start')});return o}

/* ===================== Lesson: building-cubes ===================== */
const D2_DIMNAME=['a point','a segment','a square','a cube','a tesseract','a 5-cube','a 6-cube'];
function D2_buildPic(n,t,X0=26,Y0=52,W=380,H=236){
 const V=D2_cubeVerts(n),E=D2_cubeEdges(n),raw=D2_cubeRaw(n,t),fit=D2_fit(raw,X0,Y0,W,H,150,D2_cubeRaw(n,1).concat([[0,0]])),P=raw.map(fit);
 let out='';const kind=([a,b])=>{const ax=D2_axisOf(V,a,b);return ax===n-1?'swept':V[a][n-1]?'copy':'old'};
 for(const want of ['old','swept','copy'])for(const e of E){if(kind(e)!==want)continue;const [a,b]=e;
  out+=L(P[a][0],P[a][1],P[b][0],P[b][1],want==='old'?C.blue:want==='copy'?C.coral:C.green,want==='swept'?2:2.6,want==='swept'?'stroke-dasharray="6 4"':'')}
 V.forEach((v,i)=>{out+=Ci(P[i][0],P[i][1],n>4?3.2:4.5,n&&v[n-1]?C.coral:C.blue,'#fff')});
 return {svg:out,P,V,E};
}
function D2_buildState(p){const k=Math.min(5,Math.floor(p*5)+1),t=smooth((p*5-(k-1))/.75);return {n:k,t:p>=1?1:t}}
SCENE({id:'building-cubes',name:'Slide a cube into a new direction',tag:'Hinton names the tesseract, 1888',
 definition:'Slide a point one unit and it sweeps out a segment. Slide the segment at right angles to itself and it sweeps out a square; slide the square in a third direction and you get a cube. Nothing in the rule stops at three: slide the cube one unit in a fourth direction, at right angles to all three, and it sweeps out a four-dimensional cube. Charles Howard Hinton called it the tesseract in A New Era of Thought (1888).',
 example:`Each slide keeps the original, adds a moved copy and joins every old corner to its copy by a new edge. So the corners double, and the edges become twice the old edges plus one per old corner: the cube’s ${D2_cubeVerts(3).length} corners and ${D2_cubeEdges(3).length} edges give the tesseract ${D2_cubeVerts(4).length} corners and 2 × ${D2_cubeEdges(3).length} + ${D2_cubeVerts(3).length} = ${D2_cubeEdges(4).length} edges.`,
 desc:'A flat drawing of the n-cube: the original (n−1)-cube in blue, its copy in red sliding along a new direction, and dashed green edges swept out by the corners, with counts of corners and edges.',
 research:['Hinton (1888). A New Era of Thought. Swan Sonnenschein, London: the word “tesseract”.','Coxeter (1948). Regular Polytopes. Methuen: the n-cube as the “measure polytope” γₙ, swept out by moving γₙ₋₁ a unit distance at right angles to itself.'],
 dur:15,hint:'Drag the slider to slide the copy out, or press Add a dimension and watch it slide. The counts on the right come from the generated corner and edge lists.',
 init:()=>({n:3,t:1}),
 watch:D2_buildState,
 ui:[{range:'n',label:'Dimension n',min:0,max:6,get:s=>s.n,act:'n'},{range:'t',label:'Slide the copy',min:0,max:1,step:.05,get:s=>s.t,act:'t',show:v=>Math.round(v*100)+'%'},{b:'Add a dimension ▶',act:'add'},{b:'Slide out again',act:'again'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),0,6);s.t=1},t(s,v){s.t=clamp(+v,0,1)},
  add(s,_,ctx){if(s.n>=6)s.n=0;else s.n++;s.t=0;ctx.every(60,'grow');return 'keep'},again(s,_,ctx){s.t=0;ctx.every(60,'grow');return 'keep'},
  grow(s){s.t=Math.min(1,s.t+.04);return s.t>=1?'stop':'keep'}},
 draw(s,f,X){
  const n=s.n,t=s.t,V=D2_cubeVerts(n).length,E=D2_cubeEdges(n).length,Vo=n?D2_cubeVerts(n-1).length:0,Eo=n?D2_cubeEdges(n-1).length:0;
  let out=heading(n===0?'Start with a point: the 0-cube':t<.02?`The copy sits on top of ${D2_DIMNAME[n-1]}`:t<1?`Sliding ${D2_DIMNAME[n-1]} along ${D2_xi(n-1)}`:`${D2_DIMNAME[n][0].toUpperCase()+D2_DIMNAME[n].slice(1)}: the ${n}-cube`);
  const pic=D2_buildPic(n,t);out+=pic.svg;
  if(n>0){const o=pic.P[0],d=D2_AX[n-1],l=Math.hypot(d[0],d[1]);out+=arrow(o[0],o[1],o[0]+d[0]/l*44,o[1]+d[1]/l*44,C.green,2.2);
   out+=TF(o[0]+d[0]/l*58,o[1]+d[1]/l*58+5,D2_xi(n-1),14,C.green)}
  out+=D2_tile(430,52,150,'Dimension n',String(n),C.ink)+D2_tile(430,106,150,'Corners',n?`2 × ${Vo} = ${V}`:'1',C.blue)+D2_tile(430,160,150,'Edges',n?`2 × ${Eo} + ${Vo} = ${E}`:'0',C.green)+D2_tile(430,214,150,'Edges at each corner',String(D2_cubeEdges(n).filter(e=>e.includes(0)).length),C.ink);
  out+=D2_legend(40,306,[[C.blue,`the original ${n?Math.max(0,n-1)+'-cube':'point'}`],[C.coral,'its copy, slid one unit'],[C.green,'edges swept by the corners',1]]);
  out+=TF(430,290,'from the generated',13,C.muted,'start')+TF(430,308,'corner and edge lists',13,C.muted,'start');
  out+=D2_note('A flat drawing (a projection): each direction x₁, x₂, … is drawn as one arrow on the page.');
  const ph=n===0?'A point has no length and no parts but itself. Slide it one unit and it sweeps out a segment with 2 ends and 1 edge.':
   t<1?`The ${n-1}-cube slides along ${D2_xi(n-1)}, a direction at right angles to all ${n-1===1?'the one':'the '+(n-1)} before it. Each of its ${Vo} corners drags out a new edge.`:
   `Done: ${D2_DIMNAME[n]} with ${V} corners and ${E} edges. The original kept its ${Eo} edges, the copy has ${Eo} more, and the ${Vo} corners swept out ${Vo} new edges.${n===4?' Hinton called this one the tesseract.':''} Every corner now has ${n} edges, one along each direction.`;
  return {svg:out,phase:ph};
 }});

// Corners as strings, laid out in rows by how many 1s they contain.
function D2_rowsLayout(n){const V=D2_cubeVerts(n),rows=range(n+1).map(()=>[]);V.forEach((v,i)=>rows[sum(v)].push(i));
 const pos=[];rows.forEach((r,j)=>r.forEach((i,k)=>{pos[i]=[318+(k-(r.length-1)/2)*Math.min(96,456/Math.max(1,r.length-1||1)),64+j*(232/Math.max(1,n))]}));return {rows,pos}}
const D2_gray=i=>i^(i>>1);
SCENE({id:'building-cubes-strings',name:'Corners as strings of 0s and 1s',tag:'Coordinates do the work',
 definition:'Put the n-cube with one corner at the origin and its edges along the axes, each one unit long. Every corner then has coordinates that are each 0 or 1, so a corner is just a string of n binary digits, and there is one corner for every string: 2ⁿ of them. Two corners are joined by an edge exactly when their strings differ in one place, because an edge runs along one axis.',
 example:`In the tesseract the corner 0110 is joined to ${range(4).map(i=>'0110'.split('').map((c,j)=>j===i?(c==='0'?'1':'0'):c).join('')).join(', ')}: flip any one of its four digits. Every corner has n edges and every edge has two ends, so the edges number n × 2ⁿ ÷ 2, which is ${4*16/2} for the tesseract, the same as the ${D2_cubeEdges(4).length} pairs found by comparing all strings.`,
 desc:'The corners of the n-cube as binary strings in rows by their number of 1s, joined by edges where two strings differ in one place, with the chosen corner and its neighbours highlighted and a count of corners at each distance.',
 research:['Gray (1953). Pulse code communication. US Patent 2,632,058: a code in which successive numbers differ in one binary digit, which is a walk along the edges of the n-cube through every corner.','Coxeter (1948). Regular Polytopes. Methuen: coordinates of the measure polytope.'],
 dur:12,hint:'Press any corner to see its neighbours: flip one digit at a time. Change n, or show a Gray-code walk that visits every corner along edges.',
 init:()=>({n:4,sel:6,gray:0}),
 watch:p=>({n:4,sel:[0,6,15,9][Math.min(3,Math.floor(p*4))],gray:p>.75?1:0}),
 ui:[{range:'n',label:'Dimension n',min:1,max:5,get:s=>s.n,act:'n'},{b:'Gray-code walk on/off',act:'gray'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),1,5);s.sel=Math.min(s.sel,2**s.n-1)},sel(s,v){s.sel=clamp(Math.round(+v),0,2**s.n-1)},gray(s){s.gray=s.gray?0:1}},
 draw(s,f,X){
  const n=s.n,V=D2_cubeVerts(n),E=D2_cubeEdges(n),{pos}=D2_rowsLayout(n),sv=V[s.sel],nbr=E.filter(e=>e.includes(s.sel)).map(e=>e[0]===s.sel?e[1]:e[0]);
  const ham=i=>V[i].reduce((a,b,j)=>a+(b!==sv[j]),0);
  let out=heading(`Corner ${D2_str(sv)} has ${nbr.length} neighbour${nbr.length===1?'':'s'}`);
  const walk=range(2**n).map(D2_gray),wset=new Set(walk.slice(1).map((g,i)=>Math.min(g,walk[i])+','+Math.max(g,walk[i])));
  for(const [a,b] of E){const on=a===s.sel||b===s.sel,g=s.gray&&wset.has(a+','+b);out+=L(pos[a][0],pos[a][1],pos[b][0],pos[b][1],on?C.coral:g?C.green:C.grid,on?3:g?3:1.6)}
  V.forEach((v,i)=>{const isSel=i===s.sel,isN=nbr.includes(i),w=12+8.2*n;
   const inner=R(pos[i][0]-w/2,pos[i][1]-12,w,24,isSel?C.coral:isN?C.coralp:'#fff',isSel||isN?C.coral:C.line,6)+TMF(pos[i][0],pos[i][1]+5,D2_str(v),13,isSel?'#fff':C.ink);
   out+=hit(X,'sel',i,`Corner ${D2_str(v)}. Press to choose it.`,inner)});
  for(let j=0;j<=n;j++)out+=TF(14,64+j*(232/n)+5,`${j===0?'no':j} 1${j===1?'':'s'}`,13,C.muted,'start');
  const dist=range(n+1).map(d=>V.filter((_,i)=>ham(i)===d).length);
  out+=TF(300,322,`Corners at distance 0, 1, …, ${n} from ${D2_str(sv)} (places that differ): ${dist.join(', ')}`,13,C.ink);
  const deg=sum(V.map((_,i)=>E.filter(e=>e.includes(i)).length));
  out+=TF(300,342,`Edges: ${n} at each of ${V.length} corners, each counted twice: ${deg} ÷ 2 = ${deg/2}`,13,C.ink);
  if(s.gray){const ok=walk.slice(1).every((g,i)=>D2_pop(g^walk[i])===1);out+=TF(300,362,`Green: the Gray-code walk through all ${walk.length} corners, ${ok?'one digit at a time':'—'}`,13,C.green)}
  else out+=D2_note('Rows: corners with the same number of 1s. Lines: strings that differ in one place.',362);
  return {svg:out,phase:`Flip each digit of ${D2_str(sv)} in turn and you reach its ${nbr.length} neighbours: ${nbr.map(i=>D2_str(V[i])).join(', ')}. The counts of corners at each distance, ${dist.join(', ')}, are the binomial numbers: to be d steps away, choose which d places to flip.${s.gray?' The Gray code changes one digit at each step, so it walks along edges and visits every corner once.':''}`};
 }});

// The tesseract (corners ±½) rotated in one 4D plane, then projected to 3D: drop w, or perspective from w = 2.
function D2_tessProj(s){const V=D2_cubeVerts(4).map(v=>v.map(b=>b-.5)),pl=s.plane==='yw'?1:0,a=s.ang*Math.PI/180;
 return V.map(v=>{const r=D2_rot(v,pl,3,a),k=s.mode==='persp'?2/(2-r[3]):1;return [r[0]*k,r[1]*k,r[2]*k]})}
SCENE({id:'building-cubes-projection',name:'Drawing what cannot be built',tag:'Every picture is a projection',
 definition:'A tesseract cannot be built in our space, but its shadow can. Drop the fourth coordinate and the two cubes it was slid between land exactly on top of each other. Turn it a little in four dimensions first, or use perspective so that the cube further away in the fourth direction looks smaller, and the familiar cube within a cube appears. The inner cube is not smaller in four dimensions: all eight cubes of the tesseract are identical, and the drawing distorts them.',
 example:'W. I. Stringham published the first drawings of four-dimensional polytopes in 1880. Every such drawing is a projection, a slice or an unfolding, never the object itself. Here every edge is 1 unit long in four dimensions, yet on screen the edges come out at many different lengths.',
 desc:'The tesseract, turned in the xw or yw plane by a chosen angle and projected to three dimensions by dropping w or by perspective, then drawn obliquely, with its edges coloured by direction and counts of distinct projected corners and edge lengths.',
 research:['Stringham (1880). Regular figures in n-dimensional space. American Journal of Mathematics 3, 1–14.','Hinton (1904). The Fourth Dimension. Swan Sonnenschein, London.'],
 dur:14,hint:'Turn the tesseract in the xw or yw plane and switch between dropping w and perspective. The counts show how much the projection hides or distorts. Switch to 3D to turn the projected shadow.',
 init:()=>({ang:20,mode:'persp',plane:'xw'}),
 watch:p=>({ang:p<.25?0:Math.round(90*smooth((p-.25)/.75)),mode:p<.12?'par':'persp',plane:'xw'}),
 ui:[{range:'ang',label:'Turn in 4D (degrees)',min:0,max:90,step:5,get:s=>s.ang,act:'ang'},{choose:[['par','Drop w (parallel)'],['persp','Perspective']],label:'Projection',get:s=>s.mode,act:'mode'},{choose:[['xw','xw plane'],['yw','yw plane']],label:'Turn in',get:s=>s.plane,act:'plane'}],
 on:{ang(s,v){s.ang=clamp(Math.round(+v),0,90)},mode(s,v){s.mode=v==='par'?'par':'persp'},plane(s,v){s.plane=v==='yw'?'yw':'xw'}},
 draw(s){
  const P3=D2_tessProj(s),E=D2_cubeEdges(4),V=D2_cubeVerts(4),vw=D2_view(),P2=P3.map(vw),fit=D2_fit(P2,40,56,340,270,140,D2_tessProj({...s,ang:0,mode:'persp'}).map(vw).concat(P2)),Q=P2.map(fit);
  let out=heading(s.mode==='par'&&s.ang===0?'Drop w: the two cubes coincide':s.mode==='persp'?'Perspective: a cube within a cube':`Turned ${s.ang}° in the ${s.plane} plane`);
  const order=E.map((e,i)=>({e,i,d:(P2[e[0]][2]+P2[e[1]][2])/2})).sort((a,b)=>a.d-b.d);
  for(const {e} of order){const ax=D2_axisOf(V,e[0],e[1]);out+=L(Q[e[0]][0],Q[e[0]][1],Q[e[1]][0],Q[e[1]][1],D2_AXCOL[ax],ax===3?2:2.6,ax===3?'stroke-dasharray="6 4"':'')}
  Q.forEach(q=>{out+=Ci(q[0],q[1],3.6,C.ink,'#fff')});
  const key=p=>p.map(x=>Math.round(x*1e6)).join(','),distinct=new Set(P3.map(key)).size,lens=E.map(e=>Math.sqrt(D2_dist2(P3[e[0]],P3[e[1]]))),len4=Math.sqrt(D2_dist2(V[E[0][0]],V[E[0][1]]));
  out+=D2_tile(410,56,170,'Corners in 4D',String(V.length),C.ink)+D2_tile(410,110,170,'Distinct corners in 3D',String(distinct),distinct<V.length?C.coral:C.blue);
  out+=D2_tile(410,164,170,'Edge length in 4D',fmt(len4),C.ink)+D2_tile(410,218,170,'Lengths in 3D (2 places)',`${D2_d2(Math.min(...lens))} to ${D2_d2(Math.max(...lens))}`,C.coral);
  out+=D2_legend(410,294,[[C.blue,'x edges'],[C.coral,'y edges']])+D2_legend(500,294,[[C.green,'z edges'],[C.purple,'w edges',1]]);
  out+=D2_note('A projection to 3D, drawn on the page. It is a shadow of the tesseract, not the tesseract.');
  const ph=s.mode==='par'&&s.ang===0?`Dropping the fourth coordinate sends each corner and its copy to the same point: only ${distinct} distinct corners are left and the 8 w-edges shrink to nothing. A shadow can hide most of a shape.`:
   s.mode==='par'?`Turned ${s.ang}° in the ${s.plane} plane before dropping w, the two cubes separate. All ${E.length} edges are ${fmt(len4)} long in 4D, but their shadows run from ${D2_d2(Math.min(...lens))} to ${D2_d2(Math.max(...lens))} (to 2 places).`:
   `In perspective the cube further along w looks smaller and sits inside. ${s.ang?`After a ${s.ang}° turn in the ${s.plane} plane the two cubes are distorted differently.`:'The inner cube is no smaller than the outer one in 4D.'} At 90° in the xw plane the inner and outer cubes have swapped places. Edge shadows run from ${D2_d2(Math.min(...lens))} to ${D2_d2(Math.max(...lens))}.`;
  return {svg:out,phase:ph};
 },
 three(s,f,X,project){
  const P3=D2_tessProj(s),E=D2_cubeEdges(4),V=D2_cubeVerts(4),Pr=project(P3.concat(D2_tessProj({...s,ang:0,mode:'persp'})));
  const items=E.map(e=>({at:P3[e[0]].map((x,i)=>(x+P3[e[1]][i])/2),svg:P=>{const ax=D2_axisOf(V,e[0],e[1]);return line3(P3[e[0]],P3[e[1]],P,D2_AXCOL[ax],ax===3?2:3,ax===3?'stroke-dasharray="6 4"':'')}}));
  P3.forEach(p=>items.push({at:p,svg:P=>point3(p,P,C.ink,4,'#fff')}));
  return {svg:sortedItems(items,Pr),title:'The tesseract’s shadow in 3D',caption:`The tesseract is turned ${s.ang}° in the ${s.plane} plane and projected to 3D (${s.mode==='par'?'dropping w':'perspective along w'}) by this scene’s own code. Dragging only turns the camera on that 3D shadow; it does not turn the tesseract in 4D.`};
 }});

/* ===================== Lesson: counting-parts ===================== */
const D2_sb=k=>String(k).replace('-','₋').split('').map(c=>c==='₋'?c:D2_SUB[+c]).join('');
const D2_SUP=['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'];
const D2_sp=k=>String(k).split('').map(c=>D2_SUP[+c]).join('');
const D2_KNAME=['corner','edge','square','cube','tesseract','5-cube','6-cube','7-cube','8-cube'];
const D2_KNAMES=['corners','edges','squares','cubes','tesseracts','5-cubes','6-cubes','7-cubes','8-cubes'];
function D2_facePic(n,hl,X0,Y0,W,H){ // hl: [{pat,col}] faces to emphasise; other edges light
 const V=D2_cubeVerts(n),E=D2_cubeEdges(n),raw=D2_cubeRaw(n,1),fit=D2_fit(raw,X0,Y0,W,H,150,raw.concat([[0,0]])),P=raw.map(fit);let out='';
 for(const [a,b] of E)out+=L(P[a][0],P[a][1],P[b][0],P[b][1],C.line,1.6);
 for(const h of hl){for(const [a,b] of E)if(D2_matches(V[a],h.pat)&&D2_matches(V[b],h.pat))out+=L(P[a][0],P[a][1],P[b][0],P[b][1],h.col,4.2);
  V.forEach((v,i)=>{if(D2_matches(v,h.pat))out+=Ci(P[i][0],P[i][1],5.5,h.col,'#fff')})}
 return {svg:out,P,V,E};
}
const D2_CP_WATCH=['0110','0*10','0**0','***0','****'];
SCENE({id:'counting-parts',name:'Choose which coordinates vary',tag:'One formula for every part',
 definition:'Every part of the n-cube is found by choosing which coordinates are free to vary. Mark a free place with ✱ and fix every other place at 0 or 1: the string 0✱1✱ picks out the square of the tesseract on which x₁ = 0 and x₃ = 1 while x₂ and x₄ vary. A part with k free places is a k-dimensional face. There are C(n, k) ways to choose the free places and 2 ways to fix each of the other n − k, so the n-cube has 2ⁿ⁻ᵏ · C(n, k) faces of dimension k.',
 example:`The tesseract has C(4, 0) · 2⁴ = ${D2_cubeFormula(4,0)} corners, C(4, 1) · 2³ = ${D2_cubeFormula(4,1)} edges, C(4, 2) · 2² = ${D2_cubeFormula(4,2)} squares, C(4, 3) · 2 = ${D2_cubeFormula(4,3)} cubes and one 4-dimensional face, itself. Listing the corners and grouping them gives the same ${D2_cubeFaceCount(4,0)}, ${D2_cubeFaceCount(4,1)}, ${D2_cubeFaceCount(4,2)} and ${D2_cubeFaceCount(4,3)}.`,
 desc:'A flat drawing of the n-cube with one face highlighted, the string of 0, 1 and ✱ that names the face, and counts of faces of the same dimension from the formula and from the generated corners.',
 research:['Coxeter (1948). Regular Polytopes. Methuen: the numbers of elements of the measure polytope γₙ.','Schläfli (written 1850–52, published 1901). Theorie der vielfachen Kontinuität: counts of the elements of the n-dimensional polytopes.'],
 dur:12,hint:'Press a place in the string to cycle it through 0, 1 and ✱ and watch the highlighted face change. Each ✱ adds a dimension to the face.',
 init:()=>({n:4,pat:['0','*','1','*']}),
 watch:p=>({n:4,pat:D2_CP_WATCH[Math.min(4,Math.floor(p*5))].split('')}),
 ui:[{range:'n',label:'Dimension n',min:1,max:4,get:s=>s.n,act:'n'},{b:'Free every place',act:'all'},{b:'Fix every place',act:'none'}],
 on:{n(s,v){const n=clamp(Math.round(+v),1,4);s.pat=range(n).map(i=>s.pat[i]||'0');s.n=n},cell(s,v){const i=clamp(Math.round(+v),0,s.n-1);s.pat[i]={'0':'1','1':'*','*':'0'}[s.pat[i]]},
  all(s){s.pat=s.pat.map(()=>'*')},none(s){s.pat=s.pat.map(()=>'0')}},
 draw(s,f,X){
  const n=s.n,pat=s.pat,k=pat.filter(c=>c==='*').length,pic=D2_facePic(n,[{pat,col:C.coral}],24,58,340,250),nv=pic.V.filter(v=>D2_matches(v,pat)).length;
  let out=heading(`${pat.map(c=>c==='*'?'✱':c).join('')} is ${k===n?'the whole '+n+'-cube':'a'+(k===1?'n ':' ')+D2_KNAME[k]} (${k}-face)`);
  out+=pic.svg;
  const cw=44,cx0=392;out+=TF(cx0,56,'Press a place to change it',13,C.muted,'start');
  pat.forEach((c,i)=>{const x=cx0+i*(cw+6),inner=R(x,66,cw,46,c==='*'?C.coralp:'#fff',c==='*'?C.coral:C.line,8)+TBF(x+cw/2,96,c==='*'?'✱':c,20,c==='*'?C.coral:C.ink);
   out+=hit(X,'cell',i,`Place ${i+1}: ${c==='*'?'free':c}. Press to change.`,inner)+TF(x+cw/2,128,D2_xi(i),13,C.muted)});
  out+=D2_tile(392,140,192,'Corners on this face',`${nv} = 2${D2_sp(k)}`,C.coral);
  out+=D2_tile(392,194,192,`Formula: ${D2_KNAMES[k]} of the ${n}-cube`,`C(${n},${k}) × 2${D2_sp(n-k)} = ${D2_cubeFormula(n,k)}`,C.blue);
  out+=D2_tile(392,248,192,'Counted from the corners',String(D2_cubeFaceCount(n,k)),C.green);
  out+=TF(300,326,`${k} free place${k===1?'':'s'} (✱): the face has dimension ${k}. ${n-k} fixed place${n-k===1?'':'s'}: 2${D2_sp(n-k)} = ${2**(n-k)} choices of 0s and 1s.`,13,C.ink);
  out+=D2_note('A flat drawing (projection) of the n-cube; the highlighted corners are those that match the string.',350);
  return {svg:out,phase:`The string ${pat.map(c=>c==='*'?'✱':c).join('')} has ${k} free place${k===1?'':'s'}, so it names a ${k}-dimensional face with ${nv} corners. To make another face like it, choose which ${k} of the ${n} places are free (${D2_binom(n,k)} ways) and fix the rest at 0 or 1 (${2**(n-k)} ways): ${D2_cubeFormula(n,k)} in all, matching the ${D2_cubeFaceCount(n,k)} found by grouping the ${2**n} corners.`};
 }});

// The table of face counts, n = 0…8: formula and count from the corner list, with the learner's predictions.
const D2_TB={x:96,dx:54,y:76,dy:23};
SCENE({id:'counting-parts-table',name:'The table, checked by counting',tag:'Predict the next row',
 definition:'Put the counts in a table: one row for each n, one column for each dimension k of face. Each entry is computed twice, from the formula 2ⁿ⁻ᵏ · C(n, k) and by listing all 2ⁿ corners and grouping them into faces, and a check mark shows where the two agree. The rows grow in a pattern you can learn to predict before you see them.',
 example:`Row 4 is ${range(5).map(k=>D2_cubeFormula(4,k)).join(', ')}: the tesseract’s corners, edges, squares, cubes and itself. Row 8 starts ${D2_num(D2_cubeFormula(8,0))}, ${D2_num(D2_cubeFormula(8,1))}, ${D2_num(D2_cubeFormula(8,2))}: the 8-cube has ${D2_num(D2_cubeFormula(8,2))} square faces.`,
 desc:'A table of the numbers of k-dimensional faces of the n-cube for n from 0 to 8, revealed one row at a time, with check marks where the formula agrees with a count from the generated corners, and the learner’s guesses beside the true values.',
 research:['Coxeter (1948). Regular Polytopes. Methuen: table of the numbers of elements of the regular polytopes in every dimension.','Grünbaum (1967). Convex Polytopes. Wiley: f-vectors, the lists (f₀, f₁, …) of face counts of a polytope.'],
 dur:12,hint:'Pick a column with the slider, type your guess for that entry of the next row, then reveal the row. Your guesses stay listed below.',
 init:()=>({rows:4,k:1,guess:'',log:[]}),
 watch:p=>({rows:Math.min(9,1+Math.floor(p*9.5)),k:1,guess:'',log:[]}),
 ui:[{range:'k',label:'Column k',min:0,max:8,get:s=>s.k,act:'k'},{text:'guess',label:'Your guess',get:s=>s.guess,act:'guess',max:6},{b:'Reveal the next row',act:'reveal'},{b:'Start again',act:'restart'}],
 on:{k(s,v){s.k=clamp(Math.round(+v),0,8)},guess(s,v){s.guess=String(v).replace(/[^0-9]/g,'').slice(0,6)},
  reveal(s){if(s.rows>=9)return;const n=s.rows,k=Math.min(s.k,n);if(s.guess!==''){s.log.push({n,k,g:+s.guess,t:D2_cubeFormula(n,k)});if(s.log.length>3)s.log.shift()}s.rows++;s.guess=''},
  restart(s){s.rows=1;s.log=[];s.guess=''}},
 draw(s,f,X){
  const {x,dx,y,dy}=D2_TB,nxt=s.rows,kk=Math.min(s.k,nxt);
  let out=heading(s.rows>=9?'All nine rows, n = 0 to 8':`Rows n = 0 to ${s.rows-1}: what comes next?`);
  out+=TF(26,y-14,'n',13,C.muted,'start');for(let k=0;k<=8;k++)out+=TBF(x+k*dx,y-14,'k='+k,13,C.muted);out+=TF(572,y-14,'check',13,C.muted);
  for(let n=0;n<=8;n++){const yy=y+n*dy+6,shown=n<s.rows;
   if(n%2===0)out+=R(18,yy-15,566,dy,'#f4f8fb','none',4);
   out+=TBF(30,yy,String(n),13,C.ink);
   for(let k=0;k<=n;k++){const fv=D2_cubeFormula(n,k);
    if(shown)out+=TMF(x+k*dx,yy,D2_num(fv),13,k===s.k?C.blue:C.ink);
    else if(n===nxt&&k===kk&&X&&X.try)out+=R(x+k*dx-25,yy-14,50,19,C.purplep,C.purple,4)+TMF(x+k*dx,yy,s.guess||'?',13,C.purple);
    else out+=TMF(x+k*dx,yy,'·',13,C.line)}
   if(shown){const agree=range(n+1).every(k=>D2_cubeFaceCount(n,k)===D2_cubeFormula(n,k));out+=TBF(572,yy,agree?'✓':'✗',14,agree?C.green:C.coral)}
  }
  const ly=y+9*dy+16;
  if(s.log.length)s.log.forEach((g,i)=>{const r=g.g===g.t;out+=TF(300,ly+i*18,`Row ${g.n}, k = ${g.k}: you guessed ${D2_num(g.g)}, the count is ${D2_num(g.t)} ${r?'✓':'(off by '+D2_num(Math.abs(g.g-g.t))+')'}`,13,r?C.green:C.coral)});
  else out+=TF(300,ly,'Each entry: 2ⁿ⁻ᵏ × C(n, k). Check: the same number from grouping the 2ⁿ corners.',13,C.muted)+TF(300,ly+18,'k = 0 corners, 1 edges, 2 squares, 3 cubes, 4 tesseracts, …',13,C.muted);
  const last=s.rows-1;
  return {svg:out,phase:s.rows>=9?`The 8-cube has ${range(9).map(k=>D2_num(D2_cubeFormula(8,k))).join(', ')} faces of dimensions 0 to 8, and every entry was confirmed by grouping its ${D2_num(256)} corners. Each row starts with a power of 2 and ends with 1, the cube itself.`:
   `Row ${last} reads ${range(last+1).map(k=>D2_num(D2_cubeFormula(last,k))).join(', ')}. ${X&&X.try?`Guess entry k = ${kk} of row ${nxt}, then reveal it.`:'Each row doubles the corners; the edges grow faster.'} A hint for guessing: each entry is twice the one above it plus the one above and to the left.`};
 }});

// Why the table grows: f_k(n) = 2·f_k(n−1) + f_(k−1)(n−1), read from the sliding picture.
function D2_recCats(n,k){const pats=D2_patterns(n,k),c={'0':[],'1':[],'*':[]};pats.forEach(p=>c[p[n-1]].push(p));return c}
SCENE({id:'counting-parts-recursion',name:'Why the table grows',tag:'The slide, counted',
 definition:'Each n-cube is an (n−1)-cube slid along a new direction, and every face of the result comes from that slide in one of three ways. It is a face of the original, a face of the moved copy, or it was swept out by a face one dimension lower as that face slid. So f_k(n) = 2 · f_k(n−1) + f_(k−1)(n−1), where f_k(n) is the number of k-faces of the n-cube. In the string picture the three kinds are the faces whose last place is 0, 1 or ✱.',
 example:`The tesseract’s ${D2_cubeFormula(4,1)} edges: ${D2_cubeFormula(3,1)} in the original cube, ${D2_cubeFormula(3,1)} in the copy and ${D2_cubeFormula(3,0)} swept out by the cube’s corners. Adding the faces of every dimension, including the cube itself, gives 3ⁿ, because each place in the string is 0, 1 or ✱: ${range(5).map(k=>D2_cubeFormula(4,k)).join(' + ')} = ${3**4} = 3⁴.`,
 desc:'A flat drawing of the n-cube with its edges coloured by where they came from in the slide (original, copy, swept), one example k-face of each kind emphasised, and counts of each kind beside the recurrence.',
 research:['Coxeter (1948). Regular Polytopes. Methuen: the measure polytope built by moving γₙ₋₁, from which its element numbers follow.'],
 dur:12,hint:'Choose the dimension n and the face dimension k. The three tiles count the faces of each kind by listing strings; their total matches the table.',
 init:()=>({n:4,k:2}),
 watch:p=>({n:4,k:Math.min(4,Math.floor(p*5))}),
 ui:[{range:'n',label:'Dimension n',min:1,max:6,get:s=>s.n,act:'n'},{range:'k',label:'Face dimension k',min:0,max:6,get:s=>s.k,act:'k'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),1,6);s.k=Math.min(s.k,s.n)},k(s,v){s.k=clamp(Math.round(+v),0,s.n)}},
 draw(s){
  const n=s.n,k=Math.min(s.k,n),cats=D2_recCats(n,k),pick=a=>a.length?[a[Math.floor((a.length-1)/2)]]:[];
  const hl=[...pick(cats['0']).map(p=>({pat:p,col:C.blue})),...pick(cats['1']).map(p=>({pat:p,col:C.coral})),...pick(cats['*']).map(p=>({pat:p,col:C.green}))];
  const V=D2_cubeVerts(n),E=D2_cubeEdges(n),raw=D2_cubeRaw(n,1),fit=D2_fit(raw,20,56,300,236,150,raw.concat([[0,0]])),P=raw.map(fit);
  let out=heading(`${D2_KNAMES[k][0].toUpperCase()+D2_KNAMES[k].slice(1)} of the ${n}-cube: ${cats['0'].length} + ${cats['1'].length} + ${cats['*'].length} = ${cats['0'].length+cats['1'].length+cats['*'].length}`);
  for(const [a,b] of E){const ax=D2_axisOf(V,a,b),col=ax===n-1?C.green:V[a][n-1]?C.coral:C.blue;out+=L(P[a][0],P[a][1],P[b][0],P[b][1],tint(col,.55),1.6,ax===n-1?'stroke-dasharray="5 4"':'')}
  for(const h of hl){for(const [a,b] of E)if(D2_matches(V[a],h.pat)&&D2_matches(V[b],h.pat))out+=L(P[a][0],P[a][1],P[b][0],P[b][1],h.col,4.2);V.forEach((v,i)=>{if(D2_matches(v,h.pat))out+=Ci(P[i][0],P[i][1],5,h.col,'#fff')})}
  const lab=p=>p.map(c=>c==='*'?'✱':c).join('');
  out+=D2_tile(340,52,244,'In the original: last place 0',`${cats['0'].length} = f${D2_sb(k)}(${n-1})${cats['0'].length?'  e.g. '+lab(pick(cats['0'])[0]):''}`,C.blue);
  out+=D2_tile(340,106,244,'In the copy: last place 1',`${cats['1'].length} = f${D2_sb(k)}(${n-1})${cats['1'].length?'  e.g. '+lab(pick(cats['1'])[0]):''}`,C.coral);
  out+=D2_tile(340,160,244,`Swept out: last place ✱`,`${cats['*'].length} = f${D2_sb(k-1)}(${n-1})${cats['*'].length?'  e.g. '+lab(pick(cats['*'])[0]):''}`,C.green);
  out+=D2_tile(340,214,244,`All ${k}-faces (table: ${D2_cubeFormula(n,k)})`,String(cats['0'].length+cats['1'].length+cats['*'].length),C.ink);
  const fk1=k>0?D2_cubeFormula(n-1,k-1):0;
  out+=TF(300,314,`f${D2_sb(k)}(${n}) = 2 × f${D2_sb(k)}(${n-1}) + f${D2_sb(k-1)}(${n-1}) = 2 × ${D2_cubeFormula(n-1,k)} + ${fk1} = ${2*D2_cubeFormula(n-1,k)+fk1}`,14,C.ink);
  out+=TF(300,336,`Every dimension together: ${range(n+1).map(j=>D2_cubeFormula(n,j)).join(' + ')} = ${D2_num(sum(range(n+1).map(j=>D2_cubeFormula(n,j))))} = 3${D2_sp(n)}`,13,C.muted);
  out+=D2_note('Pale: blue original, red copy, dashed green swept. Bold: one of each kind.',360);
  return {svg:out,phase:`Of the ${D2_cubeFormula(n,k)} ${D2_KNAMES[k]} of the ${n}-cube, ${cats['0'].length} lie in the original ${n-1}-cube, ${cats['1'].length} in its moved copy, and ${cats['*'].length} were swept out by the ${D2_KNAMES[Math.max(0,k-1)]} of the ${n-1}-cube as it slid${k===0?' (none: a corner is not swept out by anything smaller)':''}. Counting strings over 0, 1 and ✱ gives 3${D2_sp(n)} = ${D2_num(3**n)} faces in all.`};
 }});

/* ===================== Lesson: simplex-cross ===================== */
const D2_SXNAME=['a point','a segment','a triangle','a tetrahedron','the 5-cell','the 5-simplex','the 6-simplex','the 7-simplex'];
const D2_CXNAME=['a point','a segment','a square','an octahedron','the 16-cell','the 5-dimensional cross-polytope','the 6-dimensional cross-polytope'];
const D2_ring=(m,i,r,cx=190,cy=184)=>{const a=-Math.PI/2+i*2*Math.PI/Math.max(1,m);return [cx+r*Math.cos(a),cy+r*Math.sin(a)]};
// A small table of face counts: formula beside a count from the generated corners.
function D2_countTable(x,y,rows,head){let o=TF(x,y,head[0],13,C.muted,'start')+TF(x+92,y,head[1],13,C.muted)+TF(x+160,y,head[2],13,C.muted);
 rows.forEach((r,i)=>{const yy=y+20+i*19;o+=TF(x,yy,r[0],13,C.ink,'start')+TMF(x+92,yy,D2_num(r[1]),13,C.blue)+TMF(x+160,yy,D2_num(r[2]),13,r[1]===r[2]?C.green:C.coral)+TF(x+196,yy,r[1]===r[2]?'✓':'✗',13,r[1]===r[2]?C.green:C.coral)});return o}
function D2_simplexState(p){const k=Math.min(5,Math.floor(p*5)+1);return {n:k,t:p>=1?1:smooth((p*5-(k-1))/.7)}}
SCENE({id:'simplex-cross',name:'The simplex: a new corner joined to all',tag:'Triangle, tetrahedron, 5-cell',
 definition:'Start with a point. Add a second point and join it to the first: a segment. Add a third joined to both: a triangle. A fourth, off the plane and joined to all three: a tetrahedron. In four dimensions a fifth corner, joined to all four, makes the 5-cell. The n-simplex has n + 1 corners, every pair joined by an edge, and any k + 1 of its corners span a k-dimensional face, so it has C(n + 1, k + 1) faces of dimension k.',
 example:`The 5-cell has ${D2_simplexFaceCount(4,0)} corners, ${D2_simplexFaceCount(4,1)} edges, ${D2_simplexFaceCount(4,2)} triangles and ${D2_simplexFaceCount(4,3)} tetrahedra, counted by listing every set of corners and checking the dimension it spans. Each new corner joins every old face to make a face one dimension higher, so the counts grow like Pascal’s triangle.`,
 desc:'The corners of the n-simplex drawn round a circle with every pair joined, a new corner sliding in and joined to all the old ones, and a table of face counts from the formula and from listing sets of corners.',
 research:['Schläfli (written 1850–52, published 1901). Theorie der vielfachen Kontinuität: the simplest polytope in each dimension.','Coxeter (1948). Regular Polytopes. Methuen: the regular simplex αₙ.'],
 dur:14,hint:'Press Add a corner and watch it join everything already there. The table checks C(n+1, k+1) against a count of the sets of corners.',
 init:()=>({n:3,t:1}),
 watch:D2_simplexState,
 ui:[{range:'n',label:'Dimension n',min:0,max:7,get:s=>s.n,act:'n'},{b:'Add a corner ▶',act:'add'},{b:'Remove a corner',act:'remove'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),0,7);s.t=1},add(s,_,ctx){s.n=s.n>=7?0:s.n+1;s.t=0;ctx.every(60,'grow');return 'keep'},remove(s){s.n=Math.max(0,s.n-1);s.t=1},grow(s){s.t=Math.min(1,s.t+.04);return s.t>=1?'stop':'keep'}},
 draw(s){
  const n=s.n,t=s.t,m=n+1,pos=range(m).map(i=>{if(i<n){const a=D2_ring(n,i,118),b=D2_ring(m,i,118);return [lerp(a[0],b[0],t),lerp(a[1],b[1],t)]}const b=D2_ring(m,i,118),c=D2_ring(m,i,160);return n===0?[190,184]:[lerp(c[0],b[0],t),lerp(c[1],b[1],t)]});
  let out=heading(n===0?'One corner: a point':`${n+1} corners, all joined: ${D2_SXNAME[n]}`);
  for(let i=0;i<m;i++)for(let j=i+1;j<m;j++){const nw=j===n&&n>0;out+=L(pos[i][0],pos[i][1],pos[j][0],pos[j][1],nw?C.green:C.blue,nw?2.6:2,nw&&t<1?'stroke-dasharray="6 4"':'')}
  pos.forEach((p,i)=>{out+=Ci(p[0],p[1],7,i===n&&n>0?C.green:C.blue,'#fff')+TF(p[0]+(p[0]>190?14:-14),Math.min(322,p[1]+(p[1]>184?16:-8)),String(i),13,C.muted,p[0]>190?'start':'end')});
  const rows=range(n+1).map(k=>[k===0?'corners':k===1?'edges':k===2?'triangles':k===3?'tetrahedra':k+'-faces',D2_simplexFormula(n,k),D2_simplexFaceCount(n,k)]).slice(0,Math.min(n+1,8));
  out+=D2_countTable(372,62,rows,['k-faces','C(n+1,k+1)','counted']);
  const P=D2_simplexCoords(n);if(n>0){const ds=[];for(let i=0;i<=n;i++)for(let j=i+1;j<=n;j++)ds.push(Math.sqrt(D2_dist2(P[i],P[j])));
   out+=TF(372,262,`Edge lengths in ${n}D coordinates:`,13,C.muted,'start')+TF(372,280,`all ${ds.length} between ${D2_d2(Math.min(...ds))} and ${D2_d2(Math.max(...ds))}`,13,C.ink,'start')}
  if(n>0)out+=TF(300,346,`New edges: the new corner joins all ${n} old ones, so ${D2_simplexFormula(n-1,1)} + ${n} = ${D2_simplexFormula(n,1)} edges.`,13,C.green);
  out+=D2_note('Corners round a circle (a projection); in n dimensions all edges are equal.',368);
  return {svg:out,phase:n===0?'A single point is the 0-simplex. Add a corner and join it to the point to make a segment.':`${D2_SXNAME[n][0].toUpperCase()+D2_SXNAME[n].slice(1)} has ${n+1} corners and ${D2_simplexFormula(n,1)} edges. The new corner ${t<1?'is joining':'joined'} each of the ${n} old corners, and each old face, joined to it, became a new face one dimension higher. In ${n} dimensions all its edges are equally long, which a flat drawing cannot show${n>2?'':' beyond the triangle'}.`};
 }});

function D2_crossPos(n,t,R=118,cx=190,cy=184){const out=[];for(let i=0;i<n;i++){const a0=n>1?i*Math.PI/(n-1):0,a1=i*Math.PI/n,a=i<n-1?lerp(a0,a1,t):a1,r=i===n-1?R*t:R;for(const sg of [1,-1])out.push([cx+sg*r*Math.cos(a),cy-sg*r*Math.sin(a)])}return out}
SCENE({id:'simplex-cross-cross',name:'The cross-polytope: a pair on a new axis',tag:'Square, octahedron, 16-cell',
 definition:'Put a pair of corners on each axis, one unit either side of the centre, at ±e₁, ±e₂, …, ±eₙ, and join every corner to every other except its opposite partner. In two dimensions this is a square standing on a corner, in three the octahedron, in four the 16-cell. The cross-polytope has 2n corners, and a set of k + 1 corners spans a face exactly when it holds no opposite pair, which gives 2ᵏ⁺¹ · C(n, k + 1) faces of dimension k.',
 example:`The 16-cell has ${D2_crossFaceCount(4,0)} corners, ${D2_crossFaceCount(4,1)} edges, ${D2_crossFaceCount(4,2)} triangles and ${D2_crossFaceCount(4,3)} tetrahedral cells. Joined corners are √2 = ${D2_d2(Math.sqrt(D2_dist2(D2_crossCoords(4)[0],D2_crossCoords(4)[2])))} apart and opposite ones ${fmt(Math.sqrt(D2_dist2(D2_crossCoords(4)[0],D2_crossCoords(4)[1])))} apart, so the edges are exactly the nearest pairs.`,
 desc:'The cross-polytope’s corners drawn as pairs on n axes through a centre, a new pair growing out along a new axis and joined to every old corner, and a table of face counts from the formula and from listing sets of corners.',
 research:['Coxeter (1948). Regular Polytopes. Methuen: the cross polytope βₙ, the dual of the measure polytope.','Schläfli (written 1850–52, published 1901). Theorie der vielfachen Kontinuität.'],
 dur:14,hint:'Press Add an axis and watch the new pair grow out of the centre, joined to all the old corners but not to each other.',
 init:()=>({n:3,t:1}),
 watch:p=>{const s=D2_simplexState(p);return s},
 ui:[{range:'n',label:'Dimension n',min:1,max:6,get:s=>s.n,act:'n'},{b:'Add an axis ▶',act:'add'},{b:'Remove an axis',act:'remove'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),1,6);s.t=1},add(s,_,ctx){s.n=s.n>=6?1:s.n+1;s.t=0;ctx.every(60,'grow');return 'keep'},remove(s){s.n=Math.max(1,s.n-1);s.t=1},grow(s){s.t=Math.min(1,s.t+.04);return s.t>=1?'stop':'keep'}},
 draw(s){
  const n=s.n,t=s.t,pos=D2_crossPos(n,t),P=D2_crossCoords(n),m=2*n;
  let out=heading(`${2*n} corners on ${n} ax${n===1?'is':'es'}: ${D2_CXNAME[n]}`);
  for(let i=0;i<n;i++)out+=L(pos[2*i][0],pos[2*i][1],pos[2*i+1][0],pos[2*i+1][1],C.grid,1.4,'stroke-dasharray="3 5"');
  let joined=0,opp=0;const dj=[],dop=[];
  for(let a=0;a<m;a++)for(let b=a+1;b<m;b++){const d=Math.sqrt(D2_dist2(P[a],P[b]));if(Math.floor(a/2)===Math.floor(b/2)){opp++;dop.push(d);continue}joined++;dj.push(d);
   const nw=Math.floor(b/2)===n-1&&n>1;out+=L(pos[a][0],pos[a][1],pos[b][0],pos[b][1],nw?C.green:C.blue,nw?2.4:2,nw&&t<1?'stroke-dasharray="6 4"':'')}
  pos.forEach((p,i)=>{const nw=Math.floor(i/2)===n-1&&n>1;out+=Ci(p[0],p[1],7,nw?C.green:C.blue,'#fff')+((nw||n===1)&&t<.4?'':TF(p[0]+(p[0]>=190?12:-12),p[1]+(p[1]>184?17:-9),(i%2?'−':'+')+'e'+D2_SUB[Math.floor(i/2)+1],13,C.muted,p[0]>=190?'start':'end'))});
  const rows=range(n).map(k=>[k===0?'corners':k===1?'edges':k===2?'triangles':k===3?'tetrahedra':k+'-faces',D2_crossFormula(n,k),D2_crossFaceCount(n,k)]);
  out+=D2_countTable(372,62,rows,['k-faces','2ᵏ⁺¹C(n,k+1)','counted']);
  if(n>1)out+=TF(372,250,`Joined pairs: ${joined}, all ${D2_d2(Math.min(...dj))} apart`,13,C.ink,'start')+TF(372,268,`Opposite pairs: ${opp}, all ${D2_d2(Math.min(...dop))} apart`,13,C.ink,'start')+TF(372,286,'(distances to 2 places)',13,C.muted,'start');
  if(n>1)out+=TF(300,346,`New edges: each new corner joins all ${2*(n-1)} old ones, so ${D2_crossFormula(n-1,1)} + 2 × ${2*(n-1)} = ${D2_crossFormula(n,1)} edges.`,13,C.green);
  out+=D2_note('Axes spread round the centre (a projection). Dotted: opposite, not joined.',368);
  return {svg:out,phase:n===1?'One axis gives two corners, +e₁ and −e₁: a segment. Add a second axis to make a square standing on its corner.':`${D2_CXNAME[n][0].toUpperCase()+D2_CXNAME[n].slice(1)} has ${2*n} corners and ${D2_crossFormula(n,1)} edges. Every corner is joined to all the others except its opposite partner, which is further away (${D2_d2(Math.min(...dop))} against ${D2_d2(Math.min(...dj))}). A set of corners with no opposite pair spans a face, which is how the table is counted.`};
 }});

// Duality: the centres of the n-cube's 2n facets are the corners of a cross-polytope.
SCENE({id:'simplex-cross-dual',name:'Cube and cross-polytope are duals',tag:'Swap corners for facets',
 definition:'Mark the centre of every facet of the n-cube, the (n−1)-dimensional faces it is bounded by. There are 2n facets, one on each side of each axis, and their centres sit at ±½ along each axis from the cube’s centre: the corners of a cross-polytope. Join two centres when their facets meet. This is duality: the dual swaps corners with facets and reverses the whole list of face counts. The simplex is its own dual.',
 example:`The cube has ${D2_cubeFormula(3,0)} corners, ${D2_cubeFormula(3,1)} edges and ${D2_cubeFormula(3,2)} faces; its dual, the octahedron, has ${D2_crossFaceCount(3,0)} corners, ${D2_crossFaceCount(3,1)} edges and ${D2_crossFaceCount(3,2)} faces: the same numbers in reverse order. The tesseract (${range(4).map(k=>D2_cubeFormula(4,k)).join(', ')}) and the 16-cell (${range(4).map(k=>D2_crossFaceCount(4,k)).join(', ')}) are duals in the same way.`,
 desc:'A flat drawing of the n-cube with the centres of its facets marked and joined into a cross-polytope, one facet highlighted, and a table comparing the cube’s face counts with the cross-polytope’s in reverse order.',
 research:['Coxeter (1948). Regular Polytopes. Methuen: reciprocal (dual) polytopes; the measure polytope γₙ and cross polytope βₙ are reciprocal, and the simplex αₙ is self-reciprocal.'],
 dur:12,hint:'Press a facet centre (red dot) to see which facet of the cube it stands for. Change n and compare the two columns of the table.',
 init:()=>({n:3,sel:0}),
 watch:p=>({n:p<.6?3:4,sel:Math.floor(p*10)%(p<.6?6:8)}),
 ui:[{range:'n',label:'Dimension n',min:2,max:6,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),2,6);s.sel=Math.min(s.sel,2*s.n-1)},sel(s,v){s.sel=clamp(Math.round(+v),0,2*s.n-1)}},
 draw(s,f,X){
  const n=s.n,V=D2_cubeVerts(n),E=D2_cubeEdges(n),mapRaw=x=>{let a=0,b=0;x.forEach((c,i)=>{a+=c*D2_AX[i][0];b+=c*D2_AX[i][1]});return [a,b]};
  const cen=range(2*n).map(j=>range(n).map(i=>i===Math.floor(j/2)?j%2:.5)),raw=V.map(mapRaw),fit=D2_fit(raw,22,54,330,250,150,raw.concat([[0,0]])),P=raw.map(fit),Q=cen.map(c=>fit(mapRaw(c)));
  const ax=Math.floor(s.sel/2),val=s.sel%2,pat=range(n).map(i=>i===ax?String(val):'*');
  let out=heading(`${2*n} facets of the ${n}-cube → ${2*n} corners of ${D2_CXNAME[n]}`);
  for(const [a,b] of E){const on=D2_matches(V[a],pat)&&D2_matches(V[b],pat);out+=L(P[a][0],P[a][1],P[b][0],P[b][1],on?C.blue:C.line,on?3.4:1.6)}
  for(let a=0;a<2*n;a++)for(let b=a+1;b<2*n;b++)if(Math.floor(a/2)!==Math.floor(b/2))out+=L(Q[a][0],Q[a][1],Q[b][0],Q[b][1],tint(C.coral,.35),1.4);
  Q.forEach((q,j)=>{out+=hit(X,'sel',j,`Centre of the facet ${D2_xi(Math.floor(j/2))} = ${j%2}. Press to show it.`,Ci(q[0],q[1],j===s.sel?8:5.5,C.coral,'#fff'))});
  const c=cen[s.sel].map(x=>x===.5?'½':String(x)),d=cen[s.sel].map(x=>x===.5?'0':x?'½':'−½');
  out+=TF(26,322,`Facet ${D2_xi(ax)} = ${val}: centre (${c.join(', ')})`,13,C.ink,'start')+TF(26,340,`minus the cube’s centre: (${d.join(', ')})`,13,C.coral,'start');
  const rows=range(n).map(k=>[`k = ${k}`,D2_cubeFaceCount(n,k),D2_crossFaceCount(n,n-1-k)]);
  out+=TF(372,62,'k',13,C.muted,'start')+TF(456,62,'cube fₖ',13,C.muted)+TF(538,62,`cross f${D2_sb(n-1)}₋ₖ`,13,C.muted);
  rows.forEach((r,i)=>{const yy=82+i*19;out+=TF(372,yy,r[0],13,C.ink,'start')+TMF(456,yy,D2_num(r[1]),13,C.blue)+TMF(538,yy,D2_num(r[2]),13,C.coral)+TF(586,yy,r[1]===r[2]?'✓':'✗',13,r[1]===r[2]?C.green:C.coral)});
  const SP=D2_simplexCoords(n),fc=range(n+1).map(i=>D2_mean(SP.filter((_,j)=>j!==i))),ds=[];for(let i=0;i<=n;i++)for(let j=i+1;j<=n;j++)ds.push(Math.sqrt(D2_dist2(fc[i],fc[j])));
  out+=TF(372,224,`The ${n}-simplex’s ${n+1} facet centres:`,13,C.muted,'start')+TF(372,242,`${ds.length} distances, ${D2_d2(Math.min(...ds))} to ${D2_d2(Math.max(...ds))}:`,13,C.ink,'start')+TF(372,260,'another regular simplex',13,C.ink,'start');
  out+=D2_note('Blue: the chosen facet. Red: facet centres, joined when their facets meet.',366);
  return {svg:out,phase:`The facet where ${D2_xi(ax)} = ${val} is ${n===2?'an edge':n===3?'a square':'a '+(n-1)+'-cube'}; its centre lies ½ from the cube’s centre along ${D2_xi(ax)}. All ${2*n} centres together are the corners of ${D2_CXNAME[n]}. The cube’s counts ${range(n).map(k=>D2_cubeFormula(n,k)).join(', ')} read backwards are the cross-polytope’s, because each k-face of the cube becomes a (${n-1}−k)-face of its dual.`};
 }});

/* ===================== Lesson: regular-polytopes ===================== */
// The angle of a regular p-gon, computed from its corners on a circle (dot product of the two edges at a corner).
const D2_polyAngle=p=>{const c=range(p).map(i=>[Math.cos(2*Math.PI*i/p),Math.sin(2*Math.PI*i/p)]);return D2_deg(D2_angle(D2_sub(c[1],c[0]),D2_sub(c[p-1],c[0])))};
const D2_test3=(p,q)=>{const a=D2_polyAngle(p),t=q*a;return {a,t,v:t<360-1e-9?'solid':Math.abs(t-360)<1e-9?'flat':'over'}};
const D2_surv3=()=>D2_memo('surv3',()=>{const out=[];for(let p=3;p<=8;p++)for(let q=3;q<=8;q++)if(D2_test3(p,q).v==='solid')out.push(p+','+q);return out});
const D2_name3=k=>(D2_SOLIDS.find(s=>s.key===k)||{}).name;
const D2_plural3=n=>/hedron$/.test(n)?n.replace(/on$/,'a'):n+'s';
function D2_fan(p,q,cx,cy,a){const al=D2_polyAngle(p),b0=-90-Math.min(q*al,400)/2;let out='';
 const tot=q*al;if(tot<360-1e-9){const r=a*.9,s0=(b0+tot)*Math.PI/180,s1=(b0+360)*Math.PI/180,big=(360-tot)>180?1:0;
  out+=P(`M${fmt(cx)} ${fmt(cy)} L${fmt(cx+r*Math.cos(s0))} ${fmt(cy+r*Math.sin(s0))} A${r} ${r} 0 ${big} 1 ${fmt(cx+r*Math.cos(s1))} ${fmt(cy+r*Math.sin(s1))} Z`,C.amber,1.5,C.amberp)}
 for(let k=0;k<q;k++){let h=b0+k*al,x=cx,y=cy;const pts=[[x,y]];for(let i=1;i<p;i++){x+=a*Math.cos(h*Math.PI/180);y+=a*Math.sin(h*Math.PI/180);pts.push([x,y]);h+=360/p}
  const over=(k+1)*al>360+1e-9,flat=Math.abs(tot-360)<1e-9;
  out+=`<polygon points="${pts.map(q=>fmt(q[0])+','+fmt(q[1])).join(' ')}" fill="${over?C.coralp:flat?C.greenp:C.pale}" fill-opacity="${over?.75:.9}" stroke="${over?C.coral:flat?C.green:C.blue}" stroke-width="2"/>`}
 return out+Ci(cx,cy,4.5,C.ink)}
SCENE({id:'regular-polytopes',name:'Corners that fold up: the Platonic solids',tag:'Euclid’s count',
 definition:`A polyhedron is regular when its faces are identical regular polygons and the same number of them meet at every corner. Write {p, q} for one with p-sided faces, q at each corner; this shorthand is Schläfli’s. At a corner the face angles must add up to less than 360°: exactly 360° lies flat, and more cannot fit. A regular p-gon has angles of 180° − 360°/p, and only ${D2_surv3().length} pairs pass the test: ${D2_surv3().map(D2_symStr).join(', ')}. Euclid’s Elements ends, in Book XIII, by showing there is no sixth regular solid.`,
 example:`Squares have ${fmt(D2_polyAngle(4))}° corners, so three at a corner leave a gap of ${fmt(360-3*D2_polyAngle(4))}°, which folds shut into the cube; four lie flat as a square tiling. Pentagons (${fmt(D2_polyAngle(5))}°) fit three at a corner, giving the dodecahedron. Hexagons (${fmt(D2_polyAngle(6))}°) already lie flat three at a time, so no regular solid has faces with six or more sides.`,
 desc:'A fan of q regular p-gons laid round one corner, with the gap that must fold shut shaded or the overlap shown in red, beside a grid of all choices of p and q from 3 to 6 marked solid, flat or impossible.',
 research:['Euclid (about 300 BCE). Elements, Book XIII: constructions of the five regular solids and the proof that there are no others.','Schläfli (written 1850–52, published 1901). Theorie der vielfachen Kontinuität: the symbols {p, q, …}.'],
 dur:12,hint:'Choose the polygon (p sides) and how many meet at a corner (q), or press a cell of the grid. A gap folds up into a solid; no gap lies flat; overlap is impossible.',
 init:()=>({p:5,q:3}),
 watch:p=>{const seq=[[3,3],[3,4],[3,5],[3,6],[4,3],[4,4],[5,3],[6,3]],k=Math.min(seq.length-1,Math.floor(p*seq.length));return {p:seq[k][0],q:seq[k][1]}},
 ui:[{range:'p',label:'Sides of each face, p',min:3,max:8,get:s=>s.p,act:'p'},{range:'q',label:'Faces at a corner, q',min:3,max:6,get:s=>s.q,act:'q'}],
 on:{p(s,v){s.p=clamp(Math.round(+v),3,8)},q(s,v){s.q=clamp(Math.round(+v),3,6)},pick(s,v){const [p,q]=String(v).split(',').map(Number);s.p=clamp(p||3,3,8);s.q=clamp(q||3,3,6)}},
 draw(s,f,X){
  const {p,q}=s,T3=D2_test3(p,q),key=p+','+q;
  let out=heading(T3.v==='solid'?`{${p},${q}}: a gap of ${D2_d1(360-T3.t)}° folds up into the ${D2_name3(key)}`:T3.v==='flat'?`{${p},${q}}: exactly 360°, it lies flat`:`{${p},${q}}: ${D2_d1(T3.t)}° is too much to fit`);
  out+=D2_fan(p,q,190,206,{3:100,4:84,5:68,6:58,7:50,8:44}[p]);
  out+=TF(26,348,`Each angle 180° − 360°/${p} = ${D2_d1(T3.a)}°; ${q} of them: ${D2_d1(T3.t)}° (1 place)`,13,C.ink,'start');
  // grid of choices
  const gx=402,gy=74,cw=44,ch=34;out+=TF(gx+2*cw,gy-26,'q faces at a corner →',13,C.muted);
  for(let qq=3;qq<=6;qq++)out+=TBF(gx+(qq-3)*cw+cw/2,gy-6,String(qq),13,C.muted);
  for(let pp=3;pp<=6;pp++){out+=TBF(gx-14,gy+(pp-3)*ch+ch/2+5,String(pp),13,C.muted);
   for(let qq=3;qq<=6;qq++){const v=D2_test3(pp,qq).v,cur=pp===p&&qq===q,x=gx+(qq-3)*cw,y=gy+(pp-3)*ch;
    const inner=R(x+2,y+2,cw-4,ch-4,v==='solid'?C.greenp:v==='flat'?C.amberp:'#fff',cur?C.ink:C.grid,6)+TBF(x+cw/2,y+ch/2+5,v==='solid'?'✓':v==='flat'?'flat':'✗',13,v==='solid'?C.green:v==='flat'?C.amber:C.coral);
    out+=hit(X,'pick',pp+','+qq,`p = ${pp}, q = ${qq}: ${v==='solid'?'a solid':v==='flat'?'flat':'impossible'}. Press to show.`,inner)}}
  out+=TF(gx-30,gy+2*ch,'p',13,C.muted,'end');
  if(T3.v==='solid'){const L=D2_lat(key);out+=D2_tile(402,226,176,`The ${D2_name3(key)} (computed)`,`V ${L.f[0]}, E ${L.f[1]}, F ${L.f[2]}`,C.green)+TF(490,292,`symbol read back: {${D2_symbolOf(L).join(',')}}`,13,C.muted)}
  else out+=D2_tile(402,226,176,'No regular solid',T3.v==='flat'?'a flat tiling':'cannot close',T3.v==='flat'?C.amber:C.coral);
  out+=D2_note('Flattened corner: the faces round one corner laid out in the plane.',372);
  return {svg:out,phase:T3.v==='solid'?`${q} regular ${p}-gons at a corner leave a gap of ${D2_d1(360-T3.t)}°. Close the gap and the corner rises into a solid angle; repeat at every corner and the faces close up into the ${D2_name3(key)}, with ${D2_lat(key).f.join(', ')} corners, edges and faces counted from its coordinates.`:
   T3.v==='flat'?`${q} angles of ${D2_d1(T3.a)}° make exactly 360°, so the faces lie flat and tile the plane without ever closing up.`:`${q} angles of ${D2_d1(T3.a)}° make ${D2_d1(T3.t)}°, more than a full turn: the faces overlap and cannot meet round a corner.`};
 }});

// Schläfli's test in four dimensions: r cells {p,q} round an edge need r × (dihedral angle of {p,q}) < 360°.
const D2_dih3=k=>D2_memo('dih'+k,()=>D2_deg(D2_dihedral(D2_lat(k))));
const D2_cands4=()=>D2_memo('c4',()=>{const S=D2_surv3(),out=[];for(const a of S)for(const b of S){const [p,q]=a.split(',').map(Number),[q2,r]=b.split(',').map(Number);if(q===q2)out.push([p,q,r])}return out.sort((x,y)=>x[0]-y[0]||x[1]-y[1]||x[2]-y[2])});
function D2_test4(p,q,r){const cell=p+','+q,vf=q+','+r,okC=D2_surv3().includes(cell),okV=D2_surv3().includes(vf);if(!okC||!okV)return {okC,okV};
 const th=D2_dih3(cell),t=r*th;return {okC,okV,th,t,v:t<360-1e-9?'yes':Math.abs(t-360)<1e-9?'flat':'no'}}
function D2_wedges(n,th,cx,cy,r){let out='',a0=-90;const tot=n*th;
 if(tot<360-1e-9){const s0=(a0+tot)*Math.PI/180,s1=(a0+360)*Math.PI/180;out+=P(`M${fmt(cx)} ${fmt(cy)} L${fmt(cx+r*Math.cos(s0))} ${fmt(cy+r*Math.sin(s0))} A${r} ${r} 0 ${360-tot>180?1:0} 1 ${fmt(cx+r*Math.cos(s1))} ${fmt(cy+r*Math.sin(s1))} Z`,C.amber,1.5,C.amberp)}
 for(let k=0;k<n;k++){const rr=r-(k*th>=360-1e-9?16:0),s0=(a0+k*th)*Math.PI/180,s1=(a0+(k+1)*th)*Math.PI/180,over=(k+1)*th>360+1e-9;
  out+=P(`M${fmt(cx)} ${fmt(cy)} L${fmt(cx+rr*Math.cos(s0))} ${fmt(cy+rr*Math.sin(s0))} A${rr} ${rr} 0 0 1 ${fmt(cx+rr*Math.cos(s1))} ${fmt(cy+rr*Math.sin(s1))} Z`,over?C.coral:C.blue,2,over?C.coralp:k%2?'#d4e6f3':C.pale,over?'fill-opacity=".8"':'')}
 return out+Ci(cx,cy,5,C.ink)}
SCENE({id:'regular-polytopes-schlafli',name:'Schläfli’s test in four dimensions',tag:'Angles round an edge, 1852',
 definition:'In four dimensions a regular polytope {p, q, r} has cells that are regular solids {p, q}, with r of them round every edge. Look along an edge: the cells round it appear as r wedges, each as wide as the cell’s dihedral angle, the angle between two of its faces. As at a corner of a polyhedron, the wedges must add up to less than 360°. The corners must also have the shape of the solid {q, r}. Ludwig Schläfli worked this out between 1850 and 1852, but his book was published only in 1901, after his death.',
 example:`Cubes have dihedral angles of ${D2_d1(D2_dih3('4,3'))}°: three round an edge leave ${D2_d1(360-3*D2_dih3('4,3'))}° to spare and make the tesseract {4,3,3}; four make exactly 360° and fill flat space. Tetrahedra (${D2_d1(D2_dih3('3,3'))}°) fit three, four or five round an edge: the 5-cell, the 16-cell and the 600-cell. Of the ${D2_cands4().length} candidates only ${D2_cands4().filter(c=>D2_test4(...c).v==='yes').length} pass: ${D2_cands4().filter(c=>D2_test4(...c).v==='yes').map(c=>'{'+c.join(',')+'}').join(', ')}.`,
 desc:'An edge seen end-on with r wedges round it, one per cell, each as wide as the cell’s dihedral angle, the gap or overlap marked, beside a table of every candidate {p, q, r} with its angle sum and verdict.',
 research:['Schläfli (written 1850–52, published 1901). Theorie der vielfachen Kontinuität. Denkschriften der Schweizerischen Naturforschenden Gesellschaft.','Coxeter (1948). Regular Polytopes. Methuen: the regular polytopes in four dimensions and their angles.'],
 dur:14,hint:'Press a row of the table to test that candidate, or set p, q and r with the sliders. Dihedral angles are computed from the coordinates of each generated solid.',
 init:()=>({p:3,q:3,r:5}),
 watch:p=>{const c=D2_cands4(),k=Math.min(c.length-1,Math.floor(p*c.length));return {p:c[k][0],q:c[k][1],r:c[k][2]}},
 ui:[{range:'p',label:'p',min:3,max:6,get:s=>s.p,act:'p'},{range:'q',label:'q',min:3,max:6,get:s=>s.q,act:'q'},{range:'r',label:'r',min:3,max:6,get:s=>s.r,act:'r'}],
 on:{p(s,v){s.p=clamp(Math.round(+v),3,6)},q(s,v){s.q=clamp(Math.round(+v),3,6)},r(s,v){s.r=clamp(Math.round(+v),3,6)},pick(s,v){const a=String(v).split(',').map(Number);if(a.length===3&&a.every(x=>x>=3&&x<=6)){s.p=a[0];s.q=a[1];s.r=a[2]}}},
 draw(s,f,X){
  const {p,q,r}=s,T4=D2_test4(p,q,r),sym=`{${p},${q},${r}}`,four=D2_FOUR.find(x=>x.key===p+','+q+','+r);
  let out=heading(!T4.okC?`${sym}: {${p},${q}} is not a solid`:!T4.okV?`${sym}: corners would need {${q},${r}}`:T4.v==='yes'?`${sym}: ${r} × ${D2_d1(T4.th)}° = ${D2_d1(T4.t)}°, it exists`:T4.v==='flat'?`${sym}: exactly 360°, it fills flat space`:`${sym}: ${D2_d1(T4.t)}° is too much`);
  if(T4.okC&&T4.okV){out+=D2_wedges(r,T4.th,170,196,118);
   out+=TF(170,338,`${r} ${D2_plural3(D2_name3(p+','+q))} round an edge, seen end-on`,13,C.muted)}
  else out+=T(170,190,!T4.okC?`{${p},${q}} failed the 3D test`:`{${q},${r}} failed the 3D test`,15,C.coral)+T(170,214,'so no cell or corner shape exists',14,C.muted);
  // table
  const c=D2_cands4(),tx=330,ty=58,rh=21;out+=TF(tx,ty,'candidate',13,C.muted,'start')+TF(tx+66,ty,'r × angle = total',13,C.muted,'start');
  c.forEach((k,i)=>{const t=D2_test4(...k),y=ty+10+i*rh,cur=k[0]===p&&k[1]===q&&k[2]===r;
   const inner=R(tx-4,y,262,rh-2,cur?C.purplep:'#fff',cur?C.purple:C.grid,4)+TMF(tx+4,y+14,`{${k.join(',')}}`,13,C.ink,'start')+TMF(tx+66,y+14,`${k[2]}×${D2_d1(t.th)}=${D2_d1(t.t)}°`,13,C.ink,'start')+TF(tx+250,y+14,t.v==='yes'?(D2_FOUR.find(x=>x.key===k.join(','))||{}).name:t.v==='flat'?'flat':'✗',13,t.v==='yes'?C.green:t.v==='flat'?C.amber:C.coral,'end');
   out+=hit(X,'pick',k.join(','),`Candidate {${k.join(',')}}: angle sum ${D2_d1(t.t)} degrees. Press to show.`,inner)});
  if(four&&T4.v==='yes'){const L=D2_lat(four.key);out+=TF(tx,ty+22+c.length*rh,`V, E, F, C = ${L.f.join(', ')} (computed)`,13,C.green,'start')}
  out+=D2_note('Angles in degrees to 1 place, from the generated coordinates.',372);
  return {svg:out,phase:!T4.okC?`There is no regular solid {${p},${q}}, so there is nothing to use as a cell.`:!T4.okV?`Round each corner the cells would have to make the solid {${q},${r}}, which does not exist.`:
   T4.v==='yes'?`Each ${D2_name3(p+','+q)} has a dihedral angle of ${D2_d1(T4.th)}°, and ${r} of them round an edge use ${D2_d1(T4.t)}°, leaving ${D2_d1(360-T4.t)}° to fold up through the fourth dimension. The polytope ${sym} exists: it is the ${four.name}, built from coordinates in this course and checked by counting.`:
   T4.v==='flat'?`${r} × ${D2_d1(T4.th)}° is exactly 360°, so the cells pack flat and fill ordinary 3-space instead of closing into a polytope.`:`${r} × ${D2_d1(T4.th)}° = ${D2_d1(T4.t)}°, more than a full turn, so the cells cannot fit round an edge.`};
 }});

// Five dimensions and up: the facets are the previous dimension's survivors; their dihedral angles come from coordinates.
function D2_family(sym){if(sym.every(x=>x===3))return 'simplex';if(sym[0]===4&&sym.slice(1).every(x=>x===3))return 'cube';if(sym[sym.length-1]===4&&sym.slice(0,-1).every(x=>x===3))return 'cross';return null}
function D2_dihFam(fam,m){return D2_memo('df'+fam+m,()=>{let c0,c1;
 if(fam==='simplex'){const P=D2_simplexCoords(m);c0=D2_mean(P.slice(1));c1=D2_mean(P.filter((_,i)=>i!==1))}
 else if(fam==='cube'){const P=D2_cubeVerts(m).map(v=>v.map(b=>b-.5));c0=D2_mean(P.filter(v=>v[0]<0));c1=D2_mean(P.filter(v=>v[1]<0))}
 else{const P=D2_crossCoords(m);c0=D2_mean(range(m).map(i=>P[2*i]));c1=D2_mean(range(m).map(i=>P[i===m-1?2*i+1:2*i]))}
 return 180-D2_deg(D2_angle(c0,c1))})}
const D2_dihSym=sym=>sym.length===2?D2_dih3(sym.join(',')):sym.length===3?D2_memo('d4'+sym,()=>D2_deg(D2_dihedral(D2_lat(sym.join(','))))):D2_dihFam(D2_family(sym),sym.length+1);
const D2_survN=n=>D2_memo('sv'+n,()=>{if(n===3)return D2_surv3().map(k=>k.split(',').map(Number));
 return D2_candsN(n).filter(c=>c.v==='yes').map(c=>c.sym)});
const D2_candsN=n=>D2_memo('cn'+n,()=>{const prev=D2_survN(n-1),out=[];
 for(const F of prev)for(const G of prev)if(F.slice(1).join()===G.slice(0,-1).join()){const sym=F.concat(G[G.length-1]),th=D2_dihSym(F),s=sym[sym.length-1],t=s*th;out.push({sym,F,th,s,t,v:t<360-1e-9?'yes':Math.abs(t-360)<1e-6?'flat':'no'})}
 return out.sort((a,b)=>a.sym.join().localeCompare(b.sym.join()))});
const D2_famName=(sym,n)=>{if(n===4)return (D2_FOUR.find(x=>x.key===sym.join(','))||{}).name;const f=D2_family(sym);return f==='simplex'?`${n}-simplex`:f==='cube'?`${n}-cube`:f==='cross'?`${n}-cross-polytope`:'?'};
SCENE({id:'regular-polytopes-higher',name:'From five dimensions up',tag:'Simplex, cube, cross-polytope',
 definition:'The same test works one dimension higher. A regular polytope in n dimensions has facets that are regular (n−1)-polytopes, and the last number s of its symbol says how many facets meet round each of its (n−3)-dimensional faces. Seen from that face, the facets are s wedges, each as wide as the facet’s dihedral angle, and they must add up to less than 360°. Schläfli found that from five dimensions on, only the simplex, the cube and the cross-polytope pass, in every dimension.',
 get example(){return `In five dimensions the facets can be any of the six regular 4-polytopes. The 24-cell, 120-cell and 600-cell have dihedral angles of ${D2_d1(D2_dihSym([3,4,3]))}°, ${D2_d1(D2_dihSym([5,3,3]))}° and ${D2_d1(D2_dihSym([3,3,5]))}°, too wide for even three to fit round a face, while the 16-cell’s ${D2_d1(D2_dihSym([3,3,4]))}° fits exactly three into 360° and fills flat 4-space. Only ${D2_survN(5).length} candidates survive.`},
 desc:'A table of the candidate regular polytopes in n dimensions, built from the survivors of the dimension below, with each facet’s dihedral angle computed from coordinates, the angle sum round a face, and the verdict.',
 research:['Schläfli (written 1850–52, published 1901). Theorie der vielfachen Kontinuität: three regular polytopes in every dimension from five up.','Coxeter (1948). Regular Polytopes. Methuen: the regular polytopes in five and more dimensions.'],
 dur:12,hint:'Step the dimension n from 5 to 8. Each candidate’s facet must itself have survived in n − 1 dimensions, and so must the shape of its corners.',
 init:()=>({n:5}),
 watch:p=>({n:5+Math.min(3,Math.floor(p*4))}),
 ui:[{range:'n',label:'Dimension n',min:5,max:8,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),5,8)}},
 draw(s){
  const n=s.n,c=D2_candsN(n),sv=c.filter(x=>x.v==='yes');
  let out=heading(`${n} dimensions: ${c.length} candidates, ${sv.length} survive`);
  const tx=24,ty=62,rh=23;out+=TF(tx,ty,'candidate',13,C.muted,'start')+TF(tx+150,ty,'facet',13,C.muted,'start')+TF(tx+276,ty,'dihedral',13,C.muted)+TF(tx+362,ty,'s, total',13,C.muted)+TF(tx+548,ty,'verdict',13,C.muted,'end');
  c.forEach((k,i)=>{const y=ty+8+i*rh;out+=R(tx-6,y,560,rh-3,k.v==='yes'?C.greenp:i%2?'#fff':'#f4f8fb','none',4)+TMF(tx,y+15,`{${k.sym.join(',')}}`,13,C.ink,'start')+TF(tx+150,y+15,`${D2_famName(k.F,n-1)}`,13,C.ink,'start')+TMF(tx+276,y+15,`${D2_d1(k.th)}°`,13,C.ink)+TMF(tx+362,y+15,`${k.s} → ${D2_d1(k.t)}°`,13,C.ink)+TF(tx+548,y+15,k.v==='yes'?'✓ '+D2_famName(k.sym,n):k.v==='flat'?'flat':'✗',13,k.v==='yes'?C.green:k.v==='flat'?C.amber:C.coral,'end')});
  out+=TF(300,ty+28+c.length*rh,`Survivors: ${sv.map(k=>D2_famName(k.sym,n)).join(', ')}`,14,C.green);
  const pv=D2_survN(n-1);if(c.length*rh<200)pv.forEach((F,i)=>{out+=TF(300,ty+60+c.length*rh+i*19,`${D2_famName(F,n-1)} {${F.join(',')}}: dihedral angle ${D2_d1(D2_dihSym(F))}°`,13,C.muted)});
  out+=D2_note('Dihedral angles in degrees to 1 place, from facet normals of generated coordinates.',372);
  return {svg:out,phase:`Every candidate is built from a facet that survived in ${n-1} dimensions and a corner shape that also survived. Of the ${c.length}, only ${sv.map(k=>'{'+k.sym.join(',')+'}').join(', ')} keep their angle sums below 360°. ${c.some(k=>k.v==='flat')?'The ones that make exactly 360° fill flat space instead. ':''}The same three survive in every dimension from five up.`};
 }});

// Sections: the 3D slice of a 4-polytope by the hyperplane x·u = H, computed from its edges, 2-faces and cells.
const D2_faceEdges=key=>D2_memo('fe'+key,()=>{const L=D2_lat(key),inc=L.pts.map(()=>[]);L.faces[1].forEach((e,i)=>{inc[e[0]].push(i);inc[e[1]].push(i)});
 const of=f=>{const S=new Set(f),es=new Set();for(const v of f)for(const i of inc[v]){const e=L.faces[1][i];if(S.has(e[0])&&S.has(e[1]))es.add(i)}return [...es]};
 return {f2:L.faces[2].map(of),f3:L.faces[3].map(of)}});
function D2_cycle(ids,edges){const adj=new Map(ids.map(i=>[i,[]]));for(const [a,b] of edges)if(adj.has(a)&&adj.has(b)){adj.get(a).push(b);adj.get(b).push(a)}
 const out=[ids[0]];let prev=-1,cur=ids[0];for(let k=1;k<ids.length;k++){const nx=(adj.get(cur)||[]).find(x=>x!==prev&&!out.includes(x));if(nx===undefined)break;out.push(nx);prev=cur;cur=nx}return out}
function D2_section(key,u,H){
 const L=D2_lat(key),FE=D2_faceEdges(key),E=L.faces[1],ht=L.pts.map(p=>D2_dot(p,u)-H),eps=1e-9,pts=[],idx=new Map();
 const add=p=>{const k=p.map(x=>Math.round(x*1e6)).join(',');if(!idx.has(k)){idx.set(k,pts.length);pts.push(p)}return idx.get(k)};
 const ep=E.map(([a,b])=>{const ha=ht[a],hb=ht[b],za=Math.abs(ha)<eps,zb=Math.abs(hb)<eps,o=[];
  if(za)o.push(add(L.pts[a]));if(zb)o.push(add(L.pts[b]));
  if(!za&&!zb&&ha*hb<0){const t=ha/(ha-hb);o.push(add(L.pts[a].map((x,i)=>x+t*(L.pts[b][i]-x))))}return o});
 const setOf=es=>[...new Set(es.flatMap(i=>ep[i]))].sort((a,b)=>a-b);
 const edges=new Map(),faces=new Map();
 E.forEach((e,i)=>{if(ep[i].length===2){const s=ep[i].slice().sort((a,b)=>a-b);edges.set(s.join(','),s)}});
 FE.f2.forEach(es=>{const s=setOf(es);if(s.length===2)edges.set(s.join(','),s);else if(s.length>2&&D2_affRank(pts,s)===2)faces.set(s.join(','),s)});
 FE.f3.forEach(es=>{const s=setOf(es);if(s.length>2&&D2_affRank(pts,s)===2)faces.set(s.join(','),s)});
 const dim=pts.length?D2_affRank(pts,range(pts.length)):-1,EL=[...edges.values()];
 return {pts,edges:EL,faces:[...faces.values()].map(f=>D2_cycle(f,EL)),dim};
}
const D2_SECT=['3,3,3','4,3,3','3,3,4','3,4,3','3,3,5','5,3,3'];
function D2_sectDir(key,dir){const L=D2_lat(key);return dir==='cell'?L.facets[0].n:D2_scale(L.pts[0],1/D2_len(L.pts[0]))}
function D2_sectAt(s){const key=D2_SECT[s.poly],u=D2_sectDir(key,s.dir),L=D2_lat(key),hs=L.pts.map(p=>D2_dot(p,u)),lo=Math.min(...hs),hi=Math.max(...hs),H=lerp(lo,hi,s.h);
 const Q=D2_section(key,u,H),B=D2_orthonormal([u,[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]).slice(1,4),P3=Q.pts.map(p=>B.map(b=>D2_dot(p,b)));
 const levels=[...new Set(hs.map(h=>Math.round(h*1e6)))].map(x=>x/1e6).sort((a,b)=>a-b),R=Math.max(...L.pts.map(D2_len));
 return {key,L,Q,P3,H,lo,hi,levels,R,name:D2_byKey(key).name}}
const D2_sideNames={3:'triangle',4:'quadrilateral',5:'pentagon',6:'hexagon',8:'octagon',10:'decagon'};
function D2_faceMix(Q){const c={};Q.faces.forEach(f=>{c[f.length]=(c[f.length]||0)+1});return Object.keys(c).sort((a,b)=>a-b).map(k=>`${c[k]} ${D2_sideNames[k]||k+'-gon'}${c[k]>1?'s':''}`).join(', ')}
SCENE({id:'regular-polytopes-sections',name:'Alicia Boole Stott’s sections',tag:'Parallel slices, 1900',
 definition:'Alicia Boole Stott, a daughter of the logician George Boole, had no university training in mathematics. She learned about four dimensions through Charles Hinton, who married her sister Mary, and worked out by herself what the regular 4-polytopes look like when cut by a series of parallel three-dimensional hyperplanes, as a sphere passing through Flatland shows a series of circles. She made cardboard models of the sections, published them in 1900 and introduced the English word “polytope”. She later worked with the Dutch geometer Pieter Schoute and, in the 1930s, with H. S. M. Coxeter.',
 example:'Here each slice is computed: the hyperplane cuts the polytope’s edges in the slice’s corners, its 2-faces in the slice’s edges and its cells in the slice’s faces. Every slice through the inside is a convex polyhedron, so its counts satisfy V − E + F = 2, which the tiles check.',
 desc:'A three-dimensional slice of a chosen regular 4-polytope, drawn obliquely, with a bar showing where the slicing hyperplane is between the lowest and highest corners, and tiles with the slice’s corners, edges and faces and V − E + F.',
 research:['Boole Stott (1900). On certain series of sections of the regular four-dimensional hypersolids. Verhandelingen der Koninklijke Akademie van Wetenschappen te Amsterdam.','Coxeter (1948). Regular Polytopes. Methuen: sections of the regular polytopes, crediting Boole Stott.'],
 dur:16,hint:'Choose a polytope and whether the slicing begins with a cell or a corner, then move the hyperplane. Switch to 3D to turn the slice.',
 init:()=>({poly:3,dir:'cell',h:.3}),
 watch:p=>({poly:3,dir:'cell',h:Math.round(p*50)/50}),
 ui:[{choose:D2_SECT.map((k,i)=>[i,D2_byKey(k).name]),label:'Polytope',get:s=>s.poly,act:'poly'},{choose:[['cell','Cell first'],['vertex','Corner first']],label:'Begin with',get:s=>s.dir,act:'dir'},{range:'h',label:'Slice height',min:0,max:1,step:.02,get:s=>s.h,act:'h',show:v=>Math.round(v*100)+'%'}],
 on:{poly(s,v){s.poly=clamp(Math.round(+v),0,5)},dir(s,v){s.dir=v==='vertex'?'vertex':'cell'},h(s,v){s.h=clamp(+v,0,1)}},
 draw(s){
  const S=D2_sectAt(s),{Q,P3}=S,vw=D2_view(.62,.42),P2=P3.map(vw),k=150/S.R,Pt=p=>[200+p[0]*k,196+p[1]*k];
  const V=Q.pts.length,E=Q.edges.length,F=Q.faces.length,solid=Q.dim===3;
  let out=heading(`${S.name}, ${s.dir==='cell'?'cell':'corner'} first: ${solid?`a slice with ${F} faces`:Q.dim===2?'the slice is flat':Q.dim===1?'the slice is an edge':Q.dim===0?'the slice is one corner':'no slice'}`);
  out+=R(30,56,340,284,'#f7fafc',C.grid,8);
  const order=Q.faces.map(f=>({f,d:f.reduce((a,i)=>a+P2[i][2],0)/f.length})).sort((a,b)=>a.d-b.d);
  for(const {f} of order)out+=`<polygon points="${f.map(i=>Pt(P2[i]).map(fmt).join(',')).join(' ')}" fill="${C.pale}" fill-opacity=".55" stroke="none"/>`;
  for(const [a,b] of Q.edges){const p=Pt(P2[a]),q=Pt(P2[b]);out+=L(p[0],p[1],q[0],q[1],C.blue,2)}
  P2.forEach(p=>{const q=Pt(p);out+=Ci(q[0],q[1],2.6,C.ink)});
  // level bar
  const bx=556,by0=70,by1=320,Y=h=>by1-(h-S.lo)/(S.hi-S.lo)*(by1-by0);
  out+=L(bx,by0,bx,by1,C.line,3);S.levels.forEach(h=>{out+=L(bx-7,Y(h),bx+7,Y(h),C.muted,1.4)});
  out+=L(bx-16,Y(S.H),bx+16,Y(S.H),C.coral,3.5)+TF(bx,by1+18,`${S.levels.length} levels`,13,C.muted)+TF(bx,by0-10,'corners',13,C.muted);
  out+=D2_tile(400,56,128,'Corners V',String(V),C.blue)+D2_tile(400,110,128,'Edges E',String(E),C.blue)+D2_tile(400,164,128,'Faces F',String(F),C.blue)+D2_tile(400,218,128,'V − E + F',solid?String(V-E+F):'—',solid?C.green:C.muted);
  out+=TF(400,290,`The ${S.name} has`,13,C.muted,'start')+TF(400,308,`${S.L.f.join(', ')} parts`,13,C.muted,'start');
  out+=D2_note('A 3D slice of a 4D polytope, drawn obliquely on the page. Ticks: heights of corners.',366);
  return {svg:out,phase:solid?`The hyperplane at ${Math.round(s.h*100)}% of the way up cuts the ${S.name} in a polyhedron with ${V} corners, ${E} edges and ${F} faces (${D2_faceMix(Q)}). ${V} − ${E} + ${F} = ${V-E+F}, as for every convex polyhedron. Move the slice and the shape changes most where it passes a level of corners.`:
   Q.dim===0?'At the very end the hyperplane only touches one corner of the polytope. Move it inwards to see a solid slice.':Q.dim>0?'Here the hyperplane only touches the polytope in a lower-dimensional piece of its surface.':'The hyperplane misses the polytope.'};
 },
 three(s,f,X,project){
  const S=D2_sectAt(s),{Q,P3}=S,Pr=project([-.65*S.R,.65*S.R,-.65*S.R,.65*S.R,-.65*S.R,.65*S.R]);
  const faces=Q.faces.map(fc=>({pts:fc.map(i=>P3[i]),fill:C.blue,opacity:.3}));
  return {svg:paintFaces(faces,Pr),title:'The slice in 3D',caption:`The slice of the ${S.name} at ${Math.round(s.h*100)}% of its height, computed in 4D and written in coordinates of the slicing hyperplane by this scene’s code. Dragging turns the camera on that 3D slice.`};
 }});

/* ===================== Lesson: special-polytopes ===================== */
// 4D drawing: turn in the xw plane (and a little in yz), then project onto two fixed directions.
function D2_proj4all(L,ang){const a=ang*Math.PI/180;return L.pts.map(p=>D2_proj4(D2_rot(D2_rot(p,0,3,a),1,2,a*.5)))}
function D2_fit4(L,X0,Y0,W,H){const R=Math.max(...L.pts.map(D2_len)),k=Math.min(W,H)/2/R;return p=>[X0+W/2+p[0]*k,Y0+H/2+p[1]*k]}
// Cells that share a 2-face with a given cell.
const D2_cellNbrs=key=>D2_memo('cn4'+key,()=>{const L=D2_lat(key),C3=L.faces[3],inc=L.pts.map(()=>[]);C3.forEach((c,i)=>c.forEach(v=>inc[v].push(i)));
 return C3.map((c,i)=>{const cnt=new Map();for(const v of c)for(const j of inc[v])if(j!==i)cnt.set(j,(cnt.get(j)||0)+1);return [...cnt].filter(([j,n])=>n>=3&&D2_affRank(L.pts,c.filter(v=>C3[j].includes(v)))===2).map(([j])=>j)})});
function D2_draw4(L,ang,box,hl){const Pp=D2_proj4all(L,ang),fit=D2_fit4(L,...box),Q=Pp.map(fit),cs=new Set(hl.cell||[]),ns=new Set(hl.nb||[]);let base='',mid='',top='';
 for(const [a,b] of L.faces[1]){const inC=cs.has(a)&&cs.has(b),inN=ns.has(a)&&ns.has(b);
  if(inC)top+=L_(Q,a,b,C.coral,3.4);else if(inN)mid+=L_(Q,a,b,C.purple,1.8);else base+=L_(Q,a,b,hl.faint||'#c3d3de',hl.w||1)}
 let dots='';if(hl.dots)Q.forEach((q,i)=>{if(cs.has(i))dots+=Ci(q[0],q[1],3.6,C.coral,'#fff');else if(hl.dotsAll)dots+=Ci(q[0],q[1],2.4,hl.dotCol?hl.dotCol(i):C.blue)});
 return {svg:base+mid+top+dots,Q}}
const L_=(Q,a,b,col,w)=>L(Q[a][0],Q[a][1],Q[b][0],Q[b][1],col,w);
// The vertex figure: neighbours of corner 0 and the edges among them.
function D2_vfig(L,v=0){const nb=L.nb[v],S=new Set(nb);const e=L.faces[1].filter(([a,b])=>S.has(a)&&S.has(b));return {n:nb.length,e:e.length,deg:nb.map(x=>e.filter(q=>q.includes(x)).length)}}
function D2_nbDist(L,v){const nb=L.nb[v],d=[];for(let i=0;i<nb.length;i++)for(let j=i+1;j<nb.length;j++)d.push(Math.sqrt(D2_dist2(L.pts[nb[i]],L.pts[nb[j]])));return {n:d.length,lo:Math.min(...d),hi:Math.max(...d)}}
const D2_centralV=(key,ang)=>{const Q=D2_proj4all(D2_lat(key),ang);let b=0;Q.forEach((q,i)=>{if(Math.hypot(...q)<Math.hypot(...Q[b]))b=i});return b};
const D2_centralC=(key,ang)=>{const L=D2_lat(key),a=ang*Math.PI/180;let b=0,bd=1e9;L.faces[3].forEach((c,i)=>{const q=D2_proj4(D2_rot(D2_rot(D2_mean(c.map(v=>L.pts[v])),0,3,a),1,2,a*.5)),d=Math.hypot(...q);if(d<bd){bd=d;b=i}});return b};
const D2_cellCentres=key=>D2_memo('cc'+key,()=>{const L=D2_lat(key);return L.faces[3].map(c=>D2_mean(c.map(i=>L.pts[i])))});
const D2_dualF=key=>D2_memo('df'+key,()=>D2_lattice(D2_cellCentres(key)).f);
SCENE({id:'special-polytopes',name:'The 24-cell, with no counterpart',tag:'Built from octahedra',
 get definition(){const L=D2_lat('3,4,3');return `The 24-cell {3,4,3} has ${L.f[0]} corners, which can be taken as all the arrangements of (±1, ±1, 0, 0), and its cells are ${L.f[3]} regular octahedra, ${D2_symbolOf(L)[2]} round every edge. It has no counterpart in any other dimension: apart from the polygons and the simplices it is the only regular polytope that is its own dual, the centres of its cells forming another 24-cell. Schläfli found it along with the others.`},
 get example(){const L=D2_lat('3,4,3'),vf=D2_vfig(L),nb=D2_cellNbrs('3,4,3')[0];return `Counted from the coordinates: ${L.f.join(', ')} corners, edges, triangles and octahedra. Each corner has ${vf.n} neighbours joined by ${vf.e} edges, the corners of a cube, so a cube is the shape of every corner. Each octahedron meets ${nb.length} others across its ${nb.length} triangles. The ${L.f[3]} cell centres make a polytope with counts ${D2_dualF('3,4,3').join(', ')}: another 24-cell.`},
 desc:'A projection of the 24-cell turned in four dimensions, with one octahedral cell in red and the cells that share a triangle with it in purple, and tiles with counts computed from the coordinates.',
 research:['Schläfli (written 1850–52, published 1901). Theorie der vielfachen Kontinuität: the 24-cell among the six regular polytopes in four dimensions.','Coxeter (1948). Regular Polytopes. Methuen: the 24-cell {3,4,3}, which is self-reciprocal (its own dual).'],
 dur:14,hint:'Turn the 24-cell in four dimensions, step to another cell, or press a corner to pick a cell through it. Purple cells share a triangle with the red one.',
 init:()=>({ang:16,cell:0,nb:1}),
 watch:p=>({ang:Math.round(60*p),cell:[0,5,11,17][Math.min(3,Math.floor(p*4))],nb:1}),
 ui:[{range:'ang',label:'Turn in 4D (degrees)',min:0,max:90,step:2,get:s=>s.ang,act:'ang'},{b:'Next cell',act:'next'},{b:'Neighbours on/off',act:'nbt'}],
 on:{ang(s,v){s.ang=clamp(+v,0,90)},next(s){s.cell=(s.cell+1)%D2_lat('3,4,3').f[3]},nbt(s){s.nb=s.nb?0:1},
  pick(s,v){const C3=D2_lat('3,4,3').faces[3],i=Math.round(+v),list=C3.map((c,j)=>j).filter(j=>C3[j].includes(i));if(list.length){const k=list.indexOf(s.cell);s.cell=list[(k+1)%list.length]}}},
 draw(s,f,X){
  const key='3,4,3',L=D2_lat(key),C3=L.faces[3],cell=C3[s.cell%C3.length],nbs=D2_cellNbrs(key)[s.cell%C3.length],nbV=s.nb?nbs.flatMap(j=>C3[j]):[];
  const d=D2_draw4(L,s.ang,[24,50,330,300],{cell,nb:nbV,dots:1,w:1.2});
  let out=heading(`Cell ${s.cell%C3.length+1} of ${C3.length}: an octahedron and its ${nbs.length} neighbours`);out+=d.svg;
  if(X&&X.try)d.Q.forEach((q,i)=>{out+=hit(X,'pick',i,`Corner ${i+1}. Press to pick a cell through it.`,Ci(q[0],q[1],7,'transparent'))});
  const vf=D2_vfig(L),df=D2_dualF(key);
  out+=D2_tile(374,52,210,'Corners, edges, faces, cells',L.f.join(', '),C.blue)+D2_tile(374,106,210,'Corners on the red cell',`${cell.length} (an octahedron)`,C.coral);
  out+=D2_tile(374,160,210,'Neighbours of a corner; edges',`${vf.n}; ${vf.e}: a cube`,C.ink)+D2_tile(374,214,210,'Cell centres make a polytope',df.join(', '),C.green);
  out+=TF(479,284,df.join()===L.f.join()?'the same counts: self-dual ✓':'counts differ',13,C.green);
  out+=D2_note('Turned in the xw plane and projected to the page; every cell is a regular octahedron in 4D.',366);
  return {svg:out,phase:`The red octahedron has ${cell.length} corners and ${nbs.length} triangular faces, and across each face lies another octahedron${s.nb?' (purple)':''}. The projection squashes them to different shapes, but in four dimensions all ${C3.length} cells are identical. Turning the polytope changes only the shadow.`};
 }});

// The 600-cell: 120 corners in three families; each corner's 12 neighbours form an icosahedron.
const D2_600type=p=>{const nz=p.filter(x=>Math.abs(x)>1e-9).length;return nz===1?0:nz===4&&p.every(x=>Math.abs(Math.abs(x)-.5)<1e-9)?1:2};
const D2_qmul=(a,b)=>[a[0]*b[0]-a[1]*b[1]-a[2]*b[2]-a[3]*b[3],a[0]*b[1]+a[1]*b[0]+a[2]*b[3]-a[3]*b[2],a[0]*b[2]-a[1]*b[3]+a[2]*b[0]+a[3]*b[1],a[0]*b[3]+a[1]*b[2]-a[2]*b[1]+a[3]*b[0]];
const D2_closure=()=>D2_memo('qcl',()=>{const Q=D2_lat('3,3,5').pts,key=p=>p.map(x=>Math.round(x*1e6)).join(','),S=new Set(Q.map(key));let hits=0;for(const x of Q)for(const y of Q)if(S.has(key(D2_qmul(x,y))))hits++;return {hits,all:Q.length*Q.length}});
const D2_GRP=[[C.blue,'one coordinate ±1'],[C.green,'all four ±½'],[C.purple,'golden: ½(±φ, ±1, ±1/φ, 0)']];
SCENE({id:'special-polytopes-600',name:'The 600-cell from coordinates',tag:'Built from tetrahedra',
 get definition(){const L=D2_lat('3,3,5'),t=[0,1,2].map(g=>L.pts.filter(p=>D2_600type(p)===g).length);return `The 600-cell {3,3,5} is built from ${L.f[3]} regular tetrahedra, ${D2_symbolOf(L)[2]} round every edge. Its ${L.f[0]} corners can all be placed at distance 1 from the centre: ${t[0]} with one coordinate ±1, ${t[1]} with all four coordinates ±½, and ${t[2]} that are even rearrangements of ½(±φ, ±1, ±1/φ, 0), where φ = (1 + √5)/2 is the golden ratio. Read as quaternions, these ${L.f[0]} points are closed under multiplication: they form a group.`},
 get example(){const L=D2_lat('3,3,5'),vf=D2_vfig(L),cl=D2_closure(),e=L.faces[1][0];return `The edges are the pairs at the smallest distance, 1/φ = ${D2_d2(Math.sqrt(D2_dist2(L.pts[e[0]],L.pts[e[1]])))} (2 places): ${L.f[1]} of them. Each corner has ${vf.n} neighbours, joined by ${vf.e} edges into an icosahedron. Triangles and tetrahedra found as faces of the hull: ${L.f[2]} and ${L.f[3]}. Multiplying every corner by every corner as quaternions gives ${D2_num(cl.hits)} of ${D2_num(cl.all)} products back on the list.`},
 desc:'A projection of the 600-cell’s edges with its corners coloured by coordinate family, one chosen corner and its nearest neighbours highlighted, and tiles with counts computed from the coordinates.',
 research:['Schläfli (written 1850–52, published 1901). Theorie der vielfachen Kontinuität.','Coxeter (1948). Regular Polytopes. Methuen: coordinates of the 600-cell {3,3,5}.','Conway & Smith (2003). On Quaternions and Octonions. A K Peters: the 120 unit quaternions of the binary icosahedral group.'],
 dur:14,hint:'Turn the 600-cell, choose which family of corners to show, and step to a neighbouring corner to see its twelve neighbours, which always form an icosahedron.',
 init:()=>({ang:20,grp:-1,v:D2_centralV('3,3,5',20),k:0}),
 watch:p=>{const ang=Math.round(50*p),j=Math.min(3,Math.floor(p*4));return {ang,grp:[-1,0,1,2][j],v:D2_centralV('3,3,5',Math.round(50*j/4)),k:0}},
 ui:[{range:'ang',label:'Turn in 4D (degrees)',min:0,max:90,step:2,get:s=>s.ang,act:'ang'},{choose:[[-1,'All corners'],[0,'±1 family'],[1,'±½ family'],[2,'Golden family']],label:'Show',get:s=>s.grp,act:'grp'},{b:'Next corner',act:'next'}],
 on:{ang(s,v){s.ang=clamp(+v,0,90)},grp(s,v){s.grp=clamp(Math.round(+v),-1,2)},next(s){const nb=D2_lat('3,3,5').nb[s.v];s.k=(s.k||0)+1;s.v=nb[(s.k*5)%nb.length]}},
 draw(s){
  const L=D2_lat('3,3,5'),v=s.v%L.f[0],nb=L.nb[v],ty=L.pts.map(D2_600type),cnt=[0,1,2].map(g=>ty.filter(t=>t===g).length);
  const d=D2_draw4(L,s.ang,[24,50,330,300],{cell:[v].concat(nb),dots:1,dotsAll:1,dotCol:i=>s.grp<0||ty[i]===s.grp?D2_GRP[ty[i]][0]:'#d6e0e7',faint:'#cfdbe4',w:.8});
  // the neighbour star in red: edges from v to its neighbours, and among them
  let out=heading(`Corner ${v+1}: ${nb.length} neighbours forming an icosahedron`);out+=d.svg;
  const vf=D2_vfig(L,v),cl=D2_closure();
  D2_GRP.forEach(([col,lab],g)=>{out+=Ci(380,60+g*20,5,col)+TF(392,65+g*20,`${cnt[g]}: ${lab}`,13,s.grp<0||s.grp===g?C.ink:C.muted,'start')});
  out+=D2_tile(374,126,210,'Corners, edges, faces, cells',L.f.join(', '),C.blue)+D2_tile(374,180,210,'Neighbours; edges among them',`${vf.n}; ${vf.e}`,C.coral);
  out+=D2_tile(374,234,210,'Products back on the list',`${D2_num(cl.hits)} of ${D2_num(cl.all)}`,C.green);
  out+=D2_note('Turned in the xw plane and projected to the page. All corners lie at distance 1 from the centre.',366);
  return {svg:out,phase:`The chosen corner (red) is joined to its ${nb.length} nearest neighbours, which are joined among themselves by ${vf.e} edges: an icosahedron, the shape {3,5} of every corner of {3,3,5}. Each of its ${vf.e} edges with the chosen corner makes a triangle, and each of the icosahedron’s triangles makes a tetrahedral cell${s.grp>=0?`. Highlighted: the ${cnt[s.grp]} corners of the ${['±1','±½','golden'][s.grp]} family`:''}.`};
 }});

// The 120-cell: its 600 corners are the centres of the 600-cell's tetrahedra.
SCENE({id:'special-polytopes-120',name:'The 120-cell, the 600-cell’s dual',tag:'Built from dodecahedra',
 get definition(){const L=D2_lat('5,3,3');return `The 120-cell {5,3,3} is built from ${L.f[3]} regular dodecahedra, ${D2_symbolOf(L)[2]} round every edge. It is the dual of the 600-cell, so its corners can be found as the centres of the 600-cell’s ${D2_lat('3,3,5').f[3]} tetrahedra. Here they are computed exactly that way, and everything else, edges, pentagons and dodecahedra, is found from those ${L.f[0]} points alone.`},
 get example(){const L=D2_lat('5,3,3'),M=D2_lat('3,3,5'),vf=D2_vfig(L),nb=D2_cellNbrs('5,3,3')[0];return `Counted from the computed corners: ${L.f.join(', ')} corners, edges, pentagons and dodecahedra, which is the 600-cell’s list (${M.f.join(', ')}) in reverse. Each corner has ${vf.n} neighbours, none joined to another by an edge (${vf.e} edges among them) but all ${D2_nbDist(L,0).n} pairs equally far apart (${D2_d2(D2_nbDist(L,0).lo)} to ${D2_d2(D2_nbDist(L,0).hi)}), so the corner is shaped like a tetrahedron. Each dodecahedron meets ${nb.length} others, one across each of its faces.`},
 desc:'A projection of all the 120-cell’s edges with one dodecahedral cell in red and the cells that share a pentagon with it in purple, and tiles comparing its counts with those of the 600-cell.',
 research:['Schläfli (written 1850–52, published 1901). Theorie der vielfachen Kontinuität.','Coxeter (1948). Regular Polytopes. Methuen: the 120-cell {5,3,3} and the 600-cell {3,3,5} are reciprocal (dual).'],
 dur:14,hint:'Turn the 120-cell slowly and step from a cell to one of its neighbours. Turn the neighbours off to see a single dodecahedron among the 120.',
 init:()=>({ang:24,cell:D2_centralC('5,3,3',24),nb:1,k:0}),
 watch:p=>{const j=Math.min(3,Math.floor(p*4));return {ang:Math.round(48*p),cell:D2_centralC('5,3,3',Math.round(48*j/4)),nb:p<.5?0:1,k:0}},
 ui:[{range:'ang',label:'Turn in 4D (degrees)',min:0,max:90,step:2,get:s=>s.ang,act:'ang'},{b:'Next cell',act:'next'},{b:'Neighbours on/off',act:'nbt'}],
 on:{ang(s,v){s.ang=clamp(+v,0,90)},next(s){const nb=D2_cellNbrs('5,3,3')[s.cell];s.k=(s.k||0)+1;s.cell=nb[(s.k*5)%nb.length]},nbt(s){s.nb=s.nb?0:1}},
 draw(s){
  const L=D2_lat('5,3,3'),M=D2_lat('3,3,5'),C3=L.faces[3],ci=s.cell%C3.length,cell=C3[ci],nbs=D2_cellNbrs('5,3,3')[ci],nbV=s.nb?nbs.flatMap(j=>C3[j]):[];
  const d=D2_draw4(L,s.ang,[24,50,330,300],{cell,nb:nbV,dots:1,w:.7,faint:'#d2dee6'});
  const ce=L.faces[1].filter(([a,b])=>cell.includes(a)&&cell.includes(b)).length,cf=L.faces[2].filter(f=>f.every(v=>cell.includes(v))).length;
  let out=heading(`Cell ${ci+1} of ${C3.length}: a dodecahedron${s.nb?` and its ${nbs.length} neighbours`:''}`);out+=d.svg;
  out+=D2_tile(374,52,210,'120-cell: V, E, F, C',L.f.join(', '),C.blue)+D2_tile(374,106,210,'600-cell: V, E, F, C',M.f.join(', '),C.purple);
  out+=TF(479,172,L.f.join()===M.f.slice().reverse().join()?'the same numbers, reversed ✓':'not reversed',13,C.green);
  out+=D2_tile(374,184,210,'Red cell: corners, edges, faces',`${cell.length}, ${ce}, ${cf}`,C.coral)+D2_tile(374,238,210,'Corners: centres of the',`${M.f[3]} tetrahedra`,C.ink);
  out+=D2_note('Turned in the xw plane and projected to the page; all 120 dodecahedra are identical in 4D.',366);
  return {svg:out,phase:`The red cell has ${cell.length} corners, ${ce} edges and ${cf} pentagonal faces: a dodecahedron. ${s.nb?`The ${nbs.length} purple cells each share one pentagon with it. `:''}Every corner of the 120-cell is the centre of one tetrahedron of the 600-cell, and every dodecahedron surrounds one corner of the 600-cell: duality swaps corners and cells.`};
 }});

/* ===================== Lesson: euler-formula ===================== */
// Cutting corners off a Platonic solid: each cut replaces a corner by points one third of the way along its edges.
const D2_cutOrder=si=>D2_memo('co'+si,()=>{const P=D2_SOLIDS[si].pts(),ch=[0];while(ch.length<P.length){let best=-1,bd=-1;P.forEach((p,i)=>{if(ch.includes(i))return;const d=Math.min(...ch.map(j=>D2_dist2(p,P[j])));if(d>bd+1e-9){bd=d;best=i}});ch.push(best)}return ch});
function D2_cutSolid(si,cuts){return D2_memo('cut'+si+','+cuts,()=>{
 let pts=D2_SOLIDS[si].pts(),tag=pts.map(()=>-1),orig=pts.map((_,i)=>i);const order=D2_cutOrder(si),degs=[];
 for(let c=0;c<cuts;c++){const L=D2_lattice(pts,true),v=orig.indexOf(order[c]);if(v<0)break;
  const np=L.nb[v].map(u=>pts[v].map((x,i)=>x+(pts[u][i]-x)/3));degs.push(np.length);
  const keep=(_,i)=>i!==v;pts=pts.filter(keep).concat(np);tag=tag.filter(keep).concat(np.map(()=>c));orig=orig.filter(keep).concat(np.map(()=>-1))}
 return {L:D2_lattice(pts,true),tag,degs}})}
function D2_solidSVG(LT,tag,yaw,box,R){const vw=D2_view(yaw,.42),P2=LT.pts.map(vw),k=Math.min(box[2],box[3])/2/R,Q=P2.map(p=>[box[0]+box[2]/2+p[0]*k,box[1]+box[3]/2+p[1]*k]);
 const front=LT.facets.map(f=>vw(f.n)[2]>0),E=LT.faces[1];let back='',fill='',fr='';
 const cyc=LT.facets.map(f=>D2_cycle(f.v,E));
 LT.facets.forEach((f,i)=>{if(!front[i])return;const isNew=f.v.every(v=>tag[v]>=0&&tag[v]===tag[f.v[0]]);fill+=`<polygon points="${cyc[i].map(v=>Q[v].map(fmt).join(',')).join(' ')}" fill="${isNew?C.amberp:C.pale}" fill-opacity=".9" stroke="none"/>`});
 for(const [a,b] of E){const vis=LT.facets.some((f,i)=>front[i]&&f.v.includes(a)&&f.v.includes(b));if(vis)fr+=L_(Q,a,b,C.blue,2.2);else back+=L(Q[a][0],Q[a][1],Q[b][0],Q[b][1],'#b9cad6',1.3,'stroke-dasharray="4 4"')}
 return back+fill+fr+Q.map(q=>Ci(q[0],q[1],2.8,C.ink)).join('')}
SCENE({id:'euler-formula',name:'V − E + F = 2',tag:'Euler’s letter to Goldbach, 1750',
 definition:'Count the corners V, edges E and faces F of any convex polyhedron and V − E + F comes out as 2. Leonhard Euler announced the rule in a letter to Christian Goldbach in November 1750 and published it in 1758; René Descartes had written down an equivalent result about a century earlier in notes that were printed only in the nineteenth century. Euler’s own proof had gaps; Adrien-Marie Legendre gave a sound proof in 1794 using areas on a sphere.',
 get example(){const c=D2_cutSolid(1,1).L.f;return `The cube has ${D2_lat('4,3').f.join(', ')} corners, edges and faces: ${D2_lat('4,3').f[0]} − ${D2_lat('4,3').f[1]} + ${D2_lat('4,3').f[2]} = 2. Slice off one corner, where 3 edges meet: the corner becomes 3 new corners, the cut adds 3 edges and 1 face, giving ${c.join(', ')}, and the sum is still ${c[0]-c[1]+c[2]}.`},
 desc:'A Platonic solid drawn with hidden edges dashed, its corners optionally cut off one at a time with the new faces shaded, and tiles counting corners, edges and faces computed from the convex hull of its points, with V − E + F.',
 research:['Euler (1758). Elementa doctrinae solidorum. Novi Commentarii Academiae Scientiarum Petropolitanae 4 (for 1752–53); announced in a letter to Goldbach, 14 November 1750.','Legendre (1794). Éléments de géométrie: the first proof generally accepted as complete.','Richeson (2008). Euler’s Gem. Princeton University Press: the history, including Descartes’s notes.'],
 dur:15,hint:'Choose a solid, then cut off corners one at a time. Each cut changes V, E and F, but never V − E + F. Turn the solid with the slider.',
 init:()=>({si:1,cuts:0,yaw:35}),
 watch:p=>{const si=Math.min(4,Math.floor(p*5)),u=p*5-si;return {si,cuts:u<.34?0:u<.67?1:2,yaw:Math.round(20+p*80)}},
 ui:[{choose:D2_SOLIDS.map((s,i)=>[i,s.name[0].toUpperCase()+s.name.slice(1)]),label:'Solid',get:s=>s.si,act:'si'},{b:'Cut off a corner',act:'cut'},{b:'Restore',act:'restore'},{range:'yaw',label:'Turn (degrees)',min:0,max:360,step:10,get:s=>s.yaw,act:'yaw'}],
 on:{si(s,v){s.si=clamp(Math.round(+v),0,4);s.cuts=0},cut(s){s.cuts=Math.min(4,s.cuts+1)},restore(s){s.cuts=0},yaw(s,v){s.yaw=clamp(+v,0,360)}},
 draw(s){
  const R0=Math.max(...D2_SOLIDS[s.si].pts().map(D2_len)),{L,tag,degs}=D2_cutSolid(s.si,s.cuts),[V,E,F]=L.f;
  let out=heading(`${D2_SOLIDS[s.si].name[0].toUpperCase()+D2_SOLIDS[s.si].name.slice(1)}${s.cuts?`, ${s.cuts} corner${s.cuts>1?'s':''} cut off`:''}: ${V} − ${E} + ${F} = ${V-E+F}`);
  out+=D2_solidSVG(L,tag,(s.yaw+17)*Math.PI/180,[30,56,330,280],R0);
  out+=D2_tile(392,56,90,'Corners V',String(V),C.blue)+D2_tile(492,56,90,'Edges E',String(E),C.blue)+D2_tile(392,110,90,'Faces F',String(F),C.blue)+D2_tile(492,110,90,'V − E + F',String(V-E+F),C.green);
  if(degs.length){const q=degs[degs.length-1];out+=TF(392,190,`Last cut: a corner with ${q} edges`,13,C.ink,'start')+TF(392,210,`V: −1 + ${q} = +${q-1}`,13,C.ink,'start')+TF(392,230,`E: +${q}     F: +1`,13,C.ink,'start')+TF(392,250,`change in V − E + F: ${q-1} − ${q} + 1 = ${q-1-q+1}`,13,C.green,'start')}
  else out+=TF(392,190,'Press Cut off a corner:',13,C.muted,'start')+TF(392,210,'the counts change,',13,C.muted,'start')+TF(392,230,'the sum does not.',13,C.muted,'start');
  out+=D2_note('Counts are found from the convex hull of the corner points. Dashed: hidden edges.',366);
  return {svg:out,phase:degs.length?`Cutting a corner where ${degs[degs.length-1]} edges meet removes 1 corner and adds ${degs[degs.length-1]}, adds ${degs[degs.length-1]} edges along the cut and 1 new face (shaded). The changes cancel: ${degs[degs.length-1]-1} − ${degs[degs.length-1]} + 1 = 0. Now ${V} − ${E} + ${F} = ${V-E+F}.`:`The ${D2_SOLIDS[s.si].name} has ${V} corners, ${E} edges and ${F} faces, found from its coordinates, and ${V} − ${E} + ${F} = ${V-E+F}.`};
 }});

// A ring of unit cubes: V − E + F counted on the unit squares of its surface.
const D2_FRAMES={solid:[[1,0],[2,0],[3,0],[1,1],[2,1],[3,1],[1,2],[2,2],[3,2]],frame:[[1,0],[2,0],[3,0],[1,1],[3,1],[1,2],[2,2],[3,2]],two:[[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[2,1],[4,1],[0,2],[1,2],[2,2],[3,2],[4,2]]};
function D2_surface(cells){const has=new Set(cells.map(c=>c.join(','))),sq=[],key=p=>p.join(',');
 for(const [x,y] of cells)for(const [dx,dy,dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){if(!dz&&has.has((x+dx)+','+(y+dy)))continue;
  const c=[x+.5+dx/2,y+.5+dy/2,.5+dz/2],ax=[[1,0,0],[0,1,0],[0,0,1]].filter((a,i)=>![dx,dy,dz][i]);
  sq.push({pts:[[-1,-1],[1,-1],[1,1],[-1,1]].map(([s,t])=>c.map((v,i)=>v+s*ax[0][i]/2+t*ax[1][i]/2)),n:[dx,dy,dz]})}
 const V=new Set(),E=new Map();for(const s of sq){s.pts.forEach((p,i)=>{V.add(key(p));const q=s.pts[(i+1)%4],k=[key(p),key(q)].sort().join('|');E.set(k,(E.get(k)||0)+1)})}
 const pinch=[...E.values()].some(v=>v>2);
 // holes: empty cells (in a padded grid) not connected to the outside
 const W=7,H=5,seen=new Set(),st=[[0,0]];seen.add('0,0');while(st.length){const [a,b]=st.pop();for(const [da,db] of [[1,0],[-1,0],[0,1],[0,-1]]){const u=a+da,v=b+db;if(u<0||v<0||u>=W||v>=H)continue;const k=u+','+v;if(seen.has(k)||has.has((u-1)+','+(v-1)))continue;seen.add(k);st.push([u,v])}}
 const holes=new Set();for(let u=0;u<W;u++)for(let v=0;v<H;v++){const k=u+','+v;if(!seen.has(k)&&!has.has((u-1)+','+(v-1)))holes.add(k)}
 // count holes as connected groups of enclosed empty cells
 let g=0;const hs=new Set();for(const k of holes){if(hs.has(k))continue;g++;const s2=[k];hs.add(k);while(s2.length){const [a,b]=s2.pop().split(',').map(Number);for(const [da,db] of [[1,0],[-1,0],[0,1],[0,-1]]){const k2=(a+da)+','+(b+db);if(holes.has(k2)&&!hs.has(k2)){hs.add(k2);s2.push(k2)}}}}
 return {sq,V:V.size,E:E.size,F:sq.length,pinch,holes:g}}
SCENE({id:'euler-formula-frame',name:'A polyhedron with a hole',tag:'Lhuilier’s counterexample, 1813',
 definition:'Euler’s 2 holds for every convex polyhedron, but not for every polyhedron. In 1813 Simon Lhuilier pointed out solids with a tunnel through them, like a picture frame, for which V − E + F is not 2. Imre Lakatos made this story, and the arguments over what should count as a polyhedron, the heart of his book Proofs and Refutations (1976). The number V − E + F turns out to measure the holes: each tunnel lowers it by 2.',
 get example(){const a=D2_surface(D2_FRAMES.solid),b=D2_surface(D2_FRAMES.frame),c=D2_surface(D2_FRAMES.two);return `Build a block from unit cubes and count the unit squares on its surface. A solid 3 × 3 block gives ${a.V} − ${a.E} + ${a.F} = ${a.V-a.E+a.F}. Remove the middle cube to make a frame and the count gives ${b.V} − ${b.E} + ${b.F} = ${b.V-b.E+b.F}; with two holes it gives ${c.V-c.E+c.F}. The pattern 2 − 2 × (number of holes) returns in the lessons on surfaces.`},
 desc:'A slab of unit cubes drawn in three dimensions, a map of which cells hold cubes that the learner can change, and counts of corners, edges and square faces on its surface with V − E + F and the number of holes.',
 research:['Lhuilier (1813). Mémoire sur la polyédrométrie. Annales de mathématiques pures et appliquées (Gergonne’s Annales): polyhedra with tunnels, for which Euler’s relation fails.','Lakatos (1976). Proofs and Refutations: The Logic of Mathematical Discovery. Cambridge University Press: the picture frame and other “monsters”.'],
 dur:12,hint:'Press cells of the map to add or remove cubes, or choose a ready-made block. Make a hole and watch V − E + F drop by 2. Cubes that touch only along an edge make a pinched surface.',
 init:()=>({cells:D2_FRAMES.frame.map(c=>c.slice()),yaw:30}),
 watch:p=>({cells:(p<.33?D2_FRAMES.solid:p<.67?D2_FRAMES.frame:D2_FRAMES.two).map(c=>c.slice()),yaw:Math.round(20+40*p)}),
 ui:[{choose:[['solid','Solid block'],['frame','Frame'],['two','Two holes']],label:'Block',get:s=>Object.keys(D2_FRAMES).find(k=>D2_FRAMES[k].map(String).sort().join()===s.cells.map(String).sort().join())||'',act:'lay'},{range:'yaw',label:'Turn (degrees)',min:0,max:90,step:5,get:s=>s.yaw,act:'yaw'}],
 on:{lay(s,v){if(D2_FRAMES[v])s.cells=D2_FRAMES[v].map(c=>c.slice())},yaw(s,v){s.yaw=clamp(+v,0,90)},
  cell(s,v){const [x,y]=String(v).split(',').map(Number);if(!(x>=0&&x<5&&y>=0&&y<3))return;const i=s.cells.findIndex(c=>c[0]===x&&c[1]===y);if(i>=0){if(s.cells.length>1)s.cells.splice(i,1)}else s.cells.push([x,y])}},
 draw(s,f,X){
  const S=D2_surface(s.cells),chi=S.V-S.E+S.F,vw=D2_view(s.yaw*Math.PI/180,.62),cen=[2.5,1.5,.5],ref=[[0,0,0],[5,0,0],[0,3,0],[5,3,0],[0,0,1],[5,0,1],[0,3,1],[5,3,1]].map(p=>vw(D2_sub(p,cen))),fit=D2_fit(ref,30,70,320,230,999);
  let out=heading(S.pinch?`A pinched surface: V − E + F = ${chi}`:`${S.holes} hole${S.holes===1?'':'s'}: ${S.V} − ${S.E} + ${S.F} = ${chi}`);
  const faces=S.sq.map(q=>({q,d:q.pts.reduce((a,p)=>a+vw(D2_sub(p,cen))[2],0)/4})).filter(o=>vw(o.q.n)[2]>-1e-9).sort((a,b)=>a.d-b.d);
  for(const {q} of faces){const col=q.n[2]>0?C.pale:q.n[2]<0?'#c9d9e4':Math.abs(q.n[0])?'#b6cfe0':'#d5e5f0';out+=`<polygon points="${q.pts.map(p=>fit(vw(D2_sub(p,cen)))).map(p=>p.map(fmt).join(',')).join(' ')}" fill="${col}" stroke="${C.blue}" stroke-width="1.2" stroke-linejoin="round"/>`}
  // map
  const mx=402,my=74,c=34;out+=TF(mx,my-10,'Press to add or remove a cube',13,C.muted,'start');
  for(let y=0;y<3;y++)for(let x=0;x<5;x++){const on=s.cells.some(q=>q[0]===x&&q[1]===y);out+=hit(X,'cell',x+','+y,`Cell ${x+1}, ${y+1}: ${on?'a cube':'empty'}. Press to change.`,R(mx+x*c,my+(2-y)*c,c-3,c-3,on?C.blue:'#fff',C.line,4))}
  out+=D2_tile(402,186,84,'V',String(S.V),C.blue)+D2_tile(494,186,84,'E',String(S.E),C.blue)+D2_tile(402,240,84,'F',String(S.F),C.blue)+D2_tile(494,240,84,'V − E + F',String(chi),C.green);
  out+=TF(490,308,S.pinch?'edges shared by 4 squares':`2 − 2 × ${S.holes} = ${2-2*S.holes}`,13,S.pinch?C.coral:C.green);
  out+=D2_note('Every unit square on the surface counts as one face; a hidden side is not drawn.',366);
  return {svg:out,phase:S.pinch?'Two cubes meet only along an edge, so four squares share that edge and the surface is pinched there. Euler’s count still gives a number, but it no longer describes a single smooth surface. Fill in a neighbouring cell to remove the pinch.':
   `The surface has ${S.V} corners, ${S.E} edges and ${S.F} square faces, so V − E + F = ${chi}. With ${S.holes} tunnel${S.holes===1?'':'s'} through the block, that is 2 − 2 × ${S.holes}. ${S.holes?'Lhuilier saw that Euler’s 2 needs a solid without tunnels.':'A block with no tunnel gives Euler’s 2, however it is cut into squares.'}`};
 }});

// Four dimensions: V − E + F − C for the six regular polytopes, prisms and duoprisms, all from coordinates.
function D2_prism(si){const P=D2_SOLIDS[si].pts(),L=D2_lat(D2_SOLIDS[si].key),e=L.faces[1][0],h=Math.sqrt(D2_dist2(P[e[0]],P[e[1]]));return P.flatMap(p=>[[...p,h/2],[...p,-h/2]])}
function D2_duo(p,q){const rp=.5/Math.sin(Math.PI/p),rq=.5/Math.sin(Math.PI/q),out=[];for(let i=0;i<p;i++)for(let j=0;j<q;j++)out.push([rp*Math.cos(2*Math.PI*i/p),rp*Math.sin(2*Math.PI*i/p),rq*Math.cos(2*Math.PI*j/q),rq*Math.sin(2*Math.PI*j/q)]);return out}
const D2_P4LIST=D2_FOUR.map(x=>({name:x.name,key:x.key,reg:1})).concat([[0,'tetrahedral prism'],[2,'octahedral prism'],[4,'icosahedral prism'],[3,'dodecahedral prism']].map(([si,name])=>({name,key:'pr'+si,pts:()=>D2_prism(si)})),[[3,3],[3,5],[5,6]].map(([p,q])=>({name:`${p}-${q} duoprism`,key:'du'+p+q,pts:()=>D2_duo(p,q)})));
const D2_lat4=i=>{const it=D2_P4LIST[i];return it.reg?D2_lat(it.key):D2_memo('lat'+it.key,()=>D2_lattice(it.pts()))};
SCENE({id:'euler-formula-4d',name:'V − E + F − C = 0',tag:'Euler’s count one dimension up',
 definition:'In four dimensions a polytope has corners V, edges E, faces F and three-dimensional cells C, and for every convex one V − E + F − C = 0. The signs alternate with the dimension of the part. Schläfli stated the rule for every dimension in his unpublished book of 1852; Henri Poincaré proved a far more general form in 1893–95, the Euler–Poincaré formula, which works for spaces that are not polytopes at all.',
 get example(){const t=D2_lat('4,3,3').f,s=D2_lat('3,3,4').f;return `Tesseract: ${t[0]} − ${t[1]} + ${t[2]} − ${t[3]} = ${t[0]-t[1]+t[2]-t[3]}. Its dual, the 16-cell: ${s[0]} − ${s[1]} + ${s[2]} − ${s[3]} = ${s[0]-s[1]+s[2]-s[3]}. The rule holds for shapes that are not regular too: prisms over the Platonic solids and duoprisms, products of two polygons, all give 0 when counted from their coordinates.`},
 desc:'A projection of a chosen four-dimensional polytope, with its corners, edges, faces and cells counted from its convex hull, and the alternating sum V − E + F − C built up term by term.',
 research:['Schläfli (written 1850–52, published 1901). Theorie der vielfachen Kontinuität: the alternating sum of the numbers of parts in n dimensions.','Poincaré (1893). Sur la généralisation d’un théorème d’Euler relatif aux polyèdres. Comptes rendus 117; and (1895) Analysis situs.'],
 dur:16,hint:'Step through the polytopes, regular and not, and read the alternating sum. Every count is found from the polytope’s coordinates, not from a table.',
 init:()=>({i:1,ang:20}),
 watch:p=>({i:Math.min(D2_P4LIST.length-1,Math.floor(p*D2_P4LIST.length)),ang:Math.round(10+30*p)}),
 ui:[{range:'i',label:'Polytope',min:0,max:D2_P4LIST.length-1,get:s=>s.i,act:'i',show:v=>D2_P4LIST[v].name},{range:'ang',label:'Turn in 4D (degrees)',min:0,max:90,step:2,get:s=>s.ang,act:'ang'}],
 on:{i(s,v){s.i=clamp(Math.round(+v),0,D2_P4LIST.length-1)},ang(s,v){s.ang=clamp(+v,0,90)}},
 draw(s){
  const it=D2_P4LIST[s.i],L=D2_lat4(s.i),[V,E,F,Cc]=L.f,big=V>200;
  const d=D2_draw4(L,s.ang,[24,50,320,290],{w:big?.7:1.4,faint:big?'#c9d8e2':'#8fb0c6'});
  let out=heading(`${it.name[0].toUpperCase()+it.name.slice(1)}: ${V} − ${E} + ${F} − ${Cc} = ${V-E+F-Cc}`);out+=d.svg;
  const terms=[['V',V,1],['E',E,-1],['F',F,1],['C',Cc,-1]];let run=0;
  terms.forEach(([n,v,sg],j)=>{run+=sg*v;const y=56+j*50;out+=D2_tile(370,y,104,(sg>0?'+ ':'− ')+n,D2_num(v),sg>0?C.green:C.coral)+TF(532,y+17,'running sum',13,C.muted)+TBF(532,y+38,D2_minus(D2_num(run)),16,C.ink)});
  const cs=L.faces[3].map(c=>c.length),mix={};cs.forEach(n=>{mix[n]=(mix[n]||0)+1});
  out+=TF(370,272,`Cells by corners: ${Object.keys(mix).map(k=>`${mix[k]} with ${k}`).join(', ')}`,13,C.muted,'start');
  if(it.reg){const du=D2_FOUR.find(x=>x.key===it.key.split(',').reverse().join(','));out+=TF(370,292,`Dual: ${du.name} (${D2_lat(du.key).f.join(', ')})`,13,C.purple,'start')}
  out+=D2_note('Turned in the xw plane and projected to the page. Counts from the convex hull of the corners.',366);
  return {svg:out,phase:`The ${it.name} has ${V} corners, ${E} edges, ${F} two-dimensional faces and ${Cc} cells, found by computing its convex hull. Adding the corners and faces and subtracting the edges and cells gives ${V-E+F-Cc}, as for every convex polytope in four dimensions.${it.reg?' For a regular polytope and its dual, corners swap with cells and edges with faces, so the sum is 0 for both.':''}`};
 }});

// Every dimension: the alternating sum of the proper faces is 1 − (−1)ⁿ.
const D2_FAM={cube:{name:'n-cube',f:(n,k)=>D2_cubeFaceCount(n,k)},simplex:{name:'n-simplex',f:(n,k)=>D2_simplexFaceCount(n,k)},cross:{name:'n-cross-polytope',f:(n,k)=>D2_crossFaceCount(n,k)}};
SCENE({id:'euler-formula-n',name:'The alternating sum in every dimension',tag:'Schläfli, Poincaré and a gap filled in 1971',
 definition:'For a convex polytope in n dimensions, add the numbers of corners, two-dimensional faces, four-dimensional faces … and subtract the numbers of edges, three-dimensional faces …, stopping before the polytope itself. The answer is always 1 − (−1)ⁿ: 2 in odd dimensions and 0 in even ones. Counting the polytope itself as one more term makes the total 1 in every dimension. Schläfli’s proof assumed that every polytope can be built up facet by facet in a well-behaved order; that assumption, shellability, was proved only by Bruggesser and Mani in 1971. Poincaré had meanwhile proved the rule by other means.',
 get example(){const f=range(5).map(k=>D2_cubeFaceCount(5,k));return `The 5-cube: ${f.map((v,k)=>(k?(k%2?' − ':' + '):'')+v).join('')} = ${f.reduce((a,v,k)=>a+(k%2?-v:v),0)}, which is 1 − (−1)⁵. The 6-simplex: ${range(6).map(k=>(k?(k%2?' − ':' + '):'')+D2_simplexFaceCount(6,k)).join('')} = ${range(6).reduce((a,k)=>a+(k%2?-1:1)*D2_simplexFaceCount(6,k),0)}, which is 1 − (−1)⁶.`},
 desc:'A table of the numbers of faces of each dimension of a chosen n-cube, n-simplex or n-cross-polytope, counted from its generated corners, with alternating signs, the running sum and the formula 1 − (−1)ⁿ, and the learner’s prediction.',
 research:['Schläfli (written 1850–52, published 1901). Theorie der vielfachen Kontinuität.','Poincaré (1893; 1895). The Euler–Poincaré formula.','Bruggesser & Mani (1971). Shellable decompositions of cells and spheres. Mathematica Scandinavica 29, 197–205.'],
 dur:14,hint:'For each family and dimension, predict the alternating sum with the buttons; the count is revealed once you have predicted. Changing n or the family asks again.',
 init:()=>({fam:'cube',n:5,guess:''}),
 watch:p=>{const fams=['cube','simplex','cross'],k=Math.min(2,Math.floor(p*3));return {fam:fams[k],n:3+Math.floor((p*3-k)*4),guess:''}},
 ui:[{choose:[['cube','n-cube'],['simplex','n-simplex'],['cross','n-cross-polytope']],label:'Family',get:s=>s.fam,act:'fam'},{range:'n',label:'Dimension n',min:1,max:8,get:s=>s.n,act:'n'},{choose:[['0','I predict 0'],['1','I predict 1'],['2','I predict 2']],label:'Prediction',get:s=>s.guess,act:'guess'}],
 on:{fam(s,v){s.fam=D2_FAM[v]?v:'cube';s.guess=''},n(s,v){s.n=clamp(Math.round(+v),1,8);s.guess=''},guess(s,v){s.guess=['0','1','2'].includes(String(v))?String(v):''}},
 draw(s,f,X){
  const n=s.n,F=D2_FAM[s.fam],fk=range(n).map(k=>F.f(n,k)),alt=fk.reduce((a,v,k)=>a+(k%2?-v:v),0),formula=1-(-1)**n;
  let out=heading(`${F.name.replace('n-',n+'-')}: the alternating sum is ${alt}`);
  const tx=40,ty=66,rh=Math.min(28,230/Math.max(1,n));out+=TF(tx,ty,'k',13,C.muted,'start')+TF(tx+70,ty,'faces',13,C.muted,'start')+TF(tx+260,ty,'sign',13,C.muted)+TF(tx+380,ty,'running sum',13,C.muted);
  const hide=X&&X.try&&s.guess==='';
  let run=0;fk.forEach((v,k)=>{run+=(k%2?-v:v);const y=ty+18+k*rh;out+=R(tx-8,y-14,520,rh-3,k%2?C.coralp:C.greenp,'none',4)+TF(tx,y+2,String(k),13,C.ink,'start')+TMF(tx+70,y+2,D2_num(v),13,C.ink,'start');
   out+=R(tx+120,y-9,Math.max(1,110*v/Math.max(...fk)),Math.max(6,rh-12),k%2?C.coral:C.green,'none',3)+TBF(tx+260,y+2,k%2?'−':'+',14,k%2?C.coral:C.green)+TMF(tx+380,y+2,hide?'?':D2_minus(D2_num(run)),13,C.ink)});
  const yb=ty+24+n*rh;
  if(hide)out+=TF(300,yb+6,'Predict the alternating sum with the buttons to reveal it.',14,C.purple);
  else{out+=TF(300,yb+6,`Sum: ${alt}.   Formula 1 − (−1)${D2_sp(n)} = ${formula}.   ${alt===formula?'✓':'✗'}`,14,alt===formula?C.green:C.coral);
  out+=TF(300,yb+26,`With the ${n}-dimensional polytope itself as one more term: ${alt} ${n%2?'−':'+'} 1 = ${alt+(n%2?-1:1)}`,13,C.muted);
  if(s.guess!=='')out+=TF(300,yb+46,`Your prediction: ${s.guess}. ${+s.guess===alt?'Right.':'The count says '+alt+'.'}`,13,+s.guess===alt?C.green:C.coral)}
  out+=D2_note('Face counts by listing the generated corners and grouping them into faces.',372);
  return {svg:out,phase:hide?`For the ${n}-dimensional ${F.name.slice(2)} the numbers of faces of dimension 0 to ${n-1} are ${fk.map(D2_num).join(', ')}. Add them with alternating signs, starting with + for the corners: what do you get? Choose a prediction to see the count.`:`For the ${n}-dimensional ${F.name.slice(2)} the numbers of faces of dimension 0 to ${n-1} are ${fk.map(D2_num).join(', ')}. With alternating signs they sum to ${alt}, which is 1 − (−1)${D2_sp(n)}: ${n%2?'2 in odd dimensions':'0 in even dimensions'}.`};
 }});
