/* ===================== Stage 3 · Organise data ===================== */
const OR_LET='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const OR_hash=k=>sum(Array.from(k).map(c=>c.codePointAt(0)))%8;

SCENE({id:'array',name:'Array',tag:'Items side by side',
 definition:'A fixed-order list of items stored next to each other in memory, so any item can be reached directly from its index.',
 example:'If a starts at address 200 and each item takes 4 bytes, a[3] is at 200 + 3 × 4 = 212: one calculation, however long the array. Inserting at the front means shifting every item along.',
 desc:'A row of numbered cells with memory addresses underneath; reading an index jumps straight to its cell, while inserting at the start shifts every item one place right.',
 dur:11,hint:'Press a cell to read it in one step. Insert at the start and count how many items have to move.',
 init:()=>({items:['A','B','C','D','E'],read:null,moves:null,last:'',next:5}),
 watch(p){const base=['A','B','C','D','E'];if(p<.5){const r=[3,0,4][Math.min(2,Math.floor(p/.5*3))];return {items:base,read:r,moves:null,last:'read'}}
  const u=smooth((p-.55)/.3);return {items:['Z',...base],read:null,moves:p>.55?5:null,last:'insert at start',anim:1-u}},
 ui:[{b:'Insert at start',act:'front'},{b:'Append at end',act:'append'},{b:'Delete first',act:'delFirst'},{b:'Delete last',act:'delLast'}],
 on:{read(s,i){s.read=Number(i);s.moves=0;s.last='read'},
  front(s){if(s.items.length>=9)return;s.moves=s.items.length;s.items.unshift(OR_LET[s.next++%26]);s.read=null;s.last='insert at start'},
  append(s){if(s.items.length>=9)return;s.items.push(OR_LET[s.next++%26]);s.moves=0;s.read=null;s.last='append'},
  delFirst(s){if(!s.items.length)return;s.items.shift();s.moves=s.items.length;s.read=null;s.last='delete first'},
  delLast(s){if(!s.items.length)return;s.items.pop();s.moves=0;s.read=null;s.last='delete last'}},
 draw(s,f,X){
  const w=58,g=4,x0=40,n=s.items.length,anim=s.anim||0;let out=heading('Every item has a numbered slot');
  for(let i=0;i<9;i++){const x=x0+i*(w+g);out+=R(x,120,w,58,'none',C.grid,6,'stroke-dasharray="4 4"')+TM(x+w/2,200,200+4*i,13,C.muted)+(i<n?TM(x+w/2,108,'['+i+']',14,i===s.read?C.amber:C.muted):'')}
  s.items.forEach((v,i)=>{let x=x0+i*(w+g),y=120,op=1;
   if(anim>0){if(i===0)op=1-anim;else x=x0+(i-anim)*(w+g)}
   const hl=i===s.read;
   out+=G(hit(X,'read',i,`Read a[${i}], which holds ${v}`,R(x,y,w,58,hl?C.amberp:i===0&&s.last==='insert at start'?C.coralp:'#fff',hl?C.amber:C.blue,6)+TB(x+w/2,y+37,v,22,C.ink)),`opacity="${fmt(op)}"`);
  });
  out+=T(580,228,'memory address of each slot',13,C.muted,'end');
  if(s.read!==null&&s.read<n){const x=x0+s.read*(w+g)+w/2;out+=arrow(x,272,x,214,C.amber,2.5)+R(130,276,340,40,'#fff',C.amber,8)+TM(300,302,`a[${s.read}] at 200 + ${s.read} × 4 = ${200+4*s.read}`,15,C.ink)}
  else if(s.moves!==null)out+=R(130,276,340,40,s.moves?C.coralp:C.greenp,'none',8)+T(300,302,`${s.last}: ${s.moves} item${s.moves===1?'':'s'} had to move`,16,C.ink);
  out+=T(300,350,`${n} of 9 slots used · reading is one step · inserting at the start moves ${n>0?n-(s.last==='insert at start'?1:0):0}`,14,C.muted);
  const say=s.read!==null?`a[${s.read}] = ${s.items[s.read]}: the address is calculated directly, so reading index ${s.read} costs the same as reading index 0.`:s.last==='insert at start'?`To make room at the front, every existing item shifted one slot right: ${s.moves} moves. The longer the array, the slower this is.`:s.last==='append'?'Appending uses the next free slot: nothing else moves.':s.last?`${s.last}: ${s.moves} item${s.moves===1?'':'s'} moved.`:'Press a cell to read it.';
  return {svg:out,phase:say};
 }});

function OR_addr(v){return '@'+hex((v.charCodeAt(0)*37+11)%256)+'0'}
SCENE({id:'linked-list',name:'Linked list',tag:'Items chained by pointers',
 definition:'A list where each item (a node) stores its value and a pointer to the next node. Nodes can live anywhere in memory.',
 example:'Adding at the head needs one pointer change, however long the list. But reaching the 4th item means following 3 pointers from the head: there is no a[3] shortcut.',
 desc:'Nodes scattered in memory, each with a value and an arrow to the next; the head pointer marks the start and the last node points to nothing.',
 dur:11,hint:'Press a node to see how many pointers you follow to reach it. Insert at the head, or after the selected node.',
 init:()=>({nodes:['A','B','C','D'],sel:null,next:4,last:''}),
 watch(p){if(p<.55){const k=Math.min(3,Math.floor(p/.55*4));return {nodes:['A','B','C','D'],sel:k,last:'walk'}}return {nodes:['N','A','B','C','D'],sel:null,last:'head',fresh:smooth((p-.6)/.25)}},
 ui:[{b:'Insert at head',act:'head'},{b:'Insert after selected',act:'after'},{b:'Delete selected',act:'del'}],
 on:{sel(s,i){s.sel=Number(i);s.last='walk'},
  head(s){if(s.nodes.length>=6)return;s.nodes.unshift(OR_LET[13+s.next++%13]);s.sel=null;s.last='head'},
  after(s){if(s.nodes.length>=6||s.sel===null)return;s.nodes.splice(s.sel+1,0,OR_LET[13+s.next++%13]);s.last='after';s.sel=s.sel+1},
  del(s){if(s.sel===null)return;s.nodes.splice(s.sel,1);s.last='del';s.sel=null}},
 draw(s,f,X){
  const n=s.nodes.length,pos=i=>[30+i*95,150+(i%2)*64];let out=heading('Each node points to the next');
  const reach=s.last==='walk'&&s.sel!==null?s.sel:-1;
  out+=R(30,58,70,30,C.dark,'none',6)+T(65,79,'head',14,'#fff');
  if(n)out+=arrow(65,88,65,146,reach>=0?C.coral:C.ink,2.5);
  s.nodes.forEach((v,i)=>{const [x,y]=pos(i),sel=i===s.sel,isNew=(s.last==='head'&&i===0)||(s.last==='after'&&sel),fy=s.fresh!==undefined&&i===0?y-50*(1-s.fresh):y;
   out+=hit(X,'sel',i,`Node ${i+1}, value ${v}`,R(x,fy,72,44,sel?C.amberp:isNew?C.greenp:'#fff',sel?C.amber:isNew?C.green:C.blue,7)+L(x+46,fy+2,x+46,fy+42,C.line,2)+TB(x+23,fy+29,v,19,C.ink)+Ci(x+59,fy+22,4,C.ink));
   out+=TM(x+36,fy+64,OR_addr(v),13,C.muted);
   if(i<n-1){const [x2,y2]=pos(i+1);out+=arrow(x+63,fy+22,x2-2,y2+22,i<reach?C.coral:C.ink,2.2,8)}
   else out+=arrow(x+63,fy+22,x+90,fy+22,C.ink,2,7)+T(x+92,fy+46,'null',13,C.muted,'middle');
  });
  if(!n)out+=T(300,180,'The list is empty: head points to null.',17,C.muted);
  const msg=reach>=0?`Reaching node ${reach+1} (${s.nodes[reach]}) means following ${reach} pointer${reach===1?'':'s'} from the head.`:s.last==='head'?'Insert at head: the new node points to the old first node, and head points to the new node. Nothing moves.':s.last==='after'?'Insert after: two pointer changes splice the new node in. No items shift.':s.last==='del'?'Delete: the previous pointer now skips the removed node.':'Press a node.';
  out+=R(60,300,480,48,'#fff',C.grid,8)+T(300,330,reach>=0?`hops from head: ${reach}`:`${n} node${n===1?'':'s'} · addresses are scattered, not side by side`,16,reach>=0?C.coral:C.ink);
  return {svg:out,phase:msg+' Grey labels are made-up memory addresses: the nodes need not be next to each other.'};
 }});

function OR_stackRun(ops){const st=[];let popped=null,next=0;for(const o of ops){popped=null;if(o==='push'&&st.length<7)st.push(OR_LET[next++%26]);else if(o==='pop'&&st.length)popped=st.pop()}return {items:st,popped,next,last:ops[ops.length-1]||null}}
const OR_STACK_OPS=['push','push','push','pop','push','pop','pop','push'];
SCENE({id:'stack',name:'Stack',tag:'Last in, first out',
 definition:'A collection where you can add (push) and remove (pop) items only at one end, the top. The last item pushed is the first popped.',
 example:'Undo in an editor is a stack: each action is pushed, and Undo pops the most recent one. A pile of plates works the same way.',
 desc:'Items stacked inside an open container; pushes land on top, pops remove from the top, and a log of operations runs alongside.',
 dur:11,hint:'Push, Pop and Peek. You can only ever reach the top item.',
 init:()=>({...OR_stackRun(['push','push','push']),log:['push A','push B','push C'],peek:false}),
 watch(p){const k=Math.min(OR_STACK_OPS.length,1+Math.floor(p*OR_STACK_OPS.length));const r=OR_stackRun(OR_STACK_OPS.slice(0,k));let st=[],nx=0;r.log=OR_STACK_OPS.slice(0,k).map(o=>{if(o==='push'){st.push(OR_LET[nx]);return 'push '+OR_LET[nx++]}return 'pop '+st.pop()});return r},
 ui:[{b:'Push',act:'push'},{b:'Pop',act:'pop'},{b:'Peek',act:'peek'}],
 on:{push(s){s.peek=false;s.popped=null;if(s.items.length>=7){s.last='full';return}const v=OR_LET[s.next++%26];s.items.push(v);s.last='push';s.log.push('push '+v)},
  pop(s){s.peek=false;s.popped=null;if(!s.items.length){s.last='empty';return}s.popped=s.items.pop();s.last='pop';s.log.push('pop '+s.popped)},
  peek(s){s.peek=true;s.popped=null;s.last='peek';if(s.items.length)s.log.push('peek '+s.items[s.items.length-1])}},
 draw(s){
  let out=heading('Only the top is reachable');const n=s.items.length;
  out+=P('M220 80V344H380V80',C.ink,3);
  s.items.forEach((v,i)=>{const y=340-(i+1)*37,top=i===n-1;out+=R(226,y,148,33,top&&(s.last==='push'||s.peek)?C.amberp:'#fff',top?C.amber:C.blue,6)+TB(300,y+23,v,18,C.ink)});
  if(n){const y=340-n*37+16;out+=arrow(440,y,386,y,C.amber,2.5)+T(446,y+5,'top',15,C.amber,'start','font-weight="700"')}
  if(s.popped)out+=R(470,90,70,40,C.coralp,C.coral,6)+TB(505,117,s.popped,18,C.coral)+T(505,150,'popped',14,C.coral)+curveArrow(380,110,466,104,-20,C.coral,2);
  out+=T(30,90,'operations',13,C.muted,'start');
  (s.log||[]).slice(-8).forEach((o,i,a)=>out+=TM(30,116+i*26,o,15,i===a.length-1?C.ink:C.muted,'start',i===a.length-1?'font-weight="700"':''));
  const say=s.last==='push'?`Push ${s.items[n-1]}: it goes on top.`:s.last==='pop'?`Pop returns ${s.popped}, the most recently pushed item still there.`:s.last==='peek'?(n?`Peek reads ${s.items[n-1]} without removing it.`:'Peek on an empty stack has nothing to read.'):s.last==='empty'?'The stack is empty: there is nothing to pop.':s.last==='full'?'This stack holds at most 7 items. Pushing more would overflow it.':'Push to add an item.';
  return {svg:out,phase:say+' Last in, first out.'};
 }});

function OR_queueRun(ops){const q={buf:Array(8).fill(null),head:0,size:0,next:1,served:[],last:null};for(const o of ops)OR_qop(q,o);return q}
function OR_qop(q,o){q.last=o;if(o==='enq'){if(q.size>=8){q.last='full';return}q.buf[(q.head+q.size)%8]='J'+q.next++;q.size++}else{if(!q.size){q.last='empty';return}q.served.push(q.buf[q.head]);q.buf[q.head]=null;q.head=(q.head+1)%8;q.size--}}
const OR_Q_OPS=['enq','enq','enq','deq','enq','enq','deq','enq','enq','deq','enq'];
SCENE({id:'queue',name:'Queue',tag:'First in, first out',
 definition:'A collection where items join at the back (enqueue) and leave from the front (dequeue), so they are served in arrival order.',
 example:'Print jobs, a shop till and messages waiting for a server all use queues. Here the queue lives in 8 slots used in a circle, with head and tail pointers.',
 desc:'Eight slots in a row; a head arrow marks the front item and a tail arrow marks the next free slot. Items join at the tail and leave from the head, wrapping round the end.',
 dur:12,hint:'Enqueue and dequeue. Keep going until the pointers wrap round to slot 0.',
 init:()=>OR_queueRun(['enq','enq','enq']),
 watch(p){return OR_queueRun(OR_Q_OPS.slice(0,Math.min(OR_Q_OPS.length,1+Math.floor(p*OR_Q_OPS.length))))},
 ui:[{b:'Enqueue',act:'enq'},{b:'Dequeue',act:'deq'}],
 on:{enq(s){OR_qop(s,'enq')},deq(s){OR_qop(s,'deq')}},
 draw(s){
  let out=heading('Join at the tail, leave from the head');const x0=56,w=56,g=6,tail=(s.head+s.size)%8;
  for(let i=0;i<8;i++){const x=x0+i*(w+g),v=s.buf[i],isHead=i===s.head&&s.size>0;out+=R(x,140,w,56,v?(isHead?C.amberp:'#fff'):'#f4f6f7',v?(isHead?C.amber:C.blue):C.grid,7,v?'':'stroke-dasharray="4 4"')+(v?TB(x+w/2,174,v,16,C.ink):'')+TM(x+w/2,214,i,13,C.muted)}
  const hx=x0+s.head*(w+g)+w/2,tx=x0+tail*(w+g)+w/2;
  out+=arrow(hx,96,hx,134,C.amber,2.5)+T(hx,88,'head',14,C.amber,'middle','font-weight="700"');
  out+=arrow(tx,262,tx,224,C.green,2.5)+T(tx,280,s.size>=8?'tail (full)':'tail',14,C.green,'middle','font-weight="700"');
  out+=curveArrow(x0+7*(w+g)+w/2,246,x0+w/2,246,-30,'#c7d5de',1.5);
  out+=T(30,326,'served:',14,C.muted,'start')+TM(92,326,s.served.slice(-7).join('  ')||'—',15,C.ink,'start','xml:space="preserve"');
  out+=T(570,326,`${s.size} waiting`,14,C.muted,'end');
  const say=s.last==='enq'?`Enqueue ${s.buf[(s.head+s.size-1)%8]} at the tail. The tail moves on one slot.`:s.last==='deq'?`Dequeue ${s.served[s.served.length-1]} from the head, the item that has waited longest.`:s.last==='full'?'All 8 slots are full: wait for a dequeue.':s.last==='empty'?'The queue is empty: nothing to dequeue.':'Items wait in arrival order.';
  return {svg:out,phase:say+' The slots are reused in a circle, so nothing ever has to shift along.'};
 }});

