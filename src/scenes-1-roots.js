/* ===================== Ted Nelson era 1 · Before hypertext (1945–1960) ===================== */
// Bush's memex, associative trails, the idea that writing need not run in one line, and index cards.

/* ---------------- Lesson: The memex (1945) ---------------- */
const T1_LIB=['Yeast entry','Pasteur, 1857','Baker’s guild roll','Chemistry text','My own notes','Photo of a loaf','Colleague’s letter','Flour prices'];
const T1_SHORT=['Yeast','Pasteur','Guild roll','Chemistry','My notes','Loaf photo','Letter','Prices'];
function T1_screen(x,y,w,h,i,label){
 let out=R(x,y,w,h,i==null?'#2a2a2a':'#f5efdf','#222',4);
 if(i==null)return out+TF(x+w/2,y+h/2+5,label,13,'#bbb');
 return out+TB(x+w/2,y+30,T1_LIB[i],15,C.ink)+range(4).map(r=>R(x+18,y+46+r*15,w-36-(r*29)%50,6,'#cbbf9f','none',2)).join('');
}
function T1_libraryRow(X,act,y,mark,label){
 let out='';T1_LIB.forEach((t,i)=>{const x=22+(i%4)*141,yy=y+Math.floor(i/4)*42,on=mark&&mark.includes(i);
  out+=hit(X,act,i,`${label} ${t}`,R(x,yy,134,36,on?C.amberp:'#fff',on?C.amber:C.line,6)+TF(x+67,yy+23,t,13,C.ink))});
 return out;
}
SCENE({id:'memex',name:'The memex',tag:'Bush, “As We May Think”, 1945',
 definition:'Vannevar Bush imagined the memex: a desk that stores a person’s books, records and notes on microfilm, shows any two items side by side, and can tie them together with a press of a key so that one recalls the other.',
 example:'A reader with a yeast article on one screen and Pasteur’s paper on the other presses “tie”. From then on, calling up either item offers the other.',
 research:'Bush, V. (1945). As We May Think. The Atlantic Monthly 176(1), 101–108. Nyce, J. M. & Kahn, P. (eds) (1991). From Memex to Hypertext. Academic Press.',
 desc:'A memex desk with two viewing screens, a list of ties already made, and a microfilm library of eight items below.',
 dur:10,hint:'Press a library item to put it on a screen, press another for the second screen, then Tie them. Ties are listed above the library.',
 init:()=>({left:0,right:1,ties:[[0,1]]}),
 watch(p){const steps=[{left:null,right:null,ties:[]},{left:0,right:null,ties:[]},{left:0,right:1,ties:[]},{left:0,right:1,ties:[[0,1]]},{left:1,right:3,ties:[[0,1],[1,3]]},{left:4,right:5,ties:[[0,1],[1,3],[4,5]]}];return steps[Math.min(5,Math.floor(p*6))]},
 ui:[{b:'Tie the two items',act:'tie'},{b:'Clear the screens',act:'clear'}],
 on:{pick(s,i){i=Number(i);if(s.left==null||(s.right!=null))return void Object.assign(s,{left:i,right:null});if(i!==s.left)s.right=i},
  tie(s){if(s.left==null||s.right==null)return;const k=[s.left,s.right].sort((a,b)=>a-b);if(!s.ties.some(t=>t[0]===k[0]&&t[1]===k[1])){s.ties.push(k);if(s.ties.length>4)s.ties.shift()}},
  clear(s){s.left=null;s.right=null}},
 draw(s,f,X){
  let out=heading('Two screens, one key: tie any two items together');
  out+=R(18,46,564,150,'#6d4c2f','#4d3420',12);
  out+=T1_screen(36,60,252,122,s.left,'press an item')+T1_screen(312,60,252,122,s.right,s.left==null?'':'press a second item');
  const tied=s.left!=null&&s.right!=null&&s.ties.some(t=>t.includes(s.left)&&t.includes(s.right));
  out+=Ci(300,121,13,tied?C.amber:'#3a2a1a','#222')+TF(300,212,tied?'tied':'not tied',13,tied?C.amber:C.muted);
  out+=TB(22,236,'Ties made:',14,C.ink,'start');
  s.ties.forEach((t,k)=>{const x=110+k*120;out+=R(x,220,114,24,C.amberp,C.amber,6)+TF(x+57,237,T1_SHORT[t[0]]+' ↔ '+T1_SHORT[t[1]],13,C.ink)});
  if(!s.ties.length)out+=TF(110,237,'none yet',13,C.muted,'start');
  out+=T1_libraryRow(X,'pick',268,[s.left,s.right].filter(v=>v!=null),'Show');
  const say=s.left==null?'Both screens are empty. Bush’s machine was imagined, never built: microfilm, levers and photocells, not a computer.':s.right==null?`${T1_LIB[s.left]} is on the left screen. Choose a second item to set beside it.`:tied?`${T1_LIB[s.left]} and ${T1_LIB[s.right]} are tied. Calling up either one now brings the other within a key press.`:`${T1_LIB[s.left]} and ${T1_LIB[s.right]} are side by side but not yet tied. Bush called tying two items “the essential feature of the memex”.`;
  return {svg:out,phase:say};
 }});

