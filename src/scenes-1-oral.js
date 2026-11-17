/* ===================== Tripitaka era 1 · Spoken teaching (c. 5th century BCE onward) ===================== */
// Evidence label for every scene: traditional account, established finding, or debated among scholars.
const P1_TAGS={traditional:['Traditional account',C.amber,C.amberp],established:['Established',C.green,C.greenp],debated:['Debated',C.purple,C.purplep]};
function P1_head(title,tag){const S=P1_TAGS[tag],w=S[0].length*7.6+22;return heading(title,50)+R(594-w,3,w,22,S[2],S[1],11)+TBF(594-w/2,18,S[0],12,S[1])}
function P1_wrap(t,n){const out=[];let cur='';for(const w of String(t).split(' ')){if(cur&&(cur+' '+w).length>n){out.push(cur);cur=w}else cur=cur?cur+' '+w:w}if(cur)out.push(cur);return out}
function P1_card(x,y,w,title,text,col=C.blue){const ls=P1_wrap(text,Math.floor((w-22)/6.7));
 let out=R(x,y,w,32+ls.length*18,'#fff',C.grid,8)+TBF(x+11,y+21,title,13,col,'start');
 ls.forEach((l,i)=>{out+=TF(x+11,y+41+i*18,l,13,C.ink,'start')});return out}
const P1_chip=(x,y,w,txt,on,col=C.blue)=>R(x,y,w,28,on?col:'#fff',on?col:C.line,8)+TBF(x+w/2,y+19,txt,13,on?'#fff':C.ink);
// A seated reciter drawn as a simple figure (head and shoulders), never a Buddha image.
const P1_person=(x,y,col=C.blue,r=7)=>Ci(x,y-r-3,r*.62,col)+P(`M${fmt(x-r)} ${fmt(y+r)}Q${fmt(x)} ${fmt(y-r*1.2)} ${fmt(x+r)} ${fmt(y+r)}Z`,col,1,col);

/* ---------- Lesson: oral-recitation ---------- */
// Toy model of transmission. Each generation every reciter relearns the agreed text and slips on each
// syllable with probability e. The group keeps a reading only if most reciters agree on it.
function P1_sim(n,g,e,seed){
 const N=40,r=rng(seed*977+n*31+7);let solo=new Array(N).fill(0),grp=new Array(N).fill(0);const hist=[[0,0]];
 for(let t=1;t<=g;t++){
  solo=solo.map(v=>v||r()<e?1:0);
  grp=grp.map(v=>{if(v)return 1;let wrong=0;for(let k=0;k<n;k++)if(r()<e)wrong++;return wrong>n/2?1:0});
  hist.push([sum(solo),sum(grp)]);
 }
 return {solo,grp,hist,N};
}
SCENE({id:'oral-recitation',name:'Reciting together',tag:'A group catches one person’s slips',
 definition:'For several centuries the teachings were not written down. They were memorised and recited aloud, usually by groups chanting in unison. Communal recitation works as error-checking: one person’s slip is outvoted by everyone else’s memory.',
 example:'With a 3% chance of slipping on each syllable, a lone reciter’s text drifts steadily. A group of five only loses a syllable when three of them slip on the same one in the same generation, which is very rare if their slips are independent. Real slips can be shared, such as a mistake learned from one teacher, so this is a model of the principle, not a measured rate.',
 desc:'Two strips of forty syllables: one handed down by a single reciter, one by a group. Changed syllables are marked, and a small chart shows how the changes build up over the generations.',
 research:['Anālayo (2022). Early Buddhist Oral Tradition: Textual Formation and Transmission. Wisdom Publications.','Wynne, A. (2004). The oral transmission of early Buddhist literature. Journal of the International Association of Buddhist Studies 27(1), 97–127.','Allon, M. (1997). Style and Function: A Study of the Dominant Stylistic Features of the Prose Portions of Pāli Canonical Sutta Texts and Their Mnemonic Function. Tokyo.'],
 dur:12,hint:'Change the group size, the slip rate and the number of generations. Press New run for a different set of slips. The model is illustrative, not fitted to data.',
 init:()=>({n:5,g:20,e:3,seed:1}),
 watch(p){return {n:p<.5?3:9,g:Math.round((p<.5?p*2:(p-.5)*2)*30),e:3,seed:2}},
 ui:[{choose:[[3,'3 reciters'],[5,'5'],[9,'9']],label:'Group',get:s=>s.n,act:'n'},{range:'g',label:'Generations',min:0,max:30,step:1,get:s=>s.g,act:'g',show:v=>v+''},{range:'e',label:'Slip rate',min:1,max:8,step:1,get:s=>s.e,act:'e',show:v=>v+'% per syllable'},{b:'New run',act:'seed'}],
 on:{n(s,v){s.n=+v},g(s,v){s.g=+v},e(s,v){s.e=+v},seed(s){s.seed=s.seed%9+1}},
 draw(s){
  const m=P1_sim(s.n,s.g,s.e/100,s.seed);let out=P1_head('Forty syllables, handed down by voice','established');
  const strip=(y,arr,lab,col)=>{let o=TBF(40,y-8,lab,13,C.ink,'start');arr.forEach((v,i)=>{o+=R(40+i*11,y,9.2,24,v?col:'#e6eef3','none',3)});return o+TF(566,y+17,sum(arr)+' changed',13,sum(arr)?col:C.muted,'end')};
  out+=strip(92,m.solo,'One reciter alone',C.coral);
  out+=strip(152,m.grp,`A group of ${s.n} reciting together`,C.blue);
  // chart
  const x0=70,y0=206,w=300,h=110,mx=Math.max(8,...m.hist.map(q=>q[0]));
  out+=R(x0,y0,w,h,'#fff',C.grid,6)+TF(x0-6,y0+10,String(mx),12,C.muted,'end')+TF(x0-6,y0+h,'0',12,C.muted,'end')+TF(x0+w/2,y0+h+16,'generations (0 to '+s.g+')',12,C.muted)+TF(x0+6,y0+14,'changed syllables',12,C.muted,'start');
  const path=k=>m.hist.map((q,i)=>(i?'L':'M')+fmt(x0+(m.hist.length>1?i/(m.hist.length-1):0)*w)+' '+fmt(y0+h-q[k]/mx*h)).join('');
  if(s.g>0)out+=P(path(0),C.coral,2.4)+P(path(1),C.blue,2.4);
  for(let i=0;i<s.n;i++)out+=P1_person(410+(i%5)*34,236+Math.floor(i/5)*44,C.blue);
  out+=P1_person(410,326,C.coral)+TF(430,330,'alone',12,C.muted,'start')+TF(410,208,'the group',12,C.muted,'start');
  return {svg:out,phase:`After ${s.g} generation${s.g===1?'':'s'} at a ${s.e}% slip rate, the lone reciter has changed ${sum(m.solo)} of 40 syllables and the group of ${s.n} has changed ${sum(m.grp)}. Agreement among many memories is what keeps a spoken text stable. This is a simple model, not a measurement.`};
 }});

