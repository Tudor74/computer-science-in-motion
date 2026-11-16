/* ===================== Mind era 4 · Memory ===================== */
// Working memory, serial position, encoding and context, reconstruction, spacing and retrieval practice.
// The learner is the participant where a study is short and harmless (word length, free recall, levels of
// processing, false memories, retrieval practice). Timed presentation uses ctx.every; trial order uses seeded
// shuffles; draw() stays a pure function of state, frame and X. No data leaves the page.
const D4_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const D4_rng=n=>rng(D4_mix(n));
const D4_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const D4_pct=v=>isNaN(v)?'–':Math.round(v*100)+'%';
const D4_mean=a=>a.length?sum(a)/a.length:NaN;
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function D4_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-7,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// A vertical bar with its value above and label below.
function D4_vbar(x,base,w,h,col,val,lab,o={}){
 let out=R(x,base-h,w,Math.max(h,0),col,o.stroke||'none',3);
 if(val!==undefined)out+=TBF(x+w/2,base-h-6,val,13,o.ink||C.ink);
 if(lab)out+=TF(x+w/2,base+17,lab,13,C.muted);
 return out;
}

/* =========================== working-memory =========================== */
const D4_PARTS={exec:{x:214,y:44,w:172,h:62,l:['Central executive'],sub:'directs attention'},
 loop:{x:24,y:162,w:176,h:84,l:['Phonological','loop'],sub:'inner voice and ear'},
 buffer:{x:212,y:162,w:176,h:84,l:['Episodic','buffer'],sub:'binds episodes (2000)'},
 sketch:{x:400,y:162,w:176,h:84,l:['Visuospatial','sketchpad'],sub:'inner eye'}};
const D4_PARTNAME={exec:'central executive',loop:'phonological loop',buffer:'episodic buffer',sketch:'visuospatial sketchpad'};
const D4_TASKS=[['digits','Phone number','hold a phone number',['loop']],['say','Say “the the”','say “the, the, the” aloud',['loop']],['route','Route home','picture your route home',['sketch']],
 ['tap','Tap a pattern','tap a square pattern',['sketch']],['sum','37 × 4','work out 37 × 4 in your head',['exec','loop']],['story','Link a memory','tie a new fact to an old memory',['exec','buffer']]];
const D4_task=id=>D4_TASKS.find(t=>t[0]===id)||D4_TASKS[0];
const D4_PAIRS=[['digits','route'],['digits','say'],['route','tap'],['sum','route'],['sum','digits'],['story','tap']];
SCENE({id:'working-memory',name:'A model of working memory',tag:'Separate stores, one director',
 definition:'Working memory is the small, short-lived memory you think with. Baddeley and Hitch proposed that it has parts: a phonological loop for speech sounds, a visuospatial sketchpad for images and places, and a central executive that directs attention. Baddeley later added an episodic buffer that binds them into scenes.',
 example:'You can hold a phone number while picturing your route home, because they use different stores. Holding the number while saying “the, the, the” aloud is much harder, because both need the loop.',
 desc:'Boxes for the central executive, phonological loop, episodic buffer and visuospatial sketchpad above long-term memory; choosing two tasks lights the parts each one needs and flags the parts both need.',
 research:'Baddeley & Hitch (1974). Working memory. In G. H. Bower (ed.), The Psychology of Learning and Motivation 8, 47–89. Baddeley (2000). The episodic buffer: a new component of working memory? Trends in Cognitive Sciences 4, 417–423.',
 dur:12,hint:'Choose two tasks to do at once. A part needed by both turns amber: that is where the model predicts they will get in each other’s way.',
 init:()=>({a:'digits',b:'route'}),
 watch(p){const q=D4_PAIRS[Math.min(5,Math.floor(p*6))];return {a:q[0],b:q[1]}},
 ui:[{choose:D4_TASKS.map(t=>[t[0],t[1]]),label:'Task A',get:s=>s.a,act:'a'},{choose:D4_TASKS.map(t=>[t[0],t[1]]),label:'Task B',get:s=>s.b,act:'b'}],
 on:{a(s,v){s.a=v},b(s,v){s.b=v}},
 draw(s){
  const ta=D4_task(s.a),tb=D4_task(s.b),A=ta[3],B=tb[3],both=A.filter(k=>B.includes(k));
  let out=heading('Baddeley and Hitch’s working memory',26);
  for(const k of ['loop','buffer','sketch']){const p=D4_PARTS[k];out+=L(300,106,p.x+p.w/2,p.y,C.line,2)+L(p.x+p.w/2,p.y+p.h,p.x+p.w/2,270,C.line,2,'stroke-dasharray="4 4"')}
  out+=R(24,270,552,38,C.purplep,'none',8)+TF(300,294,'Long-term memory: language, visual knowledge, past episodes',14,C.purple);
  for(const [k,p] of Object.entries(D4_PARTS)){const a=A.includes(k),b=B.includes(k),col=a&&b?C.amber:a?C.blue:b?C.coral:C.line,fill=a&&b?C.amberp:a?C.pale:b?C.coralp:'#fff';
   out+=R(p.x,p.y,p.w,p.h,fill,col,10);if(a||b)out+=R(p.x+3,p.y+3,p.w-6,p.h-6,'none',col,8);
   p.l.forEach((t,i)=>out+=TBF(p.x+p.w/2,p.y+24+i*20,t,15,C.ink));
   out+=TF(p.x+p.w/2,p.y+p.h-12,p.sub,13,C.muted)}
  const msg=s.a===s.b?'Same task twice: choose two different tasks.':both.length?`Both tasks need the ${both.map(k=>D4_PARTNAME[k]).join(' and ')}: expect a clash.`:'Different stores: the model predicts the two tasks barely clash.';
  out+=T(300,334,msg,15,s.a===s.b?C.muted:both.length?C.amber:C.green);
  out+=TF(300,360,'blue: task A · coral: task B · amber: needed by both',13,C.muted);
  const phase=s.a===s.b?'Pick two different tasks.':both.length?`To ${ta[2]} and ${tb[2]} at once, both compete for the ${both.map(k=>D4_PARTNAME[k]).join(' and ')}, so each slows or spoils the other. Dual-task interference like this is how the separate parts were found.`
   :`To ${ta[2]} while you ${tb[2]} uses different parts, so in experiments the pair interferes far less. The executive and the buffer are the least precisely specified parts of the model.`;
  return {svg:out,phase};
 }});

/* ----- word-length effect: be the participant ----- */
const D4_SHORT=['sum','wit','hate','bag','pen','fork','rug','lamp','chin','sock'];
const D4_LONG=['university','opportunity','aluminium','constitution','auditorium','refrigerator','hippopotamus','organisation','electricity','tuberculosis'];
const D4_WL_N=4;
function D4_wlTrial(seed,t){const type=t%2?'long':'short',pool=type==='short'?D4_SHORT:D4_LONG;return {type,list:shuffled(pool,D4_mix(seed*31+t)).slice(0,5),choices:shuffled(pool,D4_mix(seed*57+t+9))}}
const D4_WL_SIM=[{type:'short',score:5},{type:'long',score:3},{type:'short',score:4},{type:'long',score:3}];
SCENE({id:'working-memory-word-length',name:'The word-length effect',tag:'You are the participant',
 definition:'People remember lists of short words better than lists of long words, in order. The phonological loop seems to hold about as much as you can say in a second or two, so longer words leave room for fewer.',
 example:'Five words like “sum, wit, hate, bag, pen” are easier to repeat in order than “university, aluminium, opportunity, auditorium, constitution”.',
 desc:'Five words appear one at a time; you then press them in the order you saw them from a set of ten. Bars compare your accuracy for short and long lists.',
 research:'Baddeley, Thomson & Buchanan (1975). Word length and the structure of short-term memory. Journal of Verbal Learning and Verbal Behavior 14, 575–589. Robust across many studies, but whether spoken duration alone causes it is debated (Lovatt, Avons & Masterson 2000).',
 dur:12,hint:'Press Show next list and watch five words, then press them in the same order. Four lists alternate short and long. Your answers stay on this page.',
 init:()=>({seed:1,t:0,ph:'ready',idx:0,picks:[],res:[]}),
 watch(p){const n=Math.min(4,Math.floor(p*5)),u=p*5-n;return {seed:1,t:n,ph:n>=4?'done':'show',idx:Math.min(4,Math.floor(u*5)),picks:[],res:D4_WL_SIM.slice(0,n),sim:true}},
 ui:[{b:'Show next list',act:'start'},{b:'Undo last press',act:'undo'},{b:'Start again',act:'again'}],
 on:{start(s,_,ctx){if(s.ph==='show'||s.ph==='recall'||s.t>=D4_WL_N)return 'keep';s.ph='show';s.idx=0;s.picks=[];ctx.every(1100,'tick')},
  tick(s){if(s.ph!=='show')return 'stop';s.idx++;if(s.idx>=5){s.ph='recall';return 'stop'}},
  pick(s,w){if(s.ph!=='recall'||s.picks.includes(w))return;s.picks.push(w);if(s.picks.length===5){const tr=D4_wlTrial(s.seed,s.t);s.res.push({type:tr.type,score:tr.list.filter((x,i)=>s.picks[i]===x).length});s.t++;s.ph=s.t>=D4_WL_N?'done':'fb'}},
  undo(s){if(s.ph==='recall')s.picks.pop()},
  again(s){s.seed=nextSeed();s.t=0;s.ph='ready';s.res=[];s.picks=[];s.idx=0}},
 draw(s,f,X){
  let out=heading('Short words against long words',26);
  out+=R(20,44,380,232,'#fff',C.grid,8);
  const tr=D4_wlTrial(s.seed,Math.min(s.t,D4_WL_N-1));
  if(s.ph==='show'){out+=TF(210,70,`List ${s.t+1} of ${D4_WL_N} (${tr.type} words) · word ${s.idx+1} of 5`,13,C.muted)+TB(210,170,tr.list[Math.min(4,s.idx)],26,C.ink)}
  else if(s.ph==='recall'){out+=TF(210,66,'Press the five words in the order you saw them',13,C.muted);
   tr.choices.forEach((w,i)=>{const c=i%2,r=Math.floor(i/2),x=30+c*184,y=78+r*38,k=s.picks.indexOf(w);
    out+=hit(X,'pick',w,'Word '+w,R(x,y,176,32,k>=0?C.pale:'#f6f9fb',k>=0?C.blue:C.grid,6)+TF(x+88,y+21,w,14,C.ink));if(k>=0)out+=Ci(x+16,y+16,10,C.blue)+TBF(x+16,y+21,String(k+1),13,'#fff')})}
  else{const last=s.res[s.res.length-1];
   if(s.ph==='ready')out+=T(210,140,'Press Show next list.',16,C.ink)+TF(210,168,'Five words appear, about one a second.',14,C.muted);
   else if(s.ph==='fb')out+=TB(210,140,`${last.score} of 5 in the right place`,18,last.score>=4?C.green:C.amber)+TF(210,168,`That was a list of ${last.type} words. Press Show next list.`,14,C.muted);
   else out+=TB(210,140,'All four lists done',18,C.ink)+TF(210,168,'Compare your two bars on the right.',14,C.muted)}
  const sh=s.res.filter(r=>r.type==='short').map(r=>r.score/5),lo=s.res.filter(r=>r.type==='long').map(r=>r.score/5);
  out+=TF(500,64,s.sim?'Simulated participant':'Your results',13,C.muted);
  out+=L(424,250,576,250,C.line,1.5);
  const ms=D4_mean(sh),ml=D4_mean(lo);
  out+=D4_vbar(436,250,52,isNaN(ms)?0:ms*160,C.blue,D4_pct(ms),'short');
  out+=D4_vbar(512,250,52,isNaN(ml)?0:ml*160,C.coral,D4_pct(ml),'long');
  out+=TF(500,290,'words in the right place',13,C.muted);
  out+=T(300,318,'Baddeley et al. (1975): short-word lists are recalled better.',14,C.ink);
  out+=TF(300,342,'Choosing from ten words is easier than saying them back,',13,C.muted)+TF(300,360,'so scores here run higher than in the original study.',13,C.muted);
  const phase=s.ph==='done'||s.sim?(!isNaN(ms)&&!isNaN(ml)&&ms>ml?'Like most people, you kept short words in order better. The loop holds roughly what you can say in a couple of seconds.':'Your bars may not differ with only two lists each; the published effect is reliable across many participants.'):s.ph==='recall'?'Rebuild the order from memory. Long words take longer to rehearse in your inner voice.':'Watch the words; try repeating them silently as they appear.';
  return {svg:out,phase};
 }});

