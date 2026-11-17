/* ===================== Tripitaka In Motion · era 5 · Into Chinese (2nd–10th century) =====================
   Translation teams, Kumārajīva and Xuanzang, and the catalogues that fixed the Chinese canon.
   Every scene carries an evidence tag: traditional account, established, or debated. Chinese is given in
   pinyin romanisation so that no device shows missing glyphs. Pictures are pure functions of state. */
const P5_TAGS={trad:['traditional account',C.amber,C.amberp],est:['established',C.green,C.greenp],deb:['debated',C.purple,C.purplep]};
const P5_head=(k,t)=>{const [s,ink,fill]=P5_TAGS[k],w=20+s.length*7;return heading(t,28)+R(300-w/2,38,w,20,fill,ink,10)+TBF(300,52,s,12,ink)};
const P5_wrap=(t,n)=>{const out=[];let l='';for(const w of String(t).split(' ')){if(l&&(l+' '+w).length>n){out.push(l);l=w}else l=l?l+' '+w:w}if(l)out.push(l);return out};
const P5_para=(x,y,t,n,size=13,fill=C.ink,lh=17)=>P5_wrap(t,n).map((l,i)=>TF(x,y+i*lh,l,size,fill,'start')).join('');
// A timeline with pressable dots. items: [{y:year,n:label}], labels alternate above and below the line.
function P5_line(X,items,sel,yr0,yr1,y,act,x0=60,x1=540){
 const px=v=>x0+(v-yr0)/(yr1-yr0)*(x1-x0);let out=L(x0,y,x1,y,C.line,2);
 const step=(yr1-yr0)>300?100:(yr1-yr0)>120?50:20;for(let v=Math.ceil(yr0/step)*step;v<=yr1;v+=step)out+=L(px(v),y-4,px(v),y+4,C.line,1.5);
 out+=TF(x0-6,y+4,String(yr0),11,C.muted,'end')+TF(x1+6,y+4,String(yr1),11,C.muted,'start');
 items.forEach((it,i)=>{const on=i===sel,up=i%2===0,x=px(it.y);
  out+=hit(X,act,i,it.n,Ci(x,y,on?10:7,on?C.coral:'#fff',on?C.coral:C.blue)+(up?TBF:TBF)(x,up?y-18:y+28,it.n,12,on?C.coral:C.ink)+TF(x,up?y-32:y+42,it.d||String(it.y),11,C.muted))});
 return out}
const P5_panel=(y,h)=>R(40,y,520,h,'#fff',C.grid,8);

/* ---------- Lesson: first-translations ---------- */
const P5_FIRST=[
 {n:'An Shigao',y:148,d:'from 148',from:'A Parthian: “An” marks Anxi, the Chinese name for Parthia.',where:'Luoyang, from about 148 to about 170.',what:'Short texts on meditation, breathing and numbered lists of doctrine, from the early schools.',eg:'Example: Anban shouyi jing, on mindfulness of breathing.'},
 {n:'Lokakṣema',y:179,d:'c. 178–189',from:'From the Kushan realm: “Zhi” marks the Yuezhi people.',where:'Luoyang, about 178 to 189.',what:'Mahāyāna sūtras, among the earliest dated evidence for them in any language.',eg:'Example: Daoxing banruo jing (179), the Perfection of Wisdom in 8,000 lines.'},
 {n:'Zhi Qian',y:235,d:'c. 222–252',from:'A layman of Yuezhi descent, born in China.',where:'The southern kingdom of Wu, about 222 to 252.',what:'Polished, literary Chinese; he also revised earlier, rougher translations.',eg:'Example: the oldest surviving Chinese Vimalakīrti Sūtra.'},
 {n:'Dharmarakṣa',y:286,d:'c. 266–308',from:'Born at Dunhuang to a Yuezhi family; Chinese name Zhu Fahu.',where:'Dunhuang, Chang’an and Luoyang, about 266 to 308.',what:'Around 150 works are credited to him and his team.',eg:'Example: the first Chinese Lotus Sūtra (286).'}];
SCENE({id:'first-translations',name:'The first translators',tag:'Luoyang, second century',
 definition:'Buddhist texts began to be put into Chinese in the middle of the second century CE, by monks and laymen who had come along the trade routes from Central Asia.',
 example:'An Shigao, a Parthian, was at work in Luoyang from about 148. Lokakṣema, from the Kushan realm, followed about thirty years later.',
 desc:'A timeline from 140 to 320 CE with four translators; pressing one shows where he came from, where he worked and what he translated.',
 research:'Sengyou (c. 515), Chu sanzang ji ji, the oldest surviving catalogue; Zürcher, E. (1959), The Buddhist Conquest of China, Brill; Nattier, J. (2008), A Guide to the Earliest Chinese Buddhist Translations, Soka University.',
 dur:12,hint:'Press a translator on the line. Notice that none of the first four was a native of the Indian heartland.',
 init:()=>({i:0}),
 watch(p){return {i:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:P5_FIRST.map((t,i)=>[String(i),t.n]),label:'Translator',get:s=>String(s.i),act:'pick'}],
 on:{pick(s,v){s.i=+v;return 'keep'}},
 draw(s,f,X){
  const t=P5_FIRST[s.i];let out=P5_head('est','The first translators');
  out+=P5_line(X,P5_FIRST,s.i,140,320,128,'pick');
  out+=P5_panel(184,186)+TBF(56,208,t.n,15,C.coral,'start');
  out+=P5_para(56,230,t.from,72)+P5_para(56,254,t.where,72)+P5_para(56,278,t.what,72)+P5_para(56,320,t.eg,72,13,C.blue);
  out+=TF(300,358,'Dates follow the early catalogues and are approximate.',12,C.muted);
  return {svg:out,phase:`${t.n}: ${t.what} The early catalogues record who translated what; modern scholars test those attributions against each translator’s vocabulary.`};
 }});

