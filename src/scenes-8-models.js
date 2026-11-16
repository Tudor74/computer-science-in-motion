/* ===================== Mind era 8 · Models of mind ===================== */
// Computational models of mind: artificial neurons, prediction errors, Bayesian perception, predictive
// processing, bodies in the loop and theories of consciousness. Every picture is a pure function of state,
// frame and X; models are recomputed from the learner's inputs, never stored half-run. Experiments time with
// performance.now() in on() handlers; trial orders use seeded shuffles. Sound only from on() handlers.
const D8_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const D8_rng=n=>rng(D8_mix(n));
function D8_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const D8_poly=(pts,col,w=2.2,extra='')=>pts.length>1?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const D8_mean=a=>a.length?sum(a)/a.length:NaN;
const D8_norm=(x,m,s)=>Math.exp(-.5*((x-m)/s)**2)/(s*Math.sqrt(2*Math.PI));
// Least-squares line through [x,y] pairs: {a,b} with y = a + b·x, or null.
function D8_fit(pts){const n=pts.length;if(n<2)return null;const mx=sum(pts.map(p=>p[0]))/n,my=sum(pts.map(p=>p[1]))/n,sxx=sum(pts.map(p=>(p[0]-mx)**2));if(sxx<1e-9)return null;const b=sum(pts.map(p=>(p[0]-mx)*(p[1]-my)))/sxx;return {a:my-b*mx,b}}
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function D8_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-7,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
const D8_pill=(x,y,label,fill,ink=C.ink,w)=>{const ww=w||label.length*7.4+18;return R(x,y-14,ww,20,fill,'none',10)+TBF(x+ww/2,y+1,label,13,ink)};

/* =========================== perceptron =========================== */
// Two small data sets in the unit square. t = +1 (blue) or −1 (coral).
const D8_SETS={
 sep:{name:'Separable',pts:[[.1,.7,1],[.3,.2,-1],[.25,.9,1],[.5,.3,-1],[.4,.75,1],[.65,.45,-1],[.55,.95,1],[.8,.35,-1],[.7,.85,1],[.9,.6,-1],[.2,.5,1],[.15,.15,-1],[.85,.9,1]]},
 xor:{name:'XOR',pts:[[.15,.15,-1],[.15,.85,1],[.85,.85,-1],[.85,.15,1],[.25,.2,-1],[.2,.75,1],[.75,.8,-1],[.8,.25,1]]}
};
const D8_W0=[.3,.6,-.9],D8_ETA=.5,D8_MAXEP=30;
function D8_pts(s){return D8_SETS[s.set].pts.map((p,i)=>({x:p[0],y:p[1],t:(s.flip||[]).includes(i)?-p[2]:p[2]}))}
const D8_out=(w,p)=>w[0]+w[1]*p.x+w[2]*p.y>=0?1:-1;
// Rosenblatt's rule: present points in turn; if the output is wrong, add η·t·input to the weights.
function D8_pTrain(pts,steps){let w=D8_W0.slice();const errs=[];let last=null;
 for(let k=0;k<steps;k++){const i=k%pts.length,e=Math.floor(k/pts.length);if(errs.length<=e)errs.push(0);const p=pts[i],y=D8_out(w,p);let upd=false;
  if(y!==p.t){w=[w[0]+D8_ETA*p.t,w[1]+D8_ETA*p.t*p.x,w[2]+D8_ETA*p.t*p.y];errs[e]++;upd=true}last={i,upd,y}}
 return {w,errs,last}}
// Steps until one full epoch passes with no error (or the cap).
function D8_pConverge(pts){const n=pts.length;for(let e=1;e<=D8_MAXEP;e++){const r=D8_pTrain(pts,e*n);if(r.errs[e-1]===0)return e*n}return D8_MAXEP*n}
// The decision line clipped to the plotting square, in data units.
function D8_lineSeg(w,lo=-.04,hi=1.04){const out=[];
 if(Math.abs(w[2])>1e-9)for(const x of [lo,hi]){const y=-(w[0]+w[1]*x)/w[2];if(y>=lo-1e-9&&y<=hi+1e-9)out.push([x,y])}
 if(Math.abs(w[1])>1e-9)for(const y of [lo,hi]){const x=-(w[0]+w[2]*y)/w[1];if(x>lo+1e-9&&x<hi-1e-9)out.push([x,y])}
 return out.length>=2?out.slice(0,2):null}
SCENE({id:'perceptron',name:'The perceptron learns',tag:'Rosenblatt’s rule',
 definition:'A perceptron adds up its weighted inputs and fires if the total passes a threshold. It learns from mistakes: when it gets an example wrong, it nudges each weight by the input times the error.',
 example:'Shown a blue point on the coral side of its line, the perceptron moves the line towards that point; after a few passes through the data the line separates the two colours.',
 desc:'Points of two colours in a square, a straight decision line that moves each time the perceptron makes a mistake, and a bar chart of mistakes in each pass.',
 research:'Rosenblatt (1958). The perceptron: a probabilistic model for information storage and organization in the brain. Psychological Review 65, 386–408. McCulloch & Pitts (1943) proposed the threshold neuron.',
 dur:12,hint:'Present points one at a time or a whole pass. Press a point to change its colour; choose XOR to see data that no single line can split.',
 init:()=>({set:'sep',flip:[],k:0}),
 watch(p){const s={set:'sep',flip:[]};const n=D8_pConverge(D8_pts(s));return {...s,k:Math.min(n,Math.floor(p*1.08*n))}},
 ui:[{choose:[['sep','Separable'],['xor','XOR']],label:'Data',get:s=>s.set,act:'set'},{b:'Present one point',act:'one'},{b:'One pass',act:'pass'},{b:'Train until no mistakes',act:'all'},{b:'Reset weights',act:'reset'}],
 on:{set(s,v){s.set=v;s.flip=[];s.k=0},one(s){s.k=Math.min(s.k+1,D8_MAXEP*D8_pts(s).length)},pass(s){const n=D8_pts(s).length;s.k=Math.min((Math.floor(s.k/n)+1)*n,D8_MAXEP*n)},
  all(s){s.k=D8_pConverge(D8_pts(s))},reset(s){s.k=0},flip(s,i){i=Number(i);s.flip=s.flip.includes(i)?s.flip.filter(j=>j!==i):s.flip.concat(i);s.k=0}},
 draw(s,f,X){
  const pts=D8_pts(s),n=pts.length,r=D8_pTrain(pts,s.k),w=r.w,px=x=>50+x*260,py=y=>320-y*260;
  let out=heading('A perceptron draws a line between two classes',26);
  out+=R(40,50,280,280,'#fff',C.grid,4);
  const seg=D8_lineSeg(w);if(seg){out+=L(px(seg[0][0]),py(seg[0][1]),px(seg[1][0]),py(seg[1][1]),C.ink,2.6);
   const mx=(seg[0][0]+seg[1][0])/2,my=(seg[0][1]+seg[1][1])/2,nn=Math.hypot(w[1],w[2])||1;out+=arrow(px(mx),py(my),px(mx+w[1]/nn*.12),py(my+w[2]/nn*.12),C.blue,2,7)}
  pts.forEach((p,i)=>{const wrong=D8_out(w,p)!==p.t,cur=r.last&&s.k>0&&r.last.i===i;
   out+=hit(X,'flip',i,`Point ${i+1}, ${p.t>0?'blue':'coral'}${wrong?', misclassified':''}. Press to change its class.`,(cur?Ci(px(p.x),py(p.y),15,'none',C.ink,'stroke-width="2"'):'')+Ci(px(p.x),py(p.y),8,p.t>0?C.blue:C.coral,wrong?C.amber:'#fff','stroke-width="3"'))});
  const ep=Math.floor(s.k/n),inEp=s.k%n,mis=pts.filter(p=>D8_out(w,p)!==p.t).length;
  out+=TBF(345,70,'weights',14,C.muted,'start');
  out+=TMF(345,94,`bias ${w[0].toFixed(2)}`,14,C.ink,'start')+TMF(345,116,`w₁ ${w[1].toFixed(2)}`,14,C.ink,'start')+TMF(345,138,`w₂ ${w[2].toFixed(2)}`,14,C.ink,'start');
  out+=TF(345,166,`${s.k} presentations · pass ${ep+(inEp?1:0)}`,13,C.muted,'start');
  out+=TF(345,188,`${mis} of ${n} points on the wrong side now`,13,mis?C.coral:C.green,'start');
  const bx=345,by=300,bw=Math.min(18,225/Math.max(1,r.errs.length));out+=L(bx,by,580,by,C.line,1)+TF(bx,214,'mistakes in each pass',13,C.muted,'start');
  r.errs.slice(0,12).forEach((e,i)=>{const h=Math.min(70,e*10);out+=R(bx+i*(bw+3),by-h,bw,h,e?C.coral:C.green,'none',2)});
  out+=TF(bx,by+18,'pass 1 →',13,C.muted,'start');
  out+=TF(180,352,'arrow: the side called blue · amber ring: on the wrong side',13,C.muted);
  const conv=s.k>=n&&r.errs[Math.floor(s.k/n)-1]===0&&inEp===0;
  const phase=s.k===0?'The starting line is arbitrary. Each mistake moves the line towards the point it got wrong.':r.last&&r.last.upd?`Point ${r.last.i+1} was on the wrong side, so the weights moved by η × target × input (η = ${D8_ETA}).`:conv?'A whole pass with no mistakes: the line now separates the classes. Rosenblatt proved this always happens if a separating line exists.':s.set==='xor'&&ep>=3?'XOR keeps producing mistakes pass after pass: no straight line can put the blue corners on one side and the coral corners on the other.':'That point was already on the right side, so nothing changed.';
  return {svg:out,phase};
 }});

