/* ===================== Dimensions In Motion · Era 7 · High-dimensional surprises ===================== */
// The volume of the n-ball, the thin shell that holds it, nearly perpendicular directions, sphere packing and
// kissing numbers, the curse of dimensionality, and the corners of the cube.
// Every number on screen is computed: ball volumes by V(n) = (2π/n)·V(n−2) (checked against π^(n/2)/Γ(n/2+1)),
// shares and angles from seeded samples (D7_rng), kissing numbers by counting the shortest vectors of each lattice.
// Every picture is a pure function of state, frame and X. Typed numbers are historical facts and carry a research line.

/* ---- shared helpers ---- */
const D7_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const D7_rng=n=>rng(D7_mix(n));
function D7_gauss(r){const u=Math.max(1e-12,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
// A random direction: n independent normal numbers, scaled to length 1 (every direction is equally likely).
// (Box–Muller gives two normal numbers from each pair of uniform ones; both are used.)
function D7_unit(r,n){const v=new Float64Array(n);let s=0;for(let i=0;i<n;i+=2){const a=Math.sqrt(-2*Math.log(Math.max(1e-12,r()))),b=2*Math.PI*r();v[i]=a*Math.cos(b);if(i+1<n)v[i+1]=a*Math.sin(b)}for(let i=0;i<n;i++)s+=v[i]*v[i];s=Math.sqrt(s);for(let i=0;i<n;i++)v[i]/=s;return v}
function D7_dot(a,b){let s=0;for(let i=0;i<a.length;i++)s+=a[i]*b[i];return s}
const D7_len=a=>Math.sqrt(D7_dot(a,a));
const D7_deg=c=>Math.acos(clamp(c,-1,1))*180/Math.PI;
const D7_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const D7_note=(s,y=368)=>TF(300,y,s,13,C.muted);
function D7_tile(x,y,w,label,value,col=C.blue){return R(x,y,w,46,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+38,value,16,col)}
function D7_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-7,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// Number formatting. D7_num gives k significant figures, switching to a × 10ᵇ when the number is tiny or huge.
const D7_SUP={'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻'};
const D7_sup=n=>String(n).split('').map(c=>D7_SUP[c]||c).join('');
const D7_group=s=>{const [a,b]=String(s).split('.');return a.replace(/\B(?=(\d{3})+(?!\d))/g,',')+(b?'.'+b:'')};
function D7_num(x,k=4){
 if(!isFinite(x))return '∞';if(x===0)return '0';const a=Math.abs(x),e=Math.floor(Math.log10(a));
 if(a>=1e-3&&a<1e7){const d=Math.max(0,k-1-e);return (x<0?'−':'')+D7_group(String(+a.toFixed(d)))}
 return D7_sci(Math.log10(a),k,x<0);
}
// a × 10ᵇ from log10 of the number (so that values far below the smallest double still print).
function D7_sci(lg,k=3,neg=false){let e=Math.floor(lg),m=Math.pow(10,lg-e);if(+m.toFixed(k-1)>=10){m/=10;e++}return (neg?'−':'')+m.toFixed(k-1)+' × 10'+D7_sup(e)}
const D7_pct=(x,d=1)=>String(+(100*x).toFixed(d))+'%';
const D7_bigStr=b=>D7_group(b.toString());
const D7_choose=(n,k)=>{let c=1;for(let i=1;i<=k;i++)c=c*(n-k+i)/i;return Math.round(c)};
// Binned counts of values in [lo,hi).
function D7_hist(vals,lo,hi,bins){const c=new Array(bins).fill(0);for(const v of vals){const i=Math.floor((v-lo)/(hi-lo)*bins);if(i>=0&&i<bins)c[i]++;else if(v===hi)c[bins-1]++}return c}
const D7_mean=a=>a.length?sum(a)/a.length:0;
const D7_sd=a=>{if(a.length<2)return 0;const m=D7_mean(a);return Math.sqrt(sum(a.map(v=>(v-m)*(v-m)))/(a.length-1))};
// Simpson's rule on [a,b] with m (even) strips.
function D7_simpson(f,a,b,m=2000){const h=(b-a)/m;let s=f(a)+f(b);for(let i=1;i<m;i++)s+=(i%2?4:2)*f(a+i*h);return s*h/3}

/* ---- the n-ball ---- */
// Volume of the unit n-ball by the recursion V(n) = (2π/n)·V(n−2), V(0) = 1, V(1) = 2, kept as log10 so that it never underflows.
const D7_LOGV=(()=>{const v=[0,Math.log10(2)];for(let n=2;n<=4000;n++)v[n]=Math.log10(2*Math.PI/n)+v[n-2];return v})();
const D7_V=n=>Math.pow(10,D7_LOGV[n]);
// Γ(x) for x a whole or half-whole number, built only from Γ(1) = 1, Γ(1/2) = √π and Γ(x+1) = x·Γ(x): an independent check.
function D7_gammaHalf(x){const whole=Math.abs(x-Math.round(x))<1e-9;let g=whole?1:Math.sqrt(Math.PI),y=whole?1:.5;while(y<x-1e-9){g*=y;y+=1}return g}
const D7_Vclosed=n=>Math.pow(Math.PI,n/2)/D7_gammaHalf(n/2+1);
// Surface area of the unit sphere bounding the n-ball: S(n) = n·V(n) (the derivative of rⁿ·V(n) at r = 1).
const D7_S=n=>n*D7_V(n);
const D7_argmax=(f,a,b)=>{let best=a;for(let n=a;n<=b;n++)if(f(n)>f(best))best=n;return best};
// The first whole number from a to b for which pred holds (or b + 1 if none does).
const D7_first=(pred,a,b)=>{for(let n=a;n<=b;n++)if(pred(n))return n;return b+1};

/* ===================== Lesson: ball-volume ===================== */
const D7_VN=30;
const D7_GUESS={grow:'It keeps growing',level:'It levels off',peak:'It rises, then falls'};
// A rough sketch of each guess (a shape only, as a fraction of the plot's height), drawn next to the computed bars.
const D7_guessY=(g,n)=>g==='grow'?.1+.85*(n-1)/29:g==='level'?.1+.75*(1-Math.exp(-(n-1)/4)):.1+.8*Math.exp(-Math.pow((n-8)/7,2));
SCENE({id:'ball-volume',name:'Guess, then compute',tag:'The volume of the unit ball, n = 1 to 30',
 definition:'The unit ball in n dimensions is every point within distance 1 of a centre. Its volume is V(n) = π^(n/2) ÷ Γ(n/2 + 1), where Γ is Euler’s gamma function, which extends the factorial (Γ(k + 1) = k!). The same numbers come from a simpler rule, V(n) = (2π/n) × V(n − 2), starting from V(0) = 1 and V(1) = 2. The formula was known by the middle of the nineteenth century.',
 example:`In one dimension the “ball” is a segment of length ${D7_num(D7_V(1))}; in two it is a disc of area π ≈ ${D7_num(D7_V(2))}; in three a ball of volume 4π/3 ≈ ${D7_num(D7_V(3))}. The volume is largest in ${D7_argmax(D7_V,1,D7_VN)} dimensions, about ${D7_num(D7_V(D7_argmax(D7_V,1,D7_VN)))}, and by n = ${D7_VN} it is only ${D7_num(D7_V(D7_VN),3)}, although the ball always reaches out to distance 1 in every direction.`,
 desc:'A bar chart of the computed volume of the unit ball for each dimension from 1 to 30, with the largest value marked and, once the learner has chosen one, a dashed sketch of their guess drawn over the bars.',
 research:['Euler (1729–30), letters to Goldbach: the interpolation of the factorial that became the gamma function.','Ball (1997). An elementary introduction to modern convex geometry. In Flavors of Geometry, MSRI Publications 31, 1–58.','Hayes (2011). An adventure in the Nth dimension. American Scientist 99.'],
 dur:12,hint:'Choose what you expect to happen first, then add dimensions one at a time and compare the computed bars with your sketch.',
 init:()=>({guess:'',n:1}),
 watch:p=>({guess:'',n:clamp(1+Math.floor(p*1.12*D7_VN),1,D7_VN)}),
 ui:[{choose:[['grow','Keeps growing'],['level','Levels off'],['peak','Rises, then falls']],label:'Your guess',get:s=>s.guess,act:'guess'},
  {b:'Add a dimension',act:'more'},{range:'n',label:'Dimensions shown',min:1,max:D7_VN,get:s=>s.n,act:'n'}],
 on:{guess(s,v){s.guess=D7_GUESS[v]?v:''},more(s){s.n=Math.min(D7_VN,s.n+1)},n(s,v){s.n=clamp(Math.round(+v),1,D7_VN)}},
 draw(s,f,X){
  const pl=D7_plot(70,62,500,196,[.5,D7_VN+.5],[0,6],{xt:[1,5,10,15,20,25,30].map(v=>[v,String(v)]),yt:[0,1,2,3,4,5,6].map(v=>[v,String(v)]),xl:'dimension n',yl:'volume of the unit ball'});
  const peak=D7_argmax(D7_V,1,s.n),allPeak=D7_argmax(D7_V,1,D7_VN);
  let out=heading(s.n<allPeak+1?'Each new dimension adds volume… so far':s.n<D7_VN?`The volume peaked at n = ${allPeak}`:`By n = ${D7_VN} the volume is nearly zero`)+pl.svg;
  for(let n=1;n<=s.n;n++){const v=D7_V(n),bx=pl.X(n)-6;out+=R(bx,pl.Y(v),12,pl.Y(0)-pl.Y(v),n===peak?C.coral:C.blue,'none',2)}
  if(s.n>=2){const v=D7_V(peak);out+=TBF(pl.X(peak)+10,pl.Y(v)-8,`n = ${peak}: ${D7_num(v)}`,13,C.coral,'start')}
  if(s.guess){const pts=[];for(let n=1;n<=D7_VN;n++)pts.push([pl.X(n),pl.Y(6*D7_guessY(s.guess,n))]);out+=D7_poly(pts,C.purple,2.4,'stroke-dasharray="6 5"')+TF(pl.X(D7_VN)-4,pl.Y(6*D7_guessY(s.guess,D7_VN))-8,'your guess (shape only)',13,C.purple,'end')}
  const v=D7_V(s.n);
  out+=D7_tile(40,304,120,'Dimension n',String(s.n),C.ink)+D7_tile(170,304,130,`V(${s.n})`,D7_num(v,4))+D7_tile(310,304,130,'Largest so far',`n = ${peak}`,C.coral)+D7_tile(450,304,120,'Your guess',s.guess?{grow:'growing',level:'levels off',peak:'rise, fall'}[s.guess]:'not yet',C.purple);
  const ph=s.n<=3?`V(${s.n}) = ${D7_num(v)}. ${s.n===1?'A segment of length 2.':s.n===2?'A disc of area π.':'A ball of volume 4π/3.'} Before going on, choose what you expect as n grows.`:
   s.n<=allPeak?`V(${s.n}) = ${D7_num(v)}: still growing, but each step adds less than the one before.`:
   s.n<=allPeak+3?`V(${s.n}) = ${D7_num(v)} is smaller than V(${s.n-1}) = ${D7_num(D7_V(s.n-1))}. The volume has turned round; it peaked at n = ${allPeak}.`:
   `V(${s.n}) = ${D7_num(v,3)}. The ball still reaches distance 1 along every axis, yet its volume heads towards 0.${s.guess?(s.guess==='peak'?' Your guess had the right shape.':' Your sketch and the computed bars part company after n = '+allPeak+'.'):''}`;
  return {svg:out,phase:ph};
 }});

// Why the volume falls: V(n) = V(n−2) × 2π∫₀¹ r(1−r²)^((n−2)/2) dr, and the integral is 1/n.
const D7_slab=n=>2*Math.PI*D7_simpson(r=>r*Math.pow(Math.max(0,1-r*r),(n-2)/2),0,1,4000);
SCENE({id:'ball-volume-why',name:'Two new directions, one factor',tag:'V(n) = (2π/n) × V(n − 2)',
 definition:'Split the n coordinates into the first two and the other n − 2. For a point of the unit disc at distance r from the centre, the remaining coordinates fill an (n − 2)-ball of radius √(1 − r²). Adding up these slices over the disc gives V(n) = V(n − 2) × 2π∫₀¹ r(1 − r²)^((n−2)/2) dr, and the integral works out to 1/n. So each pair of new directions multiplies the volume by 2π/n.',
 example:`While n is less than 2π ≈ ${D7_num(2*Math.PI,3)}, the factor 2π/n is more than 1 and the volume grows. From n = ${D7_first(k=>2*Math.PI/k<1,1,99)} on, it is less than 1, and it keeps shrinking: a new pair of directions adds room only near the centre, where the slices are thick, and in many dimensions there is little such room.`,
 desc:'A bar chart of the factor 2π/n for n from 2 to 24, with a line at 1 and the chosen n highlighted, above three computed lines: the factor, the volume from the recursion and the same volume from the gamma-function formula, plus a numerical integral that checks the factor.',
 research:['Ball (1997). An elementary introduction to modern convex geometry. In Flavors of Geometry, MSRI Publications 31, 1–58.','Euler (1729–30), letters to Goldbach: the gamma function. Γ(1/2) = √π follows from the Gaussian integral.'],
 dur:11,hint:'Move n and read the three lines: the recursion, the gamma-function formula and the numerical slice sum must agree.',
 init:()=>({n:6}),
 watch:p=>({n:clamp(2+Math.floor(p*23),2,24)}),
 ui:[{range:'n',label:'Dimension n',min:2,max:24,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),2,24)}},
 draw(s){
  const n=s.n,fac=2*Math.PI/n,first=D7_first(k=>2*Math.PI/k<1,2,24);
  const pl=D7_plot(70,54,500,130,[1.5,24.5],[0,3.4],{xt:[2,4,6,8,10,12,14,16,18,20,22,24].map(v=>[v,String(v)]),yt:[0,1,2,3].map(v=>[v,String(v)]),yl:'factor 2π/n'});
  let out=heading(`V(${n}) = (2π/${n}) × V(${n-2})`,28)+pl.svg;
  for(let k=2;k<=24;k++){const fk=2*Math.PI/k,top=Math.min(fk,3.4);out+=R(pl.X(k)-7,pl.Y(top),14,pl.Y(0)-pl.Y(top),k===n?(fk>=1?C.blue:C.coral):(fk>=1?C.pale:C.coralp),'none',2)}
  out+=TF(pl.X(2)+10,pl.Y(3.4)+14,'π (2π/2)',13,C.muted,'start');
  out+=L(pl.X(1.5),pl.Y(1),pl.X(24.5),pl.Y(1),C.ink,1.6,'stroke-dasharray="5 4"')+TF(pl.X(24.5)-4,pl.Y(1)-6,'1',13,C.ink,'end');
  out+=TF(pl.X(first)+8,pl.Y(1)-22,`below 1 from n = ${first}`,13,C.coral,'start');
  const I=D7_slab(n),vc=D7_Vclosed(n),v=D7_V(n),rel=Math.abs(vc-v)/vc,ratio=D7_V(n)/D7_V(n-1);
  const fall=D7_first(k=>D7_V(k)<D7_V(k-1),2,24);
  const rows=[
   [`factor 2π/${n}`,D7_num(fac,5),C.ink],
   [`slice sum 2π∫₀¹ r(1−r²)^(${fmt((n-2)/2)}) dr`,D7_num(I,5),C.ink],
   [`V(${n}) = ${D7_num(fac,4)} × V(${n-2}) = ${D7_num(fac,4)} × ${D7_num(D7_V(n-2),4)}`,D7_num(v,6),C.blue],
   [`π^(${fmt(n/2)}) ÷ Γ(${fmt(n/2+1)})`,D7_num(vc,6)+(rel<1e-10?'  ✓':''),C.green]];
  out+=R(30,222,540,112,'#fff',C.grid,8);
  rows.forEach((r,i)=>{const y=246+i*24;out+=TF(46,y,r[0],13,C.muted,'start')+TBF(554,y,r[1],14,r[2],'end')});
  out+=D7_note(`V(${n}) ÷ V(${n-1}) = ${D7_num(ratio,4)}. One dimension at a time, the volume first falls at n = ${fall}.`,356);
  const ph=fac>=1?`2π/${n} = ${D7_num(fac,4)} is more than 1, so V(${n}) = ${D7_num(v,4)} is larger than V(${n-2}) = ${D7_num(D7_V(n-2),4)}. The slice sum, computed by Simpson’s rule with 4000 strips, gives the same factor.`:
   `2π/${n} = ${D7_num(fac,4)} is less than 1, so V(${n}) = ${D7_num(v,4)} is smaller than V(${n-2}). The recursion and Euler’s gamma-function formula agree to ${rel<1e-10?'at least 10':'about '+Math.floor(-Math.log10(rel))} significant figures.`;
  return {svg:out,phase:ph};
 }});