const P5_ROLES=[['Holds the text','recites the Indic original, from memory or a manuscript'],['Interprets','says each phrase aloud in Chinese'],['Receives with the brush','a Chinese scribe writes down what he hears'],['Polishes','smooths the wording into readable Chinese'],['Collates','checks the draft against the original once more']];
const P5_ERRS={hear:{n:'A word is misheard',at:1,by:4,why:'Only someone who goes back to the original can notice it, so it waits for the final collation.'},sense:{n:'A phrase is misunderstood',at:1,by:4,why:'The scribe and polisher know no Indic language, so only the collation against the original can catch it, and only if the collator knows both languages.'},brush:{n:'The scribe writes a wrong character',at:2,by:3,why:'The polisher reads the Chinese and can spot a slip that makes no sense, without needing the original.'}};
SCENE({id:'first-translations-team',name:'A translation team',tag:'Many hands, one text',
 definition:'Early Chinese translations were made by teams. One person held the Indic text, one put it into spoken Chinese, and Chinese scribes wrote it down and polished it.',
 example:'The colophon of Lokakṣema’s translation of 179 names the Indian who held the text, Lokakṣema as the one who spoke the translation, and the Chinese laymen who took it down.',
 desc:'Five roles in a row from the holder of the text to the collator. A chosen kind of mistake enters at one stage and is marked at the first stage able to catch it.',
 research:'Colophons preserved in Sengyou (c. 515), Chu sanzang ji ji; Zürcher, E. (1959), The Buddhist Conquest of China; Funayama, T. (2013), Butten wa dō kan’yaku sareta no ka, Iwanami.',
 dur:12,hint:'Choose a kind of mistake and step the text along the team. See which stage is the first that could notice it.',
 init:()=>({e:'hear',at:0}),
 watch(p){const e=['hear','sense','brush'][Math.min(2,Math.floor(p*3))];return {e,at:Math.min(4,Math.floor((p*3%1)*5.5))}},
 ui:[{choose:[['hear','Misheard'],['sense','Misunderstood'],['brush','Miswritten']],label:'Mistake',get:s=>s.e,act:'e'},{range:'at',label:'Stage',min:0,max:4,step:1,get:s=>s.at,act:'at',show:v=>P5_ROLES[v][0]}],
 on:{e(s,v){s.e=v;s.at=0;return 'keep'},at(s,v){s.at=+v;return 'keep'}},
 draw(s){
  const E=P5_ERRS[s.e];let out=P5_head('est','A translation team at work');
  P5_ROLES.forEach((r,i)=>{const x=24+i*112,on=i===s.at,bad=i>=E.at&&i<E.by&&i<=s.at,caught=i===E.by&&s.at>=E.by;
   out+=R(x,86,104,74,caught?C.greenp:bad?C.coralp:on?C.pale:'#fff',on?C.blue:C.grid,8);
   P5_wrap(r[0],13).forEach((l,k)=>out+=TBF(x+52,108+k*16,l,12,C.ink));
   out+=TF(x+52,150,caught?'caught here':bad?'carries the slip':i<=s.at?'done':'',11,caught?C.green:bad?C.coral:C.muted);
   if(i<4)out+=arrow(x+105,123,x+111,123,C.line,2,5)});
  out+=P5_panel(176,196)+TBF(56,200,P5_ROLES[s.at][0],14,C.blue,'start')+P5_para(56,220,'This person '+P5_ROLES[s.at][1]+'.',72);
  out+=TBF(56,254,E.n,14,C.coral,'start')+P5_para(56,274,`It enters at “${P5_ROLES[E.at][0]}” and can first be caught at “${P5_ROLES[E.by][0]}”.`,72)+P5_para(56,316,E.why,72,13,C.muted);
  return {svg:out,phase:s.at<E.at?'So far the text is as the holder recited it.':s.at<E.by?`The slip is now in the draft. ${E.why}`:`At the stage “${P5_ROLES[E.by][0]}” the slip can be caught. ${E.why}`};
 }});

const P5_TERMS=[
 {sk:'nirvāṇa',gloss:'the going out of craving',borrow:['wúwéi','“non-action”, a Daoist term'],sound:['nièpán','the sound of the Indic word'],coin:['mièdù','“extinction and crossing over”']},
 {sk:'bodhi',gloss:'awakening',borrow:['dào','“the Way”'],sound:['pútí','the sound of the Indic word'],coin:['jué','“awakening”']},
 {sk:'arhat',gloss:'one who has reached the goal',borrow:['zhēnrén','“true person”, a Daoist term'],sound:['āluóhàn','the sound of the Indic word'],coin:['yìnggòng','“worthy of offerings”']},
 {sk:'tathatā',gloss:'the way things are, “suchness”',borrow:['běnwú','“original non-being”'],sound:['—','rarely written by sound'],coin:['zhēnrú','“true suchness”']}];
