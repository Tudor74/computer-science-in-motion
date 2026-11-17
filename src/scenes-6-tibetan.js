/* ===================== Tripitaka In Motion · era 6 · Tibetan and other canons (7th–18th century) =====================
   Translation into Tibetan, the Kangyur and Tengyur, how the Pali, Chinese and Tibetan canons compare, and the
   Tangut, Mongolian and Manchu canons that followed. Every scene carries an evidence tag. Tibetan is given in
   Wylie romanisation and Chinese in pinyin so that no device shows missing glyphs. Pictures are pure functions of state. */
const P6_TAGS={trad:['traditional account',C.amber,C.amberp],est:['established',C.green,C.greenp],deb:['debated',C.purple,C.purplep]};
const P6_head=(k,t)=>{const [s,ink,fill]=P6_TAGS[k],w=20+s.length*7;return heading(t,28)+R(300-w/2,38,w,20,fill,ink,10)+TBF(300,52,s,12,ink)};
const P6_wrap=(t,n)=>{const out=[];let l='';for(const w of String(t).split(' ')){if(l&&(l+' '+w).length>n){out.push(l);l=w}else l=l?l+' '+w:w}if(l)out.push(l);return out};
const P6_para=(x,y,t,n,size=13,fill=C.ink,lh=17)=>P6_wrap(t,n).map((l,i)=>TF(x,y+i*lh,l,size,fill,'start')).join('');
const P6_panel=(y,h)=>R(40,y,520,h,'#fff',C.grid,8);
const P6_num=v=>v.toLocaleString('en-GB');

/* ---------- Lesson: tibetan-translation ---------- */
const P6_EV=[
 {n:'Script',y:645,d:'7th century',k:'trad',t:'Tibetan histories say that King Songtsen Gampo sent his minister Thönmi Sambhoṭa to India, and that he returned with a script modelled on an Indian one. The oldest surviving Tibetan inscriptions are from the eighth century.'},
 {n:'Samyé',y:779,d:'c. 779',k:'est',t:'King Trisong Detsen founds Samyé, the first monastery, and adopts Buddhism by edict. The Indian abbot Śāntarakṣita ordains the first Tibetan monks, and translation begins in earnest.'},
 {n:'Decree',y:814,d:'814',k:'est',t:'A royal decree lays down how to translate: follow fixed equivalents, keep Tibetan word order readable, and coin no new term without approval. Palace catalogues of about this time list over 700 translated texts.'},
 {n:'Collapse',y:842,d:'c. 842',k:'trad',t:'The empire breaks up after the death of King Langdarma. Later histories tell of a persecution of Buddhism; how severe it was is debated. Court-sponsored translation stops for over a century.'},
 {n:'Rinchen Zangpo',y:990,d:'958–1055',k:'est',t:'In western Tibet the “Great Translator” Rinchen Zangpo, trained in Kashmir, begins a new wave of translation and revises older work. Tibetans call this the later spread of the teaching.'},
 {n:'Atiśa',y:1042,d:'1042',k:'est',t:'The Bengali master Atiśa arrives from the monastery of Vikramaśīla. For two more centuries Tibetans travel to India and Nepal to study, and bring texts back.'}];
SCENE({id:'tibetan-translation',name:'Two waves of translation',tag:'From the 7th to the 11th century',
 definition:'Buddhist texts were translated into Tibetan in two periods: an early one under the Tibetan empire, to about 842, and a later one from the late tenth century.',
 example:'The first monastery, Samyé, was founded about 779. After the empire collapsed about 842, large-scale translation resumed only with Rinchen Zangpo (958–1055).',
 desc:'A timeline from 600 to 1100 with six events and coloured bands for the early spread, the gap and the later spread; pressing an event shows a note and its evidence tag.',
 research:'Kapstein, M. (2000), The Tibetan Assimilation of Buddhism, Oxford University Press; Snellgrove, D. (1987), Indo-Tibetan Buddhism; Scherrer-Schaub, C. (2002), Enacting words, JIABS 25, 263–340 (the decrees); Herrmann-Pfandt, A. (2008), Die lHan kar ma (the palace catalogue).',
 dur:12,hint:'Press an event. The tag under the title changes with it: some events rest on inscriptions and edicts, others on later histories.',
 init:()=>({i:1}),
 watch(p){return {i:Math.min(5,Math.floor(p*6))}},
 ui:[{choose:P6_EV.map((t,i)=>[String(i),t.n]),label:'Event',get:s=>String(s.i),act:'pick'}],
 on:{pick(s,v){s.i=+v;return 'keep'}},
 draw(s,f,X){
  const t=P6_EV[s.i],px=v=>60+(v-600)/500*480,y=130;let out=P6_head(t.k,'Two waves of translation');
  out+=R(px(640),y-3,px(842)-px(640),6,C.green,'none',3)+R(px(842),y-3,px(980)-px(842),6,C.line,'none',3)+R(px(980),y-3,px(1100)-px(980),6,C.blue,'none',3);
  out+=TF(54,y+4,'600',11,C.muted,'end')+TF(546,y+4,'1100',11,C.muted,'start');
  P6_EV.forEach((e,i)=>{const on=i===s.i,up=i%2===0,x=px(e.y);out+=hit(X,'pick',i,e.n,Ci(x,y,on?10:7,on?C.coral:'#fff',on?C.coral:C.ink)+TBF(x,up?y-18:y+28,e.n,12,on?C.coral:C.ink)+TF(x,up?y-32:y+42,e.d,11,C.muted))});
  out+=R(96,186,12,8,C.green,'none',2)+TF(114,194,'early spread',11,C.muted,'start')+R(236,186,12,8,C.line,'none',2)+TF(254,194,'gap',11,C.muted,'start')+R(330,186,12,8,C.blue,'none',2)+TF(348,194,'later spread',11,C.muted,'start');
  out+=P6_panel(206,160)+TBF(56,230,`${t.n}, ${t.d}`,15,C.coral,'start')+P6_para(56,254,t.t,76);
  return {svg:out,phase:t.t};
 }});

