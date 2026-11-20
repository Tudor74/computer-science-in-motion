/* ===================== Levin Lab In Motion · Era 6 · Xenobots ===================== */
// Living machines built from frog cells, and later from human airway cells. Every picture is a pure function of
// state, frame and X. Every distance, fitness, count and fraction on screen is computed here by a toy model written
// for this course: a toy voxel crawler (a 2D body of passive and contracting squares that grips the ground), an
// evolutionary search over such bodies, a toy swimmer moved by cilia, a toy arena where swimmers push loose cells
// into piles, and a toy scratch that closes. The only literals shown as facts are published values (dates, sizes,
// counts reported in the papers), and each carries a research line. Toy parameters are model choices, labelled.

/* ---- shared helpers ---- */
const L6_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const L6_rng=n=>rng(L6_mix(n));
function L6_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const L6_n=(v,d=1)=>{const r=Math.round(v*Math.pow(10,d))/Math.pow(10,d);return (r<0?'−':'')+Math.abs(r).toFixed(d)};
const L6_pct=v=>Math.round(v*100)+'%';
const L6_note=(s,y=370)=>TF(300,y,s,13,C.muted);
const L6_poly=(pts,col,w=2.2,extra='')=>pts.length>1?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function L6_tile(x,y,w,label,value,col=C.blue){return R(x,y,w,46,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+38,value,15,col)}
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function L6_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// The six evidence labels, each with its own colour pair. The badge is drawn beside the claim it applies to.
const L6_LABELS={rep:['Replicated finding',C.green,C.greenp],single:['Single-lab finding',C.blue,C.pale],frame:['Framework or hypothesis',C.purple,C.purplep],
 spec:['Speculation',C.amber,C.amberp],debate:['Criticism and debate',C.coral,C.coralp],model:['Simplified model',C.dark,'#eef2f4']};
const L6_badgeW=k=>Math.round(L6_LABELS[k][0].length*7.1+18);
function L6_badge(x,y,k,anchor='start'){const [lab,ink,fill]=L6_LABELS[k],w=L6_badgeW(k),x0=anchor==='end'?x-w:anchor==='middle'?x-w/2:x;
 return R(x0,y,w,20,fill,ink,10,k==='model'?'stroke-dasharray="4 3" stroke-width="1.4"':'stroke-width="1.4"')+TBF(x0+w/2,y+14.5,lab,12.5,ink)}
function L6_badges(x,y,keys){let out='',cx=x;for(const k of keys){out+=L6_badge(cx,y,k);cx+=L6_badgeW(k)+8}return out}
// Wrap a sentence into lines of at most n characters (for fixed-size text in boxes).
function L6_wrap(s,n){const words=String(s).split(' '),lines=[];let cur='';for(const w of words){if((cur+' '+w).trim().length>n&&cur){lines.push(cur);cur=w}else cur=(cur+' '+w).trim()}if(cur)lines.push(cur);return lines}
function L6_para(x,y,s,n,size=13,col=C.ink,anchor='start',lh=17){return L6_wrap(s,n).map((l,i)=>TF(x,y+i*lh,l,size,col,anchor)).join('')}
const L6_memo=new Map();
function L6_cache(key,fn){if(!L6_memo.has(key)){if(L6_memo.size>400)L6_memo.clear();L6_memo.set(key,fn())}return L6_memo.get(key)}

/* ---- The toy voxel crawler (written for this course; not the paper's simulator) ----
 A body is a side view: L6_W columns by L6_H rows of squares, each empty (0), passive "skin" (1) or contracting
 "heart muscle" (2). Only the largest connected piece counts. Neighbouring columns are joined by links whose length
 shrinks while the muscle squares on either side contract. Columns whose bottom square touches the ground grip it
 with a weight equal to the column's load; in this toy, a column's muscle squares press harder while contracting and
 lighter while relaxing (the one rule that breaks the symmetry between the two half-cycles). In each half-cycle the
 body slides by the amount that costs the least friction: the weighted median of the columns' own shifts. Inertia,
 fluid, 3D shape, tumbling and cell biology are all left out. */
const L6_W=7,L6_H=4,L6_AMP=.3,L6_GRIP=[2.5,.4],L6_CYC=10;
function L6_component(b){const seen=new Array(b.length).fill(0);let best=[];
 for(let i=0;i<b.length;i++){if(!b[i]||seen[i])continue;const comp=[],st=[i];seen[i]=1;
  while(st.length){const k=st.pop();comp.push(k);const x=k%L6_W,y=(k/L6_W)|0;
   for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=L6_W||yy>=L6_H)continue;const j=yy*L6_W+xx;if(b[j]&&!seen[j]){seen[j]=1;st.push(j)}}}
  if(comp.length>best.length)best=comp}
 const m=new Array(b.length).fill(0);best.forEach(k=>m[k]=1);return m}
function L6_wmed(vals,w){const idx=vals.map((v,i)=>i).filter(i=>w[i]>0).sort((a,b)=>vals[a]-vals[b]);if(!idx.length)return 0;
 const tot=idx.reduce((a,i)=>a+w[i],0);let c=0;for(let n=0;n<idx.length;n++){c+=w[idx[n]];if(Math.abs(c-tot/2)<1e-9)return (vals[idx[n]]+vals[idx[n+1]])/2;if(c>tot/2)return vals[idx[n]]}return vals[idx[idx.length-1]]}
// amp: optional per-square contraction strength (1 = nominal). Returns per-cycle displacement and the pieces used to draw it.
function L6_gait(b,amp){
 const keep=L6_component(b),cols=[];
 for(let c=0;c<L6_W;c++){let m=0,k=0,contact=0;for(let r=0;r<L6_H;r++){const i=r*L6_W+c;if(!keep[i])continue;m++;if(b[i]===2)k+=amp?amp[i]:1;if(r===L6_H-1)contact=1}cols.push({c,m,k,contact})}
 const span=cols.filter(q=>q.m>0);if(span.length<1)return {d:0,cols,span,shift:[],keep,grip:0};
 // shift of each column at full contraction, relative to the first column of the span
 const shift=[0];for(let j=1;j<span.length;j++){const a=(span[j-1].k+span[j].k)/(2*L6_H);shift.push(shift[j-1]-L6_AMP*a*(span[j].c-span[j-1].c))}
 const wc=span.map(q=>q.contact*((q.m-q.k)+L6_GRIP[0]*q.k)),wr=span.map(q=>q.contact*((q.m-q.k)+L6_GRIP[1]*q.k));
 const grip=wc.reduce((a,v)=>a+v,0);if(!grip)return {d:0,cols,span,shift,keep,grip:0,x1:0,x2:0};
 const x1=L6_wmed(shift.map(v=>-v),wc),x2=L6_wmed(shift,wr);
 return {d:x1+x2,x1,x2,cols,span,shift,keep,grip};
}
const L6_dist=(b,amp)=>L6_gait(b,amp).d*L6_CYC;   // distance in square-widths over ten cycles (signed: + is rightwards)
// A built copy: each square may go missing or change type, and each muscle square's strength varies.
function L6_build(b,noise,seed){const r=L6_rng(seed),nb=b.slice(),amp=b.map(()=>1);
 for(let i=0;i<b.length;i++){if(!b[i])continue;const u=r();if(u<noise*.5)nb[i]=0;else if(u<noise)nb[i]=3-b[i];amp[i]=Math.max(0,1+noise*1.5*L6_gauss(r))}
 return {b:nb,amp}}
function L6_builtRuns(b,noise,n=20,seed=1){const out=[];for(let k=0;k<n;k++){const q=L6_build(b,noise,seed*1000+k);out.push(L6_dist(q.b,q.amp))}return out}
function L6_randBody(r,fill=.7){const b=[];for(let i=0;i<L6_W*L6_H;i++){const u=r();b.push(u<1-fill?0:u<1-fill/2?1:2)}for(let c=0;c<L6_W;c++)if(r()<.8)b[(L6_H-1)*L6_W+c]=b[(L6_H-1)*L6_W+c]||1;return b}
function L6_mutate(b,r,rate){return b.map(v=>r()<rate?Math.floor(r()*3):v)}
// Evolution: population 16; the best 4 are kept and the rest are mutated copies of them. Fitness is the distance
// moved in ten cycles (either way); with `robust`, it is the average over 4 noisy builds instead.
const L6_POP=16,L6_KEEP=4;
function L6_fit(b,robust,noise,g){if(!robust)return Math.abs(L6_dist(b));let s=0;for(let k=0;k<4;k++){const q=L6_build(b,noise,g*7919+k*31+1);s+=L6_dist(q.b,q.amp)}return Math.abs(s/4)}
function L6_evolve(seed,gens,rate,robust=false,noise=.15){return L6_cache(`ev${seed},${gens},${rate},${robust},${noise}`,()=>{
 const r=L6_rng(seed);let pop=range(L6_POP).map(()=>L6_randBody(r));const hist=[];
 for(let g=0;g<=gens;g++){
  const scored=pop.map(b=>({b,f:L6_fit(b,robust,noise,g)})).sort((a,c)=>c.f-a.f);
  hist.push({best:scored[0].f,mean:scored.reduce((a,q)=>a+q.f,0)/scored.length,body:scored[0].b,all:scored.map(q=>q.f)});
  const elite=scored.slice(0,L6_KEEP).map(q=>q.b);
  pop=elite.concat(range(L6_POP-L6_KEEP).map(i=>L6_mutate(elite[i%L6_KEEP],r,rate)));
 }
 return hist})}
// Draw a body at (x0,y0) with square size sz; dx shifts every column (for animation); squeeze in [0,1] is the contraction.
function L6_drawBody(b,x0,y0,sz,o={}){const g=o.gait||L6_gait(b,o.amp),u=o.squeeze||0,ox=o.dx||0;let out='';
 const off=o.grid?0:(g.span[0]?g.span[0].c:0),colX={};g.span.forEach((q,j)=>colX[q.c]=x0+ox+(q.c-off)*sz+(g.shift[j]||0)*sz*u);
 for(let r=0;r<L6_H;r++)for(let c=0;c<L6_W;c++){const i=r*L6_W+c;if(!b[i])continue;const on=g.keep[i],x=on&&colX[c]!==undefined?colX[c]:x0+ox+(c-off)*sz,y=y0+r*sz;
  const fill=b[i]===2?C.coral:C.greenp,st=b[i]===2?C.coral:C.green;
  const inner=R(x+1,y+1,sz-2,sz-2,on?fill:'#fff',on?st:C.line,3,on?'':'stroke-dasharray="3 3"')+(b[i]===2&&on?L(x+sz*.3,y+sz/2,x+sz*.7,y+sz/2,'#fff',2):'');
  out+=o.act?hit(o.X,o.act,i,`Square ${c+1},${r+1}: ${['empty','skin','muscle'][b[i]]}. Press to change.`,inner):inner}
 if(o.act)for(let r=0;r<L6_H;r++)for(let c=0;c<L6_W;c++){const i=r*L6_W+c;if(b[i])continue;const x=x0+c*sz,y=y0+r*sz;out+=hit(o.X,o.act,i,`Square ${c+1},${r+1}: empty. Press to add skin.`,R(x+1,y+1,sz-2,sz-2,'#fff',C.grid,3,'stroke-dasharray="2 3"'))}
 return out}
const L6_ground=(x0,x1,y)=>L(x0,y,x1,y,C.dark,2.5)+range(Math.floor((x1-x0)/14)).map(i=>L(x0+i*14+4,y+2,x0+i*14-2,y+9,C.line,1.2)).join('');
function L6_legend(x,y){return R(x,y,14,14,C.greenp,C.green,3)+TF(x+20,y+12,'skin (passive)',13,C.ink,'start')+R(x+130,y,14,14,C.coral,C.coral,3)+TF(x+150,y+12,'heart muscle (contracts)',13,C.ink,'start')}
// The position of a body after t cycles (t may be fractional): the contraction half moves it by x1, the relaxation half by x2.
function L6_at(g,t){const n=Math.floor(t),f=t-n,base=n*g.d;if(f<.5){const u=smooth(f*2);return {dx:base+g.x1*u,squeeze:u}}const u=smooth((f-.5)*2);return {dx:base+g.x1+g.x2*u,squeeze:1-u}}
const L6_DEMO=()=>L6_evolve(1,30,.1)[30].body;
const L6_sgn=v=>v>1e-9?'rightwards':v<-1e-9?'leftwards':'nowhere';

/* ===================== Lesson: computer-designed ===================== */
const L6_PIPE=[
 {k:'goal',s:'Goal',t:'Goal and parts',say:'The search starts from a goal (here: move as far as possible across a surface) and two kinds of building block: passive cubes standing for frog skin and contracting cubes standing for heart muscle.'},
 {k:'search',s:'Evolve',t:'Evolve in simulation',say:'An evolutionary algorithm makes random bodies, scores each in a physics simulator for how far it moves, keeps the best and varies them, many generations over. The plot is this course’s toy search, not the paper’s.'},
 {k:'filter',s:'Filter',t:'Keep robust designs',say:'A design that works only in a perfect simulation is unlikely to work in a dish, so designs were tested again with random changes and the more robust ones were favoured. The dots are the toy design’s distance in noisy re-runs.'},
 {k:'build',s:'Build',t:'Build from frog cells',say:'Douglas Blackiston built the chosen design by hand from cells taken from early frog (Xenopus laevis) embryos: cells destined to become skin and heart muscle were combined and then shaped with microsurgery tools.'},
 {k:'test',s:'Test',t:'Test in a dish',say:'The built organisms, each under a millimetre across, moved in a dish as the heart-muscle cells contracted; the authors report that their direction of movement matched the direction the simulation predicted.'}];
