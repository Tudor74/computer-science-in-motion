/* ===================== Tripitaka era 2 · The three baskets (structure of the canon) ===================== */
// Evidence label for every scene: traditional account, established finding, or debated among scholars.
const P2_TAGS={traditional:['Traditional account',C.amber,C.amberp],established:['Established',C.green,C.greenp],debated:['Debated',C.purple,C.purplep]};
function P2_head(title,tag){const S=P2_TAGS[tag],w=S[0].length*7.6+22;return heading(title,50)+R(594-w,3,w,22,S[2],S[1],11)+TBF(594-w/2,18,S[0],12,S[1])}
function P2_wrap(t,n){const out=[];let cur='';for(const w of String(t).split(' ')){if(cur&&(cur+' '+w).length>n){out.push(cur);cur=w}else cur=cur?cur+' '+w:w}if(cur)out.push(cur);return out}
function P2_card(x,y,w,title,text,col=C.blue){const ls=P2_wrap(text,Math.floor((w-22)/6.7));
 let out=R(x,y,w,32+ls.length*18,'#fff',C.grid,8)+TBF(x+11,y+21,title,13,col,'start');
 ls.forEach((l,i)=>{out+=TF(x+11,y+41+i*18,l,13,C.ink,'start')});return out}
// A woven basket: a trapezoid with a rim and a few weave lines.
function P2_basket(x,y,w,h,col,on){
 let o=P(`M${x} ${y}L${x+w} ${y}L${x+w-w*.12} ${y+h}L${x+w*.12} ${y+h}Z`,col,2.4,on?col:'#fff');
 for(let i=1;i<4;i++){const yy=y+h*i/4,ins=w*.12*i/4;o+=L(x+ins,yy,x+w-ins,yy,on?'#ffffff88':col,1)}
 return o+R(x-4,y-6,w+8,10,col,'none',5);
}
const P2_B=[['v','Vinaya','Monastic rules',C.amber],['s','Sutta','Discourses',C.blue],['a','Abhidhamma','Systematic teaching',C.purple]];

/* ---------- Lesson: three-baskets ---------- */
const P2_ITEMS=[
 ['A rule about what a monk may keep, told with the story of how it came to be made','v'],
 ['A dialogue with a visitor that opens “Thus have I heard”','s'],
 ['A table sorting states of mind into groups of three and pairs','a'],
 ['The procedure for admitting a new member to the community','v'],
 ['Verses spoken by elder nuns','s'],
 ['Questions and answers about kinds of condition, with no story or setting','a'],
 ['The list of offences recited aloud every fortnight','v'],
 ['Short sayings arranged by number, from ones to elevens','s']];
SCENE({id:'three-baskets',name:'The three baskets',tag:'Rules, discourses, system',
 definition:'Tipiṭaka (Pali) or Tripiṭaka (Sanskrit) means “three baskets”. The Vinaya basket holds the rules and procedures of the monastic community. The Sutta basket holds discourses and verse. The Abhidhamma basket holds systematic, list-based analysis of the teaching.',
 example:'A story about why a rule was made belongs in the Vinaya. A dialogue that opens “Thus have I heard” belongs in the Sutta basket. A table of classifications with no story belongs in the Abhidhamma.',
 desc:'Three baskets labelled Vinaya, Sutta and Abhidhamma, with a description of one text at a time to be placed in the right basket and a running score.',
 research:['Norman, K. R. (1983). Pāli Literature. Wiesbaden: Harrassowitz.','von Hinüber, O. (1996). A Handbook of Pāli Literature. Berlin: de Gruyter.','Gethin, R. (1998). The Foundations of Buddhism. Oxford University Press, chapter 2.'],
 dur:12,hint:'Read the description and press the basket it belongs in. There are eight texts to place.',
 init:()=>({i:0,ans:[],last:null}),
 watch(p){const i=Math.min(8,Math.floor(p*9));return {i,ans:P2_ITEMS.slice(0,i).map(q=>q[1]),last:i?1:null}},
 ui:[{b:'Vinaya',act:'pick',arg:'v'},{b:'Sutta',act:'pick',arg:'s'},{b:'Abhidhamma',act:'pick',arg:'a'},{b:'Start again',act:'again'}],
 on:{pick(s,v){if(s.i>=8)return;s.last=v===P2_ITEMS[s.i][1]?1:0;s.ans.push(v);s.i++},again(s){s.i=0;s.ans=[];s.last=null}},
 draw(s,f,X){
  const done=s.i>=8,score=s.ans.filter((a,i)=>a===P2_ITEMS[i][1]).length;let out=P2_head(done?`Placed: ${score} of 8 right`:`Text ${s.i+1} of 8: which basket?`,'established');
  const cnt=k=>s.ans.filter((a,i)=>P2_ITEMS[i][1]===k).length;
  P2_B.forEach((b,i)=>{const x=70+i*170;out+=hit(X,'pick',b[0],b[1],P2_basket(x,158,120,78,b[3],false)+TBF(x+60,258,b[1],15,b[3])+TF(x+60,276,b[2],12,C.muted));
   for(let k=0;k<cnt(b[0]);k++)out+=R(x+18+k*22,132,18,24,'#fff',b[3],3)});
  if(!done){P2_wrap(P2_ITEMS[s.i][0],62).forEach((l,i)=>{out+=T(300,88+i*22,l,15,C.ink)})}
  else out+=T(300,100,'All eight texts are in their baskets.',15,C.ink);
  if(s.last!==null&&s.i>0){const prev=P2_ITEMS[s.i-1],b=P2_B.find(q=>q[0]===prev[1]);out+=T(300,312,(s.last?'Right: ':'It belongs in the ')+b[1]+(s.last?'':' basket')+' ('+b[2].toLowerCase()+')',14,s.last?C.green:C.coral)}
  for(let i=0;i<8;i++)out+=Ci(216+i*24,342,7,i<s.i?(s.ans[i]===P2_ITEMS[i][1]?C.green:C.coral):'#fff',C.line);
  return {svg:out,phase:done?`You placed ${score} of 8 correctly. The three baskets sort texts by kind: rules for the community, discourses and verse, and systematic analysis.`:'Rules and procedures go in the Vinaya, discourses and verses in the Sutta basket, and list-based analysis with no story in the Abhidhamma.'};
 }});