const P6_CALQ=[
 {sk:'buddha',en:'awakened one',parts:[['sangs','awakened, cleared'],['rgyas','opened out, flourished']],zh:'fó',zhn:'a sound: short for fótuó'},
 {sk:'bodhisattva',en:'being intent on awakening',parts:[['byang chub','awakening'],['sems','mind'],['dpa’','hero']],zh:'púsà',zhn:'a sound: short for pútísàduǒ'},
 {sk:'tathāgata',en:'one thus gone, or thus come',parts:[['de bzhin','thus'],['gshegs pa','gone']],zh:'rúlái',zhn:'a translation: “thus come”'},
 {sk:'arhat',en:'worthy one',parts:[['dgra','foe'],['bcom pa','who has destroyed']],zh:'āluóhàn',zhn:'a sound; also yìnggòng, “worthy of offerings”'}];
SCENE({id:'tibetan-translation-team',name:'Scholar and translator',tag:'Building words piece by piece',
 definition:'Tibetan translations were made by pairs: an Indian scholar who explained the Sanskrit and a Tibetan translator who wrote the Tibetan. Sanskrit terms were usually rebuilt in Tibetan part by part instead of being written by sound.',
 example:'Sanskrit buddha becomes Tibetan sangs rgyas, “awakened and opened out”. Chinese, by contrast, kept the sound: fó.',
 desc:'A Sanskrit term at the top, its Tibetan equivalent split into labelled parts in the middle, and the Chinese rendering below for contrast. Four terms can be chosen.',
 research:'Colophons of the Derge Kangyur, which name each pair, for example the Indian scholar Jinamitra with the translator Yeshé Dé; Scherrer-Schaub, C. (2002), Enacting words, JIABS 25; Seyfort Ruegg, D. (1992), Some reflections on translating Buddhist philosophical texts from Sanskrit and Tibetan, Asiatische Studien 46.',
 dur:12,hint:'Choose a term and read how Tibetan builds it from meaningful parts. Compare the Chinese line underneath.',
 init:()=>({i:0}),
 watch(p){return {i:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:P6_CALQ.map((t,i)=>[String(i),t.sk]),label:'Term',get:s=>String(s.i),act:'i'}],
 on:{i(s,v){s.i=+v;return 'keep'}},
 draw(s){
  const t=P6_CALQ[s.i],n=t.parts.length,w=150,x0=300-(n*w+(n-1)*12)/2;let out=P6_head('est','Scholar and translator');
  out+=R(60,74,220,46,C.amberp,'none',8)+TF(170,92,'Indian scholar (paṇḍita)',12,C.muted)+TBF(170,110,'explains the Sanskrit',12,C.ink)+R(320,74,220,46,C.pale,'none',8)+TF(430,92,'Tibetan translator (lotsāwa)',12,C.muted)+TBF(430,110,'writes the Tibetan',12,C.ink)+arrow(282,97,318,97,C.line,2,6);
  out+=TF(300,140,'Sanskrit',11,C.muted)+TBF(300,167,t.sk,20,C.ink)+TF(300,185,t.en,12,C.muted);
  t.parts.forEach((q,i)=>{const x=x0+i*(w+12);out+=R(x,198,w,58,C.pale,C.blue,8)+TBF(x+w/2,222,q[0],16,C.blue)+TF(x+w/2,244,q[1],12,C.ink)});
  out+=TF(300,276,'Tibetan: '+t.parts.map(q=>q[0]).join(' '),13,C.ink);
  out+=P6_panel(292,74)+TF(56,314,'Chinese, for contrast',11,C.muted,'start')+TBF(56,336,t.zh,16,C.coral,'start')+TF(170,336,t.zhn,13,C.ink,'start')+TF(56,356,'Both pairs and teams signed their work in a colophon at the end of the text.',12,C.muted,'start');
  return {svg:out,phase:`${t.sk}: Tibetan ${t.parts.map(q=>q[0]).join(' ')}, literally “${t.parts.map(q=>q[1]).join(' + ')}”. Because Tibetan follows the Sanskrit so closely, scholars use it to check or even reconstruct lost Sanskrit wording.`};
 }});

const P6_GRID=(()=>{const r=rng(7),g=[];for(let i=0;i<24;i++)g.push([r(),r()]);return g})();
SCENE({id:'tibetan-translation-mahavyutpatti',name:'One word, one rendering',tag:'The great glossary, about 800',
 definition:'The Mahāvyutpatti is a Sanskrit–Tibetan glossary of about 9,500 entries, compiled by royal order around 800, that set a standard Tibetan equivalent for each Sanskrit term.',
 example:'With the glossary in force, a term such as bodhi is normally byang chub, so a reader, or a search, finds almost every occurrence; earlier and some later translations still show variants.',
 desc:'A grid of three translators by eight passages. Each cell shows whether the translator used the standard term or one of two other renderings; a slider sets how closely the glossary is followed.',
 research:'Mahāvyutpatti, ed. Sakaki, R. (1916), 9,565 entries; the companion decree sGra sbyor bam po gnyis pa (814): Scherrer-Schaub, C. (2002), JIABS 25, 263–340; Ishikawa, M. (1990), A Critical Edition of the sGra sbyor bam po gñis pa.',
 dur:12,hint:'Slide how closely translators follow the glossary. The grid is an illustrative model; the glossary and the decree are real.',
 init:()=>({a:100}),
 watch(p){return {a:Math.round(p*10)*10}},
 ui:[{range:'a',label:'Glossary followed',min:0,max:100,step:10,get:s=>s.a,act:'a',show:v=>v+'%'}],
 on:{a(s,v){s.a=+v;return 'keep'}},
 draw(s){
  let out=P6_head('est','One word, one rendering'),std=0;
  ['Translator 1','Translator 2','Translator 3'].forEach((n,r)=>{out+=TF(118,104+r*40,n,12,C.muted,'end');
   for(let c=0;c<8;c++){const q=P6_GRID[r*8+c],k=q[0]*100<s.a?0:q[1]<.5?1:2;if(!k)std++;out+=R(128+c*52,84+r*40,46,32,[C.pale,C.amberp,C.coralp][k],[C.blue,C.amber,C.coral][k],6)+TBF(151+c*52,105+r*40,['std','A','B'][k],13,[C.blue,C.amber,C.coral][k])}});
  out+=TF(336,218,'eight passages that all contain the same Sanskrit term',11,C.muted);
  out+=counter(40,236,'glossary followed',s.a+'%',C.ink,150)+counter(202,236,'standard term used',std+' of 24',C.blue,160)+counter(374,236,'a search finds',Math.round(std/24*100)+'%',std===24?C.green:C.coral,150);
  out+=P6_para(56,308,'std = the glossary’s term; A and B = other ways of rendering the same word. The 814 decree forbade coining new terms without approval. Model for illustration only.',76,13,C.muted);
  return {svg:out,phase:std===24?'Every translator uses the same term, so the three texts can be compared and searched word by word. This regularity is a hallmark of the Tibetan canon.':`With the glossary followed ${s.a}% of the time, ${24-std} of 24 passages use some other rendering. A reader looking for the standard term would miss them. Early Chinese translations vary in this way.`};
 }});

