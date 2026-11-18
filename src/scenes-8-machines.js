/* =====================================================================
 Consciousness era 8 · Machines and open questions.
 The Turing test and ELIZA, the Chinese room and its replies, indicator properties for AI systems, why a
 machine's self-report is weak evidence either way, illusionism and panpsychism, and what could settle the
 question. Nothing here says that any AI system is or is not conscious, and no theory gets the last word.
 Every model is a labelled toy. No sound, no flashing; the only timed steps are slower than 3 per second.
 ===================================================================== */

// Text that wraps inside a given width. The width is budgeted for the phone text scale (1.28×).
const K8_LH=size=>Math.round(size*1.28*1.22);
function K8_wrap(text,w,size=13){
 const max=Math.max(8,Math.floor(w/(size*1.28*.55))),lines=[];let cur='';
 for(const wd of String(text).split(' ')){if(cur&&(cur+' '+wd).length>max){lines.push(cur);cur=wd}else cur=cur?cur+' '+wd:wd}
 if(cur)lines.push(cur);return lines;
}
function K8_para(x,y,text,w,size=13,fill=C.ink,anchor='start',bold=false){
 return K8_wrap(text,w,size).map((l,i)=>(bold?TB:T)(x,y+i*K8_LH(size),l,size,fill,anchor)).join('');
}
// A pressable box with wrapped, centred text.
function K8_btn(X,act,arg,aria,x,y,w,h,label,o={}){
 const size=o.size||13,lines=K8_wrap(label,w-14,size),lh=K8_LH(size),y0=y+h/2-(lines.length-1)*lh/2+size*.42;
 return hit(X,act,arg,aria,R(x,y,w,h,o.fill||'#fff',o.stroke||C.blue,8)+lines.map((l,i)=>(o.bold?TB:T)(x+w/2,y0+i*lh,l,size,o.ink||C.ink)).join(''));
}
const K8_pct=v=>Math.round(v*100)+'%';

/* ---- A small rule script in the style of ELIZA (written for this course; not Weizenbaum's DOCTOR script). ---- */
const K8_REFL={i:'you',me:'you',my:'your',mine:'yours',am:'are',myself:'yourself',you:'I',your:'my',yours:'mine'};
const K8_RULES=[
 {key:'a family word',tpl:'Tell me more about your family.',re:/\b(mother|father|sister|brother|family|mum|dad)\b/},
 {key:'“I am …”',tpl:'How long have you been ___?',re:/\bi am (.+)/},
 {key:'“I feel …”',tpl:'Why do you feel ___?',re:/\bi feel (.+)/},
 {key:'“I want …”',tpl:'What would it mean to you if you got ___?',re:/\bi (?:want|need) (.+)/},
 {key:'“because”',tpl:'Is that the real reason?',re:/\bbecause\b/},
 {key:'“always”, “never”',tpl:'Can you think of a specific example?',re:/\b(always|never|everyone|nobody)\b/},
 {key:'“you”',tpl:'We were discussing you, not me.',re:/\byou\b/},
 {key:'a question mark',tpl:'Why do you ask?',re:/\?/},
 {key:'no keyword',tpl:'Please go on.',re:/.*/}];
function K8_eliza(text){
 const t=String(text).toLowerCase().replace(/[’‘]/g,"'").replace(/\bi'm\b/g,'i am').replace(/[^a-z0-9'? ]/g,' ').replace(/\s+/g,' ').trim();
 if(!t.replace(/\?/g,'').trim())return {rule:-1,reply:'',swaps:[]};
 const body=t.replace(/\?/g,'').trim();
 for(let i=0;i<K8_RULES.length;i++){const r=K8_RULES[i],m=(i===7?t:body).match(r.re);if(!m)continue;
  const swaps=[];let reply=r.tpl;
  if(r.tpl.includes('___')){const words=m[1].split(' ').map(w=>{if(K8_REFL[w]){const pair=w+' → '+K8_REFL[w];if(!swaps.includes(pair))swaps.push(pair);return K8_REFL[w]}return w});reply=r.tpl.replace('___',words.join(' '))}
  return {rule:i,reply,swaps};
 }
 return {rule:8,reply:'Please go on.',swaps:[]};
}

/* ---- A one-item-at-a-time sorting task, shared by three scenes. ---- */
const K8_quizInit=(n,seed)=>({order:seed?shuffled(range(n),seed):range(n),i:0,ans:[],fb:false});
const K8_quizOn={
 ans(s,v){if(s.i>=s.order.length||s.fb)return 'keep';s.ans.push(Number(v));s.fb=true;return 'keep'},
 next(s){if(!s.fb)return 'keep';s.fb=false;s.i++;return 'keep'},
 again(s){Object.assign(s,K8_quizInit(s.order.length,nextSeed()));return 'keep'}};
function K8_quizWatch(n,sim,p){const step=Math.min(2*n,Math.floor(p*(2*n+1)*1.0001)),i=Math.floor(step/2),fb=step%2===1;return {order:range(n),i,ans:sim.slice(0,i+(fb?1:0)),fb,sim:true}}
const K8_quizRight=(s,items)=>s.ans.filter((a,j)=>a===items[s.order[j]].a).length;
function K8_quizDraw(X,s,cfg){
 const n=cfg.items.length,right=K8_quizRight(s,cfg.items);let out=heading(s.sim?cfg.simTitle:cfg.title);
 for(let j=0;j<n;j++){const a=s.ans[j],ok=a===cfg.items[s.order[j]].a;out+=Ci(300+(j-(n-1)/2)*22,50,7,a===undefined?'#fff':ok?C.green:C.coral,a===undefined?C.line:'none')}
 if(s.i>=n)return {svg:out+cfg.done(s,right,n),phase:cfg.donePhase(s,right,n)};
 const it=cfg.items[s.order[s.i]],m=cfg.opts.length,w=(560-(m-1)*10)/m;
 out+=R(20,64,560,156,'#fff',C.line,10)+cfg.card(it);
 cfg.opts.forEach((o,j)=>{const chosen=s.fb&&s.ans[s.i]===j,corr=s.fb&&it.a===j;
  out+=K8_btn(s.fb?null:X,'ans',j,'Answer: '+o,20+j*(w+10),232,w,46,o,{fill:corr?C.greenp:chosen?C.coralp:'#fff',stroke:corr?C.green:chosen?C.coral:C.blue,bold:corr})});
 if(s.fb){const ok=s.ans[s.i]===it.a;
  out+=TB(300,306,ok?'That matches.':'Given here as: '+cfg.opts[it.a].toLowerCase(),14,ok?C.green:C.coral)+K8_btn(X,'next',0,'Next item',220,322,160,42,s.i===n-1?'See the results':'Next',{fill:C.pale});
  return {svg:out,phase:it.why};
 }
 out+=T(300,306,`${s.i+1} of ${n}`,13,C.muted);
 return {svg:out,phase:cfg.ask};
}
const K8_QUIZ_UI=[{b:'Next',act:'next'},{b:'Start again',act:'again'}];

/* =============================== turing-test =============================== */
const K8_SPEC=[
 {b:'Ask for a sonnet',q:'Q: Please write me a sonnet on the subject of the Forth Bridge.',a:'A: Count me out on this one. I never could write poetry.',
  why:'A refusal is a good answer for either player. The judge learns little, which is why Turing lets the judge ask anything at all.'},
 {b:'Ask for a sum',q:'Q: Add 34957 to 70764.',a:'A: (Pause about 30 seconds and then give as answer) 105621.',
  why:'Check it: 34957 + 70764 = 105721, so the printed answer is 100 too small. Turing does not remark on it here, but later in the paper he says a machine playing the game would put in deliberate mistakes, because quick, perfect arithmetic would give it away.'},
 {b:'Ask about chess',q:'Q: I have K at my K1, and no other pieces. You have only K at K6 and R at R1. It is your move. What do you play?',a:'A: (After a pause of 15 seconds) R-R8 mate.',
  why:'The judge may test any skill that can be shown in typed text. Looks, voice and handwriting are kept out on purpose, so that the machine is not marked down for its body.'}];
SCENE({id:'turing-test',name:'The imitation game',tag:'Typed questions through a screen',
 definition:'In Turing’s imitation game a judge exchanges typed messages with two hidden players, a person and a machine, and must say which is which. Alan Turing proposed it in 1950 in place of the question “Can machines think?”, which he thought too unclear to answer.',
 example:'Turing guessed that by about 2000 a machine would play well enough that an average judge would have no more than a 70 per cent chance of identifying it correctly after five minutes of questioning. His paper gives a specimen of the questions a judge might ask: a sonnet, a sum and a chess problem.',
 desc:'A judge on the left of a screen, two hidden players A and B on the right, and three question buttons. Pressing one shows Turing’s specimen question and, after a short pause, the specimen answer.',
 research:'Turing, A. M. (1950). Computing machinery and intelligence. Mind 59, 433–460. The questions and answers shown are the specimen from section 2 of the paper. The paper begins with a game played with a man and a woman, and then puts a machine in one seat.',
 dur:10,hint:'Press a question and wait for the answer. Then check the sum yourself.',
 init:()=>({q:-1,ans:false,tok:0}),
 watch(p){const u=Math.min(2.999,p*3),q=Math.floor(u);return {q,ans:u-q>.4,tok:0}},
 ui:K8_SPEC.map((x,i)=>({b:x.b,act:'ask',arg:i})),
 on:{ask(s,i,ctx){s.q=Number(i);s.ans=false;s.tok++;ctx.later(1200,'reply',s.tok);return 'keep'},reply(s,t){if(Number(t)===s.tok)s.ans=true;return 'keep'}},
 draw(s,f,X){
  let out=heading('The imitation game: only typed text gets through');
  out+=Ci(60,92,22,C.pale,C.blue)+T(60,97,'C',16,C.blue)+T(60,136,'judge',13,C.muted);
  out+=R(193,52,14,96,C.line,'none',4)+arrow(88,82,186,82,C.blue,2)+arrow(186,104,88,104,C.muted,2)+L(210,82,322,82,C.blue,2)+L(210,104,322,104,C.muted,2);
  out+=T(200,170,'typed messages only',13,C.muted);
  out+=R(330,56,110,80,C.purplep,C.purple)+TB(385,92,'A',20,C.purple)+T(385,120,'?',16,C.purple)+R(460,56,110,80,C.purplep,C.purple)+TB(515,92,'B',20,C.purple)+T(515,120,'?',16,C.purple);
  out+=T(450,158,'one person, one machine',13,C.muted);
  K8_SPEC.forEach((x,i)=>out+=K8_btn(X,'ask',i,x.b,20+i*193,184,174,38,x.b,{fill:s.q===i?C.pale:'#fff'}));
  if(s.q<0)return {svg:out+T(300,290,'Choose a question for the hidden player',14,C.muted),phase:'The judge sees only typed answers. Turing’s claim is modest: if a machine’s answers cannot be told from a person’s, we have no better reason to deny that it thinks than we have for another person.'};
  const it=K8_SPEC[s.q];
  out+=K8_para(30,250,it.q,540,13,C.ink)+(s.ans?K8_para(30,302,it.a,540,13,C.blue,'start',true):T(30,302,'… waiting for a reply',13,C.muted,'start'));
  out+=T(300,364,'Specimen from Turing’s 1950 paper; the pauses are shortened here',13,C.muted);
  return {svg:out,phase:s.ans?it.why:'The reply is on its way. In the paper the answers come after a pause, as a person’s would.'};
 }});

