/* ===================== Dimensions In Motion · Era 4 · Surfaces ===================== */
// Manifolds, gluing diagrams, the Möbius strip and orientability, the Klein bottle and projective plane,
// Euler characteristic and genus, and the classification of surfaces.
// Every count and invariant on screen is computed here from the shape drawn: gluing words give vertex classes by
// union-find, cut-up squares give V, E and F by identifying cells, cut strips give pieces by following bands round,
// linking numbers come from a discrete Gauss integral, and four-dimensional coordinates from the formulas named.
// Pictures are pure functions of state, frame and X. The 3D view only turns a camera on points this file computes.

/* ---- small helpers ---- */
const D4_TAU=2*Math.PI;
const D4_minus=v=>String(v).replace(/-/g,'−');
const D4_d1=v=>D4_minus((Math.round(v*10)/10).toFixed(1));     // one decimal place
const D4_d2=v=>D4_minus((Math.round(v*100)/100).toFixed(2));   // two decimal places
const D4_deg=r=>r*180/Math.PI;
const D4_note=(s,y=368)=>TF(300,y,s,13,C.muted);
function D4_tile(x,y,w,label,value,col=C.blue,h=46){return R(x,y,w,h,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+38,value,16,col)}
const D4_memo=(()=>{const m=new Map();return (k,fn)=>{if(!m.has(k))m.set(k,fn());return m.get(k)}})();
const D4_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const D4_plural=(n,a,b)=>n===1?a:(b||a+'s');
const D4_NUM=['no','one','two','three','four','five','six','seven','eight','nine','ten'];
const D4_word=n=>D4_NUM[n]||String(n);
// Union-find on 0…n−1.
function D4_uf(n){const p=range(n);const f=x=>{while(p[x]!==x){p[x]=p[p[x]];x=p[x]}return x};return {find:f,union:(a,b)=>{a=f(a);b=f(b);if(a!==b)p[a]=b},classes:()=>new Set(range(n).map(f)).size}}

/* ---- a fixed 3D projection for the 2D diagrams (the 3D view uses the shared camera instead) ---- */
function D4_view(yaw,pitch,cx=300,cy=200,sc=60){
 const cyw=Math.cos(yaw),syw=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
 return ([x,y,z])=>{const a=x*cyw-y*syw,b=x*syw+y*cyw;return [cx+a*sc,cy+(-b*sp-z*cp)*sc,-b*cp+z*sp]};
}
// Painter's algorithm for a list of quads {pts:[[x,y,z]…],fill,stroke?}: returns svg, back to front.
function D4_paint(quads,Pr,sw=.6){
 return quads.map(q=>{const pp=q.pts.map(Pr);return {pp,d:pp.reduce((a,p)=>a+p[2],0)/pp.length,q}}).sort((a,b)=>a.d-b.d)
  .map(({pp,q})=>`<polygon points="${pp.map(p=>fmt(p[0])+','+fmt(p[1])).join(' ')}" fill="${q.fill}" stroke="${q.stroke||q.fill}" stroke-width="${q.sw||sw}" stroke-linejoin="round"${q.op?` fill-opacity="${q.op}"`:''}/>`).join('');
}
// A colour scale for a fourth coordinate w in [−1, 1]: purple (w = −1) through pale to amber (w = +1).
function D4_wcol(w){const t=clamp((w+1)/2,0,1);const a=[113,86,166],m=[236,236,236],b=[154,98,0];
 const c=t<.5?a.map((v,i)=>v+(m[i]-v)*t*2):m.map((v,i)=>v+(b[i]-v)*(t-.5)*2);return '#'+c.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('')}

/* ===================== Gluing words =====================
 A polygon's edges read in order round the boundary give a word: a letter for each edge, with exponent +1 when the
 edge's arrow points along the reading direction and −1 against it. A letter used twice names two edges glued so
 their arrows match; a letter used once is a free (boundary) edge. Written as strings, upper case is the inverse:
 'abAB' is a b a⁻¹ b⁻¹. */
const D4_parse=str=>[...str].filter(c=>/[a-z]/i.test(c)).map(c=>({l:c.toLowerCase(),e:c===c.toLowerCase()?1:-1}));
const D4_str=w=>w.map(x=>x.e>0?x.l:x.l.toUpperCase()).join('');
const D4_SUP='⁻¹';
const D4_show=w=>w.map(x=>x.l+(x.e<0?D4_SUP:'')).join(' ');
// Vertices, edges, orientability and boundary computed from the word by identifying corners.
function D4_info(w){
 const n=w.length,occ={};w.forEach((x,i)=>(occ[x.l]=occ[x.l]||[]).push(i));
 const uf=D4_uf(n),tail=i=>w[i].e>0?i:(i+1)%n,head=i=>w[i].e>0?(i+1)%n:i;
 let orient=true,bad=false;const free=[];
 for(const l in occ){const o=occ[l];if(o.length>2)bad=true;else if(o.length===2){uf.union(tail(o[0]),tail(o[1]));uf.union(head(o[0]),head(o[1]));if(w[o[0]].e===w[o[1]].e)orient=false}else free.push(o[0])}
 const V=uf.classes(),E=Object.keys(occ).length,F=1,chi=V-E+F;
 // boundary circles: free edges joined end to end through the vertex classes
 let b=0;if(free.length){const roots=[...new Set(range(n).map(uf.find))],idx=Object.fromEntries(roots.map((r,i)=>[r,i])),u2=D4_uf(roots.length);
  for(const i of free)u2.union(idx[uf.find(i)],idx[uf.find((i+1)%n)]);b=new Set(free.map(i=>u2.find(idx[uf.find(i)]))).size}
 const cls=range(n).map(uf.find),ids=[...new Set(cls)];
 return {V,E,F,chi,orient,b,bad,corner:cls.map(c=>ids.indexOf(c)),letters:Object.keys(occ)};
}
// The name of a connected compact surface from orientability, Euler characteristic and number of boundary circles.
function D4_name(orient,chi,b=0){
 if(orient){const g=(2-chi-b)/2;if(g<0||g%1)return '?';
  if(b===0)return g===0?'sphere':g===1?'torus':`${D4_word(g)}-holed torus`;
  if(g===0)return b===1?'disc':b===2?'cylinder':`sphere with ${D4_word(b)} holes`;
  return `${g===1?'torus':D4_word(g)+'-holed torus'} with ${D4_word(b)} ${D4_plural(b,'hole')}`}
 const k=2-chi-b;if(k<1)return '?';
 if(b===0)return k===1?'projective plane':k===2?'Klein bottle':`${D4_word(k)} cross-caps`;
 if(k===1&&b===1)return 'Möbius strip';
 return `${D4_word(k)} ${D4_plural(k,'cross-cap')}, ${D4_word(b)} ${D4_plural(b,'hole')}`;
}
const D4_cap=s=>s[0].toUpperCase()+s.slice(1);

/* ---- cutting and re-gluing a polygon (the moves of the classification proof) ----
 cut(w,i,j): a straight cut from corner i to corner j (corner k sits just before edge k) splits the polygon in two;
 the new edge z runs from corner j to corner i in the first piece and is read backwards in the second.
 glue(p,q,l): the two pieces are joined along the edges labelled l. If both pieces read l the same way, the second
 piece is turned over first (its word reversed and inverted), which is allowed: it is only a polygon. */
const D4_inv=w=>w.slice().reverse().map(x=>({l:x.l,e:-x.e}));
const D4_rot=(w,k)=>w.slice(k).concat(w.slice(0,k));
function D4_cut(w,i,j,z){if(i>j)[i,j]=[j,i];return [w.slice(i,j).concat([{l:z,e:1}]),w.slice(j).concat(w.slice(0,i),[{l:z,e:-1}])]}
function D4_glue(p,q,l){
 let ip=p.findIndex(x=>x.l===l),iq=q.findIndex(x=>x.l===l);
 if(p[ip].e===q[iq].e){q=D4_inv(q);iq=q.findIndex(x=>x.l===l)}
 const U=D4_rot(p,ip+1).slice(0,-1),V=D4_rot(q,iq).slice(1);return U.concat(V);
}
// Folding: an adjacent pair x x⁻¹ (read cyclically) closes up like a zip and can be removed.
function D4_foldAt(w){const n=w.length;if(n<=2)return -1;for(let i=0;i<n;i++){const a=w[i],b=w[(i+1)%n];if(a.l===b.l&&a.e===-b.e)return i}return -1}
function D4_fold(w,i){const n=w.length;return w.filter((_,k)=>k!==i&&k!==(i+1)%n)}
// Normal-form progress: the longest run, read cyclically, of finished blocks: cross-caps x x and handles x y x⁻¹ y⁻¹.
function D4_blocks(w){const n=w.length;let best={len:0,rot:0,caps:0,handles:0};
 for(let r=0;r<n;r++){const v=D4_rot(w,r);let k=0,c=0,h=0;
  while(k<n){if(k+1<n&&v[k].l===v[k+1].l&&v[k].e===v[k+1].e){k+=2;c++;continue}
   if(k+3<n&&v[k].l===v[k+2].l&&v[k+1].l===v[k+3].l&&v[k].l!==v[k+1].l&&v[k].e===-v[k+2].e&&v[k+1].e===-v[k+3].e){k+=4;h++;continue}break}
  if(k>best.len)best={len:k,rot:r,caps:c,handles:h}}
 return best}
// Cross-caps only, read cyclically (used once a word is all blocks but still mixes handles with cross-caps).
function D4_capRun(w){const n=w.length;let best=0;for(let r=0;r<n;r++){const v=D4_rot(w,r);let k=0;while(k+1<n&&v[k].l===v[k+1].l&&v[k].e===v[k+1].e)k+=2;best=Math.max(best,k)}return best}
const D4_FRESH='zyxwvutsrqp';
// Every single move: a straight cut between two corners that are not neighbours, then a glue along a letter that
// now has one edge in each piece.
function D4_moves(w){const n=w.length,out=[],used=new Set(w.map(x=>x.l)),z=[...D4_FRESH].find(c=>!used.has(c));
 for(let i=0;i<n;i++)for(let j=i+2;j<n;j++){if(i===0&&j===n-1)continue;const [p,q]=D4_cut(w,i,j,z),lp=new Set(p.map(x=>x.l)),seen=new Set();
  for(const x of q)if(x.l!==z&&lp.has(x.l)&&!seen.has(x.l)){seen.add(x.l);const xp=p.find(y=>y.l===x.l);out.push({kind:'cut',i_:i,j_:j,l:x.l,z,p,q,flipped:xp.e===x.e,r:D4_glue(p,q,x.l)})}}
 return out}
// Breadth-first search, at most three moves deep, for moves that raise the score.
function D4_search(w,score,depth=3){const base=score(w);let frontier=[{w,path:[]}];const seen=new Set([D4_str(w)]);
 for(let d=1;d<=depth;d++){const next=[];for(const f of frontier)for(const m of D4_moves(f.w)){const k=D4_str(m.r);if(seen.has(k))continue;seen.add(k);const np={w:m.r,path:f.path.concat([m])};if(score(m.r)>base)return np.path;next.push(np)}frontier=next}
 return null}
// The whole reduction to normal form: a list of steps {kind:'start'|'fold'|'cut'|'done'|'stuck', w, …}.
function D4_reduce(str){return D4_memo('red:'+str,()=>{
 let w=D4_parse(str);const steps=[{kind:'start',w}];
 for(let guard=0;guard<40;guard++){
  if(w.length===2&&w[0].l===w[1].l&&w[0].e===-w[1].e){steps.push({kind:'done',w});break}
  const fi=D4_foldAt(w);if(fi>=0){w=D4_fold(w,fi);steps.push({kind:'fold',w,at:fi,l:steps[steps.length-1].w[fi].l});continue}
  const b=D4_blocks(w),inf=D4_info(w);let path=null;
  if(b.len<w.length)path=D4_search(w,v=>D4_blocks(v).len);
  else if(!inf.orient&&b.handles>0)path=D4_search(w,D4_capRun);
  else {steps.push({kind:'done',w:D4_rot(w,b.rot)});break}
  if(!path){steps.push({kind:'stuck',w});break}
  for(const m of path){w=m.r;steps.push({...m,w})}
 }
 return steps})}

/* ===================== A square cut into cells, with its edges glued =====================
 The unit square divided into n × n small squares, optionally each split by a diagonal. Opposite or adjacent sides
 are glued as a gluing diagram says. V, E and F are counted as cells after gluing: points and segments on glued
 sides are identified with their partners by union-find, so a vertex or edge that appears twice in the picture is
 counted once. Sides: B bottom (t,0), T top (t,n), L left (0,t), R right (n,t), with t running 0…n. */
const D4_GLUE={
 sphere:{name:'sphere',pairs:[['B','L',0],['T','R',0]]},
 torus:{name:'torus',pairs:[['L','R',0],['B','T',0]]},
 klein:{name:'Klein bottle',pairs:[['L','R',0],['B','T',1]]},
 rp2:{name:'projective plane',pairs:[['L','R',1],['B','T',1]]},
 cylinder:{name:'cylinder',pairs:[['L','R',0]]},
 mobius:{name:'Möbius strip',pairs:[['L','R',1]]}};
const D4_side=(s,t,n)=>s==='B'?[t,0]:s==='T'?[t,n]:s==='L'?[0,t]:[n,t];
function D4_grid(type,n,diag=[]){
 const G=D4_GLUE[type],id=(i,j)=>i*(n+1)+j,uf=D4_uf((n+1)*(n+1));
 for(const [a,b,f] of G.pairs)for(let t=0;t<=n;t++){const p=D4_side(a,t,n),q=D4_side(b,f?n-t:t,n);uf.union(id(...p),id(...q))}
 // segments: horizontal h(i,j) from (i,j) to (i+1,j); vertical v(i,j) from (i,j) to (i,j+1)
 const segs=[],sid={},key=(p,q)=>{const a=id(...p),b=id(...q);return a<b?a+'-'+b:b+'-'+a};
 for(let i=0;i<=n;i++)for(let j=0;j<=n;j++){if(i<n){sid[key([i,j],[i+1,j])]=segs.length;segs.push([[i,j],[i+1,j]])}if(j<n){sid[key([i,j],[i,j+1])]=segs.length;segs.push([[i,j],[i,j+1]])}}
 const us=D4_uf(segs.length);
 for(const [a,b,f] of G.pairs)for(let t=0;t<n;t++){const p0=D4_side(a,t,n),p1=D4_side(a,t+1,n),q0=D4_side(b,f?n-t:t,n),q1=D4_side(b,f?n-t-1:t+1,n);us.union(sid[key(p0,p1)],sid[key(q0,q1)])}
 const nd=diag.filter(c=>c<n*n).length;
 const V=uf.classes(),E=us.classes()+nd,F=n*n+nd;
 const cls=range((n+1)*(n+1)).map(uf.find),roots=[...new Set(cls)];
 return {V,E,F,chi:V-E+F,vclass:(i,j)=>roots.indexOf(cls[id(i,j)]),copies:roots.map(r=>cls.filter(c=>c===r).length),segs,sclass:k=>us.find(k)};
}

/* ===================== Strips: half-twists, cuts and pieces =====================
 A strip is the rectangle 0 ≤ u ≤ 1, −1 ≤ v ≤ 1 with its two ends glued; with k half-twists the gluing sends height v
 to s·v, s = (−1)^k. A cut along height c continues at height s·c after one lap, so the cut heights are {c, s·c}.
 The bands between cut heights are followed round: a band goes to its image under v ↦ s·v, and each cycle of bands is
 one piece. A piece made of L bands goes round L times; it is one-sided when it comes back flipped (s = −1, L odd). */
function D4_strip(k,cut){
 const s=k%2?-1:1,hs=cut==null?[]:[...new Set([cut,s*cut].map(v=>Math.round(v*1e9)/1e9))].sort((a,b)=>a-b);
 const edges=[-1,...hs,1],bands=range(edges.length-1).map(i=>[edges[i],edges[i+1]]);
 const img=i=>{const [a,b]=bands[i],lo=Math.min(s*a,s*b);return bands.findIndex(B=>Math.abs(B[0]-lo)<1e-9)};
 const seen=new Set(),pieces=[];
 for(let i=0;i<bands.length;i++){if(seen.has(i))continue;const cyc=[];let j=i;while(!seen.has(j)){seen.add(j);cyc.push(j);j=img(j)}
  const L=cyc.length,one=s<0&&L%2===1;pieces.push({bands:cyc,L,oneSided:one,edges:one?1:2})}
 return {s,hs,bands,pieces,cutLaps:hs.length,img};
}
// The strip in space: core circle of radius 2, width w, the cross-section turned through k·u/2 as u goes round.
const D4_stripPt=(k,u,v,wd=.7)=>{const a=k*u/2,r=2+wd*v*Math.cos(a);return [r*Math.cos(u),r*Math.sin(u),wd*v*Math.sin(a)]};
// A closed curve on the strip that starts at height v0 and is followed for L laps (height s^m·v0 on lap m).
function D4_stripCurve(k,v0,L,N=120){const s=k%2?-1:1,out=[];for(let m=0;m<L;m++){const v=v0*(s**m);for(let i=0;i<N;i++)out.push(D4_stripPt(k,D4_TAU*i/N,v))}return out}
// Gauss linking number of two closed polygons, by the exact solid-angle formula for each pair of segments
// (Klenin & Langowski, 2000); the result is a whole number up to rounding error, which is reported.
function D4_link(A,B){
 const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],cr=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],dt=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
 const nrm=a=>{const l=Math.hypot(...a)||1;return a.map(x=>x/l)};let tot=0;
 for(let i=0;i<A.length;i++){const a0=A[i],a1=A[(i+1)%A.length];for(let j=0;j<B.length;j++){const b0=B[j],b1=B[(j+1)%B.length];
  const r13=sub(b0,a0),r14=sub(b1,a0),r23=sub(b0,a1),r24=sub(b1,a1);
  const n1=nrm(cr(r13,r14)),n2=nrm(cr(r14,r24)),n3=nrm(cr(r24,r23)),n4=nrm(cr(r23,r13));
  let om=Math.asin(clamp(dt(n1,n2),-1,1))+Math.asin(clamp(dt(n2,n3),-1,1))+Math.asin(clamp(dt(n3,n4),-1,1))+Math.asin(clamp(dt(n4,n1),-1,1));
  const sg=Math.sign(dt(cr(sub(b1,b0),sub(a1,a0)),r13));tot+=om*(sg||0)}}
 return tot/(4*Math.PI);
}
// Pieces of a cut strip with their measured linking numbers (memoised: each needs one Gauss sum).
function D4_stripPieces(k,cut){return D4_memo('sp:'+k+':'+cut,()=>{
 const S=D4_strip(k,cut),N=72;
 const pcs=S.pieces.map(pc=>{const [lo,hi]=S.bands[pc.bands[0]],mid=(lo+hi)/2,ins=.12*(hi-lo);
  const core=D4_stripCurve(k,mid,pc.L,N);let tw=null;
  if(!pc.oneSided){const e1=D4_stripCurve(k,lo+ins,pc.L,N),e2=D4_stripCurve(k,hi-ins,pc.L,N);tw=D4_link(e1,e2)}
  return {...pc,lo,hi,mid,core,twist:tw}});
 let link=null;if(pcs.length===2)link=D4_link(pcs[0].core,pcs[1].core);
 return {...S,pcs,link}})}

/* ===================== Four coordinates for two closed surfaces =====================
 Klein bottle, "figure-eight" form: for 0 ≤ u, v < 2π, a figure-eight curve (sin v, sin 2v) is turned through u/2
 while it travels once round a circle of radius 2. At u = 2π the eight has turned half-way, so (u + 2π, v) is the
 point (u, −v): the ends are glued with a flip. In 3D the curve's crossing (v = 0 and v = π) sweeps out a circle
 where the surface meets itself. The fourth coordinate w = cos v is the same at (u, v) and (u, −v), so it is
 defined on the bottle, and it is +1 on one sheet of the crossing and −1 on the other. */
function D4_klein(u,v){const c=Math.cos(u/2),s=Math.sin(u/2),a=Math.sin(v),b=Math.sin(2*v),r=2+c*a-s*b;return [r*Math.cos(u),r*Math.sin(u),s*a+c*b,Math.cos(v)]}
/* Projective plane: a point (x, y, z) of the unit sphere and its opposite point (−x, −y, −z) are one point of the
 plane. Steiner's Roman surface is the image (yz, xz, xy) in 3D; it meets itself along three segments of the axes.
 Adding w = x² − y² gives four coordinates, and the map (yz, xz, xy, x² − y²) sends different points of the plane to
 different points of 4D space: from xy and x² − y² one recovers (x + iy)² and so (x, y) up to sign, then z. */
const D4_roman=([x,y,z])=>[y*z,x*z,x*y,x*x-y*y];
const D4_sph=(th,ph)=>[Math.sin(th)*Math.cos(ph),Math.sin(th)*Math.sin(ph),Math.cos(th)];

