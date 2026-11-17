/* ===================== Ted Nelson era 2 · Naming hypertext (1960–1965) ===================== */
// The 1965 ACM paper: the word "hypertext", the Evolutionary List File and zippered lists, hypermedia,
// and keeping every version.

/* ---------------- Lesson: Coining hypertext (1965) ---------------- */
const T2_EXTRA=[[0,5],[2,7],[6,1],[3,0],[7,4],[1,4],[5,2],[4,6],[0,3],[6,2],[7,1],[3,5]];
function T2_ringPos(i,n=8){const a=-Math.PI/2+i*2*Math.PI/n;return [180+Math.cos(a)*108,192+Math.sin(a)*108]}
SCENE({id:'coining-hypertext',name:'Coining “hypertext”',tag:'Nelson, ACM conference, 1965',
 definition:'In a 1965 paper Ted Nelson introduced the word hypertext for written or pictured material so interconnected that it could not conveniently be presented on paper. The test is practical: print it, and the links turn into a tangle of “see page …” jumps.',
 example:'Eight short chunks read in order make a booklet. Add a dozen cross-links and the printed booklet sends the reader backwards and forwards on almost every page.',
 research:'Nelson, T. H. (1965). Complex information processing: a file structure for the complex, the changing and the indeterminate. Proceedings of the ACM 20th National Conference, 84–100.',
 desc:'Eight chunks drawn either as a linked network or as eight printed pages in a row, with each link that does not lead to the next page drawn as a jump arc and counted.',
 dur:12,hint:'Add cross-links with the slider, then switch between the network and the printed version to see what paper does to them.',
 init:()=>({n:4,view:'print'}),
 watch(p){return {n:Math.min(12,Math.floor(p*14)),view:p<.5?'net':'print'}},
 ui:[{range:'n',label:'Cross-links',min:0,max:12,step:1,get:s=>s.n,act:'n',show:v=>v+' links'},{choose:[['net','As hypertext'],['print','As print']],label:'View',get:s=>s.view,act:'view'}],
 on:{n(s,v){s.n=Number(v)},view(s,v){s.view=v}},
 draw(s){
  const links=T2_EXTRA.slice(0,s.n);let out=heading(s.view==='net'?'Hypertext: chunks joined by links':'Printed: every link becomes a jump');
  if(s.view==='net'){
   for(let i=0;i<7;i++)out+=arrowR(T2_ringPos(i),T2_ringPos(i+1),24,28,C.line,2);
   links.forEach(([a,b])=>out+=arrowR(T2_ringPos(a),T2_ringPos(b),24,28,C.blue,2));
   for(let i=0;i<8;i++){const p=T2_ringPos(i);out+=Ci(p[0],p[1],22,'#fff',C.blue)+TF(p[0],p[1]+5,String.fromCharCode(65+i),14,C.ink)}
   out+=R(340,70,240,120,'#f3f7fa','none',10)+TF(356,96,'grey: the reading order',13,C.muted,'start')+TF(356,120,'blue: cross-links',13,C.blue,'start')+TF(356,152,'Any chunk can be a starting',13,C.ink,'start')+TF(356,172,'point; links do the rest.',13,C.ink,'start');
  }else{
   for(let i=0;i<8;i++){const x=30+i*68;out+=R(x,200,58,80,'#fffdf6',C.line,4)+TF(x+29,222,'p. '+(i+1),13,C.ink)+range(3).map(r=>R(x+8,232+r*12,42-(r*9)%14,4,'#d6dde2','none',2)).join('')}
   links.forEach(([a,b],k)=>{const xa=59+a*68,xb=59+b*68,h=24+Math.abs(b-a)*14+(k%3)*6;out+=P(`M${xa} 198 C ${xa} ${198-h}, ${xb} ${198-h}, ${xb} 198`,C.coral,1.8)+Ci(xb,198,3,C.coral)});
   out+=TF(300,306,'each arc: a “see page …” note the reader must follow and come back from',13,C.muted);
  }
  out+=TBF(300,352,`${s.n} cross-link${s.n===1?'':'s'}: ${s.n} jump${s.n===1?'':'s'} out of reading order`,15,s.n?C.coral:C.green);
  return {svg:out,phase:s.n===0?'With no cross-links the chunks read perfectly well as a booklet: this is not yet hypertext in Nelson’s sense.':`${s.n} cross-links. On screen each is one press; on paper each becomes a jump the reader must make by hand. Nelson’s 1965 definition was exactly this: material too interconnected to present conveniently on paper.`};
 }});

const T2_PROPS={
 complex:{n:'Complex',paper:'Each item sits in one folder; cross-connections live in the writer’s head or in scribbled notes.',elf:'Any entry can be linked to any other and can sit in several lists at once.'},
 changing:{n:'Changing',paper:'A revision means retyping, and the old version is usually thrown away.',elf:'Entries are revised in place; lists are rearranged without retyping, and earlier states can be kept.'},
 indeterminate:{n:'Indeterminate',paper:'You must commit to one arrangement before you know which is best.',elf:'Alternative arrangements can be kept side by side until the writer decides, or for ever.'}};