const P2_VOL={v:[['Pārājika',1],['Pācittiya',1],['Mahāvagga',1],['Cūḷavagga',1],['Parivāra',1]],s:[['Dīgha',3],['Majjhima',3],['Saṃyutta',3],['Aṅguttara',3],['Khuddaka',11]],a:[['Dhammasaṅgaṇī',1],['Vibhaṅga',1],['Dhātukathā and Puggalapaññatti',1],['Kathāvatthu',1],['Yamaka',3],['Paṭṭhāna',5]]};
SCENE({id:'three-baskets-sizes',name:'How big is each basket?',tag:'Forty volumes in one printed edition',
 definition:'The baskets are not equal in size. In the Burmese Sixth Council edition of the Pali canon, printed in the 1950s, the canon fills forty volumes: five of Vinaya, twenty-three of discourses and twelve of Abhidhamma.',
 example:'The Paṭṭhāna, the last book of the Abhidhamma, takes five volumes on its own. The four main collections of discourses take three volumes each.',
 desc:'Forty book spines grouped into three baskets. Choosing a basket shows how its volumes are divided among its parts.',
 research:['Chaṭṭha Saṅgāyana edition of the Pali Tipiṭaka (Rangoon, 1954–56), 40 volumes; digital text published by the Vipassana Research Institute.','von Hinüber, O. (1996). A Handbook of Pāli Literature. de Gruyter.','Volume counts differ between editions: the Thai and Sri Lankan printed canons divide the same texts differently.'],
 dur:10,hint:'Choose a basket to see how its volumes are shared out. The counts are for one edition; other editions bind the same texts differently.',
 init:()=>({b:'s'}),
 watch(p){return {b:['v','s','a'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['v','Vinaya'],['s','Sutta'],['a','Abhidhamma']],label:'Basket',get:s=>s.b,act:'b'}],
 on:{b(s,v){s.b=v}},
 draw(s,f,X){
  const B=P2_B.find(q=>q[0]===s.b),parts=P2_VOL[s.b],tot=sum(parts.map(q=>q[1]));let out=P2_head(`${B[1]}: ${tot} of 40 volumes`,'established');
  let x=40;P2_B.forEach(b=>{const n=sum(P2_VOL[b[0]].map(q=>q[1])),on=b[0]===s.b;let g='';
   for(let k=0;k<n;k++)g+=R(x+k*12.6,80,10.6,70,on?b[3]:'#d5e0e7','none',2);
   g+=TF(x+n*6.3,168,b[1]+' · '+n,13,on?C.ink:C.muted);out+=hit(X,'b',b[0],b[1],g);x+=n*12.6+8});
  const bw=380/Math.max(...parts.map(q=>q[1]));
  parts.forEach((q,i)=>{const y=190+i*26;out+=TF(196,y+15,q[0],13,C.ink,'end')+R(204,y,q[1]*Math.min(bw,60),19,B[3],'none',4)+TF(212+q[1]*Math.min(bw,60),y+15,q[1]+(q[1]>1?' volumes':' volume'),13,C.muted,'start')});
  return {svg:out,phase:`In this edition the ${B[1]} basket fills ${tot} of 40 volumes (${Math.round(tot/40*100)}%). ${s.b==='s'?'The discourses are the largest basket, and the Khuddaka, the collection of shorter books, is nearly half of it.':s.b==='a'?'The Paṭṭhāna alone takes five volumes.':'The Vinaya is the smallest basket but governs the community that preserved all three.'}`};
 }});

const P2_TERMS=[
 ['“Dhamma and Vinaya”','in the texts themselves','The discourses speak of the teaching as two things, the Dhamma and the Vinaya. There is no mention of three baskets.'],
 ['Nine “limbs”','an early classification','An old list sorts the teaching by kind: prose, mixed prose and verse, explanation, verse, inspired sayings, “thus it was said”, birth stories, marvels, and questions and answers.'],
 ['peṭakin, pañcanekāyika','inscriptions, c. 2nd–1st century BCE','Donors at Bhārhut and Sāñcī are called “one who knows the piṭaka” and “one who knows the five collections”: the earliest datable use of these words.'],
 ['trepiṭaka, trepiṭikā','inscriptions, early centuries CE','Monks and nuns are titled “master of the three baskets”. One is the nun Buddhamitrā, named in inscriptions of the Kushan period.'],
 ['Tipiṭaka as a closed canon','commentaries, 5th century CE','Buddhaghosa describes the whole canon as three baskets with fixed contents.']];
