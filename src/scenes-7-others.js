/* =====================================================================
 Consciousness era 7 · Other minds: animals, infants and other people.
 Every being here is one that cannot give a report we can check, so each scene separates what was observed
 from what is inferred. Declarations are shown as opinion, toy models carry a label in the picture, insect
 emotion is marked contested, and nothing about infants is medical or ethical advice. No sound, no timers,
 no flashing: every picture changes only when the learner steps or presses.
 ===================================================================== */

// Break a sentence into lines of at most n characters.
const K7_lines=(s,n)=>{const out=[];let cur='';for(const w of String(s).split(' ')){if(cur&&(cur+' '+w).length>n){out.push(cur);cur=w}else cur=cur?cur+' '+w:w}if(cur)out.push(cur);return out};
// A paragraph of fixed-size text, wrapped at n characters. o: {size,fill,anchor,lh,bold}
const K7_para=(x,y,s,n,o={})=>K7_lines(s,n).map((l,i)=>(o.bold?TBF:TF)(x,y+i*(o.lh||17),l,o.size||13,o.fill||C.ink,o.anchor||'start')).join('');
// A rounded label such as “Toy model” or “Simulated”.
const K7_badge=(x,y,label,col=C.amber,bg=C.amberp)=>{const w=label.length*6.9+18;return R(x,y,w,22,bg,col,11)+TF(x+w/2,y+15.5,label,13,col)};
// A seeded hash for repeatable dot patterns.
const K7_h=(i,seed)=>{let x=(i*2654435761+seed*97+1013904223)>>>0;x^=x>>>13;x=Math.imul(x,1274126177)>>>0;x^=x>>>16;return (x>>>0)/4294967296};
const K7_ell=(x,y,rx,ry,fill,stroke='none',extra='')=>`<ellipse cx="${fmt(x)}" cy="${fmt(y)}" rx="${fmt(rx)}" ry="${fmt(ry)}" fill="${fill}" stroke="${stroke}" stroke-width="2" ${extra}/>`;
const K7_rad=d=>d*Math.PI/180;
// A small bee, facing right. tongue: draws the extended proboscis.
function K7_bee(x,y,s=1,tongue=false){
 let out=K7_ell(x-4*s,y-9*s,9*s,5*s,'#dfeaf2','#abc3d3','opacity=".9"')+K7_ell(x+4*s,y-10*s,8*s,4.5*s,'#dfeaf2','#abc3d3','opacity=".9"');
 out+=K7_ell(x-3*s,y,13*s,8*s,'#e2a81c','#5a4310')+L(x-8*s,y-6.5*s,x-8*s,y+6.5*s,'#5a4310',3*s)+L(x-1*s,y-7.5*s,x-1*s,y+7.5*s,'#5a4310',3*s)+Ci(x+12*s,y,6*s,'#5a4310');
 if(tongue)out+=L(x+17*s,y+2*s,x+26*s,y+9*s,C.coral,2.5*s);
 return out;
}
// A small octopus seen from the side: mantle, eye and a fringe of arms.
function K7_octo(x,y,s=1,col='#b9644e'){
 let out='';for(let i=0;i<5;i++){const ax=x-16*s+i*8*s;out+=P(`M${fmt(ax)} ${fmt(y+6*s)} q${fmt((i-2)*3*s)} ${fmt(10*s)} ${fmt((i-2)*5*s)} ${fmt(17*s)}`,col,3.2*s)}
 return out+K7_ell(x,y-4*s,19*s,15*s,col)+Ci(x+7*s,y-3*s,3.6*s,'#fff')+Ci(x+8*s,y-3*s,1.7*s,C.ink);
}

/* =========================== animal-consciousness =========================== */
const K7_CASES=[
 {who:'Tony the fox terrier',src:'Morgan (1894)',what:'Tony lifts the latch of the garden gate with his head and lets himself out.',
  low:'He once lifted the latch by chance while looking out, got through, and repeated what had worked.',
  high:'He understands how a latch holds a gate shut.',
  test:'Morgan had watched the habit form: a chance lift of the latch, then gradual improvement over repeated attempts.',fits:'low'},
 {who:'Clever Hans the horse',src:'Pfungst (1907)',what:'Hans taps out the answers to sums with his hoof, and is usually right.',
  low:'He taps until the questioner’s posture changes slightly, then stops.',
  high:'He can do arithmetic.',
  test:'Pfungst had questions put by people who did not know the answer, or who stood out of sight. Hans then failed.',fits:'low'},
 {who:'A piping plover',src:'Ristau (1991)',what:'A nesting plover drags one wing as if it were broken, and an intruder follows her away from the eggs.',
  low:'A fixed display, set off by anything that comes near the nest.',
  high:'She is trying to lead this intruder away, and checks whether it is working.',
  test:'Ristau reported that the birds displayed where the intruder could see them, led away from the nest, and changed tack when the intruder did not follow.',fits:'high'}];
SCENE({id:'animal-consciousness',name:'Morgan’s canon and Griffin’s question',tag:'Two rules for reading behaviour',
 definition:'Morgan’s canon (1894) says an action should not be explained by a higher mental faculty if a lower one will do. Donald Griffin, who had helped discover bat echolocation, argued in 1976 that this caution had hardened into a refusal to ask whether animals are aware at all, and that the question could be studied.',
 example:'Morgan’s dog Tony opened the garden gate by lifting the latch. A visitor might say he understood latches. Morgan, who had watched the habit form by chance and repetition, said trial and error was enough. In 1903 Morgan added that a richer reading is allowed when there is independent evidence for it.',
 desc:'Three reported animal behaviours, each with a simpler and a richer reading side by side; after the learner picks one, the test that was run and its outcome are shown, with a tally.',
 research:['Morgan, C. L. (1894). An Introduction to Comparative Psychology. Walter Scott. The canon is a rule of method, not a finding.','Griffin, D. R. (1976). The Question of Animal Awareness. Rockefeller University Press.','Pfungst, O. (1907). Das Pferd des Herrn von Osten (Der Kluge Hans); Ristau, C. A. (1991), on piping plovers, in Cognitive Ethology: The Minds of Other Animals. Erlbaum. The Hans result is robust; how rich the plover’s behaviour is remains argued.'],
 dur:12,hint:'Choose a case, then pick the reading you would start from. The scene shows what the test found.',
 init:()=>({c:0,pick:{}}),
 watch(p){const c=Math.min(2,Math.floor(p*3)),u=p*3-c,pick={};for(let i=0;i<c;i++)pick[i]=K7_CASES[i].fits;if(u>.45)pick[c]='low';return {c,pick,sim:true}},
 ui:[{choose:[[0,'Tony the dog'],[1,'Clever Hans'],[2,'Plover']],label:'Case',get:s=>s.c,act:'c'},{b:'Simpler reading',act:'pick',arg:'low'},{b:'Richer reading',act:'pick',arg:'high'}],
 on:{c(s,v){s.c=Number(v);return 'keep'},pick(s,v){s.pick[s.c]=v;return 'keep'}},
 draw(s,f,X){
  const k=K7_CASES[s.c],pk=s.pick[s.c];let out=heading('Which reading would you start from?');
  out+=R(20,44,560,70,'#fff',C.grid)+TBF(32,64,k.who+' · '+k.src,14,C.ink,'start')+K7_para(32,84,k.what,84);
  if(s.sim)out+=TF(568,64,'simulated learner',13,C.muted,'end');
  const rd=(x,key,title,txt,col,bg)=>hit(X,'pick',key,title+': '+txt,R(x,124,275,92,pk===key?bg:'#fff',col)+TBF(x+12,145,title,14,col,'start')+K7_para(x+12,165,txt,39));
  out+=rd(20,'low','Simpler reading',k.low,C.blue,C.pale)+rd(305,'high','Richer reading',k.high,C.purple,C.purplep);
  out+=R(20,226,560,100,'#f6f9fb',C.grid);
  if(pk){out+=TBF(32,246,'What the test showed',14,C.ink,'start')+K7_para(32,266,k.test,84);
   out+=TBF(32,314,k.fits==='low'?'Here the simpler reading held.':'Here the richer reading fitted better; how much richer is still argued.',13,k.fits==='low'?C.blue:C.purple,'start')}
  else out+=TF(300,272,'Pick a reading above to see what was tested.',14,C.muted)+TF(300,294,'Neither choice is a mistake: they are two starting points.',13,C.muted);
  out+=TF(300,346,'Morgan: prefer the simpler reading unless the evidence demands more.',13,C.blue)+TF(300,366,'Griffin: do not rule the richer reading out before it has been tested.',13,C.purple);
  const done=Object.keys(s.pick).length,lowN=K7_CASES.filter((q,i)=>s.pick[i]&&q.fits==='low').length;
  const ph=!pk?`${k.who}: ${k.what} Start from the simpler or the richer reading.`:`You started from the ${pk==='low'?'simpler':'richer'} reading. ${k.test} ${done===3?`Across the three cases the simpler reading held in ${lowN} and the richer one fitted better in ${3-lowN}: the canon is a sensible default, and it is not always right.`:`Cases tested so far: ${done} of 3.`}`;
  return {svg:out,phase:(s.sim?'Simulated learner. ':'')+ph};
 }});

const K7_ANIMALS=[['Chimpanzee','strong',true],['Crow','strong',true],['Trout','possible',false],['Frog','possible',false],['Octopus','possible',true],['Crab','possible',false],['Honeybee','possible',false],['Jellyfish','none',false]];
const K7_mean=(vals,grp)=>{const v=K7_ANIMALS.map((a,i)=>a[1]===grp?vals[i]:null).filter(x=>x!==null);return Math.round(sum(v)/v.length)};
SCENE({id:'animal-consciousness-declarations',name:'Two declarations',tag:'You take part: place the animals',
 definition:'The Cambridge Declaration on Consciousness (2012) stated that humans are not unique in having the brain substrates that generate consciousness, naming all mammals and birds and other creatures including octopuses. The New York Declaration on Animal Consciousness (2024) speaks of strong scientific support for conscious experience in mammals and birds, and at least a realistic possibility in all vertebrates and many invertebrates.',
 example:'The New York text names reptiles, amphibians and fishes among the vertebrates, and “at minimum” cephalopod molluscs, decapod crustaceans and insects among the invertebrates. It adds that where there is a realistic possibility of experience, it is irresponsible to ignore it in decisions affecting the animal. It gives no probabilities.',
 desc:'Eight animals, each with a slider from “surely not” to “surely so” set by the learner; on request the wording each declaration applies to that animal is shown beside it.',
 research:['Low, P. et al. (2012). The Cambridge Declaration on Consciousness. Signed 7 July 2012 at the Francis Crick Memorial Conference, Cambridge.','Andrews, K., Birch, J., Sebo, J. & Sims, T. (2024). Background to the New York Declaration on Animal Consciousness. Launched 19 April 2024 at New York University.','Both are statements of scientific opinion signed by researchers. They summarise evidence; they are not experiments.'],
 dur:12,hint:'Tap an animal, set how confident you are that it has experiences, then compare with the declarations. Your settings stay on this page.',
 init:()=>({sel:0,v:[50,50,50,50,50,50,50,50],shown:false}),
 watch(p){const goal=[92,88,62,55,74,45,36,12],u=smooth(Math.min(1,p/.6));return {sel:Math.min(7,Math.floor(p/.6*8)),v:goal.map(g=>Math.round(lerp(50,g,u))),shown:p>.66,sim:true}},
 ui:[{range:'v',label:'Your confidence for the chosen animal',min:0,max:100,step:1,get:s=>s.v[s.sel],act:'v',show:v=>v+' of 100'},{b:'Compare with the declarations',act:'show'},{b:'Hide the wording',act:'hide'}],
 on:{sel(s,v){s.sel=Number(v);return 'keep'},v(s,v){s.v[s.sel]=Number(v);return 'keep'},show(s){s.shown=true;return 'keep'},hide(s){s.shown=false;return 'keep'}},
 draw(s,f,X){
  let out=heading(s.sim?'A simulated learner places the animals':'How confident are you that each has experiences?');
  out+=TF(150,56,'surely not',13,C.muted,'start')+TF(380,56,'surely so',13,C.muted,'end')+TF(392,56,'New York 2024',13,C.muted,'start')+TF(546,56,'Cambridge 2012',13,C.muted);
  K7_ANIMALS.forEach((a,i)=>{const y=64+i*31,x=150+s.v[i]*2.3,on=i===s.sel;
   let row=R(16,y,574,28,on?C.pale:'#fff',on?C.blue:'none',6)+(on?TBF:TF)(26,y+19,a[0],13,C.ink,'start')+L(150,y+14,380,y+14,C.line,3)+Ci(x,y+14,7,on?C.blue:C.muted,'#fff');
   if(s.shown){const w=a[1]==='strong'?['strong support',C.green]:a[1]==='possible'?['realistic possibility',C.amber]:['not named',C.muted];row+=TBF(392,y+19,w[0],13,w[1],'start')+TF(546,y+19,a[2]?'named':'—',13,a[2]?C.green:C.muted)}
   else row+=TF(392,y+19,'?',13,C.muted,'start')+TF(546,y+19,'?',13,C.muted);
   out+=hit(X,'sel',i,`${a[0]}: your confidence ${s.v[i]} of 100. Press to choose.`,row)});
  out+=TF(300,336,'The declarations use words, not numbers: the sliders are yours alone.',13,C.muted);
  let ph;
  if(s.shown){const a=K7_mean(s.v,'strong'),b=K7_mean(s.v,'possible'),c=K7_mean(s.v,'none');
   out+=TF(300,358,`${s.sim?'Simulated':'Your'} averages: strong support ${a} · realistic possibility ${b} · not named ${c}`,13,C.ink);
   ph=`${s.sim?'The simulated learner':'You'} put the two “strong scientific support” animals at ${a} of 100 on average, the five “realistic possibility” animals at ${b}, and the jellyfish, which neither text names, at ${c}. ${a>=b?'That ordering matches the declarations’ wording.':'That ordering differs from the declarations’ wording, which is allowed: they state an opinion, not a measurement.'} Neither declaration says how probable experience is in any animal.`}
  else{out+=TF(300,358,'Both are signed statements of opinion about the evidence, not experiments.',13,C.muted);
   ph=`${K7_ANIMALS[s.sel][0]} is set to ${s.v[s.sel]} of 100. Place all eight, then compare with what the two declarations say.`}
  return {svg:out,phase:ph};
 }});