const P5_WAYS={borrow:['Borrow a Chinese word','Easy to read at once, but it brings its old meaning with it.',.9,.85],sound:['Write the sound','Nothing false is added, but a new reader learns nothing from it.',.2,.1],coin:['Coin a new phrase','A fresh Chinese phrase: readable, and free of old associations once readers learn it.',.6,.3]};
SCENE({id:'first-translations-geyi',name:'Borrow, sound out or coin?',tag:'Three ways to carry a word across',
 definition:'A translator meeting a word with no Chinese equivalent could borrow an existing Chinese word, write the foreign sound in Chinese characters, or coin a new phrase.',
 example:'Early translators wrote nirvāṇa as wúwéi, “non-action”, a word readers knew from Daoist books. Later translators preferred nièpán, which only records the sound.',
 desc:'Four Indic terms, each with three Chinese renderings in pinyin. Bars show how easy each rendering is for a new reader and how much outside meaning it risks bringing in.',
 research:'Zürcher, E. (1959), The Buddhist Conquest of China; Mair, V. H. (2012), What is geyi, after all? China Report 48, 29–59 (argues that “matching meanings” was a brief, limited practice); Nattier, J. (2008), A Guide to the Earliest Chinese Buddhist Translations.',
 dur:12,hint:'Pick a term and a strategy. The bars are a sketch of the trade-off, not measurements.',
 init:()=>({i:0,w:'borrow'}),
 watch(p){return {i:Math.min(3,Math.floor(p*4)),w:['borrow','sound','coin'][Math.floor(p*12)%3]}},
 ui:[{choose:P5_TERMS.map((t,i)=>[String(i),t.sk]),label:'Term',get:s=>String(s.i),act:'i'},{choose:[['borrow','Borrow'],['sound','Sound'],['coin','Coin']],label:'Strategy',get:s=>s.w,act:'w'}],
 on:{i(s,v){s.i=+v;return 'keep'},w(s,v){s.w=v;return 'keep'}},
 draw(s){
  const t=P5_TERMS[s.i],W=P5_WAYS[s.w];let out=P5_head('deb','Three ways to carry a word');
  out+=TBF(300,92,t.sk,20,C.ink)+TF(300,112,t.gloss,13,C.muted);
  ['borrow','sound','coin'].forEach((k,i)=>{const x=40+i*178,on=k===s.w;out+=R(x,128,164,84,on?C.pale:'#fff',on?C.blue:C.grid,8)+TF(x+82,148,P5_WAYS[k][0],12,C.muted)+TBF(x+82,174,t[k][0],17,on?C.blue:C.ink);
   P5_wrap(t[k][1],24).forEach((l,j)=>out+=TF(x+82,192+j*14,l,11,C.muted))});
  out+=TF(56,244,'easy for a new reader',12,C.muted,'start')+R(230,233,300,14,'#eef3f6','none',7)+R(230,233,300*W[2],14,C.green,'none',7);
  out+=TF(56,270,'risk of bringing in other ideas',12,C.muted,'start')+R(230,259,300,14,'#eef3f6','none',7)+R(230,259,300*W[3],14,C.coral,'none',7);
  out+=TF(300,296,'bars: a sketch of the trade-off, not measurements',11,C.muted);
  out+=P5_para(56,322,W[1]+' How far early translators deliberately “matched meanings” with Daoist ideas is debated.',76,13,C.ink);
  return {svg:out,phase:`${t.sk} as ${t[s.w][0]}: ${t[s.w][1]}. ${W[1]}`};
 }});

/* ---------- Lesson: kumarajiva ---------- */
const P5_KJ=[
 {y0:344,y1:351,at:0,t:'Born at Kucha, an oasis kingdom on the northern Silk Road, to an Indian father and a Kuchean princess, Jīva.'},
 {y0:352,y1:355,at:1,t:'Taken by his mother to Kashmir as a boy, where he studies the texts of the Sarvāstivāda school.'},
 {y0:356,y1:356,at:2,t:'At Kashgar on the way home he meets Mahāyāna teachers and takes up the Perfection of Wisdom texts.'},
 {y0:357,y1:383,at:0,t:'Back at Kucha for more than twenty years; his fame as a teacher reaches China.'},
 {y0:384,y1:400,at:3,t:'A Chinese army takes Kucha. Kumārajīva is held at Liangzhou for some seventeen years, and learns Chinese.'},
 {y0:401,y1:413,at:4,t:'Brought to Chang’an by the ruler Yao Xing, he leads a translation bureau until his death.'}];
const P5_KJP=[['Kucha',190,150],['Kashmir',120,236],['Kashgar',70,170],['Liangzhou',390,165],['Chang’an',520,205]];
SCENE({id:'kumarajiva',name:'Kumārajīva’s road to Chang’an',tag:'344–413',
 definition:'Kumārajīva was a monk from Kucha in Central Asia who became the most widely read translator of Buddhist texts into Chinese.',
 example:'He reached the capital Chang’an only in 401, in his late fifties, after seventeen years as a captive at Liangzhou, and translated there for about twelve years.',
 desc:'A schematic route from Kucha to Kashmir, Kashgar, Liangzhou and Chang’an, with a year slider that moves a marker and shows what happened in each period.',
 research:'Huijiao (c. 530), Gaoseng zhuan (Biographies of Eminent Monks), T 2059; Sengyou (c. 515), Chu sanzang ji ji; Lu, Yang (2004), Narrative and historicity in the Buddhist biographies of early medieval China: the case of Kumārajīva, Asia Major 17(2). His dates are given variously; 344–413 is the common reckoning.',
 dur:12,hint:'Slide the year. The long wait at Liangzhou is when he learned the Chinese he later translated into.',
 init:()=>({yr:401}),
 watch(p){return {yr:Math.round(344+p*69)}},
 ui:[{range:'yr',label:'Year',min:344,max:413,step:1,get:s=>s.yr,act:'yr',show:v=>'about '+v}],
 on:{yr(s,v){s.yr=+v;return 'keep'}},
 draw(s){
  const k=P5_KJ.find(q=>s.yr>=q.y0&&s.yr<=q.y1)||P5_KJ[5];let out=P5_head('trad','Kumārajīva’s road to Chang’an');
  const path=[0,1,2,0,3,4].map(i=>P5_KJP[i]);out+=P(path.map((q,i)=>(i?'L':'M')+q[1]+' '+q[2]).join(''),C.line,2,'none','stroke-dasharray="5 5"');
  P5_KJP.forEach((q,i)=>{const on=i===k.at;out+=Ci(q[1],q[2],on?11:6,on?C.coral:'#fff',on?C.coral:C.blue)+TBF(q[1],q[2]+(i===1?28:-18),q[0],12,on?C.coral:C.ink)});
  out+=TF(70,100,'west',11,C.muted)+TF(530,100,'east',11,C.muted)+arrow(95,96,505,96,C.grid,1.5,6);
  out+=P5_panel(288,84)+TBF(56,312,`About ${s.yr}: ${P5_KJP[k.at][0]}`,14,C.coral,'start')+P5_para(56,332,k.t,76);
  return {svg:out,phase:k.t+' The story comes from biographies written a century later; the outline is accepted, the details less so.'};
 }});

