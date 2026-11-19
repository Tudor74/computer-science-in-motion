/* ===================== Dimensions In Motion · Era 3 · Seeing the fourth dimension ===================== */
// Slices, Schlegel diagrams, rotation in four dimensions, nets, Hinton's coloured cubes, stereographic projection.
// Every picture is a pure function of state, frame and X. Every count, length, angle and volume on screen is
// computed here from generated vertex and edge lists or from the formula named beside it. The only typed numbers
// are historical facts (dates, Turney's 261), and those carry a research line.
// 4D objects are rotated, sliced and projected by this file's own code; the 3D view only turns the camera.

/* ---- shared helpers ---- */
const D3_EPS=1e-7;
const D3_dot=(a,b)=>{let s=0;for(let i=0;i<a.length;i++)s+=a[i]*b[i];return s};
const D3_sub=(a,b)=>a.map((v,i)=>v-b[i]);
const D3_add=(a,b)=>a.map((v,i)=>v+b[i]);
const D3_mul=(a,k)=>a.map(v=>v*k);
const D3_len=a=>Math.sqrt(D3_dot(a,a));
const D3_unit=a=>{const l=D3_len(a)||1;return a.map(v=>v/l)};
const D3_cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const D3_mean=pts=>pts.length?pts[0].map((_,i)=>sum(pts.map(p=>p[i]))/pts.length):[];
const D3_f=(v,d=2)=>{const r=Number(v).toFixed(d);return /^-0(\.0+)?$/.test(r)?r.slice(1):r.replace('-','−')};
const D3_note=(s,y=370)=>TF(300,y,s,13,C.muted);
const D3_tile=(x,y,w,label,value,col=C.blue)=>R(x,y,w,46,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+38,value,15,col);
const D3_choose=(n,k)=>{if(k<0||k>n)return 0;let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return Math.round(r)};
const D3_SUB=['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'];
const D3_AX='xyzw';
// The n-cube: vertices are all 0/1 strings of length n; edges join strings that differ in one place.
const D3_cubeV=n=>range(1<<n).map(i=>range(n).map(k=>(i>>k)&1));
const D3_cubeE=n=>{const E=[];for(let i=0;i<1<<n;i++)for(let k=0;k<n;k++){const j=i^(1<<k);if(j>i)E.push([i,j,k])}return E};
// Edges as nearest-neighbour pairs (for the 5-cell, 16-cell and 24-cell).
function D3_nnEdges(V){let m=Infinity;for(let i=0;i<V.length;i++)for(let j=i+1;j<V.length;j++)m=Math.min(m,D3_len(D3_sub(V[i],V[j])));
 const E=[];for(let i=0;i<V.length;i++)for(let j=i+1;j<V.length;j++)if(Math.abs(D3_len(D3_sub(V[i],V[j]))-m)<1e-6)E.push([i,j]);return E}
// A fixed camera for the 2D drawings (the 3D panel has its own camera, turned by the learner).
function D3_view(yaw,pitch,cx,cy,sc){const c=Math.cos(yaw),s=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
 return ([x,y,z])=>{const a=x*c-y*s,b=x*s+y*c;return [cx+a*sc,cy+(-b*sp-z*cp)*sc,-b*cp+z*sp]}}
const D3_poly=(pts,col,w=2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const D3_polygon=(pts,fill,stroke,extra='')=>`<polygon points="${pts.map(p=>fmt(p[0])+','+fmt(p[1])).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round" ${extra}/>`;
// Orthonormal basis of the hyperplane perpendicular to m (Gram–Schmidt on the coordinate axes).
function D3_basis(m){const n=D3_unit(m),B=[];for(let i=0;i<m.length&&B.length<m.length-1;i++){let v=m.map((_,j)=>j===i?1:0);v=D3_sub(v,D3_mul(n,D3_dot(v,n)));for(const b of B)v=D3_sub(v,D3_mul(b,D3_dot(v,b)));if(D3_len(v)>1e-6)B.push(D3_unit(v))}return B}
// Slice a polytope (vertex list V, edge list E) by the hyperplane m·x = h: intersect every edge, remove repeats.
// Returns the points in the hyperplane's own coordinates (one fewer than V's), about the point of the
// hyperplane nearest the centre `o`.
function D3_sliceP(V,E,m,h,o){
 const raw=[],mm=D3_dot(m,m),B=D3_basis(m);
 const put=p=>{if(!raw.some(q=>D3_len(D3_sub(p,q))<1e-7))raw.push(p)};
 for(const e of E){const a=V[e[0]],b=V[e[1]],da=D3_dot(a,m)-h,db=D3_dot(b,m)-h;
  if(Math.abs(da)<1e-9)put(a);if(Math.abs(db)<1e-9)put(b);
  if(da*db<0&&Math.abs(da)>1e-9&&Math.abs(db)>1e-9)put(D3_add(a,D3_mul(D3_sub(b,a),da/(da-db))))}
 const c=D3_add(o,D3_mul(m,(h-D3_dot(o,m))/mm));
 return raw.map(p=>B.map(b=>D3_dot(D3_sub(p,c),b)));
}
// Convex hull of points in 3D by brute force over triples (the point sets here are small).
// Returns {dim, pts, faces:[{idx:[ordered], n:[normal]}], V, E, F, vol, sides:{k:count}}.
function D3_hull3(pts){
 const n=pts.length,res={dim:-1,pts,faces:[],V:0,E:0,F:0,vol:0,sides:{},edges:[]};if(!n)return res;
 const cen=D3_mean(pts),seen=new Set(),order=(idx,nr)=>{const fc=D3_mean(idx.map(i=>pts[i]));let u=null;for(const i of idx){const d=D3_sub(pts[i],fc);if(D3_len(d)>1e-9){u=D3_unit(d);break}}
  if(!u)return idx;const w=D3_cross(nr,u);let o=idx.map(i=>{const d=D3_sub(pts[i],fc);return [i,Math.atan2(D3_dot(d,w),D3_dot(d,u))]}).sort((a,b)=>a[1]-b[1]).map(a=>a[0]);
  // drop points that sit in the middle of a side
  return o.filter((i,k)=>{const a=pts[o[(k+o.length-1)%o.length]],b=pts[o[(k+1)%o.length]],p=pts[i];return D3_len(D3_cross(D3_sub(p,a),D3_sub(b,a)))>1e-9})};
 for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)for(let k=j+1;k<n;k++){
  let nr=D3_cross(D3_sub(pts[j],pts[i]),D3_sub(pts[k],pts[i]));const l=D3_len(nr);if(l<1e-9)continue;nr=D3_mul(nr,1/l);
  const d=D3_dot(nr,pts[i]);let pos=0,neg=0;const on=[];
  for(let q=0;q<n;q++){const s=D3_dot(nr,pts[q])-d;if(s>D3_EPS)pos++;else if(s<-D3_EPS)neg++;else on.push(q)}
  if(pos&&neg)continue;if(!pos&&!neg){res.dim=2;continue}
  if(pos)nr=D3_mul(nr,-1);const key=on.join(',');if(seen.has(key))continue;seen.add(key);res.faces.push({idx:order(on,nr),n:nr});
 }
 if(res.faces.length){res.dim=3}
 else{let far=0,fi=0;pts.forEach((p,i)=>{const d=D3_len(D3_sub(p,pts[0]));if(d>far){far=d;fi=i}});
  if(far<1e-9){res.dim=0;res.V=1;return res}
  if(res.dim!==2){res.dim=1;res.V=2;res.E=1;res.ends=[0,fi];res.length=far;return res}
  // a flat polygon: its normal from any non-collinear triple
  let nr=null;for(let i=1;i<n&&!nr;i++)for(let j=i+1;j<n&&!nr;j++){const c=D3_cross(D3_sub(pts[i],pts[0]),D3_sub(pts[j],pts[0]));if(D3_len(c)>1e-9)nr=D3_unit(c)}
  const idx=order(range(n).filter(i=>true),nr);
  // keep only hull points: those not inside the polygon (points are vertices of a convex slice already)
  res.faces=[{idx,n:nr}];res.V=idx.length;res.E=idx.length;res.F=1;res.sides[idx.length]=1;
  let area=0;for(let k=1;k+1<idx.length;k++)area+=D3_len(D3_cross(D3_sub(pts[idx[k]],pts[idx[0]]),D3_sub(pts[idx[k+1]],pts[idx[0]])))/2;res.area=area;return res}
 const es=new Map();for(const f of res.faces){const m=f.idx.length;res.sides[m]=(res.sides[m]||0)+1;for(let k=0;k<m;k++){const a=f.idx[k],b=f.idx[(k+1)%m],key=Math.min(a,b)+'-'+Math.max(a,b);if(!es.has(key))es.set(key,[Math.min(a,b),Math.max(a,b)])}}
 res.edges=[...es.values()];res.E=res.edges.length;res.F=res.faces.length;res.V=new Set([].concat(...res.faces.map(f=>f.idx))).size;
 for(const f of res.faces)for(let k=1;k+1<f.idx.length;k++){const a=D3_sub(pts[f.idx[0]],cen),b=D3_sub(pts[f.idx[k]],cen),c=D3_sub(pts[f.idx[k+1]],cen);res.vol+=Math.abs(D3_dot(a,D3_cross(b,c)))/6}
 const L=res.edges.map(e=>D3_len(D3_sub(pts[e[0]],pts[e[1]])));res.emin=Math.min(...L);res.emax=Math.max(...L);
 return res;
}
// Convex polygon from points in the plane (slices of a cube): ordered by angle about their centre.
function D3_hull2(pts){if(!pts.length)return {dim:-1,idx:[],area:0};const c=D3_mean(pts);let far=0;pts.forEach(p=>far=Math.max(far,D3_len(D3_sub(p,c))));
 if(far<1e-9)return {dim:0,idx:[0],area:0};
 let idx=range(pts.length).sort((a,b)=>Math.atan2(pts[a][1]-c[1],pts[a][0]-c[0])-Math.atan2(pts[b][1]-c[1],pts[b][0]-c[0]));
 idx=idx.filter((i,k)=>{const a=pts[idx[(k+idx.length-1)%idx.length]],b=pts[idx[(k+1)%idx.length]],p=pts[i];return Math.abs((p[0]-a[0])*(b[1]-a[1])-(p[1]-a[1])*(b[0]-a[0]))>1e-9});
 if(idx.length<3){let fi=0,fd=0;pts.forEach((p,i)=>{const d=D3_len(D3_sub(p,pts[0]));if(d>fd){fd=d;fi=i}});return {dim:1,idx:[0,fi],area:0,length:fd}}
 let a=0;for(let k=0;k<idx.length;k++){const p=pts[idx[k]],q=pts[idx[(k+1)%idx.length]];a+=p[0]*q[1]-q[0]*p[1]}
 const L=idx.map((i,k)=>D3_len(D3_sub(pts[i],pts[idx[(k+1)%idx.length]])));
 return {dim:2,idx,area:Math.abs(a)/2,emin:Math.min(...L),emax:Math.max(...L)}}
const D3_SIDE_NAME={3:'triangle',4:'square',5:'pentagon',6:'hexagon',8:'octagon'};
const D3_SIDE_COL={3:C.blue,4:C.green,5:C.purple,6:C.amber};
const D3_sideCol=k=>D3_SIDE_COL[k]||C.coral;
// A name for a slice, decided from the computed faces (and, for the named solids, equal edges).
function D3_solidName(h){
 if(h.dim<0)return 'nothing';if(h.dim===0)return 'a single point';if(h.dim===1)return 'a line segment';
 if(h.dim===2){const k=h.V;return k===4?'a flat '+D3_faceKind(h,h.faces[0]):k===3?'a flat triangle':k===6?'a flat hexagon':`a flat ${k}-sided polygon`}
 const sg=Object.keys(h.sides).map(Number).sort((a,b)=>a-b).map(k=>k+'x'+h.sides[k]).join(' '),eq=h.emax-h.emin<1e-6;
 const rect=h.faces.every(f=>f.idx.length!==4||f.idx.every((v,k)=>{const p=h.pts,a=p[f.idx[(k+3)%4]],b=p[v],c=p[f.idx[(k+1)%4]];return Math.abs(D3_dot(D3_sub(a,b),D3_sub(c,b)))<1e-6}));
 if(sg==='3x4')return eq?'a regular tetrahedron':'a tetrahedron';
 if(sg==='4x6')return eq?'a cube':rect?'a box':'a solid with '+D3_faceList(h);
 if(sg==='3x8')return eq?'a regular octahedron':'an octahedron';
 if(sg==='3x2 4x3'&&rect)return 'a triangular prism';
 if(sg==='4x6 6x2'&&rect)return 'a hexagonal prism';
 if(sg==='3x4 6x4'&&eq)return 'a truncated tetrahedron';
 if(sg==='3x8 4x6'&&eq)return 'a cuboctahedron';
 if(sg==='4x6 6x8'&&eq)return 'a truncated octahedron';
 return 'a solid with '+D3_faceList(h);
}
function D3_faceKind(h,f){const k=f.idx.length,p=h.pts;if(k!==4)return D3_SIDE_NAME[k]||k+'-gon';
 const sides=f.idx.map((v,i)=>D3_len(D3_sub(p[v],p[f.idx[(i+1)%4]]))),right=f.idx.every((v,i)=>Math.abs(D3_dot(D3_sub(p[f.idx[(i+3)%4]],p[v]),D3_sub(p[f.idx[(i+1)%4]],p[v])))<1e-6);
 return right?(Math.max(...sides)-Math.min(...sides)<1e-6?'square':'rectangle'):'four-sided face'}
function D3_faceList(h){if(h.dim<3)return h.dim===2?`${h.V} sides`:'no faces';const c={},ord=[];
 for(const f of h.faces.slice().sort((a,b)=>a.idx.length-b.idx.length)){const k=D3_faceKind(h,f);if(!c[k]){c[k]=0;ord.push(k)}c[k]++}
 return ord.map(k=>`${c[k]} ${k}${c[k]>1?'s':''}`).join(', ')}
// Draw a hull with a fixed camera P; faces back to front, coloured by their number of sides.
function D3_drawHull(h,P,o={}){
 if(h.dim<0)return '';const pts=h.pts.map(P);
 if(h.dim===0)return Ci(pts[0][0],pts[0][1],6,C.coral);
 if(h.dim===1){const a=pts[h.ends[0]],b=pts[h.ends[1]];return L(a[0],a[1],b[0],b[1],C.coral,4)}
 let out='';const fs=h.faces.map(f=>({f,d:sum(f.idx.map(i=>pts[i][2]))/f.idx.length})).sort((a,b)=>a.d-b.d);
 for(const {f} of fs){const k=f.idx.length,col=o.col||D3_sideCol(k);out+=D3_polygon(f.idx.map(i=>pts[i]),tint(col,o.light===undefined?.62:o.light),o.stroke||C.dark,`fill-opacity="${o.op||.82}"`)}
 return out;
}
function D3_paintHull(h,Pr,o={}){
 if(h.dim<0)return '';
 if(h.dim===0)return point3(h.pts[0],Pr,C.coral,6);
 if(h.dim===1)return line3(h.pts[h.ends[0]],h.pts[h.ends[1]],Pr,C.coral,4);
 return paintFaces(h.faces.map(f=>({pts:f.idx.map(i=>h.pts[i]),fill:o.col||D3_sideCol(f.idx.length),opacity:.45,stroke:C.dark})),Pr);
}
// Simpson's rule on equally spaced samples (an even number of intervals).
function D3_simpson(ys,dx){const n=ys.length-1;let s=ys[0]+ys[n];for(let i=1;i<n;i++)s+=ys[i]*(i%2?4:2);return s*dx/3}
// A small plot frame: returns {svg, X, Y}.
function D3_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-7,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}

/* ===================== Lesson: slicing ===================== */
// The unit tesseract [0,1]^4, generated, and the four ways it can meet our space first.
const D3_TV=D3_cubeV(4),D3_TE=D3_cubeE(4),D3_HALF4=[.5,.5,.5,.5];
const D3_ORIENT=[
 {id:'cell',m:[0,0,0,1],first:'a cube (cell)',label:'Cell first'},
 {id:'face',m:[0,0,1,1],first:'a square',label:'Face first'},
 {id:'edge',m:[0,1,1,1],first:'an edge',label:'Edge first'},
 {id:'vertex',m:[1,1,1,1],first:'a corner',label:'Vertex first'}];
const D3_hmax=m=>sum(m);           // m·x runs from 0 to sum(m) over the unit tesseract (every m here is 0/1)
const D3_eqn=(m,h)=>m.map((v,i)=>v?'x'+D3_SUB[i+1]:'').filter(Boolean).join(' + ')+' = '+D3_f(h);
function D3_tSlice(oi,t){const m=D3_ORIENT[oi].m,h=t*D3_hmax(m);return {m,h,hull:D3_hull3(D3_sliceP(D3_TV,D3_TE,m,h,D3_HALF4))}}
// Slice volume against distance travelled, 40 intervals, and the 4-volume it adds up to (Simpson's rule).
const D3_VOLCURVE={};
function D3_volCurve(oi){if(!D3_VOLCURVE[oi]){const m=D3_ORIENT[oi].m,ys=range(41).map(i=>D3_tSlice(oi,i/40).hull.vol),dist=D3_hmax(m)/D3_len(m);
 D3_VOLCURVE[oi]={ys,dist,total:D3_simpson(ys,dist/40),peak:Math.max(...ys)}}return D3_VOLCURVE[oi]}