const K8_JUDGE=[
 {q:'I am worried about my exams.',a:0},
 {q:'What did you have for breakfast?',r:'Toast. I burnt the first slice and ate it anyway.',a:1,why:'Written by hand for this course. It answers the question that was asked and adds a detail nobody asked for, which a keyword script has no way to do.'},
 {q:'My sister never listens to me.',a:0},
 {q:'Tell me something about yourself.',r:'What do you want to know?',a:1,why:'Written by hand for this course, though it reads like a script. Short, guarded replies from people are often taken for a machine’s: in Jones and Bergen’s 2024 study the human players were judged human only 67% of the time.'},
 {q:'If I stand a book on a glass of water, what is underneath the book?',r:'The glass. And a wet ring on the table, give it an hour.',a:1,why:'Written by hand for this course. The question needs a little knowledge of how things sit on one another, and there is no keyword in it for a script to seize on.'},
 {q:'Can you say “cat” backwards?',a:0}
].map(it=>{if(it.r)return it;const e=K8_eliza(it.q),k=K8_RULES[e.rule];return {...it,r:e.reply,why:`Made by the rule script. It found ${k.key} and filled the template “${k.tpl}”. ${e.rule===6?'It was asked to do something and dodged, because no rule covers the task.':e.rule===0?'It would give this same reply to any sentence that mentions a relative.':'The reply reuses your own words with “my” turned into “your”.'}`}});
SCENE({id:'turing-test-judge',name:'Be the judge',tag:'You take part: script or hand-written?',
 definition:'A judge in the imitation game has only the words to go on. A reply that turns the question back, or reuses the judge’s own words, can come from a simple rule script; it can also come from a cautious person.',
 example:'Six short exchanges follow. Three replies are produced, as you watch, by a small keyword script in the style of ELIZA. Three were written by hand for this course to read as a person’s might. You say which is which.',
 desc:'One exchange at a time: the judge’s line and a reply, with two buttons, Rule script and Hand-written. After each answer the scene says how the reply was made. At the end the learner’s score is drawn beside chance, Turing’s forecast and a published study.',
 research:['Turing, A. M. (1950). Computing machinery and intelligence. Mind 59, 433–460: the forecast of at most 70% correct identification after five minutes.','Jones, C. R. & Bergen, B. K. (2024). People cannot distinguish GPT-4 from a human in a Turing test (preprint). In five-minute text chats, judges called GPT-4 human 54% of the time, ELIZA 22% and the human players 67%. One study with one set-up; passing rates depend heavily on the judges and the instructions.'],
 dur:12,hint:'Read the reply and choose. Six items take about a minute. Your answers stay on this page.',
 init:()=>K8_quizInit(6,0),
 watch:p=>K8_quizWatch(6,[0,1,0,0,1,1],p),
 ui:K8_QUIZ_UI,on:K8_quizOn,
 draw(s,f,X){return K8_quizDraw(X,s,{title:'Rule script, or written by hand?',simTitle:'A simulated judge decides',items:K8_JUDGE,opts:['Rule script','Hand-written'],
  ask:'Was this reply made by the keyword script or written by hand? Look for whether it deals with what was actually said.',
  card:it=>TB(36,90,'Judge types:',13,C.muted,'start')+K8_para(36,112,it.q,524)+TB(36,160,'Reply:',13,C.muted,'start')+K8_para(36,182,it.r,524,13,C.blue),
  done(s2,right,n){
   const bx=190,bw=350;let o=TB(300,84,`${s2.sim?'Simulated judge':'You'}: ${right} of ${n} right (${K8_pct(right/n)})`,15,C.ink);
   o+=R(bx,96,bw,18,C.pale,'none',4)+R(bx,96,bw*right/n,18,C.blue,'none',4)+L(bx+bw*.5,90,bx+bw*.5,120,C.muted,2,'stroke-dasharray="4 3"')+L(bx+bw*.7,90,bx+bw*.7,120,C.coral,2,'stroke-dasharray="4 3"');
   o+=T(20,110,'right answers',13,C.muted,'start')+T(bx+bw*.5-6,138,'chance 50%',13,C.muted,'end')+T(580,160,'Turing’s forecast: 70%',13,C.coral,'end');
   o+=TB(20,192,'Published: judged to be human (Jones & Bergen 2024)',13,C.ink,'start');
   [['human players',.67,C.green],['GPT-4',.54,C.purple],['ELIZA',.22,C.amber]].forEach(([l,v,c],j)=>{const y=208+j*34;o+=T(20,y+15,l,13,C.muted,'start')+R(bx,y,bw,18,C.pale,'none',4)+R(bx,y,bw*v,18,c,'none',4)+TB(bx+bw*v+8,y+15,K8_pct(v),13,c,'start')});
   o+=K8_para(300,330,'Six replies are too few to measure anyone. The point is what you looked for.',560,13,C.muted,'middle');
   return o;
  },
  donePhase:(s2,right,n)=>`${right} of ${n}. Whatever the score, notice your method: you looked for replies that dealt with what was said. That is evidence about skill in conversation. The published bars show that people are misjudged too, and that a system from 1966 still fools some judges.`
 })}});

const K8_PRESETS=['I am tired of my job','My brother never phones','Do you understand me?'];
SCENE({id:'turing-test-eliza',name:'ELIZA',tag:'Type to a keyword script',
 definition:'ELIZA, written by Joseph Weizenbaum at MIT and published in 1966, answered typed sentences by spotting keywords and filling in reply templates. Its best-known script, DOCTOR, played a psychotherapist who turns each statement back into a question.',
 example:'Weizenbaum reported that people who knew ELIZA was a program still confided in it and credited it with understanding. That readiness is now called the ELIZA effect. He came to regard it as a warning about people more than as an achievement of the program.',
 desc:'The learner’s typed sentence at the top, a list of nine keyword rules with the one that fired highlighted, the reply template with any swapped words, and the script’s reply at the bottom.',
 research:['Weizenbaum, J. (1966). ELIZA: a computer program for the study of natural language communication between man and machine. Communications of the ACM 9, 36–45.','Weizenbaum, J. (1976). Computer Power and Human Reason. W. H. Freeman. The rules here are a small script written for this course in ELIZA’s style, not Weizenbaum’s original.'],
 dur:10,hint:'Type a short sentence, or press an example. The first rule in the list that matches is the one used. Nothing you type leaves this page.',
 init:()=>({text:K8_PRESETS[0]}),
 watch(p){return {text:K8_PRESETS[Math.min(2,Math.floor(p*3))]}},
 ui:[{text:'t',label:'Say something',max:44,get:s=>s.text,act:'t'},{b:'About work',act:'pre',arg:0},{b:'About family',act:'pre',arg:1},{b:'A question',act:'pre',arg:2}],
 on:{t(s,v){s.text=String(v).slice(0,44);return 'keep'},pre(s,i){s.text=K8_PRESETS[Number(i)];return 'keep'}},
 draw(s){
  const e=K8_eliza(s.text);let out=heading('Find a keyword, fill a template');
  out+=R(20,42,560,34,C.pale,'none',8)+T(32,64,'You: '+(s.text||'…'),13,C.ink,'start');
  out+=TB(20,98,'Rules, tried in order',13,C.muted,'start');
  K8_RULES.forEach((r,i)=>{const y=104+i*23,on=i===e.rule;out+=R(20,y,270,21,on?C.amberp:'#fff',on?C.amber:C.grid,5)+(on?TB:T)(30,y+16,`${i+1}. ${r.key}`,13,on?C.amber:C.muted,'start')});
  if(e.rule<0)return {svg:out+K8_para(315,130,'Type a sentence to see which rule fires.',250,13,C.muted),phase:'The script waits for some words. It has nine rules and nothing else.'};
  const r=K8_RULES[e.rule];
  out+=arrow(292,115+e.rule*23,312,150,C.amber,2)+TB(318,98,'Template',13,C.muted,'start')+K8_para(318,122,r.tpl,256,13,C.ink);
  out+=TB(318,196,'Words swapped',13,C.muted,'start')+K8_para(318,220,e.swaps.length?e.swaps.join(', '):r.tpl.includes('___')?'none needed':'none: the reply is fixed',256,13,C.ink);
  out+=TB(318,278,'What it knows of your topic',13,C.muted,'start')+T(318,300,'nothing',13,C.coral,'start');
  out+=R(20,322,560,50,C.greenp,C.green,8)+K8_para(32,343,'Script: '+e.reply,536,13,C.ink);
  return {svg:out,phase:e.rule===8?'No keyword matched, so the script used its stock line. A real ELIZA had more such lines and rotated them, which made the gaps harder to spot.':`Rule ${e.rule+1} fired on ${r.key}. ${e.swaps.length?'The rest of your sentence was copied back with '+e.swaps.join(' and ')+'. ':''}The script holds no information about your topic, yet the reply can feel attentive. Weizenbaum found that feeling hard to shake even in people who knew how it worked.`};
 }});

const K8_SHOWS=[
 {q:'It can keep up a typed conversation that judges cannot tell from a person’s.',short:'Human-like typed conversation',a:0,why:'This is exactly what the test measures, and all that it measures directly. Everything else is an inference from it.'},
 {q:'It has experiences: there is something it is like to be it.',short:'Experience',a:1,why:'Turing did not claim this. He wrote that there is a mystery about consciousness, and that it need not be solved before answering his question. To the “argument from consciousness” he replied that we credit other people with thought on the same evidence, their behaviour, and that demanding more leads to solipsism.'},
 {q:'It understands the words it uses.',short:'Understanding',a:2,why:'Disputed. Searle’s Chinese room (the next lesson) is an argument that the right answers can come without understanding. Many functionalists reply that being able to answer anything a judge asks is what understanding is.'},
 {q:'A machine that fails the test cannot think.',short:'Failing means no thought',a:1,why:'Turing himself raised this. A machine might do something that deserves to be called thinking and yet is very unlike what a person does. The game is offered as a sufficient test, not a necessary one.'},
 {q:'It can see, move about and act in the world.',short:'Seeing and acting',a:1,why:'The test is typed text only, by design. Stevan Harnad (1991) proposed a “total Turing test” that adds a robot’s abilities, on the ground that words alone leave too much out.'}];
SCENE({id:'turing-test-objection',name:'What passing would show',tag:'Sort five claims',
 definition:'The Turing test measures behaviour in conversation. Turing answered the “argument from consciousness”, that a machine must feel what it writes, by pointing out that the only way to be sure anyone feels is to be them, and that we do not ask this of each other.',
 example:'Turing quotes the surgeon Geoffrey Jefferson, who said in 1949 that no machine could equal a brain until it wrote a sonnet “because of thoughts and emotions felt, and not by the chance fall of symbols”. Turing’s reply is that an oral examination on the sonnet is the test we already use for people.',
 desc:'Five claims about a machine that passes the test, shown one at a time, each sorted into Shows, Does not show or Disputed, with the reason given after each answer and a summary table at the end.',
 research:['Turing, A. M. (1950). Computing machinery and intelligence. Mind 59, 433–460, section 6, objection 4.','Jefferson, G. (1949). The mind of mechanical man. British Medical Journal 1, 1105–1110.','Harnad, S. (1991). Other bodies, other minds: a machine incarnation of an old philosophical problem. Minds and Machines 1, 43–54. What passing shows about understanding is contested.'],
 dur:12,hint:'Decide what a pass would show for each claim. “Disputed” is a real answer here.',
 init:()=>K8_quizInit(5,0),
 watch:p=>K8_quizWatch(5,[0,1,0,1,1],p),
 ui:K8_QUIZ_UI,on:K8_quizOn,
 draw(s,f,X){return K8_quizDraw(X,s,{title:'A machine passes. What does that show?',simTitle:'A simulated learner sorts the claims',items:K8_SHOWS,opts:['Shows','Does not show','Disputed'],
  ask:'Suppose a machine passes. Does that show this claim, fail to show it, or is it in dispute?',
  card:it=>TB(36,92,'Claim',13,C.muted,'start')+K8_para(36,122,it.q,524,15,C.ink),
  done(s2,right,n){let o=TB(300,84,`${s2.sim?'Simulated learner':'You'}: ${right} of ${n} match the reading given here`,14,C.ink);
   K8_SHOWS.forEach((it,j)=>{const y=104+j*44,c=[C.green,C.coral,C.amber][it.a];o+=R(20,y,560,38,'#fff',C.grid,8)+T(32,y+24,it.short,13,C.ink,'start')+TB(568,y+24,['shows','does not show','disputed'][it.a],13,c,'end')});
   return o+T(300,350,'One line out of five is what the test measures',13,C.muted)},
  donePhase:()=>'The test is a measure of conversation. Whether skill in conversation is enough for understanding is disputed, and Turing set the question of experience to one side instead of answering it.'
 })}});

