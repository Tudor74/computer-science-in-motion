/* ===================== Dimensions In Motion · Era 5 · Curvature ===================== */
// Gauss's remarkable theorem, non-Euclidean geometry, geodesics, Riemann's lecture, Minkowski spacetime, and
// curvature measured from inside. Every picture is a pure function of state, frame and X. Every curvature, length,
// angle, area and interval on screen is computed below from the shape drawn (finite differences, sums of short
// chords, numerical integration, step-by-step transport) or from the formula named beside it, and the two are shown
// side by side where they can be. The only typed numbers are historical dates and measurements (with a research
// line), city coordinates (rounded geography), the Earth's mean radius, and the inputs of an example.

/* ---- shared helpers (era 5 only) ---- */
const D5_PI=Math.PI,D5_DEG=180/Math.PI;
const D5_note=(s,y=368)=>TF(300,y,s,13,C.muted);
const D5_tile=(x,y,w,label,value,col=C.blue)=>R(x,y,w,46,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+38,value,16,col);
// Fixed decimals with a true minus sign (no "−0.00").
const D5_n=(v,dp=2)=>{const s=Math.abs(v).toFixed(dp);return (v<0&&Number(s)!==0?'−':'')+s};
const D5_d=(rad,dp=1)=>D5_n(rad*D5_DEG,dp)+'°';
const D5_poly=(pts,col=C.blue,w=2.2,extra='',fill='none',close=false)=>pts.length>1?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L')+(close?' Z':''),col,w,fill,extra):'';
const D5_dash='stroke-dasharray="5 4"';
// 3-vectors
const D5_add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const D5_sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const D5_mul=(a,k)=>[a[0]*k,a[1]*k,a[2]*k];
const D5_dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const D5_cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const D5_len=a=>Math.sqrt(D5_dot(a,a));
const D5_unit=a=>{const l=D5_len(a)||1;return [a[0]/l,a[1]/l,a[2]/l]};
// Length of a polyline in space: the sum of its short chords.
const D5_plen=pts=>{let s=0;for(let i=1;i<pts.length;i++)s+=D5_len(D5_sub(pts[i],pts[i-1]));return s};
// Curvature of a curve through three nearby points: 1 / (radius of the circle through them).
function D5_curv3(a,b,c){const ab=D5_len(D5_sub(b,a)),bc=D5_len(D5_sub(c,b)),ca=D5_len(D5_sub(a,c)),ar=D5_len(D5_cross(D5_sub(b,a),D5_sub(c,a)))/2;return ab*bc*ca>1e-15?4*ar/(ab*bc*ca):0}
// Latitude and longitude (degrees) to a point on the unit sphere.
const D5_ll=(lat,lon)=>{const p=lat/D5_DEG,l=lon/D5_DEG;return [Math.cos(p)*Math.cos(l),Math.cos(p)*Math.sin(l),Math.sin(p)]};
// An orthographic view of the unit sphere from latitude lat0, longitude lon0: returns p -> [sx, sy, depth].
function D5_view(lat0,lon0,cx,cy,rr){const d=D5_ll(lat0,lon0),e=[-Math.sin(lon0/D5_DEG),Math.cos(lon0/D5_DEG),0],n=D5_cross(d,e);
 return p=>[cx+rr*D5_dot(p,e),cy-rr*D5_dot(p,n),D5_dot(p,d)]}
// A curve on the sphere: solid where it faces the viewer, dashed and faint behind.
function D5_sphCurve(pts,V,col,w=2.4){let out='',run=[],front=null;const flush=()=>{if(run.length>1)out+=D5_poly(run,col,front?w:1.4,front?'':D5_dash+' stroke-opacity=".5"');run=[]};
 for(const p of pts){const q=V(p),f=q[2]>=0;if(front!==null&&f!==front){run.push([q[0],q[1]]);flush()}front=f;run.push([q[0],q[1]])}flush();return out}
// Graticule: meridians every 30°, parallels every 30°.
function D5_globe(V,cx,cy,rr){let out=Ci(cx,cy,rr,'#f4f8fb',C.line);
 for(let lon=0;lon<360;lon+=30)out+=D5_sphCurve(range(61).map(i=>D5_ll(-90+i*3,lon)),V,C.grid,1.2);
 for(const lat of [-60,-30,0,30,60])out+=D5_sphCurve(range(121).map(i=>D5_ll(lat,i*3)),V,lat===0?'#c3d4df':C.grid,1.2);return out}
// Complex numbers as [re, im], for the Poincaré disc.
const D5_cm=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
const D5_cd=(a,b)=>{const q=b[0]*b[0]+b[1]*b[1];return [(a[0]*b[0]+a[1]*b[1])/q,(a[1]*b[0]-a[0]*b[1])/q]};
const D5_cabs=a=>Math.hypot(a[0],a[1]);
// Möbius map of the disc sending a to 0, and its inverse: T(z) = (z − a)/(1 − ā z).
const D5_T=(a,z)=>D5_cd([z[0]-a[0],z[1]-a[1]],[1-(a[0]*z[0]+a[1]*z[1]),-(a[0]*z[1]-a[1]*z[0])]);
const D5_Ti=(a,w)=>D5_cd([w[0]+a[0],w[1]+a[1]],[1+(a[0]*w[0]+a[1]*w[1]),(a[0]*w[1]-a[1]*w[0])]);
// Hyperbolic distance in the disc (curvature −1), and points along the geodesic from a to b.
const D5_hd=(a,b)=>2*Math.atanh(Math.min(.999999999,D5_cabs(D5_T(a,b))));
const D5_hgeo=(a,b,n=24)=>{const w=D5_T(a,b);return range(n+1).map(i=>D5_Ti(a,[w[0]*i/n,w[1]*i/n]))};
// Direction (angle) in which the geodesic from a to b leaves a: the direction of T_a(b), since T_a has a real derivative at a.
const D5_hdir=(a,b)=>{const w=D5_T(a,b);return Math.atan2(w[1],w[0])};
// Angle between two directions, in [0, π].
const D5_angBetween=(u,v)=>{let d=Math.abs(u-v)%(2*D5_PI);return d>D5_PI?2*D5_PI-d:d};

/* ===================== Lesson: theorema-egregium ===================== */
// A sheet 4 units across and 3 along is bent across only. Its cross-section is a curve parametrised by arc length s,
// built by integrating a chosen curvature κ(s); the sheet is that curve swept along the second direction.
// So the sheet is never stretched: every distance measured within it stays the same, whatever the bend.
const D5_SH={half:2,len:3,A:[-1.6,.4],B:[1.6,2.6],N:400};
const D5_PROF={};
function D5_profile(k,shape){const key=k+shape;if(D5_PROF[key])return D5_PROF[key];
 const N=D5_SH.N,h=2*D5_SH.half/N,kap=s=>shape==='wave'?k*1.6*Math.cos(2.2*s):k,pts=new Array(N+1),mid=N/2;
 pts[mid]=[0,0];let th=0,x=0,z=0;
 for(let i=mid;i<N;i++){const s=-D5_SH.half+(i+.5)*h;th+=kap(s)*h/2;x+=Math.cos(th)*h;z+=Math.sin(th)*h;th+=kap(s)*h/2;pts[i+1]=[x,z]}
 th=0;x=0;z=0;for(let i=mid;i>0;i--){const s=-D5_SH.half+(i-.5)*h;th-=kap(s)*h/2;x-=Math.cos(th)*h;z-=Math.sin(th)*h;th-=kap(s)*h/2;pts[i-1]=[x,z]}
 return (D5_PROF[key]=pts)}
// The point of the bent sheet at (u across, v along): x and z from the profile, y = v.
function D5_sheet(u,v,k,shape){const pr=D5_profile(k,shape),f=(u+D5_SH.half)/(2*D5_SH.half)*D5_SH.N,i=clamp(Math.floor(f),0,D5_SH.N-1),t=f-i,a=pr[i],b=pr[i+1];return [lerp(a[0],b[0],t),v,lerp(a[1],b[1],t)]}
function D5_sheetMeasure(k,shape){
 const A=D5_SH.A,B=D5_SH.B,path=range(401).map(i=>D5_sheet(lerp(A[0],B[0],i/400),lerp(A[1],B[1],i/400),k,shape));
 const inside=D5_plen(path),air=D5_len(D5_sub(D5_sheet(...B,k,shape),D5_sheet(...A,k,shape))),flat=Math.hypot(B[0]-A[0],B[1]-A[1]);
 // Principal curvatures at the point (u0, 1.5), measured from three nearby points along each direction.
 const u0=shape==='wave'?0:.5,h=.02,ka=D5_curv3(D5_sheet(u0-h,1.5,k,shape),D5_sheet(u0,1.5,k,shape),D5_sheet(u0+h,1.5,k,shape)),kb=D5_curv3(D5_sheet(u0,1.5-h,k,shape),D5_sheet(u0,1.5,k,shape),D5_sheet(u0,1.5+h,k,shape));
 return {path,inside,air,flat,ka,kb,K:ka*kb}}
SCENE({id:'theorema-egregium',name:'Bend a sheet, keep its distances',tag:'Gauss, Disquisitiones generales, 1827',
 definition:'At each point a surface bends most in one direction and least in the direction at right angles: these are its two principal curvatures. Their product is the Gaussian curvature K. In 1827 Gauss proved that K can be found from distances measured within the surface alone. He called this his “theorema egregium”, the remarkable theorem.',
 get example(){const m=D5_sheetMeasure(1,'roll');return `Roll a sheet of paper into part of a tube of radius 1. Across, it curves by 1/radius = ${D5_n(m.ka)}; along the tube it stays straight, 0. So K = ${D5_n(m.ka)} × 0 = 0, exactly as for the flat sheet, and no distance within the paper has changed: A to B is still ${D5_n(m.inside)} along the paper, though only ${D5_n(m.air)} straight through the air. This is why a slice of pizza curved across stops drooping: K must stay 0, so it cannot also bend along its length.`},
 desc:'A sheet bent across its width, seen end on with its circle of curvature, beside the same sheet unrolled flat with a path from A to B. Tiles show the two curvatures measured at one point, their product, and the length from A to B within the sheet and through the air.',
 research:['Gauss (1828). Disquisitiones generales circa superficies curvas. Commentationes Societatis Regiae Scientiarum Gottingensis Recentiores 6 (presented October 1827): the theorema egregium, article 12.','The sheet is built by integrating its bending along its width, so it is never stretched. Curvatures are measured from three nearby points of the drawn sheet, and lengths as sums of 400 short chords.'],
 dur:12,hint:'Bend the sheet with the slider, or choose a wavy bend. The two curvatures, their product and the length from A to B are measured on the bent sheet each time. Switch to 3D to turn it.',
 init:()=>({k:8,shape:'roll'}),
 watch:p=>p<.6?{k:Math.round(15*Math.sin(D5_PI*Math.min(1,p/.55))),shape:'roll'}:{k:Math.round(10*smooth((p-.6)/.3)),shape:'wave'},
 ui:[{range:'k',label:'Bend',min:0,max:15,get:s=>s.k,act:'k',show:v=>D5_n(v/10,1)},{choose:[['roll','Roll it'],['wave','Make it wavy']],label:'Shape',get:s=>s.shape,act:'shape'}],
 on:{k(s,v){s.k=clamp(Math.round(+v),0,15)},shape(s,v){s.shape=v==='wave'?'wave':'roll'}},
 draw(s){
  const k=s.k/10,m=D5_sheetMeasure(k,s.shape),pr=D5_profile(k,s.shape);
  let out=heading(k===0?'A flat sheet: K = 0':`Bent, yet K = ${D5_n(m.K)}: no distance changed`);
  // end-on view
  out+=R(18,48,282,206,'#fff',C.grid,8)+TF(30,68,'end on: the sheet’s cross-section',13,C.muted,'start');
  const ex=159,ez=196,sc=52,E=p=>[ex+p[0]*sc,ez-p[1]*sc];
  out+=D5_poly(pr.filter((_,i)=>i%4===0).map(E),C.blue,4);
  if(s.shape==='roll'&&k>.3){const r=1/k,c=E([0,r]);out+=`<clipPath id="d5ce"><rect x="20" y="76" width="278" height="176"/></clipPath>`+G(Ci(c[0],c[1],r*sc,'none',C.coral,D5_dash+' stroke-width="1.6"')+L(c[0],c[1],ex,ez,C.coral,1.6),'clip-path="url(#d5ce)"')+TF(ex,ez+24,'dashed circle: radius 1/κ = '+D5_n(r),13,C.coral)}
  const ua=E(D5_sheet(D5_SH.A[0],0,k,s.shape).filter((_,i)=>i!==1)),ub=E(D5_sheet(D5_SH.B[0],0,k,s.shape).filter((_,i)=>i!==1));
  out+=Ci(ua[0],ua[1],6,C.green)+TBF(ua[0]-12,ua[1]-6,'A',14,C.green,'end')+Ci(ub[0],ub[1],6,C.purple)+TBF(ub[0]+12,ub[1]-6,'B',14,C.purple,'start');
  // unrolled
  const x0=332,y0=74,us=50;out+=R(316,48,266,206,'#fff',C.grid,8)+TF(328,68,'the same sheet, unrolled',13,C.muted,'start');
  const U=(u,v)=>[x0+(u+D5_SH.half)*us,y0+12+(D5_SH.len-v)*us];
  out+=R(x0,y0+12,4*us,3*us,C.pale,C.line,0);
  for(let u=-1;u<=1;u++)out+=L(...U(u,0),...U(u,3),'#fff',1.2);
  const pa=U(...D5_SH.A),pb=U(...D5_SH.B);out+=L(pa[0],pa[1],pb[0],pb[1],C.coral,3)+Ci(pa[0],pa[1],6,C.green)+Ci(pb[0],pb[1],6,C.purple)+TBF(pa[0]-10,pa[1]+5,'A',14,C.green,'end')+TBF(pb[0]+10,pb[1]+5,'B',14,C.purple,'start');
  out+=TF(449,y0+180,'across ↔ bent · along ↕ straight',13,C.muted);
  out+=D5_tile(18,266,134,'Curvature across',D5_n(m.ka),C.coral)+D5_tile(160,266,134,'Curvature along',D5_n(m.kb),C.ink)+D5_tile(302,266,134,'K = product',D5_n(m.K),C.green)+D5_tile(444,266,138,'A to B in the sheet',D5_n(m.inside),C.coral);
  out+=TF(300,336,`Straight through the air from A to B: ${D5_n(m.air)} (the unrolled sheet says ${D5_n(m.flat)})`,13,C.ink);
  out+=D5_note('Curvatures measured on the drawn sheet at one point; lengths summed along it.',360);
  return {svg:out,phase:k===0?`Flat: both curvatures are 0, so K = 0. The path from A to B is ${D5_n(m.inside)} long.`:
   `${s.shape==='wave'?'Waved':'Rolled'} across, the sheet curves by ${D5_n(m.ka)} there but stays straight along its length, so K = ${D5_n(m.ka)} × ${D5_n(m.kb)} = ${D5_n(m.K)}. Measured within the sheet, A to B is still ${D5_n(m.inside)}; only the short cut through the air (${D5_n(m.air)}) changed, and an ant on the paper cannot take that. Gauss’s theorem says K is the part of bending an inhabitant can detect, and here there is none.`};
 },
 three(s){
  const k=s.k/10,m=D5_sheetMeasure(k,s.shape),Pr=makeProject([-2.1,2.1,0,3,-1.2,2.8]);let out='';
  for(let i=0;i<=8;i++){const u=-2+i*.5;out+=D5_poly(range(13).map(j=>Pr(D5_sheet(u,j*.25,k,s.shape))),C.line,1.3)}
  for(let j=0;j<=6;j++){const v=j*.5;out+=D5_poly(range(41).map(i=>Pr(D5_sheet(-2+i*.1,v,k,s.shape))),j===0||j===6?C.blue:C.line,j===0||j===6?2.4:1.3)}
  out+=D5_poly(m.path.filter((_,i)=>i%10===0).map(Pr),C.coral,3);
  const a=Pr(D5_sheet(...D5_SH.A,k,s.shape)),b=Pr(D5_sheet(...D5_SH.B,k,s.shape));
  out+=L(a[0],a[1],b[0],b[1],C.muted,1.6,D5_dash)+Ci(a[0],a[1],6,C.green)+Ci(b[0],b[1],6,C.purple)+TF(a[0]-12,a[1],'A',14,C.green,'end')+TF(b[0]+12,b[1],'B',14,C.purple,'start');
  return {svg:out,title:'The bent sheet in space',caption:`The coral path lies in the sheet and is ${D5_n(m.inside)} long whatever the bend; the dashed chord through the air is ${D5_n(m.air)}.`};
 }});

// The quadratic surface z = ½(a x² + b y²), turned by ψ in the plane: its Hessian H = R(ψ) diag(a, b) R(ψ)ᵀ.
function D5_hess(a,b,psi){const c=Math.cos(psi/D5_DEG),s=Math.sin(psi/D5_DEG);return {xx:a*c*c+b*s*s,yy:a*s*s+b*c*c,xy:(a-b)*c*s}}
const D5_kn=(H,th)=>{const c=Math.cos(th),s=Math.sin(th);return H.xx*c*c+2*H.xy*c*s+H.yy*s*s};
function D5_patch(s){
 const a=s.a/4,b=s.b/4,H=D5_hess(a,b,s.psi),m=(H.xx+H.yy)/2,r=Math.hypot((H.xx-H.yy)/2,H.xy),k1=m+r,k2=m-r;
 // Normal curvature scanned every half degree: its largest and smallest values.
 let mx=-1e9,mn=1e9,tmx=0,tmn=0;for(let i=0;i<360;i++){const th=i/360*D5_PI,v=D5_kn(H,th);if(v>mx){mx=v;tmx=th}if(v<mn){mn=v;tmn=th}}
 // Gauss's own definition: area swept by the unit normals over a tiny patch, divided by the patch's area.
 const h=1e-3,N=(x,y)=>D5_unit([-(H.xx*x+H.xy*y),-(H.xy*x+H.yy*y),1]),n0=N(0,0),gx=D5_sub(N(h,0),n0),gy=D5_sub(N(0,h),n0),gauss=D5_dot(D5_cross(gx,gy),n0)/(h*h);
 const K=H.xx*H.yy-H.xy*H.xy;
 return {a,b,H,k1,k2,K,mx,mn,tmx,tmn,gauss,kind:Math.abs(K)<1e-9?(Math.abs(k1)<1e-9&&Math.abs(k2)<1e-9?'flat':'cylinder'):K>0?'dome':'saddle'}}
