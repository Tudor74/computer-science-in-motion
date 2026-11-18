/* =====================================================================
 Consciousness era 5 · The self.
 Owning a body, willing an action, explaining a choice, recognising a reflection, feeling a heartbeat and
 lasting through time. The learner takes part in a Libet clock task, a choice task and a heartbeat count.
 Rules kept here: every picture is a pure function of state; toy models and illustrative curves are labelled
 in the picture; timers only move a clock dot or a progress bar (nothing flashes); sound (two soft tones in
 the heartbeat count) plays only from on() handlers; no data leaves the page. One concealment: the swaps in
 the-interpreter-choice, explained on the same scene as soon as the eight trials end.
 ===================================================================== */

const K5_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
// Greedy word wrap to at most `max` characters a line.
function K5_lines(t,max){const out=[];let cur='';for(const w of String(t).split(' ')){if(cur&&(cur+' '+w).length>max){out.push(cur);cur=w}else cur=cur?cur+' '+w:w}if(cur)out.push(cur);return out}
// Fixed-size wrapped text (dense labels) and scaling wrapped text (reading text that grows on phones).
function K5_wrap(x,y,t,max,size=13,fill=C.muted,anchor='middle',lh=size+5){return K5_lines(t,max).map((l,i)=>TF(x,y+i*lh,l,size,fill,anchor)).join('')}
function K5_wrapT(x,y,t,max,size=14,fill=C.ink,anchor='middle',bold=false){const lh=size*TS+6;return K5_lines(t,max).map((l,i)=>(bold?TB:T)(x,y+i*lh,l,size,fill,anchor)).join('')}
function K5_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
// A chip the learner can press. state: 'off', 'on', 'good' or 'bad'.
function K5_chip(X,act,arg,label,x,y,w,h,state='off',aria=''){
 const fill={off:'#fff',on:C.pale,good:C.greenp,bad:C.coralp}[state],stroke={off:C.line,on:C.blue,good:C.green,bad:C.coral}[state],ink={off:C.ink,on:C.blue,good:C.green,bad:C.coral}[state];
 return hit(X,act,arg,aria||label,R(x,y,w,h,fill,stroke,9)+T(x+w/2,y+h/2+5,label,14,ink,'middle',state==='off'?'':'font-weight="700"'));
}
// A stick figure standing on the ground at (x,y).
function K5_fig(x,y,col=C.ink,extra=''){return G(Ci(x,y-62,9,'#fff',col)+L(x,y-53,x,y-24,col,3)+L(x,y-24,x-9,y,col,3)+L(x,y-24,x+9,y,col,3)+L(x,y-46,x-11,y-32,col,3)+L(x,y-46,x+11,y-32,col,3),extra)}
// A simple hand seen from above, fingers pointing up.
function K5_hand(x,y,fill,stroke){let out=R(x-22,y-12,44,34,fill,stroke,10);for(let i=0;i<4;i++)out+=R(x-21+i*11,y-40,9,32,fill,stroke,4);return out+R(x+20,y-6,9,24,fill,stroke,4)}
// One-case-at-a-time judgement: o={title,q,opts:[labels],items:[{t,a,why}]}; state {i,ans:[]}.
function K5_quiz(X,s,o){
 const n=o.items.length,i=clamp(s.i,0,n-1),it=o.items[i],ans=s.ans[i],m=o.opts.length;
 let out=heading(o.title);
 for(let j=0;j<n;j++){const a=s.ans[j];out+=Ci(300+(j-(n-1)/2)*24,50,j===i?8:6,a==null?'#fff':a===o.items[j].a?C.green:C.coral,j===i?C.ink:C.line)}
 out+=R(30,64,540,116,'#fff',C.grid,10)+K5_wrapT(300,90,it.t,50,14,C.ink);
 out+=TF(300,200,`Case ${i+1} of ${n}. ${o.q}`,13,C.muted);
 const w=m===3?166:230,gap=14,x0=300-(m*w+(m-1)*gap)/2;
 o.opts.forEach((lab,j)=>{out+=K5_chip(X,'ans',j,lab,x0+j*(w+gap),210,w,40,ans==null?'off':j===it.a?'good':j===ans?'bad':'off',`Answer: ${lab}`)});
 if(ans==null)out+=R(30,264,540,108,'#f6f9fb','none',10)+T(300,322,'Choose an answer to see the reasoning.',14,C.muted);
 else{const ok=ans===it.a;out+=R(30,264,540,108,ok?C.greenp:C.coralp,'none',10)+K5_wrapT(300,286,(ok?'Yes. ':`The better fit is “${o.opts[it.a]}”. `)+it.why,54,13,C.ink)}
 return out;
}
function K5_quizPhase(s,o){const n=o.items.length,done=s.ans.filter(a=>a!=null).length,right=o.items.filter((it,j)=>s.ans[j]===it.a).length;
 return done===0?`${n} cases. Judge each one, then use Next.`:`${right} of ${done} answered match the reading given here${done<n?`; ${n-done} to go`:''}. Some of these calls are argued over, so read the reasoning as well as the mark.`}
const K5_quizOn={ans(s,j){if(s.ans[s.i]==null)s.ans[s.i]=Number(j);return 'keep'},next(s){s.i=(s.i+1)%s.ans.length;return 'keep'},prev(s){s.i=(s.i+s.ans.length-1)%s.ans.length;return 'keep'},reset(s){s.i=0;s.ans=s.ans.map(()=>null);return 'keep'}};
const K5_quizUi=[{b:'Previous',act:'prev'},{b:'Next',act:'next'},{b:'Start again',act:'reset'}];
// Watch for a quiz: each case is shown, then answered as in the key.
const K5_quizWatch=o=>p=>{const n=o.items.length,q=Math.min(n-1e-6,p*n),i=Math.floor(q),u=q-i;return {i,ans:o.items.map((it,j)=>j<i||(j===i&&u>.45)?it.a:null)}};

/* =========================== body-ownership =========================== */
// Illustrative curves only: the shape follows the published pattern (strong up to about 300 ms, weak beyond).
const K5_own=d=>-1.5+3.5/(1+Math.exp((d-350)/90));
const K5_drift=d=>.3+2.4/(1+Math.exp((d-350)/90));
SCENE({id:'body-ownership',name:'Body ownership',tag:'Timing decides whose hand it is',
 definition:'Body ownership is the feeling that a body part is one’s own. In the rubber hand illusion a visible rubber hand and the hidden real hand are stroked together; many people then feel the touch on the rubber hand, and point to their own hand as nearer to it than it is. The effect depends on the seen and felt strokes arriving together.',
 example:'Botvinick and Cohen (1998) stroked both hands for ten minutes. When the strokes were out of step the illusion was much weaker. Later work that delayed the seen stroke found the illusion strong up to about 300 ms of delay and fading beyond it.',
 desc:'A hidden real hand and a visible rubber hand, a timeline of seen and felt strokes separated by an adjustable delay, and two bars for an ownership rating and the drift of the felt hand position. The values are illustrative.',
 research:['Botvinick, M. & Cohen, J. (1998). Rubber hands ‘feel’ touch that eyes see. Nature 391, 756. Robust as an effect of synchrony; what the ratings measure is disputed (see the third scene).','Shimada, S., Fukuda, K. & Hiraki, K. (2009). Rubber hand illusion under delayed visual feedback. PLoS ONE 4, e6185. The curve here is illustrative, shaped after their pattern, not their data.','The illusion itself is built in Senses In Motion (rubber-hand); it is not repeated here.'],
 dur:10,hint:'Move the delay between the seen stroke and the felt stroke. Watch the ownership rating and the drift fall as the two come apart.',
 init:()=>({delay:0}),
 watch(p){return {delay:Math.round(lerp(0,800,smooth(p))/50)*50}},
 ui:[{range:'delay',label:'Delay of the felt stroke',min:0,max:800,step:50,get:s=>s.delay,act:'delay',show:v=>v+' ms'}],
 on:{delay(s,v){s.delay=Number(v);return 'keep'}},
 draw(s){
  const d=s.delay,own=K5_own(d),dr=K5_drift(d);
  let out=heading('Stroke timing and the feeling of ownership');
  out+=L(40,150,400,150,C.line,3)+K5_hand(100,128,'#f3d9c4','#b98c6b')+R(166,60,8,90,C.dark,'none',3)+K5_hand(240,128,C.amberp,C.amber);
  out+=TF(100,170,'real hand (hidden)',13,C.muted)+TF(240,170,'rubber hand (seen)',13,C.amber)+TF(180,58,'screen',13,C.muted,'start');
  const fx=100+dr*14;out+=`<polygon points="${fmt(fx)},${78} ${fmt(fx-7)},${64} ${fmt(fx+7)},${64}" fill="${C.purple}"/>`+TF(fx+12,58,'felt here',13,C.purple,'end')+TF(336,100,'the felt position',13,C.purple)+TF(336,117,'drifts towards',13,C.purple)+TF(336,134,'the rubber hand',13,C.purple);
  // Timeline: one stroke a second.
  const X=t=>70+t*80;out+=L(70,262,400,262,C.line,2);[0,1,2,3,4].forEach(t=>{out+=L(X(t),262,X(t),267,C.line,1.5)+TF(X(t),281,t+' s',13,C.muted)});
  out+=TF(64,214,'seen',13,C.amber,'end')+TF(64,244,'felt',13,C.blue,'end');
  for(let k=0;k<4;k++){const t=.2+k;out+=R(X(t),203,22,16,C.amber,'none',4);const tf=t+d/1000;if(tf<4)out+=R(X(tf),233,22,16,C.blue,'none',4)}
  if(d>0)out+=L(X(.2),226,X(.2+d/1000),226,C.coral,2);
  // Bars.
  out+=R(424,48,160,250,'#fff',C.grid,10)+TBF(504,68,'Illustrative values',13,C.ink);
  const z=178,sc=30;out+=L(446,z,520,z,C.line,2)+R(462,Math.min(z,z-own*sc),40,Math.abs(own*sc),own>=0?C.green:C.coral,'none',4);
  out+=TF(442,z-3*sc+4,'+3',13,C.muted,'end')+TF(442,z+4,'0',13,C.muted,'end')+TF(442,z+3*sc+4,'−3',13,C.muted,'end')+TF(482,288,'ownership',13,C.muted)+TBF(482,own>=0?z-own*sc-6:z+Math.abs(own*sc)+16,(own>=0?'+':'−')+Math.abs(own).toFixed(1),13,own>=0?C.green:C.coral);
  const b=268;out+=R(538,b-dr*50,30,dr*50,C.purple,'none',4)+L(530,b,576,b,C.line,2)+TF(553,288,'drift',13,C.muted)+TBF(553,b-dr*50-6,dr.toFixed(1)+' cm',13,C.purple);
  out+=T(300,330,d===0?'Strokes together: the rubber hand is rated as “mine”.':d<=300?`${d} ms apart: the illusion mostly survives.`:`${d} ms apart: the illusion has largely gone.`,15,d<=300?C.green:C.coral);
  out+=TF(300,360,'Rating: agreement with “the rubber hand felt like my hand”, −3 to +3.',13,C.muted);
  return {svg:out,phase:`With the felt stroke ${d} ms after the seen one, this illustrative curve gives an ownership rating of ${(own>=0?'+':'−')+Math.abs(own).toFixed(1)} and a drift of ${dr.toFixed(1)} cm. The published pattern is the shape, strong to about 300 ms and weak beyond; the exact numbers differ between studies.`};
 }});