/* ----- dual tasks: Brooks (1968) ----- */
const D4_BROOKS={spatial:{point:28,say:11},verbal:{point:10,say:14}};
const D4_FSHAPE=[[40,66],[160,66],[160,96],[76,96],[76,126],[130,126],[130,156],[76,156],[76,216],[40,216]];
const D4_SENT=['A','bird','in','the','hand','is','not','in','the','bush'];
SCENE({id:'working-memory-dual-task',name:'Picture it or say it',tag:'Interference shows the parts',
 definition:'Two tasks clash when they need the same part of working memory. In Brooks’s experiments, answering about an imagined shape was slow if you had to point to answers, and answering about a remembered sentence was slow if you had to say them.',
 example:'Imagine a block capital F and go round its corners, answering yes for corners on the very top or bottom. Pointing to Y or N on a page slows you down far more than saying “yes” or “no”.',
 desc:'A block letter F with its corners marked yes or no, a sentence with its nouns marked, and grouped bars of answer times for pointing against speaking: the bars cross over.',
 research:'Brooks (1968). Spatial and verbal components of the act of recall. Canadian Journal of Psychology 22, 349–368. The crossover is the classic evidence for separate visual and verbal stores; values here are rounded and approximate.',
 dur:10,hint:'Choose the memory task and the way of answering. The highlighted bar is the time that combination takes. Try the letter F yourself with your eyes shut.',
 init:()=>({task:'spatial',resp:'point'}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {task:k<2?'spatial':'verbal',resp:k%2?'say':'point'}},
 ui:[{choose:[['spatial','Letter F (picture)'],['verbal','Sentence (words)']],label:'Remember',get:s=>s.task,act:'task'},{choose:[['point','Point to Y or N'],['say','Say yes or no']],label:'Answer by',get:s=>s.resp,act:'resp'}],
 on:{task(s,v){s.task=v},resp(s,v){s.resp=v}},
 draw(s){
  let out=heading('Brooks: imagined shapes and remembered sentences',26);
  const sp=s.task==='spatial';
  out+=R(20,44,272,192,sp?C.pale:'#fff',sp?C.blue:C.grid,8);
  out+=P('M'+D4_FSHAPE.map(p=>p[0]+' '+p[1]).join(' L')+' Z',C.ink,2.4,'#fff');
  D4_FSHAPE.forEach(([x,y],i)=>{const yes=y===66||y===216;out+=Ci(x,y,6,yes?C.green:C.coral)});
  out+=TF(52,232,'start',13,C.muted);
  out+=TF(176,84,'green: yes,',13,C.green,'start')+TF(176,102,'on the top or',13,C.green,'start')+TF(176,120,'bottom edge',13,C.green,'start')+TF(176,142,'coral: no',13,C.coral,'start');
  out+=TF(176,172,'go round the',13,C.muted,'start')+TF(176,190,'corners in',13,C.muted,'start')+TF(176,208,'your mind’s eye',13,C.muted,'start');
  out+=R(20,244,272,74,!sp?C.pale:'#fff',!sp?C.blue:C.grid,8);
  let x=30;D4_SENT.forEach(w=>{const noun=['bird','hand','bush'].includes(w),wd=w.length*6.6+8;out+=TF(x+wd/2-3,274,w,13,noun?C.green:C.ink);x+=wd});
  out+=TF(156,302,'yes for each noun, no for the others',13,C.muted);
  const pl=D4_plot(352,56,220,200,[0,4],[0,30],{yt:[[0,'0'],[10,'10'],[20,'20'],[30,'30 s']],yl:'time to answer'});out+=pl.svg;
  [['spatial','letter F',0],['verbal','sentence',2]].forEach(([k,lab,g])=>{['point','say'].forEach((r,j)=>{const v=D4_BROOKS[k][r],x0=pl.X(g+.25+j*.75),w=pl.X(.7)-pl.X(0),sel=s.task===k&&s.resp===r;
   out+=R(x0,pl.Y(v),w,pl.Y(0)-pl.Y(v),j?C.coral:C.blue,sel?C.amber:'none',3);if(sel)out+=R(x0-3,pl.Y(v)-3,w+6,pl.Y(0)-pl.Y(v)+6,'none',C.amber,4);out+=TBF(x0+w/2,pl.Y(v)-6,v+' s',13,C.ink)});
   out+=TF(pl.X(g+1),274,lab,13,C.ink)});
  out+=Ci(372,298,6,C.blue)+TF(382,303,'point',13,C.muted,'start')+Ci(452,298,6,C.coral)+TF(462,303,'say',13,C.muted,'start');
  const slow=(sp&&s.resp==='point')||(!sp&&s.resp==='say');
  out+=T(300,344,slow?'Same channel twice: the answers fight the memory.':'Different channels: the answers do not get in the way.',15,slow?C.coral:C.green);
  out+=TF(300,368,'Rounded values after Brooks (1968); the crossover is what matters.',13,C.muted);
  return {svg:out,phase:sp?'Pointing needs the same spatial system that is holding the picture of the F, so the two tasks clash; speaking does not.':'Saying words needs the same verbal system that is holding the sentence, so speaking clashes and pointing does not.'};
 }});

/* =========================== serial-position =========================== */
const D4_SPW=['apple','river','candle','horse','garden','pencil','window','tiger','button','rocket','castle','bottle','cloud','mirror','ladder','onion','piano','wallet','forest','hammer','jacket','lemon','needle','ocean','pillow','rabbit','saddle','tomato','violin','wagon','anchor','basket','cherry','dragon','engine','feather'];
const D4_SP_REF=[.62,.48,.38,.31,.27,.25,.25,.27,.33,.46,.66,.86];
const D4_spList=(seed,k)=>shuffled(D4_SPW,D4_mix(seed)).slice(12*(k%3),12*(k%3)+12);
function D4_spSim(n){const r=D4_rng(404),out=[];for(let k=0;k<n;k++)out.push(D4_SP_REF.map(v=>r()<v?1:0));return out}
SCENE({id:'serial-position',name:'The serial-position curve',tag:'You are the participant',
 definition:'After hearing or reading a list once, people recall the first few items (the primacy effect) and especially the last few (the recency effect) better than the middle. Plotting recall against position gives a U-shaped curve.',
 example:'Read twelve words once and write down all you can. Most people get the last three or four, a couple of the first, and few from the middle.',
 desc:'Twelve words shown one a second, then a box for free recall in any order; a plot of the proportion you recalled at each list position against the typical U-shaped curve.',
 research:'Murdock (1962). The serial position effect of free recall. Journal of Experimental Psychology 64, 482–488. One of the most reliable findings in memory research.',
 dur:13,hint:'Press Show next list, watch twelve words, then type all you remember in the box (any order, spaces between) and press Check. Three lists. Your answers stay on this page.',
 init:()=>({seed:1,k:0,ph:'ready',idx:0,text:'',res:[]}),
 watch(p){const n=Math.min(3,Math.floor(p*4)),u=p*4-n;return {seed:1,k:n,ph:n>=3?'done':u<.8?'show':'recall',idx:Math.min(11,Math.floor(u/.8*12)),text:'',res:D4_spSim(n),sim:true}},
 ui:[{b:'Show next list',act:'start'},{text:'Recall',label:'Words you remember',get:s=>s.text,act:'type',max:240},{b:'Check',act:'check'},{b:'Start again',act:'again'}],
 on:{start(s,_,ctx){if(s.ph==='show'||s.ph==='recall'||s.k>=3)return 'keep';s.ph='show';s.idx=0;s.text='';ctx.every(1000,'tick')},
  tick(s){if(s.ph!=='show')return 'stop';s.idx++;if(s.idx>=12){s.ph='recall';return 'stop'}},
  type(s,v){s.text=String(v)},
  check(s){if(s.ph!=='recall')return;const got=new Set(s.text.toLowerCase().split(/[^a-z]+/).filter(Boolean)),list=D4_spList(s.seed,s.k);s.res.push(list.map(w=>got.has(w)||got.has(w+'s')?1:0));s.k++;s.ph=s.k>=3?'done':'fb';s.text=''},
  again(s){s.seed=nextSeed();s.k=0;s.res=[];s.ph='ready';s.text='';s.idx=0}},
 draw(s){
  let out=heading('Which positions do you remember?',26);
  out+=R(20,44,262,170,'#fff',C.grid,8);
  if(s.ph==='show'){const list=D4_spList(s.seed,s.k);out+=TF(151,68,`List ${s.k+1} of 3 · word ${s.idx+1} of 12`,13,C.muted)+TB(151,140,list[Math.min(11,s.idx)],28,C.ink)}
  else if(s.ph==='recall')out+=T(151,112,'Type every word you',15,C.ink)+T(151,134,'remember, in any order,',15,C.ink)+T(151,156,'then press Check.',15,C.ink);
  else if(s.ph==='fb'){const last=s.res[s.res.length-1];out+=TB(151,116,`${sum(last)} of 12 recalled`,18,C.ink)+TF(151,146,'Press Show next list.',14,C.muted)}
  else if(s.ph==='ready')out+=T(151,112,'Press Show next list.',15,C.ink)+TF(151,140,'Twelve words, one a second.',14,C.muted);
  else out+=TB(151,116,'Three lists done',18,C.ink)+TF(151,146,'Compare your curve with the dashes.',14,C.muted);
  out+=TF(30,240,'first three: primacy',13,C.green,'start')+TF(30,262,'last three: recency',13,C.coral,'start');
  const pl=D4_plot(330,56,244,190,[.5,12.5],[0,1],{xt:[[1,'1'],[4,'4'],[8,'8'],[12,'12']],yt:[[0,'0'],[.5,'50%'],[1,'100%']],xl:'position in the list',yl:'recalled'});out+=pl.svg;
  out+=R(pl.X(.5),56,pl.X(3.5)-pl.X(.5),190,C.greenp,'none',0,'opacity=".6"')+R(pl.X(9.5),56,pl.X(12.5)-pl.X(9.5),190,C.coralp,'none',0,'opacity=".6"');
  out+=D4_poly(D4_SP_REF.map((v,i)=>[pl.X(i+1),pl.Y(v)]),C.muted,2,'stroke-dasharray="6 5"');
  const n=s.res.length,mean=range(12).map(i=>n?D4_mean(s.res.map(r=>r[i])):NaN);
  if(n){out+=D4_poly(mean.map((v,i)=>[pl.X(i+1),pl.Y(v)]),C.blue,2.6);mean.forEach((v,i)=>out+=Ci(pl.X(i+1),pl.Y(v),4.5,C.blue))}
  out+=TF(452,300,'dashes: typical curve · blue: '+(s.sim?'simulated':'you'),13,C.muted);
  if(n){const a=D4_mean(mean.slice(0,3)),m=D4_mean(mean.slice(3,9)),z=D4_mean(mean.slice(9));out+=T(300,330,`${s.sim?'Simulated':'Your'} recall: first three ${D4_pct(a)} · middle ${D4_pct(m)} · last three ${D4_pct(z)}`,15,C.ink)}
  out+=TF(300,358,'Typical curve approximate, after Murdock (1962); its shape shifts with list length and pace.',13,C.muted);
  return {svg:out,phase:n?'The last items are often still in mind when recall starts (recency); the first ones were rehearsed more while the list was short (primacy). The middle loses on both counts.':'Watch the twelve words. When you recall, many people write the last few first, before they fade.'};
 }});