const K7_KINDS=[['opinion','Statement of opinion',C.purple,C.purplep],['rule','Rule of method',C.amber,C.amberp],['experiment','Experiment',C.green,C.greenp]];
const K7_ITEMS=[
 {t:'Cambridge Declaration (2012)',sh:'Cambridge 2012',d:'A group of scientists sign a statement that all mammals and birds, and other animals including octopuses, have the brain substrates that generate consciousness.',k:'opinion',why:'It weighs evidence that already existed and reports no new observation.'},
 {t:'Morgan’s canon (1894)',sh:'Morgan’s canon',d:'Do not explain an action by a higher mental faculty if a lower one will do.',k:'rule',why:'It says how to interpret findings. It is not itself a finding.'},
 {t:'Pfungst and Clever Hans (1907)',sh:'Pfungst 1907',d:'Have the horse questioned by people who do not know the answer, and count how often he is right.',k:'experiment',why:'One condition is changed and the outcome is counted. It could have gone either way.'},
 {t:'New York Declaration (2024)',sh:'New York 2024',d:'Signatories state that there is strong scientific support for conscious experience in mammals and birds, and at least a realistic possibility in all vertebrates and many invertebrates.',k:'opinion',why:'It is a judgement of where the evidence stands, made by people who know it well.'},
 {t:'Crook’s octopuses (2021)',sh:'Crook 2021',d:'Give an octopus a painful injection in one chamber, then measure whether it avoids that chamber later.',k:'experiment',why:'Treated and control animals are compared on a measured behaviour.'},
 {t:'De Waal on “anthropodenial” (1997)',sh:'De Waal 1997',d:'Denying an animal a capacity it has is as much an error as granting it one it lacks.',k:'rule',why:'It is advice about which mistake to guard against, the mirror image of Morgan’s.'}];
SCENE({id:'animal-consciousness-evidence',name:'Opinion, rule or experiment?',tag:'You sort six items',
 definition:'Claims about animal minds rest on three different kinds of thing: experiments, which could have come out otherwise; rules of method, which say how to read results; and statements of opinion, in which experts say where they think the evidence stands. A declaration is the third kind.',
 example:'The New York Declaration was organised by the philosophers Kristin Andrews, Jonathan Birch and Jeff Sebo. Its weight comes from the experiments its signatories had in mind, such as place-avoidance in octopuses, and from their expertise. Signing it added no new data.',
 desc:'Six items shown one at a time, each to be sorted as a statement of opinion, a rule of method or an experiment, with three columns filling as the learner answers.',
 research:['Andrews, K. (2020). How to Study Animal Minds. Cambridge University Press.','de Waal, F. B. M. (1999). Anthropomorphism and anthropodenial: consistency in our thinking about humans and other animals. Philosophical Topics 27, 255–280 (the term dates from a 1997 article).','The six items are those cited in this lesson and the next.'],
 dur:12,hint:'Read the item, then press the kind you think it is. Press Next item to move on.',
 init:()=>({i:0,ans:[null,null,null,null,null,null]}),
 watch(p){const i=Math.min(5,Math.floor(p*6)),u=p*6-i;return {i,ans:K7_ITEMS.map((q,j)=>j<i||(j===i&&u>.5)?q.k:null),sim:true}},
 ui:[{b:'Statement of opinion',act:'pick',arg:'opinion'},{b:'Rule of method',act:'pick',arg:'rule'},{b:'Experiment',act:'pick',arg:'experiment'},{b:'Next item',act:'next'}],
 on:{pick(s,v){s.ans[s.i]=v;return 'keep'},next(s){s.i=(s.i+1)%6;return 'keep'}},
 draw(s,f,X){
  const q=K7_ITEMS[s.i],a=s.ans[s.i],kind=K7_KINDS.find(k=>k[0]===q.k);let out=heading('What kind of thing is this?');
  out+=R(20,44,560,92,'#fff',C.grid)+TBF(32,64,`${s.i+1} of 6 · ${q.t}`,14,C.ink,'start')+K7_para(32,84,q.d,84);
  K7_KINDS.forEach((k,j)=>{const x=20+j*190;out+=hit(X,'pick',k[0],k[1],R(x,146,180,36,a===k[0]?k[3]:'#fff',k[2])+TBF(x+90,169,k[1],13,k[2]))});
  if(a)out+=TBF(300,206,a===q.k?`Yes: ${kind[1].toLowerCase()}.`:`Most would file it as: ${kind[1].toLowerCase()}.`,14,kind[2])+TF(300,226,q.why,13,C.ink);
  else out+=TF(300,214,s.sim?'A simulated learner is deciding.':'Choose one of the three kinds.',13,C.muted);
  K7_KINDS.forEach((k,j)=>{const x=20+j*190;out+=R(x,244,180,90,k[3],'none')+TBF(x+90,264,k[1],13,k[2]);
   K7_ITEMS.filter((it,n)=>it.k===k[0]&&s.ans[n]).forEach((it,m)=>out+=TF(x+90,286+m*20,it.sh,13,C.ink))});
  const n=s.ans.filter(Boolean).length,ok=s.ans.filter((x,j)=>x===K7_ITEMS[j].k).length;
  out+=TF(300,358,`Sorted ${n} of 6${n?` · ${ok} filed as most would file them`:''}`,13,C.muted);
  return {svg:out,phase:a?`${q.t}: ${kind[1].toLowerCase()}. ${q.why}${n===6?' All six are sorted: two opinions, two rules and two experiments. Only the experiments could have surprised anyone.':''}`:`${q.t}. ${q.d}`};
 }});

/* =========================== octopus-minds =========================== */
// [name, drawn split time in Myr, words, row y, note]
const K7_TREE=[
 ['Chimpanzee',6.5,'about 6 to 7',100,'Chimpanzees and bonobos are our closest living relatives.'],
 ['Mouse',90,'about 90',130,'A mouse brain has about 70 million neurons.'],
 ['Crow',320,'about 320',160,'Birds and mammals each evolved large brains after this split, with differently arranged forebrains.'],
 ['Trout',430,'about 430',190,'Still a vertebrate: the same basic brain plan as ours, laid down before this split.'],
 ['Octopus',560,'over 500',240,'About 500 million neurons: more than a mouse (about 70 million), far fewer than a human (about 86 billion). The shared ancestor was probably a small worm-like animal with a simple nervous system.'],
 ['Honeybee',560,'over 500',270,'The same split as the octopus, since molluscs and insects sit on the same great branch. A honeybee brain has about 1 million neurons.']];
const K7_tx=t=>490-t*.7;
SCENE({id:'octopus-minds',name:'A separate road to a large brain',tag:'Our most distant clever cousin',
 definition:'The line leading to octopuses and the line leading to vertebrates separated over 500 million years ago. Their last shared ancestor was probably a small, worm-like animal with a simple nervous system, so the octopus’s large brain and ours evolved independently. Peter Godfrey-Smith calls meeting an octopus the closest we are likely to come to meeting an intelligent alien.',
 example:'A crow’s line left ours about 320 million years ago and a trout’s about 430 million, but all three are vertebrates built on one brain plan. The octopus shares none of that plan: its brain is wrapped around its gullet, and most of its neurons are in its arms.',
 desc:'A family tree on a time axis from 600 million years ago to today, with branches to chimpanzee, mouse, crow, trout, octopus and honeybee; the chosen animal’s path back to its shared ancestor with humans is highlighted.',
 research:['Godfrey-Smith, P. (2016). Other Minds: The Octopus, the Sea, and the Deep Origins of Consciousness. Farrar, Straus and Giroux.','Split dates are molecular-clock estimates and vary between studies, the deepest ones most of all; the tree shows that split as a band, not a point. Neuron counts: Herculano-Houzel and colleagues (2006, 2009) for mouse and human; Young (1963) for the octopus.'],
 dur:12,hint:'Tap an animal to trace its line back to the ancestor it shares with us.',
 init:()=>({a:4}),
 watch(p){return {a:Math.min(5,Math.floor(p*6))}},
 ui:[{choose:K7_TREE.map((t,i)=>[i,t[0]==='Chimpanzee'?'Chimp':t[0]==='Honeybee'?'Bee':t[0]]),label:'Animal',get:s=>s.a,act:'a'}],
 on:{a(s,v){s.a=Number(v);return 'keep'}},
 draw(s,f,X){
  const a=K7_TREE[s.a],x0=K7_tx(0),xr=K7_tx(560);let out=heading('How long ago did its line leave ours?');
  out+=R(K7_tx(600),56,K7_tx(520)-K7_tx(600),238,C.amberp,'none',4)+TF(K7_tx(560)+4,290,'date uncertain',13,C.amber);
  out+=L(x0,70,xr,70,C.line,3)+TBF(x0+8,75,'Human',13,C.ink,'start');
  // The octopus and the bee share one branch from the root, then part inside the uncertain band.
  const xp=K7_tx(535);
  K7_TREE.forEach((t,i)=>{const xs=K7_tx(t[1]),on=i===s.a,col=on?C.coral:C.line,w=on?4:3;
   if(i<4)out+=L(xs,70,xs,t[3],col,w)+L(xs,t[3],x0,t[3],col,w);
   else out+=L(xr,70,xr,255,on?C.coral:C.line,w)+L(xr,255,xp,255,on?C.coral:C.line,w)+L(xp,255,xp,t[3],col,w)+L(xp,t[3],x0,t[3],col,w);
   out+=hit(X,'a',i,`${t[0]}: last shared ancestor with humans ${t[2]} million years ago.`,R(x0+4,t[3]-13,98,26,on?C.coralp:'#fff','none',6)+(on?TBF:TF)(x0+8,t[3]+5,t[0],13,on?C.coral:C.ink,'start'))});
  const xs=s.a<4?K7_tx(a[1]):xr;out+=L(x0,70,xs,70,C.coral,4)+Ci(xs,70,6,C.coral,'#fff');
  out+=L(K7_tx(600),300,x0,300,C.line,2);
  [0,100,200,300,400,500,600].forEach(t=>out+=L(K7_tx(t),300,K7_tx(t),306,C.line,1.5)+TF(K7_tx(t),324,t===0?'today':String(t),13,C.muted));
  out+=TF(280,344,'million years ago',13,C.muted)+TBF(300,368,`Human and ${a[0].toLowerCase()}: last shared ancestor ${a[2]} million years ago`,13,C.coral);
  return {svg:out,phase:`The line to the ${a[0].toLowerCase()} and the line to humans separated ${a[2]} million years ago. ${a[4]}`};
 }});