SCENE({id:'three-baskets-word',name:'Where the word comes from',tag:'From “teaching and discipline” to three baskets',
 definition:'Piṭaka means basket. The word is not used for the scriptures in the oldest layers of the texts, which speak of “the Dhamma and the Vinaya”. The term appears in inscriptions from about the second century BCE, and “three baskets” somewhat later.',
 example:'A stone inscription at Bhārhut calls a donor peṭakin, “one who knows the piṭaka”. That is physical, datable evidence that the word was in use.',
 desc:'A timeline of five ways the body of teaching has been named, from the oldest texts to the fifth-century commentaries. Pressing a term shows where it is found.',
 research:['Lamotte, É. (1988). History of Indian Buddhism (trans. S. Webb-Boin). Louvain, 140–149.','Lüders, H. (1963). Bharhut Inscriptions. Corpus Inscriptionum Indicarum II.2.','Schopen, G. (1997). Bones, Stones, and Buddhist Monks. University of Hawai‘i Press (on monks and nuns as donors in inscriptions).','Collins, S. (1990). On the very idea of the Pali canon. Journal of the Pali Text Society 15, 89–126.'],
 dur:11,hint:'Press each term in turn. Why the collections were called baskets is not recorded; one suggestion is the baskets passed from hand to hand by workers.',
 init:()=>({k:2}),
 watch(p){return {k:Math.min(4,Math.floor(p*5))}},
 ui:[{choose:[[0,'Two parts'],[1,'Nine limbs'],[2,'piṭaka'],[3,'Three baskets'],[4,'Closed canon']],label:'Term',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=+v}},
 draw(s,f,X){
  const Q=P2_TERMS[s.k];let out=P2_head(Q[0],s.k<2?'established':s.k===4?'traditional':'established');
  out+=L(60,104,540,104,C.line,3);
  P2_TERMS.forEach((q,i)=>{const x=60+i*120,on=i===s.k;out+=hit(X,'k',i,q[0],Ci(x,104,on?13:9,on?C.blue:'#fff',C.blue)+TF(x,138,['two parts','nine limbs','“piṭaka”','“three baskets”','closed canon'][i],12,on?C.ink:C.muted))});
  out+=TF(60,82,'older',12,C.muted,'start')+TF(540,82,'later',12,C.muted,'end');
  out+=P2_card(50,170,500,Q[1],Q[2],C.blue);
  return {svg:out,phase:`${Q[0]} (${Q[1]}). ${Q[2]}`};
 }});

/* ---------- Lesson: vinaya-pitaka ---------- */
const P2_VIN=[
 ['Pātimokkha','The bare list of rules, recited aloud by the community every fortnight. In the Pali tradition it has 227 rules for monks and 311 for nuns.'],
 ['Suttavibhaṅga','“Analysis of the rules”: every rule in turn, with the story of how it arose, its wording explained word by word, and the cases that are not offences.'],
 ['Khandhaka','Twenty-two chapters on how the community runs: admission, the fortnightly meeting, the rains retreat, robes, medicine, settling disputes. It ends with accounts of the first two councils.'],
 ['Parivāra','A later summary and index, mostly as questions and answers, used for teaching and revision.']];
SCENE({id:'vinaya-pitaka',name:'The Vinaya basket',tag:'How a community governs itself',
 definition:'The Vinaya is the basket of monastic discipline. It contains the rules individual monks and nuns keep, the stories of how each rule arose, and the procedures by which the community admits members, meets and settles disputes.',
 example:'The Pali Vinaya has 227 rules for monks and 311 for nuns. The rules are recited at a meeting every fortnight.',
 desc:'The Vinaya drawn as four nested parts: the list of rules at the centre, the analysis around it, then the chapters on procedure and the later summary. Pressing a part describes it.',
 research:['Horner, I. B. (trans., 1938–1966). The Book of the Discipline, 6 vols. Pali Text Society.','von Hinüber, O. (1996). A Handbook of Pāli Literature, §§12–45.','Prebish, C. (1975). Buddhist Monastic Discipline. Pennsylvania State University Press.'],
 dur:10,hint:'Press each part. I. B. Horner’s English translation, finished in 1966, remains a standard one.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:[[0,'Pātimokkha'],[1,'Suttavibhaṅga'],[2,'Khandhaka'],[3,'Parivāra']],label:'Part',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=+v}},
 draw(s,f,X){
  const Q=P2_VIN[s.k];let out=P2_head(Q[0],'established');
  const box=(i,x,y,w,h,lab,ly)=>hit(X,'k',i,P2_VIN[i][0],R(x,y,w,h,s.k===i?C.amberp:'#fff',s.k===i?C.amber:C.line,10)+TBF(x+12,ly,lab,13,s.k===i?C.ink:C.muted,'start'));
  out+=box(1,40,76,250,150,'Suttavibhaṅga',96)+box(0,62,112,206,96,'Pātimokkha',132);
  for(let i=0;i<5;i++)out+=L(78,148+i*11,250-i*14,148+i*11,s.k===0?C.amber:C.line,2);
  out+=box(2,310,76,250,96,'Khandhaka',96)+TF(322,118,'Mahāvagga · Cūḷavagga',12,C.muted,'start')+TF(322,138,'22 chapters on procedure',12,C.muted,'start');
  out+=box(3,310,184,250,42,'Parivāra',210);
  out+=P2_card(40,246,520,Q[0],Q[1],C.amber);
  return {svg:out,phase:`${Q[0]}. ${Q[1]}`};
 }});