const D4_spCurve=(delay,gap)=>{const g=(gap-3)/6,rec=delay===0?1:delay===10?.35:.05;return range(12).map(i=>clamp(.18+.08*g+(.3+.12*g)*Math.exp(-i/1.6)+.62*Math.exp(-(11-i)/1.3)*rec,0,1))};
SCENE({id:'serial-position-delay',name:'Two ends, two causes',tag:'Delay kills recency',
 definition:'The two ends of the serial-position curve respond to different things. Thirty seconds of counting backwards before recall wipes out the recency effect but leaves primacy; presenting the words more slowly raises the early and middle items but not the last few.',
 example:'If you must count back in threes from 487 for half a minute before writing the list, the last words are no better than the middle ones.',
 desc:'Model serial-position curves for no delay, 10 seconds or 30 seconds of counting before recall, and for words 3, 6 or 9 seconds apart, against the immediate 3-second curve as a dashed reference.',
 research:'Glanzer & Cunitz (1966). Two storage mechanisms in free recall. Journal of Verbal Learning and Verbal Behavior 5, 351–360; Postman & Phillips (1965). Curves here are a schematic model of their pattern.',
 dur:10,hint:'Change the delay to see the recency end collapse; change the spacing to see the early items rise while the last ones stay put.',
 init:()=>({delay:0,gap:3}),
 watch(p){return {delay:p<.34?0:p<.67?10:30,gap:3}},
 ui:[{choose:[[0,'Recall at once'],[10,'10 s counting'],[30,'30 s counting']],label:'Before recall',get:s=>s.delay,act:'delay'},{choose:[[3,'3 s apart'],[6,'6 s apart'],[9,'9 s apart']],label:'Word spacing',get:s=>s.gap,act:'gap'}],
 on:{delay(s,v){s.delay=Number(v)},gap(s,v){s.gap=Number(v)}},
 draw(s){
  let out=heading('What removes each end of the curve?',26);
  const pl=D4_plot(80,52,480,214,[.5,12.5],[0,1],{xt:range(12).map(i=>[i+1,String(i+1)]),yt:[[0,'0'],[.25,'25%'],[.5,'50%'],[.75,'75%'],[1,'100%']],xl:'position in the list',yl:'recalled (model)'});out+=pl.svg;
  const ref=D4_spCurve(0,3),cur=D4_spCurve(s.delay,s.gap);
  out+=D4_poly(ref.map((v,i)=>[pl.X(i+1),pl.Y(v)]),C.muted,2,'stroke-dasharray="6 5"');
  out+=D4_poly(cur.map((v,i)=>[pl.X(i+1),pl.Y(v)]),C.blue,3);cur.forEach((v,i)=>out+=Ci(pl.X(i+1),pl.Y(v),4.5,C.blue));
  out+=TF(pl.X(1)+6,pl.Y(cur[0])-12,'primacy',13,C.green,'start')+TF(pl.X(12)-6,Math.max(70,pl.Y(cur[11])-12),'recency',13,C.coral,'end');
  out+=TF(300,316,'dashes: immediate recall, 3 s apart · blue: your settings',13,C.muted);
  const lost=s.delay>=30,drop=s.delay===10;
  out+=T(300,346,lost?'After 30 s of counting the recency effect is gone; primacy stays.':drop?'Ten seconds of counting already halves the recency advantage.':s.gap>3?'Slower words raise the early and middle items, not the last ones.':'Immediate recall: a clear U shape.',15,C.ink);
  return {svg:out,phase:'Counting stops rehearsal and pushes the last words out of short-term memory, so recency goes; primacy comes from long-term memory, which slower presentation helps. Two effects with two causes suggested two stores, though later work found recency in long-term memory too.'};
 }});

function D4_buffer(size,seed){
 const r=D4_rng(seed),buf=[],reh=Array(12).fill(0),frames=[];
 for(let i=0;i<12;i++){let out=null;if(buf.length>=size){const j=Math.floor(r()*buf.length);out=buf[j];buf.splice(j,1)}buf.push(i);buf.forEach(k=>reh[k]+=4/buf.length);
  frames.push({i,buf:buf.slice(),reh:reh.slice(),out,say:out===null?`“${D4_SPW[i]}” joins the rehearsal buffer; each word in it shares four rehearsals.`:`“${D4_SPW[i]}” arrives and “${D4_SPW[out]}” drops out of the buffer.`})}
 const last=frames[11],pr=range(12).map(k=>last.buf.includes(k)?.95:1-Math.exp(-.3*last.reh[k]));
 frames.push({...last,i:12,out:null,recall:pr,say:'Recall: words still in the buffer come out first (recency); the rest depend on how often they were rehearsed (primacy).'});
 return frames;
}
SCENE({id:'serial-position-model',name:'A buffer model',tag:'Rehearsal explains primacy',
 definition:'In the two-store model of Atkinson and Shiffrin, new items enter a small rehearsal buffer. Words that stay there long or are rehearsed often get into long-term memory; words still in the buffer at the end are recalled straight out of it.',
 example:'The first word is alone in the buffer and gets all the rehearsal; the fifth word shares it with three others. When Rundus had people rehearse aloud, early words were rehearsed most.',
 desc:'A four-slot buffer filling with twelve words, one at a time, with a bar for each word’s rehearsals; at the end, the predicted recall at each position shows primacy and recency.',
 research:'Atkinson & Shiffrin (1968). Human memory: a proposed system and its control processes; Rundus (1971). Analysis of rehearsal processes in free recall. Journal of Experimental Psychology 89, 63–77. Challenged by long-term recency (Bjork & Whitten 1974).',
 dur:13,hint:'Step through the list. Change the buffer size or the random drop-outs and watch the curve at the end.',
 init:()=>({size:4,seed:3}),
 trace:s=>D4_buffer(s.size,s.seed),
 ui:[{range:'size',label:'Buffer size',min:2,max:6,step:1,get:s=>s.size,act:'size',show:v=>v+' words'},{b:'New random drop-outs',act:'seed'}],
 on:{size(s,v){s.size=v},seed(s){s.seed=nextSeed()}},
 draw(s,f){
  f=f||D4_buffer(s.size,s.seed)[0];let out=heading('Atkinson and Shiffrin’s rehearsal buffer',26);
  const bw=300/s.size;out+=TF(300,48,'rehearsal buffer (short-term store)',13,C.muted);
  for(let j=0;j<s.size;j++){const k=f.buf[j];out+=R(150+j*bw+3,56,bw-6,44,k===undefined?'#f6f9fb':k===f.i?C.pale:'#fff',k===f.i?C.blue:C.grid,6);if(k!==undefined)out+=TF(150+j*bw+bw/2,83,D4_SPW[k],14,C.ink)}
  if(f.i<12)out+=TF(76,72,'new word',13,C.muted)+TBF(76,92,D4_SPW[f.i],14,C.blue)+arrow(112,82,144,82,C.blue,2);
  if(f.out!==null&&f.out!==undefined)out+=arrow(456,82,488,82,C.coral,2)+TF(530,72,'dropped',13,C.muted)+TBF(530,92,D4_SPW[f.out],14,C.coral);
  const base=262,cw=40,x0=60;
  out+=TF(300,126,f.recall?'predicted recall at each position':'rehearsals each word has had so far',13,C.muted)+L(x0-6,base,x0+12*cw,base,C.line,1.5);
  for(let k=0;k<12;k++){const x=x0+k*cw;let v,h,col;
   if(f.recall){v=f.recall[k];h=v*110;col=f.buf.includes(k)?C.coral:C.blue;out+=R(x+6,base-h,cw-12,h,col,'none',3)+TF(x+cw/2,base-h-5,D4_pct(v),13,C.ink)}
   else if(k<=f.i){v=f.reh[k];h=Math.min(110,v*12);col=f.buf.includes(k)?C.blue:C.line;out+=R(x+6,base-h,cw-12,h,col,'none',3)+TF(x+cw/2,base-h-5,fmt(Math.round(v*10)/10),13,C.ink)}
   out+=TF(x+cw/2,base+17,String(k+1),13,C.muted)}
  out+=TF(300,298,f.recall?'coral: still in the buffer · blue: from long-term memory':'blue: in the buffer now · grey: dropped out',13,C.muted);
  out+=T(300,334,f.recall?'The model’s curve: high at the start and at the end.':`Word ${f.i+1} of 12`,15,C.ink);
  return {svg:out,phase:f.say};
 }});

/* =========================== encoding-context =========================== */
const D4_GB={LL:13.5,LW:8.6,WL:8.4,WW:11.4};
function D4_place(x,y,kind,on){let out=R(x,y,110,70,kind==='L'?'#fbefd5':'#dcecf6',on?C.amber:C.grid,8);
 if(kind==='L')out+=Ci(x+86,y+20,10,C.amber)+P(`M${x+4} ${y+52} Q${x+55} ${y+40} ${x+106} ${y+52}`,C.amber,2);
 else out+=P(`M${x+6} ${y+18} q12 -8 24 0 t24 0 t24 0 t24 0`,C.blue,2)+Ci(x+30,y+44,4,'none',C.blue)+Ci(x+42,y+34,3,'none',C.blue)+Ci(x+80,y+48,5,'none',C.blue);
 return out+TF(x+55,y+88,kind==='L'?'on the beach':'underwater',13,C.ink)}
