/* =====================================================================
 Consciousness In Motion · Era 1 · The question.
 Mind and body (Descartes and Elisabeth of Bohemia), what it is like (Nagel, Block), the easy and hard
 problems (Chalmers, Levine, and the replies of Dennett and Patricia Churchland), the knowledge argument
 (Jackson, who later rejected it), zombies and functionalism (Kirk, Chalmers, Putnam, Block), and how far
 reports of experience can be trusted (Nisbett and Wilson, Schwitzgebel).
 No position is presented as the answer: each scene gives a view in a form its defenders would accept, with
 its best objection. Safety: the two brief displays (twelve letters, a noise patch) are single presentations
 started by the learner, at most about one per second; nothing flickers; no sound is used in this era.
 ===================================================================== */

// Word wrap to at most n characters a line.
const K1_wrap=(s,n)=>{const out=[];let ln='';for(const w of String(s).split(' ')){const t=ln?ln+' '+w:w;if(t.length>n&&ln){out.push(ln);ln=w}else ln=t}if(ln)out.push(ln);return out};
// Wrapped text. Lines are cut for the largest phone text scale (1.28), so they fit at every width.
// o.fixed uses fixed-size text for dense panels.
function K1_para(x,y,s,o={}){
 const size=o.size||13,w=o.w||520,k=o.fixed?1:1.28,n=Math.max(8,Math.floor(w/(size*k*(o.bold?.6:.55)))),lh=o.lh||Math.round(size*k+5);
 const f=o.fixed?(o.bold?TBF:TF):(o.bold?TB:T);
 return K1_wrap(s,n).map((ln,i)=>f(x,y+i*lh,ln,size,o.fill||C.ink,o.anchor||'middle')).join('');
}
// A response button drawn inside the diagram.
const K1_key=(X,act,arg,label,x,y,w,h,text,on=false,col=C.blue,size=14)=>hit(X,act,arg,label,R(x,y,w,h,on?C.pale:'#fff',on?col:C.line,8)+TB(x+w/2,y+h/2+5,text,size,C.ink));
const K1_poly=(pts,col,w=2.5,extra='')=>P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra);
// Standard normal: random draw, cumulative probability and its inverse.
function K1_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
function K1_Phi(z){const t=1/(1+.3275911*Math.abs(z)/Math.SQRT2),y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-z*z/2);return z>=0?(1+y)/2:(1-y)/2}
function K1_z(p){p=clamp(p,1e-6,1-1e-6);const a=[-39.69683028665376,220.9460984245205,-275.9285104469687,138.357751867269,-30.66479806614716,2.506628277459239],b=[-54.47609879822406,161.5858368580409,-155.6989798598866,66.80131188771972,-13.28068155288572],c=[-.007784894002430293,-.3223964580411365,-2.400758277161838,-2.549732539343734,4.374664141464968,2.938163982698783],d=[.007784695709041462,.3224671290700398,2.445134137142996,3.754408661907416],pl=.02425;
 const tail=q=>(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
 if(p<pl)return tail(Math.sqrt(-2*Math.log(p)));if(p>1-pl)return -tail(Math.sqrt(-2*Math.log(1-p)));
 const q=p-.5,r=q*q;return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1)}
// Sorting scenes share one small state: an order, a position and the answers so far.
const K1_qInit=n=>({order:range(n),i:0,ans:[]});
const K1_qOn={pick(s,v){if(s.i>=s.order.length)return 'keep';s.ans.push(String(v));s.i++;return 'keep'},
 again(s){s.order=shuffled(range(s.order.length),nextSeed());s.i=0;s.ans=[];return 'keep'}};
const K1_qWatch=(p,keys)=>{const n=keys.length,k=Math.min(n,Math.floor(p*(n+1)));return {order:range(n),i:k,ans:keys.slice(0,k),sim:true}};

/* =========================== mind-body =========================== */
const K1_PROPS=[
 ['doubts','m','Doubting is a kind of thinking, and for Descartes thinking is the whole nature of a mind.'],
 ['has a shape','b','Shape is a way of being extended, so it belongs to body.'],
 ['understands','m','Understanding is a kind of thinking, so it belongs to mind.'],
 ['can be cut in two','b','In Meditation VI Descartes says that any body can be divided, while he can find no parts in his mind.'],
 ['wills','m','Willing is one of the things a thinking thing does.'],
 ['takes up space','b','To take up space is to be extended, which is how Descartes defines body.']];
SCENE({id:'mind-body',name:'Descartes’ two substances',tag:'You sort the properties',
 definition:'In the Meditations (1641) René Descartes argued that mind and body are two different kinds of thing. A mind thinks and has no size or shape: it is unextended. A body has size and shape, so it is extended, and it does not think. This view is called substance dualism.',
 example:'Descartes found that he could doubt he had a body, but could not doubt that he was thinking. He also noted that any body can be divided into parts, while he could find no parts in his mind. From differences like these he concluded that the two are really distinct.',
 desc:'Two columns, Mind and Body, and six properties to place one at a time. Each placed property is marked with a tick or a cross according to where Descartes would put it.',
 research:'Descartes, R. (1641). Meditationes de prima philosophia (Meditations on First Philosophy), especially Meditations II and VI. A philosophical argument, not an experiment; it was disputed at once, in the Objections printed with the first edition.',
 dur:10,hint:'Press Mind or Body to place the highlighted property where Descartes would put it. Press a placed property to take it back.',
 init:()=>({at:K1_PROPS.map(()=>null),last:-1}),
 watch(p){const k=Math.min(6,Math.floor(p*7));return {at:K1_PROPS.map((q,i)=>i<k?q[1]:null),last:k-1}},
 on:{place(s,side){const i=s.at.indexOf(null);if(i<0)return 'keep';s.at[i]=side;s.last=i;return 'keep'},
  back(s,i){s.at[Number(i)]=null;s.last=-1;return 'keep'}},
 draw(s,f,X){
  const cur=s.at.indexOf(null);let out=heading('Which side does each property belong to?');
  const col=(x,side,name,sub,c,pale)=>hit(X,'place',side,`Place the highlighted property in ${name}`,R(x,46,270,252,pale,c,10)+TB(x+135,70,name,17,c)+T(x+135,90,sub,13,C.muted));
  out+=col(20,'m','Mind','thinks · has no size',C.purple,C.purplep)+col(310,'b','Body','has size · does not think',C.blue,C.pale);
  const cnt={m:0,b:0};
  s.at.forEach((side,i)=>{if(!side)return;const x=(side==='m'?20:310)+25,y=100+cnt[side]*32;cnt[side]++;const ok=K1_PROPS[i][1]===side;
   out+=hit(X,'back',i,`${K1_PROPS[i][0]}: ${ok?'as Descartes would place it':'not where Descartes would place it'}. Press to take it back.`,R(x,y,220,27,'#fff',ok?C.green:C.coral,7)+T(x+110,y+19,K1_PROPS[i][0]+(ok?' ✓':' ✗'),13,ok?C.green:C.coral))});
  const right=s.at.filter((a,i)=>a===K1_PROPS[i][1]).length;
  if(cur<0)out+=TB(300,332,`All six placed: ${right} of 6 as Descartes would`,15,right===6?C.green:C.ink)+T(300,364,X.try?'Press a property to take it back':'the two lists have nothing in common',13,C.muted);
  else out+=R(170,308,260,36,C.amberp,C.amber,8)+TB(300,332,K1_PROPS[cur][0],16,C.ink)+T(300,366,X.try?'Press Mind or Body to place it':'placing each property in turn',13,C.muted);
  let ph='For Descartes, everything true of a mind is a way of thinking, and everything true of a body is a way of taking up space.';
  if(s.last>=0){const q=K1_PROPS[s.last],ok=s.at[s.last]===q[1];ph=(ok?'Yes. ':'Descartes would put “'+q[0]+'” on the other side. ')+q[2]}
  if(cur<0&&right===6)ph='The two lists share nothing. That is the strength of the argument, and also its difficulty: if mind and body have nothing in common, how can one affect the other?';
  return {svg:out,phase:ph};
 }});

const K1_ELIS=[
 ['Descartes, May 1643','Think of weight as people commonly picture it: a quality that moves a stone downwards without pushing against it. The soul moves the body in that way.',
  'Elisabeth, June 1643','You yourself hold that this picture of weight is false. How can a false idea show that something immaterial moves a body?'],
 ['Descartes, June 1643','The union of soul and body is a basic notion of its own. It is known through the senses and ordinary life, not through reasoning.',
  'Elisabeth, July 1643','The senses show me that the soul moves the body. They do not show me how it does so.'],
 ['Descartes, 1649','The soul acts on the body at one small gland in the middle of the brain, the pineal gland, which steers the body’s movements.',
  'A standard objection','This says where the two meet. It does not say how a thing with no size can push a thing that has size.']];
SCENE({id:'mind-body-elisabeth',name:'Elisabeth’s question',tag:'How can a mind move a body?',
 definition:'In 1643 Princess Elisabeth of Bohemia wrote to Descartes with an objection now called the interaction problem. A body is set moving by being pushed, and pushing needs contact and extension. If the mind is unextended, how can a decision move an arm?',
 example:'Descartes offered a comparison with weight, and then said the union of mind and body is known by living it and not by reasoning. Elisabeth accepted neither. She wrote that she could more easily grant matter and extension to the soul than grant an immaterial thing the power to move a body.',
 desc:'An unextended mind and an extended body with an arrow and a question mark between them. Below, one of Descartes’ three answers and the reply to it, given in paraphrase.',
 research:['Elisabeth of Bohemia and Descartes, letters of May to July 1643; in Shapiro, L. (ed. and trans.) (2007). The Correspondence between Princess Elisabeth of Bohemia and René Descartes. University of Chicago Press. The cards paraphrase the letters.','Descartes, R. (1649). Les passions de l’âme (The Passions of the Soul), written after this correspondence, places the interaction at the pineal gland.'],
 dur:12,hint:'Choose one of Descartes’ three answers and read the reply to it. The wording is paraphrased from the letters.',
 init:()=>({r:0}),
 watch(p){return {r:Math.min(2,Math.floor(p*3))}},
 ui:[{choose:[[0,'Weight'],[1,'Union'],[2,'A gland']],label:'Descartes’ answer',get:s=>s.r,act:'r'}],
 on:{r(s,v){s.r=Number(v);return 'keep'}},
 draw(s){
  const e=K1_ELIS[s.r];let out=heading('“How can the soul move the body?”');
  out+=Ci(120,104,38,C.purplep,C.purple,'stroke-dasharray="6 5"')+TB(120,110,'mind',16,C.purple)+T(120,166,'no size, no place',13,C.muted);
  out+=R(425,78,120,52,C.pale,C.blue,10)+TB(485,110,'body',16,C.blue)+T(485,166,'has size and place',13,C.muted);
  out+=arrow(166,104,417,104,C.coral,2.5,10,'stroke-dasharray="7 6"')+TB(292,94,'?',26,C.coral)+T(292,62,'“I decide to raise my arm”',13,C.muted);
  out+=R(20,182,560,94,'#fff',C.blue,8)+TB(36,201,e[0],13,C.blue,'start')+K1_para(36,221,e[1],{w:528,anchor:'start'});
  out+=R(20,282,560,94,'#fff',C.coral,8)+TB(36,301,e[2],13,C.coral,'start')+K1_para(36,321,e[3],{w:528,anchor:'start'});
  return {svg:out,phase:['Descartes had himself argued that weight is not a real quality that pulls things down, so Elisabeth saw that the comparison could not carry the load.','Descartes’ second answer treats the union as something lived, not explained. Elisabeth replied that experience shows that the mind moves the body but is silent on the way it does so.','The pineal gland was Descartes’ proposal for the meeting place. No later dualist has given an account of the interaction that persuaded the critics, and the problem still carries Elisabeth’s objection.'][s.r]};
 }});

const K1_POS=[['d','Dualism','Mind and matter are','two kinds of thing.','Descartes, 1641','How do they interact?',C.purple,C.purplep],
 ['p','Physicalism','Everything, the mind','included, is physical.','e.g. Smart, 1959','Why any experience?',C.blue,C.pale],
 ['i','Idealism','Reality consists of','minds and experiences.','Berkeley, 1710','Why one shared world?',C.green,C.greenp]];
const K1_CLAIMS=[
 ['My mind and my body are distinct things, and each could exist without the other.','d','Two things that could exist apart: that is substance dualism.'],
 ['A complete physical description of the world would leave nothing out, feelings included.','p','Nothing beyond the physical: that is physicalism.'],
 ['A tree exists only in being perceived by some mind.','i','Berkeley’s “to be is to be perceived” is the classic statement of idealism.'],
 ['Pain is nothing over and above a certain kind of activity in the nervous system.','p','Identifying a mental state with a physical one is a physicalist claim.'],
 ['Thought has no size or place, so it cannot be a property of anything made of matter.','d','This is Descartes’ contrast between unextended mind and extended body.'],
 ['What we call matter is a pattern within experience, not something lying behind it.','i','Making matter depend on mind is idealism.']];