const T1_TRAILS={A:{name:'How bread rises',items:[0,1,3,4,5]},B:{name:'Who paid for flour',items:[7,2,4,6]}};
SCENE({id:'memex-trails',name:'Trails and side trails',tag:'A chain of ties, kept and shared',
 definition:'In Bush’s memex a trail is a named chain of ties. A reader can step along it like turning pages, branch onto a side trail where two trails share an item, and hand a copy of the whole trail to someone else.',
 example:'Two trails, one about how bread rises and one about who paid for flour, both pass through the reader’s own notes. At that shared item the reader can switch from one to the other.',
 research:'Bush, V. (1945). As We May Think. The Atlantic Monthly 176(1), 101–108 (trails, side trails and copying a trail for a friend).',
 desc:'Two trails drawn as rows of items, with the shared item joined between them, the reader’s position marked, and the current item shown on a screen.',
 dur:12,hint:'Step along a trail with Next and Back. When you reach the shared item (My notes), Switch trail to continue along the other one.',
 init:()=>({t:'A',k:0}),
 watch(p){const path=[['A',0],['A',1],['A',2],['A',3],['B',2],['B',3]];const [t,k]=path[Math.min(5,Math.floor(p*6))];return {t,k}},
 ui:[{b:'◀ Back',act:'back'},{b:'Next ▶',act:'next'},{b:'Switch trail here',act:'swap'}],
 on:{next(s){if(s.k<T1_TRAILS[s.t].items.length-1)s.k++},back(s){if(s.k>0)s.k--},
  swap(s){const it=T1_TRAILS[s.t].items[s.k],o=s.t==='A'?'B':'A',j=T1_TRAILS[o].items.indexOf(it);if(j>=0){s.t=o;s.k=j}},
  go(s,a){const [t,k]=String(a).split(':');s.t=t;s.k=Number(k)}},
 draw(s,f,X){
  let out=heading('Follow a trail, then branch where trails meet');
  const rowY={A:78,B:178},x0={A:30,B:110};
  for(const id of ['A','B']){const tr=T1_TRAILS[id];out+=TB(30,rowY[id]-22,`Trail ${id}: ${tr.name}`,14,id===s.t?C.blue:C.muted,'start');
   tr.items.forEach((it,k)=>{const x=x0[id]+k*104,on=id===s.t&&k===s.k,shared=T1_TRAILS[id==='A'?'B':'A'].items.includes(it);
    if(k)out+=L(x-14,rowY[id]+17,x,rowY[id]+17,id===s.t?C.blue:C.line,2.5);
    out+=hit(X,'go',id+':'+k,`Go to ${T1_LIB[it]} on trail ${id}`,R(x,rowY[id],90,34,on?C.blue:shared?C.amberp:'#fff',on?C.blue:shared?C.amber:C.line,6)+TF(x+45,rowY[id]+22,T1_SHORT[it],13,on?'#fff':C.ink))})}
  const ka=T1_TRAILS.A.items.indexOf(4),kb=T1_TRAILS.B.items.indexOf(4);
  out+=P(`M${x0.A+ka*104+45} 112 L${x0.B+kb*104+45} 178`,C.amber,2.5,'none','stroke-dasharray="5 4"')+TF(x0.A+ka*104+110,148,'shared item',13,C.amber,'start');
  const it=T1_TRAILS[s.t].items[s.k];out+=R(30,232,540,128,'#6d4c2f','#4d3420',10)+T1_screen(150,242,300,108,it,'');
  out+=TF(90,300,`${s.k+1} of ${T1_TRAILS[s.t].items.length}`,13,'#f5efdf');
  const atShared=T1_TRAILS[s.t==='A'?'B':'A'].items.includes(it);
  return {svg:out,phase:`On trail ${s.t} (${T1_TRAILS[s.t].name}), item ${s.k+1}: ${T1_LIB[it]}.${atShared?' Both trails pass through here, so you can branch onto the other one.':' Bush imagined a reader could also photograph a whole trail and pass it to a friend to insert in their own memex.'}`};
 }});

const T1_CLASSES=[['Biology',[0,1,5]],['History',[2,7,6]],['Science',[3]],['Personal',[4]]];
const T1_QUEST=[0,1,3,4];
SCENE({id:'memex-indexing',name:'Indexing or association',tag:'Why Bush distrusted filing systems',
 definition:'Bush argued that libraries file each item in one place, so finding it means climbing down from class to subclass and then climbing back out for the next item. The mind, he said, jumps by association instead, and the memex would let readers do the same.',
 example:'To look at four related items in a filing system you start at the top four times. Along a trail you take one step each.',
 research:'Bush, V. (1945). As We May Think. The Atlantic Monthly 176(1), 101–108 (on “the artificiality of systems of indexing”).',
 desc:'A filing tree with four classes on the left and a trail of four items on the right; the steps taken to visit each item in turn are drawn and counted for both methods.',
 dur:11,hint:'Press Next item to look up the next item of the question. Compare the steps in the filing tree with the steps along the trail.',
 init:()=>({n:0}),
 watch(p){return {n:Math.min(4,Math.floor(p*5))}},
 ui:[{b:'Next item',act:'next'}],
 on:{next(s){if(s.n<4)s.n++},reset(s){s.n=0}},
 draw(s){
  let out=heading('Four lookups: climb the tree four times, or step along one trail');
  out+=R(20,46,320,300,'#fff',C.grid,10)+TB(36,70,'Filing system',15,C.ink,'start');
  const root=[180,96];out+=R(root[0]-40,root[1]-14,80,28,C.pale,C.blue,6)+TF(root[0],root[1]+5,'Catalogue',13,C.ink);
  const cx=[60,140,220,300],pos={};let boxes='';
  T1_CLASSES.forEach(([nm,items],c)=>{out+=L(root[0],root[1]+14,cx[c],150,C.line,1.5);boxes+=R(cx[c]-36,150,72,26,'#fff',C.line,6)+TF(cx[c],168,nm,13,C.ink);
   items.forEach((it,j)=>{const y=212+j*42;pos[it]=[cx[c],y];out+=L(cx[c],176,cx[c],y-12,C.line,1.2);boxes+=R(cx[c]-36,y-12,72,26,T1_QUEST.slice(0,s.n).includes(it)?C.coralp:'#f6f6f6',C.line,6)+TF(cx[c],y+5,T1_SHORT[it],13,C.ink)})});
  let idx=0;for(let q=0;q<s.n;q++){const it=T1_QUEST[q],c=T1_CLASSES.findIndex(x=>x[1].includes(it));const p=pos[it];
   out+=P(`M${root[0]} ${root[1]+14} L${cx[c]} 150 L${p[0]} ${p[1]-12}`,C.coral,3,'none','opacity=".55"');idx+=1+1+T1_CLASSES[c][1].indexOf(it)+1}
  out+=boxes;
  out+=R(360,46,220,300,'#fff',C.grid,10)+TB(376,70,'One trail',15,C.ink,'start');
  T1_QUEST.forEach((it,j)=>{const y=100+j*56,on=j<s.n;if(j)out+=L(470,y-22,470,y-4,on?C.blue:C.line,2.5);out+=R(410,y-4,120,32,on?C.pale:'#fff',on?C.blue:C.line,6)+TF(470,y+17,T1_SHORT[it],13,C.ink)});
  const trail=s.n;
  out+=TB(180,330,`${idx} steps`,16,C.coral)+TB(470,330,`${trail} steps`,16,C.blue);
  return {svg:out,phase:s.n===0?'The question needs four related items: the yeast entry, Pasteur’s paper, a chemistry text and your notes. They sit in three different classes.':`After ${s.n} item${s.n>1?'s':''}: ${idx} steps through the catalogue (down to the class, along to the item, and back up each time) against ${trail} along the trail. Counts are illustrative; Bush’s point was about the shape of the search, not exact numbers.`};
 }});

