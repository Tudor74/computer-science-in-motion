/* ===================== Mind era 2 · Learning and behaviour (1885–1950) ===================== */
// Forgetting, conditioning, the law of effect, schedules of reinforcement, cognitive maps and Gestalt grouping.
// Where it is short, safe and honest the learner is the participant: handlers time responses with
// performance.now() and store them in the state; draw() stays a pure function of state, frame and X.
// Watch mode shows a labelled simulated participant. Trial orders use seeded shuffles (D2_mix hashes seeds).
// Nothing the learner does leaves the page.
const D2_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const D2_rng=n=>rng(D2_mix(n));
function D2_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const D2_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function D2_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-7,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// Least-squares straight line through [x,y] pairs.
function D2_fit(pts){const n=pts.length;if(n<2)return null;const mx=sum(pts.map(p=>p[0]))/n,my=sum(pts.map(p=>p[1]))/n;let sxy=0,sxx=0;pts.forEach(([x,y])=>{sxy+=(x-mx)*(y-my);sxx+=(x-mx)**2});if(!sxx)return null;const b=sxy/sxx;return {a:my-b*mx,b}}
const D2_tick=()=>AUDIO.tone(880,{dur:.12,gain:.12});

/* =========================== forgetting-curve =========================== */
// Nonsense syllables: consonant–vowel–consonant, chosen to avoid English words.
const D2_SYL=['DAX','BUP','ZOL','KEB','MIV','TOZ','GEX','WOJ','LAZ','PIQ','RUV','HUQ','SIJ','FIK','JOM','NUD','VAQ','YIB','CUV','QAP','XEM','ZUK','BIW','DOJ','KUZ','LOJ','MUQ','PEQ','RIX','TAV','GOQ','FUJ'];
function D2_fcSets(seed){const all=shuffled(D2_SYL,D2_mix(seed));const study=all.slice(0,8),lures=all.slice(8,16);const test=shuffled(study.concat(lures),D2_mix(seed+7));return {study,test}}
// Ebbinghaus (1885): savings in relearning, % of original learning time, against delay in minutes.
const D2_EBB=[[20,58.2],[60,44.2],[528,35.8],[1440,33.7],[2880,27.8],[8640,25.4],[44640,21.1]];
const D2_lt=m=>Math.log10(m);
// The simulated participant ticks six studied syllables and one lure.
const D2_simMarks=sets=>{const old=[],lure=[];sets.test.forEach((w,i)=>(sets.study.includes(w)?old:lure).push(i));return old.slice(0,6).concat(lure.slice(0,1)).sort((a,b)=>a-b)};
function D2_fcScore(sets,marked){let hits=0,fa=0;sets.test.forEach((w,i)=>{if(marked[i]){if(sets.study.includes(w))hits++;else fa++}});return {hits,fa,pc:Math.max(0,(hits-fa)/8*100)}}
SCENE({id:'forgetting-curve',name:'The forgetting curve',tag:'You are the participant',
 definition:'Memory for new material falls quickly at first and then more and more slowly. Ebbinghaus measured it on himself in 1885 with lists of nonsense syllables, so that meaning could not help.',
 example:'Twenty minutes after learning a list Ebbinghaus had already lost about 40% of the effort he had put in; a month later he still kept about 20%.',
 desc:'A short memory test: eight nonsense syllables shown one at a time, a counting task, then a grid of sixteen syllables to recognise; your score is plotted beside Ebbinghaus’s forgetting curve.',
 research:'Ebbinghaus, H. (1885). Über das Gedächtnis (Memory: A Contribution to Experimental Psychology, trans. 1913). Replicated closely by Murre & Dros (2015), PLoS ONE 10(7).',
 dur:14,hint:'Press Start, read the eight syllables, count back in threes while you wait, then tick the ones you saw and press Done. About 40 seconds. Nothing you do leaves this page.',
 init:()=>({seed:1,stage:'ready',shown:0,count:0,marked:Array(16).fill(false),tEnd:0,delay:0,score:null}),
 watch(p){const sets=D2_fcSets(1),m=Array(16).fill(false);
  if(p<.35)return {seed:1,stage:'study',shown:Math.min(7,Math.floor(p/.35*8)),marked:m,score:null,sim:true};
  if(p<.45)return {seed:1,stage:'wait',count:Math.max(1,Math.round((.45-p)/.1*12)),marked:m,score:null,sim:true};
  const sm=D2_simMarks(sets),k=p<.75?Math.floor((p-.45)/.3*sm.length):sm.length;
  sm.slice(0,k).forEach(i=>m[i]=true);
  return {seed:1,stage:p<.75?'test':'done',marked:m,delay:.5,score:p<.75?null:D2_fcScore(sets,m),sim:true}},
 ui:[{b:'Start',act:'start'},{b:'Done',act:'done'},{b:'New list',act:'again'}],
 on:{start(s,_,ctx){s.stage='study';s.shown=0;s.marked=Array(16).fill(false);s.score=null;ctx.every(1200,'tick')},
  tick(s,_,ctx){if(s.stage!=='study')return 'stop';s.shown++;if(s.shown>=8){s.shown=7;s.stage='wait';s.count=12;s.tEnd=performance.now();ctx.every(1000,'wait');return 'stop'}},
  wait(s){if(s.stage!=='wait')return 'stop';s.count--;if(s.count<=0){s.stage='test';return 'stop'}},
  mark(s,i){if(s.stage==='test')s.marked[Number(i)]=!s.marked[Number(i)]},
  done(s){if(s.stage!=='test')return;s.delay=(performance.now()-s.tEnd)/60000;s.score=D2_fcScore(D2_fcSets(s.seed),s.marked);s.stage='done'},
  again(s){s.seed=nextSeed();s.stage='ready';s.shown=0;s.marked=Array(16).fill(false);s.score=null}},
 draw(s,f,X){
  const sets=D2_fcSets(s.seed);let out=heading('Learn eight nonsense syllables, then recognise them',26);
  out+=R(20,46,290,290,'#f6f9fb','none',8);
  if(s.stage==='ready')out+=T(165,170,'Press Start.',17,C.ink)+TF(165,198,'Eight syllables, 1.2 s each,',14,C.muted)+TF(165,218,'then 12 s of counting,',14,C.muted)+TF(165,238,'then a recognition test.',14,C.muted);
  else if(s.stage==='study')out+=TF(165,90,`syllable ${s.shown+1} of 8`,14,C.muted)+R(85,130,160,90,'#fff',C.line,8)+TM(165,190,sets.study[s.shown],40,C.ink);
  else if(s.stage==='wait')out+=T(165,150,'Count backwards in threes',17,C.ink)+T(165,176,'from 97, out loud or in your head.',15,C.ink)+TB(165,240,`${s.count} s`,30,C.coral);
  else{sets.test.forEach((w,i)=>{const x=34+(i%4)*68,y=66+Math.floor(i/4)*62,on=s.marked[i],old=sets.study.includes(w),show=s.stage==='done';
    const stroke=show?(old?C.green:C.line):(on?C.blue:C.line);
    out+=hit(X,'mark',i,`${w}${on?', ticked':''}`,R(x,y,60,50,on?C.pale:'#fff',stroke,6,show&&old?'stroke-width="3"':'')+TMF(x+30,y+32,w,17,C.ink)+(on?TF(x+52,y+16,'✓',13,C.blue):''))});
   out+=TF(165,326,s.stage==='done'?'green outline = was in the list':'tick the syllables you saw',13,C.muted)}
  const pl=D2_plot(360,58,214,226,[-1,4.8],[0,100],{xt:[[-1,'6 s'],[0,'1 min'],[D2_lt(60),'1 h'],[D2_lt(1440),'1 d'],[D2_lt(44640),'31 d']],yt:[[0,'0%'],[50,'50%'],[100,'100%']],yl:'kept'});out+=pl.svg;
  out+=D2_poly(D2_EBB.map(([m,v])=>[pl.X(D2_lt(m)),pl.Y(v)]),C.coral,2.2,'stroke-dasharray="6 4"');
  D2_EBB.forEach(([m,v])=>out+=Ci(pl.X(D2_lt(m)),pl.Y(v),4,C.coral));
  out+=TF(pl.X(4.7),pl.Y(80),'Ebbinghaus',13,C.coral,'end')+TF(pl.X(4.7),pl.Y(80)+16,'(savings)',13,C.coral,'end');
  if(s.score){const x=pl.X(clamp(D2_lt(Math.max(.1,s.delay)),-1,4.8)),y=pl.Y(s.score.pc);out+=Ci(x,y,7,C.blue,'#fff')+TF(x+10,y+4,s.sim?'simulated':'you',13,C.blue,'start')}
  if(s.score)out+=T(300,360,`${s.score.hits} of 8 recognised, ${s.score.fa} false alarm${s.score.fa===1?'':'s'} · corrected score ${Math.round(s.score.pc)}%`,15,C.ink);
  const say={ready:'Ebbinghaus learned lists until he could recite them twice without error, then measured how much less time relearning took after a delay: the savings.',
   study:'Read each syllable once. Nonsense syllables keep meaning and prior knowledge out of the measurement, which was Ebbinghaus’s key idea.',
   wait:'Counting backwards stops you rehearsing the list, as in the Brown–Peterson distractor task.',
   test:'Tick every syllable you think was in the list. Half of them were not.',
   done:'Recognition (ticking what you saw) is much easier than Ebbinghaus’s relearning measure, so your point is not directly comparable. The shared lesson is the shape: forgetting is fastest just after learning.'}[s.stage];
  return {svg:out,phase:(s.sim?'Simulated participant. ':'')+say};
 }});