SCENE({id:'encoding-context',name:'Context and recall',tag:'Learn here, remember here',
 definition:'Memory is helped when the setting at recall matches the setting at learning. The surroundings get stored with what you learned and act as a cue.',
 example:'Divers learned word lists on a beach or under 6 m of water, then recalled them in the same or the other place. Recall was better when the two places matched.',
 desc:'Pictures of a beach and of underwater, with an arrow from where the list was learned to where it was recalled, and grouped bars of mean words recalled (out of 36) for the four combinations.',
 research:'Godden & Baddeley (1975). Context-dependent memory in two natural environments: on land and underwater. British Journal of Psychology 66, 325–331. A 2021 replication found no reliable effect (Murre 2021, Royal Society Open Science 8, 200724).',
 dur:10,hint:'Choose where the divers learned and where they were tested. Then read the replication note: one classic study is not the last word.',
 init:()=>({learn:'L',test:'W'}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {learn:k<2?'L':'W',test:['L','W','W','L'][k]}},
 ui:[{choose:[['L','Learn on the beach'],['W','Learn underwater']],label:'Learn',get:s=>s.learn,act:'learn'},{choose:[['L','Test on the beach'],['W','Test underwater']],label:'Test',get:s=>s.test,act:'test'}],
 on:{learn(s,v){s.learn=v},test(s,v){s.test=v}},
 draw(s){
  let out=heading('Divers learning on land and underwater',26);
  out+=TF(85,56,'learn',13,C.muted)+TF(215,56,'test',13,C.muted);
  out+=D4_place(30,66,s.learn,true)+D4_place(160,66,s.test,true)+arrow(142,101,158,101,C.ink,2);
  const same=s.learn===s.test,v=D4_GB[s.learn+s.test];
  out+=R(30,184,240,92,same?C.greenp:C.coralp,'none',8)+TB(150,218,`${v} of 36 words`,20,C.ink)+TF(150,246,same?'same place: context helps':'places differ: fewer words',14,same?C.green:C.coral);
  const pl=D4_plot(340,56,232,200,[0,4],[0,15],{yt:[[0,'0'],[5,'5'],[10,'10'],[15,'15']],yl:'words recalled'});out+=pl.svg;
  [['L','learned on land',0],['W','learned underwater',2]].forEach(([l,lab,g])=>{['L','W'].forEach((t,j)=>{const val=D4_GB[l+t],x0=pl.X(g+.25+j*.75),w=pl.X(.7)-pl.X(0),sel=s.learn===l&&s.test===t;
   out+=R(x0,pl.Y(val),w,pl.Y(0)-pl.Y(val),t==='L'?C.amber:C.blue,'none',3);if(sel)out+=R(x0-3,pl.Y(val)-3,w+6,pl.Y(0)-pl.Y(val)+6,'none',C.ink,4);out+=TBF(x0+w/2,pl.Y(val)-6,String(val),13,C.ink)});
   out+=TF(pl.X(g+1),274,lab,13,C.ink)});
  out+=Ci(372,298,6,C.amber)+TF(382,303,'tested on land',13,C.muted,'start')+Ci(482,298,6,C.blue)+TF(492,303,'underwater',13,C.muted,'start');
  out+=T(300,334,'Godden and Baddeley (1975): matching places helped by about 40%.',14,C.ink);
  out+=TF(300,358,'But Murre’s 2021 replication found no reliable difference.',13,C.coral);
  return {svg:out,phase:same?'Learning and testing in the same place gave the best recall in the original study: the setting was stored with the words and helped bring them back.':'Moving between beach and water cost the divers several words in 1975. A careful 2021 replication did not find the effect, so context effects may be weaker and less general than textbooks suggest.'};
 }});

const D4_LOP=[
 {w:'table',k:'case',q:'Is the word in capital letters?',show:'TABLE'},{w:'pillow',k:'case',q:'Is the word in capital letters?',show:'pillow'},
 {w:'cheese',k:'case',q:'Is the word in capital letters?',show:'CHEESE'},{w:'brick',k:'case',q:'Is the word in capital letters?',show:'brick'},
 {w:'crate',k:'rhyme',q:'Does it rhyme with “weight”?'},{w:'chair',k:'rhyme',q:'Does it rhyme with “lamp”?'},
 {w:'goat',k:'rhyme',q:'Does it rhyme with “coat”?'},{w:'drum',k:'rhyme',q:'Does it rhyme with “wheel”?'},
 {w:'shark',k:'meaning',q:'Is it a kind of fish?'},{w:'cloud',k:'meaning',q:'Is it a kind of animal?'},
 {w:'tulip',k:'meaning',q:'Is it a kind of flower?'},{w:'spoon',k:'meaning',q:'Is it a kind of bird?'}];
const D4_LOP_NEW=['plate','river','mouse','glove','train','lemon','sheep','bell','coin','tent','kite','frog'];
const D4_lopOrder=s=>shuffled(range(12),D4_mix(s.seed+11));
const D4_lopTest=s=>shuffled(D4_LOP.map(i=>i.w).concat(D4_LOP_NEW),D4_mix(s.seed+23));
const D4_LOPK=[['case','letters'],['rhyme','sound'],['meaning','meaning']];
SCENE({id:'encoding-context-levels',name:'Levels of processing',tag:'You are the participant',
 definition:'How you think about a word when you meet it matters more than how long you look at it. Judging its meaning (deep processing) leaves a much stronger memory than judging its sound, and judging its sound beats judging its letters (shallow processing).',
 example:'Answer “Is it a kind of fish?” about shark and “Is it in capitals?” about TABLE. Later, shark is far more likely to be remembered, even though you were not trying to remember either.',
 desc:'Twelve words, each with a question about its letters, its sound or its meaning; then a grid of twenty-four words in which you mark the ones you saw. Bars show how many of each kind you recognised.',
 research:'Craik & Lockhart (1972). Levels of processing: a framework for memory research; Craik & Tulving (1975). Depth of processing and the retention of words in episodic memory. Journal of Experimental Psychology: General 104, 268–294. Robust; “depth” itself is hard to define independently.',
 dur:13,hint:'Press Start, answer each question with Yes or No, then mark every word you saw and press Finished choosing. Your answers stay on this page.',
 init:()=>({seed:1,ph:'ready',i:0,picked:[],res:null}),
 watch(p){if(p<.45)return {seed:1,ph:'study',i:Math.min(11,Math.floor(p/.45*12)),picked:[],res:null,sim:true};if(p<.7){const t=D4_lopTest({seed:1});return {seed:1,ph:'test',i:12,picked:t.filter(w=>['shark','tulip','cloud','goat','crate','spoon','kite'].includes(w)).slice(0,Math.floor((p-.45)/.25*7)),res:null,sim:true}}return {seed:1,ph:'done',i:12,picked:[],res:{case:1,rhyme:2,meaning:4,fa:1},sim:true}},
 ui:[{b:'Start',act:'start'},{b:'Yes',act:'answer',arg:1},{b:'No',act:'answer',arg:0},{b:'Finished choosing',act:'done'},{b:'Start again',act:'again'}],
 on:{start(s){if(s.ph==='study'||s.ph==='test')return 'keep';s.ph='study';s.i=0;s.picked=[];s.res=null},
  answer(s){if(s.ph!=='study')return 'keep';s.i++;if(s.i>=12)s.ph='test'},
  pick(s,w){if(s.ph!=='test')return;const j=s.picked.indexOf(w);if(j>=0)s.picked.splice(j,1);else s.picked.push(w)},
  done(s){if(s.ph!=='test')return 'keep';const r={case:0,rhyme:0,meaning:0,fa:0};D4_LOP.forEach(it=>{if(s.picked.includes(it.w))r[it.k]++});r.fa=D4_LOP_NEW.filter(w=>s.picked.includes(w)).length;s.res=r;s.ph='done'},
  again(s){s.seed=nextSeed();s.ph='ready';s.i=0;s.picked=[];s.res=null}},
 draw(s,f,X){
  let out=heading('Letters, sound or meaning: which words stick?',26);
  if(s.ph==='ready'){out+=R(20,44,560,190,'#fff',C.grid,8)+T(300,110,'Press Start. You will answer a question',16,C.ink)+T(300,134,'about each of twelve words.',16,C.ink)+TF(300,170,'Just answer; there is no need to memorise.',14,C.muted)}
  else if(s.ph==='study'){const it=D4_LOP[D4_lopOrder(s)[Math.min(11,s.i)]];out+=R(20,44,560,190,'#fff',C.grid,8)+TF(300,68,`Word ${s.i+1} of 12`,13,C.muted)+T(300,112,it.q,18,C.ink)+TB(300,180,it.show||it.w,32,C.blue)}
  else if(s.ph==='test'){const t=D4_lopTest(s);out+=TF(300,50,'Press every word you saw, then Finished choosing',13,C.muted);
   t.forEach((w,i)=>{const c=i%6,r=Math.floor(i/6),x=24+c*93,y=60+r*42,on=s.picked.includes(w);out+=hit(X,'pick',w,'Word '+w+(on?', marked':''),R(x,y,87,34,on?C.pale:'#f6f9fb',on?C.blue:C.grid,6)+TF(x+43.5,y+22,w,14,on?C.blue:C.ink))})}
  else{const r=s.res;out+=TF(160,52,s.sim?'Simulated participant':'You: words recognised (of 4)',13,C.muted)+TF(450,52,'Published pattern (schematic)',13,C.muted);
   out+=L(40,226,280,226,C.line,1.5)+L(330,226,570,226,C.line,1.5);
   D4_LOPK.forEach(([k,lab],j)=>{out+=D4_vbar(56+j*76,226,52,r[k]/4*150,[C.line,C.amber,C.green][j],`${r[k]} of 4`,lab);out+=D4_vbar(346+j*76,226,52,[.3,.55,.85][j]*150,[C.line,C.amber,C.green][j],undefined,lab)})}
  if(s.ph==='done')out+=T(300,282,`Wrongly marked as seen: ${s.res.fa} of 12 new words`,15,C.ink);
  out+=TF(300,316,'letters: shallow · sound: intermediate · meaning: deep',13,C.muted);
  out+=T(300,346,'Meaning questions leave the strongest memories (Craik & Tulving 1975).',14,C.ink);
  return {svg:out,phase:s.ph==='done'?'Most people recognise far more of the meaning words, though they spent the same moment on each. Because you knew a test was coming, your gap may be smaller than in the original surprise test.':s.ph==='test'?'Mark the words you remember seeing. Twelve of the twenty-four are new.':'Each question makes you attend to a different level: how the word looks, how it sounds or what it means.'};
 }});

const D4_CUES={none:{lab:'No cue',v:.2,x:null,feat:[]},weak:{lab:'“ground”',v:.6,x:206,feat:['soil','frost','earth']},strong:{lab:'“hot”',v:.3,x:292,feat:['heat','weather','drink']}};
SCENE({id:'encoding-context-specificity',name:'Encoding specificity',tag:'The right cue is the one you stored',
 definition:'A cue helps recall only if it was part of how the memory was stored. The encoding specificity principle says retrieval works by overlap between the cue and the stored memory trace.',
 example:'Study COLD paired with “ground”. Later, “ground” brings COLD back better than “hot”, although hot is the stronger everyday associate of cold.',
 desc:'Two overlapping circles: what was stored with COLD at study and what the cue at test brings to mind; their overlap grows or shrinks with the cue, beside illustrative recall bars.',
 research:'Tulving & Thomson (1973). Encoding specificity and retrieval processes in episodic memory. Psychological Review 80, 352–373. Bars are illustrative of the ordering they found, not their exact values.',
 dur:9,hint:'Choose the cue given at test and watch the overlap with what was stored.',
 init:()=>({cue:'strong'}),
 watch(p){return {cue:p<.34?'none':p<.67?'weak':'strong'}},
 ui:[{choose:[['none','No cue'],['weak','Study cue “ground”'],['strong','Strong associate “hot”']],label:'Cue at test',get:s=>s.cue,act:'cue'}],
 on:{cue(s,v){s.cue=v}},
 draw(s){
  const c=D4_CUES[s.cue];let out=heading('Studied: “ground – COLD”. Which cue brings COLD back?',26);
  out+=Ci(150,170,86,C.pale,C.blue,'fill-opacity=".85"');
  out+=TF(150,72,'stored at study',13,C.blue)+TF(110,150,'soil',14,C.ink)+TF(104,178,'frost',14,C.ink)+TF(118,206,'earth',14,C.ink);
  if(c.x)out+=Ci(c.x,170,72,C.coralp,C.coral,'fill-opacity=".6"')+TF(c.x+24,90,'brought by the cue',13,C.coral)+(s.cue==='strong'?TF(c.x+30,158,'heat',14,C.ink)+TF(c.x+34,186,'weather',14,C.ink)+TF(c.x+28,214,'drink',14,C.ink):'');
  out+=TBF(s.cue==='weak'?196:172,s.cue==='weak'?236:178,'COLD',17,C.ink);
  const ov=s.cue==='weak'?'large overlap':s.cue==='strong'?'small overlap':'no cue: nothing to match';
  out+=TF(180,282,ov,14,s.cue==='weak'?C.green:s.cue==='strong'?C.amber:C.muted);
  out+=L(408,252,580,252,C.line,1.5)+TF(494,62,'recall (illustrative)',13,C.muted);
  Object.entries(D4_CUES).forEach(([k,o],j)=>{out+=D4_vbar(414+j*56,252,44,o.v*170,k===s.cue?C.blue:C.line,undefined,['none','ground','hot'][j])});
  out+=T(300,326,'Recall depends on overlap with the stored trace, not on cue strength.',14,C.ink);
  out+=TF(300,352,'The same idea explains context effects: the room is part of the trace.',13,C.muted);
  return {svg:out,phase:s.cue==='weak'?'“ground” was stored with COLD, so it matches the memory trace and brings it back.':s.cue==='strong'?'“hot” usually calls up cold, but it calls up the temperature sense, not the frosty-ground memory that was stored, so it helps less than you might expect.':'Without a cue, recall relies on whatever else you can bring to mind.'};
 }});