// The peak depends on the radius: a ball of radius r has volume rⁿ·V(n), and the factor becomes 2πr²/n.
const D7_RN=40;
SCENE({id:'ball-volume-radius',name:'The peak depends on the ruler',tag:'Radius r: volume rⁿ·V(n), surface n·rⁿ⁻¹·V(n)',
 definition:'A ball of radius r in n dimensions has volume rⁿ × V(n) and boundary area n × rⁿ⁻¹ × V(n). Volumes in different dimensions are measured in different units (square metres, cubic metres, metres to the fourth…), so “largest in five dimensions” is a fact about radius 1, not about space. Whatever the radius, the factor for two more directions, 2πr²/n, falls below 1 once n passes 2πr², so the volume always ends up shrinking towards 0.',
 example:`For radius 1 the volume is largest at n = ${D7_argmax(D7_V,1,D7_RN)} and the boundary area at n = ${D7_argmax(D7_S,1,D7_RN)}. For radius 2 the volume keeps growing until n = ${D7_argmax(n=>Math.pow(2,n)*D7_V(n),1,D7_RN)}, then falls.`,
 desc:'A bar chart of the volume (or boundary area) of a ball of the chosen radius for dimensions 1 to 40, each bar shown as a share of the largest, with the dimension of the largest marked.',
 research:['Hayes (2011). An adventure in the Nth dimension. American Scientist 99.','Ball (1997). An elementary introduction to modern convex geometry. MSRI Publications 31.'],
 dur:11,hint:'Change the radius and watch the peak move; switch between volume and boundary area.',
 init:()=>({r:1,what:'vol'}),
 watch:p=>({r:+(lerp(.8,2,smooth(p<.5?p*2:2-p*2))).toFixed(2),what:p<.5?'vol':'area'}),
 ui:[{range:'r',label:'Radius r',min:.5,max:2,step:.05,get:s=>s.r,act:'r'},{choose:[['vol','Volume'],['area','Boundary area']],label:'Show',get:s=>s.what,act:'what'}],
 on:{r(s,v){s.r=clamp(Math.round(+v*20)/20,.5,2)},what(s,v){s.what=v==='area'?'area':'vol'}},
 draw(s){
  const r=s.r,vol=s.what!=='area',lg=n=>vol?D7_LOGV[n]+n*Math.log10(r):Math.log10(n)+D7_LOGV[n]+(n-1)*Math.log10(r);
  const pk=D7_argmax(lg,1,D7_RN),lmax=lg(pk);
  const pl=D7_plot(70,62,500,190,[.5,D7_RN+.5],[0,1],{xt:[1,5,10,15,20,25,30,35,40].map(v=>[v,String(v)]),yt:[[0,'0'],[.5,'½'],[1,'1']],xl:'dimension n',yl:(vol?'volume':'boundary area')+' as a share of the largest'});
  let out=heading(`Radius ${fmt(r)}: ${vol?'volume':'boundary area'} is largest at n = ${pk}`)+pl.svg;
  for(let n=1;n<=D7_RN;n++){const sh=Math.pow(10,lg(n)-lmax);out+=R(pl.X(n)-4.5,pl.Y(sh),9,pl.Y(0)-pl.Y(sh),n===pk?C.coral:C.blue,'none',2)}
  // two more directions multiply the volume by 2πr²/n, and the boundary area by 2πr²/(n − 2)
  const crit=2*Math.PI*r*r+(vol?0:2),clab=vol?'2πr²':'2πr² + 2';
  if(crit<=D7_RN+.5)out+=L(pl.X(crit),pl.Y(0),pl.X(crit),pl.Y(1),C.purple,1.6,'stroke-dasharray="4 4"')+(t=>{const tw=t.length*7.2+8,lx=crit>30?pl.X(crit)-6-tw:pl.X(crit)+6;return R(lx,pl.Y(.8)-14,tw,19,'#fff',C.purple,4)+TF(lx+4,pl.Y(.8),t,13,C.purple,'start')})(`${clab} = ${D7_num(crit,3)}`);
  const pv=Math.pow(10,lmax);
  out+=D7_tile(40,300,160,'Largest at',`n = ${pk}`,C.coral)+D7_tile(220,300,160,'Its value',D7_num(pv,4))+D7_tile(400,300,160,`At n = ${D7_RN}`,lg(D7_RN)>-3&&lg(D7_RN)<6?D7_num(Math.pow(10,lg(D7_RN)),3):D7_sci(lg(D7_RN),3),C.ink);
  return {svg:out,phase:`Radius ${fmt(r)}: the ${vol?'volume rⁿ·V(n)':'boundary area n·rⁿ⁻¹·V(n)'} is largest at n = ${pk}, about ${D7_num(pv,4)}. The purple line marks n = ${clab}, where the factor for two more directions, ${vol?'2πr²/n':'2πr²/(n − 2)'}, drops below 1. Past it the bars only shrink.${r===1&&vol?` For radius 1, the boundary area peaks ${D7_argmax(D7_S,1,D7_RN)-pk} steps later, at n = ${D7_argmax(D7_S,1,D7_RN)}.`:''}`};
 }});

/* ===================== Lesson: near-surface ===================== */
// The share of a ball (or cube) that lies deeper than ε below its surface is (1 − ε)ⁿ; it is kept as a log10.
const D7_coreLog=(eps,n)=>n*Math.log10(1-eps);
// Show a share that may be very close to 0 or to 1 without rounding it into a falsehood.
function D7_share(lg){const v=Math.pow(10,lg);return v>=.001?D7_pct(v,v>=.1?1:2):v>=1e-7?D7_pct(v,Math.min(8,Math.ceil(-Math.log10(v*100))+2)):D7_sci(lg,2)}
function D7_rest(lg){const v=Math.pow(10,lg);if(v<1e-7)return 'all but '+D7_sci(lg,2);if(v<=.001){const d=Math.min(6,Math.ceil(-Math.log10(v*100)));return D7_pct(1-v,d)}return D7_pct(1-v,1-v>=.1?1:2)}
SCENE({id:'near-surface',name:'All peel, no orange',tag:'(1 − ε)ⁿ of the volume lies deeper than ε',
 definition:'Shrink the unit ball to radius 1 − ε and its volume shrinks by the factor (1 − ε)ⁿ. So the share of the ball lying within ε of its surface is 1 − (1 − ε)ⁿ, and for any fixed ε this approaches 1 as n grows. The same holds for a cube: the inner cube with its faces moved in by ε (on a cube of half-width 1) holds (1 − ε)ⁿ of the volume.',
 example:`Take an orange of radius 1 with peel 0.1 thick. In three dimensions the peel is ${D7_rest(D7_coreLog(.1,3))} of the fruit. In ten dimensions it is ${D7_rest(D7_coreLog(.1,10))}, and in a hundred ${D7_rest(D7_coreLog(.1,100))}: the part deeper than the peel holds only ${D7_share(D7_coreLog(.1,100))} of the volume.`,
 desc:'A cross-section of a ball or cube with a peel of the chosen depth shaded, a bar splitting the volume between core and peel, a curve of the peel’s share as the dimension grows, and a table of shares in 3, 10, 100 and 1000 dimensions.',
 research:['Ball (1997). An elementary introduction to modern convex geometry. MSRI Publications 31 (volume in high dimensions lies near the boundary).','Blum, Hopcroft & Kannan (2020). Foundations of Data Science. Cambridge University Press, chapter 2.'],
 dur:12,hint:'Set the peel depth ε and the dimension n, and switch between a ball and a cube. The share deeper than ε is always (1 − ε)ⁿ.',
 init:()=>({eps:.1,n:3,shape:'ball'}),
 watch:p=>({eps:.1,n:clamp(Math.round(1+Math.pow(Math.min(1,p*1.25),2)*199),1,200),shape:p<.75?'ball':'cube'}),
 ui:[{range:'eps',label:'Peel depth ε',min:.01,max:.5,step:.01,get:s=>s.eps,act:'eps'},{range:'n',label:'Dimension n',min:1,max:200,get:s=>s.n,act:'n'},{choose:[['ball','Ball'],['cube','Cube']],label:'Shape',get:s=>s.shape,act:'shape'}],
 on:{eps(s,v){s.eps=clamp(Math.round(+v*100)/100,.01,.5)},n(s,v){s.n=clamp(Math.round(+v),1,200)},shape(s,v){s.shape=v==='cube'?'cube':'ball'}},
 draw(s){
  const e=s.eps,n=s.n,lg=D7_coreLog(e,n),core=Math.pow(10,lg),cube=s.shape==='cube';
  let out=heading(`n = ${n}: the peel holds ${D7_rest(lg)} of the ${cube?'cube':'ball'}`);
  // cross-section (true to scale: radius or half-width 1 and 1 − ε)
  const cx=120,cy=168,Rr=88;
  if(cube)out+=R(cx-Rr,cy-Rr,2*Rr,2*Rr,C.coralp,C.coral,0)+R(cx-Rr*(1-e),cy-Rr*(1-e),2*Rr*(1-e),2*Rr*(1-e),C.pale,C.blue,0);
  else out+=Ci(cx,cy,Rr,C.coralp,C.coral)+Ci(cx,cy,Rr*(1-e),C.pale,C.blue);
  out+=TF(cx,cy+4,'core',13,C.blue)+TF(cx,cy-Rr-10,`peel ε = ${fmt(e)}`,13,C.coral)+TF(cx,cy+Rr+22,'a slice through the centre',13,C.muted);
  // share bar
  const bx=250,bw=320;out+=TF(bx,62,`share of the volume in ${n} dimension${n===1?'':'s'}`,13,C.muted,'start');
  const cw=Math.max(core>0?1.5:0,bw*core);out+=R(bx,70,bw,26,C.coral,'none',4)+R(bx,70,cw,26,C.blue,'none',4);
  out+=TF(bx,114,`core ${D7_share(lg)}`,13,C.blue,'start')+TF(bx+bw,114,`peel ${D7_rest(lg)}`,13,C.coral,'end');
  // curve of the peel's share against n
  const pl=D7_plot(bx,140,bw,90,[1,200],[0,1],{xt:[[1,'1'],[50,'50'],[100,'100'],[150,'150'],[200,'200']],yt:[[0,'0'],[1,'1']],xl:'',yl:''});out+=pl.svg;
  const pts=[];for(let k=1;k<=200;k++)pts.push([pl.X(k),pl.Y(1-Math.pow(1-e,k))]);out+=D7_poly(pts,C.coral,2.2)+Ci(pl.X(n),pl.Y(1-core),5,C.coral,'#fff');
  out+=TF(bx+bw,134,'peel share against n',13,C.muted,'end');
  // table
  out+=R(30,284,540,72,'#fff',C.grid,8)+TF(46,304,'n',13,C.muted,'start')+TF(46,324,'core',13,C.blue,'start')+TF(46,344,'peel',13,C.coral,'start');
  [3,10,100,1000].forEach((k,i)=>{const x=160+i*115,l=D7_coreLog(e,k);out+=TBF(x,304,String(k),13,C.ink)+TF(x,324,D7_share(l),13,C.blue)+TF(x,344,D7_rest(l),13,C.coral)});
  return {svg:out,phase:`Shrinking by 1 − ε = ${fmt(1-e)} in each of ${n} direction${n===1?'':'s'} multiplies the volume by ${fmt(1-e)}^${n} = ${D7_share(lg)}. Everything else, ${D7_rest(lg)}, lies within ${fmt(e)} of the ${cube?'faces':'surface'}.${n>=50?' In high dimensions a “typical” point of a solid body is near its boundary.':''}`};
 }});

// Uniform random points in the unit n-ball. For n ≤ 10, by rejection: throw points into the cube [−1, 1]ⁿ and keep
// those inside. For larger n almost no throw lands inside, so: a random direction times a radius U^(1/n), which is what
// "uniform" means (the chance of a radius below r is rⁿ). Cached per dimension and seed.
const D7_BALLPTS={};
function D7_ballPts(n,seed,N){const key=n+':'+seed;let c=D7_BALLPTS[key];
 if(!c){c=D7_BALLPTS[key]={pts:[],tries:0,r:D7_rng(seed*7919+n)}}
 while(c.pts.length<N){const r=c.r;
  if(n<=10){let q=0,x0=0,x1=0;for(let i=0;i<n&&q<=1;i++){const x=2*r()-1;q+=x*x;if(i===0)x0=x;else if(i===1)x1=x}c.tries++;if(q<=1)c.pts.push({rad:Math.sqrt(q),ang:Math.atan2(x1,x0)})}
  else{const u=D7_unit(r,n);c.tries++;c.pts.push({rad:Math.pow(r(),1/n),ang:Math.atan2(u[1],u[0])})}}
 return {pts:c.pts.slice(0,N),tries:c.tries,per:c.tries/c.pts.length};
}
const D7_NS=[2,3,6,10,100,1000];
SCENE({id:'near-surface-sampling',name:'Throw points into a ball',tag:'Random radii pile up near 1',
 definition:'Pick points at random, evenly spread through the unit n-ball, and measure each one’s distance from the centre. The chance that a point lies within radius r is the volume share rⁿ, so the average distance is n/(n + 1) and the radii crowd towards 1 as n grows. Up to ten dimensions the points here are found by throwing darts into the surrounding cube and keeping those that land inside the ball.',
 example:`In two dimensions the average distance from the centre is ${D7_num(2/3,3)}; in a hundred it is ${D7_num(100/101,4)}. Throwing darts stops working long before then: the ball fills only V(n)/2ⁿ of its cube, which is ${D7_pct(D7_V(10)/1024,2)} in ten dimensions and ${D7_sci(D7_LOGV[100]-100*Math.log10(2),2)} in a hundred, so for n above 10 each point is a random direction times a radius drawn to have the chance rⁿ.`,
 desc:'Points drawn at their true distance from the centre, at the angle of their first two coordinates, beside a histogram of their distances with the counts expected from the rule rⁿ, and tiles comparing the sample with the formulas.',
 research:['Ball (1997). An elementary introduction to modern convex geometry. MSRI Publications 31.','Muller (1959). A note on a method for generating points uniformly on n-dimensional spheres. Communications of the ACM 2(4), 19–20 (random directions from normal numbers).','Seeded random sample; each press adds 100 points.'],
 dur:12,hint:'Choose a dimension and add points. Compare the histogram with the expected counts, and the mean radius with n/(n + 1).',
 init:()=>({n:2,k:3,seed:1}),
 watch:p=>({n:D7_NS[Math.min(5,Math.floor(p*6))],k:Math.min(6,1+Math.floor((p*6%1)*8)),seed:1}),
 ui:[{choose:D7_NS.map(v=>[v,String(v)]),label:'Dimension n',get:s=>s.n,act:'n'},{b:'Add 100 points',act:'more'},{b:'New sample',act:'reseed'}],
 on:{n(s,v){s.n=D7_NS.includes(+v)?+v:2;s.k=3},more(s){s.k=Math.min(20,s.k+1)},reseed(s){s.seed=s.seed%97+1;s.k=3}},
 draw(s){
  const n=s.n,N=100*s.k,g=D7_ballPts(n,s.seed,N),rad=g.pts.map(p=>p.rad);
  let out=heading(`${N} random points in the ${n}-dimensional ball`);
  const cx=118,cy=180,Rr=96;out+=Ci(cx,cy,Rr,'#fff',C.line)+Ci(cx,cy,Rr*.9,'none',C.grid,'stroke-dasharray="3 4"');
  for(const p of g.pts)out+=Ci(cx+Rr*p.rad*Math.cos(p.ang),cy-Rr*p.rad*Math.sin(p.ang),2,C.blue);
  out+=TF(cx,cy+Rr+22,'distance from the centre, true',13,C.muted)+TF(cx,cy+Rr+38,'(angle from the first two axes)',13,C.muted);
  const bins=20,h=D7_hist(rad,0,1,bins),exp=range(bins).map(i=>N*(Math.pow((i+1)/bins,n)-Math.pow(i/bins,n))),ymax=Math.max(...h,...exp,1)*1.08;
  const pl=D7_plot(262,62,310,170,[0,1],[0,ymax],{xt:[[0,'0'],[.5,'0.5'],[.9,'0.9'],[1,'1']],xl:'distance from the centre',yt:[[0,'0'],[ymax/1.08,String(Math.round(ymax/1.08))]],yl:'how many points'});out+=pl.svg;
  h.forEach((c,i)=>{if(c)out+=R(pl.X(i/bins)+1,pl.Y(c),310/bins-2,pl.Y(0)-pl.Y(c),C.blue,'none',2)});
  const step=[];exp.forEach((e,i)=>{step.push([pl.X(i/bins),pl.Y(e)],[pl.X((i+1)/bins),pl.Y(e)])});out+=D7_poly(step,C.coral,2,'stroke-dasharray="5 3"');
  out+=TF(572,56,'dashed: expected from rⁿ',13,C.coral,'end');
  const m=D7_mean(rad),outer=rad.filter(r=>r>.9).length/N;
  out+=D7_tile(262,272,150,'Mean distance',D7_num(m,3))+D7_tile(422,272,150,'Formula n/(n+1)',D7_num(n/(n+1),3),C.coral);
  out+=D7_tile(262,324,150,'Beyond 0.9',D7_pct(outer,1))+D7_tile(422,324,150,'Formula 1 − 0.9ⁿ',D7_rest(D7_coreLog(.1,n)),C.coral);
  const how=n<=10?`Found by throwing ${D7_group(g.tries)} darts into the cube: one in ${D7_num(g.per,3)} landed inside, against 2ⁿ ÷ V(n) = ${D7_num(Math.pow(2,n)/D7_V(n),3)}.`:`Darts would almost never land inside (a share of ${D7_sci(D7_LOGV[n]-n*Math.log10(2),2)}), so each point is a random direction with radius U^(1/${n}).`;
  return {svg:out,phase:`Mean distance ${D7_num(m,3)} against n/(n + 1) = ${D7_num(n/(n+1),3)}; ${D7_pct(outer,1)} of the points lie beyond 0.9. ${how}`};
 }});