// Fits to Ebbinghaus's savings: power law S = a·t^(−b) and exponential S = a·e^(−t/τ), t in minutes.
const D2_PFIT=(()=>{const f=D2_fit(D2_EBB.map(([t,v])=>[Math.log(t),Math.log(v)]));return {a:Math.exp(f.a),b:-f.b}})();
// Exponential fitted by least squares in linear space: for each τ on a log grid the best a is closed-form.
const D2_EFIT=(()=>{let best=null;for(let i=0;i<=400;i++){const tau=Math.pow(10,i/400*6),e=D2_EBB.map(([t])=>Math.exp(-t/tau)),a=sum(D2_EBB.map(([,v],j)=>v*e[j]))/sum(e.map(x=>x*x)),err=sum(D2_EBB.map(([,v],j)=>(a*e[j]-v)**2));if(!best||err<best.err)best={a,tau,err}}return best})();
const D2_pred=(kind,t)=>kind==='power'?D2_PFIT.a*Math.pow(t,-D2_PFIT.b):D2_EFIT.a*Math.exp(-t/D2_EFIT.tau);
const D2_rms=kind=>Math.sqrt(sum(D2_EBB.map(([t,v])=>(D2_pred(kind,t)-v)**2))/D2_EBB.length);
const D2_when=m=>{if(m<60)return `${Math.round(m)} min`;if(m<1440)return `${fmt(Math.round(m/6)/10)} h`;const d=Math.round(m/144)/10;return `${fmt(d)} day${d===1?'':'s'}`};
SCENE({id:'forgetting-curve-savings',name:'Savings and the shape of forgetting',tag:'Power law or exponential?',
 definition:'Ebbinghaus’s savings measure is how much less time relearning takes than first learning. His savings fall roughly as a power of the delay, not as a simple exponential.',
 example:'If a list took 10 minutes to learn and 6 minutes to relearn a day later, the savings are 40%: something remained even though you could not recite the list.',
 desc:'Ebbinghaus’s seven savings measurements on a logarithmic time axis, with a power-law or exponential fit drawn through them, and bars comparing first learning with relearning at the chosen delay.',
 research:'Ebbinghaus (1885); Wixted & Ebbesen (1991). On the form of forgetting. Psychological Science 2, 409–415 (power functions fit forgetting well). Murre & Dros (2015) replicated the curve.',
 dur:10,hint:'Slide the delay and switch between the two fits. Which one follows the points?',
 init:()=>({lt:3.16,kind:'power'}),
 watch(p){return {lt:1.3+p*3.35,kind:p<.5?'power':'exp'}},
 ui:[{range:'lt',label:'Delay',min:1.3,max:4.65,step:.01,get:s=>s.lt,act:'lt',show:v=>D2_when(Math.pow(10,v))},{choose:[['power','Power law'],['exp','Exponential']],label:'Fit',get:s=>s.kind,act:'kind'}],
 on:{lt(s,v){s.lt=Number(v)},kind(s,v){s.kind=v}},
 draw(s){
  const t=Math.pow(10,s.lt),S=clamp(D2_pred(s.kind,t),0,100);let out=heading('Ebbinghaus’s savings after each delay',26);
  const pl=D2_plot(70,56,320,236,[1.2,4.75],[0,70],{xt:[[D2_lt(20),'20 m'],[D2_lt(60),'1 h'],[D2_lt(528),'8.8 h'],[D2_lt(1440),'1 d'],[D2_lt(8640),'6 d'],[D2_lt(44640),'31 d']],yt:[[0,'0%'],[20,'20%'],[40,'40%'],[60,'60%']],yl:'savings',xl:'delay (logarithmic scale)'});out+=pl.svg;
  ['power','exp'].forEach(k=>{const pts=[];for(let i=0;i<=80;i++){const lx=1.25+i/80*3.45;pts.push([pl.X(lx),pl.Y(clamp(D2_pred(k,Math.pow(10,lx)),0,70))])}out+=D2_poly(pts,k===s.kind?(k==='power'?C.green:C.purple):C.line,k===s.kind?2.6:1.4)});
  D2_EBB.forEach(([m,v])=>out+=Ci(pl.X(D2_lt(m)),pl.Y(v),5,C.coral,'#fff'));
  out+=L(pl.X(s.lt),56,pl.X(s.lt),292,C.blue,1.5,'stroke-dasharray="4 4"');
  const bx=430;out+=TB(500,70,`after ${D2_when(t)}`,15,C.ink);
  out+=TF(bx,100,'first learning',13,C.muted,'start')+R(bx,108,140,22,C.line,'none',4)+TF(bx+136,124,'100%',13,C.ink,'end');
  out+=TF(bx,156,'relearning',13,C.muted,'start')+R(bx,164,140*(1-S/100),22,C.blue,'none',4)+TF(bx+140*(1-S/100)+6,180,`${Math.round(100-S)}%`,13,C.ink,'start');
  out+=TBF(bx,218,`savings ${Math.round(S)}%`,15,C.green,'start');
  out+=TF(bx,250,`power fit error ${D2_rms('power').toFixed(1)} pts`,13,s.kind==='power'?C.green:C.muted,'start');
  out+=TF(bx,270,`exponential error ${D2_rms('exp').toFixed(1)} pts`,13,s.kind==='exp'?C.purple:C.muted,'start');
  out+=T(300,348,s.kind==='power'?`Power law: savings ≈ ${D2_PFIT.a.toFixed(0)} × t^−${D2_PFIT.b.toFixed(3)} (t in minutes)`:`Exponential: savings ≈ ${D2_EFIT.a.toFixed(0)} × e^(−t / ${D2_when(D2_EFIT.tau)}) (best least-squares fit)`,15,C.ink);
  return {svg:out,phase:s.kind==='power'?'The power law follows all seven points: steep loss in the first hour, then a long, slow tail. Forgetting slows down as memories age.':'A single exponential cannot bend enough: it either misses the fast early loss or predicts that almost nothing is left after a month, which Ebbinghaus did not find.'};
 }});

// Calkins's paired associates: colours paired with numbers; one pair is shown twice.
const D2_COLS=[['red','#c0392b'],['orange','#d9822b'],['yellow','#d4b106'],['green','#2c8a4a'],['blue','#1f6fb7'],['violet','#7d4ab0']];
function D2_paSets(seed){const r=D2_rng(seed+31),nums=[];while(nums.length<6){const n=10+Math.floor(r()*90);if(!nums.includes(n))nums.push(n)}
 const cols=shuffled(range(6),D2_mix(seed+3)),seq=[0,1,2,0,3,4,5].map(i=>cols[i]);// cols[0] is shown twice
 const order=shuffled(range(6),D2_mix(seed+5));return {nums,twice:cols[0],seq,order,opts:range(6).map(c=>shuffled([c].concat(shuffled(range(6).filter(x=>x!==c),D2_mix(seed+40+c)).slice(0,3)),D2_mix(seed+60+c)))}}
const D2_SIM_PA=[true,true,false,true,false,true];
SCENE({id:'forgetting-curve-pairs',name:'Paired associates',tag:'Calkins’s method',
 definition:'In the paired-associate method you study pairs, then are given the first item and must recall the second. Mary Whiton Calkins invented it in the 1890s to measure how frequency, recency and vividness strengthen associations.',
 example:'Study “red – 47”, “blue – 12” and so on; later the colour red appears and you must answer 47. Calkins found that pairs shown more often were recalled far better.',
 desc:'A short paired-associate test: six colour–number pairs, one shown twice, then each colour with four number choices; results show the repeated pair against the others.',
 research:'Calkins, M. W. (1894). Association. Psychological Review 1, 476–483; Calkins (1896). Association: an essay analytic and experimental. Psychological Review Monograph Supplements 1(2).',
 dur:12,hint:'Press Start and watch seven pairs (one colour comes twice). Then pick the number that went with each colour. Nothing you do leaves this page.',
 init:()=>({seed:1,stage:'ready',k:0,ans:Array(6).fill(null)}),
 watch(p){const sets=D2_paSets(1),ans=Array(6).fill(null);if(p<.45)return {seed:1,stage:'study',k:Math.min(6,Math.floor(p/.45*7)),ans,sim:true};
  const n=p<.8?Math.floor((p-.45)/.35*6):6;sets.order.slice(0,n).forEach((c,i)=>{const ok=c===sets.twice||D2_SIM_PA[i];ans[c]=ok?c:sets.opts[c].find(x=>x!==c)});
  return {seed:1,stage:n<6?'test':'done',k:n,ans,sim:true}},
 ui:[{b:'Start',act:'start'},{b:'New pairs',act:'again'}],
 on:{start(s,_,ctx){s.stage='study';s.k=0;s.ans=Array(6).fill(null);ctx.every(1500,'tick')},
  tick(s){if(s.stage!=='study')return 'stop';s.k++;if(s.k>=7){s.stage='test';s.k=0;return 'stop'}},
  pick(s,c){if(s.stage!=='test')return;const sets=D2_paSets(s.seed);s.ans[sets.order[s.k]]=Number(c);s.k++;if(s.k>=6)s.stage='done'},
  again(s){s.seed=nextSeed();s.stage='ready';s.k=0;s.ans=Array(6).fill(null)}},
 draw(s,f,X){
  const sets=D2_paSets(s.seed);let out=heading('Colours and numbers: what goes with what?',26);
  if(s.stage==='ready')out+=T(300,170,'Press Start to see seven colour–number pairs.',17,C.ink)+TF(300,200,'Then each colour returns and you choose its number.',14,C.muted);
  else if(s.stage==='study'){const c=sets.seq[Math.min(6,s.k)];out+=TF(300,70,`pair ${s.k+1} of 7`,14,C.muted)+R(150,95,140,140,D2_COLS[c][1],'none',10)+TB(380,180,String(sets.nums[c]),52,C.ink)+TF(220,262,D2_COLS[c][0],15,C.ink)}
  else if(s.stage==='test'){const c=sets.order[s.k];out+=TF(300,66,`colour ${s.k+1} of 6: which number went with it?`,14,C.muted)+R(240,82,120,110,D2_COLS[c][1],'none',10)+TF(300,212,D2_COLS[c][0],15,C.ink);
   sets.opts[c].forEach((o,i)=>{const x=105+i*104;out+=hit(X,'pick',o,`Number ${sets.nums[o]}`,R(x,236,86,62,'#fff',C.blue,8,'stroke-width="2"')+TB(x+43,276,String(sets.nums[o]),24,C.ink))})}
  else{let ok1=0,okS=0;out+=TF(80,66,'colour',13,C.muted,'start')+TF(250,66,'answer',13,C.muted)+TF(350,66,'yours',13,C.muted);
   range(6).forEach((c,i)=>{const y=80+i*38,a=s.ans[c],good=a===c;if(c===sets.twice){if(good)ok1++}else if(good)okS++;
    out+=R(80,y,34,28,D2_COLS[c][1],'none',5)+TF(124,y+19,D2_COLS[c][0],14,C.ink,'start')+TBF(250,y+19,String(sets.nums[c]),15,C.ink)+TBF(350,y+19,a===null?'–':String(sets.nums[a]),15,good?C.green:C.coral)+TF(390,y+19,good?'✓':'✗',14,good?C.green:C.coral,'start')+(c===sets.twice?TF(420,y+19,'shown twice',13,C.amber,'start'):'')});
   out+=T(300,328,`Shown twice: ${ok1?'recalled':'missed'} · shown once: ${okS} of 5 recalled`,15,C.ink)}
  return {svg:out,phase:(s.sim?'Simulated participant. ':'')+(s.stage==='done'?'One pair cannot prove a rule, but across many people and lists Calkins found repeated pairs were recalled much more often. Paired associates became a standard method of memory research.':'Calkins worked at Harvard but was refused the PhD she had earned because she was a woman; she later became the first woman president of the American Psychological Association.')};
 }});

/* =========================== classical-conditioning =========================== */
function D2_ccApply(st,kind){const cr=Math.round(st.V*12);let rec;
 if(kind==='pair'){rec={kind,cr};st.V+=.3*(1-st.V);st.peak=Math.max(st.peak,st.V)}
 else if(kind==='bell'){rec={kind,cr};st.V+=.3*(0-st.V)}
 else if(kind==='food')rec={kind,cr:12};
 else{st.V+=.45*(st.peak-st.V);rec={kind,cr:null}}
 st.hist.push(rec);if(st.hist.length>24)st.hist.shift();return st}