/* ---------- Lesson: kangyur-tengyur ---------- */
const P6_K=[['Monastic rule (Vinaya)',13],['Perfection of Wisdom',21],['Avataṃsaka',4],['Ratnakūṭa',6],['Other sūtras',32],['Tantras',24],['Dhāraṇī collection',2],['Index',1]];
const P6_T=[['Hymns of praise',1],['Tantra commentaries',78],['Perfection of Wisdom',16],['Madhyamaka',17],['Sūtra commentaries',10],['Yogācāra',16],['Abhidharma',11],['Monastic rule',18],['Logic',20],['Other subjects',26]];
SCENE({id:'kangyur-tengyur',name:'Kangyur and Tengyur',tag:'Translated words, translated treatises',
 definition:'The Tibetan canon has two parts. The Kangyur, “translated words”, holds texts regarded as the Buddha’s teaching. The Tengyur, “translated treatises”, holds works by Indian masters that explain it.',
 example:'In the Derge edition the Kangyur fills 103 volumes and the Tengyur 213. Tantra commentaries alone take up 78 volumes of the Tengyur.',
 desc:'Horizontal bars for the sections of the Kangyur or the Tengyur, by number of volumes in the Derge edition; pressing a bar shows its count and share.',
 research:'Ui, H. et al. (1934), A Complete Catalogue of the Tibetan Buddhist Canons, Tōhoku University (Derge edition: nos. 1–1108 Kangyur, 1109–4569 Tengyur); Harrison, P. (1996), A brief history of the Tibetan bKa’ ’gyur, in Cabezón and Jackson (eds.), Tibetan Literature; Skilling, P. (1997), From bKa’ bstan bcos to bKa’ ’gyur and bsTan ’gyur.',
 dur:12,hint:'Switch between the two collections and press a bar. Volume counts are for the Derge edition and differ slightly in other editions.',
 init:()=>({c:'k',i:0}),
 watch(p){return {c:p<.5?'k':'t',i:Math.floor(p*16)%8}},
 ui:[{choose:[['k','Kangyur'],['t','Tengyur']],label:'Collection',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=v;s.i=0;return 'keep'},pick(s,v){s.i=+v;return 'keep'}},
 draw(s,f,X){
  const D=s.c==='k'?P6_K:P6_T,tot=D.reduce((a,d)=>a+d[1],0),max=Math.max(...D.map(d=>d[1])),i=Math.min(s.i,D.length-1),t=D[i],h=s.c==='k'?26:22;
  let out=P6_head('est',s.c==='k'?'Kangyur: translated words':'Tengyur: translated treatises');
  D.forEach((d,j)=>{const y=76+j*h,on=j===i,w=Math.max(3,d[1]/max*280);out+=hit(X,'pick',j,d[0],TF(206,y+14,d[0],12,on?C.ink:C.muted,'end')+R(214,y,w,h-6,on?C.blue:'#b9d4e6','none',4)+TBF(214+w+8,y+14,String(d[1]),12,on?C.blue:C.muted,'start'))});
  out+=counter(40,308,'volumes',String(tot),C.ink,110)+counter(162,308,'texts, about',s.c==='k'?'1,100':'3,460',C.ink,130);
  out+=P6_para(310,322,`${t[0]}: ${t[1]} volume${t[1]>1?'s':''}, ${Math.round(t[1]/tot*100)}% of the ${s.c==='k'?'Kangyur':'Tengyur'}.`,36,12,C.ink,15);
  return {svg:out,phase:s.c==='k'?`The Kangyur: ${tot} volumes in the Derge edition, holding about 1,100 texts regarded as the word of the Buddha. ${t[0]} fills ${t[1]}.`:`The Tengyur: ${tot} volumes in the Derge edition, holding about 3,460 works by Indian masters, from philosophy and logic to grammar and medicine. ${t[0]} fills ${t[1]}.`};
 }});

const P6_SORT=[
 {n:'Vinayavibhaṅga',c:'The rules for monks, each with the story of how it came to be laid down. Translated from Sanskrit.',v:'k',r:'Kangyur. It is presented as the Buddha’s own word, and its section, the monastic rule, opens the collection.'},
 {n:'Heart Sūtra',c:'A very short Perfection of Wisdom sūtra, translated from Sanskrit.',v:'k',r:'Kangyur. A sūtra, so it counts as the Buddha’s word. It appears twice: among the Perfection of Wisdom texts and among the tantras.'},
 {n:'Root Verses on the Middle Way',c:'A philosophical work in verse by the Indian master Nāgārjuna. Translated from Sanskrit.',v:'t',r:'Tengyur. A treatise by a named Indian author, however revered, is not the Buddha’s word.'},
 {n:'Entering the Bodhisattva’s Way',c:'A guide to the bodhisattva path by the Indian monk Śāntideva. Translated from Sanskrit.',v:'t',r:'Tengyur, for the same reason: an Indian master’s work.'},
 {n:'Great Treatise on the Stages of the Path',c:'Written in Tibetan by Tsongkhapa in 1402.',v:'n',r:'Neither. Works composed in Tibetan are not translations, so they stay outside both collections, in each author’s collected works.'},
 {n:'Guhyagarbha Tantra',c:'A tantra of the Nyingma school, translated in the early period. Its Indian origin was disputed in Butön’s day.',v:'x',r:'Disputed. Butön left it out because its Indian origin was doubted. Others defended it and a Sanskrit manuscript was reported; many Kangyurs include it among the “old tantras”.'}];