SCENE({id:'mind-body-positions',name:'Three positions',tag:'You sort the claims',
 definition:'Three broad answers to the mind–body question. Dualism: mind and matter are two kinds of thing. Physicalism: everything that exists is physical, the mind included. Idealism: what exists is minds and their experiences, and matter depends on them.',
 example:'Each has a standard objection. Dualism must explain how mind and body interact (Elisabeth’s question). Physicalism must explain why brain activity is accompanied by experience. Idealism must explain why separate minds find one stable, shared world; Berkeley’s own answer was that God perceives it.',
 desc:'A claim on a card above three columns, Dualism, Physicalism and Idealism, each with a one-line statement, a name and its best objection. The learner presses the column whose position makes the claim.',
 research:['Descartes (1641), Meditations; Berkeley, G. (1710). A Treatise Concerning the Principles of Human Knowledge; Smart, J. J. C. (1959). Sensations and brain processes. Philosophical Review 68, 141–156.','These are families of views, not single theories; later lessons meet versions that do not fit neatly into one column. None is settled.'],
 dur:12,hint:'Read the claim and press the position that makes it. Press Sort again for a new order.',
 init:()=>K1_qInit(6),
 watch(p){return K1_qWatch(p,K1_CLAIMS.map(c=>c[1]))},
 ui:[{b:'Sort again',act:'again'}],
 on:K1_qOn,
 draw(s,f,X){
  const done=s.i>=6,score=s.ans.filter((a,j)=>a===K1_CLAIMS[s.order[j]][1]).length;let out=heading('Which position makes this claim?');
  out+=R(20,44,560,62,C.amberp,C.amber,8)+(done?TB(300,82,`All six sorted: ${score} of 6 match`,16,C.ink):K1_para(300,70,K1_CLAIMS[s.order[s.i]][0],{size:14,w:530}));
  K1_POS.forEach((q,c)=>{const x=20+c*190;
   let inner=R(x,116,180,206,q[7],q[6],10)+TB(x+90,140,q[1],16,q[6])+TF(x+90,162,q[2],13,C.ink)+TF(x+90,180,q[3],13,C.ink)+TF(x+90,202,q[4],13,C.muted)+L(x+16,214,x+164,214,q[6],1)+TBF(x+90,234,'Best objection',13,C.coral)+TF(x+90,252,q[5],13,C.ink);
   let k=0;s.ans.forEach((a,j)=>{if(a!==q[0])return;const ok=K1_CLAIMS[s.order[j]][1]===a;inner+=Ci(x+26+k*26,292,10,ok?C.green:C.coral)+TBF(x+26+k*26,297,ok?'✓':'✗',13,'#fff');k++});
   out+=hit(X,'pick',q[0],`${q[1]}: ${q[2]} ${q[3]}`,inner)});
  out+=T(300,350,done?(X.try?'Press Sort again for a new order':'each position has its own standard objection'):`claim ${s.i+1} of 6`+(X.try?' · press a column':''),13,C.muted);
  let ph='Three families of answer. Each is stated here in a form its defenders would accept, with the objection they most often have to meet.';
  if(s.i>0){const j=s.i-1,q=K1_CLAIMS[s.order[j]],ok=s.ans[j]===q[1],nm=K1_POS.find(v=>v[0]===q[1])[1];ph=(ok?'Yes: ':`That claim belongs to ${nm.toLowerCase()}. `)+q[2]}
  if(done)ph+=' None of the three has been refuted, and none is accepted by everyone.';
  return {svg:out,phase:ph};
 }});

/* =========================== what-it-is-like =========================== */
const K1_BAT=[
 ['Call physics','The pitch and timing of each call and of its echo, mostly above the range of human hearing.','What the returning echo is like for the bat, if it is like anything.'],
 ['Bat brain','Which nerve cells respond to the delay of an echo, and so signal how far away an insect is.','Why that activity is experienced at all, and what the experience is like.'],
 ['Behaviour','What a bat can tell apart: it catches flying insects in the dark.','Behaviour shows what the bat can do, not what doing it is like.'],
 ['Imagining','You picture yourself hanging upside down and finding your way by echoes.','That is what it would be like for you to act as a bat, not what it is like for the bat.']];
function K1_batPic(X){
 let out='';const bx=110,by=104,ph=X.try?.5:(X.p*3)%1;
 out+=P(`M${bx-8} ${by-4} Q${bx-52} ${by-46} ${bx-84} ${by-12} Q${bx-66} ${by-8} ${bx-58} ${by+10} Q${bx-40} ${by-2} ${bx-30} ${by+14} Q${bx-18} ${by+2} ${bx-8} ${by+8} Z`,C.dark,2,'#5d717c');
 out+=`<ellipse cx="${bx}" cy="${by}" rx="15" ry="20" fill="${C.dark}"/>`+Ci(bx+10,by-22,10,C.dark)+P(`M${bx+4} ${by-30} L${bx+2} ${by-44} L${bx+11} ${by-33} Z`,C.dark,1,C.dark)+P(`M${bx+13} ${by-31} L${bx+18} ${by-44} L${bx+20} ${by-29} Z`,C.dark,1,C.dark);
 // Outgoing calls (blue) and returning echoes (coral): slow, thin arcs.
 for(let i=0;i<4;i++){const r=40+(i+ph)*70,a=.42;if(r>330)continue;out+=P(`M${fmt(bx+20+r*Math.cos(-a))} ${fmt(by-22+r*Math.sin(-a))} A${fmt(r)} ${fmt(r)} 0 0 1 ${fmt(bx+20+r*Math.cos(a))} ${fmt(by-22+r*Math.sin(a))}`,C.blue,2,'none',`opacity="${fmt(1-r/380)}"`)}
 for(let i=0;i<3;i++){const r=24+(i+ph)*60,a=.5;out+=P(`M${fmt(490-r*Math.cos(-a))} ${fmt(82-r*Math.sin(-a))} A${fmt(r)} ${fmt(r)} 0 0 0 ${fmt(490-r*Math.cos(a))} ${fmt(82-r*Math.sin(a))}`,C.coral,1.6,'none',`opacity="${fmt(.8-r/300)}"`)}
 out+=P('M490 82 L474 68 L478 86 Z',C.amber,1.5,C.amberp)+P('M490 82 L506 68 L502 86 Z',C.amber,1.5,C.amberp)+L(490,74,490,92,C.amber,3);
 out+=TF(110,156,'bat',13,C.muted)+TF(490,112,'moth',13,C.muted)+TF(300,150,'call out (blue) · echo back (coral)',13,C.muted);
 return out;
}
SCENE({id:'what-it-is-like',name:'Nagel’s bat',tag:'Something it is like',
 definition:'Thomas Nagel (1974) gave the field its working definition: an organism has conscious experience if there is something it is like to be that organism, something it is like for the organism. He chose bats because they find their way by echolocation, a sense we lack.',
 example:'We can learn the physics of a bat’s calls, map its brain and watch what it does. Nagel argued that these objective facts, open to any observer, do not tell us what the bat’s experience is like from its own point of view. He did not conclude that physicalism is false; he said we do not yet understand how it could be true.',
 desc:'A bat sends calls towards a moth and echoes return. Four sources of knowledge about the bat can be chosen; each shows what it tells us and what Nagel says it leaves out.',
 research:['Nagel, T. (1974). What is it like to be a bat? Philosophical Review 83, 435–450.','A reply: Dennett, D. C. (1991). Consciousness Explained, and Akins, K. (1993). What is it like to be boring and myopic? In B. Dahlbom (ed.), Dennett and His Critics. They argue that enough detail about a bat’s senses and needs would tell us much of what there is to know. The dispute is open.'],
 dur:12,hint:'Press each of the four sources of knowledge about the bat. Read what it tells us, and what Nagel says it leaves out.',
 init:()=>({k:-1,seen:[0,0,0,0]}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {k,seen:range(4).map(i=>i<=k?1:0)}},
 on:{src(s,v){s.k=Number(v);s.seen[s.k]=1;return 'keep'}},
 draw(s,f,X){
  let out=heading('What can we know about being a bat?')+K1_batPic(X);
  K1_BAT.forEach((b,i)=>out+=K1_key(X,'src',i,b[0]+': what it tells us and what it leaves out',22+i*140,170,132,38,b[0],s.k===i,C.blue,13));
  out+=R(20,218,560,156,'#fff',C.grid,8);
  if(s.k<0)out+=T(300,300,X.try?'Press a source of knowledge above':'four ways of studying the bat',13,C.muted);
  else{const b=K1_BAT[s.k];out+=TB(36,240,'It tells us',13,C.green,'start')+K1_para(36,262,b[1],{w:528,anchor:'start'})+TB(36,312,'Nagel: it leaves out',13,C.coral,'start')+K1_para(36,334,b[2],{w:528,anchor:'start'})}
  const all=s.seen.every(Boolean);
  return {svg:out,phase:all?'For Nagel, each method gives facts available from any point of view, and experience is tied to one point of view. Dennett and Akins answer that the missing part shrinks as the science grows, and may shrink to nothing. Both sides accept the definition; they disagree about what it shows.':s.k<0?'Nagel’s phrase “something it is like” is the definition of consciousness used throughout this course.':'Objective facts can be checked by any observer. Nagel’s question is whether a complete set of them would include what the experience is like for the bat.'};
 }});

const K1_STATES=[
 ['You are wide awake, reading this sentence.',[1,0],'Awake and experiencing: the ordinary case, where the two senses of “conscious” go together.'],
 ['A vivid dream of flying, during REM sleep.',[0,0],'A dream is experience without wakefulness, so the two senses can come apart.'],
 ['Deep sleep, with nothing to report on being woken.',[0,1],'Neither awake nor, as far as the report goes, experiencing. People woken from deep sleep do sometimes report experience, so this placing is a simplification.'],
 ['A patient under general anaesthesia during an operation.',[0,1],'This is the intended state. The rare exceptions, and how they are detected, come in era 4.'],
 ['After a brain injury: eyes open and sleep–wake cycles, but no sign of awareness.',[1,1],'This is how unresponsive wakefulness syndrome is defined at the bedside. Brain imaging has since shown that some such patients are aware, so the placing rests on behaviour only (era 4).']];
const K1_CELLS=[['dreaming','ordinary waking'],['deep sleep · anaesthesia','awake, unaware']];
SCENE({id:'what-it-is-like-senses',name:'Senses of “conscious”',tag:'Awake, aware, experiencing',
 definition:'“Conscious” is used in several ways. A creature can be conscious in the sense of awake, not asleep or in a coma. It can be conscious of something, such as a noise. And a state can be conscious in Nagel’s sense: there is something it is like to be in it. The senses often go together, but not always.',
 example:'A dreamer is not awake yet is experiencing. A person in what was called the vegetative state has sleep–wake cycles and open eyes but shows no sign of awareness. Clinicians therefore separate two components: wakefulness and awareness.',
 desc:'A two-by-two grid: awake or not awake across, experience or no experience down. Five cases are placed in the grid one at a time.',
 research:['Laureys, S. (2005). The neural correlate of (un)awareness: lessons from the vegetative state. Trends in Cognitive Sciences 9, 556–559: wakefulness and awareness as two components.','The grid is a teaching simplification. Whether experience is absent in deep sleep or in an unresponsive patient is inferred from reports and behaviour, and both can mislead.'],
 dur:12,hint:'Press the square of the grid where the case belongs. Press Sort again for a new order.',
 init:()=>K1_qInit(5),
 watch(p){return K1_qWatch(p,K1_STATES.map(c=>c[1].join('-')))},
 ui:[{b:'Sort again',act:'again'}],
 on:K1_qOn,
 draw(s,f,X){
  const done=s.i>=5;let out=heading('Awake is one thing, experiencing another');
  out+=T(270,62,'not awake',13,C.muted)+T(470,62,'awake',13,C.muted)+T(160,120,'experience',13,C.muted,'end')+T(160,210,'no experience',13,C.muted,'end');
  for(let c=0;c<2;c++)for(let r=0;r<2;r++){const x=170+c*200,y=70+r*90,key=c+'-'+r;
   const placed=s.ans.map((a,j)=>({j,cs:K1_STATES[s.order[j]],a})).filter(v=>v.cs[1].join('-')===key);
   let inner=R(x,y,200,90,r===0?C.amberp:'#eef2f5',C.line,0);
   if(placed.length)inner+=TF(x+100,y+22,K1_CELLS[r][c],13,C.muted);
   placed.forEach((v,k)=>{const ok=v.a===key;inner+=Ci(x+40+k*44,y+56,14,ok?C.green:C.coral)+TBF(x+40+k*44,y+61,String(s.order[v.j]+1),14,'#fff')});
   out+=hit(X,'pick',key,`${c?'Awake':'Not awake'}, ${r?'no experience':'experience'}`,inner)}
  out+=R(20,262,560,112,'#fff',C.amber,8);
  if(done){const score=s.ans.filter((a,j)=>a===K1_STATES[s.order[j]][1].join('-')).length;out+=TB(300,300,`All five placed: ${score} of 5 match`,16,C.ink)+T(300,330,'green: where you put it · coral: moved to the usual placing',13,C.muted)}
  else out+=TB(300,286,`Case ${s.order[s.i]+1}`,13,C.muted)+K1_para(300,312,K1_STATES[s.order[s.i]][0],{size:14,w:530})+T(300,362,X.try?'press a square of the grid':'placing each case',13,C.muted);
  let ph='Being awake is a state of the whole creature. Experience is what Nagel’s definition picks out. The grid asks about each separately.';
  if(s.i>0){const j=s.i-1,q=K1_STATES[s.order[j]],ok=s.ans[j]===q[1].join('-');ph=(ok?'':'The usual placing is different. ')+q[2]}
  return {svg:out,phase:ph};
 }});