const D5_KIND={flat:'flat: no bending',cylinder:'bent one way only',dome:'a dome or bowl',saddle:'a saddle'};
SCENE({id:'theorema-egregium-curvatures',name:'Two curvatures and their product',tag:'Euler 1760, Gauss 1827',
 definition:'Cut a surface with planes that contain its normal at a point, and each cut is a curve with its own curvature. Euler showed in 1760 that as the cutting plane turns, this curvature swings between a largest and a smallest value, the principal curvatures k₁ and k₂, in directions at right angles. Gauss took their product K = k₁k₂, and also gave it a second meaning: how much area the surface’s normals sweep out, per unit of area.',
 example:'A dome has both curvatures of one sign, so K > 0. A saddle bends up one way and down the other, so K < 0. A cylinder bends one way only, so one curvature is 0 and so is K. Turning the surface changes neither curvature: they belong to the shape, not to the axes.',
 desc:'A contour map of a small surface patch with the cutting direction marked, the profile of the cut with its circle of curvature, and a graph of the cut’s curvature as the direction turns, with the largest and smallest values marked. Tiles give k₁, k₂, their product and Gauss’s normal-area ratio.',
 research:['Euler (1760, printed 1767). Recherches sur la courbure des surfaces. Mémoires de l’Académie des Sciences de Berlin 16: the curvature of normal sections and its two extreme values at right angles.','Gauss (1828). Disquisitiones generales circa superficies curvas: the curvature measure defined by the area of the normals on the sphere.','Here k₁ and k₂ come from the eigenvalues of the surface’s second derivatives, the largest and smallest come from scanning the cut every half degree, and Gauss’s ratio from the normals over a patch 0.001 wide.'],
 dur:12,hint:'Set how much the surface bends along its two axes (negative bends down), turn the whole surface, and turn the cutting direction. Watch the cut’s curvature pass through k₁ and k₂.',
 init:()=>({a:4,b:-2,psi:30,th:20}),
 watch:p=>{const ph=Math.min(2,Math.floor(p*3)),u=p*3-ph;return [{a:4,b:2,psi:0,th:Math.round(180*u)},{a:4,b:-3,psi:30,th:Math.round(180*u)},{a:4,b:0,psi:60,th:Math.round(180*u)}][ph]},
 ui:[{range:'a',label:'Bend along axis 1',min:-4,max:4,get:s=>s.a,act:'a',show:v=>D5_n(v/4)},{range:'b',label:'Bend along axis 2',min:-4,max:4,get:s=>s.b,act:'b',show:v=>D5_n(v/4)},
  {range:'psi',label:'Turn the surface',min:0,max:90,step:15,get:s=>s.psi,act:'psi',show:v=>v+'°'},{range:'th',label:'Cutting direction',min:0,max:180,step:5,get:s=>s.th,act:'th',show:v=>v+'°'}],
 on:{a(s,v){s.a=clamp(Math.round(+v),-4,4)},b(s,v){s.b=clamp(Math.round(+v),-4,4)},psi(s,v){s.psi=clamp(Math.round(+v/15)*15,0,90)},th(s,v){s.th=clamp(Math.round(+v/5)*5,0,180)}},
 draw(s){
  const m=D5_patch(s),H=m.H,th=s.th/D5_DEG,kn=D5_kn(H,th);
  let out=heading(`K = k₁ × k₂ = ${D5_n(m.k1)} × ${D5_n(m.k2)} = ${D5_n(m.K)}: ${D5_KIND[m.kind]}`);
  // contour map
  const cx=136,cy=168,rr=104;out+=Ci(cx,cy,rr,'#fbfcfd',C.grid)+TF(cx-rr,58,'height map, seen from above',13,C.muted,'start');
  for(const c of [-.4,-.22,-.08,.08,.22,.4]){let run=[],o='';const flush=()=>{if(run.length>1)o+=D5_poly(run,c>0?C.coral:C.blue,1.8,c>0?'':'stroke-dasharray="4 3"');run=[]};
   for(let i=0;i<=720;i++){const ph=i/720*2*D5_PI,q=D5_kn(H,ph);let ok=false;if(q/c>0){const r=Math.sqrt(2*c/q);if(r<=1){ok=true;run.push([cx+r*rr*Math.cos(ph),cy-r*rr*Math.sin(ph)])}}if(!ok)flush()}flush();out+=o}
  const ex=Math.cos(th),ey=Math.sin(th);out+=L(cx-ex*rr,cy+ey*rr,cx+ex*rr,cy-ey*rr,C.ink,2.4)+Ci(cx,cy,4,C.ink);
  if(Math.abs(m.k1-m.k2)>1e-9)for(const t of [m.tmx,m.tmn])out+=L(cx-Math.cos(t)*rr,cy+Math.sin(t)*rr,cx+Math.cos(t)*rr,cy-Math.sin(t)*rr,C.green,1.4,'stroke-dasharray="2 4"');
  out+=TF(cx-rr,292,'solid coral: above the tangent plane',13,C.coral,'start')+TF(cx-rr,308,'dashed blue: below · dotted: k₁, k₂',13,C.blue,'start');
  // profile of the cut
  const px=278,py=52,pw=150,ph=118,pcx=px+pw/2,pcy=py+70,psc=62;out+=R(px,py,pw,ph,'#fff',C.grid,8)+TF(px+6,py+16,'the cut at '+s.th+'°',13,C.muted,'start');
  out+=L(px+8,pcy,px+pw-8,pcy,C.grid,1.2)+D5_poly(range(41).map(i=>{const t=-1.1+i*2.2/40;return [pcx+t*psc,pcy-.5*kn*t*t*psc]}).filter(q=>q[1]>py+20&&q[1]<py+ph-4),C.ink,2.6);
  if(Math.abs(kn)>.3){const r=1/Math.abs(kn)*psc,cc=pcy-Math.sign(kn)*r;out+=`<clipPath id="d5cl"><rect x="${px}" y="${py+20}" width="${pw}" height="${ph-22}"/></clipPath>`+Ci(pcx,cc,r,'none',C.coral,D5_dash+' clip-path="url(#d5cl)"')}
  out+=TBF(px+pw/2,py+ph+18,'curvature '+D5_n(kn),13,C.coral);
  // curvature against direction
  const gx=446,gy=52,gw=136,gh=118,kmax=1.05,Y=v=>gy+gh/2-v/kmax*(gh/2-8),Xg=t=>gx+8+t/D5_PI*(gw-16);
  out+=R(gx,gy,gw,gh,'#fff',C.grid,8)+L(gx+6,Y(0),gx+gw-6,Y(0),C.grid,1.2)+D5_poly(range(91).map(i=>{const t=i/90*D5_PI;return [Xg(t),Y(D5_kn(H,t))]}),C.blue,2.2);
  out+=Ci(Xg(th),Y(kn),5,C.coral)+Ci(Xg(m.tmx),Y(m.mx),4,C.green)+Ci(Xg(m.tmn),Y(m.mn),4,C.green);
  out+=TF(gx+gw/2,gy+ph+18,'curvature as the cut turns',13,C.muted);
  out+=TF(px,214,`largest found: ${D5_n(m.mx,3)}`,13,C.green,'start')+TF(px,232,`smallest found: ${D5_n(m.mn,3)}`,13,C.green,'start')+TF(px,250,Math.abs(m.k1-m.k2)>1e-9?`at right angles: ${D5_n(Math.abs(D5_angBetween(m.tmx,m.tmn))*D5_DEG,1)}°`:'equal in every direction',13,C.green,'start');
  out+=D5_tile(278,272,96,'k₁',D5_n(m.k1),C.coral)+D5_tile(382,272,96,'k₂',D5_n(m.k2),C.blue)+D5_tile(486,272,96,'K = k₁k₂',D5_n(m.K),C.ink);
  out+=TF(430,340,`Gauss’s normal-area ratio: ${D5_n(m.gauss,3)}`,13,C.ink);
  out+=D5_note('A patch 2 units wide around one point; heights from z = ½(k₁u² + k₂v²).',362);
  return {svg:out,phase:`Cut at ${s.th}°, the surface curves by ${D5_n(kn)}. Scanning every direction, the largest and smallest values found are ${D5_n(m.mx,3)} and ${D5_n(m.mn,3)}, which match k₁ = ${D5_n(m.k1,3)} and k₂ = ${D5_n(m.k2,3)}${Math.abs(m.k1-m.k2)>1e-9?', and they lie at right angles, as Euler found':'; here every direction bends equally, so no direction is special'}. ${m.kind==='saddle'?'One is positive and one negative, so K is negative: a saddle.':m.kind==='dome'?'Both have the same sign, so K is positive: a dome or bowl.':m.kind==='cylinder'?'One of them is 0, so K is 0, like a cylinder.':'Both are 0: the patch is flat.'} Turning the surface moves the directions, not the values.`};
 }});

// A polar cap of angular radius α on the unit sphere: its radius measured within the sphere is α, and its rim is
// measured as the sum of 720 short chords. A flat disc of the same radius would need a rim of 2πα.
function D5_cap(al){const a=al/D5_DEG,rim=range(721).map(i=>[Math.sin(a)*Math.cos(i/720*2*D5_PI),Math.sin(a)*Math.sin(i/720*2*D5_PI),Math.cos(a)]),C1=D5_plen(rim),flat=2*D5_PI*a;
 // area of the cap, by summing thin rings (numerical integral of 2π sin θ dθ)
 let A=0;for(let i=0;i<400;i++){const t=(i+.5)/400*a;A+=2*D5_PI*Math.sin(t)*a/400}
 return {a,rim:C1,flat,gap:2*D5_PI-C1/a,stretch:flat/C1-1,area:A}}
const D5_EARTH=6371; // mean radius of the Earth, km
SCENE({id:'theorema-egregium-map',name:'No flat map keeps every distance',tag:'Why every world map distorts',
 definition:'A sphere of radius r has K = 1/r² at every point, and a flat sheet has K = 0. By Gauss’s theorem a map that kept every distance true would keep K too, so no such map of any part of a sphere exists. An inhabitant can check this: on a sphere the rim of a circle is shorter than 2π times its radius, so a flattened cap must tear or stretch.',
 get example(){const c=D5_cap(1000/D5_EARTH*D5_DEG);return `On the Earth (mean radius ${D5_EARTH} km) a circle of radius 1000 km, measured along the ground, has a rim ${D5_n(c.flat*D5_EARTH-c.rim*D5_EARTH,1)} km shorter than a flat circle of that radius. Pressed flat, that cap opens a gap of ${D5_d(c.gap,2)}, or its rim must stretch by ${D5_n(100*c.stretch,2)}%. Euler had shown in 1777 that no map of a sphere can keep all distances; Gauss’s theorem explains why.`},
 desc:'A sphere with a polar cap marked, its radius drawn along the surface, beside the cap pressed flat: either as a disc with a wedge-shaped gap, or as a full disc whose rim must stretch. Tiles show the radius, the measured rim, the rim a flat disc would need, and the gap or stretch.',
 research:['Euler (1777, printed 1778). De repraesentatione superficiei sphaericae super plano. Acta Academiae Scientiarum Petropolitanae: no map of the sphere onto the plane keeps all distances.','Gauss (1828), as above: a surface can be laid on another without stretching only if their curvatures agree point by point.','The rim is measured as 720 short chords around the drawn cap; the cap’s area as a sum of 400 thin rings.'],
 dur:10,hint:'Make the cap larger or smaller, and choose whether to flatten it by cutting a gap or by stretching the rim. Tiny caps are nearly flat; large ones cannot be flattened without large damage.',
 init:()=>({al:50,mode:'gap'}),
 watch:p=>({al:Math.round(5+85*smooth(p<.5?p*2:1)),mode:p<.6?'gap':'stretch'}),
 ui:[{range:'al',label:'Cap size',min:5,max:90,step:5,get:s=>s.al,act:'al',show:v=>v+'°'},{choose:[['gap','Cut a gap'],['stretch','Stretch the rim']],label:'Flatten by',get:s=>s.mode,act:'mode'}],
 on:{al(s,v){s.al=clamp(Math.round(+v/5)*5,5,90)},mode(s,v){s.mode=v==='stretch'?'stretch':'gap'}},
 draw(s){
  const c=D5_cap(s.al),cx=150,cy=172,rr=96,V=D5_view(22,-30,cx,cy,rr);
  let out=heading(s.mode==='gap'?`Pressed flat, a gap of ${D5_d(c.gap)} opens`:`Pressed flat, the rim must stretch ${D5_n(100*c.stretch,1)}%`);
  out+=D5_globe(V,cx,cy,rr);
  // cap: filled region drawn as the rim curve, plus a meridian radius
  const rimPts=range(181).map(i=>[Math.sin(c.a)*Math.cos(i/180*2*D5_PI),Math.sin(c.a)*Math.sin(i/180*2*D5_PI),Math.cos(c.a)]);
  out+=D5_sphCurve(rimPts,V,C.coral,3)+D5_sphCurve(range(31).map(i=>{const t=i/30*c.a;return [Math.sin(t)*Math.cos(-.5),Math.sin(t)*Math.sin(-.5),Math.cos(t)]}),V,C.blue,3);
  const np=V([0,0,1]);out+=Ci(np[0],np[1],4,C.ink)+TF(cx,cy+rr+20,'cap on a sphere of radius 1',13,C.muted);
  // flattened
  const fx=446,fy=150,sc=70/1.5708*1.2;
  const rpx=c.a*sc;
  if(s.mode==='gap'){const sweep=c.rim/c.a,a0=-D5_PI/2+(2*D5_PI-sweep)/2,a1=a0+sweep,pt=t=>[fx+rpx*Math.cos(t),fy+rpx*Math.sin(t)];
   const p0=pt(a0),p1=pt(a1);out+=P(`M${fmt(fx)} ${fmt(fy)} L${fmt(p0[0])} ${fmt(p0[1])} A${fmt(rpx)} ${fmt(rpx)} 0 ${sweep>D5_PI?1:0} 1 ${fmt(p1[0])} ${fmt(p1[1])} Z`,C.coral,2.4,C.coralp);
   out+=L(fx,fy,fx,fy-rpx,C.ink,1.4,'stroke-dasharray="3 3"');
   const g=fy-rpx-10;out+=TBF(fx,Math.max(64,g),`gap ${D5_d(c.gap)}`,13,C.ink);}
  else{out+=Ci(fx,fy,rpx,C.coralp,C.coral,'stroke-width="4" stroke-dasharray="7 3"')+TF(fx,fy+rpx+18,'rim stretched',13,C.coral)}
  out+=L(fx,fy,fx+rpx*Math.cos(.5),fy+rpx*Math.sin(.5),C.blue,3)+Ci(fx,fy,4,C.ink)+TF(fx,282,'the cap pressed flat, same radius',13,C.muted);
  out+=D5_tile(18,296,140,'Radius in the surface',D5_n(c.a,3),C.blue)+D5_tile(164,296,130,'Rim measured',D5_n(c.rim,3),C.coral)+D5_tile(300,296,140,'Flat rim 2π × radius',D5_n(c.flat,3),C.ink)+D5_tile(446,296,136,s.mode==='gap'?'Gap':'Stretch',s.mode==='gap'?D5_d(c.gap):D5_n(100*c.stretch,1)+'%',C.coral);
  out+=D5_note(`Cap area ${D5_n(c.area,3)}; K = 1 everywhere on this sphere.`,362);
  return {svg:out,phase:`Within the sphere the cap’s radius is ${D5_n(c.a,3)}, yet its rim, measured as short chords, is only ${D5_n(c.rim,3)}: less than the ${D5_n(c.flat,3)} a flat disc of that radius has. ${s.mode==='gap'?`Laid flat without stretching, the cap covers only ${D5_d(c.rim/c.a)} of the full 360°, leaving a gap of ${D5_d(c.gap)}.`:`Laid flat as a whole disc, the rim must stretch by ${D5_n(100*c.stretch,1)}%, and the parts near the centre less.`} Every flat map of the Earth makes this trade somewhere.`};
 }});

/* ===================== Lesson: non-euclidean ===================== */
// The Poincaré disc of curvature −1. The line L is the horizontal diameter; P sits at height t above its centre.
// A line through P is the geodesic through P in a chosen direction: the image of a diameter under the Möbius map
// that moves the centre to P. It meets L if one of its ends on the rim lies below L.
function D5_par(t,beta){
 const P=[0,t],d=D5_hd([0,0],P),dir=(-90+beta)/D5_DEG,u=[Math.cos(dir),Math.sin(dir)];
 const ends=[D5_Ti(P,u),D5_Ti(P,[-u[0],-u[1]])],low=Math.min(ends[0][1],ends[1][1]);
 const pts=range(81).map(i=>D5_Ti(P,[u[0]*(-.9995+i*1.999/80),u[1]*(-.9995+i*1.999/80)]));
 // where it crosses L: bisection on the half that goes down
 let hit=null;if(low<-1e-9){const sg=ends[0][1]<ends[1][1]?1:-1;let a=0,b=.99999;for(let i=0;i<60;i++){const m=(a+b)/2,q=D5_Ti(P,[sg*u[0]*m,sg*u[1]*m]);if(q[1]>0)a=m;else b=m}hit=D5_Ti(P,[sg*u[0]*a,sg*u[1]*a])}
 // limiting parallels: the lines from P to the ends of L at (±1, 0); their angle from the perpendicular to L
 const lim=D5_T(P,[1,0]),Pi=D5_angBetween(Math.atan2(lim[1],lim[0]),-D5_PI/2),formula=2*Math.atan(Math.exp(-d));
 const kind=Math.abs(Math.abs(beta)-Pi*D5_DEG)<.5?'limit':low<0?'meets':'misses';
 return {P,d,pts,hit,Pi,formula,kind,hitDist:hit?D5_hd(P,hit):0}}
SCENE({id:'non-euclidean',name:'Many parallels through one point',tag:'Lobachevsky 1829, Bolyai 1832',
 definition:'Euclid’s fifth postulate is equivalent to this: through a point off a line exactly one line never meets it. For two thousand years mathematicians tried to prove it from the other axioms. Nikolai Lobachevsky (1829) and János Bolyai (1832) instead built a consistent geometry in which it fails: through P there are infinitely many lines that never meet L. Gauss had reached similar ideas but never published them.',
 example:'Two limiting lines through P separate the lines that meet L from those that do not. Their angle with the perpendicular, the angle of parallelism, depends on P’s distance d from L: Lobachevsky found tan(Π/2) = e^(−d). Close to L it is nearly 90°, as in Euclid’s plane; far away it shrinks towards 0°.',
 desc:'A Poincaré disc in which lines are arcs meeting the rim at right angles. A horizontal line L, a point P above it, the two limiting parallels through P, and a chosen line through P that either meets L or never does. Tiles give the distance from P to L and the angle of parallelism, measured and from Lobachevsky’s formula.',
 research:['Lobachevsky (1829–30). O nachalakh geometrii (On the principles of geometry). Kazanskii Vestnik.','Bolyai, János (1832). Appendix scientiam spatii absolute veram exhibens, printed with his father Farkas Bolyai’s Tentamen.','Saccheri (1733). Euclides ab omni naevo vindicatus: tried to prove the postulate by contradiction and derived many hyperbolic results without accepting them.','Gauss, letter to Farkas Bolyai (6 March 1832): he said he had found much the same results earlier and not published them.'],
 dur:12,hint:'Move P away from L and turn the line through P. A line that meets L turns coral; one that never does turns purple. Compare the measured angle of parallelism with Lobachevsky’s formula.',
 init:()=>({t:5,beta:40}),
 watch:p=>({t:p<.5?5:Math.round(2+6*smooth((p-.5)*2)),beta:p<.5?Math.round(-85+170*p*2):40}),
 ui:[{range:'t',label:'P’s height',min:1,max:9,get:s=>s.t,act:'t',show:v=>D5_n(2*Math.atanh(v/10))},{range:'beta',label:'Turn the line',min:-89,max:89,get:s=>s.beta,act:'beta',show:v=>v+'°'}],
 on:{t(s,v){s.t=clamp(Math.round(+v),1,9)},beta(s,v){s.beta=clamp(Math.round(+v),-89,89)}},
 draw(s){
  const m=D5_par(s.t/10,s.beta),cx=172,cy=206,rr=150,S=z=>[cx+z[0]*rr,cy-z[1]*rr];
  let out=heading(m.kind==='meets'?'This line through P meets L':m.kind==='limit'?'A limiting parallel: it meets L only at the rim':'This line through P never meets L');
  out+=Ci(cx,cy,rr,'#f7fafc',C.line);
  // the wedge of lines that meet L
  const wedge=[];for(let i=0;i<=24;i++){const b=-m.Pi+i/24*2*m.Pi,dir=-D5_PI/2+b;wedge.push(S(D5_Ti(m.P,[Math.cos(dir)*.18,Math.sin(dir)*.18])))}
  out+=D5_poly([S(m.P)].concat(wedge),'none',0,'',C.coralp,true);
  out+=L(cx-rr,cy,cx+rr,cy,C.blue,3.4)+TBF(cx+rr-14,cy+20,'L',15,C.blue);
  for(const e of [[1,0],[-1,0]])out+=D5_poly(D5_hgeo(m.P,e,40).map(S),C.green,2,D5_dash);
  out+=L(...S(m.P),cx,cy,C.muted,1.2,'stroke-dasharray="2 3"');
  out+=D5_poly(m.pts.map(S),m.kind==='meets'?C.coral:m.kind==='limit'?C.green:C.purple,3.2);
  if(m.hit){const h=S(m.hit);out+=Ci(h[0],h[1],6,C.coral,'#fff')}
  const pp=S(m.P);out+=Ci(pp[0],pp[1],7,C.ink,'#fff')+TBF(pp[0]+12,pp[1]-8,'P',15,C.ink,'start');
  out+=TF(cx,cy+rr+18,'Poincaré disc: lines are arcs at right angles to the rim',13,C.muted);
  // readouts
  const x0=346;out+=D5_tile(x0,52,236,'Distance d from P to L',D5_n(m.d),C.ink);
  out+=D5_tile(x0,106,116,'Π measured',D5_d(m.Pi),C.green)+D5_tile(x0+120,106,116,'2·arctan e^(−d)',D5_d(m.formula),C.green);
  out+=D5_tile(x0,160,236,'Your line, at '+s.beta+'°',m.kind==='meets'?`meets L, ${D5_n(m.hitDist)} from P`:m.kind==='limit'?'limiting parallel':'never meets L',m.kind==='meets'?C.coral:m.kind==='limit'?C.green:C.purple);
  out+=TF(x0,232,'Shaded at P: directions that meet L.',13,C.ink,'start')+TF(x0,250,'In Euclid’s plane only 90° misses.',13,C.ink,'start');
  const ev=[['c. 300 BC','Euclid’s Elements'],['1733','Saccheri'],['1829','Lobachevsky'],['1832','Bolyai'],['1868','Beltrami’s model']];
  ev.forEach((e,i)=>{const y=278+i*17;out+=TBF(x0,y,e[0],13,C.ink,'start')+TF(x0+78,y,e[1],13,C.muted,'start')});
  return {svg:out,phase:`P is ${D5_n(m.d)} from L. The two limiting parallels leave P at ${D5_d(m.Pi)} on either side of the perpendicular; Lobachevsky’s formula 2·arctan e^(−d) gives ${D5_d(m.formula)}. ${m.kind==='meets'?`Your line, at ${s.beta}°, lies inside that wedge and meets L ${D5_n(m.hitDist)} from P.`:m.kind==='limit'?'Your line is one of the limiting parallels: it approaches L for ever and meets it only at the rim, which is not part of the plane.':`Your line, at ${s.beta}°, lies outside the wedge: it never meets L, however far it is extended. All of these lines are parallel to L.`}`};
 }});

// Triangles in three geometries. Angles come from the directions of the drawn sides; areas are integrated directly:
// on the disc by mapping to the Klein model (where sides are straight) and integrating (1 − |k|²)^(−3/2) over
// small triangles, split until the sum settles; on the sphere by summing 4096 small flat triangles pushed out onto
// it (with 1024 as well, extrapolated to fine pieces).
const D5_DISC_PTS=[[0,0]].concat(...[.3,.5,.66,.78,.87].map(r=>range(12).map(i=>[r*Math.cos(i*D5_PI/6+D5_PI/2),r*Math.sin(i*D5_PI/6+D5_PI/2)])));
const D5_SPH_PTS=[].concat(...[-30,0,30,60].map(la=>[-60,-30,0,30,60].map(lo=>D5_ll(la,lo)))).concat([D5_ll(90,0)]);
const D5_klein=p=>{const q=1+p[0]*p[0]+p[1]*p[1];return [2*p[0]/q,2*p[1]/q]};
function D5_triGrid(a,b,c,n,f){// sum of f(centroid)·area over the n² small triangles of a barycentric grid (2D or 3D points)
 const pt=(i,j)=>a.map((v,k)=>v+(b[k]-v)*i/n+(c[k]-v)*j/n);let s=0;
 for(let i=0;i<n;i++)for(let j=0;j<n-i;j++){s+=f(pt(i,j),pt(i+1,j),pt(i,j+1));if(i+j<n-1)s+=f(pt(i+1,j),pt(i+1,j+1),pt(i,j+1))}return s}
// Hyperbolic area of a triangle given by its Klein-model corners: (1 − |k|²)^(−3/2) integrated by adaptive subdivision
// (each triangle split in four until the estimate settles; three-point rule at the side midpoints).
function D5_hArea(a,b,c){const f=m=>Math.pow(Math.max(1e-12,1-m[0]*m[0]-m[1]*m[1]),-1.5),mid=(u,v)=>[(u[0]+v[0])/2,(u[1]+v[1])/2],
  ar=(u,v,w)=>Math.abs((v[0]-u[0])*(w[1]-u[1])-(w[0]-u[0])*(v[1]-u[1]))/2,est=(u,v,w)=>ar(u,v,w)*(f(mid(u,v))+f(mid(v,w))+f(mid(w,u)))/3;
 const go=(u,v,w,e,tol,d)=>{const uv=mid(u,v),vw=mid(v,w),wu=mid(w,u),k=[[u,uv,wu],[uv,v,vw],[wu,vw,w],[uv,vw,wu]],es=k.map(t=>est(...t)),s=es[0]+es[1]+es[2]+es[3];
  return d>12||Math.abs(s-e)<tol?s+(s-e)/15:k.reduce((acc,t,i)=>acc+go(...t,es[i],tol/2.5,d+1),0)};
 return go(a,b,c,est(a,b,c),1e-5,0)}