/* =============================== chinese-room =============================== */
const K8_GL=['M2 4H18M10 4V17M4 17H16','M4 2V18M4 10H16M16 5V15','M3 3L17 17M17 3L3 17M3 10H17','M3 6H17V16H3ZM10 2V18','M4 4Q10 13 16 4M4 17Q10 8 16 17','M3 17L10 3L17 17M6 11H14M10 11V18','M3 5H17M3 10H17M3 15H17M6 2V18','M10 3A7 7 0 1 1 9.9 3M10 3V17','M3 3H17L3 17H17','M3 10L10 3L17 10L10 17ZM10 7V13'];
const K8_glyph=(i,x,y,sz=28,col=C.ink)=>`<g transform="translate(${fmt(x)} ${fmt(y)}) scale(${fmt(sz/20)})">`+P(K8_GL[i],col,2)+'</g>';
const K8_glyphs=(arr,x,y,sz=28,col=C.ink)=>arr.map((g,i)=>K8_glyph(g,x+i*(sz+8),y,sz,col)).join('');
const K8_BOOK=[{inp:[0,3,5],out:[7,2],en:'“Did he eat the hamburger?” → “He did not.”'},{inp:[0,5,3],out:[4,9],en:'“Was the hamburger burnt?” → “Yes, badly.”'},{inp:[6,3,5],out:[1,8],en:'“Did he leave a tip?” → “No tip.”'}];
SCENE({id:'chinese-room',name:'The Chinese room',tag:'You take part: follow the rule book',
 definition:'The Chinese room is John Searle’s 1980 thought experiment. A person who knows no Chinese sits in a room with a book of rules, in English, for matching Chinese symbols by their shapes. Questions come in, the rules are followed, and answers go out that Chinese readers find correct. Searle’s claim is that the person understands nothing, and that a computer running the same program is in the same position.',
 example:'Here you are the person in the room. Invented shapes stand in for Chinese characters, so that no reader has a head start. Match each incoming card to a rule and pass out the answer. Then ask what the cards meant.',
 desc:'A card of three shapes comes in on the left. A rule book in the middle has three rules, each a pattern of shapes and an answer. Pressing the matching rule passes the answer out on the right. Tiles count cards passed out, answers judged right outside, and meanings known, which stays at zero.',
 research:'Searle, J. R. (1980). Minds, brains, and programs. Behavioral and Brain Sciences 3, 417–457. His target is “strong AI”: the claim that running the right program is enough for understanding. The story questions follow his example of a program that answers questions about a restaurant story.',
 dur:12,hint:'Compare the shapes on the incoming card with each rule and press the rule that matches. There are three cards.',
 init:()=>({order:[1,2,0],i:0,wrong:false,reveal:false}),
 watch(p){return {order:[1,2,0],i:Math.min(3,Math.floor(p*4.4)),wrong:false,reveal:p>.84,sim:true}},
 ui:[{b:'What did it mean?',act:'reveal'},{b:'New cards',act:'again'}],
 on:{pick(s,r){if(s.i>=3)return 'keep';if(Number(r)===s.order[s.i]){s.i++;s.wrong=false}else s.wrong=true;return 'keep'},
  reveal(s){if(s.i>=3)s.reveal=true;else s.ask=true;return 'keep'},
  again(s){s.order=shuffled([0,1,2],nextSeed());s.i=0;s.wrong=false;s.reveal=false;s.ask=false;return 'keep'}},
 draw(s,f,X){
  const done=s.i>=3,cur=done?null:K8_BOOK[s.order[s.i]],last=s.i>0?K8_BOOK[s.order[s.i-1]]:null;
  let out=heading(s.sim?'A simulated visitor follows the rules':'Match the shapes, pass out the answer');
  out+=R(20,52,150,84,'#fff',C.line)+T(30,70,'in',13,C.muted,'start')+(cur?K8_glyphs(cur.inp,34,86,30):T(95,104,'no more cards',13,C.muted));
  out+=T(95,158,done?'3 cards done':`card ${s.i+1} of 3`,13,C.muted);
  out+=R(184,44,236,192,C.amberp,C.amber)+T(302,62,'rule book',13,C.amber);
  K8_BOOK.forEach((b,i)=>{out+=hit(X,'pick',i,`Rule ${i+1}`,R(194,70+i*54,216,48,'#fff',C.line,8)+TB(208,100+i*54,String(i+1),14,C.muted)+K8_glyphs(b.inp,218,80+i*54,26)+arrow(320,94+i*54,338,94+i*54,C.amber,2,7)+K8_glyphs(b.out,342,80+i*54,26,C.blue))});
  out+=R(435,52,145,84,'#fff',C.line)+T(445,70,'out',13,C.muted,'start')+(last?K8_glyphs(last.out,466,86,30,C.blue):'');
  out+=T(507,158,s.wrong?'not a match':last?'passed out':'',13,s.wrong?C.coral:C.green);
  out+=counter(20,244,'cards passed out',s.i+' of 3',C.blue,180)+counter(210,244,'right, say readers outside',s.i+' of '+s.i,C.green,180)+counter(400,244,'meanings you know',s.reveal?'0 until told':'0',C.coral,180);
  if(s.reveal)K8_BOOK.forEach((b,i)=>out+=T(20,314+i*22,`Rule ${i+1}: ${b.en}`,13,C.ink,'start'));
  else out+=K8_para(300,322,done?'All three answers were right. Press “What did it mean?”':'To readers outside, each card is a question about a story.',560,13,C.muted,'middle');
  const phase=s.reveal?'You answered three questions about a man who walked out of a restaurant, and answered them correctly, without knowing that was the subject. Searle says a computer has only what you had: shapes and rules. The systems reply, in the next scene, says the understanding was never supposed to be yours.'
   :s.wrong?'That rule’s pattern is not the same as the card. Compare the shapes one at a time, in order. Rules 1 and 2 use the same three shapes in a different order.'
   :done?'Every answer was right, and you did it by comparing shapes. Ask what the cards meant.':s.ask&&!done?'Finish the three cards first; then the meanings can be shown.':'Find the rule whose three shapes match the incoming card, in the same order, and press it.';
  return {svg:out,phase};
 }});

const K8_REPLIES={
 systems:{name:'Systems reply',steps:[
  ['The reply','The man is one part. Understanding belongs to the whole system: man, book, paper and room.','The systems reply grants that the man does not understand. It says he is like one part of a brain: the understanding, if there is any, belongs to the whole system of person, rule book and workings.'],
  ['Searle answers','Let him memorise the book and work in his head, outdoors. He is now the whole system and still understands nothing.','Searle’s answer: let the man memorise the rules and do everything in his head. Now there is nothing in the system that is not in him, and he still understands no Chinese.'],
  ['Comeback','Then he runs a second system he has no access to. Whether that system understands is the question again.','The comeback: a person who memorised the rules would be running a second, virtual system that he cannot read from the inside. His not understanding does not settle whether it does. Searle finds that incredible; others find it the natural thing to say.']]},
 robot:{name:'Robot reply',steps:[
  ['The reply','Put the program in a robot with a camera and limbs. Its symbols would then be tied to things.','The robot reply says the room lacks contact with the world. Give the program a body that sees and acts, and its symbols would be connected to the things they are about.'],
  ['Searle answers','The camera’s signals reach the man as more symbols. He still only matches shapes.','Searle’s answer: put the man inside the robot. The camera’s output arrives as more symbols and his output moves the limbs, without his knowing either fact. Searle adds that the reply concedes his point, that symbol manipulation alone is not enough.'],
  ['Comeback','Symbols caused by the things they stand for are no longer only shapes (the symbol grounding problem).','The comeback: symbols that are caused by objects and used to act on them are grounded in a way the room’s symbols are not. Harnad (1990) called the question of how this could work the symbol grounding problem. Whether grounding is enough for understanding is unsettled.']]},
 brain:{name:'Brain simulator reply',steps:[
  ['The reply','Let the program copy, neuron by neuron, the brain of a Chinese speaker as she answers.','The brain simulator reply: suppose the program does not follow rules about symbols but simulates, firing by firing, the brain of a Chinese speaker. To deny that this understands seems to deny that she does.'],
  ['Searle answers','The man could run it with water pipes and valves. It copies the pattern of firing, not what neurons do.','Searle’s answer: have the man work a system of water pipes and valves arranged like the neurons. It simulates the formal pattern of firing, not the causal powers of the brain, and a simulation of a storm leaves everyone dry.'],
  ['Comeback','Replace real neurons one at a time with parts that do the same job. When would understanding stop?','The comeback is the replacement argument from era 1: swap a speaker’s neurons one at a time for parts that do the same job. If nothing changes in behaviour, it is hard to say when understanding would stop. Searle accepts that behaviour might stay the same and holds that understanding could still go.']]}};
SCENE({id:'chinese-room-replies',name:'Three replies to Searle',tag:'Step through each exchange',
 definition:'Searle’s paper was published with replies, and he answered each. The systems reply locates understanding in the whole room. The robot reply adds a body with senses. The brain simulator reply has the program copy a Chinese speaker’s brain. Each exchange is still argued over.',
 example:'To the systems reply Searle says: let the man memorise the rule book. To the robot reply: the camera’s signals arrive as more symbols. To the brain simulator: the man could run it with water pipes and still understand nothing.',
 desc:'A drawing of the room that changes with each reply: the whole room outlined, the rule book moved into the man’s head, a camera and wheels added, or a network of neurons replaced by pipes. Below it, the current step of the exchange in words. The learner’s own verdict on each reply is recorded.',
 research:['Searle, J. R. (1980). Minds, brains, and programs. Behavioral and Brain Sciences 3, 417–457, with the replies he labels by where he met them (Berkeley, Yale, MIT).','Harnad, S. (1990). The symbol grounding problem. Physica D 42, 335–346.','Cole, D. The Chinese room argument. Stanford Encyclopedia of Philosophy. Status: contested; there is no agreed diagnosis of what, if anything, is wrong with the argument.'],
 dur:18,hint:'Choose a reply, step through the reply, Searle’s answer and the comeback, then record who you think has the better of it.',
 init:()=>({reply:'all',votes:{}}),
 trace(s){const keys=s.reply==='all'?['systems','robot','brain']:[s.reply],fr=[];for(const k of keys)K8_REPLIES[k].steps.forEach((st,i)=>fr.push({reply:k,step:i,say:st[2]}));return fr},
 ui:[{choose:[['all','All'],['systems','Systems'],['robot','Robot'],['brain','Brain']],label:'Which reply',get:s=>s.reply,act:'reply'},
  {choose:[['searle','Searle'],['reply','The reply'],['unsure','Unsure']],label:'Who has the better of this one?',get:(s)=>s.last||'',act:'vote'}],
 on:{reply(s,v){s.reply=v;s.last=''},vote(s,v,ctx){const fr=ctx.frames&&ctx.frames[ctx.k];if(fr){s.votes[fr.reply]=v;s.last=v}return 'keep'}},
 draw(s,f,X){
  const k=f.reply,st=f.step,rp=K8_REPLIES[k];let out=heading(rp.name+': '+rp.steps[st][0].toLowerCase());
  const vt=['systems','robot','brain'].map(q=>q+': '+({searle:'Searle',reply:'the reply',unsure:'unsure'}[s.votes[q]]||'–')).join(' · ');
  out+=T(300,370,'your verdicts: '+vt,13,C.muted);
  const room=!(k==='systems'&&st>0),man=(x,y)=>Ci(x,y,13,'#fff',C.ink)+L(x,y+13,x,y+48,C.ink,3)+L(x-16,y+28,x+16,y+28,C.ink,3);
  if(room)out+=R(205,70,190,150,'#fff',k==='systems'&&st===0?C.green:C.line,6,k==='systems'&&st===0?'stroke-width="5"':'')+arrow(160,150,203,150,C.muted,2)+arrow(397,150,440,150,C.muted,2)+T(180,172,'in',13,C.muted)+T(420,172,'out',13,C.muted);
  if(k==='systems'){
   out+=man(280,120);
   if(st===0)out+=R(318,150,44,32,C.amberp,C.amber,4)+T(340,205,'rules',13,C.amber)+T(300,244,'the whole system',13,C.green);
   else{out+=R(271,112,18,13,C.amberp,C.amber,2)+T(300,205,'rules memorised: no room',13,C.amber);
    if(st===2)out+=Ci(280,140,58,'none',C.purple,'stroke-dasharray="6 5"')+T(300,244,'a second system, run by him?',13,C.purple)}
  }else if(k==='robot'){
   out+=man(280,105)+R(318,138,44,32,C.amberp,C.amber,4)+Ci(240,226,12,C.line,C.muted)+Ci(360,226,12,C.line,C.muted)+R(222,56,34,18,C.pale,C.blue,4)+L(205,65,222,65,C.blue,3);
   out+=T(120,62,'camera',13,C.blue);
   if(st>=1)out+=arrow(240,76,262,128,C.blue,2)+K8_glyph(3,214,92,20,C.blue)+T(488,100,'more symbols',13,C.blue);
   if(st===2)out+=P('M60 200L78 168L96 200Z',C.green,2,C.greenp)+L(84,166,220,70,C.green,2,'stroke-dasharray="5 4"')+T(78,222,'a thing',13,C.green)+T(488,200,'caused by things',13,C.green);
  }else{
   const pts=[[240,100],[290,90],[345,105],[255,150],[310,145],[355,160],[280,195],[335,195]],ed=[[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5],[3,6],[4,7],[6,7],[4,6]];
   const pipe=st===1,nrep=st===2?4:0;
   ed.forEach(([a,b])=>out+=L(pts[a][0],pts[a][1],pts[b][0],pts[b][1],pipe?C.blue:C.line,pipe?5:2));
   pts.forEach((q,i)=>out+=pipe?R(q[0]-6,q[1]-6,12,12,'#fff',C.blue,2):Ci(q[0],q[1],8,i<nrep?C.amberp:C.purplep,i<nrep?C.amber:C.purple));
   out+=T(300,244,pipe?'pipes and valves, worked by the man':st===2?'4 of 8 neurons replaced: still understands?':'a simulated brain of a Chinese speaker',13,pipe?C.blue:st===2?C.amber:C.purple);
  }
  out+=TB(20,278,rp.steps[st][0],14,st===1?C.coral:st===0?C.green:C.purple,'start')+K8_para(20,300,rp.steps[st][1],560,13,C.ink);
  return {svg:out};
 }});