SCENE({id:'coining-hypertext-file',name:'The complex, the changing and the indeterminate',tag:'What the 1965 paper set out to solve',
 definition:'Nelson’s 1965 paper was titled “a file structure for the complex, the changing and the indeterminate”. He was designing for writers’ working material: many connections, constant revision, and arrangements not yet decided.',
 example:'A novelist’s notes are complex (characters link to scenes), changing (scenes are rewritten) and indeterminate (the chapter order is still open). Paper handles none of these well.',
 research:'Nelson, T. H. (1965). Complex information processing: a file structure for the complex, the changing and the indeterminate. Proceedings of the ACM 20th National Conference, 84–100.',
 desc:'For the chosen property, a paper filing cabinet on the left and Nelson’s proposed file structure on the right, each with a short description of how it copes.',
 dur:12,hint:'Choose each property in turn and compare what paper does with what Nelson proposed.',
 init:()=>({k:'complex'}),
 watch(p){return {k:['complex','changing','indeterminate'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['complex','Complex'],['changing','Changing'],['indeterminate','Indeterminate']],label:'Property',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v}},
 draw(s){
  const d=T2_PROPS[s.k];let out=heading(`${d.n}: paper against a computer file structure`);
  out+=R(24,48,268,190,'#fffdf6',C.line,10)+TB(40,72,'On paper',15,C.coral,'start');
  out+=R(310,48,268,190,'#fff',C.grid,10)+TB(326,72,'Nelson’s file structure',15,C.blue,'start');
  if(s.k==='complex'){for(let i=0;i<3;i++)out+=R(44+i*82,92,72,110,'#f0e6cf',C.line,4)+TF(80+i*82,218,['Plot','People','Places'][i],13,C.muted);
   const ps=[[350,110],[450,100],[530,140],[380,190],[490,200]];[[0,1],[1,2],[0,3],[3,4],[1,4],[2,4],[0,4]].forEach(([a,b])=>out+=L(ps[a][0],ps[a][1],ps[b][0],ps[b][1],C.blue,1.6));ps.forEach(p=>out+=Ci(p[0],p[1],12,C.pale,C.blue))}
  else if(s.k==='changing'){for(let i=0;i<3;i++)out+=R(54+i*20,96+i*14,150,90,i<2?'#eee':'#fffdf6',C.line,3)+(i<2?L(60+i*20,100+i*14,200+i*20,180+i*14,C.coral,1.5):'');
   for(let i=0;i<3;i++)out+=R(340+i*72,100,62,96,i===2?C.pale:'#fff',C.blue,4)+TF(371+i*72,216,'v'+(i+1),13,C.blue)}
  else{out+=R(70,92,180,120,'#fffdf6',C.line,4)+TF(160,226,'one fixed order',13,C.muted);for(let i=0;i<4;i++)out+=R(130,100+i*27,60,22,'#fff',C.line,4)+TF(160,116+i*27,String.fromCharCode(65+i),13,C.ink);
   const ords=[[0,1,2,3],[2,0,3,1],[0,3,2,1]];for(let k=0;k<3;k++){out+=TF(370+k*76,222,'option '+(k+1),13,C.blue);ords[k].forEach((it,pos)=>out+=R(340+k*76,96+pos*28,60,22,'#fff',C.blue,4)+TF(370+k*76,112+pos*28,String.fromCharCode(65+it),13,C.ink))}}
  const wrap=(t,x,y,col)=>{let line='',out2='',yy=y;for(const w of t.split(' ')){if((line+' '+w).length>36){out2+=TF(x,yy,line.trim(),13,col,'start');yy+=20;line=''}line+=' '+w}return out2+TF(x,yy,line.trim(),13,col,'start')};
  out+=wrap(d.paper,30,272,C.ink)+wrap(d.elf,316,272,C.ink);
  return {svg:out,phase:`${d.n}. Paper: ${d.paper} Nelson’s proposal: ${d.elf}`};
 }});

const T2_WORDS={text:{n:'hypertext',base:'text',d:'Chunks of writing joined by links, read in the order the reader chooses.'},film:{n:'hyperfilm',base:'film',d:'A film made of separate shots that branch, so each viewer can take a different route.'},media:{n:'hypermedia',base:'media',d:'Text, pictures, sound and film joined by links into one browsable whole.'}};
SCENE({id:'coining-hypertext-words',name:'Hyper-',tag:'Extended and generalised',
 definition:'Nelson explained the prefix “hyper-” as meaning extended and generalised, as in the mathematician’s hyperspace (space of more than three dimensions). A hypertext is text extended beyond the single dimension of the page; the same move gives hyperfilm and hypermedia.',
 example:'A hyperfilm about a city could branch at every corner, letting the viewer choose which street to walk down next.',
 research:'Nelson, T. H. (1965). Complex information processing: a file structure for the complex, the changing and the indeterminate. Proceedings of the ACM 20th National Conference, 84–100. Nelson, T. H. (1981). Literary Machines. Mindful Press.',
 desc:'The plain form (a line of text, a strip of film, or separate media) on the left, and its “hyper” form, branching and linked, on the right.',
 dur:12,hint:'Choose a word to compare the plain form with its extended “hyper” form.',
 init:()=>({k:'text'}),
 watch(p){return {k:['text','film','media'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['text','Hypertext'],['film','Hyperfilm'],['media','Hypermedia']],label:'Word',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v}},
 draw(s){
  const d=T2_WORDS[s.k];let out=heading(`${d.base} → ${d.n}`);
  out+=TB(150,70,d.base+': one line',15,C.muted)+TB(450,70,d.n+': many routes',15,C.blue);
  const unit=(x,y,k,col)=>s.k==='text'?R(x-26,y-14,52,28,'#fff',col,4)+range(2).map(r=>R(x-18,y-6+r*9,36-r*10,4,'#cfd8de','none',2)).join(''):s.k==='film'?R(x-26,y-18,52,36,'#2b3d47',col,3)+range(3).map(r=>R(x-22,y-14+r*11,4,6,'#fff','none',1)+R(x+18,y-14+r*11,4,6,'#fff','none',1)).join('')+R(x-14,y-12,28,24,['#9cbad0','#d8b98a','#a8c9b5','#c9a8c4'][k%4],'none',2):[Ci(x,y,16,C.pale,col),R(x-22,y-14,44,28,C.amberp,col,4),P(`M${x-20} ${y} q5 -12 10 0 t10 0 t10 0 t10 0`,col,2),R(x-18,y-18,36,36,C.greenp,col,4)][k%4]+(s.k==='media'?R(x-28,y+21,56,18,'#f3f7fa','none',4)+TF(x,y+34,['text','picture','sound','film'][k%4],13,C.muted):'');
  for(let i=0;i<4;i++){out+=unit(50+i*66,190,i,C.line);if(i)out+=L(50+i*66-40,190,50+i*66-27,190,C.line,2)}
  const pos=[[360,130],[460,110],[540,170],[400,240],[500,270],[350,320]],links=[[0,1],[1,2],[0,3],[3,4],[2,4],[3,5],[1,4]];
  links.forEach(([a,b])=>out+=L(pos[a][0],pos[a][1],pos[b][0],pos[b][1],C.blue,2));
  pos.forEach((p,i)=>out+=unit(p[0],p[1],i,C.blue));
  out+=R(30,290,280,60,'#f3f7fa','none',8)+TF(170,315,d.d.slice(0,d.d.lastIndexOf(' ',42)),13,C.ink)+TF(170,335,d.d.slice(d.d.lastIndexOf(' ',42)+1),13,C.ink);
  return {svg:out,phase:`${d.n[0].toUpperCase()+d.n.slice(1)}: ${d.d} “Hyper” here means extended into more dimensions, not excessive.`};
 }});