// Concentration on the sphere: the first coordinate x₁ of a random point of the unit sphere in Rⁿ has density
// proportional to (1 − t²)^((n−3)/2). Shares by Simpson's rule, checked against 1200 seeded points.
const D7_SPH={},D7_SPHN=1200;
function D7_spherePts(n){if(!D7_SPH[n]){const r=D7_rng(4242+n),a=[];for(let i=0;i<D7_SPHN;i++){const u=D7_unit(r,n);a.push([u[0],u[1]])}D7_SPH[n]=a}return D7_SPH[n]}
const D7_bandShare=(n,d)=>{const f=t=>Math.pow(Math.max(0,1-t*t),(n-3)/2),m=n>200?20000:4000;return n===3?d:D7_simpson(f,0,d,m)/D7_simpson(f,0,1,m)};
const D7_EQN=[3,10,100,1000];
SCENE({id:'near-surface-equator',name:'Most of a sphere is near its equator',tag:'Concentration of measure: Lévy, Milman',
 definition:'On the unit sphere in n dimensions, take the band of points within δ of an equator, the points whose first coordinate lies between −δ and δ. As n grows, this band holds nearly all of the sphere’s area, however thin it is. Any direction can serve as the pole, so most of the sphere is near every equator at once. Paul Lévy noticed this around 1919–22; from 1971 Vitali Milman made it a working tool, now called concentration of measure.',
 example:`In three dimensions the band’s share is exactly its width, 2δ ÷ 2 = δ (Archimedes’ hat-box theorem), so δ = 0.1 holds ${D7_pct(D7_bandShare(3,.1),1)}. In a hundred dimensions the same band holds ${D7_pct(D7_bandShare(100,.1),1)}, and in a thousand ${D7_pct(D7_bandShare(1000,.1),3)}. A random point’s first coordinate has typical size 1/√n.`,
 desc:'Left: a circle standing for the sphere, with the band shaded and the shadow of 300 random points of the n-dimensional sphere on the plane of its first two coordinates. Right: the computed distribution of the first coordinate with the band shaded, a histogram of 1200 sampled points, and tiles comparing the computed and sampled shares.',
 research:['Lévy (1922). Leçons d’analyse fonctionnelle. Gauthier-Villars, Paris.','Milman (1971). A new proof of A. Dvoretzky’s theorem on cross-sections of convex bodies. Functional Analysis and Its Applications 5, 288–295.','Ledoux (2001). The Concentration of Measure Phenomenon. American Mathematical Society.','Archimedes, On the Sphere and Cylinder: a band of a sphere has the area of the matching band of the enclosing cylinder.'],
 dur:12,hint:'Choose the dimension and the band’s half-width δ. Compare the share computed by integration with the share of 1200 random points.',
 init:()=>({n:10,d:.1}),
 watch:p=>({n:D7_EQN[Math.min(3,Math.floor(p*4))],d:.1}),
 ui:[{choose:D7_EQN.map(v=>[v,String(v)]),label:'Dimension n',get:s=>s.n,act:'n'},{range:'d',label:'Half-width δ',min:.01,max:.5,step:.01,get:s=>s.d,act:'d'}],
 on:{n(s,v){s.n=D7_EQN.includes(+v)?+v:10},d(s,v){s.d=clamp(Math.round(+v*100)/100,.01,.5)}},
 draw(s){
  const n=s.n,d=s.d,pts=D7_spherePts(n),share=D7_bandShare(n,d),smp=pts.filter(p=>Math.abs(p[0])<=d).length/pts.length;
  let out=heading(`n = ${n}: the band |x₁| ≤ ${fmt(d)} holds ${D7_pct(share,share>.999?3:1)}`);
  const cx=122,cy=172,Rr=96;
  out+=`<clipPath id="d7eqc"><circle cx="${cx}" cy="${cy}" r="${Rr}"/></clipPath>`+Ci(cx,cy,Rr,'#fff',C.line)+R(cx-Rr,cy-Rr*d,2*Rr,2*Rr*d,C.amberp,'none',0,'clip-path="url(#d7eqc)"')+Ci(cx,cy,Rr,'none',C.line);
  for(const p of pts.slice(0,300))out+=Ci(cx+Rr*p[1],cy-Rr*p[0],1.8,Math.abs(p[0])<=d?C.amber:C.blue);
  out+=TF(cx,cy-Rr-10,'x₁ is up',13,C.muted)+TF(cx,cy+Rr+22,'shadow of 300 random points',13,C.muted)+TF(cx,cy+Rr+38,'on the plane of x₁ and x₂',13,C.muted);
  // density of x₁
  const f=t=>n===3?1:Math.pow(Math.max(0,1-t*t),(n-3)/2),pl=D7_plot(264,62,308,170,[-1,1],[0,1.12],{xt:[[-1,'−1'],[0,'0'],[1,'1']],xl:'first coordinate x₁',yl:'how often'});out+=pl.svg;
  const bins=40,h=D7_hist(pts.map(p=>p[0]),-1,1,bins),hm=Math.max(...h,1);
  const dens=[];for(let i=0;i<=400;i++){const t=-1+i/200;dens.push([pl.X(t),pl.Y(f(t))])}
  out+=R(pl.X(-d),pl.Y(1.12),pl.X(d)-pl.X(-d),pl.Y(0)-pl.Y(1.12),C.amberp,'none',0);
  // histogram scaled so that its area matches the curve's
  const area=D7_simpson(f,-1,1,4000),scale=area/(2/bins)/pts.length;
  h.forEach((c,i)=>{const v=Math.min(1.1,c*scale);if(c)out+=R(pl.X(-1+i*2/bins)+.5,pl.Y(v),308/bins-1,pl.Y(0)-pl.Y(v),C.blue,'none',1,'opacity=".55"')});
  out+=D7_poly(dens,C.coral,2.2);
  out+=D7_tile(36,322,124,'Band, computed',D7_pct(share,share>.999?3:1),C.coral)+D7_tile(170,322,124,'Band, sampled',D7_pct(smp,1))+D7_tile(304,322,124,'1/√n',D7_num(1/Math.sqrt(n),3),C.coral)+D7_tile(438,322,134,'Sample s.d. of x₁',D7_num(D7_sd(pts.map(p=>p[0])),3));
  out+=TF(572,56,'red: computed · blue: 1200 points',13,C.muted,'end');
  return {svg:out,phase:n===3?`In three dimensions the band’s share equals δ = ${fmt(d)}: Archimedes’ hat-box theorem. Every height on the sphere is equally likely, so no concentration yet.`:
   `The share within ${fmt(d)} of the equator is ${D7_pct(share,share>.999?3:1)} by integration and ${D7_pct(smp,1)} in the sample. The first coordinate’s spread, ${D7_num(D7_sd(pts.map(p=>p[0])),3)}, matches 1/√${n} = ${D7_num(1/Math.sqrt(n),3)}, so the shadow of the points shrinks towards the centre as n grows, though every point is at distance 1.`};
 }});

/* ===================== Lesson: nearly-perpendicular ===================== */
// Cosines between pairs of random directions in n dimensions, generated pair by pair from a fixed seed (cached).
const D7_COS={};
function D7_cosines(n,N){let c=D7_COS[n];if(!c)c=D7_COS[n]={r:D7_rng(1000+n),v:[]};while(c.v.length<N){const a=D7_unit(c.r,n),b=D7_unit(c.r,n);c.v.push(D7_dot(a,b))}return c.v.slice(0,N)}
const D7_PN=[2,3,10,100,1000];
const D7_ANG_GUESS={wide:[0,180,'any angle'],mid:[60,120,'60° to 120°'],narrow:[85,95,'85° to 95°']};
SCENE({id:'nearly-perpendicular',name:'Two random directions',tag:'The angle between random vectors',
 definition:'Choose two directions at random in n dimensions and measure the angle between them from their dot product: cos θ = x·y ÷ (|x| |y|). In the plane every angle is equally likely. As n grows the cosine has average 0 and spread 1/√n, so the angle crowds in around 90°: in many dimensions, random directions are almost always nearly perpendicular.',
 example:`The spread of the cosine is 1/√n, which is ${D7_num(1/Math.sqrt(10),3)} in ten dimensions and ${D7_num(1/Math.sqrt(1000),3)} in a thousand. Near 90° a change of 0.0316 in the cosine is a change of about ${D7_num(180/Math.PI/Math.sqrt(1000),3)}°, so in a thousand dimensions most pairs of random directions are within about 2° of a right angle.`,
 desc:'A histogram of the computed angles between random pairs of directions, from 0° to 180°, for the chosen dimension, with the learner’s guess for a thousand dimensions shown as a shaded range, and tiles comparing the measured spread with 1/√n.',
 research:['Ball (1997). An elementary introduction to modern convex geometry. MSRI Publications 31 (the spread of a coordinate on the sphere).','Blum, Hopcroft & Kannan (2020). Foundations of Data Science. Cambridge University Press, chapter 2 (random vectors are nearly orthogonal).','Seeded random directions: normal numbers in each coordinate, scaled to length 1.'],
 dur:12,hint:'First guess where the angles will fall in a thousand dimensions. Then choose a dimension, add pairs, and compare the histogram with your guess.',
 init:()=>({n:2,k:3,guess:''}),
 watch:p=>({n:D7_PN[Math.min(4,Math.floor(p*5))],k:2+Math.floor((p*5%1)*8),guess:''}),
 ui:[{choose:[['wide','Any angle'],['mid','60° to 120°'],['narrow','Within 5° of 90°']],label:'Your guess for n = 1000',get:s=>s.guess,act:'guess'},
  {choose:D7_PN.map(v=>[v,String(v)]),label:'Dimension n',get:s=>s.n,act:'n'},{b:'Add 100 pairs',act:'more'}],
 on:{guess(s,v){s.guess=D7_ANG_GUESS[v]?v:''},n(s,v){s.n=D7_PN.includes(+v)?+v:2},more(s){s.k=Math.min(30,s.k+1)}},
 draw(s){
  const n=s.n,N=100*s.k,cs=D7_cosines(n,N),ang=cs.map(D7_deg),sdc=D7_sd(cs),sda=D7_sd(ang),h=D7_hist(ang,0,180,90),hm=Math.max(...h,1);
  const pl=D7_plot(60,62,500,176,[0,180],[0,hm*1.12],{xt:[0,30,60,90,120,150,180].map(v=>[v,v+'°']),xl:'angle between the two directions',yt:[[0,'0'],[hm,String(hm)]],yl:'how many pairs'});
  let out=heading(`${N} random pairs in ${n} dimensions`);
  if(s.guess){const g=D7_ANG_GUESS[s.guess];out+=R(pl.X(g[0]),62,pl.X(g[1])-pl.X(g[0]),176,C.purplep,'none',0)}
  out+=pl.svg.replace(/fill="#fff"/,'fill="none"');
  h.forEach((c,i)=>{if(c)out+=R(pl.X(i*2)+.6,pl.Y(c),500/90-1.2,pl.Y(0)-pl.Y(c),C.blue,'none',1)});
  if(s.guess){const g=D7_ANG_GUESS[s.guess];out+=TF(pl.X(g[0])+4,78,'your guess for n = 1000',13,C.purple,g[0]>100?'end':'start')}
  const within=ang.filter(a=>Math.abs(a-90)<=5).length/N;
  out+=D7_tile(30,288,128,'Within 5° of 90°',D7_pct(within,1))+D7_tile(166,288,128,'s.d. of cos θ',D7_num(sdc,3))+D7_tile(302,288,128,'1/√n',D7_num(1/Math.sqrt(n),3),C.coral)+D7_tile(438,288,132,'s.d. of θ',D7_num(sda,3)+'°');
  out+=D7_note(n>=10?`For n ≥ 10 the angle’s spread is close to (180/π)/√n = ${D7_num(180/Math.PI/Math.sqrt(n),3)}°.`:n===2?'In the plane every angle from 0° to 180° is equally likely.':'In three dimensions angles near 90° are already the most common.',356);
  const ph=n===2?'In two dimensions the angle between random directions is spread evenly from 0° to 180°.':
   n===3?`In three dimensions angles near 90° are commonest (the chance is proportional to sin θ), but small and large angles still occur: ${D7_pct(within,1)} of pairs fall within 5° of a right angle.`:
   `The cosines have spread ${D7_num(sdc,3)}, close to 1/√${n} = ${D7_num(1/Math.sqrt(n),3)}, and ${D7_pct(within,1)} of the ${N} pairs are within 5° of a right angle.${s.guess&&n===1000?(s.guess==='narrow'?' Your guess was right.':' The angles are far more tightly bunched than your guess.'):''}`;
  return {svg:out,phase:ph};
 }});

// One pair of random vectors, component by component: x·y is a sum of n products of random sign.
SCENE({id:'nearly-perpendicular-why',name:'Why the dot product is small',tag:'A sum of n small terms of random sign',
 definition:'Scale two random vectors to length 1. Each coordinate is then about 1/√n in size, so each product xᵢyᵢ is about 1/n, positive or negative at random. Adding n such terms is like a random walk of n steps of size 1/n: the total wanders only about √n × 1/n = 1/√n from zero. That total is the cosine of the angle.',
 example:'With 4 coordinates a few large products can add up to a cosine near ±1, a small angle or a large one. With 40, the positive and negative products nearly cancel, and the cosine stays close to 0.',
 desc:'Bars for the coordinates of two random unit vectors and for their products, coloured by sign, with the running total of the products drawn as a line ending at the dot product, and tiles for the dot product, the angle and 1/√n.',
 research:['Blum, Hopcroft & Kannan (2020). Foundations of Data Science. Cambridge University Press, chapter 2.','Seeded random vectors; “New pair” draws another.'],
 dur:11,hint:'Change the number of coordinates and draw new pairs. Watch the running total of the products: does it end near 0?',
 init:()=>({n:8,seed:1}),
 watch:p=>({n:[4,8,16,40][Math.min(3,Math.floor(p*4))],seed:1+Math.floor(p*12)}),
 ui:[{range:'n',label:'Coordinates n',min:2,max:40,get:s=>s.n,act:'n'},{b:'New pair',act:'pair'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),2,40)},pair(s){s.seed=s.seed%500+1}},
 draw(s){
  const n=s.n,r=D7_rng(s.seed*131+n),x=D7_unit(r,n),y=D7_unit(r,n),pr=range(n).map(i=>x[i]*y[i]),c=sum(pr),th=D7_deg(c);
  let out=heading(`x·y = ${D7_num(c,3)}, so the angle is ${D7_num(th,3)}°`);
  const x0=96,w=470,bw=w/n,amp=Math.max(...range(n).map(i=>Math.max(Math.abs(x[i]),Math.abs(y[i])))),sc=30/amp;
  const row=(yc,vals,lab,col,s2=sc)=>{let o=L(x0,yc,x0+w,yc,C.grid,1)+TF(x0-10,yc+4,lab,13,col,'end');vals.forEach((v,i)=>{const hh=v*s2;o+=R(x0+i*bw+bw*.15,v>0?yc-hh:yc,bw*.7,Math.abs(hh),v>0?col:tint(col,.45),'none',1)});return o};
  out+=row(84,Array.from(x),'x',C.blue)+row(160,Array.from(y),'y',C.green);
  const pmax=Math.max(...pr.map(Math.abs),1e-9),ps=34/pmax;out+=row(250,pr,'xᵢ × yᵢ',C.purple,ps);
  // running total, drawn on the products' row with the same scale as the cosine axis (±1 → ±70)
  const cum=[];let t=0;cum.push([x0,250]);pr.forEach((v,i)=>{t+=v;cum.push([x0+(i+1)*bw,250-t*70])});
  out+=D7_poly(cum,C.coral,2.4)+Ci(x0+w,250-c*70,5,C.coral,'#fff')+TF(x0+w+6,250-c*70+4,'total',13,C.coral,'start');
  out+=TF(x0,212,'red line: running total (±1 = ±70 units)',13,C.coral,'start');
  out+=D7_tile(40,318,124,'x·y = cos θ',D7_num(c,3),C.coral)+D7_tile(174,318,124,'Angle θ',D7_num(th,3)+'°',C.ink)+D7_tile(308,318,124,'Typical |xᵢyᵢ|, 1/n',D7_num(1/n,3),C.purple)+D7_tile(442,318,124,'Typical total, 1/√n',D7_num(1/Math.sqrt(n),3),C.coral);
  const pos=pr.filter(v=>v>0).length;
  return {svg:out,phase:`${pos} of the ${n} products are positive and ${n-pos} negative. Their total, ${D7_num(c,3)}, is the cosine of the angle: ${D7_num(th,3)}°. With unit vectors |x| = |y| = 1, so no further division is needed. ${n>=20?'Many small terms of random sign cancel, so the total is usually close to 0.':'With few terms one large product can dominate.'}`};
 }});