function L6_pipeFrames(s){return L6_PIPE.map((q,i)=>({i,...q}))}
SCENE({id:'computer-designed',name:'From simulation to dish',tag:'Single-lab finding · Kriegman, Blackiston, Levin & Bongard, 2020',
 definition:'In January 2020 Sam Kriegman and Josh Bongard (University of Vermont), with Douglas Blackiston and Michael Levin (Tufts University), described a pipeline for designing what they called reconfigurable organisms. A computer searched for body shapes in a physics simulation; the best designs were then built by hand from frog cells, and moved. The name xenobot joins Xenopus, the frog, to robot. This is one collaboration’s result, published in PNAS and not repeated by an independent group.',
 example:'The cells were not genetically modified. The design gave the body’s shape and where the heart-muscle cells went; the cells themselves supplied the contractions. The authors report that the built organisms moved in the direction the simulation predicted.',
 desc:'A five-step pipeline (goal, evolve, filter, build, test) along the top, with a picture for the current step below: building blocks, a toy fitness curve, noisy re-runs, a cell cluster being shaped, and a dish with a track.',
 research:['Kriegman, Blackiston, Levin & Bongard (2020). A scalable pipeline for designing reconfigurable organisms. PNAS 117(4), 1853–1859.','University of Vermont news release (13 January 2020), “Team builds the first living robots”: sizes of 650–750 microns.','The plot and dots are this course’s toy model, not the paper’s simulator (Voxelyze; Hiller & Lipson 2014).'],
 dur:14,hint:'Step through the pipeline. Press “Run another search” to see the toy search find a different design.',
 init:()=>({seed:1}),
 trace:s=>L6_pipeFrames(s),
 ui:[{b:'Run another search',act:'seed'}],
 on:{seed(s){s.seed=s.seed%6+1;return 'keep'}},
 draw(s,f,X){
  const u=X?X.u:1;let out=heading(f.t);
  L6_PIPE.forEach((q,i)=>{const x=14+i*116,on=i===f.i,done=i<f.i;out+=R(x,48,106,40,on?C.blue:done?C.pale:'#fff',on?C.blue:C.line,8)+TF(x+53,73,q.s,13,on?'#fff':C.ink);if(i<4)out+=arrow(x+106,68,x+116,68,C.line,2,5)});
  const h=L6_evolve(s.seed,30,.1),best=h[30].body,g=L6_gait(best);
  if(f.k==='goal'){out+=L6_legend(150,120);const demo=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,0,0,0,0,1,1,2,2,0,0];out+=L6_drawBody(demo,240,170,30)+L6_ground(150,450,290);
   out+=TF(300,318,'Goal: the largest distance moved across the surface.',13,C.ink)+L6_badge(300,330,'model','middle')}
  if(f.k==='search'){const pl=L6_plot(90,118,270,170,[0,30],[0,Math.ceil(h[30].best+1)],{xt:[[0,'0'],[10,'10'],[20,'20'],[30,'30']],yt:[[0,'0'],[Math.ceil(h[30].best+1),fmt(Math.ceil(h[30].best+1))]],xl:'generation',yl:'best distance (squares, 10 cycles)'});
   const k=Math.round(30*u);out+=pl.svg+L6_poly(h.slice(0,k+1).map((q,i)=>[pl.X(i),pl.Y(q.best)]),C.blue,2.5)+Ci(pl.X(k),pl.Y(h[k].best),5,C.blue);
   out+=L6_drawBody(h[k].body,400,150,22)+L6_ground(390,570,240)+TF(480,262,`generation ${k}: best ${L6_n(h[k].best)}`,13,C.ink)+L6_badge(480,300,'model','middle')}
  if(f.k==='filter'){const runs=L6_builtRuns(best,.15,20,s.seed),d=L6_dist(best),lo=Math.min(0,...runs,d)-1,hi=Math.max(0,...runs,d)+1,pl=L6_plot(80,130,440,40,[lo,hi],[0,1],{xt:[[0,'0'],[d,'design']],xl:'distance in ten cycles (− left, + right), 20 noisy re-runs'});
   out+=pl.svg+L(pl.X(0),130,pl.X(0),170,C.line,1.4)+L(pl.X(d),124,pl.X(d),176,C.blue,3);runs.forEach((v,i)=>{if(i<Math.ceil(20*u))out+=Ci(pl.X(v),136+(i%5)*7,4,Math.sign(v)===Math.sign(d)?C.green:C.coral)});
   const same=runs.filter(v=>Math.sign(v)===Math.sign(d)&&Math.abs(v)>1e-9).length;out+=L6_tile(150,236,140,'same direction',`${same} of 20`,C.green)+L6_tile(310,236,140,'average distance',L6_n(runs.reduce((a,v)=>a+v,0)/20),C.blue)+L6_badge(300,300,'model','middle')}
  if(f.k==='build'){for(let i=0;i<46;i++){const r=L6_rng(i+5),a=r()*6.283,rr=Math.sqrt(r())*70,x=300+Math.cos(a)*rr,y=196+Math.sin(a)*rr*.8,heart=x>300+rr*.2&&i%3===0;out+=Ci(x,y,9,heart?C.coral:C.greenp,heart?C.coral:C.green)}
   out+=P(`M${fmt(230+40*u)} 120 L${fmt(260+40*u)} 160`,C.dark,3)+TF(140,140,'microsurgery tools shape the cluster',13,C.muted)+R(380,140,14,14,C.greenp,C.green,3)+TF(400,152,'future skin cells',13,C.ink,'start')+R(380,164,14,14,C.coralp,C.coral,3)+TF(400,176,'future heart-muscle cells',13,C.ink,'start');
   out+=L6_badge(300,292,'single','middle')+TF(300,330,'Cells from Xenopus laevis embryos; schematic, not to scale.',13,C.muted)}
  if(f.k==='test'){out+=`<ellipse cx="300" cy="200" rx="200" ry="90" fill="${C.pale}" stroke="${C.line}" stroke-width="2"/>`;const pts=range(41).map(i=>[220+i*4*u,206+6*Math.sin(i/3)]);out+=L6_poly(pts,C.blue,2,'stroke-dasharray="4 4"')+Ci(pts[40][0],pts[40][1],14,C.greenp,C.green)+Ci(pts[40][0]+6,pts[40][1]+3,5,C.coral);
   out+=arrow(360,150,420,150,C.blue,2.5)+TF(390,140,'predicted direction',13,C.blue)+L6_badge(300,306,'single','middle')+TF(300,340,'Reported size: 650–750 microns across (UVM news release, 2020).',13,C.muted)}
  return {svg:out,phase:f.say};
 }});

// Scene 2: paint a body and watch the toy crawler.
SCENE({id:'computer-designed-tissues',name:'Skin and heart muscle',tag:'Simplified model · A toy crawler made of squares',
 definition:'In the 2020 designs each body was built from two kinds of tissue: passive skin, which only gives shape and weight, and heart muscle, whose cells contract rhythmically by themselves. Where the muscle sits decides how the body pushes on the ground. This scene is a toy written for this course, a side view of squares on a surface, not the paper’s 3D soft-body simulator.',
 example:'In the toy, a column of squares grips the ground in proportion to its load, and muscle squares press harder while contracting than while relaxing. A body with muscle near one end inches along; a body that is the same on both sides goes nowhere, because each half pulls the other equally.',
 desc:'A body of green skin squares and coral muscle squares on a surface, squeezing and relaxing, with a ghost of its starting place and tiles for the computed distance per cycle and over ten cycles.',
 research:['Kriegman, Blackiston, Levin & Bongard (2020). PNAS 117, 1853–1859: passive (skin) and contractile (heart-muscle) building blocks.','The crawler and its grip rule are a toy written for this course: no inertia, fluid or 3D shape.'],
 dur:12,shared:'l6-body',hint:'Press squares to cycle them through empty, skin and muscle. Move the slider to play the cycles. Try making the body the same on both sides.',
 init:()=>({b:L6_DEMO(),t:0}),
 watch(p){return {b:L6_DEMO(),t:p*4}},
 ui:[{range:'t',label:'Cycles played',min:0,max:4,step:.25,get:s=>s.t||0,act:'t'},{b:'Mirror the body',act:'mirror'},{b:'Back to the evolved body',act:'demo'}],
 on:{t(s,v){s.t=clamp(+v,0,4);return 'keep'},cell(s,i){i=+i;s.b=s.b.slice();s.b[i]=(s.b[i]+1)%3},mirror(s){const nb=s.b.slice();for(let r=0;r<L6_H;r++)for(let c=0;c<L6_W;c++)nb[r*L6_W+c]=s.b[r*L6_W+L6_W-1-c];s.b=nb},demo(s){s.b=L6_DEMO();s.t=0}},
 draw(s,f,X){
  const g=L6_gait(s.b),t=s.t||0,pos=L6_at(g,t),tr=X&&X.try,sz=tr?28:34,x0=tr?300-L6_W*sz/2:300-(g.span.length?g.span.length:L6_W)*sz/2,y0=tr?74:110;
  let out=heading(Math.abs(g.d)<1e-9?(g.grip?'Balanced: this body goes nowhere':'Nothing touches the ground'):`This body crawls ${L6_sgn(g.d)}`);
  out+=L6_legend(120,46)+L6_badge(590,46,'model','end');
  if(tr)out+=L6_drawBody(s.b,x0,y0,sz,{act:'cell',X,gait:g,grid:true})+L(x0,y0+L6_H*sz+1,x0+L6_W*sz,y0+L6_H*sz+1,C.dark,2)+TF(x0-8,y0+sz*2,'edit',13,C.muted,'end');
  else{out+=`<g opacity=".25">${L6_drawBody(s.b,x0,y0,sz,{gait:g})}</g>`+L6_drawBody(s.b,x0,y0,sz,{gait:g,dx:pos.dx*sz,squeeze:pos.squeeze})}
  if(tr){const s2=18,x2=300-(g.span.length||L6_W)*s2/2,y2=206;out+=`<g opacity=".3">${L6_drawBody(s.b,x2,y2,s2,{gait:g})}</g>`+L6_drawBody(s.b,x2,y2,s2,{gait:g,dx:pos.dx*s2,squeeze:pos.squeeze})+L6_ground(40,560,y2+L6_H*s2+2)+TF(40,y2+10,'played',13,C.muted,'start')}
  else out+=L6_ground(40,560,y0+L6_H*sz+2);
  out+=L6_tile(40,300,160,'contraction half',L6_n(g.x1||0,2)+' sq',C.coral)+L6_tile(220,300,160,'relaxation half',L6_n(g.x2||0,2)+' sq',C.green)+L6_tile(400,300,160,'ten cycles',L6_n(g.d*L6_CYC,1)+' sq',C.blue);
  out+=L6_note('sq = square widths; + is rightwards. Computed by the toy’s friction rule.',368);
  const ph=!g.grip?'No square of the main piece touches the ground, so in this toy the body cannot push off anything.':Math.abs(g.d)<1e-9?'The two half-cycles cancel: whatever the body gains while contracting it loses while relaxing. In this toy, a body needs an uneven arrangement of muscle and load to get anywhere.':
   `While contracting the body moves ${L6_n(g.x1,2)} square widths, while relaxing ${L6_n(g.x2,2)}: a net ${L6_n(g.d,2)} per cycle, ${L6_n(g.d*L6_CYC,1)} in ten. Dashed squares are not connected to the main piece and are ignored.`;
  return {svg:out,phase:ph};
 }});