const P1_STEPS=[
 ['An elder is asked','A senior monk questions the one who knows a body of teaching best: where was this said, to whom, about what?'],
 ['One recites','That person recites the passage from memory while the whole assembly listens.'],
 ['The assembly checks','Listeners who remember it differently can speak up; the wording is settled together.'],
 ['All recite together','The assembly chants the agreed text in unison. The word for this, saṅgīti, means “singing together”.']];
SCENE({id:'oral-recitation-sangiti',name:'Saṅgīti: singing together',tag:'How a recitation is described',
 definition:'Saṅgīti is the Pali word usually translated “council”. Literally it means reciting or singing together: an assembly agrees a text by chanting it in unison.',
 example:'In the traditional account of the first recitation, Mahākassapa questions Upāli about the monastic rules and Ānanda about the discourses, and the assembly then recites them together.',
 desc:'A ring of seated reciters with one elder asking and one answering, shown in four steps from question to unison chanting.',
 research:['Vinaya Piṭaka, Cullavagga XI (the account of the first recitation), trans. I. B. Horner (1952), The Book of the Discipline, vol. 5. Pali Text Society.','Anālayo (2022). Early Buddhist Oral Tradition. Wisdom Publications.','Gombrich, R. (1990). How the Mahāyāna began. The Buddhist Forum 1, 21–30 (on why oral texts need an organised community to survive).'],
 dur:10,hint:'Step through the four stages. The procedure is as the Vinaya describes it; scholars treat the details as tradition, not as a record.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(3,Math.floor(p*4))}},
 ui:[{b:'Back',act:'back'},{b:'Next step',act:'next'}],
 on:{back(s){s.k=Math.max(0,s.k-1)},next(s){s.k=Math.min(3,s.k+1)}},
 draw(s){
  let out=P1_head('Step '+(s.k+1)+' of 4: '+P1_STEPS[s.k][0],'traditional');
  const cx=170,cy=210,n=14;
  for(let i=0;i<n;i++){const a=Math.PI*(.12+i/(n-1)*.76),x=cx+Math.cos(a)*130,y=cy+10+Math.sin(a)*86;
   const speaking=s.k===3||(s.k===2&&(i===3||i===9));out+=P1_person(x,y,speaking?C.blue:'#9fb6c4')}
  out+=P1_person(cx-44,cy-30,s.k===0?C.amber:'#9fb6c4',9)+TF(cx-44,cy-58,'elder asking',12,C.muted);
  out+=P1_person(cx+44,cy-30,s.k===1||s.k===3?C.coral:'#9fb6c4',9)+TF(cx+44,cy-58,'reciter',12,C.muted);
  if(s.k===0)out+=P(`M${cx-28} ${cy-34}Q${cx} ${cy-52} ${cx+28} ${cy-34}`,C.amber,2,'none','stroke-dasharray="5 4"');
  if(s.k===1)for(let r=1;r<=3;r++)out+=P(`M${cx+44-r*16} ${cy-6+r*10}Q${cx+44} ${cy+r*16} ${cx+44+r*16} ${cy-6+r*10}`,C.coral,1.6);
  if(s.k===3)out+=TF(cx,cy+118,'everyone, in unison',12,C.blue);
  P1_STEPS.forEach((q,i)=>{out+=R(350,78+i*34,230,28,i===s.k?C.pale:'#fff',i===s.k?C.blue:C.grid,8)+TF(362,97+i*34,(i+1)+'. '+q[0],13,i===s.k?C.ink:C.muted,'start')});
  P1_wrap(P1_STEPS[s.k][1],34).forEach((l,i)=>{out+=TF(350,236+i*18,l,13,C.ink,'start')});
  return {svg:out,phase:P1_STEPS[s.k][1]+' This is the procedure as the Vinaya tells it.'};
 }});

const P1_PATHA={
 samhita:{n:'Continuous',note:'The running text, as it is used in ritual.',f:w=>[w]},
 pada:{n:'Word by word',note:'Each word alone, with the sound-joins between words undone.',f:w=>w.map(x=>[x])},
 krama:{n:'Krama (steps)',note:'Overlapping pairs: 1 2, 2 3, 3 4.',f:w=>w.slice(0,-1).map((x,i)=>[x,w[i+1]])},
 jata:{n:'Jaṭā (braid)',note:'Each pair forwards, backwards, forwards: 1 2, 2 1, 1 2.',f:w=>w.slice(0,-1).map((x,i)=>[x,w[i+1],w[i+1],x,x,w[i+1]])},
 ghana:{n:'Ghana (dense)',note:'1 2, 2 1, 1 2 3, 3 2 1, 1 2 3, then start again from word 2.',f:w=>w.slice(0,-2).map((x,i)=>[x,w[i+1],w[i+1],x,x,w[i+1],w[i+2],w[i+2],w[i+1],x,x,w[i+1],w[i+2]])}};