// Many random directions at once: all pairs of m unit vectors in n dimensions.
const D7_MANY={};
function D7_manyVecs(n){if(!D7_MANY[n]){const r=D7_rng(77+n),v=[];for(let i=0;i<400;i++)v.push(D7_unit(r,n));D7_MANY[n]={v,st:{}}}return D7_MANY[n]}
function D7_manyStats(n,m){const c=D7_manyVecs(n);if(!c.st[m]){const cs=[];let worst=0;for(let i=0;i<m;i++)for(let j=i+1;j<m;j++){const v=D7_dot(c.v[i],c.v[j]);cs.push(v);if(Math.abs(v)>worst)worst=Math.abs(v)}c.st[m]={h:D7_hist(cs.map(D7_deg),0,180,90),worst,pairs:cs.length}}return c.st[m]}
const D7_MN=[10,100,1000];
SCENE({id:'nearly-perpendicular-many',name:'Room for many directions',tag:'More than n directions, all nearly perpendicular',
 definition:'In n dimensions at most n directions can be exactly perpendicular to one another. Allow each pair to miss a right angle by a few degrees, and the number of directions that fit grows exponentially with n. Random directions show it: take hundreds of them in a thousand dimensions and every one of the tens of thousands of pairs is close to perpendicular.',
 // (a getter, so that the sample is computed only when the scene is opened)
 get example(){return `${D7_group(D7_choose(400,2))} pairs can be formed from 400 directions. In a thousand dimensions the worst of them, in this seeded sample, misses a right angle by ${D7_num(90-D7_deg(D7_manyStats(1000,400).worst),3)}°.`},
 desc:'A histogram of the angles between all pairs of the chosen number of random directions, with the pair furthest from 90° marked, and tiles for the number of pairs and the worst angle.',
 research:['Johnson & Lindenstrauss (1984). Extensions of Lipschitz mappings into a Hilbert space. Contemporary Mathematics 26, 189–206.','Blum, Hopcroft & Kannan (2020). Foundations of Data Science. Cambridge University Press, chapter 2.','Seeded sample of 400 random directions in each dimension.'],
 dur:11,hint:'Add directions and change the dimension. Compare the number of directions with n, and read how far the worst pair is from 90°.',
 init:()=>({n:100,m:50}),
 watch:p=>({n:D7_MN[Math.min(2,Math.floor(p*3))],m:clamp(Math.round(20+(p*3%1)*380),2,400)}),
 ui:[{choose:D7_MN.map(v=>[v,String(v)]),label:'Dimension n',get:s=>s.n,act:'n'},{range:'m',label:'Directions',min:2,max:400,step:2,get:s=>s.m,act:'m'}],
 on:{n(s,v){s.n=D7_MN.includes(+v)?+v:100},m(s,v){s.m=clamp(Math.round(+v),2,400)}},
 draw(s){
  const {n,m}=s,st=D7_manyStats(n,m),worst=D7_deg(st.worst),miss=Math.max(90-worst,worst-90,Math.abs(D7_deg(-st.worst)-90)),hm=Math.max(...st.h,1);
  let out=heading(`${m} directions in ${n} dimensions: every pair within ${D7_num(miss,3)}° of 90°`);
  const pl=D7_plot(60,62,500,170,[0,180],[0,hm*1.1],{xt:[0,30,60,90,120,150,180].map(v=>[v,v+'°']),xl:'angle between a pair',yt:[[0,'0'],[hm,D7_group(hm)]],yl:'how many pairs'});out+=pl.svg;
  st.h.forEach((c,i)=>{if(c)out+=R(pl.X(i*2)+.6,pl.Y(c),500/90-1.2,pl.Y(0)-pl.Y(c),C.blue,'none',1)});
  for(const a of [90-miss,90+miss])out+=L(pl.X(a),62,pl.X(a),232,C.coral,1.6,'stroke-dasharray="4 3"');
  out+=TF(pl.X(90+miss)+6,80,'worst pair',13,C.coral,'start');
  out+=D7_tile(40,282,160,'Pairs checked',D7_group(st.pairs))+D7_tile(220,282,160,'Worst miss of 90°',D7_num(miss,3)+'°',C.coral)+D7_tile(400,282,160,'Exactly perpendicular',`at most ${n}`,C.ink);
  out+=D7_note(m>n?`${m} directions is more than ${n}: they cannot all be exactly perpendicular, yet all are nearly so.`:`Up to ${n} directions could be made exactly perpendicular; random ones come close.`,350);
  return {svg:out,phase:`All ${D7_group(st.pairs)} pairs of ${m} random directions were checked. The furthest from a right angle is ${D7_num(miss,3)}° away.${n===1000?' Hundreds of directions, all nearly perpendicular to each other, is why random directions are useful for storing and sketching data.':n===10?' In ten dimensions there is little room: some pairs are far from perpendicular.':''}`};
 }});

// Random projection: 20 points in 1000 dimensions, projected to k dimensions by a seeded random Gaussian matrix ÷ √k.
const D7_JL={N:20,D:1000};
const D7_JLPTS=(()=>{let c=null;return ()=>{if(!c){const r=D7_rng(2024),cen=range(4).map(()=>Array.from({length:D7_JL.D},()=>D7_gauss(r)));c=range(D7_JL.N).map(i=>cen[i%4].map(v=>v+.6*D7_gauss(r)))}return c}})();
const D7_JLROWS=[];
function D7_jlRow(j){while(D7_JLROWS.length<=j){const r=D7_rng(5000+D7_JLROWS.length);D7_JLROWS.push(Float64Array.from({length:D7_JL.D},()=>D7_gauss(r)))}return D7_JLROWS[j]}
const D7_JLC={};
function D7_jl(k){if(!D7_JLC[k]){const pts=D7_JLPTS(),proj=pts.map(p=>range(k).map(j=>D7_dot(D7_jlRow(j),p)/Math.sqrt(k))),pairs=[];
  for(let a=0;a<pts.length;a++)for(let b=a+1;b<pts.length;b++){let d0=0;for(let i=0;i<D7_JL.D;i++){const t=pts[a][i]-pts[b][i];d0+=t*t}let d1=0;for(let j=0;j<k;j++){const t=proj[a][j]-proj[b][j];d1+=t*t}pairs.push([Math.sqrt(d0),Math.sqrt(d1)])}
  D7_JLC[k]=pairs}return D7_JLC[k]}
const D7_KS=[2,5,10,20,50,100,200,400];
SCENE({id:'nearly-perpendicular-projection',name:'Random projection keeps distances',tag:'Johnson and Lindenstrauss, 1984',
 definition:'Project points from many dimensions onto k random directions and rescale by 1/√k. Because random directions are nearly perpendicular, they behave almost like a set of axes, and every distance between the points changes by only a small factor. William Johnson and Joram Lindenstrauss proved in 1984 that k need only grow with the logarithm of the number of points, not with the original dimension.',
 get example(){const r=k=>D7_jl(k).map(p=>p[1]/p[0]),a=r(2),b=r(400);return `Twenty points in a thousand dimensions, in four loose clusters, are projected onto 2, 5, 10 … 400 random directions. With 2 directions the 190 distances change by factors from ${D7_num(Math.min(...a),2)} to ${D7_num(Math.max(...a),3)}; with 400, only from ${D7_num(Math.min(...b),3)} to ${D7_num(Math.max(...b),3)}.`},
 desc:'A scatter plot of each of the 190 distances between 20 points before and after a random projection to k dimensions, with the line of no change, and tiles for the smallest and largest ratio of new distance to old.',
 research:['Johnson & Lindenstrauss (1984). Extensions of Lipschitz mappings into a Hilbert space. Contemporary Mathematics 26, 189–206.','Dasgupta & Gupta (2003). An elementary proof of a theorem of Johnson and Lindenstrauss. Random Structures & Algorithms 22, 60–65.','Synthetic points and a seeded random matrix.'],
 dur:12,hint:'Change the number of random directions k and watch the points close in on the line where the distance is unchanged.',
 init:()=>({k:10}),
 watch:p=>({k:D7_KS[Math.min(7,Math.floor(p*8))]}),
 ui:[{choose:D7_KS.map(v=>[v,String(v)]),label:'Random directions k',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=D7_KS.includes(+v)?+v:10}},
 draw(s){
  const pairs=D7_jl(s.k),rat=pairs.map(p=>p[1]/p[0]),lo=Math.min(...rat),hi=Math.max(...rat),dmax=Math.max(...pairs.map(p=>Math.max(p[0],p[1])))*1.05;
  let out=heading(`k = ${s.k}: every distance kept within ×${D7_num(lo,3)} to ×${D7_num(hi,3)}`);
  const pl=D7_plot(80,58,280,280,[0,dmax],[0,dmax],{xt:[[0,'0'],[Math.round(dmax/2),String(Math.round(dmax/2))]],yt:[[0,'0'],[Math.round(dmax/2),String(Math.round(dmax/2))]],xl:'distance in 1000 dimensions',xlDy:32});
  out+=pl.svg+L(pl.X(0),pl.Y(0),pl.X(dmax),pl.Y(dmax),C.ink,1.4,'stroke-dasharray="5 4"')+TF(pl.X(0)+4,52,'distance after projecting to k',13,C.muted,'start');
  for(const p of pairs)out+=Ci(pl.X(p[0]),pl.Y(p[1]),3,C.blue,'none','opacity=".75"');
  out+=D7_tile(390,70,180,'Smallest ratio',D7_num(lo,3),C.coral)+D7_tile(390,126,180,'Largest ratio',D7_num(hi,3),C.coral)+D7_tile(390,182,180,'Distances checked',String(pairs.length),C.ink)+D7_tile(390,238,180,'Dimensions kept',`${s.k} of ${D7_JL.D}`,C.ink);
  out+=TF(480,312,'dashed line: no change',13,C.muted);
  return {svg:out,phase:`After projecting onto ${s.k} random direction${s.k===1?'':'s'}, the 190 distances change by factors from ${D7_num(lo,3)} to ${D7_num(hi,3)}. ${s.k<20?'Too few directions: the points scatter well away from the line.':'The two clumps are pairs in the same cluster and pairs in different clusters; both stay on the line.'}`};
 }});

/* ===================== Lesson: sphere-packing ===================== */
// Lattices: a basis (rows) for the cell volume, a set of candidate coordinates that contains every lattice vector of
// length up to the shortest, and a membership test. Shortest vectors are found by enumerating the candidates.
const D7_H=Math.sqrt(3)/2;
function D7_det(M){const A=M.map(r=>r.slice()),n=A.length;let d=1;for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(A[r][c])>Math.abs(A[p][c]))p=r;if(Math.abs(A[p][c])<1e-12)return 0;if(p!==c){[A[p],A[c]]=[A[c],A[p]];d=-d}d*=A[c][c];for(let r=c+1;r<n;r++){const f=A[r][c]/A[c][c];for(let k=c;k<n;k++)A[r][k]-=f*A[c][k]}}return Math.abs(d)}
const D7_isInt=v=>Math.abs(v-Math.round(v))<1e-9;
const D7_LAT={
 Z1:{n:1,name:'ℤ',basis:[[1]],cand:[-1,0,1],coef:false,member:x=>x.every(D7_isInt)},
 Z2:{n:2,name:'square',basis:[[1,0],[0,1]],cand:[-1,0,1],coef:false,member:x=>x.every(D7_isInt)},
 A2:{n:2,name:'hexagonal',basis:[[1,0],[.5,D7_H]],cand:[-2,-1,0,1,2],coef:true},
 Z3:{n:3,name:'cubic',basis:[[1,0,0],[0,1,0],[0,0,1]],cand:[-1,0,1],coef:false,member:x=>x.every(D7_isInt)},
 D3:{n:3,name:'cannonball (D₃)',basis:[[1,1,0],[1,0,1],[0,1,1]],cand:[-1,0,1],coef:false,member:x=>x.every(D7_isInt)&&Math.round(sum(x))%2===0},
 D4:{n:4,name:'D₄ (24-cell)',basis:[[1,1,0,0],[1,-1,0,0],[0,1,-1,0],[0,0,1,-1]],cand:[-1,0,1],coef:false,member:x=>x.every(D7_isInt)&&Math.round(sum(x))%2===0},
 E8:{n:8,name:'E₈',basis:[[.5,-.5,-.5,-.5,-.5,-.5,-.5,.5],[1,1,0,0,0,0,0,0],[-1,1,0,0,0,0,0,0],[0,-1,1,0,0,0,0,0],[0,0,-1,1,0,0,0,0],[0,0,0,-1,1,0,0,0],[0,0,0,0,-1,1,0,0],[0,0,0,0,0,-1,1,0]],cand:[-1,-.5,0,.5,1],coef:false,
  member:x=>(x.every(D7_isInt)||x.every(v=>D7_isInt(v-.5)))&&D7_isInt(sum(x)/2)}};
// Enumerate every candidate (coordinates, or basis coefficients when coef is set), keep the lattice vectors, and
// return the nonzero ones of least length. Cached.
const D7_SHORT={};
function D7_shortest(key){if(D7_SHORT[key])return D7_SHORT[key];const L=D7_LAT[key],n=L.n,c=L.cand,vs=[];let tried=0;
 const idx=new Array(n).fill(0),total=Math.pow(c.length,n);
 for(let t=0;t<total;t++){let q=t;for(let i=0;i<n;i++){idx[i]=c[q%c.length];q=Math.floor(q/c.length)}tried++;
  let x;if(L.coef){x=new Array(n).fill(0);for(let i=0;i<n;i++)for(let j=0;j<n;j++)x[j]+=idx[i]*L.basis[i][j]}else x=idx.slice();
  if(!L.coef&&!L.member(x))continue;const q2=sum(x.map(v=>v*v));if(q2>1e-9)vs.push({x,q:q2})}
 const m=Math.min(...vs.map(v=>v.q)),sh=vs.filter(v=>Math.abs(v.q-m)<1e-9).map(v=>v.x),det=D7_det(L.basis),rho=Math.sqrt(m)/2;
 return D7_SHORT[key]={vecs:sh,min:Math.sqrt(m),det,rho,density:D7_V(n)*Math.pow(rho,n)/det,tried};
}
// Darts: random points of one cell of the lattice; a dart is covered if it lies within ρ of a lattice point.
const D7_DARTS={};
function D7_darts(key,N){const L=D7_LAT[key],n=L.n,st=D7_shortest(key);let c=D7_DARTS[key];if(!c)c=D7_DARTS[key]={r:D7_rng(31+n*7+key.length),pts:[]};
 while(c.pts.length<N){const t=range(n).map(()=>c.r()),p=new Array(n).fill(0);for(let i=0;i<n;i++)for(let j=0;j<n;j++)p[j]+=t[i]*L.basis[i][j];
  let best=1e9;const off=[-1,0,1,2],tot=Math.pow(4,n);for(let k=0;k<tot;k++){let q=k,d=0;const lp=new Array(n).fill(0);for(let i=0;i<n;i++){const a=off[q%4];q=Math.floor(q/4);for(let j=0;j<n;j++)lp[j]+=a*L.basis[i][j]}for(let j=0;j<n;j++)d+=(p[j]-lp[j])**2;if(d<best)best=d}
  c.pts.push({p,inside:Math.sqrt(best)<st.rho})}
 return c.pts.slice(0,N)}
const D7_ARR={square:['Z2','Square layer'],hex:['A2','Hexagonal layer'],cubic:['Z3','Cubic stack'],fcc:['D3','Cannonball stack']};
// The 3D view: a square-based cannonball pyramid (layer k sits in the hollows of layer k − 1) or a cubic stack.
function D7_pile(kind){const out=[];if(kind==='fcc'){for(let k=0;k<4;k++)for(let i=0;i<4-k;i++)for(let j=0;j<4-k;j++)out.push([2*i+k,2*j+k,k*Math.SQRT2])}
 else for(let k=0;k<3;k++)for(let i=0;i<3;i++)for(let j=0;j<3;j++)out.push([2*i,2*j,2*k]);return out}
function D7_ballsSVG(cs,P,col){const o=P([0,0,0]),sc=Math.sqrt([[1,0,0],[0,1,0],[0,0,1]].reduce((a,e)=>{const q=P(e);return a+(q[0]-o[0])**2+(q[1]-o[1])**2},0)/2);
 return sortedItems(cs.map(c=>({at:c,svg:P2=>{const q=P2(c);return Ci(q[0],q[1],sc,tint(col,.15+.12*(c[2]||0)),'#fff')+Ci(q[0]-sc*.32,q[1]-sc*.32,sc*.28,'#fff','none','opacity=".55"')}})),P)}