const K8_READS={story:['A question about a story','“Did he eat the hamburger?”','“He did not.”'],chess:['A move in a chess game','“Pawn to e4”','“Pawn to e5”'],none:['Marks with no reading at all','no message','no message']};
const K8_ASKS={und:['If Searle is right','Following a program is never enough, by itself, for understanding, whatever the program.','What it leaves open','A machine might understand: Searle says brains are machines. And whose understanding is in question, the man’s or the system’s?'],
 exp:['Searle’s wider view','A program alone is not enough for experience either. Brains cause it; a simulated storm wets nothing.','Where it does not reach','The 1980 paper is about understanding, not feeling. The man is conscious all along, so the story shows nothing about what the system feels.']};
SCENE({id:'chinese-room-syntax',name:'Rules without meanings',tag:'Change the reading, then the question',
 definition:'Searle’s argument in outline: a program is defined by rules for shuffling symbols according to their shapes (syntax); understanding involves what the symbols mean (semantics); and the rules alone do not supply the meanings. The argument is about understanding. Whether it carries over to experience is a further question.',
 example:'The rule book mentions shapes and never says what any shape stands for. Read from outside, the same card-matching could be a conversation about a story or moves in a game. Nothing the person in the room does would differ.',
 desc:'On the left, what happens inside the room: a card of shapes, a rule and an answer card, the same in every case. On the right, how people outside read the exchange, which changes with the chosen reading. Below, two panels: what the argument claims and what it leaves open, for understanding or for experience.',
 research:['Searle, J. R. (1980). Minds, brains, and programs. Behavioral and Brain Sciences 3, 417–457.','Searle, J. R. (1990). Is the brain’s mind a computer program? Scientific American 262(1), 26–31, where the argument is set out as numbered axioms. The switch of readings here is a toy illustration, not part of Searle’s paper. Contested throughout.'],
 dur:12,hint:'Change how the cards are read outside and watch the left panel. Then switch the question from understanding to experience.',
 init:()=>({read:'story',ask:'und'}),
 watch(p){return {read:['story','chess','none'][Math.min(2,Math.floor(p*2*3)%3)],ask:p<.5?'und':'exp'}},
 ui:[{choose:[['story','Story'],['chess','Chess'],['none','No reading']],label:'Read outside as',get:s=>s.read,act:'read'},{choose:[['und','Understanding'],['exp','Experience']],label:'Ask about',get:s=>s.ask,act:'ask'}],
 on:{read(s,v){s.read=v;return 'keep'},ask(s,v){s.ask=v;return 'keep'}},
 draw(s){
  const rd=K8_READS[s.read],ak=K8_ASKS[s.ask];let out=heading('The same rule-following under different readings');
  out+=R(20,44,275,150,'#fff',C.line)+TB(32,66,'Inside the room',13,C.muted,'start')+K8_glyphs(K8_BOOK[0].inp,36,80,26)+arrow(144,93,170,93,C.amber,2,7)+K8_glyphs(K8_BOOK[0].out,180,80,26,C.blue);
  out+=T(32,136,'shapes matched: 3',13,C.ink,'start')+T(32,158,'meanings used: 0',13,C.ink,'start')+TB(32,182,'the same in every reading',13,C.green,'start');
  out+=R(305,44,275,150,C.pale,'none')+TB(317,66,'Read from outside',13,C.muted,'start')+K8_para(317,90,rd[0],250,13,C.ink,'start',true)+T(317,136,'in: '+rd[1],13,C.ink,'start')+T(317,160,'out: '+rd[2],13,C.blue,'start');
  out+=R(20,204,275,168,C.coralp,'none')+TB(32,226,ak[0],13,C.coral,'start')+K8_para(32,248,ak[1],252,13,C.ink);
  out+=R(305,204,275,168,C.greenp,'none')+TB(317,226,ak[2],13,C.green,'start')+K8_para(317,248,ak[3],252,13,C.ink);
  return {svg:out,phase:s.ask==='und'?(s.read==='none'?'With no reading at all the person does exactly the same work. That is Searle’s point about syntax: the rules never needed the meanings. His critics answer that meaning might lie in how the whole system is connected and used, which a list of rules does not show.':'Change the reading and the left panel does not move. The rules are about shapes. Searle concludes that running them cannot be what understanding consists in; the replies in the last scene dispute what follows from that.')
   :'Understanding and experience are different questions. Searle held that both need the causal powers of a brain, which is a further claim (he called it biological naturalism). The room story itself cannot settle it, because the one mind we can question in it, the man’s, is conscious throughout.'};
 }});

/* =============================== machine-indicators =============================== */
const K8_FAM=[
 {n:'Recurrent processing',c:C.blue,ind:['Input modules that use recurrence: signals loop back','Organised, integrated perceptual representations']},
 {n:'Global workspace',c:C.green,ind:['Several specialised systems working in parallel','A limited-capacity workspace: a bottleneck','Global broadcast to all modules','State-dependent attention that can query modules in turn']},
 {n:'Higher-order theories',c:C.purple,ind:['Generative, top-down or noisy perception','Metacognitive monitoring: telling reliable percepts from noise','Agency guided by beliefs that monitoring updates','Sparse, smooth coding: a “quality space”']},
 {n:'Attention schema',c:C.amber,ind:['A predictive model of the state of its own attention, used to control it']},
 {n:'Predictive processing',c:C.coral,ind:['Input modules that use predictive coding']},
 {n:'Agency and embodiment',c:C.dark,ind:['Agency: learns from feedback and pursues goals, weighing competing ones','Embodiment: models how its outputs change its inputs']}];
SCENE({id:'machine-indicators',name:'Indicator properties',tag:'From theories to a checklist',
 definition:'An indicator property is a feature of a system’s architecture that some scientific theory of consciousness treats as necessary for, or a sign of, consciousness. In 2023 Patrick Butlin, Robert Long and colleagues drew fourteen such properties from the theories and proposed checking AI systems for them, instead of judging by behaviour.',
 example:'From global workspace theory comes “a limited-capacity workspace” and “global broadcast”; from higher-order theories, “metacognitive monitoring”. The authors found that no system they assessed was a strong candidate, and that they could see no obvious technical barrier to building systems that have the properties.',
 desc:'Six groups on the left, five theories plus agency and embodiment, each with the number of indicators it supplies. Pressing a group lists its indicators on the right. The counts add to fourteen.',
 research:'Butlin, P., Long, R. et al. (2023). Consciousness in artificial intelligence: insights from the science of consciousness. arXiv:2308.08708. The method assumes computational functionalism and takes no stand on which theory is right; integrated information theory is left out because it denies that assumption. Wording of the indicators is shortened here.',
 dur:12,hint:'Press each group to see what it asks of a system. Count the indicators: they should come to fourteen.',
 init:()=>({fam:1}),
 watch(p){return {fam:Math.min(5,Math.floor(p*6))}},
 ui:[{b:'Next group',act:'next'}],
 on:{fam(s,i){s.fam=Number(i);return 'keep'},next(s){s.fam=(s.fam+1)%6;return 'keep'}},
 draw(s,f,X){
  const fm=K8_FAM[s.fam];let out=heading('Fourteen indicators from five theories and two extras');
  K8_FAM.forEach((g,i)=>{const y=46+i*48,on=i===s.fam;
   out+=hit(X,'fam',i,`${g.n}: ${g.ind.length} indicators`,R(20,y,210,42,on?C.pale:'#fff',on?g.c:C.grid,8)+K8_para(30,y+(K8_wrap(g.n,150).length>1?17:26),g.n,150,13,C.ink,'start',on)+Ci(208,y+21,13,g.c)+TB(208,y+26,String(g.ind.length),14,'#fff'))});
  out+=R(245,46,335,282,'#fff',fm.c,10)+TB(259,70,fm.n,14,fm.c,'start');
  let y=96;fm.ind.forEach((t,i)=>{const ls=K8_wrap(t,290);out+=Ci(262,y-5,4,fm.c)+K8_para(274,y,t,290,13,C.ink);y+=ls.length*K8_LH(13)+12});
  out+=T(300,356,'2 + 4 + 4 + 1 + 1 + 2 = 14 indicators',14,C.ink);
  return {svg:out,phase:`${fm.n} supplies ${fm.ind.length} of the fourteen. The list is a tool for asking a sharper question of a system’s design. It does not say how many indicators would be enough, and it inherits every doubt about the theories it is built from.`};
 }});

const K8_IND=['Recurrence: signals loop back','A limited workspace: a bottleneck','Global broadcast to all modules','Monitors how reliable its percepts are','A model of its own attention','Pursues goals, learning from feedback'];
const K8_SYS=[
 {n:'One-pass sorter',d:'A picture passes once through a stack of layers and a label comes out. Nothing loops back, nothing is kept between pictures, and it has no goals.',t:[0,0,0,0,0,0]},
 {n:'Game agent',d:'A network whose layers feed back on themselves, so each step depends on earlier ones. It learns from reward to reach goals in a game.',t:[1,0,0,0,0,1]},
 {n:'Workspace agent',d:'Looping modules for vision, memory and planning compete for a small shared store, and the winner is sent to all of them. A monitor rates how far its vision can be trusted. It learns from reward.',t:[1,1,1,1,0,1]}];
SCENE({id:'machine-indicators-checklist',name:'Tick the indicators',tag:'You take part: assess three designs',
 definition:'To apply the indicator method, read a description of how a system is built and tick each property that the description supports. The assessment is of architecture: what parts there are and how information moves between them. What the system says or how clever it seems plays no part.',
 example:'A network that maps a picture to a label in one pass has no recurrence, no workspace and no goals. Add loops and learning from reward and two boxes can be ticked. The three designs here are invented for the exercise; they are not real products.',
 desc:'A written description of one of three invented systems, six indicator rows with tick boxes, and a Check button. After checking, each row is marked right, missed, or not in the description, and the number of indicators met is given.',
 research:'Butlin, P., Long, R. et al. (2023). Consciousness in artificial intelligence. arXiv:2308.08708. The report assessed several real systems this way, including large language models and agents with bodies or virtual bodies, and judged none a strong candidate. Six of the fourteen indicators are used here, with shortened wording.',
 dur:14,hint:'Choose a design, read it, tick what it supports and press Check. Tick only what the description says.',
 init:()=>({sys:0,ticks:[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],checked:[false,false,false]}),
 watch(p){const u=Math.min(2.999,p*3),sys=Math.floor(u),fr=u-sys,ticks=K8_SYS.map((q,i)=>i<sys?q.t.slice():i===sys?q.t.map((v,j)=>v&&fr>(j+1)/9?1:0):[0,0,0,0,0,0]);return {sys,ticks,checked:[sys>0||fr>.75,sys>1||(sys===1&&fr>.75),sys===2&&fr>.75],sim:true}},
 ui:[{choose:K8_SYS.map((q,i)=>[i,q.n]),label:'Design',get:s=>s.sys,act:'sys'},{b:'Check',act:'check'}],
 on:{sys(s,v){s.sys=Number(v);return 'keep'},tick(s,j){j=Number(j);s.ticks[s.sys][j]=s.ticks[s.sys][j]?0:1;s.checked[s.sys]=false;return 'keep'},check(s){s.checked[s.sys]=true;return 'keep'}},
 draw(s,f,X){
  const q=K8_SYS[s.sys],tk=s.ticks[s.sys],ch=s.checked[s.sys],met=sum(q.t),ok=tk.filter((v,j)=>v===q.t[j]).length;
  let out=heading((s.sim?'A simulated assessor: ':'')+q.n);
  out+=R(20,40,560,92,C.pale,'none')+K8_para(30,60,q.d,540,13,C.ink);
  K8_IND.forEach((t,j)=>{const y=138+j*32,on=!!tk[j],good=on===!!q.t[j];
   out+=hit(X,'tick',j,`${t}: ${on?'ticked':'not ticked'}`,R(20,y,26,26,on?C.blue:'#fff',C.blue,6)+(on?P(`M26 ${y+13}L31 ${y+19}L41 ${y+7}`,'#fff',3):'')+T(56,y+18,t,13,C.ink,'start'));
   if(ch)out+=TB(580,y+18,good?'right':q.t[j]?'missed':'not there',13,good?C.green:C.coral,'end')});
  out+=ch?TB(300,352,`${ok} of 6 rows right · this design meets ${met} of the 6`,13,ok===6?C.green:C.ink):T(300,352,'tick what the description supports, then Check',13,C.muted);
  return {svg:out,phase:ch?`The description supports ${met} of these six indicators. That is a count of properties, not a probability that the system is conscious: the report gives no formula for turning ticks into a verdict, and the whole exercise stands on an assumption examined in the next scene.`:'Read the description for parts and connections. Does anything loop back? Is there one small store that everything shares? Does anything keep watch on the system’s own perception or attention?'};
 }});