SCENE({id:'oral-recitation-vedic',name:'A comparison: Vedic recitation',tag:'Another way to protect a spoken text',
 definition:'Brahmin reciters of the Vedas protected their texts with recitation patterns that repeat the words in fixed permutations. A slip in any one pattern shows up against the others, like a checksum.',
 example:'For five words, the krama pattern recites 1 2, 2 3, 3 4, 4 5. The ghana pattern recites thirteen words for every step forward.',
 desc:'Five numbered word tiles laid out in the order a chosen recitation pattern speaks them, with a count of how many words are spoken in all.',
 research:['Staal, F. (1986). The Fidelity of Oral Tradition and the Origins of Science. North-Holland.','Scharfe, H. (2002). Education in Ancient India. Brill (chapter on memorisation).','Wynne, A. (2004). JIABS 27(1), 97–127; Cousins, L. S. (1983). Pali oral literature. In Buddhist Studies Ancient and Modern, 1–11 (two views of how fixed the Buddhist wording was).'],
 dur:10,hint:'Choose a pattern. Early Buddhist reciters knew of these Vedic methods but relied mainly on group recitation, stock phrases and lists.',
 init:()=>({pat:'krama'}),
 watch(p){return {pat:['samhita','pada','krama','jata','ghana'][Math.min(4,Math.floor(p*5))]}},
 ui:[{choose:[['samhita','Continuous'],['pada','Word by word'],['krama','Krama'],['jata','Jaṭā'],['ghana','Ghana']],label:'Pattern',get:s=>s.pat,act:'pat'}],
 on:{pat(s,v){s.pat=v}},
 draw(s){
  const Q=P1_PATHA[s.pat],groups=Q.f([1,2,3,4,5]),cols=[C.blue,C.green,C.amber,C.purple,C.coral];let out=P1_head('Five words, recited as: '+Q.n,'established');
  let x=40,y=84,total=0;
  groups.forEach(g=>{const w=g.length*21+8;if(x+w>560){x=40;y+=40}out+=R(x,y,w,30,'#f6f9fb',C.grid,6);g.forEach((v,i)=>{out+=R(x+5+i*21,y+5,19,20,cols[v-1],'none',4)+TBF(x+14.5+i*21,y+20,String(v),12,'#fff')});x+=w+8;total+=g.length});
  out+=TF(40,y+56,Q.note,13,C.ink,'start')+TBF(40,y+80,`${total} words spoken for a 5-word line`,13,C.blue,'start');
  out+=P1_card(40,254,250,'Vedic reciters','Fixed every syllable and accent, trained from childhood within families.',C.amber);
  out+=P1_card(310,254,250,'Early Buddhist reciters','Recited in groups and leaned on repeated formulas and numbered lists.',C.blue);
  return {svg:out,phase:`${Q.n}: ${Q.note} Scholars disagree on how fixed the early Buddhist wording was: Wynne argues reciters aimed at word-for-word accuracy, while Cousins saw more room for variation in performance.`};
 }});

/* ---------- Lesson: memory-techniques ---------- */
// Illustrative skeletons of three discourses. 's' = stock block reused across many discourses, 'u' = unique to this one.
const P1_STOCK={open:'Opening: “Thus have I heard”',place:'Where the teacher was staying',approach:'A visitor arrives and greets',ask:'The visitor asks',refrain:'Refrain, repeated word for word',simile:'A stock simile',close:'Closing: the listeners are glad'};
const P1_DISC={
 a:{n:'A dialogue with a visitor',b:[['s','open'],['s','place'],['s','approach'],['s','ask'],['u','First point'],['s','refrain'],['u','Second point'],['s','refrain'],['u','Third point'],['s','refrain'],['s','close']]},
 b:{n:'A teaching to the monks',b:[['s','open'],['s','place'],['u','A list of four things'],['u','Item one explained'],['s','refrain'],['u','Item two explained'],['s','refrain'],['s','simile'],['s','close']]},
 c:{n:'A story with a moral',b:[['s','open'],['s','place'],['u','A story is told'],['u','The story continues'],['s','simile'],['u','What it shows'],['s','close']]}};