SCENE({id:'body-ownership-fullbody',name:'Full-body illusions',tag:'Moving where the self is felt',
 definition:'The same trick works for the whole body. A person wearing a video headset sees a body from behind while their own body is stroked. When seen and felt strokes agree, people report that the seen body feels like theirs, or that they are sitting where the cameras are.',
 example:'Lenggenhager, Tadi, Metzinger and Blanke (2007) showed people their own back, filmed from two metres behind and displayed as if two metres in front. After synchronous stroking, blindfolded and moved, they walked back to a spot nearer the seen body. Ehrsson (2007) stroked the chest while a rod moved just below the cameras; a hammer swung at that spot raised skin conductance more after synchronous stroking.',
 desc:'A side view of a camera, a person in a headset and the body they see. A test shows either where the person walks back to, or the skin response to a threat aimed below the cameras, for synchronous and asynchronous stroking. Sizes are illustrative.',
 research:['Lenggenhager, B., Tadi, T., Metzinger, T. & Blanke, O. (2007). Video ergo sum: manipulating bodily self-consciousness. Science 317, 1096–1099.','Ehrsson, H. H. (2007). The experimental induction of out-of-body experiences. Science 317, 1048. Both effects have been repeated in other laboratories; the sizes drawn here are illustrative.'],
 dur:14,hint:'Choose a study and a stroking condition, then press Run the test. Compare in time with out of time.',
 init:()=>({study:'L',sync:1,tested:0}),
 watch(p){const q=Math.min(3.999,p*4),i=Math.floor(q);return {study:i<2?'L':'E',sync:i%2===0?1:0,tested:q-i>.4?1:0}},
 ui:[{choose:[['L','Lenggenhager'],['E','Ehrsson']],label:'Study',get:s=>s.study,act:'study'},{choose:[[1,'In time'],[0,'Out of time']],label:'Stroking',get:s=>s.sync,act:'sync'},{b:'Run the test',act:'test'}],
 on:{study(s,v){s.study=v;s.tested=0;return 'keep'},sync(s,v){s.sync=Number(v);s.tested=0;return 'keep'},test(s){s.tested=1;return 'keep'}},
 draw(s){
  const Ls=s.study==='L',g=250;let out=heading(Ls?'Seeing your own back, two metres ahead':'Seeing yourself from the cameras’ position');
  out+=L(40,g,560,g,C.line,3);
  // camera
  out+=R(70,g-74,34,22,C.dark,'none',4)+`<polygon points="104,${g-70} 118,${g-78} 118,${g-48} 104,${g-56}" fill="${C.dark}"/>`+L(87,g-52,87,g,C.dark,3)+TF(87,g+18,'cameras',13,C.muted);
  out+=K5_fig(250,g,C.ink)+R(243,g-70,16,7,C.blue,'none',2)+TF(250,g+18,'participant',13,C.muted);
  out+=L(87,g+34,250,g+34,C.line,1.5)+TF(168,g+50,'2 m',13,C.muted);
  if(Ls){out+=K5_fig(410,g,C.purple,'opacity=".55"')+TF(410,g+18,'body seen in headset',13,C.purple)+L(250,g+34,410,g+34,C.line,1.5)+TF(330,g+50,'2 m (as displayed)',13,C.muted);
   out+=L(236,g-48,228,g-36,C.amber,4)+TF(196,g-22,'back',13,C.amber)+TF(196,g-6,'stroked',13,C.amber);
   if(s.tested){const dx=s.sync?16:2;out+=K5_fig(140,g,C.muted,'opacity=".35"')+arrow(150,g-84,250+dx,g-84,C.green,2.5);
    out+=TF(140,g-98,'led away, blindfolded',13,C.muted)+T(300,104,s.sync?'Walks back past the start, towards the seen body':'Walks back to about the starting place',15,s.sync?C.green:C.ink)+TF(300,126,s.sync?'drift drawn as 0.2 m (illustrative)':'drift near zero (illustrative)',13,C.muted)}
   else out+=T(300,104,'Press Run the test: led away, then asked to walk back',14,C.muted)}
  else{out+=L(262,g-44,274,g-36,C.amber,4)+TF(306,g-52,'chest',13,C.amber)+TF(306,g-36,'stroked',13,C.amber)+L(96,g-30,128,g-22,C.amber,4)+TF(150,g-34,'rod moves',13,C.amber)+TF(150,g-18,'below',13,C.amber);
   if(s.sync)out+=`<polygon points="87,${g-96} 80,${g-110} 94,${g-110}" fill="${C.purple}"/>`+TF(102,g-114,'“I am here”',13,C.purple,'start');
   out+=R(400,60,170,160,'#fff',C.grid,10)+TBF(485,80,'Skin response to threat',13,C.ink)+TF(485,96,'(illustrative)',13,C.muted)+L(420,200,550,200,C.line,2);
   if(s.tested){const h=s.sync?80:26;out+=R(455,200-h,60,h,s.sync?C.coral:C.muted,'none',4)+TBF(485,200-h-6,s.sync?'larger':'smaller',13,s.sync?C.coral:C.muted)+K5_wrapT(200,84,'A hammer swings at the spot below the cameras',26,14,C.ink)}
   else out+=TF(485,150,'not yet tested',13,C.muted)+K5_wrapT(200,84,'Press Run the test: a threat below the cameras',26,14,C.muted)}
  out+=T(300,340,s.sync?'In time: seen and felt touch agree.':'Out of time: seen and felt touch disagree.',15,s.sync?C.green:C.coral);
  return {svg:out,phase:Ls?(s.sync?'After synchronous stroking, people placed themselves nearer the body they had seen. The feeling of where “I” am had shifted forward.':'After asynchronous stroking the walk back ended close to where it began: timing, not just the picture, moves the felt self.'):(s.sync?'After synchronous stroking people reported sitting behind their own body, and a threat to that empty spot produced a larger skin response.':'With stroking out of time, the empty spot below the cameras was not felt as the self’s location, and the threat mattered less.')};
 }});

const K5_MEASQ={title:'Which account expects this finding?',q:'Which account expects it?',opts:['The senses','Suggestion','Both'],items:[
 {t:'Ownership ratings are higher after stroking in time than after stroking out of time.',a:2,why:'Merging sight and touch predicts it. So does suggestion: the set-up makes it plain what is expected, and people can sense that.'},
 {t:'People who only read a description of the two conditions predict higher ratings for stroking in time.',a:1,why:'Lush (2020) found this. The expectation is there to be met, so the usual control does not rule suggestion out.'},
 {t:'People who respond more to imaginative suggestion give higher illusion ratings.',a:1,why:'Lush et al. (2020) reported it in a large sample. Ehrsson et al. (2022) dispute the analysis, so treat it as contested.'},
 {t:'The illusion fades once seen and felt strokes are more than about 300 ms apart.',a:0,why:'A narrow time window is what sensory merging predicts. A suggestion account must add that people expect that exact window.'}]};
SCENE({id:'body-ownership-measures',name:'What do the ratings measure?',tag:'A critique of the questionnaire',
 definition:'Most evidence for these illusions is a questionnaire: people rate how far they agree that the rubber hand felt like theirs. One account says the rating reports a real merging of sight and touch. Another says part of it is suggestion: participants can tell what is expected and, without lying, come to experience it.',
 example:'Lush and colleagues (2020) measured how strongly people respond to imaginative suggestion, the trait behind hypnotic responding, and found that it predicted rubber hand ratings. Ehrsson and colleagues (2022) replied that the relation is not specific to the illusion. The question is open.',
 desc:'Four findings shown one at a time; for each the learner chooses whether the sensory account, the suggestion account or both expect it, and the reasoning is shown.',
 research:['Lush, P. et al. (2020). Trait phenomenological control predicts experience of mirror synaesthesia and the rubber hand illusion. Nature Communications 11, 4853.','Lush, P. (2020). Demand characteristics confound the rubber hand illusion. Collabra: Psychology 6, 22.','Ehrsson, H. H., Fotopoulou, A., Radziun, D., Longo, M. R. & Tsakiris, M. (2022). No specific relationship between hypnotic suggestibility and the rubber hand illusion. Nature Communications 13, 564. Contested.'],
 dur:16,hint:'Read each finding and choose which account expects it. Use Next for the following case.',
 init:()=>({i:0,ans:[null,null,null,null]}),watch:K5_quizWatch(K5_MEASQ),ui:K5_quizUi,on:K5_quizOn,
 draw(s,f,X){return {svg:K5_quiz(X,s,K5_MEASQ),phase:K5_quizPhase(s,K5_MEASQ)}}});

/* =========================== agency =========================== */
const K5_REV=2560,K5_MARK=K5_REV/60;   // Libet's clock: one turn in 2.56 s, so one mark is 42.7 ms.
const K5_wrapPos=d=>{while(d>30)d-=60;while(d<=-30)d+=60;return d};
const K5_rp=t=>t<-550?0:t<=0?Math.pow((t+550)/550,1.6):Math.max(0,1-t/160);
SCENE({id:'agency',name:'The Libet clock',tag:'You take part: time your own urge to move',
 definition:'The sense of agency is the feeling of being the one who causes an action. Kornhuber and Deecke (1965) found a slow build-up of brain activity, the readiness potential, before voluntary movements. Libet and colleagues (1983) asked people to move when they felt like it and to report, from a fast clock, when they first felt the urge.',
 example:'In Libet’s data the readiness potential began about half a second before the movement, and the reported urge came only about 200 ms before it. Libet’s clock dot went round once every 2.56 seconds, so each of the 60 marks is 43 ms.',
 desc:'A clock face with a dot that goes round every 2.56 seconds, beside a time line showing a simulated readiness potential, Libet’s reported urge time of about 200 ms before movement, and the learner’s own reported times.',
 research:['Kornhuber, H. H. & Deecke, L. (1965). Pflügers Archiv 284, 1–17 (the readiness potential).','Libet, B., Gleason, C. A., Wright, E. W. & Pearl, D. K. (1983). Time of conscious intention to act in relation to onset of cerebral activity (readiness-potential). Brain 106, 623–642. The timings replicate; what they mean is contested.','Banks, W. P. & Isham, E. A. (2009). We infer rather than perceive the moment we decided to act. Psychological Science 20, 17–21: a delayed beep after the press moves the reported urge later, so the clock report is partly an inference.'],
 dur:12,hint:'Press Start the clock and let the dot go round once. Press I moved whenever you feel like it, noting where the dot was when the urge appeared. Then set that position and press Record. Your times stay on this page; screen timing is only good to a few tens of milliseconds.',
 init:()=>({phase:'idle',t0:0,el:0,press:0,stop:0,pos:15,trials:[],seed:3,sim:false}),
 watch(p){const t=p*6400,press=3700,pp=(press%K5_REV)/K5_MARK,pos=pp-200/K5_MARK;
  return {phase:t<press?'run':t<4300?'after':p<.85?'report':'idle',el:Math.min(t,4300),press,pos,trials:p>=.85?[-200]:[],sim:true}},
 ui:[{b:'Start the clock',act:'start'},{b:'I moved',act:'press'},{range:'pos',label:'Dot position at the urge',min:0,max:59,step:1,get:s=>Math.round(s.pos),act:'pos',show:v=>String(Number(v)||60)},{b:'Record',act:'rec'},{b:'Clear',act:'clear'}],
 on:{
  start(s,_,ctx){if((s.phase==='run'||s.phase==='after')&&performance.now()-s.t0-s.el<500)return 'keep';s.phase='run';s.t0=performance.now();s.el=0;ctx.every(40,'tick');return 'keep'},
  tick(s){if(s.phase!=='run'&&s.phase!=='after')return 'stop';s.el=performance.now()-s.t0;if(s.phase==='after'&&s.el>=s.stop){s.el=s.stop;s.phase='report';return 'stop'}if(s.phase==='run'&&s.el>30000){s.phase='idle';return 'stop'}return 'keep'},
  press(s){if(s.phase!=='run')return 'keep';const el=performance.now()-s.t0;if(el<400)return 'keep';s.press=el;s.seed=(s.seed*48271)%2147483647;s.stop=el+500+s.seed%500;s.phase='after';return 'keep'},
  pos(s,v){s.pos=Number(v);return 'keep'},
  rec(s){if(s.phase!=='report')return 'keep';const pp=(s.press%K5_REV)/K5_MARK;s.trials.push(Math.round(K5_wrapPos(s.pos-pp)*K5_MARK));if(s.trials.length>6)s.trials.shift();s.phase='idle';return 'keep'},
  clear(s){s.trials=[];if(s.phase==='report')s.phase='idle';return 'keep'}},
 draw(s){
  let out=heading(s.sim?'Simulated participant at the Libet clock':'When did you first feel the urge to move?');
  const cx=140,cy=188,r=92,pt=(pos,rr)=>{const a=pos/60*2*Math.PI;return [cx+rr*Math.sin(a),cy-rr*Math.cos(a)]};
  out+=Ci(cx,cy,r,'#fff',C.line);
  for(let m=0;m<60;m++){const a=pt(m,r),b=pt(m,m%5===0?r-9:r-4);out+=L(a[0],a[1],b[0],b[1],C.line,m%5===0?2:1)}
  for(let m=5;m<=60;m+=5){const q=pt(m,r+15);out+=TF(q[0],q[1]+5,String(m),13,C.muted)}
  out+=Ci(cx,cy,3,C.line);
  const run=s.phase==='run'||s.phase==='after';
  if(run){const q=pt((s.el%K5_REV)/K5_MARK,r-18);out+=Ci(q[0],q[1],7,C.blue)}
  if(s.phase==='report'){const q=pt(s.pos,r-18),pq=pt((s.press%K5_REV)/K5_MARK,r-18);out+=Ci(q[0],q[1],8,'#fff',C.purple)+Ci(pq[0],pq[1],4,C.coral)+TF(cx,cy-12,'ring: urge (yours to set)',13,C.purple)+TF(cx,cy+18,'dot: the press',13,C.coral)}
  if(s.phase==='after')out+=TBF(cx,cy+24,'pressed',13,C.coral);
  const msg={idle:s.trials.length?'Start the clock for another trial.':'Press Start the clock.',run:'Move when you feel like it. Note the dot.',after:'Keep the position in mind…',report:'Set the ring where the dot was, then Record.'}[s.phase];
  out+=K5_wrap(cx,cy+r+44,msg,34,13,C.ink);
  // Time line, ms relative to movement.
  const X=t=>316+(t+1000)*.22,y0=170;
  out+=R(306,48,282,150,'#fff',C.grid,8)+TF(312,64,'simulated brain trace (not yours)',13,C.muted,'start');
  const pts=[];for(let t=-1000;t<=160;t+=10)pts.push([X(t),y0-K5_rp(t)*72]);out+=K5_poly(pts,C.ink,2.4);
  out+=L(X(-550),y0+2,X(-550),y0-90,C.amber,1.5,'stroke-dasharray="4 4"')+TF(X(-550),y0+18,'−550',13,C.amber);
  out+=L(X(-200),y0+2,X(-200),y0-90,C.purple,1.5,'stroke-dasharray="4 4"')+TF(X(-200),y0+18,'−200',13,C.purple);
  out+=L(X(0),y0+2,X(0),y0-90,C.coral,2)+TF(X(0),y0+18,'0 ms',13,C.coral);
  out+=TF(316,y0+18,'−1000',13,C.muted,'start');
  out+=TF(312,216,'−550: readiness potential starts (Libet)',13,C.amber,'start')+TF(312,234,'−200: reported urge (Libet)',13,C.purple,'start')+TF(312,252,'0: the movement',13,C.coral,'start');
  // The learner's reports on the same axis.
  out+=L(X(-1000),290,X(200),290,C.line,2)+L(X(0),282,X(0),298,C.coral,2)+L(X(-200),284,X(-200),296,C.purple,2);
  s.trials.forEach(w=>{out+=Ci(X(clamp(w,-1000,200)),290,5,C.blue,'#fff')});
  const n=s.trials.length,mean=n?Math.round(sum(s.trials)/n):0;
  out+=TBF(312,276,s.sim?'Simulated report':'Your reports',13,C.ink,'start');
  out+=TF(312,316,n?`${n} trial${n>1?'s':''}: mean ${mean>0?'+':mean<0?'−':''}${Math.abs(mean)} ms ${mean<0?'before':mean>0?'after':'at'} the press`:'none yet',13,C.blue,'start');
  out+=K5_wrap(447,340,'Negative means the urge was placed before the press.',44,13,C.muted);
  return {svg:out,phase:n?`${s.sim?'The simulated participant placed':'You placed'} the urge ${Math.abs(mean)} ms ${mean<0?'before':mean>0?'after':'at'} the press on average; Libet’s participants averaged about 200 ms before. The brain trace is a drawing of the published shape, not a recording. This does not show that the decision was made without you: see the next scene.`:'One mark on the clock is 43 ms. Rest your finger on the I moved button so that pressing is the movement. There is no right answer; a handful of trials on a phone is rough.'};
 }});