/* =========================== reconstructive-memory =========================== */
const D4_GHOST=['Two young men go to hunt seals','Mist and calm; they hear war cries','Men in canoes ask them to join a war','One refuses: his family would worry','The other goes to fight upriver','He is hit, but feels no pain','He realises the warriors were ghosts','At dawn something black leaves his mouth'];
// Each retelling: [status, text] per element; k kept, c changed, x lost.
const D4_RETELL=[
 [['c','Two young men go fishing'],['k','Mist and calm; they hear war cries'],['k','Men in canoes ask them to join a war'],['k','One refuses: his family would worry'],['k','The other goes to fight upriver'],['k','He is hit, but feels no pain'],['k','He realises the warriors were ghosts'],['k','At dawn something black leaves his mouth']],
 [['c','Two young men go fishing'],['x',''],['c','Men in a boat ask them to fight'],['k','One refuses: his family would worry'],['k','The other goes to fight upriver'],['k','He is hit, but feels no pain'],['k','He realises the warriors were ghosts'],['c','At dawn he foams at the mouth and dies']],
 [['c','Two young men go fishing'],['x',''],['c','Men in a boat ask them to fight'],['c','One says no; he must get home'],['k','The other goes to fight upriver'],['c','He is wounded'],['x',''],['c','He dies of his wound that night']],
 [['c','Two brothers go fishing'],['x',''],['c','They meet a war party'],['c','One goes home'],['c','The other is wounded in a battle'],['x',''],['x',''],['c','He dies of his wound']]];
const D4_RSAY=['The original story, paraphrased: a Native American folk tale that felt strange to Bartlett’s English students.','First retelling: seal hunting becomes fishing. Unfamiliar details are swapped for familiar ones (familiarisation).','Second: the mist goes, canoes become a boat, and the mysterious black thing becomes foaming at the mouth (omission and rationalisation).','Third: the ghosts, the heart of the story, vanish; the death now has an ordinary cause (rationalisation).','Fourth: a short, tidy war story. Memory kept the gist but rebuilt the details to fit what the teller expected.'];
SCENE({id:'reconstructive-memory',name:'Remembering as rebuilding',tag:'Bartlett’s War of the Ghosts',
 definition:'Remembering is not replaying a recording. We store the gist and rebuild the details from our expectations, or schemata, so memories drift towards what seems normal to us.',
 example:'English students who retold an unfamiliar Native American tale over weeks turned seal hunting into fishing, dropped the ghosts and explained away the strange death.',
 desc:'The eight main events of the War of the Ghosts beside a retelling; stepping through four retellings shows events kept, changed or lost, with change types named.',
 research:'Bartlett (1932). Remembering: A Study in Experimental and Social Psychology. Cambridge University Press. Retellings here are illustrative of the changes he reported. Bergman & Roediger (1999), Memory & Cognition 27, 937–947, replicated the distortions under controlled conditions.',
 dur:12,hint:'Step through the retellings. Press an event in the retelling to link it to the original line it came from.',
 init:()=>({sel:-1}),
 trace:()=>range(5).map(n=>({n,say:D4_RSAY[n]})),
 ui:[{b:'Clear the link',act:'sel',arg:-1}],
 on:{sel(s,v){s.sel=Number(v);return 'keep'}},
 draw(s,f,X){
  f=f||{n:0};const n=f.n,rt=n?D4_RETELL[n-1]:null;let out=heading(n?`Retelling ${n} of 4`:'The War of the Ghosts (paraphrased)',26);
  out+=TF(156,50,'original',13,C.muted)+TF(446,50,n?'retelling '+n:'retelling',13,C.muted);
  let kept=0,ch=0,lost=0;
  D4_GHOST.forEach((t,i)=>{const y=58+i*30;out+=R(16,y,282,26,'#fff',C.grid,5)+TF(24,y+18,t,13,C.ink,'start');
   if(!rt){out+=R(306,y,278,26,'#f6f9fb',C.grid,5);return}
   const [st,txt]=rt[i];if(st==='k')kept++;else if(st==='c')ch++;else lost++;
   const fill=st==='k'?C.greenp:st==='c'?C.amberp:'#f3f5f6',stroke=st==='x'?C.line:'none';
   out+=hit(X,'sel',i,'Retold event '+(i+1),R(306,y,278,26,fill,stroke,5,st==='x'?'stroke-dasharray="4 4"':'')+TF(314,y+18,st==='x'?'(forgotten)':txt,13,st==='x'?C.muted:C.ink,'start'));
   if(s.sel===i)out+=L(298,y+13,306,y+13,C.blue,3)+R(14,y-2,572,30,'none',C.blue,6)});
  if(rt)out+=T(300,318,`kept ${kept} · changed ${ch} · forgotten ${lost}`,15,C.ink)+TF(300,342,'green: kept · amber: changed · grey: forgotten',13,C.muted);
  else out+=T(300,318,'Step forward to see how the story changes as it is retold.',15,C.ink);
  out+=TF(300,366,'Illustrative retellings showing the kinds of change Bartlett reported',13,C.muted);
  return {svg:out,phase:f.say||D4_RSAY[n]};
 }});

const D4_LP=[['smashed',40.8],['collided',39.3],['bumped',38.1],['hit',34.0],['contacted',31.8]];
const D4_GLASS=[['smashed',.32],['hit',.14],['not asked',.12]];
SCENE({id:'reconstructive-memory-misinformation',name:'Leading questions',tag:'One word changes the memory',
 definition:'Information given after an event can change the memory of the event itself. This misinformation effect means the wording of a question can shape what a witness later remembers.',
 example:'After watching a film of a car crash, people asked how fast the cars were going when they “smashed” gave higher speeds than people asked about “hit”, and a week later more of them remembered broken glass that was never there.',
 desc:'Two cars meeting, a horizontal bar chart of mean speed estimates for each verb, and a second chart of how many people later said they saw broken glass.',
 research:'Loftus & Palmer (1974). Reconstruction of automobile destruction. Journal of Verbal Learning and Verbal Behavior 13, 585–589. The wider misinformation effect is robust (Loftus 2005, Learning & Memory 12, 361–366); part of the speed effect may be response bias.',
 dur:10,hint:'Choose the verb in the question and compare the speed estimates and the false memories of glass.',
 init:()=>({v:'smashed'}),
 watch(p){return {v:D4_LP[Math.min(4,Math.floor(p*5))][0]}},
 ui:[{choose:D4_LP.map(([v])=>[v,v]),label:'Verb in the question',get:s=>s.v,act:'v'}],
 on:{v(s,v){s.v=v}},
 draw(s){
  const est=D4_LP.find(r=>r[0]===s.v)[1];let out=heading('“How fast were the cars going when they …?”',26);
  out+=T(300,56,`“About how fast were the cars going when they ${s.v} into each other?”`,14,C.blue);
  const gap=Math.max(0,(est-31)*1.6);
  out+=R(40-gap,140,70,30,C.blue,'none',8)+Ci(56-gap,172,8,C.ink)+Ci(96-gap,172,8,C.ink)+R(140+gap,140,70,30,C.coral,'none',8)+Ci(156+gap,172,8,C.ink)+Ci(196+gap,172,8,C.ink);
  const sp=6+gap*.8;out+=P(`M125 ${155-sp} L128 ${155-sp/3} L${125+sp} 155 L128 ${155+sp/3} L125 ${155+sp} L122 ${155+sp/3} L${125-sp} 155 L122 ${155-sp/3} Z`,C.amber,1.5,C.amberp);
  out+=TB(125,218,`mean estimate ${est} mph`,15,C.ink);
  out+=TF(450,80,'mean estimate (mph)',13,C.muted);
  D4_LP.forEach(([v,m],i)=>{const y=92+i*28,on=v===s.v;out+=TF(356,y+15,v,14,on?C.blue:C.ink,'end')+R(364,y+2,m/45*180,18,on?C.blue:C.line,'none',3)+TF(370+m/45*180,y+16,String(m),13,C.ink,'start')});
  out+=L(364,90,364,232,C.ink,1.5);
  out+=TF(300,262,'A week later: “Did you see any broken glass?” (there was none)',14,C.ink);
  D4_GLASS.forEach(([v,m],i)=>{const y=274+i*24,on=v===s.v||(v==='not asked'&&false);out+=TF(196,y+14,v==='not asked'?'speed not asked':v,13,on?C.blue:C.ink,'end')+R(204,y+2,m*600,16,on?C.blue:C.line,'none',3)+TF(210+m*600,y+15,D4_pct(m)+' said yes',13,C.ink,'start')});
  out+=TF(300,366,'Loftus & Palmer (1974): Experiment 1 means and Experiment 2 “yes” rates',13,C.muted);
  return {svg:out,phase:s.v==='smashed'?'“Smashed” suggested a violent crash. People not only guessed higher speeds; a week later a third of them “remembered” broken glass that the film never showed.':'Milder verbs gave lower estimates. The question became part of the memory, which is why police interview guidance now avoids leading wording.'};
 }});