/* ---------------- Lesson: Associative trails ---------------- */
const T1_NET={names:['Bread','Yeast','Pasteur','Microbes','Beer','Wheat','Mill','Prices'],
 pos:[[120,120],[250,90],[390,90],[500,160],[330,190],[150,250],[290,300],[460,290]],
 edges:[[0,1],[1,2],[2,3],[1,4],[3,4],[0,5],[5,6],[6,7],[4,7],[0,4]]};
const T1_WALK=[0,1,2,3,4,1,2,3];
function T1_strengths(path){const w=T1_NET.edges.map(()=>1);for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i];for(let e=0;e<w.length;e++){const [u,v]=T1_NET.edges[e];if((u===a&&v===b)||(u===b&&v===a))w[e]=Math.min(5,w[e]+1);else w[e]=Math.max(.2,w[e]-.25)}}return w}
SCENE({id:'associative-trails',name:'Associative trails',tag:'The mind works by association',
 definition:'Bush based the memex on a claim about the mind: we move from one idea to the next along associations, and associations we use grow stronger while those we neglect fade. A memex trail would keep them without fading.',
 example:'Think “bread” and “yeast” follows, then perhaps “Pasteur”. Walk that path often and it becomes the easy route; a link you never use grows faint.',
 research:'Bush, V. (1945). As We May Think. The Atlantic Monthly 176(1), 101–108 (trails “not frequently followed are prone to fade”). Hebb, D. O. (1949). The Organization of Behavior. Wiley.',
 desc:'A network of eight ideas. Lines thicken each time the reader follows them and thin when they are not used; the reader’s current idea is filled.',
 dur:12,hint:'Press an idea joined to the current one to follow that association. Followed links grow thicker; the rest slowly fade.',
 init:()=>({path:[0]}),
 watch(p){return {path:T1_WALK.slice(0,1+Math.min(T1_WALK.length-1,Math.floor(p*T1_WALK.length)))}},
 ui:[],
 on:{go(s,i){i=Number(i);const c=s.path[s.path.length-1];if(T1_NET.edges.some(([u,v])=>(u===c&&v===i)||(v===c&&u===i))){s.path.push(i);if(s.path.length>30)s.path.shift()}},reset(s){s.path=[0]}},
 draw(s,f,X){
  const c=s.path[s.path.length-1],w=T1_strengths(s.path);let out=heading('Used associations strengthen; neglected ones fade');
  T1_NET.edges.forEach(([u,v],e)=>{const a=T1_NET.pos[u],b=T1_NET.pos[v];out+=L(a[0],a[1],b[0],b[1],w[e]>1.2?C.blue:C.line,1+w[e]*2,`opacity="${clamp(.35+w[e]/6,.35,1)}"`)});
  T1_NET.names.forEach((nm,i)=>{const p=T1_NET.pos[i],on=i===c,nb=T1_NET.edges.some(([u,v])=>(u===c&&v===i)||(v===c&&u===i));
   out+=hit(X,'go',i,`Follow the association to ${nm}`,Ci(p[0],p[1],30,on?C.blue:nb?C.pale:'#fff',on?C.blue:nb?C.blue:C.line)+TF(p[0],p[1]+5,nm,13,on?'#fff':C.ink))});
  const best=w.indexOf(Math.max(...w)),[u,v]=T1_NET.edges[best];
  out+=TF(300,360,`Strongest link: ${T1_NET.names[u]} – ${T1_NET.names[v]} · path length ${s.path.length-1}`,13,C.muted);
  return {svg:out,phase:s.path.length<2?'You are at Bread. Press a neighbouring idea to follow an association.':`Path: ${s.path.slice(-6).map(i=>T1_NET.names[i]).join(' → ')}. Links you follow thicken; the others fade a little each step. The strengths here are illustrative, a picture of Bush’s claim rather than a measured law.`};
 }});

