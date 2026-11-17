/* ===================== Tripitaka era 8 · The canon today (1881–today) ===================== */
// Roman-script and critical editions, the Taishō, digital canons, and the comparison of parallel versions and
// newly found manuscripts. Every picture is a pure function of state. Scholarly positions are attributed, and
// figures that sources give differently are labelled approximate. No script is faked: romanisation only.
const P8_wrap=(str,n)=>{const out=[];let line='';for(const w of String(str).split(' ')){if(line&&(line+' '+w).length>n){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out};
const P8_lines=(x,y,lines,size=13,fill=C.ink,anchor='start',lh=18)=>lines.map((l,i)=>TF(x,y+i*lh,l,size,fill,anchor)).join('');
const P8_TAGS={est:['established',C.green,C.greenp],trad:['traditional account',C.purple,C.purplep],deb:['debated',C.amber,C.amberp],ill:['illustrative model',C.muted,'#e8eef2']};
const P8_tag=k=>{const [t,ink,bg]=P8_TAGS[k],w=t.length*7.4+24;return R(300-w/2,42,w,22,bg,'none',11)+TBF(300,57,t,13,ink)};
const P8_num=n=>Math.round(n).toLocaleString('en-GB');

// A list of pressable items on the left and the chosen item's facts on the right.
function P8_cards(o){
 const n=o.items.length;
 SCENE({id:o.id,name:o.name,tag:o.tag,definition:o.definition,example:o.example,desc:o.desc,research:o.research,dur:o.dur||12,hint:o.hint,
  init:()=>({i:0}),
  watch(p){return {i:Math.min(n-1,Math.floor(p*n))}},
  ui:[{b:'Previous',act:'prev'},{b:'Next',act:'next'}],
  on:{pick(s,v){s.i=clamp(+v,0,n-1);return 'keep'},next(s){s.i=(s.i+1)%n;return 'keep'},prev(s){s.i=(s.i+n-1)%n;return 'keep'}},
  draw(s,f,X){
   const it=o.items[s.i],rh=Math.min(40,264/n);let out=heading(o.heading)+P8_tag(it.tag);
   o.items.forEach((q,i)=>{const y=76+i*rh,on=i===s.i;
    out+=hit(X,'pick',i,q.t,R(16,y,236,rh-5,on?C.pale:'#fff',on?C.blue:C.grid,7)+TBF(26,y+rh/2+2,q.d,13,on?C.blue:C.muted,'start')+TF(26+o.dw,y+rh/2+2,q.t,13,C.ink,'start'))});
   out+=R(262,76,322,262,'#f6f9fb','none',10)+TBF(276,100,it.title||it.t,15,C.ink,'start')+P8_lines(276,126,it.lines,13,C.ink,'start',19);
   if(o.foot)out+=T(300,366,o.foot,15,C.muted);
   return {svg:out,phase:it.phase};
  }});
}

/* =========================== pali-text-society =========================== */
P8_cards({id:'pali-text-society',name:'The Pali Text Society',tag:'Roman-script editions since 1881',heading:'Putting the Pali canon into print',dw:68,
 definition:'The Pali Text Society, founded in London in 1881 by T. W. Rhys Davids, set out to edit and print the Pali canon and its commentaries in roman script, and to translate them.',
 example:'Within about forty years the Society had printed most of the canon. Its page numbers are still the standard way to cite a Pali text.',
 desc:'Six milestones in the Society’s work, from its founding to its dictionary and translations, with the people who did the work.',
 research:'Rhys Davids, T. W. (1882). Report of the Pali Text Society, Journal of the Pali Text Society 1. Norman, K. R. (1983). Pāli Literature. Harrassowitz. Wickremeratne, A. (1984). The Genesis of an Orientalist: Thomas William Rhys Davids. The Society’s own history pages.',
 hint:'Press a milestone. Notice how much of the editing and translating was done by a few people.',foot:'PTS volume and page numbers are still used for citing.',
 items:[
  {d:'1881',t:'The Society is founded',tag:'est',lines:['T. W. Rhys Davids, once a colonial','judge in Ceylon, founds the Society','in London.','Subscribers in Europe and Asia pay','for the printing; the King of Siam','and Sinhalese monks are among','the early donors.'],phase:'The Society was paid for by subscription, with support from Asian Buddhists as well as European scholars. Its editors worked from manuscripts lent or copied in Sri Lanka, Burma and Siam.'},
  {d:'1882',t:'First texts and Journal',tag:'est',lines:['The first editions and the Journal','of the Pali Text Society appear.','Each text is edited from a handful','of palm-leaf manuscripts and set','in roman type with diacritics.'],phase:'Early editions rested on few manuscripts, sometimes two or three. That was a real limit, and later scholars have corrected many readings.'},
  {d:'1900s',t:'Caroline Rhys Davids',tag:'est',lines:['Caroline Rhys Davids edits and','translates Abhidhamma books and','the verses of the elder nuns','(Therīgāthā, 1909).','She leads the Society 1923–1942.'],phase:'Caroline Rhys Davids was among the first Western scholars of the Abhidhamma and brought the nuns’ verses, some of the oldest women’s writing known, to English readers.'},
  {d:'1921–25',t:'The dictionary',tag:'est',lines:['The Pali–English Dictionary of','T. W. Rhys Davids and William','Stede appears in parts.','It is still the working dictionary','for most readers of Pali.'],phase:'A dictionary built from the edited texts turned a pile of editions into a usable field of study.'},
  {d:'1938–66',t:'I. B. Horner',tag:'est',lines:['Isaline Blew Horner translates the','whole Vinaya as The Book of the','Discipline, in six volumes, and','the Middle Length Sayings.','She leads the Society 1959–1981.'],phase:'I. B. Horner’s Vinaya translation made the whole monastic code readable in English for the first time. She also wrote an early study of women in the texts.'},
  {d:'today',t:'Still in print',tag:'est',lines:['The Society keeps its editions in','print and issues new ones.','Its volume and page numbers are','printed in the margins of other','editions and used in digital','canons as reference points.'],phase:'Even readers who use the Burmese or Thai text online still cite by Pali Text Society volume and page, the way classicists cite by an old standard edition.'}]});

const P8_PAIRS=[
 [['mala','stain, dirt'],['mālā','garland'],'a / ā: short and long vowels'],
 [['bala','strength'],['bāla','foolish; young'],'a / ā: short and long vowels'],
 [['vatta','duty, observance'],['vaṭṭa','round, cycle'],'tt / ṭṭ: tongue tip at the teeth or curled back']];
SCENE({id:'pali-text-society-scripts',name:'Why the dots and bars matter',tag:'Roman script for an Indian sound system',
 definition:'Pali has more distinct sounds than the roman alphabet has letters. Scholarly romanisation adds marks: a bar for long vowels, a dot under consonants made with the tongue curled back, and a few others.',
 example:'Without the marks, mala “stain” and mālā “garland” are spelled the same. The marks carry the difference.',
 desc:'Two Pali words that differ only by diacritics, shown with their meanings, with a switch that removes the marks so the two spellings collapse into one.',
 research:'Geiger, W. (1916/1994). A Pāli Grammar. Pali Text Society. ISO 15919 (2001) and the IAST convention for romanising Indic scripts. Pali has no script of its own: it has been written in Sinhala, Burmese, Khmer, Thai, Devanāgarī and roman letters.',
 dur:10,hint:'Choose a pair of words, then switch the marks off and on.',
 init:()=>({k:0,d:1}),
 watch(p){return {k:Math.min(2,Math.floor(p*3)),d:(p*3%1)<.5?1:0}},
 ui:[{choose:[['0','mala / mālā'],['1','bala / bāla'],['2','vatta / vaṭṭa']],label:'Words',get:s=>String(s.k),act:'k'},{choose:[['1','With marks'],['0','Marks removed']],label:'Spelling',get:s=>String(s.d),act:'d'}],
 on:{k(s,v){s.k=+v;return 'keep'},d(s,v){s.d=+v;return 'keep'}},
 draw(s){
  const pr=P8_PAIRS[s.k],strip=w=>w.normalize('NFD').replace(/[̀-ͯ]/g,'');
  let out=heading(s.d?'Two words, two spellings':'Two words, one spelling')+P8_tag('est');
  [0,1].forEach(i=>{const x=40+i*280,w=pr[i][0],shown=s.d?w:strip(w);
   out+=R(x,90,240,150,'#fff',s.d?C.blue:C.coral,10)+TB(x+120,160,shown,34,C.ink)+TF(x+120,206,pr[i][1],14,C.muted)});
  out+=TF(300,268,pr[2],13,C.ink);
  out+=TF(300,292,'Pali has been written in many scripts; roman is one more.',13,C.muted);
  out+=T(300,356,s.d?'With the marks, each spelling has one reading':'Without them, the reader must guess from context',15,s.d?C.green:C.coral);
  return {svg:out,phase:s.d?'Diacritics let roman letters record every Pali sound exactly, so a romanised edition can be converted to and from Sinhala, Burmese or Thai script without loss.':'Plain ASCII spellings were common in early digital texts and still appear online. They merge different words, which is one reason search results in a digital canon need care.'};
 }});

SCENE({id:'pali-text-society-editing',name:'Counting manuscripts or weighing them?',tag:'How an editor chooses a reading',
 definition:'A critical edition prints one reading where manuscripts differ and reports the others in notes. Manuscripts copied from one another are not independent witnesses, so editors group them into families before weighing them.',
 example:'Three Burmese manuscripts copied from the same parent agree on a reading; two Sinhalese ones differ. Counting copies favours the Burmese reading three to two; counting families gives one each.',
 desc:'Manuscripts drawn as leaves, grouped into families by country, each showing reading x or y, with a tally that can count either manuscripts or families.',
 research:'Norman, K. R. (1983). Pāli Literature. Harrassowitz; Hinüber, O. von (1996). A Handbook of Pāli Literature. De Gruyter (on the manuscript base of the editions). West, M. L. (1973). Textual Criticism and Editorial Technique. Teubner. The manuscripts and readings here are an illustrative example.',
 dur:10,hint:'Switch between counting manuscripts and counting families, and add a Siamese manuscript.',
 init:()=>({mode:'ms',si:0}),
 watch(p){return {mode:p<.25||p>=.75?'ms':'fam',si:p<.5?0:1}},
 ui:[{choose:[['ms','Count manuscripts'],['fam','Count families']],label:'Method',get:s=>s.mode,act:'mode'},{b:'Add or remove a Siamese manuscript',act:'si'}],
 on:{mode(s,v){s.mode=v;return 'keep'},si(s){s.si=s.si?0:1;return 'keep'}},
 draw(s){
  const fams=[['Burmese',3,'x'],['Sinhalese',2,'y']].concat(s.si?[['Siamese',1,'y']]:[]);
  let out=heading('Which reading should be printed?')+P8_tag('ill');
  fams.forEach((f,i)=>{const y=90+i*62;out+=TBF(24,y+26,f[0],14,C.ink,'start');
   for(let k=0;k<f[1];k++){const x=130+k*96;out+=R(x,y+4,84,34,'#f3e7bf','#a8935a',4)+Ci(x+18,y+21,2,'#6d5a45')+TBF(x+50,y+26,f[2],15,f[2]==='x'?C.blue:C.coral)}
   if(s.mode==='fam')out+=R(122,y-2,f[1]*96+4,46,'none',C.muted,8,'stroke-dasharray="5 4"')});
  const cx=s.mode==='ms'?fams.filter(f=>f[2]==='x').reduce((a,f)=>a+f[1],0):fams.filter(f=>f[2]==='x').length,cy=s.mode==='ms'?fams.filter(f=>f[2]==='y').reduce((a,f)=>a+f[1],0):fams.filter(f=>f[2]==='y').length;
  out+=R(440,90,144,170,'#f6f9fb','none',10)+TBF(512,114,s.mode==='ms'?'by manuscript':'by family',14,C.ink)+TB(480,170,String(cx),30,C.blue)+TB(544,170,String(cy),30,C.coral)+TF(480,196,'x',14,C.blue)+TF(544,196,'y',14,C.coral)+TBF(512,236,cx>cy?'x leads':cy>cx?'y leads':'a tie',14,C.ink);
  out+=TF(24,296,'copies made from one parent share its mistakes',13,C.muted,'start');
  out+=T(300,356,cx===cy?'A tie: the editor must judge the readings themselves':`Printed reading: ${cx>cy?'x':'y'}; the other goes in the notes`,15,C.muted);
  return {svg:out,phase:s.mode==='ms'?'Counting copies rewards whichever tradition happens to have more surviving manuscripts. Three copies of one lost parent are really one witness.':'Grouping manuscripts by descent gives each tradition one voice. When the families split evenly the editor has to ask which reading better explains how the other arose.'};
 }});

/* =========================== taisho =========================== */
const P8_TG=[
 ['1–32','Translated scriptures and treatises',32,'#5f8fb5',['Āgamas, Mahāyāna sūtras, esoteric','texts, the Vinayas, Abhidharma and','the Indian treatises, all in Chinese','translation.','Texts are numbered T 1 to T 1692.']],
 ['33–55','Chinese commentaries and histories',23,'#7a9c6a',['Works written in Chinese:','commentaries, the writings of the','Chinese schools, histories,','biographies and the old catalogues.']],
 ['56–84','Japanese works',29,'#c98f5a',['Commentaries and treatises by','Japanese authors, one of the','features that sets this edition','apart from earlier canons.']],
 ['85','Dunhuang finds and doubtful texts',1,'#a685b8',['Texts recovered from Dunhuang','and scriptures the old cataloguers','judged doubtful or composed in','China.']],
 ['86–97','Pictures',12,'#d6b25a',['The iconographic section: drawings','of images, ritual diagrams and','mandalas.']],
 ['98–100','Catalogues',3,'#8a98a1',['Catalogues of canons and temple','collections.']]];
SCENE({id:'taisho',name:'The Taishō edition',tag:'One hundred volumes, 1924–1934',
 definition:'The Taishō Shinshū Daizōkyō, edited in Tokyo by Takakusu Junjirō and Watanabe Kaigyoku and printed in 1924–1934, is the edition of the Chinese canon that scholars cite. It has 100 volumes; the first 85 hold 2,920 numbered texts.',
 example:'Its main text follows the Tripitaka Koreana, with footnotes giving the readings of Song, Yuan and Ming editions and of old Japanese manuscripts.',
 desc:'A hundred small squares, one per volume, coloured by section, with the contents of the section chosen.',
 research:'Takakusu, J. & Watanabe, K. (eds) (1924–1934). Taishō Shinshū Daizōkyō. Tokyo. Wu, J. & Chia, L. (eds) (2016). Spreading Buddha’s Word in East Asia, ch. on modern editions. Wilkinson, G. (2016) on the making of the Taishō canon.',
 dur:12,hint:'Choose a section to see which volumes it fills.',
 init:()=>({g:0}),
 watch(p){return {g:Math.min(5,Math.floor(p*6))}},
 ui:[{choose:P8_TG.map((g,i)=>[String(i),'Vols '+g[0]]),label:'Section',get:s=>String(s.g),act:'g'}],
 on:{g(s,v){s.g=clamp(+v,0,5);return 'keep'}},
 draw(s){
  let out=heading('What fills the hundred volumes?')+P8_tag('est'),v=0;
  P8_TG.forEach((g,gi)=>{for(let k=0;k<g[2];k++,v++){const c=v%10,r=Math.floor(v/10);out+=R(24+c*24,80+r*24,20,20,gi===s.g?g[3]:'#e6ecef','none',4)}});
  out+=TF(24,336,'one square per volume',13,C.muted,'start');
  const g=P8_TG[s.g];
  out+=R(282,80,302,244,'#f6f9fb','none',10)+R(296,94,14,14,g[3],'none',3)+TBF(318,106,'Volumes '+g[0],15,C.ink,'start')+P8_lines(296,132,P8_wrap(g[1],38),13,C.muted,'start',18)+P8_lines(296,172,g[4],13,C.ink,'start',20);
  out+=T(300,362,`${g[2]} of 100 volumes`,15,C.muted);
  return {svg:out,phase:'The editors arranged the translated scriptures by a historical scheme, starting with the Āgamas, the Chinese parallels to the Pali Nikāyas, where older canons began with the Perfection of Wisdom. That ordering was itself a statement about history.'};
 }});

const P8_CITE=[['Diamond Sūtra (Kumārajīva)','235','8','748','c'],['Heart Sūtra (Xuanzang)','251','8','848','c'],['Lotus Sūtra (Kumārajīva)','262','9','1','c']];
const P8_PART={num:['Text number','Every text has a number. T 235 is one particular translation, not just “the Diamond Sūtra”.'],vol:['Volume','The volume of the hundred in which the text is printed.'],page:['Page','The page in that volume where the passage begins.'],reg:['Register','Each page is printed in three horizontal bands: a at the top, b in the middle, c at the bottom.']};
SCENE({id:'taisho-reference',name:'Reading a Taishō reference',tag:'T 235, 8: 748c',
 definition:'A Taishō reference gives the text number, then the volume, the page and one of three registers on the page, a, b or c. It lets anyone find the same line in any library or digital canon.',
 example:'“T 235, 8: 748c” means text 235 (Kumārajīva’s Diamond Sūtra), volume 8, page 748, bottom register.',
 desc:'A reference split into its four parts, each of which can be highlighted, beside a page divided into three registers.',
 research:'Taishō Shinshū Daizōkyō (1924–1934); SAT Daizōkyō Text Database (University of Tokyo); CBETA. The three references shown are the opening pages of those texts in the Taishō.',
 dur:10,hint:'Choose a text, then press each part of its reference.',
 init:()=>({t:0,part:'num'}),
 watch(p){return {t:Math.min(2,Math.floor(p*3)),part:['num','vol','page','reg'][Math.floor(p*12)%4]}},
 ui:[{choose:P8_CITE.map((c,i)=>[String(i),c[0].split(' (')[0]]),label:'Text',get:s=>String(s.t),act:'t'}],
 on:{t(s,v){s.t=clamp(+v,0,2);return 'keep'},part(s,v){if(P8_PART[v])s.part=v;return 'keep'}},
 draw(s,f,X){
  const c=P8_CITE[s.t];let out=heading(c[0])+P8_tag('est');
  const parts=[['num','T '+c[1]],['vol',c[2]],['page',c[3]],['reg',c[4]]];let x=40;
  parts.forEach(([k,txt],i)=>{const w=txt.length*20+28,on=s.part===k;out+=hit(X,'part',k,P8_PART[k][0]+': '+txt,R(x,92,w,56,on?C.pale:'#fff',on?C.blue:C.grid,8)+TB(x+w/2,130,txt,26,on?C.blue:C.ink))+TF(x+w/2,168,P8_PART[k][0].toLowerCase(),13,on?C.blue:C.muted);x+=w+(i===1?22:i===0?22:6)});
  out+=TBF(40,212,P8_PART[s.part][0],15,C.ink,'start')+P8_lines(40,236,P8_wrap(P8_PART[s.part][1],44),13,C.ink,'start',19);
  // page
  out+=R(430,86,130,220,'#fff','#a8935a',4);
  ['a','b','c'].forEach((r,i)=>{const y=92+i*71,on=s.part==='reg'&&r===c[4];out+=R(436,y,118,66,on?C.coralp:'#fbf6ea',on?C.coral:'#e0d6bb',2)+TBF(548,y+16,r,13,on?C.coral:C.muted,'end');for(let k=0;k<8;k++)out+=L(446+k*12,y+8,446+k*12,y+58,'#b9c5cc',1.4,'stroke-dasharray="4 3"')});
  out+=TF(495,326,`vol. ${c[2]}, p. ${c[3]}`,13,s.part==='vol'||s.part==='page'?C.blue:C.muted);
  out+=T(300,362,`T ${c[1]}, ${c[2]}: ${c[3]}${c[4]}`,15,C.muted);
  return {svg:out,phase:'Because several translations of the same scripture sit side by side in the canon, the text number matters as much as the title. Digital canons keep the Taishō page and register markers so that printed and online references match.'};
 }});

const P8_PUNCT={none:['monks who study often teach','No marks: the reader decides where the pause falls.'],a:['monks who study, often teach','Those monks who study are often teachers.'],b:['monks who study often, teach','Those who study frequently are the ones who teach.']};
SCENE({id:'taisho-punctuation',name:'Where does the sentence break?',tag:'Punctuation is an editor’s reading',
 definition:'Classical Chinese was written without punctuation or spaces between words. The dots in the Taishō were added by its editors, quickly, and scholars often disagree with them.',
 example:'An English sentence can show the problem: “monks who study often teach” means different things depending on where the pause goes.',
 desc:'One English sentence shown with no punctuation and with a comma in two different places, with the meaning each gives.',
 research:'On the Taishō’s punctuation and its revision in digital editions see CBETA’s editorial notes and Wu & Chia (2016), Spreading Buddha’s Word in East Asia. The English sentence is a stand-in, not a translation of any scripture.',
 dur:10,hint:'Move the comma and read the sentence again.',
 init:()=>({p:'none'}),
 watch(p){return {p:['none','a','b'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['none','No marks'],['a','Comma after “study”'],['b','Comma after “often”']],label:'Punctuation',get:s=>s.p,act:'p'}],
 on:{p(s,v){if(P8_PUNCT[v])s.p=v;return 'keep'}},
 draw(s){
  const q=P8_PUNCT[s.p];let out=heading('The same words, read two ways')+P8_tag('ill');
  out+=R(40,96,520,84,'#fbf6ea','#d8c9a3',8)+T(300,146,q[0],22,C.ink);
  out+=TF(300,214,'an English stand-in for an unpunctuated line',13,C.muted);
  out+=R(40,236,520,60,'#f6f9fb','none',10)+TBF(56,260,'Reads as',13,C.muted,'start')+TF(56,282,q[1],13,C.ink,'start');
  out+=T(300,356,s.p==='none'?'The manuscript leaves the choice open':'A printed mark makes the choice for the reader',15,C.muted);
  return {svg:out,phase:'Punctuating a classical Chinese text is already interpreting it. The Taishō’s marks are treated as suggestions; CBETA and other digital editions offer revised modern punctuation, and careful readers still check the break for themselves.'};
 }});

/* =========================== digital-canons =========================== */
P8_cards({id:'digital-canons',name:'Canons online',tag:'From shelves of volumes to a search box',heading:'Six digital canon projects',dw:48,
 definition:'Since the 1990s the main canons have been typed, checked and published as free digital texts, often with the page numbers of the printed editions kept so that references still work.',
 example:'CBETA publishes the Chinese canon with the Taishō’s volume, page and register markers; SuttaCentral lines up early texts with their parallels in other languages.',
 desc:'Six digital projects, each with its starting date, what it covers and what it added.',
 research:'Project sites: CBETA (cbeta.org), SAT (21dzk.l.u-tokyo.ac.jp), SuttaCentral (suttacentral.net), Vipassana Research Institute (tipitaka.org), 84000 (84000.co), Buddhist Digital Resource Center (bdrc.io). Nagasaki, K. et al. on SAT; Tu, A. on CBETA. Dates are those the projects give.',
 hint:'Press a project to see what it covers.',foot:'All six are free to read.',
 items:[
  {d:'1990s',t:'Chaṭṭha Saṅgāyana (VRI)',tag:'est',title:'Vipassana Research Institute',lines:['The Sixth Council’s Pali canon with','its commentaries, typed in India','and released on CD-ROM, then at','tipitaka.org.','Displays the same text in many','scripts.'],phase:'The first widely used digital Pali canon was the Sixth Council edition. One typed text can be shown in Burmese, Sinhala, Thai, Devanāgarī or roman script at the press of a button.'},
  {d:'1994',t:'SAT (Tokyo)',tag:'est',title:'SAT Daizōkyō Database',lines:['The Taishō’s 85 text volumes,','typed and proofread at the','University of Tokyo.','Linked to page images, to','dictionaries and to scans of','older editions.'],phase:'SAT ties each line of the Taishō to an image of the printed page, so a reader can check the typed text against the source.'},
  {d:'1998',t:'CBETA (Taipei)',tag:'est',title:'CBETA',lines:['The Chinese Buddhist Electronic','Text Association: the Taishō, the','supplementary canon and more.','Corrected readings and modern','punctuation are marked, with the','original still visible.'],phase:'CBETA records every correction it makes to the printed text, which turns a digital copy into a new, open edition.'},
  {d:'1999',t:'BDRC',tag:'est',title:'Buddhist Digital Resource Center',lines:['Founded by E. Gene Smith as the','Tibetan Buddhist Resource Center.','Millions of scanned pages of','Tibetan and other texts, many','gathered from refugee','communities.'],phase:'Gene Smith spent decades in India helping Tibetan refugees reprint their books. The scans of those volumes became the core of a digital library.'},
  {d:'2005',t:'SuttaCentral',tag:'est',title:'SuttaCentral',lines:['Early texts in Pali, Chinese,','Tibetan and Sanskrit, with tables','of which texts are parallels of','which.','Translations into many modern','languages, freely licensed.'],phase:'SuttaCentral was built around parallels: open a Pali discourse and it lists the Chinese, Tibetan and Sanskrit versions of the same text.'},
  {d:'2010',t:'84000',tag:'est',title:'84000: Translating the Words of the Buddha',lines:['A project to translate the whole','Tibetan Kangyur and Tengyur into','English, with a stated goal of','100 years.','Published online with glossaries','linked across texts.'],phase:'Most of the Tibetan canon has never been translated into a modern language. 84000 publishes each finished text online as it goes.'}]});

const P8_SIZE={pali:['Pali canon','about 2.7 million words',2.7e6/150/60,'at 150 words a minute'],chinese:['Chinese canon, Taishō vols 1–55','about 70 million characters',7e7/250/60,'at 250 characters a minute'],kangyur:['Tibetan Kangyur','about 70,000 pages',70000*2/60,'at 2 minutes a page']};
SCENE({id:'digital-canons-search',name:'Reading time against search time',tag:'What full-text search changed',
 definition:'A canon is too large for anyone to hold in view at once. Full-text search finds every place a word or phrase occurs in seconds, a job that once took a lifetime of reading and index cards.',
 example:'Reading the Pali canon aloud for eight hours a day would take about five weeks; the Chinese canon would take well over a year. A search of either takes less than a second.',
 desc:'A bar showing how many days it takes to read a chosen canon at a chosen number of hours a day, beside the time a search takes.',
 research:'Sizes are rounded estimates that differ between sources: the Pali canon is usually put at 2.5–2.8 million words, the Taishō’s first 55 volumes at 70 million characters or more, and the Derge Kangyur at about 70,000 pages (84000). Reading speeds are illustrative.',
 dur:10,hint:'Choose a canon and how many hours a day you would read.',
 init:()=>({c:'pali',h:8}),
 watch(p){return {c:['pali','chinese','kangyur'][Math.min(2,Math.floor(p*3))],h:8}},
 ui:[{choose:[['pali','Pali'],['chinese','Chinese'],['kangyur','Kangyur']],label:'Canon',get:s=>s.c,act:'c'},{range:'h',label:'Hours of reading a day',min:1,max:12,get:s=>s.h,act:'h',show:v=>v+' h'}],
 on:{c(s,v){if(P8_SIZE[v])s.c=v;return 'keep'},h(s,v){s.h=clamp(+v,1,12);return 'keep'}},
 draw(s){
  const z=P8_SIZE[s.c],days=z[2]/s.h,max=5000;let out=heading(z[0])+P8_tag('ill');
  out+=TF(40,96,z[1]+' (approximate)',13,C.muted,'start');
  out+=TBF(40,130,'Read it through',14,C.ink,'start')+R(40,140,520,30,'#fff',C.grid,6)+R(40,140,Math.max(4,520*Math.min(1,Math.log10(1+days)/Math.log10(1+max))),30,'#c98f5a','none',6)+TBF(52,161,days>=365?`${fmt(Math.round(days/36.5)/10)} years`:`${P8_num(days)} days`,14,C.ink,'start');
  out+=TF(560,188,z[3]+' · log scale',13,C.muted,'end');
  out+=TBF(40,224,'Search it',14,C.ink,'start')+R(40,234,520,30,'#fff',C.grid,6)+R(40,234,4,30,C.blue,'none',2)+TBF(52,255,'under a second',14,C.ink,'start');
  out+=P8_lines(40,296,['Search finds strings, not meanings: spelling variants,','synonyms and paraphrases still need a reader.'],13,C.muted,'start',19);
  out+=T(300,360,`${P8_num(z[2])} hours of reading in all`,15,C.muted);
  return {svg:out,phase:'Search has changed the questions scholars can ask: where a phrase first appears, which translator favoured which term, which passages are shared between texts. It has not replaced reading, because the same idea is often put in different words.'};
 }});

const P8_ENC=[['Big5 (1984)',13053,'The usual Chinese encoding of the 1990s. Thousands of rare characters in the canon were simply missing.'],['Unicode 2.0 (1996)',20902,'One shared set for Chinese, Japanese and Korean. Better, but still short of what old texts use.'],['Unicode today',97000,'Over 97,000 Han characters after many extensions, some added at the request of canon projects.']];
SCENE({id:'digital-canons-encoding',name:'Characters the computer did not have',tag:'Typing a canon needs rare characters',
 definition:'A canon written over 1,500 years uses rare and variant characters that early computer character sets left out. Digitisers had to describe the missing ones by their parts until standards caught up.',
 example:'CBETA wrote a missing character as a formula naming its components, such as “left part times right part”, and replaced the formulas as Unicode added the characters.',
 desc:'Three character sets as bars of increasing length, showing how many Chinese characters each can encode.',
 research:'Big5 (1984): 13,053 Chinese characters. Unicode 2.0 (1996): 20,902 unified Han characters. Unicode 15.1 (2023): over 97,000. CBETA’s documentation on its treatment of characters outside the standard (“gaiji”). Lunde, K. (2009). CJKV Information Processing. O’Reilly.',
 dur:10,hint:'Step through the three standards and watch the gap close.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(2,Math.floor(p*3))}},
 ui:[{choose:P8_ENC.map((e,i)=>[String(i),e[0]]),label:'Standard',get:s=>String(s.k),act:'k'}],
 on:{k(s,v){s.k=clamp(+v,0,2);return 'keep'}},
 draw(s){
  let out=heading('How many characters can be typed?')+P8_tag('est');
  P8_ENC.forEach((e,i)=>{const y=98+i*58,on=i===s.k;out+=TBF(40,y,e[0],13,on?C.ink:C.muted,'start')+R(40,y+8,520,24,'#fff',C.grid,6)+R(40,y+8,520*e[1]/125000,24,on?C.blue:'#b9d4e6','none',6)+TBF(48+520*e[1]/125000,y+25,(i===2?'over ':'')+P8_num(e[1]),13,on?C.ink:C.muted,'start')});
  out+=P8_lines(40,290,P8_wrap(P8_ENC[s.k][2],74),13,C.ink,'start',19);
  out+=T(300,356,s.k<2?'Missing characters were written as formulas of their parts':'Most formulas have now been replaced by real characters',15,C.muted);
  return {svg:out,phase:'The same problem met every script in the canon, from Tibetan stacks to the marks of romanised Pali. Much of the patient work of the digital canon projects went into characters, not words.'};
 }});

/* =========================== parallels-and-finds =========================== */
// Body contemplations in three versions of the discourse on the establishments of mindfulness (after Anālayo 2013).
const P8_PAR=[['Mindfulness of breathing',1,1,0],['The four postures',1,1,0],['Clear awareness of activities',1,1,0],['The parts of the body',1,1,1],['The elements',1,1,1],['A corpse in decay',1,1,1],['The body’s openings',0,0,1],['Further practices (about nine)',0,1,0]];
const P8_VER=[['MN 10','Pali','Theravāda'],['MĀ 98','Chinese','Sarvāstivāda'],['EĀ 12.1','Chinese','uncertain']];
SCENE({id:'parallels-and-finds',name:'One discourse, three versions',tag:'Comparing parallels',
 definition:'Many early discourses survive in more than one version: in Pali and in Chinese translations of collections kept by other schools. Laying the versions side by side shows what they share and where each went its own way.',
 example:'The discourse on the establishments of mindfulness lists different body contemplations in its three versions. Only three are in all of them: the parts of the body, the elements and a corpse in decay.',
 desc:'A table with eight contemplations in rows and three versions of the discourse in columns, with a mark where a version includes the contemplation and the shared rows highlighted.',
 research:'Anālayo (2013). Perspectives on Satipaṭṭhāna. Windhorse. Anālayo (2011). A Comparative Study of the Majjhima-nikāya. Dharma Drum. Kuan, T.-F. (2008). Mindfulness in Early Buddhism. Routledge. What the shared core implies about the earliest form of the text is an inference that scholars weigh differently.',
 dur:10,hint:'Switch between all rows and the rows every version shares. Press a version to see where it comes from.',
 init:()=>({only:0,v:0}),
 watch(p){return {only:p<.5?0:1,v:Math.min(2,Math.floor(p*6)%3)}},
 ui:[{choose:[['0','All eight'],['1','Shared by all three']],label:'Rows',get:s=>String(s.only),act:'only'}],
 on:{only(s,v){s.only=+v;return 'keep'},v(s,x){s.v=clamp(+x,0,2);return 'keep'}},
 draw(s,f,X){
  let out=heading('Contemplations of the body')+P8_tag('est');
  P8_VER.forEach((v,i)=>{const x=330+i*88,on=s.v===i;out+=hit(X,'v',i,`${v[0]}: ${v[1]}, ${v[2]}`,R(x-38,70,76,26,on?C.pale:'#fff',on?C.blue:C.grid,7)+TBF(x,88,v[0],13,on?C.blue:C.ink))});
  P8_PAR.forEach((r,i)=>{const y=106+i*25,all=r[1]&&r[2]&&r[3],dim=s.only&&!all;
   out+=(all?R(16,y-2,568,23,C.greenp,'none',5):'')+TF(26,y+14,r[0],13,dim?'#b3c0c8':C.ink,'start');
   [1,2,3].forEach(k=>{const x=330+(k-1)*88;out+=r[k]?Ci(x,y+9,6,dim?'#cfd9de':all?C.green:C.blue):L(x-5,y+9,x+5,y+9,'#cfd9de',2)})});
  const v=P8_VER[s.v];
  out+=TF(26,326,`${v[0]}: in ${v[1]}; school: ${v[2]}`,13,C.muted,'start');
  out+=T(300,360,'Three of the eight are in every version',15,C.muted);
  return {svg:out,phase:'The versions were handed down by different schools for centuries before being written or translated. Where they agree, the material is likely to be older than the split between the schools; where they differ, each tradition has added or arranged. That reasoning is widely used, and its limits are debated.'};
 }});

P8_cards({id:'parallels-and-finds-positions',name:'How early are the early texts?',tag:'A live scholarly debate',heading:'Four positions scholars hold',dw:0,
 definition:'Scholars agree that the early discourses were passed on by word of mouth for centuries before the oldest surviving manuscripts. They disagree about how much of the wording goes back to the Buddha’s own time.',
 example:'Sujato and Brahmali argue that most of the early texts are authentic; Schopen argues that inscriptions and archaeology are firmer evidence than texts whose manuscripts are much later.',
 desc:'Four scholarly positions, each with its main argument and the evidence it leans on.',
 research:'Sujato & Brahmali (2014). The Authenticity of the Early Buddhist Texts. Schopen, G. (1997). Bones, Stones, and Buddhist Monks. University of Hawai‘i Press. Gombrich, R. (2009). What the Buddha Thought. Equinox. Anālayo (2012). The historical value of the Pāli discourses. Indo-Iranian Journal 55. Wynne, A. (2005). The historical authenticity of early Buddhist literature. WZKS 49.',
 hint:'Press each position. They are summaries of published arguments, not this page’s verdict.',foot:'These are attributed positions, not settled findings.',
 items:[
  {d:'',t:'Largely authentic',tag:'deb',title:'Sujato and Brahmali (2014)',lines:['The early texts agree across','schools and languages, know','nothing of later history such as','Ashoka, and describe a consistent','society and geography.','So most of their content goes','back to the Buddha’s lifetime.'],phase:'Bhikkhu Sujato and Bhikkhu Brahmali gather many independent lines of evidence and conclude that the early texts are largely authentic. Critics reply that agreement between versions shows only what existed before the schools split.'},
  {d:'',t:'One coherent mind',tag:'deb',title:'Gombrich (2009)',lines:['The ideas in the early discourses','are original and fit together too','well to be the work of a','committee.','The simplest explanation is one','thinker, whose words were','remembered with care.'],phase:'Richard Gombrich argues from the coherence and originality of the ideas. This supports the origin of the thought more than the exact wording of any passage.'},
  {d:'',t:'An early common core',tag:'deb',title:'Anālayo (2011, 2012)',lines:['Compare every version of a','discourse line by line.','What is shared is early; what','differs shows later growth.','Oral formulas explain much of','the variation.'],phase:'Anālayo’s comparative studies treat no single canon as the original. The method recovers a shared early layer and also shows that all versions, the Pali included, changed in transmission.'},
  {d:'',t:'Texts are late witnesses',tag:'deb',title:'Schopen (1997)',lines:['The texts as we have them come','from manuscripts and redactions','centuries after the Buddha.','Inscriptions and archaeology','are dated and local, and often','show practices the texts play','down.'],phase:'Gregory Schopen urges caution about treating canonical texts as descriptions of early practice, and puts dated material evidence first. Others answer that the inscriptions begin only with Ashoka, long after the period in question.'}]});

P8_cards({id:'parallels-and-finds-manuscripts',name:'Manuscripts found since 1900',tag:'New evidence keeps arriving',heading:'Finds that changed the picture',dw:58,
 definition:'Over the last century, manuscripts recovered from Central Asia, Gilgit, Afghanistan and Pakistan have given scholars texts far older than any palm-leaf copy, in languages and scripts once known only by name.',
 example:'Birch-bark scrolls in the Gāndhārī language, bought by the British Library in 1994, were dated to about the first century CE: the oldest Buddhist manuscripts known.',
 desc:'Six manuscript finds in date order, each with where it was found, what it contained and how old it is.',
 research:'Salomon, R. (1999). Ancient Buddhist Scrolls from Gandhāra. British Library / University of Washington Press. Salomon, R. (2018). The Buddhist Literature of Ancient Gandhāra. Wisdom. Falk, H. (2011). The “Split” collection of Kharoṣṭhī texts. ARIRIAB 14. Strauch, I. (2008) on the Bajaur collection. Braarvig, J. (ed.) (2000–). Buddhist Manuscripts in the Schøyen Collection. Allon, M. et al. (2006) on radiocarbon dates.',
 hint:'Press a find to see what it held and how it was dated.',foot:'Many of these reached scholars through the antiquities market.',
 items:[
  {d:'1902–14',t:'Turfan expeditions',tag:'est',lines:['German expeditions to oases on the','northern Silk Road bring back','thousands of fragments.','Sanskrit texts of the Sarvāstivāda','school, including parts of its','discourse collections.'],phase:'The Turfan fragments showed that a Sanskrit canon parallel to the Pali one had existed, and gave the originals behind some Chinese translations.'},
  {d:'1931',t:'Gilgit',tag:'est',lines:['Birch-bark and paper books found','in a ruined building near Gilgit,','now in Pakistan.','Sixth to eighth century. Includes','most of the Vinaya of the','Mūlasarvāstivāda school in','Sanskrit.'],phase:'The Gilgit manuscripts are among the oldest surviving manuscript collections from the Indian subcontinent and preserve a Vinaya otherwise known mainly in Tibetan.'},
  {d:'1994',t:'British Library scrolls',tag:'est',lines:['29 birch-bark fragments in the','Gāndhārī language and Kharoṣṭhī','script, found in clay pots.','Dated to about the 1st century CE.','Linked by an inscription to the','Dharmaguptaka school.'],phase:'Richard Salomon and colleagues identified these as the oldest Buddhist manuscripts known. They include discourses, verses and commentaries, some with parallels in Pali and Chinese.'},
  {d:'1990s',t:'Schøyen collection',tag:'est',lines:['Thousands of fragments said to be','from caves near Bamiyan,','Afghanistan.','Second to eighth century, on palm','leaf, birch bark and skin.','Early Mahāyāna sūtras among','them.'],phase:'The Bamiyan fragments include some of the earliest manuscript evidence for Mahāyāna sūtras alongside texts of the older schools, in the same monastery library.'},
  {d:'1999',t:'Bajaur collection',tag:'est',lines:['Birch-bark scrolls from Bajaur,','Pakistan, in Gāndhārī.','First to second century CE.','Contains a Mahāyāna sūtra and','part of a monastic code.'],phase:'Studied by Ingo Strauch and colleagues, the Bajaur scrolls show Mahāyāna texts circulating in Gandhāra in the same period and language as texts of the early schools.'},
  {d:'2000s',t:'“Split” collection',tag:'est',lines:['Gāndhārī scrolls published by','Harry Falk, including part of a','Perfection of Wisdom text.','Radiocarbon dated to about','47–147 CE: close in time to its','first Chinese translation.'],phase:'A first-century Gāndhārī Perfection of Wisdom manuscript confirmed that this literature existed in writing by then, and that its early Chinese translation was made from a text of this kind.'}]});