const K7_ARM={n:8,len:30,bx:95,by:310,rest:-115,curl:45,targets:[-15,-40,-65]};
const K7_curled=base=>[base].concat(range(K7_ARM.n-1).map(()=>K7_ARM.curl));
// Joint positions from relative angles (degrees); rel[0] is the direction of the first segment.
function K7_armPts(rel){let a=0,x=K7_ARM.bx,y=K7_ARM.by;const pts=[[x,y]];for(let i=0;i<K7_ARM.n;i++){a+=rel[i];x+=K7_ARM.len*Math.cos(K7_rad(a));y+=K7_ARM.len*Math.sin(K7_rad(a));pts.push([x,y])}return pts}
const K7_food=t=>{const a=K7_rad(K7_ARM.targets[t]),d=K7_ARM.n*K7_ARM.len;return [K7_ARM.bx+d*Math.cos(a),K7_ARM.by+d*Math.sin(a)]};
// The arm’s own program at step j: joints nearer the base than the travelling bend are already straight.
const K7_localRel=(j,t)=>j===0?K7_curled(K7_ARM.rest):[K7_ARM.targets[t]].concat(range(K7_ARM.n-1).map(i=>i+1<j?0:K7_ARM.curl));
SCENE({id:'octopus-minds-arms',name:'An arm that does part of the work',tag:'You steer: two commands or seventeen',
 definition:'An octopus has about 500 million neurons, and roughly two-thirds of them lie in the nerve cords of its eight arms, not in its head. A reach is made by a bend that travels from the base of the arm to the tip. The pattern is produced by circuits in the arm itself: the brain starts the reach and sets its direction.',
 example:'Sumbre and colleagues (2001) cut the nerve link between an arm and the brain and stimulated the arm’s own nerve cord. The arm still produced a normal-looking reach. Later work showed the brain can also guide a single arm by sight through a maze (Gutnick et al. 2011), so control is shared, not handed over.',
 desc:'A toy octopus arm of eight segments reaching for one of three pieces of food, either by a bend that travels along the arm after two commands, or joint by joint as the learner taps; counters show commands sent by the brain and joints placed by the arm.',
 research:['Gutfreund, Y., Flash, T., Yarom, Y., Fiorito, G., Segev, I. & Hochner, B. (1996). Organization of octopus arm movements. Journal of Neuroscience 16, 7297–7307.','Sumbre, G., Gutfreund, Y., Fiorito, G., Flash, T. & Hochner, B. (2001). Control of octopus arm extension by a peripheral motor program. Science 293, 1845–1848. Robust.','Neuron counts: Young, J. Z. (1963); Hochner, B. (2012). An embodied view of octopus neurobiology. Current Biology 22, R887–R892. The picture is a toy, not a model of muscle.'],
 dur:12,hint:'Tap a piece of food to start a reach. Then choose “Brain steers every joint” and tap the joints yourself.',
 init:()=>({mode:'local',target:1,rel:K7_curled(K7_ARM.rest),cmd:0}),
 trace(s){if(s.mode!=='local')return [{j:-1}];
  return range(K7_ARM.n+1).map(j=>({j,say:j===0?'Toy model. The arm rests curled. In Try it, tap a piece of food: the brain will send two commands, which way and go.':j===1?'Commands 1 and 2: the brain turns the base of the arm towards the food and starts the reach. A bend forms near the base.':j<K7_ARM.n?`The bend travels outward. Joint ${j-1} straightens under the arm’s own nerve cord; the brain sends nothing more.`:'The tip arrives. Two commands came from the brain; the arm’s own circuits placed the other seven joints.'}))},
 ui:[{choose:[['local','Arm’s own program'],['central','Brain steers every joint']],label:'Who controls the joints',get:s=>s.mode,act:'mode'},{b:'Curl the arm again',act:'reset'}],
 on:{mode(s,v){s.mode=v;s.rel=K7_curled(K7_ARM.rest);s.cmd=0},
  reset(s){s.rel=K7_curled(K7_ARM.rest);s.cmd=0},
  target(s,v){s.target=Number(v);s.rel=K7_curled(K7_ARM.rest);s.cmd=0;return s.mode==='local'?'run':undefined},
  joint(s,v){if(s.mode!=='central')return 'keep';const i=Number(v),goal=K7_ARM.targets[s.target];
   if(i===0){if(s.rel[0]<goal){s.rel[0]=Math.min(goal,s.rel[0]+25);s.cmd++}}else if(s.rel[i]>0){s.rel[i]=Math.max(0,s.rel[i]-22.5);s.cmd++}return 'keep'}},
 draw(s,f,X){
  const local=s.mode==='local',j=f&&f.j>=0?f.j:0,rel=local?K7_localRel(j,s.target):s.rel,pts=K7_armPts(rel),tip=pts[K7_ARM.n];
  let out=heading(local?'Two commands, then the arm does the rest':'Now you place every joint yourself');
  out+=R(0,340,390,40,'#eef4f7','none',0);
  K7_ARM.targets.forEach((t,i)=>{const [fx,fy]=K7_food(i),on=i===s.target;out+=hit(X,'target',i,`Food ${i+1}. Press to reach for it.`,Ci(fx,fy,on?13:10,on?C.amber:'#f4d27a',on?C.ink:'none')+(on?TBF(fx,fy-19,'food',13,C.amber):''))});
  out+=K7_ell(58,326,42,30,'#b9644e')+Ci(72,314,6,'#fff')+Ci(74,314,3,C.ink);
  out+=P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),'#b9644e',11);
  for(let i=0;i<K7_ARM.n;i++){const straight=i===0?rel[0]===K7_ARM.targets[s.target]:rel[i]===0;const dot=Ci(pts[i][0],pts[i][1],local?4:8,straight?C.green:'#fff',local?'none':C.ink);
   out+=local?dot:hit(X,'joint',i,i===0?'Base of the arm. Press to turn it towards the food.':`Joint ${i}. Press to straighten it a little.`,dot)}
  const dist=Math.round(Math.hypot(tip[0]-K7_food(s.target)[0],tip[1]-K7_food(s.target)[1])),done=dist<2;
  const cmds=local?(j>=1?2:0):s.cmd,self=local?Math.max(0,j-1):0;
  out+=counter(408,48,'Commands from the brain',cmds,C.blue,176)+counter(408,102,'Joints placed by the arm itself',`${self} of 7`,C.green,176);
  out+=TBF(408,176,'About 500 million neurons',13,C.ink,'start')+R(408,184,176,18,C.pale,'none',4)+R(408,184,176*2/3,18,'#b9644e','none',4);
  out+=TF(408,220,'arms: about two-thirds',13,'#8f4433','start')+TF(408,238,'head: about one-third',13,C.blue,'start');
  out+=K7_badge(408,256,'Toy model')+TF(408,298,'A sketch of bend propagation,',13,C.muted,'start')+TF(408,315,'not a model of real muscle.',13,C.muted,'start');
  out+=TF(408,362,done?'Tip is on the food':`Tip is ${dist} units from the food`,13,done?C.green:C.muted,'start');
  const ph=local?(f&&f.say)||'':done?`Toy model. The tip is on the food after ${s.cmd} commands from the brain. With the arm’s own program the same reach took 2.`:`Toy model. You are the brain and the arm does nothing for itself. Tap the base to turn it, and each joint to straighten it. Commands sent so far: ${s.cmd}; the tip is ${dist} units from the food.`;
  return {svg:out,phase:ph};
 }});

const K7_CPP={
 saline:{label:'Saline',train:'L',after:'L',txt:'Control: a harmless saline injection, then time shut in the chamber it liked best.',res:'No clear change. The injection and handling alone do not put it off the chamber.',dir:'about the same'},
 acid:{label:'Acid',train:'L',after:'R',txt:'Dilute acetic acid injected into one arm, then time shut in the chamber it liked best.',res:'In the later test it avoids that chamber, though nothing harmful is there now.',dir:'less'},
 relief:{label:'Acid, then relief',train:'R',after:'R',txt:'Acid injection, then a local anaesthetic (lidocaine) at the site, in the chamber it liked least.',res:'In the later test it prefers that chamber: the place where the pain eased.',dir:'more'},
 lido:{label:'Relief only',train:'R',after:'L',txt:'Lidocaine with no injury, in the chamber it liked least.',res:'No clear change. The anaesthetic is not attractive in itself, only when there is pain to relieve.',dir:'about the same'}};
SCENE({id:'octopus-minds-pain',name:'Does the octopus mind the pain?',tag:'Crook’s place-preference test',
 definition:'A reflex pulls an injured arm away at once. To ask whether an injury is also felt as bad, Robyn Crook used conditioned place preference: let the animal choose between chambers, pair one chamber with a treatment, and see whether its choice changes later, when the treatment is over.',
 example:'Octopuses injected with dilute acetic acid later avoided the chamber where they had felt its effects, and groomed the injection site with the beak. Injured octopuses given a local anaesthetic came to prefer the chamber where relief arrived; uninjured ones given the same anaesthetic did not.',
 desc:'A three-chamber tank with a small octopus, stepped through first test, training and second test for one of four treatments, with schematic bars for time spent in the training chamber before and after.',
 research:['Crook, R. J. (2021). Behavioral and neurophysiological evidence suggests affective pain experience in octopus. iScience 24, 102229.','The bars show only the direction of the published result, not its data. Small groups of one species; the step from a lasting negative state to felt pain is still an inference.'],
 dur:12,hint:'Choose a treatment, then step through the three stages of the experiment.',
 init:()=>({g:'acid'}),
 trace(s){const g=K7_CPP[s.g];return [
  {st:0,say:'First test. The octopus is free to move between the two patterned chambers. It spends more time in the striped one: that is its first choice.'},
  {st:1,say:'Training. '+g.txt},
  {st:2,say:`Second test, with all doors open again. ${g.res} Compared with the first test it spends ${g.dir==='about the same'?'about the same':g.dir} time in the training chamber.`}]},
 ui:[{choose:Object.keys(K7_CPP).map(k=>[k,K7_CPP[k].label]),label:'Treatment',get:s=>s.g,act:'g'}],
 on:{g(s,v){s.g=v}},
 draw(s,f){
  const g=K7_CPP[s.g],st=f?f.st:0,side=st===0?'L':st===1?g.train:g.after,ox=side==='L'?105:305;
  let out=heading(['First test: free choice','Training: one chamber, one treatment','Second test: free choice again'][st]);
  out+=R(40,52,330,118,'#fff',C.ink,6);
  for(let i=0;i<9;i++)out+=L(52+i*14,58,52+i*14,164,'#cfe0ec',5,'stroke-linecap="butt"');
  for(let i=0;i<30;i++)out+=Ci(252+(i%6)*20,66+Math.floor(i/6)*22,3.5,'#cfe0ec');
  out+=L(170,52,170,170,C.ink,2,st===1?'':'stroke-dasharray="6 8"')+L(240,52,240,170,C.ink,2,st===1?'':'stroke-dasharray="6 8"');
  out+=K7_octo(ox,112,1.25);
  out+=TF(105,188,'striped: first choice',13,C.muted)+TF(305,188,'dotted: liked least',13,C.muted)+TF(205,188,'start',13,C.muted);
  if(st===1)out+=TBF(g.train==='L'?105:305,72,'doors shut',13,C.coral);
  // Schematic bars: time in the training chamber, before and after.
  const b0=g.train==='L'?70:32,b1=g.dir==='less'?30:g.dir==='more'?72:b0;
  out+=TBF(490,62,'Time in the training chamber',13,C.ink)+L(410,170,570,170,C.line,2);
  out+=R(430,170-b0,46,b0,'#cfe0ec','none',4)+TF(453,188,'before',13,C.muted);
  if(st===2)out+=R(504,170-b1,46,b1,g.dir==='less'?C.coral:g.dir==='more'?C.green:C.blue,'none',4)+TBF(527,170-b1-7,g.dir==='about the same'?'same':g.dir,13,g.dir==='less'?C.coral:g.dir==='more'?C.green:C.blue);
  out+=TF(527,188,'after',13,C.muted);
  out+=K7_badge(398,196,'Schematic: direction only');
  out+=R(20,226,560,146,'#f6f9fb',C.grid)+TBF(32,246,'Treatment: '+g.label.toLowerCase(),14,C.ink,'start')+K7_para(32,266,g.txt,84);
  if(st===2)out+=K7_para(32,300,g.res,84,{fill:g.dir==='less'?C.coral:g.dir==='more'?C.green:C.blue,bold:true});
  else out+=TF(32,300,st===0?'Step on to the training stage.':'Step on to see where it goes when the doors open.',13,C.muted,'start');
  out+=K7_para(32,340,'A reflex cannot explain a change of place preference: the animal must have learned that a place went with feeling worse, or better.',84,{fill:C.muted});
  return {svg:out,phase:(f&&f.say)||''};
 }});

