/* ===================== Mind era 6 · Judgement and reasoning ===================== */
// Heuristics and biases, prospect theory, base rates, the selection task and dual-process accounts.
// Where it is short and harmless the learner is the participant; Watch shows a labelled simulated
// participant. Every picture is a pure function of state, frame and X; trial orders use seeded shuffles.
const D6_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const D6_rng=n=>rng(D6_mix(n));
function D6_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const D6_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const D6_pct=v=>(Math.round(v*1000)/10).toFixed(1).replace(/\.0$/,'')+'%';
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function D6_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-7,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// A pressable box (a button in Try it, plain in Watch).
function D6_btn(X,act,arg,label,x,y,w,h,text,o={}){
 const inner=R(x,y,w,h,o.fill||'#fff',o.stroke||C.line,10,o.sel?'stroke-width="3"':'stroke-width="1.5"')+(Array.isArray(text)?text.map((t,i)=>TF(x+w/2,y+h/2+5+(i-(text.length-1)/2)*18,t,o.size||14,o.ink||C.ink)).join(''):TF(x+w/2,y+h/2+5,text,o.size||15,o.ink||C.ink,'middle',o.bold?'font-weight="700"':''));
 return hit(X,act,arg,label,inner);
}
// Binomial probability mass, computed in log space so large n stays accurate.
function D6_lfact(n){let s=0;for(let i=2;i<=n;i++)s+=Math.log(i);return s}
function D6_binom(n,k,p){return Math.exp(D6_lfact(n)-D6_lfact(k)-D6_lfact(n-k)+k*Math.log(p)+(n-k)*Math.log(1-p))}
const D6_overShare=(n,share=.6)=>{let s=0;for(let k=0;k<=n;k++)if(k>share*n)s+=D6_binom(n,k,.5);return s};

/* ---------------------------------------------------------------- anchoring */
// Dates with fixed low and high anchors (the comparison question comes first, as in Jacowitz & Kahneman 1995).
const D6_ANCH=[
 {q:'was the telephone patented by Alexander Graham Bell',ans:1876,lo:1790,hi:1950},
 {q:'was the Magna Carta sealed',ans:1215,lo:1110,hi:1330},
 {q:'was Darwin’s On the Origin of Species published',ans:1859,lo:1770,hi:1930},
 {q:'was Newton’s Principia published',ans:1687,lo:1590,hi:1770},
 {q:'did the Wright brothers first fly a powered aeroplane',ans:1903,lo:1840,hi:1960},
 {q:'was Gutenberg’s Bible printed (to within a year or two)',ans:1455,lo:1340,hi:1570},
 {q:'did William Shakespeare die',ans:1616,lo:1520,hi:1700},
 {q:'did Albert Einstein first visit the United States',ans:1921,lo:1890,hi:1950}];
function D6_anchorOrder(seed){const idx=shuffled(range(8),D6_mix(seed)),hi=shuffled([0,0,0,0,1,1,1,1],D6_mix(seed+7));return idx.map((i,k)=>({i,high:!!hi[k]}))}
const D6_anchorOf=t=>{const it=D6_ANCH[t.i];return t.high?it.hi:it.lo};
// Anchoring index: slope (through the origin) of estimate error against anchor offset.
function D6_anchorSlope(res){let sxy=0,sxx=0;res.forEach(r=>{const a=D6_ANCH[r.i],dx=r.anchor-a.ans,dy=r.est-a.ans;sxy+=dx*dy;sxx+=dx*dx});return sxx?sxy/sxx:NaN}
function D6_anchorSim(seed,n){const o=D6_anchorOrder(seed),r=D6_rng(seed*31+5),res=[];for(let k=0;k<n;k++){const t=o[k],a=D6_ANCH[t.i],anc=D6_anchorOf(t);res.push({i:t.i,anchor:anc,est:Math.round(a.ans+.45*(anc-a.ans)+18*D6_gauss(r))})}return res}

SCENE({id:'anchoring',name:'Anchoring',tag:'Estimate eight dates',
 definition:'Anchoring is the pull of a number you have just considered on a later estimate, even when that number is arbitrary or obviously too high or too low.',
 example:'Asked first whether Einstein first visited the United States before or after 1939, people then guess later years than people first asked about 1905.',
 desc:'One estimation question at a time, each with a high or low comparison year, and a plot of your estimate errors against how far the anchor was from the truth, beside the typical anchoring slope.',
 research:'Tversky & Kahneman (1974). Judgment under uncertainty: heuristics and biases. Science 185. Jacowitz & Kahneman (1995), anchoring index ≈ 0.5; Strack & Mussweiler (1997). Replicated strongly in Many Labs 1 (Klein et al. 2014).',
 dur:12,hint:'Answer Earlier or Later, set your estimate with the slider, then Submit. Eight questions in a seeded order. Your answers stay in this page.',
 init:()=>({seed:6,t:0,stage:'cmp',cmp:null,est:1500,res:[]}),
 watch(p){const n=Math.min(8,Math.floor(p*9));return {seed:6,t:n,stage:'cmp',cmp:null,est:1500,res:D6_anchorSim(6,n),sim:true}},
 ui:[{b:'Earlier',act:'cmp',arg:'earlier'},{b:'Later',act:'cmp',arg:'later'},{range:'est',label:'Your estimate (year)',min:1000,max:2025,get:s=>s.est,act:'est'},{b:'Submit estimate',act:'submit'},{b:'Start again',act:'again'}],
 on:{cmp(s,v){if(s.t>=8)return 'keep';s.cmp=v;s.stage='est';return 'keep'},
  est(s,v){s.est=Number(v);return 'keep'},
  submit(s){if(s.t>=8||s.stage!=='est')return 'keep';const t=D6_anchorOrder(s.seed)[s.t];s.res.push({i:t.i,anchor:D6_anchorOf(t),est:s.est});s.t++;s.stage='cmp';s.cmp=null;s.est=1500;return 'keep'},
  again(s){s.seed=nextSeed();s.t=0;s.stage='cmp';s.cmp=null;s.est=1500;s.res=[]}},
 draw(s){
  let out=heading('Anchoring: estimate eight dates',26);
  if(s.t<8){const t=D6_anchorOrder(s.seed)[s.t],a=D6_ANCH[t.i],anc=D6_anchorOf(t);
   out+=R(20,40,560,76,C.pale,'none',10);
   out+=T(300,62,`Question ${s.t+1} of 8: in what year ${a.q}?`,15,C.ink);
   out+=TB(300,86,`Was it earlier or later than ${anc}?`,16,C.coral);
   out+=T(300,107,s.sim?'A simulated participant is answering.':s.stage==='cmp'?'Answer Earlier or Later first.':`You said ${s.cmp}. Now set your best estimate: ${s.est}`,14,C.muted);}
  else{out+=R(20,40,560,76,C.greenp,'none',10);out+=TB(300,72,'All eight answered',16,C.green);out+=T(300,98,'Each dot is one question. Press Start again for a new order.',14,C.ink)}
  const pl=D6_plot(170,138,260,160,[-160,160],[-160,160],{xt:[[-150,'−150'],[0,'0'],[150,'+150']],yt:[[-150,'−150'],[0,'0'],[150,'+150']],xl:'anchor minus true year',yl:'estimate minus true year'});
  out+=pl.svg+L(pl.X(0),138,pl.X(0),298,C.grid,1)+L(170,pl.Y(0),430,pl.Y(0),C.grid,1);
  out+=L(pl.X(-160),pl.Y(-80),pl.X(160),pl.Y(80),C.coral,2.2,'stroke-dasharray="7 5"');
  const k=D6_anchorSlope(s.res);
  if(s.res.length>=3&&isFinite(k)){const y=v=>clamp(v,-160,160);out+=L(pl.X(-160),pl.Y(y(-160*k)),pl.X(160),pl.Y(y(160*k)),C.blue,2.4)}
  s.res.forEach(r=>{const a=D6_ANCH[r.i];out+=Ci(pl.X(clamp(r.anchor-a.ans,-158,158)),pl.Y(clamp(r.est-a.ans,-158,158)),5.5,C.blue,'#fff')});
  out+=TF(30,180,'No anchoring:',13,C.muted,'start')+TF(30,197,'a flat line.',13,C.muted,'start');
  out+=TF(30,232,'Estimate =',13,C.muted,'start')+TF(30,249,'anchor: slope 1.',13,C.muted,'start');
  out+=TF(170,354,`blue = ${s.sim?'simulated participant':'you'}`,13,C.blue,'start')+TF(430,354,'coral = typical slope 0.5',13,C.coral,'end');
  out+=T(300,376,s.res.length>=3&&isFinite(k)?`${s.sim?'Simulated':'Your'} anchoring slope: ${k.toFixed(2)} (0 = no pull, 1 = copying the anchor)`:'The slope appears after three answers.',14,s.res.length>=3?C.ink:C.muted);
  return {svg:out,phase:'If the comparison year had no effect, the dots would scatter around the flat line. Most people drift towards the anchor: the dots tilt up to the right, typically about half-way (Jacowitz & Kahneman, 1995). The slider starts at 1500 on every question, which is itself a small anchor.'};
 }});