const D2_CC_SEQ=['pair','pair','pair','pair','pair','pair','pair','pair','bell','bell','bell','bell','bell','bell','rest','bell','bell'];
function D2_bell(x,y,col=C.amber){return P(`M${x-18} ${y+14} Q${x-16} ${y-20} ${x} ${y-22} Q${x+16} ${y-20} ${x+18} ${y+14} Z`,C.ink,1.6,col)+Ci(x,y+18,4,C.ink)+L(x,y-22,x,y-28,C.ink,2)}
SCENE({id:'classical-conditioning',name:'Classical conditioning',tag:'Bell, food, saliva',
 definition:'In classical (Pavlovian) conditioning a neutral signal that reliably comes before something important, such as food, starts to produce a response by itself. The response fades if the signal stops predicting the food, and partly returns after a rest.',
 example:'Pavlov’s dogs salivated when food was placed in their mouths. After a sound had preceded the food several times, the sound alone made them salivate.',
 desc:'A bell, a food bowl and drops of saliva above a chart of the conditioned response on each trial: pairing raises it, the bell alone extinguishes it, and a rest brings some of it back.',
 research:'Pavlov, I. P. (1927). Conditioned Reflexes (trans. G. V. Anrep). Oxford University Press. Acquisition, extinction and spontaneous recovery are among the most replicated findings in psychology.',
 dur:14,hint:'Pair the bell with food a few times, then ring the bell alone until the response fades, then rest and test again. The update rule here is a simplified one (see prediction error in era 8).',
 init:()=>({V:0,peak:0,hist:[],last:null}),
 watch(p){const n=Math.min(D2_CC_SEQ.length,Math.floor(p*(D2_CC_SEQ.length+1)));const st={V:0,peak:0,hist:[],last:null};D2_CC_SEQ.slice(0,n).forEach(k=>{D2_ccApply(st,k);st.last=k});return st},
 ui:[{b:'Bell + food',act:'pair'},{b:'Bell alone',act:'bell'},{b:'Food alone',act:'food'},{b:'Rest a day',act:'rest'},{b:'Reset',act:'reset'}],
 on:{pair(s){D2_tick();D2_ccApply(s,'pair');s.last='pair'},bell(s){D2_tick();D2_ccApply(s,'bell');s.last='bell'},food(s){D2_ccApply(s,'food');s.last='food'},rest(s){D2_ccApply(s,'rest');s.last='rest'},reset(s){s.V=0;s.peak=0;s.hist=[];s.last=null}},
 draw(s){
  let out=heading('What does the bell come to mean?',26);const last=s.hist[s.hist.length-1];
  const bellOn=s.last==='pair'||s.last==='bell',foodOn=s.last==='pair'||s.last==='food';
  out+=R(20,46,200,150,'#f6f9fb','none',8);
  out+=D2_bell(70,104,bellOn?C.amber:'#fff')+TF(70,150,'bell (signal)',13,bellOn?C.ink:C.muted);
  out+=P('M130 110 Q160 140 190 110 Z',C.ink,1.6,foodOn?C.coral:'#fff')+TF(160,150,'food',13,foodOn?C.ink:C.muted);
  const drops=last&&last.cr!==null?last.cr:0;
  out+=TF(120,176,`saliva: ${drops} drop${drops===1?'':'s'}`,14,drops?C.blue:C.muted);
  out+=R(20,206,200,100,'#fff',C.grid,8)+TF(32,226,'strength of link',13,C.muted,'start')+R(32,236,176*s.V,16,C.blue,'none',4)+R(32,236,176,16,'none',C.line,4)+TF(32,276,s.V>.6?'bell predicts food':s.V>.2?'partly learned':'bell means little',13,C.ink,'start');
  const pl=D2_plot(260,56,316,232,[0,24],[0,12.5],{yt:[[0,'0'],[6,'6'],[12,'12']],yl:'drops to the bell (or to food alone)',xl:'trials, oldest on the left'});out+=pl.svg;
  s.hist.forEach((h,i)=>{const x=pl.X(i+.5);if(h.kind==='rest'){out+=L(x,60,x,286,C.amber,2,'stroke-dasharray="4 4"')+TF(x,76,'rest',13,C.amber);return}
   const col=h.kind==='pair'?C.blue:h.kind==='bell'?C.coral:C.green;out+=R(x-5,pl.Y(h.cr),10,pl.Y(0)-pl.Y(h.cr),col,'none',2)});
  out+=R(260,340,10,10,C.blue,'none',2)+TF(276,349,'bell + food',13,C.muted,'start')+R(370,340,10,10,C.coral,'none',2)+TF(386,349,'bell alone',13,C.muted,'start')+R(470,340,10,10,C.green,'none',2)+TF(486,349,'food alone',13,C.muted,'start');
  const say=!s.last?'Before training the bell is neutral: it produces no saliva. Food produces saliva without any learning (an unconditioned response).':s.last==='pair'?'Acquisition: each pairing strengthens the link a little less than the one before, so the curve rises and levels off.':s.last==='bell'?(s.V<.15?'Extinction: the bell no longer predicts food, so the response has almost gone. It is suppressed, not erased.':'Extinction: the bell keeps sounding without food, so the response weakens trial by trial.'):s.last==='rest'?'Spontaneous recovery: after a rest the extinguished response partly returns, which shows extinction is new learning rather than forgetting.':'Food alone always produces saliva; it does not change what the bell means here.';
  return {svg:out,phase:say};
 }});

// Illustrative conditioning strength as a function of the interval from signal onset to the important event.
const D2_ccStrength=(sys,t)=>sys==='eyeblink'?(t<=0?.06:(t/400)*Math.exp(1-t/400)):(t<0?.05:Math.exp(-t/2.5));
SCENE({id:'classical-conditioning-timing',name:'Timing and preparedness',tag:'How close in time?',
 definition:'Conditioning depends on timing: the signal usually has to come shortly before the important event. How short depends on what is being learned; a taste can be linked to illness hours later.',
 example:'A tone followed half a second later by a puff of air to the eye quickly produces a blink to the tone; at a few seconds’ gap it hardly works. A rat that falls ill hours after a new taste avoids that taste afterwards.',
 desc:'A timeline of the signal and the important event set by an interval slider, above a curve of conditioning strength against the interval for eyeblink conditioning or taste aversion.',
 research:'Schneiderman & Gormezano (1964). Conditioning of the nictitating membrane of the rabbit as a function of CS–US interval. J. Comp. Physiol. Psychol. 57; Garcia, Ervin & Koelling (1966). Learning with prolonged delay of reinforcement. Psychonomic Science 5; Garcia & Koelling (1966). Curves here are illustrative shapes.',
 dur:10,hint:'Choose the kind of learning, then slide the interval, including negative values where the event comes before the signal.',
 init:()=>({sys:'eyeblink',isi:400}),
 watch(p){return p<.5?{sys:'eyeblink',isi:Math.round(-500+p/.5*2500)}:{sys:'taste',isi:Math.round(-60+(p-.5)/.5*480)}},
 ui:[{choose:[['eyeblink','Eyeblink (ms)'],['taste','Taste aversion (min)']],label:'Learning',get:s=>s.sys,act:'sys'},{range:'isi',label:'Interval',min:-500,max:2000,step:10,get:s=>s.sys==='eyeblink'?s.isi:Math.round(s.isi),act:'isi',show:v=>v},{b:'Hear tone then puff',act:'hear'}],
 on:{sys(s,v){s.sys=v;s.isi=v==='eyeblink'?400:120},isi(s,v){s.isi=s.sys==='taste'?clamp(Number(v),-60,480):Number(v)},hear(s){const d=s.sys==='eyeblink'?clamp(s.isi,0,2000)/1000:.4;AUDIO.tone(660,{dur:.3,gain:.12});AUDIO.noise&&AUDIO.noise({dur:.08,at:.3+d,gain:.08})}},
 draw(s){
  const eb=s.sys==='eyeblink',unit=eb?'ms':'min',t=eb?s.isi:s.isi,tt=eb?t:t/60;let out=heading(eb?'Tone, then a puff of air to the eye':'A new taste, then feeling ill',26);
  const tx0=60,tw=480,span=eb?[-600,2100]:[-60,480],tX=v=>tx0+(v-span[0])/(span[1]-span[0])*tw;
  out+=R(tx0,48,tw,92,'#fff',C.grid,4);
  out+=TF(tx0+6,66,eb?'tone (signal)':'taste (signal)',13,C.amber,'start')+R(tX(0),72,eb?tX(Math.max(t,0)+150)-tX(0):tX(30)-tX(0),16,C.amber,'none',3);
  out+=TF(tx0+6,108,eb?'air puff':'illness',13,C.coral,'start')+R(tX(t),114,eb?tX(t+100)-tX(t):tX(t+60)-tX(t),16,C.coral,'none',3);
  out+=L(tX(0),66,tX(0),136,C.ink,1.2,'stroke-dasharray="3 3"');
  const pl=D2_plot(60,170,480,130,eb?[-500,2000]:[-60,480],[0,1.1],{xt:eb?[[-500,'−500'],[0,'0'],[500,'500'],[1000,'1000'],[1500,'1500'],[2000,'2000 ms']]:[[-60,'−1 h'],[0,'0'],[120,'2 h'],[240,'4 h'],[360,'6 h'],[480,'8 h']],yt:[[0,'none'],[1,'strong']],yl:'learning (illustrative)'});out+=pl.svg;
  const pts=[];for(let i=0;i<=120;i++){const v=(eb?-500:-60)+i/120*(eb?2500:540);pts.push([pl.X(v),pl.Y(D2_ccStrength(s.sys,eb?v:v/60))])}out+=D2_poly(pts,C.blue,2.4);
  const st=D2_ccStrength(s.sys,tt);out+=Ci(pl.X(t),pl.Y(st),6,C.blue,'#fff');
  const name=t<0?'backward (event first)':t===0?'simultaneous':'forward (signal first)';
  out+=T(300,350,`${eb?t+' ms':(t<0?'−':'')+D2_when(Math.abs(t))}: ${name} · learning ${st>.6?'strong':st>.25?'moderate':'weak'}`,15,C.ink);
  return {svg:out,phase:eb?'For eyeblinks the best intervals are a few hundred milliseconds; beyond about two seconds, or with the puff first, little is learned.':'Taste aversion breaks the usual timing rule: Garcia and colleagues found rats linked a taste to illness more than an hour later. Learning seems prepared for links that matter in nature.'};
 }});