/* ---------------- Lesson: Zippered lists (ELF, 1965) ---------------- */
const T2_OUT=['Opening image','The problem','First attempt','Turning point','Resolution'];
const T2_DRAFT=['A grey morning…','Nobody could…','She tried again…','Then the letter…','Weeks later…','In the end…'];
SCENE({id:'zippered-lists',name:'Zippered lists',tag:'Two lists joined like the teeth of a zip',
 definition:'In the 1965 paper Nelson proposed zippered lists: two lists whose entries are joined pairwise by links, like the two sides of a zip. Each list can be reordered or edited and the links still say which entry corresponds to which.',
 example:'An outline on one side and draft paragraphs on the other: move a paragraph and its link to the outline point moves with it.',
 research:'Nelson, T. H. (1965). Complex information processing: a file structure for the complex, the changing and the indeterminate. Proceedings of the ACM 20th National Conference, 84–100 (zippered lists).',
 desc:'An outline list on the left and a draft list on the right, joined by zipper links; the reader selects entries to zip them and moves draft paragraphs up to show that links survive reordering.',
 dur:12,hint:'Press an outline point, then a draft paragraph, to zip them. Select a paragraph and Move up to reorder: the zips follow.',
 init:()=>({order:[0,1,2,3,4,5],zips:[[0,0],[1,1],[3,3]],selL:null,selR:null}),
 watch(p){const k=Math.min(4,Math.floor(p*5));const st=[{order:[0,1,2,3,4,5],zips:[]},{order:[0,1,2,3,4,5],zips:[[0,0],[1,1]]},{order:[0,1,2,3,4,5],zips:[[0,0],[1,1],[2,2],[3,3],[4,5]]},{order:[0,1,3,2,4,5],zips:[[0,0],[1,1],[2,2],[3,3],[4,5]]},{order:[0,3,1,2,5,4],zips:[[0,0],[1,1],[2,2],[3,3],[4,5]]}][k];return {...st,selL:null,selR:null}},
 ui:[{b:'Move selected paragraph up',act:'up'},{b:'Unzip selected',act:'unzip'}],
 on:{L(s,i){s.selL=Number(i);if(s.selR!=null)T2_zip(s)},Rr(s,i){s.selR=Number(i);if(s.selL!=null)T2_zip(s)},
  up(s){if(s.selR==null)return;const k=s.order.indexOf(s.selR);if(k>0){[s.order[k-1],s.order[k]]=[s.order[k],s.order[k-1]]}},
  unzip(s){s.zips=s.zips.filter(([a,b])=>a!==s.selL&&b!==s.selR)}},
 draw(s,f,X){
  let out=heading('Reorder either side: the zips keep their partners');
  const yl=i=>78+i*54,yr=i=>72+s.order.indexOf(i)*46;
  s.zips.forEach(([a,b])=>out+=P(`M220 ${yl(a)+18} C 300 ${yl(a)+18}, 300 ${yr(b)+18}, 370 ${yr(b)+18}`,C.amber,2.5));
  T2_OUT.forEach((t,i)=>{const on=i===s.selL;out+=hit(X,'L',i,`Select outline point ${t}`,R(40,yl(i),180,36,on?C.blue:'#fff',on?C.blue:C.line,6)+TF(130,yl(i)+23,`${i+1}. ${t}`,13,on?'#fff':C.ink))});
  T2_DRAFT.forEach((t,i)=>{const on=i===s.selR,y=yr(i);out+=hit(X,'Rr',i,`Select draft paragraph ${t}`,R(370,y,190,36,on?C.blue:'#fffdf6',on?C.blue:C.line,6)+TF(465,y+23,t,13,on?'#fff':C.ink))});
  out+=TBF(130,64,'Outline',14,C.muted)+TBF(465,64,'Draft',14,C.muted);
  out+=TF(300,368,`${s.zips.length} zipper links`,13,C.amber);
  return {svg:out,phase:`${s.zips.length} outline points are zipped to paragraphs. Reordering the draft moved the boxes, but every zip still joins the same two entries, because a link joins entries, not positions.`};
 }});
function T2_zip(s){s.zips=s.zips.filter(([a,b])=>a!==s.selL&&b!==s.selR);s.zips.push([s.selL,s.selR]);s.selL=null;s.selR=null}