SCENE({id:'sphere-packing',name:'Kepler’s cannonballs',tag:'Kepler’s conjecture, 1611; Hales, 1998',
 definition:'How large a share of space can equal balls fill without overlapping? In 1611 Johannes Kepler suggested that no arrangement beats the greengrocer’s pile of oranges or cannonballs, each layer sitting in the hollows of the one below, filling π/√18 of space. Gauss proved in 1831 that it is the best of the lattice packings, where the centres repeat regularly. For all packings the question stayed open until Thomas Hales’s computer-assisted proof, announced in 1998 and published in 2005; a formal check by computer, the Flyspeck project, was finished in 2014.',
 example:`The share filled is (volume of one ball) ÷ (volume of space per ball). For the square arrangement of coins it is π/4 ≈ ${D7_num(D7_shortest('Z2').density,4)}; for the hexagonal one ${D7_num(D7_shortest('A2').density,4)}. In space, a cubic stack fills ${D7_num(D7_shortest('Z3').density,4)} and the cannonball pile ${D7_num(D7_shortest('D3').density,4)}, which is π/√18.`,
 desc:'Left: a patch of the chosen arrangement of equal discs or two layers of balls seen from above. Right: the shortest distance between centres, the ball radius, the volume of space per ball and the share filled, all computed from the lattice, with a dart count that measures the share directly. A short timeline runs along the bottom.',
 research:['Kepler (1611). Strena seu de nive sexangula (The six-cornered snowflake).','Gauss (1831), review of Seeber’s book on ternary quadratic forms: the cannonball packing is the densest lattice packing in 3D.','Hales (2005). A proof of the Kepler conjecture. Annals of Mathematics 162, 1065–1185.','Hales et al. (2017). A formal proof of the Kepler conjecture. Forum of Mathematics, Pi 5, e2.'],
 dur:13,hint:'Choose an arrangement and throw darts into one cell of it: the share of darts that land inside a ball should match the computed share. Switch to 3D to see a pile.',
 init:()=>({arr:'hex',darts:0}),
 watch:p=>({arr:['square','hex','cubic','fcc'][Math.min(3,Math.floor(p*4))],darts:Math.min(2000,Math.floor((p*4%1)*2400))}),
 ui:[{choose:[['square','Square'],['hex','Hexagonal'],['cubic','Cubic'],['fcc','Cannonball']],label:'Arrangement',get:s=>s.arr,act:'arr'},{b:'Throw 500 darts',act:'darts'}],
 on:{arr(s,v){s.arr=D7_ARR[v]?v:'hex';s.darts=0},darts(s){s.darts=Math.min(5000,s.darts+500)}},
 draw(s){
  const [key,lab]=D7_ARR[s.arr],LT=D7_LAT[key],st=D7_shortest(key),three=LT.n===3;
  let out=heading(`${lab}: ${D7_pct(st.density,2)} of ${three?'space':'the plane'} is filled`);
  // left picture, 1 unit = u px
  const u=46,cx=150,cy=176;out+=`<clipPath id="d7pk"><rect x="24" y="52" width="252" height="250" rx="8"/></clipPath>`+R(24,52,252,250,'#fff',C.grid,8);
  let g='';
  if(!three){for(let i=-6;i<=6;i++)for(let j=-6;j<=6;j++){const x=i*LT.basis[0][0]+j*LT.basis[1][0],y=i*LT.basis[0][1]+j*LT.basis[1][1];g+=Ci(cx+x*u,cy-y*u,st.rho*u,C.pale,C.blue)}}
  else{// two layers seen from above; the cannonball layers are hexagonal, the second in the hollows of the first
   const a=Math.SQRT2,hexB=[[a,0],[a/2,a*D7_H]];
   if(key==='Z3'){for(let i=-4;i<=4;i++)for(let j=-4;j<=4;j++)g+=Ci(cx+i*u,cy-j*u,st.rho*u,C.pale,C.blue)+Ci(cx+i*u,cy-j*u,st.rho*u*.55,'none',C.coral,'stroke-dasharray="4 3"')}
   else{for(let i=-5;i<=5;i++)for(let j=-5;j<=5;j++){const x=i*hexB[0][0]+j*hexB[1][0],y=i*hexB[0][1]+j*hexB[1][1];g+=Ci(cx+x*u,cy-y*u,st.rho*u,C.pale,C.blue)}
    for(let i=-5;i<=5;i++)for(let j=-5;j<=5;j++){const x=i*hexB[0][0]+j*hexB[1][0]+a/2,y=i*hexB[0][1]+j*hexB[1][1]+a*D7_H/3;g+=Ci(cx+x*u,cy-y*u,st.rho*u,'none',C.coral,'stroke-dasharray="4 3"')}}}
  // darts (in the plane, shown in the cell at the centre)
  const ds=s.darts?D7_darts(key,s.darts):[];
  if(!three)for(const d of ds.slice(0,800))g+=Ci(cx+d.p[0]*u,cy-d.p[1]*u,1.7,d.inside?C.green:C.coral);
  out+=G(g,'clip-path="url(#d7pk)"');
  out+=TF(150,320,three?(key==='Z3'?'top view: layer 2 (dashed) right on top':'top view: layer 2 (dashed) in the hollows'):'one cell of darts at the centre',13,C.muted);
  const hit=ds.filter(d=>d.inside).length;
  out+=D7_tile(300,56,130,'Closest centres',D7_num(st.min,4),C.ink)+D7_tile(440,56,130,'Ball radius',D7_num(st.rho,4),C.ink);
  out+=D7_tile(300,110,130,three?'Space per ball':'Area per disc',D7_num(st.det,4),C.ink)+D7_tile(440,110,130,'Share filled',D7_num(st.density,4),C.blue);
  out+=D7_tile(300,164,270,'Darts inside a ball',s.darts?`${hit} of ${s.darts} = ${D7_num(hit/s.darts,3)}`:'none thrown yet',C.green);
  out+=TF(300,232,`share = ${three?'4π/3':'π'} × radius${three?'³':'²'} ÷ ${three?'space':'area'} per ball`,13,C.muted,'start');
  if(three)out+=TF(300,252,`π/√18 = ${D7_num(Math.PI/Math.sqrt(18),4)}`,13,C.muted,'start');
  // timeline (historical dates)
  const ev=[[1611,'Kepler'],[1831,'Gauss: lattices'],[1998,'Hales'],[2014,'Flyspeck']];out+=L(40,344,560,344,C.line,2);
  ev.forEach((e,i)=>{const x=80+i*150;out+=Ci(x,344,5,C.blue)+TBF(x,334,String(e[0]),13,C.ink)+TF(x,364,e[1],13,C.muted)});
  const ph=`${lab}: centres at least ${D7_num(st.min,4)} apart, so the ${three?'balls':'discs'} have radius ${D7_num(st.rho,4)}; each takes up ${D7_num(st.det,4)} of ${three?'space':'area'}, so the share filled is ${D7_num(st.density,4)}.${s.darts?` The darts give ${D7_num(hit/s.darts,3)}.`:''}`+(key==='D3'?' This is Kepler’s pile: each layer drops into the hollows of the last.':key==='A2'?' Thue (1890, 1910) and Fejes Tóth (1940) proved the hexagonal arrangement is best in the plane.':'');
  return {svg:out,phase:ph};
 },
 three(s,f,X,project){
  const kind=s.arr==='square'||s.arr==='cubic'?'cubic':'fcc',cs=D7_pile(kind),Pr=project(cs.map(c=>[c[0],c[1],c[2]]).concat([[-1,-1,-1],[7,7,5]]));
  return {svg:D7_ballsSVG(cs,Pr,kind==='fcc'?C.blue:C.green),title:kind==='fcc'?'A cannonball pile':'A cubic stack',
   caption:kind==='fcc'?`A square-based pile of ${cs.length} balls of radius 1: each layer sits in the hollows of the one below, ${D7_num(Math.SQRT2,4)} higher, the arrangement Kepler described. Inside such a pile every ball touches 12 others.`:`${cs.length} balls of radius 1 stacked straight up: each touches 6 others, and the stack fills only ${D7_num(D7_shortest('Z3').density,4)} of space.`};
 }});

// Kissing numbers: the shortest vectors of a lattice point to the balls that touch the ball at the origin.
const D7_KD={1:'Z1',2:'A2',3:'D3',4:'D4',8:'E8'};
const D7_KNOWN=[[1,'ℤ','2','obvious'],[2,'hexagonal','6','ancient'],[3,'cannonball','12','Schütte & van der Waerden 1953'],[4,'D₄','24','Musin 2003'],[8,'E₈','240','Odlyzko & Sloane; Levenshtein 1979'],[24,'Leech','196,560','the same, 1979']];
// The shapes of a set of vectors: sorted absolute coordinates, with how many vectors share each.
function D7_shapes(vs){const m={};for(const v of vs){const k=v.map(Math.abs).sort((a,b)=>b-a).map(a=>a===.5?'½':String(a)).join(',');m[k]=(m[k]||0)+1}return m}
// Regular icosahedron with centre distance 2 (12 balls round one in 3D, Gregory’s arrangement): computed gap between neighbours.
const D7_ICO=(()=>{const f=(1+Math.sqrt(5))/2,v=[];for(const a of [-1,1])for(const b of [-f,f]){v.push([0,a,b],[a,b,0],[b,0,a])}const sc=2/Math.hypot(1,f);const w=v.map(p=>p.map(c=>c*sc));let e=1e9;for(let i=0;i<12;i++)for(let j=i+1;j<12;j++)e=Math.min(e,Math.hypot(...w[i].map((c,k)=>c-w[j][k])));return {n:w.length,edge:e}})();
SCENE({id:'sphere-packing-kissing',name:'How many balls can touch one?',tag:'Kissing numbers: 2, 6, 12, 24 … 240 … 196,560',
 definition:'The kissing number in n dimensions is the most equal balls that can touch one ball of the same size without overlapping. In 1694 Isaac Newton and David Gregory disagreed over whether 13 balls could touch one in space; Newton said 12, which Schütte and van der Waerden proved in 1953. In any lattice, the touching balls sit at the shortest lattice vectors, so counting those gives a lower bound. The answer is known only in dimensions 1, 2, 3, 4, 8 and 24; in every other dimension it is open, with only lower and upper bounds.',
 get example(){return `Twelve balls fit round one in space with room to spare: placed at the corners of a regular icosahedron, neighbouring balls are ${D7_num(D7_ICO.edge,4)} apart centre to centre, not 2, so none touch each other. Yet the gaps never add up to room for a thirteenth. In eight dimensions the lattice E₈ has ${D7_shortest('E8').vecs.length} shortest vectors.`},
 desc:'For the chosen dimension, the lattice’s shortest vectors found by enumeration, drawn as touching discs in one and two dimensions, as a projected cluster in three, and as a table of their shapes in four and eight, beside a table of the known kissing numbers and who proved them.',
 research:['Schütte & van der Waerden (1953). Das Problem der dreizehn Kugeln. Mathematische Annalen 125, 325–334.','Musin (2008). The kissing number in four dimensions. Annals of Mathematics 168, 1–32 (preprint 2003).','Odlyzko & Sloane (1979). New bounds on the number of unit spheres that can touch a unit sphere in n dimensions. Journal of Combinatorial Theory A 26, 210–214.','Levenshtein (1979), Soviet Mathematics Doklady 20: the same values for dimensions 8 and 24.'],
 dur:12,hint:'Choose a dimension. The code tries every short candidate vector, keeps those in the lattice, and counts the shortest: compare with the proved kissing number.',
 init:()=>({dim:3}),
 watch:p=>({dim:[1,2,3,4,8][Math.min(4,Math.floor(p*5))]}),
 ui:[{choose:[[1,'1'],[2,'2'],[3,'3'],[4,'4'],[8,'8']],label:'Dimension',get:s=>s.dim,act:'dim'}],
 on:{dim(s,v){s.dim=D7_KD[+v]?+v:3}},
 draw(s){
  const key=D7_KD[s.dim],st=D7_shortest(key),vs=st.vecs,n=s.dim;
  let out=heading(`${D7_LAT[key].name}: ${vs.length} balls touch the one in the middle`);
  out+=R(20,50,260,262,'#fff',C.grid,8);
  const cx=150,cy=176;
  if(n<=2){const u=n===1?44:46,rr=st.rho*u;out+=Ci(cx,cy,rr,C.coralp,C.coral);for(const v of vs)out+=Ci(cx+v[0]*u,cy-(v[1]||0)*u,rr,C.pale,C.blue);}
  else if(n===3){// orthographic view of the 13 balls, turned a little so that none hide behind another
   const a=.5,b=.35,rot=v=>{const x=v[0]*Math.cos(a)-v[1]*Math.sin(a),y=v[0]*Math.sin(a)+v[1]*Math.cos(a);return [x,y*Math.cos(b)-v[2]*Math.sin(b),y*Math.sin(b)+v[2]*Math.cos(b)]};
   const u=44,rr=st.rho*u,items=vs.map(v=>({q:rot(v),c:false})).concat([{q:[0,0,0],c:true}]).sort((p,q)=>p.q[1]-q.q[1]);
   // the touching balls are drawn at 40% size so that every centre shows; a line joins each to the middle ball's centre
   for(const it of items){const x=cx+it.q[0]*u,y=cy-it.q[2]*u;out+=(it.c?'':L(cx,cy,x,y,C.line,1.4))+Ci(x,y,it.c?rr:rr*.4,it.c?C.coralp:tint(C.blue,.3+.3*(it.q[1]>0?1:0)),it.c?C.coral:C.blue,it.c?'opacity=".6"':'')}
   out+=TF(cx,288,'projection of the 12 centres round 1',13,C.muted)+TF(cx,304,'(touching balls drawn at 40% size)',13,C.muted);}
  else{const sh=D7_shapes(vs);out+=TBF(36,78,'shortest vectors, by shape',13,C.ink,'start');let y=104;
   for(const k in sh){out+=TMF(36,y,'±('+k+')',13,C.ink,'start')+TBF(264,y,String(sh[k]),13,C.blue,'end');y+=22}
   out+=L(36,y-12,264,y-12,C.line,1)+TBF(264,y+6,'total '+vs.length,13,C.blue,'end');
   out+=TF(36,y+34,`searched ${D7_group(st.tried)} candidates`,13,C.muted,'start');
   if(n===4)out+=TF(36,y+54,'they are the 24-cell’s corners',13,C.muted,'start');
   else out+=TF(36,y+54,'(½ means ±½ in every place)',13,C.muted,'start');}
  // table of known values (historical facts) with the count made here
  out+=R(290,50,290,262,'#fff',C.grid,8)+TBF(302,72,'n',13,C.muted,'start')+TBF(330,72,'best known',13,C.muted,'start')+TBF(568,72,'proved by',13,C.muted,'end');
  D7_KNOWN.forEach((r,i)=>{const y=98+i*30,on=r[0]===n;if(on)out+=R(294,y-17,282,26,C.amberp,'none',4);
   out+=TBF(302,y,String(r[0]),13,C.ink,'start')+TBF(330,y,r[2],13,C.blue,'start')+TF(568,y,r[3].length>22?r[3].replace('Odlyzko & Sloane; Levenshtein','O. & S.; Levenshtein'):r[3],13,C.muted,'end')});
  out+=TF(302,288,'all other n: open',13,C.coral,'start');
  out+=D7_tile(40,322,250,'Counted here',`${vs.length} shortest vectors`,C.blue)+D7_tile(310,322,250,'Lattice share filled',D7_num(st.density,4),C.ink);
  const ph=n===3?`Counting the cannonball lattice’s shortest vectors gives ${vs.length}, the 12 that Newton claimed. With the 12 at an icosahedron’s corners they do not even touch one another (${D7_num(D7_ICO.edge,4)} apart), which is why Gregory thought a thirteenth might fit.`:
   n===4?`${vs.length} shortest vectors, all of the form (±1, ±1, 0, 0) in some order. Oleg Musin proved in 2003 that 25 balls cannot touch one in four dimensions.`:
   n===8?`${vs.length} shortest vectors: ${D7_shapes(vs)['1,1,0,0,0,0,0,0']} with two entries ±1 and ${D7_shapes(vs)['½,½,½,½,½,½,½,½']} with every entry ±½ (an even number of minus signs). In 1979 it was proved that no arrangement in eight dimensions beats 240.`:
   `In ${n} dimension${n===1?'':'s'}, ${vs.length} equal ${n===1?'segments':'discs'} touch the middle one.`;
  return {svg:out,phase:ph};
 }});