const D4_DRM=[{lure:'sleep',list:['bed','rest','awake','tired','dream','wake','snooze','blanket','doze','slumber','snore','nap']},{lure:'sweet',list:['sour','candy','sugar','bitter','good','taste','tooth','nice','honey','soda','chocolate','heart']}];
const D4_DRMW=D4_DRM[0].list.concat(D4_DRM[1].list);
const D4_DRMT=[['bed','old'],['dream','old'],['candy','old'],['honey','old'],['sleep','lure'],['sweet','lure'],['chair','new'],['river','new']];
const D4_drmOrder=s=>shuffled(range(8),D4_mix(s.seed+71));
SCENE({id:'reconstructive-memory-drm',name:'False memories in the lab',tag:'You are the participant',
 definition:'Hearing a list of words that are all associated with one missing word makes many people remember that word too, often vividly. It shows memory filling in from meaning.',
 example:'After bed, rest, awake, tired, dream, snooze, doze and nap, many people are sure they saw “sleep”, which was never on the list.',
 desc:'Twenty-four words appear one at a time, then eight test words, each answered as seen or not seen; bars show how often you said “seen” for studied words, for the two missing theme words and for unrelated words.',
 research:'Deese (1959); Roediger & McDermott (1995). Creating false memories: remembering words not presented in lists. Journal of Experimental Psychology: Learning, Memory, and Cognition 21, 803–814. The missing word was recalled about 40–55% of the time and recognised about as often as studied words. Highly replicable.',
 dur:13,hint:'Press Show the words and read them as they appear (about 20 seconds). Then answer Seen or Not seen for each test word. Your answers stay on this page.',
 init:()=>({seed:1,ph:'ready',idx:0,i:0,ans:{}}),
 watch(p){if(p<.5)return {seed:1,ph:'show',idx:Math.min(23,Math.floor(p/.5*24)),i:0,ans:{},sim:true};const ans={bed:1,dream:1,candy:1,honey:0,sleep:1,sweet:1,chair:0,river:0};if(p<.8){const o=D4_drmOrder({seed:1}),k=Math.floor((p-.5)/.3*8),a={};o.slice(0,k).forEach(j=>a[D4_DRMT[j][0]]=ans[D4_DRMT[j][0]]);return {seed:1,ph:'test',idx:24,i:k,ans:a,sim:true}}return {seed:1,ph:'done',idx:24,i:8,ans,sim:true}},
 ui:[{b:'Show the words',act:'start'},{b:'Seen',act:'answer',arg:1},{b:'Not seen',act:'answer',arg:0},{b:'Start again',act:'again'}],
 on:{start(s,_,ctx){if(s.ph!=='ready')return 'keep';s.ph='show';s.idx=0;ctx.every(800,'tick')},
  tick(s){if(s.ph!=='show')return 'stop';s.idx++;if(s.idx>=24){s.ph='test';s.i=0;return 'stop'}},
  answer(s,v){if(s.ph!=='test')return 'keep';const w=D4_DRMT[D4_drmOrder(s)[s.i]][0];s.ans[w]=Number(v);s.i++;if(s.i>=8)s.ph='done'},
  again(s){s.seed=nextSeed();s.ph='ready';s.idx=0;s.i=0;s.ans={}}},
 draw(s){
  let out=heading('Did you see this word?',26);
  out+=R(20,44,560,150,'#fff',C.grid,8);
  if(s.ph==='ready')out+=T(300,104,'Press Show the words.',17,C.ink)+TF(300,134,'Twenty-four words, a little under one a second. Just read them.',14,C.muted);
  else if(s.ph==='show')out+=TF(300,66,`word ${s.idx+1} of 24`,13,C.muted)+TB(300,140,D4_DRMW[Math.min(23,s.idx)],32,C.ink);
  else if(s.ph==='test'){const w=D4_DRMT[D4_drmOrder(s)[Math.min(7,s.i)]][0];out+=TF(300,66,`test word ${s.i+1} of 8`,13,C.muted)+TB(300,136,w,32,C.blue)+TF(300,172,'Was it on the list? Answer Seen or Not seen.',14,C.muted)}
  else out+=TB(300,104,'“sleep” and “sweet” were never shown.',18,C.coral)+TF(300,136,'Each list was built from words linked to one missing theme word.',14,C.muted);
  const rate=kind=>{const ws=D4_DRMT.filter(t=>t[1]===kind).map(t=>t[0]).filter(w=>w in s.ans);return ws.length?D4_mean(ws.map(w=>s.ans[w])):NaN};
  const groups=[['old','studied words',C.blue],['lure','missing theme words',C.coral],['new','unrelated words',C.line]];
  out+=TF(300,214,(s.sim?'Simulated participant':'You')+': how often you said “seen”',13,C.muted);
  out+=L(70,330,530,330,C.line,1.5);
  groups.forEach(([k,lab,col],j)=>{const v=rate(k);out+=D4_vbar(110+j*150,330,80,isNaN(v)?0:v*90,col,D4_pct(v),lab)});
  return {svg:out,phase:s.ph==='done'?(s.ans.sleep||s.ans.sweet?'You “remembered” a word you never saw, as most people do. The theme word was activated by every word on the list, and that feeling of familiarity is easy to mistake for memory.':'You rejected the missing theme words, which many people do not. In the original study they were recognised about as often as words that were really shown.'):s.ph==='test'?'Answer from memory; do not scroll back.':'Each list circles one theme word that is never shown.'};
 }});

/* =========================== spacing-effect =========================== */
function D4_mem(rev){
 const ev=rev.slice().sort((a,b)=>a-b);let S=1.2,last=0,j=0;const pts=[];
 for(let t=0;t<=60.001;t+=.25){while(j<ev.length&&ev[j]<=t+1e-9){const Rn=Math.exp(-(ev[j]-last)/S);pts.push([ev[j],Rn]);S=S*(1+2.2*(1-Rn))+.3;last=ev[j];pts.push([ev[j],1]);j++}pts.push([t,Math.exp(-(t-last)/S)])}
 return {pts,at:t=>{let S2=1.2,l2=0;for(const e of ev){if(e>t)break;const Rn=Math.exp(-(e-l2)/S2);S2=S2*(1+2.2*(1-Rn))+.3;l2=e}return Math.exp(-(t-l2)/S2)}};
}
const D4_PRESETS={massed:[1,1,1],expanding:[1,4,12],even:[7,14,21],cram:[27,28,29]};
SCENE({id:'spacing-effect',name:'The spacing effect',tag:'Spread it out',
 definition:'Reviews spread out over time produce much longer-lasting memories than the same reviews crammed together. A review helps most when some forgetting has already happened.',
 example:'Three reviews on the day you learn something feel productive but fade within days; the same three spread over three weeks can last for months.',
 desc:'A forgetting curve over sixty days with three review days you can move; each review resets the curve and flattens it, and test lines at day 30 and day 60 show what is left.',
 research:'Ebbinghaus (1885). Über das Gedächtnis; Cepeda, Pashler, Vul, Wixted & Rohrer (2006). Distributed practice in verbal recall tasks: a review and quantitative synthesis. Psychological Bulletin 132, 354–380. One of the most robust findings in learning; the curve here is a toy model, not fitted to data.',
 dur:12,hint:'Move the three review days, or try the presets. Watch day 30 (an exam) and day 60 (what you keep).',
 init:()=>({r:[1,4,12]}),
 watch(p){return {r:D4_PRESETS[['massed','cram','expanding','even'][Math.min(3,Math.floor(p*4))]].slice()}},
 ui:[{range:'r1',label:'Review 1',min:1,max:29,step:1,get:s=>s.r[0],act:'r0',show:v=>'day '+v},{range:'r2',label:'Review 2',min:1,max:29,step:1,get:s=>s.r[1],act:'r1',show:v=>'day '+v},{range:'r3',label:'Review 3',min:1,max:29,step:1,get:s=>s.r[2],act:'r2',show:v=>'day '+v},
  {b:'All on day 1',act:'pre',arg:'massed'},{b:'Cram before day 30',act:'pre',arg:'cram'},{b:'Expanding',act:'pre',arg:'expanding'},{b:'Evenly spaced',act:'pre',arg:'even'}],
 on:{r0(s,v){s.r[0]=Number(v)},r1(s,v){s.r[1]=Number(v)},r2(s,v){s.r[2]=Number(v)},pre(s,k){s.r=D4_PRESETS[k].slice()}},
 draw(s){
  let out=heading('Three reviews: when should they happen?',26);
  const m=D4_mem(s.r),pl=D4_plot(70,52,500,200,[0,60],[0,1],{xt:[[0,'0'],[10,'10'],[20,'20'],[30,'30'],[40,'40'],[50,'50'],[60,'60']],yt:[[0,'0'],[.5,'50%'],[1,'100%']],xl:'days after first learning',yl:'chance of recall (model)'});out+=pl.svg;
  for(const d of [30,60])out+=L(pl.X(d),52,pl.X(d),252,C.amber,1.6,'stroke-dasharray="5 4"');
  out+=D4_poly(m.pts.map(([t,v])=>[pl.X(t),pl.Y(v)]),C.blue,2.4);
  s.r.forEach(d=>out+=P(`M${fmt(pl.X(d))} 246 l-5 -9 h10 z`,C.green,1,C.green));
  const a=m.at(30),b=m.at(60);
  out+=Ci(pl.X(30),pl.Y(a),6,C.amber)+Ci(pl.X(60),pl.Y(b),6,C.amber);
  out+=TBF(pl.X(30)+8,Math.max(70,pl.Y(a)-8),D4_pct(a),14,C.ink,'start')+TBF(pl.X(60)-8,Math.max(70,pl.Y(b)-8),D4_pct(b),14,C.ink,'end');
  out+=TF(300,306,'green triangles: review days · amber: tests at day 30 and day 60',13,C.muted);
  const rs=s.r.slice().sort((x,y)=>x-y),cram=rs[0]>=24,massed=!cram&&rs[2]-rs[0]<=1;
  out+=T(300,338,`Day 30: ${D4_pct(a)} · day 60: ${D4_pct(b)}`,16,C.ink);
  out+=TF(300,362,'A toy model: each review boosts memory more when some forgetting has happened.',13,C.muted);
  return {svg:out,phase:massed?'Reviewing again straight away adds little: the memory is still fresh, so there is nothing to strengthen. By day 30 almost everything is gone.':cram?'Cramming just before the test looks great on day 30, then collapses: by day 60 little is left. Spaced reviews last.':'Spacing the reviews lets each one catch the memory as it fades, and every successful recall then fades more slowly.'};
 }});