/* ===================== Lesson: manifold-idea ===================== */
// Three shapes to zoom into. Sphere of radius 1 (latitude θ, longitude λ); torus with radii 2 and 0.8; a figure-eight
// curve c(t) = (sin t, sin t·cos t), which crosses itself at t = 0 and t = π.
const D4_TR=2,D4_TA=.8;
const D4_sphPt=(th,la)=>[Math.cos(th)*Math.cos(la),Math.cos(th)*Math.sin(la),Math.sin(th)];
const D4_torPt=(u,v)=>[(D4_TR+D4_TA*Math.cos(v))*Math.cos(u),(D4_TR+D4_TA*Math.cos(v))*Math.sin(u),D4_TA*Math.sin(v)];
const D4_eight=t=>[1.3*Math.sin(t),1.3*Math.sin(t)*Math.cos(t)];
const D4_ZSTEPS=8;   // zoom ×1 … ×128
const D4_rho=k=>.8/2**k;
const D4_sub3=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],D4_dot3=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],D4_len3=a=>Math.hypot(a[0],a[1],a[2]);
const D4_cross3=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const D4_unit3=a=>{const l=D4_len3(a)||1;return [a[0]/l,a[1]/l,a[2]/l]};
// The point chosen on each shape and a patch round it: local coordinates (along, across, height above the tangent
// plane) divided by the window radius ρ, so a flat patch has height 0.
function D4_zoomPatch(shape,at,k){return D4_memo(`zp:${shape}:${at}:${k}`,()=>{
 const rho=D4_rho(k),N=12;let f,u0,v0,du,dv;
 if(shape==='sphere'){u0=-Math.PI/2-.5;v0=(-70+140*at)*Math.PI/180;f=(u,v)=>D4_sphPt(v,u);du=1.15*rho/Math.cos(v0);dv=1.15*rho}
 else{u0=-Math.PI/2-.5;v0=D4_TAU*at;f=D4_torPt;du=1.15*rho/(D4_TR+D4_TA*Math.cos(v0));dv=1.15*rho/D4_TA}
 const p=f(u0,v0),h=1e-5,t1=D4_unit3(D4_sub3(f(u0+h,v0),f(u0-h,v0))),t2r=D4_sub3(f(u0,v0+h),f(u0,v0-h)),n=D4_unit3(D4_cross3(t1,t2r)),t2=D4_cross3(n,t1);
 const grid=range(N+1).map(i=>range(N+1).map(j=>{const q=D4_sub3(f(u0+du*(2*i/N-1),v0+dv*(2*j/N-1)),p);return [D4_dot3(q,t1)/rho,D4_dot3(q,t2)/rho,D4_dot3(q,n)/rho,D4_len3(q)/rho]}));
 let dev=0;for(const row of grid)for(const g of row)if(g[3]<=1)dev=Math.max(dev,Math.abs(g[2]));
 return {p,n,t1,t2,grid,dev,rho,u0,v0,f}})}
// Arms of the figure eight that leave a circle of radius ρ round the point: crossings of the circle, counted along
// a fine sampling of the curve.
function D4_arms(t0,rho){const c=D4_eight(t0),N=20000;let n=0,prev=null;for(let i=0;i<=N;i++){const q=D4_eight(D4_TAU*i/N),out=Math.hypot(q[0]-c[0],q[1]-c[1])>rho;if(prev!==null&&out!==prev)n++;prev=out}return n}
const D4_EIGHT_STEPS=40;
function D4_wire(f,us,vs,Pr,col,w=1.1){let out='';
 for(const u of us){const pts=vs.map(v=>Pr(f(u,v)));for(let i=1;i<pts.length;i++){const fr=pts[i][2]+pts[i-1][2]>0;out+=L(pts[i-1][0],pts[i-1][1],pts[i][0],pts[i][1],fr?col:'#d5e0e7',fr?w:.8)}}
 for(const v of vs.filter((_,i)=>i%2===0)){const pts=us.map(u=>Pr(f(u,v)));for(let i=1;i<pts.length;i++){const fr=pts[i][2]+pts[i-1][2]>0;out+=L(pts[i-1][0],pts[i-1][1],pts[i][0],pts[i][1],fr?col:'#d5e0e7',fr?w:.8)}}
 return out}
SCENE({id:'manifold-idea',name:'Flat close up',tag:'Riemann’s manifoldness, 1854',
 definition:'A manifold is a space that looks like ordinary flat space when you zoom in far enough, at every one of its points. Bernhard Riemann’s lecture of 1854 called such spaces “manifoldnesses” (Mannigfaltigkeiten): a sphere or a torus is two-dimensional, because close up each looks like a flat plane, however curved it is overall. A curve that crosses itself is not a manifold: at the crossing it never looks like a line.',
 example:`Zoom into a sphere 128 times and the patch in the window rises only ${D4_d1(100*D4_zoomPatch('sphere',.5,7).dev)}% of the window’s radius above a flat plane; each doubling of the zoom roughly halves that. At the crossing of a figure eight, ${D4_arms(0,D4_rho(7))} arms leave the window at every zoom, where a line would have 2.`,
 desc:'On the left a sphere, a torus or a figure-eight curve with a small window round one point; on the right the view inside the window, enlarged, with counts of the zoom, the window width and either the height of the surface above a flat plane or the number of arms leaving the window.',
 research:['Riemann (1854, published 1868). Über die Hypothesen, welche der Geometrie zu Grunde liegen. Abhandlungen der Königlichen Gesellschaft der Wissenschaften zu Göttingen 13: “mehrfach ausgedehnte Grössen”, n-fold extended manifoldnesses.','Heights are measured from the formulas of the sphere and torus; arms are counted where the curve crosses the window’s edge.'],
 dur:15,hint:'Choose a shape, move the point and zoom in. A surface flattens out everywhere; on the figure eight, put the point on the crossing and zoom as far as you like.',
 init:()=>({shape:'eight',at:0,k:3}),
 watch(p){const seg=Math.min(2,Math.floor(p*3)),u=p*3-seg;return {shape:['sphere','torus','eight'][seg],at:seg===0?.6:seg===1?.5:0,k:Math.min(D4_ZSTEPS-1,Math.floor(u*D4_ZSTEPS))}},
 ui:[{choose:[['sphere','Sphere'],['torus','Torus'],['eight','Figure eight']],label:'Shape',get:s=>s.shape,act:'shape'},
  {range:'at',label:'Where',min:0,max:D4_EIGHT_STEPS,get:s=>Math.round(s.at*D4_EIGHT_STEPS),act:'at'},
  {range:'k',label:'Zoom',min:0,max:D4_ZSTEPS-1,get:s=>s.k,act:'k',show:v=>'×'+2**v}],
 on:{shape(s,v){if(['sphere','torus','eight'].includes(v))s.shape=v},at(s,v){s.at=clamp(Math.round(+v),0,D4_EIGHT_STEPS)/D4_EIGHT_STEPS},k(s,v){s.k=clamp(Math.round(+v),0,D4_ZSTEPS-1)}},
 draw(s){
  const z=2**s.k,rho=D4_rho(s.k),eight=s.shape==='eight';let out='',ph;
  out+=R(16,46,272,236,'#fff',C.grid,8)+R(312,46,272,236,'#fff',C.grid,8)+TF(28,64,'the whole shape',13,C.muted,'start')+TF(324,64,'inside the window, enlarged ×'+z,13,C.muted,'start');
  if(eight){
   const t0=D4_TAU*s.at,c=D4_eight(t0),arms=D4_arms(t0,rho),cross=Math.abs(Math.sin(t0))<1e-9;
   const M=q=>[152+q[0]*92,170-q[1]*92],pts=range(241).map(i=>M(D4_eight(D4_TAU*i/240)));
   out+=D4_poly(pts,C.blue,2.6);const cc=M(c),wr=Math.max(3,rho*92);out+=R(cc[0]-wr,cc[1]-wr,2*wr,2*wr,'none',C.coral,2)+Ci(cc[0],cc[1],4,C.coral);
   // enlarged: the curve within the window
   const Z=q=>[448+(q[0]-c[0])/rho*100,170-(q[1]-c[1])/rho*100],segs=[];let cur=[];
   for(let i=0;i<=6000;i++){const q=D4_eight(D4_TAU*i/6000),inn=Math.abs(q[0]-c[0])<=rho*1.15&&Math.abs(q[1]-c[1])<=rho*1.15;if(inn)cur.push(Z(q));else if(cur.length){segs.push(cur);cur=[]}}
   if(cur.length)segs.push(cur);
   out+=`<clipPath id="d4zc"><rect x="318" y="72" width="260" height="204"/></clipPath>`+G(segs.map(sg=>D4_poly(sg,C.blue,3)).join(''),'clip-path="url(#d4zc)"');
   out+=`<circle cx="448" cy="170" r="100" fill="none" stroke="${C.coral}" stroke-width="1.6" stroke-dasharray="5 4"/>`+Ci(448,170,5,C.coral);
   out+=D4_tile(40,296,160,'Zoom','×'+z,C.ink)+D4_tile(220,296,160,'Window radius',String(Number(rho.toPrecision(2))),C.ink)+D4_tile(400,296,160,'Arms leaving it',String(arms),arms===2?C.green:C.coral);
   out=heading(cross?`At the crossing: ${arms} arms at every zoom`:`An ordinary point: ${arms} arms, like a line`)+out;
   ph=cross?`The point sits where the figure eight crosses itself. However far you zoom, ${arms} arms leave the dashed circle, the shape of an X, never a single line. That one point stops the figure eight from being a one-dimensional manifold.`:`Away from the crossing the curve, enlarged, is a nearly straight piece with ${arms} ends leaving the window, like a short piece of line. Move the point to the crossing (Where = 0 or 20).`;
  }else{
   const zp=D4_zoomPatch(s.shape,s.at,s.k),sph=s.shape==='sphere',Pr=D4_view(.5,.55,152,176,sph?78:40);
   out+=sph?D4_wire((u,v)=>D4_sphPt(v,u),range(13).map(i=>D4_TAU*i/12),range(13).map(j=>-Math.PI/2+Math.PI*j/12),Pr,'#8fb2c8'):D4_wire(D4_torPt,range(33).map(i=>D4_TAU*i/32),range(17).map(j=>D4_TAU*j/16),Pr,'#8fb2c8',1);
   const ring=range(41).map(i=>{const a=D4_TAU*i/40,r=Math.min(rho,.5);return Pr(zp.p.map((x,j)=>x+r*(Math.cos(a)*zp.t1[j]+Math.sin(a)*zp.t2[j])))});
   out+=D4_poly(ring,C.coral,2)+point3(zp.p,Pr,C.coral,4.5);
   // enlarged patch in local coordinates, seen from a little above the tangent plane
   const Lp=D4_view(.45,.42,448,184,82),g=zp.grid,N=g.length-1;let mesh='';
   for(let i=0;i<=N;i++){mesh+=D4_poly(g[i].map(q=>Lp([q[0],q[1],q[2]])),C.blue,1.3);mesh+=D4_poly(g.map(r=>r[i]).map(q=>Lp([q[0],q[1],q[2]])),C.blue,1.3)}
   const sq=[[-1.15,-1.15],[1.15,-1.15],[1.15,1.15],[-1.15,1.15],[-1.15,-1.15]].map(q=>Lp([q[0],q[1],0]));
   out+=`<clipPath id="d4zc"><rect x="318" y="72" width="260" height="204"/></clipPath>`+G(D4_poly(sq,C.coral,1.4,'stroke-dasharray="5 4"')+mesh,'clip-path="url(#d4zc)"')+Ci(448,184,4,C.coral);
   out+=TF(448,270,'dashed: a flat plane through the point',13,C.coral);
   out+=D4_tile(40,296,160,'Zoom','×'+z,C.ink)+D4_tile(220,296,160,'Window radius',String(Number(rho.toPrecision(2))),C.ink)+D4_tile(400,296,160,'Height off flat',D4_d1(100*zp.dev)+'% of radius',zp.dev<.05?C.green:C.blue);
   out=heading(`${sph?'Sphere':'Torus'}: ${zp.dev<.05?'flat to the eye':'still visibly curved'} at ×${z}`)+out;
   ph=`Inside the window the ${s.shape} rises at most ${D4_d1(100*zp.dev)}% of the window’s radius above the flat plane through the point. ${s.k<D4_ZSTEPS-1?'Zoom once more and the figure roughly halves.':'At this zoom the patch is flat to the eye.'} This happens at every point you choose${sph?'':', on the outside, the top and the inside of the ring alike'}: the ${s.shape} is a two-dimensional manifold.`;
  }
  out+=D4_note(eight?'Where = 0 and Where = 20 are the two passes through the crossing point.':'Heights are measured from the surface’s formula, not drawn by hand.');
  return {svg:out,phase:ph};
 }});

// An atlas of the sphere from its six open hemispheres. The map for the hemisphere x > 0 shows a point by (y, z),
// and so on: each map is the hemisphere seen straight down its axis, a disc of radius 1.
const D4_CHARTS=[{ax:0,sg:1,lab:'x > 0',c:[1,2]},{ax:0,sg:-1,lab:'x < 0',c:[1,2]},{ax:1,sg:1,lab:'y > 0',c:[0,2]},{ax:1,sg:-1,lab:'y < 0',c:[0,2]},{ax:2,sg:1,lab:'z > 0',c:[0,1]},{ax:2,sg:-1,lab:'z < 0',c:[0,1]}];
const D4_XYZ='xyz';
const D4_atlasPt=s=>D4_sphPt(s.lat*Math.PI/180,s.lon*Math.PI/180).map(v=>Math.abs(v)<1e-12?0:v);
const D4_onChart=(c,p)=>c.sg*p[c.ax]>0;
// Points no chosen map shows: for each axis with both maps chosen the coordinate must be 0; with one map chosen it
// must have the other sign. Nonempty exactly when some axis has fewer than two maps; its dimension is (free axes − 1).
function D4_missed(on){const free=[0,1,2].filter(a=>!(on[2*a]&&on[2*a+1]));
 const sign=a=>on[2*a]?-1:on[2*a+1]?1:0;   // forced sign, 0 when unconstrained
 const pts=[];if(free.length){const M=free.length===1?1:free.length===2?60:24;
  if(free.length===1){const v=[0,0,0];v[free[0]]=sign(free[0])||1;pts.push(v);if(!sign(free[0])){const w=[0,0,0];w[free[0]]=-1;pts.push(w)}}
  else if(free.length===2){for(let i=0;i<=4*M;i++){const a=D4_TAU*i/(4*M),v=[0,0,0];v[free[0]]=Math.cos(a);v[free[1]]=Math.sin(a);if(free.every(f=>!sign(f)||sign(f)*v[f]>=-1e-12))pts.push(v)}}
  else for(let i=0;i<=M;i++)for(let j=0;j<2*M;j++){const v=D4_sphPt(-Math.PI/2+Math.PI*i/M,Math.PI*j/M);if(free.every(f=>!sign(f)||sign(f)*v[f]>=-1e-12))pts.push(v)}}
 const forced=free.map(a=>sign(a));
 return {free,pts,dim:free.length-1,forced};
}
function D4_missedText(m,short){if(!m.free.length)return 'none';
 if(short){const k=m.forced.filter(Boolean).length,f=m.free.length;return f===1?(k?'one point':'two points'):f===2?(k===2?'¼ circle':k===1?'½ circle':'a circle'):(k===3?'⅛ of sphere':k===2?'¼ of sphere':k===1?'½ of sphere':'all of it')}
 if(m.free.length===1){const a=m.free[0],sg=m.forced[0];const pt=sg=>'('+[0,1,2].map(i=>i===a?(sg<0?'−1':'1'):'0').join(', ')+')';return sg?pt(sg):pt(1)+' and '+pt(-1)}
 if(m.free.length===2){const k=m.forced.filter(Boolean).length;return k===2?'a quarter circle':k===1?'a half circle':'a whole circle'}
 const k=m.forced.filter(Boolean).length;return k===3?'an eighth of the sphere':k===2?'a quarter of the sphere':k===1?'half the sphere':'the whole sphere'}
SCENE({id:'manifold-idea-atlas',name:'An atlas of maps',tag:'Charts: Weyl 1913, Whitney 1936',
 definition:'A chart is a map of part of a space onto a patch of flat coordinates, and an atlas is a set of charts that between them show every point, overlapping where they meet, like the pages of a world atlas. Hermann Weyl (1913) defined a surface this way, and Hassler Whitney (1936) gave the general definition used today: a manifold is a space with such an atlas, in which every change from one chart’s coordinates to another’s is smooth.',
 example:'Six hemispheres make an atlas of the sphere: the hemisphere x > 0 is mapped to the disc of its (y, z) coordinates, and so on. Leave out the map for z < 0 and the south pole (0, 0, −1) is shown on no map. Two charts can do the job (stereographic projection from each pole), but one never can: a chart’s image is an open patch of the plane, and no such patch matches the whole sphere.',
 desc:'A globe with a chosen point, six small disc maps, one for each open hemisphere, that can be switched on or off, the point plotted on every map that shows it, and a count of maps and of points that no chosen map shows.',
 research:['Weyl (1913). Die Idee der Riemannschen Fläche. Teubner, Leipzig: a surface defined by overlapping neighbourhoods with coordinates.','Whitney (1936). Differentiable manifolds. Annals of Mathematics 37, 645–680.'],
 dur:14,hint:'Move the point with the sliders, then press maps to switch them off. Which points are lost? Can you find an atlas with fewer than six of these maps?',
 init:()=>({lat:30,lon:-30,on:[1,1,1,1,1,1]}),
 watch(p){const k=Math.min(5,Math.floor(p*6));const on=[1,1,1,1,1,1];if(k>=2)on[5]=0;if(k>=3)on[3]=0;if(k>=4)on[1]=0;return {lat:k===0?30:k===1?0:k<4?-90:-30,lon:k===0?-30:k===1?0:k<4?0:-90+30*k,on}},
 ui:[{range:'lat',label:'Latitude (°)',min:-90,max:90,step:15,get:s=>s.lat,act:'lat'},{range:'lon',label:'Longitude (°)',min:-180,max:165,step:15,get:s=>s.lon,act:'lon'},{b:'All six maps',act:'all'}],
 on:{lat(s,v){s.lat=clamp(Math.round(+v/15)*15,-90,90)},lon(s,v){s.lon=clamp(Math.round(+v/15)*15,-180,165)},all(s){s.on=[1,1,1,1,1,1]},
  map(s,v){const i=clamp(Math.round(+v),0,5);s.on[i]=s.on[i]?0:1;return 'keep'}},
 draw(s,f,X){
  const p=D4_atlasPt(s),m=D4_missed(s.on),shows=D4_CHARTS.map((c,i)=>s.on[i]&&D4_onChart(c,p)),ns=shows.filter(Boolean).length,nm=s.on.filter(Boolean).length;
  let out=heading(ns?`The point is on ${ns} of the ${nm} chosen ${D4_plural(nm,'map')}`:'No chosen map shows this point');
  const yaw=-Math.PI/2-(s.lon*Math.PI/180)+.35,Pr=D4_view(yaw,.42,150,190,112);
  out+=Ci(150,190,112,'#f7fafc',C.grid);
  out+=D4_wire((u,v)=>D4_sphPt(v,u),range(25).map(i=>D4_TAU*i/24),range(13).map(j=>-Math.PI/2+Math.PI*j/12),Pr,'#9fbdd0',1);
  for(const q of m.pts){const r=Pr(q);out+=Ci(r[0],r[1],m.free.length===1?6:2.6,r[2]>0?C.coral:'#f0b8a8')}
  const pp=Pr(p);out+=Ci(pp[0],pp[1],7,pp[2]>=0?C.ink:'#9aa8b1','#fff');
  out+=TF(150,330,'globe turned so the point faces you',13,C.muted);
  // the six maps
  D4_CHARTS.forEach((c,i)=>{const cx=350+(i%3)*96,cy=106+Math.floor(i/3)*122,on=s.on[i];
   let g=Ci(cx,cy,40,on?(shows[i]?C.greenp:'#fff'):'#eef1f3',on?C.blue:C.line,on?'':'stroke-dasharray="4 4"');
   g+=L(cx-40,cy,cx+40,cy,C.grid,1)+L(cx,cy-40,cx,cy+40,C.grid,1);
   if(on&&D4_onChart(c,p)){const a=p[c.c[0]],b=p[c.c[1]];g+=Ci(cx+a*40,cy-b*40,5.5,C.ink,'#fff')}
   g+=TBF(cx,cy+58,c.lab,13,on?C.ink:C.muted)+TF(cx,cy+75,on?`(${D4_XYZ[c.c[0]]}, ${D4_XYZ[c.c[1]]})`:'off',13,C.muted);
   out+=hit(X,'map',i,`Map of the hemisphere ${c.lab}: ${on?'on':'off'}. Press to switch.`,g)});
  out+=D4_tile(318,312,124,'Maps chosen',`${nm} of 6`,C.ink)+D4_tile(450,312,132,'Points missed',D4_missedText(m,1),m.free.length?C.coral:C.green,46);
  out+=TF(150,352,`point (${p.map(D4_d2).join(', ')})`,13,C.ink);
  const two=D4_CHARTS.map((c,i)=>shows[i]?i:-1).filter(i=>i>=0);
  let ph;
  if(!ns)ph=`The point (${p.map(D4_d2).join(', ')}) lies on no chosen map, so these maps are not an atlas. ${m.free.length?`Points missed: ${D4_missedText(m)}, drawn in red.`:''} Switch a map back on.`;
  else if(two.length>=2){const A=D4_CHARTS[two[0]],B=D4_CHARTS[two[1]],ca=A.c.map(j=>D4_d2(p[j])),cb=B.c.map(j=>D4_d2(p[j]));
   ph=`On map ${A.lab} the point has coordinates (${ca.join(', ')}); on map ${B.lab}, (${cb.join(', ')}). Changing maps is a formula: the coordinate one map lacks is ${D4_XYZ[A.ax]} = ${A.sg>0?'':'−'}√(1 − ${D4_XYZ[A.c[0]]}² − ${D4_XYZ[A.c[1]]}²), smooth wherever the two maps overlap.${m.free.length?` Points missed by the chosen maps: ${D4_missedText(m)}.`:''}`}
  else ph=`Only map ${D4_CHARTS[two[0]].lab} shows this point${Math.abs(p[0])+Math.abs(p[1])+Math.abs(p[2])===1?': it is the centre of that hemisphere and on the edge of all the others, which are open and do not include their edges':''}. ${m.free.length?`Points missed: ${D4_missedText(m)}.`:'Every point is on at least one map, so this is an atlas.'}`;
  return {svg:out,phase:ph};
 }});

// Letters as drawings made of strokes. At a probe point, a small circle is drawn and the points where it meets
// the strokes are counted: 2 means the letter looks like a line there, 1 an end, 3 or more a branch point.
function D4_arc(cx,cy,rx,ry,a0,a1,n=24){return range(n+1).map(i=>{const a=a0+(a1-a0)*i/n;return [cx+rx*Math.cos(a),cy+ry*Math.sin(a)]})}
const D4_LETTERS={
 O:[D4_arc(.5,.7,.42,.62,0,D4_TAU,48)],
 S:[D4_arc(.5,1.05,.36,.3,-.25,Math.PI*1.5,24).concat(D4_arc(.5,.45,.36,.3,Math.PI*.5,-Math.PI*.75,24).slice(1))],
 C:[D4_arc(.55,.7,.45,.62,.75,D4_TAU-.75,36)],
 X:[[[.1,0],[.5,.7],[.9,1.4]],[[.9,0],[.5,.7],[.1,1.4]]],
 T:[[[.05,1.35],[.5,1.35],[.95,1.35]],[[.5,1.35],[.5,.7],[.5,0]]],
 Y:[[[.08,1.38],[.5,.7]],[[.92,1.38],[.5,.7]],[[.5,.7],[.5,0]]],
 8:[D4_arc(.5,1.04,.3,.34,Math.PI/2,Math.PI/2+D4_TAU,36),D4_arc(.5,.36,.4,.34,-Math.PI/2,-Math.PI/2+D4_TAU,40)]};