// E₈ in its Coxeter plane, and the Leech lattice counted from the Golay code.
// Coxeter element: the product of the reflections in E₈'s eight simple roots (the basis rows above).
function D7_reflect(a){const n=a.length,q=D7_dot(a,a);return range(n).map(i=>range(n).map(j=>(i===j?1:0)-2*a[i]*a[j]/q))}
const D7_mul=(A,B)=>A.map(r=>B[0].map((_,j)=>r.reduce((s,v,k)=>s+v*B[k][j],0)));
// Symmetric eigenvectors by Jacobi rotations.
function D7_jacobi(S){const n=S.length,A=S.map(r=>r.slice()),V=range(n).map(i=>range(n).map(j=>i===j?1:0));
 for(let sweep=0;sweep<60;sweep++){let off=0;for(let p=0;p<n;p++)for(let q=p+1;q<n;q++)off+=A[p][q]*A[p][q];if(off<1e-24)break;
  for(let p=0;p<n;p++)for(let q=p+1;q<n;q++){if(Math.abs(A[p][q])<1e-15)continue;const th=(A[q][q]-A[p][p])/(2*A[p][q]),t=Math.sign(th||1)/(Math.abs(th)+Math.sqrt(th*th+1)),c=1/Math.sqrt(t*t+1),sn=t*c;
   for(let k=0;k<n;k++){const akp=A[k][p],akq=A[k][q];A[k][p]=c*akp-sn*akq;A[k][q]=sn*akp+c*akq}
   for(let k=0;k<n;k++){const apk=A[p][k],aqk=A[q][k];A[p][k]=c*apk-sn*aqk;A[q][k]=sn*apk+c*aqk}
   for(let k=0;k<n;k++){const vkp=V[k][p],vkq=V[k][q];V[k][p]=c*vkp-sn*vkq;V[k][q]=sn*vkp+c*vkq}}}
 return {vals:range(n).map(i=>A[i][i]),vecs:range(n).map(j=>range(n).map(i=>V[i][j]))}}
const D7_E8=(()=>{let c=null;return ()=>{if(c)return c;
 const W=D7_LAT.E8.basis.map(D7_reflect).reduce((A,B)=>D7_mul(A,B));
 let order=0,M=W;for(let k=1;k<=200;k++){if(M.every((r,i)=>r.every((v,j)=>Math.abs(v-(i===j?1:0))<1e-9))){order=k;break}M=D7_mul(M,W)}
 const S=W.map((r,i)=>r.map((v,j)=>v+W[j][i])),eig=D7_jacobi(S),tgt=2*Math.cos(2*Math.PI/order);
 const ix=range(8).sort((a,b)=>Math.abs(eig.vals[a]-tgt)-Math.abs(eig.vals[b]-tgt)).slice(0,2),plane=ix.map(i=>eig.vecs[i]);
 const roots=D7_shortest('E8').vecs,rad=roots.map(v=>Math.hypot(D7_dot(v,plane[0]),D7_dot(v,plane[1])));
 const rings=[];rad.forEach((r,i)=>{let g=rings.find(x=>Math.abs(x.r-r)<1e-6);if(!g){g={r,ids:[]};rings.push(g)}g.ids.push(i)});rings.sort((a,b)=>a.r-b.r);
 const ringOf=new Array(roots.length);rings.forEach((g,k)=>g.ids.forEach(i=>ringOf[i]=k));
 return c={order,plane,roots,rings,ringOf}}})();
// The extended binary Golay code: the span of the 23 cyclic shifts of the quadratic residues mod 23, plus a parity bit.
const D7_GOLAY=(()=>{let c=null;return ()=>{if(c)return c;const Q=new Set(range(22).map(i=>(i+1)*(i+1)%23)),rows=[];
 for(let s=0;s<23;s++){let m=0;for(let i=0;i<23;i++)if(Q.has((i-s+23)%23))m|=1<<i;rows.push(m)}
 const basis=[];for(let r of rows){for(const b of basis)r=Math.min(r,r^b);if(r){basis.push(r);basis.sort((a,b)=>b-a)}}
 const pc=x=>{let k=0;while(x){x&=x-1;k++}return k},words=[];
 for(let m=0;m<1<<basis.length;m++){let x=0;for(let j=0;j<basis.length;j++)if(m>>j&1)x^=basis[j];if(pc(x)%2)x|=1<<23;words.push(x)}
 const wt={};for(const w of words){const k=pc(w);wt[k]=(wt[k]||0)+1}
 return c={dim:basis.length,words,set:new Set(words),wt,pc}}})();
// Leech lattice vectors, scaled by √8: integer x with all xᵢ ≡ m (mod 2), Σxᵢ ≡ 4m (mod 8), and for each residue k the
// places where xᵢ ≡ k (mod 4) form a Golay codeword. Every candidate of the three shortest shapes is built and tested.
function D7_inLeech(x){const g=D7_GOLAY(),m=((x[0]%2)+2)%2;if(x.some(v=>((v%2)+2)%2!==m))return false;if(((sum(x)-4*m)%8+8)%8!==0)return false;
 for(let k=0;k<4;k++){let w=0;x.forEach((v,i)=>{if(((v%4)+4)%4===k)w|=1<<i});if(w&&!g.set.has(w))return false}return true}
const D7_LEECH=(()=>{let c=null;return ()=>{if(c)return c;const g=D7_GOLAY(),oct=g.words.filter(w=>g.pc(w)===8);let A=0,B=0,Cn=0,tested=0;
 for(const w of oct){const pos=range(24).filter(i=>w>>i&1);for(let sg=0;sg<256;sg++){const x=new Array(24).fill(0);pos.forEach((p,j)=>x[p]=sg>>j&1?-2:2);tested++;if(D7_inLeech(x))A++}}
 for(const w of g.words)for(let p=0;p<24;p++){const x=range(24).map(i=>w>>i&1?-1:1);x[p]=w>>p&1?3:-3;tested++;if(D7_inLeech(x))B++}
 for(let i=0;i<24;i++)for(let j=i+1;j<24;j++)for(const a of [-4,4])for(const b of [-4,4]){const x=new Array(24).fill(0);x[i]=a;x[j]=b;tested++;if(D7_inLeech(x))Cn++}
 return c={octads:oct.length,A,B,C:Cn,total:A+B+Cn,tested}}})();
SCENE({id:'sphere-packing-e8',name:'Viazovska’s eight and twenty-four',tag:'E₈ and the Leech lattice, proved densest in 2016',
 definition:'In 2016 Maryna Viazovska proved that the E₈ lattice gives the densest packing of equal balls in eight dimensions, using a specially built function whose properties rule out anything denser. Within a week, with Henry Cohn, Abhinav Kumar, Stephen D. Miller and Danylo Radchenko, she extended the method to the Leech lattice in twenty-four dimensions. She received a Fields Medal in 2022. In every other dimension above three the densest packing is unknown.',
 get example(){return `E₈’s balls fill π⁴/384 ≈ ${D7_num(D7_shortest('E8').density,4)} of eight-dimensional space; the Leech lattice’s fill π¹²/12! ≈ ${D7_num(D7_V(24),3)} of twenty-four-dimensional space. Both are small numbers because balls fill little of any high-dimensional space, yet nothing does better. John Leech described his lattice in the 1960s; its construction starts from the Golay code, a 1949 error-correcting code.`},
 desc:'Either the 240 shortest vectors of E₈ projected onto a plane that the learner turns towards the Coxeter plane, where they fall into rings of 30, or a breakdown of the Leech lattice’s 196,560 shortest vectors into three shapes, counted from the generated Golay code.',
 research:['Viazovska (2017). The sphere packing problem in dimension 8. Annals of Mathematics 185, 991–1015 (preprint 2016).','Cohn, Kumar, Miller, Radchenko & Viazovska (2017). The sphere packing problem in dimension 24. Annals of Mathematics 185, 1017–1033.','Cohn & Elkies (2003). New upper bounds on sphere packings I. Annals of Mathematics 157, 689–714.','Conway & Sloane (1988). Sphere Packings, Lattices and Groups. Springer (the Leech lattice from the Golay code).','Golay (1949). Notes on digital coding. Proceedings of the IRE 37, 657.'],
 dur:13,hint:'Turn the view slowly from a coordinate plane to the Coxeter plane and watch the 240 points fall into rings, or switch to the Leech lattice to see its shortest vectors counted.',
 init:()=>({t:0,view:'e8'}),
 watch:p=>p<.72?{t:+smooth(p/.6).toFixed(3),view:'e8'}:{t:1,view:'leech'},
 ui:[{choose:[['e8','E₈ roots'],['leech','Leech lattice']],label:'Show',get:s=>s.view,act:'view'},{range:'t',label:'Turn the view',min:0,max:1,step:.05,get:s=>s.t,act:'t'}],
 on:{view(s,v){s.view=v==='leech'?'leech':'e8'},t(s,v){s.t=clamp(+v,0,1);s.view='e8'}},
 draw(s){
  if(s.view==='leech'){const lc=D7_LEECH(),g=D7_GOLAY();
   let out=heading(`Leech lattice: ${D7_bigStr(BigInt(lc.total))} shortest vectors`);
   const rows=[[`(±2⁸, 0¹⁶) on the ${lc.octads} octads`,lc.A,`${lc.octads} × 2⁷`],['(∓3, ±1²³)',lc.B,`24 × ${D7_group(g.words.length)}`],['(±4, ±4, 0²²)',lc.C,`C(24,2) × 2²`]],mx=Math.max(lc.A,lc.B,lc.C);
   rows.forEach((r,i)=>{const y=86+i*62;out+=TF(40,y,r[0]+':  '+r[2],13,C.ink,'start')+R(40,y+8,420*r[1]/mx,22,C.blue,'none',3)+TBF(560,y+24,D7_group(r[1]),14,C.blue,'end')});
   out+=L(40,274,560,274,C.line,1.4)+TBF(560,294,`total ${D7_group(lc.total)}`,15,C.coral,'end')+TF(40,294,`(coordinates × √8; ${D7_group(lc.tested)} candidates tested)`,13,C.muted,'start');
   out+=D7_tile(40,312,160,'Golay codewords',D7_group(g.words.length),C.ink)+D7_tile(220,312,160,'Weight-8 words',D7_group(g.wt[8]),C.ink)+D7_tile(400,312,160,'Share filled',D7_num(D7_V(24),3),C.ink);
   return {svg:out,phase:`The Golay code built here has ${D7_group(g.words.length)} codewords, ${g.wt[8]} of them with eight 1s (the octads). Testing every candidate of the three shortest shapes against the lattice’s rules leaves ${D7_group(lc.A)} + ${D7_group(lc.B)} + ${D7_group(lc.C)} = ${D7_group(lc.total)} vectors: the kissing number in 24 dimensions.`}}
  const e=D7_E8(),t=s.t,e1=[1,0,0,0,0,0,0,0],e2=[0,1,0,0,0,0,0,0];
  let a=e1.map((v,i)=>lerp(v,e.plane[0][i],t)),b=e2.map((v,i)=>lerp(v,e.plane[1][i],t));
  const la=D7_len(a);a=a.map(v=>v/la);const ab=D7_dot(a,b);b=b.map((v,i)=>v-ab*a[i]);const lb=D7_len(b);b=b.map(v=>v/lb);
  let out=heading(t>=.999?`E₈’s 240 shortest vectors fall into ${e.rings.length} rings of ${e.rings[0].ids.length}`:'E₈’s 240 shortest vectors, projected');
  const pr=e.roots.map(v=>[D7_dot(v,a),D7_dot(v,b)]),cx=190,cy=200,u=140/Math.max(...pr.map(q=>Math.hypot(q[0],q[1]))),cols=[C.blue,C.coral,C.green,C.purple,C.amber,C.dark,'#2b8fc7','#b2447a'];
  out+=Ci(cx,cy,150,'#fff',C.grid);
  pr.forEach(([x,y],i)=>{out+=Ci(cx+x*u,cy-y*u,3,cols[e.ringOf[i]%8])});
  out+=TF(cx,368,t<.05?'view: the first two coordinates':t>=.999?'view: the Coxeter plane (30-fold symmetry)':'view turning towards the Coxeter plane',13,C.muted);
  out+=D7_tile(370,60,200,'Shortest vectors',String(e.roots.length),C.blue)+D7_tile(370,114,200,'Coxeter number',String(e.order),C.ink)+D7_tile(370,168,200,'Rings in the plane',`${e.rings.length} × ${e.rings[0].ids.length}`,C.ink)+D7_tile(370,222,200,'Share filled, π⁴/384',D7_num(D7_shortest('E8').density,4),C.ink);
  out+=TF(470,292,'colours mark the rings',13,C.muted)+TF(470,310,'(computed at the end view)',13,C.muted);
  return {svg:out,phase:t<.05?'Seen along two coordinate axes, the 240 vectors pile onto a few spots. Turn the view.':t<.999?'The projection plane is turning; the eight colours are the rings the points will join.':
   `In the Coxeter plane, found as an eigenplane of the product of E₈’s eight reflections (whose order is ${e.order}), the 240 vectors fall into ${e.rings.length} rings of ${e.rings[0].ids.length}. This is a picture of E₈’s symmetry, not of eight-dimensional space itself.`};
 }});

/* ===================== Lesson: curse-dimensionality ===================== */
// Time to evaluate a count of grid points at a billion a second, in words.
function D7_time(big){const s=Number(big)/1e9,yr=s/(365.25*24*3600);
 if(s<1)return 'under a second';if(s<120){const v=D7_num(s,2);return v+(v==='1'?' second':' seconds')}if(s<7200)return D7_num(s/60,2)+' minutes';if(s<172800)return D7_num(s/3600,2)+' hours';if(yr<2)return D7_num(s/86400,2)+' days';
 return (yr<1e7?D7_num(yr,2):D7_sci(Math.log10(yr),2))+' years'}
const D7_bigShort=b=>{const t=b.toString();return t.length<=15?D7_group(t):`${t[0]}.${t.slice(1,3)} × 10${D7_sup(t.length-1)}`};
const D7_KAX=[2,5,10,100];
const D7_AGE=13.8e9;   // age of the universe in years (Planck Collaboration 2020): a measured fact, not computed
SCENE({id:'curse-dimensionality',name:'Covering a space with samples',tag:'Bellman’s “curse of dimensionality”, 1957',
 definition:`To learn how something depends on one number, try it at, say, 10 settings. For two numbers on a grid that is 10 × 10 = ${10*10} trials, for three ${10**3}, and for n numbers 10ⁿ. Richard Bellman, working on problems of decisions taken in many stages, called this exponential growth “the curse of dimensionality” in his book Dynamic Programming (1957). It limits any method that has to explore a space evenly: grids, tables, and searches over every combination.`,
 example:`At 10 settings per axis and a billion trials a second, 9 dimensions take ${D7_time(10n**9n)}, 12 take ${D7_time(10n**12n)}, and 20 take ${D7_time(10n**20n)}. Thirty dimensions would take ${D7_time(10n**30n)}, about ${D7_group(Math.round(1e21/(365.25*24*3600)/D7_AGE/100)*100)} times the age of the universe.`,
 desc:'A drawing of the grid of samples for one, two or three axes, a bar chart of the number of digits in the sample count for 1 to 30 dimensions, and tiles giving the exact count and the time it would take at a billion samples a second.',
 research:['Bellman (1957). Dynamic Programming. Princeton University Press (preface: “the curse of dimensionality”).','Planck Collaboration (2020). Planck 2018 results VI: cosmological parameters. Astronomy & Astrophysics 641, A6 (age of the universe about 13.8 billion years).'],
 dur:11,hint:'Set the number of samples per axis and the dimension. The count is computed exactly (as a big integer), however large it gets.',
 init:()=>({n:3,k:10}),
 watch:p=>({n:clamp(1+Math.floor(p*30),1,30),k:10}),
 ui:[{choose:D7_KAX.map(v=>[v,String(v)]),label:'Samples per axis',get:s=>s.k,act:'k'},{range:'n',label:'Dimension n',min:1,max:30,get:s=>s.n,act:'n'}],
 on:{k(s,v){s.k=D7_KAX.includes(+v)?+v:10},n(s,v){s.n=clamp(Math.round(+v),1,30)}},
 draw(s){
  const {n,k}=s,cnt=BigInt(k)**BigInt(n),sh=Math.min(k,n>=3?6:10);
  let out=heading(`${k} per axis in ${n} dimension${n===1?'':'s'}: ${D7_bigShort(cnt)} samples`);
  out+=R(20,50,250,250,'#fff',C.grid,8);
  const g=(i,m)=>m===1?.5:i/(m-1);
  if(n===1)for(let i=0;i<sh;i++)out+=Ci(44+g(i,sh)*200,175,4.5,C.blue);
  else if(n===2){for(let i=0;i<sh;i++)for(let j=0;j<sh;j++)out+=Ci(50+g(i,sh)*190,280-g(j,sh)*190,3.5,C.blue)}
  else{const o=[50,272],ax=[140,0],ay=[62,-50],az=[0,-150];for(let c=0;c<sh;c++)for(let b=sh-1;b>=0;b--)for(let a=0;a<sh;a++){const x=o[0]+g(a,sh)*ax[0]+g(b,sh)*ay[0]+g(c,sh)*az[0],y=o[1]+g(a,sh)*ax[1]+g(b,sh)*ay[1]+g(c,sh)*az[1];out+=Ci(x,y,2.6,tint(C.blue,.5*g(b,sh)))}}
  out+=TF(145,294,n<=3?(sh<k?`showing ${sh} of ${k} per axis`:'every sample shown'):`3 of the ${n} axes, ${sh} of ${k} per axis`,13,C.muted);
  // bar chart: digits of kⁿ for n = 1…20
  const digits=m=>(BigInt(k)**BigInt(m)).toString().length,dm=digits(30);
  const pl=D7_plot(320,64,250,170,[.5,30.5],[0,dm],{xt:[1,10,20,30].map(v=>[v,String(v)]),xl:'dimension n',yt:[[0,'0'],[dm,String(dm)]],yl:'digits in the count'});out+=pl.svg;
  for(let m=1;m<=30;m++){const d=digits(m);out+=R(pl.X(m)-3,pl.Y(d),6,pl.Y(0)-pl.Y(d),m===n?C.coral:C.blue,'none',2)}
  out+=D7_tile(20,314,250,'Samples needed, kⁿ',D7_bigShort(cnt),C.coral)+D7_tile(290,314,280,'At a billion a second',D7_time(cnt),C.ink);
  return {svg:out,phase:`${k}^${n} = ${D7_bigShort(cnt)} sample points${cnt.toString().length>15?` (a number with ${cnt.toString().length} digits)`:''}. Each extra dimension multiplies the count by ${k}, so the bars of digits climb in a straight line: exponential growth. At a billion samples a second this takes ${D7_time(cnt)}.`};
 }});