SCENE({id:'associative-trails-spreading',name:'Spreading activation',tag:'Association measured, 1970s',
 definition:'Psychologists later tested the idea of association. Thinking of one word briefly “activates” related words, which are then recognised faster. Spreading-activation models picture this as activation flowing out along links and weakening with each step.',
 example:'People decide that BUTTER is a word faster just after seeing BREAD than after seeing NURSE.',
 research:'Meyer, D. E. & Schvaneveldt, R. W. (1971). Facilitation in recognizing pairs of words. Journal of Experimental Psychology 90, 227–234. Collins, A. M. & Loftus, E. F. (1975). A spreading-activation theory of semantic processing. Psychological Review 82, 407–428.',
 desc:'The idea network with activation shown as the size of a glow around each node, spreading from a chosen source; bars give the activation of each idea, and a panel shows the faster response to related words.',
 dur:10,hint:'Choose the starting idea and how much activation survives each step. Nearby ideas glow; distant ones barely change.',
 init:()=>({src:0,keep:.5}),
 watch(p){return {src:[0,1,3][Math.min(2,Math.floor(p*3))],keep:.5}},
 ui:[{choose:[[0,'Bread'],[1,'Yeast'],[3,'Microbes'],[7,'Prices']],label:'Start from',get:s=>s.src,act:'src'},{range:'keep',label:'Kept per step',min:.2,max:.8,step:.1,get:s=>s.keep,act:'keep',show:v=>Math.round(v*100)+'%'}],
 on:{src(s,v){s.src=Number(v)},keep(s,v){s.keep=Number(v)}},
 draw(s){
  const n=T1_NET.names.length,d=Array(n).fill(9);d[s.src]=0;const q=[s.src];while(q.length){const a=q.shift();for(const [u,v] of T1_NET.edges){const b=u===a?v:v===a?u:-1;if(b>=0&&d[b]>d[a]+1){d[b]=d[a]+1;q.push(b)}}}
  const act=d.map(k=>Math.pow(s.keep,k));let out=heading('Activation spreads along links and weakens with distance');
  T1_NET.edges.forEach(([u,v])=>{const a=T1_NET.pos[u],b=T1_NET.pos[v];out+=L(a[0]*.58+4,a[1]*.9+10,b[0]*.58+4,b[1]*.9+10,C.line,1.5)});
  T1_NET.names.forEach((nm,i)=>{const p=[T1_NET.pos[i][0]*.58+4,T1_NET.pos[i][1]*.9+10];out+=(act[i]>.05?Ci(p[0],p[1],22+act[i]*20,C.amber,'none',`opacity="${(.1+act[i]*.4).toFixed(2)}"`):'')+R(p[0]-34,p[1]-13,68,26,i===s.src?C.amberp:'#fff',C.amber,13)+TF(p[0],p[1]+5,nm,13,C.ink)});
  out+=R(340,46,240,170,'#fff',C.grid,10)+TB(352,68,'Activation',14,C.ink,'start');
  const order=range(n).sort((a,b)=>act[b]-act[a]).slice(0,5);
  order.forEach((i,j)=>{const y=86+j*25;out+=TF(352,y+13,T1_NET.names[i],13,C.ink,'start')+R(430,y,100*act[i],16,C.amber,'none',3)+TF(566,y+13,Math.round(act[i]*100),13,C.muted,'end')});
  out+=R(340,228,240,118,C.pale,'none',10)+TB(352,250,'Lexical decision',14,C.ink,'start')+TF(352,272,'BUTTER after BREAD: faster',13,C.green,'start')+TF(352,292,'BUTTER after NURSE: slower',13,C.coral,'start')+TF(352,318,'gap about 80–90 ms',13,C.ink,'start')+TF(352,336,'(Meyer & Schvaneveldt 1971)',13,C.muted,'start');
  return {svg:out,phase:`Starting from ${T1_NET.names[s.src]}, ideas one link away get ${Math.round(s.keep*100)}% of the activation, two links away ${Math.round(s.keep*s.keep*100)}%. The model is a simplification; the priming effect itself is one of the best replicated findings in cognitive psychology.`};
 }});

SCENE({id:'associative-trails-blazers',name:'Trail blazers',tag:'Paths made for other people',
 definition:'Bush predicted “a new profession of trail blazers”: people who enjoy building useful trails through the record and share them, so that a reader can follow an expert’s path instead of searching alone.',
 example:'A newcomer to the history of bread can follow a historian’s trail of five well-chosen items instead of reading through a whole shelf.',
 research:'Bush, V. (1945). As We May Think. The Atlantic Monthly 176(1), 101–108. Modern parallels include curated reading lists and annotated bibliographies.',
 desc:'A shelf of items examined one by one in shelf order beside a shared trail; bars compare how many items a reader looks at to find the three that matter.',
 dur:10,hint:'Change the size of the shelf. The reader without a trail must look through items in order; the trail goes straight to the useful ones.',
 init:()=>({n:24}),
 watch(p){return {n:[8,16,24,40,60][Math.min(4,Math.floor(p*5))]}},
 ui:[{range:'n',label:'Items on the shelf',min:6,max:60,step:2,get:s=>s.n,act:'n',show:v=>v+' items'}],
 on:{n(s,v){s.n=Number(v)}},
 draw(s){
  const n=s.n,useful=[Math.round(n*.3),Math.round(n*.55),Math.round(n*.85)],search=useful[2]+1,trail=4;
  let out=heading('Searching alone or following someone’s trail');
  const cols=Math.min(n,30),rows=Math.ceil(n/cols),cw=520/cols;
  for(let i=0;i<n;i++){const x=40+(i%cols)*cw,y=60+Math.floor(i/cols)*44,u=useful.includes(i),seen=i<search;out+=R(x,y,cw-3,36,u?C.green:seen?'#c9d7e1':'#fff',u?C.green:C.line,3)}
  out+=TF(40,60+rows*44+16,'shelf order: the lone reader checks each item in turn until all three useful ones are found',13,C.muted,'start');
  const y0=60+rows*44+40;
  out+=TF(40,y0+18,'Alone',14,C.ink,'start')+R(120,y0+4,420*search/62,22,C.coral,'none',4)+TF(124+420*search/62,y0+20,search+' items',13,C.coral,'start');
  out+=TF(40,y0+54,'Trail',14,C.ink,'start')+R(120,y0+40,420*trail/62,22,C.green,'none',4)+TF(124+420*trail/62,y0+56,trail+' items',13,C.green,'start');
  return {svg:out,phase:`On a shelf of ${n}, the lone reader looks at ${search} items to find the three useful ones; the trail visits ${trail} (the three, plus the blazer’s introduction). Positions are illustrative, but the gap grows with the size of the record, which was Bush’s worry in 1945.`};
 }});