// Toy accumulator in the spirit of Schurger et al. (2012): leaky noisy build-up that triggers a movement at a threshold.
const K5_ACC={I:.1,k:.5,c:.1,thr:.4,dt:.01,len:300,data:null,avg:{}};
function K5_accData(){
 if(K5_ACC.data)return K5_ACC.data;const A=K5_ACC,r=rng(20120806),cross=[],rand=[],sq=Math.sqrt(A.dt);
 for(let tr=0;tr<100;tr++){let x=0,buf=[];for(let i=0;i<40000;i++){x+=(A.I-A.k*x)*A.dt+A.c*sq*K5_gauss(r);buf.push(x);if(x>=A.thr){if(buf.length>=A.len){cross.push(buf.slice(-A.len));break}x=0;buf=[]}}
  if(cross.length<=tr)cross.push(buf.slice(-A.len))}
 for(let tr=0;tr<100;tr++){let x=.2;const buf=[];for(let i=0;i<800;i++){x+=(A.I-A.k*x)*A.dt+A.c*sq*K5_gauss(r);buf.push(x)}rand.push(buf.slice(-A.len))}
 return K5_ACC.data={cross,rand};
}
function K5_accAvg(n,al){const key=n+al;if(K5_ACC.avg[key])return K5_ACC.avg[key];const ep=K5_accData()[al].slice(0,n),out=[];for(let i=0;i<K5_ACC.len;i++){let a=0;for(const e of ep)a+=e[i];out.push(a/ep.length)}return K5_ACC.avg[key]=out}
const K5_ACCN=[1,2,5,10,20,50,100];
SCENE({id:'agency-readiness',name:'Is the build-up a decision?',tag:'A toy model of the readiness potential',
 definition:'Schurger, Sitt and Dehaene (2012) proposed that the readiness potential need not be a decision forming. If activity drifts up and down at random, and a movement is triggered whenever it happens to cross a threshold, then averaging many trials backwards from the movement gives a smooth ramp, because every trial is chosen for ending on an upward drift.',
 example:'In this toy, single trials wander with no clear start. The average of 100 trials lined up on the crossing rises smoothly over the last second or so. Lined up on arbitrary moments instead, the same activity averages to a flat line.',
 desc:'A plot of a toy noisy accumulator over the three seconds before a threshold crossing: faint single trials, the bold average of a chosen number of trials, and the threshold. An option lines trials up on arbitrary moments instead.',
 research:['Schurger, A., Sitt, J. D. & Dehaene, S. (2012). An accumulator model for spontaneous neural activity prior to self-initiated movement. PNAS 109, E2904–E2913.','Libet et al. (1983), Brain 106, 623–642. The model fits the shape of the readiness potential; whether it is the right account is still argued. The plot is a toy with made-up parameters, not a fit to data.'],
 dur:12,hint:'Raise the number of trials averaged and watch a ramp appear out of noise. Then line the trials up on arbitrary moments and see it vanish.',
 init:()=>({n:0,al:'cross'}),
 watch(p){return p<.72?{n:Math.min(6,Math.floor(p/.72*7)),al:'cross'}:{n:6,al:'rand'}},
 ui:[{range:'n',label:'Trials averaged',min:0,max:6,step:1,get:s=>s.n,act:'n',show:v=>String(K5_ACCN[Number(v)])},{choose:[['cross','On the crossing'],['rand','On arbitrary moments']],label:'Line trials up',get:s=>s.al,act:'al'}],
 on:{n(s,v){s.n=Number(v);return 'keep'},al(s,v){s.al=v;return 'keep'}},
 draw(s){
  const n=K5_ACCN[s.n],d=K5_accData()[s.al],avg=K5_accAvg(n,s.al),A=K5_ACC;
  let out=heading(n===1?'One trial: noise with no clear start':`Average of ${n} trials`);
  const x0=70,y0=56,w=440,h=230,X=i=>x0+i/(A.len-1)*w,Y=v=>y0+h-clamp(v,-.05,.5)/.5*h*.9-h*.08;
  out+=R(x0,y0,w,h,'#fff',C.grid,6);
  [[0,'−3 s'],[100,'−2 s'],[200,'−1 s'],[299,s.al==='cross'?'movement':'0 s']].forEach(([i,l])=>{out+=L(X(i),y0+h,X(i),y0+h+5,C.line,1.5)+TF(X(i),y0+h+20,l,13,C.muted,i===299?'end':'middle')});
  out+=L(x0,Y(A.thr),x0+w,Y(A.thr),C.coral,1.6,'stroke-dasharray="6 5"')+TF(x0+6,Y(A.thr)-6,'threshold',13,C.coral,'start');
  out+=TF(x0-6,Y(0)+4,'0',13,C.muted,'end')+TF(x0+4,y0+16,'activity (arbitrary units)',13,C.muted,'start');
  out+=R(x0+w-98,y0+h-28,92,22,C.amberp,'none',5)+TBF(x0+w-52,y0+h-12,'TOY MODEL',13,C.amber);
  d.slice(0,Math.min(n,6)).forEach(e=>{const pts=[];for(let i=0;i<A.len;i+=2)pts.push([X(i),Y(e[i])]);out+=K5_poly(pts,'#b9cbd8',1.2)});
  const pts=[];for(let i=0;i<A.len;i++)pts.push([X(i),Y(avg[i])]);out+=K5_poly(pts,C.blue,3);
  const a2=avg[100],a05=avg[250],a0=avg[299];
  out+=T(300,330,`Average: ${a2.toFixed(2)} at −2 s, ${a05.toFixed(2)} at −0.5 s, ${a0.toFixed(2)} at the end`,14,C.ink);
  out+=TF(300,358,s.al==='cross'?'Trials are lined up on the moment the threshold was crossed.':'Trials are lined up on arbitrary moments: no crossing is selected.',13,C.muted);
  return {svg:out,phase:s.al==='rand'?`Lined up on arbitrary moments, the average of ${n} trial${n>1?'s':''} sits near ${a0.toFixed(2)} throughout: there is no ramp, though the activity is the same kind of noise.`:n<5?'A single trial is jagged. Nothing in it marks a moment when a decision began.':`Averaged over ${n} trials the noise cancels and a ramp is left, rising from ${a2.toFixed(2)} to ${a0.toFixed(2)}. On this account the ramp’s early start is produced by lining trials up on the crossing; it does not mark a decision made half a second early.`};
 }});

const K5_BIND={vol:{name:'Voluntary key press',act:15,tone:-46},invol:{name:'Involuntary twitch (TMS)',act:-27,tone:31}};
SCENE({id:'agency-binding',name:'Intentional binding',tag:'Actions and their effects are pulled together in time',
 definition:'Intentional binding is a shift in judged timing: when a voluntary action is followed by an effect, the action is judged to happen later and the effect earlier than they did, so the two seem closer. It is used as an indirect measure of the sense of agency, one that does not ask people how in control they felt.',
 example:'Haggard, Clark and Kalogeras (2002) had people press a key that caused a tone 250 ms later. The press was judged 15 ms late and the tone 46 ms early. When a magnetic pulse over motor cortex made the finger twitch instead, the shifts reversed: 27 ms early and 31 ms late.',
 desc:'A time line with the actual action and tone 250 milliseconds apart, and below it their judged times for a voluntary press or an involuntary twitch, with the judged interval computed.',
 research:['Haggard, P., Clark, S. & Kalogeras, J. (2002). Voluntary action and conscious awareness. Nature Neuroscience 5, 382–385. The shift replicates well.','Buehner, M. J. (2012). Understanding the past, predicting the future: causation, not intentional action, is the root of temporal binding. Psychological Science 23, 1490–1497. Whether binding measures agency or belief in a cause is contested.'],
 dur:10,hint:'Switch between a voluntary press and an involuntary twitch, and compare the judged interval with the real 250 ms.',
 init:()=>({cond:'vol'}),
 watch(p){return {cond:p<.5?'vol':'invol'}},
 ui:[{choose:[['vol','Voluntary press'],['invol','Involuntary twitch']],label:'Action',get:s=>s.cond,act:'cond'}],
 on:{cond(s,v){s.cond=v;return 'keep'}},
 draw(s){
  const b=K5_BIND[s.cond],X=t=>110+(t+100)*.9,ja=b.act,jt=250+b.tone,int=jt-ja,vol=s.cond==='vol';
  let out=heading(b.name+': judged times shift');
  [[-100,''],[0,'0'],[100,'100'],[200,'200'],[300,'300 ms']].forEach(([t,l])=>{out+=L(X(t),88,X(t),296,C.grid,1)+TF(X(t),316,l,13,C.muted)});
  out+=TB(24,128,'Actual',14,C.ink,'start')+L(X(-100),150,X(340),150,C.line,2)+Ci(X(0),150,9,C.ink)+Ci(X(250),150,9,C.ink)+TF(X(0),124,'action',13,C.ink)+TF(X(250),124,'tone',13,C.ink);
  out+=L(X(0),172,X(250),172,C.muted,1.5)+TF(X(125),190,'250 ms',13,C.muted);
  out+=TB(24,238,'Judged',14,C.blue,'start')+L(X(-100),260,X(340),260,C.line,2)+Ci(X(ja),260,9,C.blue)+Ci(X(jt),260,9,C.blue);
  out+=L(X(0),150,X(ja),260,C.blue,1.2,'stroke-dasharray="3 4"')+L(X(250),150,X(jt),260,C.blue,1.2,'stroke-dasharray="3 4"');
  out+=TBF(X(ja)-14,246,(ja>0?'+':'−')+Math.abs(ja)+' ms',13,C.blue,'end')+TBF(X(jt)+14,246,(b.tone>0?'+':'−')+Math.abs(b.tone)+' ms',13,C.blue,'start');
  out+=L(X(ja),282,X(jt),282,C.blue,2)+TBF(X((ja+jt)/2),300,int+' ms',13,C.blue);
  out+=T(300,350,vol?`Judged interval ${int} ms: action and tone pulled together`:`Judged interval ${int} ms: twitch and tone pushed apart`,15,vol?C.green:C.coral);
  return {svg:out,phase:vol?`The press is judged ${ja} ms late and the tone ${-b.tone} ms early, so 250 ms is judged as 250 − ${-b.tone} − ${ja} = ${int} ms. The numbers are the group means from Haggard, Clark and Kalogeras (2002).`:`The twitch is judged ${-ja} ms early and the tone ${b.tone} ms late, so 250 ms is judged as 250 + ${b.tone} + ${-ja} = ${int} ms. The body moved in both cases; only the voluntary movement was bound to its effect.`};
 }});