SCENE({id:'hash-function',name:'Hash function',tag:'Turn a key into a number',
 definition:'A rule that turns a key (such as a word) into a number in a fixed range, quickly and always the same way for the same key.',
 example:'Add up the character codes of “cat” (99 + 97 + 116 = 312) and take the remainder after dividing by 8: bucket 0. “cot” gives bucket 2.',
 desc:'The characters of a key with their codes, a running total, the remainder after dividing by 8, and an arrow to one of eight numbered buckets.',
 dur:10,hint:'Type a key, or pick one. Change one letter and watch the bucket jump. Try “act”, an anagram of “cat”.',
 init:()=>({key:'cat'}),
 ui:[{text:'Key',label:'Key',get:s=>s.key,act:'key',max:8},{choose:[['cat','cat'],['cot','cot'],['act','act'],['dog','dog']],label:'Examples',get:s=>s.key,act:'key'}],
 on:{key(s,v){s.key=v}},
 trace(s){const cs=Array.from(s.key).slice(0,8),fr=[];let tot=0;
  if(!cs.length)return [{k:0,tot:0,say:'Type a key to hash it.'}];
  cs.forEach((c,i)=>{tot+=c.codePointAt(0);fr.push({k:i+1,tot,say:`Add the code of “${c}” (${c.codePointAt(0)}): running total ${tot}.`})});
  fr.push({k:cs.length,tot,done:true,say:`${tot} ÷ 8 gives remainder ${tot%8}, so “${s.key}” goes in bucket ${tot%8}. The same key always lands in the same bucket.`});return fr},
 draw(s,f){
  const cs=Array.from(s.key).slice(0,8),n=cs.length;let out=heading('sum of character codes, mod 8');
  const w=Math.min(66,520/Math.max(1,n)),x0=300-n*w/2;
  cs.forEach((c,i)=>{const x=x0+i*w,on=i<f.k;out+=R(x+4,52,w-8,48,on?C.pale:'#fff',on?C.blue:C.grid,7)+T(x+w/2,84,c===' '?'␣':c,22,C.ink)+TM(x+w/2,124,c.codePointAt(0),15,on?C.blue:C.muted);if(i)out+=T(x,124,'+',14,C.muted)});
  out+=counter(200,146,'running total',f.tot,C.blue,200);
  if(f.done)out+=TM(300,232,`${f.tot} = ${Math.floor(f.tot/8)} × 8 + ${f.tot%8}`,17,C.ink);
  for(let b=0;b<8;b++){const x=40+b*66,on=f.done&&b===f.tot%8;out+=R(x,262,60,52,on?C.amberp:'#fff',on?C.amber:C.line,8)+TB(x+30,295,b,18,on?C.amber:C.muted)}
  out+=T(300,334,'buckets 0–7',13,C.muted);
  if(f.done){const bx=40+(f.tot%8)*66+30;out+=arrow(300,242,bx,258,C.amber,2.5)}
  const anag=f.done&&['cat','act','tac'].includes(s.key);
  out+=T(300,362,anag?'“cat”, “act” and “tac” share a bucket: adding ignores order. Real hash functions mix in position too.':'Small change, different bucket: a good hash spreads keys out.',13,C.muted);
  return {svg:out,phase:f.say};
 }});

const OR_PRESETS={fruit:['apple','pear','fig','kiwi','plum','lime','date'],anagram:['cat','act','tac','dog','god'],clash:['ab','ba','bb','c','k']};
function OR_lookup(keys,k){const b=OR_hash(k),chain=keys.filter(x=>OR_hash(x)===b),i=chain.indexOf(k);return {key:k,bucket:b,cmp:i>=0?i+1:chain.length,found:i>=0,upto:i>=0?i:chain.length-1}}
SCENE({id:'hash-table',name:'Hash table',tag:'Find without searching',
 definition:'A table of buckets where each key is stored in the bucket its hash function picks. To find a key, hash it and look only in that bucket.',
 example:'With 8 buckets, “fig” hashes to 6, so a look-up checks bucket 6 only. When two keys share a bucket (a collision) they form a short chain.',
 desc:'Eight bucket rows, each with a chain of keys; buckets holding more than one key are marked as collisions, and a look-up highlights the bucket and the keys it compares.',
 dur:12,hint:'Type a key, then Insert or Look up. Try the anagram preset to force collisions.',
 init:()=>({keys:['apple','pear','fig','kiwi'],input:'plum',look:null,last:''}),
 watch(p){const all=OR_PRESETS.fruit,k=Math.min(all.length,Math.floor(p*(all.length+2)));const keys=all.slice(0,Math.max(1,k));return {keys,input:'',look:p>.82?OR_lookup(keys,'lime'):null,last:p>.82?'look':'insert'}},
 ui:[{text:'Key',label:'Key',get:s=>s.input,act:'input',max:10},{b:'Insert',act:'insert'},{b:'Look up',act:'look'},{choose:[['fruit','Fruit'],['anagram','Anagrams'],['clash','Clashes']],label:'Presets',get:s=>s.preset||'',act:'preset'},{b:'Clear',act:'clear'}],
 on:{input(s,v){s.input=v;return 'keep'},
  insert(s){const k=s.input.trim();if(!k)return;if(!s.keys.includes(k)&&s.keys.length<20)s.keys.push(k);s.look=OR_lookup(s.keys,k);s.last='insert'},
  look(s){const k=s.input.trim();if(!k)return;s.look=OR_lookup(s.keys,k);s.last='look'},
  preset(s,v){s.keys=OR_PRESETS[v].slice();s.preset=v;s.look=null;s.last=''},clear(s){s.keys=[];s.look=null;s.preset='';s.last=''}},
 draw(s){
  let out=heading('Hash the key, then look in one bucket');const rh=33,y0=46;let coll=0;
  for(let b=0;b<8;b++){const y=y0+b*rh,chain=s.keys.filter(k=>OR_hash(k)===b),lk=s.look&&s.look.bucket===b;if(chain.length>1)coll+=chain.length-1;
   out+=R(20,y+2,56,rh-5,lk?C.amberp:chain.length>1?C.coralp:'#fff',lk?C.amber:chain.length>1?C.coral:C.line,6)+TB(48,y+rh/2+5,b,15,C.ink);
   chain.slice(0,5).forEach((k,j)=>{const x=96+j*96,cmp=lk&&j<=s.look.upto,hitk=lk&&s.look.found&&j===s.look.upto;out+=arrow(x-18,y+rh/2-1,x-2,y+rh/2-1,C.line,1.8,6)+R(x,y+3,82,rh-7,hitk?C.greenp:cmp?C.amberp:'#fff',hitk?C.green:cmp?C.amber:C.blue,6)+TM(x+41,y+rh/2+4,k.length>9?k.slice(0,8)+'…':k,13,C.ink)});
   if(chain.length>5)out+=T(580,y+rh/2+4,'+'+(chain.length-5),13,C.muted,'end');
  }
  const n=s.keys.length;
  out+=T(20,334,`${n} key${n===1?'':'s'} · 8 buckets · ${coll} collision${coll===1?'':'s'}`,14,C.muted,'start');
  if(s.look)out+=T(580,334,`“${s.look.key}” → bucket ${s.look.bucket} · ${s.look.cmp} comparison${s.look.cmp===1?'':'s'} · ${s.look.found?'found':'not found'}`,14,s.look.found?C.green:C.coral,'end');
  out+=T(300,362,n>1?'A linear search could need to compare against all '+n+' keys.':'With more keys, a linear search would check them all.',13,C.muted);
  const say=s.look?`“${s.look.key}” hashes to bucket ${s.look.bucket}. Only that chain is checked: ${s.look.cmp} comparison${s.look.cmp===1?'':'s'}, ${s.look.found?'found':'not there'}.`:coll?`Coloured buckets hold more than one key: collisions. The table still works by chaining, but long chains slow look-ups.`:'Each key sits in the bucket its hash picks.';
  return {svg:out,phase:say};
 }});

const OR_TREE0=[['/',-1],['home',0],['etc',0],['usr',0],['ada',1],['sam',1],['notes.txt',4],['pics',4],['bin',3]];
const OR_NAMES=['docs','music','a.txt','src','b.txt','tmp','lib','c.txt'];
function OR_treeLayout(nodes){
 const kids=nodes.map(()=>[]);nodes.forEach((n,i)=>{if(n.parent>=0)kids[n.parent].push(i)});
 const depth=[],pos=[];let leaf=0;
 (function walk(i,d){depth[i]=d;if(!kids[i].length){pos[i]=leaf++;return}kids[i].forEach(c=>walk(c,d+1));pos[i]=(pos[kids[i][0]]+pos[kids[i][kids[i].length-1]])/2})(0,0);
 return {kids,depth,pos,leaves:leaf};
}
function OR_path(nodes,i){const p=[];while(i>=0){p.unshift(i);i=nodes[i].parent}return p}
SCENE({id:'tree',name:'Tree',tag:'A hierarchy with one root',
 definition:'A structure of nodes where each node has one parent (except the single root) and any number of children. Nodes with no children are leaves.',
 example:'Folders on a computer form a tree: /home/ada/notes.txt is the path from the root, through home and ada, to the leaf notes.txt.',
 desc:'A folder tree drawn top-down from the root; the selected node’s path from the root is highlighted, with its depth and whether it is a leaf.',
 dur:10,hint:'Press any node to see its path from the root. Add a child to the selected node, or remove it.',
 init:()=>({nodes:OR_TREE0.map(([name,parent])=>({name,parent})),sel:6,next:0}),
 watch(p){const seq=[0,1,4,6,0,3,8];return {nodes:OR_TREE0.map(([name,parent])=>({name,parent})),sel:seq[Math.min(seq.length-1,Math.floor(p*seq.length))]}},
 ui:[{b:'Add child',act:'add'},{b:'Remove selected',act:'remove'}],
 on:{sel(s,i){s.sel=Number(i)},
  add(s){const lay=OR_treeLayout(s.nodes);if(s.nodes.length>=14||lay.depth[s.sel]>=4)return;s.nodes.push({name:OR_NAMES[s.next++%OR_NAMES.length],parent:s.sel});s.sel=s.nodes.length-1},
  remove(s){if(s.sel<=0)return;const drop=new Set([s.sel]);let grew=true;while(grew){grew=false;s.nodes.forEach((n,i)=>{if(!drop.has(i)&&drop.has(n.parent)){drop.add(i);grew=true}})}
   const map=[];const keep=s.nodes.filter((n,i)=>{if(drop.has(i))return false;map[i]=0;return true});let k=0;s.nodes.forEach((n,i)=>{if(!drop.has(i))map[i]=k++});
   s.nodes=keep.map(n=>({name:n.name,parent:n.parent<0?-1:map[n.parent]}));s.sel=0}},
 draw(s,f,X){
  const lay=OR_treeLayout(s.nodes),cw=Math.min(110,560/Math.max(1,lay.leaves)),x0=300-lay.leaves*cw/2,xy=i=>[x0+(lay.pos[i]+.5)*cw,64+lay.depth[i]*72];
  const path=OR_path(s.nodes,s.sel),onPath=new Set(path);let out='';
  s.nodes.forEach((n,i)=>{if(n.parent>=0){const a=xy(n.parent),b=xy(i),on=onPath.has(i);out+=L(a[0],a[1]+15,b[0],b[1]-15,on?C.coral:C.line,on?3.5:2)}});
  const bw=Math.min(88,cw-6);
  s.nodes.forEach((n,i)=>{const [x,y]=xy(i),sel=i===s.sel,on=onPath.has(i),leaf=!lay.kids[i].length;
   out+=hit(X,'sel',i,`${n.name}, depth ${lay.depth[i]}${leaf?', leaf':''}`,R(x-bw/2,y-15,bw,30,sel?C.amberp:on?C.coralp:leaf?C.greenp:'#fff',sel?C.amber:on?C.coral:leaf?C.green:C.blue,7)+T(x,y+5,n.name.length>10?n.name.slice(0,9)+'…':n.name,13,C.ink,'middle',i===0?'font-weight="700"':''))});
  const sel=s.nodes[s.sel],leaf=!lay.kids[s.sel].length,d=lay.depth[s.sel];
  const pathStr=s.sel===0?'/':'/'+path.slice(1).map(i=>s.nodes[i].name).join('/');
  out+=T(20,30,'root at the top · leaves are green',13,C.muted,'start');
  out+=T(580,30,`path ${pathStr.length>30?'…'+pathStr.slice(-29):pathStr}`,14,C.coral,'end','font-weight="650"');
  return {svg:out,phase:`${sel.name}: depth ${d} (${d} step${d===1?'':'s'} from the root), ${leaf?'a leaf with no children':lay.kids[s.sel].length+' child'+(lay.kids[s.sel].length===1?'':'ren')}. There is exactly one path from the root to every node.`};
 }});

function OR_bstBuild(vals){const nodes=[];for(const v of vals){if(!nodes.length){nodes.push({v,l:-1,r:-1,d:0});continue}let i=0,d=0;for(;;){d++;const nd=nodes[i];if(v===nd.v)break;const side=v<nd.v?'l':'r';if(nd[side]<0){nd[side]=nodes.length;nodes.push({v,l:-1,r:-1,d});break}i=nd[side]}}return nodes}
function OR_bstPath(nodes,v){const p=[];let i=nodes.length?0:-1;while(i>=0){p.push(i);if(nodes[i].v===v)return {path:p,found:true};i=v<nodes[i].v?nodes[i].l:nodes[i].r}return {path:p,found:false}}
const OR_BST0=[50,30,70,20,40,60,80];
SCENE({id:'binary-search-tree',name:'Binary search tree',tag:'Smaller left, larger right',
 definition:'A tree where each node has at most two children, every value in its left subtree is smaller and every value in its right subtree is larger.',
 example:'To find 60 in a tree rooted at 50: 60 > 50 go right to 70; 60 < 70 go left: found in 3 comparisons. Inserting in sorted order, though, builds a tall chain that is no faster than a list.',
 desc:'A binary search tree of numbers; a search or insertion path is highlighted from the root, going left for smaller and right for larger.',
 dur:12,hint:'Type a number to Insert or Search. Try “Insert sorted” to see the tree degrade into a chain.',
 init:()=>({vals:OR_BST0.slice(),input:'45',look:null}),
 watch(p){const all=OR_BST0.concat([65,35]),k=Math.min(all.length,1+Math.floor(p*(all.length+2)));return {vals:all.slice(0,k),look:p>.8?{v:65,...OR_bstPath(OR_bstBuild(all),65)}:k>1?{v:all[k-1],...OR_bstPath(OR_bstBuild(all.slice(0,k)),all[k-1]),ins:true}:null}},
 ui:[{text:'Number',label:'Number',get:s=>s.input,act:'input',max:2},{b:'Insert',act:'insert'},{b:'Search',act:'search'},{b:'Insert next',act:'rand'},{b:'Insert sorted',act:'sorted'},{b:'Balanced',act:'balanced'}],
 on:{input(s,v){s.input=v;return 'keep'},
  insert(s){const v=parseInt(s.input,10);if(!(v>=0&&v<=99))return;if(!s.vals.includes(v)&&s.vals.length<15)s.vals.push(v);s.look={v,...OR_bstPath(OR_bstBuild(s.vals),v),ins:true}},
  search(s){const v=parseInt(s.input,10);if(!(v>=0&&v<=99))return;s.look={v,...OR_bstPath(OR_bstBuild(s.vals),v)}},
  rand(s){if(s.vals.length>=15)return;const r=rng(nextSeed());let v;do{v=1+Math.floor(r()*98)}while(s.vals.includes(v));s.vals.push(v);s.input=String(v);s.look={v,...OR_bstPath(OR_bstBuild(s.vals),v),ins:true}},
  sorted(s){s.vals=[10,20,30,40,50,60,70];s.look={v:70,...OR_bstPath(OR_bstBuild(s.vals),70)}},balanced(s){s.vals=OR_BST0.slice();s.look=null}},
 draw(s,f,X){
  const nodes=OR_bstBuild(s.vals),n=nodes.length,order=nodes.map((nd,i)=>i).sort((a,b)=>nodes[a].v-nodes[b].v),rank=[];order.forEach((i,r)=>rank[i]=r);
  const h=n?Math.max(...nodes.map(nd=>nd.d)):0,dy=Math.min(52,270/Math.max(1,h)),xy=i=>[30+(rank[i]+.5)*(540/Math.max(1,n)),66+nodes[i].d*dy];
  const path=s.look?s.look.path:[],on=new Set(path);let out='';
  nodes.forEach((nd,i)=>{for(const c of [nd.l,nd.r])if(c>=0){const a=xy(i),b=xy(c),hl=on.has(i)&&on.has(c);out+=L(a[0],a[1],b[0],b[1],hl?C.amber:C.line,hl?3.5:2)}});
  nodes.forEach((nd,i)=>{const [x,y]=xy(i),last=s.look&&path[path.length-1]===i,hl=on.has(i);out+=Ci(x,y,17,last&&s.look.found?C.greenp:hl?C.amberp:'#fff',last&&s.look.found?C.green:hl?C.amber:C.blue)+T(x,y+5,nd.v,14,C.ink,'middle','font-weight="650"')});
  if(!n)out+=T(300,180,'Empty tree: insert a number.',17,C.muted);
  out+=T(20,30,`${n} nodes · height ${h}`,14,C.muted,'start');
  if(s.look){const steps=path.map(i=>nodes[i].v);out+=T(580,30,`${s.look.ins?'insert':'search'} ${s.look.v}: ${path.length} comparison${path.length===1?'':'s'}`,14,s.look.found?C.green:C.coral,'end','font-weight="650"');
   var say=steps.map((v,j)=>s.look.v===v?`${v}: found`:`${s.look.v} ${s.look.v<v?'<':'>'} ${v} → ${s.look.v<v?'left':'right'}`).join('; ')+(s.look.found?'.':'; no child there, so it is not in the tree.')}
  else var say='Every comparison discards one whole side of the tree.';
  return {svg:out,phase:say+(h>=n-1&&n>3?' This tree is a chain: searching it is as slow as a list.':'')};
 }});