function D3_sliceWatch(p){const oi=Math.min(3,Math.floor(p*4)),u=p*4-oi;return {oi,t:Math.round(100*smooth(clamp((u-.08)/.84,0,1)))}}
SCENE({id:'slicing',name:'A tesseract passing through our space',tag:'Slices, after Flatland',
 definition:'A Flatlander sees a passing sphere only as the circle where it cuts the plane. In the same way we could see a four-dimensional object only as the solid where it cuts our three-dimensional space. Each slice here is computed: the hyperplane is intersected with all 32 edges of the tesseract, and the slice is the convex hull of the points where it cuts them.',
 example:'Cell first, the slice is a cube that appears all at once, stays the same, and vanishes. Face first it is a box that grows and shrinks. Edge first it is a prism, triangular, then hexagonal, then triangular. Vertex first it starts as a point and grows as a tetrahedron. Add up the slice volumes over the whole pass and you get the tesseract’s four-dimensional volume, 1, whichever way it travels.',
 desc:'A slice of the tesseract drawn as a solid with its faces coloured by number of sides, beside a graph of the slice’s volume against the distance the tesseract has travelled, and tiles for the shape’s name, its faces and its Euler count.',
 research:['Abbott (1884). Flatland: A Romance of Many Dimensions (the Sphere passing through the plane).','Alicia Boole Stott (1900). On certain series of sections of the regular four-dimensional hypersolids. Verhandelingen der Koninklijke Akademie van Wetenschappen te Amsterdam 7(3).'],
 dur:20,hint:'Choose which part of the tesseract meets our space first, then move the slider to push it through. Switch to 3D to turn the slice. Watch the volume curve and the shape’s name.',
 init:()=>({oi:3,t:50}),
 watch:D3_sliceWatch,
 ui:[{choose:D3_ORIENT.map((o,i)=>[i,o.label]),label:'Orientation',get:s=>s.oi,act:'oi'},{range:'t',label:'How far through',min:0,max:100,get:s=>s.t,act:'t',show:v=>v+'%'}],
 on:{oi(s,v){s.oi=clamp(Math.round(+v),0,3)},t(s,v){s.t=clamp(Math.round(+v),0,100)}},
 draw(s){
  const o=D3_ORIENT[s.oi],{m,h,hull}=D3_tSlice(s.oi,s.t/100),vc=D3_volCurve(s.oi),d=h/D3_len(m);
  let out=heading(`${o.label}: the slice is ${D3_solidName(hull)}`);
  out+=R(16,46,300,276,'#fbfcfd',C.grid,8)+TF(26,66,'the slice, '+D3_eqn(m,h),13,C.muted,'start');
  out+=D3_drawHull(hull,D3_view(.35,.85,166,192,108));
  // volume against distance travelled
  const pl=D3_plot(370,62,206,130,[0,vc.dist],[0,Math.max(1.05,vc.peak*1.1)],{xt:[[0,'0'],[vc.dist,D3_f(vc.dist)]],yt:[[0,'0'],[1,'1']],xl:'distance travelled',xlDy:30,yl:'volume of the slice'});
  out+=pl.svg+D3_poly(vc.ys.map((y,i)=>[pl.X(i/40*vc.dist),pl.Y(y)]),C.blue,2.2)+Ci(pl.X(d),pl.Y(hull.vol),6,C.coral,'#fff');
  out+=D3_tile(334,236,120,'Volume',D3_f(hull.vol,3),C.coral)+D3_tile(462,236,124,'V − E + F',hull.dim===3?`${hull.V} − ${hull.E} + ${hull.F} = ${hull.V-hull.E+hull.F}`:'flat',C.ink);
  out+=TF(334,306,hull.dim===3?'Faces: '+D3_faceList(hull):hull.dim===2?`A flat polygon with ${hull.V} sides`:'',13,C.ink,'start');
  out+=TF(334,326,`All slices add up to ${D3_f(vc.total,3)}`,13,C.green,'start');
  out+=D3_note('Each slice is computed from the 32 edges of the unit tesseract.',360);
  const ph=hull.dim<3?`The tesseract is only touching our space: the slice is ${D3_solidName(hull)}, ${o.first==='a cube (cell)'?'one of its cubic cells':'the part of the tesseract that arrives first'}. Push it further in.`:
   `At ${s.t}% of the way through, the slice is ${D3_solidName(hull)} with ${D3_faceList(hull)}: ${hull.V} corners, ${hull.E} edges and ${hull.F} faces, and V − E + F = ${hull.V-hull.E+hull.F}. Its volume is ${D3_f(hull.vol,3)}. Every face is where our space cuts one of the tesseract’s eight cubes.`;
  return {svg:out,phase:ph};
 },
 three(s,f,X,project){
  const {hull}=D3_tSlice(s.oi,s.t/100),Pr=project([-1,1,-1,1,-1,1]);
  return {svg:D3_paintHull(hull,Pr),title:'The slice in 3D',caption:`The slice is computed in four dimensions from the tesseract’s edges; this view only turns the camera on the solid found. ${D3_solidName(hull)[0].toUpperCase()+D3_solidName(hull).slice(1)}, ${D3_faceList(hull)}.`};
 }});

// One dimension down: a unit cube passing through Flatland, sliced by m·x = h.
const D3_CV=D3_cubeV(3),D3_CE=D3_cubeE(3),D3_HALF3=[.5,.5,.5];
const D3_CORIENT=[{m:[0,0,1],label:'Face first',first:'a square face'},{m:[0,1,1],label:'Edge first',first:'an edge'},{m:[1,1,1],label:'Vertex first',first:'a corner'}];
function D3_cSlice(oi,t){const m=D3_CORIENT[oi].m,h=t*sum(m),B=D3_basis(m),pts=D3_sliceP(D3_CV,D3_CE,m,h,D3_HALF3),hull=D3_hull2(pts);
 const c=D3_add(D3_HALF3,D3_mul(m,(h-D3_dot(D3_HALF3,m))/D3_dot(m,m)));return {m,h,pts,hull,P3:pts.map(q=>D3_add(c,D3_add(D3_mul(B[0],q[0]),D3_mul(B[1],q[1]))))}}
const D3_AREACURVE={};
function D3_areaCurve(oi){if(!D3_AREACURVE[oi]){const m=D3_CORIENT[oi].m,ys=range(41).map(i=>D3_cSlice(oi,i/40).hull.area),dist=sum(m)/D3_len(m);D3_AREACURVE[oi]={ys,dist,total:D3_simpson(ys,dist/40),peak:Math.max(...ys)}}return D3_AREACURVE[oi]}
const D3_polyName=h=>h.dim<0?'nothing':h.dim===0?'a point':h.dim===1?'a line segment':(h.idx.length===3?(h.emax-h.emin<1e-6?'an equilateral triangle':'a triangle'):h.idx.length===4?(h.emax-h.emin<1e-6?'a square':'a rectangle'):h.idx.length===6?(h.emax-h.emin<1e-6?'a regular hexagon':'a hexagon'):`a ${h.idx.length}-sided polygon`);
SCENE({id:'slicing-cube',name:'One dimension down: a cube through Flatland',tag:'The analogy that makes slices readable',
 definition:'Before reading four-dimensional slices, read three-dimensional ones as a Flatlander would. A cube passing through a plane shows only the polygon where it cuts the plane. Which polygons appear depends on how the cube is turned: the same cube can look like a square, a rectangle, a triangle or a hexagon.',
 example:'Face first, a Flatlander sees a square that appears, stays, and vanishes, just as the tesseract’s slice is a constant cube when it comes cell first. Corner first, the Flatlander sees a point that grows into a triangle, turns into a hexagon, and shrinks back to a triangle and a point. At the middle the hexagon is regular.',
 desc:'A cube drawn in perspective with the slicing plane through it and the cut outlined, beside the polygon a Flatlander would see, a graph of its area against distance travelled, and tiles for its number of sides and its area.',
 research:['Abbott (1884). Flatland: A Romance of Many Dimensions.','Hinton (1880). What is the fourth dimension? Dublin University Magazine; reprinted in Scientific Romances (1884).'],
 dur:15,hint:'Choose how the cube meets the plane, then push it through with the slider. Compare the cube’s polygons with the tesseract’s solids in the first scene.',
 init:()=>({oi:2,t:50}),
 watch(p){const oi=Math.min(2,Math.floor(p*3)),u=p*3-oi;return {oi,t:Math.round(100*smooth(clamp((u-.08)/.84,0,1)))}},
 ui:[{choose:D3_CORIENT.map((o,i)=>[i,o.label]),label:'Orientation',get:s=>s.oi,act:'oi'},{range:'t',label:'How far through',min:0,max:100,get:s=>s.t,act:'t',show:v=>v+'%'}],
 on:{oi(s,v){s.oi=clamp(Math.round(+v),0,2)},t(s,v){s.t=clamp(Math.round(+v),0,100)}},
 draw(s){
  const o=D3_CORIENT[s.oi],{m,h,pts,hull,P3}=D3_cSlice(s.oi,s.t/100),ac=D3_areaCurve(s.oi);
  let out=heading(`${o.label}: Flatland sees ${D3_polyName(hull)}`);
  // the cube with its cut
  const Pv=D3_view(.62,.5,150,178,120),C3=D3_CV.map(v=>D3_sub(v,D3_HALF3)).map(Pv);
  out+=R(16,46,272,256,'#fbfcfd',C.grid,8)+TF(26,66,'the cube and the cut',13,C.muted,'start');
  for(const e of D3_CE){const a=C3[e[0]],b=C3[e[1]];out+=L(a[0],a[1],b[0],b[1],C.line,2)}
  if(hull.dim===2)out+=D3_polygon(hull.idx.map(i=>Pv(D3_sub(P3[i],D3_HALF3))),tint(C.coral,.55),C.coral,'fill-opacity=".85"');
  else if(hull.dim===1){const a=Pv(D3_sub(P3[hull.idx[0]],D3_HALF3)),b=Pv(D3_sub(P3[hull.idx[1]],D3_HALF3));out+=L(a[0],a[1],b[0],b[1],C.coral,4)}
  else if(hull.dim===0){const a=Pv(D3_sub(P3[0],D3_HALF3));out+=Ci(a[0],a[1],6,C.coral)}
  // what Flatland sees
  out+=R(300,46,284,150,'#fff',C.grid,8)+TF(310,66,'what a Flatlander sees',13,C.muted,'start');
  const fx=q=>[442+q[0]*72,128-q[1]*72];
  if(hull.dim===2)out+=D3_polygon(hull.idx.map(i=>fx(pts[i])),tint(C.coral,.55),C.coral);
  else if(hull.dim===1){const a=fx(pts[hull.idx[0]]),b=fx(pts[hull.idx[1]]);out+=L(a[0],a[1],b[0],b[1],C.coral,4)}
  else if(hull.dim===0){const a=fx(pts[0]);out+=Ci(a[0],a[1],5,C.coral)}
  const pl=D3_plot(318,214,130,72,[0,ac.dist],[0,Math.max(1.1,ac.peak*1.1)],{xt:[[0,'0'],[ac.dist,D3_f(ac.dist)]],xl:'distance travelled',xlDy:30,yl:'area'});
  out+=pl.svg+D3_poly(ac.ys.map((y,i)=>[pl.X(i/40*ac.dist),pl.Y(y)]),C.blue,2)+Ci(pl.X(h/D3_len(m)),pl.Y(hull.area),5,C.coral,'#fff');
  out+=D3_tile(466,206,118,'Sides',hull.dim===2?String(hull.idx.length):'none',C.coral)+D3_tile(466,258,118,'Area',D3_f(hull.area,3),C.coral);
  out+=TF(16,326,`The areas add up to the cube’s volume: ${D3_f(ac.total,3)}.`,13,C.green,'start');
  out+=D3_note(`Slice of the unit cube by the plane ${D3_eqn(m,h)}, computed from its 12 edges.`,358);
  return {svg:out,phase:hull.dim<2?`The cube is only touching the plane at ${o.first}. The Flatlander sees ${D3_polyName(hull)}.`:
   `The plane cuts the cube in ${D3_polyName(hull)} of area ${D3_f(hull.area,3)}. Each side is where the plane crosses one of the cube’s six square faces, just as each face of a tesseract slice is where our space crosses one of its eight cubes.`};
 }});

// Vertex first in detail: predict the middle slice, then see the series.
const D3_GUESS=[['cube','A cube'],['tet','A tetrahedron'],['oct','An octahedron'],['ball','A ball']];
const D3_VSERIES=[.5,1,1.5,2,2.5,3,3.5];
SCENE({id:'slicing-vertex',name:'Corner first: predict the middle slice',tag:'x₁ + x₂ + x₃ + x₄ = 2',
 definition:'Push the tesseract through corner first. Its slices are the solids x₁ + x₂ + x₃ + x₄ = h inside the unit tesseract, as h runs from 0 to 4. The first slices are tetrahedra, because near the corner only four edges are cut. Further in, the tetrahedron’s corners are cut off. Exactly half way, at h = 2, the slice has six corners, the points with two coordinates 1 and two 0.',
 example:'The cube corner first gave a regular hexagon at the middle; the tesseract corner first gives a regular octahedron there. All twelve of its edges have the same length, √2, and it has eight triangular faces. After the middle the slices repeat in reverse.',
 desc:'A choice of four guesses for the middle slice, then a row of seven computed slices from h = 0.5 to 3.5 with their names, and a large drawing of the slice at the chosen height with its edge lengths.',
 research:['Alicia Boole Stott (1900). On certain series of sections of the regular four-dimensional hypersolids. Verhandelingen der Koninklijke Akademie van Wetenschappen te Amsterdam 7(3).','Coxeter (1948). Regular Polytopes. Methuen (sections of polytopes, chapter 13).'],
 dur:14,hint:'First guess the shape at the middle of the pass. Then reveal the series and move the slider to see each slice, its faces and its edge lengths.',
 init:()=>({guess:'',shown:0,h:20}),
 watch(p){return {guess:p>.15?'tet':'',shown:p>.3?1:0,h:Math.round(5+30*smooth(clamp((p-.3)/.7,0,1)))}},
 ui:[{choose:D3_GUESS,label:'Your guess for the middle',get:s=>s.guess,act:'guess'},{b:'Reveal the slices',act:'show'},{range:'h',label:'h (tenths)',min:0,max:40,get:s=>s.h,act:'h',show:v=>D3_f(v/10,1)}],
 on:{guess(s,v){s.guess=D3_GUESS.some(g=>g[0]===v)?v:''},show(s){s.shown=1},h(s,v){s.h=clamp(Math.round(+v),0,40);s.shown=1}},
 draw(s){
  const mid=D3_tSlice(3,.5).hull,midName=D3_solidName(mid),right=s.guess&&midName.includes({cube:'cube',tet:'tetrahedron',oct:'octahedron',ball:'ball'}[s.guess]);
  let out=heading(!s.shown?'What is the slice at the middle, h = 2?':`Corner first, the middle slice is ${midName}`);
  if(!s.shown){
   out+=T(300,120,s.guess?`Your guess: ${D3_GUESS.find(g=>g[0]===s.guess)[1].toLowerCase()}.`:'Choose a guess, then reveal.',16,s.guess?C.blue:C.muted);
   out+=T(300,160,'Hint: near a corner only four edges are cut.',15,C.muted)+T(300,186,'Half way, which corners lie exactly in the slice?',15,C.muted);
   const Pv=D3_view(.35,.85,300,280,48);out+=D3_drawHull(D3_tSlice(3,.125).hull,Pv)+TF(300,345,'the first slice, h = 0.5',13,C.muted);
   return {svg:out,phase:'The tesseract is about to meet our space corner first. Before looking, decide what its slice will be exactly half way through.'};
  }
  // the series of slices
  D3_VSERIES.forEach((h,i)=>{const hu=D3_tSlice(3,h/4).hull,x=50+i*83,Pv=D3_view(.35,.85,x,92,30),on=Math.abs(h*10-s.h)<1e-9;
   out+=R(x-39,46,78,96,on?C.coralp:'#fbfcfd',on?C.coral:C.grid,6)+D3_drawHull(hu,Pv)+TF(x,136,'h = '+D3_f(h,1),13,on?C.coral:C.muted)});
  const hu=D3_tSlice(3,s.h/40).hull,Pv=D3_view(.35,.85,150,248,74);
  out+=R(16,158,280,190,'#fbfcfd',C.grid,8)+D3_drawHull(hu,Pv)+TF(26,176,'h = '+D3_f(s.h/10,1),13,C.muted,'start');
  out+=TBF(310,178,D3_solidName(hu)[0].toUpperCase()+D3_solidName(hu).slice(1),14,C.ink,'start');
  out+=TF(310,198,hu.dim===3?D3_faceList(hu):'no faces yet',13,C.ink,'start');
  if(hu.dim===3)out+=D3_tile(310,212,130,'Corners · edges',`${hu.V} · ${hu.E}`,C.ink)+D3_tile(450,212,134,'Edge lengths',Math.abs(hu.emax-hu.emin)<1e-6?'all '+D3_f(hu.emin,3):`${D3_f(hu.emin,3)} to ${D3_f(hu.emax,3)}`,C.coral);
  out+=TF(310,284,`√2 = ${D3_f(Math.SQRT2,3)}`,13,C.muted,'start');
  if(s.guess)out+=TBF(310,312,right?'Your guess was right.':`Your guess: ${D3_GUESS.find(g=>g[0]===s.guess)[1].toLowerCase()}.`,13,right?C.green:C.coral,'start')+TF(310,330,right?'':'Computed: '+midName+'.',13,C.ink,'start');
  out+=D3_note('Every slice is computed from the 32 edges; names come from the computed faces.',366);
  return {svg:out,phase:`At h = ${D3_f(s.h/10,1)} the slice is ${D3_solidName(hu)}${hu.dim===3?`, with ${D3_faceList(hu)}`:''}. ${s.h===20?'Its six corners are the points with two coordinates 1 and two 0, and every edge is √2 long: a regular octahedron.':s.h===15||s.h===25?'Here the cut-off corners and the remaining faces have equal edges: an Archimedean truncated tetrahedron.':s.h===10||s.h===30?'Its corners are four corners of the tesseract itself, joined by diagonals of its squares.':''}`.trim()};
 }});

// Alicia Boole Stott's series: sections parallel to a cell of the regular 4D polytopes.
const D3_PHI=(1+Math.sqrt(5))/2;
const D3_STOTT=(()=>{
 const a=(1-Math.sqrt(5))/4,c5=[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1],[a,a,a,a]];
 const c16=[];for(let i=0;i<4;i++)for(const sg of [1,-1])c16.push(range(4).map(j=>j===i?sg:0));
 const c24=[];for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)for(const si of [1,-1])for(const sj of [1,-1])c24.push(range(4).map(k=>k===i?si:k===j?sj:0));
 const tv=D3_cubeV(4).map(v=>v.map(x=>x*2-1));
 return [
  {id:'c5',name:'5-cell',sym:'{3,3,3}',V:c5,m:[-1,-1,-1,-1],end:'a single vertex'},
  {id:'c8',name:'tesseract',sym:'{4,3,3}',V:tv,m:[0,0,0,1],end:'a cell'},
  {id:'c16',name:'16-cell',sym:'{3,3,4}',V:c16,m:[1,1,1,1],end:'a cell'},
  {id:'c24',name:'24-cell',sym:'{3,4,3}',V:c24,m:[1,0,0,0],end:'a cell'}].map(p=>{const E=D3_nnEdges(p.V),hs=p.V.map(v=>D3_dot(v,p.m));return {...p,E,lo:Math.min(...hs),hi:Math.max(...hs),o:D3_mean(p.V)}})})();