/* =========================== bees-and-insects =========================== */
// Toy probabilities that a bee extends its tongue to each of five odour mixes, from the rewarded mix to the punished one.
const K7_BIAS={calm:[.9,.8,.6,.4,.25],shaken:[.9,.78,.5,.24,.1]};
function K7_batch(g,probs,seed){const r=rng(seed);for(let b=0;b<20;b++)for(let i=0;i<5;i++)if(r()<probs[i])g.k[i]++;g.n+=20}
const K7_biasSim=(nb,probs,seed)=>{const g={n:0,k:[0,0,0,0,0]};for(let b=0;b<nb;b++)K7_batch(g,probs,seed+b*7);return g};
SCENE({id:'bees-and-insects',name:'The pessimistic bee',tag:'You run a judgement-bias test',
 definition:'A judgement-bias test trains an animal that one signal means something good and another something bad, then shows it signals in between. Treating the in-between signals as bad is called a pessimistic bias. In people and other mammals such a bias goes with anxious or low mood. Bateson and colleagues (2011) found it in honeybees that had been shaken hard for a minute.',
 example:'Bees learned that one mix of two scents came with sugar and another with bitter quinine. Shaken bees were then less likely than calm ones to reach out with the tongue to the punished mix and to the in-between mix nearest it, while still reaching for the rewarded mix. Whether a bee feels anything like anxiety is contested.',
 desc:'A bar chart of the share of simulated bees extending the tongue to five odour mixes from rewarded to punished, for calm and shaken bees, built up in batches of twenty as the learner runs the test.',
 research:['Bateson, M., Desire, S., Gartside, S. E. & Wright, G. A. (2011). Agitated honeybees exhibit pessimistic cognitive biases. Current Biology 21, 1070–1073.','Harding, E. J., Paul, E. S. & Mendl, M. (2004). Cognitive bias and affective state. Nature 427, 312 (the test, first used with rats).','The bees here are simulated from toy probabilities chosen to show the published pattern; they are not the paper’s data. That the behaviour reflects a feeling is contested.'],
 dur:12,hint:'Test 20 calm bees, then 20 shaken bees, and compare the bars. Run more batches to see how much chance moves them.',
 init:()=>({calm:{n:0,k:[0,0,0,0,0]},shaken:{n:0,k:[0,0,0,0,0]}}),
 watch(p){const nb=Math.floor(p*7.2);return {calm:K7_biasSim(Math.min(3,nb),K7_BIAS.calm,8),shaken:K7_biasSim(clamp(nb-3,0,3),K7_BIAS.shaken,8),sim:true}},
 ui:[{b:'Test 20 calm bees',act:'calm'},{b:'Shake, then test 20 bees',act:'shaken'},{b:'Clear the results',act:'clear'}],
 on:{calm(s){if(s.calm.n<400)K7_batch(s.calm,K7_BIAS.calm,nextSeed());return 'keep'},shaken(s){if(s.shaken.n<400)K7_batch(s.shaken,K7_BIAS.shaken,nextSeed());return 'keep'},clear(s){s.calm={n:0,k:[0,0,0,0,0]};s.shaken={n:0,k:[0,0,0,0,0]};return 'keep'}},
 draw(s){
  let out=heading('How many bees reach for each scent?');
  out+=R(40,46,14,14,C.blue,'none',3)+TF(60,58,`calm: ${s.calm.n} bees`,13,C.ink,'start')+R(180,46,14,14,C.coral,'none',3)+TF(200,58,`shaken: ${s.shaken.n} bees`,13,C.ink,'start');
  out+=K7_badge(346,42,'Simulated bees · toy probabilities');
  const base=262,sc=1.6;out+=L(70,base,560,base,C.line,2)+L(70,base-100*sc,70,base,C.line,2);
  [0,50,100].forEach(v=>out+=L(65,base-v*sc,70,base-v*sc,C.line,1.5)+TF(60,base-v*sc+4,v+'%',13,C.muted,'end'));
  for(let i=0;i<5;i++){const x=125+i*95;
   [['calm',C.blue,-29],['shaken',C.coral,3]].forEach(([g,col,dx])=>{const G0=s[g];if(!G0.n)return;const pc=Math.round(G0.k[i]/G0.n*100);out+=R(x+dx,base-pc*sc,26,pc*sc,col,'none',3)+TF(x+dx+13,base-pc*sc-5,pc,13,col)});
   out+=TF(x,base+18,['rewarded mix','','half and half','','punished mix'][i],13,C.muted)}
  out+=K7_bee(96,base+34,.8,true)+TF(120,base+38,'← more like sugar',13,C.green,'start')+TF(545,base+38,'more like quinine →',13,C.coral,'end');
  out+=TF(300,330,'Tongue out means the bee expects sugar.',13,C.ink)+TF(300,350,'Published pattern: shaken bees held back more from the punished mix',13,C.muted)+TF(300,367,'and the in-between mix nearest it, and no less from the rewarded mix.',13,C.muted);
  let ph;const pc=g=>Math.round((g.k[3]+g.k[4])/(2*g.n)*100);
  if(s.calm.n&&s.shaken.n)ph=`${s.sim?'Simulated run. ':''}At the two mixes nearest the punished one, ${pc(s.calm)}% of calm bees and ${pc(s.shaken)}% of shaken bees reached out. ${pc(s.shaken)<pc(s.calm)?'The shaken bees treat doubtful scents as more likely to be bad: a pessimistic bias.':'In this small sample the difference has not shown; run more bees.'} The behaviour is the finding; whether a feeling lies behind it is contested.`;
  else if(s.calm.n)ph=`${s.sim?'Simulated run. ':''}Calm bees: ${Math.round(s.calm.k[0]/s.calm.n*100)}% reach for the rewarded mix and ${Math.round(s.calm.k[4]/s.calm.n*100)}% for the punished one, with the in-between mixes between. Now shake a batch first.`;
  else ph=s.shaken.n?'Shaken bees are in. Test calm bees to compare.':'Each simulated bee is offered five scent mixes, from the one that came with sugar to the one that came with quinine. Test a batch of calm bees first.';
  return {svg:out,phase:ph};
 }});

const K7_SOLVI={none:{label:'No treat',h:5,txt:'The bee goes straight from the nest to the test.'},sugar:{label:'Sugar drop first',h:2,txt:'The bee gets a small, unexpected drop of strong sugar solution on the way to the test.'},block:{label:'Sugar + blocker',h:5,txt:'The bee gets the sugar drop, and also a drug that blocks the action of dopamine.'}};
SCENE({id:'bees-and-insects-optimism',name:'A sweet surprise',tag:'Optimism-like behaviour in bumblebees',
 definition:'Solvi, Baciadonna and Chittka (2016) asked the opposite question to the shaken-bee study: can something good shift a bee’s judgement the other way? Bumblebees learned that a flower of one colour in one place held sugar and a flower of another colour elsewhere held none. Then they met a new flower in between.',
 example:'Bees given a small unexpected drop of sugar solution just before the test went into the in-between flower sooner than bees given nothing. They also returned to feeding sooner after a simulated spider attack. A drug that blocks dopamine removed both effects.',
 desc:'An arena with a rewarded flower, an unrewarded flower and a new in-between flower; a bumblebee hesitates at the entrance and then flies to the new flower, with schematic bars for the time taken under three conditions.',
 research:['Solvi, C., Baciadonna, L. & Chittka, L. (2016). Unexpected rewards induce dopamine-dependent positive emotion-like state changes in bumblebees. Science 353, 1529–1531.','Times here are schematic steps, not the paper’s seconds. The authors wrote “emotion-like”: the behaviour and its dopamine dependence are the finding, and a felt state is not shown.'],
 dur:12,hint:'Choose what the bee gets before the test, then step through its flight.',
 init:()=>({c:'sugar'}),
 trace(s){const c=K7_SOLVI[s.c],n=c.h+3;return range(n+1).map(k=>({k,n,say:k===0?c.txt+' It arrives at the arena and sees a flower it has never met, between the rewarded and the unrewarded place.':k<=c.h?`It hesitates at the entrance (${k} of ${c.h} steps).`:k<n?'It flies towards the new flower.':`It enters the new flower after ${n} steps. ${s.c==='sugar'?'That is sooner than the 8 steps of an untreated bee.':s.c==='block'?'With dopamine blocked, the sugar drop makes no difference: 8 steps, as for an untreated bee.':'This is the baseline.'}`}))},
 ui:[{choose:Object.keys(K7_SOLVI).map(k=>[k,K7_SOLVI[k].label]),label:'Before the test',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=v}},
 draw(s,f){
  const c=K7_SOLVI[s.c],k=f?f.k:0,n=c.h+3,fly=clamp((k-c.h)/3,0,1),by=lerp(212,150,fly);
  let out=heading('How soon does it try the new flower?');
  out+=R(30,48,360,180,'#f3f8ee',C.line,10);
  const flower=(x,col,l1,l2)=>Ci(x,112,20,col,'#fff')+Ci(x,112,7,'#f4d27a')+TF(x,150,l1,13,C.ink)+TF(x,166,l2,13,C.muted);
  out+=flower(90,'#1772b7','blue','sugar in training')+flower(330,'#2c776c','green','nothing in training');
  out+=Ci(210,112,20,'#20838f','#fff')+Ci(210,112,7,'#f4d27a')+TBF(210,78,'new, in between',13,C.ink);
  out+=K7_bee(206,fly>=1?114:by,1)+(k>0&&k<=c.h?TF(240,216,'hesitating…',13,C.muted,'start'):'')+TF(52,216,'entrance ↓',13,C.muted,'start');
  out+=TBF(495,60,'Steps to enter the new flower',13,C.ink);
  Object.keys(K7_SOLVI).forEach((key,i)=>{const q=K7_SOLVI[key],tot=q.h+3,on=key===s.c,y=74+i*46,shown=on?Math.min(k,tot):tot;
   out+=TF(408,y+14,q.label,13,on?C.ink:C.muted,'start')+R(408,y+20,tot*20,16,'#e8eef2','none',4)+R(408,y+20,shown*20,16,on?(key==='sugar'?C.green:C.blue):'#c8d7e1','none',4)+TBF(408+tot*20+8,y+33,on?`${shown}`:`${tot}`,13,on?C.ink:C.muted,'start')});
  out+=K7_badge(408,212,'Schematic steps');
  out+=R(20,240,560,132,'#f6f9fb',C.grid)+TBF(32,260,c.label,14,C.ink,'start')+K7_para(32,280,c.txt,84);
  out+=K7_para(32,318,'Published pattern: sugared bees entered the in-between flower sooner; with a dopamine blocker they did not.',84,{fill:C.ink});
  out+=TF(32,360,'The authors reported checks that sugar had not simply made the bees more active.',13,C.muted,'start');
  return {svg:out,phase:(f&&f.say)||''};
 }});

const K7_FIND=[
 {t:'Shaken honeybees hold back from in-between scents',src:'Bateson et al. (2011)',feel:'a negative mood, something like anxiety',ex:0,
  more:'The shaken bees still reached for the rewarded scent, so they were not simply sluggish. That narrows the simple reading. It does not show a felt mood.'},
 {t:'Sugared bumblebees fly sooner to an in-between flower',src:'Solvi et al. (2016)',feel:'a positive mood, something like optimism',ex:1,
  more:'A dopamine blocker removed the effect. A chemical that lowers the bar for approaching explains the behaviour whether or not anything is felt.'},
 {t:'Bumblebees roll small wooden balls, again and again, for no food',src:'Dona et al. (2022)',feel:'rolling is rewarding in itself: play',ex:2,
  more:'Younger bees rolled more, as young mammals play more. Whether the rolling is enjoyed cannot be read off the behaviour.'}];
const K7_EXPL=['A stress chemical lowers the urge to respond to doubtful signals.','A reward chemical lowers the bar for approaching uncertain things.','An object-handling or exploring routine runs with nothing to gain.'];
SCENE({id:'bees-and-insects-readings',name:'Play, and three sober readings',tag:'Contested: feeling or mechanism?',
 definition:'Each insect finding can be read two ways. On the richer reading the behaviour expresses a felt state; on the sober reading a chemical or a built-in routine produces the behaviour and nothing need be felt. Barron and Klein (2016) argue that the insect brain has the kind of central, integrating structure that supports experience in vertebrates. Critics reply that small circuits, and robots, can produce such behaviour with no experience.',
 example:'Dona and colleagues (2022) gave bumblebees a clear path to food and, beside it, small wooden balls. Bees went out of their way to roll the balls, repeatedly and for no reward, and younger bees rolled more. The authors called it play-like, using criteria for play drawn up for vertebrates.',
 desc:'One of three insect findings with its richer reading, above three sober explanations; the learner matches the explanation usually offered for that finding and sees what would help tell the readings apart.',
 research:['Dona, H. S. G., Solvi, C., Kowalewska, A., Mäkelä, K., MaBouDi, H. & Chittka, L. (2022). Do bumble bees play? Animal Behaviour 194, 239–251.','Barron, A. B. & Klein, C. (2016). What insects can tell us about the origins of consciousness. PNAS 113, 4900–4908.','Adamo, S. A. (2016). Do insects feel pain? A question at the intersection of animal behaviour, philosophy and robotics. Animal Behaviour 118, 75–79. Insect emotion is contested: every finding here has an explanation without feeling.'],
 dur:12,hint:'Choose a finding, then tap the sober explanation usually offered for it.',
 init:()=>({i:0,pick:[null,null,null]}),
 watch(p){const i=Math.min(2,Math.floor(p*3)),u=p*3-i;return {i,pick:K7_FIND.map((q,j)=>j<i||(j===i&&u>.5)?q.ex:null),sim:true}},
 ui:[{choose:[[0,'Shaken bees'],[1,'Sugared bees'],[2,'Ball rolling']],label:'Finding',get:s=>s.i,act:'i'}],
 on:{i(s,v){s.i=Number(v);return 'keep'},ex(s,v){s.pick[s.i]=Number(v);return 'keep'}},
 draw(s,f,X){
  const q=K7_FIND[s.i],a=s.pick[s.i],ok=a===q.ex;let out=heading('Which sober reading answers this finding?');
  out+=R(20,44,560,72,'#fff',C.grid)+TBF(32,64,q.t,14,C.ink,'start')+TF(568,106,q.src,13,C.muted,'end')+TF(32,86,'Richer reading: '+q.feel+'.',13,C.purple,'start')+TF(32,106,s.sim?'A simulated learner is matching.':'Tap one of the three sober readings below.',13,C.muted,'start');
  K7_EXPL.forEach((e,j)=>{const x=20+j*190,sel=a===j;out+=hit(X,'ex',j,'Sober reading: '+e,R(x,126,180,92,sel?(ok?C.greenp:C.amberp):'#fff',sel?(ok?C.green:C.amber):C.blue)+TBF(x+12,146,'No feeling needed',13,C.blue,'start')+K7_para(x+12,166,e,25))});
  out+=R(20,228,560,96,'#f6f9fb',C.grid);
  if(a===null)out+=TF(300,280,'Nothing matched yet.',13,C.muted);
  else if(ok)out+=TBF(32,248,'That is the reading usually offered.',14,C.green,'start')+K7_para(32,268,q.more,84);
  else out+=TBF(32,248,'That reading is usually offered for another finding.',14,C.amber,'start')+K7_para(32,268,'It could be stretched to fit, which is part of the difficulty: sober readings are flexible. Try another.',84);
  const n=K7_FIND.filter((x,j)=>s.pick[j]===x.ex).length;
  out+=TF(300,346,`Matched ${n} of 3 · Contested: every finding has a reading with feeling and one without.`,13,C.ink)+TF(300,366,'Barron & Klein (2016) argue for insect experience; Adamo (2016) and others doubt it.',13,C.muted);
  return {svg:out,phase:a===null?`${q.t}. Source: ${q.src}. The richer reading is ${q.feel}. Which explanation without feeling is usually set against it?`:ok?`${q.t}: set against “${q.feel}” is the reading that ${K7_EXPL[q.ex].charAt(0).toLowerCase()+K7_EXPL[q.ex].slice(1)} ${q.more}${n===3?' All three are matched. None of the three experiments rules its sober reading out, which is why insect emotion remains contested.':''}`:'That sober reading is usually offered for a different finding. Sober readings can often be stretched to fit, which is one reason the debate is hard to settle.'};
 }});

