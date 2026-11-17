/* Ted Nelson In Motion · era 5 · Xanadu’s design (1981–1992).
   Transclusion, two-way links, transcopyright and tumblers, each as a structure the learner operates. */

const T5_SRC=[
 {t:'Bush essay',col:'#1772b7',fill:'#e1eef7',spans:['Consider a future device','in which an individual','stores all his books']},
 {t:'Lab notes',col:'#2c776c',fill:'#dceee8',spans:['Trail 14: bows','long bow v. short bow','tension tables p. 7']},
 {t:'Poem',col:'#7156a6',fill:'#ece6f6',spans:['Everything is deeply','intertwingled,','said the reader']}
];
// Wrap a string into lines of at most n characters.
const T5_wrap=(s,n)=>{const w=String(s).split(' '),out=[];let l='';for(const x of w){if((l+' '+x).trim().length>n){if(l)out.push(l);l=x}else l=(l+' '+x).trim()}if(l)out.push(l);return out};

SCENE({id:'transclusion',name:'Transclusion',tag:'Quoting by reference, not by copy',
 definition:'Transclusion, Nelson’s word, means including part of one document in another by reference. The included words are not copied: the new document shows a window onto the original, which keeps its identity, its author and its place.',
 example:'You write an essay that quotes a line of Bush and a line of your lab notes. In Xanadu the essay holds two pointers. Readers see the words, and can step through each one to its source.',
 research:'Nelson, T. H. (1981). Literary Machines. Mindful Press. Nelson, T. H. (1995). The heart of connection: hypermedia unified by transclusion. Communications of the ACM 38(8), 31–33.',
 desc:'Three source documents on the left, each split into spans; a new document on the right built from the spans you choose, with a coloured beam from each included span back to its source.',
 dur:12,hint:'Press spans in the sources to transclude them into your document. Then press “Edit a source” and watch every window onto it change.',
 init:()=>({doc:[[0,0],[1,1],[2,0]],edited:false}),
 watch(p){const k=Math.min(5,Math.floor(p*6));const doc=[[0,0],[1,1],[2,0],[2,1],[0,2]].slice(0,Math.min(5,k+1));return {doc,edited:k>=5}},
 ui:[{b:'Edit a source',act:'edit'},{b:'Remove last',act:'pop'},{b:'Clear',act:'clear'}],
 on:{add(s,a){const [i,j]=String(a).split('-').map(Number);if(s.doc.length<5)s.doc.push([i,j]);return 'keep'},edit(s){s.edited=!s.edited;return 'keep'},pop(s){s.doc.pop();return 'keep'},clear(s){s.doc=[];s.edited=false;return 'keep'}},
 draw(s,f,X){
  const span=(i,j)=>s.edited&&i===1&&j===1?'long bow v. Turkish bow':T5_SRC[i].spans[j];
  let out=heading('A new document made of windows onto old ones');
  T5_SRC.forEach((d,i)=>{const y=50+i*104;out+=R(16,y,236,96,'#fff',C.grid,8)+TBF(28,y+20,d.t+(s.edited&&i===1?' (edited)':''),13,d.col,'start');
   d.spans.forEach((_,j)=>{const used=s.doc.some(([a,b])=>a===i&&b===j),yy=y+28+j*22;out+=hit(X,'add',i+'-'+j,`Transclude “${span(i,j)}” from ${d.t}`,R(26,yy,216,20,used?d.fill:'#f6f9fb',used?d.col:'none',4)+TF(32,yy+15,span(i,j),13,C.ink,'start'))})});
  out+=R(340,50,244,312,'#fff',C.ink,8)+TBF(352,72,'Your essay',14,C.ink,'start');
  s.doc.forEach(([i,j],k)=>{const y=86+k*52,d=T5_SRC[i];
   out+=P(`M242 ${50+i*104+38+j*22} C 300 ${50+i*104+38+j*22} 300 ${y+18} 352 ${y+18}`,d.col,7,'none','opacity=".22"');
   out+=R(352,y,220,40,d.fill,d.col,6,'stroke-dasharray="5 3"')+TF(360,y+17,span(i,j),13,C.ink,'start')+TF(564,y+33,'from '+d.t,13,d.col,'end')});
  if(!s.doc.length)out+=TF(462,200,'press a span to include it',13,C.muted);
  const n=s.doc.length,ed=s.edited&&s.doc.some(([a,b])=>a===1&&b===1);
  return {svg:out,phase:n?`${n} span${n>1?'s':''} transcluded, none copied. ${ed?'The lab notes were edited and your essay shows the new words at once, because it never held a copy.':'Each window still belongs to its source: follow the beam back to read it in context.'}`:'An empty document. Transclusion builds new writing from pointers to existing writing.'};
 }});