// XOR with one layer versus two.
const D8_XOR_ROWS=[[0,0],[0,1],[1,0],[1,1]];
const D8_step=v=>v>0?1:0;
function D8_xorNet(a,b){const h1=D8_step(a+b-.5),h2=D8_step(a+b-1.5);return {h1,h2,o:D8_step(h1-h2-.5)}}
const D8_orUnit=(a,b)=>D8_step(a+b-.5);
SCENE({id:'perceptron-xor',name:'Why one layer is not enough',tag:'XOR and hidden units',
 definition:'A single-layer perceptron can only learn patterns that one straight line can separate. Exclusive-or (one input on, but not both) is not such a pattern; adding a hidden layer of units solves it.',
 example:'With hidden units for “at least one on” (OR) and “both on” (AND), the output fires for OR but not AND, which is exactly XOR.',
 desc:'A small network diagram with two inputs, optional hidden units and an output, beside the four-row truth table for exclusive-or.',
 research:'Minsky & Papert (1969). Perceptrons. MIT Press. Rumelhart, Hinton & Williams (1986). Learning representations by back-propagating errors. Nature 323, 533–536. Olazaran (1996) argues the book was not the sole cause of the funding slump that followed.',
 dur:10,hint:'Press the input circles to switch them on and off, and switch between one layer and two. Watch the output against the XOR target.',
 init:()=>({a:1,b:0,net:'two'}),
 watch(p){const i=Math.floor(p*8)%4;return {a:D8_XOR_ROWS[i][0],b:D8_XOR_ROWS[i][1],net:p<.5?'one':'two'}},
 ui:[{choose:[['one','One layer'],['two','With hidden layer']],label:'Network',get:s=>s.net,act:'net'},{b:'Next input pair',act:'next'}],
 on:{net(s,v){s.net=v},next(s){const i=(D8_XOR_ROWS.findIndex(r=>r[0]===s.a&&r[1]===s.b)+1)%4;s.a=D8_XOR_ROWS[i][0];s.b=D8_XOR_ROWS[i][1]},tog(s,k){if(k==='a')s.a^=1;else s.b^=1}},
 draw(s,f,X){
  const two=s.net==='two',net=D8_xorNet(s.a,s.b),o=two?net.o:D8_orUnit(s.a,s.b),target=s.a^s.b;
  let out=heading(two?'Two layers: hidden OR and AND units compute XOR':'One layer: the best single unit (OR) still gets XOR wrong',26);
  const node=(x,y,v,lab)=>Ci(x,y,24,v?C.blue:'#fff',v?C.blue:C.line,'stroke-width="2.5"')+TBF(x,y+5,String(v),16,v?'#fff':C.ink)+TF(x,y+42,lab,13,C.muted);
  const I=[[70,110],[70,250]],Hh=[[200,110],[200,250]],O=[330,180];
  const wl=(a,b,wt,on)=>{const u=b[1]===a[1]?.5:.3,x=a[0]+24+(b[0]-a[0]-48)*u,y=a[1]+(b[1]-a[1])*u;return L(a[0]+24,a[1],b[0]-24,b[1],on?C.blue:C.line,on?3:1.8)+TBF(x,y+(b[1]>a[1]?-6:b[1]<a[1]?16:-7),wt,13,C.purple,'middle','stroke="#fff" stroke-width="4" paint-order="stroke"')};
  if(two){out+=wl(I[0],Hh[0],'+1',s.a)+wl(I[1],Hh[0],'+1',s.b)+wl(I[0],Hh[1],'+1',s.a)+wl(I[1],Hh[1],'+1',s.b)+wl(Hh[0],O,'+1',net.h1)+wl(Hh[1],O,'−1',net.h2);
   out+=node(Hh[0][0],Hh[0][1],net.h1,'OR (θ 0.5)')+node(Hh[1][0],Hh[1][1],net.h2,'AND (θ 1.5)')}
  else{out+=wl(I[0],O,'+1',s.a)+wl(I[1],O,'+1',s.b)}
  out+=hit(X,'tog','a','Input A: '+s.a+'. Press to switch.',node(I[0][0],I[0][1],s.a,'input A'))+hit(X,'tog','b','Input B: '+s.b+'. Press to switch.',node(I[1][0],I[1][1],s.b,'input B'));
  out+=Ci(O[0],O[1],28,o?C.blue:'#fff',o===target?C.green:C.coral,'stroke-width="4"')+TBF(O[0],O[1]+6,String(o),17,o?'#fff':C.ink)+TF(O[0],O[1]+48,two?'output (θ 0.5)':'output: OR unit',13,C.muted);
  const tx=400,ty=70;out+=R(tx-10,ty-22,195,180,'#fff',C.grid,6);
  ['A','B','XOR','net'].forEach((h,i)=>out+=TBF(tx+18+i*44,ty-4,h,13,C.muted));
  D8_XOR_ROWS.forEach((r,i)=>{const y=ty+26+i*30,cur=r[0]===s.a&&r[1]===s.b,oo=two?D8_xorNet(r[0],r[1]).o:D8_orUnit(r[0],r[1]),ok=oo===(r[0]^r[1]);
   if(cur)out+=R(tx-6,y-18,187,26,C.pale,'none',4);
   out+=TMF(tx+18,y,String(r[0]),14,C.ink)+TMF(tx+62,y,String(r[1]),14,C.ink)+TMF(tx+106,y,String(r[0]^r[1]),14,C.ink)+TMF(tx+150,y,String(oo),14,ok?C.green:C.coral)});
  const right=D8_XOR_ROWS.filter(r=>(two?D8_xorNet(r[0],r[1]).o:D8_orUnit(r[0],r[1]))===(r[0]^r[1])).length;
  out+=TF(tx+88,ty+148,`${right} of 4 rows right`,14,right===4?C.green:C.coral);
  out+=T(300,330,two?'The hidden layer re-describes the inputs so that a line can split them.':'Any one straight line gets at least one of the four rows wrong.',15,C.ink);
  out+=TF(300,354,'θ = threshold; a unit outputs 1 when its weighted input sum exceeds θ',13,C.muted);
  return {svg:out,phase:two?'Hand-set weights show that a solution exists. Back-propagation (1986) made it practical to learn such hidden units from examples.':'Minsky and Papert proved that single-layer perceptrons cannot compute XOR. Multi-layer networks could, but nobody yet knew how to train them.'};
 }});

// Gradient descent on the squared error of a linear unit (Widrow–Hoff delta rule, batch form).
const D8_GX=[[1,.2],[.4,1],[.8,.7],[.2,.3]],D8_WSTAR=[1,.5],D8_GT=D8_GX.map(x=>x[0]*D8_WSTAR[0]+x[1]*D8_WSTAR[1]);
function D8_E(w){return D8_mean(D8_GX.map((x,i)=>(D8_GT[i]-x[0]*w[0]-x[1]*w[1])**2))}
function D8_grad(w){const n=D8_GX.length;let g0=0,g1=0;D8_GX.forEach((x,i)=>{const e=D8_GT[i]-x[0]*w[0]-x[1]*w[1];g0+=-2/n*e*x[0];g1+=-2/n*e*x[1]});return [g0,g1]}
// Largest eigenvalue of the Hessian (2/n)XᵀX: steps larger than 2/λ diverge.
const D8_HMAX=(()=>{const n=D8_GX.length;let a=0,b=0,c=0;D8_GX.forEach(x=>{a+=2/n*x[0]*x[0];b+=2/n*x[0]*x[1];c+=2/n*x[1]*x[1]});return (a+c)/2+Math.sqrt(((a-c)/2)**2+b*b)})();
const D8_STARTS={a:[-.6,2.2],b:[2.2,-.8],c:[-.8,-.8]};
function D8_path(start,eta,n=24){const pts=[start.slice()];let w=start.slice();for(let k=0;k<n;k++){const g=D8_grad(w);w=[w[0]-eta*g[0],w[1]-eta*g[1]];if(!isFinite(w[0])||Math.abs(w[0])>50||Math.abs(w[1])>50)break;pts.push(w.slice())}return pts}
const D8_WR=[-1,2.5];
SCENE({id:'perceptron-error',name:'Learning as going downhill',tag:'Gradient descent',
 definition:'Learning can be pictured as rolling downhill on an error surface: every setting of the weights has an error, and each step moves the weights in the direction that lowers the error fastest.',
 example:'With a small step size the weights slide smoothly to the bottom of the bowl; with too large a step they zig-zag across it, and past a limit they fly off.',
 desc:'A map of the error for every pair of weights, darker where the error is larger, with the path taken by gradient descent from a chosen start.',
 research:'Widrow & Hoff (1960). Adaptive switching circuits. IRE WESCON Convention Record; Rumelhart, Hinton & Williams (1986). Back-propagation extends the same downhill idea to hidden layers.',
 dur:11,hint:'Choose a start and a step size. Push the step size up until the path starts to zig-zag, then past the limit. Switch to 3D to see the bowl.',
 init:()=>({start:'a',eta:.6}),
 watch(p){return {start:'a',eta:p<.5?.6:+(D8_HMAX&&1.8/D8_HMAX).toFixed(2),show:Math.floor(((p*2)%1)*25)}},
 ui:[{choose:[['a','Start A'],['b','Start B'],['c','Start C']],label:'Start',get:s=>s.start,act:'start'},{range:'eta',label:'Step size η',min:.05,max:2.4,step:.05,get:s=>s.eta,act:'eta',show:v=>Number(v).toFixed(2)}],
 on:{start(s,v){s.start=v},eta(s,v){s.eta=Number(v)}},
 draw(s){
  const path=D8_path(D8_STARTS[s.start],s.eta).slice(0,s.show===undefined?25:s.show+1),lim=2/D8_HMAX;
  let out=heading('Gradient descent on the error of a linear unit',26);
  const x0=40,y0=50,sz=270,N=27,cw=sz/N,map=v=>x0+(v-D8_WR[0])/(D8_WR[1]-D8_WR[0])*sz,mapY=v=>y0+sz-(v-D8_WR[0])/(D8_WR[1]-D8_WR[0])*sz;
  for(let i=0;i<N;i++)for(let j=0;j<N;j++){const w=[D8_WR[0]+(i+.5)/N*3.5,D8_WR[0]+(j+.5)/N*3.5],e=D8_E(w),u=clamp(Math.log10(1+e*4)/1.25,0,1);out+=R(x0+i*cw,y0+sz-(j+1)*cw,cw+.5,cw+.5,tint(C.blue,1-u*.85),'none',0)}
  out+=R(x0,y0,sz,sz,'none',C.grid,2);
  [-1,0,1,2].forEach(v=>{out+=TF(map(v),y0+sz+17,String(v),13,C.muted)+TF(x0-7,mapY(v)+4,String(v),13,C.muted,'end')});
  out+=TF(x0+sz/2,y0+sz+35,'weight w₁',13,C.muted)+TF(x0,y0-8,'weight w₂',13,C.muted,'start');
  const vis=path.filter(w=>w[0]>=D8_WR[0]-.2&&w[0]<=D8_WR[1]+.2&&w[1]>=D8_WR[0]-.2&&w[1]<=D8_WR[1]+.2);
  out+=D8_poly(vis.map(w=>[map(clamp(w[0],-1.1,2.6)),mapY(clamp(w[1],-1.1,2.6))]),C.coral,2.4);vis.forEach((w,i)=>out+=Ci(map(clamp(w[0],-1.1,2.6)),mapY(clamp(w[1],-1.1,2.6)),i?3.5:6,i?C.coral:C.ink));
  out+=`<path d="M${fmt(map(1))} ${fmt(mapY(.5)-9)}l2.6 6.3h6.8l-5.5 4.2l2.1 6.6l-6-4l-6 4l2.1-6.6l-5.5-4.2h6.8z" fill="#ffd24a" stroke="${C.ink}" stroke-width="1"/>`;
  const errs=path.map(D8_E),last=errs[errs.length-1],div=path.length<25&&s.show===undefined||last>errs[0]*1.5;
  const pl=D8_plot(360,60,210,170,[0,24],[0,Math.log10(1+Math.max(...errs.slice(0,25),D8_E(D8_STARTS[s.start])))],{xt:[[0,'0'],[12,'12'],[24,'24 steps']],yl:'error (log scale)'});out+=pl.svg;
  out+=D8_poly(errs.map((e,i)=>[pl.X(i),pl.Y(Math.log10(1+e))]),C.coral,2.2);
  out+=TF(360,284,`η = ${s.eta.toFixed(2)} · stable limit 2/λ = ${lim.toFixed(2)}`,13,s.eta>=lim?C.coral:C.ink,'start');
  out+=TF(360,306,`error after ${path.length-1} steps: ${last>99?'> 99':last.toFixed(3)}`,13,C.ink,'start');
  out+=TF(360,328,'star = lowest error (w₁ 1, w₂ 0.5)',13,C.muted,'start');
  const phase=s.eta>=lim||div?'The step is so large that each move overshoots the valley by more than it gained: the error grows and the weights fly away.':s.eta>1/D8_HMAX?'Each step now overshoots across the steep direction of the valley; the path still settles because every overshoot is smaller than the last.':'Each step points straight downhill. The valley is long and narrow because the two inputs are correlated, so the path bends as it goes.';
  return {svg:out,phase};
 },
 three(s,f,X,project){
  const P=project([D8_WR[0],D8_WR[1],D8_WR[0],D8_WR[1],0,2.4]),zc=w=>Math.min(2.4,Math.log10(1+D8_E(w)*4)*1.9);let out='';const N=14;
  for(let i=0;i<=N;i++){const a=D8_WR[0]+i/N*3.5,r1=[],r2=[];for(let j=0;j<=N*2;j++){const b=D8_WR[0]+j/(N*2)*3.5;r1.push([a,b,zc([a,b])]);r2.push([b,a,zc([b,a])])}
   for(let j=0;j<N*2;j++){out+=line3(r1[j],r1[j+1],P,C.line,1.2)+line3(r2[j],r2[j+1],P,C.line,1.2)}}
  const path=D8_path(D8_STARTS[s.start],s.eta).slice(0,s.show===undefined?25:s.show+1).filter(w=>w[0]>=D8_WR[0]&&w[0]<=D8_WR[1]&&w[1]>=D8_WR[0]&&w[1]<=D8_WR[1]);
  for(let k=0;k+1<path.length;k++)out+=line3([...path[k],zc(path[k])+.03],[...path[k+1],zc(path[k+1])+.03],P,C.coral,3);
  path.forEach((w,i)=>out+=point3([...w,zc(w)+.03],P,i?C.coral:C.ink,i?4:7));
  out+=point3([1,.5,0],P,'#ffd24a',8,C.ink);
  out+=axes3(P,['w₁','w₂','error'],[D8_WR[1],D8_WR[1],2.4],[D8_WR[0],D8_WR[0],0]);
  return {svg:out,title:'The error bowl',caption:'Height is the error (log scale) for each pair of weights. Gradient descent is a ball rolling down the steepest slope; the bowl is stretched because the inputs are correlated.'};
 }});