/* =========================== infants =========================== */
const K7_PAIN=[
 {t:'Pathways',s:'Pain nerves and routes to the brain',found:'Thin or missing insulation (myelin) on a newborn’s nerves had been taken to mean no pain. The review noted that adult pain signals also travel in thin and uninsulated fibres, and that a baby’s nerves are short.',cannot:'Wiring shows that a signal can travel. It does not show that it is felt.'},
 {t:'Body',s:'Heart rate, blood pressure, sweating',found:'During procedures such as heel pricks and circumcision done without pain relief, heart rate and blood pressure rose and the palms sweated.',cannot:'These are automatic responses, and they can occur without awareness.'},
 {t:'Hormones',s:'Stress hormones during surgery',found:'In a 1987 trial, preterm babies given the opioid fentanyl during surgery had much smaller surges of stress hormones than babies given the lighter anaesthesia then usual.',cannot:'A hormone surge is a response of the body. It is not a report.'},
 {t:'Behaviour',s:'Cry, grimace, pulling away',found:'Newborns showed a distinct cry, a characteristic grimace and withdrawal of the limb.',cannot:'Withdrawal can be a spinal reflex. A cry and a grimace are harder to explain that way, but are still behaviour.'},
 {t:'Cortex (2006)',s:'A response over sensory cortex',found:'Slater and colleagues later recorded a response over the sensory cortex of preterm babies during a clinically required heel prick.',cannot:'It shows that the signal reaches the cortex. It still is not a report.'}];
SCENE({id:'infants',name:'Do newborns feel pain?',tag:'The 1987 review of the evidence',
 definition:'A newborn cannot say what it feels. Until the 1980s many newborns had operations with little or no anaesthesia, partly because it was doubted that they felt pain and partly because the drugs were thought too risky. In 1987 Anand and Hickey reviewed the anatomical, hormonal and behavioural evidence and concluded that newborns have what is needed to feel pain.',
 example:'In a trial published the same year, preterm babies having heart surgery were given either the light anaesthesia then usual or the same with the opioid fentanyl added. The babies given fentanyl had smaller stress-hormone surges and fewer complications afterwards. Practice changed in the following years.',
 desc:'Five lines of evidence about newborn pain as rows the learner adds one at a time, with a panel stating what each line found and what it cannot show, and a count of lines added.',
 research:['Anand, K. J. S. & Hickey, P. R. (1987). Pain and its effects in the human neonate and fetus. New England Journal of Medicine 317, 1321–1329.','Anand, K. J. S., Sippell, W. G. & Aynsley-Green, A. (1987). Randomised trial of fentanyl anaesthesia in preterm babies undergoing surgery: effects on the stress response. Lancet 329, 243–248.','Slater, R. et al. (2006). Cortical pain responses in human infants. Journal of Neuroscience 26, 3662–3666. History and science only: nothing here is medical or ethical advice.'],
 dur:12,hint:'Tap each line of evidence to add it to the case, and read what it can and cannot show.',
 init:()=>({on:[0,0,0,0,0],sel:0}),
 watch(p){const n=Math.min(5,Math.floor(p*5.5)+1);return {on:range(5).map(i=>i<n?1:0),sel:n-1}},
 ui:[{b:'Add all five lines',act:'all'},{b:'Clear',act:'clear'}],
 on:{row(s,v){const i=Number(v);s.sel=i;s.on[i]=1;return 'keep'},all(s){s.on=[1,1,1,1,1];return 'keep'},clear(s){s.on=[0,0,0,0,0];return 'keep'}},
 draw(s,f,X){
  const q=K7_PAIN[s.sel],n=sum(s.on);let out=heading('Five lines of evidence, and what each can show');
  K7_PAIN.forEach((r,i)=>{const y=46+i*50,on=s.on[i],sel=i===s.sel;
   out+=hit(X,'row',i,`${r.t}: ${r.s}. Press to add and read.`,R(20,y,300,44,on?C.greenp:'#fff',sel?C.blue:on?C.green:C.line)+Ci(42,y+22,11,on?C.green:'#fff',on?C.green:C.line)+TBF(42,y+27,on?'✓':String(i+1),13,on?'#fff':C.muted)+TBF(62,y+19,r.t,13,C.ink,'start')+TF(62,y+36,r.s,13,C.muted,'start'))});
  out+=R(332,46,248,244,'#f6f9fb',C.grid)+TBF(344,66,q.t+': what was found',13,C.ink,'start')+K7_para(344,85,q.found,35);
  const fl=K7_lines(q.found,35).length,y2=85+fl*17+10;
  out+=TBF(344,y2,'What it cannot show',13,C.coral,'start')+K7_para(344,y2+19,q.cannot,35,{fill:C.ink});
  out+=TBF(300,318,`Lines of evidence added: ${n} of 5`,14,n===5?C.green:C.ink);
  out+=TF(300,340,'No line is a report, and each alone has a simpler reading. Together they are',13,C.muted)+TF(300,357,'the kinds of evidence relied on for anyone who cannot speak.',13,C.muted)+TF(300,375,'Not medical advice.',13,C.muted);
  return {svg:out,phase:`${q.t}. ${q.found} ${q.cannot} ${n===5?'All five lines are in. None is a report; the conclusion that newborns feel pain is an inference from all of them together, and it is now the accepted one.':`Lines added: ${n} of 5.`}`};
 }});

// [label, onset drawn (ms), words, amplitude of late wave]
const K7_AGES={adult:['Adult',300,'from about 300 ms',60],m12:['12 to 15 months',900,'at about 900 ms',55],m5:['5 months',1100,'later than 1,000 ms',30]};
const K7_tms=t=>60+t*.3125;
function K7_erp(age,vis,t){const A=K7_AGES[age],early=40*vis*Math.exp(-Math.pow((t-180)/55,2)),g=1/(1+Math.exp(-(vis-.5)/.06)),u=(t-A[1])/450;return early+(u>0&&u<1?A[3]*g*Math.sin(Math.PI*u):0)}
SCENE({id:'infants-timing',name:'A late wave, three times later',tag:'Kouider’s infant brain marker',
 definition:'In adults, a picture that is reported as seen is followed by an early brain response that grows steadily with how long the picture was shown, and by a late, slow response that appears only once the picture is shown long enough. Kouider and colleagues (2013) looked for the same two-stage pattern in infants of 5, 12 and 15 months who were shown faces for varying brief durations.',
 example:'They found the late, all-or-none response in all three age groups, but slower: beginning around 900 ms in 12- to 15-month-olds, against roughly 300 ms in adults, and later and weaker still at 5 months.',
 desc:'A schematic brain response over time after a face appears, with an early bump and a late slow wave whose onset depends on the chosen age group, above bars comparing the onset of the late wave at three ages.',
 research:['Kouider, S., Stahlhut, C., Gelskov, S. V., Barbosa, L. S., Dutat, M., de Gardelle, V., Christophe, A., Dehaene, S. & Dehaene-Lambertz, G. (2013). A neural marker of perceptual consciousness in infants. Science 340, 376–380.','The traces are schematic, not recordings, and the onsets are rounded. Limits: the marker was validated in adults who can report, and whether such a late wave marks experience or only its consequences is itself disputed (see the lesson on ignition).'],
 dur:12,hint:'Choose an age, then lengthen the time the face is shown and watch for the late wave.',
 init:()=>({age:'m12',vis:.8}),
 watch(p){return {age:p<.34?'adult':p<.67?'m12':'m5',vis:clamp(.25+((p*3)%1)*.9,0,1)}},
 ui:[{choose:[['adult','Adult'],['m12','12–15 months'],['m5','5 months']],label:'Age',get:s=>s.age,act:'age'},{range:'vis',label:'How long the face is shown',min:0,max:1,step:.05,get:s=>s.vis,act:'vis',show:v=>v<.35?'very brief':v<.5?'brief':v<.7?'a little longer':'longer'}],
 on:{age(s,v){s.age=v;return 'keep'},vis(s,v){s.vis=Number(v);return 'keep'}},
 draw(s){
  const A=K7_AGES[s.age],late=s.vis>=.5;let out=heading('When does the late wave arrive?');
  out+=K7_badge(60,42,'Schematic traces, not recordings');
  const base=200;out+=L(60,base,560,base,C.line,2);
  [0,400,800,1200,1600].forEach(t=>out+=L(K7_tms(t),base,K7_tms(t),base+5,C.line,1.5)+TF(K7_tms(t),base+20,t===0?'face on':String(t),13,C.muted));
  out+=TF(560,base+38,'milliseconds after the face appears',13,C.muted,'end');
  const pts=[];for(let t=0;t<=1600;t+=10)pts.push(fmt(K7_tms(t))+' '+fmt(base-K7_erp(s.age,s.vis,t)));
  out+=P('M'+pts.join(' L'),C.blue,3);
  out+=TF(K7_tms(180),base-48-(s.vis>.9?4:0),'early response',13,C.muted);
  if(late)out+=L(K7_tms(A[1]),base-84,K7_tms(A[1]),base,C.coral,2,'stroke-dasharray="5 4"')+TBF(Math.min(K7_tms(A[1])+6,430),base-88,'late wave '+A[2],13,C.coral,'start');
  else out+=TF(400,base-40,'no late wave: shown too briefly',13,C.muted);
  out+=TBF(60,262,'Onset of the late wave',13,C.ink,'start');
  Object.keys(K7_AGES).forEach((k,i)=>{const q=K7_AGES[k],y=272+i*30,on=k===s.age,lim=k==='m5'?1000:q[1];
   out+=TF(60,y+17,q[0],13,on?C.ink:C.muted,'start')+R(190,y+4,lim*.25,18,on?C.coral:'#e3c9c1','none',4)+(k==='m5'?TBF(190+lim*.25+4,y+18,'→',14,on?C.coral:'#b99b92','start'):'')+TF(190+lim*.25+(k==='m5'?24:8),y+18,k==='adult'?'about 300 ms':k==='m12'?'about 900 ms':'later than 1,000 ms',13,on?C.ink:C.muted,'start')});
  out+=TF(300,374,'900 ÷ 300 = 3: about three times later at 12 to 15 months than in adults.',13,C.muted);
  return {svg:out,phase:late?`${A[0]}: the face is shown long enough, and after the early response a late slow wave appears ${A[2]}${s.age==='m5'?', and it is weaker than in older infants':s.age==='m12'?', about three times later than an adult’s':''}. In adults this late wave goes with reporting the face as seen. In infants there is no report to check it against.`:`${A[0]}: with the face shown this briefly there is only the early response, which grows smoothly with duration. In adults such trials are usually reported as unseen. Lengthen the display.`};
 }});

const K7_MARK=[
 {t:'Thalamus wired to cortex',x:90,when:'from about 24 weeks of pregnancy',src:'Lagercrantz & Changeux (2009)',assumes:'Experience needs the cortex to be connected to the thalamus, as it is in conscious adults.',problem:'The wiring may be needed without being enough. Lagercrantz and Changeux add that the fetus is kept in a sedated, sleep-like state.'},
 {t:'Late wave to a seen face',x:290,when:'recorded at 5 months, the youngest tested',src:'Kouider et al. (2013)',assumes:'The late slow wave that goes with reported seeing in adults means the same thing in a baby.',problem:'Five months was the youngest age tested, so this is a latest date, not a start. The adult marker is itself disputed.'},
 {t:'Knows itself in a mirror',x:400,when:'from about 18 to 24 months',src:'Amsterdam (1972)',assumes:'Experience needs a sense of oneself as an object among others.',problem:'The mirror test measures self-recognition. A baby who fails it still cries, looks and learns.'},
 {t:'Reports a false belief',x:520,when:'at about 4 years',src:'Wimmer & Perner (1983)',assumes:'Experience needs thoughts about mental states, which critics say some higher-order theories imply.',problem:'Few accept the result: it would deny experience to three-year-olds who can tell you what hurts.'}];