// Scene 3: predicted direction against noisy re-runs, for the design and for the design rotated by 180 degrees.
const L6_rot=b=>b.slice().reverse();
SCENE({id:'computer-designed-check',name:'Does it go where predicted?',tag:'Single-lab finding · A check against chance',
 definition:'Before building, the 2020 team simulated the chosen design many times with small random differences, to see how reliably it moved, and also simulated the design rotated by 180 degrees, to check that the movement came from the shape rather than from chance. They then built several copies; the paper reports that their direction of movement in the dish matched the simulation. That comparison was made by the team itself, not by an independent lab.',
 example:'In the toy below, each re-run changes a few squares at random and varies the muscle strength. A design whose direction survives such noise is a better bet for building than one that only works exactly as drawn.',
 desc:'Two rows of dots: the distances of 25 noisy re-runs of the toy design, and of the same design rotated by 180 degrees, with the share that moved in the design’s predicted direction.',
 research:['Kriegman, Blackiston, Levin & Bongard (2020). PNAS 117, 1853–1859 (and supplementary information): 25 simulated evaluations of the design and of its rotated copy; six organisms built to the design.','Toy noise model written for this course.'],
 dur:10,shared:'l6-body',hint:'Change the noise. Then go back to the previous scene, paint a different body, and see how it holds up here.',
 init:()=>({b:L6_DEMO(),t:0,noise:.15}),
 watch(p){return {b:L6_DEMO(),noise:Math.round(lerp(.05,.3,p)*20)/20}},
 ui:[{range:'noise',label:'Building noise',min:0,max:.4,step:.05,get:s=>s.noise===undefined?.15:s.noise,act:'noise'}],
 on:{noise(s,v){s.noise=clamp(+v,0,.4);return 'keep'}},
 draw(s){
  const nz=s.noise===undefined?.15:s.noise,b=s.b,rb=L6_rot(b),d=L6_dist(b),dr=L6_dist(rb),runs=L6_builtRuns(b,nz,25,3),rruns=L6_builtRuns(rb,nz,25,3);
  const all=runs.concat(rruns,[d,dr,0]),lo=Math.min(...all)-1,hi=Math.max(...all)+1,sgn=Math.sign(d)||1;
  const cnt=a=>a.filter(v=>Math.sign(v)===sgn&&Math.abs(v)>1e-9).length;
  let out=heading('Predicted direction against noisy re-runs');
  out+=L6_drawBody(b,40,58,14)+TF(90,130,'design',13,C.ink)+L6_drawBody(rb,40,168,14)+TF(90,240,'rotated 180°',13,C.ink);
  const pl=L6_plot(170,60,400,190,[lo,hi],[0,2],{xt:[[0,'0']],xl:'distance in ten cycles (square widths; + is rightwards)'});out+=pl.svg+L(pl.X(0),60,pl.X(0),250,C.line,1.4);
  out+=L(pl.X(d),66,pl.X(d),140,C.blue,2.5);
  runs.forEach((v,i)=>out+=Ci(pl.X(v),80+(i%5)*12,4.5,Math.sign(v)===sgn?C.green:C.coral));
  rruns.forEach((v,i)=>out+=Ci(pl.X(v),180+(i%5)*12,4.5,Math.sign(v)===sgn?C.green:C.coral));
  out+=arrow(pl.X(0),56,pl.X(0)+sgn*40,56,C.blue,2.5,7)+TF(pl.X(0)+sgn*46,60,'predicted',13,C.blue,sgn>0?'start':'end');
  out+=L6_tile(170,290,190,'design: predicted way',`${cnt(runs)} of 25`,C.green)+L6_tile(380,290,190,'rotated: same way',`${cnt(rruns)} of 25`,C.coral);
  out+=L6_badge(40,300,'model')+L6_badge(40,326,'single');
  out+=L6_note('Green: moved the predicted way; coral: the other way or not at all.',368);
  return {svg:out,phase:`With building noise ${fmt(nz)}, ${cnt(runs)} of 25 toy re-runs of the design move the predicted way (${L6_sgn(sgn)}), against ${cnt(rruns)} of 25 for the rotated copy. A shape-driven result shows up as a difference between the two rows.`};
 }});

/* ===================== Lesson: evolved-designs ===================== */
const L6_MILES=[
 {y:'1994',who:'Karl Sims',what:'Bodies of blocks and their neural controllers evolved together, for swimming, walking, jumping and following.',where:'sim',ref:'Sims (1994), SIGGRAPH'},
 {y:'2000',who:'Hod Lipson & Jordan Pollack',what:'Bodies of bars, actuators and artificial neurons evolved in a physics simulation, then fabricated automatically.',where:'machine',ref:'Lipson & Pollack (2000), Nature'},
 {y:'2013',who:'Cheney, MacCurdy, Clune & Lipson',what:'Soft bodies of cubes (voxels) of several materials, some of which expand and contract, evolved in the Voxelyze simulator.',where:'sim',ref:'Cheney et al. (2013), GECCO'},
 {y:'2020',who:'Kriegman, Blackiston, Levin & Bongard',what:'Voxel bodies of passive and contracting cubes evolved in simulation, and the chosen design built from frog cells.',where:'cells',ref:'Kriegman et al. (2020), PNAS'}];
const L6_WHERE={sim:'stayed in simulation',machine:'built as a machine',cells:'built from living cells'};
SCENE({id:'evolved-designs',name:'Evolving bodies in a computer',tag:'Replicated finding · Evolutionary design, 1994–2020',
 definition:'Designing a body by simulated evolution is much older than xenobots and is used by many groups. Karl Sims evolved virtual creatures in 1994; Hod Lipson and Jordan Pollack evolved simple robots in simulation in 2000 and then had them fabricated automatically; later work evolved soft robots made of cubes (voxels). What was new in 2020 was the material: the evolved design was built from living cells. That the method works in simulation is well replicated; how well designs carry over to the real world is the hard part, often called the reality gap.',
 example:'All four projects share one loop: make variants, score them in a simulated world, keep the best, vary them again. They differ in what the bodies are made of and in where the winning design ends up.',
 desc:'A timeline of four milestones (1994, 2000, 2013, 2020); the selected one shows who did it, what was evolved, and whether the design stayed in simulation, was built as a machine, or was built from cells.',
 research:['Sims (1994). Evolving virtual creatures. Proceedings of SIGGRAPH ’94, 15–22.','Lipson & Pollack (2000). Automatic design and manufacture of robotic lifeforms. Nature 406, 974–978.','Cheney, MacCurdy, Clune & Lipson (2013). Unshackling evolution: evolving soft robots with multiple materials and a powerful generative encoding. GECCO ’13.','Hiller & Lipson (2014). Dynamic simulation of soft multimaterial 3D-printed objects. Soft Robotics 1 (the Voxelyze engine).'],
 dur:12,hint:'Choose a milestone and read what was evolved and where the design ended up.',
 init:()=>({m:3}),
 watch(p){return {m:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:L6_MILES.map((q,i)=>[i,q.y]),label:'Milestone',get:s=>s.m,act:'m'}],
 on:{m(s,v){s.m=clamp(Math.round(+v),0,3)}},
 draw(s,f,X){
  const q=L6_MILES[s.m];let out=heading('One loop, four kinds of body');
  out+=L(60,92,540,92,C.line,3);
  L6_MILES.forEach((m,i)=>{const x=60+i*160,on=i===s.m,inner=Ci(x,92,on?13:9,on?C.blue:'#fff',C.blue)+TF(x,70,m.y,13,on?C.blue:C.muted);out+=hit(X,'m',i,`Milestone ${m.y}`,inner)});
  out+=R(40,122,520,116,C.pale,'none',10)+TBF(56,146,q.who,14,C.ink,'start')+L6_para(56,170,q.what,70,13,C.ink)+TF(56,226,q.ref,13,C.muted,'start');
  const kinds=['sim','machine','cells'];kinds.forEach((k,i)=>{const x=60+i*170,on=q.where===k;out+=R(x,252,150,34,on?C.green:'#fff',on?C.green:C.line,8)+TF(x+75,274,L6_WHERE[k],13,on?'#fff':C.muted)});
  // the shared loop
  const lx=300,ly=330;['vary','score','keep'].forEach((w,i)=>{const x=lx-120+i*120;out+=R(x-44,ly-14,88,26,'#fff',C.blue,8)+TF(x,ly+4,w,13,C.blue);if(i<2)out+=arrow(x+46,ly,x+74,ly,C.blue,2,6)});
  out+=curveArrow(lx+120,ly+14,lx-120,ly+14,-14,C.blue,1.8);
  out+=L6_badge(552,130,'rep','end');
  return {svg:out,phase:`${q.y}: ${q.who}. The design ${L6_WHERE[q.where]}.`};
 }});

// Scene 2: run the toy search.
SCENE({id:'evolved-designs-search',name:'Run the search',tag:'Simplified model · Evolution in a toy world',
 definition:'Here the learner runs an evolutionary search in this course’s toy crawler world. Sixteen random bodies are scored by how far they move in ten cycles; the best four are kept and the other twelve are replaced by mutated copies of them; and the loop repeats. The best score can never fall, because the best bodies are kept. The 2020 study used a far larger search in a 3D soft-body simulator; this toy keeps only the logic.',
 example:'A higher mutation rate explores faster but also breaks good bodies more often. A different random seed starts from different bodies and often ends at a different design: evolution finds a good answer, not the only one.',
 desc:'A plot of the best and average computed distance in each generation, the best body at the chosen generation, and tiles with the computed numbers.',
 research:['The search follows the general method of Kriegman et al. (2020), PNAS 117, 1853–1859, much simplified: population, scoring, selection and mutation here are this course’s choices.'],
 dur:12,hint:'Move the generation slider, change the mutation rate or the seed, and watch the best distance rise.',
 init:()=>({seed:1,rate:.1,gen:30}),
 watch(p){return {seed:1,rate:.1,gen:Math.round(p*30)}},
 ui:[{range:'gen',label:'Generation',min:0,max:40,step:1,get:s=>s.gen,act:'gen'},{range:'rate',label:'Mutation rate',min:.02,max:.4,step:.02,get:s=>s.rate,act:'rate'},{b:'New seed',act:'seed'}],
 on:{gen(s,v){s.gen=clamp(Math.round(+v),0,40);return 'keep'},rate(s,v){s.rate=Math.round(clamp(+v,.02,.4)*50)/50;return 'keep'},seed(s){s.seed=s.seed%9+1;return 'keep'}},
 draw(s){
  const h=L6_evolve(s.seed,40,s.rate),g=clamp(s.gen,0,40),top=Math.max(4,Math.ceil(Math.max(...h.map(q=>q.best))+1));
  const pl=L6_plot(70,60,300,220,[0,40],[0,top],{xt:[[0,'0'],[10,'10'],[20,'20'],[30,'30'],[40,'40']],yt:[[0,'0'],[top/2,fmt(top/2)],[top,fmt(top)]],xl:'generation',yl:'distance in ten cycles (squares)'});
  let out=heading(`Generation ${g}: best distance ${L6_n(h[g].best)}`)+pl.svg;
  out+=L6_poly(h.slice(0,g+1).map((q,i)=>[pl.X(i),pl.Y(q.mean)]),C.amber,2,'stroke-dasharray="5 4"')+L6_poly(h.slice(0,g+1).map((q,i)=>[pl.X(i),pl.Y(q.best)]),C.blue,2.8)+Ci(pl.X(g),pl.Y(h[g].best),5,C.blue);
  out+=L(80,346,104,346,C.blue,3)+TF(110,350,'best of 16',13,C.ink,'start')+L(200,346,224,346,C.amber,2,'stroke-dasharray="5 4"')+TF(230,350,'average',13,C.ink,'start');
  out+=L6_drawBody(h[g].body,410,80,22)+L6_ground(400,580,170)+TF(490,192,'best body',13,C.muted);
  out+=L6_tile(400,214,180,'gain since generation 0',`+${L6_n(h[g].best-h[0].best)} squares`,C.blue)+L6_tile(400,270,180,'mutation rate · seed',`${fmt(s.rate)} · ${s.seed}`,C.ink);
  out+=L6_badge(580,330,'model','end');
  return {svg:out,phase:`Seed ${s.seed}, mutation rate ${fmt(s.rate)}: the best body moves ${L6_n(h[0].best)} squares in generation 0 and ${L6_n(h[g].best)} by generation ${g}; the population average is ${L6_n(h[g].mean)}.`};
 },
 three(s,f,X,project){
  const h=L6_evolve(s.seed,40,s.rate),b=h[clamp(s.gen,0,40)].body,keep=L6_component(b),faces=[];
  const P=project([0,L6_W,0,1.6,0,L6_H]);
  for(let r=0;r<L6_H;r++)for(let c=0;c<L6_W;c++){const i=r*L6_W+c;if(!b[i]||!keep[i])continue;faces.push(...prism(c,0,L6_H-1-r,.96,1.5,.96,b[i]===2?C.coral:'#9fd3c4'))}
  return {svg:paintFaces(faces,P)+L6_badge(20,46,'model')+TF(300,30,'Best body of this generation, given depth for the picture',13,C.muted),caption:'Schematic 3D view: the toy world is 2D, so the body is simply extruded. Coral cubes contract; green cubes are passive.',title:'The evolved body in depth'};
 }});

// Scene 3: the gap between simulation and dish.
function L6_gapStats(robust,noise){return L6_cache(`gap${robust},${noise}`,()=>range(5).map(i=>{const seed=i+1,h=L6_evolve(seed,30,.1,robust,noise),b=h[30].body,d=L6_dist(b),runs=L6_builtRuns(b,noise,20,seed),sg=Math.sign(d)||1;
 const m=runs.reduce((a,v)=>a+v*sg,0)/runs.length;return {seed,d:Math.abs(d),built:m,kept:Math.abs(d)>1e-9?m/Math.abs(d):0,same:runs.filter(v=>Math.sign(v)===sg&&Math.abs(v)>1e-9).length}}))}