SCENE({id:'transclusion-versions',name:'Which version?',tag:'Pinned or floating windows',
 definition:'Xanadu keeps every version of a document. A transclusion can therefore be pinned to the version the author quoted, or float to show the latest, and a reader can always compare the two.',
 example:'A critic quotes a minister’s statement. If the statement is later revised, a pinned quote still shows what was said, and the system can show that a newer version exists.',
 research:'Nelson, T. H. (1981). Literary Machines, chapter 2 (versions and historical backtrack). Nelson, T. H. (1999). Xanalogical structure, needed now more than ever. ACM Computing Surveys 31(4es).',
 desc:'A source document’s versions laid out along a timeline, and a quoting document whose transcluded passage is either pinned to one version or follows the latest.',
 dur:10,hint:'Step the source forward through versions, and switch the quote between pinned and floating.',
 init:()=>({v:1,mode:'pin'}),
 watch(p){const v=1+Math.min(3,Math.floor(p*4));return {v,mode:p<.5?'pin':'float'}},
 ui:[{range:'v',label:'Source version',min:1,max:4,get:s=>s.v,act:'v',show:v=>'v'+v},{choose:[['pin','Pinned to v1'],['float','Follows latest']],label:'Quote',get:s=>s.mode,act:'mode'}],
 on:{v(s,v){s.v=Number(v);return 'keep'},mode(s,v){s.mode=v;return 'keep'}},
 draw(s){
  const V=['We will cut the fare by 10%.','We will cut the fare by 5%.','We will review the fare.','The fare will rise by 3%.'];
  let out=heading('Every version is kept, so quotes can stay true');
  out+=L(60,92,540,92,C.line,3);
  V.forEach((t,i)=>{const x=80+i*150,on=i+1<=s.v,cur=i+1===s.v;out+=Ci(x,92,cur?13:9,on?C.blue:'#fff',on?C.blue:C.line)+TF(x,70,'v'+(i+1),13,on?C.ink:C.muted);
   if(on){const ls=T5_wrap(t,18);out+=R(x-66,112,132,50,cur?C.pale:'#f6f9fb',cur?C.blue:'none',6)+ls.map((l,k)=>TF(x,132+k*17,l,13,C.ink)).join('')}});
  const shown=s.mode==='pin'?1:s.v,stale=s.mode==='pin'&&s.v>1;
  out+=P(`M300 196 L ${80+(shown-1)*150} 164`,C.green,2,'none','stroke-dasharray="4 4"');
  out+=R(120,196,360,150,'#fff',C.ink,8)+TBF(136,220,'Critic’s article',14,C.ink,'start')+TF(136,244,'The minister promised:',13,C.muted,'start');
  out+=R(136,254,328,44,C.greenp,C.green,6,'stroke-dasharray="5 3"')+TF(300,281,V[shown-1],14,C.ink);
  out+=TF(464,316,'window onto v'+shown,13,C.green,'end');
  if(stale)out+=TF(136,334,`a newer version (v${s.v}) exists`,13,C.coral,'start');
  return {svg:out,phase:s.mode==='pin'?(stale?`The quote stays pinned to v1, which is what was actually said. Because the source keeps all ${s.v} versions, the reader is told a newer one exists.`:'Pinned to v1: the quote will keep showing the words that were quoted.'):`Following the latest: the quote now shows v${s.v}. Useful for living documents, misleading for a record of what someone said.`};
 }});

SCENE({id:'transclusion-storage',name:'One copy, many windows',tag:'The docuverse stores content once',
 definition:'In Nelson’s docuverse each piece of content is stored once and given a permanent address. Every document that uses it holds only a reference, so a passage quoted a thousand times is still stored once.',
 example:'A famous paragraph quoted in many essays: copied, it exists in every essay and the copies drift apart; transcluded, there is one paragraph and many pointers to it.',
 research:'Nelson, T. H. (1981). Literary Machines (the docuverse and permanent addresses). Sizes here are illustrative: a 500-character passage against a 32-byte reference.',
 desc:'Bars comparing storage for copied quotations with storage for transcluded quotations as the number of quoting documents grows, and a count of copies that can drift out of date.',
 dur:10,hint:'Raise the number of documents quoting the passage and compare what each approach stores.',
 init:()=>({n:10}),
 watch(p){return {n:Math.round(1+p*99)}},
 ui:[{range:'n',label:'Documents quoting it',min:1,max:100,get:s=>s.n,act:'n',show:v=>v}],
 on:{n(s,v){s.n=Number(v);return 'keep'}},
 draw(s){
  const passage=500,ref=32,copy=passage*(s.n+1),tr=passage+ref*s.n,max=passage*101;
  let out=heading('Stored once, referenced many times');
  const bar=(y,lab,v,col)=>R(170,y,380*v/max,34,col,'none',4)+TF(160,y+22,lab,14,C.ink,'end')+TF(176+380*v/max,y+22,(v/1000).toFixed(1)+' kB',13,C.ink,'start');
  out+=bar(80,'Copies',copy,C.coral)+bar(130,'Transclusion',tr,C.green);
  // Little document icons.
  const show=Math.min(s.n,20);
  for(let i=0;i<show;i++){const x=60+(i%10)*50,y=210+Math.floor(i/10)*58;out+=R(x,y,34,44,'#fff',C.line,4)+R(x+6,y+12,22,8,C.greenp,C.green,2)}
  if(s.n>20)out+=TF(560,330,`+${s.n-20} more`,13,C.muted,'end');
  out+=TF(300,198,'each document holds a pointer (green), not the words',13,C.muted);
  return {svg:out,phase:`${s.n} quoting documents: copying stores the passage ${s.n+1} times (${(copy/1000).toFixed(1)} kB) and leaves ${s.n} copies free to drift; transclusion stores it once plus ${s.n} pointers (${(tr/1000).toFixed(1)} kB).`};
 }});