const P2_RULE=[
 ['The story','Someone does something, and lay people or other monks complain. The matter is reported to the teacher.'],
 ['The rule','A rule is laid down, with its reasons: for the good of the community, for restraining the unruly, for the confidence of lay people.'],
 ['A new case','Someone finds a loophole, or the rule proves too strict. The wording is amended, sometimes several times.'],
 ['Word by word','Each word of the final rule is defined, so that it cannot be stretched or narrowed.'],
 ['Not an offence','A list of cases the rule does not cover: accidents, illness, emergencies, and whoever did it first, before the rule existed.']];
SCENE({id:'vinaya-pitaka-rule',name:'The anatomy of a rule',tag:'Story, rule, amendment, definition, exceptions',
 definition:'In the Suttavibhaṅga the rules are presented in a recurring five-part pattern: the story of the incident, the rule itself, later amendments, a word-by-word definition, and the cases that are not offences.',
 example:'The first offender is never guilty: the rule did not exist when they acted. Rules are made in response to cases, as in case law.',
 desc:'Five steps of a rule’s presentation as a row of stages, with the rule’s wording growing as amendments are added.',
 research:['Horner, I. B. (trans., 1938). The Book of the Discipline, vol. 1, introduction.','von Hinüber, O. (1995). Buddhist law according to the Theravāda Vinaya. Journal of the International Association of Buddhist Studies 18(1), 7–45.','Schopen, G. (2004). Buddhist Monks and Business Matters. University of Hawai‘i Press (the origin stories as legal narrative; their historical value is debated).'],
 dur:11,hint:'Step through the five parts. The pattern is shown in outline; most rules follow it, though many were never amended.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(4,Math.floor(p*5))}},
 ui:[{b:'Back',act:'back'},{b:'Next part',act:'next'}],
 on:{back(s){s.k=Math.max(0,s.k-1)},next(s){s.k=Math.min(4,s.k+1)}},
 draw(s){
  const Q=P2_RULE[s.k];let out=P2_head(`Part ${s.k+1} of 5: ${Q[0]}`,'established');
  P2_RULE.forEach((q,i)=>{const x=40+i*106;out+=R(x,78,98,44,i===s.k?C.amber:i<s.k?C.amberp:'#fff',i<=s.k?C.amber:C.line,8)+TBF(x+49,105,q[0],12,i===s.k?'#fff':C.ink);if(i<4)out+=L(x+98,100,x+106,100,C.line,2)});
  // the rule's wording, growing
  out+=R(40,140,520,84,'#fff',C.grid,8)+TBF(52,160,'The rule as it stands',13,C.muted,'start');
  const lines=s.k<1?['(no rule yet)']:s.k<2?['“Whoever does this commits an offence.”']:['“Whoever does this,','except in the following circumstances,','commits an offence.”'];
  lines.forEach((l,i)=>{out+=TF(60,180+i*16,l,13,i===1&&s.k>=2?C.coral:C.ink,'start')});
  if(s.k>=3)out+=TF(548,160,'each word defined',12,C.green,'end');
  if(s.k>=4)out+=TF(548,212,'exceptions listed',12,C.green,'end');
  out+=P2_card(40,240,520,Q[0],Q[1],C.amber);
  return {svg:out,phase:`${Q[0]}. ${Q[1]} Scholars differ on how far the origin stories record real events; as a way of presenting law, the pattern is consistent throughout.`};
 }});

const P2_SCH=[
 ['Theravāda','Pali',227,'Sri Lanka and South-East Asia',1],
 ['Dharmaguptaka','Chinese translation',250,'China, Korea, Vietnam, Taiwan',1],
 ['Mūlasarvāstivāda','Tibetan; parts in Sanskrit and Chinese',253,'Tibet, Mongolia, the Himalaya',1],
 ['Mahāsāṃghika','Chinese translation; parts in Sanskrit',218,'No living ordination lineage',0],
 ['Mahīśāsaka','Chinese translation',251,'No living ordination lineage',0],
 ['Sarvāstivāda','Chinese translation; Sanskrit fragments',263,'No living ordination lineage',0]];
SCENE({id:'vinaya-pitaka-schools',name:'Six Vinayas',tag:'The same core, kept by different schools',
 definition:'The Vinaya survives complete in six versions, each belonging to one early school. They agree closely on the serious rules and differ mainly in the minor rules of etiquette, which is strong evidence for a common core older than the schools themselves.',
 example:'The Theravāda list has 227 rules for monks, the Dharmaguptaka 250. Most of the difference lies in the rules of deportment: 75 in one, 100 in the other.',
 desc:'Six bars, one for each surviving Vinaya, showing the number of rules for monks as usually counted. Pressing a school shows the language it survives in and where it is followed today.',
 research:['Pachow, W. (1955). A Comparative Study of the Prātimokṣa. Santiniketan.','Frauwallner, E. (1956). The Earliest Vinaya and the Beginnings of Buddhist Literature. Rome: IsMEO.','Clarke, S. (2015). Vinayas. In Brill’s Encyclopedia of Buddhism, vol. 1, 60–87.'],
 dur:11,hint:'Press a school. Rule counts differ slightly between sources because traditions count the sections differently.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(5,Math.floor(p*6))}},
 ui:[{choose:P2_SCH.map((q,i)=>[i,q[0]]),label:'School',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=+v}},
 draw(s,f,X){
  const Q=P2_SCH[s.k];let out=P2_head(`${Q[0]}: about ${Q[2]} rules for monks`,'established');
  P2_SCH.forEach((q,i)=>{const y=76+i*30,on=i===s.k;out+=hit(X,'k',i,q[0],TF(178,y+16,q[0],13,on?C.ink:C.muted,'end')+R(186,y,q[2]*1.25,22,on?C.amber:q[4]?'#e7d3a6':'#d5e0e7','none',4)+TF(194+q[2]*1.25,y+16,String(q[2]),13,on?C.ink:C.muted,'start'))});
  out+=L(186+150*1.25,70,186+150*1.25,254,C.green,1.5,'stroke-dasharray="4 4"')+TF(186+150*1.25,268,'about 150 rules shared by all',12,C.green);
  out+=P2_card(40,282,255,'Survives in',Q[1],C.blue)+P2_card(305,282,255,'Followed today',Q[3],Q[4]?C.green:C.muted);
  return {svg:out,phase:`The ${Q[0]} Vinaya survives in ${Q[1].replace('Chinese translation','a Chinese translation')}. ${Q[4]?'It is the code followed today in '+Q[3]+'.':'Its ordination lineage did not continue, but the text survives.'} All six agree on the gravest rules and on about 150 rules in all; they differ mostly in rules of etiquette.`};
 }});