const D2_GK=(w,peak,sd=17)=>Math.exp(-.5*((w-peak)/sd)**2);
function D2_wlRGB(w){let r=0,g=0,b=0;if(w<490){b=1;g=(w-440)/50}else if(w<510){g=1;b=(510-w)/20}else if(w<580){g=1;r=(w-510)/70}else if(w<645){r=1;g=(645-w)/65}else r=1;const h=v=>Math.round(clamp(v,0,1)*200+40).toString(16).padStart(2,'0');return '#'+h(r)+h(g)+h(b)}
SCENE({id:'classical-conditioning-generalisation',name:'Generalisation',tag:'Similar signals, similar response',
 definition:'A learned response spreads to stimuli that resemble the trained one, less and less as they become more different: a generalisation gradient. Training to tell two stimuli apart can shift the peak away from the unrewarded one.',
 example:'Pigeons rewarded for pecking at a 550 nm (yellow-green) light pecked less at 530 or 570 nm, and very little at 490 or 610 nm.',
 desc:'A generalisation gradient over light wavelength around a trained 550 nm, with an optional peak shift after discrimination training; another view reconstructs the Little Albert report and its ethical problems.',
 research:'Guttman & Kalish (1956). Discriminability and stimulus generalization. J. Exp. Psychol. 51, 79–88; Hanson (1959), peak shift. Watson & Rayner (1920). Conditioned emotional reactions. J. Exp. Psychol. 3, 1–14. Gradient shapes here are approximate.',
 dur:12,hint:'Slide the test wavelength, and switch to discrimination training to see the peak move. The Little Albert view is a reconstruction only: it must never be repeated.',
 init:()=>({w:550,train:'single',view:'pigeons'}),
 watch(p){return p<.7?{w:Math.round(490+p/.7*120),train:p<.35?'single':'discrim',view:'pigeons'}:{w:550,train:'single',view:'albert'}},
 ui:[{choose:[['pigeons','Pigeons and light'],['albert','Little Albert (1920)']],label:'Study',get:s=>s.view,act:'view'},{range:'w',label:'Test light',min:480,max:620,step:5,get:s=>s.w,act:'w',show:v=>v+' nm'},{choose:[['single','Trained on 550 only'],['discrim','550 rewarded, 570 not']],label:'Training',get:s=>s.train,act:'train'}],
 on:{view(s,v){s.view=v},w(s,v){s.w=Number(v)},train(s,v){s.train=v}},
 draw(s){
  if(s.view==='albert'){let out=heading('Little Albert: a reconstruction, not an experiment to repeat',26);
   out+=R(30,46,540,150,'#f6f9fb','none',8)+TB(46,70,'What Watson and Rayner reported (1920)',15,C.ink,'start');
   ['A nine-month-old infant showed no fear of a white rat.','At 11 months, a loud bang was made behind him as he touched the rat.','After seven pairings he cried at the rat alone.','He also reacted to a rabbit, a dog, a fur coat and a Santa Claus mask.'].forEach((l,i)=>out+=TF(46,96+i*24,'• '+l,14,C.ink,'start'));
   out+=R(30,206,540,150,C.coralp,'none',8)+TB(46,230,'Why it is a warning as much as a finding',15,C.coral,'start');
   ['No meaningful consent and no attempt to remove the fear before he left.','One child, loosely measured, never replicated as reported.','His identity is still disputed (Beck et al. 2009; Powell et al. 2014).','Modern ethics codes forbid deliberately frightening a child like this.'].forEach((l,i)=>out+=TF(46,256+i*24,'• '+l,14,C.ink,'start'));
   return {svg:out,phase:'Textbooks often overstate this study. It shows that fear might be learned by association, but the evidence is one poorly documented case, and the ethics were unacceptable even by the standards of later decades.'}}
  const peak=s.train==='discrim'?540:550;let out=heading('Pecks at each colour after training on 550 nm',26);
  const pl=D2_plot(70,50,490,220,[480,620],[0,1.1],{xt:[[490,'490'],[510,'510'],[530,'530'],[550,'550'],[570,'570'],[590,'590'],[610,'610 nm']],yt:[[0,'0'],[1,'most']],yl:'responses'});out+=pl.svg;
  for(let w=480;w<620;w+=5)out+=R(pl.X(w),294,pl.X(w+5)-pl.X(w)+.5,10,D2_wlRGB(w),'none',0);
  const g=w=>s.train==='discrim'?D2_GK(w,540,14)*1.05*(w>565?Math.max(.15,1-(w-565)/20):1):D2_GK(w,550);
  const pts=[];for(let w=480;w<=620;w+=2)pts.push([pl.X(w),pl.Y(clamp(g(w),0,1.08))]);out+=D2_poly(pts,C.blue,2.6);
  out+=L(pl.X(550),50,pl.X(550),270,C.green,1.5,'stroke-dasharray="5 4"')+TF(pl.X(550)+4,66,'trained (rewarded)',13,C.green,'start');
  if(s.train==='discrim')out+=L(pl.X(570),50,pl.X(570),270,C.coral,1.5,'stroke-dasharray="5 4"')+TF(pl.X(570)+4,86,'570: never rewarded',13,C.coral,'start');
  out+=R(pl.X(s.w)-14,308,28,18,D2_wlRGB(s.w),C.ink,4)+Ci(pl.X(s.w),pl.Y(clamp(g(s.w),0,1.08)),6,C.ink,'#fff');
  out+=T(300,356,`Test light ${s.w} nm: ${Math.round(clamp(g(s.w),0,1)*100)}% of peak responding · peak at ${peak} nm`,15,C.ink);
  return {svg:out,phase:s.train==='discrim'?'Peak shift: after learning that 570 nm is never rewarded, birds peck most at a colour slightly further away from 570 than the one they were trained on.':'The response spreads to similar colours and falls off smoothly with distance from the trained one: the generalisation gradient.'};
 }});

/* =========================== law-of-effect =========================== */
const D2_CAT=(()=>{const r=D2_rng(902),t=[];for(let n=0;n<20;n++)t.push(clamp(8+150*Math.exp(-n/4.5)*(.55+.9*r()),4,240));return t})();
const D2_latch=seed=>D2_mix(seed)%9;
const D2_ly=v=>Math.log10(clamp(v,1,300));
SCENE({id:'law-of-effect',name:'The law of effect',tag:'Escape the puzzle box',
 definition:'Thorndike’s law of effect: actions followed by a satisfying result become more likely in that situation, and actions followed by nothing useful drop out. His cats escaped puzzle boxes faster and faster over many trials, gradually rather than in a sudden flash of insight.',
 example:'A hungry cat in a box tries many things; one of them happens to pull the loop that opens the door. Over dozens of trials the useless actions fade and the loop-pull comes sooner.',
 desc:'A puzzle box with nine latches, only one of which opens the door; your escape times are plotted on a logarithmic scale beside a simulated cat’s gradually falling times.',
 research:'Thorndike, E. L. (1898). Animal intelligence: an experimental study of the associative processes in animals. Psychological Review Monograph Supplements 2(4). Cat curve simulated in the shape he reported.',
 dur:12,hint:'Press Shut the box, then try latches until the door opens. Repeat several times and compare your curve with the cat’s. Your times stay on this page.',
 init:()=>({seed:1,running:false,open:false,t0:0,times:[],tried:Array(9).fill(false),wrong:0}),
 watch(p){const n=Math.min(20,Math.floor(p*21)),r=D2_rng(17+n),tried=range(9).map(i=>i!==D2_latch(1)&&r()<.4);return {seed:1,running:true,open:false,times:[],cat:n,tried,wrong:0,sim:true}},
 ui:[{b:'Shut the box',act:'shut'},{b:'Clear my times',act:'clear'},{b:'New box',act:'again'}],
 on:{shut(s){s.running=true;s.open=false;s.t0=performance.now();s.tried=Array(9).fill(false);s.wrong=0},
  latch(s,i){if(!s.running)return;i=Number(i);if(i===D2_latch(s.seed)){const t=(performance.now()-s.t0)/1000;s.times.push({t,wrong:s.wrong});if(s.times.length>20)s.times.shift();s.running=false;s.open=true;D2_tick()}else{s.tried[i]=true;s.wrong++}},
  clear(s){s.times=[];s.running=false;s.open=false},again(s){s.seed=nextSeed();s.times=[];s.running=false;s.open=false}},
 draw(s,f,X){
  let out=heading('Find the latch that opens the box',26);
  out+=R(30,50,252,240,'#f6f2ea',C.amber,8,'stroke-width="2"');for(let i=0;i<8;i++)out+=L(44+i*30,54,44+i*30,72,C.amber,1.5);
  out+=R(250,120,22,110,s.open?'#fff':C.amber,C.amber,3)+TF(261,112,s.open?'open':'door',13,s.open?C.green:C.muted);
  range(9).forEach(i=>{const x=58+(i%3)*62,y=92+Math.floor(i/3)*62,t=s.tried[i];out+=hit(X,'latch',i,`Latch ${i+1}${t?', tried':''}`,R(x,y,48,46,t?'#e8e3da':'#fff',t?C.line:C.ink,6)+Ci(x+24,y+23,8,t?C.line:C.amber))});
  out+=TF(150,312,s.sim?'simulated cat trying latches':s.running?'the box is shut: find the way out':s.open?'out! press Shut the box again':'press Shut the box',13,C.muted);
  const pl=D2_plot(330,58,240,206,[0,21],[0,D2_ly(300)],{xt:[[1,'1'],[5,'5'],[10,'10'],[15,'15'],[20,'20']],yt:[[0,'1 s'],[1,'10 s'],[2,'100 s']],yl:'time to escape',xl:'trial'});out+=pl.svg;
  const nc=s.sim?s.cat:20;out+=D2_poly(D2_CAT.slice(0,nc).map((v,i)=>[pl.X(i+1),pl.Y(D2_ly(v))]),C.coral,2);D2_CAT.slice(0,nc).forEach((v,i)=>out+=Ci(pl.X(i+1),pl.Y(D2_ly(v)),3.5,C.coral));
  s.times.forEach((d,i)=>out+=Ci(pl.X(i+1),pl.Y(D2_ly(d.t)),6,C.blue,'#fff'));
  out+=TF(570,326,'coral = simulated cat · blue = you',13,C.muted,'end');
  const last=s.times[s.times.length-1];
  if(last)out+=T(300,358,`Last escape ${last.t.toFixed(1)} s after ${last.wrong} wrong latch${last.wrong===1?'':'es'} · ${s.times.length} trial${s.times.length===1?'':'s'}`,15,C.ink);
  return {svg:out,phase:s.times.length>1?'You probably dropped to a fast time at once: you remember and can describe the solution. Thorndike’s cats did not show such sudden drops, which he took as evidence for gradual “stamping in”. Köhler (1917) later argued that apes could show insight.':'Each cat’s escape time fell slowly and unevenly across many trials. Thorndike concluded the successful action was being strengthened by its result, not understood.'};
 }});

const D2_BEH=['scratch the bars','pull the loop','miaow','reach through'];
function D2_selRun(st,n){for(let k=0;k<n;k++){const r=D2_rng(1000+st.n*7+st.rew*131)(),tot=sum(st.w);let acc=0,idx=0;for(let i=0;i<4;i++){acc+=st.w[i]/tot;if(r<acc){idx=i;break}idx=i}
  if(idx===st.rew)st.w[idx]+=1;else st.w[idx]=Math.max(.15,st.w[idx]*.85);st.hist.push(idx);if(st.hist.length>60)st.hist.shift();st.n++}return st}