const P6_SV={k:'Kangyur',t:'Tengyur',n:'Neither'};
SCENE({id:'kangyur-tengyur-buton',name:'Sorting the texts',tag:'Butön’s test, 14th century',
 definition:'The scholar Butön Rinchen Drup (1290–1364) catalogued the translated texts and helped fix what belonged in the Kangyur and the Tengyur. His main test was whether a text was a genuine translation from an Indian original.',
 example:'Nāgārjuna’s Root Verses on the Middle Way is an Indian treatise, so it belongs in the Tengyur. A work written in Tibetan belongs in neither.',
 desc:'Six texts with short descriptions. The learner sorts each into Kangyur, Tengyur or neither; the placement and the reason are then shown, with a score. One text is disputed.',
 research:'Butön Rinchen Drup (1322), History of Buddhism (chos ’byung), with its catalogue of translated texts; Schaeffer, K. R. (2009), The Culture of the Book in Tibet, Columbia University Press; Harrison, P. (1996), A brief history of the Tibetan bKa’ ’gyur.',
 dur:12,hint:'Read the description, then sort the text. The sixth has no agreed answer: Tibetan traditions differ on it. Your answers stay on this page.',
 init:()=>({i:0,a:{}}),
 watch(p){const n=Math.min(6,Math.floor(p*7)),a={};for(let k=0;k<n;k++)a[k]=P6_SORT[k].v==='x'?'k':P6_SORT[k].v;return {i:Math.min(5,n),a,sim:true}},
 ui:[{b:'Kangyur',act:'ans',arg:'k'},{b:'Tengyur',act:'ans',arg:'t'},{b:'Neither',act:'ans',arg:'n'},{b:'Next text',act:'next'}],
 on:{pick(s,v){s.i=+v;return 'keep'},ans(s,v){s.a[s.i]=v;return 'keep'},next(s){s.i=(s.i+1)%6;return 'keep'}},
 draw(s,f,X){
  const t=P6_SORT[s.i],a=s.a[s.i];let out=P6_head(t.v==='x'?'deb':'est','Where does each text go?');
  P6_SORT.forEach((u,i)=>{const x=40+i*88,on=i===s.i,an=s.a[i],st=!an?'not yet':u.v==='x'?'disputed':an===u.v?'matches':'differs';out+=hit(X,'pick',i,u.n,R(x,74,82,40,on?C.pale:'#fff',on?C.blue:C.grid,8)+TBF(x+41,92,'Text '+(i+1),12,on?C.blue:C.ink)+TF(x+41,107,st,11,st==='matches'?C.green:st==='differs'?C.coral:st==='disputed'?C.purple:C.muted))});
  out+=P6_panel(124,236)+TBF(56,150,t.n,15,C.ink,'start')+P6_para(56,172,t.c,76);
  if(a)out+=TBF(56,236,'You chose: '+P6_SV[a],13,t.v==='x'?C.purple:a===t.v?C.green:C.coral,'start')+P6_para(56,262,t.r,76);
  else out+=TF(56,244,'Sort it with the buttons below.',13,C.muted,'start');
  const ok=Object.keys(s.a).filter(k=>s.a[k]===P6_SORT[k].v).length;
  out+=TF(544,348,`${ok} of 5 placed as in the catalogues`,12,C.muted,'end');
  return {svg:out,phase:a?t.r:'Kangyur for the Buddha’s word, Tengyur for Indian masters’ works, and neither for anything composed in Tibetan. The test in each case was a known Indian original.'};
 }});

const P6_ED=[
 {k:'on',n:'Old Narthang',d:'early 1300s',m:'manuscript',x:300,y:92,p:[],t:'A manuscript collection assembled at Narthang monastery in the early fourteenth century. Tradition makes it the source of all later Kangyurs; scholars now think the picture was less tidy. It does not survive.'},
 {k:'ts',n:'Tshalpa',d:'1347–51',m:'manuscript',x:160,y:150,p:['on'],t:'A revised manuscript Kangyur made at Tshal Gungthang near Lhasa. It heads one of the two main lines of descent, sometimes called the eastern line.'},
 {k:'th',n:'Thempangma',d:'1431',m:'manuscript',x:440,y:150,p:['on'],t:'A manuscript Kangyur made at Gyantse. It heads the other main line, sometimes called the western line. Its copies preserve some readings lost in the Tshalpa line.'},
 {k:'yo',n:'Yongle',d:'1410',m:'printed',x:80,y:214,p:['ts'],t:'The first printed Kangyur, cut on woodblocks in Beijing by order of the Yongle emperor of the Ming, from a Tshalpa-line manuscript.'},
 {k:'li',n:'Lithang',d:'1608–21',m:'printed',x:220,y:214,p:['ts'],t:'The first Kangyur printed in a Tibetan-speaking region, at Lithang in the kingdom of Jang, from a Tshalpa-line manuscript.'},
 {k:'st',n:'Stog Palace',d:'c. 1730',m:'manuscript',x:500,y:214,p:['th'],t:'A manuscript copy made for the palace at Stog in Ladakh. It is one of the best witnesses to the Thempangma line.'},
 {k:'de',n:'Derge',d:'1733',m:'printed',x:260,y:278,p:['li','th'],t:'Printed at Derge in eastern Tibet, based on the Lithang print and corrected against Thempangma-line copies. Its blocks are still printed from today, and it is the edition most often cited.'},
 {k:'na',n:'Narthang print',d:'1730–32',m:'printed',x:400,y:278,p:['ts','th'],t:'Printed at Narthang in central Tibet, mainly from the Tshalpa line with readings from the Thempangma line. The Lhasa edition of 1934 is based on it.'}];