/* =========================== prediction-error =========================== */
// Rescorla–Wagner: ΔV = α(λ − ΣV) on every trial with the cue present.
const D8_ALPHA=.25;
function D8_rw(trials){let v=0;const V=[0],D=[];trials.forEach(t=>{const lam=t==='R'?1:0,d=lam-v;D.push(d);v+=D8_ALPHA*d;V.push(v)});return {V,D}}
const D8_RW_WATCH=Array(12).fill('R').concat(Array(10).fill('N'));
SCENE({id:'prediction-error',name:'Learning from surprise',tag:'The Rescorla–Wagner rule',
 definition:'In the Rescorla–Wagner model an animal learns only when it is surprised: on each trial the association changes by a fixed fraction of the prediction error, the difference between what happened and what was expected.',
 example:'The first time a tone is followed by food, the surprise is large and learning is fast; once the tone fully predicts food, there is no surprise and learning stops. Take the food away and a negative error unlearns the link.',
 desc:'A learning curve of associative strength over trials, with the prediction error of each trial drawn as a bar beneath it.',
 research:'Rescorla & Wagner (1972). A theory of Pavlovian conditioning. In Black & Prokasy (eds), Classical Conditioning II. Miller, Barnet & Grahame (1995) review its successes and the effects it cannot explain, such as spontaneous recovery.',
 dur:12,hint:'Add trials with food or without and watch the curve and the error bars. Each trial moves the strength a quarter of the way to its target.',
 init:()=>({trials:[]}),
 watch(p){return {trials:D8_RW_WATCH.slice(0,Math.floor(p*23))}},
 ui:[{b:'Tone + food',act:'add',arg:'R'},{b:'Tone alone',act:'add',arg:'N'},{b:'5 × tone + food',act:'five'},{b:'Clear',act:'clear'}],
 on:{add(s,v){if(s.trials.length<30)s.trials.push(v)},five(s){for(let i=0;i<5&&s.trials.length<30;i++)s.trials.push('R')},clear(s){s.trials=[]}},
 draw(s){
  const {V,D}=D8_rw(s.trials),n=s.trials.length;let out=heading('Associative strength grows by a share of the surprise',26);
  const pl=D8_plot(70,52,490,150,[0,30],[0,1.05],{xt:[[0,'0'],[10,'10'],[20,'20'],[30,'30 trials']],yt:[[0,'0'],[.5,'0.5'],[1,'1']],yl:'strength V of tone → food'});out+=pl.svg;
  out+=L(pl.X(0),pl.Y(1),pl.X(30),pl.Y(1),C.green,1.4,'stroke-dasharray="6 5"')+TF(pl.X(30)-4,pl.Y(1)-6,'λ = 1 when food follows',13,C.green,'end');
  out+=D8_poly(V.map((v,i)=>[pl.X(i),pl.Y(v)]),C.blue,2.6);V.forEach((v,i)=>out+=Ci(pl.X(i),pl.Y(v),3.5,C.blue));
  const by=298,sc=42;out+=L(70,by,560,by,C.line,1.4)+TF(64,by+4,'0',13,C.muted,'end')+TF(70,by-sc-8,'prediction error λ − V on each trial',13,C.muted,'start')+TF(560,by-sc-8,'● food  ○ no food',13,C.muted,'end');
  D.forEach((d,i)=>{const x=pl.X(i+.5)-6,h=Math.abs(d)*sc;out+=R(x,d>=0?by-h:by,12,h,d>=0?C.coral:C.purple,'none',2)});
  s.trials.forEach((t,i)=>out+=TF(pl.X(i+.5),by+(D[i]<0?Math.abs(D[i])*sc+16:16),t==='R'?'●':'○',13,t==='R'?C.green:C.muted));
  const last=n?D[n-1]:null;
  out+=T(300,372,n?`Trial ${n}: error ${last>=0?'+':''}${last.toFixed(2)}, so V moves by ${(D8_ALPHA*last).toFixed(2)} to ${V[n].toFixed(2)}`:'No trials yet: the tone predicts nothing (V = 0)',15,C.ink);
  const phase=!n?'Add a trial. With α = 0.25 every trial closes a quarter of the gap between what is expected and what happens.':last>.05?'Positive surprise: more food than predicted, so the tone gains strength. The gains shrink as the prediction improves.':last<-.05?'Negative surprise: food was expected but did not come, so the tone loses strength (extinction).':'The prediction matches the outcome, so there is nothing left to learn.';
  return {svg:out,phase};
 }});

// Blocking: compound AB → food after A alone has been trained.
function D8_block(pre,n2=10){let a=0,b=0;const A=[0],B=[0];for(let i=0;i<pre;i++){a+=D8_ALPHA*(1-a);A.push(a);B.push(b)}for(let i=0;i<n2;i++){const d=1-(a+b);a+=D8_ALPHA*d;b+=D8_ALPHA*d;A.push(a);B.push(b)}return {A,B}}
SCENE({id:'prediction-error-blocking',name:'Blocking',tag:'Kamin’s surprise',
 definition:'Blocking: if one cue already predicts an outcome, a second cue added alongside it is barely learned, even though it is paired with the outcome just as often. Pairing alone is not enough; the outcome must be surprising.',
 example:'Train a light → shock until the light is fully feared, then present light + tone → shock. The tone gains almost no fear, because the light already predicted the shock.',
 desc:'Two learning curves, for cue A and cue B, across a pre-training phase and a compound phase, with bars comparing the final strength of B with and without pre-training.',
 research:'Kamin (1969). Predictability, surprise, attention, and conditioning. In Campbell & Church (eds), Punishment and Aversive Behavior; explained by Rescorla & Wagner (1972). Maes et al. (2016) report 15 failures to replicate blocking with a range of procedures, so it is less universal than once thought.',
 dur:11,hint:'Set how many A-alone trials come first, then compare how much B learns in the same ten A + B trials.',
 init:()=>({pre:10}),
 watch(p){return {pre:Math.round(p<.5?p*2*15:15-(p-.5)*2*15)}},
 ui:[{range:'pre',label:'A-alone trials first',min:0,max:15,step:1,get:s=>s.pre,act:'pre',show:v=>String(v)},{b:'No pre-training',act:'set',arg:0},{b:'Ten A-alone trials',act:'set',arg:10}],
 on:{pre(s,v){s.pre=Number(v)},set(s,v){s.pre=Number(v)}},
 draw(s){
  const {A,B}=D8_block(s.pre),n=A.length-1,ctl=D8_block(0);let out=heading('Does tone B learn when light A already predicts the shock?',26);
  const pl=D8_plot(70,52,330,210,[0,25],[0,1.05],{xt:[[0,'0'],[5,'5'],[10,'10'],[15,'15'],[20,'20'],[25,'25']],yt:[[0,'0'],[.5,'0.5'],[1,'1']],xl:'trials (strength of each cue)'});out+=pl.svg;
  if(s.pre>0)out+=R(pl.X(0),52,pl.X(s.pre)-pl.X(0),210,C.pale,'none',0)+TF((pl.X(0)+pl.X(s.pre))/2,46,'A alone',13,C.blue);
  out+=TF((pl.X(s.pre)+pl.X(n))/2,46,'A + B together',13,C.ink);
  out+=D8_poly(A.map((v,i)=>[pl.X(i),pl.Y(v)]),C.blue,2.6)+D8_poly(B.map((v,i)=>[pl.X(i),pl.Y(v)]),C.coral,2.6);
  out+=TBF(pl.X(n)+6,pl.Y(A[n])+4,'A',14,C.blue,'start')+TBF(pl.X(n)+6,pl.Y(B[n])+4,'B',14,C.coral,'start');
  const bx=450,base=262,hh=180;out+=TF(505,62,'final strength of B',13,C.muted);
  [[ctl.B[ctl.B.length-1],'no pre-training',C.muted],[B[n],`${s.pre} A-alone trials`,C.coral]].forEach(([v,l,c],i)=>{const x=bx+i*62;out+=R(x,base-v*hh,44,v*hh,c,'none',3)+TBF(x+22,base-v*hh-6,v.toFixed(2),13,C.ink)+TF(x+22,base+18,i?'blocked':'control',13,C.muted)});
  out+=L(bx-6,base,bx+112,base,C.line,1.4);
  out+=T(300,322,`B ends at ${B[n].toFixed(2)}, against ${ctl.B[ctl.B.length-1].toFixed(2)} without pre-training`,15,C.ink);
  out+=TF(300,346,'Both cues share one prediction error: λ − (V_A + V_B)',13,C.muted);
  return {svg:out,phase:s.pre>=6?'By the time B arrives, A already predicts the shock, so the shared error is almost zero and B learns almost nothing: blocked.':s.pre===0?'With no head start, A and B split the learning between them and each ends near 0.5.':'A has a partial head start, so B learns less than in the control but is not fully blocked.'};
 }});

// Temporal-difference learning across one trial: cue at t = 2, reward at t = 7 (γ = 1, α = 0.3).
const D8_TD_CUE=2,D8_TD_REW=7,D8_TD_T=10,D8_TD_A=.3;
function D8_td(trials){let w=Array(D8_TD_T+1).fill(0);const rows=[];
 trials.forEach(tr=>{const V=t=>t>=D8_TD_CUE&&t<D8_TD_REW?w[t]:0,d=[];
  for(let t=0;t<D8_TD_T;t++){const r=t===D8_TD_REW&&tr==='R'?1:0;d.push(r+V(t)-(t>0?V(t-1):0))}
  const nw=w.slice();for(let t=D8_TD_CUE+1;t<=D8_TD_REW;t++)nw[t-1]+=D8_TD_A*d[t];w=nw;rows.push(d)});
 return {rows,w}}
SCENE({id:'prediction-error-dopamine',name:'Dopamine and prediction error',tag:'Temporal-difference learning',
 definition:'In temporal-difference learning the prediction error compares successive moments. Dopamine neurons behave like this signal: they fire to an unexpected reward, shift their firing to the cue that predicts it, and dip when a predicted reward fails to arrive.',
 example:'Early in training a monkey’s dopamine neurons burst when juice arrives. After training they burst at the light that predicts juice, not at the juice; if the juice is withheld, they pause at the moment it was due.',
 desc:'Rows of model prediction-error bars along a trial timeline, one row per trial, with a cue marker and a reward marker, showing the response move from the reward to the cue.',
 research:'Schultz, Dayan & Montague (1997). A neural substrate of prediction and reward. Science 275, 1593–1599; Sutton (1988). Learning to predict by the methods of temporal differences. The bars here are a model, not recordings; Berridge (2007) argues dopamine also signals wanting.',
 dur:12,hint:'Run rewarded trials and watch the error move from the reward to the cue. Then omit the reward once to see the dip.',
 init:()=>({trials:[]}),
 watch(p){const n=Math.floor(p*31);return {trials:Array(Math.min(n,29)).fill('R').concat(n>=30?['O']:[])}},
 ui:[{b:'Trial with reward',act:'add',arg:'R'},{b:'10 rewarded trials',act:'ten'},{b:'Trial, reward omitted',act:'add',arg:'O'},{b:'Clear',act:'clear'}],
 on:{add(s,v){if(s.trials.length<60)s.trials.push(v)},ten(s){for(let i=0;i<10&&s.trials.length<60;i++)s.trials.push('R')},clear(s){s.trials=[]}},
 draw(s){
  const {rows}=D8_td(s.trials),n=rows.length;let out=heading('Where in the trial is the surprise?',26);
  const x0=150,dx=40,tx=t=>x0+t*dx+dx/2;
  out+=R(x0,44,D8_TD_T*dx,24,'#f6f9fb','none',4);
  out+=Ci(tx(D8_TD_CUE),56,8,'#ffd24a',C.ink)+TF(tx(D8_TD_CUE),86,'cue',13,C.ink);
  out+=R(tx(D8_TD_REW)-8,48,16,16,C.green,'none',3)+TF(tx(D8_TD_REW),86,'reward',13,C.green);
  const show=[];[1,2,3,5,10,20].forEach(k=>{if(k<=n&&!show.includes(k))show.push(k)});if(n&&!show.includes(n))show.push(n);
  const sel=show.slice(-6),rh=40;
  sel.forEach((k,j)=>{const y=110+j*rh+rh/2,d=rows[k-1],om=s.trials[k-1]==='O';out+=TF(x0-12,y+4,`trial ${k}${om?' (no reward)':''}`,13,om?C.purple:C.muted,'end');
   out+=L(x0,y,x0+D8_TD_T*dx,y,C.grid,1);d.forEach((v,t)=>{const h=Math.min(1.2,Math.abs(v))*16;if(h>.5)out+=R(tx(t)-9,v>0?y-h:y,18,h,v>0?C.coral:C.purple,'none',2)})});
  if(!n)out+=T(300,200,'No trials yet. Run a trial with reward.',15,C.muted);
  [0,2,4,6,8].forEach(t=>out+=TF(tx(t),358,`${t}`,13,C.muted));out+=TF(x0-12,358,'time step',13,C.muted,'end');
  const L_=n?rows[n-1]:null,cueR=L_?L_[D8_TD_CUE]:0,rewR=L_?L_[D8_TD_REW]:0;
  if(n)out+=TF(300,378,`last trial: response at cue ${cueR.toFixed(2)} · at reward time ${rewR.toFixed(2)}`,13,C.ink);
  const om=n&&s.trials[n-1]==='O';
  return {svg:out,phase:!n?'Coral bars will show positive prediction errors (bursts), purple bars negative ones (pauses).':om?'The cue still predicts reward, so the cue response stays. When the reward fails to come, the error is negative: a pause in firing, as Schultz recorded.':cueR>.6?'After training the surprise has moved to the cue: the cue arrives unpredictably, but the reward is fully expected.':'Early on the reward is a surprise. Each trial passes some of that value back one step towards the cue.'};
 }});