SCENE({id:'memory-techniques',name:'Stock phrases',tag:'The same blocks, used again and again',
 definition:'A formula, or stock phrase, is a fixed passage reused wherever the same thing is described: an arrival, a greeting, a stage of practice. Because the blocks repeat, a reciter who knows them has much less new material to learn for each discourse.',
 example:'Most discourses open with evaṃ me sutaṃ, “Thus have I heard”, then name a place. Mark Allon’s 1997 study of one long discourse found that the great majority of its prose is repeated in some way.',
 desc:'One discourse drawn as a row of blocks, with reused stock blocks in one colour and material unique to that discourse in another, and the share that is stock.',
 research:['Allon, M. (1997). Style and Function. Tokyo: International Institute for Buddhist Studies (repetition measured in the Udumbarika-sīhanāda Sutta).','Anālayo (2007). Oral dimensions of Pāli discourses: pericopes, other mnemonic techniques and the oral performance context. Canadian Journal of Buddhist Studies 3, 5–33.','Gethin, R. (1992). The mātikās: memorization, mindfulness and the list. In J. Gyatso (ed.), In the Mirror of Memory, 149–172. SUNY Press.'],
 dur:10,hint:'Choose a discourse outline and switch the highlight on. The outlines are simplified illustrations of typical structures, not transcripts.',
 init:()=>({d:'a',hl:1}),
 watch(p){return {d:['a','b','c'][Math.min(2,Math.floor(p*3))],hl:(p*3)%1>.35?1:0}},
 ui:[{choose:[['a','Dialogue'],['b','Teaching'],['c','Story']],label:'Outline',get:s=>s.d,act:'d'},{b:'Highlight stock phrases',act:'hl'}],
 on:{d(s,v){s.d=v},hl(s){s.hl=s.hl?0:1}},
 draw(s){
  const D=P1_DISC[s.d],st=D.b.filter(q=>q[0]==='s').length;let out=P1_head(D.n,'established');
  D.b.forEach((q,i)=>{const col=i%2,x=40+col*270,y=72+Math.floor(i/2)*38,isS=q[0]==='s',on=s.hl&&isS;
   out+=R(x,y,256,30,on?C.pale:s.hl?C.coralp:'#fff',on?C.blue:s.hl?C.coral:C.grid,8)+TF(x+10,y+20,(i+1)+'. '+(isS?P1_STOCK[q[1]]:q[1]),13,C.ink,'start')});
  const y2=72+Math.ceil(D.b.length/2)*38+10;
  out+=R(40,y2,14,14,C.pale,C.blue,3)+TF(60,y2+12,'stock block, reused elsewhere',13,C.muted,'start')+R(300,y2,14,14,C.coralp,C.coral,3)+TF(320,y2+12,'unique to this discourse',13,C.muted,'start');
  out+=T(300,y2+48,`${st} of ${D.b.length} blocks are stock`,15,C.blue);
  return {svg:out,phase:`In this outline ${st} of ${D.b.length} blocks are stock phrases a reciter already knows from other discourses. Only the rest is new. Repetition that looks tedious on the page is what made the text learnable and checkable by ear.`};
 }});

const P1_LISTS=[null,['Ekaka-nipāta','Book of the Ones','Sayings about a single thing'],['Duka-nipāta','Book of the Twos','Calm and insight'],['Tika-nipāta','Book of the Threes','Three kinds of feeling: pleasant, painful, neutral'],['Catukka-nipāta','Book of the Fours','The four noble truths'],['Pañcaka-nipāta','Book of the Fives','The five precepts'],['Chakka-nipāta','Book of the Sixes','The six senses'],['Sattaka-nipāta','Book of the Sevens','The seven factors of awakening'],['Aṭṭhaka-nipāta','Book of the Eights','The noble eightfold path'],['Navaka-nipāta','Book of the Nines','Nine abodes of beings'],['Dasaka-nipāta','Book of the Tens','Ten courses of wholesome action'],['Ekādasaka-nipāta','Book of the Elevens','Eleven benefits of loving-kindness']];
SCENE({id:'memory-techniques-lists',name:'Numbered lists',tag:'Counting as a memory aid',
 definition:'Much of the teaching is packed into numbered lists: four of this, five of that. A number tells the reciter how many items to produce, so a missing one is noticed. One whole collection, the Aṅguttara Nikāya, is arranged by number, from the Ones to the Elevens.',
 example:'If a list is known as “the seven factors” and a reciter produces six, everyone knows one has dropped out.',
 desc:'A ladder of numbers from one to eleven. The chosen number shows its book in the Aṅguttara Nikāya and one well-known list with that many items, drawn as counted dots.',
 research:['Gethin, R. (1992). The mātikās: memorization, mindfulness and the list. In In the Mirror of Memory, 149–172. SUNY Press.','Bodhi, Bhikkhu (2012). The Numerical Discourses of the Buddha: A Translation of the Aṅguttara Nikāya. Wisdom Publications (introduction).','Dīgha Nikāya 33, Saṅgīti Sutta: a discourse that arranges lists from ones to tens.'],
 dur:11,hint:'Move through the numbers. Each shows one example list; the collection holds many lists for every number.',
 init:()=>({n:8}),
 watch(p){return {n:1+Math.min(10,Math.floor(p*11))}},
 ui:[{range:'n',label:'Number',min:1,max:11,step:1,get:s=>s.n,act:'n',show:v=>v+''}],
 on:{n(s,v){s.n=+v}},
 draw(s){
  const Q=P1_LISTS[s.n];let out=P1_head(Q[1],'established');
  for(let i=1;i<=11;i++)out+=R(40+(i-1)*48,74,40,34,i===s.n?C.blue:'#fff',i===s.n?C.blue:C.line,8)+TBF(60+(i-1)*48,97,String(i),15,i===s.n?'#fff':C.ink);
  out+=TF(300,140,Q[0]+' · Aṅguttara Nikāya',13,C.muted)+T(300,178,Q[2],16,C.ink);
  for(let i=0;i<s.n;i++)out+=Ci(300-(s.n-1)*19+i*38,222,13,C.pale,C.blue)+TBF(300-(s.n-1)*19+i*38,227,String(i+1),13,C.blue);
  out+=P1_card(60,262,480,'Why it helps','A numbered list is self-checking. The count is part of the name, so reciter and listeners both know when an item is missing.',C.green);
  return {svg:out,phase:`${Q[1]} (${Q[0]}). One example with ${s.n} item${s.n>1?'s':''}: ${Q[2].toLowerCase()}. The number in a list’s name works as a check on the reciter’s memory.`};
 }});

const P1_WAX={
 fear:{gloss:'afraid, agitated, with hair standing on end',w:[['bhīto',2,'afraid'],['saṃviggo',3,'agitated'],['lomahaṭṭhajāto',6,'hair on end']]},
 old:{gloss:'aged, old, elderly, advanced in years, at the last stage of life',w:[['jiṇṇo',2,'aged'],['vuḍḍho',2,'old'],['mahallako',4,'elderly'],['addhagato',4,'far along'],['vayo-anuppatto',6,'at life’s last stage']]}};