const T2_LISTS=['Chapter 2','Quotations','To check'];
SCENE({id:'zippered-lists-elf',name:'The Evolutionary List File',tag:'Entries, lists and links',
 definition:'Nelson’s ELF (Evolutionary List File) had three parts: entries (units of text or pictures), lists (ordered sequences of entries) and links (connections between entries). An entry could belong to several lists without being copied, so revising it revised it everywhere.',
 example:'A quotation sits in the Chapter 2 list, in a list of quotations and in a “to check” list. Correct a word once and all three show the correction.',
 research:'Nelson, T. H. (1965). Complex information processing: a file structure for the complex, the changing and the indeterminate. Proceedings of the ACM 20th National Conference, 84–100.',
 desc:'One entry shown with three lists; toggles put the entry into or out of each list, and a revise button changes its text everywhere it appears.',
 dur:12,hint:'Add the entry to lists, then revise it. One entry, many places, one edit.',
 init:()=>({inL:[true,true,false],rev:0}),
 watch(p){const k=Math.min(4,Math.floor(p*5));return {inL:[k>0,k>1,k>2],rev:k>3?1:0}},
 ui:[{b:'In Chapter 2',act:'tog',arg:0},{b:'In Quotations',act:'tog',arg:1},{b:'In To check',act:'tog',arg:2},{b:'Revise the entry',act:'rev'}],
 on:{tog(s,i){i=Number(i);s.inL[i]=!s.inL[i]},rev(s){s.rev=(s.rev+1)%3}},
 draw(s){
  const txt=['“The map is not the territory.”','“A map is not the territory.”','“A map is not the territory it represents.”'][s.rev];
  let out=heading('One entry, in as many lists as you like');
  out+=R(150,46,300,52,C.amberp,C.amber,8)+TB(300,68,'The entry (stored once)',13,C.amber)+TF(300,88,txt,13,C.ink);
  T2_LISTS.forEach((nm,j)=>{const x=24+j*192;out+=R(x,128,176,220,'#fff',C.grid,8)+TB(x+88,150,nm,14,C.ink);
   const items=[['Intro note','Example','Summary'],['Bush 1945','Korzybski','Nelson 1965'],['Dates','Spelling','Source']][j];
   let y=166;items.forEach((it,k)=>{if(k===1&&s.inL[j]){out+=R(x+10,y,156,40,C.amberp,C.amber,5)+TF(x+88,y+25,'the entry (same one)',13,C.amber);y+=48}
    out+=R(x+10,y,156,32,'#f6f6f6',C.line,5)+TF(x+88,y+21,it,13,C.muted);y+=40})});
  const n=s.inL.filter(Boolean).length;
  return {svg:out,phase:`The entry appears in ${n} list${n===1?'':'s'} but is stored once${s.rev?', so the revision shows in every one of them':''}. The quotation is usually credited to Alfred Korzybski (1931).`};
 }});

const T2_USES={
 translate:{n:'Translation',L:['Il pleut.','Je reste ici.','Le livre est rouge.'],R:['It is raining.','I am staying here.','The book is red.'],say:'Each sentence is zipped to its translation, so a reader of either can jump to the other.'},
 comment:{n:'Commentary',L:['Line 1 of the poem','Line 2 of the poem','Line 3 of the poem'],R:['Note on the metre','Note on a word','Note on a source'],say:'Notes are zipped to the lines they discuss, without being printed in between.'},
 drafts:{n:'Two drafts',L:['Old opening','Old middle','Old ending'],R:['New opening','Rewritten middle','New ending'],say:'Corresponding paragraphs of two drafts are zipped, so a writer can see what became of each.'}};
SCENE({id:'zippered-lists-uses',name:'What zips are for',tag:'Parallel texts',
 definition:'Zippered lists suit any two texts that correspond part by part: an original and its translation, a text and its commentary, or two drafts of the same work. Nelson returned to this idea for the rest of his career as parallel, side-by-side documents.',
 example:'A bilingual edition with each French sentence joined to its English one, so a reader can switch at any point.',
 research:'Nelson, T. H. (1965). Complex information processing. Proceedings of the ACM 20th National Conference. Nelson, T. H. (1999). Xanalogical structure, needed now more than ever. ACM Computing Surveys 31(4es).',
 desc:'Two columns of corresponding parts joined by zipper links, for a translation, a commentary or two drafts.',
 dur:12,hint:'Choose a use, then press a part on either side to highlight its partner.',
 init:()=>({k:'translate',sel:0}),
 watch(p){const i=Math.min(5,Math.floor(p*6));return {k:['translate','comment','drafts'][Math.floor(i/2)],sel:i%3}},
 ui:[{choose:[['translate','Translation'],['comment','Commentary'],['drafts','Two drafts']],label:'Use',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v;s.sel=0},sel(s,i){s.sel=Number(i)}},
 draw(s,f,X){
  const d=T2_USES[s.k];let out=heading(`${d.n}: two texts, zipped part by part`);
  d.L.forEach((t,i)=>{const y=70+i*80,on=i===s.sel;out+=P(`M230 ${y+22} C 300 ${y+22}, 300 ${y+22}, 370 ${y+22}`,on?C.amber:C.line,on?3:2);
   out+=hit(X,'sel',i,`Select ${t}`,R(40,y,190,44,on?C.amberp:'#fff',on?C.amber:C.line,6)+TF(135,y+27,t,13,C.ink));
   out+=hit(X,'sel',i,`Select ${d.R[i]}`,R(370,y,190,44,on?C.amberp:'#fff',on?C.amber:C.line,6)+TF(465,y+27,d.R[i],13,C.ink))});
  out+=TF(300,340,d.say.slice(0,d.say.lastIndexOf(' ',62)),13,C.muted)+TF(300,360,d.say.slice(d.say.lastIndexOf(' ',62)+1),13,C.muted);
  return {svg:out,phase:`${d.n}: “${d.L[s.sel]}” is zipped to “${d.R[s.sel]}”. ${d.say}`};
 }});