/* ---------- Lesson: sutta-pitaka ---------- */
const P2_NIK=[
 ['Dīgha Nikāya','Long discourses','34 discourses','by length',C.blue],
 ['Majjhima Nikāya','Middle-length discourses','152 discourses','by length',C.green],
 ['Saṃyutta Nikāya','Connected discourses','56 groups, each on one topic','by topic',C.amber],
 ['Aṅguttara Nikāya','Numbered discourses','11 books, the Ones to the Elevens','by number',C.purple],
 ['Khuddaka Nikāya','Minor collection','15 books (18 in the Burmese tradition), many in verse','a miscellany',C.coral]];
SCENE({id:'sutta-pitaka',name:'The basket of discourses',tag:'Five collections, four ways of arranging',
 definition:'The Sutta basket is divided into five collections, called Nikāyas. Each uses a different principle of arrangement: length, topic or number. The fifth gathers shorter works, including the Dhammapada, the birth stories, and the verses of the elder monks and nuns.',
 example:'A discourse too long for one sitting is in the Dīgha. A short one about the senses is in the Saṃyutta, in the group on the senses. The Therīgāthā, verses of elder nuns, is in the Khuddaka.',
 desc:'Five shelves, one for each collection, with marks showing how many items each holds and the principle by which it is arranged.',
 research:['Bodhi, Bhikkhu (2000). The Connected Discourses of the Buddha. Wisdom Publications (general introduction).','von Hinüber, O. (1996). A Handbook of Pāli Literature, §§47–128.','Hallisey, C. (trans., 2015). Therigatha: Poems of the First Buddhist Women. Harvard University Press.'],
 dur:10,hint:'Press a collection. The arrangement tells a reciter where to look for a discourse.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(4,Math.floor(p*5))}},
 ui:[{choose:[[0,'Dīgha'],[1,'Majjhima'],[2,'Saṃyutta'],[3,'Aṅguttara'],[4,'Khuddaka']],label:'Collection',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=+v}},
 draw(s,f,X){
  const Q=P2_NIK[s.k];let out=P2_head(`${Q[0]}: ${Q[1].toLowerCase()}`,'established');
  P2_NIK.forEach((q,i)=>{const y=76+i*40,on=i===s.k;let g=R(40,y,520,32,on?'#fff':'#f6f9fb',on?q[4]:C.grid,8)+R(40,y,8,32,q[4],'none',4)+TBF(60,y+21,q[0],13,on?C.ink:C.muted,'start')+TF(548,y+21,'arranged '+q[3],12,on?q[4]:C.muted,'end');
   const n=[5,12,18,11,15][i],wd=[16,9,4,7,6][i];for(let k=0;k<n;k++)g+=R(230+k*(wd+3),y+8,wd,16,on?q[4]:'#c9d6de','none',2);out+=hit(X,'k',i,q[0],g)});
  out+=P2_card(40,286,520,Q[1],Q[2]+'.'+(s.k===4?' It includes the Dhammapada, the Jātaka, the Theragāthā and the Therīgāthā.':''),Q[4]);
  return {svg:out,phase:`The ${Q[0]} (${Q[1].toLowerCase()}): ${Q[2]}, arranged ${Q[3]}.${s.k===4?' The Therīgāthā in this collection preserves verses attributed to the first Buddhist nuns, among the earliest surviving poetry by women.':''}`};
 }});

const P2_AG=[
 ['Dīgha Nikāya','34','Dīrgha Āgama','30','Dharmaguptaka school; translated into Chinese in 413 by Buddhayaśas and Zhu Fonian.'],
 ['Majjhima Nikāya','152','Madhyama Āgama','222','Sarvāstivāda school; translated in 397–398 by Gautama Saṅghadeva. About a hundred discourses have partners in the Majjhima.'],
 ['Saṃyutta Nikāya','56 groups','Saṃyukta Āgama','1,362','Sarvāstivāda tradition; translated about 435–443 by Guṇabhadra. The count is that of the modern Taishō edition.'],
 ['Aṅguttara Nikāya','11 books','Ekottarika Āgama','52 chapters','School uncertain; translated at the end of the fourth century. It differs from its Pali partner more than the others do.']];