SCENE({id:'law-of-effect-selection',name:'Selection by consequences',tag:'Stamping in, stamping out',
 definition:'The law of effect works like selection: many actions are tried, and the ones followed by a good outcome are kept and repeated, while the others fade away.',
 example:'If only pulling the loop opens the door, then over many trials pulling the loop takes over from scratching, miaowing and reaching.',
 desc:'Bars showing how likely each of four actions is, a strip of the actions chosen on recent trials, and the share of the rewarded action rising over blocks of trials.',
 research:'Thorndike (1898; 1911, Animal Intelligence); Skinner, B. F. (1981). Selection by consequences. Science 213, 501–504. Washburn, M. F. (1908). The Animal Mind surveyed this early comparative work.',
 dur:12,hint:'Choose which action the box rewards, then run blocks of five trials. Reset and pick a different rewarded action to see that the outcome, not the action itself, does the work.',
 init:()=>({w:[1,1,1,1],hist:[],n:0,rew:1}),
 watch(p){const st={w:[1,1,1,1],hist:[],n:0,rew:1};return D2_selRun(st,Math.floor(p*12)*5)},
 ui:[{choose:D2_BEH.map((b,i)=>[i,b]),label:'Rewarded',get:s=>s.rew,act:'rew'},{b:'Run 5 trials',act:'run'},{b:'Reset',act:'reset'}],
 on:{rew(s,v){s.rew=Number(v);s.w=[1,1,1,1];s.hist=[];s.n=0},run(s){D2_selRun(s,5)},reset(s){s.w=[1,1,1,1];s.hist=[];s.n=0}},
 draw(s){
  let out=heading(`Only “${D2_BEH[s.rew]}” opens the door`,26);const tot=sum(s.w),cols=[C.amber,C.blue,C.purple,C.green];
  D2_BEH.forEach((b,i)=>{const y=56+i*44,v=s.w[i]/tot;out+=TF(150,y+20,b,14,i===s.rew?C.ink:C.muted,'end')+R(160,y+4,200*v,24,cols[i],'none',4)+R(160,y+4,200,24,'none',C.line,4)+TF(370,y+21,Math.round(v*100)+'%',13,C.ink,'start')});
  out+=TF(30,248,'recent trials',13,C.muted,'start');s.hist.slice(-40).forEach((h,i)=>out+=R(30+i*13.5,256,11,18,cols[h],'none',2));
  const blocks=[];for(let i=0;i+5<=s.hist.length;i+=5)blocks.push(s.hist.slice(i,i+5).filter(h=>h===s.rew).length/5);
  const pl=D2_plot(430,60,140,150,[0,Math.max(6,blocks.length)],[0,1],{yt:[[0,'0%'],[1,'100%']],yl:'rewarded share'});out+=pl.svg;
  out+=D2_poly(blocks.map((v,i)=>[pl.X(i+.5),pl.Y(v)]),C.blue,2.2);blocks.forEach((v,i)=>out+=Ci(pl.X(i+.5),pl.Y(v),3.5,C.blue));
  out+=TF(500,230,'per block of 5',13,C.muted);
  out+=T(300,316,`${s.n} trials · “${D2_BEH[s.rew]}” now chosen ${Math.round(s.w[s.rew]/tot*100)}% of the time`,15,C.ink);
  return {svg:out,phase:s.n?'Each success adds strength to the rewarded action; each failure takes a little from the action tried. Variation plus selection by results, as Skinner later stressed, is a selection process like natural selection.':'At first every action is equally likely. Run some trials.'};
 }});

const D2_rep=(kind,n)=>kind==='right'?.2+.55*(1-Math.exp(-n/3)):kind==='wrong'?.2-.03*(1-Math.exp(-n/3)):.2;
SCENE({id:'law-of-effect-punishment',name:'Reward and punishment',tag:'The truncated law',
 definition:'Thorndike first claimed that annoying results weaken an action as much as satisfying ones strengthen it. By 1932 his own experiments led him to drop the weakening half: being told “Wrong” changed choices far less than being told “Right”.',
 example:'Choosing one of five meanings for a strange word: answers called “Right” were repeated much more than chance (20%); answers called “Wrong” were repeated only a little less than chance.',
 desc:'Three curves of how often a response is repeated after it was followed by “Right”, by “Wrong” or by nothing, against the number of times this happened, with chance at 20%.',
 research:'Thorndike, E. L. (1932). The Fundamentals of Learning. Teachers College; Azrin & Holz (1966). Punishment, in Honig (ed.), Operant Behavior, showed punishment can suppress behaviour strongly when immediate and consistent. Curves here are illustrative.',
 dur:9,hint:'Choose the consequence and slide the number of times it followed the answer.',
 init:()=>({kind:'right',n:4}),
 watch(p){return {kind:['right','wrong','none'][Math.min(2,Math.floor(p*3))],n:Math.round((p*3%1)*10)}},
 ui:[{choose:[['right','“Right”'],['wrong','“Wrong”'],['none','Nothing said']],label:'Consequence',get:s=>s.kind,act:'kind'},{range:'n',label:'Times',min:0,max:10,step:1,get:s=>s.n,act:'n',show:v=>v}],
 on:{kind(s,v){s.kind=v},n(s,v){s.n=Number(v)}},
 draw(s){
  let out=heading('Does “Wrong” undo as much as “Right” does?',26);
  const pl=D2_plot(70,56,360,236,[0,10],[0,.85],{xt:[[0,'0'],[2,'2'],[4,'4'],[6,'6'],[8,'8'],[10,'10']],yt:[[0,'0%'],[.2,'20%'],[.4,'40%'],[.6,'60%'],[.8,'80%']],yl:'chance of repeating the answer',xl:'times this consequence followed the answer'});out+=pl.svg;
  const cols={right:C.green,wrong:C.coral,none:C.muted};
  ['right','wrong','none'].forEach(k=>{const pts=range(51).map(i=>[pl.X(i/5),pl.Y(D2_rep(k,i/5))]);out+=D2_poly(pts,cols[k],k===s.kind?3:1.5,k==='none'?'stroke-dasharray="5 4"':'')});
  out+=TF(pl.X(10)-4,pl.Y(D2_rep('right',10))-8,'“Right”',13,C.green,'end')+TF(pl.X(10)-4,pl.Y(.2)-8,'chance',13,C.muted,'end')+TF(pl.X(10)-4,pl.Y(D2_rep('wrong',10))+18,'“Wrong”',13,C.coral,'end');
  const v=D2_rep(s.kind,s.n);out+=Ci(pl.X(s.n),pl.Y(v),6,cols[s.kind],'#fff');
  out+=R(450,70,128,200,'#f6f9fb','none',8)+TF(514,94,'after '+s.n+' time'+(s.n===1?'':'s'),13,C.muted)+TB(514,130,Math.round(v*100)+'%',28,cols[s.kind])+TF(514,156,'repeat the answer',13,C.ink);
  ['Thorndike 1932:','reward > punishment.','Later work: firm,','immediate punishment','suppresses too.'].forEach((l,i)=>out+=TF(514,184+i*17,l,13,C.muted));
  return {svg:out,phase:s.kind==='wrong'?'Being told “Wrong” barely changed what people chose next time, so Thorndike “truncated” his law. Later research found punishment can suppress behaviour, but it says what not to do, not what to do instead.':s.kind==='right'?'Being told “Right” raised the chance of repeating the answer well above chance.':'With no feedback, choices stay near chance.'};
 }});

/* =========================== operant-schedules =========================== */
const D2_SCH={FR:{name:'Fixed ratio',def:10,min:2,max:50,unit:'responses'},VR:{name:'Variable ratio',def:10,min:2,max:50,unit:'responses on average'},FI:{name:'Fixed interval',def:30,min:5,max:120,unit:'s'},VI:{name:'Variable interval',def:30,min:5,max:120,unit:'s on average'}};
const D2_SCHC={};
// Deterministic sketch of typical cumulative records (shapes after Ferster & Skinner 1957), 600 s at 0.25 s steps.
function D2_sched(kind,v){const key=kind+v;if(D2_SCHC[key])return D2_SCHC[key];const r=D2_rng(5000+v*4+kind.charCodeAt(0)),dt=.25,pts=[[0,0]],rein=[];let n=0,since=0,cnt=0,acc=0,last=0,nextAvail=kind==='VI'?-Math.log(1-r()*.95)*v:v;
 for(let t=dt;t<=600;t+=dt){let rate=0;if(kind==='FR')rate=(t-last)<.35*v?0:2.5;else if(kind==='VR')rate=2.6;else if(kind==='FI')rate=2.2*Math.pow(clamp((t-last)/v,0,1),2.2);else rate=1.1;
  acc+=rate*dt;while(acc>=1){acc-=1;n++;cnt++;let hitR=false;if(kind==='FR')hitR=cnt>=v;else if(kind==='VR')hitR=r()<1/v;else if(kind==='FI')hitR=t-last>=v;else hitR=t>=nextAvail;
   if(hitR){rein.push([t,n]);last=t;cnt=0;if(kind==='VI')nextAvail=t-Math.log(1-r()*.95)*v}}
  if(Math.round(t/dt)%4===0)pts.push([t,n])}
 return D2_SCHC[key]={pts,rein,n}}
SCENE({id:'operant-schedules',name:'Schedules of reinforcement',tag:'Cumulative records',
 definition:'In operant conditioning the rule linking responses to rewards, the schedule, shapes the pattern of responding: a reward every fixed number of responses, a variable number, the first response after a fixed time, or after a variable time.',
 example:'Slot machines pay on a variable ratio and produce fast, steady play; a weekly wage is closer to a fixed interval, with effort bunching before payday.',
 desc:'A cumulative record of responses over ten minutes for the chosen schedule, rising faster when responding is faster, with a tick at each reward.',
 research:'Skinner (1938). The Behavior of Organisms; Ferster & Skinner (1957). Schedules of Reinforcement. Appleton-Century-Crofts. Records here are a simple model of the typical shapes.',
 dur:12,hint:'Choose a schedule and its value. Look for the pause after each reward on fixed ratio and the scallop on fixed interval.',
 init:()=>({kind:'FI',v:30}),
 watch(p){const k=['FR','VR','FI','VI'][Math.min(3,Math.floor(p*4))];return {kind:k,v:D2_SCH[k].def}},
 ui:[{choose:Object.keys(D2_SCH).map(k=>[k,D2_SCH[k].name]),label:'Schedule',get:s=>s.kind,act:'kind'},{range:'v',label:'Value',min:2,max:120,step:1,get:s=>s.v,act:'v',show:v=>v}],
 on:{kind(s,k){s.kind=k;s.v=D2_SCH[k].def},v(s,v){const d=D2_SCH[s.kind];s.v=clamp(Number(v),d.min,d.max)}},
 draw(s){
  const d=D2_SCH[s.kind],sim=D2_sched(s.kind,s.v),ymax=Math.max(200,Math.ceil(sim.n/200)*200);let out=heading(`${d.name} ${s.v} ${d.unit}`,26);
  const pl=D2_plot(80,54,470,240,[0,600],[0,ymax],{xt:[[0,'0'],[120,'2'],[240,'4'],[360,'6'],[480,'8'],[600,'10 min']],yt:[[0,'0'],[ymax/2,String(ymax/2)],[ymax,String(ymax)]],yl:'total responses'});out+=pl.svg;
  out+=D2_poly(sim.pts.map(([t,n])=>[pl.X(t),pl.Y(n)]),C.ink,1.8);
  sim.rein.forEach(([t,n])=>out+=L(pl.X(t),pl.Y(n),pl.X(t)+5,pl.Y(n)+6,C.coral,2));
  out+=T(300,340,`${sim.n} responses (${(sim.n/10).toFixed(0)} a minute) · ${sim.rein.length} rewards (coral ticks)`,15,C.ink);
  const say={FR:'Fixed ratio: a pause after each reward, then a fast run to the next one; bigger ratios give longer pauses.',VR:'Variable ratio: the next response could always pay, so responding is fast and steady with almost no pauses.',FI:'Fixed interval: responding stops after a reward and speeds up as the next one becomes available, a “scallop”.',VI:'Variable interval: rewards come at unpredictable times, so a moderate, very steady rate pays best.'}[s.kind];
  return {svg:out,phase:say};
 }});