// Nearest against farthest: 200 random points in the unit cube [0, 1]ⁿ and random query points.
const D7_NNC={};
function D7_nn(n){if(!D7_NNC[n]){const r=D7_rng(600+n),pts=range(230).map(()=>Float64Array.from({length:n},()=>r()));const qs=[];
  for(let q=200;q<230;q++){const d=range(200).map(i=>{let s=0;for(let j=0;j<n;j++){const t=pts[i][j]-pts[q][j];s+=t*t}return Math.sqrt(s)});qs.push({d,min:Math.min(...d),max:Math.max(...d)})}
  D7_NNC[n]={qs,mean:D7_mean(qs.map(q=>q.min/q.max))}}return D7_NNC[n]}
const D7_NNN=[1,2,3,5,10,20,50,100,200,500,1000],D7_NNPICK=[1,2,3,10,100,1000];
SCENE({id:'curse-dimensionality-neighbours',name:'Nearest is nearly as far as farthest',tag:'Beyer, Goldstein, Ramakrishnan & Shaft, 1999',
 definition:'Many methods answer a question about a new point by looking at its nearest neighbours among known points. Kevin Beyer and colleagues showed in 1999 that, for many ways of spreading points at random, the distance to the nearest point and the distance to the farthest become almost equal as the dimension grows. Then “nearest” carries little information. It follows from concentration: every distance is a sum of many independent pieces, so all distances come out nearly the same.',
 get example(){return `For 200 random points in a square, a query point’s nearest neighbour is on average ${D7_pct(D7_nn(2).mean,0)} as far away as its farthest. In a thousand dimensions the nearest is on average ${D7_pct(D7_nn(1000).mean,0)} as far as the farthest.`},
 desc:'A strip showing the distance from a query point to each of 200 random points, as a share of the farthest distance, with the nearest marked, beside a curve of the average nearest-to-farthest ratio for 1 to 1000 dimensions.',
 research:['Beyer, Goldstein, Ramakrishnan & Shaft (1999). When is “nearest neighbor” meaningful? In Database Theory — ICDT’99, Lecture Notes in Computer Science 1540, 217–235.','Seeded random points in the unit cube; 30 query points per dimension.'],
 dur:12,hint:'Choose a dimension and step through query points. Watch the nearest tick move towards the farthest.',
 init:()=>({n:2,q:0}),
 watch:p=>({n:D7_NNPICK[Math.min(5,Math.floor(p*6))],q:Math.floor(p*30)%30}),
 ui:[{choose:D7_NNPICK.map(v=>[v,String(v)]),label:'Dimension n',get:s=>s.n,act:'n'},{b:'Next query point',act:'next'}],
 on:{n(s,v){s.n=D7_NNPICK.includes(+v)?+v:2},next(s){s.q=(s.q+1)%30}},
 draw(s){
  const c=D7_nn(s.n),q=c.qs[s.q],ratio=q.min/q.max;
  let out=heading(`n = ${s.n}: nearest ÷ farthest = ${D7_num(ratio,3)}`);
  const x0=50,w=500,yb=110;out+=R(x0-10,60,w+20,86,'#fff',C.grid,8)+L(x0,yb,x0+w,yb,C.line,1.4);
  for(const d of q.d)out+=L(x0+w*d/q.max,yb-14,x0+w*d/q.max,yb+14,C.blue,1.4,'opacity=".55"');
  out+=L(x0+w*ratio,yb-24,x0+w*ratio,yb+24,C.coral,3)+TBF(x0+w*ratio,yb-30,'nearest',13,C.coral,ratio>.85?'end':'middle')+TBF(x0+w,yb+40,'farthest',13,C.ink,'end');
  out+=TF(x0,yb+40,'0',13,C.muted,'start')+TF(x0+w/2,yb+40,'distance ÷ farthest',13,C.muted);
  // curve of the mean ratio against n (log axis)
  const lx=v=>Math.log10(v),pl=D7_plot(80,184,330,130,[0,3],[0,1],{xt:[[0,'1'],[1,'10'],[2,'100'],[3,'1000']],xl:'dimension n',yt:[[0,'0'],[.5,'0.5'],[1,'1']],yl:'average nearest ÷ farthest'});out+=pl.svg;
  const pts=D7_NNN.map(n=>[pl.X(lx(n)),pl.Y(D7_nn(n).mean)]);out+=D7_poly(pts,C.blue,2.2);for(const p of pts)out+=Ci(p[0],p[1],3,C.blue);
  out+=Ci(pl.X(lx(s.n)),pl.Y(c.mean),6,C.coral,'#fff');
  out+=D7_tile(436,190,136,'Nearest',D7_num(q.min,3),C.coral)+D7_tile(436,244,136,'Farthest',D7_num(q.max,3),C.ink)+D7_tile(436,298,136,'Average ratio',D7_num(c.mean,3),C.blue);
  return {svg:out,phase:`Query point ${s.q+1} of 30: its nearest neighbour is ${D7_num(q.min,3)} away and its farthest ${D7_num(q.max,3)}, a ratio of ${D7_num(ratio,3)}. Averaged over 30 query points the ratio is ${D7_num(c.mean,3)} in ${s.n} dimension${s.n===1?'':'s'}.${s.n>=100?' When every point is about equally far, the nearest one is hardly more similar than any other.':''}`};
 }});

// Data near a low-dimensional set: 400 points on a circle, on a square sheet, or filling a cube, all placed in 100
// dimensions by a seeded random orthonormal map. The correlation dimension is the slope of log C(r) against log r,
// where C(r) is the share of pairs closer than r (Grassberger & Procaccia).
const D7_LD={D:100,N:400};
const D7_LDC={};
function D7_low(kind){if(D7_LDC[kind])return D7_LDC[kind];const r=D7_rng(kind.length*911+3),D=D7_LD.D,N=D7_LD.N,d=kind==='curve'?2:kind==='sheet'?2:D;
 // orthonormal columns by Gram–Schmidt
 const cols=[];for(let j=0;j<Math.min(d,D);j++){let v=Float64Array.from({length:D},()=>D7_gauss(r));for(const c of cols){const t=D7_dot(v,c);v=v.map((x,i)=>x-t*c[i])}const l=D7_len(v);cols.push(v.map(x=>x/l))}
 const raw=range(N).map(()=>kind==='curve'?(a=>[Math.cos(a),Math.sin(a)])(2*Math.PI*r()):kind==='sheet'?[2*r()-1,2*r()-1]:Array.from({length:D},()=>(2*r()-1)*Math.sqrt(2/D)*1.2));
 const pts=raw.map(u=>{if(kind==='full')return Float64Array.from(u);const x=new Float64Array(D);u.forEach((c,j)=>{for(let i=0;i<D;i++)x[i]+=c*cols[j][i]});return x});
 const dist=[];for(let a=0;a<N;a++)for(let b=a+1;b<N;b++){let s=0;for(let i=0;i<D;i++){const t=pts[a][i]-pts[b][i];s+=t*t}dist.push(Math.sqrt(s))}
 const sd=dist.slice().sort((x,y)=>x-y),q=f=>sd[Math.floor(f*(sd.length-1))];
 // C(r) at 12 radii spread (in log) between the 0.5% and 10% quantiles of the pair distances; least-squares slope.
 const r0=q(.005),r1=q(.1),rs=range(12).map(i=>r0*Math.pow(r1/r0,i/11)),Cs=rs.map(rr=>{let lo=0,hi=sd.length;while(lo<hi){const m=(lo+hi)>>1;if(sd[m]<rr)lo=m+1;else hi=m}return lo/sd.length});
 const X=rs.map(Math.log10),Y=Cs.map(c=>Math.log10(Math.max(c,1e-9))),mx=D7_mean(X),my=D7_mean(Y);let sxy=0,sxx=0;X.forEach((x,i)=>{sxy+=(x-mx)*(Y[i]-my);sxx+=(x-mx)**2});
 // nearest ÷ farthest, averaged over every point as the query
 const M=range(N).map(()=>[1e9,0]);let t=0;for(let a=0;a<N;a++)for(let b=a+1;b<N;b++){const v=dist[t++];for(const i of [a,b]){if(v<M[i][0])M[i][0]=v;if(v>M[i][1])M[i][1]=v}}
 return D7_LDC[kind]={pts,cols,raw,slope:sxy/sxx,rs,Cs,ratio:D7_mean(M.map(m=>m[0]/m[1]))}}
const D7_LDK={curve:'a circle',sheet:'a flat square',full:'a 100-dimensional cube'};
SCENE({id:'curse-dimensionality-lowdim',name:'Real data is rarely spread everywhere',tag:'Points near a low-dimensional set',
 definition:'The curse is worst for points spread evenly through every direction. Measurements of real things usually are not: the readings depend on a few underlying causes, so the points lie near a curve or surface of much lower dimension inside the big space. Then nearest neighbours stay meaningful and fewer samples suffice. One way to estimate that lower dimension is to count pairs closer than r: on a d-dimensional set the count grows like rᵈ (Grassberger and Procaccia, 1983).',
 example:'Four hundred points on a circle, placed in a 100-dimensional space by a random rotation, still have a correlation dimension close to 1. The same number of points filling a 100-dimensional cube give an estimate far above any small number: at this sample size the method can only say “high”.',
 desc:'Left: the points seen in the plane of the first two directions used to place them in 100 dimensions. Right: a log–log plot of the share of pairs closer than r, with the fitted slope that estimates the dimension, and tiles for the slope and the nearest-to-farthest ratio.',
 research:['Grassberger & Procaccia (1983). Measuring the strangeness of strange attractors. Physica D 9, 189–208.','Tenenbaum, de Silva & Langford (2000). A global geometric framework for nonlinear dimensionality reduction. Science 290, 2319–2323.','Synthetic points from a seed; no real data.'],
 dur:12,hint:'Switch between points on a circle, on a sheet and filling the whole space. Compare the fitted slope with the true dimension, and the nearest-to-farthest ratio.',
 init:()=>({kind:'curve'}),
 watch:p=>({kind:['curve','sheet','full'][Math.min(2,Math.floor(p*3))]}),
 ui:[{choose:[['curve','On a circle'],['sheet','On a square'],['full','Filling 100 dimensions']],label:'Points',get:s=>s.kind,act:'kind'}],
 on:{kind(s,v){s.kind=D7_LDK[v]?v:'curve'}},
 draw(s){
  const c=D7_low(s.kind),true_=s.kind==='curve'?1:s.kind==='sheet'?2:D7_LD.D;
  let out=heading(`Points on ${D7_LDK[s.kind]}: slope ≈ ${c.slope.toFixed(2)}`);
  out+=R(20,50,240,240,'#fff',C.grid,8);
  const pr=c.pts.map(x=>[D7_dot(x,c.cols[0]),D7_dot(x,c.cols[1])]),m=Math.max(...pr.map(p=>Math.max(Math.abs(p[0]),Math.abs(p[1]))),1e-9);
  for(const p of pr)out+=Ci(140+p[0]/m*100,170-p[1]/m*100,2,C.blue);
  out+=TF(140,306,'seen in a plane of the 100 dimensions',13,C.muted);
  const lx=c.rs.map(Math.log10),ly=c.Cs.map(v=>Math.log10(Math.max(v,1e-6))),xr=[Math.min(...lx)-.05,Math.max(...lx)+.05],yr=[Math.min(...ly)-.2,Math.max(...ly)+.2];
  const pl=D7_plot(320,64,250,170,xr,yr,{xt:[[xr[0]+.05,'small r'],[xr[1]-.05,'larger r']],yt:[[yr[0]+.2,'few pairs'],[yr[1]-.2,'more']],yl:'log share of pairs closer than r'});out+=pl.svg;
  for(let i=0;i<lx.length;i++)out+=Ci(pl.X(lx[i]),pl.Y(ly[i]),3.5,C.blue);
  const mx=D7_mean(lx),my=D7_mean(ly),f=x=>my+c.slope*(x-mx);out+=L(pl.X(xr[0]+.05),pl.Y(f(xr[0]+.05)),pl.X(xr[1]-.05),pl.Y(f(xr[1]-.05)),C.coral,2);
  out+=D7_tile(300,272,130,'Fitted slope',c.slope.toFixed(2),C.coral)+D7_tile(440,272,130,'True dimension',String(true_),C.ink)+D7_tile(300,324,270,'Nearest ÷ farthest (average)',D7_num(c.ratio,3),C.blue);
  return {svg:out,phase:s.kind==='full'?`Filling all 100 dimensions, the share of close pairs climbs very steeply (slope ${c.slope.toFixed(2)}), and the nearest neighbour is on average ${D7_num(c.ratio,3)} of the farthest: the curse in full.`:
   `Although each point has 100 coordinates, they lie on ${D7_LDK[s.kind]}: the slope ${c.slope.toFixed(2)} is close to ${true_}, and the nearest neighbour is only ${D7_num(c.ratio,3)} of the farthest on average. Methods that adapt to such structure escape most of the curse.`};
 }});