const OR_GN={A:[70,90],B:[200,64],C:[330,110],D:[80,250],E:[220,200],F:[320,300]};
const OR_GE0=['AB','AD','BC','BE','DE','EF'];
SCENE({id:'graph',name:'Graph',tag:'Things and their connections',
 definition:'A set of vertices (nodes) joined by edges. Unlike a tree, a graph can have cycles and need not have a root.',
 example:'Friends on a social network, stations on a rail map and pages on the web all form graphs. A vertex’s degree is how many edges touch it.',
 desc:'Six labelled vertices joined by edges, each with its degree underneath, beside the adjacency list that stores the same graph as text.',
 dur:10,hint:'Press one vertex, then another, to add or remove the edge between them. The adjacency list updates too.',
 init:()=>({edges:OR_GE0.slice(),sel:null}),
 watch(p){const k=Math.min(OR_GE0.length+1,Math.floor(p*(OR_GE0.length+2)));return {edges:OR_GE0.concat(['CF']).slice(0,k),sel:null}},
 on:{node(s,id){if(s.sel===null){s.sel=id;return}if(s.sel!==id){const e=[s.sel,id].sort().join(''),i=s.edges.indexOf(e);if(i>=0)s.edges.splice(i,1);else s.edges.push(e);s.lastEdge=(i>=0?'removed ':'added ')+e[0]+'–'+e[1]}s.sel=null}},
 draw(s,f,X){
  const deg=id=>s.edges.filter(e=>e.includes(id)).length;
  let out=heading('Vertices joined by edges',30);
  out+=graphSVG(X,OR_GN,s.edges.map(e=>[e[0],e[1]]),{r:22,nodeAct:'node',edge:()=>({col:C.blue,w:3}),node:id=>({fill:id===s.sel?C.amberp:'#fff',stroke:id===s.sel?C.amber:C.blue,aria:`Vertex ${id}, degree ${deg(id)}${id===s.sel?', selected':''}. Press to connect.`})});
  for(const id in OR_GN){const [x,y]=OR_GN[id];out+=Ci(x+20,y-20,11,C.coral)+T(x+20,y-15,deg(id),13,'#fff','middle','font-weight="700"')}
  out+=T(20,340,'red badge = degree',13,C.coral,'start');
  out+=R(390,56,190,270,'#fff',C.grid,8)+T(404,80,'adjacency list',13,C.muted,'start');
  Object.keys(OR_GN).forEach((id,i)=>{const nb=s.edges.filter(e=>e.includes(id)).map(e=>e.replace(id,'')).sort();out+=TB(404,112+i*36,id+':',16,C.blue,'start')+TM(430,112+i*36,nb.join(', ')||'—',15,C.ink,'start')});
  const m=s.edges.length;out+=T(20,362,`${m} edge${m===1?'':'s'} · degrees add up to ${2*m}, because every edge has two ends`,14,C.muted,'start');
  return {svg:out,phase:s.sel?`${s.sel} selected: press another vertex to add or remove an edge.`:(s.lastEdge?`Edge ${s.lastEdge}. `:'')+'The picture and the adjacency list hold the same information; programs usually store the list.'};
 }});

/* ===================== Stage 3 · further scenes for each lesson ===================== */
const OR_WORDS=['ant','bee','cat','dog','eel','fox','gnu','hen','ibis','jay','kiwi','lark','mole','newt','owl','pig','quail','rat','seal','toad','urchin','vole','wasp','yak','zebra','ape','bat','cod','doe','elk','frog','goat','hare','ibex','koi','lion','moth','orca','puma','ram','slug','tern','wolf','wren','crab','dove','emu','finch','gull','hawk','lynx','mink','mule','pony','swan','tiger','trout','viper','whale','mouse'];
function OR_hpoly(k,m){let h=0;for(const c of k)h=(Math.imul(h,31)+c.codePointAt(0))>>>0;return h%m}
function OR_hsum(k,m){return sum(Array.from(k).map(c=>c.codePointAt(0)))%m}
function OR_hfirst(k,m){return ((k.codePointAt(0)-97)%26+26)%26%m}
const OR_BANDS=[C.pale,C.greenp,C.purplep,C.amberp];
// Binary trees as nested {v,l,r}; laid out by in-order position (x) and depth (y).
function OR_bIns(t,v){if(!t)return {v,l:null,r:null};if(v<t.v)t.l=OR_bIns(t.l,v);else if(v>t.v)t.r=OR_bIns(t.r,v);return t}
function OR_bFrom(vals){let t=null;for(const v of vals)t=OR_bIns(t,v);return t}
function OR_bClone(t){return t?{v:t.v,l:OR_bClone(t.l),r:OR_bClone(t.r)}:null}
function OR_bVals(t){const o=[];(function w(n){if(!n)return;o.push(n.v);w(n.l);w(n.r)})(t);return o}
function OR_bLayout(t,x0,x1,y0,dy){const out=[];let i=0;(function walk(n,d){if(!n)return;walk(n.l,d+1);out.push({n,d,i:i++});walk(n.r,d+1)})(t,0);
 const cnt=out.length,dx=cnt>1?(x1-x0)/(cnt-1):0;out.forEach(o=>{o.x=cnt>1?x0+o.i*dx:(x0+x1)/2;o.y=y0+o.d*dy});return out}
function OR_drawBin(lay,style,r=17){
 let out='';const pos=new Map(lay.map(o=>[o.n,o]));
 for(const o of lay)for(const c of [o.n.l,o.n.r])if(c){const q=pos.get(c),st=style(o,q)||{};out+=L(o.x,o.y,q.x,q.y,st.col||C.line,st.w||2)}
 for(const o of lay){const st=style(o)||{},inner=Ci(o.x,o.y,r,st.fill||'#fff',st.stroke||C.blue)+TBF(o.x,o.y+5,o.n.v,st.size||15,st.ink||C.ink);out+=st.wrap?st.wrap(inner):inner;if(st.badge!==undefined)out+=Ci(o.x+r,o.y-r,10,C.coral)+TBF(o.x+r,o.y-r+5,st.badge,13,'#fff')}
 return out}

/* ---- Arrays ---- */
SCENE({id:'array-2d',name:'Two-dimensional array',tag:'A grid stored as one line',
 definition:'A table of rows and columns. Memory is a single line, so the grid is stored row after row (row-major order), and a[r][c] lives at index r × columns + c.',
 example:'In a 3 × 4 grid, a[1][2] is stored at 1 × 4 + 2 = 6. Images, spreadsheets and game boards are all stored like this.',
 desc:'A lettered grid above the single strip of memory that holds it; each row has its own colour, and the chosen cell and its place in the strip are highlighted with the index formula.',
 dur:11,hint:'Press any cell to see where it lives in memory. Switch to column-major order, or change the grid size, and watch the colours interleave.',
 init:()=>({rows:3,cols:4,r:1,c:2,order:'row'}),
 watch(p){if(p<.62){const k=Math.min(11,Math.floor(p/.62*12));return {rows:3,cols:4,r:Math.floor(k/4),c:k%4,order:'row',walk:k}}return {rows:3,cols:4,r:1,c:2,order:'col'}},
 ui:[{choose:[['row','Row-major'],['col','Column-major']],label:'Storage order',get:s=>s.order,act:'order'},{range:'rows',label:'Rows',min:2,max:4,get:s=>s.rows,act:'rows'},{range:'cols',label:'Columns',min:2,max:6,get:s=>s.cols,act:'cols'}],
 on:{cell(s,a){const [r,c]=String(a).split(',').map(Number);s.r=r;s.c=c},order(s,v){s.order=v},rows(s,v){s.rows=v;s.r=Math.min(s.r,v-1)},cols(s,v){s.cols=v;s.c=Math.min(s.c,v-1)}},
 draw(s,f,X){
  const {rows,cols,order}=s,n=rows*cols,cw=54,ch=40,gx=56,gy=72,row=order==='row';
  const flat=(r,c)=>row?r*cols+c:c*rows+r,at=k=>row?[Math.floor(k/cols),k%cols]:[k%rows,Math.floor(k/rows)];
  const sel=flat(s.r,s.c),walk=s.walk===undefined?-1:s.walk;let out=heading(row?'Row-major: whole rows sit side by side':'Column-major: whole columns sit side by side');
  for(let c=0;c<cols;c++)out+=TMF(gx+c*cw+cw/2,gy-8,c,13,C.muted);
  for(let r=0;r<rows;r++){out+=TMF(gx-16,gy+r*ch+ch/2+5,r,13,C.muted);
   for(let c=0;c<cols;c++){const on=r===s.r&&c===s.c,done=walk>=0&&flat(r,c)<walk;
    out+=hit(X,'cell',r+','+c,`a[${r}][${c}] holds ${OR_LET[r*cols+c]}`,R(gx+c*cw+2,gy+r*ch+2,cw-4,ch-4,on?C.coral:OR_BANDS[r],on?C.coral:done?C.blue:'none',6)+TB(gx+c*cw+cw/2,gy+r*ch+ch/2+6,OR_LET[r*cols+c],17,on?'#fff':C.ink))}}
  const fx=Math.max(400,gx+cols*cw+20)+95;
  out+=TB(fx,96,`a[${s.r}][${s.c}]`,20,C.coral)+TF(fx,124,row?'row × columns + column':'column × rows + row',13,C.muted)+TB(fx,154,row?`${s.r} × ${cols} + ${s.c} = ${sel}`:`${s.c} × ${rows} + ${s.r} = ${sel}`,17,C.ink);
  const sy=262,w=Math.min(40,540/n),sx=300-n*w/2;out+=TF(sx,sy-10,'memory: one long line',13,C.muted,'start');
  for(let k=0;k<n;k++){const [r,c]=at(k),on=k===sel;out+=R(sx+k*w+1,sy,w-2,34,on?C.coral:OR_BANDS[r],on?C.coral:k<walk?C.blue:'none',4)+TMF(sx+k*w+w/2,sy+22,OR_LET[r*cols+c],13,on?'#fff':C.ink)+TMF(sx+k*w+w/2,sy+50,k,13,on?C.coral:C.muted)}
  out+=arrow(gx+s.c*cw+cw/2,gy+s.r*ch+ch-2,sx+sel*w+w/2,sy-3,C.coral,2,8);
  out+=T(300,350,row?'Each row is one solid block of colour in memory.':'Rows are interleaved: neighbours in a row are now '+rows+' places apart.',14,C.muted);
  return {svg:out,phase:`a[${s.r}][${s.c}] is item ${sel} of ${n} in memory. In ${row?'row':'column'}-major order, stepping along a row moves ${row?'1 place':rows+' places'} in memory${row?', so reading a row is fast':''}. Most languages, including C and Python’s NumPy by default, use row-major order.`};
 }});

const OR_LAYER=[C.pale,C.greenp,C.purplep];
SCENE({id:'array-3d',name:'Three-dimensional array',tag:'Layers of grids',
 definition:'An array with three indices, a[layer][row][column], like a stack of grids. It is still one line in memory: index = layer × (rows × columns) + row × columns + column.',
 example:'In a 3 × 3 × 3 block, a[1][2][0] is at 1 × 9 + 2 × 3 + 0 = 15. Medical scans and block-building games store volumes like this.',
 desc:'Three 3 × 3 layers side by side above the 27-cell memory strip, with the chosen cell, its layer and its single memory index highlighted; the 3D view stacks the layers into a cube.',
 dur:12,hint:'Press a cell in any layer, or use the sliders. Switch to 3D to see the layers stacked into a cube.',
 init:()=>({l:1,r:2,c:0}),
 watch(p){const k=Math.min(26,Math.floor(p*27));return {l:Math.floor(k/9),r:Math.floor(k/3)%3,c:k%3,walk:k}},
 ui:[{range:'l',label:'Layer',min:0,max:2,get:s=>s.l,act:'l'},{range:'r',label:'Row',min:0,max:2,get:s=>s.r,act:'r'},{range:'c',label:'Column',min:0,max:2,get:s=>s.c,act:'c'}],
 on:{l(s,v){s.l=v},r(s,v){s.r=v},c(s,v){s.c=v},cell(s,a){[s.l,s.r,s.c]=String(a).split(',').map(Number)}},
 draw(s,f,X){
  const k=s.l*9+s.r*3+s.c,walk=s.walk===undefined?-1:s.walk,cw=36;let out=heading('Layer, then row, then column');
  for(let l=0;l<3;l++){const x0=66+l*180,y0=78;out+=TB(x0+54,y0-12,'layer '+l,14,l===s.l?C.coral:C.muted);
   for(let r=0;r<3;r++)for(let c=0;c<3;c++){const i=l*9+r*3+c,on=i===k;out+=hit(X,'cell',l+','+r+','+c,`a[${l}][${r}][${c}], memory index ${i}`,R(x0+c*cw+1,y0+r*cw+1,cw-2,cw-2,on?C.coral:OR_LAYER[l],on?C.coral:i<walk?C.blue:'none',4)+TMF(x0+c*cw+cw/2,y0+r*cw+cw/2+5,i,13,on?'#fff':C.ink))}}
  const sy=236,w=20,sx=30;
  for(let i=0;i<27;i++){const l=Math.floor(i/9),on=i===k;out+=R(sx+i*w+1,sy,w-2,30,on?C.coral:OR_LAYER[l],on?C.coral:i<walk?C.blue:'none',3)}
  out+=`<polygon points="${sx+k*w+w/2},${sy-3} ${sx+k*w+w/2-6},${sy-13} ${sx+k*w+w/2+6},${sy-13}" fill="${C.coral}"/>`;
  for(let l=0;l<3;l++)out+=P(`M${sx+l*180+3} ${sy+38}v6h174v-6`,C.muted,1.5)+TF(sx+l*180+90,sy+62,'layer '+l+': 9 cells',13,C.muted);
  out+=TB(300,336,`a[${s.l}][${s.r}][${s.c}] → ${s.l} × 9 + ${s.r} × 3 + ${s.c} = ${k}`,18,C.ink);
  return {svg:out,phase:`Cell a[${s.l}][${s.r}][${s.c}] is memory index ${k}. Each layer is a solid block of 9; inside it, each row is a block of 3. Moving one layer jumps 9 places, one row 3 places, one column 1 place.`};
 }});
SCENES['array-3d'].three=(s,f,X,project)=>{
 const P=project([-0.3,3.3,-0.3,3.3,-0.3,3.6]),k=s.l*9+s.r*3+s.c;let faces=[];
 for(let l=0;l<3;l++)for(let r=0;r<3;r++)for(let c=0;c<3;c++){const i=l*9+r*3+c,on=i===k,same=l===s.l;faces.push(...prism(c+.12,r+.12,l*1.15+.1,.76,.76,.76,on?C.coral:same?'#9cc3de':'#d7e3ea'))}
 let out=paintFaces(faces,P)+axes3(P,['column','row','layer'],[3.4,3.4,3.7]);
 const q=P([s.c+.5,s.r+.5,s.l*1.15+1.05]);out+=R(q[0]-17,q[1]-34,34,22,'#fff',C.coral,6)+TBF(q[0],q[1]-18,k,13,C.coral);
 return {svg:out,title:'The layers stacked into a cube',caption:`Layer ${s.l} (shaded) is one block of 9 cells in memory. The orange cube is a[${s.l}][${s.r}][${s.c}], memory index ${k}.`};
};