const D5_TRI={};
function D5_tri(model,ids){const key=model+ids.join(',');if(D5_TRI[key])return D5_TRI[key];let r;
 if(new Set(ids).size<3)r={deg:true};
 else if(model==='sphere'){const V=ids.map(i=>D5_SPH_PTS[i]),ang=V.map((A,i)=>{const B=V[(i+1)%3],Cc=V[(i+2)%3],tb=D5_unit(D5_sub(B,D5_mul(A,D5_dot(A,B)))),tc=D5_unit(D5_sub(Cc,D5_mul(A,D5_dot(A,Cc))));return Math.acos(clamp(D5_dot(tb,tc),-1,1))});
  const fl=n=>D5_triGrid(V[0],V[1],V[2],n,(p,q,w)=>{const P1=D5_unit(p),Q=D5_unit(q),W=D5_unit(w);return D5_len(D5_cross(D5_sub(Q,P1),D5_sub(W,P1)))/2}),area=(4*fl(64)-fl(32))/3;r={ang,area,K:1}}
 else if(model==='disc'){const V=ids.map(i=>D5_DISC_PTS[i]),ang=V.map((A,i)=>D5_angBetween(D5_hdir(A,V[(i+1)%3]),D5_hdir(A,V[(i+2)%3])));
  r={ang,area:D5_hArea(...V.map(D5_klein)),K:-1}}
 else{const V=ids.map(i=>D5_DISC_PTS[i]),ang=V.map((A,i)=>{const B=V[(i+1)%3],Cc=V[(i+2)%3];return D5_angBetween(Math.atan2(B[1]-A[1],B[0]-A[0]),Math.atan2(Cc[1]-A[1],Cc[0]-A[0]))});
  r={ang,area:Math.abs((V[1][0]-V[0][0])*(V[2][1]-V[0][1])-(V[2][0]-V[0][0])*(V[1][1]-V[0][1]))/2,K:0}}
 if(!r.deg&&r.ang.some(a=>a>D5_PI-1e-6||a<1e-6))r={deg:true,line:true};
 if(!r.deg){r.sum=sum(r.ang);r.ex=r.sum-D5_PI}
 return (D5_TRI[key]=r)}
const D5_TRI_WATCH=[['disc',[0,4,8]],['disc',[13,17,21]],['disc',[49,53,57]],['plane',[13,17,21]],['sphere',[6,8,20]],['sphere',[5,9,20]]];
SCENE({id:'non-euclidean-triangles',name:'Angle sum against area',tag:'Harriot and Girard on the sphere; Lambert, 1766',
 definition:'In Euclid’s plane a triangle’s angles add to 180°. On a sphere of radius 1 they add to more, and the excess, in radians, equals the triangle’s area (Harriot, then Girard 1629). In the hyperbolic plane of curvature −1 they add to less, and the deficit equals the area. Lambert noticed this in 1766 while trying to disprove such a geometry; it means hyperbolic triangles cannot be scaled up without changing shape.',
 example:'A hyperbolic triangle can never have an area above π: its angles cannot sum to less than 0. Small triangles in either curved geometry are nearly Euclidean, with sums close to 180°, which is why the curvature of a large space is hard to see in a small region.',
 desc:'A triangle drawn in the Poincaré disc, on a sphere or in the flat plane, with its three angles marked. Tiles list the angles, their sum, the area integrated over the triangle, and the difference from 180° compared with the area.',
 research:['Girard (1629). Invention nouvelle en l’algèbre: the area of a spherical triangle is its angle excess (Thomas Harriot had found it earlier, unpublished).','Lambert (written 1766, published 1786). Theorie der Parallellinien.','Angles come from the drawn sides’ directions at each corner; areas from direct numerical integration over thousands of small pieces, not from the angle sum.'],
 dur:12,hint:'Choose a geometry, then choose a corner (A, B or C) and press a dot to move it. Compare the sum’s difference from 180° with the integrated area.',
 init:()=>({model:'disc',sel:0,pts:[49,53,57]}),
 watch:p=>{const w=D5_TRI_WATCH[Math.min(5,Math.floor(p*6))];return {model:w[0],sel:0,pts:w[1]}},
 ui:[{choose:[['disc','Hyperbolic'],['plane','Flat'],['sphere','Sphere']],label:'Geometry',get:s=>s.model,act:'model'},{choose:[[0,'Move A'],[1,'Move B'],[2,'Move C']],label:'Corner',get:s=>s.sel,act:'sel'}],
 on:{model(s,v){s.model=['disc','plane','sphere'].includes(v)?v:'disc';s.pts=s.model==='sphere'?[5,9,20]:[49,53,57]},sel(s,v){s.sel=clamp(Math.round(+v),0,2)},
  pick(s,v){const n=s.model==='sphere'?D5_SPH_PTS.length:D5_DISC_PTS.length,i=clamp(Math.round(+v),0,n-1);s.pts=s.pts.slice();s.pts[s.sel]=i;s.sel=(s.sel+1)%3}},
 draw(s,f,X){
  const cx=172,cy=204,rr=148,sph=s.model==='sphere',r=D5_tri(s.model,s.pts),V=sph?D5_view(30,0,cx,cy,rr):null;
  const S=sph?p=>V(p):z=>[cx+z[0]*rr,cy-z[1]*rr],cand=sph?D5_SPH_PTS:D5_DISC_PTS,names=['A','B','C'],cols=[C.green,C.purple,C.amber];
  let out=heading(r.deg?(r.line?'The three corners lie on one line':'Choose three different corners'):`Angles add to ${D5_d(r.sum)}: ${s.model==='disc'?'less':s.model==='sphere'?'more':'exactly'} than 180°`);
  if(sph)out+=D5_globe(V,cx,cy,rr);else if(s.model==='disc')out+=Ci(cx,cy,rr,'#f7fafc',C.line);else out+=R(cx-rr,cy-rr,2*rr,2*rr,'#f7fafc',C.line,4);
  if(!r.deg){const side=(a,b)=>sph?range(41).map(i=>{const t=i/40;return D5_unit(D5_add(D5_mul(a,1-t),D5_mul(b,t)))}):s.model==='disc'?D5_hgeo(a,b,40):range(2).map(i=>[a[0]+(b[0]-a[0])*i,a[1]+(b[1]-a[1])*i]);
   const Vv=s.pts.map(i=>cand[i]),edges=[0,1,2].map(i=>side(Vv[i],Vv[(i+1)%3]));
   out+=D5_poly([].concat(...edges).map(p=>S(p)),C.coral,2.8,'',C.coralp,true);
   Vv.forEach((A,i)=>{const q=S(A),cen=S(sph?D5_unit(D5_add(D5_add(Vv[0],Vv[1]),Vv[2])):[(Vv[0][0]+Vv[1][0]+Vv[2][0])/3,(Vv[0][1]+Vv[1][1]+Vv[2][1])/3]),dx=cen[0]-q[0],dy=cen[1]-q[1],dl=Math.hypot(dx,dy)||1;
    const off=Math.min(30,dl*.5);out+=TBF(q[0]-dx/dl*16,q[1]-dy/dl*16+5,names[i],15,cols[i])+TF(q[0]+dx/dl*off,q[1]+dy/dl*off+5,D5_d(r.ang[i],0),13,C.ink)});
  }
  cand.forEach((p,i)=>{const q=S(p);if(sph&&q[2]<0)return;const on=s.pts.indexOf(i);out+=hit(X,'pick',i,`Put corner ${names[s.sel]} here`,Ci(q[0],q[1],on>=0?7:4,on>=0?cols[on]:'#9fb4c2','#fff'))});
  out+=TF(cx,cy+rr+18,sph?'sphere of radius 1, K = +1':s.model==='disc'?'Poincaré disc, K = −1':'flat plane, K = 0',13,C.muted);
  const x0=346;
  if(!r.deg){r.ang.forEach((a,i)=>{out+=D5_tile(x0+i*80,52,76,'angle '+names[i],D5_d(a),cols[i])});
   out+=D5_tile(x0,106,236,'Sum of the angles',D5_d(r.sum),C.ink);
   out+=D5_tile(x0,160,116,r.ex<0?'180° − sum':'sum − 180°',D5_d(Math.abs(r.ex)),C.coral)+D5_tile(x0+120,160,116,'area (integrated)',D5_n(r.area,3),C.coral);
   out+=TF(x0,232,`area in degrees: ${D5_n(r.area,3)} × 180°/π = ${D5_d(r.area)}`,13,C.ink,'start');
   out+=TF(x0,252,s.model==='disc'?'Hyperbolic: deficit = area':s.model==='sphere'?'Sphere: excess = area':'Flat: no excess at any size',13,C.coral,'start');
   out+=TF(x0,280,'Selected corner: '+names[s.sel],13,cols[s.sel],'start')+TF(x0,298,'Press a dot to move it there.',13,C.muted,'start')}
  return {svg:out,phase:r.deg?(r.line?'All three corners lie on one line (a geodesic), so there is no triangle. Move one of them off it.':'Two corners are on the same dot. Move one of them.'):
   s.model==='plane'?`In the flat plane the angles add to ${D5_d(r.sum)}, whatever the triangle’s size (area ${D5_n(r.area,3)}).`:
   `The angles add to ${D5_d(r.sum)}, ${D5_d(Math.abs(r.ex))} ${r.ex<0?'short of':'more than'} 180°. Integrating over the triangle gives an area of ${D5_n(r.area,3)}, which is ${D5_d(r.area)} in degrees: the same, as Gauss’s curvature ${s.model==='disc'?'−1':'+1'} requires. A bigger triangle has a bigger ${r.ex<0?'deficit':'excess'}.`};
 }});

// Regular tilings {p, q}: p-gons, q at each corner. The central tile has corners at Poincaré radius tanh(R/2), where
// cosh R = cot(π/p)·cot(π/q); every other tile is made by reflecting a tile in one of its sides (inversion in the
// circle through that side that meets the rim at right angles). Tiles too small to see are not generated.
function D5_reflectSide(a,b){const cr=a[0]*b[1]-a[1]*b[0];
 if(Math.abs(cr)<1e-9){const l=Math.hypot(a[0],a[1])>1e-9?a:b,u=D5_unit([l[0],l[1],0]);return z=>{const d=z[0]*u[0]+z[1]*u[1];return [2*d*u[0]-z[0],2*d*u[1]-z[1]]}}
 const ra=(a[0]*a[0]+a[1]*a[1]+1)/2,rb=(b[0]*b[0]+b[1]*b[1]+1)/2,c=[(ra*b[1]-rb*a[1])/cr,(a[0]*rb-b[0]*ra)/cr],r2=c[0]*c[0]+c[1]*c[1]-1;
 return z=>{const dx=z[0]-c[0],dy=z[1]-c[1],q=dx*dx+dy*dy;return [c[0]+r2*dx/q,c[1]+r2*dy/q]}}
const D5_TILES={};
function D5_tiling(p,q){const key=p+','+q;if(D5_TILES[key])return D5_TILES[key];
 const R=Math.acosh(1/Math.tan(D5_PI/p)/Math.tan(D5_PI/q)),r0=Math.tanh(R/2),first=range(p).map(k=>[r0*Math.cos(2*D5_PI*k/p-D5_PI/2+D5_PI/p),r0*Math.sin(2*D5_PI*k/p-D5_PI/2+D5_PI/p)]);
 const tiles=[first],seen=new Set(),kf=t=>{const c=[sum(t.map(v=>v[0]))/t.length,sum(t.map(v=>v[1]))/t.length];return Math.round(c[0]*2e3)+':'+Math.round(c[1]*2e3)};seen.add(kf(first));
 for(let i=0;i<tiles.length&&tiles.length<900;i++){const t=tiles[i];for(let e=0;e<p;e++){const f=D5_reflectSide(t[e],t[(e+1)%p]),n=t.map(f),k=kf(n);if(seen.has(k))continue;seen.add(k);
  let w=0;for(let j=0;j<p;j++)w=Math.max(w,Math.hypot(n[j][0]-n[(j+1)%p][0],n[j][1]-n[(j+1)%p][1]));if(w<.022)continue;tiles.push(n)}}
 // the central tile's area, integrated in the Klein model over a fan of triangles from the centre
 const kv=first.map(D5_klein);let area=0;for(let j=0;j<p;j++)area+=D5_hArea([0,0],kv[j],kv[(j+1)%p]);
 // the corner angle of the central tile as drawn in each model
 const v0=first[0],v1=first[1],vl=first[p-1],angP=D5_angBetween(D5_hdir(v0,v1),D5_hdir(v0,vl)),k0=D5_klein(v0),k1=D5_klein(v1),kl=D5_klein(vl),angK=D5_angBetween(Math.atan2(k1[1]-k0[1],k1[0]-k0[0]),Math.atan2(kl[1]-k0[1],kl[0]-k0[0]));
 return (D5_TILES[key]={tiles,area,angP,angK,r0})}
const D5_TILE_SVG={};
function D5_tileSVG(p,q,model,cx,cy,rr){const key=[p,q,model].join(',');if(D5_TILE_SVG[key])return D5_TILE_SVG[key];
 const T=D5_tiling(p,q),S=z=>fmt(cx+z[0]*rr)+' '+fmt(cy-z[1]*rr);let d='';
 for(const t of T.tiles){for(let j=0;j<p;j++){const a=t[j],b=t[(j+1)%p];if(model==='klein'){d+='M'+S(D5_klein(a))+'L'+S(D5_klein(b))}else{const n=Math.max(2,Math.min(12,Math.round(Math.hypot(a[0]-b[0],a[1]-b[1])*40)));d+='M'+D5_hgeo(a,b,n).map(S).join('L')}}}
 const c=T.tiles[0].map(model==='klein'?D5_klein:z=>z);
 return (D5_TILE_SVG[key]=P('M'+c.map(S).join('L')+'Z','none',0,C.coralp)+P(d,C.blue,1.1))}
SCENE({id:'non-euclidean-models',name:'Tiling the hyperbolic plane',tag:'Beltrami 1868, Klein 1871, Poincaré 1882',
 definition:'Beltrami (1868) gave hyperbolic geometry a model: a surface on which it holds, which settled that it is as consistent as Euclid’s. Klein (1871) and Poincaré (1882) drew the whole plane inside a disc. In Klein’s disc lines are straight chords but angles are distorted; in Poincaré’s they are arcs and angles are true. Regular p-sided tiles meeting q at a corner fit in the hyperbolic plane whenever (p − 2)(q − 2) > 4.',
 example:'Maryam Mirzakhani, Fields Medal 2014, studied the geodesics of surfaces built from hyperbolic tiles like these, and counted how many closed ones of each length a surface has. M. C. Escher’s Circle Limit prints (1958–60) are hyperbolic tilings drawn after he saw a figure in a paper by H. S. M. Coxeter.',
 desc:'A regular tiling of the Poincaré or Klein disc by p-sided tiles meeting q at each corner, with the central tile shaded, beside a fan of q flat p-gon corners round one point that shows whether they leave a gap, fit exactly or overlap. Tiles give each tile’s area and the corner angle as drawn.',
 research:['Beltrami (1868). Saggio di interpretazione della geometria non-euclidea. Giornale di Matematiche 6, 284–312.','Klein (1871). Ueber die sogenannte Nicht-Euklidische Geometrie. Mathematische Annalen 4, 573–625.','Poincaré (1882). Théorie des groupes fuchsiens. Acta Mathematica 1, 1–62.','Coxeter (1979). The non-Euclidean symmetry of Escher’s picture “Circle Limit III”. Leonardo 12, 19–25.','Mirzakhani (2008). Growth of the number of simple closed geodesics on hyperbolic surfaces. Annals of Mathematics 168, 97–125.'],
 dur:12,hint:'Choose the number of sides p and how many tiles meet at a corner, q. Switch between Poincaré’s and Klein’s disc and compare the corner angle each one draws.',
 init:()=>({p:5,q:4,model:'poincare'}),
 watch:p=>{const k=Math.min(4,Math.floor(p*5));return [{p:4,q:4,model:'poincare'},{p:5,q:4,model:'poincare'},{p:5,q:4,model:'klein'},{p:7,q:3,model:'poincare'},{p:4,q:6,model:'poincare'}][k]},
 ui:[{choose:[3,4,5,6,7,8].map(v=>[v,'p = '+v]),label:'Sides p',get:s=>s.p,act:'p'},{choose:[3,4,5,6,7,8].map(v=>[v,'q = '+v]),label:'At a corner q',get:s=>s.q,act:'q'},{choose:[['poincare','Poincaré disc'],['klein','Klein disc']],label:'Model',get:s=>s.model,act:'model'}],
 on:{p(s,v){s.p=clamp(Math.round(+v),3,8)},q(s,v){s.q=clamp(Math.round(+v),3,8)},model(s,v){s.model=v==='klein'?'klein':'poincare'}},
 draw(s){
  const p=s.p,q=s.q,prod=(p-2)*(q-2),kind=prod>4?'hyp':prod===4?'flat':'sph',cx=170,cy=204,rr=148,flatAng=(p-2)*D5_PI/p,around=q*flatAng;
  let out=heading(kind==='hyp'?`{${p}, ${q}}: (${p} − 2)(${q} − 2) = ${prod} > 4, hyperbolic`:kind==='flat'?`{${p}, ${q}}: (${p} − 2)(${q} − 2) = 4, the flat plane`:`{${p}, ${q}}: (${p} − 2)(${q} − 2) = ${prod} < 4, a sphere`);
  let T=null;
  if(kind==='hyp'){T=D5_tiling(p,q);out+=Ci(cx,cy,rr,'#f7fafc',C.line)+D5_tileSVG(p,q,s.model,cx,cy,rr)+TF(cx,cy+rr+18,(s.model==='klein'?'Klein disc: straight sides':'Poincaré disc: true angles')+` · ${T.tiles.length} tiles`,13,C.muted)}
  else if(kind==='flat'){// a patch of the flat tiling
   const a=34;let d='';const poly=(x,y,n,rot)=>{const rad=a/(2*Math.sin(D5_PI/n));return range(n+1).map(k=>[x+rad*Math.cos(rot+2*D5_PI*k/n),y+rad*Math.sin(rot+2*D5_PI*k/n)])};
   if(p===4)for(let i=-4;i<=4;i++)for(let j=-4;j<=4;j++)d+=D5_poly(poly(cx+i*a,cy+j*a,4,D5_PI/4),C.blue,1.2);
   else if(p===3)for(let i=-6;i<=6;i++)for(let j=-5;j<=5;j++){const x=cx+i*a/2,y=cy+j*a*Math.sqrt(3)/2,up=(i+j)%2===0;d+=D5_poly(poly(x,y+(up?a*Math.sqrt(3)/6:-a*Math.sqrt(3)/6),3,up?-D5_PI/2:D5_PI/2),C.blue,1.2)}
   else for(let i=-4;i<=4;i++)for(let j=-4;j<=4;j++){const x=cx+i*a*1.5,y=cy+j*a*Math.sqrt(3)+(i%2?a*Math.sqrt(3)/2:0);d+=D5_poly(poly(x,y,6,0),C.blue,1.2)}
   out+=`<clipPath id="d5ct"><rect x="${cx-rr}" y="${cy-rr}" width="${2*rr}" height="${2*rr}"/></clipPath>`+R(cx-rr,cy-rr,2*rr,2*rr,'#f7fafc',C.line,4)+G(d,'clip-path="url(#d5ct)"')+TF(cx,cy+rr+18,'flat tiles: Euclid’s plane',13,C.muted)}
  else{const tileArea=p*2*D5_PI/q-(p-2)*D5_PI,F=4*D5_PI/tileArea;
   out+=Ci(cx,cy,rr,'#f7fafc',C.line)+TB(cx,cy-20,'These tiles close up',16,C.ink)+TB(cx,cy+4,`on a sphere: ${Math.round(F)} of them`,16,C.ink)+TF(cx,cy+32,`each covers ${D5_n(tileArea,3)} of the`,13,C.muted)+TF(cx,cy+50,`unit sphere’s 4π = ${D5_n(4*D5_PI,3)}`,13,C.muted)}
  // fan of flat corners
  const fx=468,fy=118,fr=56;out+=R(352,48,232,150,'#fff',C.grid,8)+TF(360,66,`${q} flat ${p}-gon corners round a point`,13,C.muted,'start');
  for(let k=0;k<q;k++){const a0=-D5_PI/2+k*flatAng,a1=a0+flatAng,big=flatAng>D5_PI?1:0;out+=P(`M${fx} ${fy+12}L${fmt(fx+fr*Math.cos(a0))} ${fmt(fy+12+fr*Math.sin(a0))}A${fr} ${fr} 0 ${big} 1 ${fmt(fx+fr*Math.cos(a1))} ${fmt(fy+12+fr*Math.sin(a1))}Z`,'#fff',1.2,k%2?C.pale:C.coralp,'fill-opacity=".8"')}
  out+=TBF(468,192,`${q} × ${D5_d(flatAng,1)} = ${D5_d(around,1)}`,13,kind==='hyp'?C.coral:kind==='sph'?C.blue:C.green);
  const x0=352;
  out+=TF(x0,222,kind==='hyp'?'Overlap: in the hyperbolic plane':kind==='sph'?'Gap: fold the corners up into':'Exactly 360°: they tile',13,C.ink,'start')+TF(x0,240,kind==='hyp'?`each corner shrinks to 360°/${q} = ${D5_d(2*D5_PI/q,1)}.`:kind==='sph'?'a polyhedron, a tiled sphere.':'the flat plane.',13,C.ink,'start');
  if(T){out+=D5_tile(x0,256,112,'corner as drawn',D5_d(s.model==='klein'?T.angK:T.angP),s.model==='klein'?C.purple:C.green)+D5_tile(x0+120,256,112,'true corner',D5_d(2*D5_PI/q),C.ink);
   out+=D5_tile(x0,310,232,'area of each tile (integrated)',`${D5_n(T.area,3)}  · formula ${D5_n((p-2)*D5_PI-2*D5_PI*p/q,3)}`,C.coral)}
  return {svg:out,phase:kind==='hyp'?`Flat ${p}-gons have corners of ${D5_d(flatAng)}, and ${q} of them make ${D5_d(around)}: too much to lie flat. In the hyperbolic plane larger tiles have smaller corners, so each tile grows until its corners are ${D5_d(2*D5_PI/q)}. Its area, integrated, is ${D5_n(T.area,3)}, matching the deficit (p − 2)π − p·2π/q. ${s.model==='klein'?`Klein’s disc draws that corner as ${D5_d(T.angK)}: its straight lines cost true angles.`:`Poincaré’s disc draws it as ${D5_d(T.angP)}, its true size.`} Every tile is the same size; they only look smaller near the rim.`:
   kind==='flat'?`${q} corners of ${D5_d(flatAng)} make exactly 360°, so these tiles cover the flat plane: one of only three regular tilings of Euclid’s plane.`:`${q} corners of ${D5_d(flatAng)} make only ${D5_d(around)}, leaving a gap. Folding the corners up closes the gap and the tiles cover a sphere: ${Math.round(4*D5_PI/(p*2*D5_PI/q-(p-2)*D5_PI))} of them, the faces of a regular polyhedron.`};
 }});