SCENE({id:'memory-techniques-waxing',name:'Waxing syllables',tag:'Short words first, long words last',
 definition:'In strings of near-synonyms, Pali prose tends to put the words in order of syllable count, shortest first. Scholars call this the principle of waxing syllables. The fixed rhythm makes the string hard to say in the wrong order.',
 example:'bhīto saṃviggo lomahaṭṭhajāto: two syllables, three, then six.',
 desc:'A string of Pali near-synonyms drawn as bars whose heights are their syllable counts, in the transmitted order or scrambled.',
 research:['Allon, M. (1997). Style and Function. Tokyo (chapter on the waxing syllable principle).','von Hinüber, O. (1994). Untersuchungen zur Mündlichkeit früher mittelindischer Texte der Buddhisten. Stuttgart: Franz Steiner.','Anālayo (2007). Oral dimensions of Pāli discourses. Canadian Journal of Buddhist Studies 3, 5–33.'],
 dur:9,hint:'Switch between the two strings, and between the transmitted order and a scrambled one. Read the counts along the bottom.',
 init:()=>({k:'old',sc:0}),
 watch(p){return {k:p<.5?'fear':'old',sc:(p*2)%1<.4?1:0}},
 ui:[{choose:[['fear','“afraid…”'],['old','“aged…”']],label:'String',get:s=>s.k,act:'k'},{choose:[[0,'As transmitted'],[1,'Scrambled']],label:'Order',get:s=>s.sc,act:'sc'}],
 on:{k(s,v){s.k=v},sc(s,v){s.sc=+v}},
 draw(s){
  const Q=P1_WAX[s.k],ws=s.sc?shuffled(Q.w,s.k==='old'?5:3):Q.w,n=ws.length,bw=Math.min(100,480/n-12);let out=P1_head(s.sc?'Scrambled: the rhythm stumbles':'Transmitted order: counts never fall','established');
  let ok=true;ws.forEach((q,i)=>{if(i&&q[1]<ws[i-1][1])ok=false});
  ws.forEach((q,i)=>{const x=60+i*(480/n)+(480/n-bw)/2,h=q[1]*26;out+=R(x,270-h,bw,h,ok?C.pale:C.coralp,ok?C.blue:C.coral,6)+TBF(x+bw/2,262-h,String(q[1]),14,ok?C.blue:C.coral)+TF(x+bw/2,290,q[0],13,C.ink)+TF(x+bw/2,308,q[2],12,C.muted)});
  out+=T(300,344,'“'+Q.gloss+'”',14,C.muted);
  return {svg:out,phase:ok?`Syllable counts ${ws.map(q=>q[1]).join(', ')}: each word is as long as or longer than the one before. The swelling rhythm fixes the order in the ear.`:`Syllable counts ${ws.map(q=>q[1]).join(', ')}: a long word before a short one breaks the pattern, and a listener used to the formula would notice.`};
 }});

/* ---------- Lesson: bhanakas ---------- */
const P1_BHAN=[
 ['Dīgha-bhāṇakas','Dīgha Nikāya','34 long discourses',C.blue],
 ['Majjhima-bhāṇakas','Majjhima Nikāya','152 middle-length discourses',C.green],
 ['Saṃyutta-bhāṇakas','Saṃyutta Nikāya','Short discourses grouped by topic, in 56 groups',C.amber],
 ['Aṅguttara-bhāṇakas','Aṅguttara Nikāya','Short discourses arranged by number, Ones to Elevens',C.purple],
 ['Jātaka-bhāṇakas','Jātaka','About 550 birth stories in verse',C.coral],
 ['Dhammapada-bhāṇakas','Dhammapada','423 verses',C.dark]];
SCENE({id:'bhanakas',name:'The reciters',tag:'Specialists in one collection',
 definition:'A bhāṇaka is a reciter. The collections were too large for most people to hold entire, so groups of monks and nuns specialised: reciters of the long discourses, of the middle-length ones, and so on, each group teaching its collection to the next generation.',
 example:'Early cave inscriptions in Sri Lanka name donors as majhima-banaka, a reciter of the Majjhima, and stone railings at Bhārhut in India record gifts from bhāṇakas.',
 desc:'Six groups of seated reciters, each responsible for one collection. Pressing a group shows its collection and how large it is.',
 research:['Adikaram, E. W. (1946). Early History of Buddhism in Ceylon. Migoda (chapter on the bhāṇakas).','Norman, K. R. (1983). Pāli Literature. Wiesbaden: Harrassowitz, 8–9.','Paranavitana, S. (1970). Inscriptions of Ceylon, vol. 1: Early Brāhmī Inscriptions. Colombo (reciters named in cave inscriptions).'],
 dur:10,hint:'Press a group of reciters. The groups are named in inscriptions and described in the fifth-century commentaries.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(5,Math.floor(p*6))}},
 ui:[{choose:P1_BHAN.map((q,i)=>[i,q[1].split(' ')[0]]),label:'Collection',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=+v}},
 draw(s,f,X){
  const B=P1_BHAN[s.k];let out=P1_head(B[0],'established');
  P1_BHAN.forEach((q,i)=>{const x=50+(i%3)*180,y=84+Math.floor(i/3)*104,on=i===s.k;
   let g=R(x,y,160,90,on?'#fff':'#f6f9fb',on?q[3]:C.grid,10);for(let k=0;k<4;k++)g+=P1_person(x+32+k*32,y+44,on?q[3]:'#9fb6c4');
   g+=TF(x+80,y+78,q[1],13,on?C.ink:C.muted);out+=hit(X,'k',i,q[0],g)});
  out+=P1_card(50,296,500,B[1],B[2]+'. Its reciters learned it together and passed it on.',B[3]);
  return {svg:out,phase:`${B[0]}: reciters of the ${B[1]} (${B[2].charAt(0).toLowerCase()+B[2].slice(1)}). Specialising spread the load, and each group’s shared recitation guarded its own collection.`};
 }});