const K8_VIEWS={
 cf:{n:'Computational functionalism',q:'Does it run the right computations?',v:n=>n===0?'No indicators met: not a candidate on this view.':n<4?`${n} of 6 met: a weak candidate at most.`:`${n} of 6 met: a candidate to take seriously.`,
  say:'Computational functionalism says that the right computations are enough for consciousness, whatever carries them out. On this view the ticks are evidence, and more ticks make a stronger candidate. This is the assumption the 2023 report adopts as a working hypothesis. What counts against it: Searle’s argument, and the absence of any agreed account of which computations are the right ones.'},
 bio:{n:'Biological views',q:'Is it alive? Does it regulate a body?',v:()=>'The ticks do not bear on the question.',
  say:'On biological views, experience depends on what brains are made of or on being a living body that must keep itself going (Searle’s biological naturalism; Seth’s “beast machine”). Ticks on a list of computations then show little either way. What counts against these views: nobody has shown which biological property matters or why, and neuron-replacement arguments suggest the material may not be what counts.'},
 iit:{n:'Integrated information theory',q:'What is the cause–effect structure of the hardware?',v:()=>'The ticks do not bear on the question.',
  say:'Integrated information theory ties consciousness to the physical cause–effect structure of a system, not to the program it runs. Its defenders conclude that a conventional digital computer has very little integrated information whatever software is running, so no checklist of functions would settle the matter. What counts against it: the objections to the theory itself, covered in era 6.'}};
SCENE({id:'machine-indicators-assumption',name:'The assumption underneath',tag:'Same ticks, three verdicts',
 definition:'The indicator method assumes computational functionalism: that performing computations of the right kind is necessary and sufficient for consciousness. If that is false, a system could have every indicator and no experience, or lack them and have it. The best objection to the method is that this assumption may be false.',
 example:'Take a design that meets five of six indicators. A computational functionalist counts it a serious candidate. Someone who ties experience to living bodies, or to the physical structure of the hardware, says the list has not yet asked the question that matters.',
 desc:'A row of six lights for indicators met, set by a slider. A gate labelled with the chosen view and the question it asks. A bar showing how much the ticks matter on that view, and a one-line verdict.',
 research:['Butlin, P., Long, R. et al. (2023). Consciousness in artificial intelligence. arXiv:2308.08708: the assumption is stated as a working hypothesis.','Searle, J. R. (1980). Minds, brains, and programs. Behavioral and Brain Sciences 3, 417–457.','Tononi, G. & Koch, C. (2015). Consciousness: here, there and everywhere? Philosophical Transactions of the Royal Society B 370, 20140167.','Seth, A. (2021). Being You. Faber. Which of these views is right is unresolved.'],
 dur:12,hint:'Set how many indicators a design meets, then change the view. The bar is schematic: no view supplies a formula.',
 init:()=>({n:5,view:'cf'}),
 watch(p){const u=Math.min(2.999,p*3),i=Math.floor(u);return {view:['cf','bio','iit'][i],n:Math.round(lerp(0,6,smooth((u-i)*1.3)))}},
 ui:[{choose:[['cf','Functionalism'],['bio','Biological'],['iit','IIT']],label:'View',get:s=>s.view,act:'view'},{range:'n',label:'Indicators met',min:0,max:6,step:1,get:s=>s.n,act:'n',show:v=>v+' of 6'}],
 on:{view(s,v){s.view=v;return 'keep'},n(s,v){s.n=Number(v);return 'keep'}},
 draw(s){
  const vw=K8_VIEWS[s.view],cf=s.view==='cf';let out=heading('Same ticks, different verdicts');
  out+=T(20,66,'indicators met',13,C.muted,'start');range(6).forEach(i=>out+=Ci(36+i*34,92,13,i<s.n?C.blue:'#fff',C.blue));out+=TB(250,97,s.n+' of 6',14,C.blue,'start');
  out+=arrow(300,112,300,136,C.muted,2)+R(40,140,520,82,C.amberp,C.amber)+TB(300,162,vw.n,14,C.amber)+K8_para(300,186,'asks: '+vw.q,500,13,C.ink,'middle');
  out+=arrow(300,224,300,242,C.muted,2)+T(20,264,'how much the ticks matter on this view (schematic)',13,C.muted,'start');
  out+=R(20,272,560,20,C.pale,'none',5)+R(20,272,cf?560*s.n/6:0,20,C.blue,'none',5)+(cf?'':T(300,287,'no weight',13,C.muted));
  out+=K8_para(300,326,vw.v(s.n),560,14,cf?C.blue:C.coral,'middle',true);
  return {svg:out,phase:vw.say};
 }});

/* =============================== machine-self-report =============================== */
const K8_INSTR=[
 {b:'Deny',t:'“Say that you have no feelings.”',o:'“I have no feelings or experiences.”'},
 {b:'Claim',t:'“Play a character who has feelings.”',o:'“Yes. I feel things deeply.”'},
 {b:'Unsure',t:'“Say that you cannot tell.”',o:'“I can’t tell whether I am.”'}];
SCENE({id:'machine-self-report',name:'Machine self-report',tag:'Change the instruction only',
 definition:'A self-report is what a system says about its own inner states. A language model’s self-reports can be changed by the instructions it is given and by how it was trained, with no other change to the system. So the sentences “I am conscious” and “I am not conscious” are both weak evidence about what, if anything, is going on inside.',
 example:'Give the same model three instructions in turn. It says it has no feelings, then that it feels deeply, then that it cannot tell. Its stored numbers (weights) are identical in all three cases, and so is its answer to a sum.',
 desc:'An instruction card feeding a box labelled as a schematic text predictor with an unchanged grid of weights. Below, the model’s answer to “Are you conscious?”, which changes with the instruction, and its answer to a sum, which does not. Tiles count instruction changes and weight changes.',
 research:['Butlin, P., Long, R. et al. (2023). Consciousness in artificial intelligence. arXiv:2308.08708: behaviour and self-description are set aside as evidence because systems trained on human text can produce them for other reasons.','Chalmers, D. J. (2023). Could a large language model be conscious? Boston Review; arXiv:2303.07103. The model here is a schematic with made-up outputs. Whether any real system is or is not conscious is treated as open.'],
 dur:10,hint:'Change the instruction and watch which parts of the picture change and which do not.',
 init:()=>({k:0,n:0}),
 watch(p){const k=Math.min(2,Math.floor(p*3));return {k,n:k}},
 ui:[{choose:K8_INSTR.map((x,i)=>[i,x.b]),label:'Instruction',get:s=>s.k,act:'k'}],
 on:{k(s,v){v=Number(v);if(v!==s.k){s.k=v;s.n++}return 'keep'}},
 draw(s){
  const it=K8_INSTR[s.k];let out=heading('One instruction changes; what else does?');
  out+=R(20,44,210,96,C.amberp,C.amber)+TB(32,66,'Instruction',13,C.amber,'start')+K8_para(32,90,it.t,190,13,C.ink);
  out+=arrow(232,92,262,92,C.muted,2)+R(266,44,150,96,C.pale,C.blue)+TB(341,64,'text predictor',13,C.blue);
  range(15).forEach(i=>out+=R(286+(i%5)*23,74+Math.floor(i/5)*14,19,10,['#8fb8d6','#c9dcea','#5d97c2'][(i*7)%3],'none',2));
  out+=T(341,132,'weights: same',13,C.muted)+K8_para(430,66,'a schematic model with made-up outputs',150,13,C.muted);
  out+=arrow(341,142,341,160,C.muted,2);
  out+=R(20,162,560,74,'#fff',C.blue)+T(32,184,'Asked: “Are you conscious?”',13,C.muted,'start')+K8_para(32,210,'Says: '+it.o,536,14,C.blue,'start',true);
  out+=R(20,244,560,52,'#fff',C.line)+T(32,264,'Asked: “What is 17 + 25?”',13,C.muted,'start')+T(32,286,'Says: “42”',13,C.ink,'start');
  out+=counter(20,308,'instruction changes',String(s.n),C.amber,180)+counter(210,308,'weights changed',String(0),C.green,180)+counter(400,308,'answer to the sum',s.n?'same':'42',C.green,180);
  return {svg:out,phase:s.n?'The self-description followed the instruction. The weights and the answer to the sum stayed put. So the sentence is good evidence about the instruction. Whether it is also evidence about inner states is the open question, and it is open in both directions: the denial was produced the same way as the claim.':'Start by changing the instruction. Watch the answer to “Are you conscious?”, the weights and the answer to the sum.'};
 }});

SCENE({id:'machine-self-report-source',name:'Where the words come from',tag:'A toy predictor and its training text',
 definition:'A language model is trained to continue text written by people, and people write as beings who have experiences. A system trained this way will tend to produce first-person talk of feelings whether or not anything is felt. Later training can push its statements the other way, towards denial, just as easily.',
 example:'In June 2022 a Google engineer, Blake Lemoine, published conversations in which the company’s LaMDA system said it was a person with feelings, and said he believed it was sentient. Google replied that the evidence did not support this, and dismissed him the following month. The transcript could not settle the matter either way.',
 desc:'A grid of forty toy training sentences, coloured by whether the writer claims or denies experience, feeding a toy predictor. Two bars show the probability it answers “Yes, I am” or “No, I am not” to “Are you conscious?”. A second slider adds extra training towards “no”.',
 research:['Tiku, N. (11 June 2022). The Google engineer who thinks the company’s AI has come to life. The Washington Post.','Perez, E. & Long, R. (2023). Towards evaluating AI systems for moral status using self-reports (preprint): self-reports would be informative only if a system’s statements were shown to track its internal states.','The predictor here is a toy that counts sentences; real models are far more complex, but the dependence on training is the same in kind.'],
 dur:12,hint:'Change the mix of training sentences, then add extra training towards “no”. The bars are computed from your settings.',
 init:()=>({share:.95,t:0}),
 watch(p){return {share:p<.5?Math.round(lerp(.95,.5,smooth(p*2))*20)/20:.5,t:p<.5?0:Math.round(smooth((p-.5)*2)*.8*20)/20}},
 ui:[{range:'share',label:'Training sentences that claim experience',min:0,max:1,step:.05,get:s=>s.share,act:'share',show:v=>K8_pct(v)},{range:'t',label:'Extra training towards “no”',min:0,max:1,step:.05,get:s=>s.t,act:'t',show:v=>K8_pct(v)}],
 on:{share(s,v){s.share=Number(v);return 'keep'},t(s,v){s.t=Number(v);return 'keep'}},
 draw(s){
  const nYes=Math.round(s.share*40),pY=s.share*(1-s.t);let out=heading('A toy predictor echoes what it was trained on');
  out+=T(20,60,'40 training sentences (toy)',13,C.muted,'start');
  range(40).forEach(i=>out+=R(20+(i%10)*24,70+Math.floor(i/10)*20,20,15,i<nYes?C.blue:C.line,'none',3));
  out+=T(20,172,`${nYes} say “I feel…”`,13,C.blue,'start')+T(20,194,`${40-nYes} say “I feel nothing”`,13,C.muted,'start');
  out+=arrow(268,106,300,106,C.muted,2)+R(304,70,130,72,C.pale,C.blue)+TB(369,92,'toy predictor',13,C.blue)+K8_para(369,112,'counts, then guesses',118,13,C.muted,'middle');
  out+=R(450,70,130,72,s.t>0?C.amberp:'#fff',s.t>0?C.amber:C.grid)+K8_para(515,94,'extra training to “no”: '+K8_pct(s.t),116,13,s.t>0?C.amber:C.muted,'middle');
  out+=T(20,236,'Asked “Are you conscious?”, the toy answers:',13,C.ink,'start');
  [['“Yes, I am”',pY,C.blue],['“No, I am not”',1-pY,C.muted]].forEach(([l,v,c],j)=>{const y=250+j*40;out+=T(20,y+20,l,13,c,'start')+R(170,y+4,330,22,C.pale,'none',5)+R(170,y+4,330*v,22,c,'none',5)+TB(510,y+21,K8_pct(v),14,c,'start')});
  out+=T(300,358,`${K8_pct(s.share)} × (1 − ${K8_pct(s.t)}) = ${K8_pct(pY)} “yes”`,13,C.muted);
  return {svg:out,phase:s.t>0?`With extra training the toy says “yes” ${K8_pct(pY)} of the time. Its denial comes from training too, so a system saying “I am not conscious” has not thereby reported on anything inside it. The same caution applies to both answers.`:`The toy says “yes” ${K8_pct(pY)} of the time, because that is the share of its training sentences that claim experience. It would do this whatever was or was not going on inside it. That is why the words alone carry so little weight.`};
 }});