/* ===================== Lesson: geodesics ===================== */
// City coordinates are rounded geography (degrees). The Earth is taken as a sphere of mean radius D5_EARTH km.
const D5_CITIES=[['London',51.51,-.13],['New York',40.71,-74.01],['Tokyo',35.68,139.69],['Sydney',-33.87,151.21],['Cape Town',-33.92,18.42],['Singapore',1.35,103.82],['Los Angeles',34.05,-118.24],['São Paulo',-23.55,-46.63]];
const D5_wrap=a=>{a=(a+D5_PI)%(2*D5_PI);if(a<0)a+=2*D5_PI;return a-D5_PI};
const D5_merc=lat=>Math.log(Math.tan(D5_PI/4+lat/2));
function D5_route(i,j){
 const A=D5_CITIES[i],B=D5_CITIES[j],p1=A[1]/D5_DEG,p2=B[1]/D5_DEG,l1=A[2]/D5_DEG,dl=D5_wrap((B[2]-A[2])/D5_DEG),PA=D5_ll(A[1],A[2]),PB=D5_ll(B[1],B[2]);
 const ang=Math.acos(clamp(D5_dot(PA,PB),-1,1)),hav=2*Math.asin(Math.sqrt(Math.sin((p2-p1)/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2));
 const gc=range(201).map(k=>{const t=k/200;return D5_unit(D5_add(D5_mul(PA,Math.sin((1-t)*ang)/Math.sin(ang)),D5_mul(PB,Math.sin(t*ang)/Math.sin(ang))))});
 const s1=D5_merc(p1),ds=D5_merc(p2)-s1,rh=range(201).map(k=>{const t=k/200,lat=2*Math.atan(Math.exp(s1+t*ds))-D5_PI/2;return D5_ll(lat*D5_DEG,(l1+t*dl)*D5_DEG)});
 const qf=Math.abs(ds)>1e-12?(p2-p1)/ds:Math.cos(p1),rhF=Math.sqrt((p2-p1)**2+qf*qf*dl*dl);
 const course=Math.atan2(Math.sin(dl)*Math.cos(p2),Math.cos(p1)*Math.sin(p2)-Math.sin(p1)*Math.cos(p2)*Math.cos(dl)),rcourse=Math.atan2(dl,ds);
 return {A,B,ang,hav,gc,rh,gcLen:D5_plen(gc),rhLen:D5_plen(rh),rhF,lc:l1+dl/2,course,rcourse}}
const D5_bearing=r=>{let d=Math.round(((r*D5_DEG)%360+360)%360);return d+'°'};
const D5_PAIRS=[[0,2],[1,0],[6,2],[4,3],[7,0],[5,6]];
SCENE({id:'geodesics',name:'The shortest way round the Earth',tag:'Bernoulli’s problem, 1697–98; Euler, 1732',
 definition:'A geodesic is the straightest possible path in a surface: one that never turns left or right as seen from within. Johann Bernoulli posed the problem of the shortest line between two points of a surface in 1697–98, and Euler gave its equation in 1732. On a sphere the geodesics are great circles, the circles whose centre is the sphere’s centre.',
 get example(){const r=D5_route(0,2);return `London to Tokyo along the great circle is ${Math.round(r.ang*D5_EARTH)} km; following one constant compass bearing (a rhumb line, straight on a Mercator map) it is ${Math.round(r.rhLen*D5_EARTH)} km. The great circle starts out at a bearing of ${D5_bearing(r.course)}, over the far north, and looks curved on the map because the map, not the route, is bent.`},
 desc:'A Mercator world map with a graticule and eight cities. The great-circle route between two chosen cities is drawn in blue and the constant-bearing route in coral, with tiles comparing their lengths, each measured two ways.',
 research:['Euler (1732, printed 1736). De linea brevissima in superficie quacunque duo quaelibet puncta jungente. Commentarii Academiae Scientiarum Petropolitanae 3.','Mercator (1569). Nova et aucta orbis terrae descriptio: the map on which a constant bearing is a straight line; Edward Wright (1599). Certaine Errors in Navigation: the mathematics behind it.','Earth taken as a sphere of mean radius 6371 km; real flight paths also follow winds. Lengths are measured as sums of 200 short chords and checked against the formulas.'],
 dur:12,hint:'Press two cities in turn, or step through some pairs. Compare the blue great circle with the coral constant-bearing line, on the map and, in 3D, on the globe.',
 init:()=>({a:0,b:2,sel:0}),
 watch:p=>{const w=D5_PAIRS[Math.min(5,Math.floor(p*6))];return {a:w[0],b:w[1],sel:0}},
 ui:[{b:'Next pair',act:'next'},{b:'Swap ends',act:'swap'}],
 on:{next(s){const k=D5_PAIRS.findIndex(w=>w[0]===s.a&&w[1]===s.b),w=D5_PAIRS[(k+1)%D5_PAIRS.length];s.a=w[0];s.b=w[1];s.sel=0},swap(s){[s.a,s.b]=[s.b,s.a]},
  city(s,v){const i=clamp(Math.round(+v),0,D5_CITIES.length-1);if(s.sel===0){if(i!==s.b)s.a=i}else{if(i!==s.a)s.b=i}s.sel=1-s.sel}},
 draw(s,f,X){
  const r=D5_route(s.a,s.b),x0=20,w=330,sc=w/(2*D5_PI),h=2*D5_merc(80/D5_DEG)*sc,y0=50,ymid=y0+h/2;
  const M=pt=>{const lat=Math.asin(clamp(pt[2],-1,1)),lon=Math.atan2(pt[1],pt[0]);return [x0+w/2+D5_wrap(lon-r.lc)*sc,ymid-D5_merc(clamp(lat,-1.45,1.45))*sc]};
  const line=(pts,col,wd)=>{let out='',run=[];for(const p of pts){const q=M(p);if(run.length&&Math.abs(q[0]-run[run.length-1][0])>w/2){out+=D5_poly(run,col,wd);run=[]}run.push(q)}return out+D5_poly(run,col,wd)};
  let out=heading(`${r.A[0]} to ${r.B[0]}: ${Math.round(r.gcLen*D5_EARTH)} km by great circle`);
  out+=`<clipPath id="d5cm"><rect x="${x0}" y="${y0}" width="${w}" height="${h}"/></clipPath>`;
  let g=R(x0,y0,w,h,'#f4f8fb',C.grid,0);
  for(let lon=-180;lon<180;lon+=30)g+=line(range(2).map(i=>D5_ll(-85+i*170,lon)),C.grid,1);
  for(const lat of [-60,-30,0,30,60])g+=line(range(73).map(i=>D5_ll(lat,-180+i*5)),lat===0?'#c3d4df':C.grid,1);
  g+=TF(x0+4,ymid-4,'equator',13,C.muted,'start')+TF(x0+4,ymid-D5_merc(60/D5_DEG)*sc-4,'60° N',13,C.muted,'start')+TF(x0+4,ymid+D5_merc(60/D5_DEG)*sc-4,'60° S',13,C.muted,'start');
  g+=line(r.rh,C.coral,3)+line(r.gc,C.blue,3);
  out+=G(g,'clip-path="url(#d5cm)"');
  D5_CITIES.forEach((c,i)=>{const q=M(D5_ll(c[1],c[2])),on=i===s.a||i===s.b,lab=on||!(X&&!X.try);out+=hit(X,'city',i,`Choose ${c[0]}`,Ci(q[0],q[1],on?7:5,i===s.a?C.green:i===s.b?C.purple:C.muted,'#fff'));if(on)out+=TBF(q[0],q[1]-12,c[0],13,i===s.a?C.green:C.purple)});
  out+=D5_tile(362,52,220,'Great circle (blue)',`${Math.round(r.gcLen*D5_EARTH)} km`,C.blue)+D5_tile(362,106,220,'Constant bearing (coral)',`${Math.round(r.rhLen*D5_EARTH)} km`,C.coral)+D5_tile(362,160,220,'Saved by the great circle',`${D5_n(100*(1-r.gcLen/r.rhLen),1)}%`,C.ink);
  out+=TF(362,236,`Great circle sets off at ${D5_bearing(r.course)},`,13,C.ink,'start')+TF(362,254,'then keeps turning.',13,C.ink,'start')+TF(362,280,`Constant bearing: ${D5_bearing(r.rcourse)} all the way.`,13,C.ink,'start');
  out+=D5_note(`Formulas: ${Math.round(r.hav*D5_EARTH)} km (haversine), ${Math.round(r.rhF*D5_EARTH)} km (rhumb). Mercator map to 80°, no coastlines.`,350);
  return {svg:out,phase:`Measured as 200 short chords, the great circle from ${r.A[0]} to ${r.B[0]} is ${Math.round(r.gcLen*D5_EARTH)} km and the constant-bearing line ${Math.round(r.rhLen*D5_EARTH)} km. The great circle sets off at ${D5_bearing(r.course)} and keeps changing its compass bearing; the rhumb line holds ${D5_bearing(r.rcourse)} all the way, which is why it is straight on Mercator’s map but not the shortest. ${s.sel?'Press the second city.':'Press a city to choose a new start.'}`};
 },
 three(s){
  const r=D5_route(s.a,s.b),Pr=makeProject(range(60).map(i=>{const z=-1+2*(i+.5)/60,q=Math.sqrt(1-z*z),a=i*2.39996;return [q*Math.cos(a),q*Math.sin(a),z]})),seg=(pts,col,wd)=>{let o='';for(let i=1;i<pts.length;i++){const a=Pr(pts[i-1]),b=Pr(pts[i]),front=a[2]+b[2]>=0;o+=L(a[0],a[1],b[0],b[1],col,front?wd:1,front?'':'stroke-opacity=".3"')}return o};
  let out='';for(let lon=0;lon<360;lon+=30)out+=seg(range(37).map(i=>D5_ll(-90+i*5,lon)),C.grid,1.2);for(const lat of [-60,-30,0,30,60])out+=seg(range(73).map(i=>D5_ll(lat,i*5)),C.grid,1.2);
  out+=seg(r.rh.filter((_,i)=>i%4===0),C.coral,3)+seg(r.gc.filter((_,i)=>i%4===0),C.blue,3);
  for(const [i,col] of [[s.a,C.green],[s.b,C.purple]]){const c=D5_CITIES[i],q=Pr(D5_ll(c[1],c[2]));out+=Ci(q[0],q[1],6,col,'#fff',q[2]<0?'opacity=".35"':'')+TF(q[0],q[1]-12,c[0],13,col)}
  return {svg:out,title:'The two routes on the globe',caption:`On the globe the blue great circle is visibly the more direct: it lies in a plane through the Earth’s centre. The coral line keeps one compass bearing, crossing every meridian at the same angle. Lengths ${Math.round(r.gcLen*D5_EARTH)} and ${Math.round(r.rhLen*D5_EARTH)} km.`};
 }});

// A cylinder of radius 1. A is at angle 0, height 0; B at angle Δθ, height h. Unrolled, the cylinder is a strip
// repeated every 2π, and each copy of B gives a straight line from A: a helix winding k extra times.
function D5_helix(dth,h,k){const tot=dth/D5_DEG+2*D5_PI*k,pts=range(2001).map(i=>{const t=i/2000;return [Math.cos(t*tot),Math.sin(t*tot),t*h]});return {tot,pts,len:D5_plen(pts),formula:Math.hypot(h,tot)}}
SCENE({id:'geodesics-cylinder',name:'Helices on a cylinder',tag:'Unroll it and they are straight',
 definition:'A cylinder can be unrolled flat without stretching (its curvature K is 0), so its geodesics are whatever becomes straight when it is unrolled: lines along it, circles round it, and helices. Between two points there are infinitely many geodesics, one for each number of extra turns, and only one of them is the shortest.',
 get example(){const a=D5_helix(120,1,0),b=D5_helix(120,1,-1);return `On a tube of radius 1, from A to a point B a third of the way round and 1 higher, the direct helix is ${D5_n(a.len,3)} long and the one that goes round the other way is ${D5_n(b.len,3)}. Both are geodesics: an ant walking straight ahead along either never turns.`},
 desc:'A cylinder with points A and B and the helix joining them with a chosen number of extra turns, above the unrolled cylinder: a strip repeated side by side, with A and the copies of B joined by straight lines. Tiles give each helix’s length, measured and from Pythagoras.',
 research:['Euler (1732), as above; on developable surfaces the shortest lines become straight when the surface is unrolled.','do Carmo (1976). Differential Geometry of Curves and Surfaces. Prentice-Hall: geodesics of the cylinder (section 4-4).','Helix lengths are summed from 2000 short chords and checked against √(h² + angle²) on the unrolled strip.'],
 dur:12,hint:'Move B round the cylinder and up it, and choose how many extra turns the helix makes. Each one is a straight line on the unrolled strip.',
 init:()=>({dth:120,h:2,k:0}),
 watch:p=>({dth:120,h:2,k:[0,1,-1,2][Math.min(3,Math.floor(p*4))]}),
 ui:[{range:'dth',label:'B round from A',min:0,max:345,step:15,get:s=>s.dth,act:'dth',show:v=>v+'°'},{range:'h',label:'B’s height',min:0,max:6,get:s=>s.h,act:'h',show:v=>D5_n(v/2,1)},{choose:[[-1,'−1 turn'],[0,'0'],[1,'+1'],[2,'+2']],label:'Extra turns',get:s=>s.k,act:'k'}],
 on:{dth(s,v){s.dth=clamp(Math.round(+v/15)*15,0,345)},h(s,v){s.h=clamp(Math.round(+v),0,6)},k(s,v){s.k=clamp(Math.round(+v),-1,2)}},
 draw(s){
  const h=s.h/2,hs=[-1,0,1,2].map(k=>D5_helix(s.dth,h,k)),cur=hs[s.k+1],best=hs.reduce((a,b)=>b.len<a.len?b:a);
  let out=heading(cur===best?`This helix is the shortest: ${D5_n(cur.len,3)}`:`A geodesic, but not the shortest: ${D5_n(cur.len,3)}`);
  // cylinder
  const cx=130,cb=196,rx=56,ry=16,zs=44,S=p=>[cx+rx*p[1],cb+ry*p[0]-zs*p[2]];
  out+=P(`M${cx-rx} ${cb}A${rx} ${ry} 0 0 0 ${cx+rx} ${cb}`,C.line,1.6)+P(`M${cx-rx} ${cb}A${rx} ${ry} 0 0 1 ${cx+rx} ${cb}`,C.line,1.2,'none',D5_dash);
  out+=`<ellipse cx="${cx}" cy="${cb-3*zs}" rx="${rx}" ry="${ry}" fill="none" stroke="${C.line}" stroke-width="1.6"/>`+L(cx-rx,cb,cx-rx,cb-3*zs,C.line,1.6)+L(cx+rx,cb,cx+rx,cb-3*zs,C.line,1.6);
  let run=[],front=null;const flush=()=>{if(run.length>1)out+=D5_poly(run,C.coral,front?3:1.6,front?'':D5_dash);run=[]};
  for(const p of cur.pts){const fr=p[0]>=0,q=S(p);if(front!==null&&fr!==front){run.push(q);flush()}front=fr;run.push(q)}flush();
  const a=S([1,0,0]),b=S([Math.cos(s.dth/D5_DEG),Math.sin(s.dth/D5_DEG),h]);out+=Ci(a[0],a[1],6,C.green,'#fff')+TBF(a[0]-10,a[1]+16,'A',14,C.green,'end')+Ci(b[0],b[1],6,C.purple,'#fff',Math.cos(s.dth/D5_DEG)<0?'opacity=".5"':'')+TBF(b[0]+10,b[1]-6,'B',14,C.purple,'start');
  // lengths
  const x0=266;out+=TF(x0,58,'every helix from A to B, by extra turns',13,C.muted,'start');
  hs.forEach((H,i)=>{const k=i-1,y=66+i*34,on=k===s.k;out+=R(x0,y,316,28,on?C.coralp:'#fff',H===best?C.green:C.grid,6)+TBF(x0+10,y+19,(k>0?'+':k<0?'−':'')+Math.abs(k)+' turn'+(Math.abs(k)===1?'':'s'),13,on?C.coral:C.ink,'start')+TF(x0+92,y+19,`measured ${D5_n(H.len,3)}`,13,C.ink,'start')+TF(x0+306,y+19,`√ gives ${D5_n(H.formula,3)}`,13,C.muted,'end')});
  out+=TF(x0,220,'green outline: the shortest',13,C.green,'start');
  // unrolled strip: angle u from −2π to 4π
  const ux=20,uw=560,uy=246,uh=96,us=uw/(6*D5_PI),U=(u,z)=>[ux+(u+2*D5_PI)*us,uy+uh-8-z*(uh-16)/3];
  for(let c=-1;c<=1;c++){out+=R(U(c*2*D5_PI,0)[0],uy,2*D5_PI*us,uh,c===0?C.pale:'#f4f8fb',C.line,0)}
  out+=TF(U(D5_PI,0)[0],uy+uh+16,'the cylinder unrolled, repeated every 2π',13,C.muted);
  hs.forEach((H,i)=>{const e=U(H.tot,h);if(e[0]>=ux-1&&e[0]<=ux+uw+1){const on=i-1===s.k;out+=L(...U(0,0),...e,on?C.coral:C.line,on?3:1.6)+Ci(e[0],e[1],5,C.purple)}});
  const ua=U(0,0);out+=Ci(ua[0],ua[1],6,C.green);
  return {svg:out,phase:`Unrolled, the cylinder becomes a strip repeated every full turn, and B appears once in every copy. Each straight line from A to a copy of B rolls up into a helix. This one, with ${s.k} extra turn${Math.abs(s.k)===1?'':'s'}, turns ${D5_d(cur.tot,0)} in all and is ${D5_n(cur.len,3)} long (Pythagoras on the strip: ${D5_n(cur.formula,3)}). ${cur===best?'It is the shortest of them.':`The shortest is ${D5_n(best.len,3)}; this one is still a geodesic, straight at every point.`}`};
 }});

// Unit sphere: A = (1, 0, 0), B at angle γ along the equator. The short arc runs from 0 to γ, the long arc from 0 to
// −(2π − γ). A path is pushed sideways by ε·sin(πt) towards the pole and put back on the sphere; its length is summed.
function D5_push(g,eps,arc){const end=arc==='short'?g/D5_DEG:-(2*D5_PI-g/D5_DEG),pts=range(401).map(i=>{const t=i/400,a=t*end;return D5_unit([Math.cos(a),Math.sin(a),eps*Math.sin(D5_PI*t)])});return {pts,len:D5_plen(pts),end}}
SCENE({id:'geodesics-long-way',name:'Straightest is not always shortest',tag:'Jacobi’s test, 1837',
 definition:'A geodesic is locally shortest: any short piece of it is the shortest path between its ends. The whole of it need not be. Between two points of a sphere there are two great-circle arcs, and both are geodesics. The long one stops being shortest once it passes the point opposite its start; Jacobi (1837) gave the general test, using what are now called conjugate points.',
 example:'Push the short arc a little to one side and it gets longer: it is a minimum. Push the long arc and it gets shorter: it is straight, but a path that bends slightly towards the pole beats it. Light and satellites follow geodesics, and this is why a geodesic is defined as straightest rather than shortest.',
 desc:'A sphere with points A and B on the equator, the chosen great-circle arc between them pushed sideways by a chosen amount, and a graph of path length against the push for both the short and the long arc.',
 research:['Jacobi (1837). Zur Theorie der Variations-Rechnung und der Differential-Gleichungen. Journal für die reine und angewandte Mathematik 17, 68–82.','Lengths are summed from 400 short chords of each pushed path; the push is ε·sin(πt) towards the pole, then the path is put back on the sphere.'],
 dur:12,hint:'Choose the short or the long arc and push it sideways in either direction. Watch which way its length changes.',
 init:()=>({g:100,eps:0,arc:'long'}),
 watch:p=>({g:100,eps:Math.round(12*Math.sin(2*D5_PI*(p<.5?p*2:(p-.5)*2))),arc:p<.5?'short':'long'}),
 ui:[{choose:[['short','Short arc'],['long','Long arc']],label:'Arc',get:s=>s.arc,act:'arc'},{range:'eps',label:'Push sideways',min:-12,max:12,get:s=>s.eps,act:'eps',show:v=>D5_n(v/20)},{range:'g',label:'A to B',min:30,max:150,step:10,get:s=>s.g,act:'g',show:v=>v+'°'}],
 on:{arc(s,v){s.arc=v==='short'?'short':'long'},eps(s,v){s.eps=clamp(Math.round(+v),-12,12)},g(s,v){s.g=clamp(Math.round(+v/10)*10,30,150)}},
 draw(s){
  const e=s.eps/20,cur=D5_push(s.g,e,s.arc),base=D5_push(s.g,0,s.arc),cx=150,cy=196,rr=118,V=D5_view(28,-60,cx,cy,rr);
  const dl=cur.len-base.len;
  let out=heading(e===0?`Both arcs are geodesics: ${D5_n(D5_push(s.g,0,'short').len,3)} and ${D5_n(D5_push(s.g,0,'long').len,3)}`:dl<0?`Pushed, the ${s.arc} arc gets shorter by ${D5_n(-dl,4)}`:`Pushed, the ${s.arc} arc gets longer by ${D5_n(dl,4)}`);
  out+=D5_globe(V,cx,cy,rr);
  out+=D5_sphCurve(base.pts,V,C.muted,1.6)+D5_sphCurve(cur.pts,V,s.arc==='short'?C.blue:C.coral,3.4);
  const pa=V([1,0,0]),pb=V(D5_ll(0,s.g)),pc=V([-1,0,0]);
  out+=Ci(pa[0],pa[1],6,C.green,'#fff')+TBF(pa[0]-10,pa[1]+18,'A',14,C.green,'end')+Ci(pb[0],pb[1],6,C.purple,'#fff',pb[2]<0?'opacity=".5"':'')+TBF(pb[0]+10,pb[1]+18,'B',14,C.purple,'start');
  if(s.arc==='long')out+=Ci(pc[0],pc[1],5,C.ink,'#fff',pc[2]<0?'opacity=".5"':'')+TF(pc[0],pc[1]-12,'opposite A',13,C.ink);
  // graph of length against the push
  const gx=330,gy=56,gw=250,gh=190,es=range(49).map(i=>-.6+i*.025),sh=es.map(x=>D5_push(s.g,x,'short').len),lo=es.map(x=>D5_push(s.g,x,'long').len);
  const all=sh.concat(lo),mn=Math.min(...all),mx=Math.max(...all),Xg=x=>gx+12+(x+.6)/1.2*(gw-24),Yg=v=>gy+gh-14-(v-mn)/(mx-mn||1)*(gh-36);
  out+=R(gx,gy,gw,gh,'#fff',C.grid,8)+L(Xg(0),gy+8,Xg(0),gy+gh-8,C.grid,1.2);
  out+=D5_poly(es.map((x,i)=>[Xg(x),Yg(sh[i])]),C.blue,2.4)+D5_poly(es.map((x,i)=>[Xg(x),Yg(lo[i])]),C.coral,2.4);
  out+=Ci(Xg(e),Yg(cur.len),6,s.arc==='short'?C.blue:C.coral,'#fff');
  out+=TF(gx+gw-10,Yg(lo[24])-10,'long arc',13,C.coral,'end')+TF(gx+gw-10,Yg(sh[0])+18,'short arc',13,C.blue,'end');
  out+=TF(gx+gw/2,gy+gh+16,'length against push (−0.6 to 0.6)',13,C.muted);
  out+=D5_tile(330,276,122,'Unpushed length',D5_n(base.len,4),C.ink)+D5_tile(458,276,122,'Pushed length',D5_n(cur.len,4),s.arc==='short'?C.blue:C.coral);
  out+=D5_note('Unit sphere. Grey: the unpushed arc. The long arc passes the point opposite A.',360);
  return {svg:out,phase:s.arc==='short'?`The short arc from A to B is ${D5_n(base.len,4)} long. Pushed sideways by ${D5_n(e)}, it becomes ${D5_n(cur.len,4)}: every push makes it longer, so its length is a minimum, as a shortest path’s must be.`:`The long arc is ${D5_n(base.len,4)}, more than π, so it runs past the point opposite A. Pushed sideways by ${D5_n(e)} it becomes ${D5_n(cur.len,4)}: ${e===0?'any push in either direction shortens it.':'shorter than before.'} It is straight at every point, a geodesic, yet it is a maximum among nearby paths, not a minimum. Jacobi’s test finds where this starts: at the first point conjugate to A, here the point opposite it.`};
 }});

/* ===================== Lesson: riemann-lecture ===================== */
// One chart, three rulers. Chart points (x, y) with x in [−2, 2], y in [0.2, 2.2]. Each metric gives the squared
// length of a small step: flat dx² + dy²; Poincaré half-plane (dx² + dy²)/y²; sphere in a longitude–latitude chart
// with longitude 0.7x and latitude 0.8(y − 1.2) in radians: 0.49·cos²(lat)·dx² + 0.64·dy².
const D5_MET={flat:{short:'Flat',name:'Flat plane',g:(x,y)=>[1,1]},half:{short:'Half-plane',name:'Hyperbolic half-plane',g:(x,y)=>[1/(y*y),1/(y*y)]},sphere:{short:'Sphere chart',name:'Sphere, longitude–latitude chart',g:(x,y)=>[.49*Math.cos(.8*(y-1.2))**2,.64]}};
// Length of a path in the chart under metric m: the sum over 2000 small steps of √(g₁dx² + g₂dy²) at each step’s middle.
function D5_mlen(m,path){const g=D5_MET[m].g;let s=0;for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],x=(a[0]+b[0])/2,y=(a[1]+b[1])/2,G=g(x,y);s+=Math.sqrt(G[0]*(b[0]-a[0])**2+G[1]*(b[1]-a[1])**2)}return s}
const D5_RGRID=[].concat(...[2,1.6,1.2,.8,.4].map(y=>range(9).map(i=>[-2+i*.5,y])));
function D5_riem(m,ia,ib){const A=D5_RGRID[ia],B=D5_RGRID[ib],n=2000,straight=range(n+1).map(i=>[lerp(A[0],B[0],i/n),lerp(A[1],B[1],i/n)]);let geo,formula;
 if(m==='flat'){geo=straight;formula=Math.hypot(B[0]-A[0],B[1]-A[1])}
 else if(m==='half'){if(Math.abs(A[0]-B[0])<1e-9)geo=straight;else{const c=(B[0]*B[0]+B[1]*B[1]-A[0]*A[0]-A[1]*A[1])/(2*(B[0]-A[0])),r=Math.hypot(A[0]-c,A[1]),ta=Math.atan2(A[1],A[0]-c),tb=Math.atan2(B[1],B[0]-c);geo=range(n+1).map(i=>{const t=lerp(ta,tb,i/n);return [c+r*Math.cos(t),r*Math.sin(t)]})}
  formula=Math.acosh(1+((B[0]-A[0])**2+(B[1]-A[1])**2)/(2*A[1]*B[1]))}
 else{const pa=D5_ll(.8*(A[1]-1.2)*D5_DEG,.7*A[0]*D5_DEG),pb=D5_ll(.8*(B[1]-1.2)*D5_DEG,.7*B[0]*D5_DEG),w=Math.acos(clamp(D5_dot(pa,pb),-1,1));
  geo=range(n+1).map(i=>{const t=i/n,p=w<1e-9?pa:D5_unit(D5_add(D5_mul(pa,Math.sin((1-t)*w)),D5_mul(pb,Math.sin(t*w))));return [Math.atan2(p[1],p[0])/.7,Math.asin(clamp(p[2],-1,1))/.8+1.2]});formula=w}
 return {A,B,straight,geo,ls:D5_mlen(m,straight),lg:D5_mlen(m,geo),formula}}