SCENE({id:'kangyur-tengyur-editions',name:'A family of editions',tag:'Copying leaves a trail',
 definition:'There is no single Kangyur. There are manuscript and printed editions, each copied from earlier ones, and their shared errors show which descends from which.',
 example:'The Derge print of 1733 descends from the Lithang print and so from the Tshalpa manuscript, but its editors also corrected it against copies from the other line.',
 desc:'A family tree of eight Kangyur editions from the early 1300s to 1733, with solid lines for descent; pressing an edition shows its date, whether it is manuscript or print, and its parents.',
 research:'Harrison, P. (1996), A brief history of the Tibetan bKa’ ’gyur; Eimer, H. (1992), Ein Jahrzehnt Studien zur Überlieferung des tibetischen Kanjur; Skilling, P. (1997), in Eimer (ed.), Transmission of the Tibetan Canon. The two-line model is a simplification, and independent local Kangyurs also exist.',
 dur:12,hint:'Press an edition. Its parents light up. Editors often checked one line against the other, so the tree has cross-links.',
 init:()=>({k:'de'}),
 watch(p){return {k:P6_ED[Math.min(7,Math.floor(p*8))].k}},
 ui:[{choose:P6_ED.map(e=>[e.k,e.n]),label:'Edition',get:s=>s.k,act:'pick'}],
 on:{pick(s,v){s.k=v;return 'keep'}},
 draw(s,f,X){
  const e=P6_ED.find(q=>q.k===s.k),by=k=>P6_ED.find(q=>q.k===k);let out=P6_head('est','A family of Kangyurs');
  P6_ED.forEach(c=>c.p.forEach(pk=>{const a=by(pk),hl=c.k===s.k;out+=L(a.x,a.y+17,c.x,c.y-17,hl?C.coral:C.line,hl?2.6:1.6)}));
  P6_ED.forEach(c=>{const on=c.k===s.k,par=e.p.includes(c.k),pr=c.m==='printed';out+=hit(X,'pick',c.k,c.n,R(c.x-56,c.y-17,112,34,on?C.coralp:par?C.amberp:pr?C.pale:'#fff',on?C.coral:par?C.amber:pr?C.blue:C.grid,8)+TBF(c.x,c.y-2,c.n,12,C.ink)+TF(c.x,c.y+12,c.d,10,C.muted))});
  out+=R(40,70,10,10,'#fff',C.grid,2)+TF(56,79,'manuscript',11,C.muted,'start')+R(40,86,10,10,C.pale,C.blue,2)+TF(56,95,'printed',11,C.muted,'start');
  out+=P6_panel(304,72)+P6_para(52,322,`${e.n} (${e.d}, ${e.m}). ${e.t}`,80,12,C.ink,15);
  return {svg:out,phase:`${e.n}, ${e.d}: ${e.t}`};
 }});

/* ---------- Lesson: comparing-canons ---------- */
const P6_CAN=[
 {n:'Pali canon',vol:57,ent:0,lang:'Pali',who:'Theravāda: Sri Lanka, Myanmar, Thailand, Cambodia, Laos.',what:'Three baskets from a single school: monastic rule, discourses and Abhidhamma. Commentaries stand outside it.',ed:'Volumes: the Pali Text Society’s Roman-script edition, about 57 with indexes. It is counted in books and discourses, not in numbered texts.'},
 {n:'Chinese canon',vol:55,ent:2184,lang:'Chinese',who:'East Asia: China, Korea, Japan, Vietnam.',what:'Translations from many Indian schools, early and Mahāyāna, often several versions of one text, plus works written in Chinese.',ed:'Counts: volumes 1–55 of the Taishō edition, 2,184 numbered texts. The full 85 volumes add Japanese works and Dunhuang finds.'},
 {n:'Tibetan canon',vol:316,ent:4569,lang:'Tibetan',who:'Tibet, the Himalaya, Mongolia.',what:'Kangyur and Tengyur: sūtras, a very large body of tantras, and Indian treatises. Works written in Tibetan stand outside it.',ed:'Counts: the Derge edition, 103 + 213 volumes and 4,569 catalogue numbers. A Tibetan volume is a stack of long loose leaves.'}];
SCENE({id:'comparing-canons',name:'Three canons side by side',tag:'Pali, Chinese, Tibetan',
 definition:'Three great collections of Buddhist scripture survive in full: the Pali canon, the Chinese canon and the Tibetan canon. They differ in language, in size and in what each tradition counts as scripture.',
 example:'The Pali canon holds the texts of one early school. The Chinese canon holds translations from many schools. The Tibetan canon is richest in tantras and Indian treatises.',
 desc:'Three bars for the Pali, Chinese and Tibetan canons, switchable between printed volumes and numbered catalogue entries; pressing a canon shows who uses it, what it holds and which edition was counted.',
 research:'Norman, K. R. (1983), Pāli Literature, Harrassowitz; Taishō shinshū daizōkyō (1924–34), vols 1–55; Ui, H. et al. (1934), A Complete Catalogue of the Tibetan Buddhist Canons; Lancaster, L. R. (1979), Buddhist literature: its canons, scribes, and editors.',
 dur:12,hint:'Switch the measure and press a canon. Volumes are not equal units across editions, so the bars show scale only roughly.',
 init:()=>({m:'vol',i:0}),
 watch(p){return {m:p<.5?'vol':'ent',i:Math.floor(p*6)%3}},
 ui:[{choose:[['vol','Printed volumes'],['ent','Catalogue entries']],label:'Measure',get:s=>s.m,act:'m'}],
 on:{m(s,v){s.m=v;return 'keep'},pick(s,v){s.i=+v;return 'keep'}},
 draw(s,f,X){
  const max=s.m==='vol'?316:4569,t=P6_CAN[s.i];let out=P6_head('est','Three canons side by side');
  P6_CAN.forEach((c,i)=>{const y=82+i*40,on=i===s.i,v=c[s.m],w=v?Math.max(4,v/max*300):0;
   out+=hit(X,'pick',i,c.n,TBF(150,y+19,c.n,13,on?C.coral:C.ink,'end')+R(160,y,330,28,'#f6f9fb','none',6)+(v?R(160,y,w,28,on?C.coral:'#b9d4e6','none',6)+TBF(168+w,y+19,P6_num(v),13,on?C.coral:C.muted,'start'):TF(170,y+19,'not counted in numbered texts',12,C.muted,'start')))});
  out+=P6_panel(206,160)+TBF(56,230,`${t.n}: in ${t.lang}`,14,C.coral,'start')+P6_para(56,252,t.who,76)+P6_para(56,276,t.what,76)+P6_para(56,326,t.ed,76,12,C.muted,15);
  return {svg:out,phase:`${t.n}. ${t.what} ${t.ed}`};
 }});