/* ---------------- Lesson: Hypermedia ---------------- */
const T2_FILM={start:{t:'Station',a:'market',b:'river'},market:{t:'Market',a:'church',b:'bridge'},river:{t:'River',a:'bridge',b:'church'},church:{t:'Church',a:'end',b:'end'},bridge:{t:'Bridge',a:'end',b:'end'},end:{t:'Square',a:null,b:null}};
const T2_FPOS={start:[60,200],market:[190,120],river:[190,280],church:[330,90],bridge:[330,300],end:[480,200]};
SCENE({id:'hypermedia',name:'Hyperfilm',tag:'A film that branches',
 definition:'Nelson extended the idea of hypertext to film: a hyperfilm is made of separate shots joined at branch points, and the viewer chooses which shot comes next. Hypermedia generalises this to any mix of text, pictures, sound and film.',
 example:'A walking tour of a town filmed as short shots: at each corner the viewer picks left or right, and no two viewings need be the same.',
 research:'Nelson, T. H. (1965). Complex information processing. Proceedings of the ACM 20th National Conference, 84–100 (hyperfilm). Lippman, A. (1980). Movie-maps: an application of the optical videodisc to computer graphics. SIGGRAPH ’80.',
 desc:'A map of six filmed shots joined by branch points, the viewer’s route drawn in colour, and the current shot shown as a film frame.',
 dur:12,hint:'At each branch choose which shot to watch next. Press Reset to try another route.',
 init:()=>({path:['start']}),
 watch(p){const r=['start','market','bridge','end'];return {path:r.slice(0,1+Math.min(3,Math.floor(p*4)))}},
 ui:[{b:'Take the first branch',act:'go',arg:'a'},{b:'Take the second branch',act:'go',arg:'b'}],
 on:{go(s,w){const c=T2_FILM[s.path[s.path.length-1]],n=c[w];if(n)s.path.push(n)},reset(s){s.path=['start']},jump(s,id){const c=T2_FILM[s.path[s.path.length-1]];if(c.a===id||c.b===id)s.path.push(id)}},
 draw(s,f,X){
  const cur=s.path[s.path.length-1],c=T2_FILM[cur];let out=heading('Every viewer chooses the next shot');
  for(const [id,n] of Object.entries(T2_FILM))for(const w of ['a','b'])if(n[w]&&!(w==='b'&&n.b===n.a))out+=arrowR(T2_FPOS[id],T2_FPOS[n[w]],46,50,C.line,1.8);
  for(let i=1;i<s.path.length;i++)out+=arrowR(T2_FPOS[s.path[i-1]],T2_FPOS[s.path[i]],46,50,C.coral,3);
  for(const [id,n] of Object.entries(T2_FILM)){const p=T2_FPOS[id],on=id===cur,next=c.a===id||c.b===id;
   out+=hit(X,'jump',id,`Watch the ${n.t} shot next`,R(p[0]-42,p[1]-24,84,48,on?'#2b3d47':next?C.pale:'#fff',on?'#2b3d47':next?C.blue:C.line,5)+TF(p[0],p[1]+5,n.t,13,on?'#fff':C.ink))}
  out+=R(400,46,180,56,'#2b3d47','none',6)+range(5).map(i=>R(408+i*34,52,8,6,'#fff','none',1)+R(408+i*34,90,8,6,'#fff','none',1)).join('')+TB(490,80,c.t,14,'#fff');
  out+=TF(300,360,`route: ${s.path.map(id=>T2_FILM[id].t).join(' → ')}`,13,C.coral);
  return {svg:out,phase:cur==='end'?`You reached the square by your own route (${s.path.length-1} cuts). This town film has 4 different routes from station to square; a conventional film has one.`:c.a===c.b?`Now showing: ${c.t}. Next: ${T2_FILM[c.a].t}.`:`Now showing: ${c.t}. Next: ${T2_FILM[c.a].t} or ${T2_FILM[c.b].t}.`};
 }});