SCENE({id:'sutta-pitaka-agamas',name:'Nikāyas and Āgamas',tag:'The same collections, kept by other schools',
 definition:'Other early schools kept their own versions of the four main collections, called Āgamas. Four survive in Chinese translations made around 400 CE. Each is the counterpart of a Pali Nikāya, transmitted separately for centuries.',
 example:'The Pali Majjhima has 152 discourses and the Chinese Madhyama Āgama has 222. About a hundred are versions of the same discourse, close in content though different in wording and order.',
 desc:'Four Pali collections on the left joined to their four Chinese counterparts on the right, with the number of discourses in each. Pressing a pair shows which school kept the Chinese version and when it was translated.',
 research:['Anālayo (2011). A Comparative Study of the Majjhima-nikāya, 2 vols. Taipei: Dharma Drum.','Minh Chau, Thich (1964; repr. 1991). The Chinese Madhyama Āgama and the Pāli Majjhima Nikāya. Delhi: Motilal Banarsidass.','Bucknell, R. (2014). The structure of the Sanskrit Dīrgha-āgama from Gilgit vis-à-vis the Pali Dīgha-nikāya. In Research on the Dīrgha-āgama, 57–101. Taipei.','SuttaCentral, suttacentral.net: tables of parallels.'],
 dur:11,hint:'Press a pair. Agreement between collections handed down separately is the main evidence for what is early in the discourses.',
 init:()=>({k:1}),
 watch(p){return {k:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:[[0,'Long'],[1,'Middle'],[2,'Connected'],[3,'Numbered']],label:'Pair',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=+v}},
 draw(s,f,X){
  const Q=P2_AG[s.k];let out=P2_head(`${Q[0]} and ${Q[2]}`,'established');
  out+=TF(150,82,'Pali',13,C.muted)+TF(450,82,'Chinese translation',13,C.muted);
  P2_AG.forEach((q,i)=>{const y=92+i*42,on=i===s.k;out+=hit(X,'k',i,q[0]+' and '+q[2],R(40,y,220,34,on?C.pale:'#fff',on?C.blue:C.grid,8)+TBF(52,y+22,q[0],13,on?C.ink:C.muted,'start')+TF(250,y+22,q[1],12,C.muted,'end')+L(260,y+17,340,y+17,on?C.green:C.line,on?3:2,'stroke-dasharray="5 4"')+R(340,y,220,34,on?C.amberp:'#fff',on?C.amber:C.grid,8)+TBF(352,y+22,q[2],13,on?C.ink:C.muted,'start')+TF(550,y+22,q[3],12,C.muted,'end'))});
  out+=P2_card(40,270,520,Q[2],Q[4],C.amber);
  return {svg:out,phase:`${Q[2]}: ${Q[4]} Where a Pali discourse and its Chinese partner agree, the shared material is likely to be older than the split between the schools that kept them.`};
 }});

const P2_FIND=[
 ['A dialogue with a brahmin that fills many pages',0],
 ['A talk of moderate length given to the monks',1],
 ['One of dozens of short discourses that are all about feeling',2],
 ['A short discourse that lists five things',3],
 ['A single verse from the Dhammapada',4],
 ['One of many short discourses all addressed to the same person',2],
 ['A poem by an elder nun',4],
 ['A short discourse on eight things',3]];
SCENE({id:'sutta-pitaka-find',name:'Where would you look?',tag:'Using the arrangement to find a text',
 definition:'Because each collection has its own principle of arrangement, a description of a discourse is usually enough to say which collection holds it: long or middle-length, grouped by topic, grouped by number, or one of the shorter books.',
 example:'A short discourse listing five things will be in the Book of the Fives of the Aṅguttara. A short discourse about feeling will be in the group on feeling in the Saṃyutta.',
 desc:'Five labelled shelves and one description at a time. Pressing a shelf files the text there, and a row of dots keeps the score.',
 research:['Bodhi, Bhikkhu (2005). In the Buddha’s Words: An Anthology of Discourses from the Pāli Canon. Wisdom Publications (introduction).','von Hinüber, O. (1996). A Handbook of Pāli Literature. de Gruyter.','SuttaCentral, suttacentral.net (the collections with their modern numbering).'],
 dur:12,hint:'Read each description and press the collection where you would look for it. There are eight.',
 init:()=>({i:0,ans:[],last:null}),
 watch(p){const i=Math.min(8,Math.floor(p*9));return {i,ans:P2_FIND.slice(0,i).map(q=>q[1]),last:i?1:null}},
 ui:[{b:'Dīgha',act:'pick',arg:0},{b:'Majjhima',act:'pick',arg:1},{b:'Saṃyutta',act:'pick',arg:2},{b:'Aṅguttara',act:'pick',arg:3},{b:'Khuddaka',act:'pick',arg:4},{b:'Start again',act:'again'}],
 on:{pick(s,v){if(s.i>=8)return;v=+v;s.last=v===P2_FIND[s.i][1]?1:0;s.ans.push(v);s.i++},again(s){s.i=0;s.ans=[];s.last=null}},
 draw(s,f,X){
  const done=s.i>=8,score=s.ans.filter((a,i)=>a===P2_FIND[i][1]).length;let out=P2_head(done?`Filed: ${score} of 8 right`:`Text ${s.i+1} of 8: which collection?`,'established');
  if(!done)P2_wrap(P2_FIND[s.i][0],60).forEach((l,i)=>{out+=T(300,92+i*22,l,15,C.ink)});else out+=T(300,100,'All eight are filed.',15,C.ink);
  P2_NIK.forEach((q,i)=>{const x=40+i*106;out+=hit(X,'pick',i,q[0],R(x,150,98,90,'#fff',q[4],10)+R(x,150,98,8,q[4],'none',4)+TBF(x+49,188,q[0].split(' ')[0],13,q[4])+TF(x+49,208,['long','middle','by topic','by number','shorter books'][i],12,C.muted)+TF(x+49,228,s.ans.filter((a,k)=>P2_FIND[k][1]===i).length+' filed',12,C.muted))});
  if(s.last!==null&&s.i>0){const prev=P2_FIND[s.i-1];out+=T(300,276,(s.last?'Right: ':'Look in the ')+P2_NIK[prev[1]][0],14,s.last?C.green:C.coral)}
  for(let i=0;i<8;i++)out+=Ci(216+i*24,318,7,i<s.i?(s.ans[i]===P2_FIND[i][1]?C.green:C.coral):'#fff',C.line);
  return {svg:out,phase:done?`You filed ${score} of 8 correctly. Length sends a discourse to the Dīgha or Majjhima, a shared topic to the Saṃyutta, a number to the Aṅguttara, and the shorter books and verse to the Khuddaka.`:'Length, topic, number, or a shorter book: the description tells you which shelf.'};
 }});