const D2_PRESS={FR:10,VR:10,FI:10,VI:10};
SCENE({id:'operant-schedules-press',name:'Be the subject',tag:'Press for points',
 definition:'A free-operant experiment: you may respond whenever you like, and a schedule decides which responses earn a reward. The pattern of your presses over time is your cumulative record.',
 example:'On a fixed interval of 10 seconds, pressing early is wasted; many people learn to wait and then press quickly as the time comes round.',
 desc:'A lever to press and a coin counter beside your own cumulative record, with a tick for every point earned, under the chosen schedule.',
 research:'Ferster & Skinner (1957); Weiner (1964) and Lowe (1979) found human schedule performance often differs from animals’ because people form verbal rules. Your record stays on this page.',
 dur:12,hint:'Choose a schedule, then press the lever (or the Press button) for about 30 seconds and look at your record. Points are only points.',
 init:()=>({kind:'FR',seed:1,t0:null,presses:[],rein:[],cnt:0,last:0,nextAvail:null}),
 watch(p){const sim=D2_sched('FR',10),tm=p*60*2;const pts=sim.pts.filter(q=>q[0]<=tm),rein=sim.rein.filter(q=>q[0]<=tm);return {kind:'FR',sim:true,simPts:pts,rein:rein.map(q=>q[0]),presses:[],tmax:Math.max(60,Math.ceil(tm/30)*30)}},
 ui:[{choose:Object.keys(D2_PRESS).map(k=>[k,D2_SCH[k].name+' 10']),label:'Schedule',get:s=>s.kind,act:'kind'},{b:'Press',act:'press'},{b:'Start again',act:'reset'}],
 on:{kind(s,k){s.kind=k;s.t0=null;s.presses=[];s.rein=[];s.cnt=0;s.last=0;s.nextAvail=null},reset(s){s.seed=nextSeed();s.t0=null;s.presses=[];s.rein=[];s.cnt=0;s.last=0;s.nextAvail=null},
  press(s){const now=performance.now();if(s.t0===null){s.t0=now;s.last=0;const r=D2_rng(s.seed+9);s.nextAvail=-Math.log(1-r()*.95)*10}const t=(now-s.t0)/1000;s.presses.push(t);if(s.presses.length>400)s.presses.shift();s.cnt++;
   let ok=false;if(s.kind==='FR')ok=s.cnt>=10;else if(s.kind==='VR')ok=D2_rng(s.seed*97+s.presses.length)()<.1;else if(s.kind==='FI')ok=t-s.last>=10;else ok=t>=s.nextAvail;
   if(ok){s.rein.push(t);s.cnt=0;s.last=t;if(s.kind==='VI')s.nextAvail=t-Math.log(1-D2_rng(s.seed+s.rein.length*13)()*.95)*10;AUDIO.tone(1320,{dur:.15,gain:.12})}}},
 draw(s,f,X){
  let out=heading(`${D2_SCH[s.kind].name}, value 10: press for points`,26);
  out+=R(30,60,150,200,'#f6f9fb','none',8)+hit(X,'press','',`Lever, ${s.presses.length} presses so far`,R(60,170,90,40,C.blue,'none',6)+TBF(105,196,'PRESS',15,'#fff'))+L(105,170,105,120,C.ink,4)+Ci(105,114,10,C.ink);
  out+=TF(105,240,s.sim?'simulated subject':`${s.presses.length} presses`,13,C.muted);
  out+=R(30,276,150,60,'#fff',C.grid,8)+TF(105,298,'points',13,C.muted)+TB(105,326,String(s.rein.length),20,C.amber);
  const tmax=s.sim?s.tmax:Math.max(60,Math.ceil(((s.presses[s.presses.length-1]||0)+5)/30)*30);
  const npts=s.sim?(s.simPts.length?s.simPts[s.simPts.length-1][1]:0):s.presses.length,ymax=Math.max(40,Math.ceil(npts/40)*40);
  const pl=D2_plot(230,60,340,236,[0,tmax],[0,ymax],{xt:[[0,'0'],[tmax/2,String(tmax/2)],[tmax,tmax+' s']],yt:[[0,'0'],[ymax,String(ymax)]],yl:'your total presses'});out+=pl.svg;
  if(s.sim){out+=D2_poly(s.simPts.map(([t,n])=>[pl.X(t),pl.Y(n)]),C.ink,1.8);D2_sched('FR',10).rein.filter(q=>q[0]<=tmax&&s.rein.includes(q[0])).forEach(([t,n])=>out+=L(pl.X(t),pl.Y(n),pl.X(t)+5,pl.Y(n)+6,C.coral,2))}
  else{out+=D2_poly([[0,0]].concat(s.presses.map((t,i)=>[t,i+1])).map(([t,n])=>[pl.X(t),pl.Y(n)]),C.ink,1.8);s.rein.forEach(t=>{const n=s.presses.indexOf(t)+1;out+=L(pl.X(t),pl.Y(n),pl.X(t)+5,pl.Y(n)+6,C.coral,2)})}
  const rate=!s.sim&&s.presses.length>1?Math.round((s.presses.length-1)/Math.max(.1,s.presses[s.presses.length-1])*60):null;
  out+=T(400,340,rate!==null?`${rate} presses a minute · ${s.rein.length} point${s.rein.length===1?'':'s'}`:'coral ticks mark points earned',14,C.ink);
  return {svg:out,phase:s.sim?'Simulated subject on fixed ratio 10: a short pause after each point, then a burst of ten presses.':s.presses.length<8?'Press the lever. The schedule is not shown in detail: discover it from when points arrive.':'Compare your record with the typical shapes in the previous scene. People often work out a rule, such as “wait ten seconds”, and then follow the rule rather than the schedule.'};
 }});

const D2_ext=(kind,t)=>kind==='crf'?60*2*(1-Math.exp(-t/2)):60*8*(1-Math.exp(-t/8));
SCENE({id:'operant-schedules-extinction',name:'The partial reinforcement effect',tag:'Why gambling persists',
 definition:'Behaviour that was rewarded only some of the time keeps going much longer once rewards stop than behaviour that was rewarded every time: the partial reinforcement extinction effect.',
 example:'A vending machine that always worked is abandoned after one or two failures; a slot machine, which pays rarely, gets played long after it has stopped paying.',
 desc:'Cumulative responses after rewards stop, for a subject trained with a reward every time and one trained with rewards on one response in five, up to the chosen minute.',
 research:'Humphreys, L. G. (1939). The effect of random alternation of reinforcement on the acquisition and extinction of conditioned eyelid reactions. J. Exp. Psychol. 25, 141–158; Jenkins & Stanley (1950). Partial reinforcement: a review and critique. Psychological Bulletin 47. Curves illustrative.',
 dur:10,hint:'Slide through the extinction session. Which subject gives up first?',
 init:()=>({t:6}),
 watch(p){return {t:Math.round(p*200)/10}},
 ui:[{range:'t',label:'Minutes without reward',min:0,max:20,step:.5,get:s=>s.t,act:'t',show:v=>v+' min'}],
 on:{t(s,v){s.t=Number(v)}},
 draw(s){
  let out=heading('Responses after the rewards stop',26);
  const pl=D2_plot(80,54,420,236,[0,20],[0,500],{xt:[[0,'0'],[5,'5'],[10,'10'],[15,'15'],[20,'20 min']],yt:[[0,'0'],[250,'250'],[500,'500']],yl:'total responses in extinction'});out+=pl.svg;
  [['crf',C.coral,'every response rewarded'],['part',C.blue,'1 in 5 rewarded']].forEach(([k,c,l])=>{out+=D2_poly(range(81).map(i=>[pl.X(i/4),pl.Y(D2_ext(k,i/4))]),c,2.4);out+=TF(pl.X(20)+6,pl.Y(D2_ext(k,20))+4,k==='crf'?'every time':'1 in 5',13,c,'start')});
  out+=L(pl.X(s.t),54,pl.X(s.t),290,C.ink,1.4,'stroke-dasharray="4 4"');
  const a=D2_ext('crf',s.t),b=D2_ext('part',s.t),ra=60*Math.exp(-s.t/2),rb=60*Math.exp(-s.t/8);
  out+=T(300,330,`After ${s.t} min: ${Math.round(a)} versus ${Math.round(b)} responses`,15,C.ink);
  out+=TF(300,354,`responding now: ${Math.round(ra)} a minute (every time) · ${Math.round(rb)} a minute (1 in 5)`,13,C.muted);
  return {svg:out,phase:'After continuous reward, the change to no reward is easy to notice, so responding stops quickly. After partial reward, long runs without reward were normal, so extinction looks like more of the same.'};
 }});

/* =========================== cognitive-maps =========================== */
// Mean errors per day in Tolman & Honzik's (1930) 14-unit maze, redrawn approximately from their figure.
const D2_TH={HR:[9.5,8.2,6.8,5.6,4.6,3.9,3.6,3.2,3,2.8,2.6,2.4,2.3,2.2,2.2,2.1,2],HNR:[9.5,9,8.4,8,7.6,7.4,7.2,7,6.9,6.8,6.7,6.6,6.5,6.5,6.4,6.4,6.3]};
D2_TH.HNRR=D2_TH.HNR.slice(0,11).concat([3.2,2.1,1.9,1.8,1.8,1.7]);
const D2_THN={HR:'food every day',HNR:'never food',HNRR:'food from day 11'};
SCENE({id:'cognitive-maps',name:'Latent learning',tag:'Learning without reward',
 definition:'Tolman showed that rats learn the layout of a maze even when nothing rewards them; the learning stays hidden (latent) until a reason to use it appears.',
 example:'Rats that wandered a maze for ten days without food made many errors; once food appeared at the end, their errors fell at once to the level of rats rewarded from the start, or below.',
 desc:'Mean errors per day for three groups of rats in a maze: rewarded every day, never rewarded, and rewarded from day 11, with the third group’s sudden drop.',
 research:'Tolman & Honzik (1930). Introduction and removal of reward, and maze performance in rats. University of California Publications in Psychology 4, 257–275. Values redrawn approximately from their figure.',
 dur:12,hint:'Slide through the days and pick a group to highlight. Watch day 12.',
 init:()=>({day:17,g:'HNRR'}),
 watch(p){return {day:1+Math.min(16,Math.floor(p*17)),g:'HNRR'}},
 ui:[{range:'day',label:'Day',min:1,max:17,step:1,get:s=>s.day,act:'day',show:v=>'day '+v},{choose:Object.keys(D2_THN).map(k=>[k,D2_THN[k]]),label:'Highlight',get:s=>s.g,act:'g'}],
 on:{day(s,v){s.day=Number(v)},g(s,v){s.g=v}},
 draw(s){
  let out=heading('Errors in a maze, day by day',26);
  const pl=D2_plot(70,54,380,240,[.5,17.5],[0,10.5],{xt:[[1,'1'],[5,'5'],[11,'11'],[17,'17']],yt:[[0,'0'],[5,'5'],[10,'10']],yl:'mean errors per run',xl:'day',xlDy:28});out+=pl.svg;
  out+=L(pl.X(11.5),54,pl.X(11.5),294,C.amber,1.5,'stroke-dasharray="5 4"')+TF(pl.X(11.5)+4,70,'food added',13,C.amber,'start');
  const cols={HR:C.green,HNR:C.muted,HNRR:C.blue};
  Object.keys(D2_TH).forEach(k=>{const on=k===s.g,v=D2_TH[k].slice(0,s.day);out+=D2_poly(v.map((e,i)=>[pl.X(i+1),pl.Y(e)]),cols[k],on?3:1.6);if(on)v.forEach((e,i)=>out+=Ci(pl.X(i+1),pl.Y(e),3.5,cols[k]))});
  out+=R(466,70,112,150,'#f6f9fb','none',8);Object.keys(D2_THN).forEach((k,i)=>out+=R(476,86+i*44,14,4,cols[k],'none',1)+TF(496,92+i*44,D2_THN[k].split(' ')[0],13,C.ink,'start')+TF(496,109+i*44,D2_THN[k].split(' ').slice(1).join(' '),13,C.muted,'start'));
  out+=T(300,362,`Day ${s.day}: ${D2_THN[s.g]} averages ${D2_TH[s.g][s.day-1]} errors`,15,C.ink);
  return {svg:out,phase:s.day>=12&&s.g==='HNRR'?'One day after food appeared, the late-rewarded rats were as good as rats rewarded all along. They must have learned the maze while exploring; the reward changed performance, not learning.':'Without food the rats’ errors fall only a little. Watch what happens after food is added on day 11.'};
 }});