const D3_STOTT_CACHE={};
function D3_stottSlice(pi,k,n){const key=pi+':'+k+':'+n;if(!D3_STOTT_CACHE[key]){const p=D3_STOTT[pi],h=lerp(p.lo,p.hi,k/(n-1));D3_STOTT_CACHE[key]=D3_hull3(D3_sliceP(p.V,p.E,p.m,h,p.o))}return D3_STOTT_CACHE[key]}
SCENE({id:'slicing-stott',name:'Alicia Boole Stott’s sections',tag:'A series of slices, 1900',
 definition:'Alicia Boole Stott, a daughter of George Boole, had no formal training in mathematics. From the 1880s she worked out the three-dimensional sections of the regular four-dimensional polytopes, cutting each by a series of parallel spaces starting at one of its cells, and she built cardboard models of them. She published the series in 1900, working with the Dutch mathematician Pieter Hendrik Schoute, and she introduced the English word “polytope”.',
 example:'Sliced parallel to a cell, the 24-cell starts and ends with an octahedron and is a cuboctahedron at its middle, all computed here from its 96 edges. The 16-cell starts and ends with a tetrahedron; the 5-cell starts with a tetrahedron and ends at a single corner. The sections Stott is known for are those of the 120-cell and the 600-cell, far richer than these.',
 desc:'A choice of four regular four-dimensional polytopes and a row of equally spaced sections parallel to one cell, each drawn as a solid, with the chosen section enlarged and its faces and edge lengths listed.',
 research:['Alicia Boole Stott (1900). On certain series of sections of the regular four-dimensional hypersolids. Verhandelingen der Koninklijke Akademie van Wetenschappen te Amsterdam 7(3).','Polo-Blanco (2007). Theory and history of geometric models (PhD thesis, University of Groningen), on Boole Stott’s models and her work with Schoute.'],
 dur:14,hint:'Choose a polytope and how many sections to take, then press a section to enlarge it. Every section is computed from the polytope’s edges, like the tesseract’s.',
 init:()=>({pi:3,n:5,k:2}),
 watch(p){const pi=Math.min(3,Math.floor(p*4)),u=p*4-pi;return {pi,n:5,k:Math.min(4,Math.floor(u*5))}},
 ui:[{choose:D3_STOTT.map((q,i)=>[i,q.name]),label:'Polytope',get:s=>s.pi,act:'pi'},{choose:[[3,'3 sections'],[5,'5'],[7,'7']],label:'Sections',get:s=>s.n,act:'n'}],
 on:{pi(s,v){s.pi=clamp(Math.round(+v),0,3);s.k=Math.floor(s.n/2)},n(s,v){s.n=[3,5,7].includes(+v)?+v:5;s.k=Math.floor(s.n/2)},k(s,v){s.k=clamp(Math.round(+v),0,s.n-1)}},
 draw(s,f,X){
  const p=D3_STOTT[s.pi],w=Math.min(110,560/s.n);
  let out=heading(`The ${p.name} ${p.sym}: ${p.V.length} vertices, ${p.E.length} edges`);
  for(let k=0;k<s.n;k++){const hu=D3_stottSlice(s.pi,k,s.n),x=300+(k-(s.n-1)/2)*w,on=k===s.k,Pv=D3_view(.62,.5,x,98,w*.2);
   out+=hit(X,'k',k,`Section ${k+1} of ${s.n}`,R(x-w/2+3,46,w-6,96,on?C.coralp:'#fbfcfd',on?C.coral:C.grid,6)+D3_drawHull(hu,Pv)+TF(x,136,String(k+1),13,on?C.coral:C.muted))}
  const hu=D3_stottSlice(s.pi,s.k,s.n),Pv=D3_view(.62,.5,150,252,62);
  out+=R(16,156,280,190,'#fbfcfd',C.grid,8)+D3_drawHull(hu,Pv)+TF(26,174,`section ${s.k+1} of ${s.n}`,13,C.muted,'start');
  const nm=D3_solidName(hu);out+=TBF(310,178,nm[0].toUpperCase()+nm.slice(1),14,C.ink,'start')+TF(310,198,hu.dim===3?D3_faceList(hu):'',13,C.ink,'start');
  if(hu.dim===3)out+=D3_tile(310,212,130,'V − E + F',`${hu.V} − ${hu.E} + ${hu.F} = ${hu.V-hu.E+hu.F}`,C.ink)+D3_tile(450,212,134,'Edge lengths',Math.abs(hu.emax-hu.emin)<1e-6?'all '+D3_f(hu.emin,3):`${D3_f(hu.emin,2)} to ${D3_f(hu.emax,2)}`,C.coral);
  out+=TF(310,284,'Sections are equally spaced from',13,C.muted,'start')+TF(310,302,'the first cell to the opposite one.',13,C.muted,'start');
  out+=D3_note('Edges: nearest pairs of the generated vertices. Sections are cut from them.',366);
  return {svg:out,phase:`Section ${s.k+1} of ${s.n} through the ${p.name} is ${nm}${hu.dim===3?` with ${D3_faceList(hu)}`:''}. ${s.k===0?'The first section is a cell of the polytope itself.':s.k===s.n-1?`The last section is ${p.end} of the polytope itself.`:''} Stott worked her series out by geometric construction, without the coordinates used here.`.replace(/\s+$/,'')};
 }});

/* ===================== Lesson: schlegel-diagrams ===================== */
// The tesseract centred at the origin (coordinates ±½), its edges coloured by the coordinate that varies along them.
const D3_TC=D3_TV.map(v=>v.map(x=>x-.5));
const D3_AXCOL=[C.blue,C.green,C.purple,C.coral];
// Perspective from an eye on the w axis at w = d: the cell nearest the eye (w = +½) keeps its size.
const D3_persp=(p,d)=>{const k=(d-.5)/(d-p[3]);return [p[0]*k,p[1]*k,p[2]*k]};
const D3_dOf=t=>.5+.06*Math.pow(150,t/100);   // slider 0–100 → eye distance from just outside the cell to far away
const D3_PROJ={persp:(p,d)=>D3_persp(p,d),par:p=>[p[0],p[1],p[2]],slant:p=>[p[0]+.36*p[3],p[1]-.22*p[3],p[2]+.3*p[3]]};
function D3_distinct(pts){const out=[];for(const p of pts)if(!out.some(q=>D3_len(D3_sub(p,q))<1e-6))out.push(p);return out.length}
// Draw a projected 4D edge graph with the fixed 2D camera.
function D3_drawEdges(Q,E,Pv,o={}){const S=Q.map(Pv);let out='';
 const es=E.map(e=>({e,d:(S[e[0]][2]+S[e[1]][2])/2})).sort((a,b)=>a.d-b.d);
 for(const {e} of es){const a=S[e[0]],b=S[e[1]],hl=o.hl&&o.hl(e);out+=L(a[0],a[1],b[0],b[1],o.col?o.col(e):D3_AXCOL[e[2]],hl?4:o.w||2.4,hl===false?'stroke-opacity=".28"':'')}
 if(o.dots!==false)for(const p of S)out+=Ci(p[0],p[1],o.r||3.2,C.dark);return out}
const D3_axisKey=(x,y)=>D3_AX.split('').map((a,i)=>L(x+i*44,y,x+i*44+18,y,D3_AXCOL[i],3)+TF(x+i*44+22,y+5,a,13,C.ink,'start')).join('');
SCENE({id:'schlegel-diagrams',name:'Perspective from just outside a cell',tag:'Victor Schlegel, 1883–86',
 definition:'A picture of a four-dimensional object is a projection, and the choice of projection matters. Victor Schlegel placed the eye just outside one cell of a polytope, close to it, and projected in perspective. That near cell becomes the outer frame and every other cell fits inside it with no overlaps: for the tesseract, the familiar cube inside a cube. Seen from far away, perspective becomes a parallel projection, and the two cubes slide on top of each other.',
 example:'The inner cube is not smaller in four dimensions. All 32 edges of the tesseract have length 1; the inner cube is drawn small only because it is the cell furthest from the eye, just as the back face of a box looks smaller in a photograph. A slanted parallel projection gives the other common drawing: two equal cubes with their corners joined.',
 desc:'The tesseract projected into 3-space and drawn with its edges coloured by direction, x, y, z and w, beside tiles for the eye’s distance, the ratio of inner to outer cube, the number of separate corners in the picture and the true lengths of the edges.',
 research:['Schlegel (1883). Theorie der homogen zusammengesetzten Raumgebilde. Nova Acta Leopoldina 44.','Schlegel (1886). Ueber Projectionsmodelle der regelmässigen vier-dimensionalen Körper.','Stringham (1880). Regular figures in n-dimensional space. American Journal of Mathematics 3, 1–14 (the first published drawings of four-dimensional polytopes).'],
 dur:14,hint:'Choose perspective, then move the eye from just outside the near cell to far away. Compare with the two parallel projections. Every edge is 1 long in four dimensions; only the picture changes.',
 init:()=>({mode:'persp',t:35}),
 watch(p){return p<.7?{mode:'persp',t:Math.round(100*smooth(p/.7))}:{mode:p<.85?'par':'slant',t:100}},
 ui:[{choose:[['persp','Perspective'],['par','Parallel, along w'],['slant','Parallel, slanted']],label:'Projection',get:s=>s.mode,act:'mode'},{range:'t',label:'Eye distance',min:0,max:100,get:s=>s.t,act:'t',show:v=>'w = '+D3_f(D3_dOf(v))}],
 on:{mode(s,v){s.mode=D3_PROJ[v]?v:'persp'},t(s,v){s.t=clamp(Math.round(+v),0,100);s.mode='persp'}},
 draw(s){
  const d=D3_dOf(s.t),pr=D3_PROJ[s.mode],Q=D3_TC.map(p=>pr(p,d)),Pv=D3_view(.62,.5,170,196,150);
  const edge=(a,b)=>D3_len(D3_sub(Q[a],Q[b])),outer=D3_TE.find(e=>e[2]===0&&D3_TC[e[0]][3]>0),inner=D3_TE.find(e=>e[2]===0&&D3_TC[e[0]][3]<0);
  const ratio=edge(inner[0],inner[1])/edge(outer[0],outer[1]),true4=D3_TE.map(e=>D3_len(D3_sub(D3_TC[e[0]],D3_TC[e[1]]))),nd=D3_distinct(Q);
  let out=heading(s.mode==='persp'?`Eye at w = ${D3_f(d)}: the inner cube is ${D3_f(ratio)} times as wide`:s.mode==='par'?'Parallel along w: the two cubes coincide':'Parallel, slanted: two equal cubes joined');
  out+=R(16,46,320,290,'#fbfcfd',C.grid,8)+D3_drawEdges(Q,D3_TE,Pv);
  out+=D3_axisKey(30,326);
  out+=D3_tile(352,52,232,'Projection',s.mode==='persp'?'perspective, eye on the w axis':s.mode==='par'?'parallel, drop w':'parallel, slanted',C.ink);
  out+=D3_tile(352,106,112,'Inner ÷ outer',D3_f(ratio),C.coral)+D3_tile(472,106,112,'Corners seen',String(nd),nd<16?C.coral:C.ink);
  out+=D3_tile(352,160,232,'Edge lengths in 4D',Math.max(...true4)-Math.min(...true4)<1e-9?`all ${true4.length} are ${D3_f(true4[0])}`:'unequal',C.green);
  if(s.mode==='persp')out+=TF(352,234,`(d − ½) ÷ (d + ½) = ${D3_f((d-.5)/(d+.5))}`,13,C.muted,'start');
  out+=TF(352,262,s.mode==='par'?'16 corners land on only 8 points:':s.mode==='slant'?'Every cell is a parallelepiped':'The near cell is the frame;',13,C.ink,'start')+TF(352,280,s.mode==='par'?'the picture hides half the shape.':s.mode==='slant'?'and many of them overlap.':'the far cell sits in the middle.',13,C.ink,'start');
  out+=D3_note('A projection of the tesseract, computed from its 16 vertices: not the tesseract itself.',366);
  return {svg:out,phase:s.mode==='persp'?`The eye is ${D3_f(d-.5)} beyond the near cell. Its rays carry the far cell (w = −½) in to ${D3_f(ratio)} of the width of the near one. ${d<1.2?'Close up, the far cell shrinks towards a point and the six side cells become steep frustums.':d>5?'Far away, the inner cube grows towards the outer one: perspective is becoming a parallel projection.':'This is the Schlegel diagram: eight cubes, none overlapping, one of them the frame.'}`:
   s.mode==='par'?'Dropping the w coordinate sends each corner (x, y, z, ½) to the same point as (x, y, z, −½). The picture is a single cube, and all eight w-edges have shrunk to points.':
   'Shifting each point a little in proportion to w separates the two cubes. This is the usual textbook drawing; cells overlap in it, which the Schlegel diagram avoids.'};
 }});

// One dimension down: Schlegel diagrams of polyhedra, projected from an eye above one face onto that face.
const D3_SOLIDS=(()=>{const c=[];for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1])c.push([x,y,z]);
 const t=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]],o=[];for(let i=0;i<3;i++)for(const sg of [1,-1])o.push(range(3).map(j=>j===i?sg:0));
 const g=1/D3_PHI,dd=c.slice();for(const a of [-1,1])for(const b of [-1,1]){dd.push([0,a*g,b*D3_PHI]);dd.push([a*g,b*D3_PHI,0]);dd.push([b*D3_PHI,0,a*g])}
 return [{name:'Tetrahedron',V:t},{name:'Cube',V:c},{name:'Octahedron',V:o},{name:'Dodecahedron',V:dd}].map(q=>{const h=D3_hull3(q.V);
  const top=h.faces.reduce((a,f)=>f.n[2]>a.n[2]+1e-9?f:a,h.faces[0]),fc=D3_mean(top.idx.map(i=>q.V[i])),u0=D3_unit(D3_sub(q.V[top.idx[0]],fc)),v0=D3_cross(top.n,u0),g=20*Math.PI/180,u=D3_add(D3_mul(u0,Math.cos(g)),D3_mul(v0,Math.sin(g))),v=D3_cross(top.n,u);
  return {...q,h,top,fc,u,v,rad:D3_len(D3_sub(q.V[top.idx[0]],fc)),inr:D3_dot(fc,top.n)}})})();
function D3_schlegel2(q,ht,off){
 const E=D3_add(D3_add(q.fc,D3_mul(q.top.n,ht*q.inr)),D3_mul(q.u,off*q.rad));
 const pts=q.V.map(p=>{const t=D3_dot(D3_sub(q.fc,E),q.top.n)/D3_dot(D3_sub(p,E),q.top.n),r=D3_sub(D3_add(E,D3_mul(D3_sub(p,E),t)),q.fc);return [D3_dot(r,q.u)/q.rad,D3_dot(r,q.v)/q.rad]});
 const vis=q.h.faces.filter(f=>D3_dot(D3_sub(E,D3_mean(f.idx.map(i=>q.V[i]))),f.n)>1e-9).length;
 return {pts,vis};
}
SCENE({id:'schlegel-diagrams-cube',name:'One dimension down: a cube seen through a face',tag:'Schlegel diagrams of polyhedra',
 definition:'A Schlegel diagram of a polyhedron is what you see looking into it through one face, with the eye close to that face. The face becomes the frame, and the other faces fill it as a flat pattern of polygons with no crossings. The diagram works only while the eye sees that one face alone; move it too far to the side and other faces come into view, and the drawing folds over itself.',
 example:'The cube’s diagram is a square inside a square, joined at the corners: one dimension down from the tesseract’s cube inside a cube. Count the regions: five inside the frame plus the outside, which is the frame face itself, give the cube’s six faces, and V − E + F = 8 − 12 + 6 = 2. The diagram is a planar map, so it is also how Euler’s formula is often proved.',
 desc:'A flat Schlegel diagram of a chosen polyhedron, its outer frame being the face nearest the eye, with tiles for how many faces the eye can see and for the counts of corners, edges and faces with Euler’s sum.',
 research:['Schlegel (1883). Theorie der homogen zusammengesetzten Raumgebilde. Nova Acta Leopoldina 44.','Euler (1758). Elementa doctrinae solidorum. Novi Commentarii Academiae Scientiarum Petropolitanae 4, 109–140.'],
 dur:14,hint:'Choose a solid, raise or lower the eye above the top face, and slide it sideways. While the eye sees one face only, the diagram has no crossings.',
 init:()=>({si:1,ht:30,off:0}),
 watch(p){const si=Math.min(3,Math.floor(p*4)),u=p*4-si;return {si,ht:Math.round(10+50*smooth(u)),off:u>.7?Math.round(160*(u-.7)/.3):0}},
 ui:[{choose:D3_SOLIDS.map((q,i)=>[i,q.name]),label:'Solid',get:s=>s.si,act:'si'},{range:'ht',label:'Eye height',min:2,max:100,get:s=>s.ht,act:'ht',show:v=>D3_f(v/20,2)},{range:'off',label:'Eye sideways',min:0,max:200,get:s=>s.off,act:'off',show:v=>D3_f(v/100,2)}],
 on:{si(s,v){s.si=clamp(Math.round(+v),0,3)},ht(s,v){s.ht=clamp(Math.round(+v),2,100)},off(s,v){s.off=clamp(Math.round(+v),0,200)}},
 draw(s){
  const q=D3_SOLIDS[s.si],{pts,vis}=D3_schlegel2(q,s.ht/20,s.off/100),h=q.h,ok=vis===1,cx=175,cy=200,sc=118,M=p=>[cx+p[0]*sc,cy-p[1]*sc];
  let out=heading(ok?`${q.name}: a Schlegel diagram, no crossings`:`${q.name}: the eye sees ${vis} faces, the drawing overlaps`);
  out+=R(16,46,318,300,'#fbfcfd',C.grid,8);
  out+=D3_polygon(q.top.idx.map(i=>M(pts[i])),tint(C.blue,.86),C.blue);
  for(const f of h.faces)if(f!==q.top)out+=D3_polygon(f.idx.map(i=>M(pts[i])),ok?tint(C.green,.8):tint(C.coral,.85),ok?C.green:C.coral,'fill-opacity=".55"');
  for(const p of pts){const m=M(p);out+=Ci(m[0],m[1],3.4,C.dark)}
  out+=D3_tile(352,52,232,'Faces the eye can see',String(vis),ok?C.green:C.coral);
  out+=D3_tile(352,106,232,'V − E + F',`${h.V} − ${h.E} + ${h.F} = ${h.V-h.E+h.F}`,C.ink);
  out+=TF(352,176,`Regions inside the frame: ${h.F-1}`,13,C.ink,'start')+TF(352,194,'plus the frame face itself: '+h.F,13,C.ink,'start');
  out+=TF(352,222,`Eye ${D3_f(s.ht/20)} × the inradius above the face,`,13,C.muted,'start')+TF(352,240,`${D3_f(s.off/100)} × its radius to the side.`,13,C.muted,'start');
  out+=R(352,256,14,14,tint(C.blue,.86),C.blue,2)+TF(372,268,'the frame: the face nearest the eye',13,C.ink,'start');
  out+=D3_note('Corners, edges and faces are counted from the solid’s computed convex hull.',366);
  return {svg:out,phase:ok?`Through its top face the ${q.name.toLowerCase()} becomes a flat map of ${h.F} regions, ${h.F-1} inside the frame and the frame face itself. Nothing crosses because, from here, every other face is seen from inside the solid. ${s.ht<8?'Very close to the face, the far side shrinks towards a point.':''}`.trim():
   `From here the eye is outside ${vis} face planes, so it sees ${vis} faces at once and the projection folds over itself. Move the eye back over the frame face.`};
 }});