const K5_WILL=[['prior','Priority','the thought comes just before the action'],['cons','Consistency','the thought matches the action'],['excl','Exclusivity','no other cause is in view']];
SCENE({id:'agency-will',name:'The feeling of willing',tag:'Wegner’s account, and what Libet does not show',
 definition:'Daniel Wegner (2002) argued that the feeling of having willed an action is an inference. We feel we did it when a thought about the action comes just before it, matches it, and no other cause is apparent. On his view the feeling is a guide to authorship, not a direct view of what caused the act.',
 example:'In Wegner and Wheatley’s (1999) “I Spy” study two people moved a pointer together; one was secretly a confederate who forced the stops. Participants who heard the name of an object a few seconds before the pointer stopped on it rated the stop as more their own doing.',
 desc:'A diagram with a thought and an action, each with its own hidden causes, and a dashed arrow from thought to action for the experienced link. Three conditions can be switched on and off and a meter shows the strength of the feeling of will.',
 research:['Wegner, D. M. & Wheatley, T. (1999). Apparent mental causation: sources of the experience of will. American Psychologist 54, 480–492.','Wegner, D. M. (2002). The Illusion of Conscious Will. MIT Press.','Against: Mele, A. R. (2009). Effective Intentions: The Power of Conscious Will. Oxford University Press. Cases where the feeling errs do not show that conscious intentions never cause actions. Libet’s result is often overstated as a disproof of free will; it is contested.'],
 dur:12,hint:'Press the three conditions to switch them on and off. The feeling of will changes; the causes of the action in this diagram do not.',
 init:()=>({prior:1,cons:1,excl:1}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {prior:k===1?0:1,cons:k===2?0:1,excl:k===3?0:1}},
 ui:[{b:'All on',act:'all'}],
 on:{tog(s,k){s[k]=s[k]?0:1;return 'keep'},all(s){s.prior=s.cons=s.excl=1;return 'keep'}},
 draw(s,f,X){
  const n=s.prior+s.cons+s.excl;let out=heading('The experience of will as an inference');
  out+=R(24,70,196,40,'#f1f5f8','none',8)+TF(122,95,'hidden cause of thought',13,C.muted)+R(24,170,196,40,'#f1f5f8','none',8)+TF(122,195,'hidden cause of action',13,C.muted);
  out+=box(280,64,120,52,'Thought',C.pale,C.ink,17)+box(280,164,120,52,'Action',C.greenp,C.ink,17);
  out+=arrow(222,90,278,90,C.muted,2.5)+arrow(222,190,278,190,C.muted,2.5);
  out+=arrow(340,116,340,162,n===3?C.purple:n===0?'#d6dbe0':C.purple,n===3?4:2.5,9,'stroke-dasharray="7 6"')+TF(352,136,'felt as',13,C.purple,'start')+TF(352,152,'“I did that”',13,C.purple,'start');
  out+=R(450,60,120,160,'#fff',C.grid,10)+TBF(510,80,'Feeling of will',13,C.ink);
  for(let i=0;i<3;i++)out+=R(480,166-i*34,60,28,i<n?C.purple:'#eef1f4','none',5);
  out+=TBF(510,212,['absent','weak','moderate','strong'][n],13,C.purple);
  K5_WILL.forEach(([k,name,what],i)=>{const on=!!s[k],x=30+i*184;out+=K5_chip(X,'tog',k,name+(on?': yes':': no'),x,244,172,40,on?'on':'off',`${name}: ${what}. Now ${on?'yes':'no'}. Press to switch.`)+K5_wrap(x+86,302,what,24,13,C.muted)});
  out+=T(300,358,'The solid arrows, the actual causes in this diagram, never change.',14,C.muted);
  return {svg:out,phase:n===3?'All three conditions hold, so the action feels willed. On Wegner’s account that feeling would arise whether or not the thought caused the action.':`With ${3-n} condition${3-n>1?'s':''} missing the feeling weakens, as when a hand moves on a Ouija board. Critics accept that the feeling can be fooled and deny that this makes every conscious intention idle.`};
 }});

/* =========================== the-interpreter =========================== */
const K5_INT_OPTS=['“I don’t know why I chose a shovel.”','“I saw snow, so I chose a shovel.”','“A shovel cleans out the chicken shed.”'];
const K5_INT_HEAD=['Two pictures, one to each hemisphere','Each hand picks a matching card','He is asked why. What will he say?','What he said'];
SCENE({id:'the-interpreter',name:'The interpreter',tag:'Explaining an action someone else chose',
 definition:'After surgery that cuts the connections between the hemispheres, a picture shown to one side of gaze reaches only the opposite hemisphere. Gazzaniga and LeDoux (1978) used this to give each hemisphere of patient P.S. a different picture, and then asked the speaking left hemisphere to explain what both hands had done. Gazzaniga called the process that supplies such explanations the interpreter.',
 example:'The left hemisphere saw a chicken claw and the right saw a snow scene. The right hand picked a chicken and the left hand a shovel. Asked why, P.S. said that the claw goes with the chicken and you need a shovel to clean out the chicken shed.',
 desc:'A screen with a snow scene left of gaze and a chicken claw right of gaze, crossing to the right and left hemispheres; each hemisphere’s hand picks a card; the learner predicts the spoken explanation and then sees it.',
 research:['Gazzaniga, M. S. & LeDoux, J. E. (1978). The Integrated Mind. Plenum Press.','Gazzaniga, M. S. (2000). Cerebral specialization and interhemispheric communication. Brain 123, 1293–1326. The observation comes from a few patients. It does not support sorting people into left-brained and right-brained types: Nielsen et al. (2013), PLoS ONE 8, e71275, found no such types in 1,011 brain scans.'],
 dur:14,hint:'Press Next step to follow the trial. At the third step, choose what you think the patient will say.',
 init:()=>({step:0,ans:null}),
 watch(p){const k=Math.min(3,Math.floor(p*4.4));return {step:k,ans:k===3?2:null}},
 ui:[{b:'Next step',act:'next'},{b:'Start again',act:'reset'}],
 on:{next(s){if(s.step<3)s.step++;return 'keep'},reset(s){s.step=0;s.ans=null;return 'keep'},ans(s,j){s.ans=Number(j);s.step=3;return 'keep'}},
 draw(s,f,X){
  let out=heading(K5_INT_HEAD[s.step]);
  out+=R(160,44,280,56,C.dark,'none',8)+Ci(300,72,4,'#fff')+T(230,78,'snow scene',14,'#fff')+T(370,78,'chicken claw',14,'#fff');
  out+=box(40,134,230,50,'',C.pale)+TB(155,155,'Left hemisphere',14,C.blue)+TF(155,174,'saw the claw · speaks',13,C.ink);
  out+=box(330,134,230,50,'',C.purplep)+TB(445,155,'Right hemisphere',14,C.purple)+TF(445,174,'saw the snow · cannot speak',13,C.ink);
  out+=arrow(240,100,420,132,C.purple,2.2)+arrow(360,100,180,132,C.blue,2.2);
  if(s.step>=1){out+=arrow(180,184,410,212,C.blue,2.2)+arrow(420,184,190,212,C.purple,2.2);
   out+=box(110,214,150,36,'shovel',C.purplep,C.ink,15,C.purple)+box(340,214,150,36,'chicken',C.pale,C.ink,15,C.blue)+TF(100,237,'left hand',13,C.purple,'end')+TF(500,237,'right hand',13,C.blue,'start')}
  if(s.step===0)out+=K5_wrapT(300,290,'Each picture is flashed to one side of where he is looking, so it reaches only the opposite hemisphere.',52,14,C.muted);
  if(s.step===1)out+=K5_wrapT(300,290,'Each hemisphere controls the opposite hand, and each hand picks a card that fits what its hemisphere saw.',52,14,C.muted);
  if(s.step===2)K5_INT_OPTS.forEach((o,j)=>{out+=K5_chip(X,'ans',j,o,60,262+j*38,480,33,'off',`Predict: ${o}`)});
  if(s.step===3){out+=R(40,262,520,108,C.pale,'none',12)+K5_wrapT(300,288,'“The chicken claw goes with the chicken, and you need a shovel to clean out the chicken shed.”',50,14,C.ink,'middle',true)+K5_wrapT(300,288+2*(14*TS+6)+4,'Said by the hemisphere that never saw the snow.',52,13,C.muted)}
  return {svg:out,phase:s.step<2?'The cut removes the main route by which one hemisphere tells the other what it has seen. See Mind In Motion (split-brain) for the method, and the split-brain lesson in the previous era for the dispute about how divided these patients are.':s.step===2?'Only the left hemisphere can answer aloud, and it saw only the claw.':(s.ans===null?'':s.ans===2?'Your prediction matches. ':'Most people expect an admission of ignorance, and it did not come. ')+'The left hemisphere did not say it did not know. It fitted the shovel into the only story it had, and gave it as a plain fact.'};
 }});

// Abstract mirror-symmetric block patterns, generated from a seed.
function K5_pat(seed,x,y,cell,col){
 const r=rng((Math.imul(seed+11,2654435761)>>>0)||7);r();r();let out=R(x-6,y-6,cell*5+12,cell*5+12,'#fff',C.grid,8);
 for(let row=0;row<5;row++)for(let c=0;c<3;c++){if(r()<.52){out+=R(x+c*cell,y+row*cell,cell,cell,col,'none',2);if(c<2)out+=R(x+(4-c)*cell,y+row*cell,cell,cell,col,'none',2)}}
 return out;
}
const K5_PATCOL=[C.blue,C.green,C.purple,C.amber,C.coral,C.dark,C.blue,C.green];
function K5_cbTrials(seed){const sw=shuffled([2,3,4,5,6,7],seed).slice(0,2);return range(8).map(i=>({a:seed*31+i*2+1,b:seed*31+i*2+2,col:K5_PATCOL[(i+seed)%8],swap:sw.includes(i)}))}
const K5_REASONS=['Its overall shape','Its light and dark','I cannot say','Not the one I chose'];
const K5_cbInit=seed=>({seed,tr:K5_cbTrials(seed),k:0,phase:'choose',pick:null,log:[],sim:false,simReason:null});
SCENE({id:'the-interpreter-choice',name:'Choosing and explaining',tag:'You take part: eight choices and your reasons',
 definition:'People are usually ready to say why they prefer one thing to another. This scene collects eight of your own preferences between abstract patterns, with a reason for each, and then shows what an experiment published in 2005 did with reports of this kind.',
 example:'On each trial two patterns appear. You press the one you prefer, the cards are turned over, and you are asked what made you prefer it. A summary of your eight trials, with the published result beside it, appears straight after the last one.',
 desc:'Two abstract block patterns side by side for the learner to choose between, then a single pattern with four possible reasons. After eight trials a summary compares the learner’s results with a published study.',
 research:['Johansson, P., Hall, L., Sikström, S. & Olsson, A. (2005). Failure to detect mismatches between intention and outcome in a simple decision task. Science 310, 116–119. Robust: repeated with other materials.','Nisbett, R. E. & Wilson, T. D. (1977). Telling more than we can know. Psychological Review 84, 231–259.'],
 dur:12,hint:'Press the pattern you prefer, then say what you liked about it. There are eight trials and nothing is timed. Do it before reading the next scene. Your choices stay on this page.',
 init:()=>K5_cbInit(5),
 watch(p){const q=Math.min(3.999,p*4),i=Math.floor(q),u=q-i,st=K5_cbInit(5);st.tr=st.tr.map(t=>({...t,swap:false}));st.k=i;st.sim=true;st.phase=u<.45?'choose':u<.55?'hide':'reason';st.pick=u>.22?(i%2):null;st.simReason=u>.8?(i%3):null;return st},
 ui:[{b:'New run',act:'again'}],
 on:{
  pick(s,j,ctx){if(s.phase!=='choose')return 'keep';s.pick=Number(j);s.phase='hide';ctx.later(700,'show');return 'keep'},
  show(s){if(s.phase==='hide')s.phase='reason';return 'keep'},
  why(s,j){if(s.phase!=='reason')return 'keep';s.log.push({pick:s.pick,swap:s.tr[s.k].swap,reason:Number(j)});s.k++;s.pick=null;s.phase=s.k>=8?'done':'choose';return 'keep'},
  again(s){Object.assign(s,K5_cbInit(1+nextSeed()%900));return 'keep'}},
 draw(s,f,X){
  const cell=26,t=s.tr[Math.min(7,s.k)];let out='';
  if(s.phase==='done'){
   const sw=s.log.map((l,i)=>({...l,i})).filter(l=>l.swap),caught=sw.filter(l=>l.reason===3).length,fa=s.log.filter(l=>!l.swap&&l.reason===3).length;
   out+=heading('Two of your eight choices were swapped');
   sw.forEach((l,r)=>{const y=48+r*96,tr=s.tr[l.i],pk=l.pick===0?tr.a:tr.b,sh=l.pick===0?tr.b:tr.a;
    out+=TBF(34,y+16,'Trial '+(l.i+1),13,C.ink,'start')+K5_pat(pk,110,y+6,13,tr.col)+TF(142,y+90,'you picked',13,C.muted)+arrow(190,y+38,236,y+38,C.coral,2.5)+K5_pat(sh,256,y+6,13,tr.col)+TF(288,y+90,'you were shown',13,C.coral);
    out+=K5_wrap(360,y+32,l.reason===3?'You said it was not the one you chose.':`You gave a reason for it: “${K5_REASONS[l.reason].toLowerCase()}”.`,30,13,l.reason===3?C.green:C.ink,'start',18)});
   const bx=190,bw=300;out+=TF(bx-8,262,'You',13,C.ink,'end')+R(bx,250,bw,16,'#eef2f5','none',4)+R(bx,250,bw*caught/2,16,C.blue,'none',4)+TBF(bx+bw+8,263,`${caught} of 2`,13,C.blue,'start');
   out+=TF(bx-8,290,'Johansson et al. 2005',13,C.ink,'end')+R(bx,278,bw,16,'#eef2f5','none',4)+R(bx,278,bw*.26,16,C.muted,'none',4)+TBF(bx+bw+8,291,'about 26%',13,C.muted,'start');
   out+=TF(300,316,'share of swapped choices that were noticed',13,C.muted);
   out+=K5_wrapT(300,344,'Missing a swap is the usual result.',56,14,C.green);
   return {svg:out,phase:`On two trials you were handed the pattern you had not picked and told it was your choice. That concealment was the experiment, and it is over. You reported ${caught} of the 2 swaps${fa?`, and called ${fa} unswapped trial${fa>1?'s':''} a mismatch`:''}. In Johansson and colleagues’ study with pairs of photographs, about a quarter of swaps were detected, and people went on to give reasons for choices they had not made. The next scene looks at what this does and does not show.`};
  }
  out+=heading(`${s.sim?'Simulated participant · ':''}Trial ${s.k+1} of 8`);
  if(s.phase==='choose'){
   [0,1].forEach(j=>{const x=j?365:105;out+=hit(X,'pick',j,j?'Prefer the right pattern':'Prefer the left pattern',K5_pat(j?t.b:t.a,x,70,cell,t.col)+(s.pick===j?R(x-12,58,cell*5+24,cell*5+24,'none',C.ink,12):''))});
   out+=T(300,262,'Which pattern do you prefer?',16,C.ink)+T(300,292,s.sim?'The simulated participant presses one.':'Press the one you prefer.',14,C.muted);
  }else if(s.phase==='hide'){
   [105,365].forEach(x=>{out+=hit(X,'show',0,'Turn the card over',R(x-6,64,cell*5+12,cell*5+12,'#dfe7ec',C.line,8))});
   out+=T(300,262,'The cards are turned over…',16,C.muted);
  }else{
   const shown=(s.pick===0)!==t.swap?t.a:t.b;
   out+=K5_pat(shown,235,52,cell,t.col)+T(300,214,'This is the one you chose. What made you prefer it?',15,C.ink);
   K5_REASONS.forEach((r,j)=>{out+=K5_chip(X,'why',j,r,j%2?310:40,232+Math.floor(j/2)*50,250,42,s.simReason===j?'on':'off',`Reason: ${r}`)});
   out+=TF(300,350,'Choose the nearest answer.',13,C.muted);
  }
  return {svg:out,phase:s.sim?'A simulated participant works through four of the eight trials. Do your own run in Try it; the summary and the published result appear straight after your eighth trial.':`Trial ${s.k+1} of 8. There are no right answers here: say what you actually prefer, and why.`};
 }});