SCENE({id:'evolved-designs-gap',name:'The gap between simulation and dish',tag:'Simplified model · What survives building',
 definition:'A design that works in a simulator can fail when built, because the real material is never exactly as modelled. Roboticists call this the reality gap. One response, used in the 2020 xenobot study, is to favour designs that keep working when the simulation is perturbed. In this toy, “building” a design changes some squares at random and varies muscle strength, and the learner can choose whether the search itself scored bodies under such noise.',
 example:'Each bar pair compares a design’s distance in the perfect toy simulation with its average distance over 20 noisy builds. Scoring under noise during the search usually gives designs that score a little lower in the perfect world but keep more of it when built; check whether that holds for every seed.',
 desc:'For five seeded searches, paired bars show each best design’s computed distance in simulation and its average over 20 noisy builds, with tiles for the share kept and the share of builds that moved the predicted way.',
 research:['Kriegman, Blackiston, Levin & Bongard (2020). PNAS 117, 1853–1859: designs were favoured for robustness to random perturbation before building.','Jakobi, Husbands & Harvey (1995). Noise and the reality gap: the use of simulation in evolutionary robotics. Advances in Artificial Life (ECAL 1995), Lecture Notes in Computer Science 929.','Toy noise and search written for this course.'],
 dur:12,hint:'Switch between the plain search and the search scored under noise, and change the noise level.',
 init:()=>({robust:0,noise:.15}),
 watch(p){return {robust:p<.5?0:1,noise:.15}},
 ui:[{choose:[[0,'Plain search'],[1,'Scored under noise']],label:'Search',get:s=>s.robust,act:'robust'},{range:'noise',label:'Noise',min:.05,max:.3,step:.05,get:s=>s.noise,act:'noise'}],
 on:{robust(s,v){s.robust=+v?1:0},noise(s,v){s.noise=Math.round(clamp(+v,.05,.3)*20)/20}},
 draw(s){
  const st=L6_gapStats(!!s.robust,s.noise),other=L6_gapStats(!s.robust,s.noise),avg=a=>a.reduce((x,q)=>x+q.kept,0)/a.length,sameAll=a=>a.reduce((x,q)=>x+q.same,0);
  const top=Math.ceil(Math.max(...st.map(q=>q.d),...other.map(q=>q.d))+1);
  const pl=L6_plot(70,58,330,210,[0,5],[Math.min(0,...st.map(q=>q.built)),top],{yt:[[0,'0'],[top,fmt(top)]],yl:'distance in ten cycles (squares)'});
  let out=heading(s.robust?'Search scored under noise':'Plain search, scored in a perfect toy world')+pl.svg;
  st.forEach((q,i)=>{const x=pl.X(i+.5);out+=R(x-26,pl.Y(q.d),24,pl.Y(0)-pl.Y(q.d),C.blue,'none',3);const yb=pl.Y(Math.max(0,q.built)),y0=pl.Y(Math.min(0,q.built));out+=R(x+2,Math.min(yb,pl.Y(0)),24,Math.abs(pl.Y(q.built)-pl.Y(0)),C.green,'none',3)+TF(x,286,'seed '+q.seed,13,C.muted)});
  out+=R(80,306,12,12,C.blue,'none',2)+TF(98,317,'in simulation',13,C.ink,'start')+R(200,306,12,12,C.green,'none',2)+TF(218,317,'average of 20 builds',13,C.ink,'start');
  const a=avg(st),b=avg(other),sa=sameAll(st),sb=sameAll(other);
  out+=L6_tile(420,64,160,'kept when built',L6_pct(a),C.green)+L6_tile(420,120,160,'builds the right way',`${sa} of 100`,C.green);
  out+=L6_para(420,196,s.robust?'The plain search, same noise:':'Scored under noise, same noise:',22,13,C.muted)+L6_para(420,236,`kept ${L6_pct(b)}; ${sb} of 100 the right way`,22,13,C.ink);
  out+=L6_badge(580,330,'model','end');
  return {svg:out,phase:`${s.robust?'Scored under noise':'Plain search'}, noise ${fmt(s.noise)}: across five seeds the designs keep ${L6_pct(a)} of their simulated distance when built, and ${sa} of 100 builds move the predicted way. The ${s.robust?'plain':'noise-scored'} search gives ${L6_pct(b)} and ${sb} of 100.`};
 }});

/* ===================== Lesson: ciliated-xenobots ===================== */
// Toy swimmer: N cilia patches round a circle. Each patch beats towards the rear pole with strength a (upper half)
// or c (lower half), plus a common swirl s around the body. Each patch pushes fluid one way and the body the other:
// at low Reynolds number speed is proportional to net force and turning rate to net torque (toy drag constants).
const L6_NC=24,L6_KT=.9,L6_KR=.012;
function L6_cilia(a,c,sw){let fx=0,fy=0,tq=0;const pts=[];
 for(let i=0;i<L6_NC;i++){const th=(i+.5)/L6_NC*2*Math.PI,cx=Math.cos(th),cy=Math.sin(th),top=cy>0,b=top?a:c;
  const t=top?[-cy,cx]:[cy,-cx];            // tangent pointing towards the rear pole (−x)
  const f=[-b*t[0]+sw*cy,-b*t[1]-sw*cx];    // force on the body: opposite to the beat, plus the swirl
  fx+=f[0];fy+=f[1];tq+=cx*f[1]-cy*f[0];pts.push({th,cx,cy,b,beat:[b*t[0]-sw*cy,b*t[1]+sw*cx]})}
 return {v:L6_KT*Math.hypot(fx,fy)/L6_NC,vx:L6_KT*fx/L6_NC,vy:L6_KT*fy/L6_NC,w:L6_KR*tq,pts}}
// Path in the world: n steps from (x,y) with heading h, reflecting off a box [0,W]×[0,H] (toy units).
function L6_swim(a,c,sw,n,x,y,h,W=100,H=60,jit=0,seed=1){const m=L6_cilia(a,c,sw),r=L6_rng(seed),out=[[x,y]];
 for(let k=0;k<n;k++){h+=m.w+jit*L6_gauss(r);const ch=Math.cos(h),sh=Math.sin(h);x+=m.vx*ch-m.vy*sh;y+=m.vx*sh+m.vy*ch;
  if(x<0){x=-x;h=Math.PI-h}if(x>W){x=2*W-x;h=Math.PI-h}if(y<0){y=-y;h=-h}if(y>H){y=2*H-y;h=-h}out.push([x,y])}
 return out}
function L6_drawBot(x,y,r,ci,o={}){let out=Ci(x,y,r,o.fill||C.greenp,o.stroke||C.green);
 const h=o.h||0;for(const p of ci.pts){const th=p.th+h,px=x+Math.cos(th)*r,py=y-Math.sin(th)*r,bx=p.beat[0],by=p.beat[1],bl=Math.hypot(bx,by);if(bl<.02)continue;
  const rx=bx*Math.cos(h)-by*Math.sin(h),ry=bx*Math.sin(h)+by*Math.cos(h),len=(o.len||14)*Math.min(1.4,bl);out+=arrow(px,py,px+rx/bl*len,py-ry/bl*len,C.blue,1.6,4)}
 return out}

const L6_SPH=[
 {k:'cut',t:'Tissue taken from an early embryo',say:'Cells from the animal pole of an early Xenopus laevis embryo, the part that gives rise to the skin, are taken out and placed in a dish.'},
 {k:'round',t:'The cells round up into a ball',say:'Left to themselves, with no sculpting, the cells assemble into a sphere. The design comes from the cells, not from a computer.'},
 {k:'cilia',t:'Cilia grow on the outside',say:'Over the following days some surface cells develop many motile cilia, the beating hairs that normally move fluid over a tadpole’s skin.'},
 {k:'swim',t:'The sphere swims',say:'The cilia beat and the sphere moves through the water: faster than the 2020 designs, the team reported, and for longer.'},
 {k:'heal',t:'A cut closes',say:'The team reported that the spheres heal after damage. Here a toy closing rule shrinks the cut you set by the same fraction each step.'}];
SCENE({id:'ciliated-xenobots',name:'Spheres that build themselves',tag:'Single-lab finding · Blackiston et al., Science Robotics, 2021',
 definition:'In March 2021 Douglas Blackiston, Emma Lederer, Sam Kriegman, Simon Garnier, Josh Bongard and Michael Levin reported a second kind of xenobot, made bottom-up. Tissue from early frog (Xenopus laevis) embryos was left to assemble itself into spheres, which grew motile cilia on their outside and swam. The spheres could move through water in different ways, heal after damage, and show group behaviour. This was reported by the same collaboration and has not been repeated by an independent lab.',
 example:'The 2020 xenobots were sculpted, and moved by heart-muscle contraction. These were not sculpted, and moved by cilia. The step from one to the other shows how much of the behaviour the cells bring by themselves.',
 desc:'Five stages: tissue taken from an embryo, the cells rounding into a ball, cilia appearing on the surface, the ball swimming, and a cut closing under a toy healing rule.',
 research:['Blackiston, Lederer, Kriegman, Garnier, Bongard & Levin (2021). A cellular platform for the development of synthetic living machines. Science Robotics 6(52), eabf1571.','Tufts University news release (31 March 2021), “Scientists create the next generation of living robots”: faster movement and longer life than the first xenobots.','The healing picture is a toy closing rule, not data.'],
 dur:14,hint:'Step through the stages. In Try it, set the size of the cut and step on to see the toy cut close.',
 init:()=>({cut:120}),
 trace:s=>L6_SPH.map((q,i)=>({i,...q})),
 ui:[{range:'cut',label:'Size of the cut (degrees)',min:30,max:180,step:10,get:s=>s.cut,act:'cut'}],
 on:{cut(s,v){s.cut=clamp(Math.round(+v/10)*10,30,180);return 'end'}},
 draw(s,f,X){
  const u=X?X.u:1;let out=heading(f.t);
  L6_SPH.forEach((q,i)=>out+=Ci(180+i*60,52,7,i<=f.i?C.blue:'#fff',C.blue));
  const cx=300,cy=196;
  if(f.k==='cut'){out+=`<ellipse cx="${cx}" cy="${cy}" rx="110" ry="100" fill="#eef3e9" stroke="${C.green}" stroke-width="2"/>`+P(`M${cx-110} ${cy} Q${cx} ${cy-30} ${cx+110} ${cy}`,C.line,1.5,'none','stroke-dasharray="4 4"');
   out+=R(cx-30,cy-92+20*u,60,32,C.greenp,C.green,6)+TF(cx,cy+130,'animal pole tissue (schematic)',13,C.muted)}
  if(f.k==='round'){for(let i=0;i<40;i++){const r=L6_rng(i+40),a=r()*6.283,rr=lerp(90*Math.sqrt(r()),60*Math.sqrt(r()),u);out+=Ci(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr,10,C.greenp,C.green)}}
  if(f.k==='cilia'||f.k==='swim'){const ci=L6_cilia(.8*(f.k==='swim'?1:u),.8*(f.k==='swim'?1:u),0);out+=L6_drawBot(f.k==='swim'?cx-60+120*u:cx,cy,70,ci,{len:22});
   if(f.k==='swim')out+=arrow(cx+40,cy-110,cx+110,cy-110,C.blue,2.5)+TF(cx+75,cy-120,'direction of travel',13,C.blue)}
  if(f.k==='heal'){const steps=X&&X.try?4:Math.round(4*u),gaps=range(steps+1).map(k=>s.cut*Math.pow(.55,k)),gap=gaps[gaps.length-1],half=gap/2*Math.PI/180;
   out+=P(`M${fmt(cx+70*Math.cos(half))} ${fmt(cy-70*Math.sin(half))} A70 70 0 1 0 ${fmt(cx+70*Math.cos(half))} ${fmt(cy+70*Math.sin(half))} Z`,C.green,2,C.greenp);
   gaps.forEach((gp,k)=>{const hh=gp/2*Math.PI/180,mx=70,my=96+k*44;out+=P(`M${fmt(mx+14*Math.cos(hh))} ${fmt(my-14*Math.sin(hh))} A14 14 0 1 0 ${fmt(mx+14*Math.cos(hh))} ${fmt(my+14*Math.sin(hh))} Z`,C.green,1.5,C.greenp)+TF(mx+24,my+5,`step ${k}: ${Math.round(gp)}°`,13,C.ink,'start')});
   out+=L6_tile(420,140,150,'opening now',Math.round(gap)+'°',C.coral)+L6_tile(420,196,150,'toy steps',String(steps),C.ink)+L6_badge(570,260,'model','end')}
  out+=L6_badge(300,322,'single','middle')+L6_note('Frog cells in a dish; a schematic, not a micrograph.',360);
  return {svg:out,phase:f.k==='heal'?`${f.say} Starting from ${s.cut}°, the toy opening is ${Math.round(s.cut*Math.pow(.55,4))}° after 4 steps.`:f.say};
 }});