const D4_LKEYS=['O','C','S','X','T','Y','8'];
// Probe points: every stroke's ends (where strokes meet, branch points) and points a quarter, half and three
// quarters of the way along each stroke, with repeats removed.
function D4_probes(key){return D4_memo('pr:'+key,()=>{const out=[];const add=q=>{if(!out.some(o=>Math.hypot(o[0]-q[0],o[1]-q[1])<.03))out.push(q)};
 for(const st of D4_LETTERS[key]){add(st[0]);add(st[st.length-1]);const len=[0];for(let i=1;i<st.length;i++)len.push(len[i-1]+Math.hypot(st[i][0]-st[i-1][0],st[i][1]-st[i-1][1]));
  const T=len[len.length-1];for(const fr of [.25,.5,.75]){const d=fr*T;let i=1;while(i<st.length-1&&len[i]<d)i++;const u=(d-len[i-1])/((len[i]-len[i-1])||1);add([lerp(st[i-1][0],st[i][0],u),lerp(st[i-1][1],st[i][1],u)])}}
 return out})}
// Where a circle of radius r round c meets the strokes (each segment taken half-open, so shared ends count once).
function D4_meet(key,c,r){const pts=[];for(const st of D4_LETTERS[key])for(let i=1;i<st.length;i++){const a=st[i-1],b=st[i],dx=b[0]-a[0],dy=b[1]-a[1],fx=a[0]-c[0],fy=a[1]-c[1];
  const A=dx*dx+dy*dy,B=2*(fx*dx+fy*dy),Cc=fx*fx+fy*fy-r*r,D=B*B-4*A*Cc;if(D<0||A===0)continue;
  for(const t of [(-B-Math.sqrt(D))/(2*A),(-B+Math.sqrt(D))/(2*A)])if(t>=0&&t<1)pts.push([a[0]+t*dx,a[1]+t*dy])}
 return pts}
const D4_LR=.07;
function D4_letterVerdict(key){return D4_memo('lv:'+key,()=>{const ks=D4_probes(key).map(q=>D4_meet(key,q,D4_LR).length);
 return {ks,max:Math.max(...ks),min:Math.min(...ks),say:Math.max(...ks)>2?'not a manifold':Math.min(...ks)===1?'a manifold with ends':'a manifold'}})}
SCENE({id:'manifold-idea-letters',name:'Which letters are manifolds?',tag:'Testing a point with a small circle',
 definition:'Whether a shape is a manifold can be tested one point at a time. Draw a small circle round the point and count where it meets the shape. On a line it meets it twice. At the end of a curve it meets it once, which makes the end a boundary point. At a branch or a crossing it meets it three or more times, however small the circle, so the shape there is not a one-dimensional manifold. The same test, one dimension up, uses a small sphere: round any point of a surface it meets the surface in a single loop.',
 get example(){const v=D4_LKEYS.map(k=>[k,D4_letterVerdict(k)]);const grp=t=>v.filter(x=>x[1].say===t).map(x=>x[0]),j=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1],ok=grp('a manifold'),ends=grp('a manifold with ends'),bad=v.filter(x=>x[1].say==='not a manifold');
  return `Tested at every end, every branch point and three points along each stroke, ${j(ok)} ${ok.length>1?'pass':'passes'} everywhere and ${j(ends)} ${ends.length>1?'pass':'passes'} except at ${ends.length>1?'their':'its'} two ends. ${j(bad.map(x=>x[0]))} fail: each has a point where the circle meets it ${j([...new Set(bad.map(x=>x[1].max))].sort())} times.`},
 desc:'A row of letters to choose from, the chosen letter enlarged with dots at test points, a small circle round the chosen point with its meeting points marked, and a table of the result for every letter.',
 research:['Brouwer (1911). Beweis der Invarianz der Dimensionenzahl. Mathematische Annalen 70, 161–165: a neighbourhood of one dimension never matches one of another, which is why a branch point cannot be smoothed away.','Counts are computed by intersecting the circle with the letter’s strokes.'],
 dur:14,hint:'Choose a letter, then press its dots to test each point. Which letters pass at every point?',
 init:()=>({key:'X',pi:D4_letterVerdict('X').ks.indexOf(D4_letterVerdict('X').max)}),
 watch(p){const i=Math.min(D4_LKEYS.length-1,Math.floor(p*D4_LKEYS.length)),key=D4_LKEYS[i],u=p*D4_LKEYS.length-i,n=D4_probes(key).length;
  const ks=D4_letterVerdict(key).ks,order=range(n).sort((a,b)=>ks[a]-ks[b]);return {key,pi:order[Math.min(n-1,Math.floor(u*n))]}},
 ui:[{choose:D4_LKEYS.map(k=>[k,k]),label:'Letter',get:s=>s.key,act:'key'}],
 on:{key(s,v){if(D4_LETTERS[v]){s.key=v;s.pi=D4_letterVerdict(v).ks.indexOf(D4_letterVerdict(v).max)}},probe(s,v){s.pi=clamp(Math.round(+v),0,D4_probes(s.key).length-1);return 'keep'},pick(s,v){if(D4_LETTERS[v]){s.key=v;s.pi=D4_letterVerdict(v).ks.indexOf(D4_letterVerdict(v).max)}return 'keep'}},
 draw(s,f,X){
  const pr=D4_probes(s.key),q=pr[Math.min(s.pi,pr.length-1)],mt=D4_meet(s.key,q,D4_LR),k=mt.length;
  const M=a=>[80+a[0]*150,338-a[1]*150];
  let out=heading(`${s.key}: the circle meets it ${k} ${D4_plural(k,'time')} here`);
  // letter chooser
  D4_LKEYS.forEach((key,i)=>{const x=28+i*80,sel=key===s.key,v=D4_letterVerdict(key);let g=R(x,44,68,50,sel?C.pale:'#fff',sel?C.blue:C.grid,8);
   g+=G(D4_LETTERS[key].map(st=>D4_poly(st.map(a=>[x+18+a[0]*32,88-a[1]*28]),sel?C.blue:C.ink,2)).join(''));
   out+=hit(X,'pick',key,`Letter ${key}`,g)});
  out+=R(20,104,272,250,'#fff',C.grid,8);
  for(const st of D4_LETTERS[s.key])out+=D4_poly(st.map(M),C.blue,5);
  pr.forEach((a,i)=>{const m=M(a),kk=D4_letterVerdict(s.key).ks[i];out+=hit(X,'probe',i,`Test point ${i+1}`,Ci(m[0],m[1],i===s.pi?7:6,kk===2?C.green:kk===1?C.amber:C.coral,'#fff'))});
  const c=M(q);out+=`<circle cx="${fmt(c[0])}" cy="${fmt(c[1])}" r="${fmt(D4_LR*150)}" fill="none" stroke="${C.ink}" stroke-width="1.6" stroke-dasharray="4 3"/>`;
  for(const m of mt){const mm=M(m);out+=Ci(mm[0],mm[1],3.6,C.ink)}
  // the table
  out+=R(308,104,276,250,'#fff',C.grid,8)+TBF(322,126,'Letter',13,C.ink,'start')+TBF(372,126,'circle meets it',13,C.ink,'start')+TBF(488,126,'verdict',13,C.ink,'start');
  D4_LKEYS.forEach((key,i)=>{const v=D4_letterVerdict(key),y=150+i*28,sel=key===s.key;
   if(sel)out+=R(312,y-17,268,24,C.pale,'none',4);
   out+=TBF(334,y,key,14,C.ink)+TF(372,y,v.min===v.max?`${v.min} times`:`${v.min} to ${v.max} times`,13,C.ink,'start')+TF(488,y,v.max>2?'not a manifold':v.min===1?'has ends':'manifold',13,v.max>2?C.coral:v.min===1?C.amber:C.green,'start')});
  out+=TF(20,372,'dots: green 2, amber 1 (an end), red 3 or more',13,C.muted,'start');
  const ph=k===2?`The circle meets ${s.key} twice: near this point the letter is a piece of line, one-dimensional. Shrink the circle and it still meets it twice.`:
   k===1?`The circle meets ${s.key} once: this is an end. A manifold with boundary allows such points; a closed loop like O has none.`:
   `The circle meets ${s.key} ${k} times. No piece of a line looks like this, and shrinking the circle does not help, so ${s.key} is not a manifold at this point.`;
  return {svg:out,phase:ph};
 }});

/* ===================== Lesson: gluing-diagrams ===================== */
// Arrows drawn on the sides of a square: one chevron for the first pair of sides, two for the second.
function D4_chev(x1,y1,x2,y2,n,col,dir=1){const mx=(x1+x2)/2,my=(y1+y2)/2,d=Math.hypot(x2-x1,y2-y1),ux=(x2-x1)/d*dir,uy=(y2-y1)/d*dir;let out='';
 for(let k=0;k<n;k++){const cx=mx+ux*(k*9-(n-1)*4.5+4),cy=my+uy*(k*9-(n-1)*4.5+4);out+=P(`M${fmt(cx-ux*8-uy*6)} ${fmt(cy-uy*8+ux*6)} L${fmt(cx)} ${fmt(cy)} L${fmt(cx-ux*8+uy*6)} ${fmt(cy-uy*8-ux*6)}`,col,2.6)}return out}
// A square [x0,x0+w]×[y0,y0+w] (y up in the square's coordinates) with the arrows of a gluing type.
function D4_square(type,x0,y0,w,o={}){
 const G=D4_GLUE[type],S={B:[[x0,y0+w],[x0+w,y0+w]],T:[[x0,y0],[x0+w,y0]],L:[[x0,y0+w],[x0,y0]],R:[[x0+w,y0+w],[x0+w,y0]]};
 let out=R(x0,y0,w,w,o.fill||'#f6f9fb','none',0);const used=new Set();
 G.pairs.forEach(([a,b,f],i)=>{const col=i?C.purple:C.coral;for(const [sd,fl] of [[a,0],[b,f]]){used.add(sd);const [p,q]=S[sd];out+=L(p[0],p[1],q[0],q[1],col,3.4)+D4_chev(p[0],p[1],q[0],q[1],i+1,col,fl?-1:1)}});
 for(const sd of 'BTLR')if(!used.has(sd)){const [p,q]=S[sd];out+=L(p[0],p[1],q[0],q[1],C.ink,2,'stroke-dasharray="6 5"')}
 return out}
// The ship: steps of length 0.05 across the square; leaving through a glued side it comes back through the partner,
// flipped (and mirror-reversed) when the arrows point opposite ways along the square; a free side is a wall.
const D4_SHIP_D=.05;
function D4_shipPath(type,ang,n,x=.3,y=.42){
 const G=D4_GLUE[type],pair=sd=>G.pairs.find(p=>p[0]===sd||p[1]===sd);let th=ang*Math.PI/180,m=1;const fr=[{x,y,th,m,ev:null,trail:[[x,y]]}];let trail=[[x,y]],cross=0,flips=0;
 for(let i=0;i<n;i++){let nx=x+D4_SHIP_D*Math.cos(th),ny=y+D4_SHIP_D*Math.sin(th),ev=null;
  const side=nx>1?'R':nx<0?'L':ny>1?'T':ny<0?'B':null;
  if(side){const pr=pair(side);trail.push([nx,ny]);
   if(!pr){// a wall: reflect
    if(side==='T'||side==='B'){ny=side==='T'?2-ny:-ny;th=-th}else{nx=side==='R'?2-nx:-nx;th=Math.PI-th}ev={side,wall:1};trail.push([nx,ny])}
   else{const fl=pr[2];if(side==='R'||side==='L'){nx+=side==='R'?-1:1;if(fl){ny=1-ny;th=-th;m=-m}}else{ny+=side==='T'?-1:1;if(fl){nx=1-nx;th=Math.PI-th;m=-m}}
    cross++;if(fl)flips++;ev={side,to:side==='R'?'L':side==='L'?'R':side==='T'?'B':'T',flip:fl};trail=trail.concat([null,[nx-(D4_SHIP_D*Math.cos(th)),ny-(D4_SHIP_D*Math.sin(th))]])}}
  x=nx;y=ny;trail.push([x,y]);if(trail.length>160)trail=trail.slice(-160);
  fr.push({x,y,th,m,ev,cross,flips,trail:trail.slice()})}
 return fr}
const D4_SIDE={B:'bottom',T:'top',L:'left',R:'right'};
const D4_TOUR=['cylinder','torus','klein','rp2'];
function D4_shipFrames(s){const types=s.type==='tour'?D4_TOUR:[s.type],out=[];
 for(const ty of types){const fr=D4_shipPath(ty,s.ang,s.type==='tour'?34:64);fr.forEach((f,i)=>{let say;const nm=D4_GLUE[ty].name;
  if(f.ev&&f.ev.wall)say=`The ship hits the ${D4_SIDE[f.ev.side]} side. On a ${nm} that side is not glued to anything: it is an edge of the surface, and the ship turns back.`;
  else if(f.ev)say=`Out through the ${D4_SIDE[f.ev.side]} side, back in through the ${D4_SIDE[f.ev.to]}${f.ev.flip?', upside down: the arrows on these two sides point opposite ways along the square, so the ship returns mirror-reversed':', where the arrows match, so it carries straight on'}. ${f.m<0?'It is now the mirror image of the ship that set out.':''}`;
  else say=i===0?`A ${nm}: ${ty==='cylinder'?'the left and right sides are glued, top and bottom are free edges.':ty==='torus'?'both pairs of sides are glued, arrows matching, as in Asteroids.':ty==='klein'?'left and right glued straight, top and bottom glued with a flip.':'both pairs glued with a flip.'}`:`The ship flies straight on: ${f.cross||0} ${D4_plural(f.cross||0,'crossing')} so far${f.flips?`, ${f.flips} of them flipped`:''}.`;
  out.push({...f,type:ty,say})})}
 return out}
function D4_ship(x,y,th,m,col=C.ink){const c=Math.cos(th),s=Math.sin(th),pt=(a,b)=>[x+a*c-b*m*s,y-(a*s+b*m*c)];
 // nose forward, a fin on the ship's left only, so a mirror image shows the fin on the other side
 const body=[pt(13,0),pt(-9,-7),pt(-5,0),pt(-9,7)],fin=[pt(-3,5),pt(-10,15),pt(-7,5)];
 return `<polygon points="${body.map(p=>fmt(p[0])+','+fmt(p[1])).join(' ')}" fill="${col}"/><polygon points="${fin.map(p=>fmt(p[0])+','+fmt(p[1])).join(' ')}" fill="${C.amber}"/>`}
SCENE({id:'gluing-diagrams',name:'Fly off one edge, come back on another',tag:'Gluing the sides of a square',
 definition:'A gluing diagram is a square, or another polygon, with arrows on its sides: sides with the same arrows are to be glued so that the arrows match. Nobody has to do the gluing in space. A traveller who leaves through one side simply comes back through its partner. Glue left to right and you have a cylinder; glue top to bottom as well and you have a torus, the playing field of the arcade game Asteroids (1979). Flip one pair and the same square becomes a Klein bottle; flip both and it is a projective plane.',
 example:'On a torus the ship always comes back the right way round. On a Klein bottle, crossing the flipped pair of sides returns it upside down and mirror-reversed: its fin, on its left as it set out, is now on its right. A second flipped crossing puts it right again.',
 desc:'A square with coloured arrows on its sides, a small ship with a fin on one side flying in a straight line, its trail, and counts of crossings, flipped crossings and whether the ship is now mirror-reversed.',
 research:['Poincaré (1895). Analysis situs. Journal de l’École polytechnique: spaces built from polygons and polyhedra with paired faces.','Weeks (1985). The Shape of Space: flatlanders, tic-tac-toe and flight on a torus and a Klein bottle.','Asteroids (Atari, 1979): objects leaving one edge of the screen reappear at the opposite edge.'],
 dur:18,hint:'Choose a surface and a heading, then press Fly. Watch the fin: on which surfaces does the ship come back as its own mirror image?',
 init:()=>({type:'tour',ang:30}),
 trace:D4_shipFrames,
 ui:[{choose:[['tour','All four'],['cylinder','Cylinder'],['torus','Torus'],['klein','Klein bottle'],['rp2','Projective plane']],label:'Surface',get:s=>s.type,act:'type'},
  {range:'ang',label:'Heading (°)',min:0,max:345,step:15,get:s=>s.ang,act:'ang'},{b:'Fly ▶',act:'fly'}],
 on:{type(s,v){if(v==='tour'||D4_GLUE[v])s.type=v},ang(s,v){s.ang=clamp(Math.round(+v/15)*15,0,345)},fly(){return 'run'}},
 draw(s,f,X){
  f=f||D4_shipFrames(s)[0];const x0=150,y0=62,w=230,M=q=>[x0+q[0]*w,y0+w-q[1]*w];
  let out=heading(`${D4_cap(D4_GLUE[f.type].name)}: ${f.m<0?'the ship is now mirror-reversed':'the ship is the right way round'}`);
  out+=D4_square(f.type,x0,y0,w);
  // trail (null entries break the line where the ship jumped across)
  let seg=[];const segs=[];for(const q of f.trail){if(!q){if(seg.length)segs.push(seg);seg=[];continue}seg.push(M([clamp(q[0],-.02,1.02),clamp(q[1],-.02,1.02)]))}if(seg.length)segs.push(seg);
  out+=G(segs.map(sg=>D4_poly(sg,'#9ab7c9',2,'stroke-dasharray="3 4"')).join(''));
  const sp=M([f.x,f.y]);out+=D4_ship(sp[0],sp[1],f.th,f.m,f.m<0?C.coral:C.ink);
  out+=TF(x0+w/2,y0+w+22,'fin (amber) on the ship’s left when it set out',13,C.muted);
  out+=D4_tile(400,70,180,'Crossings',String(f.cross||0),C.ink)+D4_tile(400,126,180,'Flipped crossings',String(f.flips||0),f.flips?C.coral:C.ink)+D4_tile(400,182,180,'Mirror-reversed?',f.m<0?'yes':'no',f.m<0?C.coral:C.green);
  out+=TF(490,252,'same marks = glued sides',13,C.muted)+TF(490,270,'dashed = free edge',13,C.muted);
  out+=TF(20,90,'arrows',13,C.muted,'start')+TF(20,108,'one chevron:',13,C.coral,'start')+TF(20,124,'first pair',13,C.coral,'start')+TF(20,148,'two chevrons:',13,C.purple,'start')+TF(20,164,'second pair',13,C.purple,'start');
  out+=D4_note('The square is never bent: gluing is a rule about where you come back.',340);
  return {svg:out};
 }});

// Rolling the square into a torus. Sheet coordinates (s, t) in [0, 1]². First the sheet curls across t (bottom side
// meets top side) into a tube of radius r; then the tube's length, along s, bends round into a ring of radius R, so
// the left and right ends meet. Bending a length τ with curvature κ moves it to (sin κτ / κ, (1 − cos κτ) / κ).
const D4_RR=1,D4_RT=.42;
function D4_bend(tau,k){return Math.abs(k)<1e-9?[tau,0]:[Math.sin(k*tau)/k,(1-Math.cos(k*tau))/k]}
function D4_rollPt(roll,s,t){
 const a=clamp(roll/50,0,1),b=clamp((roll-50)/50,0,1),Ls=D4_TAU*D4_RR,Lt=D4_TAU*D4_RT;
 const [Y,Z]=D4_bend((t-.5)*Lt,a/D4_RT),Xs=(s-.5)*Ls;
 if(b<1e-9)return [Xs,Y,Z];
 const k2=b/D4_RR,al=k2*Xs,rr=1/k2-Y;return [rr*Math.sin(al),1/k2-rr*Math.cos(al),Z];
}
const D4_gcd=(a,b)=>b?D4_gcd(b,a%b):Math.abs(a);
// A straight line on the square in direction (p, q), followed until it returns to its start; crossings counted.
function D4_torusLine(p,q){const g=D4_gcd(p,q),N=400;const pts=[];for(let i=0;i<=N;i++){const tau=i/N/g;pts.push([.1+p*tau,.25+q*tau])}
 let cl=0,ct=0;for(let i=1;i<pts.length;i++){if(Math.floor(pts[i][0])!==Math.floor(pts[i-1][0]))cl++;if(Math.floor(pts[i][1])!==Math.floor(pts[i-1][1]))ct++}
 return {pts:pts.map(q=>[q[0]-Math.floor(q[0]),q[1]-Math.floor(q[1])]),raw:pts,cl,ct,g}}
function D4_rollMesh(roll,Pr,NS=32,NT=14){const quads=[];
 for(let i=0;i<NS;i++)for(let j=0;j<NT;j++){const s0=i/NS,s1=(i+1)/NS,t0=j/NT,t1=(j+1)/NT;
  quads.push({pts:[D4_rollPt(roll,s0,t0),D4_rollPt(roll,s1,t0),D4_rollPt(roll,s1,t1),D4_rollPt(roll,s0,t1)],fill:(i+j)%2?'#d7e7f2':'#eef5fa',stroke:'#b9cfdd',sw:.5})}
 return D4_paint(quads,Pr)}
function D4_rollEdges(roll,Pr){let out='';const N=48;
 const line=(f,col,w)=>{const pts=range(N+1).map(i=>Pr(f(i/N)));let o='';for(let i=1;i<pts.length;i++)o+=L(pts[i-1][0],pts[i-1][1],pts[i][0],pts[i][1],col,w);return o};
 out+=line(u=>D4_rollPt(roll,u,0),C.purple,2.6)+line(u=>D4_rollPt(roll,u,1),C.purple,2.6)+line(u=>D4_rollPt(roll,0,u),C.coral,2.6)+line(u=>D4_rollPt(roll,1,u),C.coral,2.6);
 return out}