SCENE({id:'hypermedia-branching',name:'Lines, trees and networks',tag:'Counting the paths',
 definition:'A linear work has one path. A branching tree with k choices at each of d branch points has k to the power d endings. A network that can rejoin and loop has as many paths as the reader has patience. Hypermedia designs choose among these shapes.',
 example:'Three choices at each of four branch points give 3⁴ = 81 different endings, which is why branching stories often rejoin to keep the writing manageable.',
 research:'Nelson, T. H. (1974). Computer Lib/Dream Machines. Bernstein, M. (1998). Patterns of hypertext. Proceedings of ACM Hypertext ’98, 21–29.',
 desc:'The chosen structure drawn as nodes and arrows, with the number of distinct paths and the number of pieces the author must write.',
 dur:12,hint:'Choose a structure and set the number of choices and branch points. Compare the number of paths with the amount of writing.',
 init:()=>({k:'tree',c:2,d:3}),
 watch(p){const i=Math.min(5,Math.floor(p*6));return [{k:'line',c:2,d:3},{k:'tree',c:2,d:2},{k:'tree',c:2,d:3},{k:'tree',c:3,d:3},{k:'net',c:2,d:3},{k:'net',c:3,d:3}][i]},
 ui:[{choose:[['line','Line'],['tree','Tree'],['net','Rejoining network']],label:'Structure',get:s=>s.k,act:'k'},{range:'c',label:'Choices',min:2,max:3,step:1,get:s=>s.c,act:'c',show:v=>v},{range:'d',label:'Branch points',min:1,max:4,step:1,get:s=>s.d,act:'d',show:v=>v}],
 on:{k(s,v){s.k=v},c(s,v){s.c=Number(v)},d(s,v){s.d=Number(v)}},
 draw(s){
  const {c,d}=s;let out=heading(s.k==='line'?'A line: one path':s.k==='tree'?'A tree: paths multiply':'A network: branches rejoin');let paths,pieces;
  if(s.k==='line'){for(let i=0;i<=d;i++){const x=60+i*(400/Math.max(1,d));out+=(i?arrow(x-400/Math.max(1,d)+18,190,x-18,190,C.blue,2):'')+Ci(x,190,14,C.pale,C.blue)}paths=1;pieces=d+1}
  else if(s.k==='tree'){const layers=[];for(let l=0;l<=d;l++){const n=Math.pow(c,l);layers.push(range(n).map(i=>[60+l*(440/d),56+(i+.5)*(262/n)]))}
   for(let l=1;l<=d;l++)layers[l].forEach((p,i)=>{const q=layers[l-1][Math.floor(i/c)];out+=L(q[0],q[1],p[0],p[1],C.line,1.2)});
   layers.forEach(ly=>ly.forEach(p=>out+=Ci(p[0],p[1],Math.max(2,Math.min(10,120/ly.length)),C.pale,C.blue)));paths=Math.pow(c,d);pieces=layers.reduce((a,l)=>a+l.length,0)}
  else{const cols=range(d+1).map(l=>range(l===0||l===d?1:c).map(i=>[60+l*(440/d),190+(i-(l===0||l===d?0:(c-1)/2))*80]));
   for(let l=1;l<=d;l++)cols[l].forEach(p=>cols[l-1].forEach(q=>out+=L(q[0],q[1],p[0],p[1],C.line,1.2)));
   cols.forEach(cl=>cl.forEach(p=>out+=Ci(p[0],p[1],12,C.pale,C.blue)));paths=Math.pow(c,Math.max(0,d-1));pieces=cols.reduce((a,l)=>a+l.length,0)}
  out+=R(150,330,300,40,'#f3f7fa','none',8)+TF(300,355,`${paths.toLocaleString('en-GB')} path${paths===1?'':'s'} · ${pieces} pieces to write`,14,C.ink);
  return {svg:out,phase:`${s.k==='line'?'A line with no choices':s.k==='tree'?`A tree with ${c} choices at each of ${d} branch point${d===1?'':'s'}`:`A rejoining network ${d} step${d===1?'':'s'} long, with ${c} choices at ${Math.max(0,d-1)} of them`}: ${paths} distinct path${paths===1?'':'s'} for ${pieces} pieces of writing. ${s.k==='tree'?'Trees multiply the writing as fast as the paths.':s.k==='net'?'Rejoining keeps the writing small while the paths still multiply.':'The author writes everything once and every reader sees the same.'}`};
 }});

const T2_LATER=[
 {y:1968,n:'Engelbart’s demo',d:'Linked text, outlines and live video of a remote colleague, shown to an audience in San Francisco.'},
 {y:1978,n:'Aspen Movie Map',d:'MIT’s videodisc tour of Aspen: choose a turn at each junction and the film follows. A real hyperfilm.'},
 {y:1987,n:'HyperCard',d:'Bill Atkinson’s card-and-button authoring tool, which put branching media in ordinary users’ hands.'},
 {y:1991,n:'World Wide Web',d:'Tim Berners-Lee’s linked pages, open to anyone; images followed in 1993 and video later.'},
 {y:2000,n:'Branching video',d:'From the 2000s, interactive video on the web let viewers choose what happens next.'}];
SCENE({id:'hypermedia-later',name:'Hypermedia realised',tag:'1968–2000s',
 definition:'Hypermedia remained mostly an idea in 1965 because computers could not yet show pictures or film on demand. Over the next decades it arrived piece by piece, usually in simpler forms than Nelson had imagined.',
 example:'The 1978 Aspen Movie Map was a working hyperfilm: viewers drove through the town by choosing turns, with each junction filmed in every direction.',
 research:'Engelbart, D. C. & English, W. K. (1968). A research center for augmenting human intellect. AFIPS Fall Joint Computer Conference. Lippman, A. (1980). Movie-maps. SIGGRAPH ’80. Berners-Lee, T. (1989). Information management: a proposal. CERN.',
 desc:'A timeline from 1965 to the 2000s with five milestones; pressing one shows what part of the hypermedia idea it made real.',
 dur:12,hint:'Press a milestone on the timeline to see what it realised.',
 init:()=>({k:1}),
 watch(p){return {k:Math.min(4,Math.floor(p*5))}},
 on:{k(s,v){s.k=Number(v)}},
 draw(s,f,X){
  let out=heading('The 1965 idea, realised piece by piece');const x=y=>40+(y-1965)*520/40;
  out+=L(40,140,560,140,C.line,3)+Ci(40,140,8,C.blue)+TF(40,170,'1965',13,C.blue)+TF(40,120,'the word',13,C.blue);
  T2_LATER.forEach((m,i)=>{const on=i===s.k,xx=x(m.y);out+=hit(X,'k',i,`About ${m.n}`,Ci(xx,140,on?13:10,on?C.coral:'#fff',C.coral)+TF(xx,i%2?110:180,String(m.y),13,on?C.coral:C.ink)+TF(xx,i%2?92:198,m.n,13,on?C.coral:C.muted))});
  const m=T2_LATER[s.k];out+=R(60,228,480,110,'#fff',C.grid,10)+TB(80,256,`${m.y} · ${m.n}`,15,C.ink,'start');
  let line='',ly=284;for(const w of m.d.split(' ')){if((line+' '+w).length>62){out+=TF(80,ly,line.trim(),13,C.ink,'start');ly+=20;line=''}line+=' '+w}out+=TF(80,ly,line.trim(),13,C.ink,'start');
  return {svg:out,phase:`${m.y}, ${m.n}: ${m.d}`};
 }});

