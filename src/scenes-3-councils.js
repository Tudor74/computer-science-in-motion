/* Tripitaka In Motion · era 3 · Councils and Ashoka (c. 400–250 BCE).
   Communal recitations, the first schools, and an emperor's inscriptions: the earliest datable evidence.
   Every scene carries an evidence tag: traditional account, established, or debated. */

const P3_wrap=(s,n)=>{const w=String(s).split(' '),out=[];let l='';for(const x of w){if((l+' '+x).trim().length>n){if(l)out.push(l);l=x}else l=(l+' '+x).trim()}if(l)out.push(l);return out};
// Wrapped body text in scaled type; n is worked out from the width so lines fit at phone scale.
const P3_text=(x,y,str,w,col=C.ink,size=13,lh=22)=>P3_wrap(str,Math.floor(w/9.4)).map((l,i)=>T(x,y+i*lh,l,size,col,'start')).join('');
const P3_TAGS={trad:['traditional account','#8a5a00','#fbefd5'],est:['established','#236b5e','#dceee8'],deb:['debated','#5b4696','#ece6f6']};
const P3_tag=k=>{const [t,c,b]=P3_TAGS[k];return R(190,352,220,24,b,c,12)+T(300,369,t,12,c)};
// A card with a bold title and wrapped body.
const P3_card=(x,y,w,h,title,body,col=C.blue)=>R(x,y,w,h,'#fff',col,8)+TB(x+12,y+24,title,13,col,'start')+P3_text(x+12,y+48,body,w-24);
// A pressable row in a list.
const P3_row=(X,act,i,x,y,w,label,on,extra='')=>hit(X,act,i,label,R(x,y,w,30,on?C.pale:'#fff',on?C.blue:C.grid,6)+TB(x+10,y+20,label,12,on?C.ink:C.muted,'start')+extra);

/* ---------------- The first council ---------------- */
const P3_FC=[
 ['After the Buddha’s death','The closing chapters of the Vinaya say the elder Mahākassapa proposed a gathering to recite the teaching and the discipline together, so that neither would be lost or altered.'],
 ['Five hundred at Rājagaha','Five hundred senior monks are said to have met near Rājagaha (modern Rajgir) for the rains retreat, with support from King Ajātasattu.'],
 ['Upāli recites the Vinaya','Mahākassapa questions Upāli on each rule: where it was laid down, about whom, and why. Upāli answers from memory.'],
 ['Ānanda recites the Dhamma','Ānanda, the Buddha’s attendant, is questioned on the discourses in the same way. Discourses open “Thus have I heard”, by tradition his words.'],
 ['Recited together','The assembly then chants the agreed text in unison. The word for a council, saṅgīti, means “singing together”.']];
SCENE({id:'first-council',name:'The first council',tag:'The traditional account',
 definition:'Buddhist tradition says that soon after the Buddha’s death five hundred senior monks met at Rājagaha and recited the discipline and the discourses together, fixing what was to be remembered.',
 example:'In the Pali account Upāli recites the Vinaya and Ānanda the discourses, each questioned by Mahākassapa, and the assembly then chants the result together.',
 research:'Cullavagga XI (Vinaya Piṭaka; trans. I. B. Horner, The Book of the Discipline vol. 5, 1952). Prebish, C. S. (1974). A review of scholarship on the Buddhist councils. Journal of Asian Studies 33(2), 239–254.',
 desc:'A ring of seats with the presiding elder marked and the reciter in the middle; five steps of the traditional account appear on a card beside it.',
 dur:12,hint:'Step through the account. This is what the tradition says; the next two scenes ask what historians make of it.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(4,Math.floor(p*5))}},
 ui:[{b:'Next step',act:'next'},{b:'Back',act:'back'}],
 on:{next(s){s.k=Math.min(4,s.k+1);return 'keep'},back(s){s.k=Math.max(0,s.k-1);return 'keep'}},
 draw(s){
  let out=heading('The first council, as the tradition tells it');
  const cx=150,cy=200,r=96;
  for(let i=0;i<24;i++){const a=-Math.PI/2+i*Math.PI/12,top=i===0;out+=Ci(cx+Math.cos(a)*r,cy+Math.sin(a)*r,top?9:6,top?C.amber:s.k===4?C.blue:s.k>=1?'#b9d4e6':'#e6edf1')}
  out+=T(cx,cy-r-18,'Mahākassapa presides',12,C.amber);
  if(s.k===2||s.k===3)out+=Ci(cx,cy,11,C.coral)+TB(cx,cy+32,s.k===2?'Upāli':'Ānanda',13,C.coral);
  if(s.k===4)out+=Ci(cx,cy,30,'none',C.blue)+Ci(cx,cy,52,'none','#b9d4e6');
  out+=T(cx,cy+r+30,s.k?'seats stand for 500 elders':'the community, before the gathering',12,C.muted);
  out+=P3_card(310,62,274,270,`${s.k+1} of 5 · ${P3_FC[s.k][0]}`,P3_FC[s.k][1]);
  out+=P3_tag('trad');
  return {svg:out,phase:'Traditional account, from the Pali Vinaya and its parallels in the Vinayas of other schools. Historians doubt many of the details, though not that the community valued reciting together.'};
 }});