// A curve on the rolled surface, dashed where it runs on the far side of the finished torus (outward normal facing away).
function D4_rollCurve(roll,pts,Pr,col,w){
 const P3=pts.map(q=>D4_rollPt(roll,q[0],q[1]));
 const vis=pts.map((q,i)=>{if(roll<100)return true;const al=(q[0]-.5)*D4_TAU,c=[Math.sin(al),1-Math.cos(al),D4_RT],p=P3[i],n=D4_sub3(p,c),a=Pr(p),b=Pr(p.map((x,j)=>x+.01*n[j]));return b[2]>a[2]});
 let out='';for(let i=1;i<P3.length;i++){if(roll<100&&Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1])>.5)continue;const a=Pr(P3[i-1]),b=Pr(P3[i]),v=vis[i]&&vis[i-1];out+=L(a[0],a[1],b[0],b[1],v?col:tint(col,.55),v?w:w*.7,v?'':'stroke-dasharray="3 4"')}
 return out}
SCENE({id:'gluing-diagrams-torus',name:'Rolling the square into a doughnut',tag:'The torus in space',
 definition:'The torus can also be made in ordinary space. Curl the square so that its bottom side meets its top side, which gives a tube; then bend the tube round so that its two ends meet. Every point of the doughnut corresponds to exactly one point of the square once the glued sides are counted once. A straight line on the square with slope q / p becomes a curve that winds p times round the ring and q times round the tube before it closes up.',
 get example(){const t=D4_torusLine(2,3);return `The line in direction (2, 3) crosses the left–right gluing ${t.cl} times and the top–bottom gluing ${t.ct} times before it returns to its start; on the doughnut it goes twice round the ring and three times round the tube, a trefoil knot. Direction (2, 4) closes up after half the distance, because 2 and 4 share the factor ${D4_gcd(2,4)}.`},
 desc:'The square with coloured arrows and a straight line drawn on it, beside the same square curled into a tube and bent into a torus by a slider, with the line carried along.',
 research:['Poincaré (1895). Analysis situs: the torus as a square with opposite sides identified.','Lines of rational slope on a torus are torus knots; the (2, 3) torus knot is the trefoil (Rolfsen, Knots and Links, 1976).'],
 dur:16,hint:'Move the Roll slider to curl the square and then bend the tube. Choose the line’s direction and count how often it crosses each pair of glued sides.',
 init:()=>({roll:100,p:2,q:3}),
 watch(p){return {roll:Math.round(clamp(p*1.4,0,1)*100),p:2,q:3}},
 ui:[{range:'roll',label:'Roll',min:0,max:100,step:5,get:s=>s.roll,act:'roll'},{range:'p',label:'Across, p',min:0,max:4,get:s=>s.p,act:'p'},{range:'q',label:'Up, q',min:0,max:4,get:s=>s.q,act:'q'}],
 on:{roll(s,v){s.roll=clamp(Math.round(+v),0,100)},p(s,v){s.p=clamp(Math.round(+v),0,4);if(!s.p&&!s.q)s.q=1},q(s,v){s.q=clamp(Math.round(+v),0,4);if(!s.p&&!s.q)s.p=1}},
 draw(s){
  const tl=D4_torusLine(s.p,s.q),x0=24,y0=86,w=190,M=q=>[x0+q[0]*w,y0+w-q[1]*w];
  let out=heading(s.roll<50?'Curling the square into a tube':s.roll<100?'Bending the tube into a ring':`A line of direction (${s.p}, ${s.q}) on the torus`);
  out+=D4_square('torus',x0,y0,w);
  let seg=[];const segs=[];tl.pts.forEach((q,i)=>{if(i&&Math.hypot(q[0]-tl.pts[i-1][0],q[1]-tl.pts[i-1][1])>.5){segs.push(seg);seg=[]}seg.push(M(q))});segs.push(seg);
  out+=segs.map(sg=>D4_poly(sg,C.green,2.6)).join('')+Ci(...M(tl.pts[0]),4.5,C.green);
  out+=TF(x0+w/2,y0-12,'purple: bottom = top',13,C.purple)+TF(x0+w/2,y0+w+20,'coral: left = right',13,C.coral);
  const Pr=D4_view(.6,.62,420,196,s.roll<50?60:52);
  out+=R(236,48,350,282,'#fff',C.grid,8)+D4_rollMesh(s.roll,Pr)+D4_rollEdges(s.roll,Pr);
  out+=D4_rollCurve(s.roll,tl.pts,Pr,C.green,2.6);
  out+=D4_tile(24,316,96,'Across',`${tl.cl} ${D4_plural(tl.cl,'time')}`,C.coral)+D4_tile(126,316,96,'Up',`${tl.ct} ${D4_plural(tl.ct,'time')}`,C.purple);
  out+=TF(411,350,'the same square, bent; no stretching shown',13,C.muted);
  const knot=tl.cl>=2&&tl.ct>=2;
  return {svg:out,phase:s.roll<100?`Roll ${s.roll}%: ${s.roll<50?'the bottom side (purple) is coming round to meet the top':'the tube’s two ends (coral) are coming round to meet'}. Nothing is torn; when the roll is complete each glued pair of sides has become one circle on the doughnut.`:
   `The green line crosses the coral sides ${tl.cl} ${D4_plural(tl.cl,'time')} and the purple sides ${tl.ct} ${D4_plural(tl.ct,'time')} before it closes up${tl.g>1?` (the direction (${s.p}, ${s.q}) shares the factor ${tl.g}, so it closes after 1/${tl.g} of the way)`:''}. On the doughnut that is ${tl.cl} ${D4_plural(tl.cl,'trip')} round the ring and ${tl.ct} round the tube${knot&&tl.g===1?': a torus knot, which no amount of sliding along the surface can make into a plain circle':''}.`};
 },
 three(s,f,X,project){
  const tl=D4_torusLine(s.p,s.q),pts=[];for(let i=0;i<=8;i++)for(let j=0;j<=8;j++)pts.push(D4_rollPt(s.roll,i/8,j/8));
  const Pr=project(pts);let out=D4_rollMesh(s.roll,Pr,36,16)+D4_rollEdges(s.roll,Pr);
  out+=D4_rollCurve(s.roll,tl.pts,Pr,C.green,3);
  return {svg:out,title:'The square rolled up in 3D',caption:`The square’s points are placed in space by this scene’s formulas (curl, then bend); the 3D view only turns the camera. Purple: the glued bottom and top sides; coral: the glued left and right sides; dashed parts of a line are on the far side; green: the line of direction (${s.p}, ${s.q}).`};
 }});

// Words from a square: sides read anticlockwise from the bottom-left corner (bottom, right, top, left). Each pattern
// says which sides carry the same letter; each side's arrow points with (+1) or against (−1) the reading direction.
const D4_PATTERNS={opp:{name:'Opposite sides',lab:['b','a','b','a']},adj:{name:'Neighbouring sides',lab:['a','a','b','b']},one:{name:'One pair',lab:['b','a','c','a']}};
const D4_sqWord=(pat,dirs)=>D4_PATTERNS[pat].lab.map((l,i)=>({l,e:dirs[i]}));
const D4_sqName=w=>{const i=D4_info(w);return D4_name(i.orient,i.chi,i.b)};
function D4_tally(pat){return D4_memo('tal:'+pat,()=>{const t={};for(let m=0;m<16;m++){const d=range(4).map(i=>(m>>i)&1?-1:1),n=D4_sqName(D4_sqWord(pat,d));t[n]=(t[n]||0)+1}return t})}
SCENE({id:'gluing-diagrams-words',name:'Reading a gluing diagram as a word',tag:'Poincaré’s polygons, 1895',
 definition:'Walk round the square anticlockwise and write down each side’s letter, with an exponent −1 (written a⁻¹) when its arrow points against your walk. The square with opposite sides glued straight reads a b a⁻¹ b⁻¹: the torus. The word holds everything: from it the corners that end up as one point can be worked out, and so the numbers of vertices V, edges E and faces F after gluing, and whether any glued pair reverses the walk, which makes the surface one-sided.',
 get example(){const t=D4_tally('opp'),a=D4_tally('adj');const ls=o=>Object.entries(o).sort((x,y)=>y[1]-x[1]).map(([k,v])=>`${k} ${v}`).join(', ');return `Of the 16 ways to draw four arrows with opposite sides paired: ${ls(t)}. With neighbouring sides paired: ${ls(a)}. The four corners always become either one, two or three points, and that decides V − E + F.`},
 desc:'A square whose four arrows can be reversed by pressing them, its word, its corners numbered by which end up glued together, the counts V, E and F after gluing, V − E + F, whether the surface is one-sided, its name, and a tally over all 16 ways of drawing the arrows.',
 research:['Poincaré (1895). Analysis situs. Journal de l’École polytechnique: polyhedra with faces identified in pairs.','Klein (1882). Über Riemanns Theorie der algebraischen Functionen: polygons with paired sides as models of surfaces.','Counts are computed from the word by identifying corners (union-find).'],
 dur:15,hint:'Press an arrow to reverse it, or choose which sides are paired. Which drawings give a torus, which a Klein bottle, which a sphere?',
 init:()=>({pat:'opp',dirs:[1,1,-1,-1]}),
 watch(p){const seq=[['opp',[1,1,-1,-1]],['opp',[1,1,-1,1]],['opp',[1,1,1,1]],['adj',[1,-1,1,-1]],['adj',[1,1,1,1]],['one',[1,1,-1,-1]],['one',[1,1,-1,1]]],k=Math.min(seq.length-1,Math.floor(p*seq.length));return {pat:seq[k][0],dirs:seq[k][1].slice()}},
 ui:[{choose:Object.entries(D4_PATTERNS).map(([k,v])=>[k,v.name]),label:'Pairs',get:s=>s.pat,act:'pat'},{b:'Torus arrows',act:'torus'}],
 on:{pat(s,v){if(D4_PATTERNS[v])s.pat=v},flip(s,v){const i=clamp(Math.round(+v),0,3);s.dirs[i]=-s.dirs[i];return 'keep'},torus(s){s.pat='opp';s.dirs=[1,1,-1,-1]}},
 draw(s,f,X){
  const w=D4_sqWord(s.pat,s.dirs),inf=D4_info(w),nm=D4_name(inf.orient,inf.chi,inf.b),x0=70,y0=74,W=180;
  const cn=[[x0,y0+W],[x0+W,y0+W],[x0+W,y0],[x0,y0]];
  let out=heading(`${D4_show(w)}: ${nm==='?'?'not a surface':'a '+nm}`);
  out+=R(x0,y0,W,W,'#f6f9fb','none',0);
  const lab=D4_PATTERNS[s.pat].lab,cnt=l=>lab.filter(x=>x===l).length,colOf=l=>cnt(l)<2?C.ink:l==='a'?C.coral:C.purple;
  for(let i=0;i<4;i++){const a=cn[i],b=cn[(i+1)%4],col=colOf(lab[i]),free=cnt(lab[i])<2;
   let g=L(a[0],a[1],b[0],b[1],col,free?2:3.6,free?'stroke-dasharray="6 5"':'')+D4_chev(a[0],a[1],b[0],b[1],lab[i]==='a'?1:2,col,s.dirs[i]);
   const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,ox=i===1?22:i===3?-22:0,oy=i===0?24:i===2?-14:5;
   g+=TBF(mx+ox,my+oy,lab[i]+(s.dirs[i]<0?'⁻¹':''),15,col);
   g=`<rect x="${fmt(Math.min(a[0],b[0])-12)}" y="${fmt(Math.min(a[1],b[1])-12)}" width="${fmt(Math.abs(a[0]-b[0])+24)}" height="${fmt(Math.abs(a[1]-b[1])+24)}" fill="transparent"/>`+g;
   out+=hit(X,'flip',i,`Side ${['bottom','right','top','left'][i]}: arrow ${s.dirs[i]>0?'with':'against'} the walk. Press to reverse.`,g)}
  const vc=[C.blue,C.green,C.amber,C.ink];
  inf.corner.forEach((c,i)=>{out+=Ci(cn[i][0],cn[i][1],10,vc[c%4],'#fff')+TBF(cn[i][0],cn[i][1]+5,c+1,13,'#fff')});
  out+=curveArrow(x0+W/2-30,y0+W/2+20,x0+W/2+30,y0+W/2+20,-26,C.muted,1.6)+TF(x0+W/2,y0+W/2-4,'walk',13,C.muted);
  out+=TF(x0+W/2,y0+W+52,'corners with the same number become one point',13,C.muted);
  // counts
  out+=D4_tile(320,54,80,'V',String(inf.V),C.ink)+D4_tile(408,54,80,'E',String(inf.E),C.ink)+D4_tile(496,54,80,'F',String(inf.F),C.ink);
  out+=D4_tile(320,108,124,'V − E + F',D4_minus(inf.chi),C.blue)+D4_tile(452,108,124,'Sides',inf.orient?'two':'one',inf.orient?C.green:C.coral);
  out+=D4_tile(320,162,256,'Surface',nm,C.ink)+TF(448,226,inf.b?`${inf.b} free ${D4_plural(inf.b,'edge')} (dashed sides)`:'no free edges: a closed surface',13,C.muted);
  const t=D4_tally(s.pat);out+=TBF(320,256,'All 16 ways to draw these arrows:',13,C.ink,'start');
  Object.entries(t).sort((a,b)=>b[1]-a[1]).forEach(([k,v],i)=>{out+=TF(330,278+i*19,`${v} × ${k}`,13,k===nm?C.blue:C.muted,'start')});
  return {svg:out,phase:`Reading anticlockwise from the bottom-left corner: ${D4_show(w)}. After gluing, the four corners become ${inf.V} ${D4_plural(inf.V,'point')}, the ${lab.length} sides ${inf.E} edges, and the square 1 face, so V − E + F = ${inf.V} − ${inf.E} + 1 = ${D4_minus(inf.chi)}. ${inf.orient?'Every glued pair is read once with and once against the walk, so the surface has two sides.':'A glued pair is read the same way twice, so a walk across it comes back mirror-reversed: the surface has one side.'}`};
 }});

/* ===================== Lesson: orientability ===================== */
// A traveller shaped like the letter F, drawn in strip coordinates (along u, across v). On the strip in space its
// outline is carried along unchanged in (u, v); the strip's own gluing does the rest.
const D4_FSHAPE=[[-.6,-1],[-.6,1],[.6,1],[.6,.6],[-.2,.6],[-.2,.2],[.4,.2],[.4,-.2],[-.2,-.2],[-.2,-1]];
const D4_WALK_N=40;   // steps per lap
function D4_stripMesh(k,Pr,NU=72,NV=4,colour=()=>'#dbe9f3',wd=.7){const quads=[];
 for(let i=0;i<NU;i++)for(let j=0;j<NV;j++){const u0=D4_TAU*i/NU,u1=D4_TAU*(i+1)/NU,v0=-1+2*j/NV,v1=-1+2*(j+1)/NV;
  quads.push({pts:[D4_stripPt(k,u0,v0,wd),D4_stripPt(k,u1,v0,wd),D4_stripPt(k,u1,v1,wd),D4_stripPt(k,u0,v1,wd)],fill:colour(i,j,(v0+v1)/2),stroke:'#b8cddb',sw:.4})}
 return quads}
function D4_figure3(k,u,v,sc,Pr,col,op=1){const pts=D4_FSHAPE.map(([a,b])=>Pr(D4_stripPt(k,u+a*sc*.5,v+b*sc*1.1)));
 return `<polygon points="${pts.map(p=>fmt(p[0])+','+fmt(p[1])).join(' ')}" fill="${col}" fill-opacity="${op}" stroke="#fff" stroke-width="1"/>`}
SCENE({id:'orientability',name:'Walking round a Möbius strip',tag:'Listing and Möbius, 1858',
 definition:'Give a strip of paper half a twist before joining its ends and it has only one side and one edge. Johann Benedict Listing and August Möbius found it independently in 1858; Listing published first, in 1861, and Möbius in 1865. A flat creature living in the strip, walking once round, comes back as its own mirror image. A surface with such a path is called non-orientable: there is no consistent way to tell its clockwise from its anticlockwise.',
 example:'On a plain band (no twist) the walker comes back unchanged after every lap. On the Möbius strip it comes back mirror-reversed after one lap and the right way round after two, which is also when it is back on the side it started from.',
 desc:'A flat strip whose ends are glued, straight or with a flip, with a letter F walking along it, beside the same strip in space, with the F drawn on it and a faint copy where it started, and a count of laps and whether the F matches its starting copy.',
 research:['Listing (1861). Der Census räumlicher Complexe. Abhandlungen der Königlichen Gesellschaft der Wissenschaften zu Göttingen 10; his notes on the strip date from 1858.','Möbius (1865). Über die Bestimmung des Inhaltes eines Polyëders. Berichte der Königlich Sächsischen Gesellschaft der Wissenschaften; the strip appears in his papers from 1858.'],
 dur:16,hint:'Choose the strip, then move the walker round. After one lap, does the F match its faint starting copy, or its mirror image?',
 init:()=>({k:1,pos:30,v:0}),
 watch(p){const mob=p<.62,u=mob?p/.62:(p-.62)/.38;return {k:mob?1:0,pos:Math.round(u*2*D4_WALK_N),v:0}},
 ui:[{choose:[[1,'Möbius strip'],[0,'Plain band']],label:'Strip',get:s=>s.k,act:'k'},{range:'pos',label:'Walk',min:0,max:2*D4_WALK_N,get:s=>s.pos,act:'pos',show:v=>`${D4_d1(v/D4_WALK_N)} laps`},{range:'v',label:'Across the strip',min:-2,max:2,get:s=>Math.round(s.v*4),act:'v'}],
 on:{k(s,v){s.k=+v?1:0},pos(s,v){s.pos=clamp(Math.round(+v),0,2*D4_WALK_N)},v(s,v){s.v=clamp(Math.round(+v),-2,2)/4}},
 draw(s){
  const lap=s.pos/D4_WALK_N,laps=Math.floor(lap+1e-9),sg=s.k&&laps%2?-1:1,u=lap-laps,mir=sg<0,done=laps>=1&&Math.abs(u)<1e-9;
  let out=heading(laps===0?'Walking round once':mir?`${laps} ${D4_plural(laps,'lap')}: the F is now a mirror image`:`${laps} ${D4_plural(laps,'lap')}: the F is the right way round`);
  // flat strip
  const x0=40,y0=70,w=220,h=110,M=(a,b)=>[x0+a*w,y0+h/2-b*h/2];
  out+=R(x0,y0,w,h,'#eef5fa','none',0)+L(x0,y0,x0+w,y0,C.ink,2)+L(x0,y0+h,x0+w,y0+h,C.ink,2);
  out+=L(x0,y0,x0,y0+h,C.coral,3)+L(x0+w,y0,x0+w,y0+h,C.coral,3)+D4_chev(x0,y0+h,x0,y0,1,C.coral,1)+D4_chev(x0+w,y0+h,x0+w,y0,1,C.coral,s.k?-1:1);
  out+=TF(x0+w/2,y0+h+22,s.k?'ends glued with a flip':'ends glued straight',13,C.coral);
  const vv=s.v*sg,fpts=D4_FSHAPE.map(([a,b])=>M(clamp(u+a*.05,0,1),vv+b*.2*sg));
  out+=`<polygon points="${fpts.map(p=>fmt(p[0])+','+fmt(p[1])).join(' ')}" fill="${mir?C.coral:C.ink}"/>`;
  const g0=D4_FSHAPE.map(([a,b])=>M(clamp(a*.05,0,1)+.0,s.v+b*.2));if(laps)out+=`<polygon points="${g0.map(p=>fmt(p[0]+.0)+','+fmt(p[1])).join(' ')}" fill="none" stroke="${C.muted}" stroke-dasharray="3 3"/>`;
  // in space
  const Pr=D4_view(.4,.95,430,190,52);out+=R(300,46,284,268,'#fff',C.grid,8);
  out+=D4_paint(D4_stripMesh(s.k,Pr),Pr)+D4_figure3(s.k,0,s.v,.45,Pr,C.muted,.35)+D4_figure3(s.k,lap*D4_TAU,s.v,.45,Pr,mir?C.coral:C.ink);
  out+=D4_tile(40,230,110,'Laps',D4_d1(lap),C.ink)+D4_tile(158,230,110,'Compared',laps===0?'not yet':mir?'mirror':'same',laps===0?C.muted:mir?C.coral:C.green);
  out+=TF(150,300,'faint F: where the walk began',13,C.muted)+D4_note('The strip in space is drawn from its formula; the F is carried along in strip coordinates.',336);
  return {svg:out,phase:laps===0?(s.k?'The F walks along the strip. Its ends are glued with a flip, so when it reaches the right end it carries on from the left end upside down.':'On a plain band the right end is glued straight to the left end.'):
   mir?`After ${laps} ${D4_plural(laps,'lap')} the F is back where it started but reversed, like its reflection in a mirror. Nothing turned it over: the strip itself did. That is what non-orientable means.`:
   (s.k?`After ${laps} laps the F is the right way round again: two flips cancel.`:`After ${laps} ${D4_plural(laps,'lap')} the F matches its starting copy exactly. The band has two sides and keeps left and right apart: it is orientable.`)};
 }});

