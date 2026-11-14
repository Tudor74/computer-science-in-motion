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
  for(let i=0;i<9;i++){const x=x0+i*(w+g);out+=R(x,120,w,58,'none',C.grid,6,'stroke-dasharray="4 4"')+TM(x+w/2,200,200+4*i,13,C.muted)}
  s.items.forEach((v,i)=>{let x=x0+i*(w+g),y=120;
   if(anim>0){if(i===0)y=120-70*anim;else x=x0+(i-anim)*(w+g)}
   const hl=i===s.read;
   out+=hit(X,'read',i,`Read a[${i}], which holds ${v}`,R(x,y,w,58,hl?C.amberp:i===0&&s.last==='insert at start'?C.coralp:'#fff',hl?C.amber:C.blue,6)+TB(x+w/2,y+37,v,22,C.ink));
   out+=TM(x+w/2,108,'['+i+']',14,hl?C.amber:C.muted);
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
  out+=T(20,334,`${n} keys · 8 buckets · ${coll} collision${coll===1?'':'s'}`,14,C.muted,'start');
  if(s.look)out+=T(580,334,`“${s.look.key}” → bucket ${s.look.bucket} · ${s.look.cmp} comparison${s.look.cmp===1?'':'s'} · ${s.look.found?'found':'not found'}`,14,s.look.found?C.green:C.coral,'end');
  out+=T(300,362,'A linear search would compare against all '+n+' keys.',13,C.muted);
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
  const m=s.edges.length;out+=T(20,362,`${m} edges · degrees add up to ${2*m}, because every edge has two ends`,14,C.muted,'start');
  return {svg:out,phase:s.sel?`${s.sel} selected: press another vertex to add or remove an edge.`:(s.lastEdge?`Edge ${s.lastEdge}. `:'')+'The picture and the adjacency list hold the same information; programs usually store the list.'};
 }});
