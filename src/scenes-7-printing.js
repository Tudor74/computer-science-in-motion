/* ===================== Tripitaka era 7 · Printing (868–1900) ===================== */
// The Diamond Sūtra of 868, the Song-dynasty canons, the Tripitaka Koreana and the royal editions of Burma and
// Siam. Every picture is a pure function of state. Counts and dates are given as the sources give them and are
// labelled approximate where sources differ. Script is drawn as an impression (plain strokes), never as fake text.
const P7_wrap=(str,n)=>{const out=[];let line='';for(const w of String(str).split(' ')){if(line&&(line+' '+w).length>n){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out};
const P7_lines=(x,y,lines,size=13,fill=C.ink,anchor='start',lh=18)=>lines.map((l,i)=>TF(x,y+i*lh,l,size,fill,anchor)).join('');
const P7_TAGS={est:['established',C.green,C.greenp],trad:['traditional account',C.purple,C.purplep],deb:['debated',C.amber,C.amberp],ill:['illustrative model',C.muted,'#e8eef2']};
// Evidence tag, centred under the heading.
const P7_tag=k=>{const [t,ink,bg]=P7_TAGS[k],w=t.length*7.4+24;return R(300-w/2,42,w,22,bg,'none',11)+TBF(300,57,t,13,ink)};
const P7_num=n=>Math.round(n).toLocaleString('en-GB');
// Rows of plain strokes standing in for a column of script.
const P7_script=(x,y,w,h,cols,col='#8aa1ae')=>{let o='';for(let i=0;i<cols;i++){const cx=x+w-(i+.5)*w/cols;o+=L(cx,y+4,cx,y+h-4,col,1.6,'stroke-dasharray="5 3"')}return o};
// An eight-spoked wheel, used where the original has an illustration of the Buddha teaching.
const P7_wheel=(x,y,r,col=C.amber)=>{let o=Ci(x,y,r,'none',col)+Ci(x,y,r*.22,col);for(let k=0;k<8;k++){const a=k*Math.PI/4;o+=L(x+Math.cos(a)*r*.22,y+Math.sin(a)*r*.22,x+Math.cos(a)*r,y+Math.sin(a)*r,col,1.6)}return o};

// A list of pressable items on the left and the chosen item's facts on the right.
function P7_cards(o){
 const n=o.items.length;
 SCENE({id:o.id,name:o.name,tag:o.tag,definition:o.definition,example:o.example,desc:o.desc,research:o.research,dur:o.dur||12,hint:o.hint,
  init:()=>({i:0}),
  watch(p){return {i:Math.min(n-1,Math.floor(p*n))}},
  ui:[{b:'Previous',act:'prev'},{b:'Next',act:'next'}],
  on:{pick(s,v){s.i=clamp(+v,0,n-1);return 'keep'},next(s){s.i=(s.i+1)%n;return 'keep'},prev(s){s.i=(s.i+n-1)%n;return 'keep'}},
  draw(s,f,X){
   const it=o.items[s.i],rh=Math.min(40,264/n);let out=heading(o.heading)+P7_tag(it.tag);
   o.items.forEach((q,i)=>{const y=76+i*rh,on=i===s.i;
    out+=hit(X,'pick',i,q.t,R(16,y,236,rh-5,on?C.pale:'#fff',on?C.blue:C.grid,7)+TBF(26,y+rh/2+2,q.d,13,on?C.blue:C.muted,'start')+TF(26+o.dw,y+rh/2+2,q.t,13,C.ink,'start'))});
   out+=R(262,76,322,262,'#f6f9fb','none',10)+TBF(276,100,it.title||it.t,15,C.ink,'start')+P7_lines(276,126,it.lines,13,C.ink,'start',19);
   if(o.foot)out+=T(300,366,o.foot,15,C.muted);
   return {svg:out,phase:it.phase};
  }});
}

/* =========================== diamond-sutra-868 =========================== */
const P7_SHEETS=['Frontispiece','Text 1','Text 2','Text 3','Text 4','Text 5','Text 6 and colophon'];
SCENE({id:'diamond-sutra-868',name:'The Diamond Sūtra of 868',tag:'The oldest dated printed book',
 definition:'A paper scroll of the Diamond Sūtra, printed from carved woodblocks and dated in its own colophon to 11 May 868, is the oldest complete printed book that carries a date.',
 example:'The colophon says it was made “for universal free distribution by Wang Jie on behalf of his two parents” on the 15th day of the 4th month of the 9th year of the Xiantong era.',
 desc:'A scroll of seven sheets pasted end to end, unrolled one sheet at a time: an illustrated frontispiece, six sheets of text and the dated colophon at the end.',
 research:'British Library, Or.8210/P.2 (found in Cave 17 at Dunhuang; acquired by Aurel Stein in 1907). Wood, F. & Barnard, M. (2010). The Diamond Sutra: The Story of the World’s Earliest Dated Printed Book. British Library. International Dunhuang Programme.',
 dur:12,hint:'Unroll the scroll sheet by sheet. The date is at the very end.',
 init:()=>({n:1}),
 watch(p){return {n:Math.min(7,1+Math.floor(p*7))}},
 ui:[{range:'n',label:'Sheets unrolled',min:1,max:7,get:s=>s.n,act:'n',show:v=>v+' of 7'}],
 on:{n(s,v){s.n=clamp(+v,1,7);return 'keep'}},
 draw(s){
  let out=heading('A scroll about five metres long')+P7_tag('est');
  const x0=24,w=72,gap=4,y=96,h=120;
  for(let i=0;i<s.n;i++){const x=x0+i*(w+gap);out+=R(x,y,w,h,'#fbf6ea','#d8c9a3',3);
   if(i===0)out+=P7_wheel(x+w/2,y+52,22)+TF(x+w/2,y+104,'picture',13,C.muted);
   else{out+=P7_script(x+6,y+8,w-12,i===6?h-46:h-16,6);if(i===6)out+=R(x+6,y+h-34,w-12,26,C.coralp,C.coral,3)+TF(x+w/2,y+h-16,'868',13,C.coral)}}
  if(s.n<7){const rx=x0+s.n*(w+gap);out+=R(rx,y-4,26,h+8,'#e9dcba','#d8c9a3',12)+L(rx+13,y+4,rx+13,y+h-4,'#d8c9a3',1.5)}
  out+=TF(x0,y+h+22,'right to left in the original; drawn left to right here',13,C.muted,'start');
  out+=TBF(24,268,P7_SHEETS[s.n-1],15,C.ink,'start');
  const notes=['An illustration of the Buddha teaching, shown here by a wheel.','Printed text. Strokes here are an impression, not real characters.','Each sheet was printed from one carved block of wood.','The sheets were pasted edge to edge into one long roll.','The translation is Kumārajīva’s, made about 460 years earlier.','The scroll was sealed in a cave near Dunhuang around 1000.','The colophon names the donor and gives the date: 11 May 868.'];
  out+=TF(24,290,notes[s.n-1],13,C.ink,'start');
  out+=T(300,356,`${s.n} of 7 sheets · about ${fmt(Math.round(s.n/7*50)/10)} m unrolled`,15,C.muted);
  return {svg:out,phase:s.n<7?'The scroll is made of seven sheets of paper pasted together. Keep unrolling: the evidence for its date is printed at the end, not inferred by scholars.':'The date comes from the book itself, which is why this scroll, and not an older undated print, is called the oldest dated printed book. It was already a skilled piece of printing, so the craft must be older.'};
 }});

P7_cards({id:'diamond-sutra-868-earlier',name:'Printing before 868',tag:'Older prints, harder dates',heading:'What was printed before 868?',dw:74,
 definition:'The Diamond Sūtra of 868 is the oldest printed book with a date in it. Older printed Buddhist texts survive, but their dates rest on where they were found or on written records.',
 example:'A small printed scroll found inside a Korean stone pagoda in 1966 is dated by the pagoda’s construction, about 751, and scholars still argue about where and when it was printed.',
 desc:'Four early stages of printing, each with its date, what survives, and how firm the date is.',
 research:'Tsien, T.-H. (1985). Paper and Printing. Science and Civilisation in China 5(1). Cambridge University Press. Barrett, T. H. (2008). The Woman Who Discovered Printing. Yale University Press. Pan, J. (1997) and Korean replies on the Pure Light Dhāraṇī dating.',
 hint:'Press each stage. Look at how each date is known.',foot:'A date inside the book is rarer than an old book.',
 items:[
  {d:'to 600s',t:'Seals and rubbings',tag:'est',lines:['Carved seals pressed text into clay','and on to paper and silk.','Ink rubbings copied texts cut in stone.','Both make many copies from one','carved original: the idea behind','woodblock printing.'],phase:'Seals and ink rubbings from stone were the forerunners: one carved surface, many copies. Printing whole pages from wood followed in East Asia by about 700.'},
  {d:'c. 704–751',t:'Pure Light Dhāraṇī',tag:'deb',lines:['A small printed scroll found in 1966','inside the Seokgatap pagoda at','Bulguksa temple, Korea.','It carries no date. The pagoda was','built about 751, and the text was','translated in 704.','Printed in Korea or in China? Scholars','disagree.'],phase:'The Pure Light Dhāraṇī scroll may be the oldest surviving woodblock print. Its date is bounded by the translation (704) and the pagoda (about 751), and whether it was printed in Silla Korea or Tang China is debated.'},
  {d:'c. 764–770',t:'Hyakumantō Darani',tag:'est',lines:['Empress Shōtoku of Japan ordered','a million tiny wooden pagodas, each','holding a printed charm.','The order is recorded in a court','chronicle, and many of the pagodas','and charms survive.','Wood or metal plates? Still argued.'],phase:'The “million pagoda charms” of Japan are dated by a court chronicle to about 764–770, and thousands survive. They are short charms rather than a book, and the printing surface is still discussed.'},
  {d:'868',t:'Diamond Sūtra',tag:'est',lines:['A complete book: frontispiece, full','text and a colophon with the donor’s','name and the date, 11 May 868.','Found sealed in a cave at Dunhuang.','Now in the British Library.','The fine carving shows a mature','craft, not a first attempt.'],phase:'The Diamond Sūtra scroll is the first printed book that dates itself. Its quality implies generations of earlier practice, most of which has not survived.'}]});

// One sample glyph (the letter F stands in for a character), drawn with strokes so it can be mirrored.
const P7_glyph=(x,y,sz,mirror,col,w=7)=>{const d=mirror?-1:1;return L(x-d*sz*.3,y-sz*.5,x-d*sz*.3,y+sz*.5,col,w)+L(x-d*sz*.3,y-sz*.5,x+d*sz*.35,y-sz*.5,col,w)+L(x-d*sz*.3,y-sz*.02,x+d*sz*.2,y-sz*.02,col,w)};
const P7_PSTEPS=[
 ['Write','A scribe writes the page on thin paper.','The text is written the right way round, in ink, on paper thin enough to see through.'],
 ['Paste face down','The sheet is pasted face down on a smoothed block.','Seen through the back of the paper, the writing now appears reversed on the wood.'],
 ['Carve','The carver cuts away everything that is not ink.','The strokes are left standing in relief. This is the slow, skilled step: one slip spoils the block.'],
 ['Ink','Ink is brushed over the raised strokes.','Only the raised, mirror-image strokes take the ink.'],
 ['Press','A clean sheet is laid on and rubbed with a brush.','No press is needed: a dry brush rubbed over the back of the paper picks up the ink.'],
 ['Peel','The sheet is peeled off: the text reads correctly.','The mirror image has been mirrored again. The block can now print thousands more copies, all identical.']];
SCENE({id:'diamond-sutra-868-print',name:'From brush to block to page',tag:'Why the block is a mirror image',
 definition:'In woodblock printing a whole page is carved in relief, in mirror image, on one block of wood. Inked and rubbed against paper, it prints the page the right way round, as many times as needed.',
 example:'A page written on thin paper is pasted face down on the block. The carver cuts round the reversed strokes, so the printed copy matches the scribe’s original.',
 desc:'A written sheet, a wooden block and a printed sheet side by side, stepping through the six stages from writing to peeling off the print.',
 research:'Tsien, T.-H. (1985). Paper and Printing. Science and Civilisation in China 5(1). Cambridge University Press (the woodblock process, tools and output). Language In Motion covers printing more widely.',
 dur:12,hint:'Step through the six stages, then print more copies. Watch which way round the sample character faces.',
 init:()=>({k:0,copies:0}),
 watch(p){const k=Math.min(5,Math.floor(p*6.5));return {k,copies:k===5?1+Math.floor((p*6.5-5)*6):0}},
 ui:[{b:'Back',act:'back'},{b:'Next step',act:'next'},{b:'Print another copy',act:'copy'}],
 on:{next(s){if(s.k<5)s.k++;if(s.k===5&&!s.copies)s.copies=1;return 'keep'},back(s){if(s.k>0)s.k--;if(s.k<5)s.copies=0;return 'keep'},copy(s){if(s.k===5)s.copies=Math.min(999,s.copies+1);return 'keep'}},
 draw(s){
  const st=P7_PSTEPS[s.k];let out=heading(`Step ${s.k+1} of 6: ${st[0]}`)+P7_tag('est');
  // written sheet
  out+=R(30,92,130,150,'#fbf6ea','#d8c9a3',3)+P7_glyph(95,167,70,false,C.ink)+TF(95,262,'written sheet',13,C.muted);
  // block
  const carved=s.k>=2,inked=s.k>=3;
  out+=R(222,86,156,162,carved?'#c9a36b':'#d9b986','#a67c3d',5);
  if(s.k>=1)out+=(s.k===1?R(235,92,130,150,'#fbf6ea','#d8c9a3',3,'opacity=".7"'):'')+P7_glyph(300,167,70,true,inked?C.ink:carved?'#8a5f24':'#6d7f89');
  if(s.k===4)out+=R(235,92,130,150,'#ffffff','#d8c9a3',3,'opacity=".85"');
  out+=TF(300,268,s.k===0?'smoothed block':s.k===1?'block: writing seen reversed':s.k===2?'block: strokes left raised':s.k===3?'block: inked':s.k===4?'paper rubbed on the block':'block: ready for the next sheet',13,C.muted);
  // print
  out+=R(440,92,130,150,s.k===5?'#ffffff':'#f1f4f6',s.k===5?'#d8c9a3':C.grid,3);
  if(s.k===5)out+=P7_glyph(505,167,70,false,C.ink);
  out+=TF(505,262,s.k===5?`printed copy ${s.copies}`:'printed sheet',13,C.muted);
  out+=P('M168 167H212',C.line,2)+P('M386 167H432',C.line,2);
  out+=TF(300,300,st[1],13,C.ink)+TF(300,320,'The letter F stands in for a character.',13,C.muted);
  out+=T(300,358,s.k===5?`${s.copies} identical ${s.copies===1?'copy':'copies'} from one block`:'One block prints one whole page',15,C.muted);
  return {svg:out,phase:st[2]};
 }});

/* =========================== song-editions =========================== */
SCENE({id:'song-editions',name:'The Kaibao canon',tag:'The first printed canon',
 definition:'The Kaibao canon, carved in Chengdu between 971 and 983 by order of the first Song emperor, was the first printing of a whole Buddhist canon: about 130,000 blocks.',
 example:'Its contents followed the Kaiyuan catalogue of 730: 1,076 texts in about 5,048 scrolls. Printed sets were sent as diplomatic gifts to Korea, Japan and neighbouring states.',
 desc:'A grid of 130 squares, each standing for 1,000 woodblocks, filling in as the years pass from 971 to 983, with a running count.',
 research:'Wu, J. & Chia, L. (eds) (2016). Spreading Buddha’s Word in East Asia: The Formation and Transformation of the Chinese Buddhist Canon. Columbia University Press. Tsien, T.-H. (1985). Paper and Printing. Block counts are as reported and approximate; the even carving rate here is illustrative.',
 dur:10,hint:'Move through the twelve years of carving. Each square is a thousand blocks.',
 init:()=>({y:971}),
 watch(p){return {y:971+Math.round(p*12)}},
 ui:[{range:'y',label:'Year',min:971,max:983,get:s=>s.y,act:'y',show:v=>String(v)}],
 on:{y(s,v){s.y=clamp(+v,971,983);return 'keep'}},
 draw(s){
  const done=Math.round(130*(s.y-971)/12);let out=heading('Carving a whole canon: 971–983')+P7_tag('est');
  for(let i=0;i<130;i++){const c=i%13,r=Math.floor(i/13);out+=R(24+c*21,82+r*21,17,17,i<done?'#c9a36b':'#fff',i<done?'#a67c3d':C.grid,3)}
  out+=TF(24,308,'each square: 1,000 blocks (even pace is illustrative)',13,C.muted,'start');
  out+=R(318,82,266,206,'#f6f9fb','none',10)+TBF(332,106,`By ${s.y}`,15,C.ink,'start');
  out+=P7_lines(332,132,[`about ${P7_num(done*1000)} blocks carved`,'of about 130,000 in all','','carved at Chengdu, Sichuan','blocks then moved to the capital,','Kaifeng, for printing','1,076 texts · about 5,048 scrolls'],13,C.ink,'start',20);
  out+=T(300,356,s.y<983?'One block per page of text':'Finished: the canon could now be printed to order',15,C.muted);
  return {svg:out,phase:s.y<983?'Carving 130,000 blocks took teams of carvers about twelve years. The cost was huge, which is why the first printed canon was an imperial project.':'Once the blocks existed, a full set could be printed whenever it was wanted. Sets went to Korea, Japan, the Liao and Xi Xia states and Vietnam, and became the model for later editions.'};
 }});

SCENE({id:'song-editions-copies',name:'Copy by hand or carve once?',tag:'When printing pays',
 definition:'Copying a canon by hand costs the same labour for every copy. Printing costs a great deal once, to carve the blocks, and then little for each further copy.',
 example:'With the illustrative figures here, carving costs as much as about 45 hand copies. Fewer copies than that and scribes are cheaper; more, and printing wins.',
 desc:'Two lines of total labour against number of copies: a steadily rising line for hand copying and a line that starts high and rises slowly for printing, with the crossing point marked.',
 research:'Illustrative model, not historical accounts: 10 scribe-years per hand copy, 430 carver-years for the blocks, half a worker-year per printed set. For the real economics of the canon projects see Wu & Chia (2016), Spreading Buddha’s Word in East Asia.',
 dur:10,hint:'Change how many copies are wanted and see which method costs less labour.',
 init:()=>({n:20}),
 watch(p){return {n:1+Math.round(p*119)}},
 ui:[{range:'n',label:'Copies wanted',min:1,max:120,get:s=>s.n,act:'n',show:v=>String(v)}],
 on:{n(s,v){s.n=clamp(+v,1,120);return 'keep'}},
 draw(s){
  const hand=n=>10*n,print=n=>430+.5*n,X0=70,Y0=300,W=300,H=210,X=n=>X0+n/120*W,Y=v=>Y0-v/1200*H;
  let out=heading('Labour for a number of copies')+P7_tag('ill');
  out+=L(X0,Y0,X0+W,Y0,C.line,1.5)+L(X0,Y0,X0,Y0-H,C.line,1.5);
  for(const v of [400,800,1200])out+=TF(X0-8,Y(v)+4,String(v),13,C.muted,'end')+L(X0,Y(v),X0+W,Y(v),C.grid,1);
  for(const n of [40,80,120])out+=TF(X(n),Y0+18,String(n),13,C.muted);
  out+=TF(X0+W/2,Y0+38,'copies',13,C.muted)+TF(X0,Y0-H-8,'worker-years',13,C.muted,'start');
  out+=L(X(0),Y(0),X(120),Y(1200),C.coral,2.6)+L(X(0),Y(430),X(120),Y(490),C.blue,2.6);
  const xc=430/9.5;out+=L(X(xc),Y0,X(xc),Y(hand(xc)),C.muted,1.2,'stroke-dasharray="4 4"');
  out+=Ci(X(s.n),Y(Math.min(1200,hand(s.n))),6,C.coral,'#fff')+Ci(X(s.n),Y(print(s.n)),6,C.blue,'#fff');
  out+=R(396,84,188,196,'#f6f9fb','none',10)+TBF(410,108,`${s.n} ${s.n===1?'copy':'copies'}`,15,C.ink,'start');
  out+=Ci(416,132,6,C.coral)+TF(430,137,`by hand: ${P7_num(hand(s.n))}`,13,C.ink,'start')+Ci(416,158,6,C.blue)+TF(430,163,`printed: ${P7_num(print(s.n))}`,13,C.ink,'start');
  out+=P7_lines(410,196,['worker-years','(illustrative figures)','','crossing point:','about 45 copies'],13,C.muted,'start',19);
  const win=hand(s.n)<print(s.n);
  out+=T(300,360,win?'Few copies: scribes cost less':'Many copies: the blocks pay for themselves',15,C.muted);
  return {svg:out,phase:win?'For a handful of copies, hand copying needs less labour than carving every page. That is why manuscripts and prints existed side by side for centuries.':'Beyond the crossing point each printed set costs a fraction of a hand copy, and every set is identical. Copying errors no longer build up from one copy to the next.'};
 }});

P7_cards({id:'song-editions-family',name:'A family of editions',tag:'Each canon copies and corrects the last',heading:'Printed Chinese canons, 971–1738',dw:92,
 definition:'More than twenty editions of the Chinese canon were printed from woodblocks. Most descend, directly or through others, from the Kaibao canon, and each added texts and corrections.',
 example:'The Goryeo editors in Korea compared the Kaibao canon with the Khitan canon and an earlier Korean edition, and recorded their choices: one reason their text is so trusted.',
 desc:'Seven printed editions in date order, each with where it was made, how many blocks or volumes it had, and what it was copied from.',
 research:'Wu, J. & Chia, L. (eds) (2016). Spreading Buddha’s Word in East Asia. Columbia University Press. Zacchetti, S. (2005). In Praise of the Light (on the edition lineages). Dates are approximate; block counts are as reported.',
 hint:'Press an edition to see what it descended from.',foot:'Dates are approximate.',
 items:[
  {d:'971–983',t:'Kaibao (Song)',tag:'est',lines:['Chengdu; printed at Kaifeng.','About 130,000 blocks.','The first printed canon and the','ancestor of most later ones.','Only a few scrolls survive.'],phase:'The Kaibao canon is almost entirely lost, but its text lives on in the editions copied from it.'},
  {d:'c. 1031–64',t:'Khitan (Liao)',tag:'est',lines:['Printed in the Liao state, north','China. Based on good northern','manuscripts, not only on Kaibao.','Fragments were found in a pagoda','at Yingxian in 1974.'],phase:'The Khitan canon drew on an independent manuscript tradition, which made it valuable to later editors as a second witness.'},
  {d:'c. 1011–87',t:'Goryeo, first',tag:'est',lines:['Korea, carved during Khitan','invasions. Based on Kaibao.','The blocks were burnt in the','Mongol invasion of 1232.'],phase:'The first Korean edition followed the Kaibao canon. Its blocks were destroyed in 1232; the second edition replaced it.'},
  {d:'1080–1151',t:'Fuzhou editions',tag:'est',lines:['Two canons carved at temples in','Fuzhou, paid for by local donors,','not the court.','Folded like a concertina instead','of rolled: easier to read.'],phase:'The Fuzhou editions were funded by donors and monasteries and used folded books, the start of a southern family of editions.'},
  {d:'c. 1149–73',t:'Jin (Zhaocheng)',tag:'est',lines:['North China, funded by donations;','tradition credits a laywoman, Cui','Fazhen, with leading the appeal.','A nearly complete set was found','at Guangsheng temple in 1933.'],phase:'The Jin canon copies the Kaibao closely, so its rediscovery in 1933 gave scholars the best view of the lost first edition.'},
  {d:'1236–51',t:'Goryeo, second',tag:'est',lines:['Korea. 81,258 blocks, still kept','at Haeinsa temple.','Collated from Kaibao, Khitan and','the first Goryeo edition.','The base of the modern Taishō.'],phase:'The second Goryeo edition, the Tripitaka Koreana, survives complete and became the base text for the standard modern edition.'},
  {d:'1410–1738',t:'Ming and Qing',tag:'est',lines:['Imperial editions at Nanjing and','Beijing; the privately funded','Jiaxing canon in thread-bound','books; the Qing “Dragon” canon','of 1733–38, about 79,000 blocks.'],phase:'Later imperial and private editions kept growing. The Jiaxing canon switched to ordinary thread-bound books, which made sets cheaper to buy and store.'}]});

/* =========================== tripitaka-koreana =========================== */
SCENE({id:'tripitaka-koreana',name:'The Tripitaka Koreana',tag:'81,258 blocks in sixteen years',
 definition:'The Tripitaka Koreana is the second Goryeo edition of the Chinese canon, carved in Korea from 1236 to 1251 on 81,258 woodblocks that survive, complete, at Haeinsa temple.',
 example:'Each block is carved on both sides, giving over 160,000 pages and about 52 million characters, with very few errors found.',
 desc:'A bar that fills as the years pass from 1236 to 1251 with a count of blocks carved, beside the main facts about the set.',
 research:'UNESCO World Heritage List: Haeinsa Temple Janggyeong Panjeon, the Depositories for the Tripitaka Koreana Woodblocks (1995); Memory of the World Register (2007). Lancaster, L. R. & Park, S.-B. (1979). The Korean Buddhist Canon: A Descriptive Catalogue. University of California Press. Counts differ slightly between sources (81,258 is the usual figure).',
 dur:10,hint:'Move through the years of carving. The count grows at an even pace here, which is illustrative.',
 init:()=>({y:1240}),
 watch(p){return {y:1236+Math.round(p*15)}},
 ui:[{range:'y',label:'Year',min:1236,max:1251,get:s=>s.y,act:'y',show:v=>String(v)}],
 on:{y(s,v){s.y=clamp(+v,1236,1251);return 'keep'}},
 draw(s){
  const fr=(s.y-1236)/15,n=Math.round(81258*fr);let out=heading('Carved while the country was at war')+P7_tag('est');
  out+=R(30,86,540,30,'#fff',C.grid,6)+R(30,86,540*fr,30,'#c9a36b','none',6)+TF(30,134,'1236',13,C.muted,'start')+TF(570,134,'1251',13,C.muted,'end')+TBF(300,107,`${P7_num(n)} blocks`,14,C.ink);
  const tiles=[['81,258','blocks, both sides carved'],['1,496','titles in 6,568 volumes'],['about 52 million','characters'],['about 3.2 km','if stacked, at 4 cm a block']];
  tiles.forEach((t,i)=>{const x=30+(i%2)*275,y=152+Math.floor(i/2)*72;out+=R(x,y,265,62,'#f6f9fb','none',10)+TBF(x+14,y+26,t[0],16,C.ink,'start')+TF(x+14,y+48,t[1],13,C.muted,'start')});
  out+=TF(300,318,'the first edition’s blocks were burnt by Mongol forces in 1232',13,C.muted);
  out+=T(300,358,s.y<1251?`${s.y}: carving in progress`:'1251: complete. Moved to Haeinsa in 1398',15,C.muted);
  return {svg:out,phase:'The court of Goryeo, driven to Ganghwa island by the Mongol invasions, had the whole canon carved again as an act of devotion and of protection for the kingdom. The editors, led by the monk Sugi, compared earlier editions line by line and recorded their decisions.'};
 }});

const P7_BSTEPS=[
 ['Fell and soak','Wood, mostly wild cherry and pear, is cut and soaked.','The logs are reported to have been soaked in sea water for up to three years, which helps stop later cracking.'],
 ['Cut and boil','Planks are sawn and boiled in salt water.','Boiling in brine drives out sap and evens the moisture in the wood, and deters insects.'],
 ['Dry in shade','The planks dry slowly, out of the sun.','Slow drying, reported as lasting about three years, keeps the planks from warping.'],
 ['Plane and write','The plank is planed, and a written sheet pasted on.','Each side takes 23 lines of 14 characters. A scribe’s sheet is pasted face down, as for any woodblock.'],
 ['Carve','Carvers cut both sides in relief.','The characters are so even that the set looks like one hand, though many carvers worked on it.'],
 ['Lacquer and fit ends','The block is lacquered, and end bars are fitted.','Lacquer protects against damp and insects. Thicker end bars keep the faces of stacked blocks apart so air can move between them.']];
SCENE({id:'tripitaka-koreana-block',name:'Making one block',tag:'Why the blocks have lasted',
 definition:'Each block of the Tripitaka Koreana is a plank about 70 cm wide, 24 cm tall and 3 cm thick, prepared over several years so that it would neither warp nor rot, then carved on both sides and lacquered.',
 example:'End bars thicker than the plank are fitted to both ends. Stacked on a shelf, the blocks touch only at these bars, so the carved faces never rub and air passes between them.',
 desc:'One woodblock shown at six stages, from a soaked log to a lacquered block with end bars, with the size and layout of the finished block.',
 research:'UNESCO World Heritage nomination file 737 (1995), Haeinsa Temple Janggyeong Panjeon. Park, S.-J. (2007), studies of the woods used (mostly wild cherry and pear, not birch as once thought). Soaking and drying times are as reported by the temple and vary between sources.',
 dur:12,hint:'Step through how a block was prepared. Most of the work happens before any carving.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(5,Math.floor(p*6))}},
 ui:[{b:'Back',act:'back'},{b:'Next step',act:'next'}],
 on:{next(s){s.k=Math.min(5,s.k+1);return 'keep'},back(s){s.k=Math.max(0,s.k-1);return 'keep'}},
 draw(s){
  const st=P7_BSTEPS[s.k];let out=heading(`Step ${s.k+1} of 6: ${st[0]}`)+P7_tag(s.k<3?'trad':'est');
  const x=70,y=120,w=460,h=110;
  if(s.k===0)out+=R(40,96,520,160,'#d7e8f3','none',10)+R(x+30,y+25,w-60,60,'#b98a4e','#8a5f24',30)+TF(300,274,'log under sea water',13,C.muted);
  else if(s.k===1)out+=R(x,y+20,w,70,'#c9a36b','#a67c3d',4)+P('M150 110q10-14 0-26M300 110q10-14 0-26M450 110q10-14 0-26',C.muted,2)+TF(300,274,'plank in boiling salt water',13,C.muted);
  else if(s.k===2)out+=R(x,y+20,w,70,'#d9b986','#a67c3d',4)+L(60,100,540,100,C.muted,3)+TF(300,92,'roof: shade, not sun',13,C.muted)+TF(300,274,'plank drying slowly',13,C.muted);
  else{out+=R(x,y,w,h,s.k===5?'#5b3c1e':'#d9b986','#a67c3d',4);
   if(s.k>=3)out+=P7_script(x+12,y+8,w-24,h-16,23,s.k===3?'#6d7f89':s.k===4?'#8a5f24':'#e9dcba');
   if(s.k===5)out+=R(x-22,y-8,26,h+16,'#3d2913','#2a1b0c',4)+R(x+w-4,y-8,26,h+16,'#3d2913','#2a1b0c',4);
   out+=TF(300,274,s.k===3?'23 columns marked out (impression)':s.k===4?'both sides carved in relief':'lacquered, with thicker end bars',13,C.muted)}
  out+=L(x,290,x+w,290,C.line,1.2)+TF(300,306,'about 70 cm wide · 24 cm tall · 3 cm thick · 3 to 4 kg',13,C.muted);
  out+=T(300,358,st[1],15,C.ink);
  return {svg:out,phase:st[2]};
 }});

SCENE({id:'tripitaka-koreana-halls',name:'Halls that breathe',tag:'Five centuries without machines',
 definition:'The Janggyeong Panjeon at Haeinsa are two long wooden halls, built by 1488 to store the blocks. Their windows and earthen floors keep the air moving and the humidity steady with no machinery.',
 example:'On the front wall the lower windows are larger than the upper; on the back wall it is the other way round. Air enters low, crosses the shelves and leaves high.',
 desc:'A cross-section of a storage hall with its unequal windows and layered floor, beside a gauge comparing humidity outside with humidity inside for the old hall and for a sealed modern store.',
 research:'UNESCO World Heritage List no. 737 (1995): Haeinsa Temple Janggyeong Panjeon. The floor is reported as layers of charcoal, lime, salt, clay and sand. A concrete store built in the 1970s was abandoned after test blocks kept there began to deteriorate. Humidity figures here are an illustrative model, not measurements.',
 dur:10,hint:'Change the weather outside, and switch between the fifteenth-century hall and a sealed modern store.',
 init:()=>({h:85,b:'hall'}),
 watch(p){return {h:Math.round(45+50*Math.abs(Math.sin(p*Math.PI))),b:p<.6?'hall':'store'}},
 ui:[{choose:[['hall','Old hall'],['store','Sealed store']],label:'Building',get:s=>s.b,act:'b'},{range:'h',label:'Humidity outside',min:40,max:95,get:s=>s.h,act:'h',show:v=>v+'%'}],
 on:{b(s,v){s.b=v;return 'keep'},h(s,v){s.h=clamp(+v,40,95);return 'keep'}},
 draw(s){
  const inside=Math.round(s.b==='hall'?62+(s.h-65)*.25:Math.min(98,s.h+4)),ok=inside<=72;
  let out=heading(s.b==='hall'?'Air in low, out high':'A sealed store traps damp')+P7_tag('ill');
  // building
  out+=P('M40 130L200 84L360 130',s.b==='hall'?'#6d5a45':'#8a98a1',6)+R(60,130,280,130,s.b==='hall'?'#f3ead8':'#e3e8eb',s.b==='hall'?'#6d5a45':'#8a98a1',2);
  for(let i=0;i<5;i++)out+=R(110+i*38,150,26,96,'#c9a36b','#a67c3d',2);
  if(s.b==='hall'){out+=R(54,214,12,36,'#fff','#6d5a45',2)+R(54,146,12,16,'#fff','#6d5a45',2)+R(334,146,12,36,'#fff','#6d5a45',2)+R(334,226,12,16,'#fff','#6d5a45',2);
   out+=P('M20 232H96Q200 250 300 172H376',C.blue,2.4,'none','stroke-dasharray="7 5"')+P('M368 166l10 6l-10 6',C.blue,2.4);
   out+=R(60,260,280,10,'#3b3b3b','none',0)+R(60,270,280,8,'#e8e2d2','none',0)+R(60,278,280,8,'#b9a27e','none',0)+TF(200,304,'floor: charcoal, lime, salt, clay, sand',13,C.muted);
   out+=TF(26,206,'large',13,C.muted,'start')+TF(374,200,'large',13,C.muted,'end')}
  else out+=R(60,260,280,12,'#9aa5ab','none',0)+TF(200,292,'concrete floor, no cross-draught',13,C.muted);
  // gauges
  const g=(x,v,lab,col)=>R(x,96,44,180,'#fff',C.grid,6)+R(x,96+180*(1-v/100),44,180*v/100,col,'none',6)+TBF(x+22,90,v+'%',14,C.ink)+TF(x+22,296,lab,13,C.muted);
  out+=g(430,s.h,'outside','#9cc3de')+g(510,inside,'inside',ok?'#7fbf9f':'#e39a86');
  out+=L(424,96+180*.28,560,96+180*.28,C.muted,1,'stroke-dasharray="4 4"')+TF(566,96+180*.28+4,'72',13,C.muted,'start');
  out+=T(300,358,ok?'Inside stays in the safe range for wood':'Too damp: mould and warping become likely',15,ok?C.green:C.coral);
  return {svg:out,phase:s.b==='hall'?'In this model the hall follows only a quarter of the swing outside. The real halls sit on a slope facing south-west, catch the valley wind, and their floors take up moisture in the wet season and give it back in the dry.':'A sealed room without the old ventilation follows the outside air and adds its own damp. A modern concrete store was tried in the 1970s and given up; the blocks stayed in the old halls.'};
 }});

/* =========================== royal-editions =========================== */
const P7_BASK={v:['Vinaya',111,'#c98f5a'],s:['Sutta',410,'#5f8fb5'],a:['Abhidhamma',208,'#7a9c6a']};
SCENE({id:'royal-editions',name:'A canon in marble',tag:'Kuthodaw, Mandalay, 1868',
 definition:'At the Kuthodaw Pagoda in Mandalay the whole Pali canon, as recited at the Fifth Council, is cut into 729 marble slabs, each in its own small shrine. It was finished in 1868 under King Mindon.',
 example:'Each slab is about 1.5 m tall and is inscribed on both sides. The Vinaya takes 111 slabs, the Sutta collection 410 and the Abhidhamma 208.',
 desc:'A square of 729 small cells, one per slab, coloured by basket, with a count for the basket chosen.',
 research:'UNESCO Memory of the World Register (2013): Maha Lawkamarazein or Kuthodaw Inscription Shrines. Ludu Daw Amar (1974), The World’s Biggest Book. Bollée, W. B. (1968), on the Kuthodaw text. The Fifth Council met at Mandalay in 1871 to recite the text.',
 dur:10,hint:'Choose a basket to see how much of the stone canon it fills.',
 init:()=>({b:'all'}),
 watch(p){return {b:['all','v','s','a'][Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:[['all','All 729'],['v','Vinaya'],['s','Sutta'],['a','Abhidhamma']],label:'Show',get:s=>s.b,act:'b'}],
 on:{b(s,v){s.b=v;return 'keep'}},
 draw(s){
  let out=heading('729 slabs, one small shrine each')+P7_tag('est');
  for(let i=0;i<729;i++){const k=i<111?'v':i<521?'s':'a',c=i%27,r=Math.floor(i/27),on=s.b==='all'||s.b===k;out+=R(24+c*9.6,78+r*9.6,7.6,7.6,on?P7_BASK[k][2]:'#e6ecef','none',1.5)}
  out+=R(300,78,284,258,'#f6f9fb','none',10);
  Object.entries(P7_BASK).forEach(([k,b],i)=>{const y=104+i*30,on=s.b==='all'||s.b===k;out+=R(314,y-12,14,14,b[2],'none',3)+(on?TBF:TF)(336,y,`${b[0]}: ${b[1]} slabs`,13,C.ink,'start')});
  out+=P7_lines(314,206,['each slab about 1.5 m tall, 1 m wide,','inscribed on both sides','carved 1860–1868 for King Mindon','gold-filled letters at first; the gold','was lost in the 1880s','a 730th slab records how it was made'],13,C.ink,'start',20);
  const n=s.b==='all'?729:P7_BASK[s.b][1];
  out+=T(300,362,s.b==='all'?'Often called the world’s largest book':`${P7_BASK[s.b][0]}: ${n} of 729 slabs (${Math.round(n/729*100)}%)`,15,C.muted);
  return {svg:out,phase:'Stone was chosen so that the text could not burn, rot or be eaten, in years when Lower Burma had already been annexed and the kingdom’s future was uncertain. The slabs became the reference text for later Burmese printed editions.'};
 }});

const P7_MEDIA={
 leaf:{n:'Palm-leaf manuscript',bars:[1,4,2],lines:['Incised with a stylus, then','inked. One copy at a time,','by hand.','In the tropics a leaf lasts','a few hundred years at best,','so texts were recopied again','and again.']},
 stone:{n:'Marble slabs',bars:[1,1,5],lines:['Cut once, by masons, for a','king. Cannot be moved or lent.','Very durable: the Kuthodaw','slabs are legible after 150','years.','You must travel to read it.']},
 print:{n:'Printed books (Siam, 1893)',bars:[5,5,3],lines:['39 volumes in Thai script,','printed for the 25th year of','King Chulalongkorn’s reign.','1,000 sets were made.','Sets went to libraries and','universities around the','world.']}};
SCENE({id:'royal-editions-chulalongkorn',name:'The first printed Pali canon',tag:'Siam, 1893',
 definition:'The edition printed in Bangkok in 1893 for King Chulalongkorn was the first printing of the Pali canon as a set of books: 39 volumes in Thai script instead of the Khom script of the manuscripts.',
 example:'A thousand sets were printed, and many were given to libraries abroad. Scholars in Europe and America could now consult a whole Asian edition of the canon.',
 desc:'Three ways of keeping a canon, palm leaf, marble and printed books, compared on ease of copying, portability and durability.',
 research:'Chalmers, R. (1898). The King of Siam’s edition of the Pāli Tipiṭaka. Journal of the Royal Asiatic Society 30, 1–10. Hinüber, O. von (1996). A Handbook of Pāli Literature. De Gruyter. The 1–5 ratings are this page’s rough comparison, not measurements.',
 dur:10,hint:'Choose a medium and compare the three bars. No single medium wins on everything.',
 init:()=>({m:'print'}),
 watch(p){return {m:['leaf','stone','print'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['leaf','Palm leaf'],['stone','Marble'],['print','Printed books']],label:'Medium',get:s=>s.m,act:'m'}],
 on:{m(s,v){s.m=v;return 'keep'}},
 draw(s){
  const m=P7_MEDIA[s.m];let out=heading(m.n)+P7_tag('ill');
  ['easy to copy','easy to move','long-lasting'].forEach((lab,i)=>{const y=96+i*46;out+=TF(24,y+4,lab,13,C.ink,'start')+R(128,y-10,180,20,'#fff',C.grid,6)+R(128,y-10,36*m.bars[i],20,[C.blue,C.green,C.amber][i],'none',6)+TBF(318,y+5,m.bars[i]+'/5',13,C.muted,'start')});
  out+=TF(24,238,'rough 1–5 ratings (this page’s judgement)',13,C.muted,'start');
  // picture
  if(s.m==='leaf')for(let i=0;i<5;i++)out+=R(40,258+i*9,250,7,'#d9c58f','#a8935a',2)+Ci(120,261.5+i*9,1.6,'#6d5a45')+Ci(210,261.5+i*9,1.6,'#6d5a45');
  else if(s.m==='stone')out+=P('M130 310V262Q165 244 200 262V310Z','#bfc8cc','#8a98a1',2)+R(118,310,94,8,'#8a98a1','none',2);
  else for(let i=0;i<9;i++)out+=R(60+i*24,256,20,52,i%2?'#7d4a3a':'#5d6f8a','none',2);
  out+=R(372,86,212,236,'#f6f9fb','none',10)+P7_lines(386,112,m.lines,13,C.ink,'start',21);
  out+=T(300,362,s.m==='print'?'Print made the canon a thing a library could own':s.m==='stone'?'Stone lasts, but stays where it is':'Hand copies: flexible, fragile, never identical',15,C.muted);
  return {svg:out,phase:s.m==='print'?'The Siamese edition showed that an Asian court could print and distribute a scholarly canon. It left out a few late books, and a fuller 45-volume edition followed in the 1920s.':s.m==='stone'?'A stone canon protects the text but cannot spread it. In practice the Kuthodaw slabs served as the master copy that printed Burmese editions were checked against.':'Until the nineteenth century almost every Pali text was read from palm leaf. Because leaves perish, the oldest surviving Pali manuscripts are far younger than the texts they carry.'};
 }});

// Four places where the witnesses differ (illustrative readings x and y), and which editions read which.
const P7_WIT=[['Burmese','ka'],['Sinhalese','sī'],['Siamese','syā'],['Cambodian','kaṃ'],['PTS (roman)','pī']];
const P7_LOCI=[[0,0,1,1,0],[0,1,1,1,1],[0,0,0,0,1],[0,1,0,1,0]];
SCENE({id:'royal-editions-sixth-council',name:'The Sixth Council edition',tag:'Rangoon, 1954–56',
 definition:'At the Sixth Council in Rangoon, 1954–56, about 2,500 monks from the Theravāda countries recited the Pali canon after committees had compared the printed editions line by line. Readings they did not adopt were kept in footnotes.',
 example:'The footnotes use short labels for each source: sī for Sinhalese, syā for Siamese, kaṃ for Cambodian and pī for the Pali Text Society’s roman edition.',
 desc:'Five editions in rows and four places where they disagree in columns. The learner chooses a reading at each place and the others go into the footnotes.',
 research:'Chaṭṭha Saṅgāyana edition (Rangoon, 1954–56), and its electronic version by the Vipassana Research Institute. Clark, C. (2015). The Sixth Buddhist Council: its purpose, presentation, and product. Journal of Burma Studies 19(1), 79–112. The four disagreements shown here are an illustrative example, not real readings.',
 dur:12,hint:'At each of the four places, press the reading you would print. The other reading goes into a footnote with the labels of the editions that have it.',
 init:()=>({pick:[0,0,0,0]}),
 watch(p){const k=Math.floor(p*5);return {pick:[0,1,0,1].map((v,i)=>i<k?v:0)}},
 ui:[{b:'Follow the majority',act:'maj'},{b:'Follow the Burmese text',act:'bur'}],
 on:{set(s,v){const [i,r]=String(v).split('-').map(Number);s.pick[i]=r;return 'keep'},maj(s){s.pick=P7_LOCI.map(l=>l.reduce((a,b)=>a+b,0)>=3?1:0);return 'keep'},bur(s){s.pick=P7_LOCI.map(l=>l[0]);return 'keep'}},
 draw(s,f,X){
  let out=heading('Collating five editions')+P7_tag('ill');
  P7_LOCI.forEach((l,i)=>out+=TBF(232+i*52,90,'place '+(i+1),13,C.muted));
  P7_WIT.forEach((w,r)=>{const y=112+r*30;out+=TF(24,y+5,w[0],13,C.ink,'start')+TF(150,y+5,w[1],13,C.muted,'start');
   P7_LOCI.forEach((l,i)=>{const v=l[r],on=s.pick[i]===v;out+=R(212+i*52,y-11,40,24,on?C.greenp:'#fff',on?C.green:C.grid,6)+TBF(232+i*52,y+5,v?'y':'x',13,on?C.green:C.muted)})});
  P7_LOCI.forEach((l,i)=>{[0,1].forEach(v=>{const on=s.pick[i]===v;out+=hit(X,'set',i+'-'+v,`Place ${i+1}: print reading ${v?'y':'x'}`,R(212+i*52+v*21,262,19,24,on?C.green:'#fff',on?C.green:C.line,5)+TBF(221.5+i*52+v*21,279,v?'y':'x',13,on?'#fff':C.ink))})});
  out+=TF(24,279,'print which reading?',13,C.ink,'start');
  out+=R(430,84,154,206,'#f6f9fb','none',10)+TBF(442,106,'Footnotes',14,C.ink,'start');
  P7_LOCI.forEach((l,i)=>{const other=1-s.pick[i],who=P7_WIT.filter((w,r)=>l[r]===other).map(w=>w[1]);out+=TF(442,132+i*34,`${i+1}. ${other?'y':'x'}`,13,C.ink,'start')+TF(442,148+i*34,who.length?'('+who.join(', ')+')':'(none)',13,C.muted,'start')});
  const maj=s.pick.filter((v,i)=>v===(P7_LOCI[i].reduce((a,b)=>a+b,0)>=3?1:0)).length;
  out+=TF(24,316,'readings x and y are illustrative; the labels are the real ones',13,C.muted,'start');
  out+=T(300,360,`${maj} of 4 choices agree with the majority of editions`,15,C.muted);
  return {svg:out,phase:'Whichever reading is printed, the other is not thrown away: it is recorded with the editions that carry it. The council’s edition mostly follows the Burmese tradition, and its footnotes let a reader see where the other countries’ texts differ.'};
 }});