// Cutting strips: half-twists k and a cut along the middle or a third of the way across.
const D4_PCOL=[C.blue,C.coral,C.green];
const D4_CUTS={none:null,mid:0,third:1/3};
SCENE({id:'orientability-cut',name:'Cutting the strip',tag:'What scissors reveal',
 definition:'Cutting along a strip follows the gluing. A cut along the middle of a plain band gives two bands. On a Möbius strip the same cut meets its own start after one lap, so it gives one piece, twice as long; a cut a third of the way across goes round twice before it closes and leaves two pieces, a thin Möbius strip linked with a long band. The results here are worked out from the gluing: each band between cut lines is followed round, and how the pieces twist and link is measured on the strip in space.',
 get example(){const a=D4_stripPieces(1,0),b=D4_stripPieces(1,1/3),c=D4_stripPieces(2,0);return `Möbius strip cut along the middle: ${a.pcs.length} piece, going round ${a.pcs[0].L} times, with ${a.pcs[0].oneSided?'one side':'two sides'}; its two edges wind round each other ${Math.round(Math.abs(a.pcs[0].twist))} times. Cut a third of the way across: ${b.pcs.length} pieces, linked ${Math.round(Math.abs(b.link))} time. A strip with two half-twists cut along the middle: ${c.pcs.length} pieces linked ${Math.round(Math.abs(c.link))} time.`},
 desc:'A flat strip with its glued ends, the cut lines dashed and each resulting piece in its own colour, beside the strip in space with the pieces coloured in place, and a table giving each piece’s length, sides and edges and how the pieces link.',
 research:['Listing (1861) and Möbius (1865), as above; cutting experiments of this kind are described by Martin Gardner (1956, Mathematics, Magic and Mystery) and Pickover (2006).','Linking numbers are computed with the Gauss linking integral, evaluated exactly for each pair of segments (Klenin & Langowski 2000, Biopolymers 54, 307–317).'],
 dur:18,hint:'Choose the number of half-twists and where to cut. Predict the number of pieces before reading the table.',
 init:()=>({k:1,cut:'mid'}),
 watch(p){const seq=[[0,'mid'],[1,'none'],[1,'mid'],[1,'third'],[2,'mid'],[3,'mid']],i=Math.min(seq.length-1,Math.floor(p*seq.length));return {k:seq[i][0],cut:seq[i][1]}},
 ui:[{range:'k',label:'Half-twists',min:0,max:3,get:s=>s.k,act:'k'},{choose:[['none','No cut'],['mid','Cut along the middle'],['third','Cut a third of the way']],label:'Cut',get:s=>s.cut,act:'cut'}],
 on:{k(s,v){s.k=clamp(Math.round(+v),0,3)},cut(s,v){if(v in D4_CUTS)s.cut=v}},
 draw(s){
  const S=D4_stripPieces(s.k,D4_CUTS[s.cut]),pc=S.pcs,pieceOf=b=>pc.findIndex(p=>p.bands.includes(b));
  let out=heading(s.cut==='none'?`${s.k} half-${D4_plural(s.k,'twist')}: ${pc[0].oneSided?'one side, one edge':'two sides, two edges'}`:`${pc.length} ${D4_plural(pc.length,'piece')} after the cut`);
  // flat diagram
  const x0=36,y0=58,w=230,h=104,M=(a,b)=>[x0+a*w,y0+h/2-b*h/2];
  S.bands.forEach(([lo,hi],i)=>{const p0=M(0,hi),p1=M(1,lo);out+=R(p0[0],p0[1]+1,p1[0]-p0[0],p1[1]-p0[1]-2,tint(D4_PCOL[pieceOf(i)%3],.72),'none',0)+TF(x0+w/2,(p0[1]+p1[1])/2+5,'piece '+(pieceOf(i)+1),13,D4_PCOL[pieceOf(i)%3])});
  out+=L(x0,y0,x0+w,y0,C.ink,2)+L(x0,y0+h,x0+w,y0+h,C.ink,2)+L(x0,y0,x0,y0+h,C.ink,2.5)+L(x0+w,y0,x0+w,y0+h,C.ink,2.5)+D4_chev(x0,y0+h,x0,y0,1,C.ink,1)+D4_chev(x0+w,y0+h,x0+w,y0,1,C.ink,S.s);
  for(const hgt of S.hs){const a=M(0,hgt),b=M(1,hgt);out+=L(a[0],a[1],b[0],b[1],C.ink,2.2,'stroke-dasharray="7 5"')}
  out+=TF(x0+w/2,y0+h+18,`ends glued ${S.s<0?'with a flip':'straight'}`,13,C.muted)+(S.hs.length?TF(x0+w/2,y0+h+36,`the cut goes round ${S.cutLaps} ${D4_plural(S.cutLaps,'time')}`,13,C.muted):'');
  // in space, pieces coloured in place
  const Pr=D4_view(.4,.95,432,178,50);out+=R(298,46,286,250,'#fff',C.grid,8);
  const col=(i,j,v)=>{const b=S.bands.findIndex(([lo,hi])=>v>=lo&&v<=hi);return tint(D4_PCOL[pieceOf(Math.max(0,b))%3],.45)};
  out+=D4_paint(D4_stripMesh(s.k,Pr,90,6,col),Pr);
  out+=TF(441,290,'pieces shown in place, not pulled apart',13,C.muted);
  // table
  pc.forEach((p,i)=>{const y=232+i*28;out+=Ci(46,y-5,7,D4_PCOL[i%3])+TF(60,y,`piece ${i+1}: round ${p.L}×, ${p.oneSided?'one side, one edge':'two sides'}${p.twist!=null?`, edges wind ${Math.round(Math.abs(p.twist))}×`:''}`,13,C.ink,'start')});
  if(S.link!=null)out+=TF(36,232+pc.length*28,`the pieces are linked ${Math.round(Math.abs(S.link))} ${D4_plural(Math.round(Math.abs(S.link)),'time')}`,13,C.coral,'start');
  const knot=pc.some(p=>p.L===2&&s.k>=3);
  out+=D4_note(`Gauss sums measured: ${pc.map(p=>p.twist!=null?D4_d2(Math.abs(p.twist)):null).filter(x=>x).concat(S.link!=null?[D4_d2(Math.abs(S.link))]:[]).join(', ')||'none needed'} (whole numbers, as they must be)`,360);
  const ph=s.cut==='none'?`A strip with ${s.k} half-${D4_plural(s.k,'twist')} is ${pc[0].oneSided?'one-sided, with a single edge that goes round twice':'two-sided, with two edges'}${!pc[0].oneSided&&s.k?`, which wind round each other ${Math.round(Math.abs(pc[0].twist))} ${D4_plural(Math.round(Math.abs(pc[0].twist)),'time')}`:''}.`:
   `The dashed cut closes up after ${S.cutLaps} ${D4_plural(S.cutLaps,'lap')}. Following each band across the glued ends gives ${pc.length} ${D4_plural(pc.length,'piece')}: ${pc.map((p,i)=>`piece ${i+1} goes round ${p.L} ${D4_plural(p.L,'time')} and is ${p.oneSided?'a Möbius strip':'two-sided'}`).join('; ')}.${S.link!=null&&Math.round(Math.abs(S.link))?' The two pieces cannot be pulled apart: they are linked.':''}${knot?` With ${s.k} half-twists the long piece is tied in a knot: its centre line goes round 2 times along the strip while turning ${s.k} times round it, a (2, ${s.k}) torus knot.`:''}`;
  return {svg:out,phase:ph};
 }});

// A strip of 6 squares, each cut into 2 triangles; the right end glued to the left, straight or flipped.
// Corners (i, j): i = 0…6 along, j = 0 bottom, 1 top; corner (6, j) is (0, j), or (0, 1 − j) with a flip.
const D4_CN=6;
function D4_triStrip(flip){return D4_memo('ts:'+flip,()=>{
 const vid=(i,j)=>i===D4_CN?(flip?1-j:j):i*2+j,tris=[];
 for(let i=0;i<D4_CN;i++){tris.push({c:[[i,0],[i+1,0],[i+1,1]]},{c:[[i,0],[i+1,1],[i,1]]})}
 tris.forEach(t=>t.v=t.c.map(([i,j])=>vid(i,j)));
 // each edge, with the triangles that contain it
 const edges={};tris.forEach((t,ti)=>{for(let k=0;k<3;k++){const a=t.v[k],b=t.v[(k+1)%3],key=a<b?a+'-'+b:b+'-'+a;(edges[key]=edges[key]||[]).push({ti,a,b,k})}});
 const inner=Object.entries(edges).filter(([,l])=>l.length===2);
 return {tris,inner,edges}})}
// An orientation gives each triangle a direction round its corners (+1: as listed, anticlockwise in the picture).
// Two triangles agree along a shared edge when they run along it in opposite directions.
function D4_conflicts(flip,o){const T=D4_triStrip(flip);return T.inner.filter(([,l])=>{const d=l.map(x=>o[x.ti]>0?x.a:x.b);return d[0]===d[1]}).map(([k])=>k)}
function D4_bestOrient(flip){return D4_memo('bo:'+flip,()=>{const n=2*D4_CN;let best=99;for(let m=0;m<2**n;m++){const o=range(n).map(i=>(m>>i)&1?-1:1);best=Math.min(best,D4_conflicts(flip,o).length)}return best})}
// Spreading: fix triangle 0, then repeatedly orient a neighbour to agree with an oriented triangle.
function D4_spread(flip){const T=D4_triStrip(flip),n=T.tris.length,o=new Array(n).fill(0);o[0]=1;const fr=[o.slice()];
 for(let step=0;step<n-1;step++){let done=false;
  for(let ti=1;ti<n&&!done;ti++){if(o[ti])continue;for(const [,l] of T.inner){const me=l.find(x=>x.ti===ti),ot=l.find(x=>x.ti!==ti);if(!me||!ot||!o[ot.ti])continue;
   const dirO=o[ot.ti]>0?ot.a:ot.b;o[ti]=(me.a===dirO)?-1:1;done=true;break}}
  fr.push(o.slice())}
 return fr}
function D4_orientFrames(s){const out=[];const types=s.type==='both'?[0,1]:[+s.type];
 for(const fl of types){if(s.spread||s.type==='both'){D4_spread(fl).forEach((o,i,a)=>out.push({flip:fl,o,spread:1,last:i===a.length-1}))}else out.push({flip:fl,o:s.o.slice(),spread:0,last:1})}
 return out}
function D4_rotArrow(cx,cy,r,dir,col){const a0=dir>0?-2.4:2.4-Math.PI*0,pts=range(13).map(i=>{const a=dir>0?(-.6+i*.38):(Math.PI+.6-i*.38);return [cx+r*Math.cos(a),cy-r*Math.sin(a)]});void a0;
 const e=pts[12],p=pts[11],dx=e[0]-p[0],dy=e[1]-p[1],d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d;
 return D4_poly(pts,col,1.8)+`<polygon points="${fmt(e[0]+ux*4)},${fmt(e[1]+uy*4)} ${fmt(e[0]-uy*3.5)},${fmt(e[1]+ux*3.5)} ${fmt(e[0]+uy*3.5)},${fmt(e[1]-ux*3.5)}" fill="${col}"/>`}
SCENE({id:'orientability-coherent',name:'Arrows that cannot agree',tag:'Möbius’s test with triangles, 1865',
 definition:'Möbius gave a test that needs no walking. Cut the surface into triangles and give each one a sense of rotation, clockwise or anticlockwise. Two neighbouring triangles agree when they run along their shared edge in opposite directions, like two cogs. A surface is orientable when all its triangles can be made to agree at once. Möbius needed this to measure the volume inside a polyhedron, and he showed that a one-sided surface has no consistent choice.',
 get example(){return `The strip here has ${2*D4_CN} triangles, so there are ${2**(2*D4_CN)} ways to choose their senses. The computer tries them all: on the plain band the best choice leaves ${D4_bestOrient(0)} disagreeing edges, on the Möbius strip ${D4_bestOrient(1)}. Spreading agreement from one triangle round the Möbius strip always ends in a clash.`},
 desc:'A strip of twelve triangles drawn flat with its ends glued straight or with a flip, a turning arrow in each triangle, disagreeing edges marked in red, and counts of disagreements now and at best.',
 research:['Möbius (1865). Über die Bestimmung des Inhaltes eines Polyëders: polyhedra whose faces cannot all be oriented consistently, so their volume is not defined.',`The best possible count is found by checking all ${2**(2*D4_CN)} choices.`],
 dur:16,hint:'Press a triangle to reverse its arrow and try to make every shared edge agree. Then press Spread to let agreement spread from the first triangle.',
 init:()=>({type:'both',o:new Array(2*D4_CN).fill(1),spread:1}),
 trace:D4_orientFrames,
 ui:[{choose:[['both','Band, then Möbius'],['0','Plain band'],['1','Möbius strip']],label:'Strip',get:s=>s.type,act:'type'},{b:'Spread ▶',act:'spread'},{b:'All anticlockwise',act:'same'}],
 on:{type(s,v){if(['both','0','1'].includes(String(v))){s.type=String(v);s.spread=0;if(s.type==='both')s.spread=1}},spread(s){s.spread=1;if(s.type==='both')return 'run';return 'run'},
  same(s){s.o=new Array(2*D4_CN).fill(1);s.spread=0},tri(s,v){const i=clamp(Math.round(+v),0,2*D4_CN-1);if(s.type==='both')s.type='1';s.spread=0;s.o[i]=s.o[i]?-s.o[i]:1;return 'keep'}},
 draw(s,f,X){
  f=f||D4_orientFrames(s)[0];const T=D4_triStrip(f.flip),cf=D4_conflicts(f.flip,f.o.map(x=>x||1)),set=f.o.filter(Boolean).length,best=D4_bestOrient(f.flip);
  const x0=40,y0=70,cw=86,ch=150,M=([i,j])=>[x0+i*cw,y0+ch-j*ch];
  const conflictsShown=f.spread&&set<T.tris.length?D4_conflicts(f.flip,f.o.map(x=>x||0)).filter(k=>{const l=T.edges[k];return l.every(x=>f.o[x.ti])}):cf;
  let out=heading(f.flip?'Möbius strip of triangles':'Plain band of triangles');
  T.tris.forEach((t,ti)=>{const pts=t.c.map(M),cx=(pts[0][0]+pts[1][0]+pts[2][0])/3,cy=(pts[0][1]+pts[1][1]+pts[2][1])/3,o=f.o[ti];
   let g=`<polygon points="${pts.map(p=>fmt(p[0])+','+fmt(p[1])).join(' ')}" fill="${o?(o>0?'#e4f0f8':'#f3eafa'):'#f4f6f7'}" stroke="${C.line}" stroke-width="1.4"/>`;
   if(o)g+=D4_rotArrow(cx,cy,13,o,o>0?C.blue:C.purple);else g+=TF(cx,cy+5,'?',14,C.muted);
   out+=hit(X,'tri',ti,`Triangle ${ti+1}: ${o>0?'anticlockwise':o<0?'clockwise':'not set'}. Press to reverse.`,g)});
  for(const k of conflictsShown){for(const x of T.edges[k]){const t=T.tris[x.ti],p=M(t.c[x.k]),q=M(t.c[(x.k+1)%3]);out+=L(p[0],p[1],q[0],q[1],C.coral,5)}}
  out+=L(x0,y0,x0,y0+ch,C.ink,3)+L(x0+D4_CN*cw,y0,x0+D4_CN*cw,y0+ch,C.ink,3)+D4_chev(x0,y0+ch,x0,y0,1,C.ink,1)+D4_chev(x0+D4_CN*cw,y0+ch,x0+D4_CN*cw,y0,1,C.ink,f.flip?-1:1);
  out+=TF(300,y0+ch+22,f.flip?'right end glued to the left end with a flip':'right end glued straight to the left end',13,C.muted);
  out+=D4_tile(60,272,150,'Triangles set',`${set} of ${T.tris.length}`,C.ink)+D4_tile(225,272,150,'Disagreeing edges',String(conflictsShown.length),conflictsShown.length?C.coral:C.green)+D4_tile(390,272,150,`Best of all ${2**T.tris.length}`,String(best),best?C.coral:C.green);
  out+=TF(300,340,'blue ↺ anticlockwise, purple ↻ clockwise; red edges disagree',13,C.muted);
  const ph=f.spread&&!f.last?`Spreading: each step gives a new triangle the sense that agrees with a neighbour already set. ${set} of ${T.tris.length} triangles are set.`:
   conflictsShown.length?`${conflictsShown.length} shared ${D4_plural(conflictsShown.length,'edge')} ${conflictsShown.length>1?'disagree':'disagrees'} (red). ${f.flip?`On the Möbius strip no choice does better than ${best}: going once round, the flip at the glued ends reverses every sense, so the last triangle clashes with the first.`:'On the plain band all can agree: try reversing the triangles next to the red edges.'}`:
   `Every shared edge agrees: the ${f.flip?'strip':'band'} has a consistent orientation.`;
  return {svg:out,phase:ph};
 }});

/* ===================== Lesson: klein-projective ===================== */
const D4_KN=[40,24];   // mesh: steps round u, steps round v
function D4_kleinQuads(Pr,useW=true){const quads=[];const [NU,NV]=D4_KN;
 for(let i=0;i<NU;i++)for(let j=0;j<NV;j++){const u0=D4_TAU*i/NU,u1=D4_TAU*(i+1)/NU,v0=D4_TAU*j/NV,v1=D4_TAU*(j+1)/NV,pts=[[u0,v0],[u1,v0],[u1,v1],[u0,v1]].map(([u,v])=>D4_klein(u,v));
  const w=Math.cos((v0+v1)/2);quads.push({pts:pts.map(p=>p.slice(0,3)),fill:useW?D4_wcol(w):'#dbe9f3',stroke:'#ffffff',sw:.35})}
 return quads}
// The crossing circle: where the sheets v = 0 and v = π of the figure-eight bottle meet in 3D.
const D4_kProbe=deg=>{const u=deg*Math.PI/180,a=D4_klein(u,0),b=D4_klein(u,Math.PI);return {a,b,gap3:D4_len3(D4_sub3(a,b)),gap4:Math.hypot(D4_len3(D4_sub3(a,b)),a[3]-b[3])}};
function D4_wLegend(x,y,w){let out='';for(let i=0;i<20;i++)out+=R(x+i*w/20,y,w/20+.5,10,D4_wcol(-1+2*(i+.5)/20),'none',0);return out+TF(x,y+26,'w = −1',13,C.purple,'start')+TF(x+w/2,y+26,'0',13,C.muted)+TF(x+w,y+26,'+1',13,C.amber,'end')}
SCENE({id:'klein-projective',name:'A bottle with no inside',tag:'Klein, 1882',
 definition:'Felix Klein described in 1882 a closed surface with one side: glue the square’s top to its bottom, making a tube, then glue the tube’s ends with a flip. In ordinary space the tube must pass through its own wall to come back from the inside, so every model in 3D crosses itself. In four dimensions it need not. Give each point a fourth coordinate w and lift the two sheets apart where they cross: in 4D they no longer meet.',
 get example(){const q=D4_kProbe(0);return `This picture is the “figure-eight” Klein bottle, not Klein’s bottle shape: a figure eight turns half a turn while it travels round a circle. Its sheets cross along a circle. At every point of that circle the two sheets are ${D4_d2(q.gap3)} apart in 3D, but their fourth coordinates are w = ${D4_minus(D4_d2(q.a[3]))} and w = ${D4_minus(D4_d2(q.b[3]))}, so in 4D they are ${D4_d2(q.gap4)} apart.`},
 desc:'The gluing square of the Klein bottle shaded by the fourth coordinate w, a cross-section of the bottle in 3D showing a figure eight crossing itself with the two crossing strands labelled by w, and readouts of the gap between the sheets in 3D and in 4D at a chosen point of the crossing circle.',
 research:['Klein (1882). Über Riemanns Theorie der algebraischen Functionen und ihrer Integrale. Teubner: the closed one-sided surface. The English name “bottle” is often said to come from a confusion of the German Fläche (surface) with Flasche (bottle); that story is widely told but uncertain.','Coordinates used here: (x, y, z) = ((2 + cos(u/2) sin v − sin(u/2) sin 2v) cos u, … sin u, sin(u/2) sin v + cos(u/2) sin 2v), w = cos v.'],
 dur:16,hint:'Move the probe round the crossing circle. Read the two sheets’ fourth coordinates: do they ever agree? Switch to 3D to turn the bottle.',
 init:()=>({deg:60}),
 watch(p){return {deg:Math.round(p*24)*15%360}},
 ui:[{range:'deg',label:'Probe round the circle (°)',min:0,max:345,step:15,get:s=>s.deg,act:'deg'}],
 on:{deg(s,v){s.deg=clamp(Math.round(+v/15)*15,0,345)}},
 draw(s){
  const q=D4_kProbe(s.deg),u=s.deg*Math.PI/180;
  let out=heading('In 3D the sheets cross; in 4D they are apart');
  // gluing square in (u, v), shaded by w = cos v
  const x0=34,y0=64,W=180,H=180,M=(a,b)=>[x0+a/D4_TAU*W,y0+H-b/D4_TAU*H];
  for(let j=0;j<24;j++){const v=D4_TAU*(j+.5)/24;out+=R(x0,y0+H-(j+1)*H/24,W,H/24+.6,D4_wcol(Math.cos(v)),'none',0)}
  out+=L(x0,y0,x0+W,y0,C.purple,3)+L(x0,y0+H,x0+W,y0+H,C.purple,3)+D4_chev(x0,y0,x0+W,y0,2,C.purple,1)+D4_chev(x0,y0+H,x0+W,y0+H,2,C.purple,1);
  out+=L(x0,y0,x0,y0+H,C.coral,3)+L(x0+W,y0,x0+W,y0+H,C.coral,3)+D4_chev(x0,y0+H,x0,y0,1,C.coral,1)+D4_chev(x0+W,y0+H,x0+W,y0,1,C.coral,-1);
  for(const [v,col,lab] of [[0,C.amber,'v = 0'],[Math.PI,C.purple,'v = π']]){const a=M(0,v),b=M(D4_TAU,v);out+=L(a[0],a[1],b[0],b[1],col,2.2,'stroke-dasharray="6 4"')+TF(x0+W+8,a[1]+(v?5:-6),lab,13,col,'start')}
  const pa=M(u,0),pb=M(u,Math.PI);out+=Ci(pa[0],pa[1]-2,6,C.ink,'#fff')+Ci(pb[0],pb[1],6,C.ink,'#fff');
  out+=TF(x0+W/2,y0+H+20,'u →  across; v ↑ up the square',13,C.muted)+D4_wLegend(x0,y0+H+32,W);
  // cross-section at this u: the figure eight in its plane, coloured by w
  const cx=432,cy=170,sc=62,c=Math.cos(u/2),sn=Math.sin(u/2);
  out+=R(300,48,284,236,'#fff',C.grid,8)+TF(442,68,`cross-section at u = ${s.deg}°`,13,C.muted);
  const pt=v=>{const a=Math.sin(v),b=Math.sin(2*v);return [cx+(c*a-sn*b)*sc,cy-(sn*a+c*b)*sc]};
  for(let j=0;j<96;j++){const v0=D4_TAU*j/96,v1=D4_TAU*(j+1)/96,a=pt(v0),b=pt(v1);out+=L(a[0],a[1],b[0],b[1],D4_wcol(Math.cos((v0+v1)/2)),5)}
  for(let j=0;j<96;j++){const v0=D4_TAU*j/96,v1=D4_TAU*(j+1)/96,a=pt(v0),b=pt(v1);out+=L(a[0],a[1],b[0],b[1],C.ink,.8)}
  out+=Ci(cx,cy,6,C.ink,'#fff');
  const t0=pt(.35),t1=pt(Math.PI+.35);out+=TF(t0[0]+(t0[0]>cx?8:-8),t0[1]-8,'w = +1',13,C.amber,t0[0]>cx?'start':'end')+TF(t1[0]+(t1[0]>cx?8:-8),t1[1]-8,'w = −1',13,C.purple,t1[0]>cx?'start':'end');
  out+=TF(442,270,'the eight crosses itself at its centre',13,C.muted);
  out+=D4_tile(300,296,138,'Gap in 3D',D4_d2(q.gap3),C.ink)+D4_tile(446,296,138,'Gap in 4D',D4_d2(q.gap4),C.green);
  out+=TF(146,330,`sheet v = 0: w = ${D4_minus(D4_d2(q.a[3]))}`,13,C.amber)+TF(146,350,`sheet v = π: w = ${D4_minus(D4_d2(q.b[3]))}`,13,C.purple);
  return {svg:out,phase:`At u = ${s.deg}° the two sheets of the bottle pass through the same point of space, (${q.a.slice(0,3).map(D4_d2).join(', ')}). They come from different points of the square, v = 0 and v = π, and their fourth coordinates differ: w = ${D4_minus(D4_d2(q.a[3]))} and w = ${D4_minus(D4_d2(q.b[3]))}. So in four dimensions the crossing disappears: the Klein bottle fits in 4D without meeting itself.`};
 },
 three(s,f,X,project){
  const pts=[];for(let i=0;i<12;i++)for(let j=0;j<12;j++)pts.push(D4_klein(D4_TAU*i/12,D4_TAU*j/12).slice(0,3));
  const Pr=project(pts),q=D4_kProbe(s.deg);let out=D4_paint(D4_kleinQuads(Pr),Pr);
  const circ=range(61).map(i=>Pr(D4_klein(D4_TAU*i/60,0).slice(0,3)));out+=D4_poly(circ,C.ink,1.6,'stroke-dasharray="4 4"');
  out+=point3(q.a.slice(0,3),Pr,C.ink,6,'#fff');
  return {svg:out,title:'The figure-eight Klein bottle in 3D, shaded by w',caption:`The fourth coordinate w = cos v is shown as shade (purple w = −1, amber w = +1) and in the readouts. Where the surface passes through itself (dashed circle) the two sheets have w = +1 and w = −1. This scene computes the 3D coordinates; the 3D view only turns the camera.`};
 }});