SCENE({id:'infants-cradle',name:'When does experience begin?',tag:'It depends which marker you ask for',
 definition:'Proposed dates for the start of experience run from late pregnancy to well after the first birthday, because they rest on different markers. Bayne, Frohlich, Cusack, Moser and Naci (2023) reviewed several markers together and argued that consciousness is probably in place by early infancy and may begin before birth. Late-onset views ask for more, such as self-awareness.',
 example:'Ask for the wiring that carries signals to the cortex, and the date is around 24 weeks of pregnancy. Ask for the brain wave that goes with reported seeing in adults, and it has been recorded at 5 months. Ask for mirror self-recognition, and it is 18 to 24 months.',
 desc:'A timeline from 24 weeks of pregnancy to 4 years, not to scale, with four markers; the learner chooses a marker and sees from when experience would be credited, what the marker assumes and its main problem.',
 research:['Bayne, T., Frohlich, J., Cusack, R., Moser, J. & Naci, L. (2023). Consciousness in the cradle: on the emergence of infant experience. Trends in Cognitive Sciences 27, 1135–1149.','Lagercrantz, H. & Changeux, J.-P. (2009). The emergence of human consciousness: from fetal to neonatal life. Pediatric Research 65, 255–260.','Limits: every marker was validated on adults or older children who can report. Unsettled, and not medical or ethical advice.'],
 dur:12,hint:'Tap a marker to see when experience would begin if that marker were the test.',
 init:()=>({m:1}),
 watch(p){return {m:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:[[0,'Wiring'],[1,'Late wave'],[2,'Mirror'],[3,'False belief']],label:'Marker required',get:s=>s.m,act:'m'}],
 on:{m(s,v){s.m=Number(v);return 'keep'}},
 draw(s,f,X){
  const q=K7_MARK[s.m];let out=heading('Choose the marker; the date follows');
  out+=L(40,128,580,128,C.line,3)+TF(190,108,'not to scale',13,C.muted);
  [[90,'24 weeks'],[200,'birth'],[290,'5 months'],[400,'18–24 months'],[520,'4 years']].forEach(([x,l])=>out+=L(x,122,x,134,C.muted,2)+TF(x,152,l,13,C.muted));
  K7_MARK.forEach((m,i)=>{const on=i===s.m;out+=hit(X,'m',i,`${m.t}: ${m.when}. Press to choose.`,Ci(m.x,128,on?11:8,on?C.coral:'#fff',on?C.coral:C.blue)+L(m.x,117,m.x,88,on?C.coral:C.line,2)+R(m.x-22,62,44,26,on?C.coralp:'#fff',on?C.coral:C.line,6)+TBF(m.x,80,String(i+1),13,on?C.coral:C.blue))});
  out+=R(q.x,162,580-q.x,16,C.coralp,'none',4)+L(q.x,158,q.x,182,C.coral,3)+TBF(300,197,`Marker ${s.m+1}: ${q.when}`,13,C.coral);
  out+=L(150,214,200,214,C.green,3,'stroke-dasharray="5 5"')+L(200,214,580,214,C.green,3)+TF(300,232,'Bayne et al. (2023): probably by early infancy, perhaps before birth',13,C.green);
  out+=R(20,244,560,128,'#f6f9fb',C.grid)+TBF(32,264,`${s.m+1}. ${q.t}`,14,C.ink,'start')+TF(568,264,q.src,13,C.muted,'end');
  out+=TBF(32,286,'Assumes',13,C.blue,'start')+K7_para(100,286,q.assumes,72);
  out+=TBF(32,326,'Problem',13,C.coral,'start')+K7_para(100,326,q.problem,72);
  return {svg:out,phase:`If the marker required is “${q.t.toLowerCase()}”, experience is credited ${q.when}. Source: ${q.src}. It assumes: ${q.assumes} Its problem: ${q.problem} No marker here has been checked against an infant’s own report, because there is none.`};
 }});

/* =========================== sentience-markers =========================== */
const K7_CRIT=[['Has nociceptors','(damage sensors)'],['Brain regions that','integrate the senses'],['Nociceptors wired','to those regions'],['Painkillers change','its responses'],['Trades threat','against reward'],['Protects a wound','in flexible ways'],['Learns to link','harm with a cue'],['Values pain relief','when injured']];
const K7_grade=n=>n>=7?['very strong evidence',0]:n>=5?['strong evidence',1]:n>=3?['substantial evidence',2]:['weaker, or not yet studied',3];
SCENE({id:'sentience-markers',name:'Eight criteria for sentience',tag:'Birch’s framework, and a law',
 definition:'Sentience is the capacity to have feelings such as pain, pleasure or distress. In 2021 a team led by Jonathan Birch reviewed over 300 studies of cephalopod molluscs and decapod crustaceans against eight criteria, four about the nervous system and four about behaviour, and rated its confidence that each group meets each criterion.',
 example:'The review reported high or very high confidence for 7 of the 8 criteria in octopods, which it called very strong evidence, and for 5 of 8 in true crabs, strong evidence. It recommended that both groups be covered by the UK’s Animal Welfare (Sentience) Act, which became law in 2022 with decapods and cephalopods included.',
 desc:'Eight criterion tiles the learner switches on or off, beside a four-step scale that turns the number of criteria met with high confidence into a grade of evidence, with the report’s findings for octopods and true crabs.',
 research:['Birch, J., Burn, C., Schnell, A., Browning, H. & Crump, A. (2021). Review of the Evidence of Sentience in Cephalopod Molluscs and Decapod Crustaceans. LSE Consulting, London School of Economics.','Animal Welfare (Sentience) Act 2022 (UK), c. 22.','The criteria are markers that raise the probability of sentience, not proofs. The grading is the report’s own convention.'],
 dur:12,hint:'Tap a criterion to mark it as met with high confidence, and watch the grade of evidence change.',
 init:()=>({on:[1,1,0,0,0,0,0,0]}),
 watch(p){const n=Math.min(8,Math.floor(p*9));return {on:range(8).map(i=>i<n?1:0)}},
 ui:[{b:'Octopods in the report: 7',act:'set',arg:7},{b:'True crabs: 5',act:'set',arg:5},{b:'Clear',act:'set',arg:0}],
 on:{tog(s,v){const i=Number(v);s.on[i]=s.on[i]?0:1;return 'keep'},set(s,v){const n=Number(v);s.on=range(8).map(i=>i<n?1:0);s.preset=n;return 'keep'}},
 draw(s,f,X){
  const n=sum(s.on),g=K7_grade(n);let out=heading('How many criteria are met with high confidence?');
  K7_CRIT.forEach((c,i)=>{const x=20+(i%2)*182,y=46+Math.floor(i/2)*60,on=s.on[i];
   out+=hit(X,'tog',i,`Criterion ${i+1}: ${c[0]} ${c[1]}. ${on?'Met':'Not met'}. Press to change.`,R(x,y,174,52,on?C.greenp:'#fff',on?C.green:C.line)+Ci(x+20,y+26,12,on?C.green:'#fff',on?C.green:C.line)+TBF(x+20,y+31,String(i+1),13,on?'#fff':C.muted)+TF(x+40,y+22,c[0],13,C.ink,'start')+TF(x+40,y+39,c[1],13,C.ink,'start'))});
  out+=TF(111,298,'1–4: nervous system',13,C.muted)+TF(293,298,'5–8: behaviour',13,C.muted);
  [['7–8','very strong'],['5–6','strong'],['3–4','substantial'],['0–2','weaker or unstudied']].forEach((r,i)=>{const on=i===g[1],y=46+i*38;out+=R(396,y,184,32,on?C.blue:'#fff',C.blue,6)+TBF(408,y+21,r[0],13,on?'#fff':C.blue,'start')+TF(444,y+21,r[1],13,on?'#fff':C.ink,'start')});
  out+=TBF(488,218,`Met: ${n} of 8`,15,C.ink)+TF(396,244,'The 2021 report found:',13,C.muted,'start')+TF(396,262,'octopods 7 of 8: very strong',13,C.ink,'start')+TF(396,280,'true crabs 5 of 8: strong',13,C.ink,'start');
  out+=TF(300,326,'A low count can mean that nobody has looked yet, not that the feature is absent.',13,C.muted);
  out+=TF(300,348,'UK Animal Welfare (Sentience) Act 2022: covers vertebrates,',13,C.ink)+TF(300,366,'decapod crustaceans and cephalopod molluscs.',13,C.ink);
  return {svg:out,phase:`${n} of 8 criteria marked as met with high confidence: on the report’s scale that is ${g[0]}. ${n===7?'This is the count the report gave for octopods; the tiles lit here are not necessarily the seven it listed.':n===5?'This is the count the report gave for true crabs; the tiles lit here are not necessarily the five it listed.':'The report gave 7 for octopods and 5 for true crabs.'} A marker raises the probability of sentience; none proves it.`};
 }});

const K7_shellAt=(model,shell)=>model==='reflex'?5:shell==='good'?7:4;
SCENE({id:'sentience-markers-tradeoff',name:'The hermit crab’s bargain',tag:'A trade-off is not a reflex',
 definition:'A reflex gives the same response to the same stimulus, whatever else is at stake. A motivational trade-off is different: the animal weighs a harm against something it values, so its response changes with what it stands to lose. Elwood and Appel (2009) tested this by giving hermit crabs small electric shocks inside shells of a kind they prefer or a kind they like less.',
 example:'Crabs in the less-preferred kind of shell were more likely to abandon it after shocks than crabs in the preferred kind. Crabs that had been shocked but stayed were later quicker to move into a new shell when one was offered, so the experience had a lasting effect.',
 desc:'A toy hermit crab in a preferred or a less-liked shell receiving a shock of adjustable strength; it leaves the shell at a threshold that depends on shell quality for a trade-off animal and does not for a pure reflex, shown beside bars for the two thresholds.',
 research:['Elwood, R. W. & Appel, M. (2009). Pain experience in hermit crabs? Animal Behaviour 77, 1243–1246.','Thresholds here are toy numbers chosen to show the difference between a trade-off and a reflex, not the paper’s voltages. A trade-off is one of the eight criteria; it shows flexible weighing, and felt pain remains an inference.'],
 dur:12,hint:'Raise the shock in each kind of shell and note when the crab leaves. Then switch to a pure reflex and repeat.',
 init:()=>({shell:'poor',v:3,model:'trade'}),
 watch(p){return p<.5?{shell:'poor',v:Math.round(p*2*10),model:'trade'}:{shell:'good',v:Math.round((p-.5)*2*10),model:'trade'}},
 ui:[{choose:[['good','Preferred shell'],['poor','Less-liked shell']],label:'Shell',get:s=>s.shell,act:'shell'},{range:'v',label:'Shock strength (toy units)',min:0,max:10,step:1,get:s=>s.v,act:'v'},{choose:[['trade','Weighs it up'],['reflex','Pure reflex']],label:'Kind of animal',get:s=>s.model,act:'model'}],
 on:{shell(s,v){s.shell=v;return 'keep'},v(s,v){s.v=Number(v);return 'keep'},model(s,v){s.model=v;return 'keep'}},
 draw(s){
  const th=K7_shellAt(s.model,s.shell),out_=s.v>=th,good=s.shell==='good',sc=good?'#c9a36a':'#9aa7ad';
  let out=heading(s.model==='trade'?'An animal that weighs harm against value':'An animal that only reacts');
  out+=R(20,250,340,20,'#ead9b8','none',4);
  out+=Ci(140,208,46,sc,C.ink)+P('M140 208 m-26 0 a26 26 0 1 1 26 26 a16 16 0 1 1 -16 -16',C.ink,2.5)+TBF(140,288,good?'preferred shell':'less-liked shell',13,C.ink);
  const cx=out_?280:186,cy=232;
  out+=K7_ell(cx,cy,out_?22:12,out_?12:9,C.coral)+L(cx+10,cy-6,cx+26,cy-18,C.coral,4)+L(cx+10,cy+2,cx+28,cy+2,C.coral,4)+Ci(cx+28,cy-20,5,C.coral)+Ci(cx+31,cy+2,5,C.coral)+Ci(cx+4,cy-12,2.5,C.ink);
  if(out_)out+=P(`M${cx-22} ${cy} q-10 6 -18 2`,C.coral,4)+TBF(268,200,'leaves the shell',13,C.coral);else out+=TBF(232,200,'stays in',13,C.green,'start');
  if(s.v>0)out+=P('M92 150 l12 20 l-10 0 l12 22','#d1a11a',3+s.v*.25)+TBF(84,142,`shock ${s.v}`,13,C.amber);
  else out+=TF(84,142,'no shock',13,C.muted);
  out+=TBF(480,62,'Leaves at shock level',13,C.ink);
  [['good','preferred'],['poor','less-liked']].forEach(([k,l],i)=>{const t=K7_shellAt(s.model,k),x=420+i*84,on=k===s.shell;out+=R(x,230-t*16,52,t*16,on?C.blue:'#cfe0ec','none',4)+TBF(x+26,230-t*16-7,String(t),14,on?C.blue:C.muted)+TF(x+26,248,l,13,on?C.ink:C.muted)});
  out+=L(404,230,572,230,C.line,2)+L(404,230-s.v*16,572,230-s.v*16,C.amber,2,'stroke-dasharray="5 4"')+TF(398,230-s.v*16+4,'now',13,C.amber,'end');
  out+=K7_badge(404,262,'Toy thresholds');
  out+=K7_para(300,312,s.model==='trade'?'Leaving costs more when the shell is a good one, so this animal puts up with more before it goes.':'A reflex has one threshold. What the shell is worth makes no difference to it.',84,{anchor:'middle'});
  out+=K7_para(300,352,'Published finding: crabs in the less-preferred kind of shell were more likely to leave after shocks (Elwood & Appel 2009).',84,{anchor:'middle',fill:C.muted});
  return {svg:out,phase:`Toy model. ${s.model==='trade'?'Weighing animal':'Pure reflex'}, ${good?'preferred':'less-liked'} shell, shock ${s.v}: the crab ${out_?'leaves':'stays'} (it leaves at ${th}). ${s.model==='trade'?'In the preferred shell it holds on until 7, in the less-liked one only until 4. That dependence on what is at stake is what a trade-off means.':'The threshold is 5 in either shell. If real crabs behaved like this, shell quality would not have mattered; it did.'}`};
 }});