const K5_CLAIMQ={title:'What do these studies show?',q:'Supported, or overstated?',opts:['Supported','Overstated'],items:[
 {t:'People sometimes give confident reasons for a choice they did not make.',a:0,why:'This is the finding of Johansson et al. (2005), repeated since with jam, tea and survey answers.'},
 {t:'Most swapped choices in these studies went unnoticed.',a:0,why:'About a quarter of swaps were detected with photographs (2005), and no more than a third with jam and tea (Hall et al. 2010).'},
 {t:'People never know the real reasons for anything they do.',a:1,why:'The studies show that some reports are built after the fact. They do not show that all are, and many reported reasons are accurate.'},
 {t:'The speaking hemisphere of a split-brain patient explained an action it had not chosen.',a:0,why:'Gazzaniga and LeDoux (1978) observed it in P.S. It comes from a few patients after a rare operation.'},
 {t:'So people are either logical left-brain types or creative right-brain types.',a:1,why:'The interpreter finding is about one function after surgery. Scans of 1,011 people found no left-brained or right-brained types (Nielsen et al. 2013).'},
 {t:'Choice blindness shows that we are wrong about what we are experiencing right now.',a:1,why:'It concerns memory for a choice and the reasons given for it. Whether reports of present experience can be trusted is a separate question.'}]};
SCENE({id:'the-interpreter-blindness',name:'Choice blindness',tag:'What the swaps do and do not show',
 definition:'Choice blindness is the failure to notice that the outcome of a choice is not the one that was made. Johansson, Hall, Sikström and Olsson (2005) showed people pairs of photographs, asked which they preferred, and on some trials handed over the other photograph by sleight of hand. Most swaps went unnoticed, and people explained “their” choice fluently.',
 example:'Some of the reasons people gave fitted only the photograph they had rejected. In a shop, Hall and colleagues (2010) swapped jam and tea that shoppers had just chosen by taste; no more than a third of swaps were detected.',
 desc:'Six claims shown one at a time; for each the learner judges whether the studies support it or whether it is overstated, and the reasoning is shown.',
 research:['Johansson, P., Hall, L., Sikström, S. & Olsson, A. (2005). Science 310, 116–119.','Hall, L., Johansson, P., Tärning, B., Sikström, S. & Deutgen, T. (2010). Magic at the marketplace: choice blindness for the taste of jam and the smell of tea. Cognition 117, 54–61.','Nielsen, J. A. et al. (2013). An evaluation of the left-brain vs. right-brain hypothesis with resting state functional connectivity magnetic resonance imaging. PLoS ONE 8, e71275. Left-brain and right-brain personality types are not supported.'],
 dur:18,hint:'Judge each claim as supported by the studies or overstated, then press Next.',
 init:()=>({i:0,ans:[null,null,null,null,null,null]}),watch:K5_quizWatch(K5_CLAIMQ),ui:K5_quizUi,on:K5_quizOn,
 draw(s,f,X){return {svg:K5_quiz(X,s,K5_CLAIMQ),phase:K5_quizPhase(s,K5_CLAIMQ)}}});

/* =========================== mirror-self-recognition =========================== */
const K5_MIR={chimp:{name:'Chimpanzee',soc:d=>Math.exp(-(d-1)/2),self:d=>1-Math.exp(-(d-1)/2.4)},monkey:{name:'Macaque',soc:d=>.25+.75*Math.exp(-(d-1)/6),self:()=>.02}};
SCENE({id:'mirror-self-recognition',name:'The mark test',tag:'Does the animal treat the reflection as itself?',
 definition:'Gordon Gallup (1970) gave chimpanzees a mirror for ten days. At first they threatened or greeted the image as if it were another chimpanzee. Within days they began using it to inspect parts of themselves they could not otherwise see. He then marked them, under anaesthesia, with an odourless red dye on a brow and an ear, and counted touches to the marks with and without the mirror.',
 example:'With no mirror the marked chimpanzees hardly touched the marks. With the mirror back they touched them repeatedly, and some looked at or smelled their fingers afterwards. Macaques given the same treatment kept treating the image as another monkey and did not touch the marks.',
 desc:'A plot over ten days of mirror exposure showing social responses to the image falling and self-directed behaviour rising for chimpanzees, and a pair of bars for touches to the mark without and with the mirror. The curves are a schematic of the reported pattern.',
 research:['Gallup, G. G. Jr (1970). Chimpanzees: self-recognition. Science 167, 86–87. Robust for chimpanzees as a group, though not every individual passes.','The curves and bars are a schematic of the reported pattern, not Gallup’s counts.'],
 dur:12,hint:'Move through the ten days, switch between chimpanzee and macaque, then run the mark test.',
 init:()=>({sp:'chimp',day:1,mark:0}),
 watch(p){const m=p>=.5;const u=m?(p-.5)*2:p*2;return {sp:m?'monkey':'chimp',day:Math.round(lerp(1,10,Math.min(1,u/.7))),mark:u>.75?1:0}},
 ui:[{choose:[['chimp','Chimpanzee'],['monkey','Macaque']],label:'Animal',get:s=>s.sp,act:'sp'},{range:'day',label:'Day with the mirror',min:1,max:10,step:1,get:s=>s.day,act:'day'},{b:'Run the mark test',act:'mark'}],
 on:{sp(s,v){s.sp=v;s.mark=0;return 'keep'},day(s,v){s.day=Number(v);return 'keep'},mark(s){s.mark=1;s.day=10;return 'keep'}},
 draw(s){
  const m=K5_MIR[s.sp],x0=60,y0=88,w=280,h=166,X=d=>x0+(d-1)/9*w,Y=v=>y0+h-v*h*.9;
  let out=heading(m.name+' and mirror: ten days, then the mark');
  out+=R(x0,y0,w,h,'#fff',C.grid,6);[1,4,7,10].forEach(d=>{out+=L(X(d),y0+h,X(d),y0+h+5,C.line,1.5)+TF(X(d),y0+h+20,'day '+d,13,C.muted)});
  const a=[],b=[];for(let d=1;d<=10;d+=.25){a.push([X(d),Y(m.soc(d))]);b.push([X(d),Y(m.self(d))])}
  out+=K5_poly(a,C.coral,3)+K5_poly(b,C.green,3)+L(X(s.day),y0,X(s.day),y0+h,C.ink,1.5,'stroke-dasharray="4 4"')+Ci(X(s.day),Y(m.soc(s.day)),5,C.coral)+Ci(X(s.day),Y(m.self(s.day)),5,C.green);
  out+=L(x0,58,x0+22,58,C.coral,3)+TF(x0+28,62,'treats image as another animal',13,C.coral,'start')+L(x0,76,x0+22,76,C.green,3)+TF(x0+28,80,'uses the mirror on itself',13,C.green,'start');
  // Head with marks.
  out+=Ci(430,96,30,'#e9dccf','#8a6f5a')+Ci(398,90,9,'#e9dccf','#8a6f5a')+Ci(462,90,9,'#e9dccf','#8a6f5a')+Ci(420,92,3,C.ink)+Ci(440,92,3,C.ink)+P('M420 108 Q430 114 440 108','#8a6f5a',2);
  if(s.mark)out+=Ci(419,80,5,'#d2202a')+Ci(464,84,4,'#d2202a')+TF(520,84,'red marks:',13,'#b01620')+TF(520,101,'brow and ear',13,'#b01620');else out+=TF(528,92,'not yet marked',13,C.muted);
  out+=R(380,140,196,150,'#fff',C.grid,8)+TBF(478,160,'Touches to the marks',13,C.ink)+L(396,262,560,262,C.line,2);
  if(s.mark){const hi=s.sp==='chimp'?80:6;out+=R(412,262-6,50,6,C.muted,'none',3)+R(494,262-hi,50,hi,s.sp==='chimp'?C.green:C.muted,'none',3)+TBF(437,250,'few',13,C.muted)+TBF(519,262-hi-6,s.sp==='chimp'?'many':'few',13,s.sp==='chimp'?C.green:C.muted)}
  else out+=TF(478,215,'press Run the mark test',13,C.muted);
  out+=TF(437,280,'no mirror',13,C.muted)+TF(519,280,'mirror',13,C.muted);
  out+=T(300,330,s.mark?(s.sp==='chimp'?'The mirror is used to find a mark on the animal’s own face.':'The mirror makes no difference: the image is still “another monkey”.'):`Day ${s.day}: ${s.sp==='chimp'?(s.day<3?'mostly threats and greetings to the image.':'mostly grooming and inspecting itself.'):'still responding to the image as another monkey.'}`,15,C.ink);
  out+=TF(300,358,'Schematic of how often each behaviour was seen, not Gallup’s counts.',13,C.muted);
  return {svg:out,phase:s.mark?(s.sp==='chimp'?'Touching a mark that can be seen only in the mirror is the evidence: the animal takes the reflection to be of its own body.':'Gallup’s macaques did not touch the marks. Failing shows that the animal did not use the mirror in this way. It does not show that the animal lacks a sense of self.'):'Social responses fade for both animals as the image fails to behave like a stranger. Only the chimpanzees replace them with self-inspection.'};
 }});