const P6_GEN=[
 {n:'Early discourses',v:[3,3,1],t:['All five Nikāyas.','Four Āgamas, from more than one school, and many single sūtras.','Only a few dozen, though more are quoted inside other works.']},
 {n:'Monastic rule',v:[2,3,2],t:['One Vinaya, the Theravāda.','Four complete Vinayas of other schools, and most of a fifth.','One Vinaya, the Mūlasarvāstivāda.']},
 {n:'Abhidharma',v:[3,3,1],t:['Seven books of the Theravāda.','Seven books of the Sarvāstivāda and several from other schools.','No full set of the early books; study rests on Vasubandhu’s treatise in the Tengyur.']},
 {n:'Mahāyāna sūtras',v:[0,3,3],t:['None.','Several hundred, often in more than one translation.','Several hundred.']},
 {n:'Tantras',v:[0,1,3],t:['None.','Some, mostly translated in the eighth century and after.','Many hundreds, including later tantras never put into Chinese.']},
 {n:'Treatises',v:[1,3,3],t:['Commentaries exist but stand outside the three baskets.','Indian treatises and works written in Chinese, both inside the canon.','Indian treatises fill the Tengyur; Tibetan works stand outside.']}];
SCENE({id:'comparing-canons-overlap',name:'What is shared, what is not',tag:'Six kinds of text',
 definition:'The three canons overlap in the oldest layers, the early discourses and the monastic rule, and differ most in later layers such as the Mahāyāna sūtras and the tantras.',
 example:'Early discourses fill the Pali Nikāyas and the Chinese Āgamas, but only a few dozen were translated into Tibetan. Tantras are plentiful in Tibetan and absent from Pali.',
 desc:'Six kinds of text in a column; for the selected kind, three rows show how much of it each canon holds as a row of three dots, with a short note.',
 research:'Anālayo (2011), A Comparative Study of the Majjhima-nikāya, Dharma Drum; Lamotte, É. (1958/1988), History of Indian Buddhism; Skilling, P. (1994–97), Mahāsūtras, Pali Text Society (early discourses in Tibetan); Clarke, S. (2015), Vinayas, in Brill’s Encyclopedia of Buddhism.',
 dur:12,hint:'Press a kind of text. Each tradition holds its own canon to be complete; the dots only compare what was collected where.',
 init:()=>({i:0}),
 watch(p){return {i:Math.min(5,Math.floor(p*6))}},
 ui:[{choose:P6_GEN.map((g,i)=>[String(i),g.n]),label:'Kind of text',get:s=>String(s.i),act:'pick'}],
 on:{pick(s,v){s.i=+v;return 'keep'}},
 draw(s,f,X){
  const g=P6_GEN[s.i];let out=P6_head('est','What is shared, what is not');
  P6_GEN.forEach((q,i)=>{const y=78+i*32,on=i===s.i;out+=hit(X,'pick',i,q.n,R(30,y,150,26,on?C.pale:'#fff',on?C.blue:C.grid,6)+TBF(105,y+17,q.n,12,on?C.blue:C.ink))});
  ['Pali','Chinese','Tibetan'].forEach((c,j)=>{const y=80+j*66;out+=R(196,y,374,58,'#fff',C.grid,8)+TBF(210,y+22,c,13,C.ink,'start');
   for(let d=0;d<3;d++)out+=Ci(286+d*20,y+17,7,d<g.v[j]?C.blue:'#fff',d<g.v[j]?C.blue:C.line);
   out+=TF(352,y+22,['none','a little','part','much'][g.v[j]],12,g.v[j]?C.blue:C.muted,'start')+P6_wrap(g.t[j],54).map((l,k)=>TF(210,y+40+k*13,l,11,C.muted,'start')).join('')});
  out+=P6_para(40,302,'Where a text survives in more than one canon, the versions can be compared. They came down through different schools, so agreement between them points to an early common source.',78,13,C.ink);
  return {svg:out,phase:`${g.n}. Pali: ${g.t[0]} Chinese: ${g.t[1]} Tibetan: ${g.t[2]}`};
 }});

const P6_VERSE=[
 {en:'Not to do any evil,',pa:['sabbapāpassa akaraṇaṃ','of all evil, the not-doing'],zh:['zhū è mò zuò','all evils: do not do them'],bo:['sdig pa ci yang mi bya ste','no evil whatever is to be done'],note:'All three say the same thing in the same order.'},
 {en:'to take up what is wholesome,',pa:['kusalassa upasampadā','of the wholesome, the taking up'],zh:['zhòng shàn fèng xíng','all that is good: practise it'],bo:['dge ba phun sum tshogs par spyad','practise the wholesome in full'],note:'Chinese adds “all”; Tibetan adds “in full”.'},
 {en:'to purify one’s own mind:',pa:['sacittapariyodapanaṃ','one’s own mind, the cleansing'],zh:['zì jìng qí yì','oneself purify one’s mind'],bo:['rang gi sems ni yongs su ’dul','thoroughly tame one’s own mind'],note:'A real difference: Pali and Chinese have “purify”, Tibetan has “tame”. The Indian versions already differed here.'},
 {en:'this is the teaching of the buddhas.',pa:['etaṃ buddhāna sāsanaṃ','this is the buddhas’ teaching'],zh:['shì zhū fó jiào','this is all buddhas’ teaching'],bo:['’di ni sangs rgyas bstan pa yin','this is the Buddha’s teaching'],note:'Pali and Chinese have the plural, “buddhas”.'}];
SCENE({id:'comparing-canons-parallel',name:'One verse in three languages',tag:'Following a passage across canons',
 definition:'A parallel is the same passage preserved in more than one canon. Setting parallels side by side shows what the versions share and where they have drifted apart.',
 example:'A well-known four-line verse is Dhammapada 183 in Pali. It is also in the Chinese canon and in the Tibetan, and the third line differs: “purify” the mind in Pali, “tame” it in Tibetan.',
 desc:'A four-line verse; for the selected line the Pali, Chinese (pinyin) and Tibetan (Wylie) wording is shown with a word-for-word gloss, an English rendering and a note on any difference.',
 research:'Dhammapada 183 (Pali Text Society edn, von Hinüber and Norman 1994); Faju jing, Taishō no. 210, and the Chinese monastic codes; the Tibetan Prātimokṣa Sūtra and Udānavarga 28.1 (Bernhard, F. 1965, Udānavarga); Anālayo (2011), A Comparative Study of the Majjhima-nikāya, on the method. The wording given is the common form in each language; small variants exist.',
 dur:12,hint:'Press each of the four lines. Line three is where the versions part company.',
 init:()=>({i:2}),
 watch(p){return {i:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:[['0','Line 1'],['1','Line 2'],['2','Line 3'],['3','Line 4']],label:'Line',get:s=>String(s.i),act:'pick'}],
 on:{pick(s,v){s.i=+v;return 'keep'}},
 draw(s,f,X){
  const v=P6_VERSE[s.i];let out=P6_head('est','One verse in three languages');
  P6_VERSE.forEach((q,i)=>{const on=i===s.i;out+=hit(X,'pick',i,'Line '+(i+1),R(40+i*132,72,124,30,on?C.pale:'#fff',on?C.blue:C.grid,8)+TBF(102+i*132,92,'Line '+(i+1),12,on?C.blue:C.ink))});
  out+=TBF(300,128,'“'+v.en+'”',15,C.ink);
  [['Pali',v.pa,C.amber],['Chinese',v.zh,C.coral],['Tibetan',v.bo,C.blue]].forEach(([n,q,col],j)=>{const y=142+j*56;out+=R(40,y,520,48,'#fff',C.grid,8)+TBF(54,y+20,n,12,col,'start')+TBF(132,y+20,q[0],14,C.ink,'start')+TF(132,y+38,q[1],12,C.muted,'start')});
  out+=P6_para(48,330,v.note,78,13,s.i===2?C.purple:C.ink)+TF(300,370,'Common wording in each language; small variants exist.',11,C.muted);
  return {svg:out,phase:`Line ${s.i+1}: ${v.note} Comparing parallels like this, line by line, is how scholars study what the early versions had in common.`};
 }});

