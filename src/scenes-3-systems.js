/* ===================== Ted Nelson era 3 · The first systems (1967–1974) ===================== */
// HES and FRESS at Brown, Engelbart's NLS demo, and stretchtext. Try it builds each structure.

// Wrap a string into lines of at most n characters (word boundaries).
function T3_wrap(str,n){const out=[];let line='';for(const w of String(str).split(' ')){if(line&&(line+' '+w).length>n){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out}
// A text line made of coloured runs: runs = [[text, fill, bold]].
function T3_runs(x,y,runs,size=16,anchor='start'){
 const all=runs.map(r=>r[0]).join('');
 return `<text x="${fmt(x)}" y="${fmt(y)}" font-size="${textSize(size,all,x,anchor)}" text-anchor="${anchor}">`+runs.map(([t,fill,b])=>`<tspan fill="${fill||C.ink}"${b?' font-weight="700"':''}>${esc(t)}</tspan>`).join('')+'</text>';
}

/* ---------------- Lesson: HES at Brown (1967) ---------------- */
const T3_AREAS={
 A:{t:'Welcome',lines:['HES keeps text in areas','of any length, joined by','branches you can follow.'],br:['B','C'],pos:[400,104]},
 B:{t:'Editing',lines:['Point with the light pen','to insert, delete or move','text anywhere in an area.'],br:['D'],pos:[530,104]},
 C:{t:'Branches',lines:['A branch is a jump from','one point in the text','to another area.'],br:['D','A'],pos:[400,234]},
 D:{t:'Printing',lines:['The same text can be','printed out as a linear','document on paper.'],br:['A'],pos:[530,234]}};
const T3_WALK=['A','C','D','A','B','D'];
SCENE({id:'hes-brown',name:'The Hypertext Editing System',tag:'Brown University, 1967',
 definition:'HES, built at Brown in 1967 by Andries van Dam’s group with Ted Nelson, stored text in “areas” of any length joined by branches. You read and edited it on a display screen, pointing with a light pen.',
 example:'Instead of pages, a manual became a set of areas. From “Welcome” you could branch to “Editing” or to “Branches”, and insert a sentence anywhere without retyping the rest.',
 research:'Carmody, S., Gross, W., Nelson, T. H., Rice, D. & van Dam, A. (1969). A hypertext editing system for the /360. In Faiman & Nievergelt (eds), Pertinent Concepts in Computer Graphics. University of Illinois Press.',
 desc:'A green-on-black display showing the current text area with its branches, beside a map of four areas and the reader’s path between them.',
 dur:12,hint:'Press a branch on the screen to follow it. Insert a line to see that areas have no fixed length; Back retraces your path.',
 init:()=>({cur:'A',path:['A'],ins:{}}),
 watch(p){const k=Math.min(T3_WALK.length-1,Math.floor(p*T3_WALK.length));return {cur:T3_WALK[k],path:T3_WALK.slice(0,k+1),ins:p>.55?{B:1}:{}}},
 ui:[{b:'Insert a line here',act:'ins'},{b:'◀ Back',act:'back'}],
 on:{go(s,id){s.cur=id;s.path.push(id);if(s.path.length>12)s.path.shift()},
  back(s){if(s.path.length>1){s.path.pop();s.cur=s.path[s.path.length-1]}},
  ins(s){s.ins[s.cur]=Math.min(2,(s.ins[s.cur]||0)+1)},
  reset(s){s.cur='A';s.path=['A'];s.ins={}}},
 draw(s,f,X){
  const a=T3_AREAS[s.cur];let out=heading('HES: text areas joined by branches');
  out+=R(20,48,310,262,'#0f2a20','#0a1c15',10)+TMF(36,76,'AREA '+s.cur+' · '+a.t.toUpperCase(),14,'#7fd0a0','start');
  const lines=a.lines.concat(range(s.ins[s.cur]||0).map(i=>i?'…and here, another.':'A line inserted here.'));
  lines.forEach((l,i)=>out+=TMF(36,108+i*24,l,14,i>=a.lines.length?'#ffd27a':'#d8f3e3','start'));
  a.br.forEach((id,i)=>{const x=36+i*144;out+=hit(X,'go',id,'Follow the branch to '+T3_AREAS[id].t,R(x,252,134,40,'#1d4a37','#7fd0a0',6)+TMF(x+67,277,'→ '+T3_AREAS[id].t,14,'#d8f3e3'))});
  out+=TF(175,334,'the light pen: here, your pointer',13,C.muted);
  for(const [id,p] of Object.entries(T3_AREAS))for(const to of p.br)out+=arrowR(p.pos,T3_AREAS[to].pos,32,36,'#d5e0e7',1.5);
  for(let i=1;i<s.path.length;i++)out+=arrowR(T3_AREAS[s.path[i-1]].pos,T3_AREAS[s.path[i]].pos,32,36,C.coral,2.5);
  for(const [id,p] of Object.entries(T3_AREAS)){const on=id===s.cur;out+=Ci(p.pos[0],p.pos[1],32,on?C.blue:s.path.includes(id)?C.pale:'#fff',on?C.blue:C.line)+TF(p.pos[0],p.pos[1]+5,p.t,13,on?'#fff':C.ink)}
  out+=TF(465,300,'map of areas and branches',13,C.muted)+TF(465,320,'coral: your path',13,C.coral);
  const n=lines.length;
  return {svg:out,phase:`Area “${a.t}”, ${n} line${n===1?'':'s'} long${s.ins[s.cur]?' after your insertion: nothing else had to move':''}. Path: ${s.path.join(' → ')}. Text was no longer locked to the page, which was the idea Nelson brought to the project.`};
 }});

SCENE({id:'hes-brown-print',name:'From screen to paper',tag:'Branches become page references',
 definition:'HES could print its areas as an ordinary document. When the network of areas is flattened into pages, every branch has to become a reference such as “see p. 3”, and a branch to an area left out has nowhere to point.',
 example:'Choose an order for the four areas and watch the printed pages renumber their cross-references. The screen version needs no order at all.',
 research:['van Dam, A. (1988). Hypertext ’87 keynote address. Communications of the ACM 31(7), 887–895: his account of HES, including its later use by IBM customers for documentation.','Carmody, S. et al. (1969). A hypertext editing system for the /360.'],
 desc:'Left: the four areas as a network with numbered badges for print order. Right: up to four printed pages, each with its text and its branches rewritten as page references.',
 dur:10,hint:'Press areas on the left in the order you want them printed. Branches to areas you have not printed say “not printed”.',
 init:()=>({order:['A','C','B','D']}),
 watch(p){return {order:['A','C','B','D'].slice(0,Math.min(4,Math.floor(p*5)))}},
 ui:[{b:'Clear the print order',act:'clear'},{b:'Default order',act:'def'}],
 on:{add(s,id){if(!s.order.includes(id)&&s.order.length<4)s.order.push(id)},clear(s){s.order=[]},def(s){s.order=['A','C','B','D']}},
 draw(s,f,X){
  let out=heading('Printing flattens a network into a line of pages');
  const pos={A:[90,110],B:[230,110],C:[90,240],D:[230,240]};
  for(const [id,p] of Object.entries(T3_AREAS))for(const to of p.br)out+=arrowR(pos[id],pos[to],34,38,'#c9d6df',1.5);
  for(const id of Object.keys(T3_AREAS)){const p=pos[id],k=s.order.indexOf(id);out+=hit(X,'add',id,'Print '+T3_AREAS[id].t+' next',Ci(p[0],p[1],34,k>=0?C.pale:'#fff',k>=0?C.blue:C.line)+TF(p[0],p[1]+5,T3_AREAS[id].t,13,C.ink));
   if(k>=0)out+=Ci(p[0]+26,p[1]-26,13,C.blue)+TBF(p[0]+26,p[1]-21,'p'+(k+1),13,'#fff')}
  out+=TF(160,318,'screen: a network, no order',13,C.muted);
  const short={A:['Text lives in','areas, joined','by branches.'],B:['Point with the','pen to edit','anywhere.'],C:['A branch jumps','from one point','to another.'],D:['Areas can be','printed as one','document.']};
  range(4).forEach(i=>{const x=330+(i%2)*128,y=50+Math.floor(i/2)*140,id=s.order[i];
   out+=R(x,y,120,132,id?'#fff':'#f6f8f9',id?C.line:C.grid,4,id?'':'stroke-dasharray="5 4"')+TF(x+112,y+126,'p. '+(i+1),13,C.muted,'end');
   if(!id){out+=TF(x+60,y+70,'blank',13,'#9aa9b2');return}
   out+=TBF(x+8,y+20,T3_AREAS[id].t,14,C.ink,'start');short[id].forEach((l,j)=>out+=TF(x+8,y+40+j*16,l,13,C.ink,'start'));
   T3_AREAS[id].br.forEach((b,j)=>{const k=s.order.indexOf(b);out+=TF(x+8,y+96+j*16,k>=0?`→ see p. ${k+1}`:'→ not printed',13,k>=0?C.blue:C.coral,'start')})});
  const missing=Object.keys(T3_AREAS).filter(id=>!s.order.includes(id));
  return {svg:out,phase:s.order.length?`Printed order: ${s.order.map(id=>T3_AREAS[id].t).join(', ')}.${missing.length?' Branches to '+missing.map(id=>T3_AREAS[id].t).join(' and ')+' now lead nowhere on paper.':' Every branch became a page number: the reader must turn pages to follow it.'} HES’s users valued printing highly; Nelson wanted the screen to be the real document.`:'Nothing printed yet. On screen the areas need no order; paper forces one.'};
 }});

const T3_GOALS=[
 {f:'Text of any length, not fixed pages',hes:1,nel:1},
 {f:'Links you follow on the screen',hes:1,nel:1},
 {f:'Printing finished documents',hes:1,nel:0},
 {f:'Every earlier version kept',hes:0,nel:1},
 {f:'Two documents side by side, connected',hes:0,nel:1}];
SCENE({id:'hes-brown-goals',name:'What HES did, and what Nelson wanted',tag:'Two visions in one project',
 definition:'HES delivered branching text and on-screen editing, and its users prized its printing. Nelson’s wider aims (keeping every version, and showing connected documents side by side) were left for later, and he left the project.',
 example:'Guess for each feature whether HES had it, then reveal. The two columns differ exactly where Xanadu later began.',
 research:['Barnet, B. (2013). Memory Machines: The Evolution of Hypertext. Anthem Press, chapter on HES and FRESS (interviews with van Dam and Nelson).','Nelson, T. H. (2010). Possiplex. Mindful Press (his own account).'],
 desc:'A table of five features with two columns, HES in 1967 and Nelson’s aim, revealed one row at a time as ticks and crosses.',
 dur:10,hint:'Press a feature to reveal whether HES had it and whether it was part of Nelson’s aim.',
 init:()=>({shown:[]}),
 watch(p){return {shown:range(Math.min(5,Math.floor(p*6)))}},
 ui:[{b:'Reveal all',act:'all'},{b:'Hide all',act:'none'}],
 on:{show(s,i){i=Number(i);if(!s.shown.includes(i))s.shown.push(i)},all(s){s.shown=range(5)},none(s){s.shown=[]}},
 draw(s,f,X){
  let out=heading('HES in 1967 against Nelson’s aim');
  out+=TBF(400,68,'HES (1967)',14,C.blue)+TBF(510,68,'Nelson’s aim',14,C.green);
  T3_GOALS.forEach((g,i)=>{const y=84+i*50,on=s.shown.includes(i);
   out+=hit(X,'show',i,'Reveal: '+g.f,R(20,y,320,42,on?'#fff':C.pale,on?C.grid:C.blue,8)+TF(34,y+26,g.f,14,C.ink,'start'));
   const mark=(v,x,col)=>on?(v?TBF(x,y+28,'✓',22,col):col===C.green?TBF(x,y+28,'–',22,C.muted):TBF(x,y+28,'✗',22,C.coral)):TF(x,y+26,'?',16,'#9aa9b2');
   out+=R(352,y,96,42,'#f3f7fa','none',8)+mark(g.hes,400,C.blue)+R(462,y,96,42,'#f3f7fa','none',8)+mark(g.nel,510,C.green)});
  out+=TF(300,350,'– means not the point for Nelson, rather than opposed',13,C.muted);
  const both=s.shown.filter(i=>T3_GOALS[i].hes!==T3_GOALS[i].nel).length;
  return {svg:out,phase:s.shown.length<5?`${s.shown.length} of 5 revealed. Accounts differ in emphasis: van Dam remembers a practical editor that people used; Nelson remembers his ideas being reduced to paper production.`:`The columns differ on ${both} features. Keeping versions and showing connected documents side by side became the core of Xanadu.`};
 }});

/* ---------------- Lesson: Engelbart's demo (1968) ---------------- */
const T3_LIST=[['1','Produce'],['1a','Apples'],['1b','Bananas'],['1c','Soup vegetables'],['1c1','Carrots'],['1c2','Onions'],['2','Bakery'],['2a','Bread'],['2b','Cake for Saturday'],['3','Pharmacy'],['3a','Toothpaste'],['4','Plan the route home']];
const T3_lvl=id=>id.replace(/([a-z]+|\d+)/g,'#').length;
SCENE({id:'nls-demo',name:'Engelbart’s demo',tag:'NLS, San Francisco, December 1968',
 definition:'In a 90-minute demonstration in 1968, Douglas Engelbart’s team showed NLS: a mouse, a keyset, structured text that could be viewed at any depth, links, and two people working on one screen from different places.',
 example:'On stage Engelbart built a shopping list, sorted it into categories, and collapsed it to show only the headings. Choosing what to see, rather than scrolling past it, was NLS’s “view control”.',
 research:'Engelbart, D. C. & English, W. K. (1968). A research center for augmenting human intellect. AFIPS Fall Joint Computer Conference 33, 395–410.',
 desc:'A numbered outline of a shopping list (1, 1a, 1c1 …) shown to a chosen depth, with folded statements marked, beside a panel describing the current view.',
 dur:10,hint:'Change the depth to show more or fewer levels. Press a statement to fold or unfold what is under it.',
 init:()=>({depth:3,nums:'on',fold:[]}),
 watch(p){return {depth:1+Math.min(2,Math.floor(p*3)),nums:'on',fold:[]}},
 ui:[{range:'depth',label:'Levels shown',min:1,max:3,get:s=>s.depth,act:'depth'},{choose:[['on','Numbers on'],['off','Numbers off']],label:'Statement numbers',get:s=>s.nums,act:'nums'},{b:'Unfold all',act:'unfold'}],
 on:{depth(s,v){s.depth=Number(v)},nums(s,v){s.nums=v},fold(s,id){s.fold=s.fold.includes(id)?s.fold.filter(x=>x!==id):s.fold.concat(id)},unfold(s){s.fold=[]}},
 draw(s,f,X){
  let out=heading('View control: see the structure at the depth you need');
  out+=R(20,46,320,300,'#fff',C.grid,10);
  const vis=T3_LIST.filter(([id])=>T3_lvl(id)<=s.depth&&!s.fold.some(fid=>id!==fid&&id.startsWith(fid)&&T3_lvl(id)>T3_lvl(fid)&&id.slice(0,fid.length)===fid));
  vis.forEach(([id,t],i)=>{const y=60+i*23,lv=T3_lvl(id),x=36+(lv-1)*22,kids=T3_LIST.some(([c])=>c!==id&&c.startsWith(id)&&T3_lvl(c)===lv+1),folded=s.fold.includes(id);
   out+=hit(X,'fold',id,(folded?'Unfold ':'Fold ')+t,R(30,y,300,21,folded?C.amberp:'#fff','none',4)+(s.nums==='on'?TMF(x,y+16,id,13,C.blue,'start'):'')+TF(x+(s.nums==='on'?36:0),y+16,t+(folded?'  …':''),14,C.ink,'start')+(kids&&lv>=s.depth?TF(322,y+16,'+',14,C.muted,'end'):''))});
  const hidden=T3_LIST.length-vis.length;
  out+=R(360,46,220,300,C.pale,'none',10)+TBF(376,74,'View',15,C.ink,'start');
  [['Levels shown',String(s.depth)],['Statements',`${vis.length} of ${T3_LIST.length}`],['Hidden',String(hidden)],['Folded',s.fold.length?s.fold.join(', '):'none'],['Numbers',s.nums]].forEach(([k,v],i)=>out+=TF(376,104+i*26,k,13,C.muted,'start')+TBF(564,104+i*26,v,13,C.ink,'end'));
  out+=TF(376,250,'Each statement has an address',13,C.ink,'start')+TF(376,268,'(1c2), so a link can point',13,C.ink,'start')+TF(376,286,'to exactly one statement.',13,C.ink,'start');
  return {svg:out,phase:`Showing ${vis.length} of ${T3_LIST.length} statements at depth ${s.depth}. Engelbart’s aim was to augment intellect: structure you can reshape and view in many ways.`};
 }});

const T3_KEYVAL=[16,8,4,2,1];
const T3_letter=v=>v>=1&&v<=26?String.fromCharCode(96+v):v===0?'':'?';
SCENE({id:'nls-demo-keyset',name:'The chord keyset',tag:'Five keys, one hand',
 definition:'Beside the mouse, NLS users had a five-key chord keyset. Pressing keys together formed a 5-bit binary number, and the number gave the letter: a = 1, b = 2 and so on to z = 26, typed without moving the other hand from the mouse.',
 example:'To type n (14 = 01110), press the middle three keys together. Practised users typed short commands and words this way while pointing with the mouse.',
 research:['Engelbart, D. C. & English, W. K. (1968). A research center for augmenting human intellect. AFIPS FJCC 33, 395–410.','Bardini, T. (2000). Bootstrapping: Douglas Engelbart, Coevolution, and the Origins of Personal Computing. Stanford University Press.'],
 desc:'Five keys labelled 16, 8, 4, 2 and 1, the current chord as a binary number and its letter, and the text typed so far.',
 dur:12,hint:'Press keys to build a chord, then Strike to type its letter. Try n = 14, l = 12, s = 19.',
 init:()=>({keys:[0,0,0,0,0],text:''}),
 watch(p){const word='nls',k=Math.min(5,Math.floor(p*6)),i=Math.floor(k/2),c=word.charCodeAt(Math.min(2,i))-96,typed=word.slice(0,Math.floor((k+1)/2));return {keys:k%2===0?T3_KEYVAL.map(v=>c&v?1:0):[0,0,0,0,0],text:typed}},
 ui:[{b:'Strike chord',act:'strike'},{b:'Space',act:'space'},{b:'Clear',act:'clear'}],
 on:{key(s,i){i=Number(i);s.keys[i]=1-s.keys[i];return 'keep'},strike(s){const v=s.keys.reduce((a,b,i)=>a+b*T3_KEYVAL[i],0);if(v&&s.text.length<24)s.text+=T3_letter(v);s.keys=[0,0,0,0,0]},space(s){if(s.text.length<24)s.text+=' '},clear(s){s.text='';s.keys=[0,0,0,0,0]}},
 draw(s,f,X){
  let out=heading('A chord is a binary number; the number is a letter');
  out+=R(20,46,560,52,'#fff',C.grid,8)+TMF(36,80,(s.text||'')+'▌',20,C.ink,'start');
  const v=s.keys.reduce((a,b,i)=>a+b*T3_KEYVAL[i],0);
  s.keys.forEach((k,i)=>{const x=40+i*58;out+=hit(X,'key',i,`Key ${T3_KEYVAL[i]} ${k?'down':'up'}`,R(x,120,50,150,k?C.blue:'#fff',k?C.blue:C.line,8)+TBF(x+25,290,String(T3_KEYVAL[i]),14,C.ink)+TBF(x+25,200,k?'1':'0',20,k?'#fff':C.muted))});
  out+=TF(170,318,'keys (left to right): 16 8 4 2 1',13,C.muted);
  out+=R(340,116,240,160,C.pale,'none',10)+TF(356,144,'chord',13,C.muted,'start')+TMF(564,144,s.keys.join(''),18,C.ink,'end')+TF(356,176,'value',13,C.muted,'start')+TBF(564,176,String(v),18,C.ink,'end')+TF(356,214,'letter',13,C.muted,'start')+TBF(564,220,v?(v<=26?T3_letter(v):'none'):'–',26,v>26?C.coral:C.blue,'end');
  out+=TF(356,256,'a = 1 … z = 26',13,C.muted,'start');
  return {svg:out,phase:v?`Chord ${s.keys.join('')} is ${v}${v<=26?', the letter '+T3_letter(v):', beyond z: the mouse buttons widened the code for capitals and commands'}.`:'No keys down. Five keys give 31 chords, enough for 26 letters and a few more.'};
 }});

const T3_IDEAS=['Notes','Trails','Outlines','Links','Versions','Windows'];
const T3_TREE0=[-1,0,0,1,2,2];
SCENE({id:'nls-demo-tree',name:'Outline or network?',tag:'Engelbart and Nelson disagree',
 definition:'NLS organised text as a strict outline, a tree in which every statement has one parent, with links that cut across it. Nelson argued that ideas are not hierarchical at all and that the structure itself should be a network.',
 example:'Try to put “Versions” under both “Outlines” and “Links”. In a tree you can only move it; in a network you simply add a second connection.',
 research:['Engelbart, D. C. (1962). Augmenting Human Intellect: A Conceptual Framework. SRI Summary Report AFOSR-3223.','Nelson, T. H. (1974). Computer Lib / Dream Machines. Self-published (his objections to hierarchy).'],
 desc:'Six ideas drawn either as a tree (each with one parent) or as a ring of nodes with the tree’s edges plus any extra links the learner adds.',
 dur:12,hint:'Choose tree or network, then press one idea and then another to connect them. In a tree the second idea is moved under the first.',
 init:()=>({mode:'tree',parent:T3_TREE0.slice(),extra:[],pick:-1,msg:''}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return k<2?{mode:'tree',parent:k?[-1,0,0,1,3,2]:T3_TREE0.slice(),extra:[],pick:-1,msg:k?'moved':''}:{mode:'network',parent:T3_TREE0.slice(),extra:k>2?[[3,4]]:[],pick:-1,msg:''}},
 ui:[{choose:[['tree','Tree (NLS outline)'],['network','Network (Nelson)']],label:'Structure',get:s=>s.mode,act:'mode'}],
 on:{mode(s,v){s.mode=v;s.pick=-1;s.msg=''},reset(s){s.parent=T3_TREE0.slice();s.extra=[];s.pick=-1;s.msg=''},
  node(s,i){i=Number(i);if(s.pick<0||s.pick===i){s.pick=s.pick===i?-1:i;s.msg='';return 'keep'}const a=s.pick,b=i;s.pick=-1;
   if(s.mode==='tree'){let x=a;while(x>=0){if(x===b){s.msg='cycle';return 'keep'}x=s.parent[x]}if(b===0){s.msg='root';return 'keep'}s.parent[b]=a;s.msg='moved'}
   else{if(s.parent[b]===a||s.parent[a]===b||s.extra.some(([p,q])=>(p===a&&q===b)||(p===b&&q===a))){s.msg='have';return 'keep'}if(s.extra.length<6)s.extra.push([a,b]);s.msg='added'}return 'keep'}},
 draw(s,f,X){
  let out=heading(s.mode==='tree'?'A tree: every idea has exactly one parent':'A network: any idea can connect to any other');
  let pos;
  if(s.mode==='tree'){const depth=T3_IDEAS.map((_,i)=>{let d=0,x=i;while(s.parent[x]>=0){x=s.parent[x];d++}return d});pos=T3_IDEAS.map(()=>null);
   const maxd=Math.max(...depth);for(let d=0;d<=maxd;d++){const row=T3_IDEAS.map((_,i)=>i).filter(i=>depth[i]===d);const sp=row.length>1?Math.min(150,480/(row.length-1)):0;row.forEach((i,k)=>pos[i]=[300+(k-(row.length-1)/2)*sp,78+d*Math.min(70,250/Math.max(1,maxd))])}}
  else pos=T3_IDEAS.map((_,i)=>[300+Math.sin(i/6*2*Math.PI)*170,195-Math.cos(i/6*2*Math.PI)*120]);
  T3_IDEAS.forEach((_,i)=>{if(s.parent[i]>=0)out+=L(pos[s.parent[i]][0],pos[s.parent[i]][1],pos[i][0],pos[i][1],C.line,2.5)});
  if(s.mode==='network')s.extra.forEach(([a,b])=>out+=L(pos[a][0],pos[a][1],pos[b][0],pos[b][1],C.coral,2.5,'stroke-dasharray="7 5"'));
  T3_IDEAS.forEach((t,i)=>{const p=pos[i],on=s.pick===i;out+=hit(X,'node',i,(s.pick<0?'Choose ':'Connect to ')+t,R(p[0]-50,p[1]-18,100,36,on?C.blue:'#fff',on?C.blue:C.line,18)+TF(p[0],p[1]+5,t,14,on?'#fff':C.ink))});
  out+=TF(300,360,s.mode==='tree'?'grey: parent → child':'grey: the outline · coral dashed: your extra links',13,C.muted);
  const say={moved:'Moved: in a tree, a new parent replaces the old one, so the idea is no longer where it was.',cycle:'Refused: that would put an idea underneath itself.',root:'The root cannot be moved under anything.',added:'Added: the idea keeps its place and gains a second connection.',have:'Those two are already connected.'}[s.msg]||(s.pick>=0?`“${T3_IDEAS[s.pick]}” chosen: now press the idea to connect it to.`:'');
  return {svg:out,phase:(say?say+' ':'')+(s.mode==='tree'?'NLS did allow links across the outline; the dispute was about which structure comes first.':`${s.extra.length} extra link${s.extra.length===1?'':'s'}. Nelson later summed this up as everything being “intertwingled”.`)};
 }});

/* ---------------- Lesson: FRESS (1968) ---------------- */
const T3_POEM=['Tyger Tyger, burning bright,','In the forests of the night;','What immortal hand or eye,','Could frame thy fearful symmetry?'];
const T3_HOT=[{w:'Tyger',l:0,c:0,note:'old spelling'},{w:'burning',l:0,c:13,note:'fire imagery'},{w:'forests',l:1,c:7,note:'darkness'},{w:'immortal',l:2,c:5,note:'who made it?'},{w:'symmetry',l:3,c:24,note:'fear, balance'}];
const T3_READERS={A:C.blue,B:C.green,C:C.purple};
const T3_DEMO=[['A',1],['B',3],['C',4],['A',2],['B',0],['C',1]];
SCENE({id:'fress',name:'FRESS',tag:'File Retrieval and Editing System, Brown, 1968',
 definition:'FRESS, van Dam’s second system at Brown, ran on ordinary terminals as well as graphics screens. It added typed links (“jumps”) and annotations, so many readers could attach comments to one shared text.',
 example:'A class reads a poem together. Each student attaches notes to words; everyone sees everyone’s notes, and a note can itself be annotated.',
 research:['DeRose, S. J. & van Dam, A. (1999). Document structure and markup in the FRESS hypertext system. Markup Languages: Theory & Practice 1(1), 7–32.','Barnet, B. (2013). Memory Machines. Anthem Press.'],
 desc:'Four lines of Blake’s “The Tyger” with five words that can carry notes; notes appear in a margin in each reader’s colour, joined to their word by a dashed line.',
 dur:12,hint:'Choose a reader, then press an underlined word to attach that reader’s note. Switch readers and annotate the same word again.',
 init:()=>({who:'A',notes:[]}),
 watch(p){return {who:'A',notes:T3_DEMO.slice(0,Math.min(6,Math.floor(p*7)))}},
 ui:[{choose:[['A','Reader A'],['B','Reader B'],['C','Reader C']],label:'Reader',get:s=>s.who,act:'who'},{b:'Clear notes',act:'clear'}],
 on:{who(s,v){s.who=v},clear(s){s.notes=[]},note(s,i){i=Number(i);if(!s.notes.some(([w,k])=>w===s.who&&k===i)){s.notes.push([s.who,i]);if(s.notes.length>7)s.notes.shift()}}},
 draw(s,f,X){
  let out=heading('Many readers, one text: annotation as a link');
  const cw=9.6,x0=30,y0=96;
  out+=R(20,52,350,190,'#fff',C.grid,10);
  T3_POEM.forEach((l,i)=>out+=TMF(x0,y0+i*38,l,16,C.ink,'start'));
  T3_HOT.forEach((h,i)=>{const x=x0+h.c*cw,y=y0+h.l*38,w=h.w.length*cw;out+=L(x,y+5,x+w,y+5,C.blue,2,'stroke-dasharray="3 3"')+hit(X,'note',i,'Annotate “'+h.w+'”',R(x-2,y-17,w+4,26,'rgba(23,114,183,.06)','none',4))});
  out+=TF(195,268,'William Blake, “The Tyger” (1794)',13,C.muted);
  const shown=s.notes.slice(-7);
  shown.forEach(([w,i],k)=>{const h=T3_HOT[i],x=x0+(h.c+h.w.length/2)*cw,y=y0+h.l*38+6,ny=58+k*44;
   const ly=y0+h.l*38-6;out+=P(`M366 ${ly} C 378 ${ly}, 376 ${ny+18}, 384 ${ny+18}`,T3_READERS[w],1.5,'none','stroke-dasharray="4 4" opacity=".8"')+L(358,ly,366,ly,T3_READERS[w],1.5);
   out+=R(384,ny,196,36,'#fff',T3_READERS[w],8)+TBF(395,ny+23,w,13,T3_READERS[w],'start')+TF(410,ny+23,h.w+': '+h.note,13,C.ink,'start')});
  T3_HOT.forEach((h,i)=>{const who=Object.keys(T3_READERS).filter(r=>shown.some(([w,k])=>w===r&&k===i));who.forEach((r,j)=>out+=Ci(x0+(h.c+h.w.length/2)*cw+(j-(who.length-1)/2)*10,y0+h.l*38-21,4,T3_READERS[r]))});
  if(!shown.length)out+=TF(484,160,'notes appear here',13,C.muted);
  const per=Object.keys(T3_READERS).map(r=>s.notes.filter(n=>n[0]===r).length);
  out+=TF(195,300,`notes: A ${per[0]} · B ${per[1]} · C ${per[2]}`,14,C.ink);
  return {svg:out,phase:s.notes.length?`${s.notes.length} note${s.notes.length===1?'':'s'} from ${per.filter(Boolean).length} reader${per.filter(Boolean).length===1?'':'s'}. The text is unchanged; the notes are links laid over it, visible to the whole class.`:'No notes yet. In FRESS an annotation was a link from a point in the text to a comment.'};
 }});

const T3_BASE='Links should work in one direction.';
const T3_EDITS=[{label:'insert “always”',f:t=>t.includes('always')?t:t.replace(' work',' always work')},{label:'“one direction” → “both directions”',f:t=>t.replace('one direction','both directions')},{label:'“should” → “must”',f:t=>t.replace('should','must')}];
function T3_undoRun(steps){let h=[T3_BASE],i=0;for(const st of steps){if(st==='u')i=Math.max(0,i-1);else if(st==='r')i=Math.min(h.length-1,i+1);else{h=h.slice(0,i+1);h.push(T3_EDITS[st].f(h[i]));i++}}return {h,i}}
const T3_UDEMO=[0,1,'u','u','r',2];
SCENE({id:'fress-undo',name:'Undo',tag:'Stepping back through edits',
 definition:'Undo keeps a history of edits so that any change can be reversed, and redo steps forward again. FRESS is widely credited, by van Dam among others, with the first undo in a text editor.',
 example:'Make three edits, undo two, then make a new edit: the undone future is discarded, just as in today’s editors.',
 research:['van Dam, A. (1988). Hypertext ’87 keynote address. Communications of the ACM 31(7), 887–895.','DeRose, S. J. & van Dam, A. (1999). Document structure and markup in the FRESS hypertext system.'],
 desc:'The current sentence in large type above a row of boxes, one per saved state, with a marker showing where you are; states after the marker are dashed (redo).',
 dur:12,hint:'Apply edits, then Undo and Redo. Make a new edit after undoing and watch the redo states disappear.',
 init:()=>({steps:[]}),
 watch(p){return {steps:T3_UDEMO.slice(0,Math.min(T3_UDEMO.length,Math.floor(p*(T3_UDEMO.length+1))))}},
 ui:[{b:'Edit 1: insert “always”',act:'e',arg:0},{b:'Edit 2: both directions',act:'e',arg:1},{b:'Edit 3: must',act:'e',arg:2},{b:'↶ Undo',act:'u'},{b:'↷ Redo',act:'r'}],
 on:{e(s,k){s.steps.push(Number(k));if(s.steps.length>20)s.steps.shift()},u(s){s.steps.push('u')},r(s){s.steps.push('r')},reset(s){s.steps=[]}},
 draw(s){
  const {h,i}=T3_undoRun(s.steps),cur=h[i];let out=heading('Every edit is kept, so any edit can be reversed');
  out+=R(20,56,560,90,'#fff',C.grid,10)+T(300,110,cur,19,C.ink);
  const show=h.slice(-8),off=h.length-show.length;
  show.forEach((t,k)=>{const j=k+off,x=36+k*68,past=j<i,now=j===i;out+=R(x,190,58,46,now?C.blue:past?C.pale:'#fff',now?C.blue:C.line,8,j>i?'stroke-dasharray="5 4"':'')+TBF(x+29,219,j===0?'start':String(j),14,now?'#fff':C.ink);if(k)out+=L(x-10,213,x,213,C.line,2)});
  out+=TF(300,262,'saved states · blue: where you are · dashed: can be redone',13,C.muted);
  out+=R(150,286,300,50,C.pale,'none',8)+TF(300,316,`state ${i} of ${h.length-1} · undo ${i} · redo ${h.length-1-i}`,14,C.ink);
  return {svg:out,phase:i<h.length-1?`You have stepped back ${h.length-1-i} edit${h.length-1-i===1?'':'s'}; Redo can bring ${h.length-1-i===1?'it':'them'} back until you make a new edit.`:`${h.length-1} edit${h.length-1===1?'':'s'} in the history. Undo made experimenting safe, which matters for writing as much as for programming.`};
 }});

SCENE({id:'fress-poetry',name:'A class writing in the margins',tag:'FRESS in an English course, 1970s',
 definition:'In the mid-1970s FRESS was used in an English poetry course at Brown: students read poems online and wrote comments that classmates could read and answer, an early “communal text”.',
 example:'Week by week the poem gathers notes, and notes gather replies. The interesting growth is in the replies: students reading each other.',
 research:['Catano, J. V. (1979). Poetry and computers: experimenting with the communal text. Computers and the Humanities 13(4), 269–275.','van Dam, A. (1988). Hypertext ’87 keynote address.'],
 desc:'A poem at the centre with eight students around it; lines to the poem are notes and lines between students are replies, accumulating over a course of up to twelve weeks; bars count each kind. Counts are illustrative.',
 dur:10,hint:'Move through the weeks. The counts are an illustration of how such a class text grows, not data from the course.',
 init:()=>({week:6}),
 watch(p){return {week:1+Math.round(p*11)}},
 ui:[{range:'week',label:'Week',min:1,max:12,get:s=>s.week,act:'week',show:v=>'week '+v}],
 on:{week(s,v){s.week=Number(v)}},
 draw(s){
  let out=heading('Notes on the poem, then replies to each other');
  const r=rng(7),ev=[];for(let w=1;w<=12;w++){const n=2+Math.floor(r()*3);for(let k=0;k<n;k++){const a=Math.floor(r()*8),reply=w>2&&r()<Math.min(.7,.15+w*.05);ev.push({w,a,b:reply?(a+1+Math.floor(r()*7))%8:-1})}}
  const cur=ev.filter(e=>e.w<=s.week),cx=200,cy=200,pos=range(8).map(i=>[cx+Math.sin(i/8*2*Math.PI)*140,cy-Math.cos(i/8*2*Math.PI)*130]);
  cur.forEach(e=>{const p=pos[e.a];if(e.b<0)out+=L(p[0],p[1],cx,cy,C.blue,1.2,'opacity=".45"');else{const q=pos[e.b];out+=P(`M${fmt(p[0])} ${fmt(p[1])} Q ${cx} ${cy} ${fmt(q[0])} ${fmt(q[1])}`,C.coral,1.4,'none','opacity=".55"')}});
  out+=R(cx-48,cy-26,96,52,'#fff',C.ink,8)+TBF(cx,cy+5,'poem',14,C.ink);
  pos.forEach((p,i)=>out+=Ci(p[0],p[1],15,'#fff',C.line)+TF(p[0],p[1]+5,String(i+1),13,C.ink));
  const notes=cur.filter(e=>e.b<0).length,reps=cur.length-notes;
  out+=R(390,60,190,260,C.pale,'none',10)+TBF(406,88,'Week '+s.week,15,C.ink,'start');
  const mx=Math.max(1,ev.filter(e=>e.b<0).length,ev.length-ev.filter(e=>e.b<0).length);
  [['notes on the poem',notes,C.blue],['replies to others',reps,C.coral]].forEach(([t,v,c],i)=>{const y=120+i*80;out+=TF(406,y,t,13,C.ink,'start')+R(406,y+10,150*v/mx,22,c,'none',4)+TBF(410+150*v/mx,y+27,String(v),14,C.ink,'start')});
  out+=TF(406,296,'illustrative counts',13,C.muted,'start');
  return {svg:out,phase:`By week ${s.week}: ${notes} notes and ${reps} replies. Catano describes students reading and answering one another’s comments; the share of replies here rises over time to show that idea, not measured values.`};
 }});

/* ---------------- Lesson: Stretchtext ---------------- */
const T3_TIDE=['The Moon pulls on the sea.',
 'The Moon’s gravity pulls on the sea, raising the tides.',
 'The Moon’s gravity pulls on the sea, raising two bulges of water, so most coasts get two high tides a day.',
 'The Moon’s gravity pulls on the sea, raising two bulges of water, so most coasts get two high tides a day. The Sun pulls too, about half as strongly: when Sun and Moon line up, the tides are biggest (spring tides).'];
const T3_words=t=>t.split(' ').length;
// Lines of runs with words new at this level highlighted.
function T3_stretchLines(level,n){const prev=level?T3_TIDE[level-1].split(' '):[],pool=prev.slice();return T3_wrap(T3_TIDE[level],n).map(line=>line.split(' ').map((w,i,a)=>{const k=pool.indexOf(w),isNew=k<0;if(!isNew)pool.splice(k,1);return [w+(i<a.length-1?' ':''),isNew&&level?C.coral:C.ink,isNew&&level]}))}
SCENE({id:'stretchtext',name:'Stretchtext',tag:'Text that grows where you ask',
 definition:'Stretchtext, one of Nelson’s proposals, is text that expands in place: ask for more and extra words and sentences appear inside what you are reading; ask for less and it contracts. The reader chooses the level of detail.',
 example:'“The Moon pulls on the sea” stretches to explain tides, two high tides a day, and spring tides, without sending you to another page.',
 research:'Nelson, T. H. (1974). Computer Lib / Dream Machines. Self-published (Dream Machines side, on stretchtext).',
 desc:'A paragraph at one of four detail levels, with words new at this level in coral, and a bar for each level’s word count.',
 dur:10,hint:'Use the slider, the buttons or press the paragraph to stretch it. Shrink it again: nothing you were reading moves away.',
 init:()=>({level:0}),
 watch(p){return {level:Math.min(3,Math.floor(p*4))}},
 ui:[{range:'level',label:'Detail',min:0,max:3,get:s=>s.level,act:'level',show:v=>'level '+v},{b:'Stretch',act:'more'},{b:'Shrink',act:'less'}],
 on:{level(s,v){s.level=Number(v)},more(s){s.level=Math.min(3,s.level+1)},less(s){s.level=Math.max(0,s.level-1)},tap(s){s.level=(s.level+1)%4}},
 draw(s,f,X){
  let out=heading('Ask for more detail and the text stretches in place');
  const lines=T3_stretchLines(s.level,40);
  out+=hit(X,'tap',0,'Stretch the paragraph',R(30,52,540,200,'#fff',C.grid,10)+lines.map((ln,i)=>T3_runs(50,90+i*30,ln,17)).join(''));
  out+=TF(300,272,'coral: words added at this level',13,C.coral);
  T3_TIDE.forEach((t,i)=>{const x=80+i*120,w=T3_words(t),h=w*1.4,on=i===s.level;out+=R(x,350-h,70,h,on?C.blue:C.pale,'none',4)+TF(x+35,345-h,String(w),13,C.ink)+TF(x+35,368,'level '+i,13,on?C.blue:C.muted)});
  return {svg:out,phase:`Level ${s.level}: ${T3_words(T3_TIDE[s.level])} words. The reader controls the depth, and the context stays on screen.`};
 }});

SCENE({id:'stretchtext-jump',name:'Stretch, jump or gloss',tag:'Keeping your place',
 definition:'A link that jumps replaces what you were reading with a new page. Stretchtext and later “fluid links” instead open the detail beside or inside the current text, so the context stays in view.',
 example:'Press “hypertext” in the sentence. With a jump you lose the sentence; with stretchtext or a gloss you keep it.',
 research:['Zellweger, P. T., Chang, B.-W. & Mackinlay, J. D. (1998). Fluid links for informed and incremental link transitions. Proceedings of HYPERTEXT ’98, ACM, 50–57.','Conklin, J. (1987). Hypertext: an introduction and survey. IEEE Computer 20(9), 17–41 (disorientation).'],
 desc:'A page with a linked word; depending on the method, pressing it replaces the page, inserts the explanation into the sentence, or opens a small note beside the word. A panel shows whether the original sentence is still visible.',
 dur:12,hint:'Choose a method, then press the linked word “hypertext” to open and close its detail.',
 init:()=>({mode:'jump',open:false}),
 watch(p){const k=Math.min(5,Math.floor(p*6));return {mode:['jump','stretch','gloss'][Math.floor(k/2)],open:k%2===1}},
 ui:[{choose:[['jump','Jump to a page'],['stretch','Stretchtext'],['gloss','Gloss (fluid link)']],label:'Method',get:s=>s.mode,act:'mode'}],
 on:{mode(s,v){s.mode=v;s.open=false},open(s){s.open=!s.open}},
 draw(s,f,X){
  let out=heading('Where does the detail appear?');
  const kept=!(s.mode==='jump'&&s.open);
  out+=R(20,50,390,280,'#fff',C.grid,10);
  if(!kept){out+=TBF(40,84,'Hypertext',18,C.ink,'start');['Text that branches or','responds on request, so','each reader can take a','different path.'].forEach((l,i)=>out+=T(40,118+i*26,l,16,C.ink,'start'));out+=hit(X,'open',0,'Go back',R(40,240,120,38,C.pale,C.blue,6)+TF(100,264,'◀ Back',14,C.blue))}
  else{
   const a=['In 1965 Ted Nelson named'],linkLine='hypertext',after=['in a paper on a file structure','for the complex, the changing','and the indeterminate.'];
   out+=T(40,90,a[0],16,C.ink,'start');
   const y=118;out+=hit(X,'open',0,s.open?'Close the detail':'Open the detail for hypertext',R(36,y-20,96,28,s.open?C.amberp:'rgba(23,114,183,.08)','none',4)+T(40,y,linkLine,16,C.blue,'start','text-decoration="underline"'));
   let yy=y;
   if(s.mode==='stretch'&&s.open){['(text that branches or responds on','request, so each reader can take','a different path)'].forEach(l=>{yy+=26;out+=T(40,yy,l,16,C.coral,'start')})}
   if(s.mode==='gloss'&&s.open){out+=P(`M86 ${y+4}L86 ${y+14}`,C.amber,2)+R(40,y+14,300,48,C.amberp,C.amber,6)+TF(52,y+34,'text that branches or responds on',13,C.ink,'start')+TF(52,y+52,'request; readers choose the path',13,C.ink,'start');yy+=50}
   after.forEach(l=>{yy+=26;out+=T(40,yy,l,16,C.ink,'start')});
  }
  out+=R(430,50,150,280,C.pale,'none',10)+TBF(505,80,'Your sentence',14,C.ink)+TBF(505,128,kept?'in view':'gone',22,kept?C.green:C.coral);
  out+=TF(505,170,s.mode==='jump'?'jump: new page':s.mode==='stretch'?'stretch: inserted':'gloss: beside it',13,C.ink);
  out+=TF(505,200,kept?'no need to return':'press Back to return',13,C.muted);
  return {svg:out,phase:s.open?(kept?'The explanation appeared and your sentence stayed in view: no navigation, so less to keep track of.':'The jump replaced your sentence with a new page. Each jump adds to what Conklin called cognitive overhead: remembering where you were.'):'Press the linked word to open its detail.'};
 }});

const T3_WPM=238;
SCENE({id:'stretchtext-readers',name:'One text, many readers',tag:'Detail on demand',
 definition:'Stretchtext lets one document serve readers with different needs: a newcomer stretches it, an expert keeps it short. Interface designers later called the general idea progressive disclosure.',
 example:'At an average silent reading rate of about 238 words a minute, the short version of the tides paragraph takes about 1.5 seconds and the full one about 10.',
 research:['Brysbaert, M. (2019). How many words do we read per minute? A review and meta-analysis of reading rate. Journal of Memory and Language 109, 104047 (about 238 words a minute for non-fiction).','Nielsen, J. (2006). Progressive disclosure. Nielsen Norman Group.'],
 desc:'Three readers each shown at the detail level they chose, with the words they read and the estimated reading time as bars.',
 dur:10,hint:'Choose who is reading. Each reader stretches the same paragraph to a different level.',
 init:()=>({who:'new'}),
 watch(p){return {who:['expert','student','new'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['expert','Expert'],['student','Student'],['new','Newcomer']],label:'Reader',get:s=>s.who,act:'who'}],
 on:{who(s,v){s.who=v}},
 draw(s){
  const lv={expert:0,student:1,new:3},names={expert:'Expert',student:'Student',new:'Newcomer'};
  let out=heading('Each reader stretches the text to the depth they need');
  const lines=T3_wrap(T3_TIDE[lv[s.who]],44);
  out+=R(20,48,560,196,'#fff',C.grid,10)+TBF(36,74,names[s.who]+' reads level '+lv[s.who],14,C.blue,'start');
  lines.forEach((l,i)=>out+=T(36,102+i*26,l,16,C.ink,'start'));
  const mx=T3_words(T3_TIDE[3])/T3_WPM*60;
  Object.keys(lv).forEach((k,i)=>{const w=T3_words(T3_TIDE[lv[k]]),sec=w/T3_WPM*60,y=256+i*36,on=k===s.who;
   out+=TF(36,y+20,names[k],14,on?C.blue:C.ink,'start')+R(140,y+4,330*sec/mx,24,on?C.blue:C.pale,'none',4)+TF(148+330*sec/mx,y+21,`${w} words · ${sec.toFixed(1)} s`,13,C.ink,'start')});
  const w=T3_words(T3_TIDE[lv[s.who]]);
  return {svg:out,phase:`${names[s.who]}: ${w} words, about ${(w/T3_WPM*60).toFixed(1)} s at 238 words a minute. One source, many lengths: nothing is written twice.`};
 }});
