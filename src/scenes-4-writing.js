/* Tripitaka In Motion · era 4 · Writing it down (1st century BCE–5th century CE).
   Palm leaves in Sri Lanka, birch-bark scrolls from Gandhāra, the commentaries, and the Sanskrit canons.
   Every scene carries an evidence tag: traditional account, established, or debated. */

const P4_wrap=(s,n)=>{const w=String(s).split(' '),out=[];let l='';for(const x of w){if((l+' '+x).trim().length>n){if(l)out.push(l);l=x}else l=(l+' '+x).trim()}if(l)out.push(l);return out};
const P4_text=(x,y,str,w,col=C.ink,size=13,lh=22)=>P4_wrap(str,Math.floor(w/9.4)).map((l,i)=>T(x,y+i*lh,l,size,col,'start')).join('');
const P4_TAGS={trad:['traditional account','#8a5a00','#fbefd5'],est:['established','#236b5e','#dceee8'],deb:['debated','#5b4696','#ece6f6']};
const P4_tag=k=>{const [t,c,b]=P4_TAGS[k];return R(190,352,220,24,b,c,12)+T(300,369,t,12,c)};
const P4_card=(x,y,w,h,title,body,col=C.blue)=>R(x,y,w,h,'#fff',col,8)+TB(x+12,y+24,title,13,col,'start')+P4_text(x+12,y+48,body,w-24);
const P4_row=(X,act,i,x,y,w,label,on,extra='')=>hit(X,act,i,label,R(x,y,w,30,on?C.pale:'#fff',on?C.blue:C.grid,6)+TB(x+10,y+20,label,12,on?C.ink:C.muted,'start')+extra);
// Wavy strokes that stand for writing without pretending to be any real script.
const P4_scribble=(x,y,w,col,sw=1.4,seed=1)=>{let d=`M${x} ${y}`;const n=Math.floor(w/9);for(let i=1;i<=n;i++){const up=((i*7+seed*3)%5)-2;d+=` q4.5 ${up*2.2} 9 0`}return P(d,col,sw)};

/* ---------------- Palm leaf ---------------- */
const P4_LEAF=[
 ['Cut','Young leaves of the talipot or palmyra palm are cut and the stiff ribs removed.'],
 ['Boil and dry','The strips are boiled, dried in the shade and polished until they are pale and flexible.'],
 ['Trim and punch','Leaves are trimmed to one long shape and punched with one or two holes for a cord.'],
 ['Incise','A scribe scratches the letters with a metal stylus. The grooves are almost invisible.'],
 ['Ink','Lampblack mixed with oil is rubbed over the leaf and wiped off. Ink stays only in the grooves.'],
 ['Bind','Leaves are stacked between wooden boards and tied with the cord through the holes.']];
SCENE({id:'palm-leaf',name:'Making a palm-leaf book',tag:'Stylus, soot and cord',
 definition:'For about two thousand years the usual book in South and South-East Asia was a stack of long, narrow palm leaves, incised with a stylus, inked with soot and tied with a cord through holes in the leaves.',
 example:'The writing is scratched in first and is nearly invisible until oily soot is rubbed across the leaf and wiped away.',
 research:'Agrawal, O. P. (1984). Conservation of Manuscripts and Paintings of South-east Asia. London: Butterworths. Berkwitz, S. C., Schober, J. & Brown, C. (eds) (2009). Buddhist Manuscript Cultures. Routledge.',
 desc:'One long leaf changing through six steps from green strip to inked, bound page; the marks on it are an impression, not real writing.',
 dur:12,hint:'Step through the six stages. Watch for the moment the scratched letters become visible.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(5,Math.floor(p*6))}},
 ui:[{range:'k',label:'Step',min:0,max:5,step:1,get:s=>s.k,act:'k',show:v=>P4_LEAF[v][0]}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s){
  let out=heading(`Step ${s.k+1} of 6: ${P4_LEAF[s.k][0].toLowerCase()}`);
  const fill=s.k===0?'#b9d39a':s.k===1?'#e3d9a8':'#eadfb6',x0=50,w=500,y0=80,h=70;
  if(s.k===5){for(let i=4;i>=1;i--)out+=R(x0+i*3,y0+i*5,w,h,'#e2d5a6','#b8a56a',4)}
  out+=s.k===0?P(`M${x0} ${y0+h/2} Q${x0+w/2} ${y0-12} ${x0+w} ${y0+h/2} Q${x0+w/2} ${y0+h+12} ${x0} ${y0+h/2}Z`,'#6f9a4c',2,fill):R(x0,y0,w,h,fill,'#b8a56a',4);
  if(s.k>=2)out+=Ci(x0+w*.3,y0+h/2,5,'#fff','#b8a56a')+Ci(x0+w*.7,y0+h/2,5,'#fff','#b8a56a');
  if(s.k>=3){const col=s.k>=4?'#2b2418':'#d2c592';for(let r=0;r<4;r++){const y=y0+14+r*14;out+=P4_scribble(x0+14,y,w*.3-28,col,1.4,r)+P4_scribble(x0+w*.3+14,y,w*.4-28,col,1.4,r+2)+P4_scribble(x0+w*.7+14,y,w*.3-28,col,1.4,r+4)}}
  if(s.k===5)out+=L(x0+w*.3,y0-10,x0+w*.3,y0+h+34,'#8a5a00',2.5)+L(x0+w*.7,y0-10,x0+w*.7,y0+h+34,'#8a5a00',2.5);
  if(s.k>=3)out+=T(300,y0+h+(s.k===5?56:26),'impression, not real text',12,C.muted);
  out+=P4_card(16,214,568,130,P4_LEAF[s.k][0],P4_LEAF[s.k][1]);
  out+=P4_tag('est');
  return {svg:out,phase:'Established craft, still practised. The rounded letters of Sinhala, Burmese and other southern scripts are often linked to this technique, since straight strokes along the grain can split a leaf.'};
 }});

