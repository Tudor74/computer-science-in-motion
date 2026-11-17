/* ===================== Economics era 7 · Growth and inequality ===================== */
// Why some countries are rich, how unequal incomes are, whether the poor can be trapped, how economists
// test what works, which institutions matter, and who gains from trade. Models are deterministic: every
// random draw is seeded, every picture is a pure function of state, so Watch, rewind and Try it agree.
const E7_poly=(pts,col,w=2.4,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const E7_n=(v,d=1)=>{const x=Number(v);if(!isFinite(x))return '–';return x.toFixed(d).replace(/^-0(\.0+)?$/,'0')};
function E7_plot(x0,y0,w,h,xr,yr,o={}){
 const lx=!!o.logx,X=v=>x0+(lx?(Math.log(v)-Math.log(xr[0]))/(Math.log(xr[1])-Math.log(xr[0])):(v-xr[0])/(xr[1]-xr[0]))*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y,clipY:v=>Y(clamp(v,yr[0],yr[1]))};
}
function E7_btn(X,act,arg,label,x,y,w,h,text,o={}){
 const lines=Array.isArray(text)?text:[text];
 const inner=R(x,y,w,h,o.sel?(o.selFill||C.pale):'#fff',o.sel?C.blue:C.line,9,o.sel?'stroke-width="3"':'stroke-width="1.5"')+lines.map((t,i)=>TF(x+w/2,y+h/2+5+(i-(lines.length-1)/2)*16,t,o.size||13,o.ink||C.ink,'middle',i===0&&o.bold?'font-weight="700"':'')).join('');
 return hit(X,act,arg,label,inner);
}
// Wrap a sentence into lines of at most n characters.
function E7_wrap(s,n){const out=[];let line='';for(const w of String(s).split(' ')){if((line+' '+w).trim().length>n){out.push(line.trim());line=w}else line+=' '+w}if(line.trim())out.push(line.trim());return out}
function E7_lines(x,y,lines,size=13,col=C.ink,anchor='start',gap=17){return lines.map((t,i)=>TF(x,y+i*gap,t,size,col,anchor)).join('')}
// Standard normal cumulative distribution (Abramowitz–Stegun 7.1.26) and a seeded normal draw.
function E7_Phi(z){const t=1/(1+.3275911*Math.abs(z)/Math.SQRT2),y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-z*z/2);return z>=0?(1+y)/2:(1-y)/2}
const E7_norm=r=>{const u=Math.max(1e-12,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
// Gini coefficient of a list (mean absolute difference over twice the mean).
function E7_gini(xs){const n=xs.length,m=sum(xs)/n;let d=0;for(const a of xs)for(const b of xs)d+=Math.abs(a-b);return d/(2*n*n*m)}

/* ================================================================ solow-growth */
const E7_A=1/3;
const E7_kstar=(s,nd)=>Math.pow(s/nd,1/(1-E7_A));
function E7_solowPath(s,d,n,k0,T=100){const out=[k0];let k=k0;for(let t=1;t<=T;t++){k=k+s*Math.pow(k,E7_A)-(n+d)*k;out.push(k)}return out}
SCENE({id:'solow-growth',name:'Saving, machines and a steady state',tag:'The Solow model',
 definition:'In Robert Solow’s 1956 model, output comes from capital and labour. Each year people save part of their income, which buys new machines, while old machines wear out and a growing workforce spreads capital thinner. Because extra machines add less and less, capital per worker settles at a steady state where saving just replaces what is lost.',
 example:'Saving 25% of income, with 5% depreciation and 1% population growth, capital per worker settles at about 8.5 units, whatever the starting point.',
 desc:'Left: saving per worker s·f(k), a curve that flattens, and break-even investment (n+δ)·k, a straight line, against capital per worker k; they cross at the steady state. Right: the path of capital per worker over 100 years from the chosen start.',
 research:'Solow, R. M. (1956). A contribution to the theory of economic growth. Quarterly Journal of Economics 70, 65–94. Swan, T. W. (1956). Economic growth and capital accumulation. Economic Record 32, 334–361. Mankiw, Romer & Weil (1992), QJE 107, 407–437.',
 dur:10,hint:'Change the saving rate, depreciation, population growth and the starting capital, then slide through the years. A higher saving rate raises the steady state, but growth still stops there: in this model only better technology keeps income per person rising.',
 init:()=>({s:.25,d:.05,n:.01,k0:1,t:100}),
 watch(p){return {s:.25,d:.05,n:.01,k0:p<.5?1:16,t:Math.round((p<.5?p*2:(p-.5)*2)*100)}},
 ui:[{range:'s',label:'Saving rate s',min:.05,max:.5,step:.01,get:s=>s.s,act:'s',show:v=>Math.round(v*100)+'%'},
  {range:'d',label:'Depreciation δ',min:.01,max:.1,step:.005,get:s=>s.d,act:'d',show:v=>E7_n(v*100,1)+'%'},
  {range:'n',label:'Population growth n',min:0,max:.04,step:.005,get:s=>s.n,act:'n',show:v=>E7_n(v*100,1)+'%'},
  {range:'k0',label:'Starting capital per worker',min:.5,max:20,step:.5,get:s=>s.k0,act:'k0'},
  {range:'t',label:'Year',min:0,max:100,step:1,get:s=>s.t,act:'t'}],
 on:{s(s,v){s.s=Number(v)},d(s,v){s.d=Number(v)},n(s,v){s.n=Number(v)},k0(s,v){s.k0=Number(v)},t(s,v){s.t=Number(v)}},
 draw(s){
  const nd=s.n+s.d,ks=E7_kstar(s.s,nd),path=E7_solowPath(s.s,s.d,s.n,s.k0),t=clamp(Math.round(s.t),0,100),k=path[t];
  let out=heading('The Solow model',28);
  const A=E7_plot(62,60,250,220,[0,20],[0,.8],{xt:[[0,'0'],[5,'5'],[10,'10'],[15,'15'],[20,'20']],yt:[[0,'0'],[.4,'0.4'],[.8,'0.8']],xl:'capital per worker k',yl:'per worker, per year'});
  out+=A.svg;
  const ks_=range(101).map(i=>i/5);
  out+=E7_poly(ks_.map(x=>[A.X(x),A.clipY(Math.pow(x,E7_A)*s.s)]),C.blue,3);
  out+=E7_poly(ks_.filter(x=>nd*x<=.8).map(x=>[A.X(x),A.Y(nd*x)]),C.coral,2.6);
  if(ks<=20)out+=L(A.X(ks),A.Y(0),A.X(ks),A.clipY(nd*ks),C.green,1.6,'stroke-dasharray="5 4"')+Ci(A.X(ks),A.clipY(nd*ks),5,C.green)+TF(A.X(ks)+(ks>14?-6:6),A.Y(0)-8,'k* = '+E7_n(ks,1),13,C.green,ks>14?'end':'start');
  if(k<=20)out+=Ci(A.X(k),A.clipY(Math.pow(k,E7_A)*s.s),6,'#fff',C.blue);
  out+=TF(72,76,'saving s·f(k)',13,C.blue,'start')+TF(72,93,'break-even (n+δ)·k',13,C.coral,'start');
  const B=E7_plot(368,60,200,220,[0,100],[0,20],{xt:[[0,'0'],[50,'50'],[100,'100']],yt:[[0,'0'],[10,'10'],[20,'20']],xl:'years',yl:'capital per worker'});
  out+=B.svg;
  if(ks<=20)out+=L(B.X(0),B.Y(ks),B.X(100),B.Y(ks),C.green,1.4,'stroke-dasharray="5 4"');
  out+=E7_poly(path.slice(0,t+1).map((v,i)=>[B.X(i),B.clipY(v)]),C.blue,2.8)+Ci(B.X(t),B.clipY(k),5,C.blue);
  out+=counter(62,322,'year',String(t),C.ink,90)+counter(162,322,'k now',E7_n(k,2),C.blue,100)+counter(272,322,'steady state k*',ks>99?'>99':E7_n(ks,2),C.green,130)+counter(412,322,'output per worker',E7_n(Math.pow(k,E7_A),2),C.blue,156);
  const dir=Math.abs(k-ks)<.05*ks?'has reached':k<ks?'is climbing towards':'is falling towards';
  return {svg:out,phase:`Capital per worker ${dir} the steady state k* = (s/(n+δ))^1.5 = ${E7_n(ks,2)}, where saving ${Math.round(s.s*100)}% of output exactly replaces worn-out machines and equips new workers. Output per worker is f(k) = k^⅓.`};
 }});

// Two countries with the same model, one starting poor.
SCENE({id:'solow-growth-convergence',name:'Do poor countries catch up?',tag:'Convergence, absolute and conditional',
 definition:'The Solow model predicts that, other things equal, a country far below its steady state grows faster than one near it. Economists call this convergence. It holds “conditionally”: only among countries with similar saving, population growth and technology.',
 example:'Two countries saving 25%: the poor one grows about 4% a year at first, the rich one about 0.5%, and the gap between them closes. If the poor one saves only 12%, it settles at a lower level and the gap never closes.',
 desc:'Income per worker over 100 years for a poor country (orange) and a rich one (blue), on a log scale, with each country’s yearly growth rate beside it, for equal or unequal saving rates.',
 research:'Solow (1956). Barro, R. J. (1991). Economic growth in a cross section of countries. QJE 106, 407–443. Mankiw, Romer & Weil (1992). Pritchett, L. (1997). Divergence, big time. Journal of Economic Perspectives 11(3), 3–17.',
 dur:10,hint:'Switch between equal and unequal saving and slide the year. Unconditional convergence is not what the data show across all countries since 1870 (Pritchett’s “divergence, big time”); conditional convergence holds better.',
 init:()=>({mode:'same',t:100}),
 watch(p){return {mode:p<.55?'same':'diff',t:Math.round((p<.55?p/.55:(p-.55)/.45)*100)}},
 ui:[{choose:[['same','Equal saving (25%)'],['diff','Poor saves 12%']],label:'Saving',get:s=>s.mode,act:'mode'},{range:'t',label:'Year',min:0,max:100,step:1,get:s=>s.t,act:'t'}],
 on:{mode(s,v){s.mode=v},t(s,v){s.t=Number(v)}},
 draw(s){
  const t=clamp(Math.round(s.t),0,100),sp=s.mode==='same'?.25:.12;
  const poor=E7_solowPath(sp,.05,.01,1.5),rich=E7_solowPath(.25,.05,.01,6);
  const y=p=>p.map(k=>Math.pow(k,E7_A)),yp=y(poor),yr=y(rich);
  const g=(a,i)=>i?(a[i]/a[i-1]-1)*100:(a[1]/a[0]-1)*100;
  let out=heading('Do poor countries catch up?',28);
  const A=E7_plot(70,60,260,220,[0,100],[Math.log(.7),Math.log(2.3)],{xt:[[0,'0'],[50,'50'],[100,'100']],yt:[[Math.log(.8),'0.8'],[Math.log(1.2),'1.2'],[Math.log(1.6),'1.6'],[Math.log(2.2),'2.2']],xl:'years',yl:'income per worker (log scale)'});
  out+=A.svg;
  out+=E7_poly(yr.slice(0,t+1).map((v,i)=>[A.X(i),A.clipY(Math.log(v))]),C.blue,3)+E7_poly(yp.slice(0,t+1).map((v,i)=>[A.X(i),A.clipY(Math.log(v))]),C.coral,3);
  out+=Ci(A.X(t),A.clipY(Math.log(yr[t])),5,C.blue)+Ci(A.X(t),A.clipY(Math.log(yp[t])),5,C.coral);
  const B=E7_plot(390,60,180,220,[0,100],[0,8],{xt:[[0,'0'],[50,'50'],[100,'100']],yt:[[0,'0'],[2,'2%'],[4,'4%'],[6,'6%'],[8,'8%']],xl:'years',yl:'growth per year'});
  out+=B.svg;
  out+=E7_poly(range(t+1).map(i=>[B.X(i),B.clipY(g(yr,i))]),C.blue,2.4)+E7_poly(range(t+1).map(i=>[B.X(i),B.clipY(g(yp,i))]),C.coral,2.4);
  out+=TF(400,80,'poor country',13,C.coral,'start')+TF(400,97,'rich country',13,C.blue,'start');
  const gap=yr[t]/yp[t];
  out+=counter(70,322,'poor: income',E7_n(yp[t],2),C.coral,130)+counter(210,322,'rich: income',E7_n(yr[t],2),C.blue,130)+counter(350,322,'rich ÷ poor',E7_n(gap,2)+'×',C.ink,120);
  return {svg:out,phase:s.mode==='same'?`With the same saving rate both head for the same steady state, so the poor country grows faster and the gap shrinks to ${E7_n(gap,2)}× by year ${t}.`:`Saving only 12%, the poor country heads for a lower steady state: it grows only about 1% a year at first, and the gap settles near ${E7_n(Math.pow(E7_kstar(.25,.06)/E7_kstar(.12,.06),E7_A),2)}× and never closes. Convergence is conditional on saving, population growth and technology.`};
 }});

// The production function itself, in 2D and 3D.
SCENE({id:'solow-growth-surface',name:'Diminishing returns, constant scale',tag:'The production function',
 definition:'A Cobb–Douglas production function Y = K^α · L^(1−α) turns capital K and labour L into output Y. Adding more of one input alone gives smaller and smaller gains (diminishing returns), but doubling both inputs together doubles output (constant returns to scale).',
 example:'With α = ⅓, going from 4 to 8 machines for one worker raises output from 1.59 to 2: a 26% gain for 100% more capital. Doubling both machines and workers doubles output exactly.',
 desc:'Output against capital for one worker, with the extra output from one more machine falling as capital grows; the 3D view shows the whole surface of output over capital and labour.',
 research:'Cobb, C. W. & Douglas, P. H. (1928). A theory of production. American Economic Review 18, 139–165. Solow (1956). Gollin, D. (2002). Getting income shares right. Journal of Political Economy 110, 458–474 (capital’s share about a third).',
 dur:9,hint:'Change capital’s share α and the amount of capital. The 3D view shows the surface: along either edge it bends over, along the diagonal it is a straight line.',
 init:()=>({a:.33,k:4}),
 watch(p){return {a:.33,k:Math.round((1+p*15)*2)/2}},
 ui:[{range:'a',label:'Capital’s share α',min:.1,max:.9,step:.01,get:s=>s.a,act:'a'},{range:'k',label:'Capital K (one worker)',min:.5,max:16,step:.5,get:s=>s.k,act:'k'}],
 on:{a(s,v){s.a=Number(v)},k(s,v){s.k=Number(v)}},
 draw(s){
  const a=s.a,f=k=>Math.pow(k,a),mp=k=>a*Math.pow(k,a-1);
  let out=heading('Diminishing returns to one input',28);
  const ym=Math.max(2,Math.ceil(Math.pow(16,a)/2)*2),A=E7_plot(70,60,300,220,[0,16],[0,ym],{xt:[[0,'0'],[4,'4'],[8,'8'],[12,'12'],[16,'16']],yt:[[0,'0'],[ym/2,String(ym/2)],[ym,String(ym)]],xl:'capital K, with one worker',yl:'output Y'});
  out+=A.svg+E7_poly(range(161).map(i=>{const k=i/10;return [A.X(k),A.clipY(f(k))]}),C.blue,3);
  out+=Ci(A.X(s.k),A.clipY(f(s.k)),6,'#fff',C.blue);
  // the step from k to k+1
  const k2=Math.min(16,s.k+1);out+=L(A.X(s.k),A.clipY(f(s.k)),A.X(k2),A.clipY(f(s.k)),C.coral,2)+L(A.X(k2),A.clipY(f(s.k)),A.X(k2),A.clipY(f(k2)),C.coral,3);
  const Yd=Math.pow(2*s.k,a)*Math.pow(2,1-a);
  out+=counter(400,60,'output Y',E7_n(f(s.k),2),C.blue,170)+counter(400,116,'one more machine adds',E7_n(f(k2)-f(s.k),3),C.coral,170)+counter(400,172,'double K and workers',E7_n(Yd,2)+' (= 2×)',C.green,170);
  out+=E7_lines(400,248,['Each extra machine adds','less than the one before.','Double everything and','output doubles.'],13,C.muted);
  return {svg:out,phase:`With α = ${E7_n(a,2)}, the next machine adds ${E7_n(f(k2)-f(s.k),3)} of output, less than the one before (marginal product αK^(α−1) = ${E7_n(mp(s.k),3)}). Doubling both capital and labour gives ${E7_n(Yd,2)}, exactly twice ${E7_n(f(s.k),2)}.`};
 },
 three(s,f,X,project){
  const a=s.a,N=8,max=Math.pow(10,a)*Math.pow(10,1-a);
  const P=project([[0,0,0],[10,10,max*.8]]);let o='';
  const Z=(K,Lb)=>Math.pow(K,a)*Math.pow(Lb,1-a)*.8;
  const faces=[];
  for(let i=0;i<N;i++)for(let j=0;j<N;j++){const k0=i*10/N,k1=(i+1)*10/N,l0=j*10/N,l1=(j+1)*10/N;
   const z=(Z(k0,l0)+Z(k1,l1))/2/(max*.8);faces.push({pts:[[k0,l0,Z(k0,l0)],[k1,l0,Z(k1,l0)],[k1,l1,Z(k1,l1)],[k0,l1,Z(k0,l1)]],fill:z>.5?C.blue:'#5b9bd0',opacity:.35+z*.5})}
  o+=paintFaces(faces,P);
  o+=E7_poly(range(21).map(i=>{const v=i/2;return P([v,v,Z(v,v)]).slice(0,2)}),C.coral,3);
  o+=arrow3([0,0,0],[11.5,0,0],P,C.muted,1.7)+arrow3([0,0,0],[0,11.5,0],P,C.muted,1.7);const ek=P([14.2,0,0]),el=P([0,14.2,0]),top=P([10,10,Z(10,10)]);o+=label3(ek[0],ek[1]+16,'capital K',15,C.muted)+label3(el[0],el[1]+16,'labour L',15,C.muted)+label3(top[0],top[1]-12,'output Y = height',14,C.ink);
  return {svg:o,title:'Output over capital and labour',caption:`The surface Y = K^${E7_n(a,2)}·L^${E7_n(1-a,2)}. Along each edge it bends over (diminishing returns); along the orange diagonal, where both inputs grow together, it rises in a straight line (constant returns to scale).`};
 }});

/* ================================================================ inequality-lorenz */
// Rounded recent World Bank Gini estimates (survey basis differs: income or consumption).
const E7_GINI=[['za','South Africa',63],['br','Brazil',52],['us','United States',41],['cn','China',36],['gb','United Kingdom',33],['in','India',33],['se','Sweden',29],['sk','Slovakia',24]];
const E7_lorenzK=G=>(1+G)/(1-G);
SCENE({id:'inequality-lorenz',name:'Drawing inequality',tag:'The Lorenz curve and the Gini coefficient',
 definition:'Line everyone up from poorest to richest and plot the share of all income held by the bottom fraction of people: that is the Lorenz curve (1905). Perfect equality is the diagonal. The Gini coefficient (1912) is the area between the curve and the diagonal, doubled: 0 is perfect equality, 1 is one person holding everything.',
 example:'A Gini of 33, roughly the United Kingdom’s, means the poorest half receive about a quarter of income; at 63, roughly South Africa’s, they receive only about a twentieth in this simple fitted shape.',
 desc:'A Lorenz curve with the gap to the line of equality shaded, for a chosen country’s Gini, with the share of income held by the poorest half and by the richest tenth.',
 research:'Lorenz, M. O. (1905). Methods of measuring the concentration of wealth. Publications of the American Statistical Association 9, 209–219. Gini, C. (1912). Variabilità e mutabilità. World Bank Poverty and Inequality Platform (Gini estimates, rounded; recent survey years; income or consumption basis varies by country).',
 dur:10,hint:'Pick a country or set your own Gini. The curve here is a one-parameter shape fitted to the Gini, so its shares are approximate; real Lorenz curves have their own shapes, and two countries with the same Gini can differ at the top or bottom.',
 init:()=>({c:'gb',G:33}),
 watch(p){const r=E7_GINI[Math.min(E7_GINI.length-1,Math.floor(p*E7_GINI.length))];return {c:r[0],G:r[2]}},
 ui:[{choose:E7_GINI.map(r=>[r[0],r[1]]),label:'Country',get:s=>s.c,act:'c'},{range:'G',label:'Gini (your own)',min:5,max:80,step:1,get:s=>s.G,act:'G'}],
 on:{c(s,v){s.c=v;const r=E7_GINI.find(q=>q[0]===v);if(r)s.G=r[2]},G(s,v){s.G=Number(v);s.c=''}},
 draw(s){
  const G=s.G/100,k=E7_lorenzK(G),Lz=p=>Math.pow(p,k);
  const row=E7_GINI.find(q=>q[0]===s.c);
  let out=heading('The Lorenz curve',28);
  const A=E7_plot(80,58,250,250,[0,1],[0,1],{xt:[[0,'0'],[.5,'50%'],[1,'100%']],yt:[[0,'0'],[.5,'50%'],[1,'100%']],xl:'share of people, poorest first',yl:'share of income'});
  out+=A.svg;
  const curve=range(101).map(i=>[A.X(i/100),A.Y(Lz(i/100))]);
  out+=`<polygon points="${[[A.X(0),A.Y(0)],[A.X(1),A.Y(1)],...curve.slice().reverse()].map(p=>fmt(p[0])+','+fmt(p[1])).join(' ')}" fill="${C.coralp}" stroke="none"/>`;
  out+=L(A.X(0),A.Y(0),A.X(1),A.Y(1),C.muted,1.6,'stroke-dasharray="5 4"')+E7_poly(curve,C.coral,3);
  out+=TF(A.X(.42),A.Y(.56),'equality',13,C.muted,'middle','transform="rotate(-45 '+fmt(A.X(.42))+' '+fmt(A.Y(.56))+')"');
  const b50=Lz(.5),t10=1-Lz(.9);
  out+=L(A.X(.5),A.Y(0),A.X(.5),A.Y(b50),C.blue,1.5,'stroke-dasharray="4 3"')+Ci(A.X(.5),A.Y(b50),5,C.blue);
  out+=counter(370,58,'Gini',E7_n(G*100,0),C.coral,190)+counter(370,114,'poorest half get',E7_n(b50*100,0)+'%',C.blue,190)+counter(370,170,'richest tenth get',E7_n(t10*100,0)+'%',C.ink,190);
  out+=E7_lines(370,244,[row?row[1]+': about '+row[2]:'Your own Gini: '+s.G,'(World Bank, rounded;','survey basis varies).','Shares from a fitted shape.'],13,C.muted);
  return {svg:out,phase:`${row?row[1]:'This curve'}: Gini ${E7_n(G*100,0)}. The shaded gap between the curve and the diagonal is half the Gini. Here the poorest half receive about ${E7_n(b50*100,0)}% of income and the richest tenth about ${E7_n(t10*100,0)}% (from a fitted curve, so approximate).`};
 }});

// Ten incomes; redistribute and watch the Gini.
const E7_INC0=[8,12,15,18,22,26,31,38,50,80];
SCENE({id:'inequality-lorenz-build',name:'Moving money between ten people',tag:'What changes the Gini',
 definition:'The Gini depends only on relative incomes. Moving money from someone richer to someone poorer, without reversing their order, always lowers it (the Pigou–Dalton principle). Doubling every income leaves it unchanged; giving everyone the same extra amount lowers it.',
 example:'Ten people earning £8k to £80k have a Gini of about 0.36. Moving £10k from the richest to the poorest drops it to about 0.30; doubling everyone’s income leaves it at 0.36.',
 desc:'Bars for ten incomes from poorest to richest, the step-shaped Lorenz curve they make, and the Gini, with buttons that transfer money or change everyone’s income.',
 research:'Dalton, H. (1920). The measurement of the inequality of incomes. Economic Journal 30, 348–361. Atkinson, A. B. (1970). On the measurement of inequality. Journal of Economic Theory 2, 244–263. Cowell, F. (2011). Measuring Inequality, 3rd edn.',
 dur:10,hint:'Press the buttons in the drawing and watch which changes move the Gini and which do not.',
 init:()=>({inc:E7_INC0.slice(),last:''}),
 watch(p){const steps=[['',E7_INC0],['rich→poor',[18,12,15,18,22,26,31,38,50,70]],['double',[36,24,30,36,44,52,62,76,100,140]],['+5 each',[41,29,35,41,49,57,67,81,105,145]]];const st=steps[Math.min(3,Math.floor(p*4))];return {inc:st[1].slice(),last:st[0]}},
 ui:[],
 on:{op(s,v){const a=s.inc.slice().sort((x,y)=>x-y);
  if(v==='rp'){const g=Math.min(10,(a[9]-a[0])/2);a[9]-=g;a[0]+=g;s.last='rich→poor'}
  else if(v==='mp'){const g=Math.min(5,(a[5]-a[0])/2);a[5]-=g;a[0]+=g;s.last='middle→poor'}
  else if(v==='pr'){const g=Math.min(5,a[0]-1);a[0]-=g;a[9]+=g;s.last='poor→rich'}
  else if(v==='dbl'){for(let i=0;i<10;i++)a[i]*=2;s.last='double'}
  else if(v==='add'){for(let i=0;i<10;i++)a[i]+=5;s.last='+5 each'}
  else {s.inc=E7_INC0.slice();s.last='';return 'keep'}
  s.inc=a.map(x=>Math.round(x*10)/10).sort((x,y)=>x-y);return 'keep'}},
 draw(s,f,X){
  const a=s.inc.slice().sort((x,y)=>x-y),G=E7_gini(a),tot=sum(a),mx=Math.max(...a);
  let out=heading('Ten incomes and their Gini',28);
  const bx=40,bw=26,base=230,sc=150/Math.max(80,mx);
  a.forEach((v,i)=>{out+=R(bx+i*bw+3,base-v*sc,bw-6,v*sc,i<5?C.blue:C.coral,'none',3)+TF(bx+i*bw+bw/2,base-v*sc-5,E7_n(v,0),13,C.muted)});
  out+=L(bx,base,bx+10*bw,base,C.line,1.5)+TF(bx+5*bw,base+18,'incomes, £ thousand, poorest first',13,C.muted);
  const A=E7_plot(340,58,200,170,[0,1],[0,1],{xt:[[0,'0'],[1,'100%']],yt:[[0,'0'],[1,'100%']],yl:'Lorenz curve'});
  out+=A.svg+L(A.X(0),A.Y(0),A.X(1),A.Y(1),C.muted,1.4,'stroke-dasharray="5 4"');
  let c=0;const pts=[[A.X(0),A.Y(0)]];a.forEach((v,i)=>{c+=v;pts.push([A.X((i+1)/10),A.Y(c/tot)])});out+=E7_poly(pts,C.coral,2.8);
  out+=counter(340,250,'Gini',E7_n(G,3),C.coral,96)+counter(444,250,'total income',E7_n(tot,0)+'k',C.ink,96);
  const bt=[['rp','Move £10k: richest → poorest'],['mp','Move £5k: middle → poorest'],['pr','Move £5k: poorest → richest'],['dbl','Double every income'],['add','Add £5k to everyone'],['reset','Reset']];
  bt.forEach(([k,lab],i)=>{const col=i%2,row=Math.floor(i/2);out+=E7_btn(X,'op',k,lab,40+col*150,262+row*38,144,32,lab.length>22?[lab.split(': ')[0]+':',lab.split(': ')[1]||'']:lab,{size:12})});
  const msg={'':'Starting incomes.','rich→poor':'A transfer from richer to poorer: the Gini falls.','middle→poor':'Also a transfer to someone poorer: the Gini falls.','poor→rich':'A transfer to someone richer: the Gini rises.','double':'Every income doubled: the Gini is unchanged.','+5 each':'The same amount for everyone: the Gini falls.'}[s.last]||'';
  return {svg:out,phase:`Gini ${E7_n(G,3)}. ${msg} The Gini measures relative shares, so scaling everyone up changes nothing while equal cash additions narrow the shares.`};
 }});

// Piketty's second law: the wealth–income ratio tends to s/g.
SCENE({id:'inequality-lorenz-piketty',name:'Wealth piling up',tag:'Piketty’s r > g, and its critics',
 definition:'Thomas Piketty (2014) argued that when the return on wealth r exceeds the growth rate of the economy g, inherited wealth grows faster than incomes and concentrates. A related accounting rule says the ratio of wealth to yearly income tends to the saving rate divided by the growth rate, s/g.',
 example:'Saving 10% of income with 2% growth, wealth heads towards 5 years of income; with growth of 1% it heads towards 10 years. At a 5% return, wealth’s share of income is then 25% or 50%.',
 desc:'The wealth-to-income ratio over 100 years heading for s/g, with the share of income going to owners of wealth (r times the ratio) and a flag for whether r exceeds g.',
 research:'Piketty, T. (2014). Capital in the Twenty-First Century. Harvard University Press. Piketty, T. & Zucman, G. (2014). Capital is back. QJE 129, 1255–1310. Critiques: Rognlie, M. (2015). Brookings Papers on Economic Activity (housing); Acemoglu, D. & Robinson, J. A. (2015). Journal of Economic Perspectives 29(1), 3–28; Krusell, P. & Smith, A. A. (2015). JPE 123, 725–748 (net against gross saving).',
 dur:10,hint:'Change saving, growth and the return. The s/g rule is accounting under assumptions; whether r > g drives inequality in practice is debated, and critics point to housing, institutions and how saving is measured.',
 init:()=>({s:.1,g:.02,r:.05,t:100}),
 watch(p){return {s:.1,g:p<.5?.02:.01,r:.05,t:Math.round((p<.5?p*2:(p-.5)*2)*100)}},
 ui:[{range:'s',label:'Saving rate s',min:.04,max:.16,step:.01,get:s=>s.s,act:'s',show:v=>Math.round(v*100)+'%'},
  {range:'g',label:'Growth g',min:.005,max:.04,step:.005,get:s=>s.g,act:'g',show:v=>E7_n(v*100,1)+'%'},
  {range:'r',label:'Return on wealth r',min:.02,max:.07,step:.005,get:s=>s.r,act:'r',show:v=>E7_n(v*100,1)+'%'},
  {range:'t',label:'Year',min:0,max:100,step:1,get:s=>s.t,act:'t'}],
 on:{s(s,v){s.s=Number(v)},g(s,v){s.g=Number(v)},r(s,v){s.r=Number(v)},t(s,v){s.t=Number(v)}},
 draw(s){
  const t=clamp(Math.round(s.t),0,100),target=s.s/s.g,path=[3];for(let i=1;i<=100;i++)path.push((path[i-1]+s.s)/(1+s.g));
  const b=path[t];
  let out=heading('Wealth piling up: β → s/g',28);
  const A=E7_plot(70,60,300,220,[0,100],[0,16],{xt:[[0,'0'],[50,'50'],[100,'100']],yt:[[0,'0'],[4,'4'],[8,'8'],[12,'12'],[16,'16']],xl:'years',yl:'wealth ÷ yearly income (β)'});
  out+=A.svg;
  if(target<=16)out+=L(A.X(0),A.Y(target),A.X(100),A.Y(target),C.green,1.5,'stroke-dasharray="5 4"')+TF(A.X(100)-4,A.Y(target)-6,'s/g = '+E7_n(target,1),13,C.green,'end');
  out+=E7_poly(path.slice(0,t+1).map((v,i)=>[A.X(i),A.clipY(v)]),C.blue,3)+Ci(A.X(t),A.clipY(b),5,C.blue);
  const share=s.r*b,rg=s.r>s.g;
  out+=counter(400,60,'β now',E7_n(b,2)+' years',C.blue,170)+counter(400,116,'owners’ share r·β',E7_n(Math.min(1,share)*100,0)+'%',C.coral,170)+counter(400,172,'r compared with g',rg?'r > g':'r ≤ g',rg?C.coral:C.green,170);
  out+=E7_lines(400,246,['Debated: housing, measured','saving and institutions','change the story.'],13,C.muted);
  return {svg:out,phase:`β moves from 3 towards s/g = ${E7_n(target,1)}: each year saving adds ${Math.round(s.s*100)}% of income while growth of ${E7_n(s.g*100,1)}% dilutes it. With r = ${E7_n(s.r*100,1)}%, owners of wealth receive about ${E7_n(Math.min(1,share)*100,0)}% of income. This is Piketty’s accounting; its link to rising inequality is contested.`};
 }});

/* ================================================================ poverty-traps */
// An S-shaped map with three fixed points: low (stable), threshold (unstable), high (stable).
const E7_f=k=>.6+9.2/(1+Math.exp(-1.6*(k-5)));
function E7_fixed(){const out=[];let prev=E7_f(0)-0;for(let i=1;i<=1000;i++){const k=i/100,v=E7_f(k)-k;if((prev>0)!==(v>0))out.push(k-.005);prev=v}return out}
const E7_FIX=E7_fixed();
SCENE({id:'poverty-traps',name:'Stuck or taking off',tag:'An S-shaped curve and two equilibria',
 definition:'If a household or country needs a minimum level of assets, nutrition or skills before investment pays off, next year’s capital can depend on this year’s in an S shape. Then there are two stable resting points, poor and better off, separated by a threshold. Below it, people drift back to poverty; above it, they climb.',
 example:'Starting with 4 units of capital, this toy economy sinks to about 0.6; starting with 6, it rises to about 9.8. The threshold sits near 4.9.',
 desc:'A staircase (cobweb) diagram of next year’s capital against this year’s, with the S-shaped curve, the 45° line and three crossing points, from a chosen starting level.',
 research:'Nelson, R. R. (1956). A theory of the low-level equilibrium trap. AER 46, 894–908. Azariadis, C. & Stachurski, J. (2005). Poverty traps. Handbook of Economic Growth 1A, 295–384. Kraay, A. & McKenzie, D. (2014). Do poverty traps exist? Journal of Economic Perspectives 28(3), 127–148.',
 dur:10,hint:'Slide the starting capital either side of 5 and watch the staircase. This is a toy model: whether real people face thresholds like this is the question the evidence scene takes up.',
 init:()=>({k0:4}),
 watch(p){return {k0:p<.5?4:6,steps:Math.round(((p<.5?p:p-.5)*2)*14)}},
 ui:[{range:'k0',label:'Starting capital',min:.2,max:9.8,step:.1,get:s=>s.k0,act:'k0'}],
 on:{k0(s,v){s.k0=Number(v);s.steps=undefined}},
 draw(s){
  const n=s.steps===undefined?14:s.steps;
  let out=heading('A poverty trap: two places to rest',28);
  const A=E7_plot(80,58,260,260,[0,10],[0,10],{xt:[[0,'0'],[5,'5'],[10,'10']],yt:[[0,'0'],[5,'5'],[10,'10']],xl:'capital this year',yl:'capital next year'});
  out+=A.svg+L(A.X(0),A.Y(0),A.X(10),A.Y(10),C.muted,1.5,'stroke-dasharray="5 4"');
  out+=E7_poly(range(201).map(i=>{const k=i/20;return [A.X(k),A.clipY(E7_f(k))]}),C.blue,3);
  let k=s.k0;const stair=[[A.X(k),A.Y(0)]];for(let i=0;i<n;i++){const k2=E7_f(k);stair.push([A.X(k),A.Y(k2)]);stair.push([A.X(k2),A.Y(k2)]);k=k2}
  out+=E7_poly(stair,C.coral,1.8)+Ci(A.X(s.k0),A.Y(0),6,C.coral);
  E7_FIX.forEach((x,i)=>{const st=i!==1;out+=Ci(A.X(x),A.Y(x),6,st?C.green:'#fff',C.green)});
  out+=TF(A.X(E7_FIX[1])+8,A.Y(E7_FIX[1])+16,'threshold',13,C.green,'start');
  out+=counter(380,58,'start',E7_n(s.k0,1),C.coral,180)+counter(380,114,`after ${n} years`,E7_n(k,2),C.blue,180);
  out+=E7_lines(380,190,['Filled dots: stable','resting points.','Hollow dot: the threshold',`(≈ ${E7_n(E7_FIX[1],1)}). Below it you`,'sink; above it you climb.'],13,C.muted);
  const up=s.k0>E7_FIX[1];
  return {svg:out,phase:`Starting at ${E7_n(s.k0,1)}, ${up?'above':'below'} the threshold of about ${E7_n(E7_FIX[1],1)}, the economy ${up?'climbs to the high resting point near '+E7_n(E7_FIX[2],1):'sinks to the low resting point near '+E7_n(E7_FIX[0],1)}. Where the S-curve is above the 45° line capital grows; where it is below, capital shrinks.`};
 }});

SCENE({id:'poverty-traps-push',name:'A big push?',tag:'Aid across a threshold',
 definition:'If a poverty trap exists, a one-off transfer large enough to lift people over the threshold could change their path for good, an idea behind “big push” aid (Sachs). If there is no threshold, or the transfer falls short, the effect fades. Critics (Easterly) argue that top-down plans rarely work this way.',
 example:'From the low resting point, a one-off gift of 3 units falls back; a gift of 5 carries the economy over the threshold and it keeps climbing.',
 desc:'Capital over 30 years from the low resting point, with a one-off boost of chosen size in year 5 and the threshold marked.',
 research:'Rosenstein-Rodan, P. N. (1943). Problems of industrialisation of eastern and south-eastern Europe. Economic Journal 53, 202–211. Sachs, J. (2005). The End of Poverty. Easterly, W. (2006). The White Man’s Burden. Banerjee, A. & Duflo, E. (2011). Poor Economics.',
 dur:9,hint:'Change the size of the one-off boost. In the toy model what matters is whether it crosses the threshold, not its size as such.',
 init:()=>({g:5}),
 watch(p){return {g:Math.round(p*8*2)/2}},
 ui:[{range:'g',label:'One-off boost in year 5',min:0,max:8,step:.5,get:s=>s.g,act:'g'}],
 on:{g(s,v){s.g=Number(v)}},
 draw(s){
  const low=E7_FIX[0],th=E7_FIX[1],path=[low];for(let t=1;t<=30;t++){let k=E7_f(path[t-1]);if(t===5)k+=s.g;path.push(Math.min(10,k))}
  let out=heading('A one-off push',28);
  const A=E7_plot(70,60,330,220,[0,30],[0,10],{xt:[[0,'0'],[5,'5'],[10,'10'],[20,'20'],[30,'30']],yt:[[0,'0'],[5,'5'],[10,'10']],xl:'years',yl:'capital'});
  out+=A.svg+L(A.X(0),A.Y(th),A.X(30),A.Y(th),C.green,1.5,'stroke-dasharray="5 4"')+TF(A.X(30)-4,A.Y(th)-6,'threshold',13,C.green,'end');
  out+=L(A.X(5),A.Y(0),A.X(5),A.Y(10),C.muted,1,'stroke-dasharray="2 4"')+TF(A.X(5)+4,A.Y(9.4),'boost',13,C.muted,'start');
  out+=E7_poly(path.map((v,i)=>[A.X(i),A.Y(v)]),C.blue,3);
  const end=path[30],over=end>th;
  out+=counter(430,60,'boost',E7_n(s.g,1),C.coral,140)+counter(430,116,'capital in year 30',E7_n(end,1),over?C.green:C.coral,140);
  out+=E7_lines(430,192,[over?'Crossed the threshold:':'Fell back:',over?'it keeps climbing.':'the gain faded.','','Sachs: aid can push.','Easterly: plans rarely','work like this.'],13,C.muted);
  return {svg:out,phase:over?`A boost of ${E7_n(s.g,1)} in year 5 lifts capital above the threshold (about ${E7_n(th,1)}), so the economy climbs to the high resting point and stays there.`:`A boost of ${E7_n(s.g,1)} leaves capital below the threshold (about ${E7_n(th,1)}), so it drifts back to the low resting point: the aid helped for a while, then faded.`};
 }});

const E7_TRAPEV=[
 {k:'kraay',t:'Kraay & McKenzie',y:'2014',v:'Mostly no',lines:['A review of nutrition, savings and','geographic traps found little','evidence for traps affecting','whole countries or most people.']},
 {k:'grad',t:'Banerjee et al.',y:'2015',v:'Lasting gains',lines:['A “graduation” programme (an asset,','training, support) in six countries','raised consumption and assets a','year after support ended.']},
 {k:'bangla',t:'Balboni et al.',y:'2022',v:'A threshold',lines:['In Bangladesh, women given livestock','above a threshold kept climbing;','those below it slid back, the','pattern a trap predicts.']},
 {k:'cash',t:'Cash transfers',y:'2016 on',v:'Mixed',lines:['Unconditional cash raises assets','and spending, but long-run','gains vary by study and','often fade.']}];
SCENE({id:'poverty-traps-evidence',name:'Do poverty traps exist?',tag:'What the evidence says',
 definition:'Poverty traps are a testable claim: if they exist, a big enough one-off help should change long-run paths, while a small one should not. Field studies find little sign of traps for whole countries, but some evidence for asset thresholds among the very poorest households.',
 example:'Balboni and colleagues found that Bangladeshi women who received livestock pushing them above a threshold kept growing richer, while those below it fell back.',
 desc:'Four evidence cards: a review that found little support for broad traps, a six-country graduation trial, a Bangladesh study that found a threshold, and cash transfers.',
 research:'Kraay & McKenzie (2014), JEP 28(3). Banerjee, A. et al. (2015). A multifaceted program causes lasting progress for the very poor. Science 348, 1260799. Balboni, C., Bandiera, O., Burgess, R., Ghatak, M. & Heil, A. (2022). Why do people stay poor? QJE 137, 785–844. Haushofer, J. & Shapiro, J. (2016). QJE 131, 1973–2042.',
 dur:10,hint:'Press each card. The overall verdict is mixed: traps are not the general rule, but some of the very poorest may face them.',
 init:()=>({c:'kraay'}),
 watch(p){return {c:E7_TRAPEV[Math.min(3,Math.floor(p*4))].k}},
 ui:[],
 on:{c(s,v){s.c=v}},
 draw(s,f,X){
  let out=heading('Do poverty traps exist?',28);
  E7_TRAPEV.forEach((e,i)=>{const x=24+i*140,sel=s.c===e.k;out+=E7_btn(X,'c',e.k,'Show '+e.t,x,52,132,56,[e.t,e.v],{sel,size:12,bold:true})});
  const e=E7_TRAPEV.find(q=>q.k===s.c)||E7_TRAPEV[0];
  out+=R(40,126,520,130,'#fff',C.grid,10)+TBF(60,152,e.t+' '+e.y,15,C.ink,'start')+TBF(540,152,e.v,14,C.coral,'end')+E7_lines(60,180,e.lines,14,C.ink,'start',19);
  out+=R(40,272,520,62,C.pale,'none',10)+E7_lines(60,296,['Verdict so far (debated): not a general rule for countries,','but some of the very poorest may face asset thresholds.'],13,C.ink);
  return {svg:out,phase:`${e.t} (${e.y}): ${e.lines.join(' ')} Overall, the evidence is mixed and still argued over.`};
 }});

/* ================================================================ randomised-trials */
// 200 villages; outcomes depend on unobserved motivation; the programme adds the true effect.
function E7_trial(effect,mode,seed){
 const r=rng(seed),vs=[];for(let i=0;i<200;i++){const m=E7_norm(r),noise=E7_norm(r)*6;const treat=mode==='random'?r()<.5:(m+E7_norm(r)*.5)>0;vs.push({m,treat,y:50+8*m+(treat?effect:0)+noise})}
 const T=vs.filter(v=>v.treat),Cc=vs.filter(v=>!v.treat),mt=sum(T.map(v=>v.y))/T.length,mc=sum(Cc.map(v=>v.y))/Cc.length;
 return {vs,mt,mc,est:mt-mc,nT:T.length,nC:Cc.length};
}
SCENE({id:'randomised-trials',name:'Why toss a coin?',tag:'Randomised trials against self-selection',
 definition:'To learn whether a programme works, compare people who got it with people who did not. If people choose for themselves, the keenest join and would have done better anyway, so the comparison is biased. Assigning the programme by lottery makes the two groups alike on average, so the difference is the programme’s effect.',
 example:'With a true effect of 3 points, letting villages opt in gives an estimate near 15, because motivated villages join; a lottery gives estimates that scatter around 3.',
 desc:'Two hundred villages as dots, treated and comparison groups side by side with their averages, and the estimated effect against the true one, for self-selected or random assignment.',
 research:'Fisher, R. A. (1935). The Design of Experiments. Banerjee, A. V. & Duflo, E. (2011). Poor Economics; Duflo, E., Glennerster, R. & Kremer, M. (2007). Using randomization in development economics research: a toolkit. Handbook of Development Economics 4. Nobel Memorial Prize in Economic Sciences 2019 (Banerjee, Duflo, Kremer). Deaton, A. (2010). Instruments, randomization, and learning about development. JEL 48, 424–455 (critique).',
 dur:10,hint:'Set the true effect, then switch between letting villages choose and a lottery, and draw new villages. Random assignment removes selection bias; it does not, as critics such as Deaton note, tell you whether the result carries to other places.',
 init:()=>({eff:3,mode:'self',seed:7}),
 watch(p){return {eff:3,mode:p<.5?'self':'random',seed:7+Math.floor(p*4)}},
 ui:[{range:'eff',label:'True effect (points)',min:0,max:10,step:1,get:s=>s.eff,act:'eff'},{choose:[['self','Villages choose'],['random','Lottery']],label:'Who gets it',get:s=>s.mode,act:'mode'},{b:'New villages',act:'seed'}],
 on:{eff(s,v){s.eff=Number(v)},mode(s,v){s.mode=v},seed(s){s.seed=(s.seed%97)+1;return 'keep'}},
 draw(s){
  const tr=E7_trial(s.eff,s.mode,s.seed);
  let out=heading(s.mode==='random'?'A lottery decides':'Villages choose for themselves',28);
  const A=E7_plot(70,58,270,230,[0,2],[10,90],{yt:[[10,'10'],[50,'50'],[90,'90']],yl:'outcome score'});
  out+=A.svg;
  const r=rng(s.seed*13+1);
  tr.vs.forEach(v=>{const x=(v.treat?1.5:.5)+(r()-.5)*.6;out+=Ci(A.X(x),A.clipY(v.y),2.6,v.treat?C.coral:C.blue,'none','opacity=".55"')});
  out+=L(A.X(.15),A.Y(tr.mc),A.X(.85),A.Y(tr.mc),C.blue,3)+L(A.X(1.15),A.Y(tr.mt),A.X(1.85),A.Y(tr.mt),C.coral,3);
  out+=TF(A.X(.5),A.Y(10)+18,`comparison (${tr.nC})`,13,C.blue)+TF(A.X(1.5),A.Y(10)+18,`programme (${tr.nT})`,13,C.coral);
  const bias=tr.est-s.eff;
  out+=counter(370,58,'true effect',E7_n(s.eff,0),C.green,190)+counter(370,114,'estimated effect',E7_n(tr.est,1),C.coral,190)+counter(370,170,'error from selection',E7_n(bias,1),Math.abs(bias)>2?C.coral:C.green,190);
  out+=E7_lines(370,244,s.mode==='random'?['A lottery makes the groups','alike on average, so the','gap is the programme.']:['Motivated villages join and','would have done better','anyway: the gap overstates it.'],13,C.muted);
  return {svg:out,phase:s.mode==='random'?`With a lottery the estimate is ${E7_n(tr.est,1)} against a true effect of ${s.eff}: only chance error remains, and new draws scatter around the truth.`:`Letting villages choose gives ${E7_n(tr.est,1)} against a true effect of ${s.eff}: the motivated villages that joined would have scored higher anyway, so most of the gap is selection, not the programme.`};
 }});

SCENE({id:'randomised-trials-power',name:'How big a trial?',tag:'Statistical power and the smallest detectable effect',
 definition:'A trial can only detect effects bigger than its noise. The minimum detectable effect, for the usual 5% significance and 80% power, is about 2.8 standard errors. Small trials therefore miss modest effects, and when they do find one, it is often exaggerated.',
 example:'With 200 people split evenly, a trial can reliably detect an effect of about 0.4 standard deviations; to detect 0.1 it needs about 3,100.',
 desc:'The minimum detectable effect against trial size on a log scale, and the chance of detecting a chosen true effect at the chosen size.',
 research:'Cohen, J. (1988). Statistical Power Analysis for the Behavioral Sciences, 2nd edn. Duflo, Glennerster & Kremer (2007). Ioannidis, J. P. A., Stanley, T. D. & Doucouliagos, H. (2017). The power of bias in economics research. Economic Journal 127, F236–F265 (median power in economics about 18%).',
 dur:9,hint:'Change the number of people and the true effect. Effects are in standard deviations of the outcome; the formulas assume two equal groups and a normal approximation.',
 init:()=>({N:200,eff:.2}),
 watch(p){return {N:Math.round(Math.pow(10,1.7+p*2)),eff:.2}},
 ui:[{range:'lN',label:'People in the trial',min:1.7,max:4,step:.05,get:s=>Math.log10(s.N),act:'lN',show:v=>String(Math.round(Math.pow(10,v)))},{range:'eff',label:'True effect (SD)',min:.05,max:.8,step:.05,get:s=>s.eff,act:'eff'}],
 on:{lN(s,v){s.N=Math.round(Math.pow(10,Number(v)))},eff(s,v){s.eff=Number(v)}},
 draw(s){
  const se=N=>2/Math.sqrt(N),mde=N=>2.8*se(N),pow=E7_Phi(s.eff/se(s.N)-1.96);
  let out=heading('How big must a trial be?',28);
  const A=E7_plot(80,58,280,230,[50,10000],[0,1.2],{logx:true,xt:[[50,'50'],[100,'100'],[1000,'1,000'],[10000,'10,000']],yt:[[0,'0'],[.4,'0.4'],[.8,'0.8'],[1.2,'1.2']],xl:'people in the trial (log scale)',yl:'smallest detectable effect (SD)'});
  out+=A.svg+E7_poly(range(81).map(i=>{const N=50*Math.pow(200,i/80);return [A.X(N),A.clipY(mde(N))]}),C.blue,3);
  out+=L(A.X(50),A.Y(s.eff),A.X(10000),A.Y(s.eff),C.coral,1.6,'stroke-dasharray="5 4"')+TF(A.X(50)+6,A.Y(s.eff)-6,'true effect',13,C.coral,'start');
  out+=Ci(A.X(s.N),A.clipY(mde(s.N)),6,'#fff',C.blue);
  out+=counter(390,58,'people',String(s.N),C.ink,170)+counter(390,114,'detectable effect',E7_n(mde(s.N),2)+' SD',C.blue,170)+counter(390,170,'chance of detecting',E7_n(pow*100,0)+'%',pow>=.8?C.green:C.coral,170);
  out+=E7_lines(390,244,['Below the blue curve,','a real effect is more','likely to be missed.'],13,C.muted);
  return {svg:out,phase:`With ${s.N} people, the smallest effect detectable with 80% power is about ${E7_n(mde(s.N),2)} SD. A true effect of ${E7_n(s.eff,2)} SD would be found ${E7_n(pow*100,0)}% of the time. Many published economics studies are underpowered (Ioannidis et al. 2017).`};
 }});

const E7_WORMS=[
 {k:'2004',t:'2004 · Miguel & Kremer',lines:['Deworming whole schools in Kenya cut','school absence by about a quarter, and','helped untreated children nearby too.']},
 {k:'2015a',t:'2015 · Re-analysis',lines:['An independent replication found coding','errors; some results weakened under','other analysis choices (Aiken; Davey).']},
 {k:'2015b',t:'2015 · Authors’ reply',lines:['The original team argued the main','findings survive once the errors','are fixed (Hicks, Kremer & Miguel).']},
 {k:'2019',t:'Cochrane reviews',lines:['Systematic reviews of many trials found','little reliable effect of routine','deworming on school outcomes.']},
 {k:'2021',t:'2021 · Twenty years on',lines:['A long-run follow-up of the Kenyan','children reported higher earnings and','consumption (Hamory et al.).']}];
SCENE({id:'randomised-trials-worms',name:'The worm wars',tag:'A famous trial and its argument',
 definition:'A 2004 study of school deworming in Kenya became one of the best-known randomised trials in development, and the basis for large programmes. A decade later its re-analysis started a public argument, the “worm wars”, about what the evidence shows.',
 example:'Supporters point to long-run earnings gains; critics point to reviews finding little effect on schooling. Both sides use randomised evidence; they disagree about which results to trust and how far they generalise.',
 desc:'Five cards from the original study to the twenty-year follow-up, each with what it found; the verdict is marked contested.',
 research:'Miguel, E. & Kremer, M. (2004). Worms. Econometrica 72, 159–217. Aiken, A. M. et al. (2015) and Davey, C. et al. (2015). International Journal of Epidemiology 44, 1572–1592. Hicks, J. H., Kremer, M. & Miguel, E. (2015). IJE 44, 1593–1596. Taylor-Robinson, D. C. et al. (2019). Cochrane Database of Systematic Reviews CD000371. Hamory, J. et al. (2021). PNAS 118, e2023185118.',
 dur:10,hint:'Press each card in turn. The point is not to pick a side: it is that even a randomised trial needs replication, re-analysis and long-run follow-up.',
 init:()=>({c:'2004'}),
 watch(p){return {c:E7_WORMS[Math.min(4,Math.floor(p*5))].k}},
 ui:[],
 on:{c(s,v){s.c=v}},
 draw(s,f,X){
  let out=heading('The worm wars',28);
  const x0=40,y0=70,w=520;out+=L(x0,y0+20,x0+w,y0+20,C.line,3);
  E7_WORMS.forEach((e,i)=>{const x=x0+i*w/4,sel=s.c===e.k;out+=hit(X,'c',e.k,'Show '+e.t,Ci(x,y0+20,sel?12:9,sel?C.coral:'#fff',C.coral)+TF(x,y0+48,e.t.split(' · ')[0],13,sel?C.coral:C.muted))});
  const e=E7_WORMS.find(q=>q.k===s.c)||E7_WORMS[0];
  out+=R(40,140,520,120,'#fff',C.grid,10)+TBF(60,168,e.t,15,C.ink,'start')+E7_lines(60,196,e.lines,14,C.ink,'start',20);
  out+=R(40,276,520,52,C.coralp,'none',10)+TBF(60,307,'Status: contested',14,C.coral,'start')+TF(540,307,'replication, re-analysis, follow-up',13,C.ink,'end');
  return {svg:out,phase:`${e.t}: ${e.lines.join(' ')}`};
 }});

/* ================================================================ institutions */
// Illustrative points in the shape of Acemoglu, Johnson & Robinson's reversal of fortune (not their data).
const E7_REV=(()=>{const r=rng(311),pts=[];for(let i=0;i<22;i++){const u=1+r()*18;pts.push([u,10.2-.13*u+E7_norm(r)*.45])}return pts})();
SCENE({id:'institutions',name:'A reversal of fortune',tag:'Institutions and long-run prosperity',
 definition:'Among former European colonies, places that were richest around 1500, measured by how urbanised they were, are on average poorer today. Acemoglu, Johnson and Robinson argued that colonisers set up extractive institutions where there were many people and riches to take, and settler institutions with property rights where there were few, and that those institutions persisted.',
 example:'Densely populated, urbanised regions such as the Aztec and Inca lands or Mughal India became poorer than thinly settled North America, Australia and New Zealand.',
 desc:'An illustrative scatter of urbanisation in 1500 against income today among former colonies, with a falling fitted line; the points mimic the published pattern and are not the authors’ data.',
 research:'Acemoglu, D., Johnson, S. & Robinson, J. A. (2002). Reversal of fortune. QJE 117, 1231–1294. North, D. C. (1990). Institutions, Institutional Change and Economic Performance. Nobel Memorial Prize in Economic Sciences 2024 (Acemoglu, Johnson, Robinson).',
 dur:9,hint:'Switch the fitted line on and off. The claim is about institutions, not geography or culture as such. The next two scenes show how it was tested and how it is challenged.',
 init:()=>({line:1}),
 watch(p){return {line:p>.4?1:0}},
 ui:[{choose:[['0','Points only'],['1','With fitted line']],label:'Show',get:s=>String(s.line),act:'line'}],
 on:{line(s,v){s.line=Number(v)}},
 draw(s){
  let out=heading('Former colonies: a reversal of fortune',28);
  const A=E7_plot(80,58,320,240,[0,20],[6,11],{xt:[[0,'0%'],[10,'10%'],[20,'20%']],yt:[[6,'6'],[8,'8'],[10,'10']],xl:'urbanisation around 1500',yl:'income today (log, illustrative)'});
  out+=A.svg;E7_REV.forEach(([u,y])=>{out+=Ci(A.X(u),A.clipY(y),5,C.blue,'none','opacity=".75"')});
  if(s.line){const n=E7_REV.length,mx=sum(E7_REV.map(p=>p[0]))/n,my=sum(E7_REV.map(p=>p[1]))/n;let sxy=0,sxx=0;E7_REV.forEach(([x,y])=>{sxy+=(x-mx)*(y-my);sxx+=(x-mx)*(x-mx)});const b=sxy/sxx,a=my-b*mx;out+=L(A.X(0),A.clipY(a),A.X(20),A.clipY(a+b*20),C.coral,3)}
  out+=E7_lines(420,80,['Richer in 1500,','poorer today.','','Points are illustrative,','in the shape of the','published pattern.'],13,C.muted);
  return {svg:out,phase:'Among former colonies, the more urbanised a place was in 1500, the poorer it tends to be today. The proposed reason is the institutions colonisers built: extractive where there was wealth to take, inclusive where Europeans settled. The points shown are illustrative.'};
 }});

SCENE({id:'institutions-settler',name:'Settler mortality as a natural experiment',tag:'How the institutions claim was tested',
 definition:'Rich countries may have good institutions because they are rich, so a simple correlation proves little. Acemoglu, Johnson and Robinson (2001) used the death rates of early European settlers as an “instrument”: where settlers died in large numbers they built extractive institutions instead of settling, and those institutions shaped income centuries later.',
 example:'In the stylised version here, moving from low settler mortality (about 10 per 1,000 a year) to high (about 1,000) lowers the institutions score by about 3 points and predicted income per head roughly 18-fold.',
 desc:'A three-link chain from settler mortality to the quality of institutions to income today, with a slider for settler mortality and stylised slopes of about the published size.',
 research:'Acemoglu, D., Johnson, S. & Robinson, J. A. (2001). The colonial origins of comparative development. AER 91, 1369–1401. Albouy, D. Y. (2012). The colonial origins of comparative development: comment. AER 102, 3059–3076 (data critique) and the authors’ reply, AER 102, 3077–3110.',
 dur:9,hint:'Slide settler mortality. The slopes are stylised to roughly the size reported in 2001; critics dispute the mortality data and whether mortality affects income only through institutions.',
 init:()=>({lm:4.5}),
 watch(p){return {lm:2.3+p*4.6}},
 ui:[{range:'lm',label:'Settler deaths per 1,000 a year (log)',min:2.3,max:6.9,step:.1,get:s=>s.lm,act:'lm',show:v=>String(Math.round(Math.exp(v)))}],
 on:{lm(s,v){s.lm=Number(v)}},
 draw(s){
  const inst=clamp(9.6-.6*(s.lm-2.3)*1.1,3,10),lgdp=.95*inst+.5;
  let out=heading('Settler mortality → institutions → income',28);
  const bx=[[30,'Settler deaths',String(Math.round(Math.exp(s.lm)))+' per 1,000',C.coral],[220,'Institutions',E7_n(inst,1)+' / 10',C.blue],[410,'Income per head','≈ $'+(Math.round(Math.exp(lgdp)/100)*100).toLocaleString('en-GB'),C.green]];
  bx.forEach(([x,t,v,c])=>{out+=R(x,70,160,90,'#fff',c,10)+TBF(x+80,100,t,14,c)+TBF(x+80,134,v,17,C.ink)});
  out+=arrow(192,115,218,115,C.muted,2.5)+arrow(382,115,408,115,C.muted,2.5);
  out+=TF(205,184,'built extractive',13,C.muted)+TF(205,200,'rule where settlers died',13,C.muted)+TF(395,184,'property rights,',13,C.muted)+TF(395,200,'courts, limits on rulers',13,C.muted);
  const w=Math.max(0,(inst-3)/7);out+=R(230,144,140,6,C.grid,'none',3)+R(230,144,140*w,6,C.blue,'none',3);
  out+=R(40,236,520,92,C.pale,'none',10)+E7_lines(60,260,['Stylised slopes of about the published size (AJR 2001).','Critique: Albouy (2012) disputed the mortality data; others','argue mortality also works through disease and skills.'],13,C.ink,'start',20);
  return {svg:out,phase:`Higher settler mortality (here ${Math.round(Math.exp(s.lm))} per 1,000) predicts weaker institutions (${E7_n(inst,1)}/10), which in turn predict lower income today. The chain is stylised; both the data and the exclusion assumption are disputed.`};
 }});

const E7_INSTV=[
 {k:'korea',b:'Korea',t:'A natural experiment',lines:['North and South Korea shared history,','geography and culture until 1945.','Under different institutions their','incomes diverged hugely.'],tag:'supports'},
 {k:'geo',b:'Geography',t:'Geography',lines:['Sachs and others argue disease,','climate and access to the sea','matter directly, not only','through institutions.'],tag:'challenges'},
 {k:'hc',b:'Skills first',t:'Skills first',lines:['Glaeser and co-authors argue','education and human capital','come first and good institutions','follow growth.'],tag:'challenges'},
 {k:'data',b:'The data',t:'The data',lines:['Albouy found many mortality','figures were borrowed from','other places; results weaken','when they are dropped.'],tag:'challenges'},
 {k:'nobel',b:'Nobel 2024',t:'Nobel 2024',lines:['The 2024 prize recognised','studies of how institutions','are formed and affect','prosperity.'],tag:'context'}];
SCENE({id:'institutions-critiques',name:'Institutions, geography or skills?',tag:'The case and its critics',
 definition:'The institutions view is influential and was recognised by the 2024 Nobel prize, but it is debated. Rival explanations stress geography and disease, or education and skills; others question the historical data used to test it.',
 example:'The Korean peninsula is often cited for institutions: one people, one geography, two systems, very different incomes. Critics reply that such cases are rare and that geography and skills also matter.',
 desc:'Five cards: the Korean natural experiment, the geography view, the skills-first view, the data critique and the 2024 Nobel, each marked as supporting, challenging or context.',
 research:'Acemoglu, Johnson & Robinson (2001, 2002). Sachs, J. D. (2003). Institutions don’t rule. NBER Working Paper 9490. Glaeser, E. L., La Porta, R., Lopez-de-Silanes, F. & Shleifer, A. (2004). Do institutions cause growth? Journal of Economic Growth 9, 271–303. Albouy (2012). Royal Swedish Academy of Sciences (2024), scientific background to the prize.',
 dur:10,hint:'Press each card. Most economists now think institutions, geography and skills all matter; they disagree about weights and about which causes which.',
 init:()=>({c:'korea'}),
 watch(p){return {c:E7_INSTV[Math.min(4,Math.floor(p*5))].k}},
 ui:[],
 on:{c(s,v){s.c=v}},
 draw(s,f,X){
  let out=heading('Institutions, geography or skills?',28);
  E7_INSTV.forEach((e,i)=>{const x=20+i*114,sel=s.c===e.k,col=e.tag==='supports'?C.green:e.tag==='challenges'?C.coral:C.muted;out+=E7_btn(X,'c',e.k,'Show '+e.t,x,52,106,54,[e.b,e.tag],{sel,size:12,bold:true,ink:sel?C.ink:col})});
  const e=E7_INSTV.find(q=>q.k===s.c)||E7_INSTV[0],col=e.tag==='supports'?C.green:e.tag==='challenges'?C.coral:C.muted;
  out+=R(40,126,520,140,'#fff',col,10)+TBF(60,154,e.t,15,C.ink,'start')+TBF(540,154,e.tag,14,col,'end')+E7_lines(60,184,e.lines,14,C.ink,'start',20);
  out+=TF(300,300,'Most economists think all three matter; the weights are debated.',13,C.muted);
  return {svg:out,phase:`${e.t} (${e.tag}): ${e.lines.join(' ')}`};
 }});

/* ================================================================ trade-globalisation */
// Approximate real income growth 1988–2008 by global income percentile, read from Lakner & Milanović's figure.
const E7_ELEPH=[[5,20],[10,30],[15,38],[20,45],[25,52],[30,58],[35,65],[40,70],[45,74],[50,77],[55,78],[60,75],[65,68],[70,55],[75,38],[80,12],[85,5],[90,10],[95,28],[99,65]];
SCENE({id:'trade-globalisation',name:'The elephant curve',tag:'Who gained from globalisation, 1988–2008',
 definition:'Lining up the whole world by income, Christoph Lakner and Branko Milanović plotted how much each percentile’s real income grew between 1988 and 2008. The curve looks like an elephant: big gains for the global middle (much of it in Asia) and the very top, little for people around the 80th percentile, many of them in the lower-middle class of rich countries.',
 example:'Around the global median, incomes grew by roughly three-quarters; around the 80th percentile they barely grew; the top 1% gained about two-thirds.',
 desc:'Real income growth from 1988 to 2008 by global income percentile, an elephant-shaped curve, with a chosen percentile marked; values are read approximately from the published figure.',
 research:'Lakner, C. & Milanović, B. (2016). Global income distribution: from the fall of the Berlin Wall to the Great Recession. World Bank Economic Review 30, 203–232. Milanović, B. (2016). Global Inequality. Corlett, A. (2016). Examining an elephant. Resolution Foundation (composition effects).',
 dur:9,hint:'Slide along the percentiles. The values are approximate readings. Critics note that people move between percentiles over twenty years, and that country composition changes shape the trunk and the dip.',
 init:()=>({p:50}),
 watch(p){return {p:Math.round(5+p*94)}},
 ui:[{range:'p',label:'Global income percentile',min:5,max:99,step:1,get:s=>s.p,act:'p'}],
 on:{p(s,v){s.p=Number(v)}},
 draw(s){
  const g=pp=>{let a=E7_ELEPH[0],b=E7_ELEPH[E7_ELEPH.length-1];for(let i=1;i<E7_ELEPH.length;i++)if(E7_ELEPH[i][0]>=pp){a=E7_ELEPH[i-1];b=E7_ELEPH[i];break}return pp<=a[0]?a[1]:a[1]+(b[1]-a[1])*(pp-a[0])/(b[0]-a[0])};
  let out=heading('The elephant curve, 1988–2008',28);
  const A=E7_plot(80,58,330,240,[0,100],[0,90],{xt:[[0,'0'],[25,'25'],[50,'50'],[75,'75'],[100,'100']],yt:[[0,'0%'],[30,'30%'],[60,'60%'],[90,'90%']],xl:'global income percentile (poorest to richest)',yl:'real income growth (approximate)'});
  out+=A.svg+E7_poly(E7_ELEPH.map(([x,y])=>[A.X(x),A.Y(y)]),C.blue,3);
  E7_ELEPH.forEach(([x,y])=>{out+=Ci(A.X(x),A.Y(y),3,C.blue)});
  const v=g(s.p);out+=L(A.X(s.p),A.Y(0),A.X(s.p),A.Y(v),C.coral,1.6,'stroke-dasharray="4 3"')+Ci(A.X(s.p),A.Y(v),6,'#fff',C.coral);
  out+=counter(430,58,'percentile',String(s.p),C.ink,140)+counter(430,114,'growth 1988–2008',E7_n(v,0)+'%',C.coral,140);
  const who=s.p<40?'Poorer half: gains,':s.p<70?'Global middle, much in':s.p<92?'Near the 80th: rich-':'The global top:';
  const who2=s.p<40?'but from a low base.':s.p<70?'China and Asia: big gains.':s.p<92?'country lower middle class.':'large gains.';
  out+=E7_lines(430,196,[who,who2,'','Readings approximate;','people move between','percentiles.'],13,C.muted);
  return {svg:out,phase:`At the ${s.p}th global percentile, real income grew by about ${E7_n(v,0)}% between 1988 and 2008 (approximate reading of Lakner and Milanović’s curve). The shape shows who gained: the rising Asian middle and the very top, much more than the rich world’s lower middle class.`};
 }});

// Stylised commuting zones: import exposure in $1,000 per worker over ten years.
const E7_ZONES=[['A',.5],['B',1],['C',1.5],['D',2],['E',2.5],['F',3],['G',4],['H',5]];
SCENE({id:'trade-globalisation-china-shock',name:'The China shock',tag:'Concentrated losses from trade',
 definition:'When China joined the world trading system, US imports from China rose sharply. Autor, Dorn and Hanson compared local labour markets: places whose industries faced more import competition lost more manufacturing jobs, and the losses persisted, with lower wages and more people out of work.',
 example:'In their estimates, each extra $1,000 of Chinese imports per worker over a decade lowered the share of working-age adults in manufacturing by roughly 0.6 percentage points.',
 desc:'Eight stylised local labour markets with rising import exposure, and bars for the predicted fall in manufacturing employment, scaled by a chosen size of the national shock.',
 research:'Autor, D. H., Dorn, D. & Hanson, G. H. (2013). The China syndrome. AER 103, 2121–2168. Acemoglu, D., Autor, D., Dorn, D., Hanson, G. H. & Price, B. (2016). Import competition and the great US employment sag of the 2000s. Journal of Labor Economics 34, S141–S198. Autor, Dorn & Hanson (2016). The China shock. Annual Review of Economics 8, 205–240.',
 dur:9,hint:'Scale the size of the national shock. The coefficient is the rough published size; the eight places are stylised, not real counties. Gains from cheaper goods were spread across all consumers; losses were concentrated in particular towns.',
 init:()=>({sc:1}),
 watch(p){return {sc:Math.round((.25+p*1.75)*4)/4}},
 ui:[{range:'sc',label:'Size of the national shock (× 2000s level)',min:.25,max:2,step:.25,get:s=>s.sc,act:'sc',show:v=>E7_n(v,2)+'×'}],
 on:{sc(s,v){s.sc=Number(v)}},
 draw(s){
  let out=heading('The China shock, place by place',28);
  const A=E7_plot(80,58,340,230,[0,8],[-6,0],{yt:[[0,'0'],[-2,'−2'],[-4,'−4'],[-6,'−6']],yl:'change in manufacturing share of adults (pp)'});
  out+=A.svg;
  E7_ZONES.forEach(([n,x],i)=>{const ex=x*s.sc,d=Math.max(-6,-.6*ex),bx=A.X(i+.15),bw=A.X(i+.85)-bx;out+=R(bx,A.Y(0),bw,A.Y(d)-A.Y(0),C.coral,'none',3)+TF(A.X(i+.5),A.Y(-6)+17,n,13,C.ink)+TF(A.X(i+.5),Math.min(A.Y(d)+16,A.Y(-6)-6),E7_n(ex,1),13,C.muted)});
  out+=TF(A.X(4),A.Y(-6)+35,'places A–H; numbers: import exposure, $1,000 per worker',13,C.muted);
  const worst=-.6*E7_ZONES[7][1]*s.sc;
  out+=counter(440,58,'most exposed place',E7_n(Math.max(-6,worst),1)+' pp',C.coral,130)+counter(440,114,'least exposed',E7_n(-.6*E7_ZONES[0][1]*s.sc,1)+' pp',C.blue,130);
  out+=E7_lines(440,194,['Losses concentrate','in exposed towns;','cheaper goods','benefit everyone','a little.'],13,C.muted);
  return {svg:out,phase:`At ${E7_n(s.sc,2)}× the 2000s shock, the most exposed place loses about ${E7_n(Math.abs(Math.max(-6,worst)),1)} percentage points of its adults’ manufacturing employment, the least exposed about ${E7_n(.6*E7_ZONES[0][1]*s.sc,1)}. The coefficient (about −0.6 per $1,000) is the rough published size; the places are stylised.`};
 }});

// A small open economy facing a world price, with a tariff.
SCENE({id:'trade-globalisation-tariff',name:'What a tariff does',tag:'Winners, losers and deadweight loss',
 definition:'A tariff is a tax on imports. It raises the domestic price, so local producers sell more and gain, the government collects revenue, and consumers pay more and buy less. The consumers’ loss is larger than the other gains combined: the difference is the deadweight loss, two small triangles of trade that no longer happen.',
 example:'With demand Q = 100 − P, supply Q = P and a world price of 30, a tariff of 10 raises the price to 40: consumers lose 650, producers gain 350, the government collects 200 and 100 is simply lost.',
 desc:'A supply and demand diagram for a small open economy with the world price, a chosen tariff, the areas for producer gain, government revenue and the two deadweight-loss triangles, and a tally of each.',
 research:'Marshall, A. (1890). Principles of Economics. Krugman, P., Obstfeld, M. & Melitz, M. (2018). International Economics, 11th edn, chapter 9. Amiti, M., Redding, S. J. & Weinstein, D. E. (2019). The impact of the 2018 tariffs on prices and welfare. Journal of Economic Perspectives 33(4), 187–210.',
 dur:9,hint:'Raise the tariff. In this simple model the deadweight loss grows with the square of the tariff; at a tariff of 20, imports stop entirely. The model ignores large-country effects on world prices and any strategic reasons for tariffs.',
 init:()=>({t:10}),
 watch(p){return {t:Math.round(p*20)}},
 ui:[{range:'t',label:'Tariff per unit',min:0,max:20,step:1,get:s=>s.t,act:'t'}],
 on:{t(s,v){s.t=Number(v)}},
 draw(s){
  const pw=30,t=s.t,p=pw+t,qs0=pw,qd0=100-pw,qs=p,qd=100-p;
  const cs=(qd0+qd)/2*t,ps=(qs0+qs)/2*t,rev=t*(qd-qs),dwl=cs-ps-rev;
  let out=heading('What a tariff does',28);
  const A=E7_plot(70,58,300,250,[0,100],[0,100],{xt:[[0,'0'],[50,'50'],[100,'100']],yt:[[0,'0'],[30,'30'],[50,'50'],[100,'100']],xl:'quantity',yl:'price'});
  out+=A.svg;
  const poly=(pts,fill)=>`<polygon points="${pts.map(q=>fmt(A.X(q[0]))+','+fmt(A.Y(q[1]))).join(' ')}" fill="${fill}" stroke="none"/>`;
  if(t>0){out+=poly([[0,pw],[qs0,pw],[qs,p],[0,p]],C.greenp)+poly([[qs,pw],[qd,pw],[qd,p],[qs,p]],C.pale)+poly([[qs0,pw],[qs,pw],[qs,p]],C.coralp)+poly([[qd,pw],[qd0,pw],[qd,p]],C.coralp)}
  out+=E7_poly([[A.X(0),A.Y(100)],[A.X(100),A.Y(0)]],C.blue,2.8)+E7_poly([[A.X(0),A.Y(0)],[A.X(100),A.Y(100)]],C.green,2.8);
  out+=L(A.X(0),A.Y(pw),A.X(100),A.Y(pw),C.muted,1.6,'stroke-dasharray="5 4"')+TF(A.X(100)-4,A.Y(pw)+16,'world 30',13,C.muted,'end');
  if(t>0)out+=L(A.X(0),A.Y(p),A.X(100),A.Y(p),C.coral,2)+TF(A.X(100)-4,A.Y(p)-6,'with tariff '+p,13,C.coral,'end');
  out+=TF(A.X(14),A.Y(92),'demand',13,C.blue,'start')+TF(A.X(74),A.Y(80),'supply',13,C.green,'end');
  out+=counter(400,58,'consumers lose',E7_n(cs,0),C.coral,170)+counter(400,110,'producers gain',E7_n(ps,0),C.green,170)+counter(400,162,'tariff revenue',E7_n(rev,0),C.blue,170)+counter(400,214,'deadweight loss',E7_n(dwl,0),C.coral,170);
  out+=TF(485,286,'imports: '+E7_n(Math.max(0,qd-qs),0)+' (were 40)',13,C.ink);
  return {svg:out,phase:`A tariff of ${t} lifts the price from 30 to ${p}. Consumers lose ${E7_n(cs,0)}; producers gain ${E7_n(ps,0)} and the government collects ${E7_n(rev,0)}, leaving a deadweight loss of ${E7_n(dwl,0)} (t² = ${t*t}): trades worth more than they cost that no longer happen.`};
 }});