const D2_SUN=range(18).map(i=>{const a=(180-(i+.5)*10)*Math.PI/180;return {i,a}});
const D2_SC={x:300,y:280},D2_GOAL={x:440,y:72};
const D2_goalArm=(()=>{const ga=Math.atan2(D2_SC.y-D2_GOAL.y,D2_GOAL.x-D2_SC.x);let best=0;D2_SUN.forEach(a=>{if(Math.abs(a.a-ga)<Math.abs(D2_SUN[best].a-ga))best=a.i});return best})();
SCENE({id:'cognitive-maps-shortcut',name:'Taking a shortcut',tag:'The sunburst maze',
 definition:'If rats only learned chains of turns, a blocked route should leave them lost. Tolman, Ritchie and Kalish reported that many rats instead chose a new path pointing towards where the food had been, as if they had a map.',
 example:'Rats trained on a winding route were put in a maze where that route was blocked and many arms radiated outwards. The single most popular arm pointed roughly at the old goal.',
 desc:'The sunburst maze from above: the trained winding route, now blocked, and eighteen arms fanning out from the starting table; you choose one, then see the arm that pointed towards the goal.',
 research:'Tolman, Ritchie & Kalish (1946). Studies in spatial learning I. J. Exp. Psychol. 36, 13–24; Tolman (1948). Cognitive maps in rats and men. Psychological Review 55, 189–208. Later replications were mixed, and a light above the goal may have guided the rats.',
 dur:10,hint:'You have learned the winding route to the food. It is now blocked. Press the arm you would take.',
 init:()=>({pick:null}),
 watch(p){return {pick:p<.5?null:D2_goalArm,sim:true}},
 ui:[{b:'Clear my choice',act:'clear'}],
 on:{arm(s,i){s.pick=Number(i)},clear(s){s.pick=null}},
 draw(s,f,X){
  let out=heading('The old route is blocked: which way now?',26);const c=D2_SC;
  out+=TF(c.x,c.y+64,'start',13,C.muted)+L(c.x,c.y+50,c.x,c.y+16,C.ink,3);
  out+=P(`M${c.x} ${c.y-16} L${c.x} 200 L190 200 L190 110 L${D2_GOAL.x} 110 L${D2_GOAL.x} ${D2_GOAL.y+14}`,C.line,4,'none','stroke-dasharray="7 6"');
  
  D2_SUN.forEach(a=>{const x2=c.x+Math.cos(a.a)*170,y2=c.y-Math.sin(a.a)*170*.98,show=s.pick!==null,isG=a.i===D2_goalArm,mine=a.i===s.pick;
   const col=mine?C.blue:show&&isG?C.green:C.ink;
   out+=hit(X,'arm',a.i,`Arm ${a.i+1}`,L(c.x+Math.cos(a.a)*22,c.y-Math.sin(a.a)*22,x2,y2,'transparent',16)+L(c.x+Math.cos(a.a)*22,c.y-Math.sin(a.a)*22,x2,y2,col,mine||show&&isG?4:2))});
  out+=Ci(c.x,c.y,20,'#fff',C.ink);
  out+=L(c.x-10,190,c.x+10,210,C.coral,4)+L(c.x-10,210,c.x+10,190,C.coral,4)+R(c.x+14,190,62,20,'#fff','none',4)+TF(c.x+18,205,'blocked',13,C.coral,'start');
  out+=Ci(D2_GOAL.x,D2_GOAL.y,12,s.pick!==null?C.amber:'#fff',C.amber)+TF(D2_GOAL.x+16,D2_GOAL.y+4,s.pick!==null?'old goal':'?',13,C.amber,'start');
  if(s.pick!==null){out+=R(20,300,560,62,'#f6f9fb','none',8)+TF(300,322,s.pick===D2_goalArm?'You chose the arm towards the old goal, as the most popular choice in 1946 did.':`You chose arm ${s.pick+1}; green marks the arm pointing towards the old goal.`,14,C.ink)+TF(300,346,'Reported: 36% of rats chose the goal-pointing arm; a single arm by chance would get about 6%.',13,C.muted)}
  return {svg:out,phase:(s.sim?'Simulated choice. ':'')+'Tolman read this as a cognitive map: knowledge of where things are, not just which turns to make. The evidence from this maze is weaker than its fame suggests, but the idea gained strong support from place cells and later navigation research.'};
 }});

const D2_FIELDS=[[1,1],[4,2],[2,4.2]],D2_FC=[C.coral,C.green,C.purple];
const D2_rate=(ci,r,c)=>{const [fr,fc]=D2_FIELDS[ci];return 20*Math.exp(-((r-fr)**2+(c-fc)**2)/(2*.8*.8))};
const D2_PATH=range(36).map(i=>{const r=Math.floor(i/6),c=r%2?5-i%6:i%6;return [r,c]});
function D2_pcVisit(st,r,c){st.pos=[r,c];const k=r*6+c;st.vis[k]++;for(let i=0;i<3;i++)st.sp[i][k]+=D2_rate(i,r,c);return st}
SCENE({id:'cognitive-maps-place-cells',name:'Place cells',tag:'A map in the hippocampus',
 definition:'Place cells are neurons in the hippocampus that fire when an animal is in one particular part of its surroundings. Together they form a map of space, the kind of map Tolman had inferred from behaviour.',
 example:'As a rat explores a box, one cell fires only near the top-left corner, another only near the middle; recording many cells is enough to tell where the rat is.',
 desc:'A six-by-six arena that you move a rat through, three place cells’ current firing rates, and the firing map built up for the chosen cell from where the rat has been.',
 research:'O’Keefe & Dostrovsky (1971). The hippocampus as a spatial map. Brain Research 34, 171–175; O’Keefe & Nadel (1978). The Hippocampus as a Cognitive Map. Grid cells: Hafting, Fyhn, Molden, Moser & Moser (2005). Nobel Prize 2014. Fields here are simulated.',
 dur:12,hint:'Press squares to move the rat around the arena. Choose which cell’s firing map to show.',
 init:()=>({pos:[0,0],vis:Array(36).fill(0),sp:[Array(36).fill(0),Array(36).fill(0),Array(36).fill(0)],cell:0}),
 watch(p){const st={pos:[0,0],vis:Array(36).fill(0),sp:[Array(36).fill(0),Array(36).fill(0),Array(36).fill(0)],cell:Math.min(2,Math.floor(p*3))};D2_PATH.slice(0,1+Math.floor(p*35)).forEach(([r,c])=>D2_pcVisit(st,r,c));return st},
 ui:[{choose:[[0,'Cell A'],[1,'Cell B'],[2,'Cell C']],label:'Map for',get:s=>s.cell,act:'cell'},{b:'Clear map',act:'clear'}],
 on:{go(s,k){k=Number(k);D2_pcVisit(s,Math.floor(k/6),k%6)},cell(s,v){s.cell=Number(v)},clear(s){s.vis=Array(36).fill(0);s.sp=[Array(36).fill(0),Array(36).fill(0),Array(36).fill(0)]}},
 draw(s,f,X){
  let out=heading(`Firing map of cell ${'ABC'[s.cell]} as the rat explores`,26);const x0=40,y0=50,cs=45;
  for(let k=0;k<36;k++){const r=Math.floor(k/6),c=k%6,v=s.vis[k]?s.sp[s.cell][k]/s.vis[k]/20:null;const fill=v===null?'#fff':tint(D2_FC[s.cell],1-clamp(v,0,1)*.9);
   out+=hit(X,'go',k,`Square row ${r+1}, column ${c+1}`,R(x0+c*cs,y0+r*cs,cs-2,cs-2,fill,C.grid,3))}
  const [pr,pc]=s.pos;out+=Ci(x0+pc*cs+cs/2-1,y0+pr*cs+cs/2-1,11,C.ink)+Ci(x0+pc*cs+cs/2+8,y0+pr*cs+cs/2-9,4,C.ink);
  out+=TF(x0+135,y0+290,'dark = high firing · white = not visited',13,C.muted);
  out+=TB(450,66,'Firing right now',14,C.ink);
  range(3).forEach(i=>{const v=D2_rate(i,pr,pc),y=84+i*58;out+=TF(340,y+20,'cell '+'ABC'[i],13,i===s.cell?C.ink:C.muted,'start')+R(392,y+6,170*v/20,20,D2_FC[i],'none',4)+R(392,y+6,170,20,'none',C.line,4)+TF(392,y+44,`${v.toFixed(1)} spikes/s`,13,C.muted,'start')});
  out+=R(340,268,236,74,'#f6f9fb','none',8)+TF(352,290,`squares visited: ${s.vis.filter(v=>v).length} of 36`,13,C.ink,'start')+TF(352,312,'Each cell has its own place field;',13,C.muted,'start')+TF(352,330,'together they cover the arena.',13,C.muted,'start');
  return {svg:out,phase:'The firing map fills in only where the rat has been. Each place cell is quiet almost everywhere and busy in one region, its place field. Grid cells next door in the entorhinal cortex fire in a repeating triangular pattern.'};
 }});