/* ---------------- Two-way links ---------------- */
const T5_DOCS=[{t:'Essay',p:[110,120]},{t:'Review',p:[300,80]},{t:'Source',p:[490,120]},{t:'Notes',p:[180,270]},{t:'Reply',p:[420,270]}];
SCENE({id:'two-way-links',name:'Two-way links',tag:'Seen from both ends',
 definition:'In Xanadu a link is its own object joining two ends, and both ends know about it: from any document you can ask what links to it, as easily as what it links to. A web link is written inside the page it starts from, and the target cannot see it.',
 example:'Write a review that links to an essay. With two-way links, a reader of the essay can find your review; on the web, the essay’s readers will never know it exists unless a search engine tells them.',
 research:'Nelson, T. H. (1981). Literary Machines. Nelson, T. H. (1999). Xanalogical structure, needed now more than ever: parallel documents, deep links to content, deep versioning and deep re-use. ACM Computing Surveys 31(4es).',
 desc:'Five documents as circles. You draw links between them; the selected document lists the links it can see, outgoing and incoming, in either two-way or web mode.',
 dur:12,hint:'Press one document, then another, to link them. Press a document to view it, and switch between two-way and web mode to see which links it can see.',
 init:()=>({links:[[1,0],[4,1],[3,0]],pick:null,view:0,mode:'two'}),
 watch(p){const k=Math.min(5,Math.floor(p*6));return {links:[[1,0],[4,1],[3,0]],pick:null,view:[0,0,1,1,0,1][k],mode:k<3?'two':'web'}},
 ui:[{choose:[['two','Two-way (Xanadu)'],['web','One-way (web)']],label:'Links',get:s=>s.mode,act:'mode'},{b:'Clear links',act:'clear'}],
 on:{doc(s,a){const i=Number(a);if(s.pick===null){s.pick=i;s.view=i}else{if(s.pick!==i&&!s.links.some(([x,y])=>x===s.pick&&y===i)&&s.links.length<8)s.links.push([s.pick,i]);s.pick=null;s.view=i}return 'keep'},mode(s,v){s.mode=v;return 'keep'},clear(s){s.links=[];s.pick=null;return 'keep'}},
 draw(s,f,X){
  let out=heading(s.mode==='two'?'Every link is visible from both ends':'A web page sees only its own outgoing links');
  const out_=s.links.filter(([a])=>a===s.view),in_=s.links.filter(([,b])=>b===s.view);
  s.links.forEach(([a,b])=>{const seen=a===s.view||(s.mode==='two'&&b===s.view);out+=arrowR(T5_DOCS[a].p,T5_DOCS[b].p,32,36,seen?C.blue:'#d5e0e7',seen?3:2)});
  T5_DOCS.forEach((d,i)=>{const on=i===s.view,pk=i===s.pick;out+=hit(X,'doc',i,`Document ${d.t}`,Ci(d.p[0],d.p[1],32,on?C.blue:'#fff',pk?C.coral:C.blue)+TBF(d.p[0],d.p[1]+5,d.t,13,on?'#fff':C.ink))});
  out+=R(20,320,560,52,'#f3f7fa','none',8)+TBF(32,342,`Viewing ${T5_DOCS[s.view].t}:`,13,C.ink,'start');
  const o=out_.map(([,b])=>T5_DOCS[b].t).join(', ')||'none',inc=s.mode==='two'?(in_.map(([a])=>T5_DOCS[a].t).join(', ')||'none'):'hidden';
  out+=TF(32,362,`links out → ${o}`,13,C.blue,'start')+TF(330,362,`links in ← ${inc}`,13,s.mode==='two'?C.green:C.coral,'start');
  if(s.pick!==null)out+=TF(300,342,`now press the target for a link from ${T5_DOCS[s.pick].t}`,13,C.coral,'start');
  return {svg:out,phase:s.mode==='two'?`${T5_DOCS[s.view].t} can see ${out_.length} link${out_.length===1?'':'s'} out and ${in_.length} in. Readers can follow commentary back to what it comments on, and forward to everything said about it.`:`In web mode ${T5_DOCS[s.view].t} knows only its ${out_.length} outgoing link${out_.length===1?'':'s'}; ${in_.length} incoming link${in_.length===1?' is':'s are'} invisible from here.`};
 }});