const P5_WORKS=[[402,'Amitābha Sūtra (the shorter Pure Land sūtra)'],[402,'Diamond Sūtra'],[404,'Larger Perfection of Wisdom Sūtra'],[405,'Great Treatise on the Perfection of Wisdom, 100 fascicles'],[406,'Lotus Sūtra'],[406,'Vimalakīrti Sūtra'],[408,'Perfection of Wisdom in 8,000 lines'],[409,'Nāgārjuna’s Middle Treatise']];
SCENE({id:'kumarajiva-bureau',name:'The Chang’an bureau',tag:'Readable Chinese, 401–413',
 definition:'At Chang’an Kumārajīva worked with hundreds of Chinese monks. He explained the Indic text aloud, compared older translations, and the team settled wording that read well in Chinese.',
 example:'An older Lotus translation had “gods see humans, humans see gods”. Kumārajīva found this faithful but plain; his assistant Sengrui proposed “humans and gods are in contact, each able to see the other”, and he adopted it.',
 desc:'Two views: the famous line in its older, literal form and its polished form, and a list of translations that fills in as the year advances from 401 to 413.',
 research:'Huijiao (c. 530), Gaoseng zhuan, biography of Sengrui (the Lotus anecdote); Sengyou (c. 515), Chu sanzang ji ji (35 works in 294 fascicles; later catalogues list more); Robinson, R. H. (1967), Early Mādhyamika in India and China.',
 dur:12,hint:'Switch views. In the works view, slide the year to see the translations appear. Dates are approximate.',
 init:()=>({v:'line',yr:406}),
 watch(p){return p<.4?{v:'line',yr:406}:{v:'works',yr:Math.round(401+(p-.4)/.6*12)}},
 ui:[{choose:[['line','One line'],['works','The works']],label:'View',get:s=>s.v,act:'v'},{range:'yr',label:'Year',min:401,max:413,step:1,get:s=>s.yr,act:'yr',show:v=>String(v)}],
 on:{v(s,x){s.v=x;return 'keep'},yr(s,v){s.yr=+v;s.v='works';return 'keep'}},
 draw(s){
  let out=P5_head('trad',s.v==='line'?'One line, two renderings':'The bureau’s output');
  if(s.v==='line'){
   out+=R(40,84,250,150,'#fff',C.grid,8)+TF(165,106,'older translation (286)',12,C.muted)+TBF(165,140,'“Gods see humans,',15,C.ink)+TBF(165,162,'humans see gods.”',15,C.ink)+TF(165,196,'close to the Indic wording',12,C.muted)+TF(165,214,'judged “too plain”',12,C.muted);
   out+=R(310,84,250,150,C.pale,C.blue,8)+TF(435,106,'Kumārajīva’s bureau (406)',12,C.muted)+TBF(435,134,'“Humans and gods',15,C.blue)+TBF(435,154,'are in contact, each',15,C.blue)+TBF(435,174,'able to see the other.”',15,C.blue)+TF(435,206,'the sense kept, the rhythm Chinese',12,C.muted);
   out+=arrow(292,160,308,160,C.blue,2.5,7);
   out+=P5_para(56,264,'English paraphrases of the two Chinese lines. The exchange is told in a biography written about 530, over a century later.',76,13,C.ink);
   out+=P5_para(56,312,'Kumārajīva is also said to have compared translation to chewing rice for someone else: the food arrives, but the flavour is lost.',76,13,C.muted);
  }else{
   const done=P5_WORKS.filter(w=>w[0]<=s.yr);P5_WORKS.forEach((w,i)=>{const on=w[0]<=s.yr,y=92+i*26;out+=R(40,y-15,520,22,on?C.pale:'#fff',C.grid,6)+TBF(60,y,'c. '+w[0],12,on?C.blue:C.line,'start')+TF(120,y,w[1],13,on?C.ink:C.line,'start')});
   out+=counter(40,304,'year',String(s.yr),C.ink,110)+counter(165,304,'shown so far',done.length+' of '+P5_WORKS.length,C.blue,150);
   out+=P5_para(330,322,'A selection. The oldest catalogue credits him with 35 works.',34,12,C.muted,15);
  }
  return {svg:out,phase:s.v==='line'?'The bureau chose wording that kept the meaning and read well aloud. That choice is one reason his versions are still the ones recited.':`By about ${s.yr} the bureau had finished ${P5_WORKS.filter(w=>w[0]<=s.yr).length} of these eight works. The oldest catalogue lists 35 works in 294 fascicles for him; later catalogues list more.`};
 }});

const P5_DIA=[{n:'Kumārajīva',y:402,d:'c. 402',t:'The first Chinese Diamond Sūtra, and the one still recited in East Asia. The printed copy of 868 is this version.',use:true},{n:'Bodhiruci',y:509,d:'509',t:'Made at Luoyang by an Indian monk a century later, closer to the Indic wording.'},{n:'Paramārtha',y:562,d:'562',t:'Made in south China by an Indian monk better known for his translations of treatises.'},{n:'Dharmagupta',y:600,d:'c. 600',t:'So literal that it follows Sanskrit word order; useful to scholars, hard to recite.'},{n:'Xuanzang',y:655,d:'7th century',t:'A precise new version, also built into his 600-fascicle Perfection of Wisdom collection.'},{n:'Yijing',y:703,d:'703',t:'The last of the six, by a pilgrim who had spent years in India and Sumatra.'}];
SCENE({id:'kumarajiva-survival',name:'Six translations, one in use',tag:'Why the oldest version won',
 definition:'Important sūtras were translated into Chinese several times. All the versions were kept in the canon, but usually one became the text that people recite.',
 example:'The Diamond Sūtra has six Chinese translations made between about 402 and 703. Kumārajīva’s, the oldest, is the one in everyday use.',
 desc:'A timeline of six Chinese translations of the Diamond Sūtra from about 402 to 703; pressing one shows a note, and the version in common use is marked.',
 research:'Taishō Tripiṭaka nos. 235–239 and 220(9) (the six versions); Zhisheng (730), Kaiyuan shijiao lu; Harrison, P. (2010), Experimental core samples of Chinese translations of two Buddhist sūtras analysed in the light of recent Sanskrit manuscript discoveries, JIABS 31.',
 dur:12,hint:'Press each translation. Later versions were often more exact, yet the first stayed in use.',
 init:()=>({i:0}),
 watch(p){return {i:Math.min(5,Math.floor(p*6))}},
 ui:[{choose:P5_DIA.map((t,i)=>[String(i),t.n]),label:'Translation',get:s=>String(s.i),act:'pick'}],
 on:{pick(s,v){s.i=+v;return 'keep'}},
 draw(s,f,X){
  const t=P5_DIA[s.i];let out=P5_head('est','Six Chinese Diamond Sūtras');
  out+=P5_line(X,P5_DIA,s.i,380,720,132,'pick');
  out+=P5_panel(196,150)+TBF(56,222,`${t.n}, ${t.d}`,15,C.coral,'start')+(t.use?R(396,206,148,22,C.greenp,C.green,11)+TBF(470,221,'recited today',12,C.green):'');
  out+=P5_para(56,248,t.t,76)+P5_para(56,300,'All six are preserved side by side in the canon, so they can be compared line by line.',76,13,C.muted);
  return {svg:out,phase:t.t+(t.use?'':' It did not displace Kumārajīva’s version in daily use.')};
 }});