/* ---------- Lesson: mongolian-manchu ---------- */
const P6_NET=[
 {k:'in',n:'Indic originals',d:'',x:86,y:170,p:[],t:'Texts in Sanskrit, Gāndhārī and other Indian languages. Most of the originals are lost; the translations are what survive.'},
 {k:'zh',n:'Chinese',d:'2nd–11th c.',x:250,y:112,p:['in'],t:'Translated from Indic originals over about nine centuries. Korea, Japan and Vietnam did not translate it: they read the canon in Chinese.'},
 {k:'bo',n:'Tibetan',d:'8th–14th c.',x:250,y:228,p:['in','zh'],t:'Translated mainly from Sanskrit. A smaller number of texts were translated from Chinese.'},
 {k:'tg',n:'Tangut',d:'11th c.',x:440,y:86,p:['zh','bo'],t:'The Tangut (Xixia) state devised its own script in 1036 and translated the canon, mostly from Chinese with some texts from Tibetan. A Tangut canon of more than 3,500 fascicles was printed about 1302. The language is no longer spoken.'},
 {k:'mn',n:'Mongolian',d:'17th–18th c.',x:440,y:244,p:['bo'],t:'The Kangyur was translated from Tibetan under Ligdan Khan in 1628–29 and printed in Beijing in 1718–20 in 108 volumes. The Tengyur followed in 1742–49, in about 225 volumes.'},
 {k:'ma',n:'Manchu',d:'18th c.',x:440,y:165,p:['zh','bo'],t:'Ordered by the Qianlong emperor in the 1770s and finished in the 1790s in 108 volumes. It was translated mainly from the Chinese, with the Tibetan and Mongolian consulted.'}];
SCENE({id:'mongolian-manchu',name:'Canons from canons',tag:'Tangut, Mongolian, Manchu',
 definition:'Later canons were translated not from Indian originals but from the Chinese or Tibetan canon. The Tangut, Mongolian and Manchu canons were all made this way, each sponsored by a ruler.',
 example:'The Mongolian Kangyur was translated from Tibetan in 1628–29. The Manchu canon of the eighteenth century was made mainly from the Chinese.',
 desc:'A diagram with Indic originals on the left, the Chinese and Tibetan canons in the middle and the Tangut, Manchu and Mongolian canons on the right, joined by arrows; pressing a canon lights its sources and shows a note.',
 research:'Kollmar-Paulenz, K. (2002), The transmission of the Mongolian Kanjur, in Eimer and Germano (eds.), The Many Canons of Tibetan Buddhism; Heissig, W. (1954), Die Pekinger lamaistischen Blockdrucke in mongolischer Sprache; Kychanov, E. I. (1999), Catalogue of Tangut Buddhist Texts, Kyoto University; Wu, J. and Chia, L. (eds.) (2016), Spreading Buddha’s Word in East Asia.',
 dur:12,hint:'Press a canon to see what it was translated from. Volume and fascicle counts differ a little between sources.',
 init:()=>({k:'mn'}),
 watch(p){return {k:P6_NET[Math.min(5,Math.floor(p*6))].k}},
 ui:[{choose:P6_NET.map(e=>[e.k,e.n]),label:'Canon',get:s=>s.k,act:'pick'}],
 on:{pick(s,v){s.k=v;return 'keep'}},
 draw(s,f,X){
  const e=P6_NET.find(q=>q.k===s.k),by=k=>P6_NET.find(q=>q.k===k);let out=P6_head('est','Canons made from canons');
  P6_NET.forEach(c=>c.p.forEach(pk=>{const a=by(pk),hl=c.k===s.k,minor=(c.k==='bo'&&pk==='zh')||(c.k==='tg'&&pk==='bo');out+=arrowR([a.x,a.y],[c.x,c.y],a.x===c.x?24:66,c.x===a.x?24:66,hl?C.coral:C.line,hl?2.8:1.8).replace('<line','<line'+(minor?' stroke-dasharray="5 4"':''))}));
  P6_NET.forEach(c=>{const on=c.k===s.k,par=e.p.includes(c.k);out+=hit(X,'pick',c.k,c.n,R(c.x-60,c.y-20,120,40,on?C.coralp:par?C.amberp:'#fff',on?C.coral:par?C.amber:C.grid,8)+TBF(c.x,c.y-(c.d?2:-5),c.n,13,C.ink)+(c.d?TF(c.x,c.y+13,c.d,11,C.muted):''))});
  out+=P6_panel(278,96)+P6_para(52,298,`${e.n}. ${e.t}`,80,12,C.ink,15);
  return {svg:out,phase:`${e.n}: ${e.t}`};
 }});