SCENE({id:'two-way-links-spans',name:'Links attach to words',tag:'Spans, not pages',
 definition:'Xanadu links join spans of content, not whole pages, and the spans are found by content address rather than by position. So a link stays attached to the same words when text is inserted or deleted around them.',
 example:'A comment attached to “the purpose of computers is human freedom” stays on that phrase even after the author adds a new opening paragraph. A link that remembers “characters 40 to 75” would now point at the wrong words.',
 research:'Nelson, T. H. (1981). Literary Machines (links attach to spans of the permanent content). Davis, H. C. (1998). Referential integrity of links in open hypermedia systems. Proceedings of ACM Hypertext ’98, 207–216.',
 desc:'A paragraph with a highlighted span carrying a comment link. Inserting text before it shows a position-based anchor sliding onto the wrong words while a content-based anchor stays put.',
 dur:10,hint:'Insert or delete text before the linked phrase, and compare the two kinds of anchor.',
 init:()=>({ins:0}),
 watch(p){return {ins:[0,1,2,3,2,0][Math.min(5,Math.floor(p*6))]}},
 ui:[{b:'Insert text before',act:'ins'},{b:'Delete inserted text',act:'del'}],
 on:{ins(s){s.ins=Math.min(3,s.ins+1);return 'keep'},del(s){s.ins=Math.max(0,s.ins-1);return 'keep'}},
 draw(s){
  const pre=['Note: ','Revised. ','See also. '].slice(0,s.ins).join('');
  const base='Ted wrote that the purpose of computers is human freedom, and meant it.';
  const text=pre+base,phrase='purpose of computers',start=text.indexOf(phrase),pos0=base.indexOf(phrase);
  let out=heading('Where does the comment attach after an edit?');
  const show=(y,label,a,b,col,ok)=>{const lines=T5_wrap(text,40);let o=TBF(30,y,label,14,col,'start');let idx=0;
   lines.forEach((ln,k)=>{const ly=y+28+k*24;const s0=idx,e0=idx+ln.length;
    const hs=Math.max(a,s0),he=Math.min(b,e0);if(he>hs)o+=R(30+(hs-s0)*8.4,ly-15,(he-hs)*8.4,20,ok?C.greenp:C.coralp,'none',3);
    o+=TMF(30,ly,ln,14,C.ink,'start');idx=e0+1});return o};
  out+=show(70,'Anchored by content (Xanadu)',start,start+phrase.length,C.green,true);
  out+=show(200,'Anchored by position (characters '+pos0+'–'+(pos0+phrase.length)+')',pos0,pos0+phrase.length,C.coral,s.ins===0);
  const wrong=text.slice(pos0,pos0+phrase.length);
  out+=R(30,320,540,46,'#f3f7fa','none',8)+TF(44,348,s.ins?`position anchor now covers “${wrong}”`:'no edits yet: both anchors agree',13,s.ins?C.coral:C.muted,'start');
  return {svg:out,phase:s.ins?`${pre.length} characters were inserted. The content anchor still marks “${phrase}”; the position anchor has slid to “${wrong}”.`:'Both anchors mark the same words. Now edit the text in front of them.'};
 }});

SCENE({id:'two-way-links-scale',name:'Who keeps the back-links?',tag:'The price of two-way links',
 definition:'For links to be visible from both ends, someone must keep an index of what links to what and keep it consistent as documents change. One-way links need no such agreement: anyone can link to anything without asking.',
 example:'On the web, a new site can link to a newspaper without the newspaper doing anything. In a two-way system the newspaper’s server, or a shared index, must record the new link.',
 research:'Halasz, F. G. (1988). Reflections on NoteCards: seven issues for the next generation of hypermedia systems. Communications of the ACM 31(7), 836–852. Berners-Lee, T. & Fischetti, M. (1999). Weaving the Web. Harper.',
 desc:'A network of servers; new links appear each step. One-way mode shows each link recorded once at its source; two-way mode also sends an update to the target’s index, counted on a tally.',
 dur:10,hint:'Add servers and links, and compare the coordination each design needs.',
 init:()=>({n:6,mode:'two'}),
 watch(p){return {n:3+Math.floor(p*9),mode:p<.5?'one':'two'}},
 ui:[{range:'n',label:'Servers',min:3,max:12,get:s=>s.n,act:'n',show:v=>v},{choose:[['one','One-way (web)'],['two','Two-way (Xanadu)']],label:'Links',get:s=>s.mode,act:'mode'}],
 on:{n(s,v){s.n=Number(v);return 'keep'},mode(s,v){s.mode=v;return 'keep'}},
 draw(s){
  const r=rng(7),n=s.n,cx=180,cy=210,R0=130,pos=range(n).map(i=>[cx+R0*Math.cos(2*Math.PI*i/n-Math.PI/2),cy+R0*Math.sin(2*Math.PI*i/n-Math.PI/2)]);
  const links=[];for(let i=0;i<n*2;i++){const a=Math.floor(r()*n);let b=Math.floor(r()*n);if(b===a)b=(a+1)%n;links.push([a,b])}
  let out=heading(s.mode==='two'?'Two-way: every new link updates the target too':'One-way: a link is written once, at its source');
  links.forEach(([a,b])=>{out+=arrowR(pos[a],pos[b],16,18,C.blue,1.6);if(s.mode==='two'){const m=[(pos[a][0]+pos[b][0])/2,(pos[a][1]+pos[b][1])/2];out+=Ci(m[0],m[1],3.5,C.coral)}});
  pos.forEach((p,i)=>out+=Ci(p[0],p[1],16,'#fff',C.ink)+TF(p[0],p[1]+5,i+1,13,C.ink));
  const writes=links.length*(s.mode==='two'?2:1),cross=s.mode==='two'?links.length:0;
  out+=R(360,80,220,230,'#f3f7fa','none',10)+TBF(470,108,`${links.length} links`,15,C.ink)+TF(470,140,`writes: ${writes}`,14,C.ink)+TF(470,166,`messages to other servers: ${cross}`,13,s.mode==='two'?C.coral:C.muted)+TF(470,200,s.mode==='two'?'needs every server to':'needs nobody’s',13,C.muted)+TF(470,220,s.mode==='two'?'take part and stay up':'permission or reply',13,C.muted);
  out+=TF(470,260,s.mode==='two'?'gain: back-links for free':'cost: links can break,',13,s.mode==='two'?C.green:C.coral)+TF(470,280,s.mode==='two'?'':'and back-links are lost',13,C.coral);
  return {svg:out,phase:s.mode==='two'?`With ${n} servers, ${links.length} links cost ${cross} cross-server updates. Every server must cooperate, and a server that is down leaves the index out of step.`:`With ${n} servers, ${links.length} links are each written once by their author. Nobody else is involved, which is why the web could grow without central agreement.`};
 }});