SCENE({id:'riemann-lecture',name:'Rulers that change from place to place',tag:'Riemann’s lecture, Göttingen, 10 June 1854',
 definition:'On 10 June 1854 Bernhard Riemann gave his habilitation lecture “On the hypotheses which lie at the foundations of geometry”, with Gauss in the audience; Dedekind published it in 1868. Riemann allowed any number of dimensions and let the rule for measuring a small step, ds² = Σ gᵢⱼ dxᵢ dxⱼ, vary from place to place. Coordinates only name points; this rule, now called the metric, decides all lengths, angles and curvature.',
 example:'Take one chart of numbers and give it three rulers. With the flat rule the shortest path is the straight line. With the half-plane rule ds² = (dx² + dy²)/y², steps near the bottom cost more, so shortest paths bow upwards into semicircles: this is hyperbolic geometry again. With the longitude–latitude rule of the sphere, they bow towards the poles, as great circles do on a flat world map.',
 desc:'A rectangular chart covered with small ellipses that all have the same length under the chosen metric, two chosen points A and B, the straight line between them in the chart and the shortest path under the metric. Tiles compare the two lengths with the formula for the shortest distance.',
 research:['Riemann (1868). Über die Hypothesen, welche der Geometrie zu Grunde liegen. Abhandlungen der Königlichen Gesellschaft der Wissenschaften zu Göttingen 13, 133–152 (lecture of 10 June 1854).','Clifford, transl. (1873). On the hypotheses which lie at the bases of geometry. Nature 8, 14–17, 36–37.','Lengths are integrated along each drawn path in 2000 steps using the chosen metric, and checked against the closed-form distance.'],
 dur:12,hint:'Choose a metric, then press dots to place A and B. The small ellipses all have the same length in that metric. Compare the straight chart line with the shortest path.',
 init:()=>({m:'half',a:36,b:44,sel:0}),
 watch:p=>({m:['flat','half','sphere'][Math.min(2,Math.floor(p*3))],a:p<.67?36:10,b:p<.67?44:16,sel:0}),
 ui:[{choose:[['flat','Flat'],['half','Half-plane'],['sphere','Sphere chart']],label:'Metric',get:s=>s.m,act:'m'},{b:'Swap A and B',act:'swap'}],
 on:{m(s,v){s.m=D5_MET[v]?v:'flat'},swap(s){[s.a,s.b]=[s.b,s.a]},pt(s,v){const i=clamp(Math.round(+v),0,D5_RGRID.length-1);if(s.sel===0){if(i!==s.b)s.a=i}else if(i!==s.a)s.b=i;s.sel=1-s.sel}},
 draw(s,f,X){
  const r=D5_riem(s.m,s.a,s.b),g=D5_MET[s.m].g,x0=24,y0=62,sc=78,S=p=>[x0+(p[0]+2)*sc,y0+(2.2-p[1])*sc];
  let out=heading(`${D5_MET[s.m].short}: shortest path ${D5_n(r.lg,3)}, straight line ${D5_n(r.ls,3)}`);
  out+=R(x0,y0,4*sc,2*sc,'#f7fafc',C.line,0)+TF(x0,y0-8,'the chart: x across, y up',13,C.muted,'start');
  for(let i=0;i<=8;i++)for(let j=0;j<=4;j++){const x=-2+i*.5,y=.2+j*.5+(j===4?-.06:0),G=g(x,y),e=.1,q=S([x,y]);out+=`<ellipse cx="${fmt(q[0])}" cy="${fmt(q[1])}" rx="${fmt(Math.min(36,e/Math.sqrt(G[0])*sc))}" ry="${fmt(Math.min(36,e/Math.sqrt(G[1])*sc))}" fill="${C.pale}" stroke="${C.line}" stroke-width="1"/>`}
  out+=`<clipPath id="d5cr"><rect x="${x0}" y="${y0}" width="${4*sc}" height="${2*sc}"/></clipPath>`+G(D5_poly(r.straight.filter((_,i)=>i%100===0).map(S),C.muted,2,D5_dash)+D5_poly(r.geo.filter((_,i)=>i%20===0).map(S),C.coral,3.2),'clip-path="url(#d5cr)"');
  D5_RGRID.forEach((p,i)=>{const q=S(p),on=i===s.a?C.green:i===s.b?C.purple:null;out+=hit(X,'pt',i,`Put ${s.sel?'B':'A'} at x ${p[0]}, y ${p[1]}`,Ci(q[0],q[1],on?7:3.5,on||'#8ea7b6','#fff'))});
  const qa=S(r.A),qb=S(r.B);out+=TBF(qa[0],qa[1]-12,'A',14,C.green)+TBF(qb[0],qb[1]-12,'B',14,C.purple);
  out+=TF(x0,y0+2*sc+22,'Each ellipse has radius 0.1 in this metric.',13,C.ink,'start')+TF(x0,y0+2*sc+40,'Dashed: straight in the chart. Coral: shortest.',13,C.ink,'start');
  const tx=360;out+=D5_tile(tx,62,222,'Straight line in the chart',D5_n(r.ls,3),C.muted)+D5_tile(tx,116,222,'Shortest path (coral)',D5_n(r.lg,3),C.coral)+D5_tile(tx,170,222,s.m==='half'?'arcosh formula':s.m==='sphere'?'great-circle angle':'Pythagoras',D5_n(r.formula,3),C.ink);
  out+=TF(tx,240,s.m==='flat'?'ds² = dx² + dy²':s.m==='half'?'ds² = (dx² + dy²) / y²':'ds² = 0.49 cos²(lat) dx²',15,C.blue,'start')+(s.m==='sphere'?TF(tx+34,258,'+ 0.64 dy²',15,C.blue,'start'):'');
  out+=TF(tx,282,s.m==='flat'?'K = 0 everywhere':s.m==='half'?'K = −1 everywhere':'K = +1 everywhere',13,C.ink,'start')+TF(tx,300,s.m==='sphere'?'longitude 0.7x, latitude 0.8(y − 1.2)':'',13,C.muted,'start');
  out+=D5_note('Same numbers, different rulers: the metric, not the chart, holds the geometry.',360);
  return {svg:out,phase:`Under the ${D5_MET[s.m].name.toLowerCase()} metric, the straight chart line from A to B has length ${D5_n(r.ls,3)} and the coral path ${D5_n(r.lg,3)}${s.m==='flat'?' (the same path)':''}; the distance formula gives ${D5_n(r.formula,3)}. ${s.m==='half'?'The ellipses shrink towards the bottom, where each step is long, so the shortest path climbs into a semicircle.':s.m==='sphere'?'The ellipses widen away from the middle, where a step in longitude is short, so the shortest path bows that way, as a great circle does.':'All the ellipses are equal circles, so straight is shortest.'} ${s.sel?'Press a dot for B.':'Press a dot for A.'}`};
 }});

// Independent components of the curvature tensor R_abcd in n dimensions, three ways: Riemann's count
// n²(n²−1)/12; pairs of index pairs, m(m+1)/2 with m = C(n,2), less the C(n,4) cyclic (Bianchi) conditions;
// and for n ≤ 4 by solving: n⁴ unknowns minus the rank of all the symmetry equations, by Gaussian elimination.
const D5_C=(n,k)=>{if(k<0||k>n)return 0;let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return Math.round(r)};
const D5_RANKS={};
function D5_solveCount(n){if(n in D5_RANKS)return D5_RANKS[n];const N=n**4,id=(a,b,c,d)=>((a*n+b)*n+c)*n+d,rows=[];
 for(let a=0;a<n;a++)for(let b=0;b<n;b++)for(let c=0;c<n;c++)for(let d=0;d<n;d++){const eq=(...terms)=>{const r=new Float64Array(N);for(const [k,v] of terms)r[k]+=v;if(r.some(x=>x!==0))rows.push(r)};
  eq([id(a,b,c,d),1],[id(b,a,c,d),1]);eq([id(a,b,c,d),1],[id(a,b,d,c),1]);eq([id(a,b,c,d),1],[id(c,d,a,b),-1]);eq([id(a,b,c,d),1],[id(a,c,d,b),1],[id(a,d,b,c),1])}
 let rank=0;for(let col=0;col<N&&rank<rows.length;col++){let piv=-1,best=1e-9;for(let i=rank;i<rows.length;i++)if(Math.abs(rows[i][col])>best){best=Math.abs(rows[i][col]);piv=i}
  if(piv<0)continue;[rows[rank],rows[piv]]=[rows[piv],rows[rank]];const pr=rows[rank];for(let i=0;i<rows.length;i++){if(i===rank)continue;const f=rows[i][col]/pr[col];if(f!==0)for(let j=col;j<N;j++)rows[i][j]-=f*pr[j]}rank++}
 return (D5_RANKS[n]=N-rank)}
function D5_comp(n){const m=D5_C(n,2);return {n,g:n*(n+1)/2,planes:m,riem:n*n*(n*n-1)/12,pairs:m*(m+1)/2-D5_C(n,4),solved:n<=4?D5_solveCount(n):null,ricci:n*(n+1)/2}}
SCENE({id:'riemann-lecture-components',name:'How many numbers describe curvature?',tag:'Riemann 1854; Christoffel 1869',
 definition:'Riemann measured curvature at a point by taking every two-dimensional direction through it, a plane of directions, and asking how curved the surface of geodesics in that plane is. In two dimensions one number does it: Gauss’s K. In n dimensions the full description, the curvature tensor written out by Christoffel (1869) and later by Ricci and Levi-Civita, has n²(n²−1)/12 independent numbers at each point.',
 get example(){const c3=D5_comp(3),c4=D5_comp(4);return `In 3 dimensions that is ${c3.riem} numbers, in 4 it is ${c4.riem}. In 4-dimensional spacetime, Einstein’s equations (1915) fix ${c4.ricci} of them from the matter present (the Ricci part); the other ${c4.riem-c4.ricci} (the Weyl part) can be non-zero in empty space and describe tides and gravitational waves. In 3 dimensions the Weyl part has ${c3.riem-c3.ricci} numbers: there the Ricci part says everything.`},
 desc:'A table for dimensions 1 to 8: the number of metric components, of planes of directions through a point, and of independent curvature components counted three ways, with the chosen dimension highlighted and bars comparing the counts.',
 research:['Riemann (1868), as above: curvature measured in each two-dimensional direction through a point.','Christoffel (1869). Ueber die Transformation der homogenen Differentialausdrücke zweiten Grades. Journal für die reine und angewandte Mathematik 70, 46–70.','Ricci & Levi-Civita (1900). Méthodes de calcul différentiel absolu et leurs applications. Mathematische Annalen 54, 125–201.','For n ≤ 4 the count is also found by solving every symmetry equation of R_abcd by Gaussian elimination.'],
 dur:10,hint:'Choose a number of dimensions. Each column is computed: by Riemann’s formula, by counting pairs of planes, and for 4 or fewer by solving the symmetry equations.',
 init:()=>({n:4}),
 watch:p=>({n:1+Math.min(7,Math.floor(p*8))}),
 ui:[{range:'n',label:'Dimensions n',min:1,max:8,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),1,8)}},
 draw(s){
  const c=D5_comp(s.n),rows=range(8).map(i=>D5_comp(i+1));
  let out=heading(`n = ${s.n}: curvature needs ${c.riem} number${c.riem===1?'':'s'} at each point`);
  const cols=[['n',40],['metric',112],['planes',184],['n²(n²−1)/12',276],['pairs − C(n,4)',388],['solved',488],['agree',552]];
  out+=R(18,46,564,26,C.pale,'none',6);cols.forEach(([h,x])=>{out+=TBF(x,64,h,13,C.ink)});
  rows.forEach((r,i)=>{const y=92+i*24,on=r.n===s.n;if(on)out+=R(18,y-17,564,24,C.coralp,'none',5);
   const ok=r.riem===r.pairs&&(r.solved===null||r.solved===r.riem);
   [r.n,r.g,r.planes,r.riem,r.pairs,r.solved===null?'–':r.solved,ok?'✓':'✗'].forEach((v,j)=>{out+=TF(cols[j][1],y,String(v),13,j===6?(ok?C.green:C.coral):j===3?C.coral:C.ink)})});
  // bars for the chosen n
  const bx=150,by=296,mx=Math.max(c.riem,c.g,c.planes,1),bw=v=>v/mx*300,bars=[['metric numbers',c.g,C.blue],['planes of directions',c.planes,C.green],['curvature numbers',c.riem,C.coral]];
  bars.forEach(([l,v,col],i)=>{const y=by+i*22;out+=TF(bx-8,y+12,l,13,C.muted,'end')+R(bx,y,Math.max(2,bw(v)),16,col,'none',3)+TBF(bx+bw(v)+8,y+13,String(v),13,col,'start')});
  out+=D5_note(s.n>=3?`Of the ${c.riem}, the Ricci part has ${c.ricci} and the Weyl part ${c.riem-c.ricci}.`:'With n < 3 there is no Weyl part; in 2D, one number, Gauss’s K.',372);
  return {svg:out,phase:`In ${s.n} dimension${s.n===1?'':'s'} the metric has ${c.g} component${c.g===1?'':'s'} at each point and there ${c.planes===1?'is':'are'} ${c.planes} independent plane${c.planes===1?'':'s'} of directions. The curvature tensor has ${c.riem} independent component${c.riem===1?'':'s'}: Riemann’s formula, the count of symmetric pairs of planes less the ${D5_C(s.n,4)} cyclic condition${D5_C(s.n,4)===1?'':'s'}, ${c.solved===null?'agree':`and ${c.solved} left free after solving all the symmetry equations, all agree`}. ${s.n===1?'A curve has no curvature that an inhabitant could detect: it can always be straightened.':''}`.trim()};
 }});

// Sectional curvature in a 3-dimensional space: K(σ) = R(u,v,u,v)/(|u|²|v|² − (u·v)²) for the plane σ spanned by u, v,
// with R built from the space's curvature tensor. In S² × ℝ the tensor comes only from the sphere directions (x, y).
function D5_Rten(space){const R=(a,b,c,d)=>{const dl=(i,j)=>i===j?1:0,k=space==='S3'?1:space==='H3'?-1:space==='E3'?0:1;
  if(space==='S2R'&&(a>1||b>1||c>1||d>1))return 0;return k*(dl(a,c)*dl(b,d)-dl(a,d)*dl(b,c))};return R}
function D5_sect(space,tau){const n=[Math.sin(tau/D5_DEG),0,Math.cos(tau/D5_DEG)],u=[0,1,0],v=D5_cross(n,u),R=D5_Rten(space);let s=0;
 for(let a=0;a<3;a++)for(let b=0;b<3;b++)for(let c=0;c<3;c++)for(let d=0;d<3;d++)s+=R(a,b,c,d)*u[a]*v[b]*u[c]*v[d];return {K:s/(D5_dot(u,u)*D5_dot(v,v)-D5_dot(u,v)**2),n,u,v}}