/* =========================== gestalt-grouping =========================== */
const D2_RAT=[.8,.9,1,1.1,1.2,1.3];
const D2_lat=s=>shuffled(D2_RAT.concat(D2_RAT),D2_mix(s.seed+300));
const D2_pRows=r=>1/(1+Math.exp(-12*(r-1)));
SCENE({id:'gestalt-grouping',name:'Grouping by proximity',tag:'Rows or columns?',
 definition:'The Gestalt psychologists argued that we see wholes before parts, organised by laws of grouping. The first is proximity: elements closer together are seen as belonging together.',
 example:'A grid of dots that are a little closer side by side than up and down looks like rows; make them closer vertically and it flips to columns.',
 desc:'A dot lattice whose horizontal and vertical spacing differ from trial to trial; you report rows or columns, and your answers are plotted against the spacing ratio beside the expected curve.',
 research:'Wertheimer, M. (1923). Untersuchungen zur Lehre von der Gestalt II. Psychologische Forschung 4, 301–350; Kubovy & Wagemans (1995). Grouping by proximity and multistability in dot lattices. Psychological Science 6, 225–234. Curve shape approximate.',
 dur:12,hint:'For each lattice, answer straight away: rows or columns? Twelve trials. Your answers stay on this page.',
 init:()=>({seed:1,i:0,res:[]}),
 watch(p){const n=Math.min(12,Math.floor(p*13)),o=D2_lat({seed:1}),r=D2_rng(44),res=[];for(let i=0;i<n;i++)res.push({r:o[i],rows:r()<D2_pRows(o[i])});return {seed:1,i:n,res,sim:true}},
 ui:[{b:'Rows',act:'ans',arg:'rows'},{b:'Columns',act:'ans',arg:'cols'},{b:'Start again',act:'again'}],
 on:{ans(s,v){if(s.i>=12)return;s.res.push({r:D2_lat(s)[s.i],rows:v==='rows'});s.i++},again(s){s.seed=nextSeed();s.i=0;s.res=[]}},
 draw(s){
  let out=heading('Do you see rows or columns?',26);const o=D2_lat(s),r=s.i<12?o[s.i]:1,a=26,b=a*r,cx=160,cy=190;
  out+=R(20,46,280,290,'#f6f9fb','none',8);
  if(s.i<12){for(let i=0;i<7;i++)for(let j=0;j<5;j++)out+=Ci(cx+(i-3)*a,cy+(j-2)*b,5.5,C.ink);out+=TF(160,326,`trial ${s.i+1} of 12`,13,C.muted)}
  else out+=T(160,180,'All twelve trials done.',16,C.ink)+TF(160,206,'Press Start again for a new order.',13,C.muted);
  const pl=D2_plot(350,62,220,220,[.75,1.35],[0,1],{xt:[[.8,'0.8'],[1,'1'],[1.2,'1.2']],yt:[[0,'0%'],[.5,'50%'],[1,'100%']],yl:'answered “rows”',xl:'up-down gap ÷ side-side gap'});out+=pl.svg;
  out+=D2_poly(range(61).map(i=>{const x=.75+i/100;return [pl.X(x),pl.Y(D2_pRows(x))]}),C.coral,2.2);
  D2_RAT.forEach(rr=>{const rs=s.res.filter(q=>q.r===rr);if(!rs.length)return;const v=rs.filter(q=>q.rows).length/rs.length;out+=Ci(pl.X(rr),pl.Y(v),6,C.blue,'#fff')});
  out+=TF(460,340,`coral = expected · blue = ${s.sim?'simulated observer':'you'}`,13,C.muted);
  return {svg:out,phase:s.res.length<12?'Answer quickly, by first impression. The ratio is hidden; the plot fills in as you go.':'When the up-down gap is larger than the side-side gap you see rows, and vice versa. Near a ratio of 1 the lattice is ambiguous and can flip between the two.'};
 }});

const D2_PRIN={proximity:'Proximity',similarity:'Similarity',closure:'Closure',continuity:'Good continuation',fate:'Common fate',region:'Common region',connect:'Connectedness'};
SCENE({id:'gestalt-grouping-principles',name:'Laws of grouping',tag:'Seven ways parts become wholes',
 definition:'Beyond proximity, elements group when they look alike, when they close a shape, when they continue a smooth line, when they move together, when they share a region, or when they are connected.',
 example:'In a field of moving dots, the few that move together pop out as one object; a line drawn between two dots binds them even when other dots are closer.',
 desc:'One demonstration for each Gestalt principle: proximity, similarity, closure, good continuation, common fate, common region and connectedness.',
 research:'Wertheimer (1923); Kanizsa (1955) illusory contours; Palmer (1992). Common region. Cognitive Psychology 24; Palmer & Rock (1994). Rethinking perceptual organization: uniform connectedness. Psychonomic Bulletin & Review 1; Wagemans et al. (2012), a century of Gestalt psychology, Psychological Bulletin 138.',
 dur:14,hint:'Choose a principle and say what groups you see before reading the caption.',
 init:()=>({k:'similarity'}),
 watch(p){return {k:Object.keys(D2_PRIN)[Math.min(6,Math.floor(p*7))]}},
 ui:[{choose:Object.entries(D2_PRIN),label:'Principle',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v}},
 draw(s,f,X){
  let out=heading(D2_PRIN[s.k],26);const k=s.k,dot=(x,y,c=C.ink,r=9)=>Ci(x,y,r,c);
  out+=R(40,46,520,260,'#f6f9fb','none',8);
  if(k==='proximity'){for(let g=0;g<4;g++)for(let i=0;i<2;i++)for(let j=0;j<5;j++)out+=dot(110+g*110+i*28,90+j*42)}
  if(k==='similarity'){for(let i=0;i<8;i++)for(let j=0;j<5;j++)out+=j%2?Ci(125+i*50,90+j*42,10,'#fff',C.ink,'stroke-width="2"'):dot(125+i*50,90+j*42)}
  if(k==='closure'){const V=[[300,88],[200,261],[400,261]],cx=300,cy=203;V.forEach(([x,y])=>{const th=Math.atan2(cy-y,cx-x),a=th+Math.PI/6,b=th-Math.PI/6;
    out+=P(`M${x} ${y} L${fmt(x+40*Math.cos(a))} ${fmt(y+40*Math.sin(a))} A40 40 0 1 1 ${fmt(x+40*Math.cos(b))} ${fmt(y+40*Math.sin(b))} Z`,'none',0,C.ink)})}
  if(k==='continuity'){out+=D2_poly(range(11).map(i=>[120+i*36,270-i*18]),'none');range(11).forEach(i=>out+=dot(120+i*36,270-i*18,C.ink,7));range(11).forEach(i=>out+=dot(120+i*36,90+i*18,C.ink,7))}
  if(k==='fate'){const u=X.try?0:(X.p*6)%1;for(let i=0;i<8;i++)for(let j=0;j<4;j++){const mv=(i+j)%3===0;out+=dot(110+i*52,100+j*52-(mv?u*30:0),mv?C.blue:C.ink,8);if(mv)out+=arrow(110+i*52+14,108+j*52,110+i*52+14,84+j*52,C.blue,1.8,6)}}
  const PX=[];for(let g=0;g<4;g++)PX.push(100+g*130,136+g*130);
  if(k==='region'){for(let g=0;g<3;g++)out+=`<ellipse cx="${183+g*130}" cy="190" rx="70" ry="38" fill="#fff" stroke="${C.line}" stroke-width="2"/>`;PX.forEach(x=>out+=dot(x,190))}
  if(k==='connect'){for(let g=0;g<3;g++)out+=L(136+g*130,190,230+g*130,190,C.ink,3);PX.forEach(x=>out+=dot(x,190))}
  const cap={proximity:'You see four pairs of columns, not eight equal columns.',similarity:'Filled and hollow dots are evenly spaced, yet you see rows.',closure:'Three cut-out discs: you see a white triangle that is not drawn (Kanizsa).',continuity:'Two straight lines crossing, not two bent ones meeting in a V.',fate:'The blue dots moving together form one group (in Watch they move).',region:'Dots sharing an outline group together, even across the wider gaps.',connect:'Lines join dots across the wider gaps, and connection beats nearness.'}[k];
  out+=T(300,336,cap,15,C.ink);
  return {svg:out,phase:'These are descriptions of what tends to happen, not a complete theory: when principles compete, which one wins depends on their strength, and modern work measures that strength rather than listing laws.'};
 }});

const D2_PHI=[[0,30,'seen together',C.purple],[30,200,'motion: one dot moves',C.green],[200,400,'two dots in turn',C.amber]];
const D2_phiOn=(isi,ms)=>{const cyc=100+isi,k=Math.floor(ms/cyc),w=ms-k*cyc;return isi<=0?(k%2):w<100?k%2:-1};
SCENE({id:'gestalt-grouping-phi',name:'Apparent motion',tag:'Wertheimer’s starting point',
 definition:'Two lights flashed one after the other in different places are seen as one light moving, if the gap between them is right. Wertheimer’s 1912 study of this apparent motion launched Gestalt psychology: the motion is in the experience, not in either flash.',
 example:'Film and video are still frames shown in sequence; neon signs that seem to run along a shop front are lamps switching on and off.',
 desc:'Two dots flashing alternately with an adjustable dark interval between them, above a scale of what is seen: simultaneous, moving or separate.',
 research:'Wertheimer, M. (1912). Experimentelle Studien über das Sehen von Bewegung. Zeitschrift für Psychologie 61, 161–265. Zone limits are approximate and depend on distance and brightness; Steinman, Pizlo & Pizlo (2000) on phi versus beta motion.',
 dur:10,hint:'Set the dark interval, then press Flash. Browser timing is approximate (screens refresh every 16 ms or so).',
 init:()=>({isi:60,on:-1}),
 watch(p){const isi=Math.round(p*300);return {isi,on:D2_phiOn(isi,p*10000)}},
 ui:[{range:'isi',label:'Dark interval',min:0,max:300,step:5,get:s=>s.isi,act:'isi',show:v=>v+' ms'},{b:'Flash',act:'flash'}],
 on:{isi(s,v){s.isi=Number(v)},flash(s,_,ctx){s.t0=performance.now();s.on=0;ctx.every(15,'tick')},tick(s){const ms=performance.now()-s.t0;if(ms>4000){s.on=-1;return 'stop'}s.on=D2_phiOn(s.isi,ms)}},
 draw(s){
  let out=heading('Two dots, one movement?',26);
  out+=R(60,50,480,140,'#20303a','none',10);
  out+=Ci(220,120,18,s.on===0?'#ffd75e':'#3a4b55')+Ci(380,120,18,s.on===1?'#ffd75e':'#3a4b55');
  const sx=v=>60+v/400*480;D2_PHI.forEach(([a,b,l,c])=>{out+=R(sx(a),226,sx(b)-sx(a),26,c,'none',3)});
  out+=TF(sx(15),270,'together',13,C.purple)+TF(sx(115),270,'motion',13,C.green)+TF(sx(300),270,'one after another',13,C.amber);
  [0,100,200,300,400].forEach(v=>out+=TF(sx(v),292,v+' ms',13,C.muted));
  out+=`<polygon points="${fmt(sx(s.isi))},224 ${fmt(sx(s.isi)-7)},212 ${fmt(sx(s.isi)+7)},212" fill="${C.ink}"/>`;
  const z=D2_PHI.find(([a,b])=>s.isi>=a&&s.isi<b)||D2_PHI[2];
  out+=T(300,336,`Dark interval ${s.isi} ms: usually ${z[2]}`,15,C.ink);
  return {svg:out,phase:'Wertheimer described a pure “phi” motion without a seen object at some intervals; what most people now call the phi effect, a dot seen moving across the gap, is strictly “beta” motion. Either way the brain supplies movement that is not on the screen.'};
 }});