// Scene 2: steer a toy swimmer by changing the cilia beat.
SCENE({id:'ciliated-xenobots-steer',name:'Steering by cilia',tag:'Simplified model · Thrust and turning from a ring of cilia',
 definition:'A swimmer the size of a xenobot lives at low Reynolds number: water feels thick, nothing coasts, and speed follows force at every instant. In this toy, a ring of cilia patches each pushes water backwards and the body forwards. Even beating gives a straight path; stronger beating on one side turns the body; a swirl of all patches the same way round makes it spin. The 2021 paper describes xenobots moving in different ways; this toy only shows why the cilia pattern can decide the path.',
 example:'Set the upper and lower halves equal: the turning rate is zero and the path is straight. Make one half stronger: the path becomes a circle, whose radius is the computed speed divided by the turning rate.',
 desc:'A spheroid with arrows showing each cilia patch’s beat, and beside it the computed path in a tank, with tiles for speed, turning rate and path radius.',
 research:['Purcell (1977). Life at low Reynolds number. American Journal of Physics 45, 3–11.','Blackiston et al. (2021). Science Robotics 6, eabf1571: ciliated xenobots move through water in diverse ways.','Toy force and drag rule written for this course.'],
 dur:12,hint:'Change the beat strength on each half and the swirl, and compare the paths.',
 init:()=>({a:.8,c:.8,sw:0}),
 watch(p){return p<.34?{a:.8,c:.8,sw:0}:p<.67?{a:.9,c:.5,sw:0}:{a:.6,c:.6,sw:.5}},
 ui:[{range:'a',label:'Upper half beat',min:0,max:1,step:.05,get:s=>s.a,act:'a'},{range:'c',label:'Lower half beat',min:0,max:1,step:.05,get:s=>s.c,act:'c'},{range:'sw',label:'Swirl',min:-.6,max:.6,step:.05,get:s=>s.sw,act:'sw'}],
 on:{a(s,v){s.a=clamp(+v,0,1);return 'keep'},c(s,v){s.c=clamp(+v,0,1);return 'keep'},sw(s,v){s.sw=clamp(+v,-.6,.6);return 'keep'}},
 draw(s,f,X){
  const m=L6_cilia(s.a,s.c,s.sw),path=L6_swim(s.a,s.c,s.sw,400,20,30,0),rad=Math.abs(m.w)>1e-6?m.v/Math.abs(m.w):Infinity;
  let out=heading(m.v<1e-3?(Math.abs(m.w)>1e-6?'Spinning on the spot':'Not moving'):Math.abs(m.w)<1e-6?'A straight path':'A curved path');
  out+=L6_drawBot(120,170,58,m,{len:20})+TF(120,256,'forward is to the right',13,C.muted)+arrow(150,280,200,280,C.muted,2,6);
  const bx=250,by=60,sc=3.2;out+=R(bx,by,320,192,'#fff',C.grid,8);
  const p=X&&!X.try?Math.max(2,Math.round((X.p*3%1)*400)):400;out+=L6_poly(path.slice(0,p).map(q=>[bx+q[0]*sc,by+q[1]*sc]),C.blue,2);const e=path[p-1];out+=Ci(bx+e[0]*sc,by+e[1]*sc,6,C.greenp,C.green);
  out+=L6_tile(40,300,170,'speed',L6_n(m.v,2)+' units/step',C.blue)+L6_tile(220,300,170,'turning',L6_n(m.w*180/Math.PI,2)+'°/step',C.coral)+L6_tile(400,300,170,'path radius',isFinite(rad)?L6_n(rad,1)+' units':'straight',C.ink);
  out+=L6_badge(570,266,'model','end');
  return {svg:out,phase:m.v<1e-3?(Math.abs(m.w)>1e-6?'The forces cancel: the swirl turns the body but pushes it nowhere.':'No cilia are beating, so there is no force and no motion.'):Math.abs(m.w)<1e-6?`Both halves push equally: speed ${L6_n(m.v,2)} and no turning, so the path is straight until it meets a wall.`:`Speed ${L6_n(m.v,2)} and turning ${L6_n(m.w*180/Math.PI,2)}° per step: a circle of radius ${L6_n(rad,1)} toy units. Stronger asymmetry gives tighter circles.`};
 }});

// Scene 3: a memory written by light. Ten toy swimmers in a tank with one lit spot.
function L6_memRun(seed,spotR,need){return L6_cache(`mem${seed},${spotR},${need}`,()=>range(10).map(i=>{const r=L6_rng(seed*100+i),a=.4+.6*r(),c=.4+.6*r(),sw=(r()-.5)*.2;
 const path=L6_swim(a,c,sw,360,10+80*r(),8+44*r(),r()*6.283,100,60,.08,seed*100+i);let dose=0,at=-1;path.forEach((q,k)=>{if(Math.hypot(q[0]-50,q[1]-30)<spotR){dose++;if(dose===need)at=k}});return {path,dose,red:dose>=need,at}}))}
SCENE({id:'ciliated-xenobots-memory',name:'A memory written by light',tag:'Single-lab finding · A one-bit record',
 definition:'To give xenobots a simple record of where they had been, the 2021 team injected frog embryos with mRNA for EosFP, a fluorescent protein that glows green and switches permanently to red after exposure to light of about 390 nanometres. Spheres made from these cells swam in a dish with one lit spot. The team reported that after two hours 3 of 10 had turned red. The authors presented it as a proof of principle for a writable molecular memory. Note that these spheres, unlike the first xenobots, carried an added protein.',
 example:'The record is one bit (was this sphere ever lit long enough?) and it cannot be erased. Below, ten toy swimmers wander a tank; each one that spends enough steps inside the spot turns red. The toy count changes with spot size and seed; the reported 3 of 10 is shown separately.',
 desc:'A tank with a lit circle and ten toy swimmer paths; swimmers that reached the toy light dose are drawn red. A side panel gives the toy count and, separately, the published result.',
 research:['Blackiston et al. (2021). Science Robotics 6, eabf1571: EosFP photoconversion as a molecular memory.','University of Vermont news release (31 March 2021): ten xenobots, a spot of 390 nm light, three red after two hours.','Toy swimmers and dose threshold written for this course.'],
 dur:12,hint:'Change the size of the lit spot and the dose needed, or try another seed, and count the red swimmers.',
 init:()=>({seed:1,spot:10,need:12}),
 watch(p){return {seed:1,spot:10,need:12,p}},
 ui:[{range:'spot',label:'Spot radius (toy units)',min:4,max:20,step:1,get:s=>s.spot,act:'spot'},{range:'need',label:'Steps of light needed',min:2,max:40,step:2,get:s=>s.need,act:'need'},{b:'Another seed',act:'seed'}],
 on:{spot(s,v){s.spot=clamp(Math.round(+v),4,20);return 'keep'},need(s,v){s.need=clamp(Math.round(+v/2)*2,2,40);return 'keep'},seed(s){s.seed=s.seed%9+1;return 'keep'}},
 draw(s,f,X){
  const runs=L6_memRun(s.seed,s.spot,s.need),k=s.p===undefined?360:Math.round(clamp(s.p*1.25,0,1)*360),bx=30,by=56,sc=3.4;
  let out=heading('Ten swimmers, one lit spot')+R(bx,by,340,204,'#fff',C.grid,8)+Ci(bx+50*sc,by+30*sc,s.spot*sc,C.amberp,C.amber)+TF(bx+50*sc,by+30*sc+4,'390 nm',13,C.amber);
  let red=0;runs.forEach(q=>{const isRed=q.at>=0&&q.at<=k;if(isRed)red++;out+=L6_poly(q.path.slice(0,k+1).map(p=>[bx+p[0]*sc,by+p[1]*sc]),isRed?C.coral:C.green,1.2,'opacity=".55"');const e=q.path[k];out+=Ci(bx+e[0]*sc,by+e[1]*sc,5,isRed?C.coral:C.green,'#fff')});
  out+=L6_badge(bx,272,'model')+L6_tile(bx,298,160,'toy: turned red',`${red} of 10`,C.coral)+L6_tile(bx+180,298,160,'toy steps run',String(k),C.ink);
  out+=R(390,56,190,204,C.pale,'none',10)+L6_badge(400,66,'single')+TBF(485,118,'3 of 10',22,C.coral)+TF(485,142,'turned red after',13,C.ink)+TF(485,160,'two hours in the dish',13,C.ink)+L6_para(402,196,'Reported by the team; not computed by the toy.',24,13,C.muted);
  return {svg:out,phase:`In the toy, ${red} of 10 swimmers have spent at least ${s.need} steps in a spot of radius ${s.spot}. Change the spot or the dose and the count changes; the published 3 of 10 is a separate, measured result.`};
 }});