/* ---------------- Lesson: Non-sequential writing ---------------- */
const T1_PARAS=[{t:'A · Links',needs:[2]},{t:'B · Order',needs:[0]},{t:'C · Examples',needs:[1]},{t:'D · Paths',needs:[0]},{t:'E · Getting lost',needs:[3]}];
function T1_violations(order){let v=0;order.forEach((p,i)=>{for(const n of T1_PARAS[p].needs)if(!order.slice(0,i).includes(n))v++});return v}
SCENE({id:'non-sequential-writing',name:'Non-sequential writing',tag:'Ideas do not come in a line',
 definition:'Nelson’s starting point was that ideas form a web of connections, while paper forces them into one order. Whatever order a writer chooses, some idea will appear before something it depends on. He called his alternative non-sequential writing.',
 example:'Paragraph A needs C, C needs B and B needs A. No printed order can put all three after what they depend on; one forward reference is unavoidable.',
 research:'Nelson, T. H. (1974). Computer Lib/Dream Machines (self-published). Nelson, T. H. (1981). Literary Machines. Mindful Press (on non-sequential writing).',
 desc:'Five paragraphs with arrows showing which depends on which; the reader builds a printed order, and each forward reference (a paragraph placed before something it needs) is counted.',
 dur:12,hint:'Press the paragraphs in the order you would print them. Each one placed before something it needs counts as a forward reference. Try to reach zero.',
 init:()=>({order:[]}),
 watch(p){const o=[0,1,2,3,4];return {order:o.slice(0,Math.min(5,Math.floor(p*6)))}},
 ui:[{b:'Undo',act:'undo'}],
 on:{add(s,i){i=Number(i);if(!s.order.includes(i))s.order.push(i)},undo(s){s.order.pop()},reset(s){s.order=[]}},
 draw(s,f,X){
  let out=heading('Print them in one order: something comes too early');
  const pos=[[85,90],[275,90],[180,190],[85,290],[275,290]];
  T1_PARAS.forEach((p,i)=>p.needs.forEach(n=>{const flat=pos[i][1]===pos[n][1],vert=pos[i][0]===pos[n][0];out+=arrowR(pos[i],pos[n],flat?60:vert?24:40,flat?64:vert?28:44,C.blue,2)}));
  T1_PARAS.forEach((p,i)=>{const used=s.order.includes(i);out+=hit(X,'add',i,`Print ${p.t} next`,R(pos[i][0]-58,pos[i][1]-22,116,44,used?'#eef2f5':'#fff',used?C.line:C.blue,8)+TF(pos[i][0],pos[i][1]+5,p.t,13,used?C.muted:C.ink))});
  out+=TF(180,350,'arrow: “needs” (points to what must come first)',13,C.muted);
  out+=R(352,46,228,300,'#fff',C.grid,10)+TB(366,70,'Printed order',14,C.ink,'start');
  s.order.forEach((p,k)=>{const y=86+k*40,bad=T1_PARAS[p].needs.filter(n=>!s.order.slice(0,k).includes(n)).length;out+=R(366,y,200,32,bad?C.coralp:C.greenp,'none',6)+TF(376,y+21,`${k+1}. ${T1_PARAS[p].t}`,13,C.ink,'start')+(bad?TF(560,y+21,'early',13,C.coral,'end'):'')});
  const v=T1_violations(s.order);
  out+=TB(466,330,s.order.length?`${v} forward reference${v===1?'':'s'}`:'',14,v?C.coral:C.green);
  return {svg:out,phase:s.order.length<5?`Printed ${s.order.length} of 5. A needs C, C needs B, B needs A: a loop, so at least one forward reference is unavoidable on paper.`:`All five printed with ${v} forward reference${v===1?'':'s'}. The best possible is 1, because of the loop A → C → B → A. With links instead of a fixed order, each reader can go to what they need first.`};
 }});