/* ---------- Lesson: xuanzang ---------- */
const P5_XZ=[['Chang’an',540,150,'c. 629','He leaves Chang’an for the west without the court’s permission.',0,-16],['Turfan',410,104,'c. 630','The king of Gaochang (Turfan) gives him letters and supplies for the road.',0,-16],['Samarkand',130,96,'c. 630','He crosses the Tian Shan and passes through the Sogdian cities.',0,-16],['Bamiyan',118,170,'c. 630','He describes the great standing figures cut into the cliff.',0,28],['Gandhāra',196,196,'c. 631','He finds the old monasteries of Gandhāra largely in ruins.',0,28],['Kashmir',262,152,'c. 631–633','Two years of study, with scribes provided to copy texts for him.',0,-16],['Nālandā',380,214,'c. 637','At the great monastery of Nālandā he studies for years under the abbot Śīlabhadra.',0,28],['South India',300,262,'c. 639','He travels down the east coast as far as Kāñcī and back up the west.',0,28],['Khotan',336,144,'c. 644','He returns by the southern Silk Road and waits at Khotan for leave to re-enter China.',0,28],['Chang’an',540,150,'645','He is welcomed home with 657 texts, and asks only for help to translate them.',0,-16]];
SCENE({id:'xuanzang',name:'Xuanzang’s journey',tag:'629–645',
 definition:'Xuanzang was a Chinese monk who travelled overland to India to study and collect texts, and spent the rest of his life translating them.',
 example:'He was away about sixteen years, studied at Nālandā, and came home in 645 with 657 texts carried on twenty horses.',
 desc:'A schematic map from Chang’an west to Samarkand, south to India and back by Khotan, with ten stops; a slider moves along the route and shows a note for each stop.',
 research:'Xuanzang and Bianji (646), Da Tang Xiyu ji (Record of the Western Regions), T 2087, trans. Li Rongxi (1996); Huili and Yancong (688), Biography of the Tripiṭaka Master, T 2053. The outline is well documented; individual years are reconstructed and differ between scholars.',
 dur:12,hint:'Move along the route. The map is a sketch: places are in rough relative position, not to scale.',
 init:()=>({k:6}),
 watch(p){return {k:Math.min(9,Math.floor(p*10))}},
 ui:[{range:'k',label:'Stop',min:0,max:9,step:1,get:s=>s.k,act:'k',show:v=>P5_XZ[v][0]+' '+P5_XZ[v][3]}],
 on:{k(s,v){s.k=+v;return 'keep'}},
 draw(s){
  const q=P5_XZ[s.k];let out=P5_head('est','Xuanzang’s journey');
  out+=P(P5_XZ.map((z,i)=>(i?'L':'M')+z[1]+' '+z[2]).join(''),C.grid,2,'none','stroke-dasharray="4 5"');
  out+=P(P5_XZ.slice(0,s.k+1).map((z,i)=>(i?'L':'M')+z[1]+' '+z[2]).join(''),C.blue,2.6);
  P5_XZ.slice(0,9).forEach((z,i)=>{const on=z[0]===q[0];out+=Ci(z[1],z[2],on?10:5,on?C.coral:'#fff',on?C.coral:C.blue)+TBF(z[1]+z[5],z[2]+z[6],z[0],12,on?C.coral:C.muted)});
  out+=P5_panel(322,52)+TBF(56,343,`${q[0]}, ${q[3]}`,13,C.coral,'start')+TF(56,362,q[4],12,C.ink,'start');
  return {svg:out,phase:q[4]+(s.k===9?' He went on to translate 75 works in 1,335 fascicles.':'')};
 }});

const P5_UNT=[
 {t:'the mantra “gate gate pāragate…”',keep:true,r:'Secret: a formula to be recited, whose power is held to lie in its sound.'},
 {t:'bhagavat (a title of the Buddha)',keep:true,r:'Many meanings: the word has six senses at once, and any one Chinese word would drop five.'},
 {t:'the jambu tree',keep:true,r:'Not found in China: there is no such tree there, so no Chinese name for it.'},
 {t:'anuttarā samyaksaṃbodhi',keep:true,r:'Established custom: earlier translators had always kept the sound, and readers knew it.'},
 {t:'prajñā',keep:true,r:'To inspire respect: the plain Chinese word for “wisdom” was felt to sound too ordinary.'},
 {t:'śūnyatā',keep:false,r:'Translated as kōng, “empty”: none of the five reasons applies.'},
 {t:'sūtra',keep:false,r:'Translated as jīng, “warp thread, classic”: none of the five reasons applies.'}];