const P3_SRC=[
 ['Place: near Rājagaha',1,'All six surviving Vinayas place the gathering at Rājagaha (Sanskrit Rājagṛha), soon after the Buddha’s death.'],
 ['Five hundred elders',1,'All give five hundred. It is a conventional round number in Indian texts, so it need not be a head count.'],
 ['Upāli: the discipline',1,'Every account has Upāli recite the Vinaya under Mahākassapa’s questioning.'],
 ['Ānanda: the discourses',1,'Every account has Ānanda recite the discourses.'],
 ['A third basket?',0,'The Pali account mentions no Abhidhamma. The Dharmaguptaka Vinaya has Ānanda recite one; the Mūlasarvāstivāda Vinaya has Mahākassapa recite summary lists (mātṛkā).'],
 ['The monk Purāṇa',0,'In the Pali account Purāṇa arrives late, approves, and says he will keep to what he himself heard. Other Vinayas tell the episode with different details.']];
SCENE({id:'first-council-sources',name:'Six versions of one story',tag:'Where the accounts agree and differ',
 definition:'The first council is described in the Vinayas of six early schools. Where separate schools agree, the story is probably older than their separation; where they differ, each school has shaped it.',
 example:'All six agree that Upāli recited the discipline and Ānanda the discourses. They disagree about whether a third basket was recited, and by whom.',
 research:'Przyluski, J. (1926–28). Le concile de Rājagṛha. Paris: Geuthner. Bareau, A. (1955). Les premiers conciles bouddhiques. Paris: PUF. Lamotte, É. (1958/1988). History of Indian Buddhism, pp. 124–140.',
 desc:'Six points of the account as rows, each marked as agreed across the surviving Vinayas or told differently; pressing a row explains it.',
 dur:12,hint:'Press each row. Green rows are told the same way by every school; purple rows are where the versions part.',
 init:()=>({k:4}),
 watch(p){return {k:Math.min(5,Math.floor(p*6))}},
 ui:[{choose:P3_SRC.map((d,i)=>[i,d[0]]),label:'Point',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('What six school Vinayas say');
  P3_SRC.forEach((d,i)=>{const y=50+i*33,on=i===s.k,c=d[1]?'#236b5e':'#5b4696';
   out+=P3_row(X,'k',i,16,y,568,d[0],on,R(424,y+5,150,20,d[1]?'#dceee8':'#ece6f6','none',10)+T(499,y+19,d[1]?'accounts agree':'accounts differ',11,c))});
  const d=P3_SRC[s.k];out+=R(16,252,568,94,'#fff',C.blue,8)+P3_text(28,274,d[2],544);
  out+=P3_tag('deb');
  return {svg:out,phase:d[1]?`${d[0]}: told the same way in every surviving Vinaya, which suggests it belonged to the story before the schools separated.`:`${d[0]}: the versions differ here, which shows each school shaping the account to fit its own canon.`};
 }});

const P3_HIST=[
 ['Silence in the death narrative',0,'Hermann Oldenberg (1879) noted that the long discourse on the Buddha’s last days ends without mentioning any council. He judged the account a later invention.'],
 ['Shared by separate schools',1,'Schools that parted early all preserve the story in their Vinayas. Erich Frauwallner (1956) argued this points to a common source older than the splits.'],
 ['Later texts are included',0,'The canon said to have been recited includes material that must be later, such as the report of the second council a century on. “The whole canon” cannot be literal.'],
 ['A plausible gathering',1,'Many historians accept that monks met after their teacher’s death to agree what to remember, on a smaller scale than the tradition describes.']];
SCENE({id:'first-council-history',name:'Did it happen?',tag:'What historians ask',
 definition:'Historians weigh the council account like any other source: who wrote it, when, and whether independent sources agree. They disagree: some accept an early gathering of senior monks, others doubt it took place, and few treat the recitation of a complete canon as historical.',
 example:'Oldenberg pointed out that the narrative of the Buddha’s death does not mention a council; Frauwallner replied that every school’s Vinaya does.',
 research:'Oldenberg, H. (1879). The Vinaya Piṭakaṃ, vol. 1, introduction. Frauwallner, E. (1956). The Earliest Vinaya and the Beginnings of Buddhist Literature. Rome: IsMEO. Prebish, C. S. (1974). Journal of Asian Studies 33(2), 239–254. Gombrich, R. (1988). Theravāda Buddhism.',
 desc:'Four arguments as rows, each marked as raising doubt or supporting an early core; pressing a row shows the argument.',
 dur:10,hint:'Press each argument and note which way it leans. Neither side has a decisive document.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:P3_HIST.map((d,i)=>[i,d[0]]),label:'Argument',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Four arguments about the first council');
  P3_HIST.forEach((d,i)=>{const y=54+i*36,on=i===s.k,c=d[1]?'#236b5e':'#8a3b2a';
   out+=P3_row(X,'k',i,16,y,568,d[0],on,R(404,y+5,170,20,d[1]?'#dceee8':'#f9e2d9','none',10)+T(489,y+19,d[1]?'supports an early core':'raises doubt',11,c))});
  const d=P3_HIST[s.k];out+=R(16,206,568,138,'#fff',C.blue,8)+P3_text(28,230,d[2],544);
  out+=P3_tag('deb');
  return {svg:out,phase:'A common view today: a gathering of some kind is likely, the detailed account is a later idealised picture, and the canon grew for centuries afterwards.'};
 }});