const K5_MARKQ={title:'Score the behaviour against Gallup’s rule',q:'Does it count as a pass?',opts:['Pass','Not a pass','Contested'],items:[
 {t:'A chimpanzee, marked on the brow while anaesthetised, looks in the mirror, touches the mark on her own brow, then looks at her fingers.',a:0,why:'She uses the mirror to find a mark on her own body that she cannot see without it. That is the rule.'},
 {t:'A macaque, marked the same way, threatens the mirror and reaches behind it.',a:1,why:'He treats the image as another animal. Social responses to a mirror are common and do not count.'},
 {t:'A one-year-old with rouge on her nose smiles at the mirror and pats the red spot on the glass.',a:1,why:'She touches the image, not her own nose. Touching the nose itself appears at about 18 to 24 months (Amsterdam 1972).'},
 {t:'An animal rubs its marked spot as often with the mirror covered as with it uncovered.',a:1,why:'The mirror made no difference, so the animal may feel or smell the mark. The control exists to catch this.'},
 {t:'An elephant at a mirror touches a white cross painted on her head with her trunk, many times, and ignores a colourless sham mark.',a:0,why:'The sham mark rules out feel and smell. Happy passed this way (Plotnik et al. 2006); two other elephants did not.'},
 {t:'A cleaner wrasse with a brown mark on its throat, visible only in a mirror, scrapes its throat on the bottom. With a clear mark it does not.',a:2,why:'It meets the written rule (Kohda et al. 2019). Scraping is also how these fish respond to parasites, so its meaning is disputed.'}]};
SCENE({id:'mirror-self-recognition-scoring',name:'Scoring the test',tag:'Apply the rule to six cases',
 definition:'To pass the mark test an animal must touch or inspect a mark on its own body that it can see only in the mirror, and must do so more with the mirror than without it. A sham mark that feels the same but cannot be seen, or a period with no mirror, checks that the animal is not simply feeling the mark.',
 example:'Touching the mirror, threatening the image or looking behind the glass do not count. Nor does rubbing a mark that the animal rubs just as much with no mirror.',
 desc:'Six described behaviours shown one at a time; for each the learner chooses pass, not a pass or contested under the mark test’s scoring rule, and the reasoning is shown.',
 research:['Gallup, G. G. Jr (1970). Science 167, 86–87.','Amsterdam, B. (1972). Mirror self-image reactions before age two. Developmental Psychobiology 5, 297–305.','Plotnik, J. M., de Waal, F. B. M. & Reiss, D. (2006). Self-recognition in an Asian elephant. PNAS 103, 17053–17057.','Kohda, M. et al. (2019). If a fish can pass the mark test, what are the implications for consciousness and self-awareness testing in animals? PLoS Biology 17, e3000021. Contested.'],
 dur:18,hint:'Read each case and score it against the rule, then press Next.',
 init:()=>({i:0,ans:[null,null,null,null,null,null]}),watch:K5_quizWatch(K5_MARKQ),ui:K5_quizUi,on:K5_quizOn,
 draw(s,f,X){return {svg:K5_quiz(X,s,K5_MARKQ),phase:K5_quizPhase(s,K5_MARKQ)}}});

const K5_SPECIES=[
 ['Chimpanzee','Gallup (1970)','Marked chimpanzees touched the marks when given a mirror. Other great apes pass too, gorillas less reliably, and not every chimpanzee does.','Well supported'],
 ['Dolphin','Reiss & Marino (2001)','Two bottlenose dolphins twisted and turned at a mirror to view marks on their bodies. With no hands they cannot touch a mark, so the scoring had to be adapted.','Two animals'],
 ['Elephant','Plotnik, de Waal & Reiss (2006)','One Asian elephant of three tested touched a visible mark on her head and ignored a sham mark.','One animal'],
 ['Magpie','Prior, Schwarz & Güntürkün (2008)','Two of five magpies tried to remove a coloured mark from their throat feathers at a mirror. A replication by Soler and colleagues (2020) found no evidence of it.','Replication failed'],
 ['Cleaner wrasse','Kohda et al. (2019)','Marked fish scraped their throats after seeing the mark in a mirror. Critics doubt that scraping shows self-recognition.','Contested'],
 ['Dog','Horowitz (2017)','Dogs do not pass the mirror test. They do sniff their own scent for longer when it has been altered, so a test built on sight may not suit them.','Fails; test may not fit'],
 ['Child','Amsterdam (1972)','Children touch a spot of rouge on their own nose from about 18 to 24 months of age.','Well supported']];
SCENE({id:'mirror-self-recognition-limits',name:'Who passes, and what it shows',tag:'A test of mirror use, not of consciousness',
 definition:'The mark test has been tried on many species. Passing shows that an animal can use a mirror to learn about its own body. It does not show that the animal has experiences, and failing does not show that it has none. The test favours animals that rely on sight and that groom or touch their own bodies.',
 example:'Dogs fail the mirror test, yet treat their own altered scent as worth a longer sniff. Gorillas, which avoid staring at faces, pass less often than other great apes.',
 desc:'A row of seven animals to choose from. A card gives the study, what was found and how well supported the claim is, above a fixed reminder of what passing does and does not show.',
 research:['Reiss, D. & Marino, L. (2001). Mirror self-recognition in the bottlenose dolphin. PNAS 98, 5937–5942.','Prior, H., Schwarz, A. & Güntürkün, O. (2008). Mirror-induced behavior in the magpie (Pica pica). PLoS Biology 6, e202. Soler, M. et al. (2020). Journal of Comparative Psychology 134, 363–371: replication failed.','Kohda, M. et al. (2019). PLoS Biology 17, e3000021. Contested.','Horowitz, A. (2017). Smelling themselves: dogs investigate their own odours longer when modified in an “olfactory mirror” test. Behavioural Processes 143, 17–24.'],
 dur:16,hint:'Press an animal to see what was found and how far the claim is supported.',
 init:()=>({sp:0}),
 watch(p){return {sp:Math.min(6,Math.floor(p*7))}},
 ui:[{b:'Next animal',act:'nx'}],
 on:{sp(s,v){s.sp=Number(v);return 'keep'},nx(s){s.sp=(s.sp+1)%7;return 'keep'}},
 draw(s,f,X){
  const sp=K5_SPECIES[s.sp];let out=heading('Mirror mark test: '+sp[0].toLowerCase());
  K5_SPECIES.forEach((q,i)=>{const row=i<4?0:1,col=i<4?i:i-4,x=row?36+col*180:16+col*144;out+=K5_chip(X,'sp',i,q[0],x,46+row*46,row?168:136,38,i===s.sp?'on':'off',`Show ${q[0]}`)});
  const tone=/Well/.test(sp[3])?[C.greenp,C.green]:/Contested|failed|Fails/.test(sp[3])?[C.coralp,C.coral]:[C.amberp,C.amber];
  out+=R(30,144,540,150,'#fff',C.grid,10)+TB(48,170,sp[1],14,C.ink,'start')+K5_wrapT(48,196,sp[2],56,13,C.ink,'start');
  out+=R(360,150,200,26,tone[0],'none',6)+TBF(460,168,sp[3],13,tone[1]);
  out+=T(300,326,'Passing shows mirror self-recognition, not experience.',14,C.ink)+T(300,352,'Failing does not show that experience is absent.',14,C.ink);
  return {svg:out,phase:`${sp[0]}: ${sp[2]} Status: ${sp[3].toLowerCase()}. The mirror test is often described as a test of consciousness; that is an overstatement.`};
 }});

/* =========================== interoception =========================== */
const K5_EMO={common:{name:'Common sense',chain:['You meet a bear','You feel afraid','Heart pounds, you run'],note:'The feeling comes first and causes the bodily change.'},
 james:{name:'James and Lange',chain:['You meet a bear','Heart pounds, you run','You feel afraid'],note:'The feeling is the perception of the bodily change as it happens.'},
 cannon:{name:'Cannon’s objection',chain:['You meet a bear','You feel afraid','Heart pounds, you run'],note:'Cannon (1927): the organs respond too slowly and too alike across emotions to be the source of each feeling.'}};
SCENE({id:'interoception',name:'Feeling from the body',tag:'James and Lange turn emotion round',
 definition:'Interoception is the sensing of the body’s internal state: heartbeat, breathing, hunger, temperature. William James (1884) and, independently, Carl Lange argued that an emotion is the feeling of bodily changes as they occur. Take the pounding heart and tense muscles away, James said, and nothing of the emotion would be left but a cold judgement.',
 example:'James wrote that we feel sorry because we cry, angry because we strike and afraid because we tremble, and not the other way round. Walter Cannon (1927) objected that the inner organs respond slowly and in much the same way in different emotions.',
 desc:'Three boxes, a bear, a feeling of fear and a bodily response, joined by arrows whose order changes with the chosen view: common sense, James and Lange, or Cannon’s parallel arrangement.',
 research:['James, W. (1884). What is an emotion? Mind 9, 188–205.','Cannon, W. B. (1927). The James–Lange theory of emotions: a critical examination and an alternative theory. American Journal of Psychology 39, 106–124.','Craig, A. D. (2002). How do you feel? Interoception: the sense of the physiological condition of the body. Nature Reviews Neuroscience 3, 655–666. The strict James–Lange order is contested; that bodily signals contribute to feeling is widely accepted.'],
 dur:12,hint:'Switch between the three views and watch the order of the arrows change.',
 init:()=>({v:'common'}),
 watch(p){return {v:p<.33?'common':p<.7?'james':'cannon'}},
 ui:[{choose:[['common','Common sense'],['james','James and Lange'],['cannon','Cannon']],label:'View',get:s=>s.v,act:'v'}],
 on:{v(s,x){s.v=x;return 'keep'}},
 draw(s){
  const e=K5_EMO[s.v];let out=heading(e.name+': what comes first?');
  const bx=(x,y,t,fill,ink)=>R(x,y,170,60,fill,ink,10)+K5_wrapT(x+85,y+(t.length>16?28:36),t,16,14,C.ink);
  if(s.v==='cannon'){
   out+=bx(30,150,e.chain[0],'#fff',C.line)+box(240,155,110,50,'Brain',C.pale,C.ink,16)+bx(400,80,'You feel afraid',C.purplep,C.purple)+bx(400,220,'Heart pounds, you run',C.coralp,C.coral);
   out+=arrow(200,180,238,180,C.ink,2.5)+arrow(350,170,398,124,C.ink,2.5)+arrow(350,190,398,238,C.ink,2.5)+TF(485,186,'at the same time',13,C.muted);
  }else{
   const fear=s.v==='common'?1:2;
   e.chain.forEach((t,i)=>{const x=20+i*195;out+=bx(x,150,t,i===0?'#fff':i===fear?C.purplep:C.coralp,i===0?C.line:i===fear?C.purple:C.coral);if(i<2)out+=arrow(x+172,180,x+193,180,C.ink,2.5)});
   out+=TF(105,232,'1',13,C.muted)+TF(300,232,'2',13,C.muted)+TF(495,232,'3',13,C.muted);
  }
  out+=K5_wrapT(300,312,e.note,52,14,C.ink);
  return {svg:out,phase:s.v==='common'?'On the everyday view the feeling causes the body’s response. James and Lange reversed the last two steps.':s.v==='james'?'For James the bodily change follows the perception directly, and feeling that change is the emotion. Sensing the body’s inner state is therefore central to feeling anything.':'Cannon proposed that the brain produces the feeling and the bodily response together. Later theories keep a part for bodily signals without making them the whole of an emotion.'};
 }});