SCENE({id:'xuanzang-untranslatable',name:'Five kinds of untranslatable',tag:'When to keep the sound',
 definition:'Xuanzang is credited with a rule naming five cases in which an Indic word should be written by its sound in Chinese characters, not translated by its meaning.',
 example:'Prajñā is kept as the sound bōrě, because the everyday Chinese word for wisdom was thought too slight. Śūnyatā, by contrast, is translated as kōng, “empty”.',
 desc:'Seven Indic terms in a list. For the selected term the learner chooses Translate or Keep the sound; the rule and its reason are then shown, with a running score.',
 research:'The five categories are first recorded in the preface to Fayun (1143), Fanyi mingyi ji, T 2131, five centuries after Xuanzang, so the attribution is traditional. Discussion: Funayama, T. (2013), Butten wa dō kan’yaku sareta no ka; Cheung, M. (2006), An Anthology of Chinese Discourse on Translation, vol. 1.',
 dur:12,hint:'Pick a term, then choose Translate or Keep the sound. Five of the seven fall under the rule. Nothing you answer leaves this page.',
 init:()=>({i:0,a:{}}),
 watch(p){const n=Math.min(7,Math.floor(p*8)),a={};for(let k=0;k<n;k++)a[k]=P5_UNT[k].keep?'k':'t';return {i:Math.min(6,n),a,sim:true}},
 ui:[{b:'Translate',act:'ans',arg:'t'},{b:'Keep the sound',act:'ans',arg:'k'},{b:'Next term',act:'next'}],
 on:{pick(s,v){s.i=+v;return 'keep'},ans(s,v){s.a[s.i]=v;return 'keep'},next(s){s.i=(s.i+1)%7;return 'keep'}},
 draw(s,f,X){
  const t=P5_UNT[s.i],a=s.a[s.i];let out=P5_head('trad','Translate, or keep the sound?');
  P5_UNT.forEach((u,i)=>{const y=86+i*27,on=i===s.i,an=s.a[i],ok=an&&(an==='k')===u.keep;
   out+=hit(X,'pick',i,u.t,R(40,y-15,300,23,on?C.pale:'#fff',on?C.blue:C.grid,6)+TF(52,y+1,u.t,12,C.ink,'start')+(an?TBF(326,y+1,ok?'✓':'✗',13,ok?C.green:C.coral,'end'):''))});
  out+=R(356,72,204,188,'#fff',C.grid,8);
  if(a){const ok=(a==='k')===t.keep;out+=TBF(368,96,t.keep?'Keep the sound':'Translate',14,t.keep?C.amber:C.blue,'start')+TF(368,116,ok?'your choice matches':'the rule says otherwise',12,ok?C.green:C.coral,'start')+P5_para(368,140,t.r,29,12,C.ink,16)}
  else out+=P5_para(368,100,'Choose Translate or Keep the sound for the highlighted term.',28,13,C.muted);
  const n=Object.keys(s.a).length,ok=Object.keys(s.a).filter(k=>(s.a[k]==='k')===P5_UNT[k].keep).length;
  out+=counter(40,284,'answered',n+' of 7',C.ink,120)+counter(172,284,'matching the rule',String(ok),C.green,150);
  out+=P5_para(340,300,s.sim?'Watch shows a sample run.':'The rule is first written down in 1143.',32,12,C.muted,15);
  return {svg:out,phase:a?t.r:'Five reasons for keeping the sound: secret formulas, words with many meanings, things unknown in China, established custom, and respect.'};
 }});

SCENE({id:'xuanzang-heart',name:'Where did the Heart Sūtra come from?',tag:'A short text, an open question',
 definition:'The Heart Sūtra is a text of about 260 Chinese characters in the version attributed to Xuanzang. Its origin is debated: it may be a translation from Sanskrit, or a Chinese digest later put into Sanskrit.',
 example:'In 1992 Jan Nattier argued that its core was lifted from Kumārajīva’s Chinese translation of a much longer sūtra, and that the Sanskrit Heart Sūtra is a translation back from the Chinese.',
 desc:'Four boxes: the long Sanskrit sūtra, its Chinese translation, the Chinese Heart Sūtra and the Sanskrit Heart Sūtra. A toggle redraws the arrows for the traditional account and for Nattier’s hypothesis, with the evidence listed below.',
 research:'Nattier, J. (1992), The Heart Sūtra: a Chinese apocryphal text? JIABS 15(2), 153–223; replies include Fukui, F. (1994) and Harada, W. (2010); Tanahashi, K. (2014), The Heart Sutra, surveys the debate. A stone inscription at Fangshan dated 661 is the earliest dated copy.',
 dur:12,hint:'Switch between the two accounts and watch which way the arrows run. Scholars have not settled this.',
 init:()=>({v:'trad'}),
 watch(p){return {v:p<.5?'trad':'nat'}},
 ui:[{choose:[['trad','Traditional account'],['nat','Nattier’s hypothesis']],label:'Account',get:s=>s.v,act:'v'}],
 on:{v(s,x){s.v=x;return 'keep'}},
 draw(s){
  const n=s.v==='nat';let out=P5_head('deb','Which way did it travel?');
  const B=(x,y,a,b,c,hl)=>R(x,y,200,58,hl?C.pale:'#fff',hl?C.blue:C.grid,8)+TBF(x+100,y+22,a,13,C.ink)+TF(x+100,y+40,b,12,C.muted)+(c?TF(x+100,y+54,c,11,C.muted):'');
  out+=B(50,80,'Long sūtra in Sanskrit','the 25,000-line text','',false)+B(350,80,'Long sūtra in Chinese','Kumārajīva, about 404','',n);
  out+=B(50,176,'Heart Sūtra in Sanskrit','short text','',false)+B(350,176,'Heart Sūtra in Chinese','about 260 characters','',true);
  out+=arrow(252,109,348,109,C.line,2.5,7);
  if(n)out+=arrow(450,140,450,174,C.purple,3,8)+arrow(348,205,252,205,C.purple,3,8)+TF(462,162,'core passage copied',11,C.purple,'start')+TF(300,196,'back-translated',11,C.purple);
  else out+=arrow(150,140,150,174,C.amber,3,8)+arrow(252,205,348,205,C.amber,3,8)+TF(162,162,'condensed in India',11,C.amber,'start')+TF(300,196,'translated',11,C.amber);
  out+=P5_panel(250,122);
  out+=n?P5_para(56,272,'For: the Chinese Heart Sūtra’s core matches Kumārajīva’s long sūtra almost word for word, while the Sanskrit Heart Sūtra phrases the same passage differently from the Sanskrit long sūtra, as a re-translation would.',76)+P5_para(56,340,'Against: critics dispute the comparison and point to the text’s early spread. No consensus.',76,13,C.muted)
   :P5_para(56,272,'The text is held to be an Indian sūtra, translated into Chinese by Xuanzang in 649 and by others before and after him.',76)+P5_para(56,316,'Difficulty: no Indian copy or commentary is known from before the eighth century, later than the Chinese copies.',76,13,C.muted);
  return {svg:out,phase:n?'Nattier’s hypothesis: the Heart Sūtra was assembled in Chinese around a passage from Kumārajīva’s long sūtra, then put into Sanskrit. Many scholars find it persuasive; others reject it.':'The traditional account: an Indian text, translated into Chinese. It remains the view of most Buddhist traditions, and some scholars defend it.'};
 }});