/* ===================== Lesson: cube-corners ===================== */
// A true slice through a cube [−h, h]ⁿ: the plane through the centre spanned by u = e₁ (towards a face centre) and
// v = (0, 1, …, 1)/√(n − 1). The cube meets it in the rectangle |a| ≤ h, |b| ≤ h√(n − 1), whose corners are corners
// of the cube; a ball about the centre meets it in a circle of the same radius.
function D7_slice(n,h,box){const W=h,H=n>1?h*Math.sqrt(n-1):0;const sc=Math.min(box.w/2/Math.max(W,1e-9),box.h/2/Math.max(H,W));return {W,H,sc,X:a=>box.cx+a*sc,Y:b=>box.cy-b*sc}}
SCENE({id:'cube-corners',name:'Corners that reach far out',tag:'Corners at √n ÷ 2, faces at ½',
 definition:`Put a cube of side 1 with its centre at the origin. Every face is ½ from the centre, so the ball of radius ½ touches all of them. But a corner, (±½, ±½, …, ±½), is √n ÷ 2 from the centre by Pythagoras: about ${D7_num(Math.sqrt(2)/2,2)} in the plane, ${D7_num(Math.sqrt(3)/2,2)} in space, ${fmt(Math.sqrt(4)/2)} in four dimensions and ${fmt(Math.sqrt(100)/2)} in a hundred. The inscribed ball fills a share V(n) ÷ 2ⁿ of the cube, which falls rapidly towards 0.`,
 example:`In four dimensions the corners are exactly as far from the centre (${fmt(Math.sqrt(4)/2)}) as the cube is wide; from five dimensions on they are further. The inscribed ball holds ${D7_pct(D7_V(3)/8,1)} of a cube in three dimensions, ${D7_pct(D7_V(10)/1024,2)} in ten, and ${D7_sci(D7_LOGV[30]-30*Math.log10(2),2)} of it in thirty.`,
 desc:'A true slice through the cube’s centre, a face centre and a corner, drawn to scale with the inscribed ball’s circle, beside tiles for the distances to a face and a corner and the share of the cube inside the ball.',
 research:['Ball (1997). An elementary introduction to modern convex geometry. MSRI Publications 31 (cubes in high dimensions).','Hamming (1997). The Art of Doing Science and Engineering. Gordon and Breach, chapter on n-dimensional space.'],
 dur:11,hint:'Raise n and watch the slice stretch: the face stays ½ away while the corner moves out to √n ÷ 2.',
 init:()=>({n:3}),
 watch:p=>({n:clamp(2+Math.floor(p*1.1*29),2,30)}),
 ui:[{range:'n',label:'Dimension n',min:2,max:30,get:s=>s.n,act:'n'},{b:'One more dimension',act:'more'}],
 on:{n(s,v){s.n=clamp(Math.round(+v),2,30)},more(s){s.n=Math.min(30,s.n+1)}},
 draw(s){
  const n=s.n,sl=D7_slice(n,.5,{cx:150,cy:192,w:180,h:270}),cd=Math.sqrt(n)/2,share=D7_LOGV[n]-n*Math.log10(2);
  let out=heading(`n = ${n}: corners ${D7_num(cd,3)} from the centre, faces ${fmt(.5)}`);
  out+=R(sl.X(-sl.W),sl.Y(sl.H),2*sl.W*sl.sc,2*sl.H*sl.sc,C.pale,C.blue,0)+Ci(sl.X(0),sl.Y(0),.5*sl.sc,C.coralp,C.coral);
  out+=L(sl.X(0),sl.Y(0),sl.X(sl.W),sl.Y(sl.H),C.ink,2)+Ci(sl.X(sl.W),sl.Y(sl.H),4,C.ink)+L(sl.X(0),sl.Y(0),sl.X(sl.W),sl.Y(0),C.green,2.4)+Ci(sl.X(0),sl.Y(0),3,C.ink);
  out+=TF(sl.X(sl.W)+8,sl.Y(sl.H)+4,'corner',13,C.ink,'start')+TF(sl.X(sl.W)+8,sl.Y(0)+4,'face',13,C.green,'start');
  out+=TF(150,370,'slice through the centre, a face and a corner',13,C.muted);
  // number line of distances from the centre
  const nx=v=>310+v/Math.sqrt(30)*2*250;
  out+=L(310,96,560,96,C.line,2);for(const v of [0,1,2])out+=L(nx(v),92,nx(v),100,C.line,1.4)+TF(nx(v),116,String(v),13,C.muted);
  out+=TF(310,70,'distance from the centre',13,C.muted,'start')+Ci(nx(.5),96,6,C.green)+Ci(nx(1),96,4,'#fff',C.purple)+Ci(nx(cd),96,7,C.ink);
  out+=TF(nx(.5),84,'face',13,C.green)+TF(nx(cd),134,'corner',13,C.ink)+TF(nx(1),84,'width 1',13,C.purple,'start');
  out+=D7_tile(310,160,125,'Face, ball radius',fmt(.5),C.green)+D7_tile(445,160,125,'Corner √n ÷ 2',D7_num(cd,4),C.ink);
  out+=D7_tile(310,214,260,'Inscribed ball’s share V(n) ÷ 2ⁿ',share>-3?D7_pct(Math.pow(10,share),share>-1?1:3):D7_sci(share,2),C.coral);
  out+=D7_tile(310,268,260,'Corner distance ÷ face distance',`√${n} = ${D7_num(Math.sqrt(n),4)}`,C.ink);
  const ph=n<4?`The corner is ${D7_num(cd,3)} from the centre, closer than the cube’s width of 1. The inscribed ball still fills ${D7_pct(Math.pow(10,share),1)} of the cube.`:
   n===4?'In four dimensions the corner is exactly 1 from the centre: as far as the cube is wide.':
   `The corner is ${D7_num(cd,3)} from the centre, √${n} ≈ ${D7_num(Math.sqrt(n),3)} times as far as a face. The slice shows why: it is ½ wide but ${D7_num(sl.H,3)} tall in each direction. The ball touching every face holds only ${share>-3?D7_pct(Math.pow(10,share),3):D7_sci(share,2)} of the cube.`;
  return {svg:out,phase:ph};
 }});

// The puzzle: a cube [−2, 2]ⁿ with a unit ball at each of its 2ⁿ corners (±1, …, ±1); the central ball touching them
// all has radius √n − 1. It reaches the faces (distance 2) at n = 9 and pokes out after that.
const D7_PZ_GUESS={never:'never',four:'n = 4',ten:'n = 10',hundred:'n = 100'};
const D7_PZ_OUT=D7_first(n=>Math.sqrt(n)-1>2,1,100);
SCENE({id:'cube-corners-puzzle',name:'The ball that escapes the box',tag:'2ⁿ corner balls and one in the middle',
 definition:`Put a cube of side 4 round the origin, and in each of its 2ⁿ corners a ball of radius 1, touching the three (or n) faces that meet there. The corner balls’ centres are at (±1, ±1, …, ±1), √n from the origin, so the largest ball in the middle that fits between them has radius √n − 1. In the plane it is small; in ${D7_PZ_OUT-1} dimensions its radius is ${fmt(Math.sqrt(D7_PZ_OUT-1)-1)} and it touches the cube’s faces; from ${D7_PZ_OUT} dimensions on it pokes out through them, although it sits between balls that are all inside.`,
 example:`Radius √n − 1 is ${D7_num(Math.sqrt(2)-1,3)} in the plane and ${D7_num(Math.sqrt(3)-1,3)} in space, against a half-width of 2. In ${D7_PZ_OUT} dimensions it is ${D7_num(Math.sqrt(D7_PZ_OUT)-1,4)}: more than 2. In a hundred dimensions it is ${D7_num(Math.sqrt(100)-1,2)}, more than twice the cube’s width.`,
 desc:'A true slice through the centre of the cube, a face centre and a corner, drawn to scale: the cube appears as a rectangle, four of the corner balls as circles, and the central ball as a circle whose radius grows with n until it crosses the cube’s face, with the learner’s prediction shown beside the computed answer.',
 research:['Hamming (1997). The Art of Doing Science and Engineering. Gordon and Breach (the ball between the corner balls).','Ball (1997). An elementary introduction to modern convex geometry. MSRI Publications 31.'],
 dur:12,hint:'Predict when the middle ball first pokes out of the box. Then raise n and watch the slice; switch to 3D for the three-dimensional case.',
 init:()=>({n:2,guess:''}),
 watch:p=>({n:clamp(2+Math.floor(p*1.1*14),2,16),guess:''}),
 ui:[{choose:[['never','Never'],['four','n = 4'],['ten','n = 10'],['hundred','n = 100']],label:'It first pokes out at',get:s=>s.guess,act:'guess'},{range:'n',label:'Dimension n',min:2,max:30,get:s=>s.n,act:'n'}],
 on:{guess(s,v){s.guess=D7_PZ_GUESS[v]?v:''},n(s,v){s.n=clamp(Math.round(+v),2,30)}},
 draw(s){
  const n=s.n,rc=Math.sqrt(n)-1,sl=D7_slice(n,2,{cx:160,cy:200,w:250,h:280}),poke=rc>2+1e-12,touch=Math.abs(rc-2)<1e-12;
  let out=heading(poke?`n = ${n}: the middle ball pokes out (radius ${D7_num(rc,3)} > 2)`:touch?`n = ${n}: the middle ball just touches the faces`:`n = ${n}: middle ball radius √${n} − 1 = ${D7_num(rc,3)}`);
  out+=`<clipPath id="d7pz"><rect x="20" y="46" width="290" height="312"/></clipPath>`;
  let g=R(sl.X(-sl.W),sl.Y(sl.H),2*sl.W*sl.sc,2*sl.H*sl.sc,'#fff',C.ink,0);
  const b=Math.sqrt(n-1);for(const sa of [-1,1])for(const sb of [-1,1])g+=Ci(sl.X(sa),sl.Y(sb*b),sl.sc,C.pale,C.blue);
  g+=Ci(sl.X(0),sl.Y(0),rc*sl.sc,poke?C.coralp:C.greenp,poke?C.coral:C.green,'opacity=".9"')+L(sl.X(0),sl.Y(0),sl.X(rc),sl.Y(0),poke?C.coral:C.green,2.4);
  out+=G(g,'clip-path="url(#d7pz)"')+TF(sl.X(sl.W)+6,sl.Y(-sl.H)-6,'face',13,C.ink,'start');
  out+=TF(165,374,'true slice: centre, face centre, corner',13,C.muted);
  // radius against n
  const pl=D7_plot(352,62,218,150,[2,30],[0,5],{xt:[[2,'2'],[10,'10'],[20,'20'],[30,'30']],xl:'dimension n',yt:[[0,'0'],[2,'2'],[4,'4']],yl:'middle ball radius'});out+=pl.svg;
  out+=L(pl.X(2),pl.Y(2),pl.X(30),pl.Y(2),C.ink,1.4,'stroke-dasharray="5 4"')+TF(pl.X(30)-2,pl.Y(2)+16,'half-width 2',13,C.ink,'end');
  const pts=[];for(let m=2;m<=30;m++)pts.push([pl.X(m),pl.Y(Math.sqrt(m)-1)]);out+=D7_poly(pts,C.green,2.2)+Ci(pl.X(n),pl.Y(rc),5,poke?C.coral:C.green,'#fff');
  out+=D7_tile(352,256,104,'Radius √n − 1',D7_num(rc,4),poke?C.coral:C.green)+D7_tile(466,256,104,'Pokes out from',`n = ${D7_PZ_OUT}`,C.coral);
  out+=D7_tile(352,310,218,'Your prediction',s.guess?D7_PZ_GUESS[s.guess]+(s.guess==='ten'?'  ✓':''):'not made yet',C.purple);
  const ph=poke?`√${n} − 1 = ${D7_num(rc,4)} is more than 2, the distance from the centre to a face. The middle ball, squeezed between ${D7_bigShort(2n**BigInt(n))} balls that all lie inside the box, reaches outside it.`:
   touch?'√9 − 1 = 2 exactly: the middle ball touches the centre of every face of the box.':
   `The corner balls’ centres are √${n} ≈ ${D7_num(Math.sqrt(n),3)} from the centre, so the middle ball has radius ${D7_num(rc,3)}. In the slice the cube is ${fmt(2*sl.W)} wide and ${D7_num(2*sl.H,3)} tall: it is the long direction towards the corners that makes room.`;
  return {svg:out,phase:ph};
 },
 three(s,f,X,project){
  const corners=[];for(const a of [-1,1])for(const b of [-1,1])for(const c of [-1,1])corners.push([a,b,c]);
  const Pr=project([-2,2,-2,2,-2,2]),o=Pr([0,0,0]),sc=Math.sqrt([[1,0,0],[0,1,0],[0,0,1]].reduce((t,e)=>{const q=Pr(e);return t+(q[0]-o[0])**2+(q[1]-o[1])**2},0)/2),rc=Math.sqrt(3)-1;
  let out='';const E=[];for(const a of [-2,2])for(const b of [-2,2]){E.push([[a,b,-2],[a,b,2]],[[a,-2,b],[a,2,b]],[[-2,a,b],[2,a,b]])}for(const [p,q] of E)out+=line3(p,q,Pr,C.line,1.6);
  out+=sortedItems(corners.map(c=>({at:c,svg:P2=>{const q=P2(c);return Ci(q[0],q[1],sc,tint(C.blue,.55),C.blue,'opacity=".5"')}})).concat([{at:[0,0,0],svg:P2=>{const q=P2([0,0,0]);return Ci(q[0],q[1],rc*sc,C.green,'#fff')}}]),Pr);
  return {svg:out,title:'The puzzle in three dimensions',caption:`The cube of side 4 with its 8 corner balls of radius 1 and the middle ball of radius √3 − 1 ≈ ${D7_num(rc,3)}, drawn in true 3D. Only n = 3 can be shown this way; the 2D slice works for every n.`};
 }});

// Where a cube's volume is: random points of [−½, ½]ⁿ, their distance from the centre, and the angle between each
// point's direction and the nearest corner's diagonal or the nearest face's normal.
const D7_CVC={};
function D7_cubeSample(n){if(!D7_CVC[n]){const r=D7_rng(3300+n),N=1500,d=[],ac=[],af=[];let inside=0;
  for(let k=0;k<N;k++){let q=0,ab=0,mx=0;for(let i=0;i<n;i++){const x=r()-.5;q+=x*x;ab+=Math.abs(x);mx=Math.max(mx,Math.abs(x))}const l=Math.sqrt(q);d.push(l);if(l<=.5)inside++;ac.push(D7_deg(ab/(Math.sqrt(n)*l)));af.push(D7_deg(mx/l))}
  D7_CVC[n]={N,d,inside,ac:D7_mean(ac),af:D7_mean(af)}}return D7_CVC[n]}
const D7_CVN=[2,3,10,100,1000];
SCENE({id:'cube-corners-volume',name:'Where the cube’s volume lives',tag:'Typical points are far out, towards the corners',
 definition:`Pick points at random in a cube of side 1. Each coordinate is spread evenly between −½ and ½, with average square 1/12, so a typical point is about √(n/12) from the centre: far beyond the inscribed ball (radius ½) once n is large, but well short of the corners (√n ÷ 2). Its direction is also telling. The angle to the nearest corner’s diagonal settles near ${D7_num(D7_deg(Math.sqrt(3)/2),2)}° (its cosine tends to (1/4) ÷ √(1/12) = √3/2), while the angle to the nearest face’s centre heads towards 90°: the bulk of a high-dimensional cube lies out towards its corners.`,
 example:`In a hundred dimensions √(n/12) is ${D7_num(Math.sqrt(100/12),3)}, against ${fmt(.5)} for the inscribed ball and ${fmt(Math.sqrt(100)/2)} for a corner. The share inside the inscribed ball is V(n) ÷ 2ⁿ = ${D7_sci(D7_LOGV[100]-100*Math.log10(2),2)}: no random sample of any practical size will contain a single such point.`,
 desc:'A histogram of the distances from the centre of 1500 random points of the cube, on an axis from the centre to a corner, with the inscribed ball’s radius, √(n/12) and the corner marked, and tiles for the share inside the ball and the average angles to the nearest corner diagonal and face.',
 research:['Ball (1997). An elementary introduction to modern convex geometry. MSRI Publications 31.','Blum, Hopcroft & Kannan (2020). Foundations of Data Science. Cambridge University Press, chapter 2.','Seeded sample of 1500 points in each dimension.'],
 dur:11,hint:'Choose a dimension and compare the sample’s distances with the inscribed ball, √(n/12) and the corner. Read the angles to the nearest corner and face.',
 init:()=>({n:3}),
 watch:p=>({n:D7_CVN[Math.min(4,Math.floor(p*5))]}),
 ui:[{choose:D7_CVN.map(v=>[v,String(v)]),label:'Dimension n',get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=D7_CVN.includes(+v)?+v:3}},
 draw(s){
  const n=s.n,c=D7_cubeSample(n),cd=Math.sqrt(n)/2,typ=Math.sqrt(n/12),h=D7_hist(c.d,0,cd,40),hm=Math.max(...h,1);
  let out=heading(`n = ${n}: typical distance ${D7_num(D7_mean(c.d),3)}, corner ${D7_num(cd,3)}`);
  const pl=D7_plot(60,70,500,170,[0,cd],[0,hm*1.15],{xt:[[0,'0'],[cd,D7_num(cd,3)]],xl:'distance from the centre (corner at the right end)',yt:[[0,'0'],[hm,String(hm)]],yl:'how many of 1500 points'});out+=pl.svg;
  h.forEach((v,i)=>{if(v)out+=R(pl.X(i*cd/40)+.5,pl.Y(v),500/40-1,pl.Y(0)-pl.Y(v),C.blue,'none',1)});
  const mark=(x,col,lab,dy)=>L(pl.X(x),70,pl.X(x),240,col,2,'stroke-dasharray="5 3"')+TF(pl.X(x)+(x>cd*.8?-5:5),70+dy,lab,13,col,x>cd*.8?'end':'start');
  out+=mark(Math.min(.5,cd),C.green,'inscribed ball ½',18)+mark(typ,C.coral,`√(n/12) = ${D7_num(typ,3)}`,38);
  const inside=c.inside/c.N,exact=D7_LOGV[n]-n*Math.log10(2);
  out+=D7_tile(30,288,130,'Inside ball, sample',D7_pct(inside,1),C.green)+D7_tile(170,288,130,'V(n) ÷ 2ⁿ',exact>-3?D7_pct(Math.pow(10,exact),1):D7_sci(exact,2),C.green)+D7_tile(310,288,130,'Angle to corner',D7_num(c.ac,3)+'°',C.ink)+D7_tile(450,288,130,'Angle to face',D7_num(c.af,3)+'°',C.ink);
  out+=D7_note('angles: averages over the sample, to the nearest corner’s diagonal and the nearest face’s centre',356);
  return {svg:out,phase:`The ${c.N} random points are on average ${D7_num(D7_mean(c.d),3)} from the centre, close to √(n/12) = ${D7_num(typ,3)}. ${D7_pct(inside,1)} of them fall inside the inscribed ball (exactly ${exact>-3?D7_pct(Math.pow(10,exact),2):D7_sci(exact,2)} of the volume). Their directions are on average ${D7_num(c.ac,3)}° from the nearest corner and ${D7_num(c.af,3)}° from the nearest face.`};
 }});