/* =========================== bayesian-perception =========================== */
const D8_PRIOR_M=4;
function D8_post(m,sl,sp,mp=D8_PRIOR_M){const wp=1/sp**2,wl=1/sl**2;return {mean:(mp*wp+m*wl)/(wp+wl),sd:Math.sqrt(1/(wp+wl)),wl:wl/(wp+wl)}}
SCENE({id:'bayesian-perception',name:'Perception as inference',tag:'Prior × likelihood',
 definition:'A Bayesian observer combines what it already expects (the prior) with what the senses report (the likelihood). The result, the posterior, is pulled towards whichever source is more reliable.',
 example:'In fog a car’s speed is hard to judge, so the estimate leans on the expectation that things are usually slow or still. Weiss and colleagues showed this explains why low-contrast moving objects look slower.',
 desc:'Three bell curves on one axis: the prior, the likelihood from a measurement and the narrower posterior between them, with sliders for the measurement and the reliability of each source.',
 research:'Knill & Pouget (2004). The Bayesian brain: the role of uncertainty in neural coding and computation. Trends in Neurosciences 27; Weiss, Simoncelli & Adelson (2002). Motion illusions as optimal percepts. Nature Neuroscience 5. Helmholtz (1867) called perception unconscious inference.',
 dur:11,hint:'Move the measurement and make the senses noisier. Watch the posterior slide towards the prior when the senses are unreliable. Switch to 3D for the whole surface.',
 init:()=>({m:7,sl:1,sp:1.5}),
 watch(p){return {m:7,sl:+(.5+p*2.5).toFixed(2),sp:1.5}},
 ui:[{range:'m',label:'Measurement',min:0,max:10,step:.1,get:s=>s.m,act:'m',show:v=>Number(v).toFixed(1)},{range:'sl',label:'Sensory noise σ',min:.3,max:3,step:.05,get:s=>s.sl,act:'sl',show:v=>Number(v).toFixed(2)},{range:'sp',label:'Prior width σ',min:.5,max:4,step:.05,get:s=>s.sp,act:'sp',show:v=>Number(v).toFixed(2)}],
 on:{m(s,v){s.m=Number(v)},sl(s,v){s.sl=Number(v)},sp(s,v){s.sp=Number(v)}},
 draw(s){
  const po=D8_post(s.m,s.sl,s.sp);let out=heading('The estimate is a weighted blend of expectation and evidence',26);
  const pk=D8_norm(0,0,Math.min(s.sl,s.sp,po.sd)),pl=D8_plot(50,50,500,210,[0,10],[0,pk*1.12],{xt:[0,2,4,6,8,10].map(v=>[v,String(v)]),xl:'speed of the object (arbitrary units)'});out+=pl.svg;
  const curve=(m,sd,col,w,extra='')=>{const pts=[];for(let i=0;i<=200;i++){const x=i/20;pts.push([pl.X(x),pl.Y(D8_norm(x,m,sd))])}return D8_poly(pts,col,w,extra)};
  out+=curve(D8_PRIOR_M,s.sp,C.green,2.4,'stroke-dasharray="7 5"')+curve(s.m,s.sl,C.blue,2.4)+curve(po.mean,po.sd,C.coral,3.2);
  out+=L(pl.X(po.mean),50,pl.X(po.mean),260,C.coral,1.4,'stroke-dasharray="3 4"');
  const lab=(x,y,t,c)=>TBF(x,y,t,13,c,'middle','stroke="#fff" stroke-width="4" paint-order="stroke"');
  out+=lab(pl.X(D8_PRIOR_M),pl.Y(D8_norm(D8_PRIOR_M,D8_PRIOR_M,s.sp))-8,'prior',C.green)+lab(pl.X(s.m),pl.Y(D8_norm(s.m,s.m,s.sl))-8,'likelihood',C.blue);
  out+=TBF(pl.X(po.mean)+(po.mean<s.m?-6:6),66,`posterior ${po.mean.toFixed(2)}`,13,C.coral,po.mean<s.m?'end':'start','stroke="#fff" stroke-width="4" paint-order="stroke"');
  out+=T(300,322,`weight on the senses ${Math.round(po.wl*100)}% · on the prior ${Math.round((1-po.wl)*100)}%`,15,C.ink);
  out+=TF(300,346,`posterior mean = (prior/σp² + measurement/σs²) ÷ (1/σp² + 1/σs²) · posterior σ ${po.sd.toFixed(2)}`,13,C.muted);
  return {svg:out,phase:po.wl>.7?'The senses are reliable, so the estimate stays close to the measurement and the prior only nudges it.':po.wl<.4?'The senses are noisy, so the estimate is pulled strongly towards what was expected: this is how low contrast makes motion look slower.':'Both sources count. The posterior is narrower than either, because two uncertain sources together are more certain than one.'};
 },
 three(s,f,X,project){
  const P=project([0,10,0,10,0,3]);let out='';const zz=(x,m)=>{const v=D8_norm(x,D8_PRIOR_M,s.sp)*D8_norm(m,x,s.sl);return v};
  let mx=0;for(let i=0;i<=40;i++)for(let j=0;j<=40;j++)mx=Math.max(mx,zz(i/4,j/4));const Z=(x,m)=>zz(x,m)/mx*2.6;
  for(let j=0;j<=20;j++){const m=j/2,pts=[];for(let i=0;i<=40;i++)pts.push([i/4,m,Z(i/4,m)]);for(let i=0;i<40;i++)out+=line3(pts[i],pts[i+1],P,C.line,1.1)}
  for(let i=0;i<=20;i++){const x=i/2,pts=[];for(let j=0;j<=40;j++)pts.push([x,j/4,Z(x,j/4)]);for(let j=0;j<40;j++)out+=line3(pts[j],pts[j+1],P,C.grid,1)}
  const sl=[];for(let i=0;i<=80;i++)sl.push([i/8,s.m,Z(i/8,s.m)+.02]);for(let i=0;i<80;i++)out+=line3(sl[i],sl[i+1],P,C.coral,3.2);
  out+=line3([0,s.m,0],[10,s.m,0],P,C.coral,1.2,'stroke-dasharray="5 4"');
  out+=axes3(P,['true speed','measurement','prior × likelihood'],[10,10,3]);
  return {svg:out,title:'Every possible measurement at once',caption:'The surface is prior × likelihood over the true speed and the measurement. Cutting it at the measurement you actually got (coral) gives the posterior, up to scaling.'};
 }});

// Ernst & Banks (2002): vision and touch judging the height of a bar.
const D8_SH=2;
SCENE({id:'bayesian-perception-cues',name:'Combining the senses',tag:'Vision plus touch',
 definition:'When two senses measure the same thing, the brain can weight each by its reliability (one over its variance). The combined estimate is then more precise than either sense alone.',
 example:'Feeling and seeing a bar’s height: with a clear view, vision dominates; with blurred vision, people rely more on touch, in close agreement with the optimal weights.',
 desc:'Bell curves for a visual and a haptic estimate of height that disagree slightly, the combined curve between them, and a chart of the visual weight against visual noise.',
 research:'Ernst & Banks (2002). Humans integrate visual and haptic information in a statistically optimal fashion. Nature 415, 429–433. Rahnev & Denison (2018) review the many cases where people fall short of optimal.',
 dur:10,hint:'Blur vision with the slider. The visual weight follows 1/σv² ÷ (1/σv² + 1/σt²). Change the conflict to see where the combined estimate lands.',
 init:()=>({sv:1,gap:3}),
 watch(p){return {sv:+(.5+p*4).toFixed(2),gap:3}},
 ui:[{range:'sv',label:'Visual noise σv',min:.4,max:5,step:.05,get:s=>s.sv,act:'sv',show:v=>Number(v).toFixed(2)+' mm'},{range:'gap',label:'Conflict',min:0,max:6,step:.5,get:s=>s.gap,act:'gap',show:v=>v+' mm'}],
 on:{sv(s,v){s.sv=Number(v)},gap(s,v){s.gap=Number(v)}},
 draw(s){
  const v0=55+s.gap/2,t0=55-s.gap/2,wv=(1/s.sv**2)/(1/s.sv**2+1/D8_SH**2),cm=wv*v0+(1-wv)*t0,cs=Math.sqrt(1/(1/s.sv**2+1/D8_SH**2));
  let out=heading('Seeing and feeling the height of a bar',26);
  const pl=D8_plot(50,50,310,220,[45,65],[0,D8_norm(0,0,Math.min(cs,s.sv))*1.1],{xt:[45,50,55,60,65].map(v=>[v,String(v)]),xl:'height (mm)'});out+=pl.svg;
  const curve=(m,sd,col,w,extra='')=>{const pts=[];for(let i=0;i<=200;i++){const x=45+i/10;pts.push([pl.X(x),pl.Y(D8_norm(x,m,sd))])}return D8_poly(pts,col,w,extra)};
  out+=curve(v0,s.sv,C.blue,2.4)+curve(t0,D8_SH,C.green,2.4,'stroke-dasharray="7 5"')+curve(cm,cs,C.coral,3.2);
  out+=TBF(58,72,'vision',13,C.blue,'start')+TBF(58,90,'touch',13,C.green,'start')+TBF(58,108,'combined',13,C.coral,'start');
  out+=TF(205,332,`combined ${cm.toFixed(1)} mm, σ ${cs.toFixed(2)} mm (touch alone σ ${D8_SH})`,13,C.ink);
  const p2=D8_plot(400,50,170,220,[0,5],[0,1],{xt:[[0,'0'],[2.5,'2.5'],[5,'5']],yt:[[0,'0'],[.5,'0.5'],[1,'1']],xl:'visual noise σv (mm)',yl:'weight on vision'});out+=p2.svg;
  const pts=[];for(let i=0;i<=100;i++){const v=.05+i/100*4.95,w=(1/v**2)/(1/v**2+1/D8_SH**2);pts.push([p2.X(v),p2.Y(w)])}out+=D8_poly(pts,C.blue,2.4);
  out+=Ci(p2.X(s.sv),p2.Y(wv),7,C.coral,'#fff');
  out+=T(300,362,`Vision gets ${Math.round(wv*100)}% of the weight, touch ${Math.round((1-wv)*100)}%`,15,C.ink);
  return {svg:out,phase:wv>.6?'Vision is the more reliable sense here, so the combined estimate sits near what you see.':wv<.4?'Blurred vision is less reliable than touch, so the combined estimate moves towards what you feel. Ernst and Banks found people’s weights followed this curve closely.':'The two senses are about equally reliable, so the estimate lands near the middle, and its spread is narrower than either sense alone.'};
 }});

// You are the observer: a hidden target from a prior, seen through a sharp or blurry cloud of dots.
const D8_RP_M=60,D8_RP_S=8,D8_RD={sharp:4,blur:25},D8_RN=5,D8_RTRIALS=16;
function D8_rTrial(seed,i){const order=shuffled(range(D8_RTRIALS).map(k=>k%2?'blur':'sharp'),D8_mix(seed+7)),r=D8_rng(seed*97+i*13+5),cond=order[i];
 const x=clamp(D8_RP_M+D8_RP_S*D8_gauss(r),25,95),dots=range(D8_RN).map(()=>clamp(x+D8_RD[cond]*D8_gauss(r),0,100));return {cond,x,dots,c:D8_mean(dots)}}