/* ---------------- The second council and the schools ---------------- */
const P3_TEN=[
 ['Salt kept in a horn','Carrying salt in a horn to season later meals. Opponents counted it as storing food.'],
 ['Two fingers past noon','Eating when the sun’s shadow had passed noon by two finger-breadths.'],
 ['A second meal elsewhere','Going to another village and eating again on the same day.'],
 ['Separate observances','Holding the fortnightly observance in separate groups inside one monastic boundary.'],
 ['Consent afterwards','Carrying out a formal act with an incomplete assembly and asking the absent monks’ consent later.'],
 ['Following custom','Treating a teacher’s habitual practice as authority enough.'],
 ['Unchurned milk','Drinking milk that had begun to turn, after the meal.'],
 ['New palm wine','Drinking palm sap that had not yet fermented.'],
 ['A borderless mat','Using a sitting mat without the prescribed border.'],
 ['Gold and silver','Accepting money. The account opens with the visiting monk Yasa seeing lay people asked for coins at Vesālī. This is the point that began the dispute.']];
SCENE({id:'second-council-schools',name:'The second council',tag:'Ten points at Vesālī',
 definition:'About a hundred years after the Buddha’s death, the Vinaya says, monks at Vesālī were following ten practices that others held to break the rules. A council of seven hundred elders ruled against all ten.',
 example:'The dispute began when the monk Yasa objected to monks accepting gold and silver from lay people.',
 research:'Cullavagga XII (Vinaya Piṭaka; trans. I. B. Horner 1952). Hofinger, M. (1946). Étude sur le concile de Vaiśālī. Louvain. Prebish, C. S. (1974). Journal of Asian Studies 33(2), 239–254.',
 desc:'Ten practices as pressable tiles in two columns; pressing one explains it, and the tenth, accepting money, is marked as the trigger.',
 dur:12,hint:'Press each practice. Most are small points of daily discipline; one concerns money.',
 init:()=>({k:9}),
 watch(p){return {k:Math.min(9,Math.floor(p*10))}},
 ui:[{choose:P3_TEN.map((d,i)=>[i,String(i+1)]),label:'Point',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Ten disputed practices');
  P3_TEN.forEach((d,i)=>{const col=i<5?0:1,row=i%5,x=16+col*288,y=48+row*34,on=i===s.k;
   out+=hit(X,'k',i,d[0],R(x,y,280,30,on?C.pale:i===9?'#fbefd5':'#fff',on?C.blue:i===9?'#c79100':C.grid,6)+TB(x+10,y+20,`${i+1}. ${d[0]}`,12,on?C.ink:C.muted,'start'))});
  const d=P3_TEN[s.k];out+=R(16,226,568,118,'#fff',C.blue,8)+TB(28,250,d[0],13,C.blue,'start')+P3_text(28,274,d[1],544);
  out+=P3_tag('trad');
  return {svg:out,phase:'Traditional account (Cullavagga XII). All ten practices were ruled against. Most historians accept that a real dispute lies behind it; the Vinayas of different schools vary in the details.'};
 }});

const P3_SPLIT={
 pali:['Sri Lankan chronicle (Dīpavaṃsa)','The monks defeated at Vesālī held their own “great recitation”, rearranged the texts, and became the Mahāsāṃghikas.'],
 north:['Northern treatises (Vasumitra)','A dispute over five points about the attainments of an arahant, linked in later sources to a monk named Mahādeva, divided the community.'],
 maha:['A Mahāsāṃghika text','The Śāriputraparipṛcchā says the elders wished to add rules to the Vinaya. The majority refused the additions and kept the older, shorter code.'],
 sch:['Nattier and Prebish (1977)','They argued that the split came some decades after Vesālī and concerned the Vinaya, with the Mahāsāṃghika account closest to events. Each school’s own account casts it as the faithful party.']};
SCENE({id:'second-council-schools-split',name:'The first split',tag:'Three accounts, one division',
 definition:'At some point after the second council the community divided into the Sthaviras (“elders”) and the Mahāsāṃghikas (“great community”). The surviving accounts of why come from the schools themselves and do not agree.',
 example:'The Sri Lankan chronicle blames the monks who lost at Vesālī; a Mahāsāṃghika text says the elders tried to add new rules.',
 research:'Nattier, J. & Prebish, C. S. (1977). Mahāsāṃghika origins: the beginnings of Buddhist sectarianism. History of Religions 16(3), 237–272. Bareau, A. (1955). Les sectes bouddhiques du Petit Véhicule. Saigon: EFEO. Cousins, L. S. (1991). The “five points” and the origins of the Buddhist schools. Buddhist Forum 2.',
 desc:'One line dividing into two branches labelled Sthavira and Mahāsāṃghika, with a card showing each source’s explanation of the split.',
 dur:12,hint:'Choose a source and compare its explanation. Notice who tells each version.',
 init:()=>({v:'pali'}),
 watch(p){return {v:['pali','north','maha','sch'][Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:[['pali','Chronicle'],['north','Northern'],['maha','Mahāsāṃghika'],['sch','Scholars']],label:'Source',get:s=>s.v,act:'v'}],
 on:{v(s,x){s.v=x;return 'keep'}},
 draw(s){
  let out=heading('Why did the community divide?');
  out+=L(60,96,250,96,C.ink,3)+P('M250 96 C300 96 310 70 360 70 L540 70',C.blue,3)+P('M250 96 C300 96 310 122 360 122 L540 122',C.purple,3);
  out+=T(150,84,'one community',12,C.muted)+TB(450,60,'Sthavira (“elders”)',12,C.blue)+TB(450,144,'Mahāsāṃghika (“great community”)',12,C.purple);
  const d=P3_SPLIT[s.v];out+=P3_card(16,162,568,180,d[0],d[1]);
  out+=P3_tag('deb');
  return {svg:out,phase:s.v==='sch'?'The dating and cause of the first split remain debated. What is agreed is that it happened before or around Ashoka’s time and was followed by many further divisions.':'This is one school’s explanation. Compare the others before deciding what it shows.'};
 }});

const P3_TREE=[
 {k:'root',n:'Early community',x:300,y:62,up:null,v:0,t:'One community for roughly the first century, on the traditional accounts.'},
 {k:'sth',n:'Sthavira',x:190,y:110,up:'root',v:0,t:'“Elders”. One side of the first split. Its descendants include the Sarvāstivāda and the Vibhajyavāda groups.'},
 {k:'mah',n:'Mahāsāṃghika',x:450,y:110,up:'root',v:1,t:'“Great community”. The other side of the first split. Its Vinaya survives in Chinese translation.'},
 {k:'pud',n:'Pudgalavāda',x:62,y:162,up:'sth',v:0,t:'Schools such as the Vātsīputrīya. Once numerous in India; very few of their texts survive.'},
 {k:'sar',n:'Sarvāstivāda',x:186,y:162,up:'sth',v:1,t:'Strong in Kashmir and Central Asia. Its Vinaya and much of its Abhidharma survive in Chinese; Sanskrit fragments come from Turfan.'},
 {k:'vib',n:'Vibhajyavāda',x:314,y:162,up:'sth',v:0,t:'“Distinctionists”. A grouping that includes the ancestors of the Theravāda, Mahīśāsaka and Dharmaguptaka schools.'},
 {k:'lok',n:'Lokottaravāda',x:452,y:162,up:'mah',v:0,t:'A Mahāsāṃghika branch. Its Mahāvastu survives in Buddhist Hybrid Sanskrit.'},
 {k:'mul',n:'Mūlasarvāstivāda',x:90,y:214,up:'sar',v:1,t:'Its very long Vinaya survives in Tibetan, in Chinese and partly in Sanskrit from Gilgit. Tibetan monastics follow it today.'},
 {k:'the',n:'Theravāda',x:228,y:214,up:'vib',v:1,t:'Preserved its canon in Pali in Sri Lanka and South-East Asia: the only early canon to survive complete in an Indian language.'},
 {k:'mhi',n:'Mahīśāsaka',x:338,y:214,up:'vib',v:1,t:'Its Vinaya survives in a Chinese translation made from a manuscript the pilgrim Faxian obtained in Sri Lanka.'},
 {k:'dha',n:'Dharmaguptaka',x:460,y:214,up:'vib',v:1,t:'Its “Four-Part Vinaya” is followed by monastics in China, Korea and Vietnam today. The oldest Gandhāran scrolls are linked to this school.'}];
SCENE({id:'second-council-schools-tree',name:'A tree of schools',tag:'“Eighteen schools”, more or less',
 definition:'After the first split the community divided further into schools (nikāyas), each with its own ordination lineage and, in time, its own version of the canon. Tradition counts eighteen, but the surviving lists disagree.',
 example:'Six of these schools have a complete Vinaya that survives today: three are still followed by living monastic communities.',
 research:'Bareau, A. (1955). Les sectes bouddhiques du Petit Véhicule. Saigon: EFEO. Lamotte, É. (1958/1988). History of Indian Buddhism, pp. 517–548. Dessein, B. (2009). The Mahāsāṃghikas and the origin of Mahāyāna Buddhism. Eastern Buddhist 40.',
 desc:'A simplified family tree of eleven early schools; a green outline marks those whose complete Vinaya survives, and pressing a school describes it.',
 dur:14,hint:'Press a school. A green outline means its whole Vinaya survives, in Pali, Chinese, Tibetan or Sanskrit.',
 init:()=>({k:'the'}),
 watch(p){const o=['root','sth','mah','sar','mul','vib','the','mhi','dha','lok','pud'];return {k:o[Math.min(10,Math.floor(p*11))]}},
 ui:[{choose:P3_TREE.map(d=>[d.k,d.n]),label:'School',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v;return 'keep'}},
 draw(s,f,X){
  let out=heading('One simplified tree of the early schools');
  const by={};P3_TREE.forEach(d=>by[d.k]=d);
  P3_TREE.forEach(d=>{if(d.up){const u=by[d.up];out+=L(u.x,u.y+10,d.x,d.y-16,C.line,1.6)}});
  P3_TREE.forEach(d=>{const on=d.k===s.k,w=d.n.length*8.2+14;
   out+=hit(X,'k',d.k,d.n,R(d.x-w/2,d.y-16,w,26,on?C.pale:'#fff',d.v?'#2c776c':on?C.blue:C.grid,6)+TB(d.x,d.y+2,d.n,12,on?C.ink:C.muted))});
  out+=R(22,240,12,12,'#fff','#2c776c',3)+T(42,251,'a complete Vinaya survives',12,C.muted,'start');
  const d=by[s.k];out+=R(16,260,568,86,'#fff',C.blue,8)+P3_text(28,282,d.t,544);
  out+=P3_tag('deb');
  return {svg:out,phase:'Tradition speaks of “eighteen schools”, but the surviving lists disagree on names and order. This tree is one simplified reading; other reconstructions draw the branches differently.'};
 }});

/* ---------------- Ashoka's edicts ---------------- */
const P3_BAIRAT=[
 ['Vinaya-samukase','The exalted Vinaya','No agreed match. Suggestions include the first sermon and a summary of the discipline.','uncertain'],
 ['Aliya-vasāṇi','The noble lineages','Usually matched with a discourse on four noble traditions of contentment (Aṅguttara Nikāya 4.28).','likely'],
 ['Anāgata-bhayāni','Future dangers','Matched with a group of discourses on future dangers (Aṅguttara Nikāya 5.77–80).','likely'],
 ['Muni-gāthā','Verses on the sage','Usually matched with the Muni Sutta of the Sutta Nipāta (1.12).','likely'],
 ['Moneya-sūte','Discourse on sagehood','Often matched with the Nālaka Sutta (Sutta Nipāta 3.11). Another candidate is in the Aṅguttara Nikāya.','possible'],
 ['Upatisa-pasine','Upatissa’s questions','Upatissa is Sāriputta’s personal name. Often matched with the Sāriputta Sutta (Sutta Nipāta 4.16); other candidates exist.','possible'],
 ['Lāghulovāde','Advice to Rāhula','The edict adds “spoken about lying”, which fits the advice to Rāhula at Ambalaṭṭhikā (Majjhima Nikāya 61).','most secure']];
SCENE({id:'ashoka-edicts',name:'An emperor names seven texts',tag:'The Bairāṭ edict',
 definition:'In the 3rd century BCE the emperor Ashoka had an edict cut in stone near Bairāṭ in Rajasthan, greeting the Buddhist community and naming seven texts that monks, nuns and lay followers should hear and reflect on often. It is the earliest dated reference to Buddhist texts by title.',
 example:'One title, the “Advice to Rāhula spoken about lying”, matches a discourse still found in the Majjhima Nikāya.',
 research:'Hultzsch, E. (1925). Inscriptions of Asoka. Corpus Inscriptionum Indicarum vol. 1, pp. 172–174. Norman, K. R. (1983). Pāli Literature. Wiesbaden: Harrassowitz. Thapar, R. (1961). Aśoka and the Decline of the Mauryas. Oxford University Press.',
 desc:'Seven titles from the inscription as a list; pressing one shows its meaning, the surviving text scholars match it with, and how secure the match is.',
 dur:14,hint:'Press each title. The stone is certain; which surviving texts the titles refer to is not.',
 init:()=>({k:6}),
 watch(p){return {k:Math.min(6,Math.floor(p*7))}},
 ui:[{choose:P3_BAIRAT.map((d,i)=>[i,d[0]]),label:'Title',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Seven titles cut in stone, c. 250 BCE');
  P3_BAIRAT.forEach((d,i)=>out+=P3_row(X,'k',i,16,50+i*34,206,d[0],i===s.k));
  const d=P3_BAIRAT[s.k],c=d[3]==='most secure'||d[3]==='likely'?'#236b5e':d[3]==='possible'?'#8a5a00':'#8a3b2a';
  out+=R(234,50,350,234,'#fff',C.blue,8)+TB(246,74,`“${d[1]}”`,13,C.blue,'start')+P3_text(246,100,d[2],326);
  out+=T(246,268,'match with a surviving text: '+d[3],12,c,'start');
  out+=T(300,316,'Titles are in the edict’s own eastern dialect, not in Pali.',12,C.muted);
  out+=P3_tag('est');
  return {svg:out,phase:'Established: the inscription, now kept in Kolkata, dates to Ashoka’s reign and names texts by title. Debated: which surviving texts they are. No title refers to a whole basket or collection.'};
 }});

const P3_SCH={
 edict:['The schism edict','Pillars at Sarnath, Kauśāmbī and Sāñcī carry an order: any monk or nun who divides the community is to be made to wear white clothes and to live outside the monastery.','est'],
 pali:['A third council (Pali account)','The Pali chronicles and commentaries describe a council at Pāṭaliputta under the elder Moggaliputtatissa, at which false monks were expelled and the Kathāvatthu was compiled.','trad'],
 both:['Putting them together','The edicts show Ashoka acting against division, which fits the Pali story. But they name no council, and northern Buddhist sources do not know of one. Many scholars see an event within one group of schools, not a council of all.','deb']};
SCENE({id:'ashoka-edicts-schism',name:'The schism edict',tag:'Stone and chronicle compared',
 definition:'Three of Ashoka’s pillars carry an order against splitting the monastic community. The Pali tradition tells of a third council in his reign. The two sources overlap but are not the same story.',
 example:'The pillars say dividers of the community must wear white, the dress of lay people. The chronicles say sixty thousand false monks were expelled.',
 research:'Hultzsch, E. (1925). Inscriptions of Asoka, pp. 159–163. Bechert, H. (1982). The importance of Aśoka’s so-called schism edict. In Indological and Buddhist Studies (Festschrift de Jong). Norman, K. R. (1987). Aśoka’s “schism” edict. Bukkyōgaku Seminar 46.',
 desc:'A pillar beside a card that switches between the inscription, the Pali account of a third council, and a comparison of the two.',
 dur:10,hint:'Compare the inscription with the chronicle, then read what scholars make of the overlap.',
 init:()=>({v:'edict'}),
 watch(p){return {v:['edict','pali','both'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['edict','Inscription'],['pali','Chronicle'],['both','Compare']],label:'Source',get:s=>s.v,act:'v'}],
 on:{v(s,x){s.v=x;return 'keep'}},
 draw(s){
  let out=heading('An order against dividing the community');
  out+=R(62,96,36,216,'#e8dccb','#b8a58a',4)+R(48,312,64,14,'#d8c8ae','#b8a58a',3)+R(52,78,56,18,'#d8c8ae','#b8a58a',6);
  for(let i=0;i<7;i++)out+=L(68,150+i*14,92,150+i*14,'#a08c6c',1.4);
  out+=T(80,344,'pillar',12,C.muted);
  const d=P3_SCH[s.v];out+=P3_card(140,62,444,270,d[0],d[1],s.v==='pali'?C.amber:s.v==='both'?C.purple:C.green);
  out+=P3_tag(d[2]);
  return {svg:out,phase:s.v==='edict'?'Established: the wording survives on stone, in three places. It is addressed to the king’s officers and concerns the community as a whole.':s.v==='pali'?'Traditional account, first written down in Sri Lanka some six centuries after Ashoka.':'Debated: how far the Pali account of a third council can be matched to the inscriptions.'};
 }});

const P3_SITES=[
 ['Kandahar',65.7,31.6,'Edicts in Greek and Aramaic, for the peoples of the north-west frontier.',0,18],
 ['Shāhbāzgaṛhī',72.2,34.2,'Rock edicts in the Kharoṣṭhī script, later used for the Gandhāran scrolls.',12,4],
 ['Girnār',70.5,21.5,'A full set of the fourteen rock edicts, in Brāhmī script.',0,22],
 ['Bairāṭ',76.2,27.4,'The edict that names seven texts for the community to study.',-12,4],
 ['Lumbinī',83.3,27.5,'A pillar marking the Buddha’s birthplace, visited in the twentieth year of the reign.',12,-2],
 ['Sarnath',83.0,25.4,'A pillar with the order against dividing the community. Its lion capital is now India’s emblem.',12,12],
 ['Dhauli',85.8,20.2,'Rock edicts in Kaliṅga, the region whose conquest the king says he came to regret.',0,22],
 ['Brahmagiri',76.8,14.8,'A minor rock edict far to the south, in Karnataka.',0,22]];
SCENE({id:'ashoka-edicts-map',name:'Where the edicts stand',tag:'Four scripts across an empire',
 definition:'Ashoka’s inscriptions survive at more than thirty sites from Afghanistan to southern India. Most are in the Brāhmī script; those in the north-west use Kharoṣṭhī, Greek or Aramaic. They are the earliest securely dated writing about Buddhism.',
 example:'At Lumbinī a pillar records the king’s visit to the Buddha’s birthplace; at Kandahar the same policies are set out in Greek.',
 research:'Hultzsch, E. (1925). Inscriptions of Asoka. Falk, H. (2006). Aśokan Sites and Artefacts. Mainz: von Zabern. Prinsep, J. (1837). Journal of the Asiatic Society of Bengal 6 (decipherment of Brāhmī). Salomon, R. (1998). Indian Epigraphy. Oxford University Press.',
 desc:'A schematic map of eight inscription sites placed by longitude and latitude; pressing a site says what is written there and in which script.',
 dur:14,hint:'Press a site. Positions are schematic: west is left, north is up.',
 init:()=>({k:3}),
 watch(p){return {k:Math.min(7,Math.floor(p*8))}},
 ui:[{choose:P3_SITES.map((d,i)=>[i,d[0]]),label:'Site',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Eight of Ashoka’s inscription sites');
  const px=lon=>70+(lon-62)/28*460,py=lat=>272-(lat-12)/24*212;
  out+=R(16,44,568,244,'#f6f9fb',C.grid,8)+T(40,64,'N ↑',12,C.muted,'start');
  P3_SITES.forEach((d,i)=>{const x=px(d[1]),y=py(d[2]),on=i===s.k,a=d[4]>0?'start':d[4]<0?'end':'middle';
   out+=hit(X,'k',i,d[0],Ci(x,y,on?9:6,on?C.coral:C.blue,'#fff')+TB(x+d[4],y+d[5],d[0],12,on?C.coral:C.muted,a))});
  out+=P3_text(28,310,P3_SITES[s.k][3],544);
  out+=P3_tag('est');
  return {svg:out,phase:'Established: the inscriptions exist and can be read. James Prinsep deciphered Brāhmī in 1837, which first tied the “Beloved of the Gods” of the stones to the Ashoka of Buddhist tradition.'};
 }});

/* ---------------- Dating the Buddha ---------------- */
const P3_DATE={
 cal:[276,'Calendar era','Theravāda countries count the Buddhist Era from 544 or 543 BCE. This keeps the chronicles’ count of years but rests on an older, uncorrected date for Ashoka.'],
 long:[218,'Long chronology','The Sri Lankan chronicles place the death 218 years before Ashoka’s consecration. With Ashoka dated from Greek kings, that gives about 486 BCE (often quoted as 483).'],
 rev:[136,'Revised dating','Richard Gombrich (1992) recalculated from the chronicle’s list of teachers and proposed about 404 BCE. Many scholars now favour a death within a few decades of 400 BCE.'],
 short:[100,'Short chronology','Several northern Indian sources give about a hundred years, which would put the death around 368 BCE.']};
SCENE({id:'dating-the-buddha',name:'Dating the Buddha',tag:'A gap counted back from Ashoka',
 definition:'No source from the Buddha’s lifetime gives a date. Every proposed date is a number of years counted back from the reign of Ashoka, the first figure in Buddhist history who can be dated independently.',
 example:'If the Buddha died 218 years before Ashoka’s consecration in about 268 BCE, the death falls in about 486 BCE; if 100 years before, in about 368 BCE.',
 research:'Bechert, H. (ed.) (1991–97). The Dating of the Historical Buddha, 3 vols. Göttingen: Vandenhoeck & Ruprecht. Gombrich, R. (1992). Dating the Buddha: a red herring revealed. In Bechert vol. 2, 237–259. Cousins, L. S. (1996). The dating of the historical Buddha: a review article. Journal of the Royal Asiatic Society 6(1), 57–63.',
 desc:'A timeline from 650 to 200 BCE with Ashoka’s consecration fixed and a slider for the gap back to the Buddha’s death; presets show the long, short and revised chronologies.',
 dur:14,hint:'Move the gap, or choose a chronology. The eighty-year life is the traditional figure.',
 init:()=>({gap:218,p:'long'}),
 watch(p){const k=['cal','long','rev','short'][Math.min(3,Math.floor(p*4))];return {gap:P3_DATE[k][0],p:k}},
 ui:[{choose:[['cal','Calendar'],['long','Long'],['rev','Revised'],['short','Short']],label:'Chronology',get:s=>s.p,act:'p'},{range:'gap',label:'Years before Ashoka',min:60,max:280,step:2,get:s=>s.gap,act:'gap',show:v=>v+' years'}],
 on:{p(s,v){s.p=v;s.gap=P3_DATE[v][0];return 'keep'},gap(s,v){s.gap=Number(v);s.p='';return 'keep'}},
 draw(s){
  let out=heading('Count back from Ashoka');
  const x=y=>40+(650-y)/450*520,ay=120,death=268+s.gap,birth=death+80;
  out+=L(40,ay,560,ay,C.line,2);
  for(let y=600;y>=200;y-=100)out+=L(x(y),ay-5,x(y),ay+5,C.line,1.5)+TF(x(y),ay+22,y+' BCE',12,C.muted);
  out+=L(x(268),ay-44,x(268),ay+6,C.amber,2)+TB(x(268),ay-52,'Ashoka c. 268',12,C.amber);
  out+=R(x(Math.min(650,birth)),ay-14,x(death)-x(Math.min(650,birth)),10,'#b9d4e6','none',4)+Ci(x(death),ay-9,7,C.coral,'#fff');
  out+=P(`M${fmt(x(death))} ${ay+34} L${fmt(x(death))} ${ay+44} L${fmt(x(268))} ${ay+44} L${fmt(x(268))} ${ay+34}`,C.muted,1.5)+T((x(death)+x(268))/2,ay+62,`${s.gap} years`,12,C.muted);
  out+=TB(300,ay+90,`Death about ${death} BCE · birth about ${birth} BCE`,14,C.coral);
  const d=s.p?P3_DATE[s.p]:[0,'Your own gap','Every date for the Buddha is a gap like this one, counted back from Ashoka. Try the presets to see which sources give which gap.'];
  out+=R(16,226,568,120,'#fff',C.blue,8)+TB(28,250,d[1],13,C.blue,'start')+P3_text(28,274,d[2],544);
  out+=P3_tag('deb');
  return {svg:out,phase:`With a gap of ${s.gap} years the Buddha’s death falls about ${death} BCE. Scholars agree on the method and disagree on the gap; the dates in older books (c. 563–483 BCE) follow the long chronology.`};
 }});

const P3_KINGS=[['Antiochos II','Syria',261,246],['Ptolemy II','Egypt',285,246],['Antigonos','Macedon',276,239],['Magas','Cyrene',276,250],['Alexander','Epirus',272,255]];
SCENE({id:'dating-the-buddha-anchor',name:'How Ashoka is dated',tag:'Five Greek kings',
 definition:'Ashoka’s thirteenth rock edict names five Greek kings to whom he sent envoys. Their reigns are known from Greek and Roman sources, and all five reigned at once only for a few years. That overlap fixes Ashoka’s reign, and with it every earlier date in Indian history.',
 example:'Antiochos II came to the throne in 261 BCE and Alexander of Epirus died about 255 BCE, so the edict was composed between those years.',
 research:'Rock Edict XIII (Hultzsch 1925, pp. 43–49, 66–70). Eggermont, P. H. L. (1956). The Chronology of the Reign of Asoka Moriya. Leiden: Brill. Thapar, R. (1961). Aśoka and the Decline of the Mauryas.',
 desc:'Five bars for the reigns of the Greek kings named in the edict, with a year slider that counts how many were reigning and a shaded band where all five overlap.',
 dur:12,hint:'Slide the year until all five kings are reigning. That narrow window is the anchor.',
 init:()=>({y:270}),
 watch(p){return {y:Math.round(288-p*50)}},
 ui:[{range:'y',label:'Year',min:238,max:288,step:1,get:s=>s.y,act:'y',show:v=>v+' BCE'}],
 on:{y(s,v){s.y=Number(v);return 'keep'}},
 draw(s){
  let out=heading('When did all five reign together?');
  const x=y=>150+(290-y)/55*420;let n=0;
  out+=R(x(261),52,x(255)-x(261),196,'#fbefd5','none',0);
  P3_KINGS.forEach((k,i)=>{const y=62+i*36,on=s.y<=k[2]&&s.y>=k[3];if(on)n++;
   out+=TB(140,y+15,k[0],12,C.ink,'end')+R(x(k[2]),y,x(k[3])-x(k[2]),20,on?C.blue:'#b9d4e6','none',4)+TF(x(k[3])+6,y+15,k[1],12,C.muted,'start')});
  out+=L(150,250,570,250,C.line,1.5);for(let y=290;y>=240;y-=10)out+=L(x(y),250,x(y),255,C.line,1.2)+TF(x(y),270,String(y),12,C.muted);
  out+=L(x(s.y),52,x(s.y),250,C.coral,2,'stroke-dasharray="5 4"');
  out+=TB(300,300,`${n} of 5 reigning in ${s.y} BCE`,14,n===5?C.green:C.ink)+T(300,326,'shaded: all five together, about 261–255 BCE',12,C.muted);
  out+=P3_tag('est');
  return {svg:out,phase:'All five reigned together only between about 261 and 255 BCE. The edict belongs to about the thirteenth year of the reign, which puts Ashoka’s consecration near 268 BCE. Reign dates are approximate; those of Magas and Alexander are the least certain.'};
 }});

const P3_EV=[
 ['Chronicle arithmetic','The 218 years rest on Sri Lankan king lists compiled centuries later. Several of the reigns are suspiciously long and regular.'],
 ['Lists of teachers','The chronicles name five Vinaya teachers between the Buddha and Ashoka’s time. Five teaching lifetimes fit about 130 to 160 years more easily than 218.'],
 ['The 1988 symposium','A conference convened by Heinz Bechert near Göttingen found most specialists placing the death within a few decades of 400 BCE, with no single agreed date.'],
 ['Archaeology at Lumbinī','Excavators reported a timber shrine beneath the Māyā Devī temple from the 6th century BCE (Coningham et al. 2013). Critics reply that an early shrine need not have been a Buddhist one.']];
SCENE({id:'dating-the-buddha-evidence',name:'Weighing the evidence',tag:'Why the date moved',
 definition:'In the 20th century most books gave the Buddha’s dates as about 563–483 BCE. Since the 1980s many specialists have moved the death to around 400 BCE, because the chronicle figures behind the older date do not hold up well.',
 example:'The list of five teachers between the Buddha and Ashoka fits a gap of about 136 years better than 218.',
 research:'Bechert, H. (ed.) (1991–97). The Dating of the Historical Buddha. Gombrich, R. (1992) in Bechert vol. 2. Cousins, L. S. (1996). Journal of the Royal Asiatic Society 6(1), 57–63. Coningham, R. A. E. et al. (2013). The earliest Buddhist shrine: excavating the birthplace of the Buddha, Lumbini (Nepal). Antiquity 87, 1104–1123.',
 desc:'Four pieces of evidence as rows; pressing one explains what it shows and how it bears on the date.',
 dur:10,hint:'Press each piece of evidence. None gives a date by itself; together they shift the range.',
 init:()=>({k:1}),
 watch(p){return {k:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:P3_EV.map((d,i)=>[i,d[0]]),label:'Evidence',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Four lines of evidence');
  P3_EV.forEach((d,i)=>out+=P3_row(X,'k',i,16,54+i*36,568,d[0],i===s.k));
  const d=P3_EV[s.k];out+=R(16,206,568,138,'#fff',C.blue,8)+P3_text(28,230,d[1],544);
  out+=P3_tag('deb');
  return {svg:out,phase:'Debated. A death around 400 BCE is now the most common scholarly estimate, but dates from about 480 to 370 BCE all have defenders, and the calendar era of 544/543 BCE remains in religious use.'};
 }});