/* ===================== Lesson: self-replication ===================== */
// Toy arena (written for this course): a grid of sites holding loose cells. Swimmers wander, scoop cells into a
// carried load and drop it now and then; at the end of a round, touching sites with enough cells form a pile, and a
// pile of at least L6_PILE cells becomes an offspring swimmer of that many cells. A wider "mouth" (0 = sphere,
// 1 = C shape) scoops more and drops less. Offspring are spheres, and bigger swimmers scoop more.
const L6_AW=40,L6_AH=26,L6_PILE=10,L6_STEPS=260,L6_DIRS=[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
function L6_round(seed,parents,density){const r=L6_rng(seed),g=new Array(L6_AW*L6_AH).fill(0);
 for(let k=0;k<g.length;k++){let n=0;for(let t=0;t<3;t++)if(r()<density)n++;g[k]=n}
 const start=g.reduce((a,v)=>a+v,0);
 const bots=parents.map(p=>({x:Math.floor(r()*L6_AW),y:Math.floor(r()*L6_AH),d:Math.floor(r()*8),load:0,size:p.size,mouth:p.mouth,trail:[]}));
 for(let t=0;t<L6_STEPS;t++)for(const b of bots){
  if(r()<.18)b.d=(b.d+(r()<.5?1:7))%8;let [dx,dy]=L6_DIRS[b.d];let nx=b.x+dx,ny=b.y+dy;
  if(nx<0||nx>=L6_AW){dx=-dx;nx=b.x+dx}if(ny<0||ny>=L6_AH){dy=-dy;ny=b.y+dy}b.d=L6_DIRS.findIndex(q=>q[0]===dx&&q[1]===dy);b.x=nx;b.y=ny;
  const cap=Math.round((3+9*b.mouth)*Math.min(1.5,b.size/14)),k=b.y*L6_AW+b.x,take=Math.min(g[k],Math.max(0,cap-b.load));g[k]-=take;b.load+=take;
  if(b.load>0&&r()<.3-.22*b.mouth){g[k]+=b.load;b.load=0}
  if(t%6===0)b.trail.push([b.x,b.y])}
 for(const b of bots){if(b.load){g[b.y*L6_AW+b.x]+=b.load;b.load=0}}
 // piles: 8-connected sites holding 4 or more cells (more than any site starts with)
 const seen=new Array(g.length).fill(0),piles=[];
 for(let k=0;k<g.length;k++){if(g[k]<4||seen[k])continue;let n=0,sx=0,sy=0;const st=[k];seen[k]=1;
  while(st.length){const q=st.pop();n+=g[q];sx+=(q%L6_AW)*g[q];sy+=((q/L6_AW)|0)*g[q];for(const [dx,dy] of L6_DIRS){const x=q%L6_AW+dx,y=((q/L6_AW)|0)+dy;if(x<0||y<0||x>=L6_AW||y>=L6_AH)continue;const j=y*L6_AW+x;if(g[j]>=4&&!seen[j]){seen[j]=1;st.push(j)}}}
  piles.push({n,x:sx/n,y:sy/n})}
 const kids=piles.filter(p=>p.n>=L6_PILE);
 return {g,bots,piles,kids,start}}
// A whole run: generation 0 parents of the given shape, then rounds with fresh loose cells until no offspring form.
function L6_lineage(seed,n0,mouth,density,maxGen=8){return L6_cache(`lin${seed},${n0},${mouth},${density}`,()=>{
 let parents=range(n0).map(()=>({size:14,mouth}));const gens=[];
 for(let gi=0;gi<maxGen&&parents.length;gi++){const rd=L6_round(seed*97+gi,parents,density);gens.push({parents:parents.length,kids:rd.kids.length,rd});
  parents=rd.kids.slice(0,12).map(p=>({size:Math.min(p.n,24),mouth:0}))}
 return gens})}
const L6_rounds=gens=>gens.filter(q=>q.kids>0).length;
function L6_lineStats(n0,mouth,density,seeds=10){return L6_cache(`ls${n0},${mouth},${density}`,()=>{const r=range(seeds).map(k=>L6_rounds(L6_lineage(k+1,n0,mouth,density)));return {mean:r.reduce((a,v)=>a+v,0)/seeds,all:r}})}

const L6_KINDS=[
 {k:'split',ex:'A bacterium grows and divides in two',from:'body',how:'growth, then splitting',lab:'rep'},
 {k:'bud',ex:'A yeast cell buds off a daughter',from:'body',how:'growth, then budding',lab:'rep'},
 {k:'birth',ex:'A frog’s eggs develop into tadpoles',from:'body',how:'growth inside or on the body, then birth',lab:'rep'},
 {k:'vn',ex:'John von Neumann’s imagined machine',from:'world',how:'kinematic: assembling a copy from loose parts (a thought experiment)',lab:'frame'},
 {k:'xeno',ex:'Xenobots pushing loose frog cells into piles',from:'world',how:'kinematic: piles of gathered cells become new movers',lab:'single'}];
SCENE({id:'self-replication',name:'Copying by gathering',tag:'Single-lab finding · Kriegman, Blackiston, Levin & Bongard, 2021',
 definition:'In November 2021 the xenobot team reported kinematic self-replication. Groups of ciliated xenobots, placed among loose frog cells separated from embryos, swept the cells into piles; some piles matured into new spheres that swam and could do the same. Kinematic means by movement: the offspring were assembled from material in the surroundings, not grown from the parents’ bodies, and no genome was copied by the parents to make them. The idea goes back to John von Neumann’s thought experiments on self-reproducing machines. This is one collaboration’s result, not yet repeated independently.',
 example:'A bacterium makes a copy by growing and splitting: the offspring is made of the parent. The xenobot offspring were made of cells the parents had never contained. They were frog cells with frog genomes all along; what the parents passed on was only a push.',
 desc:'A parent and an offspring for the chosen example, with an arrow showing where the offspring’s material comes from (the parent’s body or the surroundings) and a label for the kind of copying.',
 research:['Kriegman, Blackiston, Levin & Bongard (2021). Kinematic self-replication in reconfigurable organisms. PNAS 118(49), e2112672118.','von Neumann (1966). Theory of Self-Reproducing Automata, edited and completed by A. W. Burks. University of Illinois Press.'],
 dur:12,hint:'Choose an example and see where the offspring’s material comes from.',
 init:()=>({e:4}),
 watch(p){return {e:Math.min(4,Math.floor(p*5))}},
 ui:[{choose:L6_KINDS.map((q,i)=>[i,['Bacterium','Yeast','Frog','Von Neumann','Xenobots'][i]]),label:'Example',get:s=>s.e,act:'e'}],
 on:{e(s,v){s.e=clamp(Math.round(+v),0,4)}},
 draw(s,f,X){
  const q=L6_KINDS[s.e],u=X?X.u:1;let out=heading(q.ex);
  out+=R(40,60,520,200,'#fff',C.grid,10);
  if(q.from==='body'){out+=Ci(200,160,50,C.greenp,C.green)+TF(200,236,'parent',13,C.muted);const r=lerp(8,40,u);out+=Ci(200+50+r*.8,160,r,C.pale,C.blue)+TF(330,236,'offspring',13,C.muted)+curveArrow(210,110,300,120,-30,C.blue,2)+TF(260,90,'made from the parent’s own material',13,C.blue)}
  else{for(let i=0;i<26;i++){const r=L6_rng(i+300),x=320+r()*200,y=90+r()*150,t=smooth(u*1.2-r()*.2),ga=i*2.4,gr=6*Math.sqrt(i);out+=Ci(lerp(x,440+gr*Math.cos(ga),t),lerp(y,170+gr*Math.sin(ga),t),6,C.greenp,C.green)}
   out+=s.e===4?L6_cShape(150,160,42,1):R(110,120,80,80,'#eef2f4',C.dark,6)+TF(150,165,'machine',13,C.dark);
   out+=TF(150,236,'parent',13,C.muted)+TF(440,236,'offspring',13,C.muted)+arrow(200,160,380,160,C.blue,2.2)+TF(290,148,'pushes or assembles',13,C.blue)+TF(430,100,'loose parts in the surroundings',13,C.green)}
  out+=R(40,276,520,40,C.pale,'none',8)+TF(300,301,q.how,13,C.ink);
  out+=L6_badge(560,330,q.lab,'end');
  return {svg:out,phase:`${q.ex}: ${q.how}. The offspring’s material comes from ${q.from==='body'?'the parent’s own body':'the surroundings'}.`};
 }});

function L6_drawArena(rd,x0,y0,sz,o={}){let out=R(x0,y0,L6_AW*sz,L6_AH*sz,'#fff',C.grid,6);
 for(const b of rd.bots)out+=L6_poly(b.trail.map(p=>[x0+(p[0]+.5)*sz,y0+(p[1]+.5)*sz]),C.blue,1,'opacity=".22"');
 for(let k=0;k<rd.g.length;k++){const n=rd.g[k];if(!n||n>=4)continue;const x=x0+(k%L6_AW+.5)*sz,y=y0+(((k/L6_AW)|0)+.5)*sz;out+=Ci(x,y,.9+n*.5,C.green,'none','opacity=".55"')}
 for(const p of rd.piles){const kid=p.n>=L6_PILE,x=x0+(p.x+.5)*sz,y=y0+(p.y+.5)*sz;out+=Ci(x,y,Math.sqrt(p.n)*sz*.42,kid?C.coralp:C.greenp,kid?C.coral:C.green)}
 return out}
SCENE({id:'self-replication-piles',name:'Swimmers and loose cells',tag:'Simplified model · Piles that become movers',
 definition:'This toy arena keeps the logic of kinematic replication and nothing else. Swimmers wander, scoop loose cells as they go and drop them now and then; at the end of a round, any pile of at least ten cells becomes a new swimmer. In the toy, the next round starts with those offspring and a fresh scatter of loose cells. Whether the lineage keeps going depends on how many piles reach the threshold. It is not a model of real cilia, cell adhesion or maturation.',
 example:'With no swimmers, the loose cells stay scattered and no pile ever reaches ten. With swimmers, piles grow where loads are dropped. Fewer loose cells or fewer swimmers, and the lineage soon dies out.',
 desc:'A square arena with faint swimmer tracks, small green dots for loose cells, green circles for piles too small to count, coral circles for piles that became offspring, and a bar chart of offspring in each round.',
 research:['Kriegman, Blackiston, Levin & Bongard (2021). PNAS 118, e2112672118: swarms of spheres among dissociated frog cells.','Toy arena, threshold and pick-up rule written for this course.'],
 dur:12,hint:'Change the number of starting swimmers and the density of loose cells, choose which round to see, or try another seed.',
 init:()=>({n0:12,dens:.25,seed:1,gen:0}),
 watch(p){return {n0:12,dens:.25,seed:1,gen:Math.min(3,Math.floor(p*4))}},
 ui:[{range:'n0',label:'Swimmers at the start',min:0,max:16,step:1,get:s=>s.n0,act:'n0'},{range:'dens',label:'Loose-cell density',min:.1,max:.35,step:.05,get:s=>s.dens,act:'dens'},{range:'gen',label:'Round to show',min:0,max:7,step:1,get:s=>s.gen,act:'gen'},{b:'Another seed',act:'seed'}],
 on:{n0(s,v){s.n0=clamp(Math.round(+v),0,16)},dens(s,v){s.dens=Math.round(clamp(+v,.1,.35)*20)/20},gen(s,v){s.gen=clamp(Math.round(+v),0,7);return 'keep'},seed(s){s.seed=s.seed%9+1}},
 draw(s){
  const lin=s.n0?L6_lineage(s.seed,s.n0,0,s.dens):[],gi=Math.min(s.gen,Math.max(0,lin.length-1));
  const rd=lin.length?lin[gi].rd:L6_round(s.seed*97,[],s.dens),sz=8.5;
  let out=heading(!lin.length?'No swimmers: the cells stay scattered':`Round ${gi+1}: ${lin[gi].parents} swimmers made ${lin[gi].kids} offspring`);
  out+=L6_drawArena(rd,20,52,sz);
  const bx=390,top=Math.max(4,...lin.map(q=>q.kids)),pl=L6_plot(bx+10,70,180,150,[0,8],[0,top],{yt:[[0,'0'],[top,fmt(top)]],xt:[[.5,'1'],[3.5,'4'],[7.5,'8']],xl:'round',yl:'offspring'});
  out+=pl.svg;lin.forEach((q,i)=>out+=R(pl.X(i)+3,pl.Y(q.kids),pl.X(1)-pl.X(0)-6,pl.Y(0)-pl.Y(q.kids),i===gi?C.coral:C.coralp,'none',3));
  const st=s.n0?L6_lineStats(s.n0,0,s.dens):{mean:0};
  out+=L6_tile(bx,274,190,'rounds with offspring',`${L6_rounds(lin)} (10 seeds: ${L6_n(st.mean)})`,C.coral)+L6_badge(20,282,'model');
  out+=Ci(30,330,3,C.green)+TF(40,334,'loose',13,C.ink,'start')+Ci(100,330,6,C.greenp,C.green)+TF(112,334,'small pile',13,C.ink,'start')+Ci(210,330,7,C.coralp,C.coral)+TF(222,334,'offspring (≥ '+L6_PILE+')',13,C.ink,'start');
  return {svg:out,phase:!lin.length?'Without swimmers nothing gathers the cells: no site starts with more than 3, and no pile forms.':`Seed ${s.seed}: offspring per round ${lin.map(q=>q.kids).join(', ')}; the lineage made offspring in ${L6_rounds(lin)} round${L6_rounds(lin)===1?'':'s'}. Averaged over 10 seeds: ${L6_n(st.mean)} rounds.`};
 }});

// Scene 3: the C-shaped design.
function L6_cShape(x,y,r,mouth,col=C.green,fill=C.greenp){const a=mouth*55*Math.PI/180;if(a<.02)return Ci(x,y,r,fill,col);
 const p1=[x+r*Math.cos(a),y-r*Math.sin(a)],p2=[x+r*Math.cos(a),y+r*Math.sin(a)];return P(`M${fmt(p1[0])} ${fmt(p1[1])} A${r} ${r} 0 1 0 ${fmt(p2[0])} ${fmt(p2[1])} L${fmt(x+r*.15)} ${fmt(y)} Z`,col,2,fill)}
SCENE({id:'self-replication-shape',name:'A shape found in simulation',tag:'Single-lab finding · A C-shaped parent',
 definition:'Spherical parents kept the process going only briefly before it stopped. The team then used an evolutionary search in simulation to look for parent shapes that would gather cells better, and the best was a C shape, likened to Pac-Man, with an open mouth. Made from frog cells to that design, C-shaped parents kept the process going for more rounds, the paper reports. The offspring themselves formed as rounded clusters, so the special shape was not passed on.',
 example:'In the toy, a wider mouth scoops more cells per step and drops its load less often. Only the first generation has the mouth; offspring are spheres. Compare the average number of rounds over ten seeds for each mouth width.',
 desc:'A parent drawn with the chosen mouth width, a bar for the computed average number of rounds with offspring over ten seeds for the sphere and for the chosen shape, and the offspring counts of one run.',
 research:['Kriegman, Blackiston, Levin & Bongard (2021). PNAS 118, e2112672118: a C-shaped design, found by an evolutionary algorithm in simulation, increased replication.','Toy mouth rule written for this course.'],
 dur:12,hint:'Widen or close the mouth and compare the average number of rounds with the sphere.',
 init:()=>({mouth:1,seed:1}),
 watch(p){return {mouth:Math.min(1,Math.floor(p*5)/4),seed:1}},
 ui:[{range:'mouth',label:'Mouth width (0 = sphere)',min:0,max:1,step:.25,get:s=>s.mouth,act:'mouth'},{b:'Another seed',act:'seed'}],
 on:{mouth(s,v){s.mouth=clamp(Math.round(+v*4)/4,0,1)},seed(s){s.seed=s.seed%9+1}},
 draw(s){
  const sph=L6_lineStats(12,0,.25),cur=L6_lineStats(12,s.mouth,.25),run=L6_lineage(s.seed,12,s.mouth,.25);
  let out=heading(s.mouth?`Mouth width ${fmt(s.mouth)}: ${L6_n(cur.mean)} rounds on average`:'A sphere: the starting point');
  out+=L6_cShape(120,150,60,s.mouth)+TF(120,236,'first-generation parent',13,C.muted)+TF(120,254,'(offspring are spheres)',13,C.muted);
  const pl=L6_plot(260,70,160,170,[0,2],[0,8],{yt:[[0,'0'],[4,'4'],[8,'8']],yl:'rounds with offspring (mean of 10)',xt:[[.5,'sphere'],[1.5,'this shape']]});
  out+=pl.svg+R(pl.X(.2),pl.Y(sph.mean),pl.X(.8)-pl.X(.2),pl.Y(0)-pl.Y(sph.mean),C.greenp,C.green,3)+R(pl.X(1.2),pl.Y(cur.mean),pl.X(1.8)-pl.X(1.2),pl.Y(0)-pl.Y(cur.mean),C.coralp,C.coral,3);
  out+=TF(pl.X(.5),pl.Y(sph.mean)-6,L6_n(sph.mean),13,C.green)+TF(pl.X(1.5),pl.Y(cur.mean)-6,L6_n(cur.mean),13,C.coral);
  out+=TF(450,90,`seed ${s.seed}: offspring`,13,C.muted,'start')+TF(450,108,'per round',13,C.muted,'start')+TBF(450,132,run.map(q=>q.kids).join(' · ')||'none',14,C.ink,'start');
  out+=L6_badge(450,150,'model')+L6_badge(450,176,'single');
  out+=L6_para(450,222,'The paper reports more rounds with the C shape; the toy’s numbers are its own.',20,13,C.muted);
  return {svg:out,phase:`Over ten seeded runs, spheres make offspring in ${L6_n(sph.mean)} rounds on average and parents with mouth width ${fmt(s.mouth)} in ${L6_n(cur.mean)}. In this run the offspring per round are ${run.map(q=>q.kids).join(', ')}.`};
 }});

/* ===================== Lesson: anthrobots ===================== */
const L6_ANT=[
 {k:'seed',t:'One cell from an adult airway',say:'Each anthrobot began as a single cell from adult human airway (tracheal) tissue. The cells were not genetically modified.'},
 {k:'grow',t:'It grows in a gel',say:'Embedded in a gel of extracellular matrix, the cell divides and builds a multicellular ball over about two weeks. The cell count shown is the toy’s doubling rule, not a measurement.'},
 {k:'cilia',t:'Cilia end up on the outside',say:'Airway cells normally carry cilia that sweep mucus. In these balls the cilia ended up on the outer surface, where they could push against the fluid.'},
 {k:'move',t:'Out of the gel, it moves',say:'Taken out of the gel, many of the balls moved by themselves, with no sculpting and no embryonic cells. Shapes and cilia patterns varied from one to the next.'}];
SCENE({id:'anthrobots',name:'Grown from adult human cells',tag:'Single-lab finding · Gumuskaya et al., Advanced Science, 2023–2024',
 definition:'Xenobots came from frog embryos. In late 2023 Gizem Gumuskaya and colleagues (Srivastava, Cooper, Lesser, Semegran, Garnier and Michael Levin) reported motile clusters grown from adult human airway cells, which they named anthrobots. Each began as a single cell, grew in a gel for about two weeks, and moved by cilia on its surface. The paper appeared online on 30 November 2023 in Advanced Science, in the 2024 volume. It is one lab’s result, in a dish.',
 example:'No one sculpted an anthrobot and no genes were changed: the cells built the body themselves. The authors present this as showing that adult human cells, not only embryonic ones, can build new motile forms. These are dish experiments, and nothing here is a medical treatment.',
 desc:'Four stages: a single airway cell, a ball growing in gel with a toy cell count, cilia on the outside, and the ball moving in liquid.',
 research:['Gumuskaya, Srivastava, Cooper, Lesser, Semegran, Garnier & Levin (2024). Motile living biobots self-construct from adult human somatic progenitor seed cells. Advanced Science 11(4), 2303575 (online 30 November 2023).','Tufts University news release (30 November 2023), “Scientists build tiny biological robots from human cells”.','Cell counts here come from a toy doubling rule.'],
 dur:12,hint:'Step through the stages. In Try it, change the toy doubling time and see how many cells two weeks would give.',
 init:()=>({dbl:2}),
 trace:s=>L6_ANT.map((q,i)=>({i,...q})),
 ui:[{range:'dbl',label:'Toy doubling time (days)',min:1,max:4,step:.5,get:s=>s.dbl,act:'dbl'}],
 on:{dbl(s,v){s.dbl=clamp(Math.round(+v*2)/2,1,4);return 'keep'}},
 draw(s,f,X){
  const u=X?X.u:1;let out=heading(f.t);L6_ANT.forEach((q,i)=>out+=Ci(210+i*60,52,7,i<=f.i?C.blue:'#fff',C.blue));
  const cx=240,cy=190,days=f.k==='seed'?0:f.k==='grow'?14*u:14,n=Math.round(Math.pow(2,days/s.dbl)),rr=f.k==='seed'?12:clamp(12*Math.cbrt(n),12,80);
  if(f.k==='grow'||f.k==='seed')out+=R(100,90,280,200,C.amberp,'none',14)+TF(240,282,'gel (extracellular matrix)',13,C.amber);
  out+=Ci(cx+(f.k==='move'?60*u:0),cy,rr,C.purplep,C.purple);
  if(f.k==='cilia'||f.k==='move'){for(let i=0;i<30;i++){const a=i/30*6.283,x=cx+(f.k==='move'?60*u:0);out+=L(x+Math.cos(a)*rr,cy+Math.sin(a)*rr,x+Math.cos(a)*(rr+10),cy+Math.sin(a)*(rr+10),C.blue,1.6)}}
  if(f.k==='cilia')out+=TF(cx,cy+rr+30,'cilia face outwards',13,C.blue);
  out+=L6_tile(420,110,150,'toy day',L6_n(days,0),C.ink)+L6_tile(420,166,150,'toy cell count',n.toLocaleString('en-GB'),C.purple)+L6_badge(570,222,'model','end');
  out+=L6_badge(300,322,'single','middle')+L6_note('Human cells in a dish; schematic. Not a medical technology.',360);
  return {svg:out,phase:f.k==='grow'?`${f.say} With a toy doubling time of ${fmt(s.dbl)} days, 14 days give ${Math.round(Math.pow(2,14/s.dbl)).toLocaleString('en-GB')} cells.`:f.say};
 }});

// Scene 2: sort toy tracks into the paper's four movement types.
const L6_TYPES=['circular','linear','curvilinear','eclectic'];
const L6_TRK=[[.95,.35,0,.01],[.8,.8,0,.015],[.75,.6,0,.03],[.25,.25,0,.35],[.4,1,0,.01],[.9,.9,0,.02],[.7,.85,0,.04],[.3,.2,.1,.3]];
function L6_track(i){return L6_cache('trk'+i,()=>{const [a,c,sw,j]=L6_TRK[i],p=L6_swim(a,c,sw,150,18,30,(i*.37)%.6-.3,100,60,j,i+11);
 let len=0,turns=[];for(let k=1;k<p.length;k++){len+=Math.hypot(p[k][0]-p[k-1][0],p[k][1]-p[k-1][1]);if(k>1){const h1=Math.atan2(p[k-1][1]-p[k-2][1],p[k-1][0]-p[k-2][0]),h2=Math.atan2(p[k][1]-p[k-1][1],p[k][0]-p[k-1][0]);let d=h2-h1;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;turns.push(d)}}
 const net=Math.hypot(p[p.length-1][0]-p[0][0],p[p.length-1][1]-p[0][1]),mt=turns.reduce((a,v)=>a+v,0)/turns.length,ma=turns.reduce((a,v)=>a+Math.abs(v),0)/turns.length;
 // this course's own thresholds, applied to the toy tracks
 const wig=ma>.2,cons=ma>0?Math.abs(mt)/ma:0;const call=wig?'eclectic':cons>.8&&Math.abs(mt)>.04?'circular':Math.abs(mt)<.012?'linear':'curvilinear';
 return {p,len,net,mt,ma,cons,call}})}
SCENE({id:'anthrobots-tracks',name:'Four ways of moving',tag:'Single-lab finding · Movement types, with toy tracks',
 definition:'Filming many anthrobots, the authors sorted their paths into four types: circular, linear, curvilinear, and eclectic (irregular paths, including bots that wiggle on the spot). Circular and linear movers were the most common, together more than half of those tracked, and a bot tended to keep its type. The type went with the bot’s shape and with how its cilia were spread over its surface. The tracks below are made by this course’s toy swimmer, not taken from the paper’s videos.',
 example:'Each toy track comes with two computed measures: how much of the path’s length became net distance (straightness), and how steadily it turns one way. The toy’s own rule, written for this course, turns those numbers into one of the four types.',
 desc:'A toy track in a tank, buttons for the four movement types, and tiles for the computed straightness, steady turning and the toy rule’s type.',
 research:['Gumuskaya et al. (2024). Advanced Science 11, 2303575: movement types circular, linear, curvilinear and eclectic.','Tracks from this course’s toy swimmer; the sorting thresholds are this course’s.'],
 dur:14,hint:'Pick a track, decide which type it looks like, then compare with the toy rule’s call.',
 init:()=>({i:0,guess:''}),
 watch(p){const i=Math.min(7,Math.floor(p*8));return {i,guess:L6_track(i).call}},
 ui:[{range:'i',label:'Track',min:1,max:8,step:1,get:s=>s.i+1,act:'i'},{choose:L6_TYPES.map(t=>[t,t]),label:'Your call',get:s=>s.guess,act:'guess'}],
 on:{i(s,v){s.i=clamp(Math.round(+v)-1,0,7);s.guess=''},guess(s,v){s.guess=L6_TYPES.includes(v)?v:''}},
 draw(s){
  const t=L6_track(s.i),bx=30,by=56,sc=3.3;let out=heading(`Track ${s.i+1}`)+R(bx,by,330,198,'#fff',C.grid,8);
  out+=L6_poly(t.p.map(q=>[bx+q[0]*sc,by+q[1]*sc]),C.purple,1.8)+Ci(bx+t.p[0][0]*sc,by+t.p[0][1]*sc,5,'#fff',C.purple)+Ci(bx+t.p[t.p.length-1][0]*sc,by+t.p[t.p.length-1][1]*sc,6,C.purple);
  out+=L6_tile(380,58,200,'straightness (net ÷ path)',L6_n(t.net/t.len,2),C.blue)+L6_tile(380,112,200,'steady turning (0–1)',L6_n(t.cons,2),C.coral)+L6_tile(380,166,200,'toy rule’s call',t.call,C.purple);
  if(s.guess)out+=R(380,224,200,30,s.guess===t.call?C.greenp:C.amberp,'none',8)+TF(480,244,s.guess===t.call?'your call matches the toy rule':`your call: ${s.guess}`,13,C.ink);
  out+=L6_badge(30,270,'single')+TF(30+L6_badgeW('single')+8,284,'the four types (Gumuskaya et al.)',13,C.ink,'start');
  out+=L6_badge(30,300,'model')+TF(30+L6_badgeW('model')+8,314,'the tracks and the sorting rule',13,C.ink,'start');
  out+=L6_note('Open circle: start; filled circle: end. Tracks reflect off the tank walls.',360);
  return {svg:out,phase:`Track ${s.i+1}: straightness ${L6_n(t.net/t.len,2)}, steady turning ${L6_n(t.cons,2)}, average turn ${L6_n(Math.abs(t.mt)*180/Math.PI,1)}° per step. The toy rule calls it ${t.call}.${s.guess?` You called it ${s.guess}.`:''}`};
 }});

// Scene 3: a scratch in a sheet of neurons. Toy closure: the gap narrows at a base rate everywhere, faster near a "superbot".
const L6_SN=40;
function L6_gap(pos,day){return range(L6_SN).map(x=>{const boost=pos<0?0:Math.exp(-(((x-pos)/3.2)**2));return Math.max(0,1-day*(.04+.42*boost))})}
SCENE({id:'anthrobots-neurons',name:'Bridging a scratch in neurons',tag:'Single-lab finding · A dish experiment',
 definition:'The authors grew a flat sheet of human neurons in a dish, scratched a line through it, and placed anthrobots on it. Many anthrobots stuck together into a larger assembly that the authors called a superbot. Where a superbot settled across the scratch, neurons grew in and bridged the gap; elsewhere along the scratch they did not. How the bots encourage this is not known. This is one lab’s dish experiment; it is not a treatment for any injury or disease, and nothing here is medical advice.',
 example:'In the toy, the scratch narrows slowly everywhere and much faster within a few positions of the superbot, so the gap closes only there. The toy builds in the reported pattern; it does not explain it.',
 desc:'A long scratch in a sheet of neurons drawn as a band whose computed width shrinks over toy days, with a superbot the learner can place along it, and tiles for where the gap has closed.',
 research:['Gumuskaya et al. (2024). Advanced Science 11, 2303575: gap closure in scratched human neuron monolayers, at the site of a superbot only.','Tufts University news release (30 November 2023); the mechanism was described as unknown.','Toy closure rule written for this course.'],
 dur:12,hint:'Place the superbot at a point along the scratch, or remove it, and move the days slider.',
 init:()=>({pos:20,day:2}),
 watch(p){return {pos:p<.5?-1:20,day:Math.round(((p*2)%1)*2.5*4)/4}},
 ui:[{range:'day',label:'Toy days',min:0,max:2.5,step:.25,get:s=>s.day,act:'day'},{b:'No superbot',act:'none'}],
 on:{day(s,v){s.day=clamp(+v,0,2.5);return 'keep'},none(s){s.pos=-1;return 'keep'},place(s,x){s.pos=clamp(Math.round(+x),0,L6_SN-1);return 'keep'}},
 draw(s,f,X){
  const w=L6_gap(s.pos,s.day),x0=40,sw=13,yc=170;let out=heading(s.pos<0?'No superbot: the scratch stays open':`Superbot at position ${s.pos+1}`);
  out+=R(x0,90,L6_SN*sw,160,C.pale,'none',8);
  for(let x=0;x<L6_SN;x++){const h=w[x]*54,inner=R(x0+x*sw,yc-h/2,sw,h,'#fff','none',0)+R(x0+x*sw,90,sw,160,'none','none',0);out+=hit(X,'place',x,`Place the superbot at position ${x+1}`,inner)}
  for(let i=0;i<60;i++){const r=L6_rng(i+500),x=x0+r()*L6_SN*sw,y=r()<.5?100+r()*30:212+r()*30;out+=L(x,y,x+8,y+6,C.blue,1.2,'opacity=".6"')}
  if(s.pos>=0)out+=Ci(x0+(s.pos+.5)*sw,yc,18,C.purplep,C.purple)+TF(x0+(s.pos+.5)*sw,yc-28,'superbot',13,C.purple);
  const closed=w.filter(v=>v<.05).length;
  out+=TF(x0,276,'scratch width, computed (1 = as cut)',13,C.muted,'start');
  const far=Math.max(...w),near=s.pos<0?w[20]:w[s.pos];
  out+=L6_tile(40,290,160,'toy day',fmt(s.day),C.ink)+L6_tile(220,290,170,'positions closed',`${closed} of ${L6_SN}`,C.green)+L6_tile(410,290,150,s.pos<0?'width':'width at superbot',L6_n(near,2),C.blue);
  out+=L6_badge(40,60,'single')+L6_badge(560,60,'model','end')+L6_note('Not medical advice: a 2D dish experiment, schematic here.',368);
  return {svg:out,phase:s.pos<0?`Without a superbot the toy scratch narrows only slowly: at toy day ${fmt(s.day)} its width is ${L6_n(w[20],2)} everywhere.`:closed?`At toy day ${fmt(s.day)}, ${closed} of ${L6_SN} positions have closed, all near the superbot; far from it the width is still ${L6_n(far,2)}.`:`At toy day ${fmt(s.day)} nothing has closed yet: the width is ${L6_n(near,2)} at the superbot and ${L6_n(far,2)} far from it.`};
 }});

/* ===================== Lesson: organism-or-robot ===================== */
// The facts about the 2020 xenobots, each with its source, and simple course-written criteria for four words.
const L6_FACTS=[
 {k:'cells',t:'made entirely of living frog cells',ref:'Kriegman et al. 2020'},
 {k:'unmod',t:'cells not genetically modified',ref:'Kriegman et al. 2020'},
 {k:'nerve',t:'no nerve cells (skin and heart muscle only)',ref:'Kriegman et al. 2020'},
 {k:'feed',t:'could not feed; ran on energy stores from the embryo',ref:'UVM release 2020'},
 {k:'life',t:'moved for days to weeks, then broke down',ref:'UVM release 2020'},
 {k:'design',t:'shape chosen by a computer search for a task',ref:'Kriegman et al. 2020'},
 {k:'built',t:'assembled by people, by microsurgery',ref:'Kriegman et al. 2020'}];
const L6_WORDS=[
 {w:'organism',crit:[['cells','is made of living cells',1],['feed','takes in food or energy to keep going',0],['life','keeps itself alive for its natural span',.5],['built','arose by birth or development, not assembly',0]]},
 {w:'robot',crit:[['design','was designed to carry out a task',1],['built','was built by people',1],['cells','is made of engineered parts such as metal or plastic',0],['nerve','senses and acts through a programmed controller',0]]},
 {w:'machine',crit:[['design','was designed for a purpose',1],['built','was put together from parts',1],['life','does a job until it wears out',1],['cells','runs on a power source supplied by its makers',0]]},
 {w:'living material',crit:[['cells','is made of living cells',1],['unmod','keeps the cells’ own abilities',1],['design','is shaped by people for use',1],['nerve','need not be a whole organism',1]]}];
SCENE({id:'organism-or-robot',name:'Organism, robot, or neither?',tag:'Criticism and debate · What the word should be',
 definition:'The first xenobots were made entirely of frog skin and heart-muscle cells, not genetically modified, with no nerve cells. They could not feed, and moved for days to weeks on energy stores carried over from the embryo before breaking down. Whether to call them organisms, robots, machines or living material is a question of definition, and scientists and ethicists have answered it differently. Josh Bongard described them in the 2020 University of Vermont release as “neither a traditional robot nor a known species of animal”, and as “a new class of artifact: a living, programmable organism”.',
 example:'Pick a word, read a simple version of what it usually requires, and see how many of the requirements the 2020 xenobots meet. The criteria are written for this course to make the disagreement visible; they are not official definitions, and changing them changes the answer.',
 desc:'A list of facts about the 2020 xenobots with their sources, and for the chosen word four simple criteria, each marked as met, partly met or not met, with a computed tally.',
 research:['Kriegman, Blackiston, Levin & Bongard (2020). PNAS 117, 1853–1859.','University of Vermont news release (13 January 2020), “Team builds the first living robots”: Bongard’s description; days or weeks on embryonic energy stores; fully biodegradable.','Coghlan & Leins (2020). “Living robots”: ethical questions about xenobots. American Journal of Bioethics 20(5), W1–W3.'],
 dur:14,hint:'Choose a word and compare how many of its criteria the 2020 xenobots meet.',
 init:()=>({w:0}),
 watch(p){return {w:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:L6_WORDS.map((q,i)=>[i,q.w]),label:'Word',get:s=>s.w,act:'w'}],
 on:{w(s,v){s.w=clamp(Math.round(+v),0,3)}},
 draw(s){
  const W=L6_WORDS[s.w],score=W.crit.reduce((a,c)=>a+c[2],0);let out=heading(`Is a 2020 xenobot ${/^[aeiou]/.test(W.w)?'an':'a'} ${W.w}?`);
  out+=L6_badge(20,46,'single')+TF(20+L6_badgeW('single')+8,60,'facts reported about the 2020 xenobots',13,C.muted,'start');
  L6_FACTS.forEach((f,i)=>out+=TF(24,90+i*22,'• '+f.t,13,C.ink,'start'));
  out+=L6_badge(20,256,'debate')+TF(20+L6_badgeW('debate')+8,270,'how a word applies',13,C.muted,'start');
  W.crit.forEach((c,i)=>{const y=292+i*20,mark=c[2]===1?'✓':c[2]===.5?'~':'✗',col=c[2]===1?C.green:c[2]===.5?C.amber:C.coral;out+=TBF(30,y,mark,14,col)+TF(48,y,c[1],13,C.ink,'start')});
  out+=L6_tile(420,90,160,'criteria met',`${fmt(score)} of 4`,score>=3?C.green:score>=2?C.amber:C.coral);
  out+=L6_para(420,170,'✓ met · ~ partly · ✗ not met. Criteria written for this course.',24,13,C.muted);
  return {svg:out,phase:`On these course-written criteria, the 2020 xenobots meet ${fmt(score)} of 4 for “${W.w}”. Other words give other tallies: the facts are agreed, the word is the argument.`};
 }});

// Scene 2: headlines against the papers.
const L6_HEAD=[
 {h:'“Team builds the first living robots”',who:'University of Vermont news release, January 2020',paper:'A scalable pipeline for designing reconfigurable organisms (PNAS 2020)',supports:'Clusters of frog cells, shaped to a computer design, moved in a dish for days to weeks.'},
 {h:'“Team builds first living robots—that can reproduce”',who:'University of Vermont news release, November 2021',paper:'Kinematic self-replication in reconfigurable organisms (PNAS 2021)',supports:'In dishes supplied with loose frog cells, swimming clusters pushed cells into piles that became new swimmers, for a limited number of rounds.'},
 {h:'“Robots made from human cells can move on their own and heal wounds”',who:'Scientific American headline, after the November 2023 paper',paper:'Motile living biobots self-construct from adult human somatic progenitor seed cells (Advanced Science 2024)',supports:'Clusters of adult human airway cells moved by cilia; in a dish, an assembly of them was followed by neurons growing across a scratch in a sheet of neurons.'}];
SCENE({id:'organism-or-robot-words',name:'Headlines and papers',tag:'Criticism and debate · Press wording versus the claims',
 definition:'News releases and headlines described xenobots as “living robots” that could “reproduce”, and anthrobots as robots that “heal wounds”. The papers’ own titles speak of reconfigurable organisms, kinematic self-replication and motile biobots, and their claims are narrower: what happened, in which dish, under which conditions. Some of the strongest wording came from the institutions’ own releases, not only from journalists.',
 example:'“Can reproduce” suggests a population that grows by itself. The 2021 result needed a supply of loose cells separated from embryos by the team, and the process ran for a limited number of rounds. “Heal wounds” suggests an injury in a body; the result was a scratch in a sheet of neurons in a dish.',
 desc:'For the chosen example, the headline and who wrote it, the paper’s title, and a plain statement of what the paper’s evidence supports.',
 research:['University of Vermont news releases (13 January 2020; 29 November 2021).','Scientific American (2023), “Robots Made from Human Cells Can Move on Their Own and Heal Wounds”.','Kriegman et al. (2020), PNAS 117, 1853–1859; Kriegman et al. (2021), PNAS 118, e2112672118; Gumuskaya et al. (2024), Advanced Science 11, 2303575.'],
 dur:12,hint:'Choose an example and compare the headline with what the paper supports.',
 init:()=>({i:1}),
 watch(p){return {i:Math.min(2,Math.floor(p*3))}},
 ui:[{choose:[[0,'2020'],[1,'2021'],[2,'2023']],label:'Example',get:s=>s.i,act:'i'}],
 on:{i(s,v){s.i=clamp(Math.round(+v),0,2)}},
 draw(s){
  const q=L6_HEAD[s.i];let out=heading('What the headline says, what the paper shows');
  out+=R(30,50,540,86,C.coralp,'none',10)+L6_badge(42,58,'debate')+L6_para(42,100,q.h,64,14,C.ink)+TF(42,128,q.who,13,C.muted,'start');
  out+=R(30,148,540,60,'#fff',C.grid,10)+TF(42,170,'Paper',13,C.muted,'start')+L6_para(42,192,q.paper,72,13,C.ink);
  out+=R(30,220,540,100,C.pale,'none',10)+L6_badge(42,228,'single')+TF(42+L6_badgeW('single')+8,242,'what the evidence supports',13,C.muted,'start')+L6_para(42,268,q.supports,72,13,C.ink);
  const hw=q.h.replace(/[“”]/g,'').split(' ').length,pw=q.supports.split(' ').length;
  out+=L6_note(`The headline uses ${hw} words; the plain statement needs ${pw}.`,350);
  return {svg:out,phase:`${q.who}. The paper supports: ${q.supports}`};
 }});

// Scene 3: ethics and risk, as statements to sort.
const L6_KIND=['fact to test','definition','value or policy'];
const L6_ETH=[
 {t:'Xenobots break down within days to weeks and need special lab conditions to be made.',k:0,who:'Blackiston, Kriegman, Bongard & Levin (2023) make this point about risk.'},
 {t:'A cluster of frog cells with no nervous system is an organism.',k:1,who:'Coghlan & Leins (2020) ask what kind of entity xenobots are.'},
 {t:'The possibility of morally relevant interests in simple living things should not just be ignored.',k:2,who:'Coghlan & Leins (2020) argue this.'},
 {t:'Research on robots with living parts needs a framework of oversight and public debate.',k:2,who:'Mestre, Astobiza, Webster-Wood, Ryan & Saif (2024) propose one.'},
 {t:'The field needs shared, operational definitions of words like “robot” and “organism”.',k:1,who:'Blackiston, Kriegman, Bongard & Levin (2023) argue this.'},
 {t:'Kinematic replication could continue outside a laboratory.',k:0,who:'A claim about risk that experiments could test; the 2021 process needed supplied cells.'}];
SCENE({id:'organism-or-robot-ethics',name:'Ethics and risk',tag:'Criticism and debate · Several views, no verdict',
 definition:'Writers on ethics have asked what xenobots are and how they should be treated. Simon Coghlan and Kobi Leins (2020) argued that xenobots are not robots in any traditional sense, asked whether they are organisms, and argued that the possibility of morally relevant interests in simple living things should not just be ignored. Rafael Mestre and colleagues (2024) set out ethical questions for robots with living parts, from the status of semi-living things to effects on ecosystems, and proposed steps towards governance. The xenobot team (2023) replied to critiques, stressing that the field needs shared definitions and that xenobots biodegrade and depend on laboratory conditions. This course takes no side.',
 example:'Disagreements get clearer when each statement is sorted: is it a fact that experiments could check, a choice about what a word should mean, or a judgement about what we ought to do? Sort each statement, then read who has made the argument.',
 desc:'One statement at a time from the ethics debate, buttons for three kinds of claim, the course’s suggested sort with the published source, and a tally of the learner’s sorting.',
 research:['Coghlan & Leins (2020). “Living robots”: ethical questions about xenobots. American Journal of Bioethics 20(5), W1–W3.','Mestre, Astobiza, Webster-Wood, Ryan & Saif (2024). Ethics and responsibility in biohybrid robotics research. PNAS 121(31), e2310458121.','Blackiston, Kriegman, Bongard & Levin (2023). Biological robots: perspectives on an emerging interdisciplinary field. Soft Robotics 10(4), 674–686.'],
 dur:14,hint:'For each statement choose the kind of claim it is, then step to the next. The course’s suggestion is one reasonable sort, not an answer key.',
 init:()=>({i:0,picks:[-1,-1,-1,-1,-1,-1]}),
 watch(p){const i=Math.min(5,Math.floor(p*6));return {i,picks:L6_ETH.map((q,j)=>j<=i?q.k:-1)}},
 ui:[{choose:L6_KIND.map((k,i)=>[i,k]),label:'This statement is a',get:s=>s.picks[s.i],act:'pick'},{b:'Next statement',act:'next'}],
 on:{pick(s,v){s.picks=s.picks.slice();s.picks[s.i]=clamp(Math.round(+v),0,2)},next(s){s.i=(s.i+1)%L6_ETH.length}},
 draw(s,f,X){
  const q=L6_ETH[s.i],pk=s.picks[s.i];let out=heading(`Statement ${s.i+1} of ${L6_ETH.length}`);
  out+=R(30,50,540,80,'#fff',C.grid,10)+L6_para(46,82,'“'+q.t+'”',64,14,C.ink);
  L6_KIND.forEach((k,i)=>{const x=40+i*180,on=pk===i,sug=pk>=0&&q.k===i;out+=hit(X,'pick',i,`This statement is a ${k}`,R(x,146,160,36,on?C.blue:'#fff',sug?C.green:C.line,8)+TF(x+80,169,k,13,on?'#fff':C.ink))});
  if(pk>=0)out+=R(30,198,540,74,C.pale,'none',10)+TF(46,222,`Course suggestion: ${L6_KIND[q.k]}${pk===q.k?' (same as yours)':''}`,13,C.ink,'start')+L6_para(46,246,q.who,72,13,C.muted);
  const done=s.picks.filter(v=>v>=0).length,same=s.picks.filter((v,j)=>v===L6_ETH[j].k).length;
  out+=L6_tile(30,290,180,'statements sorted',`${done} of ${L6_ETH.length}`,C.ink)+L6_tile(230,290,180,'same as the course',`${same} of ${done}`,C.green);
  out+=L6_badge(570,300,'debate','end');
  return {svg:out,phase:pk<0?`“${q.t}” Choose which kind of claim it is.`:`Suggested: ${L6_KIND[q.k]}. ${q.who}`};
 }});