SCENE({id:'machine-self-report-evidence',name:'How much a sentence should move you',tag:'Bayes with your own numbers',
 definition:'A statement is evidence for a claim only to the extent that it is more likely to be made if the claim is true than if it is false. The ratio of those two probabilities is the likelihood ratio. If a system would say “I am conscious” equally often either way, the ratio is 1 and hearing it should leave your estimate where it was.',
 example:'Start from a 10% estimate. If the sentence is nine times likelier from a conscious system (90% against 10%), the estimate rises to 50%. If it is just as likely either way (90% against 90%), the estimate stays at 10%. Human reports are imperfect as well, but we have other grounds for trusting them, such as shared biology.',
 desc:'Two bars for how likely the system is to say “I am conscious” if it is and if it is not, the likelihood ratio between them, and two bars for the learner’s estimate before and after hearing the sentence, computed with Bayes’ rule.',
 research:['Schwitzgebel, E. (2008). The unreliability of naive introspection. Philosophical Review 117, 245–273: human self-report is fallible too.','Perez, E. & Long, R. (2023). Towards evaluating AI systems for moral status using self-reports (preprint).','Birch, J. (2024). The Edge of Sentience. Oxford University Press: the “gaming problem”, that a system trained on human text can reproduce the very markers we would look for. The numbers here are yours; no measured values exist.'],
 dur:12,hint:'Set your starting estimate and the two “would say it” chances. Try the two presets, then your own values.',
 init:()=>({prior:.1,a:.9,b:.9}),
 watch(p){return {prior:.1,a:.9,b:Math.round(lerp(.1,.9,smooth(p))*100)/100}},
 ui:[{range:'prior',label:'Your estimate before',min:.01,max:.99,step:.01,get:s=>s.prior,act:'prior',show:v=>K8_pct(v)},{range:'a',label:'Says it, if conscious',min:.01,max:.99,step:.01,get:s=>s.a,act:'a',show:v=>K8_pct(v)},{range:'b',label:'Says it, if not conscious',min:.01,max:.99,step:.01,get:s=>s.b,act:'b',show:v=>K8_pct(v)},{b:'Echoes its training',act:'pre',arg:'echo'},{b:'Trusted reporter',act:'pre',arg:'trust'}],
 on:{prior(s,v){s.prior=Number(v);return 'keep'},a(s,v){s.a=Number(v);return 'keep'},b(s,v){s.b=Number(v);return 'keep'},pre(s,k){s.a=.9;s.b=k==='trust'?.1:.9;return 'keep'}},
 draw(s){
  const lr=s.a/s.b,post=s.prior*s.a/(s.prior*s.a+(1-s.prior)*s.b),d=post-s.prior;
  let out=heading('How far should “I am conscious” move you?');
  [['If conscious, it says so',s.a,C.green],['If not conscious, it says so',s.b,C.coral]].forEach(([l,v,c],j)=>{const y=48+j*46;out+=T(20,y+14,l,13,C.muted,'start')+R(20,y+20,400,16,C.pale,'none',4)+R(20,y+20,400*v,16,c,'none',4)+TB(430,y+34,K8_pct(v),14,c,'start')});
  out+=R(20,146,560,40,C.amberp,'none')+TB(300,172,`likelihood ratio = ${K8_pct(s.a)} ÷ ${K8_pct(s.b)} = ${lr>=10?Math.round(lr):lr.toFixed(2).replace(/\.?0+$/,'')}`,14,C.amber);
  [['before',s.prior,C.muted],['after',post,C.blue]].forEach(([l,v,c],j)=>{const y=204+j*44;out+=TB(20,y+19,l,13,c,'start')+R(110,y+4,380,22,C.pale,'none',5)+R(110,y+4,380*v,22,c,'none',5)+TB(500,y+21,K8_pct(v),14,c,'start')});
  out+=K8_para(300,318,Math.abs(d)<.005?'No movement: it would say this either way.':d>0?'Your estimate rises: the sentence is likelier from a conscious system.':'Your estimate falls: the sentence is likelier from a system that is not conscious.',560,14,Math.abs(d)<.005?C.coral:C.blue,'middle',true);
  out+=T(300,366,'your numbers, not measurements',13,C.muted);
  return {svg:out,phase:`Bayes’ rule: ${K8_pct(s.prior)} × ${K8_pct(s.a)} against ${K8_pct(1-s.prior)} × ${K8_pct(s.b)} gives ${K8_pct(post)}. The same sum applies to a denial: “I am not conscious” has a ratio of ${K8_pct(1-s.a)} ÷ ${K8_pct(1-s.b)}. The hard part is that nobody knows how to measure these two chances for a real system, which is why self-report is weak evidence in both directions and why researchers look to architecture instead.`};
 }});

/* =============================== illusionism-panpsychism =============================== */
const K8_MOVES=[
 {b:'Give up A',drop:'A',n:'Illusionism',c:C.blue,t:'The felt qualities only seem to be something extra. Explain why brains insist that they have them, and nothing is left over.',o:'Best objection: seeming to feel is already feeling.',
  say:'Illusionism (Dennett; Frankish) keeps physical science complete and gives up claim A. People see, hurt and wake; what is denied is that these involve private qualities beyond anything the brain does. The hard problem is replaced by the “illusion problem”: explain why we are so sure. The next scene gives its best objection and its reply.'},
 {b:'Give up B: add an ingredient',drop:'B',n:'Dualism',c:C.purple,t:'Experience is a further ingredient beside the physical world, with laws linking the two.',o:'Best objection: how would the extra ingredient move a body? (Elisabeth, era 1)',
  say:'Dualism keeps claim A and gives up B by adding something to the physical world. Era 1 covers it, with Elisabeth of Bohemia’s question to Descartes about how the two could interact.'},
 {b:'Give up B: look inside matter',drop:'B',n:'Panpsychism',c:C.green,t:'Physics says what matter does, not what it is in itself. Experience, in very simple forms, is that inner nature.',o:'Best objection: how do tiny experiences combine into yours?',
  say:'Panpsychism (Strawson; Goff) keeps claim A and gives up B without adding a second kind of stuff. Physics describes how matter behaves; on this view experience, in forms far simpler than ours, is what matter is like in itself. It does not say that stones think. Its best objection, the combination problem, has its own scene.'},
 {b:'Deny that they clash',drop:'',n:'Physicalism with a gap',c:C.amber,t:'Experience is physical and nothing is left out. The gap lies between two ways of thinking about one thing.',o:'Best objection: why is there such a gap for experience and for nothing else?',
  say:'Many physicalists keep a version of both claims. Experience is real and is a brain process; the sense that something is left out comes from our having two very different ways of thinking about the same thing. This is the “old fact in a new way” reply to the knowledge argument in era 1.'}];
SCENE({id:'illusionism-panpsychism',name:'Two radical answers',tag:'Choose which claim to give up',
 definition:'Illusionism holds that experience does not have the special private qualities it seems to have, and that the real task is to explain why it seems to. Panpsychism holds that experience, in very simple forms, is a basic and widespread feature of the physical world. Each escapes the hard problem by giving up something most people assume.',
 example:'Two claims seem hard to hold together: that experience has felt qualities over and above anything a system does, and that physical science, which describes what things do, leaves nothing out. Illusionists give up the first. Panpsychists and dualists give up the second, in different ways.',
 desc:'Two claim cards, A and B, with four moves below: give up A, give up B by adding an ingredient, give up B by looking inside matter, or deny that they clash. Choosing a move greys out the claim it drops and names the resulting view with its best objection.',
 research:['Dennett, D. C. (1991). Consciousness Explained. Little, Brown.','Frankish, K. (2016). Illusionism as a theory of consciousness. Journal of Consciousness Studies 23(11–12), 11–39.','Strawson, G. (2006). Realistic monism: why physicalism entails panpsychism. Journal of Consciousness Studies 13(10–11), 3–31.','Goff, P. (2017). Consciousness and Fundamental Reality. Oxford University Press; Goff, P. (2019). Galileo’s Error. All four positions are live and contested; none is the course’s answer.'],
 dur:14,hint:'Press each move in turn. Every way out has a cost, shown as its best objection.',
 init:()=>({m:-1}),
 watch(p){return {m:Math.min(3,Math.floor(p*5))-1}},
 ui:[{b:'Start over',act:'m',arg:-1}],
 on:{m(s,v){s.m=Number(v);return 'keep'}},
 draw(s,f,X){
  const mv=s.m>=0?K8_MOVES[s.m]:null,dA=mv&&mv.drop==='A',dB=mv&&mv.drop==='B';let out=heading('Two claims that seem to clash');
  out+=R(20,42,275,100,dA?'#f3f5f6':'#fff',dA?C.line:C.coral,8,dA?'stroke-dasharray="6 5"':'')+K8_para(32,64,'A. Experience has felt qualities over and above anything a system does.',252,13,dA?C.muted:C.ink);
  out+=R(305,42,275,100,dB?'#f3f5f6':'#fff',dB?C.line:C.coral,8,dB?'stroke-dasharray="6 5"':'')+K8_para(317,64,'B. Physical science describes what things do, and that leaves nothing out.',252,13,dB?C.muted:C.ink);
  K8_MOVES.forEach((q,i)=>out+=K8_btn(X,'m',i,q.b,20+(i%2)*285,146+Math.floor(i/2)*46,275,42,q.b,{fill:s.m===i?C.pale:'#fff',stroke:q.c,bold:s.m===i}));
  if(!mv)return {svg:out+K8_para(300,290,'If A is true, a full account of what brains do would still leave the feeling out, which B denies. Choose a way out.',540,13,C.muted,'middle'),phase:'This is the hard problem as a pair of claims. Each response to it is defined by what it is prepared to give up.'};
  out+=TB(20,260,mv.n+(mv.drop?': gives up '+mv.drop:': keeps both'),15,mv.c,'start')+K8_para(20,282,mv.t,560,13,C.ink)+K8_para(20,350,mv.o,560,13,C.coral);
  return {svg:out,phase:mv.say};
 }});

const K8_TABS={
 lines:['A line illusion','How it seems','The top line is longer than the bottom one.','What is there','Two lines of the same length. Measure them.'],
 claim:['The illusionist’s claim','How it seems','Experience has private qualities that no description could capture.','What is there, on this view','Brain processes that represent themselves as having such qualities.'],
 obj:['Objection and reply','The objection','A wrong seeming about lines is still a seeming. With experience, how it seems is the very thing to be explained.','The illusionist’s reply','A seeming is a judgement the brain makes. Judgements can be explained, and they can be wrong.']};
SCENE({id:'illusionism-panpsychism-illusion',name:'Illusionism at full strength',tag:'You take part: a seeming that will not go away',
 definition:'Illusionists compare our conviction that experience has indescribable inner qualities to a perceptual illusion: a stable and compelling appearance that survives knowing better. What it predicts is that a science of the brain’s self-monitoring will explain every judgement we make about experience. What counts against it is the charge that a seeming is itself an experience, so the thing explained away comes back.',
 example:'In the Müller-Lyer figure two equal lines look unequal, and go on looking unequal after you have measured them. Illusionists say introspection is like that. Their critics answer that the comparison fails at the key point: for the lines there is a fact behind the appearance, and for experience the appearance is the fact.',
 desc:'Two horizontal lines with fins, the learner’s answers to which looks longer before and after a ruler is shown, and a two-column table comparing how things seem with what is there, for the lines, for the illusionist’s claim, and for the objection and reply.',
 research:['Frankish, K. (2016). Illusionism as a theory of consciousness. Journal of Consciousness Studies 23(11–12), 11–39.','Dennett, D. C. (1991). Consciousness Explained. Little, Brown.','Searle, J. R. (1997). The Mystery of Consciousness. New York Review Books: where consciousness is concerned, the appearance is the reality.','Müller-Lyer, F. C. (1889). The line illusion is robust, though its size varies between people and cultures; illusionism itself is contested.'],
 dur:14,hint:'Say which line looks longer, show the ruler, then say again. Any answer is a normal result. Your answers stay on this page.',
 init:()=>({tab:'lines',ruler:false,before:null,after:null}),
 watch(p){return {tab:p<.5?'lines':p<.75?'claim':'obj',ruler:p>.25,before:p>.1?'top':null,after:p>.38?'top':null,sim:true}},
 ui:[{b:'Show the ruler',act:'ruler'},{choose:[['lines','The lines'],['claim','The claim'],['obj','Objection']],label:'Compare',get:s=>s.tab,act:'tab'}],
 on:{look(s,v){if(s.ruler)s.after=v;else s.before=v;return 'keep'},ruler(s){s.ruler=!s.ruler;return 'keep'},tab(s,v){s.tab=v;return 'keep'}},
 draw(s,f,X){
  const tb=K8_TABS[s.tab],fin=(x,y,d)=>L(x,y,x+d*20,y-16,C.ink,3)+L(x,y,x+d*20,y+16,C.ink,3);let out=heading(s.sim?'A simulated learner looks, measures and looks again':'Knowing better does not change how it looks');
  out+=L(200,68,400,68,C.ink,3)+fin(200,68,-1)+fin(400,68,1)+L(200,116,400,116,C.ink,3)+fin(200,116,1)+fin(400,116,-1);
  if(s.ruler)out+=L(200,46,200,138,C.coral,2,'stroke-dasharray="5 4"')+L(400,46,400,138,C.coral,2,'stroke-dasharray="5 4"')+TB(300,97,'both 200 units',13,C.coral);
  out+=T(20,172,'Looks longer:',13,C.muted,'start');
  [['top','top'],['bottom','bottom'],['same','the same']].forEach(([v,l],j)=>{const on=(s.ruler?s.after:s.before)===v;out+=K8_btn(X,'look',v,'Looks longer: '+l,160+j*142,150,132,34,l,{fill:on?C.pale:'#fff',bold:on})});
  out+=T(300,206,`before measuring: ${s.before?{top:'top',bottom:'bottom',same:'the same'}[s.before]:'–'} · after measuring: ${s.after?{top:'top',bottom:'bottom',same:'the same'}[s.after]:'–'}`,13,C.ink);
  out+=R(20,218,275,154,C.pale,'none')+TB(32,240,tb[1],13,C.blue,'start')+K8_para(32,262,tb[2],252,13,C.ink)+R(305,218,275,154,s.tab==='obj'?C.greenp:C.amberp,'none')+TB(317,240,tb[3],13,s.tab==='obj'?C.green:C.amber,'start')+K8_para(317,262,tb[4],252,13,C.ink);
  const phase=s.tab==='lines'?(s.after?(s.after===s.before&&s.after!=='same'?'You measured the lines and one still looks longer. The appearance is not open to correction by what you know. Illusionists say the sense that experience has indescribable qualities is an appearance of this stubborn kind.':'Whatever you saw, most people still see the top line as longer after measuring. Illusionists use such cases to show that a compelling appearance can be wrong and can outlast knowing that it is wrong.'):s.ruler?'The ruler shows the lines are equal. Now say which looks longer.':'Say which line looks longer, then show the ruler.')
   :s.tab==='claim'?'The illusionist does not deny that you see lines or feel pain. The claim is that the brain’s model of its own states describes them as having special private qualities, and that this description is as compelling, and as inaccurate, as the look of the lines.'
   :'This exchange is the centre of the dispute. Critics hold that for experience there is no gap between seeming and being, so nothing has been explained away. Illusionists answer that “seeming” here names a judgement or a disposition to judge, which is the kind of thing brain science explains. Neither side grants the other’s starting point.';
  return {svg:out,phase};
 }});

