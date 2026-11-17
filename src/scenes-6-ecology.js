/* ===================== Biology era 6 · Ecosystems ===================== */
// Populations grow and stop, predators and prey cycle, competitors exclude or share, energy thins out up
// a food chain, islands balance arrivals against losses, and matter cycles. Most scenes are simulations the
// learner steers. Every picture is a pure function of state, frame and X; ODEs use fixed-step RK4 and are
// cached by their parameters, so Watch, rewind and Try it agree.
const B6_poly=(pts,col,w=2.4,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function B6_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
function B6_btn(X,act,arg,label,x,y,w,h,text,o={}){
 const inner=R(x,y,w,h,o.fill||'#fff',o.stroke||C.line,9,o.sel?'stroke-width="3"':'stroke-width="1.5"')+(Array.isArray(text)?text.map((t,i)=>TF(x+w/2,y+h/2+5+(i-(text.length-1)/2)*17,t,o.size||13,o.ink||C.ink)).join(''):TF(x+w/2,y+h/2+5,text,o.size||14,o.ink||C.ink,'middle',o.bold?'font-weight="700"':''));
 return hit(X,act,arg,label,inner);
}
// Fixed-step RK4 for a system y' = f(t, y); returns samples every `every` steps.
function B6_solve(f,y0,T,dt,every=1,hook){
 let y=y0.slice(),t=0;const out=[{t,y:y.slice()}],n=Math.round(T/dt);
 for(let i=1;i<=n;i++){
  const k1=f(t,y),k2=f(t+dt/2,y.map((v,j)=>v+dt/2*k1[j])),k3=f(t+dt/2,y.map((v,j)=>v+dt/2*k2[j])),k4=f(t+dt,y.map((v,j)=>v+dt*k3[j]));
  y=y.map((v,j)=>v+dt/6*(k1[j]+2*k2[j]+2*k3[j]+k4[j]));t=i*dt;if(hook)y=hook(t,y);
  if(i%every===0)out.push({t,y:y.slice()});
 }
 return out;
}
const B6_cache=new Map();
function B6_memo(key,fn){if(B6_cache.has(key))return B6_cache.get(key);const v=fn();if(B6_cache.size>200)B6_cache.clear();B6_cache.set(key,v);return v}
// Sample a solution at time t (nearest earlier sample).
const B6_at=(sol,t)=>{let lo=0,hi=sol.length-1;while(lo<hi){const m=(lo+hi+1)>>1;if(sol[m].t<=t)lo=m;else hi=m-1}return sol[lo]};
const B6_k=v=>v>=1e4?Math.round(v/1000)+'k':v>=100?String(Math.round(v)):v>=10?v.toFixed(1):v>=1?v.toFixed(2):String(Number(v.toPrecision(2)));

/* ================================================================ logistic-growth */
const B6_logistic=(t,N0,r,K)=>K/(1+(K-N0)/N0*Math.exp(-r*t));
SCENE({id:'logistic-growth',name:'Growth meets a limit',tag:'Exponential and logistic growth',
 definition:'With plenty of food a population grows exponentially, by the same fraction each step. Resources run short as it grows, so growth slows and levels off at the carrying capacity K: the S-shaped logistic curve.',
 example:'With r = 0.5 per day a population grows by about 65% a day while small; with K = 500 it slows down and settles at 500.',
 desc:'Population against time for exponential growth (dashed) and logistic growth (solid), with a second plot of the growth rate dN/dt against N, a hump that peaks at K/2.',
 research:'Malthus, T. R. (1798). An Essay on the Principle of Population. Verhulst, P.-F. (1838). Notice sur la loi que la population suit dans son accroissement. Pearl, R. & Reed, L. J. (1920). PNAS 6, 275–288.',
 dur:10,hint:'Change the growth rate r, the carrying capacity K and the starting size. The fastest growth is always at half of K.',
 init:()=>({r:.5,K:500,N0:10}),
 watch(p){return {r:.5,K:500,N0:10,cur:p*20}},
 ui:[{range:'r',label:'Growth rate r (per day)',min:.1,max:1,step:.05,get:s=>s.r,act:'r',show:v=>Number(v).toFixed(2)},
  {range:'K',label:'Carrying capacity K',min:100,max:900,step:50,get:s=>s.K,act:'K'},
  {range:'N0',label:'Starting population',min:2,max:200,step:2,get:s=>s.N0,act:'N0'}],
 on:{r(s,v){s.r=Number(v);return 'keep'},K(s,v){s.K=Number(v);return 'keep'},N0(s,v){s.N0=Number(v);return 'keep'}},
 draw(s){
  const T=20,cur=s.cur===undefined?T:s.cur,{r,K,N0}=s;let out=heading('Exponential and logistic growth',28);
  const pl=B6_plot(70,58,300,232,[0,T],[0,1000],{xt:[[0,'0'],[5,'5'],[10,'10'],[15,'15'],[20,'20']],yt:[[0,'0'],[250,'250'],[500,'500'],[750,'750'],[1000,'1000']],xl:'time (days)',yl:'population N'});
  out+=pl.svg+L(pl.X(0),pl.Y(K),pl.X(T),pl.Y(K),C.green,1.5,'stroke-dasharray="6 5"')+TF(pl.X(0)+8,pl.Y(K)-6,'K = '+K,13,C.green,'start');
  const ts=range(201).map(i=>i/200*cur);
  const ex=[];for(const t of ts){const v=N0*Math.exp(r*t);if(v>1000){ex.push([pl.X(Math.log(1000/N0)/r),pl.Y(1000)]);break}ex.push([pl.X(t),pl.Y(v)])}
  out+=B6_poly(ex,C.coral,2,'stroke-dasharray="6 4"');
  out+=B6_poly(ts.map(t=>[pl.X(t),pl.Y(B6_logistic(t,N0,r,K))]),C.blue,3);
  const N=B6_logistic(cur,N0,r,K);out+=Ci(pl.X(cur),pl.Y(N),6,C.blue,'#fff');
  out+=TF(80,78,'dashed: exponential (no limit)',13,C.coral,'start');
  // Growth rate against N.
  const g=B6_plot(420,58,160,140,[0,1000],[0,250],{xt:[[0,'0'],[1000,'1000']],yt:[[0,'0'],[125,'125'],[250,'250']],xl:'N',xlDy:31,yl:'dN/dt'});
  out+=g.svg;const gmax=r*K/4;
  out+=B6_poly(range(61).map(i=>{const n=i/60*K;return [g.X(n),g.Y(Math.min(250,r*n*(1-n/K)))]}),C.blue,2.4);
  out+=L(g.X(K/2),g.Y(0),g.X(K/2),g.Y(Math.min(250,gmax)),C.green,1.3,'stroke-dasharray="4 4"');
  out+=Ci(g.X(N),g.Y(Math.min(250,r*N*(1-N/K))),5,C.blue,'#fff');
  out+=counter(420,262,'N now',B6_k(N),C.blue,76)+counter(504,262,'dN/dt now',(r*N*(1-N/K)).toFixed(1),C.coral,76);
  out+=TF(500,334,`fastest: ${gmax.toFixed(0)} a day at N = ${K/2}`,13,C.green);
  return {svg:out,phase:`Logistic growth: dN/dt = rN(1 − N/K). While N is small it looks exponential; near K the brake (1 − N/K) takes over. Growth is fastest at N = K/2 = ${K/2}. Here at day ${cur.toFixed(1)} the population is ${B6_k(N)}.`};
 }});

// Carlson's yeast counts (1913), as tabulated by Pearl (1927): amount of yeast every hour.
const B6_YEAST=[9.6,18.3,29.0,47.2,71.1,119.1,174.6,257.3,350.7,441.0,513.3,559.7,594.8,629.4,640.8,651.1,655.9,659.6,661.8];
function B6_yeastErr(r,K){let ss=0,st=0;const m=sum(B6_YEAST)/B6_YEAST.length;B6_YEAST.forEach((y,t)=>{const e=y-B6_logistic(t,9.6,r,K);ss+=e*e;st+=(y-m)*(y-m)});return {rms:Math.sqrt(ss/B6_YEAST.length),r2:1-ss/st}}
// Best fit by a coarse grid then a fine grid (deterministic).
const B6_YEAST_BEST=(()=>{let best={r:.5,K:600,e:1e9};for(let r=.3;r<=.8;r+=.005)for(let K=600;K<=720;K+=1){const e=B6_yeastErr(r,K).rms;if(e<best.e)best={r,K,e}}return best})();
SCENE({id:'logistic-growth-yeast',name:'Fitting yeast in a flask',tag:'A real S-curve',
 definition:'Yeast in a flask of sugar solution grows almost exponentially at first, then levels off as food runs short and waste builds up, close to a logistic curve.',
 example:'Carlson’s yeast went from 9.6 to about 660 units in 18 hours; a logistic curve with r ≈ 0.54 per hour and K ≈ 665 follows the points closely.',
 desc:'Carlson’s hourly yeast counts as dots, with a logistic curve whose growth rate and carrying capacity the learner sets, and the fit error.',
 research:'Carlson, T. (1913). Über Geschwindigkeit und Grösse der Hefevermehrung in Würze. Biochemische Zeitschrift 57, 313–334; data as tabulated by Pearl, R. (1927). The growth of populations. Quarterly Review of Biology 2, 532–548.',
 dur:10,hint:'Move r and K until the curve runs through the dots. The error falls as the fit improves; Best fit shows the least-squares answer.',
 init:()=>({r:.35,K:800}),
 watch(p){const u=smooth(p/.8);return {r:lerp(.35,B6_YEAST_BEST.r,u),K:Math.round(lerp(800,B6_YEAST_BEST.K,u))}},
 ui:[{range:'r',label:'Growth rate r (per hour)',min:.2,max:.9,step:.01,get:s=>s.r,act:'r',show:v=>Number(v).toFixed(2)},
  {range:'K',label:'Carrying capacity K',min:400,max:900,step:5,get:s=>s.K,act:'K'},{b:'Best fit',act:'best'}],
 on:{r(s,v){s.r=Number(v);return 'keep'},K(s,v){s.K=Number(v);return 'keep'},best(s){s.r=Math.round(B6_YEAST_BEST.r*100)/100;s.K=B6_YEAST_BEST.K;return 'keep'}},
 draw(s){
  let out=heading('Yeast in a flask (Carlson 1913)',28);
  const pl=B6_plot(70,58,330,236,[0,18],[0,900],{xt:[[0,'0'],[6,'6'],[12,'12'],[18,'18']],yt:[[0,'0'],[300,'300'],[600,'600'],[900,'900']],xl:'time (hours)',yl:'amount of yeast'});
  out+=pl.svg;
  out+=B6_poly(range(181).map(i=>{const t=i/10;return [pl.X(t),pl.Y(Math.min(900,B6_logistic(t,9.6,s.r,s.K)))]}),C.blue,2.6);
  B6_YEAST.forEach((y,t)=>out+=Ci(pl.X(t),pl.Y(y),4.5,C.coral,'#fff'));
  const e=B6_yeastErr(s.r,s.K);
  out+=TF(80,78,'dots: measured',13,C.coral,'start')+TF(80,96,'line: your logistic curve',13,C.blue,'start');
  out+=counter(430,70,'r (per hour)',s.r.toFixed(2),C.blue,150)+counter(430,126,'K',String(s.K),C.green,150);
  out+=counter(430,182,'typical miss (RMS)',e.rms.toFixed(1),e.rms<10?C.green:C.coral,150)+counter(430,238,'variance explained',(Math.max(0,e.r2)*100).toFixed(1)+'%',C.ink,150);
  out+=TF(505,310,`best: r ${B6_YEAST_BEST.r.toFixed(2)}, K ${B6_YEAST_BEST.K}`,13,C.muted);
  return {svg:out,phase:`A logistic curve with r = ${s.r.toFixed(2)} and K = ${s.K} misses the measurements by ${e.rms.toFixed(1)} units on average. The least-squares fit (r ≈ ${B6_YEAST_BEST.r.toFixed(2)}, K ≈ ${B6_YEAST_BEST.K}) is close, but not perfect: real yeast slows a little earlier than the simple model says.`};
 }});

// Harvesting a logistic stock (Schaefer model): quota or fixed effort.
function B6_harvest(mode,h){return B6_memo('hv'+mode+h,()=>B6_solve((t,y)=>{const N=Math.max(0,y[0]);return [.5*N*(1-N/1000)-(mode==='quota'?(N>0.5?h:0):h/1000*N)]},[1000],60,.02,10,(t,y)=>[Math.max(0,y[0])]))}
SCENE({id:'logistic-growth-harvest',name:'Harvesting and collapse',tag:'Maximum sustainable yield',
 definition:'A population grows fastest at half its carrying capacity, so in theory harvesting that growth gives the largest catch that can be taken for ever: the maximum sustainable yield. Take a fixed quota above it and the stock collapses.',
 example:'With r = 0.5 per year and K = 1000 the maximum sustainable yield is rK/4 = 125 a year. A quota of 130 a year drives the stock to zero.',
 desc:'A fish stock over 60 years under a fixed quota or a fixed fishing effort, beside the growth curve with the harvest drawn on it; where they cross, the stock can settle.',
 research:'Schaefer, M. B. (1954). Some aspects of the dynamics of populations important to the management of commercial marine fisheries. Bulletin of the Inter-American Tropical Tuna Commission 1, 27–56. Larkin, P. A. (1977). An epitaph for the concept of maximum sustained yield. Transactions of the American Fisheries Society 106, 1–11. Myers, Hutchings & Barrowman (1997). Why do fish stocks collapse? The example of cod in Atlantic Canada. Ecological Applications 7, 91–106.',
 dur:12,hint:'Change the quota or the effort; the rule follows the slider you move. A quota above 125 collapses the stock; effort-based fishing is more forgiving.',
 init:()=>({mode:'quota',q:100,e:20}),
 watch(p){return {mode:'quota',q:Math.round(lerp(60,140,p)),e:20}},
 ui:[{choose:[['quota','Fixed quota'],['effort','Fixed effort']],label:'Rule',get:s=>s.mode,act:'mode'},
  {range:'q',label:'Quota (fish per year)',min:0,max:200,step:5,get:s=>s.q,act:'q'},{range:'e',label:'Effort (% of the stock a year)',min:0,max:60,step:2,get:s=>s.e,act:'e',show:v=>v+'%'}],
 on:{mode(s,v){s.mode=v;return 'keep'},q(s,v){s.q=Number(v);s.mode='quota';return 'keep'},e(s,v){s.e=Number(v);s.mode='effort';return 'keep'}},
 draw(s){
  const h=s.mode==='quota'?s.q:s.e*10,sol=B6_harvest(s.mode,h);let out=heading(s.mode==='quota'?`A fixed quota of ${s.q} a year`:`A fixed effort: ${s.e}% of the stock a year`,28);
  const pl=B6_plot(70,58,270,230,[0,60],[0,1100],{xt:[[0,'0'],[20,'20'],[40,'40'],[60,'60']],yt:[[0,'0'],[500,'500'],[1000,'1000']],xl:'years',yl:'stock size'});
  out+=pl.svg+B6_poly(sol.map(o=>[pl.X(o.t),pl.Y(o.y[0])]),C.blue,2.8);
  const end=sol[sol.length-1].y[0],gone=end<5;
  const g=B6_plot(400,58,180,160,[0,1000],[0,160],{xt:[[0,'0'],[1000,'1000']],yt:[[0,'0'],[125,'125']],xl:'stock size',xlDy:31,yl:'growth or catch per year'});
  out+=g.svg+B6_poly(range(61).map(i=>{const n=i/60*1000;return [g.X(n),g.Y(.5*n*(1-n/1000))]}),C.green,2.4);
  if(s.mode==='quota')out+=L(g.X(0),g.Y(Math.min(160,h)),g.X(1000),g.Y(Math.min(160,h)),C.coral,2.2);
  else{const k=h/1000,x2=k*1000>160?160/k:1000;out+=L(g.X(0),g.Y(0),g.X(x2),g.Y(Math.min(160,k*x2)),C.coral,2.2)}
  out+=TF(490,270,'green: growth   coral: catch',13,C.muted);
  out+=counter(400,280,'stock after 60 years',gone?'collapsed':Math.round(end),gone?C.coral:C.blue,180);
  const yieldNow=gone?0:(s.mode==='quota'?s.q:h/1000*end);
  out+=counter(400,330,'catch per year then',Math.round(yieldNow),C.ink,180);
  return {svg:out,phase:s.mode==='quota'?(s.q>125?`A quota of ${s.q} is more than the stock can ever grow in a year (at most 125), so it falls every year until nothing is left. Real stocks also fluctuate, so even a quota at exactly 125 is unsafe (Larkin 1977).`:`Where the coral line crosses the green hump the stock can balance its losses. The stock settles at ${Math.round(end)}; a quota close to 125 leaves almost no margin for a bad year.`):`With a fixed effort the catch falls as the stock falls, which pulls it back from the brink. Effort of 50% a year or more (r itself) still empties the sea. The settled catch here is ${Math.round(yieldNow)} a year.`};
 }});

/* ================================================================ predator-prey */
const B6_LV=(a,c,x0)=>B6_memo('lv'+a+'|'+c+'|'+x0,()=>B6_solve((t,y)=>[a*y[0]-.05*y[0]*y[1],.02*y[0]*y[1]-c*y[1]],[x0,15],30,.005,4));
SCENE({id:'predator-prey',name:'Predators and prey',tag:'The Lotka–Volterra cycle',
 definition:'In the simplest model, prey multiply and are eaten, while predators starve without prey and breed when they eat. The two populations rise and fall in a cycle, with the predator peak following the prey peak.',
 example:'Lotka (1925) and Volterra (1926) found the same equations independently; Volterra was explaining why predatory fish increased in the Adriatic when fishing stopped during the First World War.',
 desc:'Prey (blue) and predators (coral) against time, and the same run as a closed loop in the phase plane of prey against predators, around the equilibrium point.',
 research:'Lotka, A. J. (1925). Elements of Physical Biology. Volterra, V. (1926). Fluctuations in the abundance of a species considered mathematically. Nature 118, 558–560 (prompted by D’Ancona’s Adriatic fishery data).',
 dur:12,hint:'Change the prey growth rate, the predator death rate and the starting number of prey. Every run is a closed loop round the same balance point.',
 init:()=>({a:1,c:.8,x0:60}),
 watch(p){return {a:1,c:.8,x0:60,cur:p*30}},
 ui:[{range:'a',label:'Prey growth rate',min:.4,max:1.6,step:.1,get:s=>s.a,act:'a',show:v=>Number(v).toFixed(1)},
  {range:'c',label:'Predator death rate',min:.4,max:1.4,step:.1,get:s=>s.c,act:'c',show:v=>Number(v).toFixed(1)},
  {range:'x0',label:'Starting prey',min:10,max:100,step:5,get:s=>s.x0,act:'x0'}],
 on:{a(s,v){s.a=Number(v);return 'keep'},c(s,v){s.c=Number(v);return 'keep'},x0(s,v){s.x0=Number(v);return 'keep'}},
 draw(s){
  const sol=B6_LV(s.a,s.c,s.x0),cur=s.cur===undefined?30:s.cur,pts=sol.filter(o=>o.t<=cur+1e-9);
  const ymax=Math.max(...sol.map(o=>Math.max(o.y[0],o.y[1])))*1.1,top=Math.max(50,Math.ceil(ymax/50)*50);
  let out=heading('Predators and prey (Lotka–Volterra)',28);
  const pl=B6_plot(64,58,290,226,[0,30],[0,top],{xt:[[0,'0'],[10,'10'],[20,'20'],[30,'30']],yt:[[0,'0'],[top/2,String(top/2)],[top,String(top)]],xl:'time',yl:'numbers'});
  out+=pl.svg+B6_poly(pts.map(o=>[pl.X(o.t),pl.Y(o.y[0])]),C.blue,2.6)+B6_poly(pts.map(o=>[pl.X(o.t),pl.Y(o.y[1])]),C.coral,2.6);
  out+=TF(74,78,'prey',13,C.blue,'start')+TF(118,78,'predators',13,C.coral,'start');
  const xs=s.c/.02,ys=s.a/.05,mx=Math.ceil(Math.max(...sol.map(o=>o.y[0]))*1.1/10)*10,my=Math.ceil(Math.max(...sol.map(o=>o.y[1]))*1.1/10)*10,ph=B6_plot(400,58,180,180,[0,mx],[0,my],{xt:[[0,'0'],[mx,String(mx)]],yt:[[0,'0'],[my,String(my)]],xl:'prey',xlDy:31,yl:'predators'});
  out+=ph.svg+B6_poly(sol.map(o=>[ph.X(o.y[0]),ph.Y(o.y[1])]),C.line,1.6)+B6_poly(pts.map(o=>[ph.X(o.y[0]),ph.Y(o.y[1])]),C.purple,2.4);
  if(xs<=mx&&ys<=my)out+=Ci(ph.X(xs),ph.Y(ys),4,C.green);
  const last=pts[pts.length-1];out+=Ci(ph.X(last.y[0]),ph.Y(last.y[1]),5.5,C.purple,'#fff')+Ci(pl.X(last.t),pl.Y(last.y[0]),5,C.blue,'#fff')+Ci(pl.X(last.t),pl.Y(last.y[1]),5,C.coral,'#fff');
  const V=o=>.02*o.y[0]-s.c*Math.log(o.y[0])+.05*o.y[1]-s.a*Math.log(o.y[1]);
  out+=TF(490,290,'green dot: balance point',13,C.green)+TF(490,308,`${Math.round(xs)} prey · ${Math.round(ys)} predators`,13,C.green);
  out+=TF(490,332,`conserved quantity ${V(last).toFixed(3)}`,13,C.muted);
  return {svg:out,phase:`The predator peak always lags the prey peak. In the phase plane the run is a closed loop that goes anticlockwise round the balance point (${Math.round(xs)} prey, ${Math.round(ys)} predators): the model conserves a quantity, so it repeats for ever. Real populations are noisier, and the loop’s exact size depends on where it starts.`};
 },
 three(s,f,X,project){
  const sol=B6_LV(s.a,s.c,s.x0),tx=Math.max(...sol.map(o=>o.y[0])),ty=Math.max(...sol.map(o=>o.y[1]));
  const P=project([[0,0,0],[3,3,3.8]]),sx=v=>v/tx*3,sy=v=>v/ty*3;let o=axes3(P,['prey','predators','time'],[3,3,3.8]);
  const pts=sol.map(q=>P([sx(q.y[0]),sy(q.y[1]),q.t/10]));
  o+=`<polyline points="${pts.map(p=>fmt(p[0])+','+fmt(p[1])).join(' ')}" fill="none" stroke="${C.purple}" stroke-width="2.4"/>`;
  const sh=sol.map(q=>P([sx(q.y[0]),sy(q.y[1]),0]));o+=`<polyline points="${sh.map(p=>fmt(p[0])+','+fmt(p[1])).join(' ')}" fill="none" stroke="${C.line}" stroke-width="1.4" stroke-dasharray="4 4"/>`;
  return {svg:o,title:'The cycle unrolled in time',caption:'With time as the third axis the closed loop becomes a spiral staircase; its shadow on the floor is the loop in the phase plane.'};
 }});

// Hudson’s Bay Company pelt records, 1900–1920, in thousands, as tabulated in many ecology textbooks.
const B6_PELTS={yr:range(21).map(i=>1900+i),hare:[30,47.2,70.2,77.4,36.3,20.6,18.1,21.4,22,25.4,27.1,40.3,57,76.6,52.3,19.5,11.2,7.6,14.6,16.2,24.7],lynx:[4,6.1,9.8,35.2,59.4,41.7,19,13,8.3,9.1,7.4,8,12.3,19.5,45.7,51.1,29.7,15.8,9.7,10.1,8.6]};
SCENE({id:'predator-prey-lynx',name:'Hares and lynx',tag:'A famous cycle, read carefully',
 definition:'The snowshoe hare and the Canada lynx rise and fall about every ten years. The cycle looks like Lotka–Volterra, but experiments show the hares’ food matters as much as the lynx.',
 example:'Hare pelts peaked in 1903 and 1913; lynx pelts peaked a year or two later, in 1904 and 1915.',
 desc:'Pelts traded to the Hudson’s Bay Company from 1900 to 1920 as two lines over time or as a loop of hare against lynx, and the results of the Kluane field experiment as bars.',
 research:'MacLulich, D. A. (1937). Fluctuations in the numbers of the varying hare. University of Toronto Studies. Elton, C. & Nicholson, M. (1942). The ten-year cycle in numbers of the lynx in Canada. Journal of Animal Ecology 11, 215–244. Gilpin, M. E. (1973). Do hares eat lynx? American Naturalist 107, 727–730. Krebs, C. J. et al. (1995). Impact of food and predation on the snowshoe hare cycle. Science 269, 1112–1115.',
 dur:12,hint:'Move through the years, switch to the loop, then look at the Kluane experiment, which changed food and predators directly.',
 init:()=>({view:'time',yr:1920}),
 watch(p){return p<.7?{view:'time',yr:Math.round(1900+p/.7*20)}:{view:p<.88?'loop':'kluane',yr:1920}},
 ui:[{choose:[['time','Over time'],['loop','Hare against lynx'],['kluane','Kluane experiment']],label:'View',get:s=>s.view,act:'view'},
  {range:'yr',label:'Up to year',min:1900,max:1920,step:1,get:s=>s.yr,act:'yr'}],
 on:{view(s,v){s.view=v;return 'keep'},yr(s,v){s.yr=Number(v);return 'keep'}},
 draw(s){
  const D=B6_PELTS,n=s.yr-1900+1;let out=heading('Hudson’s Bay Company pelts, 1900–1920',28);
  if(s.view==='time'){
   const pl=B6_plot(70,62,500,226,[1899,1921],[0,80],{xt:[[1900,'1900'],[1905,'1905'],[1910,'1910'],[1915,'1915'],[1920,'1920']],yt:[[0,'0'],[40,'40'],[80,'80']],xl:'year',yl:'pelts (thousands)'});
   out+=pl.svg+B6_poly(range(n).map(i=>[pl.X(D.yr[i]),pl.Y(D.hare[i])]),C.blue,2.6)+B6_poly(range(n).map(i=>[pl.X(D.yr[i]),pl.Y(D.lynx[i])]),C.coral,2.6);
   range(n).forEach(i=>{out+=Ci(pl.X(D.yr[i]),pl.Y(D.hare[i]),3.5,C.blue)+Ci(pl.X(D.yr[i]),pl.Y(D.lynx[i]),3.5,C.coral)});
   out+=TF(560,82,'hare',13,C.blue,'end')+TF(560,100,'lynx',13,C.coral,'end');
   return {svg:out,phase:'These are pelts traded, not animals counted: trapping effort, prices and weather all shaped the records. Still, hare peaks (1903, 1913) are followed a year or two later by lynx peaks (1904, 1915).'};
  }
  if(s.view==='loop'){
   const pl=B6_plot(150,62,300,226,[0,80],[0,60],{xt:[[0,'0'],[40,'40'],[80,'80']],yt:[[0,'0'],[30,'30'],[60,'60']],xl:'hare pelts (thousands)',yl:'lynx pelts (thousands)'});
   out+=pl.svg+B6_poly(range(n).map(i=>[pl.X(D.hare[i]),pl.Y(D.lynx[i])]),C.purple,2.2);
   range(n).forEach(i=>{out+=Ci(pl.X(D.hare[i]),pl.Y(D.lynx[i]),3.5,C.purple);if(D.yr[i]%5===0)out+=TF(pl.X(D.hare[i])+8,pl.Y(D.lynx[i])-6,String(D.yr[i]),13,C.muted,'start')});
   let A=0;for(let i=0;i+1<n;i++)A+=D.hare[i]*D.lynx[i+1]-D.hare[i+1]*D.lynx[i];
   out+=TF(470,90,n>3?(A>0?'turns anticlockwise,':'turns clockwise,'):'',13,C.ink,'start')+TF(470,108,n>3?(A>0?'as the model predicts':'against the model'):'',13,C.ink,'start');
   return {svg:out,phase:'In these two decades the loop turns the way Lotka–Volterra predicts, lynx following hares. Gilpin (1973) showed that in some earlier stretches of the records the loop turns the other way, as if “hares eat lynx”: a warning that pelt data are a rough proxy.'};
  }
  const bars=[['control',1,C.line],['predators kept out',2,C.blue],['extra food',3,C.green],['both',11,C.purple]];
  const pl=B6_plot(120,70,400,210,[0,4],[0,12],{yt:[[0,'0'],[4,'4×'],[8,'8×'],[12,'12×']],yl:'hare density compared with control'});
  out+=pl.svg;bars.forEach(([lab,v,col],i)=>{const x=pl.X(i+.18),w=pl.X(.64)-pl.X(0);out+=R(x,pl.Y(v),w,pl.Y(0)-pl.Y(v),col,'none',4)+TF(x+w/2,pl.Y(v)-7,v+'×',14,C.ink)+TF(x+w/2,pl.Y(0)+18,lab,13,C.muted)});
  return {svg:out,phase:'At Kluane in the Yukon, fencing out predators roughly doubled hare density, adding food roughly tripled it, and doing both raised it about elevenfold (approximate ratios from Krebs et al. 1995). The cycle comes from food and predators together, not lynx alone.'};
 }});

// Gause’s protozoa (1934): Didinium eating Paramecium, three set-ups. An illustrative model, not his counts.
function B6_gause(mode){return B6_memo('gz'+mode,()=>{
 // y = [prey in open water, predators, prey hidden in the refuge]. Hidden prey stay out of reach and come out once the predators are gone.
 const f=(t,y)=>{const x=Math.max(0,y[0]),z=Math.max(0,y[1]);return [.4*(.9*x*(1-x/220)-.6*x*z),.4*(.15*x*z-z),0]};
 return B6_solve(f,mode==='immigration'?[10,1,0]:[40,4,mode==='refuge'?5:0],24,.005,10,(t,y)=>{let x=y[0]<1?0:y[0],z=y[1]<.4?0:y[1],h=y[2];if(z===0&&h>0){x+=h;h=0}if(mode==='immigration'&&Math.abs(t/3-Math.round(t/3))<1e-6&&t>0){x+=5;z+=1}return [x,z,h]})})}
SCENE({id:'predator-prey-gause',name:'Gause’s microcosms',tag:'Why real cycles persist',
 definition:'In a bare test tube a predatory protist eats every prey and then starves. Cycles only persisted when prey had somewhere to hide, or when new individuals kept arriving.',
 example:'Gause’s Didinium wiped out Paramecium in a simple medium within days; with sediment as a refuge, some Paramecium survived and the predators died instead.',
 desc:'Prey (Paramecium) and predators (Didinium) over 24 days in three set-ups: a bare tube, a tube with a refuge, and a tube where both are added every few days.',
 research:'Gause, G. F. (1934). The Struggle for Existence. Williams & Wilkins. Huffaker, C. B. (1958). Experimental studies on predation: dispersion factors and predator–prey oscillations. Hilgardia 27, 343–383.',
 dur:12,hint:'Choose a set-up. The curves are an illustrative model of Gause’s three outcomes, not his counts.',
 init:()=>({mode:'bare'}),
 watch(p){return {mode:p<.34?'bare':p<.67?'refuge':'immigration',cur:Math.min(24,((p*3)%1)*30)}},
 ui:[{choose:[['bare','Bare tube'],['refuge','With a refuge'],['immigration','Added every 3 days']],label:'Set-up',get:s=>s.mode,act:'mode'}],
 on:{mode(s,v){s.mode=v;return 'keep'}},
 draw(s){
  const sol=B6_gause(s.mode),cur=s.cur===undefined?24:s.cur,pts=sol.filter(o=>o.t<=cur+1e-9);
  const name={bare:'A bare tube',refuge:'With sediment as a refuge',immigration:'Both added every 3 days'}[s.mode];
  let out=heading(name,28);
  const sc=s.mode==='immigration'?{top:40,k:5}:{top:240,k:10};
  const pl=B6_plot(70,58,350,236,[0,24],[0,sc.top],{xt:[[0,'0'],[6,'6'],[12,'12'],[18,'18'],[24,'24']],yt:[[0,'0'],[sc.top/2,String(sc.top/2)],[sc.top,String(sc.top)]],xl:'days',yl:'numbers in the tube'});
  out+=pl.svg+B6_poly(pts.map(o=>[pl.X(o.t),pl.Y(Math.min(sc.top,o.y[0]+o.y[2]))]),C.blue,2.6)+B6_poly(pts.map(o=>[pl.X(o.t),pl.Y(Math.min(sc.top,o.y[1]*sc.k))]),C.coral,2.6);
  out+=TF(80,78,'Paramecium (prey)',13,C.blue,'start')+TF(80,96,`Didinium (predator, ×${sc.k})`,13,C.coral,'start');
  // The tube.
  const last=pts[pts.length-1],x=last.y[0]+last.y[2],z=last.y[1];
  out+=R(460,70,90,200,'#f4fafc',C.line,14);if(s.mode==='refuge')out+=R(462,232,86,36,'#e7dcc5','none',10)+TF(505,286,'refuge',13,C.muted);
  const r=rng(7);for(let i=0;i<Math.min(40,Math.ceil(x/(s.mode==='immigration'?1:6)));i++){const yy=s.mode==='refuge'&&last.y[2]>0?240+r()*20:84+r()*140;out+=Ci(470+r()*70,yy,3.5,C.blue)}
  for(let i=0;i<Math.min(20,Math.round(z*2));i++)out+=Ci(472+r()*66,86+r()*140,5,C.coral);
  out+=TF(505,306,`prey ${Math.round(x)} · predators ${z>0&&z<1?'<1':Math.round(z)}`,13,C.ink);
  const say={bare:'Predators eat every prey, then starve: both gone. Lotka–Volterra’s endless cycle needs very large numbers; small populations simply die out.',refuge:'A few prey hide in the sediment where predators cannot reach them. The predators eat the rest and starve; then the hidden prey come out and multiply. A refuge saves the prey, not the cycle.',immigration:'Adding five prey and one predator every three days restarts the chase each time, so both persist, rising and falling (note the smaller scale). Huffaker later got lasting mite cycles by spreading oranges out so predators had to search.'}[s.mode];
  return {svg:out,phase:say};
 }});

/* ================================================================ competition-niches */
function B6_comp(a12,a21,x0,y0){return B6_memo('cp'+a12+'|'+a21+'|'+x0+'|'+y0,()=>B6_solve((t,y)=>[y[0]*(100-y[0]-a12*y[1])/100,y[1]*(100-y[1]-a21*y[0])/100],[x0,y0],60,.05,4))}
const B6_COMP_CASES=[[.5,.5],[1.4,.6],[.6,1.4],[1.5,1.5]];
SCENE({id:'competition-niches',name:'Two species, one resource',tag:'Competitive exclusion',
 definition:'When two species compete, each slows the other’s growth. If each harms itself more than its rival, they coexist; if one harms the other more, the stronger competitor excludes the weaker.',
 example:'With competition coefficients of 0.5 both species persist at about 67 each; if species 2 harms species 1 with a coefficient of 1.4, species 1 dies out.',
 desc:'A phase plane of species 1 against species 2, with each species’ zero-growth line and runs from four starting points, and a time plot of one run.',
 research:'Lotka (1925); Volterra (1926); Gause, G. F. (1934). The Struggle for Existence. Hardin, G. (1960). The competitive exclusion principle. Science 131, 1292–1297.',
 dur:12,hint:'Change how strongly each species harms the other. Watch where the runs end: one winner, coexistence, or a winner that depends on the start.',
 init:()=>({a12:.5,a21:.5}),
 watch(p){const c=B6_COMP_CASES[Math.min(3,Math.floor(p*4))];return {a12:c[0],a21:c[1]}},
 ui:[{range:'a12',label:'Effect of species 2 on species 1',min:0,max:2,step:.1,get:s=>s.a12,act:'a12',show:v=>Number(v).toFixed(1)},
  {range:'a21',label:'Effect of species 1 on species 2',min:0,max:2,step:.1,get:s=>s.a21,act:'a21',show:v=>Number(v).toFixed(1)}],
 on:{a12(s,v){s.a12=Number(v);return 'keep'},a21(s,v){s.a21=Number(v);return 'keep'}},
 draw(s){
  const {a12,a21}=s;let out=heading('Competition in the phase plane',28);
  const pl=B6_plot(70,58,240,240,[0,110],[0,110],{xt:[[0,'0'],[50,'50'],[100,'100']],yt:[[0,'0'],[50,'50'],[100,'100']],xl:'species 1',yl:'species 2'});
  out+=pl.svg;
  const clip=(x1,y1,x2,y2)=>{const pts=[[x1,y1],[x2,y2]].map(([x,y])=>[pl.X(clamp(x,0,110)),pl.Y(clamp(y,0,110))]);return pts};
  // Species 1 zero-growth line: N1 + a12 N2 = 100 ; species 2: N2 + a21 N1 = 100.
  const l1=a12>0?clip(100,0,0,100/a12):clip(100,0,100,110),l2=a21>0?clip(0,100,100/a21,0):clip(0,100,110,100);
  out+=L(l1[0][0],l1[0][1],l1[1][0],l1[1][1],C.blue,2,'stroke-dasharray="7 5"')+L(l2[0][0],l2[0][1],l2[1][0],l2[1][1],C.coral,2,'stroke-dasharray="7 5"');
  const starts=[[10,90],[90,10],[10,10],[95,95]];let main=null;
  starts.forEach((st,i)=>{const sol=B6_comp(a12,a21,st[0],st[1]);out+=B6_poly(sol.map(o=>[pl.X(Math.min(110,o.y[0])),pl.Y(Math.min(110,o.y[1]))]),C.purple,1.8);out+=Ci(pl.X(st[0]),pl.Y(st[1]),3.5,C.purple);const e=sol[sol.length-1].y;out+=Ci(pl.X(Math.min(110,e[0])),pl.Y(Math.min(110,e[1])),5,C.ink,'#fff')});
  const ends=starts.map(st=>B6_comp(a12,a21,st[0],st[1]).slice(-1)[0].y);
  const win=e=>e[0]>1&&e[1]>1?'both':e[0]>1?'1':e[1]>1?'2':'none';const kinds=[...new Set(ends.map(win))];
  const neutral=a12===1&&a21===1;const vk=neutral?'tie':(a12<1&&a21<1)?'both':(a12>1&&a21>1)?'depends':(a12<=1&&a21>=1)?'1':'2';const split=kinds.length>1;const verdict=neutral?'A knife-edge tie':vk==='depends'?'It depends on the start':vk==='both'?'Both species coexist':vk==='1'?'Species 1 wins':'Species 2 wins';
  out+=TF(70,358,'dashed: where species 1 (blue) or 2 (coral) stops growing',13,C.muted,'start');
  main=B6_comp(a12,a21,12,10);const tp=B6_plot(370,78,210,150,[0,60],[0,110],{xt:[[0,'0'],[60,'60']],yt:[[0,'0'],[100,'100']],xl:'time (from 12 and 10)',xlDy:31,yl:'numbers'});
  out+=tp.svg+B6_poly(main.map(o=>[tp.X(o.t),tp.Y(Math.min(110,o.y[0]))]),C.blue,2.4)+B6_poly(main.map(o=>[tp.X(o.t),tp.Y(Math.min(110,o.y[1]))]),C.coral,2.4);
  out+=R(370,268,210,48,vk==='depends'?C.amberp:vk==='both'||neutral?C.greenp:C.coralp,'none',10)+TBF(475,298,verdict,16,C.ink);
  const say=neutral?'With both coefficients exactly 1 the two dashed lines coincide: each species harms its rival exactly as much as itself, so the runs stop wherever they meet the line. Any small difference breaks the tie.':vk==='depends'?'Each species harms the other more than itself, so whichever starts far enough ahead wins'+(split?': the runs split between the two corners.':'; from these four starts the same species happens to win.'):vk==='both'?`Each species limits itself more than its rival (both coefficients below 1), so the runs meet where the two dashed lines cross and both persist.`:`One species harms its rival more than the rival harms it, so every run ends with only species ${vk} left: competitive exclusion.`+(a12===1||a21===1?' With a coefficient of exactly 1 the loser declines very slowly.':'');
  return {svg:out,phase:say+' Gause’s principle: two species cannot share exactly the same limiting resource for ever.'};
 }});

// Gause’s Paramecium cultures: shapes reconstructed with a competition model; illustrative, not his counts.
const B6_GSPEC={aurelia:{r:.9,K:105,c:C.blue,name:'P. aurelia'},caudatum:{r:.65,K:64,c:C.coral,name:'P. caudatum'},bursaria:{r:.5,K:40,c:C.green,name:'P. bursaria'}};
function B6_gauseComp(exp){return B6_memo('gc'+exp,()=>{
 const pair={'aurelia':['aurelia'],'caudatum':['caudatum'],'together':['aurelia','caudatum'],'bursaria':['caudatum','bursaria']}[exp];
 const A=exp==='together'?[[1,.6],[.8,1]]:exp==='bursaria'?[[1,.3],[.4,1]]:[[1,0],[0,1]];
 const sol=B6_solve((t,y)=>y.map((v,i)=>{const sp=B6_GSPEC[pair[i]];let load=0;y.forEach((w,j)=>load+=A[i][j]*w);return sp.r*v*(1-load/sp.K)}),pair.map(()=>2),25,.02,10);
 return {pair,sol}})}
SCENE({id:'competition-niches-gause',name:'Gause’s Paramecium',tag:'Exclusion in a test tube',
 definition:'Grown alone, two species of Paramecium each thrive. Grown together on the same bacteria, one always drives the other out. A third species that feeds in a different part of the tube can live alongside.',
 example:'Paramecium aurelia and P. caudatum both did well alone, but together P. aurelia won within about 16 days. P. caudatum and P. bursaria coexisted: bursaria fed lower in the tube.',
 desc:'Population curves over 25 days for each species alone, the two competitors together, and the pair that divides the tube.',
 research:'Gause, G. F. (1934). The Struggle for Existence. Williams & Wilkins; Gause (1934) Experimental analysis of Vito Volterra’s mathematical theory of the struggle for existence. Science 79, 16–17.',
 dur:12,hint:'Choose an experiment. The curves are reconstructed shapes; the outcomes are Gause’s.',
 init:()=>({exp:'together'}),
 watch(p){return {exp:['aurelia','caudatum','together','bursaria'][Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:[['aurelia','aurelia alone'],['caudatum','caudatum alone'],['together','Both together'],['bursaria','caudatum + bursaria']],label:'Experiment',get:s=>s.exp,act:'exp'}],
 on:{exp(s,v){s.exp=v;return 'keep'}},
 draw(s){
  const {pair,sol}=B6_gauseComp(s.exp);let out=heading({aurelia:'P. aurelia alone',caudatum:'P. caudatum alone',together:'P. aurelia and P. caudatum together',bursaria:'P. caudatum and P. bursaria together'}[s.exp],28);
  const pl=B6_plot(70,58,330,236,[0,25],[0,120],{xt:[[0,'0'],[5,'5'],[10,'10'],[15,'15'],[20,'20'],[25,'25']],yt:[[0,'0'],[60,'60'],[120,'120']],xl:'days',yl:'population (relative units)'});
  out+=pl.svg;pair.forEach((k,i)=>{out+=B6_poly(sol.map(o=>[pl.X(o.t),pl.Y(o.y[i])]),B6_GSPEC[k].c,2.8);out+=TF(80,80+i*18,B6_GSPEC[k].name,13,B6_GSPEC[k].c,'start','font-style="italic"')});
  // The tube with feeding zones.
  out+=R(450,64,100,230,'#f4fafc',C.line,16);const fin=sol[sol.length-1].y;
  const zone={aurelia:[84,260],caudatum:[84,260],bursaria:[200,280]};
  pair.forEach((k,i)=>{const z=s.exp==='bursaria'&&k==='caudatum'?[84,190]:zone[k],r=rng(11+i),n=Math.round(fin[i]/6);for(let j=0;j<n;j++)out+=P(`M${fmt(462+r()*76)} ${fmt(z[0]+r()*(z[1]-z[0]))} m-5 0 a5 2.6 0 1 0 10 0 a5 2.6 0 1 0 -10 0`,B6_GSPEC[k].c,1.2,tint(B6_GSPEC[k].c,.5))});
  if(s.exp==='bursaria')out+=L(452,196,548,196,C.muted,1,'stroke-dasharray="4 4"')+TF(500,314,'upper / lower zones',13,C.muted);
  else out+=TF(500,314,'day 25',13,C.muted);
  const say={aurelia:'Alone, P. aurelia rises to its carrying capacity.',caudatum:'Alone, P. caudatum also thrives, at a lower level.',together:'Together on the same food, P. aurelia grows faster and takes the bacteria first; P. caudatum dwindles towards zero.',bursaria:'P. bursaria carries algae and feeds lower down, where oxygen is scarce; P. caudatum feeds higher. Splitting the habitat lets both persist.'}[s.exp];
  return {svg:out,phase:say};
 }});

SCENE({id:'competition-niches-barnacles',name:'Connell’s barnacles',tag:'Fundamental and realised niches',
 definition:'A species’ fundamental niche is everywhere it could live; its realised niche is where it actually lives once competitors and predators are present.',
 example:'On Scottish rocks the small barnacle Chthamalus lives only high on the shore. When Connell removed the larger Balanus, Chthamalus survived much lower down: Balanus had been crushing and prising it off.',
 desc:'A cross-section of a rocky shore from high to low tide, with the zones where each barnacle survives, with and without Balanus.',
 research:'Connell, J. H. (1961). The influence of interspecific competition and other factors on the distribution of the barnacle Chthamalus stellatus. Ecology 42, 710–723. Hutchinson, G. E. (1957). Concluding remarks. Cold Spring Harbor Symposia on Quantitative Biology 22, 415–427.',
 dur:10,hint:'Remove Balanus and see where Chthamalus can survive, then compare the two kinds of niche.',
 init:()=>({view:'natural'}),
 watch(p){return {view:['natural','removed','niches'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['natural','Natural shore'],['removed','Balanus removed'],['niches','Compare niches']],label:'View',get:s=>s.view,act:'view'}],
 on:{view(s,v){s.view=v;return 'keep'}},
 draw(s){
  let out=heading('Barnacles on a Scottish shore (Connell 1961)',28);
  if(s.view==='niches'){
   [['high shore',96,166,'#efe7d6'],['mid shore',166,236,'#e3ecef'],['low shore',236,306,'#d6ecf6']].forEach(([l,y0,y1,col])=>out+=R(40,y0,250,y1-y0,col,'none',0)+TF(52,y0+22,l,13,C.muted,'start'));
   out+=R(150,96,40,210,C.pale,C.blue,6)+R(150,96,40,70,C.blue,'none',6)+TF(170,326,'Chthamalus',13,C.blue);
   out+=R(225,166,40,140,C.coralp,C.coral,6)+TF(245,326,'Balanus',13,C.coral);
   out+=TF(310,120,'dark blue: realised niche',13,C.ink,'start')+TF(310,138,'(with Balanus present)',13,C.ink,'start')+TF(310,166,'pale blue: fundamental niche',13,C.ink,'start')+TF(310,184,'(where it survives alone)',13,C.ink,'start');
   out+=TF(310,226,'Balanus’s upper limit is set',13,C.muted,'start')+TF(310,244,'by drying out; its lower limit',13,C.muted,'start')+TF(310,262,'by predatory whelks.',13,C.muted,'start');
   return {svg:out,phase:'Hutchinson defined the niche as the range of conditions in which a species can persist. The realised niche is smaller than the fundamental one wherever competitors or predators push a species out.'};
  }
  // Shore profile from high (top left) to low (bottom right).
  out+=P('M40 70 L560 330 L560 360 L40 360 Z',C.line,1,'#e9e3d6');
  out+=R(40,236,520,124,'#d6ecf6','none',0,'opacity=".55"');
  [[96,'high shore'],[180,'mid shore'],[278,'low shore']].forEach(([y,l])=>out+=L(40,y,560,y,C.grid,1,'stroke-dasharray="3 5"'));
  out+=TF(580,108,'high',13,C.muted,'end')+TF(580,192,'mid',13,C.muted,'end')+TF(580,290,'low',13,C.muted,'end');
  const onRock=(x)=>70+(x-40)*.5,bar=(x,col,size)=>{const y=onRock(x)-2;return Ci(x,y-size*.4,size,col,'#fff')};
  const chth=s.view==='natural'?[60,200]:[60,420],bal=s.view==='removed'?[]:[200,540];
  if(s.view!=='niches'){
   for(let x=chth[0];x<=chth[1];x+=14)out+=bar(x,C.blue,5);
   if(bal.length)for(let x=bal[0];x<=bal[1];x+=16)out+=bar(x,C.coral,8);
   out+=R(50,292,200,58,'#fff',C.grid,8)+TF(64,314,'● Chthamalus (small)',13,C.blue,'start')+TF(64,336,'● Balanus (large)',13,C.coral,'start');
   return {svg:out,phase:s.view==='natural'?'Chthamalus larvae settle across the shore, but below the high zone Balanus grows over them and prises them off. Balanus itself cannot survive the drying high up.':'With Balanus scraped away, Chthamalus survives well down into the mid and low shore. Competition, not the physical environment, kept it high.'};
  }
  return {svg:out,phase:''};
 }});

/* ================================================================ food-webs */
SCENE({id:'food-webs',name:'Energy up a food chain',tag:'Trophic levels and the 10% rule',
 definition:'Each step up a food chain passes on only a small fraction of the energy below, because most is used for living or never eaten. That is why there are few top predators.',
 example:'If plants capture 10,000 units and about 10% passes up each level, herbivores get 1,000, small carnivores 100 and top carnivores 10.',
 desc:'A pyramid of energy with a bar for each trophic level, whose widths and values follow from the plants’ production and the transfer efficiency.',
 research:'Lindeman, R. L. (1942). The trophic-dynamic aspect of ecology. Ecology 23, 399–417. Pauly, D. & Christensen, V. (1995). Primary production required to sustain global fisheries. Nature 374, 255–257 (mean transfer about 10%, with wide variation).',
 dur:10,hint:'Change the transfer efficiency and the plants’ production. Ten per cent is a rough average, not a law.',
 init:()=>({eff:10,pp:10000}),
 watch(p){return {eff:Math.round(lerp(5,20,smooth(p))),pp:10000}},
 ui:[{range:'eff',label:'Transfer efficiency',min:2,max:25,step:1,get:s=>s.eff,act:'eff',show:v=>v+'%'},
  {range:'pp',label:'Plant production (units a year)',min:1000,max:20000,step:1000,get:s=>s.pp,act:'pp'}],
 on:{eff(s,v){s.eff=Number(v);return 'keep'},pp(s,v){s.pp=Number(v);return 'keep'}},
 draw(s){
  const e=s.eff/100,levels=['plants (producers)','herbivores','small carnivores','top carnivores','a fifth level?'],vals=levels.map((l,i)=>s.pp*Math.pow(e,i));
  let out=heading('A pyramid of energy',28);
  const wOf=v=>Math.max(2,Math.log10(v+1)/Math.log10(20001)*115);
  vals.forEach((v,i)=>{const y=300-i*54,w=wOf(v)*2.6,x=200-w/2;out+=R(x,y,w,40,[C.green,C.blue,C.purple,C.coral,C.line][i],'none',6);
   out+=TF(420,y+18,levels[i],14,C.ink,'start')+TBF(420,y+36,B6_k(v)+' units',14,i===4&&v<1?C.coral:C.muted,'start')});
  out+=TF(200,360,'bar width grows with the logarithm of energy',13,C.muted);
  return {svg:out,phase:`At ${s.eff}% transfer, ${B6_k(vals[3])} units reach the top carnivores from ${B6_k(s.pp)} captured by plants. Real efficiencies range from about 2% to over 20%: lower for warm-blooded animals, higher in many ocean food webs. Long chains run out of energy, which is why they rarely exceed four or five levels.`};
 }});

SCENE({id:'food-webs-keystone',name:'Paine’s starfish',tag:'A keystone species',
 definition:'A keystone species has an effect far larger than its numbers suggest. Removing it can let one competitor take over and many other species disappear.',
 example:'On a rocky shore in Washington, Robert Paine kept removing the starfish Pisaster. Mussels spread over the rock, and the number of species in the plot fell from 15 to 8.',
 desc:'A grid of rock with patches of mussels, barnacles, chitons, limpets and seaweed, which mussels gradually take over when the starfish is removed, with a species count.',
 research:'Paine, R. T. (1966). Food web complexity and species diversity. American Naturalist 100, 65–75. Paine, R. T. (1969). A note on trophic complexity and community stability. American Naturalist 103, 91–93.',
 dur:12,hint:'Remove the starfish and move through the years. The patch pattern is illustrative; the fall from 15 to 8 species is Paine’s.',
 init:()=>({star:false,yrs:5}),
 watch(p){return {star:false,yrs:Math.round(p*5*10)/10}},
 ui:[{choose:[['keep','Starfish present'],['remove','Starfish removed']],label:'Starfish',get:s=>s.star?'keep':'remove',act:'star'},
  {range:'yrs',label:'Years since the start',min:0,max:5,step:.5,get:s=>s.yrs,act:'yrs'}],
 on:{star(s,v){s.star=v==='keep';return 'keep'},yrs(s,v){s.yrs=Number(v);return 'keep'}},
 draw(s){
  const cover=s.star?.25:clamp(.25+.15*s.yrs,0,.95),species=s.star?15:Math.round(15-7*clamp(s.yrs/3,0,1));
  let out=heading(s.star?'Starfish present: a mixed shore':`Starfish removed for ${s.yrs} years`,28);
  const cols=[C.green,C.amber,C.purple,'#7a9e3a',C.coral,C.blue];
  const r=rng(42);for(let i=0;i<14;i++)for(let j=0;j<8;j++){const x=40+i*25,y=62+j*31,u=r(),mussel=u<cover;
   out+=R(x,y,23,29,mussel?C.ink:cols[Math.floor(r()*6)],'none',4,mussel?'':'opacity=".75"');}
  if(s.star)out+=P('M420 120 l8 -22 l8 22 l22 0 l-18 14 l7 22 l-19 -13 l-19 13 l7 -22 l-18 -14 z',C.coral,1.5,C.coralp);
  out+=TF(468,200,'■ mussels',13,C.ink,'middle');
  out+=counter(410,226,'mussel cover',Math.round(cover*100)+'%',C.ink,120)+counter(410,282,'species in plot',String(species),species<12?C.coral:C.green,120);
  return {svg:out,phase:s.star?'The starfish prefers mussels, the best competitor for space. By eating them it keeps bare rock open for barnacles, chitons, limpets and seaweeds.':`Without its predator the mussel spreads and smothers its rivals for space. Paine’s plot fell from 15 species to 8 (here ${species}). A predator that is rare can still hold the community together.`};
 }});

SCENE({id:'food-webs-cascade',name:'Trophic cascades',tag:'Effects that skip a level',
 definition:'In a trophic cascade a top predator’s effect passes down the food chain, alternating in sign: fewer predators mean more herbivores and fewer plants.',
 example:'Where sea otters are present, sea urchins stay few and kelp forests thrive; where otters were hunted out, urchins multiplied and grazed the kelp to bare rock.',
 desc:'A three-level chain of predator, herbivore and plant with bars for each, for sea otters with and without, and a panel on the debated Yellowstone wolves.',
 research:'Estes, J. A. & Palmisano, J. F. (1974). Sea otters: their role in structuring nearshore communities. Science 185, 1058–1060. Ripple, W. J. & Beschta, R. L. (2012). Trophic cascades in Yellowstone. Biological Conservation 145, 205–213. Kauffman, Brodie & Jules (2010). Are wolves saving Yellowstone’s aspen? Ecology 91, 2742–2755.',
 dur:10,hint:'Compare otters present and absent, then read the Yellowstone case, where the evidence is disputed.',
 init:()=>({c:'otters'}),
 watch(p){return {c:['otters','none','yellowstone'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['otters','Otters present'],['none','Otters gone'],['yellowstone','Yellowstone wolves']],label:'Case',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=v;return 'keep'}},
 draw(s){
  let out=heading(s.c==='yellowstone'?'Wolves, elk and willows: a disputed cascade':'Sea otters, urchins and kelp',28);
  if(s.c==='yellowstone'){
   out+=box(40,70,160,44,'wolves (1995)',C.pale,C.ink,15)+box(40,150,160,44,'elk',C.amberp,C.ink,15)+box(40,230,160,44,'willow, aspen',C.greenp,C.ink,15);
   out+=arrow(120,114,120,148,C.coral,2.4)+arrow(120,194,120,228,C.coral,2.4);
   out+=R(230,70,340,92,C.greenp,'none',10)+TBF(244,94,'Evidence for',14,C.green,'start')+TF(244,116,'Willows taller in some places after wolves',13,C.ink,'start')+TF(244,136,'returned (Ripple & Beschta 2012).',13,C.ink,'start');
   out+=R(230,182,340,112,C.coralp,'none',10)+TBF(244,206,'Evidence against',14,C.coral,'start')+TF(244,228,'Aspen fared no better where wolf risk was',13,C.ink,'start')+TF(244,248,'high than low (Kauffman et al. 2010);',13,C.ink,'start')+TF(244,268,'drought, hunting and beavers also changed.',13,C.ink,'start');
   return {svg:out,phase:'The Yellowstone story is popular but contested: wolves probably matter, yet elk numbers also fell through human hunting and drought, and plants respond slowly. The sea otter cascade is much better established.'};
  }
  const on=s.c==='otters',lv=[['sea otters',on?1:.05,C.purple],['sea urchins',on?.2:1,C.coral],['kelp',on?1:.1,C.green]];
  lv.forEach(([n,v,col],i)=>{const y=74+i*86;out+=TF(60,y+28,n,15,C.ink,'start')+R(200,y+8,300*v+4,32,col,'none',6)+TF(200+300*v+14,y+30,v>.9?'many':v>.3?'some':'few',13,C.muted,'start');if(i<2)out+=arrow(130,y+46,130,y+82,C.ink,2)+TF(140,y+70,'eat',13,C.muted,'start')});
  out+=TF(300,346,on?'Predators present: the effect alternates down the chain.':'Predators removed: urchins boom, kelp collapses into “urchin barrens”.',14,on?C.green:C.coral);
  return {svg:out,phase:on?'Otters eat urchins, so urchins stay scarce and kelp grows into forests that shelter fish.':'Without otters, urchins multiply and graze kelp down to bare rock. Estes and Palmisano compared Aleutian islands with and without otters to show it.'};
 }});

SCENE({id:'food-webs-biomagnification',name:'Poison up the chain',tag:'Biomagnification',
 definition:'A persistent poison that is stored in fat rather than excreted becomes more concentrated at each step up a food chain, because each predator eats many contaminated prey.',
 example:'DDT sprayed on marshes was barely detectable in water but reached concentrations of tens of parts per million in fish-eating birds, thinning their eggshells.',
 desc:'Concentration of a pollutant at each level of a food chain on a logarithmic scale, multiplying by a chosen factor per level, for a persistent or a quickly broken-down chemical.',
 research:'Carson, R. (1962). Silent Spring. Houghton Mifflin. Woodwell, G. M., Wurster, C. F. & Isaacs, P. A. (1967). DDT residues in an east coast estuary. Science 156, 821–824. Ratcliffe, D. A. (1967). Decrease in eggshell weight in certain birds of prey. Nature 215, 208–210.',
 dur:10,hint:'Change the factor gained per level and whether the chemical persists. The factors are illustrative; the range from water to birds is from field measurements.',
 init:()=>({f:10,persist:true}),
 watch(p){return {f:Math.round(lerp(3,15,smooth(p))),persist:true}},
 ui:[{range:'f',label:'Concentration factor per level',min:2,max:20,step:1,get:s=>s.f,act:'f',show:v=>v+'×'},
  {choose:[['yes','Persistent (like DDT)'],['no','Breaks down quickly']],label:'Chemical',get:s=>s.persist?'yes':'no',act:'persist'}],
 on:{f(s,v){s.f=Number(v);return 'keep'},persist(s,v){s.persist=v==='yes';return 'keep'}},
 draw(s){
  const lv=['water','plankton','fish','big fish','birds'],base=.00005;
  const vals=lv.map((l,i)=>s.persist?base*Math.pow(s.f,i)*(i?40:1):base*Math.pow(.8,i));
  let out=heading('Concentration up a food chain',28);
  const pl=B6_plot(150,58,300,250,[0,5],[-6,2],{yt:[[-6,'0.000001'],[-4,'0.0001'],[-2,'0.01'],[0,'1'],[2,'100']],yl:'parts per million (log scale)'});
  out+=pl.svg+L(pl.X(0),pl.Y(0),pl.X(5),pl.Y(0),C.coral,1.2,'stroke-dasharray="5 5"')+TF(pl.X(5)+6,pl.Y(0)+4,'1 ppm',13,C.coral,'start');
  vals.forEach((v,i)=>{const lg=clamp(Math.log10(v),-6,2),x=pl.X(i+.2),w=pl.X(.6)-pl.X(0);out+=R(x,pl.Y(lg),w,pl.Y(-6)-pl.Y(lg),[C.blue,C.green,C.purple,C.amber,C.coral][i],'none',4);
   out+=TF(x+w/2,pl.Y(lg)-6,v<.001?String(Number(v.toPrecision(1))):B6_k(v),13,C.ink);out+=TF(x+w/2,pl.Y(-6)+17,lv[i],13,C.muted)});
  out+=TF(300,352,'fish = small fish · big fish = predatory fish · birds = fish-eating birds',13,C.muted);
  const top=vals[4];
  return {svg:out,phase:s.persist?`A persistent chemical gains about ${s.f}× at each step after entering plankton, reaching ${B6_k(top)} ppm in birds from ${base} ppm in water. Ratcliffe found British peregrine and sparrowhawk eggshells thinner after 1947, when DDT came into use; Silent Spring made the problem public, and DDT was banned for farm use in many countries in the 1970s.`:'A chemical that breaks down or is excreted does not build up: each level holds less than the one below.'};
 }});

/* ================================================================ island-biogeography */
SCENE({id:'island-biogeography',name:'The balance on an island',tag:'MacArthur and Wilson’s equilibrium',
 definition:'The number of species on an island settles where new arrivals balance local extinctions. Near islands get more arrivals; large islands have fewer extinctions; so large, near islands hold the most species.',
 example:'In this model a large island 10 km from the mainland holds about 80 of 100 possible species; a small island 90 km away only about 20, even with the same habitat.',
 desc:'Immigration rate falling and extinction rate rising with the number of species, crossing at the equilibrium, beside a map of the island’s size and distance from the mainland.',
 research:'MacArthur, R. H. & Wilson, E. O. (1963). An equilibrium theory of insular zoogeography. Evolution 17, 373–387. MacArthur & Wilson (1967). The Theory of Island Biogeography. Princeton University Press.',
 dur:10,hint:'Change the island’s distance and area. The equilibrium is where the two lines cross.',
 init:()=>({dist:40,area:50}),
 watch(p){return {dist:Math.round(lerp(10,90,(p*2)%1)),area:p<.5?70:25}},
 ui:[{range:'dist',label:'Distance from the mainland',min:5,max:95,step:5,get:s=>s.dist,act:'dist',show:v=>v+' km'},
  {range:'area',label:'Island area',min:5,max:95,step:5,get:s=>s.area,act:'area',show:v=>v+' km²'}],
 on:{dist(s,v){s.dist=Number(v);return 'keep'},area(s,v){s.area=Number(v);return 'keep'}},
 draw(s){
  const Pn=100,Im=lerp(30,4,s.dist/100),Em=lerp(30,4,s.area/100),S=Pn*Im/(Im+Em),turn=Im*(1-S/Pn);
  let out=heading('Arrivals against extinctions',28);
  const pl=B6_plot(70,58,290,236,[0,100],[0,32],{xt:[[0,'0'],[50,'50'],[100,'100']],yt:[[0,'0'],[16,'16'],[32,'32']],xl:'species on the island',yl:'species per year'});
  out+=pl.svg+L(pl.X(0),pl.Y(Im),pl.X(100),pl.Y(0),C.blue,2.6)+L(pl.X(0),pl.Y(0),pl.X(100),pl.Y(Em),C.coral,2.6);
  out+=L(pl.X(S),pl.Y(turn),pl.X(S),pl.Y(0),C.green,1.5,'stroke-dasharray="5 4"')+Ci(pl.X(S),pl.Y(turn),6,C.green,'#fff');
  out+=TF(pl.X(4),pl.Y(Im)-8,'immigration',13,C.blue,'start')+TF(pl.X(96),pl.Y(Em)-8,'extinction',13,C.coral,'end');
  // Map.
  out+=R(400,58,180,180,'#d6ecf6','none',8)+R(400,58,34,180,'#cfe3c4','none',8)+TF(417,252,'mainland',13,C.muted);
  const rad=6+Math.sqrt(s.area)*2.2,ix=Math.min(574-rad,440+s.dist*1.2);out+=Ci(ix,148,rad,'#cfe3c4',C.green)+TF(ix,148+rad+16,'island',13,C.green);
  out+=counter(400,268,'species at balance',String(Math.round(S)),C.green,180)+counter(400,322,'turnover a year',turn.toFixed(1),C.ink,180);
  return {svg:out,phase:`Balance at about ${Math.round(S)} of ${Pn} possible species, with ${turn.toFixed(1)} species arriving and the same number lost each year. The number stays steady while the list of species keeps changing. The straight lines are a simplification; MacArthur and Wilson drew them slightly curved.`};
 }});

// Simberloff & Wilson (1969): recolonisation after fumigating mangrove islets. Illustrative curve shapes.
const B6_ISLETS={near:{name:'near islet (about 2 m from shore)',before:43,rate:.018,over:1.1},far:{name:'far islet (over 500 m away)',before:20,rate:.008,over:1}};
const B6_reco=(k,d)=>{const I=B6_ISLETS[k],x=d*I.rate;return I.before*(1-Math.exp(-x))*(1+(I.over-1)*Math.exp(-((x-3)**2)/2))};
SCENE({id:'island-biogeography-mangrove',name:'Emptying an island',tag:'Simberloff and Wilson’s experiment',
 definition:'To test the theory, Simberloff and Wilson covered small mangrove islands in the Florida Keys with tents, fumigated them to kill every arthropod, and counted the species that came back.',
 example:'Within about a year most islets had roughly as many species as before, the nearest ones slightly more at first, but the list of species was different: the number returns, the cast changes.',
 desc:'Species counts on a near and a far mangrove islet in the year after fumigation, rising back towards the count before, with the before level dashed.',
 research:'Simberloff, D. S. & Wilson, E. O. (1969). Experimental zoogeography of islands: the colonization of empty islands. Ecology 50, 278–296. Simberloff & Wilson (1970). Experimental zoogeography of islands: a two-year record of colonization. Ecology 51, 934–937.',
 dur:12,hint:'Move through the days after fumigation and compare the near and far islets. The curve shapes are illustrative; the before counts are approximate.',
 init:()=>({d:365}),
 watch(p){return {d:Math.round(p*400)}},
 ui:[{range:'d',label:'Days after fumigation',min:0,max:400,step:10,get:s=>s.d,act:'d'}],
 on:{d(s,v){s.d=Number(v);return 'keep'}},
 draw(s){
  let out=heading('Recolonising an empty island',28);
  const pl=B6_plot(70,58,330,236,[0,400],[0,50],{xt:[[0,'0'],[100,'100'],[200,'200'],[300,'300'],[400,'400']],yt:[[0,'0'],[25,'25'],[50,'50']],xl:'days after fumigation',yl:'arthropod species'});
  out+=pl.svg;
  [['near',C.blue],['far',C.coral]].forEach(([k,col])=>{const I=B6_ISLETS[k];out+=L(pl.X(0),pl.Y(I.before),pl.X(400),pl.Y(I.before),col,1.2,'stroke-dasharray="6 5"');
   out+=B6_poly(range(81).map(i=>i*5).filter(d=>d<=s.d).map(d=>[pl.X(d),pl.Y(B6_reco(k,d))]),col,2.8);out+=Ci(pl.X(s.d),pl.Y(B6_reco(k,s.d)),5,col,'#fff')});
  out+=TF(392,254,'near islet',13,C.blue,'end')+TF(392,272,'far islet',13,C.coral,'end')+TF(392,290,'dashed: species before',13,C.muted,'end');
  out+=counter(430,90,'near islet now',Math.round(B6_reco('near',s.d))+' of '+B6_ISLETS.near.before,C.blue,150)+counter(430,150,'far islet now',Math.round(B6_reco('far',s.d))+' of '+B6_ISLETS.far.before,C.coral,150);
  out+=R(430,212,150,82,C.pale,'none',8)+TF(505,236,'Same number,',13,C.ink)+TF(505,256,'different species:',13,C.ink)+TF(505,276,'turnover',13,C.ink);
  return {svg:out,phase:'The near islet fills faster and briefly overshoots before settling, as the theory predicts when extinctions catch up with a flood of arrivals. The far islet recovers more slowly. Both return to about the number of species they had, but not the same species.'};
 }});

SCENE({id:'island-biogeography-species-area',name:'More area, more species',tag:'The species–area relationship',
 definition:'Larger areas hold more species, following roughly S = cAᶻ, where z is often between 0.15 and 0.35. On a log–log plot this is a straight line with slope z.',
 example:'Darlington’s rule of thumb for Caribbean reptiles and amphibians: ten times the area, twice the species, which is z ≈ 0.3.',
 desc:'A log–log plot of species against area for a set of islands with the line S = cAᶻ, and a habitat-loss panel that uses the same curve to estimate species lost.',
 research:'Arrhenius, O. (1921). Species and area. Journal of Ecology 9, 95–99. Darlington, P. J. (1957). Zoogeography. Wiley. Preston, F. W. (1962). The canonical distribution of commonness and rarity. Ecology 43, 185–215, 410–432. He, F. & Hubbell, S. P. (2011). Species–area relationships always overestimate extinction rates from habitat loss. Nature 473, 368–371.',
 dur:10,hint:'Change the exponent z and how much habitat is lost. The island points are illustrative; the caution about extinction estimates is from He and Hubbell.',
 init:()=>({z:.3,lost:50}),
 watch(p){return {z:.3,lost:Math.round(p*90)}},
 ui:[{range:'z',label:'Exponent z',min:.1,max:.5,step:.01,get:s=>s.z,act:'z',show:v=>Number(v).toFixed(2)},
  {range:'lost',label:'Habitat lost',min:0,max:95,step:5,get:s=>s.lost,act:'lost',show:v=>v+'%'}],
 on:{z(s,v){s.z=Number(v);return 'keep'},lost(s,v){s.lost=Number(v);return 'keep'}},
 draw(s){
  let out=heading('Species and area',28);
  const isl=[[10,5],[40,6],[150,11],[600,14],[2200,24],[8000,29],[30000,47],[110000,63]];
  const pl=B6_plot(70,58,280,236,[0,6],[0,2.2],{xt:[[0,'1'],[2,'100'],[4,'10,000'],[6,'1,000,000']],yt:[[0,'1'],[1,'10'],[2,'100']],xl:'area (km², log scale)',yl:'species (log scale)'});
  out+=pl.svg;const c=2.5;
  out+=B6_poly([[pl.X(0),pl.Y(Math.log10(c))],[pl.X(6),pl.Y(Math.min(2.2,Math.log10(c)+6*s.z))]],C.blue,2.6);
  isl.forEach(([a,n])=>out+=Ci(pl.X(Math.log10(a)),pl.Y(Math.log10(n)),4.5,C.coral,'#fff'));
  out+=TF(80,78,`line: S = ${c}·A^${s.z.toFixed(2)}`,13,C.blue,'start')+TF(80,96,'dots: islands (illustrative)',13,C.coral,'start');
  const left=1-s.lost/100,lossFrac=1-Math.pow(left,s.z);
  out+=R(390,58,190,236,C.pale,'none',10)+TBF(485,84,'Habitat loss',15,C.ink);
  out+=R(410,100,150,28,C.greenp,'none',4)+R(410,100,150*left,28,C.green,'none',4)+TF(485,146,`${100-s.lost}% of the area left`,13,C.ink);
  out+=R(410,166,150,28,C.coralp,'none',4)+R(410,166,150*(1-lossFrac),28,C.coral,'none',4)+TF(485,212,`predicted species kept: ${Math.round((1-lossFrac)*100)}%`,13,C.ink);
  out+=TF(485,244,'Read backwards, the curve',13,C.muted)+TF(485,262,'tends to overstate losses',13,C.muted)+TF(485,280,'(He & Hubbell 2011).',13,C.muted);
  return {svg:out,phase:`The slope of the line is z = ${s.z.toFixed(2)}: ten times the area gives ${Math.pow(10,s.z).toFixed(2)} times the species. Applied to habitat loss, keeping ${100-s.lost}% of the area predicts keeping about ${Math.round((1-lossFrac)*100)}% of species eventually; extinctions also take decades to happen.`};
 }});

/* ================================================================ nutrient-cycles */
// Carbon stocks (GtC) and gross fluxes (GtC per year), rounded from IPCC assessment reports (stocks and ocean fluxes as in AR6 WG1 Figure 5.12).
const B6_CPOOL={atm:{n:'atmosphere',v:875,x:230,y:56,w:140},veg:{n:'plants',v:450,x:40,y:170,w:120},soil:{n:'soils',v:1700,x:40,y:290,w:120},surf:{n:'surface ocean',v:900,x:440,y:170,w:130},deep:{n:'deep ocean',v:37100,x:440,y:290,w:130},foss:{n:'fossil fuels',v:930,x:240,y:178,w:120}};
const B6_CFLUX=[['veg','atm',120,'plant and soil breathing'],['atm','veg',123,'photosynthesis'],['veg','soil',60,'litter'],['atm','surf',80,'dissolving'],['surf','atm',78,'outgassing'],['surf','deep',90,'mixing and sinking'],['deep','surf',88,'upwelling'],['foss','atm',9.5,'burning']];
SCENE({id:'nutrient-cycles',name:'The carbon cycle',tag:'Stocks and flows',
 definition:'Carbon moves between air, plants, soils and oceans in large natural flows that nearly balance. Burning fossil fuels adds a small extra flow that the natural sinks only partly absorb.',
 example:'Plants take up about 120 billion tonnes of carbon a year and release nearly as much. Fossil fuels add about 10; roughly half stays in the air.',
 desc:'Boxes for the carbon stored in the atmosphere, plants, soils, oceans and fossil fuels, with arrows sized by yearly flows, a selectable reservoir, and the yearly rise in carbon dioxide for a chosen emission rate.',
 research:'Canadell, J. G. et al. (2021). Global carbon and other biogeochemical cycles and feedbacks. In IPCC AR6 WG1, Chapter 5 (Figure 5.12). Friedlingstein, P. et al. (2023). Global Carbon Budget 2023. Earth System Science Data 15, 5301–5369.',
 dur:10,hint:'Press a reservoir to see its flows, and change the fossil emissions. All values are rounded; about 45% of emissions stays in the air.',
 init:()=>({sel:'atm',em:10}),
 watch(p){return {sel:['atm','veg','surf','foss'][Math.min(3,Math.floor(p*4))],em:10}},
 ui:[{range:'em',label:'Fossil emissions (billion tonnes C a year)',min:0,max:15,step:.5,get:s=>s.em,act:'em'}],
 on:{sel(s,v){s.sel=v;return 'keep'},em(s,v){s.em=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Where the carbon is (billion tonnes)',28);
  const mid=k=>{const b=B6_CPOOL[k];return [b.x+b.w/2,b.y+26]};
  B6_CFLUX.forEach(([a,b,v,lab],i)=>{const on=a===s.sel||b===s.sel,pa=mid(a),pb=mid(b),off=(i%2?8:-8);
   const val=a==='foss'?s.em:v;out+=curveArrow(pa[0]+off,pa[1],pb[0]+off,pb[1],a==='foss'?18:24,on?(a==='foss'?C.coral:C.blue):C.grid,on?1.5+Math.sqrt(val)/3:1.4)});
  for(const k in B6_CPOOL){const b=B6_CPOOL[k],on=k===s.sel;out+=hit(X,'sel',k,`${b.n}: ${b.v} billion tonnes`,R(b.x,b.y,b.w,52,on?C.pale:'#fff',on?C.blue:C.line,9,on?'stroke-width="2.5"':'')+TF(b.x+b.w/2,b.y+21,b.n,13,C.ink)+TBF(b.x+b.w/2,b.y+42,b.v.toLocaleString('en-GB'),15,k==='foss'?C.coral:C.blue))}
  const list=B6_CFLUX.filter(([a,b])=>a===s.sel||b===s.sel).map(([a,b,v,lab])=>`${a===s.sel?'out':'in'}: ${lab} ${a==='foss'?s.em:v}`);
  out+=R(190,262,220,92,'#fff',C.grid,8);list.slice(0,4).forEach((t,i)=>out+=TF(300,284+i*20,t,13,C.ink));
  const rise=s.em*.45/2.12;
  out+=TF(300,372,`${s.em} emitted → about ${rise.toFixed(1)} ppm more CO₂ in the air each year`,14,C.coral);
  return {svg:out,phase:`Natural flows are huge but nearly balanced. Of ${s.em} billion tonnes from fossil fuels, oceans and land take up a little over half, and about 45% stays in the atmosphere: 1 ppm of CO₂ is 2.12 billion tonnes of carbon, so the air gains about ${rise.toFixed(1)} ppm a year. Values are rounded from IPCC reports.`};
 }});

// Mauna Loa annual mean CO2 (ppm), NOAA Global Monitoring Laboratory, rounded.
const B6_KEELING=[[1959,316.0],[1965,320.0],[1970,325.7],[1975,331.1],[1980,338.8],[1985,346.1],[1990,354.4],[1995,360.8],[2000,369.7],[2005,379.8],[2010,389.9],[2013,396.7],[2015,401.0],[2020,414.2],[2023,421.1]];
const B6_keelAt=y=>{for(let i=0;i+1<B6_KEELING.length;i++){const [a,va]=B6_KEELING[i],[b,vb]=B6_KEELING[i+1];if(y<=b)return va+(vb-va)*(y-a)/(b-a)}return B6_KEELING[B6_KEELING.length-1][1]};
SCENE({id:'nutrient-cycles-keeling',name:'The Keeling curve',tag:'A planet breathing',
 definition:'Since 1958 carbon dioxide has been measured continuously at Mauna Loa in Hawaii. The record rises every year and wiggles every season, as northern plants take in carbon in summer and release it in winter.',
 example:'The annual mean rose from about 316 ppm in 1959 to about 421 ppm in 2023; each year it dips by about 6 ppm from May to late September.',
 desc:'Annual mean carbon dioxide at Mauna Loa from 1959 to 2023, with an optional seasonal wiggle and the rate of rise in each decade.',
 research:'Keeling, C. D. (1960). The concentration and isotopic abundances of carbon dioxide in the atmosphere. Tellus 12, 200–203. NOAA Global Monitoring Laboratory, Mauna Loa annual means (values rounded here).',
 dur:12,hint:'Move through the years and switch the seasonal cycle on to see the planet breathe. The wiggle is drawn schematically.',
 init:()=>({yr:2023,season:true}),
 watch(p){return {yr:Math.round(1959+p*64),season:p>.5}},
 ui:[{range:'yr',label:'Up to year',min:1960,max:2023,step:1,get:s=>s.yr,act:'yr'},{choose:[['on','Seasonal cycle on'],['off','Annual means only']],label:'Show',get:s=>s.season?'on':'off',act:'season'}],
 on:{yr(s,v){s.yr=Number(v);return 'keep'},season(s,v){s.season=v==='on';return 'keep'}},
 draw(s){
  let out=heading('Carbon dioxide at Mauna Loa',28);
  const pl=B6_plot(70,58,330,236,[1958,2024],[300,430],{xt:[[1960,'1960'],[1980,'1980'],[2000,'2000'],[2020,'2020']],yt:[[300,'300'],[350,'350'],[400,'400']],xl:'year',yl:'CO₂ (ppm)'});
  out+=pl.svg;
  if(s.season){const pts=[];for(let t=1959;t<=s.yr;t+=1/24)pts.push([pl.X(t),pl.Y(B6_keelAt(t)+3*Math.sin(2*Math.PI*(t-1959-.13)))]);out+=B6_poly(pts,C.line,1.4)}
  const ann=B6_KEELING.filter(k=>k[0]<=s.yr);out+=B6_poly(ann.map(([y,v])=>[pl.X(y),pl.Y(v)]),C.blue,2.8);ann.forEach(([y,v])=>out+=Ci(pl.X(y),pl.Y(v),4,C.blue,'#fff'));
  const now=B6_keelAt(s.yr);out+=Ci(pl.X(s.yr),pl.Y(now),6,C.coral,'#fff');
  const dec=[[1960,1970],[1980,1990],[2000,2010],[2013,2023]].map(([a,b])=>[a,b,(B6_keelAt(b)-B6_keelAt(a))/(b-a)]);
  out+=TBF(490,74,'Rise per year',14,C.ink);dec.forEach(([a,b,r],i)=>{const on=s.yr>=b;out+=TF(430,100+i*24,i===3?'recent:':`${a}s:`,13,on?C.ink:C.grid,'start')+R(474,88+i*24,r*36,14,on?C.coral:C.grid,'none',3)+TF(474+r*36+6,100+i*24,on?r.toFixed(1)+' ppm':'',13,C.ink,'start')});
  out+=counter(430,206,`annual mean in ${s.yr}`,now.toFixed(1)+' ppm',C.blue,150);
  out+=TF(505,282,'pre-industrial: about 280',13,C.muted);
  return {svg:out,phase:`In ${s.yr} the annual mean was about ${now.toFixed(0)} ppm. The rise itself is speeding up, from under 1 ppm a year in the 1960s to about 2.4 ppm a year recently. The seasonal wiggle is the biosphere: a living signal on top of the human one.`};
 }});

const B6_NSTEPS=[
 {k:'fix',n:'Fixation',t:'Bacteria such as Rhizobium in root nodules turn N₂ gas into ammonium.'},
 {k:'nitr',n:'Nitrification',t:'Soil bacteria turn ammonium into nitrite and then nitrate, which plants take up.'},
 {k:'assim',n:'Uptake',t:'Plants build nitrogen into proteins and DNA; animals get it by eating.'},
 {k:'decomp',n:'Decay',t:'Decomposers return nitrogen from dead matter and waste to the soil as ammonium.'},
 {k:'denit',n:'Denitrification',t:'In waterlogged, oxygen-poor soils bacteria turn nitrate back into N₂ gas.'},
 {k:'haber',n:'Haber–Bosch',t:'Factories fix N₂ into ammonia for fertiliser, using natural gas and high pressure.'}];
SCENE({id:'nutrient-cycles-nitrogen',name:'The nitrogen cycle',tag:'Fixed by microbes, and by factories',
 definition:'Nitrogen gas makes up most of the air, but organisms can only use it once microbes or lightning “fix” it into ammonium or nitrate. Since the Haber–Bosch process, people fix about as much as all natural processes on land.',
 example:'Fertiliser that washes off fields feeds algae in rivers and coasts; when they die and rot, oxygen runs out and “dead zones” form.',
 desc:'A loop of the nitrogen cycle with selectable steps, and a panel where fertiliser use sets the nitrate running off and the oxygen left in coastal water.',
 research:'Galloway, J. N. et al. (2008). Transformation of the nitrogen cycle: recent trends, questions, and potential solutions. Science 320, 889–892. Fowler, D. et al. (2013). The global nitrogen cycle in the twenty-first century. Phil. Trans. R. Soc. B 368, 20130164. Diaz, R. J. & Rosenberg, R. (2008). Spreading dead zones and consequences for marine ecosystems. Science 321, 926–929.',
 dur:12,hint:'Press a step to read it, then raise fertiliser use and watch the coastal oxygen. The run-off panel is illustrative.',
 init:()=>({step:'fix',fert:50}),
 watch(p){return {step:B6_NSTEPS[Math.min(5,Math.floor(p*6))].k,fert:Math.round(p*100)}},
 ui:[{range:'fert',label:'Fertiliser use (relative)',min:0,max:100,step:5,get:s=>s.fert,act:'fert',show:v=>v+'%'}],
 on:{step(s,v){s.step=v;return 'keep'},fert(s,v){s.fert=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('The nitrogen cycle',28);
  const cx=180,cy=196,R0=112;
  out+=Ci(cx,cy,R0,'none',C.grid,'stroke-width="2"');
  B6_NSTEPS.forEach((st,i)=>{const a=-Math.PI/2+i*Math.PI/3,x=cx+Math.cos(a)*R0,y=cy+Math.sin(a)*R0,on=s.step===st.k;
   out+=hit(X,'step',st.k,st.n,R(x-58,y-17,116,34,on?(st.k==='haber'?C.coralp:C.pale):'#fff',on?(st.k==='haber'?C.coral:C.blue):C.line,9,on?'stroke-width="2.5"':'')+TF(x,y+5,st.n,13,C.ink))});
  out+=TF(cx,cy-6,'N₂ in air',14,C.muted)+TF(cx,cy+14,'78%',14,C.muted);
  const cur=B6_NSTEPS.find(t=>t.k===s.step);
  // Run-off panel.
  const run=s.fert/100,ox=clamp(1-run*.9,.05,1);
  out+=R(360,58,220,112,C.pale,'none',10)+TBF(470,80,cur.n,14,C.ink);
  const words=cur.t.split(' ');let line='',ly=100;words.forEach(w=>{if((line+' '+w).length>30){out+=TF(470,ly,line.trim(),13,C.ink);ly+=18;line=w}else line+=' '+w});out+=TF(470,ly,line.trim(),13,C.ink);
  out+=TF(470,196,'nitrate washing off',13,C.muted)+R(380,204,180,18,C.grid,'none',4)+R(380,204,180*run,18,C.amber,'none',4);
  out+=TF(470,248,'algae in coastal water',13,C.muted)+R(380,256,180,18,C.grid,'none',4)+R(380,256,180*run,18,C.green,'none',4);
  out+=TF(470,300,'oxygen near the sea bed',13,C.muted)+R(380,308,180,18,C.grid,'none',4)+R(380,308,180*ox,18,ox<.3?C.coral:C.blue,'none',4);
  if(ox<.3)out+=TF(470,346,'a dead zone forms',14,C.coral,'middle','font-weight="700"');
  return {svg:out,phase:`${cur.n}: ${cur.t} Human fixation, mostly fertiliser, roughly doubled the nitrogen entering the land cycle (Galloway et al. 2008). Diaz and Rosenberg counted over 400 coastal dead zones worldwide.`};
 }});