/* ---------------- Transcopyright ---------------- */
SCENE({id:'transcopyright',name:'Transcopyright',tag:'Permission to quote, paid per reading',
 definition:'Nelson proposed transcopyright: by publishing in the system, an author grants everyone permission to transclude their work, and each time a reader is delivered a transcluded passage, a small royalty flows to its owner automatically.',
 example:'Your essay quotes three authors. Every time someone reads your essay, each quoted author is paid a fraction for their words, and you are paid for yours. Nobody needs to ask permission first.',
 research:'Nelson, T. H. (1981). Literary Machines (the royalty system). Nelson, T. H. (1997). Transcopyright: dealing with the dilemma of digital copyright. Educom Review 32(1), 32–35. Amounts here are illustrative.',
 desc:'A compound document made of spans from four authors, with a readers slider; each author’s purse fills in proportion to the characters of theirs delivered.',
 dur:10,hint:'Set how many people read the compound document and how much a character earns, and watch each author’s share.',
 init:()=>({readers:1000,rate:2}),
 watch(p){return {readers:Math.round(10+p*4990),rate:2}},
 ui:[{range:'readers',label:'Readers',min:10,max:5000,step:10,get:s=>s.readers,act:'readers',show:v=>v},{range:'rate',label:'Price per 1,000 characters',min:1,max:10,get:s=>s.rate,act:'rate',show:v=>(v/10).toFixed(1)+'p'}],
 on:{readers(s,v){s.readers=Number(v);return 'keep'},rate(s,v){s.rate=Number(v);return 'keep'}},
 draw(s){
  const A=[{n:'You',c:1200,col:C.blue},{n:'Author B',c:400,col:C.green},{n:'Author C',c:250,col:C.purple},{n:'Author D',c:150,col:C.amber}];
  const tot=sum(A.map(a=>a.c));let out=heading('Each reading pays every author whose words are shown');
  let x=40;A.forEach(a=>{const w=520*a.c/tot;out+=R(x,60,w-2,40,a.col,'none',4)+(w>60?TF(x+w/2,85,a.n,13,'#fff'):'');x+=w});
  out+=TF(300,122,`one compound document, ${tot} characters`,13,C.muted);
  const pence=c=>c/1000*s.rate/10*s.readers;
  const mx=Math.max(...A.map(a=>pence(a.c)));
  A.forEach((a,i)=>{const y=150+i*50,w=320*pence(a.c)/Math.max(mx,1e-9);out+=TF(150,y+22,a.n,14,C.ink,'end')+R(160,y,w,32,a.col,'none',4)+TF(170+w,y+22,'£'+(pence(a.c)/100).toFixed(2),13,C.ink,'start')+TF(150,y+38,a.c+' chars',13,C.muted,'end')});
  return {svg:out,phase:`${s.readers} readers at ${(s.rate/10).toFixed(1)}p per 1,000 characters: you earn £${(pence(1200)/100).toFixed(2)} and the three quoted authors earn £${((pence(400)+pence(250)+pence(150))/100).toFixed(2)} between them, without anyone asking permission.`};
 }});

SCENE({id:'transcopyright-compare',name:'Three ways to quote',tag:'Credit, payment and integrity',
 definition:'Transcopyright aimed to make quoting easy, credited and paid at once. Copy and paste is easy but keeps no built-in credit or payment (credit depends on the copier citing the source); asking permission keeps them but is slow and often refused.',
 example:'A teacher building a course pack can copy articles (fast, unpaid, often unlawful), clear rights for each (slow, paid), or, in Nelson’s design, transclude them under a standing licence (fast, paid, credited).',
 research:'Nelson, T. H. (1997). Transcopyright: dealing with the dilemma of digital copyright. Educom Review 32(1). Lessig, L. (2004). Free Culture. Penguin Press. Creative Commons (2002) chose free licences instead of payment.',
 desc:'A table of three quoting methods against five properties, with ticks and crosses; choosing a method highlights its row and describes its trade-off.',
 dur:9,hint:'Choose a method to see what it keeps and what it loses.',
 init:()=>({m:2}),
 watch(p){return {m:Math.min(2,Math.floor(p*3))}},
 ui:[{choose:[[0,'Copy and paste'],[1,'Ask permission'],[2,'Transcopyright']],label:'Method',get:s=>s.m,act:'m'}],
 on:{m(s,v){s.m=Number(v);return 'keep'}},
 draw(s){
  const cols=['Fast','Credit built in','Author paid','Stays linked','Text intact'];
  const rows=[['Copy and paste',[1,0,0,0,0]],['Ask permission',[0,1,1,0,0]],['Transcopyright',[1,1,1,1,1]]];
  let out=heading('What each way of quoting keeps');
  cols.forEach((c,j)=>out+=TBF(212+j*80,78,c.split(' ')[0],13,C.ink)+(c.split(' ')[1]?TBF(212+j*80,94,c.split(' ')[1],13,C.ink):''));
  rows.forEach(([n,v],i)=>{const y=114+i*56,on=i===s.m;out+=R(20,y,560,46,on?C.pale:'#fff',on?C.blue:C.grid,8)+TBF(32,y+28,n,14,C.ink,'start');
   v.forEach((ok,j)=>out+=TBF(212+j*80,y+30,ok?'✓':'✗',18,ok?C.green:C.coral))});
  const say=['Fast and free to do, but nothing credits or pays the author automatically, the copy can drift, and it may be unlawful.','Lawful and paid, but slow: each request may take weeks or be refused, and the result is still a disconnected copy.','Nelson’s promise: instant permission, credit and payment, and the quote stays connected to its source. The catch is that it needs a whole system to exist.'];
  const v=rows[s.m][1],keep=cols.filter((_,j)=>v[j]).join(', ')||'nothing',lose=cols.filter((_,j)=>!v[j]).join(', ')||'nothing';
  out+=R(20,290,560,72,'#f3f7fa','none',8)+TF(36,318,'Keeps: '+keep.toLowerCase(),13,C.green,'start')+TF(36,344,'Loses: '+lose.toLowerCase(),13,C.coral,'start');
  return {svg:out,phase:say[s.m]};
 }});