function OR_dyn(n){let cap=1,copies=0;const per=[];for(let k=1;k<=n;k++){let c=1;if(k>cap){copies+=cap;c+=cap;cap*=2}per.push(c)}return {cap,copies,per,grew:n>1&&((n-1)&(n-2))===0}}
SCENE({id:'dynamic-array',name:'Dynamic array',tag:'Growing by doubling',
 definition:'An array that grows as you append. When it is full it allocates a block twice the size and copies everything across; because doubling is rare, an append costs a constant amount of work on average (amortised).',
 example:'Python lists and JavaScript arrays work this way. Appending 17 items to a list that starts with room for 1 copies 1 + 2 + 4 + 8 + 16 = 31 items in total: fewer than two copies per append.',
 desc:'A row of capacity slots, an old full array copied into a new one twice the size when it overflows, and a bar chart of the work done by each append, with spikes at powers of two.',
 dur:12,hint:'Press Append and watch the capacity double when the array is full. The chart shows rare expensive appends among many cheap ones.',
 init:()=>({n:5}),
 watch(p){return {n:Math.min(17,1+Math.floor(p*17))}},
 ui:[{b:'Append',act:'app'},{range:'n',label:'Items',min:1,max:32,get:s=>s.n,act:'set'}],
 on:{app(s){if(s.n<32)s.n++},set(s,v){s.n=v}},
 draw(s){
  const d=OR_dyn(s.n),cap=d.cap,w=Math.min(46,540/cap),x0=300-cap*w/2;let out=heading(d.grew?'Full: allocate double the space and copy everything':'Append into the next free slot');
  if(d.grew){const old=cap/2,ox=300-old*w/2;out+=TF(ox,62,'old array, full ('+old+')',13,C.coral,'start');
   for(let i=0;i<old;i++)out+=R(ox+i*w+1,68,w-2,26,C.coralp,C.coral,4)+L(ox+i*w+w/2,95,x0+i*w+w/2,119,C.coral,1.2)}
  out+=TF(x0+cap*w,114,'capacity '+cap,13,C.muted,'end');
  for(let i=0;i<cap;i++){const on=i<s.n,nw=i===s.n-1;out+=R(x0+i*w+1,122,w-2,34,nw?C.green:on?C.blue:'#fff',on?(nw?C.green:C.blue):C.line,4,on?'':'stroke-dasharray="3 3"')+(w>=22&&on?TF(x0+i*w+w/2,144,OR_LET[i%26],13,'#fff'):'')}
  const bx=40,bw=520/32,base=292,mx=17;out+=TF(bx,184,'work done by each append: 1 write + any copying',13,C.muted,'start');
  d.per.forEach((c,i)=>{const h=c*96/mx;out+=R(bx+i*bw+2,base-h,bw-4,h,c>1?C.coral:C.blue,'none',2)});
  out+=L(bx,base,bx+520,base,C.line,1.5);for(const k of [1,2,4,8,16,32])out+=TF(bx+(k-.5)*bw,base+16,k,13,C.muted);
  out+=TF(bx+520,base+32,'append number',13,C.muted,'end');
  const avg=(s.n+d.copies)/s.n;out+=TB(300,346,`${s.n} appends · ${d.copies} copies · ${fmt(avg)} steps per append on average`,15,C.ink);
  out+=T(300,370,'Doubling keeps the average below 3 however long the array grows.',13,C.muted);
  return {svg:out,phase:d.grew?`Append ${s.n} found the array full, so ${cap/2} items were copied into a new block of ${cap}. That append was expensive, but the next ${cap/2-1} will be cheap.`:`Append ${s.n} used a free slot: one step. ${cap-s.n} slot${cap-s.n===1?'':'s'} left before the next doubling.`};
 }});

/* ---- Linked lists ---- */
function OR_revTrace(n){const nx=range(n).map(i=>i<n-1?i+1:-1),fr=[],nm=i=>i<0?'null':OR_LET[i];let prev=-1,cur=0;
 const snap=o=>fr.push({nx:nx.slice(),prev,cur,head:0,nxt:null,...o});
 snap({say:'Start: prev = null and cur = the head. Each round turns one arrow round.'});
 while(cur>=0){const nxt=nx[cur];snap({nxt,say:`Save next = ${nm(nxt)} first, or the rest of the list would be lost.`});nx[cur]=prev;snap({nxt,flip:cur,say:`Point ${nm(cur)} back at ${nm(prev)}.`});prev=cur;cur=nxt;snap({say:`Move along: prev = ${nm(prev)}, cur = ${nm(cur)}.`})}
 snap({head:prev,done:true,say:`cur is null, so stop. ${nm(prev)} is the new head. ${n} arrows were turned round; no node moved, and only three extra pointers were needed.`});return fr}
SCENE({id:'list-reversal',name:'Reversing a linked list',tag:'Turn every arrow round',
 definition:'Reverse a linked list in place by walking it once with three pointers (prev, cur, next) and turning each node’s pointer to face backwards.',
 example:'A → B → C becomes C → B → A. Nothing is copied: only the pointers change, so it takes one pass and constant extra memory.',
 desc:'A row of nodes whose arrows turn round one at a time; markers show the prev, cur and next pointers, and the two halves of the list are read out underneath.',
 dur:13,hint:'Choose the list length, then Step to watch each arrow turn. Notice that next must be saved before the arrow is turned.',
 init:()=>({n:5}),
 ui:[{range:'n',label:'Nodes',min:2,max:7,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=v}},
 trace(s){return OR_revTrace(s.n)},
 draw(s,f){
  const n=s.n,gap=Math.min(96,500/Math.max(1,n-1)),bw=56,x=i=>300-((n-1)*gap)/2+i*gap-bw/2,y=150,nm=i=>i<0?'null':OR_LET[i];let out=heading('Turn every arrow round, one node at a time');
  const hx=x(f.head)+bw/2-10;out+=R(hx-28,52,56,24,C.dark,'none',6)+TF(hx,69,'head',13,'#fff')+arrow(hx,77,hx,y-3,C.ink,2,7);
  for(let i=0;i<n;i++){const xi=x(i),j=f.nx[i],col=f.flip===i?C.coral:C.ink;
   out+=R(xi,y,bw,40,i===f.cur?C.coralp:i===f.prev?C.purplep:'#fff',C.blue,7)+L(xi+36,y+2,xi+36,y+38,C.line,2)+TB(xi+18,y+27,OR_LET[i],18,C.ink)+Ci(xi+46,y+20,4,col);
   if(j===i+1)out+=arrow(xi+50,y+20,x(j)-3,y+20,col,2.2,8);
   else if(j>=0)out+=curveArrow(xi+46,y+42,x(j)+30,y+44,-26,col,2.2);
   else out+=arrow(xi+46,y-1,xi+46,y-24,col,2,7)+TF(xi+46,y-30,'null',13,C.muted);
  }
  const mark=(i,lab,col,dy)=>{if(i<0||i===null)return '';const cx=x(i)+bw/2;return `<polygon points="${cx},${226+dy} ${cx-7},${238+dy} ${cx+7},${238+dy}" fill="${col}"/>`+TBF(cx,254+dy,lab,13,col)};
  out+=mark(f.prev,'prev',C.purple,0)+mark(f.cur,'cur',C.coral,0)+(f.nxt!==null&&f.nxt!==f.cur?mark(f.nxt,'next',C.green,0):'');
  const walk=st=>{const o=[];let i=st,g=0;while(i>=0&&g++<n){o.push(OR_LET[i]);i=f.nx[i]}return o.join(' → ')+' → null'};
  out+=T(300,300,`prev = ${nm(f.prev)}    cur = ${nm(f.cur)}${f.nxt!==null?'    next = '+nm(f.nxt):''}`,15,C.ink,'middle','xml:space="preserve"');
  out+=TF(300,330,f.prev>=0?'reversed part (from prev): '+walk(f.prev):'reversed part: empty',13,C.purple);
  out+=TF(300,352,f.cur>=0?'still to do (from cur): '+walk(f.cur):'still to do: nothing',13,C.coral);
  return {svg:out,phase:f.say};
 }});

function OR_cycNext(n,loop){return i=>i<n-1?i+1:(loop>=0?loop:-1)}
function OR_cycPos(n,loop){const ps=[];if(loop<0){for(let i=0;i<n;i++)ps.push([50+i*(500/(n-1)),200]);return ps}
 const m=n-loop,r=Math.max(62,m*60/(2*Math.PI)),cx=50+loop*64+r+(loop?24:0);for(let i=0;i<loop;i++)ps.push([50+i*64,200]);
 for(let j=0;j<m;j++){const a=Math.PI+j*2*Math.PI/m;ps.push([cx+r*Math.cos(a),200+r*Math.sin(a)])}return ps}
SCENE({id:'cycle-detection',name:'Cycle detection',tag:'The tortoise and the hare',
 definition:'Find out whether a linked list loops back on itself using two pointers: a tortoise that moves one node at a time and a hare that moves two. If there is a loop the hare eventually laps the tortoise; if not, the hare reaches the end.',
 example:'This is Floyd’s algorithm. It needs no memory of which nodes were visited: just two pointers, however long the list.',
 desc:'Nodes arranged as a tail leading into a loop, with a tortoise marker moving one step and a hare marker moving two steps at a time until they meet or the hare reaches null.',
 dur:13,hint:'Choose where the last node points back to (or no loop), and how many nodes. Step and watch whether the hare catches the tortoise.',
 init:()=>({n:8,loop:2}),
 ui:[{range:'n',label:'Nodes',min:5,max:10,get:s=>s.n,act:'n'},{choose:[[-1,'No loop'],[0,'Back to 1'],[2,'Back to 3'],[3,'Back to 4']],label:'Last node points to',get:s=>s.loop,act:'loop'}],
 on:{n(s,v){s.n=v},loop(s,v){s.loop=Number(v)}},
 trace(s){const nx=OR_cycNext(s.n,s.loop);let t=0,h=0,k=0;const fr=[{t,h,k,say:'Both start at the head. Each step the tortoise moves 1 node and the hare moves 2.'}];
  while(k<40){const h1=nx(h);if(h1<0){fr.push({t,h,k,end:'none',say:'The hare has reached the end of the list (null): there is no cycle.'});break}
   const h2=nx(h1);if(h2<0){fr.push({t,h:h1,k,end:'none',say:'The hare has reached the end of the list (null): there is no cycle.'});break}
   t=nx(t);h=h2;k++;if(t===h){fr.push({t,h,k,end:'cycle',say:`Step ${k}: both land on node ${t+1}. The hare has lapped the tortoise, so the list must contain a loop.`});break}
   fr.push({t,h,k,say:`Step ${k}: tortoise on node ${t+1}, hare on node ${h+1}.`})}
  return fr},
 draw(s,f){
  const n=s.n,ps=OR_cycPos(n,s.loop),nx=OR_cycNext(n,s.loop);let out=heading(s.loop<0?'A list that ends':'A list whose tail loops back');
  for(let i=0;i<n;i++){const j=nx(i);if(j<0){const [x,y]=ps[i];out+=arrow(x+18,y,x+40,y,C.ink,2,7)+TF(x+46,y+22,'null',13,C.muted);continue}
   const a=ps[i],b=ps[j],inLoop=s.loop>=0&&i>=s.loop;
   if(inLoop&&n-s.loop===2){const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy);out+=curveArrow(a[0]+dx/d*18,a[1]+dy/d*18,b[0]-dx/d*20,b[1]-dy/d*20,22,C.ink,2.2)}
   else out+=arrowR(a,b,18,20,i===n-1&&s.loop>=0?C.coral:C.ink,2.2)}
  ps.forEach(([x,y],i)=>{const meet=f.end==='cycle'&&i===f.t;out+=Ci(x,y,18,meet?C.green:'#fff',meet?C.green:C.blue)+TB(x,y+5,i+1,14,meet?'#fff':C.ink)});
  const pill=(i,lab,col,dy)=>{const [x,y]=ps[i];return R(x-11,y+dy-11,22,22,col,'none',11)+TBF(x,y+dy+5,lab,13,'#fff')};
  out+=pill(f.t,'T',C.coral,-32)+pill(f.h,'H',C.purple,32);
  out+=counter(470,46,'steps',f.k,C.blue,110);
  out+=R(18,356,22,18,C.coral,'none',9)+TF(46,370,'T tortoise: 1 node per step',13,C.ink,'start')+R(268,356,22,18,C.purple,'none',9)+TF(296,370,'H hare: 2 nodes per step',13,C.ink,'start');
  if(f.end)out+=R(150,48,300,32,f.end==='cycle'?C.greenp:C.amberp,'none',8)+TB(300,70,f.end==='cycle'?'They met: there is a loop':'Hare reached null: no loop',15,f.end==='cycle'?C.green:C.amber);
  return {svg:out,phase:f.say};
 }});

/* ---- Stacks ---- */
const OR_PAIR={')':'(',']':'[','}':'{'};
SCENE({id:'bracket-matching',name:'Bracket matching',tag:'A stack checks nesting',
 definition:'Check that brackets are balanced by reading left to right: push every opening bracket, and for every closing bracket pop the top of the stack and check that it is the matching kind.',
 example:'{[()()]} is balanced; ([)] is not, because ] arrives while ( is on top. Compilers and code editors use exactly this check.',
 desc:'A row of characters read one at a time, with matched pairs turning green, beside a vertical stack of the brackets still waiting to be closed.',
 dur:12,hint:'Type brackets, or pick an example, then Step through. The most recently opened bracket must be the first one closed.',
 init:()=>({text:'{[()()]}'}),
 ui:[{text:'Text',label:'Text',get:s=>s.text,act:'text',max:16},{choose:[['{[()()]}','Balanced'],['([)]','Crossed'],['((())','Unclosed'],['a(b[c]d)e','With letters']],label:'Examples',get:s=>s.text,act:'text'}],
 on:{text(s,v){s.text=String(v).slice(0,16)}},
 trace(s){const t=Array.from(s.text).slice(0,16),st=[],pairs=[];const fr=[{i:-1,st:[],pairs:[],say:'Read left to right. Push each opening bracket; each closing bracket must match the bracket on top of the stack.'}];
  for(let i=0;i<t.length;i++){const c=t[i];
   if('([{'.includes(c)){st.push(i);fr.push({i,st:st.slice(),pairs:pairs.slice(),say:`“${c}” opens a bracket: push it.`})}
   else if(OR_PAIR[c]){if(!st.length){fr.push({i,st:[],pairs:pairs.slice(),err:i,done:true,ok:false,say:`“${c}” closes a bracket, but the stack is empty: there is nothing to match. Unbalanced.`});return fr}
    const j=st.pop();if(t[j]!==OR_PAIR[c]){fr.push({i,st:st.concat(j),pairs:pairs.slice(),err:i,bad:j,done:true,ok:false,say:`“${c}” closes a bracket, but “${t[j]}” is on top of the stack. Mismatch: unbalanced.`});return fr}
    pairs.push([j,i]);fr.push({i,st:st.slice(),pairs:pairs.slice(),say:`“${c}” matches “${t[j]}” on top of the stack: pop it.`})}
   else fr.push({i,st:st.slice(),pairs:pairs.slice(),say:`“${c}” is not a bracket: skip it.`})}
  fr.push({i:t.length,st:st.slice(),pairs:pairs.slice(),done:true,ok:!st.length,say:st.length?`The text ended with ${st.length} bracket${st.length>1?'s':''} still open. Unbalanced.`:'Every bracket was matched and the stack is empty: balanced.'});return fr},
 draw(s,f){
  const t=Array.from(s.text).slice(0,16),n=t.length,w=Math.min(34,540/Math.max(1,n)),x0=300-n*w/2;let out=heading('Last opened, first closed');
  const matched=new Set(f.pairs.flat()),waiting=new Set(f.st);
  t.forEach((c,i)=>{const err=i===f.err||i===f.bad,cur=i===f.i,fill=err?C.coralp:matched.has(i)?C.greenp:waiting.has(i)?C.pale:cur?C.amberp:'#fff',st=err?C.coral:cur?C.amber:matched.has(i)?C.green:C.grid;
   out+=R(x0+i*w+1,60,w-2,40,fill,st,6)+TM(x0+i*w+w/2,87,c,19,i>f.i&&!err?C.muted:C.ink)});
  if(!n)out+=T(300,86,'Type some brackets',15,C.muted);
  if(f.i>=0&&f.i<n)out+=`<polygon points="${x0+f.i*w+w/2},106 ${x0+f.i*w+w/2-7},118 ${x0+f.i*w+w/2+7},118" fill="${C.amber}"/>`;
  const bx=250,bh=26,base=336,show=f.st.slice(-7);
  out+=P(`M${bx} ${base-200}V${base}H${bx+100}V${base-200}`,C.ink,2.2);
  show.forEach((j,k)=>{const y=base-(k+1)*(bh+2),top=k===show.length-1;out+=R(bx+6,y,88,bh,top?C.blue:C.pale,'none',5)+TM(bx+50,y+19,t[j],17,top?'#fff':C.ink)});
  if(f.st.length>7)out+=TF(bx+50,base-212,'…',13,C.muted);
  out+=TF(bx+50,base+20,'stack (top is highest)',13,C.muted);
  out+=TF(70,170,'( matches )',13,C.muted)+TF(70,192,'[ matches ]',13,C.muted)+TF(70,214,'{ matches }',13,C.muted);
  if(f.done)out+=R(400,170,170,46,f.ok?C.greenp:C.coralp,f.ok?C.green:C.coral,10)+TB(485,199,f.ok?'Balanced ✓':'Unbalanced ✗',17,f.ok?C.green:C.coral);
  return {svg:out,phase:f.say};
 }});

