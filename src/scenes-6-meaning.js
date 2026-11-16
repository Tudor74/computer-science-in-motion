/* ===================== Language era 6 · Meaning and use ===================== */
// Sense and reference, implicature, speech acts, metaphor, colour terms and turn-taking. Where it is short
// and harmless the learner is the participant (scalar implicature, metaphor interference, colour naming,
// predicting the end of a turn); Watch shows a labelled simulated participant. Pictures are pure functions
// of state, frame and X; trial orders use seeded shuffles.
const L6_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const L6_rng=n=>rng(L6_mix(n));
function L6_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const L6_mean=a=>a.length?sum(a)/a.length:NaN;
// Word-wrap a string into lines of at most n characters.
function L6_wrap(s,n){const out=[];let line='';for(const w of String(s).split(' ')){if(line&&(line+' '+w).length>n){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out}
const L6_lines=(x,y,lines,size,col,anchor='middle',lh=18,bold=false)=>lines.map((l,i)=>(bold?TBF:TF)(x,y+i*lh,l,size,col,anchor)).join('');
// A pressable box (a button in Try it, plain in Watch).
function L6_btn(X,act,arg,label,x,y,w,h,text,o={}){
 const lines=Array.isArray(text)?text:[text],lh=o.lh||18;
 const inner=R(x,y,w,h,o.fill||'#fff',o.stroke||C.line,10,o.sel?'stroke-width="3"':'stroke-width="1.5"')+lines.map((t,i)=>(o.bold?TBF:TF)(x+w/2,y+h/2+5+(i-(lines.length-1)/2)*lh,t,o.size||14,o.ink||C.ink)).join('');
 return hit(X,act,arg,label,inner);
}
function L6_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-7,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// A speech bubble with a short tail; lines of text inside.
function L6_bubble(x,y,w,lines,fill,ink,tail='left',size=14,lh=19){
 const h=lines.length*lh+16,tx=tail==='left'?x+22:x+w-22;
 return R(x,y,w,h,fill,'none',12)+P(`M${tx-8} ${y+h-1} L${tx} ${y+h+11} L${tx+8} ${y+h-1} Z`,fill,1,fill)+L6_lines(x+14,y+22,lines,size,ink,'start',lh);
}
const L6_tick=(x,y,ok)=>ok===null?TBF(x,y,'–',17,C.muted):ok?TBF(x,y,'✓',17,C.green):TBF(x,y,'✗',17,C.coral);
const L6_cap=s=>s.charAt(0).toUpperCase()+s.slice(1);

/* ================================================================ reference-sense */
const L6_NAMES=[
 {n:'the Morning Star',g:'Phosphorus',ref:'v',sense:['the brightest point in the','east, just before sunrise']},
 {n:'the Evening Star',g:'Hesperus',ref:'v',sense:['the brightest point in the','west, just after sunset']},
 {n:'Venus',g:'',ref:'v',sense:['the second planet','from the Sun']},
 {n:'Mars',g:'',ref:'m',sense:['the fourth planet','from the Sun']}];
function L6_planet(x,y,ref){return ref==='v'?Ci(x,y,26,'#efd27a','#c79a2a')+Ci(x-8,y-7,7,'#f7e4a8','none'):Ci(x,y,22,'#d9785a','#a8492f')+Ci(x+6,y+5,5,'#b85c40','none')}
SCENE({id:'reference-sense',name:'Sense and reference',tag:'Frege’s Morning Star',
 definition:'Frege distinguished what an expression picks out, its reference, from the way it presents that thing, its sense. Two names can share a reference but differ in sense.',
 example:'“The Morning Star is the Evening Star” is true and informative: it took astronomy to discover that both names pick out Venus. “The Morning Star is the Morning Star” tells you nothing new.',
 desc:'Two names, each linked to its sense (the way it presents its object) and then to the object it refers to, with a verdict on the identity statement “A is B”.',
 research:'Frege, G. (1892). Über Sinn und Bedeutung (On sense and reference). Zeitschrift für Philosophie und philosophische Kritik 100, 25–50.',
 dur:10,hint:'Choose the two names. Same object with different senses gives a true and informative statement; the same name twice is trivially true.',
 init:()=>({a:0,b:1}),
 watch(p){const pairs=[[0,0],[0,1],[1,2],[0,3]],k=Math.min(3,Math.floor(p*4));return {a:pairs[k][0],b:pairs[k][1]}},
 ui:[{choose:L6_NAMES.map((n,i)=>[String(i),L6_cap(n.n)]),label:'Name A',get:s=>String(s.a),act:'a'},{choose:L6_NAMES.map((n,i)=>[String(i),L6_cap(n.n)]),label:'Name B',get:s=>String(s.b),act:'b'}],
 on:{a(s,v){s.a=Number(v);return 'keep'},b(s,v){s.b=Number(v);return 'keep'}},
 draw(s){
  const A=L6_NAMES[s.a],B=L6_NAMES[s.b],same=A.ref===B.ref;
  let out=heading(`“${L6_cap(A.n)} is ${B.n}”`,28);
  const col=[[150,A,C.blue,'A'],[450,B,C.purple,'B']];
  const px=same?[300,300]:[150,450];
  col.forEach(([x,N,c,lab],i)=>{
   out+=R(x-115,46,230,48,'#fff',c,10,'stroke-width="2"')+TBF(x,68,L6_cap(N.n),16,c)+TF(x,86,N.g?`(Greek: ${N.g})`:`name ${lab}`,13,C.muted);
   out+=arrow(x,96,x,118,C.line,2,8);
   out+=R(x-115,120,230,56,C.pale,'none',10)+TF(x-104,139,'sense:',13,C.muted,'start')+L6_lines(x,154,N.sense,13,C.ink,'middle',16);
   out+=arrow(x,178,px[i]+(same?(i?14:-14):0),214,c,2.2,9);
  });
  if(same)out+=L6_planet(300,240,A.ref)+TBF(300,286,'reference: Venus',15,C.ink);
  else{out+=L6_planet(150,240,A.ref)+L6_planet(450,240,B.ref)+TBF(150,286,'reference: '+(A.ref==='v'?'Venus':'Mars'),15,C.ink)+TBF(450,286,'reference: '+(B.ref==='v'?'Venus':'Mars'),15,C.ink)}
  let v;
  if(s.a===s.b)v=['Trivially true (a = a)','True by logic alone: you learn nothing about the sky.',C.muted,C.grid];
  else if(same)v=['True and informative (a = b)','Same reference, different senses: finding it out took observation.',C.green,C.greenp];
  else v=['False','Different references: the two names pick out different planets.',C.coral,C.coralp];
  out+=R(40,302,520,64,v[3],'none',10)+TBF(300,327,v[0],16,v[2])+TF(300,350,v[1],14,C.ink);
  return {svg:out,phase:same&&s.a!==s.b?'Both names lead to Venus, so the statement is true; but the senses differ, so knowing it was a discovery. Frege’s question was how “a = b” can tell us something that “a = a” cannot.':s.a===s.b?'An identity between a name and itself is true whatever the world is like, so it carries no news.':'The names have different references, so the identity is false.'};
 }});

const L6_PAIRS={
 stars:{names:['Hesperus','Phosphorus'],who:'An early stargazer',pred:'appears in the evening',note:'Hesperus and Phosphorus are both Venus, but the stargazer has not yet discovered this.'},
 lois:{names:['Superman','Clark Kent'],who:'Lois Lane',pred:'can fly',note:'Superman and Clark Kent are the same person, but Lois does not know it.'}};
const L6_CTX=[['plain','Plain statement'],['believes','“… believes that …”'],['knows','“… knows that …”']];
function L6_subSentence(pair,ctx,name){const P_=L6_PAIRS[pair];return ctx==='plain'?`${name} ${P_.pred}.`:`${P_.who} ${ctx==='believes'?'believes':'knows'} that ${name} ${P_.pred}.`}
SCENE({id:'reference-sense-substitution',name:'Swapping co-referring names',tag:'When substitution fails',
 definition:'In ordinary sentences you can swap one name for another name of the same thing without changing whether the sentence is true. Inside reports of belief or knowledge this can fail; such contexts are called opaque.',
 example:'Superman can fly, so Clark Kent can fly. But “Lois believes Superman can fly” is true while “Lois believes Clark Kent can fly” is false.',
 desc:'The same sentence with each of two co-referring names, in a plain statement or inside a belief or knowledge report, with the truth value of each version.',
 research:'Frege, G. (1892). On sense and reference: in reported speech and belief, words refer to their ordinary sense. Quine, W. V. O. (1956). Quantifiers and propositional attitudes. Journal of Philosophy 53, 177–187.',
 dur:9,hint:'Choose the pair of names and the context. In a plain statement both versions agree; inside “believes that” they can come apart.',
 init:()=>({pair:'stars',ctx:'believes'}),
 watch(p){const k=Math.min(5,Math.floor(p*6));return {pair:k<3?'stars':'lois',ctx:L6_CTX[k%3][0]}},
 ui:[{choose:[['stars','Hesperus / Phosphorus'],['lois','Superman / Clark Kent']],label:'Names',get:s=>s.pair,act:'pair'},{choose:L6_CTX,label:'Context',get:s=>s.ctx,act:'ctx'}],
 on:{pair(s,v){s.pair=v;return 'keep'},ctx(s,v){s.ctx=v;return 'keep'}},
 draw(s){
  const P_=L6_PAIRS[s.pair];let out=heading('Swap one name for another name of the same thing',28);
  out+=R(60,44,480,40,C.pale,'none',10)+TF(300,69,`Fact: ${P_.names[0]} is ${P_.names[1]}. Same ${s.pair==='stars'?'planet':'person'}, two names.`,15,C.ink);
  const truth=[true,s.ctx==='plain'];
  P_.names.forEach((nm,i)=>{const y=104+i*96,lines=L6_wrap(L6_subSentence(s.pair,s.ctx,nm),44);
   out+=R(40,y,400,80,'#fff',C.grid,10)+TF(54,y+22,i?'swapped':'original',13,C.muted,'start')+L6_lines(54,y+44,lines,15,C.ink,'start',20);
   const t=truth[i];out+=R(456,y+18,104,44,t?C.greenp:C.coralp,'none',10)+TBF(508,y+46,t?'true':'false',17,t?C.green:C.coral);
  });
  out+=arrow(240,186,240,198,C.line,2,7);
  const ok=s.ctx==='plain';
  out+=R(40,296,520,72,ok?C.greenp:C.amberp,'none',10);
  out+=L6_lines(300,320,L6_wrap(ok?'Plain statement: swapping names of the same thing keeps the truth value (Leibniz’s law: what is true of a thing is true of it under any name).':'Inside “'+(s.ctx==='believes'?'believes':'knows')+' that”, the swap changes the truth value. Frege’s answer: here the names stand for their senses, and the two senses differ.',70),13,C.ink,'middle',18);
  return {svg:out,phase:ok?'Outside belief reports, co-referring names can be swapped freely.':P_.note+' What someone believes depends on how a thing is presented to them, not only on which thing it is.'};
 }});

const L6_WORLDS=[['none','No King of France (as in 1905)'],['bald','One king, bald'],['hairy','One king, not bald'],['two','Two rival kings']];
function L6_kingHead(x,y,bald){let o=Ci(x,y,20,'#f1d2b6','#b88a65');if(!bald)o+=P(`M${x-19} ${y-4} Q${x} ${y-34} ${x+19} ${y-4}`,'#5a3a22',6);o+=P(`M${x-16} ${y-24} L${x-16} ${y-40} L${x-8} ${y-30} L${x} ${y-42} L${x+8} ${y-30} L${x+16} ${y-40} L${x+16} ${y-24} Z`,'#c79100',1.5,'#f2c84b');return o}
SCENE({id:'reference-sense-descriptions',name:'The present King of France',tag:'Russell against Strawson',
 definition:'A definite description, “the so-and-so”, seems to name one thing. Russell analysed it as a hidden claim that exactly one such thing exists; Strawson replied that it presupposes this, so if nothing fits, the sentence is neither true nor false.',
 example:'“The present King of France is bald”: for Russell, false, because there is no king; for Strawson, the question of truth does not arise.',
 desc:'A small world with zero, one or two kings, the three parts of Russell’s analysis checked one by one, and the verdicts of Russell and Strawson side by side.',
 research:'Russell, B. (1905). On denoting. Mind 14, 479–493. Strawson, P. F. (1950). On referring. Mind 59, 320–344. Experiments find people’s judgements vary with the sentence: Abrusán & Szendrői (2013), Semantics and Pragmatics 6.',
 dur:10,hint:'Choose the world. Russell and Strawson agree when there is exactly one king; they disagree when there is none or more than one.',
 init:()=>({w:'none'}),
 watch(p){return {w:L6_WORLDS[Math.min(3,Math.floor(p*4))][0]}},
 ui:[{choose:L6_WORLDS,label:'The world',get:s=>s.w,act:'w'}],
 on:{w(s,v){s.w=v;return 'keep'}},
 draw(s){
  let out=heading('“The present King of France is bald.”',28);
  const n=s.w==='none'?0:s.w==='two'?2:1,bald=s.w==='bald';
  out+=R(30,46,180,170,C.pale,'none',12)+TF(120,66,'the world',13,C.muted);
  if(n===0)out+=TF(120,138,'no king at all',15,C.ink)+TF(120,158,'(France is a republic)',13,C.muted);
  else if(n===1)out+=L6_kingHead(120,140,bald)+TF(120,190,bald?'bald':'a full head of hair',13,C.ink);
  else out+=L6_kingHead(85,140,true)+L6_kingHead(155,140,false)+TF(120,190,'two claimants',13,C.ink);
  const ex=n>=1,un=n===1?true:n===2?false:null,bd=n===1?bald:null;
  const rows=[['1. A present King of France exists',ex],['2. There is only one',ex?un:null],['3. He is bald',bd]];
  out+=TF(240,66,'Russell: the sentence says three things at once',13,C.muted,'start');
  rows.forEach(([t,ok],i)=>{const y=80+i*44;out+=R(236,y,334,36,'#fff',C.grid,8)+TF(250,y+23,t,14,C.ink,'start')+L6_tick(548,y+24,ok)});
  const rT=ex&&un&&bd,sNull=n!==1;
  const vb=(x,title,val,col,fill,sub)=>R(x,236,255,128,fill,'none',12)+TBF(x+127,262,title,15,C.ink)+TBF(x+127,296,val,20,col)+L6_lines(x+127,322,L6_wrap(sub,32),13,C.ink,'middle',17);
  out+=vb(30,'Russell (1905)',rT?'true':'false',rT?C.green:C.coral,rT?C.greenp:C.coralp,rT?'All three parts hold.':!ex?'Part 1 fails, so the whole claim is false.':!un?'Part 2 fails: “the” king is not unique.':'Part 3 fails: he is not bald.');
  out+=vb(315,'Strawson (1950)',sNull?'neither':rT?'true':'false',sNull?C.amber:rT?C.green:C.coral,sNull?C.amberp:rT?C.greenp:C.coralp,sNull?'The sentence presupposes exactly one king; that fails, so no truth value.':'The presupposition holds, so ask only whether he is bald.');
  return {svg:out,phase:sNull?'Here the theories part company. Russell keeps every sentence true or false; Strawson says the speaker has failed to refer. Asked directly, people often answer “that’s not true” or “there is no king of France” rather than plain “false”.':'With exactly one king, both analyses give the same answer.'};
 }});

/* ================================================================ implicature */
const L6_MAXIMS=[['Quantity',['as informative as','needed, no more']],['Quality',['say only what','you believe true']],['Relation',['be','relevant']],['Manner',['be clear, brief','and orderly']]];
const L6_GRICE=[
 {t:'Out of petrol',a:'I am out of petrol.',b:'There is a garage round the corner.',m:'Relation',how:'observed',imp:'The garage is open and sells petrol, as far as B knows.',why:'B’s reply is only relevant if the garage can help.'},
 {t:'A reference letter',a:'Is X a good candidate for a post in philosophy?',b:'X’s command of English is excellent, and his attendance at tutorials has been regular.',m:'Quantity',how:'flouted',imp:'X is not good at philosophy.',why:'A referee would say more if there were good things to say, so the gap is the message.'},
 {t:'Where does C live?',a:'Where does C live?',b:'Somewhere in the South of France.',m:'Quantity',how:'in tension with Quality',imp:'B does not know exactly where C lives.',why:'Saying more would break Quality (say only what you know), so B says as much as they can.'},
 {t:'Irony',a:'(X has just told everyone B’s secret.)',b:'X is a fine friend.',m:'Quality',how:'flouted',imp:'X is a poor friend.',why:'Both know the words are false, so B must mean something else, here the opposite.'},
 {t:'A concert review',a:'How did Miss X sing?',b:'Miss X produced a series of sounds that corresponded closely with the score of “Home Sweet Home”.',m:'Manner',how:'flouted',imp:'Her singing was very poor.',why:'The long-winded wording avoids the simple word “sang”, which suggests that word would not fit.'}];
SCENE({id:'implicature',name:'Conversational implicature',tag:'Grice’s maxims',
 definition:'An implicature is something a speaker means beyond what the words say. Grice explained it by a cooperative principle: listeners assume the speaker is being informative, truthful, relevant and clear, and read the gaps accordingly.',
 example:'“There is a garage round the corner”, said to someone out of petrol, means the garage is probably open and sells petrol, although the sentence says neither.',
 desc:'Five of Grice’s own examples: a question, a reply, the maxim the reply relies on or flouts, and what it implicates.',
 research:'Grice, H. P. (1975). Logic and conversation. In Cole & Morgan (eds), Syntax and Semantics 3: Speech Acts, 41–58. Academic Press (all five examples are Grice’s).',
 dur:12,hint:'Choose an exchange and work out what B means before pressing Reveal.',
 init:()=>({i:0,show:false}),
 watch(p){const k=Math.min(4,Math.floor(p*5));return {i:k,show:(p*5-k)>.35}},
 ui:[{choose:L6_GRICE.map((g,i)=>[String(i),g.t]),label:'Exchange',get:s=>String(s.i),act:'i'},{b:'Reveal the implicature',act:'show'}],
 on:{i(s,v){s.i=Number(v);s.show=false;return 'keep'},show(s){s.show=!s.show;return 'keep'}},
 draw(s){
  const g=L6_GRICE[s.i];let out=heading(g.t,28);
  const la=L6_wrap(g.a,48),lb=L6_wrap(g.b,48);
  out+=TBF(34,62,'A',15,C.blue,'start')+L6_bubble(54,44,420,la,C.pale,C.ink,'left');
  const yb=44+la.length*19+16+22;
  out+=TBF(566,yb+18,'B',15,C.purple,'end')+L6_bubble(126,yb,420,lb,C.purplep,C.ink,'right');
  const ym=218;
  L6_MAXIMS.forEach(([n,d],i)=>{const x=30+i*137,on=n===g.m&&s.show;
   out+=R(x,ym,128,58,on?(g.how==='observed'?C.greenp:C.amberp):'#fff',on?(g.how==='observed'?C.green:C.amber):C.grid,10,'stroke-width="2"')+TBF(x+64,ym+20,n,14,on?C.ink:C.muted)+L6_lines(x+64,ym+38,d,13,C.muted,'middle',15);
   if(on)out+=TBF(x+64,ym+76,g.how,13,g.how==='observed'?C.green:C.amber);
  });
  if(s.show)out+=R(30,306,540,62,'#fff',C.blue,10,'stroke-width="2"')+TBF(44,329,'Implicated: '+g.imp,15,C.blue,'start')+TF(44,352,g.why,13,C.ink,'start');
  else out+=R(30,306,540,62,C.pale,'none',10)+TF(300,342,'What does B mean, beyond what the words say?',15,C.muted);
  return {svg:out,phase:s.show?`B relies on the maxim of ${g.m} (${g.how}). ${g.why}`:'Think first: what would make B’s reply a sensible, cooperative answer?'};
 }});

const L6_SOME=[
 {s:'Some elephants have trunks.',c:'under'},{s:'Some birds have wings.',c:'under'},{s:'Some cats are mammals.',c:'under'},{s:'Some triangles have three sides.',c:'under'},
 {s:'Some dogs have spots.',c:'true'},{s:'Some cars are red.',c:'true'},{s:'Some flowers are yellow.',c:'true'},{s:'Some people wear glasses.',c:'true'},
 {s:'Some elephants have wings.',c:'false'},{s:'Some stones can sing.',c:'false'},{s:'Some fish are made of glass.',c:'false'},{s:'Some chairs are alive.',c:'false'}];
function L6_someSim(n){const o=shuffled(range(12),L6_mix(61)),r=L6_rng(62),d=[];for(let k=0;k<n;k++){const it=L6_SOME[o[k]];let ans=it.c==='false'?'F':'T';if(it.c==='under'&&k%4!==1)ans='F';const rt=it.c==='under'?(ans==='F'?1.55:1.15):1.05;d.push({c:it.c,ans,rt:Math.max(.45,rt+.18*L6_gauss(r))})}return d}
SCENE({id:'implicature-scalar',name:'“Some” and “not all”',tag:'A judgement experiment',
 definition:'A scalar implicature arises when a speaker uses a weaker word on a scale (some) and the listener infers that the stronger word (all) does not apply. Logically “some” is compatible with “all”; pragmatically it suggests “not all”.',
 example:'“Some elephants have trunks” is true in logic, since every elephant does, but it sounds wrong: the speaker should have said “all”.',
 desc:'Twelve sentences shown one at a time, judged True or False as fast as possible. Four are true but under-informative; the rest are ordinary true or false controls. Your share of “False” answers to the under-informative ones, and your response times, are drawn beside the published results.',
 research:'Noveck, I. A. (2001). When children are more logical than adults. Cognition 78, 165–188 (adults accepted under-informative “some” 41% of the time). Bott, L. & Noveck, I. A. (2004). Some utterances are underinformative: the onset and time course of scalar inferences. Journal of Memory and Language 51, 437–457 (“false” answers were slower).',
 dur:12,hint:'Press Start, then judge each sentence True or False as fast as you can. Twelve sentences in a seeded order. Your answers stay in this page.',
 init:()=>({seed:6,phase:'idle',i:0,order:[],data:[],tok:0}),
 watch(p){const n=Math.min(12,Math.floor(p*13)),o=shuffled(range(12),L6_mix(61));return {seed:6,phase:n>=12?'done':'run',i:n,order:o,data:L6_someSim(n),sim:true}},
 ui:[{b:'Start',act:'start'},{b:'True',act:'ans',arg:'T'},{b:'False',act:'ans',arg:'F'},{b:'Start again',act:'again'}],
 on:{start(s){if(s.phase==='run'||s.phase==='gap')return 'keep';s.order=shuffled(range(12),L6_mix(s.seed));s.i=0;s.data=[];s.phase='run';s.t0=performance.now();return 'keep'},
  ans(s,v,ctx){if(s.phase!=='run')return 'keep';const rt=(performance.now()-s.t0)/1000;s.data.push({c:L6_SOME[s.order[s.i]].c,ans:v,rt});s.i++;if(s.i>=12){s.phase='done';return 'keep'}s.phase='gap';s.tok++;ctx.later(400,'next',s.tok);return 'keep'},
  next(s,t){if(Number(t)!==s.tok||s.phase!=='gap')return 'keep';s.phase='run';s.t0=performance.now();return 'keep'},
  again(s){s.seed=nextSeed();s.phase='idle';s.i=0;s.data=[];s.order=[];s.tok++;return 'keep'}},
 draw(s){
  let out=heading('True or false? Answer as fast as you can',26);
  out+=R(30,42,540,84,s.phase==='run'?'#fff':C.pale,s.phase==='run'?C.blue:'none',12,'stroke-width="2"');
  if(s.phase==='idle')out+=TF(300,78,'Press Start. Each sentence appears here; press True or False.',15,C.ink)+TF(300,102,'Judge by the facts of the world.',14,C.muted);
  else if(s.phase==='run'||s.phase==='gap'){const it=L6_SOME[s.order[s.i]];out+=TF(560,60,`${s.i+1} / 12`,13,C.muted,'end');if(s.phase==='run'&&it)out+=TB(300,94,it.s,22,C.ink);if(s.sim)out+=TF(40,60,'simulated participant',13,C.purple,'start')}
  else out+=TBF(300,80,'Done: twelve sentences judged',16,C.green)+TF(300,104,'Press Start again for a new order.',14,C.ink);
  const under=s.data.filter(d=>d.c==='under'),ctrl=s.data.filter(d=>d.c!=='under');
  const fShare=under.length?under.filter(d=>d.ans==='F').length/under.length:NaN;
  const pl=L6_plot(70,160,200,150,[0,2],[0,100],{yt:[[0,'0%'],[50,'50%'],[100,'100%']],yl:'“False” to under-informative “some”'});
  out+=pl.svg;
  const bar=(i,v,col,lab)=>{const x=pl.X(i+.5);return (isFinite(v)?R(x-28,pl.Y(v),56,pl.Y(0)-pl.Y(v),col,'none',4)+TBF(x,pl.Y(v)-6,Math.round(v)+'%',14,col):TF(x,pl.Y(0)-10,'–',14,C.muted))+TF(x,327,lab,13,C.ink)};
  out+=bar(0,fShare*100,s.sim?C.purple:C.blue,s.sim?'simulated':'you')+bar(1,59,C.coral,'adults, 2001');
  const rtOf=(arr,a)=>L6_mean(arr.filter(d=>d.ans===a).map(d=>d.rt));
  const rows=[['“some”: answered False',rtOf(under,'F'),C.coral],['“some”: answered True',rtOf(under,'T'),C.blue],['control sentences',L6_mean(ctrl.filter(d=>(d.c==='true')===(d.ans==='T')).map(d=>d.rt)),C.green]];
  out+=TF(330,166,'Mean response time (seconds)',13,C.muted,'start');
  const sx=v=>330+clamp(v,0,3)/3*230;
  out+=L(330,286,560,286,C.line,1.5);[0,1,2,3].forEach(v=>out+=L(sx(v),286,sx(v),291,C.line,1)+TF(sx(v),306,v+' s',13,C.muted));
  rows.forEach(([t,v,c],i)=>{const y=190+i*32;out+=TF(330,y,t,13,C.ink,'start');if(isFinite(v))out+=R(330,y+5,sx(v)-330,10,c,'none',3)+TF(sx(v)+6,y+15,v.toFixed(2),13,c,'start');else out+=TF(330,y+16,'no answers yet',13,C.muted,'start')});
  const errs=ctrl.filter(d=>(d.c==='true')!==(d.ans==='T')).length;
  out+=TF(300,350,s.data.length?`Errors on control sentences: ${errs} of ${ctrl.length}.`:'Results appear as you answer.',13,C.muted)+TF(300,368,'Bott & Noveck (2004): “False” answers to under-informative “some” were slower.',13,C.muted);
  return {svg:out,phase:'Answering False to “Some elephants have trunks” means you computed “not all”. In Noveck’s study most adults did so, while children aged about 8 to 10 mostly said True; the inference takes extra time, which is one reason it is thought to be added after the literal meaning.'};
 }});

const L6_SCALES=[
 {n:'some < most < all',w:['some','most','all'],f:w=>`${L6_cap(w)} of the guests left`,canc:'in fact, all of them did',deny:['in fact, none of them did','in fact, only a few did','in fact, one guest stayed']},
 {n:'warm < hot',w:['warm','hot'],f:w=>`The soup is ${w}`,canc:'in fact, it is hot',deny:['in fact, it is cold','in fact, it is not even warm']},
 {n:'possible < likely < certain',w:['possible','likely','certain'],f:w=>`Rain is ${w} tomorrow`,canc:'in fact, it is certain',deny:['in fact, it cannot happen','in fact, it is very unlikely','in fact, it might not rain']},
 {n:'or < and',w:['or','and'],f:w=>`You can have cake ${w} ice cream`,canc:'in fact, you can have both',deny:['in fact, you can have neither','in fact, you can only have one']}];
SCENE({id:'implicature-cancel',name:'Cancelling an implicature',tag:'Horn scales',
 definition:'Words like some, most, all form a scale of strength. Using a weaker word entails the weaker claim and implicates that the stronger ones do not hold. An implicature can be cancelled without contradiction; an entailment cannot.',
 example:'“Some of the guests left; in fact, all of them did” is fine. “Some of the guests left; in fact, none of them did” contradicts itself.',
 desc:'A scale drawn from weak to strong. Press a word to choose it; the weaker words are entailed and the stronger ones implicated to be false. Add a clause that cancels the implicature or one that denies the entailment.',
 research:'Horn, L. R. (1972). On the semantic properties of logical operators in English. PhD thesis, UCLA. Grice (1975) on cancellability. Levinson, S. C. (2000). Presumptive Meanings. MIT Press.',
 dur:10,hint:'Choose a scale, press a word on it, then choose what to add. Cancelling the implicature is fine; denying the entailment is not.',
 init:()=>({sc:0,w:0,mode:'none'}),
 watch(p){const k=Math.min(5,Math.floor(p*6));return {sc:k<3?0:1,w:0,mode:['none','cancel','deny'][k%3]}},
 ui:[{choose:L6_SCALES.map((c,i)=>[String(i),c.n]),label:'Scale',get:s=>String(s.sc),act:'sc'},{choose:[['none','Say it plainly'],['cancel','Cancel the implicature'],['deny','Deny what it entails']],label:'Add',get:s=>s.mode,act:'mode'}],
 on:{sc(s,v){s.sc=Number(v);s.w=0;return 'keep'},w(s,v){s.w=Number(v);return 'keep'},mode(s,v){s.mode=v;return 'keep'}},
 draw(s,f,X){
  const sc=L6_SCALES[s.sc],n=sc.w.length,w=sc.w[s.w];let out=heading('Weak ← scale → strong',28);
  const bw=Math.min(150,440/n),x0=300-(n*bw+(n-1)*20)/2;
  out+=arrow(x0-10,138,x0+n*bw+(n-1)*20+10,138,C.line,2,9);
  sc.w.forEach((ww,i)=>{const x=x0+i*(bw+20),sel=i===s.w,col=sel?C.blue:i<s.w?C.green:C.coral;
   out+=L6_btn(X,'w',i,`Choose “${ww}”`,x,56,bw,56,ww,{sel,bold:true,size:17,ink:col,stroke:sel?C.blue:C.line,fill:sel?C.pale:'#fff'});
   out+=TF(x+bw/2,162,sel?'said':i<s.w?'entailed ✓':`implicated: not “${ww}”`,13,col);
  });
  const strongest=s.w===n-1;let clause='',verdict,col,fill;
  if(s.mode==='none'){verdict=strongest?'Nothing stronger on the scale, so nothing is implicated.':`Says at least “${w}”; implicates “not ${sc.w.slice(s.w+1).join(', not ')}”.`;col=C.ink;fill=C.pale}
  else if(s.mode==='cancel'){if(strongest){verdict='The strongest word has no implicature to cancel.';col=C.muted;fill=C.pale}else{clause=sc.canc;verdict='Fine: the implicature is cancelled without contradiction.';col=C.green;fill=C.greenp}}
  else{clause=sc.deny[s.w];verdict='Contradiction: what a word entails cannot be cancelled.';col=C.coral;fill=C.coralp}
  const sent=sc.f(w)+(clause?'; '+clause:'')+'.';
  out+=R(40,190,520,70,'#fff',C.grid,10)+L6_lines(300,220,L6_wrap('“'+sent+'”',52),17,C.ink,'middle',22);
  out+=R(40,282,520,70,fill,'none',10)+L6_lines(300,312,L6_wrap(verdict,62),15,col,'middle',20,true);
  return {svg:out,phase:'The test for an implicature is whether you can cancel it without contradicting yourself. “Some, in fact all” passes; “some, in fact none” fails, because “some” entails “at least one”.'};
 }});

/* ================================================================ speech-acts */
const L6_PERF={
 ship:{u:'I name this ship the Queen Elizabeth.',c:['Said by the person appointed to name it, at the launch','The bottle is smashed and the words completed','Said in good faith, meaning the ship to bear the name']},
 promise:{u:'I promise to return your book tomorrow.',c:['Said to someone who wants the book back','The hearer hears and understands it','The speaker really intends to return it']},
 bet:{u:'I bet you sixpence it will rain tomorrow.',c:['Said before anyone knows tomorrow’s weather','The hearer takes the bet: “Done!”','The speaker means to pay if they lose']},
 wedding:{u:'I do.',c:['Both free to marry, before an authorised officiant','The ceremony is carried through to the end','Both mean to keep their vows']}};
const L6_PK=[['ship','Naming a ship'],['promise','Promising'],['bet','Betting'],['wedding','Marrying']];
SCENE({id:'speech-acts',name:'Doing things with words',tag:'Austin’s performatives',
 definition:'Some utterances do not describe an action; they are the action. Saying “I promise” promises, “I name this ship” names it. Austin called these performatives: they are not true or false but happy or unhappy, depending on felicity conditions.',
 example:'If a passer-by grabs the bottle and says “I name this ship the Generalissimo Stalin”, the ship is not named: the act misfires.',
 desc:'A performative utterance and its three groups of conditions. Switch each condition on or off to see whether the act succeeds, misfires (nothing happens) or is abused (it happens, but insincerely).',
 research:'Austin, J. L. (1962). How to Do Things with Words (William James Lectures, 1955). Oxford University Press. The ship and the bet are Austin’s own examples.',
 dur:12,hint:'Choose an act, then press each condition to switch it. A and B failures make the act void; a C failure leaves it done but insincere.',
 init:()=>({k:'ship',c:[1,1,1]}),
 watch(p){const seq=[[1,1,1],[0,1,1],[1,0,1],[1,1,0]],j=Math.min(3,Math.floor(p*4));return {k:'ship',c:seq[j]}},
 ui:[{choose:L6_PK,label:'Act',get:s=>s.k,act:'k'},{b:'All conditions met',act:'all'}],
 on:{k(s,v){s.k=v;s.c=[1,1,1];return 'keep'},c(s,v){const i=Number(v);s.c=s.c.slice();s.c[i]=s.c[i]?0:1;return 'keep'},all(s){s.c=[1,1,1];return 'keep'}},
 draw(s,f,X){
  const P_=L6_PERF[s.k];let out=heading('Saying it is doing it',26);
  out+=L6_bubble(100,38,400,L6_wrap(`“${P_.u}”`,40),C.pale,C.ink,'left',15,19);
  const grp=[['A','Right person, right circumstances'],['B','Carried out correctly and completely'],['C','Sincere, and followed through']];
  grp.forEach(([g,t],i)=>{const y=112+i*56,on=!!s.c[i];
   const inner=R(40,y,520,48,on?'#fff':C.coralp,on?C.grid:C.coral,10,'stroke-width="1.5"')+R(54,y+12,24,24,on?C.green:'#fff',on?C.green:C.coral,6)+(on?TBF(66,y+30,'✓',15,'#fff'):'')+TBF(92,y+20,g+'. '+t,13,C.muted,'start')+TF(92,y+39,P_.c[i],14,C.ink,'start');
   out+=hit(X,'c',i,`Condition ${g}: ${on?'met':'not met'}. Press to switch.`,inner);
  });
  let res;
  if(!s.c[0]||!s.c[1])res=['Misfire: the act is void','Nothing has been '+(s.k==='ship'?'named':s.k==='promise'?'promised':s.k==='bet'?'bet':'married')+'. Austin: the procedure was '+(!s.c[0]?'invoked by the wrong person or in the wrong circumstances.':'not carried through.'),C.coral,C.coralp];
  else if(!s.c[2])res=['Abuse: done, but hollow','The act happened, but insincerely. The speaker is still bound by it.',C.amber,C.amberp];
  else res=['Happy: the act is done','Saying the words, in these circumstances, performed the act.',C.green,C.greenp];
  out+=R(40,282,520,84,res[3],'none',10)+TBF(300,310,res[0],17,res[2])+L6_lines(300,334,L6_wrap(res[1],66),14,C.ink,'middle',19);
  return {svg:out,phase:'A performative is not true or false; it succeeds or fails. Austin later argued that every utterance does something, including plain statements, which led to the general theory of speech acts.'};
 }});

const L6_IND=[
 {u:'Can you pass the salt?',form:'Question (interrogative sentence)',ctx:[{n:'At the dinner table',act:'Request',eff:'The salt is passed to the speaker.',note:'Nobody answers “Yes, I can” and sits still: a question about ability works as a polite request.'},{n:'At a physiotherapy check-up',act:'Question',eff:'The patient tries, and reports.',note:'Here it really is a question about whether the arm can do it.'}]},
 {u:'It’s cold in here.',form:'Statement (declarative sentence)',ctx:[{n:'Said to someone by an open window',act:'Request',eff:'The window is closed.',note:'Stating a reason for an action can stand in for asking for it.'},{n:'Small talk on coming indoors',act:'Statement',eff:'Agreement and chat.',note:'Here it simply reports how it feels.'}]},
 {u:'I’ll be there at eight.',form:'Statement (declarative sentence)',ctx:[{n:'Answering “Will you come tonight?”',act:'Promise',eff:'The hearer counts on it.',note:'The speaker commits to a future action: a commissive.'},{n:'Reading out a bus timetable',act:'Prediction',eff:'The hearer plans around it.',note:'No commitment by the speaker: an assertion about the future.'}]},
 {u:'Would you mind closing the door?',form:'Question (interrogative sentence)',ctx:[{n:'A teacher to a pupil',act:'Request',eff:'The door is closed.',note:'Very indirect wording softens the imposition; Brown & Levinson call this negative politeness.'},{n:'A survey on office preferences',act:'Question',eff:'An honest yes or no.',note:'Here the speaker really wants to know.'}]}];
SCENE({id:'speech-acts-indirect',name:'Indirect speech acts',tag:'Saying one thing, doing another',
 definition:'In an indirect speech act the form of a sentence (question, statement) and the act it performs (request, promise) come apart. Austin separated the locution (what is said), the illocution (the act performed in saying it) and the perlocution (its effect).',
 example:'“Can you pass the salt?” is a question in form but, at dinner, a request in force.',
 desc:'An utterance in two contexts, with its three layers: the sentence form, the act it performs in that context, and the effect it aims at.',
 research:'Searle, J. R. (1975). Indirect speech acts. In Cole & Morgan (eds), Syntax and Semantics 3, 59–82. Austin (1962) on locution, illocution and perlocution. Brown, P. & Levinson, S. C. (1987). Politeness: Some Universals in Language Usage. Cambridge University Press.',
 dur:12,hint:'Choose an utterance, then press one of the two contexts. The words stay the same; the act changes.',
 init:()=>({i:0,c:0}),
 watch(p){const k=Math.min(7,Math.floor(p*8));return {i:k>>1,c:k%2}},
 ui:[{choose:L6_IND.map((d,i)=>[String(i),d.u]),label:'Utterance',get:s=>String(s.i),act:'i'}],
 on:{i(s,v){s.i=Number(v);s.c=0;return 'keep'},c(s,v){s.c=Number(v);return 'keep'}},
 draw(s,f,X){
  const d=L6_IND[s.i],c=d.ctx[s.c];let out=heading(`“${d.u}”`,30);
  d.ctx.forEach((cx,i)=>out+=L6_btn(X,'c',i,'Context: '+cx.n,40+i*270,46,250,44,L6_wrap(cx.n,30),{sel:i===s.c,stroke:i===s.c?C.blue:C.line,fill:i===s.c?C.pale:'#fff',size:14,lh:17}));
  const layers=[['Locution','what is said',d.form,C.muted],['Illocution','the act performed',c.act,C.blue],['Perlocution','the effect aimed at',c.eff,C.purple]];
  layers.forEach(([n,sub,v,col],i)=>{const y=110+i*62;out+=R(40,y,520,52,'#fff',C.grid,10)+TBF(56,y+23,n,15,col,'start')+TF(56,y+42,sub,13,C.muted,'start')+TBF(230,y+33,v,16,C.ink,'start')});
  out+=R(40,302,520,64,c.act==='Question'||c.act==='Statement'||c.act==='Prediction'?C.pale:C.amberp,'none',10)+L6_lines(300,326,L6_wrap(c.note,66),14,C.ink,'middle',19);
  return {svg:out,phase:'The same words can perform different acts. Listeners use context and shared knowledge to recover the act; indirect requests are often more polite because they leave the hearer room to refuse.'};
 }});

const L6_SEARLE=[
 ['assertive','Assertive',['words fit','the world'],C.blue],
 ['directive','Directive',['hearer makes the','world fit words'],C.purple],
 ['commissive','Commissive',['speaker makes the','world fit words'],C.green],
 ['expressive','Expressive',['no fit:','a feeling'],C.amber],
 ['declaration','Declaration',['saying it','makes it so'],C.coral]];
const L6_SORT=[
 ['It is raining in Leeds.','assertive'],['The meeting starts at nine.','assertive'],['Please close the window.','directive'],['Could you check this for me?','directive'],
 ['I promise I’ll call you.','commissive'],['I’ll pay you back on Friday.','commissive'],['Thank you so much for coming.','expressive'],['Sorry I’m late.','expressive'],
 ['I now pronounce you married.','declaration'],['You’re fired.','declaration']];
SCENE({id:'speech-acts-taxonomy',name:'Five kinds of speech act',tag:'Searle’s classification',
 definition:'Searle sorted speech acts into five classes by their point and their direction of fit: assertives describe the world, directives try to get the hearer to act, commissives commit the speaker, expressives voice a feeling, and declarations change the world by being said.',
 example:'“You’re fired”, said by the right person, makes it so: a declaration. “Sorry I’m late” expresses regret: an expressive.',
 desc:'Ten utterances, one at a time, to sort into Searle’s five classes, with your score and the direction of fit of each class.',
 research:'Searle, J. R. (1976). A classification of illocutionary acts. Language in Society 5, 1–23. Many utterances do more than one thing; the classes describe the main point.',
 dur:12,hint:'Press the class that fits the utterance. Ten utterances in a seeded order; some could be argued two ways.',
 init:()=>({seed:6,i:0,res:[]}),
 watch(p){const n=Math.min(10,Math.floor(p*11)),o=shuffled(range(10),L6_mix(6));return {seed:6,i:n,res:o.slice(0,n).map(j=>({j,a:L6_SORT[j][1]})),sim:true}},
 ui:[{b:'Start again',act:'again'}],
 on:{pick(s,v){if(s.i>=10)return 'keep';const o=shuffled(range(10),L6_mix(s.seed));s.res=s.res.concat([{j:o[s.i],a:v}]);s.i++;return 'keep'},again(s){s.seed=nextSeed();s.i=0;s.res=[];return 'keep'}},
 draw(s,f,X){
  const o=shuffled(range(10),L6_mix(s.seed));let out=heading('Which kind of act is this?',26);
  out+=R(60,40,480,60,s.i<10?'#fff':C.greenp,s.i<10?C.blue:'none',12,'stroke-width="2"');
  if(s.i<10)out+=TB(300,78,'“'+L6_SORT[o[s.i]][0]+'”',20,C.ink)+TF(530,56,`${s.i+1} / 10`,13,C.muted,'end');
  else{const sc=s.res.filter(r=>L6_SORT[r.j][1]===r.a).length;out+=TBF(300,68,`${s.sim?'Simulated score':'Your score'}: ${sc} of 10`,17,C.green)+TF(300,90,'Press Start again for a new order.',14,C.ink)}
  L6_SEARLE.forEach(([k,n,fit,col],i)=>{const x=24+i*112,got=s.res.filter(r=>r.a===k);
   const inner=R(x,118,104,116,'#fff',col,10,'stroke-width="2"')+TBF(x+52,142,n,14,col)+L6_lines(x+52,164,fit,13,C.muted,'middle',16);
   out+=hit(X,'pick',k,`Sort as ${n}`,inner);
   got.forEach((r,m)=>{const ok=L6_SORT[r.j][1]===k;out+=Ci(x+16+(m%5)*18,206+Math.floor(m/5)*18,6,ok?C.green:C.coral)});
  });
  const last=s.res[s.res.length-1];
  if(last){const it=L6_SORT[last.j],ok=it[1]===last.a,name=L6_SEARLE.find(c=>c[0]===it[1])[1];
   out+=R(40,244,520,56,ok?C.greenp:C.coralp,'none',10)+TF(300,266,`“${it[0]}”`,14,C.ink)+TBF(300,288,ok?`Yes: ${name.toLowerCase()}.`:`Usually classed as ${name.toLowerCase()}.`,14,ok?C.green:C.coral)}
  out+=L6_lines(300,322,['Green dot: matches the usual classification. Coral: a different choice.','Indirect acts blur the lines: “Could you check this?” is a question in form.'],13,C.muted,'middle',18);
  return {svg:out,phase:'Direction of fit asks which side has to change: assertives must match the world; directives and commissives aim to make the world match the words; declarations do both at once.'};
 }});

/* ================================================================ metaphor */
const L6_MET=[
 {n:'ARGUMENT IS WAR',src:'War',tgt:'Argument',map:[['attacking a position','criticising a claim'],['defending territory','supporting a claim'],['winning or losing','persuading or failing to'],['changing strategy','changing your line']],ex:['He attacked every weak point in my argument.','Your claims are indefensible.','I’ve never won an argument with her.','If you use that strategy, she’ll wipe you out.']},
 {n:'TIME IS MONEY',src:'Money',tgt:'Time',map:[['spending','using time'],['saving','avoiding a delay'],['wasting','using time badly'],['investing','giving time for later gain']],ex:['How do you spend your time these days?','This gadget will save you hours.','You’re wasting my time.','I’ve invested a lot of time in her.']},
 {n:'LOVE IS A JOURNEY',src:'Journey',tgt:'Love',map:[['travellers','the lovers'],['the vehicle','the relationship'],['destinations','shared goals'],['choices of road','choices together']],ex:['Look how far we’ve come.','We’re just spinning our wheels.','This relationship isn’t going anywhere.','We’re at a crossroads.']},
 {n:'MORE IS UP',src:'Height',tgt:'Quantity',map:[['higher','more'],['lower','less'],['rising','increasing'],['falling','decreasing']],ex:['The number of books printed each year keeps going up.','The number of errors he made is incredibly low.','His income rose last year.','My income fell.']},
 {n:'IDEAS ARE FOOD',src:'Food',tgt:'Ideas',map:[['raw','not yet worked on'],['half-baked','badly thought out'],['swallowing','accepting without question'],['stewing','thinking it over slowly']],ex:['All this paper has in it are raw facts …','… half-baked ideas, and warmed-over theories.','I just can’t swallow that claim.','Let me stew over that for a while.']}];
SCENE({id:'metaphor',name:'Conceptual metaphor',tag:'Metaphors we live by',
 definition:'Lakoff and Johnson argued that metaphor is not just decoration: we understand many abstract ideas (time, argument, love) through systematic mappings from concrete ones (money, war, journeys), and everyday language shows these mappings.',
 example:'“You’re wasting my time”, “this will save you hours” and “I’ve invested time in her” all treat time as money.',
 desc:'A conceptual metaphor drawn as two domains, with the mapping between their parts. Press a row to highlight the part of the mapping that one everyday expression uses.',
 research:'Lakoff, G. & Johnson, M. (1980). Metaphors We Live By. University of Chicago Press (all examples from the book). Critiques: Murphy, G. L. (1996), On metaphoric representation, Cognition 60, 173–204; the evidence that people use the mappings while understanding is mixed (Keysar & Bly 1995; McGlone 2007).',
 dur:12,hint:'Choose a metaphor, then press a row of the mapping. Notice how ordinary the expressions are.',
 init:()=>({i:0,r:0}),
 watch(p){const k=Math.min(4,Math.floor(p*5));return {i:k,r:Math.floor((p*5-k)*4)%4}},
 ui:[{choose:L6_MET.map((m,i)=>[String(i),m.n]),label:'Metaphor',get:s=>String(s.i),act:'i'}],
 on:{i(s,v){s.i=Number(v);s.r=0;return 'keep'},r(s,v){s.r=Number(v);return 'keep'}},
 draw(s,f,X){
  const m=L6_MET[s.i];let out=heading(m.n,30);
  out+=TBF(140,60,'source: '+m.src,15,C.coral)+TBF(460,60,'target: '+m.tgt,15,C.blue)+TF(300,60,'maps onto',13,C.muted);
  m.map.forEach(([a,b],i)=>{const y=74+i*46,on=i===s.r;
   const inner=R(40,y,200,36,on?C.coralp:'#fff',on?C.coral:C.grid,8,'stroke-width="1.5"')+TF(140,y+23,a,14,C.ink)+R(360,y,200,36,on?C.pale:'#fff',on?C.blue:C.grid,8,'stroke-width="1.5"')+TF(460,y+23,b,14,C.ink)+arrow(244,y+18,354,y+18,on?C.ink:C.line,on?2.5:1.5,8)+R(240,y,120,36,'none','none',0);
   out+=hit(X,'r',i,`Mapping: ${a} to ${b}`,inner);
  });
  out+=R(40,264,520,104,C.pale,'none',10)+TF(56,286,'Everyday English',13,C.muted,'start');
  m.ex.forEach((e,i)=>out+=TF(56,308+i*19,'• '+e,14,i===s.r?C.ink:C.muted,'start',i===s.r?'font-weight="700"':''));
  return {svg:out,phase:'The mapping is systematic: if time is money, it can be spent, saved, wasted and invested. Critics accept the patterns in language but question whether people actually think through the source domain each time they understand such a phrase.'};
 }});

const L6_TIMEC=[
 ['english','English speakers'],['hebrew','Hebrew and Arabic speakers'],['thaayorre','Kuuk Thaayorre speakers'],['mandarin','Mandarin speakers'],['aymara','Aymara speakers']];
const L6_TIMEN={
 english:{dir:'lr',t:'Mostly left to right, the direction they read and write.',r:'Tversky, Kugelmass & Winter (1991); Fuhrman & Boroditsky (2010).'},
 hebrew:{dir:'rl',t:'Mostly right to left, the direction they read and write.',r:'Tversky, Kugelmass & Winter (1991); Fuhrman & Boroditsky (2010).'},
 thaayorre:{dir:'ew',t:'East to west, whichever way they are facing: towards the body when facing north.',r:'Boroditsky & Gaby (2010), Psychological Science 21 (Pormpuraaw, Australia).'},
 mandarin:{dir:'tb',t:'Words like shàng (up) for earlier and xià (down) for later. The claim that this makes thinking vertical has mixed evidence: replications failed (January & Kako 2007; Chen 2007).',r:'Boroditsky (2001); Boroditsky, Fuhrman & McCormick (2011).'},
 aymara:{dir:'fb',t:'The known past lies in front and the unknown future behind, in words and in gestures.',r:'Núñez & Sweetser (2006), Cognitive Science 30 (Andes).'}};
const L6_CARDS=[['sunrise','#f2a54a'],['noon','#f2d33a'],['sunset','#c8562d']];
function L6_sun(x,y,col,kind){let o=Ci(x,y,13,col,'none');if(kind==='sunrise'||kind==='sunset')o+=R(x-22,y+2,44,14,'#fff','none',0);else for(let k=0;k<8;k++){const a=k*Math.PI/4;o+=L(x+Math.cos(a)*17,y+Math.sin(a)*17,x+Math.cos(a)*23,y+Math.sin(a)*23,col,2)}return o}
SCENE({id:'metaphor-time-space',name:'Time laid out in space',tag:'Arrange a day, then compare',
 definition:'People everywhere talk and think about time using space, but which way time flows varies: with writing direction, with landscape and with grammar.',
 example:'Asked to lay out pictures of a day, English speakers usually go left to right, Hebrew speakers right to left, and Kuuk Thaayorre speakers east to west.',
 desc:'Three cards (sunrise, noon, sunset) to place on a row of slots in time order, then a comparison of how different communities lay out time, with the strength of the evidence for each.',
 research:'Tversky, B., Kugelmass, S. & Winter, A. (1991). Cross-cultural and developmental trends in graphic productions. Cognitive Psychology 23, 515–557. Boroditsky, L. & Gaby, A. (2010). Remembrances of times East. Psychological Science 21, 1635–1639. Núñez, R. E. & Sweetser, E. (2006). Cognitive Science 30, 401–450. Failed replications of the Mandarin result: January & Kako (2007), Cognition 104; Chen (2007), Cognition 104.',
 dur:12,hint:'Press a slot to place the sunrise card, then noon, then sunset. Then choose a community to compare.',
 init:()=>({pos:[],com:'english'}),
 watch(p){const k=Math.min(4,Math.floor(p*5));return {pos:[0,2,4],com:L6_TIMEC[k][0],sim:true}},
 ui:[{choose:L6_TIMEC,label:'Compare with',get:s=>s.com,act:'com'},{b:'Clear the cards',act:'clear'}],
 on:{slot(s,v){v=Number(v);if(s.pos.length>=3||s.pos.includes(v))return 'keep';s.pos=s.pos.concat([v]);return 'keep'},clear(s){s.pos=[];return 'keep'},com(s,v){s.com=v;return 'keep'}},
 draw(s,f,X){
  let out=heading('Lay out a day: where do sunrise, noon and sunset go?',26);
  const sx=i=>100+i*100;
  out+=L(70,140,530,140,C.line,2);
  for(let i=0;i<5;i++){const k=s.pos.indexOf(i),inner=R(sx(i)-38,64,76,64,k>=0?'#fff':C.pale,k>=0?L6_CARDS[k][1]:C.line,10,k>=0?'stroke-width="2.5"':'stroke-dasharray="4 4"')+(k>=0?L6_sun(sx(i),90,L6_CARDS[k][1],L6_CARDS[k][0])+TF(sx(i),122,L6_CARDS[k][0],13,C.ink):TF(sx(i),100,'slot',13,C.muted));out+=hit(X,'slot',i,`Slot ${i+1}`,inner)}
  let mine;
  if(s.pos.length<3)out+=TF(300,166,`Next card: ${L6_CARDS[s.pos.length][0]}. Press a slot.`,14,C.ink);
  else{const lr=s.pos[0]<s.pos[1]&&s.pos[1]<s.pos[2],rl=s.pos[0]>s.pos[1]&&s.pos[1]>s.pos[2];mine=lr?'left to right':rl?'right to left':'not in a straight order';out+=TBF(300,166,`${s.sim?'Simulated layout':'Your layout'}: ${mine}`,15,C.blue)}
  const N=L6_TIMEN[s.com];
  out+=R(40,184,520,184,C.pale,'none',12)+TBF(56,206,L6_TIMEC.find(c=>c[0]===s.com)[1],15,C.ink,'start');
  const cx=150,cy=280;
  if(N.dir==='lr'||N.dir==='rl'){out+=arrow(N.dir==='lr'?70:230,cy,N.dir==='lr'?230:70,cy,C.purple,3,11)+TF(cx,cy+26,'earlier → later',13,C.muted)}
  else if(N.dir==='tb'){out+=arrow(cx,226,cx,334,C.purple,3,11)+TF(cx+14,234,'earlier (up)',13,C.muted,'start')+TF(cx+14,330,'later (down)',13,C.muted,'start')}
  else if(N.dir==='ew'){out+=TBF(70,cy+5,'E',15,C.ink)+TBF(230,cy+5,'W',15,C.ink)+arrow(84,cy,216,cy,C.purple,3,11)+TF(cx,cy+26,'earlier in the east',13,C.muted)}
  else{out+=Ci(cx,cy,12,'#f1d2b6','#b88a65')+arrow(cx,cy-16,cx,226,C.purple,3,10)+TF(cx+12,236,'past: in front',13,C.muted,'start')+L(cx,cy+16,cx,334,C.purple,2,'stroke-dasharray="5 4"')+TF(cx+12,334,'future: behind',13,C.muted,'start')}
  out+=L6_lines(260,240,L6_wrap(N.t,40),14,C.ink,'start',19)+L6_lines(260,340,L6_wrap(N.r,42),13,C.muted,'start',16);
  return {svg:out,phase:'Thinking about time in space appears to be universal; the direction is learned from culture and language. The strongest evidence links it to writing direction and, for the Kuuk Thaayorre, to habitual use of compass directions; the Mandarin vertical-time result has proved fragile.'};
 }});

const L6_MP=[
 {s:'Some jobs are jails.',c:'met'},{s:'Some surgeons are butchers.',c:'met'},{s:'Some lawyers are sharks.',c:'met'},{s:'Some roads are snakes.',c:'met'},
 {s:'Some jobs are snakes.',c:'scr'},{s:'Some surgeons are jails.',c:'scr'},{s:'Some lawyers are roads.',c:'scr'},{s:'Some roads are butchers.',c:'scr'},
 {s:'Some jobs are boring.',c:'true'},{s:'Some surgeons are women.',c:'true'},{s:'Some lawyers are rich.',c:'true'},{s:'Some roads are steep.',c:'true'}];
function L6_mpSim(n){const o=shuffled(range(12),L6_mix(91)),r=L6_rng(92),d=[];for(let k=0;k<n;k++){const it=L6_MP[o[k]];d.push({c:it.c,ans:it.c==='true'?'T':'F',rt:Math.max(.5,(it.c==='met'?1.32:it.c==='scr'?1.12:1.05)+.15*L6_gauss(r))})}return d}
SCENE({id:'metaphor-processing',name:'Can you ignore a metaphor?',tag:'A metaphor interference experiment',
 definition:'If metaphors were understood only after the literal meaning failed, people asked to judge literal truth could ignore them. Glucksberg and colleagues found they cannot: literally false sentences that make good metaphors take longer to reject.',
 example:'“Some jobs are jails” is literally false, but it is harder to say so quickly than for “Some jobs are snakes”.',
 desc:'Twelve sentences to judge literally true or false as fast as possible: four good metaphors, four scrambled versions and four ordinary true sentences. Your times for rejecting metaphors and scrambled sentences are compared.',
 research:'Glucksberg, S., Gildea, P. & Bookin, H. B. (1982). On understanding nonliteral speech: can people ignore metaphors? Journal of Verbal Learning and Verbal Behavior 21, 85–98 (metaphors were slower to reject). Against the two-stage view in Searle (1979), Expression and Meaning.',
 dur:12,hint:'Press Start, then answer Literally true or Literally false as fast as you can. Twelve sentences in a seeded order. Your answers stay in this page.',
 init:()=>({seed:9,phase:'idle',i:0,order:[],data:[],tok:0}),
 watch(p){const n=Math.min(12,Math.floor(p*13)),o=shuffled(range(12),L6_mix(91));return {seed:9,phase:n>=12?'done':'run',i:n,order:o,data:L6_mpSim(n),sim:true}},
 ui:[{b:'Start',act:'start'},{b:'Literally true',act:'ans',arg:'T'},{b:'Literally false',act:'ans',arg:'F'},{b:'Start again',act:'again'}],
 on:{start(s){if(s.phase==='run'||s.phase==='gap')return 'keep';s.order=shuffled(range(12),L6_mix(s.seed+40));s.i=0;s.data=[];s.phase='run';s.t0=performance.now();return 'keep'},
  ans(s,v,ctx){if(s.phase!=='run')return 'keep';const rt=(performance.now()-s.t0)/1000;s.data.push({c:L6_MP[s.order[s.i]].c,ans:v,rt});s.i++;if(s.i>=12){s.phase='done';return 'keep'}s.phase='gap';s.tok++;ctx.later(400,'next',s.tok);return 'keep'},
  next(s,t){if(Number(t)!==s.tok||s.phase!=='gap')return 'keep';s.phase='run';s.t0=performance.now();return 'keep'},
  again(s){s.seed=nextSeed();s.phase='idle';s.i=0;s.data=[];s.order=[];s.tok++;return 'keep'}},
 draw(s){
  let out=heading('Literally true or literally false?',26);
  out+=R(30,42,540,84,s.phase==='run'?'#fff':C.pale,s.phase==='run'?C.blue:'none',12,'stroke-width="2"');
  if(s.phase==='idle')out+=TF(300,78,'Press Start. Judge only the literal meaning, as fast as you can.',15,C.ink)+TF(300,102,'“Some lawyers are sharks” is literally false.',14,C.muted);
  else if(s.phase==='run'||s.phase==='gap'){const it=L6_MP[s.order[s.i]];out+=TF(560,60,`${s.i+1} / 12`,13,C.muted,'end');if(s.phase==='run'&&it)out+=TB(300,94,it.s,22,C.ink);if(s.sim)out+=TF(40,60,'simulated participant',13,C.purple,'start')}
  else out+=TBF(300,80,'Done: twelve sentences judged',16,C.green)+TF(300,104,'Press Start again for a new order.',14,C.ink);
  const ok=s.data.filter(d=>d.ans===(d.c==='true'?'T':'F'));
  const m=L6_mean(ok.filter(d=>d.c==='met').map(d=>d.rt)),sc=L6_mean(ok.filter(d=>d.c==='scr').map(d=>d.rt)),tr=L6_mean(ok.filter(d=>d.c==='true').map(d=>d.rt));
  const pl=L6_plot(110,160,280,150,[0,3],[0,2.5],{yt:[[0,'0 s'],[1,'1 s'],[2,'2 s']],yl:'mean time for correct answers'});
  out+=pl.svg;
  [[m,'metaphor','“false”',C.coral],[sc,'scrambled','“false”',C.purple],[tr,'true','“true”',C.green]].forEach(([v,a,b,col],i)=>{const x=pl.X(i+.5);out+=isFinite(v)?R(x-30,pl.Y(clamp(v,0,2.5)),60,pl.Y(0)-pl.Y(clamp(v,0,2.5)),col,'none',4)+TBF(x,pl.Y(clamp(v,0,2.5))-6,v.toFixed(2),14,col):TF(x,pl.Y(0)-10,'–',14,C.muted);out+=TF(x,328,a,13,C.ink)+TF(x,344,b,13,C.muted)});
  const dlt=m-sc;
  out+=R(410,170,160,130,C.pale,'none',10)+TF(490,192,'metaphor minus',13,C.muted)+TF(490,208,'scrambled',13,C.muted)+TBF(490,240,isFinite(dlt)?(dlt>=0?'+':'')+Math.round(dlt*1000)+' ms':'–',18,isFinite(dlt)?(dlt>0?C.coral:C.ink):C.muted)+L6_lines(490,266,['published:','metaphors slower'],13,C.muted,'middle',16);
  out+=TF(300,370,`${s.sim?'Simulated participant':'You'}: ${s.data.length-ok.length} errors so far. Errors are left out of the times.`,13,C.muted);
  return {svg:out,phase:'If the metaphorical meaning came only after the literal one failed, “Some jobs are jails” would be rejected as fast as “Some jobs are snakes”. In Glucksberg’s study it was slower: the metaphor is understood automatically, even when it gets in the way.'};
 }});

/* ================================================================ colour-terms */
const L6_HUES=range(20).map(i=>i*18),L6_LIGHT=[90,80,70,60,50,40,30,20],L6_GREYL=[95,84,72,60,48,36,24,12];
const L6_CC={white:'#f4f4ef',black:'#262626',grey:'#9b9b9b',red:'#c8322d',orange:'#ee8a24',yellow:'#f1d23a',green:'#3f9d4a',blue:'#2f62c9',purple:'#7a3fa8',pink:'#ef8fb8',brown:'#7b4a22',grue:'#2a8a8c'};
function L6_base(h,l,grey){
 if(grey)return l>=88?'white':l<=16?'black':'grey';
 if(l>=90)return 'white';if(l<=20)return 'black';
 if(h>=345||h<12)return l>=72?'pink':l<=30?'brown':'red';
 if(h<42)return l<=40?'brown':'orange';
 if(h<70)return l<=40?'brown':'yellow';
 if(h<165)return 'green';
 if(h<252)return 'blue';
 if(h<300)return 'purple';
 return l>=60?'pink':'purple';
}
// Collapse the 11-term system down to k terms, in Berlin and Kay's order (stage III taken as grue first).
function L6_cat(h,l,grey,k){
 let c=L6_base(h,l,grey);
 if(k<11&&c==='grey')c=l>=55?'white':'black';
 if(k<10&&c==='orange')c=h<26?'red':'yellow';
 if(k<9&&c==='pink')c='red';
 if(k<8&&c==='purple')c='blue';
 if(k<7&&c==='brown')c='red';
 if(k<6&&(c==='green'||c==='blue'))c='grue';
 if(k<5&&c==='yellow')c='red';
 if(k<4&&c==='grue')c='black';
 if(k<3&&c==='red')c='white';
 return c;
}
function L6_catName(c,k){if(k<=2)return c==='white'?'light / warm':'dark / cool';if(k===3&&c==='black')return 'dark / cool';if(k<=4&&c==='red')return 'red / warm';if(c==='grue')return 'green-blue';return c}
const L6_STAGES=[['I','white, black',2],['II','red',3],['III','green-blue',4],['IV','yellow',5],['V','green ≠ blue',6],['VI','brown',7],['VII','purple pink orange grey',11]];
SCENE({id:'colour-terms',name:'Basic colour terms',tag:'Berlin and Kay’s sequence',
 definition:'Berlin and Kay found that languages with few basic colour words divide colour space in similar ways, and that terms tend to be added in a fixed order: dark and light, then red, then green and yellow, then blue, then brown, then the rest.',
 example:'A language with three basic colour terms almost always has words for dark, light and red; one with six has added yellow, green and blue.',
 desc:'A chart of colour chips by hue (across) and lightness (down), with a slider for the number of basic terms. Each chip takes the colour of the category it falls into, and the stage sequence is shown below.',
 research:'Berlin, B. & Kay, P. (1969). Basic Color Terms: Their Universality and Evolution. University of California Press. Kay, P. & McDaniel, C. K. (1978). Language 54, 610–646 (stage III can be green-blue “grue” or yellow). The chart’s category boundaries are schematic.',
 dur:12,hint:'Move the slider from 2 to 11 basic terms. Switch to “true colours” to see the chips themselves.',
 init:()=>({k:5,view:'cat'}),
 watch(p){return {k:2+Math.min(9,Math.floor(p*10)),view:'cat'}},
 ui:[{range:'k',label:'Basic colour terms',min:2,max:11,step:1,get:s=>s.k,act:'k',show:v=>v+' terms'},{choose:[['cat','Categories'],['chip','True colours']],label:'Show',get:s=>s.view,act:'view'}],
 on:{k(s,v){s.k=Number(v);return 'keep'},view(s,v){s.view=v;return 'keep'}},
 draw(s){
  let out=heading(`A language with ${s.k} basic colour terms`,26);
  const x0=50,y0=42,cw=22,ch=22;const present=new Set();
  L6_LIGHT.forEach((l,r)=>L6_HUES.forEach((h,c)=>{const cat=L6_cat(h,l,false,s.k);present.add(cat);out+=R(x0+c*cw,y0+r*ch,cw-2,ch-2,s.view==='cat'?L6_CC[cat]:`hsl(${h},70%,${l}%)`,'none',2)}));
  L6_GREYL.forEach((l,r)=>{const cat=L6_cat(0,l,true,s.k);present.add(cat);out+=R(x0+20*cw+12,y0+r*ch,cw-2,ch-2,s.view==='cat'?L6_CC[cat]:`hsl(0,0%,${l}%)`,'none',2)});
  out+=TF(x0,y0+8*ch+16,'hue →',13,C.muted,'start')+TF(x0+20*cw+22,y0+8*ch+16,'greys',13,C.muted);
  const names=[...present];let lx=50;
  names.forEach(c=>{const n=L6_catName(c,s.k),w=26+n.length*7.4;if(lx+w>570)return;out+=R(lx,240,14,14,L6_CC[c],C.line,3,'stroke-width="1"')+TF(lx+19,252,n,13,C.ink,'start');lx+=w+8});
  out+=TF(300,280,'Order in which basic terms are added (Berlin & Kay 1969, revised 1978)',13,C.muted);
  const sw=74;L6_STAGES.forEach(([st,t,kk],i)=>{const x=34+i*(sw+3),on=s.k>=kk||(i===6&&s.k>7);out+=R(x,292,sw,58,on?C.pale:'#fff',on?C.blue:C.grid,8,'stroke-width="1.5"')+TBF(x+sw/2,310,st,14,on?C.blue:C.muted)+L6_lines(x+sw/2,328,L6_wrap(t,11),13,on?C.ink:C.muted,'middle',15)});
  out+=TF(300,370,s.k>7&&s.k<11?`Stage VII terms arrive in no fixed order: here ${11-s.k} still missing.`:'Lighter chips at the top, darker at the bottom.',13,C.muted);
  return {svg:out,phase:'Languages differ in how many basic colour terms they have, but not at random: where a term exists, its best example (its focal colour) clusters in similar places across languages. The neat stage sequence has been revised as more languages were studied.'};
 }});

const L6_GB=range(15).map(i=>100+i*10);
SCENE({id:'colour-terms-naming',name:'Where does green end?',tag:'Find your own boundary',
 definition:'Colour terms carve a continuous range of hues into categories. Where one category ends and the next begins differs between languages and, a little, between people.',
 example:'English splits this range into green and blue; Russian speakers must also choose between goluboy (light blue) and siniy (dark blue), and are faster to tell apart two blues that fall on different sides of that line.',
 desc:'Fifteen chips from green to blue shown one at a time in a seeded order. You name each one green or blue, and your boundary is drawn on the strip of chips.',
 research:'Winawer, J. et al. (2007). Russian blues reveal effects of language on color discrimination. PNAS 104, 7780–7785. Roberson, D. et al. (2005). Color categories: evidence for the cultural relativity hypothesis. Cognitive Psychology 50, 378–411 (Himba). Screens differ, so the boundary here is only approximate.',
 dur:12,hint:'Press Green or Blue for each chip. Fifteen chips; your answers stay in this page. Screens differ, so treat the result as rough.',
 init:()=>({seed:6,i:0,ans:{}}),
 watch(p){const n=Math.min(15,Math.floor(p*16)),o=shuffled(range(15),L6_mix(6)),a={};o.slice(0,n).forEach(j=>{const h=L6_GB[j];a[j]=(h>=180||(h===170&&j%2))?'B':'G'});return {seed:6,i:n,ans:a,sim:true}},
 ui:[{b:'Green',act:'name',arg:'G'},{b:'Blue',act:'name',arg:'B'},{b:'Start again',act:'again'}],
 on:{name(s,v){if(s.i>=15)return 'keep';const o=shuffled(range(15),L6_mix(s.seed));s.ans=Object.assign({},s.ans,{[o[s.i]]:v});s.i++;return 'keep'},again(s){s.seed=nextSeed();s.i=0;s.ans={};return 'keep'}},
 draw(s){
  const o=shuffled(range(15),L6_mix(s.seed));let out=heading('Green or blue?',26);
  if(s.i<15){const h=L6_GB[o[s.i]];out+=R(220,40,160,120,`hsl(${h},55%,45%)`,'none',14)+TF(400,60,`${s.i+1} / 15`,13,C.muted,'start');if(s.sim)out+=TF(200,60,'simulated',13,C.purple,'end')}
  else out+=R(140,60,320,80,C.greenp,'none',12)+TBF(300,96,'All fifteen named',16,C.green)+TF(300,120,'Your boundary is marked on the strip below.',14,C.ink);
  const sx=i=>60+i*32;
  L6_GB.forEach((h,i)=>{out+=R(sx(i),190,30,44,`hsl(${h},55%,45%)`,'none',4);const a=s.ans[i];if(a)out+=TBF(sx(i)+15,254,a,15,a==='G'?C.green:C.blue)});
  out+=TF(60,180,'all fifteen chips, in hue order',13,C.muted,'start');
  const g=Object.keys(s.ans).filter(k=>s.ans[k]==='G').length,nb=Object.keys(s.ans).length;
  if(s.i>=15||(s.sim&&nb>=10)){const bx=sx(0)+g*32-1;out+=L(bx,182,bx,262,C.coral,3)+TBF(bx,280,`${s.sim?'simulated':'your'} boundary`,13,C.coral)}
  const tb=sx(0)+8*32-1;out+=L(tb,186,tb,262,C.ink,1.5,'stroke-dasharray="4 4"')+TF(tb,300,'a common English boundary (approximate)',13,C.muted);
  const mono=Object.keys(s.ans).map(Number).sort((a,b)=>a-b).every((k,i,arr)=>i===0||!(s.ans[arr[i-1]]==='B'&&s.ans[k]==='G'));
  out+=L6_lines(300,330,s.i>=15?[mono?'Your answers switch from green to blue once: a clean category boundary.':'Your answers switch back and forth near the boundary: chips near it are hard to call.','The boundary sits where your answers change; screens and lighting shift it.']:['G and B appear under each chip as you name it.','Chips are shown in a shuffled order so you cannot just count along.'],13,C.ink,'middle',19);
  return {svg:out,phase:'Hue changes smoothly along the strip, yet naming flips at one place. Categories like this can speed up telling colours apart across a boundary, which is the weak, well-supported version of the idea that language affects perception.'};
 }});

const L6_LANGS={
 english:{n:'English',terms:[[0,15,'b','red'],[15,42,'b','orange'],[42,68,'b','yellow'],[68,165,'b','green'],[165,255,'b','blue'],[255,300,'b','purple'],[300,345,'b','pink'],[345,360,'b','red']],note:'Eleven basic terms; blue is one category, light or dark.',src:'Berlin & Kay (1969).'},
 russian:{n:'Russian',terms:[[0,15,'b','krasnyy'],[15,42,'b','oranzhevyy'],[42,68,'b','zhyoltyy'],[68,165,'b','zelyonyy'],[165,255,'l','goluboy'],[165,255,'d','siniy'],[255,300,'b','fioletovyy'],[300,345,'b','rozovyy'],[345,360,'b','krasnyy']],note:'Two basic blues: goluboy (light) and siniy (dark).',src:'Winawer et al. (2007).'},
 berinmo:{n:'Berinmo (Papua New Guinea)',terms:[[0,35,'b','mehi'],[35,95,'b','wor'],[95,280,'b','nol'],[280,360,'b','mehi']],note:'Five basic terms; nol spans green, blue and purple, and the wor–nol boundary falls inside English green. Two more terms cover light and dark.',src:'Roberson, Davies & Davidoff (2000).'},
 dani:{n:'Dugum Dani (New Guinea)',terms:[[0,360,'l','mola'],[0,68,'d','mola'],[68,360,'d','mili']],note:'Two basic terms: mola for light and warm, mili for dark and cool. Speakers still remembered focal colours well.',src:'Heider (1972); Rosch Heider & Olivier (1972).'}};
SCENE({id:'colour-terms-critiques',name:'Universal or relative?',tag:'The colour debate',
 definition:'Large surveys show strong universal tendencies in how languages name colour, yet the boundaries and the number of terms vary, and some languages hardly have abstract colour words at all.',
 example:'Berinmo has one word, nol, across green, blue and purple, and its speakers sort colours along their own boundaries more easily than along the English green–blue line.',
 desc:'A strip of hues in a light and a dark row, divided by the basic colour terms of four languages, with the evidence for universal tendencies and for relativity side by side.',
 research:'Kay, P. & Regier, T. (2003). Resolving the question of color naming universals. PNAS 100, 9085–9089 (World Color Survey, 110 languages). Regier, Kay & Khetarpal (2007), PNAS 104. Critiques: Saunders & van Brakel (1997), Behavioral and Brain Sciences 20; Levinson (2000), Journal of Linguistic Anthropology 10 (Yélî Dnye). Boundaries drawn here are schematic.',
 dur:12,hint:'Choose a language to see how it divides the same hues.',
 init:()=>({lg:'berinmo'}),
 watch(p){const ks=Object.keys(L6_LANGS);return {lg:ks[Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:Object.keys(L6_LANGS).map(k=>[k,L6_LANGS[k].n]),label:'Language',get:s=>s.lg,act:'lg'}],
 on:{lg(s,v){s.lg=v;return 'keep'}},
 draw(s){
  const Lg=L6_LANGS[s.lg];let out=heading(Lg.n,28);
  const x0=60,w=480,hx=h=>x0+h/360*w;
  for(let h=0;h<360;h+=6){out+=R(hx(h),50,w/60+.6,30,`hsl(${h},65%,68%)`,'none',0)+R(hx(h),84,w/60+.6,30,`hsl(${h},65%,32%)`,'none',0)}
  out+=TF(x0-6,70,'light',13,C.muted,'end')+TF(x0-6,104,'dark',13,C.muted,'end');
  Lg.terms.forEach(([a,b,row,name])=>{const y=row==='d'?84:50,h=row==='b'?64:30;out+=R(hx(a),y,hx(b)-hx(a),h,'none',C.ink,0,'stroke-width="1.6" fill-opacity="0"');const mid=(hx(a)+hx(b))/2;if(hx(b)-hx(a)>name.length*7.2)out+=TBF(mid,row==='d'?136:row==='l'?44:136,name,13,C.ink)});
  out+=L6_lines(300,166,L6_wrap(Lg.note+' '+Lg.src,72),13,C.ink,'middle',17);
  out+=R(30,214,264,154,C.greenp,'none',10)+TBF(162,236,'Universal tendencies',14,C.green);
  out+=L6_lines(44,258,['World Color Survey: 110 languages','cluster their categories in similar','places (Kay & Regier 2003).','Boundaries look like efficient ways to','divide perceptual colour space','(Regier, Kay & Khetarpal 2007).'],13,C.ink,'start',17);
  out+=R(306,214,264,154,C.amberp,'none',10)+TBF(438,236,'Relativity and critiques',14,C.amber);
  out+=L6_lines(320,258,['Boundaries differ, and they shape','discrimination near them (Berinmo,','Russian). Some languages, like Yélî','Dnye, barely have abstract colour','words (Levinson 2000). Sampling with','Munsell chips may bias results.'],13,C.ink,'start',17);
  return {svg:out,phase:'Both sides have evidence. The current view is a middle one: perception constrains where categories tend to fall, and language and culture decide how many there are and exactly where the lines go.'};
 }});

/* ================================================================ turn-taking */
const L6_noP=g=>1/(1+Math.exp(-(g-700)/160));
SCENE({id:'turn-taking',name:'Taking turns',tag:'The meaning of a pause',
 definition:'Conversation is organised in turns. Speakers usually change over with very short gaps and little overlap, so a gap that is longer than usual is itself meaningful: it often signals trouble or an answer the asker will not like.',
 example:'“Can you come on Saturday?” … (a second-long pause) … “Well …” Before the answer, you already suspect it is no.',
 desc:'A question and an answer on a timeline, with the gap between them set by a slider, and an illustrative curve of how likely the answer is to be a “no” or another dispreferred reply as the gap grows. Press Hear it to hear the timing as tones.',
 research:'Sacks, H., Schegloff, E. A. & Jefferson, G. (1974). A simplest systematics for the organization of turn-taking for conversation. Language 50, 696–735. Kendrick, K. H. & Torreira, F. (2015). The timing and construction of preference. Discourse Processes 52, 255–289. Roberts, F., Francis, A. L. & Morgan, M. (2006). Speech Communication 48, 1079–1093 (listeners judged long-delayed replies less willing).',
 dur:10,hint:'Move the gap slider, then press Hear it. Negative gaps are overlaps. The curve is a sketch of the published pattern, not fitted data.',
 init:()=>({gap:200}),
 watch(p){return {gap:Math.round(-200+p*1600)}},
 ui:[{range:'gap',label:'Gap before the answer',min:-300,max:1500,step:50,get:s=>s.gap,act:'gap',show:v=>v+' ms'},{b:'Hear it',act:'hear'}],
 on:{gap(s,v){s.gap=Number(v);return 'keep'},hear(s){const g=s.gap/1000,q=[220,230,215,250],a=[200,190,185];AUDIO.seq(q.map((hz,i)=>({hz,at:i*.32,dur:.26})).concat(a.map((hz,i)=>({hz:hz*1.25,at:1.28+g+i*.3,dur:.24}))),{type:'triangle',gain:.12});return 'keep'}},
 draw(s){
  let out=heading('A question, a gap, an answer',26);
  const t0=80,sc=120,tx=t=>t0+t*sc,qEnd=1.28,g=s.gap/1000;
  out+=TBF(t0-12,74,'A',15,C.blue,'end')+R(tx(0),58,tx(qEnd)-tx(0),26,C.blue,'none',6)+TF(tx(qEnd/2),76,'Free on Saturday?',13,'#fff');
  out+=TBF(t0-12,124,'B',15,C.purple,'end')+R(tx(qEnd+g),108,132,26,C.purple,'none',6)+TF(tx(qEnd+g)+66,126,g>.7?'Well … um …':'Yes, sure!',13,'#fff');
  out+=L(tx(qEnd),52,tx(qEnd),146,C.line,1.5,'stroke-dasharray="3 3"');
  if(g>0)out+=L(tx(qEnd),96,tx(qEnd+g),96,C.ink,2)+TF((tx(qEnd)+tx(qEnd+g))/2,166,`gap ${s.gap} ms`,13,C.ink);
  else if(g<0)out+=R(tx(qEnd+g),104,tx(qEnd)-tx(qEnd+g),34,C.coral,'none',4,'fill-opacity=".25"')+TF(tx(qEnd)+40,166,`overlap ${-s.gap} ms`,13,C.coral);
  else out+=TF(tx(qEnd)+30,166,'no gap',13,C.ink);
  const pl=L6_plot(90,196,440,120,[-300,1500],[0,1],{xt:[[0,'0'],[500,'500'],[1000,'1000'],[1500,'1500 ms']],yt:[[0,'0'],[.5,'0.5'],[1,'1']],xl:'gap before the answer',yl:'chance the answer is a “no” or other dispreferred reply (illustrative)'});
  out+=pl.svg;let d='';for(let gg=-300;gg<=1500;gg+=30)d+=(d?' L':'M')+fmt(pl.X(gg))+' '+fmt(pl.Y(L6_noP(gg)));
  out+=P(d,C.coral,2.5)+R(pl.X(0),196,pl.X(300)-pl.X(0),120,C.green,'none',0,'fill-opacity=".12"')+TF(pl.X(150),212,'typical',13,C.green);
  out+=Ci(pl.X(s.gap),pl.Y(L6_noP(s.gap)),7,C.ink,'#fff');
  return {svg:out,phase:s.gap>700?'A gap this long is unusual, and listeners hear it as a warning: what follows is often a refusal, a disagreement or a sign of trouble.':s.gap<0?'Brief overlaps are common and rarely felt as rude; long ones are a bid for the floor.':'Gaps of a fraction of a second are normal; nothing special is signalled.'};
 }});

SCENE({id:'turn-taking-planning',name:'Planning before the turn ends',tag:'Faster than speech production',
 definition:'Across languages, the most common gap between turns is about 200 milliseconds, but planning even a one-word reply takes about 600 milliseconds. So listeners must start planning their answer while the other person is still talking, by predicting how the turn will go.',
 example:'Japanese conversations in one study had an average gap of about 7 ms; Danish ones about 470 ms. All ten languages had their most common gap near zero to 200 ms.',
 desc:'A timeline of the end of a question, with the listener’s planning shown as a bar. Choose when planning starts and how long production takes; the resulting gap is drawn against the range found across ten languages.',
 research:'Stivers, T. et al. (2009). Universals and cultural variation in turn-taking in conversation. PNAS 106, 10587–10592 (10 languages; mean offsets 7 ms in Japanese to 469 ms in Danish). Indefrey, P. & Levelt, W. J. M. (2004). Cognition 92, 101–144 (about 600 ms to name a picture). Levinson, S. C. & Torreira, F. (2015). Frontiers in Psychology 6, 731. Bögels, Magyari & Levinson (2015), Scientific Reports 5 (planning starts early).',
 dur:10,hint:'Move the head-start slider: how long before the question ends does the listener begin planning? The gap is production time minus head start.',
 init:()=>({head:400,lat:600}),
 watch(p){return {head:Math.round(p*900/50)*50,lat:600}},
 ui:[{range:'head',label:'Planning starts before the turn ends',min:0,max:1200,step:50,get:s=>s.head,act:'head',show:v=>v+' ms'},{range:'lat',label:'Time to plan and start speaking',min:400,max:1200,step:50,get:s=>s.lat,act:'lat',show:v=>v+' ms'}],
 on:{head(s,v){s.head=Number(v);return 'keep'},lat(s,v){s.lat=Number(v);return 'keep'}},
 draw(s){
  let out=heading('When does the listener start planning the reply?',26);
  const tx=ms=>300+ms*.2,gap=s.lat-s.head;
  out+=TBF(40,72,'A',15,C.blue,'start')+R(tx(-1200),58,tx(0)-tx(-1200),22,C.blue,'none',6)+TF(tx(-600),74,'… so are you free on Saturday?',13,'#fff');
  out+=L(tx(0),48,tx(0),190,C.ink,1.5,'stroke-dasharray="3 3"')+TF(tx(0),46,'turn ends',13,C.ink);
  out+=TBF(40,112,'B',15,C.purple,'start')+R(tx(-s.head),98,s.lat*.2,22,C.purplep,C.purple,6,'stroke-width="1.5"')+TF(tx(-s.head)+s.lat*.1,114,'planning',13,C.purple);
  {const yx=Math.min(tx(gap),500);out+=R(yx,132,90,22,C.purple,'none',6)+TF(yx+45,148,'“Yes!”',13,'#fff')}
  out+=TBF(300,182,gap>=0?`gap = ${s.lat} − ${s.head} = ${gap} ms`:`overlap of ${-gap} ms`,15,gap>=0&&gap<=300?C.green:C.coral);
  const ax=v=>90+(v+400)/1400*440;
  out+=TF(300,214,'Gaps found in ten languages (Stivers et al. 2009)',13,C.muted);
  out+=L(ax(-400),300,ax(1000),300,C.line,1.5);[-400,0,200,500,1000].forEach(v=>out+=L(ax(v),300,ax(v),305,C.line,1)+TF(ax(v),320,v+' ms',13,C.muted));
  let d='';for(let v=-400;v<=1000;v+=20){const y=300-62*Math.exp(-Math.pow((v-200)/260,2)/2*1.6);d+=(d?' L':'M')+fmt(ax(v))+' '+fmt(y)}
  out+=P(d+` L${fmt(ax(1000))} 300 L${fmt(ax(-400))} 300 Z`,C.blue,1.5,C.pale);
  out+=L(ax(7),232,ax(7),300,C.green,2)+TF(ax(7)-4,246,'Japanese 7',13,C.green,'end')+L(ax(469),232,ax(469),300,C.amber,2)+TF(ax(469)+4,246,'Danish 469',13,C.amber,'start');
  out+=Ci(ax(clamp(gap,-400,1000)),300,7,C.purple,'#fff');
  out+=TF(300,346,'Shaded shape: an illustrative spread, peaking near 200 ms; lines: language means.',13,C.muted);
  out+=TF(300,368,s.head===0?'Starting only when the turn ends leaves a gap as long as production itself.':'The earlier planning starts, the shorter the gap.',13,C.ink);
  return {svg:out,phase:'Because producing even a short reply takes longer than the usual gap, listeners must comprehend, predict and plan in parallel. Differences between languages are real but small next to this shared pattern.'};
 }});

const L6_TQ=['What time does the train leave?','Did you see the match last night?','Where did you put my keys?','Are you coming to the party?','How long have you lived here?','Could you send me the report today?','Why is the shop closed?','Which bus goes to the station?'];
const L6_WMS=330;
function L6_tpOrder(seed){const q=shuffled(range(8),L6_mix(seed)),c=shuffled([0,0,0,0,1,1,1,1],L6_mix(seed+5));return q.map((j,i)=>({j,hum:c[i]}))}
function L6_tpSim(n){const o=L6_tpOrder(71),r=L6_rng(72);return o.slice(0,n).map(t=>({hum:t.hum,off:Math.round(t.hum?380+220*L6_gauss(r):120+90*L6_gauss(r))}))}
SCENE({id:'turn-taking-predict',name:'Predicting the end of a turn',tag:'An anticipation experiment',
 definition:'To reply on time, a listener must predict when the speaker will stop. Experiments show the words themselves carry most of that information: take them away and keep only the rhythm and melody, and people anticipate the end much less well.',
 example:'Hearing “What time does the train …”, you already know one word is left. Hearing only “mm mm mm mm mm …”, you cannot tell.',
 desc:'Eight questions revealed one word at a time, each with a soft tone. In half, the words are hidden and only blocks and tones remain. You press Reply when you think the question has ended; your timing against the true end is plotted for the two kinds.',
 research:'de Ruiter, J. P., Mitterer, H. & Enfield, N. J. (2006). Projecting the end of a speaker’s turn: a cognitive cornerstone of conversation. Language 82, 515–535 (removing the words, not the pitch, harmed prediction). This is a simplified visual version of their listening task.',
 dur:12,hint:'Press Start, then press Reply exactly when you think the question ends. Eight questions; half have hidden words. Your answers stay in this page.',
 init:()=>({seed:7,phase:'idle',i:0,k:0,data:[],tok:0}),
 watch(p){const n=Math.min(8,Math.floor(p*9)),o=L6_tpOrder(71),t=o[Math.min(7,n)],len=L6_TQ[t.j].split(' ').length;return {seed:71,phase:n>=8?'done':'play',i:n,k:Math.max(1,Math.round(((p*9)%1)*len)),data:L6_tpSim(n),sim:true}},
 ui:[{b:'Start',act:'start'},{b:'Reply',act:'reply'},{b:'Start again',act:'again'}],
 on:{start(s,a,ctx){if(s.phase!=='idle'&&s.phase!=='done')return 'keep';s.i=0;s.data=[];return L6_tpBegin(s,ctx)},
  tick(s,t){if(Number(t)!==s.tok||s.phase!=='play')return 'stop';const o=L6_tpOrder(s.seed),words=L6_TQ[o[s.i].j].split(' ');if(s.k>=words.length){s.phase='wait';return 'stop'}s.k++;AUDIO.tone(s.k===words.length?150:200-s.k*4,{dur:.22,type:'triangle',gain:.06});return 'keep'},
  reply(s,a,ctx){if(s.phase!=='play'&&s.phase!=='wait')return 'keep';const o=L6_tpOrder(s.seed),n=L6_TQ[o[s.i].j].split(' ').length;const off=Math.round(performance.now()-s.t0-n*L6_WMS);s.data=s.data.concat([{hum:o[s.i].hum,off}]);s.i++;s.phase='gap';s.tok++;if(s.i>=8){s.phase='done';return 'keep'}ctx.later(900,'next',s.tok);return 'keep'},
  next(s,t,ctx){if(Number(t)!==s.tok||s.phase!=='gap')return 'keep';return L6_tpBegin(s,ctx)},
  late(s,t,ctx){if(Number(t)!==s.tok||(s.phase!=='play'&&s.phase!=='wait'))return 'keep';const o=L6_tpOrder(s.seed);s.data=s.data.concat([{hum:o[s.i].hum,off:2000,miss:true}]);s.i++;s.tok++;if(s.i>=8){s.phase='done';return 'keep'}s.phase='gap';ctx.later(900,'next',s.tok);return 'keep'},
  again(s){s.seed=nextSeed();s.phase='idle';s.i=0;s.k=0;s.data=[];s.tok++;return 'keep'}},
 draw(s){
  let out=heading('Press Reply the moment the question ends',26);
  const o=L6_tpOrder(s.seed);
  out+=R(30,42,540,96,s.phase==='play'||s.phase==='wait'?'#fff':C.pale,s.phase==='play'||s.phase==='wait'?C.blue:'none',12,'stroke-width="2"');
  if(s.phase==='idle')out+=TF(300,82,'Press Start. Words appear one by one at a steady pace.',15,C.ink)+TF(300,106,'In half the questions they are hidden as blocks.',14,C.muted);
  else if(s.phase==='done')out+=TBF(300,84,'Done: eight questions',16,C.green)+TF(300,108,'Press Start again for a new order.',14,C.ink);
  else{const t=o[Math.min(7,s.phase==='gap'?s.i-1:s.i)],words=L6_TQ[t.j].split(' '),shown=s.phase==='gap'?words.length:Math.min(s.k,words.length);
   out+=TF(560,60,`${Math.min(8,s.i+1)} / 8 · ${t.hum?'hidden words':'words'}`,13,C.muted,'end');if(s.sim)out+=TF(40,60,'simulated participant',13,C.purple,'start');
   let x=50;const parts=[];for(let k=0;k<shown;k++){const w=words[k],wd=t.hum?Math.max(28,w.length*8):w.length*11+10;parts.push([x,w,wd]);x+=wd+8}
   const shift=Math.max(0,x-550);parts.forEach(([px,w,wd])=>{out+=t.hum?R(px-shift,84,wd,18,C.blue,'none',4,'fill-opacity=".55"'):TF(px-shift,100,w,20,C.ink,'start')});
   if(s.phase==='gap')out+=TF(300,128,'next question coming…',13,C.muted)}
  const ax=v=>110+(clamp(v,-1000,1500)+1000)/2500*420;
  out+=TF(300,170,'Your reply time against the true end of each question',13,C.muted);
  [['words',0,C.blue],['hidden words',1,C.purple]].forEach(([lab,h,col],r)=>{const y=210+r*58;out+=TF(100,y+5,lab,13,col,'end')+L(ax(-1000),y,ax(1500),y,C.grid,1.5);
   const ds=s.data.filter(d=>d.hum===h);ds.forEach((d,m)=>out+=Ci(ax(d.off),y+((m%3)-1)*7,6,col,'#fff'));
   const mn=L6_mean(ds.filter(d=>!d.miss).map(d=>d.off));if(isFinite(mn))out+=L(ax(mn),y-16,ax(mn),y+16,C.ink,2.5)+TF(ax(mn),y+32,`mean ${mn>0?'+':''}${Math.round(mn)} ms`,13,C.ink)});
  out+=L(ax(0),190,ax(0),300,C.green,2)+TF(ax(0),318,'true end',13,C.green);
  [-1000,-500,500,1000,1500].forEach(v=>out+=TF(ax(v),318,(v>0?'+':'')+v,13,C.muted));
  out+=TF(300,346,'Left of the green line: early (you anticipated). Right: late (you reacted).',13,C.muted);
  out+=TF(300,368,s.sim?'A simulated participant: close to the end with words, late and scattered without.':'Compare the spread of the two rows.',13,C.ink);
  return {svg:out,phase:'With the words in view you can see the question’s structure and project its end; with only blocks you can merely react once it stops. In conversation, the words, not just the melody, let us come in on time.'};
 }});
function L6_tpBegin(s,ctx){s.phase='play';s.k=1;s.tok++;s.t0=performance.now();AUDIO.tone(196,{dur:.22,type:'triangle',gain:.06});ctx.every(L6_WMS,'tick',s.tok);ctx.later(L6_TQ[L6_tpOrder(s.seed)[s.i].j].split(' ').length*L6_WMS+2500,'late',s.tok);return 'keep'}