/* ---------- Lesson: abhidhamma-pitaka ---------- */
const P2_ABH=[
 ['Dhammasaṅgaṇī','Enumeration of phenomena','Opens with a summary list of triads and dyads, then lists and defines states of mind and matter under each heading.'],
 ['Vibhaṅga','Analysis','Eighteen topics, each analysed first as the discourses treat it and then by the Abhidhamma method.'],
 ['Dhātukathā','Discussion of elements','Works out how every item relates to three basic schemes: the aggregates, the sense bases and the elements.'],
 ['Puggalapaññatti','Description of persons','Types of person, arranged by number from ones to tens: the closest in style to the discourses.'],
 ['Kathāvatthu','Points of controversy','Debates over some two hundred disputed points. Tradition attributes it to Moggaliputta Tissa at the time of Ashoka.'],
 ['Yamaka','Pairs','Paired questions, each asked forwards and in reverse, that test exactly how far each term extends.'],
 ['Paṭṭhāna','Conditional relations','Applies twenty-four kinds of condition to the lists of the first book. By far the longest of the seven.']];
SCENE({id:'abhidhamma-pitaka',name:'The Abhidhamma basket',tag:'Seven books of system',
 definition:'The Abhidhamma basket restates the teaching without stories or settings, as definitions, classifications and relations. The Pali Abhidhamma has seven books. The Theravāda tradition holds that the Buddha taught it; most scholars date its compilation to the centuries after his death, growing out of summary lists.',
 example:'Where a discourse says a person feels joy, the Abhidhamma lists which mental factors are present in that moment, and under what conditions.',
 desc:'Seven books in a row, each with its Pali name and an English gloss. Pressing a book says what it does.',
 research:['Nyanatiloka (1938; 4th edn 1983). Guide through the Abhidhamma-Piṭaka. Kandy: Buddhist Publication Society.','von Hinüber, O. (1996). A Handbook of Pāli Literature, §§129–155.','Cox, C. (1995). Disputed Dharmas: Early Buddhist Theories on Existence. Tokyo (introduction on the growth of Abhidharma).','Buddhaghosa (5th century). Atthasālinī, introduction (the traditional account of how the Abhidhamma was taught).'],
 dur:11,hint:'Press each book. The traditional account and the scholarly dating are both given; they answer different questions.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(6,Math.floor(p*7))}},
 ui:[{range:'k',label:'Book',min:1,max:7,step:1,get:s=>s.k+1,act:'k',show:v=>'book '+v}],
 on:{k(s,v){s.k=clamp(+v-1,0,6)},pick(s,v){s.k=+v}},
 draw(s,f,X){
  const Q=P2_ABH[s.k];let out=P2_head(`${s.k+1}. ${Q[0]}`,'established');
  P2_ABH.forEach((q,i)=>{const x=40+i*75,on=i===s.k,h=[60,60,44,44,60,96,150][i];out+=hit(X,'pick',i,q[0],R(x,236-h,67,h,on?C.purple:C.purplep,C.purple,6)+TBF(x+33.5,254,String(i+1),13,on?C.purple:C.muted))});
  out+=TF(300,274,'bar height: longer books are taller (not to scale)',12,C.muted);
  out+=P2_card(40,286,520,Q[1],Q[2],C.purple);
  return {svg:out,phase:`${Q[0]} (“${Q[1]}”). ${Q[2]} The Theravāda tradition holds the Abhidhamma to be the Buddha’s teaching; scholars generally see it as compiled over several centuries from summary lists.`};
 }});