const K1_CONS='BCDFGHJKLMNPRSTVXZ'.split('');
SCENE({id:'what-it-is-like-access',name:'Phenomenal and access',tag:'You take part: twelve letters',
 definition:'Ned Block (1995) separated two concepts. Phenomenal consciousness is experience: what it is like. Access consciousness is information being available for reasoning, report and the control of action. Block holds that the two can come apart; whether they can is disputed.',
 example:'George Sperling (1960) showed twelve letters for a twentieth of a second. People could name about 4. But when a tone just after the display told them which row to report, they got about 3 of its 4 letters, whichever row was cued, as if about 9 of the 12 had been available for a moment.',
 desc:'A grid of twelve letters is shown briefly, then an arrow marks one row and the learner picks that row’s four letters from a keypad. Bars compare the learner’s estimate of letters available with Sperling’s whole-report and cued-row results.',
 research:['Sperling, G. (1960). The information available in brief visual presentations. Psychological Monographs 74(11), 1–29. Robust and many times replicated.','Block, N. (1995). On a confusion about a function of consciousness. Behavioral and Brain Sciences 18, 227–247; Block (2011), Trends in Cognitive Sciences 15, 567–575, reads Sperling as experience “overflowing” access. Cohen, M. A. & Dennett, D. C. (2011), Trends in Cognitive Sciences 15, 358–364, reply that experience without access could never be tested. The interpretation is contested.'],
 dur:12,hint:'Press Show letters. Twelve letters appear once for 0.3 s (Sperling used 0.05 s), then an arrow marks a row: pick that row’s four letters. Four rounds. Picking from a keypad makes guessing easier than Sperling’s written report, so the comparison is rough. Nothing leaves the page.',
 init:()=>({phase:'idle',letters:[],row:0,picks:[],res:[],tok:0}),
 watch(p){const letters=shuffled(K1_CONS,5).slice(0,12),rowL=letters.slice(4,8),n=Math.min(4,Math.floor((p-.4)*12));
  return {phase:p<.2?'show':p<.75?'pick':'scored',letters,row:1,picks:p<.4?[]:[rowL[0],rowL[2],rowL[3],letters[9]].slice(0,Math.max(0,n)),res:p<.75?[]:[3],tok:0,sim:true}},
 ui:[{b:'Show letters',act:'go'}],
 on:{go(s,a,ctx){if(s.phase==='show')return 'keep';if(s.res.length>=4)s.res=[];const seed=nextSeed();s.letters=shuffled(K1_CONS,seed).slice(0,12);s.row=seed%3;s.picks=[];s.phase='show';s.tok++;ctx.later(300,'hide',s.tok);return 'keep'},
  hide(s,t){if(Number(t)===s.tok&&s.phase==='show')s.phase='pick';return 'keep'},
  pick(s,l){if(s.phase!=='pick')return 'keep';const i=s.picks.indexOf(l);if(i>=0)s.picks.splice(i,1);else if(s.picks.length<4)s.picks.push(l);
   if(s.picks.length===4){const rowL=s.letters.slice(s.row*4,s.row*4+4);s.res.push(s.picks.filter(x=>rowL.includes(x)).length);s.phase=s.res.length>=4?'done':'scored'}return 'keep'}},
 draw(s,f,X){
  let out=heading('How many of the twelve letters were available?');
  const has=s.letters.length===12,reveal=has&&(s.phase==='show'||s.phase==='scored'||s.phase==='done'),cued=has&&s.phase!=='show'&&s.phase!=='idle';
  for(let r=0;r<3;r++)for(let c=0;c<4;c++){const x=52+c*56,y=54+r*48,inRow=cued&&r===s.row;
   out+=R(x,y,50,42,inRow?C.amberp:'#fff',inRow?C.amber:C.line,6)+(reveal?TBF(x+25,y+29,s.letters[r*4+c],22,C.ink):'')}
  if(cued)out+=arrow(14,75+s.row*48,46,75+s.row*48,C.coral,3);
  const rowL=has?s.letters.slice(s.row*4,s.row*4+4):[],keys=has?s.letters.slice().sort():K1_CONS.slice(0,12);
  keys.forEach((l,i)=>{const x=310+(i%4)*66,y=54+Math.floor(i/4)*48,on=s.picks.includes(l),sc=s.phase==='scored'||s.phase==='done';
   out+=hit(X,'pick',l,`Letter ${l}${on?', picked':''}`,R(x,y,60,42,on?(sc?(rowL.includes(l)?C.greenp:C.coralp):C.pale):'#fff',on?(sc?(rowL.includes(l)?C.green:C.coral):C.blue):C.line,6)+TBF(x+30,y+28,has&&s.phase!=='show'?l:'·',19,s.phase==='pick'||on?C.ink:C.muted))});
  out+=TF(162,214,s.phase==='idle'?(X.try?'press Show letters':'twelve letters, shown once'):s.phase==='show'?'the letters':s.phase==='pick'?'which letters were in this row?':`round ${s.res.length}: ${s.res[s.res.length-1]} of 4 right`,13,C.muted);
  out+=TF(439,214,s.phase==='pick'?`pick 4 · ${s.picks.length} chosen`:'keypad: the 12 letters shown',13,C.muted);
  const mean=s.res.length?sum(s.res)/s.res.length:null,est=mean===null?null:mean*3,x0=250,sc=25;
  out+=TBF(300,240,'Letters available, out of 12',13,C.ink);
  [['Sperling: name all you can',4.3,C.muted],['Sperling: cued row × 3',9.1,C.blue],[s.sim?'Simulated viewer: row × 3':'You: cued row × 3',est,C.coral]].forEach((b,i)=>{const y=252+i*30;
   out+=TF(x0-8,y+15,b[0],13,C.ink,'end')+R(x0,y,300,20,'#f3f6f8','none',4)+(b[1]===null?TF(x0+8,y+15,'after your first round',13,C.muted,'start'):R(x0,y,b[1]*sc,20,b[2],'none',4)+TBF(x0+b[1]*sc+(b[1]>10?-8:8),y+15,fmt(Math.round(b[1]*10)/10),13,b[1]>10?'#fff':C.ink,b[1]>10?'end':'start'))});
  [0,4,8,12].forEach(v=>out+=L(x0+v*sc,342,x0+v*sc,347,C.line,1.5)+TF(x0+v*sc,362,String(v),13,C.muted));
  const who=s.sim?'The simulated viewer':'You';
  return {svg:out,phase:s.phase==='idle'?'Sperling’s question: is more seen in a glance than can be reported afterwards?':s.phase==='show'?'Twelve letters, once, with no time to read them all.':s.phase==='pick'?'The arrow came after the letters had gone, so the row had to be read from a fading memory of the whole display.':`${who} got ${fmt(Math.round(mean*10)/10)} of 4 on average from a row cued after the display, which implies about ${fmt(Math.round(est*10)/10)} of 12 were briefly available. Block reads this as more experienced than accessed. Cohen and Dennett reply that the unreported letters may not have been experienced until the cue picked them out. The result is solid; its reading is disputed.`};
 }});

/* =========================== easy-hard-problems =========================== */
const K1_EH=[
 ['How does the brain tell red light from green?','e','telling colours apart','Telling stimuli apart is on Chalmers’ list of easy problems: a mechanism that does the job would explain it.'],
 ['How does attention pick one voice out of a crowd?','e','selecting a voice','The focus of attention is a function, so explaining the mechanism explains it.'],
 ['Why does seeing red feel like anything at all?','h','why red feels like anything','This asks about the experience itself, not about any job that vision does.'],
 ['How do we put what we see into words?','e','reporting in words','Reporting is a function. “Easy” means that the method is clear, not that the work is small.'],
 ['What differs in the brain between waking and deep sleep?','e','waking against sleep','Chalmers lists the difference between wakefulness and sleep among the easy problems.'],
 ['Why is all this processing accompanied by experience, and not done “in the dark”?','h','why any experience','This is Chalmers’ own statement of the hard problem.']];
SCENE({id:'easy-hard-problems',name:'Easy and hard problems',tag:'You sort the questions',
 definition:'David Chalmers (1995) divided the questions about consciousness in two. The easy problems ask how the brain performs functions: telling stimuli apart, attending, reporting, controlling behaviour. The hard problem asks why performing those functions is accompanied by experience at all.',
 example:'“Easy” does not mean simple; these problems may take a century. It means we know what kind of answer would do: a mechanism that performs the function. For the hard problem, Chalmers argues, explaining every function would still leave the question open.',
 desc:'A research question on a card above two bins, Easy problems and The hard problem. Sorted questions are listed in the bins with a tick or cross against Chalmers’ own sorting.',
 research:['Chalmers, D. J. (1995). Facing up to the problem of consciousness. Journal of Consciousness Studies 2(3), 200–219.','Contested: Dennett and Patricia Churchland deny that the questions can be divided this way in advance (see the third scene of this lesson).'],
 dur:12,hint:'Press the bin where Chalmers would put the question. Press Sort again for a new order.',
 init:()=>K1_qInit(6),
 watch(p){return K1_qWatch(p,K1_EH.map(c=>c[1]))},
 ui:[{b:'Sort again',act:'again'}],
 on:K1_qOn,
 draw(s,f,X){
  const done=s.i>=6,score=s.ans.filter((a,j)=>a===K1_EH[s.order[j]][1]).length;let out=heading('Easy problem or hard problem?');
  out+=R(20,44,560,62,C.amberp,C.amber,8)+(done?TB(300,82,`All six sorted: ${score} of 6 as Chalmers sorts them`,16,C.ink):K1_para(300,70,K1_EH[s.order[s.i]][0],{size:14,w:530}));
  [['e','Easy problems','explain what the system does',C.green,C.greenp,20],['h','The hard problem','explain why it is experienced',C.coral,C.coralp,310]].forEach(b=>{
   let inner=R(b[5],116,270,212,b[4],b[3],10)+TB(b[5]+135,140,b[1],16,b[3])+T(b[5]+135,160,b[2],13,C.muted);let k=0;
   s.ans.forEach((a,j)=>{if(a!==b[0])return;const q=K1_EH[s.order[j]],ok=q[1]===a;inner+=TF(b[5]+135,188+k*22,q[2]+(ok?' ✓':' ✗'),13,ok?C.ink:C.coral);k++});
   out+=hit(X,'pick',b[0],b[1]+': '+b[2],inner)});
  out+=T(300,354,done?'Chalmers’ sorting is itself disputed: see the next two scenes':`question ${s.i+1} of 6`+(X.try?' · press a bin':''),13,C.muted);
  let ph='Chalmers’ test: would a mechanism that performs some function answer the question? If so, it is an easy problem in his sense.';
  if(s.i>0){const j=s.i-1,q=K1_EH[s.order[j]],ok=s.ans[j]===q[1];ph=(ok?'Yes. ':'Chalmers sorts it the other way. ')+q[3]}
  if(done)ph+=' Patricia Churchland’s objection is that nobody can tell, before the science is done, which problems will turn out to be hard.';
  return {svg:out,phase:ph};
 }});

const K1_GAP={
 heat:['Heat','It flows from hot things to cold ones, makes gases expand and melts ice.','The random motion of molecules.','Nothing. Once the motion is understood, everything that heat does follows from it.',1,
  'Levine’s comparison case: once we know that heat is molecular motion, we can see why heat does what it does.'],
 life:['Life','Living things take in energy, grow, repair themselves and reproduce.','The chemistry of cells: proteins, membranes and DNA.','Vitalists expected an extra “vital force”. None was needed: explaining the functions explained life.',1,
  'Dennett and Patricia Churchland expect consciousness to go the way of life. Chalmers replies that life was always a matter of functions, and experience is not.'],
 pain:['Pain','It signals damage, makes us pull away and learn to avoid, and is reported.','Activity in nerve fibres and brain pathways (the philosophers’ stand-in is “C-fibre firing”).','Levine: why this activity feels like this, or like anything, does not follow in the same way.',0,
  'Levine took the gap to be in our understanding. He did not conclude that pain is something non-physical; others, such as Chalmers, do draw that conclusion.']};