// The projective plane: one point for each pair of opposite points of the sphere. Shown as the upper half of the
// sphere seen from above, a disc whose opposite edge points are glued. A probe moves along one of the three
// segments where Steiner's Roman surface (yz, xz, xy) meets itself; the two points of the plane that land there are
// found from the formula, and their fourth coordinates w = x² − y² compared.
function D4_romanPre(ax,t){const al=Math.asin(clamp(2*t,-1,1))/2,c=Math.cos(al),s=Math.sin(al),mk=(a,b)=>{const p=[0,0,0],o=[0,1,2].filter(i=>i!==ax);p[o[0]]=a;p[o[1]]=b;return p};
 return [mk(c,s),mk(s,c)].map(p=>p.map(v=>Math.abs(v)<1e-12?0:v))}
// Pinch points: ends of the crossing segments where the two points of the plane coincide (or are opposite, the same point).
const D4_pinch=()=>D4_memo('pinch',()=>{let n=0;for(const ax of [0,1,2])for(const t of [-.5,.5]){const [a,b]=D4_romanPre(ax,t);if(D4_len3(D4_sub3(a,b))<1e-9||D4_len3(D4_sub3(a,b.map(v=>-v)))<1e-9)n++}return n});
const D4_upper=p=>(p[2]<-1e-12||(Math.abs(p[2])<1e-12&&(p[1]<-1e-12||(Math.abs(p[1])<1e-12&&p[0]<0))))?p.map(v=>-v):p;
function D4_romanQuads(Pr){const quads=[],NT=10,NP=40;
 for(let i=0;i<NT;i++)for(let j=0;j<NP;j++){const t0=Math.PI/2*i/NT,t1=Math.PI/2*(i+1)/NT,p0=D4_TAU*j/NP,p1=D4_TAU*(j+1)/NP;
  const pts=[[t0,p0],[t1,p0],[t1,p1],[t0,p1]].map(([a,b])=>D4_roman(D4_sph(a,b)));const w=D4_roman(D4_sph((t0+t1)/2,(p0+p1)/2))[3];
  quads.push({pts:pts.map(p=>p.slice(0,3)),fill:D4_wcol(w),stroke:'#fff',sw:.3,op:.92})}
 return quads}
SCENE({id:'klein-projective-plane',name:'The projective plane',tag:'Steiner 1844, Boy 1901',
 get definition(){return `The real projective plane has one point for each line through the centre of a ball, that is, for each pair of opposite points on its surface. It is the square with both pairs of sides glued with a flip, or a disc whose opposite edge points are glued. Like the Klein bottle it has one side, and in 3D every model meets itself. Jakob Steiner’s Roman surface (1844) also has ${D4_pinch()} pinch points; Werner Boy found in 1901 a model, Boy’s surface, that crosses itself but has no pinch points. Add the fourth coordinate w = x² − y² to the Roman surface and the crossings come apart.`},
 get example(){const [a,b]=D4_romanPre(2,.3);return `The probe at (0, 0, 0.3) on the Roman surface is hit by two points of the plane, (${a.map(D4_d2).join(', ')}) and (${b.map(D4_d2).join(', ')}). Their fourth coordinates are w = ${D4_minus(D4_d2(D4_roman(a)[3]))} and w = ${D4_minus(D4_d2(D4_roman(b)[3]))}. At both ends of each segment, 0.5 from the centre, the two points merge into one: these are the pinch points, ${D4_pinch()} in all.`},
 desc:'A disc standing for the projective plane, shaded by the fourth coordinate, with the two points that land on the probe marked, beside Steiner’s Roman surface drawn in 3D and shaded the same way, with its three crossing segments and the probe, and readouts of the two fourth coordinates.',
 research:['Steiner’s Roman surface, found by Jakob Steiner in 1844 while he was in Rome. Apéry (1987). Models of the Real Projective Plane. Vieweg.','Boy (1903). Über die Curvatura integra und die Topologie geschlossener Flächen. Mathematische Annalen 57 (his 1901 dissertation under Hilbert).','The map (yz, xz, xy, x² − y²) separates every pair of points of the plane, as the formula shows.'],
 dur:16,hint:'Choose one of the three crossing segments and move the probe along it. Where are the two points of the plane that land on it? What happens at the ends of the segment?',
 init:()=>({ax:2,t:30}),
 watch(p){const k=Math.min(2,Math.floor(p*3)),u=p*3-k;return {ax:2-k,t:Math.round(-50+100*u)}},
 ui:[{choose:[[0,'Segment along x'],[1,'Segment along y'],[2,'Segment along z']],label:'Crossing segment',get:s=>s.ax,act:'ax'},{range:'t',label:'Probe position (÷100)',min:-50,max:50,step:5,get:s=>s.t,act:'t'}],
 on:{ax(s,v){s.ax=clamp(Math.round(+v),0,2)},t(s,v){s.t=clamp(Math.round(+v/5)*5,-50,50)}},
 draw(s){
  const t=s.t/100,pre=D4_romanPre(s.ax,t),w=pre.map(p=>D4_roman(p)[3]),img=D4_roman(pre[0]).slice(0,3),same=D4_len3(D4_sub3(pre[0],pre[1]))<1e-9||D4_len3(D4_sub3(pre[0],pre[1].map(v=>-v)))<1e-9;
  const triple=Math.abs(t)<1e-9;
  let out=heading(triple?'The triple point: three points of the plane meet':same?'A pinch point: the two points have merged':'Two points of the plane, one point of space');
  // the disc (upper hemisphere from above), shaded by w
  const cx=126,cy=170,r=96;
  for(let i=0;i<8;i++)for(let j=0;j<32;j++){const r0=r*i/8,r1=r*(i+1)/8,a0=D4_TAU*j/32,a1=D4_TAU*(j+1)/32,rm=(i+.5)/8,am=(a0+a1)/2,x=rm*Math.cos(am),y=rm*Math.sin(am);
   out+=`<path d="M${fmt(cx+r0*Math.cos(a0))} ${fmt(cy-r0*Math.sin(a0))} L${fmt(cx+r1*Math.cos(a0))} ${fmt(cy-r1*Math.sin(a0))} A${fmt(r1)} ${fmt(r1)} 0 0 0 ${fmt(cx+r1*Math.cos(a1))} ${fmt(cy-r1*Math.sin(a1))} L${fmt(cx+r0*Math.cos(a1))} ${fmt(cy-r0*Math.sin(a1))} Z" fill="${D4_wcol(x*x-y*y)}" stroke="none"/>`}
  out+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.coral}" stroke-width="3"/>`;
  for(const a of [Math.PI/4,Math.PI*5/4])out+=D4_chev(cx+r*Math.cos(a+.2),cy-r*Math.sin(a+.2),cx+r*Math.cos(a-.2),cy-r*Math.sin(a-.2),1,C.coral,1);
  out+=TF(cx,cy+r+20,'opposite edge points are glued',13,C.coral);
  const marks=triple?[[1,0,0],[0,1,0],[0,0,1]]:same?[pre[0]]:pre;
  marks.forEach((p,i)=>{const q=D4_upper(p),x=cx+q[0]*r,y=cy-q[1]*r;out+=Ci(x,y,7,C.ink,'#fff')+TBF(x+(q[0]>=0?11:-11),y-9,String.fromCharCode(65+i),14,C.ink,q[0]>=0?'start':'end');
   if(Math.abs(q[2])<1e-9)out+=Ci(cx-q[0]*r,cy+q[1]*r,7,'#fff',C.ink)});
  out+=D4_wLegend(36,cy+r+32,180);
  // the Roman surface in 3D (own fixed view)
  const Pr=D4_view(.75,.62,442,168,215);out+=R(300,46,284,252,'#fff',C.grid,8);
  out+=D4_paint(D4_romanQuads(Pr),Pr);
  for(let a=0;a<3;a++){const e=[0,0,0],f2=[0,0,0];e[a]=-.5;f2[a]=.5;const p=Pr(e),q=Pr(f2);out+=L(p[0],p[1],q[0],q[1],C.ink,1.6,'stroke-dasharray="4 3"')}
  const pi=Pr(img);out+=Ci(pi[0],pi[1],6,C.ink,'#fff');
  out+=TF(442,290,'Roman surface (yz, xz, xy), dashed: crossings',13,C.muted);
  const tri=[[1,0,0],[0,1,0],[0,0,1]].map(p=>D4_roman(p)[3]);
  out+=D4_tile(300,306,138,triple?'w at A, B, C':'w at A, B',triple?tri.map(v=>D4_minus(D4_d1(v))).join(', '):same?D4_minus(D4_d2(w[0]))+' (one point)':w.map(v=>D4_minus(D4_d2(v))).join(', '),C.ink)+D4_tile(446,306,138,'Gap in 4D',same&&!triple?'—':D4_d2(triple?Math.abs(tri[0]-tri[1]):Math.abs(w[0]-w[1])),C.green);
  const ph=triple?`The centre of the Roman surface is a triple point: the points A = (1, 0, 0), B = (0, 1, 0) and C = (0, 0, 1) of the plane all land there. Their fourth coordinates are ${tri.map(v=>D4_minus(D4_d1(v))).join(', ')}: all different, so in 4D they are three separate points.`:
   same?`At ${D4_d1(Math.abs(t))} from the centre the two points of the plane coincide: this end of the crossing segment is a pinch point, where the Roman surface is creased rather than crossing. There are ${D4_pinch()} such pinch points, at both ends of each segment. Boy’s surface avoids them.`:
   `Two different points of the projective plane, A and B, land on the same point (${img.map(D4_d2).join(', ')}) of the Roman surface. Their fourth coordinates are ${w.map(v=>D4_minus(D4_d2(v))).join(' and ')}, so in 4D the surface does not meet itself here. A point on the edge of the disc is drawn twice, at both glued ends.`;
  return {svg:out,phase:ph};
 }});

// Cutting the Klein bottle and the projective plane. Klein bottle: the square with left and right glued with a flip
// (height y goes to 1 − y) and top and bottom glued straight, cut along the heights y = a and y = 1 − a. The bands
// between cuts are arcs of the circle of heights; the flip sends each arc to an arc, and each cycle is one piece.
function D4_kleinCut(a){const cuts=[a,1-a].sort((x,y)=>x-y),arcs=[[cuts[0],cuts[1]],[cuts[1],cuts[0]+1]];
 const img=([lo,hi])=>{const l=((1-hi)%1+1)%1;return arcs.findIndex(([x])=>Math.abs(((x-l)%1+1)%1)<1e-9||Math.abs(((x-l)%1+1)%1-1)<1e-9)};
 const seen=new Set(),pcs=[];arcs.forEach((_,i)=>{if(seen.has(i))return;const cyc=[];let j=i;while(!seen.has(j)){seen.add(j);cyc.push(j);j=img(arcs[j])}pcs.push({arcs:cyc,oneSided:cyc.length%2===1})});
 return {cuts,arcs,pcs}}
SCENE({id:'klein-projective-halves',name:'Cut into Möbius strips',tag:'What the closed surfaces are made of',
 definition:'Cut a Klein bottle along the right circle and it falls into two Möbius strips; glue two Möbius strips edge to edge and you get a Klein bottle back. Cut a small disc out of a projective plane and what is left is one Möbius strip. Both closed one-sided surfaces are built from Möbius strips, which is where their one-sidedness comes from. The count V − E + F adds up across the cut: the whole equals the pieces minus the circle where they meet, and a circle counts 0.',
 get example(){const k=D4_grid('klein',3),m=D4_grid('mobius',3),pr=D4_grid('rp2',3),d=D4_info(D4_parse('a'));return `Counted on cut-up squares: Klein bottle ${D4_minus(k.chi)}, Möbius strip ${D4_minus(m.chi)}, so ${D4_minus(k.chi)} = ${D4_minus(m.chi)} + ${D4_minus(m.chi)} − 0. Projective plane ${D4_minus(pr.chi)} = Möbius strip ${D4_minus(m.chi)} + disc ${D4_minus(d.chi)} − 0.`},
 desc:'The gluing square of the Klein bottle, or a disc for the projective plane, with a cut drawn dashed and the pieces coloured, beside small pictures of the pieces as strips in space and a table of each piece’s sides, edges and V − E + F.',
 research:['A standard decomposition; see Weeks (1985), The Shape of Space, and Massey (1967), Algebraic Topology: An Introduction, chapter 1.','V − E + F of each piece is counted on a cut-up square by this scene; the strips in space are drawn from the formula of a strip with one half-twist.'],
 dur:15,hint:'Choose the surface and move the cut. Does the number of pieces or their kind ever change?',
 init:()=>({surf:'klein',a:25}),
 watch(p){return p<.6?{surf:'klein',a:Math.round(10+30*p/.6)}:{surf:'rp2',a:Math.round(25+20*(p-.6)/.4)}},
 ui:[{choose:[['klein','Klein bottle'],['rp2','Projective plane']],label:'Surface',get:s=>s.surf,act:'surf'},{range:'a',label:'Where to cut (%)',min:10,max:45,step:5,get:s=>s.a,act:'a'}],
 on:{surf(s,v){if(v==='klein'||v==='rp2')s.surf=v},a(s,v){s.a=clamp(Math.round(+v/5)*5,10,45)}},
 draw(s){
  const kl=s.surf==='klein',a=s.a/100;let out='',pieces,ph;
  if(kl){
   const K=D4_kleinCut(a),x0=40,y0=66,W=190,M=(x,y)=>[x0+x*W,y0+W-y*W];pieces=K.pcs.map(p=>({kind:p.oneSided?'Möbius strip':'cylinder',chi:D4_grid(p.oneSided?'mobius':'cylinder',3).chi,one:p.oneSided}));
   const pieceOf=i=>K.pcs.findIndex(p=>p.arcs.includes(i));
   K.arcs.forEach(([lo,hi],i)=>{const col=tint(D4_PCOL[pieceOf(i)],.62);for(const [l,h] of hi>1?[[lo,1],[0,hi-1]]:[[lo,hi]]){const p=M(0,h),q=M(1,l);out+=R(p[0],p[1],q[0]-p[0],q[1]-p[1],col,'none',0)}});
   out+=L(x0,y0,x0+W,y0,C.purple,3)+L(x0,y0+W,x0+W,y0+W,C.purple,3)+D4_chev(x0,y0,x0+W,y0,2,C.purple,1)+D4_chev(x0,y0+W,x0+W,y0+W,2,C.purple,1);
   out+=L(x0,y0,x0,y0+W,C.coral,3)+L(x0+W,y0,x0+W,y0+W,C.coral,3)+D4_chev(x0,y0+W,x0,y0,1,C.coral,1)+D4_chev(x0+W,y0+W,x0+W,y0,1,C.coral,-1);
   for(const c of K.cuts){const p=M(0,c),q=M(1,c);out+=L(p[0],p[1],q[0],q[1],C.ink,2.4,'stroke-dasharray="7 5"')}
   K.arcs.forEach(([lo,hi],i)=>{const m=(lo+hi)/2%1;out+=TF(x0+W/2,M(0,m)[1]+5,'piece '+(pieceOf(i)+1),13,D4_PCOL[pieceOf(i)])});
   out+=TF(x0+W/2,y0+W+20,`cuts at heights ${D4_d2(K.cuts[0])} and ${D4_d2(K.cuts[1])}: one circle`,13,C.muted);
   out=heading(`Klein bottle: ${pieces.length} pieces, ${pieces.filter(p=>p.one).length} of them Möbius strips`)+out;
   ph=`The flip on the left and right sides sends height y to 1 − y, so the two dashed lines join into one closed cut. The band between them is carried onto itself upside down, and so is the band through the top and bottom edges: each is a Möbius strip. Glue them back along the cut and the Klein bottle returns.`;
  }else{
   const cx=136,cy=176,r=100,rc=r*(1-a);
   out+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${tint(D4_PCOL[0],.62)}" stroke="${C.coral}" stroke-width="3"/>`+`<circle cx="${cx}" cy="${cy}" r="${fmt(rc)}" fill="${tint(D4_PCOL[1],.62)}" stroke="${C.ink}" stroke-width="2.4" stroke-dasharray="7 5"/>`;
   for(const t of [Math.PI/4,Math.PI*5/4])out+=D4_chev(cx+r*Math.cos(t+.2),cy-r*Math.sin(t+.2),cx+r*Math.cos(t-.2),cy-r*Math.sin(t-.2),1,C.coral,1);
   out+=TF(cx,cy+5,'piece 2',13,D4_PCOL[1])+TF(cx,cy-r+(r-rc)/2+5,'piece 1',13,D4_PCOL[0]);
   out+=TF(cx,cy+r+22,'opposite edge points glued; cut dashed',13,C.muted);
   const strip=D4_strip(1,null).pieces[0];
   pieces=[{kind:strip.oneSided?'Möbius strip':'cylinder',chi:D4_grid('mobius',3).chi,one:strip.oneSided},{kind:'disc',chi:D4_info(D4_parse('a')).chi,one:false}];
   out=heading('Projective plane: a Möbius strip and a disc')+out;
   ph=`Outside the cut, a short path that runs out to the edge comes back in from the opposite side, carried across the disc and turned over: followed round, the outer ring is a strip whose ends meet with a flip, a Möbius strip. Inside the cut is an ordinary disc. Sew the disc onto the strip’s single edge and the projective plane returns.`;
  }
  // pieces in space
  out+=R(298,48,286,186,'#fff',C.grid,8);
  pieces.forEach((p,i)=>{const cxp=pieces.length===2?370+i*140:440,Pr=D4_view(.4,1,cxp,128,26);
   if(p.kind==='disc'){out+=`<ellipse cx="${cxp}" cy="128" rx="44" ry="30" fill="${tint(D4_PCOL[i],.45)}" stroke="#b8cddb"/>`}
   else out+=D4_paint(D4_stripMesh(p.one?1:0,Pr,54,3,()=>tint(D4_PCOL[i],.45)),Pr);
   out+=TF(cxp,206,`piece ${i+1}: ${p.kind}`,13,D4_PCOL[i])});
  // table
  pieces.forEach((p,i)=>{const y=262+i*24;out+=TF(306,y,`piece ${i+1}: ${p.one?'one side, one edge':p.kind==='disc'?'two sides, one edge':'two sides, two edges'}, V − E + F = ${D4_minus(p.chi)}`,13,C.ink,'start')});
  const whole=D4_grid(kl?'klein':'rp2',3).chi;
  out+=TBF(306,262+pieces.length*24+6,`${pieces.map(p=>D4_minus(p.chi)).join(' + ')} − 0 = ${D4_minus(whole)}, the ${kl?'Klein bottle':'projective plane'}`,13,C.blue,'start');
  out+=D4_note('The cut circle counts 0: a circle cut into n points and n arcs has n − n = 0.',362);
  return {svg:out,phase:ph};
 }});