const OR_OPS={'+':(a,b)=>a+b,'-':(a,b)=>a-b,'−':(a,b)=>a-b,'*':(a,b)=>a*b,'×':(a,b)=>a*b,'x':(a,b)=>a*b,'/':(a,b)=>a/b,'÷':(a,b)=>a/b};
const OR_SYM={'+':'+','-':'−','−':'−','*':'×','×':'×','x':'×','/':'÷','÷':'÷'};
function OR_toks(text){return text.trim().split(/\s+/).filter(Boolean).slice(0,11)}
SCENE({id:'postfix-evaluation',name:'Postfix evaluation',tag:'Arithmetic with a stack',
 definition:'In postfix (reverse Polish) notation each operator comes after its two operands, so 3 4 + means 3 + 4. A stack evaluates it in one pass: push numbers; an operator pops two, combines them and pushes the result.',
 example:'3 4 + 2 × means (3 + 4) × 2 = 14. No brackets and no precedence rules are needed, which is why calculators and the stack machines inside compilers use it.',
 desc:'A row of tokens read left to right beside a vertical stack of numbers; each operator pops two numbers, shows the calculation, and pushes the answer.',
 dur:12,hint:'Type tokens separated by spaces (numbers and + − × ÷), or pick an example. Step to see the stack grow and shrink.',
 init:()=>({text:'3 4 + 2 ×'}),
 ui:[{text:'Postfix',label:'Postfix',get:s=>s.text,act:'text',max:28},{choose:[['3 4 + 2 ×','(3 + 4) × 2'],['5 1 2 + 4 × + 3 −','Longer'],['2 3 4 × +','2 + 3 × 4'],['4 +','Too few']],label:'Examples',get:s=>s.text,act:'text'}],
 on:{text(s,v){s.text=String(v).slice(0,28)}},
 trace(s){const toks=OR_toks(s.text),st=[],inf=[];const fr=[{i:-1,st:[],say:'Read the tokens left to right: push numbers; an operator pops two numbers and pushes the answer.'}];
  for(let i=0;i<toks.length;i++){const tk=toks[i];
   if(/^\d+(\.\d+)?$/.test(tk)){st.push(Number(tk));inf.push(tk);fr.push({i,st:st.slice(),say:`${tk} is a number: push it.`})}
   else if(OR_OPS[tk]){if(st.length<2){fr.push({i,st:st.slice(),done:true,err:true,say:`“${OR_SYM[tk]}” needs two numbers, but the stack holds ${st.length}. This is not valid postfix.`});return fr}
    const b=st.pop(),a=st.pop(),ib=inf.pop(),ia=inf.pop(),v=OR_OPS[tk](a,b);
    if(!isFinite(v)){fr.push({i,st:st.concat(a,b),done:true,err:true,say:'Dividing by zero has no answer.'});return fr}
    st.push(v);inf.push(`(${ia} ${OR_SYM[tk]} ${ib})`);fr.push({i,st:st.slice(),calc:`${fmt(a)} ${OR_SYM[tk]} ${fmt(b)} = ${fmt(v)}`,say:`“${OR_SYM[tk]}”: pop ${fmt(b)} and ${fmt(a)}, work out ${fmt(a)} ${OR_SYM[tk]} ${fmt(b)} = ${fmt(v)}, and push the answer.`})}
   else{fr.push({i,st:st.slice(),done:true,err:true,say:`“${tk}” is neither a number nor an operator (+ − × ÷).`});return fr}}
  const ok=st.length===1,inx=ok?inf[0].replace(/^\((.*)\)$/,'$1'):'';
  fr.push({i:toks.length,st:st.slice(),done:true,ok,infix:inx,say:ok?`One value is left: the answer is ${fmt(st[0])}. In ordinary notation that is ${inx}.`:st.length?`${st.length} values are left over: an operator is missing.`:'There is nothing to evaluate.'});return fr},
 draw(s,f){
  const toks=OR_toks(s.text),ws=toks.map(t=>Math.max(36,t.length*12+18)),tot=sum(ws)+4*(toks.length-1);let x=300-tot/2,out=heading('Numbers wait on the stack for their operator');
  toks.forEach((tk,i)=>{const cur=i===f.i,done=i<f.i,op=!!OR_OPS[tk];out+=R(x,56,ws[i],38,cur?C.amberp:done?'#eef2f4':'#fff',cur?C.amber:op?C.purple:C.grid,7)+TM(x+ws[i]/2,81,OR_SYM[tk]||tk,17,done?C.muted:op?C.purple:C.ink);x+=ws[i]+4});
  if(!toks.length)out+=T(300,80,'Type some tokens',15,C.muted);
  const bx=230,bh=30,base=336,show=f.st.slice(-6);
  out+=P(`M${bx} ${base-196}V${base}H${bx+140}V${base-196}`,C.ink,2.2);
  show.forEach((v,k)=>{const y=base-(k+1)*(bh+3),top=k===show.length-1;out+=R(bx+8,y,124,bh,top?C.blue:C.pale,'none',6)+TB(bx+70,y+21,fmt(v),17,top?'#fff':C.ink)});
  out+=TF(bx+70,base+20,'stack',13,C.muted);
  if(f.calc)out+=R(400,150,180,48,C.amberp,C.amber,10)+TB(490,180,f.calc,17,C.ink);
  if(f.done)out+=R(400,220,180,48,f.ok?C.greenp:C.coralp,f.ok?C.green:C.coral,10)+TB(490,250,f.ok?'= '+fmt(f.st[0]):'Not valid',17,f.ok?C.green:C.coral);
  if(f.done&&f.ok)out+=T(300,366,'Same as: '+f.infix,15,C.ink);
  return {svg:out,phase:f.say};
 }});

const OR_TYPED=['The','quick','brown','fox','jumps','over','the','lazy','dog'];
function OR_undoRun(acts){let doc=[],undo=[],redo=[],wi=0,cleared=false,last='',moved=null;
 for(const a of acts){cleared=false;last=a;moved=null;
  if(a==='t'){const w=OR_TYPED[wi++%9];doc.push(w);cleared=redo.length>0;redo=[];undo.push({op:'type',w})}
  else if(a==='d'){if(!doc.length){last='d0';continue}const w=doc.pop();cleared=redo.length>0;redo=[];undo.push({op:'delete',w})}
  else if(a==='u'){if(!undo.length){last='u0';continue}const x=undo.pop();if(x.op==='type')doc.pop();else doc.push(x.w);redo.push(x);moved=x}
  else{if(!redo.length){last='r0';continue}const x=redo.pop();if(x.op==='type')doc.push(x.w);else doc.pop();undo.push(x);moved=x}}
 return {doc,undo,redo,last,cleared,moved}}
const OR_UNDO_SCRIPT=['t','t','t','d','u','u','r','t'];
SCENE({id:'undo-redo',name:'Undo and redo',tag:'Two stacks of actions',
 definition:'Editors keep two stacks. Every action is pushed onto the undo stack. Undo pops the latest action, reverses it and pushes it onto the redo stack; redo moves it back. Doing something new clears the redo stack.',
 example:'Type “The quick brown”, undo twice, then redo once: “The quick” comes back. Type something new and the redo stack is emptied, because that old future no longer makes sense.',
 desc:'A document line above two vertical stacks of actions, undo on the left and redo on the right; an arrow shows each action moving between them.',
 dur:13,hint:'Type words, delete one, then undo and redo. Watch actions move between the two stacks, and see redo cleared by a new action.',
 init:()=>({acts:['t','t','t']}),
 watch(p){return {acts:OR_UNDO_SCRIPT.slice(0,Math.min(OR_UNDO_SCRIPT.length,1+Math.floor(p*OR_UNDO_SCRIPT.length)))}},
 ui:[{b:'Type a word',act:'t'},{b:'Delete last word',act:'d'},{b:'Undo',act:'u'},{b:'Redo',act:'r'}],
 on:{t(s){s.acts.push('t')},d(s){s.acts.push('d')},u(s){s.acts.push('u')},r(s){s.acts.push('r')}},
 draw(s){
  const r=OR_undoRun(s.acts);let out=heading('Undo pops one stack and pushes the other');
  let txt=r.doc.join(' ');if(txt.length>42)txt='…'+txt.slice(-41);
  out+=R(40,46,520,48,'#fff',C.grid,8)+T(56,77,txt,18,C.ink,'start')+(r.doc.length?'':T(56,77,'(empty document)',16,C.muted,'start'));
  const stack=(cx,items,lab,col)=>{let o=P(`M${cx-84} 140V336H${cx+84}V140`,C.ink,2);const show=items.slice(-7);
   show.forEach((x,k)=>{const y=336-(k+1)*28,top=k===show.length-1;o+=R(cx-78,y,156,25,top?col:'#fff',top?col:C.line,5)+TF(cx,y+17,`${x.op} “${x.w}”`,13,top?'#fff':C.ink)});
   if(!items.length)o+=TF(cx,320,'empty',13,C.muted);return o+TB(cx,358,lab,14,col)};
  out+=stack(130,r.undo,'Undo stack',C.blue)+stack(470,r.redo,'Redo stack',C.purple);
  const yt=k=>336-Math.min(7,k)*28+12;
  if(r.last==='u')out+=arrow(216,yt(r.undo.length+1),384,yt(r.redo.length),C.purple,2.5)+TF(300,yt(r.undo.length+1)-10,'undo',13,C.purple);
  if(r.last==='r')out+=arrow(384,yt(r.redo.length+1),216,yt(r.undo.length),C.blue,2.5)+TF(300,yt(r.redo.length+1)-10,'redo',13,C.blue);
  if((r.last==='t'||r.last==='d')&&r.cleared)out+=R(222,200,156,40,C.coralp,'none',8)+TF(300,216,'new action:',13,C.coral)+TF(300,232,'redo stack cleared',13,C.coral);
  const L2=r.last,last=r.undo[r.undo.length-1];
  const say=L2==='t'?`Typed “${last.w}”: the action is pushed on the undo stack${r.cleared?', and the redo stack is cleared':''}.`:L2==='d'?`Deleted “${last.w}”: that action is pushed on the undo stack too${r.cleared?', and the redo stack is cleared':''}.`:L2==='u'?`Undo popped “${r.moved.op} ${r.moved.w}”, reversed it, and pushed it on the redo stack.`:L2==='r'?`Redo popped “${r.moved.op} ${r.moved.w}”, did it again, and pushed it back on the undo stack.`:L2==='u0'?'Nothing to undo: the undo stack is empty.':L2==='r0'?'Nothing to redo: the redo stack is empty.':L2==='d0'?'There is no word to delete.':'Type a word to begin.';
  return {svg:out,phase:say+' Both stacks are last in, first out: the most recent change is always the first to be undone.'};
 }});

/* ---- Queues ---- */
function OR_dqRun(acts){let it=[],nx=0,last='',out=null;for(const a of acts){last=a;out=null;if(a==='pf'||a==='pb'){if(it.length>=8){last='full';continue}const v=OR_LET[nx++%26];if(a==='pf')it.unshift(v);else it.push(v)}else{if(!it.length){last='empty';continue}out=a==='of'?it.shift():it.pop()}}return {it,last,out}}
const OR_DQ_SCRIPT=['pb','pb','pf','ob','pf','of','pb'];
SCENE({id:'deque',name:'Double-ended queue',tag:'Add and remove at both ends',
 definition:'A deque (“deck”) lets you add or remove items at either end in one step. Use one end only and it behaves as a stack; add at one end and remove at the other and it behaves as a queue.',
 example:'A browser history with a size limit pushes new pages at one end and drops the oldest from the other. Python’s collections.deque is one.',
 desc:'A row of items with a front and a back; arrows show items entering or leaving at either end, and three lines explain how the same structure acts as a stack or a queue.',
 dur:11,hint:'Push and pop at both ends. Try using only the back (a stack), or pushing at the back and popping at the front (a queue).',
 init:()=>({acts:['pb','pb','pf']}),
 watch(p){return {acts:OR_DQ_SCRIPT.slice(0,Math.min(OR_DQ_SCRIPT.length,1+Math.floor(p*OR_DQ_SCRIPT.length)))}},
 ui:[{b:'Push front',act:'pf'},{b:'Push back',act:'pb'},{b:'Pop front',act:'of'},{b:'Pop back',act:'ob'}],
 on:{pf(s){s.acts.push('pf')},pb(s){s.acts.push('pb')},of(s){s.acts.push('of')},ob(s){s.acts.push('ob')}},
 draw(s){
  const r=OR_dqRun(s.acts),n=r.it.length,w=54,x0=300-Math.max(n,1)*w/2,y=140;let out=heading('Both ends are open');
  out+=R(x0-6,y-8,Math.max(n,1)*w+12,60,'none',C.line,10,'stroke-dasharray="5 4"');
  r.it.forEach((v,i)=>{const nw=(r.last==='pf'&&i===0)||(r.last==='pb'&&i===n-1);out+=R(x0+i*w+3,y,w-6,44,nw?C.greenp:'#fff',nw?C.green:C.blue,7)+TB(x0+i*w+w/2,y+28,v,18,C.ink)});
  if(!n)out+=TF(300,y+28,'empty',13,C.muted);
  const lx=x0-12,rx=x0+Math.max(n,1)*w+12;out+=TB(lx-40,y+28,'front',14,C.muted)+TB(rx+38,y+28,'back',14,C.muted);
  const chip=(x,v,col)=>R(x-18,y+70,36,30,col,'none',6)+TB(x,y+90,v,15,'#fff');
  if(r.last==='pf')out+=curveArrow(lx-30,y+86,x0+w/2,y+48,-20,C.green,2.2)+TF(lx-30,y+110,'in',13,C.green);
  if(r.last==='pb')out+=curveArrow(rx+30,y+86,x0+(n-.5)*w,y+48,20,C.green,2.2)+TF(rx+30,y+110,'in',13,C.green);
  if(r.last==='of')out+=arrow(lx,y+22,lx-56,y+70,C.coral,2.2)+chip(lx-70,r.out,C.coral);
  if(r.last==='ob')out+=arrow(rx,y+22,rx+56,y+70,C.coral,2.2)+chip(rx+70,r.out,C.coral);
  out+=TF(300,282,'Push and pop at the back only: a stack (last in, first out).',13,C.ink);
  out+=TF(300,306,'Push at the back, pop at the front: a queue (first in, first out).',13,C.ink);
  out+=TF(300,330,'Each operation is one step at either end: nothing shifts along.',13,C.muted);
  const say={pf:'Pushed at the front.',pb:'Pushed at the back.',of:`Popped ${r.out} from the front.`,ob:`Popped ${r.out} from the back.`,full:'The deque is full in this picture (8 items).',empty:'The deque is empty: nothing to pop.'}[r.last]||'';
  return {svg:out,phase:say+' A deque is often built as a circular buffer, so both ends are reached in one step.'};
 }});