SCENE({id:'easy-hard-problems-gap',name:'The explanatory gap',tag:'What a mechanism leaves over',
 definition:'Joseph Levine (1983) named the explanatory gap. “Heat is the motion of molecules” explains why heat behaves as it does. “Pain is the firing of C-fibres” may be true, he argued, but it leaves unexplained why that activity should feel the way pain feels.',
 example:'Levine’s claim is about explanation, not about what exists: the identity could hold even though we cannot see why. Critics point to life, which once seemed to need a vital force beyond chemistry and turned out not to.',
 desc:'Three rows for a chosen case (heat, life or pain): what it does, the mechanism that explains it, and whether anything is left unexplained.',
 research:['Levine, J. (1983). Materialism and qualia: the explanatory gap. Pacific Philosophical Quarterly 64, 354–361.','Whether the gap is permanent, temporary or only apparent is contested. “C-fibre firing” is a philosophers’ placeholder, not a full account of pain.'],
 dur:14,hint:'Choose heat, life or pain and compare the last row: is anything left over once the mechanism is known?',
 init:()=>({c:'pain',k:2}),
 watch(p){const i=Math.min(8,Math.floor(p*9));return {c:['heat','life','pain'][Math.floor(i/3)],k:i%3}},
 ui:[{choose:[['heat','Heat'],['life','Life'],['pain','Pain']],label:'Case',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=v;s.k=2;return 'keep'}},
 draw(s){
  const g=K1_GAP[s.c],col=g[4]?C.green:C.coral;let out=heading(g[0]+': from what it does to how');
  out+=R(30,46,540,80,'#fff',C.line,8)+TB(46,66,'What it does',13,C.muted,'start')+K1_para(46,88,g[1],{w:508,anchor:'start'});
  if(s.k>=1)out+=arrow(300,127,300,137,C.blue,2.5,7)+R(30,138,540,80,C.pale,C.blue,8)+TB(46,158,'The mechanism',13,C.blue,'start')+K1_para(46,180,g[2],{w:508,anchor:'start'});
  if(s.k>=2)out+=arrow(300,219,300,229,col,2.5,7)+R(30,230,540,102,g[4]?C.greenp:C.coralp,col,8)+TB(46,250,'Is anything left unexplained?',13,col,'start')+K1_para(46,272,g[3],{w:508,anchor:'start'})
   +TB(300,360,g[4]?'No gap: the mechanism explains what it does':'The explanatory gap (Levine 1983)',15,col);
  return {svg:out,phase:s.k<2?'First the thing to be explained, then the mechanism, then the question of what is left.':g[5]};
 }});

const K1_MAP=[[['A agree · B agree','Chalmers (1995): experience is a further feature of the world.'],['A disagree · B agree','Rarely held: with nothing left unexplained, there is no gap to argue from.']],
 [['A agree · B disagree','Levine (1983): a gap in our understanding, not shown to be a gap in nature.'],['A disagree · B disagree','Dennett; P. S. Churchland (1996): explain the functions, then see what, if anything, is left.']]];
