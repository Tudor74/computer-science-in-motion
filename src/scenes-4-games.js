/* ===================== Economics era 4 · Strategy and games ===================== */
// Game theory from the RAND dilemma experiments to Ostrom's commons. The learner plays the games
// (one-shot dilemmas, a hidden repeated opponent, the 2/3 guessing game, a second-price auction, a
// shared fishery) and steers the models (best responses, tournaments, auctions, a pasture).
// Every picture is a pure function of state, frame and X; all randomness is seeded.
const E4_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const E4_rng=n=>rng(E4_mix(n));
function E4_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const E4_n=v=>v<0?'−'+fmt(-v):fmt(v);
const E4_pct=v=>Math.round(v*100)+'%';
const E4_poly=(pts,col,w=2.4,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function E4_wrap(s,n){const out=[];let line='';String(s).split(' ').forEach(w=>{if(line&&(line+' '+w).length>n){out.push(line);line=w}else line=line?line+' '+w:w});if(line)out.push(line);return out}
const E4_lines=(x,y,lines,size=13,col=C.ink,anchor='start',dy=18)=>lines.map((l,i)=>TF(x,y+i*dy,l,size,col,anchor)).join('');
function E4_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
function E4_btn(X,act,arg,label,x,y,w,h,text,o={}){
 const inner=R(x,y,w,h,o.fill||'#fff',o.stroke||C.line,9,o.sel?'stroke-width="3"':'stroke-width="1.5"')+(Array.isArray(text)?text.map((t,i)=>TF(x+w/2,y+h/2+5+(i-(text.length-1)/2)*17,t,o.size||13,o.ink||C.ink)).join(''):TF(x+w/2,y+h/2+5,text,o.size||14,o.ink||C.ink));
 return hit(X,act,arg,label,inner);
}
function E4_arrow(x1,y1,x2,y2,col,w=2.6){const a=Math.atan2(y2-y1,x2-x1),h=10;
 return L(x1,y1,x2-Math.cos(a)*4,y2-Math.sin(a)*4,col,w)+P(`M${fmt(x2)} ${fmt(y2)} L${fmt(x2-h*Math.cos(a-.45))} ${fmt(y2-h*Math.sin(a-.45))} L${fmt(x2-h*Math.cos(a+.45))} ${fmt(y2-h*Math.sin(a+.45))} Z`,col,1.5,col)}
// A 2×2 payoff table: row player (blue, lower left) against column player (coral, upper right).
function E4_matrix(x,y,cw,ch,rows,cols,pay,o={}){
 let s='';
 if(o.colTitle)s+=TF(x+cw,y-32,o.colTitle,13,C.coral);
 if(o.rowTitle)s+=TF(x-12,y-12,o.rowTitle,13,C.blue,'end');
 cols.forEach((c,j)=>s+=TBF(x+cw*j+cw/2,y-12,c,14,C.coral));
 rows.forEach((r,i)=>s+=TBF(x-12,y+ch*i+ch/2+5,r,14,C.blue,'end'));
 for(let i=0;i<2;i++)for(let j=0;j<2;j++){const hi=o.hi&&o.hi[0]===i&&o.hi[1]===j,cx=x+cw*j,cy=y+ch*i;
  s+=R(cx,cy,cw,ch,hi?C.amberp:'#fff',hi?C.amber:C.line,4,hi?'stroke-width="3"':'');
  const [a,b]=pay[i][j];s+=TBF(cx+cw*.3,cy+ch*.74,E4_n(a),18,C.blue)+TBF(cx+cw*.72,cy+ch*.4,E4_n(b),18,C.coral);
  if(o.eq&&o.eq.some(e=>e[0]===i&&e[1]===j))s+=R(cx+5,cy+5,cw-10,ch-10,'none',C.green,6,'stroke-width="3"');
 }
 return s;
}
// Pure-strategy Nash equilibria of a 2×2 game: cells where neither player gains by switching alone.
function E4_pureNE(pay){const eq=[];for(let i=0;i<2;i++)for(let j=0;j<2;j++){if(pay[i][j][0]>=pay[1-i][j][0]&&pay[i][j][1]>=pay[i][1-j][1])eq.push([i,j])}return eq}
const E4_CD=['Cooperate','Defect'];

/* ---------------------------------------------------------------- prisoners-dilemma */
// Axelrod's payoffs: T = 5, R = 3, P = 1, S = 0. Index 0 = cooperate, 1 = defect; [you][them] → [yours, theirs].
const E4_PD=[[[3,3],[0,5]],[[5,0],[1,1]]];
const E4_strangers=seed=>{const r=E4_rng(seed*3+1);return range(10).map(()=>r()<.45?0:1)};
function E4_pdSim(seed,n){const r=E4_rng(seed*7+3),st=E4_strangers(seed);return range(n).map(i=>({you:r()<.5?0:1,them:st[i]}))}
SCENE({id:'prisoners-dilemma',name:'The prisoner’s dilemma',tag:'Ten strangers, one choice each',
 definition:'In a prisoner’s dilemma each player does better by defecting whatever the other does, yet both do better if both cooperate than if both defect.',
 example:'Two firms can each hold prices or undercut. Undercutting wins customers whatever the rival does, but if both undercut, both earn less than if both had held their prices.',
 desc:'A payoff table with your points in blue and the other player’s in coral. You play ten one-off rounds, each against a different stranger, and see your score beside what always cooperating or always defecting would have earned against the same strangers.',
 research:'Flood (1958), Some experimental games, Management Science 5: the 1950 RAND experiments with Melvin Dresher. Albert Tucker (1950) gave the game its prisoners’ story. Sally (1995), Rationality and Society 7: across one-shot experiments from 1958 to 1992, roughly half of players cooperated.',
 dur:12,hint:'Choose Cooperate or Defect in each of ten one-off rounds. Each stranger’s move is fixed in advance by a seeded draw. Your choices stay in this page.',
 init:()=>({seed:4,hist:[]}),
 watch(p){const n=Math.min(10,Math.floor(p*11));return {seed:4,hist:E4_pdSim(4,n),sim:true}},
 ui:[{b:'Cooperate',act:'play',arg:0},{b:'Defect',act:'play',arg:1},{b:'New strangers',act:'again'}],
 on:{play(s,v){if(s.hist.length>=10)return 'keep';const st=E4_strangers(s.seed);s.hist.push({you:Number(v),them:st[s.hist.length]});return 'keep'},
  again(s){s.seed=nextSeed();s.hist=[]}},
 draw(s){
  let out=heading('One-shot prisoner’s dilemma: ten strangers',26);
  const n=s.hist.length,last=s.hist[n-1],st=E4_strangers(s.seed);
  out+=E4_matrix(150,82,110,60,E4_CD,E4_CD,E4_PD,{colTitle:'Stranger’s choice',rowTitle:'You',hi:last?[last.you,last.them]:null});
  out+=TF(150,222,'Blue: your points. Coral: theirs.',13,C.muted,'start');
  const mine=s.hist.reduce((a,h)=>a+E4_PD[h.you][h.them][0],0),allC=s.hist.reduce((a,h)=>a+E4_PD[0][h.them][0],0),allD=s.hist.reduce((a,h)=>a+E4_PD[1][h.them][0],0);
  out+=R(392,50,188,154,C.pale,'none',10);
  out+=TBF(486,72,n<10?`Round ${n+1} of 10`:'All ten rounds played',14,C.ink);
  if(last){out+=TF(404,96,`You: ${E4_CD[last.you]}`,13,C.blue,'start')+TF(404,114,`Stranger: ${E4_CD[last.them]}`,13,C.coral,'start')+TF(404,132,`Points: ${E4_PD[last.you][last.them][0]} to you, ${E4_PD[last.you][last.them][1]} to them`,13,C.ink,'start')}
  else out+=E4_lines(404,100,[s.sim?'A simulated player':'Make your first choice.',s.sim?'is choosing.':'The stranger has decided.'],13,C.muted);
  out+=L(404,144,568,144,C.line,1);
  out+=TBF(404,164,`Your total: ${mine}`,13,C.blue,'start')+TF(404,182,`Always cooperate: ${allC}`,13,C.muted,'start')+TF(404,198,`Always defect: ${allD}`,13,C.muted,'start');
  out+=TF(138,252,s.sim?'Simulated':'You',13,C.blue,'end')+TF(138,276,'Stranger',13,C.coral,'end');
  for(let i=0;i<10;i++){const x=150+i*24,h=s.hist[i];
   out+=R(x,238,20,20,h?(h.you?C.coralp:C.greenp):'#fff',h?(h.you?C.coral:C.green):C.grid,4);
   out+=R(x,262,20,20,h?(h.them?C.coralp:C.greenp):'#fff',h?(h.them?C.coral:C.green):C.grid,4);}
  out+=R(400,242,14,14,C.greenp,C.green,3)+TF(420,254,'cooperate',13,C.muted,'start')+R(400,266,14,14,C.coralp,C.coral,3)+TF(420,278,'defect',13,C.muted,'start');
  const rate=n?s.hist.filter(h=>!h.you).length/n:0,bx=v=>232+v*300;
  out+=TF(222,318,s.sim?'Simulated player':'Your cooperation',13,C.blue,'end')+R(232,306,300,16,'#fff',C.grid,4)+(n?R(232,306,rate*300,16,C.blue,'none',4)+TF(bx(rate)+6,319,E4_pct(rate),13,C.blue,'start'):'');
  out+=TF(222,348,'Typical one-shot play',13,C.green,'end')+R(232,336,300,16,'#fff',C.grid,4)+R(232,336,.47*300,16,C.green,'none',4)+TF(bx(.47)+6,349,'about half',13,C.green,'start');
  out+=TF(300,374,'Typical value: Sally (1995) meta-analysis, rounded',13,C.muted);
  return {svg:out,phase:n<10?'Whatever the stranger does, defecting earns you more: 5 instead of 3 against a cooperator, 1 instead of 0 against a defector. That is what makes defecting a dominant strategy.':`Always defecting would have earned ${allD} against these strangers, the most possible. Yet in experiments about half of people cooperate in one-off dilemmas: payoffs in points are not the whole story of what people value.`};
 }});

const E4_PRESETS=[[5,3,1,0],[3,4,2,0],[4,3,0,2],[2,4,1,3]];
function E4_classify(T,Rw,Pn,S){
 if(T>Rw&&Rw>Pn&&Pn>S)return ['Prisoner’s dilemma',C.coral,2*Rw>T+S?'Defecting is best whatever the other does, yet both defecting is worse for both than both cooperating.':'A dilemma, but taking turns to exploit each other beats steady cooperation (2R is not above T + S), so it is a weak one when repeated.'];
 if(Rw>T&&Pn>S)return ['Stag hunt',C.blue,'Cooperate if you trust the other to cooperate, defect if not: two equilibria, and the question is trust, not temptation.'];
 if(T>Rw&&S>Pn)return ['Chicken (snowdrift)',C.amber,'Your best move is the opposite of theirs: two equilibria, each with one player giving way.'];
 if(Rw>=T&&S>=Pn)return ['Harmony',C.green,'Cooperating is best whatever the other does: no dilemma at all.'];
 return ['Another game',C.muted,'With ties or unusual orderings the game has no standard name. Try separating the four payoffs.'];
}
SCENE({id:'prisoners-dilemma-dominance',name:'What makes it a dilemma',tag:'Four payoffs, four games',
 definition:'A strategy is dominant if it is the best reply to everything the other player might do. In a prisoner’s dilemma the payoffs are ordered T > R > P > S: temptation, reward, punishment, sucker’s payoff.',
 example:'With T = 5, R = 3, P = 1 and S = 0, defecting earns 5 rather than 3 against a cooperator and 1 rather than 0 against a defector.',
 desc:'A payoff table built from four sliders. An arrow in the chosen column shows your best reply to the other player’s move, green boxes mark the equilibria, and a panel names the game the four numbers make.',
 research:'Rapoport & Chammah (1965), Prisoner’s Dilemma: A Study in Conflict and Cooperation (the T > R > P > S and 2R > T + S conditions). Skyrms (2004), The Stag Hunt and the Evolution of Social Structure.',
 dur:10,hint:'Move the four payoffs and switch the other player’s move. Watch which game you have made: a dilemma, a stag hunt, chicken or harmony.',
 init:()=>({T:5,R:3,P:1,S:0,them:0}),
 watch(p){const k=Math.min(3,Math.floor(p*4)),[T,Rw,Pn,S]=E4_PRESETS[k];return {T,R:Rw,P:Pn,S,them:Math.floor(p*8)%2}},
 ui:[{range:'T',label:'T: temptation (you defect, they cooperate)',min:0,max:6,get:s=>s.T,act:'set',arg:'T'},{range:'R',label:'R: reward (both cooperate)',min:0,max:6,get:s=>s.R,act:'setR'},{range:'P',label:'P: punishment (both defect)',min:0,max:6,get:s=>s.P,act:'setP'},{range:'S',label:'S: sucker (you cooperate, they defect)',min:0,max:6,get:s=>s.S,act:'setS'},
  {choose:[[0,'They cooperate'],[1,'They defect']],label:'Other player',get:s=>s.them,act:'them'}],
 on:{set(s,v){s.T=Number(v);return 'keep'},setR(s,v){s.R=Number(v);return 'keep'},setP(s,v){s.P=Number(v);return 'keep'},setS(s,v){s.S=Number(v);return 'keep'},them(s,v){s.them=Number(v);return 'keep'}},
 draw(s){
  const {T,R:Rw,P:Pn,S}=s,pay=[[[Rw,Rw],[S,T]],[[T,S],[Pn,Pn]]],eq=E4_pureNE(pay),x=170,y=84,cw=120,ch=62,j=s.them;
  let out=heading('What makes it a dilemma?',26);
  out+=E4_matrix(x,y,cw,ch,E4_CD,E4_CD,pay,{colTitle:'The other player',rowTitle:'You',eq});
  out+=R(x+cw*j-4,y-4,cw+8,2*ch+8,'none',C.coral,7,'stroke-width="2.5" stroke-dasharray="6 4"');
  const a=pay[0][j][0],b=pay[1][j][0],ax=x+cw*j+18;
  if(a!==b){const [from,to]=a>b?[1,0]:[0,1];out+=E4_arrow(ax,y+ch*from+ch/2,ax,y+ch*to+ch/2,C.blue)}
  const br=jj=>{const c=pay[0][jj][0],d=pay[1][jj][0];return c>d?'cooperate':d>c?'defect':'either'};
  out+=R(430,58,150,154,C.pale,'none',10);
  out+=TBF(505,80,'Your best reply',13,C.ink);
  out+=TF(442,104,'If they cooperate:',13,C.muted,'start')+TBF(442,122,br(0),14,C.blue,'start');
  out+=TF(442,148,'If they defect:',13,C.muted,'start')+TBF(442,166,br(1),14,C.blue,'start');
  out+=TF(442,196,`Equilibria: ${eq.length}`,13,C.green,'start');
  const [nm,col,why]=E4_classify(T,Rw,Pn,S);
  out+=R(30,232,540,74,'#fff',col,10,'stroke-width="2"')+TBF(46,254,nm,15,col,'start')+E4_lines(46,276,E4_wrap(why,80).slice(0,2),13,C.ink);
  const ok1=T>Rw&&Rw>Pn&&Pn>S,ok2=2*Rw>T+S;
  out+=TF(30,334,`T > R > P > S:  ${T} > ${Rw} > ${Pn} > ${S}  ${ok1?'✓':'✗'}`,14,ok1?C.green:C.coral,'start');
  out+=TF(30,358,`2R > T + S:  ${2*Rw} > ${T+S}  ${ok2?'✓':'✗'}`,14,ok2?C.green:C.coral,'start');
  out+=TF(570,346,'green box = equilibrium',13,C.green,'end');
  return {svg:out,phase:'Four numbers decide the game. Order them T > R > P > S and defecting dominates, so both defect and both lose out. Make the reward for mutual cooperation the largest and the same table becomes a stag hunt, where the problem is trust rather than temptation.'};
 }});

// Typical lab cooperation in finitely repeated dilemmas: high, then a fall near the known end (illustrative shape).
const E4_endCurve=(i,n)=>{const left=n-1-i;return left>=3?.62:left===2?.5:left===1?.36:.18};
SCENE({id:'prisoners-dilemma-repeated',name:'Playing again',tag:'Backward induction and the shadow of the future',
 definition:'Backward induction solves a game from its last move backwards. In a dilemma repeated a known number of times it predicts defection in every round; with no known last round, cooperation can be self-enforcing if the future matters enough.',
 example:'With a 50% chance of meeting again or more, the threat “if you defect, I defect for ever” makes steady cooperation worth more than one grab (with T = 5, R = 3, P = 1).',
 desc:'Two views. With a known number of rounds, a strip of rounds shows the theory’s prediction (defect throughout) against the typical lab pattern of cooperation that collapses near the end. With an uncertain end, bars compare cooperating for ever with defecting now, against the chance δ of another round.',
 research:'Flood (1958): in the 1950 RAND experiment, Armen Alchian and John Williams played 100 rounds and both cooperated in 60 of them. Selten & Stoecker (1986), Journal of Economic Behavior and Organization 7: the end-game effect. Friedman (1971), Review of Economic Studies 38: cooperation as an equilibrium of the infinitely repeated game.',
 dur:12,hint:'Switch between a known number of rounds and an uncertain end. The lab curve is an illustrative shape of the published pattern, not data.',
 init:()=>({mode:'finite',n:10,delta:.8}),
 watch(p){return p<.5?{mode:'finite',n:Math.max(1,Math.round(2+p*2*14)),delta:.8}:{mode:'indef',n:10,delta:Math.round((.1+(p-.5)*2*.85)*100)/100}},
 ui:[{choose:[['finite','Known number of rounds'],['indef','Uncertain end']],label:'Horizon',get:s=>s.mode,act:'mode'},
  {range:'n',label:'Rounds (known end)',min:1,max:20,get:s=>s.n,act:'n'},
  {range:'delta',label:'Chance of another round (δ)',min:0,max:.99,step:.01,get:s=>s.delta,act:'delta',show:v=>Math.round(v*100)+'%'}],
 on:{mode(s,v){s.mode=v;return 'keep'},n(s,v){s.n=Number(v);return 'keep'},delta(s,v){s.delta=Number(v);return 'keep'}},
 draw(s){
  let out=heading('Playing again: does the future help?',26);
  if(s.mode==='finite'){
   const n=s.n,w=Math.min(36,500/n),x0=300-n*w/2;
   out+=TBF(30,60,'Theory, solving backwards from the last round',14,C.coral,'start');
   for(let i=0;i<n;i++)out+=R(x0+i*w+1,70,w-2,24,C.coralp,C.coral,3)+(w>=22?TBF(x0+i*w+w/2,87,'D',13,C.coral):'');
   if(n>1)out+=E4_arrow(x0+n*w-4,106,x0+4,106,C.coral,1.8)+TF(300,124,'last round: nothing to lose by defecting, so defect; then the round before, and so on',13,C.muted);
   out+=TBF(30,156,'Typical lab play: cooperation falls near the known end',14,C.green,'start');
   const base=280,hmax=100;
   for(let i=0;i<n;i++){const c=E4_endCurve(i,n);out+=R(x0+i*w+2,base-c*hmax,w-4,c*hmax,C.greenp,C.green,3)}
   out+=L(x0-6,base,x0+n*w+6,base,C.line,1.5)+L(x0-6,base-hmax,x0+n*w+6,base-hmax,C.grid,1,'stroke-dasharray="4 4"');
   out+=TF(x0-10,base-hmax+4,'100%',13,C.muted,'end')+TF(x0-10,base+4,'0%',13,C.muted,'end');
   out+=TF(x0,base+18,'round 1',13,C.muted,'start')+TF(x0+n*w,base+18,`round ${n}`,13,C.muted,'end');
  }else{
   const T=5,Rw=3,Pn=1,d=s.delta,vC=Rw/(1-d),vD=T+d*Pn/(1-d),thr=(T-Rw)/(T-Pn),ok=d>=thr,sc=v=>Math.min(250,v*250/Math.max(15,vC,vD));
   out+=TF(300,56,'Against a partner who cooperates until you defect, then defects for ever:',13,C.muted);
   out+=TF(180,96,'Cooperate for ever',14,C.green,'end')+R(190,82,sc(vC),22,C.greenp,C.green,4)+TF(196+sc(vC),98,`${fmt(Math.round(vC*10)/10)} points`,13,C.green,'start');
   out+=TF(180,136,'Defect now',14,C.coral,'end')+R(190,122,sc(vD),22,C.coralp,C.coral,4)+TF(196+sc(vD),138,`${fmt(Math.round(vD*10)/10)} points`,13,C.coral,'start');
   const mx=x=>90+x*420;out+=L(mx(0),196,mx(1),196,C.line,2);
   [0,.25,.5,.75,1].forEach(v=>out+=L(mx(v),192,mx(v),200,C.muted,1.5)+TF(mx(v),216,Math.round(v*100)+'%',13,C.muted));
   out+=R(mx(thr),186,mx(1)-mx(thr),20,'#e8f3ef','none',4)+L(mx(thr),180,mx(thr),206,C.green,2)+TF(mx(thr),174,'threshold (T−R)/(T−P) = 50%',13,C.green);
   out+=Ci(mx(d),196,8,ok?C.green:C.coral,'#fff')+TF(mx(.5),238,'chance of another round, δ',13,C.muted);
   out+=TB(300,272,ok?'Cooperation can sustain itself':'Grabbing now pays more',16,ok?C.green:C.coral);
  }
  out+=R(30,302,540,68,C.pale,'none',10)+TBF(46,322,'The first dilemma experiment (RAND, 1950)',13,C.ink,'start')+E4_lines(46,342,['Two colleagues played 100 rounds of an unequal dilemma. Theory said','defect throughout; both cooperated in 60 of the 100 rounds (Flood 1958).'],13,C.ink);
  return {svg:out,phase:s.mode==='finite'?'Backward induction says a known last round unravels everything. People do not play that way: they cooperate for most of the game and defect as the end approaches. The lab curve here is an illustrative shape of that end-game effect.':`With a ${Math.round(s.delta*100)}% chance of another round, cooperating for ever is worth ${fmt(Math.round(s.delta>=.995?999:3/(1-s.delta)*10)/10)} points against ${fmt(Math.round((5+s.delta/(1-s.delta))*10)/10)} for defecting now. Above 50% the future casts a long enough shadow.`};
 }});

/* ---------------------------------------------------------------- nash-equilibrium */
const E4_GAMES=[
 {k:'pd',n:'Prisoner’s dilemma',rows:E4_CD,cols:E4_CD,pay:[[[3,3],[0,5]],[[5,0],[1,1]]],note:'One equilibrium, and it is worse for both than mutual cooperation.'},
 {k:'stag',n:'Stag hunt',rows:['Stag','Hare'],cols:['Stag','Hare'],pay:[[[4,4],[0,3]],[[3,0],[3,3]]],note:'Two equilibria: hunting the stag together is better for both, but safe hares need no trust.'},
 {k:'chicken',n:'Chicken',rows:['Swerve','Straight'],cols:['Swerve','Straight'],pay:[[[3,3],[2,4]],[[4,2],[0,0]]],note:'Two equilibria, each with one driver swerving. There is also a mixed one.'},
 {k:'meet',n:'Where to meet',rows:['Café','Cinema'],cols:['Café','Cinema'],pay:[[[3,2],[0,0]],[[0,0],[2,3]]],note:'Two equilibria: both want to meet, but each prefers a different place.'},
 {k:'pennies',n:'Matching pennies',rows:['Heads','Tails'],cols:['Heads','Tails'],pay:[[[1,-1],[-1,1]],[[-1,1],[1,-1]]],note:'The arrows chase each other round: no pure equilibrium. Nash’s theorem guarantees a mixed one: each side plays 50 : 50.'}];
SCENE({id:'nash-equilibrium',name:'Nash equilibrium',tag:'Best replies that point at each other',
 definition:'A Nash equilibrium is a set of strategies in which no player can do better by changing their own strategy alone. Nash proved that every finite game has at least one, if players may randomise.',
 example:'In the stag hunt, both hunting the stag and both chasing hares are equilibria: once there, neither hunter gains by switching alone.',
 desc:'Five classic two-player games. Blue arrows show which row the row player prefers in each column; coral arrows show which column the column player prefers in each row. Cells where both arrows point in are equilibria.',
 research:'Nash (1950). Equilibrium points in n-person games. PNAS 36, 48–49. Nash (1951), Annals of Mathematics 54. Von Neumann & Morgenstern (1944), Theory of Games and Economic Behavior.',
 dur:12,hint:'Choose a game and follow the arrows. Where blue and coral both point into a cell, nobody wants to move alone.',
 init:()=>({g:0}),
 watch(p){return {g:Math.min(4,Math.floor(p*5))}},
 ui:[{choose:E4_GAMES.map((g,i)=>[i,g.n]),label:'Game',get:s=>s.g,act:'g'}],
 on:{g(s,v){s.g=Number(v);return 'keep'}},
 draw(s){
  const g=E4_GAMES[s.g],pay=g.pay,eq=E4_pureNE(pay),x=210,y=90,cw=130,ch=80;
  let out=heading(`${g.n}: where do the arrows meet?`,26);
  out+=E4_matrix(x,y,cw,ch,g.rows,g.cols,pay,{colTitle:'Column player',rowTitle:'Row player',eq});
  for(let j=0;j<2;j++){const a=pay[0][j][0],b=pay[1][j][0];if(a!==b){const [f,t]=a>b?[1,0]:[0,1],ax=x+cw*j+14;out+=E4_arrow(ax,y+ch*f+ch/2,ax,y+ch*t+ch/2,C.blue)}}
  for(let i=0;i<2;i++){const a=pay[i][0][1],b=pay[i][1][1];if(a!==b){const [f,t]=a>b?[1,0]:[0,1],ay=y+ch*i+ch-12;out+=E4_arrow(x+cw*f+cw/2,ay,x+cw*t+cw/2,ay,C.coral)}}
  out+=R(30,280,540,86,C.pale,'none',10);
  const names=eq.map(([i,j])=>`${g.rows[i]} / ${g.cols[j]}`);
  out+=TBF(46,302,eq.length?`Pure equilibria: ${names.join(' and ')}`:'No pure equilibrium',14,eq.length?C.green:C.coral,'start');
  out+=E4_lines(46,324,E4_wrap(g.note,78).slice(0,2),13,C.ink);
  out+=TF(46,358,'Blue numbers: row player. Coral: column player.',13,C.muted,'start');
  return {svg:out,phase:'An equilibrium is not necessarily good: in the dilemma it is worse for both than the alternative. It is simply stable: from there, nobody can gain by moving alone. Some games have several, which is why conventions and focal points matter (Schelling 1960).'};
 }});

// Penalty kicks: scoring probabilities (%) from Palacios-Huerta (2003), rows = kicker, columns = keeper; N = natural side.
const E4_PK=[[58.30,94.97],[92.91,69.92]];
SCENE({id:'nash-equilibrium-mixed',name:'Mixed strategies: penalty kicks',tag:'Be unpredictable in the right proportions',
 definition:'A mixed strategy chooses between actions at random with set probabilities. In a mixed equilibrium each player mixes so that the other is indifferent between their options.',
 example:'A kicker who always shoots to their natural side is easy to read. Shooting there about 39% of the time leaves the keeper no better dive.',
 desc:'A graph of the chance of scoring against how often the kicker shoots to their natural side. One line is the keeper diving to that side, the other diving the other way; the keeper picks the lower, and the kicker’s best mix is where the lines cross.',
 research:'Palacios-Huerta (2003). Professionals play minimax. Review of Economic Studies 70, 395–415: 1,417 penalty kicks; scoring rates of 58.3, 95.0, 92.9 and 69.9%, and observed mixes within about 1.5 percentage points of the equilibrium. Chiappori, Levitt & Groseclose (2002), American Economic Review 92.',
 dur:10,hint:'Move the kicker’s mix. The keeper always chooses the dive that lowers your chance of scoring; find the mix that makes the keeper’s choice irrelevant.',
 init:()=>({p:80}),
 watch(p){return {p:Math.round(90-p*80)}},
 ui:[{range:'p',label:'Kicker shoots to their natural side',min:0,max:100,get:s=>s.p,act:'p',show:v=>v+'%'}],
 on:{p(s,v){s.p=Number(v);return 'keep'}},
 draw(s){
  const k=E4_PK,f=(p,col)=>k[0][col]*p+k[1][col]*(1-p),p=s.p/100;
  const pStar=(k[1][1]-k[1][0])/((k[0][0]-k[1][0])-(k[0][1]-k[1][1])),vStar=f(pStar,0);
  const qStar=(k[0][1]-k[1][1])/((k[0][1]-k[1][1])-(k[0][0]-k[1][0]));
  let out=heading('Penalty kicks: the best mix is unpredictable',26);
  const pl=E4_plot(80,62,320,220,[0,1],[50,100],{xt:[[0,'0%'],[.5,'50%'],[1,'100%']],yt:[[50,'50%'],[75,'75%'],[100,'100%']],xl:'how often the kicker shoots to their natural side',yl:'chance of scoring'});
  out+=pl.svg;
  const line=c=>[[pl.X(0),pl.Y(f(0,c))],[pl.X(1),pl.Y(f(1,c))]];
  out+=E4_poly(line(0),C.coral,2.4)+E4_poly(line(1),C.purple,2.4);
  out+=E4_poly(range(41).map(i=>{const q=i/40;return [pl.X(q),pl.Y(Math.min(f(q,0),f(q,1)))]}),C.ink,4,'opacity=".35"');
  out+=TF(pl.X(.02),pl.Y(f(0,0))-8,'keeper dives natural side',13,C.coral,'start');
  out+=TF(pl.X(.02),pl.Y(f(0,1))+18,'keeper dives other side',13,C.purple,'start');
  out+=L(pl.X(pStar),pl.Y(50),pl.X(pStar),pl.Y(vStar),C.green,1.5,'stroke-dasharray="4 4"')+Ci(pl.X(pStar),pl.Y(vStar),6,C.green,'#fff');
  const v=Math.min(f(p,0),f(p,1)),best=f(p,0)<f(p,1)?'natural side':f(p,0)>f(p,1)?'other side':'either side';
  out+=L(pl.X(p),pl.Y(50),pl.X(p),pl.Y(100),C.blue,2)+Ci(pl.X(p),pl.Y(v),7,C.blue,'#fff');
  out+=R(420,62,160,220,C.pale,'none',10);
  out+=TBF(500,84,'Chance of scoring',13,C.ink)+TF(500,102,'kicker ↓  keeper →',13,C.muted);
  [['N','O']].forEach(()=>{});
  const cx=[478,540],cy=[150,184];out+=TBF(cx[0],128,'N',13,C.muted)+TBF(cx[1],128,'O',13,C.muted)+TBF(440,cy[0]+4,'N',13,C.muted)+TBF(440,cy[1]+4,'O',13,C.muted);
  for(let i=0;i<2;i++)for(let j=0;j<2;j++)out+=TF(cx[j],cy[i]+4,Math.round(k[i][j])+'%',13,C.ink);
  out+=TF(432,214,'N: natural side',13,C.muted,'start')+TF(432,232,'O: other side',13,C.muted,'start');
  out+=TF(432,256,`Rounded from`,13,C.muted,'start')+TF(432,272,'Palacios-Huerta 2003',13,C.muted,'start');
  out+=TB(300,328,`Keeper’s best dive: ${best}. You score ${Math.round(v*10)/10}%.`,15,C.blue);
  out+=T(300,354,`Equilibrium: kicker ${Math.round(pStar*1000)/10}% natural, keeper ${Math.round(qStar*1000)/10}% natural, ${Math.round(vStar*10)/10}% scored`,14,C.green);
  return {svg:out,phase:'The keeper reads any pattern and dives to whichever side hurts you more, so your chance is the lower line. It peaks where the lines cross: there the keeper’s dive no longer matters. Professional kickers and keepers mixed almost exactly in these proportions.'};
 }});

// Cournot duopoly: price = 120 − (q1 + q2), cost 30 a unit; best reply q = (90 − rival)/2; equilibrium 30 each.
const E4_cournotPath=(a,b,steps)=>{const pts=[[a,b]];for(let i=0;i<steps;i++){const [x,y]=pts[pts.length-1];pts.push([(90-y)/2,(90-x)/2])}return pts};
SCENE({id:'nash-equilibrium-cournot',name:'Two firms choose quantities',tag:'Cournot’s equilibrium, 1838',
 definition:'In Cournot competition firms choose how much to produce and the market price falls as total output rises. Each firm’s best reply depends on the other’s output; the equilibrium is where both replies hold at once.',
 example:'With price 120 − total output and a cost of 30 a unit, each firm’s best reply is (90 − rival’s output) ÷ 2, and the equilibrium is 30 units each at a price of 60.',
 desc:'A plane of the two firms’ outputs with each firm’s best-reply line. From any starting point, repeated best replies zigzag towards the crossing, the Nash equilibrium. Markers show the monopoly split and the competitive outcome for comparison.',
 research:'Cournot (1838). Recherches sur les principes mathématiques de la théorie des richesses, chapter 7. Nash (1950) generalised the equilibrium idea Cournot used for two producers.',
 dur:10,hint:'Set where the two firms start, then press Best-respond: each firm adjusts to the other’s last output.',
 init:()=>({a:10,b:75,steps:0}),
 watch(p){return {a:10,b:75,steps:Math.min(7,Math.floor(p*9))}},
 ui:[{range:'a',label:'Firm A starts at',min:0,max:90,get:s=>s.a,act:'a'},{range:'b',label:'Firm B starts at',min:0,max:90,get:s=>s.b,act:'b'},{b:'Best-respond',act:'step'},{b:'Back to start',act:'back'}],
 on:{a(s,v){s.a=Number(v);s.steps=0;return 'keep'},b(s,v){s.b=Number(v);s.steps=0;return 'keep'},step(s){s.steps=Math.min(12,s.steps+1);return 'keep'},back(s){s.steps=0;return 'keep'}},
 draw(s){
  let out=heading('Two firms, one market: Cournot’s equilibrium',26);
  const pl=E4_plot(80,56,250,250,[0,90],[0,90],{xt:[[0,'0'],[30,'30'],[60,'60'],[90,'90']],yt:[[0,'0'],[30,'30'],[60,'60'],[90,'90']],xl:'firm A’s output',yl:'firm B’s output',xlDy:33});
  out+=pl.svg;
  out+=L(pl.X(45),pl.Y(0),pl.X(0),pl.Y(90),C.blue,2.4)+TF(pl.X(46),pl.Y(4),'A’s best reply',13,C.blue,'start');
  out+=L(pl.X(0),pl.Y(45),pl.X(90),pl.Y(0),C.coral,2.4)+TF(pl.X(70),pl.Y(13),'B’s best reply',13,C.coral);
  out+=Ci(pl.X(22.5),pl.Y(22.5),5,C.purple)+TF(pl.X(22.5)-8,pl.Y(22.5)+18,'shared monopoly',13,C.purple,'end');
  out+=Ci(pl.X(45),pl.Y(45),5,C.amber)+TF(pl.X(45)+8,pl.Y(45)-6,'price = cost',13,C.amber,'start');
  const pts=E4_cournotPath(s.a,s.b,s.steps);
  out+=E4_poly(pts.map(([x,y])=>[pl.X(x),pl.Y(y)]),C.ink,1.6,'stroke-dasharray="5 4"');
  pts.forEach(([x,y],i)=>out+=Ci(pl.X(x),pl.Y(y),i===pts.length-1?7:3.5,i===pts.length-1?C.ink:C.muted,'#fff'));
  out+=Ci(pl.X(30),pl.Y(30),9,'none',C.green,'stroke-width="3"');
  const [qa,qb]=pts[pts.length-1],price=Math.max(0,120-qa-qb),pa=(price-30)*qa,pb=(price-30)*qb;
  out+=R(360,56,220,250,C.pale,'none',10);
  out+=TBF(470,78,`After ${s.steps} best repl${s.steps===1?'y':'ies'}`,14,C.ink);
  out+=TF(372,104,`Firm A makes ${fmt(Math.round(qa*10)/10)}`,13,C.blue,'start')+TF(372,124,`Firm B makes ${fmt(Math.round(qb*10)/10)}`,13,C.coral,'start');
  out+=TF(372,148,`Price: ${fmt(Math.round(price*10)/10)}`,13,C.ink,'start');
  out+=TF(372,168,`Profits: ${E4_n(Math.round(pa))} and ${E4_n(Math.round(pb))}`,13,C.ink,'start');
  out+=L(372,184,568,184,C.line,1);
  out+=TF(372,206,'Equilibrium (green ring):',13,C.green,'start')+TF(372,224,'30 each, price 60, profit 900',13,C.green,'start');
  out+=TF(372,250,'Shared monopoly (purple):',13,C.purple,'start')+TF(372,268,'22.5 each, price 75, profit 1,013',13,C.purple,'start');
  out+=TF(372,292,'Both would earn more by colluding.',13,C.muted,'start');
  out+=T(300,370,'Price = 120 − total output; each unit costs 30 to make.',14,C.muted);
  return {svg:out,phase:'Each firm’s best reply is to produce half of whatever demand the rival leaves, net of cost. Repeated replies zigzag into the crossing at 30 each. Like the prisoner’s dilemma, the equilibrium is worse for the firms than sharing a monopoly, which is why cartels form and why they tend to cheat on each other.'};
 }});

/* ---------------------------------------------------------------- axelrod-tournament */
const E4_ST=[{k:'tft',n:'Tit for Tat'},{k:'tf2t',n:'Tit for Two Tats'},{k:'grudger',n:'Grudger'},{k:'wsls',n:'Win-stay, lose-shift'},{k:'allc',n:'Always cooperate'},{k:'alld',n:'Always defect'},{k:'random',n:'Random'}];
const E4_COL={tft:C.green,tf2t:'#5c9a6b',grudger:C.purple,wsls:C.blue,allc:C.amber,alld:C.coral,random:C.muted,gtft:'#2e8a8a'};
const E4_NAME=Object.fromEntries(E4_ST.map(s=>[s.k,s.n]).concat([['gtft','Generous Tit for Tat']]));
// One move from a strategy, given its own and its opponent's past moves (0 = cooperate, 1 = defect).
function E4_move(k,me,op,r){const n=me.length;
 switch(k){
  case 'allc':return 0;
  case 'alld':return 1;
  case 'random':return r()<.5?0:1;
  case 'tft':return n?op[n-1]:0;
  case 'gtft':return n&&op[n-1]?(r()<1/3?0:1):0;
  case 'tf2t':return n>1&&op[n-1]&&op[n-2]?1:0;
  case 'grudger':return op.indexOf(1)>=0?1:0;
  case 'wsls':{if(!n)return 0;const pay=E4_PD[me[n-1]][op[n-1]][0];return pay>=3?me[n-1]:1-me[n-1]}
 }return 0}
function E4_match(a,b,rounds,noise,seed){const r=E4_rng(seed),ma=[],mb=[];let sa=0,sb=0;
 for(let t=0;t<rounds;t++){let x=E4_move(a,ma,mb,r),y=E4_move(b,mb,ma,r);if(noise){if(r()<noise)x=1-x;if(r()<noise)y=1-y}
  ma.push(x);mb.push(y);sa+=E4_PD[x][y][0];sb+=E4_PD[x][y][1]}
 return {sa:sa/rounds,sb:sb/rounds,ma,mb}}
const E4_tourCache=new Map();
// Round robin with every strategy also meeting its twin, 200 rounds a match (as Axelrod used), averaged over repeats if noisy.
function E4_tour(keys,noise){const id=keys.join(',')+'|'+noise;if(E4_tourCache.has(id))return E4_tourCache.get(id);
 const n=keys.length,A=keys.map(()=>keys.map(()=>0)),reps=noise?6:1;
 for(let i=0;i<n;i++)for(let j=i;j<n;j++){let x=0,y=0;for(let k=0;k<reps;k++){const m=E4_match(keys[i],keys[j],200,noise,1000+i*31+j*7+k*101);x+=m.sa;y+=m.sb}A[i][j]=x/reps;A[j][i]=i===j?x/reps:y/reps}
 const score=A.map(row=>row.reduce((a,b)=>a+b,0)/n),res={A,score};E4_tourCache.set(id,res);return res}
const E4_allKeys=E4_ST.map(s=>s.k);
SCENE({id:'axelrod-tournament',name:'Axelrod’s tournament',tag:'Which strategy wins a round robin?',
 definition:'In 1980 Robert Axelrod invited game theorists to submit programs to play a repeated prisoner’s dilemma against each other, 200 moves a match. The simplest entry, Tit for Tat, won both of his tournaments.',
 example:'Tit for Tat cooperates first, then copies the other player’s last move. It never beats its opponent in a single match, yet it scored highest overall.',
 desc:'A round robin of seven classic strategies, each meeting every other and its own twin for 200 rounds. Bars show the average points per round; press a strategy to take it out or put it back, and add noise to see which strategies cope with mistakes.',
 research:'Axelrod (1980). Effective choice in the prisoner’s dilemma. Journal of Conflict Resolution 24, 3–25 (14 entries; Anatol Rapoport’s Tit for Tat won). Axelrod (1984). The Evolution of Cooperation. Basic Books. The winner depends on the field of entries: no strategy is best against all mixes.',
 dur:12,hint:'Press a strategy to remove it from the tournament or add it back, and move the noise slider. Who wins depends on who else is playing.',
 init:()=>({mask:'1111111',noise:0}),
 watch(p){return {mask:p<.33?'1111111':p<.66?'1111101':'1111111',noise:p<.66?0:5}},
 ui:[{range:'noise',label:'Noise: chance each move is flipped by mistake',min:0,max:10,get:s=>s.noise,act:'noise',show:v=>v+'%'}],
 on:{noise(s,v){s.noise=Number(v);return 'keep'},tog(s,v){const m=s.mask.split('');const i=Number(v);m[i]=m[i]==='1'?'0':'1';if(m.filter(c=>c==='1').length>=2)s.mask=m.join('');return 'keep'}},
 draw(s,f,X){
  const keys=E4_ST.filter((st,i)=>s.mask[i]==='1').map(st=>st.k),res=E4_tour(keys,s.noise/100);
  const rows=E4_ST.map((st,i)=>({...st,i,in:s.mask[i]==='1',sc:s.mask[i]==='1'?res.score[keys.indexOf(st.k)]:null}));
  const order=rows.filter(r=>r.in).sort((a,b)=>b.sc-a.sc).concat(rows.filter(r=>!r.in));
  let out=heading('Axelrod’s tournament: 200 rounds against everyone',26);
  const bx=v=>250+v*62;
  out+=L(bx(0),48,bx(0),318,C.line,1.5);[0,1,2,3,4,5].forEach(v=>out+=L(bx(v),316,bx(v),322,C.muted,1)+TF(bx(v),338,String(v),13,C.muted));
  out+=TF(bx(2.5),358,'average points per round',13,C.muted);
  order.forEach((r,k)=>{const y=52+k*38,col=E4_COL[r.k];
   const inner=R(20,y,546,32,r.in?'#fff':'#f3f5f7',r.in?C.grid:'none',8)+TF(36,y+21,(r.in?(k+1)+'. ':'')+r.n,14,r.in?C.ink:C.muted,'start')+(r.in?R(bx(0),y+7,Math.max(2,r.sc*62),18,col,'none',4)+TF(bx(0)+r.sc*62+6,y+21,r.sc.toFixed(2),13,col,'start'):TF(bx(0)+8,y+21,'not entered: press to add',13,C.muted,'start'));
   out+=hit(X,'tog',r.i,`${r.in?'Remove':'Add'} ${r.n}`,inner)});
  const top=order[0];
  return {svg:out,phase:`${top.n} wins this field${s.noise?` with ${s.noise}% noise`:''}. Nice strategies (never first to defect) do well together; Always defect only prospers when there are cooperators to exploit. Take out Always cooperate and Random and see how the ranking shifts.`};
 }});

const E4_POOL=['tft','grudger','alld','wsls','random'];
const E4_opp=seed=>E4_POOL[E4_mix(seed*5+2)%E4_POOL.length];
function E4_oppMove(seed,you,them){return E4_move(E4_opp(seed),them,you,E4_rng(seed*101+them.length))}
SCENE({id:'axelrod-tournament-play',name:'Guess your opponent',tag:'Ten rounds against a hidden strategy',
 definition:'In a repeated game your move can depend on the history. Strategies differ in whether they are nice (never first to defect), retaliatory, forgiving and clear.',
 example:'Defect once against Grudger and it never cooperates again; defect once against Tit for Tat and it defects once, then follows your lead.',
 desc:'Ten rounds of the prisoner’s dilemma against a hidden strategy drawn from five. The history strip shows both players’ moves; after ten rounds you guess who you were playing.',
 research:'Axelrod (1984), The Evolution of Cooperation, chapter 2: the four properties of successful strategies (nice, retaliatory, forgiving, clear). Nowak & Sigmund (1993), Nature 364: win-stay, lose-shift.',
 dur:12,hint:'Probe your opponent: try a defection and see how it reacts, then guess. Payoffs as before: 3 each for cooperating, 1 each for defecting, 5 and 0 when one defects.',
 init:()=>({seed:7,you:[],them:[],guess:null}),
 watch(p){const n=Math.min(10,Math.floor(p*11)),you=[],them=[];for(let i=0;i<n;i++){const m=i===3?1:(them.length?them[them.length-1]:0);them.push(E4_oppMove(7,you,them));you.push(m)}
  return {seed:7,you,them,guess:n>=10?E4_opp(7):null,sim:true}},
 ui:[{b:'Cooperate',act:'play',arg:0},{b:'Defect',act:'play',arg:1},{b:'New opponent',act:'again'}],
 on:{play(s,v){if(s.you.length>=10)return 'keep';const o=E4_oppMove(s.seed,s.you,s.them);s.you.push(Number(v));s.them.push(o);return 'keep'},
  guess(s,v){if(s.you.length>=10&&!s.guess)s.guess=v;return 'keep'},
  again(s){s.seed=nextSeed();s.you=[];s.them=[];s.guess=null}},
 draw(s,f,X){
  let out=heading('Ten rounds against a hidden strategy',26);
  const n=s.you.length,w=40,x0=110;
  out+=TF(x0-10,76,s.sim?'Simulated':'You',13,C.blue,'end')+TF(x0-10,120,'Opponent',13,C.coral,'end');
  for(let i=0;i<10;i++){const x=x0+i*(w+6),a=s.you[i],b=s.them[i];
   out+=R(x,58,w,28,a===undefined?'#fff':a?C.coralp:C.greenp,a===undefined?C.grid:a?C.coral:C.green,5)+(a!==undefined?TBF(x+w/2,77,a?'D':'C',14,a?C.coral:C.green):'');
   out+=R(x,102,w,28,b===undefined?'#fff':b?C.coralp:C.greenp,b===undefined?C.grid:b?C.coral:C.green,5)+(b!==undefined?TBF(x+w/2,121,b?'D':'C',14,b?C.coral:C.green):'');
   out+=TF(x+w/2,148,String(i+1),13,C.muted)}
  let ys=0,os=0;for(let i=0;i<n;i++){ys+=E4_PD[s.you[i]][s.them[i]][0];os+=E4_PD[s.you[i]][s.them[i]][1]}
  out+=T(300,176,`Points so far: ${s.sim?'simulated player':'you'} ${ys}, opponent ${os}`,15,C.ink);
  if(n<10){out+=T(300,214,`Round ${n+1} of 10: choose Cooperate or Defect.`,15,C.muted);
   out+=E4_lines(300,250,['Clues: does it cooperate first? Does it punish a defection?','Does it forgive, or hold a grudge? Does it look random?'],14,C.muted,'middle',22)}
  else{const truth=E4_opp(s.seed);
   out+=TBF(300,206,s.guess?'':'Who was it? Press your guess.',14,C.ink);
   E4_POOL.forEach((k,i)=>{const x=24+i*112,sel=s.guess===k,right=s.guess&&k===truth;
    out+=E4_btn(X,'guess',k,`Guess ${E4_NAME[k]}`,x,218,104,46,E4_wrap(E4_NAME[k],13),{sel,stroke:right?C.green:sel?C.coral:C.line,fill:right?C.greenp:'#fff',size:13})});
   if(s.guess){const ok=s.guess===truth;out+=TB(300,300,ok?`Right: it was ${E4_NAME[truth]}.`:`It was ${E4_NAME[truth]}.`,16,ok?C.green:C.coral);
    const tell={tft:'It copied your previous move every time.',grudger:'It cooperated until your first defection, then never again.',alld:'It defected from the first round, whatever you did.',wsls:'It kept its move after a good result and switched after a bad one.',random:'Its moves had no link to yours.'}[truth];
    out+=T(300,328,tell,14,C.ink)}}
  return {svg:out,phase:'Axelrod found that successful strategies were nice, retaliatory, forgiving and clear. Clarity matters here: a strategy whose rule you can read from ten moves is one you can learn to cooperate with.'};
 }});

const E4_PAIRS=['tft','gtft','wsls'];
SCENE({id:'axelrod-tournament-noise',name:'When mistakes happen',tag:'Noise, echoes and generosity',
 definition:'With noise, a move sometimes comes out differently from what was intended. Between two Tit for Tat players one mistake starts an echo of alternating retaliation.',
 example:'Generous Tit for Tat forgives a third of defections, which breaks echoes; win-stay, lose-shift repairs them in two moves.',
 desc:'Sixty rounds between two copies of the chosen strategy, with mistakes shown as outlined squares. Bars compare the long-run average payoff of each pair at the chosen noise level; mutual cooperation would give 3.',
 research:'Molander (1985), Journal of Conflict Resolution 29: generosity in noisy dilemmas. Nowak & Sigmund (1992). Tit for tat in heterogeneous populations. Nature 355, 250–253. Nowak & Sigmund (1993). A strategy of win-stay, lose-shift that outperforms tit-for-tat. Nature 364, 56–58.',
 dur:10,hint:'Pick a pair and raise the noise. Watch Tit for Tat fall into echoes after a single mistake, and the others recover.',
 init:()=>({pair:'tft',noise:5}),
 watch(p){return {pair:E4_PAIRS[Math.min(2,Math.floor(p*3))],noise:5}},
 ui:[{choose:E4_PAIRS.map(k=>[k,E4_NAME[k]]),label:'Strategy (playing its twin)',get:s=>s.pair,act:'pair'},{range:'noise',label:'Noise',min:0,max:10,get:s=>s.noise,act:'noise',show:v=>v+'%'}],
 on:{pair(s,v){s.pair=v;return 'keep'},noise(s,v){s.noise=Number(v);return 'keep'}},
 draw(s){
  const nz=s.noise/100,r=E4_rng(21),ma=[],mb=[],err=[];
  for(let t=0;t<60;t++){let x=E4_move(s.pair,ma,mb,r),y=E4_move(s.pair,mb,ma,r),ex=false,ey=false;if(nz){if(r()<nz){x=1-x;ex=true}if(r()<nz){y=1-y;ey=true}}ma.push(x);mb.push(y);err.push([ex,ey])}
  let out=heading(`${E4_NAME[s.pair]} against its twin, with mistakes`,26);
  const w=8.4,x0=48;
  out+=TF(x0,58,'Player 1',13,C.muted,'start')+TF(x0,112,'Player 2',13,C.muted,'start');
  for(let t=0;t<60;t++){const x=x0+t*w;[[ma,66,0],[mb,120,1]].forEach(([m,y,k])=>{const e=err[t][k];out+=R(x,y,w-1.6,22,m[t]?C.coral:C.green,e?C.ink:'none',1.5,e?'stroke-width="1.6"':'')})}
  out+=R(x0,152,12,12,C.green,'none',2)+TF(x0+18,163,'cooperate',13,C.muted,'start')+R(x0+100,152,12,12,C.coral,'none',2)+TF(x0+118,163,'defect',13,C.muted,'start')+R(x0+190,152,12,12,'#fff',C.ink,2,'stroke-width="1.6"')+TF(x0+208,163,'a mistake',13,C.muted,'start');
  out+=TF(552,163,'rounds 1 to 60 →',13,C.muted,'end');
  const bx=v=>220+v*100;out+=TBF(30,198,'Long-run average per round (2,000 rounds)',14,C.ink,'start');
  E4_PAIRS.forEach((k,i)=>{const m=E4_match(k,k,2000,nz,77),v=(m.sa+m.sb)/2,y=212+i*40,sel=k===s.pair;
   out+=TF(210,y+19,E4_NAME[k],14,sel?C.ink:C.muted,'end')+R(bx(0),y+4,v*100,22,E4_COL[k],sel?C.ink:'none',4,sel?'stroke-width="2"':'')+TF(bx(v)+6,y+20,v.toFixed(2),13,E4_COL[k],'start')});
  out+=L(bx(3),206,bx(3),336,C.green,1.5,'stroke-dasharray="4 4"')+TF(bx(3),352,'3 = steady cooperation',13,C.green);
  return {svg:out,phase:'One mistake between two Tit for Tat players sets off alternating retaliation, and a second can lock them into mutual defection; their average sinks towards that of random play. Forgiving some defections, or shifting after a bad result, lets cooperation recover.'};
 }});

// Ecological tournament (Axelrod 1984): strategy shares grow in proportion to their score against the current mix.
function E4_eco(noise,gens){const {A}=E4_tour(E4_allKeys,noise),n=A.length;let x=Array(n).fill(1/n);const hist=[x.slice()];
 for(let g=0;g<gens;g++){const f=A.map(row=>row.reduce((a,v,j)=>a+v*x[j],0)),mean=f.reduce((a,v,i)=>a+v*x[i],0);x=x.map((v,i)=>v*f[i]/mean);hist.push(x.slice())}return hist}
SCENE({id:'axelrod-tournament-ecology',name:'Survival of the strategies',tag:'Axelrod’s ecological tournament',
 definition:'In an ecological tournament each strategy’s share of the next generation grows with its score against the current population, so strategies must do well against whoever survives.',
 example:'Always defect grows at first by exploiting the unconditional cooperators, then starves once they are gone and the retaliators remain.',
 desc:'Lines show the share of each of seven strategies over generations, starting equal, with each generation’s shares in proportion to the strategies’ average points against the current mix.',
 research:'Axelrod (1984). The Evolution of Cooperation, chapter 2: the ecological analysis of the second tournament. Axelrod & Hamilton (1981). The evolution of cooperation. Science 211, 1390–1396.',
 dur:12,hint:'Slide through the generations and add noise. Exploiters rise while there is something to exploit, then fall.',
 init:()=>({gen:60,noise:0}),
 watch(p){return {gen:Math.round(p*60),noise:0}},
 ui:[{range:'gen',label:'Generations',min:0,max:60,get:s=>s.gen,act:'gen'},{range:'noise',label:'Noise',min:0,max:10,get:s=>s.noise,act:'noise',show:v=>v+'%'}],
 on:{gen(s,v){s.gen=Number(v);return 'keep'},noise(s,v){s.noise=Number(v);return 'keep'}},
 draw(s){
  const hist=E4_eco(s.noise/100,60),now=hist[s.gen];
  let out=heading('Which strategies survive?',26);
  const pl=E4_plot(70,56,330,250,[0,60],[0,.6],{xt:[[0,'0'],[20,'20'],[40,'40'],[60,'60']],yt:[[0,'0%'],[.3,'30%'],[.6,'60%']],xl:'generation',yl:'share of the population'});
  out+=pl.svg;
  E4_ST.forEach((st,i)=>{out+=E4_poly(hist.slice(0,s.gen+1).map((x,g)=>[pl.X(g),pl.Y(Math.min(.6,x[i]))]),E4_COL[st.k],2.4)});
  out+=L(pl.X(s.gen),56,pl.X(s.gen),306,C.ink,1,'stroke-dasharray="3 4"');
  const ord=E4_ST.map((st,i)=>({...st,v:now[i]})).sort((a,b)=>b.v-a.v);
  out+=TBF(420,62,`Generation ${s.gen}`,14,C.ink,'start');
  ord.forEach((st,k)=>{const y=86+k*30;out+=R(420,y-11,14,14,E4_COL[st.k],'none',3)+TF(442,y+1,st.n,13,C.ink,'start')+TF(578,y+1,E4_pct(st.v),13,C.muted,'end')});
  out+=T(300,366,'Shares start equal; noise uses the same averaged tournament as before.',14,C.muted);
  return {svg:out,phase:'Always defect gains early, feeding on Always cooperate and Random. As its prey disappears it meets mostly retaliators and declines, while the nice, retaliatory strategies take over. Axelrod saw the same pattern when he ran the 63 real entries this way.'};
 }});

/* ---------------------------------------------------------------- beauty-contest */
// Simulated rivals: round 1 mixes random, level-1 (≈33), level-2 (≈22) and deeper players; later rounds aim below the last target.
function E4_bcOthers(seed,round,prevTarget){const r=E4_rng(seed*97+round*13+5),g=[];
 for(let i=0;i<15;i++){let v;if(round===0){const u=r();v=u<.36?r()*100:u<.7?33+E4_gauss(r)*5:u<.88?22+E4_gauss(r)*4:u<.96?11+E4_gauss(r)*4:r()*2}
  else v=prevTarget*(.6+r()*.5)+E4_gauss(r)*2;g.push(clamp(Math.round(v),0,100))}return g}
function E4_bcRun(seed,mine){const rounds=[];let prev=null;
 mine.forEach((m,k)=>{const others=E4_bcOthers(seed,k,prev),all=others.concat([m]),avg=all.reduce((a,b)=>a+b,0)/all.length,target=avg*2/3;
  let best=0;all.forEach((v,i)=>{if(Math.abs(v-target)<Math.abs(all[best]-target))best=i});rounds.push({others,all,avg,target,win:all[best],you:m,youWin:Math.abs(m-target)<=Math.abs(all[best]-target)+1e-9});prev=target});return rounds}
SCENE({id:'beauty-contest',name:'Guess two-thirds of the average',tag:'The beauty contest game',
 definition:'In the 2/3 guessing game everyone picks a number from 0 to 100 and the winner is closest to two-thirds of the average. Its only Nash equilibrium is for everyone to choose 0.',
 example:'If others pick at random (average 50), you should pick 33; if they think that too, 22; and so on down to 0. In Nagel’s experiments, first-round guesses clustered near 33 and 22.',
 desc:'Four rounds against fifteen simulated players. A histogram shows all sixteen guesses with the average and the two-thirds target; a table tracks the average, the target and the winning guess round by round.',
 research:'Nagel (1995). Unraveling in guessing games: an experimental study. American Economic Review 85, 1313–1326: with p = 2/3, first-round guesses averaged about 37, with spikes near 33 and 22, and fell over four rounds. Keynes (1936) used a newspaper beauty contest as the image.',
 dur:12,hint:'Pick a number with the slider and Submit. Four rounds; after each you see the others’ guesses. Simulated rivals are modelled on Nagel’s first-round pattern. Your guesses stay in this page.',
 init:()=>({seed:3,g:50,mine:[]}),
 watch(p){const n=Math.min(4,Math.floor(p*5));return {seed:3,g:33,mine:[33,20,12,8].slice(0,n),sim:true}},
 ui:[{range:'g',label:'Your guess',min:0,max:100,get:s=>s.g,act:'g'},{b:'Submit guess',act:'submit'},{b:'Start again',act:'again'}],
 on:{g(s,v){s.g=Number(v);return 'keep'},submit(s){if(s.mine.length<4)s.mine.push(s.g);return 'keep'},again(s){s.seed=nextSeed();s.mine=[];s.g=50}},
 draw(s){
  const runs=E4_bcRun(s.seed,s.mine),cur=runs[runs.length-1];
  let out=heading('Guess two-thirds of the average',26);
  const pl=E4_plot(60,52,480,120,[0,100],[0,8],{xt:[[0,'0'],[22,'22'],[33,'33'],[50,'50'],[100,'100']],xl:'',yl:''});
  out+=pl.svg;
  if(cur){const bins=Array(20).fill(0);cur.others.forEach(v=>bins[Math.min(19,Math.floor(v/5))]++);
   bins.forEach((c,i)=>{if(c)out+=R(pl.X(i*5)+1,pl.Y(c),pl.X(5)-pl.X(0)-2,pl.Y(0)-pl.Y(c),C.pale,C.line,2)});
   out+=L(pl.X(cur.avg),52,pl.X(cur.avg),172,C.muted,2,'stroke-dasharray="4 4"')+TF(pl.X(cur.avg)+4,66,`average ${fmt(Math.round(cur.avg*10)/10)}`,13,C.muted,'start');
   out+=L(pl.X(cur.target),52,pl.X(cur.target),172,C.green,2.5)+TF(pl.X(cur.target)-4,66,`target ${fmt(Math.round(cur.target*10)/10)}`,13,C.green,'end');
   out+=P(`M${fmt(pl.X(cur.you))} 176 l-7 12 h14 z`,C.blue,1.5,C.blue)+TF(pl.X(cur.you),204,s.sim?'simulated':'you',13,C.blue);}
  else out+=T(300,116,'Choose a number from 0 to 100 and press Submit.',15,C.muted);
  out+=TF(300,226,`Round ${Math.min(4,s.mine.length+1)} of 4${s.mine.length>=4?' (finished)':''}`,13,C.muted);
  const cols=[70,170,280,400,510],hy=252;
  ['Round','Average','Target (2/3)','Winning guess',s.sim?'Simulated':'You'].forEach((h,i)=>out+=TBF(cols[i],hy,h,13,C.ink));
  out+=L(30,hy+8,570,hy+8,C.line,1);
  for(let k=0;k<4;k++){const r=runs[k],y=hy+28+k*22;out+=TF(cols[0],y,String(k+1),13,C.muted);
   if(r)out+=TF(cols[1],y,fmt(Math.round(r.avg*10)/10),13,C.ink)+TF(cols[2],y,fmt(Math.round(r.target*10)/10),13,C.green)+TF(cols[3],y,String(r.win),13,C.ink)+TF(cols[4],y,`${r.you}${r.youWin?' (won)':''}`,13,r.youWin?C.green:C.blue)}
  out+=TF(300,374,'Nagel (1995), p = 2/3: first-round mean about 37, falling each round.',13,C.muted);
  return {svg:out,phase:'The game rewards thinking one step further than the crowd, but not too far. Zero is the equilibrium, yet guessing 0 in round 1 loses: most people reason one or two steps. Over repeated rounds guesses fall towards 0 as everyone learns how far the others reason.'};
 }});

// Cognitive hierarchy (Camerer, Ho & Chong 2004): level 0 guesses at random (mean 50); level k best-responds to a
// Poisson(τ) mix of the levels below it.
function E4_ch(tau,K=8){const f=range(K+1).map(k=>Math.exp(-tau)*Math.pow(tau,k)/range(k).reduce((a,i)=>a*(i+1),1)),g=[50];
 for(let k=1;k<=K;k++){let sw=0,sg=0;for(let h=0;h<k;h++){sw+=f[h];sg+=f[h]*g[h]}g.push(2/3*sg/sw)}
 const tot=f.reduce((a,b)=>a+b,0),mean=g.reduce((a,v,k)=>a+v*f[k],0)/tot;return {f:f.map(v=>v/tot),g,mean}}
SCENE({id:'beauty-contest-levels',name:'Steps of thinking',tag:'Level-k and the cognitive hierarchy',
 definition:'Level-k models describe players who think a limited number of steps ahead: level 0 picks at random, level 1 best-responds to level 0, level 2 to level 1, and so on. The cognitive hierarchy lets each level expect a mix of lower levels.',
 example:'Simple level-k reasoning gives 33, then 22, then 15. With an average of about 1.5 thinking steps, the cognitive hierarchy predicts a first-round average in the mid-30s, close to what experiments find.',
 desc:'Bars show how much of the population thinks k steps for an average depth τ, with each level’s guess underneath, and the predicted average guess on a number line beside Nagel’s observed first-round average.',
 research:'Stahl & Wilson (1995), Games and Economic Behavior 10; Nagel (1995). Camerer, Ho & Chong (2004). A cognitive hierarchy model of games. Quarterly Journal of Economics 119, 861–898: average depth τ ≈ 1.5 fits many games.',
 dur:10,hint:'Move the average number of thinking steps. At τ = 0 everyone guesses at random; as τ grows the predicted average falls towards the equilibrium, 0.',
 init:()=>({tau:1.5}),
 watch(p){return {tau:Math.round(p*40)/10}},
 ui:[{range:'tau',label:'Average steps of thinking (τ)',min:0,max:4,step:.1,get:s=>s.tau,act:'tau',show:v=>Number(v).toFixed(1)}],
 on:{tau(s,v){s.tau=Number(v);return 'keep'}},
 draw(s){
  const {f,g,mean}=E4_ch(s.tau);
  let out=heading('How many steps ahead do people think?',26);
  const bw=60,x0=78,base=200;
  for(let k=0;k<=6;k++){const x=x0+k*(bw+10),h=f[k]*260;
   out+=R(x,base-h,bw,h,C.pale,C.blue,4)+TF(x+bw/2,base-h-6,E4_pct(f[k]),13,C.blue);
   out+=TBF(x+bw/2,base+20,k===0?'level 0':`level ${k}`,13,C.ink)+TF(x+bw/2,base+38,`guess ${fmt(Math.round(g[k]*10)/10)}`,13,C.muted)}
  out+=L(x0-6,base,x0+7*(bw+10)-4,base,C.line,1.5);
  const nx=v=>60+v*4.8;out+=L(nx(0),300,nx(100),300,C.line,2);[0,25,50,75,100].forEach(v=>out+=L(nx(v),296,nx(v),304,C.muted,1.5)+TF(nx(v),322,String(v),13,C.muted));
  out+=P(`M${fmt(nx(mean))} 290 l-7 -12 h14 z`,C.blue,1.5,C.blue)+TF(nx(mean),270,`predicted ${fmt(Math.round(mean*10)/10)}`,13,C.blue);
  out+=P(`M${fmt(nx(37))} 310 l-7 12 h14 z`,C.green,1.5,C.green)+TF(nx(37)+12,346,'observed ≈ 37 (Nagel 1995)',13,C.green,'start');
  out+=T(300,374,`τ = ${s.tau.toFixed(1)}: the predicted average guess is ${fmt(Math.round(mean*10)/10)}`,14,C.ink);
  return {svg:out,phase:'People are not irrational here; they are reasoning a step or two about others who also reason a step or two. Around 1.5 steps on average reproduces typical first-round averages. Only if everyone reasons without limit, and knows everyone else does, do guesses reach 0.'};
 }});

// Keynes's newspaper contest: own taste, average taste, and what people expect average opinion to be (illustrative).
const E4_FACES=[{n:'A',own:.10,avg:.22,exp:.38},{n:'B',own:.14,avg:.30,exp:.26},{n:'C',own:.08,avg:.12,exp:.08},{n:'D',own:.34,avg:.16,exp:.10},{n:'E',own:.22,avg:.12,exp:.10},{n:'F',own:.12,avg:.08,exp:.08}];
SCENE({id:'beauty-contest-keynes',name:'Keynes’s beauty contest',tag:'Average opinion of average opinion',
 definition:'Keynes compared professional investment to a newspaper contest in which you win by picking the faces other entrants pick, so you must anticipate what average opinion expects average opinion to be.',
 example:'A trader may buy a share they think is overvalued if they expect others to keep buying it: what matters is the next buyer, not the company.',
 desc:'Six faces and three degrees of reasoning: your own taste, what most people like, and what people expect most people to pick. The pick changes with the degree; the shares are illustrative.',
 research:'Keynes (1936). The General Theory of Employment, Interest and Money, chapter 12, which describes reaching the third degree “and there are some, I believe, who practise the fourth, fifth and higher degrees”. Thaler’s 1997 Financial Times contest ran the 2/3 game with readers.',
 dur:10,hint:'Change the degree of reasoning and see which face you would pick. The numbers are illustrative.',
 init:()=>({deg:1}),
 watch(p){return {deg:1+Math.min(2,Math.floor(p*3))}},
 ui:[{choose:[[1,'1st: your own taste'],[2,'2nd: what most people like'],[3,'3rd: what people expect most to pick']],label:'Degree',get:s=>s.deg,act:'deg'}],
 on:{deg(s,v){s.deg=Number(v);return 'keep'}},
 draw(s){
  const key=['own','avg','exp'][s.deg-1],best=E4_FACES.reduce((b,f,i)=>f[key]>E4_FACES[b][key]?i:b,0);
  let out=heading('Pick the face others will pick',26);
  E4_FACES.forEach((fc,i)=>{const cx=70+i*92,cy=96,sel=i===best;
   out+=Ci(cx,cy,30,sel?C.amberp:'#fff',sel?C.amber:C.line,sel?'stroke-width="3"':'');
   out+=Ci(cx-10,cy-6,3,C.ink)+Ci(cx+10,cy-6,3,C.ink);
   const smile=[8,4,-2,10,6,0][i];out+=P(`M${cx-12} ${cy+10} Q${cx} ${cy+10+smile} ${cx+12} ${cy+10}`,C.ink,2);
   out+=TBF(cx,cy+50,fc.n,14,sel?C.amber:C.ink);
   [['own',C.blue],['avg',C.purple],['exp',C.green]].forEach(([k,col],j)=>{const y=168+j*30,w=fc[k]*160;out+=R(cx-36,y,Math.max(1,w),18,col,k===key?C.ink:'none',3,k===key?'stroke-width="1.6"':'opacity=".55"')});
  });
  out+=TF(30,182,'',13,C.ink);
  out+=TF(582,182,'own taste',13,C.blue,'end')+TF(582,212,'most like',13,C.purple,'end')+TF(582,242,'expected pick',13,C.green,'end');
  out+=R(30,272,540,98,C.pale,'none',10);
  out+=TBF(46,294,['First degree: you pick the face you like best.','Second degree: you pick the face most people like.','Third degree: you pick what people expect most people to pick.'][s.deg-1],14,C.ink,'start');
  out+=E4_lines(46,318,['In a market the same logic means pricing what others will pay next,','not what an asset is worth. The 2/3 game turns this into numbers.'],13,C.ink);
  out+=TF(46,360,'Bar lengths are illustrative, not survey data.',13,C.muted,'start');
  return {svg:out,phase:`At degree ${s.deg} you pick face ${E4_FACES[best].n}. Keynes’s point was that skilled investors spend their effort anticipating the crowd rather than judging value, which can make prices drift from fundamentals.`};
 }});

/* ---------------------------------------------------------------- auctions */
const E4_FMT=[['english','English (rising price)'],['dutch','Dutch (falling price)'],['first','First-price sealed bid'],['second','Second-price sealed bid']];
const E4_vals=seed=>{const r=E4_rng(seed*17+3);return range(5).map(()=>Math.round(8+r()*88))};
const E4_BID=['A','B','C','D','E'];
function E4_auction(fmtK,vals,tt){const n=vals.length,ord=vals.map((v,i)=>i).sort((a,b)=>vals[b]-vals[a]),top=ord[0],sec=vals[ord[1]],u=tt/100;
 const bids=vals.map(v=>fmtK==='first'||fmtK==='dutch'?Math.round(v*(n-1)/n):v);
 if(fmtK==='english'){const price=Math.round(u*(sec+1));return {price,active:vals.map(v=>v>price),done:u>=1,winner:u>=1?top:null,pay:sec+1,bids:null}}
 if(fmtK==='dutch'){const price=Math.round(100-u*(100-bids[top]));return {price,active:vals.map(()=>true),done:u>=1,winner:u>=1?top:null,pay:bids[top],bids:null}}
 const open=u>=.5;return {price:null,active:vals.map(()=>true),done:open,winner:open?top:null,pay:fmtK==='first'?bids[top]:bids[ord[1]],bids:open?bids:null}}
SCENE({id:'auctions',name:'Four ways to sell',tag:'English, Dutch and sealed bids',
 definition:'An auction is a set of rules for turning bids into a sale. In an English auction the price rises until one bidder is left; in a Dutch auction it falls until someone accepts; in sealed-bid auctions the highest bid wins and pays either its own bid (first price) or the second-highest bid (second price).',
 example:'Flower auctions in the Netherlands use a falling clock; eBay works like a second-price auction with a rising price; many government contracts use sealed bids.',
 desc:'Five bidders with private values (pale bars). A clock slider runs the chosen auction: bidders drop out, the clock falls, or the envelopes open. The result shows who wins, what they pay and what they keep.',
 research:'Vickrey (1961). Counterspeculation, auctions, and competitive sealed tenders. Journal of Finance 16, 8–37. Milgrom & Wilson (2020 Nobel) for auction theory and new formats; the UK’s 2000 3G spectrum auction raised about £22.5 billion.',
 dur:12,hint:'Choose a format and move the auction clock. In the sealed-bid formats, bidders bid four-fifths of their value (first price) or their value (second price), as theory predicts for five bidders.',
 init:()=>({fmtK:'english',seed:3,tt:0}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {fmtK:E4_FMT[k][0],seed:3,tt:Math.round(Math.min(1,(p*4-k)*1.25)*100)}},
 ui:[{choose:E4_FMT,label:'Format',get:s=>s.fmtK,act:'fmt'},{range:'tt',label:'Auction clock',min:0,max:100,get:s=>s.tt,act:'tt'},{b:'Sold!',act:'sold'},{b:'New bidders',act:'again'}],
 on:{fmt(s,v){s.fmtK=v;s.tt=0;return 'keep'},tt(s,v){s.tt=Number(v);return 'keep'},sold(s){s.tt=100;AUDIO.tone(196,{dur:.09,type:'square',gain:.08});AUDIO.tone(196,{dur:.12,type:'square',gain:.08,at:.16});return 'keep'},again(s){s.seed=nextSeed();s.tt=0}},
 draw(s){
  const vals=E4_vals(s.seed),a=E4_auction(s.fmtK,vals,s.tt),bx=v=>140+v*3.6;
  let out=heading(E4_FMT.find(f=>f[0]===s.fmtK)[1],26);
  out+=L(bx(0),48,bx(0),262,C.line,1.5);[0,25,50,75,100].forEach(v=>out+=TF(bx(v),280,String(v),13,C.muted));
  vals.forEach((v,i)=>{const y=54+i*42,act=a.active[i],win=a.winner===i;
   out+=TBF(70,y+21,`Bidder ${E4_BID[i]}`,14,win?C.green:act?C.ink:C.muted,'middle');
   out+=R(bx(0),y+6,v*3.6,22,win?C.greenp:C.pale,win?C.green:'none',4,act?'':'opacity=".45"')+TF(bx(v)+6,y+22,`value ${v}`,13,act?C.muted:C.grid,'start');
   if(a.bids)out+=L(bx(a.bids[i]),y+2,bx(a.bids[i]),y+32,C.blue,3)+TF(bx(a.bids[i])-4,y+2,`bid ${a.bids[i]}`,13,C.blue,'end');
   if((s.fmtK==='first'||s.fmtK==='second')&&!a.bids)out+=R(bx(0)+4,y+9,26,16,'#fff',C.muted,2)+P(`M${bx(0)+4} ${y+9} l13 9 l13 -9`,C.muted,1.2);
   if(s.fmtK==='english'&&!act)out+=TF(bx(v)+70,y+22,'dropped out',13,C.coral,'start')});
  if(a.price!==null)out+=L(bx(a.price),44,bx(a.price),268,C.coral,2.5)+TBF(bx(a.price),300,`price ${a.price}`,14,C.coral);
  out+=R(30,312,540,58,a.done?C.greenp:C.pale,'none',10);
  if(a.done){const w=a.winner,surplus=vals[w]-a.pay;out+=TBF(46,334,`Bidder ${E4_BID[w]} wins and pays ${a.pay}`,15,C.green,'start')+TF(46,356,`Value ${vals[w]}, so the winner keeps ${surplus}. The seller receives ${a.pay}.`,13,C.ink,'start')}
  else out+=T(300,346,s.fmtK==='english'?'The price rises; bidders leave once it passes their value.':s.fmtK==='dutch'?'The price falls; the first bidder to accept wins at that price.':'Bids are sealed: move the clock past half-way to open them.',14,C.muted);
  return {svg:out,phase:'The English auction ends just above the second-highest value, which is exactly what the winner pays in a second-price sealed auction. A Dutch auction is strategically the same as a first-price sealed auction: you decide in advance where to stop the clock. In each case the highest-value bidder wins.'};
 }});

function E4_revenue(n,trials=600){const r=E4_rng(n*911+7),fp=[],sp=[];
 for(let t=0;t<trials;t++){const v=range(n).map(()=>r()*100).sort((a,b)=>b-a);fp.push(v[0]*(n-1)/n);sp.push(v[1])}return {fp,sp}}
SCENE({id:'auctions-revenue',name:'Revenue equivalence',tag:'Different rules, same average price',
 definition:'The revenue equivalence theorem says that, under standard assumptions (independent private values, risk-neutral bidders, the highest value always winning), all these auction formats raise the same expected revenue.',
 example:'With values spread evenly from 0 to 100 and five bidders, both first-price and second-price auctions average about 67: first-price winners shade their bids, second-price winners pay the runner-up.',
 desc:'Six hundred simulated auctions for each format with the chosen number of bidders. Histograms show the revenue each time; the averages sit together at (n − 1) ÷ (n + 1) of the top value, though first-price revenue varies less.',
 research:'Vickrey (1961), Journal of Finance 16. Myerson (1981). Optimal auction design. Mathematics of Operations Research 6, 58–73. Riley & Samuelson (1981), American Economic Review 71. Risk aversion and correlated values break the equivalence.',
 dur:10,hint:'Change the number of bidders. More competition raises the average price for both formats, and they stay equal on average.',
 init:()=>({n:5}),
 watch(p){return {n:2+Math.min(8,Math.floor(p*9))}},
 ui:[{range:'n',label:'Bidders',min:2,max:10,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=Number(v);return 'keep'}},
 draw(s){
  const {fp,sp}=E4_revenue(s.n),mean=a=>a.reduce((x,y)=>x+y,0)/a.length,theory=(s.n-1)/(s.n+1)*100;
  let out=heading(`Revenue from 600 auctions with ${s.n} bidders`,26);
  const hist=a=>{const b=Array(20).fill(0);a.forEach(v=>b[Math.min(19,Math.floor(v/5))]++);return b};
  const hf=hist(fp),hs=hist(sp),mx=Math.max(...hf,...hs);
  const pl=E4_plot(70,52,460,220,[0,100],[0,mx*1.1],{xt:[[0,'0'],[25,'25'],[50,'50'],[75,'75'],[100,'100']],yt:[[0,'0']],xl:'seller’s revenue (top possible value = 100)',yl:'auctions'});
  out+=pl.svg;
  const step=(b,col,w)=>{const pts=[];b.forEach((c,i)=>{pts.push([pl.X(i*5),pl.Y(c)],[pl.X(i*5+5),pl.Y(c)])});return E4_poly([[pl.X(0),pl.Y(0)]].concat(pts,[[pl.X(100),pl.Y(0)]]),col,w)};
  out+=step(hs,C.coral,2.2)+step(hf,C.blue,2.6);
  const mF=mean(fp),mS=mean(sp);
  out+=L(pl.X(theory),52,pl.X(theory),272,C.green,2,'stroke-dasharray="5 4"');
  out+=TF(pl.X(theory)+(theory>60?-6:6),70,`theory ${fmt(Math.round(theory*10)/10)}`,13,C.green,theory>60?'end':'start');
  out+=R(80,318,14,14,C.blue,'none',3)+TF(102,330,`First price: average ${fmt(Math.round(mF*10)/10)}`,14,C.blue,'start');
  out+=R(330,318,14,14,C.coral,'none',3)+TF(352,330,`Second price: average ${fmt(Math.round(mS*10)/10)}`,14,C.coral,'start');
  out+=T(300,366,'Values drawn evenly from 0 to 100; first-price bidders bid (n − 1) ÷ n of their value.',13,C.muted);
  return {svg:out,phase:'Shading bids in a first-price auction and paying the runner-up’s bid in a second-price one balance out exactly on average. The formats differ in risk and in how easy they are to play: the second-price auction asks bidders only to state their value.'};
 }});

const E4_bidRound=(seed,k)=>{const r=E4_rng(seed*53+k*7+1);return {v:Math.round(20+r()*75),rivals:range(3).map(()=>Math.round(r()*100))}};
SCENE({id:'auctions-bid',name:'Bid in a second-price auction',tag:'Is bidding your value best?',
 definition:'In a second-price sealed-bid auction, bidding exactly your value is a dominant strategy: bidding more risks winning at a price above your value, bidding less risks losing a sale you would have profited from.',
 example:'Your value is 60 and the best rival bids 55. Bid 60 and you win, paying 55. Bid 50 and you lose a gain of 5. Had the rival bid 70, bidding 80 would have won you a loss of 10.',
 desc:'Eight rounds, each with your private value and three rival bids you cannot see. You choose a bid; afterwards you see whether you won, what you paid, and what bidding exactly your value would have earned.',
 research:'Vickrey (1961), Journal of Finance 16: truthful bidding is dominant. Kagel, Harstad & Levin (1987), Econometrica 55: lab bidders often overbid in second-price auctions. Bazerman & Samuelson (1983), Journal of Conflict Resolution 27: the winner’s curse with common values.',
 dur:12,hint:'Set your bid and Submit. Rivals bid their own values, drawn at random. Compare your earnings with what bidding your value would have earned. Your bids stay in this page.',
 init:()=>({seed:9,b:50,res:[]}),
 watch(p){const n=Math.min(8,Math.floor(p*9)),res=range(n).map(k=>{const r=E4_bidRound(9,k);return {bid:Math.min(100,Math.round(r.v*1.12))}});return {seed:9,b:50,res,sim:true}},
 ui:[{range:'b',label:'Your bid',min:0,max:100,get:s=>s.b,act:'b'},{b:'Submit bid',act:'submit'},{b:'Start again',act:'again'}],
 on:{b(s,v){s.b=Number(v);return 'keep'},submit(s){if(s.res.length<8)s.res.push({bid:s.b});return 'keep'},again(s){s.seed=nextSeed();s.res=[];s.b=50}},
 draw(s){
  const k=s.res.length;let out=heading('Second-price auction: what should you bid?',26);
  if(k<8){const r=E4_bidRound(s.seed,k);out+=R(30,46,540,48,C.pale,'none',10)+TB(300,76,`Round ${k+1} of 8: your value is ${r.v}. ${s.sim?'':'Your bid: '+s.b}`,15,C.ink)}
  else out+=R(30,46,540,48,C.greenp,'none',10)+TB(300,76,'All eight rounds played',15,C.green);
  const cols=[60,130,200,290,390,500],hy=120;
  ['Round','Value','Bid','Best rival','You earned','Bid = value'].forEach((h,i)=>out+=TBF(cols[i],hy,h,13,C.ink));
  out+=L(30,hy+8,570,hy+8,C.line,1);
  let tot=0,tru=0;
  for(let i=0;i<8;i++){const y=hy+28+i*24,res=s.res[i];out+=TF(cols[0],y,String(i+1),13,C.muted);
   if(res){const r=E4_bidRound(s.seed,i),best=Math.max(...r.rivals),win=res.bid>best,earn=win?r.v-best:0,tEarn=r.v>best?r.v-best:0;tot+=earn;tru+=tEarn;
    out+=TF(cols[1],y,String(r.v),13,C.ink)+TF(cols[2],y,String(res.bid),13,res.bid>r.v?C.coral:res.bid<r.v?C.amber:C.blue)+TF(cols[3],y,String(best),13,C.muted)+TF(cols[4],y,win?E4_n(earn):'lost',13,earn<0?C.coral:C.ink)+TF(cols[5],y,tEarn?String(tEarn):'0',13,C.green)}}
  const over=s.res.filter((res,i)=>res.bid>E4_bidRound(s.seed,i).v).length;
  out+=L(30,hy+212,570,hy+212,C.line,1);
  out+=TBF(cols[4],hy+232,E4_n(tot),14,tot<tru?C.coral:C.ink)+TBF(cols[5],hy+232,String(tru),14,C.green)+TF(cols[3]+30,hy+232,'Totals',13,C.muted,'end');
  out+=T(300,376,k?`${s.sim?'The simulated bidder':'You'} bid above value in ${over} of ${k} rounds. Bidding your value never earns less.`:'Coral bids are above your value, amber below, blue exactly equal.',13,C.muted);
  return {svg:out,phase:'Your bid only decides whether you win, never what you pay, so the best bid is the one that wins exactly when winning is profitable: your value. In the lab many people still overbid, perhaps because overbidding rarely costs much and feels like a better chance of winning.'};
 }});

/* ---------------------------------------------------------------- governing-commons */
// A shared pasture (toy model): grass regrows logistically; each cow eats 1% of the grass each season.
// Open access: herders add a cow while a cow's grass is worth more than its upkeep (0.2) and remove one when it is not.
function E4_pasture(n,rule,seasons=40){let G=100,cows=n;const out=[{G,cows}];
 for(let t=0;t<seasons;t++){const eat=Math.min(G,.01*cows*G);G=Math.max(0,G-eat);G=Math.min(100,G+.5*G*(1-G/100));
  if(rule==='open'){const perCow=.01*G;cows=Math.max(0,cows+(perCow>.2?n:-n))}else cows=Math.min(25,cows+n);
  out.push({G,cows})}return out}
SCENE({id:'governing-commons',name:'The tragedy of the commons',tag:'Hardin’s pasture, 1968',
 definition:'The tragedy of the commons is the overuse of a shared resource when each user gains the full benefit of taking more but bears only a share of the cost. Hardin’s example was a pasture open to all.',
 example:'Each herder who adds a cow gains its whole value but shares the damage to the grass with everyone, so herds grow until the pasture is ruined.',
 desc:'A toy pasture over 40 seasons. With open access, herders keep adding cows while a cow pays its way; with a quota, the herd is capped at the level the grass can sustain. Lines show grass and cows season by season.',
 research:'Hardin (1968). The tragedy of the commons. Science 162, 1243–1248. Gordon (1954), Journal of Political Economy 62: open-access fisheries dissipate their value. Hardin (1998), Science 280, later wrote that he should have said the “unmanaged” commons. This is a toy model with illustrative numbers.',
 dur:12,hint:'Change the number of herders and the rule. Under open access, more herders means faster growth and a deeper collapse; the quota holds the herd at the sustainable level.',
 init:()=>({n:6,rule:'open',t:40}),
 watch(p){return {n:6,rule:p<.5?'open':'quota',t:Math.round(((p*2)%1)*40)}},
 ui:[{choose:[['open','Open access'],['quota','Shared quota']],label:'Rule',get:s=>s.rule,act:'rule'},{range:'n',label:'Herders',min:2,max:16,get:s=>s.n,act:'n'},{range:'t',label:'Season',min:0,max:40,get:s=>s.t,act:'t'}],
 on:{rule(s,v){s.rule=v;return 'keep'},n(s,v){s.n=Number(v);return 'keep'},t(s,v){s.t=Number(v);return 'keep'}},
 draw(s){
  const sim=E4_pasture(s.n,s.rule),now=sim[s.t];
  let out=heading(`${s.rule==='open'?'Open access':'A shared quota'}: ${s.n} herders`,26);
  const g=now.G/100,green=`rgb(${Math.round(196-110*g)},${Math.round(186+20*g)},${Math.round(150-60*g)})`;
  out+=R(30,48,210,150,green,C.line,10);
  const shown=Math.min(60,Math.round(now.cows)),r=E4_rng(5);
  for(let i=0;i<shown;i++){const x=46+r()*178,y=60+r()*126;out+=R(x-6,y-4,12,8,'#fff',C.ink,2,'stroke-width="1.2"')}
  out+=TF(135,216,`grass ${Math.round(now.G)}% · ${Math.round(now.cows)} cows`,13,C.ink);
  const pl=E4_plot(300,52,270,150,[0,40],[0,100],{xt:[[0,'0'],[20,'20'],[40,'40']],yt:[[0,'0'],[50,'50'],[100,'100']],xl:'season',yl:'grass (%) and cows'});
  out+=pl.svg;
  out+=E4_poly(sim.slice(0,s.t+1).map((d,i)=>[pl.X(i),pl.Y(d.G)]),C.green,2.6)+E4_poly(sim.slice(0,s.t+1).map((d,i)=>[pl.X(i),pl.Y(Math.min(100,d.cows))]),C.amber,2.4);
  out+=L(pl.X(s.t),52,pl.X(s.t),202,C.ink,1,'stroke-dasharray="3 4"');
  out+=R(310,236,12,12,C.green,'none',2)+TF(328,247,'grass',13,C.muted,'start')+R(390,236,12,12,C.amber,'none',2)+TF(408,247,'cows',13,C.muted,'start');
  const tail=sim.slice(20),avgG=tail.reduce((a,d)=>a+d.G,0)/tail.length,avgYield=tail.reduce((a,d)=>a+.01*d.cows*d.G,0)/tail.length;
  out+=R(30,268,540,100,C.pale,'none',10);
  out+=TBF(46,290,`Seasons 20–40: grass averages ${Math.round(avgG)}%, grass eaten ${fmt(Math.round(avgYield*10)/10)} a season`,14,C.ink,'start');
  out+=TF(46,314,'The most the pasture can give for ever is 12.5 a season, at half its full growth.',13,C.ink,'start');
  out+=E4_lines(46,336,s.rule==='open'?['Open access: herds grow until a cow barely pays its upkeep, and overshoot.','More herders add cows faster, so the swings are deeper.']:['The quota caps the herd at 25 cows, which takes the sustainable 12.5 a season.','Hardin’s answer was “mutual coercion, mutually agreed upon”.'],13,C.muted);
  return {svg:out,phase:'Hardin’s argument is about open access: nobody can be kept out and nobody limits the take. Elinor Ostrom showed that many real commons are neither open access nor run by a state, and that their users often make and enforce rules that work.'};
 }});

// A common-pool fishery game (toy): stock regrows by 60% × S × (1 − S/100); four simulated fishers follow the chosen setting.
const E4_FMODES=[['silent','No talking'],['talk','Talking allowed'],['sanction','Talking and fines']];
function E4_fishOthers(seed,season,mode,stock){const r=E4_rng(seed*41+season*3),c=[];
 for(let i=0;i<4;i++){let x;if(mode==='silent')x=5+Math.round(r()*3);else{const cheat=r()<(mode==='talk'?.3:.08);x=cheat?6:3}c.push(x)}return c}
function E4_fishRun(seed,mode,mine){let S=100;const rows=[];
 mine.forEach((m,t)=>{const others=E4_fishOthers(seed,t,mode,S),want=m+others.reduce((a,b)=>a+b,0),scale=want>S?S/want:1,got=[m].concat(others).map(x=>x*scale);
  const before=S;S=Math.max(0,S-want*scale);S=Math.min(100,S+.6*S*(1-S/100));rows.push({before,you:got[0],others:got.slice(1),after:S})});return {rows,S}}
SCENE({id:'governing-commons-game',name:'Fish a shared lake',tag:'A common-pool resource game',
 definition:'A common-pool resource is one that is hard to fence off and is used up as it is taken, like a fishery. Lab games let economists test what helps groups avoid overuse.',
 example:'In Ostrom, Walker & Gardner’s experiments, groups that could talk took far less than groups that could not, and groups that could also fine each other did better still.',
 desc:'Eight seasons fishing a shared lake with four simulated fishers. The stock regrows fastest at half full, where five fishers can take 3 each for ever. You choose your catch; the setting decides how the others behave.',
 research:'Ostrom, Walker & Gardner (1992). Covenants with and without a sword: self-governance is possible. American Political Science Review 86, 404–417. Ostrom (2000). Collective action and the evolution of social norms. Journal of Economic Perspectives 14(3). The simulated fishers are illustrative, not fitted to data.',
 dur:12,hint:'Choose your catch and press Fish. Switch the setting to see how talking and fines change what the others take. Your choices stay in this page.',
 init:()=>({seed:5,mode:'silent',c:3,mine:[]}),
 watch(p){const n=Math.min(8,Math.floor(p*9));return {seed:5,mode:'talk',c:3,mine:Array(n).fill(3),sim:true}},
 ui:[{choose:E4_FMODES,label:'Setting',get:s=>s.mode,act:'mode'},{range:'c',label:'Your catch this season',min:0,max:10,get:s=>s.c,act:'c'},{b:'Fish',act:'fish'},{b:'Start again',act:'again'}],
 on:{mode(s,v){s.mode=v;s.mine=[];return 'keep'},c(s,v){s.c=Number(v);return 'keep'},fish(s){if(s.mine.length<8)s.mine.push(s.c);return 'keep'},again(s){s.seed=nextSeed();s.mine=[]}},
 draw(s){
  const run=E4_fishRun(s.seed,s.mode,s.mine),n=s.mine.length;
  let out=heading(`Fish a shared lake: ${E4_FMODES.find(m=>m[0]===s.mode)[1].toLowerCase()}`,26);
  const pl=E4_plot(70,56,250,170,[0,8],[0,100],{xt:[[0,'0'],[4,'4'],[8,'8']],yt:[[0,'0'],[50,'50'],[100,'100']],xl:'season',yl:'fish in the lake'});
  out+=pl.svg+L(pl.X(0),pl.Y(50),pl.X(8),pl.Y(50),C.green,1.5,'stroke-dasharray="5 4"')+TF(pl.X(8)-4,pl.Y(50)-6,'fastest regrowth',13,C.green,'end');
  out+=E4_poly([[pl.X(0),pl.Y(100)]].concat(run.rows.map((r,i)=>[pl.X(i+1),pl.Y(r.after)])),C.blue,2.6);
  run.rows.forEach((r,i)=>out+=Ci(pl.X(i+1),pl.Y(r.after),4,C.blue,'#fff'));
  const you=run.rows.reduce((a,r)=>a+r.you,0),oth=run.rows.reduce((a,r)=>a+r.others.reduce((x,y)=>x+y,0),0)/4;
  out+=R(350,56,230,170,C.pale,'none',10);
  out+=TBF(465,78,n<8?`Season ${n+1} of 8`:'Eight seasons done',14,C.ink);
  out+=TF(362,104,`Fish now: ${Math.round(run.S)}`,13,C.ink,'start');
  out+=TF(362,128,`${s.sim?'Simulated':'Your'} catch so far: ${fmt(Math.round(you*10)/10)}`,13,C.blue,'start');
  out+=TF(362,150,`Each other fisher, average: ${fmt(Math.round(oth*10)/10)}`,13,C.coral,'start');
  out+=L(362,164,568,164,C.line,1);
  out+=TF(362,186,'Sustainable: 3 each a season,',13,C.green,'start')+TF(362,204,'24 each over 8 seasons.',13,C.green,'start');
  const last=run.rows[n-1];
  out+=R(30,256,540,112,'#fff',C.grid,10);
  if(last)out+=TBF(46,278,`Last season: you took ${fmt(Math.round(last.you*10)/10)}, the others ${last.others.map(x=>fmt(Math.round(x*10)/10)).join(', ')}`,13,C.ink,'start');
  else out+=TBF(46,278,'Choose your catch and press Fish.',13,C.ink,'start');
  const note={silent:'Without talking, the others each take 5 to 8: well above what the lake can replace.',talk:'With talking, the others agree on 3 each, but some cheat and take 6.',sanction:'With talking and fines, cheating is rare and the agreed 3 mostly holds.'}[s.mode];
  out+=E4_lines(46,302,E4_wrap(note,82),13,C.ink);
  out+=TF(46,352,'If everyone takes more than the lake regrows, the stock collapses and later catches vanish.',13,C.muted,'start');
  return {svg:out,phase:'The lake regrows fastest when half full. Taking 3 each keeps it there; taking more pays this season and costs every season after. Talking alone helps, and the ability to fine cheats helps more, as Ostrom and her colleagues found in the lab.'};
 }});

const E4_PRIN=[
 {n:'Clear boundaries',d:'Who may use the resource, and its edges, are clearly defined.',ex:'Törbel, Switzerland: only citizens of the village may graze the common alpine meadows.'},
 {n:'Rules fit local conditions',d:'Rules about what can be taken match the place, and match what users put in.',ex:'Törbel’s rule since 1517: no one may send more cows to the alp than they can feed over the winter.'},
 {n:'Users help make the rules',d:'Most people affected by the rules can take part in changing them.',ex:'Japanese mountain villages such as Hirano and Yamanoka set harvest rules for their common lands in village meetings.'},
 {n:'Monitoring',d:'Those who check the resource and behaviour are accountable to the users, or are the users.',ex:'In the Japanese villages, detectives chosen by rotation patrolled the commons.'},
 {n:'Graduated sanctions',d:'Penalties start small and grow with the seriousness or repetition of the offence.',ex:'Valencia’s irrigators: fines scaled to the offence, set by the irrigators’ own court.'},
 {n:'Cheap conflict resolution',d:'Users have quick, low-cost local ways to settle disputes.',ex:'The Tribunal de las Aguas has met at the door of Valencia Cathedral every Thursday for centuries.'},
 {n:'Right to organise',d:'Outside authorities recognise the users’ right to make their own rules.',ex:'Where governments overrode local rules, as with some nationalised forests, management often worsened.'},
 {n:'Nested enterprises',d:'For larger systems, rules are organised in layers, from local groups up.',ex:'The zanjera irrigation societies of the Philippines federate small local groups to manage shared canals.'}];
SCENE({id:'governing-commons-principles',name:'Ostrom’s design principles',tag:'How real commons last',
 definition:'Elinor Ostrom studied commons that had lasted for centuries and found eight conditions they shared. She called them design principles: not a blueprint, but features that long-lived institutions tend to have.',
 example:'Swiss alpine meadows, Japanese common forests and Spanish irrigation systems were managed by their users for hundreds of years without privatisation or state control.',
 desc:'Ostrom’s eight design principles as a list; pressing one shows what it means and an example from the cases she studied.',
 research:'Ostrom (1990). Governing the Commons: The Evolution of Institutions for Collective Action. Cambridge University Press. Cox, Arnold & Villamayor Tomás (2010), Ecology and Society 15(4): a review of 91 studies found the principles well supported. Ostrom shared the 2009 economics Nobel, the first woman to receive it.',
 dur:12,hint:'Press a principle to see what it means and where Ostrom found it.',
 init:()=>({sel:0}),
 watch(p){return {sel:Math.min(7,Math.floor(p*8))}},
 on:{sel(s,v){s.sel=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Ostrom’s eight design principles',26);
  E4_PRIN.forEach((pr,i)=>{const col=i%2,row=Math.floor(i/2),x=30+col*275,y=44+row*44,on=i===s.sel;
   const inner=R(x,y,265,36,on?C.greenp:'#fff',on?C.green:C.grid,8,on?'stroke-width="2.5"':'')+TBF(x+16,y+23,`${i+1}`,14,on?C.green:C.muted,'start')+TF(x+36,y+23,pr.n,14,C.ink,'start');
   out+=hit(X,'sel',i,`Principle ${i+1}: ${pr.n}`,inner)});
  const pr=E4_PRIN[s.sel];
  out+=R(30,232,540,136,C.pale,'none',10);
  out+=TBF(46,256,`${s.sel+1}. ${pr.n}`,15,C.green,'start');
  out+=E4_lines(46,280,E4_wrap(pr.d,80).slice(0,2),13,C.ink);
  out+=TBF(46,322,'Example',13,C.muted,'start')+E4_lines(46,342,E4_wrap(pr.ex,80).slice(0,2),13,C.ink);
  return {svg:out,phase:'Ostrom’s work answered Hardin: the choice is not only between privatising a commons and handing it to the state. Users who can set, watch and enforce their own rules often manage shared resources well, though the principles are tendencies, not guarantees.'};
 }});