SCENE({id:'non-sequential-writing-orders',name:'How many orders?',tag:'One book, many readings',
 definition:'A printed text offers one order. A set of n separate chunks can be read in n × (n−1) × … × 1 orders (n factorial). Links make a middle way: the writer chooses which moves make sense, and each reader chooses among them.',
 example:'Five chunks can be read in 120 orders, ten chunks in 3,628,800. A book picks one; a hypertext with a few links per chunk lets readers take many sensible paths.',
 research:'Nelson, T. H. (1965). Complex information processing: a file structure for the complex, the changing and the indeterminate. Proceedings of the ACM 20th National Conference, 84–100.',
 desc:'A log-scale bar chart comparing the single printed order with the number of possible orders of n chunks, and a row of chunks drawn below.',
 dur:10,hint:'Change the number of chunks and watch the possible orders explode. The bars use a logarithmic scale.',
 init:()=>({n:5}),
 watch(p){return {n:2+Math.min(10,Math.floor(p*11))}},
 ui:[{range:'n',label:'Chunks',min:2,max:12,step:1,get:s=>s.n,act:'n',show:v=>v+' chunks'}],
 on:{n(s,v){s.n=Number(v)}},
 draw(s){
  const n=s.n;let fact=1;for(let i=2;i<=n;i++)fact*=i;
  let out=heading('A book has one order; separate chunks have n! orders');
  for(let i=0;i<n;i++)out+=R(40+i*44,56,38,30,C.pale,C.blue,5)+TF(59+i*44,76,String.fromCharCode(65+i),13,C.ink);
  const lg=v=>Math.log10(Math.max(1,v)),W=380,maxL=9;
  const bar=(y,label,v,col)=>TF(40,y+20,label,14,C.ink,'start')+R(170,y,Math.max(3,W*lg(v)/maxL),28,col,'none',4)+TF(176+Math.max(3,W*lg(v)/maxL),y+20,v.toLocaleString('en-GB'),13,col,'start');
  out+=bar(120,'Printed book',1,C.blue)+bar(170,'Any order',fact,C.coral);
  out+=L(170,220,170,232,C.muted,1.5);for(let k=0;k<=9;k+=3)out+=L(170+W*k/maxL,224,170+W*k/maxL,232,C.muted,1.5)+TF(170+W*k/maxL,250,'10'+['⁰','','','³','','','⁶','','','⁹'][k],13,C.muted);
  out+=TF(300,276,'logarithmic scale',13,C.muted);
  out+=R(40,292,520,56,'#f3f7fa','none',8)+TF(300,316,'Links sit between these extremes: the writer offers sensible moves,',13,C.ink)+TF(300,336,'and each reader chooses a path among them.',13,C.ink);
  return {svg:out,phase:`${n} chunks: 1 printed order against ${fact.toLocaleString('en-GB')} possible orders. Most of those orders make no sense, which is why Nelson wanted links chosen by the writer rather than a free shuffle.`};
 }});

const T1_PREC={
 talmud:{name:'A Talmud page',lines:['The core text sits in the centre.','Rashi’s commentary runs on the inner side,','the Tosafot on the outer side, with','cross-references in the margins.'],note:'Layout standard since the printed editions of the 1500s; the Vilna edition (1880s) fixed it.'},
 footnote:{name:'Footnotes',lines:['A mark in the text sends the reader','to a note at the foot of the page','and back again: a small, one-way jump','that every printed scholar uses.'],note:'Common in printed scholarship from the 1600s; marginal notes are far older.'},
 encyclopedia:{name:'Encyclopedia cross-references',lines:['“See also” entries let readers jump','between articles. The French Encyclopédie','(1751–72) used them deliberately, partly','to steer readers past the censors.'],note:'Diderot and d’Alembert described their system of renvois (references).'}};
SCENE({id:'non-sequential-writing-precedents',name:'Older non-sequential texts',tag:'Paper was already straining',
 definition:'Non-sequential writing did not start with computers. Commentaries, footnotes and cross-references are all ways of escaping a single line on paper. Nelson’s claim was that a computer could make such jumps easy and complete instead of clumsy and partial.',
 example:'A reader of a Talmud page moves between the core text and centuries of commentary arranged around it, a layout that works like a page of links.',
 research:'Nelson, T. H. (1981). Literary Machines. Mindful Press. Bolter, J. D. (1991). Writing Space: The Computer, Hypertext, and the History of Writing. Lawrence Erlbaum.',
 desc:'A schematic page for the chosen precedent: commentary arranged around a core text, a note at the foot of a page, or articles joined by “see also” references.',
 dur:12,hint:'Choose a precedent to see how it lets a reader leave the main line of text and come back.',
 init:()=>({k:'talmud'}),
 watch(p){return {k:['talmud','footnote','encyclopedia'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['talmud','Talmud page'],['footnote','Footnotes'],['encyclopedia','Cross-references']],label:'Precedent',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v}},
 draw(s){
  const d=T1_PREC[s.k];let out=heading(d.name+': escaping a single line on paper');
  const bars=(x,y,w,n,col='#cfdbe3',gap=11)=>range(n).map(r=>R(x,y+r*gap,w-(r*37)%(w*.3),5,col,'none',2)).join('');
  out+=R(30,50,250,300,'#fffdf6',C.line,6);
  if(s.k==='talmud'){out+=R(90,100,130,150,C.pale,C.blue,4)+bars(98,110,114,12,'#9cbad0')+TF(155,272,'core text',13,C.blue);
   out+=bars(40,60,40,26)+bars(230,60,40,26)+bars(40,60+0,0,0)+TF(60,340,'Rashi',13,C.muted)+TF(250,340,'Tosafot',13,C.muted)+bars(90,62,130,3);}
  else if(s.k==='footnote'){out+=bars(46,66,218,16,'#9cbad0',12)+T(150,124,'¹',16,C.coral)+L(46,280,150,280,C.muted,1)+T(52,300,'¹',14,C.coral,'start')+bars(62,294,190,3,'#e0c4b8',10);
   out+=P('M156 118 C 270 150 270 270 60 296',C.coral,2,'none','stroke-dasharray="5 4"');}
  else{out+=R(42,62,106,130,'#fff',C.line,4)+bars(50,72,90,8)+TF(95,180,'see BREAD',13,C.blue)+R(162,200,106,130,'#fff',C.line,4)+bars(170,210,90,8)+TF(215,318,'see YEAST',13,C.blue);
   out+=arrow(120,186,190,206,C.blue,2)+arrow(170,296,104,196,C.blue,2,9,'stroke-dasharray="4 4"');}
  d.lines.forEach((l,i)=>out+=TF(300,96+i*26,l,13,C.ink,"start"));
  out+=R(300,222,280,86,'#f3f7fa','none',8)+TF(312,246,d.note.slice(0,46),13,C.muted,'start')+TF(312,266,d.note.slice(46,92),13,C.muted,'start')+TF(312,286,d.note.slice(92),13,C.muted,'start');
  return {svg:out,phase:`${d.name}: ${d.lines.join(' ')}`};
 }});