// Tversky & Kahneman's wheel (1974), reconstructed: estimates start at the anchor and adjust too little.
function D6_wheelGroup(anchor,adj,seed){const r=D6_rng(seed);return range(20).map(()=>{const belief=clamp(35+14*D6_gauss(r),2,90);return clamp(anchor+adj*(belief-anchor),0,100)})}
const D6_median=a=>{const b=a.slice().sort((x,y)=>x-y),n=b.length;return n?(n%2?b[(n-1)/2]:(b[n/2-1]+b[n/2])/2):NaN};
SCENE({id:'anchoring-wheel',name:'The rigged wheel',tag:'Anchoring and adjustment',
 definition:'In the anchoring-and-adjustment account, people start from the number in front of them and adjust towards what they believe, but stop too soon.',
 example:'A wheel of fortune rigged to stop at 10 or 65 shifted estimates of the percentage of African countries in the United Nations: median answers were 25 and 45.',
 desc:'A reconstruction of the 1974 wheel study: two simulated groups whose estimates start at the anchor (10 or 65) and move part of the way towards their beliefs, with their medians beside the published medians.',
 research:'Tversky & Kahneman (1974). Judgment under uncertainty: heuristics and biases. Science 185 (medians 25 and 45). Epley & Gilovich (2006) argue adjustment explains self-generated anchors best; for given anchors, selective accessibility (Strack & Mussweiler 1997) is a rival account.',
 dur:10,hint:'Change how far people adjust away from the anchor. At 100% the wheel would not matter; the published medians fit about 60%.',
 init:()=>({adj:60}),
 watch(p){return {adj:60,grow:Math.min(1,p/.6)}},
 ui:[{range:'adj',label:'Adjustment away from the anchor',min:0,max:100,step:5,get:s=>s.adj,act:'adj',show:v=>v+'%'}],
 on:{adj(s,v){s.adj=Number(v);return 'keep'}},
 draw(s){
  const g=s.grow===undefined?1:s.grow,adj=s.adj/100*g;let out=heading('After the wheel: what percentage of UN members are African?',26);
  const nx=v=>130+v*4.3;
  out+=L(nx(0),300,nx(100),300,C.line,2);[0,25,50,75,100].forEach(v=>out+=L(nx(v),296,nx(v),304,C.muted,1.5)+TF(nx(v),321,v+'%',13,C.muted));
  out+=TF(nx(50),342,'estimate of the percentage',13,C.muted);
  [[10,90,C.blue,11],[65,190,C.coral,12]].forEach(([anc,y,col,seed])=>{
   const est=D6_wheelGroup(anc,adj,seed),med=D6_median(est),pub=anc===10?25:45;
   out+=Ci(70,y+20,30,'#fff',col)+TBF(70,y+26,String(anc),17,col);
   out+=TF(70,y+68,'wheel',13,C.muted);
   out+=L(nx(0),y+20,nx(100),y+20,C.grid,1);
   out+=L(nx(anc),y-6,nx(anc),y+46,col,2,'stroke-dasharray="3 3"');
   est.forEach((v,i)=>out+=Ci(nx(v),y+8+(i%4)*8,4.2,col));
   out+=L(nx(med),y-10,nx(med),y+50,C.ink,2.5)+TF(nx(med)+6,y-12,`median ${Math.round(med)}`,13,C.ink,'start');
   out+=P(`M${fmt(nx(pub))} ${y+52} l-6 10 h12 z`,C.green,1.5,C.green)+TF(nx(pub),y+76,`published ${pub}`,13,C.green);
  });
  return {svg:out,phase:'Each dot is a simulated person whose private belief averages 35%. Starting at the wheel’s number and adjusting about 60% of the way reproduces the published medians of 25 and 45. Today 54 of the 193 UN members are African, about 28%.'};
 }});

const D6_REPL=[
 {n:'Anchoring (explicit comparison question)',st:'strong',who:'Tversky & Kahneman 1974; Jacowitz & Kahneman 1995',said:'Replicated strongly across the samples of Many Labs 1 (Klein et al. 2014), among the largest effects tested.'},
 {n:'Gain versus loss framing',st:'yes',who:'Tversky & Kahneman 1981',said:'Replicated in Many Labs 1, with a smaller effect than the original.'},
 {n:'Sunk costs',st:'yes',who:'Oppenheimer et al. 2009 version',said:'Replicated in Many Labs 1.'},
 {n:'Anchors from irrelevant numbers (ID digits)',st:'weak',who:'Ariely, Loewenstein & Prelec 2003',said:'Later replications found much weaker effects (Maniadis, Tufano & List 2014). Incidental anchors are less reliable than comparison questions.'},
 {n:'Flag priming',st:'no',who:'Carter, Ferguson & Hassin 2011',said:'Did not replicate in Many Labs 1.'},
 {n:'Currency priming',st:'no',who:'Caruso et al. 2013',said:'Did not replicate in Many Labs 1.'}];
