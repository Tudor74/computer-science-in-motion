/* ===================== Economics era 8 · Economies as systems ===================== */
// Agent-based markets, contagion in networks of banks, the economics of climate, automation and work, platforms,
// and how to measure whether people are doing well. Every random process is seeded, so pictures are pure
// functions of state; the larger simulations are cached by their inputs.
function E8_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-7,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
function E8_btn(X,act,arg,label,x,y,w,h,text,o={}){
 const lines=Array.isArray(text)?text:[text];
 const inner=R(x,y,w,h,o.fill||'#fff',o.stroke||C.line,8)+lines.map((t,i)=>(o.bold&&i===0?TBF:TF)(x+w/2,y+h/2+5+(i-(lines.length-1)/2)*16,t,o.size||13,o.ink||C.ink)).join('');
 return hit(X,act,arg,label,inner);
}
function E8_wrap(t,n){const out=[''];t.split(' ').forEach(w=>{const c=out[out.length-1];if(c&&(c+' '+w).length>n)out.push(w);else out[out.length-1]=c?c+' '+w:w});return out}
const E8_lines=(x,y,lines,col=C.ink,size=13,gap=17,anchor='start')=>lines.map((l,i)=>TF(x,y+i*gap,l,size,col,anchor)).join('');
const E8_path=pts=>pts.map((q,i)=>(i?'L':'M')+fmt(q[0])+' '+fmt(q[1])).join('');
function E8_gauss(r){const u=r()||1e-9,v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const E8_pct=(v,d=0)=>(v*100).toFixed(d)+'%';

/* ================================================================ agent-based markets */
// Kirman (1993) herding drives the share of trend-followers; trend-followers push prices along recent moves and add
// volatility, fundamentalists pull prices back to value. Herding = 0 gives near-normal returns; herding > 0 gives
// fat tails and volatility clustering, as in Alfarano, Lux & Wagner (2005).
const E8_N=100,E8_mkCache={};
function E8_market(h,seed,n=400){
 const key=Number(h).toFixed(2)+'|'+seed+'|'+n;if(E8_mkCache[key])return E8_mkCache[key];
 const r=rng(seed*7919+13),F=100;let k=50;const p=[F,F],w=[.5,.5];
 for(let t=2;t<n;t++){
  for(let m=0;m<20;m++){const u=r(),up=(E8_N-k)/E8_N*(.002+h*k/(E8_N-1)),dn=k/E8_N*(.002+h*(E8_N-k)/(E8_N-1));if(u<up)k++;else if(u<up+dn)k--}
  const W=k/E8_N,pt=p[t-1],dp=pt-p[t-2];
  p.push(Math.max(5,pt+(1-W)*.05*(F-pt)+W*.8*Math.tanh(dp/2)+(.25+1.2*W)*E8_gauss(r)));w.push(W);
 }
 return E8_mkCache[key]={p,w};
}
function E8_returns(p){const r=[];for(let i=1;i<p.length;i++)r.push(Math.log(p[i]/p[i-1]));return r}
function E8_rstats(r){const n=r.length,m=sum(r)/n,v=r.reduce((a,b)=>a+(b-m)**2,0)/n,sd=Math.sqrt(v);
 const kurt=r.reduce((a,b)=>a+(b-m)**4,0)/n/(v*v)-3,big=r.filter(x=>Math.abs(x-m)>4*sd).length;
 const a=r.map(x=>Math.abs(x-m)),am=sum(a)/n;let c=0,c0=0;for(let i=1;i<n;i++)c+=(a[i]-am)*(a[i-1]-am);for(const x of a)c0+=(x-am)**2;
 return {m,sd,kurt,big,ac:c/c0,maxAbs:Math.max(...a)};
}
SCENE({id:'agent-based-markets',name:'A market of many minds',tag:'Herding makes booms and busts',
 definition:'An agent-based model builds a market from many simple traders with their own rules and lets prices emerge from what they do. Here some traders buy what they think is cheap compared with its value; others follow the trend. Traders also copy each other.',
 example:'With no copying, prices wobble around a value of 100. With strong copying, trend-followers sometimes take over and prices swing far from value before crashing back.',
 desc:'Top: a simulated price over 400 trading days, with the underlying value as a dashed line. Bottom: the share of traders following the trend. Herding strength sets how much traders copy each other. Seeded and deterministic: the same settings give the same run.',
 research:['Arthur, W. B., Holland, J. H., LeBaron, B., Palmer, R. & Tayler, P. (1997). Asset pricing under endogenous expectations in an artificial stock market. In The Economy as an Evolving Complex System II. Addison-Wesley (the Santa Fe artificial stock market).','Kirman, A. (1993). Ants, rationality, and recruitment. Quarterly Journal of Economics 108, 137–156.','Lux, T. & Marchesi, M. (1999). Scaling and criticality in a stochastic multi-agent model of a financial market. Nature 397, 498–500.'],
 dur:12,hint:'Raise the herding strength and press New run a few times. Compare the bottom strip with the swings in the price.',
 init:()=>({h:.5,seed:1}),
 watch(p){return {h:Math.round(smooth(p)*20)/20,seed:1}},
 ui:[{range:'h',label:'Herding strength',min:0,max:1,step:.05,get:s=>s.h,act:'h',show:v=>Number(v).toFixed(2)},{b:'New run',act:'seed'}],
 on:{h(s,v){s.h=Number(v)},seed(s){s.seed=s.seed%5+1}},
 draw(s){
  const {p,w}=E8_market(s.h,s.seed),st=E8_rstats(E8_returns(p)),n=p.length;
  const lo=Math.min(60,Math.floor(Math.min(...p)/10)*10),hi=Math.max(140,Math.ceil(Math.max(...p)/10)*10);
  let out=heading('A market of fundamentalists and trend-followers',26);
  const A=E8_plot(60,52,500,160,[0,n-1],[lo,hi],{yt:[[lo,String(lo)],[100,'100'],[hi,String(hi)]],yl:'price'});out+=A.svg;
  out+=L(A.X(0),A.Y(100),A.X(n-1),A.Y(100),C.muted,1.2,'stroke-dasharray="5 4"');
  out+=P(E8_path(p.map((v,i)=>[A.X(i),A.Y(v)])),C.blue,1.6);
  const B=E8_plot(60,236,500,58,[0,n-1],[0,1],{yt:[[0,'0'],[1,'all']],xt:[[100,'day 100'],[200,'200'],[300,'300'],[399,'400']],yl:'share following the trend'});out+=B.svg;
  out+=P(E8_path(w.map((v,i)=>[B.X(i),B.Y(v)]))+`L${fmt(B.X(n-1))} ${fmt(B.Y(0))}L${fmt(B.X(0))} ${fmt(B.Y(0))}Z`,'none',0,'#f3d6cb');
  out+=P(E8_path(w.map((v,i)=>[B.X(i),B.Y(v)])),C.coral,1.4);
  out+=TF(60,346,`Run ${s.seed} · largest one-day move ${(st.maxAbs*100).toFixed(1)}% · furthest from value ${Math.round(Math.max(...p.map(v=>Math.abs(v-100))))}`,13,C.ink,'start');
  out+=TF(60,366,'Dashed line: the value fundamentalists believe in. Model settings are illustrative.',13,C.muted,'start');
  return {svg:out,phase:s.h<.05?'With no copying, traders switch at random, the mix stays near half and half, and the price wobbles quietly around its value.':`Copying lets one camp take over for a while. When trend-followers dominate, moves feed on themselves and the price swings far from value; when they lose the majority, fundamentalists drag it back. Nothing outside the market has changed.`};
 }});

SCENE({id:'agent-based-markets-tails',name:'Fat tails',tag:'Big days are far too common',
 definition:'Real returns have fat tails: huge one-day moves happen far more often than a bell curve allows. They also cluster: calm days follow calm days and wild days follow wild days. Agent-based models with herding reproduce both.',
 example:'On 19 October 1987 the Dow Jones index fell 22.6% in one day. With a typical daily spread of about 1%, a bell curve makes that a twenty-standard-deviation event, which should essentially never happen.',
 desc:'A histogram of 3,999 daily returns from the model, on a logarithmic count scale so the rare days show. The grey curve is the bell curve with the same spread. Right: excess kurtosis (0 for a bell curve), the count of days beyond four standard deviations, and the clustering of big moves.',
 research:['Mandelbrot, B. (1963). The variation of certain speculative prices. Journal of Business 36, 394–419.','Cont, R. (2001). Empirical properties of asset returns: stylized facts and statistical issues. Quantitative Finance 1, 223–236.','Alfarano, S., Lux, T. & Wagner, F. (2005). Estimation of agent-based models: the case of an asymmetric herding model. Computational Economics 26, 19–49.'],
 dur:10,hint:'Set herding to 0, then raise it. Watch the tails of the histogram rise above the grey curve.',
 init:()=>({h:.5,seed:2}),
 watch(p){return {h:p<.45?0:.6,seed:2}},
 ui:[{range:'h',label:'Herding strength',min:0,max:1,step:.05,get:s=>s.h,act:'h',show:v=>Number(v).toFixed(2)},{b:'New run',act:'seed'}],
 on:{h(s,v){s.h=Number(v)},seed(s){s.seed=s.seed%5+1}},
 draw(s){
  const r=E8_returns(E8_market(s.h,s.seed,4000).p),st=E8_rstats(r),z=r.map(x=>(x-st.m)/st.sd);
  const bw=.5,nb=24,cnt=new Array(nb).fill(0);z.forEach(v=>{const i=Math.floor((v+6)/bw);if(i>=0&&i<nb)cnt[i]++});
  let out=heading('How often are the big days?',26);
  const A=E8_plot(70,50,330,250,[-6,6],[0,4],{xt:[[-6,'−6'],[-4,'−4'],[-2,'−2'],[0,'0'],[2,'2'],[4,'4'],[6,'6']],yt:[[0,'1'],[1,'10'],[2,'100'],[3,'1,000'],[4,'10,000']],xl:'return, in standard deviations',yl:'days (log scale)'});out+=A.svg;
  cnt.forEach((c,i)=>{if(!c)return;const x0=A.X(-6+i*bw),x1=A.X(-6+(i+1)*bw),y=A.Y(Math.log10(1+c));const tail=Math.abs(-6+(i+.5)*bw)>=4;out+=R(x0+1,y,x1-x0-2,A.Y(0)-y,tail?C.coral:C.blue,'none',2)});
  const nrm=v=>r.length*bw*Math.exp(-v*v/2)/Math.sqrt(2*Math.PI);
  out+=P(E8_path(range(121).map(i=>{const v=-6+i*.1;return [A.X(v),A.Y(Math.log10(1+nrm(v)))]})),C.muted,2);
  const exp4=r.length*6.334e-5;
  out+=counter(420,54,'excess kurtosis',st.kurt.toFixed(1),st.kurt>1?C.coral:C.green,160);
  out+=counter(420,110,'days beyond ±4 sd',String(st.big),st.big>2?C.coral:C.green,160);
  out+=TF(500,174,`bell curve expects ${exp4.toFixed(2)}`,13,C.muted);
  out+=counter(420,188,'clustering of big moves',st.ac.toFixed(2),st.ac>.15?C.coral:C.green,160);
  out+=TF(500,252,'(0 means none)',13,C.muted);
  out+=E8_lines(420,282,['Real daily returns:','excess kurtosis often','5 or more (Cont 2001).'],C.ink,13,17);
  out+=TF(70,350,'Coral: beyond four standard deviations. Grey: bell curve, same spread.',13,C.muted,'start');
  return {svg:out,phase:st.kurt<1?`With herding at ${Number(s.h).toFixed(2)} the returns are close to a bell curve: excess kurtosis ${st.kurt.toFixed(1)}, and big days are about as rare as it predicts.`:`With herding at ${Number(s.h).toFixed(2)} the tails are fat: ${st.big} days beyond four standard deviations where a bell curve expects ${exp4.toFixed(2)}, and big moves cluster together. Copying alone is enough to produce this.`};
 }});

// El Farol (Arthur 1994): 100 people, the bar is fun only if at most a threshold attend. Each simulated
// person holds three forecasting rules and acts on whichever has been most accurate lately.
const E8_PRED=[
 h=>h[h.length-1],h=>h[h.length-2],h=>Math.round((h[h.length-1]+h[h.length-2]+h[h.length-3]+h[h.length-4])/4),
 h=>100-h[h.length-1],h=>clamp(2*h[h.length-1]-h[h.length-2],0,100),h=>Math.round(sum(h.slice(-8))/8),
 h=>h[h.length-5],h=>Math.round((h[h.length-1]+h[h.length-2])/2)];
const E8_AGENTS=(()=>{const r=rng(4242);return range(100).map(()=>{const pick=shuffled(range(E8_PRED.length),Math.floor(r()*1e6)+1).slice(0,3);return pick})})();
const E8_H0=(()=>{const r=rng(55);return range(14).map(()=>20+Math.floor(r()*70))})();
function E8_farolGoers(H,th,nAg){let go=0;for(let a=0;a<nAg;a++){let best=null,be=1e9;
 for(const k of E8_AGENTS[a]){let e=0;for(let j=1;j<=6;j++){const past=H.slice(0,H.length-j);e+=Math.abs(E8_PRED[k](past)-H[H.length-j])}if(e<be){be=e;best=k}}
 if(E8_PRED[best](H)<=th)go++}return go}
const E8_farolCache={};
function E8_farolWatch(th){if(E8_farolCache[th])return E8_farolCache[th];const H=E8_H0.slice();for(let t=0;t<40;t++)H.push(E8_farolGoers(H,th,100));return E8_farolCache[th]=H}
SCENE({id:'agent-based-markets-elfarol',name:'The El Farol bar',tag:'You against 99 forecasters',
 definition:'Brian Arthur’s El Farol problem: 100 people decide each week whether to go to a bar that is fun only if at most 60 go. There is no single right forecast, because if everyone believed it, it would be wrong. Yet people using simple rules of thumb end up averaging close to 60.',
 example:'If everyone expects a quiet night, everyone goes and it is crowded; if everyone expects a crowd, the bar is empty. Each person keeps a few rules (same as last week, average of the last four, and so on) and uses whichever has worked lately.',
 desc:'Weekly attendance over the latest 40 weeks with the comfort threshold as a dashed line. In Try it you are the hundredth person: press Go or Stay home each week. You score +1 for going on an uncrowded night, −1 for a crowded one, 0 for staying home. The other 99 are simulated, deterministically.',
 research:['Arthur, W. B. (1994). Inductive reasoning and bounded rationality. American Economic Review 84(2), 406–411.','Challet, D. & Zhang, Y.-C. (1997). Emergence of cooperation and organization in an evolutionary game. Physica A 246, 407–418 (the minority game).'],
 dur:10,hint:'Play ten or more weeks. Can you beat the crowd’s rules of thumb? Your choices stay on this page.',
 init:()=>({th:60,H:E8_H0.slice(),you:[],score:0}),
 watch(p){const th=60,H=E8_farolWatch(th);return {th,H:H.slice(0,14+Math.floor(p*40)),you:[],score:0,auto:true}},
 ui:[{b:'Go',act:'go'},{b:'Stay home',act:'stay'},{b:'Stay home 10 weeks',act:'skip'},{range:'th',label:'Comfort threshold',min:40,max:80,step:10,get:s=>s.th,act:'th',show:v=>v+' people'}],
 on:{go(s){const a=E8_farolGoers(s.H,s.th,99)+1;s.H.push(a);s.you.push({w:s.H.length-1,go:true,ok:a<=s.th});s.score+=a<=s.th?1:-1;return 'keep'},
  stay(s){const a=E8_farolGoers(s.H,s.th,99);s.H.push(a);s.you.push({w:s.H.length-1,go:false,ok:a<=s.th});return 'keep'},
  skip(s){for(let i=0;i<10;i++){const a=E8_farolGoers(s.H,s.th,99);s.H.push(a);s.you.push({w:s.H.length-1,go:false,ok:a<=s.th})}return 'keep'},
  th(s,v){s.th=Number(v);s.H=E8_H0.slice();s.you=[];s.score=0}},
 draw(s,f,X){
  const H=s.H,last=H.length-1,from=Math.max(0,last-39),played=H.slice(14);
  let out=heading('The El Farol bar: will it be crowded?',26);
  const A=E8_plot(60,52,380,230,[from,from+39],[0,100],{yt:[[0,'0'],[50,'50'],[100,'100']],xl:'week',yl:'people at the bar'});out+=A.svg;
  out+=L(A.X(from),A.Y(s.th),A.X(from+39),A.Y(s.th),C.coral,1.6,'stroke-dasharray="6 4"')+TF(A.X(from+39)-4,A.Y(s.th)-6,'crowded above '+s.th,13,C.coral,'end');
  const pts=[];for(let i=from;i<=last;i++)pts.push([A.X(i),A.Y(H[i])]);
  out+=L(A.X(14)<A.X(from)?A.X(from):A.X(14),A.Y(0),A.X(14)<A.X(from)?A.X(from):A.X(14),A.Y(100),C.grid,1);
  out+=P(E8_path(pts),C.blue,1.8);for(let i=from;i<=last;i++)out+=Ci(A.X(i),A.Y(H[i]),i<14?2:3,i<14?C.line:C.blue);
  (s.you||[]).forEach(y=>{if(y.w<from)return;out+=Ci(A.X(y.w),A.Y(H[y.w]),6,'none',y.go?(y.ok?C.green:C.coral):C.muted,'stroke-width="2.2"')});
  const mean=played.length?sum(played)/played.length:0,crowd=played.filter(v=>v>s.th).length;
  out+=counter(460,56,'weeks played',String(played.length),C.blue,120);
  out+=counter(460,112,'average attendance',played.length?mean.toFixed(1):'—',C.ink,120);
  out+=counter(460,168,'crowded weeks',played.length?Math.round(crowd/played.length*100)+'%':'—',C.coral,120);
  if(X&&X.try)out+=counter(460,224,'your score',(s.score>0?'+':'')+s.score,s.score>=0?C.green:C.coral,120);
  out+=TF(60,338,'Grey points: starting history. Your weeks are ringed: green went and it was fine,',12,C.muted,'start');
  out+=TF(60,356,'coral went and it was crowded, grey stayed home.',12,C.muted,'start');
  return {svg:out,phase:played.length<3?'Week by week, each simulated person forecasts attendance with whichever rule has worked best lately, and goes only if the forecast is under the threshold.':`Over ${played.length} weeks the average was ${mean.toFixed(1)} against a threshold of ${s.th}: no one planned it, yet attendance hovers near the limit. It never settles, because any rule that everyone trusts stops working.`};
 }});

/* ================================================================ network contagion */
const E8_BANKS=10;
function E8_exposures(net){// E[i][j]: what bank i has lent to bank j (lost if j fails). Each bank lends 10 in total.
 const E=range(E8_BANKS).map(()=>new Array(E8_BANKS).fill(0));
 if(net==='ring')for(let i=0;i<E8_BANKS;i++)E[i][(i+1)%E8_BANKS]=10;
 else if(net==='complete')for(let i=0;i<E8_BANKS;i++)for(let j=0;j<E8_BANKS;j++){if(i!==j)E[i][j]=10/9}
 else{for(let i=0;i<E8_BANKS;i++){const g=i<5?0:5;const bridge=i===0||i===5;for(let j=g;j<g+5;j++)if(j!==i)E[i][j]=bridge?2:2.5;if(bridge)E[i][i===0?5:0]=2}}
 return E}
function E8_cascade(net,K,first){const E=E8_exposures(net),rounds=[[first]],dead=new Set([first]);
 for(;;){const nw=[];for(let i=0;i<E8_BANKS;i++){if(dead.has(i))continue;let loss=0;for(const j of dead)loss+=E[i][j];if(loss>K+1e-9)nw.push(i)}
  if(!nw.length)break;nw.forEach(i=>dead.add(i));rounds.push(nw)}
 return {E,rounds}}
const E8_NETS=[['ring','Ring: each lends to one'],['complete','Complete: each lends to all'],['clusters','Two clusters, one bridge']];
SCENE({id:'network-contagion',name:'Contagion between banks',tag:'One failure, then another',
 definition:'Banks lend to each other. If a bank fails, its creditors lose what they lent it; if a loss is bigger than a creditor’s capital, the creditor fails too, and the losses travel on. How far they travel depends on the shape of the network.',
 example:'In a ring each bank has lent everything to one neighbour, so one failure topples the next and the next. When each bank spreads its lending across all the others, the same failure costs each of them a little and stops there.',
 desc:'Ten banks, each with 10 units lent to other banks and a capital buffer you set. Choose a network shape and press a bank to make it fail; Next round spreads the losses. Failed banks turn coral and dark; numbers show each bank’s loss so far.',
 research:['Allen, F. & Gale, D. (2000). Financial contagion. Journal of Political Economy 108, 1–33.','Haldane, A. G. (2009). Rethinking the financial network. Speech, Bank of England, 28 April.'],
 dur:12,hint:'With the ring, fail one bank and step through the rounds. Then try the complete network with the same capital.',
 init:()=>({net:'ring',K:5,first:0,round:0}),
 watch(p){return p<.55?{net:'ring',K:5,first:0,round:Math.floor(p/.55*10)}:{net:'complete',K:5,first:0,round:Math.min(2,Math.floor((p-.55)/.45*3))}},
 ui:[{choose:E8_NETS,label:'Network',get:s=>s.net,act:'net'},{range:'K',label:'Capital per bank',min:.5,max:10,step:.5,get:s=>s.K,act:'K',show:v=>v+' units'},{b:'Next round',act:'next'},{b:'Back to round 0',act:'zero'}],
 on:{net(s,v){s.net=v;s.round=0},K(s,v){s.K=Number(v);s.round=0},next(s){s.round++;return 'keep'},zero(s){s.round=0;return 'keep'},fail(s,a){s.first=Number(a);s.round=0;return 'keep'}},
 draw(s,f,X){
  const {E,rounds}=E8_cascade(s.net,s.K,s.first),rr=Math.min(s.round,rounds.length-1),dead=new Set(),newly=new Set(rounds[rr]);
  for(let i=0;i<=rr;i++)rounds[i].forEach(b=>dead.add(b));
  const cx=170,cy=200,R0=118,pos=range(E8_BANKS).map(i=>{const a=-Math.PI/2+i*2*Math.PI/E8_BANKS;return [cx+R0*Math.cos(a),cy+R0*Math.sin(a)]});
  let out=heading('Losses travelling through a network of banks',26);
  for(let i=0;i<E8_BANKS;i++)for(let j=0;j<E8_BANKS;j++){if(!E[i][j])continue;if(s.net==='ring')out+=arrowR(pos[i],pos[j],19,22,dead.has(j)?C.coral:C.line,2);else if(i<j)out+=L(pos[i][0],pos[i][1],pos[j][0],pos[j][1],dead.has(i)||dead.has(j)?'#e7b3a3':C.grid,1.3)}
  pos.forEach(([x,y],i)=>{let loss=0;for(const j of dead)loss+=E[i][j];const isD=dead.has(i),isN=newly.has(i)&&rr>0||i===s.first&&rr===0;
   const inner=Ci(x,y,17,isD?(isN?C.coral:'#7a3b2c'):'#fff',isD?C.coral:C.blue)+TF(x,y+5,String(i+1),14,isD?'#fff':C.ink);
   out+=hit(X,'fail',i,`Bank ${i+1}. Press to make it fail first.`,inner);
   if(!isD&&loss>0)out+=TF(x,y+(y>cy?34:-24),'−'+fmt(loss),12,C.coral)});
  const nd=dead.size,more=rr<rounds.length-1;
  out+=TBF(345,74,`Round ${rr} of ${rounds.length-1}`,16,C.ink,'start');
  out+=counter(345,90,'banks failed',`${nd} of 10`,nd>3?C.coral:C.ink,110)+counter(465,90,'capital each',s.K+' units',C.blue,110);
  out+=E8_lines(345,166,E8_wrap(s.net==='ring'?'Each bank has lent all 10 units to one neighbour, so a single failure costs it 10.':s.net==='complete'?'Each bank has lent 10 ÷ 9 ≈ 1.1 units to every other bank, so a single failure costs each one only 1.1.':'Banks lend within their cluster; banks 1 and 6 also lend 2 units across the bridge.',32),C.ink,13,17);
  out+=E8_lines(345,250,E8_wrap(more?'Press Next round to spread the losses.':nd===1?'The losses stopped at the first bank.':nd===10?'Every bank has failed.':`It stopped with ${nd} banks down.`,32),more?C.muted:C.ink,13,17);
  out+=TF(30,366,X&&X.try?'Press any bank to make it fail first.':'Arrows: who has lent to whom.',13,C.muted,'start');
  return {svg:out,phase:`${E8_NETS.find(n=>n[0]===s.net)[1]}, capital ${s.K}. After round ${rr}, ${nd} of 10 banks have failed${more?'; more will follow':''}. Spreading exposures dilutes a single shock, as Allen and Gale showed; it can also carry a big shock everywhere.`};
 }});

// Gai & Kapadia (2010): 100 banks in a random network; 20% of assets lent to other banks, split evenly among
// borrowers; capital 4%. A bank fails if more than a fifth of its borrowers have failed (zero recovery).
const E8_gkCache={};
function E8_gkRun(z,seed,N=100){const r=rng(seed);const lend=range(N).map(()=>[]);const pr=z/(N-1);
 for(let i=0;i<N;i++)for(let j=0;j<N;j++)if(i!==j&&r()<pr)lend[i].push(j);
 const dead=new Uint8Array(N);const first=Math.floor(r()*N);dead[first]=1;let changed=true,nd=1;
 while(changed){changed=false;for(let i=0;i<N;i++){if(dead[i]||!lend[i].length)continue;let f=0;for(const j of lend[i])f+=dead[j];if(f/lend[i].length>.2){dead[i]=1;nd++;changed=true}}}
 return nd}
function E8_gkCurve(){if(E8_gkCache.c)return E8_gkCache.c;const out=[];
 for(let zi=0;zi<=24;zi++){const z=zi*.5;let hits=0,ext=0;const M=60;for(let m=0;m<M;m++){const nd=E8_gkRun(z,1000+zi*97+m);if(nd>=5){hits++;ext+=nd}}
  out.push({z,freq:hits/M,ext:hits?ext/hits/100:0})}
 return E8_gkCache.c=out}
SCENE({id:'network-contagion-fragile',name:'Robust yet fragile',tag:'More links can help or hurt',
 definition:'In a network of banks, more connections spread each shock thinner, which makes small failures die out. But connections are also the paths a crisis travels along. Gai and Kapadia showed that over a middle range of connectivity, contagion is rare but, when it happens, it reaches almost everyone.',
 example:'Andrew Haldane of the Bank of England called this “robust yet fragile”: the system that shrugged off shocks for years was the same one that failed all at once in 2008.',
 desc:'For each average number of links per bank, 60 random networks of 100 banks were shocked by one failure. Blue: how often the failure spread to at least five banks. Coral: when it did spread, the share of all banks that failed. Move the slider to read off a connectivity.',
 research:['Gai, P. & Kapadia, S. (2010). Contagion in financial networks. Proceedings of the Royal Society A 466, 2401–2423.','Haldane, A. G. (2009). Rethinking the financial network. Bank of England.','Battiston, S. et al. (2012). DebtRank: too central to fail? Scientific Reports 2, 541.'],
 dur:10,hint:'Find the range where contagion is rare but total. Settings here: 20% of assets lent between banks, capital 4%.',
 init:()=>({z:4}),
 watch(p){return {z:Math.round(lerp(.5,11,p)*2)/2}},
 ui:[{range:'z',label:'Average links per bank',min:0,max:12,step:.5,get:s=>s.z,act:'z',show:v=>Number(v).toFixed(1)}],
 on:{z(s,v){s.z=Number(v)}},
 draw(s){
  const c=E8_gkCurve(),pt=c.find(q=>Math.abs(q.z-s.z)<.01)||c[0];
  let out=heading('How connected is too connected?',26);
  const A=E8_plot(70,52,340,240,[0,12],[0,1],{xt:[[0,'0'],[2,'2'],[4,'4'],[6,'6'],[8,'8'],[10,'10'],[12,'12']],yt:[[0,'0'],[.5,'50%'],[1,'100%']],xl:'average number of borrowers per bank'});out+=A.svg;
  out+=P(E8_path(c.map(q=>[A.X(q.z),A.Y(q.freq)])),C.blue,2.4);
  out+=P(E8_path(c.filter(q=>q.ext>0).map(q=>[A.X(q.z),A.Y(q.ext)])),C.coral,2.4);
  out+=L(A.X(s.z),A.Y(0),A.X(s.z),A.Y(1),C.ink,1.4,'stroke-dasharray="4 4"')+Ci(A.X(s.z),A.Y(pt.freq),5,C.blue)+(pt.ext?Ci(A.X(s.z),A.Y(pt.ext),5,C.coral):'');
  out+=counter(430,60,'chance it spreads',E8_pct(pt.freq),C.blue,150)+counter(430,116,'share failing if it does',pt.ext?E8_pct(pt.ext):'—',C.coral,150);
  const zone=pt.freq===0&&s.z<1?'Too few links: shocks cannot travel far.':pt.freq<.2&&pt.ext>.6?'Robust yet fragile: rarely spreads, but total when it does.':pt.freq>=.2?'Fragile: a single failure often spreads widely.':'Well spread: each bank shrugs off one failure.';
  out+=E8_lines(430,190,E8_wrap(zone,24),C.ink,13,17);
  out+=TF(70,350,'Blue: chance one failure spreads to 5+ banks. Coral: share failing when it does.',12,C.muted,'start')+TF(70,368,'60 seeded networks of 100 banks per point.',12,C.muted,'start');
  return {svg:out,phase:`With ${Number(s.z).toFixed(1)} borrowers per bank on average, one failure spread in ${E8_pct(pt.freq)} of runs${pt.ext?`, and when it did, ${E8_pct(pt.ext)} of banks failed`:''}. ${zone}`};
 }});

// Fire sales: five banks hold the same asset. A price fall cuts their equity; to restore leverage they sell, which
// pushes the price down further (Shleifer & Vishny 2011; Greenwood, Landier & Thesmar 2015). Impact is illustrative.
function E8_fireSale(L0,shock){const lev=[.6,.8,1,1.2,1.4].map(m=>L0*m),q=lev.map(()=>100),Q0=500,D=lev.map(l=>100*(1-1/l));
 let p=1-shock;const path=[1,p];const dead=lev.map(()=>false);let round=0;
 for(;round<14;round++){let sold=0;for(let i=0;i<5;i++){if(dead[i]||q[i]<=0)continue;const e=q[i]*p-D[i];if(e<=0){dead[i]=true;sold+=q[i];q[i]=0;continue}const target=lev[i]*e/p;if(target<q[i]){sold+=q[i]-target;D[i]-=(q[i]-target)*p;q[i]=target}}
  if(sold<.05)break;p=Math.max(.05,p*(1-.12*sold/Q0));path.push(p)}
 const eq=q.map((x,i)=>dead[i]?0:Math.max(0,x*p-D[i]));
 return {path,lev,eq,eq0:lev.map(l=>100/l),dead}}
SCENE({id:'network-contagion-firesale',name:'Fire sales',tag:'Selling into a falling market',
 definition:'Banks need not lend to each other to infect each other. If they hold the same assets, a price fall forces the most indebted to sell to keep their borrowing in line with their capital. Their selling pushes the price down further, which forces more selling.',
 example:'A bank with 100 of assets and leverage 20 has only 5 of its own capital. A 2% price fall wipes out 2 of that 5; to get back to leverage 20 it must sell 40% of what it holds.',
 desc:'Five banks hold the same asset, with leverage from 0.6 to 1.4 times the level you set. A first price shock starts a spiral of forced sales; the line shows the price after each round. Bars compare each bank’s capital before and after. The price impact of selling is illustrative.',
 research:['Shleifer, A. & Vishny, R. (2011). Fire sales in finance and macroeconomics. Journal of Economic Perspectives 25(1), 29–48.','Brunnermeier, M. K. & Pedersen, L. H. (2009). Market liquidity and funding liquidity. Review of Financial Studies 22, 2201–2238.','Greenwood, R., Landier, A. & Thesmar, D. (2015). Vulnerable banks. Journal of Financial Economics 115, 471–485.'],
 dur:10,hint:'Keep the shock small and raise leverage. Find where a 2% fall turns into a collapse.',
 init:()=>({L:15,shock:2}),
 watch(p){return {L:Math.round(lerp(6,26,p)),shock:2}},
 ui:[{range:'L',label:'Typical leverage',min:4,max:30,step:1,get:s=>s.L,act:'L',show:v=>v+'×'},{range:'shock',label:'First price fall',min:1,max:10,step:1,get:s=>s.shock,act:'shock',show:v=>v+'%'}],
 on:{L(s,v){s.L=Number(v)},shock(s,v){s.shock=Number(v)}},
 draw(s){
  const r=E8_fireSale(s.L,s.shock/100),pmin=r.path[r.path.length-1],nd=r.dead.filter(Boolean).length;
  let out=heading('A spiral of forced sales',26);
  const A=E8_plot(70,52,260,230,[0,14],[.7,1],{xt:[[0,'0'],[7,'7'],[14,'14']],yt:[[.7,'70'],[.8,'80'],[.9,'90'],[1,'100']],xl:'round of selling',yl:'asset price'});out+=A.svg;
  const Yc=v=>A.Y(Math.max(.7,v));out+=P(E8_path(r.path.map((v,i)=>[A.X(i),Yc(v)])),C.coral,2.4);r.path.forEach((v,i)=>{out+=Ci(A.X(i),Yc(v),3,C.coral)});
  out+=TF(A.X(r.path.length-1)+8,Yc(pmin)+5,Math.round(pmin*100)+'',13,C.coral,'start');
  const bx=380,bw=38,base=262,sc=170/Math.max(...r.eq0);
  out+=TF(bx,60,'capital: before (light) and after',13,C.muted,'start');
  r.lev.forEach((l,i)=>{const x=bx+i*(bw+4);out+=R(x,base-r.eq0[i]*sc,bw-6,r.eq0[i]*sc,'#cfe0ec','none',3)+R(x+6,base-r.eq[i]*sc,bw-18,r.eq[i]*sc,r.dead[i]?C.coral:C.blue,'none',3);
   out+=TF(x+bw/2-3,base+16,Math.round(l)+'×',12,C.muted);if(r.dead[i])out+=TF(x+bw/2-3,base-r.eq0[i]*sc-6,'failed',12,C.coral)});
  out+=TF(bx,base+34,'leverage of each bank',12,C.muted,'start');
  out+=TF(70,334,`A ${s.shock}% shock ended with the price at ${Math.round(pmin*100)} after ${r.path.length-2} rounds of selling; ${nd} of 5 banks failed.`,13,C.ink,'start');
  out+=TF(70,356,'Leverage = assets ÷ own capital. Price impact of sales is illustrative.',13,C.muted,'start');
  return {svg:out,phase:(1-pmin)<1.6*s.shock/100&&!nd?`At ${s.L}× leverage the sales are small and the price settles near ${Math.round(pmin*100)}: the shock is absorbed.`:`At ${s.L}× leverage a ${s.shock}% fall snowballs to ${Math.round(100-pmin*100)}%: each round of sales cuts everyone’s capital, which forces more sales. ${nd?nd+' bank'+(nd>1?'s':'')+' failed.':''}`};
 }});

/* ================================================================ climate economics */
const E8_PRESETS={stern:{n:'Stern Review',rho:.1,eta:1,g:1.3},nordhaus:{n:'Nordhaus (DICE)',rho:1.5,eta:1.45,g:1.9},custom:{n:'Your own'}};
const E8_pv=(r,t)=>1000/Math.pow(1+r/100,t);
SCENE({id:'climate-economics',name:'Discounting the future',tag:'How much is a harm in 2125 worth today?',
 definition:'Climate damage falls mostly on future people, so its cost depends on how much we discount the future. The Ramsey rule splits the discount rate r into pure time preference ρ (counting later people less just because they are later) plus η × g: if people will be richer (growth g), an extra pound matters less to them, by an amount set by η.',
 example:'Nicholas Stern used ρ = 0.1%, η = 1 and growth about 1.3%, giving r ≈ 1.4%. William Nordhaus used values giving r ≈ 4.25%. At 1.4%, £1,000 of harm in 100 years is worth about £249 today; at 4.25%, about £16.',
 desc:'Set ρ, η and expected growth g, or choose a preset. The discount rate r = ρ + η × g sets what £1,000 of damage at a future date is worth today. The bars show it for 50, 100 and 200 years ahead. The 3D view shows the whole surface over rates and years.',
 research:['Ramsey, F. P. (1928). A mathematical theory of saving. Economic Journal 38, 543–559.','Stern, N. (2007). The Economics of Climate Change: The Stern Review. Cambridge University Press.','Nordhaus, W. D. (2007). A review of the Stern Review on the economics of climate change. Journal of Economic Literature 45, 686–702.','Dasgupta, P. (2008). Discounting climate change. Journal of Risk and Uncertainty 37, 141–169. The choice of ρ and η is an ethical judgement as much as an empirical one.'],
 dur:12,hint:'Switch between the Stern and Nordhaus presets, then try ρ = 0 yourself. The disagreement is mostly about ρ and η.',
 init:()=>({pre:'stern',rho:.1,eta:1,g:1.3}),
 watch(p){const a=E8_PRESETS.stern,b=E8_PRESETS.nordhaus,u=smooth((p-.3)/.4);return {pre:u<.5?'stern':'nordhaus',rho:lerp(a.rho,b.rho,u),eta:lerp(a.eta,b.eta,u),g:lerp(a.g,b.g,u)}},
 ui:[{choose:Object.keys(E8_PRESETS).map(k=>[k,E8_PRESETS[k].n]),label:'Preset',get:s=>s.pre,act:'pre'},
  {range:'rho',label:'Time preference ρ',min:0,max:3,step:.1,get:s=>s.rho,act:'rho',show:v=>Number(v).toFixed(1)+'%'},
  {range:'eta',label:'Inequality aversion η',min:0,max:3,step:.05,get:s=>s.eta,act:'eta',show:v=>Number(v).toFixed(2)},
  {range:'g',label:'Growth g',min:0,max:3,step:.1,get:s=>s.g,act:'g',show:v=>Number(v).toFixed(1)+'%'}],
 on:{pre(s,v){s.pre=v;if(v!=='custom'){Object.assign(s,{rho:E8_PRESETS[v].rho,eta:E8_PRESETS[v].eta,g:E8_PRESETS[v].g})}},rho(s,v){s.rho=Number(v);s.pre='custom'},eta(s,v){s.eta=Number(v);s.pre='custom'},g(s,v){s.g=Number(v);s.pre='custom'}},
 draw(s){
  const r=s.rho+s.eta*s.g;
  let out=heading('What is future harm worth today?',26);
  out+=TF(40,64,'Ramsey rule:  r = ρ + η × g',15,C.ink,'start');
  out+=TBF(40,92,`r = ${s.rho.toFixed(1)} + ${s.eta.toFixed(2)} × ${s.g.toFixed(1)} = ${r.toFixed(2)}% a year`,16,C.blue,'start');
  const bx=60,base=300,hmax=170;
  [[50,'in 50 years'],[100,'in 100 years'],[200,'in 200 years']].forEach(([t,l],i)=>{const v=E8_pv(r,t),x=bx+i*120;out+=R(x,base-hmax,70,hmax,'#eef3f6','none',4)+R(x,base-v/1000*hmax,70,v/1000*hmax,C.green,'none',4);
   out+=TBF(x+35,base-v/1000*hmax-8,'£'+(v>=10?Math.round(v).toLocaleString('en-GB'):v.toFixed(2)),14,C.ink)+TF(x+35,base+18,l,13,C.muted)});
  out+=TF(bx,base-hmax-8,'£1,000 of harm, valued today:',13,C.muted,'start');
  out+=E8_lines(430,150,E8_wrap(r<2?'A low rate treats future harm almost like harm today, so cutting emissions now looks worth a lot.':r<3.5?'A middle rate: harm a century away still counts, but much less.':'A high rate shrinks distant harm, so slower, cheaper cuts look best.',22),C.ink,13,17);
  out+=TF(430,250,'Stern: r ≈ 1.4%',13,C.muted,'start')+TF(430,270,'Nordhaus: r ≈ 4.25%',13,C.muted,'start');
  out+=TF(40,352,'ρ is an ethical choice; η and g are partly empirical. Preset values are approximate.',13,C.muted,'start');
  return {svg:out,phase:`At r = ${r.toFixed(2)}%, £1,000 of damage in 100 years is worth £${E8_pv(r,100).toFixed(0)} today, and in 200 years £${E8_pv(r,200).toFixed(E8_pv(r,200)<10?2:0)}. Most of the gap between Stern and Nordhaus comes from this one number.`};
 },
 three(s,f,X,project){
  const r0=s.rho+s.eta*s.g,u=r=>r/3,w=t=>t/100,h=v=>v*1.4,P3=project([0,2,0,2,0,1.4]),faces=[],nr=12,nt=10,z=(r,t)=>E8_pv(r,t)/1000;
  for(let i=0;i<nr;i++)for(let j=0;j<nt;j++){const ra=i*6/nr,rb=(i+1)*6/nr,ta=j*200/nt,tb=(j+1)*200/nt;const avg=(z(ra,ta)+z(rb,tb))/2;
   faces.push({pts:[[u(ra),w(ta),h(z(ra,ta))],[u(rb),w(ta),h(z(rb,ta))],[u(rb),w(tb),h(z(rb,tb))],[u(ra),w(tb),h(z(ra,tb))]],fill:avg>.5?'#2c776c':avg>.15?'#6fae9d':avg>.03?'#b9d9cf':'#e4efeb',stroke:'#ffffff'})}
  let out=paintFaces(faces,P3);
  const rc=clamp(r0,0,6);out+=P(E8_path(range(21).map(k=>{const t=k*10,q=P3([u(rc),w(t),h(z(rc,t))]);return [q[0],q[1]]})),C.coral,3);
  out+=axes3(P3,['rate 0–6%','0–200 years','value today'],[2.2,2.2,1.6]);
  return {svg:out,title:'Value today of £1,000 of future harm',caption:`Height: what £1,000 of harm is worth today, over discount rates of 0–6% and 0–200 years ahead. The coral line is your rate (${r0.toFixed(2)}%).`};
 }});

const E8_SCC=[
 {n:'Nordhaus DICE-2016R',v:31,yr:'2017',unit:'2010 dollars, for 2015 emissions',note:'Discount rate about 4.25%. Nordhaus (2017), PNAS 114, 1518–1523.'},
 {n:'US interim estimate',v:51,yr:'2021',unit:'2020 dollars, 3% rate, 2020 emissions',note:'US Interagency Working Group (2021), interim update of its 2016 values.'},
 {n:'Stern Review',v:85,yr:'2006',unit:'dollars per tonne of CO₂, business as usual',note:'Low discount rate (about 1.4%). Stern (2007).'},
 {n:'Rennert et al.',v:185,yr:'2022',unit:'2020 dollars, near-2% rate, 2020 emissions',note:'Updated damages and discounting. Nature 610, 687–692.'},
 {n:'US EPA',v:190,yr:'2023',unit:'2020 dollars, 2% rate, 2020 emissions',note:'EPA report on the social cost of greenhouse gases (2023).'}];
SCENE({id:'climate-economics-scc',name:'The social cost of carbon',tag:'One number, many assumptions',
 definition:'The social cost of carbon is the present value of all the future harm done by one more tonne of carbon dioxide. Governments use it to weigh climate policies. Estimates differ several-fold, mostly because of the discount rate and how damages are modelled.',
 example:'Nordhaus’s model gave about $31 a tonne; the US Environmental Protection Agency’s 2023 estimate was about $190. Both use the same idea but different discounting and damage evidence.',
 desc:'Published estimates of the social cost of carbon, in US dollars per tonne of CO₂ (rounded; their price years and settings differ, so this is not a like-for-like comparison). Press a bar to see its assumptions.',
 research:['Nordhaus, W. D. (2017). Revisiting the social cost of carbon. PNAS 114, 1518–1523.','Rennert, K. et al. (2022). Comprehensive evidence implies a higher social cost of CO₂. Nature 610, 687–692.','US EPA (2023). Report on the Social Cost of Greenhouse Gases: Estimates Incorporating Recent Scientific Advances.','Interagency Working Group on Social Cost of Greenhouse Gases (2021). Technical Support Document: interim estimates.'],
 dur:10,hint:'Press each bar. Notice how the lower discount rates sit with the higher costs.',
 init:()=>({pick:0}),
 watch(p){return {pick:Math.min(4,Math.floor(p*5))}},
 ui:[{choose:E8_SCC.map((e,i)=>[String(i),e.n]),label:'Estimate',get:s=>String(s.pick),act:'pick'}],
 on:{pick(s,v){s.pick=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Estimates of the social cost of carbon',26);
  const A=E8_plot(200,50,280,190,[0,200],[0,5],{xt:[[0,'$0'],[100,'$100'],[200,'$200']],xl:'US dollars per tonne of CO₂ (rounded)'});out+=A.svg;
  E8_SCC.forEach((e,i)=>{const y=60+i*36,sel=i===s.pick;
   const inner=R(A.X(0),y,A.X(e.v)-A.X(0),26,sel?C.coral:'#e8b9a8','none',4)+TF(A.X(e.v)+6,y+18,'$'+e.v,13,C.ink,'start')+TF(192,y+18,e.n,13,sel?C.ink:C.muted,'end');
   out+=hit(X,'pick',i,`${e.n}: about ${e.v} dollars a tonne. Press for its assumptions.`,inner)});
  const e=E8_SCC[s.pick];
  out+=R(40,282,520,76,'#fbf3ef',C.coral,8);
  out+=TBF(56,304,`${e.n} (${e.yr}): about $${e.v} a tonne`,14,C.ink,'start');
  out+=TF(56,324,e.unit,13,C.muted,'start')+TF(56,344,e.note,13,C.ink,'start');
  return {svg:out,phase:`${e.n}: about $${e.v} per tonne of CO₂ (${e.unit}). The estimates rise as the discount rate falls and as damage evidence is updated; official US values have also changed with administrations.`};
 }});

// Illustrative marginal abatement cost: MAC(a) = 300 (a/100)² dollars a tonne for cutting a% of emissions.
const E8_mac=a=>300*Math.pow(a/100,2),E8_abate=t=>100*Math.sqrt(clamp(t,0,300)/300);
SCENE({id:'climate-economics-tax',name:'A price on carbon',tag:'Make the polluter pay the harm',
 definition:'A carbon tax is a Pigouvian tax: it charges emitters for the harm their emissions do to others. Each emitter cuts emissions wherever cutting is cheaper than the tax. If the tax equals the social cost of carbon, the cuts that are worth making get made and no others.',
 example:'With a tax of $100 a tonne, every cut that costs less than $100 is cheaper than paying, so it happens. The cheapest cuts come first, the expensive ones only at higher prices.',
 desc:'An illustrative marginal abatement cost curve: the cost of cutting one more tonne, rising as more is cut. Set a carbon tax: abatement goes to where the curve meets the tax. Green area: total cost of the cuts. Blue rectangle: tax still paid on remaining emissions. The dashed line marks a chosen social cost of carbon.',
 research:['Pigou, A. C. (1920). The Economics of Welfare. Macmillan.','Baumol, W. J. & Oates, W. E. (1971). The use of standards and prices for protection of the environment. Swedish Journal of Economics 73, 42–54.','Stiglitz, J. E., Stern, N. et al. (2017). Report of the High-Level Commission on Carbon Prices. Carbon Pricing Leadership Coalition.'],
 dur:10,hint:'Move the tax to the dashed social-cost line. That is the efficient amount of cutting in this model.',
 init:()=>({tax:60,scc:185}),
 watch(p){return {tax:Math.round(lerp(10,190,smooth(p))),scc:185}},
 ui:[{range:'tax',label:'Carbon tax',min:0,max:300,step:5,get:s=>s.tax,act:'tax',show:v=>'$'+v+' a tonne'},{choose:[['51','Social cost $51'],['185','Social cost $185']],label:'Social cost to mark',get:s=>String(s.scc),act:'scc'}],
 on:{tax(s,v){s.tax=Number(v)},scc(s,v){s.scc=Number(v)}},
 draw(s){
  const a=E8_abate(s.tax),aEff=E8_abate(s.scc);
  let out=heading('Where a carbon tax stops the cutting',26);
  const A=E8_plot(70,52,360,250,[0,100],[0,300],{xt:[[0,'0%'],[50,'50%'],[100,'100%']],yt:[[0,'$0'],[100,'$100'],[200,'$200'],[300,'$300']],xl:'share of emissions cut',yl:'cost of cutting one more tonne'});out+=A.svg;
  const area=range(41).map(i=>{const x=a*i/40;return [A.X(x),A.Y(E8_mac(x))]});
  if(a>0)out+=P(E8_path(area)+`L${fmt(A.X(a))} ${fmt(A.Y(0))}L${fmt(A.X(0))} ${fmt(A.Y(0))}Z`,'none',0,'#bfe0d2');
  out+=R(A.X(a),A.Y(s.tax),A.X(100)-A.X(a),A.Y(0)-A.Y(s.tax),'#cfe0f0','none',0);
  out+=P(E8_path(range(51).map(i=>[A.X(i*2),A.Y(E8_mac(i*2))])),C.green,2.4);
  out+=L(A.X(0),A.Y(s.tax),A.X(100),A.Y(s.tax),C.blue,2)+TF(A.X(2),A.Y(s.tax)-6,'tax $'+s.tax,13,C.blue,'start');
  out+=L(A.X(0),A.Y(s.scc),A.X(100),A.Y(s.scc),C.coral,1.6,'stroke-dasharray="6 4"')+TF(Math.abs(s.tax-s.scc)<30?A.X(40):A.X(2),A.Y(s.scc)-6,'social cost $'+s.scc,13,C.coral,'start');
  out+=Ci(A.X(a),A.Y(Math.min(300,s.tax)),5,C.blue);
  const cost=100*Math.pow(a/100,3)*100,rev=s.tax*(100-a)/100*40;
  out+=counter(450,60,'emissions cut',Math.round(a)+'%',C.green,130)+counter(450,116,'efficient cut',Math.round(aEff)+'%',C.coral,130);
  out+=E8_lines(450,190,E8_wrap(Math.abs(a-aEff)<3?'The tax matches the harm: cuts stop exactly where they stop being worth it.':a<aEff?'Too low: some cuts cheaper than the harm they prevent are not being made.':'Too high: some cuts now cost more than the harm they prevent.',20),C.ink,13,17);
  out+=TF(70,350,'Illustrative cost curve.',12,C.muted,'start')+TF(70,368,`If the world emitted 40 billion tonnes, the tax would raise about $${Math.round(rev).toLocaleString('en-GB')} billion a year.`,12,C.muted,'start');
  return {svg:out,phase:`A $${s.tax} tax cuts ${Math.round(a)}% of emissions in this model; matching the social cost of $${s.scc} would cut ${Math.round(aEff)}%. Real cost curves are uncertain, and a tax also raises revenue that can be returned or spent.`};
 }});

/* ================================================================ automation and labour */
// Illustrative occupation groups: employment weight, automation probability of the whole occupation (Frey &
// Osborne style), and the share of a typical worker's tasks that could be automated (Arntz et al. style).
const E8_OCC=[['Office and admin',14,.96,.62],['Sales',11,.92,.55],['Food preparation',9,.86,.66],['Transport',7,.82,.58],['Production',6,.79,.73],['Construction',5,.68,.42],['Maintenance',4,.6,.4],['Business and finance',6,.38,.4],['Personal care',4,.3,.25],['Healthcare support',3,.45,.35],['Management',7,.15,.25],['Computing, engineering',5,.07,.3],['Health professionals',6,.1,.22],['Education',6,.05,.18],['Arts and media',3,.08,.2],['Community services',4,.06,.15]];
SCENE({id:'automation-labour',name:'Jobs or tasks?',tag:'Why 47% and 9% can both be “right”',
 definition:'A job is a bundle of tasks. Frey and Osborne estimated whether whole occupations could be automated and found 47% of US jobs at high risk. Arntz, Gregory and Zierahn looked at the tasks individual workers actually do, which vary within an occupation, and found about 9% across rich countries.',
 example:'A bank clerk’s occupation may score high, but a particular clerk who spends half the day advising customers does many tasks a machine cannot. Counting tasks lowers the share at high risk.',
 desc:'Sixteen illustrative occupation groups, bar width showing employment. Choose occupation view (risk for the whole occupation) or task view (share of a typical worker’s tasks). Groups over the threshold count as high risk. The headline figures in each study are shown beside the illustration.',
 research:['Frey, C. B. & Osborne, M. A. (2017). The future of employment: how susceptible are jobs to computerisation? Technological Forecasting and Social Change 114, 254–280 (working paper 2013).','Arntz, M., Gregory, T. & Zierahn, U. (2016). The risk of automation for jobs in OECD countries. OECD Social, Employment and Migration Working Papers 189.','Autor, D. H., Levy, F. & Murnane, R. J. (2003). The skill content of recent technological change. Quarterly Journal of Economics 118, 1279–1333.'],
 dur:10,hint:'Switch between the two views at the 70% threshold, then move the threshold.',
 init:()=>({view:'occ',th:70}),
 watch(p){return {view:p<.5?'occ':'task',th:70}},
 ui:[{choose:[['occ','Occupation view'],['task','Task view']],label:'Measure',get:s=>s.view,act:'view'},{range:'th',label:'High-risk threshold',min:50,max:90,step:5,get:s=>s.th,act:'th',show:v=>v+'%'}],
 on:{view(s,v){s.view=v},th(s,v){s.th=Number(v)}},
 draw(s){
  const idx=s.view==='occ'?2:3,th=s.th/100;let at=0;E8_OCC.forEach(o=>{if(o[idx]>=th)at+=o[1]});
  let out=heading(s.view==='occ'?'Occupation view: can the whole job be automated?':'Task view: how much of a worker’s day?',26);
  const A=E8_plot(190,48,250,288,[0,1],[0,16],{xt:[[0,'0%'],[.5,'50%'],[1,'100%']]});out+=A.svg;
  E8_OCC.forEach((o,i)=>{const y=A.Y(16-i)+3,h=14,v=o[idx],hi=v>=th;out+=R(A.X(0),y,A.X(v)-A.X(0),h,hi?C.coral:C.blue,'none',3)+TF(184,y+11,o[0]+' · '+o[1]+'%',12,C.ink,'end')});
  out+=L(A.X(th),A.Y(16),A.X(th),A.Y(0),C.ink,1.4,'stroke-dasharray="4 3"');
  out+=TF(190,376,'Illustrative groups; % after each name = share of employment.',12,C.muted,'start');
  out+=counter(458,54,'jobs at high risk',at+'%',C.coral,128);
  out+=E8_lines(458,130,['Published headline:',s.view==='occ'?'47% of US jobs':'9% across 21 OECD','',s.view==='occ'?'Frey & Osborne':'Arntz, Gregory &',s.view==='occ'?'(2013/2017)':'Zierahn (2016)'],C.ink,13,17);
  out+=E8_lines(458,240,E8_wrap('At-risk does not mean lost: it ignores cost, law and new tasks.',19),C.muted,12,16);
  return {svg:out,phase:`${s.view==='occ'?'Scoring whole occupations':'Scoring the tasks people actually do'}, ${at}% of these jobs are over the ${s.th}% threshold. The method, not just the technology, drives the headline number.`};
 }});

SCENE({id:'automation-labour-polarisation',name:'The hollowing middle',tag:'Routine jobs shrink first',
 definition:'Computers are best at routine tasks that follow explicit rules: bookkeeping, filing, repetitive assembly. Those were often middle-paid jobs. From the 1980s employment grew at the top and at the bottom of the wage scale but shrank in the middle: job polarisation.',
 example:'Clerical and production jobs fell as a share of employment, while professional jobs and in-person service jobs (cleaning, care, food service) grew. Both ends are hard to automate for different reasons.',
 desc:'Change in each occupation’s share of employment, ordered by its starting wage. The shapes are stylised from the published figures, not plotted data. Press a part of the wage scale to see example jobs and why they grew or shrank.',
 research:['Autor, D. H. & Dorn, D. (2013). The growth of low-skill service jobs and the polarization of the US labor market. American Economic Review 103, 1553–1597.','Goos, M., Manning, A. & Salomons, A. (2014). Explaining job polarization: routine-biased technological change and offshoring. American Economic Review 104, 2509–2526.','Autor, D. H. (2015). Why are there still so many jobs? Journal of Economic Perspectives 29(3), 3–30.'],
 dur:10,hint:'Press the low, middle and high parts of the curve. Then switch to Europe.',
 init:()=>({set:'us',band:1}),
 watch(p){return {set:p<.5?'us':'eu',band:Math.min(2,Math.floor((p%.5)/.5*3))}},
 ui:[{choose:[['us','US 1980–2005'],['eu','Europe 1993–2010']],label:'Data shape',get:s=>s.set,act:'set'}],
 on:{set(s,v){s.set=v;return 'keep'},band(s,a){s.band=Number(a);return 'keep'}},
 draw(s,f,X){
  let out=heading('Employment growth along the wage scale',26);
  const A=E8_plot(70,52,330,230,[0,100],[-1,1],{xt:[[12,'lowest paid'],[50,'middle'],[88,'highest paid']],yt:[[-1,'shrank'],[0,'0'],[1,'grew']],xl:'occupations ordered by starting wage'});out+=A.svg;
  out+=L(A.X(0),A.Y(0),A.X(100),A.Y(0),C.line,1.2);
  if(s.set==='us'){const fn=x=>.75*Math.exp(-Math.pow((x-4)/9,2))+.85*Math.pow(x/100,3)-.55*Math.exp(-Math.pow((x-45)/20,2))+.05;out+=P(E8_path(range(101).map(x=>[A.X(x),A.Y(clamp(fn(x),-1,1))])),C.blue,2.6)}
  else{[[-0,.35],[1,-.8],[2,.6]].forEach(([i,v])=>{const x0=A.X(i*33.3+3),x1=A.X(i*33.3+30);out+=R(x0,v>0?A.Y(v):A.Y(0),x1-x0,Math.abs(A.Y(v)-A.Y(0)),v>0?C.blue:C.coral,'none',3)})}
  const bands=[['Low-paid','cleaning, care, food service','In-person and adaptable: hard to automate, cheap to hire.'],['Middle-paid','clerical, production, sales','Routine, rule-based tasks: easiest for computers.'],['High-paid','professional, technical, managerial','Abstract problem-solving that computers complement.']];
  bands.forEach((b,i)=>{const x=A.X(i*33.3),w=A.X(33.3)-A.X(0);out+=hit(X,'band',i,`${b[0]} jobs. Press for examples.`,R(x+2,A.Y(1)+2,w-4,A.Y(-1)-A.Y(1)-4,i===s.band?'rgba(23,114,183,.08)':'rgba(0,0,0,0)',i===s.band?C.blue:'none',4))});
  const b=bands[s.band];out+=TBF(420,72,b[0],15,C.ink,'start')+E8_lines(420,94,E8_wrap('e.g. '+b[1],22),C.muted,13,17)+E8_lines(420,150,E8_wrap(b[2],22),C.ink,13,17);
  out+=TF(70,336,s.set==='us'?'Shape after Autor & Dorn (2013), stylised.':'Low, middle and high-paid groups after Goos, Manning & Salomons (2014), stylised.',13,C.muted,'start');
  out+=TF(70,356,'Offshoring and the decline of manufacturing also play a part.',13,C.muted,'start');
  return {svg:out,phase:`${b[0]} jobs (${b[1]}): ${b[2]} The pattern is a U: growth at both ends, a hollowing middle.`};
 }});

// Acemoglu & Restrepo (2019): change in labour's share ≈ −displacement + reinstatement (per year).
const E8_AR={early:{n:'1947–1987',d:.48,r:.47},late:{n:'1987–2017',d:.70,r:.35},custom:{n:'Your own'}};
SCENE({id:'automation-labour-reinstatement',name:'Displacement and new tasks',tag:'Machines take tasks, people gain new ones',
 definition:'Automation displaces workers from tasks they used to do, which lowers labour’s share of income. But new tasks keep appearing that people do better (programmers, therapists, data analysts): reinstatement. Labour’s share depends on the race between the two.',
 example:'Acemoglu and Restrepo estimated that in the US from 1947 to 1987 displacement (about 0.48% a year) was matched by reinstatement (about 0.47%). From 1987 to 2017 displacement sped up (about 0.70%) and reinstatement slowed (about 0.35%).',
 desc:'Set yearly rates of displacement and reinstatement, or pick one of the published periods (rounded). The line shows how labour’s share of income would drift over 40 years from 62%, with all else equal. A deliberately simple accounting model.',
 research:['Acemoglu, D. & Restrepo, P. (2019). Automation and new tasks: how technology displaces and reinstates labor. Journal of Economic Perspectives 33(2), 3–30.','Autor, D., Chin, C., Salomons, A. & Seegmiller, B. (2024). New frontiers: the origins and content of new work, 1940–2018. Quarterly Journal of Economics 139, 1399–1465.'],
 dur:10,hint:'Compare the two periods. Then find the reinstatement rate that keeps labour’s share flat.',
 init:()=>({pre:'early',d:.48,r:.47}),
 watch(p){const e=p<.5?E8_AR.early:E8_AR.late;return {pre:p<.5?'early':'late',d:e.d,r:e.r}},
 ui:[{choose:Object.keys(E8_AR).map(k=>[k,E8_AR[k].n]),label:'Period',get:s=>s.pre,act:'pre'},{range:'d',label:'Displacement a year',min:0,max:1.5,step:.05,get:s=>s.d,act:'d',show:v=>Number(v).toFixed(2)+'%'},{range:'r',label:'Reinstatement a year',min:0,max:1.5,step:.05,get:s=>s.r,act:'r',show:v=>Number(v).toFixed(2)+'%'}],
 on:{pre(s,v){s.pre=v;if(v!=='custom'){s.d=E8_AR[v].d;s.r=E8_AR[v].r}},d(s,v){s.d=Number(v);s.pre='custom'},r(s,v){s.r=Number(v);s.pre='custom'}},
 draw(s){
  const path=range(41).map(t=>62+(s.r-s.d)*t),end=path[40];
  let out=heading('The race between displacement and new tasks',26);
  const A=E8_plot(70,52,320,240,[0,40],[30,80],{xt:[[0,'year 0'],[20,'20'],[40,'40']],yt:[[30,'30%'],[50,'50%'],[62,'62%'],[80,'80%']],xl:'years',yl:'labour’s share of income'});out+=A.svg;
  out+=P(E8_path(path.map((v,t)=>[A.X(t),A.Y(clamp(v,30,80))])),end<62?C.coral:C.green,2.6);
  out+=L(A.X(0),A.Y(62),A.X(40),A.Y(62),C.line,1,'stroke-dasharray="4 4"');
  const bx=420;out+=TF(bx,70,'per year',13,C.muted,'start');
  out+=R(bx,80,150*s.d/1.5,18,C.coral,'none',3)+TF(bx,114,'displacement −'+s.d.toFixed(2)+'%',13,C.coral,'start');
  out+=R(bx,126,150*s.r/1.5,18,C.green,'none',3)+TF(bx,160,'reinstatement +'+s.r.toFixed(2)+'%',13,C.green,'start');
  out+=counter(bx,180,'share after 40 years',end.toFixed(1)+'%',end<62?C.coral:C.green,150);
  out+=E8_lines(bx,252,E8_wrap('Rates are percentage points of labour’s share a year (rounded).',22),C.muted,12,16);
  out+=TF(70,350,'Accounting model only: wages, prices and new industries are left out.',13,C.muted,'start');
  return {svg:out,phase:Math.abs(s.r-s.d)<.02?'Displacement and reinstatement balance: machines take tasks, new tasks arrive, and labour’s share holds steady.':s.r<s.d?`Displacement outruns new tasks by ${(s.d-s.r).toFixed(2)} points a year, so labour’s share falls to ${end.toFixed(1)}% over 40 years.`:`New tasks outrun displacement, so labour’s share rises to ${end.toFixed(1)}%.`};
 }});

/* ================================================================ platform economies */
// Two-sided market (Rochet & Tirole 2003): buyers value sellers (aB), sellers value buyers (aS).
// Participation n = clamp(0.5 − price + a × other side). Profit = (pB − c) nB + (pS − c) nS.
const E8_A_B=.3,E8_A_S=.8,E8_COST=.05;
function E8_twoSided(pB,pS){let nB=.5,nS=.5;for(let i=0;i<200;i++){nB=clamp(.5-pB+E8_A_B*nS,0,1);nS=clamp(.5-pS+E8_A_S*nB,0,1)}return {nB,nS,profit:(pB-E8_COST)*nB+(pS-E8_COST)*nS}}
const E8_best=(()=>{let best={profit:-1e9};for(let a=-40;a<=80;a++)for(let b=-40;b<=80;b++){const pB=a/100,pS=b/100,o=E8_twoSided(pB,pS);if(o.profit>best.profit)best={...o,pB,pS}}return best})();
SCENE({id:'platform-economies',name:'Two-sided markets',tag:'Who pays, and who gets it free',
 definition:'A platform serves two groups who need each other: buyers and sellers, readers and advertisers, riders and drivers. Each side joins only if enough of the other side is there. So a platform may charge one side little or nothing, or pay it, and make its money from the other.',
 example:'Card schemes charge shops a fee on each sale but give cardholders rewards. Many news and search sites are free to users and paid for by advertisers.',
 desc:'Set the price each side pays (negative means a subsidy). Bars show how much of each side joins, given what each side gains from the other. The counter shows the platform’s profit; the marker shows the most profitable pair of prices. Here sellers value buyers more (0.8) than buyers value sellers (0.3). Illustrative numbers.',
 research:['Rochet, J.-C. & Tirole, J. (2003). Platform competition in two-sided markets. Journal of the European Economic Association 1, 990–1029.','Armstrong, M. (2006). Competition in two-sided markets. RAND Journal of Economics 37, 668–691.','Evans, D. S. & Schmalensee, R. (2016). Matchmakers: The New Economics of Multisided Platforms. Harvard Business Review Press.'],
 dur:10,hint:'Find the highest profit. Which side ends up paying less?',
 init:()=>({pB:.3,pS:.3}),
 watch(p){const u=smooth(p);return {pB:Math.round(lerp(.3,E8_best.pB,u)*100)/100,pS:Math.round(lerp(.3,E8_best.pS,u)*100)/100}},
 ui:[{range:'pB',label:'Price to buyers',min:-.4,max:.8,step:.01,get:s=>s.pB,act:'pB',show:v=>Number(v).toFixed(2)},{range:'pS',label:'Price to sellers',min:-.4,max:.8,step:.01,get:s=>s.pS,act:'pS',show:v=>Number(v).toFixed(2)},{b:'Jump to the best prices',act:'best'}],
 on:{pB(s,v){s.pB=Number(v)},pS(s,v){s.pS=Number(v)},best(s){s.pB=E8_best.pB;s.pS=E8_best.pS}},
 draw(s){
  const o=E8_twoSided(s.pB,s.pS);
  let out=heading('Pricing a platform with two sides',26);
  const bar=(x,label,v,col,price)=>R(x,90,90,200,'#eef3f6','none',6)+R(x,90+200*(1-v),90,200*v,col,'none',6)+TBF(x+45,84+200*(1-v)-2,Math.round(v*100)+'%',15,C.ink)+TF(x+45,312,label,14,C.ink)+TF(x+45,332,(price<0?'paid ':'pays ')+Math.abs(price).toFixed(2),13,price<0?C.green:C.muted);
  out+=bar(70,'buyers join',o.nB,C.blue,s.pB)+bar(200,'sellers join',o.nS,C.purple,s.pS);
  out+=curveArrow(165,150,195,150,-20,C.muted,1.6)+curveArrow(195,190,165,190,-20,C.muted,1.6);
  out+=counter(330,70,'platform profit',o.profit.toFixed(3),o.profit>=E8_best.profit-.002?C.green:C.ink,140);
  out+=counter(330,126,'best possible',E8_best.profit.toFixed(3),C.muted,140);
  out+=E8_lines(330,200,['Best prices here:',`buyers ${E8_best.pB.toFixed(2)}, sellers ${E8_best.pS.toFixed(2)}`],C.ink,13,17);
  out+=E8_lines(330,250,E8_wrap('The side whose presence is worth more to the other gets the lower price.',30),C.muted,13,17);
  out+=TF(30,366,'Each seller is worth 0.3 to a buyer; each buyer is worth 0.8 to a seller. Illustrative model.',12,C.muted,'start');
  return {svg:out,phase:`At these prices ${Math.round(o.nB*100)}% of buyers and ${Math.round(o.nS*100)}% of sellers join, and profit is ${o.profit.toFixed(3)}. The best prices charge buyers ${E8_best.pB.toFixed(2)} and sellers ${E8_best.pS.toFixed(2)}: buyers are cheap to attract and valuable to sellers.`};
 }});

// Two competing platforms with network effects: users drift towards the one offering more (quality + gamma × share).
function E8_tip(gamma,qB,s0,T=40){const s=[s0];for(let t=0;t<T;t++){const a=s[t],uA=gamma*a,uB=qB+gamma*(1-a);const target=1/(1+Math.exp(-6*(uA-uB)));s.push(a+.25*(target-a))}return s}
SCENE({id:'platform-economies-tipping',name:'Tipping',tag:'Winner takes most',
 definition:'With strong network effects, people want the platform everyone else uses. A small early lead can then snowball until one platform takes nearly the whole market (tipping), even if a rival is a little better. With weak network effects, both can survive.',
 example:'Video recorders (VHS against Betamax) and early social networks are often cited cases; how much quality mattered in each is still argued over.',
 desc:'Two platforms, A and B. Each period some users move towards the platform that offers more: its quality plus the network-effect strength times its share. Set the strength, B’s quality edge and A’s starting share. The line shows A’s market share over 40 periods.',
 research:['Katz, M. L. & Shapiro, C. (1985). Network externalities, competition, and compatibility. American Economic Review 75, 424–440.','Arthur, W. B. (1989). Competing technologies, increasing returns, and lock-in by historical events. Economic Journal 99, 116–131.','Liebowitz, S. J. & Margolis, S. E. (1990). The fable of the keys. Journal of Law and Economics 33, 1–25 (a sceptical view of lock-in stories).'],
 dur:10,hint:'Give B a small quality edge, then give A a head start. With strong network effects, does the better platform win?',
 init:()=>({g:1.2,qB:.15,s0:.6}),
 watch(p){return p<.5?{g:.25,qB:0,s0:.6}:{g:1.2,qB:.15,s0:.6}},
 ui:[{range:'g',label:'Network-effect strength',min:0,max:2,step:.05,get:s=>s.g,act:'g',show:v=>Number(v).toFixed(2)},{range:'qB',label:'B’s quality edge',min:-.4,max:.4,step:.05,get:s=>s.qB,act:'qB',show:v=>Number(v).toFixed(2)},{range:'s0',label:'A’s starting share',min:.1,max:.9,step:.05,get:s=>s.s0,act:'s0',show:v=>Math.round(v*100)+'%'}],
 on:{g(s,v){s.g=Number(v)},qB(s,v){s.qB=Number(v)},s0(s,v){s.s0=Number(v)}},
 draw(s){
  const path=E8_tip(s.g,s.qB,s.s0),end=path[path.length-1];
  let out=heading('Do network effects tip the market?',26);
  const A=E8_plot(70,52,340,250,[0,40],[0,1],{xt:[[0,'0'],[20,'20'],[40,'40']],yt:[[0,'0%'],[.5,'50%'],[1,'100%']],xl:'period',yl:'A’s share of users'});out+=A.svg;
  out+=L(A.X(0),A.Y(.5),A.X(40),A.Y(.5),C.grid,1);
  out+=P(E8_path(path.map((v,t)=>[A.X(t),A.Y(v)])),C.blue,2.6);
  const verdict=end>.9?'Tipped to A':end<.1?'Tipped to B':'Both survive';
  out+=counter(430,60,'A’s final share',Math.round(end*100)+'%',C.blue,140)+counter(430,116,'outcome',verdict,end>.9||end<.1?C.coral:C.green,140);
  out+=E8_lines(430,196,E8_wrap(end>.9&&s.qB>0?'The worse platform won: its head start mattered more than quality.':end<.1&&s.s0>.5?'B overcame A’s head start with quality and network pull.':verdict==='Both survive'?'Network effects are too weak to force a single winner.':'The bigger or better platform took the market.',20),C.ink,13,17);
  out+=TF(70,350,'Illustrative model: each period a quarter of users move towards the platform offering more.',12,C.muted,'start');
  return {svg:out,phase:`Strength ${Number(s.g).toFixed(2)}, B’s edge ${Number(s.qB).toFixed(2)}, A starting at ${Math.round(s.s0*100)}%: ${verdict==='Both survive'?'both survive':verdict.replace('Tipped','tipped')} (A ends at ${Math.round(end*100)}%). Where tipping happens, history and timing can matter as much as quality.`};
 }});

// Critical mass (Granovetter 1978): each person joins if at least their personal threshold share has joined.
// Thresholds are spread as a logistic around 40%; F(n) is the share who would join if n had.
const E8_F=n=>1/(1+Math.exp(-(n-.4)/.08));
function E8_adopt(n0,T=30){const n=[n0];for(let t=0;t<T;t++)n.push(E8_F(n[t]));return n}
SCENE({id:'platform-economies-chicken-egg',name:'Critical mass',tag:'The chicken-and-egg problem',
 definition:'A new platform is worthless with no users, so nobody joins first. If people join once enough others have, there is a critical mass: below it the platform empties, above it it fills. Launch strategies such as subsidies, seeding one side or bundling try to get past it.',
 example:'Each person has a threshold: “I’ll join once 30% of my friends have.” If a launch brings in enough people to cross other people’s thresholds, they join, which crosses more thresholds, and so on.',
 desc:'Left: a cobweb diagram. The S-shaped curve gives the share who would join if a given share already had; the diagonal is where the two are equal. Starting from the launch share, the path bounces to an equilibrium. Right: the same share over 30 periods. Thresholds are illustrative.',
 research:['Granovetter, M. (1978). Threshold models of collective behavior. American Journal of Sociology 83, 1420–1443.','Evans, D. S. & Schmalensee, R. (2010). Failure to launch: critical mass in platform businesses. Review of Network Economics 9(4).','Schelling, T. C. (1978). Micromotives and Macrobehavior. Norton.'],
 dur:10,hint:'Find the smallest launch share that fills the platform.',
 init:()=>({n0:.3}),
 watch(p){return {n0:Math.round(lerp(.2,.5,p)*100)/100}},
 ui:[{range:'n0',label:'Share brought in at launch',min:0,max:.8,step:.01,get:s=>s.n0,act:'n0',show:v=>Math.round(v*100)+'%'}],
 on:{n0(s,v){s.n0=Number(v)}},
 draw(s){
  const path=E8_adopt(s.n0),end=path[path.length-1];
  let out=heading('Getting past critical mass',26);
  const A=E8_plot(60,52,250,250,[0,1],[0,1],{xt:[[0,'0'],[.5,'50%'],[1,'100%']],yt:[[0,'0'],[.5,'50%'],[1,'100%']],xl:'share who have joined',yl:'share who would join'});out+=A.svg;
  out+=L(A.X(0),A.Y(0),A.X(1),A.Y(1),C.line,1.4);
  out+=P(E8_path(range(101).map(i=>[A.X(i/100),A.Y(E8_F(i/100))])),C.purple,2.4);
  let cw=`M${fmt(A.X(path[0]))} ${fmt(A.Y(0))}`;for(let t=0;t<12;t++){cw+=`L${fmt(A.X(path[t]))} ${fmt(A.Y(path[t+1]))}L${fmt(A.X(path[t+1]))} ${fmt(A.Y(path[t+1]))}`}
  out+=P(cw,C.coral,1.6);
  const B=E8_plot(370,52,200,250,[0,30],[0,1],{xt:[[0,'0'],[15,'15'],[30,'30']],yt:[[0,'0'],[1,'100%']],xl:'period'});out+=B.svg;
  out+=P(E8_path(path.map((v,t)=>[B.X(t),B.Y(v)])),end>.5?C.green:C.coral,2.4);
  out+=TF(370,46,end>.5?'fills up':'empties',13,end>.5?C.green:C.coral,'start');
  out+=TF(60,356,`Launch at ${Math.round(s.n0*100)}%: the platform ends at ${Math.round(end*100)}%. The tipping point in this model is about 35%.`,13,C.ink,'start');
  return {svg:out,phase:end>.5?`Launching with ${Math.round(s.n0*100)}% is past critical mass: each round more thresholds are crossed and the platform fills.`:`Launching with ${Math.round(s.n0*100)}% is not enough: too few thresholds are crossed and people drift away until the platform is nearly empty.`};
 }});

/* ================================================================ measuring wellbeing */
// Stylised countries: life satisfaction ≈ 2.4 + 0.75 ln(GDP per head / $1,000) + seeded scatter.
const E8_CTRY=(()=>{const r=rng(808);return range(40).map(()=>{const lg=Math.log(800)+r()*(Math.log(90000)-Math.log(800));const gdp=Math.exp(lg);return {gdp,ls:clamp(2.4+.75*Math.log(gdp/1000)+E8_gauss(r)*.55,2,8.2)}})})();
SCENE({id:'measuring-wellbeing',name:'Does money buy happiness?',tag:'The Easterlin paradox',
 definition:'In 1974 Richard Easterlin found that richer people within a country were happier, but countries did not seem to get happier as they grew richer over time. Later work found that across countries life satisfaction rises steadily with the logarithm of income. Whether it rises over time within countries is still argued over.',
 example:'On a log scale, doubling income from $2,000 to $4,000 adds about as much life satisfaction as doubling from $40,000 to $80,000. On an ordinary scale, the curve looks flat at the top, which once looked like a satiation point.',
 desc:'Stylised countries, following the published pattern (not real country data): average life satisfaction on a 0–10 ladder against income per head. Switch between an ordinary and a logarithmic income axis, or view the long-run time series pattern in one rich country, which is where the paradox lives.',
 research:['Easterlin, R. A. (1974). Does economic growth improve the human lot? In David & Reder (eds), Nations and Households in Economic Growth. Academic Press.','Deaton, A. (2008). Income, health, and well-being around the world. Journal of Economic Perspectives 22(2), 53–72.','Stevenson, B. & Wolfers, J. (2008). Economic growth and subjective well-being: reassessing the Easterlin paradox. Brookings Papers on Economic Activity, 1–87.','Easterlin, R. A. & O’Connor, K. J. (2022). The Easterlin paradox. IZA Discussion Paper 13923.'],
 dur:12,hint:'Compare the ordinary and log axes. Then look at the time view: is there a contradiction?',
 init:()=>({view:'linear'}),
 watch(p){return {view:p<.33?'linear':p<.66?'log':'time'}},
 ui:[{choose:[['linear','Countries, ordinary scale'],['log','Countries, log scale'],['time','One country over time']],label:'View',get:s=>s.view,act:'view'}],
 on:{view(s,v){s.view=v}},
 draw(s){
  let out=heading(s.view==='time'?'A rich country over fifty years (stylised)':'Income and life satisfaction across countries',26);
  if(s.view==='time'){
   const A=E8_plot(70,52,420,226,[1972,2022],[0,10],{xt:[[1972,'1972'],[1997,'1997'],[2022,'2022']],yt:[[0,'0'],[5,'5'],[10,'10']],yl:'life satisfaction (0–10) and income'});out+=A.svg;
   out+=P(E8_path(range(51).map(i=>[A.X(1972+i),A.Y(2+3.5*i/50)])),C.green,2.4)+TF(A.X(2022)-4,A.Y(5.5)-8,'income per head (index)',13,C.green,'end');
   out+=P(E8_path(range(51).map(i=>[A.X(1972+i),A.Y(7.1+.15*Math.sin(i/4)-.004*i)])),C.blue,2.4)+TF(A.X(2022)-4,A.Y(7)+20,'average life satisfaction',13,C.blue,'end');
   out+=E8_lines(70,326,E8_wrap('Income more than doubles; average life satisfaction barely moves. Stevenson and Wolfers find rises in many countries; Easterlin argues the long-run trend is flat. Still debated.',88),C.ink,13,17);
   return {svg:out,phase:'Over decades of growth, average life satisfaction in some rich countries hardly changed. Explanations include comparing ourselves with others and getting used to higher incomes; others argue the data show modest rises.'};
  }
  const lg=s.view==='log',A=E8_plot(70,52,420,226,lg?[Math.log(800),Math.log(90000)]:[0,90000],[2,9],{xt:lg?[[Math.log(1000),'$1k'],[Math.log(4000),'$4k'],[Math.log(16000),'$16k'],[Math.log(64000),'$64k']]:[[0,'$0'],[30000,'$30k'],[60000,'$60k'],[90000,'$90k']],yt:[[2,'2'],[5,'5'],[8,'8']],xl:lg?'income per head (log scale)':'income per head',yl:'life satisfaction (0–10)'});out+=A.svg;
  E8_CTRY.forEach(c=>{out+=Ci(A.X(lg?Math.log(c.gdp):c.gdp),A.Y(c.ls),4.5,C.blue,'#fff','stroke-width="1"')});
  out+=P(E8_path(range(41).map(i=>{const lgx=Math.log(800)+i/40*(Math.log(90000)-Math.log(800)),g=Math.exp(lgx);return [A.X(lg?lgx:g),A.Y(2.4+.75*Math.log(g/1000))]})),C.coral,2.2);
  out+=E8_lines(70,330,E8_wrap(lg?'On a log scale the rise is a straight line: each doubling of income adds about the same.':'On an ordinary scale the curve flattens at the top, but each extra $1,000 still adds a little.',88),C.ink,13,17);
  out+=TF(70,368,'Stylised countries following the published pattern, not real data.',12,C.muted,'start');
  return {svg:out,phase:lg?'Across countries, life satisfaction rises roughly in a straight line with the logarithm of income: doubling income adds about 0.5 points on the 0–10 ladder in this stylised data, whether a country is poor or rich.':'On an ordinary scale the rich countries look as if they have reached a plateau, but that is the curve of a logarithm, not a ceiling.'};
 }});

const E8_hdi=(le,mys,eys,gni)=>{const H=clamp((le-20)/65,0,1),E=clamp((mys/15+eys/18)/2,0,1),I=clamp((Math.log(gni)-Math.log(100))/(Math.log(75000)-Math.log(100)),0,1);return {H,E,I,hdi:Math.cbrt(H*E*I),arith:(H+E+I)/3}};
SCENE({id:'measuring-wellbeing-hdi',name:'The Human Development Index',tag:'Health, education and income in one number',
 definition:'The Human Development Index, introduced by Mahbub ul Haq and Amartya Sen’s work at the UN in 1990, combines a long and healthy life, knowledge and a decent standard of living. Since 2010 it uses a geometric mean, so a country cannot fully make up for poor health with high income.',
 example:'In the 2023/24 report, Switzerland scored 0.967 (highest) and Somalia 0.380 (lowest), for 2022.',
 desc:'Set life expectancy, mean years of schooling of adults, expected years of schooling for children and income per head. Each is scaled between UNDP’s goalposts; the HDI is the geometric mean of the three. The bars compare the geometric mean with a simple average.',
 research:['UNDP (1990). Human Development Report 1990. Oxford University Press.','UNDP (2024). Human Development Report 2023/2024: Breaking the Gridlock. Technical notes give the goalposts: life expectancy 20–85 years, schooling 15 and 18 years, income $100–$75,000 (2017 PPP, logged).','Sen, A. (1999). Development as Freedom. Oxford University Press.'],
 dur:10,hint:'Push income to the top but leave life expectancy low. How much does the geometric mean forgive?',
 init:()=>({le:72,mys:8,eys:13,lg:Math.log10(12000)}),
 watch(p){return {le:Math.round(lerp(55,83,p)),mys:Math.round(lerp(3,13,p)),eys:Math.round(lerp(8,18,p)),lg:lerp(Math.log10(1500),Math.log10(60000),p)}},
 ui:[{range:'le',label:'Life expectancy',min:40,max:85,step:1,get:s=>s.le,act:'le',show:v=>v+' years'},{range:'mys',label:'Mean schooling (adults)',min:0,max:15,step:.5,get:s=>s.mys,act:'mys',show:v=>v+' years'},{range:'eys',label:'Expected schooling (children)',min:0,max:18,step:.5,get:s=>s.eys,act:'eys',show:v=>v+' years'},{range:'lg',label:'Income per head',min:2.5,max:4.875,step:.025,get:s=>s.lg,act:'lg',show:v=>'$'+Math.round(Math.pow(10,v)).toLocaleString('en-GB')}],
 on:{le(s,v){s.le=Number(v)},mys(s,v){s.mys=Number(v)},eys(s,v){s.eys=Number(v)},lg(s,v){s.lg=Number(v)}},
 draw(s){
  const gni=Math.pow(10,s.lg),o=E8_hdi(s.le,s.mys,s.eys,gni);
  let out=heading('Building the Human Development Index',26);
  [['Health',o.H,`life expectancy ${s.le}`,C.green],['Education',o.E,`schooling ${s.mys} and ${s.eys} years`,C.blue],['Income',o.I,'$'+Math.round(gni).toLocaleString('en-GB')+' a head',C.amber]].forEach(([n,v,sub,col],i)=>{const y=60+i*62;
   out+=TBF(40,y+14,n,14,C.ink,'start')+TF(40,y+32,sub,12,C.muted,'start')+R(200,y,220,22,'#eef3f6','none',4)+R(200,y,220*v,22,col,'none',4)+TF(430,y+16,v.toFixed(3),13,C.ink,'start')});
  out+=L(40,250,560,250,C.grid,1.2);
  out+=TBF(40,282,'HDI (geometric mean)',14,C.ink,'start')+R(200,268,220,24,'#eef3f6','none',4)+R(200,268,220*o.hdi,24,C.purple,'none',4)+TBF(430,286,o.hdi.toFixed(3),15,C.purple,'start');
  out+=TF(40,322,'Simple average',13,C.muted,'start')+R(200,310,220,16,'#eef3f6','none',4)+R(200,310,220*o.arith,16,'#c9bfe0','none',4)+TF(430,323,o.arith.toFixed(3),13,C.muted,'start');
  const band=o.hdi>=.8?'very high':o.hdi>=.7?'high':o.hdi>=.55?'medium':'low';
  out+=TF(40,352,`UNDP band: ${band} human development.`,13,C.ink,'start')+TF(40,370,'2022 range: 0.380 (Somalia) to 0.967 (Switzerland).',12,C.muted,'start');
  return {svg:out,phase:`HDI ${o.hdi.toFixed(3)} (${band}). The geometric mean (${o.hdi.toFixed(3)}) sits below the simple average (${o.arith.toFixed(3)}) when the three parts are uneven, so a weak dimension pulls the whole index down.`};
 }});

// Raworth's doughnut. Ceiling statuses follow Richardson et al. (2023): six of nine boundaries transgressed.
const E8_CEIL=[['Climate change',1,'Transgressed: CO₂ above 350 ppm and rising.'],['Biosphere integrity',1,'Transgressed: extinction and loss of ecosystem function.'],['Land-system change',1,'Transgressed: forests cleared beyond the safe level.'],['Freshwater change',1,'Transgressed: rivers and soil moisture altered.'],['Nitrogen and phosphorus',1,'Transgressed: fertiliser run-off overloads waters.'],['Novel entities',1,'Transgressed: plastics and chemicals released untested.'],['Ocean acidification',0,'Within, but close to the boundary.'],['Aerosol loading',0,'Within globally, exceeded in some regions.'],['Ozone depletion',0,'Within, recovering since the Montreal Protocol (1987).']];
const E8_FLOOR=['Food','Health','Education','Income and work','Water','Energy','Networks','Housing','Gender equality','Social equity','Political voice','Peace and justice'];
SCENE({id:'measuring-wellbeing-doughnut',name:'The doughnut',tag:'A floor for people, a ceiling for the planet',
 definition:'Kate Raworth’s doughnut proposes a goal for economies: meet everyone’s basic needs (the inner ring, a social foundation) without overshooting the planet’s limits (the outer ring, an ecological ceiling). The safe and just space is the ring between them. It is a normative proposal, not a measured law.',
 example:'The ceiling uses the planetary boundaries of Rockström and colleagues. Their 2023 assessment found six of nine boundaries transgressed, including climate, biodiversity and novel chemicals.',
 desc:'Outer wedges: the nine planetary boundaries, coral where the 2023 assessment found them transgressed. Inner ring: the twelve social foundations, drawn without values (shortfalls vary by country). Press an outer wedge for its status.',
 research:['Raworth, K. (2017). Doughnut Economics: Seven Ways to Think Like a 21st-Century Economist. Random House.','Rockström, J. et al. (2009). A safe operating space for humanity. Nature 461, 472–475.','Richardson, K. et al. (2023). Earth beyond six of nine planetary boundaries. Science Advances 9, eadh2458.','O’Neill, D. W. et al. (2018). A good life for all within planetary boundaries. Nature Sustainability 1, 88–95.'],
 dur:10,hint:'Press each outer wedge. Which three are still inside the boundary?',
 init:()=>({pick:0}),
 watch(p){return {pick:Math.min(8,Math.floor(p*9))}},
 ui:[{choose:E8_CEIL.map((c,i)=>[String(i),c[0]]),label:'Boundary',get:s=>String(s.pick),act:'pick'}],
 on:{pick(s,v){s.pick=Number(v);return 'keep'}},
 draw(s,f,X){
  const cx=180,cy=200,r0=46,r1=78,r2=96,r3=130;
  const arc=(a0,a1,ra,rb)=>{const p=(r,a)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)],q=[p(rb,a0),p(rb,a1),p(ra,a1),p(ra,a0)],big=a1-a0>Math.PI?1:0;return `M${fmt(q[0][0])} ${fmt(q[0][1])}A${rb} ${rb} 0 ${big} 1 ${fmt(q[1][0])} ${fmt(q[1][1])}L${fmt(q[2][0])} ${fmt(q[2][1])}A${ra} ${ra} 0 ${big} 0 ${fmt(q[3][0])} ${fmt(q[3][1])}Z`};
  let out=heading('The doughnut: safe and just space',26);
  out+=Ci(cx,cy,r2,'#dcefe6','none')+Ci(cx,cy,r1,'#fff','none');
  E8_FLOOR.forEach((n,i)=>{const a0=-Math.PI/2+i*2*Math.PI/12+.02,a1=a0+2*Math.PI/12-.04;out+=P(arc(a0,a1,r0,r1-4),'#fff',1.4,'#cfe0ec')});
  E8_CEIL.forEach((c,i)=>{const a0=-Math.PI/2+i*2*Math.PI/9+.03,a1=a0+2*Math.PI/9-.06,over=c[1],sel=i===s.pick,outer=over?r3+(i%2?6:12):r3-12;
   out+=hit(X,'pick',i,`${c[0]}: ${over?'transgressed':'within the boundary'}. Press for details.`,P(arc(a0,a1,r2+4,outer),sel?C.ink:'#fff',sel?2.4:1.2,over?'#e48b6f':'#cfe7da'))});
  out+=TF(cx,cy-4,'social',12,C.muted)+TF(cx,cy+12,'foundation',12,C.muted);
  out+=TF(cx,40+12,'ecological ceiling',12,C.muted);
  const c=E8_CEIL[s.pick];
  out+=TBF(345,80,c[0],15,C.ink,'start')+TBF(345,102,c[1]?'Transgressed':'Within the boundary',14,c[1]?C.coral:C.green,'start')+E8_lines(345,126,E8_wrap(c[2].replace(/^Transgressed: /,''),28),C.ink,13,17);
  out+=E8_lines(345,214,E8_wrap('Inner ring: food, health, education, income, water, energy, networks, housing, gender equality, social equity, political voice, peace and justice.',30),C.muted,12,16);
  out+=TF(30,366,'Coral: transgressed (Richardson et al. 2023). Green band: the safe and just space.',12,C.muted,'start');
  return {svg:out,phase:`${c[0]}: ${c[2]} The doughnut is a way to frame goals; whether economies can meet the floor without breaking the ceiling is the open question (O’Neill et al. 2018 found no country yet does both).`};
 }});