const D8_bayesSlope=c=>D8_RP_S**2/(D8_RP_S**2+(D8_RD[c]/Math.sqrt(D8_RN))**2);
SCENE({id:'bayesian-perception-reach',name:'Your own prior',tag:'You are the observer',
 definition:'A test of Bayesian estimation: hidden targets come from a range you can learn, and the evidence about each one is either sharp or blurry. An ideal observer leans on the learned range more when the evidence is blurry.',
 example:'After a few trials you learn the targets cluster near 60. With a sharp cloud you point at the cloud’s centre; with a blurry cloud an ideal observer points partway between the centre and 60.',
 desc:'A number line with a cloud of dots hinting at a hidden target, and a chart of your estimates against the cloud centre for sharp and blurry clouds, with the ideal Bayesian slopes.',
 research:'Körding & Wolpert (2004). Bayesian integration in sensorimotor learning. Nature 427, 244–247; this is a simplified number-line version of their reaching task. Nothing you enter leaves this page.',
 dur:12,hint:'Set your estimate with the slider or by pressing the line, then Commit. The true position is shown after each trial. Sixteen trials; nothing leaves this page.',
 init:()=>({seed:3,i:0,est:50,res:[]}),
 watch(p){const n=Math.min(D8_RTRIALS,Math.floor(p*(D8_RTRIALS+1))),r=D8_rng(41),res=[];for(let i=0;i<n;i++){const t=D8_rTrial(3,i),b=D8_bayesSlope(t.cond);res.push({cond:t.cond,c:t.c,x:t.x,e:D8_RP_M+b*(t.c-D8_RP_M)+3*D8_gauss(r)})}return {seed:3,i:n,est:50,res,sim:true}},
 ui:[{range:'est',label:'Your estimate',min:0,max:100,step:1,get:s=>s.est,act:'est',show:v=>String(v)},{b:'Commit estimate',act:'go'},{b:'Start again',act:'again'}],
 on:{est(s,v){s.est=Number(v)},go(s){if(s.i>=D8_RTRIALS)return;const t=D8_rTrial(s.seed,s.i);s.res.push({cond:t.cond,c:t.c,x:t.x,e:s.est});s.i++},again(s){s.seed=nextSeed();s.i=0;s.res=[]}},
 draw(s,f,X){
  let out=heading('Where is the hidden target?',26);const lx=v=>40+v*5.2,ly=88;
  out+=L(lx(0),ly,lx(100),ly,C.line,2);[0,20,40,60,80,100].forEach(v=>out+=L(lx(v),ly-5,lx(v),ly+5,C.line,1.4)+TF(lx(v),ly+22,String(v),13,C.muted));
  if(X.try)for(let v=0;v<=100;v+=4)out+=hit(X,'est',v,'Set estimate '+v,R(lx(v)-10,ly-26,20,40,'transparent','none',0));
  if(s.i<D8_RTRIALS){const t=D8_rTrial(s.seed,s.i);t.dots.forEach(d=>out+=Ci(lx(d),ly-12,5,t.cond==='sharp'?C.blue:C.purple,'#fff'));out+=TF(lx(100),58,`trial ${s.i+1} of ${D8_RTRIALS} · ${t.cond==='sharp'?'sharp cloud':'blurry cloud'}`,13,C.muted,'end')}
  else out+=TF(lx(100),58,'all trials done',13,C.muted,'end');
  out+=`<polygon points="${fmt(lx(s.est))},${ly-19} ${fmt(lx(s.est)-7)},${ly-33} ${fmt(lx(s.est)+7)},${ly-33}" fill="${C.coral}"/>`;
  const last=s.res[s.res.length-1];if(last&&!s.sim)out+=TF(40,58,`last: target ${last.x.toFixed(0)}, your estimate ${Math.round(last.e)}`,13,C.green,'start');
  const pl=D8_plot(80,150,260,180,[30,90],[30,90],{xt:[[30,'30'],[90,'90']],yt:[[30,'30'],[60,'60'],[90,'90']],xl:'centre of the dot cloud',xlDy:30,yl:'estimate'});out+=pl.svg;
  out+=L(pl.X(30),pl.Y(30),pl.X(90),pl.Y(90),C.grid,1.4,'stroke-dasharray="4 4"');
  ['sharp','blur'].forEach(c=>{const b=D8_bayesSlope(c),col=c==='sharp'?C.blue:C.purple;out+=L(pl.X(30),pl.Y(D8_RP_M+b*(30-D8_RP_M)),pl.X(90),pl.Y(D8_RP_M+b*(90-D8_RP_M)),col,2,'stroke-dasharray="7 5"')});
  s.res.forEach(r=>out+=Ci(pl.X(clamp(r.c,30,90)),pl.Y(clamp(r.e,30,90)),5,r.cond==='sharp'?C.blue:C.purple,'#fff'));
  const fits={};['sharp','blur'].forEach(c=>fits[c]=D8_fit(s.res.filter(r=>r.cond===c).map(r=>[r.c,r.e])));
  const tx=370;out+=TBF(tx,166,s.sim?'Simulated observer':'Your slopes',14,C.ink,'start')+TF(tx,186,'(1 = follow the cloud, 0 = ignore it)',13,C.muted,'start');
  [['sharp','sharp cloud',C.blue],['blur','blurry cloud',C.purple]].forEach(([c,l,col],i)=>{const y=216+i*46;out+=TBF(tx,y,l,13,col,'start')+TF(tx,y+20,`yours ${fits[c]?fits[c].b.toFixed(2):'—'} · ideal ${D8_bayesSlope(c).toFixed(2)}`,13,C.ink,'start')});
  out+=TF(tx,322,'dashed lines: ideal Bayesian slopes',13,C.muted,'start');
  return {svg:out,phase:s.res.length<6?'Targets are drawn from a range centred on 60. Watch the true positions after each trial to learn that range.':'If your blurry-cloud slope is well below 1, you used the learned range more when the evidence was weak, as Körding and Wolpert’s participants did.'};
 }});

/* =========================== predictive-processing =========================== */
const D8_PP_N=40;
const D8_PP_IN={step:t=>t<15?2:6,blink:t=>t===20?7:2,wave:t=>4+2.5*Math.sin(t/3),ramp:t=>1+t*.15};
function D8_pp(kind,k){let p=D8_PP_IN[kind](0);const xs=[],ps=[],es=[];for(let t=0;t<D8_PP_N;t++){const x=D8_PP_IN[kind](t),e=x-p;xs.push(x);ps.push(p);es.push(e);p+=k*e}return {xs,ps,es}}
SCENE({id:'predictive-processing',name:'The predicting brain',tag:'Predictions down, errors up',
 definition:'Predictive processing pictures the brain as a hierarchy that constantly predicts its own input. Higher levels send predictions down; only the mismatch, the prediction error, is sent up, and it is used to revise the predictions.',
 example:'A steady hum soon goes unnoticed because it is fully predicted; the moment it stops, a burst of error signals “something changed”.',
 desc:'A two-level diagram with a prediction arrow down and an error arrow up, above traces of the input, the prediction and the error over time.',
 research:'Rao & Ballard (1999). Predictive coding in the visual cortex. Nature Neuroscience 2, 79–87; Friston (2005). A theory of cortical responses. Phil. Trans. R. Soc. B 360; Clark (2013). Whatever next? Behavioral and Brain Sciences 36. A broad framework: its core ideas have support, but many versions exist and critics say parts are hard to test.',
 dur:12,hint:'Choose an input and set how strongly errors update the prediction (their weight, or precision). Watch errors spike at changes and fade as the prediction catches up.',
 init:()=>({kind:'step',k:.3}),
 watch(p){return {kind:['step','blink','wave'][Math.min(2,Math.floor(p*3))],k:.3}},
 ui:[{choose:[['step','Step change'],['blink','Single blip'],['wave','Slow wave'],['ramp','Steady rise']],label:'Input',get:s=>s.kind,act:'kind'},{range:'k',label:'Weight on error',min:.05,max:1,step:.05,get:s=>s.k,act:'k',show:v=>Number(v).toFixed(2)}],
 on:{kind(s,v){s.kind=v},k(s,v){s.k=Number(v)}},
 draw(s,f,X){
  const r=D8_pp(s.kind,s.k),n=X.try?D8_PP_N:Math.max(2,Math.floor(D8_PP_N*((X.p*3)%1||1)));let out=heading('Only the surprise travels upwards',26);
  out+=box(60,48,150,40,'higher level','#fff',C.ink,14,C.line)+box(60,140,150,40,'sensory level','#fff',C.ink,14,C.line);
  out+=arrow(110,90,110,138,C.green,2.6)+TF(100,118,'prediction',13,C.green,'end')+arrow(160,138,160,90,C.coral,2.6)+TF(170,118,'error',13,C.coral,'start');
  out+=arrow(135,214,135,182,C.blue,2.4)+TF(135,228,'input',13,C.blue);
  const pl=D8_plot(260,50,310,140,[0,D8_PP_N],[0,8.5],{yl:'input and prediction'});out+=pl.svg;
  out+=D8_poly(r.xs.slice(0,n).map((v,t)=>[pl.X(t),pl.Y(v)]),C.blue,2.4)+D8_poly(r.ps.slice(0,n).map((v,t)=>[pl.X(t),pl.Y(v)]),C.green,2.4,'stroke-dasharray="6 4"');
  const p2=D8_plot(260,226,310,110,[0,D8_PP_N],[-5,5],{xt:[[0,'0'],[40,'40']],yt:[[0,'0']],xl:'time',xlDy:30,yl:'prediction error'});out+=p2.svg;
  out+=L(260,p2.Y(0),570,p2.Y(0),C.line,1);r.es.slice(0,n).forEach((e,t)=>{const h=Math.abs(clamp(e,-5,5))*11;out+=R(p2.X(t)+1,e>=0?p2.Y(0)-h:p2.Y(0),5,h,C.coral,'none',1)});
  const tot=sum(r.es.slice(0,n).map(Math.abs));out+=TF(60,268,`total error ${tot.toFixed(1)}`,13,C.ink,'start')+TF(60,290,`weight on error ${s.k.toFixed(2)}`,13,C.muted,'start');
  out+=TF(60,330,'blue input · green prediction',13,C.muted,'start');
  return {svg:out,phase:s.kind==='ramp'?'A steady rise leaves a constant error: this simple predictor never anticipates trends. Higher levels that model the rate of change would remove it.':s.k>.8?'With errors weighted fully, the prediction jumps to every input: fast, but it would also chase noise.':s.k<.15?'With little weight on error, predictions change slowly and surprises last a long time.':'Errors spike when the input changes, then shrink as the prediction catches up. A fully predicted input sends nothing upwards.'};
 }});

// Oddball sequence: surprise = −log₂ of the model’s running estimate of each tone’s probability.
const D8_OB_N=20;
// Exactly round(p × 17) odd tones among the last 17 positions (the first three are always common).
function D8_obSeq(prob,seed=5){const k=Math.max(1,Math.round(prob*(D8_OB_N-3))),pos=shuffled(range(D8_OB_N-3).map(i=>i+3),D8_mix(seed+Math.round(prob*100))).slice(0,k);return range(D8_OB_N).map(i=>pos.includes(i)?1:0)}
function D8_obSurp(seq){let c=[1,1];return seq.map(t=>{const p=c[t]/(c[0]+c[1]),s=-Math.log2(p);c[t]++;return s})}
SCENE({id:'predictive-processing-oddball',name:'The oddball',tag:'Mismatch and surprise',
 definition:'In an oddball sequence a rare tone breaks a run of common ones. The brain’s response to the rare tone, the mismatch negativity, appears even when attention is elsewhere, and it shrinks as the odd tone becomes common.',
 example:'Beep beep beep BOOP beep: the BOOP draws a response at about 150–250 ms after it starts. Make BOOP as common as beep and the extra response largely disappears.',
 desc:'A row of tones, common and rare, with a bar above each showing a model’s surprise in bits, and averages for common and rare tones.',
 research:'Näätänen, Gaillard & Mäntysalo (1978). Early selective-attention effect on evoked potential reinterpreted. Acta Psychologica 42; Garrido, Kilner, Stephan & Friston (2009). The mismatch negativity: a review of underlying mechanisms. Clinical Neurophysiology 120. The bars come from a simple counting model, not EEG.',
 dur:10,hint:'Choose how often the odd tone appears and press Play to hear the sequence. Compare the surprise for odd tones when they are rare and when they are common.',
 init:()=>({prob:.15,head:-1}),
 watch(p){return {prob:p<.6?.15:.5,head:Math.floor(((p<.6?p/.6:(p-.6)/.4))*D8_OB_N)}},
 ui:[{choose:[[.1,'10% odd'],[.15,'15% odd'],[.3,'30% odd'],[.5,'50% odd']],label:'Odd tone',get:s=>s.prob,act:'prob'},{b:'Play sequence',act:'play'}],
 on:{prob(s,v){s.prob=Number(v);s.head=-1},
  play(s,a,ctx){const seq=D8_obSeq(s.prob);AUDIO.seq(seq.map((t,i)=>({hz:t?1200:1000,at:i*.3,dur:.1})),{type:'sine',gain:.16});s.head=0;ctx.every(300,'tick')},
  tick(s){s.head++;if(s.head>=D8_OB_N){s.head=D8_OB_N-1;return 'stop'}}},
 draw(s,f,X){
  const seq=D8_obSeq(s.prob),su=D8_obSurp(seq),dx=26,x0=300-D8_OB_N*dx/2,base=250,shown=s.head<0?D8_OB_N:Math.min(D8_OB_N,s.head+1);
  let out=heading('A rare tone among common ones',26);
  out+=L(x0-6,base,x0+D8_OB_N*dx,base,C.line,1.4);out+=TF(x0-6,64,'surprise (bits)',13,C.muted,'start');
  for(let i=0;i<D8_OB_N;i++){const x=x0+i*dx+dx/2,on=i<shown,cur=i===s.head;
   if(on){const h=Math.min(5,su[i])*34;out+=R(x-8,base-h,16,h,seq[i]?C.coral:C.blue,'none',2)}
   out+=R(x-10,base+10,20,20,seq[i]?C.coral:'#fff',seq[i]?C.coral:C.line,4)+(cur?Ci(x,base+46,4,C.ink):'')}
  out+=R(x0,base+56,14,14,'#fff',C.line,3)+TF(x0+20,base+68,'common tone 1000 Hz',13,C.muted,'start')+R(x0+200,base+56,14,14,C.coral,'none',3)+TF(x0+220,base+68,'odd tone 1200 Hz',13,C.muted,'start');
  const avg=t=>{const v=su.filter((_,i)=>seq[i]===t&&i<shown);return v.length?D8_mean(v):NaN};const a0=avg(0),a1=avg(1);
  out+=T(300,354,`average surprise: common ${isFinite(a0)?a0.toFixed(2):'—'} bits · odd ${isFinite(a1)?a1.toFixed(2):'—'} bits`,15,C.ink);
  return {svg:out,phase:s.prob>=.5?'When both tones are equally common, neither is surprising: about 1 bit each, and the mismatch response largely vanishes.':'Each odd tone is surprising because the model has learned to expect the common one. In the brain the mismatch negativity tracks this kind of surprise.'};
 }});

