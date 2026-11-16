/* ===================== Economics era 6 · Behaviour and experiments ===================== */
// Fairness, impatience, cooperation, defaults, markets in the lab and the endowment effect. Where it is short
// and harmless the learner takes part against simulated players; Watch shows a labelled simulated participant.
// Every picture is a pure function of state; trial orders and simulated players use seeded generators.
const E6_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const E6_rng=n=>rng(E6_mix(n));
const E6_sig=z=>1/(1+Math.exp(-z));
const E6_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const E6_money=v=>{const r=Math.round(v*100)/100;return (r<0?'−£':'£')+Math.abs(r).toFixed(2)};
// Plot frame mapping data to drawing units.
function E6_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// A pressable box (a button in Try it, plain in Watch).
function E6_btn(X,act,arg,label,x,y,w,h,text,o={}){
 const lines=Array.isArray(text)?text:[text];
 const inner=R(x,y,w,h,o.fill||'#fff',o.stroke||C.line,10,o.sel?'stroke-width="3"':'stroke-width="1.5"')+lines.map((t,i)=>TF(x+w/2,y+h/2+5+(i-(lines.length-1)/2)*17,t,o.size||14,o.ink||C.ink,'middle',o.bold&&i===0?'font-weight="700"':'')).join('');
 return hit(X,act,arg,label,inner);
}
const E6_tag=(txt,col,bg)=>R(462,10,128,24,bg,'none',12)+TBF(526,27,txt,12,col);
// A simple person glyph.
const E6_person=(x,y,col,r=9)=>Ci(x,y-r*1.25,r*.62,col)+P(`M${fmt(x-r)} ${fmt(y+r*.9)} Q${fmt(x)} ${fmt(y-r*1.1)} ${fmt(x+r)} ${fmt(y+r*.9)} Z`,col,1,col);

/* ---------------------------------------------------------------- ultimatum-game */
// Ten simulated responders. Their acceptance thresholds follow the stylised finding that offers below about
// 20% of the pie are rejected about half the time (Camerer 2003): threshold = 20% + logistic spread.
const E6_UTH=range(10).map(k=>{const q=(k+.5)/10;return 20+4*Math.log(q/(1-q))});
const E6_pAcc=pct=>E6_sig((pct-20)/4);
const E6_expEarn=o=>(10-o)*E6_pAcc(o*10);
SCENE({id:'ultimatum-game',name:'The ultimatum game',tag:'You propose a split of £10',
 definition:'In the ultimatum game one player proposes how to split a sum; the other can accept, and both get the split, or reject, and both get nothing.',
 example:'Offering £1 of £10 is the “rational” prediction if responders take any money; real responders often reject such offers, so real proposers offer £4 or £5.',
 desc:'You choose an offer out of £10 and play it against ten simulated responders whose rejection pattern follows published averages; a curve shows the expected earnings from every offer.',
 research:'Güth, Schmittberger & Schwarze (1982). An experimental analysis of ultimatum bargaining. J. Econ. Behav. Organ. 3. Camerer (2003). Behavioral Game Theory: offers average 40–50%; offers under 20% are rejected about half the time. Roth et al. (1991) on proposers’ offers near the earnings-maximising level. Widely replicated.',
 dur:10,hint:'Set your offer with the slider and press Make the offer. The responders are simulated; nothing you choose leaves this page.',
 init:()=>({offer:4,plays:[]}),
 watch(p){const o=[1,2,3,4,5][Math.min(4,Math.floor(p*5))];return {offer:o,plays:[1,2,3,4,5].filter(v=>v<=o).map(v=>({offer:v,acc:E6_UTH.filter(t=>v*10>=t).length})),sim:true}},
 ui:[{range:'offer',label:'Your offer to the responder',min:0,max:10,step:1,get:s=>s.offer,act:'offer',show:v=>'£'+v+' of £10'},{b:'Make the offer',act:'play'}],
 on:{offer(s,v){s.offer=Number(v);return 'keep'},
  play(s){const acc=E6_UTH.filter(t=>s.offer*10>=t).length;s.plays.push({offer:s.offer,acc});if(s.plays.length>12)s.plays.shift();
   if(acc>=5)AUDIO.tone(660,{dur:.12,gain:.08});else AUDIO.tone(220,{dur:.18,gain:.08});return 'keep'}},
 draw(s){
  let out=heading('The ultimatum game: you split £10',26);
  const last=s.plays.length?s.plays[s.plays.length-1]:null,o=last?last.offer:s.offer;
  out+=TF(150,62,last?`Offer of £${o}: ${last.acc} of 10 accept`:`Offer of £${o}: press Make the offer`,14,C.ink);
  E6_UTH.forEach((t,k)=>{const x=50+(k%5)*50,y=110+Math.floor(k/5)*66,ok=o*10>=t,col=last?(ok?C.green:C.coral):C.line;
   out+=E6_person(x,y,col,11)+TF(x,y+28,last?(ok?'yes':'no'):'?',13,col)});
  if(last){const you=(10-o)*last.acc,them=o*last.acc;
   out+=R(30,256,240,62,C.pale,'none',8)+TF(150,280,`You keep £${10-o} × ${last.acc} = £${you}`,14,C.ink)+TF(150,302,`Responders get £${them} in total`,13,C.muted)}
  const pl=E6_plot(330,70,230,190,[0,10],[0,7],{xt:[[0,'£0'],[2,'£2'],[4,'£4'],[6,'£6'],[8,'£8'],[10,'£10']],yt:[[0,'0'],[2,'2'],[4,'4'],[6,'6']],xl:'offer',yl:'expected £ kept per responder'});
  out+=pl.svg;out+=R(pl.X(4),70,pl.X(5)-pl.X(4),190,C.greenp,'none',0,'opacity=".8"');
  out+=TF(pl.X(4.5),236,'typical',12,C.green)+TF(pl.X(4.5),250,'offers',12,C.green);
  out+=E6_poly(range(101).map(i=>{const v=i/10;return [pl.X(v),pl.Y(E6_expEarn(v))]}),C.coral,2.4);
  s.plays.forEach(pp=>out+=Ci(pl.X(pp.offer),pl.Y((10-pp.offer)*pp.acc/10),5.5,C.blue,'#fff'));
  out+=TF(445,322,'coral: expected £ kept',13,C.coral)+TF(445,338,`blue dots: ${s.sim?'simulated proposer':'your offers'}`,13,C.blue);
  out+=TF(150,342,'Selfish theory: offer £1.',13,C.ink)+TF(150,360,'People do not.',13,C.ink);
  return {svg:out,phase:`On this stylised rejection pattern the offer that keeps the most on average is about £3: lower offers are often rejected, higher ones give money away. Real proposers mostly offer £4–£5, and in several countries Roth et al. (1991) found that this was close to the earnings-maximising offer for the responders they actually faced.`};
 }});

const E6_ROFF=[1,2,3,4,5,1,2,3];
const E6_rOrder=seed=>shuffled(E6_ROFF,E6_mix(seed));
SCENE({id:'ultimatum-game-respond',name:'Would you reject free money?',tag:'You respond to eight offers',
 definition:'Rejecting a low offer costs the responder money; doing it anyway is a costly punishment of an unfair proposer.',
 example:'Turning down £2 of £10 leaves you £2 poorer, but the proposer loses £8.',
 desc:'Eight offers out of £10, in a seeded order, from simulated proposers. Accept or reject each, and your acceptance rate at each offer appears beside the typical acceptance curve.',
 research:'Camerer (2003). Behavioral Game Theory; Güth et al. (1982). Sanfey et al. (2003), Science 300: unfair offers activate anterior insula. Rejections of offers under 20% are among the best-replicated results in experimental economics.',
 dur:10,hint:'Press Accept or Reject for each offer. Your choices stay in this page; the proposers are simulated.',
 init:()=>({seed:3,t:0,res:[]}),
 watch(p){const n=Math.min(8,Math.floor(p*9)),o=E6_rOrder(3);return {seed:3,t:n,res:o.slice(0,n).map(v=>({offer:v,acc:v>=2})),sim:true}},
 ui:[{b:'Accept',act:'ans',arg:'acc'},{b:'Reject',act:'ans',arg:'rej'}],
 on:{ans(s,v){if(s.t>=8)return 'keep';s.res.push({offer:E6_rOrder(s.seed)[s.t],acc:v==='acc'});s.t++;return 'keep'}},
 draw(s,f,X){
  let out=heading('Accept or reject?',26);
  if(s.t<8){const o=E6_rOrder(s.seed)[s.t];
   out+=R(40,48,220,120,C.pale,'none',10)+TF(150,74,`Offer ${s.t+1} of 8`,13,C.muted)+TBF(150,112,`You get £${o}`,26,C.blue)+TF(150,140,`the proposer keeps £${10-o}`,14,C.ink);
   out+=E6_btn(X,'ans','acc','Accept the offer',40,180,104,40,'Accept',{fill:C.greenp,stroke:C.green})+E6_btn(X,'ans','rej','Reject the offer',156,180,104,40,'Reject',{fill:C.coralp,stroke:C.coral});}
  else out+=R(40,48,220,120,C.greenp,'none',10)+TBF(150,100,'All eight answered',16,C.green)+TF(150,126,'Reset for a new order.',13,C.ink);
  const pl=E6_plot(320,60,240,200,[.5,5.5],[0,100],{xt:[[1,'£1'],[2,'£2'],[3,'£3'],[4,'£4'],[5,'£5']],yt:[[0,'0%'],[50,'50%'],[100,'100%']],xl:'offer out of £10',yl:'share accepted'});
  out+=pl.svg;
  [1,2,3,4,5].forEach(v=>{const r=s.res.filter(q=>q.offer===v);if(!r.length)return;const a=r.filter(q=>q.acc).length/r.length*100;out+=R(pl.X(v)-14,pl.Y(a),28,pl.Y(0)-pl.Y(a),C.blue,'none',3)});
  out+=E6_poly(range(51).map(i=>{const v=.5+i/10;return [pl.X(v),pl.Y(E6_pAcc(v*10)*100)]}),C.coral,2.4);
  out+=TF(440,318,`blue bars: ${s.sim?'simulated responder':'you'} · coral: typical`,13,C.muted);
  const n=s.res.filter(q=>!q.acc).length;
  out+=T(300,346,s.res.length?`${s.sim?'Simulated':'You'}: ${n} rejection${n===1?'':'s'}, giving up £${s.res.filter(q=>!q.acc).reduce((a,q)=>a+q.offer,0)} in all`:'Your answers appear as bars.',14,C.ink);
  return {svg:out,phase:'A purely money-maximising responder accepts every offer above zero. Most people reject at least some offers of £1 or £2: they pay to punish unfairness. That willingness is why proposers do not offer £1.'};
 }});