const P4_ALU={
 says:['What the chronicles say','The Dīpavaṃsa and Mahāvaṃsa say that in the reign of King Vaṭṭagāmaṇī Abhaya, monks who had until then carried the three baskets and their commentary by memory had them written in books, so that the teaching would last.','trad'],
 why:['Why then?','Later sources give reasons: a long famine in which reciters died, invasion and civil war, and rivalry between the old Mahāvihāra and the new Abhayagiri monastery.','trad'],
 unsure:['What is uncertain','The reign falls in the 1st century BCE (29–17 BCE on one reckoning). The chronicles were compiled four to five centuries later. The site, Āluvihāra near Mātale, is named only in much later texts, and no manuscript of that age survives.','deb']};
SCENE({id:'palm-leaf-aluvihara',name:'Written in books',tag:'Sri Lanka, 1st century BCE',
 definition:'Sri Lankan chronicles record that the Pali canon and its commentary, until then recited from memory, were written down in the 1st century BCE. It is the tradition’s own account of when the three baskets became a written text.',
 example:'The Mahāvaṃsa gives the event two verses: wise monks had handed the texts down orally, and seeing people falling away, they met and had them written in books.',
 research:'Dīpavaṃsa 20.20–21; Mahāvaṃsa 33.100–101 (trans. W. Geiger 1912). Norman, K. R. (1983). Pāli Literature, pp. 10–11. Collins, S. (1990). On the very idea of the Pali canon. Journal of the Pali Text Society 15, 89–126.',
 desc:'A timeline from 100 BCE to 550 CE marking the traditional date of the writing down and the later dates of the chronicles that report it, with a card for each view.',
 dur:10,hint:'Read what the chronicles say, then look at how long after the event they were written.',
 init:()=>({v:'says'}),
 watch(p){return {v:['says','why','unsure'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['says','Chronicles'],['why','Reasons'],['unsure','Uncertain']],label:'View',get:s=>s.v,act:'v'}],
 on:{v(s,x){s.v=x;return 'keep'}},
 draw(s){
  let out=heading('From memory to manuscript');
  const x=y=>50+(y+100)/650*500,ay=96;
  out+=L(50,ay,550,ay,C.line,2);[[-100,'100 BCE'],[100,'100 CE'],[300,'300'],[500,'500 CE']].forEach(([y,l])=>out+=L(x(y),ay-5,x(y),ay+5,C.line,1.5)+TF(x(y),ay+22,l,12,C.muted));
  out+=Ci(x(-25),ay,8,C.coral,'#fff')+TB(x(-25),ay-16,'written down',12,C.coral)+Ci(x(350),ay,6,C.blue,'#fff')+T(x(350),ay-16,'Dīpavaṃsa',12,C.blue)+Ci(x(500),ay,6,C.blue,'#fff')+T(x(500)-4,ay-34,'Mahāvaṃsa',12,C.blue);
  out+=P(`M${fmt(x(-25))} ${ay+34} L${fmt(x(-25))} ${ay+44} L${fmt(x(350))} ${ay+44} L${fmt(x(350))} ${ay+34}`,C.muted,1.5)+T((x(-25)+x(350))/2,ay+62,'about four centuries',12,C.muted);
  const d=P4_ALU[s.v];out+=P4_card(16,176,568,168,d[0],d[1],s.v==='unsure'?C.purple:C.amber);
  out+=P4_tag(d[2]);
  return {svg:out,phase:s.v==='unsure'?'The chronicle dates are approximate. Historians generally accept that the Pali texts were written down in Sri Lanka around this time, while noting that the canon was not closed by the act of writing.':'Traditional account. The chronicles also say the commentary was written down at the same time.'};
 }});