const D6_ST={strong:['Replicated strongly',C.green,C.greenp],yes:['Replicated',C.green,C.greenp],weak:['Weaker on retest',C.amber,C.amberp],no:['Did not replicate',C.coral,C.coralp]};
SCENE({id:'anchoring-replication',name:'Does anchoring replicate?',tag:'Many Labs 1',
 definition:'A finding replicates when other researchers, following the same method with new participants, find the same effect. Large multi-lab projects test many effects at once.',
 example:'Many Labs 1 ran 13 classic effects in 36 samples; anchoring with a comparison question was among the strongest, while two priming effects failed.',
 desc:'A list of judgement effects coloured by what large replications found; pressing a row shows the original study and the replication result.',
 research:'Klein et al. (2014). Investigating variation in replicability: a “Many Labs” replication project. Social Psychology 45 (10 of 13 effects replicated). Maniadis, Tufano & List (2014), American Economic Review 104.',
 dur:10,hint:'Press a row to see what the original claimed and what the replication found.',
 init:()=>({sel:0}),
 watch(p){return {sel:Math.min(5,Math.floor(p*6))}},
 on:{sel(s,v){s.sel=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Which judgement effects held up?',26);
  D6_REPL.forEach((r,i)=>{const y=44+i*38,[lab,col,bg]=D6_ST[r.st],on=i===s.sel;
   const inner=R(30,y,540,32,on?bg:'#fff',on?col:C.grid,8,on?'stroke-width="2.5"':'')+TF(46,y+21,r.n,14,C.ink,'start')+R(410,y+6,150,20,bg,'none',10)+TBF(485,y+20,lab,13,col);
   out+=hit(X,'sel',i,`${r.n}: ${lab}`,inner)});
  const r=D6_REPL[s.sel];
  out+=R(30,280,540,90,C.pale,'none',10)+TBF(46,302,r.n,14,C.ink,'start')+TF(46,324,'Original: '+r.who,13,C.muted,'start');
  const words=r.said.split(' ');let line='',lines=[];words.forEach(w=>{if((line+' '+w).length>78){lines.push(line);line=w}else line=line?line+' '+w:w});lines.push(line);
  lines.slice(0,2).forEach((l,i)=>out+=TF(46,345+i*18,l,13,C.ink,'start'));
  return {svg:out,phase:'Anchoring with a comparison question is one of the most robust effects in judgement research. That is not true of every famous result: effects that depend on subtle, incidental cues have often shrunk or vanished when retested at scale.'};
 }});

/* ------------------------------------------------- availability and representativeness */
const D6_DEATHS=[
 {a:['Suicide','about 49,000'],b:['Homicide','about 24,000'],more:'a',vivid:'b'},
 {a:['Tornadoes','fewer than 100'],b:['Asthma','about 3,500'],more:'b',vivid:'a'},
 {a:['Lightning','about 20'],b:['Shark attacks','about 1'],more:'a',vivid:'b'},
 {a:['Fires','about 3,800'],b:['Falls','about 45,000'],more:'b',vivid:'a'},
 {a:['Diabetes','about 100,000'],b:['Car crashes','about 43,000'],more:'a',vivid:'b'},
 {a:['Plane crashes','a few hundred'],b:['Drowning','about 4,000'],more:'b',vivid:'a'}];
const D6_deathOrder=seed=>shuffled(range(6),D6_mix(seed+3));
SCENE({id:'availability-representativeness',name:'Availability',tag:'Which kills more people?',
 definition:'The availability heuristic judges how common something is by how easily examples come to mind. Vivid, dramatic and heavily reported events come to mind easily, so they are overestimated.',
 example:'Homicides make the news far more than suicides, yet in the United States suicides are about twice as common.',
 desc:'Six pairs of causes of death; you pick which kills more people a year in the United States, then see the approximate yearly figures, with the dramatic cause marked.',
 research:'Tversky & Kahneman (1973). Availability: a heuristic for judging frequency and probability. Cognitive Psychology 5. Lichtenstein, Slovic, Fischhoff, Layman & Combs (1978); Combs & Slovic (1979) on newspaper coverage. Figures: US, approximate, early 2020s (CDC; NOAA for weather).',
 dur:12,hint:'Press the cause you think kills more people each year in the United States. Six pairs; your answers stay in this page.',
 init:()=>({seed:4,picks:[]}),
 watch(p){const n=Math.min(6,Math.floor(p*7)),o=D6_deathOrder(4);return {seed:4,picks:o.slice(0,n).map((q,k)=>k%3===1?D6_DEATHS[q].more:D6_DEATHS[q].vivid),sim:true}},
 ui:[{b:'Start again',act:'again'}],
 on:{pick(s,v){if(s.picks.length<6)s.picks.push(v);return 'keep'},again(s){s.seed=nextSeed();s.picks=[]}},
 draw(s,f,X){
  const o=D6_deathOrder(s.seed),n=s.picks.length;let out=heading('Which kills more people each year in the United States?',26);
  if(n<6){const q=D6_DEATHS[o[n]];
   out+=TF(300,52,`Pair ${n+1} of 6${s.sim?' · simulated participant':''}`,13,C.muted);
   out+=D6_btn(X,'pick','a',q.a[0],70,62,200,56,q.a[0],{size:17,bold:true});
   out+=D6_btn(X,'pick','b',q.b[0],330,62,200,56,q.b[0],{size:17,bold:true});
   out+=TBF(300,96,'or',14,C.muted);}
  else{const right=s.picks.filter((p,k)=>p===D6_DEATHS[o[k]].more).length,viv=s.picks.filter((p,k)=>p===D6_DEATHS[o[k]].vivid).length;
   out+=R(40,62,520,56,C.greenp,'none',10)+TB(300,86,`${s.sim?'Simulated participant':'You'}: ${right} of 6 right`,16,C.green)+T(300,108,`${viv} of 6 picks were the more dramatic cause`,14,C.ink)}
  out+=TF(40,146,'pair',13,C.muted,'start')+TF(330,146,'deaths per year (approx.)',13,C.muted,'start');
  for(let k=0;k<n;k++){const q=D6_DEATHS[o[k]],y=170+k*30,pick=s.picks[k],ok=pick===q.more;
   [['a',q.a,40],['b',q.b,190]].forEach(([key,c,x])=>{const more=key===q.more,isPick=key===pick;
    if(isPick)out+=R(x-6,y-16,140,24,ok?C.greenp:C.coralp,'none',6);
    out+=TF(x,y,c[0]+(key===q.vivid?' *':''),14,more?C.ink:C.muted,'start',more?'font-weight="700"':'')});
   const big=q[q.more],small=q[q.more==='a'?'b':'a'];
   out+=TF(330,y,`${big[1]} vs ${small[1]}`,13,C.ink,'start')+TF(560,y,ok?'✓':'✗',15,ok?C.green:C.coral,'end')}
  if(n)out+=TF(40,362,'bold = the bigger killer · shaded = your pick · * = more dramatic, more often in the news',13,C.muted,'start');
  return {svg:out,phase:'Lichtenstein and colleagues (1978) found people overestimate rare, dramatic causes such as tornadoes and homicide and underestimate quiet, common ones such as asthma, diabetes and strokes. Newspaper coverage tracks the overestimates (Combs & Slovic, 1979): what is easy to recall feels frequent.'};
 }});

SCENE({id:'availability-representativeness-linda',name:'Linda the bank teller',tag:'The conjunction fallacy',
 definition:'The representativeness heuristic judges probability by resemblance to a stereotype. It can lead people to rate “A and B” as more likely than “A” alone, which can never be true: the conjunction fallacy.',
 example:'Given a description of Linda as a socially concerned philosophy graduate, 85% of people rated “bank teller and active feminist” as more probable than “bank teller”.',
 desc:'Linda’s description, a choice between the two statements, and an icon array of 100 women like Linda: feminist bank tellers are always a subset of all bank tellers.',
 research:'Tversky & Kahneman (1983). Extensional versus intuitive reasoning: the conjunction fallacy in probability judgment. Psychological Review 90. Frequency wording reduces the error (Fiedler 1988; Hertwig & Gigerenzer 1999).',
 dur:10,hint:'Choose which statement is more probable, then switch to the “out of 100” wording and change how many tellers are feminists.',
 init:()=>({fmt:'prob',pick:null,share:60}),
 watch(p){return {fmt:p<.5?'prob':'freq',pick:p<.3?null:'B',share:Math.round(20+70*smooth(p))}},
 ui:[{choose:[['prob','Probability wording'],['freq','Out of 100 wording']],label:'Wording',get:s=>s.fmt,act:'fmt'},{choose:[['A','A: bank teller'],['B','B: teller and feminist']],label:'More probable',get:s=>s.pick,act:'pick'},{range:'share',label:'Feminists among tellers',min:0,max:100,step:10,get:s=>s.share,act:'share',show:v=>v+'%'}],
 on:{fmt(s,v){s.fmt=v;return 'keep'},pick(s,v){s.pick=v;return 'keep'},share(s,v){s.share=Number(v);return 'keep'}},
 draw(s){
  let out=heading('Linda is 31, single, outspoken and very bright.',26);
  out+=T(300,50,'She studied philosophy, cared deeply about discrimination and social justice,',14,C.ink);
  out+=T(300,68,'and took part in anti-nuclear demonstrations.',14,C.ink);
  const q=s.fmt==='prob'?['Which is more probable?',['A: Linda is a bank teller.'],['B: Linda is a bank teller and is active','in the feminist movement.']]:['Of 100 women like Linda, how many are:',['A: bank tellers?'],['B: bank tellers and active in the','feminist movement?']];
  out+=TBF(30,98,q[0],14,C.ink,'start');
  [['A',q[1],120],['B',q[2],144]].forEach(([k,t,y])=>{if(s.pick===k)out+=R(24,y-16,330,t.length*18+4,C.amberp,'none',6);t.forEach((l,i)=>out+=TF(30+(i?18:0),y+i*18,l,13,C.ink,'start'))});
  const tell=10,fem=Math.round(tell*s.share/100);
  for(let i=0;i<100;i++){const c=i%10,r=Math.floor(i/10),x=390+c*18,y=92+r*18,col=i<fem?C.coral:i<tell?C.blue:C.grid;out+=R(x,y,14,14,col,'none',3)}
  out+=TF(480,290,'100 women like Linda',13,C.muted);
  out+=R(30,184,12,12,C.blue,'none',3)+TF(48,195,`bank tellers: ${tell} (A)`,13,C.ink,'start');
  out+=R(30,206,12,12,C.coral,'none',3)+TF(48,217,`tellers who are feminists: ${fem} (B)`,13,C.ink,'start');
  out+=TF(30,248,'However well the description fits B, every B case',13,C.ink,'start')+TF(30,266,'is also an A case, so B can never be more probable.',13,C.ink,'start');
  out+=T(300,330,s.pick==='B'?'You chose B, like 85% of the original participants: a conjunction error.':s.pick==='A'?'A is right: “teller and feminist” can never be likelier than “teller”.':'Choose A or B.',15,s.pick==='B'?C.coral:s.pick==='A'?C.green:C.muted);
  out+=T(300,356,s.fmt==='freq'?'Asked “how many out of 100?”, far fewer people make the error.':'Tversky & Kahneman (1983): 85% chose B.',14,C.ink);
  return {svg:out,phase:'Linda resembles a feminist much more than a bank teller, so B feels more probable. But the probability of two things together can never exceed the probability of either alone. Gigerenzer and others argue “probable” is read conversationally; counting cases out of 100 makes the set relation visible.'};
 }});

SCENE({id:'availability-representativeness-hospital',name:'The two hospitals',tag:'The law of small numbers',
 definition:'People expect small samples to look like the population they come from. In fact, small samples vary much more, so extreme results are more common in them.',
 example:'A hospital with 15 births a day has more days with over 60% boys than a hospital with 45, about 15% of days against about 7%.',
 desc:'A bar chart of how often each share of boys occurs in a day of births, for the chosen number of births, with days above 60% boys shaded, and counters for 15 and 45 births.',
 research:'Tversky & Kahneman (1974). Judgment under uncertainty: heuristics and biases. Science 185 (the hospital problem; about half answered “about the same”). Tversky & Kahneman (1971), belief in the law of small numbers, Psychological Bulletin 76.',
 dur:10,hint:'First pick an answer, then move the slider to see how the number of births a day changes how often a day is more than 60% boys.',
 init:()=>({n:15,pick:null}),
 watch(p){return {n:Math.round(5+95*smooth(p)),pick:null,sim:true}},
 ui:[{choose:[['large','The larger (45 a day)'],['small','The smaller (15 a day)'],['same','About the same']],label:'More days over 60% boys',get:s=>s.pick,act:'pick'},{range:'n',label:'Births a day',min:5,max:100,get:s=>s.n,act:'n'}],
 on:{pick(s,v){s.pick=v;return 'keep'},n(s,v){s.n=Number(v);return 'keep'}},
 draw(s){
  let out=heading('Which hospital records more days with over 60% boys?',26);
  const n=s.n,pl=D6_plot(70,60,330,200,[0,1],[0,1],{xt:[[0,'0%'],[.6,'60%'],[1,'100%']],xl:'share of babies who are boys, in one day (centre: 50%)',yl:'how often'});
  out+=pl.svg;let pk=[];for(let k=0;k<=n;k++)pk.push(D6_binom(n,k,.5));const mx=Math.max(...pk),bw=Math.max(1.5,330/(n+1)-1.5);
  pk.forEach((v,k)=>{const x=pl.X(k/n),h=v/mx*188;out+=R(x-bw/2,260-h,bw,h,k>.6*n?C.coral:C.blue,'none',1)});
  out+=L(pl.X(.6),60,pl.X(.6),260,C.coral,1.5,'stroke-dasharray="4 4"');
  const pn=D6_overShare(n);
  out+=counter(430,70,`${n} births a day`,D6_pct(pn),C.coral,140);
  out+=counter(430,140,'15 births a day',D6_pct(D6_overShare(15)),C.ink,140);
  out+=counter(430,200,'45 births a day',D6_pct(D6_overShare(45)),C.ink,140);
  out+=TF(500,268,'days over 60% boys',13,C.muted);
  out+=T(300,334,s.pick===null?(s.sim?'Watch the shaded tail shrink as the number of births grows.':'Pick an answer first.'):s.pick==='small'?'Right: the smaller hospital, about twice as many such days.':'The smaller hospital has about twice as many such days.',15,s.pick==='small'?C.green:s.pick?C.coral:C.muted);
  out+=T(300,358,'Coral bars: days with more than 60% boys. Small samples spread wider.',14,C.ink);
  return {svg:out,phase:'Each birth is close to a coin toss. With 15 births a day, 10 or more boys happens on about 15% of days; with 45 births, 28 or more happens on about 7%. In the original study about half the participants said “about the same”: they expected small samples to be as representative as large ones.'};
 }});

/* ---------------------------------------------------------------- loss aversion */
const D6_GAINS=[5,8,10,12,15,18,20,25,30,40];
const D6_gambleOrder=seed=>shuffled(D6_GAINS,D6_mix(seed+11));
// Threshold estimate: the break-even win that best separates accepted from rejected bets (fewest
// choices on the wrong side; ties averaged), so one noisy choice does not decide the result.
function D6_lambda(res){const gs=D6_GAINS.slice().sort((a,b)=>a-b),cands=[gs[0]-1].concat(gs.slice(1).map((g,i)=>(g+gs[i])/2),[gs[gs.length-1]+1]);
 const err=t=>res.filter(r=>r.ok?r.g<t:r.g>t).length,best=Math.min(...cands.map(err)),tied=cands.filter(t=>err(t)===best),t=sum(tied)/tied.length;
 return {lam:t/10,tag:t<gs[0]?'below':t>gs[gs.length-1]?'above':'est',incons:best>0}}
SCENE({id:'loss-aversion',name:'Loss aversion',tag:'Would you take the bet?',
 definition:'Loss aversion is the tendency for a loss to weigh more than a gain of the same size. Many people refuse a 50–50 bet to lose £10 unless the possible win is about £20.',
 example:'A coin toss: heads you win £15, tails you lose £10. Its average is +£2.50, yet most people turn it down.',
 desc:'Ten 50–50 bets, each risking £10 against a different possible win; your accept and reject choices on a line of win sizes, with your break-even ratio beside the typical value of about 2.',
 research:'Kahneman & Tversky (1979). Prospect theory. Econometrica 47. Tversky & Kahneman (1992), λ ≈ 2.25. Size debated: Walasek & Stewart (2015) show it depends on the range of bets offered; Gal & Rucker (2018); Brown, Imai, Vieider & Camerer (2024) meta-analysis, typical λ near 2.',
 dur:12,hint:'Accept or reject each imaginary bet. Nothing is paid; your answers stay in this page.',
 init:()=>({seed:9,res:[]}),
 watch(p){const n=Math.min(10,Math.floor(p*11)),o=D6_gambleOrder(9);return {seed:9,res:o.slice(0,n).map(g=>({g,ok:g>21})),sim:true}},
 ui:[{b:'Accept the bet',act:'ans',arg:'yes'},{b:'Reject the bet',act:'ans',arg:'no'},{b:'Start again',act:'again'}],
 on:{ans(s,v){const o=D6_gambleOrder(s.seed);if(s.res.length<10)s.res.push({g:o[s.res.length],ok:v==='yes'});return 'keep'},again(s){s.seed=nextSeed();s.res=[]}},
 draw(s){
  const o=D6_gambleOrder(s.seed),n=s.res.length;let out=heading('A fair coin is tossed. Do you accept this bet?',26);
  if(n<10){const g=o[n];out+=R(110,44,380,70,C.pale,'none',12);
   out+=TBF(200,74,`Heads: win £${g}`,18,C.green)+TBF(400,74,'Tails: lose £10',18,C.coral);
   out+=TF(300,102,`Bet ${n+1} of 10 · average outcome ${g>=10?'+':'−'}£${Math.abs((g-10)/2).toFixed(2)}${s.sim?' · simulated participant':''}`,13,C.muted)}
  else out+=R(110,44,380,70,C.greenp,'none',12)+TB(300,84,'All ten answered',17,C.green);
  const pl=D6_plot(70,150,460,110,[0,45],[0,1],{xt:[[5,'£5'],[10,'£10'],[20,'£20'],[30,'£30'],[40,'£40']],xl:'possible win (the possible loss is always £10)'});
  out+=pl.svg+TF(64,180,'accept',13,C.green,'end')+TF(64,234,'reject',13,C.coral,'end');
  out+=L(pl.X(10),150,pl.X(10),260,C.grid,1.5)+TF(pl.X(10)+4,166,'fair',13,C.muted,'start');
  out+=L(pl.X(22.5),150,pl.X(22.5),260,C.coral,2,'stroke-dasharray="6 4"');
  s.res.forEach(r=>out+=Ci(pl.X(r.g),r.ok?176:230,7,r.ok?C.green:C.coral,'#fff'));
  const e=D6_lambda(s.res);let line;
  if(n<3)line='Your break-even ratio appears after three bets.';
  else if(e.tag==='above')line='You rejected every bet so far: your loss weight is above 4.';
  else if(e.tag==='below')line='You accepted every bet so far: no sign of loss aversion.';
  else{line=`${s.sim?'Simulated':'Your'} loss weight λ ≈ ${e.lam.toFixed(1)}: a loss counts about ${e.lam.toFixed(1)}× a gain`;out+=L(pl.X(e.lam*10),150,pl.X(e.lam*10),260,C.blue,2.5)}
  out+=T(300,322,line,15,C.ink);
  out+=TF(70,350,`blue line = ${s.sim?'simulated participant':'you'}`,13,C.blue,'start')+TF(530,350,'coral line = λ 2.25 (Tversky & Kahneman 1992)',13,C.coral,'end');
  if(e.incons)out+=T(300,372,'Some choices fall on the other side of your break-even point: choices are noisy.',13,C.amber);
  return {svg:out,phase:'If gains and losses counted equally, every bet to the right of “fair” would be worth taking. Most people need the win to be about twice the loss. How big λ is depends on the bets offered: with a range of wins from £5 to £40, a threshold near the middle is also what the range itself suggests.'};
 }});

const D6_v=(x,a,lam)=>x>=0?Math.pow(x,a):-lam*Math.pow(-x,a);
SCENE({id:'loss-aversion-value',name:'The value function',tag:'Prospect theory',
 definition:'Prospect theory describes choices with a value function over gains and losses from a reference point: concave for gains, convex for losses, and steeper for losses.',
 example:'With the 1992 estimates, winning £50 is worth about 31 units of value and losing £50 about −71.',
 desc:'The prospect-theory value curve from −£100 to +£100, with sliders for curvature and loss aversion, and markers for a £50 gain and a £50 loss.',
 research:'Kahneman & Tversky (1979). Prospect theory: an analysis of decision under risk. Econometrica 47. Tversky & Kahneman (1992). Advances in prospect theory, J. Risk and Uncertainty 5 (α ≈ 0.88, λ ≈ 2.25).',
 dur:9,hint:'Change the curvature and the loss weight. At λ = 1 and curvature 1 the curve is a straight line: money counts at face value.',
 init:()=>({a:.88,lam:2.25}),
 watch(p){return {a:.88,lam:+(1+1.25*smooth(p*1.4)).toFixed(2)}},
 ui:[{range:'a',label:'Curvature α',min:.4,max:1,step:.02,get:s=>s.a,act:'a',show:v=>Number(v).toFixed(2)},{range:'lam',label:'Loss weight λ',min:1,max:3,step:.05,get:s=>s.lam,act:'lam',show:v=>Number(v).toFixed(2)}],
 on:{a(s,v){s.a=Number(v);return 'keep'},lam(s,v){s.lam=Number(v);return 'keep'}},
 draw(s){
  let out=heading('How much is a gain or a loss worth?',26);
  const pl=D6_plot(80,50,340,250,[-100,100],[-300,110],{xt:[[-100,'−£100'],[-50,'−£50'],[0,'0'],[50,'+£50'],[100,'+£100']],yt:[[100,'100'],[0,'0'],[-100,'−100'],[-200,'−200'],[-300,'−300']],xl:'change in money from where you are now',yl:'felt value'});
  out+=pl.svg+L(pl.X(0),50,pl.X(0),300,C.grid,1.5)+L(80,pl.Y(0),420,pl.Y(0),C.grid,1.5);
  out+=D6_poly([[pl.X(-100),pl.Y(-100)],[pl.X(100),pl.Y(100)]],C.line,1.5,'stroke-dasharray="4 4"');
  const pts=range(81).map(i=>{const x=-100+i*2.5;return [pl.X(x),pl.Y(clamp(D6_v(x,s.a,s.lam),-300,110))]});out+=D6_poly(pts,C.blue,3);
  const g=D6_v(50,s.a,s.lam),l=D6_v(-50,s.a,s.lam);
  out+=Ci(pl.X(50),pl.Y(g),6,C.green)+Ci(pl.X(-50),pl.Y(Math.max(l,-300)),6,C.coral);
  out+=counter(445,60,'value of +£50',g.toFixed(0),C.green,130)+counter(445,120,'value of −£50',l.toFixed(0),C.coral,130);
  out+=counter(445,180,'50–50 bet ±£50',(.5*g+.5*l).toFixed(0),.5*g+.5*l<0?C.coral:C.green,130);
  out+=TF(510,248,'dashed = money at',13,C.muted)+TF(510,264,'face value',13,C.muted);
  out+=T(300,366,`A £50 loss feels ${(-l/g).toFixed(1)} times as strong as a £50 gain`,15,C.ink);
  return {svg:out,phase:'Three ideas in one curve: value depends on change from a reference point, not on total wealth; each extra pound matters less the further you are from the reference point; and losses loom larger than gains. With λ above 1, an even 50–50 bet has negative felt value, so it is refused.'};
 }});

SCENE({id:'loss-aversion-framing',name:'Framing',tag:'The Asian disease problem',
 definition:'A framing effect is a change in choice caused by describing the same outcomes differently, for example as lives saved or as lives lost.',
 example:'Described as “200 will be saved”, the sure option was chosen by 72%. Described as “400 will die”, the same option was chosen by 22%.',
 desc:'The 1981 problem in either wording, two options to choose between, an icon array of 600 people showing that the outcomes are identical, and the published choice shares.',
 research:'Tversky & Kahneman (1981). The framing of decisions and the psychology of choice. Science 211 (72% and 22% chose the sure option). Replicated in Many Labs 1 (Klein et al. 2014), with a smaller effect.',
 dur:10,hint:'Choose a wording, pick an option, then switch the wording and compare.',
 init:()=>({frame:'gain',pick:null}),
 watch(p){return {frame:p<.5?'gain':'loss',pick:null}},
 ui:[{choose:[['gain','Lives saved'],['loss','Lives lost']],label:'Wording',get:s=>s.frame,act:'frame'}],
 on:{frame(s,v){s.frame=v;s.pick=null;return 'keep'},pick(s,v){s.pick=v;return 'keep'}},
 draw(s,f,X){
  const gain=s.frame==='gain';let out=heading('An unusual disease is expected to kill 600 people.',26);
  out+=T(300,48,'Two programmes are proposed. Which do you favour?',14,C.ink);
  const A=gain?['Programme A:','200 people will be saved.']:['Programme C:','400 people will die.'];
  const B=gain?['Programme B: a 1 in 3 chance','all 600 are saved, 2 in 3 none']:['Programme D: a 1 in 3 chance','nobody dies, 2 in 3 all 600 die'];
  out+=D6_btn(X,'pick','sure',A.join(' '),30,62,260,58,A,{sel:s.pick==='sure',stroke:s.pick==='sure'?C.blue:C.line});
  out+=D6_btn(X,'pick','risky',B.join(' '),310,62,260,58,B,{sel:s.pick==='risky',stroke:s.pick==='risky'?C.blue:C.line});
  // 60 icons of 10 people each.
  const icons=(x0,y0,saved,c=16,sz=12)=>range(60).map(i=>R(x0+(i%15)*c,y0+Math.floor(i/15)*c,sz,sz,i<saved?C.green:C.grid,'none',2)).join('');
  out+=icons(40,136,20)+TF(160,228,'sure: 200 live, 400 die',13,C.ink);
  out+=TF(400,146,'1 in 3:',13,C.ink,'end')+icons(408,134,60,10,8)+TF(400,188,'2 in 3:',13,C.ink,'end')+icons(408,176,0,10,8);
  out+=TF(450,228,'gamble: all live or all die',13,C.ink);
  out+=TF(300,246,'Each square is 10 people. The sure options A and C are the same outcome.',13,C.muted);
  const pub=gain?72:22;
  out+=TF(40,268,'Published choice of the sure option:',13,C.ink,'start');
  [['lives saved',72,286],['lives lost',22,312]].forEach(([lab,v,y])=>{out+=TF(40,y+11,lab,13,C.muted,'start')+R(140,y,v*3.6,16,lab.includes(gain?'saved':'lost')?C.blue:C.line,'none',3)+TF(146+v*3.6,y+13,v+'%',13,C.ink,'start')});
  out+=T(300,360,s.pick===null?'Pick a programme.':s.pick==='sure'?(gain?'You chose the sure option, like 72% of people with this wording.':'You chose the sure option, like only 22% with this wording.'):(gain?'You chose the gamble, like 28% with this wording.':'You chose the gamble, like 78% with this wording.'),15,C.ink);
  return {svg:out,phase:`The two wordings describe exactly the same outcomes. Framed as gains, most people avoid risk; framed as losses, most people take the gamble to avoid a sure loss, as the value function predicts. Here ${pub}% chose the sure option in this wording.`};
 }});

/* ---------------------------------------------------------------- base rates */
// Natural-frequency grid of 1000 people, drawn as merged runs per row plus one separator path.
function D6_grid1000(x0,y0,cats){const cols=40,rows=25,c=8;let out='',seq=[];cats.forEach(k=>{for(let i=0;i<k.n;i++)seq.push(k.col)});while(seq.length<1000)seq.push(C.grid);
 for(let r=0;r<rows;r++){let st=0;for(let cI=1;cI<=cols;cI++){if(cI===cols||seq[r*cols+cI]!==seq[r*cols+st]){out+=R(x0+st*c,y0+r*c,(cI-st)*c,c,seq[r*cols+st],'none',0);st=cI}}}
 let d='';for(let i=1;i<cols;i++)d+=`M${x0+i*c} ${y0}v${rows*c}`;for(let i=1;i<rows;i++)d+=`M${x0} ${y0+i*c}h${cols*c}`;
 return out+P(d,'#fff',1.2)}
function D6_bayes(prev,sens,fp){const p=prev/100,s=sens/100,f=fp/100;return p*s/(p*s+(1-p)*f)}
SCENE({id:'base-rates',name:'Base rates',tag:'A positive test',
 definition:'Base-rate neglect is ignoring how common something is to begin with. When a condition is rare, most positive results from a good test can still be false alarms.',
 example:'With 1% prevalence, 80% sensitivity and a 9.6% false-positive rate, only about 8% of people who test positive are ill. Most people, including many doctors, guess about 75–80%.',
 desc:'A grid of 1,000 people coloured by whether they are ill and whether they test positive, with sliders for prevalence, sensitivity and false-positive rate, and the share of positives who are really ill.',
 research:'Eddy (1982), in Kahneman, Slovic & Tversky (eds), Judgment under Uncertainty. Gigerenzer & Hoffrage (1995). How to improve Bayesian reasoning without instruction: frequency formats. Psychological Review 102 (16% correct with probabilities, 46% with natural frequencies).',
 dur:12,hint:'Guess first, then reveal the counts by watching or by changing the sliders. Try a rarer disease and a better test.',
 init:()=>({prev:1,sens:80,fp:9.6,guess:null,stage:3}),
 watch(p){return {prev:1,sens:80,fp:9.6,guess:null,stage:p<.3?1:p<.6?2:3}},
 ui:[{choose:[['90','About 90%'],['50','About 50%'],['10','About 10%']],label:'Your guess',get:s=>s.guess,act:'guess'},{range:'prev',label:'Prevalence',min:.1,max:10,step:.1,get:s=>s.prev,act:'prev',show:v=>Number(v).toFixed(1)+'%'},{range:'sens',label:'Sensitivity',min:50,max:100,get:s=>s.sens,act:'sens',show:v=>v+'%'},{range:'fp',label:'False positives',min:0,max:20,step:.2,get:s=>s.fp,act:'fp',show:v=>Number(v).toFixed(1)+'%'}],
 on:{guess(s,v){s.guess=v;return 'keep'},prev(s,v){s.prev=Number(v);return 'keep'},sens(s,v){s.sens=Number(v);return 'keep'},fp(s,v){s.fp=Number(v);return 'keep'}},
 draw(s){
  const ill=Math.round(s.prev*10),tp=Math.round(ill*s.sens/100),fn=ill-tp,well=1000-ill,fpN=Math.round(well*s.fp/100),post=tp+fpN?tp/(tp+fpN):0;
  let out=heading('You test positive. How likely is it that you are ill?',26);
  const st=s.stage;
  const cats=st===1?[{n:ill,col:C.coral}]:[{n:tp,col:C.coral},{n:fn,col:C.coralp},{n:fpN,col:C.amber}];
  out+=D6_grid1000(30,46,cats);
  out+=TF(190,264,'1,000 people',13,C.muted);
  const rows=[[C.coral,`ill and test positive: ${tp}`],[C.coralp,`ill but test negative: ${fn}`],[C.amber,`well but test positive: ${fpN}`],[C.grid,`well and test negative: ${well-fpN}`]];
  if(st===1){out+=R(370,56,12,12,C.coral,'none',2)+TF(388,67,`ill: ${ill}`,13,C.ink,'start')+R(370,80,12,12,C.grid,'none',2)+TF(388,91,`well: ${well}`,13,C.ink,'start')}
  else rows.forEach(([c,t],i)=>{out+=R(370,56+i*24,12,12,c,'none',2)+TF(388,67+i*24,t,13,C.ink,'start')});
  if(st>=3){out+=R(366,166,214,94,C.pale,'none',10)+TF(376,188,`Positive tests: ${tp} + ${fpN} = ${tp+fpN}`,13,C.ink,'start')+TF(376,210,`Really ill: ${tp} of ${tp+fpN}`,13,C.ink,'start')+TBF(376,244,D6_pct(post),24,C.coral,'start')+TF(470,244,'chance ill',13,C.muted,'start')}
  out+=T(300,300,s.guess===null?'Make a guess with the buttons first.':`Your guess: about ${s.guess}%. ${st>=3?(Math.abs(Number(s.guess)/100-post)<.06?'Close.':'The answer is '+D6_pct(post)+'.'):''}`,15,s.guess===null?C.muted:C.ink);
  out+=T(300,328,'Counting people (“natural frequencies”) makes the answer visible:',14,C.ink);
  out+=T(300,350,'in Gigerenzer & Hoffrage (1995), correct answers rose from 16% to 46%.',14,C.ink);
  return {svg:out,phase:'The ill people are rare, so even a good test finds only a handful of them, while a small false-positive rate applied to 990 well people produces many more positives. Counting out of 1,000 rather than combining percentages is how many people, doctors included, get it right.'};
 }});

SCENE({id:'base-rates-cabs',name:'The cab problem',tag:'A witness and a base rate',
 definition:'In the cab problem the base rate (how many cabs are blue) and the witness’s reliability must be combined. People tend to answer with the reliability alone.',
 example:'85% of cabs are green and 15% blue. A witness who is right 80% of the time says the cab was blue. The chance it really was blue is about 41%, not 80%.',
 desc:'A tree of 100 cabs split by colour and by what the witness says, with sliders for the share of blue cabs and the witness’s accuracy, and the chance that a cab called blue is blue.',
 research:'Tversky & Kahneman (1982). Evidential impact of base rates. In Kahneman, Slovic & Tversky (eds), Judgment under Uncertainty (median answer 80%). Bar-Hillel (1980). The base-rate fallacy in probability judgments. Acta Psychologica 44.',
 dur:10,hint:'Change the share of blue cabs and the witness’s accuracy. When are “blue” reports usually right?',
 init:()=>({blue:15,acc:80}),
 watch(p){return {blue:Math.round(15+35*smooth(p)),acc:80}},
 ui:[{range:'blue',label:'Blue cabs',min:1,max:50,get:s=>s.blue,act:'blue',show:v=>v+'%'},{range:'acc',label:'Witness accuracy',min:50,max:99,get:s=>s.acc,act:'acc',show:v=>v+'%'}],
 on:{blue(s,v){s.blue=Number(v);return 'keep'},acc(s,v){s.acc=Number(v);return 'keep'}},
 draw(s){
  const b=s.blue,g=100-b,a=s.acc/100,bb=b*a,gb=g*(1-a),post=bb/(bb+gb);
  let out=heading('A witness says the cab was blue. Was it?',26);
  out+=box(250,46,100,36,'100 cabs',C.pale,C.ink,15);
  out+=L(280,82,150,118,C.line,2)+L(320,82,450,118,C.line,2);
  out+=box(90,118,120,36,`${b} blue`,'#dbe8f7',C.blue,15)+box(390,118,120,36,`${g} green`,C.greenp,C.green,15);
  out+=L(130,154,80,196,C.line,2)+L(170,154,220,196,C.line,2)+L(430,154,380,196,C.line,2)+L(470,154,520,196,C.line,2);
  out+=TF(92,180,`${s.acc}%`,13,C.muted,'end')+TF(208,180,`${100-s.acc}%`,13,C.muted,'start')+TF(392,180,`${100-s.acc}%`,13,C.muted,'end')+TF(508,180,`${s.acc}%`,13,C.muted,'start');
  out+=box(30,196,110,48,'',C.amberp,C.ink,14,C.amber)+TF(85,216,'says “blue”',13,C.ink)+TBF(85,236,fmt(bb),15,C.ink);
  out+=box(160,196,110,48,'',C.paper,C.ink,14,C.grid)+TF(215,216,'says “green”',13,C.muted)+TBF(215,236,fmt(b-bb),15,C.muted);
  out+=box(330,196,110,48,'',C.amberp,C.ink,14,C.amber)+TF(385,216,'says “blue”',13,C.ink)+TBF(385,236,fmt(gb),15,C.ink);
  out+=box(460,196,110,48,'',C.paper,C.ink,14,C.grid)+TF(515,216,'says “green”',13,C.muted)+TBF(515,236,fmt(g-gb),15,C.muted);
  out+=T(300,280,`“Blue” reports: ${fmt(bb)} from blue cabs + ${fmt(gb)} from green cabs`,15,C.ink);
  out+=TB(300,312,`Chance the cab really was blue: ${D6_pct(post)}`,18,C.coral);
  out+=T(300,344,`The usual answer is the witness’s accuracy, ${s.acc}%: the base rate is ignored.`,14,C.muted);
  return {svg:out,phase:'Green cabs are so common that the witness’s 20% mistakes about them outnumber the correct reports of the few blue cabs. Tversky and Kahneman found people use base rates far more when they are causal, for example “85% of accidents involve green cabs”, than when they are bare statistics.'};
 }});

SCENE({id:'base-rates-bayes',name:'Bayes as areas',tag:'Prior × likelihood',
 definition:'Bayes’ rule updates a prior probability with evidence: the chance of a hypothesis after the evidence is the share of all the ways to get that evidence that come from the hypothesis.',
 example:'Prior 30%, evidence seen 80% of the time if true and 20% if false: posterior = 0.24 ÷ (0.24 + 0.14) ≈ 63%.',
 desc:'A unit square split into a hypothesis column of width equal to the prior and an alternative column; each column’s shaded part is the chance of seeing the evidence; the posterior is the hypothesis’s share of the shaded area.',
 research:'Bayes (1763). An essay towards solving a problem in the doctrine of chances. Gigerenzer & Hoffrage (1995) on frequency formats; Edwards (1968) found people update too little (conservatism) when shown evidence step by step.',
 dur:10,hint:'Change the prior and the two likelihoods. The posterior is the coral area’s share of all shaded area.',
 init:()=>({prior:30,hit:80,fa:20}),
 watch(p){return {prior:Math.round(5+60*smooth(p)),hit:80,fa:20}},
 ui:[{range:'prior',label:'Prior',min:1,max:99,get:s=>s.prior,act:'prior',show:v=>v+'%'},{range:'hit',label:'Evidence if true',min:1,max:100,get:s=>s.hit,act:'hit',show:v=>v+'%'},{range:'fa',label:'Evidence if false',min:1,max:100,get:s=>s.fa,act:'fa',show:v=>v+'%'}],
 on:{prior(s,v){s.prior=Number(v);return 'keep'},hit(s,v){s.hit=Number(v);return 'keep'},fa(s,v){s.fa=Number(v);return 'keep'}},
 draw(s){
  const p=s.prior/100,h=s.hit/100,f=s.fa/100,num=p*h,den=num+(1-p)*f,post=num/den;
  let out=heading('Updating a belief with evidence',26);
  const x0=50,y0=50,W=300,H=260,wx=W*p;
  out+=R(x0,y0,wx,H,C.pale,'none',0)+R(x0+wx,y0,W-wx,H,'#f1f5f7','none',0);
  out+=R(x0,y0+H*(1-h),wx,H*h,C.coral,'none',0)+R(x0+wx,y0+H*(1-f),W-wx,H*f,C.amber,'none',0);
  out+=R(x0,y0,W,H,'none',C.ink,0,'stroke-width="1.5"')+L(x0+wx,y0,x0+wx,y0+H,C.ink,1.5);
  out+=TF(x0+wx/2,y0+H+18,'true',13,C.ink)+TF(x0+wx+(W-wx)/2,y0+H+18,'false',13,C.ink);
  out+=TF(x0+W/2,y0+H+36,`prior: ${s.prior}% of the width is “true”`,13,C.muted);
  out+=R(380,56,12,12,C.coral,'none',2)+TF(398,67,`true and evidence: ${fmt(num*100)}%`,13,C.ink,'start');
  out+=R(380,80,12,12,C.amber,'none',2)+TF(398,91,`false and evidence: ${fmt((1-p)*f*100)}%`,13,C.ink,'start');
  out+=TF(380,128,'posterior = coral ÷ (coral + amber)',13,C.ink,'start');
  out+=TBF(380,166,D6_pct(post),28,C.coral,'start');
  const lr=h/f,po=p/(1-p);
  out+=TF(380,204,'In odds: prior odds ×',13,C.muted,'start')+TF(380,221,'likelihood ratio',13,C.muted,'start');
  out+=TF(380,244,`${fmt(po)} × ${fmt(lr)} = ${fmt(po*lr)}`,14,C.ink,'start');
  return {svg:out,phase:'The prior sets the width of each column, and the likelihoods set how much of each column the evidence covers. Strong evidence (a big likelihood ratio) can still leave a low posterior if the prior was very low. Base-rate neglect is reading the coral column’s height and ignoring its width.'};
 }});

/* ---------------------------------------------------------------- the selection task */
function D6_cards(X,faces,sel,correct,reveal,act){let out='';
 faces.forEach((f,i)=>{const x=60+i*125,y=96,on=sel[i],ok=correct[i];
  const stroke=reveal?(ok?C.green:on?C.coral:C.line):on?C.blue:C.line;
  const inner=R(x,y,100,130,on?C.pale:'#fff',stroke,12,`stroke-width="${on||reveal&&ok?3.5:1.5}"`)+TBF(x+50,y+76,f,f.length>3?22:38,C.ink)+(on?TF(x+50,y+118,'turn over',13,C.blue):'');
  out+=hit(X,act,i,`Card ${f}${on?', chosen':''}. Press to choose or unchoose.`,inner);
  if(reveal)out+=TF(x+50,y+150,ok?'must turn':'no need',13,ok?C.green:C.muted)});
 return out}
const D6_wasonFaces=seed=>shuffled([['E',1],['K',0],['4',0],['7',1]],D6_mix(seed+21));
SCENE({id:'selection-task',name:'The selection task',tag:'Wason’s four cards',
 definition:'In Wason’s selection task you must choose which cards to turn over to test a rule of the form “if P then Q”. The right choice is P and not-Q; most people choose P, or P and Q.',
 example:'Rule: if a card has a vowel on one side, it has an even number on the other. Cards E, K, 4, 7. Turn E and 7: a 7 with a vowel behind it would break the rule; the 4 cannot.',
 desc:'Four cards to select, a Check button, and the result with the cards that must be turned, beside the typical rate of correct answers.',
 research:'Wason (1968). Reasoning about a rule. Quarterly Journal of Experimental Psychology 20 (about 10% correct in many later studies). Evans (1972) on matching bias.',
 dur:10,hint:'Choose the cards you must turn over to find out whether the rule is true, then press Check. Your answers stay in this page.',
 init:()=>({seed:2,sel:[false,false,false,false],checked:false}),
 watch(p){const o=D6_wasonFaces(2),sel=o.map(c=>c[0]==='E'&&p>.2||c[0]==='4'&&p>.4);return {seed:2,sel,checked:p>.65,sim:true}},
 ui:[{b:'Check',act:'check'},{b:'Clear',act:'clear'}],
 on:{tog(s,i){if(!s.checked)s.sel[Number(i)]=!s.sel[Number(i)];return 'keep'},check(s){s.checked=true;return 'keep'},clear(s){s.sel=[false,false,false,false];s.checked=false;s.seed=nextSeed()}},
 draw(s,f,X){
  const o=D6_wasonFaces(s.seed);let out=heading('Rule: if a card has a vowel on one side,',24)+TB(300,50,'it has an even number on the other side.',17,C.ink);
  out+=T(300,70,'Each card has a letter on one side and a number on the other.',14,C.ink);
  out+=T(300,89,'Which cards must you turn over to find out whether the rule is true?',14,C.ink);
  out+=D6_cards(X,o.map(c=>c[0]),s.sel,o.map(c=>!!c[1]),s.checked,'tog');
  if(s.checked){const ok=s.sel.every((v,i)=>v===!!o[i][1]),pick=o.filter((c,i)=>s.sel[i]).map(c=>c[0]).join(' and ')||'nothing';
   out+=T(300,290,`${s.sim?'Simulated participant':'You'} chose ${pick}: ${ok?'right!':'not quite.'}`,16,ok?C.green:C.coral);
   out+=T(300,316,'Only E and 7 can reveal a broken rule (a vowel with an odd number).',14,C.ink);
   out+=T(300,340,'The 4 cannot: the rule says nothing about what is behind an even number.',14,C.ink);
   out+=T(300,366,'In most studies only about 1 person in 10 chooses exactly E and 7.',14,C.muted)}
  else out+=T(300,300,'Press the cards to choose them, then Check.',14,C.muted);
  return {svg:out,phase:'People tend to pick the cards named in the rule (E and 4): “matching bias”. Logic needs the cards that could falsify the rule: the vowel, and the odd number. Choosing the 4 looks for confirmation, which cannot settle the question.'};
 }});

const D6_drinkFaces=seed=>shuffled([['Beer',1],['Cola',0],['25',0],['16',1]],D6_mix(seed+23));
SCENE({id:'selection-task-social',name:'The drinking-age rule',tag:'Content changes everything',
 definition:'The same logical task becomes easy when the rule is a familiar permission or obligation, such as a drinking-age law. Why is debated: social contracts, cheater detection, or familiar schemas.',
 example:'Rule: if a person is drinking beer, they must be over 18. Cards: Beer, Cola, 25, 16. Most people correctly check the beer drinker and the 16-year-old.',
 desc:'Four cards showing what a person drinks or how old they are, to check against a drinking-age rule, with the result and the typical rates for the abstract and the social versions.',
 research:'Griggs & Cox (1982). The elusive thematic-materials effect in Wason’s selection task. British Journal of Psychology 73 (about three quarters correct). Cosmides (1989), cheater detection; Cheng & Holyoak (1985), pragmatic reasoning schemas.',
 dur:10,hint:'Each card shows a drinker at a bar: what they drink on one side, their age on the other. Choose whom you must check, then Check.',
 init:()=>({seed:3,sel:[false,false,false,false],checked:false}),
 watch(p){const o=D6_drinkFaces(3),sel=o.map(c=>c[0]==='Beer'&&p>.2||c[0]==='16'&&p>.4);return {seed:3,sel,checked:p>.65,sim:true}},
 ui:[{b:'Check',act:'check'},{b:'Clear',act:'clear'}],
 on:{tog(s,i){if(!s.checked)s.sel[Number(i)]=!s.sel[Number(i)];return 'keep'},check(s){s.checked=true;return 'keep'},clear(s){s.sel=[false,false,false,false];s.checked=false;s.seed=nextSeed()}},
 draw(s,f,X){
  const o=D6_drinkFaces(s.seed);let out=heading('Rule: if a person is drinking beer, they must be over 18.',26);
  out+=T(300,52,'Each card is a person: their drink on one side, their age on the other.',14,C.ink);
  out+=T(300,74,'Whom must you check to be sure the rule is being kept?',14,C.ink);
  out+=D6_cards(X,o.map(c=>c[0]),s.sel,o.map(c=>!!c[1]),s.checked,'tog');
  if(s.checked){const ok=s.sel.every((v,i)=>v===!!o[i][1]);
   out+=T(300,290,ok?'Right: the beer drinker and the 16-year-old.':'Check the beer drinker and the 16-year-old.',16,ok?C.green:C.coral);
   out+=T(300,316,'This is the same logic as E and 7: P and not-Q.',14,C.ink);
   out+=TF(140,346,'abstract E, K, 4, 7:',13,C.muted,'end')+R(150,334,40,16,C.line,'none',3)+TF(196,346,'≈10%',13,C.ink,'start');
   out+=TF(400,346,'drinking age:',13,C.muted,'end')+R(410,334,150*.75,16,C.blue,'none',3)+TF(410+150*.75+6,346,'≈75%',13,C.ink,'start')}
  else out+=T(300,300,'Press the cards to choose them, then Check.',14,C.muted);
  return {svg:out,phase:'Logically this is the same task as the vowels and numbers, yet most people solve it. Cosmides argued we have a specialised ability to detect cheaters on social contracts; others point to familiar permission rules or to what is relevant. Content, not just form, drives everyday reasoning.'};
 }});

const D6_INF=[
 {n:'Modus ponens',p:'The letter is A.',c:'So the number is 3.',valid:true,rate:97},
 {n:'Modus tollens',p:'The number is not 3.',c:'So the letter is not A.',valid:true,rate:70},
 {n:'Affirming the consequent',p:'The number is 3.',c:'So the letter is A.',valid:false,rate:60},
 {n:'Denying the antecedent',p:'The letter is not A.',c:'So the number is not 3.',valid:false,rate:55}];
SCENE({id:'selection-task-logic',name:'Four inferences',tag:'Valid or not?',
 definition:'From “if P then Q” two inferences follow (modus ponens and modus tollens) and two do not (affirming the consequent and denying the antecedent). People accept the fallacies surprisingly often.',
 example:'“If the letter is A, the number is 3. The number is 3. So the letter is A.” This does not follow: B could have a 3 too.',
 desc:'Four arguments from one conditional rule; you mark each valid or invalid, and see the right answer beside roughly how often people accept each one.',
 research:'Evans, Newstead & Byrne (1993). Human Reasoning: The Psychology of Deduction. Erlbaum. Endorsement rates shown are approximate typical values across studies.',
 dur:10,hint:'Mark each argument Valid (the conclusion must follow) or Invalid.',
 init:()=>({ans:[null,null,null,null]}),
 watch(p){const n=Math.min(4,Math.floor(p*5));return {ans:[true,false,true,false].map((v,i)=>i<n?v:null),sim:true}},
 ui:[{b:'Clear',act:'clear'}],
 on:{judge(s,a){const [i,v]=String(a).split(':');s.ans[Number(i)]=v==='v';return 'keep'},clear(s){s.ans=[null,null,null,null]}},
 draw(s,f,X){
  let out=heading('Rule: if the letter is A, then the number is 3.',26);
  D6_INF.forEach((r,i)=>{const y=46+i*72,a=s.ans[i];
   out+=R(20,y,560,64,'#fff',C.grid,10);
   out+=TF(34,y+22,r.p,14,C.ink,'start')+TF(34,y+44,r.c,14,C.ink,'start');
   ['v','i'].forEach((k,j)=>{const isV=k==='v',on=a!==null&&a===isV;out+=D6_btn(X,'judge',`${i}:${k}`,`${isV?'Valid':'Invalid'}: argument ${i+1}`,238+j*86,y+16,78,32,isV?'Valid':'Invalid',{size:14,sel:on,stroke:on?C.blue:C.line,fill:on?C.pale:'#fff'})});
   if(a!==null){const ok=a===r.valid;out+=TF(424,y+22,r.n,13,C.ink,'start',`font-weight="700"`)+TF(424,y+40,(r.valid?'valid':'invalid')+(ok?' ✓':' ✗'),13,ok?C.green:C.coral,'start');
    out+=R(424,y+48,r.rate*.6,8,C.line,'none',2)+TF(428+r.rate*.6,y+56,`≈${r.rate}% accept`,13,C.muted,'start')}});
  const done=s.ans.filter(a=>a!==null).length,right=s.ans.filter((a,i)=>a===D6_INF[i].valid).length;
  out+=T(300,350,done<4?'Mark all four.':`${s.sim?'Simulated participant':'You'}: ${right} of 4. Most people accept modus ponens, miss modus tollens and accept the fallacies.`,14,C.ink);
  return {svg:out,phase:'Logic says only the first two follow. In experiments nearly everyone accepts modus ponens, but only about two thirds draw modus tollens, and about half or more accept the two fallacies. Many everyday “if” statements are read as “if and only if”, which would make all four valid.'};
 }});

/* ---------------------------------------------------------------- dual process */
const D6_CRT=[
 {q:['A bat and a ball cost £1.10 in total. The bat costs £1.00 more','than the ball. How much does the ball cost?'],opts:['10p','5p','1p','15p'],right:'5p',quick:'10p'},
 {q:['If 5 machines take 5 minutes to make 5 widgets, how long','would 100 machines take to make 100 widgets?'],opts:['100 minutes','5 minutes','20 minutes','1 minute'],right:'5 minutes',quick:'100 minutes'},
 {q:['A patch of lily pads doubles in size every day. It covers the lake','in 48 days. How long to cover half the lake?'],opts:['24 days','47 days','46 days','12 days'],right:'47 days',quick:'24 days'}];
SCENE({id:'dual-process',name:'Cognitive reflection',tag:'Three quick questions',
 definition:'Dual-process theories distinguish fast, automatic responses (Type 1, “System 1”) from slow, effortful reasoning (Type 2, “System 2”). The Cognitive Reflection Test asks questions whose quick answer is wrong.',
 example:'Bat and ball: 10p springs to mind, but then the bat would cost £1.10 and the total £1.20. The ball costs 5p.',
 desc:'The three Cognitive Reflection Test questions with multiple-choice answers, timed; your answers, times and whether each was the intuitive wrong answer, beside the original study’s results.',
 research:'Frederick (2005). Cognitive reflection and decision making. Journal of Economic Perspectives 19(4) (mean 1.24 of 3; a third scored 0). Many people have now seen the items; scores are fairly robust to repeat exposure (Bialek & Pennycook 2018).',
 dur:12,hint:'Press Start, then answer each question as it appears. Times are measured in your browser and stay in this page.',
 init:()=>({seed:5,started:false,shown:0,picks:[],rts:[]}),
 watch(p){const n=Math.min(3,Math.floor(p*4));return {seed:5,started:true,shown:0,picks:['10p','5 minutes','24 days'].slice(0,n),rts:[3.1,9.4,4.2].slice(0,n),sim:true}},
 ui:[{b:'Start',act:'start'},{b:'Start again',act:'again'}],
 on:{start(s){if(!s.started){s.started=true;s.shown=performance.now()}return 'keep'},
  pick(s,v){if(!s.started||s.picks.length>=3)return 'keep';const now=performance.now();s.rts.push((now-s.shown)/1000);s.picks.push(v);s.shown=now;return 'keep'},
  again(s){s.seed=nextSeed();s.started=false;s.picks=[];s.rts=[]}},
 draw(s,f,X){
  const n=s.picks.length;let out=heading('Answer quickly, but correctly',26);
  if(!s.started)out+=R(40,50,520,110,C.pale,'none',12)+T(300,100,'Press Start to see the first question.',15,C.muted);
  else if(n<3){const it=D6_CRT[n],opts=shuffled(it.opts,D6_mix(s.seed*7+n));
   out+=TF(300,50,`Question ${n+1} of 3${s.sim?' · simulated participant':''}`,13,C.muted);
   it.q.forEach((l,i)=>out+=T(300,74+i*20,l,14,C.ink));
   opts.forEach((o,i)=>out+=D6_btn(X,'pick',o,o,40+i*134,118,120,40,o,{size:15}))}
  else out+=R(40,50,520,110,C.greenp,'none',12)+TB(300,96,`${s.sim?'Simulated participant':'You'}: ${s.picks.filter((p,i)=>p===D6_CRT[i].right).length} of 3 correct`,17,C.green)+T(300,124,'Most wrong answers are the quick intuitive ones.',14,C.ink);
  out+=TF(40,190,'question',13,C.muted,'start')+TF(220,190,'answer',13,C.muted,'start')+TF(400,190,'time',13,C.muted,'start');
  s.picks.forEach((p,i)=>{const it=D6_CRT[i],y=214+i*26,ok=p===it.right;
   out+=TF(40,y,['Bat and ball','Widgets','Lily pads'][i],14,C.ink,'start')+TF(220,y,p+(ok?' ✓':p===it.quick?' ✗ (the quick answer)':' ✗'),14,ok?C.green:C.coral,'start')+TF(400,y,s.rts[i].toFixed(1)+' s',14,C.ink,'start')+(ok?'':TF(470,y,'right: '+it.right,13,C.muted,'start'))});
  out+=T(300,322,'Frederick (2005), 3,428 people: average 1.24 of 3; about a third scored 0.',14,C.ink);
  out+=T(300,346,'A low score shows a quick answer that was not checked, not low intelligence.',14,C.muted);
  return {svg:out,phase:'Each question has an answer that comes to mind at once and is wrong. Getting it right means noticing the pull of that answer and checking it. CRT scores predict some biases and some patience in choices; the test measures a disposition to check, alongside numeracy.'};
 }});

const D6_SYL=[
 {p:['No police dogs are vicious.','Some highly trained dogs are vicious.'],c:'Therefore, some highly trained dogs are not police dogs.',valid:true,bel:true},
 {p:['No nutritional things are inexpensive.','Some vitamin tablets are inexpensive.'],c:'Therefore, some vitamin tablets are not nutritional.',valid:true,bel:false},
 {p:['No addictive things are inexpensive.','Some cigarettes are inexpensive.'],c:'Therefore, some addictive things are not cigarettes.',valid:false,bel:true},
 {p:['No millionaires are hard workers.','Some rich people are hard workers.'],c:'Therefore, some millionaires are not rich people.',valid:false,bel:false}];
const D6_BB={vb:89,vu:56,ib:71,iu:10};
const D6_sylOrder=seed=>shuffled(range(4),D6_mix(seed+31));
SCENE({id:'dual-process-belief-bias',name:'Belief bias',tag:'Logic against plausibility',
 definition:'Belief bias is judging an argument by whether its conclusion is believable rather than whether it follows from the premises.',
 example:'“Some addictive things are not cigarettes” is believable, so most people accept that argument, though it does not follow from its premises.',
 desc:'Four syllogisms, one at a time, to judge as valid or invalid; then a chart of acceptance for the four kinds (valid or not, believable or not) beside Evans, Barston and Pollard’s results.',
 research:'Evans, Barston & Pollard (1983). On the conflict between logic and belief in syllogistic reasoning. Memory & Cognition 11 (acceptance 89%, 56%, 71%, 10%). Widely replicated.',
 dur:12,hint:'Assume the premises are true. Does the conclusion necessarily follow? Answer Valid or Invalid.',
 init:()=>({seed:8,ans:[]}),
 watch(p){const n=Math.min(4,Math.floor(p*5)),o=D6_sylOrder(8);return {seed:8,ans:o.slice(0,n).map(i=>D6_SYL[i].bel),sim:true}},
 ui:[{b:'Valid',act:'ans',arg:'v'},{b:'Invalid',act:'ans',arg:'i'},{b:'Start again',act:'again'}],
 on:{ans(s,v){if(s.ans.length<4)s.ans.push(v==='v');return 'keep'},again(s){s.seed=nextSeed();s.ans=[]}},
 draw(s){
  const o=D6_sylOrder(s.seed),n=s.ans.length;let out=heading('Does the conclusion follow from the premises?',26);
  if(n<4){const it=D6_SYL[o[n]];out+=R(40,42,520,96,C.pale,'none',12);
   out+=TF(56,64,`${n+1} of 4${s.sim?' · simulated participant':''}`,13,C.muted,'start');
   it.p.forEach((l,i)=>out+=TF(56,86+i*20,l,14,C.ink,'start'));out+=TBF(56,128,it.c,14,C.ink,'start')}
  else out+=R(40,42,520,96,C.greenp,'none',12)+TB(300,96,'All four judged',17,C.green);
  const cells=[['vb','valid,','believable'],['vu','valid,','unbelievable'],['ib','invalid,','believable'],['iu','invalid,','unbelievable']];
  const pl=D6_plot(90,170,440,120,[0,4],[0,100],{yt:[[0,'0%'],[50,'50%'],[100,'100%']],yl:'accepted as valid'});out+=pl.svg;
  cells.forEach(([k,a,b],j)=>{const x=pl.X(j+.5),v=D6_BB[k];out+=R(x-30,pl.Y(v),60,pl.Y(0)-pl.Y(v),k[0]==='v'?C.blue:C.coral,'none',3)+TF(x,pl.Y(v)-5,v+'%',13,C.ink)+TF(x,308,a,13,C.ink)+TF(x,324,b,13,C.muted);
   const idx=D6_SYL.findIndex(q=>(q.valid?'v':'i')+(q.bel?'b':'u')===k),k2=o.indexOf(idx);
   if(k2<n)out+=TBF(x,348,s.ans[k2]?'accepted':'rejected',13,s.ans[k2]===D6_SYL[idx].valid?C.green:C.coral)});
  out+=TF(90,372,`bars = Evans et al. (1983) · words = ${s.sim?'simulated participant':'you'} (green when logically right)`,13,C.muted,'start');
  return {svg:out,phase:'If people followed logic alone, the two valid bars would be high and the two invalid bars low. Instead believability pulls acceptance up or down: an invalid but believable conclusion is accepted 71% of the time. Belief and logic interact most when the argument is invalid.'};
 }});

const D6_TR={di:{t:'What a strict default-interventionist account predicts',v:[15,45,35,5],note:'correct answers come mostly from slow correction of a wrong intuition'},
 obs:{t:'The pattern in two-response studies',v:[32,55,8,5],note:'most final correct answers were already correct under the deadline'}};
SCENE({id:'dual-process-two-response',name:'Fast logic?',tag:'Two responses, one problem',
 definition:'In the two-response method people answer a reasoning problem twice: first fast, under a deadline and a memory load, then again with unlimited time. It tests whether correct answers need slow deliberation.',
 example:'If correct answers came only from slow correction, most correct final answers would follow a wrong first answer. Bago and De Neys found that most were correct from the start.',
 desc:'Bars for four kinds of answer change (correct to correct, wrong to wrong, wrong to correct, correct to wrong), as predicted by a strict serial account and as found in two-response studies; the shapes are illustrative, not exact data.',
 research:'Bago & De Neys (2017). Fast logic?: examining the time course assumption of dual process theory. Cognition 158. Evans & Stanovich (2013), Perspectives on Psychological Science 8; critiques: Kruglanski & Gigerenzer (2011); Melnikoff & Bargh (2018), “the mythical number two”.',
 dur:10,hint:'Switch between the prediction and the finding. Which change is common?',
 init:()=>({view:'di'}),
 watch(p){return {view:p<.5?'di':'obs'}},
 ui:[{choose:[['di','Serial prediction'],['obs','Two-response finding']],label:'Show',get:s=>s.view,act:'view'}],
 on:{view(s,v){s.view=v;return 'keep'}},
 draw(s){
  const d=D6_TR[s.view];let out=heading(d.t,26);
  out+=R(30,44,240,26,C.pale,'none',8)+TF(150,62,'1st answer: fast, under deadline',13,C.ink);
  out+=arrow(276,57,316,57,C.muted,2,7)+R(322,44,248,26,C.pale,'none',8)+TF(446,62,'2nd answer: unlimited time',13,C.ink);
  const pl=D6_plot(80,100,440,170,[0,4],[0,60],{yl:'share of trials on conflict problems (illustrative shape)'});out+=pl.svg;
  [['correct →','correct',C.green],['wrong →','wrong',C.muted],['wrong →','correct',C.amber],['correct →','wrong',C.coral]].forEach(([a,b,col],j)=>{const x=pl.X(j+.5),v=d.v[j];out+=R(x-34,pl.Y(v),68,pl.Y(0)-pl.Y(v),col,'none',3)+TF(x,288,a,13,C.ink)+TF(x,304,b,13,C.ink)});
  out+=T(300,336,d.note,14,C.ink);
  out+=T(300,360,'Bar heights show the shape of the result, not the published numbers.',13,C.muted);
  return {svg:out,phase:'Dual-process theories are useful labels, but the simple story that intuition errs and slow thought corrects it is too simple: people often have fast “logical intuitions”, and fast and slow processes may differ in degree rather than kind. Kahneman himself described System 1 and System 2 as fictitious characters in a story.'};
 }});