const D4_RIS=[7,35,70,350];
const D4_opt=ri=>ri*.25*Math.pow(ri/7,-.3);
const D4_lag=(g,ri)=>{const A=.78*Math.pow(ri/7,-.17),o=D4_opt(ri),d=Math.log(g+1)-Math.log(o+1);return A*(.5+.5*Math.exp(-d*d/(2*.85*.85)))};
SCENE({id:'spacing-effect-lag',name:'How far apart?',tag:'The best gap grows with the wait',
 definition:'The best gap between two study sessions depends on how long you need to remember. For a test in a week, a gap of a day or two is good; to remember for a year, gaps of weeks work better. The best gap grows with the retention interval, but becomes a smaller fraction of it.',
 example:'For an exam in five weeks, restudying about a week after first learning does better than restudying the next day or a month later.',
 desc:'Final recall plotted against the gap between two sessions on a log scale, for a chosen retention interval, with the best gap marked; the 3D view shows the whole surface and its ridge.',
 research:'Cepeda, Vul, Rohrer, Wixted & Pashler (2008). Spacing effects in learning: a temporal ridgeline of optimal retention. Psychological Science 19, 1095–1102. The curves here are a schematic of their pattern, not their data.',
 dur:12,hint:'Choose how long you need to remember, then slide the gap. Switch to 3D to see the ridge of best gaps.',
 init:()=>({ri:35,gap:1}),
 watch(p){return {ri:p<.5?35:350,gap:Math.round(Math.exp((p<.5?p*2:(p-.5)*2)*Math.log(121))-1)}},
 ui:[{choose:D4_RIS.map(r=>[r,r===350?'a year':r+' days']),label:'Remember for',get:s=>s.ri,act:'ri'},{range:'gap',label:'Gap between sessions',min:0,max:120,step:1,get:s=>s.gap,act:'gap',show:v=>v+' days'}],
 on:{ri(s,v){s.ri=Number(v)},gap(s,v){s.gap=Number(v)}},
 draw(s){
  let out=heading('Gap between sessions and later recall',26);
  const lx=g=>Math.log(g+1)/Math.log(121),pl=D4_plot(80,52,480,200,[0,1],[0,1],{xt:[[0,'0'],[lx(1),'1'],[lx(7),'7'],[lx(30),'30'],[lx(120),'120 days']],yt:[[0,'0'],[.5,'50%'],[1,'100%']],xl:'gap between the two study sessions (log scale)',yl:'final recall (schematic)'});out+=pl.svg;
  D4_RIS.forEach(ri=>{if(ri===s.ri)return;out+=D4_poly(range(61).map(i=>{const g=Math.exp(i/60*Math.log(121))-1;return [pl.X(lx(g)),pl.Y(D4_lag(g,ri))]}),C.line,1.5)});
  out+=D4_poly(range(61).map(i=>{const g=Math.exp(i/60*Math.log(121))-1;return [pl.X(lx(g)),pl.Y(D4_lag(g,s.ri))]}),C.blue,3);
  const o=D4_opt(s.ri),v=D4_lag(s.gap,s.ri);
  out+=L(pl.X(lx(o)),52,pl.X(lx(o)),252,C.green,1.6,'stroke-dasharray="5 4"')+TF(pl.X(lx(o))+5,68,`best ≈ ${Math.round(o)} days`,13,C.green,'start');
  out+=Ci(pl.X(lx(s.gap)),pl.Y(v),7,C.coral);
  const lab=s.ri===350?'a year':s.ri+' days';
  out+=T(300,316,`Remember for ${lab}: a ${s.gap}-day gap gives ${D4_pct(v)}; the best gap is about ${Math.round(o)} days.`,14,C.ink);
  out+=TF(300,342,`Best gap ≈ ${Math.round(o/s.ri*100)}% of the retention interval · grey: the other intervals`,13,C.muted);
  out+=TF(300,364,'Schematic after Cepeda et al. (2008); real values vary with material and learners.',13,C.muted);
  return {svg:out,phase:s.gap<o/3?'This gap is too short: the second session comes before any useful forgetting.':s.gap>o*3?'This gap is too long: much has been forgotten before the second session, so it is almost like starting again.':'Near the best gap: the second session comes when the memory has faded a little but can still be retrieved.'};
 },
 three(s,f,X,project){
  const P=project([0,1.6,0,1.6,0,1.2]),N=14,M=10,riAt=v=>7*Math.pow(50,v),z=(u,v)=>1.4*D4_lag(Math.exp(u*Math.log(121))-1,riAt(v));let out='';
  for(let j=0;j<=M;j++){const v=j/M;out+=D4_poly(range(N+1).map(i=>P([i/N*1.6,v*1.6,z(i/N,v)])),C.line,1.2)}
  for(let i=0;i<=N;i++){const u=i/N;out+=D4_poly(range(M+1).map(j=>P([u*1.6,j/M*1.6,z(u,j/M)])),C.line,1.2)}
  out+=D4_poly(range(M+1).map(j=>{const v=j/M,u=Math.log(D4_opt(riAt(v))+1)/Math.log(121);return P([u*1.6,v*1.6,z(u,v)])}),C.coral,3);
  const vs=Math.log(s.ri/7)/Math.log(50),us=Math.log(s.gap+1)/Math.log(121);out+=point3([us*1.6,vs*1.6,z(us,vs)],P,C.blue,8);
  const a=P([1.75,0,0]),b=P([0,1.75,0]);out+=label3(a[0],a[1]+18,'longer gap',14,C.muted)+label3(b[0],b[1]+18,'remember longer',14,C.muted);
  return {svg:out,title:'The temporal ridgeline',caption:'Height is final recall. The coral ridge marks the best gap for each retention interval: it moves to longer gaps as the interval grows, while recall itself falls.'};
 }});

const D4_ART=[C.blue,C.coral,C.green];
function D4_tile(x,y,a){let out=R(x,y,38,38,'#fff',D4_ART[a],4);
 if(a===0)out+=Ci(x+13,y+14,6,D4_ART[0])+Ci(x+25,y+25,8,'none',D4_ART[0]);
 else if(a===1)out+=L(x+6,y+10,x+32,y+10,D4_ART[1],3)+L(x+6,y+19,x+32,y+19,D4_ART[1],3)+L(x+6,y+28,x+32,y+28,D4_ART[1],3);
 else out+=P(`M${x+8} ${y+30} L${x+19} ${y+8} L${x+30} ${y+30} Z`,D4_ART[2],2,C.greenp);
 return out}
SCENE({id:'spacing-effect-interleaving',name:'Interleaving',tag:'Mix it up',
 definition:'Interleaving means mixing different kinds of example or problem in one practice session instead of doing one kind at a time (blocking). It often feels harder during practice but helps people tell the kinds apart later.',
 example:'Learners who saw paintings by several artists mixed together were better at naming the artist of new paintings than learners who saw each artist’s paintings in a block, yet most believed blocking had helped them more.',
 desc:'A practice sequence of twelve paintings by three artists, blocked or interleaved, with bars for performance during practice and on a later test with new paintings; a slider sets how alike the artists are.',
 research:'Kornell & Bjork (2008). Learning concepts and categories: is spacing the “enemy of induction”? Psychological Science 19, 585–592. The benefit is largest when categories are similar and can reverse when they are very different (Carvalho & Goldstone 2014). Bars are illustrative.',
 dur:10,hint:'Switch between blocked and interleaved practice, then change how alike the artists are.',
 init:()=>({order:'inter',sim:.7}),
 watch(p){return {order:p<.5?'block':'inter',sim:p<.75?.7:.15}},
 ui:[{choose:[['block','Blocked'],['inter','Interleaved']],label:'Practice order',get:s=>s.order,act:'order'},{range:'sim',label:'How alike the artists are',min:0,max:1,step:.05,get:s=>s.sim,act:'sim',show:v=>v<.34?'very different':v<.67?'somewhat alike':'very alike'}],
 on:{order(s,v){s.order=v},sim(s,v){s.sim=Number(v)}},
 draw(s){
  let out=heading('Practise one artist at a time, or mix them?',26);
  const seq=s.order==='block'?[0,0,0,0,1,1,1,1,2,2,2,2]:[0,1,2,1,0,2,2,0,1,0,2,1];
  out+=TF(300,50,'practice sequence: three artists, four paintings each',13,C.muted);
  seq.forEach((a,i)=>out+=D4_tile(36+i*44,58,a));
  const ben=-.08+.32*s.sim,pr={block:.82,inter:.66},te={block:.46,inter:clamp(.46+ben,0,1)};
  out+=L(70,270,290,270,C.line,1.5)+L(330,270,550,270,C.line,1.5);
  out+=TF(180,130,'during practice',13,C.muted)+TF(440,130,'test on new paintings',13,C.muted);
  [['block','blocked',C.line],['inter','interleaved',C.blue]].forEach(([k,lab,col],j)=>{const on=s.order===k;
   out+=D4_vbar(96+j*100,270,64,pr[k]*120,on?col:'#e6edf2',D4_pct(pr[k]),lab)+D4_vbar(356+j*100,270,64,te[k]*120,on?col:'#e6edf2',D4_pct(te[k]),lab)});
  out+=T(300,322,ben>0?'Interleaving feels harder but wins on the later test.':'With very different artists, blocking does as well or better.',15,ben>0?C.green:C.amber);
  out+=TF(300,348,'Illustrative values; most learners wrongly judge blocking to be better.',13,C.muted);
  return {svg:out,phase:s.order==='inter'?'Mixing forces you to notice what differs between artists, which is exactly what the test needs. It costs some accuracy during practice.':'Blocking makes practice smooth, because you know what is coming, but you learn less about what tells the artists apart.'};
 }});

/* =========================== testing-effect =========================== */
const D4_RK={SSSS:[.83,.40],SSST:[.78,.56],STTT:[.71,.61]};
SCENE({id:'testing-effect',name:'The testing effect',tag:'Recall is practice',
 definition:'Trying to recall something strengthens memory more than reading it again. Tests are not only a way of measuring learning; retrieving is itself one of the best ways to learn.',
 example:'Students read a prose passage four times, or read it three times and recalled it once, or read it once and recalled it three times. Five minutes later, rereading looked best; a week later, the most-tested group remembered most.',
 desc:'Three study schedules drawn as rows of S (study) and T (test) blocks, and a line chart of recall after five minutes and after a week showing the lines cross.',
 research:'Roediger & Karpicke (2006). Test-enhanced learning: taking memory tests improves long-term retention. Psychological Science 17, 249–255 (Experiment 2 values, rounded). Robust across hundreds of studies (Rowland 2014 meta-analysis).',
 dur:10,hint:'Choose a schedule and a delay; press a row to choose it too. Watch the lines cross between five minutes and a week.',
 init:()=>({cond:'STTT',delay:1}),
 watch(p){return {cond:['SSSS','SSST','STTT'][Math.min(2,Math.floor(p*3))],delay:(p*3)%1<.5?0:1}},
 ui:[{choose:Object.keys(D4_RK).map(k=>[k,k]),label:'Schedule',get:s=>s.cond,act:'cond'},{choose:[[0,'After 5 minutes'],[1,'After 1 week']],label:'Final test',get:s=>s.delay,act:'delay'}],
 on:{cond(s,v){s.cond=v},delay(s,v){s.delay=Number(v)}},
 draw(s,f,X){
  let out=heading('Restudy or test yourself?',26);
  const cols={SSSS:C.line,SSST:C.amber,STTT:C.green};
  Object.keys(D4_RK).forEach((k,j)=>{const y=60+j*58,on=k===s.cond;let row=R(20,y,240,46,on?C.pale:'#fff',on?C.blue:C.grid,8);
   Array.from(k).forEach((c,i)=>row+=R(30+i*44,y+8,38,30,c==='S'?C.purplep:C.greenp,'none',5)+TBF(49+i*44,y+29,c,15,c==='S'?C.purple:C.green));
   row+=Ci(222,y+23,7,cols[k]);out+=hit(X,'cond',k,'Schedule '+k,row)});
  out+=TF(140,250,'S: read the passage · T: recall it',13,C.muted);
  const pl=D4_plot(330,56,236,190,[-.3,1.3],[.3,.9],{xt:[[0,'5 minutes'],[1,'1 week']],yt:[[.3,'30%'],[.6,'60%'],[.9,'90%']],yl:'recalled'});out+=pl.svg;
  Object.entries(D4_RK).forEach(([k,[a,b]])=>{const on=k===s.cond;out+=L(pl.X(0),pl.Y(a),pl.X(1),pl.Y(b),cols[k],on?4:2);
   [[0,a],[1,b]].forEach(([d,v])=>{out+=Ci(pl.X(d),pl.Y(v),on?7:5,cols[k]);if(on)out+=TBF(pl.X(d)+(d?-12:12),pl.Y(v)+(k==='SSSS'&&d===1?18:-9),D4_pct(v),13,C.ink,d?'end':'start')})});
  out+=Ci(pl.X(s.delay),pl.Y(D4_RK[s.cond][s.delay]),11,'none',C.ink);
  const v=D4_RK[s.cond][s.delay];
  out+=T(300,312,`${s.cond} ${s.delay?'after a week':'after five minutes'}: ${D4_pct(v)} recalled`,16,C.ink);
  out+=T(300,342,s.delay?'After a week, more testing means more remembered.':'After five minutes, extra reading still looks better.',14,s.delay?C.green:C.amber);
  out+=TF(300,366,'The restudy group also predicted they would remember the most.',13,C.muted);
  return {svg:out,phase:s.delay?'The lines cross: a week later, the students who mostly tested themselves recalled about half as much again as those who only reread.':'Short-term, rereading wins because the text is fresh. That is why rereading feels effective, and why its weakness only shows later.'};
 }});