const P2_TH=['Dhammasaṅgaṇī','Vibhaṅga','Dhātukathā','Puggalapaññatti','Kathāvatthu','Yamaka','Paṭṭhāna'];
const P2_SA=['Jñānaprasthāna','Prakaraṇapāda','Vijñānakāya','Dharmaskandha','Prajñaptiśāstra','Dhātukāya','Saṅgītiparyāya'];
SCENE({id:'abhidhamma-pitaka-two',name:'Two Abhidharmas',tag:'Seven books each, but not the same seven',
 definition:'The Sarvāstivāda school also had an Abhidharma basket of seven books, preserved mainly in Chinese. Its seven are different works from the Pali seven. The Vinayas and discourses of the two schools match closely; their Abhidharmas do not.',
 example:'The Pali Vibhaṅga and the Sarvāstivāda Dharmaskandha share an old core of topics. Most of the other books have no counterpart on the other side.',
 desc:'The seven Pali books on one side and the seven Sarvāstivāda books on the other, with the one clear link drawn between them, set against the close match of the other two baskets.',
 research:['Frauwallner, E. (1995). Studies in Abhidharma Literature and the Origins of Buddhist Philosophical Systems (trans. S. Kidd). SUNY Press.','Willemen, C., Dessein, B. & Cox, C. (1998). Sarvāstivāda Buddhist Scholasticism. Leiden: Brill.','Cox, C. (1995). Disputed Dharmas. Tokyo.'],
 dur:10,hint:'Compare the three baskets. How closely two schools’ versions match is a clue to how early the material was fixed.',
 init:()=>({b:'a'}),
 watch(p){return {b:['v','s','a'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['v','Vinaya'],['s','Discourses'],['a','Abhidharma']],label:'Compare',get:s=>s.b,act:'b'}],
 on:{b(s,v){s.b=v}},
 draw(s){
  const a=s.b==='a';let out=P2_head(a?'Abhidharma: two different sets of seven':s.b==='v'?'Vinaya: closely matching':'Discourses: closely matching','established');
  out+=TBF(150,84,'Theravāda (Pali)',13,C.blue)+TBF(450,84,'Sarvāstivāda (Chinese)',13,C.amber);
  if(a){P2_TH.forEach((n,i)=>{out+=R(50,94+i*27,200,22,C.pale,C.blue,6)+TF(150,110+i*27,n,12,C.ink)});P2_SA.forEach((n,i)=>{out+=R(350,94+i*27,200,22,C.amberp,C.amber,6)+TF(450,110+i*27,n,12,C.ink)});
   out+=L(250,94+27+11,350,94+3*27+11,C.green,2.4,'stroke-dasharray="5 4"')+TF(300,300,'one clear shared core; the rest are separate works',13,C.green)}
  else{const n=s.b==='v'?6:8,lab=s.b==='v'?['gravest offences','meeting offences','forfeiture','confession','procedure chapters','rules for nuns']:['long discourses','middle-length','by topic','by number','stock phrases','numbered lists','similes','settings'];
   for(let i=0;i<n;i++){const y=94+i*(s.b==='v'?30:23);out+=R(50,y,200,19,C.pale,C.blue,6)+R(350,y,200,19,C.amberp,C.amber,6)+L(250,y+9.5,350,y+9.5,C.green,2)+TF(300,y+5,lab[i],11,C.muted)}
   out+=TF(300,300,'part by part, the two versions correspond',13,C.green)}
  return {svg:out,phase:a?'The two schools’ Abhidharma baskets hold different books. Scholars take this as evidence that the Abhidharma was composed after the schools had separated, each developing its own. The Theravāda tradition holds that its Abhidhamma goes back to the Buddha.':'Here the two schools’ versions correspond section by section, which points to material fixed before the schools went their separate ways.'};
 }});

SCENE({id:'abhidhamma-pitaka-matika',name:'From list to matrix',tag:'How a few lists generate a large text',
 definition:'A mātikā is a summary list of headings. The Abhidhamma takes lists of threes (triads) and twos (dyads) and applies them to one another, so that a handful of short lists generates a very large, fully systematic text.',
 example:'One triad sorts everything into three classes. Cross it with a dyad and there are six cells to fill; add another dyad and there are twelve. The Dhammasaṅgaṇī opens with 22 triads and 100 dyads.',
 desc:'A grid whose number of cells is set by how many triads and dyads are combined, with the running count of cells a reciter would have to fill.',
 research:['Gethin, R. (1992). The mātikās: memorization, mindfulness and the list. In In the Mirror of Memory, 149–172. SUNY Press.','Nyanatiloka (1983). Guide through the Abhidhamma-Piṭaka. Kandy: BPS.','Warder, A. K. (1961). The mātikā. In the Pali Text Society edition of the Mohavicchedanī, xix–xxvii.'],
 dur:10,hint:'Add triads and dyads and watch the number of cells multiply. This is why the last books of the Abhidhamma are so long, and why printed editions abbreviate them.',
 init:()=>({t:1,d:1}),
 watch(p){const k=Math.min(5,Math.floor(p*6));return {t:[1,1,1,2,2,2][k],d:[0,1,2,1,2,3][k]}},
 ui:[{range:'t',label:'Triads',min:0,max:2,step:1,get:s=>s.t,act:'t',show:v=>v+''},{range:'d',label:'Dyads',min:0,max:3,step:1,get:s=>s.d,act:'d',show:v=>v+''}],
 on:{t(s,v){s.t=+v},d(s,v){s.d=+v}},
 draw(s){
  const cols=Math.pow(3,s.t),rows=Math.pow(2,s.d),n=cols*rows;let out=P2_head(`${s.t} triad${s.t===1?'':'s'} × ${s.d} dyad${s.d===1?'':'s'} = ${n} cell${n===1?'':'s'}`,'established');
  const gw=420,gh=180,cw=gw/cols,ch=gh/rows;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)out+=R(90+c*cw,84+r*ch,cw-3,ch-3,(r+c)%2?C.purplep:'#fff',C.purple,3);
  out+=TF(300,284,`3 × `.repeat(s.t)+`2 × `.repeat(s.d)+'1 = '+n,13,C.muted);
  out+=P2_card(40,296,520,'In the Dhammasaṅgaṇī','22 triads and 100 dyads open the book. The Paṭṭhāna then applies 24 kinds of condition to them.',C.purple);
  return {svg:out,phase:`${s.t} triad${s.t===1?'':'s'} and ${s.d} dyad${s.d===1?'':'s'} give ${n} combination${n===1?'':'s'} to work through. A reciter who holds the short lists and the method can rebuild the full text, which is why the lists, the mātikā, were memorised first.`};
 }});