const D5_SPACES={E3:['Euclidean space',C.ink],S3:['3-sphere',C.blue],H3:['hyperbolic space',C.coral],S2R:['S² × ℝ',C.purple]};
SCENE({id:'riemann-lecture-sectional',name:'Curvature in every direction',tag:'Sectional curvature',
 definition:'In a space of three or more dimensions, curvature can differ from one plane of directions to another. Riemann’s measure for a plane σ through a point is the Gaussian curvature of the surface made by all geodesics leaving the point in σ, now called the sectional curvature K(σ). Spaces where it is the same in every plane at every point have constant curvature: Euclidean space (0), the 3-sphere (positive) and hyperbolic space (negative).',
 example:'S² × ℝ, a sphere stretched along an extra straight direction, is not like that. A plane of directions lying along the sphere has K = 1; one that contains the straight direction has K = 0; tilted planes fall in between, as cos² of the tilt. It is one of Thurston’s eight model geometries for three-dimensional spaces.',
 desc:'Three axes, two along a sphere and one straight, with a small tilted plane of directions through the point. A graph shows the sectional curvature against the tilt for four spaces, with the chosen space and tilt marked, and tiles give the value and what an inhabitant would measure on a small circle.',
 research:['Riemann (1868), as above.','Thurston (1982). Three dimensional manifolds, Kleinian groups and hyperbolic geometry. Bulletin of the American Mathematical Society 6, 357–381: the eight model geometries, including S² × ℝ.','K(σ) is computed by contracting the space’s curvature tensor with two vectors spanning the plane; the circle reading uses the first-order formula C ≈ 2πr(1 − Kr²/6).'],
 dur:10,hint:'Choose a space and tilt the plane of directions from lying along the sphere (0°) to containing the straight direction (90°).',
 init:()=>({sp:'S2R',tau:30}),
 watch:p=>({sp:p<.75?'S2R':'S3',tau:Math.round(90*smooth(p<.75?p/.7:(p-.75)*4)/5)*5}),
 ui:[{choose:Object.keys(D5_SPACES).map(k=>[k,D5_SPACES[k][0]]),label:'Space',get:s=>s.sp,act:'sp'},{range:'tau',label:'Tilt of the plane',min:0,max:90,step:5,get:s=>s.tau,act:'tau',show:v=>v+'°'}],
 on:{sp(s,v){s.sp=D5_SPACES[v]?v:'S2R'},tau(s,v){s.tau=clamp(Math.round(+v/5)*5,0,90)}},
 draw(s){
  const r=D5_sect(s.sp,s.tau),col=D5_SPACES[s.sp][1];
  let out=heading(`${D5_SPACES[s.sp][0]}: K = ${D5_n(r.K,3)} in this plane`);
  // axes picture (fixed oblique projection)
  const ox=150,oy=200,Pj=p=>[ox+90*p[0]-50*p[1],oy+28*p[1]+0*p[0]-100*p[2]+22*p[0]];
  out+=R(18,46,264,262,'#fff',C.grid,8);
  for(const [v,l,c2] of [[[1.2,0,0],s.sp==='S2R'?'S²':'x',C.muted],[[0,1.4,0],s.sp==='S2R'?'S²':'y',C.muted],[[0,0,1.1],s.sp==='S2R'?'ℝ, straight':'z',C.muted]]){const a=Pj([0,0,0]),b=Pj(v);out+=arrow(a[0],a[1],b[0],b[1],c2,2)+TF(b[0]+(v[1]?-6:6),b[1]+(v[2]?-8:16),l,13,c2,v[1]?'end':'start')}
  const sq=[[1,1],[1,-1],[-1,-1],[-1,1]].map(([a,b])=>D5_add(D5_mul(r.u,.55*a),D5_mul(r.v,.55*b)));
  out+=D5_poly(sq.map(Pj),col,2.2,'',tint(col,.75),true);
  const nb=Pj(D5_mul(r.n,.9)),o=Pj([0,0,0]);out+=arrow(o[0],o[1],nb[0],nb[1],C.ink,1.6)+TF(nb[0]+8,nb[1],'normal',13,C.ink,'start')+Ci(o[0],o[1],4,C.ink);
  out+=TF(150,296,`the plane σ, tilted ${s.tau}°`,13,col);
  // graph K against tilt for the four spaces
  const gx=310,gy=52,gw=272,gh=160,Xg=t=>gx+16+t/90*(gw-32),Yg=k=>gy+gh/2-k*(gh/2-18);
  out+=R(gx,gy,gw,gh,'#fff',C.grid,8)+L(gx+10,Yg(0),gx+gw-10,Yg(0),C.grid,1.2)+TF(gx-4,Yg(1)+4,'+1',13,C.muted,'end')+TF(gx-4,Yg(-1)+4,'−1',13,C.muted,'end')+TF(gx-4,Yg(0)+4,'0',13,C.muted,'end');
  for(const k of Object.keys(D5_SPACES)){const on=k===s.sp;out+=D5_poly(range(19).map(i=>[Xg(i*5),Yg(D5_sect(k,i*5).K)+(k==='S3'?-2:0)]),D5_SPACES[k][1],on?3:1.4,on?'':'stroke-opacity=".55"')}
  out+=Ci(Xg(s.tau),Yg(r.K)+(s.sp==='S3'?-2:0),6,col,'#fff')+TF(gx+gw/2,gy+gh+16,'K against tilt, 0° to 90°',13,C.muted);
  const rho=.5,circ=2*D5_PI*rho*(1-r.K*rho*rho/6);
  out+=D5_tile(310,240,132,'K(σ)',D5_n(r.K,3),col)+D5_tile(450,240,132,'cos²(tilt)',D5_n(Math.cos(s.tau/D5_DEG)**2,3),C.muted);
  out+=TF(310,310,`Circle of radius 0.5 in σ: about ${D5_n(circ,3)}`,13,C.ink,'start')+TF(310,328,`(in flat space ${D5_n(2*D5_PI*rho,3)})`,13,C.ink,'start');
  out+=D5_note('Curvature radius 1 in the curved spaces.',362);
  return {svg:out,phase:s.sp==='S2R'?`In S² × ℝ the plane tilted ${s.tau}° has sectional curvature ${D5_n(r.K,3)}, from the curvature tensor; cos² of the tilt is ${D5_n(Math.cos(s.tau/D5_DEG)**2,3)}. Lying along the sphere it is 1; containing the straight direction it is 0. One number per point cannot describe this space: Riemann needed one for every plane.`:`In ${D5_SPACES[s.sp][0]} every plane through every point has the same curvature, ${D5_n(r.K,3)}: tilting changes nothing. These are the spaces of constant curvature, the three-dimensional versions of the plane, the sphere and the hyperbolic plane.`};
 }});

/* ===================== Lesson: spacetime ===================== */
// Units of years and light-years, so the speed of light is 1. A frame moving at velocity v sees an event (t, x) at
// t′ = γ(t − vx), x′ = γ(x − vt) with γ = 1/√(1 − v²) (the Lorentz transformation).
const D5_EVENTS={time:{t:4,x:1.5,name:'timelike'},space:{t:1.5,x:3.5,name:'spacelike'},light:{t:3,x:3,name:'lightlike'}};
const D5_boost=(t,x,v)=>{const g=1/Math.sqrt(1-v*v);return [g*(t-v*x),g*(x-v*t)]};
// Minkowski diagram: x from −4 to 4 across, t from 0 to 5 up.
const D5_MK={x0:20,y0:252,sc:36.5};
const D5_mk=(t,x)=>[D5_MK.x0+(x+4)*D5_MK.sc,D5_MK.y0-t*D5_MK.sc];
function D5_minkFrame(v,col=C.purple){let out=`<clipPath id="d5ck"><rect x="${D5_MK.x0}" y="${D5_MK.y0-5*D5_MK.sc}" width="${8*D5_MK.sc}" height="${5*D5_MK.sc}"/></clipPath>`,g='';
 const inv=(tp,xp)=>{const gm=1/Math.sqrt(1-v*v);return [gm*(tp+v*xp),gm*(xp+v*tp)]};
 if(Math.abs(v)>1e-9){for(let k=-6;k<=8;k++){const a=inv(k,-12),b=inv(k,12);g+=L(...D5_mk(...a),...D5_mk(...b),tint(col,.7),1,'stroke-dasharray="3 4"');const c=inv(-12,k),d=inv(12,k);g+=L(...D5_mk(...c),...D5_mk(...d),tint(col,.7),1,'stroke-dasharray="3 4"')}
  g+=L(...D5_mk(...inv(0,-12)),...D5_mk(...inv(0,12)),col,2)+L(...D5_mk(...inv(-12,0)),...D5_mk(...inv(12,0)),col,2)}
 return out+G(g,'clip-path="url(#d5ck)"')}
function D5_minkBase(){const {x0,y0,sc}=D5_MK;let out=R(x0,y0-5*sc,8*sc,5*sc,'#fbfcfd',C.grid,0);
 for(let x=-4;x<=4;x++)out+=L(...D5_mk(0,x),...D5_mk(5,x),C.grid,1);for(let t=1;t<=5;t++)out+=L(...D5_mk(t,-4),...D5_mk(t,4),C.grid,1);
 out+=L(...D5_mk(0,0),...D5_mk(5,0),C.ink,2)+L(...D5_mk(0,-4),...D5_mk(0,4),C.ink,2)+L(...D5_mk(0,0),...D5_mk(4,4),C.amber,2.2)+L(...D5_mk(0,0),...D5_mk(4,-4),C.amber,2.2);
 out+=TF(D5_mk(5,0)[0]+6,D5_mk(5,0)[1]+14,'t (years)',13,C.ink,'start')+TF(D5_mk(0,4)[0]-2,D5_mk(0,4)[1]+16,'x (light-years)',13,C.ink,'end')+TF(D5_mk(4,-4)[0]+4,D5_mk(4,-4)[1]-4,'light',13,C.amber,'start');return out}
SCENE({id:'spacetime',name:'The interval every observer agrees on',tag:'Einstein 1905, Minkowski 1908',
 definition:'In special relativity (Einstein, 1905) observers moving relative to each other disagree about the time between two events and the distance between them. In his lecture “Raum und Zeit” (Cologne, 1908) Hermann Minkowski showed that they agree on one combination, the interval s² = (ct)² − x² − y² − z², and treated events as points of a four-dimensional spacetime with that rule for “distance”.',
 example:'Time here is a fourth coordinate, not a fourth direction of space: its square enters with the opposite sign, so the geometry is not Euclidean. The “fourth dimension” in the rest of this course is spatial. For the physics, see Physics In Motion’s lessons on special and general relativity.',
 desc:'A spacetime diagram with time up and one direction of space across, light paths at 45°, and an event. A second set of axes and grid lines shows how a frame moving at the chosen velocity labels the same events. Tiles give the event’s coordinates in both frames, the interval in both, and the Euclidean t² + x² for contrast.',
 research:['Einstein (1905). Zur Elektrodynamik bewegter Körper. Annalen der Physik 17, 891–921.','Minkowski (1909). Raum und Zeit. Physikalische Zeitschrift 10, 104–111 (lecture of 21 September 1908, Cologne).','Poincaré (1906). Sur la dynamique de l’électron. Rendiconti del Circolo Matematico di Palermo 21, 129–176: had already noted the invariant, using an imaginary time coordinate.','Coordinates are transformed by the Lorentz formulas and the interval is computed in each frame.'],
 dur:12,hint:'Choose an event and the velocity of the second observer (as a fraction of the speed of light). Watch both coordinates change while the interval stays the same. Switch to 3D to add a second direction of space.',
 init:()=>({v:5,ev:'time'}),
 watch:p=>({v:Math.round(8*Math.sin(2*D5_PI*(p*3%1))),ev:['time','space','light'][Math.min(2,Math.floor(p*3))]}),
 ui:[{choose:Object.keys(D5_EVENTS).map(k=>[k,D5_EVENTS[k].name[0].toUpperCase()+D5_EVENTS[k].name.slice(1)]),label:'Event',get:s=>s.ev,act:'ev'},{range:'v',label:'Observer’s velocity',min:-8,max:8,get:s=>s.v,act:'v',show:v=>D5_n(v/10,1)+'c'}],
 on:{ev(s,v){s.ev=D5_EVENTS[v]?v:'time'},v(s,v){s.v=clamp(Math.round(+v),-8,8)}},
 draw(s){
  const v=s.v/10,E=D5_EVENTS[s.ev],[tp,xp]=D5_boost(E.t,E.x,v),s2=E.t*E.t-E.x*E.x,s2p=tp*tp-xp*xp,eu=E.t*E.t+E.x*E.x,eup=tp*tp+xp*xp;
  let out=heading(`s² = ${D5_n(s2)} in both frames; t² + x² goes from ${D5_n(eu)} to ${D5_n(eup)}`);
  out+=D5_minkBase()+D5_minkFrame(v);
  const e=D5_mk(E.t,E.x),o=D5_mk(0,0);out+=L(o[0],o[1],e[0],e[1],C.coral,1.6,D5_dash)+Ci(e[0],e[1],7,C.coral,'#fff')+TBF(e[0]+10,e[1]-8,'E',15,C.coral,'start')+Ci(o[0],o[1],5,C.ink)+TF(o[0]+8,o[1]-6,'O',13,C.ink,'start');
  if(Math.abs(v)>1e-9){const a=D5_mk(4,4*v);out+=TF(a[0]+(v>0?6:-6),a[1],'t′',14,C.purple,v>0?'start':'end')}
  const x0=330;
  out+=TBF(x0,62,'Coordinates of E',13,C.ink,'start');
  out+=D5_tile(x0,70,124,'Ours: t, x',`${D5_n(E.t)}, ${D5_n(E.x)}`,C.ink)+D5_tile(x0+128,70,124,`At ${D5_n(v,1)}c: t′, x′`,`${D5_n(tp)}, ${D5_n(xp)}`,C.purple);
  out+=D5_tile(x0,124,124,'s² = t² − x²',D5_n(s2,3),C.coral)+D5_tile(x0+128,124,124,'s² = t′² − x′²',D5_n(s2p,3),C.coral);
  out+=D5_tile(x0,178,124,'t² + x²',D5_n(eu,3),C.muted)+D5_tile(x0+128,178,124,'t′² + x′²',D5_n(eup,3),C.muted);
  out+=TF(x0,240,`E is ${E.name} from O:`,13,C.ink,'start')+TF(x0,256,s2>1e-9?'one could travel there.':s2<-1e-9?'no signal could connect them.':'a light signal connects them.',13,C.ink,'start');
  out+=TF(x0,276,`γ = 1/√(1 − v²) = ${D5_n(1/Math.sqrt(1-v*v),3)}`,13,C.purple,'start');
  out+=TF(x0,298,'Purple: the moving observer’s time axis',13,C.purple,'start')+TF(x0,314,'and lines of equal t′ and equal x′.',13,C.purple,'start');
  out+=D5_note('Units: years and light-years, so light moves 1 across for 1 up.',360);
  return {svg:out,phase:`For us, E happens ${D5_n(E.t)} years after O and ${D5_n(E.x)} light-years away. An observer moving at ${D5_n(v,1)}c labels it ${D5_n(tp)} years and ${D5_n(xp)} light-years. Both get s² = t² − x² = ${D5_n(s2,3)}, while the Euclidean t² + x² changes from ${D5_n(eu,3)} to ${D5_n(eup,3)}. The interval, with its minus sign, is the geometry of spacetime.`};
 },
 three(s){
  const v=s.v/10,E=D5_EVENTS[s.ev],Pr=makeProject([-4,4,-4,4,0,4.6]),tE=(E.t-v*E.x);let out='';
  for(let t=1;t<=4;t++)out+=D5_poly(range(73).map(i=>Pr([t*Math.cos(i*D5_PI/36),t*Math.sin(i*D5_PI/36),t])),C.amber,t===4?2:1.2);
  for(let k=0;k<12;k++){const a=k*D5_PI/6;out+=line3([0,0,0],[4*Math.cos(a),4*Math.sin(a),4],Pr,tint(C.amber,.4),1.2)}
  out+=arrow3([0,0,0],[0,0,4.6],Pr,C.ink,2)+arrow3([0,0,0],[4,0,0],Pr,C.ink,1.6)+arrow3([0,0,0],[0,4,0],Pr,C.ink,1.6);
  const q1=Pr([0,0,4.6]),q2=Pr([4,0,0]),q3=Pr([0,4,0]);out+=TF(q1[0],q1[1]-8,'t',14,C.ink)+TF(q2[0]+10,q2[1],'x',14,C.ink)+TF(q3[0]-10,q3[1],'y',14,C.ink);
  // the moving observer's "now" through E: all events with t − v·x = tE (a tilted plane)
  const pl=[[-3,-3],[3,-3],[3,3],[-3,3]].map(([x,y])=>[x,y,tE+v*x]).filter(p=>true);out+=poly3(pl,Pr,C.purple,C.purple,'fill-opacity=".14"');
  out+=line3([0,0,0],[E.x,0,E.t],Pr,C.coral,1.6,D5_dash)+point3([E.x,0,E.t],Pr,C.coral,7)+point3([0,0,0],Pr,C.ink,5);
  return {svg:out,title:'The light cone, with a second direction of space',caption:`The amber cone holds every event that light from O can reach; one space direction was left out of the flat picture. The purple plane is the moving observer’s “now” through E (all events with t′ = ${D5_n(D5_boost(E.t,E.x,v)[0])}): tilted by their velocity, ${D5_n(v,1)}c.`};
 }});

// A boost is a hyperbolic rotation: with rapidity φ (v = tanh φ) it sends (t, x) to (t cosh φ − x sinh φ, x cosh φ − t sinh φ),
// keeping t² − x², as a rotation by θ keeps x² + y². Composing boosts adds rapidities; velocities combine by
// multiplying the 2 × 2 matrices.
const D5_mat=(v)=>{const g=1/Math.sqrt(1-v*v);return [[g,-g*v],[-g*v,g]]};
const D5_mmul=(A,B)=>[[A[0][0]*B[0][0]+A[0][1]*B[1][0],A[0][0]*B[0][1]+A[0][1]*B[1][1]],[A[1][0]*B[0][0]+A[1][1]*B[1][0],A[1][0]*B[0][1]+A[1][1]*B[1][1]]];
function D5_compose(steps){let M=[[1,0],[0,1]],v=0;for(const st of steps){M=D5_mmul(D5_mat(st),M);v=(v+st)/(1+v*st)}return {M,v:-M[0][1]/M[0][0],vf:v,phi:sum(steps.map(Math.atanh)),naive:sum(steps)}}
SCENE({id:'spacetime-hyperbola',name:'A boost is a hyperbolic rotation',tag:'Minkowski 1908; rapidity',
 definition:'A rotation of the plane moves every point along a circle x² + y² = constant. A change of observer, a boost, moves every event along a hyperbola t² − x² = constant, the curve of equal interval. Measured by its rapidity φ, with v = tanh φ, a boost behaves like a rotation by an angle: two boosts in the same direction add their rapidities, just as two rotations add their angles.',
 get example(){const c=D5_compose([.5,.5]);return `Velocities do not add. Two boosts of half the speed of light give not 1c but (0.5 + 0.5)/(1 + 0.5 × 0.5) = ${D5_n(c.vf,1)}c, and no number of them ever reaches the speed of light, because rapidities add while v = tanh φ stays below 1. Einstein gave this velocity-addition rule in 1905; the hyperbolic picture is Minkowski’s.`},
 desc:'Twelve points moving together: in rotation mode on a circle about the origin, in boost mode on hyperbolas of equal interval inside and outside the light lines. Each point is labelled with its computed invariant. Tiles track the total rotation or the combined velocity after repeated steps, by matrix product and by formula.',
 research:['Minkowski (1909), as above.','Einstein (1905), as above: the addition theorem of velocities (section 5).','Each step multiplies a 2 × 2 boost matrix; the combined velocity is read from the product and checked against (u + v)/(1 + uv) and tanh of the summed rapidities.'],
 dur:12,hint:'Choose rotation or boost, then press the step buttons. Every point keeps its own value of x² + y² or t² − x², while the combined velocity creeps towards, but never reaches, 1c.',
 init:()=>({mode:'boost',steps:[]}),
 watch:p=>p<.3?{mode:'rotate',steps:range(Math.floor(p/.3*4)).map(()=>.5)}:{mode:'boost',steps:range(Math.min(5,Math.floor((p-.3)/.7*6))).map(()=>.5)},
 ui:[{choose:[['rotate','Rotation'],['boost','Boost']],label:'Kind',get:s=>s.mode,act:'mode'},{b:'Step +',act:'up'},{b:'Step −',act:'down'},{b:'Back to start',act:'clear'}],
 on:{mode(s,v){s.mode=v==='rotate'?'rotate':'boost';s.steps=[]},up(s){if(s.steps.length<9)s.steps=s.steps.concat([.5])},down(s){if(s.steps.length<9)s.steps=s.steps.concat([-.5])},clear(s){s.steps=[]}},
 draw(s){
  const rot=s.mode==='rotate',cx=170,cy=204,sc=36,c=D5_compose(s.steps);
  // rotation steps are 30° each (sign from the button); boost steps are 0.5c each
  const th=sum(s.steps.map(x=>Math.sign(x)))*D5_PI/6,phi=c.phi,S=(a,b)=>[cx+a*sc,cy-b*sc];
  let out=heading(rot?`Turned ${D5_d(th,0)}: every point keeps x² + y²`:`Combined velocity ${D5_n(c.v,4)}c after ${s.steps.length} boost${s.steps.length===1?'':'s'}`);
  out+=`<clipPath id="d5ch"><rect x="${cx-4*sc}" y="${cy-4*sc}" width="${8*sc}" height="${8*sc}"/></clipPath>`+R(cx-4*sc,cy-4*sc,8*sc,8*sc,'#fbfcfd',C.grid,0)+L(cx-4*sc,cy,cx+4*sc,cy,C.ink,1.4)+L(cx,cy-4*sc,cx,cy+4*sc,C.ink,1.4);let hy='';
  out+=TF(cx+4*sc-4,cy+16,rot?'x':'x',13,C.ink,'end')+TF(cx+6,cy-4*sc+14,rot?'y':'t',13,C.ink,'start');
  let pts=[],inv=[];
  if(rot){out+=Ci(cx,cy,2*sc,'none',C.line,'stroke-dasharray="4 4"');pts=range(12).map(k=>{const a=k*D5_PI/6+th;return [2*Math.cos(a),2*Math.sin(a)]});inv=pts.map(p=>p[0]*p[0]+p[1]*p[1])}
  else{out+=L(cx-4*sc,cy+4*sc,cx+4*sc,cy-4*sc,C.amber,1.6)+L(cx-4*sc,cy-4*sc,cx+4*sc,cy+4*sc,C.amber,1.6);
   for(const sg of [1,-1]){hy+=D5_poly(range(41).map(i=>{const e=-1.4+i*.07;return S(2*Math.sinh(e),sg*2*Math.cosh(e))}),C.line,1.4,'stroke-dasharray="4 4"')+D5_poly(range(41).map(i=>{const e=-1.4+i*.07;return S(sg*2*Math.cosh(e),2*Math.sinh(e))}),C.line,1.4,'stroke-dasharray="4 4"')}
   const base=[].concat(...[-.6,0,.6].map(e=>[[2*Math.cosh(e),2*Math.sinh(e)],[-2*Math.cosh(e),-2*Math.sinh(e)],[2*Math.sinh(e),2*Math.cosh(e)],[-2*Math.sinh(e),-2*Math.cosh(e)]]));
   pts=base.map(([t,x])=>{const M=c.M;return [M[1][0]*t+M[1][1]*x,M[0][0]*t+M[0][1]*x]}).map(([x,t])=>[x,t]);inv=pts.map(p=>p[1]*p[1]-p[0]*p[0])}
  out+=G(hy,'clip-path="url(#d5ch)"');let g='';pts.forEach((p,i)=>{const q=S(p[0],p[1]);g+=Ci(q[0],q[1],5.5,i===0?C.coral:C.blue,'#fff')});out+=G(g,'clip-path="url(#d5ch)"');
  const vals=[...new Set(inv.map(x=>D5_n(x,3)))];
  const x0=346;out+=TBF(x0,62,rot?'x² + y² of the 12 points:':'t² − x² of the 12 points:',13,C.ink,'start')+TF(x0,82,vals.join(', '),13,C.blue,'start');
  if(rot){out+=D5_tile(x0,100,236,'Total turn',D5_d(th,0),C.ink)+TF(x0,176,'Each step turns by 30°;',13,C.ink,'start')+TF(x0,194,'angles simply add.',13,C.ink,'start')}
  else{out+=D5_tile(x0,100,236,'Combined velocity (matrix product)',D5_n(c.v,4)+'c',C.coral)+D5_tile(x0,154,116,'(u + v)/(1 + uv)',D5_n(c.vf,4)+'c',C.ink)+D5_tile(x0+120,154,116,'tanh(Σφ)',D5_n(Math.tanh(phi),4)+'c',C.ink);
   out+=D5_tile(x0,208,116,'Rapidities add',`φ = ${D5_n(phi,3)}`,C.purple)+D5_tile(x0+120,208,116,'Naive sum of v',D5_n(c.naive,1)+'c',C.muted);
   out+=TF(x0,280,'Each step is a boost of 0.5c',13,C.ink,'start')+TF(x0,298,'relative to the last frame.',13,C.ink,'start')}
  out+=D5_note(rot?'Points slide along the circle; the circle stays.':'Points slide along the hyperbolas; the light lines stay put.',368);
  return {svg:out,phase:rot?`After ${s.steps.length} step${s.steps.length===1?'':'s'} the points have turned ${D5_d(th,0)}, and each still has x² + y² = ${vals.join(', ')}.`:
   `After ${s.steps.length} boost${s.steps.length===1?'':'s'} of 0.5c, multiplying the matrices gives a combined velocity of ${D5_n(c.v,4)}c; Einstein’s rule gives ${D5_n(c.vf,4)}c and tanh of the summed rapidity ${D5_n(phi,3)} gives ${D5_n(Math.tanh(phi),4)}c. Simply adding would give ${D5_n(c.naive,1)}c. Every point slid along its hyperbola and kept t² − x² = ${vals.join(', ')}.`};
 }});