function OR_heapRun(heap,op){const a=heap.slice(),fr=[],snap=o=>fr.push({a:a.slice(),hl:[],...o});
 if(!op){snap({say:'A min-heap: every parent is smaller than its children, so the smallest value is always at the root.'});return fr}
 if(op.t==='ins'){if(a.length>=15){snap({done:true,say:'The heap is full in this picture (15 items).'});return fr}
  a.push(op.v);let i=a.length-1;snap({hl:[i],say:`Insert ${op.v}: put it in the next free place at the bottom (index ${i}).`});
  while(i>0){const p=(i-1)>>1;snap({hl:[i,p],cmp:true,say:`Compare ${a[i]} with its parent ${a[p]}.`});if(a[i]<a[p]){[a[i],a[p]]=[a[p],a[i]];snap({hl:[p],say:`${a[p]} is smaller, so swap: it sifts up.`});i=p}else break}
  snap({hl:[i],done:true,say:`${a[i]} has settled. Inserting takes at most ${Math.floor(Math.log2(a.length))} swaps, the height of the tree.`});return fr}
 if(!a.length){snap({done:true,say:'The heap is empty.'});return fr}
 const top=a[0];snap({hl:[0],say:`Remove the smallest value, ${top}, from the root.`});const last=a.pop();
 if(!a.length){snap({done:true,say:`${top} was the only item.`});return fr}
 a[0]=last;let i=0;snap({hl:[0],say:`Move the last item, ${last}, up to the root.`});
 for(;;){const l=2*i+1,r=l+1;if(l>=a.length)break;const c=r<a.length&&a[r]<a[l]?r:l;snap({hl:[i,c],cmp:true,say:`Compare ${a[i]} with its smaller child, ${a[c]}.`});if(a[c]<a[i]){[a[c],a[i]]=[a[i],a[c]];snap({hl:[c],say:`Swap: ${a[c]} sifts down.`});i=c}else break}
 snap({hl:[i],done:true,say:`Done: ${top} was served first and the heap order is restored.`});return fr}
function OR_heapFinal(s){const fr=OR_heapRun(s.heap,s.op);return fr[fr.length-1].a}
SCENE({id:'binary-heap',name:'Priority queue (binary heap)',tag:'Most urgent first',
 definition:'A priority queue always serves the most urgent item next. A binary heap stores it as a tree in an array: each parent is smaller than its children, so the smallest is at the root. Inserting sifts a value up; removing the root sifts a replacement down.',
 example:'Item i has children at 2i + 1 and 2i + 2. With 1,000,000 items, an insert or removal needs at most about 20 swaps. Schedulers and Dijkstra’s algorithm use heaps.',
 desc:'A binary tree of numbers above the array that stores it, index by index; compared and swapped values are highlighted as a new value sifts up or the root’s replacement sifts down.',
 dur:13,hint:'Choose a value and Insert it, or Remove smallest. Step to watch it sift up or down, in the tree and in the array at the same time.',
 init:()=>({heap:[3,5,4,9,7,8],op:{t:'ins',v:2},v:6}),
 ui:[{range:'v',label:'Value',min:1,max:60,get:s=>s.v,act:'val'},{b:'Insert',act:'ins'},{b:'Remove smallest',act:'del'}],
 on:{val(s,v){s.v=v;return 'keep'},ins(s){s.heap=OR_heapFinal(s);s.op={t:'ins',v:s.v};s.v=(s.v*7+5)%60+1},del(s){s.heap=OR_heapFinal(s);s.op={t:'del'}}},
 trace(s){return OR_heapRun(s.heap,s.op)},
 draw(s,f){
  const a=f.a,pos=i=>{const d=Math.floor(Math.log2(i+1)),j=i-(2**d-1);return [20+(j+.5)*560/2**d,72+d*56]};let out=heading('Every parent is smaller than its children');
  for(let i=1;i<a.length;i++){const [x,y]=pos(i),[px,py]=pos((i-1)>>1);out+=L(px,py,x,y,C.line,2)}
  a.forEach((v,i)=>{const [x,y]=pos(i),hl=f.hl.includes(i);out+=Ci(x,y,18,hl?(f.cmp?C.amberp:C.coralp):i===0?C.pale:'#fff',hl?(f.cmp?C.amber:C.coral):C.blue)+TBF(x,y+5,v,15,C.ink)});
  if(!a.length)out+=T(300,150,'Empty heap',16,C.muted);
  const w=36,x0=300-15*w/2;out+=TF(x0,292,'the same heap as an array',13,C.muted,'start');
  for(let i=0;i<15;i++){const has=i<a.length,hl=f.hl.includes(i);out+=R(x0+i*w+1,298,w-2,32,hl?(f.cmp?C.amberp:C.coralp):has?'#fff':'none',hl?(f.cmp?C.amber:C.coral):has?C.blue:C.grid,4,has?'':'stroke-dasharray="3 3"')+(has?TBF(x0+i*w+w/2,319,a[i],13,C.ink):'')+TMF(x0+i*w+w/2,346,i,13,C.muted)}
  out+=TF(x0+15*w,366,'children of index i: 2i + 1 and 2i + 2',13,C.muted,'end');
  return {svg:out,phase:f.say};
 }});

/* ---- Hash functions ---- */
const OR_HNAME={first:'Hash = first letter',sum:'Hash = sum of character codes',poly:'Hash = h × 31 + code, for each character'};
SCENE({id:'hash-spread',name:'Spreading keys evenly',tag:'Good hashes avoid clusters',
 definition:'A good hash function spreads keys evenly over the buckets, so each bucket holds about n ÷ m keys. A poor one clusters keys into a few buckets, and every look-up in a crowded bucket is slow.',
 example:'Hashing animal names by their first letter puts “cat”, “cod” and “crab” together, while many buckets stay empty. Mixing every character in, as h × 31 + code does, spreads them out.',
 desc:'A bar chart of how many keys land in each bucket under the chosen hash function, with a dashed line at the ideal even share and the fullest bucket highlighted.',
 dur:12,hint:'Compare the three hash functions on the same keys. Change the number of buckets and keys; aim for bars close to the dashed line.',
 init:()=>({fn:'first',m:8,n:40}),
 watch(p){return {fn:p<1/3?'first':p<2/3?'sum':'poly',m:8,n:40}},
 ui:[{choose:[['first','First letter'],['sum','Sum of codes'],['poly','× 31 mixing']],label:'Hash function',get:s=>s.fn,act:'fn'},{range:'m',label:'Buckets',min:4,max:16,get:s=>s.m,act:'m'},{range:'n',label:'Keys',min:8,max:60,get:s=>s.n,act:'n'}],
 on:{fn(s,v){s.fn=v},m(s,v){s.m=v},n(s,v){s.n=v}},
 draw(s){
  const keys=OR_WORDS.slice(0,s.n),h=s.fn==='first'?OR_hfirst:s.fn==='sum'?OR_hsum:OR_hpoly,cnt=Array(s.m).fill(0),by=range(s.m).map(()=>[]);
  keys.forEach(k=>{const b=h(k,s.m);cnt[b]++;by[b].push(k)});
  const mx=Math.max(...cnt),ideal=s.n/s.m,top=Math.max(mx,Math.ceil(ideal*2)),bx=50,bw=500/s.m,base=270,sc=170/top,imax=cnt.indexOf(mx),empty=cnt.filter(c=>!c).length;
  let out=heading(OR_HNAME[s.fn]);
  out+=L(50,56,80,56,C.green,2,'stroke-dasharray="6 5"')+TF(86,61,`ideal: ${s.n} keys ÷ ${s.m} buckets = ${fmt(ideal)} each`,13,C.green,'start');
  cnt.forEach((c,i)=>{out+=R(bx+i*bw+3,base-c*sc,bw-6,c*sc,i===imax?C.coral:C.blue,'none',3)+TF(bx+i*bw+bw/2,base-c*sc-5,c,13,C.ink)+TF(bx+i*bw+bw/2,base+16,i,13,C.muted)});
  out+=L(bx,base,bx+500,base,C.line,1.5)+L(bx,base-ideal*sc,bx+500,base-ideal*sc,C.green,2,'stroke-dasharray="6 5"');
  out+=TB(300,312,`Longest chain ${mx} · empty buckets ${empty}`,15,mx>2*ideal?C.coral:C.ink);
  out+=TF(300,338,`Bucket ${imax}: ${by[imax].slice(0,8).join(', ')}${by[imax].length>8?', …':''}`,13,C.ink);
  out+=TF(300,362,s.fn==='first'?'Only 26 possible first letters, and some are far more common.':s.fn==='sum'?'Better, but anagrams such as “act” and “cat” still always collide.':'Each character shifts and mixes the total, so order matters and keys spread out.',13,C.muted);
  return {svg:out,phase:`${s.n} keys in ${s.m} buckets: the ideal is ${fmt(ideal)} per bucket. This hash puts up to ${mx} in one bucket and leaves ${empty} empty. A look-up must search its whole bucket, so evenness is speed.`};
 }});

function OR_fault(t,f){const a=Array.from(t);if(a.length<2)return t;if(f==='bit')a[1]=String.fromCharCode(a[1].charCodeAt(0)^1);if(f==='swap')[a[0],a[1]]=[a[1],a[0]];return a.join('')}
function OR_ck(t,fn){const c=Array.from(t).map(x=>x.charCodeAt(0)&255);if(fn==='sum')return sum(c)%256;let s1=0,s2=0;for(const v of c){s1=(s1+v)%255;s2=(s2+s1)%255}return s2*256+s1}
SCENE({id:'checksum',name:'Checksum',tag:'A hash that catches damage',
 definition:'A checksum is a small number computed from data and sent along with it. The receiver recomputes it: if the numbers differ, the data was damaged on the way. A better checksum also notices changes in order, not just in value.',
 example:'Adding up the bytes of “HELLO” catches a flipped bit but misses two swapped letters, because addition ignores order. Fletcher’s checksum keeps a running total of running totals, so position matters and the swap is caught.',
 desc:'A sent message and the received copy, each with its character codes and checksum; damaged characters are highlighted and a verdict says whether the checksums disagree.',
 dur:12,hint:'Type a message, choose some damage, and compare the two checksums. Find the damage that the simple sum misses.',
 init:()=>({text:'HELLO',fault:'swap',fn:'sum'}),
 watch(p){const q=Math.min(3,Math.floor(p*4));return {text:'HELLO',fault:['none','bit','swap','swap'][q],fn:q<3?'sum':'fletcher'}},
 ui:[{text:'Message',label:'Message',get:s=>s.text,act:'text',max:8},{choose:[['none','No damage'],['bit','Flip a bit'],['swap','Swap two letters']],label:'Damage',get:s=>s.fault,act:'fault'},{choose:[['sum','Sum of bytes'],['fletcher','Fletcher']],label:'Checksum',get:s=>s.fn,act:'fn'}],
 on:{text(s,v){s.text=String(v).slice(0,8)},fault(s,v){s.fault=v},fn(s,v){s.fn=v}},
 draw(s){
  const t=s.text||'?',rx=OR_fault(t,s.fault),a=Array.from(t),b=Array.from(rx),c1=OR_ck(t,s.fn),c2=OR_ck(rx,s.fn),caught=c1!==c2,damaged=t!==rx;
  let out=heading(s.fn==='sum'?'Add up every byte (mod 256)':'Fletcher: a running total of running totals');
  const w=Math.min(56,400/a.length),x0=40,row=(y,arr,lab,cmp)=>{let o=TB(x0,y-12,lab,14,C.muted,'start');arr.forEach((ch,i)=>{const bad=cmp&&ch!==a[i];o+=R(x0+i*w+2,y,w-4,40,bad?C.coralp:'#fff',bad?C.coral:C.blue,6)+TM(x0+i*w+w/2,y+26,ch,18,C.ink)+TMF(x0+i*w+w/2,y+58,ch.charCodeAt(0),13,bad?C.coral:C.muted)});return o};
  out+=row(78,a,'sent',false)+row(198,b,'received',true);
  const ck=(y,v,col)=>R(470,y,110,40,'#fff',col,8)+TBF(525,y+26,s.fn==='sum'?v:hex(v,4),16,col);
  out+=TF(525,66,'checksum',13,C.muted)+ck(78,c1,C.blue)+ck(198,c2,caught?C.coral:C.blue);
  out+=TF(525,140,s.fn==='sum'?'sent with the data':'two running totals',13,C.muted);
  out+=arrow(525,124,525,192,C.line,2,7);
  const verdict=!damaged?['No damage: the checksums agree.',C.green,C.greenp]:caught?['Damage detected: the checksums differ ✓',C.green,C.greenp]:['Damage missed: the checksums still agree ✗',C.coral,C.coralp];
  out+=R(80,300,440,44,verdict[2],verdict[1],10)+TB(300,328,verdict[0],16,verdict[1]);
  return {svg:out,phase:!damaged?'The received copy matches, so both checksums agree.':caught?`The received checksum is ${s.fn==='sum'?c2:hex(c2,4)}, not ${s.fn==='sum'?c1:hex(c1,4)}, so the receiver asks for the data again.`:'Swapping two letters keeps the same bytes in a different order, and a plain sum cannot see order. Fletcher’s second total weights earlier bytes more heavily, so it would catch this.'};
 }});

/* ---- Hash tables ---- */
function OR_lf(n,grow){let m=4,keys=[],moved=0,resized=false,from=0;for(let i=0;i<n;i++){keys.push(OR_WORDS[i]);resized=false;if(grow&&keys.length/m>.75){from=m;m*=2;moved=keys.filter(k=>OR_hpoly(k,from)!==OR_hpoly(k,m)).length;resized=true}}return {m,keys,resized,moved,from}}
SCENE({id:'load-factor',name:'Load factor and resizing',tag:'Grow before it gets crowded',
 definition:'The load factor is keys ÷ buckets. As it rises, chains get longer and look-ups slow down, so a hash table doubles its buckets when the load factor passes a threshold (often 0.75) and rehashes every key into the new table.',
 example:'With 4 buckets, the 4th key pushes the load factor to 1, above 0.75, so the table grows to 8 buckets. Each key’s bucket is recalculated, and many keys move.',
 desc:'Columns of small squares, one column per bucket, above a gauge of the load factor with the 0.75 threshold; after a resize, keys that moved bucket are highlighted.',
 dur:12,hint:'Insert keys one at a time. With resizing on, watch the table double at the threshold; turn it off and watch the chains grow.',
 init:()=>({n:6,grow:'grow'}),
 watch(p){return {n:Math.min(14,1+Math.floor(p*14)),grow:'grow'}},
 ui:[{b:'Insert next key',act:'ins'},{range:'n',label:'Keys',min:1,max:24,get:s=>s.n,act:'n'},{choose:[['grow','Resize at 0.75'],['fixed','Never resize']],label:'Policy',get:s=>s.grow,act:'grow'}],
 on:{ins(s){if(s.n<24)s.n++},n(s,v){s.n=v},grow(s,v){s.grow=v}},
 draw(s){
  const g=s.grow==='grow',r=OR_lf(s.n,g),m=r.m,a=s.n/m,cw=Math.min(56,520/m),x0=300-m*cw/2,base=292;let out=heading(r.resized?`Resized: ${r.from} → ${m} buckets, every key rehashed`:'Insert, and watch the load factor');
  const gx=60,gw=480,ga=Math.min(2,a);out+=R(gx,50,gw,16,'#eef2f4','none',8)+R(gx,50,gw*ga/2,16,a>.75?C.amber:C.green,'none',8);
  if(g)out+=L(gx+gw*.375,44,gx+gw*.375,72,C.coral,2)+TF(gx+gw*.375,88,'0.75',13,C.coral);
  out+=TF(gx,88,'0',13,C.muted,'start')+TF(gx+gw,88,'2',13,C.muted,'end')+TBF(gx+gw*ga/2,44,'α = '+fmt(a),13,C.ink);
  const cols=range(m).map(()=>[]);r.keys.forEach((k,i)=>cols[OR_hpoly(k,m)].push(i));
  const moved=new Set(r.resized?r.keys.map((k,i)=>OR_hpoly(k,r.from)!==OR_hpoly(k,m)?i:-1).filter(i=>i>=0):[]);
  cols.forEach((c,b)=>{c.forEach((i,j)=>{const nw=i===s.n-1;out+=R(x0+b*cw+cw/2-8,base-(j+1)*18,16,16,nw?C.coral:moved.has(i)?C.green:C.blue,'none',3)});
   out+=L(x0+b*cw+3,base+2,x0+(b+1)*cw-3,base+2,C.line,2);if(m<=16||b%4===0)out+=TF(x0+b*cw+cw/2,base+18,b,13,C.muted)});
  const mx=Math.max(...cols.map(c=>c.length));
  out+=TB(300,334,`${s.n} keys ÷ ${m} buckets = load factor ${fmt(a)} · longest chain ${mx}`,15,C.ink);
  out+=TF(300,360,r.resized?`${r.moved} of ${s.n} keys moved to a different bucket (green).`:g?'Orange is the newest key. The table doubles when α passes 0.75.':'Without resizing, α and the chains keep growing: look-ups slow down.',13,C.muted);
  return {svg:out,phase:r.resized?`The last insert pushed α above 0.75, so the table doubled to ${m} buckets. Every key’s bucket = hash mod ${m} had to be recalculated; ${r.moved} keys moved. Resizing is expensive but rare, like a dynamic array doubling.`:`Load factor ${fmt(a)}: on average a bucket holds ${fmt(a)} keys, and the longest chain has ${mx}.`};
 }});