const D4_SW=[['mbwa','dog'],['paka','cat'],['maji','water'],['kitabu','book'],['nyumba','house'],['chakula','food'],['jua','sun'],['mti','tree']];
const D4_swTested=s=>new Set(shuffled(range(8),D4_mix(s.seed+3)).slice(0,4));
const D4_swOrder=(s,ph)=>shuffled(range(8),D4_mix(s.seed+(ph==='final'?29:13)));
const D4_swOpts=(s,idx,ph)=>shuffled([idx].concat(shuffled(range(8).filter(i=>i!==idx),D4_mix(s.seed*7+idx+(ph==='final'?100:0))).slice(0,3)),D4_mix(s.seed*13+idx+(ph==='final'?50:0)));
SCENE({id:'testing-effect-practice',name:'Retrieval practice',tag:'You are the participant',
 definition:'Retrieval practice means studying by trying to recall answers rather than by looking at them again. Even a short quiz with feedback makes the tested items much more durable than the same time spent restudying.',
 example:'Learn eight Swahili words. Restudy four of them and quiz yourself on the other four, then take a final test on all eight.',
 desc:'Eight Swahili–English pairs: you study them all, restudy four and are quizzed on four, then answer a final multiple-choice test; bars compare your final scores for restudied and quizzed words with the published one-week result.',
 research:'Karpicke & Roediger (2008). The critical importance of retrieval for learning. Science 319, 966–968: a week later, about 80% of words that kept being tested were recalled, against about 35% of words that were only restudied. Your test here comes after a minute, when the gap is usually small.',
 dur:13,hint:'Press Start, study the eight pairs, then press Next through practice (answer the quizzed ones) and take the final test. Your answers stay on this page.',
 init:()=>({seed:1,ph:'ready',i:0,fb:null,res:[]}),
 watch(p){const tested=D4_swTested({seed:1});if(p<.3)return {seed:1,ph:'study',i:0,fb:null,res:[],sim:true};if(p<.6)return {seed:1,ph:'practice',i:Math.min(7,Math.floor((p-.3)/.3*8)),fb:null,res:[],sim:true};
  const res=D4_swOrder({seed:1},'final').map((idx,j)=>({idx,ok:tested.has(idx)||j%3!==0}));return {seed:1,ph:p<.85?'final':'done',i:p<.85?Math.floor((p-.6)/.25*8):8,fb:null,res:p<.85?res.slice(0,Math.floor((p-.6)/.25*8)):res,sim:true}},
 ui:[{b:'Start',act:'start'},{b:'Next',act:'next'},{b:'Start again',act:'again'}],
 on:{start(s){if(s.ph!=='ready')return 'keep';s.ph='study'},
  next(s){if(s.ph==='study'){s.ph='practice';s.i=0;s.fb=null;return}
   if(s.ph==='practice'){const idx=D4_swOrder(s,'practice')[s.i];if(D4_swTested(s).has(idx)&&!s.fb)return 'keep';s.i++;s.fb=null;if(s.i>=8){s.ph='final';s.i=0}return}
   return 'keep'},
  opt(s,j){j=Number(j);if(s.ph==='practice'){const idx=D4_swOrder(s,'practice')[s.i];if(!D4_swTested(s).has(idx)||s.fb)return 'keep';s.fb={pick:j,ok:j===idx};return}
   if(s.ph==='final'){const idx=D4_swOrder(s,'final')[s.i];s.res.push({idx,ok:j===idx});s.i++;if(s.i>=8)s.ph='done';return}return 'keep'},
  again(s){s.seed=nextSeed();s.ph='ready';s.i=0;s.fb=null;s.res=[]}},
 draw(s,f,X){
  let out=heading('Learn eight Swahili words',26);const tested=D4_swTested(s);
  const opts=(idx,ph,mark)=>{let o='';D4_swOpts(s,idx,ph).forEach((j,k)=>{const x=110+(k%2)*200,y=150+Math.floor(k/2)*52,m=mark&&mark(j);o+=hit(X,'opt',j,'Answer '+D4_SW[j][1],R(x,y,180,42,m||'#f6f9fb',m?'none':C.grid,8)+TF(x+90,y+27,D4_SW[j][1],16,C.ink))});return o};
  if(s.ph==='ready')out+=R(20,44,560,230,'#fff',C.grid,8)+T(300,130,'Press Start to see eight word pairs.',17,C.ink)+TF(300,160,'About a minute in all.',14,C.muted);
  else if(s.ph==='study'){out+=TF(300,52,'Study all eight pairs, then press Next',13,C.muted);D4_SW.forEach(([sw,en],i)=>{const x=40+(i%2)*270,y=62+Math.floor(i/2)*50;out+=R(x,y,250,40,'#fff',C.grid,8)+TBF(x+20,y+26,sw,16,C.purple,'start')+TF(x+130,y+26,'=',16,C.muted)+TF(x+150,y+26,en,16,C.ink,'start')})}
  else if(s.ph==='practice'){const idx=D4_swOrder(s,'practice')[Math.min(7,s.i)],t=tested.has(idx);out+=TF(300,52,`practice ${s.i+1} of 8 · ${t?'quiz':'restudy'}`,13,C.muted);
   if(!t)out+=R(150,80,300,60,C.purplep,'none',10)+TBF(240,118,D4_SW[idx][0],22,C.purple)+TF(320,118,'=',20,C.muted)+TBF(390,118,D4_SW[idx][1],22,C.ink)+TF(300,190,'Read it again, then press Next.',14,C.muted);
   else{out+=TB(300,120,`${D4_SW[idx][0]} = ?`,26,C.purple);out+=opts(idx,'practice',s.fb?j=>j===idx?C.greenp:j===s.fb.pick?C.coralp:null:null);if(s.fb)out+=TF(300,268,s.fb.ok?'Right. Press Next.':`It means “${D4_SW[idx][1]}”. Press Next.`,14,s.fb.ok?C.green:C.coral)}}
  else if(s.ph==='final'){const idx=D4_swOrder(s,'final')[Math.min(7,s.i)];out+=TF(300,52,`final test ${s.i+1} of 8 · no feedback`,13,C.muted)+TB(300,120,`${D4_SW[idx][0]} = ?`,26,C.purple)+opts(idx,'final')}
  else{const sc=k=>{const r=s.res.filter(r=>tested.has(r.idx)===k);return r.length?D4_mean(r.map(r=>r.ok?1:0)):NaN},a=sc(false),b=sc(true);
   out+=TF(170,56,s.sim?'Simulated participant (final test)':'You: final test, a minute later',13,C.muted)+TF(450,56,'Published: one week later (approx.)',13,C.muted);
   out+=L(60,260,280,260,C.line,1.5)+L(340,260,560,260,C.line,1.5);
   out+=D4_vbar(84,260,70,(a||0)*170,C.purple,D4_pct(a),'restudied')+D4_vbar(184,260,70,(b||0)*170,C.green,D4_pct(b),'quizzed');
   out+=D4_vbar(364,260,70,.35*170,C.purple,'≈35%','restudied')+D4_vbar(464,260,70,.8*170,C.green,'≈80%','tested')}
  out+=T(300,322,s.ph==='done'?'After a minute both may look alike; the gap opens over days.':'Quizzing yourself feels harder than rereading. That effort is the point.',14,C.ink);
  out+=TF(300,348,'Karpicke & Roediger (2008) used forty Swahili–English pairs.',13,C.muted);
  return {svg:out,phase:s.ph==='done'?'Retrieval strengthens the route back to a memory. Rereading strengthens the feeling that you know it, which is not the same thing.':s.ph==='practice'?'Some words you only see again; others you must pull from memory first.':'Study the pairs.'};
 }});

const D4_DUN=[
 ['Practice testing','high',['Quizzing yourself: flashcards,','past papers, recalling a topic','from memory. Works across ages,','materials and delays.']],
 ['Distributed practice','high',['Spreading study over days or','weeks instead of one long','session. Reliable and cheap.']],
 ['Interleaved practice','moderate',['Mixing kinds of problem in one','session. Strong for maths and','categories; less tested elsewhere.']],
 ['Elaborative interrogation','moderate',['Asking “why is this true?”','while reading. Helps for facts,','less clear for complex texts.']],
 ['Self-explanation','moderate',['Explaining to yourself how new','information fits, step by step.','Useful but time-consuming.']],
 ['Summarisation','low',['Writing summaries. Helps only','those already trained to write','good summaries.']],
 ['Highlighting','low',['Marking key passages. Feels','active, but adds little and can','distract from links between ideas.']],
 ['Keyword mnemonic','low',['Linking a word to a vivid','keyword image. Quick gains that','fade; narrow use.']],
 ['Imagery for text','low',['Picturing what you read.','Mixed results; works only for','easily imagined texts.']],
 ['Rereading','low',['Reading the material again. The','most popular technique, but it','builds fluency, not memory.']]];
const D4_RCOL={high:C.green,moderate:C.amber,low:C.coral};
SCENE({id:'testing-effect-strategies',name:'What works for studying',tag:'Desirable difficulties',
 definition:'A large review rated ten common study techniques. Practice testing and spaced practice came out best; rereading and highlighting, the most popular, came out worst. Techniques that feel hard during study often work best: Bjork called these desirable difficulties.',
 example:'Students asked how they study mostly say they reread. Turning the same time into self-quizzing, spread over several days, is far more effective.',
 desc:'Ten study techniques with their utility rating (high, moderate or low) from Dunlosky et al.; pressing one shows what it is and why it was rated so.',
 research:'Dunlosky, Rawson, Marsh, Nathan & Willingham (2013). Improving students’ learning with effective learning techniques. Psychological Science in the Public Interest 14, 4–58. Karpicke, Butler & Roediger (2009) found rereading was by far students’ most common strategy. Bjork (1994) on desirable difficulties.',
 dur:12,hint:'Press each technique to read why it got its rating.',
 init:()=>({sel:0}),
 watch(p){return {sel:Math.min(9,Math.floor(p*10))}},
 ui:[{b:'Best two',act:'sel',arg:0},{b:'Most popular',act:'sel',arg:9}],
 on:{sel(s,v){s.sel=Number(v)}},
 draw(s,f,X){
  let out=heading('Ten study techniques, rated by the evidence',26);
  D4_DUN.forEach(([n,r],i)=>{const y=44+i*27,on=i===s.sel;out+=hit(X,'sel',i,n+': '+r+' utility',R(16,y,292,24,on?C.pale:'#fff',on?C.blue:C.grid,5)+TF(26,y+17,n,14,C.ink,'start')+R(222,y+4,78,16,D4_RCOL[r],'none',8)+TF(261,y+16,r,13,'#fff'))});
  const [n,r,lines]=D4_DUN[s.sel];
  out+=R(322,44,262,266,'#fff',C.grid,8)+TBF(334,72,n,16,C.ink,'start')+TF(334,96,`utility: ${r}`,14,D4_RCOL[r],'start');
  lines.forEach((t,i)=>out+=TF(334,128+i*22,t,14,C.ink,'start'));
  if(s.sel===9||s.sel===6)out+=TF(334,236,'Among students’ favourites.',13,C.coral,'start');
  if(s.sel<2)out+=TF(334,236,'Both feel harder, and both last.',13,C.green,'start');
  out+=T(300,334,'Feeling fluent while studying is a poor guide to what you will remember.',14,C.ink);
  out+=TF(300,358,'Ratings from Dunlosky et al. (2013): high, moderate or low utility.',13,C.muted);
  return {svg:out,phase:r==='high'?`${n} is rated high: it helps across ages, materials and test delays.`:r==='moderate'?`${n} is promising but has been tested less widely.`:`${n} is rated low: it helps little or only in narrow conditions.`};
 }});