const P1_PLANS={even:[2,2,2,2],uneven:[5,1,1,1],thin:[1,1,1,1]};
const P1_COLL=['Long','Middle','By topic','By number'];
SCENE({id:'bhanakas-load',name:'Sharing the load',tag:'Why a collection needs several reciters',
 definition:'A spoken collection survives only while living people can recite it. Spreading reciters across the collections, with more than one for each, protects every collection against the loss of any single person.',
 example:'Eight reciters shared evenly can lose four people and may still keep all four collections. Eight reciters with five on one collection can lose a whole collection when one person dies.',
 desc:'Four collections, each with its reciters drawn as figures. A slider removes reciters in a fixed random order, and collections with nobody left are marked as lost.',
 research:['Adikaram, E. W. (1946). Early History of Buddhism in Ceylon (the commentaries’ account of famine years when few reciters of some texts survived).','Anālayo (2022). Early Buddhist Oral Tradition. Wisdom Publications.','Mingun Sayadaw (1911–1993) is recorded as reciting the whole Pali canon from memory at the Sixth Council, 1954–56: the feat is possible, but rare.'],
 dur:11,hint:'Choose how the reciters are shared out, then remove reciters one by one. New order changes who is lost first. An illustrative model.',
 init:()=>({plan:'even',lost:3,seed:1}),
 watch(p){return {plan:p<.5?'even':'uneven',lost:Math.round(((p*2)%1)*5),seed:4}},
 ui:[{choose:[['even','2 each'],['uneven','5, 1, 1, 1'],['thin','1 each']],label:'Reciters',get:s=>s.plan,act:'plan'},{range:'lost',label:'Reciters lost',min:0,max:6,step:1,get:s=>s.lost,act:'lost',show:v=>v+''},{b:'New order',act:'seed'}],
 on:{plan(s,v){s.plan=v},lost(s,v){s.lost=+v},seed(s){s.seed=s.seed%9+1}},
 draw(s){
  const plan=P1_PLANS[s.plan],all=[];plan.forEach((n,c)=>{for(let i=0;i<n;i++)all.push([c,i])});
  const order=shuffled(all.map((q,i)=>i),s.seed*13+all.length),gone=new Set(order.slice(0,Math.min(s.lost,all.length)));
  const alive=plan.map((n,c)=>all.filter((q,i)=>q[0]===c&&!gone.has(i)).length),dead=alive.filter(a=>a===0).length;
  let out=P1_head(dead?`${dead} collection${dead>1?'s':''} lost`:'All four collections still recited','traditional');
  plan.forEach((n,c)=>{const x=40+c*135,ok=alive[c]>0;out+=R(x,80,122,190,ok?'#fff':C.coralp,ok?C.grid:C.coral,10)+TBF(x+61,104,P1_COLL[c],14,ok?C.ink:C.coral);
   all.forEach((q,i)=>{if(q[0]!==c)return;const px=x+26+(q[1]%3)*35,py=150+Math.floor(q[1]/3)*52;out+=gone.has(i)?Ci(px,py-6,9,'none',C.line,'stroke-dasharray="3 3"'):P1_person(px,py,C.blue,8)});
   out+=TF(x+61,258,ok?alive[c]+' reciter'+(alive[c]>1?'s':''):'no one left',13,ok?C.muted:C.coral)});
  out+=T(300,304,`${all.length-gone.size} of ${all.length} reciters remain`,15,C.ink);
  return {svg:out,phase:dead?`With ${gone.size} reciter${gone.size===1?'':'s'} gone, ${dead} collection${dead>1?'s have':' has'} no one left to recite ${dead>1?'them':'it'}. A spoken text with no living reciter is gone. Later tradition gives fears like this as a reason for writing the texts down.`:`With ${gone.size} reciter${gone.size===1?'':'s'} gone, every collection still has someone who can recite it.`};
 }});

const P1_KH=['Jātaka','Niddesa','Paṭisambhidāmagga','Suttanipāta','Dhammapada','Udāna','Itivuttaka','Vimānavatthu','Petavatthu','Theragāthā','Therīgāthā','Cariyāpiṭaka','Apadāna','Buddhavaṃsa'];
SCENE({id:'bhanakas-differences',name:'When reciters disagreed',tag:'Two groups, two lists',
 definition:'Different groups of reciters did not always agree on the edges of the collection. Buddhaghosa’s fifth-century commentary records that the Dīgha reciters and the Majjhima reciters gave different lists of the “minor” books, and even filed them in different baskets.',
 example:'The Dīgha reciters left out the Cariyāpiṭaka, Apadāna and Buddhavaṃsa and placed the minor books with the Abhidhamma. The Majjhima reciters included those three and placed the minor books with the discourses.',
 desc:'The minor books as tiles. Choosing a group of reciters lights the books on its list and names the basket it filed them in.',
 research:['Buddhaghosa (5th century). Sumaṅgalavilāsinī (commentary on the Dīgha Nikāya), introduction.','Norman, K. R. (1983). Pāli Literature. Wiesbaden: Harrassowitz, 9.','von Hinüber, O. (1996). A Handbook of Pāli Literature. Berlin: de Gruyter, §85.'],
 dur:9,hint:'Switch between the two groups of reciters. Both lists count the two parts of the Niddesa as one book here.',
 init:()=>({g:'d'}),
 watch(p){return {g:p<.5?'d':'m'}},
 ui:[{choose:[['d','Dīgha reciters'],['m','Majjhima reciters']],label:'Whose list',get:s=>s.g,act:'g'}],
 on:{g(s,v){s.g=v}},
 draw(s){
  const inList=i=>s.g==='m'||i<11,cnt=s.g==='m'?14:11;let out=P1_head(s.g==='d'?'The Dīgha reciters’ list':'The Majjhima reciters’ list','established');
  P1_KH.forEach((n,i)=>{const x=40+(i%3)*178,y=76+Math.floor(i/3)*38,on=inList(i),extra=i>=11;out+=R(x,y,168,30,on?(extra?C.greenp:C.pale):'#f6f9fb',on?(extra?C.green:C.blue):C.grid,8)+TF(x+84,y+20,n,13,on?C.ink:'#a9b8c2')});
  out+=P1_card(40,276,520,'Filed under',s.g==='d'?'The Abhidhamma basket, as the “minor collection of texts”.':'The basket of discourses, as the fifth Nikāya.',s.g==='d'?C.blue:C.green);
  return {svg:out,phase:`${s.g==='d'?'The Dīgha reciters':'The Majjhima reciters'} listed ${cnt} of these books${s.g==='m'?', adding the Cariyāpiṭaka, Apadāna and Buddhavaṃsa':''}. The commentary records both lists without hiding the difference: evidence that the edge of the canon was still being settled, and that the reciting groups were real communities with their own traditions.`};
 }});