SCENE({id:'palm-leaf-survival',name:'Why old copies are rare',tag:'A text survives by being recopied',
 definition:'In a warm, damp climate a palm-leaf manuscript lasts a few centuries at most before insects, mould and brittleness destroy it. A text survives only if it is copied again and again, and each copying can add slips.',
 example:'If a manuscript lasts 250 years, a text written down two thousand years ago reaches us through a chain of at least eight manuscripts, each copied from the one before.',
 research:'von Hinüber, O. (1991). The Oldest Pāli Manuscript: Four Folios of the Vinaya-Piṭaka from the National Archives, Kathmandu. Mainz: Akademie der Wissenschaften. von Hinüber, O. (1996). A Handbook of Pāli Literature, §§ 8–10. Berlin: de Gruyter.',
 desc:'A chain of manuscripts across two thousand years whose length depends on how long each copy lasts, with a count of manuscripts in the chain and of slips that would build up if none were corrected.',
 dur:12,hint:'Shorten the life of a manuscript and count the links in the chain. Then raise the slips per copy. The model is illustrative.',
 init:()=>({life:250,slip:3}),
 watch(p){return {life:Math.round((600-p*450)/50)*50,slip:3}},
 ui:[{range:'life',label:'A copy lasts',min:100,max:600,step:50,get:s=>s.life,act:'life',show:v=>v+' years'},{range:'slip',label:'Slips per copy',min:1,max:10,step:1,get:s=>s.slip,act:'slip',show:v=>v+' per 1,000 words'}],
 on:{life(s,v){s.life=Number(v);return 'keep'},slip(s,v){s.slip=Number(v);return 'keep'}},
 draw(s){
  const gens=Math.ceil(2000/s.life),x=t=>50+t/2000*500;let out=heading('Two thousand years of recopying');
  out+=L(50,150,550,150,C.line,2);[[0,'written'],[500,'500'],[1000,'1,000'],[1500,'1,500'],[2000,'2,000 yrs']].forEach(([t,l])=>out+=L(x(t),145,x(t),155,C.line,1.5)+TF(x(t),172,l,12,C.muted));
  for(let i=0;i<gens;i++){const a=x(i*s.life),b=x(Math.min(2000,(i+1)*s.life));out+=R(a+1,96,Math.max(2,b-a-3),26,i===gens-1?'#eadfb6':'#f1ead0','#b8a56a',4);if(b-a>26)out+=TF((a+b)/2,114,String(i+1),12,'#6b5a2a')}
  out+=T(300,80,'each bar is one manuscript; the last is the one we can read',12,C.muted);
  out+=R(40,198,250,84,C.pale,'none',8)+TB(165,232,String(gens),26,C.blue)+T(165,262,'manuscripts in the chain',12,C.ink);
  out+=R(310,198,250,84,'#f9e2d9','none',8)+TB(435,232,String((gens-1)*s.slip),26,C.coral)+T(435,262,'slips per 1,000 words',12,C.ink);
  out+=T(300,310,'if no copyist ever corrected against another copy',12,C.muted)+T(300,332,'illustrative model, not measured rates',12,C.muted);
  out+=P4_tag('est');
  return {svg:out,phase:`A copy that lasts ${s.life} years means a chain of ${gens} manuscripts and ${gens-1} copyings in two thousand years. This is why the oldest known Pali manuscript, four leaves found in Kathmandu, dates only from about the 9th century, and most surviving Pali manuscripts were copied in the 18th and 19th centuries.`};
 }});

/* ---------------- The Gandhāran scrolls ---------------- */
const P4_GAND=[
 ['The find','Twenty-nine fragments of birch-bark scrolls, acquired by the British Library in 1994. They are thought to come from eastern Afghanistan, where they had been stored in a clay pot.'],
 ['The pot','The pot carries a dedication to teachers of the Dharmaguptaka school. It is the main clue to who owned the scrolls.'],
 ['Script and language','Written in the Kharoṣṭhī script, right to left, in Gāndhārī, a Middle Indo-Aryan language of the north-west.'],
 ['Rhinoceros Sūtra','Verses in praise of the solitary life. A version also survives in Pali, in the Sutta Nipāta.'],
 ['Dharmapada','Part of a collection of verses on the teaching, parallel to the Pali Dhammapada.'],
 ['Other texts','Discourses with Pali and Chinese parallels, verses on past deeds spoken at Lake Anavatapta, commentaries and stories.']];