/* ---------------- Lesson: Index cards ---------------- */
const T1_CARDS=[{t:'Links can break',topics:[0,2]},{t:'Readers pick paths',topics:[0,1]},{t:'Quotes keep source',topics:[1,2]},{t:'Versions are kept',topics:[2,0]},{t:'Ideas form a web',topics:[1,0]},{t:'Paper forces order',topics:[1,2]}];
const T1_TOPICS=['Links','Reading','Publishing'];
SCENE({id:'index-cards',name:'Index cards',tag:'One card, one place',
 definition:'As a student, Nelson tried to organise his notes on index cards and found that each card could sit in only one place, while most ideas belonged in several. A computer, he reasoned, could let one note appear wherever it belonged.',
 example:'A card saying “quotations should keep their source” belongs under Reading and under Publishing. In a card box you must choose one, and it disappears from the other.',
 research:'Nelson, T. H. (2010). Possiplex: Movies, Intellect, Creative Control, My Computer Life and the Fight for Civilization (autobiography). Barnet, B. (2013). Memory Machines: The Evolution of Hypertext. Anthem Press.',
 desc:'Six note cards, each belonging to two of three topics. In card-box mode each card is filed under one topic and counted as missing from the other; in linked mode every card appears under all its topics.',
 dur:12,hint:'Press a card to move it to its other topic. Then switch to linked notes and see every card appear wherever it belongs.',
 init:()=>({mode:'box',file:[0,0,0,0,0,0]}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {mode:k<3?'box':'linked',file:k===0?[0,0,0,0,0,0]:k===1?[0,1,1,0,1,1]:[1,0,0,1,0,0]}},
 ui:[{choose:[['box','Card box'],['linked','Linked notes']],label:'Storage',get:s=>s.mode,act:'mode'}],
 on:{mode(s,v){s.mode=v},card(s,i){i=Number(i);s.file[i]=1-s.file[i]}},
 draw(s,f,X){
  let out=heading(s.mode==='box'?'A card box: every card lives in exactly one drawer':'Linked notes: one note, shown wherever it belongs');
  const cols=[[30,'#e8f1f8'],[220,'#eef6f2'],[410,'#f5f0fa']];let missing=0;
  T1_TOPICS.forEach((tp,c)=>{const x=cols[c][0];out+=R(x,48,160,300,cols[c][1],C.line,8)+TB(x+80,72,tp,15,C.ink);
   let k=0;T1_CARDS.forEach((cd,i)=>{if(!cd.topics.includes(c))return;const here=s.mode==='linked'||cd.topics[s.file[i]]===c;const y=88+k*42;k++;
    if(here)out+=hit(X,'card',i,`Move card “${cd.t}”`,R(x+10,y,140,34,'#fff',s.mode==='linked'?C.green:C.blue,5)+TF(x+80,y+22,cd.t,13,C.ink));
    else{missing++;out+=R(x+10,y,140,34,'none',C.line,5,'stroke-dasharray="4 4"')+TF(x+80,y+22,'(filed elsewhere)',13,C.muted)}})});
  out+=TB(300,370,s.mode==='box'?`${missing} of 12 places left empty`:'0 of 12 places empty',14,s.mode==='box'?C.coral:C.green);
  return {svg:out,phase:s.mode==='box'?`Each card belongs to two topics but can be filed in only one drawer, so ${missing} of the 12 places a card belongs are empty. Moving a card just moves the gap.`:'With linked notes each note exists once and appears under every topic it belongs to. Edit it in one place and all its appearances change, an early form of what Nelson later called transclusion.'};
 }});