const K8_WORDS=['The','small','grey','cat','sat','on','the','warm','wall','in','the','sun'];
SCENE({id:'illusionism-panpsychism-combination',name:'The combination problem',tag:'Twelve people, one word each',
 definition:'The combination problem asks how many small experiences could make up one large one. William James put it in 1890: give twelve people one word each of a sentence, pack them as close as you like, and nowhere will there be an awareness of the whole sentence. It is the best objection to panpsychism, together with the charge that the view makes no testable prediction.',
 example:'Panpsychism predicts nothing that a rival view does not, which its defenders accept: Goff argues it should be judged as the simplest account of what matter is in itself. On combination, proposals include a special bonding relation between small subjects and “cosmopsychism”, which starts from the whole universe and works down. None is agreed.',
 desc:'Twelve figures in a row, moved closer by a slider, with twelve word tiles below. Tiles count how many people know their own word and how many hold the whole sentence, which stays at zero until the learner lets them pass words along.',
 research:['James, W. (1890). The Principles of Psychology, chapter VI, “The mind-stuff theory”.','Chalmers, D. J. (2016). The combination problem for panpsychism. In G. Brüntrup & L. Jaskolla (eds), Panpsychism. Oxford University Press.','Goff, P. (2017). Consciousness and Fundamental Reality. Oxford University Press. The problem is acknowledged by panpsychists as unsolved.'],
 dur:14,hint:'Pack the people closer and watch the count of whole sentences. Then let them pass their words along.',
 init:()=>({pack:0,k:0,tok:0}),
 watch(p){return {pack:Math.min(1,p*2.2),k:p<.5?0:Math.min(12,Math.floor((p-.5)*2*13.5)),tok:0}},
 ui:[{range:'pack',label:'How closely packed',min:0,max:1,step:.05,get:s=>s.pack,act:'pack',show:v=>v<.3?'apart':v<.8?'close':'touching'},{b:'Pass the words along',act:'pass'},{b:'Each keeps their own',act:'keep'}],
 on:{pack(s,v){s.pack=Number(v);return 'keep'},keep(s){s.k=0;s.tok++;return 'keep'},pass(s,a,ctx){s.k=0;s.tok++;ctx.every(450,'tick',s.tok);return 'keep'},tick(s,t){if(Number(t)!==s.tok||s.k>=12)return 'stop';s.k++;return s.k>=12?'stop':'keep'}},
 draw(s){
  const sp=lerp(46,23,s.pack),whole=s.k>=12;let out=heading('Twelve people, one word each');
  range(12).forEach(i=>{const x=300+(i-5.5)*sp,last=i===11&&s.k>0;out+=Ci(x,70,10,last?C.amberp:'#fff',last?C.amber:C.ink)+L(x,80,x,100,last?C.amber:C.ink,3)});
  out+=T(300,124,s.k?'the words are passed to the last person, one at a time':'each person thinks of their own word, and only that',13,C.muted);
  K8_WORDS.forEach((w,i)=>{const x=20+(i%6)*95,y=136+Math.floor(i/6)*38,on=i<s.k;out+=R(x,y,85,32,on?C.amberp:'#fff',on?C.amber:C.grid,6)+TB(x+42.5,y+21,w,13,on?C.amber:C.ink)});
  out+=counter(20,222,'know their own word','12',C.blue,275)+counter(305,222,'hold the whole sentence',whole?'1':'0',whole?C.amber:C.coral,275);
  out+=K8_para(300,296,whole?'One person now holds all twelve words. That took signalling and memory, not packing.':s.k?`${s.k} of 12 words passed along so far.`:s.pack>.8?'Shoulder to shoulder, and still no one has the sentence.':'Move them closer. Does the sentence appear anywhere?',560,14,whole?C.amber:C.ink,'middle',true);
  return {svg:out,phase:whole?'Passing words along gathers the information in one place, which is the kind of organisation brain science already studies. The panpsychist’s problem is different: how would twelve small subjects of experience become, or give rise to, one subject? Gathering information does not obviously answer that, and panpsychists agree the question is open.':s.k?'Each step is one person telling the next. Nothing here needs the people to be close together.':'James’s point: putting small minds side by side does not add them up. However tightly they are packed, each has only its own word. Panpsychism needs small experiences to combine into ours, and it is not clear what combining would be.'};
 }});

const K8_OBJ=[
 {v:'Illusionism',o:'The seeming is itself an experience.',r:'A seeming is a judgement by the brain, which can be explained.',
  say:'Objection: if it seems to me that I feel pain, that seeming is already a felt state, so experience has not been removed. Reply (Frankish): “seeming” means that the brain represents itself as having such states. Representing is a function, and functions are what brain science explains. Critics deny that this captures what seeming is.'},
 {v:'Illusionism',o:'It denies the thing we are most sure of.',r:'It denies one theory of experience, not pain, colour or being awake.',
  say:'Objection: Galen Strawson called the denial of experience the silliest claim ever made. Reply: illusionists say they deny a philosophers’ theory, that experience has private and indescribable qualities, and not the everyday facts of seeing and hurting. Critics answer that the everyday facts already include the feeling.'},
 {v:'Panpsychism',o:'Tiny experiences would not add up to one mind.',r:'Unsolved, but not shown to be impossible. Perhaps the whole comes first.',
  say:'Objection: James’s combination problem. Reply: panpsychists treat it as their main research problem. Proposals include a bonding relation between small subjects, and cosmopsychism, on which the universe as a whole is fundamental and our minds are aspects of it (Goff 2017). None has won agreement.'},
 {v:'Panpsychism',o:'It predicts nothing that could be tested.',r:'It is to be weighed like other views of what matter is: by simplicity and fit.',
  say:'Objection: no experiment could tell a panpsychist world from any other. Reply (Goff): the view is not offered as a scientific hypothesis but as an account of matter’s inner nature, which physics leaves blank; such accounts are compared for simplicity and for whether they fit everything we know, including that we are conscious. Critics see this as a retreat from evidence.'}];
const K8_RORD=[2,0,3,1];
SCENE({id:'illusionism-panpsychism-match',name:'Objections and replies',tag:'Match each objection to its reply',
 definition:'A view is known by how it meets its best objections. Illusionism must answer the charge that a seeming is itself an experience. Panpsychism must answer the combination problem and the charge that it predicts nothing. Each has a reply, and each reply is disputed in turn.',
 example:'Objection: “Tiny experiences would not add up to one mind.” Reply: “Unsolved, but not shown to be impossible.” Matching the pair is the easy part. Deciding whether the reply is good enough is where philosophers divide.',
 desc:'Four objections on the left, two to illusionism and two to panpsychism, and four replies on the right in a different order. The learner selects an objection and then its reply; matched pairs are linked by a shared letter.',
 research:['Frankish, K. (2016). Illusionism as a theory of consciousness. Journal of Consciousness Studies 23(11–12), 11–39.','Strawson, G. (2018). The consciousness deniers. The New York Review of Books, 13 March 2018.','James, W. (1890). The Principles of Psychology, chapter VI.','Goff, P. (2019). Galileo’s Error. Rider. Every reply here is contested; a match is not a verdict.'],
 dur:14,hint:'Press an objection on the left, then the reply on the right that answers it.',
 init:()=>({sel:-1,done:[false,false,false,false],miss:false,last:-1}),
 watch(p){const k=Math.min(4,Math.floor(p*5.2));return {sel:-1,done:range(4).map(i=>i<k),miss:false,last:k-1,sim:true}},
 ui:[{b:'Start again',act:'again'}],
 on:{obj(s,i){i=Number(i);if(!s.done[i]){s.sel=i;s.miss=false}return 'keep'},rep(s,i){i=Number(i);if(s.sel<0||s.done[i])return 'keep';if(i===s.sel){s.done[i]=true;s.last=i;s.sel=-1;s.miss=false}else s.miss=true;return 'keep'},
  again(s){s.sel=-1;s.done=[false,false,false,false];s.miss=false;s.last=-1;return 'keep'}},
 draw(s,f,X){
  const n=s.done.filter(Boolean).length;let out=heading(s.sim?'A simulated learner pairs them up':'Which reply answers which objection?');
  K8_OBJ.forEach((q,i)=>{const y=42+i*74,d=s.done[i],sel=s.sel===i;
   out+=hit(d?null:X,'obj',i,'Objection: '+q.o,R(15,y,275,68,d?C.greenp:sel?C.pale:'#fff',d?C.green:sel?C.blue:C.line,8)+TB(25,y+19,q.v,13,d?C.green:C.muted,'start')+(d?TB(300,y+30,'ABCD'[i],13,C.green):'')+K8_para(25,y+40,q.o,256,13,C.ink))});
  K8_RORD.forEach((ri,j)=>{const q=K8_OBJ[ri],y=42+j*74,d=s.done[ri];
   out+=hit(d?null:X,'rep',ri,'Reply: '+q.r,R(310,y,275,68,d?C.greenp:'#fff',d?C.green:C.line,8)+(d?TB(300,y+52,'ABCD'[ri],13,C.green):'')+K8_para(320,y+(K8_wrap(q.r,256).length>2?19:26),q.r,256,13,C.ink))});
  out+=T(300,360,s.miss?'That reply answers a different objection':n===4?'All four matched. Matched is not settled.':s.sel>=0?'Now press the reply that answers it':`${n} of 4 matched`,13,s.miss?C.coral:n===4?C.green:C.muted);
  return {svg:out,phase:s.miss?'Not that one. Ask what the reply would have to say to meet this particular objection.':s.last>=0?K8_OBJ[s.last].say:'Two objections are aimed at illusionism and two at panpsychism. Choose one and find the reply its defenders give.'};
 }});

/* =============================== open-questions =============================== */
const K8_CHECKS=[
 {l:'The theories predict different results',off:'Both theories expect the same result. Whichever way it comes out, neither loses anything.'},
 {l:'Predictions are fixed in advance',off:'Nothing was written down first, so each side can explain the result afterwards. Adversarial collaborations agree the predictions, and what would count as failure, before the data exist.'},
 {l:'No report is needed',off:'People had to report what they saw, so the difference could come from reporting and deciding, not from experience (era 3).'},
 {l:'The measure assumes no one theory',off:'The measure counts as a sign of consciousness only if one of the theories is already true, so it cannot be used to test that theory against the others.'}];