// The eight cells of the tesseract's Schlegel diagram, each highlighted in turn.
const D3_CELLS=(()=>{const out=[];for(let k=0;k<4;k++)for(const v of [.5,-.5])out.push({k,v,ids:range(16).filter(i=>D3_TC[i][k]===v),label:`${D3_AX[k]} = ${v>0?'+':'−'}½`});return out})();
const D3_SCH_D=1.1;
function D3_cellStats(ci,d){const c=D3_CELLS[ci],Q=c.ids.map(i=>D3_persp(D3_TC[i],d)),own=c.ids.map(i=>D3_TC[i].filter((_,j)=>j!==c.k));return {proj:D3_hull3(Q).vol,true3:D3_hull3(own).vol}}
SCENE({id:'schlegel-diagrams-cells',name:'Eight equal cubes, drawn unequal',tag:'Reading the cube inside a cube',
 definition:'The Schlegel diagram of the tesseract shows eight cells: the outer cube, the inner cube, and six slanted blocks (frustums) between them, one on each face of the inner cube. In four dimensions all eight are identical unit cubes. The projection changes their sizes and shapes, as a photograph of a box changes its square faces into trapezia.',
 example:`With the eye at w = ${D3_f(D3_SCH_D)}, the outer cell has projected volume ${D3_f(D3_cellStats(6,D3_SCH_D).proj,2)}, the inner one ${D3_f(D3_cellStats(7,D3_SCH_D).proj,3)}, and each frustum ${D3_f(D3_cellStats(0,D3_SCH_D).proj,3)}. Measured in four dimensions, every one of them has volume 1 and every edge length 1. Each square face is shared by exactly two cells, which is why the frustums fit so neatly around the inner cube.`,
 desc:'The tesseract’s Schlegel diagram with one chosen cell drawn heavily and the rest faint, beside a list of all eight cells with their projected volumes and their true volumes in four dimensions.',
 research:['Schlegel (1883). Theorie der homogen zusammengesetzten Raumgebilde. Nova Acta Leopoldina 44.','Coxeter (1948). Regular Polytopes. Methuen (the measure polytope and its projections).'],
 dur:16,hint:'Press a cell in the list, or step through all eight with the button. Compare the drawn size with the true volume in four dimensions.',
 init:()=>({ci:1}),
 watch(p){return {ci:Math.min(7,Math.floor(p*8))}},
 ui:[{b:'Next cell',act:'next'},{choose:[[1,'Inner'],[0,'Outer'],[6,'A side cell']],label:'Jump to',get:s=>s.ci,act:'ci'}],
 on:{next(s){s.ci=(s.ci+1)%8},ci(s,v){s.ci=clamp(Math.round(+v),0,7)}},
 draw(s,f,X){
  const c=D3_CELLS[s.ci],Q=D3_TC.map(p=>D3_persp(p,D3_SCH_D)),Pv=D3_view(.62,.5,165,196,150),inC=new Set(c.ids);
  const role=c.k===3?(c.v>0?'the outer frame':'the inner cube'):'a frustum between them';
  let out=heading(`Cell ${c.label}: drawn as ${role}`);
  out+=R(16,46,300,290,'#fbfcfd',C.grid,8)+D3_drawEdges(Q,D3_TE,Pv,{hl:e=>inC.has(e[0])&&inC.has(e[1])});
  out+=D3_axisKey(26,326);
  out+=TF(334,58,'cell',13,C.muted,'start')+TF(466,58,'drawn',13,C.muted,'end')+TF(578,58,'in 4D',13,C.muted,'end');
  D3_CELLS.forEach((cc,i)=>{const st=D3_cellStats(i,D3_SCH_D),y=66+i*31,on=i===s.ci;
   out+=hit(X,'ci',i,`Highlight cell ${cc.label}`,R(330,y,254,27,on?C.coralp:'#fff',on?C.coral:C.grid,6)+TF(340,y+19,cc.label,13,on?C.coral:C.ink,'start')+TF(466,y+19,D3_f(st.proj,3),13,C.ink,'end')+TF(578,y+19,D3_f(st.true3,3),13,C.green,'end'))});
  out+=TF(330,330,'Volumes of the eight cells.',13,C.muted,'start');
  out+=D3_note(`Perspective from w = ${D3_f(D3_SCH_D)}; volumes from the convex hull of each cell’s 8 corners.`,366);
  const st=D3_cellStats(s.ci,D3_SCH_D);
  return {svg:out,phase:`The cell where ${c.label} is ${role}. Its drawn volume is ${D3_f(st.proj,3)}; in four dimensions it is a unit cube of volume ${D3_f(st.true3,3)}, like the other seven. ${c.k===3&&c.v<0?'It is drawn smallest because it is furthest from the eye, not because it is smaller.':c.k===3?'It is nearest the eye, so it is drawn largest and frames the rest.':'It joins one face of the outer cube to the matching face of the inner cube.'}`};
 }});

/* ===================== Lesson: rotation-4d ===================== */
// A rotation by θ in the plane of coordinates i and j: only those two coordinates change.
const D3_I4=()=>range(4).map(i=>range(4).map(j=>i===j?1:0));
function D3_rot(i,j,th,n=4){const M=range(n).map(a=>range(n).map(b=>a===b?1:0)),c=Math.cos(th),s=Math.sin(th);M[i][i]=c;M[j][j]=c;M[i][j]=-s;M[j][i]=s;return M}
const D3_mm=(A,B)=>A.map((r,i)=>B[0].map((_,j)=>sum(r.map((v,k)=>v*B[k][j]))));
const D3_mv=(M,v)=>M.map(r=>D3_dot(r,v));
const D3_rad=d=>d*Math.PI/180,D3_deg=r=>r*180/Math.PI;
function D3_rank(M,eps=1e-9){const A=M.map(r=>r.slice()),n=A.length,m=A[0].length;let rk=0;
 for(let c=0;c<m&&rk<n;c++){let p=rk;for(let r=rk+1;r<n;r++)if(Math.abs(A[r][c])>Math.abs(A[p][c]))p=r;if(Math.abs(A[p][c])<eps)continue;[A[rk],A[p]]=[A[p],A[rk]];
  for(let r=0;r<n;r++)if(r!==rk){const f=A[r][c]/A[rk][c];for(let k=c;k<m;k++)A[r][k]-=f*A[rk][k]}rk++}return rk}
const D3_PLANES=(()=>{const out=[];for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)out.push([i,j,D3_AX[i]+D3_AX[j]]);return out})();
const D3_EYE=2.5;
const D3_drawRot=(M,Pv,o={})=>D3_drawEdges(D3_TC.map(p=>D3_persp(D3_mv(M,p),D3_EYE)),D3_TE,Pv,o);
// Count the planes of rotation in n dimensions by listing the pairs of axes.
const D3_planeCount=n=>{let c=0;for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)c++;return c};
SCENE({id:'rotation-4d',name:'Rotation turns a plane, not an axis',tag:'Six planes of rotation in four dimensions',
 definition:'In the plane a rotation turns the xy plane and fixes one point. In space we usually say a rotation turns about an axis, but what it really turns is a plane, here the xy plane, and the axis is simply what is left fixed. In four dimensions a rotation in the xy plane changes x and y and leaves z and w alone: it fixes a whole plane, not an axis. There is one plane for each pair of coordinates.',
 example:'Four coordinates give six pairs, so six basic planes of rotation: xy, xz, xw, yz, yw and zw. In n dimensions there are n(n − 1)/2 of them: one in 2D, three in 3D, six in 4D, ten in 5D. Only in three dimensions does the number of planes equal the number of axes, which is why “rotation about an axis” works there and nowhere else.',
 desc:'The tesseract, rotated in the chosen plane and projected in perspective into 3-space, beside tiles showing which coordinates the rotation changes and which it fixes, and a table counting the planes of rotation in 2 to 8 dimensions.',
 research:['Euler (1776). Formulae generales pro translatione quacunque corporum rigidorum. Novi Commentarii Academiae Scientiarum Petropolitanae 20 (every rotation of space fixes an axis).','Coxeter (1948). Regular Polytopes. Methuen (rotations in four dimensions).'],
 dur:16,hint:'Choose a plane of rotation and turn the slider slowly. Watch which edge colours move and which coordinates stay fixed. Rotations in planes that contain w change the picture most.',
 init:()=>({pl:2,a:30}),
 watch(p){const k=Math.min(5,Math.floor(p*6));return {pl:k,a:Math.round(60*smooth(p*6-k))}},
 ui:[{choose:D3_PLANES.map((q,i)=>[i,q[2]]),label:'Plane',get:s=>s.pl,act:'pl'},{range:'a',label:'Angle',min:0,max:360,step:5,get:s=>s.a,act:'a',show:v=>v+'°'}],
 on:{pl(s,v){s.pl=clamp(Math.round(+v),0,5)},a(s,v){s.a=clamp(Math.round(+v/5)*5,0,360)}},
 draw(s){
  const [i,j,nm]=D3_PLANES[s.pl],M=D3_rot(i,j,D3_rad(s.a)),Pv=D3_view(.62,.5,165,196,128);
  const fixed=range(4).filter(k=>D3_len(D3_sub(D3_mv(M,range(4).map(q=>q===k?1:0)),range(4).map(q=>q===k?1:0)))<1e-9).map(k=>D3_AX[k]);
  const fixDim=4-D3_rank(M.map((r,a)=>r.map((v,b)=>v-(a===b?1:0))));
  let out=heading(`Rotating ${s.a}° in the ${nm} plane`);
  out+=R(16,46,300,290,'#fbfcfd',C.grid,8)+D3_drawRot(M,Pv)+D3_axisKey(26,326);
  out+=D3_tile(332,52,124,'Changes',`${D3_AX[i]} and ${D3_AX[j]}`,C.coral)+D3_tile(462,52,122,'Stays fixed',s.a%360?fixed.join(' and ')||'nothing':'everything',C.green);
  out+=D3_tile(332,106,252,'Points left in place',s.a%360?`a ${fixDim===2?'plane':fixDim+'-dimensional set'} (${fixDim} dimensions)`:'all of them',C.ink);
  out+=TF(340,178,'n',13,C.muted,'start')+TF(476,178,'pairs listed',13,C.muted,'end')+TF(578,178,'n(n − 1)/2',13,C.muted,'end');
  for(let n=2;n<=8;n++){const y=196+(n-2)*21,on=n===4,c=D3_planeCount(n);
   out+=(on?R(328,y-15,256,20,C.coralp,'none',4):'')+TF(340,y,String(n),13,on?C.coral:C.ink,'start')+TF(476,y,String(c),13,C.ink,'end')+TF(578,y,`${n*(n-1)/2} ${c===n*(n-1)/2?'✓':'✕'}`,13,C.green,'end')}
  out+=D3_note('The tesseract is rotated in 4D, then projected in perspective from w = 2.5: a projection.',366);
  return {svg:out,phase:`The rotation changes only ${D3_AX[i]} and ${D3_AX[j]}; every point keeps its ${fixed.join(' and ')} coordinates${s.a%360?', so the points left in place make up the whole '+fixed.join('')+' plane':''}. ${j===3?'Because w is involved, points move towards and away from the eye in the fourth direction, and the projected cells change size.':'Because w is not involved, the picture turns like an ordinary rigid object.'}`};
 }});

// The xw rotation: the inner and outer cells change places.
function D3_cellCentres(M){return D3_CELLS.map(c=>{const cen=D3_mean(c.ids.map(i=>D3_mv(M,D3_TC[i])));return {c,w:cen[3],vol:D3_hull3(c.ids.map(i=>D3_persp(D3_mv(M,D3_TC[i]),D3_EYE))).vol}})}
SCENE({id:'rotation-4d-xw',name:'Turning inside out',tag:'The xw rotation in projection',
 definition:'Rotate the tesseract slowly in the xw plane and its picture seems to turn inside out: the inner cube swells and slides out through one side while the outer cube shrinks into the middle. Nothing bends in four dimensions. The tesseract turns rigidly; the cells move nearer to or further from the eye along w, and perspective draws the nearest cell largest.',
 example:'Start with the cell w = +½ nearest the eye, as the frame. After a quarter turn in the xw plane, the cell that was x = +½ has moved to where w was, and it is now the frame, while the first frame cell has moved to x = −½. After half a turn, the old inner cube (w = −½) has come round to the front, and the picture is again a cube inside a cube.',
 desc:'The tesseract rotated in the xw plane and projected in perspective, beside a table of all eight cells listing each one’s w coordinate after the rotation and its drawn volume, with the current frame and inner cell marked.',
 research:['Banchoff (1990). Beyond the Third Dimension: Geometry, Computer Graphics, and Higher Dimensions. Scientific American Library. With Charles Strauss he made the computer film The Hypercube: Projections and Slicing (1978).','Hinton (1904). The Fourth Dimension. Swan Sonnenschein.'],
 dur:18,hint:'Turn the xw angle slowly and watch the table: the cell with the largest w is always drawn as the frame. The motion here is slow on purpose; pause at any point.',
 init:()=>({a:45}),
 watch(p){return {a:Math.round(180*p/5)*5}},
 ui:[{range:'a',label:'xw angle',min:0,max:360,step:5,get:s=>s.a,act:'a',show:v=>v+'°'},{b:'Quarter turn',act:'q'}],
 on:{a(s,v){s.a=clamp(Math.round(+v/5)*5,0,360)},q(s){s.a=(Math.floor(s.a/90)*90+90)%360}},
 draw(s){
  const M=D3_rot(0,3,D3_rad(s.a)),Pv=D3_view(.62,.5,165,196,128),cs=D3_cellCentres(M);
  const fr=cs.reduce((a,b)=>b.w>a.w+1e-9?b:a,cs[0]),inn=cs.reduce((a,b)=>b.w<a.w-1e-9?b:a,cs[0]),tie=cs.filter(c=>Math.abs(c.w-fr.w)<1e-9).length>1;
  const frIds=new Set(fr.c.ids),inIds=new Set(inn.c.ids);
  let out=heading(tie?`${s.a}°: two cells are equally near the eye`:`${s.a}°: the frame is the cell that began as ${fr.c.label}`);
  out+=R(16,46,300,290,'#fbfcfd',C.grid,8)+D3_drawRot(M,Pv,{col:e=>frIds.has(e[0])&&frIds.has(e[1])&&!tie?C.coral:inIds.has(e[0])&&inIds.has(e[1])&&!tie?C.blue:'#9fb3c0',w:2.2});
  out+=TF(26,326,'red: the frame (nearest)',13,C.coral,'start')+TF(306,326,'blue: the innermost',13,C.blue,'end');
  out+=TF(334,58,'cell (start)',13,C.muted,'start')+TF(490,58,'w now',13,C.muted,'end')+TF(578,58,'drawn vol.',13,C.muted,'end');
  cs.forEach((q,i)=>{const y=66+i*31,isF=q===fr&&!tie,isI=q===inn&&!tie;
   out+=R(330,y,254,27,isF?C.coralp:isI?C.pale:'#fff',isF?C.coral:isI?C.blue:C.grid,6)+TF(340,y+19,q.c.label,13,C.ink,'start')+TF(490,y+19,D3_f(q.w),13,C.ink,'end')+TF(578,y+19,D3_f(q.vol,3),13,isF?C.coral:isI?C.blue:C.ink,'end')});
  out+=TF(330,330,'Cells are named by where they start.',13,C.muted,'start');
  out+=D3_note('Rotated in 4D by this page’s code, then projected from w = 2.5. Every cell stays a unit cube.',366);
  return {svg:out,phase:tie?`At ${s.a}° two cells are the same distance from the eye along w, so they are drawn the same size. The picture is half way through turning inside out.`:
   `After ${s.a}° in the xw plane the cell that began as ${fr.c.label} has the largest w (${D3_f(fr.w)}), so perspective draws it largest, as the frame. The cell that began as ${inn.c.label} has the smallest w and is drawn in the middle. The y and z directions do not move at all.`};
 }});

// Double rotations: xy by α and zw by β at once. Isoclinic when |α| = |β|. Quaternions give the isoclinic ones.
const D3_qmul=(a,b)=>[a[0]*b[0]-a[1]*b[1]-a[2]*b[2]-a[3]*b[3],a[0]*b[1]+a[1]*b[0]+a[2]*b[3]-a[3]*b[2],a[0]*b[2]-a[1]*b[3]+a[2]*b[0]+a[3]*b[1],a[0]*b[3]+a[1]*b[2]-a[2]*b[1]+a[3]*b[0]];
const D3_SAMPLE=(()=>{const r=rng(20250),out=[];while(out.length<400){const v=range(4).map(()=>{const u=Math.max(1e-12,r()),w=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*w)});out.push(D3_unit(v))}return out})();
function D3_double(a,b){const M=D3_mm(D3_rot(0,1,D3_rad(a)),D3_rot(2,3,D3_rad(b))),ang=D3_SAMPLE.map(v=>D3_deg(Math.acos(clamp(D3_dot(v,D3_mv(M,v)),-1,1))));
 const fixDim=4-D3_rank(M.map((r,i)=>r.map((x,j)=>x-(i===j?1:0)))),q=[Math.cos(D3_rad(a)),Math.sin(D3_rad(a)),0,0];
 const left=Math.max(...D3_SAMPLE.map(v=>D3_len(D3_sub(D3_qmul(q,v),D3_mv(M,v))))),right=Math.max(...D3_SAMPLE.map(v=>D3_len(D3_sub(D3_qmul(v,q),D3_mv(M,v)))));
 return {M,min:Math.min(...ang),max:Math.max(...ang),fixDim,left,right}}