SCENE({id:'transcopyright-micropayments',name:'The trouble with tiny payments',tag:'Transaction and mental costs',
 definition:'Paying fractions of a penny per reading needs very cheap transactions, and readers must be willing to decide about many tiny charges. Critics argued that both costs, the bank’s and the reader’s attention, sank most micropayment schemes.',
 example:'If a payment costs 2p to process, a 0.1p royalty loses money. Even with free processing, people prefer a flat subscription to watching a meter tick.',
 research:'Szabo, N. (1999). Micropayments and mental transaction costs. 2nd Berlin Internet Economics Workshop. Shirky, C. (2000). The case against micropayments. O’Reilly OpenP2P. Odlyzko, A. (2003). The case against micropayments. Financial Cryptography, LNCS 2742.',
 desc:'A bar comparing a payment with its processing fee as you vary the payment size and the fee, and a marker for the share of the money lost to processing.',
 dur:10,hint:'Change the payment size and the processing fee. Where does a micropayment stop making sense?',
 init:()=>({pay:10,fee:20}),
 watch(p){return {pay:Math.round(1+p*99),fee:20}},
 ui:[{range:'pay',label:'Payment',min:1,max:100,get:s=>s.pay,act:'pay',show:v=>(v/10).toFixed(1)+'p'},{range:'fee',label:'Fixed fee per payment',min:0,max:50,get:s=>s.fee,act:'fee',show:v=>(v/10).toFixed(1)+'p'}],
 on:{pay(s,v){s.pay=Number(v);return 'keep'},fee(s,v){s.fee=Number(v);return 'keep'}},
 draw(s){
  const pay=s.pay/10,fee=s.fee/10,lost=Math.min(1,fee/pay);
  let out=heading('Small payments drown in fixed costs');
  const sc=440/Math.max(pay,fee,1);
  out+=TF(110,96,'payment',14,C.ink,'end')+R(120,76,pay*sc,30,C.green,'none',4)+TF(126+pay*sc,96,pay.toFixed(1)+'p',13,C.ink,'start');
  out+=TF(110,146,'fee',14,C.ink,'end')+R(120,126,fee*sc,30,C.coral,'none',4)+TF(126+fee*sc,146,fee.toFixed(1)+'p',13,C.ink,'start');
  out+=R(120,190,440,34,'#fff',C.line,6)+R(120,190,440*lost,34,C.coralp,'none',6)+TF(340,212,`${Math.round(lost*100)}% of the money goes on processing`,14,C.ink);
  out+=R(40,250,520,110,'#f3f7fa','none',10)+TBF(56,274,'Two costs, two critiques',14,C.ink,'start')+TF(56,298,'Money: a fixed fee per payment (card fees were pence).',13,C.ink,'start')+TF(56,320,'Attention: each tiny decision costs the reader effort',13,C.ink,'start')+TF(56,340,'(Szabo 1999); flat fees win (Odlyzko 2003).',13,C.ink,'start');
  return {svg:out,phase:lost>=1?`At ${pay.toFixed(1)}p with a ${fee.toFixed(1)}p fee, processing costs more than the payment itself.`:`At ${pay.toFixed(1)}p with a ${fee.toFixed(1)}p fee, ${Math.round(lost*100)}% is lost to processing. Fees must be tiny for per-reading royalties to work, and even then readers prefer flat prices.`};
 }});