const OR_PM=11;
function OR_lpPlace(keys){const sl=Array(OR_PM).fill(null);for(const k of keys){const h=OR_hsum(k,OR_PM);for(let p=0;p<OR_PM;p++){const j=(h+p)%OR_PM;if(sl[j]===null){sl[j]=k;break}if(sl[j]===k)break}}return sl}
function OR_lpRun(keys,op){const sl=OR_lpPlace(keys),fr=[];if(!op){fr.push({sl,probe:[],say:'Each key goes in the slot its hash picks; if that slot is taken, try the next one along.'});return fr}
 const h=OR_hsum(op.k,OR_PM);fr.push({sl,h,probe:[],say:`h(“${op.k}”) = sum of its character codes mod 11 = ${h}.`});const probe=[];
 for(let p=0;p<OR_PM;p++){const j=(h+p)%OR_PM;probe.push(j);
  if(sl[j]===null){if(op.t==='ins'){const s2=sl.slice();s2[j]=op.k;fr.push({sl:s2,h,probe:probe.slice(),at:j,done:true,say:p?`Slot ${j} is empty: store “${op.k}” there, after ${p+1} probes.`:`Slot ${j} is empty: store “${op.k}” there in one probe.`})}
   else fr.push({sl,h,probe:probe.slice(),at:j,done:true,miss:true,say:`Slot ${j} is empty, so “${op.k}” is not in the table (${p+1} probe${p?'s':''}). A look-up can stop at the first empty slot.`});return fr}
  if(sl[j]===op.k){fr.push({sl,h,probe:probe.slice(),at:j,done:true,found:true,say:op.t==='ins'?`“${op.k}” is already stored in slot ${j}.`:`Found “${op.k}” in slot ${j} after ${p+1} probe${p?'s':''}.`});return fr}
  fr.push({sl,h,probe:probe.slice(),at:j,say:`Slot ${j} holds “${sl[j]}”: a collision. Try the next slot.`})}
 fr.push({sl,h,probe,done:true,full:true,say:'Every slot has been tried: the table is full.'});return fr}
function OR_lpCommit(s){if(s.op&&s.op.t==='ins'){const sl=OR_lpPlace(s.keys);if(!sl.includes(s.op.k)&&sl.includes(null))s.keys.push(s.op.k)}}
const OR_lpClean=v=>String(v).toLowerCase().replace(/[^a-z]/g,'').slice(0,5);
SCENE({id:'linear-probing',name:'Open addressing (linear probing)',tag:'Collisions step to the next slot',
 definition:'Instead of chaining, open addressing keeps every key in the table itself. On a collision, linear probing tries the next slot, then the next, wrapping round, until it finds an empty one. A look-up follows the same path.',
 example:'“cat” and “act” both hash to slot 4. “cat” takes slot 4, so “act” probes on to slot 5. Runs of full slots (clusters) make later probes longer.',
 desc:'Eleven numbered slots in a row; arrows show a key’s probe sequence from its home slot to the first empty slot, with the current probe highlighted.',
 dur:12,hint:'Type a short key, then Insert or Look up and Step through the probes. The anagram example forces collisions.',
 init:()=>({keys:['cat','dog','emu','owl'],op:{t:'ins',k:'act'},text:'act'}),
 ui:[{text:'Key',label:'Key',get:s=>s.text,act:'text',max:5},{b:'Insert',act:'ins'},{b:'Look up',act:'find'},{b:'Anagrams',act:'ana'},{b:'Clear',act:'clear'}],
 on:{text(s,v){s.text=OR_lpClean(v);return 'keep'},ins(s){OR_lpCommit(s);const k=OR_lpClean(s.text);s.op=k?{t:'ins',k}:null},find(s){OR_lpCommit(s);const k=OR_lpClean(s.text);s.op=k?{t:'find',k}:null},
  ana(s){s.keys=['cat','act','tac','dog'];s.op={t:'ins',k:'god'};s.text='god'},clear(s){s.keys=[];s.op=null}},
 trace(s){return OR_lpRun(s.keys,s.op)},
 draw(s,f){
  const w=48,x0=300-OR_PM*w/2,y=150;let out=heading('Collision? Try the next slot');
  const filled=f.sl.map(v=>v!==null);
  for(let j=0;j<OR_PM;j++){const v=f.sl[j],cur=j===f.at,pr=f.probe&&f.probe.includes(j);
   out+=TMF(x0+j*w+w/2,y-10,j,13,j===f.h?C.coral:C.muted)+R(x0+j*w+2,y,w-4,44,cur?(f.done?(f.miss?C.amberp:C.greenp):C.amberp):pr?'#fff4ee':v!==null?C.pale:'#fff',cur?(f.done&&!f.miss?C.green:C.amber):v!==null?C.blue:C.grid,6,v===null?'stroke-dasharray="4 3"':'')+(v!==null?TMF(x0+j*w+w/2,y+27,v,13,C.ink):'')}
  // clusters: runs of filled slots
  let j=0;while(j<OR_PM){if(filled[j]){let e=j;while(e+1<OR_PM&&filled[e+1])e++;if(e>j)out+=P(`M${x0+j*w+4} ${y+52}v6H${x0+(e+1)*w-4}v-6`,C.purple,1.6)+TF(x0+(j+e+1)*w/2,y+74,'cluster',13,C.purple);j=e+1}else j++}
  if(f.h!==undefined){const hx=x0+f.h*w+w/2;out+=R(hx-46,72,92,24,C.coral,'none',6)+TF(hx,89,'h(k) = '+f.h,13,'#fff')+arrow(hx,96,hx,y-18,C.coral,2,7);
   for(let i=1;i<(f.probe||[]).length;i++){const a=f.probe[i-1],b=f.probe[i];if(b>a)out+=curveArrow(x0+a*w+w/2+6,y+46,x0+b*w+w/2-6,y+46,-16,C.amber,2);else out+=TF(x0+b*w+w/2,y+100,'wrapped to 0',13,C.amber)}}
  const op=s.op;out+=TB(300,282,op?`${op.t==='ins'?'Insert':'Look up'} “${op.k}”`:'Type a key, then Insert or Look up',16,C.ink);
  out+=counter(240,300,'probes',(f.probe||[]).length,C.amber,120);
  out+=TF(300,370,`${f.sl.filter(v=>v!==null).length} of ${OR_PM} slots used · keys hashed by sum of codes mod ${OR_PM}`,13,C.muted);
  return {svg:out,phase:f.say};
 }});

/* ---- Trees ---- */
const OR_TT={v:'F',l:{v:'B',l:{v:'A',l:null,r:null},r:{v:'D',l:{v:'C',l:null,r:null},r:{v:'E',l:null,r:null}}},r:{v:'G',l:null,r:{v:'I',l:{v:'H',l:null,r:null},r:null}}};
function OR_order(t,kind){const o=[];if(kind==='level'){const q=[t];while(q.length){const n=q.shift();o.push(n);if(n.l)q.push(n.l);if(n.r)q.push(n.r)}return o}
 (function w(n){if(!n)return;if(kind==='pre')o.push(n);w(n.l);if(kind==='in')o.push(n);w(n.r);if(kind==='post')o.push(n)})(t);return o}
const OR_RULE={pre:'Pre-order: visit the node, then its left subtree, then its right subtree.',in:'In-order: left subtree, then the node, then the right subtree.',post:'Post-order: left subtree, then right subtree, then the node.',level:'Level order: row by row from the root, using a queue.'};
SCENE({id:'tree-traversal',name:'Tree traversal',tag:'Visit every node once',
 definition:'A traversal visits every node of a tree exactly once in a fixed order. Depth-first orders (pre-order, in-order, post-order) differ only in when a node is visited relative to its subtrees; level order visits row by row.',
 example:'Pre-order copies a tree (parents before children); post-order deletes one or totals folder sizes (children first); in-order of a search tree gives sorted order.',
 desc:'A binary tree of lettered nodes; each node gains a numbered badge as it is visited in the chosen order, and the visit sequence builds up underneath.',
 dur:12,hint:'Choose an order and Step through. Compare where F, the root, appears in each sequence.',
 init:()=>({kind:'pre'}),
 ui:[{choose:[['pre','Pre-order'],['in','In-order'],['post','Post-order'],['level','Level order']],label:'Order',get:s=>s.kind,act:'kind'}],
 on:{kind(s,v){s.kind=v}},
 trace(s){const o=OR_order(OR_TT,s.kind),fr=[{k:0,o,say:OR_RULE[s.kind]}];o.forEach((n,i)=>fr.push({k:i+1,o,say:`Visit ${n.v}${i===o.length-1?'. Every node has been visited exactly once.':'.'}`}));return fr},
 draw(s,f){
  const lay=OR_bLayout(OR_TT,70,530,76,62),seen=new Map(f.o.slice(0,f.k).map((n,i)=>[n,i+1])),cur=f.k?f.o[f.k-1]:null;let out=heading({pre:'Node first, then children',in:'Left, node, right',post:'Children first, then the node',level:'Row by row'}[s.kind]);
  out+=OR_drawBin(lay,(o,q)=>q?{col:seen.has(q.n)?C.blue:C.line}:{fill:o.n===cur?C.amberp:seen.has(o.n)?C.pale:'#fff',stroke:o.n===cur?C.amber:C.blue,badge:seen.get(o.n)},19);
  out+=T(300,292,OR_RULE[s.kind],14,C.muted);
  const w=40,x0=300-9*w/2;for(let i=0;i<9;i++){const n=f.o[i],on=i<f.k;out+=R(x0+i*w+3,310,w-6,36,on?(i===f.k-1?C.amberp:C.pale):'#fff',on?C.blue:C.grid,6,on?'':'stroke-dasharray="3 3"')+(on?TB(x0+i*w+w/2,334,n.v,16,C.ink):'')}
  out+=TF(300,368,'visit order',13,C.muted);
  return {svg:out,phase:f.say+(f.k===9?` Sequence: ${f.o.map(n=>n.v).join(' ')}.`:'')};
 }});

function OR_trie(words){const root={ch:'',kids:{},end:false};for(const w of words){let n=root;for(const c of w)n=n.kids[c]||(n.kids[c]={ch:c,kids:{},end:false});n.end=true}return root}
function OR_trieLay(root){const nodes=[];let leaf=0;(function lay(n,d,pre){n.d=d;n.word=pre;const ks=Object.keys(n.kids).sort();if(!ks.length)n.x=leaf++;else{ks.forEach(k=>lay(n.kids[k],d+1,pre+k));n.x=(n.kids[ks[0]].x+n.kids[ks[ks.length-1]].x)/2}nodes.push(n)})(root,0,'');
 const L2=Math.max(1,leaf-1);nodes.forEach(n=>{n.px=leaf>1?50+n.x*500/L2:300;n.py=56+n.d*46});return nodes}
const OR_TRIE0=['car','cart','care','cat','cup','do','dog','dot'];
SCENE({id:'trie',name:'Trie (prefix tree)',tag:'Words that share a beginning share a path',
 definition:'A trie stores words letter by letter down a tree: words with the same beginning share the same path, and a marked node says “a word ends here”. Finding every word with a given prefix means walking down the prefix, then collecting the subtree.',
 example:'car, cart and care share the path c → a → r. Typing “ca” on a phone keyboard walks two steps down and offers every word below. Search time depends on the word’s length, not on how many words are stored.',
 desc:'A tree of letters with word-ending nodes double-ringed; the path for the typed prefix is highlighted, and every word below it is shaded as a completion.',
 dur:12,hint:'Type a prefix to see its path and completions. Press Insert word to add what you typed (letters only, up to 6).',
 init:()=>({words:OR_TRIE0.slice(),text:'ca'}),
 watch(p){return {words:OR_TRIE0,text:'car'.slice(0,Math.min(3,Math.floor(p*4)))}},
 ui:[{text:'Prefix or word',label:'Prefix or word',get:s=>s.text,act:'text',max:6},{b:'Insert word',act:'ins'},{b:'Remove word',act:'rem'}],
 on:{text(s,v){s.text=String(v).toLowerCase().replace(/[^a-z]/g,'').slice(0,6)},ins(s){if(s.text&&!s.words.includes(s.text)&&s.words.length<10)s.words.push(s.text)},rem(s){s.words=s.words.filter(w=>w!==s.text)}},
 draw(s){
  const root=OR_trie(s.words),nodes=OR_trieLay(root);let out=heading(s.text?`Prefix “${s.text}”`:'Words share paths from the root');
  let n=root;const path=new Set([root]);let ok=true;for(const c of s.text){if(n.kids[c]){n=n.kids[c];path.add(n)}else{ok=false;break}}
  const sub=new Set(),comps=[];if(ok){(function w(x){sub.add(x);if(x.end)comps.push(x.word);Object.keys(x.kids).sort().forEach(k=>w(x.kids[k]))})(n)}
  for(const x of nodes)for(const k in x.kids){const c=x.kids[k];out+=L(x.px,x.py,c.px,c.py,path.has(c)?C.amber:sub.has(c)?C.green:C.line,path.has(c)?3.5:2)}
  for(const x of nodes){const isRoot=x===root,inP=path.has(x)&&!isRoot,inS=sub.has(x)&&!inP;
   out+=Ci(x.px,x.py,isRoot?8:15,isRoot?C.dark:inP?C.amberp:inS?C.greenp:'#fff',isRoot?C.dark:inP?C.amber:inS?C.green:C.blue);
   if(x.end)out+=Ci(x.px,x.py,11,'none',inS||inP?C.green:C.blue);if(!isRoot)out+=TBF(x.px,x.py+5,x.ch,14,C.ink)}
  out+=TF(580,58,s.text?(ok?`${comps.length} word${comps.length===1?'':'s'} start with “${s.text}”`:`no word starts with “${s.text}”`):`${s.words.length} words`,13,ok?C.green:C.coral,'end');
  return {svg:out,phase:s.text?(ok?`Walked ${s.text.length} step${s.text.length===1?'':'s'} down from the root. Completions: ${comps.join(', ')||'none'}. Double rings mark where a word ends, so “car” and “cart” can both be stored.`:`The path stops: no stored word starts with “${s.text}”. The search failed after reading just ${[...path].length} letter${[...path].length===2?'':'s'}.`):'Each path from the root spells a word; double rings mark where a word ends.'};
 }});

/* ---- Binary search trees ---- */
const OR_DEL0=[50,30,70,20,40,60,80,35,45,65];
function OR_bDelTrace(vals,v){let t=OR_bFrom(vals);const fr=[],snap=o=>fr.push({t:OR_bClone(t),hl:[],cs:null,...o});
 if(v===null||v===undefined){snap({done:true,say:'Press a node to delete it.'});return fr}
 let parent=null,n=t;snap({say:`Delete ${v}: first find it, as in a search.`});
 while(n&&n.v!==v){snap({hl:[n.v],say:`${v} ${v<n.v?'<':'>'} ${n.v}: go ${v<n.v?'left':'right'}.`});parent=n;n=v<n.v?n.l:n.r}
 if(!n){snap({done:true,say:`${v} is not in the tree.`});return fr}
 const kids=(n.l?1:0)+(n.r?1:0);
 if(kids<2){snap({hl:[v],cs:kids,say:kids?`Found ${v}. It has one child: link its parent straight to that child.`:`Found ${v}. It is a leaf: simply remove it.`});
  const child=n.l||n.r;if(!parent)t=child;else if(parent.l===n)parent.l=child;else parent.r=child;
  snap({cs:kids,done:true,say:kids?`${v} is gone and its child took its place. The left-smaller, right-larger rule still holds.`:`${v} is gone. Nothing else had to change.`});return fr}
 snap({hl:[v],cs:2,say:`Found ${v}. It has two children, so replace it with its in-order successor: the smallest value in its right subtree.`});
 let sp=n,sx=n.r;snap({hl:[v,sx.v],cs:2,say:`Step right once, to ${sx.v}…`});while(sx.l){sp=sx;sx=sx.l;snap({hl:[v,sx.v],cs:2,say:`…then left as far as possible: ${sx.v}.`})}
 const sv=sx.v;n.v=sv;snap({hl:[sv],cs:2,say:`Copy ${sv} into the node being deleted. It is larger than everything on the left and smaller than everything else on the right.`});
 if(sp===n)sp.r=sx.r;else sp.l=sx.r;snap({cs:2,done:true,say:`Remove the old ${sv} from lower down. It had no left child, so that is the easy case. Done.`});return fr}