SCENE({id:'rotation-4d-double',name:'Two planes at once',tag:'Double and isoclinic rotations; quaternions',
 definition:'In four dimensions the xy plane and the zw plane are perpendicular and share only the centre, so both can turn at once, by different angles. Such a double rotation fixes no plane and no line: only the centre stays still. When the two angles are equal, every point turns through the same angle along a circle of its own. These are isoclinic rotations, and W. K. Clifford studied the parallel circles they move points along.',
 example:'William Rowan Hamilton found the quaternions in 1843; multiplying a quaternion v on the left by q = cos α + i sin α turns the 1-i plane and the j-k plane both by α. That is the isoclinic rotation with α = β, checked here against the matrix. Multiplying on the right gives α = −β. Cayley showed in 1855 that every rotation of four-dimensional space is v ↦ p v q for two unit quaternions p and q.',
 desc:'The tesseract under a double rotation, projected in perspective, beside sliders for the two angles, tiles for the dimension of the fixed set and for the smallest and largest angle that 400 sample points are turned through, and two checks against quaternion multiplication.',
 research:['Hamilton (1844). On quaternions; or on a new system of imaginaries in algebra. Philosophical Magazine, 3rd series, 25 (discovered 16 October 1843).','Cayley (1855). Sur quelques propriétés des déterminants gauches. Journal für die reine und angewandte Mathematik 50.','Clifford (1873). Preliminary sketch of biquaternions. Proceedings of the London Mathematical Society 4.'],
 dur:18,hint:'Set the two angles. With one at 0 a plane stays fixed; with both non-zero only the centre does. Make them equal, or opposite, and the quaternion checks turn green.',
 init:()=>({a:30,b:30}),
 watch(p){return p<.5?{a:Math.round(60*smooth(p*2)/5)*5,b:0}:{a:60,b:Math.round(60*smooth((p-.5)*2)/5)*5}},
 ui:[{range:'a',label:'xy angle α',min:-90,max:90,step:5,get:s=>s.a,act:'a',show:v=>v+'°'},{range:'b',label:'zw angle β',min:-90,max:90,step:5,get:s=>s.b,act:'b',show:v=>v+'°'},{b:'Make β = α',act:'eq'}],
 on:{a(s,v){s.a=clamp(Math.round(+v/5)*5,-90,90)},b(s,v){s.b=clamp(Math.round(+v/5)*5,-90,90)},eq(s){s.b=s.a}},
 draw(s){
  const r=D3_double(s.a,s.b),Pv=D3_view(.62,.5,165,196,128),iso=Math.abs(Math.abs(s.a)-Math.abs(s.b))<1e-9&&s.a!==0;
  let out=heading(r.fixDim===4?'No rotation: everything is fixed':r.fixDim===2?'A simple rotation: a whole plane stays fixed':iso?'Isoclinic: every point turns by the same angle':'A double rotation: only the centre stays fixed');
  out+=R(16,46,300,290,'#fbfcfd',C.grid,8)+D3_drawRot(r.M,Pv)+D3_axisKey(26,326);
  out+=D3_tile(332,52,252,'Points left in place',r.fixDim===0?'only the centre':`a set of ${r.fixDim} dimensions`,C.ink);
  out+=D3_tile(332,106,252,'Angle each point turns (400 samples)',Math.abs(r.max-r.min)<1e-6?`all ${D3_f(r.min,1)}°`:`from ${D3_f(r.min,1)}° to ${D3_f(r.max,1)}°`,iso?C.green:C.coral);
  const okL=r.left<1e-9,okR=r.right<1e-9;
  out+=D3_tile(332,160,124,'Same as q·v?',okL?'yes':'no',okL?C.green:C.muted)+D3_tile(460,160,124,'Same as v·q?',okR?'yes':'no',okR?C.green:C.muted);
  out+=TF(332,226,`q = cos ${s.a}° + i sin ${s.a}°`,13,C.ink,'start');
  out+=TF(332,246,`largest gap from q·v: ${okL?'0 to 9 places':D3_f(r.left,3)}`,13,C.muted,'start')+TF(332,264,`largest gap from v·q: ${okR?'0 to 9 places':D3_f(r.right,3)}`,13,C.muted,'start');
  out+=TF(332,292,'Coordinates (x, y, z, w) are read',13,C.muted,'start')+TF(332,310,'as the quaternion x + yi + zj + wk.',13,C.muted,'start');
  out+=D3_note('Projected in perspective from w = 2.5. Angles come from dot products of v and its image.',366);
  return {svg:out,phase:r.fixDim===4?'Both angles are zero, so nothing moves.':r.fixDim===2?`Only one plane is turning, so the perpendicular plane stays fixed and points are turned by anything from 0° to ${D3_f(r.max,1)}°.`:
   iso?`With |α| = |β| = ${Math.abs(s.a)}°, every one of the 400 sample points turns through ${D3_f(r.min,1)}°. ${okL?'The rotation is exactly left multiplication by q.':'The rotation is exactly right multiplication by q.'}`:
   `Both planes turn, by ${s.a}° and ${s.b}°, so no line through the centre is left in place. Points turn by different amounts, between the two angles: here from ${D3_f(r.min,1)}° to ${D3_f(r.max,1)}°.`};
 }});

/* ===================== Lesson: unfolding-nets ===================== */
// Cube faces 0..5 are +x, −x, +y, −y, +z, −z. Two faces share an edge unless they are opposite.
const D3_FACE_NAME=['+x','−x','+y','−y','+z','−z'];
const D3_HINGES=(()=>{const out=[];for(const e of D3_CE){const a=D3_CV[e[0]],k=e[2],fs=range(3).filter(j=>j!==k).map(j=>2*j+(a[j]===1?0:1));out.push({e,f:fs.sort((x,y)=>x-y)})}return out})();
function D3_uf(n){const p=range(n);const f=x=>p[x]===x?x:(p[x]=f(p[x]));return {f,u:(a,b)=>{a=f(a);b=f(b);if(a===b)return false;p[a]=b;return true}}}
// Unfold the faces joined by the kept hinges by rolling a cube across a grid (north = +y, east = +x).
function D3_unfold(keep){
 const adj=range(6).map(()=>[]);keep.forEach((k,i)=>{if(k){const [a,b]=D3_HINGES[i].f;adj[a].push(b);adj[b].push(a)}});
 const roll={N:o=>({...o,D:o.N,N:o.U,U:o.S,S:o.D}),S:o=>({...o,D:o.S,S:o.U,U:o.N,N:o.D}),E:o=>({...o,D:o.E,E:o.U,U:o.W,W:o.D}),W:o=>({...o,D:o.W,W:o.U,U:o.E,E:o.D})};
 const step={N:[0,1],S:[0,-1],E:[1,0],W:[-1,0]},cells={5:{x:0,y:0,par:-1,dir:null}},q=[{f:5,o:{D:5,U:4,N:2,S:3,E:0,W:1}}];
 while(q.length){const {f,o}=q.shift();for(const d of ['N','S','E','W']){const g=o[d];if(adj[f].includes(g)&&!cells[g]){cells[g]={x:cells[f].x+step[d][0],y:cells[f].y+step[d][1],par:f,dir:d};q.push({f:g,o:roll[d](o)})}}}
 return cells;
}
// The shape of a net up to turning and flipping in the plane: the smallest of its eight images, as a string.
function D3_shapeKey(cells){const pts=Object.values(cells).map(c=>[c.x,c.y]);let best=null;
 for(let r=0;r<8;r++){const q=pts.map(([x,y])=>{let a=x,b=y;for(let i=0;i<r%4;i++)[a,b]=[-b,a];if(r>3)a=-a;return [a,b]}),mx=Math.min(...q.map(p=>p[0])),my=Math.min(...q.map(p=>p[1]));
  const k=q.map(p=>(p[0]-mx)+','+(p[1]-my)).sort().join(' ');if(best===null||k<best)best=k}return best}
const D3_NETS=(()=>{const trees=[],shapes=new Map();
 for(let m=0;m<1<<12;m++){let c=0;for(let i=0;i<12;i++)if(m>>i&1)c++;if(c!==5)continue;const u=D3_uf(6);let ok=true;for(let i=0;i<12;i++)if(m>>i&1)ok=u.u(...D3_HINGES[i].f)&&ok;if(!ok)continue;
  const keep=range(12).map(i=>m>>i&1),cells=D3_unfold(keep),key=D3_shapeKey(cells),over=new Set(Object.values(cells).map(c=>c.x+','+c.y)).size<6;trees.push({keep,key,over});
  if(!shapes.has(key))shapes.set(key,{key,keep,cells,count:0});shapes.get(key).count++}
 const list=[...shapes.values()].sort((a,b)=>a.key<b.key?-1:1);return {trees,list,overlaps:trees.filter(t=>t.over).length}})();
const D3_CROSS=D3_NETS.list.findIndex(n=>n.key===D3_shapeKey({a:{x:1,y:0},b:{x:0,y:1},c:{x:1,y:1},d:{x:2,y:1},e:{x:1,y:2},f:{x:1,y:3}}));
// Matrix-tree theorem: the number of spanning trees is any cofactor of the graph's Laplacian (exact, in BigInt).
function D3_treeCount(adj){const n=adj.length,M=range(n-1).map(i=>range(n-1).map(j=>BigInt(i===j?adj[i].filter(Boolean).length:-adj[i][j])));
 let prev=1n,sg=1n;for(let k=0;k<n-1;k++){if(M[k][k]===0n){let p=k+1;while(p<n-1&&M[p][k]===0n)p++;if(p===n-1)return 0n;[M[k],M[p]]=[M[p],M[k]];sg=-sg}
  for(let i=k+1;i<n-1;i++)for(let j=k+1;j<n-1;j++)M[i][j]=(M[i][j]*M[k][k]-M[i][k]*M[k][j])/prev;prev=M[k][k]}return sg*M[n-2][n-2]}
const D3_ADJ_CUBE=range(6).map(i=>range(6).map(j=>i!==j&&(i>>1)!==(j>>1)?1:0));
const D3_ADJ_TESS=range(8).map(i=>range(8).map(j=>i!==j&&(i>>1)!==(j>>1)?1:0));
const D3_bigFmt=b=>b.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
// Fold a net: each face turns about its hinge with its parent by θ, composed from the root outwards.
function D3_foldNet(cells,th){const T={},c=Math.cos(th),s=Math.sin(th);
 const rotAbout=(ax,p)=>{const [x,y,z]=ax,K=[[0,-z,y],[z,0,-x],[-y,x,0]],R=range(3).map(i=>range(3).map(j=>(i===j?1:0)+s*K[i][j]+(1-c)*sum(range(3).map(k=>K[i][k]*K[k][j])))) ;return {R,t:D3_sub(p,D3_mv(R,p))}};
 const get=f=>{if(T[f])return T[f];const cl=cells[f];if(cl.par<0)return T[f]={R:[[1,0,0],[0,1,0],[0,0,1]],t:[0,0,0]};
  const pc=cells[cl.par],u={N:[0,1,0],S:[0,-1,0],E:[1,0,0],W:[-1,0,0]}[cl.dir],mid=[pc.x+.5+u[0]*.5,pc.y+.5+u[1]*.5,0],ax=D3_cross(u,[0,0,1]),h=rotAbout(ax,mid),P=get(cl.par);
  return T[f]={R:D3_mm(P.R,h.R),t:D3_add(D3_mv(P.R,h.t),P.t)}};
 const out={};for(const f in cells){const cl=cells[f],tr=get(f);out[f]=[[0,0],[1,0],[1,1],[0,1]].map(([a,b])=>D3_add(D3_mv(tr.R,[cl.x+a,cl.y+b,0]),tr.t))}return out}
function D3_drawNetThumb(cells,x,y,sz,col,hl){let out='';const cs=Object.values(cells),mx=Math.min(...cs.map(c=>c.x)),Mx=Math.max(...cs.map(c=>c.x)),my=Math.min(...cs.map(c=>c.y)),My=Math.max(...cs.map(c=>c.y));
 const ox=x-(Mx-mx+1)*sz/2,oy=y+(My-my+1)*sz/2;/* (x, y) is the centre */for(const c of cs)out+=R(ox+(c.x-mx)*sz,oy-(c.y-my+1)*sz,sz,sz,c.par<0?tint(col,.35):tint(col,.75),hl?C.coral:'#fff',1.5);return out}
SCENE({id:'unfolding-nets',name:'Folding a cube from its net',tag:'Dürer’s nets, 1525',
 definition:'A net is a polyhedron cut along some of its edges and unfolded flat in one piece. Albrecht Dürer’s Underweysung der Messung (1525) printed nets of polyhedra so that readers could cut them out and fold them. A cube’s net is six squares joined edge to edge; folding every hinge up by a right angle closes it, and the corners that were apart in the plane meet in pairs and triples.',
 example:`The cube has exactly ${D3_NETS.list.length} different nets, counting a net and its mirror image or a turned copy as the same. All are computed here by cutting the cube in every possible way and unfolding it. The cross-shaped one is the net Dalí’s painting copies one dimension up. Flat, the six squares’ 24 corners sit at ${D3_distinct([].concat(...Object.values(D3_foldNet(D3_NETS.list[0].cells,0))))} separate points; folded shut, at 8.`,
 desc:'A chosen net of the cube drawn in perspective as it folds, with its base square fixed, beside the eleven different nets of the cube, and tiles for the fold angle and for the number of separate corner points.',
 research:['Dürer (1525). Underweysung der Messung mit dem Zirckel und Richtscheyt. Nuremberg (nets of polyhedra in book 4).','Every way of cutting the cube’s 12 edges is tried here; nets with the same shape are merged.'],
 dur:16,hint:'Press one of the eleven nets, then fold it with the slider. Watch the count of separate corners fall to 8 as the cube closes.',
 init:()=>({ni:Math.max(0,D3_CROSS),a:45}),
 watch(p){const k=Math.min(3,Math.floor(p*4)),nets=[D3_CROSS,0,5,9].map(i=>clamp(i,0,D3_NETS.list.length-1)),u=p*4-k;return {ni:nets[k],a:Math.round(90*smooth(clamp(u*1.25,0,1))/5)*5}},
 ui:[{range:'a',label:'Fold angle',min:0,max:90,step:5,get:s=>s.a,act:'a',show:v=>v+'°'},{b:'Next net',act:'next'}],
 on:{a(s,v){s.a=clamp(Math.round(+v/5)*5,0,90)},ni(s,v){s.ni=clamp(Math.round(+v),0,D3_NETS.list.length-1)},next(s){s.ni=(s.ni+1)%D3_NETS.list.length}},
 draw(s,f,X){
  const net=D3_NETS.list[s.ni],F=D3_foldNet(net.cells,D3_rad(s.a)),all=[].concat(...Object.values(F)),cen=D3_mean(all);
  const Pv=D3_view(.62,.62,170,214,46),nd=D3_distinct(all),closed=s.a===90;
  let out=heading(closed?`Net ${s.ni+1} of ${D3_NETS.list.length} closes into a cube`:`Net ${s.ni+1} of ${D3_NETS.list.length}, folded ${s.a}°`);
  out+=R(16,46,316,296,'#fbfcfd',C.grid,8);
  const base=D3_NETS.list[s.ni].cells,fs=Object.keys(F).map(k=>({k,pts:F[k].map(p=>Pv(D3_sub(p,[cen[0],cen[1],0])))})).map(o=>({...o,d:sum(o.pts.map(p=>p[2]))/4})).sort((a,b)=>a.d-b.d);
  for(const o of fs)out+=D3_polygon(o.pts,base[o.k].par<0?tint(C.blue,.45):tint(C.blue,.78),C.dark,'fill-opacity=".9"');
  out+=D3_tile(26,290,140,'Fold angle',s.a+'°',C.ink)+D3_tile(176,290,146,'Separate corners',String(nd),closed?C.green:C.coral);
  out+=TF(346,58,'The cube’s nets: press one',13,C.muted,'start');
  D3_NETS.list.forEach((n,i)=>{const col=i%3,row=Math.floor(i/3),x=382+col*80,y=74+row*70,on=i===s.ni;
   out+=hit(X,'ni',i,`Net ${i+1}`,R(x-38,y,76,64,on?C.coralp:'#fff',on?C.coral:C.grid,6)+D3_drawNetThumb(n.cells,x,y+30,12,on?C.coral:C.blue,false)+TF(x+33,y+60,String(i+1),13,C.muted,'end'))});
  out+=D3_note('Darker square: the base, which stays put. Nets are computed, not drawn by hand.',366);
  return {svg:out,phase:closed?`All five hinges are at right angles and the six squares form a closed cube: the ${24} corners of the separate squares now sit at just ${nd} points.`:
   `Each square turns about the edge it shares with the square it hangs from, by ${s.a}°. The corners of the six squares sit at ${nd} separate points; when the cube closes they meet at 8.`};
 }});

// Cutting the cube: the learner keeps or cuts each of the 12 edges; kept edges are hinges.
function D3_netCheck(keep){const k=sum(keep),u=D3_uf(6);keep.forEach((v,i)=>{if(v)u.u(...D3_HINGES[i].f)});const comps=new Set(range(6).map(u.f)).size,tree=k===5&&comps===1;
 return {k,comps,tree,cells:tree?D3_unfold(keep):null}}
const D3_CROSSKEEP=D3_NETS.list[Math.max(0,D3_CROSS)].keep;
// The tesseract: its 8 cubes (+x, −x, +y, −y, +z, −z, +w, −w) and their 24 shared squares. Every spanning tree is
// unfolded by rolling the tesseract across a grid of cubes in our space, and the shapes are compared up to the 48
// turns and reflections of space. The work is done in small batches when the learner asks for it.
const D3_TN={trees:null,done:0,first:[],seen:new Set(),over:0,
 E:(()=>{const E=[];for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)if((i>>1)!==(j>>1))E.push([i,j]);return E})(),
 SY:(()=>{const o=[];for(const p of [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]])for(let s=0;s<8;s++)o.push([p,[s&1?-1:1,s&2?-1:1,s&4?-1:1]]);return o})()};
function D3_tnTrees(){if(D3_TN.trees)return D3_TN.trees;const E=D3_TN.E,out=[],ch=[];
 const rec=(start,p)=>{if(ch.length===7){out.push(ch.slice());return}for(let i=start;i<=E.length-(7-ch.length);i++){const q=p.slice(),f=x=>{while(q[x]!==x)x=q[x];return x},ra=f(E[i][0]),rb=f(E[i][1]);if(ra===rb)continue;q[ra]=rb;ch.push(i);rec(i+1,q);ch.pop()}};
 rec(0,range(8));return D3_TN.trees=out}
function D3_tnKey(t){const E=D3_TN.E,adj=new Array(8).fill(0);for(const i of t){adj[E[i][0]]|=1<<E[i][1];adj[E[i][1]]|=1<<E[i][0]}
 const dirs=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],pos=[[0,0,0]],at={7:0},qc=[7],qo=[[0,1,2,3,4,5,7,6]];
 for(let h=0;h<qc.length;h++){const c=qc[h],o=qo[h],k=at[c];for(let d=0;d<6;d++){const g=o[d];if((adj[c]>>g&1)&&at[g]===undefined){at[g]=pos.length;pos.push(D3_add(pos[k],dirs[d]));
   const no=o.slice(),op=d^1;no[6]=o[d];no[d]=o[7];no[7]=o[op];no[op]=o[6];qc.push(g);qo.push(no)}}}
 const over=new Set(pos.map(v=>v.join(','))).size<8,cur=new Int32Array(8),best=new Int32Array(8).fill(1<<30);
 for(const [p,sg] of D3_TN.SY){let m0=99,m1=99,m2=99;for(let i=0;i<8;i++){const v=pos[i],a=sg[0]*v[p[0]],b=sg[1]*v[p[1]],c=sg[2]*v[p[2]];if(a<m0)m0=a;if(b<m1)m1=b;if(c<m2)m2=c}
  for(let i=0;i<8;i++){const v=pos[i];cur[i]=(sg[0]*v[p[0]]-m0)*256+(sg[1]*v[p[1]]-m1)*16+(sg[2]*v[p[2]]-m2)}cur.sort();
  for(let i=0;i<8;i++){if(cur[i]<best[i]){best.set(cur);break}if(cur[i]>best[i])break}}
 return {key:best.join(','),over}}