const T1_ZK0=['1','2','1a','1b','1a1'];
function T1_zkSort(a){const key=s=>s.match(/\d+|[a-z]+/g).map(t=>/\d/.test(t)?t.padStart(4,'0'):'~'+t);return a.slice().sort((x,y)=>{const a=key(x),b=key(y);for(let i=0;i<Math.max(a.length,b.length);i++){if(a[i]===undefined)return -1;if(b[i]===undefined)return 1;if(a[i]!==b[i])return a[i]<b[i]?-1:1}return 0})}
function T1_next(addr){const m=addr.match(/(\d+|[a-z]+)$/)[0];const base=addr.slice(0,-m.length);return base+(/\d/.test(m)?String(Number(m)+1):String.fromCharCode(m.charCodeAt(m.length-1)+1))}
function T1_child(addr){return addr+(/\d$/.test(addr)?'a':'1')}
SCENE({id:'index-cards-zettel',name:'A card index that branches',tag:'Luhmann’s numbering, from 1951',
 definition:'The sociologist Niklas Luhmann kept about 90,000 note cards. Each had a fixed address: a new card continuing a thought took the next number, and a card branching off took a letter or digit added to its parent’s address, so nothing ever had to be renumbered.',
 example:'After card 21 comes 22; a side thought from 21 becomes 21a, and a side thought from 21a becomes 21a1. A card can also cite any other card by its address.',
 research:'Luhmann, N. (1981). Kommunikation mit Zettelkästen. In Öffentliche Meinung und sozialer Wandel. Schmidt, J. F. K. (2016). Niklas Luhmann’s card index: thinking tool, communication partner, publication machine. In Forgetting Machines, Brill.',
 desc:'A drawer of cards in address order, with branches drawn as indents; buttons add a continuing card or a branching card after the selected one.',
 dur:12,hint:'Select a card, then add a card that continues it or branches from it. Addresses are never changed, so references to them never break.',
 init:()=>({cards:T1_ZK0.slice(),sel:'1a'}),
 watch(p){const k=Math.min(4,Math.floor(p*5));const add=[[],['1a2'],['1a2','1a1a'],['1a2','1a1a','3'],['1a2','1a1a','3','2a']][k];return {cards:T1_ZK0.concat(add),sel:add[add.length-1]||'1a'}},
 ui:[{b:'Add a continuing card',act:'cont'},{b:'Add a branch',act:'branch'}],
 on:{sel(s,a){s.sel=a},cont(s){let a=T1_next(s.sel);while(s.cards.includes(a))a=T1_next(a);if(s.cards.length<11){s.cards.push(a);s.sel=a}},
  branch(s){let a=T1_child(s.sel);while(s.cards.includes(a))a=T1_next(a);if(s.cards.length<11){s.cards.push(a);s.sel=a}},reset(s){s.cards=T1_ZK0.slice();s.sel='1a'}},
 draw(s,f,X){
  let out=heading('Fixed addresses: insert anywhere, renumber nothing');
  const list=T1_zkSort(s.cards);
  list.forEach((a,i)=>{const depth=(a.match(/\d+|[a-z]+/g)||[]).length-1,x=40+depth*40,y=50+i*29,on=a===s.sel;
   out+=hit(X,'sel',a,`Select card ${a}`,R(x,y,170,25,on?C.blue:'#fffdf6',on?C.blue:C.line,4)+TMF(x+12,y+18,a,13,on?'#fff':C.ink,'start')+R(x+64,y+10,90,5,on?'#9cc5e6':'#ddd2b8','none',2))});
  out+=R(360,50,220,290,'#f3f7fa','none',10)+TB(374,76,'Selected card',14,C.ink,'start')+TMF(374,104,s.sel,18,C.blue,'start');
  out+=TF(374,136,'next continuing card:',13,C.muted,'start')+TMF(374,156,(()=>{let a=T1_next(s.sel);while(s.cards.includes(a))a=T1_next(a);return a})(),14,C.ink,'start');
  out+=TF(374,186,'next branch:',13,C.muted,'start')+TMF(374,206,(()=>{let a=T1_child(s.sel);while(s.cards.includes(a))a=T1_next(a);return a})(),14,C.ink,'start');
  out+=TF(374,244,'Digits and letters alternate,',13,C.ink,'start')+TF(374,264,'so every level of a branch',13,C.ink,'start')+TF(374,284,'can grow without limit.',13,C.ink,'start')+TF(374,318,`${s.cards.length} cards`,13,C.muted,'start');
  return {svg:out,phase:`${s.cards.length} cards, sorted by address. Card ${s.sel} keeps its address whatever is added later. Xanadu’s tumbler addresses (era 5) work on the same principle of fixed, growable addresses.`};
 }});

const T1_FEAT=[{k:'store',n:'Store text',ok:'yes',why:'Text could be punched on cards or tape and stored.'},{k:'edit',n:'Edit on a screen',ok:'rare',why:'Interactive screens were rare research machines; most work was by batch.'},{k:'versions',n:'Keep every version',ok:'no',why:'Storage was far too scarce to keep old drafts.'},{k:'compare',n:'Compare versions side by side',ok:'no',why:'No system showed two texts with their links.'},{k:'link',n:'Link any part to any part',ok:'no',why:'Files were whole records, not addressable passages.'}];
SCENE({id:'index-cards-harvard',name:'A term project, 1960',tag:'Where Xanadu began',
 definition:'In 1960, as a graduate student, Nelson took a computer course at Harvard and chose as his term project a system for writers: store text, edit it, keep earlier versions and compare them, with connections between parts. He did not finish it, but he has described it as the start of Project Xanadu.',
 example:'What a writer wanted (to see two drafts side by side with their shared passages joined) was far beyond the batch-processing machines of the day.',
 research:'Nelson, T. H. (2010). Possiplex (autobiography). Barnet, B. (2013). Memory Machines: The Evolution of Hypertext. Anthem Press, chapter on Xanadu. Wardrip-Fruin, N. & Montfort, N. (eds) (2003). The New Media Reader. MIT Press.',
 desc:'A checklist of five features Nelson wanted in 1960, each marked as possible, rare or not possible on the computers of the day, with a short reason for the selected feature.',
 dur:12,hint:'Press a feature to see whether a computer of 1960 could provide it, and why.',
 init:()=>({k:2}),
 watch(p){return {k:Math.min(4,Math.floor(p*5))}},
 on:{k(s,v){s.k=Number(v)}},
 draw(s,f,X){
  let out=heading('What a writer wanted in 1960, and what computers offered');
  const col={yes:C.green,rare:C.amber,no:C.coral},lab={yes:'possible',rare:'rare',no:'not yet'};
  T1_FEAT.forEach((ft,i)=>{const y=52+i*46,on=i===s.k;out+=hit(X,'k',i,`About: ${ft.n}`,R(30,y,330,38,on?C.pale:'#fff',on?C.blue:C.line,8)+TF(46,y+24,ft.n,14,C.ink,'start')+R(262,y+8,84,22,col[ft.ok],'none',11)+TF(304,y+24,lab[ft.ok],13,'#fff'))});
  const ft=T1_FEAT[s.k];
  out+=R(380,52,200,224,'#f3f7fa','none',10)+TB(392,78,ft.n.length>22?ft.n.slice(0,22)+'…':ft.n,14,C.ink,'start');
  const words=ft.why.split(' ');let line='',ly=106;for(const w of words){if((line+' '+w).length>24){out+=TF(392,ly,line.trim(),13,C.ink,'start');ly+=20;line=''}line+=' '+w}out+=TF(392,ly,line.trim(),13,C.ink,'start');
  out+=R(30,290,550,56,'#fff',C.grid,8)+TF(305,314,'The wish list became the design of Project Xanadu:',13,C.ink)+TF(305,334,'versions, side-by-side comparison and links between any parts.',13,C.ink);
  return {svg:out,phase:`${ft.n}: ${lab[ft.ok]} in 1960. ${ft.why} The judgements are a general picture of computing in 1960, not a claim about any one machine.`};
 }});
