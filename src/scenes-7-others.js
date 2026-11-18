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
 watch(p){const c=Math.min(2,Math.floor(p*3)),u=p*3-c,pick={};for(let i=0;i<c;i++)pick[i]=K7_CASES[i].fits;if(u>.45)pick[c]=c===2?'low':'low';return {c,pick,sim:true}},
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
  out+=TF(150,56,'surely not',13,C.muted,'start')+TF(380,56,'surely so',13,C.muted,'end')+TF(392,56,'New York 2024',13,C.muted,'start')+TF(552,56,'Cambridge 2012',13,C.muted);
  K7_ANIMALS.forEach((a,i)=>{const y=64+i*31,x=150+s.v[i]*2.3,on=i===s.sel;
   let row=R(16,y,574,28,on?C.pale:'#fff',on?C.blue:'none',6)+(on?TBF:TF)(26,y+19,a[0],13,C.ink,'start')+L(150,y+14,380,y+14,C.line,3)+Ci(x,y+14,7,on?C.blue:C.muted,'#fff');
   if(s.shown){const w=a[1]==='strong'?['strong support',C.green]:a[1]==='possible'?['realistic possibility',C.amber]:['not named',C.muted];row+=TBF(392,y+19,w[0],13,w[1],'start')+TF(552,y+19,a[2]?'named':'—',13,a[2]?C.green:C.muted)}
   else row+=TF(392,y+19,'?',13,C.muted,'start')+TF(552,y+19,'?',13,C.muted);
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
 ['Chimpanzee',6.5,'about 6 to 7',100,'The closest living relatives of humans, with chimpanzees’ sister species the bonobo.'],
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
 research:['Godfrey-Smith, P. (2016). Other Minds: The Octopus, the Sea, and the Deep Origins of Consciousness. Farrar, Straus and Giroux.','Split dates are molecular-clock estimates and vary between studies, the deepest ones most of all; the tree shows that split as a band, not a point. Neuron counts: Herculano-Houzel (2009) for mouse and human; Young (1963) for the octopus.'],
 dur:12,hint:'Tap an animal to trace its line back to the ancestor it shares with us.',
 init:()=>({a:4}),
 watch(p){return {a:Math.min(5,Math.floor(p*6))}},
 ui:[{choose:K7_TREE.map((t,i)=>[i,t[0]==='Chimpanzee'?'Chimp':t[0]==='Honeybee'?'Bee':t[0]]),label:'Animal',get:s=>s.a,act:'a'}],
 on:{a(s,v){s.a=Number(v);return 'keep'}},
 draw(s,f,X){
  const a=K7_TREE[s.a],x0=K7_tx(0),xr=K7_tx(560);let out=heading('How long ago did its line leave ours?');
  out+=R(K7_tx(600),56,K7_tx(520)-K7_tx(600),238,C.amberp,'none',4)+TF(K7_tx(560),312-4,'date uncertain',13,C.amber);
  out+=L(x0,70,xr,70,C.line,3)+TBF(x0+8,75,'Human',13,C.ink,'start');
  // The octopus and the bee share one branch from the root, then part inside the uncertain band.
  const xp=K7_tx(535);
  K7_TREE.forEach((t,i)=>{const xs=K7_tx(t[1]),on=i===s.a,col=on?C.coral:C.line,w=on?4:3;
   if(i<4)out+=L(xs,70,xs,t[3],col,w)+L(xs,t[3],x0,t[3],col,w);
   else out+=L(xr,70,xr,255,on?C.coral:C.line,w)+L(xr,255,xp,255,on?C.coral:C.line,w)+L(xp,255,xp,t[3],col,w)+L(xp,t[3],x0,t[3],col,w);
   out+=hit(X,'a',i,`${t[0]}: last shared ancestor with humans ${t[2]} million years ago.`,R(x0+4,t[3]-13,98,26,on?C.coralp:'#fff','none',6)+(on?TBF:TF)(x0+8,t[3]+5,t[0],13,on?C.coral:C.ink,'start'))});
  const xs=s.a<4?K7_tx(a[1]):xr;out+=L(x0,70,xs,70,C.coral,4)+Ci(xs,70,6,C.coral,'#fff');
  out+=L(K7_tx(600),300,x0,300,C.line,2);
  [0,100,200,300,400,500,600].forEach(t=>out+=L(K7_tx(t),300,K7_tx(t),306,C.line,1.5)+TF(K7_tx(t),324-(t===600||t===500?0:0),t===0?'today':String(t),13,C.muted));
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
 watch(p){const nb=Math.floor(p*7.2);return {calm:K7_biasSim(Math.min(3,nb),K7_BIAS.calm,41),shaken:K7_biasSim(clamp(nb-3,0,3),K7_BIAS.shaken,97),sim:true}},
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
  out+=K7_para(32,306,'Published pattern: sugared bees entered the in-between flower sooner; with a dopamine blocker they did not.',84,{fill:C.ink});
  out+=K7_para(32,346,'The authors reported checks that the sugar had not simply made the bees faster or more active.',84,{fill:C.muted});
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
  out+=R(20,44,560,72,'#fff',C.grid)+TBF(32,64,q.t,14,C.ink,'start')+TF(568,64,q.src,13,C.muted,'end')+TF(32,86,'Richer reading: '+q.feel+'.',13,C.purple,'start')+TF(32,106,s.sim?'A simulated learner is matching.':'Tap one of the three sober readings below.',13,C.muted,'start');
  K7_EXPL.forEach((e,j)=>{const x=20+j*190,sel=a===j;out+=hit(X,'ex',j,'Sober reading: '+e,R(x,126,180,92,sel?(ok?C.greenp:C.amberp):'#fff',sel?(ok?C.green:C.amber):C.blue)+TBF(x+12,146,'No feeling needed',13,C.blue,'start')+K7_para(x+12,166,e,25))});
  out+=R(20,228,560,96,'#f6f9fb',C.grid);
  if(a===null)out+=TF(300,280,'Nothing matched yet.',13,C.muted);
  else if(ok)out+=TBF(32,248,'That is the reading usually offered.',14,C.green,'start')+K7_para(32,268,q.more,84);
  else out+=TBF(32,248,'That reading is usually offered for another finding.',14,C.amber,'start')+K7_para(32,268,'It could be stretched to fit, which is part of the difficulty: sober readings are flexible. Try another.',84);
  const n=K7_FIND.filter((x,j)=>s.pick[j]===x.ex).length;
  out+=TF(300,346,`Matched ${n} of 3 · Contested: every finding has a reading with feeling and one without.`,13,C.ink)+TF(300,366,'Barron & Klein (2016) argue for insect experience; Adamo (2016) and others doubt it.',13,C.muted);
  return {svg:out,phase:a===null?`${q.t} (${q.src}). The richer reading is ${q.feel}. Which explanation without feeling is usually set against it?`:ok?`${q.t}: set against “${q.feel}” is the reading that ${K7_EXPL[q.ex].charAt(0).toLowerCase()+K7_EXPL[q.ex].slice(1)} ${q.more}${n===3?' All three are matched. None of the three experiments rules its sober reading out, which is why insect emotion remains contested.':''}`:'That sober reading is usually offered for a different finding. Sober readings can often be stretched to fit, which is one reason the debate is hard to settle.'};
 }});