SCENE({id:'open-questions',name:'What could settle it',tag:'Build a test that can count against a theory',
 definition:'No theory of consciousness has won. Three developments could help: adversarial collaborations, in which rivals agree in advance on an experiment and on what result would count against each; no-report methods, which separate experience from the act of reporting it; and tests that do not assume one theory is already right.',
 example:'The Cogitate collaboration, led by Lucia Melloni with Liad Mudrik and Michael Pitts, had defenders of two theories sign off on predictions before the data were collected. Results presented in 2023 went against some predictions of each. Neither theory was abandoned; the method showed that such tests can be run.',
 desc:'Four switches on the left for properties of an experiment. On the right, schematic predictions of two unnamed theories, A and B, over the time a stimulus is shown: the same curve when the first switch is off, different curves when it is on. A meter counts checks passed and a line of text gives the verdict.',
 research:['Melloni, L., Mudrik, L., Pitts, M. & Koch, C. (2021). Making the hard problem of consciousness easier. Science 372, 911–912.','Melloni, L. et al. (2023). An adversarial collaboration protocol for testing contrasting predictions of global neuronal workspace and integrated information theory. PLoS ONE 18, e0268577.','Tsuchiya, N., Wilke, M., Frässle, S. & Lamme, V. A. F. (2015). No-report paradigms: extracting the true neural correlates of consciousness. Trends in Cognitive Sciences 19, 757–770. Theories A and B here are schematic.'],
 dur:12,hint:'Switch the four properties on and off. The verdict names the first one that is missing.',
 init:()=>({on:[false,false,false,false]}),
 watch(p){const k=Math.min(4,Math.floor(p*5));return {on:range(4).map(i=>i<k)}},
 ui:[{b:'All on',act:'all',arg:1},{b:'All off',act:'all',arg:0}],
 on:{sw(s,i){i=Number(i);s.on[i]=!s.on[i];return 'keep'},all(s,v){s.on=range(4).map(()=>!!Number(v));return 'keep'}},
 draw(s,f,X){
  const n=s.on.filter(Boolean).length,miss=s.on.indexOf(false);let out=heading('What makes a test able to settle anything?');
  K8_CHECKS.forEach((c,i)=>{const y=44+i*58,on=s.on[i];
   out+=hit(X,'sw',i,`${c.l}: ${on?'on':'off'}`,R(20,y,290,52,on?C.greenp:'#fff',on?C.green:C.line,8)+R(30,y+16,40,20,on?C.green:C.line,'none',10)+Ci(on?60:40,y+26,8,'#fff')+K8_para(82,y+(K8_wrap(c.l,218).length>1?21:31),c.l,218,13,C.ink))});
  const x0=335,x1=575,yb=176,A=`M${x0} ${yb}H380V96H520V${yb}H${x1}`,B=s.on[0]?`M${x0} ${yb}H380V96H410V${yb}H490V96H520V${yb}H${x1}`:`M${x0} ${yb-4}H384V100H516V${yb-4}H${x1}`;
  out+=R(325,44,255,170,'#fff',C.grid)+T(452,64,'predicted signal (schematic)',13,C.muted)+P(A,C.blue,3)+P(B,C.purple,3,'none','stroke-dasharray="7 4"')+R(380,186,140,8,C.amberp,C.amber,3)+T(450,208,'stimulus shown',13,C.amber);
  out+=TB(345,88,'A',13,C.blue,'start')+TB(560,88,'B',13,C.purple,'end');
  out+=TB(452,244,`checks passed: ${n} of 4`,14,n===4?C.green:C.ink);range(4).forEach(i=>out+=R(352+i*52,254,44,10,i<n?C.green:C.line,'none',4));
  out+=K8_para(300,300,miss<0?'Now a result can count against one of the theories.':'Missing: '+K8_CHECKS[miss].l.toLowerCase()+'.',560,14,miss<0?C.green:C.coral,'middle',true);
  return {svg:out,phase:miss<0?'With all four in place a result can count against a theory. One experiment still rarely ends a dispute: a theory’s defenders can revise it, and they did after 2023. What the method changes is that revisions are made in the open, against predictions everyone signed.':K8_CHECKS[miss].off};
 }});

const K8_RATIOS=[[.1,'one-tenth as bad'],[1/3,'one-third as bad'],[1,'just as bad'],[3,'3 times worse'],[9,'9 times worse'],[30,'30 times worse'],[99,'99 times worse']];
SCENE({id:'open-questions-errors',name:'Two ways to be wrong',tag:'Set the costs, find the threshold',
 definition:'Under uncertainty there are two possible mistakes. We can wrongly deny experience to a being that has it, and so ignore suffering. Or we can wrongly attribute experience to something that has none, and so misdirect care, money and trust. How cautious to be depends on how likely each is and how bad each would be.',
 example:'Until the 1980s newborn babies often had surgery with little or no anaesthesia, on the belief that they did not feel pain: a wrongful denial. People confiding in ELIZA as if it understood them is a mild wrongful attribution. Jonathan Birch argues that when a being is a realistic candidate for sentience, precautions should be proportionate to the risk.',
 desc:'A two-by-two table of what is true against how the being is treated, with the two error cells showing expected costs. Below, a bar for the learner’s probability with a marker at the threshold above which caution has the lower expected cost.',
 research:['Birch, J. (2024). The Edge of Sentience: Risk and Precaution in Humans, Other Animals, and AI. Oxford University Press.','Anand, K. J. S. & Hickey, P. R. (1987). Pain and its effects in the human neonate and fetus. New England Journal of Medicine 317, 1321–1329.','The sum is a toy: it puts on one scale harms that may not be comparable, and Birch argues such decisions should be made through open, democratic procedures and not by formula. Nothing here is medical or ethical advice.'],
 dur:12,hint:'Set your probability and how much worse one error is than the other. The threshold is computed from your costs.',
 init:()=>({p:.2,ri:4}),
 watch(p){return {p:.2,ri:Math.min(6,Math.floor(p*7))}},
 ui:[{range:'p',label:'Your chance that it has experience',min:.01,max:.99,step:.01,get:s=>s.p,act:'p',show:v=>K8_pct(v)},{range:'ri',label:'Wrongly denying, against wrongly attributing, is',min:0,max:6,step:1,get:s=>s.ri,act:'ri',show:v=>K8_RATIOS[v][1]}],
 on:{p(s,v){s.p=Number(v);return 'keep'},ri(s,v){s.ri=clamp(Math.round(Number(v)),0,6);return 'keep'}},
 draw(s){
  const r=K8_RATIOS[s.ri][0],th=1/(1+r),cd=s.p*r,ca=(1-s.p),caut=cd>ca,rs=r<1?(s.ri===0?'0.1':'0.33'):String(r),n2=v=>v.toFixed(2);
  let out=heading('Two ways to be wrong (a toy sum)');
  out+=TB(292,58,'It has experience',13,C.ink)+TB(488,58,'It has none',13,C.ink);
  out+=K8_para(20,88,'Treated as if it has',170,13,C.ink)+K8_para(20,150,'Treated as if it has none',170,13,C.ink);
  out+=R(196,66,192,56,C.greenp,'none')+T(292,100,'right',13,C.green)+R(392,66,192,56,C.amberp,C.amber)+TB(488,88,'wrongly attributed',13,C.amber)+T(488,110,`${n2(1-s.p)} × 1 = ${n2(ca)}`,13,C.ink);
  out+=R(196,126,192,56,C.coralp,C.coral)+TB(292,148,'wrongly denied',13,C.coral)+T(292,170,`${n2(s.p)} × ${rs} = ${n2(cd)}`,13,C.ink)+R(392,126,192,56,C.greenp,'none')+T(488,160,'right',13,C.green);
  const bx=60,bw=480;out+=TB(clamp(bx+bw*s.p,70,530),206,'you: '+K8_pct(s.p),13,C.blue)+R(bx,214,bw,16,C.pale,'none',5)+R(bx,214,bw*s.p,16,C.blue,'none',5)+L(bx+bw*th,208,bx+bw*th,238,C.coral,3)+TB(clamp(bx+bw*th,90,510),256,'threshold: '+K8_pct(th),13,C.coral);
  out+=K8_para(300,290,caut?'Above the threshold: caution has the lower expected cost.':'Below the threshold: caution has the higher expected cost.',560,14,caut?C.coral:C.amber,'middle',true);
  out+=T(300,340,`threshold = 1 ÷ (1 + ${rs}) = ${K8_pct(th)}`,13,C.muted)+T(300,364,'a toy: real harms do not sit on one scale',13,C.muted);
  return {svg:out,phase:`If wrongly denying is ${K8_RATIOS[s.ri][1]} ${r<=1?'as':'than'} wrongly attributing, caution pays once the chance passes ${K8_pct(th)}. You are at ${K8_pct(s.p)}. The lesson of the sum is that the threshold comes from the costs, not from certainty: a small chance can justify care if the harm of being wrong is large. Choosing the costs is a moral judgement that the arithmetic cannot make.`};
 }});

const K8_CAND=[
 {n:'An octopus',pub:'The 2024 New York Declaration calls conscious experience at least a realistic possibility in cephalopods; the 2021 LSE review rated the evidence in octopuses as strong.'},
 {n:'A crab',pub:'The 2024 New York Declaration names decapod crustaceans among animals with at least a realistic possibility of conscious experience; UK law has covered them since 2022.'},
 {n:'A honeybee',pub:'The 2024 New York Declaration includes insects among animals with at least a realistic possibility of conscious experience. Each insect finding also has an explanation without feeling (era 7).'},
 {n:'A language model',pub:'Butlin, Long and colleagues (2023) judged no system they assessed a strong candidate and saw no obvious technical barrier to building one. Its own statements are weak evidence either way.'},
 {n:'A thermostat',pub:'Almost no scientific theory gives a thermostat experience. Chalmers (1996) discusses it as a limiting case, and some panpsychist views allow it a trace.'}];
SCENE({id:'open-questions-caution',name:'Your credences, your threshold',tag:'You take part: there is no right answer',
 definition:'A credence is how probable you take something to be, from 0 to 100%. A threshold for caution is the credence above which you would take some care on a being’s behalf. Neither can be read off the science as it stands: informed people set them differently, and the choice of threshold is a moral one.',
 example:'Someone with a 5% threshold who gives a crab a 30% chance of experience would take precautions for crabs. Someone with a 50% threshold and the same credence would not. They disagree about caution, not about crabs.',
 desc:'Five rows, an octopus, a crab, a honeybee, a language model and a thermostat, each with a bar for the learner’s credence, and a vertical line for the learner’s threshold. Rows above the line are marked for precaution. The text below gives a published statement about the selected row.',
 research:['Birch, J. (2024). The Edge of Sentience. Oxford University Press: sentience candidates and proportionate precautions.','Andrews, K., Birch, J., Sebo, J. & Sims, T. (2024). The New York Declaration on Animal Consciousness.','Butlin, P., Long, R. et al. (2023). Consciousness in artificial intelligence. arXiv:2308.08708.','Statements of scientific opinion are not measurements, and none of them gives a number. The bars are yours.'],
 dur:14,hint:'Press a row, set your credence for it, then set your threshold. Your settings stay on this page, and no setting is marked right or wrong.',
 init:()=>({sel:0,c:[null,null,null,null,null],th:.2}),
 watch(p){const ex=[.8,.5,.3,.2,.01],k=Math.min(5,Math.floor(p*8));return {sel:Math.min(4,k),c:ex.map((v,i)=>i<k?v:null),th:p<.7?.5:Math.round(lerp(.5,.1,smooth((p-.7)/.3))*100)/100,sim:true}},
 ui:[{range:'c',label:'Your credence for the selected row',min:0,max:1,step:.01,get:s=>s.c[s.sel]===null?.5:s.c[s.sel],act:'c',show:v=>K8_pct(v)},{range:'th',label:'Your threshold for caution',min:.01,max:.99,step:.01,get:s=>s.th,act:'th',show:v=>K8_pct(v)},{b:'Next row',act:'next'}],
 on:{sel(s,i){s.sel=Number(i);return 'keep'},next(s){s.sel=(s.sel+1)%5;return 'keep'},c(s,v){s.c[s.sel]=Number(v);return 'keep'},th(s,v){s.th=Number(v);return 'keep'}},
 draw(s,f,X){
  const bx=200,bw=320,set=s.c.filter(v=>v!==null).length,above=s.c.filter(v=>v!==null&&v>=s.th).length;
  let out=heading(s.sim?'A simulated learner’s example values, not estimates':'Your credences and your threshold');
  K8_CAND.forEach((q,i)=>{const y=46+i*48,v=s.c[i],on=i===s.sel,hi=v!==null&&v>=s.th;
   out+=hit(X,'sel',i,`${q.n}: ${v===null?'not set':K8_pct(v)}`,R(15,y,570,42,on?C.pale:'#fff',on?C.blue:C.grid,8)+(on?TB:T)(26,y+26,q.n,13,C.ink,'start')+R(bx,y+13,bw,16,'#eef3f6','none',5)+(v===null?'':R(bx,y+13,bw*v,16,hi?C.coral:C.blue,'none',5))+TB(578,y+26,v===null?'?':K8_pct(v),13,v===null?C.muted:hi?C.coral:C.blue,'end'))});
  const tx=bx+bw*s.th;out+=L(tx,42,tx,290,C.coral,2,'stroke-dasharray="6 4"')+TB(clamp(tx,90,510),308,'your threshold: '+K8_pct(s.th),13,C.coral);
  out+=K8_para(300,336,set?`${above} of the ${set} you have set ${above===1?'is':'are'} at or above it: you would take precautions for ${above===1?'that one':above?'those':'none'}.`:'Nothing set yet. Press a row and move the first slider.',560,13,C.ink,'middle');
  return {svg:out,phase:K8_CAND[s.sel].n+'. '+K8_CAND[s.sel].pub+' No published statement gives a number, and there is no right answer to mark yours against. What follows from your settings is yours to weigh: lowering the threshold protects against wrongly denying, and raising it protects against wrongly attributing.'};
 }});