/* ---------------- Lesson: Version history ---------------- */
const T2_VERS=['the cat sat on the mat','the black cat sat on the mat','the black cat lay on the old mat','a black cat lay on the old mat by the door'];
function T2_lcs(a,b){const n=a.length,m=b.length,t=Array.from({length:n+1},()=>Array(m+1).fill(0));for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)t[i][j]=a[i]===b[j]?t[i+1][j+1]+1:Math.max(t[i+1][j],t[i][j+1]);const pairs=[];let i=0,j=0;while(i<n&&j<m){if(a[i]===b[j]){pairs.push([i,j]);i++;j++}else if(t[i+1][j]>=t[i][j+1])i++;else j++}return pairs}
SCENE({id:'version-history',name:'Version history',tag:'Keep every draft, and show what changed',
 definition:'Nelson wanted a writer’s system to keep every earlier version and let any two be compared side by side, with the unchanged parts visibly connected. Paper drafts were thrown away; he wanted the history of a text to be part of the text.',
 example:'Comparing draft 1 with draft 4 shows at a glance that “cat”, “on” and “mat” survived, “sat” became “lay”, and “by the door” was added.',
 research:'Nelson, T. H. (1965). Complex information processing. Proceedings of the ACM 20th National Conference, 84–100. Hunt, J. W. & McIlroy, M. D. (1976). An algorithm for differential file comparison. Bell Labs CSTR 41.',
 desc:'Two chosen versions of a sentence shown word by word, one above the other, with lines joining the words they share; changed words are highlighted.',
 dur:12,hint:'Choose any two versions to compare. Shared words are joined; removed words are red, added words green.',
 init:()=>({a:0,b:3}),
 watch(p){const pr=[[0,1],[1,2],[2,3],[0,3]][Math.min(3,Math.floor(p*4))];return {a:pr[0],b:pr[1]}},
 ui:[{range:'a',label:'Earlier version',min:0,max:3,step:1,get:s=>s.a,act:'a',show:v=>'v'+(Number(v)+1)},{range:'b',label:'Later version',min:0,max:3,step:1,get:s=>s.b,act:'b',show:v=>'v'+(Number(v)+1)}],
 on:{a(s,v){s.a=Number(v)},b(s,v){s.b=Number(v)}},
 draw(s){
  const A=T2_VERS[s.a].split(' '),B=T2_VERS[s.b].split(' '),pairs=T2_lcs(A,B),ka=new Set(pairs.map(p=>p[0])),kb=new Set(pairs.map(p=>p[1]));
  let out=heading(`Comparing version ${s.a+1} with version ${s.b+1}`);
  const sp=n=>Math.min(60,540/n),xs=(n,i)=>300+(i-(n-1)/2)*sp(n);
  pairs.forEach(([i,j])=>out+=L(xs(A.length,i),126,xs(B.length,j),224,C.blue,1.8,'opacity=".7"'));
  A.forEach((w,i)=>out+=R(xs(A.length,i)-sp(A.length)/2+2,92,sp(A.length)-4,30,ka.has(i)?'#fff':C.coralp,ka.has(i)?C.line:C.coral,5)+TF(xs(A.length,i),112,w,13,C.ink));
  B.forEach((w,j)=>out+=R(xs(B.length,j)-sp(B.length)/2+2,226,sp(B.length)-4,30,kb.has(j)?'#fff':C.greenp,kb.has(j)?C.line:C.green,5)+TF(xs(B.length,j),246,w,13,C.ink));
  out+=TB(40,82,'v'+(s.a+1),14,C.muted,'start')+TB(40,284,'v'+(s.b+1),14,C.muted,'start');
  for(let v=0;v<4;v++)out+=R(150+v*80,310,64,40,v===s.a||v===s.b?C.pale:'#fff',v===s.a||v===s.b?C.blue:C.line,5)+TF(182+v*80,335,'v'+(v+1),13,C.ink);
  out+=TF(500,335,'all kept',13,C.muted);
  const rem=A.length-pairs.length,add=B.length-pairs.length;
  return {svg:out,phase:`${pairs.length} words shared, ${rem} removed, ${add} added. Every version is kept, so any two can be compared; this is the side-by-side comparison Nelson wanted for writers from 1960 onwards.`};
 }});