/* ===================== Lesson: euler-genus ===================== */
// The square cut into n × n cells, glued by type; a pressed cell gets a diagonal.
const D4_EG_TYPES=[['sphere','Sphere'],['torus','Torus'],['klein','Klein bottle'],['rp2','Projective plane']];
const D4_VCOL=['#1772b7','#2c776c','#9a6200','#7156a6','#c45238','#546873','#0f8fa0','#b0418a'];
function D4_egWatch(p){const seq=[['torus',1,0],['torus',2,0],['torus',2,3],['torus',3,5],['torus',4,9],['sphere',1,0],['sphere',3,4],['rp2',1,0],['rp2',3,4],['klein',4,6]],k=Math.min(seq.length-1,Math.floor(p*seq.length));
 const [type,n,d]=seq[k];return {type,n,diag:range(d).map(i=>(i*5+2)%(n*n)).filter((v,i,a)=>a.indexOf(v)===i)}}
SCENE({id:'euler-genus',name:'Cut it up any way you like',tag:'An invariant of the surface',
 definition:'Cut a closed surface into faces, count the vertices V, edges E and faces F, and V − E + F always comes out the same, however the cutting is done. So the number belongs to the surface, not to the cutting: it is the Euler characteristic, written χ (chi). Euler found the value 2 for convex polyhedra; in 1813 Simon Lhuilier noticed that solids with tunnels give other values, and later topologists, Poincaré above all, recognised the count as a property of the surface itself.',
 get example(){const t=[1,2,4].map(n=>D4_grid('torus',n)),s=[1,2,4].map(n=>D4_grid('sphere',n));return `Torus from a square cut into 1, 4 and 16 cells: ${t.map(g=>`${g.V} − ${g.E} + ${g.F} = ${D4_minus(g.chi)}`).join('; ')}. Sphere: ${s.map(g=>`${g.V} − ${g.E} + ${g.F} = ${D4_minus(g.chi)}`).join('; ')}. A diagonal adds one edge and one face, so it changes nothing.`},
 desc:'A gluing square cut into a grid of cells, some split by diagonals, with its corners coloured and numbered by which become the same point after gluing, and counts of vertices, edges and faces after gluing with V − E + F.',
 research:['Lhuilier (1813). Mémoire sur la polyédrométrie. Gergonne’s Annales: polyhedra with tunnels, for which V − E + F is not 2.','Poincaré (1895). Analysis situs: the alternating count as an invariant. Radó (1925) proved that every surface can be cut into triangles, so the count is always available.'],
 dur:18,hint:'Choose a surface and the size of the grid, then press cells to add diagonals. V, E and F change; does V − E + F?',
 init:()=>({type:'torus',n:3,diag:[]}),
 watch:D4_egWatch,
 ui:[{choose:D4_EG_TYPES,label:'Surface',get:s=>s.type,act:'type'},{range:'n',label:'Grid',min:1,max:6,get:s=>s.n,act:'n',show:v=>`${v} × ${v}`},{b:'Clear diagonals',act:'clear'}],
 on:{type(s,v){if(D4_GLUE[v])s.type=v},n(s,v){s.n=clamp(Math.round(+v),1,6);s.diag=s.diag.filter(c=>c<s.n*s.n)},clear(s){s.diag=[]},
  cell(s,v){const c=clamp(Math.round(+v),0,s.n*s.n-1),i=s.diag.indexOf(c);if(i>=0)s.diag.splice(i,1);else s.diag.push(c);return 'keep'}},
 draw(s,f,X){
  const n=s.n,g=D4_grid(s.type,n,s.diag),x0=40,y0=60,W=236,c=W/n,M=(i,j)=>[x0+i*c,y0+W-j*c];
  let out=heading(`${D4_cap(D4_GLUE[s.type].name)}: ${g.V} − ${g.E} + ${g.F} = ${D4_minus(g.chi)}`);
  out+=D4_square(s.type,x0,y0,W,{fill:'#fff'});
  for(let i=0;i<n;i++)for(let j=0;j<n;j++){const id=j*n+i,p=M(i,j+1),inner=R(p[0]+1,p[1]+1,c-2,c-2,s.diag.includes(id)?'#eaf3f9':'#fbfdfe','none',0)+(s.diag.includes(id)?L(p[0],p[1]+c,p[0]+c,p[1],C.blue,2):'');out+=hit(X,'cell',id,`Cell ${i+1}, ${j+1}: press to ${s.diag.includes(id)?'remove':'add'} a diagonal`,inner)}
  for(let i=1;i<n;i++){const a=M(i,0),b=M(i,n),d=M(0,i),e=M(n,i);out+=L(a[0],a[1],b[0],b[1],C.blue,1.6)+L(d[0],d[1],e[0],e[1],C.blue,1.6)}
  out+=D4_square(s.type,x0,y0,W,{fill:'none'}).replace(/<rect[^>]*\/>/,'');
  const small=n<=4;
  for(let i=0;i<=n;i++)for(let j=0;j<=n;j++){const k=g.vclass(i,j),p=M(i,j),multi=g.copies[k]>1;
   out+=Ci(p[0],p[1],small?8.5:5,multi?D4_VCOL[k%8]:'#fff',D4_VCOL[k%8]);if(small)out+=TBF(p[0],p[1]+4.5,k+1,small&&k>=9?11:12,multi?'#fff':D4_VCOL[k%8])}
  out+=TF(x0+W/2,y0+W+24,small?'same number = same point after gluing':'filled dots: points that appear more than once',13,C.muted);
  const nv=(n+1)*(n+1),ne=2*n*(n+1)+s.diag.length;
  out+=D4_tile(318,64,124,'Corners drawn',String(nv),C.muted)+D4_tile(456,64,124,'V after gluing',String(g.V),C.ink);
  out+=D4_tile(318,118,124,'Edges drawn',String(ne),C.muted)+D4_tile(456,118,124,'E after gluing',String(g.E),C.ink);
  out+=D4_tile(318,172,124,'Faces',String(g.F),C.muted)+D4_tile(456,172,124,'F',String(g.F),C.ink);
  out+=R(318,232,262,60,C.pale,'none',8)+TF(449,254,'V − E + F',13,C.muted)+TBF(449,280,`${g.V} − ${g.E} + ${g.F} = ${D4_minus(g.chi)}`,17,C.blue);
  out+=TF(449,316,`the same for every grid and diagonal`,13,C.muted);
  return {svg:out,phase:`The ${n} × ${n} grid draws ${nv} corners and ${ne} edges, but on the ${D4_GLUE[s.type].name} glued corners and edges are one: after gluing there are ${g.V} ${D4_plural(g.V,'vertex','vertices')}, ${g.E} ${D4_plural(g.E,'edge')} and ${g.F} ${D4_plural(g.F,'face')}, and V − E + F = ${D4_minus(g.chi)}. A finer grid or another diagonal changes all three counts but not this total.`};
 }});

// A polygon with its edges labelled by a word, drawn round a circle; corners coloured by which become one point.
function D4_drawPoly(w,cx,cy,r,o={}){const n=w.length,inf=D4_info(w);let out='';
 const ang=k=>Math.PI/2+Math.PI/n+D4_TAU*k/n,cor=k=>[cx+r*Math.cos(ang(k)),cy-r*Math.sin(ang(k))];
 const lc=l=>(o.col&&o.col[l])||D4_VCOL[(l.charCodeAt(0)*7)%8];
 if(n===1){out+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${o.fill||'#f6f9fb'}" stroke="${C.ink}" stroke-width="2" stroke-dasharray="6 5"/>`;return out}
 if(n===2){const a=[cx,cy-r],b=[cx,cy+r];
  out+=`<path d="M${a[0]} ${a[1]} Q${cx-r*1.1} ${cy} ${b[0]} ${b[1]} Q${cx+r*1.1} ${cy} ${a[0]} ${a[1]}Z" fill="${o.fill||'#f6f9fb'}" stroke="none"/>`;
  w.forEach((x,k)=>{const sx=k===0?-1:1,col=lc(x.l),from=k===0?a:b,to=k===0?b:a;out+=P(`M${from[0]} ${from[1]} Q${cx+sx*r*1.1} ${cy} ${to[0]} ${to[1]}`,col,3);
   const mx=cx+sx*r*.55,dy=(to[1]-from[1])>0?1:-1,e=x.e;out+=D4_chev(mx,cy-dy*e*10,mx,cy+dy*e*10,1,col,1)+TBF(mx+sx*20,cy+5,x.l+(x.e<0?'⁻¹':''),14,col)});
  [a,b].forEach((p,k)=>{const c=inf.corner[k];out+=Ci(p[0],p[1],8,D4_VCOL[c%8],'#fff')+TBF(p[0],p[1]+4.5,c+1,12,'#fff')});return out}
 const pts=range(n).map(cor);out+=`<polygon points="${pts.map(p=>fmt(p[0])+','+fmt(p[1])).join(' ')}" fill="${o.fill||'#f6f9fb'}" stroke="none"/>`;
 w.forEach((x,k)=>{const a=pts[k],b=pts[(k+1)%n],col=lc(x.l),hl=o.hl&&o.hl.includes(x.l);out+=L(a[0],a[1],b[0],b[1],col,hl?5:3)+D4_chev(a[0],a[1],b[0],b[1],1,col,x.e);
  const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,dx=mx-cx,dy=my-cy,d=Math.hypot(dx,dy)||1,lr=o.lab||18;
  out+=TBF(mx+dx/d*lr,my+dy/d*lr+5,x.l+(x.e<0?'⁻¹':''),n>10?13:14,col)});
 if(o.corners!==false)pts.forEach((p,k)=>{const c=inf.corner[k];out+=Ci(p[0],p[1],n>10?5:7,D4_VCOL[c%8],'#fff')});
 return out}
const D4_LET='abcdefghjkmn';
function D4_normalWord(orient,g){if(orient){if(g===0)return D4_parse('aA');let s='';for(let i=0;i<g;i++){const a=D4_LET[2*i],b=D4_LET[2*i+1];s+=a+b+a.toUpperCase()+b.toUpperCase()}return D4_parse(s)}
 let s='';for(let i=0;i<g;i++)s+=D4_LET[i]+D4_LET[i];return D4_parse(s)}
// A schematic outline of a surface with g holes, or a sphere with k cross-caps marked.
function D4_pretzel(cx,cy,w,h,g,col=C.blue){if(g===0)return `<ellipse cx="${cx}" cy="${cy}" rx="${h*.6}" ry="${h/2}" fill="${C.pale}" stroke="${col}" stroke-width="2.4"/>`;
 let out=`<rect x="${fmt(cx-w/2)}" y="${fmt(cy-h/2)}" width="${fmt(w)}" height="${fmt(h)}" rx="${fmt(h/2)}" fill="${C.pale}" stroke="${col}" stroke-width="2.4"/>`;
 for(let i=0;i<g;i++){const x=cx-w/2+h/2+(w-h)*(g===1?.5:i/(g-1)),hw=Math.min(22,(w-h)/(2*g)+6);out+=P(`M${fmt(x-hw)} ${fmt(cy-2)} Q${fmt(x)} ${fmt(cy+10)} ${fmt(x+hw)} ${fmt(cy-2)}`,col,2.2)+P(`M${fmt(x-hw*.7)} ${fmt(cy+2)} Q${fmt(x)} ${fmt(cy-7)} ${fmt(x+hw*.7)} ${fmt(cy+2)}`,col,2.2)}
 return out}
function D4_capSphere(cx,cy,r,k){let out=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.pale}" stroke="${C.purple}" stroke-width="2.4"/>`;
 for(let i=0;i<k;i++){const a=D4_TAU*i/Math.max(k,1)-Math.PI/2,x=cx+(k===1?0:r*.5*Math.cos(a)),y=cy+(k===1?0:r*.5*Math.sin(a));out+=Ci(x,y,9,'#fff',C.purple)+TBF(x,y+5,'×',14,C.purple)}
 return out}
SCENE({id:'euler-genus-handles',name:'Each handle costs two',tag:'χ = 2 − 2g and χ = 2 − k',
 get definition(){const c=(o,g)=>D4_minus(D4_info(D4_normalWord(o,g)).chi);return `Add a handle to a surface, by cutting out two discs and joining their edges with a tube, and V − E + F drops by 2: each disc removed takes away 1 face, and the tube, a cylinder, counts 0. So a sphere with g handles has χ = 2 − 2g, where g is called the genus: ${c(true,0)} for the sphere, ${c(true,1)} for the torus, ${c(true,2)} for the two-holed torus. Replacing a disc with a Möbius strip, a cross-cap, lowers χ by 1, so a sphere with k cross-caps has χ = 2 − k: ${c(false,1)} for the projective plane, ${c(false,2)} for the Klein bottle.`},
 get example(){const r=[0,1,2,3].map(g=>D4_info(D4_normalWord(true,g)).chi),c=[1,2,3].map(k=>D4_info(D4_normalWord(false,k)).chi);return `Counted from the standard polygons: handles 0, 1, 2, 3 give ${r.map(D4_minus).join(', ')}; cross-caps 1, 2, 3 give ${c.map(D4_minus).join(', ')}. Apart from the sphere’s a a⁻¹, every corner of these polygons ends up at a single point, so V = 1, E is half the number of sides and F = 1.`},
 desc:'The standard polygon for a surface with g handles or k cross-caps, its corners all glued to one point, a sketch of the surface, the counts V, E and F computed from the polygon’s word, and a plot of V − E + F against the number of handles or cross-caps.',
 research:['Lhuilier (1813): for a polyhedron with g tunnels, V − E + F = 2 − 2g.','Möbius (1863). Theorie der elementaren Verwandtschaft: closed surfaces in space sorted by their number of handles.','Counts computed from the word of each polygon (union-find on corners).'],
 dur:15,hint:'Choose handles or cross-caps and change their number. Read V, E and F from the polygon, then compare V − E + F with the plot.',
 init:()=>({or:1,g:2}),
 watch(p){const k=Math.min(6,Math.floor(p*7));return k<4?{or:1,g:k}:{or:0,g:k-3}},
 ui:[{choose:[[1,'Handles'],[0,'Cross-caps']],label:'Add',get:s=>s.or,act:'or'},{range:'g',label:'How many',min:0,max:3,get:s=>s.g,act:'g'}],
 on:{or(s,v){s.or=+v?1:0;if(!s.or&&s.g<1)s.g=1},g(s,v){s.g=clamp(Math.round(+v),s.or?0:1,3)}},
 draw(s){
  const w=D4_normalWord(!!s.or,s.g),inf=D4_info(w),nm=D4_name(inf.orient,inf.chi,0);
  let out=heading(`${D4_cap(nm)}: V − E + F = ${D4_minus(inf.chi)}`);
  out+=R(18,48,268,250,'#fff',C.grid,8)+D4_drawPoly(w,150,158,w.length>8?80:76,{lab:w.length>12?14:18});
  out+=TF(152,288,D4_show(w),w.length>12?13:14,C.ink);
  out+=s.or?D4_pretzel(150,330,Math.max(60,s.g*70),36,s.g):D4_capSphere(150,332,24,s.g);
  out+=D4_tile(304,52,88,'V',String(inf.V),C.ink)+D4_tile(400,52,88,'E',String(inf.E),C.ink)+D4_tile(496,52,88,'F',String(inf.F),C.ink);
  // chart of χ against number added
  const P0=[320,120,256,170],cxv=g=>P0[0]+30+g*66,cyv=c=>P0[1]+30+(2-c)*21;
  out+=R(P0[0]-16,P0[1]-6,280,190,'#fff',C.grid,8)+TF(P0[0],P0[1]+14,'V − E + F',13,C.muted,'start');
  for(const c of [2,0,-2,-4])out+=L(P0[0]+10,cyv(c),P0[0]+250,cyv(c),C.grid,1)+TF(P0[0]+4,cyv(c)+4,D4_minus(c),13,C.muted,'end');
  for(const [orf,col] of [[1,C.blue],[0,C.purple]]){const vals=range(4).filter(g=>orf||g>0).map(g=>[g,D4_info(D4_normalWord(!!orf,g)).chi]);
   out+=D4_poly(vals.map(([g,c])=>[cxv(g),cyv(c)]),col,1.6);vals.forEach(([g,c])=>{const sel=orf===s.or&&g===s.g;out+=Ci(cxv(g),cyv(c),sel?7:4.5,sel?col:'#fff',col)})}
  for(let g=0;g<=3;g++)out+=TF(cxv(g),P0[1]+166,g,13,C.muted);
  out+=TF(P0[0]+128,P0[1]+182,'handles (blue), cross-caps (purple)',13,C.muted);
  return {svg:out,phase:`The polygon ${D4_show(w)} has ${w.length} sides. Gluing pairs them into E = ${inf.E} ${D4_plural(inf.E,'edge')}, and ${inf.V===1?`all ${w.length} corners come together at V = 1 point`:`the corners become V = ${inf.V} points`}, so V − E + F = ${inf.V} − ${inf.E} + 1 = ${D4_minus(inf.chi)}${s.or?` = 2 − 2 × ${s.g}`:` = 2 − ${s.g}`}. ${s.or?'Each handle adds 4 sides, 2 edges, and lowers the count by 2.':'Each cross-cap adds 2 sides, 1 edge, and lowers the count by 1.'}`};
 }});

// Solids built from unit cubes in one layer, cells (x, y) of a 5 × 3 map. The surface is made of unit squares; at
// each vertex the angle is 90° for every square that meets there, and the defect is 360° minus that total.
const D4_SLABS={block:[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]],frame:[[0,0],[1,0],[2,0],[0,1],[2,1],[0,2],[1,2],[2,2]],
 two:[[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[2,1],[4,1],[0,2],[1,2],[2,2],[3,2],[4,2]],cube:[[0,0]]};
function D4_slab(cells){return D4_memo('sl:'+cells.map(String).sort().join(';'),()=>{
 const has=(x,y)=>cells.some(c=>c[0]===x&&c[1]===y),sq=[];
 for(const [x,y] of cells){sq.push([[x,y,1],[x+1,y,1],[x+1,y+1,1],[x,y+1,1]],[[x,y,0],[x,y+1,0],[x+1,y+1,0],[x+1,y,0]]);
  if(!has(x,y-1))sq.push([[x,y,0],[x+1,y,0],[x+1,y,1],[x,y,1]]);if(!has(x,y+1))sq.push([[x,y+1,0],[x,y+1,1],[x+1,y+1,1],[x+1,y+1,0]]);
  if(!has(x-1,y))sq.push([[x,y,0],[x,y,1],[x,y+1,1],[x,y+1,0]]);if(!has(x+1,y))sq.push([[x+1,y,0],[x+1,y+1,0],[x+1,y+1,1],[x+1,y,1]])}
 const vk=p=>p.join(','),V=new Map(),E=new Map();
 for(const s of sq)for(let i=0;i<4;i++){const a=vk(s[i]),b=vk(s[(i+1)%4]);V.set(a,(V.get(a)||0)+1);const e=a<b?a+'|'+b:b+'|'+a;E.set(e,(E.get(e)||0)+1)}
 const pinched=[...E.values()].some(c=>c!==2);
 // pieces: cells joined through shared sides
 const seen=new Set(),key=c=>c.join(',');let pieces=0;for(const c of cells){if(seen.has(key(c)))continue;pieces++;const st=[c];while(st.length){const [x,y]=st.pop();if(seen.has(x+','+y))continue;seen.add(x+','+y);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])if(has(x+dx,y+dy))st.push([x+dx,y+dy])}}
 const def=[...V.entries()].map(([k,c])=>({p:k.split(',').map(Number),d:360-90*c}));
 return {sq,V:V.size,E:E.size,F:sq.length,chi:V.size-E.size+sq.length,pinched,pieces,def,total:sum(def.map(d=>d.d))}})}