function D3_tnWork(n){const T=D3_tnTrees(),end=Math.min(T.length,D3_TN.done+n);for(let i=D3_TN.done;i<end;i++){const r=D3_tnKey(T[i]);if(r.over)D3_TN.over++;if(!D3_TN.seen.has(r.key)){D3_TN.seen.add(r.key);D3_TN.first.push(i)}}D3_TN.done=end}
const D3_tnFound=k=>D3_TN.first.filter(i=>i<k).length;
const D3_TESS_TREES=Number(D3_treeCount(D3_ADJ_TESS));
SCENE({id:'unfolding-nets-count',name:'Counting nets: 11 for the cube, 261 for the tesseract',tag:'Spanning trees, and Turney’s count, 1984',
 definition:'To unfold a cube, keep some edges as hinges and cut the rest. The squares must stay in one piece, and no ring of hinges may remain, or the piece would not lie flat. So the kept edges form a spanning tree of the six faces: exactly five hinges joining all six. Every spanning tree unfolds to a net, and different trees can give the same shape.',
 example:`Trying all ${D3_choose(12,5)} ways to keep 5 of the 12 edges finds ${D3_NETS.trees.length} spanning trees (the matrix-tree theorem gives ${D3_bigFmt(D3_treeCount(D3_ADJ_CUBE))} as well) and ${D3_NETS.list.length} shapes. For the tesseract the same count of spanning trees on its 8 cubes gives ${D3_bigFmt(D3_treeCount(D3_ADJ_TESS))}, few enough for this page to unfold every one in Try it. Peter Turney counted the tesseract’s nets in 1984 and found 261; the page’s count can be checked against his.`,
 desc:'A cube drawn with its twelve edges, each kept as a hinge or cut, beside the net those hinges unfold to when they form a spanning tree, and tiles for the counts of trees and shapes for the cube and the tesseract.',
 research:['Turney (1984). Unfolding the tesseract. Journal of Recreational Mathematics 17(1), 1–16: the tesseract has 261 nets.','Kirchhoff (1847): the matrix-tree theorem, which counts spanning trees from a determinant.'],
 dur:14,hint:'Press the edges of the cube to cut them or keep them as hinges. Keep five that join all six faces and the net appears. Then let the page unfold all the tesseract’s trees and count its nets (a few seconds).',
 init:()=>({keep:D3_CROSSKEEP.slice(),tn:0}),
 watch(p){const k=Math.min(D3_NETS.list.length-1,Math.floor(p*D3_NETS.list.length));return {keep:D3_NETS.list[k].keep.slice(),tn:0}},
 ui:[{b:'Cut every edge',act:'none'},{b:'A random tree',act:'rand'},{b:'Count the tesseract’s nets',act:'count'}],
 on:{e(s,v){const i=clamp(Math.round(+v),0,11);s.keep[i]=s.keep[i]?0:1},none(s){s.keep=range(12).map(()=>0)},rand(s){const t=D3_NETS.trees[nextSeed()%D3_NETS.trees.length];s.keep=t.keep.slice()},
  count(s,v,ctx){if(s.tn>=D3_TESS_TREES)return;ctx.every(60,'work')},work(s){D3_tnWork(2000);s.tn=D3_TN.done;return s.tn>=D3_TESS_TREES?'stop':'keep'}},
 draw(s,f,X){
  const r=D3_netCheck(s.keep),Pv=D3_view(.62,.5,150,166,112),S=D3_CV.map(v=>Pv(D3_sub(v,D3_HALF3)));
  const idx=r.tree?D3_NETS.list.findIndex(n=>n.key===D3_shapeKey(r.cells)):-1;
  let out=heading(r.tree?`A spanning tree: it unfolds to net ${idx+1} of ${D3_NETS.list.length}`:`${r.k} hinge${r.k===1?'':'s'} kept, ${r.comps} piece${r.comps===1?'':'s'}`);
  out+=R(16,46,288,250,'#fbfcfd',C.grid,8);
  D3_HINGES.forEach((h,i)=>{const a=S[h.e[0]],b=S[h.e[1]],k=s.keep[i];
   out+=hit(X,'e',i,`Edge between faces ${D3_FACE_NAME[h.f[0]]} and ${D3_FACE_NAME[h.f[1]]}: ${k?'kept':'cut'}. Press to change.`,L(a[0],a[1],b[0],b[1],'#fff',16,'stroke-opacity="0.01"')+L(a[0],a[1],b[0],b[1],k?C.green:C.coral,k?5:2.4,k?'':'stroke-dasharray="6 5"'))});
  out+=L(30,284,54,284,C.green,5)+TF(60,289,'hinge (kept)',13,C.ink,'start')+L(160,284,184,284,C.coral,2.4,'stroke-dasharray="6 5"')+TF(190,289,'cut',13,C.ink,'start');
  out+=R(316,46,268,154,'#fff',C.grid,8);
  if(r.tree)out+=D3_drawNetThumb(r.cells,450,123,24,C.blue,false);
  else out+=TF(450,112,r.k<5?'Too few hinges: the faces fall apart.':r.k>5?'Too many hinges: a ring cannot lie flat.':'Five hinges, but not all faces joined.',13,C.coral)+TF(450,132,'Keep 5 hinges joining all 6 faces.',13,C.muted);
  out+=D3_tile(316,210,130,'Cube: trees',String(D3_NETS.trees.length),C.ink)+D3_tile(454,210,130,'Cube: shapes',String(D3_NETS.list.length),C.green);
  const tn=Math.min(s.tn||0,D3_TN.done),found=D3_tnFound(tn);
  out+=D3_tile(316,262,130,'Tesseract: trees',D3_bigFmt(D3_TESS_TREES),C.ink)+D3_tile(454,262,130,tn?'Nets found':'Nets',tn?String(found):'press Count',tn>=D3_TESS_TREES?C.green:C.coral);
  if(tn)out+=R(316,314,268,8,C.grid,'none',4)+R(316,314,268*tn/D3_TESS_TREES,8,C.green,'none',4);
  out+=TF(316,338,tn>=D3_TESS_TREES?`All unfolded: ${found}. Turney (1984): 261.`:tn?`Unfolded ${D3_bigFmt(tn)} of ${D3_bigFmt(D3_TESS_TREES)} trees`:'Turney (1984) counted 261.',13,C.ink,'start');
  out+=D3_note(`Of the ${D3_NETS.trees.length} trees, ${D3_NETS.overlaps} unfold with squares overlapping; tree counts are exact.`,368);
  if(tn>=D3_TESS_TREES)return {svg:out,phase:`All ${D3_bigFmt(D3_TESS_TREES)} spanning trees of the tesseract’s cubes have been unfolded into space and compared up to turning and reflection: ${found} different nets, and ${D3_TN.over?D3_TN.over+' trees unfold with cubes overlapping':'no tree unfolds with cubes overlapping'}. Turney’s 1984 count is 261.`};
  if(tn)return {svg:out,phase:`Unfolding the tesseract’s spanning trees: ${D3_bigFmt(tn)} done, ${found} different nets so far.`};
  return {svg:out,phase:r.tree?`These five hinges join all six faces with no ring, so the cube unfolds in one flat piece: net ${idx+1}. ${D3_NETS.list[idx].count} of the ${D3_NETS.trees.length} spanning trees give this same shape.`:
   r.k===5?'Five hinges, but they form a ring and leave a face loose. A spanning tree needs no ring.':`A net needs exactly five hinges that join all six faces. You have ${r.k}, in ${r.comps} separate piece${r.comps===1?'':'s'}.`};
 }});

// The tesseract's cross-shaped net (Dalí's) folded in four dimensions and projected in perspective.
// Cubes: 0 centre [0,1]^3; 1–6 on its faces (+x, −x, +y, −y, +z, −z); 7 below cube 6. All start at w = 0.
const D3_DALI=[{o:[0,0,0],par:-1},{o:[1,0,0],par:0,ax:0,sg:1,h:1},{o:[-1,0,0],par:0,ax:0,sg:-1,h:0},{o:[0,1,0],par:0,ax:1,sg:1,h:1},{o:[0,-1,0],par:0,ax:1,sg:-1,h:0},{o:[0,0,1],par:0,ax:2,sg:1,h:1},{o:[0,0,-1],par:0,ax:2,sg:-1,h:0},{o:[0,0,-2],par:6,ax:2,sg:-1,h:-1}];
function D3_daliPoint(ci,p,th){let q=[p[0],p[1],p[2],0];for(let c=ci;c>0;c=D3_DALI[c].par){const k=D3_DALI[c],d=k.sg*(q[k.ax]-k.h),w=q[3];q=q.slice();q[k.ax]=k.h+k.sg*(d*Math.cos(th)-w*Math.sin(th));q[3]=d*Math.sin(th)+w*Math.cos(th)}return q}
function D3_daliFold(th){return D3_DALI.map((k,ci)=>D3_CV.map(v=>D3_daliPoint(ci,D3_add(v,k.o),th)))}
const D3_daliProj=(q,e=1.4)=>{const k=e/(e+q[3]);return [(q[0]-.5)*k,(q[1]-.5)*k,(q[2]-.5)*k]};
const D3_DALI_COL=ci=>ci===0?C.blue:ci===7?C.coral:C.green;
function D3_squares(F){const cs=[];F.forEach(cube=>{for(let k=0;k<3;k++)for(const v of [0,1]){const ids=range(8).filter(i=>D3_CV[i][k]===v);cs.push(D3_mean(ids.map(i=>cube[i])))}});return D3_distinct(cs)}
SCENE({id:'unfolding-nets-tesseract',name:'Folding the tesseract’s net',tag:'Dalí’s Corpus Hypercubus, 1954',
 definition:'One dimension up, a net of the tesseract is eight cubes joined face to face in ordinary space. To close it, each cube must turn about the square it shares with its neighbour, by a right angle into the fourth direction, which no cube in our space can do. Computed in four dimensions and projected back in perspective, the fold carries the cross of eight cubes into the cube inside a cube of the Schlegel diagram.',
 example:'Salvador Dalí’s Crucifixion (Corpus Hypercubus), 1954, now in the Metropolitan Museum of Art, shows Christ on this cross of eight cubes: four in a column and four around the second one. Dalí painted a net, a three-dimensional unfolding, not the four-dimensional object, which the painting cannot show. Closed, the net’s 64 cube corners meet at the tesseract’s 16 vertices.',
 desc:'The eight cubes of the cross-shaped net, folded by a chosen angle into the fourth dimension and projected in perspective, with the centre cube, the cube that becomes the opposite cell and the six others in different colours, and tiles for the angle, the number of separate corners and the number of separate square faces.',
 research:['Dalí (1954). Crucifixion (Corpus Hypercubus). Oil on canvas. The Metropolitan Museum of Art, New York.','Hinton (1904). The Fourth Dimension. Swan Sonnenschein (unfolding the tesseract into eight cubes).','Kemp (1998). Dali’s dimensions. Nature 391, 27.'],
 dur:18,hint:'Fold the net slowly with the slider. Switch to 3D and turn the camera on the projected cubes. The fold is computed in four dimensions; the 3D view only turns the picture.',
 init:()=>({a:40}),
 watch(p){return {a:Math.round(90*smooth(clamp((p-.1)/.8,0,1))/5)*5}},
 ui:[{range:'a',label:'Fold into w',min:0,max:90,step:5,get:s=>s.a,act:'a',show:v=>v+'°'},{b:'Flat',act:'flat'},{b:'Closed',act:'closed'}],
 on:{a(s,v){s.a=clamp(Math.round(+v/5)*5,0,90)},flat(s){s.a=0},closed(s){s.a=90}},
 draw(s){
  const F=D3_daliFold(D3_rad(s.a)),Pv=D3_view(.62,.5,176,196,70),nd=D3_distinct([].concat(...F)),nsq=D3_squares(F),closed=s.a===90;
  let out=heading(closed?'Closed: the net has become the tesseract':s.a===0?'The cross of eight cubes, flat in our space':`Folded ${s.a}° into the fourth direction`);
  out+=R(16,46,320,296,'#fbfcfd',C.grid,8);
  const segs=[];F.forEach((cube,ci)=>{const S=cube.map(q=>Pv(D3_daliProj(q)));for(const e of D3_CE)segs.push({a:S[e[0]],b:S[e[1]],ci,d:(S[e[0]][2]+S[e[1]][2])/2})});
  segs.sort((a,b)=>a.d-b.d).forEach(g=>{out+=L(g.a[0],g.a[1],g.b[0],g.b[1],D3_DALI_COL(g.ci),g.ci===0?2.8:2.2)});
  out+=D3_tile(352,52,232,'Fold angle',s.a+'°',C.ink)+D3_tile(352,106,112,'Corners',String(nd),closed?C.green:C.coral)+D3_tile(472,106,112,'Square faces',String(nsq),closed?C.green:C.coral);
  out+=L(352,182,376,182,C.blue,3)+TF(382,187,'centre cube (stays at w = 0)',13,C.ink,'start')+L(352,204,376,204,C.green,3)+TF(382,209,'six cubes that turn',13,C.ink,'start')+L(352,226,376,226,C.coral,3)+TF(382,231,'the cube that ends opposite',13,C.ink,'start');
  out+=TF(352,262,`Flat: 8 × 8 = 64 cube corners`,13,C.muted,'start')+TF(352,280,`at ${D3_distinct([].concat(...D3_daliFold(0)))} points; closed: at 16.`,13,C.muted,'start');
  out+=TF(352,306,'Square faces: 24 when closed,',13,C.muted,'start')+TF(352,324,'the tesseract’s 2-faces.',13,C.muted,'start');
  out+=D3_note('Folded in 4D by this page’s code, then projected in perspective from w = −1.4.',366);
  return {svg:out,phase:closed?`Every cube has turned a right angle into w. The six green cubes now stand on the faces of the blue one, and the red cube, carried round twice, closes the far side at w = 1. The 64 corners meet at ${nd} points and the faces pair off into ${nsq} squares, as in the tesseract.`:
   `Each green cube is turning about the square it shares with the blue centre cube, ${s.a}° of the way from our space into the fourth direction; the red cube turns with the one above it and also about their shared square. The further a cube moves in w, the smaller the perspective draws it.`};
 },
 three(s,f,X,project){
  const F=D3_daliFold(D3_rad(s.a)),Pr=project([].concat(...F).map(q=>D3_daliProj(q)));let out='';
  const segs=[];F.forEach((cube,ci)=>{const S=cube.map(q=>D3_daliProj(q));for(const e of D3_CE)segs.push({a:S[e[0]],b:S[e[1]],ci})});
  for(const g of segs.map(g=>({...g,d:(Pr(g.a)[2]+Pr(g.b)[2])/2})).sort((a,b)=>a.d-b.d))out+=line3(g.a,g.b,Pr,D3_DALI_COL(g.ci),g.ci===0?2.8:2.2);
  return {svg:out,title:'The folding net in 3D',caption:`The fold is computed in four dimensions (${s.a}°) and projected into 3-space by this page; the 3D view only turns the camera on the projected cubes, framed to fit. Blue: the centre cube; red: the cube that ends opposite it.`};
 }});

/* ===================== Lesson: hinton-cubes ===================== */
// Every part of the unit tesseract is named by the set of coordinates that vary along it (x = 1, y = 2, z = 4, w = 8)
// and the 0/1 values of the others. Each coordinate is 0, 1 or varying, so there are 3⁴ parts, the inside included.
const D3_TYPECOL=['#192c37','#1772b7','#2c776c','#5aa0d8','#7156a6','#8e7cc3','#55a89a','#9cc3e6','#c45238','#e08a5a','#a08a1e','#e6b38c','#b8569a','#d6a3c6','#7fb894','#e9d28a'];
const D3_tname=m=>m?range(4).filter(k=>m>>k&1).map(k=>D3_AX[k]).join(''):'·';
const D3_tdim=m=>(m&1)+(m>>1&1)+(m>>2&1)+(m>>3&1);
const D3_KIND=['corner','edge','square','cube','tesseract'];
const D3_PARTS=(()=>{const out=[];for(let m=0;m<16;m++){const fixed=range(4).filter(k=>!(m>>k&1));for(let a=0;a<1<<fixed.length;a++){const val=range(4).map(k=>m>>k&1?null:(a>>fixed.indexOf(k)&1));out.push({m,val,ids:range(16).filter(i=>val.every((v,k)=>v===null||D3_TV[i][k]===v))})}}return out})();
const D3_partCount=m=>D3_PARTS.filter(p=>p.m===m).length;
const D3_SLANT=p=>[p[0]+.42*p[3],p[1]-.26*p[3],p[2]+.34*p[3]];
function D3_drawType(m,Pv){const Q=D3_TC.map(D3_SLANT),S=Q.map(Pv),col=D3_TYPECOL[m],k=D3_tdim(m);let out='';
 for(const e of D3_TE){const a=S[e[0]],b=S[e[1]];out+=L(a[0],a[1],b[0],b[1],'#c9d6de',1.6)}
 for(const p of D3_PARTS.filter(q=>q.m===m)){
  if(k===0)out+=Ci(S[p.ids[0]][0],S[p.ids[0]][1],7,col,'#fff');
  else if(k===2){const ax=range(4).filter(q=>m>>q&1),ord=[[0,0],[1,0],[1,1],[0,1]].map(([u,v])=>p.ids.find(i=>D3_TV[i][ax[0]]===u&&D3_TV[i][ax[1]]===v));out+=D3_polygon(ord.map(i=>S[i]),col,col,'fill-opacity=".45"')}
  else for(const e of D3_TE)if(p.ids.includes(e[0])&&p.ids.includes(e[1]))out+=L(S[e[0]][0],S[e[0]][1],S[e[1]][0],S[e[1]][1],col,k===1?4.5:3.2)}
 return out}
function D3_typeList(X,x0,y0,sel,act){let out='';for(let k=0;k<=4;k++){const ms=range(16).filter(m=>D3_tdim(m)===k),y=y0+k*44;
 out+=TF(x0,y+18,D3_KIND[k]+'s',13,C.muted,'start');
 ms.forEach((m,i)=>{const x=x0+64+i*31,on=m===sel;out+=hit(X,act,m,`${D3_tname(m)}: ${D3_partCount(m)} ${D3_KIND[k]}${D3_partCount(m)>1?'s':''}`,R(x,y,28,28,D3_TYPECOL[m],on?C.ink:'#fff',5,on?'stroke-width="3"':'')+TF(x+14,y+43,D3_tname(m),13,on?C.ink:C.muted))})}return out}
SCENE({id:'hinton-cubes',name:'A colour for every part',tag:'Charles Howard Hinton, 1888',
 definition:'Charles Howard Hinton taught the fourth dimension with sets of small coloured cubes. Each corner, edge, face and solid of a cube had its own colour, and the learner memorised them. The idea, rebuilt here, is to name each part of the tesseract by the directions it runs in. An x-edge runs in x; an xw-square spans x and w; the yzw-cubes span y, z and w.',
 example:`Each coordinate of a point of a part is either fixed at 0, fixed at 1, or varying, so the tesseract has 3 × 3 × 3 × 3 = ${D3_PARTS.length} parts counting its inside. They come in 16 kinds, one for each set of varying directions: ${D3_partCount(0)} corners, ${D3_partCount(1)} edges of each of 4 kinds, ${D3_partCount(3)} squares of each of 6 kinds, ${D3_partCount(7)} cubes of each of 4 kinds and one tesseract.`,
 desc:'The tesseract drawn as two slanted cubes joined at their corners, with every part of one chosen kind coloured, beside a key of all 16 kinds arranged by dimension, each with its letters.',
 research:['Hinton (1888). A New Era of Thought. Swan Sonnenschein (the coloured cubes, and the word “tesseract”).','Hinton (1904). The Fourth Dimension. Swan Sonnenschein.'],
 dur:16,hint:'Press a kind in the key to colour every part of that kind. The letters say which directions it runs in; the count is made from the generated parts.',
 init:()=>({m:9}),
 watch(p){const seq=[0,1,8,3,9,7,14,15];return {m:seq[Math.min(seq.length-1,Math.floor(p*seq.length))]}},
 ui:[{choose:[[0,'Corners'],[8,'w-edges'],[9,'xw-squares'],[14,'yzw-cubes']],label:'Kind',get:s=>s.m,act:'m'}],
 on:{m(s,v){s.m=clamp(Math.round(+v),0,15)}},
 draw(s,f,X){
  const m=s.m,k=D3_tdim(m),n=D3_partCount(m),Pv=D3_view(.62,.5,150,206,132);
  let out=heading(k===0?`${n} corners`:k===4?'xyzw: the whole tesseract':`${D3_tname(m)}: ${n} ${D3_KIND[k]}s running in ${D3_tname(m).split('').join(', ')}`);
  out+=R(16,46,282,300,'#fbfcfd',C.grid,8)+D3_drawType(m,Pv);
  out+=TF(26,334,'slanted parallel projection',13,C.muted,'start');
  out+=D3_typeList(X,310,52,m,'m');
  out+=D3_note(`Counted from the ${D3_PARTS.length} generated parts: ${D3_partCount(0)} + ${4*D3_partCount(1)} + ${6*D3_partCount(3)} + ${4*D3_partCount(7)} + 1.`,370);
  const vs=D3_tname(m).split(''),along=vs.length>1?vs.slice(0,-1).join(', ')+' and '+vs[vs.length-1]+' vary':vs[0]+' varies';
  return {svg:out,phase:k===0?`There are ${n} corners: every corner has all four coordinates fixed, at 0 or 1, so there are 2⁴ = ${n} of them.`:k===4?'There is just one part of the kind xyzw: the whole tesseract, where all four coordinates vary.':`There are ${n} ${D3_KIND[k]}s of the kind ${D3_tname(m)}. Along each, ${along}, and the other ${4-k>1?(4-k)+' coordinates are':'coordinate is'} fixed at 0 or 1 in every combination: 2${['⁰','¹','²','³','⁴'][4-k]} = ${n}.`};
 }});