const K7_KEY=[
 {t:'In humans, feeling pain depends on the cortex.',reply:'Human cases show what is enough in a human. They do not show what is needed in every animal.',back:'Key answers that the human case is the only one where we know which structures matter, so it is the only firm starting point.'},
 {t:'Fish have no layered cortex and lack the circuits that do this job.',reply:'A different structure might do the same job. Birds have no layered cortex either, yet both declarations include them, and fish have a forebrain region (the pallium) of their own.',back:'Key answers that what counts is the type of circuit, which he argues bird brains have and fish brains lack.'},
 {t:'So the trout’s reactions are reflexes that nothing is felt behind.',reply:'Sneddon’s trout rubbed their lips on the gravel, rocked from side to side and were slow to start feeding again, which is prolonged and unlike a reflex. Morphine reduced these behaviours.',back:'Key answers that complex behaviour can run without awareness, as much human behaviour does.'}];
// 58 receptor positions on the trout’s face, 22 of them nociceptors.
const K7_DOTS=(()=>{const pts=[];let i=0;while(pts.length<58){const a=K7_h(i,3),b=K7_h(i,8);i++;const x=-1+2*a,y=-1+2*b;if(x*x+y*y<1&&!(x<-.35&&x>-.75&&y<-.05&&y>-.6))pts.push([x,y])}return pts})();
SCENE({id:'sentience-markers-fish',name:'Do fish feel pain?',tag:'Sneddon’s trout, Key’s objection',
 definition:'Lynne Sneddon and colleagues (2003) found nociceptors, nerve endings that respond to damage, on the face of the rainbow trout, and showed that a harmful injection to the lips changed the fish’s behaviour for a long time. Brian Key (2016) argued that fish nevertheless cannot feel pain, because they lack the cortical circuits that pain depends on in humans.',
 example:'Of 58 receptors Sneddon’s team recorded on the trout’s face and head, 22 were classed as nociceptors. Trout injected in the lips with bee venom or acetic acid rocked from side to side, rubbed their lips on the gravel and took much longer to start feeding again than fish injected with saline.',
 desc:'A trout’s head with 58 receptor dots, 22 of them marked as nociceptors, above the three steps of Key’s argument; the learner taps a step to read the reply to it and Key’s answer.',
 research:['Sneddon, L. U., Braithwaite, V. A. & Gentle, M. J. (2003). Do fishes have nociceptors? Evidence for the evolution of a vertebrate sensory system. Proceedings of the Royal Society B 270, 1115–1121.','Sneddon, L. U. (2003). The evidence for pain in fish: the use of morphine as an analgesic. Applied Animal Behaviour Science 83, 153–162.','Key, B. (2016). Why fish do not feel pain. Animal Sentience 3(1). Unresolved: the nociceptors and behaviour are robust findings; what they show about feeling is contested. Most of the published commentaries on Key’s paper disagreed with him.'],
 dur:12,hint:'Tap each step of Key’s argument to see the reply and his answer. Decide which step you would question.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(2,Math.floor(p*3))}},
 ui:[{choose:[[0,'Step 1'],[1,'Step 2'],[2,'Conclusion']],label:'Step of the argument',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s,f,X){
  const q=K7_KEY[s.k];let out=heading('The finding, and the argument against');
  out+=P('M24 104 Q60 52 150 56 L226 62 L226 146 L150 152 Q60 156 24 104 Z','#6c8d9f',2,'#dfeaf2')+Ci(92,84,9,'#fff',C.ink)+Ci(93,84,4,C.ink)+P('M26 106 Q44 112 58 108',C.ink,2);
  K7_DOTS.forEach((d,i)=>out+=Ci(100+d[0]*66,104+d[1]*40,2.8,i<22?C.coral:C.blue));
  out+=Ci(250,66,4,C.coral)+TF(260,70,'22 nociceptors',13,C.coral,'start')+Ci(250,86,4,C.blue)+TF(260,90,'36 other receptors',13,C.blue,'start')+TBF(250,112,'58 recorded in all',13,C.ink,'start');
  out+=K7_para(396,62,'Injected lips: rocking, rubbing on gravel, slow return to feeding.',27,{fill:C.ink})+TF(396,134,'Sneddon et al. (2003)',13,C.muted,'start');
  out+=TBF(20,176,'Key (2016):',13,C.ink,'start');
  K7_KEY.forEach((k,i)=>{const x=20+i*190,on=i===s.k;out+=hit(X,'k',i,`${i<2?'Step '+(i+1):'Conclusion'}: ${k.t}`,R(x,184,180,70,on?C.pale:'#fff',on?C.blue:C.line)+TBF(x+10,202,i<2?`Step ${i+1}`:'Conclusion',13,C.blue,'start')+K7_para(x+10,219,k.t,26,{lh:15}))});
  out+=R(20,262,560,112,'#f6f9fb',C.grid)+TBF(30,281,'Reply',13,C.green,'start')+K7_para(78,281,q.reply,76,{lh:16});
  const rl=K7_lines(q.reply,76).length,y2=281+rl*16+8;
  out+=TBF(30,y2,'Key',13,C.coral,'start')+K7_para(78,y2,q.back,76,{lh:16});
  return {svg:out,phase:`${s.k<2?'Step '+(s.k+1):'The conclusion'} of Key’s argument: ${q.t} Reply: ${q.reply} ${q.back} The question is unresolved.`};
 }});

const K7_GRADE=[
 {f:'22 of the 58 receptors on a trout’s face respond to damaging heat, pressure or acid.',src:'Sneddon et al. (2003)',opts:[1,5,8],ans:1,why:'This is anatomy: the damage sensors exist. It says nothing yet about what the brain does with their signals.'},
 {f:'Shocked hermit crabs are more likely to quit a less-preferred shell than a preferred one.',src:'Elwood & Appel (2009)',opts:[2,5,7],ans:5,why:'The response depends on what the crab would lose, so harm is being weighed against value.'},
 {f:'An octopus avoids a chamber where it earlier felt the effects of an acid injection.',src:'Crook (2021)',opts:[1,6,7],ans:7,why:'A neutral place has become linked with harm, which is more than getting used to a stimulus or jumpier after one.'},
 {f:'An injured octopus comes to prefer a chamber where it was given a local anaesthetic.',src:'Crook (2021)',opts:[4,7,8],ans:8,why:'The animal seeks out the place of relief, which shows that the relief matters to it. Criterion 4 asks only whether the drug changes its responses.'},
 {f:'An octopus injected in one arm grooms that spot with its beak.',src:'Crook (2021)',opts:[3,6,8],ans:6,why:'The behaviour is directed at the site of the injury and is not a fixed withdrawal.'}];
const K7_CSHORT=['Nociceptors','Integrative brain regions','Nociceptors wired to them','Painkillers change responses','Trade-off','Flexible self-protection','Learning about harm','Values pain relief'];
SCENE({id:'sentience-markers-grade',name:'Which criterion does it bear on?',tag:'You grade five findings',
 definition:'A finding counts towards sentience only through a particular criterion, and the same animal can be strong on one and unstudied on another. Grading means asking of each finding exactly which criterion it supports, and noticing which criteria are left with nothing.',
 example:'Crook’s octopus experiments bear on three behavioural criteria at once: grooming the wound (flexible self-protection), avoiding the chamber (learning about harm) and preferring the chamber with anaesthetic (valuing pain relief). Sneddon’s receptor recordings bear on one anatomical criterion.',
 desc:'Five published findings shown one at a time with three candidate criteria each; the learner picks the criterion the finding bears on, and a row of eight numbered squares fills in as criteria are matched.',
 research:['Birch, J. et al. (2021). Review of the Evidence of Sentience in Cephalopod Molluscs and Decapod Crustaceans. LSE Consulting.','Sneddon et al. (2003); Elwood & Appel (2009); Crook (2021), as cited in this lesson. The trout is used here for practice: the 2021 review covered cephalopods and decapods, not fish.'],
 dur:12,hint:'Read the finding and tap the criterion it bears on. Press Next finding to move on.',
 init:()=>({i:0,ans:[null,null,null,null,null]}),
 watch(p){const i=Math.min(4,Math.floor(p*5)),u=p*5-i;return {i,ans:K7_GRADE.map((q,j)=>j<i||(j===i&&u>.5)?q.ans:null),sim:true}},
 ui:[{b:'Next finding',act:'next'},{b:'Start again',act:'again'}],
 on:{opt(s,v){s.ans[s.i]=Number(v);return 'keep'},next(s){s.i=(s.i+1)%5;return 'keep'},again(s){s.i=0;s.ans=[null,null,null,null,null];return 'keep'}},
 draw(s,f,X){
  const q=K7_GRADE[s.i],a=s.ans[s.i],ok=a===q.ans;let out=heading('Which criterion does this finding bear on?');
  out+=R(20,44,560,74,'#fff',C.grid)+TBF(32,64,`Finding ${s.i+1} of 5`,14,C.ink,'start')+TF(568,64,q.src,13,C.muted,'end')+K7_para(32,86,q.f,84);
  q.opts.forEach((c,j)=>{const x=20+j*190,sel=a===c;out+=hit(X,'opt',c,`Criterion ${c}: ${K7_CSHORT[c-1]}`,R(x,128,180,58,sel?(ok?C.greenp:C.amberp):'#fff',sel?(ok?C.green:C.amber):C.blue)+TBF(x+12,148,`Criterion ${c}`,13,C.blue,'start')+K7_para(x+12,166,K7_CSHORT[c-1],26))});
  out+=R(20,196,560,84,'#f6f9fb',C.grid);
  if(a===null)out+=TF(300,242,s.sim?'A simulated learner is deciding.':'Tap one of the three criteria.',13,C.muted);
  else if(ok)out+=TBF(32,216,`Criterion ${q.ans}: ${K7_CSHORT[q.ans-1].toLowerCase()}.`,14,C.green,'start')+K7_para(32,236,q.why,84);
  else out+=TBF(32,216,`The review would file it under criterion ${q.ans}: ${K7_CSHORT[q.ans-1].toLowerCase()}.`,13,C.amber,'start')+K7_para(32,236,q.why,84);
  const got=K7_GRADE.filter((g,j)=>s.ans[j]!==null).map(g=>g.ans);
  out+=TF(300,304,'Criteria these five findings bear on',13,C.muted);
  for(let c=1;c<=8;c++){const on=got.includes(c),x=124+(c-1)*45;out+=R(x,314,36,30,on?C.green:'#fff',on?C.green:C.line,6)+TBF(x+18,335,String(c),14,on?'#fff':C.muted)}
  out+=TF(300,366,'Criteria 2, 3 and 4 are untouched by these findings: other studies are needed for those.',13,C.muted);
  const n=s.ans.filter(x=>x!==null).length;
  return {svg:out,phase:a===null?`${q.f} Source: ${q.src}. Which of the three criteria does it bear on?`:`${q.f} It bears on criterion ${q.ans}, ${K7_CSHORT[q.ans-1].toLowerCase()}. ${q.why}${n===5?' All five are graded: they cover criteria 1, 5, 6, 7 and 8, spread over three kinds of animal. No animal here has been shown to meet all eight.':''}`};
 }});

/* =========================== other-people =========================== */
const K7_BEINGS=[
 {n:'Another person',body:'same species, same kind of brain',beh:'says “that hurts”, winces, rubs the toe',lik:'Likeness in body and in behaviour is as high as it gets. This is the case Mill had in mind.'},
 {n:'A chimpanzee',body:'close relative, similar brain',beh:'screams, guards the limb; no words',lik:'Body and behaviour are still much like yours, without speech. The analogy stretches, and most people let it.'},
 {n:'An octopus',body:'distant relative, differently built brain',beh:'grooms the wound, avoids the place',lik:'Little likeness in body is left, so the argument leans almost wholly on behaviour.'}];
SCENE({id:'other-people',name:'The argument from analogy',tag:'One case, generalised',
 definition:'The problem of other minds asks how anyone can know that others have experiences at all. John Stuart Mill’s answer (1865) was an argument from analogy: in my own case I observe that what happens to my body causes feelings, and feelings cause my behaviour. Other people have bodies like mine and behave as I do, so I infer the same middle link in them.',
 example:'You stub your toe, feel pain and wince. A friend stubs a toe and winces. You saw the first link and the last; the feeling in between you supply from your own case. The weakness is that the whole inference rests on a single observed case, your own.',
 desc:'Two rows of three boxes linked by arrows, body, feeling and behaviour: all three are observed for you, while the middle box for another being stays shut however often the learner presses it; counters show cases fully observed and looks inside.',
 research:['Mill, J. S. (1865). An Examination of Sir William Hamilton’s Philosophy, chapter 12.','Wittgenstein, L. (1953). Philosophical Investigations, §293: “how can I generalise the one case so irresponsibly?” Later writers recast the argument as an inference to the best explanation of behaviour. A philosophical argument, not an experiment.'],
 dur:12,hint:'Choose another being, then press its “feeling” box to try to look inside.',
 init:()=>({b:0,tries:0}),
 watch(p){return {b:Math.min(2,Math.floor(p*3)),tries:Math.floor(p*9),sim:true}},
 ui:[{choose:[[0,'Another person'],[1,'A chimpanzee'],[2,'An octopus']],label:'The other',get:s=>s.b,act:'b'},{b:'Look inside',act:'look'}],
 on:{b(s,v){s.b=Number(v);return 'keep'},look(s){s.tries++;return 'keep'}},
 draw(s,f,X){
  const q=K7_BEINGS[s.b];let out=heading('Three links in you, two in everyone else');
  const row=(y,who,a,b,c,open)=>{let o=TBF(20,y+30,who,13,C.ink,'start');
   o+=R(108,y,150,48,C.pale,C.blue)+K7_para(183,y+(a.length>22?20:29),a,22,{anchor:'middle',lh:16})+arrow(262,y+24,296,y+24,C.muted,2.5);
   const mid=R(300,y,130,48,open?C.coralp:'#fff',open?C.coral:C.muted,8,open?'':'stroke-dasharray="6 5"')+(open?K7_para(365,y+28,b,18,{anchor:'middle'}):TBF(365,y+31,'?',22,C.muted));
   o+=open?mid:hit(X,'look','','The feeling of the other. Press to try to look inside.',mid);
   o+=arrow(434,y+24,468,y+24,C.muted,2.5)+R(472,y,112,48,C.pale,C.blue)+K7_para(528,y+(c.length>16?20:29),c,16,{anchor:'middle',lh:16});return o};
  out+=TF(183,56,'body',13,C.muted)+TF(365,56,'feeling',13,C.muted)+TF(528,56,'behaviour',13,C.muted);
  out+=row(64,'You','you stub your toe','you feel pain','you wince',true);
  out+=row(132,s.b===0?'A friend':s.b===1?'A chimp':'An octopus',s.b===0?'stubs a toe':s.b===1?'hurts a hand':'hurts an arm','',s.b===0?'winces':s.b===1?'screams':'grooms it',false);
  out+=R(20,196,560,68,'#f6f9fb',C.grid)+TBF(32,216,q.n,14,C.ink,'start')+TF(32,236,'Body: '+q.body,13,C.ink,'start')+TF(32,254,'Behaviour: '+q.beh,13,C.ink,'start');
  out+=counter(20,274,'Cases with all three links observed','1 (your own)',C.coral,270)+counter(310,274,'Looks inside another · feelings seen',`${s.tries} · 0`,C.blue,270);
  out+=K7_para(300,338,q.lik,84,{anchor:'middle'})+TF(300,375,'An argument, not an experiment: its weak point is the sample of one.',13,C.muted);
  return {svg:out,phase:`${s.sim?'Simulated learner. ':''}${q.n}: ${q.lik} ${s.tries?`You have looked ${s.tries} time${s.tries===1?'':'s'} and seen no feeling: only body and behaviour can be observed from outside.`:'Press the shut box to try to observe the feeling directly.'} However many others you meet, the number of cases in which you observed all three links stays at 1.`};
 }});

const K7_BOX=['a beetle','a pebble','nothing','something that keeps changing'];
SCENE({id:'other-people-beetle',name:'The beetle in the box',tag:'Wittgenstein’s thought experiment',
 definition:'Wittgenstein imagined that everyone has a box with something in it that they call a “beetle”. No one can look into anyone else’s box, and each says they know what a beetle is only from their own. The word still has a use in their shared language, he argued, so its meaning cannot come from the hidden thing, which could be different in every box, or absent.',
 example:'If your box held a pebble and mine held nothing, we would still agree in every conversation about “beetles”. Wittgenstein’s target was the idea that words such as “pain” get their meaning by each person pointing inwardly at a private object. He did not deny that people feel pain.',
 desc:'Four people, each with a box whose contents the learner can change between a beetle, a pebble, nothing and something that keeps changing; a short conversation about beetles is stepped through and comes out the same whatever is in the boxes.',
 research:['Wittgenstein, L. (1953). Philosophical Investigations, §293 (the beetle) and §304 (a sensation “is not a something, but not a nothing either”). Blackwell.','A thought experiment about meaning. Best objection: many philosophers hold that it leaves out the very thing in question, what the experience is like for its owner.'],
 dur:12,hint:'Tap a box to change what is in it, then step through the conversation and see whether anything changes.',
 init:()=>({box:[0,1,2,3],changes:0}),
 trace(s){return [
  {k:0,say:'Four people, four boxes. Only you can see inside all of them; each of them sees only their own. In Try it, tap a box to change its contents.'},
  {k:1,say:'Ana says: “I have a beetle.” She is talking about whatever is in her box.'},
  {k:2,say:'Ben says: “So have I.” He cannot compare his with hers, and does not need to.'},
  {k:3,say:'Cy and Di agree. All four use the word in the same way, on the same occasions.'},
  {k:4,say:`The conversation runs without a hitch, although the boxes hold ${[...new Set(s.box)].length===1?'the same thing':[...new Set(s.box)].length+' different things'}. Wittgenstein’s conclusion: whatever is in the box plays no part in what the word means.`}]},
 ui:[{b:'Put a beetle in every box',act:'same'},{b:'Mix the boxes',act:'mix'}],
 on:{box(s,v){const i=Number(v);s.box[i]=(s.box[i]+1)%4;s.changes++;return 'keep'},same(s){s.box=[0,0,0,0];s.changes++;return 'keep'},mix(s){s.box=shuffled([0,1,2,3],nextSeed());s.changes++;return 'keep'}},
 draw(s,f,X){
  const k=f?f.k:0,names=['Ana','Ben','Cy','Di'],says=['“I have a beetle.”','“So have I.”','“Mine is in my box.”','“Mine too.”'];
  let out=heading('Does it matter what is in the box?');
  names.forEach((nm,i)=>{const x=90+i*140,c=s.box[i],spoke=k>=4||(i===0&&k>=1)||(i===1&&k>=2)||(i>=2&&k>=3);
   if(spoke)out+=R(x-64,46,128,28,'#fff',C.blue,12)+TF(x,65,says[i],13,C.ink);
   out+=Ci(x,104,16,'#f1d6c3',C.ink)+P(`M${x-22} 150 Q${x} 112 ${x+22} 150`,C.ink,2.5,C.pale)+TBF(x,170,nm,13,C.ink);
   let inner=R(x-34,182,68,52,'#fff',C.ink,6)+L(x-34,182,x+34,182,C.ink,4);
   if(c===0)inner+=K7_ell(x,210,13,9,C.dark)+L(x,201,x,219,'#fff',1.5)+Ci(x+14,210,4,C.dark)+L(x-8,202,x-14,196,C.dark,2)+L(x-8,218,x-14,224,C.dark,2)+L(x+4,202,x+8,196,C.dark,2)+L(x+4,218,x+8,224,C.dark,2);
   else if(c===1)inner+=K7_ell(x,212,14,10,'#9aa7ad','#6c7f88');
   else if(c===3)inner+=Ci(x-10,212,6,C.purple)+R(x-2,205,13,13,C.amber,'none',2)+P(`M${x+16} 218 l7 -13 l7 13 Z`,C.green,2,C.green);
   out+=hit(X,'box',i,`${nm}’s box holds ${K7_BOX[c]}. Press to change it.`,inner)+K7_para(x,252,c===3?'keeps changing':K7_BOX[c],16,{anchor:'middle',fill:C.muted})});
  out+=TF(300,280,'Only you can see into all four boxes. Each of them sees only their own.',13,C.muted);
  out+=counter(20,292,'Times you changed a box',s.changes,C.blue,270)+counter(310,292,'Conversations that came out differently','0',C.coral,270);
  out+=TF(300,358,k>=4?'Same words, same agreement, whatever the boxes hold.':'Step through the conversation.',13,k>=4?C.green:C.muted);
  return {svg:out,phase:(f&&f.say)||''};
 }});

const K7_COL={red:'#c8452f',green:'#3b8f4a',yellow:'#e8c62c',blue:'#2f5fb0'};
const K7_OBJ=[['tomato','red'],['leaf','green'],['lemon','yellow'],['blueberry','blue']];
const K7_MAP={same:{},rg:{red:'green',green:'red'},yb:{yellow:'blue',blue:'yellow'}};
const K7_TESTS=[
 {t:'Name it',q:'“What colour is a tomato?”',same:'Both say “red”. Each learned that word for whatever tomatoes look like to them.'},
 {t:'Match a chip',q:'“Which paint chip matches the lemon?”',same:'Both pick the same chip. Matching compares two outside things, and a swap changes both alike.'},
 {t:'Pick the ripe one',q:'“Which tomato is ripe?”',same:'Both pick the same fruit. Ripe and unripe still look different to each of them.'},
 {t:'Order by lightness',q:'“Put the four in order, lightest first.”',same:'Both give the same order.',diff:'The orders differ. To you a lemon is lightest; to Sam, who sees lemons as you see blueberries, it comes out dark. In this toy the swap shows.'}];
const K7_differs=(m,i)=>m==='yb'&&i===3;
SCENE({id:'other-people-spectrum',name:'The inverted spectrum',tag:'You swap the colours and test',
 definition:'John Locke (1690) asked whether the idea a violet produces in one person’s mind might be the same as the idea a marigold produces in another’s. If two people’s colour experiences were swapped from birth, each would have learned the same words for the same things, so no question about colour would tell them apart. The case is used to argue that what an experience is like goes beyond what it does.',
 example:'Suppose that tomatoes look to Sam the way leaves look to you, and always have. Sam calls tomatoes “red”, stops at red lights and matches paint as you do. Critics reply that real colour experience is lopsided, for example strong yellow is lighter than strong blue, so some swaps would show up in behaviour after all.',
 desc:'Four objects with their outer colour, your inner colour and Sam’s inner colour under a chosen swap, above four behavioural tests the learner runs; each test reports whether you and Sam give the same answer.',
 research:['Locke, J. (1690). An Essay Concerning Human Understanding, book II, chapter 32, §15.','Hardin, C. L. (1988). Color for Philosophers. Hackett; Palmer, S. E. (1999). Color, consciousness, and the isomorphism constraint. Behavioral and Brain Sciences 22, 923–943. They argue that asymmetries in colour experience make most swaps detectable; Palmer treats a red–green reversal as the likeliest to escape detection.','A thought experiment with a toy of four tests. Whether any undetectable inversion is really possible is disputed.'],
 dur:12,hint:'Choose a swap for Sam, then tap each test. Try all three settings.',
 init:()=>({m:'rg',ran:[0,0,0,0],last:-1}),
 watch(p){const m=p<.5?'rg':'yb',u=(p<.5?p:p-.5)*2,n=Math.min(4,Math.floor(u*5));return {m,ran:range(4).map(i=>i<n?1:0),last:n-1}},
 ui:[{choose:[['same','No swap'],['rg','Red ↔ green'],['yb','Yellow ↔ blue']],label:'Sam’s inner colours',get:s=>s.m,act:'m'},{b:'Run all four tests',act:'all'}],
 on:{m(s,v){s.m=v;s.ran=[0,0,0,0];s.last=-1;return 'keep'},test(s,v){const i=Number(v);s.ran[i]=1;s.last=i;return 'keep'},all(s){s.ran=[1,1,1,1];s.last=3;return 'keep'}},
 draw(s,f,X){
  let out=heading('Same words, same choices: same experience?');
  out+=TF(20,76,'The object',13,C.muted,'start')+TF(20,120,'Looks to you',13,C.muted,'start')+TF(20,164,'Looks to Sam',13,C.muted,'start')+TF(20,200,'Both call it',13,C.muted,'start');
  K7_OBJ.forEach((o,i)=>{const x=150+i*112,inner=K7_MAP[s.m][o[1]]||o[1],sw=inner!==o[1];
   out+=TBF(x+35,54,o[0],13,C.ink)+R(x,60,70,26,K7_COL[o[1]],'none',6)+R(x,104,70,26,K7_COL[o[1]],'none',6)+R(x,148,70,26,K7_COL[inner],sw?C.ink:'none',6)+TBF(x+35,200,'“'+o[1]+'”',13,C.ink)});
  K7_TESTS.forEach((t,i)=>{const x=20+i*142,ran=s.ran[i],d=K7_differs(s.m,i);
   out+=hit(X,'test',i,`Test: ${t.t}. ${ran?(d?'Different answers':'Same answer'):'Press to run.'}`,R(x,214,134,50,ran?(d?C.coralp:C.greenp):'#fff',ran?(d?C.coral:C.green):C.blue)+TBF(x+67,234,t.t,13,C.ink)+TF(x+67,253,ran?(d?'different answers':'same answer'):'tap to run',13,ran?(d?C.coral:C.green):C.muted))});
  const n=sum(s.ran),same=range(4).filter(i=>s.ran[i]&&!K7_differs(s.m,i)).length;
  out+=R(20,272,560,66,'#f6f9fb',C.grid);
  if(s.last>=0){const t=K7_TESTS[s.last],d=K7_differs(s.m,s.last);out+=TBF(32,291,t.q,13,C.ink,'start')+K7_para(32,310,d?t.diff:t.same,84,{fill:d?C.coral:C.ink})}
  else out+=TF(300,310,'Tap a test to ask you and Sam the same question.',13,C.muted);
  out+=K7_badge(20,348,'Toy: four tests only')+TBF(590,364,n?`Same answer on ${same} of ${n} tests run`:'No tests run yet',13,same===n?C.green:C.coral,'end');
  const mm=s.m==='same'?'Sam’s colours are not swapped':s.m==='rg'?'Sam’s red and green are swapped':'Sam’s yellow and blue are swapped';
  return {svg:out,phase:`Toy. ${mm}. ${n?`Tests run: ${n}; same answer on ${same}.`:'Run the tests.'} ${n===4?(s.m==='yb'?'The lightness test catches this swap, because experienced yellow is lighter than experienced blue: Hardin and Palmer argue that such asymmetries make most inversions detectable.':s.m==='rg'?'No test here separates you from Sam, although every tomato looks to Sam as a leaf looks to you. Whether a finer test would is disputed.':'With no swap every answer agrees, exactly as with the red–green swap. Behaviour alone does not tell those two cases apart.'):''}`};
 }});