SCENE({id:'version-history-storage',name:'Storing every version',tag:'Full copies or changes only',
 definition:'Keeping every version sounds expensive. But if each version is stored as the changes from the one before (a delta), the cost grows with the size of the edits, not with the size of the document. Nelson’s designs and today’s version-control systems both rely on this.',
 example:'Fifty versions of a 100 KB document, each changing 2%, take 5,000 KB as full copies but about 200 KB as one copy plus changes.',
 research:'Nelson, T. H. (1965). Complex information processing. Proceedings of the ACM 20th National Conference. Rochkind, M. J. (1975). The Source Code Control System. IEEE Transactions on Software Engineering SE-1(4), 364–370.',
 desc:'Bars comparing the storage needed for full copies of every version with one full copy plus the changes, for a 100 KB document.',
 dur:10,hint:'Change the number of versions and the size of each edit. Full copies grow with the document; deltas grow with the edits.',
 init:()=>({n:20,e:5}),
 watch(p){return {n:[1,5,20,50,50][Math.min(4,Math.floor(p*5))],e:p>.8?20:5}},
 ui:[{range:'n',label:'Versions',min:1,max:50,step:1,get:s=>s.n,act:'n',show:v=>v},{range:'e',label:'Each edit changes',min:1,max:50,step:1,get:s=>s.e,act:'e',show:v=>v+'%'}],
 on:{n(s,v){s.n=Number(v)},e(s,v){s.e=Number(v)}},
 draw(s){
  const full=s.n*100,delta=100+(s.n-1)*s.e;const W=370,sc=W/5000;
  let out=heading('Every version kept: full copies against changes only');
  out+=TF(30,112,'Full copies',14,C.ink,'start')+R(170,92,Math.max(2,full*sc),30,C.coral,'none',4)+TF(176+full*sc,112,full.toLocaleString('en-GB')+' KB',13,C.coral,'start');
  out+=TF(30,172,'Copy + deltas',14,C.ink,'start')+R(170,152,Math.max(2,delta*sc),30,C.green,'none',4)+TF(176+delta*sc,172,delta.toLocaleString('en-GB')+' KB',13,C.green,'start');
  for(let k=0;k<=5000;k+=1000)out+=L(170+k*sc,196,170+k*sc,204,C.muted,1.5)+TF(170+k*sc,222,k/1000+' MB',13,C.muted);
  out+=R(40,250,520,90,'#f3f7fa','none',8);
  for(let v=0;v<Math.min(s.n,20);v++){const x=56+v*24;out+=R(x,266,18,v?Math.max(3,s.e*.5):50,v?C.green:C.blue,'none',2)}
  out+=TF(300,334,s.n>20?`first 20 of ${s.n} versions: one full copy, then the changes`:'one full copy, then the changes',13,C.muted);
  return {svg:out,phase:`${s.n} versions of a 100 KB document, each edit changing ${s.e}%: ${full.toLocaleString('en-GB')} KB as full copies, ${delta.toLocaleString('en-GB')} KB as one copy plus deltas, ${(full/delta).toFixed(1)} times less.`};
 }});

const T2_UNDO_SEQ=['type:A','type:B','undo','type:C','undo','type:D'];
function T2_run(seq){const tree={id:0,label:'start',kids:[]},nodes=[tree],stack=['start'],redo=[];let cur=tree,lost=[];
 for(const a of seq){if(a==='undo'){if(stack.length>1)redo.push(stack.pop());const par=nodes.find(n=>n.kids.includes(cur));if(par)cur=par}
  else{const t=a.split(':')[1];lost=lost.concat(redo);redo.length=0;stack.push(t);const n={id:nodes.length,label:t,kids:[]};cur.kids.push(n);nodes.push(n);cur=n}}
 return {stack,lost,tree,cur,nodes}}
SCENE({id:'version-history-undo',name:'Undo or a history tree',tag:'Going back without losing anything',
 definition:'A simple undo stack forgets: undo a change, make a new one, and the undone change is gone for good. Nelson argued for keeping the whole history, so that every state a writer ever reached could be revisited. That history is a tree, not a line.',
 example:'Type “B”, undo it, type “C”: an undo stack has lost “B”; a history tree keeps “B” as a branch you can return to.',
 research:'Nelson, T. H. (1965). Complex information processing. Proceedings of the ACM 20th National Conference, 84–100. Vitter, J. S. (1984). US&R: a new framework for redoing. IEEE Software 1(4), 39–52.',
 desc:'The same sequence of edits shown two ways: an undo stack on the left, with lost states listed, and a branching history tree on the right with the current state marked.',
 dur:12,hint:'Type, undo and type again. The stack throws away what you undid; the tree keeps every branch.',
 init:()=>({seq:['type:A','type:B','undo','type:C']}),
 watch(p){return {seq:T2_UNDO_SEQ.slice(0,Math.min(6,Math.floor(p*7)))}},
 ui:[{b:'Type an edit',act:'type'},{b:'Undo',act:'undo'},{b:'Start again',act:'reset'}],
 on:{type(s){const used=s.seq.filter(a=>a.startsWith('type')).length;if(used<8)s.seq.push('type:'+String.fromCharCode(65+used))},undo(s){s.seq.push('undo')},reset(s){s.seq=[]}},
 draw(s){
  const r=T2_run(s.seq);let out=heading('The same edits: an undo stack forgets, a history tree keeps');
  out+=R(20,46,230,300,'#fff',C.grid,10)+TB(36,70,'Undo stack',15,C.ink,'start');
  r.stack.forEach((t,i)=>{const y=310-i*36;out+=R(50,y,120,30,i===r.stack.length-1?C.pale:'#f6f6f6',i===r.stack.length-1?C.blue:C.line,5)+TF(110,y+20,t,13,C.ink)});
  out+=TF(36,92,r.lost.length?'lost for good: '+r.lost.join(', '):'nothing lost yet',13,r.lost.length?C.coral:C.muted,'start');
  out+=R(270,46,310,300,'#fff',C.grid,10)+TB(286,70,'History tree',15,C.ink,'start');
  const place=(n,x,y,w)=>{const pos=[[n,x,y]];const k=n.kids.length;n.kids.forEach((c,i)=>{const cx=x+(i-(k-1)/2)*Math.max(44,w/Math.max(1,k));pos.push(...place(c,cx,y+46,w/Math.max(1,k)))});return pos};
  const pl=place(r.tree,425,98,260),pm=new Map(pl.map(([n,x,y])=>[n,[x,y]]));
  pl.forEach(([n,x,y])=>n.kids.forEach(c=>{const q=pm.get(c);out+=L(x,y+12,q[0],q[1]-12,C.line,2)}));
  pl.forEach(([n,x,y])=>{const on=n===r.cur;out+=R(x-22,y-12,44,24,on?C.blue:'#fff',on?C.blue:C.green,5)+TF(x,y+5,n.label==='start'?'start':n.label,13,on?'#fff':C.ink)});
  return {svg:out,phase:r.lost.length?`The stack has lost ${r.lost.join(', ')}: undone and then overwritten. The tree still holds every state, ${r.nodes.length} in all, and you can return to any of them.`:`${r.nodes.length} states so far. Undo, then type something new, to see the difference.`};
 }});