const K5_HB=25000;   // counting interval, ms
const K5_hbScore=(felt,wrist)=>wrist>0?Math.max(0,1-Math.abs(wrist-felt)/wrist):0;
SCENE({id:'interoception-heartbeat',name:'Counting your heartbeat',tag:'You take part: a weak but famous measure',
 definition:'In the heartbeat counting task (Schandry 1981) a person silently counts the heartbeats they feel during a timed interval, without touching a pulse. The count is compared with the number recorded. The score is 1 minus the size of the error as a share of the recorded beats, so 1 is perfect.',
 example:'If 30 beats are recorded and 22 are counted, the score is 1 − 8/30 = 0.73. Group averages in published studies are typically around 0.6 to 0.7, and most people count too few.',
 desc:'A progress bar for a 25 second counting interval, two bars for beats counted by feel and beats counted at the wrist, and a score from 0 to 1 beside the range of typical published group averages.',
 research:['Schandry, R. (1981). Heart beat perception and emotional experience. Psychophysiology 18, 483–488.','Zamariola, G., Maurage, P., Luminet, O. & Corneille, O. (2018). Interoceptive accuracy scores from the heartbeat counting task are problematic: evidence from simple bivariate correlations. Biological Psychology 137, 12–17. Weak measure: scores are inflated by guessing from a known heart rate.'],
 dur:12,hint:'Sit still. Press Count by feel and count the heartbeats you feel for 25 seconds without touching your pulse; a soft tone marks the start and end. Enter the number. Then find your pulse at the wrist, press Count at the wrist and enter that count. Nothing leaves this page, and this is not a health check.',
 init:()=>({phase:'idle',which:'',t0:0,el:0,felt:20,wrist:30,did:{felt:0,wrist:0},scored:0,sim:false}),
 watch(p){const run=p<.4?'felt':p>=.5&&p<.9?'wrist':'';return {phase:run?'run':'idle',which:run,el:run==='felt'?p/.4*K5_HB:run==='wrist'?(p-.5)/.4*K5_HB:0,felt:22,wrist:30,did:{felt:p>=.4?1:0,wrist:p>=.9?1:0},scored:p>=.9?1:0,sim:true}},
 ui:[{b:'Count by feel',act:'go',arg:'felt'},{range:'felt',label:'Beats felt',min:0,max:60,step:1,get:s=>s.felt,act:'felt'},{b:'Count at the wrist',act:'go',arg:'wrist'},{range:'wrist',label:'Beats at the wrist',min:10,max:60,step:1,get:s=>s.wrist,act:'wrist'},{b:'Score',act:'score'}],
 on:{
  go(s,w,ctx){if(s.phase==='run'&&performance.now()-s.t0-s.el<1500)return 'keep';s.phase='run';s.which=w;s.t0=performance.now();s.el=0;s.scored=0;AUDIO.tone(660,{dur:.15,gain:.1});ctx.every(250,'tick');return 'keep'},
  tick(s){if(s.phase!=='run')return 'stop';s.el=performance.now()-s.t0;if(s.el>=K5_HB){s.el=K5_HB;s.phase='idle';s.did[s.which]=1;AUDIO.tone(440,{dur:.3,gain:.1});return 'stop'}return 'keep'},
  felt(s,v){s.felt=Number(v);return 'keep'},wrist(s,v){s.wrist=Number(v);return 'keep'},
  score(s){if(s.phase!=='run')s.scored=1;return 'keep'}},
 draw(s){
  const sc=K5_hbScore(s.felt,s.wrist),run=s.phase==='run';
  let out=heading(s.sim?'Simulated participant: counting heartbeats':'Count by feel, then count at the wrist');
  out+=R(40,52,520,70,'#fff',C.grid,10);
  out+=TB(300,76,run?(s.which==='felt'?'Counting by feel: do not touch your pulse':'Counting at the wrist'):s.did.felt&&!s.did.wrist?'Enter the beats you felt, then count at the wrist':s.did.wrist?'Enter the wrist count, then press Score':'Press Count by feel to begin',14,C.ink);
  out+=R(70,92,420,14,'#eef2f5','none',7)+R(70,92,420*clamp(s.el/K5_HB,0,1),14,run?C.blue:C.line,'none',7)+TF(500,104,'25 s',13,C.muted,'start');
  const b=250,k=3;out+=L(60,b,290,b,C.line,2);
  out+=R(90,b-s.felt*k,60,s.felt*k,C.purple,'none',4)+TBF(120,b-s.felt*k-6,String(s.felt),14,C.purple)+TF(120,b+18,'by feel',13,C.muted);
  out+=R(200,b-s.wrist*k,60,s.wrist*k,C.coral,'none',4)+TBF(230,b-s.wrist*k-6,String(s.wrist),14,C.coral)+TF(230,b+18,'at the wrist',13,C.muted);
  // Score meter.
  const mx=330,mw=230,my=190;out+=TBF(mx,150,'Score: 1 − |wrist − felt| / wrist',13,C.ink,'start');
  out+=R(mx,my,mw,18,'#eef2f5','none',5)+R(mx+mw*.6,my-5,mw*.1,28,C.amberp,C.amber,4)+TF(mx+mw*.65,my+42,'typical group',13,C.amber)+TF(mx+mw*.65,my+58,'average 0.6–0.7',13,C.amber);
  out+=TF(mx,my+34,'0',13,C.muted)+TF(mx+mw,my+34,'1',13,C.muted);
  if(s.scored)out+=L(mx+mw*sc,my-10,mx+mw*sc,my+28,C.blue,4)+TBF(clamp(mx+mw*sc,mx+20,mx+mw-20),my-16,sc.toFixed(2),15,C.blue);
  out+=T(300,308,s.scored?`1 − ${Math.abs(s.wrist-s.felt)}/${s.wrist} = ${sc.toFixed(2)}; wrist count gives about ${Math.round(s.wrist*2.4)} beats a minute`:'The score appears when you press Score.',14,s.scored?C.ink:C.muted);
  out+=K5_wrap(300,336,'A weak measure: someone who feels nothing but knows their usual heart rate can score well. The next scene shows how.',76,13,C.coral);
  return {svg:out,phase:s.scored?`${s.sim?'The simulated participant':'You'} counted ${s.felt} by feel and ${s.wrist} at the wrist, a score of ${sc.toFixed(2)}. Counting too few is the usual result. The score mixes real sensing with estimating from time and a known heart rate, so it says little on its own about how well anyone senses their heart, and nothing about health.`:'Counting by feel is harder than it sounds, and many people feel nothing clear. That is normal. Two timed counts take under a minute.'};
 }});

SCENE({id:'interoception-guessing',name:'Why the count is a weak measure',tag:'A toy: scoring well while feeling nothing',
 definition:'The counting score cannot tell sensing from estimating. A person who feels no heartbeats but believes their heart beats about 70 times a minute can count at that pace and score highly. Sarah Garfinkel and colleagues (2015) separated three things the word interoception had covered: accuracy on a task, self-rated sensitivity, and awareness, meaning whether confidence tracks accuracy.',
 example:'Recorded rate 72 a minute, believed rate 70: the guesser’s score is 1 − 2/72 = 0.97. A person who truly feels 60% of their beats, and counts only those, scores 0.60. When people are told to count only beats they actually feel, scores drop (Desmedt, Luminet & Corneille 2018).',
 desc:'Bars for the beats recorded in 25 seconds, the count of a simulated guesser who feels nothing and counts at a believed rate, and the count of a simulated person who feels a set share of beats, with each one’s score. Labelled as a toy.',
 research:['Zamariola, G., Maurage, P., Luminet, O. & Corneille, O. (2018). Biological Psychology 137, 12–17.','Desmedt, O., Luminet, O. & Corneille, O. (2018). The heartbeat counting task largely involves non-interoceptive processes: evidence from both the original and an adapted counting task. Biological Psychology 138, 185–188.','Garfinkel, S. N., Seth, A. K., Barrett, A. B., Suzuki, K. & Critchley, H. D. (2015). Knowing your own heart: distinguishing interoceptive accuracy from interoceptive awareness. Biological Psychology 104, 65–74.'],
 dur:10,hint:'Set the true heart rate, the rate the guesser believes, and the share of beats the other person feels. Compare the two scores.',
 init:()=>({hr:72,bel:70,sense:60}),
 watch(p){return {hr:72,bel:Math.round(lerp(50,90,smooth(p))),sense:60}},
 ui:[{range:'hr',label:'True heart rate',min:50,max:100,step:1,get:s=>s.hr,act:'hr',show:v=>v+' a minute'},{range:'bel',label:'Rate the guesser believes',min:50,max:100,step:1,get:s=>s.bel,act:'bel',show:v=>v+' a minute'},{range:'sense',label:'Share of beats the feeler feels',min:0,max:100,step:5,get:s=>s.sense,act:'sense',show:v=>v+'%'}],
 on:{hr(s,v){s.hr=Number(v);return 'keep'},bel(s,v){s.bel=Number(v);return 'keep'},sense(s,v){s.sense=Number(v);return 'keep'}},
 draw(s){
  const rec=s.hr*25/60,g=s.bel*25/60,fe=rec*s.sense/100,sg=K5_hbScore(g,rec),sf=K5_hbScore(fe,rec);
  let out=heading('Two simulated people, 25 seconds of counting');
  out+=R(486,44,98,22,C.amberp,'none',5)+TBF(535,60,'TOY MODEL',13,C.amber);
  const b=260,k=4.2,bar=(x,v,col,l1,l2,sc)=>R(x,b-v*k,90,v*k,col,'none',5)+TBF(x+45,b-v*k-7,v.toFixed(1),14,col)+TB(x+45,b+22,l1,14,C.ink)+TF(x+45,b+40,l2,13,C.muted)+(sc===null?'':TBF(x+45,b+60,'score '+sc.toFixed(2),14,col));
  out+=L(60,b,540,b,C.line,2)+bar(90,rec,C.muted,'Recorded','actual beats',null)+bar(255,g,C.coral,'Guesser','feels nothing',sg)+bar(420,fe,C.green,'Feeler',`feels ${s.sense}%`,sf);
  out+=T(300,350,sg>sf?'The guesser outscores the person who actually feels beats.':'Here the feeler scores at least as well as the guesser.',15,sg>sf?C.coral:C.green);
  return {svg:out,phase:`At ${s.hr} beats a minute, ${rec.toFixed(1)} beats are recorded in 25 seconds. The guesser counts at ${s.bel} a minute and reports ${g.toFixed(1)}: score 1 − |${s.hr} − ${s.bel}|/${s.hr} = ${sg.toFixed(2)}. The feeler reports ${fe.toFixed(1)}: score ${sf.toFixed(2)}. The score alone cannot say which kind of person produced it, which is why heartbeat counting is a weak measure of interoception.`};
 }});

SCENE({id:'interoception-beast',name:'The beast machine view',tag:'One view: the self as the brain’s model of the body',
 definition:'Anil Seth (2013; Being You, 2021) proposes that the most basic sense of being a self comes from the brain predicting and regulating the body’s internal state. On this “beast machine” view, emotion and the feeling of being embodied are the brain’s best guesses about the causes of signals from the heart, gut and lungs. It is one view among several.',
 example:'It predicts that linking what is seen to the heartbeat should change ownership. Suzuki and colleagues (2013) showed people a virtual hand that pulsed in colour either in time with their own heartbeat or out of time, and reported stronger ownership when it was in time.',
 desc:'A time line of heartbeats above a time line of colour pulses on a virtual hand, either aligned or misaligned, with bars for the ownership reported in each case, and three lines giving the claim, a prediction and what counts against it. Bar sizes are illustrative.',
 research:['Seth, A. K. (2013). Interoceptive inference, emotion, and the embodied self. Trends in Cognitive Sciences 17, 565–573. Seth, A. (2021). Being You. Faber & Faber.','Suzuki, K., Garfinkel, S. N., Critchley, H. D. & Seth, A. K. (2013). Multisensory integration across exteroceptive and interoceptive domains modulates self-experience in the rubber-hand illusion. Neuropsychologia 51, 2909–2917. Small study.','Critchley, H. D., Wiens, S., Rotshtein, P., Öhman, A. & Dolan, R. J. (2004). Neural systems supporting interoceptive awareness. Nature Neuroscience 7, 189–195: heartbeat detection related to activity and grey matter in the right anterior insula.'],
 dur:10,hint:'Switch the hand’s colour pulse between in time and out of time with the heartbeat.',
 init:()=>({sync:1}),
 watch(p){return {sync:p<.5?1:0}},
 ui:[{choose:[[1,'In time with the heart'],[0,'Out of time']],label:'Colour pulse',get:s=>s.sync,act:'sync'}],
 on:{sync(s,v){s.sync=Number(v);return 'keep'}},
 draw(s){
  let out=heading('A virtual hand that pulses with the heartbeat');
  const X=t=>110+t*56;out+=TF(100,84,'heartbeat',13,C.coral,'end')+TF(100,124,'hand pulse',13,C.purple,'end')+L(110,96,390,96,C.line,1.5)+L(110,136,390,136,C.line,1.5);
  for(let k=0;k<6;k++){const t=.2+k*.9;if(t<5)out+=L(X(t),74,X(t),96,C.coral,4);const u=s.sync?t:.55+k*1.15;if(u<5)out+=R(X(u)-4,114,22,22,C.purple,'none',5)}
  [0,1,2,3,4,5].forEach(t=>{out+=TF(X(t),156,t+' s',13,C.muted)});
  out+=R(420,50,160,150,'#fff',C.grid,10)+TBF(500,70,'Ownership reported',13,C.ink)+TF(500,86,'(illustrative)',13,C.muted)+L(440,176,560,176,C.line,2);
  out+=R(452,176-70,40,70,s.sync?C.green:'#cfe3dd','none',4)+R(508,176-34,40,34,s.sync?'#e3d3ce':C.coral,'none',4)+TF(472,192,'in time',13,C.muted)+TF(528,192,'out',13,C.muted);
  out+=T(212,200,s.sync?'In time: stronger ownership of the hand':'Out of time: weaker ownership',14,s.sync?C.green:C.coral);
  [['Claim','the basic feeling of self rests on predictions about the body’s inner state.',C.ink],['Predicts','coupling a seen hand to the heartbeat should strengthen ownership.',C.green],['Against','small studies and weak heartbeat measures; and it is not yet an account of why any of this is felt.',C.coral]].forEach(([h,t,col],i)=>{const y=236+i*46;out+=TBF(40,y,h,13,col,'start')+K5_wrap(118,y,t,66,13,C.ink,'start',17)});
  return {svg:out,phase:s.sync?'When the pulse follows the heartbeat, a signal from inside the body and a signal from the eyes agree, and ownership of the virtual hand was reported as stronger. Supporters read this as the self being built from inner as well as outer signals.':'Out of time, the two signals disagree and the effect is smaller. The studies are small and depend on measures of heartbeat sensing that are themselves weak, so the support is modest. Other theories of the self and of consciousness do not give the body this central place.'};
 }});