// Hinton's slices: the cube at w = 0, the slice between (0 < w < 1) and the cube at w = 1. Each is shown as
// 27 small cubes, after Hinton's models of cubes built from smaller ones: position 0, 1 or 2 along an axis means 0, varying or 1.
const D3_POS=v=>v===0?0:v===2?1:null;
function D3_cubelet(i,j,k,l){const val=[D3_POS(i),D3_POS(j),D3_POS(k),D3_POS(l)];return val.reduce((m,v,q)=>v===null?m|1<<q:m,0)}
function D3_drawSlice(l,Pv,sel){const faces=[];for(let i=0;i<3;i++)for(let j=0;j<3;j++)for(let k=0;k<3;k++){const m=D3_cubelet(i,j,k,l),on=sel&&sel[0]===i&&sel[1]===j&&sel[2]===k;
 for(const f of prism(i*1.25-1.25-.4,j*1.25-1.25-.4,k*1.25-1.25-.4,.8,.8,.8,D3_TYPECOL[m]))faces.push({...f,on})}
 return faces.map(f=>({...f,d:sum(f.pts.map(p=>Pv(p)[2]))/4})).sort((a,b)=>a.d-b.d).map(f=>D3_polygon(f.pts.map(Pv),tint(f.fill,(1-f.opacity)*.6),f.on?C.ink:'#fff',f.on?'stroke-width="3"':'')).join('')}
const D3_LNAME=['w = 0','between','w = 1'];
SCENE({id:'hinton-cubes-slices',name:'Three slices, and the colours change',tag:'Learning the tesseract slice by slice',
 definition:'Hinton’s method was to learn each slice of the tesseract as an ordinary coloured cube, and then learn how the colours change from one slice to the next. Slide from w = 0 into the tesseract and every part of the first cube is drawn out in the w direction: a corner becomes a w-edge, an x-edge becomes an xw-square, a face becomes a cube. At w = 1 the colours of the first cube return.',
 example:'Press the middle of the bottom face. At w = 0 it is a square spanning x and y (xy). In the slice between, the same place is an xyw-cube, the square drawn out along w. At w = 1 it is an xy-square again, the opposite one. The centre of the middle slice is the inside of the tesseract itself, xyzw.',
 desc:'One slice of the tesseract drawn as 27 small coloured cubes spread apart, beside a map of its three layers with the letters of each small cube, and a line naming the chosen part in four dimensions.',
 research:['Hinton (1888). A New Era of Thought. Swan Sonnenschein (the cubes, and learning their slices).','Hinton (1904). The Fourth Dimension. Swan Sonnenschein.'],
 dur:15,hint:'Choose a slice, then press a square in the layer map to pick a small cube. Switch slices and see what the same place becomes. Colours always come with letters.',
 init:()=>({l:1,sel:[1,1,0]}),
 watch(p){const k=Math.min(5,Math.floor(p*6));return {l:[0,1,2,1,0,1][k],sel:[[1,1,0],[1,1,0],[1,1,0],[0,0,0],[0,0,0],[1,1,1]][k]}},
 ui:[{choose:D3_LNAME.map((n,i)=>[i,n]),label:'Slice',get:s=>s.l,act:'l'}],
 on:{l(s,v){s.l=clamp(Math.round(+v),0,2)},pick(s,v){const n=clamp(Math.round(+v),0,26);s.sel=[n%3,Math.floor(n/3)%3,Math.floor(n/9)]}},
 draw(s,f,X){
  const [i,j,k]=s.sel,m=D3_cubelet(i,j,k,s.l),d=D3_tdim(m),Pv=D3_view(.62,.5,152,198,48);
  const val=[i,j,k,s.l].map(D3_POS),desc=val.map((v,q)=>v===null?null:`${D3_AX[q]} = ${v}`).filter(Boolean).join(', ');
  let out=heading(m===0?`Slice ${D3_LNAME[s.l]}: the chosen cube is a corner`:`Slice ${D3_LNAME[s.l]}: the chosen cube is ${D3_tname(m)}, ${d===1?'an edge':'a '+D3_KIND[d]}`);
  out+=R(16,46,276,300,'#fbfcfd',C.grid,8)+D3_drawSlice(s.l,Pv,s.sel)+TF(26,334,'27 small cubes, spread apart',13,C.muted,'start');
  for(let kk=0;kk<3;kk++){const y0=58+(2-kk)*92;out+=TF(306,y0+40,['bottom','middle','top'][kk],13,C.muted,'start');
   for(let jj=0;jj<3;jj++)for(let ii=0;ii<3;ii++){const mm=D3_cubelet(ii,jj,kk,s.l),x=360+ii*48,y=y0+(2-jj)*28,on=ii===i&&jj===j&&kk===k;
    out+=hit(X,'pick',ii+3*jj+9*kk,`Layer ${kk+1}, row ${jj+1}, column ${ii+1}: ${D3_tname(mm)}`,R(x,y,46,26,tint(D3_TYPECOL[mm],.45),on?C.ink:'#fff',4,on?'stroke-width="3"':'')+TF(x+23,y+18,D3_tname(mm),13,C.ink))}}
  out+=TF(510,74,'layers',13,C.muted,'start')+TF(510,92,'seen',13,C.muted,'start')+TF(510,110,'from above',13,C.muted,'start');
  out+=D3_note(`In 4D: the ${D3_KIND[d]} where ${desc||'nothing is fixed'}.`,370);
  return {svg:out,phase:`In the slice ${D3_LNAME[s.l]}, this small cube stands for ${m?'the part '+D3_tname(m):'a corner'} of the tesseract${desc?`, where ${desc}`:''}. ${s.l===1?`It is the ${['corner','edge','square','cube'][d-1]||'part'} at the same place in the first cube, drawn out along w.`:`In the slice between, the same place is ${D3_tname(m|8)}.`}`};
 }});

// A walk through the 81 parts: each move changes one coordinate's position among 0, varying, 1.
const D3_wkTarget=seed=>{const r=rng(seed*7919+3);let t;do{t=range(4).map(()=>Math.floor(r()*3))}while(t.every(v=>v===1));return t};
const D3_wkInit=()=>({at:[0,0,0,0],tg:D3_wkTarget(1),moves:0,seed:1});
SCENE({id:'hinton-cubes-walk',name:'Walking through the slices',tag:'Hinton’s exercise, and his claim',
 definition:'Hinton asked his readers to move through the tesseract in their minds, part by part and slice by slice, until the whole seemed present at once. Here you walk through all 81 parts. Each step moves one coordinate between 0, “varying” and 1, so a step in w carries you from the first cube into the slice between, or out to the last cube.',
 example:'Hinton believed that long practice with the cubes would let a person perceive four-dimensional space directly. That was his own claim; it has not been established. What practice certainly gives is fluency in the bookkeeping: knowing that a corner at w = 0 lies on a w-edge, which ends at a corner of the w = 1 cube.',
 desc:'The 81 parts of the tesseract laid out as three slices, each shown as three layers of nine squares, with the walker’s position and a target marked, and tiles for the walker’s part, the target and the number of steps taken against the fewest possible.',
 research:['Hinton (1888). A New Era of Thought. Swan Sonnenschein.','Hinton (1904). The Fourth Dimension. Swan Sonnenschein (practice with the cubes as a route to “intuition” of higher space: his claim).','Henderson (1983). The Fourth Dimension and Non-Euclidean Geometry in Modern Art. Princeton University Press (Hinton’s influence).'],
 dur:14,hint:'Step in x, y, z or w to reach the target part. The fewest steps is computed as the sum of the differences in each coordinate. New target picks another.',
 init:D3_wkInit,
 watch(p){const s=D3_wkInit(),path=[[3,1],[3,1],[0,1],[1,1]],k=Math.min(path.length,Math.floor(p*(path.length+1)));for(let i=0;i<k;i++){s.at[path[i][0]]=clamp(s.at[path[i][0]]+path[i][1],0,2);s.moves++}s.tg=[1,1,0,2];return s},
 ui:[0,1,2,3].map(q=>({b:`${D3_AX[q]} +`,act:'mv',arg:q*2})).concat([0,1,2,3].map(q=>({b:`${D3_AX[q]} −`,act:'mv',arg:q*2+1})),[{b:'New target',act:'tg'}]),
 on:{mv(s,v){const a=clamp(Math.round(+v),0,7),q=a>>1,d=a&1?-1:1,n=clamp(s.at[q]+d,0,2);if(n!==s.at[q]){s.at[q]=n;s.moves++}},tg(s){s.seed++;s.tg=D3_wkTarget(s.seed);s.moves=0;s.start=s.at.slice()}},
 draw(s){
  const mA=D3_cubelet(...s.at),mT=D3_cubelet(...s.tg),best=sum(s.tg.map((v,i)=>Math.abs(v-(s.start||[0,0,0,0])[i]))),left=sum(s.tg.map((v,i)=>Math.abs(v-s.at[i]))),done=left===0;
  const nm=(pos,m)=>{const vals=pos.map(D3_POS).map((v,q)=>v===null?null:`${D3_AX[q]}=${v}`).filter(Boolean).join(' ');return `${m?D3_tname(m):'corner'}${vals?' ('+vals+')':''}`};
  let out=heading(done?`Reached the target in ${s.moves} step${s.moves===1?'':'s'}`:mA===0?'You are on a corner':`You are on ${D3_tname(mA)}, ${D3_tdim(mA)===1?'an edge':'a '+D3_KIND[D3_tdim(mA)]}`);
  for(let l=0;l<3;l++){const x0=24+l*192;out+=TBF(x0+84,62,D3_LNAME[l],13,s.at[3]===l?C.coral:C.ink);
   for(let k=0;k<3;k++){const gy=72+(2-k)*82;for(let j=0;j<3;j++)for(let i=0;i<3;i++){const m=D3_cubelet(i,j,k,l),x=x0+40+i*30,y=gy+(2-j)*24,isA=[i,j,k,l].every((v,q)=>v===s.at[q]),isT=[i,j,k,l].every((v,q)=>v===s.tg[q]);
    out+=R(x,y,28,22,tint(D3_TYPECOL[m],isA||isT?.1:.6),isA?C.ink:isT?C.coral:'#fff',3,isA||isT?'stroke-width="3"':'');if(isA)out+=TBF(x+14,y+16,'you',13,'#fff');else if(isT)out+=TBF(x+14,y+16,'goal',13,'#fff')}
    if(l===0)out+=TF(x0,gy+40,['z=0','z var.','z=1'][k],13,C.muted,'start')}}
  out+=D3_tile(24,320,180,'You are on',nm(s.at,mA),C.ink)+D3_tile(212,320,180,'Target',nm(s.tg,mT),C.coral)+D3_tile(400,320,180,'Steps · fewest',`${s.moves} · ${best}`,done?C.green:C.ink);
  return {svg:out,phase:done?`You reached ${D3_tname(mT)} in ${s.moves} steps; the fewest possible was ${best}. Each step changed one coordinate between 0, varying and 1.`:
   `You are on the ${D3_KIND[D3_tdim(mA)]} ${nm(s.at,mA)}. The target is ${nm(s.tg,mT)}, ${left} step${left===1?'':'s'} away. Steps in w move you between the three slices.`};
 }});

/* ===================== Lesson: stereographic ===================== */
// Stereographic projection from the north pole N = (0, 0, 1) of the unit sphere onto the plane z = 0.
const D3_st2=p=>{const d=1-p[2];return d<1e-9?null:[p[0]/d,p[1]/d]};
// A circle on the sphere: centre direction at angle τ from N (in the xz plane), angular radius ρ.
function D3_sphCircle(tau,rho,n=144){const c=[Math.sin(tau),0,Math.cos(tau)],e1=[Math.cos(tau),0,-Math.sin(tau)],e2=[0,1,0];
 return range(n).map(i=>{const t=2*Math.PI*i/n;return D3_add(D3_mul(c,Math.cos(rho)),D3_add(D3_mul(e1,Math.sin(rho)*Math.cos(t)),D3_mul(e2,Math.sin(rho)*Math.sin(t))))})}
// Circle through three points of the plane, and the largest distance of any image point from it.
function D3_fitCircle(pts){const [a,b,c]=[pts[0],pts[Math.floor(pts.length/3)],pts[Math.floor(2*pts.length/3)]],d=2*(a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1]));
 if(Math.abs(d)<1e-12)return null;const sq=p=>p[0]*p[0]+p[1]*p[1],ux=(sq(a)*(b[1]-c[1])+sq(b)*(c[1]-a[1])+sq(c)*(a[1]-b[1]))/d,uy=(sq(a)*(c[0]-b[0])+sq(b)*(a[0]-c[0])+sq(c)*(b[0]-a[0]))/d,r=Math.hypot(a[0]-ux,a[1]-uy);
 return {c:[ux,uy],r,err:Math.max(...pts.map(p=>Math.abs(Math.hypot(p[0]-ux,p[1]-uy)-r)))}}
function D3_fitLine(pts){const a=pts[0],b=pts.reduce((q,p)=>D3_len(D3_sub(p,a))>D3_len(D3_sub(q,a))?p:q,pts[0]),u=D3_unit(D3_sub(b,a));return {err:Math.max(...pts.map(p=>Math.abs((p[0]-a[0])*u[1]-(p[1]-a[1])*u[0])))}}
SCENE({id:'stereographic',name:'Circles stay circles',tag:'Stereographic projection, from antiquity',
 definition:'Put a sphere on a plane and shine a light from its north pole. Each point of the sphere, except the pole itself, casts a shadow on the plane: that is stereographic projection. It was used to draw the sky on astrolabes; Ptolemy’s Planisphaerium describes it, and the method is traditionally credited to Hipparchus. Its key property is that every circle on the sphere lands on the plane as a circle, or as a straight line when the circle passes through the pole.',
 example:'The equator lands on itself, the unit circle. Small circles near the south pole land as small circles; circles near the north pole land as huge ones. Tilt a circle until it passes through the north pole and its image becomes a straight line, a circle through the point at infinity. The same projection works in any dimension: from the 3-sphere in four dimensions it sends round spheres and circles into ordinary space as round spheres and circles.',
 desc:'A side view of the sphere with a circle on it seen edge on and the light rays from the north pole, beside the plane seen from above with the image of the circle, and tiles for the image’s radius and how far its points are from a perfect circle.',
 research:['Ptolemy (2nd century). Planisphaerium (known from an Arabic translation; stereographic projection of the celestial sphere).','Needham (1997). Visual Complex Analysis. Oxford University Press (why stereographic projection keeps circles and angles).'],
 dur:15,hint:'Tilt the circle and change its size. The image is computed point by point; the tile reports how far those points stray from the best circle, or line. Make the tilt equal the radius and the circle passes through the pole.',
 init:()=>({tau:120,rho:30}),
 watch(p){return {tau:Math.round(lerp(150,40,smooth(p))/5)*5,rho:30}},
 ui:[{range:'tau',label:'Tilt from the pole',min:0,max:180,step:5,get:s=>s.tau,act:'tau',show:v=>v+'°'},{range:'rho',label:'Size',min:5,max:90,step:5,get:s=>s.rho,act:'rho',show:v=>v+'°'}],
 on:{tau(s,v){s.tau=clamp(Math.round(+v/5)*5,0,180)},rho(s,v){s.rho=clamp(Math.round(+v/5)*5,5,90)}},
 draw(s){
  const tau=D3_rad(s.tau),rho=D3_rad(s.rho),pts=D3_sphCircle(tau,rho),line=Math.abs(s.tau-s.rho)<1e-9,img=pts.map(D3_st2).filter(q=>q&&Math.hypot(...q)<1e6);
  const fit=line?D3_fitLine(img):D3_fitCircle(img);
  let out=heading(line?'Through the pole: the image is a straight line':`The image is a circle of radius ${D3_f(fit.r)}`);
  // side view: x across, z up; sphere centre at (150, 196), radius 90
  const sx=x=>150+x*90,sz=z=>196-z*90;out+=R(16,46,272,296,'#fbfcfd',C.grid,8)+TF(26,66,'side view',13,C.muted,'start');
  out+=Ci(150,196,90,'none',C.line)+L(24,sz(0),280,sz(0),C.ink,1.6)+TF(278,sz(0)-6,'plane',13,C.muted,'end')+Ci(sx(0),sz(1),5,C.amber)+TF(sx(0)+10,sz(1)-6,'N (light)',13,C.amber,'start');
  const c=[Math.sin(tau),Math.cos(tau)],e=[Math.cos(tau),-Math.sin(tau)],ends=[1,-1].map(k=>[c[0]*Math.cos(rho)+k*e[0]*Math.sin(rho),c[1]*Math.cos(rho)+k*e[1]*Math.sin(rho)]);
  out+=L(sx(ends[0][0]),sz(ends[0][1]),sx(ends[1][0]),sz(ends[1][1]),C.coral,4);
  for(const q of ends){const d=1-q[1];if(d>1e-6){const X0=q[0]/d,t=Math.abs(X0)>1.4?1.4/Math.abs(X0):1;out+=L(sx(0),sz(1),sx(X0*t),sz(1-t),C.amber,1.2,'stroke-dasharray="4 4"')}}
  // top view of the plane
  const R0=48,tx=x=>440+x*R0,ty=y=>196-y*R0;out+=R(300,46,284,232,'#fff',C.grid,8)+TF(310,66,'the plane from above',13,C.muted,'start');
  out+=`<g>${Ci(440,196,R0,'none',C.line,'stroke-dasharray="4 4"')}</g>`+TF(440-R0*.72,196+R0*.72+16,'equator',13,C.muted,'end');
  const inside=img.filter(q=>Math.abs(q[0])<2.85&&Math.abs(q[1])<2.35);
  for(let i=0;i<img.length;i++){const a=img[i],b=img[(i+1)%img.length];if(Math.abs(a[0])<2.85&&Math.abs(a[1])<2.35&&Math.abs(b[0])<2.85&&Math.abs(b[1])<2.35&&D3_len(D3_sub(a,b))<1)out+=L(tx(a[0]),ty(a[1]),tx(b[0]),ty(b[1]),C.coral,3)}
  if(!inside.length)out+=TF(440,200,'the image is off this map',13,C.coral);
  out+=D3_tile(300,290,138,line?'Image':'Image radius',line?'a line':D3_f(fit.r),C.coral)+D3_tile(446,290,138,line?'Gap from a line':'Gap from a circle',fit.err<5e-10?'0 to 9 places':D3_f(fit.err,6),C.green);
  out+=D3_note(`${pts.length} points on the circle are projected one by one; the fit uses three of them.`,366);
  return {svg:out,phase:line?`The circle passes through the north pole, where the light is. Points near the pole are thrown far away, and the image is a straight line: all ${img.length} projected points lie on it.`:
   `The circle, ${s.rho}° in size and tilted ${s.tau}° from the pole, projects to a circle of radius ${D3_f(fit.r)}. A circle through three of the image points passes through all the others to within ${fit.err<5e-10?'9 decimal places':D3_f(fit.err,6)}. ${s.tau-s.rho<20&&s.tau>s.rho?'It is close to the pole, so its image is large.':''}`.trim()};
 }});