/* ---------------- Tumblers ---------------- */
SCENE({id:'tumblers',name:'Tumblers',tag:'Addresses that never need renumbering',
 definition:'Xanadu gives everything a permanent address called a tumbler: a string of numbers separated by points, in fields for server, account, document (with its versions) and the bytes inside it. Zeros separate the fields, and any field can grow forever by adding more digits.',
 example:'1.2.0.5.0.3.1.0.1.40 can be read as: server 1.2, account 5, document 3 version 1, then content from position 1, here 40 characters. A new account on server 1.2 simply takes the next number; nothing else changes.',
 research:'Nelson, T. H. (1981). Literary Machines, chapter 4 (tumblers). The structure is simplified here; Udanax Green, the 1980s Xanadu back end, was released as open source in 1999.',
 desc:'A tumbler address split into coloured fields, with controls that change each field, and a tree showing where the address sits among servers, accounts and documents.',
 dur:10,hint:'Change each field and watch the address and its place in the tree.',
 init:()=>({srv:2,acc:5,doc:3,ver:1,pos:1,len:40}),
 watch(p){const k=Math.min(4,Math.floor(p*5));return {srv:[1,2,2,2,2][k],acc:[5,5,7,7,7][k],doc:[3,3,3,4,4][k],ver:[1,1,1,1,2][k],pos:1,len:40}},
 ui:[{range:'srv',label:'Server',min:1,max:3,get:s=>s.srv,act:'srv',show:v=>'1.'+v},{range:'acc',label:'Account',min:1,max:9,get:s=>s.acc,act:'acc',show:v=>v},{range:'doc',label:'Document',min:1,max:9,get:s=>s.doc,act:'doc',show:v=>v},{range:'ver',label:'Version',min:1,max:5,get:s=>s.ver,act:'ver',show:v=>v}],
 on:{srv(s,v){s.srv=Number(v);return 'keep'},acc(s,v){s.acc=Number(v);return 'keep'},doc(s,v){s.doc=Number(v);return 'keep'},ver(s,v){s.ver=Number(v);return 'keep'}},
 draw(s){
  const F=[['1.'+s.srv,'server',C.blue],['0',null,C.muted],[String(s.acc),'account',C.green],['0',null,C.muted],[s.doc+'.'+s.ver,'document.version',C.purple],['0',null,C.muted],[s.pos+'.'+s.len,'content span',C.amber]];
  let out=heading('One permanent address for any piece of content');
  let x=40;F.forEach(([v,lab,col])=>{const w=lab?Math.max(70,v.length*16+24):26;out+=R(x,60,w,46,lab?'#fff':'#f3f7fa',col,6)+TMF(x+w/2,90,v,20,col);if(lab)out+=TF(x+w/2,124,lab,13,col);x+=w+8});
  // Tree.
  const node=(x,y,t,on,col,w=66)=>R(x-w/2,y-14,w,26,on?col:'#fff',col,6)+TF(x,y+4,t,13,on?'#fff':C.ink);
  let t='';const sx=[110,300,490];
  sx.forEach((xx,i)=>{t+=L(300,160,xx,196,C.line,1.5)+node(xx,200,'srv 1.'+(i+1),i+1===s.srv,C.blue)});
  const px=sx[s.srv-1];
  [-76,0,76].forEach((d,i)=>{const a=s.acc-1+i,ax=px+d;if(a<1)return;t+=L(px,214,ax,246,C.line,1.5)+node(ax,250,'acct '+a,a===s.acc,C.green)});
  [-76,0,76].forEach((d,i)=>{const dd=s.doc-1+i,dx=px+d;if(dd<1)return;t+=L(px,264,dx,296,C.line,1.5)+node(dx,300,'doc '+dd+'.'+(dd===s.doc?s.ver:1),dd===s.doc,C.purple)});
  t+=L(px,314,px,336,C.line,1.5)+node(px,350,'chars 1–40',true,C.amber);
  out+=node(300,160,'docuverse',false,C.ink,90)+t;
  const addr=`1.${s.srv}.0.${s.acc}.0.${s.doc}.${s.ver}.0.${s.pos}.${s.len}`;
  return {svg:out,phase:`Address ${addr}: server 1.${s.srv}, account ${s.acc}, document ${s.doc} version ${s.ver}, ${s.len} characters from position ${s.pos}. Whatever else is added to the docuverse, this address keeps meaning the same thing.`};
 }});

SCENE({id:'tumblers-insert',name:'Insert without renumbering',tag:'Why addresses can stay permanent',
 definition:'With ordinary numbering, inserting an item shifts the numbers of everything after it, and every reference to those numbers breaks. Tumbler-style numbering puts a new item under an existing one (2 → 2.1), so no existing address ever changes.',
 example:'Chapters 1, 2, 3: insert a new chapter after 2. Renumbered, the old chapter 3 becomes 4 and every “see chapter 3” is now wrong. Tumbler-numbered, the new one is 2.1 and nothing moves.',
 research:'Nelson, T. H. (1981). Literary Machines (tumbler arithmetic and forking). The same idea underlies Dewey-style classification extensions and dotted version numbers.',
 desc:'A list of items with addresses and references pointing at them. Inserting items either renumbers the list, breaking references, or forks new tumbler addresses, keeping them.',
 dur:10,hint:'Insert new items in the middle and compare renumbering with tumbler forking.',
 init:()=>({n:0,mode:'tumbler'}),
 watch(p){const k=Math.min(5,Math.floor(p*6));return {n:[0,1,2,3,1,3][k],mode:k<3?'renumber':'tumbler'}},
 ui:[{choose:[['renumber','Renumber 1, 2, 3…'],['tumbler','Tumbler forking']],label:'Numbering',get:s=>s.mode,act:'mode'},{b:'Insert after item 2',act:'ins'}],
 on:{mode(s,v){s.mode=v;return 'keep'},ins(s){s.n=Math.min(3,s.n+1);return 'keep'}},
 draw(s){
  const names=['Intro','Memex','Trails','Xanadu','Coda'],ins=['New A','New B','New C'].slice(0,s.n);
  const items=[{t:'Intro',orig:1},{t:'Memex',orig:2},...ins.map((t,i)=>({t,orig:null,tum:'2.'+(i+1)})),{t:'Trails',orig:3},{t:'Xanadu',orig:4},{t:'Coda',orig:5}];
  items.forEach((it,i)=>{it.addr=s.mode==='renumber'?String(i+1):(it.orig?String(it.orig):it.tum)});
  let out=heading(s.mode==='renumber'?'Renumbering moves every later address':'Forking adds addresses without moving any');
  items.forEach((it,i)=>{const y=58+i*36;out+=R(60,y,200,30,it.orig?'#fff':C.amberp,it.orig?C.line:C.amber,6)+TMF(80,y+21,it.addr,14,C.blue,'start')+TF(150,y+21,it.t,14,C.ink,'start')});
  const refs=[[3,'Trails'],[4,'Xanadu'],[5,'Coda']];let broken=0;
  refs.forEach(([n,t],k)=>{const y=90+k*80,target=items.find(it=>it.addr===String(n)),ok=target&&target.t===t;if(!ok)broken++;
   out+=R(380,y,190,56,'#fff',ok?C.green:C.coral,8)+TF(392,y+22,`“see item ${n}”`,14,C.ink,'start')+TF(392,y+44,ok?`→ ${t} ✓`:`→ ${target?target.t:'nothing'} ✗ (meant ${t})`,13,ok?C.green:C.coral,'start');
   const ti=items.indexOf(target);if(ti>=0)out+=P(`M380 ${y+28} C 320 ${y+28} 320 ${73+ti*36} 262 ${73+ti*36}`,ok?C.green:C.coral,1.6,'none','stroke-dasharray="4 3"')});
  return {svg:out,phase:s.n===0?'No insertions yet: every reference finds its item.':s.mode==='renumber'?`${s.n} item${s.n>1?'s':''} inserted and renumbered: ${broken} of 3 references now point at the wrong item.`:`${s.n} item${s.n>1?'s':''} inserted as 2.1${s.n>1?'–2.'+s.n:''}: all 3 references still find their items.`};
 }});