/* ---------- Lesson: languages-of-teaching ---------- */
const P1_LANG=[
 ['Dialects of the Ganges plain','c. 5th century BCE','The teaching was first given in the everyday Middle Indo-Aryan speech of north-east India. No text survives in exactly that form.',[150,130],C.amber],
 ['Pali','written from the 1st century BCE','A literary Middle Indo-Aryan language with mostly western features. The Theravāda canon is preserved in it.',[150,250],C.blue],
 ['Gāndhārī','1st century BCE to 3rd century CE','The language of the north-west, written in Kharoṣṭhī script. The oldest surviving Buddhist manuscripts are in it.',[330,90],C.green],
 ['Buddhist Hybrid Sanskrit','from about the 1st century CE','Middle Indo-Aryan texts partly reshaped towards Sanskrit forms.',[400,180],C.purple],
 ['Sanskrit','from the early centuries CE','The learned language of India, used by several schools for their canons and by most Mahāyāna sūtras as we have them.',[400,270],C.coral]];
SCENE({id:'languages-of-teaching',name:'The languages of the teaching',tag:'Not one language but several',
 definition:'The early teaching circulated in several related Middle Indo-Aryan languages, the everyday speech of north India, and was later also put into Sanskrit. Pali is one of these languages: a literary form that became the canonical language of the Theravāda tradition.',
 example:'The Theravāda tradition identifies Pali with Māgadhī, the speech of the Buddha’s region. Linguists find that Pali has mostly western features and is best described as a literary language that grew out of several dialects.',
 desc:'A simple diagram of five languages and how they relate. Pressing one shows where and when it was used and what survives in it.',
 research:['Norman, K. R. (1983). Pāli Literature. Harrassowitz, 1–7.','von Hinüber, O. (1982). Pāli as an artificial language. Indologica Taurinensia 10, 133–140.','Salomon, R. (2018). The Buddhist Literature of Ancient Gandhāra. Wisdom Publications.','Edgerton, F. (1953). Buddhist Hybrid Sanskrit Grammar and Dictionary. Yale University Press.'],
 dur:11,hint:'Press a language. The arrows show descent and influence in broad strokes; the real picture has many more dialects.',
 init:()=>({k:1}),
 watch(p){return {k:Math.min(4,Math.floor(p*5))}},
 ui:[{choose:[[0,'Dialects'],[1,'Pali'],[2,'Gāndhārī'],[3,'Hybrid Sanskrit'],[4,'Sanskrit']],label:'Language',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=+v}},
 draw(s,f,X){
  const Q=P1_LANG[s.k];let out=P1_head(Q[0],s.k===0||s.k===1?'debated':'established');
  const pos=P1_LANG.map(q=>q[3]);
  [[0,1],[0,2],[0,3],[3,4]].forEach(([a,b])=>{out+=L(pos[a][0],pos[a][1]+14,pos[b][0],pos[b][1]-14,C.line,2,'stroke-dasharray="5 4"')});
  P1_LANG.forEach((q,i)=>{const [x,y]=q[3],on=i===s.k,w=Math.max(96,q[0].length*7.2+20);out+=hit(X,'k',i,q[0],R(x-w/2,y-15,w,30,on?q[4]:'#fff',on?q[4]:C.line,10)+TBF(x,y+5,i===0?'Ganges-plain dialects':q[0],12,on?'#fff':C.ink))});
  out+=TF(60,300,Q[1],13,C.muted,'start');
  P1_wrap(Q[2],78).forEach((l,i)=>{out+=TF(60,320+i*18,l,13,C.ink,'start')});
  return {svg:out,phase:`${Q[0]} (${Q[1]}). ${Q[2]}${s.k<2?' Whether any surviving language is “what the Buddha spoke” is debated; most linguists think none is exactly that.':''}`};
 }});

const P1_TERMS={
 dhamma:['teaching; the way things are',['dhamma','dhama','dharma','fǎ','chos']],
 sutta:['discourse',['sutta','sutra','sūtra','jīng','mdo']],
 bhikkhu:['monk',['bhikkhu','bhikhu','bhikṣu','bǐqiū','dge slong']],
 nibbana:['the goal: extinguishing',['nibbāna','nivana','nirvāṇa','nièpán','mya ngan las ’das pa']]};