/* =========================== self-over-time =========================== */
const K5_LINKS=[['a','1','the officer remembers the flogging'],['b','2','the general remembers taking the standard'],['c','3','the general remembers the flogging']];
SCENE({id:'self-over-time',name:'Memory and identity',tag:'Locke’s criterion and the brave officer',
 definition:'John Locke (1694) held that a person now is the same person as someone in the past just in case they can remember that earlier person’s experience from the inside. Joseph Butler (1736) objected that this is circular: to remember doing something already assumes it was you who did it. Thomas Reid (1785) added the case of the brave officer.',
 example:'A boy is flogged for robbing an orchard. As a young officer he takes an enemy standard, and remembers the flogging. As an old general he remembers taking the standard but has forgotten the flogging. By Locke’s rule the general is the officer, the officer is the boy, yet the general is not the boy.',
 desc:'Three figures, a boy, a young officer and an old general, with three memory links that can be switched on and off, and a table of which pairs count as the same person under Locke’s rule and under a chain-of-memories rule.',
 research:['Locke, J. (1694). An Essay Concerning Human Understanding, 2nd edition, Book II, chapter 27.','Butler, J. (1736). Of personal identity, in The Analogy of Religion. Reid, T. (1785). Essays on the Intellectual Powers of Man, Essay III. The fuller treatment is in Philosophy In Motion.'],
 dur:12,hint:'Press the three memory links to switch them on and off, and see when Locke’s rule contradicts itself.',
 init:()=>({a:1,b:1,c:0}),
 watch(p){return p<.3?{a:1,b:1,c:1}:p<.75?{a:1,b:1,c:0}:{a:1,b:0,c:0}},
 ui:[{b:'Reid’s case',act:'reid'}],
 on:{tog(s,k){s[k]=s[k]?0:1;return 'keep'},reid(s){s.a=1;s.b=1;s.c=0;return 'keep'}},
 draw(s,f,X){
  let out=heading('Who is the same person as whom?');
  const xs=[110,300,490],g=176,names=['Boy','Young officer','Old general'],subs=['flogged at school','takes the standard','in later life'];
  out+=L(40,g,560,g,C.line,2);xs.forEach((x,i)=>{out+=K5_fig(x,g,C.ink)+TB(x,g+20,names[i],14,C.ink)+TF(x,g+38,subs[i],13,C.muted)});
  const arc=(x1,x2,top,on,lab)=>P(`M${x1} ${g-76} Q${(x1+x2)/2} ${top} ${x2} ${g-76}`,on?C.purple:'#d3dae0',on?2.6:1.6,'none',on?'':'stroke-dasharray="5 5"')+Ci((x1+x2)/2,(g-76+top)/2+ (top<40?-2:0),11,on?C.purple:'#fff',on?C.purple:C.line)+TBF((x1+x2)/2,(g-76+top)/2+(top<40?3:5),lab,13,on?'#fff':C.muted);
  out+=arc(300,110,84,s.a,'1')+arc(490,300,84,s.b,'2')+arc(490,110,14,s.c,'3');
  K5_LINKS.forEach(([k,n,what],i)=>{const on=!!s[k],x=30+i*184;out+=K5_chip(X,'tog',k,`Memory ${n}: ${on?'yes':'no'}`,x,224,172,36,on?'on':'off',`Memory ${n}: ${what}. Now ${on?'yes':'no'}. Press to switch.`)+K5_wrap(x+86,276,what,25,13,C.muted,'middle',16)});
  const yn=v=>v?'yes':'no',bad=s.a&&s.b&&!s.c,chain=s.a&&s.b||s.c;
  out+=TF(300,326,`Locke’s rule: general = officer ${yn(s.b)} · officer = boy ${yn(s.a)} · general = boy ${yn(s.c)}`,13,C.ink);
  out+=T(300,350,bad?'Contradiction: if A is B and B is C, then A is C.':'No contradiction with these links.',15,bad?C.coral:C.green);
  out+=TF(300,372,`Chain-of-memories repair: general = boy ${yn(chain)}`,13,C.muted);
  return {svg:out,phase:bad?'This is Reid’s case. Being the same person must carry across: the general cannot be the officer, and the officer the boy, unless the general is the boy. Locke’s rule says otherwise, so the rule as stated fails.':chain?'With these links the rule gives consistent answers. Later writers repaired Locke by counting overlapping chains of memory, so that the general is the boy through the officer. Butler’s objection remains: what makes a memory really yours?':'With no chain of memory between them, both rules say the general is not the boy, however continuous his body has been.'};
 }});

const K5_PATIENTS=[
 {name:'H.M. (Henry Molaison, 1926–2008)',bio:'In 1953 an operation for epilepsy removed tissue deep in both temporal lobes. Brenda Milner studied him for decades.',
  rows:[['lost','forgot meetings within minutes'],['partly','early life recalled, mostly as facts'],['kept','what he had learned before 1953'],['kept','mirror drawing improved']],
  self:'He knew who he was and where he had grown up, and remained recognisably the same gentle person, while unable to say what he had done that morning.'},
 {name:'Clive Wearing (born 1938)',bio:'A musician and conductor. In 1985 a viral infection of the brain damaged both temporal lobes and more.',
  rows:[['lost','gone within seconds'],['lost','very little from before 1985'],['partly','speaks and reads; some loss'],['kept','plays the piano and conducts']],
  self:'He knows he is a musician and greets his wife Deborah with joy every time. In his diary he wrote, over and over, that he had just woken for the first time.'},
 {name:'K.C. (1951–2014)',bio:'A motorcycle accident in 1981 damaged his temporal lobes and other regions. Endel Tulving studied him for many years.',
  rows:[['lost','no new events retained'],['lost','not one event from any time'],['kept','including facts about his own life'],['kept','he could still play chess']],
  self:'He could describe his own character, and his description agreed with his mother’s. He knew what kind of person he was without recalling anything he had done.'}];
const K5_CAPS=['Remembering new events','Reliving past events','Facts and language','Skills'];
SCENE({id:'self-over-time-amnesia',name:'Selves without memories',tag:'Three people with profound amnesia',
 definition:'If memory of one’s past made a person who they are, losing it should dissolve the self. Three closely studied people suggest otherwise. Each lost the ability to form or relive memories of events (episodic memory) and each remained a particular person with a character, skills and attachments.',
 example:'K.C. could not recall a single event from his life, yet rated his own personality in a way that matched his mother’s rating of him. Clive Wearing, whose memory lasts seconds, still plays the piano and knows his wife.',
 desc:'A card for one of three people with amnesia, with four capacities each marked kept, partly kept or lost, and a short note on what remained of the sense of self.',
 research:['Scoville, W. B. & Milner, B. (1957). Loss of recent memory after bilateral hippocampal lesions. Journal of Neurology, Neurosurgery and Psychiatry 20, 11–21.','Wilson, B. A., Baddeley, A. D. & Kapur, N. (1995). Dense amnesia in a professional musician following herpes simplex virus encephalitis. Journal of Clinical and Experimental Neuropsychology 17, 668–681. Wearing, D. (2005). Forever Today. Doubleday.','Rosenbaum, R. S. et al. (2005). The case of K.C.: contributions of a memory-impaired person to memory theory. Neuropsychologia 43, 989–1021. Tulving, E. (1993) on K.C.’s knowledge of his own traits. Single cases, each studied in depth.'],
 dur:14,hint:'Choose a person and compare what was lost with what remained.',
 init:()=>({p:0}),
 watch(p){return {p:Math.min(2,Math.floor(p*3))}},
 ui:[{choose:[[0,'H.M.'],[1,'Clive Wearing'],[2,'K.C.']],label:'Person',get:s=>s.p,act:'p'}],
 on:{p(s,v){s.p=Number(v);return 'keep'}},
 draw(s){
  const pt=K5_PATIENTS[s.p],col={kept:[C.greenp,C.green],partly:[C.amberp,C.amber],lost:[C.coralp,C.coral]};
  let out=heading(pt.name)+K5_wrap(300,54,pt.bio,78,13,C.muted,'middle',17);
  K5_CAPS.forEach((c,i)=>{const y=92+i*40,[st,note]=pt.rows[i];out+=R(30,y,540,34,'#fff',C.grid,8)+TB(42,y+22,c,13,C.ink,'start')+R(262,y+5,70,24,col[st][0],'none',6)+TBF(297,y+22,st,13,col[st][1])+TF(342,y+22,note,13,C.muted,'start')});
  out+=R(30,262,540,110,C.pale,'none',10)+TB(46,284,'What remained of the self',14,C.blue,'start')+K5_wrapT(46,306,pt.self,56,13,C.ink,'start');
  return {svg:out,phase:`${pt.name.split(' (')[0]}: ${pt.self} Cases like these separate remembering one’s life from knowing who one is. They are single people, described here with the respect owed to them, and nothing here is medical advice.`};
 }});

const K5_TQ=['A scanner records you exactly and destroys your body. A copy is built on Mars. Do you survive?','The scanner fails to destroy you, so you and the copy both live. Is the copy you?','You on Earth will die within days; the copy lives on. Is that about as good as surviving?'];
function K5_verdict(q){
 if(q.some(v=>v===null))return ['Answer all three questions.','',C.muted];
 const [a,b,c]=q;
 if(b)return ['Two people cannot both be you','You and the copy are two different people, so you cannot be identical to both. Parfit used this to argue that identity is the wrong thing to care about.',C.coral];
 if(c)return [a?'Closest to Parfit':'Close to Parfit','Being the very same person is not what matters. What matters is that someone continues your memories and character, whatever the cause.',C.purple];
 if(a)return ['Psychological continuity','You go where your memories and character go, but only if there is one continuer. With two, something that matters has been lost.',C.blue];
 return ['Bodily continuity','You are this living body or brain. A copy, however exact, is someone else, and the scanner kills you.',C.green];
}
SCENE({id:'self-over-time-teletransporter',name:'The teletransporter',tag:'Parfit: is identity what matters?',
 definition:'Derek Parfit (1984) asked what we should say about a machine that records a person exactly, destroys the body and builds a perfect copy elsewhere. He argued that there is no deep further fact about whether the copy is “really” you, and that what matters in survival is not identity but psychological continuity: the carrying on of memory, intention and character.',
 example:'In the simple case most people are unsure. In the “branch line” case the original survives for a few days beside the copy; now the copy plainly is not the original, yet Parfit held that the original’s prospects are about as good as ordinary survival. Many philosophers reject that conclusion.',
 desc:'Three yes-or-no questions about teletransporter cases, and a panel naming the view of personal identity that the learner’s answers fit most closely.',
 research:['Parfit, D. (1984). Reasons and Persons, Part III. Oxford University Press.','Against: Williams, B. (1970). The self and the future. Philosophical Review 79, 161–180, for the bodily view. There is no agreed answer; Philosophy In Motion treats the argument at length.'],
 dur:12,hint:'Answer the three questions. The panel names the view your answers fit; there is no right answer.',
 init:()=>({q:[null,null,null]}),
 watch(p){return {q:[p>.2?1:null,p>.45?0:null,p>.7?1:null]}},
 ui:[{b:'Clear answers',act:'clear'}],
 on:{set(s,v){const [i,a]=String(v).split(':').map(Number);s.q[i]=a;return 'keep'},clear(s){s.q=[null,null,null];return 'keep'}},
 draw(s,f,X){
  let out=heading('Three cases, three answers');
  K5_TQ.forEach((t,i)=>{const y=44+i*76;out+=R(20,y,560,70,'#fff',C.grid,10)+TBF(34,y+22,String(i+1),15,C.muted,'start')+K5_wrap(54,y+22,t,52,13,C.ink,'start',18);
   [[1,'Yes'],[0,'No']].forEach(([a,l],j)=>{out+=K5_chip(X,'set',i+':'+a,l,446+j*66,y+16,60,38,s.q[i]===a?'on':'off',`Question ${i+1}: ${l}`)})});
  const v=K5_verdict(s.q);out+=R(20,276,560,98,v[1]?C.pale:'#f6f9fb','none',10)+TB(300,298,v[0],15,v[2]);
  if(v[1])out+=K5_wrap(300,320,v[1],78,13,C.ink,'middle',18);
  return {svg:out,phase:v[1]?`Your answers fit: ${v[0].toLowerCase()}. ${v[1]} A fourth view, that a soul or some further fact settles the matter, says that no physical description can tell us the answer. None of these views is agreed to be right.`:'Each question has defenders on both sides. Answer as you actually think.'};
 }});