SCENE({id:'gandharan-scrolls',name:'The Gandhāran scrolls',tag:'The oldest Buddhist manuscripts',
 definition:'Birch-bark scrolls from ancient Gandhāra, in today’s Afghanistan and Pakistan, are the oldest Buddhist manuscripts known. The first group to be studied, now in the British Library, dates from about the 1st century CE.',
 example:'One scroll holds the Rhinoceros Sūtra, whose verses were already known from the Pali canon, here in a different language and script.',
 research:'Salomon, R. (1999). Ancient Buddhist Scrolls from Gandhāra: The British Library Kharoṣṭhī Fragments. London: British Library; Seattle: University of Washington Press. Salomon, R. (2018). The Buddhist Literature of Ancient Gandhāra. Wisdom Publications.',
 desc:'Six aspects of the British Library scrolls as a list, with a card explaining each and a small drawing of a rolled scroll.',
 dur:12,hint:'Press each item to see what was found and how it is known.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(5,Math.floor(p*6))}},
 ui:[{choose:P4_GAND.map((d,i)=>[i,d[0]]),label:'Item',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Birch bark from Gandhāra');
  P4_GAND.forEach((d,i)=>out+=P4_row(X,'k',i,16,52+i*34,206,d[0],i===s.k));
  const d=P4_GAND[s.k];out+=P4_card(234,52,350,200,d[0],d[1]);
  out+=R(60,272,120,58,'#e9dcc0','#b39a6b',6)+Ci(60,301,29,'#dccba6','#b39a6b')+Ci(60,301,16,'#e9dcc0','#b39a6b')+Ci(60,301,5,'#fff','#b39a6b');
  for(let r=0;r<3;r++)out+=P4_scribble(98,286+r*14,70,'#5a4a2c',1.2,r);
  out+=T(396,290,'a rolled birch-bark scroll',12,C.muted)+T(396,312,'(impression, not real text)',12,C.muted);
  out+=P4_tag('est');
  return {svg:out,phase:'Established: the scrolls exist, have been read and published, and are dated by script and language to about the first half of the 1st century CE. They are among the oldest manuscripts of any kind from South Asia.'};
 }});

const P4_C14=[['“Split” collection scroll',-184,-46,'Falk 2011'],['Perfection of Wisdom scroll',47,147,'Falk & Karashima 2012'],['Senior collection',130,250,'Allon et al. 2006']];
SCENE({id:'gandharan-scrolls-dating',name:'Dating by carbon',tag:'A clock in the bark',
 definition:'Birch bark was once alive, so it contains carbon-14, which decays by half every 5,730 years. Measuring how much is left gives the age of the bark, and so an earliest date for the writing on it.',
 example:'A scroll with about 79% of its carbon-14 left is roughly 1,950 years old.',
 research:'Allon, M., Salomon, R., Jacobsen, G. & Zoppi, U. (2006). Radiocarbon dating of Kharoṣṭhī fragments from the Schøyen and Senior manuscript collections. In Buddhist Manuscripts vol. 3, 279–291. Oslo: Hermes. Falk, H. (2011). The “Split” collection of Kharoṣṭhī texts. ARIRIAB 14, 13–23. Falk, H. & Karashima, S. (2012). A first-century Prajñāpāramitā manuscript from Gandhāra. ARIRIAB 15, 19–61.',
 desc:'A slider for the share of carbon-14 remaining gives an age and a date on a timeline, beside the published date ranges of three Gandhāran manuscript groups.',
 dur:12,hint:'Set the share of carbon-14 left and see which published range the date falls in. Real dating also needs a calibration curve.',
 init:()=>({f:79.5}),
 watch(p){return {f:Math.round((76.5+p*5.5)*10)/10}},
 ui:[{range:'f',label:'Carbon-14 left',min:76,max:83,step:.1,get:s=>s.f,act:'f',show:v=>Number(v).toFixed(1)+'%'}],
 on:{f(s,v){s.f=Number(v);return 'keep'}},
 draw(s){
  const age=-5730*Math.log2(s.f/100),date=1950-age,x=d=>60+(d+350)/800*500;
  let out=heading('How old is the bark?');
  out+=TB(300,66,`${s.f.toFixed(1)}% left → about ${Math.round(age/10)*10} years old`,14,C.ink);
  P4_C14.forEach((d,i)=>{const y=92+i*46,on=date>=d[1]&&date<=d[2];
   out+=R(x(d[1]),y,x(d[2])-x(d[1]),18,on?C.blue:'#b9d4e6','none',4)+T(x((d[1]+d[2])/2),y+36,d[0],12,on?C.ink:C.muted)});
  out+=L(60,236,560,236,C.line,2);[[-300,'300 BCE'],[-100,'100 BCE'],[100,'100 CE'],[300,'300 CE']].forEach(([d,l])=>out+=L(x(d),231,x(d),241,C.line,1.5)+TF(x(d),258,l,12,C.muted));
  out+=L(x(date),84,x(date),236,C.coral,2,'stroke-dasharray="5 4"')+Ci(x(date),236,6,C.coral,'#fff');
  const dr=Math.round(date/10)*10,lab=dr<0?`about ${-dr} BCE`:dr===0?'about the year 1 CE':`about ${dr} CE`;
  out+=TB(300,290,lab,15,C.coral)+T(300,316,'bars: published ranges, approximate',12,C.muted)+T(300,336,'simplified: no calibration curve',12,C.muted);
  out+=P4_tag('est');
  const hitr=P4_C14.find(d=>date>=d[1]&&date<=d[2]);
  return {svg:out,phase:`${s.f.toFixed(1)}% of the original carbon-14 gives an age of about ${Math.round(age/10)*10} years, ${lab}.${hitr?` That falls inside the range published for the ${hitr[0]} (${hitr[3]}).`:''} Radiocarbon dates the bark, not the ink, and comes with a range, so it is used together with the style of the script.`};
 }});

const P4_RH=[
 ['eko','eko','Identical in both: “alone”.'],
 ['care','care','Identical in both: “one should wander”.'],
 ['khargaviṣaṇagapo','khaggavisāṇakappo','The same compound, “like the rhinoceros”. Gāndhārī keeps r before g (kharga) where Pali has gg (khagga), has ṣ where Pali has s, and softens kappo to gapo.']];
SCENE({id:'gandharan-scrolls-compare',name:'One verse, two languages',tag:'Gāndhārī beside Pali',
 definition:'When the same verse survives in Gāndhārī and in Pali, the two can be laid side by side. The words match closely, and the differences follow regular sound patterns, which shows two regional versions of one inherited text.',
 example:'The refrain of the Rhinoceros Sūtra reads eko care khargaviṣaṇagapo in Gāndhārī and eko care khaggavisāṇakappo in Pali.',
 research:'Salomon, R. (2000). A Gāndhārī Version of the Rhinoceros Sūtra: British Library Kharoṣṭhī Fragment 5B. Seattle: University of Washington Press. Norman, K. R. (trans.) (1992). The Group of Discourses (Sutta-nipāta), vv. 35–75.',
 desc:'The refrain of the Rhinoceros Sūtra in Gāndhārī above and Pali below, word aligned with word; pressing a pair explains what is the same and what differs.',
 dur:10,hint:'Press each pair of words. Two are identical; the third shows regular sound differences.',
 init:()=>({k:2}),
 watch(p){return {k:Math.min(2,Math.floor(p*3))}},
 ui:[{choose:[[0,'eko'],[1,'care'],[2,'the compound']],label:'Word',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('“…wander alone like the rhinoceros”');
  const xs=[90,180,400],ws=[70,70,280];
  out+=TB(16,92,'Gāndhārī',12,C.purple,'start')+TB(16,168,'Pali',12,C.blue,'start');
  P4_RH.forEach((d,i)=>{const on=i===s.k,x=xs[i],w=ws[i];
   out+=hit(X,'k',i,`${d[0]} and ${d[1]}`,R(x-w/2,104,w,34,on?'#ece6f6':'#fff',on?C.purple:C.grid,6)+TB(x,127,d[0],14,C.ink)+R(x-w/2,180,w,34,on?C.pale:'#fff',on?C.blue:C.grid,6)+TB(x,203,d[1],14,C.ink)+L(x,138,x,180,on?C.coral:C.line,on?2.5:1.5))});
  out+=R(16,232,568,112,'#fff',C.blue,8)+P4_text(28,256,P4_RH[s.k][2],544);
  out+=P4_tag('est');
  return {svg:out,phase:'Established reading (Salomon 2000). Kharoṣṭhī does not mark long vowels or doubled consonants, so the Gāndhārī is shown as transcribed. The two versions share most verses but arrange them in a different order.'};
 }});

/* ---------------- The commentaries ---------------- */
const P4_LAYER={
 root:['Root text','The canonical text itself, for example a discourse of the Majjhima Nikāya.'],
 comm:['Commentary (aṭṭhakathā)','Explains words, tells the setting of a discourse and resolves difficulties. Buddhaghosa, working at the Mahāvihāra in Anurādhapura in the 5th century, recast older Sinhala commentaries into Pali.'],
 sub:['Sub-commentary (ṭīkā)','Explains the commentary in turn. Dhammapāla and later authors, especially in 12th-century Sri Lanka and in Burma, wrote these.']};
SCENE({id:'commentaries',name:'Layers of commentary',tag:'Text, commentary, sub-commentary',
 definition:'Around the Pali canon grew layers of explanation: commentaries (aṭṭhakathā) on the canonical texts, and sub-commentaries (ṭīkā) on the commentaries. Most of the Pali commentaries were put into their present form in Sri Lanka in the 5th century.',
 example:'A reader of a discourse in the Majjhima Nikāya can turn to Buddhaghosa’s commentary on it, and then to a sub-commentary on that.',
 research:'von Hinüber, O. (1996). A Handbook of Pāli Literature, §§ 203–384. Berlin: de Gruyter. Norman, K. R. (1983). Pāli Literature, ch. 3. Endo, T. (2013). Studies in Pāli Commentarial Literature. Hong Kong: Centre of Buddhist Studies.',
 desc:'Three nested frames for root text, commentary and sub-commentary; pressing a frame says what it is, who wrote it and when.',
 dur:10,hint:'Press each frame, from the innermost outwards.',
 init:()=>({v:'comm'}),
 watch(p){return {v:['root','comm','sub'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['root','Root text'],['comm','Commentary'],['sub','Sub-commentary']],label:'Layer',get:s=>s.v,act:'v'}],
 on:{v(s,x){s.v=x;return 'keep'}},
 draw(s,f,X){
  let out=heading('A text and its explanations');
  const box=(k,x,y,w,h,lab,col,bg)=>hit(X,'v',k,lab,R(x,y,w,h,s.v===k?bg:'#fff',s.v===k?col:C.grid,8)+TB(x+10,y+22,lab,12,s.v===k?col:C.muted,'start'));
  out+=box('sub',16,56,270,286,'Sub-commentary',C.purple,'#f4f0fa')+box('comm',36,98,230,220,'Commentary',C.amber,'#fdf6e6')+box('root',56,140,190,150,'Root text',C.blue,C.pale);
  for(let r=0;r<5;r++)out+=P4_scribble(70,186+r*20,160,'#7a8a94',1.3,r);
  const d=P4_LAYER[s.v];out+=P4_card(300,56,284,286,d[0],d[1],s.v==='sub'?C.purple:s.v==='comm'?C.amber:C.blue);
  out+=P4_tag('est');
  return {svg:out,phase:'Established: the works survive and their date is fixed within a few decades. The life story of Buddhaghosa comes from the continuation of the Mahāvaṃsa and from later legend, and is a traditional account.'};
 }});

const P4_VIS=['Virtue described','The ascetic practices','Taking a meditation subject','The earth disc','The other discs','Foulness as a subject','Six recollections','Other recollections','The divine abidings','The formless states','Concentration: conclusion','The supernormal powers','Other direct knowledges','The aggregates','The bases and elements','The faculties and truths','Dependent origination','Purification of view','Overcoming doubt','Path and not-path','Knowledge of the way','Knowledge and vision','Benefits of understanding'];
const P4_part=c=>c<=2?0:c<=13?1:2;
const P4_PARTS=[['Virtue (sīla)','chapters 1–2',C.green,'#dceee8'],['Concentration (samādhi)','chapters 3–13',C.blue,C.pale],['Understanding (paññā)','chapters 14–23',C.purple,'#ece6f6']];
SCENE({id:'commentaries-visuddhimagga',name:'The Visuddhimagga',tag:'Twenty-three chapters, three parts',
 definition:'The Visuddhimagga, “The Path of Purification”, is Buddhaghosa’s summary of the teaching as understood at the Mahāvihāra. Its twenty-three chapters are arranged in three parts: virtue, concentration and understanding.',
 example:'Chapters 3 to 13 form the middle part, on concentration; chapter 17 sets out dependent origination.',
 research:'Buddhaghosa (5th century). Visuddhimagga, trans. Bhikkhu Ñāṇamoli (1956), The Path of Purification. Colombo: Semage; later Kandy: Buddhist Publication Society. von Hinüber, O. (1996). A Handbook of Pāli Literature, §§ 245–250.',
 desc:'Twenty-three chapter cells in a row coloured by part; a slider picks a chapter and shows its part and subject.',
 dur:12,hint:'Slide through the chapters and watch the part change. This shows how the book is organised, not what it teaches.',
 init:()=>({c:1}),
 watch(p){return {c:1+Math.min(22,Math.floor(p*23))}},
 ui:[{range:'c',label:'Chapter',min:1,max:23,step:1,get:s=>s.c,act:'c',show:v=>'chapter '+v}],
 on:{c(s,v){s.c=Number(v);return 'keep'},pick(s,v){s.c=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('How the Visuddhimagga is arranged');
  for(let c=1;c<=23;c++){const p=P4_PARTS[P4_part(c)],x=24+(c-1)*24,on=c===s.c;
   out+=hit(X,'pick',c,`Chapter ${c}`,R(x,70,21,on?46:36,on?p[2]:p[3],p[2],4)+TF(x+10.5,92,String(c),11,on?'#fff':p[2]))}
  P4_PARTS.forEach((p,i)=>{const on=P4_part(s.c)===i,y=142+i*34;out+=R(24,y,552,28,on?p[3]:'#fff',on?p[2]:C.grid,6)+TB(36,y+19,p[0],12,on?p[2]:C.muted,'start')+T(564,y+19,p[1],12,on?p[2]:C.muted,'end')});
  out+=R(24,254,552,86,'#fff',P4_PARTS[P4_part(s.c)][2],8)+TB(300,284,`Chapter ${s.c}`,14,P4_PARTS[P4_part(s.c)][2])+T(300,314,P4_VIS[s.c-1],14,C.ink);
  out+=P4_tag('est');
  return {svg:out,phase:`Chapter ${s.c}, “${P4_VIS[s.c-1]}”, belongs to the part on ${P4_PARTS[P4_part(s.c)][0].toLowerCase()}. Chapter titles are shortened from Ñāṇamoli’s translation. The book became the standard manual of the Theravāda tradition.`};
 }});

const P4_ATTR=[
 ['Visuddhimagga',2,'His own composition. The other commentaries refer back to it.'],
 ['Four Nikāya commentaries',2,'On the Dīgha, Majjhima, Saṃyutta and Aṅguttara Nikāyas. They refer to the Visuddhimagga and to one another.'],
 ['Vinaya commentary',1,'The Samantapāsādikā. A Chinese version was translated in 489 CE, which fixes a latest date for the Pali.'],
 ['Abhidhamma commentaries',0,'The Atthasālinī and its companions. Their style and their own statements have led many scholars to assign them to another author.'],
 ['Dhammapada commentary',0,'Attributed to him by tradition, but different in language and method. Most scholars treat it as anonymous.'],
 ['Jātaka commentary',0,'The prose stories that frame the birth-story verses. Traditionally his; generally treated as the work of an unknown compiler.']];
SCENE({id:'commentaries-attribution',name:'Which works are Buddhaghosa’s?',tag:'Tradition and attribution',
 definition:'Tradition credits Buddhaghosa with commentaries on most of the Pali canon. Comparing their language, method and cross-references, scholars accept some as his and doubt others.',
 example:'The Visuddhimagga and the commentaries on the four main Nikāyas are accepted; the Dhammapada commentary is usually treated as anonymous.',
 research:'von Hinüber, O. (1996). A Handbook of Pāli Literature, §§ 207–260. Norman, K. R. (1983). Pāli Literature, pp. 120–130. Pind, O. H. (1992). Buddhaghosa: his works and scholarly background. Buddhist Studies (Bukkyō Kenkyū) 21, 135–156.',
 desc:'Six works attributed to Buddhaghosa as rows, each marked secure, generally accepted or doubted; pressing a row gives the reason.',
 dur:12,hint:'Press each work. Green is secure, amber generally accepted, purple doubted.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(5,Math.floor(p*6))}},
 ui:[{choose:P4_ATTR.map((d,i)=>[i,d[0]]),label:'Work',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Six works, three levels of confidence');
  const lab=['doubted','generally accepted','secure'],col=['#5b4696','#8a5a00','#236b5e'],bg=['#ece6f6','#fbefd5','#dceee8'];
  P4_ATTR.forEach((d,i)=>{const y=50+i*33;out+=P4_row(X,'k',i,16,y,568,d[0],i===s.k,R(414,y+5,160,20,bg[d[1]],'none',10)+T(494,y+19,lab[d[1]],11,col[d[1]]))});
  out+=R(16,252,568,94,'#fff',C.blue,8)+P4_text(28,276,P4_ATTR[s.k][2],544);
  out+=P4_tag('deb');
  return {svg:out,phase:'Debated at the edges. All these works come from the same Mahāvihāra tradition and draw on older Sinhala commentaries now lost; the question is only which were written by Buddhaghosa himself.'};
 }});

/* ---------------- The Sanskrit canons ---------------- */
const P4_FINDS=[
 ['Gilgit, 1931','Birch-bark and paper books found in a ruined building in the mountains of northern Pakistan, mostly from about the 6th to 8th centuries. They include much of the Mūlasarvāstivāda Vinaya and copies of the Lotus Sūtra.'],
 ['Turfan, 1902–1914','German expeditions to oases on the northern Silk Road brought back thousands of Sanskrit fragments, many from Sarvāstivāda texts. The earliest date from about the 2nd century.'],
 ['Bāmiyān, 1990s','Thousands of fragments from caves in Afghanistan, now mostly in the Schøyen Collection, from the 2nd to 8th centuries, on palm leaf, birch bark and leather.'],
 ['Nepal','A cooler climate and continuous copying preserved Sanskrit Buddhist books in the Kathmandu Valley. Brian Hodgson sent many to Europe in the 1830s.']];
SCENE({id:'sanskrit-canons',name:'The Sanskrit canons',tag:'Recovered from fragments',
 definition:'Several early schools kept their canons in Sanskrit or in Sanskritised language. These were lost in India and survive only in Chinese and Tibetan translation and in manuscript fragments found in Central Asia, Afghanistan, Kashmir and Nepal.',
 example:'The Gilgit find of 1931 preserved a large part of the Mūlasarvāstivāda Vinaya in Sanskrit, which until then was known only in Tibetan and Chinese.',
 research:'von Hinüber, O. (2014). The Gilgit manuscripts: an ancient Buddhist library in modern research. In P. Harrison & J.-U. Hartmann (eds), From Birch Bark to Digital Data, 79–135. Vienna: ÖAW. Braarvig, J. (ed.) (2000–). Buddhist Manuscripts in the Schøyen Collection. Oslo: Hermes. Waldschmidt, E. et al. (1965–). Sanskrithandschriften aus den Turfanfunden. Wiesbaden: Steiner.',
 desc:'Four manuscript finds as a list, with a card describing what each preserved and when it was found.',
 dur:10,hint:'Press each find. Notice how much depends on climate and on chance.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:P4_FINDS.map((d,i)=>[i,d[0]]),label:'Find',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Where the Sanskrit texts were found');
  P4_FINDS.forEach((d,i)=>out+=P4_row(X,'k',i,16,56+i*36,206,d[0],i===s.k));
  out+=T(119,226,'dry or cold places',12,C.muted)+T(119,246,'keep manuscripts',12,C.muted);
  const d=P4_FINDS[s.k];out+=P4_card(234,56,350,286,d[0],d[1]);
  out+=P4_tag('est');
  return {svg:out,phase:'Established finds. No complete Sanskrit canon of any early school survives; scholars reassemble them from fragments and from the Chinese and Tibetan translations.'};
 }});

const P4_LANG=[['Pali',['dhamma','bhikkhu','sutta','nibbāna','ariya'],'A literary Middle Indo-Aryan language. Groups of consonants are smoothed: dharma becomes dhamma.'],
 ['Gāndhārī',['dhama','bhikhu','sutra','nivana','aria'],'The Middle Indo-Aryan language of the north-west. Its script, Kharoṣṭhī, wrote neither long vowels nor doubled consonants. Spellings vary between scrolls.'],
 ['Sanskrit',['dharma','bhikṣu','sūtra','nirvāṇa','ārya'],'From about the 1st century CE northern schools increasingly recast their texts in Sanskrit, the language of learning. In-between stages are called Buddhist Hybrid Sanskrit.']];
const P4_ENG=['teaching','monk','discourse','nirvana','noble'];
SCENE({id:'sanskrit-canons-language',name:'One word, three spellings',tag:'Pali, Gāndhārī, Sanskrit',
 definition:'The early schools passed on their texts in related Indian languages. The same words appear in Pali, Gāndhārī and Sanskrit in forms that differ by regular sound rules, so a text’s language is a clue to where and when a version was made.',
 example:'Pali dhamma, Gāndhārī dhama and Sanskrit dharma are one word.',
 research:'Edgerton, F. (1953). Buddhist Hybrid Sanskrit Grammar and Dictionary. New Haven: Yale University Press. Norman, K. R. (1983). Pāli Literature, ch. 1. Salomon, R. (2001). “Gāndhārī hybrid Sanskrit”: new sources for the study of the Sanskritization of Buddhist literature. Indo-Iranian Journal 44, 241–252.',
 desc:'A table of five words in English, Pali, Gāndhārī and Sanskrit; pressing a language column highlights it and describes the language.',
 dur:10,hint:'Press a language heading and read down its column. Compare each row across.',
 init:()=>({k:2}),
 watch(p){return {k:Math.min(2,Math.floor(p*3))}},
 ui:[{choose:P4_LANG.map((d,i)=>[i,d[0]]),label:'Language',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('The same five words');
  const xs=[230,360,490];
  out+=T(88,70,'English',12,C.muted);
  P4_LANG.forEach((d,i)=>{const on=i===s.k;out+=hit(X,'k',i,d[0],R(xs[i]-58,48,116,180,on?C.pale:'#fff',on?C.blue:C.grid,8)+TB(xs[i],70,d[0],13,on?C.blue:C.muted));
   d[1].forEach((w,r)=>out+=T(xs[i],100+r*28,w,13,on?C.ink:C.muted))});
  P4_ENG.forEach((w,r)=>out+=T(88,100+r*28,w,13,C.ink));
  out+=R(16,238,568,108,'#fff',C.blue,8)+P4_text(28,262,P4_LANG[s.k][2],544);
  out+=P4_tag('est');
  return {svg:out,phase:'Established from manuscripts and inscriptions. Gāndhārī forms are typical spellings; the script leaves long vowels unmarked. None of these languages is simply “the language the Buddha spoke”.'};
 }});

const P4_MAHA={
 sch:['Historians’ dating','Most historians date the composition of Mahāyāna sūtras from about the 1st century BCE onward, and see the early Mahāyāna as a movement inside the existing schools, not a separate order.','deb'],
 trad:['Mahāyāna traditions’ own view','Mahāyāna traditions hold these sūtras to be the word of the Buddha: taught to those ready for them, and preserved or revealed later. A well-known account says the Perfection of Wisdom texts were kept among the nāgas until Nāgārjuna received them.','trad'],
 ev:['The earliest evidence','The oldest manuscript is a Gāndhārī Perfection of Wisdom scroll, radiocarbon dated to about 47–147 CE. Lokakṣema translated sūtras of this kind into Chinese at Luoyang around 179 CE.','est']};
SCENE({id:'sanskrit-canons-mahayana',name:'The Mahāyāna sūtras',tag:'Two understandings, side by side',
 definition:'Alongside the collections shared by the early schools there appeared a large body of Mahāyāna sūtras. Historians and Mahāyāna traditions understand their origin differently, and the earliest manuscripts and translations give fixed points for both to reckon with.',
 example:'A Perfection of Wisdom scroll in Gāndhārī, dated to the 1st or early 2nd century CE, is the oldest Mahāyāna manuscript known.',
 research:'Falk, H. & Karashima, S. (2012). A first-century Prajñāpāramitā manuscript from Gandhāra. ARIRIAB 15, 19–61. Harrison, P. (1987). Who gets to ride in the Great Vehicle? JIABS 10(1), 67–89. Nattier, J. (2003). A Few Good Men. University of Hawai‘i Press. Williams, P. (2009). Mahāyāna Buddhism: The Doctrinal Foundations, 2nd edn. Routledge.',
 desc:'A timeline from 100 BCE to 300 CE with the earliest Mahāyāna manuscript and the first Chinese translations marked, and a card that switches between the historians’ view, the traditions’ own view, and the evidence.',
 dur:12,hint:'Read all three cards. The first two are different kinds of claim; the third is what both have to work with.',
 init:()=>({v:'ev'}),
 watch(p){return {v:['sch','trad','ev'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['sch','Historians'],['trad','Traditions'],['ev','Evidence']],label:'View',get:s=>s.v,act:'v'}],
 on:{v(s,x){s.v=x;return 'keep'}},
 draw(s){
  let out=heading('Where do the Mahāyāna sūtras come from?');
  const x=y=>60+(y+100)/400*480,ay=104;
  out+=L(60,ay,540,ay,C.line,2);[[-100,'100 BCE'],[0,'1 CE'],[100,'100'],[200,'200'],[300,'300 CE']].forEach(([y,l])=>out+=L(x(y),ay-5,x(y),ay+5,C.line,1.5)+TF(x(y),ay+22,l,12,C.muted));
  out+=R(x(47),ay-9,x(147)-x(47),18,'#b9d4e6','none',4)+T(x(97),ay-18,'Gāndhārī scroll',12,C.blue)+Ci(x(179),ay,7,C.coral,'#fff')+T(x(179)+24,ay-40,'Lokakṣema',12,C.coral)+L(x(179),ay-8,x(179),ay-34,C.coral,1.5);
  const d=P4_MAHA[s.v];out+=P4_card(16,150,568,194,d[0],d[1],s.v==='trad'?C.amber:s.v==='sch'?C.purple:C.green);
  out+=P4_tag(d[2]);
  return {svg:out,phase:s.v==='trad'?'This is how Mahāyāna traditions themselves understand their scriptures. The course reports it as their view, as it reports the Theravāda view of the Pali canon.':s.v==='sch'?'The mainstream historical view; when, where and among whom the first Mahāyāna sūtras were composed is still debated.':'Established: the scroll’s radiocarbon range and the date of the first Chinese translations are fixed points that any account has to fit.'};
 }});