// Proper time along a worldline: the sum over 2000 steps of √(dt² − dx²). Ten years at home; the traveller goes out
// to distance X and back, either turning sharply at t = 5 or moving smoothly as x = X·sin(πt/10).
function D5_twin(X,path){const n=2000,pts=range(n+1).map(i=>{const t=10*i/n;return [t,path==='sharp'?X*(1-Math.abs(t-5)/5):X*Math.sin(D5_PI*t/10)]});
 let tau=0,eu=0,vmax=0;for(let i=1;i<=n;i++){const dt=pts[i][0]-pts[i-1][0],dx=pts[i][1]-pts[i-1][1];vmax=Math.max(vmax,Math.abs(dx/dt));tau+=Math.sqrt(Math.max(0,dt*dt-dx*dx));eu+=Math.hypot(dt,dx)}
 return {pts,tau,eu,vmax,ok:vmax<1-1e-9}}
SCENE({id:'spacetime-twins',name:'The straight worldline is the longest',tag:'Proper time; Hafele and Keating, 1971',
 definition:'The time a clock records along its path through spacetime, its proper time, is the sum of √(dt² − dx²) along the path. In Euclid’s plane a straight line is the shortest path between two points. In Minkowski’s spacetime, because of the minus sign, the straight worldline between two events records the most time, and any path that moves away and comes back records less.',
 example:'A twin who travels out and back is younger on return than the one who stayed home. Clocks flown round the world in 1971 by Hafele and Keating disagreed with clocks on the ground by tens to hundreds of nanoseconds, as predicted once the effect of gravity, which general relativity adds, was included. In general relativity (Einstein, 1915) spacetime is curved, and falling bodies follow the worldlines of greatest proper time: its geodesics.',
 desc:'A spacetime diagram with the home twin’s straight worldline and the traveller’s bent one, sharp or smooth, between the same two events. Tiles give the proper time of each and, for contrast, the Euclidean length of each line as drawn.',
 research:['Einstein (1905), as above: a clock moved round a closed path and back lags behind one that stayed put (section 4).','Hafele & Keating (1972). Around-the-world atomic clocks: predicted relativistic time gains; observed relativistic time gains. Science 177, 166–168 and 168–170.','Proper times are summed along each worldline in 2000 steps.'],
 dur:12,hint:'Set how far the traveller goes and whether the turn is sharp or smooth. Compare proper time (what each clock shows) with the length of each line as drawn on the page.',
 init:()=>({X:6,path:'sharp'}),
 watch:p=>({X:Math.round(8*smooth(p<.6?p/.6:1)),path:p<.6?'sharp':'smooth'}),
 ui:[{range:'X',label:'How far out',min:0,max:9,get:s=>s.X,act:'X',show:v=>D5_n(v/2,1)+' ly'},{choose:[['sharp','Sharp turn'],['smooth','Smooth path']],label:'Path',get:s=>s.path,act:'path'}],
 on:{X(s,v){s.X=clamp(Math.round(+v),0,9)},path(s,v){s.path=v==='smooth'?'smooth':'sharp'}},
 draw(s){
  const X=s.X/2,tw=D5_twin(X,s.path),home=D5_twin(0,'sharp'),sc=28,ox=140,oy=338,S=(t,x)=>[ox+x*sc,oy-t*sc];
  let out=heading(!tw.ok?`Too fast: that path needs ${D5_n(tw.vmax,2)}c`:X===0?'Both stay home: 10 years each':`Home: ${D5_n(home.tau,2)} years; traveller: ${D5_n(tw.tau,2)} years`);
  out+=R(ox-2*sc,oy-10*sc,8*sc,10*sc,'#fbfcfd',C.grid,0);for(let t=1;t<10;t++)out+=L(ox-2*sc,oy-t*sc,ox+6*sc,oy-t*sc,C.grid,1);
  out+=L(...S(0,0),...S(5,5),C.amber,1.4,'stroke-dasharray="3 3"')+L(...S(5,5),...S(10,0),C.amber,1.4,'stroke-dasharray="3 3"');
  out+=L(...S(0,0),...S(10,0),C.blue,3.2)+D5_poly(tw.pts.filter((_,i)=>i%25===0).map(p=>S(p[0],p[1])),tw.ok?C.coral:C.coral,3.2,tw.ok?'':D5_dash);
  out+=Ci(...S(0,0),6,C.ink)+Ci(...S(10,0),6,C.ink)+TF(S(0,0)[0]-8,S(0,0)[1]+4,'part',13,C.ink,'end')+TF(S(10,0)[0]-8,S(10,0)[1]+4,'meet',13,C.ink,'end');
  out+=TF(S(3,3.2)[0]+6,S(3,3.2)[1],'light',13,C.amber,'start');
  out+=TF(ox+6*sc,oy-10*sc-6,'t up to 10 years, x across',13,C.muted,'end');
  const x0=336;out+=D5_tile(x0,60,120,'Home clock',D5_n(home.tau,3)+' y',C.blue)+D5_tile(x0+126,60,120,'Traveller’s clock',tw.ok?D5_n(tw.tau,3)+' y':'impossible',C.coral);
  out+=D5_tile(x0,114,120,'Home, as drawn',D5_n(home.eu,3),C.muted)+D5_tile(x0+126,114,120,'Traveller, drawn',D5_n(tw.eu,3),C.muted);
  out+=D5_tile(x0,168,246,'Traveller’s top speed',D5_n(tw.vmax,3)+'c',tw.ok?C.ink:C.coral);
  out+=TF(x0,240,'On the page the bent line is longer;',13,C.ink,'start')+TF(x0,258,'in spacetime it records less time.',13,C.ink,'start');
  out+=TF(x0,286,'Straight worldlines record the most:',13,C.ink,'start')+TF(x0,304,'Minkowski’s “reversed” triangle rule.',13,C.ink,'start');
  return {svg:out,phase:!tw.ok?`To follow that path the traveller would need ${D5_n(tw.vmax,3)} times the speed of light somewhere along it. A worldline must stay inside the light cone at every point, so the smooth path cannot reach so far in 10 years.`:
   X===0?'With no journey both clocks record the same 10 years.':`The home clock records ${D5_n(home.tau,3)} years. The traveller’s clock, summing √(dt² − dx²) along the bent worldline, records ${D5_n(tw.tau,3)} years. On the page the traveller’s line is longer (${D5_n(tw.eu,3)} against ${D5_n(home.eu,3)}); in spacetime it is shorter. The straight worldline between two events is the longest in proper time.`};
 }});

/* ===================== Lesson: curvature-inside ===================== */
// Parallel transport on the unit sphere, done step by step: between neighbouring points of the path the arrow is moved
// along the short great-circle step joining them, turned with that step and never relative to the surface (a rotation
// about the axis p × q). That is exact for steps along great circles and approximates any other path closely.
// Loops: a circle of latitude 90° − 10°·size, travelled eastward; or a triangle equator → equator (Δλ further east) → north pole → back.
function D5_loopPath(kind,size){const pts=[];
 if(kind==='lat'){const la=90-size*10;for(let i=0;i<=1440;i++)pts.push(D5_ll(la,i/4))}
 else{const dl=size*20;for(let i=0;i<=480;i++)pts.push(D5_ll(0,dl*i/480));for(let i=1;i<=480;i++)pts.push(D5_ll(90*i/480,dl));for(let i=1;i<=480;i++)pts.push(D5_ll(90-90*i/480,0))}
 return pts}
// Rotate v by the rotation that carries p to q along the great circle (Rodrigues' formula).
function D5_rotStep(p,q,v){const ax=D5_cross(p,q),s=D5_len(ax);if(s<1e-15)return v;const k=D5_mul(ax,1/s),c=D5_dot(p,q),kv=D5_cross(k,v);
 return D5_unit(D5_add(D5_add(D5_mul(v,c),D5_mul(kv,s)),D5_mul(k,D5_dot(k,v)*(1-c))))}
const D5_TR={};
function D5_transport(kind,size){const key=kind+size;if(D5_TR[key])return D5_TR[key];const pts=D5_loopPath(kind,size),p0=pts[0];
 let v=kind==='lat'?D5_unit(D5_sub([0,0,1],D5_mul(p0,p0[2]))):[0,1,0];const v0=v,vs=[v];
 for(let i=1;i<pts.length;i++){v=D5_rotStep(pts[i-1],pts[i],v);vs.push(v)}
 const turn=Math.atan2(D5_dot(D5_cross(v0,v),p0),D5_dot(v0,v));
 // enclosed area (to the left of the direction of travel), integrated: ∫ cos(latitude) d(lat) d(lon)
 let area=0;const N=2000;if(kind==='lat'){const a=(90-size*10)/D5_DEG;for(let i=0;i<N;i++)area+=Math.cos(a+(i+.5)*(D5_PI/2-a)/N)*(D5_PI/2-a)/N;area*=2*D5_PI}
 else{for(let i=0;i<N;i++)area+=Math.cos((i+.5)*D5_PI/2/N)*D5_PI/2/N;area*=size*20/D5_DEG}
 return (D5_TR[key]={pts,vs,turn,area})}
const D5_turnMod=(t,a)=>{let d=t-a;d-=2*D5_PI*Math.round(d/(2*D5_PI));return a+d}; // the turn read as the multiple of 2π nearest the area
SCENE({id:'curvature-inside',name:'Carry an arrow round a loop',tag:'Levi-Civita’s parallel transport, 1917',
 definition:'Walk round a loop holding an arrow, never turning it relative to the surface as you go. On a flat floor it comes back pointing the way it started. On a sphere it comes back turned, by an angle equal to the curvature enclosed: for a sphere of radius 1, the enclosed area. Levi-Civita (1917) made this “parallel transport” precise in any dimension. It needs no outside view: an inhabitant can detect curvature with an arrow and a walk.',
 get example(){const la=48.85,t=360*(1-Math.sin(la/D5_DEG));return `Foucault’s pendulum (Paris, 1851) is such an arrow: the Earth carries it round its circle of latitude once a day. At Paris, latitude ${la}°, the swing plane comes back turned by ${D5_n(t,0)}° relative to the directions it was carried along, which is why it appears to turn by 360° − ${D5_n(t,0)}° = ${D5_n(360-t,0)}° a day against the floor. That angle is the area of the cap north of Paris, on a sphere of radius 1.`},
 desc:'A sphere with a loop, either a circle of latitude or a triangle with one corner at the north pole, and arrows carried step by step round it. The starting arrow is drawn in grey beside the returning one. Tiles give the measured turn and the enclosed area, and a graph shows turn against area for loops of every size.',
 research:['Levi-Civita (1917). Nozione di parallelismo in una varietà qualunque e conseguente specificazione geometrica della curvatura riemanniana. Rendiconti del Circolo Matematico di Palermo 42, 173–205.','Bonnet (1848). Mémoire sur la théorie générale des surfaces. Journal de l’École Polytechnique 19: turning round a loop and the curvature enclosed (Gauss–Bonnet).','Foucault (1851). Démonstration physique du mouvement de rotation de la terre au moyen du pendule. Comptes rendus 32, 135–138.','The arrow is moved along each of about 1440 short great-circle steps without turning; the area is integrated separately.'],
 dur:14,hint:'Choose a loop and its size, then press “Carry it round” or move the slider. Compare the angle between the grey starting arrow and the returning arrow with the enclosed area.',
 init:()=>({kind:'tri',size:3,prog:100}),
 watch:p=>p<.5?{kind:'tri',size:3,prog:Math.round(100*smooth(p/.45))}:{kind:'lat',size:5,prog:Math.round(100*smooth((p-.5)/.45))},
 ui:[{choose:[['tri','Triangle'],['lat','Circle of latitude']],label:'Loop',get:s=>s.kind,act:'kind'},{range:'size',label:'Size',min:1,max:8,get:s=>s.size,act:'size',show:v=>v+' of 8'},{range:'prog',label:'How far round',min:0,max:100,step:5,get:s=>s.prog,act:'prog',show:v=>v+'%'},{b:'Carry it round ▶',act:'go'}],
 on:{kind(s,v){s.kind=v==='lat'?'lat':'tri'},size(s,v){s.size=clamp(Math.round(+v),1,8)},prog(s,v){s.prog=clamp(Math.round(+v/5)*5,0,100)},
  go(s,v,ctx){s.prog=0;if(ctx&&ctx.every)ctx.every(120,'tick');return 'keep'},tick(s){s.prog=Math.min(100,s.prog+2);return s.prog>=100?'stop':'keep'}},
 draw(s){
  const T=D5_transport(s.kind,s.size),n=T.pts.length-1,k=Math.round(n*s.prog/100),cx=160,cy=200,rr=134,V=D5_view(34,s.kind==='lat'?-25:s.size*10,cx,cy,rr);
  const done=s.prog>=100,turn=done?D5_turnMod(T.turn,T.area):null,label=s.kind==='lat'?`circle of latitude ${90-s.size*10}°`:`triangle, ${s.size*20}° along the equator`;
  let out=heading(done?`Back at the start, turned by ${D5_d(turn)}`:`Carrying the arrow: ${s.prog}% of the way`);
  out+=D5_globe(V,cx,cy,rr);
  out+=D5_sphCurve(T.pts.filter((_,i)=>i%6===0),V,C.line,2)+D5_sphCurve(T.pts.slice(0,k+1).filter((_,i)=>i%6===0||i===k),V,C.coral,3.4);
  const arr=(p,v,col,w)=>{const a=V(p),b=V(D5_add(p,D5_mul(v,.24)));return a[2]<-.05?'':arrow(a[0],a[1],b[0],b[1],col,w,8)};
  for(let i=0;i<=k;i+=Math.max(1,Math.round(n/14)))out+=arr(T.pts[i],T.vs[i],tint(C.blue,.35),2);
  out+=arr(T.pts[0],T.vs[0],C.muted,3)+arr(T.pts[k],T.vs[k],C.blue,3.4);
  const st=V(T.pts[0]);out+=Ci(st[0],st[1],5,C.ink)+TF(st[0]-8,st[1]+18,'start',13,C.ink,'end');
  out+=TF(cx,cy+rr+18,label,13,C.muted);
  const x0=330;out+=D5_tile(x0,52,122,'Turn measured',done?D5_d(turn):'…',C.blue)+D5_tile(x0+130,52,122,'Area enclosed',D5_n(T.area,3),C.coral);
  out+=D5_tile(x0,106,252,'Area in degrees (× 180°/π)',D5_d(T.area),C.coral);
  // graph: turn against area for every loop size of both kinds
  const gx=x0,gy=170,gw=252,gh=150,amax=2*D5_PI,Xg=a=>gx+14+a/amax*(gw-28),Yg=t=>gy+gh-14-t/amax*(gh-28);
  out+=R(gx,gy,gw,gh,'#fff',C.grid,8)+L(Xg(0),Yg(0),Xg(amax),Yg(amax),C.grid,1.4,D5_dash);
  for(const kd of ['lat','tri'])for(let z=1;z<=8;z++){const t=D5_transport(kd,z),on=kd===s.kind&&z===s.size;out+=Ci(Xg(t.area),Yg(D5_turnMod(t.turn,t.area)),on?6:3.5,kd==='lat'?C.green:C.purple,on?C.ink:'none')}
  out+=TF(gx+gw/2,gy+gh+16,'turn against area, 0 to 2π, all 16 loops',13,C.muted)+TF(gx+20,gy+18,'● circles',13,C.green,'start')+TF(gx+100,gy+18,'● triangles',13,C.purple,'start');
  return {svg:out,phase:!done?`The arrow is carried along the ${s.kind==='lat'?'circle':'triangle'}, never turned relative to the sphere: at each short step it is carried along without any twist. ${s.prog}% of the way round.`:
   `Back at the start the arrow points ${D5_d(turn)} away from where it began (grey). The loop encloses an area of ${D5_n(T.area,3)}, which is ${D5_d(T.area)}: the same, as the Gauss–Bonnet theorem says it must be on a sphere of radius 1. ${s.kind==='tri'?'The triangle’s corners are all 90° except the one at the pole, so this is also its angle excess.':'A small circle near the pole gives a small turn; the equator encloses half the sphere and gives 2π, which looks like no turn at all.'}`};
 }});

// Circles measured from inside: points at distance ρ from a centre in every direction, joined by 4000 short geodesic
// chords whose lengths are measured in the space itself (on the sphere in space; in the hyperbolic plane with the
// Poincaré-disc distance). Bertrand, Diguet and Puiseux (1848): K = lim 3(2πρ − C)/(πρ³).
const D5_GEOM={plane:['Flat plane',0,C.ink],sphere:['Sphere, radius 1',1,C.blue],hyp:['Hyperbolic plane',-1,C.coral]};
const D5_CIRC={};
function D5_circ(g,rho){const key=g+rho;if(D5_CIRC[key])return D5_CIRC[key];const N=4000;let pts,Cc=0;
 if(g==='sphere'){pts=range(N+1).map(i=>[Math.sin(rho)*Math.cos(2*D5_PI*i/N),Math.sin(rho)*Math.sin(2*D5_PI*i/N),Math.cos(rho)]);for(let i=1;i<=N;i++){const c=D5_len(D5_sub(pts[i],pts[i-1]));Cc+=2*Math.asin(c/2)}}
 else if(g==='hyp'){const e=Math.tanh(rho/2);pts=range(N+1).map(i=>[e*Math.cos(2*D5_PI*i/N),e*Math.sin(2*D5_PI*i/N)]);for(let i=1;i<=N;i++)Cc+=D5_hd(pts[i-1],pts[i])}
 else{pts=range(N+1).map(i=>[rho*Math.cos(2*D5_PI*i/N),rho*Math.sin(2*D5_PI*i/N)]);for(let i=1;i<=N;i++)Cc+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1])}
 return (D5_CIRC[key]={C:Cc,flat:2*D5_PI*rho,ratio:Cc/(2*D5_PI*rho),Kest:3*(2*D5_PI*rho-Cc)/(D5_PI*rho**3)})}
SCENE({id:'curvature-inside-circles',name:'Circles that come up short',tag:'Bertrand, Diguet and Puiseux, 1848',
 definition:'An inhabitant can draw a circle by walking a distance ρ from a centre in every direction, then measure its rim C. In the flat plane C = 2πρ. On a sphere C is less, and in the hyperbolic plane it is more. In 1848 Bertrand, Diguet and Puiseux showed that the shortfall of small circles gives Gauss’s curvature directly: K = 3(2πρ − C)/(πρ³) in the limit of small ρ.',
 example:'On a sphere of radius 1 a circle of radius π/2 is the equator, with rim 2π rather than π²; at radius π it shrinks to a single point, the opposite pole. In the hyperbolic plane the rim grows exponentially with ρ, which is why hyperbolic tilings crowd towards the edge of the disc.',
 desc:'A circle of chosen radius drawn on a sphere, in the Poincaré disc or in the flat plane, with its radius marked, beside a graph of rim ÷ 2πρ against ρ for the three geometries. Tiles give the measured rim, 2πρ, their ratio and the curvature estimated from the shortfall.',
 research:['Bertrand, Diguet & Puiseux (1848). Journal de Mathématiques Pures et Appliquées 13: three short notes relating the curvature to the perimeter and area of small geodesic circles.','Gauss (1828), as above.','Rims are summed from 4000 short chords, each measured within its own geometry.'],
 dur:12,hint:'Choose a geometry and change the circle’s radius. Small circles give the curvature through the shortfall formula; large ones show how far each geometry departs from flat.',
 init:()=>({g:'sphere',rho:10}),
 watch:p=>({g:['sphere','hyp','plane'][Math.min(2,Math.floor(p*3))],rho:Math.max(1,Math.round(25*smooth((p*3)%1)))}),
 ui:[{choose:Object.keys(D5_GEOM).map(k=>[k,D5_GEOM[k][0]]),label:'Geometry',get:s=>s.g,act:'g'},{range:'rho',label:'Radius ρ',min:1,max:30,get:s=>s.rho,act:'rho',show:v=>D5_n(v/10,1)}],
 on:{g(s,v){s.g=D5_GEOM[v]?v:'sphere'},rho(s,v){s.rho=clamp(Math.round(+v),1,30)}},
 draw(s){
  const rho=s.rho/10,c=D5_circ(s.g,rho),col=D5_GEOM[s.g][2],cx=160,cy=190,rr=122;
  let out=heading(`Rim ${D5_n(c.C,3)} against 2πρ = ${D5_n(c.flat,3)}: ${s.g==='plane'?'equal':s.g==='sphere'?'short':'long'}`);
  if(s.g==='sphere'){const V=D5_view(40,-20,cx,cy,rr);out+=D5_globe(V,cx,cy,rr);const ring=range(181).map(i=>[Math.sin(rho)*Math.cos(i*D5_PI/90),Math.sin(rho)*Math.sin(i*D5_PI/90),Math.cos(rho)]);
   out+=D5_sphCurve(ring,V,col,3.2)+D5_sphCurve(range(41).map(i=>[Math.sin(rho*i/40)*Math.cos(-.4),Math.sin(rho*i/40)*Math.sin(-.4),Math.cos(rho*i/40)]),V,C.purple,2.6);const np=V([0,0,1]);out+=Ci(np[0],np[1],5,C.ink)}
  else if(s.g==='hyp'){const e=Math.tanh(rho/2);out+=Ci(cx,cy,rr,'#f7fafc',C.line)+Ci(cx,cy,e*rr,'none',col,'stroke-width="3.2"')+L(cx,cy,cx+e*rr*Math.cos(-.4),cy+e*rr*Math.sin(-.4),C.purple,2.6)+Ci(cx,cy,5,C.ink)}
  else{const sc=rr/3;out+=R(cx-rr,cy-rr,2*rr,2*rr,'#f7fafc',C.line,4)+Ci(cx,cy,rho*sc,'none',col,'stroke-width="3.2"')+L(cx,cy,cx+rho*sc*Math.cos(-.4),cy+rho*sc*Math.sin(-.4),C.purple,2.6)+Ci(cx,cy,5,C.ink)}
  out+=TF(cx,cy+rr+18,D5_GEOM[s.g][0]+` · purple radius ρ = ${D5_n(rho,1)}`,13,C.muted);
  // graph of C/(2πρ)
  const gx=318,gy=52,gw=264,gh=150,Xg=r=>gx+14+r/3*(gw-28),Yg=q=>gy+gh-14-q/2*(gh-28);
  out+=R(gx,gy,gw,gh,'#fff',C.grid,8)+L(Xg(0),Yg(1),Xg(3),Yg(1),C.grid,1.2)+TF(gx+gw-8,Yg(1)-5,'1',13,C.muted,'end');
  for(const k of Object.keys(D5_GEOM)){const pts=range(30).map(i=>{const r=(i+1)/10,q=D5_circ(k,r).ratio;return q<=2.05?[Xg(r),Yg(q)]:null}).filter(p=>p);out+=D5_poly(pts,D5_GEOM[k][2],k===s.g?3:1.4,k===s.g?'':'stroke-opacity=".6"')}
  if(c.ratio<=2.05)out+=Ci(Xg(rho),Yg(c.ratio),6,col,'#fff');out+=TF(gx+gw/2,gy+gh+16,'rim ÷ 2πρ against ρ, 0 to 3',13,C.muted)+TF(Xg(1.25),Yg(D5_circ('hyp',1.2).ratio)-8,'hyperbolic',13,C.coral,'end')+TF(Xg(2.9),Yg(1)-8,'flat',13,C.ink,'end')+TF(Xg(2.2),Yg(D5_circ('sphere',2.2).ratio)+18,'sphere',13,C.blue,'start');
  out+=D5_tile(318,226,128,'Rim measured',D5_n(c.C,3),col)+D5_tile(454,226,128,'Rim ÷ 2πρ',D5_n(c.ratio,4),col);
  out+=D5_tile(318,280,264,'K from the shortfall, 3(2πρ − C)/(πρ³)',D5_n(c.Kest,3),C.ink);
  out+=D5_note(`True curvature here: ${D5_GEOM[s.g][1]>0?'+1':D5_GEOM[s.g][1]<0?'−1':'0'}. The estimate approaches it as ρ shrinks.`,360);
  return {svg:out,phase:`Walking ${D5_n(rho,1)} out in every direction and measuring the rim gives ${D5_n(c.C,3)}, ${D5_n(c.ratio,4)} times the flat 2πρ. The shortfall formula turns this into K ≈ ${D5_n(c.Kest,3)}${s.g==='plane'?'':`, close to the true ${D5_GEOM[s.g][1]>0?'+1':'−1'} for small circles and drifting for large ones, because the formula holds only in the limit`}. No step of this needs a view from outside.`};
 }});