SCENE({id:'euler-genus-defect',name:'Corners add up to the count',tag:'Descartes’s angle defects, toward Gauss–Bonnet',
 get definition(){const c=D4_slab(D4_SLABS.cube);return `At each corner of a polyhedron, add up the angles of the faces that meet there; 360° minus that sum is the corner’s angle defect. A cube’s corners each have three right angles, a defect of ${c.def[0].d}°, and its ${c.def.length} corners add up to ${c.total}°. René Descartes noticed that the defects of any convex polyhedron add up to 720°; his notes survive only in a copy made by Leibniz. In fact the defects of any closed polyhedral surface add up to 360° × (V − E + F). Corners that bend outwards count positive, saddle-shaped corners negative, and on a torus they cancel exactly.`},
 get example(){const b=D4_slab(D4_SLABS.block),f=D4_slab(D4_SLABS.frame),t=D4_slab(D4_SLABS.two);return `A 3 × 3 slab: defects total ${b.total}°, and V − E + F = ${b.chi}. Remove the middle cube to make a frame: ${f.def.filter(d=>d.d>0).length} corners of +90° and ${f.def.filter(d=>d.d<0).length} of −90° total ${f.total}°, and V − E + F = ${f.chi}. With two holes: ${D4_minus(t.total)}° and ${D4_minus(t.chi)}. This is the flat ancestor of the Gauss–Bonnet theorem of the next era.`},
 desc:'A slab of unit cubes drawn in 3D, with corners of positive angle defect marked green and negative marked red, a map of which cells hold cubes that the learner can change, and counts of V, E, F, V − E + F and the total of the defects.',
 research:['Descartes (written about 1630). De solidorum elementis, known only from a copy made by Leibniz, found among his papers in 1860: the defects of a convex polyhedron total eight right angles, 720°.','Richeson (2008). Euler’s Gem, chapters on Descartes and on Gauss–Bonnet.','Angles and counts are computed from the squares of the drawn surface.'],
 dur:15,hint:'Choose a ready-made solid or press cells of the map to add and remove cubes. Watch the total of the defects and V − E + F together.',
 init:()=>({cells:D4_SLABS.frame.map(c=>c.slice())}),
 watch(p){const k=['cube','block','frame','two'][Math.min(3,Math.floor(p*4))];return {cells:D4_SLABS[k].map(c=>c.slice())}},
 ui:[{choose:[['cube','One cube'],['block','Block'],['frame','Frame'],['two','Two holes']],label:'Solid',get:s=>Object.keys(D4_SLABS).find(k=>D4_SLABS[k].map(String).sort().join(';')===s.cells.map(String).sort().join(';'))||'',act:'lay'}],
 on:{lay(s,v){if(D4_SLABS[v])s.cells=D4_SLABS[v].map(c=>c.slice())},cell(s,v){const [x,y]=String(v).split(',').map(Number);if(!(x>=0&&x<5&&y>=0&&y<3))return;const i=s.cells.findIndex(c=>c[0]===x&&c[1]===y);if(i>=0){if(s.cells.length>1)s.cells.splice(i,1)}else s.cells.push([x,y]);return 'keep'}},
 draw(s,f,X){
  const S=D4_slab(s.cells),Pr=D4_view(.55,.75,300,150,46),cen=[2.5,1.5,.5],sh=p=>Pr([p[0]-cen[0],p[1]-cen[1],p[2]-cen[2]]);
  let out=heading(S.pinched?'Cubes touching along an edge: not a surface':`Defects total ${S.total}° = 360° × ${D4_minus(S.chi)}`);
  out+=D4_paint(S.sq.map(q=>({pts:q.map(p=>[p[0]-cen[0],p[1]-cen[1],p[2]-cen[2]]),fill:q.every(p=>p[2]===1)?'#dbe9f3':'#c4d9e7',stroke:'#7f9fb4',sw:.8})),Pr);
  if(!S.pinched)for(const d of S.def){if(!d.d)continue;const q=sh(d.p);out+=Ci(q[0],q[1],5.5,d.d>0?C.green:C.coral,'#fff')}
  // the map
  const mx=30,my=262,mc=22;out+=TF(mx,my-8,'press cells',13,C.muted,'start');
  for(let x=0;x<5;x++)for(let y=0;y<3;y++){const on=s.cells.some(c=>c[0]===x&&c[1]===y);out+=hit(X,'cell',x+','+y,`Cell ${x+1}, ${y+1}: ${on?'cube':'empty'}`,R(mx+x*mc,my+(2-y)*mc,mc-2,mc-2,on?C.blue:'#fff',C.line,3))}
  const pos=S.def.filter(d=>d.d>0).length,neg=S.def.filter(d=>d.d<0).length;
  out+=Ci(170,270,5.5,C.green,'#fff')+TF(180,275,`${pos} corners of +90°`,13,C.ink,'start')+Ci(170,294,5.5,C.coral,'#fff')+TF(180,299,`${neg} corners of −90°`,13,C.ink,'start')+TF(170,322,'other corners: 0°',13,C.muted,'start');
  out+=D4_tile(330,258,78,'V',String(S.V),C.ink)+D4_tile(416,258,78,'E',String(S.E),C.ink)+D4_tile(502,258,78,'F',String(S.F),C.ink);
  out+=D4_tile(330,312,120,'V − E + F',S.pinched?'—':D4_minus(S.chi),C.blue)+D4_tile(460,312,120,'Total defect',S.pinched?'—':D4_minus(S.total)+'°',C.green);
  return {svg:out,phase:S.pinched?'Two cubes meet only along an edge, so four squares share that edge and the surface is pinched there: it is not a surface, and neither count applies. Fill in or empty a neighbouring cell.':
   `${pos} outward corners contribute +90° each and ${neg} saddle corners −90° each: ${pos} × 90 − ${neg} × 90 = ${S.total}°. Counting cells instead, ${S.V} − ${S.E} + ${S.F} = ${D4_minus(S.chi)}, and 360° × ${D4_minus(S.chi)} = ${D4_minus(360*S.chi)}°.${S.pieces>1?` (There are ${S.pieces} separate pieces; both counts add up over pieces.)`:''} Bending is measured by the defects, holes by the count, and they always agree.`};
 }});

/* ===================== Lesson: surface-classification ===================== */
const D4_STARTS=[['abcABC','Hexagon, straight'],['abcabc','Hexagon, flipped'],['abacbc','Tangled hexagon'],['abcdABCD','Octagon, straight'],['abABcc','Handle and cross-cap']];
function D4_redFrames(s){const st=D4_reduce(s.start);return st.map((x,i)=>({...x,i,n:st.length,prev:i?st[i-1].w:x.w}))}
function D4_stepTitle(f){return f.kind==='start'?'The starting polygon':f.kind==='fold'?`Fold: ${f.l} next to ${f.l}⁻¹ zips shut`:f.kind==='cut'?`Cut along ${f.z}, glue along ${f.l}`:f.kind==='done'?'Normal form reached':'No move found'}
// The cut drawn on the polygon before the move: a dashed diagonal between corners i and j.
function D4_cutLine(w,i,j,cx,cy,r){const n=w.length,ang=k=>Math.PI/2+Math.PI/n+D4_TAU*k/n,p=k=>[cx+r*Math.cos(ang(k)),cy-r*Math.sin(ang(k))],a=p(i),b=p(j);return L(a[0],a[1],b[0],b[1],C.ink,2.4,'stroke-dasharray="7 5"')}
SCENE({id:'surface-classification',name:'Cutting and re-gluing to normal form',tag:'The classification of surfaces',
 definition:'Every closed surface is either a sphere with some number g of handles or a sphere with some number k of cross-caps. Two facts decide which, and how many: whether the surface has one side or two, and its V − E + F. The proof works on gluing polygons. Any polygon can be cut along a straight line and the two pieces glued back along a matching pair of sides; this changes the polygon but not the surface. Repeated cuts bring matching sides together into blocks, x x for a cross-cap and x y x⁻¹ y⁻¹ for a handle: the normal form.',
 get example(){const st=D4_reduce('abcABC'),f=st[st.length-1].w,i=D4_info(f);return `The hexagon a b c a⁻¹ b⁻¹ c⁻¹ reaches ${D4_show(f)}, a ${D4_name(i.orient,i.chi,0)}, in ${st.length-2} moves. At every step V − E + F stays ${D4_minus(i.chi)} and the surface stays two-sided, as it must, since cutting and re-gluing does not change the surface.`},
 desc:'Two gluing polygons side by side, the word before a move with the cut marked and the word after it, the corners coloured by which become one point, and counts of V, E, F, V − E + F and sides that stay the same from step to step.',
 research:['Möbius (1863) and Jordan (1866): the orientable case. Dehn & Heegaard (1907), Analysis situs, Encyklopädie der mathematischen Wissenschaften: the statement for all closed surfaces. Brahana (1921), Annals of Mathematics 23: the first complete proof by this method, for surfaces cut into polygons.','Radó (1925): every surface can be cut into triangles, so the method applies to all.','The moves shown are found by the computer, searching up to three cut-and-glue moves ahead.'],
 dur:20,hint:'Choose a starting polygon and step through the moves. Check that V − E + F and the number of sides never change.',
 init:()=>({start:'abcABC'}),
 trace:D4_redFrames,
 ui:[{choose:D4_STARTS.map(([w,l])=>[w,l]),label:'Start',get:s=>s.start,act:'start'}],
 on:{start(s,v){if(D4_STARTS.some(x=>x[0]===v))s.start=v}},
 draw(s,f,X){
  f=f||D4_redFrames(s)[0];const before=f.prev,after=f.w,ib=D4_info(before),ia=D4_info(after),nm=D4_name(ia.orient,ia.chi,0);
  let out=heading(`Step ${f.i} of ${f.n-1}: ${D4_stepTitle(f)}`);
  const cols={};let ci=0;for(const x of before.concat(after))if(!(x.l in cols))cols[x.l]=D4_VCOL[ci++%8];
  const rb=before.length>6?78:72,ra=after.length>6?78:72;
  out+=R(16,46,276,236,'#fff',C.grid,8)+R(308,46,276,236,'#fff',C.grid,8);
  out+=D4_drawPoly(before,154,160,rb,{col:cols,hl:f.kind==='cut'?[f.l]:f.kind==='fold'?[f.l]:[]});
  if(f.kind==='cut')out+=D4_cutLine(before,f.i_,f.j_,154,160,rb);
  out+=D4_drawPoly(after,446,160,ra,{col:cols,hl:f.kind==='cut'?[f.z]:[]});
  out+=TF(154,68,f.kind==='start'?'start':'before',13,C.muted)+TF(446,68,f.kind==='start'?'start':'after',13,C.muted);
  out+=TF(154,270,D4_show(before),14,C.ink)+TF(446,270,D4_show(after),14,C.ink);
  out+=arrow(294,160,306,160,C.muted,2);
  const tl=[['V',ia.V],['E',ia.E],['F',ia.F],['V − E + F',D4_minus(ia.chi)],['Sides',ia.orient?'two':'one']];
  tl.forEach(([l,v],k)=>{out+=D4_tile(16+k*116,294,108,l,String(v),k===3?C.blue:k===4?(ia.orient?C.green:C.coral):C.ink)});
  out+=D4_note(f.kind==='done'?`Normal form: a ${nm}.`:`The surface throughout: ${ib.orient===ia.orient&&ib.chi===ia.chi?'unchanged, ':''}a ${nm}.`,362);
  const ph=f.kind==='start'?`The polygon ${D4_show(after)} has ${after.length} sides. Gluing gives V = ${ia.V}, E = ${ia.E}, F = 1, so V − E + F = ${D4_minus(ia.chi)}, and it is ${ia.orient?'two-sided':'one-sided'}. The classification says this must be a ${nm}. The moves that follow show it.`:
   f.kind==='fold'?`The sides ${f.l} and ${f.l}⁻¹ sit next to each other, so gluing them just zips the polygon shut along them: remove both. One edge and one vertex disappear together, so V − E + F is still ${D4_minus(ia.chi)}.`:
   f.kind==='cut'?`Cut straight across the polygon (dashed), making a new pair of sides labelled ${f.z}; then glue the two pieces back along their ${f.l} sides${f.flipped?', turning one piece over first':''}. The new word is ${D4_show(after)}. V = ${ia.V}, E = ${ia.E}: nothing that matters has changed.`:
   f.kind==='done'?`Every pair of sides is now in a block: ${(()=>{const b=D4_blocks(after);return b.len?[b.handles?`${b.handles} ${D4_plural(b.handles,'handle')}`:'',b.caps?`${b.caps} ${D4_plural(b.caps,'cross-cap')}`:''].filter(Boolean).join(' and '):'a a⁻¹, the sphere'})()}. This is the normal form of a ${nm}; two surfaces with the same normal form are the same surface.`:'The search found no move within three steps.';
  return {svg:out,phase:ph};
 }});

// Building a surface from blocks: each handle adds x y x⁻¹ y⁻¹, each cross-cap x x. At most 8 sides.
function D4_buildWord(blocks){let s='',k=0;for(const b of blocks){if(b==='h'){const x=D4_LET[k++],y=D4_LET[k++];s+=x+y+x.toUpperCase()+y.toUpperCase()}else{const x=D4_LET[k++];s+=x+x}}return s}
const D4_BUILD_WATCH=[[],['h'],['h','c'],['c'],['c','c'],['h','h'],['c','c','h']];
SCENE({id:'surface-classification-build',name:'A handle and a cross-cap make three cross-caps',tag:'Dyck, 1888',
 definition:'Building a surface by adding handles and cross-caps to a sphere seems to give many kinds, but not as many as it looks. Walther Dyck showed in 1888 that once a surface has a cross-cap, each handle can be traded for two more cross-caps: a torus with a cross-cap is the same surface as three cross-caps. So the list of closed surfaces has just two families: spheres with g handles, and spheres with k cross-caps.',
 get example(){const w=D4_buildWord(['h','c']),st=D4_reduce(w),f=st[st.length-1].w,i=D4_info(f);return `A handle and a cross-cap: ${D4_show(D4_parse(w))}, with V − E + F = ${D4_minus(D4_info(D4_parse(w)).chi)}, one-sided. Cutting and re-gluing reaches ${D4_show(f)}: ${D4_name(i.orient,i.chi,0)}. Both have V − E + F = ${D4_minus(i.chi)}; with one side and that count there is only one surface it can be.`},
 desc:'Buttons that add a handle or a cross-cap to a sphere, the resulting gluing polygon, its normal form found by cutting and re-gluing, and a table that names every closed surface from its sides and its V − E + F.',
 research:['Dyck (1888). Beiträge zur Analysis situs. Mathematische Annalen 32: the relation between handles and cross-caps.','Normal forms here are computed by the same cut-and-glue search as the previous scene.'],
 dur:16,hint:'Add handles and cross-caps (up to 8 sides), then compare the polygon you built with its normal form. When does a handle turn into cross-caps?',
 init:()=>({b:['h','c']}),
 watch(p){return {b:D4_BUILD_WATCH[Math.min(D4_BUILD_WATCH.length-1,Math.floor(p*D4_BUILD_WATCH.length))].slice()}},
 ui:[{b:'Add a handle',act:'h'},{b:'Add a cross-cap',act:'c'},{b:'Back to a sphere',act:'clear'}],
 on:{h(s){if(D4_buildWord(s.b).length+4<=8)s.b.push('h')},c(s){if(D4_buildWord(s.b).length+2<=8)s.b.push('c')},clear(s){s.b=[]}},
 draw(s){
  const str=D4_buildWord(s.b),w=str?D4_parse(str):D4_parse('aA'),i0=D4_info(w),st=D4_reduce(D4_str(w)),fin=st[st.length-1].w,i1=D4_info(fin),nm=D4_name(i1.orient,i1.chi,0);
  const nh=s.b.filter(x=>x==='h').length,nc=s.b.length-nh;
  let out=heading(`${nh} ${D4_plural(nh,'handle')} + ${nc} cross-${D4_plural(nc,'cap')} = ${nm}`);
  out+=R(16,46,276,238,'#fff',C.grid,8)+R(308,46,276,238,'#fff',C.grid,8)+TF(154,64,'as built',13,C.muted)+TF(446,64,'normal form',13,C.muted);
  const cols={};let ci=0;for(const x of w.concat(fin))if(!(x.l in cols))cols[x.l]=D4_VCOL[ci++%8];
  out+=D4_drawPoly(w,154,166,66,{col:cols})+D4_drawPoly(fin,446,166,66,{col:cols});
  out+=TF(154,274,D4_show(w),14,C.ink)+TF(446,274,D4_show(fin),14,C.ink);
  out+=D4_tile(16,292,130,'V − E + F',`${D4_minus(i0.chi)} → ${D4_minus(i1.chi)}`,C.blue)+D4_tile(162,292,130,'Sides',`${i0.orient?'two':'one'} → ${i1.orient?'two':'one'}`,i1.orient?C.green:C.coral)+D4_tile(308,292,130,'Moves',String(st.filter(x=>x.kind==='cut'||x.kind==='fold').length),C.ink);
  // name table
  out+=TBF(452,310,'two sides:',13,C.green,'start')+TF(522,310,'χ = 2 − 2g',13,C.ink,'start')+TBF(452,330,'one side:',13,C.coral,'start')+TF(522,330,'χ = 2 − k',13,C.ink,'start');
  out+=D4_note(nh&&nc?'Mixed: every handle has become two cross-caps (Dyck).':'Normal form found by cutting and re-gluing, not looked up.',364);
  const ph=!s.b.length?'A sphere: the polygon a a⁻¹ is a disc folded shut. Add handles or cross-caps.':
   nh&&nc?`You built ${nh} ${D4_plural(nh,'handle')} and ${nc} cross-${D4_plural(nc,'cap')}. The surface is one-sided with V − E + F = ${D4_minus(i1.chi)}, so it is a sphere with 2 − (${D4_minus(i1.chi)}) = ${2-i1.chi} cross-caps; the moves found turn each handle into two cross-caps.`:
   nh?`Handles only: the surface is two-sided with V − E + F = ${D4_minus(i1.chi)} = 2 − 2 × ${nh}, already in normal form.`:`Cross-caps only: one-sided with V − E + F = ${D4_minus(i1.chi)} = 2 − ${nc}, already in normal form.`;
  return {svg:out,phase:ph};
 }});

// Same surface or not? Pairs of random gluing words, each pair chosen to be the same surface or not with equal odds.
// n letters, each used twice; for a two-sided word the second use of each letter reverses the first.
function D4_randWord(r,n,two){const L=D4_LET.slice(0,n),slots=[];L.split('').forEach(l=>{slots.push(l,l)});for(let i=slots.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[slots[i],slots[j]]=[slots[j],slots[i]]}
 const first={};return slots.map(l=>{let e;if(l in first)e=two?-first[l]:(r()<.5?1:-1);else e=first[l]=r()<.5?1:-1;return {l,e}})}
const D4_key=w=>{const i=D4_info(w);return (i.orient?'o':'n')+i.chi};
function D4_pair(round){return D4_memo('pair:'+round,()=>{const r=rng(9001+round*7919),same=r()<.5;
 for(let t=0;t<400;t++){const two=r()<.5,a=D4_randWord(r,3+Math.floor(r()*2),two),b=D4_randWord(r,3+Math.floor(r()*2),same?two:r()<.5);if(D4_foldAt(a)>=0||D4_foldAt(b)>=0)continue;if((D4_key(a)===D4_key(b))===same)return {a,b,same}}
 const a=D4_parse('abcABC'),b=D4_parse(same?'abAB':'abab');return {a,b,same:D4_key(a)===D4_key(b)}})}
const D4_HIST=[[1863,'Möbius'],[1866,'Jordan'],[1888,'Dyck'],[1907,'Dehn, Heegaard'],[1921,'Brahana'],[1925,'Radó']];
SCENE({id:'surface-classification-same',name:'Same surface or not?',tag:'Two numbers decide',
 definition:'Because of the classification, deciding whether two gluing polygons make the same surface needs no cutting at all: count V − E + F and check whether any pair of sides is glued with a flip. Equal answers mean the same surface; different answers, different surfaces. Few questions in topology have so complete an answer; three-dimensional spaces, the subject of a later era, are far harder. The classification is only the start, though: each surface of two or more handles can carry a whole family of curved shapes, and Maryam Mirzakhani, the first woman to win the Fields Medal (2014), found how such shapes and the curves on them can be counted.',
 get example(){const p=D4_pair(0),ia=D4_info(p.a),ib=D4_info(p.b);return `The first pair: ${D4_show(p.a)} (V − E + F = ${D4_minus(ia.chi)}, ${ia.orient?'two-sided':'one-sided'}) and ${D4_show(p.b)} (${D4_minus(ib.chi)}, ${ib.orient?'two-sided':'one-sided'}): ${p.same?'the same surface':'different surfaces'}. A closed two-sided surface with g ≥ 2 handles carries a family of hyperbolic shapes needing 6g − 6 numbers to describe: ${[2,3,4].map(g=>6*g-6).join(', ')} for g = 2, 3, 4.`},
 desc:'Two random gluing polygons, buttons to guess whether they make the same surface, and after the guess their counts, sides, names and a running score; below, a time line of the classification.',
 research:['Brahana (1921). Systems of circuits on two-dimensional manifolds. Annals of Mathematics 23: the complete proof for surfaces cut into polygons.','Mirzakhani (2008). Growth of the number of simple closed geodesics on hyperbolic surfaces. Annals of Mathematics 168. Fields Medal 2014.','Pairs are drawn at random from a fixed seed; answers are computed from the words.'],
 dur:15,hint:'Look at both polygons and guess: same surface or different? Then check the counts. Try a few rounds.',
 init:()=>({round:0,guess:null,score:0,tries:0}),
 watch(p){const k=Math.floor(p*3),u=p*3-k;return {round:k,guess:u>.5?(D4_pair(k).same?'same':'diff'):null,score:k+(u>.5?1:0),tries:k+(u>.5?1:0)}},
 ui:[{b:'Same surface',act:'same'},{b:'Different',act:'diff'},{b:'Next pair ▶',act:'next'}],
 on:{same(s){if(s.guess)return 'keep';s.guess='same';s.tries++;if(D4_pair(s.round).same)s.score++;return 'keep'},diff(s){if(s.guess)return 'keep';s.guess='diff';s.tries++;if(!D4_pair(s.round).same)s.score++;return 'keep'},next(s){s.round++;s.guess=null}},
 draw(s){
  const p=D4_pair(s.round),ia=D4_info(p.a),ib=D4_info(p.b),na=D4_name(ia.orient,ia.chi,0),nb=D4_name(ib.orient,ib.chi,0),shown=!!s.guess,right=shown&&((s.guess==='same')===p.same);
  let out=heading(!shown?`Pair ${s.round+1}: the same surface?`:right?`Right: ${p.same?'the same surface':'different surfaces'}`:`Not quite: ${p.same?'the same surface':'different surfaces'}`);
  out+=R(16,46,276,220,'#fff',C.grid,8)+R(308,46,276,220,'#fff',C.grid,8);
  out+=D4_drawPoly(p.a,154,154,62,{corners:shown})+D4_drawPoly(p.b,446,154,62,{corners:shown});
  out+=TF(154,258,D4_show(p.a),14,C.ink)+TF(446,258,D4_show(p.b),14,C.ink);
  if(shown){out+=TF(154,62,`χ = ${D4_minus(ia.chi)}, ${ia.orient?'two sides':'one side'}: ${na}`,13,ia.orient?C.green:C.coral)+TF(446,62,`χ = ${D4_minus(ib.chi)}, ${ib.orient?'two sides':'one side'}: ${nb}`,13,ib.orient?C.green:C.coral)}
  else out+=TF(300,62,'',13);
  out+=D4_tile(16,276,130,'Score',`${s.score} of ${s.tries}`,C.ink);
  // time line
  const x0=180,x1=570,X=y=>x0+(y-1860)/(1930-1860)*(x1-x0);out+=L(x0,300,x1,300,C.line,2);
  D4_HIST.forEach(([y,n],i)=>{const x=X(y);out+=Ci(x,300,4.5,C.blue)+TF(x,i%2?336:320,n,13,C.ink)+TF(x,i%2?352:288,String(y),13,C.muted)});
  const ph=!shown?`Polygon A has ${p.a.length} sides, polygon B ${p.b.length}. The number of sides does not decide it. Guess, then the counts appear.`:
   `A: V = ${ia.V}, E = ${ia.E}, F = 1, so χ = ${D4_minus(ia.chi)}, ${ia.orient?'no':'some'} side glued with a flip. B: V = ${ib.V}, E = ${ib.E}, so χ = ${D4_minus(ib.chi)}, ${ib.orient?'no':'some'} flipped pair. ${p.same?`Both are a ${na}, however different the polygons look.`:`A is a ${na}, B a ${nb}.`}${!ia.orient||ia.chi>-2?'':` As a two-sided surface with ${(2-ia.chi)/2} handles, A can carry hyperbolic shapes described by ${6*(2-ia.chi)/2-6} numbers.`}`;
  return {svg:out,phase:ph};
 }});