/* ---------- Lesson: catalogues ---------- */
const P5_CAT=[
 {n:'Dao’an',y:374,d:'374',t:'The first critical catalogue. Dao’an lists what he has seen, names translators where he can, and sets doubtful texts apart. It survives only inside Sengyou’s catalogue.'},
 {n:'Sengyou',y:515,d:'c. 515',t:'Chu sanzang ji ji, the oldest catalogue that survives. It keeps Dao’an’s lists, adds prefaces and colophons, and gives translators’ lives.'},
 {n:'Fajing',y:588,d:'594',t:'An official catalogue for the Sui court. It sorts texts by vehicle and basket, and by whether they are single translations, retranslations, doubtful or spurious.'},
 {n:'Fei Changfang',y:606,d:'597',t:'Arranged by dynasty to give Buddhism a long Chinese history. It assigns translators and dates to many anonymous texts; scholars treat these attributions with caution.'},
 {n:'Daoxuan',y:664,d:'664',t:'Da Tang neidian lu. A working catalogue that also records which texts a monastery library should actually hold.'},
 {n:'Zhisheng',y:730,d:'730',t:'Kaiyuan shijiao lu. The most careful of all: it fixes the contents and order of the canon at 1,076 works in 5,048 fascicles. Later printed canons follow it.'}];
SCENE({id:'catalogues',name:'The cataloguers',tag:'Lists that became a canon',
 definition:'A sūtra catalogue is a list of Buddhist texts in Chinese, with their translators, dates and length, and a judgement on whether each is genuine.',
 example:'Sengyou’s catalogue of about 515 is the oldest that survives. Zhisheng’s of 730 fixed which works the Chinese canon contains.',
 desc:'A timeline from 360 to 740 with six catalogues (the dots for 594 and 597 are drawn a little apart so each can be pressed); pressing one shows what it did and how far it is trusted.',
 research:'Sengyou (c. 515), Chu sanzang ji ji, T 2145; Fei Changfang (597), Lidai sanbao ji, T 2034; Zhisheng (730), Kaiyuan shijiao lu, T 2154; Storch, T. (2014), The History of Chinese Buddhist Bibliography, Cambria; Tokuno, K. (1990), in Buswell (ed.), Chinese Buddhist Apocrypha.',
 dur:12,hint:'Press each catalogue. They are the main evidence for who translated what, and they do not always agree.',
 init:()=>({i:1}),
 watch(p){return {i:Math.min(5,Math.floor(p*6))}},
 ui:[{choose:P5_CAT.map((t,i)=>[String(i),t.n]),label:'Catalogue',get:s=>String(s.i),act:'pick'}],
 on:{pick(s,v){s.i=+v;return 'keep'}},
 draw(s,f,X){
  const t=P5_CAT[s.i];let out=P5_head('est','Six catalogues');
  out+=P5_line(X,P5_CAT,s.i,360,740,132,'pick');
  out+=P5_panel(196,150)+TBF(56,222,`${t.n}, ${t.d}`,15,C.coral,'start')+P5_para(56,246,t.t,76);
  return {svg:out,phase:t.t};
 }});

const P5_JUD=[
 {n:'Daoxing banruo jing',c:'A Perfection of Wisdom sūtra. Its colophon dates it to 179 and names Lokakṣema and his helpers. A matching Indic text is known.',v:'a',cat:'Listed as a genuine translation by every catalogue.',mod:'Modern scholars agree.'},
 {n:'Tiwei Boli jing',c:'Two merchants receive the five precepts, which the text pairs with the five phases, five planets and five organs of Chinese thought.',v:'s',cat:'Sengyou lists it as spurious and names the Chinese monk who composed it about 460.',mod:'Modern scholars agree: a Chinese composition.'},
 {n:'Fanwang jing',c:'A code of bodhisattva precepts, said to be translated by Kumārajīva. It is absent from the early lists of his works and stresses filial piety.',v:'d',cat:'Fajing (594) lists it as doubtful. Later catalogues accept it, and it became the standard precept text.',mod:'Most modern scholars: composed in China in the fifth century.'},
 {n:'Sūtra in Forty-two Sections',c:'Short sayings. Tradition calls it the first sūtra in China, translated in 67 CE; no early catalogue saw a dated colophon.',v:'a',cat:'The catalogues accept it as a translation.',mod:'Modern scholars: a compilation of uncertain date; the story of 67 CE is legend.'},
 {n:'Fumu enzhong jing',c:'On the debt owed to one’s parents. No translator is named and no Indic text is known. It was copied very widely.',v:'s',cat:'Zhisheng (730) lists it as spurious and keeps it out of the canon.',mod:'Modern scholars agree: a Chinese composition, and a much-loved one.'}];