SCENE({id:'easy-hard-problems-objection',name:'Is the hard problem real?',tag:'Where people disagree',
 definition:'The best objection to the hard problem is that it is an artefact of how the question is posed. Daniel Dennett argues that when every function is explained nothing is left over. Patricia Churchland argues that calling one problem “hard” in advance is an argument from present ignorance.',
 example:'One of Churchland’s comparisons: biologists once expected the copying of genes to be the deep puzzle and the folding of proteins to be routine, and it turned out the other way round. Which problems are hard is found by doing the science. Chalmers replies that experience differs because it is not defined by any function.',
 desc:'Two statements, each with Agree and Disagree buttons, above a two-by-two map showing which thinkers hold each combination of answers.',
 research:['Dennett, D. C. (1996). Facing backwards on the problem of consciousness. Journal of Consciousness Studies 3(1), 4–6.','Churchland, P. S. (1996). The hornswoggle problem. Journal of Consciousness Studies 3(5–6), 402–408.','Chalmers’ response: Chalmers, D. J. (1997). Moving forward on the problem of consciousness. Journal of Consciousness Studies 4(1), 3–46. The dispute is unresolved; the map simplifies each position.'],
 dur:12,hint:'Agree or disagree with each statement. The map shows who holds your combination of answers. There is no agreed right answer.',
 init:()=>({a:null,b:null}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {a:[1,1,0,0][k],b:[1,0,0,1][k]}},
 on:{a(s,v){s.a=Number(v);return 'keep'},b(s,v){s.b=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Two statements, four positions');
  const row=(y,act,val,text)=>R(20,y,560,56,'#fff',C.line,8)+K1_para(32,y+23,text,{w:350,anchor:'start'})+K1_key(X,act,1,'Agree with statement '+act.toUpperCase(),396,y+10,84,36,'Agree',val===1,C.green,13)+K1_key(X,act,0,'Disagree with statement '+act.toUpperCase(),488,y+10,84,36,'Disagree',val===0,C.coral,13);
  out+=row(44,'a',s.a,'A. With every function explained, experience would still be unexplained.')+row(106,'b',s.b,'B. So experience is something beyond the physical.');
  for(let r=0;r<2;r++)for(let c=0;c<2;c++){const x=20+c*282,y=172+r*102,m=K1_MAP[r][c],you=s.a===1-c&&s.b===1-r;
   out+=R(x,y,278,98,you?C.amberp:'#fff',you?C.amber:C.grid,8)+TBF(x+14,y+22,m[0],13,you?C.amber:C.muted,'start')+(you?TBF(x+264,y+22,X.try?'you':'here',13,C.amber,'end'):'')+K1_para(x+14,y+44,m[1],{w:250,anchor:'start',fixed:true})}
  const both=s.a!==null&&s.b!==null;
  return {svg:out,phase:!both?'Statement A is the claim that there is an explanatory gap. Statement B is the further step from a gap in explanation to a gap in nature.':s.a&&s.b?'This is Chalmers’ position. Its critics say the first step already assumes what it sets out to show.':s.a&&!s.b?'This is Levine’s position: the gap is real as a gap in explanation, but nothing follows about what exists.':!s.a&&!s.b?'This is where Dennett and Patricia Churchland stand, for different reasons. Their critics say that explaining what we do and say is not yet explaining what we feel.':'An unusual combination: if explaining the functions leaves nothing out, it is hard to see what the argument for B would be.'};
 }});

/* =========================== knowledge-argument =========================== */
const K1_BOOKS=[['Light','the physics of light and wavelength'],['The eye','the cells of the retina'],['The brain','the colour pathways of the brain'],['Colour words','how people use colour words']];
SCENE({id:'knowledge-argument',name:'Mary’s room',tag:'A thought experiment',
 definition:'Frank Jackson’s knowledge argument (1982). Mary is a brilliant scientist who has lived in a black-and-white room and learned every physical fact about colour vision from books and a black-and-white screen. One day she leaves the room and sees a ripe tomato. Does she learn anything new?',
 example:'Jackson argued in 1982 that she does: she learns what it is like to see red. Since she already knew all the physical facts, there must be facts that are not physical facts, and physicalism is false. He called the felt qualities she discovers qualia.',
 desc:'Mary in a grey room with four books to read, and a door. When the door opens a red tomato is seen outside; the picture has no other colour.',
 research:['Jackson, F. (1982). Epiphenomenal qualia. Philosophical Quarterly 32, 127–136; Jackson, F. (1986). What Mary didn’t know. Journal of Philosophy 83, 291–295.','A thought experiment, not a finding. The replies, and Jackson’s own later change of mind, follow in the next two scenes.'],
 dur:12,hint:'Press the books to let Mary read them, then press Open the door. Try opening it before she has read everything.',
 init:()=>({read:[0,0,0,0],out:false}),
 watch(p){const k=Math.min(4,Math.floor(p*6.5));return {read:range(4).map(i=>i<k?1:0),out:p>.72}},
 ui:[{b:'Open or close the door',act:'door'}],
 on:{book(s,i){s.read[Number(i)]^=1;return 'keep'},door(s){s.out=!s.out;return 'keep'}},
 draw(s,f,X){
  const n=sum(s.read),mx=s.out?372:118;let out=heading('Everything physical about colour, and then red');
  out+=R(20,46,404,196,'#ebebeb','#8c8c8c',6)+L(20,214,424,214,'#b5b5b5',2);
  out+=R(176,104,74,50,'#fdfdfd','#555',4)+[0,1,2,3].map(i=>R(182+i*16,110,14,38,['#2b2b2b','#6b6b6b','#a5a5a5','#d6d6d6'][i],'none',0)).join('')+R(156,160,120,8,'#8f8f8f','none',2)+L(170,168,170,214,'#8f8f8f',3)+L(262,168,262,214,'#8f8f8f',3);
  out+=R(292,84,116,8,'#8f8f8f','none',2)+range(4).map(i=>R(300+i*26,52,18,32,s.read[i]?'#4a4a4a':'#fff','#666',2)).join('');
  out+=Ci(mx,128,15,'#c9c9c9','#555')+P(`M${mx} 143 L${mx} 186 M${mx} 156 L${mx-16} 172 M${mx} 156 L${mx+16} 172 M${mx} 186 L${mx-12} 214 M${mx} 186 L${mx+12} 214`,'#555',3);
  out+=TF(120,232,'Mary',13,'#555')+TF(260,232,'black-and-white room',13,'#555');
  out+=R(440,46,140,196,s.out?'#fff':'#cfcfcf','#8c8c8c',6)+(s.out?R(424,84,14,130,'#fff','#8c8c8c',0)+Ci(510,146,34,'#d0342c','#9c241e')+P('M510 114 Q500 100 486 104 Q498 112 510 114 Q522 100 536 106 Q522 114 510 114',C.green,1.5,C.green)+TF(510,206,'a ripe tomato',13,C.ink):R(424,84,14,130,'#777','#555',0)+TF(510,150,'outside',13,'#555')+TF(510,170,'(door closed)',13,'#555'));
  K1_BOOKS.forEach((b,i)=>out+=K1_key(X,'book',i,`Book: ${b[1]}${s.read[i]?', read':''}`,22+i*140,252,132,38,b[0]+(s.read[i]?' ✓':''),!!s.read[i],C.blue,13));
  out+=T(300,318,`Mary has read ${n} of 4 books`,13,C.muted);
  out+=TB(300,348,!s.out?(n===4?'She knows every physical fact about colour':'Not yet every physical fact'):n===4?'Does she learn anything new?':'Her surprise would prove nothing yet',15,s.out&&n===4?C.coral:C.ink);
  return {svg:out,phase:!s.out?(n===4?'The story needs this: nothing physical about colour vision is unknown to Mary. Now open the door.':'The books stand for all the physical facts: '+K1_BOOKS.map(b=>b[1]).join(', ')+'. The argument needs her to know them all.'):n===4?'Mary sees red for the first time. Jackson in 1982: she learns what red is like, so the physical facts were not all the facts. Most philosophers accept that something changes for Mary; they disagree about what.':'With gaps in her physical knowledge, anything new she learns outside might be one of the physical facts she missed. The argument only works if she first knows them all.'};
 }});

const K1_MARY=[
 ['New fact','Jackson (1982)','She learns a fact that no physical description contained, so physicalism leaves something out.','If that fact concerns qualia that cause nothing, what makes Mary say “so that is red”?',[1,1,1]],
 ['New ability','Nemirow (1980), Lewis (1988)','She gains know-how: she can now imagine, remember and recognise red. No new fact is learned.','Critics: knowing what red is like seems to be more than a set of abilities.',[1,0,0]],
 ['New way','Horgan (1984), Loar (1990)','She meets a fact she already knew, under a new concept that only having the experience can give.','Critics: the new concept then needs a physical explanation of its own.',[1,0,0]],
 ['Nothing new','Dennett (1991)','Knowing everything physical, she would already know how red would look to her, and would not be surprised.','Most people find this hard to accept; Dennett says they underrate “everything physical”.',[1,0,0]]];
const K1_STEPS=['Before release, Mary knows every physical fact.','On seeing red, she learns a new fact.','So some facts are not physical facts.'];
SCENE({id:'knowledge-argument-replies',name:'What does Mary learn?',tag:'Your answer commits you',
 definition:'The knowledge argument has two premises and a conclusion. Mary knows all the physical facts; on seeing red she learns a new fact; so not all facts are physical. Physicalists accept the first premise and deny the second, in three different ways.',
 example:'The ability reply: Mary gains skills, not a fact, as someone who learns to ride a bicycle gains no new fact. The new-way reply: she grasps an old fact under a new concept, as someone who knows water well may learn that it is H₂O. The third reply denies that she would be surprised at all.',
 desc:'Four answers to choose from. The three steps of the argument are marked accepted, denied, follows or blocked for the chosen answer, with the people who hold it and the best objection.',
 research:['Nemirow, L. (1980). Review of Nagel’s Mortal Questions. Philosophical Review 89, 473–477; Lewis, D. (1988). What experience teaches. Proceedings of the Russellian Society 13, 29–57.','Horgan, T. (1984). Jackson on physical information and qualia. Philosophical Quarterly 34, 147–152; Loar, B. (1990). Phenomenal states. Philosophical Perspectives 4, 81–108; Dennett, D. C. (1991). Consciousness Explained. No reply is generally accepted.'],
 dur:12,hint:'Choose what you think Mary learns. See which step of the argument your answer denies, who agrees with you, and the best objection to you.',
 init:()=>({v:null}),
 watch(p){return {v:Math.min(3,Math.floor(p*4))}},
 on:{v(s,x){s.v=Number(x);return 'keep'}},
 draw(s,f,X){
  let out=heading('What does Mary learn?');const m=s.v===null?null:K1_MARY[s.v];
  K1_MARY.forEach((q,i)=>out+=K1_key(X,'v',i,'Mary learns: '+q[0],22+i*140,44,132,36,q[0],s.v===i,C.blue,13));
  K1_STEPS.forEach((t,i)=>{const y=90+i*38,ok=m?m[4][i]:null,lab=ok===null?'':i<2?(ok?'accepted':'denied'):(ok?'follows':'blocked'),col=ok===null?C.line:ok?C.green:C.coral;
   out+=R(20,y,560,34,ok===null?'#fff':ok?C.greenp:C.coralp,col,8)+T(34,y+22,(i<2?(i+1)+'. ':'')+t,13,C.ink,'start')+(lab?TBF(566,y+22,lab,13,col,'end'):'')});
  out+=R(20,208,560,166,'#fff',C.grid,8);
  if(!m)out+=T(300,292,X.try?'Choose an answer above':'four answers, each with a price',13,C.muted);
  else out+=TB(300,230,m[1],14,C.blue)+K1_para(300,254,m[2],{w:530})+TB(300,322,'Best objection',13,C.coral)+K1_para(300,344,m[3],{w:530});
  return {svg:out,phase:!m?'Every answer has defenders, and every answer has a cost.':s.v===0?'You accept both premises and so the conclusion. Jackson in 1982 added that these qualia have no physical effects, which is where his own later doubts began (next scene).':s.v===3?'You deny that Mary learns anything. On this view the story misleads us, because we cannot really imagine knowing everything physical.':'You accept that something changes for Mary but deny that it is a new fact, so the conclusion does not follow and physicalism survives.'};
 }});

SCENE({id:'knowledge-argument-reversal',name:'Jackson changes his mind',tag:'Do qualia do anything?',
 definition:'In 1982 Jackson held that qualia are epiphenomenal: caused by the brain but causing nothing physical. He defended the argument again in 1986. By the late 1990s he had rejected it and become a physicalist, holding that the intuition about Mary, strong as it is, misleads us.',
 example:'One of the worries that moved him: if the redness of red causes nothing, it cannot be what makes Mary exclaim on leaving the room, or what makes us talk about qualia at all. Our words would be the same without it, so they could not be evidence for it.',
 desc:'A timeline of Jackson’s position in 1982, 1986 and 1998 to 2003, and a diagram: a brain state causes Mary’s words; the redness she experiences either has no effect or is a further, non-physical cause.',
 research:['Jackson (1982; 1986), as in the first scene of this lesson.','Jackson, F. (1998). Postscript on qualia. In Mind, Method and Conditionals. Routledge; Jackson, F. (2003). Mind and illusion. In A. O’Hear (ed.), Minds and Persons. Cambridge University Press. An author rejecting his own argument does not settle whether it is sound; many philosophers still defend it.'],
 dur:10,hint:'Choose whether the experienced redness has any effects, and read what follows for Mary’s words on leaving the room.',
 init:()=>({c:'no'}),
 watch(p){return {c:p<.5?'no':'yes',t:Math.min(2,Math.floor(p*3))}},
 ui:[{choose:[['no','No effects'],['yes','It has effects']],label:'Does the redness cause anything?',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=v;return 'keep'}},
 draw(s){
  let out=heading('Jackson on his own argument');
  out+=L(70,74,530,74,C.line,3);[[110,'1982','argues it'],[300,'1986','defends it'],[490,'1998–2003','rejects it']].forEach((q,i)=>out+=Ci(q[0],74,7,i===2?C.coral:C.blue,'#fff')+TB(q[0],62,q[1],14,i===2?C.coral:C.blue)+T(q[0],98,q[2],13,s.t===i?C.ink:C.muted));
  out+=R(40,166,150,52,C.pale,C.blue,8)+TF(115,188,'brain state',13,C.ink)+TF(115,206,'on seeing red',13,C.ink)+R(410,166,150,52,C.greenp,C.green,8)+TF(485,188,'Mary says:',13,C.ink)+TF(485,206,'“So that is red!”',13,C.ink);
  out+=arrow(190,192,408,192,C.blue,2.5)+TF(300,210,'physical cause',13,C.blue);
  out+=`<ellipse cx="300" cy="136" rx="78" ry="20" fill="${C.purplep}" stroke="${C.purple}" stroke-width="2" stroke-dasharray="6 5"/>`+TF(300,141,'the redness (a quale)',13,C.purple)+arrow(150,166,224,144,C.purple,2);
  out+=s.c==='yes'?arrow(376,144,450,165,C.coral,2.5)+TF(476,140,'a second cause',13,C.coral):L(378,144,410,153,C.line,2,'stroke-dasharray="4 4"')+TF(476,140,'no effect',13,C.muted);
  const yes=s.c==='yes';
  out+=R(20,232,560,142,'#fff',yes?C.coral:C.purple,8)+TB(300,254,yes?'Yes: the redness helps to cause her words':'No: the redness is an effect only (Jackson 1982)',14,yes?C.coral:C.purple)
   +K1_para(300,280,yes?'Then something non-physical moves her lips, and the physical account of her body is missing a cause. Physicalists reply that no such missing cause has been found.':'Then her brain alone causes her words. She would say them with or without the redness, so her words are no evidence that it exists. This worry helped to change Jackson’s mind.',{w:530});
  return {svg:out,phase:yes?'This is interactionist dualism, and it inherits Elisabeth’s question: how does something non-physical move matter?':'This is epiphenomenalism. It keeps physics complete, at the price of making experience idle, even in our own talk about experience.'};
 }});

/* =========================== zombies-functionalism =========================== */
SCENE({id:'zombies-functionalism',name:'The zombie argument',tag:'Accept or reject each premise',
 definition:'A philosophical zombie is an imagined being identical to you atom for atom, behaving exactly as you do, with no experience at all. Robert Kirk introduced the idea in 1974 and David Chalmers built an argument on it in The Conscious Mind (1996): if such a being is possible, the physical facts do not fix the facts about experience.',
 example:'Nobody claims that zombies exist. The argument needs only that they are possible. Its weakest step, and the best objection, is the move from “I can conceive of it” to “it is possible”.',
 desc:'You and a zombie twin, alike in atoms and behaviour. Below, three premises and a conclusion; premises 1 and 2 can be accepted or rejected, and the conclusion follows or is blocked.',
 research:['Kirk, R. (1974). Zombies v. materialists. Proceedings of the Aristotelian Society, Supplementary Volume 48, 135–152; Chalmers, D. J. (1996). The Conscious Mind. Oxford University Press.','Against: Dennett, D. C. (1995). The unimagined preposterousness of zombies. Journal of Consciousness Studies 2(4), 322–326; Kirk, R. (2005). Zombies and Consciousness. Oxford University Press, in which Kirk argues that zombies are not conceivable after all. Contested.'],
 dur:12,hint:'Accept or reject premises 1 and 2 and see whether the conclusion still follows, and who shares your view.',
 init:()=>({p1:1,p2:1}),
 watch(p){const k=Math.min(2,Math.floor(p*3));return {p1:[1,0,1][k],p2:[1,1,0][k]}},
 on:{p1(s,v){s.p1=Number(v);return 'keep'},p2(s,v){s.p2=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('From “conceivable” to “physicalism is false”');
  const fig=(x,glow)=>Ci(x,66,15,'#fff',C.dark)+(glow?Ci(x,66,7,'#f0b429'):Ci(x,66,7,'none',C.line,'stroke-dasharray="3 3"'))+P(`M${x-13} 110 Q${x-13} 84 ${x} 84 Q${x+13} 84 ${x+13} 110`,C.dark,2,'#fff');
  out+=fig(210,true)+fig(390,false)+TF(300,64,'same atoms',13,C.muted)+TF(300,84,'same behaviour',13,C.muted)+T(184,70,'you',13,C.ink,'end')+T(184,90,'experience',13,C.amber,'end')+T(416,70,'zombie twin',13,C.ink,'start')+T(416,90,'no experience',13,C.muted,'start');
  const follows=s.p1&&s.p2;
  [['1. Zombies are conceivable.','p1',s.p1],['2. What is conceivable is possible.','p2',s.p2],['3. If possible, physics does not fix experience.',null,1]].forEach((q,i)=>{const y=122+i*38;
   out+=R(20,y,560,34,q[2]?C.greenp:C.coralp,q[2]?C.green:C.coral,8)+T(32,y+22,q[0],13,C.ink,'start');
   if(q[1])out+=K1_key(X,q[1],1,'Accept premise '+(i+1),404,y+3,80,28,'Accept',q[2]===1,C.green,13)+K1_key(X,q[1],0,'Reject premise '+(i+1),490,y+3,80,28,'Reject',q[2]===0,C.coral,13)});
  out+=R(20,236,560,34,follows?C.amberp:'#fff',follows?C.amber:C.line,8)+T(32,258,'So physicalism is false.',13,C.ink,'start')+TBF(566,258,follows?'follows':'blocked',13,follows?C.amber:C.muted,'end');
  const who=follows?['Chalmers (1996)','All three premises stand, so facts about experience are further facts beyond the physical ones. A physicalist must reject a premise: try each.']:!s.p1&&s.p2?['Dennett (1995); Kirk by 2005','Imagine every function in full detail, they say, and nothing is left to be missing. A zombie only seems conceivable while the picture is left vague.']:s.p1?['Many physicalists','Water that is not H₂O seems conceivable, yet is impossible. Conceiving is no proof of possibility. Chalmers argues that the water case does not carry over.']:['Both objections at once','You hold that zombies are not really conceivable, and that conceiving them would not show them possible in any case.'];
  out+=R(20,276,560,98,'#fff',C.grid,8)+TB(300,296,who[0],14,C.blue)+K1_para(300,318,who[1],{w:530});
  return {svg:out,phase:follows?'Premise 3 is granted by nearly everyone: physicalism says that fixing the physical facts fixes all the facts. The dispute is over premises 1 and 2.':'With a premise rejected the conclusion no longer follows. That does not show physicalism to be true; it shows only that this argument does not refute it.'};
 }});

// The vending machine: states S0 (owes 10p) and S5 (owes 5p); a drink costs 10p.
function K1_vend(st,coin){if(st===0)return coin===5?{st:5,drink:0,change:0}:{st:0,drink:1,change:0};return coin===5?{st:0,drink:1,change:0}:{st:0,drink:1,change:5}}
function K1_vendRun(coins){let st=0,drinks=0,change=0,last=null;for(const c of coins){const r=K1_vend(st,c);last={from:st,coin:c,...r};st=r.st;drinks+=r.drink;change+=r.change}return {st,drinks,change,last}}
function K1_machine(made,st){
 let out='';const lamp=Ci(130,72,9,st===5?'#f0b429':'#fff',C.amber)+TF(130,98,st===5?'in state S5':'in state S0',13,C.muted);
 if(made==='gears'){const gear=(x,y,r,turn)=>{let g=Ci(x,y,r,'#e7edf1',C.dark);for(let i=0;i<8;i++){const a=turn+i*Math.PI/4;g+=L(x+Math.cos(a)*r,y+Math.sin(a)*r,x+Math.cos(a)*(r+7),y+Math.sin(a)*(r+7),C.dark,4)}return g+Ci(x,y,4,C.dark)};
  out+=gear(98,160,30,st===5?.4:0)+gear(166,170,22,st===5?-.1:.3)}
 else if(made==='relays'){[[60,128],[150,128],[105,178]].forEach((q,i)=>out+=R(q[0],q[1],50,30,(st===5&&i===2)?C.amberp:'#e7edf1',C.dark,4)+L(q[0]+10,q[1]+15,q[0]+40,q[1]+(st===5&&i===2?15:7),C.dark,2.5));out+=L(85,158,120,178,C.blue,2)+L(175,158,140,178,C.blue,2)+L(110,143,150,143,C.blue,2)}
 else{[[70,150],[130,170],[190,150]].forEach((q,i)=>out+=Ci(q[0],q[1]-22,9,'#fff',C.dark)+P(`M${q[0]} ${q[1]-13} L${q[0]} ${q[1]+12} M${q[0]-11} ${q[1]-2} L${q[0]+11} ${q[1]-2} M${q[0]} ${q[1]+12} L${q[0]-8} ${q[1]+30} M${q[0]} ${q[1]+12} L${q[0]+8} ${q[1]+30}`,C.dark,2.5)+(st===5&&i===1?R(q[0]+10,q[1]-12,16,12,C.amberp,C.amber,2):''));out+=arrow(84,146,116,160,C.blue,2,7)+arrow(144,160,176,146,C.blue,2,7)}
 return out+lamp;
}
const K1_COINS=[5,5,10,5,10,10];
SCENE({id:'zombies-functionalism-realisers',name:'Functionalism',tag:'One table, many machines',
 definition:'Functionalism holds that a mental state is defined by what it does: its typical causes, its effects on other states and its effects on behaviour. Hilary Putnam argued in the 1960s that pain cannot be one particular kind of brain state, because mammals, reptiles and octopuses have very different brains and yet, he supposed, all can be in pain. Mental states are multiply realisable.',
 example:'A drinks machine that charges 10p needs a state that means “5p paid so far”. That state can be a position of gears, a relay or a note passed between people. What makes it that state is its place in the machine’s table, not what it is made of. Functionalists say mental states are like this.',
 desc:'A drinks machine built from gears, relays or people, beside its state table. Inserting 5p or 10p coins moves it between two states and gives drinks and change; the table is the same whatever the machine is made of.',
 research:['Putnam, H. (1967). Psychological predicates. In W. H. Capitan & D. D. Merrill (eds), Art, Mind, and Religion. University of Pittsburgh Press (reprinted as “The nature of mental states”).','The drinks machine follows Block, N. (1980). What is functionalism? In Readings in Philosophy of Psychology, vol. 1. Harvard University Press. Functionalism is widely held and widely disputed: the next two scenes give the main argument against it and the main argument for it.'],
 dur:12,hint:'Insert coins and watch the state. Then change what the machine is made of: the table and the behaviour stay the same.',
 init:()=>({coins:[],made:'gears'}),
 watch(p){return {coins:K1_COINS.slice(0,Math.min(6,Math.floor(p*7))),made:['gears','relays','people'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['gears','Gears'],['relays','Relays'],['people','People']],label:'Made of',get:s=>s.made,act:'made'}],
 on:{coin(s,v){if(s.coins.length>=40)s.coins=[];s.coins.push(Number(v));return 'keep'},made(s,v){s.made=v;return 'keep'}},
 draw(s,f,X){
  const m=K1_vendRun(s.coins);let out=heading('A state is what it does');
  out+=R(20,46,220,200,'#fff',C.grid,8)+K1_machine(s.made,m.st)+TF(130,236,'made of '+s.made,13,C.muted);
  out+=K1_key(X,'coin',5,'Insert a 5p coin',20,254,105,38,'Insert 5p',false,C.blue,13)+K1_key(X,'coin',10,'Insert a 10p coin',135,254,105,38,'Insert 10p',false,C.blue,13);
  const cx=[256,352,462],cw=[96,110,118];
  ['state','5p in','10p in'].forEach((h,i)=>out+=R(cx[i],46,cw[i]-4,28,C.pale,'none',4)+TBF(cx[i]+cw[i]/2-2,65,h,13,C.ink));
  [['S0: owes 10p','→ S5','drink → S0'],['S5: owes 5p','drink → S0','drink + 5p → S0']].forEach((row,r)=>{const y=78+r*46,now=m.st===r*5;
   row.forEach((t,i)=>{const used=m.last&&m.last.from===r*5&&i===(m.last.coin===5?1:2);out+=R(cx[i],y,cw[i]-4,42,used?C.amberp:now&&i===0?C.greenp:'#fff',used?C.amber:now&&i===0?C.green:C.grid,4)+TF(cx[i]+cw[i]/2-2,y+26,t,13,C.ink)})});
  out+=counter(256,182,'drinks given',String(m.drinks),C.green,100)+counter(366,182,'change given',m.change+'p',C.blue,100)+counter(476,182,'state now',m.st===5?'S5':'S0',C.amber,100);
  out+=TF(418,252,m.last?`last: ${m.last.coin}p in → ${m.last.drink?'drink'+(m.last.change?' + 5p change':''):'no drink yet'}`:'no coins yet',13,C.muted);
  out+=TB(300,330,'Same table, three machines',15,C.ink)+T(300,356,'S5 is defined by its row in the table',13,C.muted);
  return {svg:out,phase:m.last?`The ${m.last.coin}p coin took the machine from S${m.last.from} to S${m.st}${m.last.drink?' and released a drink':''}. Gears, relays and people all follow the same table, so each has a state that plays the part of S5. A functionalist says pain is likewise whatever plays the pain role.`:'The table lists what each state does with each coin. Nothing in it says what the machine is made of.'};
 }});

const K1_NODES={A:[100,76],B:[100,146],C:[100,216],M1:[280,100],M2:[280,192],O:[440,146]};
const K1_EDGES=[['A','M1'],['B','M1'],['B','M2'],['C','M2'],['M1','O'],['M2','O']];
const K1_NEED={M1:2,M2:1,O:2};
function K1_net(inp){const v={A:inp[0],B:inp[1],C:inp[2]};v.M1=v.A+v.B>=2?1:0;v.M2=v.B+v.C>=1?1:0;v.O=v.M1+v.M2>=2?1:0;return v}
const K1_CHINA={yes:'Functionalism accepts this: the organisation is what matters, whoever or whatever carries the signals. Block finds that very hard to believe.',
 no:'Then organisation alone is not enough, and you owe an account of what else matters. Block (1978) called this the problem of absent qualia.',
 unsure:'Functionalists reply that intuition is a poor guide here: looked at one neuron at a time, a brain does not seem to feel anything either.'};
SCENE({id:'zombies-functionalism-china',name:'The China brain',tag:'Block’s objection',
 definition:'Ned Block’s objection to functionalism (1978). Suppose the people of China each play the part of one neuron, passing signals by radio according to simple rules, so that together they have the same functional organisation as a brain, and suppose the whole is wired to a body. Functionalism implies that this system has experiences. Block doubts it.',
 example:'Each person follows one rule, such as “signal if at least two of your contacts signal”. Nobody in the network understands what the whole is doing, exactly as no single neuron does.',
 desc:'A network of three inputs, two middle units and one output that lifts an arm, shown first as neurons and then as people with radios following the same rules. A question with three answers follows.',
 research:['Block, N. (1978). Troubles with functionalism. In C. W. Savage (ed.), Minnesota Studies in the Philosophy of Science 9, 261–325.','A thought experiment. It tests intuitions, and both sides agree that intuitions about a system of this size may be unreliable; they disagree about which way that cuts.'],
 dur:14,hint:'Step through the network as neurons and then as people. Press the inputs A, B and C to change the signals, then answer the question.',
 init:()=>({inp:[1,1,0],q:null}),
 trace(s){const fr=[];for(const view of ['n','p'])for(let k=0;k<3;k++)fr.push({view,k,say:(view==='n'?'Neurons: ':'People with radios: ')+['the inputs arrive.','each middle unit applies its rule.','the output unit applies its rule, and the arm lifts or stays still.'][k]});return fr},
 on:{inp(s,i){s.inp[Number(i)]^=1},q(s,v){s.q=v;return 'keep'}},
 draw(s,f,X){
  f=f||{view:'n',k:2};const v=K1_net(s.inp),stage={A:0,B:0,C:0,M1:1,M2:1,O:2},act=id=>v[id]&&f.k>=stage[id];
  let out=heading(f.view==='n'?'A small network of neurons':'The same network, run by people with radios');
  K1_EDGES.forEach(e=>{const a=K1_NODES[e[0]],b=K1_NODES[e[1]],on=act(e[0])&&f.k>stage[e[0]];out+=arrowR(a,b,24,26,on?C.blue:C.line,on?3.5:2)});
  for(const id in K1_NODES){const [x,y]=K1_NODES[id],on=act(id),fill=on?'#f6c343':'#fff';
   let inner=f.view==='n'?Ci(x,y,22,fill,C.blue)+TBF(x,y+5,id,14,C.ink):Ci(x,y-11,9,fill,C.dark)+P(`M${x-14} ${y+20} Q${x-14} ${y-1} ${x} ${y-1} Q${x+14} ${y-1} ${x+14} ${y+20} Z`,C.dark,2,fill)+R(x+12,y-18,9,14,'#fff',C.dark,2)+L(x+16,y-18,x+16,y-26,C.dark,2)+TBF(x,y+15,id,13,C.ink);
   if(K1_NEED[id])inner+=TF(x,y+42,'needs '+K1_NEED[id],13,C.muted);
   out+=stage[id]===0?hit(X,'inp',['A','B','C'].indexOf(id),`Input ${id}: ${v[id]?'on':'off'}. Press to switch.`,inner):inner}
  const lift=act('O');out+=arrow(466,146,506,146,lift?C.blue:C.line,lift?3.5:2)+R(512,120,68,52,lift?C.greenp:'#fff',lift?C.green:C.line,8)+TF(546,142,'arm',13,C.ink)+TBF(546,160,f.k<2?'…':lift?'lifts':'still',13,lift?C.green:C.muted);
  out+=TF(30,279,'Does the people network feel anything?',13,C.ink,'start');
  [['yes','Yes',330,70],['no','No',408,70],['unsure','Not sure',486,94]].forEach(q=>out+=K1_key(X,'q',q[0],'Answer: '+q[1],q[2],256,q[3],36,q[1],s.q===q[0],C.blue,13));
  out+=R(20,298,560,78,'#fff',C.grid,8)+K1_para(300,320,s.q?K1_CHINA[s.q]:'The signals and rules are the same in both versions. Block imagined the whole population of China doing this for a brain.',{w:530});
  return {svg:out,phase:f.say+(f.view==='p'&&f.k===2?' The pattern of signals is identical to the neuron version: that is what “the same functional organisation” means.':'')};
 }});

const K1_ORDER=(()=>{const o=shuffled(range(100),42),rank=[];o.forEach((cell,i)=>rank[cell]=i);return rank})();
SCENE({id:'zombies-functionalism-fading',name:'Fading qualia',tag:'Replace neurons one by one',
 definition:'Chalmers’ argument for functionalism. Replace your neurons one at a time with silicon chips, each doing exactly the same input–output job as the neuron it replaces. By construction your behaviour never changes. What happens to your experience: does it stay, fade gradually, or vanish at some point?',
 example:'If it fades, then halfway through you would have dim experience while saying, and believing, that everything is as vivid as ever. If it vanishes, one single replacement makes the whole difference. Chalmers finds both implausible and concludes that experience stays. John Searle (1992) considers the fading case a real possibility.',
 desc:'A grid of 100 units, neurons turning to chips as a slider moves, beside a graph with a flat line for behaviour and a line for experience drawn from the learner’s answer. The graph is labelled a thought experiment with no data.',
 research:['Chalmers, D. J. (1995). Absent qualia, fading qualia, dancing qualia. In T. Metzinger (ed.), Conscious Experience. Imprint Academic; also The Conscious Mind (1996), chapter 7.','Searle, J. R. (1992). The Rediscovery of the Mind. MIT Press, chapter 3, describes the same replacement and takes shrinking experience with unchanged behaviour to be possible. A thought experiment: there are no data, and the answer is contested.'],
 dur:12,hint:'Move the slider to replace neurons, then give your answer. “Vanishes here” marks the point where the slider now stands.',
 init:()=>({r:0,ans:null,at:50}),
 watch(p){const k=Math.min(2,Math.floor(p*3));return {r:Math.round(((p*3)%1)*100*(p>=1?0:1)+(p>=1?100:0)),ans:['stay','fade','gone'][k],at:50}},
 ui:[{range:'r',label:'Neurons replaced',min:0,max:100,step:1,get:s=>s.r,act:'r',show:v=>v+'%'}],
 on:{r(s,v){s.r=Number(v);return 'keep'},ans(s,v){s.ans=v;if(v==='gone')s.at=clamp(s.r,1,100);return 'keep'}},
 draw(s,f,X){
  let out=heading('Same behaviour throughout. And experience?');
  for(let i=0;i<100;i++){const x=40+(i%10)*20,y=52+Math.floor(i/10)*20;out+=K1_ORDER[i]<s.r?R(x-6,y-6,12,12,'#8a98a0','none',2):Ci(x,y,6.5,C.blue)}
  out+=TF(130,266,`${s.r} of 100 replaced`,13,C.ink)+Ci(52,280,5,C.blue)+TF(62,284,'neuron',13,C.muted,'start')+R(128,275,10,10,'#8a98a0','none',2)+TF(144,284,'chip',13,C.muted,'start');
  const gx=300,gy=64,gw=250,gh=140,Xg=v=>gx+v/100*gw,Yg=v=>gy+gh-v*(gh-12);
  out+=L(gx,gy,gx,gy+gh,C.line,2)+L(gx,gy+gh,gx+gw,gy+gh,C.line,2);[0,50,100].forEach(v=>out+=TF(Xg(v),gy+gh+17,v+'%',13,C.muted));
  out+=TF(gx+gw/2,gy+gh+35,'neurons replaced',13,C.muted)+TF(gx+gw/2,gy+gh+54,'thought experiment: no data',13,C.muted);
  out+=L(Xg(0),Yg(1)-5,Xg(100),Yg(1)-5,C.green,2.5,'stroke-dasharray="6 4"')+TF(gx+gw,gy-8,'behaviour: unchanged',13,C.green,'end');
  const e=v=>s.ans==='stay'?1:s.ans==='fade'?1-v/100:v<s.at?1:0;
  if(s.ans){out+=K1_poly(s.ans==='gone'?[[Xg(0),Yg(1)],[Xg(s.at),Yg(1)],[Xg(s.at),Yg(0)],[Xg(100),Yg(0)]]:[[Xg(0),Yg(1)],[Xg(100),Yg(e(100))]],C.coral,3)+Ci(Xg(s.r),Yg(e(s.r)),6,C.coral,'#fff')+TF(gx+8,Yg(.5)+(s.ans==='fade'?30:4),'experience: your answer',13,C.coral,'start')}
  else out+=TF(gx+gw/2,Yg(.5),'experience: your answer?',13,C.muted);
  [['stay','Never fades'],['fade','Fades slowly'],['gone','Vanishes here']].forEach((q,i)=>out+=K1_key(X,'ans',q[0],'Experience: '+q[1],20+i*190,292,180,36,q[1],s.ans===q[0],C.coral,13));
  out+=TB(300,356,s.ans==='stay'?'Then organisation, not material, carries experience':s.ans==='fade'?`At ${s.r}%: dimmer experience, the same words`:s.ans==='gone'?`Chip number ${s.at} switches experience off`:'Three answers, each with a cost',14,C.ink);
  return {svg:out,phase:s.ans==='stay'?'With Chalmers: a fully replaced brain is fully conscious, which is functionalism. Searle objects that doing a neuron’s input–output job need not copy whatever it is about neurons that causes experience.':s.ans==='fade'?'You would be badly wrong about your own experience while reasoning and speaking normally. Chalmers calls that implausible; Searle thinks it could happen. Compare the last lesson of this era, on how far self-reports can be trusted.':s.ans==='gone'?'One replacement among many makes all the difference. Chalmers asks what could be special about that neuron, since the one before and the one after are just like it.':'Behaviour stays the same because each chip is stipulated to do its neuron’s job exactly. Whether a real chip could is a separate, empirical question.'};
 }});

/* =========================== trusting-reports =========================== */
const K1_PUB=[12,17,31,40];
function K1_shop(seed,n){const r=rng(seed),c=[0,0,0,0];for(let i=0;i<n;i++){const u=r()*100;c[u<12?0:u<29?1:u<60?2:3]++}return c}
SCENE({id:'trusting-reports',name:'Telling more than we can know',tag:'Reasons that were not the cause',
 definition:'Richard Nisbett and Timothy Wilson (1977) reviewed studies in which people were asked why they had done something. People answered readily, but their answers often missed the factor that had actually shaped their behaviour, and matched what an outside observer would have guessed. This concerns the causes of behaviour, not what people are experiencing at the moment.',
 example:'Shoppers were asked to choose the best of four pairs of nylon stockings that were in fact identical. The pair on the right was chosen almost four times as often as the pair on the left. Asked why, nobody mentioned position, and nearly all denied it when it was suggested.',
 desc:'Four identical pairs in a row, A to D. Bars show the share of simulated shoppers choosing each, with dashes at the published shares of 12, 17, 31 and 40 per cent. A panel shows what shoppers said when asked why.',
 research:['Nisbett, R. E. & Wilson, T. D. (1977). Telling more than we can know: verbal reports on mental processes. Psychological Review 84, 231–259; Wilson, T. D. & Nisbett, R. E. (1978). The accuracy of verbal reports about the effects of stimuli on evaluations and behavior. Social Psychology 41, 118–131.','The stocking study is small and old. The general claim, that people give confident reasons that were not the causes, is supported by later work such as choice blindness (era 5). The paper has also been criticised for understating what people do know about their own minds.'],
 dur:12,hint:'Send shoppers to the stall in fifties and watch the shares settle. Then ask them why they chose. The shoppers are simulated from the published shares.',
 init:()=>({n:0,seed:1977,asked:false}),
 watch(p){return {n:Math.min(200,Math.floor(p*6)*50),seed:1977,asked:p>.7,sim:true}},
 ui:[{b:'Send 50 shoppers',act:'send'},{b:'Ask them why',act:'ask'},{b:'New stall',act:'fresh'}],
 on:{send(s){s.n=s.n>=200?50:s.n+50;return 'keep'},ask(s){s.asked=!s.asked;return 'keep'},fresh(s){s.seed=nextSeed();s.n=0;s.asked=false;return 'keep'}},
 draw(s,f,X){
  const c=K1_shop(s.seed,s.n);let out=heading('Four identical pairs: which is best?');
  out+=L(40,196,560,196,C.line,2)+L(40,58,66,58,C.blue,6)+TF(72,62,'simulated shoppers',13,C.blue,'start')+L(40,78,66,78,C.muted,2,'stroke-dasharray="5 4"')+TF(72,82,'published share',13,C.muted,'start');
  K1_PUB.forEach((pub,i)=>{const xc=105+i*130,pct=s.n?c[i]/s.n*100:0,h=Math.min(pct,48)*3;
   out+=R(xc-30,196-h,60,h,C.blue,'none',4)+(s.n?TBF(xc,190-h,Math.round(pct)+'%',13,C.blue):'')+L(xc-36,196-pub*3,xc+36,196-pub*3,C.muted,2,'stroke-dasharray="5 4"')+TF(xc+40,200-pub*3,pub+'%',13,C.muted,'start');
   out+=R(xc-24,204,22,26,'#dcc7ab','#a58c6a',6)+R(xc+2,204,22,26,'#dcc7ab','#a58c6a',6)+TB(xc,250,'ABCD'[i],14,C.ink)});
  out+=TF(105,268,'left',13,C.muted)+TF(495,268,'right',13,C.muted)+TF(300,268,'the pairs are identical',13,C.muted);
  out+=R(20,278,560,96,'#fff',C.grid,8);
  if(s.asked&&s.n)out+=TB(300,300,'Asked why they chose it',14,C.ink)+T(300,322,'They named qualities of the pair they picked.',13,C.ink)+TB(300,344,'Position mentioned unprompted: nobody',13,C.coral)+T(300,364,'Asked directly, almost all denied it mattered.',13,C.muted);
  else out+=TB(300,318,`${s.n} shoppers so far`,15,C.ink)+T(300,346,s.n?(X.try?'Press “Ask them why”':'next: ask them why'):(X.try?'Press “Send 50 shoppers”':'shoppers arrive in fifties'),13,C.muted);
  return {svg:out,phase:!s.n?'In the original study the pairs were laid out left to right and passers-by judged which was the best quality.':s.asked?'The shoppers were not lying. They gave the kind of reason anyone would give for preferring a pair of stockings. Nisbett and Wilson’s point is that the report came from a plausible theory about choices, not from observing the cause.':`${Math.round(c[3]/s.n*100)}% chose the right-hand pair and ${Math.round(c[0]/s.n*100)}% the left-hand one. With identical pairs, only position can explain the difference. Small samples wander; send more shoppers to see the shares settle near the published ones.`};
 }});

const K1_OFF=[-255,-190,-125,-60,60,125,190,255],K1_SIZES=[34,28,22,16,16,22,28,34];
SCENE({id:'trusting-reports-introspection',name:'Introspecting on experience',tag:'You take part: how much is sharp?',
 definition:'Eric Schwitzgebel (2008) argued that we are unreliable not only about the causes of our behaviour but about our current experience itself. People disagree about, and are often wrong about, such basic matters as how much of the visual field is clear at one moment, whether their thoughts come in words, and how vivid their imagery is.',
 example:'Most people say that they see a wide, sharp scene. In fact letters of a fixed size can be read only close to where the eyes are pointing; the impression of sharpness everywhere comes from moving the eyes. Russell Hurlburt argues that careful questioning about single moments can make reports of experience trustworthy; he and Schwitzgebel have debated this at book length.',
 desc:'A row of eight equal-sized letters either side of a central cross. The learner first predicts how many will be readable with eyes on the cross, then marks the ones read. A second row shows letters enlarged with distance from the cross.',
 research:['Schwitzgebel, E. (2008). The unreliability of naive introspection. Philosophical Review 117, 245–273; Hurlburt, R. T. & Schwitzgebel, E. (2007). Describing Inner Experience? Proponent Meets Skeptic. MIT Press.','Anstis, S. M. (1974). A chart demonstrating variations in acuity with retinal position. Vision Research 14, 589–592: the letter size needed grows with distance from the point of gaze. That result is robust; how far introspection can be trusted is contested.'],
 dur:12,hint:'Set your prediction, press Show the letters, keep your eyes on the cross and press each letter you can identify. Then press Done. The effect is larger on a wide screen held close. Nothing leaves the page.',
 init:()=>({pred:6,phase:'predict',letters:[],got:[]}),
 watch(p){return {pred:8,phase:p<.25?'predict':p<.7?'look':'done',letters:'KDNRSCVH'.split(''),got:[3,4,2,5].slice(0,p<.3?0:Math.min(4,Math.floor((p-.3)*14))),sim:true}},
 ui:[{range:'pred',label:'I expect to read',min:0,max:8,step:1,get:s=>s.pred,act:'pred',show:v=>v+' of 8'},{b:'Show the letters',act:'show'},{b:'Done',act:'done'}],
 on:{pred(s,v){s.pred=Number(v);return 'keep'},show(s){s.letters=shuffled('CDHKNORSVZ'.split(''),nextSeed()).slice(0,8);s.got=[];s.phase='look';return 'keep'},
  tap(s,i){if(s.phase!=='look')return 'keep';i=Number(i);const k=s.got.indexOf(i);if(k>=0)s.got.splice(k,1);else s.got.push(i);return 'keep'},
  done(s){if(s.phase==='look')s.phase='done';return 'keep'}},
 draw(s,f,X){
  const who=s.sim?'The simulated viewer':'You';let out=heading('With your eyes on the cross, how much is sharp?');
  out+=T(300,62,s.phase==='predict'?'Eyes on the cross: how many of 8 letters will you read?':s.phase==='look'?'Keep looking at the cross. Press each letter you can identify.':'Same letters, now enlarged with distance from the cross',13,C.muted);
  out+=TBF(300,129,'+',26,C.coral);
  K1_OFF.forEach((dx,i)=>{const x=300+dx,on=s.got.includes(i);
   const inner=R(x-22,98,44,46,on?C.greenp:'#fff',on?C.green:C.grid,6)+(s.phase==='predict'?TBF(x,128,'·',20,C.muted):TBF(x,128,s.letters[i],20,C.ink));
   out+=s.phase==='look'?hit(X,'tap',i,`Letter ${i+1} of 8${on?', marked as read':''}`,inner):inner});
  out+=TF(300,164,'all eight letters are the same size',13,C.muted);
  if(s.phase==='done'){out+=TBF(300,226,'+',26,C.coral);K1_OFF.forEach((dx,i)=>out+=TBF(300+dx,214+K1_SIZES[i]*.36,s.letters[i],K1_SIZES[i],C.ink));out+=TF(300,252,'scaled after Anstis (1974): about equally readable',13,C.muted)}
  const bar=(y,label,v,col)=>T(190,y+15,label,13,C.ink,'end')+R(200,y,320,20,'#f3f6f8','none',4)+R(200,y,v*40,20,col,'none',4)+TBF(200+v*40+8,y+15,v+' of 8',13,C.ink,'start');
  out+=bar(278,s.sim?'predicted':'you predicted',s.pred,C.muted);
  out+=s.phase==='predict'?T(300,335,X.try?'Set your prediction, then press Show the letters':'first a prediction',13,C.muted):bar(312,s.sim?'read':'you read',s.got.length,C.coral);
  if(s.phase==='done')out+=T(300,364,'Sharp vision covers only a small region around the point of gaze.',13,C.muted);
  const k=s.got.length;
  return {svg:out,phase:s.phase==='predict'?'Before looking, most people expect to read nearly all of the letters: the visual field seems sharp from edge to edge.':s.phase==='look'?'No one is checking: the test is whether what you can do matches what you expected. Moving your eyes would let you read every letter, which is why the field seems sharp.':k<s.pred?`${who} expected ${s.pred} and read ${k}. Overestimating is the usual result: a belief about one’s own present experience turned out wrong, which is Schwitzgebel’s point.`:`${who} expected ${s.pred} and read ${k}. On a small or distant screen all eight letters fall close to the point of gaze, so the effect shrinks; a wider window held closer shows it better.`};
 }});

const K1_PAS=['No experience','Brief glimpse','Almost clear experience','Clear experience'];
function K1_toy(e,c,lam){const d=Math.abs(e-c);return {yes:e>c,conf:d<.4?1:d<.8?2:d<1.2?3:4,pas:e<.5?0:e<1.2?1:e<2?2:3,high:d>.4+lam,fc:K1_Phi(e/Math.SQRT2)}}
SCENE({id:'trusting-reports-measures',name:'Four ways to ask',tag:'A toy observer',
 definition:'Experiments on consciousness need a measure of whether something was experienced. The main ones: a yes/no report; a confidence rating; the Perceptual Awareness Scale, four steps from “no experience” to “clear experience” (Ramsøy & Overgaard 2004); and post-decision wagering, in which people bet on their own answers (Persaud, McLeod & Cowey 2007).',
 example:'The measures can disagree. A cautious person may say “no” to a faint stimulus yet pick its position correctly well above chance when made to choose. A low bet may show lack of awareness, or only a dislike of losing: wagering was criticised on that ground (Schurger & Sher 2008).',
 desc:'A line showing the strength of internal evidence on one trial and the observer’s criterion for saying yes. Five rows give the outcome of a yes/no report, a confidence rating, the Perceptual Awareness Scale, a wager and forced-choice accuracy. The picture is labelled a toy.',
 research:['Ramsøy, T. Z. & Overgaard, M. (2004). Introspection and subliminal perception. Phenomenology and the Cognitive Sciences 3, 1–23; Persaud, N., McLeod, P. & Cowey, A. (2007). Post-decision wagering objectively measures awareness. Nature Neuroscience 10, 257–261.','Schurger, A. & Sher, S. (2008). Awareness, loss aversion, and post-decision wagering. Trends in Cognitive Sciences 12, 209–210. No measure is agreed to be the right one. The thresholds in this toy are illustrative, not data.'],
 dur:12,hint:'Change the strength of the evidence, the observer’s caution and their dislike of losing, and see which measures say “aware”.',
 init:()=>({e:1,c:1.5,lam:.5}),
 watch(p){return {e:Math.round(lerp(0,3,smooth(p))*10)/10,c:1.5,lam:.5}},
 ui:[{range:'e',label:'Evidence strength',min:0,max:3,step:.1,get:s=>s.e,act:'e',show:v=>Number(v).toFixed(1)},{range:'c',label:'Caution (criterion)',min:0,max:3,step:.1,get:s=>s.c,act:'c',show:v=>Number(v).toFixed(1)},{range:'lam',label:'Dislike of losing a bet',min:0,max:1.5,step:.1,get:s=>s.lam,act:'lam',show:v=>Number(v).toFixed(1)}],
 on:{e(s,v){s.e=Number(v);return 'keep'},c(s,v){s.c=Number(v);return 'keep'},lam(s,v){s.lam=Number(v);return 'keep'}},
 draw(s){
  const o=K1_toy(s.e,s.c,s.lam),Xe=v=>80+v/3*440;let out=heading('One trial, five verdicts');
  out+=L(80,100,520,100,C.line,3);[0,1,2,3].forEach(v=>out+=L(Xe(v),96,Xe(v),104,C.line,2)+TF(Xe(v),122,String(v),13,C.muted));
  out+=TF(300,56,'internal evidence on this trial (toy units)',13,C.muted)+L(Xe(s.c),70,Xe(s.c),112,C.amber,3)+TF(clamp(Xe(s.c),130,470),78,'says “yes” above this line',13,C.amber)+Ci(Xe(s.e),100,9,C.coral,'#fff');
  const pc=Math.round(o.fc*100),rows=[['Yes/no report',o.yes?'Yes':'No',o.yes],['Confidence, 1 to 4',String(o.conf),o.conf>=3],['Awareness scale (PAS)',K1_PAS[o.pas],o.pas>0],['Bet on own answer',o.high?'High stake':'Low stake',o.high],['Forced-choice accuracy',pc+'%',pc>=60]];
  rows.forEach((r,i)=>{const y=134+i*38;out+=R(20,y,560,32,'#fff',C.grid,8)+T(34,y+21,r[0],13,C.ink,'start')+TB(566,y+21,r[1],13,r[2]?C.green:C.muted,'end')});
  out+=TB(300,350,'A toy observer: the thresholds are illustrative, not data',13,C.muted);
  const aware=rows.filter(r=>r[2]).length;
  return {svg:out,phase:(aware===5?'All five measures agree that the stimulus registered.':aware===0?'All five measures agree that nothing registered.':`${aware} of the 5 measures point to awareness and ${5-aware} do not, for the same internal state.`)+' In this toy the awareness scale follows the evidence itself, while the yes/no report, the confidence rating and the bet also depend on where the criterion sits. Forced-choice accuracy shows what the observer can do, whatever they say.'};
 }});

const K1_RESP=['No, sure','No, guess','Yes, guess','Yes, sure'];
function K1_noise(seed,present,str){const r=rng(seed),g=[];for(let y=0;y<10;y++)for(let x=0;x<10;x++){let v=.5+.17*K1_gauss(r);if(present&&x>=3&&x<=6&&y>=3&&y<=6)v+=.045*str;g.push(clamp(v,0,1))}return g}
// d′ and criterion c from yes/no counts, with the log-linear correction. A response of 2 or 3 counts as “yes”.
function K1_sdt(resp,cut=2){const sig=resp.filter(e=>e.p),noi=resp.filter(e=>!e.p),h=sig.filter(e=>e.r>=cut).length,fa=noi.filter(e=>e.r>=cut).length;
 const H=(h+.5)/(sig.length+1),F=(fa+.5)/(noi.length+1),zH=K1_z(H),zF=K1_z(F);return {nS:sig.length,nN:noi.length,h,fa,H,F,d:zH-zF,c:-(zH+zF)/2}}
// Share correct among confident answers (0 or 3) and among guesses (1 or 2).
function K1_conf(resp){const ok=e=>(e.r>=2)===!!e.p,sure=resp.filter(e=>e.r===0||e.r===3),guess=resp.filter(e=>e.r===1||e.r===2);return {nSure:sure.length,nGuess:guess.length,sure:sure.length?sure.filter(ok).length/sure.length:null,guess:guess.length?guess.filter(ok).length/guess.length:null}}
const K1_SIM=(()=>{const r=rng(1977),o=[];for(let i=0;i<24;i++){const p=i%2,x=K1_gauss(r)+(p?1.5:0);o.push({p,r:x<0?0:x<.75?1:x<1.5?2:3})}return o})();
function K1_detShow(s,ctx){s.phase='show';s.tok++;ctx.later(500,'mask',s.tok)}
SCENE({id:'trusting-reports-detect',name:'Report and confidence',tag:'You take part: a faint patch',
 definition:'A yes/no report mixes two things: how well the observer can tell signal from noise (sensitivity, d′) and how willing they are to say yes (criterion, c). Adding a confidence rating shows a third thing: whether the observer’s confidence tracks their accuracy. All three matter when a report is used as evidence of experience.',
 example:'An observer who says “no” to a faint patch may have seen nothing, or may have seen something too weak to pass a cautious criterion. The answer “no” alone cannot tell these apart, which is why studies of unconscious perception are hard to interpret (era 2).',
 desc:'A square of grey noise appears for half a second; on half the trials a slightly darker patch is hidden in its centre. Four answer buttons run from “No, sure” to “Yes, sure”. Answers are plotted as points in ROC space and scored as d′, criterion, and accuracy when sure against accuracy when guessing.',
 research:['Green, D. M. & Swets, J. A. (1966). Signal Detection Theory and Psychophysics. Wiley. A standard, robust method; Mind In Motion’s signal-detection lesson builds it up step by step.','Confidence usually tracks accuracy but can come apart from it: Fleming, S. M. & Lau, H. C. (2014). How to measure metacognition. Frontiers in Human Neuroscience 8, 443.'],
 dur:12,hint:'Press Start. After each half-second display, answer whether the darker centre patch was there and how sure you are. 24 trials, half with the patch, about a minute. Nothing leaves the page.',
 init:()=>({phase:'idle',i:0,order:[],resp:[],str:3,seed:31,tok:0}),
 watch(p){const n=Math.min(24,Math.floor(p*25));return {phase:n>=24?'done':'ask',i:n%24,order:K1_SIM.map(e=>e.p),resp:K1_SIM.slice(0,n),str:3,seed:5,tok:0,sim:true}},
 ui:[{range:'str',label:'Patch darkness',min:1,max:5,step:1,get:s=>s.str,act:'str'},{b:'Start',act:'go'}],
 on:{str(s,v){s.str=Number(v);return 'keep'},
  go(s,a,ctx){if(s.phase==='show')return 'keep';s.seed=nextSeed();s.order=shuffled(range(24).map(i=>i%2),s.seed);s.i=0;s.resp=[];K1_detShow(s,ctx);return 'keep'},
  mask(s,t){if(Number(t)===s.tok&&s.phase==='show')s.phase='ask';return 'keep'},
  ans(s,v,ctx){if(s.phase!=='show'&&s.phase!=='ask')return 'keep';s.resp.push({p:s.order[s.i],r:Number(v)});s.i++;if(s.i>=24){s.phase='done';return 'keep'}s.phase='gap';s.tok++;ctx.later(450,'again',s.tok);return 'keep'},
  again(s,t,ctx){if(Number(t)===s.tok&&s.phase==='gap')K1_detShow(s,ctx);return 'keep'}},
 draw(s,f,X){
  let out=heading('Was the darker patch there, and how sure are you?');
  const gx=60,gy=50,cz=18,show=s.phase==='show'||s.sim;
  if(show){const g=K1_noise(s.sim?4242:(s.seed%100000)*97+s.i,s.sim?1:s.order[s.i],s.str);g.forEach((v,k)=>{const c=Math.round(255*(1-v));out+=R(gx+(k%10)*cz,gy+Math.floor(k/10)*cz,cz,cz,`rgb(${c},${c},${c})`,'none',0)})}
  else out+=R(gx,gy,180,180,'#c4cbd0','none',0);
  out+=R(gx+3*cz,gy+3*cz,4*cz,4*cz,'none',C.amber,2,'stroke-dasharray="5 4"');
  out+=TF(150,246,s.sim?'a sample display (patch present)':s.phase==='idle'?(X.try?'press Start':''):s.phase==='done'?'finished':`trial ${Math.min(s.i+1,24)} of 24${s.phase==='ask'?' · answer now':''}`,13,C.muted);
  K1_RESP.forEach((t,i)=>out+=K1_key(X,'ans',i,t,24+i*140,256,132,38,t,false,C.blue,13));
  const px=330,py=52,pw=180,ph=150,Xp=v=>px+v*pw,Yp=v=>py+ph-v*ph;out+=R(px,py,pw,ph,'#fff',C.grid,4);
  [0,.5,1].forEach(v=>out+=TF(Xp(v),py+ph+16,String(v),13,C.muted)+TF(px-6,Yp(v)+5,String(v),13,C.muted,'end'));
  out+=TF(px+pw/2,py+ph+33,'false-alarm rate',13,C.muted)+TF(px+pw+8,py+ph/2,'hit rate',13,C.muted,'start')+L(Xp(0),Yp(0),Xp(1),Yp(1),C.line,1.5,'stroke-dasharray="4 4"');
  [.5,1,2].forEach(d=>out+=K1_poly(range(41).map(i=>{const F=i/40;return [Xp(F),Yp(K1_Phi(d+K1_z(Math.max(F,1e-4))))]}),C.green,1.5));out+=TF(Xp(.97),Yp(.05),'curves: d′ = 0.5, 1, 2',13,C.green,'end');
  const st=K1_sdt(s.resp),ok=st.nS>=4&&st.nN>=4,cf=K1_conf(s.resp),col=s.sim?C.blue:C.coral,pc=v=>v===null?'none yet':Math.round(v*100)+'% right';
  if(ok)[3,1,2].forEach(cut=>{const q=K1_sdt(s.resp,cut);out+=Ci(Xp(q.F),Yp(q.H),cut===2?8:5,cut===2?col:'#fff',cut===2?'#fff':col)});
  out+=R(20,302,560,74,'#fff',C.grid,8);
  out+=ok?T(300,322,`hits ${st.h}/${st.nS} · false alarms ${st.fa}/${st.nN}`,13,C.ink)+TB(300,345,`d′ = ${st.d.toFixed(2)} · criterion c = ${st.c.toFixed(2)}`,15,col)+T(300,367,`sure: ${pc(cf.sure)} · guessing: ${pc(cf.guess)}`,13,C.ink):T(300,343,'Scores appear after four trials of each kind',13,C.muted);
  return {svg:out,phase:ok?`${s.sim?'A simulated observer (Watch)':'You'}: d′ ${st.d.toFixed(1)} is the sensitivity, and c is ${st.c>.15?'above 0, a cautious criterion':st.c<-.15?'below 0, a liberal criterion':'near 0, a neutral criterion'}. The large dot is the yes/no split; the small dots are the same answers cut at “sure”. ${cf.sure!==null&&cf.guess!==null?(cf.sure>cf.guess?'Accuracy is higher when sure than when guessing, so confidence carries information here.':'Accuracy is no higher when sure than when guessing, so here confidence says little; with 24 trials that can be chance.'):''}`:'Each answer carries two things: a decision, yes or no, and a confidence. A “no” can mean nothing was seen, or that what was seen fell short of the criterion.'};
 }});