function OR_delFinal(s){const fr=OR_bDelTrace(s.vals,s.del);return OR_bVals(fr[fr.length-1].t)}
SCENE({id:'bst-deletion',name:'Deleting from a search tree',tag:'Three cases',
 definition:'Deleting from a binary search tree has three cases: a leaf is simply removed; a node with one child is replaced by that child; a node with two children takes the value of its in-order successor, which is then removed from lower down.',
 example:'Deleting 30, which has children 20 and 40: its successor is 35, the smallest value right of 30. Copy 35 into 30’s place and remove the old 35.',
 desc:'A binary search tree with the node being deleted and the successor highlighted as the search and repair proceed; three boxes name the cases, with the current one lit.',
 dur:13,hint:'Press any node to delete it, or load an example of each case. Step to see how the tree is repaired.',
 init:()=>({vals:OR_DEL0.slice(),del:30}),
 ui:[{b:'Leaf',act:'ex',arg:20},{b:'One child',act:'ex',arg:60},{b:'Two children',act:'ex',arg:30}],
 on:{del(s,v){s.vals=OR_delFinal(s);s.del=Number(v)},ex(s,v){s.vals=OR_DEL0.slice();s.del=Number(v)}},
 trace(s){return OR_bDelTrace(s.vals,s.del)},
 draw(s,f,X){
  let out=heading('Delete '+s.del+', then repair the tree');const lay=OR_bLayout(f.t,50,550,72,56);
  out+=OR_drawBin(lay,(o,q)=>q?{}:{fill:f.hl.includes(o.n.v)?(f.hl[0]===o.n.v?C.coralp:C.amberp):'#fff',stroke:f.hl.includes(o.n.v)?C.coral:C.blue,wrap:inner=>hit(X,'del',o.n.v,`Delete ${o.n.v}`,inner)});
  if(!f.t)out+=T(300,150,'The tree is empty.',16,C.muted);
  ['Leaf: remove','One child: bypass','Two children: successor'].forEach((lab,i)=>{const on=f.cs===i,x=40+i*180;out+=R(x,300,160,40,on?C.amberp:'#fff',on?C.amber:C.grid,8)+TF(x+80,325,lab,13,on?C.ink:C.muted)});
  out+=TF(300,366,'In-order reading stays sorted after every case: '+OR_order(f.t||{},'in').filter(n=>n.v!==undefined).map(n=>n.v).join(' '),13,C.muted);
  return {svg:out,phase:f.say};
 }});

function OR_midOrder(lo,hi,o=[]){if(lo>hi)return o;const m=(lo+hi)>>1;o.push(m);OR_midOrder(lo,m-1,o);OR_midOrder(m+1,hi,o);return o}
SCENE({id:'bst-balance',name:'Balanced or lopsided',tag:'Shape decides the speed',
 definition:'A binary search tree is only fast when it is balanced. Inserting keys in sorted order builds a lopsided chain as tall as the number of keys; inserting them middle-first builds a bushy tree only about log₂ n levels tall.',
 example:'The keys 1 to 15 in order make a chain of 15 levels: finding 15 takes 15 comparisons. Inserted middle-first (8, 4, 12, 2…) they make 4 levels: at most 4 comparisons. Self-balancing trees (AVL, red-black) keep the bushy shape automatically.',
 desc:'Two trees holding the same keys side by side: a diagonal chain from sorted insertion and a balanced tree from middle-first insertion, each highlighting the search path to the chosen key.',
 dur:12,hint:'Choose how many keys and which key to search for. Compare the number of comparisons in each tree.',
 init:()=>({n:15,target:13}),
 watch(p){return {n:15,target:Math.min(15,1+Math.floor(p*15))}},
 ui:[{range:'n',label:'Keys',min:3,max:15,get:s=>s.n,act:'n'},{range:'target',label:'Search for',min:1,max:15,get:s=>s.target,act:'target'}],
 on:{n(s,v){s.n=v;s.target=Math.min(s.target,v)},target(s,v){s.target=v}},
 draw(s){
  const n=s.n,tg=Math.min(s.target,n);let out=heading('Same keys, different shapes');
  out+=TB(150,58,'Inserted in order 1, 2, 3…',14,C.coral)+TB(450,58,'Inserted middle-first',14,C.green);
  const dx=Math.min(40,230/Math.max(1,n-1)),dy=Math.min(40,210/Math.max(1,n-1)),r=n<=8?14:9;
  for(let i=1;i<=n;i++){const x=36+(i-1)*dx,y=86+(i-1)*dy,on=i<=tg;if(i>1)out+=L(x-dx,y-dy,x,y,on?C.coral:C.line,on?3:2);out+=Ci(x,y,r,i===tg?C.coral:on?C.coralp:'#fff',i===tg||on?C.coral:C.blue);
   if(n<=8)out+=TBF(x,y+5,i,13,i===tg?'#fff':C.ink);else if(i===1||i===n||i===tg)out+=TBF(x+r+12,y+5,i,13,i===tg?C.coral:C.muted)}
  const bt=OR_bFrom(OR_midOrder(1,n)),lay=OR_bLayout(bt,320,580,86,56);let p=[],q=bt;while(q){p.push(q.v);if(q.v===tg)break;q=tg<q.v?q.l:q.r}const ps=new Set(p);
  out+=OR_drawBin(lay,(o,qq)=>qq?{col:ps.has(o.n.v)&&ps.has(qq.n.v)?C.green:C.line,w:ps.has(o.n.v)&&ps.has(qq.n.v)?3:2}:{fill:o.n.v===tg?C.green:ps.has(o.n.v)?C.greenp:'#fff',stroke:ps.has(o.n.v)?C.green:C.blue,ink:o.n.v===tg?'#fff':C.ink,size:13},15);
  const depth=t=>{let tot=0;(function w(x,d){if(!x)return;tot+=d;w(x.l,d+1);w(x.r,d+1)})(t,1);return tot};
  out+=counter(90,300,'comparisons',tg,C.coral,120)+counter(390,300,'comparisons',p.length,C.green,120);
  out+=TF(300,370,`Average over all ${n} keys: ${fmt((n+1)/2)} in the chain, ${fmt(depth(bt)/n)} in the balanced tree`,13,C.ink);
  return {svg:out,phase:`Finding ${tg} takes ${tg} comparison${tg===1?'':'s'} down the chain but only ${p.length} in the balanced tree. The chain is really a linked list (linear time); the balanced tree halves the search at every level (logarithmic time).`};
 }});

/* ---- Graphs ---- */
const OR_HEX=range(6).map(i=>{const a=(-90+60*i)*Math.PI/180;return [150+105*Math.cos(a),205+105*Math.sin(a)]});
const OR_AM0=['AB','BA','AC','CA','BD','DB','CD','DC','DE','ED','EF','FE'];
SCENE({id:'adjacency-matrix',name:'Adjacency matrix',tag:'A graph as a grid of 0s and 1s',
 definition:'An adjacency matrix stores a graph of n vertices as an n × n grid: the cell in row u, column v is 1 when there is an edge from u to v. For an undirected graph the grid is symmetric; for a directed graph it need not be.',
 example:'Checking “is there an edge from C to D?” is one look-up. But 1,000 vertices need a million cells even if there are only a few thousand edges, which is why sparse graphs usually use adjacency lists.',
 desc:'A graph of six vertices on the left and its six-by-six adjacency matrix on the right; pressing a cell adds or removes that edge in both pictures, and the adjacency list is listed underneath.',
 dur:12,hint:'Press matrix cells to add or remove edges. Switch to directed and notice the grid stops being symmetric.',
 init:()=>({e:OR_AM0.slice(),dir:'u'}),
 watch(p){const k=Math.min(6,Math.floor(p*7));if(p<.75)return {e:OR_AM0.slice(0,k*2),dir:'u'};return {e:['AB','AC','BD','DC','DE','EF','FE'],dir:'d'}},
 ui:[{choose:[['u','Undirected'],['d','Directed']],label:'Edges',get:s=>s.dir,act:'dir'}],
 on:{cell(s,a){const [i,j]=String(a).split(',').map(Number);if(i===j)return 'keep';const u=OR_LET[i],v=OR_LET[j],has=s.e.includes(u+v);
   const tog=k=>{if(has)s.e=s.e.filter(x=>x!==k);else if(!s.e.includes(k))s.e.push(k)};tog(u+v);if(s.dir==='u')tog(v+u)},
  dir(s,v){s.dir=v;if(v==='u'){for(const k of s.e.slice())if(!s.e.includes(k[1]+k[0]))s.e.push(k[1]+k[0])}}},
 draw(s,f,X){
  const has=k=>s.e.includes(k),V=OR_LET.slice(0,6).split(''),dir=s.dir==='d';let out=heading(dir?'Directed: row → column':'Undirected: the grid is symmetric');
  for(let i=0;i<6;i++)for(let j=0;j<6;j++){if(i===j)continue;const k=V[i]+V[j],a=OR_HEX[i],b=OR_HEX[j];if(!has(k))continue;
   if(!dir){if(i<j)out+=L(a[0],a[1],b[0],b[1],C.blue,2.5)}
   else if(has(V[j]+V[i])){const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy);out+=curveArrow(a[0]+dx/d*19,a[1]+dy/d*19,b[0]-dx/d*21,b[1]-dy/d*21,13,C.blue,2.2)}
   else out+=arrowR(a,b,19,21,C.blue,2.4)}
  V.forEach((v,i)=>{const [x,y]=OR_HEX[i];out+=Ci(x,y,18,'#fff',C.blue)+TB(x,y+6,v,16,C.ink)});
  const mx=336,my=86,c=36;V.forEach((v,i)=>{out+=TBF(mx+i*c+c/2,my-8,v,13,C.muted)+TBF(mx-12,my+i*c+c/2+5,v,13,C.muted)});
  for(let i=0;i<6;i++)for(let j=0;j<6;j++){const on=has(V[i]+V[j]),dg=i===j;out+=hit(X,'cell',i+','+j,`Edge ${V[i]} to ${V[j]}: ${on?'present':'absent'}${dg?'':'. Press to toggle.'}`,R(mx+j*c+1,my+i*c+1,c-2,c-2,dg?'#e9eef1':on?C.blue:'#fff',dg?'none':on?C.blue:C.grid,4)+TMF(mx+j*c+c/2,my+i*c+c/2+5,on?1:0,13,on?'#fff':C.muted))}
  const edges=dir?s.e.length:s.e.length/2,lists=V.map(v=>v+': '+V.filter(w=>has(v+w)).join(', ')||v+': —');
  out+=TF(mx,322,lists.slice(0,3).join('   '),13,C.ink,'start','xml:space="preserve"')+TF(mx,342,lists.slice(3).join('   '),13,C.ink,'start','xml:space="preserve"');
  out+=TF(150,364,`matrix: 36 cells · list: ${s.e.length} entries`,13,C.muted);
  return {svg:out,phase:`${edges} edge${edges===1?'':'s'}. The matrix always has 6 × 6 = 36 cells, mostly 0; the adjacency list stores only the ${s.e.length} entries that exist. ${dir?'In a directed graph, A → B does not imply B → A, so row and column can differ.':'Each undirected edge appears twice, once in each direction.'}`};
 }});

const OR_CN={A:[60,110],B:[170,70],C:[270,150],D:[80,260],E:[190,220],F:[300,300],G:[385,90],H:[400,235]};
const OR_CE=['AB','BC','AD','DE','BE','CE','EF','CG','GH','FH','CH'];
const OR_CCOL=[C.blue,C.green,C.purple,C.amber,C.coral,'#4d7f99','#8a6d3b','#5b6b73'];
function OR_comp(on){const par={};for(const v in OR_CN)par[v]=v;const find=v=>par[v]===v?v:(par[v]=find(par[v]));const cyc=new Set();
 OR_CE.forEach((e,i)=>{if(!on[i])return;const a=find(e[0]),b=find(e[1]);if(a===b)cyc.add(i);else par[a]=b});
 const groups={};for(const v in OR_CN){const r=find(v);(groups[r]=groups[r]||[]).push(v)}const comps=Object.values(groups).sort((a,b)=>b.length-a.length||a[0].localeCompare(b[0]));
 const colour={};comps.forEach((g,i)=>g.forEach(v=>colour[v]=OR_CCOL[i%8]));return {comps,cyc,colour}}
SCENE({id:'graph-connectivity',name:'Connectivity and cycles',tag:'Pieces, loops and trees',
 definition:'A graph splits into connected components: groups of vertices joined by paths. A cycle is a path that returns to its start. A connected graph with no cycles is a tree, and a tree on n vertices always has exactly n − 1 edges.',
 example:'Eight vertices need at least 7 edges to be connected. With exactly 7 and no cycles they form a tree; every extra edge creates a cycle.',
 desc:'Eight vertices with switchable edges; vertices are coloured by connected component, edges that close a cycle are dashed orange, and counts of edges, components and cycles are shown with a verdict.',
 dur:12,hint:'Press the small markers to add or remove edges. Try to make a single tree: one colour, no orange edges, 7 edges.',
 init:()=>({on:[1,1,1,1,0,1,1,1,1,0,0]}),
 watch(p){const k=Math.min(OR_CE.length,Math.floor(p*(OR_CE.length+1)));return {on:OR_CE.map((_,i)=>i<k?1:0),k}},
 on:{edge(s,i){i=Number(i);s.on[i]=s.on[i]?0:1}},
 draw(s,f,X){
  const r=OR_comp(s.on),e=s.on.filter(Boolean).length,c=r.comps.length,cycles=e-(8-c),tree=c===1&&cycles===0;let out=heading('Colours are connected pieces');
  OR_CE.forEach((ed,i)=>{const a=OR_CN[ed[0]],b=OR_CN[ed[1]],on=s.on[i],cy=r.cyc.has(i),mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
   out+=L(a[0],a[1],b[0],b[1],on?(cy?C.coral:r.colour[ed[0]]):'#d4dee5',on?3:1.6,on&&cy?'stroke-dasharray="7 5"':on?'':'stroke-dasharray="3 4"');
   out+=hit(X,'edge',i,`Edge ${ed[0]}–${ed[1]}: ${on?'present, press to remove':'absent, press to add'}`,Ci(mx,my,10,'#fff',on?C.line:'#c7d3db')+TBF(mx,my+5,on?'−':'+',13,on?C.muted:C.blue))});
  for(const v in OR_CN){const [x,y]=OR_CN[v];out+=Ci(x,y,19,r.colour[v],'none')+TB(x,y+6,v,16,'#fff')}
  out+=counter(465,52,'edges',e,C.ink,120)+counter(465,106,'components',c,C.blue,120)+counter(465,160,'cycles',cycles,cycles?C.coral:C.green,120);
  const verdict=tree?'A tree ✓':cycles&&c===1?'Connected, with cycles':cycles?'Pieces, with cycles':c>1?'A forest of '+c+' trees':'';
  out+=R(455,226,140,40,tree?C.greenp:'#fff',tree?C.green:C.grid,8)+TF(525,251,verdict,13,tree?C.green:C.ink);
  out+=TF(525,296,'tree: 1 piece and',13,C.muted)+TF(525,314,'n − 1 = 7 edges',13,C.muted);
  out+=TF(240,362,'Dashed orange edges join vertices that were already connected: each makes a cycle.',13,C.muted);
  return {svg:out,phase:`${e} edges, ${c} component${c===1?'':'s'}, ${cycles} independent cycle${cycles===1?'':'s'}. Each edge either joins two pieces (pieces − 1) or closes a cycle; that is why edges − (8 − pieces) counts the cycles.${tree?' One piece and no cycles: a tree.':''}`};
 }});

THREAD({id:'grids-in-memory',name:'Grids stored in a line',ids:['bitmap','array-2d','array-3d']});
THREAD({id:'stack-evaluates',name:'Stacks evaluate expressions',ids:['bracket-matching','postfix-evaluation','compiler']});
THREAD({id:'most-urgent',name:'Serve the most urgent first',ids:['binary-heap','dijkstra','scheduling']});
THREAD({id:'collisions',name:'Collisions and crowding',ids:['hash-spread','linear-probing','load-factor']});
THREAD({id:'doubling',name:'Grow by doubling',ids:['dynamic-array','load-factor']});
THREAD({id:'loops-in-structures',name:'Spotting loops',ids:['cycle-detection','graph-connectivity']});
THREAD({id:'tree-orders',name:'Orders of visiting',ids:['tree-traversal','bfs','dfs']});