const P5_VERD={a:'Genuine translation',d:'Doubtful',s:'Spurious'};
SCENE({id:'catalogues-judge',name:'Be the cataloguer',tag:'Genuine, doubtful or spurious?',
 definition:'Cataloguers sorted texts into genuine translations, doubtful texts and spurious ones, meaning texts composed in China and presented as translations. Modern scholars often call the last group apocrypha.',
 example:'The Tiwei Boli jing links the five precepts to the five phases of Chinese cosmology. Sengyou listed it as spurious and named its author.',
 desc:'Five texts, each with the clues a cataloguer would have had. The learner gives a verdict; the medieval cataloguers’ verdict and the modern view are then shown, with a score.',
 research:'Sengyou (c. 515), Chu sanzang ji ji; Fajing (594), Zhongjing mulu; Zhisheng (730), Kaiyuan shijiao lu; Buswell, R. E. (ed.) (1990), Chinese Buddhist Apocrypha, University of Hawai‘i Press, especially Tokuno’s chapter.',
 dur:12,hint:'Read the clues, then give your verdict. “Spurious” was the cataloguers’ word; many such texts were, and are, sincerely valued. Your answers stay on this page.',
 init:()=>({i:0,a:{}}),
 watch(p){const n=Math.min(5,Math.floor(p*6)),a={};for(let k=0;k<n;k++)a[k]=P5_JUD[k].v;return {i:Math.min(4,n),a,sim:true}},
 ui:[{b:'Genuine',act:'ans',arg:'a'},{b:'Doubtful',act:'ans',arg:'d'},{b:'Spurious',act:'ans',arg:'s'},{b:'Next text',act:'next'}],
 on:{pick(s,v){s.i=+v;return 'keep'},ans(s,v){s.a[s.i]=v;return 'keep'},next(s){s.i=(s.i+1)%5;return 'keep'}},
 draw(s,f,X){
  const t=P5_JUD[s.i],a=s.a[s.i];let out=P5_head('deb','Be the cataloguer');
  P5_JUD.forEach((u,i)=>{const x=40+i*105,on=i===s.i,an=s.a[i];out+=hit(X,'pick',i,u.n,R(x,74,98,40,on?C.pale:'#fff',on?C.blue:C.grid,8)+TBF(x+49,92,'Text '+(i+1),12,on?C.blue:C.ink)+TF(x+49,107,an?(an===u.v?'matches':'differs'):'not yet',11,an?(an===u.v?C.green:C.coral):C.muted))});
  out+=P5_panel(124,238)+TBF(56,148,t.n,15,C.ink,'start')+P5_para(56,170,t.c,76);
  if(a){out+=TBF(56,236,'Your verdict: '+P5_VERD[a],13,a===t.v?C.green:C.coral,'start')+TBF(56,262,'The cataloguers',12,C.amber,'start')+P5_para(56,280,t.cat,76)+TBF(56,322,'Today',12,C.purple,'start')+P5_para(56,340,t.mod,76)}
  else out+=TF(56,250,'Give your verdict with the buttons below.',13,C.muted,'start');
  const ok=Object.keys(s.a).filter(k=>s.a[k]===P5_JUD[k].v).length;
  return {svg:out,phase:a?`${t.cat} ${t.mod}`:`${Object.keys(s.a).length} of 5 judged, ${ok} matching the cataloguers. Their tests: is a translator named, is an Indic original known, and does the text carry purely Chinese ideas?`};
 }});

const P5_KY=[['Great Vehicle sūtras',515,2173],['Great Vehicle vinaya',26,54],['Great Vehicle treatises',97,518],['Small Vehicle sūtras',240,618],['Small Vehicle vinaya',54,446],['Small Vehicle treatises',36,698],['Works of the sages',108,541]];
SCENE({id:'catalogues-kaiyuan',name:'The canon of 730',tag:'1,076 works on the shelves',
 definition:'Zhisheng’s Kaiyuan catalogue of 730 set out the Chinese canon in seven divisions and listed exactly which works belong in it and in what order.',
 example:'It counts 1,076 works in 5,048 fascicles. Great Vehicle sūtras are the largest division by number of works: 515 of them.',
 desc:'Seven horizontal bars for the divisions of the Kaiyuan canon, switchable between number of works and number of fascicles; pressing a bar shows its counts.',
 research:'Zhisheng (730), Kaiyuan shijiao lu, T 2154, fascicles 19–20 (the list of works entered into the canon); Storch, T. (2014), The History of Chinese Buddhist Bibliography; Wu, J. and Chia, L. (eds.) (2016), Spreading Buddha’s Word in East Asia, Columbia University Press.',
 dur:12,hint:'Switch between works and fascicles, and press a bar. “Small Vehicle” is the catalogue’s own label for the early schools’ texts; it is avoided today.',
 init:()=>({u:'w',i:0}),
 watch(p){return {u:p<.5?'w':'f',i:Math.floor(p*14)%7}},
 ui:[{choose:[['w','Works'],['f','Fascicles']],label:'Count',get:s=>s.u,act:'u'}],
 on:{u(s,v){s.u=v;return 'keep'},pick(s,v){s.i=+v;return 'keep'}},
 draw(s,f,X){
  const k=s.u==='w'?1:2,max=s.u==='w'?515:2173,t=P5_KY[s.i];let out=P5_head('est','The Kaiyuan canon, 730');
  P5_KY.forEach((d,i)=>{const y=82+i*30,on=i===s.i,w=Math.max(3,d[k]/max*290);out+=hit(X,'pick',i,d[0],TF(196,y+14,d[0],12,on?C.ink:C.muted,'end')+R(204,y,w,20,on?C.blue:'#b9d4e6','none',4)+TBF(204+w+8,y+15,d[k].toLocaleString('en-GB'),12,on?C.blue:C.muted,'start'))});
  out+=counter(40,304,'works in all','1,076',C.ink,130)+counter(182,304,'fascicles in all','5,048',C.ink,130);
  out+=P5_para(330,318,`${t[0]}: ${t[1]} works in ${t[2].toLocaleString('en-GB')} fascicles.`,34,12,C.ink,15);
  return {svg:out,phase:`${t[0]}: ${t[1]} works in ${t[2].toLocaleString('en-GB')} fascicles. Each case of scrolls was later marked with one character from the Thousand Character Classic, a primer every reader knew by heart, so the shelf order could be found without numbers.`};
 }});