// Total curvature of closed surfaces. Each surface is given by a parametrisation X(u, v); K is computed at every point
// of a 160 × 160 grid from finite differences of X (first and second fundamental forms: K = (LN − M²)/(EG − F²)) and
// integrated with the area element √(EG − F²) du dv. V − E + F is counted on a coarse mesh of the same parametrisation,
// with coinciding corners (poles, seams) merged.
const D5_SURF={
 sphere:{name:'Sphere',u:[0,D5_PI],X:(u,v)=>[Math.sin(u)*Math.cos(v),Math.sin(u)*Math.sin(v),Math.cos(u)],sh:()=>''},
 ellipsoid:{name:'Squashed sphere',u:[0,D5_PI],X:(u,v,k)=>[Math.sin(u)*Math.cos(v),Math.sin(u)*Math.sin(v),(.4+.2*k)*Math.cos(u)],sh:k=>`height ${D5_n(.4+.2*k,1)}`},
 bumpy:{name:'Bumpy sphere',u:[0,D5_PI],X:(u,v,k)=>{const r=1+.04*k*Math.sin(u)**3*Math.cos(3*v);return [r*Math.sin(u)*Math.cos(v),r*Math.sin(u)*Math.sin(v),r*Math.cos(u)]},sh:k=>`bumps ${D5_n(.04*k,2)}`},
 torus:{name:'Torus',u:[0,2*D5_PI],X:(u,v,k)=>{const r=.3+.15*k;return [(2+r*Math.cos(u))*Math.cos(v),(2+r*Math.cos(u))*Math.sin(v),r*Math.sin(u)]},sh:k=>`tube radius ${D5_n(.3+.15*k,2)}`}};
function D5_Kat(S,u,v,k){const h=1e-3,X=(a,b)=>S.X(a,b,k),p=X(u,v),pu=X(u+h,v),pm=X(u-h,v),pv=X(u,v+h),pn=X(u,v-h);
 const Xu=D5_mul(D5_sub(pu,pm),1/(2*h)),Xv=D5_mul(D5_sub(pv,pn),1/(2*h)),Xuu=D5_mul(D5_add(D5_sub(pu,D5_mul(p,2)),pm),1/(h*h)),Xvv=D5_mul(D5_add(D5_sub(pv,D5_mul(p,2)),pn),1/(h*h));
 const Xuv=D5_mul(D5_add(D5_sub(D5_sub(X(u+h,v+h),X(u+h,v-h)),X(u-h,v+h)),X(u-h,v-h)),1/(4*h*h)),n=D5_cross(Xu,Xv),W=D5_len(n),N=D5_mul(n,1/(W||1));
 const E=D5_dot(Xu,Xu),F=D5_dot(Xu,Xv),G=D5_dot(Xv,Xv),Ls=D5_dot(Xuu,N),M=D5_dot(Xuv,N),Ns=D5_dot(Xvv,N);return {K:(Ls*Ns-M*M)/(E*G-F*F),dA:Math.sqrt(Math.max(0,E*G-F*F))}}
const D5_GB={};
function D5_gauss(kind,k){const key=kind+k;if(D5_GB[key])return D5_GB[key];const S=D5_SURF[kind],nu=160,nv=160,du=(S.u[1]-S.u[0])/nu,dv=2*D5_PI/nv;let pos=0,neg=0,area=0;
 for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){const u=S.u[0]+(i+.5)*du,v=(j+.5)*dv,r=D5_Kat(S,u,v,k),w=r.K*r.dA*du*dv;if(w>0)pos+=w;else neg+=w;area+=r.dA*du*dv}
 // V − E + F of a coarse mesh
 const mu=8,mv=12,key3=p=>p.map(x=>(Math.abs(x)<5e-7?0:x).toFixed(6)).join(','),Vs=new Set(),Es=new Set();let Fc=0;
 const at=(i,j)=>key3(S.X(S.u[0]+i*(S.u[1]-S.u[0])/mu,j*2*D5_PI/mv,k));
 for(let i=0;i<mu;i++)for(let j=0;j<mv;j++){const q=[at(i,j),at(i+1,j),at(i+1,j+1),at(i,j+1)].filter((x,ix,a)=>x!==a[(ix+3)%4]);const uq=[...new Set(q)];if(uq.length<3)continue;Fc++;
  q.forEach((x,ix)=>{Vs.add(x);const y=q[(ix+1)%q.length];if(x!==y)Es.add([x,y].sort().join('|'))})}
 return (D5_GB[key]={pos,neg,tot:pos+neg,area,V:Vs.size,E:Es.size,F:Fc})}
const D5_GBSVG={};
function D5_gbPicture(kind,k,cx,cy){const key=kind+k;if(D5_GBSVG[key])return D5_GBSVG[key];const S=D5_SURF[kind],nu=kind==='torus'?28:22,nv=36,yaw=.5,pit=.45;
 const rot=p=>{const a=p[0]*Math.cos(yaw)-p[1]*Math.sin(yaw),b=p[0]*Math.sin(yaw)+p[1]*Math.cos(yaw);return [a,-b*Math.sin(pit)-p[2]*Math.cos(pit),-b*Math.cos(pit)+p[2]*Math.sin(pit)]};
 const ext=kind==='torus'?2+.3+.15*k:1.35,sc=128/ext,faces=[];
 for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){const u0=S.u[0]+i*(S.u[1]-S.u[0])/nu,u1=S.u[0]+(i+1)*(S.u[1]-S.u[0])/nu,v0=j*2*D5_PI/nv,v1=(j+1)*2*D5_PI/nv,cs=[[u0,v0],[u1,v0],[u1,v1],[u0,v1]].map(([u,v])=>rot(S.X(u,v,k)));
  const Kc=D5_Kat(S,(u0+u1)/2,(v0+v1)/2,k).K;faces.push({cs,d:sum(cs.map(c=>c[2]))/4,K:Kc})}
 faces.sort((a,b)=>a.d-b.d);let out='';
 for(const f of faces){const col=Math.abs(f.K)<.02?'#e3e9ee':f.K>0?tint(C.coral,.85-.55*clamp(f.K/1.5,0,1)):tint(C.blue,.85-.55*clamp(-f.K/1.5,0,1));out+=`<polygon points="${f.cs.map(c=>fmt(cx+c[0]*sc)+','+fmt(cy+c[1]*sc)).join(' ')}" fill="${col}" stroke="#ffffff" stroke-width=".5"/>`}
 return (D5_GBSVG[key]=out)}
SCENE({id:'curvature-inside-gauss-bonnet',name:'Total curvature counts the holes',tag:'Gauss–Bonnet theorem',
 definition:'Add up the Gaussian curvature over a whole closed surface, ∫K dA. However the surface is bent, squashed or dented, the total stays the same: 2π times its Euler characteristic V − E + F. A sphere totals 4π. A torus totals 0, its positive outer half exactly cancelled by its negative inner half. This is the global Gauss–Bonnet theorem, building on Gauss (1828) and Bonnet (1848).',
 example:'Local geometry, curvature, adds up to a global count of shape, topology. Chern (1944) proved the theorem for closed spaces of any even dimension, and Gauss–Bonnet is one reason the Euler characteristic of the previous era matters so much: it limits what curvature a surface can carry. A surface with negative total curvature must have two or more handles.',
 desc:'A surface drawn in coral where its curvature is positive and in blue where it is negative, chosen from a sphere, a squashed sphere, a bumpy sphere and a torus, with a slider that changes its shape. Tiles give the integrated positive and negative curvature, the total, the total divided by 2π, and V − E + F counted on a mesh of the same surface.',
 research:['Bonnet (1848), as above; Gauss (1828), as above (the total curvature of a geodesic triangle).','Chern (1944). A simple intrinsic proof of the Gauss–Bonnet formula for closed Riemannian manifolds. Annals of Mathematics 45, 747–752.','K is computed at 25,600 points from finite differences of each surface’s formula and integrated; V − E + F is counted on a coarse mesh with merged corners.'],
 dur:12,hint:'Choose a surface and change its shape. The coral and blue parts change, but their total divided by 2π never does, and it always equals V − E + F.',
 init:()=>({kind:'torus',k:4}),
 watch:p=>{const ph=Math.min(3,Math.floor(p*4)),u=p*4-ph;return {kind:['sphere','ellipsoid','bumpy','torus'][ph],k:ph===0?4:Math.round(8*u)}},
 ui:[{choose:Object.keys(D5_SURF).map(k=>[k,D5_SURF[k].name]),label:'Surface',get:s=>s.kind,act:'kind'},{range:'k',label:'Shape',min:0,max:8,get:s=>s.k,act:'k'}],
 on:{kind(s,v){s.kind=D5_SURF[v]?v:'sphere'},k(s,v){s.k=clamp(Math.round(+v),0,8)}},
 draw(s){
  const g=D5_gauss(s.kind,s.k),chi=g.V-g.E+g.F;
  let out=heading(`${D5_SURF[s.kind].name}: total curvature ÷ 2π = ${D5_n(g.tot/(2*D5_PI),3)}`);
  out+=R(18,46,290,284,'#fff',C.grid,8)+D5_gbPicture(s.kind,s.k,163,190);
  out+=R(30,302,12,12,C.coral,'none',2)+TF(48,313,'K > 0',13,C.ink,'start')+R(110,302,12,12,C.blue,'none',2)+TF(128,313,'K < 0',13,C.ink,'start')+TF(296,313,D5_SURF[s.kind].sh(s.k),13,C.muted,'end');
  const x0=322;out+=D5_tile(x0,52,126,'∫K dA, K > 0',D5_n(g.pos,3),C.coral)+D5_tile(x0+134,52,126,'∫K dA, K < 0',D5_n(g.neg,3),C.blue);
  out+=D5_tile(x0,106,126,'Total ∫K dA',D5_n(g.tot,3),C.ink)+D5_tile(x0+134,106,126,'Total ÷ 2π',D5_n(g.tot/(2*D5_PI),3),C.ink);
  out+=D5_tile(x0,160,260,`Mesh: V − E + F = ${g.V} − ${g.E} + ${g.F}`,String(chi),C.green);
  out+=TF(x0,236,`Surface area ${D5_n(g.area,3)}: it changes;`,13,C.ink,'start')+TF(x0,254,'the total curvature does not.',13,C.ink,'start');
  out+=TF(x0,282,'Gauss–Bonnet: ∫K dA = 2π(V − E + F)',13,C.green,'start');
  out+=D5_note('Each surface is computed from its formula; colours show the sign of K, tiles the values.',360);
  return {svg:out,phase:`Integrating K over the ${D5_SURF[s.kind].name.toLowerCase()} gives ${D5_n(g.pos,3)} from the positively curved parts and ${D5_n(g.neg,3)} from the negative ones, a total of ${D5_n(g.tot,3)}, which is ${D5_n(g.tot/(2*D5_PI),3)} × 2π. Counting the mesh gives V − E + F = ${chi}. ${s.kind==='torus'?'Fatten or thin the tube: the outer and inner parts always cancel.':'Squash it or dent it: curvature moves around, but the total stays 4π.'}`};
 }});

// Gauss's survey and the shape of space. An equilateral triangle of geodesics with side a on a sphere of radius R:
// each angle A has cos A = cos(a/R)/(1 + cos(a/R)) (spherical law of cosines); the excess 3A − π is compared with the
// area of the triangle, integrated by summing small flat pieces pushed onto the sphere.
const D5_PREC=[.1,.3,1,3,10];
function D5_survey(side){const a=side/D5_EARTH,cA=Math.cos(a)/(1+Math.cos(a)),A=Math.acos(cA),ex=3*A-D5_PI,s2=(1-Math.cos(a))/1.5,th=Math.asin(Math.sqrt(s2));
 const V=[0,1,2].map(i=>[Math.sin(th)*Math.cos(i*2*D5_PI/3),Math.sin(th)*Math.sin(i*2*D5_PI/3),Math.cos(th)]),fl=n=>D5_triGrid(V[0],V[1],V[2],n,(p,q,w)=>{const P1=D5_unit(p),Q=D5_unit(q),W=D5_unit(w);return D5_len(D5_cross(D5_sub(Q,P1),D5_sub(W,P1)))/2});
 return {a,A,ex,area:(4*fl(48)-fl(24))/3,sideCheck:Math.acos(clamp(D5_dot(V[0],V[1]),-1,1))*D5_EARTH}}
const D5_PLANCK={ok:.001,err:.002};
SCENE({id:'curvature-inside-cosmos',name:'Is our space curved?',tag:'Gauss’s triangle (debated); Planck 2018',
 definition:'A triangle of light rays across space would show its curvature by its angle sum. A story says Gauss tried this in the 1820s, measuring the triangle of hilltops Hohenhagen, Brocken and Inselsberg in his survey of Hanover. Historians debate it: he did measure the triangle, for the survey, but whether he meant it as a test of space is disputed. Its angle excess is what the Earth’s own curved surface produces.',
 get example(){return `Karl Schwarzschild (1900) used star positions to put lower limits on how curved space could be. Today the cosmic microwave background gives a far larger triangle: the Planck satellite, with measurements of galaxy clustering, finds the curvature term Ωₖ = ${D5_PLANCK.ok} ± ${D5_PLANCK.err}, consistent with flat space. That does not settle whether space is finite: a flat space can close up like a 3-torus, and a slight curvature below the error is not excluded.`},
 desc:'A triangle of geodesics on the Earth’s surface with a chosen side length, its angle excess computed two ways and compared with a chosen precision for measuring angles; and a number line for the Planck measurement of spatial curvature, with flat space at zero.',
 research:['Miller (1972). The myth of Gauss’ experiment on the Euclidean nature of physical space. Isis 63, 345–348 (the debate continues).','Schwarzschild (1900). Über das zulässige Krümmungsmaass des Raumes. Vierteljahrsschrift der Astronomischen Gesellschaft 35, 337–347.','Planck Collaboration (2020). Planck 2018 results. VI. Cosmological parameters. Astronomy & Astrophysics 641, A6: Ωₖ = 0.001 ± 0.002 (Planck with baryon acoustic oscillations).','The triangle’s excess comes from the spherical law of cosines and is checked against its area, integrated over small pieces, for a spherical Earth of radius 6371 km.'],
 dur:12,hint:'Make the triangle larger or smaller and set how precisely each angle can be measured. When does the Earth’s curvature become measurable? The side lengths are illustrative, not Gauss’s.',
 init:()=>({side:8,prec:2}),
 watch:p=>({side:Math.round(12*smooth(p)),prec:2}),
 ui:[{range:'side',label:'Side of the triangle',min:0,max:12,get:s=>s.side,act:'side',show:v=>D5_n(Math.pow(10,v/4),0)+' km'},{choose:D5_PREC.map((v,i)=>[i,v+'″']),label:'Angle precision',get:s=>s.prec,act:'prec'}],
 on:{side(s,v){s.side=clamp(Math.round(+v),0,12)},prec(s,v){s.prec=clamp(Math.round(+v),0,4)}},
 draw(s){
  const side=Math.pow(10,s.side/4),r=D5_survey(side),exs=r.ex*D5_DEG*3600,ars=r.area*D5_DEG*3600,pr=D5_PREC[s.prec],err=Math.sqrt(3)*pr,det=exs>2*err;
  let out=heading(det?`Excess ${D5_n(exs,exs<10?2:0)}″: measurable at ${pr}″ per angle`:`Excess ${D5_n(exs,exs<.1?4:2)}″: lost in the measuring error`);
  // triangle sketch with angles
  out+=R(18,46,282,186,'#fff',C.grid,8);const tx=159,ty=128,tr=62,bulge=.1+Math.min(.3,r.a*3);
  const pts=[0,1,2].map(i=>[tx+tr*Math.cos(-D5_PI/2+i*2*D5_PI/3),ty+tr*Math.sin(-D5_PI/2+i*2*D5_PI/3)]);
  for(let i=0;i<3;i++){const a=pts[i],b=pts[(i+1)%3],m=[(a[0]+b[0])/2,(a[1]+b[1])/2],o=[m[0]+(m[0]-tx)*bulge,m[1]+(m[1]-ty)*bulge];out+=P(`M${fmt(a[0])} ${fmt(a[1])}Q${fmt(o[0])} ${fmt(o[1])} ${fmt(b[0])} ${fmt(b[1])}`,C.coral,3)}
  pts.forEach(p=>{out+=Ci(p[0],p[1],5,C.ink)});
  out+=TF(tx,206,`each angle ${D5_n(r.A*D5_DEG,6)}°`,13,C.ink)+TF(tx,225,`sides ${D5_n(side,side<10?1:0)} km; bulge exaggerated`,13,C.muted);
  out+=D5_tile(18,240,138,'Excess 3A − 180°',D5_n(exs,exs<.1?4:2)+'″',C.coral)+D5_tile(162,240,138,'Area ÷ R²',D5_n(ars,ars<.1?4:2)+'″',C.coral);
  out+=D5_tile(18,294,282,`Error of the sum, √3 × ${pr}″`,D5_n(err,2)+'″ · '+(det?'excess shows':'excess hidden'),det?C.green:C.muted);
  // Planck number line
  const px=322,pw=260,X=v=>px+14+(v+.01)/.02*(pw-28),y=128;
  out+=R(px-8,46,pw+8,186,'#fff',C.grid,8)+TBF(px,68,'Our universe: curvature Ωₖ',13,C.ink,'start')+TF(px,86,'Planck 2018 with galaxy clustering',13,C.muted,'start');
  out+=L(X(-.01),y,X(.01),y,C.line,2);for(const v of [-.01,-.005,0,.005,.01])out+=L(X(v),y-5,X(v),y+5,C.line,1.4)+(v===0?'':TF(X(v),y+22,D5_n(v,3),13,C.muted));
  out+=R(X(D5_PLANCK.ok-D5_PLANCK.err),y-9,X(D5_PLANCK.ok+D5_PLANCK.err)-X(D5_PLANCK.ok-D5_PLANCK.err),18,C.purplep,C.purple,4)+Ci(X(D5_PLANCK.ok),y,5,C.purple)+L(X(0),y-24,X(0),y+8,C.green,2)+TF(X(0),y-28,'flat',13,C.green);
  out+=TF(px,180,'Ωₖ > 0: open (negative curvature)',13,C.ink,'start')+TF(px,198,'Ωₖ < 0: closed (positive curvature)',13,C.ink,'start')+TF(px,220,'Flat within the error; finite or not, undecided.',13,C.ink,'start');
  out+=TF(322,262,'A survey triangle measures the Earth’s',13,C.ink,'start')+TF(322,280,'surface, not space: light rays between',13,C.ink,'start')+TF(322,298,'hilltops bend by far less than this.',13,C.ink,'start');
  out+=D5_note(`Law of cosines and area agree; side check ${D5_n(r.sideCheck,side<10?3:1)} km.`,362);
  return {svg:out,phase:`On a spherical Earth an equilateral triangle with ${D5_n(side,side<10?1:0)} km sides has angles of ${D5_n(r.A*D5_DEG,6)}° each, adding to ${D5_n(exs,exs<.1?4:2)} seconds of arc more than 180°; its integrated area gives the same. Measuring each angle to ${pr}″, the sum is uncertain by about ${D5_n(err,2)}″, so the excess is ${det?'clearly measurable':'hidden'}. Surveyors of Gauss’s time corrected for this excess routinely; detecting a curvature of space itself would need far larger triangles, like the one the cosmic background provides.`};
 }});