// Active inference toy: reduce the error by changing the belief or by moving the arm.
function D8_ai(mode,x0=20,mu0=70,k=.25,n=24){let x=x0,mu=mu0;const X_=[x],M=[mu];for(let t=0;t<n;t++){const e=mu-x;if(mode!=='act')mu-=k*e*(mode==='both'?.5:1);if(mode!=='perceive')x+=k*e*(mode==='both'?.5:1);X_.push(x);M.push(mu)}return {X:X_,M}}
SCENE({id:'predictive-processing-action',name:'Acting to fulfil predictions',tag:'Active inference',
 definition:'In active inference a prediction error can be removed in two ways: change the prediction to fit the world (perception), or change the world to fit the prediction (action). Movement is then a prediction of where the body will be, made true by the muscles.',
 example:'Predict that your hand is on the cup while it rests on the table. Either you notice that it is not (update the belief), or the arm moves until the prediction comes true.',
 desc:'An arm with its actual angle and a ghost arm at the predicted angle, and two traces over time showing which of them moves to close the gap.',
 research:'Friston, Daunizeau, Kilner & Kiebel (2010). Action and behavior: a free-energy formulation. Biological Cybernetics 102; Adams, Shipp & Friston (2013). Predictions not commands. Brain Structure and Function 218. The free-energy principle is influential but debated, partly because it is so general.',
 dur:12,hint:'Choose whether the error is reduced by perceiving, acting or both. The same error disappears each time, but different things change.',
 init:()=>({mode:'act'}),
 watch(p){return {mode:['perceive','act','both'][Math.min(2,Math.floor(p*3))],t:Math.floor(((p*3)%1)*25)}},
 ui:[{choose:[['perceive','Perceive'],['act','Act'],['both','Both']],label:'Reduce error by',get:s=>s.mode,act:'mode'}],
 on:{mode(s,v){s.mode=v}},
 draw(s){
  const r=D8_ai(s.mode),t=s.t===undefined?24:Math.min(24,s.t),x=r.X[t],mu=r.M[t];let out=heading(s.mode==='perceive'?'Perception: the belief moves to the arm':s.mode==='act'?'Action: the arm moves to the belief':'Both: belief and arm meet halfway',26);
  const sx=160,sy=290,len=140,ang=v=>(-10-v)*Math.PI/180;
  out+=Ci(sx,sy,9,C.ink)+R(sx-60,sy+8,150,10,C.grid,'none',3);
  out+=L(sx,sy,sx+len*Math.cos(ang(mu)),sy+len*Math.sin(ang(mu)),C.green,7,'stroke-dasharray="10 6" opacity=".7"');
  out+=L(sx,sy,sx+len*Math.cos(ang(x)),sy+len*Math.sin(ang(x)),C.blue,9);
  out+=TF(sx+len*Math.cos(ang(mu))+12,sy+len*Math.sin(ang(mu))-8,'predicted',13,C.green,'start')+TF(sx+len*Math.cos(ang(x))+14,sy+len*Math.sin(ang(x))+18,'actual',13,C.blue,'start');
  out+=TF(sx,sy+40,`error ${(mu-x).toFixed(1)}°`,14,C.coral);
  const pl=D8_plot(340,60,230,220,[0,24],[0,90],{xt:[[0,'0'],[12,'12'],[24,'24 steps']],yt:[[0,'0°'],[45,'45°'],[90,'90°']],yl:'arm angle'});out+=pl.svg;
  out+=D8_poly(r.M.slice(0,t+1).map((v,i)=>[pl.X(i),pl.Y(v)]),C.green,2.4,'stroke-dasharray="6 4"')+D8_poly(r.X.slice(0,t+1).map((v,i)=>[pl.X(i),pl.Y(v)]),C.blue,2.6);
  out+=TF(455,316,'blue actual · green predicted',13,C.muted);
  return {svg:out,phase:s.mode==='perceive'?'The arm stays put; the brain revises its belief about where the arm is. Error gone, nothing moved.':s.mode==='act'?'The belief is held fixed and the muscles reduce the error by moving the arm until the prediction is true.':'Splitting the work changes both. In the theory, the precision (reliability) given to the senses decides which route wins.'};
 }});

/* =========================== embodied-cognition =========================== */
// A fly ball without air resistance: vx = vy = 20 m/s, g = 9.81 m/s².
const D8_G=9.81,D8_VX=20,D8_VY=20,D8_TF=2*D8_VY/D8_G,D8_RANGE=D8_VX*D8_TF;
const D8_ball=t=>[D8_VX*t,D8_VY*t-D8_G*t*t/2];
// Fielder who keeps the tangent of the gaze angle rising at a steady rate (optical acceleration cancellation).
function D8_fielder(start,run,t){if(!run)return start;const dt=.02,vmax=8;let x=start;for(let u=dt;u<=t+1e-9;u+=dt){const [bx,by]=D8_ball(u),target=bx+by/(D8_G/(2*D8_VX)*u);x+=clamp(target-x,-vmax*dt,vmax*dt)}return x}
SCENE({id:'embodied-cognition',name:'Catching without calculating',tag:'The outfielder problem',
 definition:'Embodied cognition holds that much of intelligence lies in the loop between body, eyes and world rather than in an internal model. A fielder can catch a fly ball without computing where it will land, by running so that the ball appears to rise at a steady rate.',
 example:'If the ball seems to rise faster and faster, it will land behind you: back up. If its rise slows, it will land in front: run in. Keep the rise steady and you arrive where it comes down.',
 desc:'A side view of a fly ball and a fielder with the line of gaze, beside a graph of the tangent of the gaze angle over time against a straight reference line.',
 research:'Chapman (1968). Catching a baseball. American Journal of Physics 36; McBeath, Shaffer & Kaiser (1995). How baseball outfielders determine where to run to catch fly balls. Science 268; Fink, Foo & Warren (2009) tested the rival optical strategies in virtual reality. No air resistance here.',
 dur:12,hint:'Stand the fielder at different spots and watch the optical curve bend. Then let the fielder run using the steady-rise rule.',
 init:()=>({stand:65,run:false}),
 watch(p){return {stand:65,run:p>=.5,t:+(((p*2)%1)*D8_TF).toFixed(3)}},
 ui:[{range:'stand',label:'Fielder starts at',min:50,max:100,step:1,get:s=>s.stand,act:'stand',show:v=>v+' m'},{choose:[[0,'Stand still'],[1,'Run, keeping the rise steady']],label:'Fielder',get:s=>s.run?1:0,act:'run'}],
 on:{stand(s,v){s.stand=Number(v)},run(s,v){s.run=Number(v)===1}},
 draw(s){
  const T_=s.t===undefined?D8_TF*.98:Math.min(s.t,D8_TF*.98),sx=v=>30+v*2.6,sy=v=>230-v*5.2;let out=heading(s.run?'Running to keep the ball rising steadily':'Standing still: how does the ball appear to rise?',26);
  out+=L(sx(0),sy(0),sx(110),sy(0),C.green,3);[0,25,50,75,100].forEach(v=>out+=TF(sx(v),sy(0)+18,v+' m',13,C.muted));
  const tr=[];for(let i=0;i<=60;i++){const [x,y]=D8_ball(i/60*D8_TF);tr.push([sx(x),sy(y)])}out+=D8_poly(tr,C.line,1.6,'stroke-dasharray="4 5"');
  out+=TF(sx(D8_RANGE),sy(0)+34,`lands ${D8_RANGE.toFixed(0)} m`,13,C.coral)+L(sx(D8_RANGE),sy(0)-6,sx(D8_RANGE),sy(0)+6,C.coral,2.5);
  const [bx,by]=D8_ball(T_),fx=D8_fielder(s.stand,s.run,T_);
  out+=L(sx(fx),sy(1.8),sx(bx),sy(by),C.amber,1.5,'stroke-dasharray="3 3"')+Ci(sx(bx),sy(by),6,'#fff',C.ink,'stroke-width="2"');
  out+=Ci(sx(fx),sy(1.6),5,C.blue)+L(sx(fx),sy(1.4),sx(fx),sy(0),C.blue,4);
  const p2=D8_plot(390,56,180,140,[0,D8_TF],[0,2.5],{xt:[[0,'0 s'],[2,'2'],[4,'4 s']],yl:'tan(gaze angle)'});out+=p2.svg;
  const ta=(t,x)=>{const [bx_,by_]=D8_ball(t),d=x-bx_;return d>.5?by_/d:2.6};const cv=[],ref=[];
  for(let i=1;i<=50;i++){const t=i/50*T_,x=D8_fielder(s.stand,s.run,t);cv.push([p2.X(t),p2.Y(clamp(ta(t,x),0,2.5))])}
  const c0=ta(.3,D8_fielder(s.stand,s.run,.3))/.3;ref.push([p2.X(0),p2.Y(0)],[p2.X(D8_TF),p2.Y(clamp(c0*D8_TF,0,2.5))]);
  out+=D8_poly(ref,C.grid,1.6,'stroke-dasharray="6 4"')+D8_poly(cv,C.amber,2.6);
  const miss=fx-D8_RANGE;out+=T(300,300,s.run?`The fielder ends ${Math.abs(miss)<1?'under the ball':Math.abs(miss).toFixed(0)+' m '+(miss>0?'behind':'short of')+' it'}, without ever computing the landing point`:miss>2?`Standing ${miss.toFixed(0)} m beyond the landing spot: the ball's apparent rise slows down`:miss<-2?`Standing ${(-miss).toFixed(0)} m short: the ball's apparent rise speeds up`:'Standing at the landing spot: the ball rises at a perfectly steady rate',15,C.ink);
  out+=TF(480,244,'dashed: steady rise',13,C.muted);
  return {svg:out,phase:s.run?'The rule needs no physics: speed up if the ball’s rise accelerates, slow down if it decelerates. It brings the fielder to the right place just in time.':'Only at the landing spot does the tangent of the gaze angle grow in a straight line. Any curvature tells the fielder which way to move.'};
 }});

// Think or rotate: deciding whether a piece fits a slot (after Kirsh & Maglio’s Tetris studies).
const D8_PIECES=[[[0,0],[0,1],[0,2],[1,2]],[[0,0],[1,0],[1,1],[2,1]],[[1,0],[2,0],[0,1],[1,1],[1,2]],[[0,0],[0,1],[1,1],[1,2],[1,3]]];
const D8_rot=c=>c.map(([x,y])=>[-y,x]),D8_mir=c=>c.map(([x,y])=>[-x,y]);
const D8_normC=c=>{const mx=Math.min(...c.map(p=>p[0])),my=Math.min(...c.map(p=>p[1]));return c.map(([x,y])=>[x-mx,y-my])};
function D8_turn(c,k){let o=c;for(let i=0;i<((k%4)+4)%4;i++)o=D8_rot(o);return D8_normC(o)}
const D8_OT=12;
function D8_oTrial(seed,i){const r=D8_rng(seed*31+i*7+1),cond=shuffled(range(D8_OT).map(k=>k%2?'rotate':'think'),D8_mix(seed+11))[i],pc=Math.floor(r()*4),fits=r()<.5,turn=1+Math.floor(r()*3);
 const base=D8_PIECES[pc],slot=D8_turn(fits?base:D8_mir(base),turn);return {cond,piece:base,slot,fits}}