const P1_TL=[['Pali',C.blue],['Gāndhārī',C.green],['Sanskrit',C.coral],['Chinese (pinyin)',C.amber],['Tibetan (Wylie)',C.purple]];
SCENE({id:'languages-of-teaching-words',name:'One word, five languages',tag:'How a term travels',
 definition:'As the teaching moved, its key terms were respelled, transcribed by sound, or translated by meaning. Comparing the forms of a single word shows the relationships between the languages.',
 example:'Pali dhamma, Gāndhārī dhama and Sanskrit dharma are the same word in sister languages. Chinese fǎ and Tibetan chos are translations by meaning. Chinese nièpán imitates the sound of nirvāṇa.',
 desc:'One term shown in five languages side by side, with a note on whether each form is the same word, a transcription by sound, or a translation by meaning.',
 research:['Salomon, R. (2018). The Buddhist Literature of Ancient Gandhāra. Wisdom (Gāndhārī spellings vary between manuscripts).','Nattier, J. (2008). A Guide to the Earliest Chinese Buddhist Translations. Tokyo: IRIAB.','Brough, J. (1962). The Gāndhārī Dharmapada. Oxford University Press.'],
 dur:10,hint:'Choose a term. Chinese is given in modern pinyin and Tibetan in Wylie romanisation, so the page does not depend on fonts.',
 init:()=>({t:'dhamma'}),
 watch(p){return {t:['dhamma','sutta','bhikkhu','nibbana'][Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:[['dhamma','dhamma'],['sutta','sutta'],['bhikkhu','bhikkhu'],['nibbana','nibbāna']],label:'Term',get:s=>s.t,act:'t'}],
 on:{t(s,v){s.t=v}},
 draw(s){
  const Q=P1_TERMS[s.t];let out=P1_head('“'+Q[0]+'”','established');
  const kind=i=>i<3?'the same word':i===3?(s.t==='bhikkhu'||s.t==='nibbana'?'copies the sound':'translates the meaning'):'translates the meaning';
  P1_TL.forEach((q,i)=>{const y=76+i*50;out+=R(40,y,520,42,'#fff',C.grid,8)+R(40,y,8,42,q[1],'none',4)+TF(60,y+26,q[0],13,C.muted,'start')+TB(300,y+28,Q[1][i],17,C.ink)+TF(548,y+26,kind(i),12,i<3?C.blue:C.amber,'end')});
  return {svg:out,phase:`Pali ${Q[1][0]}, Gāndhārī ${Q[1][1]} and Sanskrit ${Q[1][2]} are one word in three related languages. The Chinese form ${Q[1][3]} ${s.t==='bhikkhu'||s.t==='nibbana'?'imitates the Indian sound':'is a Chinese word chosen for its meaning'}; the Tibetan ${Q[1][4]} is a translation by meaning.`};
 }});

SCENE({id:'languages-of-teaching-own-dialect',name:'“In one’s own language”',tag:'A much-argued passage',
 definition:'The Vinaya tells of two monks who ask to put the teaching into chandas, probably the prestigious metre or language of the Vedas. The request is refused, and the teaching is to be learned sakāya niruttiyā, “in own language”. Whose own is not stated, and readers have disagreed for fifteen centuries.',
 example:'Read as “each in his own dialect”, the passage explains why the teaching spread in many languages. Buddhaghosa read it as “in the Buddha’s own language”, which supports keeping it in Pali.',
 desc:'The Pali phrase with two readings side by side. Choosing a reading shows who holds it and what follows from it.',
 research:['Vinaya Piṭaka, Cullavagga V.33 (trans. I. B. Horner, The Book of the Discipline, vol. 5).','Brough, J. (1980). Sakāya niruttiyā: cauld kale het. In H. Bechert (ed.), The Language of the Earliest Buddhist Tradition, 35–42. Göttingen.','Norman, K. R. (1980). The dialects in which the Buddha preached. Same volume, 61–77.','Levman, B. (2008–9). Sakāya niruttiyā revisited. Bulletin d’études indiennes 26–27, 33–39.'],
 dur:9,hint:'Switch between the two readings. Both are held by careful readers; the grammar allows either.',
 init:()=>({r:'each'}),
 watch(p){return {r:p<.5?'each':'buddha'}},
 ui:[{choose:[['each','Each person’s own'],['buddha','The Buddha’s own']],label:'Reading',get:s=>s.r,act:'r'}],
 on:{r(s,v){s.r=v}},
 draw(s){
  const e=s.r==='each';let out=P1_head('sakāya niruttiyā','debated');
  out+=TF(300,78,'“… in own language”: whose own?',13,C.muted);
  out+=R(40,96,250,36,e?C.pale:'#fff',e?C.blue:C.grid,8)+TBF(165,119,'each learner’s own dialect',13,e?C.ink:C.muted)+R(310,96,250,36,!e?C.amberp:'#fff',!e?C.amber:C.grid,8)+TBF(435,119,'the Buddha’s own language',13,!e?C.ink:C.muted);
  out+=P1_card(40,148,520,'Who reads it this way',e?'Many modern scholars, and several early schools in practice: they recited in Gāndhārī, in other dialects, and later in Sanskrit.':'Buddhaghosa in the fifth century, and the Theravāda tradition after him: the language is Māgadhī, which the tradition identifies with Pali.',e?C.blue:C.amber);
  out+=P1_card(40,244,520,'What follows',e?'Translation is allowed from the start. The spread into many languages is the teaching working as intended.':'The original wording has special standing. Keeping the texts in Pali is keeping the teaching in its own form.',C.green);
  return {svg:out,phase:e?'On this reading the teaching may be learned in any speaker’s own dialect, which fits the many languages it was in fact carried in. The grammar of the phrase does not settle the question.':'On this reading the teaching is to be kept in the Buddha’s own speech. It is the reading of the Theravāda commentaries. The grammar of the phrase does not settle the question.'};
 }});