// The 3-sphere as nested tori: x = (cos η cos a, cos η sin a, sin η cos b, sin η sin b), projected from (0,0,0,1).
const D3_st3=x=>{const d=1-x[3];return d<1e-9?null:[x[0]/d,x[1]/d,x[2]/d]};
const D3_torus4=(eta,a,b)=>[Math.cos(eta)*Math.cos(a),Math.cos(eta)*Math.sin(a),Math.sin(eta)*Math.cos(b),Math.sin(eta)*Math.sin(b)];
const D3_polyLen=pts=>{let l=0;for(let i=0;i<pts.length;i++)l+=D3_len(D3_sub(pts[(i+1)%pts.length],pts[i]));return l};
function D3_drawCurve3(pts,Pv,col,w=2,lim=3.2,closed=true){let out='';const S=pts.map(q=>q&&Math.max(...q.map(Math.abs))<lim?Pv(q):null);
 for(let i=0;i<pts.length-(closed?0:1);i++){const a=S[i],b=S[(i+1)%pts.length];if(a&&b)out+=L(a[0],a[1],b[0],b[1],col,w)}return out}
SCENE({id:'stereographic-s3',name:'The 3-sphere as nested tori',tag:'Projecting from four dimensions',
 definition:'The 3-sphere is the set of points at distance 1 from the centre in four dimensions, x² + y² + z² + w² = 1. It is a three-dimensional space with no edge, closed up like the surface of a ball. Write its points as (cos η cos a, cos η sin a, sin η cos b, sin η sin b). For each fixed η the points form a torus, and stereographic projection from (0, 0, 0, 1) draws these tori in ordinary space, nested one inside another.',
 example:'At η = 0 the torus has shrunk to a circle, the unit circle in the floor. At η = 90° it has become the vertical axis, a line through the point at infinity. In between, tori fill the rest of space. On the 3-sphere itself each torus is flat, like a rectangle with opposite sides glued; at η = 45° its two circles have the same length, √2·π. The projection makes them look unequal and curved.',
 desc:'One torus of the 3-sphere drawn after stereographic projection into 3-space, as a mesh of its two families of circles, with the circle and the axis that the tori close down to, and tiles comparing the lengths of its circles on the 3-sphere with their lengths in the picture.',
 research:['Clifford (1873). Preliminary sketch of biquaternions. Proceedings of the London Mathematical Society 4 (the flat torus in the 3-sphere, now called the Clifford torus).','Banchoff (1990). Beyond the Third Dimension. Scientific American Library (the 3-sphere as two solid tori, in stereographic projection).'],
 dur:15,hint:'Move η from 0 to 90°. The torus grows from the circle in the floor and closes in on the vertical axis. Compare the two lengths on the 3-sphere with the lengths in the picture.',
 init:()=>({eta:45}),
 watch(p){return {eta:Math.round(lerp(10,85,smooth(p))/5)*5}},
 ui:[{range:'eta',label:'η',min:0,max:90,step:5,get:s=>s.eta,act:'eta',show:v=>v+'°'}],
 on:{eta(s,v){s.eta=clamp(Math.round(+v/5)*5,0,90)}},
 draw(s){
  const eta=D3_rad(s.eta),Pv=D3_view(.62,.42,170,206,54),N=180;let out=heading(s.eta===0?'η = 0: the torus has shrunk to a circle':s.eta===90?'η = 90°: the torus has become the vertical axis':`The torus at η = ${s.eta}°`);
  out+=R(16,46,316,300,'#fbfcfd',C.grid,8);
  out+=D3_drawCurve3(range(N).map(i=>D3_st3(D3_torus4(0,2*Math.PI*i/N,0))),Pv,C.blue,1.6);
  const ax0=Pv([0,0,-3]),ax1=Pv([0,0,3]);out+=L(ax0[0],ax0[1],ax1[0],ax1[1],C.purple,1.6,'stroke-dasharray="5 4"');
  if(s.eta>0&&s.eta<90){for(let k=0;k<16;k++){const b=2*Math.PI*k/16;out+=D3_drawCurve3(range(N).map(i=>D3_st3(D3_torus4(eta,2*Math.PI*i/N,b))),Pv,tint(C.coral,.25),1.3)}
   for(let k=0;k<12;k++){const a=2*Math.PI*k/12;out+=D3_drawCurve3(range(N).map(i=>D3_st3(D3_torus4(eta,a,2*Math.PI*i/N))),Pv,tint(C.green,.15),1.3)}}
  out+=TF(26,326,'blue: η = 0 circle · purple: η = 90° axis',13,C.muted,'start');
  const A4=range(720).map(i=>D3_torus4(eta,2*Math.PI*i/720,.7)),B4=range(720).map(i=>D3_torus4(eta,.3,2*Math.PI*i/720));
  const A3=A4.map(D3_st3),B3=B4.map(D3_st3),fin=a=>a.every(q=>q&&Math.max(...q.map(Math.abs))<1e6);
  out+=TF(346,62,'lengths of one circle of each family',13,C.muted,'start');
  out+=D3_tile(346,72,116,'red, on S³',D3_f(D3_polyLen(A4),3),C.coral)+D3_tile(468,72,116,'green, on S³',D3_f(D3_polyLen(B4),3),C.green);
  out+=D3_tile(346,126,116,'red, drawn',fin(A3)?D3_f(D3_polyLen(A3),3):'infinite',C.coral)+D3_tile(468,126,116,'green, drawn',fin(B3)?D3_f(D3_polyLen(B3),3):'infinite',C.green);
  out+=TF(346,202,`On S³: 2π cos η = ${D3_f(2*Math.PI*Math.cos(eta),3)}`,13,C.ink,'start')+TF(346,220,`and 2π sin η = ${D3_f(2*Math.PI*Math.sin(eta),3)}.`,13,C.ink,'start');
  out+=TF(346,248,`Area on S³: 4π² sin η cos η = ${D3_f(4*Math.PI*Math.PI*Math.sin(eta)*Math.cos(eta),3)}`,13,C.ink,'start');
  out+=TF(346,276,'Lengths are summed along 720',13,C.muted,'start')+TF(346,294,'computed points of each circle.',13,C.muted,'start');
  out+=D3_note('Points of the 3-sphere in 4D, sent into 3-space by stereographic projection.',366);
  return {svg:out,phase:s.eta===0?'With η = 0 the second pair of coordinates vanishes, and every point lies on one circle, which projects to the unit circle in the floor.':s.eta===90?'With η = 90° the first pair vanishes. The circle that is left passes through the projection point, so it is drawn as the vertical axis, closed up at infinity.':
   `On the 3-sphere this torus is flat: its red circles are all ${D3_f(2*Math.PI*Math.cos(eta),3)} long and its green ones ${D3_f(2*Math.PI*Math.sin(eta),3)}. In the picture they have different lengths and the torus looks curved, because the projection stretches points near (0, 0, 0, 1) the most.${s.eta===45?' At 45° the two families are equal: the Clifford torus.':''}`};
 }});

// The Hopf fibration. A point of the 2-sphere at polar angle θ and longitude φ has the fibre
// (cos(θ/2) e^{it}, sin(θ/2) e^{i(t − φ)}), a great circle of the 3-sphere, here projected into 3-space.
const D3_HOPF_LAT=[0,30,60,90,120,150,180],D3_HOPF_LON=range(8).map(i=>i*45);
const D3_fibre4=(th,ph,n=240)=>range(n).map(i=>{const t=2*Math.PI*i/n,c=Math.cos(th/2),s=Math.sin(th/2);return [c*Math.cos(t),c*Math.sin(t),s*Math.cos(t-ph),s*Math.sin(t-ph)]});
const D3_hopf=x=>{const z1=[x[0],x[1]],z2=[x[2],x[3]];return [2*(z1[0]*z2[0]+z1[1]*z2[1]),2*(z1[1]*z2[0]-z1[0]*z2[1]),z1[0]*z1[0]+z1[1]*z1[1]-z2[0]*z2[0]-z2[1]*z2[1]]};
const D3_hcol=(th,ph)=>th===0?C.ink:th===180?C.purple:['#1772b7','#2c776c','#7156a6','#c45238','#9a6200','#b8569a','#3f8fb0','#5f7a2a'][Math.round(ph/45)%8];
// Linking number of two closed curves in 3-space: signed crossings of B through the flat disc spanned by A.
// A fibre is a round circle after projection, except the one through the projection point, which is the z axis.
function D3_link(A,B,aLine,bLine){
 if(aLine&&bLine)return 0;if(aLine)return D3_link(B,A,false,true);
 if(bLine){// winding of A about the z axis
  let w=0;for(let i=0;i<A.length;i++){const p=A[i],q=A[(i+1)%A.length];let d=Math.atan2(q[1],q[0])-Math.atan2(p[1],p[0]);if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;w+=d}return Math.round(w/(2*Math.PI))}
 const a=A[0],b=A[Math.floor(A.length/3)],c=A[Math.floor(2*A.length/3)],n=D3_unit(D3_cross(D3_sub(b,a),D3_sub(c,a)));
 const ab=D3_sub(b,a),ac=D3_sub(c,a),abXac=D3_cross(ab,ac),cen=D3_add(a,D3_mul(D3_add(D3_mul(D3_cross(abXac,ab),D3_dot(ac,ac)),D3_mul(D3_cross(ac,abXac),D3_dot(ab,ab))),1/(2*D3_dot(abXac,abXac)))),r=D3_len(D3_sub(a,cen));
 let k=0;for(let i=0;i<B.length;i++){const p=B[i],q=B[(i+1)%B.length],sp=D3_dot(D3_sub(p,cen),n),sq=D3_dot(D3_sub(q,cen),n);if((sp<0)!==(sq<0)&&sp!==sq){const x=D3_add(p,D3_mul(D3_sub(q,p),sp/(sp-sq)));if(D3_len(D3_sub(x,cen))<r)k+=sq>sp?1:-1}}return k}
const D3_lkPair=(a,b)=>a.line?D3_link(b.F3,null,false,true):b.line?D3_link(a.F3,null,false,true):D3_link(a.F3,b.F3,false,false);
function D3_fibres(sel){return sel.map(([th,ph])=>{const F4=D3_fibre4(D3_rad(th),D3_rad(ph)),line=th===180;return {th,ph,F4,F3:line?null:F4.map(D3_st3),line}})}
const D3_hopfInit=()=>({sel:[[0,0],[90,0],[90,90],[60,180]]});
SCENE({id:'stereographic-hopf',name:'The Hopf fibration',tag:'Heinz Hopf, 1931',
 definition:'In 1931 Heinz Hopf described a map from the 3-sphere onto the ordinary 2-sphere in which every point of the 2-sphere is reached by a whole circle of the 3-sphere, and these circles fill the 3-sphere without crossing. Any two of the circles are linked once, like two rings of a chain. Stereographic projection lets us see them: pick points on the 2-sphere and their circles appear in ordinary space.',
 example:'The north pole’s circle projects to the unit circle in the floor; the south pole’s circle passes through the projection point and is drawn as the vertical axis. Points on one latitude of the 2-sphere give circles that lie on one of the nested tori of the previous scene, each winding once round it each way. The Hopf map is mathematics; claims that tie it to consciousness or to the shape of the universe are unsupported.',
 desc:'A map of the 2-sphere as a grid of latitudes and longitudes with chosen points numbered, beside their Hopf circles drawn after stereographic projection, each with the same colour and number, and tiles for the number of pairs and their computed linking numbers.',
 research:['Hopf (1931). Über die Abbildungen der dreidimensionalen Sphäre auf die Kugelfläche. Mathematische Annalen 104, 637–665.','Lyons (2003). An elementary introduction to the Hopf fibration. Mathematics Magazine 76, 87–98.','Gauss (1833): the linking number of two closed curves as an integral; here it is counted as signed crossings of a disc.'],
 dur:16,hint:'Press points on the map of the 2-sphere to add or remove their circles. Switch to 3D to turn the picture. Every pair’s linking number is computed from the drawn curves.',
 init:D3_hopfInit,
 watch(p){const seq=[[0,0],[90,0],[90,90],[90,180],[90,270],[60,0],[60,120],[60,240],[180,0]],k=Math.max(1,Math.min(seq.length,Math.ceil(p*seq.length)));return {sel:seq.slice(0,k)}},
 ui:[{b:'Ring on the equator',act:'ring'},{b:'Down a meridian',act:'mer'},{b:'Clear',act:'clear'}],
 on:{pt(s,v){const [th,ph]=String(v).split(',').map(Number);if(!D3_HOPF_LAT.includes(th))return;const i=s.sel.findIndex(q=>q[0]===th&&(th%180===0||q[1]===ph));if(i>=0)s.sel.splice(i,1);else if(s.sel.length<10)s.sel.push([th,th%180===0?0:ph])},
  ring(s){s.sel=D3_HOPF_LON.map(ph=>[90,ph])},mer(s){s.sel=D3_HOPF_LAT.map(th=>[th,0])},clear(s){s.sel=[]}},
 draw(s,f,X){
  const fb=D3_fibres(s.sel),Pv=D3_view(.62,.42,462,214,46);
  const lk=[];for(let i=0;i<fb.length;i++)for(let j=i+1;j<fb.length;j++)lk.push(D3_lkPair(fb[i],fb[j]));
  const onFib=fb.every(q=>q.F4.every(x=>{const h=D3_hopf(x),t=D3_rad(q.th),p=D3_rad(q.ph);return D3_len(D3_sub(h,[Math.sin(t)*Math.cos(p),Math.sin(t)*Math.sin(p),Math.cos(t)]))<1e-9}));
  let out=heading(fb.length<2?'Choose points on the 2-sphere':`${fb.length} circles, ${lk.length} pairs, every pair linked ${lk.every(v=>v===1)?'once':'(see tiles)'}`);
  // map of the 2-sphere
  out+=R(16,46,272,236,'#fbfcfd',C.grid,8)+TF(26,64,'the 2-sphere (latitude, longitude)',13,C.muted,'start');
  const mx=ph=>58+ph/45*28,my=th=>86+th/180*168;
  for(const th of D3_HOPF_LAT){out+=TF(30,my(th)+4,th===0?'N':th===180?'S':String(90-th)+'°',13,C.muted,'start');
   for(const ph of (th%180===0?[0]:D3_HOPF_LON)){const x=th%180===0?mx(157.5):mx(ph),y=my(th),k=s.sel.findIndex(q=>q[0]===th&&(th%180===0||q[1]===ph)),on=k>=0,col=D3_hcol(th,ph);
    out+=hit(X,'pt',th+','+ph,`Point at ${th===0?'the north pole':th===180?'the south pole':`latitude ${90-th}°, longitude ${ph}°`}: ${on?'shown':'not shown'}`,(th%180===0?L(mx(0),y,mx(315),y,C.grid,1):'')+Ci(x,y,on?11:5,on?col:'#fff',col)+(on?TF(x,y+5,String(k+1),13,'#fff'):''))}}
  out+=TF(26,274,'equator: latitude 0°',13,C.muted,'start');
  // the circles
  out+=R(300,46,284,296,'#fff',C.grid,8);
  const ax0=Pv([0,0,-3.2]),ax1=Pv([0,0,3.2]);out+=L(ax0[0],ax0[1],ax1[0],ax1[1],C.grid,1.2,'stroke-dasharray="4 4"');
  fb.forEach((q,i)=>{const col=D3_hcol(q.th,q.ph);if(q.line){out+=L(ax0[0],ax0[1],ax1[0],ax1[1],col,3);const m=Pv([0,0,2.6]);out+=TBF(m[0]+12,m[1],String(i+1),13,col,'start')}
   else{out+=D3_drawCurve3(q.F3,Pv,col,2.4);const vis=q.F3.filter(p=>Math.max(...p.map(Math.abs))<2.6),lp=vis.length?Pv(vis[0]):null;if(lp)out+=Ci(lp[0],lp[1],9,'#fff',col)+TF(lp[0],lp[1]+5,String(i+1),13,col)}});
  out+=D3_tile(16,292,132,'Pairs',String(lk.length),C.ink)+D3_tile(156,292,132,'Linking numbers',lk.length?(Math.min(...lk)===Math.max(...lk)?`all ${lk[0]}`:`${Math.min(...lk)} to ${Math.max(...lk)}`):'none',C.green);
  out+=D3_note(`Each circle: 240 points of the 3-sphere${onFib?', all sent back to their point by Hopf’s map':''}.`,366);
  return {svg:out,phase:fb.length===0?'No circles yet. Press a point on the map of the 2-sphere.':fb.length===1?`One point of the 2-sphere, one great circle of the 3-sphere${fb[0].line?', drawn as the vertical axis because it passes through the projection point':''}. Add another point.`:
   `${fb.length} points of the 2-sphere give ${fb.length} circles that never meet. Counting how often each circle crosses a disc spanned by another gives linking number ${lk.every(v=>v===1)?'1 for all '+lk.length+' pairs':'values from '+Math.min(...lk)+' to '+Math.max(...lk)}: every two are linked once.`};
 },
 three(s,f,X,project){
  const fb=D3_fibres(s.sel),Pr=project([-3,3,-3,3,-3,3]);let out='';
  fb.forEach((q,i)=>{const col=D3_hcol(q.th,q.ph);if(q.line)out+=line3([0,0,-3],[0,0,3],Pr,col,3);else{const S=q.F3;for(let k=0;k<S.length;k++){const a=S[k],b=S[(k+1)%S.length];if(Math.max(...a.map(Math.abs),...b.map(Math.abs))<3)out+=line3(a,b,Pr,col,2.4)}}});
  return {svg:out,title:'Hopf circles in 3D',caption:`The ${fb.length} circles are computed on the 3-sphere in four dimensions and sent into 3-space by stereographic projection; the 3D view only turns the camera on them. Parts further than 3 units out are not drawn.`};
 }});