const D8_cells=(c,x0,y0,u,fill,stroke)=>c.map(([x,y])=>R(x0+x*u,y0+y*u,u-2,u-2,fill,stroke,3)).join('');
SCENE({id:'embodied-cognition-offloading',name:'Thinking with your hands',tag:'Epistemic actions',
 definition:'An epistemic action changes the world to make thinking easier, rather than to get closer to a goal. Rotating a piece on screen to see whether it fits can be quicker and more reliable than rotating it in your head.',
 example:'Expert Tetris players rotate falling pieces more than they need to: the physical turns save mental rotation and reveal the answer sooner.',
 desc:'A puzzle piece and a slot outline; in some trials you may turn the piece with a button, in others you must decide in your head. A chart compares your response times and accuracy for the two conditions.',
 research:'Kirsh & Maglio (1994). On distinguishing epistemic from pragmatic action. Cognitive Science 18, 513–549; Clark & Chalmers (1998). The extended mind. Analysis 58; Risko & Gilbert (2016). Cognitive offloading. Trends in Cognitive Sciences 20.',
 dur:12,hint:'Press Start, then decide whether the piece fits the slot after turning (no flipping). In “rotate” trials you may turn it first. Twelve trials; nothing leaves this page.',
 init:()=>({seed:2,i:0,rot:0,t0:null,res:[]}),
 watch(p){const n=Math.min(D8_OT,Math.floor(p*(D8_OT+1))),r=D8_rng(9),res=[];for(let i=0;i<n;i++){const t=D8_oTrial(2,i);res.push({cond:t.cond,rt:t.cond==='think'?2.6+.6*D8_gauss(r):1.9+.4*D8_gauss(r),ok:r()<(t.cond==='think'?.82:.95)})}return {seed:2,i:n,rot:n%4,t0:1,res,sim:true}},
 ui:[{b:'Start trial',act:'start'},{b:'Turn the piece',act:'turn'},{b:'It fits',act:'ans',arg:1},{b:'It does not fit',act:'ans',arg:0},{b:'Start again',act:'again'}],
 on:{start(s){if(s.i<D8_OT){s.t0=performance.now();s.rot=0}},turn(s){if(s.t0!==null&&s.i<D8_OT&&D8_oTrial(s.seed,s.i).cond==='rotate')s.rot++},
  ans(s,v){if(s.t0===null||s.i>=D8_OT)return;const t=D8_oTrial(s.seed,s.i),rt=(performance.now()-s.t0)/1000;s.res.push({cond:t.cond,rt,ok:(Number(v)===1)===t.fits});s.i++;s.t0=null;s.rot=0},
  again(s){s.seed=nextSeed();s.i=0;s.res=[];s.t0=null;s.rot=0}},
 draw(s){
  let out=heading('Does the piece fit the slot after turning?',26);
  if(s.i<D8_OT){const t=D8_oTrial(s.seed,s.i),u=26;
   out+=TBF(150,64,t.cond==='rotate'?'You may turn the piece':'Decide in your head',14,t.cond==='rotate'?C.green:C.purple);
   if(s.t0!==null){out+=D8_cells(D8_turn(t.piece,s.rot),70,92,u,C.blue,'none')+D8_cells(t.slot,190,92,u,'#fff',C.ink);out+=TF(110,226,'piece',13,C.muted)+TF(230,226,'slot',13,C.muted)}
   else out+=T(150,150,'Press Start trial',15,C.muted);
   out+=TF(150,250,`trial ${s.i+1} of ${D8_OT}${t.cond==='rotate'&&s.rot?` · turned ${s.rot}×`:''}`,13,C.muted)}
  else out+=T(150,150,'All trials done',16,C.ink);
  const pl=D8_plot(360,60,200,200,[0,2],[0,5],{yt:[[0,'0'],[2.5,'2.5'],[5,'5 s']],yl:'mean time (correct trials)'});out+=pl.svg;
  [['think','in your head',C.purple],['rotate','turning allowed',C.green]].forEach(([c,l,col],i)=>{const v=s.res.filter(r=>r.cond===c),ok=v.filter(r=>r.ok),m=ok.length?D8_mean(ok.map(r=>r.rt)):null,x=pl.X(i+.5);
   if(m!==null)out+=R(x-26,pl.Y(Math.min(5,m)),52,pl.Y(0)-pl.Y(Math.min(5,m)),col,'none',3)+TBF(x,pl.Y(Math.min(5,m))-6,m.toFixed(2)+' s',13,C.ink);
   out+=TF(x,282,l,13,col)+TF(x,302,v.length?`${ok.length}/${v.length} correct`:'no trials yet',13,C.muted)});
  out+=T(300,350,s.sim?'Simulated participant: turning on screen is quicker and more accurate':'Your own data: compare the two bars once you have a few trials of each',14,C.ink);
  return {svg:out,phase:'Turning the piece off-loads mental rotation onto the screen. Kirsh and Maglio argued such epistemic actions are part of thinking, not just a way of acting on its results.'};
 }});

// Embodiment claims and what happened when they were tested again.
const D8_CLAIMS=[
 {c:'Pen in the teeth makes cartoons funnier',o:'Strack, Martin & Stepper 1988',f:'17 labs found no pen effect (2016); posed smiles had small effects (2022)',st:'mixed'},
 {c:'Holding a warm cup makes people seem warmer',o:'Williams & Bargh 2008',f:'Larger replications found no effect (Lynott et al. 2014)',st:'failed'},
 {c:'Power poses raise testosterone',o:'Carney, Cuddy & Yap 2010',f:'No hormone change in a larger study (Ranehill et al. 2015)',st:'failed'},
 {c:'Hills look steeper with a heavy backpack',o:'Bhalla & Proffitt 1999',f:'Shrank when people could not guess the aim (Durgin et al. 2009)',st:'contested'},
 {c:'Fielders run to keep the ball rising steadily',o:'Chapman 1968; McBeath et al. 1995',f:'Supported in field and VR tests; debate over which optical cue',st:'supported'},
 {c:'People offload thinking onto the world',o:'Kirsh & Maglio 1994',f:'Widely replicated (review: Risko & Gilbert 2016)',st:'supported'}];
const D8_ST={supported:[C.greenp,C.green,'supported'],mixed:[C.amberp,C.amber,'mixed'],contested:[C.amberp,C.amber,'contested'],failed:[C.coralp,C.coral,'did not replicate']};
SCENE({id:'embodied-cognition-replication',name:'Bodies, minds and replication',tag:'Which claims held up?',
 definition:'Embodied cognition includes strong, well-tested ideas about action and perception, and also some eye-catching claims that the body primes judgements. Several of the second kind failed when large, preregistered replications tested them.',
 example:'“Power posing raises testosterone” spread widely after 2010, but a larger study found no hormone change and its first author later said she no longer believed the effect.',
 desc:'Six cards, each with an embodiment claim and its original study; pressing a card reveals what later replications found, colour-coded supported, mixed, contested or failed.',
 research:'Wagenmakers et al. (2016). Registered replication report: Strack, Martin & Stepper (1988). Perspectives on Psychological Science 11; Coles et al. (2022). Many Smiles. Nature Human Behaviour 6; Lynott et al. (2014) Social Psychology 45; Ranehill et al. (2015) Psychological Science 26; Durgin et al. (2009) Psychonomic Bulletin & Review 16.',
 dur:12,hint:'Press each card to reveal what happened when the claim was tested again.',
 init:()=>({open:[]}),
 watch(p){return {open:range(Math.min(6,Math.floor(p*7)))}},
 ui:[{b:'Reveal all',act:'all'},{b:'Hide all',act:'none'}],
 on:{card(s,i){i=Number(i);s.open=s.open.includes(i)?s.open.filter(j=>j!==i):s.open.concat(i)},all(s){s.open=range(6)},none(s){s.open=[]}},
 draw(s,f,X){
  let out=heading('Embodiment claims, before and after replication',26);
  const wrap=(t,n)=>{const w=t.split(' '),ls=[];let l='';w.forEach(x=>{if((l+' '+x).trim().length>n){ls.push(l);l=x}else l=(l+' '+x).trim()});if(l)ls.push(l);return ls};
  D8_CLAIMS.forEach((k,i)=>{const col=i%2,row=Math.floor(i/2),x=22+col*284,y=46+row*108,open=s.open.includes(i),st=D8_ST[k.st];
   let inner=R(x,y,272,100,open?st[0]:'#fff',open?st[1]:C.line,8,'stroke-width="1.6"');
   wrap(k.c,38).slice(0,2).forEach((l,j)=>inner+=TBF(x+12,y+20+j*17,l,13,C.ink,'start'));
   if(open){inner+=D8_pill(x+12,y+60,st[2],'#fff',st[1]);wrap(k.f,40).slice(0,2).forEach((l,j)=>inner+=TF(x+12,y+79+j*15,l,13,C.ink,'start'))}
   else inner+=TF(x+12,y+62,k.o,13,C.muted,'start')+TF(x+12,y+84,'press to see the follow-up',13,C.blue,'start');
   out+=hit(X,'card',i,`${k.c}. ${open?st[2]+': '+k.f:'Press to reveal the follow-up.'}`,inner)});
  return {svg:out,phase:'The pattern: claims about perception guiding action held up; small, surprising priming effects of the body on judgement often did not.'};
 }});