SCENE({id:'tumblers-append',name:'Append-only content, editable documents',tag:'Two layers: content and arrangement',
 definition:'In the Xanadu design new content is only ever appended to permanent storage, where each character keeps its address for good. A document is an arrangement of pointers into that store, so editing changes the arrangement, never the stored content, and every past version can be rebuilt.',
 example:'Delete a sentence and it vanishes from the current version, but its characters are still in storage under their addresses, so the previous version, and any quotation of it, still works.',
 research:'Nelson, T. H. (1981). Literary Machines (the permanent “I-stream” and the document “V-stream”, described here in simplified form). Git (2005) later used a similar idea: immutable stored objects and versions as arrangements of them.',
 desc:'A permanent store of characters at the bottom that only ever grows, and above it the current document drawn as coloured spans pointing down into the store. Edits change the spans, not the store.',
 dur:12,hint:'Apply edits one by one: append, insert, delete. The store only grows; the document is rearranged.',
 init:()=>({step:0}),
 watch(p){return {step:Math.min(3,Math.floor(p*4))}},
 ui:[{b:'Next edit',act:'next'},{b:'Previous',act:'prev'}],
 on:{next(s){s.step=Math.min(3,s.step+1);return 'keep'},prev(s){s.step=Math.max(0,s.step-1);return 'keep'}},
 draw(s){
  // Store segments, appended in order; each version is a list of [segment, offset, length] pointers.
  const SEG=[['links work ',C.blue],['one way',C.green],['both ways',C.purple],['must ',C.amber],['always ',C.coral]];
  const VER=[[[0,0,11],[1,0,7]],[[0,0,11],[2,0,9]],[[0,0,6],[3,0,5],[0,6,5],[2,0,9]],[[0,0,6],[3,0,5],[4,0,7],[0,6,5],[2,0,9]]];
  const nSeg=[2,3,4,5][s.step],shownDoc=VER[s.step];
  const labels=['Version 1: “links work one way”','Replace “one way” with “both ways”','Insert “must ” (appended to the store)','Insert “always ” (appended again)'];
  let out=heading(labels[s.step]);
  // Store row.
  out+=TBF(30,334,'Permanent store (append-only)',13,C.ink,'start');let x=30;const segX=[];
  for(let i=0;i<nSeg;i++){const [t,c]=SEG[i],w=t.length*9.2;segX.push(x);out+=R(x,278,w,34,'#fff',c,4)+TMF(x+4,300,t,14,c,'start');x+=w+6}
  out+=TF(30,356,`${sum(SEG.slice(0,nSeg).map(a=>a[0].length))} characters stored, none ever removed`,13,C.muted,'start');
  // Document row.
  out+=TBF(30,72,'Current document',13,C.ink,'start');x=30;
  shownDoc.forEach(([seg,off,len])=>{const [t,c]=SEG[seg],piece=t.substr(off,len),w=piece.length*9.2;out+=R(x,82,w,34,'#fff',c,4)+TMF(x+4,104,piece,14,c,'start');
   const sx=segX[seg]+off*9.2+len*4.6;out+=P(`M${x+w/2} 116 C ${x+w/2} 200 ${sx} 200 ${sx} 278`,c,1.5,'none','stroke-dasharray="4 3" opacity=".7"');x+=w+6});
  const text=shownDoc.map(([seg,off,len])=>SEG[seg][0].substr(off,len)).join('');
  return {svg:out,phase:`Version ${s.step+1} reads “${text.trim()}”. It is ${shownDoc.length} pointers into the store; the store holds every character ever written, so earlier versions can always be rebuilt.`};
 }});