// Income and emotional wellbeing: Kahneman & Deaton (2010) plateau; Killingsworth (2021) no plateau;
// adversarial collaboration (Killingsworth, Kahneman & Mellers 2023): plateau only for the unhappiest people.
SCENE({id:'measuring-wellbeing-income',name:'Is there a happiness plateau?',tag:'An adversarial collaboration',
 definition:'In 2010 Kahneman and Deaton reported that day-to-day emotional wellbeing in the US stopped rising above about $75,000 a year. In 2021 Killingsworth, sampling moments by phone, found no plateau. The two sides then reanalysed the data together and agreed: for most people happiness keeps rising with income, but for the least happy fifth it levels off around $100,000.',
 example:'An adversarial collaboration is a study designed jointly by researchers who disagree, agreeing in advance what result would settle the question.',
 desc:'Average emotional wellbeing against household income on a log scale, for people at different points of the happiness distribution. Choose the happiness percentile to draw; curves are stylised from the 2023 paper. Switch to see the 2010 summary line for comparison.',
 research:['Kahneman, D. & Deaton, A. (2010). High income improves evaluation of life but not emotional well-being. PNAS 107, 16489–16493.','Killingsworth, M. A. (2021). Experienced well-being rises with income, even above $75,000 per year. PNAS 118, e2016976118.','Killingsworth, M. A., Kahneman, D. & Mellers, B. (2023). Income and emotional well-being: a conflict resolved. PNAS 120, e2208661120.'],
 dur:10,hint:'Move the percentile from the happiest to the unhappiest. Where does the curve flatten?',
 init:()=>({pct:50,show2010:false}),
 watch(p){return {pct:Math.round(lerp(90,10,p)/5)*5,show2010:p>.7}},
 ui:[{range:'pct',label:'Happiness percentile',min:10,max:90,step:5,get:s=>s.pct,act:'pct',show:v=>v+'th'},{b:'Show or hide the 2010 summary',act:'toggle'}],
 on:{pct(s,v){s.pct=Number(v)},toggle(s){s.show2010=!s.show2010;return 'keep'}},
 draw(s){
  const lx=[Math.log(15000),Math.log(500000)],fn=(pct,x)=>{const base=(pct-50)/40*1.2,slope=.18;const plateau=pct<=20?Math.log(100000):1e9;return base+slope*(Math.min(x,plateau)-Math.log(15000))};
  let out=heading('Income and how people feel, day to day',26);
  const A=E8_plot(70,52,400,240,lx,[-1.5,1.6],{xt:[[Math.log(15000),'$15k'],[Math.log(50000),'$50k'],[Math.log(100000),'$100k'],[Math.log(250000),'$250k'],[Math.log(500000),'$500k']],yt:[[-1.5,'worse'],[0,'average'],[1.5,'better']],xl:'household income (log scale)',yl:'emotional wellbeing (stylised)'});out+=A.svg;
  [10,30,50,70,90].forEach(q=>{out+=P(E8_path(range(41).map(i=>{const x=lx[0]+i/40*(lx[1]-lx[0]);return [A.X(x),A.Y(fn(q,x))]})),C.grid,1.2)});
  out+=P(E8_path(range(41).map(i=>{const x=lx[0]+i/40*(lx[1]-lx[0]);return [A.X(x),A.Y(fn(s.pct,x))]})),s.pct<=20?C.coral:C.blue,3);
  if(s.show2010)out+=P(E8_path(range(41).map(i=>{const x=lx[0]+i/40*(lx[1]-lx[0]);return [A.X(x),A.Y(.05+.18*(Math.min(x,Math.log(75000))-Math.log(15000)))]})),C.amber,2,'none','stroke-dasharray="6 4"')+TF(A.X(Math.log(150000)),A.Y(.4)+18,'2010 summary: flat above $75k',12,C.amber,'middle');
  out+=L(A.X(Math.log(100000)),A.Y(-1.5),A.X(Math.log(100000)),A.Y(1.6),C.line,1,'stroke-dasharray="3 4"');
  out+=counter(486,60,'percentile',s.pct+'th',s.pct<=20?C.coral:C.blue,100);
  out+=E8_lines(486,134,E8_wrap(s.pct<=20?'Unhappiest fifth: levels off near $100k.':'Keeps rising with every doubling.',15),C.ink,13,17);
  out+=TF(70,346,'Stylised from Killingsworth, Kahneman & Mellers (2023); grey lines: other percentiles.',12,C.muted,'start');
  out+=TF(70,366,'Average effects: income is one influence among many.',12,C.muted,'start');
  return {svg:out,phase:s.pct<=20?`At the ${s.pct}th percentile the curve flattens above about $100,000: for the unhappiest people, more money stops helping with the troubles that remain. This is what the 2010 study picked up.`:`At the ${s.pct}th percentile emotional wellbeing keeps rising with each doubling of income, as Killingsworth (2021) found. Both earlier results were right about different people.`};
 }});