SCENE({id:'mongolian-manchu-relay',name:'Translating a translation',tag:'What each step can lose',
 definition:'A relay translation is made from an earlier translation, not from the original. Each step can add small shifts of meaning, unless the translators check their work against an earlier stage.',
 example:'A Mongolian sūtra translated from Tibetan is two steps from the Sanskrit. If each step kept 95% of some measurable detail (an illustrative figure, not a measurement), two steps would keep about 90%.',
 desc:'A chain of one to four translation steps drawn as bars of shrinking length, with sliders for the number of steps and the detail kept per step, and a switch for checking against the original.',
 research:'On relay translation in these canons: Kollmar-Paulenz, K. (2002), The transmission of the Mongolian Kanjur; Seyfort Ruegg, D. (1992), Some reflections on translating Buddhist philosophical texts, Asiatische Studien 46. The percentages are an illustrative model, not measurements.',
 dur:12,hint:'Change the number of steps and how much each keeps, then switch on checking. The numbers are a model to show the shape of the problem.',
 init:()=>({n:2,f:95,c:'0'}),
 watch(p){return {n:1+Math.min(3,Math.floor(p*4)),f:95,c:p>.75?'1':'0'}},
 ui:[{range:'n',label:'Steps from the original',min:1,max:4,step:1,get:s=>s.n,act:'n',show:v=>String(v)},{range:'f',label:'Detail kept per step',min:85,max:99,step:1,get:s=>s.f,act:'f',show:v=>v+'%'},{choose:[['0','Not checked'],['1','Checked against the original']],label:'Checking',get:s=>s.c,act:'c'}],
 on:{n(s,v){s.n=+v;return 'keep'},f(s,v){s.f=+v;return 'keep'},c(s,v){s.c=v;return 'keep'}},
 draw(s){
  const f=s.f/100,keep=k=>s.c==='1'?(k?f:1):Math.pow(f,k),end=keep(s.n);let out=P6_head('est','Translating a translation');
  out+=TF(300,76,'bars: an illustrative model, not measurements',11,C.muted);
  for(let k=0;k<=4;k++){const y=90+k*38,on=k<=s.n,v=keep(k);out+=TF(150,y+19,k?`after step ${k}`:'the original',12,on?C.ink:C.line,'end');
   if(on)out+=R(160,y,340,26,'#f6f9fb','none',6)+R(160,y,340*v,26,k===s.n?C.coral:k?'#b9d4e6':C.green,'none',6)+TBF(168+340*v,y+18,Math.round(v*100)+'%',12,k===s.n?C.coral:C.muted,'start')}
  out+=counter(40,292,'steps',String(s.n),C.ink,100)+counter(152,292,'kept per step',s.f+'%',C.ink,130)+counter(294,292,'kept at the end',Math.round(end*100)+'%',C.coral,140);
  out+=P6_para(450,306,s.c==='1'?'Checked: only one step’s loss.':'Unchecked: losses multiply.',18,12,C.muted,15);
  return {svg:out,phase:s.c==='1'?`Checked against the original, the last version loses only what one step loses: about ${Math.round(end*100)}% is kept however long the chain. The Manchu translators consulted the Tibetan and Mongolian for this reason.`:`Unchecked, each step multiplies the loss: ${s.f}% kept per step leaves about ${Math.round(end*100)}% after ${s.n} step${s.n>1?'s':''}.`};
 }});

const P6_LEX=[
 {en:'Buddha',rows:[['Sanskrit','buddha','“awakened”'],['Chinese','fó','a sound, short for fótuó'],['Tibetan','sangs rgyas','a translation: “awakened and opened out”'],['Mongolian','burqan','borrowed through Old Uyghur'],['Manchu','fucihi','generally traced to Chinese fó']]},
 {en:'dharma, the teaching',rows:[['Sanskrit','dharma','“what holds”: law, teaching'],['Chinese','fǎ','an existing word: “law, method”'],['Tibetan','chos','an existing word given this sense'],['Mongolian','nom','via Uyghur and Sogdian, from Greek nomos'],['Manchu','nomun','from Mongolian nom']]},
 {en:'guru, a teacher',rows:[['Sanskrit','guru','“weighty”: a teacher'],['Chinese','lǎma','a sound, from Tibetan'],['Tibetan','bla ma','a translation: “the higher one”'],['Mongolian','blam-a','borrowed from Tibetan'],['Manchu','lama','borrowed from Tibetan']]}];
SCENE({id:'mongolian-manchu-quadrilingual',name:'One word in five languages',tag:'Where each language got its terms',
 definition:'As Buddhism moved between languages, each one built its vocabulary differently: by translating the meaning, by copying the sound, or by borrowing a word from a neighbour.',
 example:'Mongolian nom, “teaching”, came through Uyghur and Sogdian from the Greek word nomos, “law”. Manchu then borrowed it from Mongolian as nomun.',
 desc:'A table of one term in Sanskrit, Chinese, Tibetan, Mongolian and Manchu, with a note on how each language arrived at its word; three terms can be chosen.',
 research:'Multilingual glossaries compiled under the Qianlong emperor in the eighteenth century, including the five-language “Pentaglot” dictionary; Clauson, G. (1972), An Etymological Dictionary of Pre-Thirteenth-Century Turkish (burxan, nom); Norman, J. (2013), A Comprehensive Manchu–English Dictionary; Kara, G. (2005), Books of the Mongolian Nomads.',
 dur:12,hint:'Choose a term and read down the column. Borrowed words record the route the teaching took.',
 init:()=>({i:1}),
 watch(p){return {i:Math.min(2,Math.floor(p*3))}},
 ui:[{choose:P6_LEX.map((t,i)=>[String(i),t.en]),label:'Term',get:s=>String(s.i),act:'i'}],
 on:{i(s,v){s.i=+v;return 'keep'}},
 draw(s){
  const t=P6_LEX[s.i];let out=P6_head('est','One word in five languages');
  out+=TBF(300,90,t.en,16,C.ink);
  t.rows.forEach((r,j)=>{const y=104+j*44;out+=R(40,y,520,38,j%2?'#fff':'#f6f9fb',C.grid,8)+TF(56,y+24,r[0],12,C.muted,'start')+TBF(150,y+24,r[1],15,[C.amber,C.coral,C.blue,C.green,C.purple][j],'start')+TF(270,y+24,r[2],12,C.ink,'start')});
  out+=TF(300,348,'Roman-letter spellings; each language has its own script.',11,C.muted);
  return {svg:out,phase:`${t.en}: ${t.rows.map(r=>r[0]+' '+r[1]).join(', ')}. ${t.rows[3][0]} ${t.rows[3][1]}: ${t.rows[3][2]}.`};
 }});