/* =========================== consciousness =========================== */
// Backward masking: a digit flashed briefly, then a mask after a variable onset asynchrony (SOA).
const D8_SOAS=[17,33,50,83,133],D8_MREP=3,D8_MN=D8_SOAS.length*D8_MREP,D8_DIG=[2,3,4,5,6,7,8,9];
function D8_mTrial(seed,i){const order=shuffled(range(D8_MN).map(k=>D8_SOAS[k%D8_SOAS.length]),D8_mix(seed+21)),r=D8_rng(seed*53+i*11+3);return {soa:order[i],digit:D8_DIG[Math.floor(r()*8)]}}
// Approximate shape of objective performance in Del Cul et al. (2007): chance at the shortest SOA, a steep rise near 50 ms.
const D8_mCurve=soa=>.125+.825/(1+Math.exp(-(soa-48)/9));
const D8_mask=(x,y)=>{let o='';for(let i=0;i<6;i++)for(let j=0;j<4;j++)o+=TBF(x-50+i*20,y-18+j*14,'#',18,C.ink);return o};
SCENE({id:'consciousness',name:'Seeing and not seeing',tag:'Backward masking',
 definition:'In backward masking a briefly flashed target is followed by a pattern that hides it. Below a certain delay people say they saw nothing; above it the target suddenly becomes visible. That sharp threshold is used to compare conscious and unconscious processing.',
 example:'A digit shown for one screen frame and masked 17 ms later is usually invisible; masked 100 ms later it is clearly seen. Del Cul and colleagues found a non-linear jump in visibility near 50 ms.',
 desc:'A screen showing the target, a blank and the mask in turn, and a chart of your accuracy at each delay beside an approximate curve from the published study.',
 research:'Del Cul, Baillet & Dehaene (2007). Brain dynamics underlying the nonlinear threshold for access to consciousness. PLoS Biology 5(10), e260; Breitmeyer & Öğmen (2006). Visual Masking. Oxford University Press. Browser display timing is approximate (one frame is about 17 ms).',
 dur:12,hint:'Press Flash, then name the digit, guessing if you saw nothing. Fifteen trials at five delays. Display timing in a browser is approximate; nothing leaves this page.',
 init:()=>({seed:4,i:0,ph:'idle',res:[]}),
 watch(p){const n=Math.min(D8_MN,Math.floor(p*(D8_MN+1))),r=D8_rng(13),res=[];for(let i=0;i<n;i++){const t=D8_mTrial(4,i);res.push({soa:t.soa,ok:r()<D8_mCurve(t.soa)})}const ph=['target','blank','mask','ask'][Math.floor(p*60)%4];return {seed:4,i:Math.min(n,D8_MN-1),ph,res,sim:true}},
 ui:[{b:'Flash',act:'go'},{b:'Start again',act:'again'}],
 on:{go(s,a,ctx){if(s.i>=D8_MN||s.ph!=='idle'&&s.ph!=='ask')return;const t=D8_mTrial(s.seed,s.i);s.ph='target';ctx.later(17,'ph','blank');ctx.later(t.soa,'ph','mask');ctx.later(t.soa+250,'ph','ask')},
  ph(s,v){s.ph=v},ans(s,v){if(s.ph!=='ask'||s.i>=D8_MN)return;const t=D8_mTrial(s.seed,s.i);s.res.push({soa:t.soa,ok:Number(v)===t.digit});s.i++;s.ph='idle'},
  again(s){s.seed=nextSeed();s.i=0;s.res=[];s.ph='idle'}},
 draw(s,f,X){
  let out=heading('Name the flashed digit',26);const cx=150,cy=120;
  out+=R(cx-90,cy-60,180,120,'#f6f9fb',C.line,6);
  const t=s.i<D8_MN?D8_mTrial(s.seed,s.i):null;
  if(s.ph==='target'&&t)out+=TBF(cx,cy+14,String(t.digit),40,C.ink);
  else if(s.ph==='mask')out+=D8_mask(cx,cy);
  else if(s.ph==='ask')out+=TF(cx,cy+5,'Which digit was it?',14,C.ink);
  else out+=Ci(cx,cy,3,C.muted)+TF(cx,cy+30,s.i>=D8_MN?'all trials done':'look at the dot, then Flash',13,C.muted);
  if(s.ph==='ask'&&!s.sim)D8_DIG.forEach((d,k)=>{const x=cx-105+(k%4)*70,y=210+Math.floor(k/4)*42;out+=hit(X,'ans',d,'Digit '+d,R(x-0,y,58,34,'#fff',C.blue,6)+TBF(x+29,y+23,String(d),16,C.blue))});
  else{const y=212;[['digit','17 ms'],['blank','to SOA'],['mask','250 ms']].forEach(([l,d],k)=>{const x=40+k*76;out+=R(x,y,68,30,['target','blank','mask'][k]===s.ph?C.pale:'#fff',C.line,4)+TF(x+34,y+20,l,13,C.ink)+TF(x+34,y+48,d,13,C.muted)})}
  const pl=D8_plot(340,60,230,210,[0,150],[0,1],{xt:[[17,'17'],[50,'50'],[83,'83'],[133,'133']],yt:[[0,'0'],[.125,'chance'],[.5,'0.5'],[1,'1']],xl:'delay to mask (ms)',yl:'proportion correct'});out+=pl.svg;
  const cv=[];for(let v=0;v<=150;v+=3)cv.push([pl.X(v),pl.Y(D8_mCurve(v))]);out+=D8_poly(cv,C.green,2.2,'stroke-dasharray="6 4"');
  D8_SOAS.forEach(soa=>{const v=s.res.filter(r=>r.soa===soa);if(v.length){const m=v.filter(r=>r.ok).length/v.length;out+=Ci(pl.X(soa),pl.Y(m),6,C.coral,'#fff')+TF(pl.X(soa),pl.Y(m)-11,`${v.filter(r=>r.ok).length}/${v.length}`,13,C.muted)}});
  out+=TF(455,330,`dots: ${s.sim?'simulated':'your'} accuracy`,13,C.muted)+TF(455,348,'dashed: approximate published curve',13,C.muted);
  out+=TF(150,350,`trial ${Math.min(s.i+1,D8_MN)} of ${D8_MN}`,13,C.muted);
  return {svg:out,phase:'Short delays leave the digit unseen and answers near chance; around 50 ms performance jumps. Dehaene’s group linked this jump to a late, all-or-none “ignition” of activity across the brain.'};
 }});

// Global workspace toy: a local signal grows linearly; workspace activity ignites past a threshold.
const D8_ign=(x,att)=>1/(1+Math.exp(-(x*att-.5)*18));
SCENE({id:'consciousness-workspace',name:'The global workspace',tag:'Ignition and broadcast',
 definition:'Global workspace theory says that many specialised processes run unconsciously in parallel; a content becomes conscious when it wins access to a shared workspace and is broadcast to all of them at once. In the brain this shows up as a sudden, sustained “ignition” across frontal and parietal areas.',
 example:'A faint word activates visual areas a little whether or not you see it; only when it is seen does activity jump across the brain and become available for speech, memory and planning.',
 desc:'Five specialised processors around a central workspace, lit by a stimulus whose strength you set, beside a chart of local activity rising steadily and workspace activity jumping at a threshold.',
 research:'Baars (1988). A Cognitive Theory of Consciousness. Cambridge University Press; Dehaene, Kerszberg & Changeux (1998). PNAS 95; Dehaene & Naccache (2001). Cognition 79. An adversarial test against integrated information theory (Cogitate Consortium 2025, Nature) gave mixed results for both.',
 dur:11,hint:'Raise the stimulus strength slowly and find the point where the workspace ignites. Then withdraw attention and try again.',
 init:()=>({x:.4,att:1}),
 watch(p){return {x:+(p).toFixed(2),att:1}},
 ui:[{range:'x',label:'Stimulus strength',min:0,max:1,step:.01,get:s=>s.x,act:'x',show:v=>Number(v).toFixed(2)},{choose:[[1,'Attended'],[.7,'Attention elsewhere']],label:'Attention',get:s=>s.att,act:'att'}],
 on:{x(s,v){s.x=Number(v)},att(s,v){s.att=Number(v)}},
 draw(s){
  const g=D8_ign(s.x,s.att),loc=s.x;let out=heading(g>.5?'Ignition: the content is broadcast to every processor':'Local processing only: no global broadcast',26);
  const cx=160,cy=200,names=['vision','memory','language','planning','motor'];
  names.forEach((nm,i)=>{const a=-Math.PI/2+i*2*Math.PI/5,x=cx+Math.cos(a)*112,y=cy+Math.sin(a)*112,act=i===0?Math.max(loc,g):g;
   out+=L(cx,cy,x,y,g>.5?C.coral:C.line,g>.5?3:1.4,g>.5?'':'stroke-dasharray="4 4"');
   out+=Ci(x,y,30,tint(C.blue,1-act*.85),C.blue,'stroke-width="1.6"')+TF(x,y+4,nm,13,act>.55?'#fff':C.ink)});
  out+=Ci(cx,cy,40,tint(C.coral,1-g*.85),C.coral,'stroke-width="2"')+TBF(cx,cy-2,'work-',13,g>.55?'#fff':C.ink)+TBF(cx,cy+14,'space',13,g>.55?'#fff':C.ink);
  const pl=D8_plot(340,70,230,200,[0,1],[0,1],{xt:[[0,'0'],[.5,'0.5'],[1,'1']],yt:[[0,'0'],[1,'max']],xl:'stimulus strength',yl:'activity'});out+=pl.svg;
  const lc=[],gc=[];for(let i=0;i<=100;i++){const v=i/100;lc.push([pl.X(v),pl.Y(v)]);gc.push([pl.X(v),pl.Y(D8_ign(v,s.att))])}
  out+=D8_poly(lc,C.blue,2.2,'stroke-dasharray="6 4"')+D8_poly(gc,C.coral,2.8);
  out+=L(pl.X(s.x),70,pl.X(s.x),270,C.ink,1.2)+Ci(pl.X(s.x),pl.Y(g),6,C.coral,'#fff')+Ci(pl.X(s.x),pl.Y(loc),5,C.blue,'#fff');
  out+=TF(560,236,'workspace',13,C.coral,'end')+TF(560,254,'visual area',13,C.blue,'end');
  out+=T(300,360,`threshold at strength ${(.5/s.att).toFixed(2)}${s.att<1?' (raised: attention is elsewhere)':''}`,15,C.ink);
  return {svg:out,phase:g>.5?'Past the threshold the workspace switches on as a whole and the content becomes available to every system: reportable, memorable, usable.':'Below threshold the visual area still responds in proportion to the stimulus; this unconscious processing can still influence behaviour, as priming studies show.'};
 }});

// Blindsight: forced-choice localisation in the blind field (a simulated patient; numbers illustrative).
const D8_BS={blind:{seen:.05,hit:.8},intact:{seen:.98,hit:.98}};
function D8_bsRun(seed,n,field){const r=D8_rng(seed*7+(field==='blind'?1:2)),o=[];for(let i=0;i<n;i++){const up=r()<.5,seen=r()<D8_BS[field].seen,ok=r()<D8_BS[field].hit;o.push({up,seen,ok})}return o}
SCENE({id:'consciousness-blindsight',name:'Blindsight',tag:'Guessing better than chance',
 definition:'Blindsight: after damage to the primary visual cortex, some patients say they see nothing in part of their visual field, yet when made to guess where a light was, they point to it far more often than chance.',
 example:'Patient D.B. denied seeing lights in his blind field but, told to guess, located them and reported their orientation well above chance.',
 desc:'A simulated patient’s visual field with a blind half, a light flashed in it, and bars comparing how often the patient reports seeing the light with how often their forced guesses are correct.',
 research:'Pöppel, Held & Frost (1973). Residual visual function after brain wounds involving the central visual pathways in man. Nature 243; Weiskrantz, Warrington, Sanders & Marshall (1974). Brain 97, 709–728. Overgaard (2011) argues some patients have degraded awareness rather than none. Simulated patient; numbers illustrative.',
 dur:10,hint:'Choose the blind or intact half of the field and run ten trials. Compare “I saw it” with correct guesses; chance is 50%.',
 init:()=>({field:'blind',n:0,seed:1}),
 watch(p){return {field:p<.6?'blind':'intact',n:Math.min(20,Math.floor(((p<.6?p/.6:(p-.6)/.4))*21)),seed:1}},
 ui:[{choose:[['blind','Blind half'],['intact','Intact half']],label:'Light in',get:s=>s.field,act:'field'},{b:'Run 10 trials',act:'run'},{b:'Clear',act:'clear'}],
 on:{field(s,v){s.field=v;s.n=0},run(s){s.n=Math.min(40,s.n+10)},clear(s){s.n=0;s.seed=nextSeed()}},
 draw(s){
  const tr=D8_bsRun(s.seed,s.n,s.field),last=tr[tr.length-1];let out=heading(`Light flashed in the ${s.field} half of the field`,26);
  const cx=150,cy=180,r=100;out+=Ci(cx,cy,r,'#fff',C.line);
  out+=`<path d="M${cx} ${cy-r}A${r} ${r} 0 0 0 ${cx} ${cy+r}Z" fill="${C.dark}" opacity=".85"/>`+TF(cx-50,cy+4,'blind',13,'#fff')+TF(cx+50,cy+4,'intact',13,C.muted);
  out+=L(cx-6,cy,cx+6,cy,C.coral,2)+L(cx,cy-6,cx,cy+6,C.coral,2);
  if(last){const lx=s.field==='blind'?cx-48:cx+48,ly=last.up?cy-50:cy+50;out+=Ci(lx,ly,9,'#ffd24a',C.ink);out+=TF(cx,cy+r+22,`last trial: “${last.seen?'I saw it':'I saw nothing'}”, guessed ${last.ok?(last.up?'up':'down'):(last.up?'down':'up')} (${last.ok?'right':'wrong'})`,13,C.ink)}
  const pl=D8_plot(340,70,230,200,[0,2],[0,1],{yt:[[0,'0%'],[.5,'50%'],[1,'100%']],yl:`${s.n} trials`});out+=pl.svg;
  out+=L(340,pl.Y(.5),570,pl.Y(.5),C.muted,1.4,'stroke-dasharray="5 4"')+TF(566,pl.Y(.5)-6,'chance (guesses)',13,C.muted,'end');
  const seen=tr.length?tr.filter(t=>t.seen).length/tr.length:0,ok=tr.length?tr.filter(t=>t.ok).length/tr.length:0;
  [[seen,'says “saw it”',C.purple],[ok,'guess correct',C.green]].forEach(([v,l,c],i)=>{const x=pl.X(i+.5);if(tr.length)out+=R(x-28,pl.Y(v),56,pl.Y(0)-pl.Y(v),c,'none',3)+TBF(x,pl.Y(v)-6,Math.round(v*100)+'%',13,C.ink);out+=TF(x,292,l,13,c)});
  out+=T(300,350,s.n?(s.field==='blind'?'Reports say “nothing”, yet guesses are well above chance':'In the intact field, seeing and guessing go together'):'Run some trials',15,C.ink);
  return {svg:out,phase:s.field==='blind'?'Visual information still reaches the brain by routes that bypass the damaged cortex, and it guides guesses without, the patient says, any visual experience.':'In healthy vision, being able to locate the light and reporting that you saw it go together, which is why blindsight is so striking.'};
 }});