// Henrich et al. (2001, 2005): mean offers in small-scale societies. Values approximate, read from the published figures.
const E6_SOC=[
 {n:'Machiguenga (Peru)',v:26,t:'Horticulturalists living in family units with little cooperation beyond the household. Low offers were rarely rejected.'},
 {n:'Quichua (Ecuador)',v:27,t:'Among the lowest mean offers in the study.'},
 {n:'Tsimane (Bolivia)',v:37,t:'Forager-horticulturalists of the Bolivian lowlands.'},
 {n:'Hadza (Tanzania)',v:40,t:'Foragers; offers and rejections varied with camp size.'},
 {n:'Au (Papua New Guinea)',v:43,t:'Some offers above 50% were rejected: in gift-giving cultures, accepting a large gift can create an unwanted obligation.'},
 {n:'Orma (Kenya)',v:44,t:'Pastoralists; offers resembled contributions to local public goods (harambee).'},
 {n:'US students (comparison)',v:44,t:'Typical of university-student samples in industrial societies.'},
 {n:'Aché (Paraguay)',v:51,t:'Foragers who share meat widely across the group.'},
 {n:'Lamalera (Indonesia)',v:58,t:'Whale hunters whose catch is divided by elaborate cooperative rules. The highest mean offers.'}];
SCENE({id:'ultimatum-game-cultures',name:'Fairness across cultures',tag:'Fifteen small-scale societies',
 definition:'Cross-cultural experiments run the same game in very different societies to see whether “fair” offers are a human constant or shaped by local norms.',
 example:'Mean offers ranged from about a quarter of the pie among the Machiguenga to well over half among the Lamalera whale hunters.',
 desc:'Mean ultimatum offers in a selection of the societies studied by Henrich and colleagues, as bars from 0 to 70%. Press a society for its note.',
 research:'Henrich, J. et al. (2001). In search of Homo economicus: behavioral experiments in 15 small-scale societies. American Economic Review 91(2), 73–78; Henrich et al. (2005), Behavioral and Brain Sciences 28. Offers correlated with market integration and everyday cooperation. Values here are approximate.',
 dur:9,hint:'Press a bar to read about that society.',
 init:()=>({pick:8}),
 watch(p){return {pick:Math.min(8,Math.floor(p*9))}},
 on:{pick(s,v){s.pick=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Mean ultimatum offers (share of the pie)',26);
  const x0=230,sc=4.4;
  out+=L(x0,44,x0,330,C.line,1.5);[0,25,50].forEach(v=>out+=L(x0+v*sc,44,x0+v*sc,330,C.grid,1)+TF(x0+v*sc,344,v+'%',13,C.muted));
  E6_SOC.forEach((q,i)=>{const y=50+i*31,sel=s.pick===i,col=q.n.startsWith('US')?C.purple:C.blue;
   out+=hit(X,'pick',i,`${q.n}: mean offer about ${q.v}%`,R(20,y-2,560,28,sel?C.pale:'#fff','none',4)+TF(x0-8,y+17,q.n,13,C.ink,'end')+R(x0,y+3,q.v*sc,18,col,'none',3)+TF(x0+q.v*sc+6,y+17,`≈${q.v}%`,13,C.ink,'start'))});
  const q=E6_SOC[s.pick];
  out+=TF(300,372,`Selected: ${q.n}, mean offer about ${q.v}%`,13,C.ink);
  return {svg:out,phase:`${q.n}: ${q.t} No society behaved like the selfish textbook player, but none matched the student pattern exactly either. Offers rose with how much daily life depended on markets and cooperation with strangers (values approximate).`};
 }});

/* ---------------------------------------------------------------- present-bias */
// Matched pairs: the same trade-off, near and far. Pair 0 follows Keren & Roelofsma (1995), who used Dutch guilders.
const E6_PB=[{a:[100,0],b:[110,4],pair:0,far:false},{a:[100,26],b:[110,30],pair:0,far:true},{a:[100,0],b:[120,8],pair:1,far:false},{a:[100,52],b:[120,60],pair:1,far:true}];
const E6_pbOrder=seed=>shuffled(range(4),E6_mix(seed));
const E6_when=w=>w===0?'today':`in ${w} weeks`;
SCENE({id:'present-bias',name:'Present bias',tag:'Choose now or later, near and far',
 definition:'Present bias is a stronger preference for “now” over “soon” than for “later” over “a little later”, even when the waiting time and the reward are the same.',
 example:'Many people take £100 today rather than £110 in four weeks, yet take £110 in 30 weeks rather than £100 in 26 weeks: the same four-week wait.',
 desc:'Four choices between a smaller, sooner and a larger, later amount, in a seeded order. Matched pairs differ only in how far away they are; a reversal is flagged.',
 research:'Thaler (1981). Some empirical evidence on dynamic inconsistency. Economics Letters 8. Keren & Roelofsma (1995), Org. Behav. Hum. Decis. Process. 63: 82% chose 100 now over 110 in 4 weeks, but 37% chose 100 in 26 weeks over 110 in 30 weeks. Laibson (1997), QJE 112. The size of present bias varies a lot across studies and money versus real consumption (Cohen et al. 2020).',
 dur:10,hint:'Choose the smaller-sooner or larger-later amount in each of four questions. Your choices stay in this page.',
 init:()=>({seed:5,t:0,res:{}}),
 watch(p){const n=Math.min(4,Math.floor(p*5)),o=E6_pbOrder(5),res={};o.slice(0,n).forEach(i=>res[i]=E6_PB[i].far?'late':'soon');return {seed:5,t:n,res,sim:true}},
 ui:[{b:'Smaller, sooner',act:'ans',arg:'soon'},{b:'Larger, later',act:'ans',arg:'late'}],
 on:{ans(s,v){if(s.t>=4)return 'keep';s.res[E6_pbOrder(s.seed)[s.t]]=v;s.t++;return 'keep'}},
 draw(s,f,X){
  let out=heading('Smaller and sooner, or larger and later?',26);
  if(s.t<4){const q=E6_PB[E6_pbOrder(s.seed)[s.t]];
   out+=TF(300,56,`Question ${s.t+1} of 4`,13,C.muted);
   out+=E6_btn(X,'ans','soon','Smaller, sooner',70,68,210,78,[`£${q.a[0]}`,E6_when(q.a[1])],{size:17,bold:true,fill:C.pale,stroke:C.blue});
   out+=E6_btn(X,'ans','late','Larger, later',320,68,210,78,[`£${q.b[0]}`,E6_when(q.b[1])],{size:17,bold:true,fill:C.amberp,stroke:C.amber});}
  else out+=R(70,68,460,78,C.greenp,'none',10)+TBF(300,104,'All four answered',16,C.green)+TF(300,128,'Reset for a new order.',13,C.ink);
  [0,1].forEach(pr=>{const y=180+pr*74,near=E6_PB.findIndex(q=>q.pair===pr&&!q.far),far=E6_PB.findIndex(q=>q.pair===pr&&q.far),a=s.res[near],b=s.res[far];
   out+=R(40,y,520,62,'#fff',C.grid,8);
   out+=TF(56,y+22,`Near: £${E6_PB[near].a[0]} ${E6_when(E6_PB[near].a[1])} or £${E6_PB[near].b[0]} ${E6_when(E6_PB[near].b[1])}`,13,C.ink,'start')+TF(544,y+22,a?(a==='soon'?'sooner':'later'):'—',13,a?C.blue:C.muted,'end');
   out+=TF(56,y+44,`Far: £${E6_PB[far].a[0]} ${E6_when(E6_PB[far].a[1])} or £${E6_PB[far].b[0]} ${E6_when(E6_PB[far].b[1])}`,13,C.ink,'start')+TF(544,y+44,b?(b==='soon'?'sooner':'later'):'—',13,b?C.blue:C.muted,'end');
   if(a==='soon'&&b==='late')out+=R(392,y+5,98,22,C.coralp,'none',11)+TBF(441,y+21,'reversal',12,C.coral);});
  out+=TF(300,348,'Keren & Roelofsma (1995): 82% chose sooner when near, only 37% when far',13,C.ink);
  out+=TF(300,368,s.sim?'Shown: a simulated participant with present bias.':'A constant-rate discounter never reverses.',13,C.muted);
  return {svg:out,phase:'Each pair offers the same reward for the same extra wait. Exponential discounting, the textbook model, ranks them the same way whether near or far. Choosing sooner when near and later when far is a preference reversal: the present gets extra weight.'};
 }});

SCENE({id:'present-bias-curves',name:'Why preferences reverse',tag:'Exponential against hyperbolic',
 definition:'Exponential discounting shrinks value by the same factor every week; hyperbolic discounting, V = A ÷ (1 + k·t), falls steeply at first and slowly later, so the curves for two rewards can cross.',
 example:'With k = 0.1 per week, £100 at 26 weeks is worth less than £110 at 30 weeks, but as the £100 gets within 30 weeks the ranking flips.',
 desc:'The present value of £100 at the sooner date and £110 four weeks later, as the sooner date approaches. Choose exponential or hyperbolic discounting and the rate; the crossing point, if any, is marked.',
 research:'Ainslie (1975). Specious reward. Psychological Bulletin 82. Mazur (1987); Laibson (1997) quasi-hyperbolic β–δ model. For the hyperbola, the switch happens when the sooner reward is 40 − 1/k weeks away (for these amounts).',
 dur:10,hint:'Move “weeks until £100” from far to near and watch which reward is worth more. Switch to exponential and the ranking never changes.',
 init:()=>({k:.1,mode:'hyper',d:20}),
 watch(p){return {k:.1,mode:'hyper',d:Math.round(40*(1-p))}},
 ui:[{choose:[['hyper','Hyperbolic'],['exp','Exponential']],label:'Discounting',get:s=>s.mode,act:'mode'},{range:'k',label:'Discount rate k (per week)',min:.03,max:.3,step:.01,get:s=>s.k,act:'k',show:v=>Number(v).toFixed(2)},{range:'d',label:'Weeks until the £100',min:0,max:40,step:1,get:s=>s.d,act:'d',show:v=>v+' weeks'}],
 on:{mode(s,v){s.mode=v;return 'keep'},k(s,v){s.k=Number(v);return 'keep'},d(s,v){s.d=Number(v);return 'keep'}},
 draw(s){
  const V=(A,t)=>s.mode==='hyper'?A/(1+s.k*t):A*Math.exp(-s.k*t);
  let out=heading('Present value as the rewards approach',26);
  const pl=E6_plot(80,52,400,220,[40,0],[0,110],{xt:[[40,'40'],[30,'30'],[20,'20'],[10,'10'],[0,'0']],yt:[[0,'0'],[50,'50'],[100,'100']],xl:'weeks until the £100 (time flows right →)',yl:'value today (£)'});
  out+=pl.svg;
  out+=E6_poly(range(81).map(i=>{const d=40-i/2;return [pl.X(d),pl.Y(V(100,d))]}),C.blue,2.6);
  out+=E6_poly(range(81).map(i=>{const d=40-i/2;return [pl.X(d),pl.Y(V(110,d+4))]}),C.amber,2.6);
  const cross=s.mode==='hyper'?40-1/s.k:null;
  if(cross!==null&&cross>0&&cross<40)out+=L(pl.X(cross),52,pl.X(cross),272,C.coral,1.8,'stroke-dasharray="5 4"')+TF(pl.X(cross),66,`switch at ${cross.toFixed(1)} wk`,12,C.coral);
  out+=L(pl.X(s.d),52,pl.X(s.d),272,C.ink,1.5)+Ci(pl.X(s.d),pl.Y(V(100,s.d)),6,C.blue,'#fff')+Ci(pl.X(s.d),pl.Y(V(110,s.d+4)),6,C.amber,'#fff');
  const a=V(100,s.d),b=V(110,s.d+4);
  out+=TF(500,90,'£100 sooner',13,C.blue,'start')+TF(500,108,E6_money(a),14,C.blue,'start');
  out+=TF(500,140,'£110 four',13,C.amber,'start')+TF(500,156,'weeks later',13,C.amber,'start')+TF(500,174,E6_money(b),14,C.amber,'start');
  out+=TBF(500,214,a>b?'Take £100':'Wait for £110',14,a>b?C.blue:C.amber,'start');
  out+=T(300,340,s.mode==='exp'?(s.k<Math.log(1.1)/4?'Exponential: £110 later wins at every distance.':'Exponential: £100 sooner wins at every distance.'):(cross>0?`Hyperbolic: patient when far, impatient within ${cross.toFixed(1)} weeks.`:'Hyperbolic, but this rate is so steep the £100 always wins.'),14,C.ink);
  return {svg:out,phase:'With exponential discounting the two curves keep the same ratio, so whichever reward wins far away still wins up close. A hyperbola falls steeply near zero, so the nearer reward overtakes the larger one as both approach: a plan made in advance is abandoned when the moment comes.'};
 }});

// Save More Tomorrow (Thaler & Benartzi 2004). Start and end of the SMarT group are published; other points approximate.
const E6_SMART={smart:[3.5,6.5,9.4,11.6,13.6],advice:[4.4,8.7,8.8,8.7,8.8],none:[6.6,6.5,6.8,6.6,6.2]};
SCENE({id:'present-bias-commitment',name:'Committing in advance',tag:'Save More Tomorrow',
 definition:'A commitment device lets a person lock in a choice while the costs are still in the future, before present bias has a chance to overturn it.',
 example:'Save More Tomorrow asks people to agree now that a share of each future pay rise will go into their pension, so saving more never feels like a pay cut.',
 desc:'Average pension saving rates across four pay rises for employees who joined Save More Tomorrow, took an adviser’s one-off recommendation, or did neither. Step through the pay rises.',
 research:'Thaler & Benartzi (2004). Save More Tomorrow: using behavioral economics to increase employee saving. Journal of Political Economy 112, S164–S187: SMarT savers went from 3.5% to 13.6% over four pay rises. Ashraf, Karlan & Yin (2006), QJE 121: a commitment savings account raised balances in the Philippines. Intermediate values here are approximate.',
 dur:9,hint:'Step through the pay rises and switch between the three groups.',
 init:()=>({step:4,plan:'smart'}),
 watch(p){return {step:Math.min(4,Math.floor(p*5)),plan:'smart'}},
 ui:[{choose:[['smart','Save More Tomorrow'],['advice','Adviser’s one-off rise'],['none','No change']],label:'Group',get:s=>s.plan,act:'plan'},{range:'step',label:'Pay rises so far',min:0,max:4,step:1,get:s=>s.step,act:'step'}],
 on:{plan(s,v){s.plan=v;return 'keep'},step(s,v){s.step=Number(v);return 'keep'}},
 draw(s){
  let out=heading('Average saving rate after each pay rise',26);
  const pl=E6_plot(90,56,420,230,[-.5,4.5],[0,15],{xt:[[0,'start'],[1,'1st'],[2,'2nd'],[3,'3rd'],[4,'4th']],yt:[[0,'0%'],[5,'5%'],[10,'10%'],[15,'15%']],xl:'pay rise',yl:'share of pay saved'});
  out+=pl.svg;
  const cols={smart:C.green,advice:C.blue,none:C.muted},names={smart:'Save More Tomorrow',advice:'adviser’s one-off rise',none:'no change'};
  ['none','advice','smart'].forEach(k=>{const v=E6_SMART[k],sel=k===s.plan;
   out+=E6_poly(v.slice(0,s.step+1).map((y,i)=>[pl.X(i),pl.Y(y)]),cols[k],sel?3.2:1.6,sel?'':'opacity=".55"');
   v.slice(0,s.step+1).forEach((y,i)=>out+=Ci(pl.X(i),pl.Y(y),sel?5.5:3.5,cols[k],'#fff'));});
  const v=E6_SMART[s.plan][s.step];
  out+=TF(300,346,`${names[s.plan]}: ${v.toFixed(1)}% after ${s.step} pay rise${s.step===1?'':'s'}`,14,cols[s.plan]===C.muted?C.ink:cols[s.plan]);
  out+=TF(300,368,'Increases come out of future raises, so take-home pay never falls.',13,C.muted);
  return {svg:out,phase:'People who would not cut their pay today to save more were happy to commit future raises. Most stayed in the plan, because leaving required an active choice. Only the first and last Save More Tomorrow values are taken directly from the paper; the rest are approximate.'};
 }});

/* ---------------------------------------------------------------- public-goods-game */
// Four players, 20 tokens each round; the pot is multiplied by 1.6 and shared equally (each token returns 0.4).
// Three simulated conditional cooperators match a little less than the group's previous average.
function E6_pgOthers(hist,seed){const r=E6_rng(seed),bias=[-.2,-.4,-.6].map(b=>b-.3*r()),start=[13,10,8];
 const out=[];for(let t=0;t<=hist.length;t++){if(t===0){out.push(start.slice());continue}
  const prev=out[t-1],avg=(prev.reduce((a,b)=>a+b,0)+hist[t-1])/4;out.push(prev.map((_,i)=>clamp(Math.round(.9*avg+bias[i]),0,20)))}
 return out;}
const E6_pgPub=t=>47-35*t/9; // stylised no-punishment decay, % of endowment (Fehr & Gächter 2000; Ledyard 1995)
SCENE({id:'public-goods-game',name:'The public-goods game',tag:'Play ten rounds with three others',
 definition:'In a public-goods game each player chooses how much to put into a common pot that is multiplied and shared equally; contributing helps the group but costs the contributor.',
 example:'Each token you put in returns only 0.4 to you but 1.6 to the group, so the group does best if everyone gives everything, and each person does best by giving nothing.',
 desc:'Ten rounds with three simulated players who cooperate conditionally. Your contributions and theirs are plotted as a share of the 20-token endowment, beside the typical decline in lab experiments.',
 research:'Ledyard (1995). Public goods: a survey of experimental research. Handbook of Experimental Economics. Fischbacher, Gächter & Fehr (2001), Economics Letters 71: most people are conditional cooperators. Fehr & Gächter (2000), AER 90. Contributions start near half and decay, a robust pattern.',
 dur:12,hint:'Set your contribution and press Contribute, ten times. The other three players are simulated.',
 init:()=>({seed:4,c:10,hist:[]}),
 watch(p){const n=Math.min(10,Math.floor(p*11)),hist=[];for(let t=0;t<n;t++){const o=E6_pgOthers(hist,4)[t];hist.push(clamp(Math.round(o.reduce((a,b)=>a+b,0)/3),0,20))}return {seed:4,c:10,hist,sim:true}},
 ui:[{range:'c',label:'Your contribution this round',min:0,max:20,step:1,get:s=>s.c,act:'c',show:v=>v+' of 20 tokens'},{b:'Contribute',act:'go'}],
 on:{c(s,v){s.c=Number(v);return 'keep'},go(s){if(s.hist.length>=10)return 'keep';s.hist.push(s.c);AUDIO.tone(520,{dur:.08,gain:.06});return 'keep'}},
 draw(s){
  let out=heading('Public goods: ten rounds, four players',26);
  const others=E6_pgOthers(s.hist,s.seed),t=s.hist.length;
  const pl=E6_plot(70,54,330,220,[.5,10.5],[0,100],{xt:[[1,'1'],[5,'5'],[10,'10']],yt:[[0,'0%'],[50,'50%'],[100,'100%']],xl:'round',yl:'share of 20 tokens given'});
  out+=pl.svg;
  out+=E6_poly(range(10).map(i=>[pl.X(i+1),pl.Y(E6_pgPub(i))]),C.muted,2,'stroke-dasharray="6 4"');
  out+=E6_poly(range(t).map(i=>[pl.X(i+1),pl.Y(others[i].reduce((a,b)=>a+b,0)/3/20*100)]),C.coral,2.4);
  out+=E6_poly(s.hist.map((c,i)=>[pl.X(i+1),pl.Y(c/20*100)]),C.blue,2.6);
  s.hist.forEach((c,i)=>out+=Ci(pl.X(i+1),pl.Y(c/20*100),4.5,C.blue,'#fff'));
  out+=TF(420,80,s.sim?'simulated you':'you',13,C.blue,'start')+TF(420,100,'others (simulated)',13,C.coral,'start')+TF(420,120,'typical lab result',13,C.muted,'start');
  let mine=0;s.hist.forEach((c,i)=>{const pot=c+others[i].reduce((a,b)=>a+b,0);mine+=20-c+.4*pot});
  const free=s.hist.reduce((a,c,i)=>a+20+.4*others[i].reduce((x,y)=>x+y,0),0);
  out+=R(415,150,165,92,C.pale,'none',8)+TF(497,172,`round ${Math.min(t+1,10)} of 10`,13,C.muted)+TF(497,196,`your tokens: ${Math.round(mine)}`,14,C.ink)+TF(497,220,`if you gave 0: ${Math.round(free)}`,13,C.muted);
  if(t<10){const o=others[t];out+=TF(300,334,`This round the others will give ${o.join(', ')} tokens`,13,C.muted)}
  out+=T(300,360,t>=10?'Ten rounds done. Reset to play again.':'Giving 1 token costs you 1 and returns you 0.4.',14,C.ink);
  return {svg:out,phase:'The simulated players match a little less than the group gave last round, as many real conditional cooperators do. When anyone holds back, the others follow and giving drifts down: the typical lab pattern starts near half and falls towards 10% by round ten.'};
 }});

// Stylised shapes after Fehr & Gächter (2000): partner = same group throughout, stranger = regrouped every round.
const E6_FG={stranger:{none:[45,10],pun:[52,58]},partner:{none:[55,20],pun:[62,90]}};
SCENE({id:'public-goods-game-punishment',name:'Cooperation with punishment',tag:'Fehr & Gächter (2000)',
 definition:'Altruistic punishment is paying a cost to reduce the earnings of someone who did not cooperate, with no chance of benefiting yourself.',
 example:'Players paid 1 token to remove 3 from free riders, even in the last round and when they would never meet them again.',
 desc:'Average contributions over ten rounds with and without the option to punish, for fixed groups (partners) and reshuffled groups (strangers). Shapes are stylised from the published figures.',
 research:'Fehr, E. & Gächter, S. (2000). Cooperation and punishment in public goods experiments. American Economic Review 90, 980–994; Fehr & Gächter (2002), Nature 415. Replicated widely; the effect is weaker or reversed where antisocial punishment is common (next scene). Values here are approximate.',
 dur:9,hint:'Switch between strangers and partners, and step through the rounds.',
 init:()=>({who:'stranger',round:10}),
 watch(p){return {who:p<.5?'stranger':'partner',round:Math.max(1,Math.round(1+9*((p*2)%1)))}},
 ui:[{choose:[['stranger','Strangers'],['partner','Partners']],label:'Groups',get:s=>s.who,act:'who'},{range:'round',label:'Round',min:1,max:10,step:1,get:s=>s.round,act:'round'}],
 on:{who(s,v){s.who=v;return 'keep'},round(s,v){s.round=Number(v);return 'keep'}},
 draw(s){
  let out=heading('Contributions with and without punishment',26);
  const pl=E6_plot(70,56,380,220,[.5,10.5],[0,100],{xt:[[1,'1'],[5,'5'],[10,'10']],yt:[[0,'0%'],[50,'50%'],[100,'100%']],xl:'round',yl:'share of tokens given'});
  out+=pl.svg;const g=E6_FG[s.who],lin=(a,i)=>a[0]+(a[1]-a[0])*(i-1)/9;
  [['none',C.coral,'no punishment'],['pun',C.green,'with punishment']].forEach(([k,col,lab],j)=>{
   out+=E6_poly(range(s.round).map(i=>[pl.X(i+1),pl.Y(lin(g[k],i+1))]),col,2.8);
   out+=Ci(pl.X(s.round),pl.Y(lin(g[k],s.round)),5.5,col,'#fff');
   out+=TF(466,100+j*44,lab,13,col,'start')+TBF(466,118+j*44,`${Math.round(lin(g[k],s.round))}%`,14,col,'start');});
  out+=T(300,330,s.who==='stranger'?'Strangers: no future to protect, yet punishment still raises giving.':'Partners: with punishment, giving climbs towards everything.',14,C.ink);
  out+=TF(300,356,'Stylised shapes, approximate values',13,C.muted);
  return {svg:out,phase:'Without punishment, contributions decline in every version. Once players can pay to fine free riders, many do, and cooperation holds or rises. Because strangers never meet again, the punishers cannot be investing in future cooperation for themselves: Fehr and Gächter called it altruistic punishment.'};
 }});

// Herrmann, Thöni & Gächter (2008): mean contributions (of 20) with punishment, approximate, from their figure.
const E6_CITY=[['Boston',18],['Copenhagen',17.7],['Zurich',16.2],['Nottingham',15],['Chengdu',14.3],['Seoul',13],['Minsk',10.9],['Istanbul',7.6],['Muscat',6.9],['Athens',5.7]];
SCENE({id:'public-goods-game-antisocial',name:'Antisocial punishment',tag:'Sixteen cities',
 definition:'Antisocial punishment is punishing people who contributed generously, often as revenge for having been punished oneself.',
 example:'In some cities high contributors were fined almost as often as free riders, and cooperation never took off.',
 desc:'Mean contributions in the punishment version of the game in a selection of the 16 cities studied, out of 20 tokens. Press a city.',
 research:'Herrmann, B., Thöni, C. & Gächter, S. (2008). Antisocial punishment across societies. Science 319, 1362–1367. Antisocial punishment was more common where norms of civic cooperation and the rule of law were weaker. Values approximate.',
 dur:9,hint:'Press a city’s bar.',
 init:()=>({pick:0}),
 watch(p){return {pick:Math.min(9,Math.floor(p*10))}},
 on:{pick(s,v){s.pick=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('With punishment allowed: mean tokens given (of 20)',26);
  const x0=150,sc=19;
  [0,10,20].forEach(v=>out+=L(x0+v*sc,46,x0+v*sc,350,C.grid,1)+TF(x0+v*sc,364,String(v),13,C.muted));
  E6_CITY.forEach(([n,v],i)=>{const y=50+i*30,sel=s.pick===i,col=v>=13?C.green:v>=9?C.amber:C.coral;
   out+=hit(X,'pick',i,`${n}: about ${v} tokens`,R(20,y-2,560,27,sel?C.pale:'#fff','none',4)+TF(x0-8,y+16,n,13,C.ink,'end')+R(x0,y+2,v*sc,18,col,'none',3)+TF(x0+v*sc+6,y+16,`≈${v}`,13,C.ink,'start'))});
  const [n,v]=E6_CITY[s.pick];
  return {svg:out,phase:`${n}: about ${v} of 20 tokens. Where generous contributors were also punished, threats lost their force and contributions stayed low. The same rules produced very different outcomes depending on local norms (values approximate).`};
 }});

/* ---------------------------------------------------------------- nudges */
SCENE({id:'nudges',name:'The power of defaults',tag:'Automatic pension enrolment',
 definition:'A nudge changes how a choice is presented without forbidding options or changing incentives; a default is the option you get if you do nothing.',
 example:'When a firm switched new employees from opting in to the pension plan to being enrolled automatically, participation jumped.',
 desc:'One hundred new employees under opt-in or automatic enrolment, coloured by whether they are in the pension plan.',
 research:'Madrian, B. C. & Shea, D. F. (2001). The power of suggestion: inertia in 401(k) participation and savings behavior. QJE 116, 1149–1187: participation 37% under opt-in (employees with 3–15 months’ tenure) against 86% under automatic enrolment. Thaler & Sunstein (2008), Nudge. The default effect is among the most robust in behavioural economics; the UK’s 2012 auto-enrolment raised workplace pension membership sharply.',
 dur:8,hint:'Switch the default and watch who ends up saving.',
 init:()=>({def:'auto'}),
 watch(p){return {def:p<.5?'optin':'auto'}},
 ui:[{choose:[['optin','Opt in (ask to join)'],['auto','Automatic (ask to leave)']],label:'Default',get:s=>s.def,act:'def'}],
 on:{def(s,v){s.def=v;return 'keep'}},
 draw(s){
  let out=heading('Same plan, same choices, different default',26);
  const share=s.def==='auto'?86:37,r=E6_rng(21),order=shuffled(range(100),E6_mix(9));
  const inSet=new Set(order.slice(0,share));
  range(100).forEach(i=>{const x=70+(i%20)*23,y=70+Math.floor(i/20)*44;out+=E6_person(x,y,inSet.has(i)?C.green:C.line,8)});r();
  out+=TBF(300,306,`${share} of 100 in the pension plan`,18,C.green);
  out+=TF(300,332,s.def==='auto'?'Enrolled unless they opt out, at the 3% default rate.':'Must fill in a form to join.',14,C.ink);
  out+=TF(300,356,'Madrian & Shea (2001): 37% under opt-in, 86% under automatic enrolment',13,C.muted);
  return {svg:out,phase:'Nothing was forbidden and no money changed: only what happened if you did nothing. Inertia worked both ways: most automatically enrolled employees also stayed at the low 3% default contribution, so the default can lock people into saving too little.'};
 }});

SCENE({id:'nudges-shrinkage',name:'How big are nudge effects?',tag:'Publication bias and scale',
 definition:'Publication bias is the tendency for studies with large, significant effects to be published while small or null results stay in the drawer, inflating average effects in the literature.',
 example:'Nudges reported in academic journals raised take-up by 8.7 percentage points on average; the same kinds of nudges run at scale by government nudge units raised it by 1.4.',
 desc:'Two views of the evidence. Nudge units against academic papers (DellaVigna & Linos 2022), and a large meta-analysis before and after correcting for publication bias (Mertens et al. 2022; Maier et al. 2022).',
 research:'DellaVigna, S. & Linos, E. (2022). RCTs to scale: comprehensive evidence from two nudge units. Econometrica 90, 81–116. Mertens et al. (2022), PNAS 119: d = 0.43. Maier et al. (2022), PNAS 119: after correcting for publication bias, no evidence for an overall effect; some categories (such as defaults) may still work. Szaszi et al. (2022), PNAS.',
 dur:9,hint:'Switch between the two views, and turn the correction on and off.',
 init:()=>({view:'units',fix:false}),
 watch(p){return p<.5?{view:'units',fix:false}:{view:'meta',fix:p>.75}},
 ui:[{choose:[['units','Journals against nudge units'],['meta','Meta-analysis']],label:'View',get:s=>s.view,act:'view'},{b:'Correct for publication bias',act:'fix'}],
 on:{view(s,v){s.view=v;return 'keep'},fix(s){s.fix=!s.fix;return 'keep'}},
 draw(s){
  let out=heading(s.view==='units'?'Average effect of a nudge on take-up':'Average nudge effect size (Cohen’s d)',26);
  if(s.view==='units'){const base=300,sc=22;
   [[8.7,'academic journals','26 papers',C.blue],[1.4,'nudge units at scale','126 trials',C.green]].forEach(([v,l,n,col],i)=>{const x=160+i*180;
    out+=R(x,base-v*sc,110,v*sc,col,'none',4)+TBF(x+55,base-v*sc-8,`${v} pts`,16,col)+TF(x+55,base+20,l,13,C.ink)+TF(x+55,base+38,n,12,C.muted)});
   out+=L(130,base,470,base,C.line,1.5);
   out+=T(300,368,'Small trials with big effects were the ones that got published.',14,C.ink);}
  else{const base=290,sc=320;
   const bars=[[.43,'reported average','Mertens et al. 2022',C.blue],[s.fix?.04:null,'after correction','Maier et al. 2022',C.coral]];
   bars.forEach(([v,l,src,col],i)=>{const x=160+i*180;
    if(v===null){out+=R(x,base-40,110,40,'#fff',C.grid,4,'stroke-dasharray="5 4"')+TF(x+55,base-14,'press Correct',12,C.muted)}
    else out+=R(x,base-v*sc,110,Math.max(3,v*sc),col,'none',4)+TBF(x+55,base-v*sc-8,v<.1?'close to 0':`d = ${v}`,16,col);
    out+=TF(x+55,base+20,l,13,C.ink)+TF(x+55,base+38,src,12,C.muted)});
   out+=L(130,base,470,base,C.line,1.5);
   out+=T(300,368,s.fix?'Corrected: no clear average effect; defaults may be an exception.':'440 effect sizes from 212 studies.',14,C.ink);}
  return {svg:out,phase:s.view==='units'?'Government nudge units ran 126 trials and reported every one. Their average effect was real but about a sixth of the published academic average, mostly because small academic studies with large effects were more likely to be published.':'Corrected for the shortage of small, null studies, the average nudge effect shrinks to about zero. That does not mean no nudge works: defaults such as automatic enrolment stand up well. It means a typical nudge should not be expected to do much (the corrected bar is drawn near zero, not a precise value).'};
 }});

// Johnson & Goldstein (2003): effective consent rates.
const E6_ORG=[['Denmark',4.25,'in'],['Germany',12,'in'],['UK',17.17,'in'],['Netherlands',27.5,'in'],['Sweden',85.9,'out'],['Belgium',98,'out'],['Portugal',99.64,'out'],['France',99.91,'out'],['Hungary',99.97,'out'],['Austria',99.98,'out']];
SCENE({id:'nudges-organ',name:'Organ donation defaults',tag:'Consent is not donation',
 definition:'Presumed consent (opt-out) treats everyone as an organ donor unless they register a refusal; explicit consent (opt-in) requires people to register.',
 example:'Germany (opt-in) had about 12% registered consent; neighbouring Austria (opt-out) had over 99%.',
 desc:'Effective consent rates in ten European countries in the early 2000s, opt-in against opt-out. A second view says what happened to actual donations.',
 research:'Johnson, E. J. & Goldstein, D. (2003). Do defaults save lives? Science 302, 1338–1339. Abadie & Gay (2006), J. Health Econ. 25: presumed consent associated with roughly 25–30% higher donation rates, other things equal: much less than the consent gap. Arshad, Anderson & Sharif (2019): mixed evidence after Wales switched to opt-out in 2015.',
 dur:9,hint:'Press a country, and switch to the view of what happened to actual donations.',
 init:()=>({view:'consent',pick:1}),
 watch(p){return {view:p<.6?'consent':'donation',pick:p<.6?1:9}},
 ui:[{choose:[['consent','Consent registered'],['donation','Actual donations']],label:'View',get:s=>s.view,act:'view'}],
 on:{view(s,v){s.view=v;return 'keep'},pick(s,v){s.pick=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading(s.view==='consent'?'Share who are organ donors by default or by choice':'Consent gap against donation gap',26);
  if(s.view==='consent'){const x0=150,sc=3.6;
   [0,50,100].forEach(v=>out+=L(x0+v*sc,46,x0+v*sc,350,C.grid,1)+TF(x0+v*sc,364,v+'%',13,C.muted));
   E6_ORG.forEach(([n,v,k],i)=>{const y=50+i*30,col=k==='in'?C.coral:C.green,sel=s.pick===i;
    out+=hit(X,'pick',i,`${n}: ${v}% (${k==='in'?'opt-in':'opt-out'})`,R(20,y-2,560,27,sel?C.pale:'#fff','none',4)+TF(x0-8,y+16,n,13,C.ink,'end')+R(x0,y+2,v*sc,18,col,'none',3)+TF(Math.min(x0+v*sc+6,520),y+16,`${v}%`,13,C.ink,'start'))});
   out+=TF(560,104,'opt-in',13,C.coral,'end')+TF(560,134,'opt-out',13,C.green,'end');}
  else{out+=R(70,80,200,200,C.pale,'none',10)+TBF(170,120,'Consent',16,C.ink)+TBF(170,170,'≈ 60 to 90',22,C.blue)+TF(170,194,'percentage-point gap',13,C.ink)+TF(170,240,'Johnson & Goldstein',13,C.muted)+TF(170,258,'(2003)',13,C.muted);
   out+=R(330,80,200,200,C.amberp,'none',10)+TBF(430,120,'Donations',16,C.ink)+TBF(430,170,'≈ 25–30%',22,C.amber)+TF(430,194,'higher, other things equal',13,C.ink)+TF(430,240,'Abadie & Gay',13,C.muted)+TF(430,258,'(2006)',13,C.muted);
   out+=T(300,322,'Families, hospitals and logistics decide most outcomes, not the register.',14,C.ink);}
  const [n,v,k]=E6_ORG[s.pick];
  return {svg:out,phase:s.view==='consent'?`${n}: ${v}% (${k==='in'?'opt-in':'opt-out'}). The default nearly decides the register. But a registered “yes” is not a donation.`:'Opt-out countries do tend to have more donors, but the difference is far smaller than the gap in consent rates, and families are usually still asked. A default changes a form; outcomes depend on the whole system.'};
 }});

/* ---------------------------------------------------------------- market-experiments */
// Induced values (Smith 1962 style). Buyers' values and sellers' costs in pounds; equilibrium Q* = 5, P* ≈ £2.30.
const E6_VAL=[3.2,3.0,2.8,2.6,2.4,2.2],E6_COST=[1.4,1.6,1.8,2.0,2.2,2.4];
const E6_ASK=p=>Math.round((2.30+.70*Math.pow(.55,p))*100)/100;
function E6_periodTrades(p,seed){const r=E6_rng(seed*13+p);return range(4).map(()=>Math.round((2.30+.9*Math.pow(.55,p)*(r()-.45)*2)*100)/100)}
SCENE({id:'market-experiments',name:'Trading in a double auction',tag:'You are a buyer',
 definition:'In a double auction buyers call out bids and sellers call out asks at the same time, and a trade happens whenever a bid meets an ask.',
 example:'Vernon Smith gave students private values and costs on cards; within a few rounds prices settled close to where his supply and demand curves crossed.',
 desc:'Five trading periods. You may buy one unit worth £2.80 to you: set a bid, and you trade if it meets the lowest ask. Simulated traders’ prices are plotted with yours against the equilibrium price.',
 research:'Smith, V. L. (1962). An experimental study of competitive market behavior. Journal of Political Economy 70, 111–137. Smith (Nobel 2002). Convergence to competitive equilibrium in double auctions is one of the most replicated results in experimental economics. The other traders here are simulated.',
 dur:12,hint:'Set your bid and press Bid, once per period. Your unit is worth £2.80 to you; you keep the difference.',
 init:()=>({p:0,bid:2.5,hist:[],seed:2}),
 watch(p){const n=Math.min(5,Math.floor(p*6));return {p:n,bid:2.5,hist:range(n).map(i=>({bid:E6_ASK(i),ask:E6_ASK(i)})),seed:2,sim:true}},
 ui:[{range:'bid',label:'Your bid',min:1.5,max:3.2,step:.05,get:s=>s.bid,act:'bid',show:v=>E6_money(v)},{b:'Bid',act:'go'}],
 on:{bid(s,v){s.bid=Number(v);return 'keep'},go(s){if(s.p>=5)return 'keep';const a=E6_ASK(s.p);s.hist.push({bid:s.bid,ask:a});if(s.bid>=a)AUDIO.tone(880,{dur:.1,gain:.07});s.p++;return 'keep'}},
 draw(s){
  let out=heading('A double auction: prices find their level',26);
  const pl=E6_plot(70,56,360,220,[.5,5.5],[1.8,3.2],{xt:[[1,'1'],[2,'2'],[3,'3'],[4,'4'],[5,'5']],yt:[[2,'£2.00'],[2.5,'£2.50'],[3,'£3.00']],xl:'trading period',yl:'trade price'});
  out+=pl.svg+R(70,pl.Y(2.4),360,pl.Y(2.2)-pl.Y(2.4),C.greenp,'none',0)+L(70,pl.Y(2.3),430,pl.Y(2.3),C.green,1.5,'stroke-dasharray="6 4"')+TF(425,pl.Y(2.3)-6,'equilibrium',12,C.green,'end');
  for(let i=0;i<s.p;i++){E6_periodTrades(i,s.seed).forEach((v,j)=>out+=Ci(pl.X(i+1)-12+j*8,pl.Y(clamp(v,1.8,3.2)),3.5,C.coral))}
  let gain=0;s.hist.forEach((h,i)=>{const ok=h.bid>=h.ask;if(ok)gain+=2.8-h.ask;out+=Ci(pl.X(i+1)+22,pl.Y(ok?h.ask:clamp(h.bid,1.8,3.2)),6,ok?C.blue:'#fff',C.blue)});
  out+=TF(445,80,'coral: other trades',13,C.coral,'start')+TF(445,100,s.sim?'blue: simulated you':'blue: your trades',13,C.blue,'start')+TF(445,120,'(hollow: no trade)',12,C.muted,'start');
  if(s.p<5)out+=R(445,150,140,74,C.pale,'none',8)+TF(515,172,`period ${s.p+1} of 5`,13,C.muted)+TF(515,196,`lowest ask ${E6_money(E6_ASK(s.p))}`,13,C.ink)+TF(515,214,`your bid ${E6_money(s.bid)}`,13,C.blue);
  out+=R(445,234,140,44,C.greenp,'none',8)+TF(515,262,`your gain ${E6_money(gain)}`,14,C.green);
  out+=T(300,340,'No one knows the curves, yet prices close in on the equilibrium.',14,C.ink);
  return {svg:out,phase:'Each trader knows only their own value or cost. Early prices scatter; within a few periods they cluster near the price where supply meets demand. Smith’s surprise was how few traders this needed: no perfect information, no price-taking auctioneer.'};
 }});

function E6_eq(sd,ss){const v=E6_VAL.map(x=>x+sd),c=E6_COST.map(x=>x+ss);let q=0;while(q<6&&v[q]>=c[q])q++;
 const lo=Math.max(q?c[q-1]:0,q<6?v[q]:0),hi=Math.min(q?v[q-1]:9,q<6?c[q]:9);let sur=0;for(let i=0;i<q;i++)sur+=v[i]-c[i];return {v,c,q,lo,hi,sur}}
SCENE({id:'market-experiments-curves',name:'Induced supply and demand',tag:'Values and costs on cards',
 definition:'In an induced-value experiment the researcher gives each buyer a value and each seller a cost, so the supply and demand curves are known exactly even though no trader sees them.',
 example:'Six buyers valuing a unit from £2.20 to £3.20 and six sellers with costs from £1.40 to £2.40 give five trades at a price between £2.20 and £2.40.',
 desc:'Step demand from buyers’ values and step supply from sellers’ costs. Shift either curve and read the equilibrium quantity, price range and total surplus.',
 research:'Smith (1962); Plott & Smith (eds, 2008), Handbook of Experimental Economics Results. Induced-value methods let experiments test market theory against known curves.',
 dur:9,hint:'Shift demand or supply and watch the quantity, price range and surplus.',
 init:()=>({sd:0,ss:0}),
 watch(p){return {sd:Math.round(Math.sin(p*Math.PI*2)*4)/10,ss:0}},
 ui:[{range:'sd',label:'Shift demand',min:-.6,max:.6,step:.1,get:s=>s.sd,act:'sd',show:v=>(v>=0?'+':'−')+E6_money(Math.abs(v))},{range:'ss',label:'Shift supply',min:-.6,max:.6,step:.1,get:s=>s.ss,act:'ss',show:v=>(v>=0?'+':'−')+E6_money(Math.abs(v))}],
 on:{sd(s,v){s.sd=Number(v);return 'keep'},ss(s,v){s.ss=Number(v);return 'keep'}},
 draw(s){
  const e=E6_eq(s.sd,s.ss);let out=heading('Step curves from values and costs',26);
  const pl=E6_plot(70,54,340,240,[0,6],[.6,3.8],{xt:[[0,'0'],[2,'2'],[4,'4'],[6,'6']],yt:[[1,'£1'],[2,'£2'],[3,'£3']],xl:'units traded',yl:'price'});
  out+=pl.svg;
  const step=(arr,col)=>{let d='';arr.forEach((v,i)=>{d+=(i?' L':'M')+fmt(pl.X(i))+' '+fmt(pl.Y(clamp(v,.6,3.8)))+' L'+fmt(pl.X(i+1))+' '+fmt(pl.Y(clamp(v,.6,3.8)))});return P(d,col,3)};
  for(let i=0;i<e.q;i++)out+=R(pl.X(i)+1,pl.Y(clamp(e.v[i],.6,3.8)),pl.X(1)-pl.X(0)-2,pl.Y(clamp(e.c[i],.6,3.8))-pl.Y(clamp(e.v[i],.6,3.8)),C.greenp,'none',0);
  out+=step(e.v,C.blue)+step(e.c,C.coral);
  if(e.lo<=e.hi)out+=R(70,pl.Y(Math.min(3.8,e.hi)),340,Math.max(2,pl.Y(Math.max(.6,e.lo))-pl.Y(Math.min(3.8,e.hi))),C.amber,'none',0,'opacity=".25"');
  out+=TF(425,80,'demand (values)',13,C.blue,'start')+TF(425,100,'supply (costs)',13,C.coral,'start')+TF(425,120,'green: surplus',13,C.green,'start');
  out+=R(425,150,160,110,C.pale,'none',8)+TF(505,174,`quantity: ${e.q}`,14,C.ink)+TF(505,200,`price ${E6_money(e.lo)}–${E6_money(e.hi)}`,14,C.amber)+TF(505,226,`surplus ${E6_money(e.sur)}`,14,C.green);
  out+=T(300,362,'Trades happen only where a value exceeds a cost.',14,C.ink);
  return {svg:out,phase:'Each step is one trader. Units are worth trading only where a buyer values them more than a seller’s cost; the green area is the surplus those trades create. Equilibrium is a range here because the curves are steps.'};
 }});

// Zero-intelligence traders (Gode & Sunder 1993) in a continuous double auction with one unit each.
// Eight buyers and eight sellers: the extra two on each side are extramarginal (they should not trade); max surplus is still £5.
const E6_ZV=[3.2,3.0,2.8,2.6,2.4,2.2,1.8,1.4],E6_ZC=[1.4,1.6,1.8,2.0,2.2,2.4,2.8,3.2];
function E6_zi(kind,seed){const r=E6_rng(seed),bLeft=E6_ZV.map((v,i)=>i),sLeft=E6_ZC.map((c,i)=>i);let bb=null,ba=null,sur=0;const prices=[];
 for(let step=0;step<400&&bLeft.length&&sLeft.length;step++){
  if(r()<.5){const k=bLeft[Math.floor(r()*bLeft.length)],v=E6_ZV[k],bid=kind==='zic'?r()*v:r()*4;
   if(ba&&bid>=ba.p){sur+=v-E6_ZC[ba.k];prices.push(ba.p);bLeft.splice(bLeft.indexOf(k),1);sLeft.splice(sLeft.indexOf(ba.k),1);bb=ba=null}else if(!bb||bid>bb.p)bb={p:bid,k}}
  else{const k=sLeft[Math.floor(r()*sLeft.length)],c=E6_ZC[k],ask=kind==='zic'?c+r()*(4-c):r()*4;
   if(bb&&ask<=bb.p){sur+=E6_ZV[bb.k]-c;prices.push(bb.p);sLeft.splice(sLeft.indexOf(k),1);bLeft.splice(bLeft.indexOf(bb.k),1);bb=ba=null}else if(!ba||ask<ba.p)ba={p:ask,k}}}
 return {eff:sur/5,prices}}
const E6_ziAvg=kind=>{let t=0;for(let i=1;i<=50;i++)t+=E6_zi(kind,i).eff;return t/50};
SCENE({id:'market-experiments-efficiency',name:'Markets with “zero intelligence”',tag:'Gode & Sunder (1993)',
 definition:'Allocative efficiency is the share of the maximum possible gains from trade that a market actually achieves.',
 example:'Traders who bid at random, but never at a loss, captured almost all the available surplus: the market rules did most of the work.',
 desc:'A double auction run with simulated traders who bid and ask at random. Choose whether they are constrained never to trade at a loss, and run new random markets; efficiency is shown for this run and averaged over 50.',
 research:'Gode, D. K. & Sunder, S. (1993). Allocative efficiency of markets with zero-intelligence traders. Journal of Political Economy 101, 119–137: constrained random traders reached about 97–99% efficiency, close to human traders. Later work (Cliff & Bruten 1997) showed prices converge less well than efficiency suggests.',
 dur:10,hint:'Switch between constrained and unconstrained random traders, and press New market for another random run.',
 init:()=>({kind:'zic',seed:1}),
 watch(p){return {kind:p<.5?'zic':'ziu',seed:1+Math.floor(p*6)}},
 ui:[{choose:[['zic','Random, never at a loss'],['ziu','Random, any price']],label:'Traders',get:s=>s.kind,act:'kind'},{b:'New market',act:'seed'}],
 on:{kind(s,v){s.kind=v;return 'keep'},seed(s){s.seed++;return 'keep'}},
 draw(s){
  const run=E6_zi(s.kind,s.seed),avg=E6_ziAvg(s.kind);let out=heading('Random traders, real market rules',26);
  const pl=E6_plot(70,56,330,200,[.5,Math.max(6,run.prices.length)+.5],[0,4],{xt:range(Math.max(6,run.prices.length)).map(i=>[i+1,String(i+1)]),yt:[[0,'£0'],[2,'£2'],[4,'£4']],xl:'trade number',yl:'trade price'});
  out+=pl.svg+L(70,pl.Y(2.3),400,pl.Y(2.3),C.green,1.5,'stroke-dasharray="6 4"');
  run.prices.forEach((v,i)=>out+=Ci(pl.X(i+1),pl.Y(v),5,s.kind==='zic'?C.blue:C.coral));
  out+=E6_poly(run.prices.map((v,i)=>[pl.X(i+1),pl.Y(v)]),s.kind==='zic'?C.blue:C.coral,1.5);
  const bar=(y,lab,v,col)=>R(420,y,120,22,'#fff',C.grid,4)+R(420,y,120*clamp(v,0,1),22,col,'none',4)+TF(420,y-6,lab,13,C.ink,'start')+TF(548,y+16,`${Math.round(v*100)}%`,13,C.ink,'start');
  out+=bar(84,'this run',run.eff,s.kind==='zic'?C.blue:C.coral)+bar(140,'average of 50 runs',avg,s.kind==='zic'?C.blue:C.coral)+bar(196,'human traders (≈97%)',.97,C.green);
  out+=T(300,330,s.kind==='zic'?'Never trading at a loss is enough for near-full efficiency.':'Without that rule, loss-making trades waste the surplus.',14,C.ink);
  return {svg:out,phase:'The constrained random traders know nothing and learn nothing, yet the auction rules (better bids replace worse ones; a trade happens when bid meets ask) steer them close to the maximum surplus. Remove the budget constraint and efficiency drops, often a lot. Prices, though, wander far more than humans’ do.'};
 }});

/* ---------------------------------------------------------------- prospect-theory-markets */
// Endowment-effect market: 22 owners and 22 non-owners with the same evenly spread values (£1–£9).
// Owners demand λ × value to sell. Trade volume is the largest k where the k-th highest buyer value ≥ k-th lowest ask.
function E6_volume(lam){const vals=range(22).map(i=>1+8*(i+.5)/22);const own=vals.map(v=>v*lam).sort((a,b)=>a-b),buy=vals.slice().sort((a,b)=>b-a);
 let k=0;while(k<22&&buy[k]>=own[k])k++;return k}
SCENE({id:'prospect-theory-markets',name:'The endowment effect',tag:'Mugs at Cornell',
 definition:'The endowment effect is the tendency to value something more once you own it: people ask more to give up a good than they would pay to get it.',
 example:'Students given a Cornell coffee mug asked a median of about $7 to sell it; students without one offered about $3 to buy it.',
 desc:'A market of 22 owners and 22 non-owners with the same spread of values. Raise owners’ selling ratio (what they ask ÷ what they would pay) and watch trading volume fall from the 11 trades standard theory predicts.',
 research:'Kahneman, Knetsch & Thaler (1990). Experimental tests of the endowment effect and the Coase theorem. Journal of Political Economy 98, 1325–1348: median selling price $7.12 against buying price $2.87; mug markets traded far fewer than the predicted 11 units, while induced-value token markets traded about as predicted. Linked to loss aversion: see Mind In Motion.',
 dur:10,hint:'Move the ratio and switch between tokens with cash value and real mugs.',
 init:()=>({lam:2.5,goods:'mugs'}),
 watch(p){return {lam:1+2*p,goods:p<.2?'tokens':'mugs'}},
 ui:[{choose:[['tokens','Tokens (cash value)'],['mugs','Mugs']],label:'Goods',get:s=>s.goods,act:'goods'},{range:'lam',label:'Owners’ selling ratio',min:1,max:3,step:.1,get:s=>s.lam,act:'lam',show:v=>Number(v).toFixed(1)+'×'}],
 on:{goods(s,v){s.goods=v;return 'keep'},lam(s,v){s.lam=Number(v);return 'keep'}},
 draw(s){
  const lam=s.goods==='tokens'?1:s.lam,vol=E6_volume(lam);let out=heading('Owners ask more than buyers will pay',26);
  const pl=E6_plot(70,56,330,220,[1,3],[0,14],{xt:[[1,'1×'],[1.5,'1.5×'],[2,'2×'],[2.5,'2.5×'],[3,'3×']],yt:[[0,'0'],[5,'5'],[10,'10']],xl:'owners’ selling ratio',yl:'units traded'});
  out+=pl.svg+L(70,pl.Y(11),400,pl.Y(11),C.muted,1.5,'stroke-dasharray="6 4"')+TF(396,pl.Y(11)-6,'predicted 11',12,C.muted,'end');
  out+=E6_poly(range(41).map(i=>{const l=1+i/20;return [pl.X(l),pl.Y(E6_volume(l))]}),C.blue,2.4);
  out+=Ci(pl.X(lam),pl.Y(vol),7,C.blue,'#fff');
  out+=R(pl.X(2.4),pl.Y(4),pl.X(2.6)-pl.X(2.4),pl.Y(1)-pl.Y(4),C.coralp,C.coral,3)+TF(pl.X(2.4)-6,pl.Y(2.2),'mugs,',12,C.coral,'end')+TF(pl.X(2.4)-6,pl.Y(2.2)+14,'observed',12,C.coral,'end');
  out+=R(420,90,160,120,C.pale,'none',8)+TF(500,114,s.goods==='tokens'?'tokens: ratio 1×':`mugs: ratio ${lam.toFixed(1)}×`,13,C.ink)+TBF(500,150,`${vol} trades`,20,C.blue)+TF(500,176,'of 22 possible pairs',13,C.muted)+TF(500,196,'(simulated market)',12,C.muted);
  out+=T(300,334,'Kahneman, Knetsch & Thaler: $7.12 to sell against $2.87 to buy, a ratio of about 2.5',13,C.ink);
  return {svg:out,phase:'If owning a mug did not change its value, half the mugs (11) should change hands, because random allocation gives half the mugs to people who value them less. With tokens of known cash value, that is roughly what happened. With mugs only a handful traded (coral box, approximate), as a large selling ratio predicts; in this simulated market a ratio of 2.5 alone already halves the volume.'};
 }});

SCENE({id:'prospect-theory-markets-plott',name:'Is the endowment effect real?',tag:'Plott & Zeiler (2005)',
 definition:'A procedural control is a feature of an experiment designed to rule out an alternative explanation, such as participants misunderstanding how prices are elicited.',
 example:'With anonymity, training in the price-elicitation mechanism and paid practice rounds, the gap between selling and buying prices for mugs disappeared.',
 desc:'Selling price divided by buying price under the original procedure and under Plott and Zeiler’s full controls, with a card on the later debate.',
 research:'Plott, C. R. & Zeiler, K. (2005). The willingness to pay–willingness to accept gap, the “endowment effect,” subject misconceptions, and experimental procedures. AER 95, 530–545. Isoni, Loomes & Sugden (2011), AER 101: the gap persisted for lotteries under the same controls. Debate continues; ratios here are approximate.',
 dur:9,hint:'Switch between the two procedures, then read the debate card.',
 init:()=>({proc:'ctrl'}),
 watch(p){return {proc:p<.4?'kkt':p<.8?'ctrl':'debate'}},
 ui:[{choose:[['kkt','Original procedure'],['ctrl','Full controls'],['debate','The debate']],label:'Show',get:s=>s.proc,act:'proc'}],
 on:{proc(s,v){s.proc=v;return 'keep'}},
 draw(s){
  let out=heading('Selling price ÷ buying price for mugs',26);
  if(s.proc==='debate'){
   out+=R(40,56,250,170,C.greenp,'none',10)+TBF(165,84,'Gap is procedural',15,C.green);
   ['Misunderstanding the elicitation','method inflates selling prices.','Train people and use anonymity,','and the mug gap goes away.','(Plott & Zeiler 2005)'].forEach((t,i)=>out+=TF(165,114+i*22,t,13,C.ink));
   out+=R(310,56,250,170,C.amberp,'none',10)+TBF(435,84,'Gap is real, sometimes',15,C.amber);
   ['Under the same controls the gap','persisted for lotteries (Isoni,','Loomes & Sugden 2011). It varies','with goods and framing; loss','aversion is one explanation.'].forEach((t,i)=>out+=TF(435,114+i*22,t,13,C.ink));
   out+=T(300,272,'Both sides agree that procedures matter. How much is still argued.',14,C.ink);}
  else{const base=290,sc=70,bars=[['original procedure',2.5,s.proc==='kkt'],['full controls',1.0,s.proc==='ctrl']];
   out+=L(130,base,470,base,C.line,1.5)+L(130,base-sc,470,base-sc,C.green,1.5,'stroke-dasharray="6 4"')+TF(474,base-sc+4,'1 = no gap',12,C.green,'start');
   bars.forEach(([l,v,sel],i)=>{const x=170+i*170;out+=R(x,base-v*sc,110,v*sc,sel?C.blue:C.line,'none',4)+TBF(x+55,base-v*sc-8,`≈${v.toFixed(1)}×`,16,sel?C.blue:C.muted)+TF(x+55,base+20,l,13,C.ink)});
   out+=T(300,340,s.proc==='kkt'?'Kahneman, Knetsch & Thaler (1990): sellers asked about 2.5 times as much.':'Plott & Zeiler (2005): no significant gap for mugs.',14,C.ink);}
  return {svg:out,phase:'Whether the endowment effect is a basic feature of preferences or partly a by-product of how experiments are run is still debated. The careful answer is that the gap is real in many settings but smaller and less universal than the first studies suggested.'};
 }});

// Selling winners or losers. Each round: two shares, one up and one down since you bought them, equally likely to rise next.
const E6_DISP=[[20,-20],[10,-30],[35,-5],[5,-15],[25,-25],[15,-10]];
SCENE({id:'prospect-theory-markets-disposition',name:'Selling winners, keeping losers',tag:'The disposition effect',
 definition:'The disposition effect is investors’ tendency to sell shares that have risen since purchase and hold on to shares that have fallen.',
 example:'US investors sold gains about 1.5 times as readily as losses, even though selling losers would usually have saved tax.',
 desc:'Six rounds. You hold two shares, one up and one down since you bought them, and must sell one; both are equally likely to rise next. Your share of winners sold appears beside the published rates.',
 research:'Shefrin & Statman (1985), Journal of Finance 40. Odean, T. (1998). Are investors reluctant to realize their losses? Journal of Finance 53, 1775–1798: proportion of gains realised 0.148 against losses 0.098. Explained by prospect theory and mental accounting, though other accounts exist (Barberis & Xiong 2009).',
 dur:10,hint:'Press Sell the winner or Sell the loser in each round. The future prices are not simulated; only your choices are recorded, in this page.',
 init:()=>({t:0,res:[]}),
 watch(p){const n=Math.min(6,Math.floor(p*7));return {t:n,res:range(n).map(i=>i%3!==2?'win':'lose'),sim:true}},
 ui:[{b:'Sell the winner',act:'sell',arg:'win'},{b:'Sell the loser',act:'sell',arg:'lose'}],
 on:{sell(s,v){if(s.t>=6)return 'keep';s.res.push(v);s.t++;return 'keep'}},
 draw(s,f,X){
  let out=heading('You must sell one share. Which?',26);
  if(s.t<6){const [g,l]=E6_DISP[s.t];out+=TF(300,56,`Round ${s.t+1} of 6 · both equally likely to rise next`,13,C.muted);
   out+=E6_btn(X,'sell','win','Sell the winner',60,70,220,78,['Share A',`up ${g}% since you bought`],{fill:C.greenp,stroke:C.green,bold:true});
   out+=E6_btn(X,'sell','lose','Sell the loser',320,70,220,78,['Share B',`down ${-l}% since you bought`],{fill:C.coralp,stroke:C.coral,bold:true});}
  else out+=R(90,70,420,78,C.pale,'none',10)+TBF(300,104,'Six rounds done',16,C.ink)+TF(300,128,'Reset to try again.',13,C.muted);
  const w=s.res.filter(x=>x==='win').length,n=s.res.length;
  const base=310,sc=110;
  out+=L(120,base,480,base,C.line,1.5);
  const bar=(x,v,lab,sub,col)=>R(x,base-v*sc,100,Math.max(2,v*sc),col,'none',4)+TBF(x+50,base-v*sc-8,`${Math.round(v*100)}%`,14,col)+TF(x+50,base+18,lab,13,C.ink)+TF(x+50,base+34,sub,12,C.muted);
  out+=bar(150,n?w/n:0,s.sim?'simulated':'your choices','winners sold',C.blue);
  out+=bar(350,.148/(.148+.098),'Odean (1998)','gains ÷ (gains + losses)',C.amber);
  return {svg:out,phase:'Odean’s investors realised 14.8% of their paper gains but only 9.8% of their paper losses, so about 60% of the relative weight fell on selling winners. A purely forward-looking investor treats both shares the same, and in the US, tax favours selling the loser. Selling the winner locks in a pleasant gain; selling the loser makes a loss real.'};
 }});
